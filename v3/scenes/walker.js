/* PUSULLA — yürüyen gezgin sprite'ı (16x24) ve 8 px periyotlu yol şeridi.
 * PUSULLA.scene.walker API'sini sağlar; DOM'a dokunmaz (yalnız offscreen pişirme). */
(function (global) {
  'use strict';
  var P = global.PUSULLA;
  var S = P && P.scene;
  if (!S) return;

  var doc = global.document;
  var W = 16, H = 24;

  var PAL = {
    k: '#1a1128', // koyu kontur
    h: '#8a5234', // şapka ve çizme kahvesi
    H: '#c47e4e', // şapka/çanta vurgusu
    s: '#ffd6b0', // ten
    c: '#d83b4a', // atkı
    j: '#3a5a8c', // ceket
    g: '#ffd27a', // pusula altını
    p: '#2e1e4a', // pantolon
    n: '#e8453c', // pusula iğnesi (kırmızı)
    w: '#fff4d8'  // pusula kadranı
  };

  // Üst gövde (satır 0..16, sağa bakan)
  var TOP = [
    '......kkkk......',
    '.....kHHHHk.....',
    '....khhhhhhk....',
    '...kkHHHHHHHHkkk',
    '...khhhhhhhhhhhk',
    '.....kssssssk...',
    '.....kssssskssk.',
    '.....ksssssskk..',
    '....kccccccck...',
    '..kcckcccccck...',
    '.kHHhkjjjjjjk...',
    '.kHhhkjjjjjjk...',
    '.kHhhkjjjcjjk...',
    '.khhhkjjjjjjkggk',
    '.kkkkkjjjjjsgwng',
    '....kjjjjjjkgnwg',
    '....kHHggHHkkggk'
  ];

  // Alt gövde (satır 17..23) kareye göre
  var LEGS = {
    idle: [
      '....kppppppk....',
      '....kppkkppk....',
      '....kpp..ppk....',
      '....kpp..ppk....',
      '....khh..hhk....',
      '....khhk.khhk...',
      '....kkkk.kkkk...'
    ],
    walk0: [
      '....kppppppk....',
      '...kppk..kppk...',
      '..kppk....kppk..',
      '..khhk....khhk..',
      '..khhkk...khhkk.',
      '..kkkk....kkkk..',
      '................'
    ],
    walk1: [
      '....kppppppk....',
      '....kppkkppk....',
      '....kpp..ppk....',
      '....khh..hhk....',
      '....khhk.khhk...',
      '....kkkk.kkkk...',
      '................'
    ],
    walk2: [
      '....kppppppk....',
      '...kppk..kppk...',
      '..kppk....kppk..',
      '..khhk....khhk..',
      '.kkhhk...kkhhk..',
      '..kkkk....kkkk..',
      '................'
    ],
    walk3: [
      '....kppppppk....',
      '....kppkkppk....',
      '....kpp..ppk....',
      '....khh..hhk....',
      '....khhk.khhk...',
      '....kkkk.kkkk...',
      '................'
    ]
  };

  function makeFrame(bounceY, legKey) {
    var rows = [];
    var i;
    if (bounceY > 0) {
      rows.push('................');
      for (i = 0; i < TOP.length - 1; i++) rows.push(TOP[i]);
      for (i = 0; i < LEGS[legKey].length; i++) rows.push(LEGS[legKey][i]);
    } else if (bounceY < 0) {
      for (i = 1; i < TOP.length; i++) rows.push(TOP[i]);
      rows.push(TOP[TOP.length - 1]);
      for (i = 0; i < LEGS[legKey].length; i++) rows.push(LEGS[legKey][i]);
    } else {
      for (i = 0; i < TOP.length; i++) rows.push(TOP[i]);
      for (i = 0; i < LEGS[legKey].length; i++) rows.push(LEGS[legKey][i]);
    }
    return rows.slice(0, H);
  }

  var FRAMES = {
    idle0: makeFrame(0, 'idle'),
    idle1: makeFrame(1, 'idle'),
    walk0: makeFrame(0, 'walk0'),
    walk1: makeFrame(-1, 'walk1'),
    walk2: makeFrame(0, 'walk2'),
    walk3: makeFrame(-1, 'walk3')
  };

  var baked = null;
  function bakeOne(rows, flip) {
    var cv = doc.createElement('canvas');
    cv.width = W; cv.height = H;
    var c = cv.getContext('2d');
    for (var y = 0; y < H; y++) {
      var row = rows[y];
      for (var x = 0; x < W; x++) {
        var ch = row[flip ? (W - 1 - x) : x];
        var col = PAL[ch];
        if (col) { c.fillStyle = col; c.fillRect(x, y, 1, 1); }
      }
    }
    return cv;
  }
  function ensureBaked() {
    if (baked || !doc || !doc.createElement) return;
    baked = { R: {}, L: {} };
    for (var k in FRAMES) {
      if (!Object.prototype.hasOwnProperty.call(FRAMES, k)) continue;
      baked.R[k] = bakeOne(FRAMES[k], false);
      baked.L[k] = bakeOne(FRAMES[k], true);
    }
  }
  ensureBaked();

  function draw(ctx, cx, feetY, dir, phase, moving) {
    ensureBaked();
    if (!baked || !ctx) return;
    var key = moving
      ? ('walk' + (Math.floor((phase || 0) * 8) & 3))
      : ('idle' + (Math.floor((phase || 0) * 2) & 1));
    var sprite = (dir < 0 ? baked.L : baked.R)[key] || baked.R.idle0;
    ctx.drawImage(sprite, Math.round(cx - W / 2), Math.round(feetY - H));
  }

  // 11 tema için yol paletleri: [ana, açık, koyu]
  var ROADS = {
    bogaz:      ['#5a4a6e', '#7d6b94', '#392c4a'],
    misir:      ['#c89c5a', '#e4bd7a', '#966c34'],
    antik:      ['#cfc8be', '#ebe4da', '#968f86'],
    selcuklu:   ['#a67c56', '#c69b72', '#755336'],
    fetih:      ['#68626e', '#8c8694', '#443e4a'],
    kesif:      ['#7a5236', '#9e6e4a', '#4e321e'],
    sanayi:     ['#46424a', '#645e6a', '#28252c'],
    cumhuriyet: ['#807672', '#a49a94', '#58504c'],
    uzay:       ['#5c6674', '#7e8a9a', '#3a424e'],
    dijital:    ['#1c2440', '#38d6e8', '#0e1326'],
    metropol:   ['#363a46', '#d8dce6', '#1e2028']
  };

  function road(ctx, G, y, offset, themeId, mixToId, mixT) {
    if (!ctx || !G) return;
    var u = S.util;
    var a = ROADS[themeId] || ROADS.bogaz;
    var b = (mixToId && ROADS[mixToId]) || a;
    var t = (mixToId && mixT > 0) ? Math.min(1, mixT) : 0;
    var main = t > 0 ? u.mix(a[0], b[0], t) : a[0];
    var light = t > 0 ? u.mix(a[1], b[1], t) : a[1];
    var dark = t > 0 ? u.mix(a[2], b[2], t) : a[2];

    var ry = Math.round(y), off = Math.round(offset || 0), Wd = G.W;
    var bayer = u.BAYER;

    ctx.fillStyle = light;
    ctx.fillRect(0, ry, Wd, 1);
    ctx.fillStyle = main;
    ctx.fillRect(0, ry + 1, Wd, 4);
    ctx.fillStyle = dark;
    ctx.fillRect(0, ry + 5, Wd, 1);

    // 8 px periyotlu kenarsız doku (Bayer dither + taş/çizgi deseni)
    for (var row = 1; row <= 4; row++) {
      var py = ry + row;
      for (var x = 0; x < Wd; x++) {
        var p = (x - off) & 7;
        var d = bayer[row & 3][p & 3];
        if (row === 2 && (p === 0 || p === 4)) {
          ctx.fillStyle = dark; ctx.fillRect(x, py, 1, 1);
        } else if (row === 3 && p >= 2 && p <= 5) {
          ctx.fillStyle = light; ctx.fillRect(x, py, 1, 1);
        } else if (row === 4 && (p === 2 || p === 6)) {
          ctx.fillStyle = dark; ctx.fillRect(x, py, 1, 1);
        } else if (d < 3) {
          ctx.fillStyle = dark; ctx.fillRect(x, py, 1, 1);
        } else if (d > 13) {
          ctx.fillStyle = light; ctx.fillRect(x, py, 1, 1);
        }
      }
    }
  }

  S.walker = {
    W: W,
    H: H,
    draw: draw,
    road: road
  };
})(typeof window !== 'undefined' ? window : globalThis);
