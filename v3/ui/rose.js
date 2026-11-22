/* PUSULLA görsel katman — pusula gülü (inline SVG) ve denetleyicisi.
 * SVG yalnız sabit metinden üretilir; veri metni içermez. */
(function (global) {
  'use strict';
  var ui = global.PUSULLA && global.PUSULLA.ui;
  if (!ui) return;

  var DIRS = [
    { id: 'yaygin', ang: 0,   main: true,  name: 'YAYGIN',  card: 'KUZEY' },
    { id: 'gundem', ang: 45,  main: false, name: 'GÜNDEM',  card: 'KUZEYDOĞU' },
    { id: 'yeni',   ang: 90,  main: true,  name: 'EN YENİ', card: 'DOĞU' },
    { id: 'kesif',  ang: 135, main: false, name: 'KEŞİF',   card: 'GÜNEYDOĞU' },
    { id: 'nadir',  ang: 180, main: true,  name: 'NADİR',   card: 'GÜNEY' },
    { id: 'antika', ang: 225, main: false, name: 'ANTİKA',  card: 'GÜNEYBATI' },
    { id: 'eski',   ang: 270, main: true,  name: 'EN ESKİ', card: 'BATI' },
    { id: 'klasik', ang: 315, main: false, name: 'KLASİK',  card: 'KUZEYBATI' }
  ];
  var LEGS = ['yaygin', 'yeni', 'nadir', 'eski']; // halkadaki çeyrek sırası (saat yönü)
  var byId = {};
  DIRS.forEach(function (d) { byId[d.id] = d; });

  function f(n) { return Math.round(n * 100) / 100; }
  function pol(r, a) { var t = a * Math.PI / 180; return [f(r * Math.sin(t)), f(-r * Math.cos(t))]; }
  function pt(p) { return p[0] + ',' + p[1]; }
  function arc(r, a0, a1) {
    var p0 = pol(r, a0), p1 = pol(r, a1), large = ((a1 - a0 + 360) % 360) > 180 ? 1 : 0;
    return 'M' + pt(p0) + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + pt(p1);
  }
  function sector(r0, r1, a0, a1) {
    var o0 = pol(r1, a0), o1 = pol(r1, a1), i1 = pol(r0, a1), i0 = pol(r0, a0);
    return 'M' + pt(o0) + ' A' + r1 + ' ' + r1 + ' 0 0 1 ' + pt(o1) + ' L' + pt(i1) + ' A' + r0 + ' ' + r0 + ' 0 0 0 ' + pt(i0) + 'Z';
  }

  function svgMarkup(uid, badge) {
    var s = [], V = badge ? 250 : 332;
    s.push('<svg class="rose' + (badge ? ' rose--badge' : '') + '" viewBox="' + (-V) + ' ' + (-V) + ' ' + (2 * V) + ' ' + (2 * V) + '" aria-hidden="' + (badge ? 'true' : 'false') + '"' + (badge ? '' : ' role="group" aria-label="Pusula: mod seç"') + '>');

    // dış bezel (yavaş döner)
    s.push('<g class="rose-bezel"><circle r="292" class="rl rl-strong"/><circle r="268" class="rl"/>');
    if (!badge) {
      var ticks = '';
      for (var d = 0; d < 360; d += 2) {
        var len = (d % 30 === 0) ? 16 : (d % 10 === 0) ? 11 : 6;
        ticks += 'M' + pt(pol(292, d)) + 'L' + pt(pol(292 - len, d));
      }
      s.push('<path d="' + ticks + '" class="rl rl-tick"/>');
      for (var k = 30; k < 360; k += 30) {
        if (k % 90 === 0) continue;
        var q = pol(306, k);
        s.push('<text class="rose-deg" x="' + q[0] + '" y="' + q[1] + '" transform="rotate(' + k + ' ' + q[0] + ' ' + q[1] + ')">' + ('00' + k).slice(-3) + '</text>');
      }
    }
    s.push('</g>');
    s.push('<circle r="232" class="rl"/>');

    if (!badge) {
      for (var m = 0; m < 4; m++) {
        var am = m * 90;
        s.push('<path d="M' + pt(pol(296, am)) + 'L' + pt(pol(309, am - 2.2)) + 'L' + pt(pol(309, am + 2.2)) + 'Z" class="rose-mark"/>');
      }
      var rTop = 244, rBot = 256;
      s.push('<defs><path id="' + uid + '-top" d="M0,' + rTop + ' A' + rTop + ' ' + rTop + ' 0 1 1 0,' + (-rTop) + ' A' + rTop + ' ' + rTop + ' 0 1 1 0,' + rTop + '"/>');
      s.push('<path id="' + uid + '-bot" d="M0,' + (-rBot) + ' A' + rBot + ' ' + rBot + ' 0 1 0 0,' + rBot + ' A' + rBot + ' ' + rBot + ' 0 1 0 0,' + (-rBot) + '"/></defs>');
      DIRS.forEach(function (dir) {
        var bottom = dir.ang > 90 && dir.ang < 270;
        var pct = bottom ? ((360 - dir.ang) % 360) / 360 * 100 : ((dir.ang - 180 + 360) % 360) / 360 * 100;
        s.push('<text class="rose-label rose-label--' + (dir.main ? 'main' : 'mix') + '" data-id="' + dir.id + '" style="fill:var(--mode-' + dir.id + ')"><textPath href="#' + uid + (bottom ? '-bot' : '-top') + '" startOffset="' + f(pct) + '%" text-anchor="middle">' + dir.name + '</textPath></text>');
      });
    }

    function point(dir, R, side) {
      var tip = pol(R, dir.ang), l = pol(side, dir.ang - 45), r = pol(side, dir.ang + 45);
      return '<g class="rose-pt rose-pt--' + (dir.main ? 'main' : 'mix') + '" data-id="' + dir.id + '" style="--c:var(--mode-' + dir.id + ')">' +
        '<path class="rose-half rose-half--a" d="M0,0L' + pt(l) + 'L' + pt(tip) + 'Z"/>' +
        '<path class="rose-half rose-half--b" d="M0,0L' + pt(tip) + 'L' + pt(r) + 'Z"/></g>';
    }
    DIRS.forEach(function (dir) { if (!dir.main) s.push(point(dir, 158, 30)); });
    DIRS.forEach(function (dir) { if (dir.main) s.push(point(dir, 224, 40)); });
    s.push('<circle r="118" class="rl rl-faint" stroke-dasharray="1 5"/>');

    // iğne (döner grup)
    if (badge) s.push('<g class="rose-needle"><path class="needle-n" d="M0,-222 L30,-40 L0,-14 L-30,-40 Z"/><path class="needle-s" d="M0,150 L20,40 L0,14 L-20,40 Z"/></g>');
    else s.push('<g class="rose-needle"><path class="needle-n" d="M0,-206 L7,-70 L0,-58 L-7,-70 Z"/><path class="needle-s" d="M0,104 L5,70 L0,58 L-5,70 Z"/></g>');

    if (!badge) {
      LEGS.forEach(function (id, qi) {
        for (var i = 0; i < 5; i++) {
          var a0 = qi * 90 - 40 + i * 16 + 1.6;
          s.push('<path d="' + arc(76, a0, a0 + 12.8) + '" class="seg" data-leg="' + id + '" data-i="' + i + '"/>');
        }
      });
      s.push('<circle r="62" class="rose-cap"/><circle r="56" class="rl rl-faint"/>');
      s.push('<text class="cap-over" y="-16">GÜNÜN ROTASI</text>');
      s.push('<text class="cap-num" y="20"><tspan class="cap-done">0</tspan><tspan class="cap-of">/20</tspan></text>');
      // klavye odağı göstergesi: bezel bandında mod renginde yay
      DIRS.forEach(function (dir) {
        var fw = dir.main ? 10 : 7;
        s.push('<path class="farc" data-id="' + dir.id + '" style="--c:var(--mode-' + dir.id + ')" d="' + sector(270, 290, dir.ang - fw, dir.ang + fw) + '"/>');
      });
      s.push('<circle class="farc farc--center" data-id="rota" r="67"/>');
      // tıklama/odak alanları (en üstte, saydam)
      DIRS.forEach(function (dir) {
        var w = dir.main ? 24 : 21;
        s.push('<path class="hit" tabindex="0" role="button" data-id="' + dir.id + '" aria-label="' + dir.name + (dir.main ? ' modu' : ' — karma mod') + '" d="' + sector(70, 318, dir.ang - w, dir.ang + w) + '"/>');
      });
      s.push('<circle class="hit hit--center" tabindex="0" role="button" data-id="rota" aria-label="Günün rotası" r="64"/>');
    } else {
      s.push('<circle r="40" class="rose-cap"/>');
    }
    s.push('</svg>');
    return s.join('');
  }

  var uidSeq = 0;
  function create(container, opts) {
    opts = opts || {};
    var uid = 'rose' + (++uidSeq);
    container.innerHTML = svgMarkup(uid, !!opts.badge);
    var svg = container.firstChild;
    var needle = svg.querySelector('.rose-needle');
    var cur = null, needleAng = 0;
    var api = { el: svg, focus: null };

    function rotateTo(ang) {
      var d = ((ang - needleAng) % 360 + 540) % 360 - 180; // en kısa yol
      needleAng += d;
      needle.style.transform = 'rotate(' + needleAng + 'deg)';
    }

    api.setFocus = function (id) {
      cur = id;
      api.focus = id;
      var dir = byId[id];
      svg.setAttribute('data-focus', id || '');
      var nodes = svg.querySelectorAll('[data-id]');
      for (var i = 0; i < nodes.length; i++) nodes[i].classList.toggle('is-focus', nodes[i].getAttribute('data-id') === id);
      if (dir) {
        needle.style.setProperty('--c', 'var(--mode-' + id + ')');
        needle.classList.remove('is-off');
        rotateTo(dir.ang);
      } else {
        needle.classList.add('is-off');
      }
    };
    api.setMode = function (id) { // rozet: karma için ana renk yerine karma rengi
      var dir = byId[id];
      needle.style.setProperty('--c', 'var(--mode-' + (id || 'rota') + ')');
      if (dir) { needle.classList.remove('is-off'); rotateTo(dir.ang); } else { needle.classList.add('is-off'); }
    };
    api.setProgress = function (prog) {
      prog = prog || {};
      var total = 0;
      LEGS.forEach(function (id) {
        var n = Math.max(0, Math.min(5, +prog[id] || 0));
        total += n;
        var segs = svg.querySelectorAll('.seg[data-leg="' + id + '"]');
        for (var i = 0; i < segs.length; i++) {
          var on = i < n;
          segs[i].classList.toggle('seg--done', on);
          segs[i].style.stroke = on ? 'var(--mode-' + id + ')' : '';
        }
      });
      var done = svg.querySelector('.cap-done');
      if (done) done.textContent = String(total);
      return total;
    };
    api.focusEl = function (id) {
      var el = svg.querySelector('.hit[data-id="' + id + '"]');
      if (el && typeof el.focus === 'function') { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }
    };
    api.current = function () { return cur; };
    return api;
  }

  ui.parts.rose = { create: create, dirs: DIRS, byId: byId };
})(typeof window !== 'undefined' ? window : globalThis);
