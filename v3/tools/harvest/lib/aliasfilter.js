'use strict';

const { fold } = require('./normalize');

const STRIP_PATTERNS = [
  /\s*\([^)]*\)\s*/g,
  /,\s*İstanbul$/i,
  /\s+ilçesi$/i,
  /\s+ili$/i,
  /\s+(Spor Kulübü|SK|JK|FK|A\.Ş\.)$/i
];

function cleanCandidate(raw) {
  let s = String(raw || '').trim();
  for (const re of STRIP_PATTERNS) {
    s = s.replace(re, ' ');
  }
  return s.replace(/\s+/g, ' ').trim();
}

function isSuspicious(raw, label, otherLabelsSet) {
  if (!raw || typeof raw !== 'string') return 'bos';
  const s = raw.trim();
  if (/^Q\d+$/i.test(s)) return 'qid';
  if (/,/.test(s)) return 'virgullu';
  if (/^\d/.test(s)) return 'rakam-ile-basliyor';
  const words = s.split(/\s+/).filter(Boolean);
  if (words.length >= 4) return 'cok-sozcuklu';
  if (s.length < 3) return 'cok-kisa';
  // Yalnız Latin/Türkçe alfabe, rakam ve temel noktalama kabul
  if (/[^\p{Script=Latin}\p{N}\s.'’\-&/+]/u.test(s)) return 'baska-yazi-sistemi';
  const f = fold(s);
  if (otherLabelsSet && otherLabelsSet.has(f) && f !== fold(label)) {
    return 'baska-etiketle-cakisiyor';
  }
  return null;
}

/**
 * Bir kayıt için alias listesini §4.6 kurallarına göre süzer.
 * ASCII katlanmış kopya yazılmaz (fold(alias) === fold(label) ise atılır).
 */
function filterAliases(label, rawAliases, otherLabelsSet, opts) {
  const options = opts || {};
  const approvedSet = options.approvedSet || null;
  const labelFold = fold(label);
  const seenFold = new Set([labelFold]);
  const accepted = [];
  const suspicious = [];

  for (const item of rawAliases || []) {
    if (!item || typeof item !== 'string') continue;
    const rawTrim = item.trim();
    if (!rawTrim) continue;

    const rawFold = fold(rawTrim);
    if (approvedSet && approvedSet.has(rawFold)) {
      if (rawFold && !seenFold.has(rawFold)) {
        seenFold.add(rawFold);
        accepted.push(rawTrim);
      }
      continue;
    }

    const suspRaw = isSuspicious(rawTrim, label, otherLabelsSet);
    const cleaned = cleanCandidate(rawTrim);
    if (!cleaned) continue;

    const cleanedFold = fold(cleaned);
    if (!cleanedFold || seenFold.has(cleanedFold)) continue;

    const suspClean = isSuspicious(cleaned, label, otherLabelsSet);
    if (suspClean) {
      suspicious.push({ alias: rawTrim, reason: suspClean });
      continue;
    }
    if (suspRaw && cleaned === rawTrim) {
      suspicious.push({ alias: rawTrim, reason: suspRaw });
      continue;
    }

    seenFold.add(cleanedFold);
    accepted.push(cleaned);
  }

  return { accepted, suspicious };
}

module.exports = { filterAliases, cleanCandidate, isSuspicious };
