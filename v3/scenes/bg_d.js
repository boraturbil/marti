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

  /* ---------- yerel yardımcılar ---------- */
  function minaret(u, c, x, base, h, serefeCount, bodyCol, shadeCol, capCol, rimCol) {
    var kw = h >= 42 ? 5 : 3;
    var kh = Math.max(4, Math.round(h * 0.20));
    var sw = h >= 42 ? 3 : 2;
    var capH = Math.max(5, Math.round(h * 0.16));
    var shaftTop = base - h + capH;
    // kaide
    u.px(c, x - Math.floor(kw / 2), base - kh, kw, kh, bodyCol);
    u.px(c, x + Math.floor(kw / 2), base - kh, 1, kh, shadeCol);
    u.px(c, x - Math.floor(kw / 2), base - kh, kw, 1, rimCol);
    // gövde
    var sx = x - Math.floor(sw / 2);
    u.px(c, sx, shaftTop, sw, base - kh - shaftTop, bodyCol);
    u.px(c, sx + sw - 1, shaftTop, 1, base - kh - shaftTop, shadeCol);
    // şerefeler
    var n = Math.max(1, serefeCount || 1);
    for (var i = 0; i < n; i++) {
      var sy = shaftTop + Math.round((base - kh - shaftTop) * (0.18 + i * 0.22));
      u.px(c, x - Math.floor(sw / 2) - 1, sy, sw + 2, 1, rimCol);
      u.px(c, x - Math.floor(sw / 2) - 1, sy + 1, sw + 2, 1, shadeCol);
    }
    // külah + alem
    for (var k = 0; k < capH; k++) {
      var cw = Math.max(1, Math.round((sw + 1) * (k / capH)));
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
      var w = Math.max(1, Math.round(Math.sin((i / h) * Math.PI) * 3));
      u.px(c, x - w, base - i, w * 2 + 1, 1, i % 4 ? col1 : col2);
    }
    u.px(c, x, base, 1, 2, '#3a2a20');
  }

  function waterGlint(u, c, x0, x1, y0, y1, t, col, step) {
    var s = step || 11;
    for (var i = 0; i < 24; i++) {
      var x = x0 + ((i * 53 + Math.floor(t * 5) * (i % 2 + 1)) % Math.max(10, x1 - x0));
      var y = y0 + ((i * s) % Math.max(4, y1 - y0));
      u.px(c, x, y, 2 + (i % 2), 1, col);
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
      for (i = 0; i < w; i++) {
        sh = ph && (i >> 2) % 2 ? 1 : 0;
        for (var j = 0; j < h; j++) {
          u.px(c, x + i, y + j + sh, 1, 1, cols[j % cols.length]);
        }
      }
    }
  }

  /* ================= 1) SÜLEYMANİYE — OSMANLI KLASİK (1520 – 1599) ================= */
  S.register('suleymaniye', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(401);
      u.bands(c, ['#2e2a5a', '#7a4a7e', '#e88a5a', '#ffd090'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), g - sz(G, 0.14), sz(G, 0.06), ['#e88a5a', '#ffd090', '#fff4d0'], g);
      // uzak Haliç sırtları
      u.profile(c, 0, W, function (x) { return g - 8 - 5 * Math.sin(x / 37) - 3 * Math.sin(x / 13); }, g, '#5c3e68', '#8a5e88');
      // sol tepe + Süleymaniye Camii
      var lHill = function (x) { return g - sz(G, 0.10) + Math.max(0, x - W * 0.25) * 0.35 - 2 * Math.sin(x / 11); };
      u.profile(c, 0, W * 0.34, lHill, g + 2, '#4a364e', '#6e5270');
      var cx = xl(G, 0.46), cb = Math.round(lHill(cx)) + 2;
      var cw = sz(G, 0.24), ch = sz(G, 0.11), dr = sz(G, 0.085);
      // avlu terası
      u.px(c, cx - Math.round(cw * 0.72), cb - 3, Math.round(cw * 1.44), 4, '#b8aa98');
      u.px(c, cx - Math.round(cw * 0.72), cb - 3, Math.round(cw * 1.44), 1, '#e8e0d0');
      // gövde + kemer pencereler
      u.px(c, cx - Math.round(cw * 0.5), cb - ch, cw, ch, '#e8e0d0');
      u.px(c, cx + Math.round(cw * 0.2), cb - ch, Math.round(cw * 0.3), ch, '#c4b8a6');
      for (var wi = -3; wi <= 3; wi++) u.px(c, cx + wi * Math.max(2, Math.round(cw * 0.11)), cb - Math.round(ch * 0.6), 1, 3, '#ffd090');
      // yarım kubbeler + ana kubbe
      dome(u, c, cx - Math.round(dr * 0.95), cb - ch + 2, Math.max(3, Math.round(dr * 0.55)), '#6a6e7e', '#4a4e5e', '#9aa0b4');
      dome(u, c, cx + Math.round(dr * 0.95), cb - ch + 2, Math.max(3, Math.round(dr * 0.55)), '#6a6e7e', '#4a4e5e', '#9aa0b4');
      dome(u, c, cx, cb - ch, dr, '#707488', '#484c5e', '#a4aac0');
      // 4 minare (2 iç uzun 3 şerefe, 2 dış kısa 2 şerefe)
      var mTall = sz(G, 0.32), mShort = sz(G, 0.24);
      minaret(u, c, cx - Math.round(cw * 0.48), cb, mTall, 3, '#e8e0d0', '#b8aa98', '#4a4e5e', '#ffd090');
      minaret(u, c, cx + Math.round(cw * 0.48), cb, mTall, 3, '#e8e0d0', '#b8aa98', '#4a4e5e', '#ffd090');
      minaret(u, c, cx - Math.round(cw * 0.68), cb, mShort, 2, '#e8e0d0', '#b8aa98', '#4a4e5e', '#ffd090');
      minaret(u, c, cx + Math.round(cw * 0.68), cb, mShort, 2, '#e8e0d0', '#b8aa98', '#4a4e5e', '#ffd090');
      cypress(u, c, xl(G, 0.06), Math.round(lHill(xl(G, 0.06))) + 2, sz(G, 0.11), '#283834', '#3a4e48');
      // sağ tepe + Galata Kulesi
      var rHill = function (x) { return g - sz(G, 0.08) + Math.max(0, W * 0.78 - x) * 0.4 + 2 * Math.sin(x / 13); };
      u.profile(c, W * 0.68, W, rHill, g + 2, '#4a364e', '#6e5270');
      var gx = xr(G, 0.72), gb = Math.round(rHill(gx)) + 2, gw = sz(G, 0.065), gh = sz(G, 0.26);
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
      // sağda Haliç kalyonu (statik)
      var kx = xr(G, 0.24), ky = g + 5, ks = sz(G, 0.07);
      u.px(c, kx - ks, ky - 3, ks * 2, 3, '#5a3a2a');
      u.px(c, kx - ks + 2, ky, ks * 2 - 4, 2, '#3e261a');
      u.px(c, kx - Math.floor(ks * 0.5), ky - ks - 3, 1, ks, '#4a3224');
      u.px(c, kx + Math.floor(ks * 0.2), ky - ks - 5, 1, ks + 2, '#4a3224');
      u.px(c, kx - Math.floor(ks * 0.8), ky - ks + 1, Math.round(ks * 0.6), Math.round(ks * 0.55), '#e8e0d0');
      u.px(c, kx - Math.floor(ks * 0.1), ky - ks - 2, Math.round(ks * 0.7), Math.round(ks * 0.65), '#f5eee0');
      // Haliç suyu
      u.bands(c, ['#3a5a7a', '#2e4866', '#22364e'], g, H, W, 6);
      for (var s = 0; s < 3; s++) if (R() < 0.9) u.px(c, 0, g + s, Math.round(W * 0.34) - s * 4, 1, '#2e2238');
      return { g: g, clouds: u.makeClouds(u.rng(402), 4, W, H, 0.06, 0.26), oarX: xr(G, 0.44), oarY: g + 12 };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.6, G.W, ['#7a4a7e', '#b8687a', '#e89a6a', '#ffd090']);
      waterGlint(u, c, Math.round(G.W * 0.10), Math.round(G.W * 0.90), st.g + 2, G.H - 22, t, 'rgba(255,208,144,0.45)', 7);
      // Haliç'te kadırga + kürek animasyonu
      var gx = Math.round(st.oarX - ((t * 4) % 36)), gy0 = st.oarY + (Math.floor(t * 2) % 2);
      u.px(c, gx, gy0, 16, 2, '#4a3022');
      u.px(c, gx + 12, gy0 - 2, 4, 2, '#6a4430');
      u.px(c, gx + 7, gy0 - 7, 1, 7, '#3a2418');
      u.poly(c, [[gx + 8, gy0 - 7], [gx + 14, gy0 - 3], [gx + 8, gy0 - 2]], '#e8e0d0');
      var oarDown = Math.floor(t * 4) % 2;
      for (var oi = 0; oi < 4; oi++) u.px(c, gx + 3 + oi * 3, gy0 + 2, 1, oarDown ? 3 : 1, '#d8c0a0');
      u.birds(c, t, G.W, G.H, 3, '#2e2a5a', 0.20);
    }
  });

  /* ================= 2) LALE DEVRİ (1680 – 1749) ================= */
  S.register('lale_devri', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(411);
      u.bands(c, ['#4a4a7a', '#8e6a94', '#c890a8', '#f8d0b0'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), g - sz(G, 0.22), sz(G, 0.055), ['#f0a090', '#f8d0b0', '#fff4e0'], g);
      u.profile(c, 0, W, function (x) { return g - 10 - 6 * Math.sin(x / 35) - 3 * Math.sin(x / 12); }, g, '#6a5a7a', '#9a80a0');
      // sol: III. Ahmed Çeşmesi
      var fx = xl(G, 0.48), fw = sz(G, 0.20), fh = sz(G, 0.16);
      u.px(c, fx - Math.floor(fw / 2) - 2, g - 3, fw + 4, 4, '#b8ae9e');
      u.px(c, fx - Math.floor(fw / 2), g - fh, fw, fh, '#f0e8dc');
      u.px(c, fx + Math.floor(fw / 4), g - fh, Math.ceil(fw / 4), fh, '#c8beb0');
      // çini kuşak
      u.px(c, fx - Math.floor(fw / 2), g - fh + 3, fw, 2, '#2a7a9a');
      u.px(c, fx - Math.floor(fw / 2), g - fh + 5, fw, 1, '#f0c030');
      // çeşme nişleri
      for (var ni = -1; ni <= 1; ni++) {
        var nx = fx + ni * Math.max(4, Math.round(fw * 0.28));
        u.px(c, nx - 1, g - Math.round(fh * 0.55), 3, Math.round(fh * 0.45), '#8a8072');
      }
      // geniş saçak + kurşun külahlar
      u.px(c, fx - Math.floor(fw / 2) - 4, g - fh - 2, fw + 8, 2, '#8a5a3a');
      u.px(c, fx - Math.floor(fw / 2) - 5, g - fh - 3, fw + 10, 1, '#f0c030');
      dome(u, c, fx, g - fh - 3, Math.max(4, Math.round(fw * 0.24)), '#5a6272', '#3e4452', '#f0c030');
      dome(u, c, fx - Math.round(fw * 0.34), g - fh - 3, Math.max(2, Math.round(fw * 0.12)), '#5a6272', '#3e4452', '#f0c030');
      dome(u, c, fx + Math.round(fw * 0.34), g - fh - 3, Math.max(2, Math.round(fw * 0.12)), '#5a6272', '#3e4452', '#f0c030');
      // sağ: Sadabad Köşkü + lale tarhları
      var kx = xr(G, 0.54), kw = sz(G, 0.24), kh = sz(G, 0.14);
      u.px(c, kx - Math.floor(kw / 2), g - kh, kw, kh, '#f0e4d4');
      u.px(c, kx + Math.floor(kw / 4), g - kh, Math.ceil(kw / 4), kh, '#cbbca8');
      u.poly(c, [[kx - Math.floor(kw / 2) - 4, g - kh], [kx, g - kh - sz(G, 0.07)], [kx + Math.floor(kw / 2) + 4, g - kh]], '#a84a3a');
      for (var wi = -2; wi <= 2; wi++) u.px(c, kx + wi * Math.max(2, Math.round(kw * 0.15)), g - Math.round(kh * 0.7), 2, Math.max(3, Math.round(kh * 0.35)), '#3a4a5e');
      cypress(u, c, xr(G, 0.88), g + 1, sz(G, 0.16), '#2a5a3a', '#3a7a4a');
      // zemin: bahçe + Kâğıthane deresi
      u.bands(c, ['#3a7a4a', '#2e623c', '#224a2e'], g, H, W, 6);
      var sy = g + 5, sh = Math.max(6, Math.round((H - g) * 0.22));
      u.px(c, Math.round(W * 0.58), sy, Math.round(W * 0.42), sh, '#4a7a9a');
      u.px(c, Math.round(W * 0.58), sy, Math.round(W * 0.42), 1, '#c8bca8');
      // kırmızı ve sarı lale tarhları
      for (var ti = 0; ti < 22; ti++) {
        var tx = Math.round(W * 0.66 + R() * (W * 0.30));
        var ty = g + 2 + (ti % 3) + (R() < 0.5 ? 0 : sh + 4);
        if (ty < H - 20) {
          u.px(c, tx, ty - 2, 1, 2, '#2a5a32');
          u.px(c, tx - 1, ty - 4, 2, 2, ti % 2 ? '#c82a3a' : '#f0c030');
        }
      }
      return { g: g, sy: sy, sh: sh, clouds: u.makeClouds(u.rng(412), 4, W, H, 0.05, 0.25) };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.5, G.W, ['#8e6a94', '#c890a8', '#e8b8b8', '#f8d0b0']);
      // Kâğıthane deresinde piyade kayığı
      var bx = Math.round(G.W * 0.62 + ((t * 6) % Math.max(20, Math.round(G.W * 0.34))));
      var by = st.sy + Math.floor(st.sh * 0.45);
      u.px(c, bx, by, 12, 2, '#6a4028');
      u.px(c, bx - 2, by - 1, 2, 1, '#8a5838');
      u.px(c, bx + 12, by - 1, 2, 1, '#8a5838');
      u.px(c, bx + 5, by - 3, 2, 3, '#c82a3a');
      // sırtında mum taşıyan kaplumbağalar (çırağan eğlencesi)
      var flick = Math.floor(t * 6) % 2;
      for (var i = 0; i < 2; i++) {
        var tx = Math.round(G.W * (0.70 + i * 0.11) + Math.sin(t * 0.6 + i) * 6);
        var ty = st.sy + st.sh + 5 + i * 3;
        if (ty < G.H - 20) {
          u.px(c, tx, ty, 4, 2, '#4a3828');
          u.px(c, tx + 4, ty + 1, 1, 1, '#6a5840');
          u.px(c, tx + 1, ty - 2, 1, 2, '#f8f0e0');
          u.px(c, tx + 1, ty - 3 - flick, 1, 1, flick ? '#f0c030' : '#ff7030');
        }
      }
      // kelebekler
      for (var bi = 0; bi < 2; bi++) {
        var bbx = Math.round(G.W * (0.74 + bi * 0.08) + Math.sin(t * 2.2 + bi * 2) * 8);
        var bby = st.g - 4 + Math.round(Math.cos(t * 3 + bi) * 3);
        u.px(c, bbx, bby, 1, 1, '#f0c030');
        if (Math.floor(t * 8 + bi) % 2) u.px(c, bbx + 1, bby - 1, 1, 1, '#f8d0b0');
      }
    }
  });

  /* ================= 3) ABD BAĞIMSIZLIĞI (1750 – 1788) ================= */
  S.register('abd_bagimsizlik', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(421);
      u.bands(c, ['#3a6ab0', '#6898d0', '#90c0e8', '#c8e4f8'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.52), Math.round(H * 0.16), sz(G, 0.05), ['#f0e8c0', '#fff8dc', '#ffffff'], g);
      u.profile(c, 0, W, function (x) { return g - 6 - 4 * Math.sin(x / 40); }, g, '#6a8a9e', '#90b0c4');
      // sol: Bağımsızlık Salonu (kırmızı tuğla + beyaz çan kulesi)
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
      // beyaz çan kulesi
      var tw = sz(G, 0.07), th = sz(G, 0.24);
      u.px(c, hx - Math.floor(tw / 2), g - hh - Math.round(th * 0.45), tw, Math.round(th * 0.45), '#a83a2a');
      u.px(c, hx - Math.floor(tw / 2) + 1, g - hh - th, tw - 2, Math.round(th * 0.55), '#f0f0e8');
      u.px(c, hx, g - hh - Math.round(th * 0.72), 1, 2, '#2a3a6a');
      u.poly(c, [[hx - Math.floor(tw / 2), g - hh - th], [hx, g - hh - th - sz(G, 0.09)], [hx + Math.floor(tw / 2), g - hh - th]], '#e8e0d0');
      // sağ: ahşap çerçevede çatlak Özgürlük Çanı + liman gemisi
      var bx = xr(G, 0.26), bh = sz(G, 0.14);
      u.px(c, bx - 6, g - bh, 2, bh, '#6a442a');
      u.px(c, bx + 5, g - bh, 2, bh, '#6a442a');
      u.px(c, bx - 7, g - bh, 15, 3, '#52321e');
      var br = Math.max(3, sz(G, 0.04));
      u.halfDisc(c, bx, g - bh + br + 5, br, '#c89a4a');
      u.px(c, bx - br - 1, g - bh + br + 5, br * 2 + 2, 2, '#9a7030');
      u.px(c, bx, g - bh + 5, 1, br + 1, '#2a1c12'); // çatlak
      // bayrak direği
      var fx = xr(G, 0.50);
      u.px(c, fx, g - sz(G, 0.24), 1, sz(G, 0.24), '#e8e0d0');
      // liman suyu + uzun direkli gemi
      u.bands(c, ['#6a7a4a', '#52623a', '#3e4a2c'], g, H, W, 6);
      u.px(c, Math.round(W * 0.76), g, Math.round(W * 0.24), 12, '#2a5a8a');
      var sx = xr(G, 0.78), sh = sz(G, 0.18);
      u.px(c, sx - 10, g + 3, 20, 3, '#5a3a2a');
      u.px(c, sx - 5, g - sh + 3, 1, sh, '#4a3020');
      u.px(c, sx + 2, g - sh, 1, sh + 3, '#4a3020');
      u.px(c, sx - 4, g - sh + 5, 5, Math.round(sh * 0.45), '#f0f0e8');
      u.px(c, sx + 3, g - sh + 2, 6, Math.round(sh * 0.55), '#f0f0e8');
      if (R() < 1) u.px(c, fx, g - sz(G, 0.24) - 1, 2, 1, '#d8b04a');
      return { g: g, fx: fx, fy: g - sz(G, 0.24), clouds: u.makeClouds(u.rng(422), 4, W, H, 0.05, 0.25) };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.6, G.W, ['#90b8e0', '#c0daf4', '#e8f4fc', '#ffffff']);
      // 13 şeritli + mavi kareli bayrak (2 kare dalga)
      var ph = Math.floor(t * 4) % 2;
      stripeFlag(u, c, st.fx + 1, st.fy, 13, 8, ['#a83a2a', '#f0f0e8'], false, ph);
      u.px(c, st.fx + 1, st.fy, 5, 4, '#2a3a6a');
      u.px(c, st.fx + 3, st.fy + 1, 1, 1, '#f0f0e8');
      u.px(c, st.fx + 2, st.fy + 2, 1, 1, '#f0f0e8');
      u.px(c, st.fx + 4, st.fy + 2, 1, 1, '#f0f0e8');
      // at arabası geçer
      var cx = Math.round(((t * 7) % (G.W + 40)) - 20), cy = st.g + 6;
      u.px(c, cx, cy, 8, 3, '#5a3a2a');
      u.px(c, cx + 1, cy - 3, 6, 3, '#3a2a20');
      u.px(c, cx + 1, cy + 3, 2, 2, '#2a1a12');
      u.px(c, cx + 6, cy + 3, 2, 2, '#2a1a12');
      u.px(c, cx + 9, cy + 1, 4, 2, '#6a4a32');
      u.px(c, cx + 12, cy - 1, 2, 2, '#6a4a32');
      u.birds(c, t, G.W, G.H, 3, '#2a3a6a', 0.18);
    }
  });

  /* ================= 4) FRANSIZ DEVRİMİ (1789 – 1814) ================= */
  S.register('fransiz_devrimi', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(431);
      u.bands(c, ['#4a4a6a', '#6c6c8a', '#8a8aa8', '#d8c8b8'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.48), Math.round(H * 0.18), sz(G, 0.045), ['#b8a8a0', '#d8c8b8', '#f0ece4'], g);
      // uzak Paris çatıları
      u.profile(c, 0, W, function (x) { return g - 6 - ((Math.floor(x / 11) % 3) * 3); }, g, '#525268', '#787890');
      // sol: Bastille (yuvarlak kuleli koyu taş kale) + barikat
      var bx = xl(G, 0.45), bw = sz(G, 0.28), bh = sz(G, 0.22);
      u.px(c, bx - Math.floor(bw / 2), g - bh, bw, bh, '#42404c');
      for (var ti = -1; ti <= 1; ti++) {
        var tx = bx + ti * Math.round(bw * 0.36);
        var tw = Math.max(4, Math.round(bw * 0.24));
        u.px(c, tx - Math.floor(tw / 2), g - bh - 4, tw, bh + 4, '#5a5864');
        u.px(c, tx + Math.floor(tw / 4), g - bh - 4, Math.ceil(tw / 4), bh + 4, '#2e2c36');
        for (var ci = 0; ci < tw; ci += 2) u.px(c, tx - Math.floor(tw / 2) + ci, g - bh - 6, 1, 2, '#5a5864');
        u.px(c, tx, g - Math.round(bh * 0.6), 1, 3, '#1e1c24');
      }
      // barikat
      var brx = xl(G, 0.82);
      u.px(c, brx - 10, g - 6, 20, 6, '#5a3e2c');
      u.px(c, brx - 6, g - 9, 12, 3, '#7a5a42');
      u.px(c, brx + 2, g - 11, 5, 2, '#4a3628');
      // sağ: Zafer Takı + Paris çatıları + bayrak direği
      var ax = xr(G, 0.46), aw = sz(G, 0.20), ah = sz(G, 0.20);
      u.px(c, ax - Math.floor(aw / 2), g - ah, aw, ah, '#d8c8b8');
      u.px(c, ax + Math.floor(aw / 4), g - ah, Math.ceil(aw / 4), ah, '#a89888');
      u.px(c, ax - Math.floor(aw / 2) - 1, g - ah, aw + 2, 2, '#f0f0f0');
      u.px(c, ax - Math.floor(aw / 2) - 1, g - Math.round(ah * 0.72), aw + 2, 1, '#9a8a7a');
      var archW = Math.max(4, Math.round(aw * 0.42)), archH = Math.round(ah * 0.65);
      u.px(c, ax - Math.floor(archW / 2), g - archH, archW, archH, '#3e3a46');
      u.halfDisc(c, ax, g - archH, Math.floor(archW / 2), '#3e3a46');
      // Paris çatı + baca
      var px0 = xr(G, 0.78), pw = sz(G, 0.14), ph = sz(G, 0.12);
      u.px(c, px0, g - ph, pw, ph, '#b0a496');
      u.poly(c, [[px0 - 1, g - ph], [px0 + 2, g - ph - 5], [px0 + pw - 2, g - ph - 5], [px0 + pw + 1, g - ph]], '#3a4052');
      u.px(c, px0 + 3, g - ph - 8, 2, 3, '#8a5a4a');
      u.px(c, px0 + pw - 4, g - ph - 8, 2, 3, '#8a5a4a');
      // bayrak direği
      var fx = xr(G, 0.22);
      u.px(c, fx, g - sz(G, 0.22), 1, sz(G, 0.22), '#e8e0d0');
      // zemin: Paris kaldırım taşı
      u.bands(c, ['#5a5654', '#484442', '#363432'], g, H, W, 6);
      for (var stI = 0; stI < 30; stI++) u.px(c, Math.floor(R() * W), g + 2 + Math.floor(R() * (H - g - 22)), 2, 1, '#6a6460');
      return { g: g, brx: brx, fx: fx, fy: g - sz(G, 0.22), clouds: u.makeClouds(u.rng(432), 4, W, H, 0.05, 0.24) };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.55, G.W, ['#5a5a74', '#7a7a94', '#a8a8b8', '#d8c8b8']);
      u.smoke(c, st.brx, st.g - 10, t * 1.1, 'rgba(180,175,180,0.55)', 1.2);
      stripeFlag(u, c, st.fx + 1, st.fy, 12, 8, ['#2a4aa0', '#f0f0f0', '#d82a2a'], true, Math.floor(t * 4) % 2);
      // kalabalık silueti 1 px sallanır
      for (var i = 0; i < 6; i++) {
        var cx = st.brx + 12 + i * 4;
        var sy = st.g - 4 + ((Math.floor(t * 3 + i) % 2) ? 0 : 1);
        u.px(c, cx, sy, 2, 4, '#24222c');
        u.px(c, cx, sy - 1, 2, 1, '#24222c');
      }
      u.birds(c, t, G.W, G.H, 3, '#3a3a4a', 0.22);
    }
  });

  /* ================= 5) TANZİMAT (1839 – 1875) ================= */
  S.register('tanzimat', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(441);
      u.bands(c, ['#3a7ab8', '#68a4d8', '#a0d0f0', '#e0f0f8'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), Math.round(H * 0.16), sz(G, 0.05), ['#f0d090', '#fff0b8', '#ffffff'], g);
      u.profile(c, 0, W, function (x) { return g - 7 - 5 * Math.sin(x / 33 + 1) - 2 * Math.sin(x / 11); }, g, '#6a8aa8', '#90b0c8');
      // sol: Dolmabahçe Sarayı (saat kulesi YOK)
      var sx = xl(G, 0.48), sw = sz(G, 0.34), sh = sz(G, 0.12);
      u.px(c, sx - Math.floor(sw / 2) - 4, g - 3, sw + 8, 4, '#c4beb4');
      u.px(c, sx - Math.floor(sw / 2), g - sh, sw, sh, '#e8e4dc');
      u.px(c, sx - Math.floor(sw / 2), g - sh, sw, 2, '#f8f0e0');
      // orta büyük mabeyn bölümü
      var mw = Math.round(sw * 0.36), mh = Math.round(sh * 1.35);
      u.px(c, sx - Math.floor(mw / 2), g - mh, mw, mh, '#f8f0e0');
      u.px(c, sx - Math.floor(mw / 2) - 1, g - mh - 2, mw + 2, 2, '#d8c8a8');
      for (var wi = -4; wi <= 4; wi++) u.px(c, sx + wi * Math.max(2, Math.round(sw * 0.095)), g - Math.round(sh * 0.68), 1, 3, '#3a4e68');
      // Saltanat Kapısı (sağ ucunda)
      var gx = xl(G, 0.90), gw = sz(G, 0.08), gh = sz(G, 0.13);
      u.px(c, gx - Math.floor(gw / 2), g - gh, gw, gh, '#f8f0e0');
      u.px(c, gx - 2, g - Math.round(gh * 0.65), 4, Math.round(gh * 0.65), '#2a3848');
      u.px(c, gx - Math.floor(gw / 2) - 1, g - gh - 1, gw + 2, 1, '#d8b04a');
      // bayrak direği
      var fx = sx;
      u.px(c, fx, g - mh - sz(G, 0.10), 1, sz(G, 0.10), '#d8c8a8');
      // sağ: Ortaköy Camii (iki ince minare, 1'er şerefe)
      var ox = xr(G, 0.60), ow = sz(G, 0.16), oh = sz(G, 0.12);
      u.px(c, ox - Math.floor(ow / 2) - 3, g - 3, ow + 6, 4, '#c4beb4');
      u.px(c, ox - Math.floor(ow / 2), g - oh, ow, oh, '#f8f0e0');
      u.px(c, ox + Math.floor(ow / 4), g - oh, Math.ceil(ow / 4), oh, '#d4cec4');
      for (var owi = -1; owi <= 1; owi++) u.px(c, ox + owi * Math.max(2, Math.round(ow * 0.24)), g - Math.round(oh * 0.72), 2, Math.round(oh * 0.45), '#3a4e68');
      dome(u, c, ox, g - oh, Math.max(4, Math.round(ow * 0.36)), '#6a7280', '#4a5260', '#f8f0e0');
      minaret(u, c, ox - Math.round(ow * 0.48), g, sz(G, 0.28), 1, '#f8f0e0', '#c4beb4', '#4a5260', '#d8b04a');
      minaret(u, c, ox + Math.round(ow * 0.48), g, sz(G, 0.28), 1, '#f8f0e0', '#c4beb4', '#4a5260', '#d8b04a');
      // Boğaz suyu
      u.bands(c, ['#2a5a8a', '#224a72', '#1a385a'], g, H, W, 6);
      if (R() < 1) u.px(c, 0, g, Math.round(W * 0.32), 1, '#f8f0e0');
      return { g: g, fx: fx, fy: g - mh - sz(G, 0.10), clouds: u.makeClouds(u.rng(442), 4, W, H, 0.05, 0.25) };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.6, G.W, ['#98bede', '#c4e0f4', '#e8f4fc', '#ffffff']);
      waterGlint(u, c, Math.round(G.W * 0.12), Math.round(G.W * 0.88), st.g + 2, G.H - 22, t, 'rgba(248,240,224,0.35)', 9);
      // Türk bayrağı
      u.flag(c, st.fx + 1, st.fy, 12, Math.floor(t * 4) % 2);
      // çarklı eski vapur (bogaz vapurundan farklı)
      var vx = Math.round(((t * 5) % (G.W + 60)) - 30), vy = st.g + Math.max(4, Math.round((G.H - st.g) * 0.22));
      u.px(c, vx, vy, 26, 3, '#2a2c38');
      u.px(c, vx + 2, vy + 3, 22, 1, '#1a1c26');
      u.px(c, vx + 6, vy - 3, 13, 3, '#e8e4dc');
      u.px(c, vx + 11, vy - 10, 2, 7, '#2a2c38');
      u.px(c, vx + 11, vy - 8, 2, 1, '#c8282f');
      // çark (2 kare)
      var wh = Math.floor(t * 6) % 2;
      u.circle(c, vx + 12, vy + 2, 3, '#6a5844');
      u.px(c, vx + 12 + (wh ? -1 : 1), vy + 1, 1, 2, '#f8f0e0');
      u.px(c, vx - 3, vy + 3, 3, 1, '#e8f4fc');
      u.smoke(c, vx + 11, vy - 11, t * 1.2, 'rgba(220,225,235,0.5)', 0.9);
      u.birds(c, t, G.W, G.H, 3, '#f8f0e0', 0.20);
    }
  });

  /* ================= 6) VİKTORYA LONDRASI (1876 – 1888) ================= */
  S.register('londra', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(451);
      u.bands(c, ['#3a3a4a', '#525264', '#6a6a7a', '#a8a098'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), g - sz(G, 0.20), sz(G, 0.05), ['#a89070', '#d8b878', '#f0dc98'], g);
      u.profile(c, 0, W, function (x) { return g - 8 - ((Math.floor(x / 13) % 4) * 3); }, g, '#464654', '#5e5e6e');
      // sol: Westminster + Big Ben
      var wx = xl(G, 0.34), ww = sz(G, 0.20), wh = sz(G, 0.13);
      u.px(c, wx - Math.floor(ww / 2), g - wh, ww, wh, '#8a7a64');
      u.px(c, wx + Math.floor(ww / 4), g - wh, Math.ceil(ww / 4), wh, '#5a4e3e');
      for (var wi = -2; wi <= 2; wi++) u.px(c, wx + wi * Math.max(2, Math.round(ww * 0.18)), g - Math.round(wh * 0.7), 1, 3, '#e8c070');
      // Big Ben kulesi
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
      // sağ: Tower Bridge (iki gotik kule + mavi askı)
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
      // Thames suyu + rıhtım
      u.bands(c, ['#3a4450', '#2c343e', '#20262e'], g, H, W, 6);
      u.px(c, 0, g, Math.round(W * 0.34), 3, '#4a4644');
      u.px(c, Math.round(W * 0.68), g, Math.round(W * 0.32), 3, '#4a4644');
      // gaz lambası direkleri
      var lx1 = xl(G, 0.16), lx2 = xr(G, 0.14);
      [lx1, lx2].forEach(function (lx) { u.px(c, lx, g - 11, 1, 11, '#26262e'); });
      if (R() < 1) u.px(c, t1, g, 1, 1, '#3a4450');
      return { g: g, bx: bx, cy: cy, cr: cr, lx1: lx1, lx2: lx2, clouds: u.makeClouds(u.rng(452), 4, W, H, 0.06, 0.26) };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.5, G.W, ['#4a4a5a', '#626274', '#7a7a8a', '#a8a098']);
      // Big Ben yelkovanı t ile döner
      var ang = t * 0.8 - Math.PI / 2, len = Math.max(2, st.cr - 1);
      for (var r = 0; r <= len; r++) {
        u.px(c, st.bx + Math.round(Math.cos(ang) * r), st.cy + Math.round(Math.sin(ang) * r), 1, 1, '#2a2220');
      }
      // gaz lambaları titreşir
      var fl = Math.floor(t * 5) % 2;
      [st.lx1, st.lx2].forEach(function (lx) {
        u.px(c, lx - 1, st.g - 13, 3, 2, fl ? '#ffdf90' : '#e8c070');
      });
      // Thames'te buharlı gemi
      var sx = Math.round(((t * 4.5) % (G.W + 50)) - 25), sy = st.g + 6;
      u.px(c, sx, sy, 18, 3, '#3a3230');
      u.px(c, sx + 5, sy - 3, 8, 3, '#4a4644');
      u.px(c, sx + 8, sy - 8, 2, 5, '#26262e');
      u.smoke(c, sx + 8, sy - 9, t * 1.1, 'rgba(168,160,152,0.5)', 0.9);
      // 2 sis şeridi kayar
      for (var fi = 0; fi < 2; fi++) {
        var fx = Math.round(((t * (3 + fi * 2) + fi * 90) % (G.W + 80)) - 60);
        u.px(c, fx, st.g - 5 - fi * 8, 52, 2, 'rgba(168,160,152,0.22)');
      }
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
