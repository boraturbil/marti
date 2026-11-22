'use strict';

const fs = require('fs');
const path = require('path');
const { mwQuery, getQidsForTitles } = require('./lib/mw');
const { filterAliases } = require('./lib/aliasfilter');
const { fold } = require('./lib/normalize');
const { stripParens, writeProgress } = require('./lib/open_util');

const POOLS_PATH = path.join(__dirname, 'pools.json');
const OUT_DIR = path.join(__dirname, 'out');
const PROGRESS_PATH = path.join(OUT_DIR, '30_trwiki.md');

const TRWIKI_POOLS = ['corba', 'tatli', 'meyve', 'sebze'];

const SKIP_SUBCAT_RE = /(taslak|şablon|listesi|vikipedi|ile ilgili|kategorileri|kişiler|ülkelere göre|kıtalara göre)/i;
const SKIP_PAGE_RE = /(\blistesi$|^(Kategori|Şablon|Dosya|Vikipedi|Portal|Modül|Yardım):)/i;

function parseArgs(argv) {
  const args = { only: null, offline: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--only' && argv[i + 1]) args.only = argv[++i];
    else if (argv[i] === '--offline') args.offline = true;
  }
  return args;
}

/**
 * tr.wikipedia categorymembers ile sayfalı ve alt kategori derinliği <= 2 olacak şekilde başlıkları toplar.
 */
async function collectCategoryTitles(rootCat, opts = {}) {
  const maxDepth = opts.maxDepth !== undefined ? opts.maxDepth : 2;
  const maxTitles = opts.maxTitles || 1500;
  const visitedCats = new Set();
  const pageTitles = new Set();
  const queue = [{ cat: rootCat, depth: 0 }];

  while (queue.length > 0 && pageTitles.size < maxTitles) {
    const { cat, depth } = queue.shift();
    if (visitedCats.has(cat)) continue;
    visitedCats.add(cat);

    let cmcontinue = null;
    do {
      const params = {
        action: 'query',
        list: 'categorymembers',
        cmtitle: cat,
        cmlimit: '500',
        cmtype: depth < maxDepth ? 'page|subcat' : 'page'
      };
      if (cmcontinue) params.cmcontinue = cmcontinue;

      const data = await mwQuery(params, opts);
      const members = (data && data.query && data.query.categorymembers) || [];
      for (const m of members) {
        if (!m || !m.title) continue;
        if (m.ns === 14 && depth < maxDepth) {
          if (!SKIP_SUBCAT_RE.test(m.title) && !visitedCats.has(m.title)) {
            queue.push({ cat: m.title, depth: depth + 1 });
          }
        } else if (m.ns === 0) {
          if (!SKIP_PAGE_RE.test(m.title)) {
            pageTitles.add(m.title);
            if (pageTitles.size >= maxTitles) break;
          }
        }
      }
      cmcontinue = data && data.continue && data.continue.cmcontinue ? data.continue.cmcontinue : null;
    } while (cmcontinue && pageTitles.size < maxTitles);
  }

  return Array.from(pageTitles);
}

/**
 * prop=redirects ile 50'şer başlık halinde toplu yönlendirme çeker.
 */
async function fetchRedirectsBatch50(titles, opts = {}) {
  const map = {};
  for (const t of titles) map[t] = [];

  for (let i = 0; i < titles.length; i += 50) {
    const chunk = titles.slice(i, i + 50);
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

async function processPool(pool, opts) {
  const t0 = Date.now();
  const cats = pool.id === 'meyve' ? ['Kategori:Yenilebilir meyveler', 'Kategori:Meyve'] : [pool.cat];
  const titleSet = new Set();
  for (const c of cats) {
    const tList = await collectCategoryTitles(c, { ...opts, maxDepth: 2, maxTitles: 1500 });
    for (const t of tList) titleSet.add(t);
  }
  const titles = Array.from(titleSet).slice(0, 1500);
  const redirectsMap = await fetchRedirectsBatch50(titles, opts);
  const qidsMap = await getQidsForTitles(titles, opts);

  const labelFolds = new Set();
  const prepared = [];
  for (const title of titles) {
    const label = stripParens(title);
    if (!label) continue;
    const f = fold(label);
    if (f) labelFolds.add(f);
    prepared.push({ title, label });
  }

  const seenLabelFold = new Set();
  const rows = [];
  for (const { title, label } of prepared) {
    const lf = fold(label);
    if (!lf || seenLabelFold.has(lf)) continue;
    seenLabelFold.add(lf);

    const rawRedirects = redirectsMap[title] || [];
    const { accepted } = filterAliases(label, rawRedirects, labelFolds);
    rows.push({
      label,
      aliases: accepted,
      year: null,
      approx: false,
      src: `tr:${title}`,
      qid: qidsMap[title] || null,
      sl: 0
    });
  }

  const outObj = {
    pool: pool.id,
    cat: pool.cat,
    target: pool.target,
    count: rows.length,
    rows
  };
  const outPath = path.join(OUT_DIR, `trwiki_${pool.id}.json`);
  fs.writeFileSync(outPath, JSON.stringify(outObj, null, 2), 'utf8');

  const sec = ((Date.now() - t0) / 1000).toFixed(1);
  return { id: pool.id, cat: pool.cat, count: rows.length, target: pool.target, sec };
}

async function main() {
  const args = parseArgs(process.argv);
  const poolsData = JSON.parse(fs.readFileSync(POOLS_PATH, 'utf8'));
  const targetIds = args.only ? [args.only] : TRWIKI_POOLS;
  const pools = poolsData.pools.filter(p => targetIds.includes(p.id));

  if (pools.length === 0) {
    console.error('İşlenecek trwiki havuzu bulunamadı:', targetIds);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const progressLines = ['# 30_trwiki İlerleme', '', '| Havuz | Kategori | Satır | Hedef | Süre (sn) | Durum |', '|---|---|---:|---:|---:|---|'];
  writeProgress(PROGRESS_PATH, progressLines);

  for (const pool of pools) {
    try {
      const res = await processPool(pool, { offline: args.offline });
      progressLines.push(`| ${res.id} | ${res.cat} | ${res.count} | ${res.target} | ${res.sec} | TAMAM |`);
      console.log(`[30_trwiki] ${res.id}: ${res.count} satır (${res.sec} sn)`);
    } catch (err) {
      progressLines.push(`| ${pool.id} | ${pool.cat} | 0 | ${pool.target} | 0.0 | HATA: ${err.message} |`);
      console.error(`[30_trwiki] ${pool.id} HATA:`, err.message);
    }
    writeProgress(PROGRESS_PATH, progressLines);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
