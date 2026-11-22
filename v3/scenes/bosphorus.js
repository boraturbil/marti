/* PUSULLA — arka plan sahnesi: piksel sanat Boğaz akşamı ve 8 dönem varyantı.
 * Tek kompozisyon (gökyüzü, güneş, iki kıyı, su); dönem değişince palet, kıyı yapıları, tekne ve tek bir motif değişir.
 * PUSULLA.scene sözleşmesi: setScene(eraId, {year, modeId}), setMode(modeId). Geçiş ≤ 600 ms çapraz solma;
 * prefers-reduced-motion açıkken anında ve durağan. */
(function (global) {
  'use strict';
  var P = (global.PUSULLA = global.PUSULLA || {});
  var doc = global.document;
  var BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

  /* ---------------- dönem tablosu ---------------- */
  // sky/water: anahtar renkler (üst → ufuk / ufuk → derin); left/right: kıyı yapıları; boat; motif; lights: pencere ışığı oranı
  var ERAS = {
    simdi:        { sky: ['#3f2c6e', '#743f88', '#c45f84', '#fbb466'], water: ['#c0708e', '#8f5084', '#45295c'], land: '#4a2f62', rim: '#6e4579', far: '#8a5a92', sun: ['#ff9a5e', '#ffc874', '#ffe9a6'], left: 'ottoman', right: ['houses'], bridge: true, boat: 'ferry', motif: null, lights: 0.45 },
    antik:        { sky: ['#4c3a6c', '#b0607a', '#e8956a', '#ffd08a'], water: ['#d39a7a', '#8a6a7a', '#4e4462'], land: '#5a3a4a', rim: '#8a5a5a', far: '#9a6a7a', sun: ['#ff9a5e', '#ffcf7a', '#fff0b0'], left: 'temple', right: ['olives'], bridge: false, boat: 'galley', motif: 'stele', lights: 0.1 },
    ortacag:      { sky: ['#30305e', '#5e3e7c', '#b0607e', '#f0a070'], water: ['#a8708a', '#5e4a78', '#2f2a50'], land: '#3a2c50', rim: '#6a4a70', far: '#6a4e84', sun: ['#ff8a5e', '#ffb874', '#ffe2a0'], left: 'byzantine', right: ['galata', 'houses'], bridge: false, boat: 'sail', motif: 'arch', lights: 0.15 },
    erken_modern: { sky: ['#3a2c62', '#8a4a7e', '#e0786e', '#ffc06a'], water: ['#d08a7a', '#86507a', '#47305e'], land: '#45305e', rim: '#704a78', far: '#8e5c8a', sun: ['#ff9a5e', '#ffcc74', '#fff0b0'], left: 'ottoman', right: ['galata', 'houses'], bridge: false, boat: 'sail', motif: 'compass', lights: 0.25 },
    sanayi:       { sky: ['#4a3a52', '#7a5a62', '#c08060', '#e8b070'], water: ['#a88070', '#6a5462', '#3e3446'], land: '#3e3040', rim: '#6a5060', far: '#7e6474', sun: ['#e8885a', '#f0b070', '#ffe0a0'], left: 'ottoman', right: ['factory', 'houses'], bridge: false, boat: 'steam', motif: 'gear', lights: 0.4 },
    yy20_basi:    { sky: ['#4a3a5c', '#8a6074', '#d0907a', '#f0c090'], water: ['#c09a88', '#7a6070', '#44364e'], land: '#43344e', rim: '#6e5470', far: '#8a6e84', sun: ['#f09060', '#f8c07a', '#fff0c0'], left: 'ottoman', right: ['telegraph', 'houses'], bridge: false, boat: 'ferry', motif: 'gramophone', lights: 0.5 },
    elektronik:   { sky: ['#3e2262', '#8a2e7e', '#f0507a', '#ffb060'], water: ['#e0708e', '#8a3a7a', '#3a1e56'], land: '#3e2456', rim: '#6e3a78', far: '#8a4a8e', sun: ['#ff7050', '#ffb060', '#ffe6a0'], left: 'ottoman', right: ['antenna', 'houses'], bridge: true, boat: 'ferry', motif: 'tv', lights: 0.55 },
    dijital:      { sky: ['#2e3a7e', '#4e3e92', '#9a4a9a', '#f08a8a'], water: ['#9a6aa8', '#4e3e84', '#222658'], land: '#30285a', rim: '#584a88', far: '#5e5a9a', sun: ['#ff7a7a', '#ffaa8a', '#ffe0c0'], left: 'ottoman', right: ['houses'], bridge: true, boat: 'ferry', motif: 'grid', lights: 0.65 },
    akilli:       { sky: ['#283a80', '#3e3a8e', '#8a4a96', '#f68a7e'], water: ['#8a6ab0', '#3c3a7e', '#1c2054'], land: '#2c2a5a', rim: '#4e4a8a', far: '#54609e', sun: ['#ff7e7a', '#ffae8e', '#ffe6cc'], left: 'ottoman', right: ['towers', 'houses'], bridge: true, boat: 'ferry', motif: 'touch', lights: 0.8 }
  };
  var C = {
    cloudHi: '#ffe0d6', cloudMid: '#f5b8bd', cloudLo: '#d98ca8', cloudSh: '#b2709a',
    win: '#ffd27a', win2: '#ffb054', roof: '#8a3b4f', roofDark: '#6a2c44',
    pine: '#2f4a4a', pineHi: '#466a5a', olive: '#5a6a3e', oliveHi: '#7a8a4e',
    bridge: '#2f1f45', bridgeHi: '#5a3a6a', cable: '#3a2650', lamp: '#ffd98a',
    refl: ['#fff0b8', '#ffd27a', '#ffad66', '#ff8a5c'], foam: '#f6e3dc',
    hullW: '#f3ece2', cabW: '#fff6ea', shadeW: '#cdbfc4', dark: '#2a2140', funnel: '#f2b134', winF: '#4a3e6e',
    wood: '#6a3b2a', woodHi: '#8a4f35', sail: '#f3e6c8', sailSh: '#cdbfa8', smoke: '#cbbcc8',
    gull: '#fff7ee', stone: '#e6cfa8', stoneSh: '#b89a80', marble: '#f0e2c8'
  };

  function hex(h) { var n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
  function toHex(r, g, b) { return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1); }
  function mix(a, b, t) { var A = hex(a), B = hex(b); return toHex(Math.round(A[0] + (B[0] - A[0]) * t), Math.round(A[1] + (B[1] - A[1]) * t), Math.round(A[2] + (B[2] - A[2]) * t)); }
  function ramp(keys, n) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var f = i / (n - 1) * (keys.length - 1), k = Math.min(keys.length - 2, Math.floor(f));
      out.push(mix(keys[k], keys[k + 1], f - k));
    }
    return out;
  }
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function px(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function circle(c, cx, cy, r, col) {
    c.fillStyle = col;
    for (var y = -r; y <= r; y++) { var hw = Math.floor(Math.sqrt(r * r - y * y)); c.fillRect(Math.round(cx - hw), Math.round(cy + y), hw * 2 + 1, 1); }
  }
  function ring(c, cx, cy, r, w, col) {
    c.fillStyle = col;
    for (var y = -r; y <= r; y++) for (var x = -r; x <= r; x++) {
      var d = Math.sqrt(x * x + y * y);
      if (d <= r + 0.5 && d > r - w + 0.5) c.fillRect(cx + x, cy + y, 1, 1);
    }
  }
  function halfDisc(c, cx, base, r, col) {
    c.fillStyle = col;
    for (var y = -r; y <= 0; y++) { var hw = Math.floor(Math.sqrt(r * r - y * y)); c.fillRect(Math.round(cx - hw), Math.round(base + y), hw * 2 + 1, 1); }
  }

  /* ---------------- durum ---------------- */
  var layers = [], front = 0, W = 0, H = 0, S = 3, hz = 0;
  var cache = {}, eraId = 'simdi', fading = null;
  var raf = 0, last = 0, t0 = 0, reduced = false, running = false;
  var clouds = [], gulls = [];

  /* ---------------- yapılar ---------------- */
  function fillProfile(c, x0, x1, top, bottom, col, rim) {
    for (var x = Math.max(0, Math.floor(x0)); x < Math.min(W, Math.ceil(x1)); x++) {
      var y = Math.round(top(x));
      px(c, x, y, 1, bottom - y, col);
      if (rim) px(c, x, y, 1, 1, rim);
    }
  }
  function mosque(c, cx, base, s, E) {
    var r = Math.round(9 * s), b = E.land, br = E.rim;
    px(c, cx - r - 6, base - Math.round(8 * s), (r + 6) * 2, Math.round(8 * s) + 2, b);
    circle(c, cx, base - Math.round(8 * s), r, b);
    circle(c, cx - r - 2, base - Math.round(6 * s), Math.round(r * 0.55), b);
    circle(c, cx + r + 2, base - Math.round(6 * s), Math.round(r * 0.55), b);
    px(c, cx, base - Math.round(8 * s) - r - 3, 1, 3, br);
    [-r - 9, r + 8].forEach(function (dx) {
      var mh = Math.round(36 * s);
      px(c, cx + dx, base - mh, 2, mh, b);
      px(c, cx + dx - 1, base - Math.round(mh * 0.62), 4, 1, br);
      px(c, cx + dx, base - mh - 4, 1, 4, b);
    });
    for (var i = -2; i <= 2; i++) px(c, cx + i * 4, base - 4, 1, 2, i % 2 ? C.win2 : C.win);
  }
  function byzantine(c, cx, base, E) {
    // büyük kubbe + payandalar (minaresiz), çevrede sur
    px(c, cx - 22, base - 12, 44, 14, E.land);
    halfDisc(c, cx, base - 12, 14, E.land);
    px(c, cx - 14, base - 26, 1, 1, E.rim);
    for (var i = -12; i <= 12; i += 4) px(c, cx + i, base - 14 - Math.round(Math.sqrt(Math.max(0, 196 - i * i)) * 0.9), 1, 2, E.rim);
    halfDisc(c, cx - 20, base - 8, 7, E.land); halfDisc(c, cx + 20, base - 8, 7, E.land);
    px(c, cx, base - 29, 1, 3, E.rim);
    for (var w = -16; w <= 16; w += 8) px(c, cx + w, base - 6, 2, 3, C.win2);
  }
  function walls(c, x0, x1, base, E) {
    px(c, x0, base - 7, x1 - x0, 7, E.land);
    for (var x = x0; x < x1; x += 4) px(c, x, base - 9, 2, 2, E.land);
    for (x = x0 + 10; x < x1; x += 26) { px(c, x, base - 13, 7, 13, E.land); px(c, x, base - 15, 2, 2, E.land); px(c, x + 5, base - 15, 2, 2, E.land); }
    px(c, x0, base - 7, x1 - x0, 1, E.rim);
  }
  function temple(c, cx, base, E) {
    var w = 46, top = base - 22;
    px(c, cx - w / 2 - 2, base - 3, w + 4, 3, C.stoneSh);
    px(c, cx - w / 2, top, w, 3, C.stone);
    for (var y = 0; y < 7; y++) px(c, cx - w / 2 + y * 3, top - 1 - y, w - y * 6, 1, y === 0 ? C.stone : C.stoneSh);
    for (var i = 0; i < 7; i++) { var x = cx - w / 2 + 3 + i * 7; px(c, x, top + 3, 3, base - 3 - top - 3, C.stone); px(c, x + 2, top + 3, 1, base - 3 - top - 3, C.stoneSh); }
    // yıkık sütunlar
    px(c, cx + w / 2 + 8, base - 10, 3, 10, C.stone); px(c, cx + w / 2 + 14, base - 6, 3, 6, C.stoneSh);
  }
  function stele(c, x, base) {
    px(c, x, base - 20, 10, 20, C.marble);
    px(c, x + 1, base - 22, 8, 2, C.marble);
    for (var y = base - 17; y < base - 3; y += 3) px(c, x + 2, y, 3 + ((y * 7) % 4), 1, C.stoneSh);
  }
  function galata(c, x, base, E) {
    px(c, x - 4, base - 30, 9, 30, E.land);
    for (var y = 0; y < 9; y++) px(c, x - 4 + Math.floor(y / 2), base - 31 - y, 9 - Math.floor(y / 2) * 2, 1, E.land);
    px(c, x - 5, base - 26, 11, 1, E.rim);
    px(c, x, base - 41, 1, 2, E.rim);
    for (y = base - 22; y < base - 4; y += 6) px(c, x, y, 1, 2, C.win);
  }
  function house(c, x, base, w, h, R, E, antenna) {
    px(c, x, base - h, w, h, E.land);
    px(c, x - 1, base - h - 2, w + 2, 2, C.roof);
    px(c, x, base - h - 3, w, 1, C.roofDark);
    for (var wy = base - h + 2; wy < base - 2; wy += 4)
      for (var wx = x + 1; wx < x + w - 1; wx += 3) if (R() < E.lights) px(c, wx, wy, 1, 1, R() < 0.5 ? C.win : C.win2);
    if (antenna) { px(c, x + 2, base - h - 9, 1, 6, E.rim); px(c, x, base - h - 8, 5, 1, E.rim); px(c, x + 1, base - h - 6, 3, 1, E.rim); }
  }
  function tree(c, x, base, h, olive) {
    if (olive) { circle(c, x, base - h + 3, 3, C.olive); px(c, x - 2, base - h + 1, 2, 1, C.oliveHi); px(c, x, base - h + 6, 1, h - 6, C.wood); return; }
    for (var i = 0; i < h; i++) { var hw = Math.floor((i / h) * (h * 0.35)) + 1; px(c, x - hw, base - h + i, hw * 2 + 1, 1, i % 3 === 0 ? C.pineHi : C.pine); }
  }
  function factory(c, x, base, E) {
    px(c, x, base - 12, 26, 12, E.land);
    for (var i = 0; i < 3; i++) for (var y = 0; y < 4; y++) px(c, x + i * 9 + y, base - 16 + y, 9 - y * 2, 1, E.land);
    px(c, x + 20, base - 34, 4, 22, E.land); px(c, x + 19, base - 34, 6, 2, E.rim);
    for (var w = x + 3; w < x + 24; w += 5) px(c, w, base - 8, 2, 3, C.win2);
  }
  function gear(c, cx, cy, r, col) {
    ring(c, cx, cy, r, 3, col);
    for (var a = 0; a < 8; a++) { var t = a * Math.PI / 4; px(c, cx + Math.cos(t) * (r + 1) - 1, cy + Math.sin(t) * (r + 1) - 1, 3, 3, col); }
    ring(c, cx, cy, Math.max(2, Math.round(r * 0.35)), 1, col);
  }
  function telegraph(c, x0, x1, topFn, E) {
    var poles = [];
    for (var x = x0; x < x1; x += 22) { var b = Math.round(topFn(x)) + 2; px(c, x, b - 16, 1, 16, E.rim); px(c, x - 3, b - 15, 7, 1, E.rim); poles.push([x, b - 15]); }
    for (var i = 1; i < poles.length; i++) {
      var a = poles[i - 1], q = poles[i];
      for (var k = 0; k <= q[0] - a[0]; k++) { var u = k / (q[0] - a[0]); px(c, a[0] + k, a[1] + (q[1] - a[1]) * u + Math.sin(u * Math.PI) * 3, 1, 1, 'rgba(26,17,40,.55)'); }
    }
  }
  function towers(c, x0, base, E) {
    var hs = [46, 58, 40, 66, 36];
    for (var i = 0; i < hs.length; i++) {
      var x = x0 + i * 9, h = hs[i];
      px(c, x, base - h, 7, h, E.land);
      px(c, x, base - h, 1, h, E.rim);
      for (var y = base - h + 3; y < base - 2; y += 3) for (var k = 1; k < 6; k += 2) if (((x + y + k) % 5) < 3) px(c, x + k, y, 1, 1, ((x + y) % 2) ? '#9fd0ff' : C.win);
    }
    // Çamlıca kulesi
    var cx = x0 + 60;
    px(c, cx, base - 70, 3, 70, E.land); px(c, cx - 3, base - 58, 9, 6, E.land); px(c, cx + 1, base - 78, 1, 8, E.rim); px(c, cx + 1, base - 79, 1, 1, '#ff5d5d');
  }
  function motif(c, kind, E) {
    var mx = Math.round(W * 0.9), my = Math.round(H * 0.17), col = 'rgba(255,240,210,.38)';
    if (kind === 'compass') {
      ring(c, mx, my, 13, 2, col);
      c.fillStyle = 'rgba(255,240,210,.55)';
      for (var i = 0; i < 4; i++) { var t = i * Math.PI / 2; for (var r = 2; r < 12; r++) c.fillRect(Math.round(mx + Math.sin(t) * r), Math.round(my - Math.cos(t) * r), r < 6 ? 2 : 1, 1); }
    } else if (kind === 'gear') { gear(c, mx, my, 9, col); }
    else if (kind === 'arch') {
      for (var y = 0; y < 22; y++) { var hw = y < 10 ? Math.round(Math.sqrt(100 - (10 - y) * (10 - y)) * 0.8) : 8; px(c, mx - hw, my - 10 + y, 1, 1, col); px(c, mx + hw, my - 10 + y, 1, 1, col); }
      px(c, mx, my - 8, 1, 20, col); ring(c, mx, my - 2, 3, 1, col);
    } else if (kind === 'stele') { /* kıyıda çizildi */ }
    else if (kind === 'gramophone') {
      px(c, mx - 6, my + 6, 12, 5, col);
      for (var k = 0; k < 10; k++) px(c, mx - 2 + k, my + 3 - k, 1 + Math.floor(k / 2), 1, col);
      px(c, mx - 1, my + 2, 2, 4, col);
    } else if (kind === 'tv') {
      px(c, mx - 10, my - 6, 20, 15, col); px(c, mx - 8, my - 4, 13, 11, 'rgba(26,17,40,.25)');
      px(c, mx + 7, my - 3, 2, 2, col); px(c, mx - 4, my - 11, 1, 5, col); px(c, mx + 4, my - 11, 1, 5, col);
      px(c, mx - 8, my + 9, 2, 3, col); px(c, mx + 6, my + 9, 2, 3, col);
    } else if (kind === 'grid') {
      c.fillStyle = 'rgba(160,220,255,.10)';
      for (var gx = 0; gx < W; gx += 8) c.fillRect(gx, 0, 1, hz - 30);
      for (var gy = 0; gy < hz - 30; gy += 8) c.fillRect(0, gy, W, 1);
    } else if (kind === 'touch') {
      c.fillStyle = 'rgba(200,230,255,.18)';
      for (var tx = 4; tx < W; tx += 12) for (var ty = 4; ty < hz - 30; ty += 12) c.fillRect(tx, ty, 1, 1);
      ring(c, mx, my, 6, 2, 'rgba(200,230,255,.3)'); ring(c, mx, my, 10, 1, 'rgba(200,230,255,.18)');
    }
  }
  function drawBridge(c) {
    var tl = Math.round(W * 0.27), tr = Math.round(W * 0.73);
    var top = hz - Math.round(H * 0.27), deck = hz - Math.round(H * 0.095);
    var aL = Math.round(W * 0.06), aR = Math.round(W * 0.94);
    function cableY(x) {
      if (x < tl) return deck + 2 + (top - deck - 2) * Math.pow((x - aL) / (tl - aL), 1.6);
      if (x > tr) return deck + 2 + (top - deck - 2) * Math.pow((aR - x) / (aR - tr), 1.6);
      var u = (x - tl) / (tr - tl);
      return top + (deck - 6 - top) * (1 - Math.pow(2 * u - 1, 2));
    }
    for (var x = aL + 2; x < aR - 1; x += 3) { var cy = Math.round(cableY(x)); if (cy < deck) px(c, x, cy, 1, deck - cy, 'rgba(47,31,69,.55)'); }
    for (x = aL; x <= aR; x++) px(c, x, Math.round(cableY(x)), 1, 1, C.cable);
    [tl, tr].forEach(function (tx) {
      px(c, tx - 3, top, 2, hz - top, C.bridge); px(c, tx + 2, top, 2, hz - top, C.bridge);
      px(c, tx - 3, top + 2, 7, 2, C.bridge); px(c, tx - 3, top + Math.round((deck - top) * 0.5), 7, 2, C.bridge);
      px(c, tx - 3, top, 1, hz - top, C.bridgeHi); px(c, tx, top - 2, 1, 2, C.lamp);
    });
    px(c, aL - 4, deck, aR - aL + 8, 3, C.bridge); px(c, aL - 4, deck, aR - aL + 8, 1, C.bridgeHi);
    for (x = aL; x < aR; x += 9) px(c, x, deck - 1, 1, 1, C.lamp);
  }

  function buildStatic(id) {
    var E = ERAS[id] || ERAS.simdi;
    var cv = doc.createElement('canvas');
    cv.width = W; cv.height = H;
    var c = cv.getContext('2d');
    var R = rng(23);
    // gökyüzü (dither geçişli bantlar)
    var sky = ramp(E.sky, 11), n = sky.length, bandH = hz / n, x, y;
    for (y = 0; y < hz; y++) {
      var f = y / bandH, i = Math.min(n - 1, Math.floor(f)), fr = f - i;
      for (x = 0; x < W; x++) {
        var nx = i < n - 1 && fr > 0.55 && (BAYER[y & 3][x & 3] / 16) < (fr - 0.55) / 0.45;
        c.fillStyle = nx ? sky[i + 1] : sky[i]; c.fillRect(x, y, 1, 1);
      }
    }
    if (E.motif) motif(c, E.motif, E);
    // güneş
    var sx = Math.round(W * 0.5), sy = hz - 12, SR = 22;
    for (y = -SR - 10; y <= SR + 10; y++) for (x = -SR - 10; x <= SR + 10; x++) {
      var d = Math.sqrt(x * x + y * y);
      if (d > SR && d <= SR + 9 && sy + y < hz && BAYER[(sy + y) & 3][(sx + x) & 3] / 16 < (1 - (d - SR) / 9) * 0.55) px(c, sx + x, sy + y, 1, 1, E.sun[0]);
    }
    circle(c, sx, sy, SR, E.sun[0]); circle(c, sx, sy, SR - 3, E.sun[1]); circle(c, sx, sy - 2, SR - 8, E.sun[2]);
    // uzak tepeler
    fillProfile(c, 0, W, function (x) { return hz - 16 - 7 * Math.sin(x / 37) - 5 * Math.sin(x / 13 + 1) - (x > W * 0.6 ? 8 : 0); }, hz, E.far, mix(E.far, '#ffffff', 0.12));
    if (E.bridge) drawBridge(c);
    // sol kıyı
    var lEnd = W * 0.3;
    var lTop = function (x) { return hz - 22 - 10 * Math.sin(x / 29) - 4 * Math.sin(x / 9) + Math.max(0, (x - lEnd * 0.75)) * 0.9; };
    fillProfile(c, 0, lEnd + 4, lTop, hz, E.land, E.rim);
    var keep = [];
    if (E.left === 'ottoman') {
      mosque(c, Math.round(W * 0.09), Math.round(lTop(W * 0.09)) + 4, 1, E);
      mosque(c, Math.round(W * 0.205), Math.round(lTop(W * 0.205)) + 3, 0.7, E);
      keep = [[W * 0.09, 22], [W * 0.205, 16]];
    } else if (E.left === 'byzantine') {
      walls(c, 0, Math.round(lEnd - 8), Math.round(lTop(lEnd * 0.5)) + 14, E);
      byzantine(c, Math.round(W * 0.11), Math.round(lTop(W * 0.11)) + 4, E);
      keep = [[W * 0.11, 30]];
    } else if (E.left === 'temple') {
      temple(c, Math.round(W * 0.1), Math.round(lTop(W * 0.1)) + 4, E);
      keep = [[W * 0.1, 34]];
    }
    for (var hx = 4; hx < lEnd - 6; hx += 7 + Math.floor(R() * 5)) {
      var skip = keep.some(function (k) { return Math.abs(hx - k[0]) < k[1]; });
      if (skip) continue;
      if (E.left === 'temple') tree(c, hx, Math.round(lTop(hx)) + 4, 6, true);
      else house(c, hx, Math.round(lTop(hx)) + 8, 5 + Math.floor(R() * 3), 5 + Math.floor(R() * 5), R, E, false);
    }
    // sağ kıyı
    var rStart = W * 0.7;
    var rTop = function (x) { return hz - 20 - 9 * Math.sin(x / 31 + 2) - 3 * Math.sin(x / 7) + Math.max(0, (rStart + 18 - x)) * 0.9; };
    fillProfile(c, rStart - 4, W, rTop, hz, E.land, E.rim);
    var rr = E.right, rKeep = [];
    if (rr.indexOf('towers') >= 0) { towers(c, Math.round(W * 0.8), Math.round(rTop(W * 0.84)) + 6, E); rKeep.push([W * 0.86, 40]); }
    if (rr.indexOf('factory') >= 0) { factory(c, Math.round(W * 0.8), Math.round(rTop(W * 0.81)) + 6, E); rKeep.push([W * 0.82, 20]); }
    if (rr.indexOf('galata') >= 0) { galata(c, Math.round(W * 0.78), Math.round(rTop(W * 0.78)) + 4, E); rKeep.push([W * 0.78, 9]); }
    if (E.motif === 'stele') { stele(c, Math.round(W * 0.84), Math.round(rTop(W * 0.84)) + 4); rKeep.push([W * 0.85, 10]); }
    for (var rx = Math.round(rStart + 14); rx < W - 4; rx += 6 + Math.floor(R() * 6)) {
      if (rKeep.some(function (k) { return Math.abs(rx - k[0]) < k[1]; })) continue;
      var b = Math.round(rTop(rx));
      if (rr.indexOf('olives') >= 0) { tree(c, rx, b + 4, 6, true); continue; }
      if (R() < 0.35) tree(c, rx, b + 4, 7 + Math.floor(R() * 5), false);
      else house(c, rx, b + 8, 5 + Math.floor(R() * 3), 5 + Math.floor(R() * 4), R, E, rr.indexOf('antenna') >= 0 && R() < 0.6);
    }
    if (rr.indexOf('telegraph') >= 0) telegraph(c, Math.round(rStart + 6), W, rTop, E);
    // su
    var water = ramp(E.water, 7), wn = water.length, wh = H - hz;
    for (y = hz; y < H; y++) {
      var wf = (y - hz) / wh * wn, wi = Math.min(wn - 1, Math.floor(wf)), wfr = wf - wi;
      for (x = 0; x < W; x++) {
        var wnx = wi < wn - 1 && wfr > 0.5 && BAYER[y & 3][x & 3] / 16 < (wfr - 0.5) * 2;
        c.fillStyle = wnx ? water[wi + 1] : water[wi]; c.fillRect(x, y, 1, 1);
      }
    }
    var shoreDark = mix(E.land, '#000000', 0.15);
    for (var k = 0; k < 4; k++) {
      var yy = hz + 1 + k * 2, cut = k * 6, col = k < 2 ? shoreDark : water[3];
      px(c, 0, yy, Math.max(0, lEnd - cut), 1, col);
      px(c, rStart + cut, yy, W - rStart - cut, 1, col);
    }
    px(c, 0, hz, W, 1, 'rgba(246,227,220,.55)');
    return { cv: cv, E: E, chimney: rr.indexOf('factory') >= 0 ? [Math.round(W * 0.8) + 22, Math.round(rTop(W * 0.81)) + 6 - 36] : null };
  }

  /* ---------------- hareketli öğeler ---------------- */
  function initEntities() {
    var R = rng(7);
    clouds = [];
    for (var i = 0; i < 6; i++) {
      var parts = [], n = 3 + Math.floor(R() * 3), w = 0;
      for (var k = 0; k < n; k++) { var r = 5 + Math.floor(R() * 6); parts.push([w + r, -Math.floor(R() * 4), r]); w += r + Math.floor(R() * 4); }
      clouds.push({ x: R() * W, y: Math.round(H * (0.07 + R() * 0.3)), parts: parts, w: w + 8, v: 0.6 + R() * 0.9 });
    }
    gulls = [];
    for (i = 0; i < 4; i++) gulls.push({ x0: R() * W, y: Math.round(H * (0.18 + R() * 0.25)), v: 3 + R() * 4, ph: R() * 6 });
  }
  function drawCloud(c, cl, x) {
    cl.parts.forEach(function (p) { circle(c, x + p[0], cl.y + p[1] + 2, p[2], C.cloudSh); });
    cl.parts.forEach(function (p) { circle(c, x + p[0], cl.y + p[1], p[2], C.cloudLo); });
    cl.parts.forEach(function (p) { circle(c, x + p[0] - 1, cl.y + p[1] - 2, p[2] - 2, C.cloudMid); });
    cl.parts.forEach(function (p) { circle(c, x + p[0] - 2, cl.y + p[1] - 3, Math.max(1, p[2] - 5), C.cloudHi); });
  }
  function smoke(c, x, y, t) {
    for (var i = 0; i < 4; i++) {
      var ph = (t * 0.6 + i * 0.25) % 1;
      circle(c, x + Math.round(ph * 10 + Math.sin(t + i) * 2), y - Math.round(ph * 16), 1 + Math.round(ph * 3), C.smoke);
    }
  }
  function drawBoat(c, kind, x, y, t) {
    x = Math.round(x);
    if (kind === 'galley') {
      px(c, x, y, 26, 3, C.wood); px(c, x + 2, y + 3, 22, 1, C.woodHi); px(c, x + 24, y - 2, 3, 2, C.wood);
      for (var o = 3; o < 23; o += 3) px(c, x + o, y + 4 + ((Math.floor(t * 4) + o) % 2), 1, 2, C.woodHi);
      px(c, x + 12, y - 14, 1, 14, C.wood); px(c, x + 6, y - 13, 13, 9, C.sail); px(c, x + 6, y - 5, 13, 1, C.sailSh); px(c, x + 11, y - 11, 3, 5, '#c0504a');
    } else if (kind === 'sail') {
      px(c, x, y, 22, 3, C.wood); px(c, x + 2, y + 3, 18, 1, C.woodHi);
      px(c, x + 8, y - 16, 1, 16, C.wood); px(c, x + 15, y - 12, 1, 12, C.wood);
      for (var s = 0; s < 13; s++) { px(c, x + 9, y - 15 + s, Math.floor(s * 0.6) + 1, 1, C.sail); }
      for (s = 0; s < 9; s++) { px(c, x + 16, y - 11 + s, Math.floor(s * 0.5) + 1, 1, C.sailSh); }
    } else {
      var steam = kind === 'steam';
      px(c, x, y, 24, 3, steam ? '#3a2a3a' : C.hullW); px(c, x + 1, y + 3, 22, 1, steam ? '#5a4050' : C.shadeW);
      px(c, x + 4, y - 4, 15, 4, steam ? '#e8dccc' : C.cabW);
      for (var i = 0; i < 6; i++) px(c, x + 5 + i * 2 + (i > 2 ? 1 : 0), y - 3, 1, 1, C.winF);
      px(c, x + 10, y - 8, 3, 4, steam ? '#2a2030' : C.funnel); px(c, x + 10, y - 9, 3, 1, C.dark);
      if (steam) smoke(c, x + 11, y - 11, t);
      px(c, x - 3, y + 3, 3, 1, C.foam); px(c, x + 24, y + 2, 2, 1, C.foam);
    }
  }
  function drawGull(c, g, t) {
    var x = Math.round(g.x), y = Math.round(g.y + Math.sin(t * 0.8 + g.ph) * 2), up = Math.sin(t * 5 + g.ph) > 0;
    px(c, x, y, 1, 1, C.gull); px(c, x - 1, y - (up ? 1 : 0), 1, 1, C.gull); px(c, x + 1, y - (up ? 1 : 0), 1, 1, C.gull);
    px(c, x - 2, y - (up ? 2 : 0), 1, 1, C.gull); px(c, x + 2, y - (up ? 2 : 0), 1, 1, C.gull);
  }

  function paint(L, t) {
    var c = L.ctx, st = L.st;
    if (!c || !st) return;
    c.drawImage(st.cv, 0, 0);
    var i;
    for (i = 0; i < clouds.length; i++) {
      var cl = clouds[i], span = W + cl.w * 2, x = ((cl.x + t * cl.v) % span + span) % span - cl.w;
      if (cl.y + 12 < hz) drawCloud(c, cl, x);
    }
    var sx = Math.round(W * 0.5);
    for (var y = hz + 2; y < H; y += 2) {
      var d = (y - hz) / (H - hz), half = Math.round(6 + d * 26), seg = 0;
      for (var x2 = sx - half; x2 < sx + half; x2 += 3 + seg) {
        seg = (x2 * 7 + y * 13 + Math.floor(t * 3)) % 5;
        if (seg > 1) px(c, x2, y, 2 + (seg === 4 ? 1 : 0), 1, C.refl[Math.min(C.refl.length - 1, Math.floor(d * C.refl.length + (Math.abs(x2 - sx) / half) * 1.5))]);
      }
    }
    for (i = 0; i < 40; i++) {
      var wx = (i * 97 + Math.floor(t * 4) * (i % 3 + 1)) % W, wy = hz + 4 + ((i * 53) % (H - hz - 6));
      if (Math.abs(wx - sx) > 40) px(c, wx, wy, 3, 1, 'rgba(246,227,220,.35)');
    }
    if (st.chimney) smoke(c, st.chimney[0], st.chimney[1], t);
    drawBoat(c, st.E.boat, ((t * 3) % (W + 80)) - 40, hz + Math.round((H - hz) * 0.35), t);
    for (i = 0; i < gulls.length; i++) { var g = gulls[i]; g.x = (g.x0 + t * g.v) % (W + 20) - 10; drawGull(c, g, t); }
  }

  function now() { return (global.performance ? global.performance.now() : Date.now()); }
  function frame() {
    var t = reduced ? 20 : (now() - t0) / 1000;
    paint(layers[front], t);
    if (fading) paint(layers[1 - front], t);
  }
  function loop(ts) {
    raf = 0;
    if (!running) return;
    if (ts - last >= 83) { last = ts; frame(); }
    raf = global.requestAnimationFrame(loop);
  }
  function start() {
    if (reduced || doc.hidden) { frame(); running = false; return; }
    if (running) return;
    running = true; last = 0;
    if (!raf) raf = global.requestAnimationFrame(loop);
  }
  function stop() { running = false; if (raf) { global.cancelAnimationFrame(raf); raf = 0; } }

  function staticFor(id) {
    if (!cache[id]) cache[id] = buildStatic(id);
    return cache[id];
  }
  function resize() {
    if (!layers.length) return;
    var vw = global.innerWidth, vh = global.innerHeight;
    S = Math.max(2, Math.round(vh / 250));
    W = Math.ceil(vw / S); H = Math.ceil(vh / S);
    hz = Math.round(H * 0.6);
    cache = {};
    layers.forEach(function (L) {
      L.cv.width = W; L.cv.height = H;
      L.cv.style.width = (W * S) + 'px'; L.cv.style.height = (H * S) + 'px';
      L.ctx = L.cv.getContext('2d'); L.ctx.imageSmoothingEnabled = false;
    });
    layers[front].st = staticFor(eraId);
    if (fading) { layers[1 - front].st = staticFor(fading); }
    initEntities();
    frame();
  }

  function setScene(id) {
    id = ERAS[id] ? id : 'simdi';
    if (!layers.length) { eraId = id; return; }
    if (id === eraId && !fading) return;
    if (fading) finishFade();
    var back = layers[1 - front];
    back.st = staticFor(id);
    eraId = id;
    layers.forEach(function (L) { L.cv.setAttribute('data-era', id); });
    if (reduced) {
      front = 1 - front;
      layers[front].cv.style.opacity = '1'; layers[1 - front].cv.style.opacity = '0';
      frame();
      return;
    }
    fading = id;
    paint(back, (now() - t0) / 1000);
    back.cv.style.opacity = '1';
    layers[front].cv.style.opacity = '0';
    fading_timer = global.setTimeout(finishFade, 520);
  }
  var fading_timer = 0;
  function finishFade() {
    if (fading_timer) global.clearTimeout(fading_timer);
    fading_timer = 0;
    if (!fading) return;
    front = 1 - front;
    fading = null;
  }

  function mount(root) {
    if (layers.length) return;
    for (var i = 0; i < 2; i++) {
      var cv = doc.createElement('canvas');
      cv.className = 'pu-scene';
      cv.setAttribute('aria-hidden', 'true');
      cv.style.opacity = i === 0 ? '1' : '0';
      root.insertBefore(cv, root.firstChild);
      layers.push({ cv: cv, ctx: null, st: null });
    }
    t0 = now();
    try {
      var mq = global.matchMedia('(prefers-reduced-motion: reduce)');
      reduced = mq.matches;
      var onMq = function (e) { reduced = e.matches; if (reduced) { stop(); frame(); } else start(); };
      if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);
    } catch (e) { reduced = false; }
    resize();
    start();
    var tm = null;
    global.addEventListener('resize', function () { if (tm) global.clearTimeout(tm); tm = global.setTimeout(resize, 120); });
    doc.addEventListener('visibilitychange', function () { if (doc.hidden) stop(); else start(); });
  }

  P.scene = {
    name: 'bosphorus',
    mount: mount,
    setScene: setScene,
    setMode: function () {},
    eras: Object.keys(ERAS)
  };
})(typeof window !== 'undefined' ? window : globalThis);
