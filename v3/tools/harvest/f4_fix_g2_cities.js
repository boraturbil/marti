'use strict';

const fs = require('fs');
const path = require('path');
const matcher = require('../../matcher');

globalThis.PUSULLA_POOLS = {};
require('../../data/pool/dunya_sehri.js');
require('../../data/pool/baskent.js');
require('../../data/pool/tr_il.js');

const dsPool = globalThis.PUSULLA_POOLS.dunya_sehri;
const baskentPool = globalThis.PUSULLA_POOLS.baskent;
const trIlPool = globalThis.PUSULLA_POOLS.tr_il;

const idx = matcher.createIndex(dsPool, { pool: 'dunya_sehri', subject: 'DÜNYA ŞEHRİ' });

// 200+ major world cities with TR/EN aliases & approximate founding years
const MAJOR_CITIES = [
  ['İstanbul', ['Istanbul', 'Constantinople'], -660],
  ['Ankara', [], -1200],
  ['İzmir', ['Izmir', 'Smyrna'], -3000],
  ['Bursa', [], -202],
  ['Antalya', [], -150],
  ['Adana', [], -1600],
  ['Konya', [], -3000],
  ['Gaziantep', ['Antep'], -3650],
  ['Şanlıurfa', ['Urfa'], -9000],
  ['Mersin', [], -3000],
  ['Diyarbakır', [], -3000],
  ['Kayseri', [], -2000],
  ['Eskişehir', [], -1000],
  ['Samsun', [], -600],
  ['Trabzon', [], -756],
  ['Erzurum', [], -4000],
  ['Paris', [], -250],
  ['Londra', ['London'], 47],
  ['New York', ['New York City', 'NYC'], 1624],
  ['Tokyo', [], 1457],
  ['Roma', ['Rome'], -753],
  ['Berlin', [], 1237],
  ['Madrid', [], 865],
  ['Barselona', ['Barcelona'], -15],
  ['Amsterdam', [], 1275],
  ['Moskova', ['Moscow'], 1147],
  ['Viyana', ['Vienna'], 15],
  ['Prag', ['Prague'], 885],
  ['Atina', ['Athens'], -3000],
  ['Kahire', ['Cairo'], 969],
  ['Pekin', ['Beijing'], -1045],
  ['Şanghay', ['Shanghai'], 1291],
  ['Seul', ['Seoul'], -18],
  ['Dubai', [], 1833],
  ['Singapur', ['Singapore'], 1819],
  ['Hong Kong', [], 1841],
  ['Bangkok', [], 1782],
  ['Los Angeles', [], 1781],
  ['Şikago', ['Chicago'], 1833],
  ['San Francisco', [], 1776],
  ['Miami', [], 1896],
  ['Houston', [], 1836],
  ['Boston', [], 1630],
  ['Washington', ['Washington D.C.'], 1790],
  ['Seattle', [], 1851],
  ['Las Vegas', [], 1905],
  ['Toronto', [], 1793],
  ['Montreal', ['Montréal'], 1642],
  ['Vancouver', [], 1886],
  ['Meksiko', ['Mexico City'], 1325],
  ['Havana', [], 1515],
  ['Bogota', ['Bogotá'], 1538],
  ['Lima', [], 1535],
  ['Santiago', [], 1541],
  ['Buenos Aires', [], 1536],
  ['Sao Paulo', ['São Paulo'], 1554],
  ['Rio de Janeiro', [], 1565],
  ['Caracas', [], 1567],
  ['Montevideo', [], 1724],
  ['Sidney', ['Sydney'], 1788],
  ['Melbourne', [], 1835],
  ['Brisbane', [], 1824],
  ['Perth', [], 1829],
  ['Auckland', [], 1840],
  ['Milano', ['Milan'], -590],
  ['Venedik', ['Venice'], 421],
  ['Floransa', ['Florence', 'Firenze'], -59],
  ['Napoli', ['Naples'], -600],
  ['Torino', ['Turin'], -28],
  ['Münih', ['Munich'], 1158],
  ['Frankfurt', [], 794],
  ['Hamburg', [], 808],
  ['Köln', ['Cologne'], -38],
  ['Stuttgart', [], 950],
  ['Düsseldorf', [], 1288],
  ['Cenevre', ['Geneva'], -121],
  ['Zürih', ['Zurich', 'Zürich'], -15],
  ['Bern', [], 1191],
  ['Brüksel', ['Brussels'], 979],
  ['Anvers', ['Antwerp'], 1291],
  ['Rotterdam', [], 1340],
  ['Lahey', ['The Hague'], 1230],
  ['Lizbon', ['Lisbon'], -1200],
  ['Porto', [], -300],
  ['Sevilla', ['Seville'], -700],
  ['Valensiya', ['Valencia'], -138],
  ['Marsilya', ['Marseille'], -600],
  ['Lyon', [], -43],
  ['Nice', [], -350],
  ['Toulouse', [], -100],
  ['Strazburg', ['Strasbourg'], -12],
  ['Dublin', [], 841],
  ['Edinburgh', [], 1130],
  ['Manchester', [], 79],
  ['Liverpool', [], 1207],
  ['Birmingham', [], 1166],
  ['Glasgow', [], 550],
  ['Kopenhag', ['Copenhagen'], 1167],
  ['Stokholm', ['Stockholm'], 1252],
  ['Oslo', [], 1048],
  ['Helsinki', [], 1550],
  ['Reykjavik', ['Reykjavík'], 874],
  ['Varşova', ['Warsaw'], 1300],
  ['Krakow', ['Kraków'], 700],
  ['Budapeşte', ['Budapest'], 1873],
  ['Bükreş', ['Bucharest'], 1459],
  ['Sofya', ['Sofia'], -500],
  ['Belgrad', ['Belgrade'], -279],
  ['Zagreb', [], 1094],
  ['Saraybosna', ['Sarajevo'], 1461],
  ['Üsküp', ['Skopje'], -300],
  ['Tiran', ['Tirana'], 1614],
  ['Selanik', ['Thessaloniki'], -315],
  ['Sankt-Peterburg', ['Saint Petersburg', 'St. Petersburg'], 1703],
  ['Kiev', ['Kyiv'], 482],
  ['Minsk', [], 1067],
  ['Riga', [], 1201],
  ['Tallinn', [], 1154],
  ['Vilnius', [], 1323],
  ['Bakü', ['Baku'], 500],
  ['Tiflis', ['Tbilisi'], 455],
  ['Erivan', ['Yerevan'], -782],
  ['Tahran', ['Tehran'], 1100],
  ['Bağdat', ['Baghdad'], 762],
  ['Şam', ['Damascus'], -3000],
  ['Halep', ['Aleppo'], -3000],
  ['Beyrut', ['Beirut'], -3000],
  ['Kudüs', ['Jerusalem'], -3000],
  ['Tel Aviv', [], 1909],
  ['Amman', [], -7250],
  ['Riyad', ['Riyadh'], 1746],
  ['Cidde', ['Jeddah'], 647],
  ['Mekke', ['Mecca'], 400],
  ['Medine', ['Medina'], -500],
  ['Abu Dabi', ['Abu Dhabi'], 1761],
  ['Doha', [], 1825],
  ['Kuveyt', ['Kuwait City'], 1613],
  ['Maskat', ['Muscat'], 100],
  ['Taşkent', ['Tashkent'], -200],
  ['Semerkant', ['Samarkand'], -700],
  ['Almatı', ['Almaty'], 1854],
  ['Astana', [], 1830],
  ['Bişkek', ['Bishkek'], 1878],
  ['Aşkabat', ['Ashgabat'], 1881],
  ['Duşanbe', ['Dushanbe'], 1924],
  ['Kabil', ['Kabul'], -1500],
  ['İslamabad', ['Islamabad'], 1960],
  ['Karaçi', ['Karachi'], 1729],
  ['Lahor', ['Lahore'], 1000],
  ['Yeni Delhi', ['New Delhi'], 1911],
  ['Delhi', [], -500],
  ['Mumbai', ['Bombay'], 1507],
  ['Kalküta', ['Kolkata', 'Calcutta'], 1690],
  ['Bangalore', ['Bengaluru'], 1537],
  ['Haydarabad', ['Hyderabad'], 1591],
  ['Chennai', ['Madras'], 1639],
  ['Dakka', ['Dhaka'], 1608],
  ['Katmandu', ['Kathmandu'], 723],
  ['Kolombo', ['Colombo'], 1505],
  ['Guangzhou', ['Canton'], -214],
  ['Shenzhen', [], 1979],
  ['Chengdu', [], -311],
  ['Vuhan', ['Wuhan'], -1500],
  ['Chongqing', [], -316],
  ['Tianjin', [], 1404],
  ['Nanjing', [], -495],
  ['Xi\'an', ['Sian'], -1100],
  ['Taipei', [], 1709],
  ['Osaka', [], 1496],
  ['Kyoto', [], 794],
  ['Yokohama', [], 1859],
  ['Nagoya', [], 1610],
  ['Sapporo', [], 1868],
  ['Busan', [], 1400],
  ['Hanoi', [], 1010],
  ['Ho Chi Minh', ['Ho Chi Minh City', 'Saigon'], 1698],
  ['Cakarta', ['Jakarta'], 1527],
  ['Manila', [], 1571],
  ['Kuala Lumpur', [], 1857],
  ['Yangon', ['Rangoon'], 1755],
  ['Phnom Penh', [], 1434],
  ['İskenderiye', ['Alexandria'], -331],
  ['Kazablanka', ['Casablanca'], 1515],
  ['Marakeş', ['Marrakech'], 1062],
  ['Rabat', [], 1150],
  ['Tunus', ['Tunis'], -800],
  ['Cezayir', ['Algiers'], 944],
  ['Trablus', ['Tripoli'], -700],
  ['Hartum', ['Khartoum'], 1821],
  ['Addis Ababa', [], 1886],
  ['Nairobi', [], 1899],
  ['Lagos', [], 1472],
  ['Abuja', [], 1991],
  ['Akra', ['Accra'], 1500],
  ['Dakar', [], 1857],
  ['Kinşasa', ['Kinshasa'], 1881],
  ['Luanda', [], 1576],
  ['Johannesburg', [], 1886],
  ['Cape Town', [], 1652],
  ['Darüsselam', ['Dar es Salaam'], 1862],
  ['Kampala', [], 1890],
  ['Kigali', [], 1907]
];

const missingMajor = [];
for (const [name, aliases] of MAJOR_CITIES) {
  const r = matcher.matchAnswer(name, idx);
  if (r.type !== 'valid') {
    missingMajor.push(`${name} (${r.status}${r.suggestion ? ':' + r.suggestion : ''})`);
  }
  for (const al of aliases) {
    const ra = matcher.matchAnswer(al, idx);
    if (ra.type !== 'valid') {
      missingMajor.push(`${al} [alias of ${name}] (${ra.status}${ra.suggestion ? ':' + ra.suggestion : ''})`);
    }
  }
}

const missingCapitals = [];
for (const row of baskentPool.rows) {
  const name = row[0];
  const r = matcher.matchAnswer(name, idx);
  if (r.type !== 'valid') {
    missingCapitals.push(`${name} (${r.status}${r.suggestion ? ':' + r.suggestion : ''})`);
  }
}

const missingTrIl = [];
for (const row of trIlPool.rows) {
  const name = row[0];
  const r = matcher.matchAnswer(name, idx);
  if (r.type !== 'valid') {
    missingTrIl.push(`${name} (${r.status}${r.suggestion ? ':' + r.suggestion : ''})`);
  }
}

console.log(`Missing MAJOR_CITIES (${missingMajor.length}):`, missingMajor.join(', '));
console.log(`\nMissing CAPITALS (${missingCapitals.length}):`, missingCapitals.join(', '));
console.log(`\nMissing TR_IL (${missingTrIl.length}):`, missingTrIl.join(', '));
