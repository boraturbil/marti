'use strict';

const fs = require('fs');
const path = require('path');
const matcher = require('../matcher');
const engine = require('../engine');

function parseArgs(argv) {
  const args = {
    blindDir: path.resolve(__dirname, '../rev/blind'),
    dataDir: path.resolve(__dirname, '../data'),
    outFile: path.resolve(__dirname, '../rev/BLIND_RAPOR.md')
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--blind-dir' && argv[i + 1]) args.blindDir = path.resolve(argv[++i]);
    else if (a === '--data-dir' && argv[i + 1]) args.dataDir = path.resolve(argv[++i]);
    else if (a === '--out' && argv[i + 1]) args.outFile = path.resolve(argv[++i]);
  }
  return args;
}

function loadQuestions(dataDir) {
  globalThis.PUSULLA_QUESTIONS = [];
  if (!fs.existsSync(dataDir)) return [];
  const qFiles = fs.readdirSync(dataDir).filter((f) => /^q_.+\.js$/i.test(f));
  for (const qf of qFiles) {
    const full = path.join(dataDir, qf);
    delete require.cache[require.resolve(full)];
    require(full);
  }
  return globalThis.PUSULLA_QUESTIONS || [];
}

function loadPools(dataDir) {
  globalThis.PUSULLA_POOLS = {};
  const poolDir = path.join(dataDir, 'pool');
  if (!fs.existsSync(poolDir)) return {};
  const files = fs.readdirSync(poolDir).filter((f) => /\.js$/i.test(f));
  for (const f of files) {
    const full = path.join(poolDir, f);
    delete require.cache[require.resolve(full)];
    require(full);
  }
  return globalThis.PUSULLA_POOLS || {};
}

function main() {
  const args = parseArgs(process.argv);
  fs.mkdirSync(path.dirname(args.outFile), { recursive: true });

  if (!fs.existsSync(args.blindDir)) {
    fs.writeFileSync(args.outFile, '# Kör Cevap Testi (BLIND_RAPOR)\n\ngirdi yok\n', 'utf8');
    console.log('blind_test: girdi yok');
    return;
  }

  const txtFiles = fs.readdirSync(args.blindDir)
    .filter((f) => /\.txt$/i.test(f))
    .sort();

  if (txtFiles.length === 0) {
    fs.writeFileSync(args.outFile, '# Kör Cevap Testi (BLIND_RAPOR)\n\ngirdi yok\n', 'utf8');
    console.log('blind_test: girdi yok');
    return;
  }

  const questions = loadQuestions(args.dataDir);
  const qById = new Map();
  for (const q of questions) {
    if (q && q.id) qById.set(q.id, q);
  }
  const pools = loadPools(args.dataDir);

  const results = [];
  let totalAll = 0;
  let totalValid = 0;
  let totalConfirm = 0;
  let totalInvalid = 0;
  let totalNone = 0;

  for (const file of txtFiles) {
    const qid = file.replace(/\.txt$/i, '');
    const q = qById.get(qid) || null;
    const poolId = q ? q.pool : qid.replace(/_\d+$/, '');
    const pool = pools[poolId];

    const lines = fs.readFileSync(path.join(args.blindDir, file), 'utf8')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'));

    if (!pool) {
      results.push({
        qid,
        poolId,
        closed: q ? Boolean(q.closed) : false,
        total: lines.length,
        valid: 0,
        confirm: 0,
        invalid: 0,
        none: lines.length,
        failed: lines.map((l) => ({ input: l, status: 'havuz-yok' })),
        missingPool: true
      });
      totalAll += lines.length;
      totalNone += lines.length;
      continue;
    }

    const filteredPool = q && q.filter
      ? Object.assign({}, pool, { rows: engine.filterPool(pool, q), cols: null })
      : pool;
    const idx = matcher.createIndex(filteredPool, q || {});

    let valid = 0;
    let confirm = 0;
    let invalid = 0;
    let none = 0;
    const failed = [];

    for (const ans of lines) {
      const res = matcher.matchAnswer(ans, idx);
      if (res.type === 'valid') {
        valid++;
      } else if (res.type === 'confirm') {
        confirm++;
      } else if (res.type === 'invalid') {
        invalid++;
        failed.push({ input: ans, status: 'gecersiz', reason: res.reason });
      } else {
        none++;
        failed.push({ input: ans, status: 'havuzda-yok' });
      }
    }

    totalAll += lines.length;
    totalValid += valid;
    totalConfirm += confirm;
    totalInvalid += invalid;
    totalNone += none;

    results.push({
      qid,
      poolId,
      closed: Boolean(pool.closed),
      total: lines.length,
      valid,
      confirm,
      invalid,
      none,
      failed,
      missingPool: false
    });
  }

  const out = [
    '# Kör Cevap Testi (BLIND_RAPOR)',
    '',
    `Toplam: **${results.length}** soru, **${totalAll}** cevap — Geçerli: **${totalValid}**, Bulanık (Onay): **${totalConfirm}**, Geçersiz: **${totalInvalid}**, Havuzda Yok: **${totalNone}**.`,
    '',
    '| Soru | Havuz | Küme | Toplam | Geçerli | Bulanık | Geçersiz | Havuzda Yok | Oran | Hedef |',
    '|---|---|---|---:|---:|---:|---:|---:|---:|---|'
  ];

  const failSections = [];
  for (const r of results) {
    const matched = r.valid + r.confirm;
    const pct = r.total > 0 ? (matched / r.total) * 100 : 0;
    const target = r.closed ? 100 : 90;
    const ok = !r.missingPool && pct >= target;
    out.push(`| ${r.qid} | ${r.poolId} | ${r.closed ? 'kapalı' : 'açık'} | ${r.total} | ${r.valid} | ${r.confirm} | ${r.invalid} | ${r.none} | %${pct.toFixed(1)} | ${ok ? 'TAMAM' : 'KALDI (<%' + target + ')'} |`);
    if (r.failed.length > 0) {
      failSections.push(`### ${r.qid} (${r.poolId})`);
      for (const f of r.failed) {
        failSections.push(`- \`${f.input}\` → ${f.status}${f.reason ? ' (' + f.reason + ')' : ''}`);
      }
      failSections.push('');
    }
  }

  if (failSections.length > 0) {
    out.push('', '## Başarısız Cevaplar', '');
    out.push(...failSections);
  }

  fs.writeFileSync(args.outFile, out.join('\n') + '\n', 'utf8');
  console.log(`blind_test: ${results.length} soru, ${totalAll} cevap -> gecerli ${totalValid}, bulanik ${totalConfirm}, gecersiz ${totalInvalid}, yok ${totalNone}.`);
}

main();
