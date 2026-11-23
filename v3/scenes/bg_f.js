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

  function skyRays(u, c, sx, sy, g, col, R) {
    var dirs = [-0.85, -0.45, 0.45, 0.85];
    for (var d = 0; d < dirs.length; d++) {
      var dx = dirs[d];
      for (var k = 14; k < 52; k += 2) {
        var rx = Math.round(sx + dx * k);
        var ry = Math.round(sy + k * 0.35);
        if (ry < g - 4 && (!R || R() < 0.7)) {
          u.px(c, rx, ry, 2, 1, col);
        }
      }
    }
  }

  function horizonSettlement(u, c, W, g, R, farCol, nearCol, hiCol, winCol, type) {
    var x, h, w;
    for (x = 2; x < W - 4; x += 5 + Math.floor(R() * 6)) {
      if (x > W * 0.36 && x < W * 0.64 && R() < 0.35) continue;
      h = 4 + Math.floor(R() * 8);
      w = 4 + Math.floor(R() * 6);
      if (type === 'mesa') {
        u.poly(c, [[x, g], [x + 2, g - h], [x + w - 2, g - h], [x + w, g]], farCol);
      } else {
        u.px(c, x, g - h, w, h, farCol);
        if (type === 'skyline' && R() < 0.4) {
          u.px(c, x + Math.floor(w / 2), g - h - 3, 1, 3, farCol);
        }
      }
    }
    for (x = 2; x < W - 6; x += 7 + Math.floor(R() * 7)) {
      if (x > W * 0.35 && x < W * 0.65) continue;
      h = 5 + Math.floor(R() * 10);
      w = 5 + Math.floor(R() * 7);
      if (type === 'mesa') {
        u.poly(c, [[x, g + 1], [x + 2, g - h], [x + w - 2, g - h], [x + w, g + 1]], nearCol);
        u.px(c, x + 2, g - h, Math.max(1, w - 4), 1, hiCol);
      } else {
        u.px(c, x, g - h, w, h + 1, nearCol);
        u.px(c, x, g - h, w, 1, hiCol);
        if (winCol && h > 5) {
          for (var wy = g - h + 2; wy < g - 2; wy += 3) {
            if (R() < 0.65) u.px(c, x + 1, wy, 1, 1, winCol);
            if (w > 5 && R() < 0.65) u.px(c, x + w - 3, wy, 1, 1, winCol);
          }
        }
      }
    }
  }

  /* 3 şeritli perspektif zemin dokusu (orta bant sakin, kenarlar zengin) */
  function groundTexture(u, c, W, H, g, R, pal) {
    var gh = Math.max(20, H - g - 10);
    for (var i = 0; i < 54; i++) {
      var x1 = Math.floor(R() * W);
      var y1 = g + 2 + Math.floor(R() * gh * 0.24);
      u.px(c, x1, y1, 2 + Math.floor(R() * 4), 1, pal.far);
    }
    for (var j = 0; j < 110; j++) {
      var side = R() < 0.5 ? R() * 0.35 : (0.65 + R() * 0.35);
      var x2 = Math.floor(side * W);
      var frac = 0.22 + R() * 0.68;
      var y2 = g + Math.floor(frac * gh);
      var len = Math.max(3, Math.round(3 + frac * 9));
      var col = R() < 0.52 ? pal.midHi : pal.midSh;
      u.px(c, x2, y2, len, 1, col);
      if (frac > 0.50 && R() < 0.55) {
        u.px(c, x2 + 1, y2 + 1, Math.max(2, len - 2), 1, pal.foreSh);
      }
    }
    for (var m = 0; m < 10; m++) {
      var xm = Math.floor((0.37 + R() * 0.26) * W);
      var ym = g + Math.floor((0.20 + R() * 0.60) * gh);
      u.px(c, xm, ym, 4, 1, pal.far);
    }
  }

  /* Şehir / meydan / yol dokusu: kaldırım derzleri, bordür, şerit çizgisi, çatlak, su birikintisi, yaprak/çöp */
  function urbanGround(u, c, W, H, g, R, pal) {
    var gh = Math.max(20, H - g - 10);
    // Üst kaldırım / meydan kenarı + bordür
    var swH = Math.round(gh * 0.16);
    u.px(c, 0, g, W, swH, pal.walk);
    u.px(c, 0, g + swH, W, 1, pal.curbHi);
    u.px(c, 0, g + swH + 1, W, 1, pal.curbSh);
    for (var sx = 4; sx < W; sx += 16) {
      u.px(c, sx, g + 1, 1, swH - 1, pal.joint);
    }
    // Alt ön kaldırım kenarı (kenarlarda, orta sakin)
    var fgY = g + Math.round(gh * 0.64);
    var fgH = Math.max(8, Math.round(gh * 0.28));
    u.px(c, 0, fgY, Math.round(W * 0.36), fgH, pal.walkFore);
    u.px(c, Math.round(W * 0.64), fgY, Math.round(W * 0.36), fgH, pal.walkFore);
    u.px(c, 0, fgY, Math.round(W * 0.36), 1, pal.curbHi);
    u.px(c, Math.round(W * 0.64), fgY, Math.round(W * 0.36), 1, pal.curbHi);
    for (var fx = 6; fx < W; fx += 22) {
      if (fx > W * 0.35 && fx < W * 0.65) continue;
      u.px(c, fx, fgY + 1, 1, fgH - 2, pal.joint);
    }
    // Yol şerit çizgisi (kesikli)
    var laneY = g + Math.round(gh * 0.36);
    for (var lx = 6; lx < W - 8; lx += 22) {
      if (lx > W * 0.36 && lx < W * 0.62) continue;
      u.px(c, lx, laneY, 10, 1, pal.lane);
    }
    // Su birikintileri + yansıma (kenarlarda)
    for (var p = 0; p < 6; p++) {
      var pSide = p < 3 ? (0.04 + R() * 0.27) : (0.68 + R() * 0.27);
      var px = Math.round(pSide * W);
      var py = g + Math.round((0.26 + R() * 0.56) * gh);
      var pw = 10 + Math.floor(R() * 12);
      u.px(c, px, py, pw, 2, pal.puddle);
      u.px(c, px + 2, py, Math.max(3, Math.floor(pw * 0.5)), 1, pal.puddleHi);
    }
    // Asfalt çatlakları ve yaprak/çöp lekeleri (kenarlarda)
    for (var cr = 0; cr < 14; cr++) {
      var cSide = cr < 7 ? R() * 0.34 : (0.66 + R() * 0.34);
      var cx = Math.round(cSide * W);
      var cy = g + Math.round((0.20 + R() * 0.66) * gh);
      u.px(c, cx, cy, 4, 1, pal.crack);
      u.px(c, cx + 3, cy + 1, 4, 1, pal.crack);
      u.px(c, cx + 6, cy + 2, 3, 1, pal.crack);
    }
    for (var lf = 0; lf < 26; lf++) {
      var lSide = lf < 13 ? R() * 0.35 : (0.65 + R() * 0.35);
      u.px(c, Math.round(lSide * W), g + Math.round((0.18 + R() * 0.70) * gh), 2, 1, lf % 2 ? pal.litter1 : pal.litter2);
    }
  }

  function palmTree(u, c, x, base, h) {
    var i, lean = h > 24 ? 3 : 2;
    var tw = h > 24 ? 3 : 2;
    for (i = 0; i < h; i++) {
      u.px(c, x + Math.round(Math.sin(i / h * 1.3) * lean), base - i, tw, 1, i % 3 ? '#6a4a34' : '#4e3424');
    }
    var tx = x + Math.round(Math.sin(1.3) * lean), ty = base - h;
    var dirs = [[-1, -0.25], [-1, 0.45], [1, -0.25], [1, 0.45], [-0.45, -1], [0.45, -1], [-0.8, 0.1], [0.8, 0.1]];
    var fLen = h > 24 ? 12 : 8;
    for (var d = 0; d < dirs.length; d++) {
      for (var k = 0; k < fLen; k++) {
        u.px(c, tx + Math.round(dirs[d][0] * k), ty + Math.round(dirs[d][1] * k + k * k * 0.05), 2, 2, k % 2 ? '#468852' : '#2c5e38');
      }
    }
  }

  function cityTree(u, c, x, base, h, trunkCol, darkCol, midCol, hiCol) {
    var tw = Math.max(2, Math.round(h * 0.13));
    var th = Math.round(h * 0.48);
    u.px(c, x - Math.floor(tw / 2), base - th, tw, th, trunkCol);
    var r = Math.max(4, Math.round(h * 0.36));
    var cy = base - Math.round(h * 0.70);
    u.circle(c, x, cy, r, darkCol);
    u.circle(c, x - Math.max(1, Math.round(r * 0.38)), cy - 1, Math.max(2, Math.round(r * 0.72)), midCol);
    u.circle(c, x + Math.max(1, Math.round(r * 0.30)), cy - Math.round(r * 0.2), Math.max(2, Math.round(r * 0.5)), hiCol);
  }

  function cypressTree(u, c, x, base, h, darkCol, hiCol) {
    for (var i = 0; i < h; i++) {
      var w = Math.max(1, Math.round(Math.sin(i / h * Math.PI) * Math.max(2, h * 0.16)));
      u.px(c, x - w, base - i, w * 2 + 1, 1, i % 4 ? darkCol : hiCol);
    }
  }

  function bush(u, c, x, y, sc, darkCol, midCol, hiCol) {
    var r = Math.max(2, Math.round(3 * sc));
    u.circle(c, x, y - r + 1, r, darkCol);
    u.circle(c, x - Math.max(1, Math.round(r * 0.45)), y - r + 1, Math.max(1, Math.round(r * 0.68)), midCol);
    u.px(c, x - Math.floor(r * 0.5), y - r * 2 + 2, Math.max(2, r), 2, hiCol);
  }

  function grassTuft(u, c, x, y, sc, col1, col2) {
    var h = Math.max(2, Math.round(3 * sc));
    var w = sc > 1.5 ? 2 : 1;
    u.px(c, x, y - h, w, h, col1);
    u.px(c, x - w - 1, y - h + 1, w, Math.max(1, h - 1), col2);
    u.px(c, x + w + 1, y - h + 1, w, Math.max(1, h - 1), col1);
  }

  function rockProp(u, c, x, y, sc, baseCol, hiCol, shCol) {
    var w = Math.max(3, Math.round(6 * sc));
    var h = Math.max(2, Math.round(3.5 * sc));
    u.px(c, x - Math.floor(w / 2), y - h, w, h, baseCol);
    u.px(c, x - Math.floor(w / 2) + 2, y - h - Math.max(1, Math.round(sc)), Math.max(2, w - 4), Math.max(1, Math.round(sc)), hiCol);
    u.px(c, x - Math.floor(w / 2), y - 2, w, 2, shCol);
  }

  function benchProp(u, c, x, y, sc, woodCol, legCol) {
    var w = Math.max(6, Math.round(10 * sc));
    var h = Math.max(3, Math.round(4.5 * sc));
    var x0 = x - Math.floor(w / 2);
    var lw = sc > 1.8 ? 2 : 1;
    u.px(c, x0 + 2, y - Math.round(h * 0.5), lw, Math.round(h * 0.5), legCol);
    u.px(c, x0 + w - 2 - lw, y - Math.round(h * 0.5), lw, Math.round(h * 0.5), legCol);
    u.px(c, x0, y - Math.round(h * 0.55), w, Math.max(1, Math.round(sc * 0.6)), woodCol);
    u.px(c, x0, y - h, w, Math.max(2, Math.round(sc * 0.9)), woodCol);
  }

  function streetLamp(u, c, x, y, sc, poleCol, glowCol, isLit) {
    var h = Math.max(6, Math.round(11 * sc));
    var pw = sc > 2.0 ? 2 : 1;
    u.px(c, x, y - h, pw, h, poleCol);
    if (sc > 2.0) u.px(c, x - 1, y - 3, 4, 3, poleCol);
    u.px(c, x - 2, y - h, 6, Math.max(1, Math.round(sc * 0.5)), poleCol);
    u.px(c, x - 2, y - h - 2, 5, 2, glowCol);
    if (isLit) {
      u.px(c, x - 4, y - h + 1, 9, 2, 'rgba(255,228,160,0.32)');
      u.px(c, x - 6, y - h + 3, 13, 3, 'rgba(255,228,160,0.16)');
    }
  }

  function fenceSeg(u, c, x, y, len, sc, col, hiCol) {
    var h = Math.max(3, Math.round(4.5 * sc));
    var step = Math.max(3, Math.round(4.5 * sc));
    var pw = sc > 1.6 ? 2 : 1;
    for (var fx = x; fx < x + len; fx += step) {
      u.px(c, fx, y - h, pw, h, col);
      u.px(c, fx, y - h, pw, 1, hiCol);
    }
    u.px(c, x, y - Math.round(h * 0.65), len, 2, hiCol);
  }

  function stallProp(u, c, x, y, sc, woodCol, roof1, roof2, goodsCol) {
    var w = Math.max(10, Math.round(14 * sc));
    var h = Math.max(7, Math.round(10 * sc));
    var x0 = x - Math.floor(w / 2);
    var pw = sc > 1.6 ? 2 : 1;
    u.px(c, x0 + 1, y - h, pw, h, woodCol);
    u.px(c, x0 + w - 2 - pw, y - h, pw, h, woodCol);
    u.px(c, x0 + 1, y - Math.round(h * 0.42), w - 2, Math.round(h * 0.42), woodCol);
    for (var i = 0; i < w; i += 3) {
      u.px(c, x0 + i, y - h - 3, 3, 4, (i % 6 === 0) ? roof1 : roof2);
    }
    u.px(c, x0 + 4, y - Math.round(h * 0.42) - 3, Math.max(3, Math.round(3 * sc)), 3, goodsCol);
    u.px(c, x0 + w - 8, y - Math.round(h * 0.42) - 3, Math.max(3, Math.round(3 * sc)), 3, roof2);
  }

  function crateProp(u, c, x, y, sc, col, hiCol, shCol) {
    var s = Math.max(3, Math.round(4.5 * sc));
    u.px(c, x - s, y - s, s, s, col);
    u.px(c, x - s, y - s, s, 2, hiCol);
    u.px(c, x, y - s, s, s, shCol);
    u.px(c, x - Math.floor(s * 0.5), y - s * 2 + 1, s, s - 1, col);
    u.px(c, x - Math.floor(s * 0.5), y - s * 2 + 1, s, 2, hiCol);
  }

  function drawCar(u, c, x, y, sc, bodyCol, roofCol, winCol, lightCol, dir) {
    var w = Math.max(7, Math.round(12 * sc));
    var h = Math.max(2, Math.round(3.5 * sc));
    var rw = Math.max(4, Math.round(7 * sc));
    var rh = Math.max(2, Math.round(2.5 * sc));
    var rx = x + Math.round((w - rw) * 0.5);
    var wr = Math.max(2, Math.round(2 * sc));
    u.px(c, x, y - h - wr + 1, w, h, bodyCol);
    u.px(c, rx, y - h - rh - wr + 1, rw, rh, roofCol);
    u.px(c, rx + 2, y - h - rh - wr + 2, Math.max(2, rw - 4), Math.max(1, rh - 2), winCol);
    u.px(c, x + Math.max(1, Math.round(2 * sc)), y - wr, wr, wr, '#161a24');
    u.px(c, x + w - Math.max(3, Math.round(4 * sc)), y - wr, wr, wr, '#161a24');
    if (dir >= 0) {
      u.px(c, x + w - 2, y - h - wr + 2, 3, 2, lightCol);
      u.px(c, x, y - h - wr + 2, 2, 2, '#e84a3a');
    } else {
      u.px(c, x - 1, y - h - wr + 2, 3, 2, lightCol);
      u.px(c, x + w - 2, y - h - wr + 2, 2, 2, '#e84a3a');
    }
  }

  function drawPerson(u, c, x, y, sc, bodyCol, headCol, walkPh, prop) {
    var h = Math.max(4, Math.round(6 * sc));
    var w = Math.max(2, Math.round(2 * sc));
    var hs = Math.max(2, Math.round(2 * sc));
    u.px(c, x, y - h - hs, w, hs, headCol);
    u.px(c, x, y - h, w, Math.max(2, h - 2), bodyCol);
    u.px(c, x + (walkPh ? 1 : 0), y - 3, Math.max(1, Math.floor(w * 0.5)), 3, bodyCol);
    u.px(c, x + (walkPh ? 0 : Math.max(1, Math.floor(w * 0.5))), y - 3, Math.max(1, Math.floor(w * 0.5)), 3, headCol);
    if (prop === 'flag') {
      u.px(c, x + w, y - h - hs - 3, 1, h + hs, headCol);
      u.px(c, x + w + 1, y - h - hs - 3, 4, 3, '#e85a3a');
    } else if (prop === 'bag') {
      u.px(c, x - 2, y - Math.round(h * 0.55), 2, 3, '#c89858');
    }
  }

  function drawCyclist(u, c, x, y, sc, bikeCol, shirtCol, headCol) {
    var r = Math.max(2, Math.round(2.5 * sc));
    u.px(c, x, y - r, r, r, '#1a222a');
    u.px(c, x + Math.round(5.5 * sc), y - r, r, r, '#1a222a');
    u.px(c, x + 1, y - r - 1, Math.round(5.5 * sc), 1, bikeCol);
    u.px(c, x + Math.round(2 * sc), y - r - Math.round(3.5 * sc), Math.max(2, Math.round(2.5 * sc)), Math.round(3 * sc), shirtCol);
    u.px(c, x + Math.round(2.5 * sc), y - r - Math.round(5.5 * sc), 3, 3, headCol);
  }

  function drawCamel(u, c, x, y, sc, bodyCol, shCol, saddleCol, walkPh) {
    var bw = Math.max(5, Math.round(7 * sc));
    var bh = Math.max(3, Math.round(4 * sc));
    u.px(c, x, y - bh - 3, bw, bh, bodyCol);
    u.px(c, x + Math.floor(bw * 0.25), y - bh - 6, Math.max(3, Math.floor(bw * 0.4)), 3, saddleCol);
    u.px(c, x + bw - 2, y - bh - 7, 3, 7, bodyCol);
    u.px(c, x + bw, y - bh - 8, 4, 3, shCol);
    u.px(c, x + (walkPh ? 2 : 0), y - 3, 2, 3, shCol);
    u.px(c, x + bw - 2 - (walkPh ? 2 : 0), y - 3, 2, 3, bodyCol);
  }

  /* ================= berlin_duvari — BERLİN DUVARI (1985 – 1991) ================= */
  S.register('berlin_duvari', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(601);
      u.bands(c, ['#0e1424', '#1a2238', '#2a3854', '#3a4a6a'], 0, g, W, 10);
      u.stars(c, R, 34, W, Math.round(g * 0.62), '#e8e8f0');
      var moonX = Math.round(W * 0.5), moonY = Math.round(H * 0.14);
      u.circle(c, moonX, moonY, 8, 'rgba(232,232,240,0.16)');
      u.circle(c, moonX, moonY, 5, '#e8e8f0');
      u.circle(c, moonX + 2, moonY - 1, 4, '#1a2238');
      skyRays(u, c, moonX, moonY, g, 'rgba(200,216,240,0.22)', R);

      u.profile(c, 0, W, function (x) {
        return g - 7 - 4 * Math.sin(x / 31) - (Math.sin(x / 7) > 0.5 ? 4 : 0);
      }, g, '#222c44', '#3a4a6a');
      horizonSettlement(u, c, W, g, R, '#242e48', '#182034', '#465878', '#f0c870', 'city');

      var tvx = xr(G, 0.12), tvh = sz(G, 0.48), tvTop = g - tvh;
      u.px(c, tvx - 1, tvTop + Math.round(tvh * 0.25), 2, Math.round(tvh * 0.75), '#4a5a78');
      u.px(c, tvx, tvTop, 1, Math.round(tvh * 0.25), '#8a9ab0');
      u.px(c, tvx, tvTop, 1, 2, '#e85a3a');
      u.circle(c, tvx, tvTop + Math.round(tvh * 0.28), Math.max(3, Math.round(tvh * 0.08)), '#6a7a98');
      u.px(c, tvx - 1, tvTop + Math.round(tvh * 0.26), 2, 1, '#e8e8f0');

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
      var qy = bTop - 4;
      for (var q = -2; q <= 1; q++) {
        var qx = bx + q * 4;
        u.px(c, qx, qy - 3, 3, 3, '#c8d4e0');
        u.px(c, qx + 2, qy - 5, 1, 2, '#e8e8f0');
      }
      u.px(c, bx - 1, qy - 7, 2, 4, '#e8e8f0');

      // Sağ: Berlin Duvarı (gerçek grafiti panoları, derzler, çatlaklar + gözetleme kulesi)
      var wx0 = xr(G, 0.10), ww = sz(G, 0.44), wh = sz(G, 0.17), wy = g - wh;
      u.px(c, wx0, wy, ww, wh, '#687282');
      u.px(c, wx0 - 1, wy - 2, ww + 2, 3, '#9aa4b4');
      u.px(c, wx0 - 1, wy - 2, ww + 2, 1, '#d8e0ec');
      for (var wp = wx0 + 8; wp < wx0 + ww - 2; wp += 9) {
        u.px(c, wp, wy + 1, 1, wh - 1, '#444c5c');
        u.px(c, wp + 1, wy + 2, 1, wh - 3, '#7e8898');
      }
      u.px(c, wx0 + Math.round(ww * 0.28), wy + 3, 1, Math.round(wh * 0.55), '#262c38');
      u.px(c, wx0 + Math.round(ww * 0.68), wy + 4, 1, Math.round(wh * 0.6), '#262c38');
      var gCols = ['#e85a3a', '#40a8e0', '#f0c850', '#58c878', '#e068a8', '#e8e8f0'];
      for (var gi = 0; gi < 14; gi++) {
        var gx = wx0 + 3 + Math.floor(R() * Math.max(6, ww - 10));
        var gy2 = wy + 2 + Math.floor(R() * Math.max(4, wh - 6));
        u.px(c, gx, gy2, 3 + Math.floor(R() * 6), 2 + Math.floor(R() * 4), gCols[gi % gCols.length]);
      }
      var tx = xr(G, 0.80), th = sz(G, 0.36), ty = g - th;
      u.px(c, tx - 3, ty + 10, 6, th - 10, '#445066');
      u.px(c, tx - 2, ty + 10, 1, th - 10, '#6a7890');
      u.px(c, tx - 7, ty + 2, 14, 8, '#5a667c');
      u.px(c, tx - 8, ty, 16, 2, '#9aa6bc');
      u.px(c, tx - 5, ty + 4, 10, 3, '#f0c870');
      u.px(c, tx, ty - 5, 1, 5, '#9aa6bc');

      // Zengin zemin bantları + kaldırım derzleri + su birikintileri + çatlaklar
      u.bands(c, ['#525a6c', '#464e60', '#384050', '#2e3442', '#242934'], g, H, W, 5);
      urbanGround(u, c, W, H, g, R, {
        walk: '#586274', walkFore: '#3c4454', curbHi: '#8a96aa', curbSh: '#222834',
        joint: '#3a4252', lane: '#9aa4b4', puddle: '#1e283c', puddleHi: '#5a7098',
        crack: '#1e222c', litter1: '#c8d4e0', litter2: '#7a6850'
      });
      groundTexture(u, c, W, H, g, R, { far: '#6a7488', midHi: '#8490a4', midSh: '#2c3240', foreSh: '#1a1e28' });
      for (var sn = 0; sn < 16; sn++) {
        var snSide = sn < 8 ? R() * 0.34 : (0.66 + R() * 0.34);
        u.px(c, Math.floor(snSide * W), g + 2 + Math.floor(R() * 14), 6 + Math.floor(R() * 10), 2, '#c8d4e0');
      }

      // 3 Şeritli YOĞUN zemin dolgusu (kenarlar %0-35 ve %65-100, alt şerit 2x büyük)
      var gh = Math.max(20, H - g - 10);
      // Şerit 1 (ufka yakın: küçük soluk nesneler)
      var s1X = [0.03, 0.09, 0.15, 0.21, 0.27, 0.33, 0.41, 0.48, 0.56, 0.64, 0.70, 0.76, 0.82, 0.88, 0.94];
      for (var s1 = 0; s1 < s1X.length; s1++) {
        var px1 = Math.round(W * s1X[s1]), py1 = g + Math.round(gh * (0.09 + (s1 % 3) * 0.05));
        if (s1 % 3 === 0) streetLamp(u, c, px1, py1, 0.7, '#5a667c', '#f0c870', true);
        else if (s1 % 3 === 1) rockProp(u, c, px1, py1, 0.7, '#687488', '#b8c4d4', '#384050');
        else bush(u, c, px1, py1, 0.65, '#2c3844', '#445264', '#9aa8bc');
      }
      // Şerit 2 (orta, kenar %0-35 ve %65-100: 2x daha yoğun)
      var y2a = g + Math.round(gh * 0.42), y2b = g + Math.round(gh * 0.54);
      cityTree(u, c, Math.round(W * 0.03), y2a, 24, '#3a3028', '#2a3644', '#445468', '#9aa8bc');
      streetLamp(u, c, Math.round(W * 0.08), y2b, 1.8, '#5a667c', '#ffe088', true);
      drawCar(u, c, Math.round(W * 0.11), y2a, 1.6, '#8ca8b8', '#b8ccd8', '#2a3854', '#ffe898', 1);
      fenceSeg(u, c, Math.round(W * 0.18), y2b, 22, 1.4, '#687488', '#b8c4d4');
      benchProp(u, c, Math.round(W * 0.25), y2a, 1.5, '#6e4e38', '#2a303c');
      crateProp(u, c, Math.round(W * 0.30), y2b, 1.4, '#6a523c', '#987a5a', '#443426');
      bush(u, c, Math.round(W * 0.33), y2a, 1.4, '#2a3444', '#445264', '#b8c4d4');
      bush(u, c, Math.round(W * 0.67), y2a, 1.4, '#2a3444', '#445264', '#b8c4d4');
      fenceSeg(u, c, Math.round(W * 0.70), y2b, 22, 1.4, '#687488', '#b8c4d4');
      drawCar(u, c, Math.round(W * 0.76), y2a, 1.6, '#c8b890', '#e0d4b0', '#2a3854', '#ffe898', -1);
      streetLamp(u, c, Math.round(W * 0.85), y2b, 1.8, '#5a667c', '#ffe088', true);
      crateProp(u, c, Math.round(W * 0.89), y2b, 1.4, '#6a523c', '#987a5a', '#443426');
      cityTree(u, c, Math.round(W * 0.95), y2a, 24, '#3a3028', '#2a3644', '#445468', '#9aa8bc');
      // Şerit 3 (ön, BÜYÜK ve ayrıntılı: araba 31px, lamba/ağaç 35-44px, bank/tezgah 24-28px)
      var fy3 = g + Math.round(gh * 0.80);
      streetLamp(u, c, Math.round(W * 0.03), fy3, 3.3, '#4a566c', '#ffe898', true);
      cityTree(u, c, Math.round(W * 0.07), fy3, 40, '#3a3028', '#242e3c', '#3c4c60', '#9aa8bc');
      drawCar(u, c, Math.round(W * 0.11), fy3, 2.6, '#7a98a8', '#b8ccd8', '#222c44', '#ffe898', 1);
      benchProp(u, c, Math.round(W * 0.21), fy3, 2.5, '#7a583e', '#242a34');
      crateProp(u, c, Math.round(W * 0.27), fy3, 2.2, '#6a523c', '#9c7c5c', '#403024');
      rockProp(u, c, Math.round(W * 0.32), fy3, 2.6, '#6a7484', '#c8d4e0', '#343c4a');
      bush(u, c, Math.round(W * 0.68), fy3, 2.5, '#2a3444', '#445264', '#b8c4d4');
      fenceSeg(u, c, Math.round(W * 0.72), fy3, 28, 2.0, '#687488', '#c8d4e0');
      drawCar(u, c, Math.round(W * 0.80), fy3, 2.6, '#b8a47c', '#e0d4b0', '#222c44', '#ffe898', -1);
      streetLamp(u, c, Math.round(W * 0.90), fy3, 3.3, '#4a566c', '#ffe898', true);
      cityTree(u, c, Math.round(W * 0.95), fy3, 42, '#3a3028', '#242e3c', '#3c4c60', '#9aa8bc');

      return {
        g: g, gh: gh,
        fw1: xl(G, 0.85),
        fw2: xr(G, 0.45),
        fwY: Math.round(H * 0.21),
        wallX: wx0 + Math.round(ww * 0.45),
        wallTop: wy - 2,
        clouds: u.makeClouds(u.rng(602), 4, W, H, 0.06, 0.26)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W, H = G.H, g = st.g;
      u.drawClouds(c, st.clouds, t * 0.45, W, ['#1a2238', '#2a3854', '#445678', '#687c9e']);
      firework(c, u, st.fw1, st.fwY, t, ['#e8e8f0', '#e85a3a', '#40a8e0']);
      firework(c, u, st.fw2, st.fwY - 6, t + 1.2, ['#f8d868', '#e85a3a', '#8a9ab0']);

      var sx = st.wallX, sy = st.wallTop, wave = Math.floor(t * 3) % 2;
      u.px(c, sx, sy - 5, 2, 5, '#1a2238');
      u.px(c, sx, sy - 7, 2, 2, '#e8e8f0');
      u.px(c, sx + 2, sy - (wave ? 7 : 5), 2, 1, '#e8e8f0');

      for (var i = 0; i < 30; i++) {
        var fx = ((i * 37 + Math.floor(t * 6) + Math.round(Math.sin(t * 1.4 + i) * 3)) % W + W) % W;
        var fy = Math.floor((i * 23 + t * 13) % g);
        u.px(c, fx, fy, 1, 1, i % 3 ? '#e8e8f0' : '#8a9ab0');
      }

      // Yürüyen yayalar (~12px, t~2'de ekranda)
      var p1x = Math.round(W * 0.06 + ((t * 7) % (W * 0.24)));
      drawPerson(u, c, p1x, g + Math.round(st.gh * 0.64), 1.8, '#e85a3a', '#f0d8c0', Math.floor(t * 4) % 2, 'flag');
      var p2x = Math.round(W * 0.90 - ((t * 6) % (W * 0.20)));
      drawPerson(u, c, p2x, g + Math.round(st.gh * 0.62), 1.8, '#40a8e0', '#f0d8c0', Math.floor(t * 4 + 1) % 2, '');

      // Trabant dumanla geçer (t~2'de görünür)
      var tx = Math.round(((W * 0.15 + t * 14) % (W + 40)) - 20), ty = g + Math.round(st.gh * 0.34);
      if (ty < H - 16) {
        drawCar(u, c, tx, ty, 1.5, '#9ab8c8', '#c8d8e0', '#2a3854', '#f8e088', 1);
        u.smoke(c, tx - 2, ty - 2, t * 1.5, '#8a9ab0', 0.45);
      }
    }
  });

  /* ================= silikon — WEB 2.0 (2001 – 2006) ================= */
  S.register('silikon', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(611);
      u.bands(c, ['#2a3a70', '#5a4a8a', '#c86a6a', '#f8b878'], 0, g, W, 11);
      var sunX = Math.round(W * 0.5), sunY = g - 14;
      u.sun(c, sunX, sunY, 14, ['#e07a6a', '#f8b068', '#ffe4a8'], g);
      skyRays(u, c, sunX, sunY, g, 'rgba(255,224,168,0.28)', R);

      u.profile(c, 0, W, function (x) {
        return g - 12 - 6 * Math.sin(x / 35 + 0.5) - 3 * Math.sin(x / 12);
      }, g - 6, '#3a4264', '#6a6280');
      horizonSettlement(u, c, W, g - 6, R, '#4a4e72', '#343a5a', '#7c6e8e', '#ffd898', 'skyline');
      u.bands(c, ['#3a4a8a', '#2e3e76'], g - 8, g, W, 3);

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

      var ox = xr(G, 0.15), ow = sz(G, 0.42), oh = sz(G, 0.22), oy = g - oh;
      u.px(c, ox, oy, ow, oh, '#2a3a4a');
      u.px(c, ox + 2, oy + 3, ow - 4, oh - 5, '#5a8098');
      u.px(c, ox - 2, oy, ow + 4, 2, '#c8d8e0');
      for (var wy = oy + 5; wy < g - 4; wy += 5) {
        u.px(c, ox + 2, wy, ow - 4, 1, '#2a3a4a');
        u.px(c, ox + 3, wy - 2, Math.round(ow * 0.4), 1, '#f8c080');
      }
      var sx = ox + Math.round(ow * 0.55), sy = g - 12, sw = Math.max(10, Math.round(ow * 0.38));
      u.px(c, sx, sy, sw, 10, '#141c24');
      u.px(c, sx + 1, sy + 1, Math.round(sw * 0.4), 8, '#222c38');
      u.px(c, sx + Math.round(sw * 0.52), sy + 1, Math.round(sw * 0.4), 8, '#222c38');
      palmTree(u, c, xr(G, 0.04), g + 2, 16);
      palmTree(u, c, xr(G, 0.88), g + 2, 14);

      // Zemin + kaldırım derzleri + şerit çizgisi + su birikintisi + çim alanlar
      u.bands(c, ['#525e6c', '#46505e', '#3a424e', '#2e3642', '#242a34'], g, H, W, 5);
      urbanGround(u, c, W, H, g, R, {
        walk: '#425e48', walkFore: '#3a4450', curbHi: '#8a9aa8', curbSh: '#222a32',
        joint: '#2e3844', lane: '#d8b468', puddle: '#22384c', puddleHi: '#6898b8',
        crack: '#1e242c', litter1: '#6ea468', litter2: '#d8502a'
      });
      groundTexture(u, c, W, H, g, R, { far: '#627080', midHi: '#7c8c9c', midSh: '#2e3640', foreSh: '#1c222a' });

      var gh = Math.max(20, H - g - 10);
      // Şerit 1
      var s1X = [0.03, 0.09, 0.16, 0.23, 0.30, 0.38, 0.46, 0.54, 0.62, 0.69, 0.76, 0.83, 0.90, 0.96];
      for (var s1 = 0; s1 < s1X.length; s1++) {
        var px1 = Math.round(W * s1X[s1]), py1 = g + Math.round(gh * (0.09 + (s1 % 3) * 0.05));
        if (s1 % 3 === 0) bush(u, c, px1, py1, 0.65, '#2e4a38', '#466a4c', '#6e9668');
        else if (s1 % 3 === 1) streetLamp(u, c, px1, py1, 0.7, '#5a6a7a', '#ffe4a8', true);
        else rockProp(u, c, px1, py1, 0.65, '#687482', '#8e9aa8', '#424a54');
      }
      // Şerit 2 (orta, kenar %0-35 ve %65-100)
      var y2a = g + Math.round(gh * 0.42), y2b = g + Math.round(gh * 0.54);
      cityTree(u, c, Math.round(W * 0.03), y2a, 24, '#5a4030', '#2e5838', '#447a4e', '#6ea468');
      drawCar(u, c, Math.round(W * 0.07), y2b, 1.6, '#40a8e0', '#88d0f8', '#1a2838', '#ffe898', 1);
      streetLamp(u, c, Math.round(W * 0.16), y2a, 1.8, '#5a6a7a', '#ffe4a8', true);
      benchProp(u, c, Math.round(W * 0.22), y2b, 1.5, '#8c6244', '#2e3844');
      bush(u, c, Math.round(W * 0.29), y2a, 1.5, '#2e4a38', '#466a4c', '#6e9668');
      crateProp(u, c, Math.round(W * 0.33), y2b, 1.3, '#5a6878', '#8a9aa8', '#343e48');
      bush(u, c, Math.round(W * 0.67), y2a, 1.5, '#2e4a38', '#466a4c', '#6e9668');
      benchProp(u, c, Math.round(W * 0.73), y2b, 1.5, '#8c6244', '#2e3844');
      drawCar(u, c, Math.round(W * 0.80), y2a, 1.6, '#d8502a', '#f08058', '#1a2838', '#ffe898', -1);
      streetLamp(u, c, Math.round(W * 0.90), y2b, 1.8, '#5a6a7a', '#ffe4a8', true);
      palmTree(u, c, Math.round(W * 0.95), y2a, 26);
      // Şerit 3 (ön, BÜYÜK: araba ~31px, tezgah ~28px, palmiye/lamba ~38-44px)
      var fy3 = g + Math.round(gh * 0.80);
      palmTree(u, c, Math.round(W * 0.03), fy3, 42);
      bush(u, c, Math.round(W * 0.07), fy3, 2.5, '#284432', '#3e6446', '#6a9668');
      stallProp(u, c, Math.round(W * 0.14), fy3, 2.0, '#6e4e34', '#d8502a', '#f8e0c0', '#40a8e0');
      streetLamp(u, c, Math.round(W * 0.22), fy3, 3.3, '#4a5868', '#ffe4a8', true);
      drawCar(u, c, Math.round(W * 0.25), fy3, 2.5, '#3a78c8', '#78b0f0', '#1a2838', '#ffe898', 1);
      benchProp(u, c, Math.round(W * 0.69), fy3, 2.4, '#9c6e4a', '#2e3844');
      drawCar(u, c, Math.round(W * 0.75), fy3, 2.5, '#e8e8f0', '#b8c8d8', '#1a2838', '#ffe898', -1);
      streetLamp(u, c, Math.round(W * 0.86), fy3, 3.3, '#4a5868', '#ffe4a8', true);
      cityTree(u, c, Math.round(W * 0.92), fy3, 40, '#5a4030', '#284432', '#3e6446', '#6a9668');
      bush(u, c, Math.round(W * 0.96), fy3, 2.4, '#284432', '#3e6446', '#6a9668');

      return {
        g: g, gh: gh,
        bL: bL, bR: bR, deck: deck,
        sx: sx, sy: sy, sw: sw,
        cloudsFar: u.makeClouds(u.rng(613), 3, W, H, 0.03, 0.15),
        clouds: u.makeClouds(u.rng(612), 4, W, H, 0.08, 0.28)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W, H = G.H, g = st.g;
      u.drawClouds(c, st.cloudsFar, t * 0.25, W, ['#6a4a70', '#9a6478', '#d08880', '#f0b898']);
      u.drawClouds(c, st.clouds, t * 0.5, W, ['#9a5a7a', '#d07a7a', '#f0a888', '#ffd8b0']);

      var fogX = Math.round(((t * 6) % (st.bR + 40)) - 20);
      u.px(c, Math.max(0, fogX), g - 9, 28, 3, 'rgba(200,216,224,0.32)');
      u.px(c, Math.max(0, fogX + 6), g - 11, 18, 2, 'rgba(248,224,200,0.25)');

      for (var i = 0; i < 6; i++) {
        var span = st.bR - st.bL;
        var lx = st.bL + Math.round((i * 17 + t * 14) % span);
        u.px(c, lx, st.deck - 1, 2, 1, i % 2 ? '#ffe8a8' : '#e84a3a');
      }

      var ledCols = ['#40e080', '#40a8e0', '#f8c040'];
      for (var l = 0; l < 8; l++) {
        var on = ((Math.floor(t * 4) + l * 3) % 5) < 3;
        if (on) {
          var rx = st.sx + 2 + (l % 2) * Math.round(st.sw * 0.48) + (l % 3);
          var ry = st.sy + 2 + Math.floor(l / 2) * 2;
          u.px(c, rx, ry, 1, 1, ledCols[l % 3]);
        }
      }

      var carX = Math.round(((W * 0.20 + t * 16) % (W + 30)) - 15);
      drawCar(u, c, carX, g + Math.round(st.gh * 0.34), 1.5, '#e8e8f0', '#b8c8d8', '#2a3a4a', '#ffe898', 1);

      var cx = xr(G, 0.02) + Math.round(((t * 9) % Math.max(30, W * 0.25)));
      var cy = g + Math.round(st.gh * 0.62);
      if (cy < H - 16) {
        drawCyclist(u, c, cx, cy, 1.6, '#d8502a', '#40a8e0', '#f8c080');
      }

      var px = Math.round(W * 0.08 + ((t * 5) % (W * 0.20)));
      drawPerson(u, c, px, g + Math.round(st.gh * 0.64), 1.7, '#40a8e0', '#f8c080', Math.floor(t * 4) % 2, 'bag');

      u.birds(c, t * 0.7, W, H, 3, '#2a3a4a', 0.24);
    }
  });

  /* ================= kus_yuvasi — PEKİN 2008 (2007 – 2009) ================= */
  S.register('kus_yuvasi', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(621);
      u.bands(c, ['#0a0e22', '#0e1430', '#1a1e44', '#2a2a5a'], 0, g, W, 10);
      u.stars(c, R, 30, W, Math.round(g * 0.58), '#e8e8f0');
      var moonX = Math.round(W * 0.48), moonY = Math.round(H * 0.13);
      u.circle(c, moonX, moonY, 8, 'rgba(232,232,240,0.14)');
      u.circle(c, moonX, moonY, 4, '#f0ead8');
      skyRays(u, c, moonX, moonY, g, 'rgba(200,208,240,0.2)', R);

      u.profile(c, 0, W, function (x) {
        return g - 8 - (Math.sin(x / 19) > 0.3 ? 9 : 2) - (Math.cos(x / 11) > 0.6 ? 5 : 0);
      }, g, '#161a38', '#2a325a');
      horizonSettlement(u, c, W, g, R, '#1e2448', '#141834', '#384270', '#f0c860', 'skyline');

      var nx = xl(G, 0.5), nw = sz(G, 0.40), nh = sz(G, 0.17), ny = g;
      u.poly(c, [
        [nx - Math.round(nw * 0.52), ny - nh],
        [nx, ny - Math.round(nh * 0.78)],
        [nx + Math.round(nw * 0.52), ny - nh],
        [nx + Math.round(nw * 0.44), ny + 1],
        [nx - Math.round(nw * 0.44), ny + 1]
      ], '#262a3e');
      for (var rx = nx - Math.round(nw * 0.36); rx < nx + Math.round(nw * 0.36); rx += 4) {
        u.px(c, rx, ny - Math.round(nh * 0.65), 2, Math.round(nh * 0.45), '#c83a3a');
      }
      for (var s = -4; s <= 4; s++) {
        var sx0 = nx + Math.round(s * nw * 0.1);
        for (var k = 0; k < nh; k += 2) {
          u.px(c, sx0 + Math.round(k * 0.6), ny - nh + k, 1, 1, '#9aa2b8');
          u.px(c, sx0 - Math.round(k * 0.6), ny - nh + k, 1, 1, '#c8d0e0');
        }
      }
      u.px(c, nx - Math.round(nw * 0.48), ny - nh, Math.round(nw * 0.96), 1, '#e8e8f0');

      // Sağ: CCTV kulesi (tanınır L-biçimli üstte geniş çıkıntılı ikonik döngü)
      var cx = xr(G, 0.66), ch = sz(G, 0.40), cw = sz(G, 0.24), cy = g - ch;
      var legW = Math.max(3, Math.round(cw * 0.26));
      for (var ly = 6; ly < ch; ly++) {
        var lean = Math.round((ly / ch) * 3);
        u.px(c, cx - Math.round(cw * 0.38) - lean, cy + ly, legW, 1, '#4a5672');
        u.px(c, cx - Math.round(cw * 0.38) - lean, cy + ly, 1, 1, '#8a9ab8');
        u.px(c, cx + Math.round(cw * 0.08) + lean, cy + ly, legW, 1, '#364058');
        if (ly % 4 === 0) {
          u.px(c, cx - Math.round(cw * 0.38) - lean + 1, cy + ly, legW - 2, 1, '#78b8e8');
          u.px(c, cx + Math.round(cw * 0.08) + lean + 1, cy + ly, legW - 2, 1, '#5888b8');
        }
      }
      var ovW = Math.max(12, Math.round(cw * 1.15));
      u.px(c, cx - Math.round(cw * 0.45), cy, ovW, 8, '#5a6684');
      u.px(c, cx - Math.round(cw * 0.45), cy, ovW, 1, '#b8c8e0');
      u.px(c, cx + Math.round(cw * 0.25), cy + 2, Math.round(ovW * 0.32), 6, '#3a445e');
      u.px(c, cx - Math.round(cw * 0.42), cy + 3, ovW - 4, 1, '#80c8ff');
      u.px(c, cx - Math.round(cw * 0.42), cy + 5, Math.round(ovW * 0.65), 1, '#e8c040');
      u.px(c, cx - Math.round(cw * 0.42), g - 7, Math.round(cw * 0.85), 7, '#3a4258');
      u.px(c, cx - Math.round(cw * 0.42), g - 7, Math.round(cw * 0.85), 1, '#7a88a4');

      var wx = xr(G, 0.14), ww = sz(G, 0.28), wh = sz(G, 0.13), wy = g - wh;
      u.px(c, wx, wy, ww, wh, '#1a4a7a');
      u.px(c, wx, wy, ww, 1, '#80d0ff');

      // Zemin + Olimpiyat meydanı taş derzleri + şerit + su birikintisi + çatlak
      u.bands(c, ['#323850', '#2a2e44', '#222638', '#1a1e2c', '#141622'], g, H, W, 5);
      urbanGround(u, c, W, H, g, R, {
        walk: '#383e58', walkFore: '#24283a', curbHi: '#687498', curbSh: '#141824',
        joint: '#24283c', lane: '#c83a3a', puddle: '#162848', puddleHi: '#5898d8',
        crack: '#10121c', litter1: '#e8c040', litter2: '#c83a3a'
      });
      groundTexture(u, c, W, H, g, R, { far: '#464e6c', midHi: '#5c6688', midSh: '#1c2030', foreSh: '#0e101a' });

      var gh = Math.max(20, H - g - 10);
      // Şerit 1
      var s1X = [0.03, 0.10, 0.17, 0.24, 0.31, 0.39, 0.47, 0.55, 0.63, 0.70, 0.77, 0.84, 0.91, 0.96];
      for (var s1 = 0; s1 < s1X.length; s1++) {
        var px1 = Math.round(W * s1X[s1]), py1 = g + Math.round(gh * (0.09 + (s1 % 3) * 0.05));
        if (s1 % 3 === 0) streetLamp(u, c, px1, py1, 0.7, '#4a5068', '#e84038', true);
        else if (s1 % 3 === 1) bush(u, c, px1, py1, 0.65, '#1c2a3a', '#2c4054', '#46627c');
        else rockProp(u, c, px1, py1, 0.65, '#3a4058', '#5a6484', '#222638');
      }
      // Şerit 2 (orta, kenar %0-35 ve %65-100)
      var y2a = g + Math.round(gh * 0.42), y2b = g + Math.round(gh * 0.54);
      streetLamp(u, c, Math.round(W * 0.04), y2a, 1.8, '#4a5068', '#f04838', true);
      stallProp(u, c, Math.round(W * 0.10), y2b, 1.5, '#3a3e54', '#c83a3a', '#f0c848', '#80d0ff');
      cityTree(u, c, Math.round(W * 0.18), y2a, 24, '#2a2228', '#1c3238', '#2c4c4e', '#487470');
      drawCar(u, c, Math.round(W * 0.22), y2b, 1.6, '#c83a3a', '#e8c040', '#1a2238', '#ffe898', 1);
      fenceSeg(u, c, Math.round(W * 0.29), y2a, 18, 1.4, '#5a627a', '#9aa4bc');
      fenceSeg(u, c, Math.round(W * 0.67), y2a, 18, 1.4, '#5a627a', '#9aa4bc');
      drawCar(u, c, Math.round(W * 0.73), y2b, 1.6, '#3878c8', '#78b8f0', '#1a2238', '#ffe898', -1);
      cityTree(u, c, Math.round(W * 0.82), y2a, 24, '#2a2228', '#1c3238', '#2c4c4e', '#487470');
      benchProp(u, c, Math.round(W * 0.88), y2b, 1.5, '#6a4438', '#2a2e42');
      streetLamp(u, c, Math.round(W * 0.95), y2a, 1.8, '#4a5068', '#f04838', true);
      // Şerit 3 (ön, BÜYÜK)
      var fy3 = g + Math.round(gh * 0.80);
      streetLamp(u, c, Math.round(W * 0.03), fy3, 3.3, '#4a5068', '#f04838', true);
      bush(u, c, Math.round(W * 0.07), fy3, 2.5, '#1c2a3a', '#2c4054', '#46627c');
      drawCar(u, c, Math.round(W * 0.11), fy3, 2.6, '#c83a3a', '#f0c848', '#141828', '#ffe898', 1);
      benchProp(u, c, Math.round(W * 0.22), fy3, 2.5, '#7a4a3a', '#2a2e42');
      stallProp(u, c, Math.round(W * 0.29), fy3, 2.0, '#3a3e54', '#c83a3a', '#f0c848', '#80d0ff');
      crateProp(u, c, Math.round(W * 0.68), fy3, 2.2, '#3a4258', '#687494', '#222638');
      stallProp(u, c, Math.round(W * 0.75), fy3, 2.0, '#3a3e54', '#c83a3a', '#f0c848', '#e8c040');
      drawCar(u, c, Math.round(W * 0.83), fy3, 2.5, '#2868a8', '#68a8e8', '#141828', '#ffe898', -1);
      cityTree(u, c, Math.round(W * 0.92), fy3, 40, '#2a2228', '#1c3238', '#2c4c4e', '#487470');
      streetLamp(u, c, Math.round(W * 0.96), fy3, 3.3, '#4a5068', '#f04838', true);

      return {
        g: g, gh: gh,
        nx: nx, nw: nw, nh: nh,
        wx: wx, wy: wy, ww: ww, wh: wh,
        fw1: xl(G, 0.85),
        fw2: xr(G, 0.25),
        fw3: xr(G, 0.60),
        fwY: Math.round(H * 0.20),
        clouds: u.makeClouds(u.rng(622), 4, W, H, 0.06, 0.26)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W, g = st.g;
      u.drawClouds(c, st.clouds, t * 0.4, W, ['#141834', '#22284e', '#343e6e', '#505c94']);
      firework(c, u, st.fw1, st.fwY, t, ['#e8c040', '#c83a3a', '#e8e8f0']);
      firework(c, u, st.fw2, st.fwY + 6, t + 0.8, ['#40a0e8', '#e8e8f0', '#2a2a5a']);
      firework(c, u, st.fw3, st.fwY - 5, t + 1.6, ['#c83a3a', '#e8c040', '#40a0e8']);

      var bCols = ['#2878c8', '#40a0e8', '#78d0ff'], step = Math.floor(t * 2);
      var idx = 0;
      for (var by = st.wy + 2; by < st.g - 2; by += 4) {
        for (var bx = st.wx + 2; bx < st.wx + st.ww - 3; bx += 4) {
          u.px(c, bx, by, 3, 3, bCols[(idx + step) % 3]);
          idx++;
        }
      }

      var pulse = Math.floor(t * 3) % 2;
      u.px(c, st.nx - Math.round(st.nw * 0.25), st.g - Math.round(st.nh * 0.55), Math.round(st.nw * 0.5), 2, pulse ? '#f05040' : '#c83a3a');

      var tx = Math.round(((W * 0.12 + t * 14) % (W + 30)) - 15);
      drawCar(u, c, tx, g + Math.round(st.gh * 0.34), 1.5, '#c83a3a', '#e8c040', '#1a2238', '#ffe898', 1);

      var p1 = Math.round(W * 0.08 + ((t * 6) % (W * 0.20)));
      drawPerson(u, c, p1, g + Math.round(st.gh * 0.64), 1.8, '#e8c040', '#f0d8c0', Math.floor(t * 4) % 2, 'flag');
      var p2 = Math.round(W * 0.90 - ((t * 5) % (W * 0.18)));
      drawPerson(u, c, p2, g + Math.round(st.gh * 0.62), 1.8, '#40a0e8', '#f0d8c0', Math.floor(t * 4 + 1) % 2, '');
    }
  });

  /* ================= dubai — DUBAİ (2010 – 2014) ================= */
  S.register('dubai', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(631);
      u.bands(c, ['#2a3a6a', '#7a5a7a', '#c8806a', '#f8c87a'], 0, g, W, 11);
      var sunX = Math.round(W * 0.5), sunY = g - 18;
      u.sun(c, sunX, sunY, 14, ['#e89060', '#f8c87a', '#fff4cc'], g);
      skyRays(u, c, sunX, sunY, g, 'rgba(255,232,176,0.28)', R);

      u.profile(c, 0, Math.round(W * 0.62), function (x) {
        return g - 5 - 3 * Math.sin(x / 27);
      }, g, '#c89858', '#e8c078');
      horizonSettlement(u, c, W, g, R, '#9c787c', '#745664', '#d0a278', '#ffe498', 'skyline');
      u.bands(c, ['#3a8aa8', '#2a6a88'], g - 7, g, W, 2);

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

      var ax = xr(G, 0.68), ah = sz(G, 0.36), aw = sz(G, 0.16), aTop = g - ah;
      for (var y = 0; y < ah; y++) {
        var f = y / ah, sailW = Math.max(2, Math.round(Math.sin(f * Math.PI * 0.85) * aw));
        u.px(c, ax - sailW, aTop + y, sailW, 1, '#e8e8f0');
        u.px(c, ax, aTop + y, 3, 1, '#3a8aa8');
        u.px(c, ax - sailW, aTop + y, 1, 1, '#c8d4e0');
      }
      u.px(c, ax - 1, aTop - 6, 1, 6, '#e8e8f0');
      u.px(c, ax - Math.round(aw * 0.7), aTop + Math.round(ah * 0.18), 6, 2, '#c8d4e0');

      var vx0 = xr(G, 0.0), vw = W - vx0, vy = g - 11;
      u.px(c, vx0, vy, vw, 2, '#b8a890');
      u.px(c, vx0, vy, vw, 1, '#e8d8c0');
      for (var px = vx0 + 8; px < W; px += 18) u.px(c, px, vy + 2, 2, 9, '#988870');

      palmTree(u, c, xr(G, 0.12), g + 2, 16);
      palmTree(u, c, xr(G, 0.25), g + 2, 13);

      // Zemin + kum dalgaları + sağda sahil bulvarı + doku
      u.bands(c, ['#d2aa6a', '#c09658', '#aa8048', '#966e3a', '#825c2e'], g, H, W, 5);
      for (var dw = 0; dw < 8; dw++) {
        var dy = g + 4 + dw * Math.max(3, Math.round((H - g - 14) / 8));
        u.px(c, Math.round(W * 0.02), dy, Math.round(W * 0.31), 1, dw % 2 ? '#ecc888' : '#8e6836');
        u.px(c, Math.round(W * 0.67), dy, Math.round(W * 0.31), 1, dw % 2 ? '#ecc888' : '#8e6836');
      }
      groundTexture(u, c, W, H, g, R, { far: '#d8b478', midHi: '#ecc888', midSh: '#8a6638', foreSh: '#624624' });

      var gh = Math.max(20, H - g - 10);
      // Şerit 1
      var s1X = [0.03, 0.10, 0.17, 0.24, 0.31, 0.39, 0.47, 0.55, 0.63, 0.70, 0.77, 0.84, 0.91, 0.96];
      for (var s1 = 0; s1 < s1X.length; s1++) {
        var px1 = Math.round(W * s1X[s1]), py1 = g + Math.round(gh * (0.09 + (s1 % 3) * 0.05));
        if (s1 % 3 === 0) rockProp(u, c, px1, py1, 0.7, '#b89056', '#e0ba7c', '#7a5c32');
        else if (s1 % 3 === 1) grassTuft(u, c, px1, py1, 0.75, '#6e7c44', '#94a45c');
        else bush(u, c, px1, py1, 0.65, '#4c6638', '#688848', '#8ca860');
      }
      // Şerit 2 (orta, kenar %0-35 ve %65-100)
      var y2a = g + Math.round(gh * 0.42), y2b = g + Math.round(gh * 0.54);
      palmTree(u, c, Math.round(W * 0.04), y2a, 24);
      drawCamel(u, c, Math.round(W * 0.09), y2b, 1.5, '#c89a64', '#966e40', '#c83a3a', 0);
      rockProp(u, c, Math.round(W * 0.18), y2a, 1.6, '#b89056', '#e0ba7c', '#7a5c32');
      stallProp(u, c, Math.round(W * 0.25), y2b, 1.4, '#7a5234', '#c83a3a', '#f8d888', '#e89038');
      bush(u, c, Math.round(W * 0.32), y2a, 1.4, '#446032', '#608244', '#86a65e');
      streetLamp(u, c, Math.round(W * 0.67), y2a, 1.8, '#8a7a68', '#ffe4a8', true);
      drawCar(u, c, Math.round(W * 0.72), y2b, 1.6, '#e8e8f0', '#b8c8d8', '#2a3a54', '#ffe898', -1);
      palmTree(u, c, Math.round(W * 0.82), y2a, 24);
      benchProp(u, c, Math.round(W * 0.88), y2b, 1.5, '#9c7854', '#4a3c30');
      bush(u, c, Math.round(W * 0.95), y2a, 1.4, '#446032', '#608244', '#86a65e');
      // Şerit 3 (ön, BÜYÜK)
      var fy3 = g + Math.round(gh * 0.80);
      palmTree(u, c, Math.round(W * 0.03), fy3, 42);
      rockProp(u, c, Math.round(W * 0.08), fy3, 2.8, '#a67c44', '#dbb478', '#6c4e28');
      drawCamel(u, c, Math.round(W * 0.14), fy3, 2.2, '#d4a46a', '#9c7242', '#c83a3a', 1);
      stallProp(u, c, Math.round(W * 0.23), fy3, 2.0, '#7a5234', '#c83a3a', '#f8d888', '#e89038');
      bush(u, c, Math.round(W * 0.32), fy3, 2.4, '#40582e', '#58783e', '#80a058');
      bush(u, c, Math.round(W * 0.68), fy3, 2.4, '#40582e', '#58783e', '#80a058');
      benchProp(u, c, Math.round(W * 0.75), fy3, 2.4, '#9c7854', '#4a3c30');
      drawCar(u, c, Math.round(W * 0.81), fy3, 2.6, '#c83a3a', '#f07060', '#2a3a6a', '#ffe898', -1);
      streetLamp(u, c, Math.round(W * 0.91), fy3, 3.3, '#8a7a68', '#ffe4a8', true);
      palmTree(u, c, Math.round(W * 0.96), fy3, 44);

      return {
        g: g, gh: gh,
        bx: bx, bTop: bTop,
        vx0: vx0, vy: vy, vw: vw,
        cloudsFar: u.makeClouds(u.rng(633), 3, W, H, 0.02, 0.14),
        clouds: u.makeClouds(u.rng(632), 4, W, H, 0.06, 0.25)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W, g = st.g;
      u.drawClouds(c, st.cloudsFar, t * 0.2, W, ['#78546a', '#a87478', '#d89c80', '#f4c898']);
      u.drawClouds(c, st.clouds, t * 0.4, W, ['#a87078', '#d89878', '#f8c888', '#ffe8b8']);

      if (Math.floor(t * 2) % 2 === 0) {
        u.px(c, st.bx, st.bTop - 1, 2, 2, '#ff3030');
      }

      var mx = st.vx0 + Math.round(((t * 16) % (st.vw + 30)) - 15);
      if (mx >= st.vx0 && mx < W - 12) {
        u.px(c, mx, st.vy - 3, 18, 3, '#e8e8f0');
        u.px(c, mx + 2, st.vy - 2, 14, 1, '#3a8aa8');
      }

      for (var i = 0; i < 8; i++) {
        var sx = Math.round(W * 0.65) + ((i * 23 + Math.floor(t * 3) * 5) % Math.round(W * 0.32));
        u.px(c, sx, g - 5 + (i % 4), 2, 1, '#f8e0a0');
      }

      var cmx = Math.round(W * 0.04 + ((t * 5) % (W * 0.22)));
      drawCamel(u, c, cmx, g + Math.round(st.gh * 0.64), 1.8, '#d4a46a', '#9c7242', '#3a8aa8', Math.floor(t * 3) % 2);

      var carX = Math.round(W * 0.92 - ((t * 15) % (W * 0.26)));
      drawCar(u, c, carX, g + Math.round(st.gh * 0.34), 1.5, '#c83a3a', '#f07060', '#2a3a6a', '#ffe898', -1);

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
      var sunX = Math.round(W * 0.5), sunY = Math.round(H * 0.14);
      u.sun(c, sunX, sunY, 11, ['#fff4b0', '#fffad0', '#ffffff']);
      skyRays(u, c, sunX, sunY, g, 'rgba(255,250,208,0.28)', R);

      u.profile(c, 0, W, function (x) {
        return g - 14 - 7 * Math.sin(x / 37) - 3 * Math.sin(x / 11);
      }, g - 10, '#3a684a', '#5a8a66');
      horizonSettlement(u, c, W, g - 10, R, '#4a6a7a', '#2e4454', '#7a98a8', '#fff4b0', 'city');
      u.bands(c, ['#2a6a9a', '#3a7eb0'], g - 12, g, W, 3);

      // Sol: tepe üzerinde 6 minareli Çamlıca Camii (koyu kontrastla belirgin)
      var mx = xl(G, 0.48), hillY = g - 6;
      u.profile(c, 0, Math.round(W * 0.34), function (x) {
        return hillY - Math.max(0, 10 - Math.abs(x - mx) * 0.2);
      }, g + 2, '#3c6646', '#5c8e64');
      var mBase = hillY - 6, mr = sz(G, 0.08);
      u.px(c, mx - mr - 8, mBase - mr - 1, (mr + 8) * 2, mr + 3, '#344454');
      u.px(c, mx - mr - 7, mBase - mr, (mr + 7) * 2, mr + 2, '#eef2f6');
      u.circle(c, mx, mBase - mr, mr + 1, '#344454');
      u.circle(c, mx, mBase - mr, mr, '#f2f6fa');
      u.circle(c, mx - mr - 2, mBase - Math.round(mr * 0.7), Math.round(mr * 0.5), '#b8c4d0');
      u.circle(c, mx + mr + 2, mBase - Math.round(mr * 0.7), Math.round(mr * 0.5), '#b8c4d0');
      u.px(c, mx - 2, mBase - Math.round(mr * 0.7), 4, Math.round(mr * 0.7), '#2a3848');
      u.px(c, mx, mBase - mr * 2 - 3, 1, 3, '#c8a840');
      var mOff = [-mr - 12, -mr - 7, -mr - 3, mr + 3, mr + 7, mr + 12];
      for (var i = 0; i < mOff.length; i++) {
        var mh = (i === 0 || i === 5) ? sz(G, 0.19) : sz(G, 0.25);
        var px2 = mx + mOff[i];
        u.px(c, px2 - 1, mBase - mh, 1, mh, '#344454');
        u.px(c, px2, mBase - mh, 2, mh, '#f2f6fa');
        u.px(c, px2 + 1, mBase - mh, 1, mh, '#8c9aa8');
        u.px(c, px2 - 1, mBase - Math.round(mh * 0.6), 4, 1, '#344454');
        u.px(c, px2, mBase - mh - 4, 1, 4, '#2a3848');
      }
      var fx = xl(G, 0.12), fy = g - 24;
      u.px(c, fx, fy, 1, 24, '#e8e8f0');

      // Sağ: Yavuz Sultan Selim Köprüsü
      var b0 = xr(G, 0.0), b1 = W - 2, tL = xr(G, 0.25), tR = xr(G, 0.80);
      var tTop = g - sz(G, 0.34), deck = g - sz(G, 0.09);
      [tL, tR].forEach(function (tx) {
        for (var k = 1; k <= 5; k++) {
          var dx = k * 5;
          var steps = 10;
          for (var s = 0; s <= steps; s++) {
            var f = s / steps;
            u.px(c, tx - Math.round(dx * f), tTop + Math.round((deck - tTop) * f), 1, 1, '#586c82');
            u.px(c, tx + Math.round(dx * f), tTop + Math.round((deck - tTop) * f), 1, 1, '#586c82');
          }
        }
        for (var y = tTop; y < g; y++) {
          var sp = Math.round(((y - tTop) / (g - tTop)) * 5);
          u.px(c, tx - sp - 2, y, 1, 1, '#2a3848');
          u.px(c, tx - sp - 1, y, 2, 1, '#f0f4f8');
          u.px(c, tx + sp, y, 2, 1, '#5a6a7a');
          u.px(c, tx + sp + 2, y, 1, 1, '#2a3848');
        }
        u.px(c, tx - 4, tTop + Math.round((deck - tTop) * 0.45), 9, 2, '#344454');
      });
      u.px(c, b0, deck, b1 - b0, 3, '#344454');
      u.px(c, b0, deck, b1 - b0, 1, '#ffffff');

      // Zemin + sahil yürüyüş yolu + park çimi + doku
      u.bands(c, ['#5e8056', '#507048', '#42603c', '#365032', '#2c4228'], g, H, W, 5);
      urbanGround(u, c, W, H, g, R, {
        walk: '#6e7680', walkFore: '#486240', curbHi: '#b8c4d0', curbSh: '#2e3842',
        joint: '#505862', lane: '#e8e8f0', puddle: '#2e5878', puddleHi: '#88c4e8',
        crack: '#2e363c', litter1: '#e84a3a', litter2: '#f8d048'
      });
      groundTexture(u, c, W, H, g, R, { far: '#6e9264', midHi: '#84aa78', midSh: '#3a5234', foreSh: '#243620' });

      var gh = Math.max(20, H - g - 10);
      // Şerit 1
      var s1X = [0.03, 0.10, 0.17, 0.24, 0.31, 0.39, 0.47, 0.55, 0.63, 0.70, 0.77, 0.84, 0.91, 0.96];
      for (var s1 = 0; s1 < s1X.length; s1++) {
        var px1 = Math.round(W * s1X[s1]), py1 = g + Math.round(gh * (0.09 + (s1 % 3) * 0.05));
        if (s1 % 3 === 0) cypressTree(u, c, px1, py1, 10, '#2e4e34', '#4a7450');
        else if (s1 % 3 === 1) bush(u, c, px1, py1, 0.65, '#345838', '#4c7a4e', '#e84a3a');
        else streetLamp(u, c, px1, py1, 0.7, '#344454', '#fff4b0', false);
      }
      // Şerit 2 (orta, kenar %0-35 ve %65-100)
      var y2a = g + Math.round(gh * 0.42), y2b = g + Math.round(gh * 0.54);
      cypressTree(u, c, Math.round(W * 0.03), y2a, 24, '#2a4830', '#446e48');
      benchProp(u, c, Math.round(W * 0.09), y2b, 1.5, '#8c5e3c', '#2a343c');
      stallProp(u, c, Math.round(W * 0.16), y2a, 1.4, '#6e4a30', '#c8282f', '#ffffff', '#e8b848');
      cityTree(u, c, Math.round(W * 0.24), y2b, 24, '#5a402c', '#2e5234', '#48764c', '#74a66e');
      bush(u, c, Math.round(W * 0.31), y2a, 1.5, '#345838', '#4c7a4e', '#e84a3a');
      fenceSeg(u, c, Math.round(W * 0.67), y2a, 22, 1.4, '#344454', '#b8c4d0');
      cityTree(u, c, Math.round(W * 0.75), y2b, 24, '#5a402c', '#2e5234', '#48764c', '#74a66e');
      benchProp(u, c, Math.round(W * 0.83), y2a, 1.5, '#8c5e3c', '#2a343c');
      streetLamp(u, c, Math.round(W * 0.89), y2b, 1.8, '#2a3848', '#fff4b0', false);
      cypressTree(u, c, Math.round(W * 0.95), y2a, 24, '#2a4830', '#446e48');
      // Şerit 3 (ön, BÜYÜK)
      var fy3 = g + Math.round(gh * 0.80);
      cityTree(u, c, Math.round(W * 0.04), fy3, 40, '#5a402c', '#2a4a30', '#426e46', '#6c9c68');
      benchProp(u, c, Math.round(W * 0.12), fy3, 2.5, '#9a6842', '#2a343c');
      bush(u, c, Math.round(W * 0.19), fy3, 2.5, '#305034', '#48724a', '#e8c040');
      streetLamp(u, c, Math.round(W * 0.25), fy3, 3.3, '#2a3848', '#fff4b0', false);
      stallProp(u, c, Math.round(W * 0.30), fy3, 2.0, '#6e4a30', '#c8282f', '#ffffff', '#e8b848');
      fenceSeg(u, c, Math.round(W * 0.67), fy3, 26, 2.0, '#344454', '#b8c4d0');
      stallProp(u, c, Math.round(W * 0.76), fy3, 2.0, '#6e4a30', '#c8282f', '#f0f4f8', '#e8c040');
      bush(u, c, Math.round(W * 0.84), fy3, 2.5, '#305034', '#48724a', '#e84a3a');
      streetLamp(u, c, Math.round(W * 0.90), fy3, 3.3, '#2a3848', '#fff4b0', false);
      cypressTree(u, c, Math.round(W * 0.95), fy3, 44, '#28442c', '#406a44');

      return {
        g: g, gh: gh,
        fx: fx, fy: fy,
        b0: b0, b1: b1, deck: deck,
        cloudsFar: u.makeClouds(u.rng(643), 3, W, H, 0.03, 0.14),
        clouds: u.makeClouds(u.rng(642), 5, W, H, 0.08, 0.28)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W, g = st.g;
      u.drawClouds(c, st.cloudsFar, t * 0.35, W, ['#9ab8d4', '#b8d0e8', '#dce8f4', '#f4f8fc']);
      u.drawClouds(c, st.clouds, t * 0.65, W, ['#b8cde0', '#d8e6f4', '#f0f4f8', '#ffffff']);
      u.flag(c, st.fx + 1, st.fy, 12, Math.floor(t * 4) % 2);

      var span = Math.max(20, st.b1 - st.b0);
      for (var i = 0; i < 5; i++) {
        var cx = st.b0 + Math.round((i * 19 + t * 14) % span);
        u.px(c, cx, st.deck - 1, 2, 1, i % 2 ? '#c8282f' : '#ffffff');
      }

      var vx = xr(G, 0.05) + Math.round(((t * 8) % Math.max(40, W * 0.28)));
      var vy = g - 5;
      u.px(c, vx, vy, 16, 3, '#f0f4f8');
      u.px(c, vx + 1, vy + 2, 14, 1, '#2a6a9a');
      u.px(c, vx + 3, vy - 3, 10, 3, '#e8e8e8');
      u.px(c, vx + 4, vy - 2, 7, 1, '#3a78c8');
      u.px(c, vx - 3, vy + 2, 3, 1, '#d8eefc');

      var p1 = Math.round(W * 0.06 + ((t * 6) % (W * 0.22)));
      drawPerson(u, c, p1, g + Math.round(st.gh * 0.64), 1.8, '#c8282f', '#f0d0b0', Math.floor(t * 4) % 2, 'bag');
      var cycX = Math.round(W * 0.68 + ((t * 9) % (W * 0.24)));
      drawCyclist(u, c, cycX, g + Math.round(st.gh * 0.62), 1.6, '#e8e8e8', '#3a78c8', '#f0d0b0');

      u.birds(c, t, W, G.H, 4, '#ffffff', 0.20);
    }
  });

  /* ================= mars — MARS ÇAĞI (2020 – 2023) ================= */
  S.register('mars', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(651);
      u.bands(c, ['#8a4a3a', '#c8805a', '#e8a878', '#8aa0b8'], 0, g, W, 10);
      var sunX = Math.round(W * 0.5), sunY = Math.round(H * 0.18);
      u.sun(c, sunX, sunY, 9, ['#c8d4e0', '#e8eef4', '#ffffff']);
      skyRays(u, c, sunX, sunY, g, 'rgba(232,224,208,0.22)', R);

      u.circle(c, Math.round(W * 0.42), Math.round(H * 0.14), 3, '#d0b8a8');
      u.px(c, Math.round(W * 0.42) - 1, Math.round(H * 0.14), 1, 1, '#8a7060');
      u.px(c, Math.round(W * 0.58), Math.round(H * 0.20), 2, 2, '#e8d8c8');

      u.profile(c, 0, W, function (x) {
        return g - 10 - 5 * Math.sin(x / 33) - (x > W * 0.65 ? 10 : 0);
      }, g, '#8a3a2a', '#c87050');
      horizonSettlement(u, c, W, g, R, '#9c4c38', '#743022', '#d8825c', '', 'mesa');

      var rx0 = xr(G, 0.20);
      u.profile(c, rx0, W, function (x) {
        return g - 18 - Math.round((x - rx0) * 0.18) - 4 * Math.sin(x / 8);
      }, g + 2, '#6a2c20', '#b85a3a');

      var lx = xr(G, 0.52), ly = g + 2;
      u.px(c, lx - 6, ly - 5, 2, 5, '#8a9ab0');
      u.px(c, lx + 4, ly - 5, 2, 5, '#8a9ab0');
      u.px(c, lx - 8, ly - 1, 4, 1, '#c8d4e0');
      u.px(c, lx + 4, ly - 1, 4, 1, '#c8d4e0');
      u.px(c, lx - 5, ly - 10, 10, 6, '#d8a840');
      u.px(c, lx - 4, ly - 9, 8, 2, '#f8d068');
      u.px(c, lx - 12, ly - 9, 7, 2, '#2a4a7a');
      u.px(c, lx + 5, ly - 9, 7, 2, '#2a4a7a');
      u.px(c, lx - 1, ly - 14, 1, 4, '#c8c0b4');
      u.px(c, lx - 3, ly - 15, 5, 2, '#e8e0d0');

      u.bands(c, ['#b85838', '#a0482e', '#8a3a2a', '#722e22', '#5a241a'], g, H, W, 6);
      groundTexture(u, c, W, H, g, R, { far: '#c87050', midHi: '#dc825e', midSh: '#6a2a1e', foreSh: '#441a12' });

      var px0 = xl(G, 0.44), py0 = g + 3;
      for (var tr = 4; tr < px0 - 10; tr += 3) {
        u.px(c, tr, py0 + 2, 2, 1, '#4a1e16');
        u.px(c, tr + 1, py0 + 4, 2, 1, '#4a1e16');
      }
      for (var w = 0; w < 3; w++) {
        var wx = px0 - 10 + w * 8;
        u.px(c, wx, py0, 4, 4, '#2a2220');
        u.px(c, wx + 1, py0 + 1, 2, 2, '#5a4a44');
      }
      u.px(c, px0 - 9, py0 - 6, 20, 5, '#e8e0d0');
      u.px(c, px0 - 9, py0 - 6, 20, 1, '#f0c8a0');
      u.px(c, px0 - 12, py0 - 5, 4, 4, '#d8a848');
      u.px(c, px0 + 10, py0 - 4, 4, 2, '#8a9ab0');
      u.px(c, px0 + 5, py0 - 15, 2, 9, '#c8c0b4');

      // 3 Şeritli YOĞUN Mars yüzeyi
      var gh = Math.max(20, H - g - 10);
      var s1X = [0.03, 0.10, 0.17, 0.24, 0.31, 0.39, 0.47, 0.55, 0.63, 0.70, 0.77, 0.84, 0.91, 0.96];
      for (var s1 = 0; s1 < s1X.length; s1++) {
        var px1 = Math.round(W * s1X[s1]), py1 = g + Math.round(gh * (0.09 + (s1 % 3) * 0.05));
        rockProp(u, c, px1, py1, 0.7, '#8a3e2c', '#c87050', '#4e1e14');
      }
      var y2a = g + Math.round(gh * 0.42), y2b = g + Math.round(gh * 0.54);
      rockProp(u, c, Math.round(W * 0.04), y2a, 1.8, '#7a3424', '#c86a4a', '#441a12');
      crateProp(u, c, Math.round(W * 0.11), y2b, 1.4, '#c8c0b4', '#e8e0d0', '#6a6258');
      rockProp(u, c, Math.round(W * 0.19), y2a, 1.6, '#6a2c20', '#b85a3a', '#3e1810');
      streetLamp(u, c, Math.round(W * 0.26), y2b, 1.8, '#8a9ab0', '#e8a878', false);
      rockProp(u, c, Math.round(W * 0.32), y2a, 1.5, '#7a3424', '#c86a4a', '#441a12');
      rockProp(u, c, Math.round(W * 0.68), y2a, 1.7, '#7a3424', '#c86a4a', '#441a12');
      crateProp(u, c, Math.round(W * 0.75), y2b, 1.4, '#2a4a7a', '#5a80b8', '#1a2e4c');
      rockProp(u, c, Math.round(W * 0.83), y2a, 1.8, '#6a2c20', '#b85a3a', '#3e1810');
      streetLamp(u, c, Math.round(W * 0.90), y2b, 1.8, '#8a9ab0', '#e8a878', false);
      rockProp(u, c, Math.round(W * 0.95), y2a, 1.6, '#7a3424', '#c86a4a', '#441a12');
      // Şerit 3 (ön, BÜYÜK kayalar, güneş panelleri, örnek kutuları, tekerlek izleri)
      var fy3 = g + Math.round(gh * 0.80);
      rockProp(u, c, Math.round(W * 0.05), fy3, 3.2, '#6a2c20', '#c86a4a', '#3a140e');
      crateProp(u, c, Math.round(W * 0.13), fy3, 2.2, '#b8b0a4', '#e8e0d0', '#5a5248');
      rockProp(u, c, Math.round(W * 0.22), fy3, 2.8, '#7a3424', '#d87a58', '#441a12');
      streetLamp(u, c, Math.round(W * 0.30), fy3, 3.0, '#8a9ab0', '#68d0ff', false);
      for (var ft = Math.round(W * 0.02); ft < Math.round(W * 0.35); ft += 6) {
        u.px(c, ft, fy3 - 8, 4, 2, '#441a12');
        u.px(c, ft + 2, fy3 - 5, 4, 2, '#441a12');
      }
      rockProp(u, c, Math.round(W * 0.69), fy3, 2.9, '#6a2c20', '#c86a4a', '#3a140e');
      crateProp(u, c, Math.round(W * 0.78), fy3, 2.3, '#2a4a7a', '#6890c8', '#1a2e4c');
      rockProp(u, c, Math.round(W * 0.87), fy3, 3.2, '#7a3424', '#d87a58', '#441a12');
      crateProp(u, c, Math.round(W * 0.94), fy3, 2.1, '#c8a840', '#f8d068', '#6a5218');

      return {
        g: g, gh: gh,
        mastX: px0 + 4,
        mastY: py0 - 18,
        heliX: xl(G, 0.88),
        dustX: xr(G, 0.28),
        landerX: lx, landerY: ly,
        clouds: u.makeClouds(u.rng(652), 4, W, H, 0.06, 0.25)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W, g = st.g;
      u.drawClouds(c, st.clouds, t * 0.55, W, ['#a05844', '#c87858', '#e8a878', '#f4c898']);

      var pan = (Math.floor(t * 0.8) % 3) - 1;
      u.px(c, st.mastX + pan, st.mastY, 5, 3, '#f0e8d8');
      u.px(c, st.mastX + pan + 2, st.mastY + 1, 2, 1, '#6a9ad0');

      if (Math.floor(t * 2) % 2 === 0) {
        u.px(c, st.landerX - 1, st.landerY - 16, 2, 2, '#68d0ff');
      }

      var hx = st.heliX + Math.round(Math.sin(t * 0.7) * 8);
      var hy = g - 16 - Math.round((Math.sin(t * 1.4) + 1) * 7);
      u.px(c, hx - 2, hy, 4, 3, '#e8d8c0');
      u.px(c, hx - 3, hy + 3, 1, 2, '#5a4a44');
      u.px(c, hx + 2, hy + 3, 1, 2, '#5a4a44');
      var rot = Math.floor(t * 12) % 2 ? 9 : 4;
      u.px(c, hx - Math.floor(rot / 2), hy - 2, rot, 1, '#f0c8a0');

      var dx = st.dustX + Math.round(Math.sin(t * 0.5) * 10);
      for (var k = 0; k < 12; k++) {
        var sway = Math.round(Math.sin(t * 5 + k * 0.6) * (1 + k * 0.15));
        u.px(c, dx + sway, g - 1 - k * 2, 2 + Math.floor(k / 4), 2, k % 2 ? '#e8a878' : '#f0c8a0');
      }

      for (var ds = 0; ds < 6; ds++) {
        var sx = Math.round(((ds * 43 + t * 28) % (W + 20)) - 10);
        var sy = g + 4 + (ds % 3) * Math.round(st.gh * 0.22);
        u.px(c, sx, sy, 8, 1, 'rgba(240,200,160,0.45)');
      }
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
