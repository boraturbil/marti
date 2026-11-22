/* PUSULLA görsel katman — piksel logo: gradyanlı "PUSULLA" yazısı. */
(function (global) {
  'use strict';
  var ui = global.PUSULLA && global.PUSULLA.ui;
  if (!ui) return;
  var LW = 132, LH = 40;

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
    if (pf) {
      pf.draw(c, 'PUSULLA', LW / 2, 4, {
        scale: 3,
        align: 'center',
        gradient: ['#ffe7a8', '#ffe7a8', '#ffc46b', '#ffc46b', '#f2884f', '#f2884f', '#d9603f'],
        outline: '#1a1128', shadow: '#5a2a5e'
      });
    }
    return cv;
  }

  ui.parts.logo = { create: create };
})(typeof window !== 'undefined' ? window : globalThis);
