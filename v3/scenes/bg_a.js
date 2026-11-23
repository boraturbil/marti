/* PUSULLA — arkaplan paketi A (scenes/bg_a.js). Sahneler: gobeklitepe, ur_ziggurat, hattusa, truva, babil, atina.
 * META gobeklitepe {"min":-99999,"max":-3501,"label":"GÖBEKLİTEPE","road":["#9a7a58","#b89670","#6a5038"]}
 * META ur_ziggurat {"min":-3500,"max":-2601,"label":"SÜMER UR","road":["#b48a5a","#d2aa78","#7e5e3a"]}
 * META hattusa {"min":-1600,"max":-1201,"label":"HİTİT HATTUŞA","road":["#a08866","#c0a882","#6e5c44"]}
 * META truva {"min":-1200,"max":-801,"label":"TRUVA","road":["#a8906c","#c8b08a","#76603e"]}
 * META babil {"min":-800,"max":-501,"label":"BABİL","road":["#b89a64","#d8ba84","#84683e"]}
 * META atina {"min":-500,"max":-331,"label":"ATİNA AKROPOLİS","road":["#d8d0c0","#f0ead8","#a09886"]}
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
  function stoneBlock(u, c, x, y, w, h, baseCol, hiCol, shCol, R) {
    u.px(c, x, y, w, h, baseCol);
    if (w > 2 && h > 1) {
      u.px(c, x, y, w, 1, hiCol);
      u.px(c, x, y, 1, h, hiCol);
      u.px(c, x, y + h - 1, w, 1, shCol);
      u.px(c, x + w - 1, y, 1, h, shCol);
    }
    if (R && w > 3 && h > 2 && R() < 0.45) {
      u.px(c, x + 1 + Math.floor(R() * (w - 2)), y + 1 + Math.floor(R() * (h - 2)), 1, 1, R() < 0.5 ? shCol : hiCol);
    }
  }

  function stoneWall(u, c, x0, y0, w, h, bw, bh, cols, R) {
    var row = 0;
    for (var y = y0; y < y0 + h; y += bh) {
      var ch = Math.min(bh, y0 + h - y);
      var off = (row % 2) ? Math.floor(bw / 2) : 0;
      for (var x = x0 - off; x < x0 + w; x += bw) {
        var bx = Math.max(x0, x);
        var bx2 = Math.min(x0 + w, x + bw);
        if (bx2 > bx) {
          var tone = cols[row % 2 === 0 ? 0 : 1];
          stoneBlock(u, c, bx, y, bx2 - bx, ch, tone, cols[2], cols[3], R);
        }
      }
      row++;
    }
  }

  function palmTree(u, c, x, base, h, sway) {
    var i, tx = x + Math.round(Math.sin(1.4) * 3), ty = base - h;
    for (i = 0; i < h; i++) {
      u.px(c, x + Math.round(Math.sin(i / h * 1.4) * 3), base - i, 2, 1, i % 3 ? '#7a5038' : '#5a3a2a');
    }
    var dirs = [[-1, -0.2], [-1, 0.5], [1, -0.2], [1, 0.5], [-0.4, -1], [0.4, -1]];
    for (var d = 0; d < dirs.length; d++) {
      for (var k = 0; k < 8; k++) {
        var sx = sway && k > 4 ? sway : 0;
        u.px(c, tx + Math.round(dirs[d][0] * k) + sx, ty + Math.round(dirs[d][1] * k + (k * k) * 0.06), 2, 1, k % 2 ? '#4d8848' : '#316236');
      }
    }
  }

  function oliveTree(u, c, x, base, h, R) {
    var tw = Math.max(2, Math.round(h * 0.16));
    u.px(c, x - 1, base - Math.round(h * 0.55), tw, Math.round(h * 0.55), '#6a543c');
    u.px(c, x - 1, base - Math.round(h * 0.55), 1, Math.round(h * 0.55), '#8c7256');
    var r = Math.max(4, Math.round(h * 0.42));
    var cy = base - Math.round(h * 0.72);
    u.circle(c, x, cy, r, '#556530');
    u.circle(c, x - Math.round(r * 0.45), cy + 1, Math.round(r * 0.7), '#6d7d3f');
    u.circle(c, x + Math.round(r * 0.4), cy - 1, Math.round(r * 0.65), '#85964f');
    if (R) {
      for (var i = 0; i < 6; i++) {
        u.px(c, x - r + Math.floor(R() * r * 2), cy - r + Math.floor(R() * r * 1.5), 1, 1, '#a9b878');
      }
    }
  }

  function cypressTree(u, c, x, base, h) {
    for (var i = 0; i < h; i++) {
      var w = Math.max(1, Math.round(Math.sin(i / h * Math.PI) * Math.max(2, h * 0.14)));
      u.px(c, x - w, base - i, w * 2 + 1, 1, i % 4 ? '#2e4a3a' : '#3e5e46');
    }
  }

  function bush(u, c, x, y, sc, darkCol, midCol, hiCol) {
    var r = Math.max(2, Math.round(3 * sc));
    u.circle(c, x, y - r + 1, r, darkCol);
    u.circle(c, x - Math.max(1, Math.round(r * 0.5)), y - r + 1, Math.max(1, Math.round(r * 0.7)), midCol);
    u.px(c, x - 1, y - r * 2 + 2, Math.max(2, r), 1, hiCol);
  }

  function grassTuft(u, c, x, y, sc, col1, col2) {
    var h = Math.max(2, Math.round(3 * sc));
    u.px(c, x, y - h, 1, h, col1);
    u.px(c, x - 1, y - h + 1, 1, Math.max(1, h - 1), col2);
    u.px(c, x + 2, y - h + 1, 1, Math.max(1, h - 1), col1);
  }

  function rockProp(u, c, x, y, sc, baseCol, hiCol, shCol) {
    var w = Math.max(3, Math.round(5 * sc));
    var h = Math.max(2, Math.round(3 * sc));
    u.px(c, x - Math.floor(w / 2), y - h, w, h, baseCol);
    u.px(c, x - Math.floor(w / 2) + 1, y - h - 1, Math.max(1, w - 2), 1, hiCol);
    u.px(c, x - Math.floor(w / 2), y - 1, w, 1, shCol);
  }

  function marketStall(u, c, x, y, sc, woodCol, roof1, roof2, goodsCol) {
    var w = Math.max(10, Math.round(14 * sc));
    var h = Math.max(7, Math.round(10 * sc));
    var x0 = x - Math.floor(w / 2);
    u.px(c, x0 + 1, y - h, 1, h, woodCol);
    u.px(c, x0 + w - 2, y - h, 1, h, woodCol);
    u.px(c, x0 + 1, y - Math.round(h * 0.4), w - 2, Math.round(h * 0.4), woodCol);
    for (var i = 0; i < w; i += 2) {
      u.px(c, x0 + i, y - h - 2, 2, 3, (i % 4 === 0) ? roof1 : roof2);
    }
    u.px(c, x0 + 3, y - Math.round(h * 0.4) - 2, Math.max(2, Math.round(3 * sc)), 2, goodsCol);
    u.px(c, x0 + w - 6, y - Math.round(h * 0.4) - 2, Math.max(2, Math.round(3 * sc)), 2, roof2);
  }

  function amphora(u, c, x, y, sc, col, hiCol) {
    var h = Math.max(3, Math.round(4 * sc));
    var w = Math.max(2, Math.round(2.5 * sc));
    u.px(c, x - Math.floor(w / 2), y - h + 1, w, h - 1, col);
    u.px(c, x, y - h, 1, 1, hiCol);
    u.px(c, x - Math.floor(w / 2), y - h + 2, 1, Math.max(1, h - 3), hiCol);
  }

  function fenceSeg(u, c, x, y, len, sc, col, hiCol) {
    var h = Math.max(3, Math.round(4 * sc));
    var step = Math.max(3, Math.round(4 * sc));
    for (var fx = x; fx < x + len; fx += step) {
      u.px(c, fx, y - h, 1, h, col);
      u.px(c, fx, y - h, 1, 1, hiCol);
    }
    u.px(c, x, y - Math.round(h * 0.65), len, 1, hiCol);
  }

  function tentProp(u, c, x, y, sc, col, hiCol, shCol) {
    var w = Math.max(6, Math.round(10 * sc));
    var h = Math.max(4, Math.round(7 * sc));
    var hw = Math.floor(w / 2);
    u.poly(c, [[x - hw, y], [x, y - h], [x + hw, y]], col);
    u.poly(c, [[x, y - h], [x + hw, y], [x + 1, y]], shCol);
    u.px(c, x - 1, y - Math.round(h * 0.55), 2, Math.round(h * 0.55), '#261c18');
    u.px(c, x, y - h - 1, 1, 2, hiCol);
  }

  function wellProp(u, c, x, y, sc, stoneCol, hiCol, shCol, woodCol) {
    var w = Math.max(6, Math.round(8 * sc));
    var h = Math.max(3, Math.round(4 * sc));
    var x0 = x - Math.floor(w / 2);
    u.px(c, x0, y - h, w, h, stoneCol);
    u.px(c, x0, y - h, w, 1, hiCol);
    u.px(c, x0, y - 1, w, 1, shCol);
    u.px(c, x0 + 1, y - h - Math.round(3 * sc), 1, Math.round(3 * sc), woodCol);
    u.px(c, x0 + w - 2, y - h - Math.round(3 * sc), 1, Math.round(3 * sc), woodCol);
    u.px(c, x0, y - h - Math.round(3 * sc), w, 1, hiCol);
  }

  function moundProp(u, c, x, y, sc, baseCol, hiCol, shCol) {
    var w = Math.max(6, Math.round(10 * sc));
    var h = Math.max(3, Math.round(4 * sc));
    var hw = Math.floor(w / 2);
    u.px(c, x - hw, y - 1, w, 1, shCol);
    u.px(c, x - hw + 1, y - h + 1, w - 2, h - 1, baseCol);
    u.px(c, x - Math.floor(hw * 0.5), y - h, Math.max(2, hw), 1, hiCol);
  }

  function fieldRows(u, c, x, y, w, rows, sc, soilCol, cropCol) {
    var stepY = Math.max(2, Math.round(2.5 * sc));
    for (var r = 0; r < rows; r++) {
      var ry = y + r * stepY;
      u.px(c, x + r, ry, w, 1, soilCol);
      for (var cx = x + r + 1; cx < x + r + w - 1; cx += Math.max(2, Math.round(2 * sc))) {
        u.px(c, cx, ry - Math.max(1, Math.round(1.5 * sc)), 1, Math.max(1, Math.round(1.5 * sc)), cropCol);
      }
    }
  }

  function crateStack(u, c, x, y, sc, woodCol, hiCol, shCol, potCol) {
    var s = Math.max(3, Math.round(4 * sc));
    u.px(c, x - s, y - s, s, s, woodCol);
    u.px(c, x - s, y - s, s, 1, hiCol);
    u.px(c, x, y - s, s, s, shCol);
    u.px(c, x + 1, y - s + 1, Math.max(1, s - 2), 1, woodCol);
    u.px(c, x - Math.floor(s * 0.5), y - s * 2 + 1, s, s - 1, woodCol);
    u.px(c, x - Math.floor(s * 0.5), y - s * 2 + 1, s, 1, hiCol);
    if (potCol) {
      amphora(u, c, x + s + Math.max(2, Math.round(2 * sc)), y, sc * 0.85, potCol, hiCol);
    }
  }

  function steleProp(u, c, x, y, sc, col, hiCol, shCol) {
    var w = Math.max(2, Math.round(3 * sc));
    var h = Math.max(5, Math.round(8 * sc));
    u.px(c, x - Math.floor(w / 2), y - h, w, h, col);
    u.px(c, x - Math.floor(w / 2), y - h, 1, h, hiCol);
    u.px(c, x + Math.floor(w / 2), y - h + 1, 1, h - 1, shCol);
  }

  function flame(u, c, x, y, ph, s) {
    s = s || 1;
    var h = (ph === 1 ? 5 : (ph === 2 ? 3 : 4)) * s;
    u.px(c, x - s, y - h, 2 * s + 1, h, '#e86830');
    u.px(c, x, y - h + s, s, Math.max(1, h - s), '#ffcf60');
    if (ph !== 2) u.px(c, x + (ph ? -1 : 1), y - h - 1, 1, 1, '#fff4b8');
  }

  function skyRays(u, c, sx, sy, g, col, R) {
    var dirs = [-0.85, -0.45, 0.45, 0.85];
    for (var d = 0; d < dirs.length; d++) {
      var dx = dirs[d];
      for (var k = 16; k < 56; k += 2) {
        var rx = Math.round(sx + dx * k);
        var ry = Math.round(sy + k * 0.35);
        if (ry < g - 4 && (!R || R() < 0.7)) {
          u.px(c, rx, ry, 2, 1, col);
        }
      }
    }
  }

  function horizonSettlement(u, c, W, g, R, farCol, nearCol, hiCol, type) {
    var x, h, w;
    // Uzak siluet katmanı (yoğun ama soluk)
    for (x = 2; x < W - 4; x += 6 + Math.floor(R() * 6)) {
      if (x > W * 0.36 && x < W * 0.64 && R() < 0.45) continue;
      h = 3 + Math.floor(R() * 5);
      w = 4 + Math.floor(R() * 6);
      if (type === 'tents') {
        u.poly(c, [[x, g], [x + Math.floor(w / 2), g - h], [x + w, g]], farCol);
      } else {
        u.px(c, x, g - h, w, h, farCol);
        if (R() < 0.45) u.px(c, x + 1, g - h - 2, Math.max(2, w - 2), 2, farCol);
      }
    }
    // Yakın ufuk katmanı (sağ ve sol kanatlar daha yoğun)
    for (x = 2; x < W - 6; x += 8 + Math.floor(R() * 7)) {
      if (x > W * 0.35 && x < W * 0.65) continue;
      h = 4 + Math.floor(R() * 6);
      w = 5 + Math.floor(R() * 7);
      if (type === 'tents') {
        u.poly(c, [[x, g + 1], [x + Math.floor(w / 2), g - h], [x + w, g + 1]], nearCol);
        u.px(c, x + Math.floor(w / 2), g - h - 1, 1, 2, hiCol);
      } else if (type === 'greek') {
        u.px(c, x, g - h, w, h + 1, nearCol);
        u.px(c, x - 1, g - h - 1, w + 2, 2, hiCol);
      } else {
        u.px(c, x, g - h, w, h + 1, nearCol);
        u.px(c, x, g - h, w, 1, hiCol);
        if (R() < 0.5) u.px(c, x + 2, g - h + 2, 1, 2, farCol);
      }
    }
  }

  /* 3 şeritli perspektif zemin dokusu (orta bant sakin, kenarlar zengin ve okunur) */
  function groundTexture(u, c, W, H, g, R, pal) {
    var gh = Math.max(20, H - g - 10);
    // Şerit 1 (ufka yakın: küçük ama bol, soluk izler)
    for (var i = 0; i < 42; i++) {
      var x1 = Math.floor(R() * W);
      var y1 = g + 2 + Math.floor(R() * gh * 0.24);
      u.px(c, x1, y1, 2 + Math.floor(R() * 3), 1, pal.far);
    }
    // Şerit 2 ve 3 (kenar %0-35 ve %65-100: okunur toprak çizgileri ve lekeler)
    for (var j = 0; j < 76; j++) {
      var side = R() < 0.5 ? R() * 0.35 : (0.65 + R() * 0.35);
      var x2 = Math.floor(side * W);
      var frac = 0.25 + R() * 0.68;
      var y2 = g + Math.floor(frac * gh);
      var len = Math.max(3, Math.round(3 + frac * 7));
      var col = R() < 0.52 ? pal.midHi : pal.midSh;
      u.px(c, x2, y2, len, 1, col);
      if (frac > 0.55 && R() < 0.5) {
        u.px(c, x2 + 1, y2 + 1, Math.max(2, len - 2), 1, pal.foreSh);
      }
    }
    // Orta bantta seyrek yumuşak doku çizgisi
    for (var m = 0; m < 10; m++) {
      var xm = Math.floor((0.37 + R() * 0.26) * W);
      var ym = g + Math.floor((0.20 + R() * 0.65) * gh);
      u.px(c, xm, ym, 4, 1, pal.far);
    }
  }

  /* Hareketli sprite yardımcıları (yalnız t ve st kullanır, deterministik) */
  function drawPerson(u, c, x, y, sc, bodyCol, headCol, walkPh, carry) {
    var h = Math.max(4, Math.round(6 * sc));
    var w = Math.max(2, Math.round(2 * sc));
    u.px(c, x, y - h - 2, w, 2, headCol);
    u.px(c, x, y - h, w, Math.max(2, h - 2), bodyCol);
    u.px(c, x + (walkPh ? 1 : 0), y - 2, 1, 2, bodyCol);
    u.px(c, x + (walkPh ? 0 : 1), y - 2, 1, 2, headCol);
    if (carry === 'spear') {
      u.px(c, x + w, y - h - 3, 1, h + 2, headCol);
    }
  }

  function drawCart(u, c, x, y, sc, woodCol, wheelCol, animalCol, wf) {
    var cw = Math.max(6, Math.round(8 * sc));
    var ch = Math.max(3, Math.round(4 * sc));
    u.px(c, x, y - ch - 1, cw, ch, woodCol);
    u.px(c, x + 1, y - ch - 3, Math.max(2, Math.round(2 * sc)), 2, wheelCol);
    u.circle(c, x + Math.round(cw * 0.35), y - 1, Math.max(1, Math.round(1.5 * sc)), wheelCol);
    u.px(c, x + Math.round(cw * 0.35), y - 1, 1, 1, wf ? woodCol : '#2a1e14');
    // Çeki hayvanı (öküz/at)
    var ax = x + cw;
    u.px(c, ax, y - 3, Math.max(2, Math.round(3 * sc)), 1, woodCol);
    u.px(c, ax + 2, y - ch - 1, Math.max(4, Math.round(5 * sc)), Math.max(2, Math.round(3 * sc)), animalCol);
    u.px(c, ax + 6, y - ch - 2, 2, 2, animalCol);
    u.px(c, ax + 2 + wf, y - 2, 1, 2, animalCol);
    u.px(c, ax + 5 - wf, y - 2, 1, 2, animalCol);
  }

  function drawGrazingAnimal(u, c, x, y, sc, col, headCol, down) {
    var w = Math.max(3, Math.round(4 * sc));
    u.px(c, x, y - 3, w, 2, col);
    u.px(c, x, y - 1, 1, 1, col);
    u.px(c, x + w - 1, y - 1, 1, 1, col);
    u.px(c, x + w, y - (down ? 2 : 4), 2, 2, headCol);
  }

  /* ================= A1: gobeklitepe — GÖBEKLİTEPE (-∞ – -3501) ================= */
  function tPillar(u, c, cx, base, w, h, R, carved) {
    var capW = Math.round(w * 1.85), capH = Math.max(3, Math.round(h * 0.24));
    var shaftH = h - capH;
    stoneBlock(u, c, cx - Math.floor(w / 2), base - shaftH, w, shaftH, '#c9a37a', '#e8c89e', '#7e5e44', R);
    stoneBlock(u, c, cx - Math.floor(capW / 2), base - h, capW, capH, '#d4b086', '#f0d4aa', '#8a684c', R);
    if (carved) {
      var ry = base - Math.round(shaftH * 0.62);
      u.px(c, cx - 2, ry, 4, 2, '#7e5e44');
      u.px(c, cx + 1, ry - 1, 2, 1, '#6a4c36');
      u.px(c, cx - 3, ry + 1, 2, 1, '#7e5e44');
      u.px(c, cx - 1, ry + 2, 1, 1, '#6a4c36');
      u.px(c, cx + 1, ry + 2, 1, 1, '#6a4c36');
    }
  }

  S.register('gobeklitepe', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(101);
      u.bands(c, ['#241b3a', '#5e3658', '#c86848', '#f2b766'], 0, g, W, 12);
      u.stars(c, R, 26, W, Math.round(H * 0.28), '#ffe6c8');
      var sunX = Math.round(W * 0.5), sunY = g - Math.round(H * 0.10);
      u.sun(c, sunX, sunY, 13, ['#d9774a', '#f2b766', '#ffe8a8'], g);
      skyRays(u, c, sunX, sunY, g, '#f2b766', R);

      u.profile(c, 0, W, function (x) { return g - 10 - 6 * Math.sin(x / 37) - 3 * Math.sin(x / 13); }, g, '#482c46', '#6c425a');
      horizonSettlement(u, c, W, g, R, '#5a3a52', '#422a3c', '#8e5a68', 'tents');

      // Zemin + 3 şerit perspektif doku
      u.bands(c, ['#c9a37a', '#9a7a58', '#6a5038'], g, H, W, 7);
      groundTexture(u, c, W, H, g, R, { far: '#b89476', midHi: '#d8b48c', midSh: '#7e5e44', foreSh: '#4e3828' });

      // Sol: yarı gömülü dairesel taş halka + 3 T dikilitaş
      var lx = xl(G, 0.45), ringW = sz(G, 0.34), ph = sz(G, 0.32);
      var lb = g + 6;
      u.px(c, lx - Math.round(ringW * 0.6), lb - 6, Math.round(ringW * 1.2), 7, '#463230');
      for (var s = -3; s <= 3; s++) {
        var bx = lx + Math.round(s * ringW * 0.17) - 3;
        var by = lb - 7 + Math.round(Math.abs(s) * 0.8);
        stoneBlock(u, c, bx, by, 7, 5, '#a88462', '#d2ae86', '#5e4634', R);
      }
      tPillar(u, c, lx - Math.round(ringW * 0.32), lb - 2, Math.max(4, Math.round(ph * 0.18)), Math.round(ph * 0.72), R, false);
      tPillar(u, c, lx + Math.round(ringW * 0.34), lb - 2, Math.max(4, Math.round(ph * 0.18)), Math.round(ph * 0.68), R, false);
      tPillar(u, c, lx, lb + 1, Math.max(6, Math.round(ph * 0.25)), ph, R, true);

      // Sağ: BÜYÜK ve NET kazılmamış taş halka (üst-görünüm perspektif elipsi + gömülü T dikilitaşlar)
      var rx = xr(G, 0.50), rcy = g + 10;
      var rxRad = Math.max(22, sz(G, 0.24)), ryRad = Math.max(9, sz(G, 0.10));
      u.profile(c, W * 0.68, W, function (x) {
        return Math.min(g + 2, g - 15 - 7 * Math.sin((x - W * 0.68) / 15) + Math.max(0, W * 0.76 - x) * 0.45);
      }, g + 2, '#6e4e44', '#9a7460');
      // Dış toprak yığını halkası + iç kazı çukuru
      for (var edy = -ryRad - 3; edy <= ryRad + 3; edy++) {
        var outerW = Math.round((rxRad + 5) * Math.sqrt(Math.max(0, 1 - Math.pow(edy / (ryRad + 3), 2))));
        u.px(c, rx - outerW, rcy + edy, outerW * 2, 1, edy < 0 ? '#b8946c' : '#8a6848');
      }
      for (var idy = -ryRad + 2; idy <= ryRad - 2; idy++) {
        var innerW = Math.round((rxRad - 4) * Math.sqrt(Math.max(0, 1 - Math.pow(idy / (ryRad - 2), 2))));
        u.px(c, rx - innerW, rcy + idy, innerW * 2, 1, idy < -2 ? '#4a342c' : '#3a2822');
      }
      // Arka yarı daire taşları
      for (var ka = 0; ka < 14; ka++) {
        var ang = (ka / 14) * Math.PI * 2;
        if (Math.sin(ang) < 0) {
          var sx1 = rx + Math.round(Math.cos(ang) * rxRad) - 4;
          var sy1 = rcy + Math.round(Math.sin(ang) * ryRad) - 3;
          stoneBlock(u, c, sx1, sy1, 8, 5, '#a88462', '#d8b48c', '#543c2e', R);
        }
      }
      // Halka içi yarım gömülü T dikilitaşlar
      tPillar(u, c, rx - Math.round(rxRad * 0.40), rcy + 1, Math.max(4, Math.round(ph * 0.14)), Math.round(ph * 0.36), R, false);
      tPillar(u, c, rx + Math.round(rxRad * 0.38), rcy + 1, Math.max(4, Math.round(ph * 0.14)), Math.round(ph * 0.34), R, false);
      tPillar(u, c, rx, rcy + 3, Math.max(5, Math.round(ph * 0.16)), Math.round(ph * 0.28), R, true);
      // Ön yarı daire taşları (perspektifte önde)
      for (var kb = 0; kb < 14; kb++) {
        var ang2 = (kb / 14) * Math.PI * 2;
        if (Math.sin(ang2) >= 0) {
          var sx2 = rx + Math.round(Math.cos(ang2) * rxRad) - 4;
          var sy2 = rcy + Math.round(Math.sin(ang2) * ryRad) - 3;
          stoneBlock(u, c, sx2, sy2, 9, 6, '#b8946c', '#e4c298', '#4e3828', R);
        }
      }

      var fx = xr(G, 0.08), fy = g + 16;
      u.px(c, fx - 5, fy, 10, 2, '#4a3228');
      u.px(c, fx - 3, fy - 1, 6, 1, '#d9774a');

      var wheat = [];
      for (var wi = 0; wi < 12; wi++) {
        var wx = xr(G, 0.02 + wi * 0.08);
        var wy = g + 18 + (wi % 3) * 3;
        var wh = 6 + (wi % 3) * 2;
        u.px(c, wx, wy - wh, 1, wh, '#8e7438');
        wheat.push({ x: wx, y: wy - wh });
      }

      // 3 Şeritli zemin dolgusu (kenarlar %0-35 ve %65-100 yoğun, alt şerit 2x büyük)
      var gh = Math.max(20, H - g - 10);
      // Şerit 1 (ufka yakın: küçük ama çok sayıda soluk nesne)
      var s1X = [0.04, 0.10, 0.17, 0.24, 0.31, 0.39, 0.45, 0.51, 0.57, 0.63, 0.69, 0.77, 0.85, 0.93];
      for (var s1 = 0; s1 < s1X.length; s1++) {
        var px1 = Math.round(W * s1X[s1]), py1 = g + Math.round(gh * (0.09 + (s1 % 3) * 0.05));
        if (s1 % 4 === 0) tentProp(u, c, px1, py1, 0.5, '#7e5c58', '#a88274', '#583e3e');
        else if (s1 % 4 === 1) grassTuft(u, c, px1, py1, 0.55, '#8a725c', '#a88a6e');
        else if (s1 % 4 === 2) rockProp(u, c, px1, py1, 0.5, '#8c7464', '#a88c78', '#685446');
        else bush(u, c, px1, py1, 0.5, '#686448', '#827c58', '#9c946c');
      }
      // Şerit 2 (orta, kenar %0-35 ve %65-100)
      var y2a = g + Math.round(gh * 0.40), y2b = g + Math.round(gh * 0.52);
      tentProp(u, c, Math.round(W * 0.05), y2a, 1.2, '#8c6248', '#b88864', '#5a3c2c');
      moundProp(u, c, Math.round(W * 0.13), y2b, 1.1, '#9a7a58', '#c8a47c', '#5e4634');
      bush(u, c, Math.round(W * 0.19), y2a, 1.1, '#4e542e', '#6c743e', '#949c56');
      fieldRows(u, c, Math.round(W * 0.23), y2a - 2, 16, 3, 1.0, '#7a5c3e', '#b89c48');
      rockProp(u, c, Math.round(W * 0.30), y2b, 1.2, '#9a7a58', '#c8a47c', '#5e4634');
      steleProp(u, c, Math.round(W * 0.33), y2a, 1.0, '#b8946c', '#dfc096', '#6e523a');
      bush(u, c, Math.round(W * 0.67), y2a, 1.1, '#4e542e', '#6c743e', '#949c56');
      moundProp(u, c, Math.round(W * 0.72), y2b, 1.2, '#9a7a58', '#c8a47c', '#5e4634');
      tentProp(u, c, Math.round(W * 0.89), y2a, 1.2, '#8c6248', '#b88864', '#5a3c2c');
      rockProp(u, c, Math.round(W * 0.94), y2b, 1.2, '#9a7a58', '#c8a47c', '#5e4634');
      // Şerit 3 (ön, 2x büyük ve detaylı, yol bandı temiz)
      var fy3 = g + Math.round(gh * 0.78);
      tentProp(u, c, Math.round(W * 0.06), fy3 + 1, 2.0, '#8c6248', '#c49068', '#523626');
      rockProp(u, c, Math.round(W * 0.13), fy3 + 2, 2.4, '#8e6e4e', '#c8a278', '#4e3828');
      grassTuft(u, c, Math.round(W * 0.18), fy3 + 2, 2.2, '#6e6830', '#a4984c');
      amphora(u, c, Math.round(W * 0.22), fy3 + 2, 2.2, '#a66844', '#d49068');
      bush(u, c, Math.round(W * 0.27), fy3 + 1, 2.2, '#444a26', '#646c36', '#8a944e');
      steleProp(u, c, Math.round(W * 0.32), fy3 + 1, 1.9, '#b8946c', '#e4c298', '#684c36');
      moundProp(u, c, Math.round(W * 0.69), fy3 + 2, 2.2, '#8e6e4e', '#c8a278', '#4e3828');
      rockProp(u, c, Math.round(W * 0.75), fy3 + 2, 2.4, '#8e6e4e', '#c8a278', '#4e3828');
      grassTuft(u, c, Math.round(W * 0.81), fy3 + 2, 2.2, '#6e6830', '#a4984c');
      bush(u, c, Math.round(W * 0.87), fy3 + 1, 2.3, '#444a26', '#646c36', '#8a944e');
      crateStack(u, c, Math.round(W * 0.93), fy3 + 2, 1.8, '#7a5436', '#a87c54', '#4e3422', '#a66844');

      return {
        g: g, gh: gh, fx: fx, fy: fy, wheat: wheat,
        cloudsFar: u.makeClouds(u.rng(102), 3, W, H, 0.04, 0.16),
        clouds: u.makeClouds(u.rng(103), 4, W, H, 0.12, 0.26)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.cloudsFar, t * 0.3, G.W, ['#3e2846', '#6e3e58', '#b86250', '#e09860']);
      u.drawClouds(c, st.clouds, t * 0.55, G.W, ['#4c2f4f', '#8e4f62', '#d9774a', '#f2b766']);
      var ph = Math.floor(t * 6) % 3;
      flame(u, c, st.fx, st.fy, ph, 1);
      u.smoke(c, st.fx, st.fy - 5, t, '#9c7d8c', 0.8);
      var sw = Math.floor(t * 2) % 2 ? 1 : 0;
      for (var i = 0; i < st.wheat.length; i++) {
        var w = st.wheat[i];
        u.px(c, w.x + (i % 2 ? sw : -sw), w.y - 2, 2, 2, '#f2b766');
      }
      // Avcı yürüyüşü (sol şerit 2-3, büyük)
      var hx = Math.round(((G.W * 0.10 + t * 7) % (G.W * 0.22)) + G.W * 0.05);
      var hy = st.g + Math.round(st.gh * 0.62);
      drawPerson(u, c, hx, hy, 1.5, '#6e4832', '#d2ae86', Math.floor(t * 4) % 2, 'spear');
      // Otlayan yaban keçileri (sağ şerit 2, büyük)
      var down = Math.floor(t * 1.5) % 2;
      drawGrazingAnimal(u, c, Math.round(G.W * 0.77), st.g + Math.round(st.gh * 0.56), 1.5, '#b89468', '#7a5c3e', down);
      drawGrazingAnimal(u, c, Math.round(G.W * 0.83), st.g + Math.round(st.gh * 0.60), 1.6, '#a48058', '#6a4e32', 1 - down);
      u.birds(c, t, G.W, G.H, 4, '#2a2140', 0.22);
    }
  });

  /* ================= A2: ur_ziggurat — SÜMER UR (-3500 – -2601) ================= */
  S.register('ur_ziggurat', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(111);
      u.bands(c, ['#3f669c', '#8eb6d0', '#f3e2b0'], 0, g, W, 12);
      var sunX = Math.round(W * 0.5), sunY = Math.round(H * 0.21);
      u.sun(c, sunX, sunY, 13, ['#e8b86a', '#f3e2b0', '#fff9dc'], g);
      skyRays(u, c, sunX, sunY, g, '#f8e6b4', R);

      u.profile(c, 0, W, function (x) { return g - 6 - 3 * Math.sin(x / 43) - 2 * Math.sin(x / 17); }, g, '#b89468', '#d6b488');
      horizonSettlement(u, c, W, g, R, '#a88a68', '#8c6e4c', '#d8b888', 'city');

      // Zemin + 3 şerit perspektif doku
      u.bands(c, ['#d2aa78', '#b48a5a', '#7e5e3a'], g, H, W, 7);
      groundTexture(u, c, W, H, g, R, { far: '#c4a47e', midHi: '#e2be8a', midSh: '#8e6a42', foreSh: '#5c4228' });

      // Sol: 3 katlı basamaklı Ur Zigguratı + merkezi merdiven + tepe tapınağı
      var zx = xl(G, 0.5), zw = sz(G, 0.42), zh = sz(G, 0.36);
      var zb = g + 6;
      var h1 = Math.round(zh * 0.42), h2 = Math.round(zh * 0.32), h3 = zh - h1 - h2;
      var w1 = zw, w2 = Math.round(zw * 0.72), w3 = Math.round(zw * 0.46);
      var cols = ['#c8955a', '#b6844c', '#e6bc82', '#7a5a3a'];
      stoneWall(u, c, zx - Math.floor(w1 / 2), zb - h1, w1, h1, 6, 3, cols, R);
      stoneWall(u, c, zx - Math.floor(w2 / 2), zb - h1 - h2, w2, h2, 5, 3, cols, R);
      stoneWall(u, c, zx - Math.floor(w3 / 2), zb - zh, w3, h3, 4, 2, cols, R);
      for (var b = -3; b <= 3; b++) {
        if (b === 0) continue;
        u.px(c, zx + Math.round(b * w1 * 0.13), zb - h1 + 1, 2, h1 - 1, '#986c3c');
      }
      var sw = Math.max(5, Math.round(w1 * 0.16));
      u.px(c, zx - Math.floor(sw / 2) - 1, zb - h1 - h2, sw + 2, h1 + h2, '#7a5a3a');
      for (var sy = zb - h1 - h2; sy < zb; sy += 2) {
        u.px(c, zx - Math.floor(sw / 2), sy, sw, 1, '#e6bc82');
      }
      var tw = Math.max(8, Math.round(w3 * 0.55)), th = Math.max(5, Math.round(zh * 0.16));
      stoneBlock(u, c, zx - Math.floor(tw / 2), zb - zh - th, tw, th, '#d8ac74', '#f3e2b0', '#7a5a3a', R);
      u.px(c, zx - 1, zb - zh - th + 2, 2, th - 2, '#3a2a1e');
      var tx = zx + Math.floor(tw / 2) + 3, ty = zb - zh - 2;
      u.px(c, tx, ty - 2, 1, 3, '#5a3a24');

      // Sağ: Fırat kıyısı + mudhif kamış evi + sazlık + hurmalar
      var rivX = xr(G, 0.05), rivW = W - rivX;
      var rivY = g + 5, rivH = Math.max(6, Math.round((H - g) * 0.28));
      u.px(c, rivX + 2, rivY, rivW - 2, rivH, '#4a7fa8');
      u.px(c, rivX + 4, rivY + 2, rivW - 4, rivH - 3, '#3b6a90');
      u.px(c, rivX + 2, rivY, rivW - 2, 1, '#c8e4f0');
      u.px(c, rivX + 6, rivY + rivH - 2, rivW - 6, 2, '#2d5474');

      var mx = xr(G, 0.52), mb = rivY + 1;
      var mw = Math.max(14, sz(G, 0.16)), mh = Math.max(9, sz(G, 0.12));
      for (var ry = 0; ry < mh; ry++) {
        var hw = Math.round(mw * 0.5 * Math.sqrt(1 - Math.pow((mh - ry) / mh, 2) * 0.75));
        u.px(c, mx - hw, mb - mh + ry, hw * 2, 1, ry % 2 ? '#b48a4e' : '#d2aa6a');
      }
      u.px(c, mx - 2, mb - Math.round(mh * 0.55), 4, Math.round(mh * 0.55), '#463222');
      for (var rdx = rivX + 3; rdx < rivX + 20; rdx += 3) {
        u.px(c, rdx, rivY - 4, 1, 5, '#4e7e3e');
        u.px(c, rdx, rivY - 5, 1, 2, '#6a482c');
      }
      var palm1X = xr(G, 0.78), palm2X = xr(G, 0.88);
      palmTree(u, c, palm1X, mb + 1, sz(G, 0.22), 0);
      palmTree(u, c, palm2X, mb + 2, sz(G, 0.17), 0);

      // 3 Şeritli zemin dolgusu (kenarlar %0-35 ve %65-100 yoğun, alt şerit 2x büyük)
      var gh = Math.max(20, H - g - 10);
      // Şerit 1 (ufka yakın: küçük ama çok sayıda soluk nesne)
      var s1X = [0.04, 0.11, 0.18, 0.25, 0.32, 0.39, 0.45, 0.51, 0.57, 0.63, 0.68, 0.75, 0.82, 0.90];
      for (var s1 = 0; s1 < s1X.length; s1++) {
        var px1 = Math.round(W * s1X[s1]), py1 = g + Math.round(gh * (0.09 + (s1 % 3) * 0.05));
        if (s1 % 4 === 0) rockProp(u, c, px1, py1, 0.55, '#b89872', '#d8ba94', '#8e704c');
        else if (s1 % 4 === 1) grassTuft(u, c, px1, py1, 0.6, '#7a8a58', '#98a872');
        else if (s1 % 4 === 2) moundProp(u, c, px1, py1, 0.55, '#b89872', '#d8ba94', '#8e704c');
        else bush(u, c, px1, py1, 0.5, '#6a7c4c', '#849a60', '#a6ba7c');
      }
      // Şerit 2 (orta)
      var y2a = g + Math.round(gh * 0.42), y2b = g + Math.round(gh * 0.52);
      marketStall(u, c, Math.round(W * 0.06), y2a, 1.1, '#6e4a2c', '#c85a38', '#e8c488', '#d8a848');
      amphora(u, c, Math.round(W * 0.13), y2b, 1.2, '#b86840', '#e09468');
      wellProp(u, c, Math.round(W * 0.19), y2a, 1.1, '#a8845a', '#d8b482', '#6e5234', '#5a3a24');
      fenceSeg(u, c, Math.round(W * 0.24), y2a, 18, 1.1, '#6e4e32', '#9c744e');
      fieldRows(u, c, Math.round(W * 0.25), y2b - 2, 18, 3, 1.0, '#8a6642', '#7a9e48');
      fenceSeg(u, c, Math.round(W * 0.67), y2b, 16, 1.1, '#6e4e32', '#9c744e');
      bush(u, c, Math.round(W * 0.84), y2b, 1.2, '#446834', '#5c8844', '#86b064');
      // Şerit 3 (ön, 2x büyük)
      var fy3 = g + Math.round(gh * 0.78);
      amphora(u, c, Math.round(W * 0.04), fy3 + 2, 2.2, '#b86840', '#e09468');
      crateStack(u, c, Math.round(W * 0.09), fy3 + 2, 1.9, '#8c6438', '#b88c58', '#5e4024', '#b86840');
      wellProp(u, c, Math.round(W * 0.18), fy3 + 1, 1.8, '#a8845a', '#d8b482', '#6e5234', '#5a3a24');
      rockProp(u, c, Math.round(W * 0.24), fy3 + 2, 2.4, '#9a744a', '#cca270', '#5e4428');
      bush(u, c, Math.round(W * 0.30), fy3 + 1, 2.2, '#446834', '#5c8844', '#86b064');
      bush(u, c, Math.round(W * 0.69), fy3 + 1, 2.1, '#446834', '#5c8844', '#86b064');
      marketStall(u, c, Math.round(W * 0.77), fy3 + 1, 1.9, '#6e4a2c', '#386e96', '#e8c488', '#e09840');
      amphora(u, c, Math.round(W * 0.86), fy3 + 2, 2.2, '#b86840', '#e09468');
      moundProp(u, c, Math.round(W * 0.92), fy3 + 2, 2.2, '#9a744a', '#cca270', '#5e4428');

      return {
        g: g, gh: gh, tx: tx, ty: ty - 2, rivX: rivX, rivW: rivW, rivY: rivY + Math.floor(rivH * 0.45),
        palmX: palm1X, palmTop: mb + 1 - sz(G, 0.22),
        cloudsFar: u.makeClouds(u.rng(113), 3, W, H, 0.04, 0.14),
        clouds: u.makeClouds(u.rng(112), 4, W, H, 0.10, 0.25)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.cloudsFar, t * 0.35, G.W, ['#6a8eb4', '#9ec0d8', '#d4e6f0', '#f6f8fa']);
      u.drawClouds(c, st.clouds, t * 0.7, G.W, ['#7fa2c4', '#b4d2e4', '#e8eef0', '#fff9e6']);
      flame(u, c, st.tx, st.ty, Math.floor(t * 6) % 3, 1);
      u.smoke(c, st.tx, st.ty - 4, t, '#d8d0c4', 0.6);
      // Kamış kayık sağdan sola süzülür
      var span = st.rivW + 18;
      var bx = st.rivX + st.rivW - Math.round(((t * 6) % span));
      if (bx > st.rivX - 8 && bx < G.W) {
        u.px(c, bx, st.rivY, 10, 2, '#8c6438');
        u.px(c, bx - 1, st.rivY - 1, 2, 1, '#b48a58');
        u.px(c, bx + 9, st.rivY - 1, 2, 1, '#b48a58');
        u.px(c, bx + 4, st.rivY - 3, 2, 3, '#5a3a24');
      }
      // Nehir parıltısı
      for (var k = 0; k < 4; k++) {
        var gx = st.rivX + 4 + ((k * 29 + Math.floor(t * 3) * 6) % Math.max(8, st.rivW - 8));
        u.px(c, gx, st.rivY + (k % 2) * 2, 2, 1, '#c8e8f8');
      }
      // Öküz arabası (sol şerit 2, büyük)
      var cx = Math.round(((G.W * 0.08 + t * 8) % (G.W * 0.22)) + G.W * 0.04);
      drawCart(u, c, cx, st.g + Math.round(st.gh * 0.64), 1.5, '#7a5230', '#4a301a', '#8c5a36', Math.floor(t * 6) % 2);
      // Yürüyen köylü (sağ kıyı önü, büyük)
      var px0 = Math.round(G.W * 0.72 + ((t * 5) % (G.W * 0.16)));
      drawPerson(u, c, px0, st.g + Math.round(st.gh * 0.60), 1.5, '#d8c098', '#6a4428', Math.floor(t * 4) % 2);
      // Hurma yaprağı salınımı
      var sw = Math.floor(t * 2) % 2 ? 1 : -1;
      u.px(c, st.palmX + 7 + sw, st.palmTop + 2, 2, 1, '#4d8848');
      u.birds(c, t, G.W, G.H, 4, '#4a3e38', 0.20);
    }
  });

  /* ================= A3: hattusa — HİTİT HATTUŞA (-1600 – -1201) ================= */
  S.register('hattusa', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(121);
      u.bands(c, ['#4f7ab0', '#9ec2dc', '#e8d9a8'], 0, g, W, 12);
      var sunX = Math.round(W * 0.52), sunY = Math.round(H * 0.19);
      u.sun(c, sunX, sunY, 12, ['#e8c878', '#f8e6a8', '#ffffff'], g);
      skyRays(u, c, sunX, sunY, g, '#f4e6b8', R);

      u.profile(c, 0, W, function (x) { return g - 12 - 7 * Math.sin(x / 31) - 4 * Math.sin(x / 11); }, g, '#868464', '#a8a682');
      horizonSettlement(u, c, W, g, R, '#7c785c', '#5e5a44', '#b4ae8c', 'city');

      // Zemin + 3 şerit perspektif doku
      u.bands(c, ['#c0a882', '#a08866', '#6e5c44'], g, H, W, 7);
      groundTexture(u, c, W, H, g, R, { far: '#b09c7c', midHi: '#d2be96', midSh: '#7c684e', foreSh: '#4a3e2e' });

      // Sol: Aslanlı Kapı (iki kule + kesme taş sur + kemer + BELİRGİN İKİ ASLAN BAŞI)
      var lx = xl(G, 0.48), gw = sz(G, 0.36), gh = sz(G, 0.34);
      var lb = g + 6;
      var tw = Math.max(8, Math.round(gw * 0.28));
      var cols = ['#a88a5c', '#987c50', '#cab086', '#5e4c36'];
      stoneWall(u, c, lx - Math.floor(gw / 2), lb - gh, tw, gh, 5, 4, cols, R);
      stoneWall(u, c, lx + Math.floor(gw / 2) - tw, lb - gh, tw, gh, 5, 4, cols, R);
      stoneWall(u, c, lx - Math.floor(gw / 2) + tw, lb - Math.round(gh * 0.72), gw - tw * 2, Math.round(gh * 0.72), 5, 4, cols, R);
      var cTop = lb - Math.round(gh * 0.72);
      var lStart = lx - Math.floor(gw / 2), rStart = lx + Math.floor(gw / 2) - tw;
      for (var dx = lStart; dx < lStart + tw; dx += 4) {
        u.px(c, dx, lb - gh - 3, 2, 3, '#a88a5c'); u.px(c, dx, lb - gh - 3, 2, 1, '#cab086');
      }
      for (dx = rStart; dx < rStart + tw; dx += 4) {
        u.px(c, dx, lb - gh - 3, 2, 3, '#a88a5c'); u.px(c, dx, lb - gh - 3, 2, 1, '#cab086');
      }
      for (dx = lStart + tw + 1; dx < rStart - 1; dx += 4) {
        u.px(c, dx, cTop - 2, 2, 2, '#a88a5c'); u.px(c, dx, cTop - 2, 2, 1, '#cab086');
      }
      var aw = Math.max(8, Math.round(gw * 0.32)), ah = Math.round(gh * 0.52);
      for (var ay = 0; ay < ah; ay++) {
        var half = Math.round((aw * 0.5) * Math.sqrt(ay / ah));
        u.px(c, lx - Math.max(2, half), lb - ah + ay, Math.max(4, half * 2), 1, '#261e18');
      }
      // BÜYÜK ve BELİRGİN aslan başı protomları (yele, kaş, yüz, kükreyen çene, pençe)
      var lOff = Math.floor(aw * 0.5) + 1;
      [lx - lOff - 11, lx + lOff].forEach(function (ax, idx) {
        var ay0 = lb - Math.round(ah * 0.80);
        u.px(c, ax - 1, ay0 - 1, 13, 15, '#4a3a28'); // koyu kontur/gölge
        u.px(c, ax, ay0, 11, 12, '#b89868');          // dış yele
        u.px(c, ax + 1, ay0 + 1, 9, 9, '#d2b688');     // iç yele
        u.px(c, ax + (idx ? 2 : 1), ay0 + 2, 7, 6, '#ead4a8'); // yüz
        u.px(c, ax + (idx ? 2 : 1), ay0 + 2, 7, 1, '#fff0cc'); // kaş çıkıntısı
        u.px(c, ax + (idx ? 3 : 2), ay0 + 4, 2, 1, '#261e18'); // sol göz
        u.px(c, ax + (idx ? 6 : 5), ay0 + 4, 2, 1, '#261e18'); // sağ göz
        u.px(c, ax + 3, ay0 + 5, 5, 2, '#d8bc8c');     // burun/ağızlık
        u.px(c, ax + 2, ay0 + 7, 7, 3, '#261e18');     // kükreyen açık ağız
        u.px(c, ax + 3, ay0 + 7, 1, 1, '#fff4d8');     // diş
        u.px(c, ax + 7, ay0 + 7, 1, 1, '#fff4d8');     // diş
        u.px(c, ax + 1, ay0 + 11, 9, 3, '#a88c5e');    // ön pençe/kaide
        u.px(c, ax + 2, ay0 + 11, 7, 1, '#d2b688');    // kaide üst ışık
      });

      // Sağ: Yazılıkaya kaya kabartması (dokulu kademeli kayalık + niş + kanatlı güneş + tanrı kabartmaları)
      var rx = xr(G, 0.54), rw = sz(G, 0.38), rh = sz(G, 0.30);
      var rb = g + 5;
      u.profile(c, rx - Math.floor(rw * 0.62), W, function (x) {
        return rb - rh + Math.abs(x - rx) * 0.22 - 4 * Math.sin(x / 6) - 2 * Math.cos(x / 3);
      }, rb + 1, '#7a6e54', '#a89878');
      // Kaya katmanları, çatlaklar ve çıkıntılar (boş gri blok yerine doğal kaya dokusu)
      for (var rky = rb - rh + 4; rky < rb - 2; rky += 5) {
        for (var rkx = rx - Math.floor(rw * 0.50); rkx < rx + Math.floor(rw * 0.48); rkx += 8) {
          if (R() < 0.78) {
            stoneBlock(u, c, rkx + (rky % 3), rky, 7, 4, '#84765a', '#b0a080', '#544a38', R);
          }
        }
      }
      // Dikey kaya yarıkları
      for (var cr = -2; cr <= 2; cr++) {
        var crx = rx + cr * Math.round(rw * 0.18);
        u.px(c, crx, rb - rh + 6, 1, Math.round(rh * 0.32), '#4e4432');
        u.px(c, crx + 1, rb - rh + 7, 1, Math.round(rh * 0.28), '#a89878');
      }
      // Oyulmuş açık hava tapınağı nişi (kademeli çerçeve + kabartma zemini)
      var pxStart = rx - Math.floor(rw * 0.42), pw = Math.round(rw * 0.84);
      var nTop = rb - Math.round(rh * 0.58), nH = Math.round(rh * 0.48);
      u.px(c, pxStart - 1, nTop - 2, pw + 2, 2, '#4a4030'); // üst kaya saçağı gölgesi
      u.px(c, pxStart, nTop, pw, nH, '#665a44');
      u.px(c, pxStart + 1, nTop + 1, pw - 2, nH - 2, '#5a4e3a');
      // Üstte Hitit kanatlı güneş kursu kabartması
      u.px(c, rx - 8, nTop + 2, 16, 2, '#c8b48c');
      u.px(c, rx - 3, nTop + 1, 6, 4, '#e4d0a4');
      u.px(c, rx - 1, nTop + 2, 2, 2, '#8c744c');
      // Yürüyen 8 büyük Hitit tanrı/savaşçı kabartması (sivri külah, etek, asa/silah, çift ton kabartma)
      var count = 8, step = Math.max(4, Math.floor((pw - 6) / count));
      for (var fi = 0; fi < count; fi++) {
        var fx = pxStart + 4 + fi * step;
        var fy = rb - Math.round(rh * 0.12);
        u.px(c, fx - 1, fy - 11, 1, 3, '#d8c498'); // sivri külah ön kenar
        u.px(c, fx, fy - 11, 2, 3, '#463c2c');     // sivri külah
        u.px(c, fx - 1, fy - 8, 3, 5, '#d8c498');  // gövde kabartma ışığı
        u.px(c, fx + 1, fy - 8, 2, 5, '#3e3426');  // gövde gölge
        u.px(c, fx - 2, fy - 7, 1, 4, '#e8d4a8');  // kaldırılmış silah/asa
        u.px(c, fx - 1, fy - 3, 1, 3, '#c8b48c');  // ön bacak
        u.px(c, fx + 1, fy - 3, 1, 3, '#3e3426');  // arka bacak
      }
      bush(u, c, rx - Math.floor(rw * 0.48), rb + 1, 1.1, '#4a542e', '#687440', '#8e9a5c');
      rockProp(u, c, rx + Math.floor(rw * 0.42), rb + 2, 1.2, '#867256', '#b8a282', '#4e4232');

      // 3 Şeritli zemin dolgusu (kenarlar %0-35 ve %65-100 yoğun, alt şerit 2x büyük)
      var grh = Math.max(20, H - g - 10);
      // Şerit 1 (ufka yakın: küçük ama çok sayıda soluk nesne)
      var s1X = [0.04, 0.11, 0.18, 0.25, 0.32, 0.39, 0.45, 0.51, 0.57, 0.63, 0.69, 0.76, 0.84, 0.92];
      for (var s1 = 0; s1 < s1X.length; s1++) {
        var px1 = Math.round(W * s1X[s1]), py1 = g + Math.round(grh * (0.09 + (s1 % 3) * 0.05));
        if (s1 % 4 === 0) rockProp(u, c, px1, py1, 0.55, '#9e8e70', '#c4b494', '#72644e');
        else if (s1 % 4 === 1) grassTuft(u, c, px1, py1, 0.6, '#72784a', '#949a66');
        else if (s1 % 4 === 2) moundProp(u, c, px1, py1, 0.55, '#9e8e70', '#c4b494', '#72644e');
        else bush(u, c, px1, py1, 0.5, '#687046', '#828a58', '#9ea672');
      }
      // Şerit 2 (orta)
      var y2a = g + Math.round(grh * 0.42), y2b = g + Math.round(grh * 0.52);
      fenceSeg(u, c, Math.round(W * 0.04), y2a, 18, 1.1, '#624e38', '#8c7254');
      wellProp(u, c, Math.round(W * 0.13), y2b, 1.1, '#8c785a', '#b8a282', '#544634', '#5e4c36');
      fieldRows(u, c, Math.round(W * 0.19), y2a - 2, 16, 3, 1.0, '#786246', '#8a9248');
      marketStall(u, c, Math.round(W * 0.29), y2b, 1.1, '#6a4e36', '#9c4230', '#d8be90', '#c89848');
      bush(u, c, Math.round(W * 0.68), y2a, 1.2, '#4a542e', '#687440', '#8e9a5c');
      tentProp(u, c, Math.round(W * 0.74), y2b, 1.1, '#8c7456', '#b89e7c', '#5a4a36');
      fenceSeg(u, c, Math.round(W * 0.86), y2a, 16, 1.1, '#624e38', '#8c7254');
      // Şerit 3 (ön, 2x büyük)
      var fy3 = g + Math.round(grh * 0.78);
      rockProp(u, c, Math.round(W * 0.06), fy3 + 2, 2.4, '#867256', '#b8a282', '#4e4232');
      amphora(u, c, Math.round(W * 0.12), fy3 + 2, 2.2, '#9c5c3c', '#c8845c');
      crateStack(u, c, Math.round(W * 0.18), fy3 + 2, 1.9, '#7a5c3e', '#a8845e', '#4e3a26', '#9c5c3c');
      grassTuft(u, c, Math.round(W * 0.25), fy3 + 2, 2.2, '#5e6638', '#8c9656');
      moundProp(u, c, Math.round(W * 0.31), fy3 + 2, 2.2, '#867256', '#b8a282', '#4e4232');
      bush(u, c, Math.round(W * 0.70), fy3 + 1, 2.2, '#444e2a', '#626e3c', '#889658');
      wellProp(u, c, Math.round(W * 0.77), fy3 + 1, 1.8, '#8c785a', '#b8a282', '#544634', '#5e4c36');
      rockProp(u, c, Math.round(W * 0.85), fy3 + 2, 2.4, '#867256', '#b8a282', '#4e4232');
      amphora(u, c, Math.round(W * 0.92), fy3 + 2, 2.2, '#9c5c3c', '#c8845c');

      return {
        g: g, grh: grh, flagX: lx - Math.floor(gw / 2) + 2, flagY: lb - gh - 8,
        cloudsFar: u.makeClouds(u.rng(123), 3, W, H, 0.04, 0.15),
        clouds: u.makeClouds(u.rng(122), 4, W, H, 0.10, 0.26)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.cloudsFar, t * 0.4, G.W, ['#789cc0', '#a8c6de', '#d8e6f2', '#f8fafc']);
      u.drawClouds(c, st.clouds, t * 0.8, G.W, ['#8cb0d4', '#bdd8ec', '#e6f0f8', '#ffffff']);
      // Kule sancağı
      var fl = Math.floor(t * 4) % 2;
      u.px(c, st.flagX, st.flagY, 1, 6, '#5e4c36');
      u.px(c, st.flagX + 1, st.flagY + fl, 4, 2, '#b8382c');
      // İki atlı Hitit savaş arabası (büyük)
      var cx = Math.round(((G.W * 0.08 + t * 14) % (G.W * 0.24)) + G.W * 0.04);
      var cy = st.g + Math.round(st.grh * 0.64);
      var wf = Math.floor(t * 8) % 2;
      u.px(c, cx, cy - 6, 9, 4, '#6e5c44');
      u.px(c, cx + 2, cy - 9, 3, 3, '#3a2e22');
      u.circle(c, cx + 3, cy - 2, 3, '#4a3828');
      u.px(c, cx + 3, cy - 2, 1, 1, wf ? '#cab086' : '#3a2e22');
      u.px(c, cx + 9, cy - 4, 9, 1, '#5e4c36');
      u.px(c, cx + 11, cy - 6, 7, 3, '#4a3624');
      u.px(c, cx + 17, cy - 9, 3, 3, '#4a3624');
      u.px(c, cx + 11 + wf, cy - 3, 2, 3, '#4a3624');
      u.px(c, cx + 15 - wf, cy - 3, 2, 3, '#4a3624');
      // Otlayan koyunlar (sağ şerit 2, büyük)
      var down = Math.floor(t * 1.5) % 2;
      drawGrazingAnimal(u, c, Math.round(G.W * 0.78), st.g + Math.round(st.grh * 0.56), 1.5, '#e2d8c4', '#4a3e32', down);
      drawGrazingAnimal(u, c, Math.round(G.W * 0.84), st.g + Math.round(st.grh * 0.60), 1.6, '#d4c8b0', '#4a3e32', 1 - down);
      // Süzülen kartal
      var ex = Math.round(G.W - ((t * 9) % (G.W + 30)));
      var ey = Math.round(G.H * 0.26 + Math.sin(t * 1.4) * 3);
      u.px(c, ex - 3, ey, 7, 1, '#3a3028');
      u.px(c, ex - 1, ey - 1, 3, 2, '#4a3e32');
      u.birds(c, t, G.W, G.H, 3, '#4a5c78', 0.20);
    }
  });

  /* ================= A4: truva — TRUVA (-1200 – -801) ================= */
  S.register('truva', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(131);
      u.bands(c, ['#342856', '#a44864', '#ee8454', '#ffd08a'], 0, g, W, 12);
      var sunX = Math.round(W * 0.5), sunY = g - 12;
      u.sun(c, sunX, sunY, 15, ['#f08a5a', '#ffd08a', '#fff6d4'], g);
      skyRays(u, c, sunX, sunY, g, '#ffd08a', R);

      u.profile(c, 0, W, function (x) { return g - 6 - 4 * Math.sin(x / 35) - 2 * Math.sin(x / 15); }, g, '#683c54', '#9a5468');
      horizonSettlement(u, c, W, g, R, '#78465c', '#583246', '#c87872', 'tents');

      // Zemin + 3 şerit perspektif doku
      u.bands(c, ['#c8b08a', '#a8906c', '#76603e'], g, H, W, 7);
      groundTexture(u, c, W, H, g, R, { far: '#b69c84', midHi: '#dcc49c', midSh: '#846c4a', foreSh: '#524028' });

      // Sol: Eğimli (şevli) Truva surları + kule + kapı
      var lx = xl(G, 0.45), lw = sz(G, 0.36), lh = sz(G, 0.30);
      var lb = g + 6;
      var topY = lb - lh;
      for (var y = topY; y < lb; y++) {
        var frac = (y - topY) / lh;
        var extra = Math.round(frac * lw * 0.25);
        var col = (y % 4 === 0) ? '#7a5e44' : ((y % 4 === 1) ? '#d8bc94' : '#b4966e');
        u.px(c, lx - Math.floor(lw * 0.5) - Math.floor(extra * 0.3), y, lw + extra, 1, col);
      }
      var tw = Math.max(8, Math.round(lw * 0.34)), th = Math.round(lh * 0.45);
      stoneWall(u, c, lx + Math.floor(lw * 0.12), topY - th, tw, th, 4, 3, ['#b4966e', '#a48660', '#dcc098', '#6e523a'], R);
      for (var bx = lx - Math.floor(lw * 0.5); bx < lx + Math.floor(lw * 0.5); bx += 4) {
        u.px(c, bx, topY - 2, 2, 2, '#b4966e');
      }
      u.px(c, lx - 4, lb - Math.round(lh * 0.48), 8, Math.round(lh * 0.48), '#2c1e24');
      var t1x = lx - 6, t2x = lx + 6, ty0 = lb - Math.round(lh * 0.52);

      // Sağ: Kıyı deniz şeridi + Akha gemileri + tekerlekli Truva Atı
      var seaY = g - 3, seaH = 7;
      u.px(c, Math.round(W * 0.62), seaY, Math.round(W * 0.38), seaH, '#2e5a7a');
      u.px(c, Math.round(W * 0.62), seaY, Math.round(W * 0.38), 1, '#f08a5a');

      var hx = xr(G, 0.45), hb = g + 8;
      var hs = Math.max(1, Math.round(sz(G, 0.24) / 18));
      u.px(c, hx - 10 * hs, hb - 3 * hs, 20 * hs, 2 * hs, '#6a4428');
      u.circle(c, hx - 7 * hs, hb - hs, hs + 1, '#4a2e1a');
      u.circle(c, hx + 7 * hs, hb - hs, hs + 1, '#4a2e1a');
      u.px(c, hx - 7 * hs, hb - 10 * hs, 2 * hs, 7 * hs, '#8c5832');
      u.px(c, hx + 5 * hs, hb - 10 * hs, 2 * hs, 7 * hs, '#8c5832');
      u.px(c, hx - 8 * hs, hb - 16 * hs, 16 * hs, 6 * hs, '#9e643a');
      u.px(c, hx - 8 * hs, hb - 16 * hs, 16 * hs, hs, '#c48654');
      u.px(c, hx - 2 * hs, hb - 14 * hs, 3 * hs, 3 * hs, '#5e3820');
      u.px(c, hx - 8 * hs, hb - 22 * hs, 4 * hs, 7 * hs, '#9e643a');
      u.px(c, hx - 12 * hs, hb - 23 * hs, 6 * hs, 3 * hs, '#b47848');
      u.px(c, hx + 8 * hs, hb - 15 * hs, 2 * hs, 5 * hs, '#5e3820');

      // 3 Şeritli zemin dolgusu (kenarlar %0-35 ve %65-100 yoğun, alt şerit 2x büyük)
      var gh = Math.max(20, H - g - 10);
      // Şerit 1 (ufka yakın: küçük ama çok sayıda soluk nesne)
      var s1X = [0.04, 0.11, 0.18, 0.25, 0.32, 0.39, 0.45, 0.51, 0.57, 0.63, 0.69, 0.76, 0.84, 0.92];
      for (var s1 = 0; s1 < s1X.length; s1++) {
        var px1 = Math.round(W * s1X[s1]), py1 = g + Math.round(gh * (0.09 + (s1 % 3) * 0.05));
        if (s1 % 4 === 0) tentProp(u, c, px1, py1, 0.55, '#8c544e', '#b87a6a', '#5a3236');
        else if (s1 % 4 === 1) rockProp(u, c, px1, py1, 0.55, '#9c8468', '#c4aa8c', '#6e5a44');
        else if (s1 % 4 === 2) grassTuft(u, c, px1, py1, 0.6, '#6e6a3c', '#989056');
        else bush(u, c, px1, py1, 0.5, '#686a42', '#828452', '#9ea06a');
      }
      // Şerit 2 (orta)
      var y2a = g + Math.round(gh * 0.42), y2b = g + Math.round(gh * 0.52);
      fenceSeg(u, c, Math.round(W * 0.04), y2a, 18, 1.1, '#5e4228', '#8c6844');
      crateStack(u, c, Math.round(W * 0.13), y2b, 1.1, '#7a5230', '#a87c50', '#4e341e', '#9c5838');
      fieldRows(u, c, Math.round(W * 0.19), y2a - 2, 16, 3, 1.0, '#7a6042', '#8e8c48');
      marketStall(u, c, Math.round(W * 0.28), y2b, 1.1, '#5e4228', '#a83e38', '#e0b880', '#d8a048');
      tentProp(u, c, Math.round(W * 0.69), y2a, 1.2, '#a84e42', '#d87860', '#682c2a');
      amphora(u, c, Math.round(W * 0.76), y2b, 1.2, '#9c5838', '#c88058');
      tentProp(u, c, Math.round(W * 0.90), y2a, 1.2, '#8c483e', '#c06c58', '#582824');
      // Şerit 3 (ön, 2x büyük)
      var fy3 = g + Math.round(gh * 0.78);
      rockProp(u, c, Math.round(W * 0.06), fy3 + 2, 2.4, '#866e4e', '#b89c78', '#4e3e28');
      crateStack(u, c, Math.round(W * 0.12), fy3 + 2, 1.9, '#7a5230', '#a87c50', '#4e341e', '#9c5838');
      bush(u, c, Math.round(W * 0.19), fy3 + 1, 2.2, '#464c28', '#666e3a', '#8e9654');
      amphora(u, c, Math.round(W * 0.25), fy3 + 2, 2.2, '#9c5838', '#c88058');
      moundProp(u, c, Math.round(W * 0.31), fy3 + 2, 2.2, '#866e4e', '#b89c78', '#4e3e28');
      tentProp(u, c, Math.round(W * 0.69), fy3 + 1, 2.0, '#a84e42', '#d87860', '#682c2a');
      bush(u, c, Math.round(W * 0.77), fy3 + 1, 2.2, '#464c28', '#666e3a', '#8e9654');
      rockProp(u, c, Math.round(W * 0.84), fy3 + 2, 2.4, '#866e4e', '#b89c78', '#4e3e28');
      grassTuft(u, c, Math.round(W * 0.90), fy3 + 2, 2.2, '#646234', '#948e50');
      amphora(u, c, Math.round(W * 0.95), fy3 + 2, 2.1, '#9c5838', '#c88058');

      return {
        g: g, gh: gh, t1x: t1x, t2x: t2x, ty: ty0,
        flagX: lx + Math.floor(lw * 0.14), flagY: topY - th - 6,
        seaY: seaY,
        ships: [xr(G, 0.15), xr(G, 0.78)],
        cloudsFar: u.makeClouds(u.rng(133), 3, W, H, 0.04, 0.15),
        clouds: u.makeClouds(u.rng(132), 4, W, H, 0.10, 0.25)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.cloudsFar, t * 0.35, G.W, ['#563458', '#8c4662', '#d07458', '#f0a874']);
      u.drawClouds(c, st.clouds, t * 0.65, G.W, ['#6a3e62', '#b0506a', '#f08a5a', '#ffd08a']);
      var ph = Math.floor(t * 6) % 3;
      flame(u, c, st.t1x, st.ty, ph, 1);
      flame(u, c, st.t2x, st.ty, (ph + 1) % 3, 1);
      // Kule sancağı
      var fl = Math.floor(t * 4) % 2;
      u.px(c, st.flagX, st.flagY, 1, 6, '#5e4228');
      u.px(c, st.flagX + 1, st.flagY + fl, 4, 2, '#d83830');
      // Akha gemileri salınımı
      for (var i = 0; i < st.ships.length; i++) {
        var sx = st.ships[i];
        var sy = st.seaY + 2 + ((Math.floor(t * 2 + i) % 2) ? 1 : 0);
        u.px(c, sx - 6, sy, 12, 2, '#241c2c');
        u.px(c, sx - 7, sy - 2, 2, 2, '#241c2c');
        u.px(c, sx + 5, sy - 2, 2, 2, '#241c2c');
        u.px(c, sx, sy - 7, 1, 7, '#5a3a28');
        u.px(c, sx - 3, sy - 6, 6, 4, '#e8d8c0');
      }
      // Deniz parıltısı
      for (var k = 0; k < 5; k++) {
        var gx = Math.round(G.W * 0.65 + ((k * 31 + Math.floor(t * 3) * 7) % Math.max(8, Math.round(G.W * 0.32))));
        u.px(c, gx, st.seaY + 2 + (k % 3) * 2, 2, 1, '#ffd08a');
      }
      // Devriye askeri (sol şerit 2, büyük)
      var px0 = Math.round(((G.W * 0.10 + t * 8) % (G.W * 0.22)) + G.W * 0.05);
      drawPerson(u, c, px0, st.g + Math.round(st.gh * 0.62), 1.5, '#8c322c', '#d8b890', Math.floor(t * 4) % 2, 'spear');
      // İkmal arabası (sağ şerit 2, büyük)
      var cx = Math.round(G.W * 0.88 - ((t * 6) % (G.W * 0.18)));
      drawCart(u, c, cx, st.g + Math.round(st.gh * 0.64), 1.5, '#6a4428', '#3e2818', '#8c5832', Math.floor(t * 6) % 2);
      u.birds(c, t, G.W, G.H, 4, '#3a2e5e', 0.20);
    }
  });

  function grhSize(gh, f) { return Math.round(gh * f); }

  /* ================= A5: babil — BABİL (-800 – -501) ================= */
  S.register('babil', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(141);
      u.bands(c, ['#242352', '#644278', '#df8056', '#ffcf80'], 0, g, W, 12);
      u.stars(c, R, 20, W, Math.round(H * 0.26), '#ffe8b8');
      var sunX = Math.round(W * 0.5), sunY = Math.round(H * 0.22);
      u.sun(c, sunX, sunY, 12, ['#e2865a', '#ffcf80', '#fff4cc'], g);
      skyRays(u, c, sunX, sunY, g, '#ffcf80', R);

      horizonSettlement(u, c, W, g, R, '#4e3658', '#382644', '#a86a78', 'city');
      // Uzakta Etemenanki silueti (sağ-orta sınırında)
      var ex = Math.round(W * 0.69), eb = g;
      u.px(c, ex - 12, eb - 8, 24, 8, '#5a3e62');
      u.px(c, ex - 9, eb - 15, 18, 7, '#5a3e62');
      u.px(c, ex - 6, eb - 21, 12, 6, '#5a3e62');
      u.px(c, ex - 3, eb - 25, 6, 4, '#6e4a7e');

      // Zemin + 3 şerit perspektif doku
      u.bands(c, ['#d8ba84', '#b89a64', '#84683e'], g, H, W, 7);
      groundTexture(u, c, W, H, g, R, { far: '#c4a87c', midHi: '#e4c890', midSh: '#947448', foreSh: '#5c4628' });

      // Sol: Lacivert sırlı İştar Kapısı (ÜST BOŞLUK KAPALI + BÜYÜK/OKUNUR EJDER/ASLAN SIRALARI)
      var lx = xl(G, 0.48), iw = sz(G, 0.38), ih = sz(G, 0.38);
      var ib = g + 6;
      var tw = Math.max(8, Math.round(iw * 0.28));
      var bCols = ['#1f4fa0', '#1a4288', '#3872cc', '#122e66'];
      stoneWall(u, c, lx - Math.floor(iw / 2), ib - ih, tw, ih, 5, 3, bCols, R);
      stoneWall(u, c, lx + Math.floor(iw / 2) - tw, ib - ih, tw, ih, 5, 3, bCols, R);
      // Orta kapı gövdesi üstte kapalı (küçük 2px kademe ile tam birleşik)
      var midH = ih - 2;
      stoneWall(u, c, lx - Math.floor(iw / 2) + tw, ib - midH, iw - tw * 2, midH, 5, 3, ['#1a448e', '#163878', '#3066ba', '#102858'], R);
      // Altın friz bandı
      u.px(c, lx - Math.floor(iw / 2), ib - Math.round(ih * 0.80), iw, 2, '#d8b040');
      // Mazgal dişleri (kuleler ve orta duvar kesintisiz)
      for (var cx = lx - Math.floor(iw / 2); cx < lx + Math.floor(iw / 2); cx += 4) {
        var topY = (cx >= lx - Math.floor(iw / 2) + tw && cx < lx + Math.floor(iw / 2) - tw) ? (ib - midH) : (ib - ih);
        u.px(c, cx, topY - 3, 2, 3, '#1f4fa0');
        u.px(c, cx, topY - 3, 2, 1, '#f0c850');
      }
      // Kemer
      var aw = Math.max(8, Math.round(iw * 0.34)), ah = Math.round(ih * 0.48);
      for (var ay = 0; ay < ah; ay++) {
        var half = Math.round((aw * 0.5) * Math.sqrt(ay / ah));
        u.px(c, lx - Math.max(2, half), ib - ah + ay, Math.max(4, half * 2), 1, '#121028');
      }
      // Büyük ve okunur sarı ejder/aslan kabartma sıraları
      for (var ry = ib - Math.round(ih * 0.72); ry < ib - 6; ry += 9) {
        // Sol kule ejder/boğa
        var lxR = lx - Math.floor(iw / 2) + 2;
        u.px(c, lxR, ry, 6, 3, '#e8be48');
        u.px(c, lxR + 5, ry - 2, 2, 2, '#ffe078');
        u.px(c, lxR + 1, ry + 3, 1, 2, '#d8b040');
        u.px(c, lxR + 4, ry + 3, 1, 2, '#d8b040');
        // Sağ kule ejder/boğa
        var rxR = lx + Math.floor(iw / 2) - 8;
        u.px(c, rxR, ry, 6, 3, '#e8be48');
        u.px(c, rxR - 1, ry - 2, 2, 2, '#ffe078');
        u.px(c, rxR + 1, ry + 3, 1, 2, '#d8b040');
        u.px(c, rxR + 4, ry + 3, 1, 2, '#d8b040');
      }

      // Sağ: Asma Bahçeler (basamaklı teras + sarkan yeşillik + palmiye + şelale)
      var rx = xr(G, 0.5), rw = sz(G, 0.38), rh = sz(G, 0.32);
      var rb = g + 6;
      var tCols = ['#c89a64', '#b48650', '#e2bc84', '#7a5a38'];
      var wfX = rx + 2, wfY0 = rb - rh + 4;
      for (var tier = 0; tier < 3; tier++) {
        var tW = Math.round(rw * (1 - tier * 0.24));
        var tH = Math.round(rh * 0.34);
        var ty = rb - (tier + 1) * tH;
        stoneWall(u, c, rx - Math.floor(tW / 2), ty, tW, tH, 6, 3, tCols, R);
        for (var nx = rx - Math.floor(tW * 0.35); nx < rx + Math.floor(tW * 0.35); nx += 6) {
          u.px(c, nx, ty + 2, 3, tH - 3, '#4a3222');
        }
        for (var gx = rx - Math.floor(tW / 2); gx < rx + Math.floor(tW / 2); gx += 3) {
          var drop = 2 + ((gx * 7 + tier * 3) % 4);
          u.px(c, gx, ty - 1, 2, drop, (gx % 2) ? '#3a7a42' : '#58a256');
        }
      }
      palmTree(u, c, rx - Math.round(rw * 0.16), rb - rh, sz(G, 0.16), 0);

      // 3 Şeritli zemin dolgusu (kenarlar %0-35 ve %65-100 yoğun, alt şerit 2x büyük)
      var gh = Math.max(20, H - g - 10);
      // Şerit 1 (ufka yakın: küçük ama çok sayıda soluk nesne)
      var s1X = [0.04, 0.11, 0.18, 0.25, 0.32, 0.39, 0.45, 0.51, 0.57, 0.63, 0.69, 0.76, 0.84, 0.92];
      for (var s1 = 0; s1 < s1X.length; s1++) {
        var px1 = Math.round(W * s1X[s1]), py1 = g + Math.round(gh * (0.09 + (s1 % 3) * 0.05));
        if (s1 % 4 === 0) rockProp(u, c, px1, py1, 0.55, '#b89864', '#e0c088', '#84683e');
        else if (s1 % 4 === 1) grassTuft(u, c, px1, py1, 0.6, '#568848', '#78ac64');
        else if (s1 % 4 === 2) moundProp(u, c, px1, py1, 0.55, '#b89864', '#e0c088', '#84683e');
        else bush(u, c, px1, py1, 0.5, '#487642', '#609458', '#84b878');
      }
      // Şerit 2 (orta)
      var y2a = g + Math.round(gh * 0.42), y2b = g + Math.round(gh * 0.52);
      marketStall(u, c, Math.round(W * 0.06), y2a, 1.1, '#6e4a2c', '#1f4fa0', '#e8be48', '#e07840');
      wellProp(u, c, Math.round(W * 0.15), y2b, 1.1, '#b89a64', '#e4c890', '#7a5c34', '#6e4a2c');
      fieldRows(u, c, Math.round(W * 0.20), y2a - 2, 16, 3, 1.0, '#8c6e42', '#58a256');
      steleProp(u, c, Math.round(W * 0.31), y2b, 1.1, '#1f4fa0', '#4a88e0', '#122e66');
      crateStack(u, c, Math.round(W * 0.69), y2b, 1.1, '#7a5230', '#a87c50', '#4e341e', '#1f4fa0');
      bush(u, c, Math.round(W * 0.76), y2a, 1.2, '#366838', '#4e8a4e', '#78b46e');
      palmTree(u, c, Math.round(W * 0.94), y2b, sz(G, 0.16), 0);
      // Şerit 3 (ön, 2x büyük)
      var fy3 = g + Math.round(gh * 0.78);
      amphora(u, c, Math.round(W * 0.05), fy3 + 2, 2.2, '#b86840', '#e09468');
      crateStack(u, c, Math.round(W * 0.11), fy3 + 2, 1.9, '#7a5230', '#a87c50', '#4e341e', '#d8b040');
      bush(u, c, Math.round(W * 0.18), fy3 + 1, 2.2, '#366838', '#4e8a4e', '#78b46e');
      marketStall(u, c, Math.round(W * 0.26), fy3 + 1, 1.8, '#6e4a2c', '#1f4fa0', '#e8be48', '#e07840');
      rockProp(u, c, Math.round(W * 0.33), fy3 + 2, 2.2, '#9a7a48', '#d2ae74', '#5c4424');
      bush(u, c, Math.round(W * 0.69), fy3 + 1, 2.2, '#366838', '#4e8a4e', '#78b46e');
      wellProp(u, c, Math.round(W * 0.76), fy3 + 1, 1.8, '#b89a64', '#e4c890', '#7a5c34', '#6e4a2c');
      amphora(u, c, Math.round(W * 0.83), fy3 + 2, 2.2, '#1f4fa0', '#4a88e0');
      rockProp(u, c, Math.round(W * 0.90), fy3 + 2, 2.4, '#9a7a48', '#d2ae74', '#5c4424');
      steleProp(u, c, Math.round(W * 0.95), fy3 + 1, 1.9, '#1f4fa0', '#f0c850', '#122e66');

      return {
        g: g, gh: gh, wfX: wfX, wfY0: wfY0, wfH: rh - 5,
        palmX: rx - Math.round(rw * 0.16), palmTop: rb - rh - sz(G, 0.16),
        flagX: lx - Math.floor(iw / 2) + 3, flagY: ib - ih - 8,
        cloudsFar: u.makeClouds(u.rng(143), 3, W, H, 0.04, 0.14),
        clouds: u.makeClouds(u.rng(142), 4, W, H, 0.10, 0.24)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.cloudsFar, t * 0.35, G.W, ['#402e5a', '#7c486e', '#c46c56', '#f0aa70']);
      u.drawClouds(c, st.clouds, t * 0.65, G.W, ['#523c6c', '#985c7e', '#e2865a', '#ffcf80']);
      // Şelale
      var off = Math.floor(t * 8) % 4;
      u.px(c, st.wfX, st.wfY0, 2, st.wfH, '#4a98c8');
      for (var y = st.wfY0 + off; y < st.wfY0 + st.wfH; y += 4) {
        u.px(c, st.wfX, y, 2, 2, '#c8f0ff');
      }
      // Sancak
      var fl = Math.floor(t * 4) % 2;
      u.px(c, st.flagX, st.flagY, 1, 6, '#d8b040');
      u.px(c, st.flagX + 1, st.flagY + fl, 4, 2, '#e8be48');
      // Tören / ticaret kervanı (sol şerit 2, büyük)
      var cx = Math.round(((G.W * 0.10 + t * 7) % (G.W * 0.22)) + G.W * 0.05);
      drawCart(u, c, cx, st.g + Math.round(st.gh * 0.64), 1.5, '#8c5a32', '#d8b040', '#a87848', Math.floor(t * 6) % 2);
      // Yürüyen Babil rahibi/vatandaşı (sağ şerit 2, büyük)
      var px0 = Math.round(G.W * 0.86 - ((t * 5) % (G.W * 0.16)));
      drawPerson(u, c, px0, st.g + Math.round(st.gh * 0.60), 1.5, '#1f4fa0', '#f0c850', Math.floor(t * 4) % 2);
      var sw = Math.floor(t * 2) % 2 ? 1 : -1;
      u.px(c, st.palmX + 6 + sw, st.palmTop + 2, 2, 1, '#58a256');
      u.birds(c, t, G.W, G.H, 4, '#2b2a5a', 0.22);
    }
  });

  /* ================= A6: atina — ATİNA AKROPOLİS (-500 – -331) ================= */
  S.register('atina', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(151);
      u.bands(c, ['#3572be', '#82b8e6', '#f4f0e4'], 0, g, W, 12);
      var sunX = Math.round(W * 0.5), sunY = Math.round(H * 0.19);
      u.sun(c, sunX, sunY, 12, ['#ffd880', '#fff0b8', '#ffffff'], g);
      skyRays(u, c, sunX, sunY, g, '#fff2c4', R);

      u.profile(c, 0, W, function (x) { return g - 8 - 5 * Math.sin(x / 37) - 3 * Math.sin(x / 13); }, g, '#94abc0', '#b8cce0');
      horizonSettlement(u, c, W, g, R, '#98adc2', '#7e90a4', '#d88864', 'greek');

      // Zemin + 3 şerit perspektif doku
      u.bands(c, ['#f0ead8', '#d8d0c0', '#a09886'], g, H, W, 7);
      groundTexture(u, c, W, H, g, R, { far: '#d4d0c8', midHi: '#faf4e6', midSh: '#b4ac9c', foreSh: '#7c7464' });

      // Sol: DİK VE DOKULU Akropolis kayası + büyük 8 sütunlu Parthenon + Propylaia
      var lx = xl(G, 0.50), rockW = sz(G, 0.42), rockH = sz(G, 0.26);
      var lb = g + 4, rockTop = lb - rockH;
      u.profile(c, Math.max(0, lx - Math.floor(rockW * 0.62)), lx + Math.floor(rockW * 0.62), function (x) {
        var d = Math.abs(x - lx) / (rockW * 0.5);
        var y = d < 0.78 ? rockTop + Math.sin(x / 4) * 1.5 : rockTop + (d - 0.78) * rockH * 4.8;
        return Math.min(lb + 2, y);
      }, lb + 2, '#6c6458', '#a69e90');
      // Kaya yarıkları, katmanlar ve dikey çatlak dokusu
      for (var ry0 = rockTop + 3; ry0 < lb - 2; ry0 += 5) {
        for (var rx0 = lx - Math.floor(rockW * 0.40); rx0 < lx + Math.floor(rockW * 0.36); rx0 += 7) {
          if (R() < 0.75) {
            stoneBlock(u, c, rx0 + (ry0 % 3), ry0, 6, 4, '#7e7668', '#a49b8c', '#4c463e', R);
          }
        }
      }
      // Kaya eteğinde çalılar
      bush(u, c, lx - Math.floor(rockW * 0.46), lb + 1, 1.0, '#445224', '#5c6c34', '#84964e');

      // Büyük Parthenon
      var pw = sz(G, 0.36), ph = sz(G, 0.22);
      var pBase = rockTop + 1;
      var colH = Math.round(ph * 0.60), pedH = Math.round(ph * 0.24);
      var entY = pBase - 3 - colH - 3;
      u.px(c, lx - Math.floor(pw / 2) - 2, pBase - 3, pw + 4, 3, '#d9c9a8');
      u.px(c, lx - Math.floor(pw / 2) - 1, pBase - 4, pw + 2, 1, '#ffffff');
      u.px(c, lx - Math.floor(pw * 0.38), entY + 3, Math.round(pw * 0.76), colH, '#b8a88c');
      for (var ci = 0; ci < 8; ci++) {
        var cx = Math.round(lx - pw / 2 + 2 + ci * (pw - 6) / 7);
        u.px(c, cx, entY + 3, 2, colH, '#f4f0e4');
        u.px(c, cx + 1, entY + 3, 1, colH, '#d9c9a8');
      }
      u.px(c, lx - Math.floor(pw / 2), entY, pw, 3, '#f4f0e4');
      u.px(c, lx - Math.floor(pw / 2), entY + 2, pw, 1, '#c8b89a');
      u.poly(c, [[lx - Math.floor(pw / 2) - 2, entY], [lx, entY - pedH], [lx + Math.floor(pw / 2) + 2, entY]], '#f4f0e4');
      u.poly(c, [[lx - Math.floor(pw / 2) + 3, entY - 1], [lx, entY - Math.round(pedH * 0.72)], [lx + Math.floor(pw / 2) - 3, entY - 1]], '#d9c9a8');

      // Propylaia
      var prX = lx + Math.floor(rockW * 0.42), prY = lb - 1;
      u.px(c, prX - 8, prY - 9, 16, 2, '#f4f0e4');
      for (var pi = 0; pi < 4; pi++) {
        u.px(c, prX - 6 + pi * 4, prY - 7, 2, 7, '#f4f0e4');
      }

      // Sağ: Pire limanı (deniz, taş iskele, bağlı gemiler, Yunan liman evleri) + Agora stoası + zeytin ağaçları
      var seaX = Math.round(W * 0.66), seaY = g - 7;
      u.px(c, seaX, seaY, W - seaX, 8, '#3a72a8');
      u.px(c, seaX, seaY, W - seaX, 1, '#a8d4f0');
      u.px(c, seaX + 4, seaY + 4, W - seaX - 4, 2, '#2d5c8a');
      // Taş iskele / rıhtım
      u.px(c, seaX + 2, seaY + 5, W - seaX - 2, 3, '#c8c0b0');
      u.px(c, seaX + 2, seaY + 5, W - seaX - 2, 1, '#f4f0e4');
      for (var mp = seaX + 8; mp < W - 4; mp += 16) {
        u.px(c, mp, seaY + 3, 2, 3, '#7a7264');
      }
      // Limanda demirli Yunan ticaret/savaş gemileri
      var moored = [Math.round(W * 0.72), Math.round(W * 0.90)];
      for (var mi = 0; mi < moored.length; mi++) {
        var mx0 = moored[mi], my0 = seaY + 2;
        u.px(c, mx0, my0, 14, 3, '#6a4428');
        u.px(c, mx0 - 1, my0 - 1, 2, 2, '#8c5e3a');
        u.px(c, mx0 + 13, my0 - 1, 2, 2, '#d8b040');
        u.px(c, mx0 + 6, my0 - 9, 1, 9, '#5a3a24');
        u.px(c, mx0 + 2, my0 - 8, 9, 5, mi ? '#f4f0e4' : '#e0c8a0');
        u.px(c, mx0 + 3, my0 - 6, 7, 1, '#3572be');
      }
      // Liman çevresi Yunan evleri (kiremit çatı + beyaz duvar)
      var hPos = [Math.round(W * 0.68), Math.round(W * 0.78), Math.round(W * 0.93)];
      for (var hi = 0; hi < hPos.length; hi++) {
        var hx0 = hPos[hi], hw = 11 + (hi % 2) * 3, hh = 8 + (hi % 2) * 2;
        u.px(c, hx0, seaY + 5 - hh, hw, hh, '#f0ead8');
        u.px(c, hx0 - 1, seaY + 5 - hh - 3, hw + 2, 3, '#c8704a');
        u.px(c, hx0 + 3, seaY + 5 - 4, 2, 4, '#5a442c');
        u.px(c, hx0 + hw - 4, seaY + 5 - hh + 2, 2, 2, '#3a4a5a');
      }

      var sx = xr(G, 0.56), sw = sz(G, 0.30), sb = g + 5;
      u.px(c, sx - Math.floor(sw / 2), sb - 11, sw, 2, '#c8805a');
      u.px(c, sx - Math.floor(sw / 2) - 1, sb - 9, sw + 2, 2, '#f4f0e4');
      u.px(c, sx - Math.floor(sw / 2) + 1, sb - 7, sw - 2, 7, '#a8987c');
      for (var si = 0; si < 6; si++) {
        u.px(c, Math.round(sx - sw / 2 + 1 + si * (sw - 3) / 5), sb - 7, 1, 7, '#f4f0e4');
      }
      oliveTree(u, c, xr(G, 0.05), g + 7, sz(G, 0.16), R);
      oliveTree(u, c, xr(G, 0.25), g + 8, sz(G, 0.14), R);
      oliveTree(u, c, xr(G, 0.86), g + 7, sz(G, 0.16), R);

      // 3 Şeritli zemin dolgusu (kenarlar %0-35 ve %65-100 yoğun, alt şerit 2x büyük, bol zeytin ağacı & tezgah)
      var gh = Math.max(20, H - g - 10);
      // Şerit 1 (ufka yakın: küçük ama çok sayıda soluk nesne)
      var s1X = [0.04, 0.11, 0.18, 0.25, 0.32, 0.39, 0.45, 0.51, 0.57, 0.63, 0.69, 0.76, 0.84, 0.92];
      for (var s1 = 0; s1 < s1X.length; s1++) {
        var px1 = Math.round(W * s1X[s1]), py1 = g + Math.round(gh * (0.09 + (s1 % 3) * 0.05));
        if (s1 % 4 === 0) rockProp(u, c, px1, py1, 0.55, '#b8b0a0', '#e0d8c8', '#8a8274');
        else if (s1 % 4 === 1) cypressTree(u, c, px1, py1, 7);
        else if (s1 % 4 === 2) bush(u, c, px1, py1, 0.5, '#647244', '#7e8c54', '#9aa86c');
        else grassTuft(u, c, px1, py1, 0.6, '#7a8450', '#9ea86e');
      }
      // Şerit 2 (orta)
      var y2a = g + Math.round(gh * 0.42), y2b = g + Math.round(gh * 0.52);
      marketStall(u, c, Math.round(W * 0.06), y2a, 1.1, '#6a543c', '#c8704a', '#f4f0e4', '#d8a848');
      oliveTree(u, c, Math.round(W * 0.14), y2b, sz(G, 0.13), R);
      wellProp(u, c, Math.round(W * 0.21), y2a, 1.1, '#c8c0b0', '#f4f0e4', '#8a8274', '#6a543c');
      marketStall(u, c, Math.round(W * 0.29), y2b, 1.1, '#6a543c', '#3572be', '#f4f0e4', '#e09840');
      oliveTree(u, c, Math.round(W * 0.69), y2a, sz(G, 0.13), R);
      crateStack(u, c, Math.round(W * 0.76), y2b, 1.1, '#8c6e4e', '#b89872', '#5a442c', '#b86840');
      marketStall(u, c, Math.round(W * 0.90), y2a, 1.1, '#6a543c', '#c8704a', '#f4f0e4', '#d8a848');
      // Şerit 3 (ön, 2x büyük)
      var fy3 = g + Math.round(gh * 0.78);
      amphora(u, c, Math.round(W * 0.05), fy3 + 2, 2.2, '#b86840', '#e09468');
      marketStall(u, c, Math.round(W * 0.12), fy3 + 1, 1.8, '#6a543c', '#3572be', '#f4f0e4', '#d8a848');
      rockProp(u, c, Math.round(W * 0.20), fy3 + 2, 2.3, '#b8b0a0', '#ebe4d4', '#7a7264');
      oliveTree(u, c, Math.round(W * 0.27), fy3 + 2, sz(G, 0.18), R);
      bush(u, c, Math.round(W * 0.33), fy3 + 1, 2.1, '#445224', '#5c6c34', '#84964e');
      oliveTree(u, c, Math.round(W * 0.68), fy3 + 2, sz(G, 0.17), R);
      marketStall(u, c, Math.round(W * 0.76), fy3 + 1, 1.9, '#6a543c', '#3572be', '#f4f0e4', '#d8a848');
      crateStack(u, c, Math.round(W * 0.84), fy3 + 2, 1.9, '#8c6e4e', '#b89872', '#5a442c', '#b86840');
      amphora(u, c, Math.round(W * 0.90), fy3 + 2, 2.2, '#b86840', '#e09468');
      cypressTree(u, c, Math.round(W * 0.95), fy3 + 2, 20);

      return {
        g: g, gh: gh, seaX: seaX, seaY: seaY + 3,
        flagX: sx - Math.floor(sw / 2) + 2, flagY: sb - 17,
        cloudsFar: u.makeClouds(u.rng(153), 3, W, H, 0.04, 0.14),
        clouds: u.makeClouds(u.rng(152), 4, W, H, 0.10, 0.25)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.cloudsFar, t * 0.35, G.W, ['#78a4d0', '#b0d2ec', '#e2f0fa', '#ffffff']);
      u.drawClouds(c, st.clouds, t * 0.7, G.W, ['#8fb8dc', '#c6e0f4', '#edf6fc', '#ffffff']);
      // Agora sancağı
      var fl = Math.floor(t * 4) % 2;
      u.px(c, st.flagX, st.flagY, 1, 6, '#6a543c');
      u.px(c, st.flagX + 1, st.flagY + fl, 4, 2, '#3572be');
      // Pire limanında trireme + 2 kare kürek
      var span = (G.W - st.seaX) + 16;
      var tx = st.seaX + Math.round((t * 5) % span) - 8;
      if (tx > st.seaX - 4 && tx < G.W - 2) {
        var row = Math.floor(t * 5) % 2;
        u.px(c, tx, st.seaY, 12, 2, '#6a4428');
        u.px(c, tx + 11, st.seaY + 1, 2, 1, '#d8b040');
        u.px(c, tx + 5, st.seaY - 6, 1, 6, '#5a3a24');
        u.px(c, tx + 3, st.seaY - 5, 5, 3, '#f4f0e4');
        for (var o = 0; o < 4; o++) {
          u.px(c, tx + 2 + o * 2, st.seaY + 2, 1, row ? 2 : 1, '#c8b08a');
        }
      }
      // Atina yük arabası (sol şerit 2, büyük)
      var cx = Math.round(((G.W * 0.10 + t * 7) % (G.W * 0.22)) + G.W * 0.05);
      drawCart(u, c, cx, st.g + Math.round(st.gh * 0.64), 1.5, '#8c6e4e', '#5a442c', '#9c7c58', Math.floor(t * 6) % 2);
      // Yürüyen Atinalı vatandaş (sağ şerit 2, büyük)
      var px0 = Math.round(G.W * 0.86 - ((t * 5) % (G.W * 0.16)));
      drawPerson(u, c, px0, st.g + Math.round(st.gh * 0.60), 1.5, '#f4f0e4', '#c8805a', Math.floor(t * 4) % 2);
      u.birds(c, t, G.W, G.H, 4, '#3d7cc9', 0.22);
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
