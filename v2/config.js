(function (root) {
  'use strict';
  var T = function (id, label, points, emoji, color, icon, effect, rule) {
    return { id: id, label: label, points: points, emoji: emoji, color: color, icon: icon, effect: effect, rule: rule };
  };
  root.PUSULLA_CONFIG = {
    ROUND_SECONDS: 30,
    QUESTIONS_PER_ROUND: 7,
    MAX_SCORE: 700,
    SKIP_AFTER_SECONDS: 10,   // GEÇ butonu 10 sn sonra (ya da ilk geçersiz/bulunamadı cevaptan sonra)
    WARN_SECONDS: 5,          // son 5 sn: çubuk kehribar + tik sesi
    REVEAL_MS: 2000,          // kademe şeridi + kamera hareketi süresi, sonra sonuç paneli
    EPOCH: '2026-11-22',      // Pusulla #1 günü
    STORAGE_KEY: 'pusulla.v2',
    MODE_ORDER: ['zirve', 'dip', 'orta'],
    MODES: {
      zirve: {
        id: 'zirve', name: 'ZİRVE', icon: '▲', daily: true, scene: 'zirve',
        desc: 'En çok verilen cevabı bul, martı göğe yükselsin.',
        hint: 'HERKESİN VERECEĞİ CEVABI VER.',
        listTitle: 'EN ÇOK VERİLENLER',
        tiers: [
          T('mukemmel', 'MÜKEMMEL',   100, '🟨', '#ffcc4d', '★', 'perfect', { rankMax: 1 }),
          T('cokiyi',   'ÇOK İYİ',     70, '🟩', '#5fd068', '◆', 'good',    { rankMin: 2, rankMax: 2 }),
          T('iyi',      'İYİ',         50, '🟦', '#5ab8e8', '◆', 'good',    { rankMin: 3, rankMax: 3 }),
          T('idare',    'İDARE EDER',  30, '🟧', '#f0a04b', '◇', 'good',    { rankMin: 4, shareMin: 5 }),
          T('zayif',    'ZAYIF',       10, '🟥', '#e5594f', '➜', 'weak',    {})
        ]
      },
      dip: {
        id: 'dip', name: 'DİP', icon: '▼', daily: true, scene: 'dip',
        desc: 'En nadir ama geçerli cevabı bul, martı Boğaz\'ın dibine dalsın.',
        hint: 'EN NADİR AMA GEÇERLİ CEVABI VER.',
        listTitle: 'DERİNLERDEN ÖRNEKLER',
        tiers: [
          T('mukemmel', 'MÜKEMMEL',   100, '🟨', '#ffcc4d', '★', 'perfect', { shareMax: 0.5 }),
          T('cokiyi',   'ÇOK İYİ',     70, '🟩', '#5fd068', '◆', 'good',    { shareMax: 1.5 }),
          T('iyi',      'İYİ',         50, '🟦', '#5ab8e8', '◆', 'good',    { shareMax: 4 }),
          T('idare',    'İDARE EDER',  30, '🟧', '#f0a04b', '◇', 'good',    { shareMax: 10 }),
          T('zayif',    'ZAYIF',       10, '🟥', '#e5594f', '➜', 'weak',    {})
        ]
      },
      orta: {
        id: 'orta', name: 'ORTA KARAR', icon: '◆', daily: true, scene: 'orta',
        desc: 'Ne en çok ne en az: ortadaki cevabı bul, martı vapur hattında ilerlesin.',
        hint: 'NE EN ÇOK NE EN AZ: 4.–6. SIRADAKİ CEVABI BUL.',
        listTitle: 'ORTADAKİLER',
        tiers: [
          T('mukemmel', 'TAM ORTA',   100, '🟨', '#ffcc4d', '★', 'perfect', { rankMin: 4, rankMax: 6,  shareMin: 0.5 }),
          T('cokiyi',   'ÇOK YAKIN',   70, '🟩', '#5fd068', '◆', 'good',    { rankMin: 3, rankMax: 8,  shareMin: 0.5 }),
          T('iyi',      'YAKIN',       50, '🟦', '#5ab8e8', '◆', 'good',    { rankMin: 2, rankMax: 11, shareMin: 0.5 }),
          T('idare',    'UZAK',        30, '🟧', '#f0a04b', '◇', 'good',    { rankMin: 12, shareMin: 0.5 }),
          T('zayif',    'ZAYIF',       10, '🟥', '#e5594f', '➜', 'weak',    {})
        ]
      },
      sinirsiz: {
        id: 'sinirsiz', name: 'SINIRSIZ', icon: '∞', daily: false, scene: null,
        desc: 'Havuzdan rastgele 7 soru. Seri ve istatistiği etkilemez.'
      }
    },
    PASS_TIER:    T('pas',   'PAS',        0, '⬜', '#8a8698', '⏭', 'pass', {}),
    TIMEOUT_TIER: T('sure',  'SÜRE DOLDU', 0, '⬜', '#8a8698', '⌛', 'pass', {})
  };

  function fnv1a(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function parseDayKeyUtcMs(dayKey) {
    var parts = String(dayKey || '').split('-');
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var d = parseInt(parts[2], 10);
    return Date.UTC(y, m - 1, d);
  }

  function dayKeyToEpochDay(dayKey) {
    var epochMs = parseDayKeyUtcMs(root.PUSULLA_CONFIG.EPOCH);
    var dayMs = parseDayKeyUtcMs(dayKey);
    return Math.round((dayMs - epochMs) / 86400000);
  }

  var FORBIDDEN_ADJACENT_PAIRS = [
    ['q30', 'q32'],
    ['q03', 'q35']
  ];

  function isForbiddenAdjacent(idA, idB) {
    for (var i = 0; i < FORBIDDEN_ADJACENT_PAIRS.length; i++) {
      var p = FORBIDDEN_ADJACENT_PAIRS[i];
      if ((idA === p[0] && idB === p[1]) || (idA === p[1] && idB === p[0])) {
        return true;
      }
    }
    return false;
  }

  function countForbiddenAdjacent(list) {
    var cnt = 0;
    for (var i = 0; i < list.length - 1; i++) {
      if (isForbiddenAdjacent(list[i].id, list[i + 1].id)) cnt++;
    }
    return cnt;
  }

  function separateForbiddenPairs(list) {
    var arr = list.slice();
    var len = arr.length;
    for (var pass = 0; pass < len; pass++) {
      var swapped = false;
      for (var i = 0; i < len - 1; i++) {
        if (!isForbiddenAdjacent(arr[i].id, arr[i + 1].id)) continue;
        var k = i + 1;
        var curCount = countForbiddenAdjacent(arr);
        var candidates = [];
        for (var j1 = k + 1; j1 < len; j1++) candidates.push(j1);
        for (var j2 = 0; j2 < i; j2++) candidates.push(j2);
        for (var ci = 0; ci < candidates.length; ci++) {
          var j = candidates[ci];
          var tmp = arr[k];
          arr[k] = arr[j];
          arr[j] = tmp;
          if (countForbiddenAdjacent(arr) < curCount) {
            swapped = true;
            break;
          }
          arr[j] = arr[k];
          arr[k] = tmp;
        }
        if (swapped) break;
      }
      if (!swapped) break;
    }
    return arr;
  }

  function getDailySet(dayKey, questions) {
    var qs = (questions || root.QUESTIONS || []).slice().sort(function (a, b) {
      return String(a.id).localeCompare(String(b.id));
    });
    var n = qs.length;
    var pool = [];
    for (var i = 0; i < n; i++) pool.push(i);

    var epochDay = dayKeyToEpochDay(dayKey);
    var k = Math.max(1, Math.floor(n / 21));
    var cycle = Math.floor(epochDay / k);
    var part = ((epochDay % k) + k) % k;
    var order = shuffle(pool, mulberry32(fnv1a('pusulla|' + cycle)));

    var picked;
    if (n < 21) {
      picked = { zirve: [], dip: [], orta: [] };
      var modes = ['zirve', 'dip', 'orta'];
      for (var mi = 0; mi < modes.length; mi++) {
        for (var qi = 0; qi < 7; qi++) {
          picked[modes[mi]].push(qs[order[(mi * 7 + qi) % n]]);
        }
      }
    } else {
      var dayPart = order.slice(part * 21, part * 21 + 21);
      var mapIdx = function (idx) { return qs[idx]; };
      picked = {
        zirve: dayPart.slice(0, 7).map(mapIdx),
        dip: dayPart.slice(7, 14).map(mapIdx),
        orta: dayPart.slice(14, 21).map(mapIdx)
      };
    }

    return {
      dayKey: dayKey,
      epochDay: epochDay,
      dayNumber: Math.max(1, epochDay + 1),
      zirve: separateForbiddenPairs(shuffle(picked.zirve, mulberry32(fnv1a(dayKey + '|zirve')))),
      dip: separateForbiddenPairs(shuffle(picked.dip, mulberry32(fnv1a(dayKey + '|dip')))),
      orta: separateForbiddenPairs(shuffle(picked.orta, mulberry32(fnv1a(dayKey + '|orta'))))
    };
  }

  root.PUSULLA_DAILY = {
    fnv1a: fnv1a,
    mulberry32: mulberry32,
    shuffle: shuffle,
    dayKeyToEpochDay: dayKeyToEpochDay,
    getDailySet: getDailySet
  };
})(typeof window !== 'undefined' ? window : globalThis);
