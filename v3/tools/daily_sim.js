'use strict';

var path = require('path');
var config = require(path.join(__dirname, '..', 'config.js'));
var store = require(path.join(__dirname, '..', 'store.js'));
var daily = require(path.join(__dirname, '..', 'daily.js'));

function makeFixture(tCount, pCount, bCount) {
  var list = [];
  var idx = 1;
  var pad = function (n) { return String(n).padStart(3, '0'); };
  for (var i = 0; i < tCount; i++) {
    list.push({ id: 'q' + pad(idx++), axis: 'T', subject: 'T-' + i });
  }
  for (var j = 0; j < pCount; j++) {
    list.push({ id: 'q' + pad(idx++), axis: 'P', subject: 'P-' + j });
  }
  for (var k = 0; k < bCount; k++) {
    list.push({ id: 'q' + pad(idx++), axis: 'B', subject: 'B-' + k });
  }
  return list;
}

function runScenario(name, tCount, pCount, bCount, expectedCycleDays) {
  var fixture = makeFixture(tCount, pCount, bCount);
  var total = fixture.length;
  var cycleDays = daily.computeCycleDays(total);
  var errors = [];

  if (cycleDays !== expectedCycleDays) {
    errors.push('cycleDays=' + cycleDays + ', beklenen=' + expectedCycleDays);
  }

  // 2 tam döngü simüle et (döngü içi tekrarsızlık + döngü sınırı)
  var simDays = Math.max(cycleDays * 2, 4);
  var cycle0Ids = {};
  var cycle0Last3 = {};
  var cycle1First3 = {};

  for (var d = 0; d < simDays; d++) {
    var dayKey = daily.epochDayToDayKey(d);
    var res = daily.getDailySet(dayKey, fixture);
    var legs = ['yaygin', 'nadir', 'eski', 'yeni'];
    var daySeen = {};
    var dayCount = 0;

    for (var li = 0; li < legs.length; li++) {
      var leg = legs[li];
      var arr = res[leg] || [];
      if (arr.length !== 5) {
        errors.push('Gün ' + d + ' (' + leg + ') soru sayısı ' + arr.length + ' != 5');
      }
      for (var qi = 0; qi < arr.length; qi++) {
        var q = arr[qi];
        dayCount++;
        if (daySeen[q.id]) {
          errors.push('Gün ' + d + ' içinde aynı soru tekrar etti: ' + q.id);
        }
        daySeen[q.id] = true;

        // Uygunluk kontrolü
        var ax = daily.axisOf(q);
        if ((leg === 'eski' || leg === 'yeni') && ax === 'P') {
          errors.push('Gün ' + d + ' zaman bacağına P sorusu düştü: ' + q.id);
        }
        if ((leg === 'yaygin' || leg === 'nadir') && ax === 'T') {
          errors.push('Gün ' + d + ' pay bacağına T sorusu düştü: ' + q.id);
        }

        if (d < cycleDays) {
          if (cycle0Ids[q.id]) {
            errors.push('Döngü 0 içinde tekrar: ' + q.id + ' (gün ' + d + ')');
          }
          cycle0Ids[q.id] = true;
          if (d >= cycleDays - 3) cycle0Last3[q.id] = true;
        } else if (d >= cycleDays && d < cycleDays + 3) {
          cycle1First3[q.id] = true;
        }
      }
    }

    if (dayCount !== 20) {
      errors.push('Gün ' + d + ' toplam soru ' + dayCount + ' != 20');
    }
  }

  // Döngü sınırı kontrolü (W >= 6 için son 3 gün ile ilk 3 gün çakışmamalı)
  var boundaryOverlap = [];
  if (cycleDays >= 6) {
    Object.keys(cycle1First3).forEach(function (id) {
      if (cycle0Last3[id]) boundaryOverlap.push(id);
    });
    if (boundaryOverlap.length > 0) {
      errors.push('Döngü sınırı (son 3 gün ↔ ilk 3 gün) çakışması: ' + boundaryOverlap.join(','));
    }
  }

  var passed = errors.length === 0;
  console.log(
    (passed ? '[PASS] ' : '[FAIL] ') +
    name + ' | N=' + total +
    ' (T=' + tCount + ', P=' + pCount + ', B=' + bCount + ')' +
    ' | gün=' + cycleDays + ' (beklenen ' + expectedCycleDays + ')' +
    ' | döngü0 benzersiz=' + Object.keys(cycle0Ids).length +
    (cycleDays >= 6 ? ' | sınır çakışması=' + boundaryOverlap.length : ' | sınır: W<6 muaf')
  );
  if (!passed) {
    for (var ei = 0; ei < errors.length; ei++) {
      console.log('   HATA: ' + errors[ei]);
    }
  }
  return passed;
}

function runSanityChecks() {
  var ok = true;
  if (config.EPOCH !== '2026-12-01') {
    console.log('[FAIL] config.EPOCH != 2026-12-01 (' + config.EPOCH + ')');
    ok = false;
  }
  if (config.STORAGE_KEY !== 'pusulla.v3') {
    console.log('[FAIL] config.STORAGE_KEY != pusulla.v3');
    ok = false;
  }
  if (config.MODE_ORDER.length !== 9) {
    console.log('[FAIL] config.MODE_ORDER.length != 9');
    ok = false;
  }
  // store bellek içi yedek testi
  var s0 = store.reset();
  s0.stats.streak = 3;
  var wr = store.write(s0);
  var s1 = store.read();
  if (!wr.ok || s1.stats.streak !== 3) {
    console.log('[FAIL] store bellek içi yedek okuma/yazma başarısız');
    ok = false;
  }
  store.reset();
  if (ok) {
    console.log('[PASS] config + store temel kontrolleri (EPOCH=' + config.EPOCH + ', mod=' + config.MODE_ORDER.length + ')');
  }
  return ok;
}

var allPass = true;
allPass = runSanityChecks() && allPass;
allPass = runScenario('Senaryo 1 (Demo 42)',   12, 14,  16,  2) && allPass;
allPass = runScenario('Senaryo 2 (Orta 150)',  40, 50,  60,  7) && allPass;
allPass = runScenario('Senaryo 3 (Hedef 300)', 60, 80, 160, 15) && allPass;

console.log('SONUC: ' + (allPass ? 'TUMU GECTI' : 'BASARISIZ'));
process.exit(allPass ? 0 : 1);
