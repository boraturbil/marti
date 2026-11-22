'use strict';

const fs = require('fs');
const path = require('path');
const { cachedFetchJson, hashKey } = require('./http');
const { querySparql, querySparqlPaged, val, qidOf } = require('./sparql');
const { filterAliases } = require('./aliasfilter');
const { fold } = require('./normalize');
const { pickMinYear } = require('./years');

const WB_API = 'https://www.wikidata.org/w/api.php';

/**
 * Wikidata wbsearchentities API'si ile arama yapar (önbellekli).
 */
async function wbSearchEntities(search, lang = 'tr', opts = {}) {
  const params = new URLSearchParams({
    action: 'wbsearchentities',
    search,
    language: lang,
    uselang: lang,
    type: 'item',
    limit: String(opts.limit || 10),
    format: 'json'
  });
  const url = `${WB_API}?${params.toString()}`;
  const key = 'wb_' + hashKey(url);
  const data = await cachedFetchJson(url, {
    cacheKey: key,
    offline: opts.offline,
    cacheDir: opts.cacheDir,
    signal: opts.signal,
    timeoutMs: opts.timeoutMs || 30000
  });
  return (data && Array.isArray(data.search)) ? data.search : [];
}

/**
 * Bir grup QID için P31 sınıf dağılımını döndürür.
 */
async function getP31Distribution(seedQids, opts = {}) {
  if (!seedQids || seedQids.length === 0) return [];
  const values = seedQids.map(q => `wd:${q}`).join(' ');
  const q = `SELECT ?t (COUNT(*) AS ?n) WHERE {
  VALUES ?s { ${values} }
  ?s wdt:P31 ?t .
} GROUP BY ?t ORDER BY DESC(?n) LIMIT 15`;
  const rows = await querySparql(q, opts);
  const dist = rows.map(r => ({
    qid: qidOf(val(r, 't')),
    count: parseInt(val(r, 'n') || '0', 10)
  })).filter(x => x.qid);

  if (dist.length > 0) {
    const classVals = dist.map(d => `wd:${d.qid}`).join(' ');
    const lq = `SELECT ?i ?lt ?le WHERE {
  VALUES ?i { ${classVals} }
  OPTIONAL { ?i rdfs:label ?lt FILTER(LANG(?lt)="tr") }
  OPTIONAL { ?i rdfs:label ?le FILTER(LANG(?le)="en") }
}`;
    const lrows = await querySparql(lq, opts);
    const labelMap = {};
    for (const r of lrows) {
      const qid = qidOf(val(r, 'i'));
      if (qid) labelMap[qid] = val(r, 'lt') || val(r, 'le') || qid;
    }
    for (const d of dist) d.label = labelMap[d.qid] || d.qid;
  }
  return dist;
}

/**
 * Tek bir SPARQL sınıfı veya WHERE kalıbı için ?i ve ?sl çeker (sayfalı, hata durumunda yarıya indirip 1 kez dener).
 */
async function fetchPagedQidsAndSitelinks(whereBody, opts = {}) {
  const minSl = opts.minSl || 0;
  const maxRows = opts.maxRows || 10000;
  let pageSize = opts.pageSize || 2000;
  const slFilter = minSl > 0 ? `\n  FILTER(?sl >= ${minSl})` : '';
  const baseQuery = `SELECT ?i ?sl WHERE {
  ${whereBody}
  ?i wikibase:sitelinks ?sl .${slFilter}
} ORDER BY ?i`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const bindings = await querySparqlPaged(baseQuery, {
        ...opts,
        pageSize,
        maxRows,
        timeoutMs: opts.timeoutMs || 40000
      });
      const seen = new Set();
      const out = [];
      for (const b of bindings) {
        const qid = qidOf(val(b, 'i'));
        const sl = parseInt(val(b, 'sl') || '0', 10);
        if (!qid || seen.has(qid)) continue;
        seen.add(qid);
        out.push({ qid, sl });
      }
      return out;
    } catch (err) {
      if (attempt === 0) {
        pageSize = Math.max(250, Math.floor(pageSize / 2));
      } else {
        throw err;
      }
    }
  }
  return [];
}

/**
 * QID grubu için SPARQL çalıştırır; başarısızsa grup boyutunu yarıya indirip 1 kez dener.
 */
async function runBatchWithRetry(qids, buildQueryFn, opts = {}) {
  let batchSize = opts.batchSize || 200;
  const all = [];
  let i = 0;
  while (i < qids.length) {
    const chunk = qids.slice(i, i + batchSize);
    try {
      const q = buildQueryFn(chunk);
      const rows = await querySparql(q, { ...opts, timeoutMs: opts.timeoutMs || 40000 });
      all.push(...rows);
      i += chunk.length;
    } catch (err) {
      if (batchSize > 20) {
        batchSize = Math.max(20, Math.floor(batchSize / 2));
        const chunk2 = qids.slice(i, i + batchSize);
        const q2 = buildQueryFn(chunk2);
        const rows2 = await querySparql(q2, { ...opts, timeoutMs: opts.timeoutMs || 40000 });
        all.push(...rows2);
        i += chunk2.length;
      } else {
        throw err;
      }
    }
  }
  return all;
}

/**
 * QID listesi için etiketler, aliaslar ve yıl bilgilerini toplu olarak çeker.
 */
async function fetchEntitiesDetails(qids, yearProps = ['P571', 'P577'], opts = {}) {
  const map = {};
  for (const q of qids) {
    map[q] = { qid: q, trLabel: null, enLabel: null, trAliases: [], enAliases: [], dates: [] };
  }
  if (qids.length === 0) return map;

  // 1. Etiketler (tr + en)
  const labelRows = await runBatchWithRetry(qids, (chunk) => {
    const vals = chunk.map(q => `wd:${q}`).join(' ');
    return `SELECT ?i ?lt ?le WHERE {
  VALUES ?i { ${vals} }
  OPTIONAL { ?i rdfs:label ?lt FILTER(LANG(?lt)="tr") }
  OPTIONAL { ?i rdfs:label ?le FILTER(LANG(?le)="en") }
}`;
  }, opts);

  for (const r of labelRows) {
    const q = qidOf(val(r, 'i'));
    if (!q || !map[q]) continue;
    const lt = val(r, 'lt');
    const le = val(r, 'le');
    if (lt) map[q].trLabel = lt;
    if (le) map[q].enLabel = le;
  }

  // 2. Aliaslar (tr ve gerekiyorsa en)
  const aliasLangs = opts.includeEnAliases ? '("tr","en")' : '("tr")';
  const aliasFilter = opts.includeEnAliases
    ? 'FILTER(LANG(?a) IN ("tr","en"))'
    : 'FILTER(LANG(?a)="tr")';
  const aliasRows = await runBatchWithRetry(qids, (chunk) => {
    const vals = chunk.map(q => `wd:${q}`).join(' ');
    return `SELECT ?i ?a (LANG(?a) AS ?al) WHERE {
  VALUES ?i { ${vals} }
  ?i skos:altLabel ?a .
  ${aliasFilter}
}`;
  }, opts);

  for (const r of aliasRows) {
    const q = qidOf(val(r, 'i'));
    if (!q || !map[q]) continue;
    const a = val(r, 'a');
    const al = val(r, 'al');
    if (!a) continue;
    if (al === 'tr') map[q].trAliases.push(a);
    else if (al === 'en') map[q].enAliases.push(a);
  }

  // 3. Yıl özellikleri
  if (yearProps && yearProps.length > 0) {
    const propVals = yearProps.map(p => `wdt:${p}`).join(' ');
    const dateRows = await runBatchWithRetry(qids, (chunk) => {
      const vals = chunk.map(q => `wd:${q}`).join(' ');
      return `SELECT ?i ?d WHERE {
  VALUES ?i { ${vals} }
  VALUES ?p { ${propVals} }
  ?i ?p ?d .
}`;
    }, opts);

    for (const r of dateRows) {
      const q = qidOf(val(r, 'i'));
      const d = val(r, 'd');
      if (q && map[q] && d) map[q].dates.push(d);
    }
  }

  return map;
}

/**
 * Parantezli ayrım ekini etiket başlığından kırpar: "Elma (meyve)" -> "Elma".
 */
function stripParens(s) {
  return String(s || '').replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Zenginleştirilmiş kayıtlardan sözleşmeye uygun raw rows üretir.
 * Aynı QID tek satır, tr etiketi yoksa yalnız latinFallback=true ise enLabel kullanılır.
 */
function buildRawRows(items, opts = {}) {
  const latinFallback = Boolean(opts.latinFallback);
  const prepared = [];
  const labelFolds = new Set();

  for (const it of items) {
    const rawLabel = it.trLabel || (latinFallback ? it.enLabel : null);
    if (!rawLabel) continue;
    const label = stripParens(rawLabel);
    if (!label) continue;
    const f = fold(label);
    if (f) labelFolds.add(f);
    prepared.push({ it, label });
  }

  const rows = [];
  const seenQid = new Set();
  for (const { it, label } of prepared) {
    if (it.qid && seenQid.has(it.qid)) continue;
    if (it.qid) seenQid.add(it.qid);

    const candidates = [
      ...(it.trAliases || []),
      ...(latinFallback ? (it.enAliases || []) : []),
      ...(it.extraAliases || [])
    ];
    if (it.trLabel && it.enLabel && fold(it.trLabel) !== fold(it.enLabel)) {
      if (latinFallback) candidates.push(it.enLabel);
    }

    const { accepted } = filterAliases(label, candidates, labelFolds);
    const { year, approx } = pickMinYear(it.dates || []);
    rows.push({
      label,
      aliases: accepted,
      year: it.year !== undefined ? it.year : year,
      approx: it.approx !== undefined ? it.approx : approx,
      src: it.src || it.qid,
      sl: it.sl || 0
    });
  }

  return rows;
}

function writeProgress(filePath, lines) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, lines.join('\n') + '\n', 'utf8');
}

module.exports = {
  wbSearchEntities,
  getP31Distribution,
  fetchPagedQidsAndSitelinks,
  fetchEntitiesDetails,
  stripParens,
  buildRawRows,
  writeProgress
};
