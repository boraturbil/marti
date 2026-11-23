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
  function roadTop(G) { return G.H - Math.ceil(46 / (G.S || 3)) - 10; }
  function xl(G, f) { return Math.round(G.W * (0.10 + 0.20 * f)); }
  function xr(G, f) { return Math.round(G.W * (0.70 + 0.20 * f)); }
  function sz(G, k) { return Math.max(3, Math.round(Math.min(G.W * 0.45, G.H) * k)); }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  /* ---------- yerel yardımcılar (yalnız bu dosyada; u'ya ekleme YOK) ---------- */
  // Kubbe yardımcısı: type = 'half' | 'pointed' | 'onion'
  function dome(u, c, cx, base, r, h, type, col, shade, hi, ribCol) {
    var y, f, hw, sx, i;
    for (y = 0; y <= h; y++) {
      f = y / h;
      if (type === 'onion') {
        // Gerçek soğan kubbe: tabanda dar boyun, ortada şişkin gövde, tepede sivri alem
        if (f < 0.16) {
          hw = Math.round(r * (0.72 + 0.16 * (f / 0.16)));
        } else if (f < 0.56) {
          hw = Math.round(r * (0.88 + 0.22 * Math.sin(((f - 0.16) / 0.40) * Math.PI * 0.5)));
        } else if (f < 0.84) {
          hw = Math.round(r * 1.10 * Math.cos(((f - 0.56) / 0.28) * Math.PI * 0.42));
        } else {
          hw = Math.round(r * 0.28 * Math.pow(Math.max(0, 1 - (f - 0.84) / 0.16), 1.15));
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
    u.px(c, cx, base - h - 4, 1, 4, hi || col);
    if (type === 'onion') u.px(c, cx - 1, base - h - 2, 3, 1, '#e8c040');
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
      w = Math.max(1, Math.round(Math.sin((i / h) * Math.PI) * Math.max(2, h * 0.14)));
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

  // Güneşin üstünü kapatmayan katmanlı bulut listesi (üst şerit + güneş altı şerit)
  function makeSafeClouds(R, W, H, sunY, sunR) {
    var topMax = Math.max(0.05, (sunY - sunR - 10) / H);
    var botMin = Math.min(0.42, (sunY + sunR + 12) / H);
    var high = uMakeClouds(R, 3, W, H, 0.03, Math.max(0.04, topMax));
    var low = uMakeClouds(R, 3, W, H, botMin, Math.min(0.44, botMin + 0.12));
    return { high: high, low: low };
    function uMakeClouds(rngFn, n, w, h, y0, y1) {
      var out = [], i, j, parts, k, cw, r;
      for (i = 0; i < n; i++) {
        parts = []; k = 3 + Math.floor(rngFn() * 3); cw = 0;
        for (j = 0; j < k; j++) {
          r = 3 + Math.floor(rngFn() * 5);
          parts.push([cw + r, -Math.floor(rngFn() * 3), r]);
          cw += r + Math.floor(rngFn() * 4);
        }
        out.push({ x: rngFn() * w, y: Math.round(h * (y0 + rngFn() * (y1 - y0))), parts: parts, w: cw + 8, v: 0.4 + rngFn() * 0.8 });
      }
      return out;
    }
  }

  function drawSafeClouds(u, c, clouds, t, W, colsFar, colsNear) {
    u.drawClouds(c, clouds.low, t * 0.45, W, colsFar);
    u.drawClouds(c, clouds.high, t * 0.75, W, colsNear);
  }

  // Güneş/ay ışık huzmesi (dither'lı diyagonal ışınlar, kutusuz)
  function skyRays(u, c, sx, sy, g, W, col) {
    var angles = [-0.65, -0.32, 0.34, 0.68], a, d, rx, ry;
    for (a = 0; a < angles.length; a++) {
      for (d = 18; d < 72; d += 2) {
        rx = Math.round(sx + Math.sin(angles[a]) * d * 1.4);
        ry = Math.round(sy + Math.cos(angles[a]) * d * 0.7);
        if (rx >= 0 && rx < W && ry >= 0 && ry < g - 8 && ((rx + ry) & 1) === 0) {
          u.px(c, rx, ry, 1, 1, col);
        }
      }
    }
  }

  // Ufuk yerleşim silüeti (katmanlı, orta kısım alçak)
  function drawHorizonTown(u, c, g, W, R, style, colFar, colNear, roofCol, treeCol) {
    var x = 4, w, h, midGap;
    while (x < W - 6) {
      midGap = (x > W * 0.34 && x < W * 0.66);
      if (midGap && R() < 0.65) { x += 10 + Math.floor(R() * 12); continue; }
      w = 5 + Math.floor(R() * 7);
      h = midGap ? (3 + Math.floor(R() * 4)) : (5 + Math.floor(R() * 9));
      if (style === 'yurt') {
        u.px(c, x, g - Math.max(3, Math.floor(h * 0.5)), w + 2, Math.max(3, Math.floor(h * 0.5)), colFar);
        u.poly(c, [[x - 1, g - Math.floor(h * 0.5)], [x + Math.floor((w + 2) / 2), g - h], [x + w + 3, g - Math.floor(h * 0.5)]], roofCol);
      } else if (style === 'pagoda') {
        u.px(c, x, g - h, w, h, colFar);
        u.px(c, x - 1, g - h - 1, w + 2, 2, roofCol);
        if (R() < 0.35 && !midGap) u.px(c, x + 1, g - h - 4, Math.max(3, w - 2), 3, colNear);
      } else if (style === 'dome') {
        u.px(c, x, g - h, w, h, colFar);
        if (R() < 0.45) u.halfDisc(c, x + Math.floor(w / 2), g - h, Math.max(2, Math.floor(w * 0.4)), roofCol);
        else u.px(c, x, g - h - 1, w, 1, roofCol);
      } else {
        u.px(c, x, g - h, w, h, R() < 0.5 ? colFar : colNear);
        if (R() < 0.55) {
          u.poly(c, [[x - 1, g - h], [x + Math.floor(w / 2), g - h - 3], [x + w + 1, g - h]], roofCol);
        }
      }
      if (treeCol && R() < 0.45) {
        u.circle(c, x + w + 2, g - 3, 2 + Math.floor(R() * 2), treeCol);
      }
      x += w + 3 + Math.floor(R() * 9);
    }
  }

  // Perspektifli 3 şeritli zemin dokusu (orta yol bandı ve panel altı sakin)
  function drawPerspGround(u, c, W, g, ry, R, cols, mode) {
    var gh = Math.max(12, ry - g), i, f, y, x, sc, isEdge;
    var count = Math.min(85, Math.round(W * 0.16));
    for (i = 0; i < count; i++) {
      f = R();
      y = g + 2 + Math.floor(f * (gh - 4));
      x = Math.floor(R() * W);
      isEdge = (x < W * 0.36 || x > W * 0.64);
      if (!isEdge && f > 0.35) continue; // orta bölge yalnız ufka yakın küçük/soluk
      sc = 0.55 + 0.85 * f;
      if (mode === 'cobble') {
        var cw = Math.max(2, Math.round(3 * sc)), ch = f > 0.6 ? 2 : 1;
        u.px(c, x, y, cw, ch, f < 0.35 ? cols[0] : (R() < 0.5 ? cols[1] : cols[2]));
      } else if (mode === 'sand') {
        var sw = Math.max(2, Math.round((3 + R() * 4) * sc));
        u.px(c, x, y, sw, 1, f < 0.35 ? cols[0] : cols[1]);
        if (f > 0.5 && R() < 0.4) u.px(c, x + 1, y + 1, Math.max(1, sw - 2), 1, cols[2]);
      } else {
        // grass / garden
        var gw = Math.max(1, Math.round(2 * sc));
        u.px(c, x, y, gw, 1, f < 0.35 ? cols[0] : cols[1]);
        if (f > 0.45) u.px(c, x + (R() < 0.5 ? 0 : 1), y - 1, 1, 1, cols[2]);
        if (f > 0.72 && R() < 0.25) u.px(c, x + 1, y - 1, 1, 1, cols[3] || cols[2]);
      }
    }
  }

  // Sivil insan silüeti (ölçekli, opsiyonel yürüyüş adımı)
  function person(u, c, x, y, sc, cloth, skin, hat, step) {
    var h = Math.max(4, Math.round(7 * sc));
    var w = Math.max(2, Math.round(3 * sc));
    var bob = (step === 1 || step === 3) ? -1 : 0;
    var leg = step === 0 ? 0 : (step === 1 ? 1 : (step === 2 ? 0 : -1));
    u.px(c, x - Math.floor(w / 2), y - h + bob, w, Math.max(2, Math.round(h * 0.55)), cloth);
    u.px(c, x - Math.floor(w / 2), y - h - Math.max(1, Math.round(2 * sc)) + bob, Math.max(2, Math.round(2 * sc)), Math.max(2, Math.round(2 * sc)), skin);
    if (hat) u.px(c, x - Math.floor(w / 2) - 1, y - h - Math.max(2, Math.round(3 * sc)) + bob, Math.max(3, w + 1), 1, hat);
    u.px(c, x - 1 + leg, y - Math.max(2, Math.round(h * 0.35)), 1, Math.max(2, Math.round(h * 0.35)), '#3a302a');
    u.px(c, x + 1 - leg, y - Math.max(2, Math.round(h * 0.35)), 1, Math.max(2, Math.round(h * 0.35)), '#3a302a');
  }

  // Dönem arabası / kağnı / yük arabası
  function cart(u, c, x, y, sc, woodCol, cargoCol, wheelCol, dir) {
    var bw = Math.max(6, Math.round(12 * sc)), bh = Math.max(3, Math.round(5 * sc));
    var wr = Math.max(2, Math.round(3 * sc));
    u.px(c, x, y - wr - bh, bw, bh, woodCol);
    u.px(c, x + 1, y - wr - bh - Math.max(2, Math.round(3 * sc)), Math.max(3, bw - 3), Math.max(2, Math.round(3 * sc)), cargoCol);
    u.circle(c, x + 2, y - wr, wr, wheelCol);
    u.circle(c, x + bw - 3, y - wr, wr, wheelCol);
    u.px(c, x + 2, y - wr, 1, 1, woodCol);
    u.px(c, x + bw - 3, y - wr, 1, 1, woodCol);
    var hx = dir > 0 ? x + bw : x - Math.max(4, Math.round(7 * sc));
    u.px(c, hx, y - wr - Math.max(2, Math.round(4 * sc)), Math.max(4, Math.round(6 * sc)), Math.max(2, Math.round(3 * sc)), '#6e4e36');
    u.px(c, dir > 0 ? hx + Math.round(4 * sc) : hx - 1, y - wr - Math.max(4, Math.round(6 * sc)), 2, 3, '#6e4e36');
    u.px(c, hx + 1, y - wr + 1, 1, wr, '#4a3222');
    u.px(c, hx + Math.max(2, Math.round(4 * sc)), y - wr + 1, 1, wr, '#4a3222');
  }

  // Pazar tezgahı (çizgili tente + ahşap tezgah + mallar)
  function marketStall(u, c, x, y, sc, c1, c2, wood) {
    var w = Math.max(7, Math.round(13 * sc)), h = Math.max(5, Math.round(9 * sc));
    u.px(c, x, y - h, 1, h, wood);
    u.px(c, x + w - 1, y - h, 1, h, wood);
    u.px(c, x, y - Math.round(h * 0.42), w, Math.max(2, Math.round(h * 0.42)), wood);
    for (var i = 0; i < w; i += 2) {
      u.px(c, x + i, y - h - 2, Math.min(2, w - i), 3, (i >> 1) % 2 ? c1 : c2);
    }
    u.px(c, x + 2, y - Math.round(h * 0.52), 2, 2, '#d8a840');
    u.px(c, x + Math.floor(w * 0.55), y - Math.round(h * 0.52), 2, 2, '#b85038');
  }

  // Otlayan hayvan (koyun / at / öküz)
  function animal(u, c, x, y, sc, col, legCol, headDown) {
    var w = Math.max(3, Math.round(6 * sc)), h = Math.max(2, Math.round(3 * sc));
    u.px(c, x, y - h - 2, w, h, col);
    u.px(c, x + w - 1, y - h - (headDown ? 1 : 3), Math.max(2, Math.round(2 * sc)), 2, col);
    u.px(c, x + 1, y - 2, 1, 2, legCol);
    u.px(c, x + w - 2, y - 2, 1, 2, legCol);
  }

  // Kayık / sandal
  function boat(u, c, x, y, sc, hull, trim, sail) {
    var w = Math.max(7, Math.round(14 * sc));
    u.poly(c, [[x, y - 2], [x + w, y - 2], [x + w - 2, y + 1], [x + 2, y + 1]], hull);
    u.px(c, x + 1, y - 2, w - 2, 1, trim);
    if (sail) {
      u.px(c, x + Math.floor(w / 2), y - Math.round(8 * sc), 1, Math.round(7 * sc), '#5a4430');
      u.poly(c, [[x + Math.floor(w / 2) + 1, y - Math.round(8 * sc)], [x + Math.floor(w / 2) + Math.round(5 * sc), y - 3], [x + Math.floor(w / 2) + 1, y - 3]], sail);
    } else {
      u.px(c, x + Math.floor(w * 0.45), y - 5, 2, 3, '#c84838');
    }
  }

  // Atlı sprite: 4 kare dörtnala (step = 0..3)
  function horseman(u, c, x, y, step, bodyCol, riderCol, bannerCol) {
    var bob = (step === 1 || step === 3) ? -1 : 0;
    var hy = y + bob;
    u.px(c, x, hy - 5, 7, 3, bodyCol);
    u.px(c, x + 6, hy - 8, 2, 4, bodyCol);
    u.px(c, x + 7, hy - 8, 3, 2, bodyCol);
    u.px(c, x - 2, hy - 5, 2, 2, bodyCol);
    u.px(c, x + 2, hy - 9, 3, 4, riderCol);
    u.px(c, x + 3, hy - 11, 2, 2, riderCol);
    if (bannerCol) {
      u.px(c, x + 1, hy - 16, 1, 10, '#5a4430');
      u.px(c, x - 3, hy - 16, 4, 2, bannerCol);
    }
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
      var W = G.W, H = G.H, g = gy(G), ry = roadTop(G), R = u.rng(301);
      var sx = Math.round(W * 0.50), sy = Math.round(H * 0.16), sr = sz(G, 0.055);
      u.bands(c, ['#4e6ea6', '#7ea0c4', '#b2c8d8', '#f0d8a8'], 0, g, W, 11);
      u.sun(c, sx, sy, sr, ['#f0d8a8', '#f8e8c0', '#fff8e0']);
      skyRays(u, c, sx, sy, g, W, '#f8e8c0');

      // Uzak Levant tepeleri + ufuk yerleşimi
      u.profile(c, 0, W, function (x) {
        return g - 9 - 5 * Math.sin(x / 34) - 3 * Math.sin(x / 13);
      }, g, '#c2a684', '#dcc29e');
      drawHorizonTown(u, c, g, W, R, 'dome', '#b89a78', '#a08262', '#d4b892', '#64764c');

      // SOL: Kayalık üstünde iç içe surlu Krak des Chevaliers tarzı kale
      var lx = xl(G, 0.48), kw = Math.min(Math.round(W * 0.22), sz(G, 0.36));
      var kh = sz(G, 0.24), rockH = sz(G, 0.09), kb = g - rockH + 2;
      u.poly(c, [[lx - Math.round(kw * 0.65), g + 2], [lx - Math.round(kw * 0.52), kb], [lx + Math.round(kw * 0.52), kb], [lx + Math.round(kw * 0.62), g + 2]], '#7a6a5a');
      u.poly(c, [[lx - Math.round(kw * 0.65), g + 2], [lx - Math.round(kw * 0.52), kb], [lx - Math.round(kw * 0.1), kb], [lx - Math.round(kw * 0.2), g + 2]], '#948270');
      u.px(c, lx - Math.round(kw * 0.48), kb - Math.round(kh * 0.58), Math.round(kw * 0.96), Math.round(kh * 0.58), '#c8a070');
      u.px(c, lx - Math.round(kw * 0.48), kb - Math.round(kh * 0.58), Math.round(kw * 0.96), 1, '#e6c89a');
      turret(u, c, lx - Math.round(kw * 0.44), kb, Math.max(5, Math.round(kw * 0.16)), Math.round(kh * 0.72), '#c8a070', '#967248', '#e6c89a');
      turret(u, c, lx + Math.round(kw * 0.44), kb, Math.max(5, Math.round(kw * 0.16)), Math.round(kh * 0.72), '#c8a070', '#967248', '#e6c89a');
      turret(u, c, lx - Math.round(kw * 0.16), kb - Math.round(kh * 0.35), Math.max(6, Math.round(kw * 0.20)), Math.round(kh * 0.75), '#d4b080', '#9e7a50', '#f0d8a8');
      turret(u, c, lx + Math.round(kw * 0.16), kb - Math.round(kh * 0.35), Math.max(6, Math.round(kw * 0.20)), Math.round(kh * 0.75), '#d4b080', '#9e7a50', '#f0d8a8');
      u.px(c, lx - Math.round(kw * 0.16), kb - Math.round(kh * 0.9), Math.round(kw * 0.32), Math.round(kh * 0.55), '#c8a070');
      arch(u, c, lx, kb, Math.max(5, Math.round(kw * 0.16)), Math.round(kh * 0.34), '#4e3e30');
      u.px(c, lx, kb - kh - 10, 1, 7, '#5a4430');
      u.px(c, lx + 1, kb - kh - 10, 4, 3, '#f0ece0');
      u.px(c, lx + 2, kb - kh - 10, 1, 3, '#b8322a');
      u.px(c, lx + 1, kb - kh - 9, 4, 1, '#b8322a');

      // SAĞ: Kudüs surları + Altın Kubbetüs-Sahra + zeytin
      var rx = xr(G, 0.48), rw = Math.min(Math.round(W * 0.22), sz(G, 0.36));
      var rh = sz(G, 0.15), rBase = g + 2;
      u.px(c, rx - Math.round(rw * 0.52), rBase - Math.round(rh * 0.55), Math.round(rw * 1.04), Math.round(rh * 0.55), '#c8a878');
      u.px(c, rx - Math.round(rw * 0.52), rBase - Math.round(rh * 0.55), Math.round(rw * 1.04), 1, '#ebd2a4');
      for (var i = -4; i <= 4; i++) u.px(c, rx + Math.round(i * rw * 0.11), rBase - Math.round(rh * 0.55) - 2, 2, 2, '#c8a878');
      var dw = Math.round(rw * 0.52), dh = Math.round(rh * 0.9), db = rBase - Math.round(rh * 0.55);
      u.px(c, rx - Math.round(dw / 2), db - dh, dw, dh, '#d8c298');
      u.px(c, rx + Math.round(dw * 0.15), db - dh, Math.round(dw * 0.35), dh, '#a88c64');
      u.px(c, rx - Math.round(dw / 2), db - dh, dw, Math.max(2, Math.round(dh * 0.32)), '#3a6a8a');
      u.px(c, rx - Math.round(dw * 0.32), db - dh - 3, Math.round(dw * 0.64), 3, '#c8a878');
      dome(u, c, rx, db - dh - 3, Math.round(dw * 0.31), Math.round(dw * 0.44), 'pointed', '#d8a830', '#a87818', '#f8e070');
      oliveTree(u, c, rx - Math.round(rw * 0.44), rBase, Math.max(3, sz(G, 0.025)), '#6a4e36', '#5a7044', '#7a905a');
      oliveTree(u, c, rx + Math.round(rw * 0.44), rBase, Math.max(3, sz(G, 0.022)), '#6a4e36', '#5a7044', '#7a905a');

      // Zemin (3 perspektif şeridi)
      u.bands(c, ['#d0b080', '#b89464', '#94744c'], g, H, W, 6);
      drawPerspGround(u, c, W, g, ry, R, ['#dcc094', '#a48256', '#7a6040'], 'sand');

      // Sol ön/orta kamp çadırları, taş duvar, zeytin ağacı ve pazar
      var yMid = g + Math.round((ry - g) * 0.45);
      var yNear = g + Math.round((ry - g) * 0.82);
      // Uzak sol çadırlar
      u.poly(c, [[Math.round(W * 0.07), g + 10], [Math.round(W * 0.11), g + 3], [Math.round(W * 0.15), g + 10]], '#e8dec8');
      u.poly(c, [[Math.round(W * 0.14), g + 12], [Math.round(W * 0.18), g + 4], [Math.round(W * 0.22), g + 12]], '#d8ccb2');
      // Orta-yakın sol: pazar tezgahı + zeytin + taşlar
      marketStall(u, c, Math.round(W * 0.08), yNear, 1.0, '#b8322a', '#f0ece0', '#6a4e36');
      oliveTree(u, c, Math.round(W * 0.28), yNear - 2, 5, '#6a4e36', '#5a7044', '#7a905a');
      u.px(c, Math.round(W * 0.03), yNear + 2, 8, 3, '#8a7662');
      // Sağ: kervan/pazar tezgahı + zeytin + çit
      marketStall(u, c, Math.round(W * 0.78), yNear - 2, 0.95, '#3a6a8a', '#f0ece0', '#6a4e36');
      oliveTree(u, c, Math.round(W * 0.91), yNear + 2, 6, '#6a4e36', '#546a3e', '#748a54');
      for (var fx = Math.round(W * 0.67); fx < Math.round(W * 0.76); fx += 4) {
        u.px(c, fx, yMid + 2, 1, 4, '#6a4e36');
        u.px(c, fx, yMid + 3, 4, 1, '#7e6044');
      }

      return {
        g: g, ry: ry, yMid: yMid, yNear: yNear,
        clouds: makeSafeClouds(u.rng(302), W, H, sy, sr)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      drawSafeClouds(u, c, st.clouds, t, W, ['#c4b8aa', '#ded4c4', '#efe6d6', '#f8f2e6'], ['#c0b4a8', '#dfd4c4', '#f4ead8', '#fff8ec']);
      var step = Math.floor(t * 7) % 4;
      // Atlı şövalye & sancaktar (t=0 ve t=2'de ekranda)
      var hy = st.g + Math.max(8, Math.round((st.ry - st.g) * 0.34));
      var hx = Math.round(((t * 14 + W * 0.16) % (W + 70)) - 35);
      u.smoke(c, hx - 4, hy + 2, t * 1.4, '#e6d6b8', 0.65);
      horseman(u, c, hx, hy, step, '#7a5238', '#d8d0c4', '#b8322a');
      horseman(u, c, hx - 14, hy + 1, (step + 2) % 4, '#5a3c28', '#c8c0b4', '#d8a830');

      // Sağdan sola yavaş sivil yük arabası (t=0 ve t=2'de sağ tarafta)
      var cx = Math.round(W * 0.88 - ((t * 5) % Math.max(40, W * 0.25)));
      cart(u, c, cx, st.yMid + 4, 0.85, '#7a583a', '#d8c49a', '#4a3624', -1);

      // Sol ve sağda yürüyen/duran siviller + otlayan eşek/koyun
      var wStep = Math.floor(t * 4) % 4;
      var px1 = Math.round(W * 0.18 + Math.sin(t * 0.5) * 8);
      person(u, c, px1, st.yNear, 1.0, '#b84a38', '#e6bfa0', '#f0ece0', wStep);
      person(u, c, Math.round(W * 0.72), st.yMid + 8, 0.85, '#3a6a8a', '#e6bfa0', null, 0);
      var graze = (Math.floor(t * 1.5) % 2 === 0);
      animal(u, c, Math.round(W * 0.85), st.yMid + 4, 0.9, '#b8b0a0', '#6a5a4a', graze);
      u.birds(c, t, W, G.H, 3, '#5a4a3a', 0.15);
    }
  });

  /* ================= C2 mogol — MOĞOL BOZKIRI (1243 – 1298) ================= */
  S.register('mogol', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), ry = roadTop(G), R = u.rng(311);
      var sx = Math.round(W * 0.46), sy = Math.round(H * 0.15), sr = sz(G, 0.05);
      u.bands(c, ['#3464b4', '#5e90d2', '#8cb8e8', '#e8f0f0'], 0, g, W, 11);
      u.sun(c, sx, sy, sr, ['#e8f0f0', '#f6f8fa', '#ffffff']);
      skyRays(u, c, sx, sy, g, W, '#f2f7fb');

      // Uzakta karlı Altay dağı + bozkır ufuk yurtları & ağaç hattı
      u.profile(c, 0, W, function (x) {
        var rRise = x > W * 0.58 ? (x - W * 0.58) * 0.24 : 0;
        return g - 6 - 5 * Math.sin(x / 31) - rRise * (0.6 + 0.4 * Math.sin(x / 19));
      }, g, '#7892b0', '#e8f0f0');
      drawHorizonTown(u, c, g, W, R, 'yurt', '#90a6be', '#748ca6', '#dce4ec', '#4a684a');

      // SOL: BÜYÜTÜLMÜŞ Beyaz keçe yurtlar (ger) kümesi + kırmızı kapılar
      var lx = xl(G, 0.46), yw = Math.max(18, sz(G, 0.145)), yh = Math.max(12, sz(G, 0.105));
      function yurt(cx, by, w, h) {
        var hw = Math.round(w / 2);
        u.px(c, cx - hw, by - Math.round(h * 0.55), w, Math.round(h * 0.55), '#f0ece0');
        u.px(c, cx + 2, by - Math.round(h * 0.55), hw - 2, Math.round(h * 0.55), '#d4cec0');
        u.poly(c, [[cx - hw - 1, by - Math.round(h * 0.55)], [cx, by - h], [cx + hw + 1, by - Math.round(h * 0.55)]], '#f6f4ec');
        u.poly(c, [[cx, by - h], [cx + hw + 1, by - Math.round(h * 0.55)], [cx + 2, by - Math.round(h * 0.55)]], '#d8d2c4');
        u.px(c, cx - hw, by - Math.round(h * 0.45), w, 1, '#8a4a3a');
        u.px(c, cx - 2, by - Math.round(h * 0.48), 5, Math.round(h * 0.48), '#b8322a');
        u.px(c, cx - 1, by - Math.round(h * 0.48), 1, Math.round(h * 0.48), '#e8c040');
      }
      yurt(lx - Math.round(yw * 0.95), g + 1, Math.round(yw * 0.78), Math.round(yh * 0.78));
      yurt(lx + Math.round(yw * 0.92), g + 2, Math.round(yw * 0.82), Math.round(yh * 0.82));
      yurt(lx, g + 5, yw, yh);

      // SAĞ: BÜYÜTÜLMÜŞ Karakurum taş kaplumbağası + dikilitaş + tuğlar
      var rx = xr(G, 0.46), tw = Math.max(20, sz(G, 0.18));
      var shH = Math.max(7, sz(G, 0.045));
      // Kaplumbağa kaide (büyük ve belirgin)
      u.px(c, rx - Math.round(tw * 0.58), g - 4, Math.round(tw * 1.16), 7, '#84867e');
      u.px(c, rx - Math.round(tw * 0.50), g - 4 - shH, tw, shH, '#a6a89e');
      u.px(c, rx - Math.round(tw * 0.35), g - 5 - shH, Math.round(tw * 0.70), 2, '#c2c4ba');
      // Kaplumbağa başı + ayakları
      u.px(c, rx - Math.round(tw * 0.82), g - 6, 7, 5, '#8e9088');
      u.px(c, rx - Math.round(tw * 0.85), g - 5, 3, 2, '#b6b8ae');
      u.px(c, rx - Math.round(tw * 0.45), g + 1, 4, 3, '#6e7068');
      u.px(c, rx + Math.round(tw * 0.28), g + 1, 4, 3, '#6e7068');
      // Dikilitaş
      var obH = sz(G, 0.21);
      u.px(c, rx - 4, g - 4 - shH - obH, 8, obH, '#c0c0b6');
      u.px(c, rx + 1, g - 4 - shH - obH, 3, obH, '#8c8e86');
      u.px(c, rx - 5, g - 7 - shH - obH, 10, 3, '#a6a89e');
      // Tuğ direkleri
      var t1 = rx - Math.round(tw * 1.05), t2 = rx + Math.round(tw * 0.88);
      u.px(c, t1, g - sz(G, 0.26), 1, sz(G, 0.26) + 3, '#5a4430');
      u.px(c, t2, g - sz(G, 0.22), 1, sz(G, 0.22) + 3, '#5a4430');

      // Bozkır zemini (3 perspektif şeridi)
      u.bands(c, ['#9ab06a', '#829c58', '#6a8a4a'], g, H, W, 6);
      drawPerspGround(u, c, W, g, ry, R, ['#b4c884', '#58743c', '#466030', '#d8d060'], 'grass');

      var yMid = g + Math.round((ry - g) * 0.44);
      var yNear = g + Math.round((ry - g) * 0.82);
      // Sol ön: ahşap çit, yük arabası (kibitka), otlayan sürü
      for (var fx = Math.round(W * 0.04); fx < Math.round(W * 0.19); fx += 5) {
        u.px(c, fx, yMid + 5, 1, 4, '#5a4430');
        u.px(c, fx, yMid + 6, 5, 1, '#785a3e');
      }
      u.px(c, Math.round(W * 0.26), yNear, 7, 3, '#7a7870'); // bozkır kayası
      u.px(c, Math.round(W * 0.72), yNear - 2, 6, 3, '#7a7870');
      // Sağ orta: otlayan at ve koyun sürüsü
      animal(u, c, Math.round(W * 0.74), yMid + 6, 0.9, '#6e462c', '#4a2e1e', true);
      animal(u, c, Math.round(W * 0.81), yMid + 9, 0.85, '#b89468', '#5a4430', false);
      animal(u, c, Math.round(W * 0.87), yNear - 4, 1.0, '#ece8dc', '#5a564c', true);
      animal(u, c, Math.round(W * 0.92), yNear - 2, 1.05, '#dcd8cc', '#5a564c', false);

      return {
        g: g, ry: ry, lx: lx, yh: yh, yMid: yMid, yNear: yNear,
        t1: t1, t2: t2, th1: g - sz(G, 0.26), th2: g - sz(G, 0.22),
        clouds: makeSafeClouds(u.rng(312), W, H, sy, sr)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      drawSafeClouds(u, c, st.clouds, t, W, ['#b8cce0', '#d6e4f2', '#eaf2f8', '#ffffff'], ['#b0c6dc', '#d4e2f0', '#ecf2f8', '#ffffff']);
      // Yurt dumanı
      u.smoke(c, st.lx, st.g - st.yh + 2, t, '#e8ecee', 0.75);
      // Tuğ dalgalanması
      var sway = Math.round(Math.sin(t * 4) * 1.5);
      [[st.t1, st.th1], [st.t2, st.th2]].forEach(function (p) {
        u.px(c, p[0] - 2 + sway, p[1] + 2, 6, 5, '#f0ece0');
        u.px(c, p[0] - 1 + sway, p[1] + 7, 4, 4, '#d4cec0');
        u.px(c, p[0], p[1] - 1, 1, 2, '#d8a830');
      });
      // Dörtnala 3 atlı (t=0 ve t=2'de kesinlikle ekranda!)
      var step = Math.floor(t * 8) % 4;
      var hy = st.g + Math.max(7, Math.round((st.ry - st.g) * 0.30));
      var bx = Math.round(((t * 19 + W * 0.16) % (W + 90)) - 35);
      horseman(u, c, bx, hy, step, '#6e462c', '#9a362a', null);
      horseman(u, c, bx - 16, hy + 2, (step + 1) % 4, '#b89468', '#3a5a8a', null);
      horseman(u, c, bx - 30, hy - 1, (step + 2) % 4, '#3a2c24', '#c88a36', null);

      // Solda yavaş ilerleyen bozkır yük arabası + yürüyen çoban
      var cx = Math.round(((t * 5 + W * 0.08) % (W * 0.32)) + W * 0.02);
      cart(u, c, cx, st.yNear + 1, 1.0, '#785a3e', '#e8e0cc', '#4a3624', 1);
      person(u, c, Math.round(W * 0.79 + Math.sin(t * 0.7) * 6), st.yNear, 1.0, '#9a362a', '#e6bfa0', '#5a4430', Math.floor(t * 3) % 4);
      u.birds(c, t * 1.1, W, G.H, 2, '#3a2c24', 0.14);
    }
  });

  /* ================= C3 bursa — OSMANLI KURULUŞU (1299 – 1405) ================= */
  S.register('bursa', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), ry = roadTop(G), R = u.rng(321);
      var sx = Math.round(W * 0.48), sy = Math.round(H * 0.16), sr = sz(G, 0.05);
      u.bands(c, ['#4474ac', '#729ec8', '#9ec6de', '#f0e8d0'], 0, g, W, 11);
      u.sun(c, sx, sy, sr, ['#f0e8d0', '#faf2d8', '#ffffff']);
      skyRays(u, c, sx, sy, g, W, '#faf2d8');

      // Karlı Uludağ + Bursa ufuk evleri
      u.profile(c, 0, W, function (x) {
        var m = x > W * 0.56 ? (x - W * 0.56) * 0.27 : 0;
        return g - 8 - 4 * Math.sin(x / 36) - m * (0.7 + 0.3 * Math.cos(x / 17));
      }, g, '#6c8aa6', '#e8e8f0');
      drawHorizonTown(u, c, g, W, R, 'house', '#7a8a96', '#667682', '#a85a44', '#385840');

      // SOL: Bursa Ulu Camii
      var lx = xl(G, 0.50), cw = Math.min(Math.round(W * 0.21), sz(G, 0.34));
      var ch = sz(G, 0.14), cb = g + 2;
      u.px(c, lx - Math.round(cw / 2), cb - ch, cw, ch, '#dcd2be');
      u.px(c, lx + Math.round(cw * 0.25), cb - ch, Math.round(cw * 0.25), ch, '#b4a894');
      u.px(c, lx - Math.round(cw / 2), cb - ch, cw, 1, '#f4ecdc');
      var dr = Math.max(3, Math.round(cw / 9));
      for (var d = -1.5; d <= 1.5; d += 1) {
        dome(u, c, Math.round(lx + d * dr * 2.1), cb - ch, dr, Math.round(dr * 0.9), 'half', '#828a92', '#5a626a', '#b6bec6');
      }
      for (var p = -3; p <= 3; p++) {
        u.px(c, lx + Math.round(p * cw * 0.12), cb - Math.round(ch * 0.65), 2, 4, '#5a5046');
      }
      [-Math.round(cw * 0.54), Math.round(cw * 0.52)].forEach(function (dx) {
        var mh = sz(G, 0.29);
        u.px(c, lx + dx, cb - mh, 3, mh, '#dcd2be');
        u.px(c, lx + dx + 2, cb - mh, 1, mh, '#b4a894');
        u.px(c, lx + dx - 1, cb - Math.round(mh * 0.68), 5, 1, '#f4ecdc');
        u.poly(c, [[lx + dx, cb - mh], [lx + dx + 1.5, cb - mh - 5], [lx + dx + 3, cb - mh]], '#5a626a');
      });

      // SAĞ: Yeşil Türbe + selviler + çınar
      var rx = xr(G, 0.45), tw = Math.max(10, sz(G, 0.12)), th = sz(G, 0.15);
      u.px(c, rx - Math.round(tw / 2) - 2, g - 2, tw + 4, 4, '#c8beaa');
      u.px(c, rx - Math.round(tw / 2), g - 2 - th, tw, th, '#2e8a6a');
      u.px(c, rx + Math.round(tw * 0.15), g - 2 - th, Math.round(tw * 0.35), th, '#1f644c');
      u.px(c, rx - Math.round(tw / 2), g - 2 - th, 1, th, '#54b492');
      arch(u, c, rx, g - 2, Math.max(4, Math.round(tw * 0.35)), Math.round(th * 0.55), '#184436');
      dome(u, c, rx, g - 2 - th, Math.round(tw * 0.46), Math.round(tw * 0.55), 'pointed', '#3a9474', '#22604a', '#70cca8');
      cypress(u, c, rx - Math.round(tw * 0.9), g + 2, sz(G, 0.18), '#264836', '#3c684c');
      cypress(u, c, rx + Math.round(tw * 0.85), g + 2, sz(G, 0.15), '#264836', '#3c684c');
      var cxTree = rx + Math.round(tw * 1.45);
      u.px(c, cxTree - 1, g - sz(G, 0.13), 3, sz(G, 0.15), '#5e4634');

      // Zemin (3 perspektif şeridi)
      u.bands(c, ['#7a9a5a', '#648448', '#4c6836'], g, H, W, 6);
      drawPerspGround(u, c, W, g, ry, R, ['#94b472', '#40582c', '#364c24', '#e8d870'], 'grass');

      var yMid = g + Math.round((ry - g) * 0.45);
      var yNear = g + Math.round((ry - g) * 0.82);
      // Sol: Osmanlı pazar tezgahları + taş çeşme + selvi
      marketStall(u, c, Math.round(W * 0.06), yNear, 1.0, '#2e8a6a', '#f4ecdc', '#5e4634');
      marketStall(u, c, Math.round(W * 0.17), yMid + 4, 0.82, '#a83c2a', '#f4ecdc', '#5e4634');
      cypress(u, c, Math.round(W * 0.31), yNear + 1, 18, '#264836', '#3c684c');
      // Sağ: taş çeşme + otlayan koyunlar + selvi
      u.px(c, Math.round(W * 0.69), yNear - 7, 8, 7, '#c8beaa');
      u.px(c, Math.round(W * 0.70), yNear - 4, 6, 3, '#5a7a9a');
      animal(u, c, Math.round(W * 0.84), yMid + 8, 0.9, '#f0ece0', '#5a5046', true);
      animal(u, c, Math.round(W * 0.90), yNear - 2, 1.0, '#e4dec8', '#5a5046', false);

      return {
        g: g, ry: ry, yMid: yMid, yNear: yNear, cxTree: cxTree, cyTree: g - sz(G, 0.14),
        clouds: makeSafeClouds(u.rng(322), W, H, sy, sr)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      drawSafeClouds(u, c, st.clouds, t, W, ['#a6c0d4', '#c8dce8', '#e4eff6', '#ffffff'], ['#9ebad0', '#c4d8e8', '#e2eef6', '#ffffff']);
      var sw = Math.round(Math.sin(t * 2.2));
      u.circle(c, st.cxTree + sw, st.cyTree, 7, '#4c723c');
      u.circle(c, st.cxTree - 4 + sw, st.cyTree + 2, 5, '#5e884a');
      u.circle(c, st.cxTree + 4 + sw, st.cyTree + 2, 5, '#3c5e2e');

      // Uzakta atlı akıncı (t=0 ve t=2'de sağ tarafta görünür)
      var step = Math.floor(t * 6) % 4;
      var hy = st.g + Math.max(6, Math.round((st.ry - st.g) * 0.28));
      var hx = Math.round(W + 25 - ((t * 14 + W * 0.20) % (W + 60)));
      horseman(u, c, hx, hy, step, '#5a3a28', '#8a2a2a', '#2e8a6a');

      // Yavaş ilerleyen kağnı + yürüyen esnaf
      var cx = Math.round(((t * 5 + W * 0.12) % (W * 0.28)) + W * 0.04);
      cart(u, c, cx, st.yNear + 1, 0.95, '#6a4e36', '#c8a878', '#4a3624', 1);
      person(u, c, Math.round(W * 0.77 + Math.sin(t * 0.6) * 6), st.yNear, 1.0, '#2e6a54', '#e6bfa0', '#f0ece0', Math.floor(t * 3) % 4);
      person(u, c, Math.round(W * 0.13), st.yNear + 1, 1.0, '#8a3a2a', '#e6bfa0', '#f0ece0', 0);
      u.birds(c, t, W, G.H, 3, '#3a4a58', 0.17);
    }
  });

  /* ================= C4 yasak_sehir — MİNG YASAK ŞEHİR (1406 – 1439) ================= */
  S.register('yasak_sehir', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), ry = roadTop(G), R = u.rng(331);
      var sx = Math.round(W * 0.50), sy = Math.round(H * 0.20), sr = sz(G, 0.055);
      u.bands(c, ['#323262', '#5e446e', '#8c5878', '#e8a070'], 0, g, W, 11);
      u.sun(c, sx, sy, sr, ['#e8a070', '#f4c08a', '#ffe4b4']);
      skyRays(u, c, sx, sy, g, W, '#f4c08a');

      u.profile(c, 0, W, function (x) {
        return g - 6 - 4 * Math.sin(x / 38) - 2 * Math.cos(x / 15);
      }, g, '#543c5e', '#765278');
      drawHorizonTown(u, c, g, W, R, 'pagoda', '#4a3656', '#3c2c48', '#8a5a68', '#384c3c');

      // SOL: Taihe Salonu
      var lx = xl(G, 0.50), tw = Math.min(Math.round(W * 0.22), sz(G, 0.34));
      var th = sz(G, 0.12), tb = g + 2;
      u.px(c, lx - Math.round(tw * 0.58), tb - 5, Math.round(tw * 1.16), 5, '#e8e2d8');
      u.px(c, lx - Math.round(tw * 0.52), tb - 8, Math.round(tw * 1.04), 3, '#d4ccc0');
      u.px(c, lx - Math.round(tw * 0.58), tb - 5, Math.round(tw * 1.16), 1, '#ffffff');
      u.px(c, lx - Math.round(tw * 0.42), tb - 8 - th, Math.round(tw * 0.84), th, '#c8302a');
      u.px(c, lx + Math.round(tw * 0.12), tb - 8 - th, Math.round(tw * 0.30), th, '#96201c');
      for (var s = -3; s <= 3; s++) u.px(c, lx + Math.round(s * tw * 0.11), tb - 8 - th, 1, th, '#e8c040');
      var r1y = tb - 8 - th;
      u.poly(c, [[lx - Math.round(tw * 0.54), r1y], [lx - Math.round(tw * 0.36), r1y - 6], [lx + Math.round(tw * 0.36), r1y - 6], [lx + Math.round(tw * 0.54), r1y]], '#e8c040');
      u.px(c, lx - Math.round(tw * 0.54), r1y - 1, 2, 1, '#f8dc68');
      u.px(c, lx + Math.round(tw * 0.52), r1y - 1, 2, 1, '#c89e28');
      var r2y = r1y - 6;
      u.px(c, lx - Math.round(tw * 0.30), r2y - 5, Math.round(tw * 0.60), 5, '#c8302a');
      u.poly(c, [[lx - Math.round(tw * 0.42), r2y - 5], [lx - Math.round(tw * 0.24), r2y - 12], [lx + Math.round(tw * 0.24), r2y - 12], [lx + Math.round(tw * 0.42), r2y - 5]], '#e8c040');
      u.px(c, lx - Math.round(tw * 0.24), r2y - 13, Math.round(tw * 0.48), 1, '#f8dc68');

      // SAĞ: Cennet Tapınağı + söğüt
      var rx = xr(G, 0.45), cw = Math.max(12, sz(G, 0.16)), cb = g + 2;
      u.px(c, rx - Math.round(cw * 0.65), cb - 5, Math.round(cw * 1.3), 5, '#e8e2d8');
      u.px(c, rx - Math.round(cw * 0.42), cb - 13, Math.round(cw * 0.84), 8, '#c8302a');
      [
        [cb - 13, Math.round(cw * 0.60), 5],
        [cb - 19, Math.round(cw * 0.44), 5],
        [cb - 25, Math.round(cw * 0.28), 6]
      ].forEach(function (tier) {
        u.poly(c, [[rx - tier[1], tier[0]], [rx, tier[0] - tier[2]], [rx + tier[1], tier[0]]], '#2e5a8a');
        u.px(c, rx - tier[1], tier[0] - 1, tier[1] * 2, 1, '#4c80b4');
      });
      u.px(c, rx, cb - 34, 1, 3, '#e8c040');
      var wx = rx + Math.round(cw * 0.95);
      u.px(c, wx, cb - 16, 2, 16, '#5a4032');
      u.circle(c, wx, cb - 18, 6, '#526e44');
      for (var w = -4; w <= 4; w += 2) u.px(c, wx + w, cb - 14, 1, 7, '#648252');

      // Zemin (3 perspektif şeridi - Ming taş avlu)
      u.bands(c, ['#9a7264', '#7e5c52', '#624640'], g, H, W, 6);
      drawPerspGround(u, c, W, g, ry, R, ['#b48c7c', '#6e4e44', '#503830'], 'cobble');

      var yMid = g + Math.round((ry - g) * 0.44);
      var yNear = g + Math.round((ry - g) * 0.82);
      // Sol: Ming pazar tezgahı + huabiao taş sütunu + kırmızı fener direği
      marketStall(u, c, Math.round(W * 0.08), yNear, 1.0, '#c8302a', '#e8c040', '#5a3a2c');
      u.px(c, Math.round(W * 0.28), yMid - 4, 3, 12, '#e8e2d8');
      u.px(c, Math.round(W * 0.27), yMid - 2, 5, 1, '#d4ccc0');
      // Sağ: mermer korkuluk + taş aslan + söğüt/çam
      u.px(c, Math.round(W * 0.68), yMid + 2, Math.round(W * 0.26), 2, '#d4ccc0');
      for (var bx = Math.round(W * 0.68); bx < Math.round(W * 0.94); bx += 6) u.px(c, bx, yMid - 1, 2, 5, '#e8e2d8');
      u.px(c, Math.round(W * 0.88), yNear - 5, 5, 5, '#b4aca0');

      return {
        g: g, ry: ry, yMid: yMid, yNear: yNear, lx: lx, tw: tw, r1y: r1y, rx: rx, cw: cw,
        clouds: makeSafeClouds(u.rng(332), W, H, sy, sr)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      drawSafeClouds(u, c, st.clouds, t, W, ['#644c72', '#8e627e', '#ba7e84', '#e8aa8a'], ['#5a4468', '#865a78', '#b87a82', '#e8a888']);
      var sw = Math.round(Math.sin(t * 3));
      [st.lx - Math.round(st.tw * 0.46), st.lx + Math.round(st.tw * 0.46)].forEach(function (fx) {
        u.px(c, fx + sw, st.r1y + 1, 2, 3, '#e83a2e');
        u.px(c, fx + sw, st.r1y + 2, 1, 1, '#f8d060');
      });
      // Ejder uçurtması (t=0 ve t=2'de gökyüzünde)
      var kx = Math.round(((t * 11 + W * 0.22) % (W + 50)) - 25);
      var ky = Math.round(G.H * 0.14 + Math.sin(t * 2.2) * 4);
      u.px(c, kx, ky, 4, 3, '#e8c040');
      u.px(c, kx + 1, ky + 1, 2, 1, '#c8302a');
      for (var k = 1; k <= 5; k++) {
        u.px(c, kx - k * 3, ky + Math.round(Math.sin(t * 5 + k) * 2), 2, 2, k % 2 ? '#c8302a' : '#e8c040');
      }
      // Yavaş ilerleyen çekçek / el arabası + yürüyen Ming sivilleri
      var cx = Math.round(((t * 6 + W * 0.06) % (W * 0.28)) + W * 0.04);
      cart(u, c, cx, st.yNear + 1, 0.9, '#6a382c', '#e8c040', '#3a241c', 1);
      var wStep = Math.floor(t * 4) % 4;
      person(u, c, Math.round(W * 0.76 + Math.sin(t * 0.6) * 8), st.yNear, 1.0, '#2e5a8a', '#f0d4b8', '#3a302a', wStep);
      person(u, c, Math.round(W * 0.22), st.yMid + 4, 0.8, '#c8302a', '#f0d4b8', null, 0);
      u.birds(c, t, W, G.H, 3, '#2e2444', 0.16);
    }
  });

  /* ================= C5 ronesans — RÖNESANS FLORANSA (1482 – 1519) ================= */
  S.register('ronesans', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), ry = roadTop(G), R = u.rng(341);
      var sx = Math.round(W * 0.48), sy = Math.round(H * 0.17), sr = sz(G, 0.055);
      u.bands(c, ['#5464a4', '#8a80a4', '#c89ea4', '#f8d0a0'], 0, g, W, 11);
      u.sun(c, sx, sy, sr, ['#f8b888', '#f8d0a0', '#fff4d8']);
      skyRays(u, c, sx, sy, g, W, '#fff0d0');

      u.profile(c, 0, W, function (x) {
        return g - 7 - 5 * Math.sin(x / 35) - 3 * Math.cos(x / 14);
      }, g, '#7a7a64', '#9aa07e');
      drawHorizonTown(u, c, g, W, R, 'house', '#8e867a', '#787066', '#b0503a', '#4a623c');

      // SOL: Floransa Duomo + Giotto çan kulesi
      var lx = xl(G, 0.52), dw = Math.min(Math.round(W * 0.19), sz(G, 0.30));
      var db = g + 2, dh = sz(G, 0.15);
      u.px(c, lx - Math.round(dw * 0.45), db - dh, Math.round(dw * 0.90), dh, '#e8e0d0');
      u.px(c, lx + Math.round(dw * 0.15), db - dh, Math.round(dw * 0.30), dh, '#c4bcac');
      u.px(c, lx - Math.round(dw * 0.45), db - dh + 3, Math.round(dw * 0.90), 2, '#3a6a4a');
      var dr = Math.round(dw * 0.36);
      dome(u, c, lx, db - dh, dr, Math.round(dr * 1.15), 'pointed', '#b0503a', '#823424', '#d87058', '#e8e0d0');
      u.px(c, lx - 2, db - dh - Math.round(dr * 1.15) - 4, 4, 4, '#e8e0d0');
      var cxCamp = lx - Math.round(dw * 0.58), ch = sz(G, 0.32);
      u.px(c, cxCamp - 3, db - ch, 6, ch, '#e8e0d0');
      u.px(c, cxCamp + 1, db - ch, 2, ch, '#c4bcac');
      for (var y = db - ch + 3; y < db - 2; y += 5) u.px(c, cxCamp - 3, y, 6, 1, '#3a6a4a');
      u.px(c, cxCamp - 4, db - ch - 2, 8, 2, '#b0503a');

      // SAĞ: Palazzo Vecchio + Arno + Ponte Vecchio
      var rx = xr(G, 0.46), rw = Math.min(Math.round(W * 0.22), sz(G, 0.34));
      var pxv = rx + Math.round(rw * 0.24), ph = sz(G, 0.14);
      u.px(c, pxv - 8, g - ph, 16, ph, '#c8b496');
      u.px(c, pxv + 3, g - ph, 5, ph, '#a08c70');
      u.px(c, pxv - 3, g - sz(G, 0.29), 6, sz(G, 0.29) - ph + 2, '#d4c0a2');
      u.px(c, pxv - 4, g - sz(G, 0.31), 8, 2, '#a08c70');

      // Zemin (Toskana yeşili + perspektifli Arno nehri kıyısı, yapay kutu yok)
      u.bands(c, ['#7a8a52', '#5e6e3e', '#4c5a32'], g, H, W, 5);
      drawPerspGround(u, c, W, g, ry, R, ['#94a668', '#526234', '#3e4c26', '#e0b860'], 'grass');

      var arnoTopX = Math.round(W * 0.66), arnoBotX = Math.round(W * 0.54);
      u.poly(c, [[arnoTopX, g], [W, g], [W, ry + 2], [arnoBotX, ry + 2]], '#4e6e8e');
      u.poly(c, [[arnoTopX, g], [W, g], [W, g + Math.round((ry - g) * 0.42)], [Math.round((arnoTopX + arnoBotX) * 0.5), g + Math.round((ry - g) * 0.42)]], '#5a7a9a');
      // Taş rıhtım duvarı (Lungarno)
      for (var ay = g; ay <= ry + 2; ay++) {
        var af = (ay - g) / Math.max(1, ry + 2 - g);
        var ax = Math.round(arnoTopX + (arnoBotX - arnoTopX) * af);
        u.px(c, ax - 3, ay, 4, 1, '#c8b496');
        u.px(c, ax - 4, ay, 1, 1, '#e8d8c0');
      }

      // Ponte Vecchio
      var bx = rx - Math.round(rw * 0.18), bw = Math.round(rw * 0.72);
      u.px(c, bx - Math.round(bw / 2), g - 4, bw, 6, '#d8c4a6');
      arch(u, c, bx - Math.round(bw * 0.24), g + 2, Math.max(4, Math.round(bw * 0.26)), 5, '#446282');
      arch(u, c, bx + Math.round(bw * 0.24), g + 2, Math.max(4, Math.round(bw * 0.26)), 5, '#446282');
      for (var h = -2; h <= 2; h++) {
        u.px(c, bx + Math.round(h * bw * 0.17) - 2, g - 8, 4, 4, h % 2 ? '#e8d8c0' : '#d0b08a');
        u.px(c, bx + Math.round(h * bw * 0.17) - 2, g - 9, 4, 1, '#b0503a');
      }

      var yMid = g + Math.round((ry - g) * 0.45);
      var yNear = g + Math.round((ry - g) * 0.82);
      // Sol: Rönesans pazar/ressam tezgahı + selviler + zeytin
      marketStall(u, c, Math.round(W * 0.06), yNear, 1.0, '#b0503a', '#f4ece0', '#6a4e36');
      cypress(u, c, Math.round(W * 0.26), yNear, 18, '#2c4a38', '#446a4e');
      oliveTree(u, c, Math.round(W * 0.31), yMid + 4, 4, '#6a4e36', '#5a7044', '#7a905a');

      return {
        g: g, ry: ry, yMid: yMid, yNear: yNear, rx: rx,
        clouds: makeSafeClouds(u.rng(342), W, H, sy, sr)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      drawSafeClouds(u, c, st.clouds, t, W, ['#b090a4', '#d4a8a8', '#f0c8ac', '#fff0d4'], ['#a8889e', '#cfa4a4', '#eec4a8', '#fff0d0']);
      // Leonardo uçan makinesi (t=0 ve t=2'de görünür)
      var mx = Math.round(((t * 13 + W * 0.18) % (W + 50)) - 25);
      var my = Math.round(G.H * 0.13 + Math.sin(t * 2.5) * 4);
      var flap = Math.floor(t * 7) % 3;
      u.px(c, mx - 2, my, 5, 2, '#7a5230');
      if (flap === 0) {
        u.px(c, mx - 5, my - 3, 4, 2, '#e8dcc4'); u.px(c, mx + 2, my - 3, 4, 2, '#e8dcc4');
      } else if (flap === 1) {
        u.px(c, mx - 6, my - 1, 5, 2, '#e8dcc4'); u.px(c, mx + 2, my - 1, 5, 2, '#e8dcc4');
      } else {
        u.px(c, mx - 5, my + 1, 4, 2, '#e8dcc4'); u.px(c, mx + 2, my + 1, 4, 2, '#e8dcc4');
      }
      // Arno'da yansıma parıltısı + kayık
      for (var i = 0; i < 10; i++) {
        var wx = Math.round(W * 0.64 + ((i * 23 + Math.floor(t * 5) * 3) % Math.max(10, Math.round(W * 0.32))));
        var wy = st.g + 4 + ((i * 7) % Math.max(6, st.ry - st.g - 8));
        u.px(c, wx, wy, 2, 1, '#f8d0a0');
      }
      var bx = Math.round(W * 0.78 + Math.sin(t * 0.45) * Math.max(8, W * 0.08));
      boat(u, c, bx, st.yMid + 8, 1.0, '#5a3a26', '#d8c4a6', null);

      // Solda at arabası + yürüyen Floransalılar
      var cx = Math.round(((t * 5 + W * 0.10) % (W * 0.25)) + W * 0.04);
      cart(u, c, cx, st.yNear + 1, 0.95, '#7a5230', '#d8c0a0', '#4a3220', 1);
      person(u, c, Math.round(W * 0.20 + Math.sin(t * 0.6) * 6), st.yNear, 1.0, '#b0503a', '#f0d4b8', '#4a3628', Math.floor(t * 4) % 4);
      u.birds(c, t, W, G.H, 3, '#fff0d8', 0.15);
    }
  });

  /* ================= C6 tac_mahal — BABÜR TAC MAHAL (1630 – 1679) ================= */
  S.register('tac_mahal', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), ry = roadTop(G), R = u.rng(351);
      var sx = Math.round(W * 0.50), sy = Math.round(H * 0.18), sr = sz(G, 0.055);
      u.bands(c, ['#463668', '#885880', '#c87898', '#f8c0a0'], 0, g, W, 11);
      u.sun(c, sx, sy, sr, ['#f89898', '#f8c0a0', '#ffe8d0']);
      skyRays(u, c, sx, sy, g, W, '#ffd8c4');

      u.profile(c, 0, W, function (x) {
        return g - 5 - 3 * Math.sin(x / 32) - 2 * Math.sin(x / 11);
      }, g, '#4a3e5a', '#6e5676');
      drawHorizonTown(u, c, g, W, R, 'dome', '#5a4868', '#483856', '#8a627a', '#2e523a');

      // SOL: Tac Mahal (gerçek soğan kubbe + kalın 3 katlı minareler)
      var lx = xl(G, 0.50), tw = Math.min(Math.round(W * 0.22), sz(G, 0.36));
      var tb = g + 2, th = sz(G, 0.14);
      u.px(c, lx - Math.round(tw * 0.62), tb - 4, Math.round(tw * 1.24), 4, '#e0d6d4');
      u.px(c, lx - Math.round(tw * 0.62), tb - 4, Math.round(tw * 1.24), 1, '#ffffff');
      var mw = Math.round(tw * 0.64), mb = tb - 4;
      u.px(c, lx - Math.round(mw / 2), mb - th, mw, th, '#f8f0e8');
      u.px(c, lx + Math.round(mw * 0.18), mb - th, Math.round(mw * 0.32), th, '#d4c8cc');
      u.px(c, lx - Math.round(mw / 2), mb - th, 1, th, '#ffffff');
      arch(u, c, lx, mb, Math.max(6, Math.round(mw * 0.36)), Math.round(th * 0.72), '#7a6874');
      // Büyük gerçek soğan kubbe + 2 chhatri
      dome(u, c, lx, mb - th, Math.round(mw * 0.32), Math.round(mw * 0.50), 'onion', '#f8f0e8', '#cfc2c6', '#ffffff');
      dome(u, c, lx - Math.round(mw * 0.36), mb - th, Math.max(3, Math.round(mw * 0.11)), Math.max(4, Math.round(mw * 0.17)), 'onion', '#f8f0e8', '#cfc2c6', '#ffffff');
      dome(u, c, lx + Math.round(mw * 0.36), mb - th, Math.max(3, Math.round(mw * 0.11)), Math.max(4, Math.round(mw * 0.17)), 'onion', '#f8f0e8', '#cfc2c6', '#ffffff');
      // 4 kalın 3 katlı minare
      [-0.58, -0.42, 0.42, 0.58].forEach(function (f, idx) {
        var mx = lx + Math.round(tw * f);
        var mh = Math.round(th * (idx === 0 || idx === 3 ? 1.42 : 1.12));
        var mwMin = (idx === 0 || idx === 3) ? 4 : 3;
        u.px(c, mx - Math.floor(mwMin / 2), mb - mh, mwMin, mh, '#f8f0e8');
        u.px(c, mx, mb - mh, Math.ceil(mwMin / 2), mh, '#cfc2c6');
        // 3 katlı şerefe / balkon halkaları
        [0.33, 0.66, 0.92].forEach(function (tf) {
          var ty = mb - Math.round(mh * tf);
          u.px(c, mx - Math.floor(mwMin / 2) - 1, ty, mwMin + 2, 2, '#e0d6d4');
          u.px(c, mx - Math.floor(mwMin / 2) - 1, ty, mwMin + 2, 1, '#ffffff');
        });
        dome(u, c, mx, mb - mh - 1, 2, 3, 'onion', '#f8f0e8', '#cfc2c6', '#ffffff');
      });

      // SAĞ: Kızıl Kale + selvi
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

      // Zemin (3 perspektif şeridi + perspektifli Babür bahçe havuzu)
      u.bands(c, ['#4a744a', '#3a603c', '#2e4e30'], g, H, W, 5);
      drawPerspGround(u, c, W, g, ry, R, ['#689264', '#385838', '#2a462a', '#e88868'], 'grass');

      // Perspektifli Charbagh su kanalı (yapay dikdörtgen değil, derinlikli kenar taşlı havuz)
      var pTopL = Math.round(W * 0.72), pTopR = Math.round(W * 0.90);
      var pBotL = Math.round(W * 0.64), pBotR = Math.round(W * 0.96);
      u.poly(c, [[pTopL - 2, g + 2], [pTopR + 2, g + 2], [pBotR + 3, ry - 2], [pBotL - 3, ry - 2]], '#e0d6d4');
      u.poly(c, [[pTopL, g + 3], [pTopR, g + 3], [pBotR, ry - 3], [pBotL, ry - 3]], '#6a7a9e');

      var yMid = g + Math.round((ry - g) * 0.45);
      var yNear = g + Math.round((ry - g) * 0.82);
      // Sol Babür bahçesi: selviler, çiçek tarhı, pazar/çardak
      cypress(u, c, Math.round(W * 0.06), yNear, 19, '#2e583e', '#447654');
      cypress(u, c, Math.round(W * 0.29), yMid + 5, 13, '#2e583e', '#447654');
      marketStall(u, c, Math.round(W * 0.14), yNear, 0.95, '#c8302a', '#f8f0e8', '#6a4e36');

      return {
        g: g, ry: ry, yMid: yMid, yNear: yNear,
        clouds: makeSafeClouds(u.rng(352), W, H, sy, sr)
      };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W;
      drawSafeClouds(u, c, st.clouds, t, W, ['#946082', '#ce809e', '#f0a4ac', '#ffd6cc'], ['#8e5a7e', '#c87a9a', '#ee9ea8', '#ffd2c8']);
      // Kanalda dalga yansıması
      for (var i = 0; i < 10; i++) {
        var wx = Math.round(W * 0.68 + ((i * 19 + Math.floor(t * 4) * 2) % Math.max(8, Math.round(W * 0.24))));
        var wy = st.g + 4 + ((i * 5) % Math.max(4, st.ry - st.g - 10));
        u.px(c, wx, wy, 2, 1, i % 2 ? '#f8c0a0' : '#f8f0e8');
      }
      // Süslü fil bahçe yolunda yürür (4 kare, su havuzuna girmeden t=0 ve t=2'de ekranda)
      var step = Math.floor(t * 5) % 4;
      var walkSpan = Math.max(40, Math.round(W * 0.44));
      var ex = Math.round(W * 0.54 - ((t * 9 + W * 0.14) % walkSpan));
      var ey = st.g + Math.max(6, Math.round((st.ry - st.g) * 0.34));
      var sw = (step === 1 || step === 3) ? 1 : 0;
      u.px(c, ex, ey - 7, 10, 6, '#7a7478');
      u.px(c, ex - 3, ey - 8, 4, 5, '#8a8488');
      u.px(c, ex - 4, ey - 5 + sw, 2, 4, '#7a7478');
      u.px(c, ex - 4, ey - 4, 2, 1, '#f8f0e8');
      u.px(c, ex + 2, ey - 9, 5, 2, '#c8302a');
      u.px(c, ex + 3, ey - 10, 3, 1, '#e8c040');
      var l1 = step === 0 ? 1 : (step === 2 ? -1 : 0);
      var l2 = -l1;
      u.px(c, ex + 1 + l1, ey - 1, 2, 3, '#686266');
      u.px(c, ex + 4 + l2, ey - 1, 2, 3, '#686266');
      u.px(c, ex + 7 + l1, ey - 1, 2, 3, '#686266');

      // Bahçede yürüyen ziyaretçiler + solda Babür arabası
      var cx = Math.round(((t * 4.5 + W * 0.08) % (W * 0.24)) + W * 0.03);
      cart(u, c, cx, st.yNear + 1, 0.9, '#8a5a3a', '#f8f0e8', '#5a3a24', 1);
      person(u, c, Math.round(W * 0.24 + Math.sin(t * 0.5) * 6), st.yNear, 1.0, '#e8c040', '#c89878', '#f8f0e8', Math.floor(t * 3) % 4);
      person(u, c, Math.round(W * 0.62), st.yMid + 4, 0.85, '#f8f0e8', '#c89878', '#c8302a', 0);
      u.birds(c, t * 1.1, W, G.H, 3, '#58b458', 0.16);
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
