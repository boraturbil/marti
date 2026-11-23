/* PUSULLA — arkaplan paketi D (scenes/bg_d.js). Sahneler: suleymaniye, lale_devri, abd_bagimsizlik, fransiz_devrimi, tanzimat, londra.
 * META suleymaniye {"min":1520,"max":1599,"label":"OSMANLI KLASİK","road":["#9a8c86","#bcaea6","#6a5e5a"]}
 * META lale_devri {"min":1680,"max":1749,"label":"LALE DEVRİ","road":["#a8907a","#c8b09a","#786652"]}
 * META abd_bagimsizlik {"min":1750,"max":1788,"label":"ABD BAĞIMSIZLIĞI","road":["#8a6a5a","#aa8a78","#5a443a"]}
 * META fransiz_devrimi {"min":1789,"max":1814,"label":"FRANSIZ DEVRİMİ","road":["#7a7470","#9a9490","#4e4a46"]}
 * META tanzimat {"min":1839,"max":1875,"label":"TANZİMAT","road":["#8e8a86","#aeaaa6","#5e5a56"]}
 * META londra {"min":1876,"max":1888,"label":"VİKTORYA LONDRASI","road":["#5e5a5a","#7e7a7a","#3a3838"]}
 * Kurallar: ES5, dış bağımlılık yok, global yok, yalnız S.register. */
(function (global) {
  'use strict';
  var S = global.PUSULLA && global.PUSULLA.scene;
  if (!S || !S.register) return;

  function gy(G) { return Math.round(G.H * 0.7); }
  function xl(G, f) { return Math.round(G.W * (0.10 + 0.20 * f)); }
  function xr(G, f) { return Math.round(G.W * (0.70 + 0.20 * f)); }
  function sz(G, k) { return Math.max(3, Math.round(Math.min(G.W * 0.45, G.H) * k)); }
  function inSide(x, W) { return x < W * 0.35 || x > W * 0.65; }

  /* ---------- yerel yardımcılar ---------- */
  function minaret(u, c, x, base, h, serefeCount, bodyCol, shadeCol, capCol, rimCol, thick) {
    var kw = thick ? (h >= 42 ? 7 : 5) : (h >= 42 ? 5 : 3);
    var kh = Math.max(4, Math.round(h * 0.20));
    var sw = thick ? (h >= 42 ? 4 : 3) : (h >= 42 ? 3 : 2);
    var capH = Math.max(5, Math.round(h * 0.16));
    var shaftTop = base - h + capH;
    u.px(c, x - Math.floor(kw / 2), base - kh, kw, kh, bodyCol);
    u.px(c, x + Math.floor(kw / 2), base - kh, 1, kh, shadeCol);
    u.px(c, x - Math.floor(kw / 2), base - kh, kw, 1, rimCol);
    var sx = x - Math.floor(sw / 2);
    u.px(c, sx, shaftTop, sw, base - kh - shaftTop, bodyCol);
    u.px(c, sx + sw - 1, shaftTop, 1, base - kh - shaftTop, shadeCol);
    var n = Math.max(1, serefeCount || 1);
    for (var i = 0; i < n; i++) {
      var sy = shaftTop + Math.round((base - kh - shaftTop) * (0.18 + i * 0.22));
      u.px(c, sx - 1, sy, sw + 2, 1, rimCol);
      u.px(c, sx - 1, sy + 1, sw + 2, 1, shadeCol);
    }
    for (var k = 0; k < capH; k++) {
      var cw = Math.max(1, Math.round((sw + 2) * (k / capH)));
      u.px(c, x - Math.floor(cw / 2), shaftTop - capH + k, cw, 1, capCol);
    }
    u.px(c, x, shaftTop - capH - 3, 1, 3, rimCol);
  }

  function dome(u, c, cx, base, r, col, shadeCol, hiCol) {
    u.halfDisc(c, cx, base, r, col);
    for (var y = -r; y <= 0; y++) {
      var hw = Math.floor(Math.sqrt(r * r - y * y));
      if (hw > 1) {
        u.px(c, cx + Math.floor(hw * 0.35), base + y, Math.max(1, Math.ceil(hw * 0.65)), 1, shadeCol);
        if (y < -Math.floor(r * 0.3)) u.px(c, cx - Math.floor(hw * 0.65), base + y, 1, 1, hiCol);
      }
    }
    u.px(c, cx, base - r - 3, 1, 3, hiCol);
  }

  function cypress(u, c, x, base, h, col1, col2) {
    for (var i = 0; i < h; i++) {
      var w = Math.max(1, Math.round(Math.sin((i / h) * Math.PI) * Math.max(2, h * 0.14)));
      u.px(c, x - w, base - i, w * 2 + 1, 1, i % 4 ? col1 : col2);
    }
    u.px(c, x, base, 1, 2, '#3a2a20');
  }

  function leafTree(u, c, x, base, sc, trunkCol, leafCol, hiCol) {
    var th = Math.max(3, Math.round(7 * sc));
    var r = Math.max(2, Math.round(5 * sc));
    u.px(c, x, base - th, Math.max(1, Math.round(sc)), th, trunkCol);
    u.circle(c, x, base - th - Math.floor(r * 0.6), r, leafCol);
    if (r > 2) u.circle(c, x - 1, base - th - Math.floor(r * 0.8), Math.max(1, r - 2), hiCol);
  }

  function waterGlint(u, c, x0, x1, y0, y1, t, col, step) {
    var s = step || 9;
    var spanX = Math.max(10, x1 - x0);
    var spanY = Math.max(6, y1 - y0);
    for (var i = 0; i < 30; i++) {
      var y = y0 + ((i * s) % spanY);
      var f = (y - y0) / spanY;
      var x = x0 + ((i * 53 + Math.floor(t * (3 + f * 4)) * (i % 2 + 1)) % spanX);
      var w = 2 + Math.round(f * 4);
      u.px(c, x, y, w, 1, col);
    }
  }

  function stripeFlag(u, c, x, y, w, h, cols, vert, ph) {
    var i, sh;
    if (vert) {
      var sw = Math.max(1, Math.floor(w / cols.length));
      for (i = 0; i < w; i++) {
        sh = ph && (i >> 2) % 2 ? 1 : 0;
        var ci = Math.min(cols.length - 1, Math.floor(i / sw));
        u.px(c, x + i, y + sh, 1, h, cols[ci]);
      }
    } else {
      var shBand = Math.max(1, Math.round(h / 7));
      for (i = 0; i < w; i++) {
        sh = ph && (i >> 2) % 2 ? 1 : 0;
        for (var j = 0; j < h; j++) {
          var bi = Math.floor(j / shBand);
          u.px(c, x + i, y + j + sh, 1, 1, cols[bi % cols.length]);
        }
      }
    }
  }

  function sunRays(u, c, sx, sy, g, W, col) {
    var offsets = [-0.28, -0.10, 0.12, 0.30];
    for (var i = 0; i < offsets.length; i++) {
      var dx = Math.round(W * offsets[i]);
      u.poly(c, [[sx - 2, sy], [sx + 2, sy], [sx + dx + 14, g], [sx + dx - 14, g]], col);
    }
  }

  // Katmanlı ufuk yerleşim siluetleri (uzaklaştıkça açık tonlu)
  function horizonCity(u, c, W, g, R, colFar, colMid, litCol, style) {
    var step = Math.max(6, Math.round(W / 44));
    for (var x = 0; x < W; x += step) {
      var h = 3 + Math.floor(R() * 7);
      var w = step - 1;
      u.px(c, x, g - h, w, h, colFar);
      if (style === 'ottoman' && R() < 0.25) {
        u.halfDisc(c, x + Math.floor(w / 2), g - h, Math.max(2, Math.floor(w * 0.4)), colFar);
      } else if (style === 'paris' && R() < 0.5) {
        u.px(c, x + 1, g - h - 2, Math.max(2, w - 2), 2, colFar);
      } else if (style === 'london' && R() < 0.3) {
        u.px(c, x + 1, g - h - 5, 2, 5, colFar); // fabrika bacası
      }
    }
    var step2 = Math.max(8, Math.round(W / 32));
    for (var x2 = 2; x2 < W; x2 += step2) {
      if (x2 > W * 0.36 && x2 < W * 0.64 && R() < 0.55) continue;
      var h2 = 4 + Math.floor(R() * 8);
      var w2 = step2 - 2;
      u.px(c, x2, g - h2, w2, h2, colMid);
      if (litCol && R() < 0.45) u.px(c, x2 + 2, g - h2 + 2, 1, 1, litCol);
      if (style === 'ottoman' && R() < 0.2) {
        u.px(c, x2 + Math.floor(w2 / 2), g - h2 - 5, 1, 5, colMid);
      } else if (style === 'london' && R() < 0.28) {
        u.px(c, x2 + 2, g - h2 - 6, 2, 6, colMid);
      }
    }
  }

  // 3 şeritli perspektifli zemin dokusu (orta panel %35-65 ve alt yol bandı sakin)
  function perspGround(u, c, W, H, g, R, cols) {
    var gh = H - 20 - g;
    if (gh < 8) return;
    var i, x, y, f, w, h;
    // Şerit 1: ufka yakın (küçük, soluk, tüm genişlikte seyrek)
    for (i = 0; i < 24; i++) {
      x = Math.floor(R() * (W - 4));
      y = g + 2 + Math.floor(R() * Math.max(2, Math.round(gh * 0.26)));
      u.px(c, x, y, 2, 1, cols[0]);
    }
    // Şerit 2: orta (kenar %0-35 ve %65-100)
    for (i = 0; i < 26; i++) {
      x = Math.floor(R() * (W - 6));
      if (!inSide(x, W)) continue;
      y = g + Math.round(gh * 0.28) + Math.floor(R() * Math.max(2, Math.round(gh * 0.30)));
      f = (y - g) / gh;
      w = 3 + Math.round(f * 3);
      u.px(c, x, y, w, 1, cols[1]);
    }
    // Şerit 3: ön/alt (büyük ve ayrıntılı, kenar %0-35 ve %65-100)
    for (i = 0; i < 22; i++) {
      x = Math.floor(R() * (W - 10));
      if (!inSide(x, W)) continue;
      y = g + Math.round(gh * 0.58) + Math.floor(R() * Math.max(2, Math.round(gh * 0.34)));
      if (y >= H - 22) continue;
      f = (y - g) / gh;
      w = 4 + Math.round(f * 5);
      h = f > 0.72 ? 2 : 1;
      u.px(c, x, y, w, h, cols[2]);
      if (cols[3]) u.px(c, x, y, w - 1, 1, cols[3]);
    }
  }

  // Perspektifli insan silueti (yürüme adımlı)
  function person(u, c, x, y, sc, coatCol, hatCol, step, headCol) {
    var bh = Math.max(3, Math.round(5 * sc));
    var bw = Math.max(2, Math.round(2.5 * sc));
    var hs = Math.max(1, Math.round(2 * sc));
    var legH = Math.max(2, Math.round(3 * sc));
    var lx = step === 0 ? -1 : (step === 2 ? 1 : 0);
    // bacaklar
    u.px(c, x + lx, y - legH, Math.max(1, Math.floor(bw * 0.45)), legH, '#242024');
    u.px(c, x + bw - 1 - lx, y - legH, Math.max(1, Math.floor(bw * 0.45)), legH, '#1a181c');
    // gövde
    u.px(c, x, y - legH - bh, bw, bh, coatCol);
    // baş + şapka/kavuk
    u.px(c, x + Math.floor((bw - hs) / 2), y - legH - bh - hs, hs, hs, headCol || '#d8b498');
    if (hatCol) u.px(c, x + Math.floor((bw - hs) / 2) - 1, y - legH - bh - hs - 1, hs + 2, Math.max(1, Math.round(sc)), hatCol);
  }

  function marketStall(u, c, x, y, sc, woodCol, aw1, aw2) {
    var w = Math.max(10, Math.round(16 * sc));
    var h = Math.max(7, Math.round(11 * sc));
    u.px(c, x, y - h, 1, h, woodCol);
    u.px(c, x + w - 1, y - h, 1, h, woodCol);
    u.px(c, x, y - Math.round(h * 0.42), w, Math.round(h * 0.42), woodCol);
    // çizgili tente
    for (var i = 0; i < w + 2; i += 2) {
      u.px(c, x - 1 + i, y - h - 2, 2, 3, (i >> 1) % 2 ? aw1 : aw2);
    }
    // tezgah üstü ürünler
    u.px(c, x + 2, y - Math.round(h * 0.42) - 2, 3, 2, aw1);
    u.px(c, x + 6, y - Math.round(h * 0.42) - 2, 3, 2, aw2);
  }

  function carriage(u, c, x, y, sc, bodyCol, roofCol, horseCol, step) {
    var cw = Math.max(8, Math.round(13 * sc));
    var ch = Math.max(4, Math.round(6 * sc));
    var wr = Math.max(2, Math.round(2.5 * sc));
    // araba gövde + tente
    u.px(c, x, y - wr - ch, cw, ch, bodyCol);
    u.px(c, x + 1, y - wr - ch - Math.max(2, Math.round(3 * sc)), cw - 2, Math.max(2, Math.round(3 * sc)), roofCol);
    u.px(c, x + 3, y - wr - ch + 1, Math.max(2, Math.round(3 * sc)), Math.max(2, Math.round(2 * sc)), '#e8dcc0');
    // tekerlekler
    u.circle(c, x + 2, y - wr, wr, '#2a1c12');
    u.circle(c, x + cw - 3, y - wr, wr, '#2a1c12');
    u.px(c, x + 2 + (step % 2 ? 1 : -1), y - wr, 1, 1, '#9a7a5a');
    u.px(c, x + cw - 3 + (step % 2 ? 1 : -1), y - wr, 1, 1, '#9a7a5a');
    // at
    var hx = x + cw + 2;
    u.px(c, hx - 2, y - wr - 2, 3, 1, '#5a3a22');
    u.px(c, hx, y - wr - Math.round(4 * sc), Math.max(5, Math.round(7 * sc)), Math.max(3, Math.round(3.5 * sc)), horseCol);
    u.px(c, hx + Math.round(5 * sc), y - wr - Math.round(6 * sc), Math.max(2, Math.round(3 * sc)), Math.max(2, Math.round(3 * sc)), horseCol);
    var legS = step % 2 ? 1 : 0;
    u.px(c, hx + 1 + legS, y - wr, 1, wr, horseCol);
    u.px(c, hx + Math.round(5 * sc) - legS, y - wr, 1, wr, horseCol);
  }

  function rowBoat(u, c, x, y, sc, hullCol, personCol, t) {
    var w = Math.max(8, Math.round(14 * sc));
    var h = Math.max(2, Math.round(3 * sc));
    var bob = Math.floor(t * 2) % 2;
    u.px(c, x, y + bob, w, h, hullCol);
    u.px(c, x - 2, y - 1 + bob, 2, 1, hullCol);
    u.px(c, x + w, y - 1 + bob, 2, 1, hullCol);
    u.px(c, x + Math.floor(w * 0.4), y - Math.max(2, Math.round(3 * sc)) + bob, Math.max(2, Math.round(2.5 * sc)), Math.max(2, Math.round(3 * sc)), personCol);
    var oar = Math.floor(t * 4) % 2;
    u.px(c, x + Math.floor(w * 0.5), y + h + bob, 1, oar ? 3 : 1, '#d8c0a0');
  }

  function stoneQuay(u, c, x, y, w, h, bodyCol, topCol, shadeCol) {
    u.px(c, x, y, w, h, bodyCol);
    u.px(c, x, y, w, 2, topCol);
    u.px(c, x, y + 2, w, 1, shadeCol);
    for (var sy = y + 6; sy < y + h - 2; sy += 5) {
      u.px(c, x, sy, w, 1, shadeCol);
      for (var sx = x + ((sy % 2) * 8) + 6; sx < x + w - 4; sx += 16) {
        u.px(c, sx, sy - 4, 1, 4, shadeCol);
      }
    }
  }

  function pigeons(u, c, t, W, H, n, bodyCol, wingCol, y0) {
    for (var i = 0; i < n; i++) {
      var x = Math.round(((i * 97 + t * (9 + (i % 3) * 3)) % (W + 30)) - 15);
      var y = Math.round(H * y0 + (i % 4) * 8 + Math.sin(t * 2.1 + i) * 3);
      var up = Math.sin(t * 7 + i * 1.4) > 0;
      u.px(c, x, y, 3, 2, bodyCol);
      u.px(c, x + 3, y - 1, 1, 1, wingCol);
      if (up) {
        u.px(c, x, y - 2, 2, 2, wingCol);
      } else {
        u.px(c, x, y + 2, 2, 1, wingCol);
      }
    }
  }

  /* ================= 1) SÜLEYMANİYE — OSMANLI KLASİK (1520 – 1599) ================= */
  S.register('suleymaniye', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(401);
      u.bands(c, ['#2e2a5a', '#7a4a7e', '#e88a5a', '#ffd090'], 0, g, W, 11);
      u.stars(c, u.rng(403), 14, W, Math.round(g * 0.25), 'rgba(255,244,208,0.55)');
      var sunX = Math.round(W * 0.5), sunY = g - sz(G, 0.14);
      sunRays(u, c, sunX, sunY, g, W, 'rgba(255,208,144,0.12)');
      u.sun(c, sunX, sunY, sz(G, 0.06), ['#e88a5a', '#ffd090', '#fff4d0'], g);
      // uzak Haliç sırtları + katmanlı yerleşim silueti
      u.profile(c, 0, W, function (x) { return g - 9 - 5 * Math.sin(x / 37) - 3 * Math.sin(x / 13); }, g, '#5c3e68', '#8a5e88');
      horizonCity(u, c, W, g, R, '#4e355a', '#3b2848', 'rgba(255,208,144,0.5)', 'ottoman');

      // sol tepe + Süleymaniye Camii (daha kalın kubbe ve minareler)
      var lHill = function (x) { return g - sz(G, 0.10) + Math.max(0, x - W * 0.25) * 0.35 - 2 * Math.sin(x / 11); };
      u.profile(c, 0, W * 0.34, lHill, g + 2, '#4a364e', '#6e5270');
      var cx = xl(G, 0.46), cb = Math.round(lHill(cx)) + 2;
      var cw = sz(G, 0.27), ch = sz(G, 0.13), dr = sz(G, 0.108);
      // avlu terası
      u.px(c, cx - Math.round(cw * 0.72), cb - 3, Math.round(cw * 1.44), 4, '#b8aa98');
      u.px(c, cx - Math.round(cw * 0.72), cb - 3, Math.round(cw * 1.44), 1, '#e8e0d0');
      // gövde + kemer pencereler
      u.px(c, cx - Math.round(cw * 0.5), cb - ch, cw, ch, '#e8e0d0');
      u.px(c, cx + Math.round(cw * 0.2), cb - ch, Math.round(cw * 0.3), ch, '#c4b8a6');
      for (var wi = -3; wi <= 3; wi++) u.px(c, cx + wi * Math.max(2, Math.round(cw * 0.11)), cb - Math.round(ch * 0.6), 2, 3, '#ffd090');
      // kasnak + yarım kubbeler + ana kubbe
      u.px(c, cx - Math.round(dr * 0.92), cb - ch - 3, Math.round(dr * 1.84), 3, '#d8cfc0');
      dome(u, c, cx - Math.round(dr * 0.95), cb - ch + 2, Math.max(4, Math.round(dr * 0.58)), '#6a6e7e', '#4a4e5e', '#9aa0b4');
      dome(u, c, cx + Math.round(dr * 0.95), cb - ch + 2, Math.max(4, Math.round(dr * 0.58)), '#6a6e7e', '#4a4e5e', '#9aa0b4');
      dome(u, c, cx, cb - ch - 3, dr, '#707488', '#484c5e', '#a4aac0');
      // 4 kalın minare
      var mTall = sz(G, 0.34), mShort = sz(G, 0.25);
      minaret(u, c, cx - Math.round(cw * 0.48), cb, mTall, 3, '#e8e0d0', '#b8aa98', '#4a4e5e', '#ffd090', true);
      minaret(u, c, cx + Math.round(cw * 0.48), cb, mTall, 3, '#e8e0d0', '#b8aa98', '#4a4e5e', '#ffd090', true);
      minaret(u, c, cx - Math.round(cw * 0.68), cb, mShort, 2, '#e8e0d0', '#b8aa98', '#4a4e5e', '#ffd090', true);
      minaret(u, c, cx + Math.round(cw * 0.68), cb, mShort, 2, '#e8e0d0', '#b8aa98', '#4a4e5e', '#ffd090', true);
      cypress(u, c, xl(G, 0.05), Math.round(lHill(xl(G, 0.05))) + 2, sz(G, 0.12), '#283834', '#3a4e48');

      // sağ tepe + Galata Kulesi
      var rHill = function (x) { return g - sz(G, 0.08) + Math.max(0, W * 0.78 - x) * 0.4 + 2 * Math.sin(x / 13); };
      u.profile(c, W * 0.68, W, rHill, g + 2, '#4a364e', '#6e5270');
      var gx = xr(G, 0.72), gb = Math.round(rHill(gx)) + 2, gw = sz(G, 0.068), gh = sz(G, 0.26);
      u.px(c, gx - Math.floor(gw / 2), gb - gh, gw, gh, '#c8bca8');
      u.px(c, gx + Math.floor(gw / 4), gb - gh, Math.ceil(gw / 4) + 1, gh, '#8e8070');
      u.px(c, gx - Math.floor(gw / 2) - 1, gb - gh, gw + 2, 2, '#e8e0d0');
      for (var gyi = 0; gyi < 3; gyi++) u.px(c, gx - 2 + gyi * 2, gb - gh + 3, 1, 2, '#ffd090');
      var coneH = sz(G, 0.10);
      for (var k = 0; k < coneH; k++) {
        var cw2 = Math.max(1, Math.round((gw + 2) * (k / coneH)));
        u.px(c, gx - Math.floor(cw2 / 2), gb - gh - coneH + k, cw2, 1, '#4a4e5e');
      }
      u.px(c, gx, gb - gh - coneH - 3, 1, 3, '#ffd090');
      cypress(u, c, xr(G, 0.92), Math.round(rHill(xr(G, 0.92))) + 2, sz(G, 0.11), '#283834', '#3a4e48');

      // sağda Haliç kalyonu (statik)
      var kx = xr(G, 0.24), ky = g + 5, ks = sz(G, 0.07);
      u.px(c, kx - ks, ky - 3, ks * 2, 3, '#5a3a2a');
      u.px(c, kx - ks + 2, ky, ks * 2 - 4, 2, '#3e261a');
      u.px(c, kx - Math.floor(ks * 0.5), ky - ks - 3, 1, ks, '#4a3224');
      u.px(c, kx + Math.floor(ks * 0.2), ky - ks - 5, 1, ks + 2, '#4a3224');
      u.px(c, kx - Math.floor(ks * 0.8), ky - ks + 1, Math.round(ks * 0.6), Math.round(ks * 0.55), '#e8e0d0');
      u.px(c, kx - Math.floor(ks * 0.1), ky - ks - 2, Math.round(ks * 0.7), Math.round(ks * 0.65), '#f5eee0');

      // Haliç suyu (3 perspektif şerit)
      u.bands(c, ['#486684', '#324e6c', '#1e324a'], g, H, W, 8);
      perspGround(u, c, W, H, g, R, ['rgba(255,208,144,0.22)', 'rgba(138,170,204,0.26)', 'rgba(26,42,64,0.65)', 'rgba(255,208,144,0.32)']);

      // Ön/orta kenar taş rıhtımlar (Eminönü sol + Karaköy sağ)
      var gh2 = H - 20 - g;
      var qy = g + Math.round(gh2 * 0.52);
      var qh = Math.max(8, H - 20 - qy);
      var lqw = Math.round(W * 0.30), rqw = Math.round(W * 0.28);
      stoneQuay(u, c, 0, qy, lqw, qh, '#584e4a', '#9a8c82', '#3e3634');
      stoneQuay(u, c, W - rqw, qy + 3, rqw, qh - 3, '#584e4a', '#9a8c82', '#3e3634');
      // Pazar tezgahı + küp/sandık + iskele babaları
      if (W > 200) {
        marketStall(u, c, Math.round(W * 0.08), qy + qh - 2, 1.15, '#4a3222', '#c84a32', '#f0e0c0');
        u.px(c, Math.round(W * 0.22), qy + 2, 4, 4, '#6a4830');
        u.px(c, Math.round(W * 0.27), qy, 2, 4, '#3a302c');
        u.px(c, Math.round(W * 0.76), qy + 3, 2, 4, '#3a302c');
        u.px(c, Math.round(W * 0.81), qy + 5, 5, 4, '#7a5234');
        marketStall(u, c, Math.round(W * 0.85), qy + qh - 1, 1.0, '#4a3222', '#2a6a7a', '#f0e0c0');
      }
      return { g: g, qy: qy, qh: qh, clouds: u.makeClouds(u.rng(402), 5, W, H, 0.05, 0.27), oarX: xr(G, 0.44), oarY: g + 10 };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.6, W, ['#7a4a7e', '#b8687a', '#e89a6a', '#ffd090']);
      waterGlint(u, c, Math.round(W * 0.08), Math.round(W * 0.92), st.g + 2, st.qy - 1, t, 'rgba(255,208,144,0.48)', 7);
      // Haliç'te kadırga (t≈2 görünür)
      var gx = Math.round(st.oarX - ((t * 4) % 36)), gy0 = st.oarY + (Math.floor(t * 2) % 2);
      u.px(c, gx, gy0, 18, 3, '#4a3022');
      u.px(c, gx + 14, gy0 - 2, 4, 2, '#6a4430');
      u.px(c, gx + 8, gy0 - 8, 1, 8, '#3a2418');
      u.poly(c, [[gx + 9, gy0 - 8], [gx + 16, gy0 - 3], [gx + 9, gy0 - 2]], '#e8e0d0');
      var oarDown = Math.floor(t * 4) % 2;
      for (var oi = 0; oi < 4; oi++) u.px(c, gx + 3 + oi * 3, gy0 + 3, 1, oarDown ? 3 : 1, '#d8c0a0');
      // Solda küçük pereme kayığı (t≈2'de ~0.20W)
      var kx = Math.round(((W * 0.16 + t * 5) % Math.max(40, W * 0.30)) + W * 0.04);
      rowBoat(u, c, kx, st.g + Math.max(4, Math.round((st.qy - st.g) * 0.55)), 0.9, '#5a3a24', '#c84a32', t);
      // Rıhtımda yürüyen Osmanlı sivilleri
      var step = Math.floor(t * 3) % 4;
      var py = st.qy + st.qh - 2;
      person(u, c, Math.round(W * 0.14 + Math.sin(t * 0.5) * 8), py, 1.25, '#8a2a2a', '#f0ece0', step);
      person(u, c, Math.round(W * 0.80 - Math.sin(t * 0.4) * 6), py + 1, 1.2, '#2a5a6a', '#f0ece0', (step + 2) % 4);
      u.birds(c, t, W, G.H, 4, '#2e2a5a', 0.19);
    }
  });

  /* ================= 2) LALE DEVRİ (1680 – 1749) ================= */
  S.register('lale_devri', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(411);
      u.bands(c, ['#4a4a7a', '#8e6a94', '#c890a8', '#f8d0b0'], 0, g, W, 11);
      var sunX = Math.round(W * 0.5), sunY = g - sz(G, 0.22);
      sunRays(u, c, sunX, sunY, g, W, 'rgba(248,208,176,0.10)');
      u.sun(c, sunX, sunY, sz(G, 0.055), ['#f0a090', '#f8d0b0', '#fff4e0'], g);
      u.profile(c, 0, W, function (x) { return g - 10 - 6 * Math.sin(x / 35) - 3 * Math.sin(x / 12); }, g, '#6a5a7a', '#9a80a0');
      horizonCity(u, c, W, g, R, '#786284', '#564462', 'rgba(248,208,176,0.45)', 'ottoman');

      // sol: III. Ahmed Çeşmesi
      var fx = xl(G, 0.48), fw = sz(G, 0.20), fh = sz(G, 0.16);
      u.px(c, fx - Math.floor(fw / 2) - 2, g - 3, fw + 4, 4, '#b8ae9e');
      u.px(c, fx - Math.floor(fw / 2), g - fh, fw, fh, '#f0e8dc');
      u.px(c, fx + Math.floor(fw / 4), g - fh, Math.ceil(fw / 4), fh, '#c8beb0');
      u.px(c, fx - Math.floor(fw / 2), g - fh + 3, fw, 2, '#2a7a9a');
      u.px(c, fx - Math.floor(fw / 2), g - fh + 5, fw, 1, '#f0c030');
      for (var ni = -1; ni <= 1; ni++) {
        var nx = fx + ni * Math.max(4, Math.round(fw * 0.28));
        u.px(c, nx - 1, g - Math.round(fh * 0.55), 3, Math.round(fh * 0.45), '#8a8072');
      }
      u.px(c, fx - Math.floor(fw / 2) - 4, g - fh - 2, fw + 8, 2, '#8a5a3a');
      u.px(c, fx - Math.floor(fw / 2) - 5, g - fh - 3, fw + 10, 1, '#f0c030');
      dome(u, c, fx, g - fh - 3, Math.max(4, Math.round(fw * 0.24)), '#5a6272', '#3e4452', '#f0c030');
      dome(u, c, fx - Math.round(fw * 0.34), g - fh - 3, Math.max(2, Math.round(fw * 0.12)), '#5a6272', '#3e4452', '#f0c030');
      dome(u, c, fx + Math.round(fw * 0.34), g - fh - 3, Math.max(2, Math.round(fw * 0.12)), '#5a6272', '#3e4452', '#f0c030');

      // sağ: Sadabad Köşkü + selvi
      var kx = xr(G, 0.54), kw = sz(G, 0.24), kh = sz(G, 0.14);
      u.px(c, kx - Math.floor(kw / 2), g - kh, kw, kh, '#f0e4d4');
      u.px(c, kx + Math.floor(kw / 4), g - kh, Math.ceil(kw / 4), kh, '#cbbca8');
      u.poly(c, [[kx - Math.floor(kw / 2) - 4, g - kh], [kx, g - kh - sz(G, 0.07)], [kx + Math.floor(kw / 2) + 4, g - kh]], '#a84a3a');
      for (var wi = -2; wi <= 2; wi++) u.px(c, kx + wi * Math.max(2, Math.round(kw * 0.15)), g - Math.round(kh * 0.7), 2, Math.max(3, Math.round(kh * 0.35)), '#3a4a5e');
      cypress(u, c, xr(G, 0.88), g + 1, sz(G, 0.16), '#2a5a3a', '#3a7a4a');
      leafTree(u, c, xl(G, 0.08), g + 2, 0.9, '#4a3222', '#2e643a', '#4a8854');

      // zemin: 3 şeritli bahçe + taş yol + Kâğıthane deresi
      u.bands(c, ['#4a8a56', '#367042', '#204a2b'], g, H, W, 7);
      perspGround(u, c, W, H, g, R, ['#62a06a', '#2c5c36', '#1a3c22', '#528e5c']);
      var gh2 = H - 20 - g;
      // Sol bahçe taş yolu + kenarlarda ahşap çit
      u.poly(c, [[Math.round(W * 0.14), g + 1], [Math.round(W * 0.22), g + 1], [Math.round(W * 0.30), H - 20], [Math.round(W * 0.08), H - 20]], '#b8a894');
      var fy0 = g + Math.round(gh2 * 0.32);
      u.px(c, 0, fy0, Math.round(W * 0.11), 1, '#7a5a3e');
      u.px(c, Math.round(W * 0.25), fy0, Math.round(W * 0.10), 1, '#7a5a3e');
      for (var fi = 4; fi < Math.round(W * 0.34); fi += 10) {
        if (fi > W * 0.11 && fi < W * 0.25) continue;
        u.px(c, fi, fy0 - 2, 1, 4, '#5a3e28');
      }

      // Kâğıthane deresi (sağ)
      var sy = g + 5, sh = Math.max(8, Math.round(gh2 * 0.34));
      u.px(c, Math.round(W * 0.62), sy, Math.round(W * 0.38), sh, '#4a7a9a');
      u.px(c, Math.round(W * 0.62), sy, Math.round(W * 0.38), 1, '#c8bca8');
      u.px(c, Math.round(W * 0.62), sy + sh - 1, Math.round(W * 0.38), 1, '#988e7c');

      // Perspektifli lale tarhları (sol ve sağ kenarlarda, y'ye göre büyüyen)
      var beds = [
        [0.02, 0.12, 0.25, 0.8], [0.24, 0.34, 0.45, 1.0],
        [0.03, 0.14, 0.72, 1.3], [0.23, 0.34, 0.78, 1.4],
        [0.66, 0.96, 0.65, 1.2], [0.68, 0.95, 0.84, 1.4]
      ];
      for (var bi = 0; bi < beds.length; bi++) {
        var b = beds[bi];
        var bx0 = Math.round(W * b[0]), bx1 = Math.round(W * b[1]), by = g + Math.round(gh2 * b[2]), sc = b[3];
        if (by >= H - 22) continue;
        for (var tx = bx0; tx < bx1; tx += Math.max(4, Math.round(5 * sc))) {
          var th = Math.max(2, Math.round(3 * sc));
          var tw = Math.max(2, Math.round(2.5 * sc));
          u.px(c, tx, by - th, 1, th, '#22522c');
          u.px(c, tx - 1, by - th - tw, tw, tw, (tx + bi) % 3 === 0 ? '#f0c030' : ((tx + bi) % 2 ? '#c82a3a' : '#a8387a'));
        }
      }
      if (W > 200) {
        marketStall(u, c, Math.round(W * 0.27), g + Math.round(gh2 * 0.56), 1.05, '#5a3a22', '#c82a3a', '#f8e8c8');
      }
      return { g: g, sy: sy, sh: sh, gh: gh2, clouds: u.makeClouds(u.rng(412), 5, W, H, 0.05, 0.26) };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.5, W, ['#8e6a94', '#c890a8', '#e8b8b8', '#f8d0b0']);
      // Kâğıthane deresinde piyade kayığı (t≈2'de ~0.72W görünür)
      var bx = Math.round(W * 0.68 + ((t * 6) % Math.max(18, Math.round(W * 0.26))));
      var by = st.sy + Math.floor(st.sh * 0.48);
      rowBoat(u, c, bx, by, 1.1, '#6a4028', '#c82a3a', t);
      // Bahçede gezen Lale Devri çelebileri
      var step = Math.floor(t * 3) % 4;
      person(u, c, Math.round(W * 0.18 + Math.sin(t * 0.6) * 10), st.g + Math.round(st.gh * 0.72), 1.25, '#a83a4a', '#f0e8dc', step);
      person(u, c, Math.round(W * 0.76 - Math.sin(t * 0.5) * 8), st.g + Math.round(st.gh * 0.76), 1.2, '#2a6a7a', '#f0c030', (step + 2) % 4);
      // Sırtında mum taşıyan kaplumbağalar (daha belirgin)
      var flick = Math.floor(t * 6) % 2;
      for (var i = 0; i < 2; i++) {
        var tx = Math.round(W * (0.72 + i * 0.12) + Math.sin(t * 0.6 + i) * 6);
        var ty = st.sy + st.sh + 7 + i * 4;
        if (ty < G.H - 22) {
          u.px(c, tx, ty, 6, 3, '#4a3828');
          u.px(c, tx + 6, ty + 1, 2, 2, '#6a5840');
          u.px(c, tx + 2, ty - 3, 1, 3, '#f8f0e0');
          u.px(c, tx + 2, ty - 4 - flick, 2, 1, flick ? '#f0c030' : '#ff7030');
        }
      }
      // Kelebekler + kuşlar
      for (var bi = 0; bi < 3; bi++) {
        var bbx = Math.round(W * (0.12 + bi * 0.34) + Math.sin(t * 2.2 + bi * 2) * 8);
        var bby = st.g + 6 + Math.round(Math.cos(t * 3 + bi) * 3);
        u.px(c, bbx, bby, 2, 1, '#f0c030');
        if (Math.floor(t * 8 + bi) % 2) u.px(c, bbx + 1, bby - 1, 1, 1, '#f8d0b0');
      }
      u.birds(c, t, W, G.H, 3, '#4a3a5a', 0.18);
    }
  });

  /* ================= 3) ABD BAĞIMSIZLIĞI (1750 – 1788) ================= */
  S.register('abd_bagimsizlik', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(421);
      u.bands(c, ['#3a6ab0', '#6898d0', '#90c0e8', '#c8e4f8'], 0, g, W, 11);
      var sunX = Math.round(W * 0.52), sunY = Math.round(H * 0.16);
      sunRays(u, c, sunX, sunY, g, W, 'rgba(255,248,220,0.11)');
      u.sun(c, sunX, sunY, sz(G, 0.05), ['#f0e8c0', '#fff8dc', '#ffffff'], g);
      u.profile(c, 0, W, function (x) { return g - 6 - 4 * Math.sin(x / 40); }, g, '#6a8a9e', '#90b0c4');
      horizonCity(u, c, W, g, R, '#7090a6', '#547288', 'rgba(255,240,180,0.4)', 'paris');

      // sol: Bağımsızlık Salonu
      var hx = xl(G, 0.48), hw = sz(G, 0.28), hh = sz(G, 0.14);
      u.px(c, hx - Math.floor(hw / 2), g - hh, hw, hh, '#a83a2a');
      u.px(c, hx + Math.floor(hw / 4), g - hh, Math.ceil(hw / 4), hh, '#7e281c');
      u.px(c, hx - Math.floor(hw / 2) - 1, g - hh, hw + 2, 2, '#f0f0e8');
      u.poly(c, [[hx - Math.floor(hw / 2) - 2, g - hh], [hx, g - hh - sz(G, 0.05)], [hx + Math.floor(hw / 2) + 2, g - hh]], '#4a4e58');
      for (var wi = -3; wi <= 3; wi++) {
        if (wi === 0) continue;
        u.px(c, hx + wi * Math.max(2, Math.round(hw * 0.12)), g - Math.round(hh * 0.7), 2, 3, '#f0f0e8');
        u.px(c, hx + wi * Math.max(2, Math.round(hw * 0.12)), g - Math.round(hh * 0.35), 2, 3, '#f0f0e8');
      }
      var tw = sz(G, 0.07), th = sz(G, 0.24);
      u.px(c, hx - Math.floor(tw / 2), g - hh - Math.round(th * 0.45), tw, Math.round(th * 0.45), '#a83a2a');
      u.px(c, hx - Math.floor(tw / 2) + 1, g - hh - th, tw - 2, Math.round(th * 0.55), '#f0f0e8');
      u.px(c, hx, g - hh - Math.round(th * 0.72), 1, 2, '#2a3a6a');
      u.poly(c, [[hx - Math.floor(tw / 2), g - hh - th], [hx, g - hh - th - sz(G, 0.09)], [hx + Math.floor(tw / 2), g - hh - th]], '#e8e0d0');
      leafTree(u, c, xl(G, 0.06), g + 1, 1.0, '#4a3222', '#3a6a38', '#5a8e4e');

      // sağ: Özgürlük Çanı + büyük bayrak direği + liman gemisi
      var bx = xr(G, 0.24), bh = sz(G, 0.14);
      u.px(c, bx - 6, g - bh, 2, bh, '#6a442a');
      u.px(c, bx + 5, g - bh, 2, bh, '#6a442a');
      u.px(c, bx - 7, g - bh, 15, 3, '#52321e');
      var br = Math.max(3, sz(G, 0.04));
      u.halfDisc(c, bx, g - bh + br + 5, br, '#c89a4a');
      u.px(c, bx - br - 1, g - bh + br + 5, br * 2 + 2, 2, '#9a7030');
      u.px(c, bx, g - bh + 5, 1, br + 1, '#2a1c12');
      // büyük bayrak direği
      var fx = xr(G, 0.48), fTop = g - sz(G, 0.30);
      u.px(c, fx, fTop, 2, sz(G, 0.30), '#e8e0d0');
      u.px(c, fx, fTop - 2, 2, 2, '#d8b04a');

      // zemin: 3 perspektif şerit (çimen + toprak yol + liman suyu)
      u.bands(c, ['#748650', '#58683c', '#3c4a28'], g, H, W, 7);
      perspGround(u, c, W, H, g, R, ['#8ea068', '#4a5a32', '#2e3a1e', '#74884c']);
      var gh2 = H - 20 - g;
      // Toprak/kaldırım cadde şeridi (at arabasının geçtiği yol)
      var rdY = g + Math.round(gh2 * 0.38), rdH = Math.max(7, Math.round(gh2 * 0.28));
      u.px(c, 0, rdY, W, rdH, '#7e6650');
      u.px(c, 0, rdY, W, 1, '#9c826a');
      // Ahşap çit + koloni fıçıları/sandıkları
      u.px(c, 0, g + 5, Math.round(W * 0.33), 1, '#6a4830');
      for (var ci = 6; ci < Math.round(W * 0.33); ci += 12) u.px(c, ci, g + 3, 1, 4, '#5a3a22');
      if (W > 200) {
        u.px(c, Math.round(W * 0.06), rdY + rdH + 3, 6, 5, '#6a442a');
        u.px(c, Math.round(W * 0.13), rdY + rdH + 4, 5, 4, '#8a5a3a');
        marketStall(u, c, Math.round(W * 0.22), H - 22, 1.15, '#5a3a22', '#2a3a6a', '#f0f0e8');
        leafTree(u, c, Math.round(W * 0.03), H - 22, 1.3, '#4a3222', '#3a6a38', '#5a8e4e');
      }
      // Sağ liman suyu + rıhtım + gemi
      u.px(c, Math.round(W * 0.74), g, Math.round(W * 0.26), 14, '#2a5a8a');
      u.px(c, Math.round(W * 0.72), g + 13, Math.round(W * 0.28), 3, '#6a5848');
      var sx = xr(G, 0.78), sh = sz(G, 0.18);
      u.px(c, sx - 10, g + 3, 20, 3, '#5a3a2a');
      u.px(c, sx - 5, g - sh + 3, 1, sh, '#4a3020');
      u.px(c, sx + 2, g - sh, 1, sh + 3, '#4a3020');
      u.px(c, sx - 4, g - sh + 5, 5, Math.round(sh * 0.45), '#f0f0e8');
      u.px(c, sx + 3, g - sh + 2, 6, Math.round(sh * 0.55), '#f0f0e8');
      return { g: g, rdY: rdY, rdH: rdH, gh: gh2, fx: fx, fy: fTop, clouds: u.makeClouds(u.rng(422), 5, W, H, 0.05, 0.25) };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.6, W, ['#90b8e0', '#c0daf4', '#e8f4fc', '#ffffff']);
      // Büyütülmüş 13 şeritli + mavi kareli ABD bayrağı
      var ph = Math.floor(t * 4) % 2;
      var fw = Math.max(16, Math.round(sz(G, 0.095)));
      var fh = Math.max(10, Math.round(fw * 0.62));
      stripeFlag(u, c, st.fx + 2, st.fy, fw, fh, ['#a83a2a', '#f0f0e8'], false, ph);
      var cw = Math.round(fw * 0.42), ch = Math.round(fh * 0.52);
      u.px(c, st.fx + 2, st.fy, cw, ch, '#2a3a6a');
      for (var si = 0; si < 5; si++) {
        u.px(c, st.fx + 3 + (si % 3) * Math.max(1, Math.floor(cw / 3)), st.fy + 1 + Math.floor(si / 3) * Math.max(1, Math.floor(ch / 2)), 1, 1, '#f0f0e8');
      }
      // At arabası (t≈2'de ~0.20W görünür!)
      var cx = Math.round(((W * 0.16 + t * 8) % (W + 40)) - 20);
      var step = Math.floor(t * 5) % 4;
      carriage(u, c, cx, st.rdY + st.rdH - 2, 1.15, '#5a3a2a', '#3a2a20', '#7a5234', step);
      // Koloni sivilleri (üç köşeli şapkalı)
      person(u, c, Math.round(W * 0.78 + Math.sin(t * 0.5) * 8), st.g + Math.round(st.gh * 0.78), 1.3, '#2a3a6a', '#1a1c24', step);
      person(u, c, Math.round(W * 0.86 - Math.sin(t * 0.4) * 6), st.g + Math.round(st.gh * 0.82), 1.25, '#8a3228', '#1a1c24', (step + 2) % 4);
      u.birds(c, t, W, G.H, 4, '#2a3a6a', 0.17);
    }
  });

  /* ================= 4) FRANSIZ DEVRİMİ (1789 – 1814) ================= */
  S.register('fransiz_devrimi', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(431);
      u.bands(c, ['#4a4a6a', '#6c6c8a', '#8a8aa8', '#d8c8b8'], 0, g, W, 11);
      var sunX = Math.round(W * 0.48), sunY = Math.round(H * 0.18);
      sunRays(u, c, sunX, sunY, g, W, 'rgba(216,200,184,0.09)');
      u.sun(c, sunX, sunY, sz(G, 0.045), ['#b8a8a0', '#d8c8b8', '#f0ece4'], g);
      // uzak Paris çatıları + katmanlı şehir silueti
      u.profile(c, 0, W, function (x) { return g - 6 - ((Math.floor(x / 11) % 3) * 3); }, g, '#525268', '#787890');
      horizonCity(u, c, W, g, R, '#4a4a60', '#38384c', 'rgba(255,200,120,0.45)', 'paris');

      // sol: Bastille + barikat
      var bx = xl(G, 0.44), bw = sz(G, 0.28), bh = sz(G, 0.22);
      u.px(c, bx - Math.floor(bw / 2), g - bh, bw, bh, '#42404c');
      for (var ti = -1; ti <= 1; ti++) {
        var tx = bx + ti * Math.round(bw * 0.36);
        var tw = Math.max(4, Math.round(bw * 0.24));
        u.px(c, tx - Math.floor(tw / 2), g - bh - 4, tw, bh + 4, '#5a5864');
        u.px(c, tx + Math.floor(tw / 4), g - bh - 4, Math.ceil(tw / 4), bh + 4, '#2e2c36');
        for (var ci = 0; ci < tw; ci += 2) u.px(c, tx - Math.floor(tw / 2) + ci, g - bh - 6, 1, 2, '#5a5864');
        u.px(c, tx, g - Math.round(bh * 0.6), 1, 3, '#1e1c24');
      }
      var brx = xl(G, 0.82);
      u.px(c, brx - 12, g - 7, 24, 7, '#5a3e2c');
      u.px(c, brx - 8, g - 11, 16, 4, '#7a5a42');
      u.px(c, brx + 2, g - 13, 6, 2, '#4a3628');

      // sağ: Zafer Takı + Paris çatıları + bayrak
      var ax = xr(G, 0.46), aw = sz(G, 0.20), ah = sz(G, 0.20);
      u.px(c, ax - Math.floor(aw / 2), g - ah, aw, ah, '#d8c8b8');
      u.px(c, ax + Math.floor(aw / 4), g - ah, Math.ceil(aw / 4), ah, '#a89888');
      u.px(c, ax - Math.floor(aw / 2) - 1, g - ah, aw + 2, 2, '#f0f0f0');
      u.px(c, ax - Math.floor(aw / 2) - 1, g - Math.round(ah * 0.72), aw + 2, 1, '#9a8a7a');
      var archW = Math.max(4, Math.round(aw * 0.42)), archH = Math.round(ah * 0.65);
      u.px(c, ax - Math.floor(archW / 2), g - archH, archW, archH, '#3e3a46');
      u.halfDisc(c, ax, g - archH, Math.floor(archW / 2), '#3e3a46');
      var px0 = xr(G, 0.78), pw = sz(G, 0.14), ph = sz(G, 0.12);
      u.px(c, px0, g - ph, pw, ph, '#b0a496');
      u.poly(c, [[px0 - 1, g - ph], [px0 + 2, g - ph - 5], [px0 + pw - 2, g - ph - 5], [px0 + pw + 1, g - ph]], '#3a4052');
      u.px(c, px0 + 3, g - ph - 8, 2, 3, '#8a5a4a');
      u.px(c, px0 + pw - 4, g - ph - 8, 2, 3, '#8a5a4a');
      var fx = xr(G, 0.22), fTop = g - sz(G, 0.24);
      u.px(c, fx, fTop, 1, sz(G, 0.24), '#e8e0d0');

      // zemin: 3 şeritli Paris kaldırım taşları
      u.bands(c, ['#625e5c', '#4a4644', '#343230'], g, H, W, 7);
      perspGround(u, c, W, H, g, R, ['#767270', '#5a5654', '#242220', '#7c7672']);
      var gh2 = H - 20 - g;
      // Kenarlarda taş kaldırım bordürü + fıçılar + sokak lambası + ön kaldırım taşı
      u.px(c, 0, g + Math.round(gh2 * 0.34), Math.round(W * 0.34), 1, '#7a7470');
      u.px(c, Math.round(W * 0.66), g + Math.round(gh2 * 0.34), Math.round(W * 0.34), 1, '#7a7470');
      for (var cbi = 0; cbi < 18; cbi++) {
        var cbx = Math.round(W * (cbi < 9 ? (0.04 + cbi * 0.032) : (0.68 + (cbi - 9) * 0.032)));
        var cby = g + Math.round(gh2 * (0.62 + (cbi % 3) * 0.10));
        u.px(c, cbx, cby, 6, 2, '#2a2826');
        u.px(c, cbx, cby, 5, 1, '#78726e');
      }
      if (W > 200) {
        u.px(c, Math.round(W * 0.08), g + Math.round(gh2 * 0.65), 6, 7, '#5a3e2c');
        u.px(c, Math.round(W * 0.12), g + Math.round(gh2 * 0.68), 5, 6, '#4a3224');
        u.px(c, Math.round(W * 0.88), g + Math.round(gh2 * 0.60), 2, 12, '#242228');
      }
      return { g: g, gh: gh2, brx: brx, fx: fx, fy: fTop, clouds: u.makeClouds(u.rng(432), 5, W, H, 0.05, 0.24) };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.55, W, ['#5a5a74', '#7a7a94', '#a8a8b8', '#d8c8b8']);
      u.smoke(c, st.brx, st.g - 12, t * 1.1, 'rgba(190,185,190,0.58)', 1.3);
      stripeFlag(u, c, st.fx + 1, st.fy, 15, 10, ['#2a4aa0', '#f0f0f0', '#d82a2a'], true, Math.floor(t * 4) % 2);
      // Seçilir devrimci kalabalık (sol barikat önü + sağ meydan)
      var step = Math.floor(t * 3.5) % 4;
      var lCrowds = [0.06, 0.10, 0.14, 0.19, 0.24, 0.28];
      for (var i = 0; i < lCrowds.length; i++) {
        var cx = Math.round(W * lCrowds[i]);
        var cy = st.g + Math.round(st.gh * (0.28 + (i % 3) * 0.18));
        var sc = 1.0 + (i % 3) * 0.18;
        person(u, c, cx, cy, sc, i % 2 ? '#2e3a52' : '#4a3830', i % 3 === 0 ? '#d82a2a' : '#24222c', (step + i) % 4);
        if (i % 2 === 0) u.px(c, cx + 2, cy - Math.round(13 * sc), 1, Math.round(9 * sc), '#5a4430'); // mızrak/pankart
      }
      var rCrowds = [0.70, 0.75, 0.80, 0.85];
      for (var j = 0; j < rCrowds.length; j++) {
        var rx = Math.round(W * rCrowds[j]);
        var ry = st.g + Math.round(st.gh * (0.34 + (j % 2) * 0.24));
        person(u, c, rx, ry, 1.15 + (j % 2) * 0.15, j % 2 ? '#3a4a68' : '#524038', j === 1 ? '#d82a2a' : '#2a2830', (step + j + 1) % 4);
      }
      // Seçilir güvercinler (gökyüzünde + yerde yemlenenler)
      pigeons(u, c, t, W, G.H, 6, '#e0dcd8', '#9a9ca6', 0.18);
      for (var pi = 0; pi < 3; pi++) {
        var px = Math.round(W * (0.72 + pi * 0.08) + Math.sin(t * 1.5 + pi) * 3);
        var py = st.g + Math.round(st.gh * 0.80) + (pi % 2) * 3;
        var peck = Math.floor(t * 4 + pi) % 2;
        u.px(c, px, py, 3, 2, '#d8d4d0');
        u.px(c, px + 3, py - (peck ? 0 : 1), 1, 1, '#9a9ca6');
      }
    }
  });

  /* ================= 5) TANZİMAT (1839 – 1875) ================= */
  S.register('tanzimat', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(441);
      u.bands(c, ['#3a7ab8', '#68a4d8', '#a0d0f0', '#e0f0f8'], 0, g, W, 11);
      var sunX = Math.round(W * 0.5), sunY = Math.round(H * 0.16);
      sunRays(u, c, sunX, sunY, g, W, 'rgba(255,240,184,0.11)');
      u.sun(c, sunX, sunY, sz(G, 0.05), ['#f0d090', '#fff0b8', '#ffffff'], g);
      u.profile(c, 0, W, function (x) { return g - 7 - 5 * Math.sin(x / 33 + 1) - 2 * Math.sin(x / 11); }, g, '#6a8aa8', '#90b0c8');
      horizonCity(u, c, W, g, R, '#7898b4', '#587894', null, 'ottoman');

      // sol: Dolmabahçe Sarayı (saat kulesi YOK)
      var sx = xl(G, 0.48), sw = sz(G, 0.34), sh = sz(G, 0.12);
      u.px(c, sx - Math.floor(sw / 2) - 4, g - 3, sw + 8, 4, '#c4beb4');
      u.px(c, sx - Math.floor(sw / 2), g - sh, sw, sh, '#e8e4dc');
      u.px(c, sx - Math.floor(sw / 2), g - sh, sw, 2, '#f8f0e0');
      var mw = Math.round(sw * 0.36), mh = Math.round(sh * 1.35);
      u.px(c, sx - Math.floor(mw / 2), g - mh, mw, mh, '#f8f0e0');
      u.px(c, sx - Math.floor(mw / 2) - 1, g - mh - 2, mw + 2, 2, '#d8c8a8');
      for (var wi = -4; wi <= 4; wi++) u.px(c, sx + wi * Math.max(2, Math.round(sw * 0.095)), g - Math.round(sh * 0.68), 1, 3, '#3a4e68');
      var gx = xl(G, 0.90), gw = sz(G, 0.08), gh = sz(G, 0.13);
      u.px(c, gx - Math.floor(gw / 2), g - gh, gw, gh, '#f8f0e0');
      u.px(c, gx - 2, g - Math.round(gh * 0.65), 4, Math.round(gh * 0.65), '#2a3848');
      u.px(c, gx - Math.floor(gw / 2) - 1, g - gh - 1, gw + 2, 1, '#d8b04a');
      var fx = sx;
      u.px(c, fx, g - mh - sz(G, 0.10), 1, sz(G, 0.10), '#d8c8a8');

      // sağ: Ortaköy Camii
      var ox = xr(G, 0.60), ow = sz(G, 0.16), oh = sz(G, 0.12);
      u.px(c, ox - Math.floor(ow / 2) - 3, g - 3, ow + 6, 4, '#c4beb4');
      u.px(c, ox - Math.floor(ow / 2), g - oh, ow, oh, '#f8f0e0');
      u.px(c, ox + Math.floor(ow / 4), g - oh, Math.ceil(ow / 4), oh, '#d4cec4');
      for (var owi = -1; owi <= 1; owi++) u.px(c, ox + owi * Math.max(2, Math.round(ow * 0.24)), g - Math.round(oh * 0.72), 2, Math.round(oh * 0.45), '#3a4e68');
      dome(u, c, ox, g - oh, Math.max(4, Math.round(ow * 0.36)), '#6a7280', '#4a5260', '#f8f0e0');
      minaret(u, c, ox - Math.round(ow * 0.48), g, sz(G, 0.28), 1, '#f8f0e0', '#c4beb4', '#4a5260', '#d8b04a', false);
      minaret(u, c, ox + Math.round(ow * 0.48), g, sz(G, 0.28), 1, '#f8f0e0', '#c4beb4', '#4a5260', '#d8b04a', false);

      // Boğaz suyu (3 perspektif şerit)
      u.bands(c, ['#34689a', '#24507a', '#163454'], g, H, W, 8);
      perspGround(u, c, W, H, g, R, ['rgba(248,240,224,0.22)', 'rgba(160,208,240,0.26)', 'rgba(18,42,68,0.6)', 'rgba(248,240,224,0.32)']);

      // Ön/orta kenar mermer Boğaz rıhtımı (sol Dolmabahçe + sağ Ortaköy)
      var gh2 = H - 20 - g;
      var qy = g + Math.round(gh2 * 0.56);
      var qh = Math.max(8, H - 20 - qy);
      var lqw = Math.round(W * 0.32), rqw = Math.round(W * 0.30);
      stoneQuay(u, c, 0, qy, lqw, qh, '#bcb6ac', '#f8f0e0', '#969088');
      stoneQuay(u, c, W - rqw, qy + 2, rqw, qh - 2, '#bcb6ac', '#f8f0e0', '#969088');
      // Gaz lambası direkleri + ferforje korkuluk direkleri
      for (var ri = 8; ri < lqw; ri += 16) u.px(c, ri, qy - 3, 1, 3, '#2a3848');
      for (var rj = W - rqw + 8; rj < W; rj += 16) u.px(c, rj, qy - 1, 1, 3, '#2a3848');
      if (W > 200) {
        u.px(c, Math.round(W * 0.14), qy - 10, 1, 10, '#2a3848');
        u.px(c, Math.round(W * 0.82), qy - 8, 1, 10, '#2a3848');
        u.px(c, Math.round(W * 0.25), qy + 3, 5, 4, '#6a4830');
      }
      return { g: g, qy: qy, qh: qh, fx: fx, fy: g - mh - sz(G, 0.10), clouds: u.makeClouds(u.rng(442), 5, W, H, 0.05, 0.25) };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.6, W, ['#98bede', '#c4e0f4', '#e8f4fc', '#ffffff']);
      waterGlint(u, c, Math.round(W * 0.06), Math.round(W * 0.94), st.g + 2, st.qy - 1, t, 'rgba(248,240,224,0.38)', 8);
      u.flag(c, st.fx + 1, st.fy, 13, Math.floor(t * 4) % 2);
      // Çarklı eski vapur (t≈2'de ~0.72W'de görünür!)
      var vx = Math.round(((W * 0.68 + t * 5) % (W + 60)) - 30);
      var vy = st.g + Math.max(4, Math.round((st.qy - st.g) * 0.45));
      u.px(c, vx, vy, 28, 3, '#2a2c38');
      u.px(c, vx + 2, vy + 3, 24, 1, '#1a1c26');
      u.px(c, vx + 6, vy - 3, 14, 3, '#e8e4dc');
      u.px(c, vx + 12, vy - 10, 2, 7, '#2a2c38');
      u.px(c, vx + 12, vy - 8, 2, 1, '#c8282f');
      var wh = Math.floor(t * 6) % 2;
      u.circle(c, vx + 13, vy + 2, 3, '#6a5844');
      u.px(c, vx + 13 + (wh ? -1 : 1), vy + 1, 1, 2, '#f8f0e0');
      u.px(c, vx - 3, vy + 3, 4, 1, '#e8f4fc');
      u.smoke(c, vx + 12, vy - 11, t * 1.2, 'rgba(220,225,235,0.52)', 0.9);
      // Solda küçük Boğaz sandalı
      var kx = Math.round(((W * 0.14 + t * 4) % Math.max(40, W * 0.30)) + W * 0.04);
      rowBoat(u, c, kx, st.g + Math.max(4, Math.round((st.qy - st.g) * 0.58)), 0.9, '#6a442c', '#2a3848', t);
      // Rıhtımda Tanzimat efendileri (fesli)
      var step = Math.floor(t * 3) % 4;
      person(u, c, Math.round(W * 0.10 + Math.sin(t * 0.5) * 8), st.qy + st.qh - 2, 1.25, '#2a3444', '#c8282f', step);
      person(u, c, Math.round(W * 0.19 - Math.sin(t * 0.4) * 6), st.qy + st.qh - 1, 1.2, '#3a4252', '#c8282f', (step + 2) % 4);
      person(u, c, Math.round(W * 0.78 + Math.sin(t * 0.5) * 6), st.qy + st.qh - 1, 1.2, '#2a3444', '#c8282f', (step + 1) % 4);
      u.birds(c, t, W, G.H, 4, '#f8f0e0', 0.19);
    }
  });

  /* ================= 6) VİKTORYA LONDRASI (1876 – 1888) ================= */
  S.register('londra', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(451);
      u.bands(c, ['#3a3a4a', '#525264', '#6a6a7a', '#a8a098'], 0, g, W, 11);
      var sunX = Math.round(W * 0.5), sunY = g - sz(G, 0.20);
      sunRays(u, c, sunX, sunY, g, W, 'rgba(240,220,152,0.08)');
      u.sun(c, sunX, sunY, sz(G, 0.05), ['#a89070', '#d8b878', '#f0dc98'], g);
      u.profile(c, 0, W, function (x) { return g - 8 - ((Math.floor(x / 13) % 4) * 3); }, g, '#464654', '#5e5e6e');
      horizonCity(u, c, W, g, R, '#4a4a58', '#343440', 'rgba(232,192,112,0.55)', 'london');

      // sol: Westminster + Big Ben
      var wx = xl(G, 0.34), ww = sz(G, 0.20), wh = sz(G, 0.13);
      u.px(c, wx - Math.floor(ww / 2), g - wh, ww, wh, '#8a7a64');
      u.px(c, wx + Math.floor(ww / 4), g - wh, Math.ceil(ww / 4), wh, '#5a4e3e');
      for (var wi = -2; wi <= 2; wi++) u.px(c, wx + wi * Math.max(2, Math.round(ww * 0.18)), g - Math.round(wh * 0.7), 1, 3, '#e8c070');
      var bx = xl(G, 0.68), bw = sz(G, 0.07), bh = sz(G, 0.36);
      u.px(c, bx - Math.floor(bw / 2), g - bh, bw, bh, '#9a8a74');
      u.px(c, bx + Math.floor(bw / 4), g - bh, Math.ceil(bw / 4), bh, '#6a5e4e');
      var cr = Math.max(3, Math.floor(bw * 0.42)), cy = g - bh + cr + 3;
      u.px(c, bx - cr - 1, cy - cr - 1, cr * 2 + 2, cr * 2 + 2, '#4a3a3a');
      u.circle(c, bx, cy, cr, '#f8f0d8');
      var spH = sz(G, 0.10);
      for (var k = 0; k < spH; k++) {
        var sw = Math.max(1, Math.round(bw * (k / spH)));
        u.px(c, bx - Math.floor(sw / 2), g - bh - spH + k, sw, 1, '#3a3e48');
      }
      u.px(c, bx, g - bh - spH - 3, 1, 3, '#e8c070');

      // sağ: Tower Bridge
      var t1 = xr(G, 0.28), t2 = xr(G, 0.72), tw = sz(G, 0.065), th = sz(G, 0.26);
      var deckY = g - Math.round(th * 0.28), walkY = g - Math.round(th * 0.78);
      u.px(c, t1, walkY, t2 - t1, 2, '#5a84a8');
      u.px(c, t1 - 14, deckY, (t2 - t1) + 28, 3, '#5a84a8');
      [t1, t2].forEach(function (tx) {
        u.px(c, tx - Math.floor(tw / 2), g - th, tw, th, '#a89880');
        u.px(c, tx + Math.floor(tw / 4), g - th, Math.ceil(tw / 4), th, '#7a6e5c');
        u.poly(c, [[tx - Math.floor(tw / 2) - 1, g - th], [tx, g - th - sz(G, 0.06)], [tx + Math.floor(tw / 2) + 1, g - th]], '#4a5a6a');
        u.px(c, tx, g - Math.round(th * 0.6), 1, 2, '#e8c070');
      });

      // Thames suyu (3 perspektif şerit) + taş rıhtım
      u.bands(c, ['#444e5a', '#303842', '#1c222a'], g, H, W, 8);
      perspGround(u, c, W, H, g, R, ['rgba(232,192,112,0.16)', 'rgba(130,140,152,0.22)', 'rgba(20,24,30,0.65)', 'rgba(232,192,112,0.22)']);
      u.px(c, 0, g, Math.round(W * 0.34), 3, '#4a4644');
      u.px(c, Math.round(W * 0.68), g, Math.round(W * 0.32), 3, '#4a4644');

      // Ön/orta Victoria Embankment taş rıhtımı
      var gh2 = H - 20 - g;
      var qy = g + Math.round(gh2 * 0.56);
      var qh = Math.max(8, H - 20 - qy);
      var lqw = Math.round(W * 0.33), rqw = Math.round(W * 0.31);
      stoneQuay(u, c, 0, qy, lqw, qh, '#4a4648', '#787274', '#323032');
      stoneQuay(u, c, W - rqw, qy + 2, rqw, qh - 2, '#4a4648', '#787274', '#323032');
      var lx1 = xl(G, 0.16), lx2 = xr(G, 0.14);
      [lx1, lx2].forEach(function (lx) { u.px(c, lx, g - 11, 1, 11, '#26262e'); });
      // Ön rıhtım gaz lambaları + sandıklar
      var fl1 = Math.round(W * 0.10), fl2 = Math.round(W * 0.86);
      u.px(c, fl1, qy - 11, 1, 11, '#202026');
      u.px(c, fl2, qy - 9, 1, 11, '#202026');
      if (W > 200) {
        u.px(c, Math.round(W * 0.74), qy + 3, 6, 5, '#5a4432');
        u.px(c, Math.round(W * 0.78), qy + 4, 5, 4, '#4a3628');
      }
      return { g: g, qy: qy, qh: qh, bx: bx, cy: cy, cr: cr, lx1: lx1, lx2: lx2, fl1: fl1, fl2: fl2, clouds: u.makeClouds(u.rng(452), 5, W, H, 0.06, 0.26) };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.5, W, ['#4a4a5a', '#626274', '#7a7a8a', '#a8a098']);
      waterGlint(u, c, Math.round(W * 0.06), Math.round(W * 0.94), st.g + 4, st.qy - 1, t, 'rgba(232,192,112,0.28)', 8);
      // Big Ben yelkovanı
      var ang = t * 0.8 - Math.PI / 2, len = Math.max(2, st.cr - 1);
      for (var r = 0; r <= len; r++) {
        u.px(c, st.bx + Math.round(Math.cos(ang) * r), st.cy + Math.round(Math.sin(ang) * r), 1, 1, '#2a2220');
      }
      // Gaz lambaları titreşir (hem üst hem ön rıhtım)
      var fl = Math.floor(t * 5) % 2;
      [st.lx1, st.lx2].forEach(function (lx) {
        u.px(c, lx - 1, st.g - 13, 3, 2, fl ? '#ffdf90' : '#e8c070');
      });
      u.px(c, st.fl1 - 1, st.qy - 13, 3, 2, fl ? '#ffdf90' : '#e8c070');
      u.px(c, st.fl2 - 1, st.qy - 11, 3, 2, fl ? '#ffdf90' : '#e8c070');
      // Thames'te buharlı gemi (t≈2'de ~0.70W'de görünür!)
      var sx = Math.round(((W * 0.66 + t * 4.5) % (W + 50)) - 25);
      var sy = st.g + Math.max(4, Math.round((st.qy - st.g) * 0.42));
      u.px(c, sx, sy, 22, 3, '#3a3230');
      u.px(c, sx + 6, sy - 3, 9, 3, '#4a4644');
      u.px(c, sx + 9, sy - 9, 2, 6, '#26262e');
      u.px(c, sx - 3, sy + 2, 3, 1, '#a8a098');
      u.smoke(c, sx + 9, sy - 10, t * 1.1, 'rgba(168,160,152,0.52)', 0.9);
      // Solda kömür mavnası
      var bx = Math.round(((W * 0.12 + t * 3.5) % Math.max(40, W * 0.30)) + W * 0.04);
      rowBoat(u, c, bx, st.g + Math.max(4, Math.round((st.qy - st.g) * 0.56)), 1.0, '#3a3230', '#202026', t);
      // Rıhtımda Viktorya dönemi yayaları (silindir şapkalı)
      var step = Math.floor(t * 3) % 4;
      person(u, c, Math.round(W * 0.16 + Math.sin(t * 0.5) * 8), st.qy + st.qh - 2, 1.25, '#26262e', '#1a1a20', step);
      person(u, c, Math.round(W * 0.80 - Math.sin(t * 0.4) * 6), st.qy + st.qh - 1, 1.2, '#4a3832', '#1a1a20', (step + 2) % 4);
      // 2 sis şeridi kayar + martılar
      for (var fi = 0; fi < 2; fi++) {
        var fx = Math.round(((t * (3 + fi * 2) + fi * 90) % (W + 80)) - 60);
        u.px(c, fx, st.g - 5 - fi * 8, 52, 2, 'rgba(168,160,152,0.22)');
      }
      u.birds(c, t, W, G.H, 3, '#3a3a4a', 0.18);
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
