/* PUSULLA v3 — PICK_BY_YEAR, labels, ROADS ve soru scene alanı doğrulama testi.
 * Kullanım: node v3/tools/scene_pick_test.js
 */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var SCENES_DIR = path.resolve(__dirname, '..', 'scenes');
var FILES = [
  'core.js', 'bosphorus.js', 'themes.js', 'walker.js',
  'bg_a.js', 'bg_b.js', 'bg_c.js', 'bg_d.js', 'bg_e.js', 'bg_f.js'
];

var lastSceneAttr = null;
var canvases = [];
var fakeCtx = new Proxy({}, {
  get: function (_t, prop) {
    if (prop === 'imageSmoothingEnabled') return false;
    return function () {};
  },
  set: function () { return true; }
});
function makeCanvas() {
  var cv = {
    width: 0,
    height: 0,
    style: {},
    attrs: {},
    setAttribute: function (k, v) {
      this.attrs[k] = v;
      if (k === 'data-scene') lastSceneAttr = v;
    },
    getContext: function () { return fakeCtx; }
  };
  canvases.push(cv);
  return cv;
}
var rootStub = {
  firstChild: null,
  insertBefore: function (node) {
    if (!this.firstChild) this.firstChild = node;
    return node;
  }
};

globalThis.window = globalThis;
globalThis.innerWidth = 1280;
globalThis.innerHeight = 720;
globalThis.requestAnimationFrame = function () { return 0; };
globalThis.cancelAnimationFrame = function () {};
globalThis.addEventListener = function () {};
globalThis.document = {
  createElement: makeCanvas,
  documentElement: { style: { setProperty: function () {} } },
  body: { dataset: { phase: 'menu' } },
  addEventListener: function () {},
  hidden: false
};

for (var i = 0; i < FILES.length; i++) {
  var fp = path.join(SCENES_DIR, FILES[i]);
  vm.runInThisContext(fs.readFileSync(fp, 'utf8'), { filename: fp });
}

var S = globalThis.PUSULLA && globalThis.PUSULLA.scene;
var errors = [];
function fail(msg) { errors.push(msg); }
function assert(cond, msg) { if (!cond) fail(msg); }

assert(S && Array.isArray(S.PICK_BY_YEAR), 'PICK_BY_YEAR bulunamadi');
assert(S.PICK_BY_YEAR.length === 46, 'PICK_BY_YEAR uzunlugu 46 olmali, bulunan: ' + (S.PICK_BY_YEAR && S.PICK_BY_YEAR.length));

// 1. Her PICK_BY_YEAR satiri icin min/max sinir testi
var passPick = 0;
for (var idx = 0; idx < S.PICK_BY_YEAR.length; idx++) {
  var upper = S.PICK_BY_YEAR[idx][0];
  var id = S.PICK_BY_YEAR[idx][1];
  var minY = idx === 0 ? -1e6 : S.PICK_BY_YEAR[idx - 1][0];
  var maxY = upper === Infinity ? 2100 : upper - 1;
  var gotMin = S.pick('antik', minY);
  var gotMax = S.pick('antik', maxY);
  if (gotMin === id && gotMax === id) {
    passPick++;
  } else {
    fail('pick sinir hatasi #' + idx + ' (' + id + '): min(' + minY + ')=' + gotMin + ', max(' + maxY + ')=' + gotMax);
  }
}

// 2. Ozel durumlar
assert(S.pick('simdi', 1500) === 'bogaz', "pick('simdi', 1500) !== 'bogaz'");
assert(S.pick(null) === 'bogaz', "pick(null) !== 'bogaz'");
assert(S.pick('ortacag', null) === 'selcuklu', "pick('ortacag', null) !== 'selcuklu'");

// 3. 46 id + bogaz themes, labels, walker.ROADS icinde kayitli
var allIds = ['bogaz'];
for (var k = 0; k < S.PICK_BY_YEAR.length; k++) allIds.push(S.PICK_BY_YEAR[k][1]);
assert(allIds.length === 47, 'Toplam sahne sayisi 47 olmali');

var ROADS = S.walker && S.walker.ROADS;
assert(ROADS && typeof ROADS === 'object', 'S.walker.ROADS bulunamadi');

for (var j = 0; j < allIds.length; j++) {
  var sid = allIds[j];
  assert(S.themes && S.themes[sid] && typeof S.themes[sid].build === 'function', 'themes[' + sid + '] kayitli degil');
  assert(S.labels && typeof S.labels[sid] === 'string' && S.labels[sid].length > 0, 'labels[' + sid + '] eksik');
  assert(Array.isArray(ROADS[sid]) && ROADS[sid].length === 3, 'walker.ROADS[' + sid + '] eksik');
}

// 4. bg_*.js META satirlari ile capraz kontrol
var rangeById = {};
for (var r = 0; r < S.PICK_BY_YEAR.length; r++) {
  var rid = S.PICK_BY_YEAR[r][1];
  rangeById[rid] = {
    min: r === 0 ? -99999 : S.PICK_BY_YEAR[r - 1][0],
    max: S.PICK_BY_YEAR[r][0] === Infinity ? Infinity : S.PICK_BY_YEAR[r][0] - 1
  };
}

var bgFiles = ['bg_a.js', 'bg_b.js', 'bg_c.js', 'bg_d.js', 'bg_e.js', 'bg_f.js'];
var metaCount = 0;
for (var bi = 0; bi < bgFiles.length; bi++) {
  var src = fs.readFileSync(path.join(SCENES_DIR, bgFiles[bi]), 'utf8');
  var re = /\*\s*META\s+([a-z0-9_]+)\s+(\{[^\r\n]+\})/g;
  var m;
  while ((m = re.exec(src)) !== null) {
    metaCount++;
    var mid = m[1];
    var meta = JSON.parse(m[2]);
    assert(rangeById[mid], 'META id PICK_BY_YEAR icinde yok: ' + mid);
    if (rangeById[mid]) {
      assert(meta.min === rangeById[mid].min && meta.max === rangeById[mid].max,
        'META aralik uyumsuz (' + mid + '): ' + meta.min + '..' + meta.max + ' != ' + rangeById[mid].min + '..' + rangeById[mid].max);
    }
    assert(S.labels[mid] === meta.label, 'META label uyumsuz (' + mid + '): ' + meta.label + ' != ' + S.labels[mid]);
    assert(JSON.stringify(ROADS[mid]) === JSON.stringify(meta.road),
      'META road uyumsuz (' + mid + '): ' + JSON.stringify(meta.road) + ' != ' + JSON.stringify(ROADS[mid]));
  }
}
assert(metaCount === 36, 'bg_*.js META sayisi 36 olmali, bulunan: ' + metaCount);

// 5. setScene opts.scene testi (menu fazinda dogrudan show() ile data-scene guncellenir)
S.mount(rootStub);
S.setScene('elektronik', { year: 1950, scene: 'cumhuriyet' });
assert(lastSceneAttr === 'cumhuriyet', "setScene scene:'cumhuriyet' beklenen 'cumhuriyet', gelen: " + lastSceneAttr);
S.setScene('elektronik', { year: 1950, scene: 'yok_boyle' });
assert(lastSceneAttr === 'bm_newyork', "setScene gecersiz scene yila dusmeli ('bm_newyork'), gelen: " + lastSceneAttr);

if (errors.length) {
  console.error('FAIL (' + errors.length + ' hata):');
  for (var e = 0; e < errors.length; e++) console.error(' - ' + errors[e]);
  process.exit(1);
}

console.log('PICK ' + passPick + '/46');
console.log('PASS: 47 sahne, 36 META, opts.scene ve sinir testleri temiz.');
