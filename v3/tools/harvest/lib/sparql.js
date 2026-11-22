'use strict';

const { cachedFetchJson, hashKey } = require('./http');

const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';

/**
 * Wikidata SPARQL sorgusu çalıştırır (POST form-urlencoded, önbellekli).
 */
async function querySparql(sparql, opts = {}) {
  const clean = sparql.trim();
  const body = new URLSearchParams({ query: clean, format: 'json' }).toString();
  const key = 'wd_' + hashKey(clean);
  const data = await cachedFetchJson(SPARQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': 'application/sparql-results+json'
    },
    body,
    cacheKey: key,
    offline: opts.offline,
    cacheDir: opts.cacheDir,
    signal: opts.signal,
    timeoutMs: opts.timeoutMs || 45000
  });
  return (data && data.results && data.results.bindings) || [];
}

/**
 * LIMIT / OFFSET ile sayfalı SPARQL çekimi yapar.
 */
async function querySparqlPaged(baseQuery, opts = {}) {
  const pageSize = opts.pageSize || 2000;
  const maxRows = opts.maxRows || 20000;
  const all = [];
  let offset = 0;

  while (all.length < maxRows) {
    const q = `${baseQuery}\nLIMIT ${pageSize}\nOFFSET ${offset}`;
    const rows = await querySparql(q, opts);
    all.push(...rows);
    if (rows.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

function val(binding, key) {
  return binding && binding[key] ? binding[key].value : null;
}

function qidOf(uri) {
  if (!uri) return null;
  const m = uri.match(/(Q\d+)$/);
  return m ? m[1] : null;
}

module.exports = { querySparql, querySparqlPaged, val, qidOf };
