/* PUSULLA — sahne yöneticisi. PUSULLA.scene sözleşmesini uygular: setScene(eraId, {year, modeId}), setMode(modeId).
 * Tek düşük çözünürlüklü piksel canvas (tam sayı ölçek), iki katmanlı çapraz solma (≤ 600 ms), ~12 kare/sn.
 * Temalar PUSULLA.scene.register(id, {build, frame}) ile kaydolur (scenes/bosphorus.js, scenes/themes.js).
 * Sahne seçimi: menü ('simdi') → Boğaz; cevap yılı varsa yıla göre tarih sahnesi, yoksa dönem kimliğine göre. */
(function (global) {
  'use strict';
  var P = (global.PUSULLA = global.PUSULLA || {});
  var doc = global.document;
  var BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

  /* ---------------- ortak çizim araçları ---------------- */
  function hex(h) { var n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
  function mix(a, b, t) {
    var A = hex(a), B = hex(b);
    return '#' + ((1 << 24) | (Math.round(A[0] + (B[0] - A[0]) * t) << 16) | (Math.round(A[1] + (B[1] - A[1]) * t) << 8) | Math.round(A[2] + (B[2] - A[2]) * t)).toString(16).slice(1);
  }
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
      if (d <= r + 0.5 && d > r - w + 0.5) c.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1);
    }
  }
  function halfDisc(c, cx, base, r, col) {
    c.fillStyle = col;
    for (var y = -r; y <= 0; y++) { var hw = Math.floor(Math.sqrt(r * r - y * y)); c.fillRect(Math.round(cx - hw), Math.round(base + y), hw * 2 + 1, 1); }
  }
  function poly(c, pts, col) {
    var minY = Infinity, maxY = -Infinity, i;
    for (i = 0; i < pts.length; i++) { minY = Math.min(minY, pts[i][1]); maxY = Math.max(maxY, pts[i][1]); }
    c.fillStyle = col;
    for (var y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      var yc = y + 0.5, xs = [];
      for (i = 0; i < pts.length; i++) {
        var a = pts[i], b = pts[(i + 1) % pts.length];
        if ((a[1] <= yc && b[1] > yc) || (b[1] <= yc && a[1] > yc)) xs.push(a[0] + (yc - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
      }
      xs.sort(function (p, q) { return p - q; });
      for (i = 0; i + 1 < xs.length; i += 2) { var x0 = Math.round(xs[i]), x1 = Math.round(xs[i + 1]); if (x1 > x0) c.fillRect(x0, y, x1 - x0, 1); }
    }
  }
  // dikey dither bantları (gökyüzü, toprak, su)
  function bands(c, keys, y0, y1, W, n) {
    var cols = ramp(keys, n || 10), cnt = cols.length, bh = (y1 - y0) / cnt;
    for (var y = y0; y < y1; y++) {
      var f = (y - y0) / bh, i = Math.min(cnt - 1, Math.floor(f)), fr = f - i;
      for (var x = 0; x < W; x++) {
        var nx = i < cnt - 1 && fr > 0.55 && (BAYER[y & 3][x & 3] / 16) < (fr - 0.55) / 0.45;
        c.fillStyle = nx ? cols[i + 1] : cols[i]; c.fillRect(x, y, 1, 1);
      }
    }
  }
  function profile(c, x0, x1, top, bottom, col, rim) {
    for (var x = Math.max(0, Math.floor(x0)); x < Math.ceil(x1); x++) {
      var y = Math.round(top(x));
      if (y < bottom) px(c, x, y, 1, bottom - y, col);
      if (rim) px(c, x, y, 1, 1, rim);
    }
  }
  function sun(c, sx, sy, R, cols, clipY) {
    for (var y = -R - 9; y <= R + 9; y++) for (var x = -R - 9; x <= R + 9; x++) {
      var d = Math.sqrt(x * x + y * y);
      if (d > R && d <= R + 8 && (clipY === undefined || sy + y < clipY) && BAYER[(sy + y) & 3][(sx + x) & 3] / 16 < (1 - (d - R) / 8) * 0.5) px(c, sx + x, sy + y, 1, 1, cols[0]);
    }
    circle(c, sx, sy, R, cols[0]); circle(c, sx, sy, R - 3, cols[1]); circle(c, sx, sy - 2, Math.max(1, R - 8), cols[2]);
  }
  function stars(c, R, n, W, yMax, col) {
    for (var i = 0; i < n; i++) px(c, Math.floor(R() * W), Math.floor(R() * yMax), 1, 1, col || '#fff4dc');
  }
  // bulutlar: build içinde oluştur, frame içinde çiz
  function makeClouds(R, n, W, H, y0, y1) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var parts = [], k = 3 + Math.floor(R() * 3), w = 0;
      for (var j = 0; j < k; j++) { var r = 4 + Math.floor(R() * 6); parts.push([w + r, -Math.floor(R() * 4), r]); w += r + Math.floor(R() * 4); }
      out.push({ x: R() * W, y: Math.round(H * (y0 + R() * (y1 - y0))), parts: parts, w: w + 8, v: 0.5 + R() * 0.9 });
    }
    return out;
  }
  function drawClouds(c, list, t, W, cols) {
    cols = cols || ['#b2709a', '#d98ca8', '#f5b8bd', '#ffe0d6'];
    list.forEach(function (cl) {
      var span = W + cl.w * 2, x = ((cl.x + t * cl.v) % span + span) % span - cl.w;
      cl.parts.forEach(function (p) { circle(c, x + p[0], cl.y + p[1] + 2, p[2], cols[0]); });
      cl.parts.forEach(function (p) { circle(c, x + p[0], cl.y + p[1], p[2], cols[1]); });
      cl.parts.forEach(function (p) { circle(c, x + p[0] - 1, cl.y + p[1] - 2, p[2] - 2, cols[2]); });
      cl.parts.forEach(function (p) { circle(c, x + p[0] - 2, cl.y + p[1] - 3, Math.max(1, p[2] - 5), cols[3]); });
    });
  }
  function birds(c, t, W, H, n, col, y0) {
    for (var i = 0; i < n; i++) {
      var x = Math.round(((i * 137 + t * (3 + i)) % (W + 20)) - 10), y = Math.round(H * (y0 || 0.2) + i * 9 + Math.sin(t * 0.8 + i) * 2), up = Math.sin(t * 5 + i) > 0;
      px(c, x, y, 1, 1, col); px(c, x - 1, y - (up ? 1 : 0), 1, 1, col); px(c, x + 1, y - (up ? 1 : 0), 1, 1, col);
      px(c, x - 2, y - (up ? 2 : 0), 1, 1, col); px(c, x + 2, y - (up ? 2 : 0), 1, 1, col);
    }
  }
  function smoke(c, x, y, t, col, size) {
    size = size || 1;
    for (var i = 0; i < 5; i++) {
      var ph = (t * 0.5 + i * 0.2) % 1;
      circle(c, x + Math.round(ph * 10 * size + Math.sin(t + i) * 2), y - Math.round(ph * 18 * size), Math.round((1 + ph * 3) * size), col || '#cbbcc8');
    }
  }
  // Türk bayrağı (ay-yıldız), dalgalı: phase 0/1
  function flag(c, x, y, w, ph) {
    var h = Math.round(w * 2 / 3);
    for (var i = 0; i < w; i++) px(c, x + i, y + (ph && (i >> 2) % 2 ? 1 : 0), 1, h, '#d8282f');
    var cx = x + Math.round(w * 0.34), cy = y + Math.round(h / 2), r = Math.max(3, Math.round(h * 0.34));
    circle(c, cx, cy, r, '#ffffff'); circle(c, cx + Math.max(1, Math.round(r * 0.45)), cy, r - 1, '#d8282f');
    var sx = cx + r + 2;
    px(c, sx, cy - 1, 1, 3, '#ffffff'); px(c, sx - 1, cy, 3, 1, '#ffffff');
  }

  var util = { px: px, circle: circle, ring: ring, halfDisc: halfDisc, poly: poly, bands: bands, profile: profile, sun: sun, stars: stars,
    makeClouds: makeClouds, drawClouds: drawClouds, birds: birds, smoke: smoke, flag: flag, mix: mix, ramp: ramp, rng: rng, BAYER: BAYER };

  /* ---------------- sahne seçimi ---------------- */
  var BY_ERA = { simdi: 'bogaz', antik: 'antik', ortacag: 'selcuklu', erken_modern: 'kesif', sanayi: 'sanayi', yy20_basi: 'cumhuriyet', elektronik: 'uzay', dijital: 'dijital', akilli: 'metropol' };
  function pick(eraId, year) {
    if (eraId === 'simdi' || eraId == null) return 'bogaz';
    var y = (year === null || year === undefined || year === '') ? null : +year;
    if (y !== null && !isNaN(y)) {
      if (y < -1000) return 'misir';
      if (y < 500) return 'antik';
      if (y < 1300) return 'selcuklu';
      if (y < 1500) return 'fetih';
      if (y < 1800) return 'kesif';
      if (y < 1900) return 'sanayi';
      if (y < 1950) return 'cumhuriyet';
      if (y < 1990) return 'uzay';
      if (y < 2010) return 'dijital';
      return 'metropol';
    }
    return BY_ERA[eraId] || 'bogaz';
  }

  /* ---------------- katmanlar ve döngü ---------------- */
  var themes = {}, layers = [], front = 0, G = { W: 0, H: 0, S: 3 }, cache = {}, cur = 'bogaz', fading = false, fadeTimer = 0;
  var raf = 0, last = 0, t0 = 0, reduced = false, running = false;

  function now() { return global.performance ? global.performance.now() : Date.now(); }
  function staticFor(id) {
    if (cache[id]) return cache[id];
    var th = themes[id] || themes.bogaz;
    var cv = doc.createElement('canvas');
    cv.width = G.W; cv.height = G.H;
    var c = cv.getContext('2d');
    var st = {};
    try { st = th.build(c, G, util) || {}; } catch (e) { if (global.console) global.console.error('[PUSULLA.scene] sahne çizilemedi:', id, e); }
    return (cache[id] = { cv: cv, st: st, th: th, id: id });
  }
  function paint(L, t) {
    if (!L || !L.ctx || !L.s) return;
    L.ctx.drawImage(L.s.cv, 0, 0);
    if (L.s.th.frame) { try { L.s.th.frame(L.ctx, G, t, L.s.st, util); } catch (e) { /* tek kare hatası oyunu durdurmaz */ } }
  }
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

  function resize() {
    if (!layers.length) return;
    var vw = global.innerWidth, vh = global.innerHeight;
    G.S = Math.max(2, Math.round(vh / 250));
    G.W = Math.ceil(vw / G.S); G.H = Math.ceil(vh / G.S);
    cache = {};
    layers.forEach(function (L) {
      L.cv.width = G.W; L.cv.height = G.H;
      L.cv.style.width = (G.W * G.S) + 'px'; L.cv.style.height = (G.H * G.S) + 'px';
      L.ctx = L.cv.getContext('2d'); L.ctx.imageSmoothingEnabled = false;
      if (L.s) L.s = staticFor(L.s.id);
    });
    if (!layers[front].s) layers[front].s = staticFor(cur);
    frame();
  }
  function finishFade() {
    if (fadeTimer) global.clearTimeout(fadeTimer);
    fadeTimer = 0;
    if (!fading) return;
    front = 1 - front; fading = false;
  }
  function show(id) {
    if (!themes[id]) id = 'bogaz';
    if (!layers.length) { cur = id; return; }
    if (id === cur && !fading) return;
    if (fading) finishFade();
    var back = layers[1 - front];
    back.s = staticFor(id);
    cur = id;
    layers.forEach(function (L) { L.cv.setAttribute('data-scene', id); });
    if (reduced) {
      front = 1 - front;
      layers[front].cv.style.opacity = '1'; layers[1 - front].cv.style.opacity = '0';
      frame(); return;
    }
    fading = true;
    paint(back, (now() - t0) / 1000);
    back.cv.style.opacity = '1';
    layers[front].cv.style.opacity = '0';
    fadeTimer = global.setTimeout(finishFade, 520);
  }

  function mount(root) {
    if (layers.length) return;
    for (var i = 0; i < 2; i++) {
      var cv = doc.createElement('canvas');
      cv.className = 'pu-scene';
      cv.setAttribute('aria-hidden', 'true');
      cv.style.opacity = i === 0 ? '1' : '0';
      root.insertBefore(cv, root.firstChild);
      layers.push({ cv: cv, ctx: null, s: null });
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
    name: 'pusulla-sahne',
    mount: mount,
    setScene: function (eraId, opts) { show(pick(eraId, opts && opts.year)); },
    setMode: function () {},
    register: function (id, th) { if (id && th && typeof th.build === 'function') themes[id] = th; },
    pick: pick,
    labels: { bogaz: 'BOĞAZ', misir: 'ESKİ MISIR', antik: 'ANTİK ÇAĞ', selcuklu: 'SELÇUKLU DÖNEMİ', fetih: 'FETİH DÖNEMİ', kesif: 'KEŞİFLER ÇAĞI',
      sanayi: 'SANAYİ DEVRİMİ', cumhuriyet: 'CUMHURİYET DÖNEMİ', uzay: 'UZAY ÇAĞI', dijital: 'DİJİTAL ÇAĞ', metropol: 'AKILLI ÇAĞ' },
    show: show,
    themes: themes,
    util: util
  };
})(typeof window !== 'undefined' ? window : globalThis);
