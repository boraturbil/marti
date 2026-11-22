(function (root) {
  'use strict';

  var T = function (id, label, points, emoji, cssVar) {
    return { id: id, label: label, points: points, emoji: emoji, cssVar: cssVar };
  };

  var TIERS = [
    T('tam',      'TAM İSABET', 100, '🟨', '--tier-tam'),
    T('cokyakin', 'ÇOK YAKIN',   70, '🟩', '--tier-cokyakin'),
    T('yakin',    'YAKIN',       50, '🟦', '--tier-yakin'),
    T('uzak',     'UZAK',        30, '🟧', '--tier-uzak'),
    T('zayif',    'ZAYIF',       10, '🟥', '--tier-zayif')
  ];

  var TIER_MAP = {};
  for (var ti = 0; ti < TIERS.length; ti++) {
    TIER_MAP[TIERS[ti].id] = TIERS[ti];
  }

  var TIER_THRESHOLDS = {
    timeClosed: { exactRank: 1, cokyakin: 0.10, yakin: 0.25, uzak: 0.50 },
    timeOpen:   { exactDiff: 0, cokyakin: 0.03, yakin: 0.10, uzak: 0.30 },
    popYaygin:  { exactRank: 1, cokyakin: 0.10, yakin: 0.25, uzak: 0.50 },
    popNadir:   { tam: 0.5, cokyakin: 1.5, yakin: 4, uzak: 10, tailPoints: 100 },
    combo:      { exactDelta: 0, cokyakin: 0.10, yakin: 0.25, uzak: 0.45 }
  };

  // 9 mod: 4 ana NORMAL mod + 4 karma alt-mod (menüde tek KARMA girişi) + Günün Rotası
  var MODES = {
    yaygin: {
      id: 'yaygin',
      name: 'YAYGIN',
      dir: 'K',
      arrow: '↑',
      group: 'normal',
      kind: 'pop',
      axis: 'P',
      requires: ['P'],
      dailyLeg: true,
      cssVar: '--mode-yaygin',
      hint: 'En çok yazılan cevabı söyle.'
    },
    nadir: {
      id: 'nadir',
      name: 'NADİR',
      dir: 'G',
      arrow: '↓',
      group: 'normal',
      kind: 'pop',
      axis: 'P',
      requires: ['P'],
      dailyLeg: true,
      cssVar: '--mode-nadir',
      hint: 'En az yazılan ama geçerli cevabı söyle.'
    },
    eski: {
      id: 'eski',
      name: 'EN ESKİ',
      dir: 'B',
      arrow: '←',
      group: 'normal',
      kind: 'time',
      axis: 'T',
      requires: ['T'],
      dailyLeg: true,
      cssVar: '--mode-eski',
      hint: 'En erken tarihli cevabı söyle.'
    },
    yeni: {
      id: 'yeni',
      name: 'EN YENİ',
      dir: 'D',
      arrow: '→',
      group: 'normal',
      kind: 'time',
      axis: 'T',
      requires: ['T'],
      dailyLeg: true,
      cssVar: '--mode-yeni',
      hint: 'En geç tarihli cevabı söyle.'
    },
    klasik: {
      id: 'klasik',
      name: 'KLASİK',
      dir: 'KB',
      arrow: '↖',
      group: 'karma',
      kind: 'combo',
      axis: 'B',
      requires: ['T', 'P'],
      dailyLeg: false,
      cssVar: '--mode-klasik',
      hint: 'Hem eski hem yaygın cevabı söyle.'
    },
    gundem: {
      id: 'gundem',
      name: 'GÜNDEM',
      dir: 'KD',
      arrow: '↗',
      group: 'karma',
      kind: 'combo',
      axis: 'B',
      requires: ['T', 'P'],
      dailyLeg: false,
      cssVar: '--mode-gundem',
      hint: 'Hem yeni hem yaygın cevabı söyle.'
    },
    antika: {
      id: 'antika',
      name: 'ANTİKA',
      dir: 'GB',
      arrow: '↙',
      group: 'karma',
      kind: 'combo',
      axis: 'B',
      requires: ['T', 'P'],
      dailyLeg: false,
      cssVar: '--mode-antika',
      hint: 'Hem eski hem nadir cevabı söyle.'
    },
    kesif: {
      id: 'kesif',
      name: 'KEŞİF',
      dir: 'GD',
      arrow: '↘',
      group: 'karma',
      kind: 'combo',
      axis: 'B',
      requires: ['T', 'P'],
      dailyLeg: false,
      cssVar: '--mode-kesif',
      hint: 'Hem yeni hem nadir cevabı söyle.'
    },
    rota: {
      id: 'rota',
      name: 'GÜNÜN ROTASI',
      dir: 'MERKEZ',
      arrow: '◎',
      group: 'daily',
      kind: 'daily',
      axis: 'DAILY',
      requires: ['T', 'P'],
      dailyLeg: false,
      cssVar: '--mode-rota',
      hint: '4 ana yönden 5’er soru: toplam 20 soru.'
    }
  };

  var KARMA_GROUP = {
    id: 'karma',
    name: 'KARMA',
    dir: 'ÇAPRAZ',
    arrow: '✦',
    group: 'karma',
    kind: 'combo',
    axis: 'B',
    requires: ['T', 'P'],
    subModes: ['klasik', 'gundem', 'antika', 'kesif'],
    hint: 'İki eksenli karma havuzdan sorular.'
  };

  var KEYMAP = {
    COMBO_MS: 250,
    arrows: {
      ArrowUp: 'yaygin',
      ArrowDown: 'nadir',
      ArrowLeft: 'eski',
      ArrowRight: 'yeni'
    },
    arrowCombos: {
      'ArrowUp+ArrowLeft': 'klasik',
      'ArrowLeft+ArrowUp': 'klasik',
      'ArrowUp+ArrowRight': 'gundem',
      'ArrowRight+ArrowUp': 'gundem',
      'ArrowDown+ArrowLeft': 'antika',
      'ArrowLeft+ArrowDown': 'antika',
      'ArrowDown+ArrowRight': 'kesif',
      'ArrowRight+ArrowDown': 'kesif'
    },
    numpad: {
      Numpad8: 'yaygin',
      Numpad2: 'nadir',
      Numpad4: 'eski',
      Numpad6: 'yeni',
      Numpad7: 'klasik',
      Numpad9: 'gundem',
      Numpad1: 'antika',
      Numpad3: 'kesif',
      Numpad5: 'rota'
    },
    wasd: {
      KeyW: 'yaygin',
      KeyX: 'nadir',
      KeyA: 'eski',
      KeyD: 'yeni',
      KeyQ: 'klasik',
      KeyE: 'gundem',
      KeyZ: 'antika',
      KeyC: 'kesif',
      KeyS: 'rota'
    },
    actions: {
      confirm: ['Enter', 'Space'],
      menu: ['Escape'],
      sound: ['KeyM']
    }
  };

  var ERAS = [
    { id: 'antik',        name: 'Antik Çağ',     min: -Infinity, max: 499 },
    { id: 'ortacag',      name: 'Orta Çağ',      min: 500,       max: 1449 },
    { id: 'erken_modern', name: 'Erken Modern',  min: 1450,      max: 1799 },
    { id: 'sanayi',       name: 'Sanayi Çağı',   min: 1800,      max: 1899 },
    { id: 'yy20_basi',    name: '20. YY Başı',   min: 1900,      max: 1949 },
    { id: 'elektronik',   name: 'Elektronik',    min: 1950,      max: 1989 },
    { id: 'dijital',      name: 'Dijital Çağ',   min: 1990,      max: 2009 },
    { id: 'akilli',       name: 'Akıllı Çağ',    min: 2010,      max: Infinity },
    { id: 'simdi',        name: 'Şimdi',         min: null,      max: null }
  ];

  var config = {
    ROUND_SECONDS: 30,
    QUESTIONS_PER_ROUND: 5,
    ROUND_MAX: 500,
    DAY_MAX: 2000,
    SKIP_AFTER: 10,
    WARN: 5,
    EPOCH: '2026-12-01', // §8.2-S5
    STORAGE_KEY: 'pusulla.v3',
    REPORTS_STORAGE_KEY: 'pusulla.v3.reports',
    SEED_PREFIX: 'pusulla|',
    BOTH_FEEDS_SINGLE: true,
    DAILY_LEGS: ['yaygin', 'nadir', 'eski', 'yeni'],
    NORMAL_MODES: ['yaygin', 'nadir', 'eski', 'yeni'],
    KARMA_MODES: ['klasik', 'gundem', 'antika', 'kesif'],
    MODE_ORDER: ['yaygin', 'nadir', 'eski', 'yeni', 'klasik', 'gundem', 'antika', 'kesif', 'rota'],
    MENU_MODES: ['yaygin', 'nadir', 'eski', 'yeni', 'karma', 'rota'],
    MODES: MODES,
    KARMA_GROUP: KARMA_GROUP,
    KEYMAP: KEYMAP,
    TIERS: TIERS,
    TIER_MAP: TIER_MAP,
    TIER_THRESHOLDS: TIER_THRESHOLDS,
    PASS_TIER: T('pas', 'PAS', 0, '⬜', '--tier-pas'),
    TIMEOUT_TIER: T('sure', 'SÜRE DOLDU', 0, '⬜', '--tier-sure'),
    ERAS: ERAS
  };

  root.PUSULLA = root.PUSULLA || {};
  root.PUSULLA.config = config;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
  }
})(typeof window !== 'undefined' ? window : globalThis);
