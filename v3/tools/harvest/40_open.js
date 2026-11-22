'use strict';

const fs = require('fs');
const path = require('path');
const { querySparql, val, qidOf } = require('./lib/sparql');
const { getQidsForTitles } = require('./lib/mw');
const { filterAliases } = require('./lib/aliasfilter');
const { fold } = require('./lib/normalize');
const {
  wbSearchEntities,
  getP31Distribution,
  fetchPagedQidsAndSitelinks,
  fetchEntitiesDetails,
  buildRawRows,
  writeProgress
} = require('./lib/open_util');

const POOLS_PATH = path.join(__dirname, 'pools.json');
const OUT_DIR = path.join(__dirname, 'out');
const PROGRESS_PATH = path.join(OUT_DIR, '40_open.md');
const CLASSES_PATH = path.join(OUT_DIR, 'classes_f3_D.json');
const MAX_OPEN_ROWS = 5000;

// AGY_F3_D_ACIK.txt öncelik sırası (icat hariç)
const PRIORITY_ORDER = [
  'tarayici', 'isletim_sistemi', 'oyun_konsolu', 'prog_dili', 'sosyal_medya',
  'video_oyunu', 'film', 'turk_filmi', 'turk_dizisi', 'sarki',
  'havayolu', 'otomobil_markasi', 'telefon_markasi',
  'corba', 'tatli', 'meyve', 'sebze', 'kahvaltilik',
  'hayvan', 'meslek', 'spor_dali', 'turk_markasi',
  'uzay_sondasi', 'gunes_uydu', 'sinan_yapisi', 'ist_muze'
];

const TARAYICI_SEEDS = [
  { name: 'Google Chrome', aliases: ['Chrome', 'Krom'] },
  { name: 'Opera', aliases: [] },
  { name: 'Firefox', aliases: ['Mozilla Firefox'], preferExact: ['Mozilla Firefox', 'Firefox'] },
  { name: 'Safari', aliases: ['Apple Safari'] },
  { name: 'Edge', aliases: ['Microsoft Edge', 'Edge'], preferExact: ['Microsoft Edge', 'Edge'] },
  { name: 'Brave', aliases: ['Brave Tarayıcı'] },
  { name: 'Vivaldi', aliases: [] },
  { name: 'Internet Explorer', aliases: ['IE', 'MSIE'] },
  { name: 'Netscape Navigator', aliases: ['Netscape'] },
  { name: 'Mosaic', aliases: [] },
  { name: 'Lynx', aliases: [] },
  { name: 'WorldWideWeb', aliases: [] }
];

const PLATFORM_VARIANT_RE = /(için|for Android|for iOS|for Windows|for macOS|for Linux|mobile|Mini\b)/i;

function parseArgs(argv) {
  const args = { only: null, offline: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--only' && argv[i + 1]) args.only = argv[++i];
    else if (argv[i] === '--offline') args.offline = true;
  }
  return args;
}

function loadClassesMap() {
  if (fs.existsSync(CLASSES_PATH)) {
    try { return JSON.parse(fs.readFileSync(CLASSES_PATH, 'utf8')); } catch {}
  }
  return {};
}

function saveClassesMap(map) {
  fs.writeFileSync(CLASSES_PATH, JSON.stringify(map, null, 2), 'utf8');
}

/**
 * Tohum adlarından wbsearchentities ile QID bulur (tam etiket eşleşmesi öncelikli, platform varyantları elenir).
 */
async function resolveSeedBySearch(seedName, preferExact = [], opts = {}) {
  const candidates = [];
  for (const lang of ['tr', 'en']) {
    const res = await wbSearchEntities(seedName, lang, { ...opts, limit: 10 });
    for (const item of res) candidates.push({ ...item, searchLang: lang });
  }
  const targets = [seedName, ...preferExact].map(s => s.toLowerCase());

  let best = null;
  let bestScore = -1;
  for (const c of candidates) {
    const lbl = (c.label || '').trim();
    const desc = (c.description || '').toLowerCase();
    if (!lbl) continue;
    if (PLATFORM_VARIANT_RE.test(lbl) && !targets.includes(lbl.toLowerCase())) continue;

    let score = 0;
    const lblLower = lbl.toLowerCase();
    if (targets.includes(lblLower)) score += 100;
    else if (targets.some(t => lblLower.includes(t))) score += 40;
    else continue;

    if (/(web browser|tarayıcı|ağ tarayıcısı|internet browser|yazılım|software)/i.test(desc)) score += 50;
    if (/(film|albüm|album|song|şarkı|kişi|person|novel|roman|river|nehir|genus|cins|animal|hayvan|company|şirket)/i.test(desc)) score -= 60;
    if (c.searchLang === 'tr') score += 5;

    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best ? best.id : null;
}

/**
 * Tohum adlarından trwiki veya wbsearchentities ile sınıf QID keşfeder/doğrular.
 */
async function verifyClassFromSeeds(seedTitles, fallbackClassQid, opts = {}) {
  const qidMap = await getQidsForTitles(seedTitles, opts);
  const seedQids = Object.values(qidMap).filter(Boolean);
  if (seedQids.length === 0) {
    return { qid: fallbackClassQid, label: fallbackClassQid, votes: 0, dist: [] };
  }
  const dist = await getP31Distribution(seedQids, opts);
  const match = fallbackClassQid ? dist.find(d => d.qid === fallbackClassQid) : dist[0];
  const chosen = match || dist[0] || { qid: fallbackClassQid, label: fallbackClassQid, count: 0 };
  return { qid: chosen.qid, label: chosen.label || chosen.qid, votes: chosen.count || 0, dist };
}

function capAndSortRows(rows, maxRows = MAX_OPEN_ROWS) {
  const sorted = [...rows].sort((a, b) => (b.sl || 0) - (a.sl || 0));
  if (sorted.length <= maxRows) return { rows: sorted, trimmed: 0 };
  return { rows: sorted.slice(0, maxRows), trimmed: sorted.length - maxRows };
}

/**
 * TARAYICI özel akışı: P31=Q6368 + 12 zorunlu seed (wbsearchentities ile doğrulanmış).
 */
async function harvestTarayici(pool, classesMap, opts) {
  const classInfo = await verifyClassFromSeeds(['Google Chrome', 'Mozilla Firefox', 'Opera', 'Safari'], 'Q6368', opts);
  const members = await fetchPagedQidsAndSitelinks('?i wdt:P31 wd:Q6368 .', { ...opts, minSl: 0, maxRows: 5000 });
  const memberMap = new Map(members.map(m => [m.qid, m.sl]));

  const seedExtraAliases = new Map();
  for (const s of TARAYICI_SEEDS) {
    const qid = await resolveSeedBySearch(s.name, s.preferExact || [], opts);
    if (qid) {
      if (!memberMap.has(qid)) memberMap.set(qid, 50);
      const prev = seedExtraAliases.get(qid) || [];
      seedExtraAliases.set(qid, [...prev, s.name, ...(s.aliases || [])]);
    }
  }

  const allQids = Array.from(memberMap.keys());
  const details = await fetchEntitiesDetails(allQids, ['P571', 'P577', 'P1619'], { ...opts, includeEnAliases: true });

  // Sitelinks'i eksik seed'ler için çek
  const items = allQids.map(q => ({
    ...details[q],
    sl: memberMap.get(q) || 0,
    extraAliases: seedExtraAliases.get(q) || []
  }));

  const rawRows = buildRawRows(items, { latinFallback: true });
  const { rows, trimmed } = capAndSortRows(rawRows);
  const trCount = rows.filter(r => details[r.src] && details[r.src].trLabel).length;

  // Eksik yıl kontrolü (12 zorunlu seed için)
  const missingLines = [];
  for (const s of TARAYICI_SEEDS) {
    const f = fold(s.name);
    const hit = rows.find(r => fold(r.label) === f || r.aliases.some(a => fold(a) === f));
    if (!hit) {
      missingLines.push(`${s.name} # bulunamadı`);
    } else if (hit.year === null) {
      missingLines.push(`${hit.label} (${hit.src}) # Wikidata P571/P577/P1619 yıl yok — manuel doğrulanacak`);
    }
  }
  fs.writeFileSync(path.join(OUT_DIR, 'manuel_eksik_tarayici.txt'), missingLines.join('\n') + (missingLines.length ? '\n' : ''), 'utf8');

  classesMap[pool.id] = { no: pool.no, qid: classInfo.qid, label: classInfo.label, count: rows.length };
  return { source: ['wikidata'], rows, trimmed, trCount };
}

/**
 * Standart Wikidata sınıf havuzları için yapılandırma.
 */
const WD_SPECS = {
  isletim_sistemi: {
    seeds: ['Microsoft Windows', 'Linux', 'macOS', 'Android'],
    defaultClass: 'Q9135',
    where: '?i wdt:P31 wd:Q9135 .',
    minSl: 0,
    yearProps: ['P571', 'P577', 'P1619'],
    latinFallback: true,
    includeEnAliases: true
  },
  oyun_konsolu: {
    seeds: ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Atari 2600'],
    defaultClass: 'Q56682555',
    where: '{ ?i wdt:P31 wd:Q56682555 . } UNION { ?i wdt:P279 wd:Q8076 . } UNION { ?i wdt:P279 wd:Q10677 . } UNION { ?i wdt:P279 wd:Q941818 . }',
    minSl: 1,
    yearProps: ['P571', 'P577'],
    latinFallback: true,
    includeEnAliases: true
  },
  prog_dili: {
    seeds: ['Python', 'JavaScript', 'C++', 'Java (programlama dili)'],
    defaultClass: 'Q9143',
    where: '?i wdt:P31 wd:Q9143 .',
    minSl: 1,
    yearProps: ['P571', 'P577'],
    latinFallback: true,
    includeEnAliases: true
  },
  sosyal_medya: {
    seeds: ['Facebook', 'Instagram', 'YouTube', 'Reddit'],
    defaultClass: 'Q3220391',
    where: 'VALUES ?t { wd:Q3220391 wd:Q202833 wd:Q6576792 } ?i wdt:P31 ?t .',
    minSl: 5,
    yearProps: ['P571', 'P577'],
    latinFallback: true,
    includeEnAliases: true
  },
  video_oyunu: {
    seeds: ['Minecraft', 'The Witcher 3: Wild Hunt', 'Grand Theft Auto V', 'Tetris'],
    defaultClass: 'Q7889',
    where: '?i wdt:P31 wd:Q7889 .',
    minSl: 10,
    yearProps: ['P577'],
    latinFallback: true,
    includeEnAliases: false
  },
  film: {
    seeds: ['Baba (film, 1972)', 'Başlangıç (film)', 'Parazit (film, 2019)', 'Esaretin Bedeli'],
    defaultClass: 'Q11424',
    where: '?i wdt:P31 wd:Q11424 .',
    minSl: 20,
    yearProps: ['P577'],
    latinFallback: true,
    includeEnAliases: false
  },
  turk_filmi: {
    seeds: ['Hababam Sınıfı (film)', 'Babam ve Oğlum', 'Kış Uykusu', 'Eşkıya (film)'],
    defaultClass: 'Q11424',
    where: '?i wdt:P31 wd:Q11424 ; wdt:P495 wd:Q43 .',
    minSl: 3,
    yearProps: ['P577'],
    latinFallback: true,
    includeEnAliases: false
  },
  turk_dizisi: {
    seeds: ['Kurtlar Vadisi', 'Aşk-ı Memnu (dizi, 2008)', 'Behzat Ç. Bir Ankara Polisiyesi', 'Muhteşem Yüzyıl'],
    defaultClass: 'Q5398426',
    where: '?i wdt:P31 wd:Q5398426 ; wdt:P495 wd:Q43 .',
    minSl: 0,
    yearProps: ['P580', 'P577', 'P571'],
    latinFallback: true,
    includeEnAliases: false
  },
  sarki: {
    seeds: ['Bohemian Rhapsody', 'Imagine (şarkı)', 'Thriller (şarkı)', 'Billie Jean'],
    defaultClass: 'Q7366',
    where: '?i wdt:P31 wd:Q7366 . ?i rdfs:label ?_trl FILTER(LANG(?_trl)="tr") .',
    minSl: 5,
    yearProps: ['P577', 'P571'],
    latinFallback: false,
    includeEnAliases: false
  },
  havayolu: {
    seeds: ['Türk Hava Yolları', 'Lufthansa', 'Emirates', 'Ryanair'],
    defaultClass: 'Q46970',
    where: '?i wdt:P31 wd:Q46970 . FILTER NOT EXISTS { ?i wdt:P576 ?end } .',
    minSl: 5,
    yearProps: ['P571'],
    latinFallback: true,
    includeEnAliases: true
  },
  otomobil_markasi: {
    seeds: ['Toyota', 'Ford Motor Company', 'BMW', 'Togg'],
    defaultClass: 'Q786820',
    where: 'VALUES ?t { wd:Q786820 wd:Q786803 } ?i wdt:P31 ?t .',
    minSl: 5,
    yearProps: ['P571'],
    latinFallback: true,
    includeEnAliases: true
  },
  telefon_markasi: {
    seeds: ['Apple', 'Samsung Electronics', 'Xiaomi', 'Nokia'],
    defaultClass: 'Q190107',
    where: '{ ?i wdt:P452 wd:Q1518850 . } UNION { ?i wdt:P1056 wd:Q17517 . }',
    minSl: 5,
    yearProps: ['P571'],
    latinFallback: true,
    includeEnAliases: true
  },
  hayvan: {
    seeds: ['Aslan', 'Kurt', 'Kartal', 'Yunus'],
    defaultClass: 'Q16521',
    where: '?i wdt:P31 wd:Q16521 ; wdt:P105 wd:Q7432 . ?w schema:about ?i ; schema:isPartOf <https://tr.wikipedia.org/> .',
    minSl: 10,
    yearProps: [],
    latinFallback: false,
    includeEnAliases: false,
    useCommonName: true
  },
  meslek: {
    seeds: ['Doktor', 'Mühendis', 'Avukat', 'Öğretmen'],
    defaultClass: 'Q28640',
    where: '?i wdt:P31 wd:Q28640 . ?i rdfs:label ?_trl FILTER(LANG(?_trl)="tr") .',
    minSl: 0,
    yearProps: [],
    latinFallback: false,
    includeEnAliases: false
  },
  spor_dali: {
    seeds: ['Futbol', 'Basketbol', 'Tenis', 'Yüzme (spor)'],
    defaultClass: 'Q31629',
    where: 'VALUES ?t { wd:Q31629 wd:Q212434 } ?i wdt:P31 ?t . ?i rdfs:label ?_trl FILTER(LANG(?_trl)="tr") .',
    minSl: 0,
    yearProps: [],
    latinFallback: false,
    includeEnAliases: false
  },
  turk_markasi: {
    seeds: ['Arçelik', 'Ülker', 'Beko', 'Vestel'],
    defaultClass: 'Q431289',
    where: 'VALUES ?t { wd:Q431289 wd:Q4830453 } ?i wdt:P31 ?t ; wdt:P17 wd:Q43 .',
    minSl: 5,
    yearProps: ['P571'],
    latinFallback: true,
    includeEnAliases: false
  },
  uzay_sondasi: {
    seeds: ['Voyager 1', 'Cassini-Huygens', 'New Horizons', 'Juno (uzay aracı)'],
    defaultClass: 'Q26529',
    where: '?i wdt:P31 wd:Q26529 .',
    minSl: 0,
    yearProps: ['P619', 'P577', 'P571'],
    latinFallback: true,
    includeEnAliases: false
  },
  gunes_uydu: {
    seeds: ['Ay', 'Europa (uydu)', 'Titan (uydu)', 'Phobos (uydu)'],
    defaultClass: 'Q2537',
    where: 'VALUES ?t { wd:Q2537 wd:Q1086783 wd:Q1022867 wd:Q339 } ?i wdt:P31 ?t ; wdt:P397 ?p . FILTER(?t != wd:Q339 || EXISTS { ?i wdt:P31 wd:Q2537 })',
    minSl: 0,
    yearProps: ['P575'],
    latinFallback: true,
    includeEnAliases: false
  },
  sinan_yapisi: {
    seeds: ['Süleymaniye Camii', 'Selimiye Camii', 'Mihrimah Sultan Camii (Edirnekapı)', 'Şehzade Camii'],
    defaultClass: 'Q5600',
    where: '?i wdt:P84 wd:Q5600 .',
    minSl: 0,
    yearProps: ['P571', 'P1619'],
    latinFallback: false,
    includeEnAliases: false
  },
  ist_muze: {
    seeds: ['Topkapı Sarayı', 'İstanbul Arkeoloji Müzeleri', 'Pera Müzesi', 'İstanbul Modern'],
    defaultClass: 'Q33506',
    where: '?i wdt:P31 wd:Q33506 . { ?i wdt:P131 wd:Q406 . } UNION { ?i wdt:P131 wd:Q534799 . } UNION { ?i wdt:P131 ?d . ?d wdt:P131 wd:Q534799 . }',
    minSl: 0,
    yearProps: ['P571', 'P1619'],
    latinFallback: false,
    includeEnAliases: false
  }
};

async function harvestWdStandard(pool, spec, classesMap, opts) {
  const classInfo = await verifyClassFromSeeds(spec.seeds, spec.defaultClass, opts);
  const members = await fetchPagedQidsAndSitelinks(spec.where, {
    ...opts,
    minSl: spec.minSl,
    maxRows: 12000
  });

  // 5000 tavanı öncesi en yüksek sl'li ilk 5500'ü alıp detay çekelim (hem hızlı hem tavan uyumlu)
  const sortedMembers = [...members].sort((a, b) => b.sl - a.sl);
  const preCap = sortedMembers.slice(0, 5500);
  const preTrimmed = Math.max(0, sortedMembers.length - preCap.length);

  const qids = preCap.map(m => m.qid);
  const slMap = new Map(preCap.map(m => [m.qid, m.sl]));
  const details = await fetchEntitiesDetails(qids, spec.yearProps, {
    ...opts,
    includeEnAliases: spec.includeEnAliases
  });

  // Hayvan havuzunda P1843 (Türkçe halk adı) varsa önceliklendir
  if (spec.useCommonName && qids.length > 0) {
    for (let i = 0; i < qids.length; i += 80) {
      const chunk = qids.slice(i, i + 80);
      const vals = chunk.map(q => `wd:${q}`).join(' ');
      const q = `SELECT ?i ?cn WHERE { VALUES ?i { ${vals} } ?i wdt:P1843 ?cn FILTER(LANG(?cn)="tr") }`;
      try {
        const cnRows = await querySparql(q, opts);
        for (const r of cnRows) {
          const qid = qidOf(val(r, 'i'));
          const cn = val(r, 'cn');
          if (qid && cn && details[qid]) {
            if (!details[qid].trLabel) details[qid].trLabel = cn;
            else details[qid].trAliases.push(cn);
          }
        }
      } catch {}
    }
  }

  const items = qids.map(q => ({ ...details[q], sl: slMap.get(q) || 0 }));
  const rawRows = buildRawRows(items, { latinFallback: spec.latinFallback });
  const { rows, trimmed } = capAndSortRows(rawRows);
  const trCount = rows.filter(r => details[r.src] && details[r.src].trLabel).length;

  classesMap[pool.id] = {
    no: pool.no,
    qid: classInfo.qid,
    label: classInfo.label,
    count: rows.length
  };
  return { source: ['wikidata'], rows, trimmed: trimmed + preTrimmed, trCount };
}

async function harvestTrwikiPool(pool, classesMap, opts) {
  const trwikiPath = path.join(OUT_DIR, `trwiki_${pool.id}.json`);
  if (!fs.existsSync(trwikiPath)) {
    throw new Error(`trwiki_${pool.id}.json bulunamadı; önce 30_trwiki.js çalıştırın`);
  }
  const data = JSON.parse(fs.readFileSync(trwikiPath, 'utf8'));
  const rows = (data.rows || []).map(r => ({
    label: r.label,
    aliases: r.aliases || [],
    year: r.year || null,
    approx: Boolean(r.approx),
    src: r.src,
    sl: r.sl || 0
  }));

  // meyve / sebze için QID varsa Wikidata sitelinks + tr alias zenginleştirmesi
  const sources = ['trwiki'];
  if (pool.kind === 'trwiki+wd') {
    const qidRows = (data.rows || []).filter(r => r.qid);
    const qids = Array.from(new Set(qidRows.map(r => r.qid)));
    if (qids.length > 0) {
      sources.push('wikidata');
      const details = await fetchEntitiesDetails(qids, [], { ...opts, includeEnAliases: false });
      const labelFolds = new Set(rows.map(r => fold(r.label)));
      const bySrc = new Map(qidRows.map(r => [r.src, r.qid]));
      for (const row of rows) {
        const qid = bySrc.get(row.src);
        if (!qid || !details[qid]) continue;
        const cand = [...(row.aliases || []), ...(details[qid].trAliases || [])];
        const { accepted } = filterAliases(row.label, cand, labelFolds);
        row.aliases = accepted;
      }
    }
  }

  const capped = capAndSortRows(rows);
  return { source: sources, rows: capped.rows, trimmed: capped.trimmed };
}

async function processPool(pool, classesMap, opts) {
  let result;
  let extraNote = null;

  if (pool.id === 'kahvaltilik') {
    result = { source: ['manual'], rows: [], trimmed: 0 };
    extraNote = 'Boş ham havuz; F4 aşamasında C işçisi tarafından manuel doldurulacak.';
  } else if (pool.id === 'tarayici') {
    result = await harvestTarayici(pool, classesMap, opts);
  } else if (['corba', 'tatli', 'meyve', 'sebze'].includes(pool.id)) {
    result = await harvestTrwikiPool(pool, classesMap, opts);
  } else if (WD_SPECS[pool.id]) {
    result = await harvestWdStandard(pool, WD_SPECS[pool.id], classesMap, opts);
  } else {
    throw new Error(`Tanımsız havuz: ${pool.id}`);
  }

  const outObj = {
    pool: pool.id,
    mode: pool.mode,
    expect: pool.expect || null,
    target: pool.target || null,
    source: result.source,
    trimmed: result.trimmed || 0,
    ...(extraNote ? { note: extraNote } : {}),
    rows: result.rows
  };
  fs.writeFileSync(path.join(OUT_DIR, `raw_${pool.id}.json`), JSON.stringify(outObj, null, 2), 'utf8');
  saveClassesMap(classesMap);

  const n = result.rows.length;
  const yearPct = n ? Math.round((result.rows.filter(r => r.year !== null).length / n) * 100) : 0;
  const trCount = result.trCount !== undefined ? result.trCount : (result.source.includes('trwiki') ? n : 0);
  const trPct = n ? Math.round((trCount / n) * 100) : 0;
  return { id: pool.id, count: n, target: pool.target || '-', yearPct, trPct, trimmed: outObj.trimmed };
}

async function main() {
  const args = parseArgs(process.argv);
  const poolsData = JSON.parse(fs.readFileSync(POOLS_PATH, 'utf8'));
  const poolById = new Map(poolsData.pools.map(p => [p.id, p]));

  const ids = args.only ? [args.only] : PRIORITY_ORDER;
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const classesMap = loadClassesMap();

  const progressLines = [
    '# 40_open İlerleme',
    '',
    '| Havuz | Satır | Hedef | Yıl % | TR Etiket % | Kırpılan | Süre (sn) | Durum |',
    '|---|---:|---:|---:|---:|---:|---:|---|'
  ];
  writeProgress(PROGRESS_PATH, progressLines);

  for (const id of ids) {
    const pool = poolById.get(id);
    if (!pool) {
      console.error(`pools.json içinde bulunamadı: ${id}`);
      continue;
    }
    const t0 = Date.now();
    try {
      const res = await processPool(pool, classesMap, { offline: args.offline });
      const sec = ((Date.now() - t0) / 1000).toFixed(1);
      const status = (pool.target && res.count < pool.target) ? `EKSIK (<${pool.target})` : 'TAMAM';
      progressLines.push(`| ${res.id} | ${res.count} | ${res.target} | %${res.yearPct} | %${res.trPct} | ${res.trimmed} | ${sec} | ${status} |`);
      console.log(`[40_open] ${res.id}: ${res.count}/${res.target} satır, yıl %${res.yearPct}, tr %${res.trPct} (${sec} sn)`);
    } catch (err) {
      const sec = ((Date.now() - t0) / 1000).toFixed(1);
      progressLines.push(`| ${id} | 0 | ${pool.target || '-'} | %0 | %0 | 0 | ${sec} | HATA: ${err.message} |`);
      console.error(`[40_open] ${id} HATA:`, err.message);
    }
    writeProgress(PROGRESS_PATH, progressLines);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
