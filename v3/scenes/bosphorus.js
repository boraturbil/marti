/* PUSULLA — menü sahnesi: piksel sanat Boğaz akşamı (onaylı üslup). scenes/core.js'e 'bogaz' olarak kaydolur. */
(function (global) {
  'use strict';
  var S = global.PUSULLA && global.PUSULLA.scene;
  if (!S || !S.register) return;

  var E = { sky: ['#3f2c6e', '#743f88', '#c45f84', '#fbb466'], water: ['#c0708e', '#8f5084', '#45295c'], land: '#4a2f62', rim: '#6e4579', far: '#8a5a92', sun: ['#ff9a5e', '#ffc874', '#ffe9a6'], lights: 0.45 };
  var C = {
    win: '#ffd27a', win2: '#ffb054', roof: '#8a3b4f', roofDark: '#6a2c44', pine: '#2f4a4a', pineHi: '#466a5a',
    bridge: '#2f1f45', bridgeHi: '#5a3a6a', cable: '#3a2650', lamp: '#ffd98a',
    refl: ['#fff0b8', '#ffd27a', '#ffad66', '#ff8a5c'], foam: '#f6e3dc',
    hull: '#f3ece2', cab: '#fff6ea', shade: '#cdbfc4', dark: '#2a2140', funnel: '#f2b134', winF: '#4a3e6e', gull: '#fff7ee'
  };

  function mosque(u, c, cx, base, s) {
    var r = Math.round(9 * s);
    u.px(c, cx - r - 6, base - Math.round(8 * s), (r + 6) * 2, Math.round(8 * s) + 2, E.land);
    u.circle(c, cx, base - Math.round(8 * s), r, E.land);
    u.circle(c, cx - r - 2, base - Math.round(6 * s), Math.round(r * 0.55), E.land);
    u.circle(c, cx + r + 2, base - Math.round(6 * s), Math.round(r * 0.55), E.land);
    u.px(c, cx, base - Math.round(8 * s) - r - 3, 1, 3, E.rim);
    [-r - 9, r + 8].forEach(function (dx) {
      var mh = Math.round(36 * s);
      u.px(c, cx + dx, base - mh, 2, mh, E.land);
      u.px(c, cx + dx - 1, base - Math.round(mh * 0.62), 4, 1, E.rim);
      u.px(c, cx + dx, base - mh - 4, 1, 4, E.land);
    });
    for (var i = -2; i <= 2; i++) u.px(c, cx + i * 4, base - 4, 1, 2, i % 2 ? C.win2 : C.win);
  }
  function house(u, c, x, base, w, h, R) {
    u.px(c, x, base - h, w, h, E.land);
    u.px(c, x - 1, base - h - 2, w + 2, 2, C.roof);
    u.px(c, x, base - h - 3, w, 1, C.roofDark);
    for (var wy = base - h + 2; wy < base - 2; wy += 4)
      for (var wx = x + 1; wx < x + w - 1; wx += 3) if (R() < E.lights) u.px(c, wx, wy, 1, 1, R() < 0.5 ? C.win : C.win2);
  }
  function pine(u, c, x, base, h) {
    for (var i = 0; i < h; i++) { var hw = Math.floor((i / h) * (h * 0.35)) + 1; u.px(c, x - hw, base - h + i, hw * 2 + 1, 1, i % 3 === 0 ? C.pineHi : C.pine); }
  }
  function bridge(u, c, W, H, hz) {
    var tl = Math.round(W * 0.27), tr = Math.round(W * 0.73), top = hz - Math.round(H * 0.27), deck = hz - Math.round(H * 0.095);
    var aL = Math.round(W * 0.06), aR = Math.round(W * 0.94);
    function cableY(x) {
      if (x < tl) return deck + 2 + (top - deck - 2) * Math.pow((x - aL) / (tl - aL), 1.6);
      if (x > tr) return deck + 2 + (top - deck - 2) * Math.pow((aR - x) / (aR - tr), 1.6);
      var q = (x - tl) / (tr - tl);
      return top + (deck - 6 - top) * (1 - Math.pow(2 * q - 1, 2));
    }
    for (var x = aL + 2; x < aR - 1; x += 3) { var cy = Math.round(cableY(x)); if (cy < deck) u.px(c, x, cy, 1, deck - cy, 'rgba(47,31,69,.55)'); }
    for (x = aL; x <= aR; x++) u.px(c, x, Math.round(cableY(x)), 1, 1, C.cable);
    [tl, tr].forEach(function (tx) {
      u.px(c, tx - 3, top, 2, hz - top, C.bridge); u.px(c, tx + 2, top, 2, hz - top, C.bridge);
      u.px(c, tx - 3, top + 2, 7, 2, C.bridge); u.px(c, tx - 3, top + Math.round((deck - top) * 0.5), 7, 2, C.bridge);
      u.px(c, tx - 3, top, 1, hz - top, C.bridgeHi); u.px(c, tx, top - 2, 1, 2, C.lamp);
    });
    u.px(c, aL - 4, deck, aR - aL + 8, 3, C.bridge); u.px(c, aL - 4, deck, aR - aL + 8, 1, C.bridgeHi);
    for (x = aL; x < aR; x += 9) u.px(c, x, deck - 1, 1, 1, C.lamp);
  }

  S.register('bogaz', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, hz = Math.round(H * 0.6), R = u.rng(23);
      u.bands(c, E.sky, 0, hz, W, 11);
      u.sun(c, Math.round(W * 0.5), hz - 12, 22, E.sun, hz);
      u.profile(c, 0, W, function (x) { return hz - 16 - 7 * Math.sin(x / 37) - 5 * Math.sin(x / 13 + 1) - (x > W * 0.6 ? 8 : 0); }, hz, E.far, u.mix(E.far, '#ffffff', 0.12));
      bridge(u, c, W, H, hz);
      var lEnd = W * 0.3;
      var lTop = function (x) { return hz - 22 - 10 * Math.sin(x / 29) - 4 * Math.sin(x / 9) + Math.max(0, (x - lEnd * 0.75)) * 0.9; };
      u.profile(c, 0, lEnd + 4, lTop, hz, E.land, E.rim);
      mosque(u, c, Math.round(W * 0.09), Math.round(lTop(W * 0.09)) + 4, 1);
      mosque(u, c, Math.round(W * 0.205), Math.round(lTop(W * 0.205)) + 3, 0.7);
      for (var hx = 4; hx < lEnd - 6; hx += 7 + Math.floor(R() * 5)) {
        if (Math.abs(hx - W * 0.09) < 22 || Math.abs(hx - W * 0.205) < 16) continue;
        house(u, c, hx, Math.round(lTop(hx)) + 8, 5 + Math.floor(R() * 3), 5 + Math.floor(R() * 5), R);
      }
      var rStart = W * 0.7;
      var rTop = function (x) { return hz - 20 - 9 * Math.sin(x / 31 + 2) - 3 * Math.sin(x / 7) + Math.max(0, (rStart + 18 - x)) * 0.9; };
      u.profile(c, rStart - 4, W, rTop, hz, E.land, E.rim);
      for (var rx = Math.round(rStart + 14); rx < W - 4; rx += 6 + Math.floor(R() * 6)) {
        if (R() < 0.35) pine(u, c, rx, Math.round(rTop(rx)) + 4, 7 + Math.floor(R() * 5));
        else house(u, c, rx, Math.round(rTop(rx)) + 8, 5 + Math.floor(R() * 3), 5 + Math.floor(R() * 4), R);
      }
      u.bands(c, E.water, hz, H, W, 7);
      var water = u.ramp(E.water, 7), dark = u.mix(E.land, '#000000', 0.15);
      for (var k = 0; k < 4; k++) {
        var yy = hz + 1 + k * 2, cut = k * 6, col = k < 2 ? dark : water[3];
        u.px(c, 0, yy, Math.max(0, lEnd - cut), 1, col);
        u.px(c, rStart + cut, yy, W - rStart - cut, 1, col);
      }
      u.px(c, 0, hz, W, 1, 'rgba(246,227,220,.55)');
      return { hz: hz, clouds: u.makeClouds(u.rng(7), 6, W, H, 0.07, 0.37) };
    },
    frame: function (c, G, t, st, u) {
      var W = G.W, H = G.H, hz = st.hz, sx = Math.round(W * 0.5), i;
      u.drawClouds(c, st.clouds.filter(function (cl) { return cl.y + 12 < hz; }), t, W);
      for (var y = hz + 2; y < H; y += 2) {
        var d = (y - hz) / (H - hz), half = Math.round(6 + d * 26), seg = 0;
        for (var x2 = sx - half; x2 < sx + half; x2 += 3 + seg) {
          seg = (x2 * 7 + y * 13 + Math.floor(t * 3)) % 5;
          if (seg > 1) u.px(c, x2, y, 2 + (seg === 4 ? 1 : 0), 1, C.refl[Math.min(C.refl.length - 1, Math.floor(d * C.refl.length + (Math.abs(x2 - sx) / half) * 1.5))]);
        }
      }
      for (i = 0; i < 40; i++) {
        var wx = (i * 97 + Math.floor(t * 4) * (i % 3 + 1)) % W, wy = hz + 4 + ((i * 53) % (H - hz - 6));
        if (Math.abs(wx - sx) > 40) u.px(c, wx, wy, 3, 1, 'rgba(246,227,220,.35)');
      }
      // vapur
      var fx = Math.round(((t * 3) % (W + 80)) - 40), fy = hz + Math.round((H - hz) * 0.35);
      u.px(c, fx, fy, 24, 3, C.hull); u.px(c, fx + 1, fy + 3, 22, 1, C.shade); u.px(c, fx + 4, fy - 4, 15, 4, C.cab);
      for (i = 0; i < 6; i++) u.px(c, fx + 5 + i * 2 + (i > 2 ? 1 : 0), fy - 3, 1, 1, C.winF);
      u.px(c, fx + 10, fy - 8, 3, 4, C.funnel); u.px(c, fx + 10, fy - 9, 3, 1, C.dark);
      u.px(c, fx - 3, fy + 3, 3, 1, C.foam); u.px(c, fx + 24, fy + 2, 2, 1, C.foam);
      u.birds(c, t, W, H, 4, C.gull, 0.18);
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
