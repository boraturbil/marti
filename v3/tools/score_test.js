'use strict';

var assert = require('assert');
var engine = require('../engine.js');
var ilceFx = require('./fixtures/ilce_39.js');
var tarayiciFx = require('./fixtures/tarayici.js');
var openFx = require('./fixtures/open_5000.js');

var passed = 0;
var total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
  } catch (err) {
    console.error('BAŞARISIZ:', name, '-', err.message);
  }
}

// 1. eraOf testleri
test('eraOf sınır yılları ve null', function () {
  assert.strictEqual(engine.eraOf(-2000), 'antik');
  assert.strictEqual(engine.eraOf(499), 'antik');
  assert.strictEqual(engine.eraOf(500), 'ortacag');
  assert.strictEqual(engine.eraOf(1449), 'ortacag');
  assert.strictEqual(engine.eraOf(1450), 'erken_modern');
  assert.strictEqual(engine.eraOf(1800), 'sanayi');
  assert.strictEqual(engine.eraOf(1900), 'yy20_basi');
  assert.strictEqual(engine.eraOf(1950), 'elektronik');
  assert.strictEqual(engine.eraOf(1990), 'dijital');
  assert.strictEqual(engine.eraOf(2010), 'akilli');
  assert.strictEqual(engine.eraOf(null), 'simdi');
  assert.strictEqual(engine.eraOf(undefined), 'simdi');
});

// 2. axesOf testleri
test('axesOf kapalı küme ve açık küme', function () {
  var axIlce = engine.axesOf(ilceFx.question, ilceFx.pool);
  assert.strictEqual(axIlce.time, true);
  assert.strictEqual(axIlce.pop, true);
  assert.strictEqual(axIlce.axis, 'B');

  var axTarayici = engine.axesOf(tarayiciFx.question, tarayiciFx.pool);
  assert.strictEqual(axTarayici.time, true);
  assert.strictEqual(axTarayici.pop, true);
  assert.strictEqual(axTarayici.axis, 'B');

  var axOpen = engine.axesOf(openFx.question, openFx.pool);
  assert.strictEqual(axOpen.time, true);
  assert.strictEqual(axOpen.pop, true);
  assert.strictEqual(axOpen.axis, 'B');

  // Yıl oranı < %90 ise açık kümede zaman ekseni kapalı
  var qNoTime = Object.assign({}, tarayiciFx.question, { yearKind: null });
  var axNoTime = engine.axesOf(qNoTime, tarayiciFx.pool);
  assert.strictEqual(axNoTime.time, false);
  assert.strictEqual(axNoTime.pop, true);
  assert.strictEqual(axNoTime.axis, 'P');
});

// 3. Kapalı küme zaman puanlaması (eski/yeni + date eşitlik bozma)
test('Kapalı küme zaman: eski/yeni ve ters kutup', function () {
  var allEski = engine.scoreAllRows('eski', ilceFx.question, ilceFx.pool);
  var has100 = allEski.results.some(function (r) { return r.points === 100; });
  assert.strictEqual(has100, true, 'En az 1 satır 100 almalı');

  // Adalar (1923) en eski -> 100
  var adalarRes = engine.scoreAnswer({ modeId: 'eski', question: ilceFx.question, pool: ilceFx.pool, rowIndex: 0 });
  assert.strictEqual(adalarRes.points, 100);
  assert.strictEqual(adalarRes.tierId, 'tam');

  // 2008 ilçeleri (Arnavutköy, idx 1) en yeni -> eski modunda <= 30
  var arnRes = engine.scoreAnswer({ modeId: 'eski', question: ilceFx.question, pool: ilceFx.pool, rowIndex: 1 });
  assert.ok(arnRes.points <= 30, 'Ters kutup <= 30 olmalı, gelen: ' + arnRes.points);

  // Yeni modunda 2008 -> 100, Adalar (1923) -> <= 30
  var arnYeni = engine.scoreAnswer({ modeId: 'yeni', question: ilceFx.question, pool: ilceFx.pool, rowIndex: 1 });
  assert.strictEqual(arnYeni.points, 100);
  var adalarYeni = engine.scoreAnswer({ modeId: 'yeni', question: ilceFx.question, pool: ilceFx.pool, rowIndex: 0 });
  assert.ok(adalarYeni.points <= 30);
});

test('Kapalı küme zaman: aynı yıl eşitlik ve date (YYYY-MM) ayrımı', function () {
  var tiePool = {
    closed: true,
    yearKind: 'kurulus',
    cols: ['label', 'aliases', 'year', 'date', 'sl', 'f'],
    rows: [
      ['A', [], 2000, '2000-02', 10, 0],
      ['B', [], 2000, '2000-10', 10, 0],
      ['C', [], 2005, null, 10, 0],
      ['D', [], 2005, null, 10, 0]
    ]
  };
  var q = { closed: true, yearKind: 'kurulus' };
  var rA = engine.scoreAnswer({ modeId: 'eski', question: q, pool: tiePool, rowIndex: 0 });
  var rB = engine.scoreAnswer({ modeId: 'eski', question: q, pool: tiePool, rowIndex: 1 });
  assert.strictEqual(rA.player.rankT, 1);
  assert.strictEqual(rB.player.rankT, 2);
  var rC = engine.scoreAnswer({ modeId: 'eski', question: q, pool: tiePool, rowIndex: 2 });
  var rD = engine.scoreAnswer({ modeId: 'eski', question: q, pool: tiePool, rowIndex: 3 });
  assert.strictEqual(rC.player.rankT, rD.player.rankT, 'Aynı yıl ve datesiz eşit sıra almalı');
});

// 4. Açık küme zaman puanlaması + yılsız satır
test('Açık küme zaman puanlaması ve yılsız satır 10 puan', function () {
  // WorldWideWeb (1990) -> eski modunda 100
  var www = engine.scoreAnswer({ modeId: 'eski', question: tarayiciFx.question, pool: tarayiciFx.pool, rowIndex: 0 });
  assert.strictEqual(www.points, 100);

  // Vivaldi / Brave (2016) -> yeni modunda 100, eski modunda <= 30
  var braveYeni = engine.scoreAnswer({ modeId: 'yeni', question: tarayiciFx.question, pool: tarayiciFx.pool, rowIndex: 14 });
  assert.strictEqual(braveYeni.points, 100);
  var braveEski = engine.scoreAnswer({ modeId: 'eski', question: tarayiciFx.question, pool: tarayiciFx.pool, rowIndex: 14 });
  assert.ok(braveEski.points <= 30);

  // Yılsız satır açık havuzda 10 puan + noYear: true
  var noYearIdx = -1;
  for (var i = 0; i < openFx.pool.rows.length; i++) {
    if (openFx.pool.rows[i][2] === null) {
      noYearIdx = i;
      break;
    }
  }
  assert.ok(noYearIdx >= 0);
  var nyRes = engine.scoreAnswer({ modeId: 'eski', question: openFx.question, pool: openFx.pool, rowIndex: noYearIdx });
  assert.strictEqual(nyRes.points, 10);
  assert.strictEqual(nyRes.noYear, true);
});

// 5. YAYGIN & NADİR puanlaması (KARAR 9 dahil)
test('YAYGIN ve NADİR (pay listesi dışı = 100 TAM PUAN)', function () {
  // Tarayıcı: Chrome (30.0) yaygın 100, nadir 10
  var chromeIdx = 11;
  var chYaygin = engine.scoreAnswer({ modeId: 'yaygin', question: tarayiciFx.question, pool: tarayiciFx.pool, rowIndex: chromeIdx });
  assert.strictEqual(chYaygin.points, 100);
  var chNadir = engine.scoreAnswer({ modeId: 'nadir', question: tarayiciFx.question, pool: tarayiciFx.pool, rowIndex: chromeIdx });
  assert.strictEqual(chNadir.points, 10);

  // WorldWideWeb (idx 0) pay listesinde YOK -> YAYGIN'da 10, NADİR'de 100 (KARAR 9!)
  var wwwYaygin = engine.scoreAnswer({ modeId: 'yaygin', question: tarayiciFx.question, pool: tarayiciFx.pool, rowIndex: 0 });
  assert.strictEqual(wwwYaygin.points, 10);
  var wwwNadir = engine.scoreAnswer({ modeId: 'nadir', question: tarayiciFx.question, pool: tarayiciFx.pool, rowIndex: 0 });
  assert.strictEqual(wwwNadir.points, 100);
  assert.strictEqual(wwwNadir.tierId, 'tam');

  // İlçeler: Çatalca (0.3 <= 0.5) -> nadir 100
  var catalcaIdx = 14;
  var catNadir = engine.scoreAnswer({ modeId: 'nadir', question: ilceFx.question, pool: ilceFx.pool, rowIndex: catalcaIdx });
  assert.strictEqual(catNadir.points, 100);
});

// 6. Karma modlar (klasik, gundem, antika, kesif)
test('Karma modlarda her alt mod için >=1 satır 100 ve Dmin tutarlılığı', function () {
  var karmaModes = ['klasik', 'gundem', 'antika', 'kesif'];
  for (var m = 0; m < karmaModes.length; m++) {
    var modeId = karmaModes[m];
    var all = engine.scoreAllRows(modeId, tarayiciFx.question, tarayiciFx.pool);
    var count100 = all.results.filter(function (r) { return r.points === 100; }).length;
    var hasLow = all.results.some(function (r) { return r.points <= 30; });
    assert.ok(count100 >= 1, modeId + ' için en az 1 satır 100 almalı');
    assert.strictEqual(hasLow, true, modeId + ' için düşük puanlı satır olmalı');
  }
});

// 6b. Karma yuzdelik puan: en iyi 100, en kotu 0, arasi dogrusal tam sayi
test('Karma yüzdelik puan: min 100, max 0, tam sayı, D ile azalan', function () {
  var karmaModes = ['klasik', 'gundem', 'antika', 'kesif'];
  var fxs = [tarayiciFx, ilceFx];
  for (var f = 0; f < fxs.length; f++) {
    for (var m = 0; m < karmaModes.length; m++) {
      var all = engine.scoreAllRows(karmaModes[m], fxs[f].question, fxs[f].pool, true);
      var pts = all.results.map(function (r) { return r.points; });
      assert.ok(pts.every(function (p) { return Number.isInteger(p) && p >= 0 && p <= 100; }), 'tam sayı 0-100');
      assert.strictEqual(Math.max.apply(null, pts), 100);
      assert.strictEqual(Math.min.apply(null, pts), 0);
      var distinct = {};
      pts.forEach(function (p) { distinct[p] = 1; });
      assert.ok(Object.keys(distinct).length > 5, 'sürekli dağılım');
      for (var i = 0; i < all.results.length; i++) {
        for (var j = 0; j < all.results.length; j++) {
          if (all.results[i].D < all.results[j].D) assert.ok(all.results[i].points >= all.results[j].points);
        }
      }
    }
  }
  var one = engine.scoreAnswer({ modeId: 'klasik', question: tarayiciFx.question, pool: tarayiciFx.pool, rowIndex: 3, percent: true });
  assert.ok(Number.isInteger(one.points));
  var old = engine.scoreAllRows('klasik', tarayiciFx.question, tarayiciFx.pool);
  assert.ok(old.results.every(function (r) { return [100, 70, 50, 30, 10].indexOf(r.points) >= 0; }));
});

// 7. PAS ve SÜRE DOLDU
test('PAS ve SÜRE DOLDU 0 puan', function () {
  var pas = engine.scoreAnswer({ modeId: 'pas', pass: true });
  assert.strictEqual(pas.points, 0);
  assert.strictEqual(pas.tierId, 'pas');

  var sure = engine.scoreAnswer({ modeId: 'sure', timeout: true });
  assert.strictEqual(sure.points, 0);
  assert.strictEqual(sure.tierId, 'sure');
});

console.log('score_test.js: ' + passed + '/' + total + ' test geçti.');
if (passed !== total) {
  process.exit(1);
}
