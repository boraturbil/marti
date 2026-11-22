'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const MAX_OPEN_ROWS = 5000;
const MAX_OPEN_BYTES = 250 * 1024;
const TOTAL_BUDGET_BYTES = Math.round(1.8 * 1024 * 1024);
const BUDGET_TRIM_ORDER = ['film', 'video_oyunu', 'dunya_sehri', 'isletim_sistemi'];

function loadPoolsList() {
  const p = path.join(__dirname, 'pools.json');
  if (!fs.existsSync(p)) return null;
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  return (data.pools || []).map((x) => x.id);
}

function parseArgs(argv) {
  const args = {
    only: null,
    inDir: path.join(__dirname, 'out'),
    outDir: path.resolve(__dirname, '../../data/pool'),
    reportDir: path.join(__dirname, 'out')
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--only' && argv[i + 1]) args.only = argv[++i];
    else if (a === '--in-dir' && argv[i + 1]) args.inDir = path.resolve(argv[++i]);
    else if (a === '--out-dir' && argv[i + 1]) args.outDir = path.resolve(argv[++i]);
    else if (a === '--report-dir' && argv[i + 1]) args.reportDir = path.resolve(argv[++i]);
  }
  return args;
}

function serializePool(merged, rows) {
  const compactRows = rows.map((r) => [
    r.label,
    Array.isArray(r.aliases) ? r.aliases : [],
    r.year !== undefined ? r.year : null,
    r.src || 'm',
    typeof r.sl === 'number' ? r.sl : 0,
    typeof r.f === 'number' ? r.f : 0
  ]);

  const headerObj = {
    id: merged.pool,
    asOf: merged.asOf || '2026-11',
    closed: Boolean(merged.closed),
    expect: merged.expect !== undefined ? merged.expect : null,
    yearKind: merged.yearKind || null,
    sources: merged.sources || [],
    license: merged.license || [],
    cols: ['label', 'aliases', 'year', 'src', 'sl', 'f']
  };

  const rowsJson = compactRows.map((row) => '    ' + JSON.stringify(row)).join(',\n');
  const body =
    '(function(r){ (r.PUSULLA_POOLS = r.PUSULLA_POOLS || {})[' + JSON.stringify(merged.pool) + '] = {\n' +
    '  id: ' + JSON.stringify(headerObj.id) + ',\n' +
    '  asOf: ' + JSON.stringify(headerObj.asOf) + ',\n' +
    '  closed: ' + JSON.stringify(headerObj.closed) + ',\n' +
    '  expect: ' + JSON.stringify(headerObj.expect) + ',\n' +
    '  yearKind: ' + JSON.stringify(headerObj.yearKind) + ',\n' +
    '  sources: ' + JSON.stringify(headerObj.sources) + ',\n' +
    '  license: ' + JSON.stringify(headerObj.license) + ',\n' +
    '  cols: ' + JSON.stringify(headerObj.cols) + ',\n' +
    '  rows: [\n' + rowsJson + '\n  ]\n' +
    '}; })(typeof window!==\'undefined\'?window:globalThis);\n';

  return body;
}

function emitPool(merged) {
  let rows = (merged.rows || []).slice();
  let trimmed = 0;

  if (!merged.closed && rows.length > MAX_OPEN_ROWS) {
    rows.sort((a, b) => (b.sl || 0) - (a.sl || 0));
    trimmed += rows.length - MAX_OPEN_ROWS;
    rows = rows.slice(0, MAX_OPEN_ROWS);
  }

  let js = serializePool(merged, rows);
  let buf = Buffer.from(js, 'utf8');

  if (!merged.closed && buf.length > MAX_OPEN_BYTES) {
    rows.sort((a, b) => (b.sl || 0) - (a.sl || 0));
    while (rows.length > 0 && buf.length > MAX_OPEN_BYTES) {
      const cut = Math.max(1, Math.floor(rows.length * 0.05));
      rows = rows.slice(0, rows.length - cut);
      trimmed += cut;
      js = serializePool(merged, rows);
      buf = Buffer.from(js, 'utf8');
    }
  }

  const gz = zlib.gzipSync(buf);
  return {
    js,
    rowCount: rows.length,
    trimmed,
    rawBytes: buf.length,
    gzipBytes: gz.length
  };
}

function main() {
  const args = parseArgs(process.argv);
  fs.mkdirSync(args.outDir, { recursive: true });
  fs.mkdirSync(args.reportDir, { recursive: true });

  const isDefaultIn = args.inDir === path.join(__dirname, 'out');
  const poolList = isDefaultIn ? loadPoolsList() : null;
  const allowedSet = poolList ? new Set(poolList) : null;

  const files = fs.readdirSync(args.inDir).filter((f) => /^merged_.+\.json$/i.test(f));
  const emittedMap = new Map();
  const stats = [];
  let totalRaw = 0;
  let totalGzip = 0;
  let totalRows = 0;

  for (const file of files) {
    const poolId = file.replace(/^merged_/i, '').replace(/\.json$/i, '');
    if (poolId === 'universite') continue;
    if (allowedSet && !allowedSet.has(poolId)) continue;
    if (args.only && args.only !== poolId) continue;

    const mergedPath = path.join(args.inDir, file);
    const merged = JSON.parse(fs.readFileSync(mergedPath, 'utf8'));
    const res = emitPool(merged);
    emittedMap.set(poolId, { merged, mergedPath, res });
  }

  // Toplam ham boyut butceyi asarsa sirayla film/video_oyunu/dunya_sehri/isletim_sistemi kirp
  const calcTotalRaw = () => {
    let sum = 0;
    for (const item of emittedMap.values()) sum += item.res.rawBytes;
    return sum;
  };

  if (!args.only && calcTotalRaw() > TOTAL_BUDGET_BYTES) {
    for (const targetId of BUDGET_TRIM_ORDER) {
      if (calcTotalRaw() <= TOTAL_BUDGET_BYTES) break;
      const entry = emittedMap.get(targetId);
      if (!entry || entry.merged.closed) continue;
      let rows = (entry.merged.rows || []).slice().sort((a, b) => (b.sl || 0) - (a.sl || 0));
      let trimmed = entry.res.trimmed;
      if (rows.length > entry.res.rowCount) {
        rows = rows.slice(0, entry.res.rowCount);
      }
      while (rows.length > 100 && calcTotalRaw() > TOTAL_BUDGET_BYTES) {
        const cut = Math.max(10, Math.floor(rows.length * 0.1));
        rows = rows.slice(0, rows.length - cut);
        trimmed += cut;
        const js = serializePool(entry.merged, rows);
        const buf = Buffer.from(js, 'utf8');
        const gz = zlib.gzipSync(buf);
        entry.res = {
          js,
          rowCount: rows.length,
          trimmed,
          rawBytes: buf.length,
          gzipBytes: gz.length
        };
      }
    }
  }

  for (const [poolId, entry] of emittedMap.entries()) {
    const { merged, mergedPath, res } = entry;
    fs.writeFileSync(path.join(args.outDir, poolId + '.js'), res.js, 'utf8');

    if (res.trimmed > 0) {
      merged.stats = merged.stats || {};
      merged.stats.trimmedRows = res.trimmed;
      fs.writeFileSync(mergedPath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
    }

    totalRaw += res.rawBytes;
    totalGzip += res.gzipBytes;
    totalRows += res.rowCount;
    stats.push({
      pool: poolId,
      mode: merged.closed ? 'k' : 'a',
      rows: res.rowCount,
      trimmed: res.trimmed,
      rawKB: (res.rawBytes / 1024).toFixed(2),
      gzipKB: (res.gzipBytes / 1024).toFixed(2)
    });
  }

  const pending = [];
  if (poolList && !args.only) {
    for (const pid of poolList) {
      if (!emittedMap.has(pid)) pending.push(pid);
    }
  }

  const totalRawKB = (totalRaw / 1024).toFixed(2);
  const totalGzipKB = (totalGzip / 1024).toFixed(2);
  const budgetKB = (TOTAL_BUDGET_BYTES / 1024).toFixed(0);
  const withinBudget = totalRaw <= TOTAL_BUDGET_BYTES;

  const lines = [
    '# Havuz Boyut Raporu (SIZE)',
    '',
    `Toplam: **${stats.length}** havuz, **${totalRows}** satır, **${totalRawKB} KB** ham, **${totalGzipKB} KB** gzip (bütçe: ${budgetKB} KB ham — ${withinBudget ? 'UYGUN' : 'AŞIM'}).`,
    '',
    '| Havuz | Mod | Satır | Kırpılan | Ham KB | Gzip KB |',
    '|---|---|---|---|---|---|'
  ];
  for (const s of stats) {
    lines.push(`| ${s.pool} | ${s.mode} | ${s.rows} | ${s.trimmed} | ${s.rawKB} | ${s.gzipKB} |`);
  }
  if (pending.length > 0) {
    lines.push('', `Bekleyen havuzlar (${pending.length}): ` + pending.join(', '));
  }
  fs.writeFileSync(path.join(args.reportDir, 'SIZE.md'), lines.join('\n') + '\n', 'utf8');

  console.log(`60_emit: ${stats.length} havuz yazildi. Toplam ${totalRows} satir, ${totalRawKB} KB ham, ${totalGzipKB} KB gzip.`);
}

main();
