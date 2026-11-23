/* PUSULLA — arkaplan paketi C (scenes/bg_c.js). Sahneler: hacli, mogol, bursa, yasak_sehir, ronesans, tac_mahal.
 * META hacli {"min":1066,"max":1199,"label":"HAÇLI SEFERLERİ","road":["#b0946a","#d0b48a","#7c6646"]}
 * META mogol {"min":1243,"max":1298,"label":"MOĞOL BOZKIRI","road":["#9a9a6a","#baba88","#6a6a44"]}
 * META bursa {"min":1299,"max":1405,"label":"OSMANLI KURULUŞU","road":["#9a8a74","#bcaa92","#6a5c4c"]}
 * META yasak_sehir {"min":1406,"max":1439,"label":"MİNG YASAK ŞEHİR","road":["#a0786a","#c09888","#704e44"]}
 * META ronesans {"min":1482,"max":1519,"label":"RÖNESANS FLORANSA","road":["#a8987e","#c8b89c","#786a56"]}
 * META tac_mahal {"min":1630,"max":1679,"label":"BABÜR TAC MAHAL","road":["#c0806a","#e0a08a","#8a5444"]}
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
  // Kubbe yardımcısı: type = 'half' | 'pointed' | 'onion'
  function dome(u, c, cx, base, r, h, type, col, shade, hi, ribCol) {
    var y, f, hw, sx, i;
    for (y = 0; y <= h; y++) {
      f = y / h;
      if (type === 'onion') {
        // soğan kubbe: tabanda hafif dar, ortada şişkin, tepede sivri
        if (f < 0.72) {
          hw = Math.round(r * (0.88 + 0.16 * Math.sin((f / 0.72) * Math.PI)));
        } else {
          hw = Math.round(r * 0.88 * Math.pow(1 - (f - 0.72) / 0.28, 0.75));
        }
      } else if (type === 'pointed') {
        hw = Math.round(r * Math.pow(Math.max(0, 1 - f * f), 0.58));
      } else {
        hw = Math.round(r * Math.sqrt(Math.max(0, 1 - f * f)));
      }
      if (hw < 1 && y < h) hw = 1;
      if (hw <= 0) continue;
      sx = Math.round(cx - hw);
      u.px(c, sx, base - y, hw * 2 + 1, 1, col);
      if (shade && hw > 2) {
        var sw = Math.max(1, Math.round(hw * 0.65));
        u.px(c, Math.round(cx + hw - sw + 1), base - y, sw, 1, shade);
      }
      if (hi && y > 1 && y < h - 1) u.px(c, sx, base - y, 1, 1, hi);
      if (ribCol && hw > 4 && y % 2 === 0) {
        for (i = -2; i <= 2; i++) {
          if (i === 0) continue;
          u.px(c, Math.round(cx + i * hw * 0.36), base - y, 1, 1, ribCol);
        }
      }
    }
    // Alem / fener ucu
    u.px(c, cx, base - h - 3, 1, 3, hi || col);
  }

  function arch(u, c, cx, base, w, h, col) {
    var hw = Math.floor(w / 2), y, aw;
    u.px(c, cx - hw, base - Math.floor(h * 0.6), hw * 2 + 1, Math.floor(h * 0.6), col);
    for (y = 0; y <= Math.ceil(h * 0.4); y++) {
      aw = Math.round(hw * Math.sqrt(Math.max(0, 1 - Math.pow(y / Math.max(1, h * 0.4), 2))));
      u.px(c, cx - aw, base - Math.floor(h * 0.6) - y, aw * 2 + 1, 1, col);
    }
  }

  function cypress(u, c, x, base, h, col, hi) {
    var i, w;
    for (i = 0; i < h; i++) {
      w = Math.max(1, Math.round(Math.sin((i / h) * Math.PI) * 3));
      u.px(c, x - w, base - i, w * 2 + 1, 1, i % 4 === 0 ? (hi || '#466a4e') : (col || '#2a4a38'));
    }
  }

  function oliveTree(u, c, x, base, r, trunk, leaf, leafHi) {
    u.px(c, x - 1, base - r - 3, 2, r + 3, trunk);
    u.circle(c, x, base - r - 3, r, leaf);
    u.circle(c, x - 1, base - r - 4, Math.max(1, r - 2), leafHi);
  }

  function turret(u, c, cx, base, w, h, col, shade, hi) {
    var x = Math.round(cx - w / 2), i;
    u.px(c, x, base - h, w, h, col);
    u.px(c, x + Math.floor(w * 0.65), base - h, Math.ceil(w * 0.35), h, shade);
    u.px(c, x, base - h, 1, h, hi);
    for (i = 0; i < w; i += 3) u.px(c, x + i, base - h - 2, 2, 2, col);
  }

  // Atlı sprite: 4 kare dörtnala (step = 0..3)
  function horseman(u, c, x, y, step, bodyCol, riderCol, bannerCol) {
    var bob = (step === 1 || step === 3) ? -1 : 0;
    var hy = y + bob;
    // Gövde, boyun, baş, kuyruk
    u.px(c, x, hy - 5, 7, 3, bodyCol);
    u.px(c, x + 6, hy - 8, 2, 4, bodyCol);
    u.px(c, x + 7, hy - 8, 3, 2, bodyCol);
    u.px(c, x - 2, hy - 5, 2, 2, bodyCol);
    // Binici
    u.px(c, x + 2, hy - 9, 3, 4, riderCol);
    u.px(c, x + 3, hy - 11, 2, 2, riderCol);
    if (bannerCol) {
      u.px(c, x + 1, hy - 16, 1, 10, '#5a4430');
      u.px(c, x - 3, hy - 16, 4, 2, bannerCol);
    }
    // 4 kare bacak animasyonu
    if (step === 0) {
      u.px(c, x, y - 2, 1, 3, bodyCol); u.px(c, x + 2, y - 2, 1, 2, bodyCol);
      u.px(c, x + 5, y - 2, 1, 3, bodyCol); u.px(c, x + 7, y - 2, 1, 2, bodyCol);
    } else if (step === 1) {
      u.px(c, x - 1, y - 2, 1, 2, bodyCol); u.px(c, x + 1, y - 2, 1, 3, bodyCol);
      u.px(c, x + 6, y - 2, 1, 2, bodyCol); u.px(c, x + 8, y - 3, 1, 2, bodyCol);
    } else if (step === 2) {
      u.px(c, x + 1, y - 2, 1, 3, bodyCol); u.px(c, x + 3, y - 2, 1, 2, bodyCol);
      u.px(c, x + 4, y - 2, 1, 3, bodyCol); u.px(c, x + 6, y - 2, 1, 2, bodyCol);
    } else {
      u.px(c, x, y - 3, 1, 2, bodyCol); u.px(c, x + 2, y - 2, 1, 3, bodyCol);
      u.px(c, x + 5, y - 2, 1, 3, bodyCol); u.px(c, x + 7, y - 2, 1, 2, bodyCol);
    }
  }

  /* ================= C1 hacli — HAÇLI SEFERLERİ (1066 – 1199) ================= */
  S.register('hacli', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(301);
      u.bands(c, ['#5a7ab0', '#86a6c8', '#b0c8d8', '#f0d8a8'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.50), Math.round(H * 0.16), sz(G, 0.055), ['#f0d8a8', '#f8e8c0', '#fff8e0']);
      u.profile(c, 0, W, function (x) {
        return g - 7 - 5 * Math.sin(x / 34) - 3 * Math.sin(x / 13);
      }, g, '#c8a882', '#dfc29a');

      // SOL: Kayalık üstünde iç içe surlu Krak des Chevaliers tarzı kale
      var lx = xl(G, 0.48), kw = Math.min(Math.round(W * 0.22), sz(G, 0.36));
      var kh = sz(G, 0.24), rockH = sz(G, 0.09), kb = g - rockH + 2;
      u.poly(c, [[lx - Math.round(kw * 0.65), g + 2], [lx - Math.round(kw * 0.52), kb], [lx + Math.round(kw * 0.52), kb], [lx + Math.round(kw * 0.62), g + 2]], '#7a6a5a');
      u.poly(c, [[lx - Math.round(kw * 0.65), g + 2], [lx - Math.round(kw * 0.52), kb], [lx - Math.round(kw * 0.1), kb], [lx - Math.round(kw * 0.2), g + 2]], '#948270');
      // Dış sur + yuvarlak kuleler
      u.px(c, lx - Math.round(kw * 0.48), kb - Math.round(kh * 0.58), Math.round(kw * 0.96), Math.round(kh * 0.58), '#c8a070');
      u.px(c, lx - Math.round(kw * 0.48), kb - Math.round(kh * 0.58), Math.round(kw * 0.96), 1, '#e6c89a');
      turret(u, c, lx - Math.round(kw * 0.44), kb, Math.max(5, Math.round(kw * 0.16)), Math.round(kh * 0.72), '#c8a070', '#967248', '#e6c89a');
      turret(u, c, lx + Math.round(kw * 0.44), kb, Math.max(5, Math.round(kw * 0.16)), Math.round(kh * 0.72), '#c8a070', '#967248', '#e6c89a');
      // İç kale (yüksek)
      turret(u, c, lx - Math.round(kw * 0.16), kb - Math.round(kh * 0.35), Math.max(6, Math.round(kw * 0.20)), Math.round(kh * 0.75), '#d4b080', '#9e7a50', '#f0d8a8');
      turret(u, c, lx + Math.round(kw * 0.16), kb - Math.round(kh * 0.35), Math.max(6, Math.round(kw * 0.20)), Math.round(kh * 0.75), '#d4b080', '#9e7a50', '#f0d8a8');
      u.px(c, lx - Math.round(kw * 0.16), kb - Math.round(kh * 0.9), Math.round(kw * 0.32), Math.round(kh * 0.55), '#c8a070');
      arch(u, c, lx, kb, Math.max(5, Math.round(kw * 0.16)), Math.round(kh * 0.34), '#4e3e30');
      // Küçük haçlı flama direği
      u.px(c, lx, kb - kh - 10, 1, 7, '#5a4430');
      u.px(c, lx + 1, kb - kh - 10, 4, 3, '#f0ece0');
      u.px(c, lx + 2, kb - kh - 10, 1, 3, '#b8322a');
      u.px(c, lx + 1, kb - kh - 9, 4, 1, '#b8322a');

      // SAĞ: Kudüs surları + Altın Kubbetüs-Sahra + zeytin
      var rx = xr(G, 0.48), rw = Math.min(Math.round(W * 0.22), sz(G, 0.36));
      var rh = sz(G, 0.15), rBase = g + 2;
      // Şehir suru
      u.px(c, rx - Math.round(rw * 0.52), rBase - Math.round(rh * 0.55), Math.round(rw * 1.04), Math.round(rh * 0.55), '#c8a878');
      u.px(c, rx - Math.round(rw * 0.52), rBase - Math.round(rh * 0.55), Math.round(rw * 1.04), 1, '#ebd2a4');
      for (var i = -4; i <= 4; i++) u.px(c, rx + Math.round(i * rw * 0.11), rBase - Math.round(rh * 0.55) - 2, 2, 2, '#c8a878');
      // Sekizgen çinili gövde + altın kubbe
      var dw = Math.round(rw * 0.52), dh = Math.round(rh * 0.9), db = rBase - Math.round(rh * 0.55);
      u.px(c, rx - Math.round(dw / 2), db - dh, dw, dh, '#d8c298');
      u.px(c, rx + Math.round(dw * 0.15), db - dh, Math.round(dw * 0.35), dh, '#a88c64');
      u.px(c, rx - Math.round(dw / 2), db - dh, dw, Math.max(2, Math.round(dh * 0.32)), '#3a6a8a');
      u.px(c, rx - Math.round(dw * 0.32), db - dh - 3, Math.round(dw * 0.64), 3, '#c8a878');
      dome(u, c, rx, db - dh - 3, Math.round(dw * 0.31), Math.round(dw * 0.44), 'pointed', '#d8a830', '#a87818', '#f8e070');
      oliveTree(u, c, rx - Math.round(rw * 0.44), rBase, Math.max(3, sz(G, 0.025)), '#6a4e36', '#5a7044', '#7a905a');
      oliveTree(u, c, rx + Math.round(rw * 0.44), rBase, Math.max(3, sz(G, 0.022)), '#6a4e36', '#5a7044', '#7a905a');

      // Zemin
      u.bands(c, ['#d0b080', '#b89464', '#94744c'], g, H, W, 6);
      for (var s = 0; s < 35; s++) {
        u.px(c, Math.floor(R() * W), g + 4 + Math.floor(R() * (H - g - 22)), 2, 1, R() < 0.5 ? '#7a6a5a' : '#e6c89a');
      }
      return { g: g, clouds: u.makeClouds(u.rng(302), 4, W, H, 0.06, 0.24) };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.7, G.W, ['#c0b4a8', '#dfd4c4', '#f4ead8', '#fff8ec']);
      var step = Math.floor(t * 7) % 4;
      var hy = st.g + Math.max(8, Math.round((G.H - st.g) * 0.34));
      var hx = Math.round(((t * 14) % (G.W + 70)) - 50);
      u.smoke(c, hx - 4, hy + 2, t * 1.4, '#e6d6b8', 0.7);
      horseman(u, c, hx, hy, step, '#7a5238', '#d8d0c4', '#b8322a');
      horseman(u, c, hx - 14, hy + 1, (step + 2) % 4, '#5a3c28', '#c8c0b4', '#d8a830');
      u.birds(c, t, G.W, G.H, 2, '#5a4a3a', 0.16);
    }
  });

  /* ================= C2 mogol — MOĞOL BOZKIRI (1243 – 1298) ================= */
  S.register('mogol', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(311);
      u.bands(c, ['#3a6ab8', '#6092d2', '#8ab8e8', '#e8f0f0'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.46), Math.round(H * 0.15), sz(G, 0.05), ['#e8f0f0', '#f6f8fa', '#ffffff']);
      // Uzakta karlı Altay dağı (sağda yükselir, orta sakin)
      u.profile(c, 0, W, function (x) {
        var rRise = x > W * 0.58 ? (x - W * 0.58) * 0.24 : 0;
        return g - 6 - 5 * Math.sin(x / 31) - rRise * (0.6 + 0.4 * Math.sin(x / 19));
      }, g, '#7892b0', '#e8f0f0');

      // SOL: Beyaz keçe yurtlar (ger) kümesi + kırmızı kapılar + at sürüsü
      var lx = xl(G, 0.45), yw = Math.max(12, sz(G, 0.095)), yh = Math.max(8, sz(G, 0.065));
      function yurt(cx, by, w, h) {
        var hw = Math.round(w / 2);
        u.px(c, cx - hw, by - Math.round(h * 0.55), w, Math.round(h * 0.55), '#f0ece0');
        u.px(c, cx + 2, by - Math.round(h * 0.55), hw - 2, Math.round(h * 0.55), '#d4cec0');
        u.poly(c, [[cx - hw - 1, by - Math.round(h * 0.55)], [cx, by - h], [cx + hw + 1, by - Math.round(h * 0.55)]], '#f6f4ec');
        u.poly(c, [[cx, by - h], [cx + hw + 1, by - Math.round(h * 0.55)], [cx + 2, by - Math.round(h * 0.55)]], '#d8d2c4');
        u.px(c, cx - hw, by - Math.round(h * 0.45), w, 1, '#8a4a3a');
        u.px(c, cx - 2, by - Math.round(h * 0.48), 4, Math.round(h * 0.48), '#b8322a');
      }
      yurt(lx - Math.round(yw * 0.9), g + 1, Math.round(yw * 0.8), Math.round(yh * 0.8));
      yurt(lx + Math.round(yw * 0.85), g + 2, Math.round(yw * 0.85), Math.round(yh * 0.85));
      yurt(lx, g + 4, yw, yh);
      // Otlayan at sürüsü
      [0.24, 0.28].forEach(function (fx, idx) {
        var hx = Math.round(W * fx), hy = g + 5 + idx * 2;
        u.px(c, hx, hy - 4, 6, 3, idx ? '#5a3a28' : '#8a5a3a');
        u.px(c, hx + 5, hy - 3, 2, 3, idx ? '#5a3a28' : '#8a5a3a');
        u.px(c, hx + 1, hy - 1, 1, 2, '#4a2e1e');
        u.px(c, hx + 4, hy - 1, 1, 2, '#4a2e1e');
      });

      // SAĞ: Karakurum taş kaplumbağası + dikilitaş + at kılı tuğlar
      var rx = xr(G, 0.46), tw = Math.max(12, sz(G, 0.11));
      // Kaplumbağa kaide
      u.px(c, rx - Math.round(tw * 0.6), g - 4, Math.round(tw * 1.2), 5, '#8a8c84');
      u.px(c, rx - Math.round(tw * 0.5), g - 7, tw, 3, '#a4a69c');
      u.px(c, rx - Math.round(tw * 0.85), g - 5, 4, 3, '#8a8c84');
      u.px(c, rx - Math.round(tw * 0.7), g - 5, 3, 1, '#c4c6bc');
      // Dikilitaş
      u.px(c, rx - 3, g - 7 - sz(G, 0.15), 6, sz(G, 0.15), '#b8b8ae');
      u.px(c, rx + 1, g - 7 - sz(G, 0.15), 2, sz(G, 0.15), '#8a8c84');
      u.px(c, rx - 4, g - 9 - sz(G, 0.15), 8, 2, '#a4a69c');
      // Tuğ direkleri (püsküller frame'de sallanır)
      var t1 = rx - Math.round(tw * 1.15), t2 = rx + Math.round(tw * 0.95);
      u.px(c, t1, g - sz(G, 0.22), 1, sz(G, 0.22) + 2, '#5a4430');
      u.px(c, t2, g - sz(G, 0.19), 1, sz(G, 0.19) + 2, '#5a4430');

      // Bozkır zemini
      u.bands(c, ['#9ab06a', '#829c58', '#6a8a4a'], g, H, W, 6);
      for (var i = 0; i < 40; i++) {
        u.px(c, Math.floor(R() * W), g + 3 + Math.floor(R() * (H - g - 21)), 2, 1, R() < 0.5 ? '#b4c884' : '#58743c');
      }
      return {
        g: g, lx: lx, yh: yh, t1: t1, t2: t2, th1: g - sz(G, 0.22), th2: g - sz(G, 0.19),
        clouds: u.makeClouds(u.rng(312), 4, W, H, 0.05, 0.25)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.8, G.W, ['#b0c6dc', '#d4e2f0', '#ecf2f8', '#ffffff']);
      // Yurt dumanı
      u.smoke(c, st.lx, st.g - st.yh + 2, t, '#e8ecee', 0.65);
      // Tuğ dalgalanması
      var sway = Math.round(Math.sin(t * 4) * 1.5);
      [
        [st.t1, st.th1],
        [st.t2, st.th2]
      ].forEach(function (p) {
        u.px(c, p[0] - 2 + sway, p[1] + 2, 5, 4, '#f0ece0');
        u.px(c, p[0] - 1 + sway, p[1] + 6, 3, 3, '#d4cec0');
        u.px(c, p[0], p[1] - 1, 1, 2, '#d8a830');
      });
      // Dörtnala 3 atlı (4 kare bacak animasyonu)
      var step = Math.floor(t * 8) % 4;
      var hy = st.g + Math.max(7, Math.round((G.H - st.g) * 0.30));
      var bx = Math.round(((t * 19) % (G.W + 90)) - 60);
      horseman(u, c, bx, hy, step, '#6e462c', '#9a362a', null);
      horseman(u, c, bx - 16, hy + 2, (step + 1) % 4, '#b89468', '#3a5a8a', null);
      horseman(u, c, bx - 30, hy - 1, (step + 2) % 4, '#3a2c24', '#c88a36', null);
      // Avcı kartalı
      u.birds(c, t * 1.1, G.W, G.H, 1, '#3a2c24', 0.14);
    }
  });

  /* ================= C3 bursa — OSMANLI KURULUŞU (1299 – 1405) ================= */
  S.register('bursa', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(321);
      u.bands(c, ['#4a7ab0', '#76a2cc', '#a0c8e0', '#f0e8d0'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.48), Math.round(H * 0.16), sz(G, 0.05), ['#f0e8d0', '#faf2d8', '#ffffff']);
      // Karlı Uludağ (sağda yükselir, ortada alçak)
      u.profile(c, 0, W, function (x) {
        var m = x > W * 0.56 ? (x - W * 0.56) * 0.27 : 0;
        return g - 8 - 4 * Math.sin(x / 36) - m * (0.7 + 0.3 * Math.cos(x / 17));
      }, g, '#6c8aa6', '#e8e8f0');

      // SOL: Bursa Ulu Camii (çok kubbeli dikdörtgen kütle, 2 minare)
      var lx = xl(G, 0.50), cw = Math.min(Math.round(W * 0.21), sz(G, 0.34));
      var ch = sz(G, 0.14), cb = g + 2;
      u.px(c, lx - Math.round(cw / 2), cb - ch, cw, ch, '#dcd2be');
      u.px(c, lx + Math.round(cw * 0.25), cb - ch, Math.round(cw * 0.25), ch, '#b4a894');
      u.px(c, lx - Math.round(cw / 2), cb - ch, cw, 1, '#f4ecdc');
      // 4 yan yana kubbe
      var dr = Math.max(3, Math.round(cw / 9));
      for (var d = -1.5; d <= 1.5; d += 1) {
        dome(u, c, Math.round(lx + d * dr * 2.1), cb - ch, dr, Math.round(dr * 0.9), 'half', '#828a92', '#5a626a', '#b6bec6');
      }
      // Kemerli pencereler
      for (var p = -3; p <= 3; p++) {
        u.px(c, lx + Math.round(p * cw * 0.12), cb - Math.round(ch * 0.65), 2, 4, '#5a5046');
      }
      // 2 minare
      [-Math.round(cw * 0.54), Math.round(cw * 0.52)].forEach(function (dx) {
        var mh = sz(G, 0.29);
        u.px(c, lx + dx, cb - mh, 3, mh, '#dcd2be');
        u.px(c, lx + dx + 2, cb - mh, 1, mh, '#b4a894');
        u.px(c, lx + dx - 1, cb - Math.round(mh * 0.68), 5, 1, '#f4ecdc');
        u.poly(c, [[lx + dx, cb - mh], [lx + dx + 1.5, cb - mh - 5], [lx + dx + 3, cb - mh]], '#5a626a');
      });

      // SAĞ: Yeşil Türbe (turkuaz sekizgen), selviler, çınar
      var rx = xr(G, 0.45), tw = Math.max(10, sz(G, 0.12)), th = sz(G, 0.15);
      u.px(c, rx - Math.round(tw / 2) - 2, g - 2, tw + 4, 4, '#c8beaa');
      u.px(c, rx - Math.round(tw / 2), g - 2 - th, tw, th, '#2e8a6a');
      u.px(c, rx + Math.round(tw * 0.15), g - 2 - th, Math.round(tw * 0.35), th, '#1f644c');
      u.px(c, rx - Math.round(tw / 2), g - 2 - th, 1, th, '#54b492');
      arch(u, c, rx, g - 2, Math.max(4, Math.round(tw * 0.35)), Math.round(th * 0.55), '#184436');
      dome(u, c, rx, g - 2 - th, Math.round(tw * 0.46), Math.round(tw * 0.55), 'pointed', '#3a9474', '#22604a', '#70cca8');
      cypress(u, c, rx - Math.round(tw * 0.9), g + 2, sz(G, 0.18), '#264836', '#3c684c');
      cypress(u, c, rx + Math.round(tw * 0.85), g + 2, sz(G, 0.15), '#264836', '#3c684c');
      // Çınar ağacı gövdesi (yapraklar frame'de hafif salınır)
      var cxTree = rx + Math.round(tw * 1.45);
      u.px(c, cxTree - 1, g - sz(G, 0.13), 3, sz(G, 0.15), '#5e4634');

      // Zemin
      u.bands(c, ['#7a9a5a', '#648448', '#4c6836'], g, H, W, 6);
      for (var i = 0; i < 30; i++) {
        u.px(c, Math.floor(R() * W), g + 4 + Math.floor(R() * (H - g - 22)), 2, 1, R() < 0.5 ? '#94b472' : '#40582c');
      }
      return {
        g: g, cxTree: cxTree, cyTree: g - sz(G, 0.14),
        clouds: u.makeClouds(u.rng(322), 4, W, H, 0.06, 0.25)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.65, G.W, ['#9ebad0', '#c4d8e8', '#e2eef6', '#ffffff']);
      // Çınar yaprağı salınımı
      var sw = Math.round(Math.sin(t * 2.2));
      u.circle(c, st.cxTree + sw, st.cyTree, 7, '#4c723c');
      u.circle(c, st.cxTree - 4 + sw, st.cyTree + 2, 5, '#5e884a');
      u.circle(c, st.cxTree + 4 + sw, st.cyTree + 2, 5, '#3c5e2e');
      // Uzakta atlı akıncı
      var step = Math.floor(t * 6) % 4;
      var hy = st.g + Math.max(6, Math.round((G.H - st.g) * 0.28));
      var hx = Math.round(G.W - ((t * 14) % (G.W + 50)) + 20);
      horseman(u, c, hx, hy, step, '#5a3a28', '#8a2a2a', '#2e8a6a');
      u.birds(c, t, G.W, G.H, 3, '#3a4a58', 0.18);
    }
  });

  /* ================= C4 yasak_sehir — MİNG YASAK ŞEHİR (1406 – 1439) ================= */
  S.register('yasak_sehir', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(331);
      u.bands(c, ['#3a3a6a', '#644a72', '#8a5a7a', '#e8a070'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.50), Math.round(H * 0.20), sz(G, 0.055), ['#e8a070', '#f4c08a', '#ffe4b4']);
      u.profile(c, 0, W, function (x) {
        return g - 6 - 4 * Math.sin(x / 38) - 2 * Math.cos(x / 15);
      }, g, '#543c5e', '#765278');

      // SOL: Taihe Salonu (mermer teras + kırmızı duvar + sarı çift katlı kıvrık çatı)
      var lx = xl(G, 0.50), tw = Math.min(Math.round(W * 0.22), sz(G, 0.34));
      var th = sz(G, 0.12), tb = g + 2;
      // Mermer teras
      u.px(c, lx - Math.round(tw * 0.58), tb - 5, Math.round(tw * 1.16), 5, '#e8e2d8');
      u.px(c, lx - Math.round(tw * 0.52), tb - 8, Math.round(tw * 1.04), 3, '#d4ccc0');
      u.px(c, lx - Math.round(tw * 0.58), tb - 5, Math.round(tw * 1.16), 1, '#ffffff');
      // Kırmızı duvar + sütunlar
      u.px(c, lx - Math.round(tw * 0.42), tb - 8 - th, Math.round(tw * 0.84), th, '#c8302a');
      u.px(c, lx + Math.round(tw * 0.12), tb - 8 - th, Math.round(tw * 0.30), th, '#96201c');
      for (var s = -3; s <= 3; s++) u.px(c, lx + Math.round(s * tw * 0.11), tb - 8 - th, 1, th, '#e8c040');
      // Çift katlı kıvrık sarı çatı
      var r1y = tb - 8 - th;
      u.poly(c, [[lx - Math.round(tw * 0.54), r1y], [lx - Math.round(tw * 0.36), r1y - 6], [lx + Math.round(tw * 0.36), r1y - 6], [lx + Math.round(tw * 0.54), r1y]], '#e8c040');
      u.px(c, lx - Math.round(tw * 0.54), r1y - 1, 2, 1, '#f8dc68');
      u.px(c, lx + Math.round(tw * 0.52), r1y - 1, 2, 1, '#c89e28');
      var r2y = r1y - 6;
      u.px(c, lx - Math.round(tw * 0.30), r2y - 5, Math.round(tw * 0.60), 5, '#c8302a');
      u.poly(c, [[lx - Math.round(tw * 0.42), r2y - 5], [lx - Math.round(tw * 0.24), r2y - 12], [lx + Math.round(tw * 0.24), r2y - 12], [lx + Math.round(tw * 0.42), r2y - 5]], '#e8c040');
      u.px(c, lx - Math.round(tw * 0.24), r2y - 13, Math.round(tw * 0.48), 1, '#f8dc68');

      // SAĞ: Cennet Tapınağı (mavi 3 katlı yuvarlak çatı) + söğüt
      var rx = xr(G, 0.45), cw = Math.max(12, sz(G, 0.16)), cb = g + 2;
      u.px(c, rx - Math.round(cw * 0.65), cb - 5, Math.round(cw * 1.3), 5, '#e8e2d8');
      u.px(c, rx - Math.round(cw * 0.42), cb - 13, Math.round(cw * 0.84), 8, '#c8302a');
      // 3 katlı mavi çatı
      [
        [cb - 13, Math.round(cw * 0.60), 5],
        [cb - 19, Math.round(cw * 0.44), 5],
        [cb - 25, Math.round(cw * 0.28), 6]
      ].forEach(function (tier) {
        u.poly(c, [[rx - tier[1], tier[0]], [rx, tier[0] - tier[2]], [rx + tier[1], tier[0]]], '#2e5a8a');
        u.px(c, rx - tier[1], tier[0] - 1, tier[1] * 2, 1, '#4c80b4');
      });
      u.px(c, rx, cb - 34, 1, 3, '#e8c040');
      // Söğüt ağacı
      var wx = rx + Math.round(cw * 0.95);
      u.px(c, wx, cb - 16, 2, 16, '#5a4032');
      u.circle(c, wx, cb - 18, 6, '#526e44');
      for (var w = -4; w <= 4; w += 2) u.px(c, wx + w, cb - 14, 1, 7, '#648252');

      // Zemin
      u.bands(c, ['#9a7264', '#7e5c52', '#624640'], g, H, W, 6);
      for (var i = 0; i < 24; i++) u.px(c, Math.floor(R() * W), g + 4 + Math.floor(R() * (H - g - 22)), 3, 1, '#b48c7c');
      return {
        g: g, lx: lx, tw: tw, r1y: r1y, rx: rx, cw: cw,
        clouds: u.makeClouds(u.rng(332), 4, W, H, 0.05, 0.22)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.55, G.W, ['#5a4468', '#865a78', '#b87a82', '#e8a888']);
      // Kırmızı fenerler sallanır
      var sw = Math.round(Math.sin(t * 3));
      [st.lx - Math.round(st.tw * 0.46), st.lx + Math.round(st.tw * 0.46)].forEach(function (fx) {
        u.px(c, fx + sw, st.r1y + 1, 2, 3, '#e83a2e');
        u.px(c, fx + sw, st.r1y + 2, 1, 1, '#f8d060');
      });
      // Ejder uçurtması süzülür
      var kx = Math.round(((t * 11) % (G.W + 50)) - 25);
      var ky = Math.round(G.H * 0.22 + Math.sin(t * 2.2) * 5);
      u.px(c, kx, ky, 4, 3, '#e8c040');
      u.px(c, kx + 1, ky + 1, 2, 1, '#c8302a');
      for (var k = 1; k <= 5; k++) {
        u.px(c, kx - k * 3, ky + Math.round(Math.sin(t * 5 + k) * 2), 2, 2, k % 2 ? '#c8302a' : '#e8c040');
      }
      u.birds(c, t, G.W, G.H, 3, '#2e2444', 0.16);
    }
  });

  /* ================= C5 ronesans — RÖNESANS FLORANSA (1482 – 1519) ================= */
  S.register('ronesans', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(341);
      u.bands(c, ['#5a6aa8', '#8e84a8', '#c8a0a8', '#f8d0a0'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.48), Math.round(H * 0.17), sz(G, 0.055), ['#f8b888', '#f8d0a0', '#fff4d8']);
      u.profile(c, 0, W, function (x) {
        return g - 7 - 5 * Math.sin(x / 35) - 3 * Math.cos(x / 14);
      }, g, '#7a7a64', '#9aa07e');

      // SOL: Floransa Duomo (Brunelleschi kubbesi + Giotto çan kulesi)
      var lx = xl(G, 0.52), dw = Math.min(Math.round(W * 0.19), sz(G, 0.30));
      var db = g + 2, dh = sz(G, 0.15);
      // Katedral gövdesi
      u.px(c, lx - Math.round(dw * 0.45), db - dh, Math.round(dw * 0.90), dh, '#e8e0d0');
      u.px(c, lx + Math.round(dw * 0.15), db - dh, Math.round(dw * 0.30), dh, '#c4bcac');
      u.px(c, lx - Math.round(dw * 0.45), db - dh + 3, Math.round(dw * 0.90), 2, '#3a6a4a');
      // Brunelleschi kubbesi (kiremit kırmızısı + beyaz nervür)
      var dr = Math.round(dw * 0.36);
      dome(u, c, lx, db - dh, dr, Math.round(dr * 1.15), 'pointed', '#b0503a', '#823424', '#d87058', '#e8e0d0');
      u.px(c, lx - 2, db - dh - Math.round(dr * 1.15) - 4, 4, 4, '#e8e0d0');
      // Çan kulesi
      var cxCamp = lx - Math.round(dw * 0.58), ch = sz(G, 0.32);
      u.px(c, cxCamp - 3, db - ch, 6, ch, '#e8e0d0');
      u.px(c, cxCamp + 1, db - ch, 2, ch, '#c4bcac');
      for (var y = db - ch + 3; y < db - 2; y += 5) u.px(c, cxCamp - 3, y, 6, 1, '#3a6a4a');
      u.px(c, cxCamp - 4, db - ch - 2, 8, 2, '#b0503a');

      // SAĞ: Palazzo Vecchio kulesi + Arno üstünde Ponte Vecchio
      var rx = xr(G, 0.46), rw = Math.min(Math.round(W * 0.22), sz(G, 0.34));
      // Palazzo Vecchio
      var px = rx + Math.round(rw * 0.24), ph = sz(G, 0.14);
      u.px(c, px - 8, g - ph, 16, ph, '#c8b496');
      u.px(c, px + 3, g - ph, 5, ph, '#a08c70');
      u.px(c, px - 3, g - sz(G, 0.29), 6, sz(G, 0.29) - ph + 2, '#d4c0a2');
      u.px(c, px - 4, g - sz(G, 0.31), 8, 2, '#a08c70');
      // Sol zemin Toskana yeşili (tüm genişlikte alt taban; sağda Arno nehri üstüne biner)
      u.bands(c, ['#7a8a52', '#5e6e3e'], g, H, W, 4);
      // Arno nehri sağda + Ponte Vecchio
      var arnoX = Math.round(W * 0.58);
      u.px(c, arnoX, g, W - arnoX, H - 18 - g, '#4e6e8e');
      u.px(c, arnoX, g, W - arnoX, Math.round((H - 18 - g) * 0.45), '#5a7a9a');
      var bx = rx - Math.round(rw * 0.18), bw = Math.round(rw * 0.72);
      u.px(c, bx - Math.round(bw / 2), g - 4, bw, 6, '#d8c4a6');
      arch(u, c, bx - Math.round(bw * 0.24), g + 2, Math.max(4, Math.round(bw * 0.26)), 5, '#446282');
      arch(u, c, bx + Math.round(bw * 0.24), g + 2, Math.max(4, Math.round(bw * 0.26)), 5, '#446282');
      for (var h = -2; h <= 2; h++) {
        u.px(c, bx + Math.round(h * bw * 0.17) - 2, g - 8, 4, 4, h % 2 ? '#e8d8c0' : '#d0b08a');
        u.px(c, bx + Math.round(h * bw * 0.17) - 2, g - 9, 4, 1, '#b0503a');
      }

      for (var i = 0; i < 20; i++) u.px(c, Math.floor(R() * W * 0.55), g + 4 + Math.floor(R() * (H - g - 22)), 2, 1, '#94a668');
      return { g: g, rx: rx, clouds: u.makeClouds(u.rng(342), 4, W, H, 0.05, 0.24) };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.6, G.W, ['#a8889e', '#cfa4a4', '#eec4a8', '#fff0d0']);
      // Leonardo uçan makinesi (3 kare kanat çırpma)
      var mx = Math.round(((t * 13) % (G.W + 50)) - 25);
      var my = Math.round(G.H * 0.20 + Math.sin(t * 2.5) * 4);
      var flap = Math.floor(t * 7) % 3; // 0: yukarı, 1: düz, 2: aşağı
      u.px(c, mx - 2, my, 5, 2, '#7a5230');
      if (flap === 0) {
        u.px(c, mx - 5, my - 3, 4, 2, '#e8dcc4');
        u.px(c, mx + 2, my - 3, 4, 2, '#e8dcc4');
      } else if (flap === 1) {
        u.px(c, mx - 6, my - 1, 5, 2, '#e8dcc4');
        u.px(c, mx + 2, my - 1, 5, 2, '#e8dcc4');
      } else {
        u.px(c, mx - 5, my + 1, 4, 2, '#e8dcc4');
        u.px(c, mx + 2, my + 1, 4, 2, '#e8dcc4');
      }
      // Arno'da yansıma parıltısı
      for (var i = 0; i < 10; i++) {
        var wx = Math.round(G.W * 0.62 + ((i * 23 + Math.floor(t * 5) * 3) % Math.max(10, Math.round(G.W * 0.34))));
        var wy = st.g + 4 + ((i * 7) % Math.max(6, G.H - st.g - 24));
        u.px(c, wx, wy, 2, 1, '#f8d0a0');
      }
      u.birds(c, t, G.W, G.H, 3, '#fff0d8', 0.16);
    }
  });

  /* ================= C6 tac_mahal — BABÜR TAC MAHAL (1630 – 1679) ================= */
  S.register('tac_mahal', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(351);
      u.bands(c, ['#4a3a6a', '#8c5a82', '#c87a9a', '#f8c0a0'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.50), Math.round(H * 0.18), sz(G, 0.055), ['#f89898', '#f8c0a0', '#ffe8d0']);
      u.profile(c, 0, W, function (x) {
        return g - 5 - 3 * Math.sin(x / 32) - 2 * Math.sin(x / 11);
      }, g, '#4a3e5a', '#6e5676');

      // SOL: Tac Mahal (beyaz soğan kubbe, 4 minare, kemerli iwan)
      var lx = xl(G, 0.50), tw = Math.min(Math.round(W * 0.21), sz(G, 0.34));
      var tb = g + 2, th = sz(G, 0.14);
      // Mermer platform
      u.px(c, lx - Math.round(tw * 0.60), tb - 4, Math.round(tw * 1.20), 4, '#e0d6d4');
      u.px(c, lx - Math.round(tw * 0.60), tb - 4, Math.round(tw * 1.20), 1, '#ffffff');
      // Ana kütle
      var mw = Math.round(tw * 0.68), mb = tb - 4;
      u.px(c, lx - Math.round(mw / 2), mb - th, mw, th, '#f8f0e8');
      u.px(c, lx + Math.round(mw * 0.18), mb - th, Math.round(mw * 0.32), th, '#d4c8cc');
      u.px(c, lx - Math.round(mw / 2), mb - th, 1, th, '#ffffff');
      // Merkezi kemerli iwan
      arch(u, c, lx, mb, Math.max(6, Math.round(mw * 0.36)), Math.round(th * 0.72), '#7a6874');
      // Büyük soğan kubbe + 2 küçük chhatri
      dome(u, c, lx, mb - th, Math.round(mw * 0.30), Math.round(mw * 0.42), 'onion', '#f8f0e8', '#cfc2c6', '#ffffff');
      dome(u, c, lx - Math.round(mw * 0.36), mb - th, Math.max(2, Math.round(mw * 0.10)), Math.max(3, Math.round(mw * 0.14)), 'onion', '#f8f0e8', '#cfc2c6', '#ffffff');
      dome(u, c, lx + Math.round(mw * 0.36), mb - th, Math.max(2, Math.round(mw * 0.10)), Math.max(3, Math.round(mw * 0.14)), 'onion', '#f8f0e8', '#cfc2c6', '#ffffff');
      // 4 ince minare
      [-0.56, -0.42, 0.42, 0.56].forEach(function (f, idx) {
        var mx = lx + Math.round(tw * f), mh = Math.round(th * (idx === 0 || idx === 3 ? 1.35 : 1.08));
        u.px(c, mx, mb - mh, 2, mh, '#f8f0e8');
        u.px(c, mx + 1, mb - mh, 1, mh, '#cfc2c6');
        u.px(c, mx - 1, mb - mh - 2, 4, 2, '#f8f0e8');
      });

      // SAĞ: Kızıl Kale (kırmızı kumtaşı surlar) + uzun su kanalı + selviler
      var rx = xr(G, 0.48), rw = Math.min(Math.round(W * 0.21), sz(G, 0.34));
      var rh = sz(G, 0.14);
      u.px(c, rx - Math.round(rw * 0.48), g - rh, Math.round(rw * 0.96), rh + 2, '#b04a3a');
      u.px(c, rx + Math.round(rw * 0.15), g - rh, Math.round(rw * 0.33), rh + 2, '#823228');
      u.px(c, rx - Math.round(rw * 0.48), g - rh, Math.round(rw * 0.96), 1, '#d8705c');
      turret(u, c, rx - Math.round(rw * 0.42), g + 2, 5, Math.round(rh * 1.25), '#b04a3a', '#823228', '#d8705c');
      turret(u, c, rx + Math.round(rw * 0.42), g + 2, 5, Math.round(rh * 1.25), '#b04a3a', '#823228', '#d8705c');
      dome(u, c, rx - Math.round(rw * 0.42), g + 2 - Math.round(rh * 1.25) - 2, 3, 4, 'onion', '#f8f0e8', '#cfc2c6', '#ffffff');
      dome(u, c, rx + Math.round(rw * 0.42), g + 2 - Math.round(rh * 1.25) - 2, 3, 4, 'onion', '#f8f0e8', '#cfc2c6', '#ffffff');
      arch(u, c, rx, g + 2, Math.max(5, Math.round(rw * 0.20)), Math.round(rh * 0.65), '#4a2422');
      cypress(u, c, rx - Math.round(rw * 0.56), g + 2, sz(G, 0.14), '#2e583e', '#447654');

      // Zemin + sağda su kanalı
      u.bands(c, ['#4a744a', '#3a603c', '#2e4e30'], g, H, W, 5);
      // Uzun su kanalı (sağ bölgede, yolun üstünde)
      var ky0 = g + 4, kh = Math.max(5, Math.round((H - g - 22) * 0.65));
      u.px(c, Math.round(W * 0.68), ky0 - 1, Math.round(W * 0.26), kh + 2, '#e0d6d4');
      u.px(c, Math.round(W * 0.69), ky0, Math.round(W * 0.24), kh, '#6a7a9e');
      for (var i = 0; i < 16; i++) u.px(c, Math.floor(R() * W * 0.62), g + 4 + Math.floor(R() * (H - g - 22)), 2, 1, '#689264');
      return {
        g: g, ky0: ky0, kh: kh,
        clouds: u.makeClouds(u.rng(352), 4, W, H, 0.05, 0.22)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.55, G.W, ['#8e5a7e', '#c87a9a', '#ee9ea8', '#ffd2c8']);
      // Kanalda dalga yansıması
      for (var i = 0; i < 8; i++) {
        var wx = Math.round(G.W * 0.70 + ((i * 19 + Math.floor(t * 4) * 2) % Math.max(8, Math.round(G.W * 0.22))));
        var wy = st.ky0 + (i % Math.max(1, st.kh));
        u.px(c, wx, wy, 2, 1, i % 2 ? '#f8c0a0' : '#f8f0e8');
      }
      // Süslü fil yürür (4 kare)
      var step = Math.floor(t * 5) % 4;
      var ex = Math.round(G.W - ((t * 9) % (G.W + 50)) + 20);
      var ey = st.g + Math.max(6, Math.round((G.H - st.g) * 0.30));
      var sw = (step === 1 || step === 3) ? 1 : 0;
      u.px(c, ex, ey - 7, 10, 6, '#7a7478');
      u.px(c, ex - 3, ey - 8, 4, 5, '#8a8488');
      u.px(c, ex - 4, ey - 5 + sw, 2, 4, '#7a7478'); // hortum
      u.px(c, ex - 4, ey - 4, 2, 1, '#f8f0e8'); // diş
      u.px(c, ex + 2, ey - 9, 5, 2, '#c8302a'); // süslü örtü
      u.px(c, ex + 3, ey - 10, 3, 1, '#e8c040');
      // 4 kare bacak
      var l1 = step === 0 ? 1 : (step === 2 ? -1 : 0);
      var l2 = -l1;
      u.px(c, ex + 1 + l1, ey - 1, 2, 3, '#686266');
      u.px(c, ex + 4 + l2, ey - 1, 2, 3, '#686266');
      u.px(c, ex + 7 + l1, ey - 1, 2, 3, '#686266');
      // Papağan sürüsü
      u.birds(c, t * 1.1, G.W, G.H, 3, '#58b458', 0.16);
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
