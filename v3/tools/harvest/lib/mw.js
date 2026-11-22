'use strict';

const { cachedFetchJson, hashKey } = require('./http');

const TRWIKI_API = 'https://tr.wikipedia.org/w/api.php';

async function mwQuery(params, opts = {}) {
  const qs = new URLSearchParams({ format: 'json', formatversion: '2', ...params }).toString();
  const url = `${TRWIKI_API}?${qs}`;
  const key = 'trw_' + hashKey(qs);
  return cachedFetchJson(url, {
    cacheKey: key,
    offline: opts.offline,
    cacheDir: opts.cacheDir,
    signal: opts.signal,
    timeoutMs: opts.timeoutMs || 30000
  });
}

/**
 * Türkçe Vikipedi madde başlıklarından Wikidata Q kimliklerini alır (en fazla 50 başlık/istek).
 */
async function getQidsForTitles(titles, opts = {}) {
  const out = {};
  for (let i = 0; i < titles.length; i += 50) {
    const chunk = titles.slice(i, i + 50);
    const data = await mwQuery({
      action: 'query',
      prop: 'pageprops',
      ppprop: 'wikibase_item',
      redirects: '1',
      titles: chunk.join('|')
    }, opts);
    const pages = (data && data.query && data.query.pages) || [];
    for (const p of pages) {
      if (p && p.title && p.pageprops && p.pageprops.wikibase_item) {
        out[p.title] = p.pageprops.wikibase_item;
      }
    }
  }
  return out;
}

/**
 * Verilen Türkçe Vikipedi madde başlıkları için yönlendirme (redirect) başlıklarını çeker.
 */
async function getRedirectsForTitles(titles, opts = {}) {
  const map = {};
  for (const t of titles) map[t] = [];

  for (let i = 0; i < titles.length; i += 20) {
    const chunk = titles.slice(i, i + 20);
    let rdcontinue = null;
    do {
      const params = {
        action: 'query',
        prop: 'redirects',
        rdlimit: '500',
        rdnamespace: '0',
        titles: chunk.join('|')
      };
      if (rdcontinue) params.rdcontinue = rdcontinue;
      const data = await mwQuery(params, opts);
      const pages = (data && data.query && data.query.pages) || [];
      for (const p of pages) {
        if (!p || !p.title || !Array.isArray(p.redirects)) continue;
        if (!map[p.title]) map[p.title] = [];
        for (const r of p.redirects) {
          if (r && r.title) map[p.title].push(r.title);
        }
      }
      rdcontinue = data && data.continue && data.continue.rdcontinue ? data.continue.rdcontinue : null;
    } while (rdcontinue);
  }
  return map;
}

module.exports = { mwQuery, getQidsForTitles, getRedirectsForTitles };
