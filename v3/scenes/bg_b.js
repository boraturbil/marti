/* PUSULLA — arkaplan paketi B (scenes/bg_b.js). Sahneler: cin_seddi, roma, maya, ayasofya, bagdat, viking.
 * META cin_seddi {"min":-220,"max":-28,"label":"ÇİN SEDDİ","road":["#8e7a66","#ae9a84","#5e5040"]}
 * META roma {"min":-27,"max":199,"label":"ROMA KOLEZYUM","road":["#8a8478","#aaa496","#5c574e"]}
 * META maya {"min":200,"max":499,"label":"MAYA TİKAL","road":["#9a8a6a","#bcac88","#6a5c44"]}
 * META ayasofya {"min":500,"max":749,"label":"BİZANS AYASOFYA","road":["#a89a88","#c8baa6","#766a5c"]}
 * META bagdat {"min":750,"max":899,"label":"ABBASİ BAĞDAT","road":["#a8865a","#c8a678","#765a3a"]}
 * META viking {"min":900,"max":1065,"label":"VİKİNG FİYORDU","road":["#6a6e72","#8a8e92","#44474a"]}
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
  function arch(u, c, x, y, w, h, col) {
    var r = Math.max(1, Math.floor(w / 2));
    var topH = Math.min(r, h);
    if (h > topH) u.px(c, x, y + topH, w, h - topH, col);
    for (var dy = 0; dy < topH; dy++) {
      var d = topH - dy;
      var hw = Math.floor(Math.sqrt(Math.max(0, r * r - d * d)));
      if (hw > 0) u.px(c, x + r - hw, y + dy, hw * 2 + (w % 2), 1, col);
    }
  }

  function cypress(u, c, x, base, h) {
    for (var i = 0; i < h; i++) {
      var w = Math.max(1, Math.round(Math.sin(i / h * Math.PI) * 3));
      u.px(c, x - w, base - i, w * 2 + 1, 1, i % 4 ? '#2e4a3a' : '#3e5e46');
    }
  }

  function pine(u, c, x, base, h, dark, light) {
    for (var i = 0; i < h; i++) {
      var hw = Math.floor((i / h) * (h * 0.36)) + 1;
      u.px(c, x - hw, base - h + i, hw * 2 + 1, 1, i % 3 === 0 ? light : dark);
    }
    u.px(c, x, base, 2, 3, '#4a3424');
  }

  function palm(u, c, x, base, h, trunkCol, leafDark, leafLight) {
    for (var i = 0; i < h; i++) {
      u.px(c, x + Math.round(Math.sin(i / h * 1.3) * 3), base - i, 2, 1, i % 3 ? trunkCol : '#4a3020');
    }
    var tx = x + Math.round(Math.sin(1.3) * 3), ty = base - h;
    var dirs = [[-1, -0.2], [-1, 0.5], [1, -0.2], [1, 0.5], [-0.4, -1], [0.4, -1]];
    for (var d = 0; d < dirs.length; d++) {
      for (var k = 0; k < 8; k++) {
        u.px(c, tx + Math.round(dirs[d][0] * k), ty + Math.round(dirs[d][1] * k + k * k * 0.06), 2, 1, k % 2 ? leafLight : leafDark);
      }
    }
  }

  /* ================= 1) ÇİN SEDDİ (-220 – -28) ================= */
  S.register('cin_seddi', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(201);
      u.bands(c, ['#6e86a8', '#b9c6d4', '#e9e1cf'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), Math.round(H * 0.22), 14, ['#d8d2be', '#ebe4d0', '#f7f3e6'], g);
      // Uzak puslu dağlar
      u.profile(c, 0, W, function (x) { return g - 16 - 10 * Math.sin(x / 43) - 5 * Math.sin(x / 17); }, g, '#7e94b0', '#b4c2d2');
      u.profile(c, 0, W, function (x) { return g - 8 - 6 * Math.sin(x / 29 + 1.4) - 3 * Math.sin(x / 11); }, g, '#667a94', '#8ea0b8');

      // Sol: dağ sırtı + kıvrılan Çin Seddi + gözetleme kulesi
      var ridge = function (x) {
        var fade = Math.max(0, Math.min(1, (W * 0.34 - x) / (W * 0.08)));
        return g - Math.round((12 + sz(G, 0.22) * Math.max(0, 1 - Math.abs(x - xl(G, 0.45)) / (W * 0.20)) + 3 * Math.sin(x / 11)) * fade);
      };
      u.profile(c, 0, Math.round(W * 0.34), ridge, g + 2, '#4e6a4a', '#6e8c66');

      var wallX0 = Math.round(W * 0.04), wallX1 = Math.round(W * 0.32);
      for (var wx = wallX0; wx <= wallX1; wx++) {
        var wy = Math.round(ridge(wx)) - 2;
        u.px(c, wx, wy - 7, 1, 9, '#9e8e7c');
        u.px(c, wx, wy - 8, 1, 1, '#d8ccb8');
        if (wx % 4 < 2) u.px(c, wx, wy - 10, 2, 2, '#b4a490');
        u.px(c, wx, wy - 3, 1, 1, '#786858');
      }

      // Gözetleme kulesi
      var tx = xl(G, 0.45), ty = Math.round(ridge(tx)) - 2;
      var tw = sz(G, 0.09), th = sz(G, 0.14);
      u.px(c, tx - Math.floor(tw / 2), ty - th, tw, th + 2, '#9e8e7c');
      u.px(c, tx + Math.floor(tw / 4), ty - th, Math.ceil(tw / 4), th + 2, '#786858');
      u.px(c, tx - Math.floor(tw / 2), ty - th, tw, 1, '#d8ccb8');
      // Kule pencereleri (mazgal)
      u.px(c, tx - 3, ty - Math.round(th * 0.7), 2, 3, '#3c322a');
      u.px(c, tx + 1, ty - Math.round(th * 0.7), 2, 3, '#3c322a');
      // Çift kavisli Çin çatısı
      u.px(c, tx - Math.floor(tw / 2) - 3, ty - th - 3, tw + 6, 3, '#4a423e');
      u.px(c, tx - Math.floor(tw / 2) - 4, ty - th - 4, 2, 2, '#5e544e');
      u.px(c, tx + Math.floor(tw / 2) + 2, ty - th - 4, 2, 2, '#5e544e');
      u.px(c, tx - Math.floor(tw / 2) - 1, ty - th - 6, tw + 2, 3, '#5e544e');
      u.px(c, tx - Math.floor(tw / 2) + 1, ty - th - 7, tw - 2, 1, '#8c7e74');

      // Sağ: kayalık dağ, çamlar ve 5 pişmiş toprak asker
      var rHill = function (x) {
        return g - 10 - Math.round(sz(G, 0.20) * Math.max(0, (x - W * 0.74) / (W * 0.26))) - 3 * Math.cos(x / 13);
      };
      u.profile(c, Math.round(W * 0.68), W, rHill, g + 2, '#5a6268', '#848e96');
      pine(u, c, xr(G, 0.78), Math.round(rHill(xr(G, 0.78))) + 2, sz(G, 0.14), '#345234', '#4e6a4a');
      pine(u, c, xr(G, 0.90), Math.round(rHill(xr(G, 0.90))) + 2, sz(G, 0.18), '#2c462c', '#466242');

      var baseWar = g + 6;
      for (var wi = 0; wi < 5; wi++) {
        var ax = xr(G, 0.08 + wi * 0.16);
        var ay = baseWar + (wi % 2 ? 2 : 0);
        // Pişmiş toprak asker (Terracotta)
        u.px(c, ax - 2, ay - 14, 4, 3, '#a88464'); // baş
        u.px(c, ax - 1, ay - 15, 2, 1, '#7a5c44'); // topuz
        u.px(c, ax - 3, ay - 11, 6, 7, '#8a6a4e'); // zırh gövde
        u.px(c, ax - 3, ay - 11, 2, 7, '#a88464'); // sol vurgu
        u.px(c, ax - 2, ay - 8, 4, 1, '#664c38');  // kemer
        u.px(c, ax - 2, ay - 4, 1, 4, '#664c38');  // sol bacak
        u.px(c, ax + 1, ay - 4, 1, 4, '#664c38');  // sağ bacak
        u.px(c, ax + 3, ay - 18, 1, 18, '#5a4432'); // mızrak
        u.px(c, ax + 3, ay - 20, 1, 2, '#c4ccd4');  // mızrak ucu
      }

      // Zemin
      u.bands(c, ['#7a6a54', '#645644', '#4e4234'], g, H, W, 6);
      for (var s = 0; s < 24; s++) {
        var sx = Math.floor(R() * W), sy = g + 3 + Math.floor(R() * Math.max(4, H - g - 24));
        u.px(c, sx, sy, 2 + Math.floor(R() * 3), 1, R() < 0.5 ? '#8e7e68' : '#42382c');
      }

      return {
        g: g,
        tx: tx,
        smokeY: ty - th - 8,
        clouds: u.makeClouds(u.rng(202), 3, W, H, 0.05, 0.24)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.4, W, ['#9aaec4', '#bccad8', '#dce4ec', '#f0f2f4']);
      // Kulede işaret dumanı
      u.smoke(c, st.tx, st.smokeY, t, '#dcd8d0', 1.1);
      // 3 yavaş kayan yarı saydam sis şeridi
      for (var m = 0; m < 3; m++) {
        var mw = Math.round(W * (0.22 + m * 0.06));
        var mx = Math.round(((t * (2.5 + m) + m * 180) % (W + mw)) - mw);
        var my = Math.round(st.g * (0.62 + m * 0.11));
        u.px(c, mx, my, mw, 2, 'rgba(233,225,207,0.22)');
      }
      // Turnalar
      u.birds(c, t, W, G.H, 3, '#4a5668', 0.22);
    }
  });

  /* ================= 2) ROMA KOLEZYUM (-27 – 199) ================= */
  S.register('roma', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(211);
      u.bands(c, ['#4a78b0', '#9ec4e0', '#f6e6c0'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), Math.round(H * 0.18), 15, ['#f0b868', '#f8d888', '#fff4cc'], g);
      u.profile(c, 0, W, function (x) { return g - 10 - 6 * Math.sin(x / 39 + 0.5) - 3 * Math.sin(x / 15); }, g, '#9c8c78', '#bfb098');

      // Sol: Kolezyum (3 kat kemer + düz üst kat, travertin)
      var cx = xl(G, 0.50), cw = Math.max(44, sz(G, 0.42)), ch = Math.max(28, sz(G, 0.26));
      var x0 = cx - Math.floor(cw / 2), y0 = g - ch + 2;
      u.px(c, x0, y0, cw, ch, '#d8b884');
      u.px(c, x0, y0, Math.round(cw * 0.28), ch, '#ebd0a2'); // sol ışık
      u.px(c, x0 + Math.round(cw * 0.72), y0, Math.ceil(cw * 0.28), ch, '#b08e5c'); // sağ gölge
      // Üst düz kat (attic)
      var tierH = Math.floor(ch / 4);
      for (var t = 0; t < 4; t++) {
        var ty = y0 + t * tierH;
        u.px(c, x0 - 1, ty, cw + 2, 1, '#f4e4c4');
        u.px(c, x0, ty + tierH - 1, cw, 1, '#9c7c4e');
      }
      // 3 kat kemerler
      var cols = Math.max(5, Math.floor(cw / 8));
      var stepX = Math.floor((cw - 6) / cols);
      for (var tier = 1; tier <= 3; tier++) {
        var ay = y0 + tier * tierH + 2;
        for (var k = 0; k < cols; k++) {
          var ax = x0 + 4 + k * stepX;
          arch(u, c, ax, ay, Math.max(3, stepX - 3), Math.max(3, tierH - 3), '#4a3828');
        }
      }
      // Üst kat kare pencereler
      for (var k2 = 0; k2 < cols; k2 += 2) {
        u.px(c, x0 + 5 + k2 * stepX, y0 + 2, 2, 2, '#5a4430');
      }
      // Kaide
      u.px(c, x0 - 2, g, cw + 4, 3, '#a0845a');

      // Sağ: İki katlı su kemeri (Aqueduct) + Titus Takı + selviler
      var aqX0 = xr(G, 0.22), aqX1 = W - 2;
      var aqTop = g - sz(G, 0.24);
      var aqH = g - aqTop + 2;
      u.px(c, aqX0, aqTop, aqX1 - aqX0, aqH, '#d8b884');
      u.px(c, aqX0, aqTop, aqX1 - aqX0, 2, '#f0dcb4');
      u.px(c, aqX0, aqTop + 1, aqX1 - aqX0, 1, '#5898c8'); // su kanalı
      var lowY = aqTop + Math.floor(aqH * 0.46);
      u.px(c, aqX0, lowY - 1, aqX1 - aqX0, 1, '#f0dcb4');
      // Alt büyük kemerler
      for (var ax2 = aqX0 + 3; ax2 < aqX1 - 10; ax2 += 12) {
        arch(u, c, ax2, lowY + 2, 8, g - lowY, '#9ec4e0');
        u.px(c, ax2 + 8, lowY + 2, 2, g - lowY, '#b08e5c');
      }
      // Üst küçük kemerler
      for (var ax3 = aqX0 + 2; ax3 < aqX1 - 6; ax3 += 6) {
        arch(u, c, ax3, aqTop + 4, 4, lowY - aqTop - 6, '#9ec4e0');
      }

      // Titus Takı (önde, solunda)
      var tx = xr(G, 0.08), tw = sz(G, 0.14), th = sz(G, 0.16);
      u.px(c, tx - Math.floor(tw / 2), g - th + 3, tw, th, '#e4cca0');
      u.px(c, tx - Math.floor(tw / 2) - 1, g - th + 3, tw + 2, 2, '#f6e8cc');
      u.px(c, tx - Math.floor(tw / 2), g - th + 8, tw, 1, '#b89868');
      arch(u, c, tx - Math.floor(tw * 0.24), g - Math.round(th * 0.62) + 3, Math.max(4, Math.round(tw * 0.48)), Math.round(th * 0.62), '#644e3a');

      // Selviler
      cypress(u, c, xr(G, 0.34), g + 3, sz(G, 0.14));
      cypress(u, c, xr(G, 0.62), g + 4, sz(G, 0.17));
      cypress(u, c, xr(G, 0.88), g + 2, sz(G, 0.13));

      // Zemin
      u.bands(c, ['#b89c74', '#9a7e58', '#7c6244'], g, H, W, 6);
      for (var s = 0; s < 26; s++) {
        var sx = Math.floor(R() * W), sy = g + 3 + Math.floor(R() * Math.max(4, H - g - 24));
        u.px(c, sx, sy, 4, 1, R() < 0.5 ? '#c8b088' : '#7a6246');
      }

      return {
        g: g,
        aqX0: aqX0,
        aqX1: aqX1,
        aqTop: aqTop,
        clouds: u.makeClouds(u.rng(212), 4, W, H, 0.05, 0.24)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.55, W, ['#c4b8b0', '#e0d4c4', '#f6ead4', '#fff8ec']);
      // Su kemeri üstünde su pırıltısı
      for (var wx = st.aqX0 + 4; wx < st.aqX1 - 4; wx += 14) {
        var glint = (wx + Math.floor(t * 6)) % 14 < 5;
        if (glint) u.px(c, wx, st.aqTop + 1, 3, 1, '#d8f4ff');
      }
      // 4 lejyoner (kırmızı kalkan) yürür + kartal sancağı
      var ly = st.g + 6;
      var step = Math.floor(t * 4) % 2;
      var baseX = Math.round(((t * 14 + 120) % (W + 80)) - 60);
      for (var i = 0; i < 4; i++) {
        var lx = baseX + i * 11;
        u.px(c, lx, ly - 8, 2, 2, '#d8b490');     // baş
        u.px(c, lx - 1, ly - 10, 4, 2, '#b8bec6'); // miğfer
        u.px(c, lx, ly - 11, 2, 1, '#d02828');     // sorguç
        u.px(c, lx - 1, ly - 6, 4, 4, '#b82828');  // kırmızı kalkan
        u.px(c, lx, ly - 5, 2, 2, '#e8c050');      // kalkan göbeği
        u.px(c, lx + (step ? 0 : 1), ly - 2, 1, 2, '#5a3a28'); // bacaklar
        u.px(c, lx + 2 - (step ? 0 : 1), ly - 2, 1, 2, '#5a3a28');
      }
      // Kartal sancağı (en öndeki lejyonerin yanında)
      var sx = baseX + 36, wave = Math.floor(t * 5) % 2;
      u.px(c, sx, ly - 16, 1, 14, '#7a5230');
      u.px(c, sx - 1, ly - 17, 3, 2, '#f0c848'); // kartal
      u.px(c, sx + 1, ly - 14 + wave, 4, 3, '#b82828'); // sancak
    }
  });

  /* ================= 3) MAYA TİKAL (200 – 499) ================= */
  S.register('maya', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(221);
      u.bands(c, ['#2e5a6a', '#6aa8a0', '#e8e0b0'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), Math.round(H * 0.20), 14, ['#d8d498', '#ece8b4', '#faf6d8'], g);
      // Uzak yoğun cangıl tepeleri
      u.profile(c, 0, W, function (x) { return g - 12 - 7 * Math.sin(x / 31) - 4 * Math.sin(x / 11); }, g, '#2e5838', '#487a4a');

      // Sol: Dik, basamaklı Tikal Tapınak I + çatı tarağı
      var tx = xl(G, 0.50), tw = Math.max(36, sz(G, 0.30)), th = Math.max(36, sz(G, 0.34));
      var steps = 8, sh = Math.max(3, Math.floor(th / steps));
      for (var i = 0; i < steps; i++) {
        var w = Math.round(tw * (1 - i * 0.085));
        var sy = g - (i + 1) * sh + 2;
        u.px(c, tx - Math.floor(w / 2), sy, w, sh, '#c8b89a');
        u.px(c, tx + Math.floor(w / 6), sy, Math.ceil(w / 3), sh, '#9c8c70');
        u.px(c, tx - Math.floor(w / 2), sy, w, 1, '#e6dac0');
      }
      // Dik orta merdiven
      var stairW = Math.max(6, Math.round(tw * 0.24));
      var topY = g - steps * sh + 2;
      for (var sy2 = topY; sy2 <= g + 2; sy2 += 2) {
        u.px(c, tx - Math.floor(stairW / 2), sy2, stairW, 1, '#dfd2b8');
        u.px(c, tx - Math.floor(stairW / 2), sy2 + 1, stairW, 1, '#8c7c62');
      }
      // Tapınak odası + çatı tarağı (roof comb)
      var sanW = Math.round(tw * 0.32), sanH = Math.max(6, Math.round(th * 0.18));
      u.px(c, tx - Math.floor(sanW / 2), topY - sanH, sanW, sanH, '#c8b89a');
      u.px(c, tx - 2, topY - sanH + 2, 4, sanH - 2, '#3a3228'); // karanlık kapı
      var combH = Math.max(6, Math.round(th * 0.20));
      u.px(c, tx - Math.floor(sanW * 0.4), topY - sanH - combH, Math.round(sanW * 0.8), combH, '#d8c8aa');
      u.px(c, tx - 2, topY - sanH - combH + 2, 1, combH - 4, '#7a6a52');
      u.px(c, tx + 1, topY - sanH - combH + 2, 1, combH - 4, '#7a6a52');

      // Sağ: Yoğun cangıl tepesi + ikinci alçak piramit + top sahası duvarı
      u.profile(c, Math.round(W * 0.68), W, function (x) {
        return g - 16 - 8 * Math.sin(x / 19 + 1) - 4 * Math.cos(x / 7);
      }, g + 2, '#284e30', '#3a6a3a');

      // Alçak piramit
      var px2 = xr(G, 0.65), pw2 = Math.max(24, sz(G, 0.22)), ph2 = Math.max(18, sz(G, 0.16));
      for (var j = 0; j < 4; j++) {
        var w2 = Math.round(pw2 * (1 - j * 0.18));
        var sy3 = g - (j + 1) * Math.floor(ph2 / 4) + 2;
        u.px(c, px2 - Math.floor(w2 / 2), sy3, w2, Math.floor(ph2 / 4) + 1, '#b8a888');
        u.px(c, px2 + Math.floor(w2 / 6), sy3, Math.ceil(w2 / 3), Math.floor(ph2 / 4) + 1, '#8c7c60');
      }
      // Top sahası duvarları (ballcourt)
      var bx = xr(G, 0.18), bw = sz(G, 0.16);
      u.px(c, bx - bw, g - 8, bw, 10, '#a8987c');
      u.px(c, bx - bw + 2, g - 10, bw - 2, 2, '#c8b89a');
      u.px(c, bx + 4, g - 8, bw, 10, '#8c7c60');
      u.px(c, bx + 4, g - 10, bw - 2, 2, '#b8a88a');

      palm(u, c, xr(G, 0.88), g + 4, sz(G, 0.16), '#5a4430', '#2a5830', '#3e7a42');

      // Zemin
      u.bands(c, ['#6a7a4a', '#4e5e36', '#384626'], g, H, W, 6);
      for (var f = 0; f < 22; f++) {
        var fx = Math.floor(R() * W), fy = g + 2 + Math.floor(R() * Math.max(4, H - g - 24));
        u.px(c, fx, fy, 3, 2, R() < 0.5 ? '#7a8a5a' : '#2e4e2a');
      }

      return {
        g: g,
        tx: tx,
        smokeY: topY - sanH - combH - 2,
        clouds: u.makeClouds(u.rng(222), 3, W, H, 0.05, 0.22)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.45, W, ['#588a84', '#7ea8a0', '#b4d0c4', '#dce6d8']);
      // Tapınakta tütsü dumanı
      u.smoke(c, st.tx, st.smokeY, t, '#e8e4d4', 0.8);
      // Cangılda kayan sis
      for (var m = 0; m < 2; m++) {
        var mw = Math.round(W * 0.22);
        var mx = Math.round(((t * (3 + m) + m * 220) % (W + mw)) - mw);
        u.px(c, mx, st.g - 6 - m * 5, mw, 2, 'rgba(232,224,176,0.22)');
      }
      // Kırmızı ara papağanları
      for (var p = 0; p < 3; p++) {
        var px = Math.round(((t * (16 + p * 3) + p * 140) % (W + 40)) - 20);
        var py = Math.round(G.H * (0.14 + p * 0.07) + Math.sin(t * 2 + p) * 3);
        var flap = Math.floor(t * 7 + p) % 2;
        u.px(c, px, py, 4, 2, '#d82828');
        u.px(c, px - 3, py, 3, 1, '#b82020'); // kuyruk
        u.px(c, px + 1, py - (flap ? 2 : 1), 2, 2, '#e8c030'); // kanat
        u.px(c, px + 4, py, 1, 1, '#f0e8d0'); // gaga
      }
    }
  });

  /* ================= 4) BİZANS AYASOFYA (500 – 749) ================= */
  S.register('ayasofya', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(231);
      u.bands(c, ['#2a2a5a', '#5a3e7a', '#c87a4a', '#f2c060'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), Math.round(H * 0.24), 15, ['#d87a40', '#f2b850', '#ffe898'], g);
      // Uzak tepeler (sur yok)
      u.profile(c, 0, W, function (x) { return g - 10 - 5 * Math.sin(x / 47 + 1) - 3 * Math.sin(x / 17); }, g, '#4a325a', '#6a4876');

      // Sağ arka plan: Haliç su şeridi (kadırga için)
      var waterY = g - 10;
      u.px(c, Math.round(W * 0.64), waterY, Math.round(W * 0.36), 12, '#3a3466');
      u.px(c, Math.round(W * 0.64), waterY, Math.round(W * 0.36), 1, '#9c7898');

      // Sol: Ayasofya (MİNARESİZ! Büyük kubbe, yarım kubbeler, payandalar)
      var ax = xl(G, 0.50), aw = Math.max(48, sz(G, 0.42)), ah = Math.max(24, sz(G, 0.20));
      var base = g + 2;
      // Ana gövde + payandalar
      u.px(c, ax - Math.floor(aw / 2), base - ah, aw, ah, '#c08868');
      u.px(c, ax + Math.floor(aw / 5), base - ah, Math.ceil(aw * 0.3), ah, '#94624c');
      u.px(c, ax - Math.floor(aw / 2), base - ah, aw, 1, '#e6b48c');
      // Payandalar
      for (var b = -2; b <= 2; b++) {
        if (b === 0) continue;
        var bx = ax + b * Math.floor(aw * 0.22);
        u.px(c, bx - 2, base - ah - 2, 4, ah + 2, '#a87458');
        u.px(c, bx - 2, base - ah - 2, 1, ah + 2, '#d8a480');
      }
      // Yan yarım kubbeler
      var sr = Math.max(7, Math.round(aw * 0.22));
      u.halfDisc(c, ax - Math.round(aw * 0.26), base - ah, sr, '#8e7c7a');
      u.halfDisc(c, ax + Math.round(aw * 0.26), base - ah, sr, '#746466');
      // Büyük merkezi kubbe
      var dr = Math.max(11, Math.round(aw * 0.32));
      var drumH = Math.max(5, Math.round(dr * 0.45));
      u.px(c, ax - dr, base - ah - drumH, dr * 2, drumH, '#c89878');
      u.halfDisc(c, ax, base - ah - drumH, dr, '#9c8a86');
      u.halfDisc(c, ax - 2, base - ah - drumH, dr - 2, '#b8a49c');
      // Küçük Bizans haçı (tepeliği)
      u.px(c, ax, base - ah - drumH - dr - 4, 1, 4, '#f2c060');
      u.px(c, ax - 1, base - ah - drumH - dr - 3, 3, 1, '#f2c060');
      // Kemerli pencereler (arch)
      for (var k = -3; k <= 3; k++) {
        arch(u, c, ax + k * 5 - 1, base - ah + 4, 3, 5, '#3a2438');
        if (Math.abs(k) <= 2) arch(u, c, ax + k * 4 - 1, base - ah - drumH + 1, 2, 3, '#f2c060');
      }

      // Sağ: Hipodrom'da Dikilitaş + Yılanlı Sütun
      var ox = xr(G, 0.20), oh = sz(G, 0.24);
      u.px(c, ox - 4, base - 6, 8, 6, '#d8cab4'); // kaide
      u.px(c, ox - 2, base - 6 - oh, 4, oh, '#b86858'); // kırmızı granit gövde
      u.px(c, ox - 2, base - 6 - oh, 1, oh, '#d88874');
      u.poly(c, [[ox - 2, base - 6 - oh], [ox, base - 6 - oh - 4], [ox + 2, base - 6 - oh]], '#f2c060');

      var yx = xr(G, 0.36), yh = sz(G, 0.14);
      for (var yi = 0; yi < yh; yi++) {
        u.px(c, yx + (yi % 3 === 0 ? 1 : 0), base - yi, 2, 1, yi % 2 ? '#4a7a68' : '#2e5044');
      }
      u.px(c, yx - 1, base - yh - 2, 4, 2, '#629880');

      // Zemin
      u.bands(c, ['#9a8876', '#7a6858', '#5c4e42'], g, H, W, 6);
      for (var s = 0; s < 20; s++) {
        var sx = Math.floor(R() * W), sy = g + 3 + Math.floor(R() * Math.max(4, H - g - 24));
        u.px(c, sx, sy, 3, 1, R() < 0.5 ? '#b4a28e' : '#4a3e34');
      }

      return {
        g: g,
        waterY: waterY,
        clouds: u.makeClouds(u.rng(232), 3, W, H, 0.05, 0.22)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.5, W, ['#5a3e7a', '#8c5474', '#c87a4a', '#f2b868']);
      // Haliç'te dromon kadırgası + kürekler
      var gx = Math.round(W * 0.72 + ((t * 6) % (W * 0.24)));
      var gy2 = st.waterY + 4;
      u.px(c, gx, gy2, 20, 3, '#6a422c');
      u.px(c, gx + 20, gy2 + 1, 3, 1, '#d8a840'); // mahmuz
      u.px(c, gx + 9, gy2 - 10, 1, 10, '#4a2e1e'); // direk
      u.poly(c, [[gx + 5, gy2 - 3], [gx + 10, gy2 - 10], [gx + 15, gy2 - 3]], '#e8dcc4'); // latin yelken
      var oar = Math.floor(t * 4) % 2;
      for (var k = 0; k < 5; k++) {
        u.px(c, gx + 3 + k * 3, gy2 + 3, 1, 2 + oar, '#c89e6e');
      }
      // Uzakta 2 quadriga yarışır (Hipodrom pisti boyunca)
      var qy = st.g + 4;
      for (var q = 0; q < 2; q++) {
        var qx = Math.round(W * 0.68 + ((t * (14 + q * 2) + q * 36) % (W * 0.26)));
        u.px(c, qx, qy - 3, 4, 3, q ? '#f2c060' : '#c04040'); // araba
        u.px(c, qx + 4, qy - 3, 5, 2, q ? '#d8cab4' : '#6a4a3a'); // atlar
        u.px(c, qx + 1, qy, 2, 1, '#3a2820'); // tekerlek
      }
      // Martılar
      u.birds(c, t, W, G.H, 4, '#ffe8d0', 0.18);
    }
  });

  /* ================= 5) ABBASİ BAĞDAT (750 – 899) ================= */
  S.register('bagdat', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(241);
      u.bands(c, ['#141a3a', '#2a3466', '#5a4a8a'], 0, g, W, 11);
      // Yıldızlar + seçili 20 kırpışan yıldız
      u.stars(c, R, 55, W, Math.round(g * 0.72), '#e8e4dc');
      var twinkle = [];
      for (var twi = 0; twi < 20; twi++) {
        twinkle.push({ x: Math.floor(R() * W), y: Math.floor(R() * Math.round(g * 0.68)) });
      }
      // Hilal
      var mx = Math.round(W * 0.5), my = Math.round(H * 0.16);
      u.circle(c, mx, my, 10, '#f4e098');
      u.circle(c, mx + 4, my - 2, 9, '#1c244c');

      u.profile(c, 0, W, function (x) { return g - 8 - 4 * Math.sin(x / 41) - 2 * Math.sin(x / 13); }, g, '#1e2446', '#343c68');

      // Sağ arka: Dicle nehri
      var rivY = g - 10;
      u.px(c, Math.round(W * 0.66), rivY, Math.round(W * 0.34), 12, '#1a2a54');
      u.px(c, Math.round(W * 0.66), rivY, Math.round(W * 0.34), 1, '#4a6298');

      // Sol: Yuvarlak şehir surları ve yeşil kubbeli saray
      var bx = xl(G, 0.50), bw = Math.max(46, sz(G, 0.40)), bh = Math.max(20, sz(G, 0.16));
      // Saray + yeşil kubbe (surların arkasında yükselir)
      var pw = Math.round(bw * 0.48), ph = Math.round(bh * 0.8);
      u.px(c, bx - Math.floor(pw / 2), g - bh - ph + 4, pw, ph, '#c89a5a');
      u.px(c, bx + Math.floor(pw / 6), g - bh - ph + 4, Math.ceil(pw / 3), ph, '#987040');
      var dr = Math.max(8, Math.round(pw * 0.38));
      u.halfDisc(c, bx, g - bh - ph + 4, dr, '#2e7a6a');
      u.halfDisc(c, bx - 1, g - bh - ph + 4, dr - 2, '#469a86');
      u.px(c, bx, g - bh - ph + 4 - dr - 3, 1, 3, '#e8c070'); // alem
      // Yuvarlak sur duvarı
      u.px(c, bx - Math.floor(bw / 2), g - bh + 2, bw, bh, '#c89a5a');
      u.px(c, bx + Math.floor(bw / 5), g - bh + 2, Math.ceil(bw * 0.3), bh, '#987040');
      for (var cx = bx - Math.floor(bw / 2); cx < bx + Math.floor(bw / 2); cx += 4) {
        u.px(c, cx, g - bh, 2, 2, '#e8c070');
      }
      // Kemerli şehir kapısı
      arch(u, c, bx - 4, g - Math.round(bh * 0.62) + 2, 8, Math.round(bh * 0.62), '#1e1828');
      // Kandil pencereleri listesi
      var lamps = [];
      for (var li = -2; li <= 2; li++) {
        if (li !== 0) lamps.push({ x: bx + li * 6, y: g - Math.round(bh * 0.55) });
      }
      lamps.push({ x: bx - 4, y: g - bh - Math.round(ph * 0.4) });
      lamps.push({ x: bx + 4, y: g - bh - Math.round(ph * 0.4) });

      // Sağ: Samarra'nın sarmal minaresi (Malviye) + hurmalar
      var sx = xr(G, 0.64), sb = g + 2, sh = sz(G, 0.28), sw = sz(G, 0.14);
      u.px(c, sx - Math.floor(sw / 2) - 2, sb - 5, sw + 4, 5, '#987040'); // kare kaide
      for (var k = 0; k < 6; k++) {
        var lw = Math.max(4, Math.round(sw * (1 - k * 0.14)));
        var tierH = Math.max(3, Math.floor(sh / 6));
        var ly = sb - 5 - (k + 1) * tierH;
        u.px(c, sx - Math.floor(lw / 2), ly, lw, tierH + 1, '#c89a5a');
        u.px(c, sx - Math.floor(lw / 2), ly, lw, 1, '#e8c070'); // sarmal rampa vurgusu
        u.px(c, sx - Math.floor(lw / 2) + (k % 2 ? 1 : lw - 3), ly + 1, 2, tierH - 1, '#7a5630');
      }
      palm(u, c, xr(G, 0.22), g + 4, sz(G, 0.14), '#6a482c', '#1e5240', '#2e7a6a');
      palm(u, c, xr(G, 0.86), g + 3, sz(G, 0.12), '#6a482c', '#1e5240', '#2e7a6a');

      // Zemin
      u.bands(c, ['#8a6a44', '#6c5034', '#4e3824'], g, H, W, 6);

      return {
        g: g,
        rivY: rivY,
        twinkle: twinkle,
        lamps: lamps,
        clouds: u.makeClouds(u.rng(242), 2, W, H, 0.06, 0.20)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.35, W, ['#1e2650', '#2c3668', '#3e487e', '#5a5896']);
      // 20 seçili yıldız 2 kare kırpışır
      var blink = Math.floor(t * 2.5) % 2;
      for (var i = 0; i < st.twinkle.length; i++) {
        var stp = st.twinkle[i];
        u.px(c, stp.x, stp.y, 1, 1, (i + blink) % 2 ? '#fff4dc' : '#3a467a');
      }
      // Pencere kandilleri titreşir
      var f = Math.floor(t * 6);
      for (var j = 0; j < st.lamps.length; j++) {
        var lp = st.lamps[j];
        u.px(c, lp.x, lp.y, 1, 2, (f + j) % 3 === 0 ? '#e88a30' : '#ffe078');
      }
      // Dicle'de yelkenli kayık süzülür
      var bx = Math.round(W * 0.68 + ((t * 5) % (W * 0.24)));
      var by = st.rivY + 4;
      u.px(c, bx, by, 12, 2, '#7a5030');
      u.poly(c, [[bx + 2, by], [bx + 6, by - 9], [bx + 10, by]], '#e8dcc0');
      u.px(c, bx - 2, by + 2, 4, 1, '#5a78b0');
    }
  });

  /* ================= 6) VİKİNG FİYORDU (900 – 1065) ================= */
  S.register('viking', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(251);
      u.bands(c, ['#0e1a2e', '#1e3a5a', '#284a6a'], 0, g, W, 11);
      u.stars(c, R, 45, W, Math.round(g * 0.65), '#c8d8e8');

      // Uzak fiyort kayalıkları (orta alan 0.35W-0.65W alçak ve sakin)
      u.profile(c, 0, W, function (x) {
        var edge = Math.max(0, Math.abs(x - W * 0.5) - W * 0.18) / (W * 0.32);
        return g - 8 - Math.round(edge * edge * sz(G, 0.24)) - 3 * Math.sin(x / 19);
      }, g, '#283646', '#4a5a6e');

      // Sağ fiyort su koyu
      var bayY = g - 10;
      u.px(c, Math.round(W * 0.62), bayY, Math.round(W * 0.38), 12, '#142842');
      u.px(c, Math.round(W * 0.62), bayY, Math.round(W * 0.38), 1, '#5a7a9a');

      // Sol: Fiyort kayalığı + çim çatılı uzun ev (ejder başlı kirişler)
      var hx = xl(G, 0.50), hw = Math.max(36, sz(G, 0.30)), hh = Math.max(14, sz(G, 0.12));
      var base = g + 3;
      u.px(c, hx - Math.floor(hw / 2), base - hh, hw, hh, '#5a4232');
      u.px(c, hx + Math.floor(hw / 6), base - hh, Math.ceil(hw / 3), hh, '#3e2c20');
      // Kapı sıcak ışığı
      u.px(c, hx - 3, base - 7, 5, 7, '#e89a40');
      u.px(c, hx - 2, base - 6, 3, 6, '#ffd278');
      // Çim çatı + kar yaması
      u.poly(c, [[hx - Math.floor(hw / 2) - 3, base - hh], [hx, base - hh - 9], [hx + Math.floor(hw / 2) + 3, base - hh]], '#3a5a42');
      u.poly(c, [[hx - Math.floor(hw / 2), base - hh - 1], [hx, base - hh - 8], [hx + Math.floor(hw / 4), base - hh - 1]], '#5a7e5c');
      // Çatıda ejder başlı kirişler
      u.px(c, hx - 3, base - hh - 12, 2, 4, '#7a5a42');
      u.px(c, hx - 5, base - hh - 13, 2, 2, '#c8d8e8');
      u.px(c, hx + 1, base - hh - 12, 2, 4, '#7a5a42');
      u.px(c, hx + 3, base - hh - 13, 2, 2, '#c8d8e8');

      pine(u, c, xl(G, 0.08), base, sz(G, 0.16), '#1e3634', '#2e4e4a');
      pine(u, c, xl(G, 0.90), base, sz(G, 0.13), '#1e3634', '#2e4e4a');

      // Sağ: Rün taşı (yazısız, geometrik oyma)
      var rx = xr(G, 0.12), rh = sz(G, 0.15);
      u.px(c, rx - 3, base - rh, 7, rh, '#6e7c8a');
      u.px(c, rx - 2, base - rh - 2, 5, 2, '#8a98a6');
      u.px(c, rx, base - rh + 2, 1, rh - 4, '#3a4652');
      u.px(c, rx - 1, base - rh + 4, 3, 1, '#3a4652');
      u.px(c, rx - 1, base - rh + 8, 3, 1, '#3a4652');

      // Zemin
      u.bands(c, ['#5a6672', '#444e58', '#2e363e'], g, H, W, 6);
      for (var sn = 0; sn < 18; sn++) {
        var sx = Math.floor(R() * W), sy = g + 2 + Math.floor(R() * Math.max(4, H - g - 24));
        u.px(c, sx, sy, 4 + Math.floor(R() * 4), 1, '#c8d8e8');
      }

      return {
        g: g,
        bayY: bayY,
        smokeX: hx + 4,
        smokeY: base - hh - 9
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      // Aurora Borealis: sütun adımı 2px, her sütunda TEK fillRect (bütçe dostu)
      var baseAy = Math.round(G.H * 0.16);
      var cols = ['#3ac0a0', '#58d4b0', '#8ae0c0'];
      for (var ax = 0; ax < W; ax += 2) {
        var w1 = Math.sin(ax * 0.025 + t * 0.9) * 10;
        var w2 = Math.sin(ax * 0.055 - t * 0.6) * 5;
        var ay = Math.round(baseAy + w1 + w2);
        var ah = 10 + Math.round(Math.abs(Math.sin(ax * 0.03 + t * 0.5)) * 14);
        var ci = Math.floor((Math.sin(ax * 0.02 + t) + 1) * 1.49);
        c.fillStyle = cols[Math.max(0, Math.min(2, ci))];
        c.fillRect(ax, ay, 2, ah);
      }
      // Ocak dumanı
      u.smoke(c, st.smokeX, st.smokeY, t, '#9aa8b8', 0.8);
      // Ejder başlı drakkar (kırmızı-beyaz çizgili yelken) + kürek ritmi
      var dx = Math.round(W * 0.78 + Math.sin(t * 0.5) * 8);
      var dy = st.bayY + 4 + Math.round(Math.sin(t * 2) * 1);
      u.px(c, dx - 12, dy, 24, 3, '#5a3a28'); // gövde
      u.px(c, dx - 14, dy - 3, 3, 4, '#6a4630'); // ejder başı boyun
      u.px(c, dx - 16, dy - 4, 3, 2, '#c8282f'); // ejder başı
      u.px(c, dx + 12, dy - 3, 2, 4, '#6a4630'); // kıç
      // Direk + kırmızı-beyaz çizgili yelken
      u.px(c, dx, dy - 14, 1, 14, '#3e2c20');
      for (var si = 0; si < 12; si += 2) {
        u.px(c, dx - 6 + si, dy - 13, 2, 10, (si / 2) % 2 ? '#f0ece0' : '#c8282f');
      }
      // Kürek ritmi
      var oar = Math.floor(t * 3) % 2;
      for (var k = -8; k <= 8; k += 4) {
        u.px(c, dx + k, dy + 3, 1, 2 + oar, '#c89e6e');
      }
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
