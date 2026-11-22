'use strict';

var assert = require('assert');
var matcher = require('../matcher.js');
var ilceFx = require('./fixtures/ilce_39.js');
var tarayiciFx = require('./fixtures/tarayici.js');

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

var idxIlce = matcher.createIndex(ilceFx.pool, ilceFx.question);
var idxTarayici = matcher.createIndex(tarayiciFx.pool, tarayiciFx.question);

// 1. 39 İstanbul ilçesinin tamamı kendi satırına eşleşmeli
test('39 İstanbul ilçesi tam eşleşme', function () {
  assert.strictEqual(ilceFx.pool.rows.length, 39);
  for (var i = 0; i < ilceFx.pool.rows.length; i++) {
    var label = ilceFx.pool.rows[i][0];
    var res = matcher.matchAnswer(label, idxIlce);
    assert.strictEqual(res.status, 'eslesti', label + ' eşleşmeli');
    assert.strictEqual(res.type, 'valid');
    assert.strictEqual(res.label, label);
  }
});

// 2. ASCII katlama ve büyük/küçük harf (İ/ı dahil)
test('ASCII katlama ve Türkçe İ/ı', function () {
  var cases = [
    ['uskudar', 'Üsküdar'],
    ['ÜSKÜDAR', 'Üsküdar'],
    ['sile', 'Şile'],
    ['catalca', 'Çatalca'],
    ['kagithane', 'Kağıthane'],
    ['kucukcekmece', 'Küçükçekmece'],
    ['BESIKTAS', 'Beşiktaş']
  ];
  for (var i = 0; i < cases.length; i++) {
    var res = matcher.matchAnswer(cases[i][0], idxIlce);
    assert.strictEqual(res.status, 'eslesti', cases[i][0]);
    assert.strictEqual(res.label, cases[i][1]);
  }
});

// 3. Apostrof temizliği ve Türkçe ek soyma
test('Apostrof temizliği ve ek soyma', function () {
  var r1 = matcher.matchAnswer("Kadıköy'e", idxIlce);
  assert.strictEqual(r1.status, 'eslesti');
  assert.strictEqual(r1.label, 'Kadıköy');

  var r2 = matcher.matchAnswer('Beşiktaş’ta', idxIlce);
  assert.strictEqual(r2.status, 'eslesti');
  assert.strictEqual(r2.label, 'Beşiktaş');

  var r3 = matcher.matchAnswer('uskudardan', idxIlce);
  assert.strictEqual(r3.status, 'eslesti');
  assert.strictEqual(r3.label, 'Üsküdar');

  var r4 = matcher.matchAnswer('adalarimizda', idxIlce);
  assert.strictEqual(r4.status, 'eslesti');
  assert.strictEqual(r4.label, 'Adalar');
});

// 4. Ünsüz yumuşaması geri alma
test('Ünsüz yumuşaması geri alma (b->p, d->t, g->k)', function () {
  var softPool = {
    cols: ['label', 'aliases', 'year', 'src', 'sl', 'f'],
    rows: [
      ['Kitap', [], null, 'm', 10, 0],
      ['Köpek', [], null, 'm', 10, 0],
      ['Yoğurt', [], null, 'm', 10, 0]
    ]
  };
  var idxSoft = matcher.createIndex(softPool, {});
  assert.strictEqual(matcher.matchAnswer('kitabı', idxSoft).label, 'Kitap');
  assert.strictEqual(matcher.matchAnswer('köpeği', idxSoft).label, 'Köpek');
  assert.strictEqual(matcher.matchAnswer('yoğurdu', idxSoft).label, 'Yoğurt');
});

// 5. Tarayıcı fikstürü zorunlu kontroller ("chrome", "krom", "opera", "Mozilla")
test('Tarayıcı fikstürü: chrome, krom, opera, Mozilla', function () {
  var rChrome = matcher.matchAnswer('chrome', idxTarayici);
  assert.strictEqual(rChrome.status, 'eslesti');
  assert.strictEqual(rChrome.label, 'Chrome');

  var rKrom = matcher.matchAnswer('krom', idxTarayici);
  assert.strictEqual(rKrom.status, 'eslesti');
  assert.strictEqual(rKrom.label, 'Chrome');

  var rOpera = matcher.matchAnswer('opera', idxTarayici);
  assert.strictEqual(rOpera.status, 'eslesti');
  assert.strictEqual(rOpera.label, 'Opera');

  var rMozilla = matcher.matchAnswer('Mozilla', idxTarayici);
  assert.strictEqual(rMozilla.status, 'eslesti');
  assert.strictEqual(rMozilla.label, 'Mozilla Firefox');
});

// 6. Üç durumlu sonuç: bulanık eşleşme "onay_iste" döner (otomatik kabul YOK)
test('Bulanık eşleşme onay_iste döner, kısa adlarda bulanık yok', function () {
  var typo = matcher.matchAnswer('firefoks', idxTarayici);
  assert.strictEqual(typo.status, 'onay_iste');
  assert.strictEqual(typo.type, 'confirm');
  assert.strictEqual(typo.suggestion, 'Firefox');
  assert.strictEqual(typo.fuzzy, true);

  var typo2 = matcher.matchAnswer('kadioky', idxIlce);
  assert.strictEqual(typo2.status, 'onay_iste');
  assert.strictEqual(typo2.suggestion, 'Kadıköy');

  // Kısa ad (<=4): bulanık eşleşme olmamalı
  var shortTypo = matcher.matchAnswer('edg', idxTarayici);
  assert.strictEqual(shortTypo.status, 'yok');
});

// 7. Invalid ve genel kelimeler + yok
test('Invalid, genel kelimeler ve yok', function () {
  var inv = matcher.matchAnswer('taksim', idxIlce);
  assert.strictEqual(inv.status, 'gecersiz');
  assert.strictEqual(inv.type, 'invalid');

  var gen = matcher.matchAnswer('tarayıcı', idxTarayici);
  assert.strictEqual(gen.status, 'gecersiz');
  assert.strictEqual(gen.type, 'invalid');

  var none = matcher.matchAnswer('bilinmeyenbirsey', idxIlce);
  assert.strictEqual(none.status, 'yok');
  assert.strictEqual(none.type, 'none');
});

// 8. Eşsesli (homonym) seçimi
test('Eşsesli satırlarda tam label veya yüksek sl kazanır', function () {
  var homPool = {
    cols: ['label', 'aliases', 'year', 'src', 'sl', 'f'],
    rows: [
      ['Elma A', ['elma'], 1990, 'm', 10, 0],
      ['Elma B', ['elma'], 2000, 'm', 80, 0]
    ]
  };
  var idxHom = matcher.createIndex(homPool, {});
  var res = matcher.matchAnswer('elma', idxHom);
  assert.strictEqual(res.status, 'eslesti');
  assert.strictEqual(res.label, 'Elma B');
  assert.strictEqual(res.homonyms, 2);
});

// 9. Konu eki soyma: 6 ana bulgu örneği
test('Konu eki soyma: Mars gezegeni, Brezilya Milli Takımı, Ankara şehri, demir elementi, Domates Çorbası, Matrix filmi', function () {
  var idxGezegen = matcher.createIndex({
    rows: [['Mars', [], -2000, 'Q111', 200, 0], ['Plüton', [], 1930, 'Q339', 150, 0]]
  }, { pool: 'gezegen', subject: 'GEZEGEN', closed: true });
  assert.strictEqual(matcher.matchAnswer('Mars gezegeni', idxGezegen).label, 'Mars');

  var idxDk = matcher.createIndex({
    rows: [['Brezilya', ['Brazil'], 1958, 'Q83459', 120, 0]]
  }, { pool: 'dk_sampiyon', subject: 'DÜNYA KUPASI ŞAMPİYONU', closed: true });
  assert.strictEqual(matcher.matchAnswer('Brezilya Milli Takımı', idxDk).label, 'Brezilya');

  var idxBaskent = matcher.createIndex({
    rows: [['Ankara', [], 1923, 'Q3640', 180, 0]]
  }, { pool: 'baskent', subject: 'BAŞKENT', closed: true });
  assert.strictEqual(matcher.matchAnswer('Ankara şehri', idxBaskent).label, 'Ankara');

  var idxElement = matcher.createIndex({
    rows: [['Demir', ['Fe'], null, 'Q677', 160, 0]]
  }, { pool: 'element', subject: 'ELEMENT', closed: true });
  assert.strictEqual(matcher.matchAnswer('demir elementi', idxElement).label, 'Demir');

  var idxCorba = matcher.createIndex({
    rows: [['Domates', [], null, 'm', 40, 0], ['Mercimek çorbası', [], null, 'm', 90, 0]]
  }, { pool: 'corba', subject: 'ÇORBA', closed: false });
  assert.strictEqual(matcher.matchAnswer('Domates Çorbası', idxCorba).label, 'Domates');

  var idxFilm = matcher.createIndex({
    rows: [['Matrix', ['The Matrix'], 1999, 'Q83495', 140, 0]]
  }, { pool: 'film', subject: 'FİLM', closed: false });
  assert.strictEqual(matcher.matchAnswer('Matrix filmi', idxFilm).label, 'Matrix');
});

// 10. Ek testler (10 adet): önek, parantez, opts, yanlış pozitif koruması
test('Ek: önek soyma (İstanbul Kadıköy -> Kadıköy)', function () {
  assert.strictEqual(matcher.matchAnswer('İstanbul Kadıköy', idxIlce).label, 'Kadıköy');
});

test('Ek: parantez içeriği atma (Kadıköy (İstanbul) -> Kadıköy)', function () {
  assert.strictEqual(matcher.matchAnswer('Kadıköy (İstanbul)', idxIlce).label, 'Kadıköy');
});

test('Ek: parantez + konu eki birlikte (Chrome (web) tarayıcısı -> Chrome)', function () {
  assert.strictEqual(matcher.matchAnswer('Chrome (web) tarayıcısı', idxTarayici).label, 'Chrome');
});

test('Ek: cüce gezegeni çoklu son ek (Plüton cüce gezegeni)', function () {
  var idxG = matcher.createIndex({
    rows: [['Plüton', [], 1930, 'Q339', 150, 0]]
  }, { pool: 'gezegen', subject: 'GEZEGEN', closed: true });
  assert.strictEqual(matcher.matchAnswer('Plüton cüce gezegeni', idxG).label, 'Plüton');
});

test('Ek: tarayıcı eki (Opera tarayıcısı -> Opera)', function () {
  assert.strictEqual(matcher.matchAnswer('Opera tarayıcısı', idxTarayici).label, 'Opera');
});

test('Ek: soyulmuş metin invalid ise gecersiz dönmeli (Taksim ilçesi -> gecersiz)', function () {
  var res = matcher.matchAnswer('Taksim ilçesi', idxIlce);
  assert.strictEqual(res.status, 'gecersiz');
  assert.strictEqual(res.type, 'invalid');
});

test('Ek: kısa/anlamsız soyulmuş metin korunumu (a gezegeni -> yok)', function () {
  var idxG = matcher.createIndex({
    rows: [['A', [], 2000, 'm', 10, 0], ['Mars', [], -2000, 'Q111', 200, 0]]
  }, { pool: 'gezegen', subject: 'GEZEGEN', closed: true });
  assert.strictEqual(matcher.matchAnswer('a gezegeni', idxG).status, 'yok');
});

test('Ek: kapalı kümede yanlış kategori eki eşleşmemeli (Kadıköy filmi -> yok)', function () {
  assert.strictEqual(matcher.matchAnswer('Kadıköy filmi', idxIlce).status, 'yok');
});

test('Ek: opts.subject / opts.poolId parametresi ile soyma', function () {
  var idxPlain = matcher.createIndex({
    rows: [['Python', [], 1991, 'Q28865', 200, 0]]
  }, {});
  var res = matcher.matchAnswer('Python programlama dili', idxPlain, { poolId: 'prog_dili', subject: 'PROGRAMLAMA DİLİ' });
  assert.strictEqual(res.status, 'eslesti');
  assert.strictEqual(res.label, 'Python');
});

test('Ek: tam eşleşen çok kelimeli ad ek soymadan önce kazanır (Mercimek çorbası)', function () {
  var idxC = matcher.createIndex({
    rows: [['Mercimek çorbası', [], null, 'm', 90, 0]]
  }, { pool: 'corba', subject: 'ÇORBA', closed: false });
  assert.strictEqual(matcher.matchAnswer('Mercimek çorbası', idxC).label, 'Mercimek çorbası');
});

console.log('match_test.js: ' + passed + '/' + total + ' test geçti.');
if (passed !== total) {
  process.exit(1);
}
