'use strict';

const fs = require('fs');
const path = require('path');
const matcher = require('../matcher');
const engine = require('../engine');
const { isSuspicious } = require('./harvest/lib/aliasfilter');
const { isValidYear } = require('./harvest/lib/years');

const MAX_OPEN_ROWS = 5000;
const MAX_OPEN_BYTES = 250 * 1024;
const TOTAL_BUDGET_BYTES = Math.round(1.8 * 1024 * 1024);

function parseArgs(argv) {
  const args = {
    demo: false,
    strict: false,
    dataDir: path.resolve(__dirname, '../data')
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--demo') args.demo = true;
    else if (a === '--strict') args.strict = true;
    else if (a === '--data-dir' && argv[i + 1]) args.dataDir = path.resolve(argv[++i]);
  }
  return args;
}

function dirSizeBytes(dir) {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) total += dirSizeBytes(full);
    else if (entry.isFile()) total += fs.statSync(full).size;
  }
  return total;
}

function isNfc(s) {
  return typeof s === 'string' && s === s.normalize('NFC');
}

function main() {
  const args = parseArgs(process.argv);
  const errors = [];
  const warnings = [];

  function err(msg) { errors.push(msg); }
  function warn(msg) { warnings.push(msg); }

  // 1. _meta.js yukle
  const metaPath = path.join(args.dataDir, '_meta.js');
  let meta = null;
  if (fs.existsSync(metaPath)) {
    delete globalThis.PUSULLA_META;
    delete require.cache[require.resolve(metaPath)];
    meta = require(metaPath);
  } else {
    err('data/_meta.js bulunamadi.');
  }

  // 2. Havuzlari yukle (data/pool/*.js)
  globalThis.PUSULLA_POOLS = {};
  const poolDir = path.join(args.dataDir, 'pool');
  const poolFiles = fs.existsSync(poolDir)
    ? fs.readdirSync(poolDir).filter((f) => /\.js$/i.test(f))
    : [];

  for (const pf of poolFiles) {
    const full = path.join(poolDir, pf);
    const size = fs.statSync(full).size;
    delete require.cache[require.resolve(full)];
    require(full);
    const pid = pf.replace(/\.js$/i, '');
    const pool = globalThis.PUSULLA_POOLS[pid];
    if (!pool) {
      err(`Havuz yuklenemedi: ${pf}`);
      continue;
    }

    const rows = engine.getPoolRows(pool);
    if (!pool.closed) {
      if (rows.length > MAX_OPEN_ROWS) {
        err(`Havuz ${pid}: acik havuz satiri tavan asimi (${rows.length} > ${MAX_OPEN_ROWS})`);
      }
      if (size > MAX_OPEN_BYTES) {
        err(`Havuz ${pid}: acik havuz boyut tavan asimi (${(size / 1024).toFixed(1)} KB > 250 KB)`);
      }
    }

    const otherLabels = new Set(rows.map((r) => matcher.normFold(r.label)));
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!isNfc(r.label)) err(`Havuz ${pid}[${i}]: label NFC degil ("${r.label}")`);
      if (r.year !== null && r.year !== undefined && !isValidYear(r.year, 2026)) {
        err(`Havuz ${pid}[${i}] (${r.label}): gecersiz yil (${r.year})`);
      }
      for (const al of r.aliases || []) {
        if (!isNfc(al)) err(`Havuz ${pid}[${i}] (${r.label}): alias NFC degil ("${al}")`);
        // f&8 alias oyunda olmamali
        if ((r.f & 8) !== 0 && isSuspicious(al, r.label, otherLabels)) {
          err(`Havuz ${pid}[${i}] (${r.label}): supheli alias oyuna yazilmis ("${al}")`);
        }
      }
    }
  }

  // Butce kontrolu
  const totalBytes = dirSizeBytes(args.dataDir);
  if (totalBytes > TOTAL_BUDGET_BYTES) {
    err(`Toplam data/ boyutu butceyi asiyor: ${(totalBytes / 1024).toFixed(1)} KB > ${(TOTAL_BUDGET_BYTES / 1024).toFixed(0)} KB`);
  }

  // 3. Sorulari yukle (data/q_*.js)
  globalThis.PUSULLA_QUESTIONS = [];
  const qFiles = fs.existsSync(args.dataDir)
    ? fs.readdirSync(args.dataDir).filter((f) => /^q_.+\.js$/i.test(f))
    : [];

  if (qFiles.length === 0) {
    console.log('Bilgi: soru yok (data/q_*.js bulunamadi). Yalniz havuzlar kontrol edildi.');
  } else {
    for (const qf of qFiles) {
      if (args.demo && qf !== 'q_demo.js') continue;
      const full = path.join(args.dataDir, qf);
      delete require.cache[require.resolve(full)];
      require(full);
    }

    const questions = globalThis.PUSULLA_QUESTIONS || [];
    if (args.demo && questions.length !== 42) {
      err(`--demo: q_demo.js 42 soru icermeli (mevcut: ${questions.length})`);
    }

    const seenIds = new Set();
    const cats = (meta && meta.CATEGORIES) ? meta.CATEGORIES : {};

    for (const q of questions) {
      if (!q || !q.id) {
        err('Soru id eksik.');
        continue;
      }
      if (seenIds.has(q.id)) err(`Tekrarlanan soru id: ${q.id}`);
      seenIds.add(q.id);

      if (!q.text || !/^Bir tane .+ söyle\.$/.test(q.text)) {
        err(`Soru ${q.id}: text kalibi gecersiz ("${q.text || ''}")`);
      }
      if (!isNfc(q.text) || !isNfc(q.subject || '')) {
        err(`Soru ${q.id}: subject/text NFC degil`);
      }
      if (!q.cat || !cats[q.cat]) {
        err(`Soru ${q.id}: gecersiz cat ("${q.cat || ''}")`);
      }

      const pool = globalThis.PUSULLA_POOLS[q.pool];
      if (!pool) {
        err(`Soru ${q.id}: havuz bulunamadi ("${q.pool || ''}")`);
        continue;
      }

      if (!Array.isArray(q.invalid) || q.invalid.length < 2) {
        err(`Soru ${q.id}: invalid en az 2 grup olmali`);
      }

      const rows = engine.filterPool(pool, q);
      if (q.closed) {
        if (typeof q.expect !== 'number' || q.expect <= 0) {
          err(`Soru ${q.id}: kapali kumede expect zorunlu`);
        } else if (rows.length !== q.expect) {
          err(`Soru ${q.id}: kapali kume satir sayisi (${rows.length}) !== expect (${q.expect})`);
        }
        if (!q.scope || !isNfc(q.scope)) err(`Soru ${q.id}: kapali kumede scope zorunlu ve NFC olmali`);
        if (!q.authority) err(`Soru ${q.id}: kapali kumede authority zorunlu`);
      }

      // Eksen ve yil kapsami (PLAN §3.5, engine.axesOf ile uyumlu)
      const axes = engine.axesOf(q, pool);
      if (!axes.axis) {
        err(`Soru ${q.id}: gecerli eksen yok (ne zaman ne pay ekseni saglaniyor)`);
      }
      const yearKind = q.yearKind || pool.yearKind;
      if (yearKind) {
        const withYear = rows.filter((r) => typeof r.year === 'number' && !isNaN(r.year));
        const ratio = rows.length > 0 ? (withYear.length / rows.length) : 0;
        if (q.closed && withYear.length !== rows.length) {
          const msg = `Soru ${q.id}: kapali kumede yil kapsami %100 olmali (${withYear.length}/${rows.length})`;
          if (axes.pop) warn(msg + ' [P moduna dusuyor]');
          else err(msg);
        } else if (!q.closed && ratio < 0.90) {
          const msg = `Soru ${q.id}: acik kumede yil kapsami >= %90 olmali (${(ratio * 100).toFixed(1)}%)`;
          if (axes.pop) warn(msg + ' [P moduna dusuyor]');
          else err(msg);
        }

        if (args.strict && withYear.length > 0) {
          const sorted = withYear.slice().sort((a, b) => a.year - b.year);
          const extremes = sorted.slice(0, 5).concat(sorted.slice(-5));
          const unverified = extremes.filter((r) => (r.f & 4) === 0);
          if (unverified.length > 0) {
            err(`Soru ${q.id} (--strict): uc yillarda dogrulanmamis (f&4=0) ${unverified.length} satir var`);
          }
        }
      }

      // Share kontrolu
      if (q.share) {
        if (q.share.estimated !== true) {
          err(`Soru ${q.id}: share.estimated === true olmali`);
        }
        const list = Array.isArray(q.share.list) ? q.share.list : [];
        const rowKeys = new Set(rows.map((r) => matcher.normFold(r.label)));
        let sum = 0;
        let tailSmall = 0;
        for (const item of list) {
          const lbl = Array.isArray(item) ? item[0] : item.label;
          const val = Array.isArray(item) ? item[1] : item.share;
          if (!rowKeys.has(matcher.normFold(lbl))) {
            err(`Soru ${q.id}: share.list adayi havuzda yok ("${lbl}")`);
          }
          if (typeof val === 'number') {
            sum += val;
            if (val <= 1.0) tailSmall++;
          }
        }
        if (sum < 99 || sum > 101) {
          err(`Soru ${q.id}: share toplami 99-101 arasi olmali (${sum.toFixed(2)})`);
        }
        if (q.closed && tailSmall < 5) {
          warn(`Soru ${q.id}: kapali kumede NADIR kuyrukta share<=1.0 aday sayisi < 5 (${tailSmall})`);
        }
      }

      // invalid <-> satir cakismasi
      const poolKeySet = new Set();
      for (const r of rows) {
        poolKeySet.add(matcher.normFold(r.label));
        for (const al of r.aliases || []) poolKeySet.add(matcher.normFold(al));
      }
      for (const grp of q.invalid || []) {
        for (const invAl of grp.aliases || []) {
          if (poolKeySet.has(matcher.normFold(invAl))) {
            err(`Soru ${q.id}: invalid alias "${invAl}" havuz satiri ile cakisiyor`);
          }
        }
      }
    }
  }

  for (const w of warnings) console.warn('UYARI:', w);
  for (const e of errors) console.error('HATA:', e);
  console.log(`check.js ozet -> Havuz: ${poolFiles.length}, HATA: ${errors.length}, UYARI: ${warnings.length}`);
  if (errors.length > 0) process.exit(1);
}

main();
