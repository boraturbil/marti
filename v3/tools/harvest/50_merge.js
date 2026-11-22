'use strict';

const fs = require('fs');
const path = require('path');
const { filterAliases } = require('./lib/aliasfilter');
const { mergeYears, formatYear, isValidYear } = require('./lib/years');
const matcher = require('../../matcher');

function normKey(s) {
  return matcher.normFold(s || '');
}

function parseArgs(argv) {
  const args = {
    only: null,
    inDir: path.join(__dirname, 'out'),
    outDir: path.join(__dirname, 'out'),
    manualDir: path.resolve(__dirname, '../../data/manual')
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--only' && argv[i + 1]) args.only = argv[++i];
    else if (a === '--in-dir' && argv[i + 1]) args.inDir = path.resolve(argv[++i]);
    else if (a === '--out-dir' && argv[i + 1]) args.outDir = path.resolve(argv[++i]);
    else if (a === '--manual-dir' && argv[i + 1]) args.manualDir = path.resolve(argv[++i]);
  }
  return args;
}

function loadPoolsContract() {
  const p = path.join(__dirname, 'pools.json');
  if (!fs.existsSync(p)) return { list: [], map: {} };
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  const list = data.pools || [];
  const map = {};
  for (const item of list) {
    map[item.id] = item;
  }
  return { list, map };
}

function resolveExpect(raw, contract, manual, closed) {
  if (contract && typeof contract.expect === 'number' && Number.isFinite(contract.expect)) return contract.expect;
  if (contract && typeof contract.expect === 'string') {
    const m = contract.expect.trim().match(/^(\d+)\b/);
    if (m) return parseInt(m[1], 10);
  }
  if (closed && manual && typeof manual.expectNote === 'string') {
    const cleaned = manual.expectNote
      .replace(/\b\d{4}\s*-\s*\d{4}\b/g, ' ')
      .replace(/\bISO\s*\d+\b/gi, ' ')
      .replace(/\bP\d+\b/g, ' ');
    const m = cleaned.match(/\b(\d{1,3})\b/);
    if (m) return parseInt(m[1], 10);
  }
  if (raw && typeof raw.expect === 'number' && Number.isFinite(raw.expect)) return raw.expect;
  return null;
}

function loadManual(manualDir, poolId) {
  const file = path.join(manualDir, poolId + '.js');
  if (!fs.existsSync(file)) return null;
  delete globalThis.PUSULLA_MANUAL;
  delete require.cache[require.resolve(file)];
  const mod = require(file);
  const store = globalThis.PUSULLA_MANUAL || {};
  return store[poolId] || (mod && mod[poolId]) || mod || null;
}

function inferLicenses(sources) {
  const lic = new Set();
  for (const s of sources || []) {
    if (s === 'wikidata') lic.add('CC0');
    else if (s === 'trwiki') lic.add('CC BY-SA 4.0');
    else if (s === 'geonames') lic.add('CC BY 4.0');
    else if (s === 'natural_earth') lic.add('Public Domain');
  }
  return Array.from(lic);
}

function mergePool(poolId, raw, contract, manual) {
  const mode = (raw.mode || (contract && contract.mode) || 'a');
  const closed = mode === 'k';
  const expect = resolveExpect(raw, contract, manual, closed);
  const yearKind = raw.yearKind || (contract && contract.yearKind) || null;
  const sources = Array.isArray(raw.source) ? raw.source.slice() : (Array.isArray(raw.sources) ? raw.sources.slice() : []);
  if (manual && !sources.includes('manual')) sources.push('manual');

  const warnings = [];
  const yearConflicts = [];

  // 1. Kaynak satirlari -> QID ve normalize ada gore tekillestir
  const byQid = new Map();
  const byKey = new Map();
  const rows = [];

  function addOrMergeSourceRow(r) {
    if (!r || !r.label) return;
    const label = String(r.label).normalize('NFC').trim();
    if (!label) return;
    const key = normKey(label);
    const src = r.src ? String(r.src).trim() : '';
    const isQid = /^Q\d+$/i.test(src);
    const qid = isQid ? src.toUpperCase() : null;

    let existing = null;
    if (qid && byQid.has(qid)) existing = byQid.get(qid);
    else if (key && byKey.has(key)) existing = byKey.get(key);

    let rowYear = (typeof r.year === 'number' && Number.isFinite(r.year)) ? Math.trunc(r.year) : null;
    if (rowYear !== null && !isValidYear(rowYear, 2026)) {
      yearConflicts.push({
        pool: poolId,
        label,
        rawYear: rowYear,
        otherYear: null,
        note: 'ASOF (2026) disi yil null yapildi'
      });
      rowYear = null;
    }
    const rowApprox = Boolean(r.approx);
    const rowSl = typeof r.sl === 'number' && Number.isFinite(r.sl) ? Math.trunc(r.sl) : 0;
    const rowAliases = Array.isArray(r.aliases) ? r.aliases.map((x) => String(x).normalize('NFC').trim()).filter(Boolean) : [];

    if (!existing) {
      const obj = {
        label,
        aliases: rowAliases,
        year: rowYear,
        approx: rowApprox,
        src: qid || src || 'm',
        sl: rowSl,
        f: (rowApprox ? 1 : 0) | ((src === 'm' || (!qid && !src)) ? 2 : 0)
      };
      rows.push(obj);
      if (qid) byQid.set(qid, obj);
      if (key) byKey.set(key, obj);
    } else {
      for (const a of rowAliases) existing.aliases.push(a);
      if (normKey(label) !== normKey(existing.label)) {
        existing.aliases.push(label);
      }
      if (rowSl > existing.sl) existing.sl = rowSl;
      if (rowYear !== null) {
        if (existing.year === null) {
          existing.year = rowYear;
          existing.approx = rowApprox;
        } else if (existing.year !== rowYear) {
          const minY = Math.min(existing.year, rowYear);
          const maxY = Math.max(existing.year, rowYear);
          yearConflicts.push({
            pool: poolId,
            label: existing.label,
            rawYear: existing.year,
            otherYear: rowYear,
            note: 'Kaynaklar arasi yil farki (' + existing.src + ' vs ' + (src || '?') + ')'
          });
          existing.year = minY;
          if (maxY - minY > 1) existing.approx = true;
        } else if (rowApprox) {
          existing.approx = true;
        }
      }
      if (existing.approx) existing.f |= 1;
    }
  }

  for (const r of raw.rows || []) {
    addOrMergeSourceRow(r);
  }

  // 2. drop
  const dropSet = new Set();
  if (manual && Array.isArray(manual.drop)) {
    for (const d of manual.drop) {
      const lbl = typeof d === 'string' ? d : (d && d.label);
      if (lbl) dropSet.add(normKey(lbl));
    }
  }
  const afterDrop = rows.filter((r) => !dropSet.has(normKey(r.label)));

  // Yeniden indeksle
  const rowMap = new Map();
  for (const r of afterDrop) {
    rowMap.set(normKey(r.label), r);
  }

  // 3. add (f |= 2)
  if (manual && Array.isArray(manual.add)) {
    for (const a of manual.add) {
      if (!a || !a.label) continue;
      if (!a.src && !a.note) {
        warnings.push(poolId + ': manual add "' + a.label + '" icin src/note eksik.');
      }
      const label = String(a.label).normalize('NFC').trim();
      const key = normKey(label);
      const existing = rowMap.get(key);
      const aYear = (typeof a.year === 'number' && Number.isFinite(a.year)) ? Math.trunc(a.year) : null;
      const aApprox = Boolean(a.approx);
      const aAliases = Array.isArray(a.aliases) ? a.aliases.slice() : [];

      if (existing) {
        existing.f |= 2;
        for (const al of aAliases) existing.aliases.push(al);
        if (aYear !== null && existing.year === null) {
          existing.year = aYear;
          existing.approx = aApprox;
        }
      } else {
        const obj = {
          label,
          aliases: aAliases,
          year: aYear,
          approx: aApprox,
          src: a.src || 'm',
          sl: typeof a.sl === 'number' ? Math.trunc(a.sl) : 0,
          f: 2 | (aApprox ? 1 : 0)
        };
        afterDrop.push(obj);
        rowMap.set(key, obj);
      }
    }
  }

  // 4. alias ('!' onekli kaldirir, digerleri onayli alias)
  const approvedByRow = new Map();
  if (manual && manual.alias && typeof manual.alias === 'object') {
    for (const [targetLabel, list] of Object.entries(manual.alias)) {
      const row = rowMap.get(normKey(targetLabel));
      if (!row || !Array.isArray(list)) continue;
      const removals = new Set();
      const additions = new Set();
      for (const item of list) {
        if (typeof item !== 'string') continue;
        const t = item.trim();
        if (!t) continue;
        if (t.startsWith('!')) {
          removals.add(normKey(t.slice(1)));
        } else {
          additions.add(normKey(t));
          row.aliases.push(t);
        }
      }
      if (removals.size > 0) {
        row.aliases = row.aliases.filter((al) => !removals.has(normKey(al)));
      }
      approvedByRow.set(row, additions);
    }
  }

  // 5. year
  if (manual && manual.year && typeof manual.year === 'object') {
    for (const [targetLabel, entry] of Object.entries(manual.year)) {
      const row = rowMap.get(normKey(targetLabel));
      if (!row || !entry) continue;
      if (!entry.src && !entry.note) {
        warnings.push(poolId + ': manual year "' + targetLabel + '" icin src/note eksik.');
      }
      const res = mergeYears(row.year, row.approx, {
        year: entry.year,
        approx: entry.approx,
        note: entry.note,
        src: entry.src,
        verifiedBy: entry.verifiedBy || manual.verifiedBy
      });
      if (res.conflict) {
        yearConflicts.push({
          pool: poolId,
          label: row.label,
          rawYear: res.conflict.rawYear,
          otherYear: res.conflict.manualYear,
          note: res.conflict.note || 'manual.year'
        });
      }
      row.year = res.year;
      row.approx = res.approx;
      if (res.approx) row.f |= 1;
      else row.f &= ~1;
      if (res.verified) row.f |= 4;
    }
  }

  if (manual && manual.verifiedBy) {
    for (const row of afterDrop) {
      if (row.year !== null) row.f |= 4;
    }
  }

  // 6. Alias suzgeci (PLAN §4.6)
  const otherLabelsSet = new Set();
  for (const row of afterDrop) {
    otherLabelsSet.add(normKey(row.label));
  }

  const aliasReviews = [];
  for (const row of afterDrop) {
    const approvedSet = approvedByRow.get(row) || null;
    const { accepted, suspicious } = filterAliases(row.label, row.aliases, otherLabelsSet, { approvedSet });
    row.aliases = accepted;
    if (suspicious.length > 0) {
      row.f |= 8;
      for (const s of suspicious) {
        aliasReviews.push({
          pool: poolId,
          label: row.label,
          alias: s.alias,
          reason: s.reason
        });
      }
    }
    if (row.approx) row.f |= 1;
  }

  // 7. Cakisan normalize anahtarlar
  const keyOwners = new Map();
  const collisions = [];
  for (let i = 0; i < afterDrop.length; i++) {
    const row = afterDrop[i];
    const keys = [normKey(row.label), ...row.aliases.map(normKey)].filter(Boolean);
    for (const k of keys) {
      if (!keyOwners.has(k)) {
        keyOwners.set(k, [row.label]);
      } else {
        const owners = keyOwners.get(k);
        if (!owners.includes(row.label)) {
          owners.push(row.label);
          collisions.push({ key: k, labels: owners.slice() });
        }
      }
    }
  }

  // 8. Kapali kumede expect kontrolu
  let missingInfo = null;
  if (closed && expect !== null && afterDrop.length !== expect) {
    missingInfo = {
      pool: poolId,
      expect,
      actual: afterDrop.length,
      diff: afterDrop.length - expect
    };
  }

  const merged = {
    pool: poolId,
    asOf: '2026-11',
    mode,
    closed,
    expect,
    yearKind,
    sources,
    license: inferLicenses(sources),
    stats: {
      rawRows: (raw.rows || []).length,
      mergedRows: afterDrop.length,
      curatedCount: afterDrop.filter((r) => (r.f & 2) !== 0).length,
      suspiciousAliasCount: aliasReviews.length,
      collisionCount: collisions.length
    },
    collisions,
    rows: afterDrop
  };

  return { merged, aliasReviews, yearConflicts, missingInfo, warnings };
}

function main() {
  const args = parseArgs(process.argv);
  fs.mkdirSync(args.outDir, { recursive: true });

  const { list: contractList, map: contracts } = loadPoolsContract();
  const isDefaultIn = args.inDir === path.join(__dirname, 'out');

  const targets = [];
  const pendingPools = [];

  if (isDefaultIn && contractList.length > 0) {
    for (const c of contractList) {
      if (c.id === 'universite') continue;
      if (args.only && args.only !== c.id) continue;
      const rawPath = path.join(args.inDir, 'raw_' + c.id + '.json');
      const hasRaw = fs.existsSync(rawPath);
      const manual = loadManual(args.manualDir, c.id);
      if (!hasRaw && !manual) {
        pendingPools.push(c.id);
        continue;
      }
      targets.push({ poolId: c.id, rawPath: hasRaw ? rawPath : null, contract: c, manual });
    }
  } else {
    const files = fs.readdirSync(args.inDir).filter((f) => /^raw_.+\.json$/i.test(f));
    const seen = new Set();
    for (const file of files) {
      const poolId = file.replace(/^raw_/i, '').replace(/\.json$/i, '');
      if (poolId === 'universite') continue;
      if (args.only && args.only !== poolId) continue;
      seen.add(poolId);
      targets.push({
        poolId,
        rawPath: path.join(args.inDir, file),
        contract: contracts[poolId] || null,
        manual: loadManual(args.manualDir, poolId)
      });
    }
    if (fs.existsSync(args.manualDir)) {
      for (const mf of fs.readdirSync(args.manualDir).filter((f) => /\.js$/i.test(f))) {
        const poolId = mf.replace(/\.js$/i, '');
        if (poolId === 'universite' || seen.has(poolId)) continue;
        if (args.only && args.only !== poolId) continue;
        targets.push({
          poolId,
          rawPath: null,
          contract: contracts[poolId] || null,
          manual: loadManual(args.manualDir, poolId)
        });
      }
    }
  }

  const allAliasReviews = [];
  const allYearConflicts = [];
  const allMissing = [];
  const allWarnings = [];
  let processed = 0;

  for (const t of targets) {
    const { poolId, rawPath, contract, manual } = t;
    const raw = rawPath
      ? JSON.parse(fs.readFileSync(rawPath, 'utf8'))
      : {
          pool: poolId,
          mode: (contract && contract.mode) || 'a',
          expect: contract ? contract.expect : null,
          yearKind: (contract && contract.yearKind) || null,
          source: ['manual'],
          rows: []
        };

    const res = mergePool(poolId, raw, contract, manual);
    fs.writeFileSync(
      path.join(args.outDir, 'merged_' + poolId + '.json'),
      JSON.stringify(res.merged, null, 2) + '\n',
      'utf8'
    );

    allAliasReviews.push(...res.aliasReviews);
    allYearConflicts.push(...res.yearConflicts);
    if (res.missingInfo) allMissing.push(res.missingInfo);
    allWarnings.push(...res.warnings);
    processed++;
  }

  // ALIAS_REVIEW.md
  const aliasLines = ['# Şüpheli Alias İncelemesi (ALIAS_REVIEW)', ''];
  if (allAliasReviews.length === 0) {
    aliasLines.push('Şüpheli alias bulunamadı.');
  } else {
    aliasLines.push('| Havuz | Etiket | Şüpheli Alias | Neden |');
    aliasLines.push('|---|---|---|---|');
    for (const a of allAliasReviews) {
      aliasLines.push(`| ${a.pool} | ${a.label} | ${a.alias} | ${a.reason} |`);
    }
  }
  fs.writeFileSync(path.join(args.outDir, 'ALIAS_REVIEW.md'), aliasLines.join('\n') + '\n', 'utf8');

  // YEAR_CONFLICTS.md
  const yearLines = ['# Yıl Çelişkileri (YEAR_CONFLICTS)', ''];
  if (allYearConflicts.length === 0) {
    yearLines.push('Yıl çelişkisi bulunamadı.');
  } else {
    yearLines.push('| Havuz | Etiket | Ham Yıl | Diğer / Manual Yıl | Not |');
    yearLines.push('|---|---|---|---|---|');
    for (const y of allYearConflicts) {
      yearLines.push(`| ${y.pool} | ${y.label} | ${formatYear(y.rawYear)} | ${formatYear(y.otherYear)} | ${y.note} |`);
    }
  }
  fs.writeFileSync(path.join(args.outDir, 'YEAR_CONFLICTS.md'), yearLines.join('\n') + '\n', 'utf8');

  // MISSING.md
  const missLines = ['# Kapalı Küme Eksik / Fazla Raporu (MISSING)', ''];
  if (allMissing.length === 0) {
    missLines.push('Tüm kapalı kümeler beklenen sayıyla eşleşiyor (veya kapalı küme işlenmedi).');
  } else {
    missLines.push('| Havuz | Beklenen | Mevcut | Fark |');
    missLines.push('|---|---|---|---|');
    for (const m of allMissing) {
      const sign = m.diff > 0 ? '+' + m.diff : String(m.diff);
      missLines.push(`| ${m.pool} | ${m.expect} | ${m.actual} | ${sign} |`);
    }
  }
  if (pendingPools.length > 0) {
    missLines.push('', '## Bekleyen Ham Havuzlar (raw_*.json yok)', '');
    missLines.push(pendingPools.map((p) => '- `' + p + '`').join('\n'));
  }
  fs.writeFileSync(path.join(args.outDir, 'MISSING.md'), missLines.join('\n') + '\n', 'utf8');

  console.log(`50_merge: ${processed} havuz birlestirildi (bekleyen: ${pendingPools.length}). Supheli alias: ${allAliasReviews.length}, Yil celiskisi: ${allYearConflicts.length}, Kapali fark: ${allMissing.length}`);
  for (const w of allWarnings) console.warn('UYARI:', w);
}

main();
