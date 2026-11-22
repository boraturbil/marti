'use strict';

const fs = require('fs');
const path = require('path');
const { cachedFetchJson } = require('./lib/http');
const { pickMinYear, isValidYear } = require('./lib/years');

const TARGET_POOLS = [
  'ist_ilce',
  'para_birimi',
  'tarayici',
  'isletim_sistemi',
  'oyun_konsolu',
  'prog_dili',
  'sosyal_medya',
  'turk_dizisi',
  'uzay_sondasi',
  'sinan_yapisi',
  'ist_muze'
];

const YEAR_PROPS = ['P571', 'P577', 'P575', 'P580', 'P729', 'P1191', 'P1619', 'P2031', 'P7588', 'P619'];

function loadManual(manualPath) {
  if (!fs.existsSync(manualPath)) {
    return {
      verifiedBy: 'agy-hydrogen-f4-g',
      expectNote: '',
      drop: [],
      add: [],
      alias: {},
      year: {}
    };
  }
  delete globalThis.PUSULLA_MANUAL;
  delete require.cache[require.resolve(manualPath)];
  const mod = require(manualPath);
  const store = globalThis.PUSULLA_MANUAL || {};
  const keys = Object.keys(store);
  const obj = keys.length > 0 ? store[keys[0]] : (mod || {});
  return {
    verifiedBy: obj.verifiedBy || 'agy-hydrogen-f4-g',
    expectNote: obj.expectNote || '',
    drop: Array.isArray(obj.drop) ? obj.drop.slice() : [],
    add: Array.isArray(obj.add) ? obj.add.slice() : [],
    alias: obj.alias && typeof obj.alias === 'object' ? { ...obj.alias } : {},
    year: obj.year && typeof obj.year === 'object' ? { ...obj.year } : {}
  };
}

function saveManual(manualPath, poolId, data) {
  const out = [
    "'use strict';",
    '',
    '(function (root) {',
    '  root.PUSULLA_MANUAL = root.PUSULLA_MANUAL || {};',
    `  root.PUSULLA_MANUAL[${JSON.stringify(poolId)}] = ${JSON.stringify(data, null, 2)};`,
    "  if (typeof module !== 'undefined' && module.exports) {",
    '    module.exports = root.PUSULLA_MANUAL;',
    '  }',
    "})(typeof globalThis !== 'undefined' ? globalThis : this);",
    ''
  ].join('\n');
  fs.writeFileSync(manualPath, out, 'utf8');
}

async function queryYearBatch(qids) {
  const values = qids.map((q) => `wd:${q}`).join(' ');
  const propUnion = YEAR_PROPS.map((p) => `{ ?i wdt:${p} ?d }`).join(' UNION ');
  const sparql = `SELECT ?i ?d WHERE { VALUES ?i { ${values} } ${propUnion} }`;
  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(sparql)}`;
  const json = await cachedFetchJson(url, { timeoutMs: 40000 });
  const byQid = new Map();
  const bindings = (json && json.results && json.results.bindings) || [];
  for (const b of bindings) {
    const uri = b.i && b.i.value;
    const d = b.d && b.d.value;
    if (!uri || !d) continue;
    const m = uri.match(/\/(Q\d+)$/);
    if (!m) continue;
    const qid = m[1];
    if (!byQid.has(qid)) byQid.set(qid, []);
    byQid.get(qid).push(d);
  }
  return byQid;
}

async function queryYearsWithFallback(qids) {
  try {
    return await queryYearBatch(qids);
  } catch (err) {
    if (qids.length <= 15) {
      console.error(`  Batch failed (${qids.length}): ${err.message}`);
      return new Map();
    }
    const mid = Math.floor(qids.length / 2);
    const left = await queryYearsWithFallback(qids.slice(0, mid));
    const right = await queryYearsWithFallback(qids.slice(mid));
    for (const [k, v] of right.entries()) left.set(k, v);
    return left;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const onlyIdx = args.indexOf('--only');
  const onlyPool = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
  const pools = onlyPool ? TARGET_POOLS.filter((p) => p === onlyPool) : TARGET_POOLS;

  const outDir = path.join(__dirname, 'out');
  const manualDir = path.resolve(__dirname, '../../data/manual');

  for (const poolId of pools) {
    const rawPath = path.join(outDir, `raw_${poolId}.json`);
    if (!fs.existsSync(rawPath)) continue;
    const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
    const manualPath = path.join(manualDir, `${poolId}.js`);
    const manual = loadManual(manualPath);

    const dropSet = new Set(manual.drop.map((d) => String(typeof d === 'string' ? d : d.label).toLowerCase()));
    const qidToLabels = new Map();
    for (const r of raw.rows || []) {
      if (!r.label || dropSet.has(r.label.toLowerCase())) continue;
      if (typeof r.year === 'number' && Number.isFinite(r.year)) continue;
      if (manual.year[r.label] && typeof manual.year[r.label].year === 'number') continue;
      if (/^Q\d+$/i.test(r.src || '')) {
        const qid = r.src.toUpperCase();
        if (!qidToLabels.has(qid)) qidToLabels.set(qid, []);
        qidToLabels.get(qid).push(r.label);
      }
    }

    const qids = Array.from(qidToLabels.keys());
    console.log(`[${poolId}] querying ${qids.length} yearless QIDs...`);
    let added = 0;
    const batchSize = 80;
    for (let i = 0; i < qids.length; i += batchSize) {
      const batch = qids.slice(i, i + batchSize);
      const res = await queryYearsWithFallback(batch);
      for (const [qid, dates] of res.entries()) {
        const picked = pickMinYear(dates);
        if (picked.year !== null && isValidYear(picked.year, 2026)) {
          for (const lbl of qidToLabels.get(qid) || []) {
            manual.year[lbl] = {
              year: picked.year,
              approx: picked.approx,
              src: qid,
              note: 'Wikidata ek yil ozellikleri (f4_fix_years)'
            };
            added++;
          }
        }
      }
    }

    if (added > 0) {
      saveManual(manualPath, poolId, manual);
    }

    const activeRows = (raw.rows || []).filter((r) => !dropSet.has((r.label || '').toLowerCase()));
    const withYearAfter = activeRows.filter(
      (r) => (typeof r.year === 'number' && Number.isFinite(r.year)) || (manual.year[r.label] && typeof manual.year[r.label].year === 'number')
    ).length;
    console.log(`[${poolId}] added ${added} years -> ${withYearAfter}/${activeRows.length} (${((withYearAfter / Math.max(1, activeRows.length)) * 100).toFixed(1)}%)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
