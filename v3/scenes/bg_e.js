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
  function feetY(G) { return G.H - Math.ceil(46 / G.S) - 4; }

  /* ---------- yerel yardımcılar ---------- */
  // Hızlı Bayer dither bantları (satır tabanlı)
  function fastBands(u, c, keys, y0, y1, W, n) {
    var cols = u.ramp(keys, n || 10), cnt = cols.length, bh = Math.max(1, (y1 - y0) / cnt);
    var B = u.BAYER;
    for (var y = y0; y < y1; y++) {
      var f = (y - y0) / bh, i = Math.min(cnt - 1, Math.floor(f)), fr = f - i;
      u.px(c, 0, y, W, 1, cols[i]);
      if (i < cnt - 1 && fr > 0.55) {
        var thr = (fr - 0.55) / 0.45;
        var row = B[y & 3];
        for (var x = 0; x < W; x++) {
          if (row[x & 3] / 16 < thr) u.px(c, x, y, 1, 1, cols[i + 1]);
        }
      }
    }
  }

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

  // Yapraklı ağaç (sc: ölçek, sc=1 -> ~26px boy)
  function agac(u, c, x, base, sc, col1, col2, trunkCol) {
    var s = Math.max(0.4, sc || 1);
    var th = Math.max(4, Math.round(10 * s));
    var tw = Math.max(1, Math.round(2.5 * s));
    var r = Math.max(3, Math.round(8 * s));
    u.px(c, x - Math.floor(tw / 2), base - th, tw, th, trunkCol || '#4a3424');
    u.circle(c, x, base - th - r + 2, r, col1);
    u.circle(c, x - Math.max(2, Math.round(3 * s)), base - th - Math.round(r * 0.7), Math.max(2, Math.round(r * 0.72)), col1);
    u.circle(c, x + Math.max(2, Math.round(3 * s)), base - th - Math.round(r * 0.65), Math.max(2, Math.round(r * 0.68)), col1);
    u.circle(c, x - Math.max(1, Math.round(2 * s)), base - th - r, Math.max(2, Math.round(r * 0.68)), col2);
  }

  // İnsan silueti (yürüyen / duran, sc=1 -> ~14-16px boy)
  function insan(u, c, x, base, sc, coatCol, hatCol, ph, bagCol) {
    var s = Math.max(0.45, sc || 1);
    var bh = Math.max(3, Math.round(6 * s));
    var lh = Math.max(2, Math.round(5 * s));
    var hh = Math.max(2, Math.round(3 * s));
    var w = Math.max(2, Math.round(4 * s));
    var step = ph ? (ph % 2 ? 1 : -1) : 0;
    if (bagCol) {
      u.px(c, x - Math.max(1, Math.round(1.5 * s)), base - bh - lh + 1, Math.max(1, Math.round(2 * s)), Math.max(2, bh - 2), bagCol);
    }
    u.px(c, x, base - bh - lh, w, bh, coatCol);
    u.px(c, x + Math.max(0, Math.floor((w - hh) / 2)), base - bh - lh - hh, Math.max(2, hh), hh, hatCol || coatCol);
    u.px(c, x + step, base - lh, Math.max(1, Math.round(1.3 * s)), lh, coatCol);
    u.px(c, x + w - Math.max(1, Math.round(1.3 * s)) - step, base - lh, Math.max(1, Math.round(1.3 * s)), lh, coatCol);
  }

  // Yan görünüm dönem aracı (sc=1 -> ~26px genişlik)
  function arabaYan(u, c, x, base, sc, bodyCol, roofCol, winCol, dir, lightCol) {
    var s = Math.max(0.45, sc || 1);
    var w = Math.max(11, Math.round(26 * s));
    var h = Math.max(4, Math.round(6 * s));
    var rw = Math.max(6, Math.round(w * 0.54));
    var rh = Math.max(3, Math.round(4 * s));
    var rx = dir < 0 ? x + Math.round(w * 0.28) : x + Math.round(w * 0.18);
    var wr = Math.max(1, Math.round(2.4 * s));
    u.px(c, x, base - h - wr, w, h, bodyCol);
    u.px(c, x, base - wr - 1, w, 1, '#262830');
    u.px(c, rx, base - h - rh - wr, rw, rh, roofCol || bodyCol);
    u.px(c, rx + 2, base - h - rh - wr + 1, Math.max(3, rw - 4), Math.max(2, rh - 1), winCol || '#9ad0e8');
    u.px(c, rx + Math.round(rw * 0.5), base - h - rh - wr + 1, 1, Math.max(2, rh - 1), roofCol || bodyCol);
    u.circle(c, x + Math.round(w * 0.22), base - wr, wr, '#181a20');
    u.circle(c, x + Math.round(w * 0.78), base - wr, wr, '#181a20');
    u.px(c, x + Math.round(w * 0.22), base - wr, 1, 1, '#8a8e98');
    u.px(c, x + Math.round(w * 0.78), base - wr, 1, 1, '#8a8e98');
    if (lightCol) {
      var lx = dir < 0 ? x - 1 : x + w;
      u.px(c, lx, base - h - wr + 2, 2, 2, lightCol);
    }
  }

  // At arabası (yan görünüm, sc=1 -> ~30px toplam)
  function atArabasi(u, c, x, base, sc, cartCol, horseCol, canopyCol, ph) {
    var s = Math.max(0.5, sc || 1);
    var cw = Math.max(9, Math.round(16 * s));
    var ch = Math.max(4, Math.round(6 * s));
    var wr = Math.max(2, Math.round(3 * s));
    u.px(c, x, base - ch - wr, cw, ch, cartCol);
    if (canopyCol) u.px(c, x + 1, base - ch - wr - Math.round(5 * s), cw - 2, Math.round(5 * s), canopyCol);
    u.circle(c, x + Math.round(3 * s), base - wr, wr, '#2a2018');
    u.circle(c, x + cw - Math.round(3 * s), base - wr, wr, '#2a2018');
    u.px(c, x + Math.round(3 * s), base - wr, 1, 1, '#6a5640');
    u.px(c, x + cw - Math.round(3 * s), base - wr, 1, 1, '#6a5640');
    // At
    var hx = x + cw + 3;
    var hw = Math.max(5, Math.round(8 * s));
    u.px(c, x + cw, base - Math.round(6 * s), 4, 1, '#3a2c20');
    u.px(c, hx, base - Math.round(9 * s), hw, Math.round(4 * s), horseCol);
    u.px(c, hx + hw - 1, base - Math.round(12 * s), Math.round(3 * s), Math.round(5 * s), horseCol);
    var leg = ph ? 1 : 0;
    u.px(c, hx + leg, base - Math.round(5 * s), 1, Math.round(5 * s), horseCol);
    u.px(c, hx + hw - 2 - leg, base - Math.round(5 * s), 1, Math.round(5 * s), horseCol);
  }

  // Bisikletli (yan görünüm, sc=1 -> ~15px boy)
  function bisikletli(u, c, x, base, sc, frameCol, riderCol, dir, ph) {
    var s = Math.max(0.6, sc || 1);
    var wr = Math.max(2, Math.round(2.5 * s));
    var span = Math.round(9 * s);
    u.circle(c, x, base - wr, wr, '#181a24');
    u.circle(c, x + span, base - wr, wr, '#181a24');
    u.px(c, x, base - wr, 1, 1, '#9a9ea8');
    u.px(c, x + span, base - wr, 1, 1, '#9a9ea8');
    u.px(c, x + 1, base - wr - 3, span - 2, 1, frameCol);
    var rx = x + Math.round(span * 0.35);
    u.px(c, rx, base - wr - Math.round(8 * s), Math.round(4 * s), Math.round(6 * s), riderCol);
    u.px(c, rx + (dir < 0 ? 0 : 1), base - wr - Math.round(11 * s), Math.round(3 * s), Math.round(3 * s), '#e8c8b0');
    u.px(c, rx + (ph ? 2 : 1), base - wr - 2, 1, 3, riderCol);
  }

  // Pazar / sokak tezgahı (tabelasız, sc=1 -> ~18x13px)
  function tezgah(u, c, x, base, sc, frameCol, awn1, awn2) {
    var s = Math.max(0.6, sc || 1);
    var w = Math.max(10, Math.round(18 * s));
    var h = Math.max(7, Math.round(12 * s));
    u.px(c, x, base - h, 2, h, frameCol);
    u.px(c, x + w - 2, base - h, 2, h, frameCol);
    u.px(c, x, base - Math.round(h * 0.45), w, Math.round(h * 0.45), frameCol);
    for (var i = 0; i < w + 2; i += 3) {
      u.px(c, x - 1 + i, base - h - 3, 3, 3, (Math.floor(i / 3)) % 2 ? awn1 : awn2);
    }
  }

  // Sokak lambası
  function sokakLamba(u, c, x, base, h, postCol, glowCol) {
    u.px(c, x, base - h, 1, h, postCol);
    u.px(c, x - 1, base - 2, 3, 2, postCol);
    u.px(c, x - 2, base - h - 3, 5, 3, glowCol);
    u.px(c, x - 1, base - h - 4, 3, 1, postCol);
  }

  // Hayvan (köpek/kedi/kuş)
  function hayvan(u, c, x, base, sc, col, ph) {
    var w = Math.max(2, Math.round(3 * sc));
    u.px(c, x, base - 2, w, 2, col);
    u.px(c, x + w - 1, base - 3, 1, 2, col);
    u.px(c, x + (ph ? 0 : 1), base - 1, 1, 1, col);
  }

  // Zemin perspektif dokusu (kenar ağırlıklı, orta bant sakin)
  function groundTex(u, c, R, W, g, fy, cols, count, kind) {
    var span = Math.max(8, fy - g - 4);
    for (var i = 0; i < count; i++) {
      var side = R();
      var x = side < 0.43 ? Math.floor(R() * W * 0.35)
        : (side < 0.86 ? Math.floor(W * 0.65 + R() * W * 0.35) : Math.floor(W * 0.36 + R() * W * 0.28));
      var strip = R();
      if (x > W * 0.35 && x < W * 0.65) strip *= 0.25; // ortada sadece ufka yakın
      var y = g + 2 + Math.floor(strip * span);
      var w = strip < 0.33 ? 2 : (strip < 0.66 ? 3 : 5);
      var col = cols[Math.min(cols.length - 1, Math.floor(strip * cols.length))];
      if (kind === 'tuft') {
        u.px(c, x, y, 1, 2, col);
        u.px(c, x + 2, y - 1, 1, 2, col);
      } else {
        u.px(c, x, y, w, 1, col);
      }
    }
  }

  // Baraj balonu (oval gövde, kuyruk kanatçıkları, kesintisiz ince halat)
  function barajBalonu(u, c, bx, by, g, bodyCol, hiCol, finCol) {
    // Kesintisiz düz ince halat (yere bağlı)
    var y0 = by + 4, span = Math.max(4, g - y0);
    for (var y = y0; y <= g; y++) {
      var hx = Math.round(bx + ((y - y0) / span) * 6);
      u.px(c, hx, y, 1, 1, 'rgba(180,190,205,0.55)');
    }
    u.px(c, bx + 5, g - 1, 3, 2, '#2a2e38'); // yer bağlantısı
    // Oval gövde
    u.px(c, bx - 9, by - 2, 18, 5, bodyCol);
    u.px(c, bx - 7, by - 4, 14, 9, bodyCol);
    u.px(c, bx - 4, by - 5, 8, 11, bodyCol);
    u.px(c, bx - 6, by - 4, 11, 2, hiCol);
    // Kuyruk kanatçıkları
    u.poly(c, [[bx - 8, by - 2], [bx - 13, by - 6], [bx - 10, by]], finCol);
    u.poly(c, [[bx - 8, by + 2], [bx - 13, by + 6], [bx - 10, by]], finCol);
  }

  // Perspektifli elips ay krateri
  function krater(u, c, cx, cy, rx, ry) {
    u.px(c, cx - rx, cy - ry, rx * 2, ry * 2, '#42444c');
    u.px(c, cx - rx + 2, cy - ry + 1, Math.max(2, rx * 2 - 4), Math.max(1, ry * 2 - 2), '#2c2e36');
    u.px(c, cx - rx - 1, cy - ry, rx * 2 + 2, 1, '#84848e');
    u.px(c, cx - rx + 1, cy + ry, rx * 2 - 2, 1, '#a8a8b2');
  }

  /* ================= 1) EYFEL — Belle Époque Paris (1889–1913) ================= */
  S.register('eyfel', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), fy = feetY(G) - 4, R = u.rng(501);
      fastBands(u, c, ['#4a3a6a', '#b87a9a', '#f8c090'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), g - sz(G, 0.22), sz(G, 0.055), ['#f89870', '#f8c090', '#fff0c8'], g);
      // Katmanlı uzak Paris silueti (kilise kubbesi, çatılar)
      skyline(u, c, 0, W, g - 2, '#9a7898', '#b898b0', R, 6, 14);
      u.profile(c, 0, W, function (x) { return g - 10 - 5 * Math.sin(x / 31) - 3 * Math.sin(x / 11); }, g, '#7a5a7a', '#9a7a9a');

      // Sol: Eyfel Kulesi
      var ex = xl(G, 0.45), eh = sz(G, 0.54), bw = sz(G, 0.13);
      var y0 = g + 2, y1 = y0 - Math.round(eh * 0.32), y2 = y0 - Math.round(eh * 0.62), y3 = y0 - Math.round(eh * 0.92);
      lattice(u, c, ex, y1, y0, Math.round(bw * 0.56), bw, '#6a442c', '#9e6c48', 5);
      u.px(c, ex - Math.round(bw * 0.36), y0 - 4, Math.round(bw * 0.72), 5, '#b87a9a');
      u.halfDisc(c, ex, y0 - 2, Math.max(3, Math.round(bw * 0.34)), '#d89a94');
      u.px(c, ex - Math.round(bw * 0.62), y1 - 2, Math.round(bw * 1.24), 3, '#543422');
      u.px(c, ex - Math.round(bw * 0.62), y1 - 2, Math.round(bw * 1.24), 1, '#b8845a');
      lattice(u, c, ex, y2, y1 - 2, Math.round(bw * 0.28), Math.round(bw * 0.52), '#7a4e32', '#ab7850', 4);
      u.px(c, ex - Math.round(bw * 0.34), y2 - 2, Math.round(bw * 0.68), 3, '#543422');
      u.px(c, ex - Math.round(bw * 0.34), y2 - 2, Math.round(bw * 0.68), 1, '#b8845a');
      lattice(u, c, ex, y3, y2 - 2, 2, Math.round(bw * 0.24), '#8a5a3a', '#ba8a60', 4);
      u.px(c, ex - 2, y3 - 4, 5, 4, '#6a442c');
      u.px(c, ex, y3 - Math.max(5, Math.round(eh * 0.09)), 1, Math.max(5, Math.round(eh * 0.09)), '#b8845a');

      // Sağ: Haussmann binaları + Art Nouveau metro girişi
      var b1 = xr(G, 0.22), b2 = xr(G, 0.65), bw1 = sz(G, 0.13), bw2 = sz(G, 0.14);
      mansard(u, c, b1, g + 2, bw1, sz(G, 0.28), '#e8dcc8', '#c4b49e', '#4a5060', R);
      mansard(u, c, b2, g + 2, bw2, sz(G, 0.34), '#e2d4be', '#bcac96', '#3e4454', R);
      var mx = xr(G, 0.05), mw = Math.max(10, sz(G, 0.08));
      u.px(c, mx, g - 9, 2, 11, '#2a4a3a'); u.px(c, mx + mw, g - 9, 2, 11, '#2a4a3a');
      u.px(c, mx - 1, g - 11, mw + 4, 2, '#3a6a50');
      u.px(c, mx + 1, g - 13, 2, 2, '#f8c860'); u.px(c, mx + mw - 1, g - 13, 2, 2, '#f8c860');

      // Zemin (3 perspektifli şerit: Seine rıhtımı + bulvar taşları)
      fastBands(u, c, ['#8a807a', '#6c645e', '#4a4440'], g, H, W, 7);
      u.px(c, 0, g, W, 2, '#a69a8e');
      groundTex(u, c, R, W, g, fy, ['#9a8e82', '#7a7068', '#383430'], 36, 'cobble');

      // Şerit 1 (ufka yakın, küçük/soluk)
      agac(u, c, Math.round(W * 0.07), g + 5, 0.48, '#6a7a68', '#8a9a84', '#5a4e48');
      agac(u, c, Math.round(W * 0.30), g + 5, 0.45, '#6a7a68', '#8a9a84', '#5a4e48');
      agac(u, c, Math.round(W * 0.69), g + 5, 0.48, '#6a7a68', '#8a9a84', '#5a4e48');
      agac(u, c, Math.round(W * 0.92), g + 5, 0.48, '#6a7a68', '#8a9a84', '#5a4e48');
      insan(u, c, Math.round(W * 0.44), g + 6, 0.48, '#6e6474', '#8e8494', 0);
      insan(u, c, Math.round(W * 0.56), g + 6, 0.48, '#6e6474', '#8e8494', 1);

      // Şerit 2 (orta mesafe, sol & sağ)
      var yMid = Math.min(fy - 16, g + Math.round((fy - g) * 0.42));
      sokakLamba(u, c, Math.round(W * 0.14), yMid, 16, '#34363c', '#f8d080');
      sokakLamba(u, c, Math.round(W * 0.86), yMid, 16, '#34363c', '#f8d080');
      tezgah(u, c, Math.round(W * 0.04), yMid + 2, 0.95, '#5a4232', '#3a6a50', '#f0e4d0');
      tezgah(u, c, Math.round(W * 0.70), yMid + 2, 1.0, '#5a4232', '#c84a3a', '#f0e4d0');
      agac(u, c, Math.round(W * 0.28), yMid + 2, 0.95, '#3e5e40', '#5a7e56', '#4a3424');
      agac(u, c, Math.round(W * 0.95), yMid + 2, 1.0, '#3e5e40', '#5a7e56', '#4a3424');

      // Şerit 3 (ön plan, büyük & ayrıntılı, kenarlarda)
      var yNear = Math.min(fy - 2, g + Math.round((fy - g) * 0.84));
      agac(u, c, Math.round(W * 0.04), yNear, 1.35, '#2e4e34', '#4a704a', '#3e2c20');
      agac(u, c, Math.round(W * 0.93), yNear, 1.35, '#2e4e34', '#4a704a', '#3e2c20');
      // Kaldırım kenarı bankı
      var bkx = Math.round(W * 0.12);
      u.px(c, bkx, yNear - 5, 18, 3, '#6a4830');
      u.px(c, bkx, yNear - 7, 18, 1, '#8a6042');
      u.px(c, bkx + 2, yNear - 2, 2, 3, '#2a282c');
      u.px(c, bkx + 14, yNear - 2, 2, 3, '#2a282c');
      insan(u, c, Math.round(W * 0.25), yNear, 1.15, '#2c2a3a', '#1c1a24', 0);
      insan(u, c, Math.round(W * 0.72), yNear, 1.1, '#4a384a', '#342430', 1);

      return {
        g: g, yMid: yMid, yNear: yNear, ex: ex, tipY: y3 - Math.max(5, Math.round(eh * 0.09)),
        clouds: u.makeClouds(u.rng(502), 5, W, H, 0.05, 0.25)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.5, W, ['#8a5a7a', '#b87a9a', '#e8a898', '#f8d0b0']);
      // Tepede dönen projektör
      var ang = Math.sin(t * 0.9) * 0.55;
      var len = Math.round(W * 0.22);
      var tx = st.ex, ty = st.tipY;
      var bx = tx + Math.round(Math.sin(ang) * len), by = ty + Math.round(Math.cos(ang) * 18) - 10;
      u.poly(c, [[tx, ty], [bx - 4, by - 5], [bx + 4, by + 5]], 'rgba(255,240,180,0.22)');
      u.px(c, tx - 1, ty, 3, 2, '#fff4c8');
      // Sıcak hava balonu
      var hx = Math.round((t * 4 + W * 0.65) % (W + 24)) - 12;
      var hy = Math.round(G.H * 0.20 + Math.sin(t * 0.8) * 3);
      u.circle(c, hx, hy, 5, '#d85a4a');
      u.px(c, hx - 2, hy - 4, 4, 8, '#f8c090');
      u.px(c, hx - 1, hy + 7, 3, 2, '#6a442c');
      // At arabası (orta şeritte)
      var ax = Math.round(((W * 0.10 + t * 8) % (W + 44)) - 22);
      atArabasi(u, c, ax, st.yMid + 3, 0.95, '#4a362a', '#6e4e38', '#2a2a34', Math.floor(t * 4) % 2);
      // İlk otomobil (ön şeritte)
      var cx = Math.round(((W * 0.72 + t * 14) % (W + 36)) - 18);
      arabaYan(u, c, cx, st.yNear, 1.15, '#3a4a3a', '#6a442c', '#f8d080', 1, '#fff4c8');
      // Yürüyen Parisli + köpek
      var px2 = Math.round(((W * 0.80 - t * 5) % (W + 20) + (W + 20)) % (W + 20)) - 10;
      insan(u, c, px2, st.yNear + 1, 1.1, '#4a384a', '#241c24', Math.floor(t * 4));
      hayvan(u, c, px2 + 7, st.yNear + 1, 1.2, '#8a6848', Math.floor(t * 5) % 2);
      u.birds(c, t, W, G.H, 4, '#4a3a4a', 0.22);
    }
  });

  /* ================= 2) ÇANAKKALE — Çanakkale 1915 (1914–1918) ================= */
  S.register('canakkale', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), fy = feetY(G) - 4, R = u.rng(511);
      fastBands(u, c, ['#3a3048', '#7a4a5a', '#d8704a', '#f0b070'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), g - sz(G, 0.09), sz(G, 0.06), ['#d8704a', '#f0b070', '#ffe4a8'], g);
      // Katmanlı Gelibolu sırtları
      u.profile(c, 0, W, function (x) { return g - 15 - 6 * Math.sin(x / 41 + 1); }, g, '#6a4a58', '#8e6874');
      u.profile(c, 0, W, function (x) { return g - 10 - 6 * Math.sin(x / 35) - 3 * Math.sin(x / 12); }, g, '#4e3c4c', '#7a5a68');

      // Sağda Çanakkale Boğazı su şeridi
      var seaX = Math.round(W * 0.56);
      u.px(c, seaX, g - 6, W - seaX, 10, '#3a4a62');
      u.px(c, seaX, g - 6, W - seaX, 1, '#8a7a88');

      // Sol: Kilitbahir Kalesi + tabya
      var kx = xl(G, 0.44), kh = sz(G, 0.22), kw = sz(G, 0.16);
      u.px(c, kx - Math.round(kw * 0.6), g - Math.round(kh * 0.55), Math.round(kw * 1.2), Math.round(kh * 0.55) + 2, '#6a6058');
      u.px(c, kx - Math.round(kw * 0.28), g - kh, Math.round(kw * 0.56), kh + 2, '#7e7268');
      u.px(c, kx - Math.round(kw * 0.28), g - kh, Math.round(kw * 0.56), 1, '#a89a8e');
      u.px(c, kx + Math.round(kw * 0.1), g - kh, Math.round(kw * 0.18), kh, '#524a44');
      for (var mx = kx - Math.round(kw * 0.6); mx < kx + Math.round(kw * 0.6); mx += 4) {
        u.px(c, mx, g - Math.round(kh * 0.55) - 2, 2, 2, '#7e7268');
      }
      var gx = xl(G, 0.78);
      u.px(c, gx - 4, g - 3, 8, 5, '#4e483c');
      u.px(c, gx, g - 5, 9, 2, '#3a3e38');
      u.circle(c, gx + 1, g, 2, '#2e2a24');
      var fx = kx, fyFlag = g - kh - sz(G, 0.10);
      u.px(c, fx, fyFlag, 1, sz(G, 0.10), '#e8dcc8');

      // Sağ: uzakta gri zırhlı silueti + siper hattı
      var bx = xr(G, 0.65);
      u.px(c, bx - 12, g - 8, 24, 3, '#4a505e');
      u.px(c, bx - 6, g - 11, 10, 3, '#58606e');
      u.px(c, bx - 3, g - 14, 2, 3, '#3a404c');
      u.px(c, bx + 1, g - 14, 2, 3, '#3a404c');
      u.profile(c, xr(G, 0.0), W, function (x) { return g + 1 + 2 * Math.sin(x / 7); }, g + 9, '#5a4e3c', '#8a7a5e');

      // Zemin (3 perspektifli şerit: toprak, tahkimat siperleri, çadırlar, katırlar, sandıklar, ot tutamları)
      fastBands(u, c, ['#74664e', '#5a4e3c', '#3e362a'], g + 4, H, W, 7);
      groundTex(u, c, R, W, g + 4, fy, ['#8a7a5e', '#4a5e38', '#342c22'], 54, 'tuft');

      function sandik(sx, sy, w, h) {
        u.px(c, sx, sy - h, w, h, '#7a5c3a');
        u.px(c, sx, sy - h, w, 1, '#9c784e');
        u.px(c, sx + 1, sy - h + 1, w - 2, h - 2, '#62482c');
        u.px(c, sx + 1, sy - Math.floor(h / 2), w - 2, 1, '#8c6a42');
      }
      function katir(kx, ky, dir) {
        u.px(c, kx, ky - 7, 9, 4, '#5a4636'); // gövde
        u.px(c, kx + 2, ky - 8, 5, 2, '#8a7658'); // semer/yük
        u.px(c, kx + (dir < 0 ? -2 : 8), ky - 10, 3, 4, '#5a4636'); // boyun/baş
        u.px(c, kx + 1, ky - 3, 1, 3, '#463428');
        u.px(c, kx + 7, ky - 3, 1, 3, '#463428');
      }
      function siper(sx, sy, sw) {
        u.px(c, sx, sy - 2, sw, 4, '#362c22'); // siper çukuru
        for (var i = 0; i < sw; i += 5) {
          u.px(c, sx + i, sy - 4, 4, 2, '#9a8868');
          u.px(c, sx + i + 1, sy - 6, 4, 2, '#b09e7c');
        }
        for (var p = 2; p < sw; p += 9) u.px(c, sx + p, sy - 7, 1, 6, '#5a442e');
      }

      // Şerit 1 (ufka yakın: çadır kampı + küçük zeytin ağaçları)
      for (var ti = 0; ti < 4; ti++) {
        var tx = Math.round(W * (0.05 + ti * 0.07));
        u.poly(c, [[tx - 6, g + 7], [tx, g + 1], [tx + 6, g + 7]], '#a89a82');
        u.px(c, tx - 1, g + 4, 2, 3, '#4a3c2e');
      }
      for (ti = 0; ti < 2; ti++) {
        tx = Math.round(W * (0.72 + ti * 0.09));
        u.poly(c, [[tx - 5, g + 7], [tx, g + 2], [tx + 5, g + 7]], '#9a8c76');
      }
      agac(u, c, Math.round(W * 0.34), g + 6, 0.45, '#586248', '#747e60', '#4a3c2e');
      agac(u, c, Math.round(W * 0.67), g + 6, 0.45, '#586248', '#747e60', '#4a3c2e');

      // Şerit 2 (orta: tahkimat siperleri, sandık yığınları, katırlar, ağaç)
      var yMid = Math.min(fy - 16, g + Math.round((fy - g) * 0.44));
      agac(u, c, Math.round(W * 0.04), yMid, 1.05, '#3e4e34', '#5a6e48', '#3e2e20');
      siper(Math.round(W * 0.08), yMid + 1, Math.round(W * 0.16));
      sandik(Math.round(W * 0.26), yMid + 1, 9, 6);
      sandik(Math.round(W * 0.27), yMid - 5, 7, 5);
      katir(Math.round(W * 0.16), yMid - 1, 1);

      siper(Math.round(W * 0.72), yMid + 1, Math.round(W * 0.18));
      sandik(Math.round(W * 0.68), yMid + 1, 8, 6);
      katir(Math.round(W * 0.86), yMid, -1);

      // Şerit 3 (ön plan: büyük sandıklar, siper köşesi, yoğun ot tutamları, gelincikler, asker)
      var yNear = Math.min(fy - 2, g + Math.round((fy - g) * 0.84));
      siper(Math.round(W * 0.03), yNear, Math.round(W * 0.13));
      sandik(Math.round(W * 0.80), yNear, 10, 7);
      sandik(Math.round(W * 0.83), yNear - 7, 8, 6);
      for (var i = 0; i < 36; i++) {
        var px2 = i < 18 ? Math.floor(R() * W * 0.34) : Math.floor(W * 0.66 + R() * W * 0.34);
        var py2 = g + 8 + Math.floor(R() * Math.max(4, fy - g - 10));
        u.px(c, px2, py2, 1, 3, '#4a5e38');
        u.px(c, px2 + 2, py2 - 1, 1, 4, '#5a6e44');
        if (i % 2 === 0) u.px(c, px2, py2 - 2, 2, 2, '#c8282f');
      }
      insan(u, c, Math.round(W * 0.21), yNear, 1.15, '#5a523c', '#4a4230', 0);
      insan(u, c, Math.round(W * 0.75), yNear, 1.1, '#5a523c', '#4a4230', 1);
      agac(u, c, Math.round(W * 0.94), yNear, 1.3, '#32442c', '#4a6040', '#3a2c1e');

      return {
        g: g, yMid: yMid, yNear: yNear, fx: fx + 1, fy: fyFlag, fw: Math.max(9, sz(G, 0.06)),
        bx: bx, seaX: seaX, clouds: u.makeClouds(u.rng(512), 5, W, H, 0.05, 0.26)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.5, W, ['#5a3a4a', '#8a505a', '#c87058', '#f0a878']);
      u.flag(c, st.fx, st.fy, st.fw, Math.floor(t * 4) % 2);
      // Nusret mayın gemisi
      var span = Math.max(30, W - st.seaX);
      var nx = st.seaX + Math.round((t * 4) % span);
      var ny = st.g - 6;
      u.px(c, nx, ny, 16, 3, '#464e58');
      u.px(c, nx + 4, ny - 3, 7, 3, '#68707a');
      u.px(c, nx + 7, ny - 6, 2, 3, '#2e343c');
      u.smoke(c, nx + 8, ny - 6, t, '#9a8888', 0.6);
      u.smoke(c, st.bx, st.g - 14, t * 0.8, '#b89890', 0.8);
      for (var i = 0; i < 8; i++) {
        var sx = st.seaX + ((i * 29 + Math.floor(t * 3) * 5) % span);
        u.px(c, sx, st.g - 4 + (i % 3), 2, 1, '#f0b070');
      }
      // İkmal kervanı (erzak at arabası + yedek katır)
      var cx = Math.round(((W * 0.14 + t * 5) % (W + 48)) - 24);
      atArabasi(u, c, cx, st.yMid + 4, 0.95, '#6a563c', '#5a402c', null, Math.floor(t * 3) % 2);
      u.px(c, cx - 12, st.yMid - 3, 8, 4, '#5a4636');
      u.px(c, cx - 10, st.yMid - 5, 4, 2, '#8a7658');
      u.px(c, cx - 11, st.yMid + 1, 1, 3, '#463428');
      u.px(c, cx - 6, st.yMid + 1, 1, 3, '#463428');
      // Yürüyen haberci
      var hx = Math.round(((W * 0.84 - t * 6) % (W + 20) + (W + 20)) % (W + 20)) - 10;
      insan(u, c, hx, st.yNear, 1.15, '#6a6048', '#524a36', Math.floor(t * 4));
      u.birds(c, t, W, G.H, 4, '#f0d8c8', 0.22);
    }
  });

  /* ================= 3) İKİNCİ DÜNYA SAVAŞI — Londra Blitz (1939–1945) ================= */
  S.register('ikinci_dunya', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), fy = feetY(G) - 4, R = u.rng(521);
      fastBands(u, c, ['#0e1222', '#1e2a44', '#3a4a6a'], 0, g, W, 11);
      u.stars(c, R, 36, W, g - 12, '#c8d4e8');
      // Ay halesi
      var mx = Math.round(W * 0.52), my = Math.round(H * 0.15);
      u.circle(c, mx, my, 6, 'rgba(200,212,232,0.18)');
      u.circle(c, mx, my, 4, '#e0e8f4');
      u.circle(c, mx + 2, my - 1, 3, '#1a243c');

      // Katmanlı şehir silueti
      skyline(u, c, 0, W, g, '#222c44', '#384666', R, 10, 24);
      skyline(u, c, 0, W, g, '#161e32', '#283450', R, 6, 16);

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

      // Sağ: kırmızı telefon kulübesi + park etmiş çift katlı otobüs
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

      // Zemin (3 perspektifli şerit: karartma sokağı, kum torbası duvarı, itfaiye/ambulans, barikat, moloz)
      fastBands(u, c, ['#4c505c', '#383c46', '#262830'], g, H, W, 7);
      u.px(c, 0, g, W, 2, '#686e7c');
      groundTex(u, c, R, W, g, fy, ['#5a606e', '#404450', '#1e2028'], 42, 'cobble');

      // Şerit 1 (uzak: sokak direkleri)
      sokakLamba(u, c, Math.round(W * 0.08), g + 6, 9, '#383e4c', '#707888');
      sokakLamba(u, c, Math.round(W * 0.42), g + 6, 8, '#383e4c', '#707888');
      sokakLamba(u, c, Math.round(W * 0.58), g + 6, 8, '#383e4c', '#707888');
      sokakLamba(u, c, Math.round(W * 0.92), g + 6, 9, '#383e4c', '#707888');

      // Şerit 2 (orta: kum torbası duvarları, itfaiye aracı silueti, sokak lambaları, posta kutusu)
      var yMid = Math.min(fy - 16, g + Math.round((fy - g) * 0.44));
      sokakLamba(u, c, Math.round(W * 0.14), yMid, 17, '#2a2e38', '#e8d890');
      sokakLamba(u, c, Math.round(W * 0.86), yMid, 17, '#2a2e38', '#e8d890');
      // Kum torbası duvarı (sol)
      for (var sb = 0; sb < 6; sb++) {
        u.px(c, Math.round(W * 0.04) + sb * 5, yMid - 2, 4, 2, '#7a7058');
        u.px(c, Math.round(W * 0.04) + sb * 5 + 2, yMid - 4, 4, 2, '#8c8268');
        if (sb < 4) u.px(c, Math.round(W * 0.04) + sb * 5 + 4, yMid - 6, 4, 2, '#9a8e72');
      }
      // Park etmiş itfaiye aracı (sağ, ~30px)
      var fx2 = Math.round(W * 0.68);
      arabaYan(u, c, fx2, yMid + 1, 1.15, '#982e26', '#78221c', '#d8d090', -1, '#f8e090');
      u.px(c, fx2 + 6, yMid - 12, 18, 2, '#c8b080'); // üst merdiven
      u.px(c, Math.round(W * 0.88), yMid - 10, 5, 10, '#9a3228'); // kırmızı posta kutusu
      u.px(c, Math.round(W * 0.88), yMid - 11, 5, 1, '#c04a3e');

      // Şerit 3 (ön plan: ahşap barikat, yıkık moloz yığını, kum torbası, sivil yayalar)
      var yNear = Math.min(fy - 2, g + Math.round((fy - g) * 0.84));
      // Yıkık moloz (tuğla/taş öbeği + ahşap kiriş, şiddet yok)
      var mx2 = Math.round(W * 0.03);
      u.px(c, mx2, yNear - 4, 18, 4, '#5a4e4a');
      u.px(c, mx2 + 3, yNear - 7, 11, 3, '#6e5e58');
      u.px(c, mx2 + 6, yNear - 9, 5, 2, '#82706a');
      u.px(c, mx2 + 1, yNear - 6, 12, 2, '#4a3828'); // kiriş
      // Ahşap sokak barikatı (siyah-beyaz şeritli)
      var bx3 = Math.round(W * 0.24);
      u.px(c, bx3 + 2, yNear - 9, 2, 9, '#4a3c30');
      u.px(c, bx3 + 18, yNear - 9, 2, 9, '#4a3c30');
      for (var bi = 0; bi < 22; bi += 4) {
        u.px(c, bx3 + bi, yNear - 8, 2, 3, '#d8d8d0');
        u.px(c, bx3 + bi + 2, yNear - 8, 2, 3, '#282a32');
      }
      // Sağ ön kum torbası + moloz
      for (sb = 0; sb < 5; sb++) {
        u.px(c, Math.round(W * 0.78) + sb * 5, yNear - 2, 4, 2, '#7a7058');
        u.px(c, Math.round(W * 0.78) + sb * 5 + 2, yNear - 4, 4, 2, '#92866c');
      }
      insan(u, c, Math.round(W * 0.18), yNear, 1.15, '#343a48', '#4a5262', 0);
      insan(u, c, Math.round(W * 0.74), yNear, 1.1, '#2a303c', '#3e4656', 1);

      return {
        g: g, yMid: yMid, yNear: yNear, sx: sx,
        bx1: xr(G, 0.20), bx2: xr(G, 0.66),
        clouds: u.makeClouds(u.rng(522), 3, W, H, 0.08, 0.24)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W, g = st.g;
      u.drawClouds(c, st.clouds, t * 0.4, W, ['#182034', '#222c44', '#2c3854', '#384666']);
      // 3 ışıldak hüzmesi
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
      // 2 baraj balonu (oval gövde, kuyruk, kesintisiz halat)
      barajBalonu(u, c, st.bx1, Math.round(G.H * 0.28 + Math.sin(t * 1.1) * 2), g, '#7e8490', '#a8b0bc', '#565c68');
      barajBalonu(u, c, st.bx2, Math.round(G.H * 0.20 + Math.sin(t * 1.1 + 2) * 2), g, '#7e8490', '#a8b0bc', '#565c68');

      // Uzakta devriye uçakları
      for (i = 0; i < 3; i++) {
        var ax = Math.round(((t * (10 + i * 2) + i * 70) % (W + 30)) - 15);
        var ay = Math.round(G.H * (0.14 + i * 0.06));
        u.px(c, ax, ay, 5, 1, '#1e2436');
        u.px(c, ax + 2, ay - 2, 1, 5, '#1e2436');
      }
      u.smoke(c, st.sx - 12, g - 8, t * 0.7, '#4a5060', 0.9);
      // Sivil ambulans / Austin taksi (~28px)
      var cx = Math.round(((W * 0.16 + t * 13) % (W + 36)) - 18);
      arabaYan(u, c, cx, st.yMid + 4, 1.05, '#c8c8be', '#d8d8d0', '#4a5a68', 1, '#f8f0b0');
      // Hareketli bisikletli (ön şeritte)
      var bx4 = Math.round(((W * 0.22 + t * 15) % (W + 28)) - 14);
      bisikletli(u, c, bx4, st.yNear, 1.05, '#8a909e', '#3a4254', 1, Math.floor(t * 6) % 2);
      // Yürüyen sivil
      var px2 = Math.round(((W * 0.78 - t * 6) % (W + 20) + (W + 20)) % (W + 20)) - 10;
      insan(u, c, px2, st.yNear + 1, 1.15, '#2e3442', '#4a5264', Math.floor(t * 4));
    }
  });

  /* ================= 4) BM NEW YORK — Savaş Sonrası New York (1946–1956) ================= */
  S.register('bm_newyork', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), fy = feetY(G) - 4, R = u.rng(531);
      fastBands(u, c, ['#4a7ab8', '#7aa8dc', '#a8d0f0'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), Math.round(H * 0.16), sz(G, 0.045), ['#f8e8a8', '#fff4cc', '#ffffff'], g);
      skyline(u, c, 0, W, g, '#8eb2d4', '#b0cef0', R, 12, 30);
      skyline(u, c, 0, W, g, '#7a9ec2', '#9abce0', R, 8, 22);

      // Sol: BM Genel Merkezi
      var ux = xl(G, 0.35), uw = sz(G, 0.12), uh = sz(G, 0.42);
      u.px(c, ux, g - uh, uw, uh + 2, '#5a8a8a');
      u.px(c, ux + uw, g - uh, Math.max(3, Math.round(uw * 0.25)), uh + 2, '#c8b8a0');
      u.px(c, ux, g - uh, uw + Math.max(3, Math.round(uw * 0.25)), 1, '#f0f0e8');
      for (var wy = g - uh + 3; wy < g - 4; wy += 4) {
        u.px(c, ux + 1, wy, uw - 2, 2, wy % 8 === 0 ? '#7ab8b8' : '#4a7676');
      }
      u.px(c, ux - Math.round(uw * 0.8), g - Math.round(uh * 0.25), Math.round(uw * 0.8), Math.round(uh * 0.25) + 2, '#c8b8a0');
      var poles = [];
      for (var i = 0; i < 5; i++) {
        var px2 = xl(G, 0.12 + i * 0.15);
        u.px(c, px2, g - 16, 1, 18, '#f0f0e8');
        poles.push(px2);
      }

      // Sağ: Empire State + Chrysler
      var ex = xr(G, 0.35), ew = sz(G, 0.11), eh = sz(G, 0.54);
      u.px(c, ex - Math.round(ew * 0.6), g - Math.round(eh * 0.22), Math.round(ew * 1.2), Math.round(eh * 0.22) + 2, '#c8b8a0');
      u.px(c, ex - Math.round(ew * 0.42), g - Math.round(eh * 0.72), Math.round(ew * 0.84), Math.round(eh * 0.72) + 2, '#c8b8a0');
      u.px(c, ex + Math.round(ew * 0.15), g - Math.round(eh * 0.72), Math.round(ew * 0.27), Math.round(eh * 0.72) + 2, '#a2927c');
      u.px(c, ex - Math.round(ew * 0.22), g - Math.round(eh * 0.85), Math.round(ew * 0.44), Math.round(eh * 0.14), '#d8cbb4');
      u.px(c, ex, g - eh, 1, Math.round(eh * 0.16), '#f0f0e8');
      for (var wx = ex - Math.round(ew * 0.32); wx <= ex + Math.round(ew * 0.1); wx += 3) {
        u.px(c, wx, g - Math.round(eh * 0.68), 1, Math.round(eh * 0.46), '#6a7a8a');
      }
      var cx2 = xr(G, 0.74), ch = sz(G, 0.40), cw = sz(G, 0.08);
      u.px(c, cx2 - Math.round(cw * 0.5), g - Math.round(ch * 0.72), cw, Math.round(ch * 0.72) + 2, '#b8b0a8');
      for (var s = 0; s < 3; s++) {
        var rw = Math.max(2, Math.round(cw * (0.45 - s * 0.12)));
        u.halfDisc(c, cx2, g - Math.round(ch * 0.72) - s * 3, rw, s % 2 ? '#e8e8f0' : '#b8c4d0');
      }
      u.px(c, cx2, g - ch, 1, Math.round(ch * 0.2), '#f0f0f8');

      // Zemin (3 perspektifli şerit: plaza ağacı, yangın musluğu, gazete bayii, taksiler)
      fastBands(u, c, ['#747880', '#585b62', '#3c3e44'], g, H, W, 7);
      u.px(c, 0, g, W, 2, '#92969e');
      groundTex(u, c, R, W, g, fy, ['#8a8e96', '#646870', '#2c2e34'], 34, 'cobble');

      // Şerit 1 (ufka yakın: plaza ağaçları, soluk figürler)
      agac(u, c, Math.round(W * 0.07), g + 5, 0.48, '#5a8264', '#78a280', '#4a3e38');
      agac(u, c, Math.round(W * 0.30), g + 5, 0.48, '#5a8264', '#78a280', '#4a3e38');
      agac(u, c, Math.round(W * 0.70), g + 5, 0.48, '#5a8264', '#78a280', '#4a3e38');
      insan(u, c, Math.round(W * 0.45), g + 6, 0.48, '#5a6878', '#788696', 0);

      // Şerit 2 (orta: sokak lambaları, sosisli/gazete arabası, ağaç)
      var yMid = Math.min(fy - 16, g + Math.round((fy - g) * 0.42));
      sokakLamba(u, c, Math.round(W * 0.14), yMid, 17, '#2c3038', '#f8e8a8');
      sokakLamba(u, c, Math.round(W * 0.86), yMid, 17, '#2c3038', '#f8e8a8');
      tezgah(u, c, Math.round(W * 0.71), yMid + 2, 1.05, '#6a5848', '#d84040', '#f0f0e8');
      agac(u, c, Math.round(W * 0.28), yMid + 2, 0.95, '#3a6a44', '#548c5e', '#4a3424');

      // Şerit 3 (ön plan: yangın musluğu, gazete kutusu, ağaç, takım elbiseli yayalar)
      var yNear = Math.min(fy - 2, g + Math.round((fy - g) * 0.84));
      u.px(c, Math.round(W * 0.25), yNear - 8, 3, 8, '#c83828'); // yangın musluğu
      u.px(c, Math.round(W * 0.25) - 1, yNear - 6, 5, 2, '#e8e8f0');
      u.px(c, Math.round(W * 0.73), yNear - 9, 5, 9, '#2a4a8a'); // mavi posta/gazete kutusu
      u.px(c, Math.round(W * 0.73) + 1, yNear - 7, 3, 2, '#e8e8f0');
      agac(u, c, Math.round(W * 0.05), yNear, 1.35, '#3a6a44', '#548c5e', '#4a3424');
      agac(u, c, Math.round(W * 0.95), yNear, 1.3, '#3a6a44', '#548c5e', '#4a3424');
      insan(u, c, Math.round(W * 0.15), yNear, 1.15, '#2a303c', '#585c68', 0);
      insan(u, c, Math.round(W * 0.89), yNear, 1.15, '#2a303c', '#585c68', 1);

      return {
        g: g, yMid: yMid, yNear: yNear, poles: poles,
        clouds: u.makeClouds(u.rng(532), 5, W, H, 0.05, 0.26)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.7, W, ['#b8cce0', '#d8e6f4', '#eef6fc', '#ffffff']);
      var fcols = ['#3a7ad0', '#d84040', '#40a858', '#e8c020', '#e8e8f0'];
      for (var i = 0; i < st.poles.length; i++) {
        var dy = ((Math.floor(t * 4) + i) % 2);
        u.px(c, st.poles[i] + 1, st.g - 16 + dy, 4, 3, fcols[i]);
      }
      // 2 sarı taksi (farklı perspektif şeritlerinde, ~27-32px)
      var tx1 = Math.round(((W * 0.16 + t * 18) % (W + 36)) - 18);
      arabaYan(u, c, tx1, st.yMid + 3, 1.05, '#e8c020', '#f8e050', '#3a4a5a', 1, '#fff4cc');
      var tx2 = Math.round(((W * 0.76 - t * 22) % (W + 38) + (W + 38)) % (W + 38)) - 19;
      arabaYan(u, c, tx2, st.yNear, 1.22, '#e8c020', '#f8e050', '#3a4a5a', -1, '#fff4cc');
      // Yürüyen New Yorklu
      var px2 = Math.round(((W * 0.80 + t * 7) % (W + 20)) - 10);
      insan(u, c, px2, st.yNear + 1, 1.15, '#343a48', '#7a7e88', Math.floor(t * 4));
      u.birds(c, t, W, G.H, 4, '#3a4a5a', 0.22);
    }
  });

  /* ================= 5) AY'A İNİŞ — Apollo 11 (1969–1975) ================= */
  S.register('ay_inisi', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), fy = feetY(G) - 4, R = u.rng(541);
      fastBands(u, c, ['#05060c', '#0c0e18', '#141724'], 0, g, W, 8);
      u.stars(c, R, 56, W, g - 6, '#e8e8f0');
      // Gökte yarım mavi-yeşil Dünya + atmosfer halesi
      var ex = xr(G, 0.18), ey = Math.round(H * 0.18), er = sz(G, 0.055);
      u.circle(c, ex, ey, er + 2, 'rgba(90,160,240,0.22)');
      u.circle(c, ex, ey, er, '#05060c');
      u.halfDisc(c, ex, ey, er, '#3a7ad0');
      u.px(c, ex - Math.round(er * 0.4), ey - Math.round(er * 0.6), Math.max(2, Math.round(er * 0.5)), Math.max(2, Math.round(er * 0.4)), '#50a868');
      u.px(c, ex - Math.round(er * 0.2), ey - Math.round(er * 0.3), Math.max(2, Math.round(er * 0.6)), 1, '#e8e8f0');

      // Katmanlı uzak krater sırtları ve tepeler
      u.profile(c, 0, W, function (x) { return g - 12 - 5 * Math.sin(x / 37) - 3 * Math.cos(x / 17); }, g, '#20222c', '#343640');
      u.profile(c, 0, W, function (x) { return g - 7 - 3 * Math.sin(x / 25); }, g, '#2e303a', '#484a54');
      u.profile(c, 0, W, function (x) { return g - 3 - 2 * Math.sin(x / 15) - 2 * Math.cos(x / 7); }, g, '#3e404a', '#5e606a');

      // Sol: Ay Modülü
      var lx = xl(G, 0.42), lw = sz(G, 0.14), lh = sz(G, 0.18);
      var legSpan = Math.round(lw * 0.85);
      u.poly(c, [[lx - Math.round(lw * 0.4), g - Math.round(lh * 0.3)], [lx - legSpan, g + 3], [lx - legSpan + 2, g + 3], [lx - Math.round(lw * 0.3), g - Math.round(lh * 0.3)]], '#b89028');
      u.poly(c, [[lx + Math.round(lw * 0.4), g - Math.round(lh * 0.3)], [lx + legSpan, g + 3], [lx + legSpan - 2, g + 3], [lx + Math.round(lw * 0.3), g - Math.round(lh * 0.3)]], '#9a7218');
      u.px(c, lx - legSpan - 2, g + 3, 5, 1, '#d8a830');
      u.px(c, lx + legSpan - 3, g + 3, 5, 1, '#d8a830');
      u.px(c, lx - Math.round(lw * 0.5), g - Math.round(lh * 0.48), lw, Math.round(lh * 0.36), '#d8a830');
      u.px(c, lx + Math.round(lw * 0.15), g - Math.round(lh * 0.48), Math.round(lw * 0.35), Math.round(lh * 0.36), '#9a7218');
      u.px(c, lx - Math.round(lw * 0.5), g - Math.round(lh * 0.48), lw, 1, '#f8d868');
      var uw = Math.round(lw * 0.72), uh = Math.round(lh * 0.48);
      u.px(c, lx - Math.round(uw * 0.5), g - Math.round(lh * 0.96), uw, uh, '#8a8a90');
      u.px(c, lx - Math.round(uw * 0.5), g - Math.round(lh * 0.96), uw, 1, '#c8c8cc');
      u.px(c, lx - Math.round(uw * 0.25), g - Math.round(lh * 0.8), 3, 2, '#1a1c26');
      u.px(c, lx + Math.round(uw * 0.05), g - Math.round(lh * 0.8), 3, 2, '#1a1c26');

      // Düz tek renkli dikdörtgen bayrak (tel destekli; şerit/yıldız/kanton yok)
      var fx = xl(G, 0.82), fyFlag = g - sz(G, 0.13);
      u.px(c, fx, fyFlag, 1, sz(G, 0.13) + 3, '#c8c8cc'); // dikey direk
      u.px(c, fx + 1, fyFlag, 10, 1, '#e8e8f0'); // üst destek teli
      u.px(c, fx + 1, fyFlag + 1, 10, 6, '#e87828'); // düz turuncu bayrak
      u.px(c, fx + 1, fyFlag + 1, 10, 1, '#f8a050');

      // Zemin (3 perspektifli şerit: gri regolith, elips kraterler, kaya yığınları, ayak izleri, bilim aletleri)
      fastBands(u, c, ['#8a8a90', '#6a6a70', '#4e4e54'], g, H, W, 7);
      groundTex(u, c, R, W, g, fy, ['#a4a4ac', '#74747c', '#3c3c42'], 64, 'cobble');

      var yMid = Math.min(fy - 16, g + Math.round((fy - g) * 0.44));
      var yNear = Math.min(fy - 2, g + Math.round((fy - g) * 0.84));

      // Perspektifli elips kraterler (ufka yakın küçük, ön planda büyük; kenarlarda yoğun)
      krater(u, c, Math.round(W * 0.07), g + 6, 6, 2);
      krater(u, c, Math.round(W * 0.48), g + 6, 5, 2);
      krater(u, c, Math.round(W * 0.90), g + 6, 6, 2);
      krater(u, c, Math.round(W * 0.14), yMid, 11, 3);
      krater(u, c, Math.round(W * 0.84), yMid, 12, 3);
      krater(u, c, Math.round(W * 0.22), yNear - 2, 18, 5);
      krater(u, c, Math.round(W * 0.89), yNear - 2, 16, 5);

      // Kaya yığınları (sol ve sağ)
      var piles = [
        [Math.round(W * 0.04), yMid + 2, 1.0],
        [Math.round(W * 0.30), yMid + 1, 0.8],
        [Math.round(W * 0.70), yMid + 2, 0.9],
        [Math.round(W * 0.05), yNear, 1.3],
        [Math.round(W * 0.95), yNear, 1.2]
      ];
      for (var i = 0; i < piles.length; i++) {
        var rx = piles[i][0], ry = piles[i][1], sc = piles[i][2];
        var rw = Math.round(7 * sc), rh = Math.round(4 * sc);
        u.px(c, rx, ry - rh, rw, rh, '#686870');
        u.px(c, rx, ry - rh, rw, 1, '#b8b8c2');
        u.px(c, rx + rw - 1, ry - Math.round(rh * 0.7), Math.round(5 * sc), Math.round(rh * 0.7), '#52525a');
        u.px(c, rx - 3, ry - 2, 4, 2, '#7a7a84');
      }

      // Ayak izi dizileri (LM'den bayrağa ve bilim istasyonuna)
      for (i = 0; i < 12; i++) {
        var fxStep = lx + 10 + i * 5;
        var fyStep = g + 5 + (i % 2) * 2 + Math.floor(i * 0.6);
        if (fxStep < W * 0.35) u.px(c, fxStep, fyStep, 2, 1, '#363840');
      }
      for (i = 0; i < 10; i++) {
        u.px(c, Math.round(W * 0.14) + i * 5, yMid + 5 + (i % 2) * 2, 2, 1, '#363840');
        u.px(c, Math.round(W * 0.68) + i * 5, yNear - 1 + (i % 2) * 2, 2, 1, '#363840');
      }

      // Bilimsel ölçüm istasyonu (ALSEP, sol ön)
      var sx2 = Math.round(W * 0.11), sy2 = yNear;
      u.px(c, sx2, sy2 - 8, 8, 5, '#d8a830');
      u.px(c, sx2 + 1, sy2 - 8, 6, 1, '#f8d868');
      u.px(c, sx2 + 1, sy2 - 3, 1, 4, '#a8a8b0');
      u.px(c, sx2 + 6, sy2 - 3, 1, 4, '#a8a8b0');
      u.px(c, sx2 + 4, sy2 - 14, 1, 6, '#e8e8f0');
      u.px(c, sx2 - 4, sy2 - 6, 4, 2, '#3a68b8'); // güneş paneli
      u.px(c, sx2 + 8, sy2 - 1, 10, 1, '#3a3c44'); // yer kablosu

      // İkinci bilim aleti (kamera/reflektör üçayağı, sağ orta)
      var rx2 = Math.round(W * 0.74), ry2 = yMid + 1;
      u.px(c, rx2 - 2, ry2 - 5, 1, 5, '#b8b8c2');
      u.px(c, rx2 + 2, ry2 - 5, 1, 5, '#b8b8c2');
      u.px(c, rx2 - 2, ry2 - 8, 5, 3, '#d8d8e0');
      u.px(c, rx2, ry2 - 7, 2, 1, '#40e0e0');

      // İlk astronot (bilim istasyonu yanında çalışan, ~15px)
      var a1x = Math.round(W * 0.28), a1y = yNear;
      u.px(c, a1x - 3, a1y - 11, 2, 6, '#b0b0b8'); // sırt çantası
      u.px(c, a1x - 1, a1y - 12, 5, 7, '#e8e8f0'); // gövde
      u.px(c, a1x, a1y - 16, 4, 4, '#e8e8f0'); // kask
      u.px(c, a1x + 2, a1y - 15, 2, 2, '#d8a830'); // vizör
      u.px(c, a1x - 1, a1y - 5, 2, 5, '#c8c8cc');
      u.px(c, a1x + 2, a1y - 5, 2, 5, '#c8c8cc');

      var tw = [];
      for (i = 0; i < 8; i++) tw.push([Math.floor(R() * W), Math.floor(R() * (g - 10))]);
      return {
        g: g, yMid: yMid, yNear: yNear,
        ax: Math.round(W * 0.79), tw: tw
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      for (var i = 0; i < st.tw.length; i++) {
        if (Math.floor(t * 3 + i) % 2 === 0) u.px(c, st.tw[i][0], st.tw[i][1], 1, 1, '#ffffff');
      }
      // Yörüngede komuta modülü
      var ox = Math.round((t * 10) % (W + 20)) - 10, oy = Math.round(G.H * 0.12);
      u.px(c, ox, oy, 5, 2, '#c8c8cc');
      u.px(c, ox + 5, oy, 2, 2, '#e8e8f0');
      // Ay Rover (orta şeritte yavaşça ilerler, ~22px + toz tutamları)
      var rx = Math.round(((W * 0.15 + t * 5) % (W + 34)) - 17);
      var ry = st.yMid + 3;
      u.px(c, rx, ry - 4, 18, 3, '#c8c8cc');
      u.px(c, rx + 4, ry - 9, 5, 5, '#e8e8f0'); // oturan astronot
      u.px(c, rx + 7, ry - 8, 2, 2, '#d8a830');
      u.px(c, rx + 13, ry - 10, 1, 6, '#d8a830'); // çanak anten direği
      u.px(c, rx + 12, ry - 11, 4, 2, '#e8e8f0');
      u.circle(c, rx + 3, ry - 1, 2, '#3a3c42');
      u.circle(c, rx + 15, ry - 1, 2, '#3a3c42');
      // Rover tekerlek toz tutamları
      var dp = Math.floor(t * 6) % 3;
      u.px(c, rx - 3 - dp, ry - 1, 2, 1, '#b8b8c0');
      u.px(c, rx - 6 - dp, ry - 2, 2, 1, '#9a9aa2');

      // İkinci astronot (düşük yerçekiminde zıplama, ~15px + inişte toz tutamı)
      var jump = Math.round(Math.abs(Math.sin(t * 2.0)) * 6);
      var ax = st.ax, ay = st.yNear - jump;
      u.px(c, ax - 3, ay - 11, 2, 6, '#b0b0b8');
      u.px(c, ax - 1, ay - 12, 5, 7, '#e8e8f0');
      u.px(c, ax, ay - 16, 4, 4, '#e8e8f0');
      u.px(c, ax + 2, ay - 15, 2, 2, '#d8a830');
      u.px(c, ax - 1, ay - 5, 2, 5, '#c8c8cc');
      u.px(c, ax + 2, ay - 5, 2, 5, '#c8c8cc');
      if (jump <= 1) {
        u.px(c, ax - 5, st.yNear - 1, 3, 1, '#b8b8c2');
        u.px(c, ax + 5, st.yNear - 1, 3, 1, '#b8b8c2');
      }
    }
  });

  /* ================= 6) TOKYO 80'LER — Tokyo Neon (1976–1984) ================= */
  S.register('tokyo_80', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), fy = feetY(G) - 4, R = u.rng(551);
      fastBands(u, c, ['#120e2a', '#3a1e5a', '#a83a8a'], 0, g, W, 11);
      u.stars(c, R, 30, W, Math.round(g * 0.65), '#f0d0f0');

      // Uzakta Fuji Dağı (tamamen %68-100 sağ kenar bölgesinde, orta panele ve viyadüğe girmez)
      var fx = Math.round(W * 0.84), fw = Math.round(W * 0.14), fh = sz(G, 0.20);
      var fBase = g - 16; // viyadük g-8'de -> arada en az 8px boşluk
      u.poly(c, [[fx - fw, fBase], [fx - Math.round(fw * 0.16), fBase - fh], [fx + Math.round(fw * 0.16), fBase - fh], [fx + fw, fBase]], '#2a1644');
      u.poly(c, [[fx - Math.round(fw * 0.36), fBase - Math.round(fh * 0.62)], [fx - Math.round(fw * 0.16), fBase - fh], [fx + Math.round(fw * 0.16), fBase - fh], [fx + Math.round(fw * 0.36), fBase - Math.round(fh * 0.62)]], '#e8e8f0');

      // Uzak Tokyo silueti (Fuji altını kapatmayacak kadar alçak)
      skyline(u, c, 0, Math.round(W * 0.70), g, '#221840', '#4a2e70', R, 6, 16);
      skyline(u, c, Math.round(W * 0.70), W, g, '#221840', '#4a2e70', R, 3, 7);

      // Sol: Tokyo Kulesi (kırmızı-beyaz kafes)
      var tx = xl(G, 0.40), th = sz(G, 0.54), bw = sz(G, 0.11);
      var y0 = g + 2, y1 = y0 - Math.round(th * 0.36), y2 = y0 - Math.round(th * 0.68), y3 = y0 - Math.round(th * 0.90);
      lattice(u, c, tx, y1, y0, Math.round(bw * 0.55), bw, '#e03a3a', '#ff6a6a', 5);
      u.px(c, tx - Math.round(bw * 0.58), y1 - 2, Math.round(bw * 1.16), 3, '#e8e8f0');
      lattice(u, c, tx, y2, y1 - 2, Math.round(bw * 0.25), Math.round(bw * 0.50), '#e8e8f0', '#ffffff', 4);
      u.px(c, tx - Math.round(bw * 0.30), y2 - 2, Math.round(bw * 0.60), 3, '#e03a3a');
      lattice(u, c, tx, y3, y2 - 2, 2, Math.round(bw * 0.22), '#e03a3a', '#ff6a6a', 4);
      u.px(c, tx, y3 - Math.max(5, Math.round(th * 0.10)), 1, Math.max(5, Math.round(th * 0.10)), '#e8e8f0');

      // Sağ ve sol dar binalar + neon blokları (Fuji'nin solunda veya altında kalır)
      var neons = [];
      function neonBldg(bx, bbw, bbh) {
        u.px(c, bx, g - bbh, bbw, bbh + 2, '#1c1438');
        u.px(c, bx, g - bbh, bbw, 1, '#5a3a7a');
        for (var ny = g - bbh + 4; ny < g - 8; ny += 6) {
          if (R() < 0.75) neons.push([bx + 2, ny, Math.max(3, bbw - 4), 3, R() < 0.5 ? '#40e0e0' : '#f07ab0']);
        }
      }
      neonBldg(xl(G, 0.72), sz(G, 0.08), sz(G, 0.28));
      neonBldg(xr(G, 0.02), sz(G, 0.06), sz(G, 0.20));

      // Shinkansen viyadüğü (ufuk altında alçak hatta: g-8 ile g arası, Fuji tabanının 8px altında)
      var vx = Math.round(W * 0.66), vy = g - 8;
      u.px(c, vx, vy, W - vx, 3, '#4a4468');
      u.px(c, vx, vy, W - vx, 1, '#8a7ab0');
      for (var px2 = vx + 8; px2 < W; px2 += 16) u.px(c, px2, vy + 3, 3, g - vy - 1, '#2e2a44');

      // Zemin (3 perspektifli şerit: neon yansımalı asfalt, kaldırım şeridi, otomatlar, fenerler, arabalar, direkler)
      fastBands(u, c, ['#322c4a', '#221e36', '#161226'], g, H, W, 7);
      u.px(c, 0, g, W, 2, '#5a4a8a'); // kaldırım kenarı
      u.px(c, 0, g + 2, W, 1, '#8a7ab8');
      groundTex(u, c, R, W, g + 3, fy, ['#40e0e0', '#e05aa8', '#2a2444'], 44, 'cobble');

      var yMid = Math.min(fy - 16, g + Math.round((fy - g) * 0.44));
      var yNear = Math.min(fy - 2, g + Math.round((fy - g) * 0.84));

      // Kesikli yol şeritleri (kenarlarda ve orta yolda)
      for (var lx2 = 6; lx2 < W - 10; lx2 += 16) {
        if (lx2 < W * 0.34 || lx2 > W * 0.66) u.px(c, lx2, yMid + 5, 7, 1, '#9890c0');
      }

      // Yağmur birikintisi neon yansımaları (kenarlarda)
      var puddles = [
        [Math.round(W * 0.14), yNear - 2, '#40e0e0', '#f07ab0'],
        [Math.round(W * 0.28), yMid + 3, '#f07ab0', '#f8e080'],
        [Math.round(W * 0.72), yMid + 3, '#40e0e0', '#f8e080'],
        [Math.round(W * 0.84), yNear - 2, '#f07ab0', '#40e0e0']
      ];
      for (var i = 0; i < puddles.length; i++) {
        var pdx = puddles[i][0], pdy = puddles[i][1];
        u.px(c, pdx - 7, pdy, 14, 3, '#141028');
        u.px(c, pdx - 5, pdy + 1, 6, 1, puddles[i][2]);
        u.px(c, pdx + 1, pdy + 2, 4, 1, puddles[i][3]);
      }

      // Elektrik direkleri + sarkan kablolar (sol ve sağ)
      var poles = [Math.round(W * 0.04), Math.round(W * 0.31), Math.round(W * 0.69), Math.round(W * 0.96)];
      for (i = 0; i < poles.length; i++) {
        var plx = poles[i];
        u.px(c, plx, g - 28, 2, 32, '#1e1a30');
        u.px(c, plx - 3, g - 25, 8, 1, '#3a3258');
        u.px(c, plx - 2, g - 21, 6, 1, '#3a3258');
      }
      // Sol ve sağ direkler arası kablolar
      for (var kx = poles[0]; kx <= poles[1]; kx += 2) {
        var f1 = (kx - poles[0]) / Math.max(1, poles[1] - poles[0]);
        u.px(c, kx, Math.round(g - 25 + 4 * Math.sin(f1 * Math.PI)), 2, 1, '#2c2648');
      }
      for (kx = poles[2]; kx <= poles[3]; kx += 2) {
        var f2 = (kx - poles[2]) / Math.max(1, poles[3] - poles[2]);
        u.px(c, kx, Math.round(g - 25 + 4 * Math.sin(f2 * Math.PI)), 2, 1, '#2c2648');
      }

      // Şerit 1 (ufka yakın: kiraz ağaçları, parlak 80'ler Japon arabaları, uzak yaya)
      agac(u, c, Math.round(W * 0.09), g + 5, 0.48, '#4a2a5a', '#b85a98', '#2e2038');
      arabaYan(u, c, Math.round(W * 0.18), g + 7, 0.55, '#e04050', '#f06070', '#80e0e8', 1, '#fff4a0');
      arabaYan(u, c, Math.round(W * 0.76), g + 7, 0.55, '#40c8c0', '#70e8e0', '#202848', -1, '#fff4a0');
      insan(u, c, Math.round(W * 0.45), g + 6, 0.48, '#3a345a', '#5a5078', 0);

      // Şerit 2 (orta: tabelasız ışıklı otomatlar, sokak lambası)
      function otomat(ox, oy, bodyCol, glowCol) {
        u.px(c, ox, oy - 13, 8, 13, bodyCol);
        u.px(c, ox + 1, oy - 12, 6, 6, glowCol);
        u.px(c, ox + 1, oy - 4, 6, 2, '#2a2440');
      }
      otomat(Math.round(W * 0.06), yMid + 1, '#e8e8f0', '#40e0e0');
      otomat(Math.round(W * 0.11), yMid + 1, '#e04050', '#f8e080');
      otomat(Math.round(W * 0.70), yMid + 1, '#4080e0', '#f07ab0');
      sokakLamba(u, c, Math.round(W * 0.85), yMid + 1, 17, '#3a345a', '#40e0e0');

      // Şerit 3 (ön plan: izakaya kırmızı fener dizisi (yazısız), tezgah, ağaç, sırt çantalı yaya)
      tezgah(u, c, Math.round(W * 0.77), yNear, 1.15, '#2a2440', '#e04050', '#f8d080');
      // İzakaya fener dizisi (yazısız kırmızı fenerler)
      for (var fi = 0; fi < 5; fi++) {
        var lnx = Math.round(W * 0.77) + fi * 5;
        var lny = yNear - 15;
        u.px(c, lnx, lny, 4, 5, '#e03038');
        u.px(c, lnx + 1, lny + 1, 2, 3, '#ff9060');
        u.px(c, lnx + 1, lny - 1, 2, 1, '#1a1428');
      }
      agac(u, c, Math.round(W * 0.94), yNear, 1.3, '#3a244a', '#a84a88', '#2a1c34');
      insan(u, c, Math.round(W * 0.24), yNear, 1.15, '#1e1c30', '#40e0e0', 0, '#e04050'); // sırt çantalı
      insan(u, c, Math.round(W * 0.08), yNear, 1.1, '#2a2448', '#f07ab0', 1, '#f8d080');

      return {
        g: g, yMid: yMid, yNear: yNear, vx: vx, vy: vy, tx: tx,
        tipY: y3 - Math.max(5, Math.round(th * 0.10)),
        neons: neons,
        clouds: u.makeClouds(u.rng(552), 3, W, H, 0.05, 0.22)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.4, W, ['#2a1848', '#48266a', '#703a8a', '#9850a8']);
      var tick = Math.floor(t * 3);
      for (var i = 0; i < st.neons.length; i++) {
        var n = st.neons[i];
        var on = ((tick + i) % 3) !== 0;
        u.px(c, n[0], n[1], n[2], n[3], on ? n[4] : '#2a1e4a');
      }
      if (Math.floor(t * 2) % 2 === 0) u.px(c, st.tx, st.tipY - 1, 2, 2, '#ff4040');
      // 0 Serisi Shinkansen
      var span = Math.max(40, W - st.vx + 40);
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
      // 80'ler kompakt Japon otomobili (~28px, parlak renk)
      var cx = Math.round(((W * 0.16 + t * 18) % (W + 38)) - 19);
      arabaYan(u, c, cx, st.yMid + 3, 1.08, '#f0d030', '#f8e868', '#40e0e0', 1, '#fff4a0');
      // Hareketli bisikletli (ön şeritte)
      var bx3 = Math.round(((W * 0.20 + t * 14) % (W + 28)) - 14);
      bisikletli(u, c, bx3, st.yNear, 1.05, '#40e0e0', '#2a2644', 1, Math.floor(t * 6) % 2);
      // Yürüyen sırt çantalı yaya
      var px2 = Math.round(((W * 0.80 - t * 6) % (W + 20) + (W + 20)) % (W + 20)) - 10;
      insan(u, c, px2, st.yNear + 1, 1.15, '#2a2644', '#f07ab0', Math.floor(t * 4), '#40e0e0');
      u.birds(c, t, W, G.H, 3, '#5a3a7a', 0.20);
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
