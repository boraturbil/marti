/* PUSULLA görsel katman — arka plan dokusu: tek <canvas>, prosedürel (ağ + kontur + gren). */
(function (global) {
  'use strict';
  var ui = global.PUSULLA && global.PUSULLA.ui;
  if (!ui) return;

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  var TH = { seed: 11, ink: '236,228,208', gridA: 0.035, lineA: 0.085, grainA: 0.05 };
  var canvas = null, timer = null;

  function draw() {
    if (!canvas) return;
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var w = global.innerWidth, h = global.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    var g = canvas.getContext('2d');
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    var R = rng(TH.seed);

    // enlem/boylam ağı
    g.strokeStyle = 'rgba(' + TH.ink + ',' + TH.gridA + ')';
    g.lineWidth = 1;
    var step = 96, x, y;
    for (x = -step; x < w + step; x += step) {
      g.beginPath();
      for (y = -12; y <= h + 12; y += 12) {
        var xx = x + Math.sin((y / h) * Math.PI) * 18 * ((x - w / 2) / w);
        if (y === -12) g.moveTo(xx, y); else g.lineTo(xx, y);
      }
      g.stroke();
    }
    for (y = step / 2; y < h; y += step) {
      g.beginPath();
      for (x = -12; x <= w + 12; x += 12) {
        var yy = y - Math.cos((x / w - 0.5) * Math.PI) * 10;
        if (x === -12) g.moveTo(x, yy); else g.lineTo(x, yy);
      }
      g.stroke();
    }

    // topografik konturlar (köşelerde, metnin altında kalmasın)
    g.strokeStyle = 'rgba(' + TH.ink + ',' + TH.lineA + ')';
    [[0.06, 0.9, 13], [0.95, 0.1, 11], [0.88, 0.96, 7]].forEach(function (hl) {
      var cx = hl[0] * w, cy = hl[1] * h, n = hl[2], harm = [], k, i, a;
      for (k = 0; k < 4; k++) harm.push([2 + k, (R() * 0.18 + 0.05) / (k + 1), R() * 6.283]);
      for (i = 1; i <= n; i++) {
        var base = i * 26;
        g.beginPath();
        for (a = 0; a <= 360; a += 3) {
          var t = a * Math.PI / 180, rr = base;
          for (k = 0; k < harm.length; k++) rr += base * harm[k][1] * Math.sin(harm[k][0] * t + harm[k][2] + i * 0.12);
          var px = cx + Math.cos(t) * rr * 1.25, py = cy + Math.sin(t) * rr;
          if (a === 0) g.moveTo(px, py); else g.lineTo(px, py);
        }
        g.closePath();
        g.lineWidth = (i % 5 === 0) ? 1.1 : 0.6;
        g.stroke();
      }
    });

    // gren
    var tile = global.document.createElement('canvas');
    tile.width = tile.height = 160;
    var tg = tile.getContext('2d');
    var id = tg.createImageData(160, 160);
    var c = TH.ink.split(',').map(Number);
    for (var p = 0; p < id.data.length; p += 4) {
      id.data[p] = c[0]; id.data[p + 1] = c[1]; id.data[p + 2] = c[2];
      id.data[p + 3] = R() < 0.5 ? Math.round(R() * 255 * TH.grainA) : 0;
    }
    tg.putImageData(id, 0, 0);
    g.fillStyle = g.createPattern(tile, 'repeat');
    g.fillRect(0, 0, w, h);
  }

  ui.parts.bg = {
    init: function (root) {
      canvas = ui.util.h('canvas', { class: 'pu-bg', 'aria-hidden': 'true' });
      root.appendChild(canvas);
      draw();
      global.addEventListener('resize', function () {
        if (timer) global.clearTimeout(timer);
        timer = global.setTimeout(draw, 120);
      });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
