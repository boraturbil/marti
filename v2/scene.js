(function (root) {
  'use strict';

  var PAL = {
    ink: '#1a1128',
    farHill: '#5a3566', farHillRim: '#7e4a72',
    camHill: '#3a2550', camHillRim: '#5e3a66',
    land: '#261a38', landRim: '#4a3258', landDark: '#1c1229',
    bldA: '#24183a', bldB: '#2b1e40', bldC: '#33244a', bldRim: '#5a3a62',
    roof: '#5a2f45', roofDark: '#43223a',
    win1: '#ffcf6b', win2: '#ffb054', win3: '#fff0c0', winOff: '#3a2a4e',
    sunCore: '#ffe08a', sunMid: '#ffb35c', sunRim: '#ff7a59', sunHalo: '#ffb067',
    water1: '#6a3f6e', water2: '#7d4a72', water3: '#5a3a66', water4: '#3e2e5c', waterHi: '#c2708a', landRefl: '#33244f',
    refl1: '#ffd27a', refl2: '#ffb067', refl3: '#ff8a5c',
    foam: '#f3e6d8', surfLine: '#9fd0d8',
    uw1: '#2f6f8f', uw2: '#24597a', uw3: '#1b4666', uw4: '#12334f', ray: '#bfe6ee',
    sand: '#4a5a6a', sandDark: '#36444f', rock1: '#2c3a4c', rock2: '#3f5266', rock3: '#5d7488',
    weed1: '#2f7a4f', weed2: '#4fa065', weedDark: '#1f5236',
    fishSilver: '#c8d6e0', fishBlue: '#6f8fa8', fishDark: '#3a4a5a',
    gullW: '#f6f1e7', gullL: '#d9d2dc', gullG: '#a9a3b8', gullB: '#2b2436', gullY: '#f2b134', gullYd: '#c9821f', gullE: '#1a1428', gullO: '#3a2f4f',
    ferryHull: '#e8e2d8', ferryCab: '#f1ece2', ferryShade: '#c9c2b8', ferryDark: '#2a2a3a', ferryFunnel: '#f2b134', ferryWin: '#3a4a6a',
    wood1: '#6a3b2a', wood2: '#8a4f35', wood3: '#a8683f',
    tile1: '#8a3b3b', tile2: '#a84c45', tile3: '#5e2a33',
    pine1: '#1f3a2f', pine2: '#2f5a40', pine3: '#4a7a52',
    kiteA: '#e84a5f', kiteB: '#f6c445', kiteC: '#4fb0d8',
    cloudHi: '#f3d6d6', cloudMid: '#e8b6b8', cloudLo: '#c486a6', cloudShadow: '#a8708f',
    moon: '#fff3c4', moonShade: '#e8d9a0', moonGlow: '#3a3a6a',
    star: '#fff7e0', city1: '#ffcf6b', city2: '#ffa94d', city3: '#fff1c1', cityBase: '#0d1430',
    amph1: '#c07a4a', amph2: '#9a5a3a', amph3: '#6a3a2a',
    jelly: '#7fe0ff', snow: '#8aa0b0', red: '#ff4d4d', green: '#5fd068'
  };

  var GEO = {
    W: 384, H: 216, GULL_X: 192, GULL_Y: 96,
    SUN: { x: 192, y: 92, r: 16 },
    WATER_Y: 104,
    KESIT_Y: 132,
    SEABED_SHELF_Y: 196,
    DECK_Y: 78,
    TOWER_TOP: 44,
    TOWER_L: 92, TOWER_R: 292
  };

  var CACHE_OY = 60;
  var CACHE_H = 596;

  var BAYER4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  // Kara profilleri
  var FAR_HILLS_TOP = [
    [0, 96], [40, 92], [90, 95], [140, 90], [192, 94],
    [240, 89], [300, 93], [350, 90], [384, 94]
  ];
  var NEAR_LAND_L_TOP = [
    [0, 58], [20, 56], [44, 60], [60, 66], [76, 76], [90, 88], [98, 96], [104, 103]
  ];
  var CAMLICA_TOP = [
    [236, 103], [258, 88], [286, 72], [312, 62], [334, 58], [356, 60], [384, 66]
  ];
  var NEAR_LAND_R_TOP = [
    [280, 103], [292, 96], [304, 90], [318, 84], [332, 76], [350, 70], [384, 68]
  ];
  var SHELF_L_TOP = [
    [0, 196], [40, 194], [80, 198], [120, 204], [150, 212], [160, 216]
  ];
  var SHELF_R_TOP = [
    [266, 216], [280, 208], [310, 200], [350, 194], [384, 192]
  ];
  var BATIK_ROCK_TOP = [
    [0, 170], [60, 166], [130, 172], [180, 180], [200, 216]
  ];

  var HOUSES_L = [
    [1, 6, 6, 1], [6, 6, 5, 2], [48, 5, 5, 3], [67, 8, 6, 4]
  ];
  var HOUSES_R = [
    [347, 8, 7, 5], [356, 7, 6, 6], [364, 8, 6, 7], [373, 8, 7, 8]
  ];

  // Marti sprite matrisleri (18x10, saga bakar)
  var GULL_FRAMES = {
    mid: [
      '..................',
      '...........WWW....',
      '..........WWWWW...',
      '.BBGGGGGGGWWEWYYY.',
      '.GGGWWWWWWWWWWyy..',
      '.GGWWWWWWWWWW.....',
      '....LLLLLLLL......',
      '..................',
      '..................',
      '..................'
    ],
    up: [
      '...BB.............',
      '....GG.....WWW....',
      '.....GG...WWWWW...',
      '......GGGGWWEWYYY.',
      '.GGGWWWWWWWWWWyy..',
      '.GGWWWWWWWWWW.....',
      '....LLLLLLLL......',
      '..................',
      '..................',
      '..................'
    ],
    down: [
      '..................',
      '...........WWW....',
      '..........WWWWW...',
      '..........WWEWYYY.',
      '.GGGWWWWWWWWWWyy..',
      '.GGWWWWWWWWWW.....',
      '....LLGGGGLL......',
      '.....GGG..........',
      '....BB............',
      '..................'
    ],
    dive: [
      '....BB......',
      '...BGG......',
      '..GGGG..GG..',
      '..WWWWGGGG..',
      '.WWWWWWWW...',
      '.WWWWWWWW...',
      '..WWWWWW....',
      '..WWWWWW....',
      '...WWWW.....',
      '...WWEW.....',
      '....WYY.....',
      '.....YY.....',
      '.....y......'
    ]
  };

  var GULL_PAL = {
    W: PAL.gullW, L: PAL.gullL, G: PAL.gullG, B: PAL.gullB,
    Y: PAL.gullY, y: PAL.gullYd, E: PAL.gullE
  };

  var AMPHORA_GRID = [
    '.#.#.',
    '.###.',
    '..#..',
    '.###.',
    '#####',
    '#####',
    '.###.',
    '.###.',
    '..#..'
  ];

  var TEA_GRID = [
    '.###.',
    '.#.#.',
    '..#..',
    '.#.#.',
    '#####'
  ];

  // Durum degiskenleri
  var canvas = null;
  var ctx = null;
  var rafId = null;
  var lastTs = 0;
  var elapsed = 0;
  var frozenTime = null;

  var mode = 'menu';
  var uiPhase = 'menu';
  var cam = 0;
  var targetCam = 0;
  var camX = 0;
  var targetCamX = 0;
  var maxZoneIndex = 0;
  var zoneEnterCb = null;

  var banner = null;
  var flashTimer = 0;

  // Efektler
  var sparkles = [];
  var weakTimer = 0;
  var flapBoostTimer = 0;
  var passTimer = 0;
  var passSmoke = [];
  var bubbles = [];
  var diveBubbleTimer = 0;
  var smokePuffs = [];
  var ferrySmokeTimer = 0;

  // Hareketli varliklar
  var ferry = { x: 40, wait: 0, speed: 8 };
  var boats = [];
  var flocks = [];
  var stars = [];
  var clouds = [];
  var farSparkles = [];
  var plane = { x: -24, active: true, wait: 0, trail: [] };
  var shootingStar = { active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, nextIn: 4.5 };
  var satellite = { x: 20 };
  var currentLines = [];
  var jellies = [];
  var seaSnow = [];
  var glowFish = [];

  // Statik onbellekler ve ayak izleri
  var caches = {};
  var skyCache = null;
  var skyState = { a: '', b: '', t: -1, kesit: -9999 };
  var FOOTPRINTS = [];
  var windowCoords = [];

  // ---- Yardimcilar ----
  function fnv1a(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function rotateGridCW(grid) {
    var H = grid.length;
    var W = grid[0].length;
    var out = [];
    for (var r = 0; r < W; r++) {
      var row = '';
      for (var c = 0; c < H; c++) {
        row += grid[H - 1 - c][r];
      }
      out.push(row);
    }
    return out;
  }

  function px(c, x, y, w, h, color) {
    if (w <= 0 || h <= 0) return;
    c.fillStyle = color;
    c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function fillPolyPx(c, points, color) {
    if (!points || points.length < 3) return;
    var minY = Infinity, maxY = -Infinity;
    var i;
    for (i = 0; i < points.length; i++) {
      if (points[i][1] < minY) minY = points[i][1];
      if (points[i][1] > maxY) maxY = points[i][1];
    }
    minY = Math.floor(minY);
    maxY = Math.ceil(maxY);
    c.fillStyle = color;
    for (var y = minY; y <= maxY; y++) {
      var xs = [];
      for (i = 0; i < points.length; i++) {
        var p1 = points[i];
        var p2 = points[(i + 1) % points.length];
        var y1 = p1[1], y2 = p2[1];
        if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) {
          var t = (y - y1) / (y2 - y1);
          xs.push(p1[0] + t * (p2[0] - p1[0]));
        }
      }
      xs.sort(function (a, b) { return a - b; });
      for (i = 0; i + 1 < xs.length; i += 2) {
        var xa = Math.round(xs[i]);
        var xb = Math.round(xs[i + 1]);
        if (xb > xa) c.fillRect(xa, y, xb - xa, 1);
      }
    }
  }

  function fillCirclePx(c, cx, cy, r, color) {
    c.fillStyle = color;
    var rcx = Math.round(cx), rcy = Math.round(cy);
    for (var dy = -r; dy <= r; dy++) {
      var hw = Math.floor(Math.sqrt(r * r - dy * dy) + 0.5);
      if (hw > 0) {
        c.fillRect(rcx - hw, rcy + dy, hw * 2 + 1, 1);
      } else if (dy === -r || dy === r) {
        c.fillRect(rcx, rcy + dy, 1, 1);
      }
    }
  }

  function fillDomePx(c, cx, baseY, r, color, rimC, sunSide) {
    var rcx = Math.round(cx), rby = Math.round(baseY);
    for (var dy = 0; dy <= r; dy++) {
      var hw = Math.floor(Math.sqrt(r * r - dy * dy) + 0.5);
      c.fillStyle = color;
      c.fillRect(rcx - hw, rby - dy, hw * 2 + 1, 1);
      if (rimC) {
        c.fillStyle = rimC;
        var rx = sunSide === 'left' ? (rcx - hw) : (rcx + hw);
        c.fillRect(rx, rby - dy, 1, 1);
      }
    }
  }

  function ditherRect(c, x, y, w, h, c1, c2, level) {
    var rx = Math.round(x), ry = Math.round(y), rw = Math.round(w), rh = Math.round(h);
    if (rw <= 0 || rh <= 0) return;
    if (c1) {
      c.fillStyle = c1;
      c.fillRect(rx, ry, rw, rh);
    }
    if (level <= 0) return;
    c.fillStyle = c2;
    for (var py = 0; py < rh; py++) {
      var by = (ry + py) & 3;
      for (var px0 = 0; px0 < rw; px0++) {
        var bx = (rx + px0) & 3;
        if (BAYER4[by][bx] / 16 < level) {
          c.fillRect(rx + px0, ry + py, 1, 1);
        }
      }
    }
  }

  function hexToRgb(hex) {
    var h = hex.charAt(0) === '#' ? hex.slice(1) : hex;
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16)
    ];
  }

  function rgbToHex(r, g, b) {
    var cr = Math.max(0, Math.min(255, Math.round(r)));
    var cg = Math.max(0, Math.min(255, Math.round(g)));
    var cb = Math.max(0, Math.min(255, Math.round(b)));
    return '#' + ((1 << 24) + (cr << 16) + (cg << 8) + cb).toString(16).slice(1);
  }

  function lerpColor(a, b, t) {
    if (t <= 0) return a;
    if (t >= 1) return b;
    var ca = hexToRgb(a), cb = hexToRgb(b);
    return rgbToHex(
      ca[0] + (cb[0] - ca[0]) * t,
      ca[1] + (cb[1] - ca[1]) * t,
      ca[2] + (cb[2] - ca[2]) * t
    );
  }

  function shade(hex, k) {
    var c = hexToRgb(hex);
    if (k >= 0) {
      return rgbToHex(
        c[0] + (255 - c[0]) * k,
        c[1] + (255 - c[1]) * k,
        c[2] + (255 - c[2]) * k
      );
    }
    var f = 1 + k;
    return rgbToHex(c[0] * f, c[1] * f, c[2] * f);
  }

  function landTop(poly, x) {
    if (!poly || !poly.length) return 104;
    if (x <= poly[0][0]) return Math.round(poly[0][1]);
    var last = poly[poly.length - 1];
    if (x >= last[0]) return Math.round(last[1]);
    for (var i = 0; i < poly.length - 1; i++) {
      var p1 = poly[i], p2 = poly[i + 1];
      if (x >= p1[0] && x <= p2[0]) {
        if (p2[0] === p1[0]) return Math.round(p1[1]);
        var t = (x - p1[0]) / (p2[0] - p1[0]);
        return Math.round(p1[1] + (p2[1] - p1[1]) * t);
      }
    }
    return Math.round(last[1]);
  }

  function groundBase(poly, x0, x1) {
    var xa = Math.floor(Math.min(x0, x1));
    var xb = Math.ceil(Math.max(x0, x1));
    var m = -Infinity;
    for (var x = xa; x <= xb; x++) {
      var y = landTop(poly, x);
      if (y > m) m = y;
    }
    return m;
  }

  function drawSprite(c, grid, pal, x, y, opts) {
    opts = opts || {};
    var flipX = !!opts.flipX;
    var outline = opts.outline || null;
    var rx = Math.round(x), ry = Math.round(y);
    var H = grid.length;
    var W = grid[0].length;
    var r, col, ch, drawCol;

    if (outline) {
      c.fillStyle = outline;
      for (r = 0; r < H; r++) {
        for (col = 0; col < W; col++) {
          if (grid[r][col] !== '.') {
            drawCol = flipX ? (W - 1 - col) : col;
            if (r === 0 || grid[r - 1][col] === '.') c.fillRect(rx + drawCol, ry + r - 1, 1, 1);
            if (r === H - 1 || grid[r + 1][col] === '.') c.fillRect(rx + drawCol, ry + r + 1, 1, 1);
            if (col === 0 || grid[r][col - 1] === '.') c.fillRect(rx + drawCol - (flipX ? -1 : 1), ry + r, 1, 1);
            if (col === W - 1 || grid[r][col + 1] === '.') c.fillRect(rx + drawCol + (flipX ? -1 : 1), ry + r, 1, 1);
          }
        }
      }
    }

    for (r = 0; r < H; r++) {
      for (col = 0; col < W; col++) {
        ch = grid[r][col];
        if (ch !== '.' && pal[ch]) {
          drawCol = flipX ? (W - 1 - col) : col;
          c.fillStyle = pal[ch];
          c.fillRect(rx + drawCol, ry + r, 1, 1);
        }
      }
    }
  }

  function addFootprint(name, x0, x1, layer) {
    FOOTPRINTS.push({ name: name, x0: Math.min(x0, x1), x1: Math.max(x0, x1), layer: layer });
  }

  // ---- Geometrik yardimcilar (kopru & yapilar) ----
  function bridgeCableY(x) {
    var u = (x - 192) / 100;
    return Math.round(44 + 32 * (1 - u * u));
  }

  function sideCableY(side, x) {
    var towerX = side === 'L' ? GEO.TOWER_L : GEO.TOWER_R;
    var endX = side === 'L' ? 40 : 344;
    var poly = side === 'L' ? NEAR_LAND_L_TOP : NEAR_LAND_R_TOP;
    var endY = landTop(poly, endX) + 2;
    var t = Math.abs(x - towerX) / Math.abs(endX - towerX);
    return Math.round(44 + (endY - 44) * t + 4 * Math.sin(Math.PI * t));
  }

  // ---- Statik cizim fonksiyonlari (offscreen cache) ----
  function makeCanvas(w, h) {
    var cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    var cc = cv.getContext('2d');
    cc.imageSmoothingEnabled = false;
    return { canvas: cv, ctx: cc };
  }

  function drawMosqueStatic(c, cx, poly, size, minaretCount, oy, layerName, fpName) {
    var cfg = {
      L: { gw: 26, gy: 10, kw: 18, ky: 2, r: 8, hr: 5, ho: 9, cr: 2, co: 12, mo: 15, mw: 2, mh: 36, ser: [24, 30] },
      M: { gw: 18, gy: 7, kw: 12, ky: 1, r: 6, hr: 3, ho: 6, cr: 0, co: 0, mo: 11, mw: 2, mh: 26, ser: [18] },
      S: { gw: 12, gy: 5, kw: 8, ky: 1, r: 4, hr: 0, ho: 0, cr: 0, co: 0, mo: 8, mw: 1, mh: 18, ser: [13] }
    }[size];

    var sunSide = cx < 192 ? 'right' : 'left';
    var base = groundBase(poly, cx - Math.floor(cfg.gw / 2), cx + Math.floor(cfg.gw / 2));
    var bodyTop = base - cfg.gy;
    var bodyX0 = Math.round(cx - cfg.gw / 2);

    var lightStone = layerName === 'light_stone';
    var colA = lightStone ? '#d8ccb4' : PAL.bldA;
    var colB = lightStone ? PAL.cream : PAL.bldB;
    var colC = lightStone ? '#fff1d6' : PAL.bldC;
    var colRim = lightStone ? PAL.ink : PAL.bldRim;

    // Govde
    px(c, bodyX0, bodyTop + oy, cfg.gw, cfg.gy + 2, colA);
    px(c, bodyX0, bodyTop + oy, cfg.gw, 1, colC);
    px(c, sunSide === 'right' ? bodyX0 + cfg.gw - 1 : bodyX0, bodyTop + oy, 1, cfg.gy + 1, colRim);
    if (lightStone) {
      px(c, bodyX0 - 1, bodyTop + oy, 1, cfg.gy + 1, PAL.ink);
    }

    // Kasnak + kubbeler
    var kasTop = bodyTop - cfg.ky;
    px(c, cx - Math.floor(cfg.kw / 2), kasTop + oy, cfg.kw, cfg.ky, colB);
    fillDomePx(c, cx, kasTop + oy, cfg.r, colB, colRim, sunSide);

    // Alem
    px(c, cx, kasTop - cfg.r - 2 + oy, 1, 2, colC);
    px(c, cx, kasTop - cfg.r - 3 + oy, 1, 1, colRim);

    // Yarim kubbeler
    if (cfg.hr > 0) {
      fillDomePx(c, cx - cfg.ho, bodyTop + oy, cfg.hr, colB, sunSide === 'left' ? colRim : null, sunSide);
      fillDomePx(c, cx + cfg.ho, bodyTop + oy, cfg.hr, colB, sunSide === 'right' ? colRim : null, sunSide);
    }
    // Kose kubbeler
    if (cfg.cr > 0) {
      fillDomePx(c, cx - cfg.co, bodyTop + oy, cfg.cr, colC, null, sunSide);
      fillDomePx(c, cx + cfg.co, bodyTop + oy, cfg.cr, colC, null, sunSide);
    }

    // Minareler
    var offsets = [];
    if (minaretCount === 1) {
      offsets = [cfg.mo];
    } else if (minaretCount === 2) {
      offsets = [-cfg.mo, cfg.mo];
    } else if (minaretCount === 4) {
      offsets = [-cfg.mo, -(cfg.mo - 4), cfg.mo - 4, cfg.mo];
    } else if (minaretCount === 6) {
      offsets = [-cfg.mo, -(cfg.mo - 4), -(cfg.mo - 8), cfg.mo - 8, cfg.mo - 4, cfg.mo];
    }

    var minX0 = bodyX0, minX1 = bodyX0 + cfg.gw - 1;
    for (var i = 0; i < offsets.length; i++) {
      var off = offsets[i];
      var absOff = Math.abs(off);
      var scaleH = 1;
      if (minaretCount >= 4) {
        if (absOff === cfg.mo - 4) scaleH = 0.8;
        else if (absOff === cfg.mo - 8) scaleH = 0.65;
      }
      var mh = Math.round(cfg.mh * scaleH);
      var mx = cx + off;
      var mTop = base - mh;
      var mBot = Math.max(base, landTop(poly, mx) + 1);
      var mw = cfg.mw;
      var mxLeft = mw === 2 ? mx - 1 : mx;
      if (mxLeft < minX0) minX0 = mxLeft;
      if (mxLeft + mw - 1 > minX1) minX1 = mxLeft + mw - 1;

      px(c, mxLeft, mTop + oy, mw, mBot - mTop + 1, PAL.bldB);
      px(c, sunSide === 'right' ? mxLeft + mw - 1 : mxLeft, mTop + oy, 1, mBot - mTop, PAL.bldRim);

      // Serefeler
      for (var s = 0; s < cfg.ser.length; s++) {
        var sy = base - Math.round(cfg.ser[s] * scaleH);
        if (sy > mTop + 2) {
          px(c, mxLeft - 1, sy + oy, mw + 2, 1, PAL.bldC);
        }
      }

      // Kulah
      if (size === 'S') {
        px(c, mxLeft, mTop - 4 + oy, 1, 4, PAL.bldC);
      } else {
        px(c, mxLeft, mTop - 2 + oy, 2, 2, PAL.bldC);
        px(c, sunSide === 'right' ? mxLeft + 1 : mxLeft, mTop - 5 + oy, 1, 3, PAL.bldC);
      }
    }

    if (layerName && fpName) {
      addFootprint(fpName, minX0, minX1, layerName);
    }

    return { base: base, bodyTop: bodyTop, gw: cfg.gw, gy: cfg.gy, bodyX0: bodyX0 };
  }

  function drawGalataStatic(c, poly, oy) {
    var cx = 60;
    var base = groundBase(poly, 55, 65);
    var bodyTop = base - 26;
    px(c, 56, bodyTop + oy, 9, 27, PAL.bldA);
    for (var y = bodyTop + 6; y < base; y += 6) {
      px(c, 56, y + oy, 9, 1, PAL.bldC);
    }
    px(c, 64, bodyTop + oy, 1, 26, PAL.bldRim);
    // Balkon
    var balconyY = base - 27;
    px(c, 55, balconyY + oy, 11, 1, PAL.bldC);
    // Kulah
    var widths = [11, 9, 9, 7, 7, 5, 5, 3, 3, 1, 1];
    for (var i = 0; i < widths.length; i++) {
      var w = widths[i];
      var ry = balconyY - 1 - i;
      var rx = cx - Math.floor(w / 2);
      px(c, rx, ry + oy, w, 1, PAL.bldB);
      px(c, rx + w - 1, ry + oy, 1, 1, PAL.bldRim);
    }
    px(c, cx, balconyY - 1 - widths.length + oy, 1, 1, PAL.bldC);
    addFootprint('galata', 55, 65, 'nearL');
    return balconyY;
  }

  function drawCamlicaTowerStatic(c, poly, oy) {
    var base = landTop(poly, 334) + 1;
    // Govde
    px(c, 332, 31 + oy, 4, base - 30, PAL.bldB);
    px(c, 332, 31 + oy, 1, base - 30, PAL.bldRim);
    px(c, 333, -14 + oy, 2, 45, PAL.bldB);
    px(c, 333, -14 + oy, 1, 45, PAL.bldRim);
    // Kapsul y = -22 .. -14 (9 satir)
    px(c, 330, -22 + oy, 8, 2, PAL.bldB);
    px(c, 328, -20 + oy, 12, 5, PAL.bldB);
    px(c, 330, -15 + oy, 8, 2, PAL.bldB);
    px(c, 328, -20 + oy, 1, 5, PAL.bldRim);
    // Anten
    px(c, 333, -40 + oy, 1, 18, PAL.bldC);
    addFootprint('camlicaTower', 328, 339, 'camlica');
  }

  function drawPine(c, x, base, oy) {
    var widths = [1, 3, 3, 5, 5, 7, 7];
    var topY = base - 7;
    for (var i = 0; i < widths.length; i++) {
      var w = widths[i];
      var hw = Math.floor(w / 2);
      var ry = topY + i + oy;
      px(c, x - hw, ry, hw, 1, PAL.pine1);
      px(c, x, ry, hw + 1, 1, PAL.pine2);
      px(c, x - hw, ry, 1, 1, PAL.pine3);
    }
    px(c, x, topY + oy, 1, 1, PAL.pine3);
    px(c, x, base + oy, 1, 2, PAL.wood1);
  }

  function drawHouseStatic(c, x, w, h, poly, seed, oy, layerName) {
    var base = groundBase(poly, x, x + w - 1);
    var bodyCol = [PAL.bldA, PAL.bldB, PAL.bldC][seed % 3];
    var bodyTop = base - h;
    px(c, x, bodyTop + oy, w, h + 1, bodyCol);
    var sunSide = x < 192 ? 'right' : 'left';
    px(c, sunSide === 'right' ? x + w - 1 : x, bodyTop + oy, 1, h, PAL.bldRim);

    // Cati
    var rows = Math.ceil(w / 2);
    for (var r = 0; r < rows; r++) {
      var rw = w + 2 - 2 * r;
      if (rw <= 0) break;
      var rx = x - 1 + r;
      px(c, rx, bodyTop - 1 - r + oy, rw, 1, r === 0 ? PAL.roofDark : PAL.roof);
    }
    if (seed % 4 === 0) {
      px(c, x + w - 2, bodyTop - 3 + oy, 1, 2, PAL.roofDark);
    }
    if (layerName) {
      addFootprint('house_' + seed, x, x + w - 1, layerName);
    }
    return { x: x, w: w, h: h, base: base, seed: seed };
  }

  function drawBridgeStatic(c, oy) {
    var legLX = [88, 94];
    var legRX = [288, 294];
    var i, x, y, bot;

    // Sol kule bacaklari
    for (i = 0; i < legLX.length; i++) {
      x = legLX[i];
      bot = Math.max(landTop(NEAR_LAND_L_TOP, x), landTop(NEAR_LAND_L_TOP, x + 1)) + 2;
      px(c, x, GEO.TOWER_TOP + oy, 2, bot - GEO.TOWER_TOP + 1, PAL.bldB);
    }
    px(c, 95, GEO.TOWER_TOP + oy, 1, landTop(NEAR_LAND_L_TOP, 95) + 2 - GEO.TOWER_TOP, PAL.bldRim);
    px(c, GEO.TOWER_L - 5, 42 + oy, 11, 2, PAL.bldB);
    px(c, 88, 46 + oy, 8, 1, PAL.bldB);
    px(c, 88, 64 + oy, 8, 1, PAL.bldB);
    px(c, 88, 82 + oy, 8, 1, PAL.bldB);

    // Sag kule bacaklari
    for (i = 0; i < legRX.length; i++) {
      x = legRX[i];
      bot = Math.max(landTop(NEAR_LAND_R_TOP, x), landTop(NEAR_LAND_R_TOP, x + 1)) + 2;
      px(c, x, GEO.TOWER_TOP + oy, 2, bot - GEO.TOWER_TOP + 1, PAL.bldB);
    }
    px(c, 288, GEO.TOWER_TOP + oy, 1, landTop(NEAR_LAND_R_TOP, 288) + 2 - GEO.TOWER_TOP, PAL.bldRim);
    px(c, GEO.TOWER_R - 5, 42 + oy, 11, 2, PAL.bldB);
    px(c, 288, 46 + oy, 8, 1, PAL.bldB);
    px(c, 288, 64 + oy, 8, 1, PAL.bldB);
    px(c, 288, 82 + oy, 8, 1, PAL.bldB);

    // Tabliye (0..384)
    px(c, 0, GEO.DECK_Y + oy, GEO.W, 1, PAL.bldRim);
    px(c, 0, GEO.DECK_Y + 1 + oy, GEO.W, 2, PAL.bldA);
    for (x = 0; x < GEO.W; x += 2) {
      px(c, x, GEO.DECK_Y + 3 + oy, 1, 1, PAL.landDark);
    }

    // Ana halat (parabol) + kopuksuz doldurma
    var prevY = null;
    for (x = GEO.TOWER_L; x <= GEO.TOWER_R; x++) {
      y = bridgeCableY(x);
      if (prevY !== null && Math.abs(y - prevY) > 1) {
        var sy0 = Math.min(y, prevY), sy1 = Math.max(y, prevY);
        px(c, x, sy0 + oy, 1, sy1 - sy0 + 1, PAL.bldB);
      }
      px(c, x, y + oy, 1, 1, PAL.bldB);
      prevY = y;
    }

    // Yan halatlar
    prevY = null;
    for (x = 40; x <= GEO.TOWER_L; x++) {
      y = sideCableY('L', x);
      if (prevY !== null && Math.abs(y - prevY) > 1) {
        px(c, x, Math.min(y, prevY) + oy, 1, Math.abs(y - prevY) + 1, PAL.bldB);
      }
      px(c, x, y + oy, 1, 1, PAL.bldB);
      prevY = y;
    }
    prevY = null;
    for (x = GEO.TOWER_R; x <= 344; x++) {
      y = sideCableY('R', x);
      if (prevY !== null && Math.abs(y - prevY) > 1) {
        px(c, x, Math.min(y, prevY) + oy, 1, Math.abs(y - prevY) + 1, PAL.bldB);
      }
      px(c, x, y + oy, 1, 1, PAL.bldB);
      prevY = y;
    }

    // Aski halatlari
    c.save();
    c.globalAlpha = 0.7;
    for (x = 96; x <= 288; x += 4) {
      var cy = bridgeCableY(x);
      if (77 > cy) {
        px(c, x, cy + 1 + oy, 1, 77 - cy, PAL.winOff);
      }
    }
    c.restore();

    addFootprint('bridgeL', 76, 100, 'nearL');
    addFootprint('bridgeR_tower', 284, 300, 'nearR');
    addFootprint('bridgeR_cable', 322, 346, 'nearR');
  }

  function buildStaticCaches() {
    FOOTPRINTS = [];
    windowCoords = [];

    // 1. Uzak tepeler (p = 0.6)
    var far = makeCanvas(GEO.W, CACHE_H);
    var farPoly = FAR_HILLS_TOP.map(function (pt) { return [pt[0], pt[1] + CACHE_OY]; });
    farPoly.push([384, 403 + CACHE_OY], [0, 403 + CACHE_OY]);
    fillPolyPx(far.ctx, farPoly, PAL.farHill);
    for (var x = 0; x < GEO.W; x++) {
      px(far.ctx, x, landTop(FAR_HILLS_TOP, x) + CACHE_OY, 1, 1, PAL.farHillRim);
    }
    caches.farHills = far.canvas;

    // 2. Camlica tepesi (p = 0.8)
    var camC = makeCanvas(GEO.W, CACHE_H);
    var camPoly = CAMLICA_TOP.map(function (pt) { return [pt[0], pt[1] + CACHE_OY]; });
    camPoly.push([384, 403 + CACHE_OY], [236, 403 + CACHE_OY]);
    fillPolyPx(camC.ctx, camPoly, PAL.camHill);
    for (x = 236; x < GEO.W; x++) {
      px(camC.ctx, x, landTop(CAMLICA_TOP, x) + CACHE_OY, 1, 1, PAL.camHillRim);
    }
    // Camlica camii (M, 6 minare, cx=268)
    drawMosqueStatic(camC.ctx, 268, CAMLICA_TOP, 'M', 6, CACHE_OY, 'camlica', 'camlicaMosque');
    // Camlica kulesi
    drawCamlicaTowerStatic(camC.ctx, CAMLICA_TOP, CACHE_OY);
    // Cam agaclari
    var pineXs = [290, 299, 308, 318, 350, 362, 374];
    for (var i = 0; i < pineXs.length; i++) {
      var pxX = pineXs[i];
      drawPine(camC.ctx, pxX, landTop(CAMLICA_TOP, pxX) + 1, CACHE_OY);
      addFootprint('pine_' + pxX, pxX - 3, pxX + 3, 'camlica');
    }
    // Uzak minik evler
    var farTiny = [240, 246, 284, 342, 368];
    for (i = 0; i < farTiny.length; i++) {
      var fx = farTiny[i];
      var fb = groundBase(CAMLICA_TOP, fx, fx + 3);
      px(camC.ctx, fx, fb - 3 + CACHE_OY, 4, 4, PAL.bldC);
      if (fnv1a('ft' + fx) % 5 < 2) {
        px(camC.ctx, fx + 1, fb - 2 + CACHE_OY, 1, 1, PAL.win1);
      }
      addFootprint('tiny_' + fx, fx, fx + 3, 'camlica');
    }
    caches.camlica = camC.canvas;

    // 3. Kopru (p = 1.0)
    var br = makeCanvas(GEO.W, CACHE_H);
    drawBridgeStatic(br.ctx, CACHE_OY);
    caches.bridge = br.canvas;

    // 4. Yakin karalar + yapilar (p = 1.0)
    var nl = makeCanvas(GEO.W, CACHE_H);
    var polyL = NEAR_LAND_L_TOP.map(function (pt) { return [pt[0], pt[1] + CACHE_OY]; });
    polyL.push([104, 403 + CACHE_OY], [0, 403 + CACHE_OY]);
    fillPolyPx(nl.ctx, polyL, PAL.land);
    for (x = 0; x <= 104; x++) {
      px(nl.ctx, x, landTop(NEAR_LAND_L_TOP, x) + CACHE_OY, 1, 1, PAL.landRim);
    }

    var polyR = NEAR_LAND_R_TOP.map(function (pt) { return [pt[0], pt[1] + CACHE_OY]; });
    polyR.push([384, 403 + CACHE_OY], [280, 403 + CACHE_OY]);
    fillPolyPx(nl.ctx, polyR, PAL.land);
    for (x = 280; x < GEO.W; x++) {
      px(nl.ctx, x, landTop(NEAR_LAND_R_TOP, x) + CACHE_OY, 1, 1, PAL.landRim);
    }

    // Camiler & Galata
    var lMosque = drawMosqueStatic(nl.ctx, 30, NEAR_LAND_L_TOP, 'L', 2, CACHE_OY, 'nearL', 'mosqueL');
    var sMosque = drawMosqueStatic(nl.ctx, 312, NEAR_LAND_R_TOP, 'S', 1, CACHE_OY, 'nearR', 'mosqueS');
    var galataBalconyY = drawGalataStatic(nl.ctx, NEAR_LAND_L_TOP, CACHE_OY);

    // Pencere koordinatlari (canli isik + yansima icin)
    for (var wx = lMosque.bodyX0 + 2; wx <= lMosque.bodyX0 + lMosque.gw - 3; wx += 3) {
      windowCoords.push({ x: wx, y: lMosque.bodyTop + 4, col: (wx % 2 === 0 ? PAL.win1 : PAL.win2), fixed: true });
    }
    for (wx = sMosque.bodyX0 + 2; wx <= sMosque.bodyX0 + sMosque.gw - 3; wx += 3) {
      windowCoords.push({ x: wx, y: sMosque.bodyTop + 2, col: PAL.win1, fixed: true });
    }
    windowCoords.push({ x: 57, y: galataBalconyY + 5, col: PAL.win1, fixed: true });
    windowCoords.push({ x: 60, y: galataBalconyY + 5, col: PAL.win1, fixed: true });
    windowCoords.push({ x: 63, y: galataBalconyY + 5, col: PAL.win1, fixed: true });

    // Evler
    var allHouses = [];
    for (i = 0; i < HOUSES_L.length; i++) {
      var hl = HOUSES_L[i];
      allHouses.push(drawHouseStatic(nl.ctx, hl[0], hl[1], hl[2], NEAR_LAND_L_TOP, hl[3], CACHE_OY, 'nearL'));
    }
    for (i = 0; i < HOUSES_R.length; i++) {
      var hr = HOUSES_R[i];
      allHouses.push(drawHouseStatic(nl.ctx, hr[0], hr[1], hr[2], NEAR_LAND_R_TOP, hr[3], CACHE_OY, 'nearR'));
    }
    for (i = 0; i < allHouses.length; i++) {
      var hs = allHouses[i];
      var wy = hs.base - hs.h + 2;
      var wxs = hs.w >= 6 ? [hs.x + 1, hs.x + hs.w - 2] : [hs.x + Math.floor(hs.w / 2)];
      for (var wi = 0; wi < wxs.length; wi++) {
        var hHash = fnv1a('h' + hs.x + '-' + wi);
        var cols = [PAL.win1, PAL.win2, PAL.win3];
        windowCoords.push({
          x: wxs[wi],
          y: wy,
          col: cols[hHash % 3],
          litBase: hHash % 3 !== 0,
          seed: hHash,
          fixed: false
        });
      }
    }
    caches.nearLand = nl.canvas;

    // 5. Deniz tabani raflari + kayalar + batiik kucuk nesneler (p = 1.0)
    var sb = makeCanvas(GEO.W, CACHE_H);
    var slPoly = SHELF_L_TOP.map(function (pt) { return [pt[0], pt[1] + CACHE_OY]; });
    slPoly.push([160, 346 + CACHE_OY], [0, 346 + CACHE_OY]);
    fillPolyPx(sb.ctx, slPoly, PAL.rock1);

    var srPoly = SHELF_R_TOP.map(function (pt) { return [pt[0], pt[1] + CACHE_OY]; });
    srPoly.push([384, 346 + CACHE_OY], [266, 346 + CACHE_OY]);
    fillPolyPx(sb.ctx, srPoly, PAL.rock1);

    // Dikey kaya doku cizgileri (siglikta gorunur)
    sb.ctx.save();
    sb.ctx.globalAlpha = 0.3;
    for (x = 5; x < 155; x += 5) {
      var stL = landTop(SHELF_L_TOP, x);
      px(sb.ctx, x, stL + 4 + CACHE_OY, 1, 346 - stL, PAL.rock2);
    }
    for (x = 270; x < 384; x += 5) {
      var stR = landTop(SHELF_R_TOP, x);
      px(sb.ctx, x, stR + 4 + CACHE_OY, 1, 346 - stR, PAL.rock2);
    }
    sb.ctx.restore();

    // Kum katmani (ust 2 satir sand, alti sandDark)
    for (x = 0; x <= 158; x++) {
      var yl = landTop(SHELF_L_TOP, x);
      px(sb.ctx, x, yl + CACHE_OY, 1, 2, PAL.sand);
      px(sb.ctx, x, yl + 2 + CACHE_OY, 1, 4, PAL.sandDark);
    }
    for (x = 268; x < GEO.W; x++) {
      var yr = landTop(SHELF_R_TOP, x);
      px(sb.ctx, x, yr + CACHE_OY, 1, 2, PAL.sand);
      px(sb.ctx, x, yr + 2 + CACHE_OY, 1, 4, PAL.sandDark);
    }

    // Kayalar
    var rockXs = [30, 92, 300, 352];
    for (i = 0; i < rockXs.length; i++) {
      var rkx = rockXs[i];
      var rPoly = rkx < 192 ? SHELF_L_TOP : SHELF_R_TOP;
      var rky = groundBase(rPoly, rkx - 5, rkx + 5) - 1;
      fillCirclePx(sb.ctx, rkx, rky + CACHE_OY, 4, PAL.rock1);
      fillCirclePx(sb.ctx, rkx - 4, rky + 1 + CACHE_OY, 3, PAL.rock1);
      fillCirclePx(sb.ctx, rkx + 4, rky + 1 + CACHE_OY, 3, PAL.rock1);
      fillDomePx(sb.ctx, rkx, rky + CACHE_OY, 4, PAL.rock2, PAL.rock3, 'left');
      fillDomePx(sb.ctx, rkx - 4, rky + 1 + CACHE_OY, 3, PAL.rock2, PAL.rock3, 'left');
    }

    // Midye kumeleri (siglik icin, kayalarin yaninda)
    var musselSpots = [22, 38, 84, 100, 292, 360];
    for (i = 0; i < musselSpots.length; i++) {
      var mx = musselSpots[i];
      var mPoly = mx < 192 ? SHELF_L_TOP : SHELF_R_TOP;
      var my = landTop(mPoly, mx) - 1;
      px(sb.ctx, mx, my + CACHE_OY, 2, 3, '#1d2433');
      px(sb.ctx, mx + 2, my + 1 + CACHE_OY, 2, 2, '#1d2433');
      px(sb.ctx, mx, my + CACHE_OY, 1, 1, PAL.rock3);
    }

    // Batiik kucuk nesneler: cay bardagi (120), simit (60), kucuk capa (330)
    var teaBase = groundBase(SHELF_L_TOP, 120, 124);
    drawSprite(sb.ctx, TEA_GRID, { '#': PAL.fishSilver }, 120, teaBase - 4 + CACHE_OY);
    px(sb.ctx, 121, teaBase - 3 + CACHE_OY, 3, 1, PAL.amph1);
    px(sb.ctx, 121, teaBase - 1 + CACHE_OY, 3, 1, PAL.amph1);

    var simitBase = groundBase(SHELF_L_TOP, 60, 64);
    px(sb.ctx, 61, simitBase - 4 + CACHE_OY, 3, 1, PAL.wood3);
    px(sb.ctx, 60, simitBase - 3 + CACHE_OY, 1, 3, PAL.wood3);
    px(sb.ctx, 64, simitBase - 3 + CACHE_OY, 1, 3, PAL.wood3);
    px(sb.ctx, 61, simitBase + CACHE_OY, 3, 1, PAL.wood3);
    px(sb.ctx, 61, simitBase - 4 + CACHE_OY, 1, 1, PAL.win3);
    px(sb.ctx, 64, simitBase - 2 + CACHE_OY, 1, 1, PAL.win3);

    var anchorBase = groundBase(SHELF_R_TOP, 327, 333);
    px(sb.ctx, 330, anchorBase - 7 + CACHE_OY, 1, 7, PAL.rock3);
    px(sb.ctx, 329, anchorBase - 8 + CACHE_OY, 3, 2, PAL.rock3);
    px(sb.ctx, 330, anchorBase - 8 + CACHE_OY, 1, 1, PAL.uw4);
    px(sb.ctx, 327, anchorBase - 1 + CACHE_OY, 7, 1, PAL.rock3);
    px(sb.ctx, 327, anchorBase - 2 + CACHE_OY, 1, 1, PAL.rock3);
    px(sb.ctx, 333, anchorBase - 2 + CACHE_OY, 1, 1, PAL.rock3);

    caches.seabed = sb.canvas;

    // 6. Galata balkonu test verisi icin sakla
    caches.galataBalconyY = galataBalconyY;
  }

  // ---- Hareketli varliklari baslat ----
  function initEntities() {
    var i;
    stars = [];
    for (i = 0; i < 140; i++) {
      var h = fnv1a('star' + i);
      stars.push({
        x: h % GEO.W,
        y: (h >>> 9) % 150,
        plus: (h % 10) === 0,
        rate: 1.2 + ((h >>> 16) % 20) * 0.12,
        phase: (h >>> 20) * 0.1
      });
    }

    farSparkles = [];
    for (i = 0; i < 18; i++) {
      var fh = fnv1a('wsp' + i);
      farSparkles.push({
        baseX: fh % GEO.W,
        y: 105 + (fh % 25),
        w: 3 + (fh % 6),
        speed: 4 + (fh % 7)
      });
    }

    clouds = [];
    // Gun batimi bulutlari (anchorCam 0)
    for (i = 0; i < 5; i++) {
      clouds.push(makeCloud('sunF' + i, 0, 0.4, 18 + (i * 7) % 32, 3, 6, 1));
    }
    for (i = 0; i < 3; i++) {
      clouds.push(makeCloud('sunM' + i, 0, 0.7, 30 + (i * 11) % 30, 4, 7, 2));
    }
    // BULUT DENIZI (anchorCam 300)
    for (i = 0; i < 6; i++) {
      clouds.push(makeCloud('cdF' + i, 300, 0.4, 60 + (i * 5), 6, 10, 1, 6));
    }
    for (i = 0; i < 6; i++) {
      clouds.push(makeCloud('cdM' + i, 300, 0.7, 110 + (i * 7), 7, 11, 2, 5));
    }
    for (i = 0; i < 4; i++) {
      clouds.push(makeCloud('cdN' + i, 300, 1.3, 170 + (i * 12), 10, 16, 4, 4));
    }

    boats = [
      { x: 115, y: 107, speed: 1.8, dir: 1, phase: 0.2 },
      { x: 245, y: 109, speed: 2.6, dir: -1, phase: 1.7 },
      { x: 185, y: 110, speed: 1.5, dir: 1, phase: 3.1 }
    ];

    flocks = [
      { x: 290, y: 38, speed: 7, count: 6 },
      { x: 140, y: 52, speed: 9.5, count: 5 }
    ];

    currentLines = [];
    for (i = 0; i < 30; i++) {
      var ch = fnv1a('cur' + i);
      currentLines.push({
        x: ch % GEO.W,
        y: 10 + (ch >>> 8) % 196,
        len: 6 + (ch % 9),
        speed: 40 + (ch >>> 16) % 31
      });
    }

    jellies = [];
    for (i = 0; i < 4; i++) {
      jellies.push({
        x: 64 + i * 78,
        y: 45 + (i % 2) * 70,
        speed: 3 + (i % 3) * 1.3,
        phase: i * 1.4
      });
    }

    seaSnow = [];
    for (i = 0; i < 60; i++) {
      var sh = fnv1a('snow' + i);
      seaSnow.push({
        x: sh % GEO.W,
        y: (sh >>> 8) % GEO.H,
        speed: 3 + (sh % 4),
        phase: i * 0.4
      });
    }

    glowFish = [];
    for (i = 0; i < 6; i++) {
      glowFish.push({ ox: i * 8, oy: (i % 3) * 6, phase: i * 0.8 });
    }
  }

  function makeCloud(seedStr, anchorCam, p, baseY, rMin, rMax, speed, partCount) {
    var h = fnv1a(seedStr);
    var parts = [];
    var n = partCount || (3 + (h % 3));
    for (var i = 0; i < n; i++) {
      var ph = fnv1a(seedStr + '_' + i);
      var r = rMin + (ph % (rMax - rMin + 1));
      var dx = (i - (n - 1) / 2) * (r * 0.9);
      var dy = ((ph >>> 8) % 5) - 2;
      parts.push([Math.round(dx), Math.round(dy), r]);
    }
    return {
      x: h % GEO.W,
      baseY: baseY,
      anchorCam: anchorCam,
      p: p,
      parts: parts,
      speed: speed
    };
  }

  // ---- Bolge yardimcilari ----
  function getZonesForMode(m) {
    var Z = root.ZONES;
    if (!Z) return [];
    if (m === 'dip') return Z.dip || [];
    if (m === 'orta') return Z.orta || [];
    return Z.zirve || [];
  }

  function formatBadge(m, z) {
    if (!z) return '±0 m';
    if (m === 'orta') {
      return Number(z.km || 0).toLocaleString('tr-TR') + ' km';
    }
    var meters = Number(z.meters || 0);
    if (meters === 0) return '±0 m';
    var sign = m === 'dip' ? '\u2212' : '+';
    return sign + meters.toLocaleString('tr-TR') + ' m';
  }

  function roundMeters(val) {
    if (val < 100) return Math.round(val);
    if (val < 1000) return Math.round(val / 10) * 10;
    return Math.round(val / 100) * 100;
  }

  function getZoneBlend() {
    var zones = getZonesForMode(mode);
    if (!zones.length) return { a: null, b: null, t: 0, idx: 0, weights: [] };
    var weights = [];
    for (var i = 0; i < zones.length; i++) weights.push(0);

    var val = mode === 'orta' ? camX : Math.abs(cam);
    var idx = 0;
    for (i = 0; i < zones.length - 1; i++) {
      var v0 = mode === 'orta' ? zones[i].camX : Math.abs(zones[i].cam);
      var v1 = mode === 'orta' ? zones[i + 1].camX : Math.abs(zones[i + 1].cam);
      if (val >= v0 && val <= v1) {
        var t = v1 === v0 ? 0 : Math.max(0, Math.min(1, (val - v0) / (v1 - v0)));
        weights[i] = 1 - t;
        weights[i + 1] = t;
        return { a: zones[i], b: zones[i + 1], t: t, idx: t >= 0.5 ? i + 1 : i, weights: weights };
      }
      if (val > v1) idx = i + 1;
    }
    weights[zones.length - 1] = 1;
    return { a: zones[zones.length - 1], b: zones[zones.length - 1], t: 0, idx: idx, weights: weights };
  }

  function scoreToCam(score, m) {
    var zones = getZonesForMode(m);
    if (!zones.length) return 0;
    var key = m === 'orta' ? 'camX' : 'cam';
    for (var i = 0; i < zones.length - 1; i++) {
      var z0 = zones[i], z1 = zones[i + 1];
      if (score >= z0.score && score <= z1.score) {
        var t = (score - z0.score) / (z1.score - z0.score);
        return z0[key] + (z1[key] - z0[key]) * t;
      }
    }
    var last = zones[zones.length - 1];
    var extra = Math.max(0, score - last.score);
    if (m === 'zirve') return last.cam + extra * 0.5;
    if (m === 'dip') return Math.max(-575, last.cam - extra * 0.1);
    return last.camX + extra * 3;
  }

  // ---- Gokyuzu & Su bantlari ----
  var SURFACE_UW_BANDS = ['#2f6f8f', '#296383', '#24597a', '#1b4666', '#163c59', '#12334f'];

  function renderBandGradient(c, bandsA, bandsB, t, startY, endY, bandH) {
    for (var k = 0; k < 6; k++) {
      var y0 = startY + k * bandH;
      if (y0 >= endY) break;
      var y1 = k === 5 ? endY : Math.min(endY, y0 + bandH);
      var colCurr = lerpColor(bandsA[k], bandsB[k], t);
      c.fillStyle = colCurr;
      c.fillRect(0, y0, GEO.W, y1 - y0);

      if (k < 5 && y1 === y0 + bandH) {
        var colNext = lerpColor(bandsA[k + 1], bandsB[k + 1], t);
        for (var j = 0; j < 6; j++) {
          var ry = y0 + bandH - 6 + j;
          if (ry >= endY) break;
          ditherRect(c, 0, ry, GEO.W, 1, null, colNext, (j + 1) / 7);
        }
      }
    }
  }

  function drawSky(blend, kesitY) {
    var za = blend.a, zb = blend.b, t = blend.t;
    if (!za || !zb) return;
    if (!skyCache) {
      skyCache = makeCanvas(GEO.W, GEO.H);
    }
    var qKesit = mode === 'dip' ? Math.round(kesitY) : -9999;
    var needRedraw =
      skyState.a !== za.id ||
      skyState.b !== zb.id ||
      Math.abs(skyState.t - t) > 0.01 ||
      skyState.kesit !== qKesit;

    if (needRedraw) {
      skyState.a = za.id;
      skyState.b = zb.id;
      skyState.t = t;
      skyState.kesit = qKesit;

      var sc = skyCache.ctx;
      if (mode === 'dip' && cam < -0.5) {
        var zones = getZonesForMode('dip');
        var bogazSky = zones[0].sky;
        if (qKesit > 0) {
          renderBandGradient(sc, bogazSky, bogazSky, 0, 0, Math.min(GEO.H, qKesit), 36);
        }
        var uwA = za.id === 'bogaz' ? SURFACE_UW_BANDS : za.sky;
        var uwB = zb.id === 'bogaz' ? SURFACE_UW_BANDS : zb.sky;
        var sy = Math.max(0, qKesit);
        if (sy < GEO.H) {
          renderBandGradient(sc, uwA, uwB, t, sy, GEO.H, 36);
        }
      } else {
        renderBandGradient(sc, za.sky, zb.sky, t, 0, GEO.H, 36);
      }
    }
    ctx.drawImage(skyCache.canvas, 0, 0);
  }

  // ---- Gunes, Yildizlar, Bulutlar ----
  function drawStars(blend, t) {
    var alpha = blend.a.starAlpha + (blend.b.starAlpha - blend.a.starAlpha) * blend.t;
    if (alpha <= 0.02) return;
    for (var i = 0; i < stars.length; i++) {
      var st = stars[i];
      var tw = 0.5 + 0.5 * Math.sin(t * st.rate + st.phase);
      ctx.globalAlpha = alpha * tw;
      px(ctx, st.x, st.y, 1, 1, PAL.star);
      if (st.plus) {
        ctx.globalAlpha = alpha * tw * 0.5;
        px(ctx, st.x - 1, st.y, 1, 1, PAL.star);
        px(ctx, st.x + 1, st.y, 1, 1, PAL.star);
        px(ctx, st.x, st.y - 1, 1, 1, PAL.star);
        px(ctx, st.x, st.y + 1, 1, 1, PAL.star);
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawSun(t, blend) {
    var sy = Math.round(GEO.SUN.y + cam * 0.3);
    if (sy - 24 > GEO.H || sy + 24 < 0) return;

    // Hale
    ctx.save();
    ctx.globalAlpha = 0.25;
    for (var dy = -22; dy <= 22; dy++) {
      var rOut = Math.floor(Math.sqrt(22 * 22 - dy * dy) + 0.5);
      var rIn = Math.abs(dy) <= 16 ? Math.floor(Math.sqrt(16 * 16 - dy * dy) + 0.5) : 0;
      for (var dx = -rOut; dx <= rOut; dx++) {
        if (Math.abs(dx) > rIn && BAYER4[(sy + dy) & 3][(GEO.SUN.x + dx) & 3] < 4) {
          px(ctx, GEO.SUN.x + dx, sy + dy, 1, 1, PAL.sunHalo);
        }
      }
    }
    ctx.restore();

    fillCirclePx(ctx, GEO.SUN.x, sy, 16, PAL.sunRim);
    fillCirclePx(ctx, GEO.SUN.x, sy, 13, PAL.sunMid);
    fillCirclePx(ctx, GEO.SUN.x, sy, 9, PAL.sunCore);

    // Retro kesikler (y=96, 97, 100 cam=0'da)
    var cutRows = [4, 5, 8];
    for (var i = 0; i < cutRows.length; i++) {
      var cy = sy + cutRows[i];
      if (cy >= 0 && cy < GEO.H) {
        var bandIdx = Math.min(5, Math.floor(cy / 36));
        var skyCol = lerpColor(blend.a.sky[bandIdx], blend.b.sky[bandIdx], blend.t);
        var hw = Math.floor(Math.sqrt(16 * 16 - cutRows[i] * cutRows[i]) + 0.5);
        px(ctx, GEO.SUN.x - hw, cy, hw * 2 + 1, 1, skyCol);
      }
    }
  }

  function drawClouds(layerType, t, nightW) {
    var targetP = layerType === 'far' ? 0.4 : (layerType === 'mid' ? 0.7 : 1.3);
    for (var i = 0; i < clouds.length; i++) {
      var cl = clouds[i];
      if (cl.p !== targetP) continue;
      var sy = Math.round(cl.baseY + (cam - cl.anchorCam) * cl.p);
      if (sy < -30 || sy > GEO.H + 30) continue;
      var cx = ((cl.x + t * cl.speed) % (GEO.W + 60)) - 30;

      var midCol = cl.p === 0.4 ? PAL.cloudLo : PAL.cloudMid;
      var hiCol = PAL.cloudHi;
      var shCol = PAL.cloudShadow;
      if (nightW > 0.3) {
        midCol = lerpColor(midCol, '#243266', nightW);
        hiCol = lerpColor(hiCol, '#2f3f78', nightW);
        shCol = lerpColor(shCol, '#1a2550', nightW);
      }

      var k, pt;
      for (k = 0; k < cl.parts.length; k++) {
        pt = cl.parts[k];
        fillCirclePx(ctx, cx + pt[0], sy + pt[1] + 2, pt[2], shCol);
      }
      for (k = 0; k < cl.parts.length; k++) {
        pt = cl.parts[k];
        fillCirclePx(ctx, cx + pt[0], sy + pt[1], pt[2], midCol);
      }
      for (k = 0; k < cl.parts.length; k++) {
        pt = cl.parts[k];
        fillDomePx(ctx, cx + pt[0], sy + pt[1] - Math.max(1, pt[2] - 2), Math.max(1, pt[2] - 2), hiCol, null, 'right');
      }
    }
  }

  // ---- Canli pencere & ikaz isiklari ----
  function drawLiveLights(t, lightsOn) {
    if (!lightsOn) return;
    var wyBase = Math.round(cam);
    var waterScreenY = Math.round(GEO.WATER_Y + cam);

    // Uzak tepeler isiklari (p = 0.6)
    var farYOff = Math.round(cam * 0.6);
    for (var x = 0; x < GEO.W; x += 7) {
      if (fnv1a('f' + x) % 5 === 0) {
        var fy = landTop(FAR_HILLS_TOP, x) + 2 + farYOff;
        if (fy >= 0 && fy < GEO.H) px(ctx, x, fy, 1, 1, PAL.win1);
      }
    }

    // Kopru tabliye lambalari + ucak ikaz isiklari (p = 1.0)
    var deckSy = GEO.DECK_Y + wyBase;
    if (deckSy >= 0 && deckSy < GEO.H) {
      for (x = 4; x < GEO.W; x += 8) {
        px(ctx, x, deckSy, 1, 1, PAL.win1);
      }
    }
    if (Math.floor(t * 2) % 2 === 0) {
      var redY = 41 + wyBase;
      if (redY >= 0 && redY < GEO.H) {
        px(ctx, GEO.TOWER_L, redY, 1, 1, PAL.red);
        px(ctx, GEO.TOWER_R, redY, 1, 1, PAL.red);
      }
    }

    // Camlica anten ikaz + kapsul pencereleri (p = 0.8)
    var camYOff = Math.round(cam * 0.8);
    if (Math.floor(t * 2) % 2 === 0) {
      var antY = -41 + camYOff;
      if (antY >= 0 && antY < GEO.H) px(ctx, 333, antY, 1, 1, PAL.red);
    }
    var podY = -18 + camYOff;
    if (podY >= 0 && podY < GEO.H) {
      for (x = 329; x <= 338; x += 2) {
        px(ctx, x, podY, 1, 1, PAL.win3);
      }
    }

    // Ev ve cami pencereleri + suda yansima
    for (var i = 0; i < windowCoords.length; i++) {
      var w = windowCoords[i];
      var lit = w.fixed ? true : w.litBase;
      if (!w.fixed) {
        var blinkSlot = Math.floor((t + (w.seed % 11)) / 8);
        if ((fnv1a('bl' + w.seed + '_' + blinkSlot) % 10) === 0 && ((t + w.seed) % 8) < 0.5) {
          lit = !lit;
        }
      }
      var sy = w.y + wyBase;
      if (sy >= 0 && sy < GEO.H) {
        px(ctx, w.x, sy, 1, 1, lit ? w.col : PAL.winOff);
      }
      if (lit && waterScreenY >= 0 && waterScreenY < GEO.H) {
        var dist = Math.max(1, Math.min(4, Math.round((GEO.WATER_Y - w.y) * 0.1)));
        var rx = w.x + Math.round(Math.sin(t * 3 + w.x));
        ctx.globalAlpha = 0.5;
        px(ctx, rx, waterScreenY + dist, 1, 2, w.col);
        ctx.globalAlpha = 1;
      }
    }
  }

  // ---- Su yuzeyi, yansima, kesit, su alti ----
  function drawWaterSurface(t, blend, isOrtaSariyer) {
    var wy0 = Math.round(GEO.WATER_Y + cam);
    var kesitBase = Math.round(GEO.KESIT_Y + cam);

    if (wy0 < GEO.H && kesitBase > 0) {
      var startY = Math.max(0, wy0);
      var endY = Math.min(GEO.H, kesitBase + 4);

      for (var y = startY; y < endY; y++) {
        var wy = y - Math.round(cam);
        var col = PAL.water4;
        if (wy < 110) col = PAL.water1;
        else if (wy < 116) col = PAL.water2;
        else if (wy < 123) col = PAL.water3;
        px(ctx, 0, y, GEO.W, 1, col);
      }

      // Kara-su birlesimi yansimalari (yalniz normal sahnede)
      if (mode !== 'orta' && wy0 >= -2 && wy0 < GEO.H) {
        for (var x = 0; x <= 104; x++) {
          var jx = x + Math.round(Math.sin(t * 2 + x * 0.3));
          px(ctx, jx, wy0, 1, 2, PAL.landRefl);
        }
        for (x = 280; x < GEO.W; x++) {
          jx = x + Math.round(Math.sin(t * 2 + x * 0.3));
          px(ctx, jx, wy0, 1, 2, PAL.landRefl);
        }
      }

      // Parilti cizgileri
      for (var i = 0; i < farSparkles.length; i++) {
        var sp = farSparkles[i];
        var sy = sp.y + Math.round(cam);
        if (sy >= 0 && sy < kesitBase) {
          var sx = Math.floor((sp.baseX + t * sp.speed) % GEO.W);
          px(ctx, sx, sy, sp.w, 1, PAL.waterHi);
        }
      }

      // Gunes yansima seridi (yatay, kesik isilti cizgileri)
      var reflAlpha = 1;
      if (mode === 'orta' || (mode === 'dip' && cam < -10)) {
        reflAlpha = 0;
      } else if (mode === 'zirve') {
        reflAlpha = (blend.weights[0] || 0) + (blend.weights[1] || 0) + (blend.weights[2] || 0);
      }
      if (reflAlpha > 0.02) {
        ctx.save();
        ctx.globalAlpha = reflAlpha;
        for (var ry = Math.max(wy0, 0); ry < Math.min(kesitBase, GEO.H); ry++) {
          var rwy = ry - Math.round(cam);
          if (rwy < 104 || rwy > 131 || (rwy % 3) !== 0) continue;
          var hw = Math.max(2, Math.round(9 - (rwy - 104) * 0.16));
          var rowJit = Math.round(Math.sin(t * 2.4 + rwy * 1.3) * 2);
          var rcol = rwy < 114 ? PAL.refl1 : (rwy < 122 ? PAL.refl2 : PAL.refl3);
          var segStart = 192 - hw + rowJit;
          var segEnd = 192 + hw + rowJit;
          for (var rx = segStart; rx <= segEnd; rx++) {
            if (((rx + rwy + Math.floor(t * 3)) % 5) < 3) {
              px(ctx, rx, ry, 1, 1, rcol);
            }
          }
        }
        ctx.restore();
      }
    }

    // Kayiklar & Vapur
    if (wy0 > -20 && wy0 < GEO.H + 20) {
      for (i = 0; i < boats.length; i++) {
        var bt = boats[i];
        var bx = ((bt.x + t * bt.speed * bt.dir) % (GEO.W + 30) + GEO.W + 30) % (GEO.W + 30) - 15;
        var by = bt.y + Math.round(cam) + Math.round(Math.sin(t * 2 + bt.phase));
        if (by >= 0 && by < GEO.H) {
          px(ctx, bx + 1, by - 1, 7, 1, PAL.wood1);
          px(ctx, bx, by - 2, 9, 1, PAL.wood2);
          px(ctx, bx + 4, by - 4, 1, 2, PAL.ink);
          px(ctx, bx + 2, by, 1, 1, PAL.wood3);
        }
      }

      // Vapur
      var ferryX = mode === 'orta' ? (170 + 6 * Math.sin(t * 0.3)) : ferry.x;
      var ferryY = 118 + Math.round(cam);
      drawFerry(ferryX, ferryY, t, blend.a.lightsOn);
    }

    // Kesit cizgisi + kopuk
    var ampMult = isOrtaSariyer ? 1.5 : 1;
    if (kesitBase >= -6 && kesitBase <= GEO.H + 6) {
      for (x = 0; x < GEO.W; x++) {
        var s1 = Math.sin(x * 0.12 + t * 1.8);
        var s2 = Math.sin(x * 0.31 - t * 2.4);
        var ky = kesitBase + Math.round((1.5 * s1 + 0.8 * s2) * ampMult);
        if (ky >= 0 && ky < GEO.H) {
          px(ctx, x, ky, 1, 1, PAL.surfLine);
          if (s1 > 0.6 && s2 > 0.6 && ky > 0) {
            px(ctx, x, ky - 1, 1, 1, PAL.foam);
          }
        }
      }
    }
  }

  function drawFerry(x, y, t, lightsOn) {
    if (x < -40 || x > GEO.W + 20 || y < -20 || y > GEO.H + 20) return;
    var fx = Math.round(x), fy = Math.round(y);
    // Kontur icin altlik
    px(ctx, fx - 1, fy - 7, 32, 7, PAL.ink);
    px(ctx, fx + 3, fy - 9, 24, 3, PAL.ink);
    px(ctx, fx + 7, fy - 10, 16, 2, PAL.ink);
    px(ctx, fx + 13, fy - 13, 5, 4, PAL.ink);

    // Govde
    px(ctx, fx + 2, fy - 1, 26, 1, PAL.ferryDark);
    px(ctx, fx + 1, fy - 2, 28, 1, PAL.ferryHull);
    px(ctx, fx, fy - 3, 29, 1, PAL.ferryHull);
    // Kabin
    px(ctx, fx + 4, fy - 6, 22, 3, PAL.ferryCab);
    px(ctx, fx + 4, fy - 4, 22, 1, PAL.ferryShade);
    for (var wx = fx + 5; wx <= fx + 23; wx += 2) {
      var wCol = lightsOn ? (((wx - fx) % 4 === 1) ? PAL.win1 : PAL.win3) : PAL.ferryWin;
      px(ctx, wx, fy - 5, 1, 1, wCol);
    }
    // Ust guverte + korkuluk
    px(ctx, fx + 8, fy - 8, 14, 2, PAL.ferryCab);
    for (wx = fx + 8; wx <= fx + 21; wx += 2) {
      px(ctx, wx, fy - 9, 1, 1, PAL.ferryShade);
    }
    // Baca
    px(ctx, fx + 14, fy - 12, 3, 3, PAL.ferryFunnel);
    px(ctx, fx + 14, fy - 12, 3, 1, PAL.ferryDark);

    // Kic izi
    for (var k = 1; k <= 8; k++) {
      if ((Math.floor(t * 8) + k) % 2 === 0) {
        px(ctx, fx - k, fy - (k % 2), 1, 1, PAL.foam);
      }
    }

    // Duman
    for (var s = 0; s < smokePuffs.length; s++) {
      var p = smokePuffs[s];
      ctx.globalAlpha = Math.max(0, 0.6 * (1 - p.age / 2.2));
      px(ctx, p.x, p.y + Math.round(cam), 2, 2, PAL.cloudLo);
    }
    ctx.globalAlpha = 1;
  }

  function drawUnderwater(t, blend) {
    var kesitBase = Math.round(GEO.KESIT_Y + cam);
    if (kesitBase >= GEO.H) return;

    // Yuzey suyu altindaki bantlar (yalniz zirve/orta veya dip cam=0 icin; dip cam<0 drawSky'da cizildi)
    if (mode !== 'dip' || cam >= -0.5) {
      var uwStart = Math.max(0, kesitBase + 1);
      for (var y = uwStart; y < GEO.H; y++) {
        var wy = y - Math.round(cam);
        var col = PAL.uw4;
        if (wy < 151) col = PAL.uw1;
        else if (wy < 171) col = PAL.uw2;
        else if (wy < 191) col = PAL.uw3;
        px(ctx, 0, y, GEO.W, 1, col);
        if (wy === 150 || wy === 170 || wy === 190) {
          var nextCol = wy === 150 ? PAL.uw2 : (wy === 170 ? PAL.uw3 : PAL.uw4);
          var rowB = BAYER4[y & 3];
          for (var bx0 = 0; bx0 < GEO.W; bx0++) {
            if (rowB[bx0 & 3] < 6) px(ctx, bx0, y, 1, 1, nextCol);
          }
        }
      }
    }

    // Isik huzmeleri
    var rayAlpha = blend.a.rayAlpha + (blend.b.rayAlpha - blend.a.rayAlpha) * blend.t;
    if (cam > -120) rayAlpha = Math.max(0.08, rayAlpha);
    if (rayAlpha > 0.005) {
      var rayXs = [60, 130, 200, 260, 330];
      ctx.save();
      ctx.globalAlpha = rayAlpha;
      var yTop = Math.max(0, kesitBase + 1);
      var yBot = GEO.H;
      for (var i = 0; i < rayXs.length; i++) {
        var rx = rayXs[i] + 4 * Math.sin(t * 0.5 + i);
        fillPolyPx(ctx, [
          [rx, yTop],
          [rx + 10, yTop],
          [rx + 22, yBot],
          [rx + 4, yBot]
        ], PAL.ray);
      }
      ctx.restore();
    }

    // Yuzey altinda vapur golgesi
    if ((mode === 'orta' || ferry.wait <= 0) && kesitBase + 4 > 0 && kesitBase < GEO.H) {
      var fshRaw = mode === 'orta' ? (170 + 6 * Math.sin(t * 0.3)) : ferry.x;
      var fshX = Math.round(fshRaw + 2);
      if (fshX > -32 && fshX < GEO.W) {
        ctx.save();
        ctx.globalAlpha = 0.28;
        px(ctx, fshX, kesitBase + 2, 26, 2, PAL.ink);
        px(ctx, fshX + 4, kesitBase + 4, 18, 1, PAL.ink);
        ctx.restore();
      }
    }

    // Kiyi raflari (seabed cache)
    var sbY = Math.round(cam - CACHE_OY);
    if (sbY < GEO.H && sbY + CACHE_H > 0) {
      ctx.drawImage(caches.seabed, 0, sbY);
    }

    // Yosunlar
    var weedXs = [14, 52, 70, 110, 292, 322, 340, 370];
    for (i = 0; i < weedXs.length; i++) {
      var wx = weedXs[i];
      var poly = wx < 192 ? SHELF_L_TOP : SHELF_R_TOP;
      var rootY = landTop(poly, wx) + Math.round(cam);
      var h = 14 + (i % 4) * 4;
      if (rootY < 0 || rootY - h > GEO.H) continue;
      for (var wy0 = 0; wy0 < h; wy0 += 2) {
        var segY = rootY - wy0;
        var segX = wx + Math.round(2 * Math.sin(t * 1.5 + segY * 0.3 + i));
        var wCol = wy0 >= h - 2 ? PAL.weedDark : ((wy0 / 2) % 2 === 0 ? PAL.weed1 : PAL.weed2);
        px(ctx, segX, segY, 2, 2, wCol);
      }
    }

    // Kiyi raflarinda yengec ve denizyildizi
    var crabX = Math.round(56 + 6 * Math.sin(t * 0.9));
    var crabY = landTop(SHELF_L_TOP, crabX) + Math.round(cam) - 2;
    if (crabY > kesitBase && crabY < GEO.H) {
      px(ctx, crabX, crabY, 4, 2, '#d95b43');
      px(ctx, crabX - 1, crabY + 1, 1, 1, '#b8422e');
      px(ctx, crabX + 4, crabY + 1, 1, 1, '#b8422e');
    }
    var starX = 328;
    var starY = landTop(SHELF_R_TOP, starX) + Math.round(cam) - 2;
    if (starY > kesitBase && starY < GEO.H) {
      px(ctx, starX, starY, 3, 1, '#f0a04b');
      px(ctx, starX + 1, starY - 1, 1, 3, '#f0a04b');
    }

    // Istavrit surusu (8 balik, y=160)
    var schoolX = 100 + 60 * Math.sin(t * 0.2);
    var schoolDir = Math.cos(t * 0.2) >= 0 ? 1 : -1;
    var schoolY = 160 + Math.round(cam);
    if (schoolY > -10 && schoolY < GEO.H + 10) {
      for (i = 0; i < 8; i++) {
        var fx = Math.round(schoolX + i * 7 + 3 * Math.sin(t + i));
        var fy = schoolY + (i % 3) * 5;
        drawFish4x2(fx, fy, schoolDir < 0);
      }
    }

    // Orta mesafede ikinci balik surusu (6 balik, y=173, ters yon)
    var school2X = 240 - 55 * Math.sin(t * 0.16 + 1.2);
    var school2Dir = -Math.cos(t * 0.16 + 1.2) >= 0 ? 1 : -1;
    var school2Y = 173 + Math.round(cam);
    if (school2Y > -10 && school2Y < GEO.H + 10) {
      for (i = 0; i < 6; i++) {
        var f2x = Math.round(school2X + i * 6 + 2 * Math.cos(t + i));
        var f2y = school2Y + (i % 2) * 4;
        px(ctx, f2x, f2y, 3, 1, PAL.fishDark);
        px(ctx, school2Dir < 0 ? f2x : f2x + 2, f2y + 1, 1, 1, PAL.fishBlue);
      }
    }

    // Lufer (y=185)
    var luferCycle = (t % 60);
    var luferDir = luferCycle < 30 ? 1 : -1;
    var luferX = luferDir === 1 ? (luferCycle / 30) * GEO.W : ((60 - luferCycle) / 30) * GEO.W;
    var luferY = 185 + Math.round(cam);
    if (luferY > -10 && luferY < GEO.H + 10) {
      drawLufer(Math.round(luferX), luferY, luferDir < 0);
    }

    // Kabarciklar
    for (i = 0; i < bubbles.length; i++) {
      var b = bubbles[i];
      var bx = Math.round(b.x + Math.sin(t * 3 + b.phase));
      var by = Math.round(b.y + cam);
      if (by > kesitBase && by < GEO.H) {
        px(ctx, bx, by, 1, 1, PAL.surfLine);
      }
    }
  }

  function drawFish4x2(x, y, flipX) {
    px(ctx, x, y, 4, 2, PAL.fishSilver);
    px(ctx, x, y, 4, 1, PAL.fishBlue);
    px(ctx, flipX ? x : x + 3, y, 1, 1, PAL.ink);
  }

  function drawLufer(x, y, flipX) {
    px(ctx, x, y + 1, 8, 2, PAL.fishBlue);
    px(ctx, x + 1, y, 6, 1, PAL.fishDark);
    px(ctx, flipX ? x + 7 : x, y, 1, 3, PAL.fishDark);
    px(ctx, flipX ? x + 1 : x + 6, y + 1, 1, 1, PAL.ink);
  }

  // ---- Bolgeye ozel katmanlar (§6.13) ----
  function drawZoneExtras(t, blend) {
    var w = blend.weights;

    // ZIRVE 1: GALATA HIZASI - kucuk marti surusu
    if (mode === 'zirve' && w[1] > 0.02) {
      ctx.save();
      ctx.globalAlpha = w[1];
      for (var i = 0; i < 4; i++) {
        var dir = i % 2 === 0 ? 1 : -1;
        var gx = ((i * 95 + t * (12 + i * 2) * dir) % (GEO.W + 20) + GEO.W + 20) % (GEO.W + 20) - 10;
        var gy = 72 + i * 10;
        var flap = Math.floor(t * 5 + i) % 2 === 0;
        px(ctx, gx + 2, gy + 1, 3, 2, PAL.gullW);
        px(ctx, gx, flap ? gy : gy + 2, 2, 1, PAL.gullG);
        px(ctx, gx + 5, flap ? gy : gy + 2, 2, 1, PAL.gullG);
      }
      ctx.restore();
    }

    // ZIRVE 2: CAMLICA - ucurtmalar (p = 0.8)
    if (mode === 'zirve' && (w[1] > 0.02 || w[2] > 0.02 || w[3] > 0.02)) {
      var camYOff = Math.round(cam * 0.8);
      var kites = [
        { x: 300, y: -30, c1: PAL.kiteA, c2: PAL.kiteB },
        { x: 356, y: -52, c1: PAL.kiteC, c2: PAL.kiteB }
      ];
      var anchorY = landTop(CAMLICA_TOP, 330) + camYOff;
      for (var k = 0; k < kites.length; k++) {
        var kt = kites[k];
        var kx = Math.round(kt.x + 2 * Math.sin(t * 1.8 + k));
        var ky = Math.round(kt.y + camYOff + 2 * Math.cos(t * 1.4 + k));
        if (ky < -20 || ky > GEO.H + 40) continue;

        // Ip
        ctx.save();
        ctx.globalAlpha = 0.5;
        for (var u = 0; u <= 1; u += 0.02) {
          var sx = Math.round(kx + (330 - kx) * u);
          var sy = Math.round(ky + 4 + (anchorY - (ky + 4)) * u + 6 * Math.sin(Math.PI * u));
          if (sy >= 0 && sy < GEO.H) px(ctx, sx, sy, 1, 1, PAL.star);
        }
        ctx.restore();

        // Eskenar dortgen 7x9
        var kw = [1, 3, 5, 7, 7, 5, 3, 1, 1];
        for (var r = 0; r < kw.length; r++) {
          var wRow = kw[r];
          var hw = Math.floor(wRow / 2);
          px(ctx, kx - hw, ky - 4 + r, hw, 1, kt.c1);
          px(ctx, kx, ky - 4 + r, hw + 1, 1, kt.c2);
          px(ctx, kx, ky - 4 + r, 1, 1, PAL.ink);
        }
        // Kuyruk
        for (var f = 1; f <= 5; f++) {
          px(ctx, kx + Math.round(3 * Math.sin(t * 3 + f)), ky + 4 + f * 3, 2, 1, kt.c1);
        }
      }
    }

    // ZIRVE 3: BULUT DENIZI - yolcu ucagi
    if (mode === 'zirve' && w[3] > 0.02) {
      ctx.save();
      ctx.globalAlpha = w[3];
      for (i = 0; i < plane.trail.length; i++) {
        var tr = plane.trail[i];
        var age = t - tr.t;
        if (age >= 0 && age < 4) {
          ctx.globalAlpha = w[3] * 0.6 * (1 - age / 4);
          px(ctx, tr.x, tr.y, 1, 1, PAL.cloudHi);
        }
      }
      ctx.globalAlpha = w[3];
      if (plane.active) {
        var plx = Math.round(plane.x), ply = 40;
        px(ctx, plx - 1, ply + 1, 19, 4, PAL.ink);
        px(ctx, plx, ply + 2, 16, 2, '#e6e3ee');
        px(ctx, plx + 16, ply + 2, 2, 1, '#e6e3ee');
        px(ctx, plx, ply, 3, 2, '#e6e3ee');
        px(ctx, plx + 6, ply + 4, 5, 2, '#c9c5d6');
        for (var pwx = 3; pwx <= 13; pwx += 2) {
          px(ctx, plx + pwx, ply + 2, 1, 1, PAL.ferryWin);
        }
        px(ctx, plx + 8, ply + 5, 1, 1, Math.floor(t * 2) % 2 === 0 ? PAL.red : PAL.green);
      }
      ctx.restore();
    }

    // ZIRVE 4: GECE ISTANBUL - sehir isiklari halisi + gece bulutlari
    if (mode === 'zirve' && w[4] > 0.02) {
      var cw = w[4];
      var y0 = Math.round(170 + (1 - cw) * 60);
      if (y0 < GEO.H) {
        px(ctx, 0, y0, GEO.W, GEO.H - y0, PAL.cityBase);
        ditherRect(ctx, 0, Math.max(0, y0 - 3), GEO.W, 3, null, '#2f3f78', 0.5);
        for (var cy = y0; cy < GEO.H; cy++) {
          var bx = 192 + 40 * Math.sin(cy * 0.05);
          px(ctx, bx - 10, cy, 21, 1, '#060a1a');
          for (var cx = 0; cx < GEO.W; cx += 2) {
            if (cx >= bx - 10 && cx <= bx + 10) continue;
            var ch = fnv1a('c' + cx + '_' + cy);
            if ((ch % 12) === 0) {
              var cCol = (ch % 10) < 6 ? PAL.city1 : ((ch % 10) < 9 ? PAL.city2 : PAL.city3);
              if ((ch % 20) === 0 && Math.floor(t * 2 + cx) % 2 === 0) continue;
              px(ctx, cx, cy, 1, 1, cCol);
            }
          }
        }
        // Iki kopru isik cizgisi
        var brYs = [y0 + 12, y0 + 28];
        for (i = 0; i < brYs.length; i++) {
          if (brYs[i] < GEO.H) {
            var bbx = 192 + 40 * Math.sin(brYs[i] * 0.05);
            for (cx = Math.round(bbx - 12); cx <= Math.round(bbx + 12); cx += 2) {
              px(ctx, cx, brYs[i], 1, 1, PAL.city3);
            }
          }
        }
      }
    }

    // ZIRVE 5: AY ISIGI - hilal ay, yildiz kaymasi, uydu
    if (mode === 'zirve' && w[5] > 0.02) {
      var mw = w[5];
      var my = Math.round(50 - (1 - mw) * 80);
      var mx = 300;
      // Hale
      ctx.save();
      ctx.globalAlpha = 0.3 * mw;
      for (var dy = -20; dy <= 20; dy++) {
        var rOut = Math.floor(Math.sqrt(20 * 20 - dy * dy) + 0.5);
        var rIn = Math.abs(dy) <= 14 ? Math.floor(Math.sqrt(14 * 14 - dy * dy) + 0.5) : 0;
        for (var dx = -rOut; dx <= rOut; dx++) {
          if (Math.abs(dx) > rIn && BAYER4[(my + dy) & 3][(mx + dx) & 3] < 5) {
            px(ctx, mx + dx, my + dy, 1, 1, PAL.moonGlow);
          }
        }
      }
      ctx.restore();
      fillCirclePx(ctx, mx, my, 14, PAL.moonShade);
      fillCirclePx(ctx, mx + 1, my - 1, 13, PAL.moon);
      var skyBand = Math.max(0, Math.min(5, Math.floor(my / 36)));
      var carveCol = lerpColor(blend.a.sky[skyBand], blend.b.sky[skyBand], blend.t);
      fillCirclePx(ctx, mx + 5, my - 3, 12, carveCol);

      // Uydu
      ctx.globalAlpha = 0.8 * mw;
      px(ctx, Math.round(satellite.x), 24, 1, 1, PAL.star);
      ctx.globalAlpha = 1;

      // Yildiz kaymasi
      if (shootingStar.active && mw > 0.5) {
        for (i = 0; i < 8; i++) {
          ctx.globalAlpha = mw * (1 - i / 8);
          px(ctx, shootingStar.x - shootingStar.vx * i * 0.01, shootingStar.y - shootingStar.vy * i * 0.01, 1, 1, PAL.star);
        }
        ctx.globalAlpha = 1;
      }
    }

    // DIP 1..4 ozel ogeler
    if (mode === 'dip') {
      // Siglik istavritleri (14 balik)
      if (w[1] > 0.02) {
        ctx.save();
        ctx.globalAlpha = w[1];
        for (i = 0; i < 14; i++) {
          var sx = Math.round((80 + i * 16 + t * 14) % (GEO.W + 20) - 10);
          var sy = Math.round(90 + (i % 4) * 14 + 4 * Math.sin(t * 2 + i));
          drawFish4x2(sx, sy, false);
        }
        ctx.restore();
      }

      // Akinti cizgileri + palamut/lufer + zincirli capa
      if (w[2] > 0.02) {
        ctx.save();
        ctx.globalAlpha = 0.15 * w[2];
        for (i = 0; i < currentLines.length; i++) {
          var cl = currentLines[i];
          var clx = ((cl.x - t * cl.speed) % GEO.W + GEO.W) % GEO.W;
          px(ctx, clx, cl.y, cl.len, 1, PAL.surfLine);
        }
        ctx.globalAlpha = w[2];
        for (i = 0; i < 12; i++) {
          var lx = ((380 - t * 24 - i * 24) % (GEO.W + 30) + GEO.W + 30) % (GEO.W + 30) - 15;
          var ly = 60 + (i % 4) * 24 + Math.round(3 * Math.sin(t + i));
          drawLufer(Math.round(lx), ly, true);
        }
        ctx.restore();

        // Zincirli capa (dunya anchorCam -250)
        var ancY = Math.round(120 + (cam - (-250)));
        var ancX = Math.round(120 + 2 * Math.sin(t * 1.2));
        if (ancY > -40 && ancY < GEO.H + 40) {
          for (var zy = ancY - 260; zy < ancY; zy += 3) {
            if (zy >= 0 && zy < GEO.H) {
              px(ctx, ancX, zy, (zy % 2 === 0 ? 1 : 2), (zy % 2 === 0 ? 2 : 1), '#4a5060');
            }
          }
          px(ctx, ancX, ancY, 1, 12, '#5a6070');
          px(ctx, ancX - 3, ancY + 2, 7, 1, '#5a6070');
          for (var dx = -5; dx <= 5; dx++) {
            var ay = ancY + 12 - Math.round(4 * (1 - (dx / 5) * (dx / 5)));
            px(ctx, ancX + dx, ay, 1, 1, (dx % 3 === 0 ? '#8a5a3a' : '#5a6070'));
          }
          px(ctx, ancX - 5, ancY + 6, 1, 2, '#5a6070');
          px(ctx, ancX + 5, ancY + 6, 1, 2, '#5a6070');
        }
      }

      // BatIk (anchorCam -400)
      if (w[3] > 0.02 || (w[2] > 0.02 && cam < -300)) {
        var bOff = Math.round(cam - (-400));
        if (bOff > -200 && bOff < 200) {
          var bPoly = BATIK_ROCK_TOP.map(function (pt) { return [pt[0], pt[1] + bOff]; });
          bPoly.push([200, 400 + bOff], [0, 400 + bOff]);
          fillPolyPx(ctx, bPoly, PAL.rock1);

          // Omurga + kaburgalar
          px(ctx, 26, 168 + bOff, 110, 2, PAL.wood1);
          var ribs = [30, 46, 62, 78, 94, 110, 126];
          for (i = 0; i < ribs.length; i++) {
            var rx0 = ribs[i];
            for (var s = 0; s <= 12; s++) {
              var ang = (s / 12) * (Math.PI / 2);
              var rbx = Math.round(rx0 + 6 * (1 - Math.cos(ang)));
              var rby = Math.round(168 - 28 * Math.sin(ang)) + bOff;
              px(ctx, rbx, rby, 2, 2, PAL.wood2);
              px(ctx, rbx, rby, 2, 1, PAL.wood3);
            }
          }
          // Kirik direk
          for (var d = 0; d <= 30; d++) {
            px(ctx, 80 + d, Math.round(160 - d * 1.33) + bOff, 2, 2, PAL.wood1);
          }
          // Amforalar + sandik
          drawSprite(ctx, AMPHORA_GRID, { '#': PAL.amph2 }, 150, 168 + bOff);
          drawSprite(ctx, AMPHORA_GRID, { '#': PAL.amph1 }, 162, 170 + bOff);
          px(ctx, 60, 160 + bOff, 8, 6, PAL.wood2);
          px(ctx, 60, 160 + bOff, 1, 1, PAL.win2);
          px(ctx, 67, 160 + bOff, 1, 1, PAL.win2);
          // Saklanan baliklar
          for (i = 0; i < 3; i++) {
            drawFish4x2(Math.round(50 + i * 28 + 10 * Math.sin(t + i)), 156 + bOff, Math.cos(t + i) < 0);
          }
        }
      }

      // Karanlik Dip (anchorCam -560)
      if (w[4] > 0.02) {
        var dOff = Math.round(cam - (-560));
        // Kayalik taban profili
        var floorPts = [];
        for (var fx = 0; fx <= GEO.W; fx += 6) {
          var ridge = Math.round(5 * Math.sin(fx * 0.045) + 3 * Math.cos(fx * 0.11) + (fx % 24 === 0 ? -3 : 0));
          floorPts.push([fx, 192 + ridge + dOff]);
        }
        floorPts.push([GEO.W, 260 + dOff], [0, 260 + dOff]);
        fillPolyPx(ctx, floorPts, '#162430');
        for (var rx0 = 0; rx0 < GEO.W; rx0 += 6) {
          var ry0 = 192 + Math.round(5 * Math.sin(rx0 * 0.045) + 3 * Math.cos(rx0 * 0.11) + (rx0 % 24 === 0 ? -3 : 0)) + dOff;
          px(ctx, rx0, ry0, 6, 1, '#2a4456');
        }

        // Kaya cikintilari ve tup solucanlari
        var wormSpots = [42, 134, 248, 326];
        for (i = 0; i < wormSpots.length; i++) {
          var wsx = wormSpots[i];
          var wsy = 190 + Math.round(5 * Math.sin(wsx * 0.045)) + dOff;
          px(ctx, wsx - 4, wsy - 2, 9, 4, '#203444');
          for (var wi = 0; wi < 3; wi++) {
            var wh = 5 + ((i + wi) % 3) * 2;
            var sway = Math.round(Math.sin(t * 2 + wi + i));
            px(ctx, wsx - 2 + wi * 3, wsy - 2 - wh, 1, wh, '#4a6b78');
            px(ctx, wsx - 2 + wi * 3 + sway, wsy - 3 - wh, 2, 1, '#ff7b7b');
          }
        }

        // Yari gomulu Bogaz nesneleri: kayik capasi (x=96) ve cay bardagi (x=286)
        var ancY = 191 + dOff;
        px(ctx, 96, ancY - 8, 2, 9, '#5e6b7a');
        px(ctx, 93, ancY - 6, 8, 1, '#5e6b7a');
        px(ctx, 92, ancY - 1, 10, 2, '#44505e');
        px(ctx, 92, ancY - 3, 2, 2, '#5e6b7a');
        px(ctx, 100, ancY - 3, 2, 2, '#5e6b7a');
        drawSprite(ctx, TEA_GRID, { '#': '#c89b6e' }, 286, 189 + dOff);

        // Marti cevresinde yumusak isik halkasi
        ctx.save();
        ctx.globalAlpha = 0.10 * w[4];
        fillCirclePx(ctx, GEO.GULL_X, GEO.GULL_Y, 18, '#7de8ff');
        ctx.globalAlpha = 0.06 * w[4];
        fillCirclePx(ctx, GEO.GULL_X, GEO.GULL_Y, 26, '#7de8ff');
        ctx.restore();

        // Fener baligi (isik yemi + yavas salinim)
        var angX = Math.round(72 + 18 * Math.sin(t * 0.35));
        var angY = Math.round(142 + 6 * Math.sin(t * 0.9)) + Math.round(dOff * 0.4);
        var angFlip = Math.cos(t * 0.35) < 0;
        ctx.globalAlpha = 0.92 * w[4];
        px(ctx, angX, angY, 10, 6, '#233146');
        px(ctx, angX + 2, angY - 1, 6, 1, '#314561');
        px(ctx, angFlip ? angX + 10 : angX - 2, angY + 1, 2, 4, '#233146');
        px(ctx, angFlip ? angX + 2 : angX + 7, angY + 2, 1, 1, '#ffd27a');
        var lureX = angFlip ? angX - 4 : angX + 12;
        var lureY = angY - 3 + Math.round(Math.sin(t * 2.5));
        px(ctx, angFlip ? angX : angX + 9, angY - 2, 1, 3, '#4e6785');
        px(ctx, lureX, lureY, 3, 3, '#9fffe0');
        px(ctx, lureX + 1, lureY + 1, 1, 1, '#ffffff');
        ctx.globalAlpha = 0.30 * w[4];
        fillCirclePx(ctx, lureX + 1, lureY + 1, 6, '#7de8ff');

        // Biyoluminesan plankton kumeleri (orta alana yayilmis, Bayer nokta + yavas nabiz)
        var planktons = [[108, 128], [164, 152], [224, 134], [278, 156]];
        for (i = 0; i < planktons.length; i++) {
          var pl = planktons[i];
          var pulseP = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 1.4 + i * 1.5));
          ctx.globalAlpha = pulseP * w[4];
          for (var pdy = -3; pdy <= 3; pdy++) {
            for (var pdx = -4; pdx <= 4; pdx++) {
              var dist2 = pdx * pdx + pdy * pdy;
              if (dist2 <= 14 && BAYER4[(pl[1] + pdy) & 3][(pl[0] + pdx) & 3] < (dist2 < 5 ? 10 : 5)) {
                px(ctx, pl[0] + pdx, pl[1] + pdy, 1, 1, dist2 < 4 ? '#9fffe0' : '#7de8ff');
              }
            }
          }
          px(ctx, pl[0], pl[1], 2, 2, '#9fffe0');
        }

        // Denizanalari
        for (i = 0; i < jellies.length; i++) {
          var jl = jellies[i];
          var jx = Math.round(jl.x + 4 * Math.sin(t * 0.6 + jl.phase));
          var jy = ((jl.y - t * jl.speed) % (GEO.H + 30) + GEO.H + 30) % (GEO.H + 30) - 15;
          var pulse = Math.sin(t * 4.2 + jl.phase) > 0 ? 1 : 0;
          ctx.globalAlpha = 0.6 * w[4];
          var jw = [3, 5, 7 - pulse, 7 - pulse, 7 - pulse];
          for (var jr = 0; jr < jw.length; jr++) {
            px(ctx, jx - Math.floor(jw[jr] / 2), Math.round(jy) + jr, jw[jr], 1, PAL.jelly);
          }
          for (var jt = -2; jt <= 2; jt += 2) {
            for (var seg = 0; seg < 7; seg++) {
              px(ctx, jx + jt + Math.round(Math.sin(t * 3 + seg * 0.6)), Math.round(jy) + 5 + seg, 1, 1, PAL.jelly);
            }
          }
        }
        // Deniz kari + isikli kucuk baliklar
        ctx.globalAlpha = 0.4 * w[4];
        for (i = 0; i < seaSnow.length; i++) {
          var sn = seaSnow[i];
          var sny = (sn.y + t * sn.speed) % GEO.H;
          px(ctx, Math.round(sn.x + Math.sin(t + sn.phase)), Math.round(sny), 1, 1, PAL.snow);
        }
        ctx.globalAlpha = w[4];
        for (i = 0; i < glowFish.length; i++) {
          var gf = glowFish[i];
          var gfx = Math.round((t * 15 + gf.ox) % GEO.W);
          var gfy = Math.round(130 + gf.oy + 4 * Math.sin(t * 2 + gf.phase));
          px(ctx, gfx, gfy, 2, 1, PAL.jelly);
        }
        ctx.globalAlpha = 1;
      }
    }
  }

  // ---- ORTA KARAR yatay sahne (§6.14) ----
  function shoreTop(wx) {
    return 72 + Math.round(10 * Math.sin(wx * 0.011) + 5 * Math.sin(wx * 0.037));
  }

  function drawDistantBridge(ox) {
    var tl = Math.round(ox - 60);
    var tr = Math.round(ox + 60);
    var topY = 64;
    var deckY = 84;
    // Kuleler kiyi/su hattina (104) kadar iner + 1px koyu taban
    px(ctx, tl - 1, topY, 2, 104 - topY, PAL.farHill);
    px(ctx, tr - 1, topY, 2, 104 - topY, PAL.farHill);
    px(ctx, tl - 2, 103, 4, 1, PAL.ink);
    px(ctx, tr - 2, 103, 4, 1, PAL.ink);
    // Tabliye ve kiyiya inen yaklasim ayaklari
    px(ctx, tl - 40, deckY, 200, 2, PAL.farHillRim);
    px(ctx, tl - 36, deckY + 2, 2, 104 - (deckY + 2), PAL.farHill);
    px(ctx, tr + 34, deckY + 2, 2, 104 - (deckY + 2), PAL.farHill);
    for (var x = tl; x <= tr; x++) {
      var u = (x - ox) / 60;
      var cy = Math.round(topY + 19 * (1 - u * u));
      px(ctx, x, cy, 1, 1, PAL.farHillRim);
      if (x % 4 === 0 && deckY > cy) {
        px(ctx, x, cy + 1, 1, deckY - cy - 1, PAL.farHill);
      }
    }
  }

  function drawOrtaPier(pxX) {
    // Ahsap iskele + durak tabelasi sprite'i
    px(ctx, pxX, 101, 20, 2, PAL.wood2);
    px(ctx, pxX, 101, 20, 1, PAL.wood3);
    px(ctx, pxX + 2, 103, 2, 2, PAL.wood1);
    px(ctx, pxX + 16, 103, 2, 2, PAL.wood1);
    // Tabela diregi ve levha
    px(ctx, pxX + 9, 93, 2, 8, PAL.wood1);
    px(ctx, pxX + 4, 88, 12, 6, PAL.ink);
    px(ctx, pxX + 5, 89, 10, 4, PAL.cream);
    px(ctx, pxX + 6, 90, 8, 1, PAL.gold);
  }

  function drawOrtaShore(t) {
    var i;
    // Uzak Anadolu tepeleri (sagda acik su ustu, yumusak baslangic)
    var farOff = Math.round(camX * 0.3);
    if (camX < 2000) {
      for (var sx = 240; sx < GEO.W; sx++) {
        var fx = sx + farOff;
        var fy = 95 + Math.round(3 * Math.sin(fx * 0.025) + 2 * Math.sin(fx * 0.06));
        if (sx < 264) {
          var fu = (sx - 240) / 24;
          fy = Math.round(104 - (104 - fy) * fu);
        }
        px(ctx, sx, fy, 1, 104 - fy, PAL.farHill);
        px(ctx, sx, fy, 1, 1, PAL.farHillRim);
      }
    }

    // Ortakoy / Rumeli Hisari arkasi uzak kopru
    var ortX = Math.round(990 - camX * 0.6 - 40);
    if (ortX > -120 && ortX < GEO.W + 120 && camX > 400 && camX < 1300) {
      drawDistantBridge(Math.round(990 - camX + 60));
    }
    if (camX > 1250 && camX < 2050) {
      drawDistantBridge(Math.round(1830 - camX + 80));
    }

    // Avrupa kiyisi (sol ~%70, sag ucu egimli burun)
    var maxWX = 2350;
    for (var x = 0; x < GEO.W; x++) {
      var wx = Math.round(x + camX);
      if (wx > maxWX) continue;
      var limitX = 270 + 40 * Math.sin(wx * 0.004);
      if (x > limitX) continue;
      var sy = shoreTop(wx);
      if (x > limitX - 24) {
        var su = (x - (limitX - 24)) / 24;
        sy = Math.round(sy + (104 - sy) * su * su);
      }
      px(ctx, x, sy, 1, 104 - sy, PAL.land);
      px(ctx, x, sy, 1, 1, PAL.landRim);
    }

    // Kiyi evleri (her 12 wx)
    var landmarks = [150, 570, 990, 1410, 1830, 2250];
    var startWX = Math.floor(camX / 12) * 12;
    for (wx = startWX; wx < camX + 300; wx += 12) {
      if (wx < 0 || wx > maxWX - 20) continue;
      var screenX = Math.round(wx - camX);
      if (screenX > 250) continue;
      var skip = false;
      for (var li = 0; li < landmarks.length; li++) {
        if (Math.abs(wx - landmarks[li]) < 42) { skip = true; break; }
      }
      if (skip) continue;
      var h = fnv1a('oh' + wx);
      if (h % 3 === 0) continue;
      var hw = 5 + (h % 4);
      var hh = 4 + ((h >>> 4) % 4);
      var hb = shoreTop(wx + Math.floor(hw / 2));
      px(ctx, screenX, hb - hh, hw, hh + 1, [PAL.bldA, PAL.bldB, PAL.bldC][h % 3]);
      px(ctx, screenX - 1, hb - hh - 1, hw + 2, 1, PAL.roofDark);
      px(ctx, screenX, hb - hh - 2, hw, 1, PAL.roof);
      if (h % 2 === 0) px(ctx, screenX + 1, hb - hh + 2, 1, 1, PAL.win1);
    }

    // Durak simge yapilari
    // 0: EMINONU (wx=150)
    var emX = Math.round(150 - camX);
    if (emX > -40 && emX < GEO.W + 40) {
      var emPoly = [[emX - 30, shoreTop(120)], [emX, shoreTop(150)], [emX + 30, shoreTop(180)]];
      drawMosqueStatic(ctx, emX, emPoly, 'L', 2, 0);
      // Galata Koprusu (iki uctan kiyiya/iskeleye oturan, ayaklari suya degen)
      var gbX0 = emX + 30;
      var gbW = 120;
      px(ctx, gbX0, 98, gbW, 3, PAL.bldB);
      px(ctx, gbX0, 97, gbW, 1, PAL.bldC);
      px(ctx, gbX0, 98, 4, 6, PAL.bldA);
      px(ctx, gbX0 + gbW - 4, 98, 4, 6, PAL.bldA);
      for (var ax = gbX0 + 10; ax < gbX0 + gbW - 8; ax += 14) {
        px(ctx, ax, 99, 3, 2, PAL.water1);
        px(ctx, ax + 6, 101, 2, 3, PAL.bldDark || PAL.ink);
      }
      drawOrtaPier(emX - 24);
    }

    // 1: BESIKTAS (wx=570)
    var beX = Math.round(570 - camX);
    if (beX > -40 && beX < GEO.W + 40) {
      var bb = shoreTop(570);
      px(ctx, beX - 3, bb - 26, 6, 27, PAL.bldB);
      px(ctx, beX - 2, bb - 29, 4, 3, PAL.bldC);
      px(ctx, beX - 1, bb - 24, 2, 2, PAL.win3);
      // Iskele binasi
      px(ctx, beX + 12, 95, 24, 8, PAL.bldA);
      px(ctx, beX + 11, 94, 26, 1, PAL.roof);
      px(ctx, beX + 14, 103, 2, 3, PAL.bldDark || PAL.ink);
      px(ctx, beX + 32, 103, 2, 3, PAL.bldDark || PAL.ink);
      for (var bwx = beX + 14; bwx < beX + 34; bwx += 4) px(ctx, bwx, 98, 2, 2, PAL.win1);
      drawOrtaPier(beX - 28);
    }

    // 2: ORTAKOY (wx=990)
    var okX = Math.round(990 - camX);
    if (okX > -40 && okX < GEO.W + 40) {
      var okPoly = [[okX - 20, 101], [okX + 20, 101]];
      drawMosqueStatic(ctx, okX, okPoly, 'M', 2, 0, 'light_stone');
      drawOrtaPier(okX - 28);
    }

    // 3: BEBEK (wx=1410)
    var bkX = Math.round(1410 - camX);
    if (bkX > -60 && bkX < GEO.W + 60) {
      var yaliCols = [PAL.wood3, '#c9a27a', '#e8e2d8'];
      for (var yi = 0; yi < 3; yi++) {
        var yx = bkX - 20 + yi * 24;
        var yb = shoreTop(1410 + yi * 24);
        px(ctx, yx, yb - 14, 20, 14, yaliCols[yi]);
        px(ctx, yx - 1, yb - 15, 22, 1, PAL.roof);
        for (var ywx = yx + 3; ywx < yx + 18; ywx += 5) {
          px(ctx, ywx, yb - 11, 2, 3, PAL.win1);
          px(ctx, ywx, yb - 5, 2, 3, PAL.win2);
        }
      }
      for (var ti = 0; ti < 4; ti++) {
        var tx = bkX - 30 + ti * 26;
        fillCirclePx(ctx, tx, shoreTop(1410) - 4, 4, ti % 2 === 0 ? PAL.pine2 : PAL.pine3);
      }
      drawOrtaPier(bkX - 36);
    }

    // 4: RUMELI HISARI (wx=1830)
    var rhX = Math.round(1830 - camX);
    if (rhX > -60 && rhX < GEO.W + 60) {
      var rhb = shoreTop(1830);
      px(ctx, rhX - 30, rhb - 6, 70, 7, PAL.bldA);
      for (var mx = rhX - 30; mx < rhX + 40; mx += 3) px(ctx, mx, rhb - 8, 2, 2, PAL.bldC);
      var towers = [[-22, 12, 34], [4, 10, 26], [26, 14, 30]];
      for (i = 0; i < towers.length; i++) {
        var tw = towers[i];
        var tx0 = rhX + tw[0];
        px(ctx, tx0, rhb - tw[2], tw[1], tw[2] + 1, PAL.bldB);
        for (var cr = 0; cr < 4; cr++) {
          px(ctx, tx0 + cr, rhb - tw[2] - 1 - cr, tw[1] - cr * 2, 1, '#3a2a3a');
        }
      }
      drawOrtaPier(rhX - 36);
    }

    // 5: SARIYER (wx=2250)
    var saX = Math.round(2250 - camX);
    if (saX > -60 && saX < GEO.W + 60) {
      var boatCols = [PAL.kiteA, PAL.kiteC, PAL.win2, PAL.kiteA];
      for (i = 0; i < 4; i++) {
        var sbx = saX - 20 + i * 22;
        px(ctx, sbx, 100, 16, 4, boatCols[i]);
        px(ctx, sbx + 4, 97, 7, 3, PAL.ferryCab);
        px(ctx, sbx + 7, 91, 1, 6, PAL.wood2);
      }
      for (i = 0; i < 5; i++) {
        drawPine(ctx, saX - 40 + i * 12, shoreTop(2210 + i * 12), 0);
      }
      drawOrtaPier(saX - 32);
    }
  }

  // ---- Kus suruleri ----
  function drawFlocks(t, blend) {
    var w = 1;
    if (mode === 'zirve') {
      w = (blend.weights[0] || 0) + (blend.weights[1] || 0) + (blend.weights[2] || 0);
    }
    if (w <= 0.02) return;
    ctx.save();
    ctx.globalAlpha = 0.8 * w;
    for (var i = 0; i < flocks.length; i++) {
      var fl = flocks[i];
      var fx = ((fl.x - t * fl.speed) % (GEO.W + 50) + GEO.W + 50) % (GEO.W + 50) - 25;
      var fy = fl.y + Math.round(cam * 0.5);
      if (fy < -20 || fy > GEO.H + 20) continue;
      var flap = Math.floor(t * 6 + i) % 2 === 0;
      for (var k = 0; k < fl.count; k++) {
        var bx = Math.round(fx + k * 5);
        var by = Math.round(fy + Math.abs(k - 2) * 2);
        px(ctx, bx, by, 1, 1, PAL.ink);
        px(ctx, bx - 1, flap ? by : by - 1, 1, 1, PAL.ink);
        px(ctx, bx + 1, flap ? by : by - 1, 1, 1, PAL.ink);
      }
    }
    ctx.restore();
  }

  // ---- Marti & Efektler ----
  function drawGull(t) {
    if (mode === 'menu' || uiPhase === 'menu') return;
    var gx = GEO.GULL_X - 9;
    var gy = GEO.GULL_Y - 5 + Math.round(Math.sin(t * 2));

    if (weakTimer > 0) {
      gx += (Math.floor(t * 20) % 2 === 0 ? 1 : -1);
    }
    if (passTimer > 0) {
      var pProg = 1 - passTimer / 1.5;
      gy += Math.round(8 * (1 - pProg));
    }

    var frame = 'mid';
    if (mode === 'dip' && cam < -10) {
      frame = 'dive';
      gx = GEO.GULL_X - 5;
      gy = GEO.GULL_Y - 9;
    } else if (weakTimer > 0) {
      frame = 'mid';
    } else if (flapBoostTimer > 0) {
      var fSeq = ['up', 'mid', 'down', 'mid'];
      frame = fSeq[Math.floor(t * 12) % 4];
    } else {
      var cycle = t % 4;
      if (cycle < 1.2) {
        var seq = ['up', 'mid', 'down', 'mid'];
        frame = seq[Math.floor(cycle * 8) % 4];
      }
    }

    if (uiPhase === 'cinematic') {
      gx = GEO.W - 64;
      gy = GEO.H - 46 + Math.round(Math.sin(t * 2));
    }
    drawSprite(ctx, GULL_FRAMES[frame], GULL_PAL, gx, gy, { outline: PAL.gullO });
  }

  function drawSparklesAndSmoke(t) {
    var i;
    for (i = 0; i < sparkles.length; i++) {
      var sp = sparkles[i];
      var prog = 1 - sp.life / sp.maxLife;
      var ang = sp.ang0 + prog * sp.rot;
      var sx = Math.round(GEO.GULL_X + Math.cos(ang) * sp.r);
      var sy = Math.round(GEO.GULL_Y + Math.sin(ang) * sp.r);
      px(ctx, sx, sy, 1, 1, sp.col);
      if (sp.plus) {
        px(ctx, sx - 1, sy, 1, 1, sp.col);
        px(ctx, sx + 1, sy, 1, 1, sp.col);
        px(ctx, sx, sy - 1, 1, 1, sp.col);
        px(ctx, sx, sy + 1, 1, 1, sp.col);
      }
    }
    for (i = 0; i < passSmoke.length; i++) {
      var sm = passSmoke[i];
      ctx.globalAlpha = Math.max(0, sm.life);
      px(ctx, sm.x, sm.y, 1, 1, '#8a8698');
    }
    ctx.globalAlpha = 1;
  }

  var bannerBuf = null;
  var bannerBufCtx = null;

  function ensureBannerBuf() {
    if (!bannerBuf && typeof document !== 'undefined') {
      bannerBuf = document.createElement('canvas');
      bannerBuf.width = GEO.W;
      bannerBuf.height = 96;
      bannerBufCtx = bannerBuf.getContext('2d');
      if (bannerBufCtx) bannerBufCtx.imageSmoothingEnabled = false;
    }
    return bannerBufCtx;
  }

  // ---- Bolge banneri (§5.6) ----
  function drawZoneBanner(t) {
    if (uiPhase === 'cinematic' || uiPhase === 'summary') {
      banner = null;
      return;
    }
    if (flashTimer > 0) {
      ctx.save();
      ctx.globalAlpha = 0.15 * (flashTimer / 0.3);
      px(ctx, 0, 0, GEO.W, GEO.H, '#ffffff');
      ctx.restore();
    }
    if (!banner || !root.PixelFont) return;
    var elapsedB = t - banner.startTime;
    if (elapsedB < 0 || elapsedB > 2.3) {
      if (elapsedB > 2.3) banner = null;
      return;
    }

    var y = 132;
    if (elapsedB < 0.3) {
      var u = elapsedB / 0.3;
      var c1 = 1.70158, c3 = c1 + 1;
      var easeOutBack = 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
      y = Math.round(132 - 24 * (1 - easeOutBack));
    }

    var bctx = ensureBannerBuf();
    if (!bctx) return;
    var bufTop = 96;
    var localY = y - bufTop;
    bctx.clearRect(0, 0, GEO.W, 96);

    root.PixelFont.draw(bctx, banner.text, 192, localY, {
      scale: 3, color: '#fff1d6', outline: '#1a1128', shadow: '#5a2a5e', align: 'center'
    });
    var m = root.PixelFont.measure(banner.text, 3);
    var lineProg = elapsedB <= 1.9 ? Math.min(1, elapsedB / 0.4) : 1;
    var lw = Math.round(m.w * lineProg);
    px(bctx, 192 - Math.floor(lw / 2), localY + m.h + 3, lw, 2, '#ffd27a');
    root.PixelFont.draw(bctx, banner.sub, 192, localY + m.h + 8, {
      scale: 1, color: '#ffd27a', outline: '#1a1128', align: 'center'
    });

    if (elapsedB > 1.9) {
      var fade = Math.min(1, (elapsedB - 1.9) / 0.4);
      var img = bctx.getImageData(0, 0, GEO.W, 96);
      var data = img.data;
      for (var py = 0; py < 96; py++) {
        var row = BAYER4[py & 3];
        var rowOff = py * GEO.W * 4;
        for (var px0 = 0; px0 < GEO.W; px0++) {
          var idx = rowOff + px0 * 4 + 3;
          if (data[idx] > 0 && (row[px0 & 3] / 16) < fade) {
            data[idx] = 0;
          }
        }
      }
      bctx.putImageData(img, 0, 0);
    }

    ctx.drawImage(bannerBuf, 0, bufTop);
  }

  // ---- Ana kare cizimi ----
  function render(t) {
    if (!ctx) return;
    var blend = getZoneBlend();
    var kesitY = GEO.KESIT_Y + cam;

    drawSky(blend, kesitY);

    var clipAboveWater = mode === 'dip' && cam < -0.5;
    if (!clipAboveWater || kesitY > 0) {
      if (clipAboveWater) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, GEO.W, Math.max(0, Math.round(kesitY)));
        ctx.clip();
      }
      drawStars(blend, t);
      drawSun(t, blend);
      drawClouds('far', t, mode === 'zirve' ? (blend.weights[4] || 0) : 0);

      if (mode === 'orta') {
        drawOrtaShore(t);
      } else {
        var farY = Math.round(cam * 0.6 - CACHE_OY);
        if (farY < GEO.H && farY + CACHE_H > 0) ctx.drawImage(caches.farHills, 0, farY);

        var camY = Math.round(cam * 0.8 - CACHE_OY);
        if (camY < GEO.H && camY + CACHE_H > 0) ctx.drawImage(caches.camlica, 0, camY);

        drawClouds('mid', t, mode === 'zirve' ? (blend.weights[4] || 0) : 0);

        var wyOff = Math.round(cam - CACHE_OY);
        if (wyOff < GEO.H && wyOff + CACHE_H > 0) {
          ctx.drawImage(caches.bridge, 0, wyOff);
          ctx.drawImage(caches.nearLand, 0, wyOff);
        }
        drawLiveLights(t, blend.a.lightsOn);
      }
      if (clipAboveWater) {
        ctx.restore();
      }
    }

    drawWaterSurface(t, blend, mode === 'orta' && blend.idx === 5);

    drawUnderwater(t, blend);

    drawZoneExtras(t, blend);
    drawFlocks(t, blend);
    drawGull(t);
    drawSparklesAndSmoke(t);
    drawClouds('near', t, 0);
    drawZoneBanner(t);
  }

  // ---- Simulasyon adimi ----
  function step(dt) {
    elapsed += dt;
    var k = 1 - Math.exp(-dt * 2.2);
    cam += (targetCam - cam) * k;
    camX += (targetCamX - camX) * k;

    if (weakTimer > 0) weakTimer = Math.max(0, weakTimer - dt);
    if (flapBoostTimer > 0) flapBoostTimer = Math.max(0, flapBoostTimer - dt);
    if (passTimer > 0) passTimer = Math.max(0, passTimer - dt);
    if (flashTimer > 0) flashTimer = Math.max(0, flashTimer - dt);

    var i;
    for (i = sparkles.length - 1; i >= 0; i--) {
      sparkles[i].life -= dt;
      if (sparkles[i].life <= 0) sparkles.splice(i, 1);
    }
    for (i = passSmoke.length - 1; i >= 0; i--) {
      passSmoke[i].y -= dt * 6;
      passSmoke[i].life -= dt;
      if (passSmoke[i].life <= 0) passSmoke.splice(i, 1);
    }

    // Vapur
    if (mode !== 'orta') {
      if (ferry.wait > 0) {
        ferry.wait -= dt;
        if (ferry.wait <= 0) ferry.x = -36;
      } else {
        ferry.x += ferry.speed * dt;
        if (ferry.x > GEO.W + 10) {
          ferry.wait = 6 + (fnv1a('fw' + Math.floor(elapsed)) % 7);
        }
      }
    }
    ferrySmokeTimer += dt;
    if (ferrySmokeTimer >= 2) {
      ferrySmokeTimer = 0;
      var fx = mode === 'orta' ? (170 + 6 * Math.sin(elapsed * 0.3)) : ferry.x;
      smokePuffs.push({ x: fx + 15, y: 105, age: 0 });
    }
    for (i = smokePuffs.length - 1; i >= 0; i--) {
      smokePuffs[i].age += dt;
      smokePuffs[i].y -= dt * 4;
      smokePuffs[i].x += dt * 3;
      if (smokePuffs[i].age > 2.2) smokePuffs.splice(i, 1);
    }

    // Kabarciklar
    var weedXs = [14, 52, 70, 110, 292, 322, 340, 370];
    if (bubbles.length < 10 && Math.floor(elapsed * 2) !== Math.floor((elapsed - dt) * 2)) {
      var wx = weedXs[Math.floor(elapsed * 3) % weedXs.length];
      var rPoly = wx < 192 ? SHELF_L_TOP : SHELF_R_TOP;
      bubbles.push({ x: wx, y: landTop(rPoly, wx) - 6, phase: elapsed });
    }
    if (mode === 'dip' && cam < -10) {
      diveBubbleTimer += dt;
      if (diveBubbleTimer >= 0.3) {
        diveBubbleTimer = 0;
        bubbles.push({ x: GEO.GULL_X, y: GEO.GULL_Y - 10 - cam, phase: elapsed });
      }
    }
    for (i = bubbles.length - 1; i >= 0; i--) {
      bubbles[i].y -= 8 * dt;
      if (bubbles[i].y <= GEO.KESIT_Y) bubbles.splice(i, 1);
    }

    // Ucak
    if (plane.active) {
      plane.x += 30 * dt;
      plane.trail.push({ x: Math.round(plane.x), y: 42, t: elapsed });
      if (plane.trail.length > 200) plane.trail.shift();
      if (plane.x > GEO.W + 20) {
        plane.active = false;
        plane.wait = 9;
      }
    } else {
      plane.wait -= dt;
      if (plane.wait <= 0) {
        plane.active = true;
        plane.x = -24;
      }
    }

    // Yildiz kaymasi & uydu
    satellite.x = (satellite.x + 6 * dt) % GEO.W;
    if (shootingStar.active) {
      shootingStar.x += shootingStar.vx * dt;
      shootingStar.y += shootingStar.vy * dt;
      shootingStar.life -= dt;
      if (shootingStar.life <= 0) shootingStar.active = false;
    } else {
      shootingStar.nextIn -= dt;
      if (shootingStar.nextIn <= 0) {
        var h = fnv1a('ss' + Math.floor(elapsed * 10));
        shootingStar.active = true;
        shootingStar.x = 60 + (h % 270);
        shootingStar.y = 10 + ((h >>> 8) % 50);
        var len = Math.sqrt(1 + 0.45 * 0.45);
        shootingStar.vx = (-1 / len) * 140;
        shootingStar.vy = (0.45 / len) * 140;
        shootingStar.life = 0.8;
        shootingStar.nextIn = 4 + (h % 4);
      }
    }
  }

  function loop(ts) {
    if (!lastTs) lastTs = ts;
    var dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;
    if (frozenTime === null) {
      step(dt);
      render(elapsed);
    }
    rafId = root.requestAnimationFrame(loop);
  }

  // ---- Tam ekran tam sayi olcek ----
  function updateCanvasScale() {
    if (!canvas || typeof window === 'undefined') return;
    var s = Math.ceil(Math.max(window.innerWidth / GEO.W, window.innerHeight / GEO.H));
    s = Math.max(1, s);
    var cw = GEO.W * s;
    var ch = GEO.H * s;
    canvas.style.position = 'fixed';
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    canvas.style.left = Math.round((window.innerWidth - cw) / 2) + 'px';
    canvas.style.top = Math.round((window.innerHeight - ch) / 2) + 'px';
    canvas.style.imageRendering = 'pixelated';
    document.documentElement.style.setProperty('--px', s + 'px');
  }

  // ---- Disa acik API ----
  function init(canvasEl) {
    canvas = canvasEl;
    if (!canvas) return;
    canvas.width = GEO.W;
    canvas.height = GEO.H;
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    buildStaticCaches();
    initEntities();
    updateCanvasScale();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateCanvasScale);
    }
    if (!rafId && typeof root.requestAnimationFrame === 'function') {
      lastTs = 0;
      rafId = root.requestAnimationFrame(loop);
    }
  }

  function setMode(modeId) {
    mode = modeId || 'menu';
    cam = 0;
    targetCam = 0;
    camX = 0;
    targetCamX = 0;
    maxZoneIndex = 0;
    banner = null;
    frozenTime = null;
    skyState.a = '';
  }

  function setScore(score, opts) {
    opts = opts || {};
    var zones = getZonesForMode(mode);
    var tc = scoreToCam(score, mode);
    if (mode === 'orta') targetCamX = tc;
    else targetCam = tc;

    if (opts.instant) {
      if (mode === 'orta') camX = targetCamX;
      else cam = targetCam;
    }

    var zoneIndex = 0;
    for (var i = 0; i < zones.length; i++) {
      if (score >= zones[i].score) zoneIndex = i;
    }
    var zone = zones[zoneIndex] || null;
    var zoneChanged = false;
    if (opts.instant) {
      maxZoneIndex = zoneIndex;
      return { zoneIndex: zoneIndex, zoneChanged: false, zone: zone };
    }
    if (zoneIndex > maxZoneIndex) {
      maxZoneIndex = zoneIndex;
      zoneChanged = true;
      if (zone) {
        var sub = formatBadge(mode, zone);
        banner = { text: zone.name, sub: sub, startTime: elapsed };
        flashTimer = 0.3;
        if (root.Sound && root.Sound.play) {
          root.Sound.play(mode === 'dip' ? 'dive' : 'zone');
        }
        if (typeof zoneEnterCb === 'function') {
          zoneEnterCb({ index: zoneIndex, name: zone.name, label: sub });
        }
      }
    }
    return { zoneIndex: zoneIndex, zoneChanged: zoneChanged, zone: zone };
  }

  function effect(name) {
    var i;
    if (name === 'perfect') {
      flapBoostTimer = 0.9;
      for (i = 0; i < 12; i++) {
        sparkles.push({
          ang0: (i / 12) * Math.PI * 2,
          rot: Math.PI * 4,
          r: 14,
          life: 1.2,
          maxLife: 1.2,
          col: i % 2 === 0 ? PAL.moon : PAL.refl1,
          plus: true
        });
      }
    } else if (name === 'good') {
      for (i = 0; i < 6; i++) {
        sparkles.push({
          ang0: (i / 6) * Math.PI * 2,
          rot: Math.PI * 2,
          r: 12,
          life: 0.8,
          maxLife: 0.8,
          col: PAL.refl1,
          plus: false
        });
      }
    } else if (name === 'weak') {
      weakTimer = 0.5;
    } else if (name === 'pass') {
      passTimer = 1.5;
      for (i = 0; i < 4; i++) {
        passSmoke.push({ x: GEO.GULL_X - 4 + i * 3, y: GEO.GULL_Y + 4, life: 1.0 });
      }
    }
  }

  function getZoneInfo() {
    var zones = getZonesForMode(mode);
    var blend = getZoneBlend();
    var icon = mode === 'dip' ? '▼' : (mode === 'orta' ? '◆' : '▲');
    if (!zones.length || !blend.a) {
      return { index: 0, name: 'BOĞAZ', label: '±0 m', icon: icon };
    }
    var scoreIdx = Math.min(zones.length - 1, Math.max(0, maxZoneIndex));
    var z = zones[scoreIdx];
    var label;
    if (mode === 'orta') {
      var km = blend.a.km + (blend.b.km - blend.a.km) * blend.t;
      label = (Math.round(km * 10) / 10).toLocaleString('tr-TR') + ' km';
    } else {
      var m = roundMeters(blend.a.meters + (blend.b.meters - blend.a.meters) * blend.t);
      label = m === 0 ? '±0 m' : ((mode === 'dip' ? '\u2212' : '+') + m.toLocaleString('tr-TR') + ' m');
    }
    return { index: scoreIdx, name: z ? z.name : 'BOĞAZ', label: label, icon: icon };
  }

  function onZoneEnter(cb) {
    zoneEnterCb = cb;
  }

  function debug(opts) {
    opts = opts || {};
    if (opts.mode) setMode(opts.mode);
    uiPhase = 'question';
    var zones = getZonesForMode(mode);
    var idx = Math.max(0, Math.min(zones.length - 1, opts.zoneIndex || 0));
    var z = zones[idx];
    if (z) {
      if (mode === 'orta') {
        camX = targetCamX = z.camX || 0;
      } else {
        cam = targetCam = z.cam || 0;
      }
      maxZoneIndex = idx;
    }
    if (typeof opts.freezeTime === 'number') {
      frozenTime = opts.freezeTime;
      elapsed = opts.freezeTime;
      if (mode === 'zirve' && idx === 3) {
        plane.active = true;
        plane.x = 180;
        plane.trail = [];
        for (var tx = 60; tx < 180; tx += 2) {
          plane.trail.push({ x: tx, y: 42, t: elapsed - (180 - tx) / 30 });
        }
      }
    }
    render(elapsed);
  }

  function selfTest() {
    var errs = [];
    var legsL = [88, 89, 94, 95];
    var legsR = [288, 289, 294, 295];
    var i, x;

    for (i = 0; i < legsL.length; i++) {
      x = legsL[i];
      if (landTop(NEAR_LAND_L_TOP, x) + 2 < landTop(NEAR_LAND_L_TOP, x)) {
        errs.push('bridge_leg_L_' + x);
      }
    }
    for (i = 0; i < legsR.length; i++) {
      x = legsR[i];
      if (landTop(NEAR_LAND_R_TOP, x) + 2 < landTop(NEAR_LAND_R_TOP, x)) {
        errs.push('bridge_leg_R_' + x);
      }
    }
    if (landTop(NEAR_LAND_L_TOP, 70) >= GEO.DECK_Y) errs.push('deck_not_buried_L');
    if (landTop(NEAR_LAND_R_TOP, 340) >= GEO.DECK_Y) errs.push('deck_not_buried_R');
    if (bridgeCableY(192) !== 76) errs.push('cable_mid_' + bridgeCableY(192));
    if (bridgeCableY(92) !== 44) errs.push('cable_L_' + bridgeCableY(92));
    if (bridgeCableY(292) !== 44) errs.push('cable_R_' + bridgeCableY(292));
    if (sideCableY('L', 40) < landTop(NEAR_LAND_L_TOP, 40)) errs.push('side_cable_L');
    if (sideCableY('R', 344) < landTop(NEAR_LAND_R_TOP, 344)) errs.push('side_cable_R');

    var galataBase = groundBase(NEAR_LAND_L_TOP, 55, 65);
    var galataBalcony = galataBase - 27;
    if (Math.abs((galataBalcony + 56) - 96) > 3) {
      errs.push('galata_align_' + (galataBalcony + 56));
    }
    if (Math.abs((-18 + 140 * 0.8) - 96) > 4) {
      errs.push('camlica_align');
    }

    for (i = 0; i < FOOTPRINTS.length; i++) {
      for (var j = i + 1; j < FOOTPRINTS.length; j++) {
        var a = FOOTPRINTS[i], b = FOOTPRINTS[j];
        if (a.layer === b.layer && a.x0 < b.x1 && b.x0 < a.x1) {
          errs.push('footprint_overlap:' + a.layer + ':' + a.name + '&' + b.name);
        }
      }
    }
    return errs;
  }

  function drawGullSprite(targetCtx, x, y, frame) {
    if (!targetCtx) return;
    var f = GULL_FRAMES[frame] ? frame : 'mid';
    drawSprite(targetCtx, GULL_FRAMES[f], GULL_PAL, x, y, { outline: PAL.gullO });
  }

  function setUiPhase(p) {
    uiPhase = p || 'menu';
  }

  function clearBanner() {
    banner = null;
    flashTimer = 0;
  }

  root.Scene = {
    init: init,
    setMode: setMode,
    setUiPhase: setUiPhase,
    clearBanner: clearBanner,
    setScore: setScore,
    effect: effect,
    getZoneInfo: getZoneInfo,
    onZoneEnter: onZoneEnter,
    debug: debug,
    selfTest: selfTest,
    drawGullSprite: drawGullSprite
  };
})(typeof window !== 'undefined' ? window : globalThis);
