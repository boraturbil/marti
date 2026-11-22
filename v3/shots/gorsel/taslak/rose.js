/* PUSULLA — asama 1 yon taslagi: pusula gulu SVG ureticisi (statik taslak, oyun kodu degil). */
(function () {
  'use strict';

  var DIRS = [
    { id: 'yaygin', ang: 0,   main: true,  name: 'YAYGIN' },
    { id: 'gundem', ang: 45,  main: false, name: 'GÜNDEM' },
    { id: 'yeni',   ang: 90,  main: true,  name: 'EN YENİ' },
    { id: 'kesif',  ang: 135, main: false, name: 'KEŞİF' },
    { id: 'nadir',  ang: 180, main: true,  name: 'NADİR' },
    { id: 'antika', ang: 225, main: false, name: 'ANTİKA' },
    { id: 'eski',   ang: 270, main: true,  name: 'EN ESKİ' },
    { id: 'klasik', ang: 315, main: false, name: 'KLASİK' }
  ];

  function f(n) { return Math.round(n * 100) / 100; }
  function pol(r, a) {
    var t = a * Math.PI / 180;
    return [f(r * Math.sin(t)), f(-r * Math.cos(t))];
  }
  function pt(p) { return p[0] + ',' + p[1]; }
  function arc(r, a0, a1) {
    var p0 = pol(r, a0), p1 = pol(r, a1);
    var large = ((a1 - a0 + 360) % 360) > 180 ? 1 : 0;
    return 'M' + pt(p0) + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + pt(p1);
  }

  /*
   * opts: { uid, focus, legs:{yaygin:[tier...]}, theme:'gece'|'atlas', badge:bool, total, done }
   * Renkler CSS degiskenlerinden gelir (var(--mode-*), var(--rose-*)).
   */
  function build(opts) {
    var uid = opts.uid || 'r';
    var badge = !!opts.badge;
    var atlas = opts.theme === 'atlas';
    var focus = opts.focus;
    var s = [];
    var V = badge ? 250 : 330;
    s.push('<svg class="rose' + (badge ? ' rose--badge' : '') + '" viewBox="' + (-V) + ' ' + (-V) + ' ' + (2 * V) + ' ' + (2 * V) + '" role="img" aria-label="Pusula gülü">');

    // --- dis bezel: derece olcegi (yavas doner) ---
    s.push('<g class="rose-bezel">');
    s.push('<circle r="292" class="rl rl-strong"/>');
    s.push('<circle r="268" class="rl"/>');
    var ticks = '';
    for (var d = 0; d < 360; d += 2) {
      var len = (d % 30 === 0) ? 16 : (d % 10 === 0) ? 11 : 6;
      var a = pol(292, d), b = pol(292 - len, d);
      ticks += 'M' + pt(a) + 'L' + pt(b);
    }
    s.push('<path d="' + ticks + '" class="rl rl-tick"/>');
    if (!badge) {
      // 30 derecede bir kucuk derece rakami (bezel ile doner)
      for (var k = 0; k < 360; k += 30) {
        if (k % 90 === 0) continue;
        var q = pol(306, k);
        s.push('<text class="rose-deg" x="' + q[0] + '" y="' + q[1] + '" transform="rotate(' + k + ' ' + q[0] + ' ' + q[1] + ')">' + ('00' + k).slice(-3) + '</text>');
      }
    }
    s.push('</g>');

    // --- etiket bandi ---
    s.push('<circle r="232" class="rl"/>');
    if (atlas && !badge) {
      // atlas: bant ici ince tarama
      var hatch = '';
      for (var h = 0; h < 360; h += 3) {
        hatch += 'M' + pt(pol(268, h)) + 'L' + pt(pol(262, h));
      }
      s.push('<path d="' + hatch + '" class="rl rl-hatch"/>');
    }
    // ana yon ucgen isaretleri (bant ustunde, sabit)
    for (var m = 0; m < 4; m++) {
      var am = m * 90;
      var t1 = pol(296, am), t2 = pol(309, am - 2.2), t3 = pol(309, am + 2.2);
      s.push('<path d="M' + pt(t1) + 'L' + pt(t2) + 'L' + pt(t3) + 'Z" class="rose-mark"/>');
    }

    if (!badge) {
      var rTop = 244, rBot = 256;
      s.push('<defs>');
      s.push('<path id="' + uid + '-top" d="M0,' + rTop + ' A' + rTop + ' ' + rTop + ' 0 1 1 0,' + (-rTop) + ' A' + rTop + ' ' + rTop + ' 0 1 1 0,' + rTop + '"/>');
      s.push('<path id="' + uid + '-bot" d="M0,' + (-rBot) + ' A' + rBot + ' ' + rBot + ' 0 1 0 0,' + rBot + ' A' + rBot + ' ' + rBot + ' 0 1 0 0,' + (-rBot) + '"/>');
      s.push('</defs>');
      DIRS.forEach(function (dir) {
        var bottom = dir.ang > 90 && dir.ang < 270;
        var pct = bottom ? ((360 - dir.ang) % 360) / 360 * 100 : ((dir.ang - 180 + 360) % 360) / 360 * 100;
        var cls = 'rose-label' + (dir.main ? ' rose-label--main' : ' rose-label--mix') + (dir.id === focus ? ' is-focus' : '');
        s.push('<text class="' + cls + '" style="fill:var(--mode-' + dir.id + ')"><textPath href="#' + uid + (bottom ? '-bot' : '-top') + '" startOffset="' + f(pct) + '%" text-anchor="middle">' + dir.name + '</textPath></text>');
      });
    }

    // --- gul uclari: once caprazlar, sonra ana uclar ---
    function point(dir, R, side) {
      var tip = pol(R, dir.ang), l = pol(side, dir.ang - 45), r = pol(side, dir.ang + 45);
      var on = dir.id === focus;
      var g = '<g class="rose-pt' + (dir.main ? ' rose-pt--main' : ' rose-pt--mix') + (on ? ' is-focus' : '') + '" style="--c:var(--mode-' + dir.id + ')">';
      g += '<path class="rose-half rose-half--a" d="M0,0L' + pt(l) + 'L' + pt(tip) + 'Z"/>';
      g += '<path class="rose-half rose-half--b" d="M0,0L' + pt(tip) + 'L' + pt(r) + 'Z"/>';
      g += '</g>';
      return g;
    }
    DIRS.forEach(function (dir) { if (!dir.main) s.push(point(dir, 158, 30)); });
    DIRS.forEach(function (dir) { if (dir.main) s.push(point(dir, 224, 40)); });

    // ic olcek halkasi
    s.push('<circle r="118" class="rl rl-faint" stroke-dasharray="1 5"/>');

    // --- igne ---
    var fd = DIRS.filter(function (d) { return d.id === focus; })[0];
    if (fd) {
      s.push('<g class="rose-needle" style="transform:rotate(' + fd.ang + 'deg);--c:var(--mode-' + fd.id + ')">');
      s.push('<path class="needle-n" d="M0,-206 L7,-70 L0,-58 L-7,-70 Z"/>');
      s.push('<path class="needle-s" d="M0,104 L5,70 L0,58 L-5,70 Z"/>');
      s.push('</g>');
    }

    // --- merkez: gunun rotasi ---
    if (!badge) {
      // 20 parcali ilerleme halkasi (her ceyrek kendi yonune bakar)
      var legs = opts.legs || {};
      ['yaygin', 'yeni', 'nadir', 'eski'].forEach(function (id, qi) {
        var c = qi * 90, arr = legs[id] || [];
        for (var i = 0; i < 5; i++) {
          var a0 = c - 40 + i * 16 + 1.6, a1 = a0 + 12.8;
          var tier = arr[i];
          s.push('<path d="' + arc(76, a0, a1) + '" class="seg' + (tier ? ' seg--done' : '') + '" style="' + (tier ? 'stroke:var(--tier-' + tier + ')' : '') + '"/>');
        }
      });
      s.push('<circle r="62" class="rose-cap"/>');
      s.push('<circle r="56" class="rl rl-faint"/>');
      s.push('<text class="cap-over" y="-18">GÜNÜN ROTASI</text>');
      s.push('<text class="cap-num" y="20">' + (opts.done || 0) + '<tspan class="cap-of">/20</tspan></text>');
    } else {
      s.push('<circle r="40" class="rose-cap"/>');
    }

    s.push('</svg>');
    return s.join('');
  }

  window.PUSULLA = window.PUSULLA || {};
  window.PUSULLA.taslak = { rose: build, dirs: DIRS };
})();
