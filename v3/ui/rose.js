/* PUSULLA görsel katman — piksel pusula gülü.
 * Görüntü: düşük çözünürlüklü canvas (tam sayı ölçek, pixelated). Etkileşim: üstte saydam SVG dilimleri
 * (fare, Tab odağı, ekran okuyucu). Canvas yalnız sabit metin çizer; veri metni içermez. */
(function (global) {
  'use strict';
  var ui = global.PUSULLA && global.PUSULLA.ui;
  if (!ui) return;
  var doc = global.document;

  var DIRS = [
    { id: 'yaygin', ang: 0,   main: true,  name: 'YAYGIN',  card: 'KUZEY' },
    { id: 'gundem', ang: 45,  main: false, name: 'GÜNDEM',  card: 'KUZEYDOĞU' },
    { id: 'yeni',   ang: 90,  main: true,  name: 'EN YENİ', card: 'DOĞU' },
    { id: 'kesif',  ang: 135, main: false, name: 'KEŞİF',   card: 'GÜNEYDOĞU' },
    { id: 'nadir',  ang: 180, main: true,  name: 'NADİR',   card: 'GÜNEY' },
    { id: 'antika', ang: 225, main: false, name: 'ANTİKA',  card: 'GÜNEYBATI' },
    { id: 'eski',   ang: 270, main: true,  name: 'EN ESKİ', card: 'BATI' },
    { id: 'klasik', ang: 315, main: false, name: 'KLASİK',  card: 'KUZEYBATI' }
  ];
  var LEGS = ['yaygin', 'yeni', 'nadir', 'eski'];
  var byId = {};
  DIRS.forEach(function (d) { byId[d.id] = d; });

  var K = {
    panel: 'rgba(40,26,64,0.9)', panelSolid: '#2a1b42', cream: '#f3e6c8', creamHi: '#fff6e0', dim: '#7a6890',
    dark: '#1a1128', halfDark: '#6b4a86', halfDark2: '#4e3566', gold: '#ffd27a', tick: '#c9b8d8'
  };
  var colorCache = {};
  function modeColor(id) {
    if (!id) return K.gold;
    if (colorCache[id]) return colorCache[id];
    var v = '';
    try { v = global.getComputedStyle(doc.documentElement).getPropertyValue('--mode-' + id).trim(); } catch (e) { v = ''; }
    return (colorCache[id] = v || K.gold);
  }
  function shade(hex, k) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex);
    if (!m) return hex;
    var n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    r = Math.round(r * k); g = Math.round(g * k); b = Math.round(b * k);
    return '#' + ((1 << 24) | (Math.min(255, r) << 16) | (Math.min(255, g) << 8) | Math.min(255, b)).toString(16).slice(1);
  }

  /* ---------- piksel çizim yardımcıları ---------- */
  function pol(r, a) { var t = a * Math.PI / 180; return [r * Math.sin(t), -r * Math.cos(t)]; }
  function fillPoly(c, pts, col) {
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
      for (i = 0; i + 1 < xs.length; i += 2) {
        var x0 = Math.round(xs[i]), x1 = Math.round(xs[i + 1]);
        if (x1 > x0) c.fillRect(x0, y, x1 - x0, 1);
      }
    }
  }
  function disc(c, cx, cy, r, col) {
    c.fillStyle = col;
    for (var y = -r; y < r; y++) {
      var hw = Math.round(Math.sqrt(r * r - (y + 0.5) * (y + 0.5)));
      c.fillRect(cx - hw, cy + y, hw * 2, 1);
    }
  }
  function ring(c, cx, cy, r, w, col, a0, a1) {
    c.fillStyle = col;
    var full = a0 === undefined;
    for (var y = -r; y < r; y++) {
      for (var x = -r; x < r; x++) {
        var d = Math.sqrt((x + 0.5) * (x + 0.5) + (y + 0.5) * (y + 0.5));
        if (d < r && d >= r - w) {
          if (!full) {
            var ang = (Math.atan2(x + 0.5, -(y + 0.5)) * 180 / Math.PI + 360) % 360;
            var lo = (a0 + 360) % 360, hi = (a1 + 360) % 360;
            var inside = lo <= hi ? (ang >= lo && ang <= hi) : (ang >= lo || ang <= hi);
            if (!inside) continue;
          }
          c.fillRect(cx + x, cy + y, 1, 1);
        }
      }
    }
  }
  function text(c, str, x, y, opts) {
    var pf = ui.parts.pixfont;
    if (pf) pf.draw(c, str, x, y, opts);
  }

  /* ---------- büyük gül ---------- */
  var LW = 268, LH = 204, CX = 134, CY = 100, RO = 76;

  function create(container, opts) {
    opts = opts || {};
    if (opts.badge) return createBadge(container);
    var wrap = doc.createElement('div');
    wrap.className = 'rose';
    var cv = doc.createElement('canvas');
    cv.width = LW; cv.height = LH;
    cv.className = 'rose-cv';
    cv.setAttribute('aria-hidden', 'true');
    var c = cv.getContext('2d');
    c.imageSmoothingEnabled = false;
    wrap.appendChild(cv);

    // erişilebilir tıklama/odak katmanı
    var s = ['<svg class="rose-hit" viewBox="0 0 ' + LW + ' ' + LH + '" role="group" aria-label="Pusula: mod seç">'];
    DIRS.forEach(function (d) {
      var w = d.main ? 24 : 21, r0 = 22, r1 = RO + 26;
      var o0 = pol(r1, d.ang - w), o1 = pol(r1, d.ang + w), i1 = pol(r0, d.ang + w), i0 = pol(r0, d.ang - w);
      var f = function (p) { return (CX + p[0]).toFixed(1) + ',' + (CY + p[1]).toFixed(1); };
      s.push('<path class="hit" tabindex="0" role="button" data-id="' + d.id + '" aria-label="' + d.name + (d.main ? ' modu' : ' — karma mod') + '" d="M' + f(o0) + ' A' + r1 + ' ' + r1 + ' 0 0 1 ' + f(o1) + ' L' + f(i1) + ' A' + r0 + ' ' + r0 + ' 0 0 0 ' + f(i0) + 'Z"/>');
    });
    s.push('<circle class="hit hit--center" tabindex="0" role="button" data-id="rota" aria-label="Günün rotası" cx="' + CX + '" cy="' + CY + '" r="21"/></svg>');
    wrap.insertAdjacentHTML('beforeend', s.join(''));
    container.appendChild(wrap);

    var st = { focus: null, ang: 0, from: 0, to: 0, tStart: 0, prog: {}, kb: false, bezel: 0 };
    var raf = 0, reduced = ui.util.reducedMotion();

    function draw() {
      c.clearRect(0, 0, LW, LH);
      // kadran
      disc(c, CX, CY, RO, K.panel);
      ring(c, CX, CY, RO, 3, K.cream);
      ring(c, CX, CY, RO - 3, 1, K.dark);
      ring(c, CX, CY, RO - 14, 1, K.dim);
      // derece çentikleri (yavaş döner)
      c.fillStyle = K.tick;
      for (var a = 0; a < 360; a += 10) {
        var aa = a + st.bezel, long = a % 30 === 0;
        var p0 = pol(RO - 5, aa), p1 = pol(RO - (long ? 9 : 6), aa);
        var steps = long ? 4 : 1;
        for (var k = 0; k <= steps; k++) {
          var q = steps ? k / steps : 0;
          c.fillRect(Math.round(CX + p0[0] + (p1[0] - p0[0]) * q), Math.round(CY + p0[1] + (p1[1] - p0[1]) * q), 1, 1);
        }
      }
      // klavye odak yayı
      if (st.kb && st.focus && byId[st.focus]) {
        var fd = byId[st.focus], fw = fd.main ? 14 : 10;
        ring(c, CX, CY, RO, 3, modeColor(st.focus), fd.ang - fw, fd.ang + fw);
      }
      // uçlar: önce çaprazlar
      [false, true].forEach(function (main) {
        DIRS.forEach(function (d) {
          if (d.main !== main) return;
          var R = main ? RO - 15 : 44, side = main ? 13 : 9;
          var tip = pol(R, d.ang), l = pol(side, d.ang - 45), r = pol(side, d.ang + 45);
          var on = d.id === st.focus;
          var col = on ? modeColor(d.id) : (main ? K.cream : '#d9c8e0');
          var colD = on ? shade(modeColor(d.id), 0.62) : (main ? K.halfDark : K.halfDark2);
          fillPoly(c, [[CX, CY], [CX + l[0], CY + l[1]], [CX + tip[0], CY + tip[1]]], col);
          fillPoly(c, [[CX, CY], [CX + tip[0], CY + tip[1]], [CX + r[0], CY + r[1]]], colD);
        });
      });
      // iğne
      if (st.focus && byId[st.focus]) {
        var nc = modeColor(st.focus);
        var na = st.ang;
        var t1 = pol(RO - 8, na), b1 = pol(4, na - 90), b2 = pol(4, na + 90), tl = pol(26, na + 180);
        fillPoly(c, [[CX + t1[0], CY + t1[1]], [CX + b1[0] * 1.6, CY + b1[1] * 1.6], [CX + tl[0], CY + tl[1]], [CX + b2[0] * 1.6, CY + b2[1] * 1.6]], K.dark);
        fillPoly(c, [[CX + t1[0] * 0.97, CY + t1[1] * 0.97], [CX + b1[0], CY + b1[1]], [CX + b2[0], CY + b2[1]]], nc);
        fillPoly(c, [[CX + tl[0] * 0.9, CY + tl[1] * 0.9], [CX + b1[0], CY + b1[1]], [CX + b2[0], CY + b2[1]]], K.cream);
      }
      // rota halkası (20 parça, her çeyrek kendi yönüne bakar)
      LEGS.forEach(function (id, qi) {
        var n = Math.max(0, Math.min(5, +st.prog[id] || 0));
        for (var i = 0; i < 5; i++) {
          var a0 = qi * 90 - 40 + i * 16 + 2;
          ring(c, CX, CY, 25, 3, i < n ? modeColor(id) : K.halfDark2, a0, a0 + 12);
        }
      });
      // merkez madalyon
      var rotaOn = st.focus === 'rota';
      disc(c, CX, CY, 21, K.panelSolid);
      ring(c, CX, CY, 21, rotaOn ? 3 : 2, rotaOn ? K.gold : K.cream);
      text(c, 'ROTA', CX, CY - 15, { align: 'center', color: rotaOn ? K.gold : '#cbb9dc' });
      var total = 0; LEGS.forEach(function (id) { total += Math.max(0, Math.min(5, +st.prog[id] || 0)); });
      text(c, total + '/20', CX, CY - 3, { align: 'center', color: K.creamHi });
      // etiketler (kadranın dışında, konturlu)
      DIRS.forEach(function (d) {
        var on = d.id === st.focus;
        var o = { align: 'center', color: on ? K.creamHi : modeColor(d.id), outline: K.dark, shadow: on ? null : K.dark };
        if (d.main) {
          if (d.ang === 0) text(c, d.name, CX, CY - RO - 15, o);
          else if (d.ang === 180) text(c, d.name, CX, CY + RO + 3, o);
          else if (d.ang === 270) { o.align = 'right'; text(c, d.name, CX - RO - 5, CY - 6, o); }
          else { o.align = 'left'; text(c, d.name, CX + RO + 5, CY - 6, o); }
          if (on) {
            var m = ui.parts.pixfont ? ui.parts.pixfont.measure(d.name, 1).w : 30;
            var ux = d.ang === 270 ? CX - RO - 5 - m : d.ang === 90 ? CX + RO + 5 : CX - m / 2;
            var uy = d.ang === 0 ? CY - RO - 4 : d.ang === 180 ? CY + RO + 14 : CY + 5;
            c.fillStyle = K.dark; c.fillRect(Math.round(ux) - 1, uy, Math.round(m) + 2, 3);
            c.fillStyle = modeColor(d.id); c.fillRect(Math.round(ux), uy + 1, Math.round(m), 1);
          }
        } else {
          var p = pol(RO + 6, d.ang);
          o.align = d.ang < 180 ? 'left' : 'right';
          text(c, d.name, CX + p[0] + (d.ang < 180 ? 0 : 0), CY + p[1] + (d.ang === 45 || d.ang === 315 ? -9 : -1), o);
        }
      });
    }

    function tick(now) {
      raf = 0;
      var animating = false;
      if (st.tStart) {
        var u = Math.min(1, (now - st.tStart) / 260);
        // yay sönümü: hafif aşma
        var e = 1 - Math.pow(1 - u, 3) + Math.sin(u * Math.PI) * 0.12;
        st.ang = st.from + (st.to - st.from) * e;
        if (u >= 1) { st.ang = st.to; st.tStart = 0; } else animating = true;
      }
      if (!reduced) { st.bezel = (now / 1000 * 1.0) % 360; animating = true; }
      draw();
      if (animating && wrap.isConnected && !wrap.closest('[hidden]')) raf = global.requestAnimationFrame(tick);
    }
    function kick() { if (!raf) raf = global.requestAnimationFrame(tick); }

    var api = { el: wrap, canvas: cv };
    api.setFocus = function (id) {
      var prev = st.focus;
      st.focus = id;
      wrap.setAttribute('data-focus', id || '');
      var d = byId[id];
      if (d) {
        var target = d.ang;
        var diff = ((target - st.ang) % 360 + 540) % 360 - 180;
        if (reduced || prev === null) { st.ang = st.ang + diff; st.tStart = 0; }
        else { st.from = st.ang; st.to = st.ang + diff; st.tStart = global.performance.now(); }
      }
      var hits = wrap.querySelectorAll('.hit');
      for (var i = 0; i < hits.length; i++) hits[i].classList.toggle('is-focus', hits[i].getAttribute('data-id') === id);
      draw(); kick();
    };
    api.setProgress = function (prog) { st.prog = prog || {}; draw(); };
    api.focusEl = function (id) {
      var el = wrap.querySelector('.hit[data-id="' + id + '"]');
      if (el && typeof el.focus === 'function') { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }
    };
    api.current = function () { return st.focus; };
    api.resume = function () { colorCache = {}; draw(); kick(); };

    wrap.addEventListener('focusin', function (e) {
      var kb = false;
      try { kb = e.target.matches(':focus-visible'); } catch (x) { kb = true; }
      st.kb = kb; draw();
    });
    wrap.addEventListener('focusout', function () { st.kb = false; draw(); });
    wrap.addEventListener('mousedown', function () { st.kb = false; });

    // tam sayı ölçek: kap boyutuna sığan en büyük kat
    function fit() {
      var w = container.clientWidth, h = container.clientHeight;
      if (!w || !h) return;
      var k = Math.max(1, Math.min(3, Math.floor(Math.min(w / LW, h / LH))));
      wrap.style.width = (LW * k) + 'px';
      wrap.style.height = (LH * k) + 'px';
    }
    api.fit = fit;
    global.addEventListener('resize', fit);
    global.setTimeout(fit, 0);
    draw();
    return api;
  }

  /* ---------- soru ekranı rozeti ---------- */
  function createBadge(container) {
    var cv = doc.createElement('canvas');
    cv.width = 24; cv.height = 24;
    cv.className = 'rose-badge';
    var c = cv.getContext('2d');
    c.imageSmoothingEnabled = false;
    container.appendChild(cv);
    var mode = null;
    function draw() {
      c.clearRect(0, 0, 24, 24);
      disc(c, 12, 12, 12, K.dark);
      disc(c, 12, 12, 11, K.panelSolid);
      ring(c, 12, 12, 11, 1, K.cream);
      [0, 90, 180, 270].forEach(function (a) {
        var t = pol(8, a), l = pol(3, a - 45), r = pol(3, a + 45);
        fillPoly(c, [[12, 12], [12 + l[0], 12 + l[1]], [12 + t[0], 12 + t[1]]], K.halfDark);
        fillPoly(c, [[12, 12], [12 + t[0], 12 + t[1]], [12 + r[0], 12 + r[1]]], K.halfDark2);
      });
      var d = byId[mode];
      if (d) {
        var t1 = pol(9, d.ang), b1 = pol(2.2, d.ang - 90), b2 = pol(2.2, d.ang + 90), tl = pol(6, d.ang + 180);
        fillPoly(c, [[12 + t1[0], 12 + t1[1]], [12 + b1[0], 12 + b1[1]], [12 + b2[0], 12 + b2[1]]], modeColor(mode));
        fillPoly(c, [[12 + tl[0], 12 + tl[1]], [12 + b1[0], 12 + b1[1]], [12 + b2[0], 12 + b2[1]]], K.cream);
      } else {
        disc(c, 12, 12, 3, modeColor('karma'));
      }
    }
    draw();
    return {
      el: cv,
      setMode: function (id) { mode = id; draw(); },
      setFocus: function (id) { mode = id; draw(); },
      setProgress: function () {}, focusEl: function () {}, current: function () { return mode; }
    };
  }

  ui.parts.rose = { create: create, dirs: DIRS, byId: byId };
})(typeof window !== 'undefined' ? window : globalThis);
