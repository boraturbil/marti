/* PUSULLA — arka plan sahnesi: piksel sanat Boğaz akşamı (tek canvas, düşük çözünürlük, tam sayı ölçek).
 * PUSULLA.scene sözleşmesini uygular: setScene(eraId, {year, modeId}), setMode(modeId).
 * Dönem motifleri aşama 5'te eklenecek; şimdilik tüm dönemler bu temel sahneyi kullanır. */
(function (global) {
  'use strict';
  var P = (global.PUSULLA = global.PUSULLA || {});
  var doc = global.document;

  var C = {
    sky: ['#3f2c6e', '#4d3278', '#5e3a82', '#743f88', '#8e4889', '#a95387', '#c45f84', '#dc6e7e', '#ec8374', '#f59a6a', '#fbb466'],
    sunCore: '#ffe9a6', sunMid: '#ffc874', sunRim: '#ff9a5e',
    cloudHi: '#ffe0d6', cloudMid: '#f5b8bd', cloudLo: '#d98ca8', cloudSh: '#b2709a',
    farHill: '#8a5a92', farRim: '#a46d9c',
    land: '#4a2f62', landRim: '#6e4579', landDark: '#3a2452',
    bld: '#3c2756', bldRim: '#6a4478',
    win: '#ffd27a', win2: '#ffb054',
    roof: '#8a3b4f', roofDark: '#6a2c44',
    pine: '#2f4a4a', pineHi: '#466a5a',
    bridge: '#2f1f45', bridgeHi: '#5a3a6a', cable: '#3a2650', lamp: '#ffd98a',
    water: ['#c0708e', '#a85f88', '#8f5084', '#78457c', '#633b72', '#523268', '#45295c'],
    refl: ['#fff0b8', '#ffd27a', '#ffad66', '#ff8a5c'],
    foam: '#f6e3dc',
    ferryHull: '#f3ece2', ferryCab: '#fff6ea', ferryShade: '#cdbfc4', ferryDark: '#2a2140', ferryFun: '#f2b134', ferryWin: '#4a3e6e',
    gull: '#fff7ee', gullDark: '#3a2650'
  };
  var BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

  var canvas = null, ctx = null, stat = null, W = 0, H = 0, S = 3, hz = 0;
  var era = 'simdi', raf = 0, last = 0, t0 = 0, reduced = false, running = false;
  var clouds = [], gulls = [];

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
    for (var y = -r; y <= r; y++) {
      var hw = Math.floor(Math.sqrt(r * r - y * y));
      c.fillRect(Math.round(cx - hw), Math.round(cy + y), hw * 2 + 1, 1);
    }
  }
  // üst kenar profili fn(x) ile alttan doldur
  function fillProfile(c, x0, x1, top, bottom, col, rim) {
    for (var x = Math.max(0, Math.floor(x0)); x < Math.min(W, Math.ceil(x1)); x++) {
      var y = Math.round(top(x));
      px(c, x, y, 1, bottom - y, col);
      if (rim) px(c, x, y, 1, 1, rim);
    }
  }

  /* ---------------- durağan katman ---------------- */
  function drawSky(c) {
    var n = C.sky.length, top = 0, bot = hz;
    var bandH = (bot - top) / n;
    for (var y = top; y < bot; y++) {
      var f = (y - top) / bandH, i = Math.min(n - 1, Math.floor(f)), frac = f - i;
      for (var x = 0; x < W; x++) {
        var useNext = i < n - 1 && frac > 0.55 && (BAYER[y & 3][x & 3] / 16) < (frac - 0.55) / 0.45;
        c.fillStyle = useNext ? C.sky[i + 1] : C.sky[i];
        c.fillRect(x, y, 1, 1);
      }
    }
  }
  function drawSun(c, sx, sy) {
    var R = 22;
    for (var y = -R - 10; y <= R + 10; y++) {
      for (var x = -R - 10; x <= R + 10; x++) {
        var d = Math.sqrt(x * x + y * y);
        if (d > R && d <= R + 9 && sy + y < hz && BAYER[(sy + y) & 3][(sx + x) & 3] / 16 < (1 - (d - R) / 9) * 0.55) {
          px(c, sx + x, sy + y, 1, 1, C.sunRim);
        }
      }
    }
    circle(c, sx, sy, R, C.sunRim);
    circle(c, sx, sy, R - 3, C.sunMid);
    circle(c, sx, sy - 2, R - 8, C.sunCore);
    // ufukta kesilen alt kısım su ile örtülecek
  }
  function mosque(c, cx, base, s) {
    var r = Math.round(9 * s);
    px(c, cx - r - 6, base - Math.round(8 * s), (r + 6) * 2, Math.round(8 * s) + 2, C.bld);
    circle(c, cx, base - Math.round(8 * s), r, C.bld);
    px(c, cx - r, base - Math.round(8 * s) - r, 1, 1, C.bldRim);
    // yarım kubbeler
    circle(c, cx - r - 2, base - Math.round(6 * s), Math.round(r * 0.55), C.bld);
    circle(c, cx + r + 2, base - Math.round(6 * s), Math.round(r * 0.55), C.bld);
    // alem
    px(c, cx, base - Math.round(8 * s) - r - 3, 1, 3, C.bldRim);
    // minareler
    [-r - 9, r + 8].forEach(function (dx) {
      var mh = Math.round(36 * s);
      px(c, cx + dx, base - mh, 2, mh, C.bld);
      px(c, cx + dx - 1, base - Math.round(mh * 0.62), 4, 1, C.bldRim);
      px(c, cx + dx, base - mh - 4, 1, 4, C.bld);
      px(c, cx + dx + 1, base - mh - 3, 1, 3, C.bld);
    });
    // pencereler
    for (var i = -2; i <= 2; i++) px(c, cx + i * 4, base - 4, 1, 2, i % 2 ? C.win2 : C.win);
  }
  function house(c, x, base, w, h, R) {
    px(c, x, base - h, w, h, C.bld);
    px(c, x - 1, base - h - 2, w + 2, 2, C.roof);
    px(c, x, base - h - 3, w, 1, C.roofDark);
    for (var wy = base - h + 2; wy < base - 2; wy += 4) {
      for (var wx = x + 1; wx < x + w - 1; wx += 3) if (R() < 0.45) px(c, wx, wy, 1, 1, R() < 0.5 ? C.win : C.win2);
    }
  }
  function pine(c, x, base, h) {
    for (var i = 0; i < h; i++) {
      var hw = Math.floor((i / h) * (h * 0.35)) + 1;
      px(c, x - hw, base - h + i, hw * 2 + 1, 1, i % 3 === 0 ? C.pineHi : C.pine);
    }
    px(c, x, base, 1, 2, C.landDark);
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
    // askı halatları
    for (var x = aL + 2; x < aR - 1; x += 3) {
      var cy = Math.round(cableY(x));
      if (cy < deck) px(c, x, cy, 1, deck - cy, 'rgba(47,31,69,.55)');
    }
    // ana halat
    for (x = aL; x <= aR; x++) px(c, x, Math.round(cableY(x)), 1, 1, C.cable);
    // kuleler
    [tl, tr].forEach(function (tx) {
      px(c, tx - 3, top, 2, hz - top, C.bridge);
      px(c, tx + 2, top, 2, hz - top, C.bridge);
      px(c, tx - 3, top + 2, 7, 2, C.bridge);
      px(c, tx - 3, top + Math.round((deck - top) * 0.5), 7, 2, C.bridge);
      px(c, tx - 3, top, 1, hz - top, C.bridgeHi);
      px(c, tx, top - 2, 1, 2, C.lamp);
    });
    // tabliye
    px(c, aL - 4, deck, aR - aL + 8, 3, C.bridge);
    px(c, aL - 4, deck, aR - aL + 8, 1, C.bridgeHi);
    for (x = aL; x < aR; x += 9) px(c, x, deck - 1, 1, 1, C.lamp);
  }

  function buildStatic() {
    stat = doc.createElement('canvas');
    stat.width = W; stat.height = H;
    var c = stat.getContext('2d');
    var R = rng(23);
    drawSky(c);
    var sx = Math.round(W * 0.5), sy = hz - 12;
    drawSun(c, sx, sy);
    // uzak tepeler (Anadolu yakası)
    fillProfile(c, 0, W, function (x) { return hz - 16 - 7 * Math.sin(x / 37) - 5 * Math.sin(x / 13 + 1) - (x > W * 0.6 ? 8 : 0); }, hz, C.farHill, C.farRim);
    drawBridge(c);
    // sol kıyı: tarihi yarımada
    var lEnd = W * 0.3;
    var lTop = function (x) { return hz - 22 - 10 * Math.sin(x / 29) - 4 * Math.sin(x / 9) + Math.max(0, (x - lEnd * 0.75)) * 0.9; };
    fillProfile(c, 0, lEnd + 4, lTop, hz, C.land, C.landRim);
    mosque(c, Math.round(W * 0.09), Math.round(lTop(W * 0.09)) + 4, 1);
    mosque(c, Math.round(W * 0.205), Math.round(lTop(W * 0.205)) + 3, 0.7);
    for (var hx = 4; hx < lEnd - 6; hx += 7 + Math.floor(R() * 5)) {
      if (Math.abs(hx - W * 0.09) < 22 || Math.abs(hx - W * 0.205) < 16) continue;
      house(c, hx, Math.round(lTop(hx)) + 8, 5 + Math.floor(R() * 3), 5 + Math.floor(R() * 5), R);
    }
    // sağ kıyı: tepeler, evler, çamlar
    var rStart = W * 0.7;
    var rTop = function (x) { return hz - 20 - 9 * Math.sin(x / 31 + 2) - 3 * Math.sin(x / 7) + Math.max(0, (rStart + 18 - x)) * 0.9; };
    fillProfile(c, rStart - 4, W, rTop, hz, C.land, C.landRim);
    for (var rx = Math.round(rStart + 14); rx < W - 4; rx += 6 + Math.floor(R() * 6)) {
      if (R() < 0.35) pine(c, rx, Math.round(rTop(rx)) + 4, 7 + Math.floor(R() * 5));
      else house(c, rx, Math.round(rTop(rx)) + 8, 5 + Math.floor(R() * 3), 5 + Math.floor(R() * 4), R);
    }
    // su
    var wn = C.water.length, wh = H - hz;
    for (var y = hz; y < H; y++) {
      var f = (y - hz) / wh * wn, i = Math.min(wn - 1, Math.floor(f)), fr = f - i;
      for (var x = 0; x < W; x++) {
        var nx = i < wn - 1 && fr > 0.5 && BAYER[y & 3][x & 3] / 16 < (fr - 0.5) * 2;
        c.fillStyle = nx ? C.water[i + 1] : C.water[i];
        c.fillRect(x, y, 1, 1);
      }
    }
    // kıyı yansımaları: kıyı altında kısalan yatay çizgiler
    for (var k = 0; k < 4; k++) {
      var yy = hz + 1 + k * 2, cut = k * 6;
      px(c, 0, yy, Math.max(0, lEnd - cut), 1, k < 2 ? C.landDark : C.water[3]);
      px(c, rStart + cut, yy, W - rStart - cut, 1, k < 2 ? C.landDark : C.water[3]);
    }
    px(c, 0, hz, W, 1, 'rgba(246,227,220,.55)');
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
    for (i = 0; i < 4; i++) gulls.push({ x: R() * W, y: Math.round(H * (0.18 + R() * 0.25)), v: 3 + R() * 4, ph: R() * 6 });
  }
  function drawCloud(c, cl, x) {
    cl.parts.forEach(function (p) { circle(c, x + p[0], cl.y + p[1] + 2, p[2], C.cloudSh); });
    cl.parts.forEach(function (p) { circle(c, x + p[0], cl.y + p[1], p[2], C.cloudLo); });
    cl.parts.forEach(function (p) { circle(c, x + p[0] - 1, cl.y + p[1] - 2, p[2] - 2, C.cloudMid); });
    cl.parts.forEach(function (p) { circle(c, x + p[0] - 2, cl.y + p[1] - 3, Math.max(1, p[2] - 5), C.cloudHi); });
  }
  function drawFerry(c, x, y) {
    x = Math.round(x);
    px(c, x, y, 24, 3, C.ferryHull);
    px(c, x + 1, y + 3, 22, 1, C.ferryShade);
    px(c, x + 4, y - 4, 15, 4, C.ferryCab);
    for (var i = 0; i < 6; i++) px(c, x + 5 + i * 2 + (i > 2 ? 1 : 0), y - 3, 1, 1, C.ferryWin);
    px(c, x + 10, y - 8, 3, 4, C.ferryFun);
    px(c, x + 10, y - 9, 3, 1, C.ferryDark);
    px(c, x - 3, y + 3, 3, 1, C.foam);
    px(c, x + 24, y + 2, 2, 1, C.foam);
  }
  function drawGull(c, g, t) {
    var x = Math.round(g.x), y = Math.round(g.y + Math.sin(t * 0.8 + g.ph) * 2);
    var up = Math.sin(t * 5 + g.ph) > 0;
    px(c, x, y, 1, 1, C.gull);
    px(c, x - 1, y - (up ? 1 : 0), 1, 1, C.gull);
    px(c, x + 1, y - (up ? 1 : 0), 1, 1, C.gull);
    px(c, x - 2, y - (up ? 2 : 0), 1, 1, C.gull);
    px(c, x + 2, y - (up ? 2 : 0), 1, 1, C.gull);
  }

  function frame(t) {
    ctx.drawImage(stat, 0, 0);
    var i;
    for (i = 0; i < clouds.length; i++) {
      var cl = clouds[i], span = W + cl.w * 2;
      var x = ((cl.x + t * cl.v) % span + span) % span - cl.w;
      if (cl.y + 12 < hz) drawCloud(ctx, cl, x);
    }
    // güneş yansıması (kırık çizgiler)
    var sx = Math.round(W * 0.5);
    for (var y = hz + 2; y < H; y += 2) {
      var d = (y - hz) / (H - hz);
      var half = Math.round(6 + d * 26);
      var seg = 0;
      for (var x2 = sx - half; x2 < sx + half; x2 += 3 + seg) {
        seg = (x2 * 7 + y * 13 + Math.floor(t * 3)) % 5;
        if (seg > 1) {
          var ci = Math.min(C.refl.length - 1, Math.floor(d * C.refl.length + (Math.abs(x2 - sx) / half) * 1.5));
          px(ctx, x2, y, 2 + (seg === 4 ? 1 : 0), 1, C.refl[ci]);
        }
      }
    }
    // dalga parıltıları
    for (i = 0; i < 40; i++) {
      var wx = (i * 97 + Math.floor(t * 4) * (i % 3 + 1)) % W;
      var wy = hz + 4 + ((i * 53) % (H - hz - 6));
      if (Math.abs(wx - sx) > 40) px(ctx, wx, wy, 3, 1, 'rgba(246,227,220,.35)');
    }
    // vapur
    var fx = ((t * 3) % (W + 80)) - 40;
    drawFerry(ctx, fx, hz + Math.round((H - hz) * 0.35));
    for (i = 0; i < gulls.length; i++) {
      var g = gulls[i];
      g.x = ((g.x0 === undefined ? (g.x0 = g.x) : g.x0) + t * g.v) % (W + 20) - 10;
      drawGull(ctx, g, t);
    }
  }

  function loop(now) {
    raf = 0;
    if (!running) return;
    if (now - last >= 83) { // ~12 kare/sn: piksel sanat ritmi
      last = now;
      frame((now - t0) / 1000);
    }
    raf = global.requestAnimationFrame(loop);
  }
  function start() {
    if (reduced || doc.hidden) { if (ctx) frame(20); running = false; return; }
    if (running) return;
    running = true; last = 0;
    if (!raf) raf = global.requestAnimationFrame(loop);
  }
  function stop() { running = false; if (raf) { global.cancelAnimationFrame(raf); raf = 0; } }

  function resize() {
    if (!canvas) return;
    var vw = global.innerWidth, vh = global.innerHeight;
    S = Math.max(2, Math.round(vh / 250));
    W = Math.ceil(vw / S); H = Math.ceil(vh / S);
    hz = Math.round(H * 0.6);
    canvas.width = W; canvas.height = H;
    canvas.style.width = (W * S) + 'px';
    canvas.style.height = (H * S) + 'px';
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    buildStatic();
    initEntities();
    frame(running ? (performance.now() - t0) / 1000 : 20);
  }

  function mount(root) {
    if (canvas) return;
    canvas = doc.createElement('canvas');
    canvas.className = 'pu-scene';
    canvas.setAttribute('aria-hidden', 'true');
    root.insertBefore(canvas, root.firstChild);
    t0 = performance.now();
    try {
      var mq = global.matchMedia('(prefers-reduced-motion: reduce)');
      reduced = mq.matches;
      var onMq = function (e) { reduced = e.matches; if (reduced) { stop(); frame(20); } else start(); };
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
    setScene: function (eraId) { era = eraId || 'simdi'; if (canvas) canvas.setAttribute('data-era', era); },
    setMode: function () {}
  };
})(typeof window !== 'undefined' ? window : globalThis);
