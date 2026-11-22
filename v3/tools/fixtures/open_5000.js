(function (root) {
  'use strict';

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var SYLLABLES = [
    'ka', 'ra', 'de', 'ni', 'zo', 'lu', 'ma', 'vi', 'ye', 'si',
    'ba', 'ri', 'ta', 'na', 'ko', 'ca', 'gu', 'ze', 'le', 'me',
    'se', 'fa', 'pa', 'sa', 'ha', 'ya', 'ci', 'ce', 'ge', 'te',
    'ak', 'al', 'an', 'ar', 'as', 'ay', 'az', 'el', 'en', 'er'
  ];

  function buildOpen5000(count, seed) {
    var n = count || 5000;
    var rng = mulberry32(seed || 20261122);
    var rows = new Array(n);
    var used = Object.create(null);

    for (var i = 0; i < n; i++) {
      var label;
      var guard = 0;
      do {
        var s1 = SYLLABLES[Math.floor(rng() * SYLLABLES.length)];
        var s2 = SYLLABLES[Math.floor(rng() * SYLLABLES.length)];
        var s3 = SYLLABLES[Math.floor(rng() * SYLLABLES.length)];
        var s4 = rng() > 0.4 ? SYLLABLES[Math.floor(rng() * SYLLABLES.length)] : '';
        var raw = s1 + s2 + s3 + s4;
        label = raw.charAt(0).toUpperCase() + raw.slice(1) + (guard > 2 ? ' ' + (i + 1) : '');
        guard++;
      } while (used[label]);
      used[label] = true;

      var alias = label.toLowerCase() + 'k';
      var year = i % 25 === 0 ? null : 1920 + Math.floor(rng() * 107);
      var sl = 1 + Math.floor(rng() * 120);
      rows[i] = [label, [alias], year, 'Q' + (100000 + i), sl, 0];
    }

    // Top 40 share list summing to 100.0
    var shareList = [];
    var weights = [];
    var totalW = 0;
    for (var k = 0; k < 40; k++) {
      var w = 40 - k;
      weights.push(w);
      totalW += w;
    }
    var sum = 0;
    for (var m = 0; m < 40; m++) {
      var pct = m < 39
        ? Math.round((weights[m] / totalW) * 1000) / 10
        : Math.round((100 - sum) * 10) / 10;
      sum += pct;
      shareList.push([rows[m][0], pct]);
    }

    var pool = {
      id: 'fx_open_5000',
      asOf: '2026-11',
      closed: false,
      yearKind: 'ilk-yayin',
      sources: ['fixture'],
      license: ['fixture'],
      cols: ['label', 'aliases', 'year', 'src', 'sl', 'f'],
      rows: rows
    };

    var question = {
      id: 'fx_open_5000_01',
      cat: 'genel',
      subject: 'SAHTE KAYIT',
      text: 'Bir tane SAHTE KAYIT söyle.',
      scope: '5000 kayıtlı deterministik test havuzu',
      pool: 'fx_open_5000',
      closed: false,
      yearKind: 'ilk-yayin',
      share: {
        estimated: true,
        by: 'fixture-2026-11',
        list: shareList
      },
      invalid: [
        { aliases: ['gecersiz bir', 'yasak kelime'], reason: 'Geçersiz test girişi.' },
        { aliases: ['ornek yanlis', 'hatali cevap'], reason: 'Bu cevap geçerli değil.' }
      ]
    };

    return { pool: pool, question: question };
  }

  var data = buildOpen5000(5000, 20261122);
  data.buildOpen5000 = buildOpen5000;

  root.PUSULLA_FIXTURES = root.PUSULLA_FIXTURES || {};
  root.PUSULLA_FIXTURES.open_5000 = data;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = data;
  }
})(typeof window !== 'undefined' ? window : globalThis);
