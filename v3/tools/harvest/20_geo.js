'use strict';

const fs = require('fs');
const path = require('path');
const {
  OUT_DIR,
  parseCliArgs,
  fetchEntityDetails,
  buildRowsFromDetails,
  writeRawPool,
  appendProgress
} = require('./lib/closed_util');
const { querySparqlPaged, val, qidOf } = require('./lib/sparql');

const POOLS_PATH = path.join(__dirname, 'pools.json');
const LATIN_RE = /^[\p{Script=Latin}\p{N}\s.'’\-&/(),]+$/u;

async function fetchWorldCities(opts) {
  const baseQuery = `
    SELECT DISTINCT ?i ?sl WHERE {
      VALUES ?t { wd:Q515 wd:Q1549591 }
      ?i wdt:P31 ?t ;
         wikibase:sitelinks ?sl .
      FILTER(?sl >= 20)
    } ORDER BY ?i
  `;
  const bindings = await querySparqlPaged(baseQuery, {
    pageSize: 2000,
    maxRows: 10000,
    offline: opts.offline,
    timeoutMs: 40000,
    signal: AbortSignal.timeout(40000)
  });

  const bestByQid = new Map();
  for (const b of bindings) {
    const q = qidOf(val(b, 'i'));
    const sl = parseInt(val(b, 'sl') || '0', 10);
    if (!q) continue;
    if (!bestByQid.has(q) || sl > bestByQid.get(q)) {
      bestByQid.set(q, sl);
    }
  }

  const top3000 = [...bestByQid.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3000)
    .map(([q]) => q);

  const details = await fetchEntityDetails(top3000, ['P571'], opts);
  // Latin olmayan en etiketlerini düşür
  for (const rec of details.values()) {
    if (!rec.trLabel && rec.enLabel && !LATIN_RE.test(rec.enLabel)) {
      rec.enLabel = null;
    }
  }
  const rows = buildRowsFromDetails(details, { allowEnFallback: true });
  rows.sort((a, b) => (b.sl || 0) - (a.sl || 0));
  return rows;
}

function writeGeoDiff() {
  const ilPath = path.join(OUT_DIR, 'raw_tr_il.json');
  const istPath = path.join(OUT_DIR, 'raw_ist_ilce.json');
  const cityPath = path.join(OUT_DIR, 'raw_dunya_sehri.json');

  const ilCount = fs.existsSync(ilPath) ? JSON.parse(fs.readFileSync(ilPath, 'utf8')).rows.length : 'N/A';
  const istCount = fs.existsSync(istPath) ? JSON.parse(fs.readFileSync(istPath, 'utf8')).rows.length : 'N/A';
  const cityCount = fs.existsSync(cityPath) ? JSON.parse(fs.readFileSync(cityPath, 'utf8')).rows.length : 'N/A';

  const lines = [
    '# GEO_DIFF — Coğrafi Havuzlar Resmi vs Wikidata Karşılaştırması',
    '',
    '| Havuz | Resmi / Hedef | Wikidata Satır | Fark | Not |',
    '|---|---:|---:|---:|---|',
    `| tr_il | 81 | ${ilCount} | ${typeof ilCount === 'number' ? ilCount - 81 : 'N/A'} | P31=Q48336, P576 yok |`,
    `| ist_ilce | 39 | ${istCount} | ${typeof istCount === 'number' ? istCount - 39 : 'N/A'} | P31=Q1147395 & P131=Q534799 |`,
    `| dunya_sehri | 3000 | ${cityCount} | ${typeof cityCount === 'number' ? cityCount - 3000 : 'N/A'} | Q515 + Q1549591 (sl>=20, ZIP indirilmedi) |`,
    ''
  ];
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, 'GEO_DIFF.md'), lines.join('\n'), 'utf8');
}

async function main() {
  const args = parseCliArgs(process.argv);
  const poolsDoc = JSON.parse(fs.readFileSync(POOLS_PATH, 'utf8'));
  const pool = poolsDoc.pools.find((p) => p.id === 'dunya_sehri');

  if (args.only && args.only !== 'dunya_sehri') {
    writeGeoDiff();
    return;
  }

  appendProgress('20_geo', `Başladı: ${new Date().toISOString()}`, true);
  const t0 = Date.now();
  try {
    const rows = await fetchWorldCities({ offline: args.offline });
    writeRawPool('dunya_sehri', pool.mode, pool.target, ['wikidata'], rows);

    const classesPath = path.join(OUT_DIR, 'classes_f3_C.json');
    const classesDoc = fs.existsSync(classesPath) ? JSON.parse(fs.readFileSync(classesPath, 'utf8')) : {};
    classesDoc.dunya_sehri = { no: pool.no, q: 'Q515+Q1549591', label: 'şehir/büyük şehir (sl>=20)', count: rows.length };
    fs.writeFileSync(classesPath, JSON.stringify(classesDoc, null, 2) + '\n', 'utf8');

    writeGeoDiff();
    const sec = ((Date.now() - t0) / 1000).toFixed(1);
    const line = `- dunya_sehri: ${rows.length} satır (target: ${pool.target}) — OK [${sec}s]`;
    console.log(line);
    appendProgress('20_geo', line);
  } catch (err) {
    const sec = ((Date.now() - t0) / 1000).toFixed(1);
    const line = `- dunya_sehri: HATA (${err.message}) [${sec}s]`;
    console.error(line);
    appendProgress('20_geo', line);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
