/* PUSULLA görsel katman — piksel logo: gradyanlı "PUSULLA" + atkılı martı maskotu (v2 kahraman martısından). */
(function (global) {
  'use strict';
  var ui = global.PUSULLA && global.PUSULLA.ui;
  if (!ui) return;
  var LW = 172, LH = 40;

  function gull(c, x, y, frame) {
    var blink = frame === 'blink', turn = frame === 'turn';
    function r(col, a, b, w, h) { c.fillStyle = col; c.fillRect(x + a, y + b, w, h); }
    r('#1a1128', 4, 10, 18, 11); r('#1a1128', 12, 2, 11, 11); r('#1a1128', 1, 13, 6, 5);
    r('#fff5e4', 5, 11, 16, 9); r('#fff5e4', 13, 3, 9, 9);
    r('#9aa6bf', 6, 12, 11, 5); r('#9aa6bf', 2, 14, 4, 3); r('#6b7794', 2, 15, 2, 2);
    r('#d9483b', 12, 11, 10, 3); r('#d9483b', 11, 14, 3, 4); r('#ffd27a', 11, 17, 3, 1);
    var bx = turn ? 21 : 22;
    r('#1a1128', bx, 6, 8, 4); r('#ffb838', bx, 7, 7, 2); r('#e07b24', bx, 9, 5, 1);
    var ex = turn ? 17 : 19;
    if (blink) r('#1a1128', ex, 6, 3, 1);
    else { r('#1a1128', ex, 5, 3, 3); r('#ffffff', ex, 5, 1, 1); }
    r('#f0a04b', 11, 20, 2, 3); r('#f0a04b', 16, 20, 2, 3);
  }

  function create(container) {
    var cv = global.document.createElement('canvas');
    cv.width = LW; cv.height = LH;
    cv.className = 'logo';
    cv.setAttribute('role', 'img');
    cv.setAttribute('aria-label', 'PUSULLA');
    var c = cv.getContext('2d');
    c.imageSmoothingEnabled = false;
    container.appendChild(cv);
    var pf = ui.parts.pixfont;
    function draw(frame) {
      c.clearRect(0, 0, LW, LH);
      if (pf) {
        pf.draw(c, 'PUSULLA', 4, 4, {
          scale: 3,
          gradient: ['#ffe7a8', '#ffe7a8', '#ffc46b', '#ffc46b', '#f2884f', '#f2884f', '#d9603f'],
          outline: '#1a1128', shadow: '#5a2a5e'
        });
      }
      gull(c, LW - 36, 10, frame);
    }
    draw('idle');
    if (!ui.util.reducedMotion()) {
      global.setInterval(function () {
        if (global.document.hidden || cv.closest('[hidden]')) return;
        draw('blink');
        global.setTimeout(function () { draw('turn'); global.setTimeout(function () { draw('idle'); }, 320); }, 180);
      }, 5200);
    }
    return cv;
  }

  ui.parts.logo = { create: create, gull: gull };
})(typeof window !== 'undefined' ? window : globalThis);
