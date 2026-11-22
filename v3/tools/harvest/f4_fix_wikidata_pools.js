'use strict';

const fs = require('fs');
const path = require('path');
const { cachedFetchJson } = require('./lib/http');
const { pickMinYear, isValidYear } = require('./lib/years');

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

async function sparql(query) {
  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;
  const json = await cachedFetchJson(url, { timeoutMs: 45000 });
  return (json && json.results && json.results.bindings) || [];
}

async function fixDunyaSehri(outDir, manualDir) {
  console.log('[dunya_sehri] fetching big cities / capitals / city-states (sl >= 25)...');
  const q1 = `SELECT ?i ?sl ?tr ?en ?y WHERE {
    VALUES ?cls { wd:Q1549591 wd:Q5119 wd:Q1637706 }
    ?i wdt:P31 ?cls .
    ?i wikibase:sitelinks ?sl .
    FILTER(?sl >= 25)
    OPTIONAL { ?i rdfs:label ?tr FILTER(LANG(?tr)="tr") }
    OPTIONAL { ?i rdfs:label ?en FILTER(LANG(?en)="en") }
    OPTIONAL { ?i wdt:P571 ?y }
  } LIMIT 2500`;
  const rows = await sparql(q1);
  const byQid = new Map();
  for (const b of rows) {
    const m = (b.i && b.i.value || '').match(/\/(Q\d+)$/);
    if (!m) continue;
    const qid = m[1];
    if (!byQid.has(qid)) {
      byQid.set(qid, {
        qid,
        tr: b.tr ? b.tr.value : null,
        en: b.en ? b.en.value : null,
        sl: b.sl ? parseInt(b.sl.value, 10) : 0,
        dates: []
      });
    }
    const rec = byQid.get(qid);
    if (!rec.tr && b.tr) rec.tr = b.tr.value;
    if (!rec.en && b.en) rec.en = b.en.value;
    if (b.y && b.y.value) rec.dates.push(b.y.value);
  }

  const extraRows = [];
  for (const rec of byQid.values()) {
    const label = rec.tr || rec.en;
    if (!label) continue;
    const aliases = [];
    if (rec.en && rec.tr && rec.en.toLowerCase() !== rec.tr.toLowerCase()) aliases.push(rec.en);
    const picked = pickMinYear(rec.dates);
    extraRows.push({
      label,
      aliases,
      year: (picked.year !== null && isValidYear(picked.year, 2026)) ? picked.year : null,
      approx: picked.approx,
      src: rec.qid,
      sl: rec.sl
    });
  }

  fs.writeFileSync(path.join(outDir, 'raw_dunya_sehri_extra.json'), JSON.stringify({ pool: 'dunya_sehri', rows: extraRows }, null, 2), 'utf8');

  const raw = JSON.parse(fs.readFileSync(path.join(outDir, 'raw_dunya_sehri.json'), 'utf8'));
  const existingQids = new Set((raw.rows || []).map((r) => (r.src || '').toUpperCase()));
  const existingLabels = new Set((raw.rows || []).map((r) => (r.label || '').toLowerCase()));

  const manualPath = path.join(manualDir, 'dunya_sehri.js');
  const manual = loadManual(manualPath);
  const manualLabels = new Set(manual.add.map((a) => (a.label || '').toLowerCase()));

  let added = 0;
  for (const r of extraRows) {
    if (existingQids.has(r.src) || existingLabels.has(r.label.toLowerCase()) || manualLabels.has(r.label.toLowerCase())) continue;
    manual.add.push({
      label: r.label,
      aliases: r.aliases,
      year: r.year,
      approx: r.approx,
      src: r.src,
      sl: r.sl,
      note: 'Wikidata buyuk sehir/baskent eklemesi (f4_fix)'
    });
    manualLabels.add(r.label.toLowerCase());
    added++;
  }
  saveManual(manualPath, 'dunya_sehri', manual);
  console.log(`[dunya_sehri] extra=${extraRows.length}, added to manual=${added}`);
}

async function fixFilm(outDir, manualDir) {
  console.log('[film] fetching top films (sl >= 45)...');
  const q1 = `SELECT ?i ?sl ?tr ?en ?y WHERE {
    ?i wdt:P31 wd:Q11424 .
    ?i wikibase:sitelinks ?sl .
    FILTER(?sl >= 45)
    OPTIONAL { ?i rdfs:label ?tr FILTER(LANG(?tr)="tr") }
    OPTIONAL { ?i rdfs:label ?en FILTER(LANG(?en)="en") }
    OPTIONAL { ?i wdt:P577 ?y }
  } LIMIT 2500`;
  const rows = await sparql(q1);
  const byQid = new Map();
  for (const b of rows) {
    const m = (b.i && b.i.value || '').match(/\/(Q\d+)$/);
    if (!m) continue;
    const qid = m[1];
    if (!byQid.has(qid)) {
      byQid.set(qid, {
        qid,
        tr: b.tr ? b.tr.value : null,
        en: b.en ? b.en.value : null,
        sl: b.sl ? parseInt(b.sl.value, 10) : 0,
        dates: []
      });
    }
    const rec = byQid.get(qid);
    if (!rec.tr && b.tr) rec.tr = b.tr.value;
    if (!rec.en && b.en) rec.en = b.en.value;
    if (b.y && b.y.value) rec.dates.push(b.y.value);
  }

  const extraRows = [];
  for (const rec of byQid.values()) {
    const label = rec.tr || rec.en;
    if (!label) continue;
    const aliases = [];
    if (rec.en && rec.tr && rec.en.toLowerCase() !== rec.tr.toLowerCase()) aliases.push(rec.en);
    const picked = pickMinYear(rec.dates);
    extraRows.push({
      label,
      aliases,
      year: (picked.year !== null && isValidYear(picked.year, 2026)) ? picked.year : null,
      approx: picked.approx,
      src: rec.qid,
      sl: rec.sl
    });
  }

  fs.writeFileSync(path.join(outDir, 'raw_film_extra.json'), JSON.stringify({ pool: 'film', rows: extraRows }, null, 2), 'utf8');

  const raw = JSON.parse(fs.readFileSync(path.join(outDir, 'raw_film.json'), 'utf8'));
  const existingQids = new Set((raw.rows || []).map((r) => (r.src || '').toUpperCase()));
  const existingLabels = new Set((raw.rows || []).map((r) => (r.label || '').toLowerCase()));

  const manualPath = path.join(manualDir, 'film.js');
  const manual = loadManual(manualPath);
  const manualLabels = new Set(manual.add.map((a) => (a.label || '').toLowerCase()));

  let added = 0;
  for (const r of extraRows) {
    if (existingQids.has(r.src) || existingLabels.has(r.label.toLowerCase()) || manualLabels.has(r.label.toLowerCase())) continue;
    manual.add.push({
      label: r.label,
      aliases: r.aliases,
      year: r.year,
      approx: r.approx,
      src: r.src,
      sl: r.sl,
      note: 'Wikidata yuksek sitelink film eklemesi (f4_fix)'
    });
    manualLabels.add(r.label.toLowerCase());
    added++;
  }
  saveManual(manualPath, 'film', manual);
  console.log(`[film] extra=${extraRows.length}, added to manual=${added}`);
}

async function fixHayvan(outDir, manualDir) {
  console.log('[hayvan] checking for non-Animalia (Plantae Q756 / Fungi Q764)...');
  const raw = JSON.parse(fs.readFileSync(path.join(outDir, 'raw_hayvan.json'), 'utf8'));
  const qids = (raw.rows || []).map((r) => (r.src || '').toUpperCase()).filter((q) => /^Q\d+$/.test(q));

  const badQids = new Set();
  const batchSize = 50;
  for (let i = 0; i < qids.length; i += batchSize) {
    const batch = qids.slice(i, i + batchSize);
    const values = batch.map((q) => `wd:${q}`).join(' ');
    const query = `SELECT DISTINCT ?i WHERE {
      VALUES ?i { ${values} }
      { ?i (wdt:P171)+ wd:Q756 } UNION { ?i (wdt:P171)+ wd:Q764 }
    }`;
    try {
      const res = await sparql(query);
      for (const b of res) {
        const m = (b.i && b.i.value || '').match(/\/(Q\d+)$/);
        if (m) badQids.add(m[1]);
      }
    } catch (e) {
      console.error(`  hayvan batch ${i} error: ${e.message}`);
    }
  }

  const manualPath = path.join(manualDir, 'hayvan.js');
  const manual = loadManual(manualPath);
  const dropSet = new Set(manual.drop.map((d) => String(d).toLowerCase()));
  let dropped = 0;
  for (const r of raw.rows || []) {
    const q = (r.src || '').toUpperCase();
    if (badQids.has(q) || /^meşe$/i.test(r.label || '')) {
      if (!dropSet.has((r.label || '').toLowerCase())) {
        manual.drop.push(r.label);
        dropSet.add((r.label || '').toLowerCase());
        dropped++;
      }
    }
  }
  saveManual(manualPath, 'hayvan', manual);
  console.log(`[hayvan] badQids=${badQids.size}, newly dropped=${dropped}`);
}

async function main() {
  const outDir = path.join(__dirname, 'out');
  const manualDir = path.resolve(__dirname, '../../data/manual');
  await fixDunyaSehri(outDir, manualDir);
  await fixFilm(outDir, manualDir);
  await fixHayvan(outDir, manualDir);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
