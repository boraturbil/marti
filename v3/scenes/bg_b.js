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
  // Hızlı yatay şerit + Bayer dither (u.bands ile aynı görsel, ~10x daha hızlı build)
  function fastBands(u, c, keys, y0, y1, W, n) {
    var cols = u.ramp(keys, n || 10), cnt = cols.length, bh = (y1 - y0) / cnt;
    if (bh <= 0) return;
    for (var y = y0; y < y1; y++) {
      var f = (y - y0) / bh, i = Math.min(cnt - 1, Math.floor(f)), fr = f - i;
      c.fillStyle = cols[i];
      c.fillRect(0, y, W, 1);
      if (i < cnt - 1 && fr > 0.55) {
        var thr = (fr - 0.55) / 0.45 * 16;
        var row = u.BAYER[y & 3];
        c.fillStyle = cols[i + 1];
        for (var x = 0; x < W; x++) {
          if (row[x & 3] < thr) c.fillRect(x, y, 1, 1);
        }
      }
    }
  }

  function sunRays(u, c, sx, sy, g, col) {
    for (var r = -2; r <= 2; r++) {
      if (r === 0) continue;
      var x0 = sx + r * 6, x1 = sx + r * 36;
      u.poly(c, [[x0 - 1, sy + 6], [x0 + 2, sy + 6], [x1 + 8, g], [x1 - 8, g]], col);
    }
  }

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

  function cypress(u, c, x, base, h, col, hi) {
    for (var i = 0; i < h; i++) {
      var w = Math.max(1, Math.round(Math.sin(i / h * Math.PI) * Math.max(2, h * 0.14)));
      u.px(c, x - w, base - i, w * 2 + 1, 1, i % 4 ? (col || '#2e4a3a') : (hi || '#3e5e46'));
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

  function bush(u, c, x, y, r, colDark, colLight) {
    u.circle(c, x, y - Math.floor(r * 0.6), r, colDark);
    u.circle(c, x - Math.max(1, Math.floor(r * 0.4)), y - Math.floor(r * 0.8), Math.max(1, Math.floor(r * 0.65)), colLight);
  }

  function rock(u, c, x, y, w, h, colBase, colHi, colSh) {
    u.px(c, x, y - h, w, h, colBase);
    u.px(c, x + 1, y - h - 1, Math.max(1, w - 2), 1, colHi);
    u.px(c, x, y - h, Math.max(1, Math.floor(w * 0.4)), h, colHi);
    u.px(c, x + Math.floor(w * 0.65), y - h, Math.max(1, Math.ceil(w * 0.35)), h, colSh);
  }

  function fence(u, c, x0, x1, y, h, col, hi) {
    var step = Math.max(4, Math.round(h * 0.8));
    u.px(c, x0, y - Math.round(h * 0.7), x1 - x0, 1, hi || col);
    u.px(c, x0, y - Math.round(h * 0.35), x1 - x0, 1, col);
    for (var x = x0; x <= x1; x += step) {
      u.px(c, x, y - h, 1, h, col);
    }
  }

  function stall(u, c, x, y, w, h, colWood, colA1, colA2, colWare) {
    var awH = Math.max(3, Math.round(h * 0.35));
    u.px(c, x, y - h + awH, 1, h - awH, colWood);
    u.px(c, x + w - 1, y - h + awH, 1, h - awH, colWood);
    u.px(c, x + 1, y - Math.round(h * 0.35), w - 2, Math.max(2, Math.round(h * 0.35)), colWood);
    for (var i = 0; i < w; i += 2) {
      u.px(c, x + i, y - h, Math.min(2, w - i), awH, (i >> 1) % 2 ? colA1 : colA2);
    }
    if (colWare) {
      u.px(c, x + 2, y - Math.round(h * 0.35) - 2, 2, 2, colWare);
      if (w > 8) u.px(c, x + w - 5, y - Math.round(h * 0.35) - 2, 2, 2, colWare);
    }
  }

  function person(u, c, x, y, sc, colBody, colHead, step) {
    var bh = Math.max(3, Math.round(5 * sc));
    var bw = Math.max(2, Math.round(3 * sc));
    var hw = Math.max(1, Math.round(2 * sc));
    var lh = Math.max(2, Math.round(3 * sc));
    var off = step ? (step % 2 ? 1 : -1) : 0;
    u.px(c, x - Math.floor(hw / 2), y - lh - bh - hw, hw, hw, colHead);
    u.px(c, x - Math.floor(bw / 2), y - lh - bh, bw, bh, colBody);
    u.px(c, x - Math.floor(bw / 2) + off, y - lh, Math.max(1, Math.floor(bw / 2)), lh, colBody);
    u.px(c, x + (bw > 2 ? 1 : 0) - off, y - lh, Math.max(1, Math.floor(bw / 2)), lh, colBody);
  }

  function cart(u, c, x, y, sc, colWood, colWheel, colCargo, colAnimal, dir) {
    var w = Math.max(8, Math.round(14 * sc));
    var h = Math.max(4, Math.round(6 * sc));
    var wr = Math.max(2, Math.round(3 * sc));
    // Tekerlekler
    u.px(c, x + 1, y - wr * 2, wr * 2, wr * 2, colWheel);
    u.px(c, x + w - wr * 2 - 1, y - wr * 2, wr * 2, wr * 2, colWheel);
    u.px(c, x + 2, y - wr * 2 + 1, Math.max(1, wr * 2 - 2), Math.max(1, wr * 2 - 2), colWood);
    // Kasa + yük
    u.px(c, x, y - wr - h, w, h, colWood);
    u.px(c, x + 2, y - wr - h - Math.max(2, Math.round(3 * sc)), w - 4, Math.max(2, Math.round(3 * sc)), colCargo);
    // Çeken hayvan (öküz/at)
    if (colAnimal) {
      var ax = dir > 0 ? x + w + 2 : x - Math.round(7 * sc) - 2;
      var aw = Math.max(4, Math.round(7 * sc)), ah = Math.max(3, Math.round(4 * sc));
      u.px(c, dir > 0 ? x + w : ax + aw, y - wr - 2, 3, 1, colWood);
      u.px(c, ax, y - ah - 2, aw, ah, colAnimal);
      u.px(c, dir > 0 ? ax + aw - 1 : ax - 1, y - ah - 3, 2, 2, colAnimal);
      u.px(c, ax + 1, y - 2, 1, 2, colAnimal);
      u.px(c, ax + aw - 2, y - 2, 1, 2, colAnimal);
    }
  }

  function brazier(u, c, x, y, colIron, t) {
    u.px(c, x - 2, y - 4, 5, 2, colIron);
    u.px(c, x - 1, y - 2, 3, 2, colIron);
    var fl = Math.floor(t * 7) % 3;
    u.px(c, x - 1, y - 6 - (fl === 1 ? 1 : 0), 3, 2 + (fl === 1 ? 1 : 0), '#e86828');
    u.px(c, x, y - 6, 1, 2, '#ffd868');
  }

  function groundTexture(u, c, R, W, H, g, colLight, colDark, count, slabW) {
    var roadTop = H - 20;
    if (roadTop <= g + 4) return;
    for (var i = 0; i < count; i++) {
      var y = g + 2 + Math.floor(R() * (roadTop - g - 4));
      var f = (y - g) / Math.max(1, roadTop - g);
      var x = Math.floor(R() * W);
      // Orta bölgeyi (0.35W..0.65W) yalnız ufka yakın serpiştir
      if (f > 0.35 && x > W * 0.35 && x < W * 0.65) continue;
      var w = Math.max(1, Math.round((slabW || 3) * (0.5 + f * 1.1)));
      u.px(c, x, y, w, f > 0.6 ? 2 : 1, R() < 0.5 ? colLight : colDark);
    }
  }

  // Zemin şeritleri için x konumu: yalnız sol (%2-33) veya sağ (%67-97)
  function sideX(W, leftSide, frac) {
    return leftSide ? Math.round(W * (0.03 + 0.29 * frac)) : Math.round(W * (0.68 + 0.29 * frac));
  }

  /* ================= 1) ÇİN SEDDİ (-220 – -28) ================= */
  S.register('cin_seddi', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(201);
      fastBands(u, c, ['#58749c', '#98aec6', '#dcd8cc', '#eee4cf'], 0, g, W, 12);
      var sx = Math.round(W * 0.5), sy = Math.round(H * 0.21);
      u.sun(c, sx, sy, 14, ['#d8d2be', '#ebe4d0', '#f7f3e6'], g);
      sunRays(u, c, sx, sy, g, 'rgba(247,243,230,0.08)');

      // Uzak puslu dağlar + ufukta uzak Çin Seddi ve gözetleme kuleleri
      u.profile(c, 0, W, function (x) { return g - 18 - 10 * Math.sin(x / 43) - 5 * Math.sin(x / 17); }, g, '#7e94b0', '#b4c2d2');
      u.profile(c, 0, W, function (x) { return g - 9 - 6 * Math.sin(x / 29 + 1.4) - 3 * Math.sin(x / 11); }, g, '#667a94', '#8ea0b8');
      // Ufuk yerleşim siluetleri (uzak kuleler, sur hattı, pagoda çatıları)
      for (var hx = Math.round(W * 0.36); hx < Math.round(W * 0.66); hx += 18) {
        var hy = g - 7 - Math.round(3 * Math.sin(hx / 29 + 1.4));
        u.px(c, hx, hy - 5, 7, 6, '#7a8ca4');
        u.px(c, hx - 1, hy - 7, 9, 2, '#62748c');
      }

      // Sol: dağ sırtı + kıvrılan Çin Seddi + gözetleme kulesi
      var ridge = function (x) {
        var fade = Math.max(0, Math.min(1, (W * 0.34 - x) / (W * 0.08)));
        return g - Math.round((12 + sz(G, 0.22) * Math.max(0, 1 - Math.abs(x - xl(G, 0.45)) / (W * 0.20)) + 3 * Math.sin(x / 11)) * fade);
      };
      u.profile(c, 0, Math.round(W * 0.34), ridge, g + 2, '#4e6a4a', '#6e8c66');

      var wallX0 = Math.round(W * 0.03), wallX1 = Math.round(W * 0.33);
      for (var wx = wallX0; wx <= wallX1; wx++) {
        var wy = Math.round(ridge(wx)) - 2;
        u.px(c, wx, wy - 8, 1, 10, '#9e8e7c');
        u.px(c, wx, wy - 9, 1, 1, '#d8ccb8');
        if (wx % 4 < 2) u.px(c, wx, wy - 11, 2, 2, '#b4a490');
        u.px(c, wx, wy - 4, 1, 1, '#786858');
      }

      // Gözetleme kulesi
      var tx = xl(G, 0.45), ty = Math.round(ridge(tx)) - 2;
      var tw = sz(G, 0.09), th = sz(G, 0.14);
      u.px(c, tx - Math.floor(tw / 2), ty - th, tw, th + 2, '#9e8e7c');
      u.px(c, tx + Math.floor(tw / 4), ty - th, Math.ceil(tw / 4), th + 2, '#786858');
      u.px(c, tx - Math.floor(tw / 2), ty - th, tw, 1, '#d8ccb8');
      u.px(c, tx - 3, ty - Math.round(th * 0.7), 2, 3, '#3c322a');
      u.px(c, tx + 1, ty - Math.round(th * 0.7), 2, 3, '#3c322a');
      u.px(c, tx - Math.floor(tw / 2) - 3, ty - th - 3, tw + 6, 3, '#4a423e');
      u.px(c, tx - Math.floor(tw / 2) - 4, ty - th - 4, 2, 2, '#5e544e');
      u.px(c, tx + Math.floor(tw / 2) + 2, ty - th - 4, 2, 2, '#5e544e');
      u.px(c, tx - Math.floor(tw / 2) - 1, ty - th - 6, tw + 2, 3, '#5e544e');
      u.px(c, tx - Math.floor(tw / 2) + 1, ty - th - 7, tw - 2, 1, '#8c7e74');

      // Sağ: kayalık dağ ve çamlar
      var rHill = function (x) {
        return g - 10 - Math.round(sz(G, 0.20) * Math.max(0, (x - W * 0.74) / (W * 0.26))) - 3 * Math.cos(x / 13);
      };
      u.profile(c, Math.round(W * 0.68), W, rHill, g + 2, '#5a6268', '#848e96');
      pine(u, c, xr(G, 0.78), Math.round(rHill(xr(G, 0.78))) + 2, sz(G, 0.14), '#345234', '#4e6a4a');
      pine(u, c, xr(G, 0.90), Math.round(rHill(xr(G, 0.90))) + 2, sz(G, 0.18), '#2c462c', '#466242');

      // Zemin (3 şerit perspektif için temel bantlar + doku)
      fastBands(u, c, ['#8a7a64', '#6e5e4a', '#524636'], g, H, W, 6);
      groundTexture(u, c, R, W, H, g, '#9e8e76', '#463c2e', 55, 3);

      // Şerit 1 (Ufka yakın — küçük, soluk)
      for (var t1 = 0; t1 < 3; t1++) {
        var cx1 = Math.round(W * (0.38 + t1 * 0.11));
        u.poly(c, [[cx1 - 5, g + 5], [cx1, g], [cx1 + 5, g + 5]], '#8e887e');
        u.px(c, cx1 - 2, g + 2, 4, 3, '#7a7268');
      }
      bush(u, c, sideX(W, true, 0.2), g + 6, 3, '#5a6a58', '#748470');
      bush(u, c, sideX(W, false, 0.15), g + 6, 3, '#5a6a58', '#748470');
      person(u, c, Math.round(W * 0.44), g + 8, 0.6, '#76706a', '#968e84', 0);
      person(u, c, Math.round(W * 0.57), g + 7, 0.6, '#76706a', '#968e84', 1);

      // Şerit 2 (Orta şerit — sağda büyük ve okunur Pişmiş Toprak Askerler, solda kamp/çit)
      var roadLimit = H - 22;
      var warMidY = Math.min(roadLimit - 14, g + Math.round((roadLimit - g) * 0.42));
      var warFrontY = Math.min(roadLimit - 4, g + Math.round((roadLimit - g) * 0.78));
      function drawTerracotta(ax, ay, sc) {
        var w = Math.round(8 * sc), h = Math.round(22 * sc);
        var hw = Math.floor(w / 2);
        // Kaide
        u.px(c, ax - hw - 1, ay, w + 2, Math.max(2, Math.round(2 * sc)), '#5a4c3e');
        // Bacaklar
        u.px(c, ax - hw + 1, ay - Math.round(h * 0.25), Math.max(2, Math.round(2 * sc)), Math.round(h * 0.25), '#6e523c');
        u.px(c, ax + 1, ay - Math.round(h * 0.25), Math.max(2, Math.round(2 * sc)), Math.round(h * 0.25), '#5c4230');
        // Zırh etek + gövde
        u.px(c, ax - hw, ay - Math.round(h * 0.72), w, Math.round(h * 0.48), '#8e6b4e');
        u.px(c, ax - hw, ay - Math.round(h * 0.72), Math.max(2, Math.floor(w * 0.38)), Math.round(h * 0.48), '#b08b6a');
        // Zırh plakası çizgileri & kemer
        u.px(c, ax - hw, ay - Math.round(h * 0.52), w, Math.max(1, Math.round(1.5 * sc)), '#5c4230');
        u.px(c, ax - hw + 1, ay - Math.round(h * 0.62), w - 2, 1, '#c49e7c');
        // Baş + topuz
        var headR = Math.max(2, Math.round(2.5 * sc));
        u.px(c, ax - headR, ay - h + Math.round(2 * sc), headR * 2, Math.round(4.5 * sc), '#b08b6a');
        u.px(c, ax - 1, ay - h, Math.max(2, Math.round(2.5 * sc)), Math.max(2, Math.round(2 * sc)), '#6e523c');
        // Mızrak
        u.px(c, ax + hw + 1, ay - h - Math.round(6 * sc), 1, h + Math.round(6 * sc), '#4a3626');
        u.px(c, ax + hw + 1, ay - h - Math.round(9 * sc), 2, Math.round(3 * sc), '#d0d8e0');
      }
      // Arka sıra (4 asker)
      for (var wi = 0; wi < 4; wi++) {
        drawTerracotta(sideX(W, false, 0.08 + wi * 0.24), warMidY, 0.85);
      }
      // Ön sıra (3 büyük asker)
      for (var wj = 0; wj < 3; wj++) {
        drawTerracotta(sideX(W, false, 0.16 + wj * 0.29), warFrontY, 1.15);
      }

      // Sol orta: Ahşap çit, silahlık, çanaklar, çalılar
      var midY = Math.min(roadLimit - 12, g + Math.round((roadLimit - g) * 0.45));
      fence(u, c, sideX(W, true, 0.05), sideX(W, true, 0.55), midY, 6, '#5c4634', '#7a604a');
      stall(u, c, sideX(W, true, 0.62), midY + 2, 16, 12, '#5a4430', '#9e382e', '#d8ccb8', '#c49e7c');
      bush(u, c, sideX(W, true, 0.10), midY + 8, 5, '#345234', '#4e6a4a');

      // Şerit 3 (Alt şerit — büyük kaya, çalı, ağaç kökleri)
      var nearY = Math.min(roadLimit - 2, g + Math.round((roadLimit - g) * 0.85));
      rock(u, c, sideX(W, true, 0.06), nearY, 14, 7, '#645c54', '#8e8478', '#423c36');
      bush(u, c, sideX(W, true, 0.25), nearY, 6, '#2c462c', '#466242');
      rock(u, c, sideX(W, false, 0.80), nearY, 12, 6, '#645c54', '#8e8478', '#423c36');

      return {
        g: g, H: H, tx: tx, smokeY: ty - th - 8,
        midY: midY, nearY: nearY,
        brazX: sideX(W, true, 0.48),
        clouds: u.makeClouds(u.rng(202), 4, W, H, 0.05, 0.24)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.4, W, ['#9aaec4', '#bccad8', '#dce4ec', '#f0f2f4']);
      u.smoke(c, st.tx, st.smokeY, t, '#dcd8d0', 1.1);
      // Yavaş kayan sis şeritleri
      for (var m = 0; m < 3; m++) {
        var mw = Math.round(W * (0.20 + m * 0.05));
        var mx = Math.round(((t * (2.5 + m) + m * 180) % (W + mw)) - mw);
        u.px(c, mx, Math.round(st.g * (0.62 + m * 0.11)), mw, 2, 'rgba(233,225,207,0.20)');
      }
      // Sol alt şeritte yavaş ilerleyen öküz arabası (t~2'de solda görünür)
      var cartX = Math.round(((t * 6 + W * 0.12) % (W * 0.32)) - 10);
      cart(u, c, cartX, st.nearY, 1.15, '#6e4e34', '#3c2c20', '#b49e7c', '#7a5a40', 1);
      // Asker/devriye yürüyüşü (sol orta)
      var px = Math.round(W * 0.06 + ((t * 5) % (W * 0.22)));
      person(u, c, px, st.midY + 4, 1.0, '#8a3228', '#d8b490', Math.floor(t * 4) % 2);
      // Ateş/meşale
      brazier(u, c, st.brazX, st.midY + 4, '#3c322a', t);
      u.birds(c, t, W, G.H, 4, '#4a5668', 0.20);
    }
  });

  /* ================= 2) ROMA KOLEZYUM (-27 – 199) ================= */
  S.register('roma', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(211);
      fastBands(u, c, ['#3e6ca6', '#8ab6d8', '#d6e2d4', '#f6e6c0'], 0, g, W, 12);
      var sx = Math.round(W * 0.5), sy = Math.round(H * 0.18);
      u.sun(c, sx, sy, 15, ['#f0b868', '#f8d888', '#fff4cc'], g);
      sunRays(u, c, sx, sy, g, 'rgba(255,244,204,0.08)');
      u.profile(c, 0, W, function (x) { return g - 10 - 6 * Math.sin(x / 39 + 0.5) - 3 * Math.sin(x / 15); }, g, '#9c8c78', '#bfb098');

      // Ufuk şehir silueti: tapınak alınlıkları, bazilika çatıları, uzak kemerler
      for (var hx = Math.round(W * 0.34); hx < Math.round(W * 0.68); hx += 16) {
        var hy = g - 7 - Math.round(3 * Math.sin(hx / 39 + 0.5));
        u.px(c, hx, hy - 5, 10, 6, '#b4a28a');
        if (hx % 32 === 0) {
          u.poly(c, [[hx - 1, hy - 5], [hx + 5, hy - 9], [hx + 11, hy - 5]], '#c8b498');
        }
      }

      // Sol: Kolezyum
      var cx = xl(G, 0.50), cw = Math.max(44, sz(G, 0.42)), ch = Math.max(28, sz(G, 0.26));
      var x0 = cx - Math.floor(cw / 2), y0 = g - ch + 2;
      u.px(c, x0, y0, cw, ch, '#d8b884');
      u.px(c, x0, y0, Math.round(cw * 0.28), ch, '#ebd0a2');
      u.px(c, x0 + Math.round(cw * 0.72), y0, Math.ceil(cw * 0.28), ch, '#b08e5c');
      var tierH = Math.floor(ch / 4);
      for (var t = 0; t < 4; t++) {
        var ty = y0 + t * tierH;
        u.px(c, x0 - 1, ty, cw + 2, 1, '#f4e4c4');
        u.px(c, x0, ty + tierH - 1, cw, 1, '#9c7c4e');
      }
      var cols = Math.max(5, Math.floor(cw / 8));
      var stepX = Math.floor((cw - 6) / cols);
      for (var tier = 1; tier <= 3; tier++) {
        var ay = y0 + tier * tierH + 2;
        for (var k = 0; k < cols; k++) {
          arch(u, c, x0 + 4 + k * stepX, ay, Math.max(3, stepX - 3), Math.max(3, tierH - 3), '#4a3828');
        }
      }
      for (var k2 = 0; k2 < cols; k2 += 2) {
        u.px(c, x0 + 5 + k2 * stepX, y0 + 2, 2, 2, '#5a4430');
      }
      u.px(c, x0 - 2, g, cw + 4, 3, '#a0845a');

      // Sağ: İki katlı su kemeri + Titus Takı + selviler
      var aqX0 = xr(G, 0.22), aqX1 = W - 2;
      var aqTop = g - sz(G, 0.24);
      var aqH = g - aqTop + 2;
      u.px(c, aqX0, aqTop, aqX1 - aqX0, aqH, '#d8b884');
      u.px(c, aqX0, aqTop, aqX1 - aqX0, 2, '#f0dcb4');
      u.px(c, aqX0, aqTop + 1, aqX1 - aqX0, 1, '#5898c8');
      var lowY = aqTop + Math.floor(aqH * 0.46);
      u.px(c, aqX0, lowY - 1, aqX1 - aqX0, 1, '#f0dcb4');
      for (var ax2 = aqX0 + 3; ax2 < aqX1 - 10; ax2 += 12) {
        arch(u, c, ax2, lowY + 2, 8, g - lowY, '#9ec4e0');
        u.px(c, ax2 + 8, lowY + 2, 2, g - lowY, '#b08e5c');
      }
      for (var ax3 = aqX0 + 2; ax3 < aqX1 - 6; ax3 += 6) {
        arch(u, c, ax3, aqTop + 4, 4, lowY - aqTop - 6, '#9ec4e0');
      }

      var tx = xr(G, 0.08), tw = sz(G, 0.14), th = sz(G, 0.16);
      u.px(c, tx - Math.floor(tw / 2), g - th + 3, tw, th, '#e4cca0');
      u.px(c, tx - Math.floor(tw / 2) - 1, g - th + 3, tw + 2, 2, '#f6e8cc');
      u.px(c, tx - Math.floor(tw / 2), g - th + 8, tw, 1, '#b89868');
      arch(u, c, tx - Math.floor(tw * 0.24), g - Math.round(th * 0.62) + 3, Math.max(4, Math.round(tw * 0.48)), Math.round(th * 0.62), '#644e3a');

      cypress(u, c, xr(G, 0.34), g + 3, sz(G, 0.14));
      cypress(u, c, xr(G, 0.62), g + 4, sz(G, 0.17));
      cypress(u, c, xr(G, 0.88), g + 2, sz(G, 0.13));

      // Zemin (Via Appia kaldırım taşları + 3 şerit dolgu)
      fastBands(u, c, ['#bfa47c', '#9e825c', '#7c6244'], g, H, W, 6);
      groundTexture(u, c, R, W, H, g, '#d4bc94', '#6e583e', 65, 4);

      var roadLimit = H - 22;
      var midY = Math.min(roadLimit - 12, g + Math.round((roadLimit - g) * 0.45));
      var nearY = Math.min(roadLimit - 2, g + Math.round((roadLimit - g) * 0.85));

      // Şerit 1 (ufka yakın küçük figürler ve çalılar)
      person(u, c, Math.round(W * 0.42), g + 7, 0.6, '#d8d0c0', '#c8a080', 0);
      person(u, c, Math.round(W * 0.56), g + 8, 0.6, '#a04838', '#c8a080', 1);
      bush(u, c, Math.round(W * 0.38), g + 6, 2, '#5a6e48', '#788e60');

      // Şerit 2 (pazar tezgahları, çit, amforalar, selvi)
      stall(u, c, sideX(W, false, 0.08), midY, 18, 12, '#6a4c32', '#b8322a', '#f0e4cc', '#d88858');
      stall(u, c, sideX(W, false, 0.52), midY + 2, 16, 11, '#6a4c32', '#d8a838', '#f0e4cc', '#c47848');
      fence(u, c, sideX(W, true, 0.05), sideX(W, true, 0.35), midY, 5, '#6a5038', '#8a6c4e');
      // Mermer miltaşı
      var msX = sideX(W, false, 0.40);
      u.px(c, msX - 2, midY - 9, 4, 9, '#dcd0bc');
      u.px(c, msX - 2, midY - 9, 1, 9, '#f4ece0');

      // Şerit 3 (ön plan: çömlek/amfora kümesi, taş çeşme/kaide, çalı)
      rock(u, c, sideX(W, false, 0.78), nearY, 13, 7, '#a89a84', '#d4c6ae', '#766a58');
      u.px(c, sideX(W, false, 0.66), nearY - 5, 3, 5, '#b86842');
      u.px(c, sideX(W, false, 0.70), nearY - 4, 3, 4, '#c8784e');
      bush(u, c, sideX(W, true, 0.08), nearY, 6, '#3a5436', '#56744c');

      return {
        g: g, H: H, aqX0: aqX0, aqX1: aqX1, aqTop: aqTop,
        midY: midY, nearY: nearY,
        brazX: sideX(W, false, 0.34),
        clouds: u.makeClouds(u.rng(212), 4, W, H, 0.05, 0.24)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.55, W, ['#c4b8b0', '#e0d4c4', '#f6ead4', '#fff8ec']);
      for (var wx = st.aqX0 + 4; wx < st.aqX1 - 4; wx += 14) {
        if ((wx + Math.floor(t * 6)) % 14 < 5) u.px(c, wx, st.aqTop + 1, 3, 1, '#d8f4ff');
      }
      // 4 lejyoner (solda yürüyüşte, t~2'de net görünür)
      var ly = st.g + 12;
      var step = Math.floor(t * 4) % 2;
      var baseX = Math.round(W * 0.04 + ((t * 8) % (W * 0.22)));
      for (var i = 0; i < 4; i++) {
        var lx = baseX + i * 10;
        u.px(c, lx, ly - 8, 2, 2, '#d8b490');
        u.px(c, lx - 1, ly - 10, 4, 2, '#b8bec6');
        u.px(c, lx, ly - 11, 2, 1, '#d02828');
        u.px(c, lx - 1, ly - 6, 4, 4, '#b82828');
        u.px(c, lx, ly - 5, 2, 2, '#e8c050');
        u.px(c, lx + (step ? 0 : 1), ly - 2, 1, 2, '#5a3a28');
        u.px(c, lx + 2 - (step ? 0 : 1), ly - 2, 1, 2, '#5a3a28');
      }
      var sx = baseX + 36, wave = Math.floor(t * 5) % 2;
      u.px(c, sx, ly - 16, 1, 14, '#7a5230');
      u.px(c, sx - 1, ly - 17, 3, 2, '#f0c848');
      u.px(c, sx + 1, ly - 14 + wave, 4, 3, '#b82828');

      // Ön şeritte Roma at arabası (solda geçer, t~2 görünür)
      var cx2 = Math.round(((t * 7 + W * 0.14) % (W * 0.30)));
      cart(u, c, cx2, st.nearY, 1.15, '#8a623c', '#4a3220', '#e6d4b4', '#a87c54', 1);
      // Sağda yürüyen Romalı vatandaş
      person(u, c, Math.round(W * 0.72 + ((t * 4) % (W * 0.18))), st.midY + 8, 1.05, '#e8e0d0', '#c8a080', step);
      brazier(u, c, st.brazX, st.midY + 5, '#4a3c32', t);
      u.birds(c, t, W, G.H, 3, '#6e5a48', 0.18);
    }
  });

  /* ================= 3) MAYA TİKAL (200 – 499) ================= */
  S.register('maya', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(221);
      fastBands(u, c, ['#285262', '#5c9c96', '#b8cfb0', '#e8e0b0'], 0, g, W, 12);
      var sx = Math.round(W * 0.5), sy = Math.round(H * 0.20);
      u.sun(c, sx, sy, 14, ['#d8d498', '#ece8b4', '#faf6d8'], g);
      sunRays(u, c, sx, sy, g, 'rgba(250,246,216,0.08)');
      // Uzak cangıl tepeleri + ufukta uzak tapınak tarakları
      u.profile(c, 0, W, function (x) { return g - 12 - 7 * Math.sin(x / 31) - 4 * Math.sin(x / 11); }, g, '#2e5838', '#487a4a');
      var mTemples = [0.37, 0.46, 0.58];
      for (var mti = 0; mti < mTemples.length; mti++) {
        var hx = Math.round(W * mTemples[mti]);
        var hy = g - 12 - Math.round(4 * Math.sin(hx / 31));
        var mh = 5 + (mti % 2) * 3;
        u.px(c, hx, hy - mh, 7 + (mti % 2) * 2, mh, '#588266');
        u.px(c, hx + 2, hy - mh - 3, 3, 3, '#6e987a');
      }

      // Sol: Dik, basamaklı Tikal Tapınak I + çatı tarağı
      var tx = xl(G, 0.50), tw = Math.max(36, sz(G, 0.30)), th = Math.max(36, sz(G, 0.34));
      var steps = 8, sh = Math.max(3, Math.floor(th / steps));
      for (var i = 0; i < steps; i++) {
        var w = Math.round(tw * (1 - i * 0.085));
        var sy2 = g - (i + 1) * sh + 2;
        u.px(c, tx - Math.floor(w / 2), sy2, w, sh, '#c8b89a');
        u.px(c, tx + Math.floor(w / 6), sy2, Math.ceil(w / 3), sh, '#9c8c70');
        u.px(c, tx - Math.floor(w / 2), sy2, w, 1, '#e6dac0');
      }
      var stairW = Math.max(6, Math.round(tw * 0.24));
      var topY = g - steps * sh + 2;
      for (var sy3 = topY; sy3 <= g + 2; sy3 += 2) {
        u.px(c, tx - Math.floor(stairW / 2), sy3, stairW, 1, '#dfd2b8');
        u.px(c, tx - Math.floor(stairW / 2), sy3 + 1, stairW, 1, '#8c7c62');
      }
      var sanW = Math.round(tw * 0.32), sanH = Math.max(6, Math.round(th * 0.18));
      u.px(c, tx - Math.floor(sanW / 2), topY - sanH, sanW, sanH, '#c8b89a');
      u.px(c, tx - 2, topY - sanH + 2, 4, sanH - 2, '#3a3228');
      var combH = Math.max(6, Math.round(th * 0.20));
      u.px(c, tx - Math.floor(sanW * 0.4), topY - sanH - combH, Math.round(sanW * 0.8), combH, '#d8c8aa');
      u.px(c, tx - 2, topY - sanH - combH + 2, 1, combH - 4, '#7a6a52');
      u.px(c, tx + 1, topY - sanH - combH + 2, 1, combH - 4, '#7a6a52');

      // Sağ: Cangıl tepesi + ikinci piramit + top sahası + palmiye
      u.profile(c, Math.round(W * 0.68), W, function (x) {
        return g - 16 - 8 * Math.sin(x / 19 + 1) - 4 * Math.cos(x / 7);
      }, g + 2, '#284e30', '#3a6a3a');
      var px2 = xr(G, 0.65), pw2 = Math.max(24, sz(G, 0.22)), ph2 = Math.max(18, sz(G, 0.16));
      for (var j = 0; j < 4; j++) {
        var w2 = Math.round(pw2 * (1 - j * 0.18));
        var sy4 = g - (j + 1) * Math.floor(ph2 / 4) + 2;
        u.px(c, px2 - Math.floor(w2 / 2), sy4, w2, Math.floor(ph2 / 4) + 1, '#b8a888');
        u.px(c, px2 + Math.floor(w2 / 6), sy4, Math.ceil(w2 / 3), Math.floor(ph2 / 4) + 1, '#8c7c60');
      }
      var bx = xr(G, 0.18), bw = sz(G, 0.16);
      u.px(c, bx - bw, g - 8, bw, 10, '#a8987c');
      u.px(c, bx - bw + 2, g - 10, bw - 2, 2, '#c8b89a');
      u.px(c, bx + 4, g - 8, bw, 10, '#8c7c60');
      u.px(c, bx + 4, g - 10, bw - 2, 2, '#b8a88a');
      palm(u, c, xr(G, 0.88), g + 4, sz(G, 0.16), '#5a4430', '#2a5830', '#3e7a42');

      // Zemin (Kireçtaşı meydan plakaları + cangıl çimi + 3 şerit)
      fastBands(u, c, ['#6e7e4c', '#526238', '#384626'], g, H, W, 6);
      groundTexture(u, c, R, W, H, g, '#889668', '#2a3c20', 60, 3);

      var roadLimit = H - 22;
      var midY = Math.min(roadLimit - 12, g + Math.round((roadLimit - g) * 0.45));
      var nearY = Math.min(roadLimit - 2, g + Math.round((roadLimit - g) * 0.85));

      // Şerit 1: Uzak saz kulübe (na) + küçük taşıyıcılar
      var hutX = Math.round(W * 0.40);
      u.px(c, hutX, g + 2, 8, 5, '#b8a888');
      u.poly(c, [[hutX - 1, g + 2], [hutX + 4, g - 3], [hutX + 9, g + 2]], '#8e7850');
      person(u, c, Math.round(W * 0.56), g + 7, 0.6, '#b8946e', '#7a583c', 0);

      // Şerit 2: Oyma stel taşı + sunak, pazar tentesi, çalı/eğrelti
      var stX = sideX(W, true, 0.72);
      u.px(c, stX - 2, midY - 12, 5, 12, '#c8b89a');
      u.px(c, stX - 1, midY - 10, 3, 2, '#8c7c60');
      u.px(c, stX - 1, midY - 6, 3, 2, '#8c7c60');
      stall(u, c, sideX(W, false, 0.12), midY + 2, 16, 11, '#5a422c', '#d8b878', '#3a7a5a', '#c85838');
      fence(u, c, sideX(W, false, 0.55), sideX(W, false, 0.90), midY + 2, 5, '#5a4430', '#7a6044');
      bush(u, c, sideX(W, true, 0.15), midY + 2, 5, '#264e2a', '#3e783e');

      // Şerit 3: Büyük cangıl bitkileri, çömlekler, yosunlu taşlar
      bush(u, c, sideX(W, true, 0.08), nearY, 7, '#1e4222', '#366838');
      bush(u, c, sideX(W, false, 0.82), nearY, 6, '#1e4222', '#366838');
      rock(u, c, sideX(W, true, 0.28), nearY, 10, 5, '#9a8e78', '#beb29a', '#6a604e');
      u.px(c, sideX(W, false, 0.66), nearY - 4, 3, 4, '#b86838');
      u.px(c, sideX(W, false, 0.71), nearY - 3, 3, 3, '#c88048');

      return {
        g: g, H: H, tx: tx, smokeY: topY - sanH - combH - 2,
        midY: midY, nearY: nearY,
        brazX: sideX(W, true, 0.50),
        clouds: u.makeClouds(u.rng(222), 4, W, H, 0.05, 0.22)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.45, W, ['#588a84', '#7ea8a0', '#b4d0c4', '#dce6d8']);
      u.smoke(c, st.tx, st.smokeY, t, '#e8e4d4', 0.8);
      for (var m = 0; m < 2; m++) {
        var mw = Math.round(W * 0.22);
        var mx = Math.round(((t * (3 + m) + m * 220) % (W + mw)) - mw);
        u.px(c, mx, st.g - 6 - m * 5, mw, 2, 'rgba(232,224,176,0.22)');
      }
      // Yürüyen Maya hamal / köylü (sağda ve solda)
      var step = Math.floor(t * 4) % 2;
      person(u, c, Math.round(W * 0.05 + ((t * 5) % (W * 0.24))), st.nearY - 2, 1.1, '#d8d0b8', '#a07250', step);
      person(u, c, Math.round(W * 0.68 + ((t * 4) % (W * 0.22))), st.midY + 6, 0.95, '#3a7a6a', '#a07250', 1 - step);
      brazier(u, c, st.brazX, st.midY + 4, '#4a3a2a', t);
      // Kırmızı ara papağanları
      for (var p = 0; p < 3; p++) {
        var px = Math.round(((t * (16 + p * 3) + p * 140) % (W + 40)) - 20);
        var py = Math.round(G.H * (0.14 + p * 0.07) + Math.sin(t * 2 + p) * 3);
        var flap = Math.floor(t * 7 + p) % 2;
        u.px(c, px, py, 4, 2, '#d82828');
        u.px(c, px - 3, py, 3, 1, '#b82020');
        u.px(c, px + 1, py - (flap ? 2 : 1), 2, 2, '#e8c030');
        u.px(c, px + 4, py, 1, 1, '#f0e8d0');
      }
    }
  });

  /* ================= 4) BİZANS AYASOFYA (500 – 749) ================= */
  S.register('ayasofya', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(231);
      fastBands(u, c, ['#282858', '#5a3e7a', '#c87a4a', '#f2c060'], 0, g, W, 12);
      var sx = Math.round(W * 0.5), sy = Math.round(H * 0.22);
      u.sun(c, sx, sy, 15, ['#d87a40', '#f2b850', '#ffe898'], g);
      sunRays(u, c, sx, sy, g, 'rgba(255,232,152,0.08)');
      u.profile(c, 0, W, function (x) { return g - 10 - 5 * Math.sin(x / 47 + 1) - 3 * Math.sin(x / 17); }, g, '#4a325a', '#6a4876');

      // Ufuk şehir silueti: Konstantinopolis çatıları, uzak su kemeri
      for (var hx = Math.round(W * 0.34); hx < Math.round(W * 0.65); hx += 14) {
        var hy = g - 7 - Math.round(2 * Math.sin(hx / 47 + 1));
        u.px(c, hx, hy - 5, 9, 6, '#5c3c68');
        u.px(c, hx + 1, hy - 7, 7, 2, '#784e76');
      }

      // Sağ arka plan: Haliç su şeridi (kadırga için daha geniş ve okunur)
      var waterY = g - 13;
      u.px(c, Math.round(W * 0.62), waterY, Math.round(W * 0.38), 16, '#343062');
      u.px(c, Math.round(W * 0.62), waterY, Math.round(W * 0.38), 1, '#a884a4');

      // Sol: Ayasofya (MİNARESİZ! Belirgin kubbe, yarım kubbeler ve payandalar)
      var ax = xl(G, 0.50), aw = Math.max(54, sz(G, 0.45)), ah = Math.max(26, sz(G, 0.21));
      var base = g + 2;
      // Ana gövde
      u.px(c, ax - Math.floor(aw / 2), base - ah, aw, ah, '#c48a68');
      u.px(c, ax + Math.floor(aw / 5), base - ah, Math.ceil(aw * 0.3), ah, '#94624c');
      u.px(c, ax - Math.floor(aw / 2), base - ah, aw, 1, '#f0be96');
      // Belirgin basamaklı payandalar (buttresses)
      var butt = [-0.46, -0.25, 0.25, 0.46];
      for (var b = 0; b < butt.length; b++) {
        var bx = ax + Math.round(aw * butt[b]);
        u.px(c, bx - 3, base - ah - 4, 6, ah + 4, '#a66e52');
        u.px(c, bx - 3, base - ah - 4, 2, ah + 4, '#e0ac84');
        u.px(c, bx - 4, base - Math.round(ah * 0.55), 8, Math.round(ah * 0.55), '#8c5a42');
        u.px(c, bx - 4, base - Math.round(ah * 0.55), 2, Math.round(ah * 0.55), '#d09c76');
      }
      // Belirgin yan yarım kubbeler + eksedralar
      var sr = Math.max(9, Math.round(aw * 0.23));
      u.halfDisc(c, ax - Math.round(aw * 0.26), base - ah, sr, '#8e7c82');
      u.halfDisc(c, ax - Math.round(aw * 0.26) - 1, base - ah, Math.max(3, sr - 2), '#b09ea2');
      u.halfDisc(c, ax + Math.round(aw * 0.26), base - ah, sr, '#6e5e64');
      u.halfDisc(c, ax + Math.round(aw * 0.26) - 1, base - ah, Math.max(3, sr - 2), '#8c7c80');
      // Büyük merkezi kubbe + kasnak
      var dr = Math.max(13, Math.round(aw * 0.33));
      var drumH = Math.max(6, Math.round(dr * 0.44));
      u.px(c, ax - dr, base - ah - drumH, dr * 2, drumH, '#c89878');
      u.px(c, ax + Math.floor(dr * 0.3), base - ah - drumH, Math.ceil(dr * 0.7), drumH, '#946850');
      u.halfDisc(c, ax, base - ah - drumH, dr, '#7e6e74');
      u.halfDisc(c, ax - 2, base - ah - drumH, dr - 2, '#a89698');
      u.halfDisc(c, ax - 4, base - ah - drumH, Math.max(4, dr - 5), '#c8b6b4');
      // Bizans haçı
      u.px(c, ax, base - ah - drumH - dr - 5, 1, 5, '#f2c060');
      u.px(c, ax - 2, base - ah - drumH - dr - 3, 5, 1, '#f2c060');
      // Kemerli pencereler
      for (var k = -3; k <= 3; k++) {
        arch(u, c, ax + k * 6 - 1, base - ah + 5, 3, 6, '#3a2438');
        if (Math.abs(k) <= 2) arch(u, c, ax + k * 5 - 1, base - ah - drumH + 1, 2, 4, '#f2c060');
      }

      // Sağ: BÜYÜTÜLMÜŞ Dikilitaş + BÜYÜTÜLMÜŞ Yılanlı Sütun
      var ox = xr(G, 0.14), oh = sz(G, 0.32);
      u.px(c, ox - 6, base - 8, 12, 8, '#dcd0bc');
      u.px(c, ox - 5, base - 10, 10, 2, '#f0e6d4');
      u.px(c, ox - 3, base - 10 - oh, 6, oh, '#b86452');
      u.px(c, ox - 3, base - 10 - oh, 2, oh, '#de8874');
      u.poly(c, [[ox - 3, base - 10 - oh], [ox, base - 10 - oh - 6], [ox + 3, base - 10 - oh]], '#f2c060');

      var yx = xr(G, 0.36), yh = sz(G, 0.21);
      u.px(c, yx - 4, base - 4, 8, 4, '#b8aa96');
      for (var yi = 0; yi < yh; yi++) {
        var twist = Math.round(Math.sin(yi * 0.6) * 1.5);
        u.px(c, yx - 2 + twist, base - 4 - yi, 5, 1, yi % 2 ? '#4a7a68' : '#2e5044');
      }
      u.px(c, yx - 4, base - 4 - yh - 3, 3, 3, '#629880');
      u.px(c, yx - 1, base - 4 - yh - 4, 3, 3, '#4a7a68');
      u.px(c, yx + 2, base - 4 - yh - 3, 3, 3, '#629880');

      // Zemin (Hipodrom & Mese taş döşeme + 3 şerit)
      fastBands(u, c, ['#9e8c7a', '#7c6a5a', '#5c4e42'], g, H, W, 6);
      groundTexture(u, c, R, W, H, g, '#b6a490', '#4a3e34', 60, 4);

      var roadLimit = H - 22;
      var midY = Math.min(roadLimit - 12, g + Math.round((roadLimit - g) * 0.45));
      var nearY = Math.min(roadLimit - 2, g + Math.round((roadLimit - g) * 0.85));

      // Şerit 1
      person(u, c, Math.round(W * 0.42), g + 7, 0.6, '#d8c8b0', '#c89878', 0);
      person(u, c, Math.round(W * 0.56), g + 8, 0.6, '#7a4868', '#c89878', 1);

      // Şerit 2: Bizans pazar tentesi, spina mermer bariyeri (derzli), selviler
      stall(u, c, sideX(W, true, 0.08), midY, 18, 12, '#5e4434', '#8e3250', '#e8d098', '#d8a858');
      var spX = sideX(W, false, 0.05), spW = Math.round(W * 0.24);
      u.px(c, spX, midY - 4, spW, 4, '#c4b49c');
      u.px(c, spX, midY - 4, spW, 1, '#e6dac4');
      for (var sj = spX + 6; sj < spX + spW; sj += 8) u.px(c, sj, midY - 4, 1, 4, '#8c7e6c');
      cypress(u, c, sideX(W, true, 0.88), midY + 2, 16, '#2a3e34', '#3e5648');

      // Şerit 3: Mermer çeşme/kuyu, amforalar, çalı
      var wlX = sideX(W, true, 0.65);
      u.px(c, wlX - 5, nearY - 8, 10, 8, '#c8baa4');
      u.px(c, wlX - 6, nearY - 9, 12, 2, '#e6dac4');
      u.px(c, sideX(W, false, 0.72), nearY - 5, 3, 5, '#b86848');
      u.px(c, sideX(W, false, 0.77), nearY - 4, 3, 4, '#c87c54');
      bush(u, c, sideX(W, false, 0.86), nearY, 5, '#344638', '#4e624c');

      return {
        g: g, H: H, waterY: waterY, midY: midY, nearY: nearY,
        brazX: sideX(W, true, 0.44),
        clouds: u.makeClouds(u.rng(232), 4, W, H, 0.05, 0.22)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.5, W, ['#5a3e7a', '#8c5474', '#c87a4a', '#f2b868']);
      // BÜYÜTÜLMÜŞ Haliç Dromon kadırgası
      var gx = Math.round(W * 0.66 + ((t * 5) % (W * 0.22)));
      var gy2 = st.waterY + 6;
      u.px(c, gx, gy2, 30, 4, '#6a422c');
      u.px(c, gx + 30, gy2 + 1, 5, 2, '#e8b848'); // mahmuz
      u.px(c, gx - 3, gy2 - 2, 4, 3, '#7a4e34'); // kıç
      u.px(c, gx + 14, gy2 - 14, 1, 14, '#4a2e1e');
      u.poly(c, [[gx + 6, gy2 - 3], [gx + 15, gy2 - 14], [gx + 24, gy2 - 3]], '#f0e4cc');
      var oar = Math.floor(t * 4) % 2;
      for (var k = 0; k < 7; k++) {
        u.px(c, gx + 4 + k * 4, gy2 + 4, 1, 2 + oar, '#d8aa74');
      }
      // Hipodrom quadriga yarışı (sağda t~2 görünür)
      var qy = st.g + 8;
      for (var q = 0; q < 2; q++) {
        var qx = Math.round(W * 0.68 + ((t * (10 + q * 2) + q * 32) % (W * 0.24)));
        u.px(c, qx, qy - 4, 6, 4, q ? '#f2c060' : '#c04040');
        u.px(c, qx + 6, qy - 4, 6, 3, q ? '#d8cab4' : '#6a4a3a');
        u.px(c, qx + 2, qy, 2, 2, '#3a2820');
      }
      // Yürüyen Bizanslılar
      var step = Math.floor(t * 4) % 2;
      person(u, c, Math.round(W * 0.06 + ((t * 5) % (W * 0.22))), st.nearY - 1, 1.1, '#7a2848', '#d8b490', step);
      brazier(u, c, st.brazX, st.midY + 4, '#3a2e28', t);
      u.birds(c, t, W, G.H, 4, '#ffe8d0', 0.18);
    }
  });

  /* ================= 5) ABBASİ BAĞDAT (750 – 899) ================= */
  S.register('bagdat', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(241);
      fastBands(u, c, ['#121836', '#263060', '#4c427c', '#6a5288'], 0, g, W, 12);
      u.stars(c, R, 55, W, Math.round(g * 0.72), '#e8e4dc');
      var twinkle = [];
      for (var twi = 0; twi < 20; twi++) {
        twinkle.push({ x: Math.floor(R() * W), y: Math.floor(R() * Math.round(g * 0.68)) });
      }
      var mx = Math.round(W * 0.5), my = Math.round(H * 0.16);
      u.circle(c, mx, my, 10, '#f4e098');
      u.circle(c, mx + 4, my - 2, 9, '#1c244c');

      u.profile(c, 0, W, function (x) { return g - 8 - 4 * Math.sin(x / 41) - 2 * Math.sin(x / 13); }, g, '#1e2446', '#343c68');
      // Ufuk şehir silueti: kerpiç evler, kubbeler, rüzgar kuleleri
      for (var hx = Math.round(W * 0.34); hx < Math.round(W * 0.66); hx += 15) {
        var hy = g - 7 - Math.round(2 * Math.sin(hx / 41));
        u.px(c, hx, hy - 5, 10, 6, '#2a3058');
        if (hx % 30 === 0) u.halfDisc(c, hx + 5, hy - 5, 3, '#384070');
      }

      // Sağ arka: Dicle nehri
      var rivY = g - 10;
      u.px(c, Math.round(W * 0.64), rivY, Math.round(W * 0.36), 13, '#1a2a54');
      u.px(c, Math.round(W * 0.64), rivY, Math.round(W * 0.36), 1, '#4a6298');

      // Sol: Yuvarlak şehir surları ve yeşil kubbeli saray
      var bx = xl(G, 0.50), bw = Math.max(46, sz(G, 0.40)), bh = Math.max(20, sz(G, 0.16));
      var pw = Math.round(bw * 0.48), ph = Math.round(bh * 0.8);
      u.px(c, bx - Math.floor(pw / 2), g - bh - ph + 4, pw, ph, '#c89a5a');
      u.px(c, bx + Math.floor(pw / 6), g - bh - ph + 4, Math.ceil(pw / 3), ph, '#987040');
      var dr = Math.max(8, Math.round(pw * 0.38));
      u.halfDisc(c, bx, g - bh - ph + 4, dr, '#2e7a6a');
      u.halfDisc(c, bx - 1, g - bh - ph + 4, dr - 2, '#469a86');
      u.px(c, bx, g - bh - ph + 4 - dr - 3, 1, 3, '#e8c070');
      u.px(c, bx - Math.floor(bw / 2), g - bh + 2, bw, bh, '#c89a5a');
      u.px(c, bx + Math.floor(bw / 5), g - bh + 2, Math.ceil(bw * 0.3), bh, '#987040');
      for (var cx = bx - Math.floor(bw / 2); cx < bx + Math.floor(bw / 2); cx += 4) {
        u.px(c, cx, g - bh, 2, 2, '#e8c070');
      }
      arch(u, c, bx - 4, g - Math.round(bh * 0.62) + 2, 8, Math.round(bh * 0.62), '#1e1828');
      var lamps = [];
      for (var li = -2; li <= 2; li++) {
        if (li !== 0) lamps.push({ x: bx + li * 6, y: g - Math.round(bh * 0.55) });
      }
      lamps.push({ x: bx - 4, y: g - bh - Math.round(ph * 0.4) });
      lamps.push({ x: bx + 4, y: g - bh - Math.round(ph * 0.4) });

      // Sağ: Samarra Malviye + hurmalar
      var sx = xr(G, 0.64), sb = g + 2, sh = sz(G, 0.28), sw = sz(G, 0.14);
      u.px(c, sx - Math.floor(sw / 2) - 2, sb - 5, sw + 4, 5, '#987040');
      for (var k = 0; k < 6; k++) {
        var lw = Math.max(4, Math.round(sw * (1 - k * 0.14)));
        var tierH = Math.max(3, Math.floor(sh / 6));
        var ly = sb - 5 - (k + 1) * tierH;
        u.px(c, sx - Math.floor(lw / 2), ly, lw, tierH + 1, '#c89a5a');
        u.px(c, sx - Math.floor(lw / 2), ly, lw, 1, '#e8c070');
        u.px(c, sx - Math.floor(lw / 2) + (k % 2 ? 1 : lw - 3), ly + 1, 2, tierH - 1, '#7a5630');
      }
      palm(u, c, xr(G, 0.22), g + 4, sz(G, 0.14), '#6a482c', '#1e5240', '#2e7a6a');
      palm(u, c, xr(G, 0.86), g + 3, sz(G, 0.12), '#6a482c', '#1e5240', '#2e7a6a');

      // Zemin (Kum dalgaları, avlu taşları, 3 şerit)
      fastBands(u, c, ['#8e6e48', '#6e5234', '#4e3824'], g, H, W, 6);
      groundTexture(u, c, R, W, H, g, '#a48258', '#3e2c1c', 60, 4);

      var roadLimit = H - 22;
      var midY = Math.min(roadLimit - 12, g + Math.round((roadLimit - g) * 0.45));
      var nearY = Math.min(roadLimit - 2, g + Math.round((roadLimit - g) * 0.85));

      // Şerit 1: Uzak çadırlar ve küçük hurma siluetleri
      var tX = Math.round(W * 0.40);
      u.poly(c, [[tX - 6, g + 5], [tX, g], [tX + 6, g + 5]], '#5e4632');
      u.px(c, tX + 8, g + 1, 7, 4, '#6a503a');

      // Şerit 2: Halı/baharat tezgahları, kerpiç duvar/çit, dinlenen deve
      stall(u, c, sideX(W, true, 0.08), midY, 18, 12, '#5a3e28', '#982838', '#e8c070', '#d89a48');
      stall(u, c, sideX(W, false, 0.12), midY + 2, 16, 11, '#5a3e28', '#2e7a6a', '#e8c070', '#c87838');
      fence(u, c, sideX(W, true, 0.62), sideX(W, true, 0.92), midY + 2, 5, '#7a5a3c', '#98724e');
      // Dinlenen deve (sağ orta)
      var cmX = sideX(W, false, 0.66), cmY = midY + 4;
      u.px(c, cmX, cmY - 5, 9, 5, '#b88c54');
      u.px(c, cmX + 2, cmY - 8, 4, 3, '#c89c62');
      u.px(c, cmX + 9, cmY - 9, 2, 6, '#b88c54');
      u.px(c, cmX + 10, cmY - 10, 3, 2, '#c89c62');

      // Şerit 3: Ön plan halı/sandık, bakır ibrikler, kumtaşı kayalar, çöl çalısı
      rock(u, c, sideX(W, true, 0.06), nearY, 12, 6, '#7a5a3c', '#9e7a54', '#4e3824');
      u.px(c, sideX(W, true, 0.25), nearY - 4, 7, 4, '#8a2838'); // serili halı/sandık
      u.px(c, sideX(W, true, 0.26), nearY - 3, 5, 2, '#e8c070');
      u.px(c, sideX(W, false, 0.78), nearY - 5, 3, 5, '#d89a40'); // bakır testi
      bush(u, c, sideX(W, false, 0.88), nearY, 5, '#284a36', '#3a664c');

      return {
        g: g, H: H, rivY: rivY, twinkle: twinkle, lamps: lamps,
        midY: midY, nearY: nearY,
        brazX: sideX(W, true, 0.50),
        clouds: u.makeClouds(u.rng(242), 3, W, H, 0.06, 0.20)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      u.drawClouds(c, st.clouds, t * 0.35, W, ['#1e2650', '#2c3668', '#3e487e', '#5a5896']);
      var blink = Math.floor(t * 2.5) % 2;
      for (var i = 0; i < st.twinkle.length; i++) {
        var stp = st.twinkle[i];
        u.px(c, stp.x, stp.y, 1, 1, (i + blink) % 2 ? '#fff4dc' : '#3a467a');
      }
      var f = Math.floor(t * 6);
      for (var j = 0; j < st.lamps.length; j++) {
        var lp = st.lamps[j];
        u.px(c, lp.x, lp.y, 1, 2, (f + j) % 3 === 0 ? '#e88a30' : '#ffe078');
      }
      // Dicle'de yelkenli kayık
      var bx = Math.round(W * 0.68 + ((t * 5) % (W * 0.22)));
      var by = st.rivY + 5;
      u.px(c, bx, by, 14, 2, '#7a5030');
      u.poly(c, [[bx + 2, by], [bx + 7, by - 10], [bx + 12, by]], '#e8dcc0');
      u.px(c, bx - 2, by + 2, 4, 1, '#5a78b0');

      // Uzak kervan silueti (ufukta yavaş yürür, t~2'de ortada görünür)
      var kx = Math.round(W * 0.38 + ((t * 3) % (W * 0.24)));
      for (var ci = 0; ci < 3; ci++) {
        var cx = kx + ci * 10;
        u.px(c, cx, st.g + 3, 5, 3, '#4e3c30');
        u.px(c, cx + 5, st.g + 1, 1, 3, '#4e3c30');
        u.px(c, cx + 1, st.g + 6, 1, 2, '#3a2c22');
        u.px(c, cx + 4, st.g + 6, 1, 2, '#3a2c22');
      }
      // Ön şeritte yürüyen alim/tüccar
      var step = Math.floor(t * 4) % 2;
      person(u, c, Math.round(W * 0.68 + ((t * 4) % (W * 0.20))), st.nearY - 1, 1.1, '#d8d0c4', '#f4e4c4', step);
      brazier(u, c, st.brazX, st.midY + 4, '#4a3828', t);
    }
  });

  /* ================= 6) VİKİNG FİYORDU (900 – 1065) ================= */
  S.register('viking', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(251);
      fastBands(u, c, ['#0c182c', '#183252', '#264868', '#345a78'], 0, g, W, 12);
      u.stars(c, R, 48, W, Math.round(g * 0.65), '#c8d8e8');

      // Uzak fiyort kayalıkları (orta sakin, kenarlar dik fiyort duvarı)
      u.profile(c, 0, W, function (x) {
        var edge = Math.max(0, Math.abs(x - W * 0.5) - W * 0.16) / (W * 0.34);
        return g - 8 - Math.round(edge * edge * sz(G, 0.26)) - 3 * Math.sin(x / 19);
      }, g, '#283646', '#4a5a6e');

      // Ufuk çam hattı (doğal, değişken yükseklikte)
      for (var hx = Math.round(W * 0.35); hx < Math.round(W * 0.61); hx += 6 + Math.floor(R() * 5)) {
        pine(u, c, hx, g - 3, 5 + Math.floor(R() * 5), '#182c2c', '#26403c');
      }

      // Sağda GENİŞ fiyort su koyu (doğal eğimli kıyı çizgisi)
      var bayY = g - 12;
      var roadLimit = H - 22;
      var bayBot = Math.min(roadLimit - 4, g + Math.round((roadLimit - g) * 0.68));
      function bayLeft(y) {
        var f = Math.max(0, (y - g) / Math.max(1, bayBot - g));
        return Math.round(W * (0.60 + 0.08 * f + 0.02 * Math.sin(y * 0.25)));
      }
      u.px(c, Math.round(W * 0.60), bayY, Math.round(W * 0.40), g - bayY, '#142842');
      u.px(c, Math.round(W * 0.60), bayY, Math.round(W * 0.40), 1, '#6a8aa8');

      // Sol: Detaylandırılmış Uzun Ev (Longhouse) + kalkanlar + ahşap dikmeler
      var hx = xl(G, 0.50), hw = Math.max(44, sz(G, 0.36)), hh = Math.max(16, sz(G, 0.14));
      var base = g + 4;
      // Taş temel
      u.px(c, hx - Math.floor(hw / 2) - 1, base - 3, hw + 2, 3, '#586470');
      // Ahşap duvar + dikey kalaslar
      u.px(c, hx - Math.floor(hw / 2), base - hh, hw, hh - 3, '#5a4232');
      u.px(c, hx + Math.floor(hw / 6), base - hh, Math.ceil(hw / 3), hh - 3, '#3e2c20');
      for (var px = hx - Math.floor(hw / 2) + 3; px < hx + Math.floor(hw / 2); px += 4) {
        u.px(c, px, base - hh + 2, 1, hh - 5, '#463224');
      }
      // Duvara asılı Viking kalkanları
      for (var sh = -2; sh <= 2; sh++) {
        if (sh === 0) continue;
        var sx = hx + sh * Math.round(hw * 0.16);
        u.circle(c, sx, base - Math.round(hh * 0.6), 2, sh % 2 ? '#c8282f' : '#e8c050');
      }
      // Sıcak kapı + küçük ışıklı pencere
      u.px(c, hx - 3, base - 8, 6, 8, '#e89a40');
      u.px(c, hx - 2, base - 7, 4, 7, '#ffd278');
      u.px(c, hx - Math.round(hw * 0.30), base - Math.round(hh * 0.65), 3, 3, '#ffd278');
      // Çim çatı + kar yamaları
      u.poly(c, [[hx - Math.floor(hw / 2) - 4, base - hh], [hx, base - hh - 11], [hx + Math.floor(hw / 2) + 4, base - hh]], '#36563e');
      u.poly(c, [[hx - Math.floor(hw / 2) - 1, base - hh - 1], [hx, base - hh - 10], [hx + Math.floor(hw / 4), base - hh - 1]], '#587c5a');
      u.poly(c, [[hx - Math.floor(hw / 3), base - hh - 3], [hx - 2, base - hh - 9], [hx + 4, base - hh - 3]], '#d0dce8'); // kar
      // Ejder başlı kirişler
      u.px(c, hx - 4, base - hh - 14, 2, 4, '#7a5a42');
      u.px(c, hx - 6, base - hh - 15, 2, 2, '#c8d8e8');
      u.px(c, hx + 2, base - hh - 14, 2, 4, '#7a5a42');
      u.px(c, hx + 4, base - hh - 15, 2, 2, '#c8d8e8');

      pine(u, c, xl(G, 0.06), base, sz(G, 0.18), '#1a3230', '#2a4a46');
      pine(u, c, xl(G, 0.92), base, sz(G, 0.15), '#1a3230', '#2a4a46');

      // Zemin (sol taraf & alt şerit kaya/kar/çimen)
      fastBands(u, c, ['#56626e', '#404a54', '#2c343c'], g, H, W, 6);
      // Eğimli fiyort koyu + kıyı köpüğü + kayalık adacıklar
      for (var by = g; by < bayBot; by++) {
        var bx0 = bayLeft(by);
        u.px(c, bx0, by, W - bx0, 1, by > bayBot - 3 ? '#3b5878' : '#142842');
        u.px(c, bx0, by, 2, 1, '#7a96b2');
      }
      rock(u, c, xr(G, 0.78), g + 14, 15, 7, '#2c3a48', '#4e5e6e', '#1c2632');
      rock(u, c, xr(G, 0.28), bayBot - 4, 11, 5, '#2c3a48', '#4e5e6e', '#1c2632');
      // Ahşap iskele (kıyıdan suya uzanır)
      var pierX = bayLeft(bayBot - 8) - 2, pierY = bayBot - 8;
      u.px(c, pierX, pierY, 22, 2, '#6a4c34');
      for (var pk = 0; pk < 20; pk += 5) u.px(c, pierX + pk, pierY + 2, 2, 5, '#463222');

      groundTexture(u, c, R, W, H, g, '#c8d8e8', '#343e48', 45, 4);

      // Kıyıda Rün taşı (suyun hemen solunda)
      var rx = Math.round(W * 0.62), rh = sz(G, 0.16);
      var rBase = bayBot + 4;
      u.px(c, rx - 4, rBase - rh, 8, rh, '#6e7c8a');
      u.px(c, rx - 3, rBase - rh - 2, 6, 2, '#8a98a6');
      u.px(c, rx, rBase - rh + 2, 1, rh - 4, '#3a4652');
      u.px(c, rx - 2, rBase - rh + 5, 4, 1, '#3a4652');
      u.px(c, rx - 2, rBase - rh + 9, 4, 1, '#3a4652');

      var midY = Math.min(roadLimit - 12, g + Math.round((roadLimit - g) * 0.45));
      var nearY = Math.min(roadLimit - 2, g + Math.round((roadLimit - g) * 0.85));

      // Şerit 2 (solda çit, odun yığını, kurutma askısı, fıçılar)
      fence(u, c, sideX(W, true, 0.05), sideX(W, true, 0.42), midY, 5, '#5a4232', '#7a5c44');
      u.px(c, sideX(W, true, 0.48), midY - 4, 8, 4, '#6a482c'); // odun yığını
      u.px(c, sideX(W, true, 0.62), midY - 5, 4, 5, '#7a5234'); // fıçı

      // Şerit 3 (alt şerit — karlı kayalar, fıçı/halat, çalı)
      rock(u, c, sideX(W, true, 0.06), nearY, 15, 7, '#5a6672', '#c8d8e8', '#343e48');
      rock(u, c, sideX(W, false, 0.80), nearY, 13, 6, '#5a6672', '#c8d8e8', '#343e48');
      u.px(c, sideX(W, false, 0.66), nearY - 5, 5, 5, '#6e4c30');

      // Demirlenmiş ikinci küçük drakkar (iskele yanında)
      var mx = Math.round(W * 0.68), my = bayBot - 8;
      u.px(c, mx, my, 16, 2, '#5a3a28');
      u.px(c, mx - 1, my - 2, 2, 3, '#6a4630');
      u.px(c, mx + 15, my - 2, 2, 3, '#6a4630');
      u.px(c, mx + 7, my - 8, 1, 8, '#3e2c20');

      return {
        g: g, H: H, bayY: bayY, bayBot: bayBot,
        smokeX: hx + 4, smokeY: base - hh - 10,
        midY: midY, nearY: nearY,
        brazX: sideX(W, true, 0.78),
        clouds: u.makeClouds(u.rng(252), 3, W, H, 0.06, 0.22)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      // Aurora Borealis
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
      u.drawClouds(c, st.clouds, t * 0.35, W, ['#1a2e4a', '#284264', '#385a80', '#54789c']);
      u.smoke(c, st.smokeX, st.smokeY, t, '#9aa8b8', 0.8);

      // Fiyort sisi (su üstünde yavaş kayar)
      for (var m = 0; m < 2; m++) {
        var mw = Math.round(W * 0.24);
        var mx = Math.round(W * 0.58 + ((t * (3 + m) + m * 60) % (W * 0.38)));
        u.px(c, mx, st.bayY + 6 + m * 10, mw, 2, 'rgba(200,216,232,0.20)');
      }

      // Ana Ejder başlı drakkar (büyük, kırmızı-beyaz yelken + kalkanlar + kürekler)
      var dx = Math.round(W * 0.80 + Math.sin(t * 0.6) * 10);
      var dy = st.bayY + 12 + Math.round(Math.sin(t * 2) * 1);
      u.px(c, dx - 14, dy, 28, 3, '#5a3a28');
      u.px(c, dx - 16, dy - 4, 3, 5, '#6a4630');
      u.px(c, dx - 18, dy - 5, 3, 2, '#c8282f');
      u.px(c, dx + 14, dy - 4, 2, 5, '#6a4630');
      u.px(c, dx, dy - 16, 1, 16, '#3e2c20');
      for (var si = 0; si < 14; si += 2) {
        u.px(c, dx - 7 + si, dy - 15, 2, 11, (si / 2) % 2 ? '#f0ece0' : '#c8282f');
      }
      var oar = Math.floor(t * 3) % 2;
      for (var k = -10; k <= 10; k += 4) {
        u.px(c, dx + k, dy + 3, 1, 2 + oar, '#c89e6e');
      }

      // Sol ön şeritte yürüyen Viking + ateş
      var step = Math.floor(t * 4) % 2;
      person(u, c, Math.round(W * 0.08 + ((t * 4) % (W * 0.20))), st.nearY - 1, 1.1, '#7a4a34', '#d8b490', step);
      brazier(u, c, st.brazX, st.midY + 4, '#3a424c', t);
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
