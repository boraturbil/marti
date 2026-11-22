'use strict';

var matcher = require('../matcher.js');
var openFx = require('./fixtures/open_5000.js');

function nowMs() {
  var hr = process.hrtime.bigint();
  return Number(hr) / 1e6;
}

// 1. İndeks kurulum süresi (5000 kayıt, hedef <= 40 ms)
var t0 = nowMs();
var index = matcher.createIndex(openFx.pool, openFx.question);
var indexMs = nowMs() - t0;

// 2. 1000 karma sorgu (tam + ekli + bulanık + yok)
var queries = [];
var rows = openFx.pool.rows;
for (var i = 0; i < 1000; i++) {
  var mod = i % 4;
  var lbl = rows[(i * 5) % rows.length][0];
  if (mod === 0) {
    queries.push(lbl); // tam
  } else if (mod === 1) {
    queries.push(lbl.toLowerCase() + 'lar'); // ekli
  } else if (mod === 2) {
    queries.push(lbl.slice(0, -1) + 'z'); // 1 harf yazım hatası
  } else {
    queries.push('olmayankayit' + i); // yok
  }
}

var t1 = nowMs();
var matched = 0;
var confirm = 0;
var none = 0;
for (var q = 0; q < queries.length; q++) {
  var res = matcher.matchAnswer(queries[q], index);
  if (res.status === 'eslesti') matched++;
  else if (res.status === 'onay_iste') confirm++;
  else if (res.status === 'yok') none++;
}
var queryTotalMs = nowMs() - t1;
var avgMs = queryTotalMs / queries.length;

console.log('=== match_bench.js (5000 kayıt) ===');
console.log('İndeks kurulumu : ' + indexMs.toFixed(2) + ' ms (hedef <= 40 ms)');
console.log('1000 sorgu toplam: ' + queryTotalMs.toFixed(2) + ' ms (hedef <= 150 ms)');
console.log('Tekil sorgu ort. : ' + avgMs.toFixed(4) + ' ms (hedef <= 5 ms)');
console.log('Dağılım          : eslesti=' + matched + ', onay_iste=' + confirm + ', yok=' + none);

if (avgMs > 5) {
  console.error('HATA: Tekil sorgu süresi 5 ms sınırını aştı.');
  process.exit(1);
}
