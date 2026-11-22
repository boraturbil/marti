(function (root) {
  'use strict';

  var CFG = (root.PUSULLA && root.PUSULLA.config) || (typeof require === 'function' ? require('./config.js') : {});
  var EPOCH = CFG.EPOCH || '2026-12-01';
  var SEED_PREFIX = CFG.SEED_PREFIX || 'pusulla|';
  var QUESTIONS_PER_LEG = CFG.QUESTIONS_PER_ROUND || 5;
  var DAILY_LEGS = CFG.DAILY_LEGS || ['yaygin', 'nadir', 'eski', 'yeni'];
  var QUESTIONS_PER_DAY = DAILY_LEGS.length * QUESTIONS_PER_LEG; // 20
  var BOUNDARY_DAYS = 3;

  function fnv1a(str) {
    var h = 2166136261;
    var s = String(str);
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function parseDayKeyUtcMs(dayKey) {
    var parts = String(dayKey || EPOCH).split('-');
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var d = parseInt(parts[2], 10);
    return Date.UTC(y, m - 1, d);
  }

  function dayKeyToEpochDay(dayKey) {
    var epochMs = parseDayKeyUtcMs(EPOCH);
    var dayMs = parseDayKeyUtcMs(dayKey);
    return Math.round((dayMs - epochMs) / 86400000);
  }

  function epochDayToDayKey(epochDay) {
    var ms = parseDayKeyUtcMs(EPOCH) + epochDay * 86400000;
    var dt = new Date(ms);
    var y = dt.getUTCFullYear();
    var m = String(dt.getUTCMonth() + 1).padStart(2, '0');
    var d = String(dt.getUTCDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  }

  function getTodayKey(dateObj) {
    var d = dateObj || new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function axisOf(q) {
    if (!q || typeof q !== 'object') return 'B';
    if (q.axis === 'T' || q.axis === 'P' || q.axis === 'B') return q.axis;
    if (q.axes === 'T' || q.axes === 'P' || q.axes === 'B') return q.axes;
    var hasT = Boolean(q.hasTime);
    var hasP = Boolean(q.hasPop);
    if (!hasT && !hasP && Array.isArray(q.pool)) {
      for (var i = 0; i < q.pool.length; i++) {
        var row = q.pool[i];
        if (row && row.year != null) hasT = true;
        if (row && row.share != null) hasP = true;
        if (hasT && hasP) break;
      }
    }
    if (hasT && hasP) return 'B';
    if (hasT) return 'T';
    if (hasP) return 'P';
    return 'B';
  }

  function sortQuestions(questions) {
    return (questions || []).slice().sort(function (a, b) {
      return String(a.id).localeCompare(String(b.id));
    });
  }

  function computeCycleDays(poolSize) {
    return Math.max(1, Math.floor(poolSize / QUESTIONS_PER_DAY));
  }

  // Bir liste içinden, döngü sınırındaki yasaklı ID'leri arka günlere (day >= safeStart),
  // güvenli ID'leri ise ön günlerden başlayarak yerleştir.
  function placeAcrossDays(items, dayBuckets, maxPerDay, safeStart, forbiddenSet, rng) {
    var W = dayBuckets.length;
    var safeItems = [];
    var laterItems = [];
    for (var i = 0; i < items.length; i++) {
      if (safeStart > 0 && forbiddenSet[items[i].id]) {
        laterItems.push(items[i]);
      } else {
        safeItems.push(items[i]);
      }
    }

    safeItems = shuffle(safeItems, rng);
    laterItems = shuffle(laterItems, rng);

    var cursor = safeStart;
    for (var li = 0; li < laterItems.length; li++) {
      var placed = false;
      for (var tries = 0; tries < W - safeStart; tries++) {
        var idx = safeStart + ((cursor - safeStart + tries) % (W - safeStart));
        if (dayBuckets[idx].length < maxPerDay) {
          dayBuckets[idx].push(laterItems[li]);
          cursor = idx + 1;
          placed = true;
          break;
        }
      }
      if (!placed) {
        safeItems.push(laterItems[li]);
      }
    }

    var sCursor = 0;
    for (var si = 0; si < safeItems.length; si++) {
      for (var t = 0; t < W; t++) {
        var dIdx = (sCursor + t) % W;
        if (dayBuckets[dIdx].length < maxPerDay) {
          dayBuckets[dIdx].push(safeItems[si]);
          sCursor = dIdx + 1;
          break;
        }
      }
    }
  }

  function buildCyclePlan(cycle, sortedQuestions, depth) {
    var N = sortedQuestions.length;
    var W = computeCycleDays(N);
    var rng = mulberry32(fnv1a(SEED_PREFIX + cycle));

    var tList = [];
    var pList = [];
    var bList = [];
    for (var i = 0; i < N; i++) {
      var q = sortedQuestions[i];
      var ax = axisOf(q);
      if (ax === 'T') tList.push(q);
      else if (ax === 'P') pList.push(q);
      else bList.push(q);
    }

    tList = shuffle(tList, rng);
    pList = shuffle(pList, rng);
    bList = shuffle(bList, rng);

    var forbiddenSet = {};
    var safeStart = 0;
    if (W >= BOUNDARY_DAYS * 2 && cycle > 0 && depth < 1) {
      var prev = buildCyclePlan(cycle - 1, sortedQuestions, depth + 1);
      safeStart = BOUNDARY_DAYS;
      for (var pd = Math.max(0, prev.days.length - BOUNDARY_DAYS); pd < prev.days.length; pd++) {
        var pDay = prev.days[pd];
        for (var k = 0; k < pDay.time.length; k++) forbiddenSet[pDay.time[k].id] = true;
        for (var m = 0; m < pDay.pop.length; m++) forbiddenSet[pDay.pop[m].id] = true;
      }
    }

    var timeBuckets = [];
    var popBuckets = [];
    for (var d = 0; d < W; d++) {
      timeBuckets.push([]);
      popBuckets.push([]);
    }

    var halfSlots = QUESTIONS_PER_LEG * 2; // 10 zaman + 10 pay = 20/gün
    var maxTimeTotal = W * halfSlots;
    var maxPopTotal = W * halfSlots;

    var tUsed = tList.slice(0, maxTimeTotal);
    var pUsed = pList.slice(0, maxPopTotal);

    // B havuzundan kalan zaman ve pay yuvalarını doldur
    var timeNeed = maxTimeTotal - tUsed.length;
    var popNeed = maxPopTotal - pUsed.length;

    // B'leri önce döngü sınırı açısından ayır ve time/pop arasında kapasiteye göre dengele
    var tLaterCount = 0;
    for (var ti = 0; ti < tUsed.length; ti++) {
      if (safeStart > 0 && forbiddenSet[tUsed[ti].id]) tLaterCount++;
    }
    var pLaterCount = 0;
    for (var pi = 0; pi < pUsed.length; pi++) {
      if (safeStart > 0 && forbiddenSet[pUsed[pi].id]) pLaterCount++;
    }
    var safeTailCap = safeStart > 0 ? (W - safeStart) * halfSlots : maxTimeTotal;
    var maxBLaterForTime = Math.max(0, Math.min(timeNeed, safeTailCap - tLaterCount));
    var maxBLaterForPop = Math.max(0, Math.min(popNeed, safeTailCap - pLaterCount));

    var bForTime = [];
    var bForPop = [];
    var bSafe = [];
    var bLater = [];
    for (var bi = 0; bi < bList.length; bi++) {
      if (safeStart > 0 && forbiddenSet[bList[bi].id]) bLater.push(bList[bi]);
      else bSafe.push(bList[bi]);
    }

    var bLaterTimeUsed = 0;
    var bLaterPopUsed = 0;
    for (var li2 = 0; li2 < bLater.length; li2++) {
      if (bForTime.length < timeNeed && bLaterTimeUsed < maxBLaterForTime) {
        bForTime.push(bLater[li2]);
        bLaterTimeUsed++;
      } else if (bForPop.length < popNeed && bLaterPopUsed < maxBLaterForPop) {
        bForPop.push(bLater[li2]);
        bLaterPopUsed++;
      } else if (bForTime.length < timeNeed) {
        bForTime.push(bLater[li2]);
      } else if (bForPop.length < popNeed) {
        bForPop.push(bLater[li2]);
      }
    }
    for (var si2 = 0; si2 < bSafe.length; si2++) {
      if (bForTime.length < timeNeed) {
        bForTime.push(bSafe[si2]);
      } else if (bForPop.length < popNeed) {
        bForPop.push(bSafe[si2]);
      }
    }

    placeAcrossDays(tUsed.concat(bForTime), timeBuckets, halfSlots, safeStart, forbiddenSet, rng);
    placeAcrossDays(pUsed.concat(bForPop), popBuckets, halfSlots, safeStart, forbiddenSet, rng);

    var days = [];
    for (var di = 0; di < W; di++) {
      days.push({
        time: timeBuckets[di],
        pop: popBuckets[di]
      });
    }

    return { cycle: cycle, cycleDays: W, days: days };
  }

  function getDailySet(dayKey, questions) {
    var qs = sortQuestions(questions);
    var n = qs.length;
    var epochDay = dayKeyToEpochDay(dayKey);
    var dayNumber = Math.max(1, epochDay + 1);

    if (n === 0) {
      return {
        dayKey: dayKey,
        epochDay: epochDay,
        dayNumber: dayNumber,
        cycle: 0,
        cycleDays: 0,
        yaygin: [],
        nadir: [],
        eski: [],
        yeni: []
      };
    }

    // Küçük havuz fallback (<20 soru)
    if (n < QUESTIONS_PER_DAY) {
      var fallbackRng = mulberry32(fnv1a(SEED_PREFIX + dayKey));
      var shuf = shuffle(qs, fallbackRng);
      var pick5 = function (offset) {
        var out = [];
        for (var i = 0; i < QUESTIONS_PER_LEG; i++) {
          out.push(shuf[(offset + i) % shuf.length]);
        }
        return out;
      };
      return {
        dayKey: dayKey,
        epochDay: epochDay,
        dayNumber: dayNumber,
        cycle: 0,
        cycleDays: 1,
        yaygin: pick5(0),
        nadir: pick5(5),
        eski: pick5(10),
        yeni: pick5(15)
      };
    }

    var W = computeCycleDays(n);
    var cycle = Math.floor(epochDay / W);
    var part = ((epochDay % W) + W) % W;
    var plan = buildCyclePlan(cycle, qs, 0);
    var daySlice = plan.days[part];

    var timeMixed = shuffle(daySlice.time, mulberry32(fnv1a(dayKey + '|time')));
    var popMixed = shuffle(daySlice.pop, mulberry32(fnv1a(dayKey + '|pop')));

    return {
      dayKey: dayKey,
      epochDay: epochDay,
      dayNumber: dayNumber,
      cycle: cycle,
      cycleDays: W,
      yaygin: popMixed.slice(0, QUESTIONS_PER_LEG),
      nadir: popMixed.slice(QUESTIONS_PER_LEG, QUESTIONS_PER_LEG * 2),
      eski: timeMixed.slice(0, QUESTIONS_PER_LEG),
      yeni: timeMixed.slice(QUESTIONS_PER_LEG, QUESTIONS_PER_LEG * 2)
    };
  }

  var daily = {
    fnv1a: fnv1a,
    mulberry32: mulberry32,
    shuffle: shuffle,
    axisOf: axisOf,
    computeCycleDays: computeCycleDays,
    dayKeyToEpochDay: dayKeyToEpochDay,
    epochDayToDayKey: epochDayToDayKey,
    getTodayKey: getTodayKey,
    getDailySet: getDailySet
  };

  root.PUSULLA = root.PUSULLA || {};
  root.PUSULLA.daily = daily;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = daily;
  }
})(typeof window !== 'undefined' ? window : globalThis);
