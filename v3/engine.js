(function (root) {
  'use strict';

  var CFG = (root.PUSULLA && root.PUSULLA.config) ||
    (typeof require === 'function' ? require('./config.js') : {});

  var TIERS = CFG.TIERS || [
    { id: 'tam',      label: 'TAM İSABET', points: 100, emoji: '🟨', cssVar: '--tier-tam' },
    { id: 'cokyakin', label: 'ÇOK YAKIN',   points: 70,  emoji: '🟩', cssVar: '--tier-cokyakin' },
    { id: 'yakin',    label: 'YAKIN',       points: 50,  emoji: '🟦', cssVar: '--tier-yakin' },
    { id: 'uzak',     label: 'UZAK',        points: 30,  emoji: '🟧', cssVar: '--tier-uzak' },
    { id: 'zayif',    label: 'ZAYIF',       points: 10,  emoji: '🟥', cssVar: '--tier-zayif' }
  ];

  var TIER_MAP = CFG.TIER_MAP || {};
  if (!TIER_MAP.tam) {
    for (var ti = 0; ti < TIERS.length; ti++) {
      TIER_MAP[TIERS[ti].id] = TIERS[ti];
    }
  }

  var PASS_TIER = CFG.PASS_TIER || { id: 'pas', label: 'PAS', points: 0, emoji: '⬜', cssVar: '--tier-pas' };
  var TIMEOUT_TIER = CFG.TIMEOUT_TIER || { id: 'sure', label: 'SÜRE DOLDU', points: 0, emoji: '⬜', cssVar: '--tier-sure' };

  var THRESH = CFG.TIER_THRESHOLDS || {
    timeClosed: { exactRank: 1, cokyakin: 0.10, yakin: 0.25, uzak: 0.50 },
    timeOpen:   { exactDiff: 0, cokyakin: 0.03, yakin: 0.10, uzak: 0.30 },
    popYaygin:  { exactRank: 1, cokyakin: 0.10, yakin: 0.25, uzak: 0.50 },
    popNadir:   { tam: 0.5, cokyakin: 1.5, yakin: 4, uzak: 10, tailPoints: 100 },
    combo:      { exactDelta: 0, cokyakin: 0.10, yakin: 0.25, uzak: 0.45 }
  };

  var ERAS = CFG.ERAS || [
    { id: 'antik',        name: 'Antik Çağ',    min: -Infinity, max: 499 },
    { id: 'ortacag',      name: 'Orta Çağ',     min: 500,       max: 1449 },
    { id: 'erken_modern', name: 'Erken Modern', min: 1450,      max: 1799 },
    { id: 'sanayi',       name: 'Sanayi Çağı',  min: 1800,      max: 1899 },
    { id: 'yy20_basi',    name: '20. YY Başı',  min: 1900,      max: 1949 },
    { id: 'elektronik',   name: 'Elektronik',   min: 1950,      max: 1989 },
    { id: 'dijital',      name: 'Dijital Çağ',  min: 1990,      max: 2009 },
    { id: 'akilli',       name: 'Akıllı Çağ',   min: 2010,      max: Infinity },
    { id: 'simdi',        name: 'Şimdi',        min: null,      max: null }
  ];

  function normalizeRow(row, cols) {
    if (!row) return null;
    if (!Array.isArray(row)) {
      return {
        label: row.label,
        aliases: row.aliases || [],
        year: row.year !== undefined ? row.year : null,
        date: row.date || null,
        src: row.src || null,
        sl: typeof row.sl === 'number' ? row.sl : 0,
        f: typeof row.f === 'number' ? row.f : 0,
        tag: row.tag || null,
        tags: row.tags || null,
        info: row.info || null
      };
    }
    var c = cols || ['label', 'aliases', 'year', 'src', 'sl', 'f'];
    var obj = {
      label: null,
      aliases: [],
      year: null,
      date: null,
      src: null,
      sl: 0,
      f: 0,
      tag: null,
      tags: null,
      info: null
    };
    for (var i = 0; i < c.length; i++) {
      if (i < row.length) {
        obj[c[i]] = row[i];
      }
    }
    if (!Array.isArray(obj.aliases)) obj.aliases = [];
    if (typeof obj.sl !== 'number') obj.sl = 0;
    if (typeof obj.f !== 'number') obj.f = 0;
    return obj;
  }

  function getPoolRows(pool) {
    if (!pool) return [];
    var raw = Array.isArray(pool) ? pool : (pool.rows || []);
    var cols = (!Array.isArray(pool) && pool.cols) ? pool.cols : null;
    var out = new Array(raw.length);
    for (var i = 0; i < raw.length; i++) {
      out[i] = normalizeRow(raw[i], cols);
    }
    return out;
  }

  function filterPool(pool, q) {
    var rows = getPoolRows(pool);
    if (!q || !q.filter) return rows;
    var f = q.filter;
    var out = [];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (!r) continue;
      if (f.minYear !== undefined && f.minYear !== null) {
        if (typeof r.year !== 'number' || r.year < f.minYear) continue;
      }
      if (f.maxYear !== undefined && f.maxYear !== null) {
        if (typeof r.year !== 'number' || r.year > f.maxYear) continue;
      }
      if (f.tag !== undefined && f.tag !== null) {
        var hasTag = r.tag === f.tag || (Array.isArray(r.tags) && r.tags.indexOf(f.tag) !== -1);
        if (!hasTag) continue;
      }
      out.push(r);
    }
    return out;
  }

  function eraInfo(year) {
    if (year === null || year === undefined || typeof year !== 'number' || isNaN(year)) {
      for (var s = 0; s < ERAS.length; s++) {
        if (ERAS[s].id === 'simdi') return ERAS[s];
      }
      return { id: 'simdi', name: 'Şimdi', min: null, max: null };
    }
    for (var i = 0; i < ERAS.length; i++) {
      var e = ERAS[i];
      if (e.min === null || e.max === null) continue;
      if (year >= e.min && year <= e.max) return e;
    }
    return ERAS[ERAS.length - 1];
  }

  function eraOf(year) {
    return eraInfo(year).id;
  }

  function axesOf(q, pool) {
    var rows = filterPool(pool, q);
    var closed = Boolean((q && q.closed !== undefined) ? q.closed : (pool && pool.closed));
    var yearKind = (q && q.yearKind !== undefined) ? q.yearKind : ((pool && pool.yearKind) || null);

    var withYear = 0;
    for (var i = 0; i < rows.length; i++) {
      if (typeof rows[i].year === 'number' && !isNaN(rows[i].year)) {
        withYear++;
      }
    }
    var yearRatio = rows.length > 0 ? (withYear / rows.length) : 0;
    var hasTime = Boolean(yearKind) && rows.length > 0 && (closed ? (withYear === rows.length) : (yearRatio >= 0.90));

    var shareObj = q && q.share;
    var hasPop = false;
    if (shareObj && shareObj.estimated === true && Array.isArray(shareObj.list)) {
      var listLen = shareObj.list.length;
      var lenOk = closed ? (rows.length > 0 ? listLen >= rows.length : listLen > 0) : (listLen >= 10);
      if (lenOk) {
        var sum = 0;
        for (var j = 0; j < listLen; j++) {
          var item = shareObj.list[j];
          var val = Array.isArray(item) ? item[1] : (item && item.share);
          if (typeof val === 'number' && !isNaN(val)) sum += val;
        }
        if (sum >= 99 && sum <= 101) {
          hasPop = true;
        }
      }
    }

    var axis = (hasTime && hasPop) ? 'B' : (hasTime ? 'T' : (hasPop ? 'P' : null));
    var modes = [];
    if (hasPop) {
      modes.push('yaygin', 'nadir');
    }
    if (hasTime) {
      modes.push('eski', 'yeni');
    }
    if (hasTime && hasPop) {
      modes.push('klasik', 'gundem', 'antika', 'kesif');
    }

    return {
      time: hasTime,
      pop: hasPop,
      axis: axis,
      modes: modes,
      yearRatio: yearRatio
    };
  }

  function tierById(id) {
    return TIER_MAP[id] || TIER_MAP.zayif;
  }

  function tierFromPoints(points) {
    if (points >= 100) return tierById('tam');
    if (points >= 70) return tierById('cokyakin');
    if (points >= 50) return tierById('yakin');
    if (points >= 30) return tierById('uzak');
    if (points >= 10) return tierById('zayif');
    return PASS_TIER;
  }

  function parseAsOfYear(q, pool) {
    var asOf = (q && q.asOf) || (pool && pool.asOf) || '2026-11';
    var m = String(asOf).match(/^(\d{4})/);
    return m ? parseInt(m[1], 10) : 2026;
  }

  function compareTimeAsc(a, b) {
    if (a.year !== b.year) return a.year - b.year;
    if (a.date && b.date && a.date !== b.date) {
      return a.date < b.date ? -1 : 1;
    }
    return 0;
  }

  function buildShareLookup(q) {
    var map = Object.create(null);
    var list = (q && q.share && Array.isArray(q.share.list)) ? q.share.list : [];
    var entries = [];
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      var lbl = Array.isArray(item) ? item[0] : (item && item.label);
      var sh = Array.isArray(item) ? item[1] : (item && item.share);
      if (lbl != null && typeof sh === 'number' && !isNaN(sh)) {
        entries.push({ label: String(lbl), key: String(lbl).toLocaleLowerCase('tr-TR'), share: sh });
      }
    }
    for (var j = 0; j < entries.length; j++) {
      var rank = 1;
      for (var k = 0; k < entries.length; k++) {
        if (entries[k].share > entries[j].share) rank++;
      }
      entries[j].rankP = rank;
      map[entries[j].key] = entries[j];
    }
    return { map: map, count: entries.length };
  }

  function getShareEntry(lookup, row) {
    if (!row || !row.label) return null;
    return lookup.map[String(row.label).toLocaleLowerCase('tr-TR')] || null;
  }

  function computeTimeStats(rows, q, pool) {
    var closed = Boolean((q && q.closed !== undefined) ? q.closed : (pool && pool.closed));
    var asOfYear = parseAsOfYear(q, pool);
    var validRows = [];
    var ymin = Infinity;
    var ymax = -Infinity;

    for (var i = 0; i < rows.length; i++) {
      var y = rows[i].year;
      if (typeof y === 'number' && !isNaN(y)) {
        validRows.push(rows[i]);
        if (y < ymin) ymin = y;
        var capped = y > asOfYear ? asOfYear : y;
        if (capped > ymax) ymax = capped;
      }
    }
    return {
      closed: closed,
      asOfYear: asOfYear,
      validRows: validRows,
      ymin: ymin,
      ymax: ymax
    };
  }

  function rankTime(row, validRows, dir) {
    if (typeof row.year !== 'number' || isNaN(row.year)) return null;
    var rank = 1;
    for (var i = 0; i < validRows.length; i++) {
      var cmp = compareTimeAsc(validRows[i], row);
      if (dir === 'eski' && cmp < 0) rank++;
      if (dir === 'yeni' && cmp > 0) rank++;
    }
    return rank;
  }

  function scoreTimeRow(row, dir, timeStats) {
    if (typeof row.year !== 'number' || isNaN(row.year)) {
      return {
        points: 10,
        tierId: 'zayif',
        rankT: null,
        noYear: true,
        message: 'Geçerli ama yılsız kayıt'
      };
    }

    var n = timeStats.validRows.length;
    var r = rankTime(row, timeStats.validRows, dir);

    if (timeStats.closed) {
      if (n <= 1 || r === 1) {
        return { points: 100, tierId: 'tam', rankT: r, noYear: false };
      }
      var d = (r - 1) / (n - 1);
      var tc = THRESH.timeClosed;
      var tierId = d <= tc.cokyakin ? 'cokyakin' : (d <= tc.yakin ? 'yakin' : (d <= tc.uzak ? 'uzak' : 'zayif'));
      return { points: tierById(tierId).points, tierId: tierId, rankT: r, noYear: false };
    }

    // Açık küme: hedef yıl y*
    var yTarget = dir === 'eski' ? timeStats.ymin : timeStats.ymax;
    var span = timeStats.ymax - timeStats.ymin;
    var yVal = row.year > timeStats.asOfYear ? timeStats.asOfYear : row.year;
    if (span <= 0 || yVal === yTarget) {
      return { points: 100, tierId: 'tam', rankT: r, noYear: false };
    }
    var dy = Math.abs(yVal - yTarget) / span;
    var to = THRESH.timeOpen;
    var tid = dy <= to.cokyakin ? 'cokyakin' : (dy <= to.yakin ? 'yakin' : (dy <= to.uzak ? 'uzak' : 'zayif'));
    return { points: tierById(tid).points, tierId: tid, rankT: r, noYear: false };
  }

  function scorePopRow(row, dir, shareLookup) {
    var entry = getShareEntry(shareLookup, row);
    if (dir === 'yaygin') {
      if (!entry) {
        return { points: 10, tierId: 'zayif', rankP: null, share: null };
      }
      var n = shareLookup.count;
      if (n <= 1 || entry.rankP === 1) {
        return { points: 100, tierId: 'tam', rankP: entry.rankP, share: entry.share };
      }
      var d = (entry.rankP - 1) / (n - 1);
      var py = THRESH.popYaygin;
      var tid = d <= py.cokyakin ? 'cokyakin' : (d <= py.yakin ? 'yakin' : (d <= py.uzak ? 'uzak' : 'zayif'));
      return { points: tierById(tid).points, tierId: tid, rankP: entry.rankP, share: entry.share };
    }

    // NADİR: KARAR 9 — havuzda olup pay listesinde bulunmayan geçerli cevap = TAM PUAN (100)
    if (!entry) {
      return { points: 100, tierId: 'tam', rankP: null, share: null, tailTam: true };
    }
    var pn = THRESH.popNadir;
    var sh = entry.share;
    var nTid = sh <= pn.tam ? 'tam' : (sh <= pn.cokyakin ? 'cokyakin' : (sh <= pn.yakin ? 'yakin' : (sh <= pn.uzak ? 'uzak' : 'zayif')));
    return { points: tierById(nTid).points, tierId: nTid, rankP: entry.rankP, share: sh };
  }

  function comboDirections(modeId) {
    switch (modeId) {
      case 'klasik': return { timeDir: 'eski', popDir: 'yaygin' };
      case 'gundem': return { timeDir: 'yeni', popDir: 'yaygin' };
      case 'antika': return { timeDir: 'eski', popDir: 'nadir' };
      case 'kesif':  return { timeDir: 'yeni', popDir: 'nadir' };
      default:       return { timeDir: 'eski', popDir: 'yaygin' };
    }
  }

  function computeComboDistances(rows, modeId, q, pool, shareLookup, timeStats) {
    var dirs = comboDirections(modeId);
    var n = rows.length;
    var nTime = timeStats.validRows.length;

    // Pop sıralama anahtarı (küçük değer = hedef kutba daha yakın)
    var popMetrics = new Array(n);
    for (var i = 0; i < n; i++) {
      var r = rows[i];
      var e = getShareEntry(shareLookup, r);
      var sl = typeof r.sl === 'number' ? r.sl : 0;
      if (dirs.popDir === 'yaygin') {
        popMetrics[i] = {
          inList: Boolean(e),
          primary: e ? -e.share : 1,
          secondary: -sl
        };
      } else {
        // Nadir: pay listesinde olmayanlar (en düşük sl en nadir) önce, sonra pay listesi (düşük share önce)
        popMetrics[i] = {
          inList: Boolean(e),
          primary: e ? e.share : -1,
          secondary: e ? -sl : sl
        };
      }
    }

    function cmpPop(a, b) {
      if (a.inList !== b.inList) {
        if (dirs.popDir === 'yaygin') return a.inList ? -1 : 1;
        return a.inList ? 1 : -1;
      }
      if (a.primary !== b.primary) return a.primary - b.primary;
      if (a.secondary !== b.secondary) return a.secondary - b.secondary;
      return 0;
    }

    var ds = new Array(n);
    var dMin = Infinity;

    for (var idx = 0; idx < n; idx++) {
      var row = rows[idx];
      var dt = 1;
      var rt = rankTime(row, timeStats.validRows, dirs.timeDir);
      if (rt !== null) {
        dt = nTime <= 1 ? 0 : (rt - 1) / (nTime - 1);
      }

      var rpCombo = 1;
      for (var j = 0; j < n; j++) {
        if (cmpPop(popMetrics[j], popMetrics[idx]) < 0) rpCombo++;
      }
      var dp = n <= 1 ? 0 : (rpCombo - 1) / (n - 1);
      var D = Math.sqrt(dt * dt + dp * dp) / Math.SQRT2;
      ds[idx] = { D: D, dt: dt, dp: dp, rankT: rt, entry: getShareEntry(shareLookup, row) };
      if (D < dMin) dMin = D;
    }

    return { items: ds, dMin: dMin };
  }

  function scoreComboRow(rowIndex, comboData) {
    var item = comboData.items[rowIndex];
    var delta = item.D - comboData.dMin;
    var cb = THRESH.combo;
    var tid;
    if (delta <= 1e-9) {
      tid = 'tam';
    } else if (delta <= cb.cokyakin) {
      tid = 'cokyakin';
    } else if (delta <= cb.yakin) {
      tid = 'yakin';
    } else if (delta <= cb.uzak) {
      tid = 'uzak';
    } else {
      tid = 'zayif';
    }
    return {
      points: tierById(tid).points,
      tierId: tid,
      D: item.D,
      dMin: comboData.dMin,
      rankT: item.rankT,
      rankP: item.entry ? item.entry.rankP : null,
      share: item.entry ? item.entry.share : null
    };
  }

  function scoreAllRows(modeId, q, pool) {
    var rows = filterPool(pool, q);
    var shareLookup = buildShareLookup(q);
    var timeStats = computeTimeStats(rows, q, pool);
    var isTime = modeId === 'eski' || modeId === 'yeni';
    var isPop = modeId === 'yaygin' || modeId === 'nadir';
    var comboData = (!isTime && !isPop) ? computeComboDistances(rows, modeId, q, pool, shareLookup, timeStats) : null;

    var results = new Array(rows.length);
    for (var i = 0; i < rows.length; i++) {
      var res;
      if (isTime) {
        res = scoreTimeRow(rows[i], modeId, timeStats);
      } else if (isPop) {
        res = scorePopRow(rows[i], modeId, shareLookup);
      } else {
        res = scoreComboRow(i, comboData);
      }
      res.row = rows[i];
      res.rowIndex = i;
      results[i] = res;
    }
    return {
      rows: rows,
      results: results,
      shareLookup: shareLookup,
      timeStats: timeStats,
      kind: isTime ? 'time' : (isPop ? 'pop' : 'combo')
    };
  }

  function scoreAnswer(opts) {
    var modeId = opts.modeId;
    if (modeId === 'pas' || opts.pass) {
      return { points: 0, tierId: 'pas', tier: PASS_TIER, kind: 'pass' };
    }
    if (modeId === 'sure' || opts.timeout) {
      return { points: 0, tierId: 'sure', tier: TIMEOUT_TIER, kind: 'timeout' };
    }

    var q = opts.question || {};
    var pool = opts.pool;
    var all = scoreAllRows(modeId, q, pool);
    var rows = all.rows;

    var playerIdx = typeof opts.rowIndex === 'number' ? opts.rowIndex : -1;
    if (playerIdx < 0 && opts.row) {
      var targetLabel = opts.row.label || (Array.isArray(opts.row) ? opts.row[0] : null);
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].label === targetLabel) {
          playerIdx = i;
          break;
        }
      }
    }

    if (playerIdx < 0 || playerIdx >= rows.length) {
      return { points: 0, tierId: 'zayif', tier: tierById('zayif'), error: 'Satır havuzda bulunamadı' };
    }

    var playerRes = all.results[playerIdx];
    var bestList = all.results.slice().sort(function (a, b) {
      if (b.points !== a.points) return b.points - a.points;
      return (b.row.sl || 0) - (a.row.sl || 0);
    });

    var bestTop = bestList.slice(0, 3).map(function (item) {
      return {
        label: item.row.label,
        year: item.row.year,
        share: item.share !== undefined ? item.share : null,
        points: item.points,
        tierId: item.tierId
      };
    });

    var bestLabels = {};
    for (var b = 0; b < bestTop.length; b++) {
      bestLabels[bestTop[b].label] = true;
    }

    var dots = all.results.map(function (item, idx) {
      var r = item.row;
      return {
        label: r.label,
        year: r.year,
        approx: Boolean(r.f & 1),
        share: item.share !== undefined ? item.share : null,
        info: r.info || null,
        src: r.src || null,
        isPlayer: idx === playerIdx,
        isBest: Boolean(bestLabels[r.label]),
        // ekleme (geriye uyumlu): sonuç ekranında katman başına örnek cevap için
        tierId: item.tierId || null,
        points: typeof item.points === 'number' ? item.points : null,
        sl: r.sl || 0
      };
    });

    return {
      kind: all.kind,
      modeId: modeId,
      tierId: playerRes.tierId,
      tier: tierById(playerRes.tierId),
      points: playerRes.points,
      noYear: Boolean(playerRes.noYear),
      message: playerRes.message || null,
      player: {
        label: playerRes.row.label,
        year: playerRes.row.year,
        share: playerRes.share !== undefined ? playerRes.share : null,
        rankT: playerRes.rankT !== undefined ? playerRes.rankT : null,
        rankP: playerRes.rankP !== undefined ? playerRes.rankP : null
      },
      best: bestTop,
      dots: dots,
      poolSize: rows.length
    };
  }

  var engine = {
    normalizeRow: normalizeRow,
    getPoolRows: getPoolRows,
    filterPool: filterPool,
    axesOf: axesOf,
    eraOf: eraOf,
    eraInfo: eraInfo,
    tierFromPoints: tierFromPoints,
    scoreAllRows: scoreAllRows,
    scoreAnswer: scoreAnswer
  };

  root.PUSULLA = root.PUSULLA || {};
  root.PUSULLA.engine = engine;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = engine;
  }
})(typeof window !== 'undefined' ? window : globalThis);
