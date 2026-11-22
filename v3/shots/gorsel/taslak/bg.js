/* PUSULLA — asama 1 yon taslagi: prosedurel arka plan dokusu (tek canvas). */
(function () {
  'use strict';

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // theme: { line:'r,g,b', lineA, grid:'r,g,b', gridA, grain:'r,g,b', grainA, seed }
  function draw(canvas, th) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    var g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    var R = rng(th.seed || 7);

    // 1) graticule: hafif egik enlem/boylam egrileri
    g.strokeStyle = 'rgba(' + th.grid + ',' + th.gridA + ')';
    g.lineWidth = 1;
    var step = 96;
    for (var x = -step; x < w + step; x += step) {
      g.beginPath();
      for (var y = -10; y <= h + 10; y += 12) {
        var xx = x + Math.sin((y / h) * Math.PI) * 18 * ((x - w / 2) / w);
        if (y === -10) g.moveTo(xx, y); else g.lineTo(xx, y);
      }
      g.stroke();
    }
    for (var yy = step / 2; yy < h; yy += step) {
      g.beginPath();
      for (var x2 = -10; x2 <= w + 10; x2 += 12) {
        var y2 = yy + Math.cos((x2 / w - 0.5) * Math.PI) * -10;
        if (x2 === -10) g.moveTo(x2, y2); else g.lineTo(x2, y2);
      }
      g.stroke();
    }

    // 2) topografik kontur halkalari (2-3 tepe)
    g.strokeStyle = 'rgba(' + th.line + ',' + th.lineA + ')';
    var hills = th.hills || [[0.08, 0.86, 13], [0.94, 0.12, 11], [0.86, 0.94, 7]];
    hills.forEach(function (hl) {
      var cx = hl[0] * w, cy = hl[1] * h, n = hl[2];
      var harm = [];
      for (var k = 0; k < 4; k++) harm.push([2 + k, (R() * 0.18 + 0.05) / (k + 1), R() * 6.283]);
      for (var i = 1; i <= n; i++) {
        var base = i * 26;
        g.beginPath();
        for (var a = 0; a <= 360; a += 3) {
          var t = a * Math.PI / 180, rr = base;
          for (var j = 0; j < harm.length; j++) rr += base * harm[j][1] * Math.sin(harm[j][0] * t + harm[j][2] + i * 0.12);
          var px = cx + Math.cos(t) * rr * 1.25, py = cy + Math.sin(t) * rr;
          if (a === 0) g.moveTo(px, py); else g.lineTo(px, py);
        }
        g.closePath();
        g.lineWidth = (i % 5 === 0) ? 1.1 : 0.6;
        g.stroke();
      }
    });

    // 3) gren (kucuk karo, desen olarak)
    var tile = document.createElement('canvas');
    tile.width = tile.height = 160;
    var tg = tile.getContext('2d');
    var id = tg.createImageData(160, 160);
    var c = th.grain.split(',').map(Number);
    for (var p = 0; p < id.data.length; p += 4) {
      id.data[p] = c[0]; id.data[p + 1] = c[1]; id.data[p + 2] = c[2];
      id.data[p + 3] = R() < 0.5 ? Math.round(R() * 255 * th.grainA) : 0;
    }
    tg.putImageData(id, 0, 0);
    g.fillStyle = g.createPattern(tile, 'repeat');
    g.fillRect(0, 0, w, h);
  }

  window.PUSULLA = window.PUSULLA || {};
  window.PUSULLA.taslakBg = draw;
})();
