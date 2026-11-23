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

  function flame(u, c, x, y, ph, s) {
    s = s || 1;
    var h = (ph === 1 ? 5 : (ph === 2 ? 3 : 4)) * s;
    u.px(c, x - s, y - h, 2 * s + 1, h, '#e86830');
    u.px(c, x, y - h + s, s, Math.max(1, h - s), '#ffcf60');
    if (ph !== 2) u.px(c, x + (ph ? -1 : 1), y - h - 1, 1, 1, '#fff4b8');
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
      u.bands(c, ['#2a2140', '#6b3f5e', '#d9774a', '#f2b766'], 0, g, W, 11);
      u.stars(c, R, 22, W, Math.round(H * 0.25), '#ffe6c8');
      u.sun(c, Math.round(W * 0.5), g - Math.round(H * 0.10), 13, ['#d9774a', '#f2b766', '#ffe8a8'], g);
      u.profile(c, 0, W, function (x) { return g - 8 - 5 * Math.sin(x / 37) - 3 * Math.sin(x / 13); }, g, '#52344e', '#7a4a62');

      // Zemin
      u.bands(c, ['#c9a37a', '#9a7a58', '#6a5038'], g, H, W, 6);
      for (var p = 0; p < 36; p++) {
        var px0 = Math.floor(R() * W), py0 = g + 2 + Math.floor(R() * Math.max(4, H - g - 20));
        u.px(c, px0, py0, 2, 1, R() < 0.5 ? '#7e5e44' : '#d8b48c');
      }

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

      // Sağ: kazılmamış ikinci halka + kayalık tepe + başaklar + avcı ateşi
      var rx = xr(G, 0.55), rb = g + 5;
      u.profile(c, W * 0.70, W, function (x) {
        return Math.min(g + 3, g - 16 - 8 * Math.sin((x - W * 0.70) / 14) + Math.max(0, W * 0.78 - x) * 0.55);
      }, g + 3, '#6e4e44', '#9a7460');
      for (var k = -3; k <= 3; k++) {
        stoneBlock(u, c, rx + k * 6 - 3, rb - 5 + Math.abs(k), 6, 5, '#9a7a58', '#c9a37a', '#5a4434', R);
      }
      var fx = xr(G, 0.22), fy = g + 7;
      u.px(c, fx - 3, fy, 6, 2, '#4a3228');
      u.px(c, fx - 2, fy - 1, 4, 1, '#d9774a');

      var wheat = [];
      for (var wi = 0; wi < 8; wi++) {
        var wx = xr(G, 0.08 + wi * 0.11);
        var wy = g + 3 + (wi % 3) * 2;
        var wh = 5 + (wi % 3) * 2;
        u.px(c, wx, wy - wh, 1, wh, '#8e7438');
        wheat.push({ x: wx, y: wy - wh });
      }

      return {
        g: g, fx: fx, fy: fy, wheat: wheat,
        clouds: u.makeClouds(u.rng(102), 3, W, H, 0.06, 0.24)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.5, G.W, ['#4c2f4f', '#8e4f62', '#d9774a', '#f2b766']);
      var ph = Math.floor(t * 6) % 3;
      flame(u, c, st.fx, st.fy, ph, 1);
      u.smoke(c, st.fx, st.fy - 5, t, '#9c7d8c', 0.7);
      var sw = Math.floor(t * 2) % 2 ? 1 : 0;
      for (var i = 0; i < st.wheat.length; i++) {
        var w = st.wheat[i];
        u.px(c, w.x + (i % 2 ? sw : -sw), w.y - 2, 2, 2, '#f2b766');
      }
      u.birds(c, t, G.W, G.H, 3, '#2a2140', 0.24);
    }
  });

  /* ================= A2: ur_ziggurat — SÜMER UR (-3500 – -2601) ================= */
  S.register('ur_ziggurat', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(111);
      u.bands(c, ['#4a6fa5', '#9cc2d8', '#f3e2b0'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), Math.round(H * 0.21), 13, ['#e8b86a', '#f3e2b0', '#fff9dc'], g);
      u.profile(c, 0, W, function (x) { return g - 5 - 3 * Math.sin(x / 43) - 2 * Math.sin(x / 17); }, g, '#b89468', '#d6b488');

      // Zemin
      u.bands(c, ['#d2aa78', '#b48a5a', '#7e5e3a'], g, H, W, 6);

      // Sol: 3 katlı basamaklı Ur Zigguratı + merkezi merdiven + tepe tapınağı
      var zx = xl(G, 0.5), zw = sz(G, 0.42), zh = sz(G, 0.36);
      var zb = g + 6;
      var h1 = Math.round(zh * 0.42), h2 = Math.round(zh * 0.32), h3 = zh - h1 - h2;
      var w1 = zw, w2 = Math.round(zw * 0.72), w3 = Math.round(zw * 0.46);
      var cols = ['#c8955a', '#b6844c', '#e6bc82', '#7a5a3a'];
      stoneWall(u, c, zx - Math.floor(w1 / 2), zb - h1, w1, h1, 6, 3, cols, R);
      stoneWall(u, c, zx - Math.floor(w2 / 2), zb - h1 - h2, w2, h2, 5, 3, cols, R);
      stoneWall(u, c, zx - Math.floor(w3 / 2), zb - zh, w3, h3, 4, 2, cols, R);
      // Payanda çizgileri
      for (var b = -3; b <= 3; b++) {
        if (b === 0) continue;
        u.px(c, zx + Math.round(b * w1 * 0.13), zb - h1 + 1, 2, h1 - 1, '#986c3c');
      }
      // Merkezi merdiven
      var sw = Math.max(5, Math.round(w1 * 0.16));
      u.px(c, zx - Math.floor(sw / 2) - 1, zb - h1 - h2, sw + 2, h1 + h2, '#7a5a3a');
      for (var sy = zb - h1 - h2; sy < zb; sy += 2) {
        u.px(c, zx - Math.floor(sw / 2), sy, sw, 1, '#e6bc82');
      }
      // Tepe tapınağı + meşale
      var tw = Math.max(8, Math.round(w3 * 0.55)), th = Math.max(5, Math.round(zh * 0.16));
      stoneBlock(u, c, zx - Math.floor(tw / 2), zb - zh - th, tw, th, '#d8ac74', '#f3e2b0', '#7a5a3a', R);
      u.px(c, zx - 1, zb - zh - th + 2, 2, th - 2, '#3a2a1e');
      var tx = zx + Math.floor(tw / 2) + 3, ty = zb - zh - 2;
      u.px(c, tx, ty - 2, 1, 3, '#5a3a24');

      // Sağ: Fırat kıyısı + mudhif kamış evi + sazlık + hurmalar
      var rivX = xr(G, 0.05), rivW = W - rivX;
      var rivY = g + 5, rivH = Math.max(6, Math.round((H - g) * 0.30));
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
      // Sazlık
      for (var rdx = rivX + 3; rdx < rivX + 20; rdx += 3) {
        u.px(c, rdx, rivY - 4, 1, 5, '#4e7e3e');
        u.px(c, rdx, rivY - 5, 1, 2, '#6a482c');
      }
      var palm1X = xr(G, 0.78), palm2X = xr(G, 0.88);
      palmTree(u, c, palm1X, mb + 1, sz(G, 0.22), 0);
      palmTree(u, c, palm2X, mb + 2, sz(G, 0.17), 0);

      return {
        g: g, tx: tx, ty: ty - 2, rivX: rivX, rivW: rivW, rivY: rivY + Math.floor(rivH * 0.45),
        palmX: palm1X, palmTop: mb + 1 - sz(G, 0.22),
        clouds: u.makeClouds(u.rng(112), 4, W, H, 0.05, 0.24)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.7, G.W, ['#7fa2c4', '#b4d2e4', '#e8eef0', '#fff9e6']);
      flame(u, c, st.tx, st.ty, Math.floor(t * 6) % 3, 1);
      // Kamış kayık sağdan sola süzülür
      var span = st.rivW + 18;
      var bx = st.rivX + st.rivW - Math.round(((t * 6) % span));
      if (bx > st.rivX - 8 && bx < G.W) {
        u.px(c, bx, st.rivY, 10, 2, '#8c6438');
        u.px(c, bx - 1, st.rivY - 1, 2, 1, '#b48a58');
        u.px(c, bx + 9, st.rivY - 1, 2, 1, '#b48a58');
        u.px(c, bx + 4, st.rivY - 3, 2, 3, '#5a3a24');
      }
      // Hurma yaprağı salınımı
      var sw = Math.floor(t * 2) % 2 ? 1 : -1;
      u.px(c, st.palmX + 7 + sw, st.palmTop + 2, 2, 1, '#4d8848');
      u.birds(c, t, G.W, G.H, 3, '#4a3e38', 0.22);
    }
  });

  /* ================= A3: hattusa — HİTİT HATTUŞA (-1600 – -1201) ================= */
  S.register('hattusa', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(121);
      u.bands(c, ['#5b86b8', '#a9c9e0', '#e8d9a8'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.52), Math.round(H * 0.19), 12, ['#e8c878', '#f8e6a8', '#ffffff'], g);
      u.profile(c, 0, W, function (x) { return g - 12 - 7 * Math.sin(x / 31) - 4 * Math.sin(x / 11); }, g, '#868464', '#a8a682');

      // Zemin
      u.bands(c, ['#c0a882', '#a08866', '#6e5c44'], g, H, W, 6);

      // Sol: Aslanlı Kapı (iki kule + kesme taş sur + kemer + iki aslan başı)
      var lx = xl(G, 0.48), gw = sz(G, 0.36), gh = sz(G, 0.34);
      var lb = g + 6;
      var tw = Math.max(8, Math.round(gw * 0.28));
      var cols = ['#a88a5c', '#987c50', '#cab086', '#5e4c36'];
      // Surlar ve kuleler
      stoneWall(u, c, lx - Math.floor(gw / 2), lb - gh, tw, gh, 5, 4, cols, R);
      stoneWall(u, c, lx + Math.floor(gw / 2) - tw, lb - gh, tw, gh, 5, 4, cols, R);
      stoneWall(u, c, lx - Math.floor(gw / 2) + tw, lb - Math.round(gh * 0.72), gw - tw * 2, Math.round(gh * 0.72), 5, 4, cols, R);
      // Mazgal dişleri (kuleler ve orta duvar ayrı yükseklikte)
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
      // Parabolik Hitit kapı kemeri
      var aw = Math.max(8, Math.round(gw * 0.32)), ah = Math.round(gh * 0.52);
      for (var ay = 0; ay < ah; ay++) {
        var half = Math.round((aw * 0.5) * Math.sqrt(ay / ah));
        u.px(c, lx - Math.max(2, half), lb - ah + ay, Math.max(4, half * 2), 1, '#261e18');
      }
      // İki yanda aslan kabartmaları
      var lOff = Math.floor(aw * 0.5) + 2;
      [lx - lOff - 4, lx + lOff].forEach(function (ax, idx) {
        var ay0 = lb - Math.round(ah * 0.68);
        u.px(c, ax, ay0, 5, 6, '#b89a6c');
        u.px(c, ax + (idx ? 1 : 0), ay0 + 1, 4, 3, '#e2ca9e');
        u.px(c, ax + 1, ay0 + 4, 3, 2, '#5e4c36');
      });

      // Sağ: Yazılıkaya kaya kabartması (yürüyen 10 tanrı silueti) + bozkır tepesi
      var rx = xr(G, 0.55), rw = sz(G, 0.36), rh = sz(G, 0.28);
      var rb = g + 5;
      u.profile(c, rx - Math.floor(rw * 0.6), W, function (x) {
        return rb - rh + Math.abs(x - rx) * 0.25 - 3 * Math.sin(x / 7);
      }, rb + 1, '#7e7054', '#a49474');
      var pxStart = rx - Math.floor(rw * 0.42), pw = Math.round(rw * 0.84);
      u.px(c, pxStart, rb - Math.round(rh * 0.58), pw, Math.round(rh * 0.48), '#60543e');
      var count = 9, step = Math.max(2, Math.floor((pw - 4) / count));
      for (var fi = 0; fi < count; fi++) {
        var fx = pxStart + 2 + fi * step;
        var fy = rb - Math.round(rh * 0.16);
        u.px(c, fx, fy - 6, 2, 6, '#3a3024');
        u.px(c, fx, fy - 8, 1, 2, '#4a3e30');
        u.px(c, fx + 1, fy - 6, 1, 4, '#b8a480');
      }

      return {
        g: g,
        clouds: u.makeClouds(u.rng(122), 4, W, H, 0.05, 0.25)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.8, G.W, ['#8cb0d4', '#bdd8ec', '#e6f0f8', '#ffffff']);
      // Uzakta iki atlı Hitit savaş arabası
      var cx = Math.round(((t * 14) % (G.W + 40)) - 20);
      var cy = st.g - 3;
      var wf = Math.floor(t * 8) % 2;
      // Araba gövdesi + tekerlek
      u.px(c, cx, cy - 4, 6, 3, '#6e5c44');
      u.px(c, cx + 1, cy - 6, 2, 2, '#3a2e22');
      u.circle(c, cx + 2, cy - 1, 2, '#4a3828');
      u.px(c, cx + 2, cy - 1, 1, 1, wf ? '#cab086' : '#3a2e22');
      // İki at
      u.px(c, cx + 6, cy - 3, 7, 1, '#5e4c36');
      u.px(c, cx + 8, cy - 4, 5, 2, '#4a3624');
      u.px(c, cx + 12, cy - 6, 2, 2, '#4a3624');
      u.px(c, cx + 8 + wf, cy - 2, 1, 2, '#4a3624');
      u.px(c, cx + 11 - wf, cy - 2, 1, 2, '#4a3624');
      // Süzülen kartal
      var ex = Math.round(G.W - ((t * 9) % (G.W + 30)));
      var ey = Math.round(G.H * 0.26 + Math.sin(t * 1.4) * 3);
      u.px(c, ex - 3, ey, 7, 1, '#3a3028');
      u.px(c, ex - 1, ey - 1, 3, 2, '#4a3e32');
    }
  });

  /* ================= A4: truva — TRUVA (-1200 – -801) ================= */
  S.register('truva', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(131);
      u.bands(c, ['#3a2e5e', '#b0506a', '#f08a5a', '#ffd08a'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), g - 12, 15, ['#f08a5a', '#ffd08a', '#fff6d4'], g);
      u.profile(c, 0, W, function (x) { return g - 6 - 4 * Math.sin(x / 35) - 2 * Math.sin(x / 15); }, g, '#683c54', '#9a5468');

      // Zemin
      u.bands(c, ['#c8b08a', '#a8906c', '#76603e'], g, H, W, 6);

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
      // Kule
      var tw = Math.max(8, Math.round(lw * 0.34)), th = Math.round(lh * 0.45);
      stoneWall(u, c, lx + Math.floor(lw * 0.12), topY - th, tw, th, 4, 3, ['#b4966e', '#a48660', '#dcc098', '#6e523a'], R);
      for (var bx = lx - Math.floor(lw * 0.5); bx < lx + Math.floor(lw * 0.5); bx += 4) {
        u.px(c, bx, topY - 2, 2, 2, '#b4966e');
      }
      // Kapı
      u.px(c, lx - 4, lb - Math.round(lh * 0.48), 8, Math.round(lh * 0.48), '#2c1e24');
      var t1x = lx - 6, t2x = lx + 6, ty0 = lb - Math.round(lh * 0.52);

      // Sağ: Kıyı deniz şeridi + Akha gemileri + tekerlekli Truva Atı
      var seaY = g - 3, seaH = 7;
      u.px(c, Math.round(W * 0.62), seaY, Math.round(W * 0.38), seaH, '#2e5a7a');
      u.px(c, Math.round(W * 0.62), seaY, Math.round(W * 0.38), 1, '#f08a5a');

      // Truva atı (sağ ön)
      var hx = xr(G, 0.45), hb = g + 8;
      var hs = Math.max(1, Math.round(sz(G, 0.24) / 18));
      // Tekerlekli platform
      u.px(c, hx - 10 * hs, hb - 3 * hs, 20 * hs, 2 * hs, '#6a4428');
      u.circle(c, hx - 7 * hs, hb - hs, hs + 1, '#4a2e1a');
      u.circle(c, hx + 7 * hs, hb - hs, hs + 1, '#4a2e1a');
      // Bacaklar
      u.px(c, hx - 7 * hs, hb - 10 * hs, 2 * hs, 7 * hs, '#8c5832');
      u.px(c, hx + 5 * hs, hb - 10 * hs, 2 * hs, 7 * hs, '#8c5832');
      // Gövde
      u.px(c, hx - 8 * hs, hb - 16 * hs, 16 * hs, 6 * hs, '#9e643a');
      u.px(c, hx - 8 * hs, hb - 16 * hs, 16 * hs, hs, '#c48654');
      u.px(c, hx - 2 * hs, hb - 14 * hs, 3 * hs, 3 * hs, '#5e3820');
      // Boyun + baş + kuyruk
      u.px(c, hx - 8 * hs, hb - 22 * hs, 4 * hs, 7 * hs, '#9e643a');
      u.px(c, hx - 12 * hs, hb - 23 * hs, 6 * hs, 3 * hs, '#b47848');
      u.px(c, hx + 8 * hs, hb - 15 * hs, 2 * hs, 5 * hs, '#5e3820');

      return {
        g: g, t1x: t1x, t2x: t2x, ty: ty0,
        seaY: seaY,
        ships: [xr(G, 0.15), xr(G, 0.78)],
        clouds: u.makeClouds(u.rng(132), 4, W, H, 0.06, 0.25)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.6, G.W, ['#6a3e62', '#b0506a', '#f08a5a', '#ffd08a']);
      var ph = Math.floor(t * 6) % 3;
      flame(u, c, st.t1x, st.ty, ph, 1);
      flame(u, c, st.t2x, st.ty, (ph + 1) % 3, 1);
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
        var gx = Math.round(G.W * 0.65 + ((k * 31 + Math.floor(t * 3) * 7) % Math.round(G.W * 0.32)));
        u.px(c, gx, st.seaY + 2 + (k % 3) * 2, 2, 1, '#ffd08a');
      }
      u.birds(c, t, G.W, G.H, 3, '#3a2e5e', 0.20);
    }
  });

  /* ================= A5: babil — BABİL (-800 – -501) ================= */
  S.register('babil', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(141);
      u.bands(c, ['#2b2a5a', '#6e4a7e', '#e2865a', '#ffcf80'], 0, g, W, 11);
      u.stars(c, R, 16, W, Math.round(H * 0.24), '#ffe8b8');
      u.sun(c, Math.round(W * 0.5), Math.round(H * 0.22), 12, ['#e2865a', '#ffcf80', '#fff4cc'], g);
      // Uzakta Etemenanki silueti (sağ-orta sınırında)
      var ex = Math.round(W * 0.69), eb = g;
      u.px(c, ex - 12, eb - 8, 24, 8, '#5a3e62');
      u.px(c, ex - 9, eb - 15, 18, 7, '#5a3e62');
      u.px(c, ex - 6, eb - 21, 12, 6, '#5a3e62');
      u.px(c, ex - 3, eb - 25, 6, 4, '#6e4a7e');

      // Zemin
      u.bands(c, ['#d8ba84', '#b89a64', '#84683e'], g, H, W, 6);

      // Sol: Lacivert sırlı İştar Kapısı + sarı aslan/ejder sıraları
      var lx = xl(G, 0.48), iw = sz(G, 0.36), ih = sz(G, 0.38);
      var ib = g + 6;
      var tw = Math.max(8, Math.round(iw * 0.28));
      var bCols = ['#1f4fa0', '#1a4288', '#3872cc', '#122e66'];
      stoneWall(u, c, lx - Math.floor(iw / 2), ib - ih, tw, ih, 5, 3, bCols, R);
      stoneWall(u, c, lx + Math.floor(iw / 2) - tw, ib - ih, tw, ih, 5, 3, bCols, R);
      stoneWall(u, c, lx - Math.floor(iw / 2) + tw, ib - Math.round(ih * 0.78), iw - tw * 2, Math.round(ih * 0.78), 5, 3, bCols, R);
      // Mazgal dişleri
      for (var cx = lx - Math.floor(iw / 2); cx < lx + Math.floor(iw / 2); cx += 4) {
        u.px(c, cx, ib - ih - 3, 2, 3, '#1f4fa0');
        u.px(c, cx, ib - ih - 3, 2, 1, '#d8b040');
      }
      // Kemer
      var aw = Math.max(8, Math.round(iw * 0.34)), ah = Math.round(ih * 0.48);
      for (var ay = 0; ay < ah; ay++) {
        var half = Math.round((aw * 0.5) * Math.sqrt(ay / ah));
        u.px(c, lx - Math.max(2, half), ib - ah + ay, Math.max(4, half * 2), 1, '#121028');
      }
      // Sarı kabartma sıraları
      for (var ry = ib - Math.round(ih * 0.76); ry < ib - 4; ry += 7) {
        u.px(c, lx - Math.floor(iw / 2) + 2, ry, 3, 2, '#d8b040');
        u.px(c, lx + Math.floor(iw / 2) - 5, ry, 3, 2, '#ffcf80');
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
        // Kemerli nişler
        for (var nx = rx - Math.floor(tW * 0.35); nx < rx + Math.floor(tW * 0.35); nx += 6) {
          u.px(c, nx, ty + 2, 3, tH - 3, '#4a3222');
        }
        // Sarkan yeşillik
        for (var gx = rx - Math.floor(tW / 2); gx < rx + Math.floor(tW / 2); gx += 3) {
          var drop = 2 + ((gx * 7 + tier * 3) % 4);
          u.px(c, gx, ty - 1, 2, drop, (gx % 2) ? '#3a7a42' : '#58a256');
        }
      }
      palmTree(u, c, rx - Math.round(rw * 0.16), rb - rh, sz(G, 0.16), 0);

      return {
        g: g, wfX: wfX, wfY0: wfY0, wfH: rh - 5,
        palmX: rx - Math.round(rw * 0.16), palmTop: rb - rh - sz(G, 0.16),
        clouds: u.makeClouds(u.rng(142), 3, W, H, 0.05, 0.22)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.6, G.W, ['#523c6c', '#985c7e', '#e2865a', '#ffcf80']);
      // Teraslardan su şelalesi (piksel kayması)
      var off = Math.floor(t * 8) % 4;
      u.px(c, st.wfX, st.wfY0, 2, st.wfH, '#4a98c8');
      for (var y = st.wfY0 + off; y < st.wfY0 + st.wfH; y += 4) {
        u.px(c, st.wfX, y, 2, 2, '#c8f0ff');
      }
      var sw = Math.floor(t * 2) % 2 ? 1 : -1;
      u.px(c, st.palmX + 6 + sw, st.palmTop + 2, 2, 1, '#58a256');
      u.birds(c, t, G.W, G.H, 3, '#2b2a5a', 0.22);
    }
  });

  /* ================= A6: atina — ATİNA AKROPOLİS (-500 – -331) ================= */
  S.register('atina', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(151);
      u.bands(c, ['#3d7cc9', '#8cc0ea', '#f4f0e4'], 0, g, W, 11);
      u.sun(c, Math.round(W * 0.5), Math.round(H * 0.19), 12, ['#ffd880', '#fff0b8', '#ffffff'], g);
      u.profile(c, 0, W, function (x) { return g - 8 - 5 * Math.sin(x / 37) - 3 * Math.sin(x / 13); }, g, '#94abc0', '#b8cce0');

      // Zemin
      u.bands(c, ['#f0ead8', '#d8d0c0', '#a09886'], g, H, W, 6);

      // Sol: Yüksek kayalık Akropolis tepesi + büyük 8 sütunlu Parthenon + Propylaia
      var lx = xl(G, 0.50), rockW = sz(G, 0.44), rockH = sz(G, 0.24);
      var lb = g + 4, rockTop = lb - rockH;
      u.profile(c, Math.max(0, lx - Math.floor(rockW * 0.65)), lx + Math.floor(rockW * 0.65), function (x) {
        var d = Math.abs(x - lx) / (rockW * 0.5);
        var y = d < 0.72 ? rockTop + Math.sin(x / 6) * 1 : rockTop + (d - 0.72) * rockH * 3.2;
        return Math.min(lb + 2, y);
      }, lb + 2, '#7d7568', '#a69e90');
      for (var rx0 = lx - Math.floor(rockW * 0.38); rx0 < lx + Math.floor(rockW * 0.35); rx0 += 8) {
        stoneBlock(u, c, rx0, rockTop + 5 + (rx0 % 5), 7, 4, '#8e8678', '#aba292', '#5e584e', R);
      }

      // Büyük Parthenon (tepe üstünde, 8 sütun + üçgen alınlık)
      var pw = sz(G, 0.36), ph = sz(G, 0.22);
      var pBase = rockTop + 1;
      var colH = Math.round(ph * 0.60), pedH = Math.round(ph * 0.24);
      var entY = pBase - 3 - colH - 3;
      // Stylobat basamakları
      u.px(c, lx - Math.floor(pw / 2) - 2, pBase - 3, pw + 4, 3, '#d9c9a8');
      u.px(c, lx - Math.floor(pw / 2) - 1, pBase - 4, pw + 2, 1, '#ffffff');
      // İç cella gölgesi
      u.px(c, lx - Math.floor(pw * 0.38), entY + 3, Math.round(pw * 0.76), colH, '#b8a88c');
      // 8 Dorik sütun
      for (var ci = 0; ci < 8; ci++) {
        var cx = Math.round(lx - pw / 2 + 2 + ci * (pw - 6) / 7);
        u.px(c, cx, entY + 3, 2, colH, '#f4f0e4');
        u.px(c, cx + 1, entY + 3, 1, colH, '#d9c9a8');
      }
      // Arşitrav + alınlık (pediment)
      u.px(c, lx - Math.floor(pw / 2), entY, pw, 3, '#f4f0e4');
      u.px(c, lx - Math.floor(pw / 2), entY + 2, pw, 1, '#c8b89a');
      u.poly(c, [[lx - Math.floor(pw / 2) - 2, entY], [lx, entY - pedH], [lx + Math.floor(pw / 2) + 2, entY]], '#f4f0e4');
      u.poly(c, [[lx - Math.floor(pw / 2) + 3, entY - 1], [lx, entY - Math.round(pedH * 0.72)], [lx + Math.floor(pw / 2) - 3, entY - 1]], '#d9c9a8');

      // Propylaia (yamaçta sağ-alt giriş)
      var prX = lx + Math.floor(rockW * 0.42), prY = lb - 1;
      u.px(c, prX - 8, prY - 9, 16, 2, '#f4f0e4');
      for (var pi = 0; pi < 4; pi++) {
        u.px(c, prX - 6 + pi * 4, prY - 7, 2, 7, '#f4f0e4');
      }

      // Sağ: Agora stoası + zeytin ağaçları + Pire limanı deniz şeridi
      var seaX = Math.round(W * 0.68), seaY = g - 5;
      u.px(c, seaX, seaY, W - seaX, 6, '#3a72a8');
      u.px(c, seaX, seaY, W - seaX, 1, '#a8d4f0');

      var sx = xr(G, 0.56), sw = sz(G, 0.30), sb = g + 5;
      u.px(c, sx - Math.floor(sw / 2), sb - 11, sw, 2, '#c8805a');
      u.px(c, sx - Math.floor(sw / 2) - 1, sb - 9, sw + 2, 2, '#f4f0e4');
      u.px(c, sx - Math.floor(sw / 2) + 1, sb - 7, sw - 2, 7, '#a8987c');
      for (var si = 0; si < 6; si++) {
        u.px(c, Math.round(sx - sw / 2 + 1 + si * (sw - 3) / 5), sb - 7, 1, 7, '#f4f0e4');
      }
      oliveTree(u, c, xr(G, 0.14), g + 6, sz(G, 0.16), R);
      oliveTree(u, c, xr(G, 0.86), g + 7, sz(G, 0.14), R);

      return {
        g: g, seaX: seaX, seaY: seaY + 2,
        clouds: u.makeClouds(u.rng(152), 4, W, H, 0.05, 0.25)
      };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.7, G.W, ['#8fb8dc', '#c6e0f4', '#edf6fc', '#ffffff']);
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
      u.birds(c, t, G.W, G.H, 3, '#3d7cc9', 0.22);
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
