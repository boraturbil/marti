'use strict';

const fs = require('fs');
const path = require('path');

const V3_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(V3_DIR, 'data');
const OUT_DIR = path.join(__dirname, 'harvest', 'out');
const REV_DIR = path.join(V3_DIR, 'rev');
const REPORT_PATH = path.join(REV_DIR, 'DEMO_SORULAR.md');

const engine = require(path.join(V3_DIR, 'engine.js'));

function loadUmdGlobal(filePath) {
  const resolved = require.resolve(filePath);
  delete require.cache[resolved];
  return require(resolved);
}

function fmtPct(num, den) {
  if (!den) return '%0.0';
  return '%' + ((num / den) * 100).toFixed(1);
}

function fmtYear(r) {
  if (typeof r.year !== 'number' || Number.isNaN(r.year)) return '-';
  const approx = (r.f & 1) !== 0 ? '~' : '';
  return `${approx}${r.year}`;
}

function escMd(s) {
  return String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function parseSizeMd(filePath) {
  if (!fs.existsSync(filePath)) {
    return { summaryLine: 'SIZE.md bulunamadı.', rows: [], totalRawKb: 0, totalGzipKb: 0 };
  }
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  const summaryLine = lines.find((l) => l.startsWith('Toplam:')) || '';
  const rows = [];
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    const parts = line.split('|').slice(1, -1).map((p) => p.trim());
    if (parts.length < 6 || parts[0] === 'Havuz' || /^-+$/.test(parts[0])) continue;
    rows.push({
      pool: parts[0],
      mode: parts[1],
      count: Number(parts[2]),
      trimmed: Number(parts[3]),
      rawKb: Number(parts[4]),
      gzipKb: Number(parts[5])
    });
  }
  return { summaryLine, rows };
}

function parseMissingMd(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  const items = [];
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    const parts = line.split('|').slice(1, -1).map((p) => p.trim());
    if (parts.length < 4 || parts[0] === 'Havuz' || /^-+$/.test(parts[0])) continue;
    items.push({
      pool: parts[0],
      expected: Number(parts[1]),
      actual: Number(parts[2]),
      diff: Number(parts[3])
    });
  }
  return items;
}

function buildQuestionStats(q, pool, meta, missingMap) {
  const rows = engine.filterPool(pool, q);
  const axes = engine.axesOf(q, pool);
  const closed = Boolean(q.closed);
  const yearKind = q.yearKind || (pool && pool.yearKind) || null;

  let withYearCount = 0;
  let withAliasCount = 0;
  let curatedCount = 0;
  let suspiciousAliasRowCount = 0;
  let totalAliasCount = 0;

  for (const r of rows) {
    if (typeof r.year === 'number' && !Number.isNaN(r.year)) withYearCount++;
    const aliases = Array.isArray(r.aliases) ? r.aliases : [];
    if (aliases.length > 0) withAliasCount++;
    totalAliasCount += aliases.length;
    if ((r.f & 2) !== 0) curatedCount++;
    if ((r.f & 8) !== 0) suspiciousAliasRowCount++;
  }

  const yearPct = fmtPct(withYearCount, rows.length);
  const aliasRowPct = fmtPct(withAliasCount, rows.length);

  const missingEntry = missingMap.get(q.pool) || null;
  const expectMatch = closed ? (rows.length === q.expect) : null;

  let status = '✅';
  const notes = [];
  if (!axes.axis) {
    status = '❌';
    notes.push('Geçerli eksen yok');
  } else {
    if (yearKind && !axes.time) {
      status = '⚠️';
      notes.push(`Yıl kapsamı yetersiz (${yearPct}), P moduna düşüyor`);
    }
    if (closed && !expectMatch) {
      status = '❌';
      notes.push(`expect (${q.expect}) !== satır (${rows.length})`);
    }
    if (missingEntry) {
      if (status === '✅') status = '⚠️';
      notes.push(`MISSING.md: beklenen ${missingEntry.expected}, mevcut ${missingEntry.actual} (${missingEntry.diff})`);
    }
  }

  const cats = (meta && meta.CATEGORIES) || {};
  const catName = (cats[q.cat] && cats[q.cat].name) || q.cat;

  const top15BySl = rows
    .slice()
    .sort((a, b) => (b.sl - a.sl) || a.label.localeCompare(b.label, 'tr'))
    .slice(0, 15);

  const withYearRows = rows
    .filter((r) => typeof r.year === 'number' && !Number.isNaN(r.year))
    .slice()
    .sort((a, b) => (a.year - b.year) || (b.sl - a.sl) || a.label.localeCompare(b.label, 'tr'));

  const oldest3 = withYearRows.slice(0, 3);
  const newest3 = withYearRows.slice(-3).reverse();

  const shareList = (q.share && Array.isArray(q.share.list)) ? q.share.list : [];
  const shareTop10 = shareList.slice(0, 10).map((item) => ({
    label: Array.isArray(item) ? item[0] : item.label,
    val: Array.isArray(item) ? item[1] : item.share
  }));

  return {
    q,
    pool,
    rows,
    axes,
    closed,
    yearKind,
    catName,
    withYearCount,
    withAliasCount,
    yearPct,
    aliasRowPct,
    curatedCount,
    suspiciousAliasRowCount,
    totalAliasCount,
    top15BySl,
    oldest3,
    newest3,
    shareTop10,
    expectMatch,
    missingEntry,
    status,
    notes
  };
}

function renderReport(statsList, sizeData, missingItems) {
  const out = [];
  out.push('# PUSULLA Demo Soruları Raporu');
  out.push('');
  out.push(`Toplam soru: **${statsList.length}**`);
  out.push('');

  // Özet tablo
  out.push('## Özet Tablo');
  out.push('');
  out.push('| No | Soru ID | Soru Metni | Eksen | Kapalı/Açık | Havuz Boyutu | Yıl % | Curated | Şüpheli Alias | Durum |');
  out.push('|---:|---|---|---|---|---:|---:|---:|---:|:---:|');
  statsList.forEach((s, idx) => {
    const no = idx + 1;
    const axisStr = s.axes.axis || '-';
    const kindStr = s.closed ? 'Kapalı' : 'Açık';
    out.push(
      `| ${no} | \`${escMd(s.q.id)}\` | ${escMd(s.q.text)} | ${axisStr} | ${kindStr} | ${s.rows.length} | ${s.yearPct} | ${s.curatedCount} | ${s.suspiciousAliasRowCount} | ${s.status} |`
    );
  });
  out.push('');

  // Soru detayları
  out.push('## Soru Detayları');
  out.push('');

  statsList.forEach((s, idx) => {
    const no = idx + 1;
    const q = s.q;
    out.push(`### ${no}. ${q.id} — ${q.text}`);
    out.push('');
    out.push(`- **Metin:** ${q.text}`);
    out.push(`- **Konu:** ${q.subject}`);
    out.push(`- **Kategori:** \`${q.cat}\` (${s.catName})`);
    out.push(`- **Eksen:** \`${s.axes.axis || '-'}\`${s.yearKind ? ` (yearKind: \`${s.yearKind}\`)` : ''}${s.notes.length ? ` — ${s.notes.join('; ')}` : ''}`);
    if (s.closed) {
      out.push(`- **Küme Türü:** Kapalı | **expect:** ${q.expect} | **authority:** ${q.authority || '-'} | **scope:** ${q.scope || '-'}`);
    } else {
      out.push(`- **Küme Türü:** Açık | **expect:** yok | **authority:** yok | **scope:** yok`);
    }
    out.push(`- **Havuz:** \`${q.pool}\` (${s.rows.length} satır) | **Yıl kapsamı:** ${s.withYearCount}/${s.rows.length} (${s.yearPct}) | **Alias'lı satır:** ${s.withAliasCount}/${s.rows.length} (${s.aliasRowPct})`);
    out.push(`- **Kalite sayaçları:** Curated (\`f&2\`): **${s.curatedCount}** | Şüpheli alias (\`f&8\`): **${s.suspiciousAliasRowCount}** satır | Toplam alias: **${s.totalAliasCount}**`);

    if (s.closed) {
      const matchText = s.expectMatch
        ? `Evet (${s.rows.length} === ${q.expect})`
        : `Hayır (mevcut: ${s.rows.length}, expect: ${q.expect})`;
      const missingText = s.missingEntry
        ? ` | MISSING.md: beklenen ${s.missingEntry.expected}, mevcut ${s.missingEntry.actual}, fark ${s.missingEntry.diff}`
        : '';
      out.push(`- **Kapalı küme tutarlılığı:** ${matchText}${missingText}`);
    } else {
      out.push(`- **Kapalı küme tutarlılığı:** Açık küme (uygulanmaz)`);
    }

    // Invalid grupları
    out.push('- **Invalid grupları:**');
    if (Array.isArray(q.invalid) && q.invalid.length > 0) {
      for (const grp of q.invalid) {
        const examples = (grp.aliases || []).slice(0, 2).join(', ');
        out.push(`  - Örnek: ${examples || '-'} — *${grp.reason || '-'}*`);
      }
    } else {
      out.push('  - Yok');
    }

    // Share top-10
    if (s.shareTop10.length > 0) {
      const byInfo = q.share && q.share.by ? `, ${q.share.by}` : '';
      out.push(`- **Pay Top-10 (AI tahmini${byInfo}):**`);
      s.shareTop10.forEach((item, i) => {
        out.push(`  ${i + 1}. ${item.label} (%${item.val})`);
      });
    } else {
      out.push('- **Pay Top-10:** pay yok');
    }

    // En eski 3 ve en yeni 3
    if (s.oldest3.length > 0) {
      const oldStr = s.oldest3.map((r) => `${r.label} (${fmtYear(r)})`).join(', ');
      const newStr = s.newest3.map((r) => `${r.label} (${fmtYear(r)})`).join(', ');
      out.push(`- **En eski 3 satır:** ${oldStr}`);
      out.push(`- **En yeni 3 satır:** ${newStr}`);
    } else {
      out.push('- **En eski / en yeni 3 satır:** yıl verisi yok');
    }

    // İlk 15 satır (sl azalan)
    out.push('');
    out.push('**Havuzdan İlk 15 Satır (sl azalan):**');
    out.push('');
    out.push('| # | Ad (label) | Yıl | sl |');
    out.push('|---:|---|---:|---:|');
    s.top15BySl.forEach((r, i) => {
      out.push(`| ${i + 1} | ${escMd(r.label)} | ${fmtYear(r)} | ${r.sl} |`);
    });
    out.push('');
  });

  // Sonda: SIZE.md özeti
  out.push('## Havuz Boyut Özeti (SIZE.md)');
  out.push('');
  if (sizeData.summaryLine) {
    out.push(sizeData.summaryLine);
  } else {
    out.push('SIZE.md özet satırı okunamadı.');
  }
  out.push('');

  // Sonda: MISSING.md özeti
  out.push('## Kapalı Kümelerdeki Eksik / Fazla Listesi (MISSING.md)');
  out.push('');
  if (missingItems.length === 0) {
    out.push('MISSING.md içinde eksik veya fazla bildirilen kapalı küme yok.');
  } else {
    out.push('| Havuz | Beklenen | Mevcut | Fark |');
    out.push('|---|---:|---:|---:|');
    for (const m of missingItems) {
      out.push(`| ${escMd(m.pool)} | ${m.expected} | ${m.actual} | ${m.diff} |`);
    }
  }
  out.push('');

  return out.join('\n');
}

function main() {
  globalThis.PUSULLA_META = undefined;
  const meta = loadUmdGlobal(path.join(DATA_DIR, '_meta.js'));

  globalThis.PUSULLA_POOLS = {};
  const poolDir = path.join(DATA_DIR, 'pool');
  const poolFiles = fs.existsSync(poolDir)
    ? fs.readdirSync(poolDir).filter((f) => /\.js$/i.test(f))
    : [];
  for (const pf of poolFiles) {
    loadUmdGlobal(path.join(poolDir, pf));
  }

  globalThis.PUSULLA_QUESTIONS = [];
  loadUmdGlobal(path.join(DATA_DIR, 'q_demo.js'));
  const questions = globalThis.PUSULLA_QUESTIONS || [];

  const sizeData = parseSizeMd(path.join(OUT_DIR, 'SIZE.md'));
  const missingItems = parseMissingMd(path.join(OUT_DIR, 'MISSING.md'));
  const missingMap = new Map(missingItems.map((m) => [m.pool, m]));

  const statsList = questions.map((q) => {
    const pool = globalThis.PUSULLA_POOLS[q.pool] || { rows: [] };
    return buildQuestionStats(q, pool, meta, missingMap);
  });

  const md = renderReport(statsList, sizeData, missingItems);
  fs.mkdirSync(REV_DIR, { recursive: true });
  fs.writeFileSync(REPORT_PATH, md, 'utf8');
  console.log(`Rapor yazildi: ${REPORT_PATH} (${statsList.length} soru)`);
}

main();
