'use strict';

const fs = require('fs');
const path = require('path');
const {
  OUT_DIR,
  parseCliArgs,
  safeSparql,
  fetchEntityDetails,
  buildRowsFromDetails,
  writeRawPool,
  writeMissing,
  appendProgress
} = require('./lib/closed_util');
const { val, qidOf } = require('./lib/sparql');
const { pickMinYear } = require('./lib/years');

const POOLS_PATH = path.join(__dirname, 'pools.json');

async function fetchQids(sparql, opts) {
  const rows = await safeSparql(sparql, opts);
  const qids = [];
  const seen = new Set();
  for (const r of rows) {
    const q = qidOf(val(r, 'i'));
    if (q && !seen.has(q)) {
      seen.add(q);
      qids.push(q);
    }
  }
  return qids;
}

/**
 * P39 göreve başlama yılı (P580 niteleyicisi) haritasını çeker.
 */
async function fetchP39StartYears(qids, positionQid, opts) {
  const map = new Map();
  for (let i = 0; i < qids.length; i += 60) {
    const chunk = qids.slice(i, i + 60);
    const values = chunk.map((q) => `wd:${q}`).join(' ');
    const q = `
      SELECT ?i ?start WHERE {
        VALUES ?i { ${values} }
        ?i p:P39 ?st .
        ?st ps:P39 wd:${positionQid} ;
            pq:P580 ?start .
      }
    `;
    const rows = await safeSparql(q, opts);
    for (const r of rows) {
      const id = qidOf(val(r, 'i'));
      const st = val(r, 'start');
      if (id && st) {
        if (!map.has(id)) map.set(id, []);
        map.get(id).push(st);
      }
    }
  }
  return map;
}

async function runPool(pool, opts, classesDoc) {
  const id = pool.id;

  if (id === 'gezegen' || id === 'dk_sampiyon') {
    writeRawPool(id, pool.mode, pool.expect, ['manual'], []);
    writeMissing(id, [`# ${id}`, `expect: ${pool.expect}`, `durum: manual (F4'te elle doldurulacak)`]);
    return { count: 0, expect: pool.expect, status: 'manual (bos raw)' };
  }

  if (id === 'ist_ilce') {
    const qids = await fetchQids(`
      SELECT DISTINCT ?i WHERE {
        ?i wdt:P31 wd:Q1147395 ;
           wdt:P131 wd:Q534799 .
        FILTER NOT EXISTS { ?i wdt:P576 ?end }
      }
    `, opts);
    const details = await fetchEntityDetails(qids, ['P571'], opts);
    const rows = buildRowsFromDetails(details);
    writeRawPool(id, pool.mode, pool.expect, ['wikidata'], rows);
    classesDoc[id] = { no: pool.no, q: 'Q1147395', label: 'ilçe (P131=Q534799)', count: rows.length };
    if (rows.length !== pool.expect) {
      writeMissing(id, [
        `# ist_ilce`,
        `expect: ${pool.expect}, got: ${rows.length}, diff: ${rows.length - pool.expect}`,
        `eksik ${Math.max(0, pool.expect - rows.length)}, F4 manual`,
        '',
        ...rows.map((r) => `${r.label} (${r.src})`)
      ]);
    }
    return { count: rows.length, expect: pool.expect, status: rows.length === pool.expect ? 'OK' : `FARK (${rows.length - pool.expect})` };
  }

  if (id === 'tr_il') {
    const qids = await fetchQids(`
      SELECT DISTINCT ?i WHERE {
        ?i wdt:P31 wd:Q48336 .
        FILTER NOT EXISTS { ?i wdt:P576 ?end }
      }
    `, opts);
    const details = await fetchEntityDetails(qids, ['P571'], opts);
    const rows = buildRowsFromDetails(details);
    writeRawPool(id, pool.mode, pool.expect, ['wikidata'], rows);
    classesDoc[id] = { no: pool.no, q: 'Q48336', label: 'Türkiye ili', count: rows.length };
    if (rows.length !== pool.expect) {
      writeMissing(id, [
        `# tr_il`,
        `expect: ${pool.expect}, got: ${rows.length}, diff: ${rows.length - pool.expect}`,
        ...rows.map((r) => `${r.label} (${r.src})`)
      ]);
    }
    return { count: rows.length, expect: pool.expect, status: rows.length === pool.expect ? 'OK' : `FARK (${rows.length - pool.expect})` };
  }

  if (id === 'ulke') {
    const qids = await fetchQids(`
      SELECT DISTINCT ?i WHERE {
        ?i wdt:P31 wd:Q3624078 .
        FILTER NOT EXISTS { ?i wdt:P576 ?end }
      }
    `, opts);
    // BM üyesi (P463=Q1065) + gözlemciler (Vatikan Q237, Filistin Q219060)
    const unQids = new Set(await fetchQids(`
      SELECT DISTINCT ?i WHERE {
        ?i wdt:P31 wd:Q3624078 ;
           wdt:P463 wd:Q1065 .
        FILTER NOT EXISTS { ?i wdt:P576 ?end }
      }
    `, opts));
    unQids.add('Q237');
    unQids.add('Q219060');

    const details = await fetchEntityDetails(qids, ['P571'], opts);
    const allRows = buildRowsFromDetails(details, { allowEnFallback: true });
    const rows = [];
    const excluded = [];
    for (const r of allRows) {
      if (unQids.has(r.src)) rows.push(r);
      else excluded.push(r);
    }

    writeRawPool(id, pool.mode, pool.expect, ['wikidata'], rows, { excluded });
    classesDoc[id] = { no: pool.no, q: 'Q3624078', label: 'egemen devlet (BM+2 gözlemci)', count: rows.length };

    if (rows.length !== pool.expect || excluded.length > 0) {
      writeMissing(id, [
        `# ulke`,
        `expect: ${pool.expect}, rows: ${rows.length}, excluded: ${excluded.length}`,
        '',
        '## fazla (excluded):',
        ...excluded.map((r) => `fazla: ${r.label} (${r.src})`)
      ]);
    }
    return { count: rows.length, expect: pool.expect, status: `${rows.length} (+${excluded.length} excluded)` };
  }

  if (id === 'baskent') {
    const ulkePath = path.join(OUT_DIR, 'raw_ulke.json');
    if (!fs.existsSync(ulkePath)) {
      throw new Error('raw_ulke.json bulunamadı; önce ulke havuzu çalıştırılmalı');
    }
    const ulkeData = JSON.parse(fs.readFileSync(ulkePath, 'utf8'));
    const countryQids = ulkeData.rows.map((r) => r.src).filter((q) => /^Q\d+$/.test(q));
    const capQids = [];
    const seen = new Set();

    for (let i = 0; i < countryQids.length; i += 60) {
      const chunk = countryQids.slice(i, i + 60);
      const values = chunk.map((q) => `wd:${q}`).join(' ');
      const res = await safeSparql(`
        SELECT DISTINCT ?i WHERE {
          VALUES ?c { ${values} }
          ?c p:P36 ?st .
          ?st ps:P36 ?i .
          FILTER NOT EXISTS { ?st pq:P582 ?end }
        }
      `, opts);
      for (const r of res) {
        const q = qidOf(val(r, 'i'));
        if (q && !seen.has(q)) {
          seen.add(q);
          capQids.push(q);
        }
      }
    }

    const details = await fetchEntityDetails(capQids, ['P571'], opts);
    const rows = buildRowsFromDetails(details, { allowEnFallback: true });
    writeRawPool(id, pool.mode, rows.length, ['wikidata'], rows);
    classesDoc[id] = { no: pool.no, q: 'P36', label: 'ulke P36 başkentleri', count: rows.length };
    return { count: rows.length, expect: rows.length, status: 'OK' };
  }

  if (id === 'super_lig') {
    const qids = await fetchQids(`
      SELECT DISTINCT ?i WHERE {
        ?i wdt:P31 wd:Q476028 ;
           wdt:P17 wd:Q43 .
        FILTER NOT EXISTS { ?i wdt:P576 ?end }
      }
    `, opts);
    const details = await fetchEntityDetails(qids, ['P571'], opts);
    const rows = buildRowsFromDetails(details);
    writeRawPool(id, pool.mode, pool.expect, ['wikidata'], rows);
    classesDoc[id] = { no: pool.no, q: 'Q476028', label: 'futbol kulübü (P17=Q43 adayları)', count: rows.length };
    writeMissing(id, [
      `# super_lig`,
      `expect: ${pool.expect}, aday: ${rows.length}, diff: ${rows.length - pool.expect}`,
      `not: kesin 18 takım F4 manual'de belirlenir`
    ]);
    return { count: rows.length, expect: pool.expect, status: `aday (${rows.length})` };
  }

  if (id === 'para_birimi') {
    const qids = await fetchQids(`
      SELECT DISTINCT ?i WHERE {
        ?i wdt:P31 wd:Q8142 .
        FILTER NOT EXISTS { ?i wdt:P576 ?end }
      }
    `, opts);
    const details = await fetchEntityDetails(qids, ['P571'], opts);
    const rows = buildRowsFromDetails(details);
    writeRawPool(id, pool.mode, rows.length, ['wikidata'], rows);
    classesDoc[id] = { no: pool.no, q: 'Q8142', label: 'para birimi (P576 yok)', count: rows.length };
    writeMissing(id, [
      `# para_birimi`,
      `expect: probe sonrası, got: ${rows.length}`,
      `tr etiketi olmayan QID sayısı: ${qids.length - rows.length}`
    ]);
    return { count: rows.length, expect: rows.length, status: 'OK' };
  }

  if (id === 'pixar') {
    const qids = await fetchQids(`
      SELECT DISTINCT ?i WHERE {
        VALUES ?t { wd:Q11424 wd:Q202866 }
        ?i wdt:P31 ?t ;
           wdt:P272 wd:Q127552 .
        FILTER NOT EXISTS { ?i wdt:P31 wd:Q24862 }
      }
    `, opts);
    const details = await fetchEntityDetails(qids, ['P577'], opts);
    const rows = buildRowsFromDetails(details, { allowEnFallback: true });
    writeRawPool(id, pool.mode, 29, ['wikidata'], rows);
    classesDoc[id] = { no: pool.no, q: 'Q11424/Q202866+P272=Q127552', label: 'Pixar filmi', count: rows.length };
    if (rows.length !== 29) {
      writeMissing(id, [
        `# pixar`,
        `expect: ~29, got: ${rows.length}, diff: ${rows.length - 29}`,
        '',
        ...rows.map((r) => `${r.label} (${r.year || 'null'}, ${r.src})`)
      ]);
    }
    return { count: rows.length, expect: '~29', status: rows.length === 29 ? 'OK' : `FARK (${rows.length - 29})` };
  }

  if (id === 'element') {
    const qids = await fetchQids(`
      SELECT DISTINCT ?i WHERE {
        ?i wdt:P31 wd:Q11344 .
      }
    `, opts);
    const details = await fetchEntityDetails(qids, ['P575'], opts);
    const rows = buildRowsFromDetails(details);
    writeRawPool(id, pool.mode, pool.expect, ['wikidata'], rows);
    classesDoc[id] = { no: pool.no, q: 'Q11344', label: 'kimyasal element', count: rows.length };
    if (rows.length !== pool.expect) {
      writeMissing(id, [
        `# element`,
        `expect: ${pool.expect}, got: ${rows.length}, diff: ${rows.length - pool.expect}`,
        ...rows.map((r) => `${r.label} (${r.src})`)
      ]);
    }
    return { count: rows.length, expect: pool.expect, status: rows.length === pool.expect ? 'OK' : `FARK (${rows.length - pool.expect})` };
  }

  if (id === 'osmanli_padisahi') {
    const qids = await fetchQids(`
      SELECT DISTINCT ?i WHERE {
        ?i wdt:P39 wd:Q15315411 .
      }
    `, opts);
    const details = await fetchEntityDetails(qids, [], opts);
    const p39Years = await fetchP39StartYears(qids, 'Q15315411', opts);
    for (const [q, ys] of p39Years.entries()) {
      if (details.has(q)) details.get(q).years = ys;
    }
    const rows = buildRowsFromDetails(details);
    writeRawPool(id, pool.mode, pool.expect, ['wikidata'], rows);
    classesDoc[id] = { no: pool.no, q: 'P39=Q15315411', label: 'Osmanlı padişahı', count: rows.length };
    if (rows.length !== pool.expect) {
      writeMissing(id, [
        `# osmanli_padisahi`,
        `expect: ${pool.expect}, got: ${rows.length}, diff: ${rows.length - pool.expect}`,
        ...rows.map((r) => `${r.label} (${r.year || 'null'}, ${r.src})`)
      ]);
    }
    return { count: rows.length, expect: pool.expect, status: rows.length === pool.expect ? 'OK' : `FARK (${rows.length - pool.expect})` };
  }

  if (id === 'cumhurbaskani') {
    const qids = await fetchQids(`
      SELECT DISTINCT ?i WHERE {
        ?i wdt:P39 wd:Q1922067 .
      }
    `, opts);
    const details = await fetchEntityDetails(qids, [], opts);
    const p39Years = await fetchP39StartYears(qids, 'Q1922067', opts);
    for (const [q, ys] of p39Years.entries()) {
      if (details.has(q)) details.get(q).years = ys;
    }
    const rows = buildRowsFromDetails(details);
    writeRawPool(id, pool.mode, 12, ['wikidata'], rows);
    classesDoc[id] = { no: pool.no, q: 'P39=Q1922067', label: 'Türkiye cumhurbaşkanı', count: rows.length };
    if (rows.length !== 12) {
      writeMissing(id, [
        `# cumhurbaskani`,
        `expect: 12, got: ${rows.length}, diff: ${rows.length - 12}`,
        ...rows.map((r) => `${r.label} (${r.year || 'null'}, ${r.src})`)
      ]);
    }
    return { count: rows.length, expect: 12, status: rows.length === 12 ? 'OK' : `FARK (${rows.length - 12})` };
  }

  if (id === 'universite') {
    const qids = await fetchQids(`
      SELECT DISTINCT ?i WHERE {
        VALUES ?t { wd:Q3918 wd:Q875538 wd:Q902104 wd:Q1371037 wd:Q15936437 }
        ?i wdt:P31 ?t ;
           wdt:P17 wd:Q43 .
        FILTER NOT EXISTS { ?i wdt:P576 ?end }
      }
    `, opts);
    const details = await fetchEntityDetails(qids, ['P571'], opts);
    const rows = buildRowsFromDetails(details);
    writeRawPool(id, pool.mode, rows.length, ['wikidata'], rows);
    classesDoc[id] = { no: pool.no, q: 'Q3918/Q875538/Q902104/Q1371037/Q15936437+P17=Q43', label: 'Türkiye üniversitesi', count: rows.length };
    writeMissing(id, [
      `# universite`,
      `expect: YÖK ~208, got: ${rows.length}`,
      `tr etiketi olmayan QID sayısı: ${qids.length - rows.length}`
    ]);
    return { count: rows.length, expect: '~208', status: `OK (${rows.length})` };
  }

  if (id === 'olimpiyat_sehri') {
    const res = await safeSparql(`
      SELECT DISTINCT ?i ?y WHERE {
        ?e wdt:P31 wd:Q135976384 ;
           wdt:P276 ?i .
        OPTIONAL { ?e wdt:P585 ?y }
      }
    `, opts);
    const qids = [];
    const yearsMap = new Map();
    for (const r of res) {
      const q = qidOf(val(r, 'i'));
      const y = val(r, 'y');
      if (!q) continue;
      if (!yearsMap.has(q)) {
        yearsMap.set(q, []);
        qids.push(q);
      }
      if (y) yearsMap.get(q).push(y);
    }
    const details = await fetchEntityDetails(qids, [], opts);
    for (const [q, ys] of yearsMap.entries()) {
      if (details.has(q)) details.get(q).years = ys;
    }
    const rows = buildRowsFromDetails(details);
    writeRawPool(id, pool.mode, rows.length, ['wikidata'], rows);
    classesDoc[id] = { no: pool.no, q: 'Q135976384->P276', label: 'Yaz Olimpiyatları ev sahibi şehir', count: rows.length };
    writeMissing(id, [
      `# olimpiyat_sehri`,
      `expect: probe sonrası, got: ${rows.length}`,
      ...rows.map((r) => `${r.label} (${r.year || 'null'}, ${r.src})`)
    ]);
    return { count: rows.length, expect: rows.length, status: 'OK' };
  }

  return { count: 0, expect: pool.expect, status: 'ATLANDI' };
}

async function main() {
  const args = parseCliArgs(process.argv);
  const poolsDoc = JSON.parse(fs.readFileSync(POOLS_PATH, 'utf8'));
  const targets = poolsDoc.pools.filter((p) => p.worker === 'C' && p.id !== 'dunya_sehri');
  const filtered = args.only ? targets.filter((p) => p.id === args.only) : targets;

  const classesPath = path.join(OUT_DIR, 'classes_f3_C.json');
  let classesDoc = fs.existsSync(classesPath) ? JSON.parse(fs.readFileSync(classesPath, 'utf8')) : {};

  appendProgress('10_closed', `Başladı: ${new Date().toISOString()} (${filtered.length} havuz)`, !args.only);

  for (const pool of filtered) {
    const t0 = Date.now();
    try {
      const res = await runPool(pool, { offline: args.offline }, classesDoc);
      const sec = ((Date.now() - t0) / 1000).toFixed(1);
      const line = `- ${pool.id}: ${res.count} satır (expect: ${res.expect}) — ${res.status} [${sec}s]`;
      console.log(line);
      appendProgress('10_closed', line);
    } catch (err) {
      const sec = ((Date.now() - t0) / 1000).toFixed(1);
      const line = `- ${pool.id}: HATA (${err.message}) [${sec}s]`;
      console.error(line);
      appendProgress('10_closed', line);
    }
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(classesPath, JSON.stringify(classesDoc, null, 2) + '\n', 'utf8');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
