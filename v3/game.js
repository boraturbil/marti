(function (global) {
  'use strict';

  var P = (global.PUSULLA = global.PUSULLA || {});
  var bus = P.events || P.bus;

  function hasQueryFlag(flag) {
    try {
      if (!global.location || !global.location.search) return false;
      var re = new RegExp('(?:^\\?|&)' + flag + '(?:=|&|$)');
      return re.test(global.location.search);
    } catch (e) {
      return false;
    }
  }

  function getConfig(key, fallback) {
    if (P.config && P.config[key] !== undefined) return P.config[key];
    return fallback;
  }

  function getTodayKey() {
    if (P.daily && typeof P.daily.getTodayKey === 'function') {
      return P.daily.getTodayKey();
    }
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function getYesterdayKey(dayKey) {
    var parts = String(dayKey).split('-');
    var dt = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10) - 1));
    var y = dt.getUTCFullYear();
    var m = String(dt.getUTCMonth() + 1).padStart(2, '0');
    var d = String(dt.getUTCDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  }

  // Menü modları: 4 ana yön NORMAL, 4 çapraz uç menüde TEK KARMA girişi
  var DEFAULT_MODES = [
    { id: 'yaygin', label: 'YAYGIN', group: 'normal', dir: 'K ↑', kind: 'pop' },
    { id: 'nadir', label: 'NADİR', group: 'normal', dir: 'G ↓', kind: 'pop' },
    { id: 'eski', label: 'EN ESKİ', group: 'normal', dir: 'B ←', kind: 'time' },
    { id: 'yeni', label: 'EN YENİ', group: 'normal', dir: 'D →', kind: 'time' },
    { id: 'karma', label: 'KARMA', group: 'karma', dir: '✦', kind: 'combo' }
  ];

  // Mock / fallback soru havuzu
  var MOCK_QUESTIONS = [
    {
      id: 'q_ilce',
      subject: 'İSTANBUL İLÇESİ',
      text: 'Bir tane İSTANBUL İLÇESİ söyle.',
      scope: '39 ilçe',
      closed: true,
      poolSize: 39,
      kind: 'pop',
      axis: 'P',
      hasPop: true,
      hasTime: false,
      stubHint: 'Geçerli: "Kadıköy", yazım hatası: "kadioky", NADİR liste dışı tam puan: "Şile", yok: "yok"',
      items: [
        { label: 'Kadıköy', norm: 'kadikoy', share: 18, year: null, era: 'simdi', rankP: 1 },
        { label: 'Beşiktaş', norm: 'besiktas', share: 14, year: null, era: 'simdi', rankP: 2 },
        { label: 'Üsküdar', norm: 'uskudar', share: 11, year: null, era: 'simdi', rankP: 3 },
        { label: 'Şile', norm: 'sile', share: null, year: null, era: 'simdi', rankP: null }
      ],
      typos: { kadioky: 'Kadıköy', besikts: 'Beşiktaş', uskdar: 'Üsküdar' }
    },
    {
      id: 'q_tarayici',
      subject: 'WEB TARAYICI',
      text: 'Bir tane WEB TARAYICI söyle.',
      scope: '1990–2026',
      closed: false,
      poolSize: 48,
      kind: 'time',
      axis: 'B',
      hasPop: true,
      hasTime: true,
      stubHint: 'Geçerli: "WorldWideWeb" (1990) veya "Firefox" (2004), yazım hatası: "firefoks", NADİR liste dışı: "Lynx"',
      items: [
        { label: 'WorldWideWeb', norm: 'worldwideweb', share: 2, year: 1990, era: 'dijital', rankT: 1, rankP: 12 },
        { label: 'Netscape Navigator', norm: 'netscape', share: 6, year: 1994, era: 'dijital', rankT: 2, rankP: 6 },
        { label: 'Firefox', norm: 'firefox', share: 16, year: 2004, era: 'dijital', rankT: 4, rankP: 2 },
        { label: 'Chrome', norm: 'chrome', share: 45, year: 2008, era: 'dijital', rankT: 5, rankP: 1 },
        { label: 'Lynx', norm: 'lynx', share: null, year: 1992, era: 'dijital', rankT: 3, rankP: null }
      ],
      typos: { firefoks: 'Firefox', netscap: 'Netscape Navigator', krom: 'Chrome' }
    },
    {
      id: 'q_corba',
      subject: 'ÇORBA',
      text: 'Bir tane ÇORBA söyle.',
      scope: 'Türk ve dünya mutfağı',
      closed: false,
      poolSize: 120,
      kind: 'pop',
      axis: 'P',
      hasPop: true,
      hasTime: false,
      stubHint: 'Geçerli: "Mercimek", yazım hatası: "mercimke", NADİR liste dışı: "Tarhun"',
      items: [
        { label: 'Mercimek Çorbası', norm: 'mercimek', share: 32, year: null, era: 'simdi', rankP: 1 },
        { label: 'Tarhana Çorbası', norm: 'tarhana', share: 19, year: null, era: 'simdi', rankP: 2 },
        { label: 'Ezogelin Çorbası', norm: 'ezogelin', share: 15, year: null, era: 'simdi', rankP: 3 },
        { label: 'Tarhun Çorbası', norm: 'tarhun', share: null, year: null, era: 'simdi', rankP: null }
      ],
      typos: { mercimke: 'Mercimek Çorbası', tarhna: 'Tarhana Çorbası' }
    },
    {
      id: 'q_gezegen',
      subject: 'GEZEGEN',
      text: 'Güneş sisteminden bir GEZEGEN söyle.',
      scope: '8 gezegen',
      closed: true,
      poolSize: 8,
      kind: 'combo',
      axis: 'B',
      hasPop: true,
      hasTime: true,
      stubHint: 'Geçerli: "Jüpiter", yazım hatası: "jupter", NADİR liste dışı: "Neptün"',
      items: [
        { label: 'Mars', norm: 'mars', share: 28, year: -2000, era: 'antik', rankT: 1, rankP: 1 },
        { label: 'Jüpiter', norm: 'jupiter', share: 24, year: 1610, era: 'erken_modern', rankT: 6, rankP: 2 },
        { label: 'Satürn', norm: 'saturn', share: 18, year: 1610, era: 'erken_modern', rankT: 6, rankP: 3 },
        { label: 'Neptün', norm: 'neptun', share: null, year: 1846, era: 'sanayi', rankT: 8, rankP: null }
      ],
      typos: { jupter: 'Jüpiter', marsa: 'Mars' }
    },
    {
      id: 'q_icat',
      subject: 'İCAT',
      text: 'Bir tane İCAT söyle.',
      scope: 'Tarih boyunca',
      closed: false,
      poolSize: 210,
      kind: 'time',
      axis: 'B',
      hasPop: true,
      hasTime: true,
      stubHint: 'Geçerli: "Matbaa" (1450) veya "Telefon" (1876), NADİR liste dışı: "Astrolab"',
      items: [
        { label: 'Astrolab', norm: 'astrolab', share: null, year: 200, era: 'antik', rankT: 1, rankP: null },
        { label: 'Matbaa', norm: 'matbaa', share: 22, year: 1450, era: 'erken_modern', rankT: 2, rankP: 2 },
        { label: 'Telefon', norm: 'telefon', share: 25, year: 1876, era: 'sanayi', rankT: 5, rankP: 1 },
        { label: 'İnternet', norm: 'internet', share: 20, year: 1969, era: 'elektronik', rankT: 6, rankP: 3 }
      ],
      typos: { matba: 'Matbaa', telfon: 'Telefon' }
    }
  ];

  var memReports = [];
  var poolIndexCache = Object.create(null);
  var loadingPools = Object.create(null);

  var state = {
    phase: 'menu',
    modeId: null,
    activeSubModeId: null,
    daily: false,
    dailyLegs: getConfig('DAILY_LEGS', ['yaygin', 'nadir', 'eski', 'yeni']),
    dailyLegIndex: 0,
    dailyScore: 0,
    index: 0,
    total: 5,
    score: 0,
    rows: [],
    roundQuestions: [],
    question: null,
    lastResult: null,
    pendingConfirm: null,
    lastRawInput: '',
    lastReportKind: 'none',
    hasNoneThisQuestion: false,
    eraId: 'simdi',
    locked: false
  };

  var timerHandle = null;
  var timerLeft = 30;
  var lastWarnSecond = -1;

  function normText(s) {
    return String(s || '')
      .trim()
      .toLocaleLowerCase('tr-TR')
      .replace(/['’].*$/, '')
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/â/g, 'a')
      .replace(/î/g, 'i')
      .replace(/û/g, 'u')
      .replace(/[^a-z0-9]/g, '');
  }

  function eraOfYear(year) {
    if (year === null || year === undefined || isNaN(year)) return 'simdi';
    if (P.engine && typeof P.engine.eraOf === 'function') {
      try {
        var res = P.engine.eraOf(year);
        if (res) return typeof res === 'string' ? res : (res.id || 'simdi');
      } catch (e) { /* fallback */ }
    }
    var eras = getConfig('ERAS', []);
    for (var i = 0; i < eras.length; i++) {
      var er = eras[i];
      if (er.min !== null && er.max !== null && year >= er.min && year <= er.max) {
        return er.id;
      }
    }
    return 'simdi';
  }

  function safeSetScene(eraId, opts) {
    try {
      if (P.scene && typeof P.scene.setScene === 'function') {
        P.scene.setScene(eraId, opts || {});
      }
    } catch (e) {
      // scene yoksa veya hata atarsa sessizce gec
    }
  }

  function safeSetModeScene(modeId) {
    try {
      if (P.scene && typeof P.scene.setMode === 'function') {
        P.scene.setMode(modeId);
      }
    } catch (e) {
      // sessizce gec
    }
  }

  function setBodyAttrs() {
    if (!global.document || !global.document.body) return;
    var b = global.document.body;
    b.setAttribute('data-phase', state.phase || 'menu');
    b.setAttribute('data-mode', state.modeId || '');
    b.setAttribute('data-era', state.eraId || 'simdi');
  }

  // --- Dinamik Veri & Havuz Yukleyici ---
  function getLoadedQuestions() {
    if (hasQueryFlag('mock')) return MOCK_QUESTIONS.slice();
    if (P.data && Array.isArray(P.data.questions) && P.data.questions.length) {
      return P.data.questions;
    }
    if (Array.isArray(P.data) && P.data.length) {
      return P.data;
    }
    if (Array.isArray(global.PUSULLA_QUESTIONS) && global.PUSULLA_QUESTIONS.length) {
      return global.PUSULLA_QUESTIONS;
    }
    return MOCK_QUESTIONS.slice();
  }

  function getRawPool(poolId) {
    if (!poolId) return null;
    if (P.data && P.data.pools && P.data.pools[poolId]) {
      return P.data.pools[poolId];
    }
    if (global.PUSULLA_POOLS && global.PUSULLA_POOLS[poolId]) {
      return global.PUSULLA_POOLS[poolId];
    }
    return null;
  }

  function loadPoolScript(poolId, cb) {
    if (!poolId || getRawPool(poolId)) {
      if (cb) cb(true);
      return;
    }
    if (!global.document || !global.document.createElement || !global.document.head) {
      if (cb) cb(false);
      return;
    }
    if (loadingPools[poolId]) {
      loadingPools[poolId].push(cb);
      return;
    }
    loadingPools[poolId] = cb ? [cb] : [];
    var script = global.document.createElement('script');
    script.src = 'data/pool/' + encodeURIComponent(poolId) + '.js';
    script.async = true;
    var done = function (ok) {
      var cbs = loadingPools[poolId] || [];
      delete loadingPools[poolId];
      for (var i = 0; i < cbs.length; i++) {
        if (typeof cbs[i] === 'function') cbs[i](ok);
      }
    };
    script.onload = function () { done(true); };
    script.onerror = function () {
      if (global.console && typeof global.console.warn === 'function') {
        global.console.warn('[PUSULLA] Havuz yuklenemedi:', poolId);
      }
      done(false);
    };
    global.document.head.appendChild(script);
  }

  function preloadNextQuestionPool() {
    var nextIdx = state.index + 1;
    if (nextIdx < state.roundQuestions.length) {
      var nq = state.roundQuestions[nextIdx];
      if (nq && typeof nq.pool === 'string') {
        loadPoolScript(nq.pool);
      }
    }
  }

  // Havuz satirlarini standart nesnelere cevir
  function normalizePoolItems(q) {
    if (Array.isArray(q.items)) return q.items;
    var poolObj = typeof q.pool === 'string' ? getRawPool(q.pool) : q.pool;
    if (!poolObj) return [];
    var rows = Array.isArray(poolObj) ? poolObj : (poolObj.rows || []);
    var cols = poolObj.cols || ['label', 'aliases', 'year', 'src', 'sl', 'f'];
    var shareMap = {};
    if (q.share && Array.isArray(q.share.list)) {
      for (var si = 0; si < q.share.list.length; si++) {
        var pair = q.share.list[si];
        shareMap[normText(pair[0])] = { share: pair[1], rankP: si + 1 };
      }
    }
    var out = [];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (Array.isArray(r)) {
        var obj = {};
        for (var c = 0; c < cols.length; c++) {
          obj[cols[c]] = r[c];
        }
        var nLabel = normText(obj.label);
        var sh = shareMap[nLabel];
        out.push({
          label: obj.label,
          aliases: obj.aliases || [],
          norm: nLabel,
          year: obj.year !== undefined ? obj.year : null,
          src: obj.src || null,
          sl: obj.sl || 0,
          f: obj.f || 0,
          approx: Boolean((obj.f || 0) & 1),
          share: sh ? sh.share : null,
          rankP: sh ? sh.rankP : null,
          era: eraOfYear(obj.year)
        });
      } else if (r && typeof r === 'object') {
        var nL = r.norm || normText(r.label);
        var sh2 = shareMap[nL];
        out.push({
          label: r.label,
          aliases: r.aliases || [],
          norm: nL,
          year: r.year !== undefined ? r.year : null,
          src: r.src || null,
          sl: r.sl || 0,
          f: r.f || 0,
          approx: Boolean(r.approx || ((r.f || 0) & 1)),
          share: r.share !== undefined ? r.share : (sh2 ? sh2.share : null),
          rankP: r.rankP !== undefined ? r.rankP : (sh2 ? sh2.rankP : null),
          era: r.era || eraOfYear(r.year)
        });
      }
    }
    return out;
  }

  // --- Store & Durum Yardimcilari ---
  function readStore() {
    if (P.store && typeof P.store.read === 'function') {
      return P.store.read();
    }
    return {
      version: 3,
      days: {},
      stats: {
        playedDays: 0,
        streak: 0,
        bestStreak: 0,
        lastCompletedDay: null,
        bestDayScore: 0,
        bestByMode: {},
        modeTotals: {},
        modeCounts: {},
        tierCounts: { tam: 0, cokyakin: 0, yakin: 0, uzak: 0, zayif: 0 }
      },
      recentFreeIds: [],
      pending: null
    };
  }

  function writeStore(data) {
    if (P.store && typeof P.store.write === 'function') {
      P.store.write(data);
    }
  }

  function getDailyProgressForToday(storeData) {
    var todayKey = getTodayKey();
    var dayRec = (storeData.days && storeData.days[todayKey]) || {};
    var legs = dayRec.legs || {};
    var progress = {};
    for (var i = 0; i < state.dailyLegs.length; i++) {
      var legId = state.dailyLegs[i];
      var leg = legs[legId];
      progress[legId] = leg ? (leg.completed ? 5 : (leg.rows ? leg.rows.length : 0)) : 0;
    }
    return progress;
  }

  function getStoreSummary() {
    var s = readStore();
    var st = s.stats || {};
    var best = st.bestDayScore || 0;
    if (st.bestByMode) {
      var keys = Object.keys(st.bestByMode);
      for (var i = 0; i < keys.length; i++) {
        if (st.bestByMode[keys[i]] > best) best = st.bestByMode[keys[i]];
      }
    }
    return {
      playedDays: st.playedDays || 0,
      streak: st.streak || 0,
      bestStreak: st.bestStreak || 0,
      bestDayScore: st.bestDayScore || 0,
      best: best,
      bestByMode: st.bestByMode || {},
      modeTotals: st.modeTotals || {},
      modeCounts: st.modeCounts || {},
      tierCounts: st.tierCounts || { tam: 0, cokyakin: 0, yakin: 0, uzak: 0, zayif: 0 },
      dailyProgress: getDailyProgressForToday(s),
      reportsCount: getReportsCount(),
      hasPending: Boolean(s.pending)
    };
  }

  function savePending() {
    var s = readStore();
    var ids = [];
    for (var i = 0; i < state.roundQuestions.length; i++) {
      ids.push(state.roundQuestions[i].id);
    }
    s.pending = {
      dayKey: getTodayKey(),
      modeId: state.modeId,
      activeSubModeId: state.activeSubModeId,
      daily: state.daily,
      dailyLegIndex: state.dailyLegIndex,
      dailyScore: state.dailyScore,
      index: state.index,
      total: state.total,
      score: state.score,
      rows: state.rows.slice(),
      questionIds: ids,
      phase: state.phase,
      lastResult: state.lastResult
    };
    writeStore(s);
  }

  function clearPending() {
    var s = readStore();
    if (s.pending) {
      s.pending = null;
      writeStore(s);
    }
  }

  function getReportsCount() {
    var key = getConfig('REPORTS_STORAGE_KEY', 'pusulla.v3.reports');
    try {
      if (global.localStorage) {
        var raw = global.localStorage.getItem(key);
        if (raw) {
          var arr = JSON.parse(raw);
          if (Array.isArray(arr)) return arr.length;
        }
      }
    } catch (e) { /* fallback */ }
    if (P.store && typeof P.store.readReports === 'function') {
      return P.store.readReports().length;
    }
    return memReports.length;
  }

  function saveReportEntry(entry) {
    var key = getConfig('REPORTS_STORAGE_KEY', 'pusulla.v3.reports');
    var list = [];
    try {
      if (global.localStorage) {
        var raw = global.localStorage.getItem(key);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) list = parsed;
        }
        list.push(entry);
        if (list.length > 300) list = list.slice(list.length - 300);
        global.localStorage.setItem(key, JSON.stringify(list));
        return list.length;
      }
    } catch (e) {
      // localStorage erisilemezse bellek ici / store fallback
    }
    memReports.push(entry);
    if (memReports.length > 300) memReports.shift();
    if (P.store && typeof P.store.addReport === 'function') {
      return P.store.addReport(entry);
    }
    return memReports.length;
  }

  // --- Zamanlayici ---
  function stopTimer() {
    if (timerHandle) {
      global.clearInterval(timerHandle);
      timerHandle = null;
    }
  }

  function startTimer() {
    stopTimer();
    var roundSec = getConfig('ROUND_SECONDS', 30);
    var warnSec = getConfig('WARN', 5);
    timerLeft = roundSec;
    lastWarnSecond = -1;

    bus.emit('timer:tick', { left: timerLeft, total: roundSec });

    timerHandle = global.setInterval(function () {
      if (state.phase !== 'question') {
        stopTimer();
        return;
      }
      timerLeft = Math.max(0, +(timerLeft - 0.25).toFixed(2));
      bus.emit('timer:tick', { left: timerLeft, total: roundSec });

      var ceilSec = Math.ceil(timerLeft);
      if (ceilSec <= warnSec && ceilSec > 0 && ceilSec !== lastWarnSecond) {
        lastWarnSecond = ceilSec;
        bus.emit('timer:warn', { left: ceilSec });
      }

      if (timerLeft <= 0) {
        stopTimer();
        handleTimeout();
      }
    }, 250);
  }

  // --- Soru Secimi ---
  function getAxesOf(q) {
    if (P.engine && typeof P.engine.axesOf === 'function') {
      try {
        return P.engine.axesOf(q);
      } catch (e) { /* fallback */ }
    }
    if (P.daily && typeof P.daily.axisOf === 'function') {
      return P.daily.axisOf(q);
    }
    return q.axis || 'B';
  }

  function isEligibleForMode(q, modeId) {
    var ax = getAxesOf(q);
    if (modeId === 'yaygin' || modeId === 'nadir') return ax === 'P' || ax === 'B';
    if (modeId === 'eski' || modeId === 'yeni') return ax === 'T' || ax === 'B';
    if (modeId === 'karma' || modeId === 'klasik' || modeId === 'gundem' || modeId === 'antika' || modeId === 'kesif') {
      return ax === 'B';
    }
    return true;
  }

  function selectFreeQuestions(modeId, count) {
    var all = getLoadedQuestions();
    var todayKey = getTodayKey();
    var s = readStore();
    var recent = s.recentFreeIds || [];
    var dailyExcluded = {};

    if (P.daily && typeof P.daily.getDailySet === 'function' && all.length >= 20) {
      var dSet = P.daily.getDailySet(todayKey, all);
      var legs = ['yaygin', 'nadir', 'eski', 'yeni'];
      for (var li = 0; li < legs.length; li++) {
        var arr = dSet[legs[li]] || [];
        for (var ai = 0; ai < arr.length; ai++) {
          dailyExcluded[arr[ai].id] = true;
        }
      }
    }

    var recentSet = {};
    for (var ri = 0; ri < recent.length; ri++) {
      recentSet[recent[ri]] = true;
    }

    var eligible = [];
    for (var i = 0; i < all.length; i++) {
      if (isEligibleForMode(all[i], modeId)) eligible.push(all[i]);
    }
    if (eligible.length < count) eligible = all.slice();

    var fresh = [];
    var fallback = [];
    for (var j = 0; j < eligible.length; j++) {
      var q = eligible[j];
      if (!dailyExcluded[q.id] && !recentSet[q.id]) {
        fresh.push(q);
      } else {
        fallback.push(q);
      }
    }

    var picked = [];
    var pool = fresh.concat(fallback);
    for (var k = 0; k < count && pool.length > 0; k++) {
      picked.push(pool[k % pool.length]);
    }
    return picked;
  }

  function selectDailyQuestions(legModeId) {
    var all = getLoadedQuestions();
    var todayKey = getTodayKey();
    if (P.daily && typeof P.daily.getDailySet === 'function') {
      var dSet = P.daily.getDailySet(todayKey, all);
      if (dSet && Array.isArray(dSet[legModeId]) && dSet[legModeId].length) {
        return dSet[legModeId];
      }
    }
    return selectFreeQuestions(legModeId, getConfig('QUESTIONS_PER_ROUND', 5));
  }

  // --- Eslestirme & Puanlama (engine.js / matcher.js ile veya fallback) ---
  function matchAnswer(q, raw) {
    var items = normalizePoolItems(q);

    // Worker B matcher.js entegrasyonu
    if (P.matcher && typeof P.matcher.match === 'function') {
      try {
        var idxKey = q.id + '|' + (typeof q.pool === 'string' ? q.pool : 'inline');
        var idx = poolIndexCache[idxKey];
        if (!idx && typeof P.matcher.buildIndex === 'function') {
          idx = P.matcher.buildIndex(items, q);
          poolIndexCache[idxKey] = idx;
        }
        var mRes = P.matcher.match(idx || items, raw, q);
        if (mRes) return mRes;
      } catch (e) {
        // fallback matcher'a dus
      }
    }

    // Yerlesik fallback matcher
    var n = normText(raw);
    if (!n) return { type: 'invalid', reason: 'En az 2 karakter yaz.' };

    // Gecersiz anahtarlar
    if (Array.isArray(q.invalid)) {
      for (var ii = 0; ii < q.invalid.length; ii++) {
        var grp = q.invalid[ii];
        var aliases = grp.aliases || [];
        for (var ai = 0; ai < aliases.length; ai++) {
          if (normText(aliases[ai]) === n) {
            return { type: 'invalid', reason: grp.reason || 'Geçersiz cevap.' };
          }
        }
      }
    }

    // Tam eslesme (label + aliases)
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.norm === n) return { type: 'valid', row: it, fuzzy: false };
      if (Array.isArray(it.aliases)) {
        for (var j = 0; j < it.aliases.length; j++) {
          if (normText(it.aliases[j]) === n) {
            return { type: 'valid', row: it, fuzzy: false };
          }
        }
      }
    }

    // Yazim hatasi -> onay iste (otomatik kabul YOK)
    if (q.typos && q.typos[n]) {
      return { type: 'confirm', suggestion: q.typos[n], label: q.typos[n] };
    }

    return { type: 'none', newerThanAsOf: false };
  }

  function scoreAnswer(modeId, item, q) {
    var items = normalizePoolItems(q);

    // Worker B engine.js entegrasyonu
    if (P.engine && typeof P.engine.score === 'function') {
      try {
        var eRes = P.engine.score(modeId, item, items, q);
        if (eRes && typeof eRes.points === 'number') {
          return eRes;
        }
      } catch (e) {
        // fallback scorer'a dus
      }
    }

    // Yerlesik fallback puanlama (§2.7 + Karar 9)
    var points = 50;
    var tierId = 'yakin';

    if (modeId === 'nadir') {
      if (item.share === null || item.share === undefined) {
        points = 100;
      } else if (item.share <= 0.5) {
        points = 100;
      } else if (item.share <= 1.5) {
        points = 70;
      } else if (item.share <= 4) {
        points = 50;
      } else if (item.share <= 10) {
        points = 30;
      } else {
        points = 10;
      }
    } else if (modeId === 'yaygin') {
      var rp = item.rankP || 1;
      var nPop = Math.max(2, items.length);
      var dPop = (rp - 1) / (nPop - 1);
      if (item.share === null || item.share === undefined) points = 10;
      else if (rp === 1) points = 100;
      else if (dPop <= 0.10) points = 70;
      else if (dPop <= 0.25) points = 50;
      else if (dPop <= 0.50) points = 30;
      else points = 10;
    } else if (modeId === 'eski' || modeId === 'yeni') {
      if (item.year === null || item.year === undefined) {
        points = 10;
      } else {
        var years = [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].year !== null && items[i].year !== undefined) years.push(items[i].year);
        }
        var minY = years.length ? Math.min.apply(null, years) : item.year;
        var maxY = years.length ? Math.max.apply(null, years) : item.year;
        var targetY = modeId === 'eski' ? minY : maxY;
        var span = Math.max(1, maxY - minY);
        var dy = Math.abs(item.year - targetY) / span;
        if (item.year === targetY) points = 100;
        else if (dy <= 0.03) points = 70;
        else if (dy <= 0.10) points = 50;
        else if (dy <= 0.30) points = 30;
        else points = 10;
      }
    } else {
      // Karma alt modlari (klasik, gundem, antika, kesif)
      points = item.share ? Math.min(100, Math.max(30, Math.round(item.share * 3))) : 70;
    }

    if (points >= 100) tierId = 'tam';
    else if (points >= 70) tierId = 'cokyakin';
    else if (points >= 50) tierId = 'yakin';
    else if (points >= 30) tierId = 'uzak';
    else tierId = 'zayif';

    return { points: points, tierId: tierId };
  }

  function buildShareText(dayNumber, totalScore, legsObj) {
    var tierEmoji = {
      tam: '🟨',
      cokyakin: '🟩',
      yakin: '🟦',
      uzak: '🟧',
      zayif: '🟥',
      pas: '⬜',
      sure: '⬜'
    };
    var modesCfg = getConfig('MODES', {});
    var lines = ['PUSULLA #' + dayNumber + ' · ' + totalScore + '/' + getConfig('DAY_MAX', 2000)];
    for (var i = 0; i < state.dailyLegs.length; i++) {
      var legId = state.dailyLegs[i];
      var arrow = (modesCfg[legId] && modesCfg[legId].arrow) || '•';
      var legData = legsObj[legId] || { rows: [] };
      var squares = '';
      for (var j = 0; j < 5; j++) {
        var r = legData.rows && legData.rows[j];
        squares += (r && tierEmoji[r.tierId]) ? tierEmoji[r.tierId] : '⬜';
      }
      lines.push(arrow + squares);
    }
    return lines.join('\n');
  }

  // --- Ekran Gecisleri ---
  function showMenu() {
    stopTimer();
    state.phase = 'menu';
    state.modeId = null;
    state.activeSubModeId = null;
    state.daily = false;
    state.question = null;
    state.pendingConfirm = null;
    state.eraId = 'simdi';
    state.locked = false;
    setBodyAttrs();

    safeSetScene('simdi', { year: null, modeId: null });

    var summary = getStoreSummary();
    bus.emit('menu:show', {
      dailyProgress: summary.dailyProgress,
      best: summary.best,
      streak: summary.streak
    });
  }

  function showQuestion() {
    var total = state.total || getConfig('QUESTIONS_PER_ROUND', 5);
    var q = state.roundQuestions[state.index] || MOCK_QUESTIONS[state.index % MOCK_QUESTIONS.length];
    state.phase = 'question';
    state.question = q;
    state.pendingConfirm = null;
    state.lastRawInput = '';
    state.hasNoneThisQuestion = false;
    state.locked = false;

    // Karma modda her soru icin bir alt-mod belirle
    if (state.modeId === 'karma') {
      var karmaSubs = getConfig('KARMA_MODES', ['klasik', 'gundem', 'antika', 'kesif']);
      state.activeSubModeId = karmaSubs[state.index % karmaSubs.length];
    } else {
      state.activeSubModeId = state.modeId;
    }

    setBodyAttrs();

    var items = normalizePoolItems(q);
    var pSize = q.poolSize || items.length || 0;

    bus.emit('question:show', {
      index: state.index,
      total: total,
      modeId: state.modeId,
      subModeId: state.activeSubModeId,
      subject: q.subject,
      text: q.text,
      scope: q.scope || '',
      closed: Boolean(q.closed),
      poolSize: pSize,
      stubHint: q.stubHint || ''
    });

    if (typeof q.pool === 'string') {
      loadPoolScript(q.pool);
    }
    preloadNextQuestionPool();
    savePending();
    startTimer();
  }

  function startMode(modeId, isDaily) {
    if (state.locked) return;
    state.locked = true;
    state.modeId = modeId;
    state.daily = !!isDaily;
    state.index = 0;
    state.total = getConfig('QUESTIONS_PER_ROUND', 5);
    state.score = 0;
    state.rows = [];
    state.lastResult = null;
    state.roundQuestions = isDaily
      ? selectDailyQuestions(modeId)
      : selectFreeQuestions(modeId, state.total);
    setBodyAttrs();

    safeSetModeScene(modeId);

    bus.emit('mode:start', {
      modeId: modeId,
      daily: !!isDaily,
      total: state.total
    });

    showQuestion();
  }

  function buildResultPayload(item, points, tierId, q, effectiveModeId) {
    var items = normalizePoolItems(q);
    var dots = [];
    var limit = Math.min(items.length, 60);
    var playerIncluded = false;
    for (var i = 0; i < limit; i++) {
      var it = items[i];
      var isP = item ? (it.norm === item.norm) : false;
      if (isP) playerIncluded = true;
      dots.push({
        label: it.label,
        year: it.year !== undefined ? it.year : null,
        approx: Boolean(it.approx),
        share: it.share !== undefined ? it.share : null,
        info: it.label,
        src: it.src || 'havuz',
        isPlayer: isP,
        isBest: i === 0
      });
    }
    if (item && !playerIncluded) {
      dots.push({
        label: item.label,
        year: item.year !== undefined ? item.year : null,
        approx: Boolean(item.approx),
        share: item.share !== undefined ? item.share : null,
        info: item.label,
        src: item.src || 'havuz',
        isPlayer: true,
        isBest: false
      });
    }

    var kind = (effectiveModeId === 'eski' || effectiveModeId === 'yeni')
      ? 'time'
      : ((effectiveModeId === 'yaygin' || effectiveModeId === 'nadir') ? 'pop' : 'combo');

    return {
      kind: kind,
      modeId: state.modeId,
      subModeId: effectiveModeId,
      tierId: tierId,
      points: points,
      player: item ? {
        label: item.label,
        year: item.year !== undefined ? item.year : null,
        share: item.share !== undefined ? item.share : null,
        rankT: item.rankT || null,
        rankP: item.rankP || null
      } : { label: '—', year: null, share: null, rankT: null, rankP: null },
      best: items.length ? [items[0]] : [],
      dots: dots,
      poolSize: q.poolSize || items.length || 0
    };
  }

  function finalizeAnswer(item, raw, fuzzy) {
    stopTimer();
    var q = state.question;
    var effectiveModeId = state.activeSubModeId || state.modeId || 'yaygin';
    var scored = scoreAnswer(effectiveModeId, item, q);
    var points = scored.points;
    var tierId = scored.tierId;

    state.score += points;
    if (state.daily) {
      state.dailyScore += points;
    }

    state.rows.push({
      qId: q.id,
      subject: q.subject,
      answer: item.label,
      points: points,
      tierId: tierId
    });

    state.lastReportKind = fuzzy ? 'fuzzy' : 'wrong';

    bus.emit('answer:valid', {
      label: item.label,
      raw: raw,
      fuzzy: !!fuzzy,
      tierId: tierId,
      points: points,
      year: item.year !== undefined ? item.year : null,
      share: item.share !== undefined ? item.share : null
    });

    var eraId = item.era || eraOfYear(item.year);
    state.eraId = eraId;
    bus.emit('era:change', { eraId: eraId, year: item.year !== undefined ? item.year : null });
    safeSetScene(eraId, { year: item.year !== undefined ? item.year : null, modeId: state.modeId });

    var resultPayload = buildResultPayload(item, points, tierId, q, effectiveModeId);
    state.phase = 'result';
    state.lastResult = resultPayload;
    state.locked = false;
    setBodyAttrs();
    savePending();
    bus.emit('result:show', resultPayload);
  }

  function recordZeroResult(labelText, tierId) {
    var q = state.question;
    var effectiveModeId = state.activeSubModeId || state.modeId || 'yaygin';
    state.rows.push({
      qId: q.id,
      subject: q.subject,
      answer: labelText,
      points: 0,
      tierId: tierId
    });

    var resultPayload = buildResultPayload(null, 0, 'zayif', q, effectiveModeId);
    state.phase = 'result';
    state.lastResult = resultPayload;
    state.locked = false;
    setBodyAttrs();
    savePending();
    bus.emit('result:show', resultPayload);
  }

  function handleTimeout() {
    if (state.phase !== 'question') return;
    state.locked = true;
    bus.emit('answer:timeout', {});
    recordZeroResult('(süre doldu)', 'sure');
  }

  function finishRound() {
    stopTimer();
    clearPending();
    state.phase = 'summary';
    setBodyAttrs();

    var s = readStore();
    var todayKey = getTodayKey();
    var shareTextOut = '';

    if (state.daily) {
      s.days = s.days || {};
      var dayRec = (s.days[todayKey] = s.days[todayKey] || { legs: {}, completed: false, totalScore: 0 });
      dayRec.legs[state.modeId] = {
        completed: true,
        score: state.score,
        rows: state.rows.slice()
      };

      var allDone = true;
      var totalDayScore = 0;
      for (var i = 0; i < state.dailyLegs.length; i++) {
        var leg = dayRec.legs[state.dailyLegs[i]];
        if (!leg || !leg.completed) {
          allDone = false;
        } else {
          totalDayScore += leg.score || 0;
        }
      }
      dayRec.totalScore = totalDayScore;
      state.dailyScore = totalDayScore;

      if (allDone && !dayRec.completed) {
        dayRec.completed = true;
        s.stats.playedDays = (s.stats.playedDays || 0) + 1;
        var yKey = getYesterdayKey(todayKey);
        if (s.stats.lastCompletedDay === yKey) {
          s.stats.streak = (s.stats.streak || 0) + 1;
        } else if (s.stats.lastCompletedDay !== todayKey) {
          s.stats.streak = 1;
        }
        if (s.stats.streak > (s.stats.bestStreak || 0)) {
          s.stats.bestStreak = s.stats.streak;
        }
        s.stats.lastCompletedDay = todayKey;
        if (totalDayScore > (s.stats.bestDayScore || 0)) {
          s.stats.bestDayScore = totalDayScore;
        }
      }

      var dayNum = (P.daily && typeof P.daily.dayKeyToEpochDay === 'function')
        ? Math.max(1, P.daily.dayKeyToEpochDay(todayKey) + 1)
        : 1;
      shareTextOut = buildShareText(dayNum, totalDayScore, dayRec.legs);
      dayRec.shareText = shareTextOut;
    } else {
      // Serbest oyunda son 40 soruyu kaydet
      s.recentFreeIds = s.recentFreeIds || [];
      for (var ri = 0; ri < state.roundQuestions.length; ri++) {
        s.recentFreeIds.push(state.roundQuestions[ri].id);
      }
      if (s.recentFreeIds.length > 40) {
        s.recentFreeIds = s.recentFreeIds.slice(s.recentFreeIds.length - 40);
      }
    }

    // Genel mod & katman istatistikleri
    s.stats.bestByMode = s.stats.bestByMode || {};
    if (state.score > (s.stats.bestByMode[state.modeId] || 0)) {
      s.stats.bestByMode[state.modeId] = state.score;
    }
    s.stats.modeTotals = s.stats.modeTotals || {};
    s.stats.modeCounts = s.stats.modeCounts || {};
    s.stats.modeTotals[state.modeId] = (s.stats.modeTotals[state.modeId] || 0) + state.score;
    s.stats.modeCounts[state.modeId] = (s.stats.modeCounts[state.modeId] || 0) + 1;
    s.stats.tierCounts = s.stats.tierCounts || { tam: 0, cokyakin: 0, yakin: 0, uzak: 0, zayif: 0 };
    for (var ti = 0; ti < state.rows.length; ti++) {
      var tId = state.rows[ti].tierId;
      if (s.stats.tierCounts[tId] !== undefined) {
        s.stats.tierCounts[tId] += 1;
      }
    }

    writeStore(s);

    bus.emit('round:end', {
      modeId: state.modeId,
      score: state.score,
      max: getConfig('ROUND_MAX', 500),
      rows: state.rows.slice()
    });

    if (state.daily) {
      var nextLegIdx = -1;
      var legsMap = (s.days[todayKey] && s.days[todayKey].legs) || {};
      for (var li = 0; li < state.dailyLegs.length; li++) {
        if (!legsMap[state.dailyLegs[li]] || !legsMap[state.dailyLegs[li]].completed) {
          nextLegIdx = li;
          break;
        }
      }
      if (nextLegIdx !== -1) {
        state.dailyLegIndex = nextLegIdx;
        state.locked = false;
        startMode(state.dailyLegs[nextLegIdx], true);
      } else {
        bus.emit('day:complete', {
          score: state.dailyScore,
          max: getConfig('DAY_MAX', 2000),
          streak: s.stats.streak || 1,
          shareText: shareTextOut
        });
      }
    }
  }

  function resumeFromPending(pending) {
    if (!pending || !pending.modeId || !Array.isArray(pending.questionIds) || !pending.questionIds.length) {
      return false;
    }
    if (pending.daily && pending.dayKey !== getTodayKey()) {
      clearPending();
      return false;
    }
    var all = getLoadedQuestions();
    var qMap = {};
    for (var i = 0; i < all.length; i++) qMap[all[i].id] = all[i];
    var rQs = [];
    for (var j = 0; j < pending.questionIds.length; j++) {
      if (qMap[pending.questionIds[j]]) rQs.push(qMap[pending.questionIds[j]]);
    }
    if (!rQs.length) return false;

    state.modeId = pending.modeId;
    state.activeSubModeId = pending.activeSubModeId || pending.modeId;
    state.daily = Boolean(pending.daily);
    state.dailyLegIndex = pending.dailyLegIndex || 0;
    state.dailyScore = pending.dailyScore || 0;
    state.index = pending.index || 0;
    state.total = pending.total || rQs.length;
    state.score = pending.score || 0;
    state.rows = Array.isArray(pending.rows) ? pending.rows : [];
    state.roundQuestions = rQs;

    safeSetModeScene(state.modeId);
    bus.emit('mode:start', { modeId: state.modeId, daily: state.daily, total: state.total });

    if (pending.phase === 'result' && pending.lastResult) {
      state.question = rQs[state.index] || rQs[0];
      state.phase = 'result';
      state.lastResult = pending.lastResult;
      state.locked = false;
      setBodyAttrs();
      bus.emit('result:show', pending.lastResult);
    } else {
      showQuestion();
    }
    return true;
  }

  // Tüm §2.9 olaylarını tek seferde yayan ?mock turu
  function runMockTour() {
    var modes = getConfig('MODES', DEFAULT_MODES);
    var keymap = getConfig('KEYMAP', {});
    var asOf = getConfig('ASOF', '2026-11-22');

    bus.emit('app:ready', { asOf: asOf, modes: modes, keymap: keymap });
    bus.emit('menu:show', {
      dailyProgress: { yaygin: 0, nadir: 0, eski: 0, yeni: 0 },
      best: 420,
      streak: 1
    });
    bus.emit('menu:focus', { modeId: 'yaygin' });
    bus.emit('mode:start', { modeId: 'nadir', daily: false, total: 5 });
    bus.emit('question:show', {
      index: 0,
      total: 5,
      modeId: 'nadir',
      subject: MOCK_QUESTIONS[0].subject,
      text: MOCK_QUESTIONS[0].text,
      scope: MOCK_QUESTIONS[0].scope,
      closed: MOCK_QUESTIONS[0].closed,
      poolSize: MOCK_QUESTIONS[0].poolSize
    });
    bus.emit('timer:tick', { left: 29.75, total: 30 });
    bus.emit('timer:warn', { left: 5 });
    bus.emit('answer:invalid', { raw: 'a', reason: 'En az 2 karakter yaz.' });
    bus.emit('answer:none', { raw: 'yok', newerThanAsOf: false, canReport: true });
    bus.emit('report:saved', { count: 1 });
    bus.emit('answer:confirm', { raw: 'kadioky', suggestion: 'Kadıköy', label: 'Kadıköy' });
    bus.emit('answer:valid', { label: 'Şile', raw: 'Şile', fuzzy: false, tierId: 'tam', points: 100, year: null, share: null });
    bus.emit('era:change', { eraId: 'erken_modern', year: 1450 });
    bus.emit('result:show', {
      kind: 'pop',
      modeId: 'nadir',
      tierId: 'tam',
      points: 100,
      player: { label: 'Şile', year: null, share: null, rankT: null, rankP: null },
      best: [MOCK_QUESTIONS[0].items[0]],
      dots: [{ label: 'Şile', year: null, approx: false, share: null, info: 'Şile', src: 'stub', isPlayer: true, isBest: false }],
      poolSize: 39
    });
    bus.emit('answer:pass', {});
    bus.emit('answer:timeout', {});
    bus.emit('round:end', { modeId: 'nadir', score: 100, max: 500, rows: [] });
    bus.emit('day:complete', { score: 1600, max: 2000, streak: 1, shareText: 'PUSULLA #1 · 1600/2000' });
    bus.emit('stats:show', getStoreSummary());

    showMenu();
  }

  P.actions = {
    startDaily: function () {
      var s = readStore();
      var todayKey = getTodayKey();
      var dayRec = (s.days && s.days[todayKey]) || { legs: {}, totalScore: 0 };
      var startIdx = 0;
      for (var i = 0; i < state.dailyLegs.length; i++) {
        var leg = dayRec.legs && dayRec.legs[state.dailyLegs[i]];
        if (!leg || !leg.completed) {
          startIdx = i;
          break;
        }
      }
      state.dailyLegIndex = startIdx;
      state.dailyScore = dayRec.totalScore || 0;
      state.locked = false;
      startMode(state.dailyLegs[startIdx], true);
    },
    selectMode: function (modeId) {
      if (!modeId) return;
      if (modeId === 'rota') {
        P.actions.startDaily();
        return;
      }
      state.locked = false;
      startMode(modeId, false);
    },
    focusMode: function (modeId) {
      if (!modeId) return;
      bus.emit('menu:focus', { modeId: modeId });
    },
    submit: function (text) {
      if (state.phase !== 'question' || state.locked) return;
      var raw = String(text || '').trim();
      state.lastRawInput = raw;
      if (raw.length < 2) {
        bus.emit('answer:invalid', { raw: raw, reason: 'En az 2 karakter yaz.' });
        return;
      }

      var q = state.question;
      var res = matchAnswer(q, raw);

      if (res.type === 'invalid') {
        bus.emit('answer:invalid', { raw: raw, reason: res.reason || 'Geçersiz cevap.' });
        return;
      }

      // Yazim hatasi -> otomatik kabul YOK, "Şunu mu demek istedin?" onayi
      if (res.type === 'confirm' || (res.type === 'valid' && res.fuzzy)) {
        var sugLabel = res.label || res.suggestion || (res.row && res.row.label);
        state.pendingConfirm = { raw: raw, label: sugLabel, row: res.row || null };
        bus.emit('answer:confirm', { raw: raw, suggestion: sugLabel, label: sugLabel });
        return;
      }

      if (res.type === 'valid' && res.row) {
        state.locked = true;
        finalizeAnswer(res.row, raw, false);
        return;
      }

      state.hasNoneThisQuestion = true;
      state.lastReportKind = 'none';
      bus.emit('answer:none', { raw: raw, newerThanAsOf: Boolean(res.newerThanAsOf), canReport: true });
    },
    confirmSuggestion: function (accept) {
      if (state.phase !== 'question' || !state.pendingConfirm || state.locked) return;
      var pending = state.pendingConfirm;
      state.pendingConfirm = null;

      if (!accept) {
        // Hayir ise soru cevap olarak yanlis sayilir
        state.locked = true;
        stopTimer();
        bus.emit('answer:invalid', { raw: pending.raw, reason: 'Öneri reddedildi, yanlış sayıldı.' });
        recordZeroResult(pending.raw + ' (yanlış)', 'zayif');
        return;
      }

      state.locked = true;
      if (pending.row) {
        finalizeAnswer(pending.row, pending.raw, true);
        return;
      }

      var q = state.question;
      var items = normalizePoolItems(q);
      var targetNorm = normText(pending.label);
      for (var i = 0; i < items.length; i++) {
        if (items[i].norm === targetNorm || items[i].label === pending.label) {
          finalizeAnswer(items[i], pending.raw, true);
          return;
        }
      }
      finalizeAnswer({ label: pending.label, norm: targetNorm, share: 10, year: null, era: 'simdi' }, pending.raw, true);
    },
    pass: function () {
      if (state.phase !== 'question' || state.locked) return;
      state.locked = true;
      stopTimer();
      bus.emit('answer:pass', {});
      var q = state.question;
      state.rows.push({ qId: q.id, subject: q.subject, answer: '(geçildi)', points: 0, tierId: 'pas' });
      state.index += 1;
      if (state.index >= state.total) {
        finishRound();
      } else {
        showQuestion();
      }
    },
    next: function () {
      if (state.phase !== 'result' || state.locked) return;
      state.locked = true;
      state.index += 1;
      if (state.index >= state.total) {
        finishRound();
      } else {
        showQuestion();
      }
    },
    toMenu: function () {
      showMenu();
    },
    report: function () {
      if (state.phase !== 'question' && state.phase !== 'result') return;
      var qId = state.question ? state.question.id : 'unknown';
      var rawText = state.lastRawInput || (state.lastResult && state.lastResult.player && state.lastResult.player.label) || '';
      var entry = {
        d: getTodayKey(),
        q: qId,
        t: String(rawText).slice(0, 60),
        k: state.lastReportKind || 'none'
      };
      var count = saveReportEntry(entry);
      bus.emit('report:saved', { count: count });
    },
    copyShare: function () {
      var s = readStore();
      var todayKey = getTodayKey();
      var dayRec = s.days && s.days[todayKey];
      var text = (dayRec && dayRec.shareText) || ('PUSULLA Günün Rotası: ' + state.dailyScore + '/2000');
      if (global.navigator && global.navigator.clipboard && typeof global.navigator.clipboard.writeText === 'function') {
        global.navigator.clipboard.writeText(text).catch(function () {});
      }
      return text;
    },
    showStats: function () {
      stopTimer();
      state.phase = 'stats';
      setBodyAttrs();
      bus.emit('stats:show', getStoreSummary());
    }
  };

  P.state = {
    get: function () {
      return {
        phase: state.phase,
        modeId: state.modeId,
        index: state.index,
        score: state.score,
        question: state.question ? { id: state.question.id, subject: state.question.subject, text: state.question.text } : null,
        lastResult: state.lastResult ? Object.assign({}, state.lastResult) : null
      };
    }
  };

  P.game = {
    init: init,
    runMockTour: runMockTour,
    stopTimer: stopTimer
  };

  function init() {
    var root = global.document ? global.document.getElementById('app') : null;
    if (P.ui && typeof P.ui.mount === 'function' && root) {
      P.ui.mount(root);
    }

    if (hasQueryFlag('mock')) {
      runMockTour();
      return;
    }

    bus.emit('app:ready', {
      asOf: getConfig('ASOF', '2026-11-22'),
      modes: getConfig('MODES', DEFAULT_MODES),
      keymap: getConfig('KEYMAP', {})
    });

    var s = readStore();
    if (s.pending && resumeFromPending(s.pending)) {
      return;
    }

    showMenu();
  }

  if (global.document) {
    if (global.document.readyState === 'loading') {
      global.document.addEventListener('DOMContentLoaded', init);
    } else if (!P.ui) {
      global.setTimeout(init, 0);
    } else {
      init();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
