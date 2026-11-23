/* PUSULLA — arkaplan paketi F (scenes/bg_f.js). Sahneler: berlin_duvari, silikon, kus_yuvasi, dubai, yeni_istanbul, mars.
 * META berlin_duvari {"min":1985,"max":1991,"label":"BERLİN DUVARI","road":["#5a5e66","#7a7e86","#3a3d42"]}
 * META silikon {"min":2001,"max":2006,"label":"WEB 2.0","road":["#4a4e58","#6a6e78","#2e3036"]}
 * META kus_yuvasi {"min":2007,"max":2009,"label":"PEKİN 2008","road":["#3a3c4a","#5a5c6a","#22232c"]}
 * META dubai {"min":2010,"max":2014,"label":"DUBAİ","road":["#b8a07a","#d8c09a","#88704e"]}
 * META yeni_istanbul {"min":2015,"max":2019,"label":"YENİ İSTANBUL","road":["#5e6068","#7e8088","#3c3e44"]}
 * META mars {"min":2020,"max":2023,"label":"MARS ÇAĞI","road":["#9a4e36","#ba6e52","#6a3222"]}
 * Kurallar: ES5, dış bağımlılık yok, global yok, yalnız S.register. */
(function (global) {
  'use strict';
  var S = global.PUSULLA && global.PUSULLA.scene;
  if (!S || !S.register) return;

  function gy(G) { return Math.round(G.H * 0.7); }
  function xl(G, f) { return Math.round(G.W * (0.10 + 0.20 * f)); }
  function xr(G, f) { return Math.round(G.W * (0.70 + 0.20 * f)); }
  function sz(G, k) { return Math.max(3, Math.round(Math.min(G.W * 0.45, G.H) * k)); }

  /* ---------- yerel yardımcılar (yalnız bu dosyada; u'ya ekleme YOK) ---------- */
  function firework(c, u, x, y, t, cols) {
    var cyc = 2.4, ph = ((t % cyc) + cyc) % cyc / cyc;
    if (ph < 0.25) {
      var ry = Math.round(y + (0.25 - ph) * 80);
      u.px(c, x, ry, 1, 2, cols[0]);
      u.px(c, x, ry + 3, 1, 2, cols[1]);
      return;
    }
    var p = (ph - 0.25) / 0.75, r = Math.round(p * 18) + 2, drop = Math.round(p * p * 5);
    var col = p < 0.35 ? cols[0] : (p < 0.7 ? cols[1] : cols[2]);
    for (var i = 0; i < 12; i++) {
      var a = i * Math.PI / 6;
      u.px(c, x + Math.round(Math.cos(a) * r), y + Math.round(Math.sin(a) * r) + drop, 1, 1, col);
      if (i % 2 === 0 && p < 0.8) {
        var r2 = Math.round(r * 0.55);
        u.px(c, x + Math.round(Math.cos(a + 0.25) * r2), y + Math.round(Math.sin(a + 0.25) * r2) + drop, 1, 1, cols[0]);
      }
    }
  }

  function palmTree(u, c, x, base, h) {
    for (var i = 0; i < h; i++) {
      u.px(c, x + Math.round(Math.sin(i / h * 1.3) * 2), base - i, 2, 1, i % 3 ? '#6a4a34' : '#4e3424');
    }
    var tx = x + Math.round(Math.sin(1.3) * 2), ty = base - h;
    var dirs = [[-1, -0.2], [-1, 0.5], [1, -0.2], [1, 0.5], [-0.4, -1], [0.4, -1]];
    for (var d = 0; d < dirs.length; d++) {
      for (var k = 0; k < 8; k++) {
        u.px(c, tx + Math.round(dirs[d][0] * k), ty + Math.round(dirs[d][1] * k + k * k * 0.06), 2, 1, k % 2 ? '#3e7a4a' : '#2c5838');
      }
    }
  }

  /* ================= berlin_duvari — BERLİN DUVARI (1985 – 1991) ================= */
  S.register('berlin_duvari', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(601);
      u.bands(c, ['#0e1424', '#1a2238', '#2a3854', '#3a4a6a'], 0, g, W, 10);
      u.stars(c, R, 34, W, Math.round(g * 0.62), '#e8e8f0');
      u.circle(c, Math.round(W * 0.5), Math.round(H * 0.14), 5, '#e8e8f0');
      u.circle(c, Math.round(W * 0.5) + 2, Math.round(H * 0.14) - 1, 4, '#1a2238');
      u.profile(c, 0, W, function (x) {
        return g - 7 - 4 * Math.sin(x / 31) - (Math.sin(x / 7) > 0.5 ? 4 : 0);
      }, g, '#222c44', '#3a4a6a');

      // Uzakta Berlin TV Kulesi (sağ kenara yakın)
      var tvx = xr(G, 0.12), tvh = sz(G, 0.48), tvTop = g - tvh;
      u.px(c, tvx - 1, tvTop + Math.round(tvh * 0.25), 2, Math.round(tvh * 0.75), '#4a5a78');
      u.px(c, tvx, tvTop, 1, Math.round(tvh * 0.25), '#8a9ab0');
      u.px(c, tvx, tvTop, 1, 2, '#e85a3a');
      u.circle(c, tvx, tvTop + Math.round(tvh * 0.28), Math.max(3, Math.round(tvh * 0.08)), '#6a7a98');
      u.px(c, tvx - 1, tvTop + Math.round(tvh * 0.26), 2, 1, '#e8e8f0');

      // Sol: Brandenburg Kapısı + Quadriga
      var bx = xl(G, 0.48), bw = sz(G, 0.34), bh = sz(G, 0.24), bTop = g - bh;
      var colW = Math.max(2, Math.round(bw * 0.08)), nCol = 6;
      u.px(c, bx - Math.round(bw / 2) - 2, g - 2, bw + 4, 2, '#5a6882');
      for (var i = 0; i < nCol; i++) {
        var cx = Math.round(bx - bw / 2 + 2 + i * (bw - colW - 4) / (nCol - 1));
        u.px(c, cx, bTop + 7, colW, bh - 9, '#7a8aa4');
        u.px(c, cx, bTop + 7, 1, bh - 9, '#b8c4d4');
        u.px(c, cx, g - 5, colW, 3, '#f0c070');
      }
      u.px(c, bx - Math.round(bw / 2) - 2, bTop + 2, bw + 4, 5, '#8a9ab0');
      u.px(c, bx - Math.round(bw / 2) - 2, bTop + 2, bw + 4, 1, '#d0dae4');
      u.px(c, bx - Math.round(bw * 0.28), bTop - 3, Math.round(bw * 0.56), 5, '#6a7a94');
      // Quadriga (4 at + araba silueti)
      var qy = bTop - 4;
      for (var q = -2; q <= 1; q++) {
        var qx = bx + q * 4;
        u.px(c, qx, qy - 3, 3, 3, '#c8d4e0');
        u.px(c, qx + 2, qy - 5, 1, 2, '#e8e8f0');
      }
      u.px(c, bx - 1, qy - 7, 2, 4, '#e8e8f0');

      // Sağ: Berlin Duvarı (yazısız soyut grafiti) + gözetleme kulesi
      var wx0 = xr(G, 0.16), ww = sz(G, 0.38), wh = sz(G, 0.14), wy = g - wh;
      u.px(c, wx0, wy, ww, wh, '#6a7484');
      u.px(c, wx0 - 1, wy - 2, ww + 2, 3, '#9aa4b4');
      u.px(c, wx0 - 1, wy - 2, ww + 2, 1, '#d8e0ec');
      var gCols = ['#e85a3a', '#40a8e0', '#f0c850', '#e8e8f0'];
      for (var gi = 0; gi < 7; gi++) {
        var gx = wx0 + 3 + Math.floor(R() * Math.max(4, ww - 10));
        var gy2 = wy + 3 + Math.floor(R() * Math.max(3, wh - 6));
        u.px(c, gx, gy2, 3 + Math.floor(R() * 5), 2 + Math.floor(R() * 3), gCols[gi % gCols.length]);
      }
      // Gözetleme kulesi
      var tx = xr(G, 0.78), th = sz(G, 0.34), ty = g - th;
      u.px(c, tx - 3, ty + 9, 6, th - 9, '#4a566c');
      u.px(c, tx - 6, ty + 2, 12, 8, '#5a667c');
      u.px(c, tx - 7, ty, 14, 2, '#8a9ab0');
      u.px(c, tx - 4, ty + 4, 8, 3, '#f0c870');
      u.px(c, tx, ty - 4, 1, 4, '#8a9ab0');

      u.bands(c, ['#4a5262', '#3a4250', '#2a303c'], g, H, W, 5);
      for (var s = 0; s < 8; s++) {
        u.px(c, Math.floor(R() * W), g + 1 + Math.floor(R() * 5), 6 + Math.floor(R() * 10), 1, '#c8d4e0');
      }
      return {
        g: g,
        fw1: xl(G, 0.85),
        fw2: xr(G, 0.45),
        fwY: Math.round(H * 0.21),
        wallX: wx0 + Math.round(ww * 0.45),
        wallTop: wy - 2
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W, H = G.H, g = st.g;
      firework(c, u, st.fw1, st.fwY, t, ['#e8e8f0', '#e85a3a', '#40a8e0']);
      firework(c, u, st.fw2, st.fwY - 6, t + 1.2, ['#f8d868', '#e85a3a', '#8a9ab0']);

      // Duvar üstünde el sallayan siluet
      var sx = st.wallX, sy = st.wallTop, wave = Math.floor(t * 3) % 2;
      u.px(c, sx, sy - 5, 2, 5, '#1a2238');
      u.px(c, sx, sy - 7, 2, 2, '#e8e8f0');
      u.px(c, sx + 2, sy - (wave ? 7 : 5), 2, 1, '#e8e8f0');

      // 30 kar tanesi
      for (var i = 0; i < 30; i++) {
        var fx = ((i * 37 + Math.floor(t * 6) + Math.round(Math.sin(t * 1.4 + i) * 3)) % W + W) % W;
        var fy = Math.floor((i * 23 + t * 13) % g);
        u.px(c, fx, fy, 1, 1, i % 3 ? '#e8e8f0' : '#8a9ab0');
      }

      // Trabant dumanla geçer
      var tx = Math.round(((t * 14) % (W + 40)) - 20), ty = g + 6;
      if (ty < H - 20) {
        u.px(c, tx, ty, 12, 4, '#9ab8c8');
        u.px(c, tx + 2, ty - 3, 7, 3, '#c8d8e0');
        u.px(c, tx + 4, ty - 2, 4, 2, '#2a3854');
        u.px(c, tx + 11, ty + 1, 2, 1, '#f8e088');
        u.px(c, tx + 2, ty + 4, 2, 2, '#1a2238');
        u.px(c, tx + 8, ty + 4, 2, 2, '#1a2238');
        u.smoke(c, tx - 2, ty + 2, t * 1.5, '#8a9ab0', 0.45);
      }
    }
  });

  /* ================= silikon — WEB 2.0 (2001 – 2006) ================= */
  S.register('silikon', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(611);
      u.bands(c, ['#2a3a70', '#5a4a8a', '#c86a6a', '#f8b878'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), g - 14, 14, ['#e07a6a', '#f8b068', '#ffe4a8'], g);
      u.profile(c, 0, W, function (x) {
        return g - 12 - 6 * Math.sin(x / 35 + 0.5) - 3 * Math.sin(x / 12);
      }, g - 6, '#3a4264', '#6a6280');
      u.bands(c, ['#3a4a8a', '#2e3e76'], g - 8, g, W, 3);

      // Sol: Golden Gate Köprüsü (sisli turuncu)
      var bL = 2, bR = xl(G, 1.05), t1 = xl(G, 0.25), t2 = xl(G, 0.78);
      var tTop = g - sz(G, 0.36), deck = g - sz(G, 0.11);
      function ggCable(x) {
        if (x < t1) return deck + (tTop - deck) * Math.pow(Math.max(0, (x - bL) / (t1 - bL)), 1.5);
        if (x > t2) return deck + (tTop - deck) * Math.pow(Math.max(0, (bR - x) / (bR - t2)), 1.5);
        var q = (x - t1) / (t2 - t1);
        return tTop + (deck - 4 - tTop) * (1 - Math.pow(2 * q - 1, 2));
      }
      for (var x = bL + 2; x < bR - 2; x += 3) {
        var cy = Math.round(ggCable(x));
        if (cy < deck) u.px(c, x, cy, 1, deck - cy, 'rgba(216,80,42,0.55)');
      }
      for (x = bL; x <= bR; x++) u.px(c, x, Math.round(ggCable(x)), 1, 1, '#e86838');
      [t1, t2].forEach(function (tx) {
        u.px(c, tx - 2, tTop, 2, g - tTop, '#d8502a');
        u.px(c, tx + 1, tTop, 2, g - tTop, '#9a341a');
        u.px(c, tx - 2, tTop, 1, g - tTop, '#f88858');
        u.px(c, tx - 2, tTop + 3, 5, 2, '#d8502a');
        u.px(c, tx - 2, tTop + Math.round((deck - tTop) * 0.48), 5, 2, '#d8502a');
      });
      u.px(c, bL, deck, bR - bL, 3, '#d8502a');
      u.px(c, bL, deck, bR - bL, 1, '#f89060');

      // Sağ: logosuz cam ofis kampüsü + sunucu dolabı penceresi
      var ox = xr(G, 0.15), ow = sz(G, 0.42), oh = sz(G, 0.22), oy = g - oh;
      u.px(c, ox, oy, ow, oh, '#2a3a4a');
      u.px(c, ox + 2, oy + 3, ow - 4, oh - 5, '#5a8098');
      u.px(c, ox - 2, oy, ow + 4, 2, '#c8d8e0');
      for (var wy = oy + 5; wy < g - 4; wy += 5) {
        u.px(c, ox + 2, wy, ow - 4, 1, '#2a3a4a');
        u.px(c, ox + 3, wy - 2, Math.round(ow * 0.4), 1, '#f8c080');
      }
      // Sunucu dolabı penceresi (sağ alt kat)
      var sx = ox + Math.round(ow * 0.55), sy = g - 12, sw = Math.max(10, Math.round(ow * 0.38));
      u.px(c, sx, sy, sw, 10, '#141c24');
      u.px(c, sx + 1, sy + 1, Math.round(sw * 0.4), 8, '#222c38');
      u.px(c, sx + Math.round(sw * 0.52), sy + 1, Math.round(sw * 0.4), 8, '#222c38');
      palmTree(u, c, xr(G, 0.04), g + 2, 16);
      palmTree(u, c, xr(G, 0.88), g + 2, 14);

      u.bands(c, ['#4a5460', '#3a424c', '#2a3038'], g, H, W, 5);
      u.px(c, Math.round(W * 0.65), g, Math.round(W * 0.35), 4, '#3e5e46');
      for (var k = 0; k < 10; k++) u.px(c, Math.floor(R() * W), g + 5 + Math.floor(R() * 6), 4, 1, '#5a6470');

      return {
        g: g,
        bL: bL, bR: bR, deck: deck,
        sx: sx, sy: sy, sw: sw,
        clouds: u.makeClouds(u.rng(612), 4, W, H, 0.06, 0.28)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W, H = G.H, g = st.g;
      u.drawClouds(c, st.clouds, t * 0.5, W, ['#9a5a7a', '#d07a7a', '#f0a888', '#ffd8b0']);

      // Sis şeridi kayar (köprü tabanı)
      var fogX = Math.round(((t * 6) % (st.bR + 40)) - 20);
      u.px(c, Math.max(0, fogX), g - 9, 28, 3, 'rgba(200,216,224,0.32)');
      u.px(c, Math.max(0, fogX + 6), g - 11, 18, 2, 'rgba(248,224,200,0.25)');

      // Köprüde araç ışıkları akar
      for (var i = 0; i < 6; i++) {
        var span = st.bR - st.bL;
        var lx = st.bL + Math.round((i * 17 + t * 14) % span);
        u.px(c, lx, st.deck - 1, 2, 1, i % 2 ? '#ffe8a8' : '#e84a3a');
      }

      // Sunucu LED'leri kırpışır
      var ledCols = ['#40e080', '#40a8e0', '#f8c040'];
      for (var l = 0; l < 8; l++) {
        var on = ((Math.floor(t * 4) + l * 3) % 5) < 3;
        if (on) {
          var rx = st.sx + 2 + (l % 2) * Math.round(st.sw * 0.48) + (l % 3);
          var ry = st.sy + 2 + Math.floor(l / 2) * 2;
          u.px(c, rx, ry, 1, 1, ledCols[l % 3]);
        }
      }

      // Bisikletli çalışan
      var cx = xr(G, 0.05) + Math.round(((t * 9) % Math.max(30, W * 0.25)));
      var cy = g + 5;
      if (cy < H - 20) {
        u.px(c, cx, cy, 2, 2, '#1a222a');
        u.px(c, cx + 5, cy, 2, 2, '#1a222a');
        u.px(c, cx + 1, cy - 1, 5, 1, '#d8502a');
        u.px(c, cx + 2, cy - 4, 2, 3, '#40a8e0');
        u.px(c, cx + 3, cy - 6, 2, 2, '#f8c080');
      }

      // Pelikanlar
      u.birds(c, t * 0.7, W, H, 3, '#2a3a4a', 0.24);
    }
  });

  /* ================= kus_yuvasi — PEKİN 2008 (2007 – 2009) ================= */
  S.register('kus_yuvasi', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(621);
      u.bands(c, ['#0a0e22', '#0e1430', '#1a1e44', '#2a2a5a'], 0, g, W, 10);
      u.stars(c, R, 30, W, Math.round(g * 0.58), '#e8e8f0');
      u.profile(c, 0, W, function (x) {
        return g - 8 - (Math.sin(x / 19) > 0.3 ? 9 : 2) - (Math.cos(x / 11) > 0.6 ? 5 : 0);
      }, g, '#161a38', '#2a325a');

      // Sol: Kuş Yuvası stadyumu (çapraz örgülü çelik + içten kırmızı ışık)
      var nx = xl(G, 0.5), nw = sz(G, 0.40), nh = sz(G, 0.17), ny = g;
      u.poly(c, [
        [nx - Math.round(nw * 0.52), ny - nh],
        [nx, ny - Math.round(nh * 0.78)],
        [nx + Math.round(nw * 0.52), ny - nh],
        [nx + Math.round(nw * 0.44), ny + 1],
        [nx - Math.round(nw * 0.44), ny + 1]
      ], '#262a3e');
      // İç kırmızı ışık parıltısı
      for (var rx = nx - Math.round(nw * 0.36); rx < nx + Math.round(nw * 0.36); rx += 4) {
        u.px(c, rx, ny - Math.round(nh * 0.65), 2, Math.round(nh * 0.45), '#c83a3a');
      }
      // Çapraz çelik örgü
      for (var s = -4; s <= 4; s++) {
        var sx0 = nx + Math.round(s * nw * 0.1);
        for (var k = 0; k < nh; k += 2) {
          u.px(c, sx0 + Math.round(k * 0.6), ny - nh + k, 1, 1, '#9aa2b8');
          u.px(c, sx0 - Math.round(k * 0.6), ny - nh + k, 1, 1, '#c8d0e0');
        }
      }
      u.px(c, nx - Math.round(nw * 0.48), ny - nh, Math.round(nw * 0.96), 1, '#e8e8f0');

      // Sağ: CCTV kulesi (döngü biçimli) + Su Küpü (kabarcık cepheli)
      var cx = xr(G, 0.66), ch = sz(G, 0.38), cw = sz(G, 0.18), cy = g - ch;
      u.px(c, cx - Math.round(cw * 0.45), cy + 6, Math.round(cw * 0.3), ch - 6, '#3a4258');
      u.px(c, cx + Math.round(cw * 0.15), cy + 10, Math.round(cw * 0.3), ch - 10, '#2a3248');
      u.px(c, cx - Math.round(cw * 0.45), cy, Math.round(cw * 0.95), 7, '#4a546e');
      u.px(c, cx - Math.round(cw * 0.45), cy, Math.round(cw * 0.95), 1, '#8a9ab0');
      u.px(c, cx - Math.round(cw * 0.15), g - 7, Math.round(cw * 0.6), 7, '#3a4258');

      // Su Küpü (ön sağ)
      var wx = xr(G, 0.14), ww = sz(G, 0.28), wh = sz(G, 0.13), wy = g - wh;
      u.px(c, wx, wy, ww, wh, '#1a4a7a');
      u.px(c, wx, wy, ww, 1, '#80d0ff');

      u.bands(c, ['#2a2e42', '#202434', '#161824'], g, H, W, 5);
      for (var p = 0; p < 12; p++) u.px(c, Math.floor(R() * W), g + 3, 2, 1, '#4a5068');

      return {
        g: g,
        nx: nx, nw: nw, nh: nh,
        wx: wx, wy: wy, ww: ww, wh: wh,
        fw1: xl(G, 0.85),
        fw2: xr(G, 0.25),
        fw3: xr(G, 0.60),
        fwY: Math.round(H * 0.20)
      };
    },
    frame: function (c, G, t, st, u) {
      firework(c, u, st.fw1, st.fwY, t, ['#e8c040', '#c83a3a', '#e8e8f0']);
      firework(c, u, st.fw2, st.fwY + 6, t + 0.8, ['#40a0e8', '#e8e8f0', '#2a2a5a']);
      firework(c, u, st.fw3, st.fwY - 5, t + 1.6, ['#c83a3a', '#e8c040', '#40a0e8']);

      // Su Küpü kabarcıkları 3 renk sırayla değişir
      var bCols = ['#2878c8', '#40a0e8', '#78d0ff'], step = Math.floor(t * 2);
      var idx = 0;
      for (var by = st.wy + 2; by < st.g - 2; by += 4) {
        for (var bx = st.wx + 2; bx < st.wx + st.ww - 3; bx += 4) {
          u.px(c, bx, by, 3, 3, bCols[(idx + step) % 3]);
          idx++;
        }
      }

      // Stadyumda ışık atımı
      var pulse = Math.floor(t * 3) % 2;
      u.px(c, st.nx - Math.round(st.nw * 0.25), st.g - Math.round(st.nh * 0.55), Math.round(st.nw * 0.5), 2, pulse ? '#f05040' : '#c83a3a');
    }
  });

  /* ================= dubai — DUBAİ (2010 – 2014) ================= */
  S.register('dubai', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(631);
      u.bands(c, ['#2a3a6a', '#7a5a7a', '#c8806a', '#f8c87a'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), g - 18, 14, ['#e89060', '#f8c87a', '#fff4cc'], g);
      // Sağda Basra Körfezi suyu, solda kumul profili
      u.profile(c, 0, Math.round(W * 0.62), function (x) {
        return g - 5 - 3 * Math.sin(x / 27);
      }, g, '#c89858', '#e8c078');
      u.bands(c, ['#3a8aa8', '#2a6a88'], g - 7, g, W, 2);

      // Sol: Burj Halife (≈ 0.60H, tablodaki en uzun yapı)
      var bx = xl(G, 0.45), bh = Math.round(H * 0.60), bTop = g - bh;
      var tiers = [
        [0.0, 0.25, 11], [0.25, 0.45, 8], [0.45, 0.64, 5],
        [0.64, 0.80, 3], [0.80, 0.91, 2], [0.91, 1.0, 1]
      ];
      var sc = Math.max(0.6, Math.min(1.2, W / 450));
      for (var i = 0; i < tiers.length; i++) {
        var y0 = g - Math.round(bh * tiers[i][1]);
        var y1 = g - Math.round(bh * tiers[i][0]);
        var hw = Math.max(1, Math.round(tiers[i][2] * sc));
        u.px(c, bx - hw, y0, hw, y1 - y0, '#8aa0b8');
        u.px(c, bx, y0, hw, y1 - y0, '#4a5a74');
        u.px(c, bx - hw, y0, 1, y1 - y0, '#e8e8f0');
      }

      // Sağ: Burj Al Arab (yelken biçimli) + palmiyeler + metro viyadüğü
      var ax = xr(G, 0.68), ah = sz(G, 0.36), aw = sz(G, 0.16), aTop = g - ah;
      for (var y = 0; y < ah; y++) {
        var f = y / ah, sailW = Math.max(2, Math.round(Math.sin(f * Math.PI * 0.85) * aw));
        u.px(c, ax - sailW, aTop + y, sailW, 1, '#e8e8f0');
        u.px(c, ax, aTop + y, 3, 1, '#3a8aa8');
        u.px(c, ax - sailW, aTop + y, 1, 1, '#c8d4e0');
      }
      u.px(c, ax - 1, aTop - 6, 1, 6, '#e8e8f0');
      u.px(c, ax - Math.round(aw * 0.7), aTop + Math.round(ah * 0.18), 6, 2, '#c8d4e0'); // helipad

      // Metro viyadüğü (sağ)
      var vx0 = xr(G, 0.0), vw = W - vx0, vy = g - 11;
      u.px(c, vx0, vy, vw, 2, '#b8a890');
      u.px(c, vx0, vy, vw, 1, '#e8d8c0');
      for (var px = vx0 + 8; px < W; px += 18) u.px(c, px, vy + 2, 2, 9, '#988870');

      palmTree(u, c, xr(G, 0.12), g + 2, 16);
      palmTree(u, c, xr(G, 0.25), g + 2, 13);

      u.bands(c, ['#c8a060', '#a8824a', '#88663a'], g, H, W, 5);
      for (var d = 0; d < 12; d++) u.px(c, Math.floor(R() * W), g + 4 + Math.floor(R() * 6), 5, 1, '#d8b478');

      return {
        g: g,
        bx: bx, bTop: bTop,
        vx0: vx0, vy: vy, vw: vw,
        clouds: u.makeClouds(u.rng(632), 4, W, H, 0.05, 0.25)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W, g = st.g;
      u.drawClouds(c, st.clouds, t * 0.4, W, ['#a87078', '#d89878', '#f8c888', '#ffe8b8']);

      // Burj tepesinde kırmızı uyarı ışığı
      if (Math.floor(t * 2) % 2 === 0) {
        u.px(c, st.bx, st.bTop - 1, 2, 2, '#ff3030');
      }

      // Metro geçer
      var mx = st.vx0 + Math.round(((t * 16) % (st.vw + 30)) - 15);
      if (mx >= st.vx0 && mx < W - 12) {
        u.px(c, mx, st.vy - 3, 18, 3, '#e8e8f0');
        u.px(c, mx + 2, st.vy - 2, 14, 1, '#3a8aa8');
      }

      // Deniz parıltısı
      for (var i = 0; i < 8; i++) {
        var sx = Math.round(W * 0.65) + ((i * 23 + Math.floor(t * 3) * 5) % Math.round(W * 0.32));
        u.px(c, sx, g - 5 + (i % 4), 2, 1, '#f8e0a0');
      }

      // Helikopter
      var hx = xr(G, 0.35) + Math.round(Math.sin(t * 0.7) * 14);
      var hy = Math.round(G.H * 0.26) + Math.round(Math.cos(t * 1.1) * 3);
      u.px(c, hx, hy, 7, 3, '#2a3a6a');
      u.px(c, hx + 4, hy + 1, 2, 1, '#f8c87a');
      u.px(c, hx - 3, hy + 1, 3, 1, '#2a3a6a');
      var rLen = Math.floor(t * 10) % 2 ? 9 : 4;
      u.px(c, hx + 3 - Math.floor(rLen / 2), hy - 1, rLen, 1, '#e8e8f0');
    }
  });

  /* ================= yeni_istanbul — YENİ İSTANBUL (2015 – 2019) ================= */
  S.register('yeni_istanbul', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(641);
      u.bands(c, ['#3a78c8', '#5e9ee0', '#9ad0f0', '#d8eefc'], 0, g, W, 10);
      u.sun(c, Math.round(W * 0.5), Math.round(H * 0.14), 11, ['#fff4b0', '#fffad0', '#ffffff']);

      // Kuzey Boğaz tepeleri + deniz
      u.profile(c, 0, W, function (x) {
        return g - 14 - 7 * Math.sin(x / 37) - 3 * Math.sin(x / 11);
      }, g - 10, '#4a7a58', '#689a72');
      u.bands(c, ['#2a6a9a', '#3a7eb0'], g - 12, g, W, 3);

      // Sol: tepe üzerinde 6 minareli Çamlıca Camii
      var mx = xl(G, 0.48), hillY = g - 6;
      u.profile(c, 0, Math.round(W * 0.34), function (x) {
        return hillY - Math.max(0, 10 - Math.abs(x - mx) * 0.2);
      }, g + 2, '#4e7c56', '#6ca074');
      var mBase = hillY - 6, mr = sz(G, 0.08);
      u.px(c, mx - mr - 7, mBase - mr, (mr + 7) * 2, mr + 2, '#e8e8e8');
      u.circle(c, mx, mBase - mr, mr, '#e8e8e8');
      u.circle(c, mx - mr - 2, mBase - Math.round(mr * 0.7), Math.round(mr * 0.5), '#d0d8e0');
      u.circle(c, mx + mr + 2, mBase - Math.round(mr * 0.7), Math.round(mr * 0.5), '#d0d8e0');
      u.px(c, mx, mBase - mr * 2 - 3, 1, 3, '#c8a840');
      var mOff = [-mr - 12, -mr - 7, -mr - 3, mr + 3, mr + 7, mr + 12];
      for (var i = 0; i < mOff.length; i++) {
        var mh = (i === 0 || i === 5) ? sz(G, 0.19) : sz(G, 0.25);
        var px2 = mx + mOff[i];
        u.px(c, px2, mBase - mh, 2, mh, '#e8e8e8');
        u.px(c, px2 + 1, mBase - mh, 1, mh, '#c0c8d0');
        u.px(c, px2 - 1, mBase - Math.round(mh * 0.6), 4, 1, '#9aa6b4');
        u.px(c, px2, mBase - mh - 4, 1, 4, '#6a7888');
      }
      // Türk bayrağı direği
      var fx = xl(G, 0.12), fy = g - 24;
      u.px(c, fx, fy, 1, 24, '#e8e8e8');

      // Sağ: eğik askılı A kuleli Yavuz Sultan Selim Köprüsü
      var b0 = xr(G, 0.0), b1 = W - 2, tL = xr(G, 0.25), tR = xr(G, 0.80);
      var tTop = g - sz(G, 0.34), deck = g - sz(G, 0.09);
      [tL, tR].forEach(function (tx) {
        // Eğik askı halatları (yelpaze)
        for (var k = 1; k <= 5; k++) {
          var dx = k * 5;
          var steps = 10;
          for (var s = 0; s <= steps; s++) {
            var f = s / steps;
            u.px(c, tx - Math.round(dx * f), tTop + Math.round((deck - tTop) * f), 1, 1, '#c8d4e0');
            u.px(c, tx + Math.round(dx * f), tTop + Math.round((deck - tTop) * f), 1, 1, '#c8d4e0');
          }
        }
        // A-biçimli ikiz kule
        for (var y = tTop; y < g; y++) {
          var sp = Math.round(((y - tTop) / (g - tTop)) * 5);
          u.px(c, tx - sp - 1, y, 2, 1, '#e8e8e8');
          u.px(c, tx + sp, y, 2, 1, '#c0c8d0');
        }
        u.px(c, tx - 3, tTop + Math.round((deck - tTop) * 0.45), 7, 2, '#d8e0e8');
      });
      u.px(c, b0, deck, b1 - b0, 3, '#d0d8e0');
      u.px(c, b0, deck, b1 - b0, 1, '#ffffff');

      u.bands(c, ['#5a7a52', '#4a6644', '#385034'], g, H, W, 5);
      for (var d2 = 0; d2 < 10; d2++) u.px(c, Math.floor(R() * W), g + 4 + Math.floor(R() * 6), 3, 1, '#6a8e60');

      return {
        g: g,
        fx: fx, fy: fy,
        b0: b0, b1: b1, deck: deck,
        clouds: u.makeClouds(u.rng(642), 5, W, H, 0.06, 0.28)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W, g = st.g;
      u.drawClouds(c, st.clouds, t * 0.65, W, ['#b8cde0', '#d8e6f4', '#f0f4f8', '#ffffff']);
      u.flag(c, st.fx + 1, st.fy, 12, Math.floor(t * 4) % 2);

      // Köprüde araç akışı
      var span = Math.max(20, st.b1 - st.b0);
      for (var i = 0; i < 5; i++) {
        var cx = st.b0 + Math.round((i * 19 + t * 14) % span);
        u.px(c, cx, st.deck - 1, 2, 1, i % 2 ? '#c8282f' : '#ffffff');
      }

      // Modern vapur geçer
      var vx = xr(G, 0.05) + Math.round(((t * 8) % Math.max(40, W * 0.28)));
      var vy = g - 5;
      u.px(c, vx, vy, 16, 3, '#f0f4f8');
      u.px(c, vx + 1, vy + 2, 14, 1, '#2a6a9a');
      u.px(c, vx + 3, vy - 3, 10, 3, '#e8e8e8');
      u.px(c, vx + 4, vy - 2, 7, 1, '#3a78c8');
      u.px(c, vx - 3, vy + 2, 3, 1, '#d8eefc');

      u.birds(c, t, W, G.H, 4, '#ffffff', 0.20);
    }
  });

  /* ================= mars — MARS ÇAĞI (2020 – 2023) ================= */
  S.register('mars', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(651);
      // Tozlu somon gök + ufukta mavi hale
      u.bands(c, ['#8a4a3a', '#c8805a', '#e8a878', '#8aa0b8'], 0, g, W, 10);
      // Phobos ve Deimos
      u.circle(c, Math.round(W * 0.44), Math.round(H * 0.16), 3, '#d0b8a8');
      u.px(c, Math.round(W * 0.44) - 1, Math.round(H * 0.16), 1, 1, '#8a7060');
      u.px(c, Math.round(W * 0.58), Math.round(H * 0.21), 2, 2, '#e8d8c8');

      // Uzak Jezero krateri kenarı
      u.profile(c, 0, W, function (x) {
        return g - 10 - 5 * Math.sin(x / 33) - (x > W * 0.65 ? 10 : 0);
      }, g, '#8a3a2a', '#c87050');

      // Sağ: Jezero krateri kayalıkları
      var rx0 = xr(G, 0.20);
      u.profile(c, rx0, W, function (x) {
        return g - 18 - Math.round((x - rx0) * 0.18) - 4 * Math.sin(x / 8);
      }, g + 2, '#6a2c20', '#b85a3a');
      for (var rk = 0; rk < 5; rk++) {
        var rkx = xr(G, 0.15 + rk * 0.17), rky = g + 2 + (rk % 3) * 4;
        u.px(c, rkx, rky, 6, 4, '#5a2a20');
        u.px(c, rkx, rky, 6, 1, '#c86a4a');
      }

      // Kızıl zemin
      u.bands(c, ['#b85838', '#8a3a2a', '#5a2a20'], g, H, W, 6);
      for (var d = 0; d < 16; d++) u.px(c, Math.floor(R() * W), g + 3 + Math.floor(R() * 9), 4, 1, '#6a2a1e');

      // Sol: 6 tekerlekli Perseverance gezgini (gövde + tekerlekler + direk)
      var px0 = xl(G, 0.42), py0 = g + 2;
      // Tekerlek izleri
      for (var tr = 4; tr < px0 - 12; tr += 3) u.px(c, tr, py0 + 3, 2, 1, '#5a2a20');
      // 6 tekerlek
      for (var w = 0; w < 3; w++) {
        var wx = px0 - 10 + w * 8;
        u.px(c, wx, py0, 4, 4, '#2a2220');
        u.px(c, wx + 1, py0 + 1, 2, 2, '#5a4a44');
      }
      // Şasi + gövde
      u.px(c, px0 - 9, py0 - 6, 20, 5, '#e8e0d0');
      u.px(c, px0 - 9, py0 - 6, 20, 1, '#f0c8a0');
      u.px(c, px0 - 12, py0 - 5, 4, 4, '#d8a848'); // RTG
      u.px(c, px0 + 10, py0 - 4, 4, 2, '#8a9ab0'); // kol
      u.px(c, px0 + 5, py0 - 15, 2, 9, '#c8c0b4'); // kamera direği

      return {
        g: g,
        mastX: px0 + 4,
        mastY: py0 - 18,
        heliX: xl(G, 0.88),
        dustX: xr(G, 0.28)
      };
    },
    frame: function (c, G, t, st, u) {
      var g = st.g;

      // Gezgin direk kamerası döner
      var pan = (Math.floor(t * 0.8) % 3) - 1;
      u.px(c, st.mastX + pan, st.mastY, 5, 3, '#f0e8d8');
      u.px(c, st.mastX + pan + 2, st.mastY + 1, 2, 1, '#6a9ad0');

      // Ingenuity helikopteri kalkıp süzülür (pervane 2 kare)
      var hx = st.heliX + Math.round(Math.sin(t * 0.7) * 8);
      var hy = g - 16 - Math.round((Math.sin(t * 1.4) + 1) * 7);
      u.px(c, hx - 2, hy, 4, 3, '#e8d8c0');
      u.px(c, hx - 3, hy + 3, 1, 2, '#5a4a44');
      u.px(c, hx + 2, hy + 3, 1, 2, '#5a4a44');
      var rot = Math.floor(t * 12) % 2 ? 9 : 4;
      u.px(c, hx - Math.floor(rot / 2), hy - 2, rot, 1, '#f0c8a0');

      // Uzakta dönen toz şeytanı (piksel sütunu)
      var dx = st.dustX + Math.round(Math.sin(t * 0.5) * 10);
      for (var k = 0; k < 12; k++) {
        var sway = Math.round(Math.sin(t * 5 + k * 0.6) * (1 + k * 0.15));
        u.px(c, dx + sway, g - 1 - k * 2, 2 + Math.floor(k / 4), 2, k % 2 ? '#e8a878' : '#f0c8a0');
      }
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
