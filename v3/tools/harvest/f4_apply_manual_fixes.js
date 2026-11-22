'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const OUT_DIR = path.join(__dirname, 'out');
const MANUAL_DIR = path.join(ROOT, 'data/manual');

function normKey(s) {
  return String(s || '').normalize('NFC').trim().toLowerCase();
}

function loadProtectedByPool() {
  const prot = new Map();
  function addProt(pool, name) {
    if (!pool || !name) return;
    if (!prot.has(pool)) prot.set(pool, new Set());
    prot.get(pool).add(normKey(name));
  }

  globalThis.PUSULLA_QUESTIONS = [];
  const qDemoPath = path.join(ROOT, 'data/q_demo.js');
  if (fs.existsSync(qDemoPath)) {
    delete require.cache[require.resolve(qDemoPath)];
    require(qDemoPath);
    for (const q of globalThis.PUSULLA_QUESTIONS) {
      if (q && q.pool && q.share && Array.isArray(q.share.list)) {
        for (const item of q.share.list) {
          if (Array.isArray(item) && item[0]) addProt(q.pool, item[0]);
        }
      }
    }
  }

  const shareDir = path.join(ROOT, 'data/share');
  if (fs.existsSync(shareDir)) {
    for (const f of fs.readdirSync(shareDir)) {
      if (!f.endsWith('.js')) continue;
      const pool = f.replace(/_\d+\.js$/, '');
      globalThis.PUSULLA_SHARES = {};
      const fp = path.join(shareDir, f);
      delete require.cache[require.resolve(fp)];
      require(fp);
      for (const val of Object.values(globalThis.PUSULLA_SHARES || {})) {
        if (val && Array.isArray(val.list)) {
          for (const item of val.list) {
            if (Array.isArray(item) && item[0]) addProt(pool, item[0]);
          }
        }
      }
    }
  }
  return prot;
}

function loadManual(poolId) {
  const p = path.join(MANUAL_DIR, `${poolId}.js`);
  if (!fs.existsSync(p)) {
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
  delete require.cache[require.resolve(p)];
  const mod = require(p);
  const store = globalThis.PUSULLA_MANUAL || {};
  const obj = store[poolId] || (mod && mod[poolId]) || mod || {};
  return {
    verifiedBy: obj.verifiedBy || 'agy-hydrogen-f4-g',
    expectNote: obj.expectNote || '',
    drop: Array.isArray(obj.drop) ? obj.drop.slice() : [],
    add: Array.isArray(obj.add) ? obj.add.slice() : [],
    alias: obj.alias && typeof obj.alias === 'object' ? { ...obj.alias } : {},
    year: obj.year && typeof obj.year === 'object' ? { ...obj.year } : {}
  };
}

function saveManual(poolId, data) {
  const p = path.join(MANUAL_DIR, `${poolId}.js`);
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
  fs.writeFileSync(p, out, 'utf8');
}

function addItems(manual, items, defaultNote) {
  const existing = new Set(manual.add.map((a) => normKey(a.label)));
  for (const it of items) {
    const k = normKey(it.label);
    if (existing.has(k)) continue;
    manual.add.push({
      label: it.label,
      aliases: it.aliases || [],
      year: typeof it.year === 'number' ? it.year : null,
      approx: Boolean(it.approx),
      note: it.note || defaultNote
    });
    existing.add(k);
  }
}

function addAliases(manual, aliasMap) {
  for (const [target, list] of Object.entries(aliasMap)) {
    if (!Array.isArray(manual.alias[target])) manual.alias[target] = [];
    const have = new Set(manual.alias[target].map(normKey));
    for (const al of list) {
      if (!have.has(normKey(al))) {
        manual.alias[target].push(al);
        have.add(normKey(al));
      }
    }
  }
}

function setYears(manual, yearMap, defaultNote) {
  for (const [label, val] of Object.entries(yearMap)) {
    const y = typeof val === 'number' ? val : val.year;
    const approx = typeof val === 'object' && val.approx !== undefined ? Boolean(val.approx) : false;
    const note = (typeof val === 'object' && val.note) || defaultNote;
    // Update manual.add entry if present
    const addEntry = manual.add.find((a) => normKey(a.label) === normKey(label));
    if (addEntry && addEntry.year === null) {
      addEntry.year = y;
      addEntry.approx = approx;
    }
    if (!manual.year[label] || typeof manual.year[label].year !== 'number') {
      manual.year[label] = { year: y, approx, note };
    }
  }
}

const FIXES = {
  bm_genel_sekreter: {
    alias: {
      'Trygve Lie': ['Trygve Halvdan Lie'],
      'Kofi Annan': ['Kofi Atta Annan']
    }
  },
  cumhurbaskani: {
    alias: {
      'Mustafa Kemal Atatürk': ['Mustafa Kemal']
    }
  },
  para_birimi: {
    alias: {
      'Renminbi': ['Çin Yuanı', 'Yuan']
    }
  },
  ist_ilce: {
    year: {
      'Beylikdüzü': { year: 2008, approx: false },
      'Sancaktepe': { year: 2008, approx: false },
      'Üsküdar': { year: 1926, approx: false },
      'Çatalca': { year: 1926, approx: false },
      'Çekmeköy': { year: 2008, approx: false },
      'Eyüpsultan': { year: 1936, approx: false },
      'Gaziosmanpaşa': { year: 1963, approx: false },
      'Şile': { year: 1926, approx: false },
      'Adalar': { year: 1926, approx: false },
      'Kadıköy': { year: 1928, approx: false },
      'Beşiktaş': { year: 1930, approx: false },
      'Bakırköy': { year: 1926, approx: false },
      'Beyoğlu': { year: 1926, approx: false },
      'Fatih': { year: 1928, approx: false },
      'Sarıyer': { year: 1930, approx: false },
      'Kartal': { year: 1926, approx: false },
      'Beykoz': { year: 1930, approx: false }
    }
  },
  corba: {
    note: 'genel bilgi - Turk mutfagi / Vikipedi ile dogrulanacak',
    add: [
      { label: 'Domates çorbası' },
      { label: 'Tavuk suyu çorbası' },
      { label: 'Kelle paça çorbası', aliases: ['Kelle paça'] },
      { label: 'Şehriye çorbası' },
      { label: 'Mantar çorbası' },
      { label: 'Brokoli çorbası' },
      { label: 'Soğan çorbası' },
      { label: 'Balkabağı çorbası' },
      { label: 'Ispanak çorbası' }
    ],
    alias: {
      'Ezogelin çorbası': ['Ezogelin'],
      'Tarhana çorbası': ['Tarhana'],
      'Mercimek çorbası': ['Mercimek'],
      'Yayla çorbası': ['Yayla'],
      'İşkembe çorbası': ['İşkembe']
    }
  },
  tatli: {
    note: 'genel bilgi - Turk mutfagi / Vikipedi ile dogrulanacak',
    add: [
      { label: 'Kazandibi' },
      { label: 'Lokma' },
      { label: 'Revani' },
      { label: 'İrmik helvası' },
      { label: 'Magnolia' },
      { label: 'Şekerpare' },
      { label: 'Tavukgöğsü', aliases: ['Tavuk göğsü'] }
    ],
    alias: {
      'Tulumba tatlısı': ['Tulumba']
    }
  },
  meslek: {
    note: 'genel bilgi - meslekler / Vikipedi ile dogrulanacak',
    add: [
      { label: 'Doktor' },
      { label: 'Avukat' },
      { label: 'Polis' },
      { label: 'Hemşire' },
      { label: 'Diş hekimi' },
      { label: 'Eczacı' },
      { label: 'Veteriner' },
      { label: 'Çiftçi' }
    ]
  },
  sebze: {
    note: 'genel bilgi - sebzeler / Vikipedi ile dogrulanacak',
    add: [
      { label: 'Kabak' },
      { label: 'Ispanak' },
      { label: 'Kereviz' }
    ],
    alias: {
      'Kereviz kökü': ['Kereviz']
    }
  },
  hayvan: {
    note: 'genel bilgi - hayvanlar / Vikipedi ile dogrulanacak',
    add: [
      { label: 'Kedi' },
      { label: 'At' },
      { label: 'Kuş' },
      { label: 'Balık' },
      { label: 'Yılan' },
      { label: 'Ayı' },
      { label: 'Kurt' },
      { label: 'Tilki' },
      { label: 'Maymun' },
      { label: 'Kartal' },
      { label: 'Yunus' },
      { label: 'Penguen' },
      { label: 'Kaplumbağa' },
      { label: 'İnek' },
      { label: 'Köpek' }
    ]
  },
  gunes_uydu: {
    note: 'genel bilgi - NASA/Vikipedi ile dogrulanacak',
    add: [
      { label: 'Titan', year: 1655 },
      { label: 'Triton', year: 1846 },
      { label: 'Phobos', year: 1877 },
      { label: 'Deimos', year: 1877 },
      { label: 'Charon', year: 1978 },
      { label: 'Europa', year: 1610 },
      { label: 'Ganymede', year: 1610 },
      { label: 'Callisto', year: 1610 },
      { label: 'Io', year: 1610 },
      { label: 'Enceladus', year: 1789 },
      { label: 'Ay', year: -5000, approx: true }
    ]
  },
  icat: {
    note: 'genel bilgi - Vikipedi ile dogrulanacak',
    add: [
      { label: 'Bilgisayar', year: 1936, approx: true }
    ]
  },
  isletim_sistemi: {
    note: 'genel bilgi - Vikipedi ile dogrulanacak',
    add: [
      { label: 'Android', year: 2008 },
      { label: 'Debian', year: 1993 },
      { label: 'Arch Linux', year: 2002 },
      { label: 'Windows 11', year: 2021 },
      { label: 'iPadOS', year: 2019 },
      { label: 'ChromeOS', year: 2011, aliases: ['Chrome OS'] },
      { label: 'Pardus', year: 2005 },
      { label: 'FreeBSD', year: 1993 },
      { label: 'CentOS', year: 2004 },
      { label: 'Linux', year: 1991 },
      { label: 'Ubuntu', year: 2004 },
      { label: 'macOS', year: 2001, aliases: ['Mac OS X'] },
      { label: 'iOS', year: 2007 },
      { label: 'Windows', year: 1985 },
      { label: 'Windows XP', year: 2001 },
      { label: 'Windows 7', year: 2009 },
      { label: 'Windows 10', year: 2015 }
    ]
  },
  oyun_konsolu: {
    note: 'genel bilgi - Vikipedi ile dogrulanacak',
    add: [
      { label: 'PlayStation', year: 1994, aliases: ['PS1'] },
      { label: 'PlayStation 2', year: 2000, aliases: ['PS2'] },
      { label: 'PlayStation 3', year: 2006, aliases: ['PS3'] },
      { label: 'PlayStation 4', year: 2013, aliases: ['PS4'] },
      { label: 'PlayStation 5', year: 2020, aliases: ['PS5'] },
      { label: 'Xbox', year: 2001 },
      { label: 'Xbox 360', year: 2005 },
      { label: 'Xbox One', year: 2013 },
      { label: 'Xbox Series X', year: 2020 },
      { label: 'Nintendo Switch', year: 2017 },
      { label: 'Steam Deck', year: 2022 },
      { label: 'Sega Mega Drive', year: 1988, aliases: ['Mega Drive', 'Sega Genesis'] },
      { label: 'Atari 2600', year: 1977 },
      { label: 'GameCube', year: 2001 },
      { label: 'NES', year: 1983, aliases: ['Nintendo Entertainment System'] },
      { label: 'SNES', year: 1990, aliases: ['Super Nintendo'] },
      { label: 'Dreamcast', year: 1998 }
    ]
  },
  prog_dili: {
    note: 'genel bilgi - Vikipedi ile dogrulanacak',
    add: [
      { label: 'Python', year: 1991 },
      { label: 'PHP', year: 1995 },
      { label: 'Kotlin', year: 2011 },
      { label: 'Dart', year: 2011 },
      { label: 'C++', year: 1985 },
      { label: 'C#', year: 2000 }
    ],
    alias: {
      'Python 3': ['Python']
    }
  },
  sosyal_medya: {
    note: 'genel bilgi - Vikipedi ile dogrulanacak',
    add: [
      { label: 'Instagram', year: 2010 },
      { label: 'Pinterest', year: 2010 },
      { label: 'WhatsApp', year: 2009 },
      { label: 'Telegram', year: 2013 },
      { label: 'Discord', year: 2015 },
      { label: 'Twitch', year: 2011 },
      { label: 'Tumblr', year: 2007 },
      { label: 'VK', year: 2006 },
      { label: 'BeReal', year: 2020 }
    ],
    alias: {
      'X': ['Twitter']
    }
  },
  telefon_markasi: {
    note: 'genel bilgi - kurulus yili / Vikipedi ile dogrulanacak',
    add: [
      { label: 'Apple', year: 1976 },
      { label: 'Samsung', year: 1938 },
      { label: 'Xiaomi', year: 2010 },
      { label: 'Huawei', year: 1987 },
      { label: 'Oppo', year: 2004 },
      { label: 'Realme', year: 2018 },
      { label: 'Vivo', year: 2009 },
      { label: 'OnePlus', year: 2013 },
      { label: 'Sony', year: 1946 },
      { label: 'Nokia', year: 1865 },
      { label: 'Asus', year: 1989 },
      { label: 'Nothing', year: 2020 },
      { label: 'Lenovo', year: 1984 },
      { label: 'LG', year: 1958 },
      { label: 'HTC', year: 1997 },
      { label: 'General Mobile', year: 2005 },
      { label: 'Casper', year: 1991 },
      { label: 'Vestel', year: 1984 },
      { label: 'Reeder', year: 2009 }
    ]
  },
  turk_markasi: {
    note: 'genel bilgi - kurulus yili / Vikipedi ile dogrulanacak',
    add: [
      { label: 'Eti', year: 1961 },
      { label: 'Togg', year: 2018 },
      { label: 'Türk Hava Yolları', year: 1933, aliases: ['THY'] },
      { label: 'LC Waikiki', year: 1988 },
      { label: 'Koton', year: 1988 },
      { label: 'DeFacto', year: 2005, aliases: ['Defacto'] },
      { label: 'Trendyol', year: 2010 },
      { label: 'Hepsiburada', year: 2000 },
      { label: 'Sütaş', year: 1975 },
      { label: 'Pınar', year: 1973 },
      { label: 'Torku', year: 2007 },
      { label: 'Simit Sarayı', year: 2002 },
      { label: 'Tekzen', year: 1995 },
      { label: 'Penti', year: 1950 }
    ]
  },
  otomobil_markasi: {
    note: 'genel bilgi - Vikipedi ile dogrulanacak',
    add: [
      { label: 'Peugeot', year: 1810 }
    ],
    alias: {
      'Ford Motor Company': ['Ford'],
      'Hyundai Motor Company': ['Hyundai'],
      'Peugeot Sport': ['Peugeot']
    }
  },
  video_oyunu: {
    note: 'genel bilgi - Vikipedi ile dogrulanacak',
    add: [
      { label: 'Counter-Strike 2', year: 2023, aliases: ['CS2'] },
      { label: 'The Last of Us', year: 2013 },
      { label: 'Elden Ring', year: 2022 },
      { label: 'Fortnite', year: 2017 },
      { label: 'The Elder Scrolls V: Skyrim', year: 2011, aliases: ['Skyrim'] }
    ],
    alias: {
      'Grand Theft Auto V': ['GTA 5', 'GTA V'],
      "PlayerUnknown's Battlegrounds": ['PUBG'],
      'The Legend of Zelda: Breath of the Wild': ['Zelda']
    }
  },
  sarki: {
    note: 'genel bilgi - Vikipedi ile dogrulanacak',
    add: [
      { label: 'Şımarık', year: 1997 },
      { label: 'Dudu', year: 2003 },
      { label: 'Kuzu Kuzu', year: 2001 },
      { label: 'Gülpembe', year: 1981 },
      { label: 'Sarı Çizmeli Mehmet Ağa', year: 1979 },
      { label: 'Firuze', year: 1982 },
      { label: 'Seni Kendime Sakladım', year: 2005 },
      { label: 'Yalnızlık Senfonisi', year: 1991 },
      { label: 'Resimdeki Gözyaşları', year: 1968 },
      { label: 'Aşkın Olayım', year: 2018 },
      { label: 'Antidepresan', year: 2022 },
      { label: 'Bohemian Rhapsody', year: 1975 },
      { label: 'Imagine', year: 1971 },
      { label: 'Shape of You', year: 2017 },
      { label: 'Despacito', year: 2017 },
      { label: 'Billie Jean', year: 1983 },
      { label: 'Hotel California', year: 1977 },
      { label: 'Smells Like Teen Spirit', year: 1991 },
      { label: 'Rolling in the Deep', year: 2010 },
      { label: 'Believer', year: 2017 }
    ]
  },
  uzay_sondasi: {
    note: 'genel bilgi - NASA/ESA/Vikipedi ile dogrulanacak',
    add: [
      { label: 'Voyager 1', year: 1977 },
      { label: 'Voyager 2', year: 1977 },
      { label: 'Cassini', year: 1997 },
      { label: 'New Horizons', year: 2006 },
      { label: 'Pioneer 10', year: 1972 },
      { label: 'Galileo', year: 1989 },
      { label: 'Rosetta', year: 2004 },
      { label: 'Parker Solar Probe', year: 2018 },
      { label: 'Magellan', year: 1989 },
      { label: 'Viking 1', year: 1975 },
      { label: 'Viking 2', year: 1975 },
      { label: 'Lucy', year: 2021 },
      { label: 'Huygens', year: 1997 }
    ]
  },
  ist_muze: {
    note: 'genel bilgi - Vikipedi ile dogrulanacak',
    add: [
      { label: 'İstanbul Arkeoloji Müzeleri', year: 1891, aliases: ['Arkeoloji Müzesi'] },
      { label: 'İstanbul Modern', year: 2004 },
      { label: 'Pera Müzesi', year: 2005 },
      { label: 'Sakıp Sabancı Müzesi', year: 2002 },
      { label: 'Rahmi M. Koç Müzesi', year: 1994 },
      { label: 'Dolmabahçe Sarayı', year: 1856 },
      { label: 'Yerebatan Sarnıcı', year: 532 },
      { label: 'Askeri Müze', year: 1959 },
      { label: 'İstanbul Oyuncak Müzesi', year: 2005, aliases: ['Oyuncak Müzesi'] },
      { label: 'Miniatürk', year: 2003 },
      { label: 'Panorama 1453 Tarih Müzesi', year: 2009, aliases: ['Panorama 1453'] }
    ]
  },
  sinan_yapisi: {
    note: 'genel bilgi - Vikipedi ile dogrulanacak',
    add: [
      { label: 'Büyükçekmece Köprüsü', year: 1567, aliases: ['Mimar Sinan Köprüsü'] },
      { label: 'Haseki Hürrem Sultan Hamamı', year: 1556 },
      { label: 'Azapkapı Sokollu Camii', year: 1578 },
      { label: 'Zeyrek Çinili Hamam', year: 1546 },
      { label: 'Lala Mustafa Paşa Camii', year: 1577 }
    ]
  },
  film: {
    note: 'genel bilgi - Vikipedi ile dogrulanacak',
    add: [
      { label: 'Yüzüklerin Efendisi: Yüzük Kardeşliği', year: 2001, aliases: ['Yüzüklerin Efendisi'] },
      { label: 'Forrest Gump', year: 1994 },
      { label: 'Avatar', year: 2009 },
      { label: 'Oppenheimer', year: 2023 },
      { label: 'Titanik', year: 1997, aliases: ['Titanic'] },
      { label: 'Esaretin Bedeli', year: 1994 }
    ]
  },
  dunya_sehri: {
    note: 'genel bilgi - Vikipedi ile dogrulanacak',
    add: [
      { label: 'Berlin', year: 1237 },
      { label: 'Viyana', year: 15, approx: true, aliases: ['Vienna'] },
      { label: 'Madrid', year: 865, approx: true }
    ]
  },
  tarayici: {
    note: 'genel bilgi - Vikipedi ile dogrulanacak',
    add: [
      { label: 'Waterfox', year: 2011 },
      { label: 'Maxthon', year: 2002 }
    ]
  },
  havayolu: {
    note: 'genel bilgi - Vikipedi ile dogrulanacak',
    add: [
      { label: 'Alitalia', year: 1946 }
    ]
  }
};

function pruneOpenYearPool(poolId, manual, protectedSet) {
  const rawPath = path.join(OUT_DIR, `raw_${poolId}.json`);
  if (!fs.existsSync(rawPath)) return { dropped: 0, withYear: 0, total: 0 };
  const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

  const dropSet = new Set(manual.drop.map((d) => normKey(typeof d === 'string' ? d : d.label)));
  const manualYearMap = new Map();
  for (const [k, v] of Object.entries(manual.year || {})) {
    if (v && typeof v.year === 'number') manualYearMap.set(normKey(k), v.year);
  }
  const manualAddMap = new Map();
  for (const a of manual.add || []) {
    manualAddMap.set(normKey(a.label), a);
  }

  const active = [];
  for (const r of raw.rows || []) {
    const k = normKey(r.label);
    if (!k || dropSet.has(k)) continue;
    const hasYear = (typeof r.year === 'number' && Number.isFinite(r.year)) || manualYearMap.has(k);
    active.push({ label: r.label, key: k, sl: r.sl || 0, hasYear, prot: protectedSet.has(k) });
  }
  for (const a of manual.add || []) {
    const k = normKey(a.label);
    if (dropSet.has(k)) continue;
    if (!active.some((x) => x.key === k)) {
      const hasYear = (typeof a.year === 'number' && Number.isFinite(a.year)) || manualYearMap.has(k);
      active.push({ label: a.label, key: k, sl: a.sl || 100, hasYear, prot: protectedSet.has(k) });
    }
  }

  let withYear = active.filter((x) => x.hasYear).length;
  let total = active.length;

  // Protected items without year -> log them
  const protNoYear = active.filter((x) => x.prot && !x.hasYear);
  if (protNoYear.length > 0) {
    console.log(`  [${poolId}] PROTECTED without year (${protNoYear.length}): ${protNoYear.map((x) => x.label).join(', ')}`);
  }

  // Drop lowest-sl non-protected yearless rows until >= 91% (min 60 rows)
  const candidates = active.filter((x) => !x.hasYear && !x.prot).sort((a, b) => a.sl - b.sl);
  let newlyDropped = 0;
  for (const c of candidates) {
    if (total <= 60) break;
    if ((withYear / total) >= 0.91) break;
    manual.drop.push(c.label);
    dropSet.add(c.key);
    total--;
    newlyDropped++;
  }

  return { dropped: newlyDropped, withYear, total };
}

function main() {
  const protByPool = loadProtectedByPool();

  for (const [poolId, fix] of Object.entries(FIXES)) {
    const manual = loadManual(poolId);
    if (fix.add) addItems(manual, fix.add, fix.note || 'genel bilgi - dogrulanacak');
    if (fix.alias) addAliases(manual, fix.alias);
    if (fix.year) setYears(manual, fix.year, fix.note || 'genel bilgi - Vikipedi ile dogrulanacak');
    saveManual(poolId, manual);
  }

  const openYearPools = ['tarayici', 'isletim_sistemi', 'oyun_konsolu', 'prog_dili', 'sosyal_medya', 'turk_dizisi', 'uzay_sondasi', 'sinan_yapisi', 'ist_muze'];
  for (const poolId of openYearPools) {
    const manual = loadManual(poolId);
    const prot = protByPool.get(poolId) || new Set();
    const res = pruneOpenYearPool(poolId, manual, prot);
    saveManual(poolId, manual);
    const pct = res.total ? ((res.withYear / res.total) * 100).toFixed(1) : '0.0';
    console.log(`[prune ${poolId}] dropped=${res.dropped} -> ${res.withYear}/${res.total} (${pct}%)`);
  }
}

main();
