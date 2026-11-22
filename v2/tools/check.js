#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT_DIR = path.resolve(__dirname, '..');
var PARTIAL = process.argv.indexOf('--partial') !== -1;

var errors = [];
var warnings = [];

function addError(msg) {
  errors.push(msg);
}

function addWarning(msg) {
  warnings.push(msg);
}

// 1. index.html'den script sırasını oku ve config.js, data/*.js, matcher.js'i yükle
var indexPath = path.join(ROOT_DIR, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('HATA: index.html bulunamadı:', indexPath);
  process.exit(1);
}

var html = fs.readFileSync(indexPath, 'utf8');
var scriptRe = /<script\s+src="([^"]+)"/g;
var match;
var scripts = [];
while ((match = scriptRe.exec(html)) !== null) {
  scripts.push(match[1]);
}

var loadable = scripts.filter(function (s) {
  return s === 'config.js' || s === 'matcher.js' || /^data\/.*\.js$/.test(s);
});

if (loadable.length === 0) {
  console.error('HATA: index.html içinde yüklenecek script bulunamadı.');
  process.exit(1);
}

for (var si = 0; si < loadable.length; si++) {
  var rel = loadable[si];
  var full = path.join(ROOT_DIR, rel);
  if (!fs.existsSync(full)) {
    addError('Eksik script dosyası: ' + rel);
    continue;
  }
  require(full);
}

var questions = globalThis.QUESTIONS || [];
var Matcher = globalThis.Matcher;
var PUSULLA_CONFIG = globalThis.PUSULLA_CONFIG;
var PUSULLA_DAILY = globalThis.PUSULLA_DAILY;

if (!Matcher || typeof Matcher.buildKeys !== 'function') {
  addError('Matcher.buildKeys dışa açılmamış.');
}
if (!PUSULLA_CONFIG || !PUSULLA_DAILY || typeof PUSULLA_DAILY.getDailySet !== 'function') {
  addError('PUSULLA_CONFIG veya PUSULLA_DAILY.getDailySet bulunamadı.');
}

// 2. Soru ve veri kontrolleri
var seenIds = Object.create(null);
var totalGroups = 0;
var totalAliases = 0;
var totalTests = 0;
var hasNoneTest = false;

for (var qi = 0; qi < questions.length; qi++) {
  var q = questions[qi];
  var qid = q && q.id ? String(q.id) : ('#' + qi);

  if (!q.id || typeof q.id !== 'string') {
    addError(qid + ': geçersiz id');
  } else if (seenIds[q.id]) {
    addError(qid + ': yinelenen soru id');
  } else {
    seenIds[q.id] = true;
  }

  if (!q.text || typeof q.text !== 'string') {
    addError(qid + ': soru metni eksik');
  }

  var answers = q.answers || [];
  totalGroups += answers.length;

  if (answers.length < 15 || answers.length > 20) {
    addError(qid + ': grup sayısı ' + answers.length + ' (15-20 olmalı)');
  }

  var shareSum = 0;
  var tailCount = 0;
  var midCount = 0;
  var seenLabels = Object.create(null);

  for (var ai = 0; ai < answers.length; ai++) {
    var ans = answers[ai];
    if (!ans.label || typeof ans.label !== 'string') {
      addError(qid + ' [' + ai + ']: etiket eksik');
    } else {
      if (ans.label.length > 26) {
        addError(qid + ' ("' + ans.label + '"): etiket > 26 karakter (' + ans.label.length + ')');
      }
      var normLbl = Matcher.normalizeTR(ans.label);
      if (seenLabels[normLbl]) {
        addError(qid + ': yinelenen etiket "' + ans.label + '"');
      }
      seenLabels[normLbl] = true;
    }

    if (typeof ans.share !== 'number' || isNaN(ans.share) || ans.share <= 0) {
      addError(qid + ' ("' + ans.label + '"): geçersiz share');
    } else {
      shareSum += ans.share;
      if (ans.share >= 0.1 && ans.share <= 1.0) tailCount++;
      if (ans.share >= 1.0 && ans.share <= 5.0) midCount++;
      if (ai > 0) {
        var diff = Math.round((answers[ai - 1].share - ans.share) * 1000) / 1000;
        if (diff < 0.2) {
          addError(qid + ': pay kesin azalan (>=0.2 fark) değil: "' + answers[ai - 1].label + '" (' + answers[ai - 1].share + ') -> "' + ans.label + '" (' + ans.share + ')');
        }
      }
    }

    var aliases = ans.aliases || [];
    totalAliases += aliases.length;
    if (aliases.length < 6 || aliases.length > 40) {
      addError(qid + ' ("' + ans.label + '"): alias sayısı ' + aliases.length + ' (6-40 olmalı)');
    }
    for (var li = 0; li < aliases.length; li++) {
      var al = String(aliases[li] || '').trim();
      if (al.length < 3) {
        addError(qid + ' ("' + ans.label + '"): 3 harften kısa alias "' + al + '"');
      }
    }
  }

  shareSum = Math.round(shareSum * 1000) / 1000;
  if (shareSum < 99.0 || shareSum > 101.0) {
    addError(qid + ': toplam pay ' + shareSum + ' (99.0-101.0 olmalı)');
  }
  if (tailCount < 4) {
    addError(qid + ': %0.1-%1.0 aralığında grup sayısı ' + tailCount + ' (>=4 olmalı)');
  }
  if (midCount < 3) {
    addError(qid + ': %1.0-%5.0 aralığında grup sayısı ' + midCount + ' (>=3 olmalı)');
  }

  var invs = q.invalid || [];
  if (invs.length < 6 || invs.length > 10) {
    addError(qid + ': invalid sayısı ' + invs.length + ' (6-10 olmalı)');
  }
  for (var ii = 0; ii < invs.length; ii++) {
    var inv = invs[ii];
    if (!inv.reason || typeof inv.reason !== 'string' || !inv.reason.trim()) {
      addError(qid + ' invalid[' + ii + ']: reason eksik');
    } else {
      if (inv.reason.length > 90) {
        addError(qid + ' invalid[' + ii + ']: reason > 90 karakter (' + inv.reason.length + ')');
      }
      if (/yanl[ıi][sş]/i.test(inv.reason)) {
        addError(qid + ' invalid[' + ii + ']: reason içinde "yanlış" kelimesi yasak');
      }
    }
    if (!inv.aliases || inv.aliases.length === 0) {
      addError(qid + ' invalid[' + ii + ']: aliases boş');
    }
  }

  var tests = q.tests || [];
  totalTests += tests.length;
  if (tests.length < 4) {
    addError(qid + ': tests sayısı ' + tests.length + ' (>=4 olmalı)');
  }
  for (var ti = 0; ti < tests.length; ti++) {
    if (tests[ti].expect === 'none') {
      hasNoneTest = true;
    }
  }

  // Alias çakışması kontrolü (Matcher.buildKeys)
  if (Matcher && typeof Matcher.buildKeys === 'function') {
    var keyOwner = Object.create(null);

    for (var gIdx = 0; gIdx < answers.length; gIdx++) {
      var g = answers[gIdx];
      var gOwner = 'grup:' + g.label;
      var gPhrases = [g.label].concat(g.aliases || []);
      var gSeen = Object.create(null);
      for (var gp = 0; gp < gPhrases.length; gp++) {
        var keys = Matcher.buildKeys(gPhrases[gp]);
        for (var kIdx = 0; kIdx < keys.length; kIdx++) {
          var key = keys[kIdx];
          if (gSeen[key]) continue;
          gSeen[key] = true;
          if (keyOwner[key] && keyOwner[key] !== gOwner) {
            addError(qid + ': alias çakışması "' + key + '" -> [' + keyOwner[key] + '] ve [' + gOwner + ']');
          } else {
            keyOwner[key] = gOwner;
          }
        }
      }
    }

    for (var iIdx = 0; iIdx < invs.length; iIdx++) {
      var invItem = invs[iIdx];
      var iOwner = 'invalid[' + iIdx + ']';
      var iPhrases = invItem.aliases || [];
      var iSeen = Object.create(null);
      for (var ip = 0; ip < iPhrases.length; ip++) {
        var iKeys = Matcher.buildKeys(iPhrases[ip]);
        for (var ikIdx = 0; ikIdx < iKeys.length; ikIdx++) {
          var iKey = iKeys[ikIdx];
          if (iSeen[iKey]) continue;
          iSeen[iKey] = true;
          if (keyOwner[iKey] && keyOwner[iKey] !== iOwner) {
            addError(qid + ': alias çakışması "' + iKey + '" -> [' + keyOwner[iKey] + '] ve [' + iOwner + ']');
          } else {
            keyOwner[iKey] = iOwner;
          }
        }
      }
    }
  }
}

if (!hasNoneTest && questions.length > 0) {
  addError('En az bir sorunun tests dizisinde expect:"none" olmalı.');
}

// 3. Toplam soru sayısı
if (questions.length < 35) {
  if (PARTIAL) {
    addWarning('Soru sayısı ' + questions.length + ' (<35; --partial nedeniyle uyarı).');
  } else {
    addError('Toplam soru sayısı ' + questions.length + ' (>=35 olmalı, beklenen 42).');
  }
}

// 4. runMatcherTests() + REVIZE_V2 madde 1 & 2 testleri
function execMatcherTests() {
  var origLog = console.log;
  var passed = 0;
  var total = 0;
  var res = false;
  console.log = function () {
    var msg = Array.prototype.slice.call(arguments).join(' ');
    var m = msg.match(/Matcher Testleri:\s*(\d+)\/(\d+)/);
    if (m) {
      passed = parseInt(m[1], 10);
      total = parseInt(m[2], 10);
    }
    origLog.apply(console, arguments);
  };
  try {
    res = globalThis.runMatcherTests();
  } finally {
    console.log = origLog;
  }
  return { ok: !!res, passed: passed, total: total };
}

var matcherStats = { ok: false, passed: 0, total: 0 };
if (typeof globalThis.runMatcherTests === 'function') {
  matcherStats = execMatcherTests();
  if (!matcherStats.ok || matcherStats.total === 0) {
    addError('runMatcherTests() başarısız oldu.');
  }
} else {
  addError('runMatcherTests() fonksiyonu bulunamadı.');
}

var nfcPassed = 0;
var nfcTotal = 0;
var invalidAliasPassed = 0;
var invalidAliasTotal = 0;
var nearInvalidPassed = 0;
var nearInvalidTotal = 0;

if (Matcher && typeof Matcher.matchAnswer === 'function' && questions.length > 0) {
  var q01 = questions.filter(function (q) { return q.id === 'q01'; })[0];
  if (q01) {
    var nfcCases = [
      { label: 'ÇAY’', input: 'ÇAY\u2019' },
      { label: '“çay”', input: '\u201Cçay\u201D' },
      { label: 'çay…', input: 'çay\u2026' },
      { label: 'çay (ZWSP)', input: 'ç\u200Bay' },
      { label: 'çay (NFD)', input: 'c\u0327ay' }
    ];
    for (var ni = 0; ni < nfcCases.length; ni++) {
      nfcTotal++;
      var nRes = Matcher.matchAnswer(nfcCases[ni].input, q01);
      if (nRes && nRes.type === 'valid' && nRes.answer && nRes.answer.label === 'Çay') {
        nfcPassed++;
      } else {
        addError('NFC/Tipografik test başarısız (' + nfcCases[ni].label + '): ' + JSON.stringify(nRes));
      }
    }
  }

  for (var qii = 0; qii < questions.length; qii++) {
    var qItem = questions[qii];
    var qInvs = qItem.invalid || [];
    for (var ii2 = 0; ii2 < qInvs.length; ii2++) {
      var invAliases = qInvs[ii2].aliases || [];
      for (var ia = 0; ia < invAliases.length; ia++) {
        invalidAliasTotal++;
        var mRes = Matcher.matchAnswer(invAliases[ia], qItem);
        if (mRes && mRes.type === 'invalid') {
          invalidAliasPassed++;
        } else {
          addError(qItem.id + ' invalid alias "' + invAliases[ia] + '" -> beklenen invalid, gelen: ' + (mRes ? mRes.type + (mRes.answer ? ':' + mRes.answer.label : '') : 'null'));
        }
      }
    }
  }

  // Açık 1-harf uzaklık testi: invalid alias, geçerli bir alias'a 1 harf uzaksa yine invalid dönmeli
  var q34 = questions.filter(function (q) { return q.id === 'q34'; })[0];
  if (q34) {
    nearInvalidTotal++;
    var nearRes = Matcher.matchAnswer('denizaltı', q34); // 'Denizatı' (valid) ile 1 harf uzak
    if (nearRes && nearRes.type === 'invalid') {
      nearInvalidPassed++;
    } else {
      addError('1-harf uzaklık invalid testi başarısız (q34 "denizaltı"): ' + JSON.stringify(nearRes));
    }
  }

  // Türkçe çekim / dolgu / içerik örtüşmesi / koruma testleri
  var qMap = Object.create(null);
  for (var qmi = 0; qmi < questions.length; qmi++) {
    qMap[questions[qmi].id] = questions[qmi];
  }
  var flexCases = [
    // Olumlu testler (14)
    { qId: 'q21', input: 'sular kesikti', expectType: 'valid', expectLabel: 'Elektrikler kesildi' },
    { qId: 'q21', input: 'su gitmisti', expectType: 'valid', expectLabel: 'Elektrikler kesildi' },
    { qId: 'q21', input: 'elektrikler kesikti', expectType: 'valid', expectLabel: 'Elektrikler kesildi' },
    { qId: 'q21', input: 'elektrik gitti', expectType: 'valid', expectLabel: 'Elektrikler kesildi' },
    { qId: 'q21', input: 'elektrikler kesildi mi', expectType: 'valid', expectLabel: 'Elektrikler kesildi' },
    { qId: 'q21', input: 'galiba sular kesilmiş', expectType: 'valid', expectLabel: 'Elektrikler kesildi' },
    { qId: 'q21', input: 'bence elektrik kesiyor', expectType: 'valid', expectLabel: 'Elektrikler kesildi' },
    { qId: 'q21', input: 'su kesintisi ya', expectType: 'valid', expectLabel: 'Elektrikler kesildi' },
    { qId: 'q21', input: 'sular kesilmişti', expectType: 'valid', expectLabel: 'Elektrikler kesildi' },
    { qId: 'q21', input: 'elektrikler gitmişti', expectType: 'valid', expectLabel: 'Elektrikler kesildi' },
    { qId: 'q21', input: 'otobüsler gelmedi', expectType: 'valid', expectLabel: 'Otobüsü kaçırdım' },
    { qId: 'q21', input: 'asansörde kaldım ya', expectType: 'valid', expectLabel: 'Asansörde kaldım' },
    { qId: 'q21', input: 'şarjım bitmiş', expectType: 'valid', expectLabel: 'Elektrikler kesildi' },
    { qId: 'q21', input: 'alarm çalmadı galiba', expectType: 'valid', expectLabel: 'Alarm çalmadı' },

    // Olumsuz / koruma testleri (10 + 20 yeni olumsuz + 3 karma valid/invalid koruma)
    { qId: 'q34', input: 'denizaltı', expectType: 'invalid' },
    { qId: 'q34', input: 'denizaltılar', expectType: 'invalid' },
    { qId: 'q34', input: 'bence denizaltı ya', expectType: 'invalid' },
    { qId: 'q33', input: 'karne almak', expectType: 'invalid' },
    { qId: 'q38', input: 'karne almak', expectType: 'invalid' },
    { qId: 'q38', input: 'karne aldık', expectType: 'not_valid' },
    { qId: 'q13', input: 'karne almak', expectType: 'invalid' },
    { qId: 'q21', input: 'su', expectType: 'none' },
    { qId: 'q21', input: 'rastgele bir şey ya', expectType: 'none' },
    { qId: 'q21', input: 'erken geldim galiba', expectType: 'invalid' },
    { qId: 'q36', input: 'çok güzel', expectType: 'not_valid' },
    { qId: 'q27', input: 'kesinlikle hayır', expectType: 'not_valid' },
    { qId: 'q09', input: 'su içmek', expectType: 'not_valid' },
    { qId: 'q40', input: 'su içtim', expectType: 'not_valid' },
    { qId: 'q21', input: 'su içmeye gittim', expectType: 'not_valid' },
    { qId: 'q21', input: 'elektrik faturası', expectType: 'not_valid' },
    { qId: 'q21', input: 'boğaz köprüsü', expectType: 'not_valid' },
    { qId: 'q20', input: 'trafik vardı', expectType: 'not_valid' },
    { qId: 'q26', input: 'adana kebap', expectType: 'not_valid' },
    { qId: 'q21', input: 'işe geç kaldım', expectType: 'not_valid' },
    { qId: 'q11', input: 'siyah beyaz film', expectType: 'not_valid' },
    { qId: 'q14', input: 'çay içmek', expectType: 'not_valid' },
    { qId: 'q28', input: 'Mimar Sinan', expectType: 'not_valid' },
    { qId: 'q03', input: 'Türk kahvesi', expectType: 'not_valid' },
    { qId: 'q13', input: 'geldi', expectType: 'not_valid' },
    { qId: 'q13', input: 'hoş geldin', expectType: 'not_valid' },
    { qId: 'q10', input: 'bitti', expectType: 'not_valid' },
    { qId: 'q22', input: 'Kuruyemiş', expectType: 'not_valid' },
    { qId: 'q41', input: 'ali ata bak', expectType: 'not_valid' },
    { qId: 'q39', input: 'halay çekmek', expectType: 'not_valid' },
    { qId: 'q22', input: 'kebap ayran', expectType: 'valid', expectLabel: 'Kebap' },
    { qId: 'q22', input: 'lahmacun ve ayran', expectType: 'valid', expectLabel: 'Lahmacun' },
    { qId: 'q01', input: 'simit ve kahve', expectType: 'valid', expectLabel: 'Simit' }
  ];
  for (var fi = 0; fi < flexCases.length; fi++) {
    var fc = flexCases[fi];
    var fq = qMap[fc.qId];
    if (!fq) {
      addError('Esneklik testi için soru bulunamadı: ' + fc.qId);
      continue;
    }
    nearInvalidTotal++;
    var fRes = Matcher.matchAnswer(fc.input, fq);
    var fOk = fc.expectType === 'not_valid'
      ? (fRes && fRes.type !== 'valid')
      : (fRes && fRes.type === fc.expectType && (!fc.expectLabel || (fRes.answer && fRes.answer.label === fc.expectLabel)));
    if (fOk) {
      nearInvalidPassed++;
    } else {
      addError('Esneklik/koruma testi başarısız (' + fc.qId + ' "' + fc.input + '"): beklenen ' + fc.expectType + (fc.expectLabel ? ':' + fc.expectLabel : '') + ', gelen: ' + JSON.stringify(fRes));
    }
  }
}

// 5. 30 günlük takvim kontrolü + 365 günlük yasak çift ardışıklık testi
var calendarOk = true;
if (PUSULLA_DAILY && PUSULLA_CONFIG && questions.length > 0) {
  var parts = String(PUSULLA_CONFIG.EPOCH).split('-');
  var baseUtc = Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  var k = Math.max(1, Math.floor(questions.length / 21));
  var cycleSeen = Object.create(null);
  var forbiddenPairs = [['q30', 'q32'], ['q03', 'q35']];

  for (var day = 0; day < 365; day++) {
    var d = new Date(baseUtc + day * 86400000);
    var yyyy = d.getUTCFullYear();
    var mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    var dd = String(d.getUTCDate()).padStart(2, '0');
    var dayKey = yyyy + '-' + mm + '-' + dd;

    var set = PUSULLA_DAILY.getDailySet(dayKey, questions);
    var dayIds = Object.create(null);
    var modes = ['zirve', 'dip', 'orta'];

    for (var mi = 0; mi < modes.length; mi++) {
      var mList = set[modes[mi]] || [];
      if (mList.length !== 7) {
        addError('Takvim ' + dayKey + ' ' + modes[mi] + ': 7 yerine ' + mList.length + ' soru.');
        calendarOk = false;
      }

      // 365 gün yasak çift ardışık değil kontrolü
      var modeIds = mList.map(function (x) { return x.id; });
      for (var fp = 0; fp < forbiddenPairs.length; fp++) {
        var ia2 = modeIds.indexOf(forbiddenPairs[fp][0]);
        var ib2 = modeIds.indexOf(forbiddenPairs[fp][1]);
        if (ia2 >= 0 && ib2 >= 0 && Math.abs(ia2 - ib2) === 1) {
          addError('Takvim ' + dayKey + ' ' + modes[mi] + ': yasak çift ardışık [' + forbiddenPairs[fp][0] + ',' + forbiddenPairs[fp][1] + ']');
          calendarOk = false;
        }
      }

      if (day < 30) {
        var modeSeen = Object.create(null);
        for (var qi2 = 0; qi2 < mList.length; qi2++) {
          var qObj = mList[qi2];
          var qId2 = qObj.id;
          if (questions.length >= 21) {
            if (modeSeen[qId2]) {
              addError('Takvim ' + dayKey + ' ' + modes[mi] + ': aynı modda tekrar ' + qId2);
              calendarOk = false;
            }
            modeSeen[qId2] = true;

            if (dayIds[qId2]) {
              addError('Takvim ' + dayKey + ': modlar arası kesişim ' + qId2);
              calendarOk = false;
            }
            dayIds[qId2] = true;

            var cyc = Math.floor(set.epochDay / k);
            if (!cycleSeen[cyc]) cycleSeen[cyc] = Object.create(null);
            if (cycleSeen[cyc][qId2] && cycleSeen[cyc][qId2] !== dayKey) {
              addError('Takvim döngü ' + cyc + ': ' + qId2 + ' tekrarlandı (' + cycleSeen[cyc][qId2] + ' ve ' + dayKey + ')');
              calendarOk = false;
            }
            cycleSeen[cyc][qId2] = dayKey;
          }
        }
      }
    }
  }
  if (questions.length < 21 && PARTIAL) {
    addWarning('Soru sayısı < 21 olduğu için takvim tekrarsızlık kontrolü --partial modunda atlandı.');
  }
}

// 6. Raporlama
if (warnings.length > 0) {
  for (var wi = 0; wi < warnings.length; wi++) {
    console.warn('UYARI:', warnings[wi]);
  }
}

if (errors.length > 0) {
  console.error('\n--- DOĞRULAMA HATALARI (' + errors.length + ') ---');
  for (var ei = 0; ei < errors.length; ei++) {
    console.error('[' + (ei + 1) + '] ' + errors[ei]);
  }
}

var avgGroups = questions.length ? (totalGroups / questions.length).toFixed(1).replace('.', ',') : '0';
var totalAliasFmt = totalAliases.toLocaleString('tr-TR');
var totalCaseCount = matcherStats.total + invalidAliasTotal + nfcTotal + nearInvalidTotal;
var totalPassedCount = matcherStats.passed + invalidAliasPassed + nfcPassed + nearInvalidPassed;
var testStr = (matcherStats.ok && totalPassedCount === totalCaseCount) ? (totalPassedCount + '/' + totalCaseCount) : 'HATA';
var calStr = calendarOk ? 'ok' : 'HATA';

console.log(
  'MATCHER ' + matcherStats.passed +
  ' | INVALID-ALIAS ' + invalidAliasPassed +
  ' | NFC ' + nfcPassed +
  ' | YAKIN-INVALID ' + nearInvalidPassed
);
console.log(
  'SORU ' + questions.length +
  ' | GRUP ort ' + avgGroups +
  ' | ALIAS toplam ' + totalAliasFmt +
  ' | TEST ' + testStr +
  ' | TAKVİM ' + calStr
);

if (errors.length > 0) {
  process.exit(1);
}
