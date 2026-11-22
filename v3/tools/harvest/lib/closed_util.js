'use strict';

const fs = require('fs');
const path = require('path');
const { cachedFetchJson, hashKey } = require('./http');
const { querySparql, val, qidOf } = require('./sparql');
const { filterAliases } = require('./aliasfilter');
const { fold } = require('./normalize');
const { pickMinYear } = require('./years');

const OUT_DIR = path.resolve(__dirname, '..', 'out');

function parseCliArgs(argv) {
  const args = { only: null, offline: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--only' && argv[i + 1]) {
      args.only = argv[++i];
    } else if (argv[i] === '--offline') {
      args.offline = true;
    }
  }
  return args;
}

/**
 * Wikidata wbsearchentities ile tohum adından QID adayları bulur.
 */
async function wbSearch(search, lang = 'tr', opts = {}) {
  const qs = new URLSearchParams({
    action: 'wbsearchentities',
    search,
    language: lang,
    format: 'json',
    limit: '5'
  }).toString();
  const url = `https://www.wikidata.org/w/api.php?${qs}`;
  const data = await cachedFetchJson(url, {
    cacheKey: 'wbs_' + hashKey(qs),
    offline: opts.offline,
    signal: opts.signal || AbortSignal.timeout(40000),
    timeoutMs: 40000
  });
  return (data && data.search) || [];
}

/**
 * 40 sn zaman aşımı ile SPARQL sorgusu çalıştırır; başarısızsa 1 kez yeniden dener.
 */
async function safeSparql(sparql, opts = {}) {
  const timeoutMs = opts.timeoutMs || 40000;
  try {
    return await querySparql(sparql, {
      ...opts,
      timeoutMs,
      signal: AbortSignal.timeout(timeoutMs)
    });
  } catch (err) {
    if (opts.offline) throw err;
    return await querySparql(sparql, {
      ...opts,
      timeoutMs,
      signal: AbortSignal.timeout(timeoutMs)
    });
  }
}

/**
 * Verilen QID listesi için belirtilen özelliğin (varsayılan P31) değer dağılımını döndürür.
 */
async function getPropDistribution(qids, prop = 'P31', opts = {}) {
  if (!qids || qids.length === 0) return [];
  const values = qids.map((q) => `wd:${q}`).join(' ');
  const q = `
    SELECT ?t (COUNT(DISTINCT ?i) AS ?n) WHERE {
      VALUES ?i { ${values} }
      ?i wdt:${prop} ?t .
    } GROUP BY ?t ORDER BY DESC(?n)
  `;
  const rows = await safeSparql(q, opts);
  const items = rows
    .map((r) => ({ qid: qidOf(val(r, 't')), count: parseInt(val(r, 'n') || '0', 10) }))
    .filter((x) => x.qid);

  if (items.length === 0) return [];
  const labels = await fetchSimpleLabels(items.map((x) => x.qid), opts);
  return items.map((x) => ({
    qid: x.qid,
    label: labels[x.qid] || x.qid,
    count: x.count
  }));
}

/**
 * Küçük QID listesi için tr/en etiket haritası döndürür.
 */
async function fetchSimpleLabels(qids, opts = {}) {
  const out = {};
  const unique = [...new Set(qids.filter(Boolean))];
  for (let i = 0; i < unique.length; i += 80) {
    const chunk = unique.slice(i, i + 80);
    const values = chunk.map((q) => `wd:${q}`).join(' ');
    const q = `
      SELECT ?i ?tr ?en WHERE {
        VALUES ?i { ${values} }
        OPTIONAL { ?i rdfs:label ?tr FILTER(LANG(?tr)="tr") }
        OPTIONAL { ?i rdfs:label ?en FILTER(LANG(?en)="en") }
      }
    `;
    const rows = await safeSparql(q, opts);
    for (const r of rows) {
      const id = qidOf(val(r, 'i'));
      if (id) out[id] = val(r, 'tr') || val(r, 'en') || id;
    }
  }
  return out;
}

/**
 * VALUES ?i { ... } gruplarıyla etiket (tr, en), altLabel (tr), sitelinks, trwiki ve yıl özelliklerini çeker.
 * Hata durumunda grup boyutunu yarıya indirerek 1 kez yeniden dener.
 */
async function fetchEntityDetails(qids, yearProps = [], opts = {}) {
  const unique = [...new Set(qids.filter(Boolean))];
  const map = new Map();
  for (const q of unique) {
    map.set(q, {
      qid: q,
      trLabel: null,
      enLabel: null,
      trAliases: new Set(),
      years: [],
      sl: 0,
      trwiki: null
    });
  }

  async function runChunk(chunk, canSplit) {
    const values = chunk.map((q) => `wd:${q}`).join(' ');
    const yearOpts = (yearProps || [])
      .map((p, idx) => `OPTIONAL { ?i wdt:${p} ?y${idx} . }`)
      .join('\n      ');
    const yearVars = (yearProps || []).map((_, idx) => `?y${idx}`).join(' ');

    const q = `
      SELECT ?i ?tr ?en ?sl ?trt ${yearVars} WHERE {
        VALUES ?i { ${values} }
        OPTIONAL { ?i rdfs:label ?tr FILTER(LANG(?tr)="tr") }
        OPTIONAL { ?i rdfs:label ?en FILTER(LANG(?en)="en") }
        OPTIONAL { ?i wikibase:sitelinks ?sl . }
        OPTIONAL { ?w schema:about ?i ; schema:isPartOf <https://tr.wikipedia.org/> ; schema:name ?trt . }
        ${yearOpts}
      }
    `;
    let rows;
    try {
      rows = await querySparql(q, {
        ...opts,
        timeoutMs: 40000,
        signal: AbortSignal.timeout(40000)
      });
    } catch (err) {
      if (canSplit && chunk.length > 10 && !opts.offline) {
        const mid = Math.ceil(chunk.length / 2);
        await runChunk(chunk.slice(0, mid), false);
        await runChunk(chunk.slice(mid), false);
        return;
      }
      throw err;
    }

    for (const r of rows) {
      const id = qidOf(val(r, 'i'));
      const rec = map.get(id);
      if (!rec) continue;
      const tr = val(r, 'tr');
      const en = val(r, 'en');
      const sl = parseInt(val(r, 'sl') || '0', 10);
      const trt = val(r, 'trt');
      if (tr && !rec.trLabel) rec.trLabel = tr;
      if (en && !rec.enLabel) rec.enLabel = en;
      if (Number.isFinite(sl) && sl > rec.sl) rec.sl = sl;
      if (trt && !rec.trwiki) rec.trwiki = trt;
      for (let idx = 0; idx < (yearProps || []).length; idx++) {
        const yv = val(r, `y${idx}`);
        if (yv) rec.years.push(yv);
      }
    }

    // Türkçe altLabel'lar için ayrı hafif sorgu (GROUP_CONCAT şişmesini önler)
    const aq = `
      SELECT ?i ?alt WHERE {
        VALUES ?i { ${values} }
        ?i skos:altLabel ?alt FILTER(LANG(?alt)="tr") .
      }
    `;
    try {
      const arows = await querySparql(aq, {
        ...opts,
        timeoutMs: 40000,
        signal: AbortSignal.timeout(40000)
      });
      for (const r of arows) {
        const id = qidOf(val(r, 'i'));
        const rec = map.get(id);
        const alt = val(r, 'alt');
        if (rec && alt) rec.trAliases.add(alt);
      }
    } catch (_) {
      // AltLabel sorgusu başarısız olursa ana satırları bozma
    }
  }

  const batchSize = opts.batchSize || 60;
  for (let i = 0; i < unique.length; i += batchSize) {
    await runChunk(unique.slice(i, i + batchSize), true);
  }

  return map;
}

/**
 * Detay haritasından standart Pusulla raw satırlarını üretir.
 */
function buildRowsFromDetails(detailsMap, opts = {}) {
  const allowEnFallback = Boolean(opts.allowEnFallback);
  const rawEntries = [];
  for (const rec of detailsMap.values()) {
    const label = rec.trLabel || (allowEnFallback ? rec.enLabel : null);
    if (!label) continue;
    rawEntries.push({ rec, label });
  }

  const allLabelsFold = new Set(rawEntries.map((e) => fold(e.label)));
  const seenQids = new Set();
  const rows = [];

  for (const { rec, label } of rawEntries) {
    if (seenQids.has(rec.qid)) continue;
    seenQids.add(rec.qid);

    const candidateAliases = [...rec.trAliases];
    if (rec.trwiki && rec.trwiki !== label) {
      candidateAliases.push(rec.trwiki);
    }
    if (opts.extraAliasesFn) {
      for (const a of opts.extraAliasesFn(rec, label) || []) {
        candidateAliases.push(a);
      }
    }

    const { accepted } = filterAliases(label, candidateAliases, allLabelsFold);
    const { year, approx } = pickMinYear(rec.years);

    rows.push({
      label,
      aliases: accepted,
      year,
      approx,
      src: rec.qid,
      sl: rec.sl || 0
    });
  }

  return rows;
}

function writeRawPool(poolId, mode, expect, source, rows, extra = {}) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const payload = {
    pool: poolId,
    mode,
    expect,
    source,
    rows,
    ...extra
  };
  const outPath = path.join(OUT_DIR, `raw_${poolId}.json`);
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  return outPath;
}

function writeMissing(poolId, lines) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `MISSING_${poolId}.txt`);
  const content = Array.isArray(lines) ? lines.join('\n') + '\n' : String(lines) + '\n';
  fs.writeFileSync(outPath, content, 'utf8');
  return outPath;
}

function appendProgress(scriptName, line, reset = false) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `${scriptName}.md`);
  if (reset || !fs.existsSync(outPath)) {
    fs.writeFileSync(outPath, `# ${scriptName} ilerleme\n\n${line}\n`, 'utf8');
  } else {
    fs.appendFileSync(outPath, `${line}\n`, 'utf8');
  }
}

module.exports = {
  OUT_DIR,
  parseCliArgs,
  wbSearch,
  safeSparql,
  getPropDistribution,
  fetchSimpleLabels,
  fetchEntityDetails,
  buildRowsFromDetails,
  writeRawPool,
  writeMissing,
  appendProgress
};
