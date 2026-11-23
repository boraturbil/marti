/* PUSULLA v3 — Sahne duman testi (node, bağımlılıksız).
 * Kullanım:
 *   node v3/tools/scene_smoke.js [--files themes.js,bosphorus.js] [--ids misir,antik] [--report] [--year-table]
 */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');
var perf = require('perf_hooks').performance;

// Bütçe sabitleri (Adım 0 kalibrasyonu: worst_build=12.66ms, worst_rect=3152)
var RECT_MAX = 3940;
var BUILD_MAX = 30;

var SCENES_DIR = path.resolve(__dirname, '..', 'scenes');
var BASE_FILES = ['core.js', 'bosphorus.js', 'themes.js', 'walker.js'];

var args = process.argv.slice(2);
var optFiles = null;
var optIds = null;
var optReport = false;
var optYearTable = false;

for (var ai = 0; ai < args.length; ai++) {
  var a = args[ai];
  if (a === '--files' && ai + 1 < args.length) {
    optFiles = args[++ai].split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  } else if (a === '--ids' && ai + 1 < args.length) {
    optIds = args[++ai].split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  } else if (a === '--report') {
    optReport = true;
  } else if (a === '--year-table') {
    optYearTable = true;
  }
}

// Koşulsuz DOM stub
var rectCount = 0;
var nanErrors = 0;

var fakeCtx = new Proxy({}, {
  get: function (_target, prop) {
    if (prop === 'fillRect') {
      return function (x, y, w, h) {
        rectCount++;
        if (typeof x !== 'number' || !isFinite(x) ||
            typeof y !== 'number' || !isFinite(y) ||
            typeof w !== 'number' || !isFinite(w) ||
            typeof h !== 'number' || !isFinite(h)) {
          nanErrors++;
        }
      };
    }
    if (prop === 'createLinearGradient') {
      return function () {
        return { addColorStop: function () {} };
      };
    }
    if (prop === 'imageSmoothingEnabled') return false;
    return function () {};
  },
  set: function () { return true; }
});

var fakeCanvas = {
  width: 0,
  height: 0,
  style: {},
  setAttribute: function () {},
  getContext: function () { return fakeCtx; }
};

globalThis.window = globalThis;
globalThis.document = {
  createElement: function () { return fakeCanvas; },
  documentElement: { style: { setProperty: function () {} } },
  body: { dataset: {} },
  addEventListener: function () {},
  hidden: false
};

function loadSceneFile(fileName) {
  var fullPath = path.isAbsolute(fileName) ? fileName : path.join(SCENES_DIR, fileName);
  if (!fs.existsSync(fullPath)) {
    throw new Error('Dosya bulunamadi: ' + fullPath);
  }
  var code = fs.readFileSync(fullPath, 'utf8');
  vm.runInThisContext(code, { filename: fullPath });
}

function discoverBgFiles() {
  return fs.readdirSync(SCENES_DIR)
    .filter(function (f) { return /^bg_[a-z0-9_]+\.js$/i.test(f); })
    .sort();
}

function extractIds(fileName) {
  var fullPath = path.isAbsolute(fileName) ? fileName : path.join(SCENES_DIR, fileName);
  var src = fs.readFileSync(fullPath, 'utf8');
  var re = /(?:S|PUSULLA\.scene)\.register\(\s*['"]([a-z0-9_]+)['"]/g;
  var out = [];
  var m;
  while ((m = re.exec(src)) !== null) {
    if (out.indexOf(m[1]) === -1) out.push(m[1]);
  }
  return out;
}

// 1. Temel dosyaları yükle
for (var bi = 0; bi < BASE_FILES.length; bi++) {
  loadSceneFile(BASE_FILES[bi]);
}

// 2. Hedef dosyaları belirle ve yüklenmemiş olanları yükle
var targetFiles = optFiles ? optFiles : ['bosphorus.js', 'themes.js'].concat(discoverBgFiles());
for (var ti = 0; ti < targetFiles.length; ti++) {
  var tf = path.basename(targetFiles[ti]);
  if (BASE_FILES.indexOf(tf) === -1) {
    loadSceneFile(targetFiles[ti]);
  }
}

var S = globalThis.PUSULLA && globalThis.PUSULLA.scene;
if (!S || !S.themes || !S.util) {
  console.error('FAIL: PUSULLA.scene yuklenemedi');
  process.exit(1);
}

// 3. Test edilecek kimlikleri belirle
var ids = [];
if (optIds) {
  ids = optIds;
} else {
  for (var fi = 0; fi < targetFiles.length; fi++) {
    var found = extractIds(targetFiles[fi]);
    for (var ki = 0; ki < found.length; ki++) {
      if (ids.indexOf(found[ki]) === -1) ids.push(found[ki]);
    }
  }
}

if (optYearTable && S.PICK_BY_YEAR) {
  for (var yi = 0; yi < S.PICK_BY_YEAR.length; yi++) {
    var yid = S.PICK_BY_YEAR[yi][1];
    if (ids.indexOf(yid) === -1) ids.push(yid);
  }
}

var SIZES = [
  { name: '1920x1080', W: 558, H: 270, S: 4 },
  { name: '1366x768',  W: 530, H: 256, S: 3 },
  { name: '375x812',   W: 145, H: 271, S: 3 }
];

var passCount = 0;
var worstBuild = 0;
var worstRect = 0;

for (var si = 0; si < ids.length; si++) {
  var id = ids[si];
  var th = S.themes[id];
  var errMsg = null;
  var maxBuildMs = 0;
  var maxRect = 0;
  var mainSt = {};

  if (!th || typeof th.build !== 'function') {
    errMsg = 'kayitli degil';
  } else {
    try {
      for (var zi = 0; zi < SIZES.length; zi++) {
        var G2 = { W: SIZES[zi].W, H: SIZES[zi].H, S: SIZES[zi].S };
        rectCount = 0;
        nanErrors = 0;
        var tStart = perf.now();
        var st = th.build(fakeCtx, G2, S.util) || {};
        var dt = perf.now() - tStart;
        if (dt > maxBuildMs) maxBuildMs = dt;
        if (nanErrors > 0) throw new Error('build icinde NaN/Infinity koordinat (' + SIZES[zi].name + ')');
        if (zi === 0) mainSt = st;
      }

      if (typeof th.frame === 'function') {
        var G2Main = { W: SIZES[0].W, H: SIZES[0].H, S: SIZES[0].S };
        for (var step = 0; step <= 24; step++) {
          var t = step * 0.25;
          rectCount = 0;
          nanErrors = 0;
          th.frame(fakeCtx, G2Main, t, mainSt, S.util);
          var r1 = rectCount;
          if (nanErrors > 0) throw new Error('frame icinde NaN/Infinity koordinat (t=' + t + ')');

          // Belirlenimlilik kontrolü
          rectCount = 0;
          nanErrors = 0;
          th.frame(fakeCtx, G2Main, t, mainSt, S.util);
          var r2 = rectCount;
          if (r1 !== r2) throw new Error('belirlenimli degil (t=' + t + ': ' + r1 + ' vs ' + r2 + ')');
          if (r1 > maxRect) maxRect = r1;
        }
      }

      if (!optReport) {
        if (maxBuildMs > BUILD_MAX) errMsg = 'build cok yavas: ' + maxBuildMs.toFixed(1) + 'ms > ' + BUILD_MAX + 'ms';
        else if (maxRect > RECT_MAX) errMsg = 'frame rect asimi: ' + maxRect + ' > ' + RECT_MAX;
      }
    } catch (e) {
      errMsg = e && e.message ? e.message : String(e);
    }
  }

  if (maxBuildMs > worstBuild) worstBuild = maxBuildMs;
  if (maxRect > worstRect) worstRect = maxRect;

  if (errMsg) {
    console.log('FAIL ' + id + ' ' + errMsg);
  } else {
    passCount++;
    console.log('PASS ' + id + ' build ' + maxBuildMs.toFixed(1) + 'ms frame max ' + maxRect + ' rect');
  }
}

console.log('SMOKE ' + passCount + '/' + ids.length);
if (optReport) {
  var recBuild = Math.max(30, Math.ceil(1.25 * worstBuild));
  var recRect = Math.max(2000, Math.ceil(1.25 * worstRect));
  console.log('REPORT worst_build=' + worstBuild.toFixed(2) + 'ms worst_rect=' + worstRect + ' | BUILD_MAX=' + recBuild + ' RECT_MAX=' + recRect);
}

if (passCount !== ids.length) process.exit(1);
