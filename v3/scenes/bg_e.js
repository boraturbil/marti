/* PUSULLA — arkaplan paketi E (scenes/bg_e.js). Sahneler: eyfel, canakkale, ikinci_dunya, bm_newyork, ay_inisi, tokyo_80.
 * META eyfel {"min":1889,"max":1913,"label":"BELLE ÉPOQUE PARİS","road":["#76706a","#96908a","#4c4844"]}
 * META canakkale {"min":1914,"max":1918,"label":"ÇANAKKALE 1915","road":["#8a7a5e","#aa9a7c","#5a4e3c"]}
 * META ikinci_dunya {"min":1939,"max":1945,"label":"II. DÜNYA SAVAŞI","road":["#3e4048","#5e6068","#24262c"]}
 * META bm_newyork {"min":1946,"max":1956,"label":"SAVAŞ SONRASI NEW YORK","road":["#56585e","#76787e","#36383c"]}
 * META ay_inisi {"min":1969,"max":1975,"label":"AY'A İNİŞ","road":["#7a7a80","#9a9aa0","#4e4e54"]}
 * META tokyo_80 {"min":1976,"max":1984,"label":"TOKYO 80'LER","road":["#2e2a44","#e05aa8","#1a1828"]}
 * Kurallar: ES5, dış bağımlılık yok, global yok, yalnız S.register. */
(function (global) {
  'use strict';
  var S = global.PUSULLA && global.PUSULLA.scene;
  if (!S || !S.register) return;

  function gy(G) { return Math.round(G.H * 0.7); }
  function xl(G, f) { return Math.round(G.W * (0.10 + 0.20 * f)); }
  function xr(G, f) { return Math.round(G.W * (0.70 + 0.20 * f)); }
  function sz(G, k) { return Math.max(3, Math.round(Math.min(G.W * 0.45, G.H) * k)); }

  /* ---------- yerel yardımcılar ---------- */
  // Eyfel ve Tokyo Kulesi için ortak kafes kule bölümü
  function lattice(u, c, cx, yTop, yBot, wTop, wBot, col, hi, step) {
    var h = Math.max(2, yBot - yTop);
    step = Math.max(3, step || 5);
    for (var y = yTop; y <= yBot; y++) {
      var f = (y - yTop) / h;
      var hw = Math.max(1, Math.round(wTop + (wBot - wTop) * f));
      var leg = Math.max(1, Math.round(1 + hw * 0.16));
      u.px(c, cx - hw, y, leg, 1, hi || col);
      u.px(c, cx + hw - leg + 1, y, leg, 1, col);
      if ((y - yTop) % step === 0) {
        u.px(c, cx - hw, y, hw * 2 + 1, 1, col);
      } else {
        var ph = ((y - yTop) % step) / step;
        var dx = Math.round((hw - leg) * (2 * ph - 1));
        u.px(c, cx + dx, y, 1, 1, col);
        u.px(c, cx - dx, y, 1, 1, col);
      }
    }
  }

  function mansard(u, c, x, base, w, h, wall, shade, roof, R) {
    u.px(c, x, base - h, w, h, wall);
    u.px(c, x + Math.max(1, w - 3), base - h, Math.min(3, w), h, shade);
    u.px(c, x, base - h, w, 1, '#f4ecdc');
    var rh = Math.max(3, Math.round(h * 0.22));
    u.poly(c, [[x - 1, base - h], [x + 2, base - h - rh], [x + w - 2, base - h - rh], [x + w + 1, base - h]], roof);
    for (var wy = base - h + 4; wy < base - 4; wy += 5) {
      for (var wx = x + 2; wx < x + w - 3; wx += 4) {
        u.px(c, wx, wy, 2, 3, R() < 0.35 ? '#f8d080' : '#4a4654');
      }
    }
  }

  function skyline(u, c, x0, x1, g, col, hi, R, minH, maxH) {
    for (var x = x0; x < x1; ) {
      var w = 5 + Math.floor(R() * 7);
      var h = minH + Math.floor(R() * (maxH - minH));
      u.px(c, x, g - h, w, h, col);
      if (hi) u.px(c, x, g - h, w, 1, hi);
      x += w + 1;
    }
  }

  /* ================= 1) EYFEL — Belle Époque Paris (1889–1913) ================= */
  S.register('eyfel', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(501);
      u.bands(c, ['#4a3a6a', '#b87a9a', '#f8c090'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), g - sz(G, 0.22), sz(G, 0.055), ['#f89870', '#f8c090', '#fff0c8'], g);
      u.profile(c, 0, W, function (x) { return g - 10 - 5 * Math.sin(x / 31) - 3 * Math.sin(x / 11); }, g, '#7a5a7a', '#9a7a9a');

      // Sol: Eyfel Kulesi (%10-%30)
      var ex = xl(G, 0.45), eh = sz(G, 0.54), bw = sz(G, 0.13);
      var y0 = g + 2, y1 = y0 - Math.round(eh * 0.32), y2 = y0 - Math.round(eh * 0.62), y3 = y0 - Math.round(eh * 0.92);
      lattice(u, c, ex, y1, y0, Math.round(bw * 0.56), bw, '#6a442c', '#9e6c48', 5);
      // Taban kemeri
      u.px(c, ex - Math.round(bw * 0.36), y0 - 4, Math.round(bw * 0.72), 5, '#b87a9a');
      u.halfDisc(c, ex, y0 - 2, Math.max(3, Math.round(bw * 0.34)), '#d89a94');
      // 1. ve 2. kat platformları
      u.px(c, ex - Math.round(bw * 0.62), y1 - 2, Math.round(bw * 1.24), 3, '#543422');
      u.px(c, ex - Math.round(bw * 0.62), y1 - 2, Math.round(bw * 1.24), 1, '#b8845a');
      lattice(u, c, ex, y2, y1 - 2, Math.round(bw * 0.28), Math.round(bw * 0.52), '#7a4e32', '#ab7850', 4);
      u.px(c, ex - Math.round(bw * 0.34), y2 - 2, Math.round(bw * 0.68), 3, '#543422');
      u.px(c, ex - Math.round(bw * 0.34), y2 - 2, Math.round(bw * 0.68), 1, '#b8845a');
      lattice(u, c, ex, y3, y2 - 2, 2, Math.round(bw * 0.24), '#8a5a3a', '#ba8a60', 4);
      // Tepe ve anten
      u.px(c, ex - 2, y3 - 4, 5, 4, '#6a442c');
      u.px(c, ex, y3 - Math.max(5, Math.round(eh * 0.09)), 1, Math.max(5, Math.round(eh * 0.09)), '#b8845a');

      // Sağ: Haussmann binaları + Art Nouveau metro girişi
      var b1 = xr(G, 0.22), b2 = xr(G, 0.65), bw1 = sz(G, 0.13), bw2 = sz(G, 0.14);
      mansard(u, c, b1, g + 2, bw1, sz(G, 0.28), '#e8dcc8', '#c4b49e', '#4a5060', R);
      mansard(u, c, b2, g + 2, bw2, sz(G, 0.34), '#e2d4be', '#bcac96', '#3e4454', R);
      var mx = xr(G, 0.10), mw = Math.max(10, sz(G, 0.08));
      u.px(c, mx, g - 9, 2, 11, '#2a4a3a'); u.px(c, mx + mw, g - 9, 2, 11, '#2a4a3a');
      u.px(c, mx - 1, g - 11, mw + 4, 2, '#3a6a50');
      u.px(c, mx + 1, g - 13, 2, 2, '#f8c860'); u.px(c, mx + mw - 1, g - 13, 2, 2, '#f8c860');

      // Zemin (Seine kıyısı + taş döşeme)
      u.bands(c, ['#7a7068', '#5e5650', '#46403c'], g, H, W, 6);
      u.px(c, 0, g, W, 2, '#9a8e82');
      return {
        g: g, ex: ex, tipY: y3 - Math.max(5, Math.round(eh * 0.09)),
        clouds: u.makeClouds(u.rng(502), 3, W, H, 0.06, 0.24)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.5, G.W, ['#8a5a7a', '#b87a9a', '#e8a898', '#f8d0b0']);
      // Tepede dönen projektör
      var ang = Math.sin(t * 0.9) * 0.55;
      var len = Math.round(G.W * 0.22);
      var tx = st.ex, ty = st.tipY;
      var bx = tx + Math.round(Math.sin(ang) * len), by = ty + Math.round(Math.cos(ang) * 18) - 10;
      u.poly(c, [[tx, ty], [bx - 4, by - 5], [bx + 4, by + 5]], 'rgba(255,240,180,0.22)');
      u.px(c, tx - 1, ty, 3, 2, '#fff4c8');
      // Sıcak hava balonu
      var hx = Math.round((t * 4 + G.W * 0.65) % (G.W + 24)) - 12;
      var hy = Math.round(G.H * 0.20 + Math.sin(t * 0.8) * 3);
      u.circle(c, hx, hy, 5, '#d85a4a');
      u.px(c, hx - 2, hy - 4, 4, 8, '#f8c090');
      u.px(c, hx - 1, hy + 7, 3, 2, '#6a442c');
      // İlk otomobil
      var cx = Math.round((t * 14) % (G.W + 30)) - 15, cy = st.g + 4;
      u.px(c, cx, cy, 10, 3, '#3a4a3a'); u.px(c, cx + 2, cy - 3, 5, 3, '#6a442c');
      u.px(c, cx + 1, cy + 3, 2, 2, '#222228'); u.px(c, cx + 7, cy + 3, 2, 2, '#222228');
      u.birds(c, t, G.W, G.H, 3, '#4a3a4a', 0.24);
    }
  });

  /* ================= 2) ÇANAKKALE — Çanakkale 1915 (1914–1918) ================= */
  S.register('canakkale', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(511);
      u.bands(c, ['#3a3048', '#7a4a5a', '#d8704a', '#f0b070'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), g - sz(G, 0.09), sz(G, 0.06), ['#d8704a', '#f0b070', '#ffe4a8'], g);
      u.profile(c, 0, W, function (x) { return g - 12 - 7 * Math.sin(x / 35) - 3 * Math.sin(x / 12); }, g, '#4e3c4c', '#7a5a68');

      // Sağda Çanakkale Boğazı su şeridi
      var seaX = Math.round(W * 0.56);
      u.px(c, seaX, g - 6, W - seaX, 10, '#3a4a62');
      u.px(c, seaX, g - 6, W - seaX, 1, '#8a7a88');

      // Sol: Kilitbahir Kalesi (yonca planlı kale) + tabya topu
      var kx = xl(G, 0.44), kh = sz(G, 0.22), kw = sz(G, 0.16);
      u.px(c, kx - Math.round(kw * 0.6), g - Math.round(kh * 0.55), Math.round(kw * 1.2), Math.round(kh * 0.55) + 2, '#6a6058');
      u.px(c, kx - Math.round(kw * 0.28), g - kh, Math.round(kw * 0.56), kh + 2, '#7e7268');
      u.px(c, kx - Math.round(kw * 0.28), g - kh, Math.round(kw * 0.56), 1, '#a89a8e');
      u.px(c, kx + Math.round(kw * 0.1), g - kh, Math.round(kw * 0.18), kh, '#524a44');
      for (var mx = kx - Math.round(kw * 0.6); mx < kx + Math.round(kw * 0.6); mx += 4) {
        u.px(c, mx, g - Math.round(kh * 0.55) - 2, 2, 2, '#7e7268');
      }
      // Tabya topu
      var gx = xl(G, 0.78);
      u.px(c, gx - 4, g - 3, 8, 5, '#4e483c');
      u.px(c, gx, g - 5, 9, 2, '#3a3e38');
      u.circle(c, gx + 1, g, 2, '#2e2a24');
      // Bayrak direği
      var fx = kx, fy = g - kh - sz(G, 0.10);
      u.px(c, fx, fy, 1, sz(G, 0.10), '#e8dcc8');

      // Sağ: uzakta gri zırhlı silueti + siper hattı
      var bx = xr(G, 0.65);
      u.px(c, bx - 12, g - 8, 24, 3, '#4a505e');
      u.px(c, bx - 6, g - 11, 10, 3, '#58606e');
      u.px(c, bx - 3, g - 14, 2, 3, '#3a404c');
      u.px(c, bx + 1, g - 14, 2, 3, '#3a404c');
      // Siper hattı
      u.profile(c, xr(G, 0.0), W, function (x) { return g + 1 + 2 * Math.sin(x / 7); }, g + 9, '#5a4e3c', '#8a7a5e');

      // Zemin + gelincikler
      u.bands(c, ['#6a5e48', '#524838', '#3e362a'], g + 4, H, W, 6);
      for (var i = 0; i < 24; i++) {
        var px2 = i < 12 ? xl(G, R()) : xr(G, R());
        var py2 = g + 5 + Math.floor(R() * Math.max(4, H - g - 26));
        u.px(c, px2, py2, 1, 2, '#4a5e38');
        u.px(c, px2, py2 - 1, 2, 1, '#c8282f');
      }
      return {
        g: g, fx: fx + 1, fy: fy, fw: Math.max(9, sz(G, 0.06)),
        bx: bx, seaX: seaX, clouds: u.makeClouds(u.rng(512), 4, W, H, 0.06, 0.25)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.5, G.W, ['#5a3a4a', '#8a505a', '#c87058', '#f0a878']);
      u.flag(c, st.fx, st.fy, st.fw, Math.floor(t * 4) % 2);
      // Nusret mayın gemisi
      var span = Math.max(30, G.W - st.seaX);
      var nx = st.seaX + Math.round((t * 4) % span);
      var ny = st.g - 6;
      u.px(c, nx, ny, 16, 3, '#464e58');
      u.px(c, nx + 4, ny - 3, 7, 3, '#68707a');
      u.px(c, nx + 7, ny - 6, 2, 3, '#2e343c');
      u.smoke(c, nx + 8, ny - 6, t, '#9a8888', 0.6);
      // Uzak top dumanı
      u.smoke(c, st.bx, st.g - 14, t * 0.8, '#b89890', 0.8);
      // Deniz parıltısı
      for (var i = 0; i < 8; i++) {
        var sx = st.seaX + ((i * 29 + Math.floor(t * 3) * 5) % span);
        u.px(c, sx, st.g - 4 + (i % 3), 2, 1, '#f0b070');
      }
      u.birds(c, t, G.W, G.H, 3, '#f0d8c8', 0.22);
    }
  });

  /* ================= 3) İKİNCİ DÜNYA SAVAŞI — Londra Blitz (1939–1945) ================= */
  S.register('ikinci_dunya', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(521);
      u.bands(c, ['#0e1222', '#1e2a44', '#3a4a6a'], 0, g, W, 11);
      u.stars(c, R, 34, W, g - 12, '#c8d4e8');
      skyline(u, c, 0, W, g, '#161e32', '#283450', R, 8, 22);

      // Sol: St Paul Katedrali kubbesi
      var sx = xl(G, 0.45), dr = sz(G, 0.11), baseH = sz(G, 0.14);
      u.px(c, sx - dr - 6, g - baseH, (dr + 6) * 2, baseH + 2, '#343c4e');
      u.px(c, sx - dr, g - baseH - Math.round(dr * 0.6), dr * 2, Math.round(dr * 0.6), '#444e62');
      for (var px2 = sx - dr + 2; px2 < sx + dr - 1; px2 += 3) {
        u.px(c, px2, g - baseH - Math.round(dr * 0.55), 1, Math.round(dr * 0.5), '#222838');
      }
      u.halfDisc(c, sx, g - baseH - Math.round(dr * 0.6), dr, '#4a546a');
      u.halfDisc(c, sx - 2, g - baseH - Math.round(dr * 0.6), Math.max(2, dr - 3), '#647088');
      u.px(c, sx - 2, g - baseH - Math.round(dr * 1.6) - 5, 4, 6, '#7a849a');
      u.px(c, sx, g - baseH - Math.round(dr * 1.6) - 9, 1, 5, '#a8b2c8');

      // Sağ: kırmızı telefon kulübesi + çift katlı otobüs
      var kx = xr(G, 0.72);
      u.px(c, kx, g - 14, 6, 14, '#a83a2a');
      u.px(c, kx + 1, g - 12, 4, 8, '#e8e0a0');
      u.px(c, kx + 2, g - 12, 2, 8, '#7a2a1e');
      var bx = xr(G, 0.25);
      u.px(c, bx, g - 13, 20, 12, '#a83a2a');
      u.px(c, bx + 1, g - 13, 18, 1, '#d05a48');
      for (var wx = bx + 2; wx < bx + 17; wx += 4) {
        u.px(c, wx, g - 11, 3, 3, '#e8e0a0');
        u.px(c, wx, g - 6, 3, 3, '#e8e0a0');
      }
      u.circle(c, bx + 4, g - 1, 2, '#1a1c22');
      u.circle(c, bx + 16, g - 1, 2, '#1a1c22');

      u.bands(c, ['#3a3e48', '#2a2d36', '#1c1e24'], g, H, W, 6);
      return { g: g, sx: sx, bx1: xr(G, 0.22), bx2: xr(G, 0.66) };
    },
    frame: function (c, G, t, st, u) {
      var g = st.g;
      // 3 ışıldak hüzmesi (yarı saydam)
      var beams = [
        [xl(G, 0.15), Math.sin(t * 0.8) * 0.45 + 0.2],
        [xl(G, 0.80), Math.sin(t * 0.6 + 2) * 0.4 - 0.1],
        [xr(G, 0.45), Math.sin(t * 0.7 + 4) * 0.45 - 0.2]
      ];
      for (var i = 0; i < beams.length; i++) {
        var ox = beams[i][0], ang = beams[i][1];
        var tx = ox + Math.round(Math.sin(ang) * g * 0.95), ty = 4;
        u.poly(c, [[ox, g], [tx - 10, ty], [tx + 10, ty]], 'rgba(232,224,160,0.16)');
      }
      // 2 baraj balonu (±2px salınım)
      var bs = [
        [st.bx1, Math.round(G.H * 0.28 + Math.sin(t * 1.1) * 2)],
        [st.bx2, Math.round(G.H * 0.20 + Math.sin(t * 1.1 + 2) * 2)]
      ];
      for (i = 0; i < bs.length; i++) {
        var bpx = bs[i][0], bpy = bs[i][1];
        u.px(c, bpx, bpy + 4, 1, g - bpy - 4, 'rgba(138,138,138,0.45)');
        u.px(c, bpx - 8, bpy - 3, 16, 6, '#8a8a8a');
        u.px(c, bpx - 6, bpy - 4, 12, 1, '#b8b8b8');
        u.px(c, bpx - 10, bpy - 2, 3, 4, '#5a5a5a');
      }
      // Uzakta uçak siluetleri
      for (i = 0; i < 3; i++) {
        var ax = Math.round(((t * (10 + i * 2) + i * 70) % (G.W + 30)) - 15);
        var ay = Math.round(G.H * (0.14 + i * 0.06));
        u.px(c, ax, ay, 5, 1, '#1e2436');
        u.px(c, ax + 2, ay - 2, 1, 5, '#1e2436');
      }
      u.smoke(c, st.sx - 12, g - 8, t * 0.7, '#4a5060', 0.9);
    }
  });

  /* ================= 4) BM NEW YORK — Savaş Sonrası New York (1946–1956) ================= */
  S.register('bm_newyork', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(531);
      u.bands(c, ['#4a7ab8', '#7aa8dc', '#a8d0f0'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), Math.round(H * 0.16), sz(G, 0.045), ['#f8e8a8', '#fff4cc', '#ffffff'], g);
      skyline(u, c, 0, W, g, '#7a9ec2', '#9abce0', R, 10, 26);

      // Sol: BM Genel Merkezi (yeşil cam levha + limestone yan + bayrak direkleri)
      var ux = xl(G, 0.35), uw = sz(G, 0.12), uh = sz(G, 0.42);
      u.px(c, ux, g - uh, uw, uh + 2, '#5a8a8a');
      u.px(c, ux + uw, g - uh, Math.max(3, Math.round(uw * 0.25)), uh + 2, '#c8b8a0');
      u.px(c, ux, g - uh, uw + Math.max(3, Math.round(uw * 0.25)), 1, '#f0f0e8');
      for (var wy = g - uh + 3; wy < g - 4; wy += 4) {
        u.px(c, ux + 1, wy, uw - 2, 2, wy % 8 === 0 ? '#7ab8b8' : '#4a7676');
      }
      // Alçak genel kurul binası
      u.px(c, ux - Math.round(uw * 0.8), g - Math.round(uh * 0.25), Math.round(uw * 0.8), Math.round(uh * 0.25) + 2, '#c8b8a0');
      // 5 bayrak direği
      var poles = [];
      for (var i = 0; i < 5; i++) {
        var px2 = xl(G, 0.12 + i * 0.15);
        u.px(c, px2, g - 16, 1, 18, '#f0f0e8');
        poles.push(px2);
      }

      // Sağ: Empire State + Chrysler tepesi
      var ex = xr(G, 0.35), ew = sz(G, 0.11), eh = sz(G, 0.54);
      u.px(c, ex - Math.round(ew * 0.6), g - Math.round(eh * 0.22), Math.round(ew * 1.2), Math.round(eh * 0.22) + 2, '#c8b8a0');
      u.px(c, ex - Math.round(ew * 0.42), g - Math.round(eh * 0.72), Math.round(ew * 0.84), Math.round(eh * 0.72) + 2, '#c8b8a0');
      u.px(c, ex + Math.round(ew * 0.15), g - Math.round(eh * 0.72), Math.round(ew * 0.27), Math.round(eh * 0.72) + 2, '#a2927c');
      u.px(c, ex - Math.round(ew * 0.22), g - Math.round(eh * 0.85), Math.round(ew * 0.44), Math.round(eh * 0.14), '#d8cbb4');
      u.px(c, ex, g - eh, 1, Math.round(eh * 0.16), '#f0f0e8');
      for (var wx = ex - Math.round(ew * 0.32); wx <= ex + Math.round(ew * 0.1); wx += 3) {
        u.px(c, wx, g - Math.round(eh * 0.68), 1, Math.round(eh * 0.46), '#6a7a8a');
      }
      // Chrysler
      var cx2 = xr(G, 0.74), ch = sz(G, 0.40), cw = sz(G, 0.08);
      u.px(c, cx2 - Math.round(cw * 0.5), g - Math.round(ch * 0.72), cw, Math.round(ch * 0.72) + 2, '#b8b0a8');
      for (var s = 0; s < 3; s++) {
        var rw = Math.max(2, Math.round(cw * (0.45 - s * 0.12)));
        u.halfDisc(c, cx2, g - Math.round(ch * 0.72) - s * 3, rw, s % 2 ? '#e8e8f0' : '#b8c4d0');
      }
      u.px(c, cx2, g - ch, 1, Math.round(ch * 0.2), '#f0f0f8');

      u.bands(c, ['#6a6c72', '#52545a', '#3c3e44'], g, H, W, 6);
      return { g: g, poles: poles, clouds: u.makeClouds(u.rng(532), 4, W, H, 0.06, 0.26) };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.7, G.W, ['#b8cce0', '#d8e6f4', '#eef6fc', '#ffffff']);
      var fcols = ['#3a7ad0', '#d84040', '#40a858', '#e8c020', '#e8e8f0'];
      for (var i = 0; i < st.poles.length; i++) {
        var dy = ((Math.floor(t * 4) + i) % 2);
        u.px(c, st.poles[i] + 1, st.g - 16 + dy, 4, 3, fcols[i]);
      }
      // Sarı taksiler
      for (i = 0; i < 2; i++) {
        var tx = Math.round(((t * (18 + i * 6) + i * 90) % (G.W + 30)) - 15);
        var ty = st.g + 4 + i * 4;
        u.px(c, tx, ty, 10, 3, '#e8c020');
        u.px(c, tx + 2, ty - 2, 5, 2, '#f8e050');
        u.px(c, tx + 1, ty + 3, 2, 1, '#222228');
        u.px(c, tx + 7, ty + 3, 2, 1, '#222228');
      }
      u.birds(c, t, G.W, G.H, 3, '#3a4a5a', 0.22);
    }
  });

  /* ================= 5) AY'A İNİŞ — Apollo 11 (1969–1975) ================= */
  S.register('ay_inisi', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(541);
      u.bands(c, ['#05060c', '#0c0e18', '#141724'], 0, g, W, 8);
      u.stars(c, R, 52, W, g - 6, '#e8e8f0');
      // Gökte yarım mavi-yeşil Dünya (sağ üst güvenli bölgede)
      var ex = xr(G, 0.18), ey = Math.round(H * 0.18), er = sz(G, 0.055);
      u.circle(c, ex, ey, er, '#05060c');
      u.halfDisc(c, ex, ey, er, '#3a7ad0');
      u.px(c, ex - Math.round(er * 0.4), ey - Math.round(er * 0.6), Math.max(2, Math.round(er * 0.5)), Math.max(2, Math.round(er * 0.4)), '#50a868');
      u.px(c, ex - Math.round(er * 0.2), ey - Math.round(er * 0.3), Math.max(2, Math.round(er * 0.6)), 1, '#e8e8f0');

      // Uzak krater ufku
      u.profile(c, 0, W, function (x) { return g - 4 - 3 * Math.sin(x / 19) - 2 * Math.cos(x / 7); }, g, '#3a3c46', '#5a5c66');

      // Sol: Ay Modülü (altın folyo alt gövde + örümcek bacaklar + şeritli bayrak)
      var lx = xl(G, 0.42), lw = sz(G, 0.14), lh = sz(G, 0.18);
      // İniş bacakları
      var legSpan = Math.round(lw * 0.85);
      u.poly(c, [[lx - Math.round(lw * 0.4), g - Math.round(lh * 0.3)], [lx - legSpan, g + 3], [lx - legSpan + 2, g + 3], [lx - Math.round(lw * 0.3), g - Math.round(lh * 0.3)]], '#b89028');
      u.poly(c, [[lx + Math.round(lw * 0.4), g - Math.round(lh * 0.3)], [lx + legSpan, g + 3], [lx + legSpan - 2, g + 3], [lx + Math.round(lw * 0.3), g - Math.round(lh * 0.3)]], '#9a7218');
      u.px(c, lx - legSpan - 2, g + 3, 5, 1, '#d8a830');
      u.px(c, lx + legSpan - 3, g + 3, 5, 1, '#d8a830');
      // Altın iniş kademesi
      u.px(c, lx - Math.round(lw * 0.5), g - Math.round(lh * 0.48), lw, Math.round(lh * 0.36), '#d8a830');
      u.px(c, lx + Math.round(lw * 0.15), g - Math.round(lh * 0.48), Math.round(lw * 0.35), Math.round(lh * 0.36), '#9a7218');
      u.px(c, lx - Math.round(lw * 0.5), g - Math.round(lh * 0.48), lw, 1, '#f8d868');
      // Çıkış kademesi
      var uw = Math.round(lw * 0.72), uh = Math.round(lh * 0.48);
      u.px(c, lx - Math.round(uw * 0.5), g - Math.round(lh * 0.96), uw, uh, '#8a8a90');
      u.px(c, lx - Math.round(uw * 0.5), g - Math.round(lh * 0.96), uw, 1, '#c8c8cc');
      u.px(c, lx - Math.round(uw * 0.25), g - Math.round(lh * 0.8), 3, 2, '#1a1c26');
      u.px(c, lx + Math.round(uw * 0.05), g - Math.round(lh * 0.8), 3, 2, '#1a1c26');
      // Bayrak (sade şeritli)
      var fx = xl(G, 0.82), fy = g - sz(G, 0.12);
      u.px(c, fx, fy, 1, sz(G, 0.12) + 2, '#c8c8cc');
      u.px(c, fx + 1, fy, 8, 1, '#c83a3a');
      u.px(c, fx + 1, fy + 1, 8, 1, '#e8e8f0');
      u.px(c, fx + 1, fy + 2, 8, 1, '#c83a3a');
      u.px(c, fx + 1, fy + 3, 8, 1, '#e8e8f0');
      u.px(c, fx + 1, fy, 3, 2, '#3a5aa8');

      // Zemin (gri regolith + kraterler)
      u.bands(c, ['#8a8a90', '#6a6a70', '#4e4e54'], g, H, W, 6);
      var crX = [xl(G, 0.15), xr(G, 0.25), xr(G, 0.75)];
      for (var i = 0; i < crX.length; i++) {
        var cy2 = g + 5 + (i % 2) * 4;
        u.px(c, crX[i] - 6, cy2, 12, 3, '#4e4e54');
        u.px(c, crX[i] - 5, cy2 + 2, 10, 1, '#a8a8b0');
      }
      var tw = [];
      for (i = 0; i < 8; i++) tw.push([Math.floor(R() * W), Math.floor(R() * (g - 10))]);
      return { g: g, ax: xr(G, 0.48), tw: tw };
    },
    frame: function (c, G, t, st, u) {
      // Yıldız kırpışması
      for (var i = 0; i < st.tw.length; i++) {
        if (Math.floor(t * 3 + i) % 2 === 0) u.px(c, st.tw[i][0], st.tw[i][1], 1, 1, '#ffffff');
      }
      // Yörüngede komuta modülü
      var ox = Math.round((t * 10) % (G.W + 20)) - 10, oy = Math.round(G.H * 0.12);
      u.px(c, ox, oy, 5, 2, '#c8c8cc');
      u.px(c, ox + 5, oy, 2, 2, '#e8e8f0');
      // Astronot (yavaş sinüs zıplama)
      var jump = Math.round(Math.abs(Math.sin(t * 2.2)) * 5);
      var ax = st.ax, ay = st.g + 2 - jump;
      u.px(c, ax - 3, ay - 8, 2, 5, '#b0b0b8'); // sırt çantası
      u.px(c, ax - 1, ay - 9, 4, 5, '#e8e8f0'); // gövde
      u.px(c, ax - 1, ay - 13, 4, 4, '#e8e8f0'); // kask
      u.px(c, ax + 1, ay - 12, 2, 2, '#d8a830'); // altın vizör
      u.px(c, ax - 1, ay - 4, 1, 4, '#c8c8cc'); // bacaklar
      u.px(c, ax + 2, ay - 4, 1, 4, '#c8c8cc');
      if (jump === 0) {
        u.px(c, ax - 3, st.g + 2, 1, 1, '#a8a8b0');
        u.px(c, ax + 4, st.g + 2, 1, 1, '#a8a8b0');
      }
    }
  });

  /* ================= 6) TOKYO 80'LER — Tokyo Neon (1976–1984) ================= */
  S.register('tokyo_80', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(551);
      u.bands(c, ['#120e2a', '#3a1e5a', '#a83a8a'], 0, g, W, 11);
      u.stars(c, R, 28, W, Math.round(g * 0.65), '#f0d0f0');

      // Uzakta Fuji Dağı (sağ-orta)
      var fx = Math.round(W * 0.64), fh = sz(G, 0.22), fw = sz(G, 0.28);
      u.poly(c, [[fx - fw, g], [fx - Math.round(fw * 0.16), g - fh], [fx + Math.round(fw * 0.16), g - fh], [fx + fw, g]], '#2a1644');
      u.poly(c, [[fx - Math.round(fw * 0.36), g - Math.round(fh * 0.62)], [fx - Math.round(fw * 0.16), g - fh], [fx + Math.round(fw * 0.16), g - fh], [fx + Math.round(fw * 0.36), g - Math.round(fh * 0.62)]], '#e8e8f0');

      // Sol: Tokyo Kulesi (kırmızı-beyaz kafes) + dar neonlu binalar
      var tx = xl(G, 0.40), th = sz(G, 0.54), bw = sz(G, 0.11);
      var y0 = g + 2, y1 = y0 - Math.round(th * 0.36), y2 = y0 - Math.round(th * 0.68), y3 = y0 - Math.round(th * 0.90);
      lattice(u, c, tx, y1, y0, Math.round(bw * 0.55), bw, '#e03a3a', '#ff6a6a', 5);
      u.px(c, tx - Math.round(bw * 0.58), y1 - 2, Math.round(bw * 1.16), 3, '#e8e8f0');
      lattice(u, c, tx, y2, y1 - 2, Math.round(bw * 0.25), Math.round(bw * 0.50), '#e8e8f0', '#ffffff', 4);
      u.px(c, tx - Math.round(bw * 0.30), y2 - 2, Math.round(bw * 0.60), 3, '#e03a3a');
      lattice(u, c, tx, y3, y2 - 2, 2, Math.round(bw * 0.22), '#e03a3a', '#ff6a6a', 4);
      u.px(c, tx, y3 - Math.max(5, Math.round(th * 0.10)), 1, Math.max(5, Math.round(th * 0.10)), '#e8e8f0');

      // Sağ ve sol dar binalar + neon blokları
      var neons = [];
      function neonBldg(bx, bbw, bbh) {
        u.px(c, bx, g - bbh, bbw, bbh + 2, '#1c1438');
        u.px(c, bx, g - bbh, bbw, 1, '#5a3a7a');
        for (var ny = g - bbh + 4; ny < g - 8; ny += 6) {
          if (R() < 0.75) neons.push([bx + 2, ny, Math.max(3, bbw - 4), 3, R() < 0.5 ? '#40e0e0' : '#f07ab0']);
        }
      }
      neonBldg(xl(G, 0.72), sz(G, 0.08), sz(G, 0.28));
      neonBldg(xr(G, 0.12), sz(G, 0.09), sz(G, 0.32));
      neonBldg(xr(G, 0.45), sz(G, 0.10), sz(G, 0.36));
      neonBldg(xr(G, 0.78), sz(G, 0.08), sz(G, 0.26));

      // Sağda Shinkansen viyadüğü
      var vx = xr(G, 0.0), vy = g - sz(G, 0.08);
      u.px(c, vx, vy, W - vx, 4, '#4a4468');
      u.px(c, vx, vy, W - vx, 1, '#8a7ab0');
      for (var px2 = vx + 8; px2 < W; px2 += 16) u.px(c, px2, vy + 4, 3, g - vy - 2, '#2e2a44');

      u.bands(c, ['#2e2a44', '#221e36', '#181428'], g, H, W, 6);
      return {
        g: g, vx: vx, vy: vy, tx: tx, tipY: y3 - Math.max(5, Math.round(th * 0.10)),
        neons: neons
      };
    },
    frame: function (c, G, t, st, u) {
      // Yanıp sönen neon blokları (2 kare)
      var tick = Math.floor(t * 3);
      for (var i = 0; i < st.neons.length; i++) {
        var n = st.neons[i];
        var on = ((tick + i) % 3) !== 0;
        u.px(c, n[0], n[1], n[2], n[3], on ? n[4] : '#2a1e4a');
      }
      // Kule tepe ışığı
      if (Math.floor(t * 2) % 2 === 0) u.px(c, st.tx, st.tipY - 1, 2, 2, '#ff4040');
      // 0 Serisi Shinkansen
      var span = Math.max(40, G.W - st.vx + 40);
      var sx = st.vx + Math.round((t * 32) % span) - 32;
      var sy = st.vy - 4;
      if (sx + 30 > st.vx) {
        var x0 = Math.max(st.vx, sx);
        var w0 = Math.min(30, sx + 30 - x0);
        if (w0 > 0) {
          u.px(c, x0, sy, w0, 4, '#e8e8f0');
          u.px(c, x0, sy + 2, w0, 1, '#2060c0');
          for (var wx = x0 + 2; wx < x0 + w0 - 2; wx += 4) u.px(c, wx, sy + 1, 2, 1, '#40e0e0');
        }
      }
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
