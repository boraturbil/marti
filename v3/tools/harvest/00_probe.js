'use strict';

const fs = require('fs');
const path = require('path');
const { querySparql, querySparqlPaged, val, qidOf } = require('./lib/sparql');
const { getQidsForTitles, getRedirectsForTitles } = require('./lib/mw');
const { fold } = require('./lib/normalize');
const { filterAliases } = require('./lib/aliasfilter');
const { parseYear } = require('./lib/years');

const PLAN_PATH = path.join(__dirname, 'demo_plan.json');
const OUT_DIR = path.join(__dirname, 'out');

// Her konu için P31 dağılımını keşfetmek üzere temsili trwiki/Wikidata tohumları ve sorgu şablonu ipuçları
const TOPIC_CONFIG = {
  ist_ilce: {
    seeds: ['Kadıköy', 'Beşiktaş', 'Üsküdar', 'Bakırköy'],
    knownClass: 'Q1147395',
    filter: '?i wdt:P131 wd:Q534799 .',
    yearProps: ['P571'],
    note: 'VERI_KAYNAKLARI.md doğrulandı'
  },
  tr_il: {
    seeds: ['Ankara (il)', 'İstanbul (il)', 'İzmir (il)', 'Antalya (il)'],
    yearProps: ['P571']
  },
  ulke: {
    seeds: ['Türkiye', 'Fransa', 'Japonya', 'Brezilya'],
    knownClass: 'Q3624078',
    filter: 'FILTER NOT EXISTS { ?i wdt:P576 ?end } .',
    yearProps: ['P571']
  },
  baskent: {
    seeds: ['Ankara', 'Paris', 'Tokyo', 'Berlin'],
    customCountSparql: `
      SELECT ?i ?l (GROUP_CONCAT(DISTINCT ?a; separator="|") AS ?al) (MIN(?d) AS ?y) ?sl ?trt WHERE {
        ?c wdt:P31 wd:Q3624078 .
        FILTER NOT EXISTS { ?c wdt:P576 ?end }
        ?c wdt:P36 ?i .
        OPTIONAL { ?i rdfs:label ?l FILTER(lang(?l)="tr") }
        OPTIONAL { ?i skos:altLabel ?a FILTER(lang(?a)="tr") }
        OPTIONAL { ?i wdt:P571 ?d }
        OPTIONAL { ?w schema:about ?i ; schema:isPartOf <https://tr.wikipedia.org/> ; schema:name ?trt }
        ?i wikibase:sitelinks ?sl .
      } GROUP BY ?i ?l ?sl ?trt LIMIT 500`,
    yearProps: ['P571']
  },
  dunya_sehri: {
    seeds: ['İstanbul', 'Londra', 'Tokyo', 'New York'],
    openCap: true,
    yearProps: ['P571']
  },
  corba: {
    seeds: ['Mercimek çorbası', 'Tarhana çorbası', 'Domates çorbası', 'Borscht'],
    knownClass: 'Q41415',
    subclass: true,
    yearProps: []
  },
  kahvaltilik: {
    seeds: ['Menemen (yemek)', 'Börek', 'Simit', 'Omlet'],
    manualPrimary: true,
    yearProps: []
  },
  tatli: {
    seeds: ['Baklava', 'Künefe', 'Sütlaç', 'Tiramisu'],
    subclass: true,
    openCap: true,
    yearProps: []
  },
  meyve: {
    seeds: ['Elma', 'Armut', 'Çilek', 'Muz'],
    subclass: true,
    openCap: true,
    yearProps: []
  },
  sebze: {
    seeds: ['Domates', 'Patlıcan', 'Ispanak', 'Havuç'],
    subclass: true,
    openCap: true,
    yearProps: []
  },
  hayvan: {
    seeds: ['Aslan', 'Kurt', 'Kartal', 'Yunus'],
    subclass: true,
    openCap: true,
    yearProps: []
  },
  meslek: {
    seeds: ['Doktor', 'Mühendis', 'Avukat', 'Öğretmen'],
    subclass: true,
    openCap: true,
    yearProps: []
  },
  spor_dali: {
    seeds: ['Futbol', 'Basketbol', 'Tenis', 'Yüzme (spor)'],
    subclass: true,
    openCap: true,
    yearProps: []
  },
  turk_markasi: {
    seeds: ['Arçelik', 'Vestel', 'Ülker', 'Türk Hava Yolları'],
    knownClass: 'Q431289',
    subclass: true,
    filter: '?i wdt:P17 wd:Q43 .',
    yearProps: ['P571']
  },
  tarayici: {
    seeds: ['Google Chrome', 'Mozilla Firefox', 'Opera (web tarayıcısı)', 'Safari (web tarayıcısı)', 'Microsoft Edge'],
    subclass: true,
    yearProps: ['P571', 'P577']
  },
  isletim_sistemi: {
    seeds: ['Microsoft Windows', 'Linux', 'macOS', 'Android'],
    subclass: true,
    yearProps: ['P571', 'P577']
  },
  oyun_konsolu: {
    seeds: ['PlayStation 5', 'Xbox Series X ve Series S', 'Nintendo Switch', 'PlayStation 2'],
    subclass: true,
    yearProps: ['P571', 'P577', 'P729']
  },
  programlama_dili: {
    seeds: ['Python', 'JavaScript', 'C (programlama dili)', 'Java'],
    subclass: true,
    yearProps: ['P571', 'P577']
  },
  sosyal_medya: {
    seeds: ['Instagram', 'X (sosyal ağ)', 'TikTok', 'YouTube'],
    subclass: true,
    yearProps: ['P571', 'P577']
  },
  video_oyunu: {
    seeds: ['Tetris', 'Minecraft', 'Grand Theft Auto V', 'The Witcher 3: Wild Hunt'],
    knownClass: 'Q7889',
    subclass: true,
    openCap: true,
    yearProps: ['P577', 'P571']
  },
  telefon_markasi: {
    seeds: ['Apple', 'Samsung', 'Nokia', 'Xiaomi'],
    openCap: true,
    yearProps: ['P571']
  },
  otomobil_markasi: {
    seeds: ['Toyota', 'Ford', 'BMW', 'Togg'],
    subclass: true,
    openCap: true,
    yearProps: ['P571']
  },
  havayolu: {
    seeds: ['Türk Hava Yolları', 'Lufthansa', 'Emirates', 'Pegasus Hava Yolları'],
    filter: 'FILTER NOT EXISTS { ?i wdt:P576 ?end } .',
    openCap: true,
    yearProps: ['P571']
  },
  turk_filmi: {
    seeds: ['Hababam Sınıfı (film)', 'Babam ve Oğlum', 'Kış Uykusu', 'Vizontele'],
    knownClass: 'Q11424',
    filter: '?i wdt:P495 wd:Q43 . ?w schema:about ?i ; schema:isPartOf <https://tr.wikipedia.org/> .',
    yearProps: ['P577']
  },
  film: {
    seeds: ['Baba (film, 1972)', 'Matrix', 'Esaretin Bedeli', 'Başlangıç (film)'],
    knownClass: 'Q11424',
    openCap: true,
    yearProps: ['P577']
  },
  turk_dizisi: {
    seeds: ['Kurtlar Vadisi', 'Ezel (dizi)', 'Aşk-ı Memnu (dizi, 2008)', 'Muhteşem Yüzyıl'],
    filter: '?i wdt:P495 wd:Q43 .',
    yearProps: ['P580', 'P577', 'P571']
  },
  sarki: {
    seeds: ['Bohemian Rhapsody', 'Imagine', 'Shape of You', 'Tarkan'],
    openCap: true,
    yearProps: ['P577', 'P571']
  },
  super_lig: {
    seeds: ['Galatasaray (futbol takımı)', 'Fenerbahçe (futbol takımı)', 'Beşiktaş (futbol takımı)', 'Trabzonspor'],
    knownClass: 'Q476028',
    filter: '?i wdt:P17 wd:Q43 ; wdt:P118 wd:Q485568 .',
    yearProps: ['P571']
  },
  para_birimi: {
    seeds: ['Türk lirası', 'Amerikan doları', 'Euro', 'İngiliz sterlini'],
    filter: 'FILTER NOT EXISTS { ?i wdt:P576 ?end } .',
    yearProps: ['P571', 'P580', 'P577']
  },
  pixar_filmi: {
    seeds: ['Oyuncak Hikâyesi', 'Kayıp Balık Nemo', 'Yukarı Bak', 'Ters Yüz'],
    knownClass: 'Q11424',
    filter: '?i wdt:P272 wd:Q127552 .',
    yearProps: ['P577']
  },
  element: {
    seeds: ['Hidrojen', 'Oksijen', 'Altın', 'Demir'],
    yearProps: ['P575', 'P571']
  },
  gezegen: {
    seeds: ['Merkür', 'Venüs', 'Mars', 'Plüton'],
    customCountSparql: `
      SELECT ?i ?l (GROUP_CONCAT(DISTINCT ?a; separator="|") AS ?al) (MIN(?d) AS ?y) ?sl ?trt WHERE {
        VALUES ?cls { wd:Q3504248 wd:Q2199 }
        ?i wdt:P31 ?cls .
        OPTIONAL { ?i rdfs:label ?l FILTER(lang(?l)="tr") }
        OPTIONAL { ?i skos:altLabel ?a FILTER(lang(?a)="tr") }
        OPTIONAL { ?i wdt:P575 ?d }
        OPTIONAL { ?w schema:about ?i ; schema:isPartOf <https://tr.wikipedia.org/> ; schema:name ?trt }
        ?i wikibase:sitelinks ?sl .
      } GROUP BY ?i ?l ?sl ?trt LIMIT 100`,
    yearProps: ['P575']
  },
  osmanli_padisahi: {
    seeds: ['I. Osman', 'II. Mehmed', 'I. Süleyman', 'II. Abdülhamid'],
    customCountSparql: `
      SELECT ?i ?l (GROUP_CONCAT(DISTINCT ?a; separator="|") AS ?al) (MIN(?d) AS ?y) ?sl ?trt WHERE {
        ?i wdt:P39 wd:Q15315411 .
        OPTIONAL { ?i rdfs:label ?l FILTER(lang(?l)="tr") }
        OPTIONAL { ?i skos:altLabel ?a FILTER(lang(?a)="tr") }
        OPTIONAL { ?i p:P39 [ ps:P39 wd:Q15315411 ; pq:P580 ?d ] }
        OPTIONAL { ?w schema:about ?i ; schema:isPartOf <https://tr.wikipedia.org/> ; schema:name ?trt }
        ?i wikibase:sitelinks ?sl .
      } GROUP BY ?i ?l ?sl ?trt LIMIT 200`,
    yearProps: ['P580']
  },
  cumhurbaskani: {
    seeds: ['Mustafa Kemal Atatürk', 'İsmet İnönü', 'Turgut Özal', 'Recep Tayyip Erdoğan'],
    customCountSparql: `
      SELECT ?i ?l (GROUP_CONCAT(DISTINCT ?a; separator="|") AS ?al) (MIN(?d) AS ?y) ?sl ?trt WHERE {
        ?i wdt:P39 wd:Q19261653 .
        OPTIONAL { ?i rdfs:label ?l FILTER(lang(?l)="tr") }
        OPTIONAL { ?i skos:altLabel ?a FILTER(lang(?a)="tr") }
        OPTIONAL { ?i p:P39 [ ps:P39 wd:Q19261653 ; pq:P580 ?d ] }
        OPTIONAL { ?w schema:about ?i ; schema:isPartOf <https://tr.wikipedia.org/> ; schema:name ?trt }
        ?i wikibase:sitelinks ?sl .
      } GROUP BY ?i ?l ?sl ?trt LIMIT 100`,
    yearProps: ['P580']
  },
  turk_universitesi: {
    seeds: ['İstanbul Üniversitesi', 'Orta Doğu Teknik Üniversitesi', 'Boğaziçi Üniversitesi', 'Ankara Üniversitesi'],
    subclass: true,
    filter: '?i wdt:P17 wd:Q43 . FILTER NOT EXISTS { ?i wdt:P576 ?end } .',
    yearProps: ['P571']
  },
  dunya_kupasi: {
    seeds: ['Brezilya millî futbol takımı', 'Almanya millî futbol takımı', 'Arjantin millî futbol takımı', 'Fransa millî futbol takımı'],
    manualPrimary: true,
    yearProps: ['P571']
  },
  yaz_olimpiyati: {
    seeds: ['Atina', 'Paris', 'Londra', 'Tokyo'],
    customCountSparql: `
      SELECT ?i ?l (GROUP_CONCAT(DISTINCT ?a; separator="|") AS ?al) (MIN(?d) AS ?y) ?sl ?trt WHERE {
        ?g wdt:P31 wd:Q159821 ; wdt:P276 ?i .
        ?i wdt:P31/wdt:P279* wd:Q515 .
        OPTIONAL { ?i rdfs:label ?l FILTER(lang(?l)="tr") }
        OPTIONAL { ?i skos:altLabel ?a FILTER(lang(?a)="tr") }
        OPTIONAL { ?g wdt:P585 ?d }
        OPTIONAL { ?w schema:about ?i ; schema:isPartOf <https://tr.wikipedia.org/> ; schema:name ?trt }
        ?i wikibase:sitelinks ?sl .
      } GROUP BY ?i ?l ?sl ?trt LIMIT 200`,
    yearProps: ['P585']
  },
  uzay_sondasi: {
    seeds: ['Voyager 1', 'Cassini-Huygens', 'New Horizons', 'Juno (uzay aracı)'],
    subclass: true,
    yearProps: ['P619', 'P571']
  },
  uydu_dogal: {
    seeds: ['Ay', 'Europa (uydu)', 'Titan (uydu)', 'Phobos (uydu)'],
    subclass: true,
    yearProps: ['P575']
  },
  icat: {
    seeds: ['Matbaa', 'Tekerlek', 'Pusula', 'Telefon'],
    manualPrimary: true,
    yearProps: ['P575', 'P571']
  },
  mimar_sinan: {
    seeds: ['Süleymaniye Camii', 'Selimiye Camii (Edirne)', 'Şehzade Camii', 'Mihrimah Sultan Camii (Edirne)'],
    customCountSparql: `
      SELECT ?i ?l (GROUP_CONCAT(DISTINCT ?a; separator="|") AS ?al) (MIN(?d) AS ?y) ?sl ?trt WHERE {
        ?i wdt:P84 wd:Q167798 .
        OPTIONAL { ?i rdfs:label ?l FILTER(lang(?l)="tr") }
        OPTIONAL { ?i skos:altLabel ?a FILTER(lang(?a)="tr") }
        OPTIONAL { ?i wdt:P571 ?d }
        OPTIONAL { ?w schema:about ?i ; schema:isPartOf <https://tr.wikipedia.org/> ; schema:name ?trt }
        ?i wikibase:sitelinks ?sl .
      } GROUP BY ?i ?l ?sl ?trt LIMIT 500`,
    yearProps: ['P571']
  },
  istanbul_muzesi: {
    seeds: ['Topkapı Sarayı', 'İstanbul Arkeoloji Müzeleri', 'Pera Müzesi', 'Rahmi M. Koç Müzesi'],
    subclass: true,
    filter: '?i wdt:P131 wd:Q406 .',
    yearProps: ['P571', 'P1619']
  }
};

function parseArgs(argv) {
  const args = { only: null, offline: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--offline') args.offline = true;
    else if (argv[i] === '--only' && argv[i + 1]) {
      args.only = argv[++i];
    }
  }
  return args;
}

/**
 * Temsili tohum maddeler üzerinden P31 sınıf dağılımını sorgular (GROUP BY ?t).
 */
async function probeP31Distribution(seeds, opts) {
  if (!seeds || seeds.length === 0) return { seedQids: [], dist: [] };
  const qidMap = await getQidsForTitles(seeds, opts);
  const seedQids = Object.values(qidMap);
  if (seedQids.length === 0) return { seedQids: [], dist: [] };

  const values = seedQids.map((q) => `wd:${q}`).join(' ');
  const sparql = `
    SELECT ?t ?tLabel (COUNT(DISTINCT ?i) AS ?n) WHERE {
      VALUES ?i { ${values} }
      ?i wdt:P31 ?t .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "tr,en". }
    } GROUP BY ?t ?tLabel ORDER BY DESC(?n) LIMIT 15
  `;
  const rows = await querySparql(sparql, opts);
  const dist = rows.map((r) => ({
    qid: qidOf(val(r, 't')),
    label: val(r, 'tLabel') || '',
    count: parseInt(val(r, 'n') || '0', 10)
  })).filter((d) => d.qid);

  return { seedQids, dist };
}

function pickBestClass(dist, knownClass) {
  if (knownClass) {
    const found = dist.find((d) => d.qid === knownClass);
    return {
      qid: knownClass,
      label: found ? found.label : '(doğrulanmış)',
      votes: found ? found.count : 0
    };
  }
  // Genel gürültü sınıflarını (Wikimedia disambiguation, insan vb. hariç; meslek/ülke hariç) elemeden önce en yüksek oyu seç
  const skip = new Set(['Q4167410', 'Q13406463', 'Q11266439']);
  const filtered = dist.filter((d) => !skip.has(d.qid));
  const top = filtered[0] || dist[0];
  return top ? { qid: top.qid, label: top.label, votes: top.count } : null;
}

function buildClassQuery(classQid, cfg, limit) {
  const pathExpr = cfg.subclass ? 'wdt:P31/wdt:P279*' : 'wdt:P31';
  const yProps = cfg.yearProps && cfg.yearProps.length ? cfg.yearProps : ['P571'];
  const yUnion = yProps.map((p) => `{ ?i wdt:${p} ?d }`).join(' UNION ');
  return `
    SELECT ?i ?l (GROUP_CONCAT(DISTINCT ?a; separator="|") AS ?al) (MIN(?d) AS ?y) ?sl ?trt WHERE {
      {
        SELECT DISTINCT ?i WHERE {
          ?i ${pathExpr} wd:${classQid} .
          ${cfg.filter || ''}
        } LIMIT ${limit}
      }
      OPTIONAL { ?i rdfs:label ?l FILTER(lang(?l)="tr") }
      OPTIONAL { ?i skos:altLabel ?a FILTER(lang(?a)="tr") }
      OPTIONAL { ${yUnion} }
      OPTIONAL { ?w schema:about ?i ; schema:isPartOf <https://tr.wikipedia.org/> ; schema:name ?trt }
      ?i wikibase:sitelinks ?sl .
    } GROUP BY ?i ?l ?sl ?trt
  `;
}

function computeStats(rows, expect) {
  const byQid = new Map();
  for (const r of rows) {
    const qid = qidOf(val(r, 'i'));
    if (!qid) continue;
    const trLabel = val(r, 'l');
    const alRaw = val(r, 'al') || '';
    const yRaw = val(r, 'y');
    const trt = val(r, 'trt');
    const prev = byQid.get(qid);
    if (!prev) {
      byQid.set(qid, {
        hasTrLabel: Boolean(trLabel),
        hasAlias: alRaw.split('|').some((x) => x.trim().length > 0),
        hasYear: parseYear(yRaw) !== null,
        hasTrwiki: Boolean(trt)
      });
    } else {
      prev.hasTrLabel = prev.hasTrLabel || Boolean(trLabel);
      prev.hasAlias = prev.hasAlias || alRaw.split('|').some((x) => x.trim().length > 0);
      prev.hasYear = prev.hasYear || (parseYear(yRaw) !== null);
      prev.hasTrwiki = prev.hasTrwiki || Boolean(trt);
    }
  }
  const n = byQid.size;
  if (n === 0) {
    return { count: 0, trLabelPct: 0, trAliasPct: 0, yearPct: 0, trwikiPct: 0, diff: expect ? -expect : null };
  }
  let cTr = 0, cAl = 0, cYr = 0, cWiki = 0;
  for (const v of byQid.values()) {
    if (v.hasTrLabel) cTr++;
    if (v.hasAlias) cAl++;
    if (v.hasYear) cYr++;
    if (v.hasTrwiki) cWiki++;
  }
  const pct = (c) => Math.round((c / n) * 100);
  return {
    count: n,
    trLabelPct: pct(cTr),
    trAliasPct: pct(cAl),
    yearPct: pct(cYr),
    trwikiPct: pct(cWiki),
    diff: expect ? (n - expect) : null
  };
}

const TARAYICI_SEED_TITLES = [
  'Google Chrome',
  'Opera (web tarayıcısı)',
  'Mozilla Firefox',
  'Safari (web tarayıcısı)',
  'Microsoft Edge',
  'Brave (web tarayıcısı)',
  'Vivaldi (web tarayıcısı)',
  'Internet Explorer',
  'Netscape Navigator',
  'Mosaic (web tarayıcısı)',
  'Lynx (web tarayıcısı)',
  'WorldWideWeb',
  'Konqueror',
  'Chromium'
];

/**
 * Pilot TARAYICI: sınıf (Q6368 P31/P279*) + elle seed liste (üyeye özel HTTP yok).
 */
async function runTarayiciPilot(classQid, opts) {
  const baseQuery = `
    SELECT ?i ?l ?enl (GROUP_CONCAT(DISTINCT ?a; separator="|") AS ?al) (MIN(?d) AS ?y) ?sl ?trt WHERE {
      ?i wdt:P31/wdt:P279* wd:${classQid} .
      OPTIONAL { ?i rdfs:label ?l FILTER(lang(?l)="tr") }
      OPTIONAL { ?i rdfs:label ?enl FILTER(lang(?enl)="en") }
      OPTIONAL { ?i skos:altLabel ?a FILTER(lang(?a)="tr") }
      OPTIONAL { { ?i wdt:P571 ?d } UNION { ?i wdt:P577 ?d } }
      OPTIONAL { ?w schema:about ?i ; schema:isPartOf <https://tr.wikipedia.org/> ; schema:name ?trt }
      ?i wikibase:sitelinks ?sl .
      FILTER(BOUND(?l) || BOUND(?trt) || BOUND(?enl))
    } GROUP BY ?i ?l ?enl ?sl ?trt ORDER BY ?i
  `;

  const rows = await querySparqlPaged(baseQuery, { ...opts, pageSize: 2000, maxRows: 10000 });

  // Seed listeyi tek toplu trwiki isteğiyle QID'ye çevir ve eksikse SPARQL VALUES ile ekle
  const seedQidMap = await getQidsForTitles(TARAYICI_SEED_TITLES, opts);
  const seedQids = [...new Set(Object.values(seedQidMap).filter(Boolean))];
  if (seedQids.length > 0) {
    const seedValues = seedQids.map((q) => `wd:${q}`).join(' ');
    const seedQuery = `
      SELECT ?i ?l ?enl (GROUP_CONCAT(DISTINCT ?a; separator="|") AS ?al) (MIN(?d) AS ?y) ?sl ?trt WHERE {
        VALUES ?i { ${seedValues} }
        OPTIONAL { ?i rdfs:label ?l FILTER(lang(?l)="tr") }
        OPTIONAL { ?i rdfs:label ?enl FILTER(lang(?enl)="en") }
        OPTIONAL { ?i skos:altLabel ?a FILTER(lang(?a)="tr" || lang(?a)="en") }
        OPTIONAL { { ?i wdt:P571 ?d } UNION { ?i wdt:P577 ?d } UNION { ?i wdt:P575 ?d } }
        OPTIONAL { ?w schema:about ?i ; schema:isPartOf <https://tr.wikipedia.org/> ; schema:name ?trt }
        ?i wikibase:sitelinks ?sl .
      } GROUP BY ?i ?l ?enl ?sl ?trt
    `;
    const seedRows = await querySparql(seedQuery, opts);
    rows.push(...seedRows);
  }

  const byQid = new Map();

  for (const r of rows) {
    const qid = qidOf(val(r, 'i'));
    if (!qid) continue;
    const trLabel = val(r, 'l');
    const enLabel = val(r, 'enl');
    const trt = val(r, 'trt');
    const sl = parseInt(val(r, 'sl') || '0', 10);
    const y = parseYear(val(r, 'y'));
    const alList = (val(r, 'al') || '').split('|').map((x) => x.trim()).filter(Boolean);

    let rec = byQid.get(qid);
    if (!rec) {
      rec = { qid, trLabel, enLabel, trt, sitelinks: sl, years: [], rawAliases: new Set(alList) };
      byQid.set(qid, rec);
    } else {
      if (!rec.trLabel && trLabel) rec.trLabel = trLabel;
      if (!rec.enLabel && enLabel) rec.enLabel = enLabel;
      if (!rec.trt && trt) rec.trt = trt;
      if (sl > rec.sitelinks) rec.sitelinks = sl;
      for (const a of alList) rec.rawAliases.add(a);
    }
    if (y !== null) rec.years.push(y);
  }

  // Etiket seçimi ve çakışma seti
  const preliminary = [];
  const labelSet = new Set();
  for (const rec of byQid.values()) {
    const cleanTrt = rec.trt ? rec.trt.replace(/\s*\([^)]*\)\s*$/, '').trim() : null;
    const label = rec.trLabel || cleanTrt || rec.enLabel || rec.qid;
    labelSet.add(fold(label));
    preliminary.push({ rec, label, cleanTrt });
  }

  const finalRecords = [];
  for (const { rec, label, cleanTrt } of preliminary) {
    const rawList = [...rec.rawAliases];
    if (rec.trLabel && rec.trLabel !== label) rawList.push(rec.trLabel);
    if (cleanTrt && cleanTrt !== label) rawList.push(cleanTrt);
    if (rec.enLabel && rec.enLabel !== label) rawList.push(rec.enLabel);
    const { accepted } = filterAliases(label, rawList, labelSet);
    const minYear = rec.years.length > 0 ? Math.min(...rec.years) : null;
    finalRecords.push({
      label,
      aliases: accepted,
      year: minYear,
      qid: rec.qid,
      sitelinks: rec.sitelinks,
      enLabel: rec.enLabel || null
    });
  }

  finalRecords.sort((a, b) => b.sitelinks - a.sitelinks || a.label.localeCompare(b.label, 'tr'));
  fs.writeFileSync(path.join(OUT_DIR, 'pilot_tarayici.json'), JSON.stringify(finalRecords, null, 2), 'utf8');

  // 12 adayı kontrol et: önce TAM ETİKET EŞİTLİĞİ (tr veya en, büyük-küçük/diakritik duyarsız), ikincil olarak "içerir", en yüksek sitelinks kazanır
  const candidates = [
    'Chrome', 'Opera', 'Firefox', 'Safari', 'Edge', 'Brave',
    'Vivaldi', 'Internet Explorer', 'Netscape', 'Mosaic', 'Lynx', 'WorldWideWeb'
  ];

  const candidateResults = [];
  const missingYearOrItem = [];

  for (const cand of candidates) {
    const cf = fold(cand);
    const exactMatches = finalRecords.filter((r) =>
      fold(r.label) === cf ||
      (r.enLabel && fold(r.enLabel) === cf) ||
      r.aliases.some((a) => fold(a) === cf)
    );
    let match = exactMatches[0] || null;
    if (!match) {
      const containsMatches = finalRecords.filter((r) =>
        fold(r.label).includes(cf) ||
        (r.enLabel && fold(r.enLabel).includes(cf)) ||
        r.aliases.some((a) => fold(a).includes(cf))
      );
      match = containsMatches[0] || null;
    }

    if (match) {
      candidateResults.push({
        candidate: cand,
        found: true,
        label: match.label,
        qid: match.qid,
        year: match.year,
        aliasCount: match.aliases.length,
        aliases: match.aliases.slice(0, 6)
      });
      if (match.year === null) {
        missingYearOrItem.push(`${cand} (${match.qid}, ${match.label}) # Wikidata P571/P575/P577 yıl yok — manuel doğrulanacak`);
      }
    } else {
      candidateResults.push({ candidate: cand, found: false, label: null, qid: null, year: null, aliasCount: 0, aliases: [] });
      missingYearOrItem.push(`${cand} # Wikidata/trwiki tam çekimde bulunamadı — manuel eklenecek`);
    }
  }

  const missingText = missingYearOrItem.length > 0
    ? missingYearOrItem.join('\n') + '\n'
    : '# Eksik veya yılsız tarayıcı adayı yok.\n';
  fs.writeFileSync(path.join(OUT_DIR, 'manuel_eksik_tarayici.txt'), missingText, 'utf8');

  return {
    total: finalRecords.length,
    candidateResults,
    missing: missingYearOrItem,
    stats: computeStats(rows, null)
  };
}

function writeOutputs(classesOut, probeRows, pilotSummary, args) {
  fs.writeFileSync(path.join(OUT_DIR, 'classes.json'), JSON.stringify(classesOut, null, 2), 'utf8');

  const lines = [
    '# PUSULLA F0 Veri Sondası (PROBE)',
    '',
    '| # | Konu | Eksen | Mod | Seçilen Sınıf (Q) | Üye | TR Etiket % | TR Alias % | Yıl % | TRWiki % | Kapalı Karşılaştırma | Not |',
    '|---:|---|---|---|---|---:|---:|---:|---:|---:|---|---|'
  ];
  for (const r of probeRows) {
    lines.push(`| ${r.no} | ${r.ad} | ${r.eksen} | ${r.mod} | ${r.qid} | ${r.count} | %${r.trLabelPct} | %${r.trAliasPct} | %${r.yearPct} | %${r.trwikiPct} | ${r.closedCmp} | ${r.note} |`);
  }

  if (pilotSummary) {
    lines.push('', '## Pilot TARAYICI Kontrolü (12 Aday)', '');
    lines.push(`- Toplam çekilen üye: **${pilotSummary.total}** (açık küme kararı: \`closed: false\`, sayfalı tam çekim + seed).`);
    lines.push(`- Eksik/yılsız aday sayısı: **${pilotSummary.missing.length}** (${pilotSummary.missing.join('; ') || 'yok'}).`, '');
    lines.push('| Aday | Durum | Etiket | QID | Yıl | Alias Sayısı | Örnek Aliaslar |');
    lines.push('|---|---|---|---|---:|---:|---|');
    for (const c of pilotSummary.candidateResults) {
      lines.push(`| ${c.candidate} | ${c.found ? 'BULUNDU' : 'EKSİK'} | ${c.label || '—'} | ${c.qid || '—'} | ${c.year ?? 'bilinmiyor'} | ${c.aliasCount} | ${c.aliases.join(', ') || '—'} |`);
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, 'PROBE.md'), lines.join('\n') + '\n', 'utf8');

  const summaryMd = [
    '# 00_probe.js Özeti',
    '',
    `- İşlenen soru sayısı: ${probeRows.length}`,
    `- Çıktılar: \`out/PROBE.md\`, \`out/classes.json\`${pilotSummary ? ', `out/pilot_tarayici.json`, `out/manuel_eksik_tarayici.txt`' : ''}`,
    `- Çevrimdışı mod: ${args.offline ? 'evet' : 'hayır'}`
  ].join('\n') + '\n';
  fs.writeFileSync(path.join(OUT_DIR, '00_probe.md'), summaryMd, 'utf8');
}

async function main() {
  const startedAt = Date.now();
  const args = parseArgs(process.argv);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const plan = JSON.parse(fs.readFileSync(PLAN_PATH, 'utf8'));
  const targets = args.only ? plan.filter((p) => p.poolId === args.only) : plan;
  const targetIds = new Set(targets.map((t) => t.poolId));

  const classesOut = {};
  const probeRows = plan.map((item) => ({
    poolId: item.poolId,
    no: item.no,
    ad: item.ad,
    eksen: item.eksen,
    mod: item.mod,
    qid: '—',
    count: 0,
    trLabelPct: 0,
    trAliasPct: 0,
    yearPct: 0,
    trwikiPct: 0,
    closedCmp: item.mod === 'k' ? (item.beklenen ? `0/${item.beklenen} (bekliyor)` : '0/sabitlenecek') : '—',
    note: targetIds.has(item.poolId) ? 'bekliyor' : 'atlandı (--only)'
  }));
  let pilotSummary = null;

  for (const item of targets) {
    const cfg = TOPIC_CONFIG[item.poolId] || {};
    process.stdout.write(`[${item.no}/42] ${item.poolId}... `);

    const qCtrl = new AbortController();
    const qTimer = setTimeout(() => qCtrl.abort(new Error('60sn zaman aşımı')), 60000);
    const qOpts = { ...args, signal: qCtrl.signal, timeoutMs: 45000 };

    let p31Info = { seedQids: [], dist: [] };
    let selectedClass = null;
    let stats = null;
    let statusNote = '';

    try {
      p31Info = await probeP31Distribution(cfg.seeds, qOpts);
      selectedClass = pickBestClass(p31Info.dist, cfg.knownClass);

      if (item.poolId === 'tarayici' && selectedClass) {
        pilotSummary = await runTarayiciPilot(selectedClass.qid, qOpts);
        stats = pilotSummary.stats;
        stats.count = pilotSummary.total;
      } else if (cfg.manualPrimary) {
        statusNote = 'elle/trwiki ağırlıklı';
        stats = { count: 0, trLabelPct: 0, trAliasPct: 0, yearPct: 0, trwikiPct: 0, diff: item.beklenen ? -item.beklenen : null };
      } else if (cfg.customCountSparql) {
        const rows = await querySparql(cfg.customCountSparql, qOpts);
        stats = computeStats(rows, item.beklenen);
        statusNote = 'özel sorgu';
      } else if (selectedClass) {
        const limit = cfg.openCap ? 1000 : 5000;
        const sparql = buildClassQuery(selectedClass.qid, cfg, limit);
        const rows = await querySparql(sparql, qOpts);
        stats = computeStats(rows, item.beklenen);
        if (cfg.openCap && rows.length >= limit) statusNote = `örneklem (${limit})`;
      } else {
        stats = { count: 0, trLabelPct: 0, trAliasPct: 0, yearPct: 0, trwikiPct: 0, diff: item.beklenen ? -item.beklenen : null };
        statusNote = 'sınıf bulunamadı';
      }

      console.log(`Q=${selectedClass ? selectedClass.qid : '-'} n=${stats.count} yil=${stats.yearPct}%`);
    } catch (err) {
      const msg = String(err && err.message ? err.message : err).replace(/\s+/g, ' ').trim();
      console.log(`HATA: ${msg}`);
      stats = { count: 0, trLabelPct: 0, trAliasPct: 0, yearPct: 0, trwikiPct: 0, diff: item.beklenen ? -item.beklenen : null };
      statusNote = `HATA: ${msg.slice(0, 60)}`;
    } finally {
      clearTimeout(qTimer);
    }

    classesOut[item.poolId] = {
      no: item.no,
      ad: item.ad,
      mod: item.mod,
      eksen: item.eksen,
      beklenen: item.beklenen,
      selectedClass,
      seedQids: p31Info.seedQids,
      p31Distribution: p31Info.dist,
      stats,
      statusNote
    };

    let closedCmp = '—';
    if (item.mod === 'k') {
      if (item.beklenen) {
        const diff = stats.count - item.beklenen;
        const ok = diff === 0 ? 'TAM' : (diff < 0 ? `EKSİK (${diff})` : `FAZLA (+${diff})`);
        closedCmp = `${stats.count}/${item.beklenen} (${ok})`;
      } else {
        closedCmp = `${stats.count}/sabitlenecek`;
      }
    }

    const rowIdx = probeRows.findIndex((r) => r.poolId === item.poolId);
    if (rowIdx >= 0) {
      probeRows[rowIdx] = {
        poolId: item.poolId,
        no: item.no,
        ad: item.ad,
        eksen: item.eksen,
        mod: item.mod,
        qid: selectedClass ? `${selectedClass.qid} (${selectedClass.label})` : 'bilinmiyor',
        count: stats.count,
        trLabelPct: stats.trLabelPct,
        trAliasPct: stats.trAliasPct,
        yearPct: stats.yearPct,
        trwikiPct: stats.trwikiPct,
        closedCmp,
        note: statusNote
      };
    }

    writeOutputs(classesOut, probeRows, pilotSummary, args);
  }

  const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`Tamamlandı (${targets.length} soru, ${elapsedSec} sn).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
