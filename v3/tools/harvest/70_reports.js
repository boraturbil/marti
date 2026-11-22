'use strict';

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {
    inDir: path.join(__dirname, 'in'),
    outFile: path.join(__dirname, 'out', 'REPORTS.md')
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--in-dir' && argv[i + 1]) args.inDir = path.resolve(argv[++i]);
    else if (a === '--out' && argv[i + 1]) args.outFile = path.resolve(argv[++i]);
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv);
  fs.mkdirSync(path.dirname(args.outFile), { recursive: true });

  if (!fs.existsSync(args.inDir)) {
    fs.writeFileSync(args.outFile, '# Oyuncu Bildirimleri (REPORTS)\n\nHenüz bildirim dosyası yok (`in/reports_*.json` bulunamadı).\n', 'utf8');
    console.log('70_reports: in/ klasoru yok, bos rapor yazildi.');
    return;
  }

  const files = fs.readdirSync(args.inDir).filter((f) => /^reports_.+\.json$/i.test(f));
  if (files.length === 0) {
    fs.writeFileSync(args.outFile, '# Oyuncu Bildirimleri (REPORTS)\n\nHenüz bildirim dosyası yok (`in/reports_*.json` bulunamadı).\n', 'utf8');
    console.log('70_reports: bildirim dosyasi yok, bos rapor yazildi.');
    return;
  }

  const grouped = new Map();
  let total = 0;

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(args.inDir, file), 'utf8'));
    const list = Array.isArray(data) ? data : (Array.isArray(data.reports) ? data.reports : []);
    for (const item of list) {
      if (!item || !item.q || !item.t) continue;
      total++;
      const q = String(item.q);
      const t = String(item.t).trim();
      const k = String(item.k || 'none');
      if (!grouped.has(q)) grouped.set(q, new Map());
      const qMap = grouped.get(q);
      const key = k + '|' + t.toLocaleLowerCase('tr-TR');
      if (!qMap.has(key)) {
        qMap.set(key, { kind: k, text: t, count: 0 });
      }
      qMap.get(key).count++;
    }
  }

  const lines = [
    '# Oyuncu Bildirimleri (REPORTS)',
    '',
    `Toplam ${files.length} dosya, ${total} bildirim.`,
    ''
  ];

  for (const [q, qMap] of grouped.entries()) {
    lines.push(`## ${q}`);
    lines.push('| Tür | Yazılan | Sayı | Manual Önerisi |');
    lines.push('|---|---|---|---|');
    const items = Array.from(qMap.values()).sort((a, b) => b.count - a.count);
    for (const it of items) {
      const suggestion = it.kind === 'none'
        ? `add: { label: '${it.text}', aliases: [], year: null, note: 'oyuncu bildirimi' }`
        : `alias/incele: '${it.text}'`;
      lines.push(`| ${it.kind} | ${it.text} | ${it.count} | \`${suggestion}\` |`);
    }
    lines.push('');
  }

  fs.writeFileSync(args.outFile, lines.join('\n') + '\n', 'utf8');
  console.log(`70_reports: ${total} bildirim islendi -> ${args.outFile}`);
}

main();
