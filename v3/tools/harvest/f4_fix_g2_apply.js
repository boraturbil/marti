'use strict';

const fs = require('fs');
const path = require('path');
const matcher = require('../../matcher');

const MANUAL_DIR = path.resolve(__dirname, '../../data/manual');

function loadManual(poolId) {
  const file = path.join(MANUAL_DIR, poolId + '.js');
  if (!fs.existsSync(file)) {
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
  delete require.cache[require.resolve(file)];
  const mod = require(file);
  return mod[poolId] || (globalThis.PUSULLA_MANUAL && globalThis.PUSULLA_MANUAL[poolId]);
}

function saveManual(poolId, data) {
  const file = path.join(MANUAL_DIR, poolId + '.js');
  const content = `'use strict';

(function (root) {
  root.PUSULLA_MANUAL = root.PUSULLA_MANUAL || {};
  root.PUSULLA_MANUAL[${JSON.stringify(poolId)}] = ${JSON.stringify(data, null, 2)};
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.PUSULLA_MANUAL;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
`;
  fs.writeFileSync(file, content, 'utf8');
}

function upsertAdd(data, entry) {
  data.add = data.add || [];
  const key = matcher.normFold(entry.label);
  const existing = data.add.find((x) => matcher.normFold(x.label) === key);
  if (existing) {
    existing.aliases = Array.from(new Set([...(existing.aliases || []), ...(entry.aliases || [])]));
    if (entry.year !== undefined && entry.year !== null && existing.year === null) {
      existing.year = entry.year;
      existing.approx = Boolean(entry.approx);
    }
    if (typeof entry.sl === 'number' && (typeof existing.sl !== 'number' || entry.sl > existing.sl)) {
      existing.sl = entry.sl;
    }
    if (entry.note && !existing.note) existing.note = entry.note;
    if (entry.src && !existing.src) existing.src = entry.src;
  } else {
    data.add.push(entry);
  }
}

function addAlias(data, targetLabel, aliases) {
  data.alias = data.alias || {};
  const list = data.alias[targetLabel] || [];
  for (const a of aliases) {
    if (!list.some((x) => matcher.normFold(x) === matcher.normFold(a))) {
      list.push(a);
    }
  }
  data.alias[targetLabel] = list;
}

const NOTE_GEN = 'genel bilgi - Vikipedi ile dogrulanacak';
const NOTE_TR_FOOD = 'genel bilgi - Turk mutfagi / Vikipedi ile dogrulanacak';

// 1. isletim_sistemi
{
  const m = loadManual('isletim_sistemi');
  const osItems = [
    { label: 'Windows', aliases: ['Microsoft Windows', 'MS Windows'], year: 1985, approx: false, sl: 300, note: NOTE_GEN },
    { label: 'Linux', aliases: ['GNU/Linux'], year: 1991, approx: false, sl: 300, note: NOTE_GEN },
    { label: 'macOS', aliases: ['Mac OS X', 'OS X'], year: 2001, approx: false, sl: 300, note: NOTE_GEN },
    { label: 'Android', aliases: [], year: 2008, approx: false, sl: 300, note: NOTE_GEN },
    { label: 'iOS', aliases: [], year: 2007, approx: false, sl: 300, note: NOTE_GEN },
    { label: 'Ubuntu', aliases: [], year: 2004, approx: false, sl: 250, note: NOTE_GEN },
    { label: 'Debian', aliases: [], year: 1993, approx: false, sl: 220, note: NOTE_GEN },
    { label: 'ChromeOS', aliases: ['Chrome OS'], year: 2011, approx: false, sl: 220, note: NOTE_GEN },
    { label: 'Unix', aliases: ['UNIX'], year: 1971, approx: false, sl: 250, note: NOTE_GEN },
    { label: 'MS-DOS', aliases: ['DOS'], year: 1981, approx: false, sl: 250, note: NOTE_GEN },
    { label: 'Fedora', aliases: ['Fedora Linux'], year: 2003, approx: false, sl: 200, note: NOTE_GEN },
    { label: 'Windows 98', aliases: [], year: 1998, approx: false, sl: 180, note: NOTE_GEN },
    { label: 'Windows XP', aliases: [], year: 2001, approx: false, sl: 200, note: NOTE_GEN },
    { label: 'Windows 11', aliases: [], year: 2021, approx: false, sl: 200, note: NOTE_GEN },
    { label: 'iPadOS', aliases: [], year: 2019, approx: false, sl: 200, note: NOTE_GEN },
    { label: 'watchOS', aliases: [], year: 2015, approx: false, sl: 180, note: NOTE_GEN },
    { label: 'Solaris', aliases: [], year: 1992, approx: false, sl: 180, note: NOTE_GEN },
    { label: 'FreeBSD', aliases: [], year: 1993, approx: false, sl: 180, note: NOTE_GEN }
  ];
  for (const item of osItems) upsertAdd(m, item);
  saveManual('isletim_sistemi', m);
}

// 2. corba
{
  const m = loadManual('corba');
  const aliasMap = {
    'Domates çorbası': ['Domates'],
    'Şehriye çorbası': ['Şehriye'],
    'Tavuk suyu çorbası': ['Tavuk suyu', 'Tavuk çorbası'],
    'Brokoli çorbası': ['Brokoli'],
    'Mantar çorbası': ['Mantar'],
    'Soğan çorbası': ['Soğan'],
    'Balkabağı çorbası': ['Balkabağı'],
    'Ispanak çorbası': ['Ispanak'],
    'Patates çorbası': ['Patates'],
    'Düğün çorbası': ['Düğün'],
    'Yayla çorbası': ['Yayla', 'Yoğurt çorbası', 'Yoğurt'],
    'Beyran': ['Beyran çorbası'],
    'Arabaşı': ['Arabaşı çorbası'],
    'Yuvalama': ['Yuvalama çorbası', 'Yuvarlama', 'Yuvarlama çorbası'],
    'Toğga': ['Toyga', 'Toyga çorbası', 'Toğga çorbası']
  };
  for (const [k, v] of Object.entries(aliasMap)) addAlias(m, k, v);
  const newSoups = [
    ['Havuç çorbası', ['Havuç']],
    ['Kremalı mantar çorbası', ['Kremalı mantar']],
    ['Tel şehriye çorbası', ['Tel şehriye']],
    ['Paça çorbası', ['Paça']],
    ['Bulgur çorbası', ['Bulgur']],
    ['Keşk çorbası', ['Keşk', 'Keşkek çorbası', 'Keşkek']]
  ];
  for (const [label, aliases] of newSoups) {
    upsertAdd(m, { label, aliases, year: null, approx: false, note: NOTE_TR_FOOD });
  }
  saveManual('corba', m);
}

// 3. dunya_sehri
{
  const m = loadManual('dunya_sehri');
  const newCities = [
    ['Paris', [], -250, true],
    ['İzmir', ['Izmir', 'Smyrna'], -3000, true],
    ['Kocaeli', ['İzmit'], 1924, false],
    ['Sakarya', ['Adapazarı'], 1954, false],
    ['Hatay', ['Antakya'], 1939, false],
    ['Miami', [], 1896, false],
    ['Montreal', ['Montréal'], 1642, false],
    ['Buenos Aires', [], 1536, false],
    ['Zürih', ['Zurich', 'Zürich'], -15, true],
    ['Lizbon', ['Lisbon'], -1200, true],
    ['Sevilla', ['Seville'], -700, true],
    ['Valensiya', ['Valencia'], -138, false],
    ['Marsilya', ['Marseille'], -600, true],
    ['Budapeşte', ['Budapest'], 1873, false],
    ['Sofya', ['Sofia'], -500, true],
    ['Kiev', ['Kyiv'], 482, true],
    ['Tahran', ['Tehran'], 1100, true],
    ['Riyad', ['Riyadh'], 1746, false],
    ['Mekke', ['Mecca'], 400, true],
    ['Doha', [], 1825, false],
    ['Yeni Delhi', ['New Delhi'], 1911, false],
    ['Kalküta', ['Kolkata', 'Calcutta'], 1690, false],
    ['Chennai', ['Madras'], 1639, false],
    ['Dakka', ['Dhaka'], 1608, false],
    ['Chongqing', [], -316, true],
    ['Osaka', [], 1496, false],
    ['Ho Chi Minh', ['Ho Chi Minh City', 'Saigon'], 1698, false],
    ['Cakarta', ['Jakarta'], 1527, false],
    ['Kinşasa', ['Kinshasa'], 1881, false],
    ['Vaduz', [], 1322, true],
    ['Yaren', [], 1968, false],
    ['Managua', [], 1819, false],
    ['Sri Jayawardenapura-Kotte', [], 1300, true],
    ['Monako', ['Monaco'], 1215, false],
    ['Vatikan', ['Vatican City'], 1929, false],
    ['Anvers', ['Antwerp'], 1291, false],
    ['Delhi', [], -500, true],
    ['Tianjin', [], 1404, false],
    ['Yokohama', [], 1859, false],
    ['Nagoya', [], 1610, false],
    ['Floransa', ['Florence', 'Firenze'], -59, true]
  ];
  for (const [label, aliases, year, approx] of newCities) {
    upsertAdd(m, { label, aliases, year, approx, sl: 200, note: NOTE_GEN });
  }
  const cityAliases = {
    'İstanbul': ['Constantinople'],
    'New York': ['NYC'],
    'Roma': ['Rome'],
    'Barselona': ['Barcelona'],
    'Moskova': ['Moscow'],
    'Kahire': ['Cairo'],
    'Pekin': ['Beijing'],
    'Şanghay': ['Shanghai'],
    'Seul': ['Seoul'],
    'Singapur': ['Singapore'],
    'Los Ángeles': ['Los Angeles'],
    'São Paulo': ['Sao Paulo'],
    'Meksiko': ['Mexico City'],
    'Sidney': ['Sydney'],
    'Milano': ['Milan'],
    'Venedik': ['Venice'],
    'Firenze': ['Florence', 'Floransa'],
    'Napoli': ['Naples'],
    'Torino': ['Turin'],
    'Münih': ['Munich'],
    'Köln': ['Cologne'],
    'Brüksel': ['Brussels'],
    'Brüksel Şehri': ['Brussels', 'Brüksel'],
    'Ho Chi Minh': ['Ho Chi Minh City', 'Saigon'],
    'Anvers': ['Antwerp'],
    'Lahey': ['The Hague'],
    'Strazburg': ['Strasbourg'],
    'Kopenhag': ['Copenhagen'],
    'Stockholm': ['Stokholm'],
    'Varşova': ['Warsaw'],
    'Kraków': ['Krakow'],
    'Bükreş': ['Bucharest'],
    'Saraybosna': ['Sarajevo'],
    'Üsküp': ['Skopje'],
    'Selanik': ['Thessaloniki'],
    'Tiflis': ['Tbilisi'],
    'Erivan': ['Yerevan'],
    'Bağdat': ['Baghdad'],
    'Şam': ['Damascus'],
    'Beyrut': ['Beirut'],
    'Kudüs': ['Jerusalem'],
    'Cidde': ['Jeddah'],
    'Medine': ['Medina'],
    'Abu Dabi': ['Abu Dhabi'],
    'Kuveyt': ['Kuwait City'],
    'Maskat': ['Muscat'],
    'Taşkent': ['Tashkent'],
    'Semerkant': ['Samarkand'],
    'Almatı': ['Almaty'],
    'Bişkek': ['Bishkek'],
    'Aşkabat': ['Ashgabat'],
    'Kabil': ['Kabul'],
    'Karaçi': ['Karachi'],
    'Mumbai': ['Bombay'],
    'Bangalore': ['Bengaluru'],
    'Haydarabad': ['Hyderabad'],
    'Katmandu': ['Kathmandu'],
    'Guangzhou': ['Canton'],
    'Vuhan': ['Wuhan'],
    'Yangon': ['Rangoon'],
    'İskenderiye': ['Alexandria'],
    'Kazablanka': ['Casablanca'],
    'Tunus': ['Tunis'],
    'Cezayir': ['Algiers'],
    'Trablus': ['Tripoli'],
    'Hartum': ['Khartoum'],
    'Akra': ['Accra'],
    'Darüsselam': ['Dar es Salaam']
  };
  for (const [k, v] of Object.entries(cityAliases)) addAlias(m, k, v);
  saveManual('dunya_sehri', m);
}

// 4. tarayici
{
  const m = loadManual('tarayici');
  addAlias(m, 'DuckDuckGo', ['DuckDuckGo Browser', 'DuckDuckGo Private Browser']);
  addAlias(m, 'Microsoft Edge', ['Edge Legacy']);
  addAlias(m, 'Dolphin Browser', ['Dolphin']);
  addAlias(m, 'Puffin Browser', ['Puffin']);
  const newBrowsers = [
    { label: 'Opera Mini', aliases: [], year: 2005, approx: false, note: NOTE_GEN },
    { label: 'K-Meleon', aliases: [], year: 2000, approx: false, note: NOTE_GEN },
    { label: 'GNOME Web', aliases: ['Epiphany'], year: 2002, approx: false, note: NOTE_GEN },
    { label: 'Netscape Communicator', aliases: [], year: 1997, approx: false, note: NOTE_GEN }
  ];
  for (const b of newBrowsers) upsertAdd(m, b);
  saveManual('tarayici', m);
}

// 5. para_birimi & baskent (kapali kumeler)
{
  const m = loadManual('para_birimi');
  addAlias(m, 'Birleşik Arap Emirlikleri dirhemi', ['BAE dirhemi']);
  addAlias(m, 'Złoty', ['Zloti']);
  saveManual('para_birimi', m);
}
{
  const m = loadManual('baskent');
  addAlias(m, 'Stockholm', ['Stokholm']);
  saveManual('baskent', m);
}

// 6. hayvan
{
  const m = loadManual('hayvan');
  const animals = [
    ['Kaplan', []], ['Tavşan', []], ['Balina', []], ['Köpekbalığı', ['Köpek balığı']],
    ['Timsah', []], ['Kurbağa', []], ['Arı', []], ['Kelebek', []],
    ['Koyun', []], ['Keçi', []], ['Tavuk', []], ['Panda', []]
  ];
  for (const [label, aliases] of animals) {
    upsertAdd(m, { label, aliases, year: null, approx: false, sl: 200, note: NOTE_GEN });
  }
  saveManual('hayvan', m);
}

// 7. turk_markasi
{
  const m = loadManual('turk_markasi');
  addAlias(m, 'Sabancı Holding', ['Sabancı']);
  for (const [label, aliases, year] of [
    ['Baykar', [], 1984], ['Migros', [], 1954], ['Şok', ['Şok Marketler'], 1995], ['A101', [], 2008]
  ]) {
    upsertAdd(m, { label, aliases, year, approx: false, sl: 150, note: NOTE_GEN });
  }
  saveManual('turk_markasi', m);
}

// 8. oyun_konsolu
{
  const m = loadManual('oyun_konsolu');
  for (const [label, aliases, year] of [
    ['Wii U', [], 2012], ['Game Boy Advance', [], 2001], ['Sega Saturn', [], 1994]
  ]) {
    upsertAdd(m, { label, aliases, year, approx: false, sl: 150, note: NOTE_GEN });
  }
  saveManual('oyun_konsolu', m);
}

// 9. sosyal_medya
{
  const m = loadManual('sosyal_medya');
  for (const [label, aliases, year] of [
    ['Clubhouse', [], 2020], ['Mastodon', [], 2016]
  ]) {
    upsertAdd(m, { label, aliases, year, approx: false, sl: 120, note: NOTE_GEN });
  }
  saveManual('sosyal_medya', m);
}

// 10. video_oyunu
{
  const m = loadManual('video_oyunu');
  addAlias(m, 'The Witcher 3: Wild Hunt', ['The Witcher 3']);
  addAlias(m, 'Grand Theft Auto: San Andreas', ['GTA San Andreas']);
  for (const [label, aliases, year] of [
    ['Counter-Strike', ['CS'], 2000], ['Counter-Strike: Global Offensive', ['CS:GO'], 2012]
  ]) {
    upsertAdd(m, { label, aliases, year, approx: false, sl: 200, note: NOTE_GEN });
  }
  saveManual('video_oyunu', m);
}

// 11. telefon_markasi
{
  const m = loadManual('telefon_markasi');
  addAlias(m, 'Tecno Mobile', ['Tecno']);
  for (const [label, aliases, year] of [
    ['Alcatel', [], 1996], ['Infinix', [], 2013], ['Meizu', [], 2003], ['Sharp', [], 1912]
  ]) {
    upsertAdd(m, { label, aliases, year, approx: false, sl: 120, note: NOTE_GEN });
  }
  saveManual('telefon_markasi', m);
}

// 12. otomobil_markasi
{
  const m = loadManual('otomobil_markasi');
  addAlias(m, 'BYD Auto', ['BYD']);
  upsertAdd(m, { label: 'Tesla', aliases: ['Tesla Motors'], year: 2003, approx: false, sl: 200, note: NOTE_GEN });
  saveManual('otomobil_markasi', m);
}

// 13. havayolu
{
  const m = loadManual('havayolu');
  upsertAdd(m, { label: 'AnadoluJet', aliases: ['AJet'], year: 2008, approx: false, sl: 150, note: NOTE_GEN });
  saveManual('havayolu', m);
}

// 14. film
{
  const m = loadManual('film');
  addAlias(m, 'Baba', ['The Godfather']);
  addAlias(m, 'Kara Şövalye', ['The Dark Knight']);
  addAlias(m, 'Dövüş Kulübü', ['Fight Club']);
  addAlias(m, 'Ucuz Roman', ['Pulp Fiction']);
  addAlias(m, 'Harry Potter ve Felsefe Taşı', ['Harry Potter']);
  saveManual('film', m);
}

// 15. sarki
{
  const m = loadManual('sarki');
  for (const [label, aliases, year] of [
    ['Blinding Lights', [], 2019], ['Thriller', [], 1982], ['Yesterday', [], 1965],
    ['Someone Like You', [], 2011], ['Viva La Vida', [], 2008], ['Gülümse', [], 1991],
    ['Dağlar Dağlar', [], 1970]
  ]) {
    upsertAdd(m, { label, aliases, year, approx: false, sl: 150, note: NOTE_GEN });
  }
  saveManual('sarki', m);
}

// 16. uzay_sondasi
{
  const m = loadManual('uzay_sondasi');
  for (const [label, aliases, year] of [
    ['Curiosity', [], 2011], ['Opportunity', [], 2003], ['Spirit', [], 2003],
    ['James Webb Uzay Teleskobu', ['James Webb'], 2021], ['Hubble Uzay Teleskobu', ['Hubble'], 1990],
    ['Mariner 2', [], 1962], ['Mariner 4', [], 1964], ['Mariner 10', [], 1973],
    ['Luna 1', [], 1959], ['Luna 2', [], 1959], ['Luna 9', [], 1966],
    ['Chandrayaan-3', [], 2023], ['Chang\'e 4', [], 2018], ['BepiColombo', [], 2018]
  ]) {
    upsertAdd(m, { label, aliases, year, approx: false, sl: 120, note: NOTE_GEN });
  }
  saveManual('uzay_sondasi', m);
}

// 17. gunes_uydu
{
  const m = loadManual('gunes_uydu');
  for (const [label, aliases, year] of [
    ['Nereid', [], 1949], ['Phoebe', [], 1898], ['Larissa', [], 1981], ['Despina', [], 1989], ['Galatea', [], 1989]
  ]) {
    upsertAdd(m, { label, aliases, year, approx: false, sl: 100, note: NOTE_GEN });
  }
  saveManual('gunes_uydu', m);
}

// 18. icat
{
  const m = loadManual('icat');
  upsertAdd(m, { label: 'Çamaşır makinesi', aliases: [], year: 1858, approx: false, sl: 150, note: NOTE_GEN });
  upsertAdd(m, { label: 'Saat', aliases: [], year: -1500, approx: true, sl: 150, note: NOTE_GEN });
  saveManual('icat', m);
}

// 19. sinan_yapisi
{
  const m = loadManual('sinan_yapisi');
  for (const [label, aliases, year] of [
    ['Haseki Sultan Külliyesi', [], 1539], ['Mehmed Paşa Sokoloviç Köprüsü', [], 1577],
    ['Hüsrev Paşa Camii', [], 1547], ['Nişancı Mehmed Paşa Camii', [], 1588],
    ['Kanuni Sultan Süleyman Türbesi', ['Kanuni Türbesi'], 1566], ['Hürrem Sultan Hamamı', [], 1556],
    ['Kırkçeşme Su Yolları', ['Kırkçeşme'], 1563], ['Tekirdağ Rüstem Paşa Camii', [], 1553]
  ]) {
    upsertAdd(m, { label, aliases, year, approx: false, sl: 100, note: NOTE_GEN });
  }
  saveManual('sinan_yapisi', m);
}

// 20. ist_muze
{
  const m = loadManual('ist_muze');
  for (const [label, aliases, year] of [
    ['Kariye Müzesi', ['Kariye'], 1945], ['Beylerbeyi Sarayı', [], 1865],
    ['Yıldız Sarayı', [], 1880], ['Çinili Köşk', [], 1472],
    ['İstanbul Havacılık Müzesi', ['Havacılık Müzesi'], 1985], ['Aya İrini', [], 532],
    ['İslam Bilim ve Teknoloji Tarihi Müzesi', [], 2008]
  ]) {
    upsertAdd(m, { label, aliases, year, approx: false, sl: 100, note: NOTE_GEN });
  }
  saveManual('ist_muze', m);
}

// 21. tatli, meyve, sebze, meslek, spor_dali, turk_dizisi
{
  const m = loadManual('tatli');
  upsertAdd(m, { label: 'Keşkül', aliases: [], year: null, approx: false, sl: 150, note: NOTE_TR_FOOD });
  saveManual('tatli', m);
}
{
  const m = loadManual('meyve');
  upsertAdd(m, { label: 'Dut', aliases: [], year: null, approx: false, sl: 150, note: NOTE_GEN });
  saveManual('meyve', m);
}
{
  const m = loadManual('sebze');
  for (const label of ['Bamya', 'Maydanoz', 'Dereotu']) {
    upsertAdd(m, { label, aliases: [], year: null, approx: false, sl: 150, note: NOTE_GEN });
  }
  saveManual('sebze', m);
}
{
  const m = loadManual('meslek');
  for (const label of ['Hakim', 'Savcı']) {
    upsertAdd(m, { label, aliases: [], year: null, approx: false, sl: 150, note: NOTE_GEN });
  }
  saveManual('meslek', m);
}
{
  const m = loadManual('spor_dali');
  upsertAdd(m, { label: 'Formula 1', aliases: ['F1'], year: 1950, approx: false, sl: 150, note: NOTE_GEN });
  upsertAdd(m, { label: 'Bilardo', aliases: [], year: null, approx: false, sl: 150, note: NOTE_GEN });
  saveManual('spor_dali', m);
}
{
  const m = loadManual('turk_dizisi');
  upsertAdd(m, { label: 'Ekmek Teknesi', aliases: [], year: 2002, approx: false, sl: 150, note: NOTE_GEN });
  saveManual('turk_dizisi', m);
}

console.log('f4_fix_g2_apply: tum manual dosyalari guncellendi.');
