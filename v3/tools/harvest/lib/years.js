'use strict';

/**
 * ISO/Wikidata tarih dizisinden tam sayı yıl çıkarır (M.Ö. negatif).
 */
function parseYear(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number' && Number.isFinite(val)) return Math.trunc(val);
  const s = String(val).trim();
  const m = s.match(/^([+-]?\d{1,6})(?:-\d{2}-\d{2})?/);
  if (!m) return null;
  const y = parseInt(m[1], 10);
  if (!Number.isFinite(y) || y < -5000 || y > 2100) return null;
  return y;
}

/**
 * Çoklu tarih adayından en erken yılı ve yaklaşık (approx) bayrağını döndürür.
 */
function pickMinYear(values) {
  const years = [];
  for (const v of values || []) {
    const y = parseYear(v);
    if (y !== null) years.push(y);
  }
  if (years.length === 0) return { year: null, approx: false };
  const minY = Math.min(...years);
  const maxY = Math.max(...years);
  return { year: minY, approx: (maxY - minY) > 1 };
}

function isValidYear(y, maxYear) {
  const maxY = typeof maxYear === 'number' ? maxYear : 2026;
  return typeof y === 'number' && Number.isInteger(y) && y >= -5000 && y <= maxY;
}

function mergeYears(rawYear, rawApprox, manualEntry) {
  const hasRaw = typeof rawYear === 'number' && Number.isFinite(rawYear);
  const rYear = hasRaw ? Math.trunc(rawYear) : null;
  const rApprox = Boolean(rawApprox);

  if (!manualEntry || typeof manualEntry.year !== 'number' || !Number.isFinite(manualEntry.year)) {
    return {
      year: rYear,
      approx: rApprox,
      conflict: null,
      verified: Boolean(manualEntry && manualEntry.verifiedBy)
    };
  }

  const mYear = Math.trunc(manualEntry.year);
  const mApprox = manualEntry.approx !== undefined ? Boolean(manualEntry.approx) : rApprox;
  const conflict = (rYear !== null && rYear !== mYear)
    ? { rawYear: rYear, manualYear: mYear, note: manualEntry.note || manualEntry.src || '' }
    : null;

  return {
    year: mYear,
    approx: mApprox,
    conflict,
    verified: true
  };
}

function formatYear(y) {
  if (typeof y !== 'number' || !Number.isFinite(y)) return '—';
  return y < 0 ? ('M.Ö. ' + Math.abs(y)) : String(y);
}

module.exports = { parseYear, pickMinYear, isValidYear, mergeYears, formatYear };
