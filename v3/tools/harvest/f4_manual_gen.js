'use strict';

const fs = require('fs');
const path = require('path');
const { cachedFetchJson } = require('./lib/http');

const OUT_DIR = path.join(__dirname, 'out');
const MANUAL_DIR = path.resolve(__dirname, '../../data/manual');
const VERIFIED_BY = 'agy-hydrogen-f4-c';

function readRaw(poolId) {
  const p = path.join(OUT_DIR, `raw_${poolId}.json`);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeManual(poolId, obj) {
  fs.mkdirSync(MANUAL_DIR, { recursive: true });
  const filePath = path.join(MANUAL_DIR, `${poolId}.js`);
  const content =
    `'use strict';\n\n` +
    `(function (root) {\n` +
    `  root.PUSULLA_MANUAL = root.PUSULLA_MANUAL || {};\n` +
    `  root.PUSULLA_MANUAL[${JSON.stringify(poolId)}] = ${JSON.stringify(obj, null, 2)};\n` +
    `  if (typeof module !== 'undefined' && module.exports) {\n` +
    `    module.exports = root.PUSULLA_MANUAL;\n` +
    `  }\n` +
    `})(typeof globalThis !== 'undefined' ? globalThis : this);\n`;
  fs.writeFileSync(filePath, content, 'utf8');
}

function genIstIlce() {
  writeManual('ist_ilce', {
    verifiedBy: VERIFIED_BY,
    expectNote: 'Istanbul 39 ilce (Zeytinburnu cift kayit ve (ilce) ekleri duzeltildi, 4 eksik ilce eklendi)',
    drop: [
      'Zeytinburnu (ilçe)',
      'Bağcılar (ilçe)',
      'Beylikdüzü (ilçe)',
      'Sancaktepe (ilçe)',
      'Üsküdar (ilçe)',
      'Silivri (ilçe)',
      'Çatalca (ilçe)'
    ],
    add: [
      { label: 'Bağcılar', aliases: ['Bağcılar (ilçe)'], year: 1992, approx: false, src: 'Q49101229', note: 'Vikiveri Q49101229 (parantezsiz etiket)' },
      { label: 'Beylikdüzü', aliases: ['Beylikdüzü (ilçe)'], year: null, approx: false, src: 'Q49101303', note: 'Vikiveri Q49101303 (parantezsiz etiket)' },
      { label: 'Sancaktepe', aliases: ['Sancaktepe (ilçe)'], year: null, approx: false, src: 'Q49108520', note: 'Vikiveri Q49108520 (parantezsiz etiket)' },
      { label: 'Üsküdar', aliases: ['Üsküdar (ilçe)'], year: null, approx: false, src: 'Q49110521', note: 'Vikiveri Q49110521 (parantezsiz etiket)' },
      { label: 'Silivri', aliases: ['Silivri (ilçe)'], year: 1928, approx: false, src: 'Q1967926', note: 'Vikiveri Q1967926 (parantezsiz etiket)' },
      { label: 'Çatalca', aliases: ['Çatalca (ilçe)'], year: null, approx: false, src: 'Q1968049', note: 'Vikiveri Q1968049 (parantezsiz etiket)' },
      { label: 'Çekmeköy', aliases: [], year: null, approx: false, note: 'genel bilgi - Vikipedi Istanbul ilceleri ile dogrulanacak' },
      { label: 'Eyüpsultan', aliases: ['Eyüp'], year: null, approx: false, note: 'genel bilgi - Vikipedi Istanbul ilceleri ile dogrulanacak' },
      { label: 'Gaziosmanpaşa', aliases: [], year: null, approx: false, note: 'genel bilgi - Vikipedi Istanbul ilceleri ile dogrulanacak' },
      { label: 'Şile', aliases: [], year: null, approx: false, note: 'genel bilgi - Vikipedi Istanbul ilceleri ile dogrulanacak' }
    ],
    alias: {},
    year: {}
  });
}

function genTrIl() {
  writeManual('tr_il', {
    verifiedBy: VERIFIED_BY,
    expectNote: '81 il tamam (Vikiveri P31=Q48336)',
    drop: [],
    add: [],
    alias: {},
    year: {}
  });
}

function genUlke() {
  writeManual('ulke', {
    verifiedBy: VERIFIED_BY,
    expectNote: 'BM 193 uye + 2 gozlemci (Vatikan, Filistin) = 195; Kosova ham veride yok, Tayvan cikarildi',
    drop: ['Tayvan'],
    add: [],
    alias: {},
    year: {}
  });
}

function genBaskent() {
  writeManual('baskent', {
    verifiedBy: VERIFIED_BY,
    expectNote: 'ulke havuzuyla uyumlu 195 tekil baskent (cok baskentli ulkelerde 1 ana baskent secildi, Antigua ve Barbuda baskenti St. Johns eklendi)',
    drop: [
      'Taipei',
      'Doğu Kudüs',
      'Tel Aviv',
      'Kap Şehri',
      'Bloemfontein',
      'Sucre',
      'Aden',
      'Kolombo',
      'Lobamba',
      'Lahey',
      'Cotonou',
      'Putrajaya',
      'Nusantara'
    ],
    add: [
      {
        label: "St. John's",
        aliases: ["Saint John's"],
        year: null,
        approx: false,
        src: 'Q36262',
        note: 'Antigua ve Barbuda baskenti, Vikiveri Q36262 - genel bilgi - Vikipedi St. Johns ile dogrulanacak'
      }
    ],
    alias: {
      'Brüksel Şehri': ['Brüksel'],
      'Gietaga': ['Gitega'],
      'Cuba': ['Juba'],
      "Sana'a": ['Sana'],
      'Sri Jayawardenapura-Kotte': ['Kotte'],
      'La Paz': ['Sucre (anayasal)'],
      'Pretoria': ['Cape Town (yasama)', 'Bloemfontein (yargi)'],
      'Amsterdam': ['Lahey (hukumet merkezi)']
    },
    year: {}
  });
}

function genSuperLig() {
  const raw = readRaw('super_lig');
  const keepQids = new Set([
    'Q495299',  // Galatasaray
    'Q6601875', // Fenerbahçe
    'Q172567',  // Beşiktaş
    'Q192641',  // Trabzonspor
    'Q857938',  // İstanbul Başakşehir FK
    'Q430107',  // Samsunspor
    'Q513840',  // Konyaspor
    'Q43710',   // Antalyaspor
    'Q608122',  // Kayserispor
    'Q272712',  // Çaykur Rizespor
    'Q1636019', // Alanyaspor
    'Q824850',  // Gaziantep FK
    'Q1423118', // Göztepe SK
    'Q118919',  // Eyüpspor
    'Q138230',  // Kasımpaşa SK
    'Q513237',  // Kocaelispor
    'Q641373',  // Gençlerbirliği SK
    'Q1398111'  // Fatih Karagümrük SK
  ]);

  const renameMap = new Map([
    ['Q857938', { label: 'İstanbul Başakşehir', aliases: ['İstanbul Başakşehir FK', 'Başakşehir'], year: 2014 }],
    ['Q1423118', { label: 'Göztepe', aliases: ['Göztepe SK'], year: 1925 }],
    ['Q138230', { label: 'Kasımpaşa', aliases: ['Kasımpaşa SK'], year: 1921 }],
    ['Q641373', { label: 'Gençlerbirliği', aliases: ['Gençlerbirliği SK'], year: 1923 }],
    ['Q1398111', { label: 'Fatih Karagümrük', aliases: ['Fatih Karagümrük SK', 'Karagümrük'], year: 1926 }]
  ]);

  const drop = [];
  const add = [];
  for (const r of raw.rows) {
    if (!keepQids.has(r.src) || renameMap.has(r.src)) {
      drop.push(r.label);
    }
    if (renameMap.has(r.src)) {
      const info = renameMap.get(r.src);
      add.push({
        label: info.label,
        aliases: info.aliases,
        year: r.year || info.year,
        approx: false,
        src: r.src,
        note: `Vikiveri ${r.src} (Turkce dogal yazim)`
      });
    }
  }

  writeManual('super_lig', {
    verifiedBy: VERIFIED_BY,
    expectNote: '2025-26 Trendyol Super Lig 18 takim (ham 458 adaydan ayiklandi)',
    drop,
    add,
    alias: {
      'Çaykur Rizespor': ['Rizespor'],
      'Gaziantep FK': ['Gaziantep']
    },
    year: {}
  });
}

function genElement() {
  writeManual('element', {
    verifiedBy: VERIFIED_BY,
    expectNote: '118 kimyasal element (4 varsayimsal >118 element cikarildi; antik/eksik yillar Vikipedi kesfedilen elementler listesi ile dolduruldu)',
    drop: ['ununennium', 'Unbiniliyum', 'Unbiseptiyum', 'Unbihexium'],
    add: [],
    alias: {},
    year: {
      'bakır': { year: -5000, approx: true, note: 'antik bilinen (lib/years alt siniri -5000), genel bilgi - Vikipedi Kesfedilen elementler listesi ile dogrulanacak' },
      'altın': { year: -5000, approx: true, note: 'antik bilinen (lib/years alt siniri -5000), genel bilgi - Vikipedi Kesfedilen elementler listesi ile dogrulanacak' },
      'kurşun': { year: -5000, approx: true, note: 'antik bilinen (lib/years alt siniri -5000), genel bilgi - Vikipedi Kesfedilen elementler listesi ile dogrulanacak' },
      'kalay': { year: -3500, approx: true, note: 'Tunc Cagi / antik bilinen, genel bilgi - Vikipedi Kesfedilen elementler listesi ile dogrulanacak' },
      'cıva': { year: -1500, approx: true, note: 'antik bilinen (~MO 1500), genel bilgi - Vikipedi Kesfedilen elementler listesi ile dogrulanacak' },
      'antimon': { year: 1450, approx: true, note: 'antik bilinen, ilk yazili ayristirma ~1450, genel bilgi - Vikipedi Kesfedilen elementler listesi ile dogrulanacak' },
      'Çinko': { year: 1746, approx: true, note: 'antik pirinc kullanimi; saf metal izole 1746 Marggraf, genel bilgi - Vikipedi Kesfedilen elementler listesi ile dogrulanacak' },
      'Bizmut': { year: 1753, approx: true, note: '1753 Claude Francois Geoffroy (onceki kullanim ~1400), genel bilgi - Vikipedi Kesfedilen elementler listesi ile dogrulanacak' }
    }
  });
}

function genGezegen() {
  writeManual('gezegen', {
    verifiedBy: VERIFIED_BY,
    expectNote: '8 gezegen + 5 cuce gezegen (Pluton, Eris, Haumea, Makemake, Ceres) = 13',
    drop: [],
    add: [
      { label: 'Merkür', aliases: [], year: -3000, approx: true, note: 'tarih oncesi/antik bilinen, yaklasik - genel bilgi - Vikipedi Merkur ile dogrulanacak' },
      { label: 'Venüs', aliases: ['Çoban Yıldızı'], year: -3000, approx: true, note: 'tarih oncesi/antik bilinen, yaklasik - genel bilgi - Vikipedi Venus ile dogrulanacak' },
      { label: 'Dünya', aliases: ['Yer', 'Yeryüzü'], year: -3000, approx: true, note: 'tarih oncesi/antik bilinen (Dunya icin kesif kavrami yok, yaklasik) - genel bilgi - Vikipedi Dunya ile dogrulanacak' },
      { label: 'Mars', aliases: ['Kızıl Gezegen'], year: -3000, approx: true, note: 'tarih oncesi/antik bilinen, yaklasik - genel bilgi - Vikipedi Mars ile dogrulanacak' },
      { label: 'Jüpiter', aliases: [], year: -3000, approx: true, note: 'tarih oncesi/antik bilinen, yaklasik - genel bilgi - Vikipedi Jupiter ile dogrulanacak' },
      { label: 'Satürn', aliases: [], year: -3000, approx: true, note: 'tarih oncesi/antik bilinen, yaklasik - genel bilgi - Vikipedi Saturn ile dogrulanacak' },
      { label: 'Uranüs', aliases: [], year: 1781, approx: false, note: 'William Herschel, 1781 - genel bilgi - Vikipedi Uranus ile dogrulanacak' },
      { label: 'Neptün', aliases: [], year: 1846, approx: false, note: '1846 - genel bilgi - Vikipedi Neptun ile dogrulanacak' },
      { label: 'Ceres', aliases: [], year: 1801, approx: false, note: 'Giuseppe Piazzi, 1801 (cuce gezegen) - genel bilgi - Vikipedi Ceres ile dogrulanacak' },
      { label: 'Plüton', aliases: ['Pluton'], year: 1930, approx: false, note: 'Clyde Tombaugh, 1930 (cuce gezegen) - genel bilgi - Vikipedi Pluton ile dogrulanacak' },
      { label: 'Haumea', aliases: [], year: 2004, approx: true, note: '2004 (cuce gezegen, kesif tartismali) - genel bilgi - Vikipedi Haumea ile dogrulanacak' },
      { label: 'Makemake', aliases: [], year: 2005, approx: false, note: '2005 (cuce gezegen) - genel bilgi - Vikipedi Makemake ile dogrulanacak' },
      { label: 'Eris', aliases: [], year: 2005, approx: false, note: '2005 (cuce gezegen) - genel bilgi - Vikipedi Eris ile dogrulanacak' }
    ],
    alias: {},
    year: {}
  });
}

function genOsmanliPadisahi() {
  writeManual('osmanli_padisahi', {
    verifiedBy: VERIFIED_BY,
    expectNote: 'Osman Gazi -> VI. Mehmed 36 Osmanli padisahi (sehzade, Fetret ve 1922 sonrasi hanedan reisleri cikarildi)',
    drop: [
      'Cem Sultan',
      'Mehmed Orhan Osmanoğlu',
      'İsa Çelebi',
      'Musa Çelebi',
      'Şehzade Mehmed Abdulaziz',
      'Ahmed Nihad Osmanoğlu',
      'Ali Vasıb Osmanoğlu',
      'Osman Fuat Osmanoğlu',
      'Şehzade Mehmed Ertuğrul'
    ],
    add: [],
    alias: {
      'Osman Gazi': ['I. Osman', 'Osman Bey'],
      'Orhan': ['Orhan Gazi'],
      'II. Bayezid': ['!Divan Edebiyatı Müzesi'],
      'II. Mehmed': ['Fatih Sultan Mehmed', 'Fatih Sultan Mehmet', 'Fatih'],
      'I. Selim': ['Yavuz Sultan Selim', 'Yavuz'],
      'Kanuni Sultan Süleyman': ['I. Süleyman', 'Kanuni'],
      'III. Mustafa': ['!Divan Edebiyatı Müzesi'],
      'III. Selim': ['!Divan Edebiyatı Müzesi'],
      'II. Abdülhamid': ['Abdülhamid', 'II. Abdülhamit'],
      'VI. Mehmed': ['Vahdettin', 'Mehmed Vahideddin']
    },
    year: {}
  });
}

function genCumhurbaskani() {
  writeManual('cumhurbaskani', {
    verifiedBy: VERIFIED_BY,
    expectNote: '12 Turkiye Cumhuriyeti Cumhurbaskani (3 vekil cikarildi)',
    drop: [
      'İhsan Sabri Çağlayangil',
      'Tekin Arıburun',
      'İbrahim Şevki Atasagun'
    ],
    add: [],
    alias: {
      'Mustafa Kemal Atatürk': ['Atatürk'],
      'İsmet İnönü': ['İnönü'],
      'Celâl Bayar': ['Celal Bayar', 'Bayar'],
      'Cemal Gürsel': ['Gürsel'],
      'Cevdet Sunay': ['Sunay'],
      'Fahri Korutürk': ['Korutürk'],
      'Kenan Evren': ['Evren'],
      'Turgut Özal': ['Özal'],
      'Süleyman Demirel': ['Demirel'],
      'Ahmet Necdet Sezer': ['Sezer'],
      'Abdullah Gül': ['Gül'],
      'Recep Tayyip Erdoğan': ['Erdoğan']
    },
    year: {}
  });
}

function genPixar() {
  writeManual('pixar', {
    verifiedBy: VERIFIED_BY,
    expectNote: 'Vizyona girmis 30 Pixar uzun metraj filmi (Oyuncak Hikayesi -> Hoplayanlar/Hoppers; kisa/gelecek/yapim-disi cikarildi, Cesur eklendi)',
    drop: [
      'Coco 2',
      'Gatto (film)',
      'Knick Knack',
      'Partly Cloudy',
      'Uçaklar',
      'Buzz Lightyear of Star Command: The Adventure Begins',
      'Care Bears: Journey to Joke-a-lot',
      'Pixar Short Films Collection Volume 1',
      'Light & Heavy',
      'Tiny Toy Stories',
      'Lava',
      'Pixar Short Films Collection, Volume 3',
      'A Spark Story',
      'Oyuncak Hikâyesi 5'
    ],
    add: [
      {
        label: 'Cesur',
        aliases: ['Brave'],
        year: 2012,
        approx: false,
        note: 'Pixar 2012 uzun metraj filmi, genel bilgi - Vikipedi Cesur (film, 2012) ile dogrulanacak'
      }
    ],
    alias: {
      'Oyuncak Hikâyesi': ['Toy Story'],
      'Bir Böceğin Yaşamı': ["A Bug's Life"],
      'Oyuncak Hikâyesi 2': ['Toy Story 2'],
      'Sevimli Canavarlar': ['Canavarlar Şirketi', 'Monsters, Inc.'],
      'Kayıp Balık Nemo': ['Finding Nemo'],
      'İnanılmaz Aile': ['Muhteşem Aile', 'The Incredibles'],
      'Arabalar': ['Cars'],
      'Ratatuy': ['Ratatouille'],
      'VOL-İ': ['WALL-E'],
      'Yukarı Bak': ['Up'],
      'Oyuncak Hikâyesi 3': ['Toy Story 3'],
      'Arabalar 2': ['Cars 2'],
      'Sevimli Canavarlar Üniversitesi': ['Canavarlar Üniversitesi', 'Monsters University'],
      'Ters Yüz': ['İçi Dışı', 'Inside Out'],
      'İyi Bir Dinozor': ['İyi Dinozor', 'The Good Dinosaur'],
      'Kayıp Balık Dory': ['Finding Dory'],
      'Arabalar 3': ['Cars 3'],
      'İnanılmaz Aile 2': ['Muhteşem Aile 2', 'Incredibles 2'],
      'Oyuncak Hikâyesi 4': ['Toy Story 4'],
      'Hadi Gidelim': ['İleri', 'Onward'],
      'Soul': ['Ruh'],
      'Luka': ['Luca'],
      'Kırmızı': ['Kırmızı Alarm', 'Turning Red'],
      'Işıkyılı': ['Lightyear'],
      'Elemental: Doğanın Güçleri': ['Elemental'],
      'Ters Yüz 2': ['İçimdekiler 2', 'Inside Out 2'],
      'Elio (film)': ['Elio'],
      'Hoplayanlar': ['Hoppers']
    },
    year: {}
  });
}

function genDkSampiyon() {
  writeManual('dk_sampiyon', {
    verifiedBy: VERIFIED_BY,
    expectNote: 'FIFA Dunya Kupasi sampiyonu olmus 8 ulke',
    drop: [],
    add: [
      { label: 'Uruguay', aliases: [], year: 1930, approx: false, note: 'FIFA' },
      { label: 'İtalya', aliases: [], year: 1934, approx: false, note: 'FIFA' },
      { label: 'Almanya', aliases: ['Batı Almanya'], year: 1954, approx: false, note: 'FIFA' },
      { label: 'Brezilya', aliases: [], year: 1958, approx: false, note: 'FIFA' },
      { label: 'İngiltere', aliases: [], year: 1966, approx: false, note: 'FIFA' },
      { label: 'Arjantin', aliases: [], year: 1978, approx: false, note: 'FIFA' },
      { label: 'Fransa', aliases: [], year: 1998, approx: false, note: 'FIFA' },
      { label: 'İspanya', aliases: [], year: 2010, approx: false, note: 'FIFA' }
    ],
    alias: {},
    year: {}
  });
}

async function genParaBirimi(offline) {
  const sparql = 'SELECT ?i ?code WHERE { ?i wdt:P498 ?code . FILTER NOT EXISTS { ?i wdt:P576 ?end } }';
  const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparql);
  const data = await cachedFetchJson(url, {
    offline,
    headers: { Accept: 'application/sparql-results+json' }
  });
  const activeQids = new Set();
  for (const b of data.results.bindings) {
    activeQids.add(b.i.value.split('/').pop());
  }
  const raw = readRaw('para_birimi');
  const matcher = require('../../matcher');
  const drop = [];
  const keptKeys = new Set();
  for (const r of raw.rows) {
    if (activeQids.has(r.src)) {
      keptKeys.add(matcher.normFold(r.label));
    } else {
      drop.push(r.label);
    }
  }
  const keepCount = keptKeys.size;
  writeManual('para_birimi', {
    verifiedBy: VERIFIED_BY,
    expectNote: `ISO 4217 (Vikiveri P498, P576 olmayanlar): ${keepCount}`,
    drop,
    add: [],
    alias: {
      'Azerbaycan manatı': ['!manat'],
      'Türkmenistan manatı': ['!manat']
    },
    year: {}
  });
  return keepCount;
}

function genOlimpiyatSehri() {
  const note = 'Vikipedi Yaz Olimpiyat Oyunlari listesi - dogrulanacak';
  writeManual('olimpiyat_sehri', {
    verifiedBy: VERIFIED_BY,
    expectNote: 'Vikipedi Yaz Olimpiyat Oyunlari listesi (1896-2024): 23 tekil ev sahibi sehir, ilk ev sahipligi yili',
    drop: [
      'Los Angeles Memorial Coliseum',
      'Münih Olimpiyat Stadyumu',
      'Üniversite Olimpiyat Stadyumu',
      'Montreal Olimpiyat Stadyumu',
      'Seul Olimpiyat Stadyumu',
      'Atina Olimpiyat Stadyumu',
      'Brisbane'
    ],
    add: [
      { label: 'Münih', aliases: ['Munich'], year: 1972, approx: false, note }
    ],
    alias: {
      'Meksiko': ['Mexico City']
    },
    year: {
      'Atina': { year: 1896, approx: false, note },
      'Paris': { year: 1900, approx: false, note },
      'St. Louis': { year: 1904, approx: false, note },
      'Londra': { year: 1908, approx: false, note },
      'Stockholm': { year: 1912, approx: false, note },
      'Anvers': { year: 1920, approx: false, note },
      'Amsterdam': { year: 1928, approx: false, note },
      'Los Angeles': { year: 1932, approx: false, note },
      'Berlin': { year: 1936, approx: false, note },
      'Helsinki': { year: 1952, approx: false, note },
      'Melbourne': { year: 1956, approx: false, note },
      'Roma': { year: 1960, approx: false, note },
      'Tokyo': { year: 1964, approx: false, note }
    }
  });
}

function genTarayici() {
  writeManual('tarayici', {
    verifiedBy: VERIFIED_BY,
    expectNote: 'Onayli tarayici aliaslari, Opera GX ve WorldWideWeb yili',
    drop: [],
    add: [
      {
        label: 'Opera GX',
        aliases: [],
        year: 2019,
        approx: false,
        note: 'genel bilgi - Vikipedi Opera GX ile dogrulanacak'
      }
    ],
    alias: {
      'Google Chrome': ['Chrome', 'Krom'],
      'Internet Explorer': ['IE', 'MSIE'],
      'Microsoft Edge': ['Edge'],
      'Mozilla Firefox': ['Firefox']
    },
    year: {
      'WorldWideWeb': {
        year: 1990,
        approx: false,
        note: 'Tim Berners-Lee, CERN, genel bilgi - Vikipedi WorldWideWeb ile dogrulanacak'
      }
    }
  });
}

async function main() {
  const offline = process.argv.includes('--offline');
  genIstIlce();
  genTrIl();
  genUlke();
  genBaskent();
  genSuperLig();
  genElement();
  genGezegen();
  genOsmanliPadisahi();
  genCumhurbaskani();
  genPixar();
  genDkSampiyon();
  const pbCount = await genParaBirimi(offline);
  genOlimpiyatSehri();
  genTarayici();
  console.log(`f4_manual_gen: 14 manual dosyasi uretildi (para_birimi=${pbCount}).`);
}

main().catch((err) => {
  console.error('HATA:', err.message);
  process.exit(1);
});
