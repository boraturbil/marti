'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const engine = require('../engine');

function parseArgs(argv) {
  const args = {
    poolDir: path.resolve(__dirname, '../data/pool'),
    mergedDir: path.resolve(__dirname, 'harvest/out')
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--pool-dir' && argv[i + 1]) args.poolDir = path.resolve(argv[++i]);
    else if (a === '--merged-dir' && argv[i + 1]) args.mergedDir = path.resolve(argv[++i]);
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv);
  if (!fs.existsSync(args.poolDir)) {
    console.log('pool_report: havuz klasoru bulunamadi (' + args.poolDir + ').');
    return;
  }

  const files = fs.readdirSync(args.poolDir).filter((f) => /\.js$/i.test(f));
  if (files.length === 0) {
    console.log('pool_report: havuz dosyasi yok.');
    return;
  }

  globalThis.PUSULLA_POOLS = {};
  console.log('| Havuz | Mod | Boyut | Yıl % | Alias % | Curated | Şüpheli Alias | Kırpılan | Ham KB | Gzip KB |');
  console.log('|---|---|---|---|---|---|---|---|---|---|');

  let totRows = 0;
  let totRaw = 0;
  let totGz = 0;

  for (const file of files) {
    const full = path.join(args.poolDir, file);
    const buf = fs.readFileSync(full);
    const gz = zlib.gzipSync(buf);

    delete require.cache[require.resolve(full)];
    require(full);

    const pid = file.replace(/\.js$/i, '');
    const pool = globalThis.PUSULLA_POOLS[pid];
    if (!pool) continue;

    const rows = engine.getPoolRows(pool);
    const n = rows.length;
    let withYear = 0;
    let withAlias = 0;
    let curated = 0;
    let suspFlagged = 0;

    for (const r of rows) {
      if (typeof r.year === 'number' && !isNaN(r.year)) withYear++;
      if (Array.isArray(r.aliases) && r.aliases.length > 0) withAlias++;
      if ((r.f & 2) !== 0) curated++;
      if ((r.f & 8) !== 0) suspFlagged++;
    }

    let suspCount = suspFlagged;
    let trimmed = 0;
    const mergedPath = path.join(args.mergedDir, 'merged_' + pid + '.json');
    if (fs.existsSync(mergedPath)) {
      const m = JSON.parse(fs.readFileSync(mergedPath, 'utf8'));
      if (m.stats) {
        if (typeof m.stats.suspiciousAliasCount === 'number') suspCount = m.stats.suspiciousAliasCount;
        if (typeof m.stats.trimmedRows === 'number') trimmed = m.stats.trimmedRows;
      }
    }

    const yearPct = n > 0 ? ((withYear / n) * 100).toFixed(1) + '%' : '0.0%';
    const aliasPct = n > 0 ? ((withAlias / n) * 100).toFixed(1) + '%' : '0.0%';
    const rawKB = (buf.length / 1024).toFixed(2);
    const gzKB = (gz.length / 1024).toFixed(2);

    totRows += n;
    totRaw += buf.length;
    totGz += gz.length;

    console.log(`| ${pid} | ${pool.closed ? 'k' : 'a'} | ${n} | ${yearPct} | ${aliasPct} | ${curated} | ${suspCount} | ${trimmed} | ${rawKB} | ${gzKB} |`);
  }

  console.log(`Toplam: ${files.length} havuz, ${totRows} satır, ${(totRaw / 1024).toFixed(2)} KB ham, ${(totGz / 1024).toFixed(2)} KB gzip.`);
}

main();
