/* PUSULLA — tarih sahneleri (sonuç ekranında cevabın yılına göre). Piksel üslup; simge yapılar ekranın iki kenarında,
 * çünkü orta alanı soru/sonuç paneli kaplar. Kayıt: PUSULLA.scene.register(id, {build, frame}). */
(function (global) {
  'use strict';
  var S = global.PUSULLA && global.PUSULLA.scene;
  if (!S || !S.register) return;

  function gy(G) { return Math.round(G.H * 0.7); }

  /* ---------- ortak küçük çizimler ---------- */
  function palm(u, c, x, base, h) {
    for (var i = 0; i < h; i++) u.px(c, x + Math.round(Math.sin(i / h * 1.4) * 3), base - i, 2, 1, i % 3 ? '#7a5038' : '#5a3a2a');
    var tx = x + Math.round(Math.sin(1.4) * 3), ty = base - h;
    [[-1, -0.2], [-1, 0.5], [1, -0.2], [1, 0.5], [-0.4, -1], [0.4, -1]].forEach(function (d) {
      for (var k = 0; k < 9; k++) u.px(c, tx + Math.round(d[0] * k), ty + Math.round(d[1] * k + (k * k) * 0.06), 2, 1, k % 2 ? '#3e7a4a' : '#2e5e3a');
    });
  }
  function cypress(u, c, x, base, h) {
    for (var i = 0; i < h; i++) { var w = Math.max(1, Math.round(Math.sin(i / h * Math.PI) * 3)); u.px(c, x - w, base - i, w * 2 + 1, 1, i % 4 ? '#2e4a3a' : '#3e5e46'); }
  }
  function camel(u, c, x, y, step, col) {
    col = col || '#5a3a2a';
    u.px(c, x, y, 10, 3, col); u.px(c, x + 2, y - 2, 4, 2, col); u.px(c, x + 3, y - 3, 2, 1, col);
    u.px(c, x + 9, y - 4, 2, 5, col); u.px(c, x + 10, y - 5, 3, 2, col);
    var a = step ? 1 : 0;
    u.px(c, x + 1 + a, y + 3, 1, 4, col); u.px(c, x + 3 - a, y + 3, 1, 4, col); u.px(c, x + 7 + a, y + 3, 1, 4, col); u.px(c, x + 9 - a, y + 3, 1, 4, col);
  }
  function crescentFlag(u, c, x, y, w, ph) {
    var h = Math.round(w * 0.66);
    for (var i = 0; i < w; i++) u.px(c, x + i, y + (ph && (i >> 2) % 2 ? 1 : 0), 1, h, '#c8282f');
    var cx = x + Math.round(w * 0.45), cy = y + Math.round(h / 2), r = Math.max(2, Math.round(h * 0.32));
    u.circle(c, cx, cy, r, '#f6efe0'); u.circle(c, cx + Math.max(1, Math.round(r * 0.45)), cy, r, '#c8282f');
  }
  function windows(u, c, x0, y0, w, h, R, p, cols) {
    for (var y = y0; y < y0 + h; y += 3) for (var x = x0; x < x0 + w; x += 2) if (R() < p) u.px(c, x, y, 1, 1, cols[Math.floor(R() * cols.length)]);
  }

  /* ================= 1) MISIR PİRAMİTLERİ (MÖ 1000 öncesi) ================= */
  function pyramid(u, c, cx, base, half, h) {
    var ax = cx, ay = base - h, mid = cx + Math.round(half * 0.25);
    u.poly(c, [[ax, ay], [cx - half, base], [mid, base]], '#f3c47e');
    u.poly(c, [[ax, ay], [mid, base], [cx + half, base]], '#b9814e');
    for (var y = ay + 4; y < base; y += 4) {
      var f = (y - ay) / h, l = ax - half * f, r = ax + half * f;
      u.px(c, l, y, r - l, 1, 'rgba(90,50,30,.25)');
    }
    u.px(c, ax - 1, ay, 2, 2, '#fff0c8');
  }
  S.register('misir', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G);
      u.bands(c, ['#5a3e8a', '#b85e86', '#f59a62', '#ffd48a'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), Math.round(H * 0.16), 16, ['#ff9a5e', '#ffcf7a', '#fff3c0']);
      u.profile(c, 0, W, function (x) { return g - 6 - 4 * Math.sin(x / 23) - 3 * Math.sin(x / 9); }, g, '#e8a868', '#f6c88a');
      u.bands(c, ['#f0b870', '#d8945a', '#b8784a'], g, H, W, 6);
      for (var y = g + 6; y < H; y += 7) for (var x = 0; x < W; x++) if (Math.sin(x / 11 + y) > 0.6) u.px(c, x, y + Math.round(Math.sin(x / 7) * 1.5), 1, 1, 'rgba(255,230,180,.35)');
      pyramid(u, c, Math.round(W * 0.23), g + 2, Math.round(W * 0.08), Math.round(H * 0.2));
      pyramid(u, c, Math.round(W * 0.09), g + 3, Math.round(W * 0.14), Math.round(H * 0.36));
      pyramid(u, c, Math.round(W * 0.985), g + 3, Math.round(W * 0.1), Math.round(H * 0.31));
      // Sfenks
      var sx = Math.round(W * 0.895), sb = g + 8;
      u.px(c, sx - 14, sb - 7, 26, 7, '#d49a5e'); u.px(c, sx - 14, sb - 7, 26, 1, '#f0c080');
      u.px(c, sx - 20, sb - 3, 8, 3, '#d49a5e');
      u.px(c, sx - 18, sb - 16, 8, 10, '#d49a5e');
      for (var k = 0; k < 4; k++) u.px(c, sx - 19, sb - 16 + k * 2 + 1, 10, 1, k % 2 ? '#3e5e9a' : '#e8c070');
      u.px(c, sx - 17, sb - 13, 2, 1, '#5a3a2a');
      palm(u, c, Math.round(W * 0.03), g + 10, 22);
      return { g: g, clouds: u.makeClouds(u.rng(3), 3, W, H, 0.05, 0.2) };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.6, G.W, ['#d88a7a', '#f0a888', '#ffcaa0', '#ffe6c8']);
      var y = Math.round(G.H * 0.88), step = Math.floor(t * 3) % 2;
      for (var i = 0; i < 3; i++) camel(u, c, Math.round(G.W - ((t * 4 + i * 18) % (G.W + 60))), y, (step + i) % 2, '#6a4430');
      u.birds(c, t, G.W, G.H, 2, '#5a3a4a', 0.3);
    }
  });

  /* ================= 2) ANTİK YUNAN-ROMA (MÖ 1000 – MS 499) ================= */
  function temple(u, c, cx, base, w) {
    var top = base - Math.round(w * 0.42);
    u.px(c, cx - w / 2 - 3, base - 4, w + 6, 4, '#c8b49a'); u.px(c, cx - w / 2 - 2, base - 6, w + 4, 2, '#e8dcc4');
    u.px(c, cx - w / 2, top, w, 4, '#efe4cc'); u.px(c, cx - w / 2, top + 3, w, 1, '#c8b49a');
    u.poly(c, [[cx - w / 2 - 2, top], [cx, top - Math.round(w * 0.16)], [cx + w / 2 + 2, top]], '#efe4cc');
    u.poly(c, [[cx - w / 2 + 4, top - 1], [cx, top - Math.round(w * 0.12)], [cx + w / 2 - 4, top - 1]], '#d8c8ac');
    var n = 8;
    for (var i = 0; i < n; i++) { var x = Math.round(cx - w / 2 + 2 + i * (w - 6) / (n - 1)); u.px(c, x, top + 4, 3, base - 6 - top - 4, '#f6eedc'); u.px(c, x + 2, top + 4, 1, base - 6 - top - 4, '#c8b49a'); }
  }
  S.register('antik', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(11);
      u.bands(c, ['#3e3a7a', '#8a5a96', '#e08a86', '#ffc88a'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), g - 30, 14, ['#ff9a6e', '#ffc884', '#fff0c0']);
      u.profile(c, 0, W, function (x) { return g - 14 - 8 * Math.sin(x / 41 + 1) - 4 * Math.sin(x / 13); }, g, '#8a6a92', '#a684a6');
      // sol tepe + tapınak
      var lTop = function (x) { return g - 22 + Math.max(0, x - W * 0.2) * 0.5 - 3 * Math.sin(x / 9); };
      u.profile(c, 0, W * 0.32, lTop, g + 2, '#7a7a4e', '#9a9a5e');
      temple(u, c, Math.round(W * 0.11), Math.round(lTop(W * 0.11)) + 2, Math.round(W * 0.17));
      cypress(u, c, Math.round(W * 0.215), Math.round(lTop(W * 0.215)) + 2, 20);
      cypress(u, c, Math.round(W * 0.245), Math.round(lTop(W * 0.245)) + 2, 14);
      // sağ tepe + amfitiyatro
      var rTop = function (x) { return g - 30 + Math.max(0, W * 0.78 - x) * 0.6 + 3 * Math.sin(x / 11); };
      u.profile(c, W * 0.66, W, rTop, g + 2, '#7a7a4e', '#9a9a5e');
      var ax = Math.round(W * 0.88), ay = Math.round(rTop(W * 0.88)) + 26;
      for (var r = 24; r > 6; r -= 3) {
        for (var a = 180; a <= 360; a += 2) { var t = a * Math.PI / 180; u.px(c, ax + Math.round(Math.cos(t) * r), ay + Math.round(Math.sin(t) * r * 0.55), 2, 1, r % 6 ? '#e8dcc4' : '#b8a88e'); }
      }
      u.px(c, ax - 10, ay - 2, 20, 2, '#c8b49a');
      [0.72, 0.76].forEach(function (f, i) { var x = Math.round(W * f), b = Math.round(rTop(x)) + 2; u.px(c, x, b - (i ? 10 : 18), 3, i ? 10 : 18, '#f0e6d0'); u.px(c, x - 1, b - (i ? 11 : 19), 5, 1, '#d8c8ac'); });
      u.bands(c, ['#8a9a5a', '#6e7e4a', '#56643e'], g, H, W, 6);
      for (var i2 = 0; i2 < 30; i2++) { var ox = Math.floor(R() * W), oy = g + 6 + Math.floor(R() * (H - g - 10)); u.circle(c, ox, oy, 2, '#5a6a3a'); u.px(c, ox, oy + 2, 1, 2, '#5a3a2a'); }
      return { clouds: u.makeClouds(u.rng(5), 5, W, H, 0.06, 0.3) };
    },
    frame: function (c, G, t, st, u) { u.drawClouds(c, st.clouds, t, G.W); u.birds(c, t, G.W, G.H, 3, '#fff4e8', 0.22); }
  });

  /* ================= 3) SELÇUKLU KERVANSARAYI (500 – 1299) ================= */
  S.register('selcuklu', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(17);
      u.bands(c, ['#2e3268', '#6a4a86', '#d0786e', '#f8b07a'], 0, g, W, 11);
      u.stars(c, R, 40, W, Math.round(H * 0.25), 'rgba(255,244,220,.7)');
      u.circle(c, Math.round(W * 0.5), Math.round(H * 0.14), 7, '#fff2c8');
      u.profile(c, 0, W, function (x) { return g - 22 - 12 * Math.abs(Math.sin(x / 27)) - 5 * Math.sin(x / 7); }, g, '#5a4a7a', '#7a6292');
      // kervansaray (sol)
      var x1 = Math.round(W * 0.26), top = g - Math.round(H * 0.17);
      u.px(c, 0, top, x1, g - top + 2, '#d8a878'); u.px(c, 0, top, x1, 1, '#f0c898');
      for (var x = 0; x < x1; x += 5) u.px(c, x, top - 3, 3, 3, '#d8a878');
      for (x = 8; x < x1; x += 22) { u.px(c, x, top - 6, 8, g - top + 6, '#c8966a'); u.px(c, x, top - 6, 8, 1, '#f0c898'); }
      var px0 = Math.round(W * 0.07), pw = Math.round(W * 0.075), ptop = g - Math.round(H * 0.31);
      u.px(c, px0, ptop, pw, g - ptop + 2, '#e8bc8a'); u.px(c, px0 + 2, ptop + 2, pw - 4, 1, '#a87a58');
      u.px(c, px0 + 2, ptop + 2, 1, g - ptop - 2, '#a87a58'); u.px(c, px0 + pw - 3, ptop + 2, 1, g - ptop - 2, '#a87a58');
      var ax = px0 + Math.round(pw / 2), aw = Math.round(pw * 0.32), ay = ptop + 10;
      for (var y = 0; y < g - ay; y++) { var hw = y < aw ? Math.round(Math.sqrt(aw * aw - (aw - y) * (aw - y)) * 0.9) : aw; u.px(c, ax - hw, ay + y, hw * 2, 1, '#5a3e3e'); }
      for (var m = 0; m < 3; m++) for (var k = -aw + 2; k < aw - 1; k += 3) u.px(c, ax + k, ay + 6 + m * 4, 2, 2, '#c8966a');
      u.px(c, ax - aw + 3, g - 14, aw * 2 - 6, 14, '#3e2a2e');
      // kümbet (sağ)
      var kx = Math.round(W * 0.9), kb = g + 2, kh = Math.round(H * 0.18);
      u.px(c, kx - 9, kb - kh, 18, kh, '#c8966a'); u.px(c, kx - 9, kb - kh, 2, kh, '#e8bc8a');
      u.poly(c, [[kx - 11, kb - kh], [kx, kb - kh - 18], [kx + 11, kb - kh]], '#8a5a4a');
      u.px(c, kx - 3, kb - kh + 6, 6, 9, '#5a3e3e'); u.px(c, kx - 9, kb - kh + 3, 18, 1, '#a87a58');
      for (var p = 0; p < 3; p++) cypress(u, c, Math.round(W * (0.76 + p * 0.03)), g + 2, 16 + p * 4);
      u.bands(c, ['#c09060', '#a07450', '#7a5a44'], g, H, W, 6);
      return {};
    },
    frame: function (c, G, t, st, u) {
      var y = Math.round(G.H * 0.85), step = Math.floor(t * 3) % 2;
      for (var i = 0; i < 4; i++) {
        var x = Math.round(((t * 5 + i * 17) % (G.W + 80)) - 40);
        camel(u, c, x, y, (step + i) % 2, '#4a3030');
        if (i === 0) { u.px(c, x + 3, y - 7, 2, 4, '#7a2e3a'); u.px(c, x + 3, y - 8, 2, 1, '#e8d8c0'); }
      }
    }
  });

  /* ================= 4) İSTANBUL'UN FETHİ (1300 – 1499) ================= */
  S.register('fetih', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G);
      u.bands(c, ['#3a2a5a', '#8a3a5e', '#e0604a', '#ffb05a'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), g - 24, 15, ['#ff7a4e', '#ffb460', '#ffe6a0']);
      // sur arkasında kubbe ve şehir
      u.profile(c, 0, W * 0.3, function (x) { return g - 26 - 4 * Math.sin(x / 9); }, g, '#5a3a5a');
      u.halfDisc(c, Math.round(W * 0.14), g - 34, 14, '#5a3a5a'); u.halfDisc(c, Math.round(W * 0.1), g - 30, 6, '#5a3a5a'); u.halfDisc(c, Math.round(W * 0.18), g - 30, 6, '#5a3a5a');
      // Theodosius surları (çift sıra)
      var x1 = Math.round(W * 0.27), wt = g - Math.round(H * 0.15);
      u.px(c, 0, wt + 8, x1 + 8, g - wt - 6, '#7a6a7e'); for (var x = 0; x < x1 + 8; x += 4) u.px(c, x, wt + 5, 2, 3, '#7a6a7e');
      u.px(c, 0, wt, x1, g - wt + 2, '#9a8a96'); u.px(c, 0, wt, x1, 1, '#c8b8c0');
      for (x = 0; x < x1; x += 4) if ((x * 7) % 9 !== 0) u.px(c, x, wt - 3, 2, 3, '#9a8a96');
      for (x = 6; x < x1; x += 24) {
        var th = Math.round(H * 0.08);
        u.px(c, x, wt - th, 12, g - wt + th, '#8a7a88'); u.px(c, x, wt - th, 12, 1, '#c8b8c0');
        for (var k = 0; k < 12; k += 4) u.px(c, x + k, wt - th - 3, 2, 3, '#8a7a88');
        u.px(c, x + 5, wt - th + 6, 2, 4, '#3a2a3a');
      }
      for (var b = 0; b < x1; b += 3) u.px(c, b, wt + 10 + (b % 7), 1, 1, '#6a5a70');
      u.bands(c, ['#8a5e4a', '#6a4a40', '#4e3638'], g, H, W, 6);
      // Osmanlı ordugâhı (sağ)
      var tents = [0.84, 0.9, 0.955, 0.995];
      tents.forEach(function (f, i) {
        var tx = Math.round(W * f), tb = g + 4, tw = i === 2 ? 15 : 11, thh = i === 2 ? 20 : 14;
        u.poly(c, [[tx - tw, tb], [tx, tb - thh], [tx + tw, tb]], '#f0e6d8');
        for (var s = -tw + 2; s < tw; s += 5) u.poly(c, [[tx + s, tb], [tx, tb - thh], [tx + s + 2, tb]], '#c8282f');
        u.px(c, tx - 2, tb - 6, 4, 6, '#3a2020'); u.px(c, tx, tb - thh - 6, 1, 6, '#5a3a2a');
      });
      // Şahi topu
      var cx = Math.round(W * 0.86), cy = g + 22;
      u.px(c, cx - 2, cy - 6, 26, 6, '#3a3a42'); u.px(c, cx - 2, cy - 6, 26, 1, '#6a6a76'); u.px(c, cx - 6, cy - 7, 5, 8, '#2a2a32');
      u.circle(c, cx + 14, cy + 2, 5, '#5a3a2a'); u.circle(c, cx + 14, cy + 2, 2, '#8a5a3a');
      return { cannon: [cx - 7, cy - 4] };
    },
    frame: function (c, G, t, st, u) {
      var ph = Math.floor(t * 2.5) % 2, g = gy(G);
      [0.84, 0.9, 0.955, 0.995].forEach(function (f, i) {
        var tx = Math.round(G.W * f), thh = i === 2 ? 20 : 14;
        crescentFlag(u, c, tx + 1, g + 4 - thh - 6, i === 2 ? 10 : 8, (ph + i) % 2);
      });
      var cyc = (t % 6) / 6;
      if (cyc < 0.45) u.smoke(c, st.cannon[0] - 4, st.cannon[1], cyc * 4, 'rgba(220,210,220,.85)', 1.4);
      if (cyc < 0.06) u.circle(c, st.cannon[0] - 3, st.cannon[1], 3, '#ffd27a');
      for (var e = 0; e < 8; e++) { var ex = (e * 53 + Math.floor(t * 20)) % G.W, ey = Math.round(G.H * 0.2 + ((e * 37 + t * 15) % (G.H * 0.4))); if (ex < G.W * 0.3 || ex > G.W * 0.7) u.px(c, ex, G.H * 0.7 - (ey - G.H * 0.2), 1, 1, 'rgba(255,190,110,.7)'); }
    }
  });

  /* ================= 5) KEŞİFLER ÇAĞI (1500 – 1799) ================= */
  S.register('kesif', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, hz = Math.round(H * 0.62);
      u.bands(c, ['#2e3c7a', '#5a5a9a', '#e08a7a', '#ffcf8a'], 0, hz, W, 11);
      // portolan çizgileri + pusula gülü
      var cx = Math.round(W * 0.12), cy = Math.round(H * 0.2);
      for (var a = 0; a < 360; a += 22.5) {
        var t = a * Math.PI / 180;
        for (var r = 16; r < W; r += 3) { var x = cx + Math.round(Math.sin(t) * r), y = cy - Math.round(Math.cos(t) * r); if (x < 0 || x >= W || y < 0 || y >= hz) break; u.px(c, x, y, 1, 1, 'rgba(255,240,210,.18)'); }
      }
      u.ring(c, cx, cy, 14, 2, 'rgba(255,240,210,.5)');
      [0, 90, 180, 270].forEach(function (d) { var tt = d * Math.PI / 180; u.poly(c, [[cx, cy], [cx + Math.sin(tt - 0.3) * 4, cy - Math.cos(tt - 0.3) * 4], [cx + Math.sin(tt) * 13, cy - Math.cos(tt) * 13], [cx + Math.sin(tt + 0.3) * 4, cy - Math.cos(tt + 0.3) * 4]], 'rgba(255,240,210,.6)'); });
      u.sun(c, Math.round(W * 0.55), hz - 10, 16, ['#ff9a6e', '#ffc884', '#fff0c0'], hz);
      // sağ kayalık + fener
      u.profile(c, W * 0.8, W, function (x) { return hz - 10 - (x - W * 0.8) * 0.35 - 4 * Math.sin(x / 5); }, hz + 6, '#4a3e5a', '#6e5e7e');
      var lx = Math.round(W * 0.92), lb = Math.round(hz - 10 - (W * 0.12) * 0.35) + 2, lh = Math.round(H * 0.24);
      for (var i = 0; i < lh; i++) { var w = 4 + Math.round((i / lh) * 3); u.px(c, lx - w, lb - lh + i, w * 2, 1, (Math.floor(i / 6) % 2) ? '#c8282f' : '#f3ece2'); }
      u.px(c, lx - 5, lb - lh - 6, 10, 6, '#3a2a40'); u.px(c, lx - 3, lb - lh - 5, 6, 4, '#ffe08a'); u.poly(c, [[lx - 6, lb - lh - 6], [lx, lb - lh - 11], [lx + 6, lb - lh - 6]], '#3a2a40');
      u.bands(c, ['#e09a90', '#7a7ab0', '#3e4a86', '#25306a'], hz, H, W, 8);
      u.px(c, 0, hz, W, 1, 'rgba(255,240,220,.6)');
      return { hz: hz, lamp: [lx, lb - lh - 3], clouds: u.makeClouds(u.rng(9), 4, W, H, 0.05, 0.3) };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W, H = G.H, hz = st.hz;
      u.drawClouds(c, st.clouds, t, W, ['#8a6a9a', '#c88aa0', '#f0b0b0', '#ffe0d6']);
      // fener ışını
      var a = (t * 0.8) % (Math.PI * 2), dir = Math.cos(a);
      if (dir < 0) for (var k = 6; k < 60; k++) u.px(c, st.lamp[0] + Math.round(dir * k), st.lamp[1] + Math.round(Math.sin(a) * k * 0.08), 1, 2, 'rgba(255,230,150,' + (0.45 - k * 0.006).toFixed(2) + ')');
      for (var i = 0; i < 50; i++) { var wx = (i * 97 + Math.floor(t * 5) * (i % 3 + 1)) % W, wy = hz + 3 + ((i * 41) % (H - hz - 4)); u.px(c, wx, wy, 3, 1, 'rgba(255,240,230,.35)'); }
      // kalyon (sol, salınım)
      var gx = Math.round(W * 0.03), gyy = Math.round(H * 0.8) + Math.round(Math.sin(t * 1.4) * 1.5);
      u.poly(c, [[gx, gyy - 8], [gx + 52, gyy - 8], [gx + 46, gyy], [gx + 6, gyy]], '#6a3b2a');
      u.px(c, gx, gyy - 14, 12, 6, '#7a4a32'); u.px(c, gx + 1, gyy - 6, 50, 1, '#a8683f');
      for (var p = 0; p < 6; p++) u.px(c, gx + 14 + p * 6, gyy - 6, 2, 2, '#2a1a1a');
      [[18, 34], [30, 40], [42, 30]].forEach(function (m) {
        var mx = gx + m[0], top = gyy - 8 - m[1];
        u.px(c, mx, top, 1, m[1], '#4a2a1a');
        u.px(c, mx - 6, top + 4, 13, 9, '#f3e6c8'); u.px(c, mx - 5, top + 15, 11, 8, '#f3e6c8'); u.px(c, mx - 6, top + 12, 13, 1, '#cdbfa8');
        crescentFlag(u, c, mx, top - 4, 6, Math.floor(t * 2) % 2);
      });
      u.birds(c, t, W, H, 3, '#fff4e8', 0.25);
    }
  });

  /* ================= 6) SANAYİ DEVRİMİ (1800 – 1899) ================= */
  S.register('sanayi', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(29);
      u.bands(c, ['#4a3e5a', '#7a5e6e', '#c08a6a', '#e8b880'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), Math.round(H * 0.2), 13, ['#e8885a', '#f0b070', '#ffe0a0']);
      // uzak şehir
      for (var x = 0; x < W; x += 6 + Math.floor(R() * 6)) { var hh = 8 + Math.floor(R() * 14); u.px(c, x, g - 30 - hh, 6, hh + 30, '#7a6070'); }
      // viyadük
      var deck = Math.round(H * 0.5);
      u.px(c, 0, deck, W, 4, '#8a5a4a'); u.px(c, 0, deck, W, 1, '#b07a5a');
      for (x = 0; x < W; x += 22) { u.px(c, x, deck + 4, 5, g - deck, '#8a5a4a'); for (var y = 0; y < 8; y++) { var hw = Math.round(Math.sqrt(64 - y * y)); u.px(c, x + 5, deck + 4 + y, 17 - hw * 2 > 0 ? 0 : 0, 1, '#8a5a4a'); } u.halfDisc(c, x + 13, deck + 12, 8, '#8a5a4a'); u.halfDisc(c, x + 13, deck + 13, 6, '#c08a6a'); }
      // fabrikalar (sol)
      var fx = 0, fw = Math.round(W * 0.27), ft = g - Math.round(H * 0.12);
      u.px(c, fx, ft, fw, g - ft + 2, '#7a3e34');
      for (x = fx; x < fw; x += 12) u.poly(c, [[x, ft], [x + 12, ft - 8], [x + 12, ft]], '#6a342c');
      windows(u, c, fx + 3, ft + 4, fw - 6, g - ft - 6, R, 0.4, ['#ffd27a', '#ffb054']);
      var chim = [];
      [0.05, 0.13, 0.21].forEach(function (f, i) { var cx = Math.round(W * f), ch = Math.round(H * (0.28 + i * 0.04)); u.px(c, cx, g - ch, 6, ch, '#8a4a3a'); u.px(c, cx - 1, g - ch, 8, 2, '#5a2e28'); for (var k = g - ch + 6; k < g; k += 8) u.px(c, cx, k, 6, 1, '#6a3a30'); chim.push([cx + 3, g - ch - 2]); });
      // sağda dev dişli + atölye
      u.px(c, Math.round(W * 0.78), g - Math.round(H * 0.1), Math.round(W * 0.22), Math.round(H * 0.1) + 2, '#6a4a4a');
      u.bands(c, ['#6a5450', '#544040', '#3e3034'], g, H, W, 5);
      for (x = 0; x < W; x += 4) u.px(c, x, g + 3 + ((x / 4) % 2) * 2, 2, 1, 'rgba(0,0,0,.2)');
      return { chim: chim, deck: deck, gear: [Math.round(W * 0.9), Math.round(H * 0.22)] };
    },
    frame: function (c, G, t, st, u) {
      st.chim.forEach(function (p, i) { u.smoke(c, p[0], p[1], t + i * 0.7, 'rgba(110,96,110,.85)', 1.3); });
      // dönen dişli
      var gx = st.gear[0], gy0 = st.gear[1], a0 = t * 0.6;
      u.ring(c, gx, gy0, 12, 4, 'rgba(255,236,210,.35)');
      for (var k = 0; k < 10; k++) { var a = a0 + k * Math.PI / 5; u.px(c, gx + Math.round(Math.cos(a) * 14) - 1, gy0 + Math.round(Math.sin(a) * 14) - 1, 3, 3, 'rgba(255,236,210,.35)'); }
      u.ring(c, gx, gy0, 4, 2, 'rgba(255,236,210,.35)');
      // tren
      var tx = Math.round((t * 14) % (G.W + 140)) - 70, ty = st.deck - 1;
      u.px(c, tx, ty - 7, 16, 7, '#2a2a32'); u.px(c, tx + 10, ty - 12, 6, 5, '#2a2a32'); u.px(c, tx + 2, ty - 11, 3, 4, '#2a2a32'); u.px(c, tx + 11, ty - 11, 3, 2, '#ffd27a');
      for (var w = 0; w < 3; w++) u.circle(c, tx + 3 + w * 5, ty - 1, 2, '#a8282f');
      for (var v = 1; v <= 3; v++) { var vx = tx - v * 18; u.px(c, vx, ty - 8, 16, 7, v % 2 ? '#6a2a30' : '#3e5a6a'); u.px(c, vx + 2, ty - 6, 12, 2, '#ffd27a'); u.circle(c, vx + 3, ty - 1, 1, '#2a2a32'); u.circle(c, vx + 12, ty - 1, 1, '#2a2a32'); }
      u.smoke(c, tx + 3, ty - 13, t * 1.6, 'rgba(230,220,230,.85)', 1);
    }
  });

  /* ================= 7) CUMHURİYET — TBMM (1900 – 1949) ================= */
  S.register('cumhuriyet', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(41);
      u.bands(c, ['#3a3e86', '#6a5aa0', '#e88a8a', '#ffd08a'], 0, g, W, 11);
      u.stars(c, R, 25, W, Math.round(H * 0.2), 'rgba(255,244,220,.6)');
      // hilal
      var mx = Math.round(W * 0.2), my = Math.round(H * 0.13);
      u.circle(c, mx, my, 7, '#fff4d8'); u.circle(c, mx + 3, my - 1, 6, u.ramp(['#3a3e86', '#6a5aa0'], 3)[1]);
      // bozkır tepeleri + uzakta Ankara Kalesi
      u.profile(c, 0, W, function (x) { return g - 12 - 10 * Math.sin(x / 47 + 2) - 3 * Math.sin(x / 11); }, g, '#9a7a8a', '#b8949e');
      var kx = Math.round(W * 0.86), kb = Math.round(g - 22 - 10 * Math.sin(kx / 47 + 2));
      u.px(c, kx - 18, kb - 10, 36, 12, '#7a5a6e'); for (var k = -18; k < 18; k += 6) u.px(c, kx + k, kb - 14, 4, 4, '#7a5a6e'); u.px(c, kx - 4, kb - 18, 8, 8, '#7a5a6e');
      // ilk TBMM binası (sol)
      var bx = 4, bw = Math.round(W * 0.2), bt = g - Math.round(H * 0.17);
      u.px(c, bx, bt, bw, g - bt + 2, '#dcb88e'); u.px(c, bx, bt, bw, 1, '#f0d4aa');
      u.px(c, bx, bt + Math.round((g - bt) / 2), bw, 2, '#b89470');
      u.poly(c, [[bx - 3, bt], [bx + 6, bt - 9], [bx + bw - 6, bt - 9], [bx + bw + 3, bt]], '#a8483a');
      u.px(c, bx + 6, bt - 9, bw - 12, 1, '#c8604a');
      var rows = [bt + 4, bt + Math.round((g - bt) / 2) + 4];
      rows.forEach(function (ry) { for (var i = 0; i < 6; i++) { var wx = bx + 4 + i * Math.round((bw - 8) / 6); u.px(c, wx, ry, 4, 7, '#4a3a5a'); u.px(c, wx + 1, ry - 1, 2, 1, '#4a3a5a'); u.px(c, wx, ry + 7, 4, 1, '#f0d4aa'); } });
      var dx = bx + Math.round(bw / 2) - 4;
      u.px(c, dx - 3, bt - 2, 14, g - bt + 4, '#e8c49a'); u.poly(c, [[dx - 4, bt - 2], [dx + 4, bt - 8], [dx + 12, bt - 2]], '#a8483a');
      u.px(c, dx, g - 12, 8, 14, '#5a3a2a'); u.px(c, dx - 4, g, 16, 2, '#b89470');
      u.px(c, dx + 4, bt - 24, 1, 16, '#3a2a2a');
      // sağda bayrak direkleri
      [0.74, 0.8, 0.95].forEach(function (f) { var x = Math.round(W * f); u.px(c, x, g - 40, 1, 42, '#e8e0d0'); u.px(c, x - 1, g - 41, 3, 1, '#ffd27a'); });
      u.bands(c, ['#c8a070', '#a8845c', '#86684c'], g, H, W, 6);
      return { pole: [dx + 5, bt - 24], poles: [0.74, 0.8, 0.95].map(function (f) { return [Math.round(W * f) + 1, g - 40]; }) };
    },
    frame: function (c, G, t, st, u) {
      var ph = Math.floor(t * 2.5) % 2;
      u.flag(c, st.pole[0], st.pole[1], 12, ph);
      st.poles.forEach(function (p, i) { u.flag(c, p[0], p[1], 14, (ph + i) % 2); });
      // süsleme bayrakları (ip)
      var y0 = Math.round(G.H * 0.55);
      for (var x = Math.round(G.W * 0.74); x < G.W * 0.95; x += 4) { var y = y0 + Math.round(Math.sin((x - G.W * 0.74) / (G.W * 0.21) * Math.PI) * 6); u.px(c, x, y, 1, 1, '#e8e0d0'); u.poly(c, [[x, y + 1], [x + 3, y + 1], [x + 1.5, y + 4]], (x / 4) % 2 ? '#c8282f' : '#f6efe0'); }
      // havai fişek
      for (var f = 0; f < 3; f++) {
        var cyc = ((t + f * 1.3) % 4) / 4, fx = Math.round(G.W * (0.78 + f * 0.08)), fy = Math.round(G.H * (0.12 + f * 0.05));
        if (cyc < 0.6) { var r = Math.round(cyc * 18); for (var a = 0; a < 12; a++) { var an = a * Math.PI / 6; u.px(c, fx + Math.round(Math.cos(an) * r), fy + Math.round(Math.sin(an) * r), 1, 1, f % 2 ? '#ff6b6b' : '#ffe08a'); } }
      }
    }
  });

  /* ================= 8) UZAY YARIŞI (1950 – 1989) ================= */
  S.register('uzay', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(53);
      u.bands(c, ['#22245e', '#3a2c7a', '#7a3a8e', '#c86a8e'], 0, g, W, 11);
      u.stars(c, R, 120, W, Math.round(H * 0.55), '#fff4dc');
      // Ay
      var mx = Math.round(W * 0.88), my = Math.round(H * 0.17);
      u.circle(c, mx, my, 15, '#e8e0d0'); u.circle(c, mx - 4, my - 3, 3, '#c8c0b4'); u.circle(c, mx + 5, my + 4, 4, '#c8c0b4'); u.circle(c, mx + 6, my - 6, 2, '#c8c0b4');
      u.px(c, mx - 2, my - 22, 1, 8, '#e8e0d0'); u.px(c, mx - 1, my - 22, 5, 3, '#5fa8ff');
      u.profile(c, 0, W, function (x) { return g - 8 - 5 * Math.sin(x / 31); }, g, '#4a3a6a', '#6a5a8a');
      // fırlatma kulesi (sol)
      var tx = Math.round(W * 0.12), tb = g + 2, th = Math.round(H * 0.42);
      u.px(c, tx - 14, tb - th, 6, th, '#7a3e3e'); for (var y = tb - th; y < tb; y += 6) { u.px(c, tx - 14, y, 6, 1, '#a85a4a'); u.px(c, tx - 8, y + 2, 6, 1, '#7a3e3e'); }
      u.px(c, tx - 20, tb - 3, 40, 3, '#5a4a6a');
      // radar çanağı + kule (sağ)
      var rx = Math.round(W * 0.78), rb = g + 2;
      u.px(c, rx - 1, rb - 18, 3, 18, '#c8c0d0'); u.poly(c, [[rx - 14, rb - 30], [rx + 2, rb - 14], [rx + 6, rb - 18], [rx - 8, rb - 36]], '#e8e0e8'); u.px(c, rx - 4, rb - 28, 2, 2, '#5a4a6a');
      var ax = Math.round(W * 0.95); u.px(c, ax, rb - 50, 2, 50, '#c8c0d0'); for (var k = rb - 48; k < rb; k += 8) u.px(c, ax - 3, k, 8, 1, '#c8c0d0');
      u.px(c, Math.round(W * 0.84), rb - 10, 16, 10, '#5a4a6a'); u.px(c, Math.round(W * 0.84) + 3, rb - 7, 3, 3, '#ffd27a');
      u.bands(c, ['#5a4a6a', '#443858', '#2e2846'], g, H, W, 5);
      return { pad: [tx, tb - 3], ant: [ax, rb - 51] };
    },
    frame: function (c, G, t, st, u) {
      var cyc = (t % 14) / 14, lift = cyc < 0.3 ? 0 : Math.pow((cyc - 0.3) / 0.7, 2) * (G.H * 0.9);
      var x = st.pad[0], base = st.pad[1] - Math.round(lift), h = 34;
      // roket
      u.px(c, x - 3, base - h, 6, h, '#f3ece2'); u.px(c, x + 2, base - h, 1, h, '#c8c0c8');
      u.px(c, x - 3, base - h + 8, 6, 2, '#2a2a32'); u.px(c, x - 3, base - h + 20, 6, 2, '#2a2a32');
      u.poly(c, [[x - 3, base - h], [x, base - h - 7], [x + 3, base - h]], '#f3ece2');
      u.poly(c, [[x - 3, base - 6], [x - 7, base], [x - 3, base]], '#a8282f'); u.poly(c, [[x + 3, base - 6], [x + 7, base], [x + 3, base]], '#a8282f');
      if (cyc > 0.22) {
        var fl = 4 + Math.floor((t * 12) % 3) * 2;
        u.poly(c, [[x - 3, base], [x, base + fl + 4], [x + 3, base]], '#ffd27a'); u.poly(c, [[x - 2, base], [x, base + fl], [x + 2, base]], '#fff4dc');
        for (var s = 0; s < 6; s++) u.circle(c, x + (s - 2.5) * 6, st.pad[1] - 2 - (s % 2) * 3, 4 + (s % 3), 'rgba(220,210,230,.8)');
      }
      if (Math.floor(t * 2) % 2) u.px(c, st.ant[0], st.ant[1], 2, 2, '#ff5d5d');
    }
  });

  /* ================= 9) DİJİTAL ÇAĞ (1990 – 2009) ================= */
  S.register('dijital', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, hz = Math.round(H * 0.6);
      u.bands(c, ['#2a1e6a', '#6a2a8a', '#d0488a', '#ff9a6a'], 0, hz, W, 11);
      // çizgili güneş
      var sx = Math.round(W * 0.5), sy = hz - 20, R0 = 26;
      for (var y = -R0; y <= 0; y++) { if (y > -16 && (y % 4 === 0 || y % 4 === -1)) continue; var hw = Math.floor(Math.sqrt(R0 * R0 - y * y)); u.px(c, sx - hw, sy + y, hw * 2 + 1, 1, u.mix('#ffe08a', '#ff5a8a', (y + R0) / R0)); }
      // tel kafes dağlar
      [[0, 0.22], [0.78, 1]].forEach(function (span) {
        for (var x = Math.round(W * span[0]); x < W * span[1]; x++) { var h = Math.round(22 + 14 * Math.abs(Math.sin(x / 13)) + 6 * Math.sin(x / 5)); u.px(c, x, hz - h, 1, 1, '#4fe0ff'); u.px(c, x, hz - h + 1, 1, h - 1, 'rgba(30,20,64,.85)'); if (x % 6 === 0) u.px(c, x, hz - h, 1, h, 'rgba(79,224,255,.25)'); }
      });
      u.px(c, 0, hz, W, H - hz, '#1e1440');
      // CRT bilgisayar (sol)
      var cx = Math.round(W * 0.03), cb = Math.round(H * 0.92);
      u.px(c, cx, cb - 30, 36, 28, '#d8d0c0'); u.px(c, cx + 3, cb - 27, 30, 20, '#2a4a9a'); u.px(c, cx + 3, cb - 27, 30, 1, '#5a7ad0');
      u.px(c, cx + 10, cb - 2, 16, 3, '#c8c0b0'); u.px(c, cx + 38, cb - 34, 12, 34, '#d0c8b8'); u.px(c, cx + 40, cb - 30, 8, 2, '#5a5a5a'); u.px(c, cx + 40, cb - 25, 8, 1, '#5a5a5a');
      for (var l = 0; l < 3; l++) u.px(c, cx + 6, cb - 23 + l * 4, 10 + l * 4, 1, '#9fd0ff');
      // uydu çanağı + sunucu (sağ)
      var dx = Math.round(W * 0.84), db = Math.round(H * 0.92);
      u.px(c, dx, db - 40, 18, 40, '#3a3a52'); for (var r = db - 36; r < db - 2; r += 5) u.px(c, dx + 2, r, 14, 3, '#2a2a3e');
      u.poly(c, [[dx + 24, db - 30], [dx + 44, db - 46], [dx + 48, db - 40], [dx + 30, db - 24]], '#e8e0e8'); u.px(c, dx + 34, db - 30, 2, 30, '#c8c0d0');
      return { hz: hz, crt: [cx + 6 + 22, cb - 15], leds: [dx + 4, db - 36] };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W, H = G.H, hz = st.hz, vx = W / 2;
      for (var i = -14; i <= 14; i++) { var bx = vx + i * W / 10; for (var y = hz; y < H; y += 1) { var f = (y - hz) / (H - hz); u.px(c, Math.round(vx + (bx - vx) * f), y, 1, 1, 'rgba(255,80,200,.55)'); } }
      var off = (t * 0.5) % 1;
      for (var k = 0; k < 12; k++) { var f2 = Math.pow((k + off) / 12, 2), yy = Math.round(hz + f2 * (H - hz)); u.px(c, 0, yy, W, 1, 'rgba(79,224,255,' + (0.25 + f2 * 0.5).toFixed(2) + ')'); }
      if (Math.floor(t * 2) % 2) u.px(c, st.crt[0], st.crt[1], 3, 1, '#ffffff');
      for (var l = 0; l < 7; l++) u.px(c, st.leds[0] + (l % 3) * 4, st.leds[1] + Math.floor(l / 3) * 5, 1, 1, ((Math.floor(t * 6) + l * 3) % 4) ? '#5fd068' : '#ffd27a');
    }
  });

  /* ================= 10) METROPOL (2010 sonrası) ================= */
  S.register('metropol', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = Math.round(H * 0.82), R = u.rng(61);
      u.bands(c, ['#2a3a86', '#4e3e96', '#a65096', '#ff9a86'], 0, g, W, 11);
      u.stars(c, R, 30, W, Math.round(H * 0.2), 'rgba(255,244,220,.6)');
      // arka sıra (açık)
      for (var x = 0; x < W; x += 5 + Math.floor(R() * 6)) { var h = Math.round(H * (0.12 + R() * 0.18)); u.px(c, x, g - h, 6, h, '#6a5a9e'); }
      function tower(x, w, h, col, spire) {
        u.px(c, x, g - h, w, h, col); u.px(c, x, g - h, 1, h, u.mix(col, '#ffffff', 0.25));
        windows(u, c, x + 1, g - h + 3, w - 2, h - 4, R, 0.45, ['#ffd27a', '#9fd0ff', '#ffe8b0']);
        if (spire) { u.px(c, x + Math.floor(w / 2), g - h - spire, 1, spire, col); }
      }
      // sol kuleler
      tower(2, 14, Math.round(H * 0.45), '#2e2a5e', 0);
      tower(18, 10, Math.round(H * 0.34), '#3a3270', 0);
      tower(30, 16, Math.round(H * 0.58), '#26244e', 18);
      tower(48, 11, Math.round(H * 0.3), '#3a3270', 0);
      tower(61, 14, Math.round(H * 0.4), '#2e2a5e', 0);
      // sağ kuleler (eğik çatılı)
      var rx = Math.round(W * 0.8);
      tower(rx, 13, Math.round(H * 0.36), '#2e2a5e', 0);
      tower(rx + 15, 18, Math.round(H * 0.55), '#26244e', 0); u.poly(c, [[rx + 15, g - Math.round(H * 0.55)], [rx + 33, g - Math.round(H * 0.55) - 12], [rx + 33, g - Math.round(H * 0.55)]], '#26244e');
      tower(rx + 35, 12, Math.round(H * 0.42), '#3a3270', 10);
      tower(rx + 49, 16, Math.round(H * 0.32), '#2e2a5e', 0);
      // LED reklam panosu
      u.px(c, rx + 2, g - Math.round(H * 0.3), 10, 7, '#5fd0ff');
      u.bands(c, ['#2a2450', '#1e1a3e'], g, H, W, 3);
      for (x = 0; x < W; x += 8) u.px(c, x, g + 4, 4, 1, '#ffd27a');
      return { spire: [37, g - Math.round(H * 0.58) - 18], ad: [rx + 2, g - Math.round(H * 0.3)] };
    },
    frame: function (c, G, t, st, u) {
      if (Math.floor(t * 1.5) % 2) u.px(c, st.spire[0], st.spire[1] - 1, 1, 2, '#ff5d5d');
      var ad = ['#5fd0ff', '#ff6bd0', '#ffd27a'][Math.floor(t / 2) % 3];
      u.px(c, st.ad[0], st.ad[1], 10, 7, ad); u.px(c, st.ad[0] + 2, st.ad[1] + 3, 6, 1, '#1e1a3e');
      for (var d = 0; d < 5; d++) {
        var x = Math.round(((t * (6 + d * 2) + d * 90) % (G.W + 40)) - 20), y = Math.round(G.H * (0.15 + d * 0.06) + Math.sin(t * 2 + d) * 3);
        u.px(c, x - 3, y, 7, 1, '#c8c0d8'); u.px(c, x - 1, y + 1, 3, 1, '#5a5478');
        if (Math.floor(t * 4 + d) % 2) u.px(c, x, y - 1, 1, 1, d % 2 ? '#5fd068' : '#ff5d5d');
      }
      var px0 = Math.round((t * 10) % (G.W + 60)) - 30;
      u.px(c, px0, Math.round(G.H * 0.08), 4, 1, '#e8e0f0'); if (Math.floor(t * 3) % 2) u.px(c, px0 + 4, Math.round(G.H * 0.08), 1, 1, '#ff5d5d');
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
