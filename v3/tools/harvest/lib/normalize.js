'use strict';

/**
 * Türkçe metni normalize eder: NFC, tr-TR küçük harf, apostrof sonrası atma,
 * noktalama/tire temizliği, tek boşluk, trim.
 */
function normalize(s) {
  if (typeof s !== 'string') return '';
  let t = s.normalize('NFC').toLocaleLowerCase('tr-TR');
  t = t.replace(/['’].*$/, '');
  t = t.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

/**
 * Türkçe karakterleri ASCII'ye katlar (matcher ile aynı kural).
 */
function fold(s) {
  const n = normalize(s);
  return n
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/û/g, 'u');
}

module.exports = { normalize, fold };
