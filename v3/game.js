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

  // Menü modları: 4 ana yön NORMAL, 4 çapraz uç menüde TEK KARMA girişi
  var DEFAULT_MODES = [
    { id: 'yaygin', label: 'YAYGIN', group: 'normal', dir: 'K ↑', kind: 'pop' },
    { id: 'nadir', label: 'NADİR', group: 'normal', dir: 'G ↓', kind: 'pop' },
    { id: 'eski', label: 'EN ESKİ', group: 'normal', dir: 'B ←', kind: 'time' },
    { id: 'yeni', label: 'EN YENİ', group: 'normal', dir: 'D →', kind: 'time' },
    { id: 'karma', label: 'KARMA', group: 'karma', dir: '✦', kind: 'combo' }
  ];

  // Sahte soru havuzu (?mock ve F1 stub oynanışı için)
  var MOCK_QUESTIONS = [
    {
      id: 'q_ilce',
      subject: 'İSTANBUL İLÇESİ',
      text: 'Bir tane İSTANBUL İLÇESİ söyle.',
      scope: '39 ilçe',
      closed: true,
      poolSize: 39,
      kind: 'pop',
      stubHint: 'Geçerli: "Kadıköy", yazım hatası: "kadioky", NADİR liste dışı tam puan: "Şile", yok: "yok"',
      items: [
        { label: 'Kadıköy', norm: 'kadikoy', share: 18, year: null, era: 'simdi', rankP: 1 },
        { label: 'Beşiktaş', norm: 'besiktas', share: 14, year: null, era: 'simdi', rankP: 2 },
        { label: 'Şile', norm: 'sile', share: null, year: null, era: 'simdi', rankP: null }
      ],
      typos: { kadioky: 'Kadıköy', besikts: 'Beşiktaş' }
    },
    {
      id: 'q_tarayici',
      subject: 'WEB TARAYICI',
      text: 'Bir tane WEB TARAYICI söyle.',
      scope: '1990–2026',
      closed: false,
      poolSize: 48,
      kind: 'time',
      stubHint: 'Geçerli: "WorldWideWeb" (1990) veya "Firefox" (2004), yazım hatası: "firefoks", NADİR liste dışı: "Lynx"',
      items: [
        { label: 'WorldWideWeb', norm: 'worldwideweb', share: 2, year: 1990, era: 'dijital', rankT: 1, rankP: 12 },
        { label: 'Netscape Navigator', norm: 'netscape', share: 6, year: 1994, era: 'dijital', rankT: 2, rankP: 6 },
        { label: 'Firefox', norm: 'firefox', share: 16, year: 2004, era: 'dijital', rankT: 4, rankP: 2 },
        { label: 'Lynx', norm: 'lynx', share: null, year: 1992, era: 'dijital', rankT: 3, rankP: null }
      ],
      typos: { firefoks: 'Firefox', netscap: 'Netscape Navigator' }
    },
    {
      id: 'q_corba',
      subject: 'ÇORBA',
      text: 'Bir tane ÇORBA söyle.',
      scope: 'Türk ve dünya mutfağı',
      closed: false,
      poolSize: 120,
      kind: 'pop',
      stubHint: 'Geçerli: "Mercimek", yazım hatası: "mercimke", NADİR liste dışı: "Tarhun"',
      items: [
        { label: 'Mercimek Çorbası', norm: 'mercimek', share: 32, year: null, era: 'simdi', rankP: 1 },
        { label: 'Tarhana Çorbası', norm: 'tarhana', share: 19, year: null, era: 'simdi', rankP: 2 },
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
      stubHint: 'Geçerli: "Jüpiter", yazım hatası: "jupter", NADİR liste dışı: "Neptün"',
      items: [
        { label: 'Jüpiter', norm: 'jupiter', share: 24, year: 1610, era: 'erken_modern', rankT: 6, rankP: 2 },
        { label: 'Mars', norm: 'mars', share: 28, year: -2000, era: 'antik', rankT: 1, rankP: 1 },
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
      stubHint: 'Geçerli: "Matbaa" (1450) veya "Telefon" (1876), NADİR liste dışı: "Astrolab"',
      items: [
        { label: 'Matbaa', norm: 'matbaa', share: 22, year: 1450, era: 'erken_modern', rankT: 2, rankP: 2 },
        { label: 'Telefon', norm: 'telefon', share: 25, year: 1876, era: 'sanayi', rankT: 5, rankP: 1 },
        { label: 'Astrolab', norm: 'astrolab', share: null, year: 200, era: 'antik', rankT: 1, rankP: null }
      ],
      typos: { matba: 'Matbaa', telfon: 'Telefon' }
    }
  ];

  var stubStore = {
    reports: 0,
    best: 420,
    streak: 1,
    dailyProgress: { yaygin: 0, nadir: 0, eski: 0, yeni: 0 },
    played: 0
  };

  var state = {
    phase: 'menu',
    modeId: null,
    daily: false,
    dailyLegs: ['yaygin', 'nadir', 'eski', 'yeni'],
    dailyLegIndex: 0,
    dailyScore: 0,
    index: 0,
    total: 5,
    score: 0,
    rows: [],
    question: null,
    lastResult: null,
    pendingConfirm: null,
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
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/[^a-z0-9]/g, '');
  }

  function setBodyAttrs() {
    if (!global.document || !global.document.body) return;
    var b = global.document.body;
    b.setAttribute('data-phase', state.phase || 'menu');
    b.setAttribute('data-mode', state.modeId || '');
    b.setAttribute('data-era', state.eraId || 'simdi');
  }

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

  function getStoreSummary() {
    if (P.store && typeof P.store.getSummary === 'function') {
      return P.store.getSummary();
    }
    return {
      best: stubStore.best,
      streak: stubStore.streak,
      played: stubStore.played,
      reports: stubStore.reports,
      dailyProgress: Object.assign({}, stubStore.dailyProgress)
    };
  }

  function showMenu() {
    stopTimer();
    state.phase = 'menu';
    state.modeId = null;
    state.daily = false;
    state.question = null;
    state.pendingConfirm = null;
    state.eraId = 'simdi';
    state.locked = false;
    setBodyAttrs();

    if (P.scene && typeof P.scene.setScene === 'function') {
      P.scene.setScene('simdi', { year: null, modeId: null });
    }

    var summary = getStoreSummary();
    bus.emit('menu:show', {
      dailyProgress: summary.dailyProgress,
      best: summary.best,
      streak: summary.streak
    });
  }

  function showQuestion() {
    var total = getConfig('QUESTIONS_PER_ROUND', 5);
    var q = MOCK_QUESTIONS[state.index % MOCK_QUESTIONS.length];
    state.phase = 'question';
    state.total = total;
    state.question = q;
    state.pendingConfirm = null;
    state.locked = false;
    setBodyAttrs();

    bus.emit('question:show', {
      index: state.index,
      total: total,
      modeId: state.modeId,
      subject: q.subject,
      text: q.text,
      scope: q.scope,
      closed: q.closed,
      poolSize: q.poolSize,
      stubHint: q.stubHint
    });

    startTimer();
  }

  function startMode(modeId, isDaily) {
    if (state.locked) return;
    state.locked = true;
    state.modeId = modeId;
    state.daily = !!isDaily;
    state.index = 0;
    state.score = 0;
    state.rows = [];
    state.lastResult = null;
    setBodyAttrs();

    if (P.scene && typeof P.scene.setMode === 'function') {
      P.scene.setMode(modeId);
    }

    bus.emit('mode:start', {
      modeId: modeId,
      daily: !!isDaily,
      total: getConfig('QUESTIONS_PER_ROUND', 5)
    });

    showQuestion();
  }

  function finalizeAnswer(item, raw, fuzzy) {
    stopTimer();
    var q = state.question;
    var modeId = state.modeId || 'yaygin';

    // NADİR modda havuzda olup pay listesinde olmayan geçerli cevap = TAM PUAN (100)
    var isUnlistedNadir = modeId === 'nadir' && (item.share === null || item.share === undefined);
    var points = isUnlistedNadir ? 100 : (item.share ? Math.min(100, Math.max(40, item.share * 3)) : 80);
    var tierId = points >= 90 ? 'tam' : (points >= 75 ? 'cokyakin' : (points >= 55 ? 'yakin' : 'uzak'));

    state.score += points;
    if (state.daily) {
      state.dailyScore += points;
      if (stubStore.dailyProgress[modeId] !== undefined) {
        stubStore.dailyProgress[modeId] = Math.min(5, stubStore.dailyProgress[modeId] + 1);
      }
    }

    state.rows.push({
      subject: q.subject,
      answer: item.label,
      points: points,
      tierId: tierId
    });

    bus.emit('answer:valid', {
      label: item.label,
      raw: raw,
      fuzzy: !!fuzzy,
      tierId: tierId,
      points: points,
      year: item.year,
      share: item.share
    });

    var eraId = item.era || 'simdi';
    state.eraId = eraId;
    bus.emit('era:change', { eraId: eraId, year: item.year });
    if (P.scene && typeof P.scene.setScene === 'function') {
      P.scene.setScene(eraId, { year: item.year, modeId: modeId });
    }

    var dots = [];
    for (var i = 0; i < q.items.length; i++) {
      var it = q.items[i];
      dots.push({
        label: it.label,
        year: it.year,
        approx: false,
        share: it.share,
        info: it.label,
        src: 'stub',
        isPlayer: it.norm === item.norm,
        isBest: i === 0
      });
    }

    var resultPayload = {
      kind: modeId === 'eski' || modeId === 'yeni' ? 'time' : (modeId === 'karma' ? 'combo' : 'pop'),
      modeId: modeId,
      tierId: tierId,
      points: points,
      player: {
        label: item.label,
        year: item.year,
        share: item.share,
        rankT: item.rankT || null,
        rankP: item.rankP || null
      },
      best: [q.items[0]],
      dots: dots,
      poolSize: q.poolSize
    };

    state.phase = 'result';
    state.lastResult = resultPayload;
    setBodyAttrs();
    bus.emit('result:show', resultPayload);
  }

  function handleTimeout() {
    if (state.phase !== 'question') return;
    bus.emit('answer:timeout', {});
    var q = state.question;
    state.rows.push({ subject: q.subject, answer: '(süre doldu)', points: 0, tierId: 'zayif' });

    var resultPayload = {
      kind: q.kind || 'pop',
      modeId: state.modeId,
      tierId: 'zayif',
      points: 0,
      player: { label: '—', year: null, share: null, rankT: null, rankP: null },
      best: [q.items[0]],
      dots: [],
      poolSize: q.poolSize
    };

    state.phase = 'result';
    state.lastResult = resultPayload;
    setBodyAttrs();
    bus.emit('result:show', resultPayload);
  }

  function finishRound() {
    stopTimer();
    state.phase = 'summary';
    stubStore.played += 1;
    if (state.score > stubStore.best) stubStore.best = state.score;
    setBodyAttrs();

    bus.emit('round:end', {
      modeId: state.modeId,
      score: state.score,
      max: getConfig('ROUND_MAX', 500),
      rows: state.rows.slice()
    });

    if (state.daily) {
      if (state.dailyLegIndex + 1 < state.dailyLegs.length) {
        state.dailyLegIndex += 1;
        state.locked = false;
        startMode(state.dailyLegs[state.dailyLegIndex], true);
      } else {
        bus.emit('day:complete', {
          score: state.dailyScore,
          max: getConfig('DAY_MAX', 2000),
          streak: stubStore.streak,
          shareText: 'PUSULLA Günün Rotası: ' + state.dailyScore + '/2000'
        });
      }
    }
  }

  // Tüm §2.9 olaylarını tek seferde yayan ?mock turu
  function runMockTour() {
    var modes = getConfig('MODES', DEFAULT_MODES);
    var keymap = getConfig('KEYMAP', {});
    var asOf = getConfig('ASOF', '2026-11-22');

    bus.emit('app:ready', { asOf: asOf, modes: modes, keymap: keymap });
    bus.emit('menu:show', {
      dailyProgress: stubStore.dailyProgress,
      best: stubStore.best,
      streak: stubStore.streak
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
    bus.emit('day:complete', { score: 1600, max: 2000, streak: 1, shareText: 'PUSULLA 1600/2000' });
    bus.emit('stats:show', getStoreSummary());

    showMenu();
  }

  P.actions = {
    startDaily: function () {
      state.dailyLegIndex = 0;
      state.dailyScore = 0;
      state.locked = false;
      startMode(state.dailyLegs[0], true);
    },
    selectMode: function (modeId) {
      if (!modeId) return;
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
      if (raw.length < 2) {
        bus.emit('answer:invalid', { raw: raw, reason: 'En az 2 karakter yaz.' });
        return;
      }

      var q = state.question;
      var n = normText(raw);

      // Yazım hatası -> otomatik kabul YOK, "Şunu mu demek istedin?" onayı
      if (q.typos && q.typos[n]) {
        var suggestedLabel = q.typos[n];
        state.pendingConfirm = { raw: raw, label: suggestedLabel };
        bus.emit('answer:confirm', { raw: raw, suggestion: suggestedLabel, label: suggestedLabel });
        return;
      }

      // Doğrudan eşleşme
      for (var i = 0; i < q.items.length; i++) {
        if (q.items[i].norm === n) {
          state.locked = true;
          finalizeAnswer(q.items[i], raw, false);
          return;
        }
      }

      bus.emit('answer:none', { raw: raw, newerThanAsOf: false, canReport: true });
    },
    confirmSuggestion: function (accept) {
      if (state.phase !== 'question' || !state.pendingConfirm) return;
      var pending = state.pendingConfirm;
      state.pendingConfirm = null;

      if (!accept) {
        bus.emit('answer:invalid', { raw: pending.raw, reason: 'Öneri reddedildi, cevabı düzenle.' });
        return;
      }

      var q = state.question;
      var targetNorm = normText(pending.label);
      for (var i = 0; i < q.items.length; i++) {
        if (q.items[i].norm === targetNorm || q.items[i].label === pending.label) {
          state.locked = true;
          finalizeAnswer(q.items[i], pending.raw, true);
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
      state.rows.push({ subject: q.subject, answer: '(geçildi)', points: 0, tierId: 'zayif' });
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
      if (state.phase !== 'question') return;
      stubStore.reports += 1;
      bus.emit('report:saved', { count: stubStore.reports });
    },
    copyShare: function () {
      var text = 'PUSULLA Günün Rotası: ' + state.dailyScore + '/2000';
      if (global.navigator && global.navigator.clipboard && typeof global.navigator.clipboard.writeText === 'function') {
        global.navigator.clipboard.writeText(text).catch(function () {});
      }
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
    runMockTour: runMockTour
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

    showMenu();
  }

  if (global.document) {
    if (global.document.readyState === 'loading') {
      global.document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
