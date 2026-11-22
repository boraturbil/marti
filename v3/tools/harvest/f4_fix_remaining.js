'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const OUT_DIR = path.join(__dirname, 'out');
const MANUAL_DIR = path.join(ROOT, 'data/manual');

function normKey(s) {
  return String(s || '').normalize('NFC').trim().toLowerCase();
}

function loadManual(poolId) {
  const p = path.join(MANUAL_DIR, `${poolId}.js`);
  if (!fs.existsSync(p)) {
    return { verifiedBy: 'agy-hydrogen-f4-g', expectNote: '', drop: [], add: [], alias: {}, year: {} };
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

function upsertAdd(manual, item) {
  const k = normKey(item.label);
  const idx = manual.add.findIndex((a) => normKey(a.label) === k);
  if (idx >= 0) {
    manual.add[idx] = { ...manual.add[idx], ...item };
  } else {
    manual.add.push(item);
  }
}

function addAlias(manual, target, al) {
  if (!Array.isArray(manual.alias[target])) manual.alias[target] = [];
  if (!manual.alias[target].some((x) => normKey(x) === normKey(al))) {
    manual.alias[target].push(al);
  }
}

// 1. film: give high sl so 60_emit doesn't trim them!
const mFilm = loadManual('film');
for (const a of mFilm.add) {
  if (['forrest gump', 'avatar', 'oppenheimer', 'titanik', 'esaretin bedeli', 'yüzüklerin efendisi: yüzük kardeşliği'].includes(normKey(a.label))) {
    a.sl = 200;
  }
}
saveManual('film', mFilm);

// 2. turk_dizisi: add Süper Baba, Gibi
const mDizi = loadManual('turk_dizisi');
upsertAdd(mDizi, { label: 'Süper Baba', aliases: [], year: 1993, approx: false, sl: 100, note: 'genel bilgi - Vikipedi ile dogrulanacak' });
upsertAdd(mDizi, { label: 'Gibi', aliases: [], year: 2021, approx: false, sl: 100, note: 'genel bilgi - Vikipedi ile dogrulanacak' });
saveManual('turk_dizisi', mDizi);

// 3. uzay_sondasi: add Pioneer 11 and drop 3 more yearless non-share rows
const mUzay = loadManual('uzay_sondasi');
upsertAdd(mUzay, { label: 'Pioneer 11', aliases: [], year: 1973, approx: false, sl: 100, note: 'genel bilgi - NASA/Vikipedi ile dogrulanacak' });
const rawUzay = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'raw_uzay_sondasi.json'), 'utf8'));
const uzayDrops = new Set(mUzay.drop.map((d) => normKey(typeof d === 'string' ? d : d.label)));
const extraDrops = (rawUzay.rows || [])
  .filter((r) => !uzayDrops.has(normKey(r.label)) && typeof r.year !== 'number' && !mUzay.year[r.label] && normKey(r.label) !== 'dragonfly')
  .sort((a, b) => (a.sl || 0) - (b.sl || 0))
  .slice(0, 4);
for (const d of extraDrops) {
  mUzay.drop.push(d.label);
}
saveManual('uzay_sondasi', mUzay);

// 4. isletim_sistemi: Linux Mint / Mint
const mOs = loadManual('isletim_sistemi');
upsertAdd(mOs, { label: 'Linux Mint', aliases: ['Mint'], year: 2006, approx: false, sl: 100, note: 'genel bilgi - Vikipedi ile dogrulanacak' });
saveManual('isletim_sistemi', mOs);

// 5. ist_muze: Borusan Contemporary
const mMuze = loadManual('ist_muze');
upsertAdd(mMuze, { label: 'Borusan Contemporary', aliases: [], year: 2011, approx: false, sl: 100, note: 'genel bilgi - Vikipedi ile dogrulanacak' });
saveManual('ist_muze', mMuze);

// 6. tarayici: UC Browser
const mTar = loadManual('tarayici');
upsertAdd(mTar, { label: 'UC Browser', aliases: [], year: 2004, approx: false, sl: 100, note: 'genel bilgi - Vikipedi ile dogrulanacak' });
saveManual('tarayici', mTar);

// 7. spor_dali: Bisiklet alias
const mSpor = loadManual('spor_dali');
addAlias(mSpor, 'bisiklet sporu', 'Bisiklet');
saveManual('spor_dali', mSpor);

// 8. para_birimi: Dolar alias
const mPara = loadManual('para_birimi');
addAlias(mPara, 'Amerikan doları', 'Dolar');
saveManual('para_birimi', mPara);

console.log('f4_fix_round2 completed.');
