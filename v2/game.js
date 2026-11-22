(function (root) {
  'use strict';

  root.__ERRORS = root.__ERRORS || [];

  var CFG = root.MARTI_CONFIG;
  var DAILY = root.MARTI_DAILY;

  var params = new URLSearchParams(root.location ? root.location.search : '');
  var isLocalOrFile = !root.location || root.location.protocol === 'file:' || root.location.hostname === 'localhost' || root.location.hostname === '127.0.0.1';
  var isDebugMode = isLocalOrFile || params.get('debug') === '1';
  var paramDate = isDebugMode ? params.get('date') : null;
  var paramShot = isDebugMode ? params.get('shot') : null;
  var paramAuto = isDebugMode ? params.get('auto') : null;
  var paramReset = isDebugMode && params.get('reset') === '1';
  var paramNoStorage = params.get('nostorage') === '1';
  var paramDebug = params.get('debug') === '1' || !!paramAuto || !!paramShot;

  var STORAGE_KEY = (paramShot || paramAuto) ? 'marti.v2.test' : (CFG.STORAGE_KEY || 'marti.v2');

  var state = {
    phase: 'menu', // 'menu' | 'intro' | 'question' | 'reveal' | 'result' | 'cinematic' | 'summary'
    dayKey: '',
    dailySet: null,
    modeId: 'zirve',
    effectiveModeId: 'zirve',
    isUnlimited: false,
    questions: [],
    currentQ: 0,
    totalScore: 0,
    displayedScore: 0,
    results: [],
    roundFinalized: false,
    deadline: 0,
    hiddenAt: 0,
    escPausedRemaining: 0,
    escPausedAt: 0,
    pendingRemainingMs: 0,
    lastWarnSec: -1,
    skipShown: false,
    timerRaf: null,
    revealTimer: null,
    introTimer: null,
    scoreAnimRaf: null,
    escConfirmOpen: false,
    menuFocusIdx: 0,
    lastZoneLabel: '',
    logoGullFrame: 'mid',
    logoAnimTimer: null,
    autoDone: false
  };

  var dom = {};
  var store = null;

  function toUpperTR(str) {
    return String(str || '').toLocaleUpperCase('tr-TR');
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeColor(col) {
    return typeof col === 'string' && /^#[0-9a-f]{3,8}$/i.test(col) ? col : '#8a8698';
  }

  function formatPct(s) {
    var num = Number(s) || 0;
    return '%' + num.toLocaleString('tr-TR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: num < 1 ? 2 : 1
    });
  }

  function getTodayKey() {
    if (paramDate && /^\d{4}-\d{2}-\d{2}$/.test(paramDate)) {
      return paramDate;
    }
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function formatDateTR(dayKey) {
    var p = String(dayKey || '').split('-');
    if (p.length !== 3) return dayKey;
    return p[2] + '.' + p[1] + '.' + p[0];
  }

  function sceneCall(method) {
    if (root.Scene && typeof root.Scene[method] === 'function') {
      return root.Scene[method].apply(root.Scene, Array.prototype.slice.call(arguments, 1));
    }
    return undefined;
  }

  function updateDebugBox() {
    if (!dom.debugBox) return;
    if (!paramDebug) {
      dom.debugBox.hidden = true;
      return;
    }
    dom.debugBox.hidden = false;
    var errCount = root.__ERRORS ? root.__ERRORS.length : 0;
    if (paramAuto && state.autoDone) {
      dom.debugBox.textContent = 'AUTO OK ' + state.results.length + '/' + CFG.QUESTIONS_PER_ROUND + ' · HATA: ' + errCount;
      return;
    }
    var selfTestText = 'ok';
    try {
      var issues = sceneCall('selfTest');
      if (issues && issues.length > 0) {
        selfTestText = String(issues[0]);
      }
    } catch (e) {
      selfTestText = e && e.message ? e.message : String(e);
    }
    dom.debugBox.textContent = 'HATA: ' + errCount + ' · SELFTEST: ' + selfTestText;
  }

  root.addEventListener('error', function (e) {
    root.__ERRORS.push(e && e.message ? e.message : String(e));
    updateDebugBox();
  });

  root.addEventListener('unhandledrejection', function (e) {
    var msg = e && e.reason ? (e.reason.message || String(e.reason)) : 'Promise rejection';
    root.__ERRORS.push(msg);
    updateDebugBox();
  });

  // --- Depolama ---
  function defaultStore() {
    return {
      version: 2,
      persistent: true,
      sound: true,
      unlimitedMode: 'zirve',
      days: {},
      stats: {
        playedDays: 0,
        streak: 0,
        bestStreak: 0,
        lastPlayedDay: null,
        best: { zirve: 0, dip: 0, orta: 0 },
        unlimitedRounds: 0
      }
    };
  }

  function getStorageBackend() {
    if (paramNoStorage) {
      return {
        getItem: function () { throw new Error('nostorage'); },
        setItem: function () { throw new Error('nostorage'); },
        removeItem: function () { throw new Error('nostorage'); }
      };
    }
    return root.localStorage;
  }

  function loadStore() {
    var base = defaultStore();
    try {
      var ls = getStorageBackend();
      ls.setItem(STORAGE_KEY + '.__probe', '1');
      ls.removeItem(STORAGE_KEY + '.__probe');
      if (paramReset) {
        ls.removeItem(STORAGE_KEY);
      }
      var raw = ls.getItem(STORAGE_KEY);
      if (!raw) return base;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return base;
      base.sound = parsed.sound !== false;
      base.unlimitedMode = CFG.MODES[parsed.unlimitedMode] && CFG.MODES[parsed.unlimitedMode].daily ? parsed.unlimitedMode : 'zirve';
      if (parsed.days && typeof parsed.days === 'object' && !Array.isArray(parsed.days)) {
        Object.keys(parsed.days).forEach(function (dk) {
          var dayObj = parsed.days[dk];
          if (!dayObj || typeof dayObj !== 'object' || Array.isArray(dayObj)) return;
          var cleanDay = {};
          Object.keys(dayObj).forEach(function (mId) {
            var rec = dayObj[mId];
            if (!rec || typeof rec !== 'object') return;
            if (!Array.isArray(rec.results)) return;
            if (rec.done && typeof rec.score !== 'number') return;
            if (rec.done) rec.score = Number(rec.score) || 0;
            rec.results = rec.results.filter(function (r) {
              return r && typeof r === 'object';
            }).map(function (r) {
              r.points = Number(r.points) || 0;
              r.tierLabel = r.tierLabel != null ? String(r.tierLabel) : '';
              r.label = r.label != null ? String(r.label) : '';
              r.raw = r.raw != null ? String(r.raw) : '';
              return r;
            });
            cleanDay[mId] = rec;
          });
          base.days[dk] = cleanDay;
        });
      }
      if (parsed.stats && typeof parsed.stats === 'object') {
        base.stats.playedDays = Number(parsed.stats.playedDays) || 0;
        base.stats.streak = Number(parsed.stats.streak) || 0;
        base.stats.bestStreak = Number(parsed.stats.bestStreak) || 0;
        base.stats.lastPlayedDay = parsed.stats.lastPlayedDay || null;
        base.stats.unlimitedRounds = Number(parsed.stats.unlimitedRounds) || 0;
        if (parsed.stats.best && typeof parsed.stats.best === 'object') {
          base.stats.best.zirve = Number(parsed.stats.best.zirve) || 0;
          base.stats.best.dip = Number(parsed.stats.best.dip) || 0;
          base.stats.best.orta = Number(parsed.stats.best.orta) || 0;
        }
      }
    } catch (e) {
      base.persistent = false;
    }
    return base;
  }

  function saveStore() {
    try {
      var ls = getStorageBackend();
      ls.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      if (store) store.persistent = false;
    }
  }

  function cleanOldDays() {
    if (!store || !store.days || !DAILY) return;
    var todayEpoch = DAILY.dayKeyToEpochDay(state.dayKey);
    var changed = false;
    Object.keys(store.days).forEach(function (k) {
      var ep = DAILY.dayKeyToEpochDay(k);
      if (todayEpoch - ep > 60) {
        delete store.days[k];
        changed = true;
      }
    });
    if (changed) saveStore();
  }

  // --- Kademe ve Cümleler ---
  function evalTier(modeCfg, rank, share) {
    var tiers = modeCfg.tiers || [];
    for (var i = 0; i < tiers.length; i++) {
      var t = tiers[i];
      var r = t.rule || {};
      if (r.rankMin != null && rank < r.rankMin) continue;
      if (r.rankMax != null && rank > r.rankMax) continue;
      if (r.shareMin != null && share < r.shareMin) continue;
      if (r.shareMax != null && share > r.shareMax) continue;
      return t;
    }
    return tiers[tiers.length - 1] || CFG.PASS_TIER;
  }

  function buildResultSentence(modeId, tier, rank, share) {
    if (tier.id === 'sure') return 'Süre doldu.';
    if (tier.id === 'pas') return 'Bu soruyu geçtin.';
    var p = formatPct(share);
    if (modeId === 'zirve') {
      if (rank === 1) return 'Bu 1 numaralı cevap. Herkesle aynı kafadasın.';
      if (rank === 2 || rank === 3) return 'Bu ' + rank + ' numaralı cevap: verenlerin oranı ' + p + '.';
      if (tier.id === 'idare') return rank + '. sırada (' + p + '). Fena değil, biraz daha yukarı.';
      return 'Az verilmiş (' + p + '): yukarı sadece küçük bir kanat çırpışı.';
    }
    if (modeId === 'dip') {
      if (tier.id === 'mukemmel') return 'İyi saklanmış: verenlerin oranı sadece ' + p + '.';
      if (tier.id === 'cokiyi') return 'Derinlerde (' + p + '). Dibe az kaldı.';
      if (tier.id === 'iyi') return 'Orta sularda (' + p + ').';
      if (tier.id === 'idare') return 'Epey kişi bunu demiş (' + p + ').';
      return 'Bu kalabalığın cevabı (' + p + '): dip değil, yüzey.';
    }
    // orta
    if (tier.id === 'mukemmel') return 'Bu ' + rank + ' numaralı cevap (' + p + '): tam ortada!';
    if (tier.id === 'cokiyi' || tier.id === 'iyi' || tier.id === 'idare') {
      return 'Bu ' + rank + ' numaralı cevap (' + p + '). Orta 4.–6. sıralar.';
    }
    if (rank === 1) return 'Bu 1 numaralı cevap: herkes bunu dedi, orta değil.';
    return 'Çok nadir (' + p + '): ortanın epey altında.';
  }

  // --- Ekran Yönetimi ---
  function setPhase(nextPhase) {
    state.phase = nextPhase;
    sceneCall('setUiPhase', nextPhase);
    if (nextPhase === 'summary' || nextPhase === 'cinematic') {
      sceneCall('clearBanner');
    }
    dom.menuScreen.classList.toggle('active', nextPhase === 'menu');
    dom.introText.classList.toggle('active', nextPhase === 'intro');
    dom.questionScreen.classList.toggle('active', nextPhase === 'question' || nextPhase === 'reveal');
    dom.resultScreen.classList.toggle('active', nextPhase === 'result');
    dom.cinematicScreen.classList.toggle('active', nextPhase === 'cinematic');
    dom.summaryScreen.classList.toggle('active', nextPhase === 'summary');
  }

  function updateSoundButton() {
    var on = root.Sound ? root.Sound.isEnabled() : store.sound;
    dom.soundBtn.textContent = on ? 'SES: AÇIK' : 'SES: KAPALI';
  }

  function toggleSound() {
    var next = !(root.Sound ? root.Sound.isEnabled() : store.sound);
    store.sound = next;
    if (root.Sound) {
      root.Sound.setEnabled(next);
      if (next) {
        root.Sound.unlock();
        root.Sound.play('click');
      }
    }
    saveStore();
    updateSoundButton();
  }

  // --- Logo Canvas ---
  function drawHeroGull(ctx, x, y, animState) {
    // 32x24 kahraman martı maskotu (kırmızı atkı aksesuarlı, belirgin göz & sarı gaga)
    var blink = animState === 'blink';
    var turn = animState === 'turn';
    ctx.save();
    // Kontur gövde
    ctx.fillStyle = '#1a1128';
    ctx.fillRect(x + 4, y + 10, 18, 11);
    ctx.fillRect(x + 12, y + 2, 11, 11);
    ctx.fillRect(x + 1, y + 13, 6, 5);
    // Beyaz gövde + kafa
    ctx.fillStyle = '#fff5e4';
    ctx.fillRect(x + 5, y + 11, 16, 9);
    ctx.fillRect(x + 13, y + 3, 9, 9);
    // Gri kanat & kuyruk
    ctx.fillStyle = '#9aa6bf';
    ctx.fillRect(x + 6, y + 12, 11, 5);
    ctx.fillRect(x + 2, y + 14, 4, 3);
    ctx.fillStyle = '#6b7794';
    ctx.fillRect(x + 2, y + 15, 2, 2);
    // Tek imza aksesuar: kırmızı-altın boğaz atkısı
    ctx.fillStyle = '#d9483b';
    ctx.fillRect(x + 12, y + 11, 10, 3);
    ctx.fillRect(x + 11, y + 14, 3, 4);
    ctx.fillStyle = '#ffd27a';
    ctx.fillRect(x + 11, y + 17, 3, 1);
    // Sarı gaga
    var beakX = turn ? x + 21 : x + 22;
    ctx.fillStyle = '#1a1128';
    ctx.fillRect(beakX, y + 6, 8, 4);
    ctx.fillStyle = '#ffb838';
    ctx.fillRect(beakX, y + 7, 7, 2);
    ctx.fillStyle = '#e07b24';
    ctx.fillRect(beakX, y + 9, 5, 1);
    // Belirgin göz (göz kırpma destekli)
    var eyeX = turn ? x + 17 : x + 19;
    if (blink) {
      ctx.fillStyle = '#1a1128';
      ctx.fillRect(eyeX, y + 6, 3, 1);
    } else {
      ctx.fillStyle = '#1a1128';
      ctx.fillRect(eyeX, y + 5, 3, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(eyeX, y + 5, 1, 1);
    }
    // Bacaklar
    ctx.fillStyle = '#f0a04b';
    ctx.fillRect(x + 11, y + 20, 2, 3);
    ctx.fillRect(x + 16, y + 20, 2, 3);
    ctx.restore();
  }

  function drawLogo() {
    if (!dom.logoCanvas) return;
    var ctx = dom.logoCanvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 144, 48);

    var text = 'MARTI';
    var scale = 3;
    var grad = ['#ffe7a8', '#ffe7a8', '#ffc46b', '#ffc46b', '#f2884f', '#f2884f', '#d9603f'];
    var textX = 56;
    var textY = 14;

    if (root.PixelFont && typeof root.PixelFont.draw === 'function') {
      root.PixelFont.draw(ctx, text, textX, textY, {
        scale: scale,
        align: 'center',
        gradient: grad,
        outline: '#1a1128',
        shadow: '#5a2a5e'
      });
    } else {
      ctx.fillStyle = '#ffc46b';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(text, textX, 34);
    }

    drawHeroGull(ctx, 108, 12, state.logoGullFrame);
  }

  function startLogoLoop() {
    if (state.logoAnimTimer) clearInterval(state.logoAnimTimer);
    state.logoGullFrame = 'idle';
    drawLogo();
    state.logoAnimTimer = setInterval(function () {
      if (state.phase !== 'menu') return;
      state.logoGullFrame = 'blink';
      drawLogo();
      setTimeout(function () {
        state.logoGullFrame = 'turn';
        drawLogo();
        setTimeout(function () {
          state.logoGullFrame = 'idle';
          drawLogo();
        }, 320);
      }, 180);
    }, 3600);
  }

  function refreshDailyIfNeeded() {
    var tk = getTodayKey();
    if (tk !== state.dayKey) {
      state.dayKey = tk;
      state.dailySet = DAILY
        ? DAILY.getDailySet(state.dayKey, root.QUESTIONS || [])
        : { dayKey: state.dayKey, dayNumber: 1, zirve: [], dip: [], orta: [] };
      return true;
    }
    return false;
  }

  // --- Ana Menü ---
  function renderMenu() {
    clearTimers();
    refreshDailyIfNeeded();
    cleanOldDays();
    setPhase('menu');
    if (root.Scene && typeof root.Scene.setMode === 'function') {
      root.Scene.setMode('menu');
    }
    dom.menuDay.textContent = 'MARTI #' + state.dailySet.dayNumber + ' · ' + formatDateTR(state.dayKey);

    var dayRecord = store.days[state.dayKey] || {};
    var cardsHtml = '';
    CFG.MODE_ORDER.forEach(function (mId, idx) {
      var m = CFG.MODES[mId];
      var rec = dayRecord[mId];
      var statusText = 'OYNA ⏎';
      var cls = 'mode-card';
      if (rec && rec.done) {
        cls += ' done';
        statusText = '✓ ' + (Number(rec.score) || 0) + '/' + CFG.MAX_SCORE;
      } else if (rec && Array.isArray(rec.results) && rec.results.length >= CFG.QUESTIONS_PER_ROUND) {
        var sumScore = rec.results.reduce(function (acc, r) { return acc + (Number(r.points) || 0); }, 0);
        cls += ' done';
        statusText = '✓ ' + sumScore + '/' + CFG.MAX_SCORE;
      } else if (rec && rec.results && rec.results.length > 0) {
        statusText = 'DEVAM ET ' + rec.results.length + '/' + CFG.QUESTIONS_PER_ROUND;
      }
      if (state.menuFocusIdx === idx) cls += ' focused';
      cardsHtml +=
        '<button type="button" class="' + cls + '" data-mode="' + mId + '" data-idx="' + idx + '">' +
          '<div class="mode-icon">' + m.icon + '</div>' +
          '<div class="mode-name">' + m.name + '</div>' +
          '<div class="mode-desc">' + m.desc + '</div>' +
          '<div class="mode-status">' + escapeHtml(statusText) + '</div>' +
        '</button>';
    });
    dom.modeCards.innerHTML = cardsHtml;

    var uButtons = '';
    CFG.MODE_ORDER.forEach(function (mId) {
      var sel = store.unlimitedMode === mId ? ' selected' : '';
      var label = mId === 'orta' ? 'ORTA' : CFG.MODES[mId].name;
      uButtons += '<button type="button" class="u-mode-btn' + sel + '" data-umode="' + mId + '">' + label + '</button>';
    });
    dom.unlimitedCard.classList.toggle('focused', state.menuFocusIdx === 3);
    dom.unlimitedCard.innerHTML =
      '<div class="unlimited-info">' +
        '<div class="unlimited-title">∞ SINIRSIZ</div>' +
        '<div class="unlimited-desc">' + CFG.MODES.sinirsiz.desc + '</div>' +
      '</div>' +
      '<div class="unlimited-controls">' +
        '<div class="u-mode-group">' + uButtons + '</div>' +
        '<button type="button" id="play-unlimited-btn" class="pixel-btn btn-primary">OYNA</button>' +
      '</div>';

    var st = store.stats;
    var persistNote = store.persistent === false ? '⚠ İlerleme kaydedilemiyor · ' : '';
    dom.statsBar.textContent =
      persistNote +
      'OYNANAN GÜN ' + st.playedDays +
      ' · SERİ ' + st.streak +
      ' · EN UZUN SERİ ' + st.bestStreak +
      ' · EN İYİ: ZİRVE ' + (st.best.zirve || 0) +
      ' · DİP ' + (st.best.dip || 0) +
      ' · ORTA ' + (st.best.orta || 0) +
      ' · SINIRSIZ TUR ' + (st.unlimitedRounds || 0);

    startLogoLoop();
  }

  // --- Tur Başlatma ---
  function pickRandomQuestions(count) {
    var all = (root.QUESTIONS || []).slice();
    for (var i = all.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = all[i];
      all[i] = all[j];
      all[j] = t;
    }
    return all.slice(0, count);
  }

  function startMode(modeId) {
    if (modeId !== 'sinirsiz') {
      var dayRec = store.days[state.dayKey] || {};
      var existing = dayRec[modeId];
      if (existing && existing.done) {
        // Tamamlanmış günlük mod: özeti aç
        state.modeId = modeId;
        state.effectiveModeId = modeId;
        state.isUnlimited = false;
        state.questions = (state.dailySet[modeId] || []).slice(0, CFG.QUESTIONS_PER_ROUND);
        state.results = (existing.results || []).slice();
        state.totalScore = existing.score || 0;
        state.displayedScore = state.totalScore;
        sceneCall('setMode', modeId);
        sceneCall('setScore', state.totalScore, { instant: true });
        renderSummary();
        return;
      }
    }

    state.modeId = modeId;
    state.isUnlimited = modeId === 'sinirsiz';
    state.effectiveModeId = state.isUnlimited ? store.unlimitedMode : modeId;
    state.questions = state.isUnlimited
      ? pickRandomQuestions(CFG.QUESTIONS_PER_ROUND)
      : (state.dailySet[modeId] || []).slice(0, CFG.QUESTIONS_PER_ROUND);

    state.currentQ = 0;
    state.totalScore = 0;
    state.displayedScore = 0;
    state.results = [];
    state.roundFinalized = false;
    state.escConfirmOpen = false;
    state.escPausedRemaining = 0;
    state.escPausedAt = 0;
    state.pendingRemainingMs = 0;
    state.hiddenAt = 0;
    state.autoDone = false;

    if (!state.isUnlimited) {
      var saved = store.days[state.dayKey] && store.days[state.dayKey][modeId];
      if (saved && !saved.done && Array.isArray(saved.results) && saved.results.length >= CFG.QUESTIONS_PER_ROUND) {
        state.results = saved.results.slice(0, CFG.QUESTIONS_PER_ROUND);
        state.totalScore = state.results.reduce(function (acc, r) { return acc + (Number(r.points) || 0); }, 0);
        state.displayedScore = state.totalScore;
        sceneCall('setMode', modeId);
        sceneCall('setScore', state.totalScore, { instant: true });
        finalizeRound();
        renderSummary();
        return;
      }
      if (saved && !saved.done && Array.isArray(saved.results) && saved.results.length < CFG.QUESTIONS_PER_ROUND) {
        state.results = saved.results.slice();
        state.currentQ = state.results.length;
        if (saved.pending && saved.pending.idx === state.results.length && typeof saved.pending.startedAt === 'number') {
          var elapsedMs = Math.max(0, Date.now() - saved.pending.startedAt);
          var remMs = CFG.ROUND_SECONDS * 1000 - elapsedMs;
          if (remMs <= 0) {
            var pq = state.questions[state.currentQ];
            var passTier = CFG.PASS_TIER;
            state.results.push({
              qid: pq ? pq.id : '',
              raw: '',
              label: '',
              rank: 0,
              share: 0,
              tierId: passTier.id,
              tierLabel: passTier.label,
              tierColor: passTier.color,
              tierIcon: passTier.icon,
              tierEmoji: passTier.emoji,
              points: passTier.points
            });
            state.currentQ = state.results.length;
            persistPartialRound();
            if (state.results.length >= CFG.QUESTIONS_PER_ROUND) {
              state.totalScore = state.results.reduce(function (acc, r) { return acc + (Number(r.points) || 0); }, 0);
              state.displayedScore = state.totalScore;
              sceneCall('setMode', modeId);
              sceneCall('setScore', state.totalScore, { instant: true });
              finalizeRound();
              renderSummary();
              return;
            }
          } else {
            state.pendingRemainingMs = remMs;
          }
        }
        state.totalScore = state.results.reduce(function (acc, r) { return acc + (Number(r.points) || 0); }, 0);
        state.displayedScore = state.totalScore;
      }
    }

    sceneCall('setMode', state.effectiveModeId);
    sceneCall('setScore', state.totalScore, { instant: true });
    updateZoneBadge(false);
    startIntroThenQuestion();
  }

  function updateZoneBadge(glow, zoneOverride) {
    if (!dom.zoneBadge) return;
    var modeCfg = CFG.MODES[state.effectiveModeId];
    var info = { name: 'BOĞAZ', label: '±0 m' };
    if (zoneOverride && zoneOverride.name) {
      info = zoneOverride;
    } else if (root.Scene && typeof root.Scene.getZoneInfo === 'function') {
      try {
        var z = root.Scene.getZoneInfo();
        if (z && z.name) info = z;
      } catch (e) {}
    }
    var text = modeCfg.icon + ' ' + info.name + '  ' + info.label;
    dom.zoneBadge.textContent = text;
    if (glow && info.name !== state.lastZoneLabel) {
      dom.zoneBadge.classList.remove('glow');
      void dom.zoneBadge.offsetWidth;
      dom.zoneBadge.classList.add('glow');
    }
    state.lastZoneLabel = info.name;
  }

  function renderProgressBoxes() {
    var html = '';
    for (var i = 0; i < CFG.QUESTIONS_PER_ROUND; i++) {
      var res = state.results[i];
      var style = '';
      var icon = '';
      var cls = 'prog-box';
      if (res) {
        style = 'background:' + res.tierColor + ';border-color:' + res.tierColor + ';';
        icon = res.tierIcon || '';
      } else if (i === state.currentQ && (state.phase === 'question' || state.phase === 'reveal')) {
        cls += ' current';
      }
      html += '<span class="' + cls + '" style="' + style + '">' + icon + '</span>';
    }
    dom.progressBoxes.innerHTML = html;
    dom.totalScore.textContent = state.displayedScore + ' PUAN';
  }

  function startIntroThenQuestion() {
    clearTimers();
    var modeCfg = CFG.MODES[state.effectiveModeId];
    dom.introText.textContent = modeCfg.hint;
    setPhase('intro');

    var introMs = paramAuto ? 200 : 900;
    state.introTimer = setTimeout(function () {
      beginQuestion();
    }, introMs);
  }

  function beginQuestion() {
    var q = state.questions[state.currentQ];
    if (!q) {
      renderCinematic();
      return;
    }

    var modeCfg = CFG.MODES[state.effectiveModeId];
    setPhase('question');
    state.escConfirmOpen = false;
    state.escPausedAt = 0;
    dom.escConfirm.hidden = true;

    dom.questionCounter.textContent = modeCfg.icon + ' ' + modeCfg.name + ' · SORU ' + (state.currentQ + 1) + '/' + CFG.QUESTIONS_PER_ROUND;
    dom.questionText.textContent = toUpperTR(q.text);
    dom.questionHint.hidden = false;
    dom.questionHint.textContent = modeCfg.hint;

    dom.signCard.classList.remove('entering');
    void dom.signCard.offsetWidth;
    dom.signCard.classList.add('entering');

    dom.infoBar.textContent = '';
    dom.infoBar.classList.remove('visible');
    dom.tierStrip.hidden = true;
    dom.inputRow.hidden = false;
    dom.passBtn.classList.remove('visible');
    state.skipShown = false;

    dom.answerInput.value = '';
    dom.answerInput.disabled = false;
    dom.submitBtn.disabled = false;
    dom.answerInput.focus();

    renderProgressBoxes();
    updateZoneBadge(false);

    if (!state.isUnlimited && !paramShot) {
      var existingRec = store.days[state.dayKey] && store.days[state.dayKey][state.modeId];
      var pendingStartedAt = (existingRec && existingRec.pending && existingRec.pending.idx === state.currentQ && typeof existingRec.pending.startedAt === 'number')
        ? existingRec.pending.startedAt
        : Date.now();
      persistPartialRound({ idx: state.currentQ, startedAt: pendingStartedAt });
    }

    state.lastWarnSec = -1;
    var roundMs = CFG.ROUND_SECONDS * 1000;
    if (state.pendingRemainingMs > 0) {
      roundMs = Math.min(roundMs, state.pendingRemainingMs);
      state.pendingRemainingMs = 0;
    }
    state.deadline = performance.now() + roundMs;
    dom.timerFill.classList.remove('warn');
    dom.timerText.classList.remove('warn');
    updateTimerLoop();

    if (paramAuto) {
      scheduleAutoAnswer(q);
    }
  }

  function scheduleAutoAnswer(q) {
    setTimeout(function () {
      if (state.phase !== 'question') return;
      var ansList = q.answers || [];
      var target = ansList[0];
      if (paramAuto === 'dip' && ansList.length > 0) {
        target = ansList[ansList.length - 1];
      } else if (paramAuto === 'orta' && ansList.length > 0) {
        target = ansList[Math.min(4, ansList.length - 1)];
      }
      if (target) {
        dom.answerInput.value = target.label;
        handleSubmit();
      }
    }, 350);
  }

  function clearTimers() {
    if (state.timerRaf) {
      cancelAnimationFrame(state.timerRaf);
      state.timerRaf = null;
    }
    if (state.revealTimer) {
      clearTimeout(state.revealTimer);
      state.revealTimer = null;
    }
    if (state.introTimer) {
      clearTimeout(state.introTimer);
      state.introTimer = null;
    }
    if (state.scoreAnimRaf) {
      cancelAnimationFrame(state.scoreAnimRaf);
      state.scoreAnimRaf = null;
    }
  }

  function showPassButton() {
    if (state.skipShown) return;
    state.skipShown = true;
    dom.passBtn.classList.add('visible');
  }

  function updateTimerLoop() {
    if (state.phase !== 'question') return;
    if (state.escConfirmOpen || document.hidden || state.hiddenAt > 0) {
      state.timerRaf = requestAnimationFrame(updateTimerLoop);
      return;
    }
    var now = performance.now();
    var remainingMs = Math.max(0, state.deadline - now);
    var elapsedSec = CFG.ROUND_SECONDS - remainingMs / 1000;
    var secLeft = Math.ceil(remainingMs / 1000);

    var ratio = remainingMs / (CFG.ROUND_SECONDS * 1000);
    dom.timerFill.style.width = Math.max(0, Math.min(100, ratio * 100)) + '%';
    dom.timerText.textContent = String(secLeft);
    dom.timerTrack.setAttribute('aria-valuenow', String(secLeft));

    if (!state.skipShown && elapsedSec >= CFG.SKIP_AFTER_SECONDS) {
      showPassButton();
    }

    if (secLeft <= CFG.WARN_SECONDS && secLeft > 0) {
      dom.timerFill.classList.add('warn');
      dom.timerText.classList.add('warn');
      if (state.lastWarnSec !== secLeft) {
        state.lastWarnSec = secLeft;
        if (root.Sound) root.Sound.play('tick');
      }
    }

    if (remainingMs <= 0) {
      handleTimeout();
      return;
    }
    state.timerRaf = requestAnimationFrame(updateTimerLoop);
  }

  function showInfoBar(msg) {
    dom.infoBar.textContent = '• ' + msg;
    dom.infoBar.classList.add('visible');
  }

  function handleSubmit() {
    if (state.phase !== 'question') return;
    var raw = dom.answerInput.value.trim();
    if (!raw) {
      dom.answerInput.classList.remove('shake');
      void dom.answerInput.offsetWidth;
      dom.answerInput.classList.add('shake');
      return;
    }

    var q = state.questions[state.currentQ];
    var res = root.Matcher ? root.Matcher.matchAnswer(raw, q) : { type: 'none' };

    if (res.type === 'invalid') {
      showInfoBar(res.reason || 'Bu cevap listede yer almıyor.');
      if (root.Sound) root.Sound.play('wrong');
      showPassButton();
      dom.answerInput.select();
      return;
    }

    if (res.type === 'none') {
      showInfoBar('Bunu listede bulamadım. Başka türlü yaz ya da başka bir cevap dene.');
      if (root.Sound) root.Sound.play('wrong');
      showPassButton();
      dom.answerInput.select();
      return;
    }

    // Geçerli cevap
    var modeCfg = CFG.MODES[state.effectiveModeId];
    var rank = res.index + 1;
    var share = res.answer.share;
    var tier = evalTier(modeCfg, rank, share);
    enterReveal({
      q: q,
      raw: raw,
      matched: res.answer,
      rank: rank,
      tier: tier,
      soundName: tier.id === 'mukemmel' ? 'perfect' : (tier.effect === 'weak' ? 'weak' : 'correct')
    });
  }

  function handlePass() {
    if (state.phase !== 'question' || !state.skipShown) return;
    if (root.Sound) root.Sound.play('click');
    enterReveal({
      q: state.questions[state.currentQ],
      raw: '',
      matched: null,
      rank: 0,
      tier: CFG.PASS_TIER,
      soundName: null
    });
  }

  function handleTimeout() {
    if (state.phase !== 'question') return;
    enterReveal({
      q: state.questions[state.currentQ],
      raw: '',
      matched: null,
      rank: 0,
      tier: CFG.TIMEOUT_TIER,
      soundName: 'timeout'
    });
  }

  function animateScoreTo(targetScore) {
    var startScore = state.displayedScore;
    var startTime = performance.now();
    var dur = 600;
    function step(now) {
      var t = Math.min(1, (now - startTime) / dur);
      state.displayedScore = Math.round(startScore + (targetScore - startScore) * t);
      dom.totalScore.textContent = state.displayedScore + ' PUAN';
      if (t < 1) {
        state.scoreAnimRaf = requestAnimationFrame(step);
      } else {
        state.displayedScore = targetScore;
        dom.totalScore.textContent = targetScore + ' PUAN';
      }
    }
    state.scoreAnimRaf = requestAnimationFrame(step);
  }

  function persistPartialRound(pending) {
    if (state.isUnlimited) return;
    if (!store.days[state.dayKey]) store.days[state.dayKey] = {};
    var rec = {
      done: false,
      results: state.results.slice()
    };
    if (pending && typeof pending.idx === 'number' && typeof pending.startedAt === 'number') {
      rec.pending = { idx: pending.idx, startedAt: pending.startedAt };
    }
    store.days[state.dayKey][state.modeId] = rec;
    saveStore();
  }

  function shiftPendingStartedAt(pauseMs) {
    if (state.isUnlimited || paramShot || !(pauseMs > 0)) return;
    var rec = store.days[state.dayKey] && store.days[state.dayKey][state.modeId];
    if (rec && rec.pending && rec.pending.idx === state.currentQ && typeof rec.pending.startedAt === 'number') {
      persistPartialRound({ idx: state.currentQ, startedAt: rec.pending.startedAt + Math.round(pauseMs) });
    }
  }

  function enterReveal(ctx) {
    if (state.timerRaf) {
      cancelAnimationFrame(state.timerRaf);
      state.timerRaf = null;
    }
    setPhase('reveal');

    var tier = ctx.tier;
    state.totalScore += tier.points;
    state.results[state.currentQ] = {
      qid: ctx.q.id,
      raw: ctx.raw,
      label: ctx.matched ? ctx.matched.label : '',
      rank: ctx.rank,
      share: ctx.matched ? ctx.matched.share : 0,
      tierId: tier.id,
      tierLabel: tier.label,
      tierColor: tier.color,
      tierIcon: tier.icon,
      tierEmoji: tier.emoji,
      points: tier.points
    };

    persistPartialRound();
    renderProgressBoxes();
    animateScoreTo(state.totalScore);

    dom.inputRow.hidden = true;
    dom.infoBar.classList.remove('visible');
    dom.passBtn.classList.remove('visible');
    dom.tierStrip.hidden = false;
    dom.tierStrip.style.backgroundColor = safeColor(tier.color);
    dom.tierStrip.innerHTML =
      '<span>' + escapeHtml(tier.icon) + ' ' + escapeHtml(tier.label) + '</span>' +
      '<span>+' + (Number(tier.points) || 0) + ' PUAN</span>';

    if (ctx.soundName && root.Sound) {
      root.Sound.play(ctx.soundName);
    }

    var zoneChanged = false;
    if (root.Scene) {
      if (typeof root.Scene.effect === 'function') {
        root.Scene.effect(tier.effect);
      }
      if (typeof root.Scene.setScore === 'function') {
        var scRes = root.Scene.setScore(state.totalScore, { instant: false });
        if (scRes && scRes.zoneChanged) {
          zoneChanged = true;
        }
      }
    }
    if (state.currentQ >= CFG.QUESTIONS_PER_ROUND - 1) {
      finalizeRound();
    }
    updateZoneBadge(zoneChanged);

    var waitMs = paramAuto ? 250 : (zoneChanged ? 2600 : CFG.REVEAL_MS);
    state._pendingResultCtx = ctx;
    state.revealTimer = setTimeout(function () {
      showResult(ctx);
    }, waitMs);
  }

  function buildAnswersRows(q, matchedRank) {
    var answers = q.answers || [];
    var rows = [];
    var maxShare = answers.length ? answers[0].share : 1;

    if (state.effectiveModeId === 'zirve') {
      var top = answers.slice(0, 5);
      if (matchedRank > 5) {
        top = answers.slice(0, 4).concat([answers[matchedRank - 1]]);
      }
      rows = top.map(function (a) {
        var r = answers.indexOf(a) + 1;
        return { rank: r, answer: a, isMe: r === matchedRank };
      });
    } else if (state.effectiveModeId === 'dip') {
      // İlk 2 en çok verilen + en nadir 2 (oyuncu dışında) + oyuncu; gerekirse 3. sıra ile 5'e tamamla
      var dipSet = [];
      var pushUnique = function (a) { if (a && dipSet.indexOf(a) === -1) dipSet.push(a); };
      if (answers[0]) pushUnique(answers[0]);
      if (answers[1]) pushUnique(answers[1]);
      var rareAdded = 0;
      for (var k = answers.length - 1; k >= 0 && rareAdded < 2; k--) {
        if (k + 1 !== matchedRank && dipSet.indexOf(answers[k]) === -1) {
          pushUnique(answers[k]);
          rareAdded++;
        }
      }
      if (matchedRank > 0) pushUnique(answers[matchedRank - 1]);
      for (var m = 2; m < answers.length && dipSet.length < 5; m++) {
        pushUnique(answers[m]);
      }
      dipSet.sort(function (a, b) { return b.share - a.share; });
      rows = dipSet.map(function (a) {
        var r = answers.indexOf(a) + 1;
        return { rank: r, answer: a, isMe: r === matchedRank };
      });
    } else {
      // orta: 3..7. sıralar + oyuncu
      var midList = answers.slice(2, 7);
      if (matchedRank > 0 && (matchedRank < 3 || matchedRank > 7)) {
        midList.push(answers[matchedRank - 1]);
      }
      rows = midList.map(function (a) {
        var r = answers.indexOf(a) + 1;
        return { rank: r, answer: a, isMe: r === matchedRank };
      });
    }

    return { rows: rows, maxShare: maxShare };
  }

  function dipShortTag(tierId) {
    if (tierId === 'mukemmel') return 'MÜK';
    if (tierId === 'cokiyi') return 'ÇOK';
    if (tierId === 'iyi') return 'İYİ';
    if (tierId === 'idare') return 'İDR';
    return 'ZYF';
  }

  function showResult(ctx) {
    if (state.revealTimer) {
      clearTimeout(state.revealTimer);
      state.revealTimer = null;
    }
    setPhase('result');
    dom.questionHint.hidden = true;

    var tier = ctx.tier;
    var modeCfg = CFG.MODES[state.effectiveModeId];

    dom.resultPanel.classList.remove('gold-glow');
    dom.resultHeader.classList.remove('weak-shake');
    dom.resultHeader.style.backgroundColor = tier.color;
    dom.resultPoints.textContent = '+' + tier.points + ' PUAN';

    if (tier.id === 'mukemmel') {
      var lettersHtml = tier.label.split('').map(function (ch, idx) {
        var safe = ch === ' ' ? '&nbsp;' : ch;
        return '<span class="bounce-letter" style="animation-delay:' + (idx * 60) + 'ms">' + safe + '</span>';
      }).join('');
      dom.resultTier.innerHTML = '<span>' + tier.icon + '</span><span>' + lettersHtml + '</span>';
      void dom.resultPanel.offsetWidth;
      dom.resultPanel.classList.add('gold-glow');
    } else {
      dom.resultTier.textContent = tier.icon + ' ' + tier.label;
      if (tier.id === 'zayif') {
        void dom.resultHeader.offsetWidth;
        dom.resultHeader.classList.add('weak-shake');
      }
    }

    dom.resultSentence.textContent = buildResultSentence(
      state.effectiveModeId,
      tier,
      ctx.rank,
      ctx.matched ? ctx.matched.share : 0
    );

    dom.listTitle.textContent = modeCfg.listTitle;
    var built = buildAnswersRows(ctx.q, ctx.rank);
    var dipCfg = CFG.MODES.dip;
    dom.answersList.innerHTML = built.rows.map(function (item) {
      var pctW = Math.max(2, Math.round((item.answer.share / built.maxShare) * 100));
      var barColor = safeColor(item.isMe ? tier.color : '#5a5470');
      var tagHtml = '';
      if (state.effectiveModeId === 'dip') {
        var dt = evalTier(dipCfg, item.rank, item.answer.share);
        tagHtml = '<span class="dip-tag" style="background:' + safeColor(dt.color) + '">' + escapeHtml(dipShortTag(dt.id)) + '</span>';
      }
      var meSuffix = item.isMe ? ' (sen)' : '';
      return '<li class="ans-row' + (item.isMe ? ' me' : '') + '">' +
        '<span class="ans-label">' + tagHtml + item.rank + '. ' + escapeHtml(toUpperTR(item.answer.label)) + meSuffix + '</span>' +
        '<span class="ans-bar-wrap"><span class="ans-bar" style="display:block;width:' + pctW + '%;background:' + barColor + '"></span></span>' +
        '<span class="ans-pct">' + formatPct(item.answer.share) + '</span>' +
      '</li>';
    }).join('');

    var isLast = state.currentQ >= CFG.QUESTIONS_PER_ROUND - 1;
    dom.nextBtn.textContent = isLast ? 'PUANIMI GÖR ⏎' : 'SONRAKİ SORU ⏎';

    if (paramAuto) {
      setTimeout(function () {
        if (state.phase === 'result') advanceFromResult();
      }, 220);
    }
  }

  function advanceFromResult() {
    if (state.phase !== 'result') return;
    if (root.Sound) root.Sound.play('click');
    if (state.currentQ < CFG.QUESTIONS_PER_ROUND - 1) {
      state.currentQ++;
      startIntroThenQuestion();
    } else {
      finalizeRound();
      renderCinematic();
    }
  }

  function finalizeRound() {
    if (state.roundFinalized) return;
    state.roundFinalized = true;
    var zoneName = 'BOĞAZ';
    if (root.Scene && typeof root.Scene.getZoneInfo === 'function') {
      try {
        var zi = root.Scene.getZoneInfo();
        if (zi && zi.name) zoneName = zi.name;
      } catch (e) {}
    }

    if (state.isUnlimited) {
      store.stats.unlimitedRounds = (store.stats.unlimitedRounds || 0) + 1;
      saveStore();
      return;
    }

    if (!store.days[state.dayKey]) store.days[state.dayKey] = {};
    store.days[state.dayKey][state.modeId] = {
      done: true,
      score: state.totalScore,
      zoneName: zoneName,
      results: state.results.slice()
    };

    var st = store.stats;
    if (st.lastPlayedDay !== state.dayKey) {
      st.playedDays = (st.playedDays || 0) + 1;
      if (st.lastPlayedDay && DAILY) {
        var diff = DAILY.dayKeyToEpochDay(state.dayKey) - DAILY.dayKeyToEpochDay(st.lastPlayedDay);
        st.streak = diff === 1 ? (st.streak || 0) + 1 : 1;
      } else {
        st.streak = 1;
      }
      st.lastPlayedDay = state.dayKey;
      st.bestStreak = Math.max(st.bestStreak || 0, st.streak);
    }
    st.best[state.modeId] = Math.max(st.best[state.modeId] || 0, state.totalScore);
    saveStore();
  }

  // --- Sinematik & Özet ---
  function renderCinematic(skipFade) {
    if (!skipFade && state.phase === 'result' && dom.questionScreen && dom.questionScreen.classList.contains('active')) {
      dom.questionScreen.classList.add('fading');
      setTimeout(function () {
        dom.questionScreen.classList.remove('fading');
        renderCinematic(true);
      }, 400);
      return;
    }
    setPhase('cinematic');
    var info = { name: 'BOĞAZ', label: '±0 m' };
    if (root.Scene && typeof root.Scene.getZoneInfo === 'function') {
      try {
        var z = root.Scene.getZoneInfo();
        if (z && z.name) info = z;
      } catch (e) {}
    }
    dom.cineZone.textContent = info.name;
    dom.cineScore.textContent = state.totalScore + ' PUAN';
    dom.cineBadge.textContent = CFG.MODES[state.effectiveModeId].icon + ' ' + info.label;
    if (root.Sound) root.Sound.play('finish');

    if (paramAuto) {
      setTimeout(function () {
        if (state.phase === 'cinematic') renderSummary();
      }, 250);
    }
  }

  function buildShareText() {
    var mCfg = CFG.MODES[state.effectiveModeId];
    var emojis = state.results.map(function (r) { return r.tierEmoji || '⬜'; }).join('');
    var zoneName = 'BOĞAZ';
    if (!state.isUnlimited && store.days[state.dayKey] && store.days[state.dayKey][state.modeId]) {
      zoneName = store.days[state.dayKey][state.modeId].zoneName || zoneName;
    } else if (root.Scene && typeof root.Scene.getZoneInfo === 'function') {
      try {
        var z = root.Scene.getZoneInfo();
        if (z && z.name) zoneName = z.name;
      } catch (e) {}
    }

    if (state.isUnlimited) {
      return [
        'MARTI · SINIRSIZ (' + mCfg.name + ' ' + mCfg.icon + ')',
        emojis,
        state.totalScore + '/' + CFG.MAX_SCORE + ' · ' + zoneName
      ].join('\n');
    }

    return [
      'MARTI #' + state.dailySet.dayNumber + ' · ' + mCfg.name + ' ' + mCfg.icon + ' · ' + formatDateTR(state.dayKey),
      emojis,
      state.totalScore + '/' + CFG.MAX_SCORE + ' · ' + zoneName,
      '🔥 ' + (store.stats.streak || 1) + ' gün'
    ].join('\n');
  }

  function copyShareText() {
    var text = buildShareText();
    var onDone = function (ok) {
      dom.shareBtn.textContent = ok ? 'KOPYALANDI ✓' : 'KOPYALANAMADI';
      setTimeout(function () {
        dom.shareBtn.textContent = 'PAYLAŞ';
      }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { onDone(true); }, function () {
        onDone(fallbackCopy(text));
      });
    } else {
      onDone(fallbackCopy(text));
    }
  }

  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return !!ok;
    } catch (e) {
      return false;
    }
  }

  function renderSummary() {
    setPhase('summary');

    var titles = {
      zirve: 'BUGÜNÜN ZİRVESİ',
      dip: 'BUGÜNÜN DİBİ',
      orta: 'BUGÜNÜN ORTA KARARI',
      sinirsiz: 'SINIRSIZ TUR'
    };
    dom.summaryTitle.textContent = titles[state.modeId] || 'TUR ÖZETİ';
    dom.summaryScore.textContent = state.totalScore + '/' + CFG.MAX_SCORE + ' PUAN';

    if (state.isUnlimited) {
      dom.summaryStreak.textContent = '∞ SINIRSIZ MOD (' + CFG.MODES[state.effectiveModeId].name + ')';
    } else {
      var streak = store.stats.streak || 0;
      dom.summaryStreak.textContent = streak > 1 ? ('🔥 ' + streak + ' GÜNLÜK SERİ') : 'SERİN BAŞLIYOR';
    }

    dom.summaryList.innerHTML = state.questions.map(function (q, idx) {
      var r = state.results[idx] || { raw: '', label: '', tierLabel: 'PAS', tierColor: '#8a8698', points: 0 };
      var written = r.raw ? toUpperTR(r.raw) : '—';
      var matchPart = '';
      if (r.label && toUpperTR(r.label) !== written) {
        matchPart = ' <span class="sum-match">→ ' + escapeHtml(toUpperTR(r.label)) + '</span>';
      }
      return '<li class="sum-item">' +
        '<div class="sum-left">' +
          '<div class="sum-q">' + (idx + 1) + '. ' + escapeHtml(toUpperTR(q.text)) + '</div>' +
          '<div class="sum-ans">SEN: ' + escapeHtml(written) + matchPart + '</div>' +
        '</div>' +
        '<div class="sum-right" style="color:' + safeColor(r.tierColor) + '">' + escapeHtml(r.tierLabel) + ' +' + (Number(r.points) || 0) + '</div>' +
      '</li>';
    }).join('');

    var dayRec = store.days[state.dayKey] || {};
    var nextUnplayed = null;
    dom.summaryModes.innerHTML = CFG.MODE_ORDER.map(function (mId) {
      var m = CFG.MODES[mId];
      var rec = dayRec[mId];
      var done = rec && rec.done;
      if (!done && !nextUnplayed) nextUnplayed = mId;
      return '<div class="sum-mode-row' + (done ? ' done' : '') + '">' +
        '<span>' + m.icon + ' ' + m.name + '</span>' +
        '<span>' + (done ? '✓ ' + rec.score : '—') + '</span>' +
      '</div>';
    }).join('');

    if (nextUnplayed) {
      var nm = CFG.MODES[nextUnplayed];
      var shortHint = nextUnplayed === 'zirve' ? 'EN ÇOK VERİLEN CEVAP' : (nextUnplayed === 'dip' ? 'EN NADİR CEVAP' : 'ORTADAKİ CEVAP');
      dom.summaryNextBtn.disabled = false;
      dom.summaryNextBtn.textContent = 'SIRADAKİ: ' + nm.name + ' ' + nm.icon + ' — ' + shortHint;
      dom.summaryNextBtn.dataset.nextMode = nextUnplayed;
      dom.summaryUnlimitedBtn.hidden = true;
      dom.summaryNextBtn.focus();
    } else {
      dom.summaryNextBtn.disabled = true;
      dom.summaryNextBtn.textContent = 'YARIN YENİ SORULAR';
      dom.summaryNextBtn.dataset.nextMode = '';
      dom.summaryUnlimitedBtn.hidden = false;
      dom.summaryUnlimitedBtn.focus();
    }

    if (paramAuto) {
      state.autoDone = true;
      updateDebugBox();
      try {
        console.log('SHARE:\n' + buildShareText());
      } catch (e) {}
    }
  }

  // --- Klavye & Olaylar ---
  function bindEvents() {
    var unlockOnce = function () {
      if (root.Sound) root.Sound.unlock();
    };
    document.addEventListener('pointerdown', unlockOnce, { passive: true });
    document.addEventListener('keydown', unlockOnce, { passive: true });

    dom.soundBtn.addEventListener('click', toggleSound);

    dom.modeCards.addEventListener('click', function (e) {
      var card = e.target.closest('.mode-card');
      if (!card) return;
      if (root.Sound) root.Sound.play('click');
      startMode(card.dataset.mode);
    });

    dom.unlimitedCard.addEventListener('click', function (e) {
      var um = e.target.closest('.u-mode-btn');
      if (um) {
        store.unlimitedMode = um.dataset.umode;
        saveStore();
        if (root.Sound) root.Sound.play('click');
        renderMenu();
        return;
      }
      if (e.target.id === 'play-unlimited-btn') {
        if (root.Sound) root.Sound.play('click');
        startMode('sinirsiz');
      }
    });

    dom.submitBtn.addEventListener('click', handleSubmit);
    dom.passBtn.addEventListener('click', handlePass);
    dom.nextBtn.addEventListener('click', advanceFromResult);
    dom.cinematicScreen.addEventListener('click', function () {
      if (state.phase === 'cinematic') renderSummary();
    });
    dom.shareBtn.addEventListener('click', copyShareText);
    dom.menuBtn.addEventListener('click', function () {
      if (root.Sound) root.Sound.play('click');
      renderMenu();
    });
    dom.summaryNextBtn.addEventListener('click', function () {
      var nm = dom.summaryNextBtn.dataset.nextMode;
      if (nm) {
        if (root.Sound) root.Sound.play('click');
        startMode(nm);
      }
    });
    dom.summaryUnlimitedBtn.addEventListener('click', function () {
      if (root.Sound) root.Sound.play('click');
      startMode('sinirsiz');
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (state.phase === 'question' && !state.escConfirmOpen) {
          state.hiddenAt = performance.now();
        }
      } else {
        if (state.hiddenAt > 0) {
          if (state.phase === 'question' && !state.escConfirmOpen) {
            var pauseMs = performance.now() - state.hiddenAt;
            state.deadline += pauseMs;
            shiftPendingStartedAt(pauseMs);
          }
          state.hiddenAt = 0;
        }
        if (refreshDailyIfNeeded() && state.phase === 'menu') {
          renderMenu();
        }
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.repeat || e.isComposing) return;
      var activeTag = document.activeElement && document.activeElement.tagName;
      var inInput = activeTag === 'INPUT' || activeTag === 'TEXTAREA';
      var inButton = activeTag === 'BUTTON';

      if ((e.key === 'm' || e.key === 'M') && !inInput && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        toggleSound();
        return;
      }

      if (state.phase === 'menu') {
        if (e.key === '1') { startMode('zirve'); return; }
        if (e.key === '2') { startMode('dip'); return; }
        if (e.key === '3') { startMode('orta'); return; }
        if (e.key === '4') { startMode('sinirsiz'); return; }
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          state.menuFocusIdx = (state.menuFocusIdx + 1) % 4;
          renderMenu();
          return;
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          state.menuFocusIdx = (state.menuFocusIdx + 3) % 4;
          renderMenu();
          return;
        }
        if (e.key === 'Enter' && !inButton) {
          e.preventDefault();
          if (state.menuFocusIdx < 3) startMode(CFG.MODE_ORDER[state.menuFocusIdx]);
          else startMode('sinirsiz');
          return;
        }
      } else if (state.phase === 'question') {
        if (state.escConfirmOpen) {
          if (e.key === 'Enter') {
            e.preventDefault();
            clearTimers();
            state.escConfirmOpen = false;
            state.escPausedRemaining = 0;
            state.escPausedAt = 0;
            dom.escConfirm.hidden = true;
            renderMenu();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            state.escConfirmOpen = false;
            if (state.escPausedRemaining > 0) {
              state.deadline = performance.now() + state.escPausedRemaining;
              state.escPausedRemaining = 0;
            }
            if (state.escPausedAt > 0) {
              shiftPendingStartedAt(performance.now() - state.escPausedAt);
              state.escPausedAt = 0;
            }
            dom.escConfirm.hidden = true;
            dom.answerInput.focus();
          }
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          state.escConfirmOpen = true;
          state.escPausedRemaining = Math.max(0, state.deadline - performance.now());
          state.escPausedAt = performance.now();
          dom.escConfirm.hidden = false;
          return;
        }
        if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault();
          handlePass();
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmit();
          return;
        }
      } else if (state.phase === 'reveal') {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (state._pendingResultCtx) showResult(state._pendingResultCtx);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          clearTimers();
          renderMenu();
        }
      } else if (state.phase === 'result') {
        if (e.key === 'Enter') {
          e.preventDefault();
          advanceFromResult();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          renderMenu();
        }
      } else if (state.phase === 'cinematic') {
        if (e.key === 'Enter') {
          e.preventDefault();
          renderSummary();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          renderMenu();
        }
      } else if (state.phase === 'summary') {
        if (e.key === 'Escape') {
          e.preventDefault();
          renderMenu();
        } else if (e.key === 'Enter' && !inButton) {
          e.preventDefault();
          if (!dom.summaryNextBtn.disabled) {
            var nm = dom.summaryNextBtn.dataset.nextMode;
            if (nm) startMode(nm);
          } else {
            startMode('sinirsiz');
          }
        }
      }
    });
  }

  // --- Ekran Görüntüsü (?shot=...) ---
  function handleShotMode() {
    var parts = paramShot.split(':');
    var kind = parts[0];

    if (kind === 'zirve' || kind === 'dip' || kind === 'orta') {
      document.body.classList.add('shot');
      if (root.Scene && typeof root.Scene.debug === 'function') {
        root.Scene.debug({
          mode: kind,
          zoneIndex: parseInt(parts[1], 10) || 0,
          freezeTime: 2.0
        });
      }
      return;
    }

    if (kind === 'menu') {
      renderMenu();
      return;
    }

    if (kind === 'question') {
      state.modeId = 'zirve';
      state.effectiveModeId = 'zirve';
      state.questions = (state.dailySet.zirve || []).slice(0, CFG.QUESTIONS_PER_ROUND);
      state.currentQ = 0;
      sceneCall('setMode', 'zirve');
      beginQuestion();
      return;
    }

    if (kind === 'result') {
      var rMode = parts[1] || 'zirve';
      state.modeId = rMode;
      state.effectiveModeId = rMode;
      state.questions = (state.dailySet[rMode] || []).slice(0, CFG.QUESTIONS_PER_ROUND);
      state.currentQ = 0;
      var q = state.questions[0];
      var ans = q && q.answers ? q.answers[0] : { label: 'Çay', share: 36.4 };
      var tier = evalTier(CFG.MODES[rMode], 1, ans.share);
      state.totalScore = tier.points;
      state.displayedScore = tier.points;
      state.results = [{
        qid: q ? q.id : 'q01',
        raw: ans.label,
        label: ans.label,
        rank: 1,
        share: ans.share,
        tierId: tier.id,
        tierLabel: tier.label,
        tierColor: tier.color,
        tierIcon: tier.icon,
        tierEmoji: tier.emoji,
        points: tier.points
      }];
      sceneCall('setMode', rMode);
      sceneCall('setScore', state.totalScore, { instant: true });
      renderProgressBoxes();
      updateZoneBadge(false);
      showResult({ q: q, raw: ans.label, matched: ans, rank: 1, tier: tier });
      return;
    }

    if (kind === 'cine') {
      var cMode = parts[1] || 'zirve';
      state.modeId = cMode;
      state.effectiveModeId = cMode;
      state.totalScore = 480;
      sceneCall('setMode', cMode);
      sceneCall('setScore', 480, { instant: true });
      renderCinematic();
      return;
    }

    if (kind === 'end') {
      var eMode = parts[1] || 'zirve';
      state.modeId = eMode;
      state.effectiveModeId = eMode;
      state.questions = (state.dailySet[eMode] || []).slice(0, CFG.QUESTIONS_PER_ROUND);
      state.totalScore = 480;
      state.results = state.questions.map(function (qq) {
        var a = qq.answers[0];
        return {
          qid: qq.id, raw: a.label, label: a.label, rank: 1, share: a.share,
          tierId: 'mukemmel', tierLabel: 'MÜKEMMEL', tierColor: '#ffcc4d', tierIcon: '★', tierEmoji: '🟨', points: 100
        };
      });
      sceneCall('setMode', eMode);
      sceneCall('setScore', 480, { instant: true });
      renderSummary();
    }
  }

  // --- Başlatma ---
  function cacheDom() {
    dom.canvas = document.getElementById('scene');
    dom.logoCanvas = document.getElementById('logo');
    dom.soundBtn = document.getElementById('sound-btn');
    dom.menuScreen = document.getElementById('menu');
    dom.menuDay = document.getElementById('menu-day');
    dom.modeCards = document.getElementById('mode-cards');
    dom.unlimitedCard = document.getElementById('unlimited-card');
    dom.statsBar = document.getElementById('stats-bar');
    dom.introText = document.getElementById('intro-text');
    dom.questionScreen = document.getElementById('question');
    dom.zoneBadge = document.getElementById('zone-badge');
    dom.signCard = document.getElementById('sign-card');
    dom.progressBoxes = document.getElementById('progress-boxes');
    dom.totalScore = document.getElementById('total-score');
    dom.questionCounter = document.getElementById('question-counter');
    dom.questionText = document.getElementById('question-text');
    dom.questionHint = document.getElementById('question-hint');
    dom.timerTrack = document.getElementById('timer-track');
    dom.timerFill = document.getElementById('timer-fill');
    dom.timerText = document.getElementById('timer-text');
    dom.escConfirm = document.getElementById('esc-confirm');
    dom.passBtn = document.getElementById('pass-btn');
    dom.infoBar = document.getElementById('info-bar');
    dom.tierStrip = document.getElementById('tier-strip');
    dom.inputRow = document.getElementById('input-row');
    dom.answerInput = document.getElementById('answer-input');
    dom.submitBtn = document.getElementById('submit-btn');
    dom.resultScreen = document.getElementById('result');
    dom.resultPanel = document.getElementById('result-panel');
    dom.resultHeader = document.getElementById('result-header');
    dom.resultTier = document.getElementById('result-tier');
    dom.resultPoints = document.getElementById('result-points');
    dom.resultSentence = document.getElementById('result-sentence');
    dom.listTitle = document.getElementById('list-title');
    dom.answersList = document.getElementById('answers-list');
    dom.nextBtn = document.getElementById('next-btn');
    dom.cinematicScreen = document.getElementById('cinematic');
    dom.cineZone = document.getElementById('cine-zone');
    dom.cineScore = document.getElementById('cine-score');
    dom.cineBadge = document.getElementById('cine-badge');
    dom.summaryScreen = document.getElementById('summary');
    dom.summaryTitle = document.getElementById('summary-title');
    dom.summaryScore = document.getElementById('summary-score');
    dom.summaryStreak = document.getElementById('summary-streak');
    dom.summaryList = document.getElementById('summary-list');
    dom.summaryModes = document.getElementById('summary-modes');
    dom.summaryNextBtn = document.getElementById('summary-next-btn');
    dom.summaryUnlimitedBtn = document.getElementById('summary-unlimited-btn');
    dom.shareBtn = document.getElementById('share-btn');
    dom.menuBtn = document.getElementById('menu-btn');
    dom.debugBox = document.getElementById('debug-box');
    var missingDom = Object.keys(dom).filter(function (k) { return !dom[k]; });
    if (missingDom.length > 0) {
      console.error('Eksik DOM elemanı:', missingDom.join(', '));
    }
  }

  function init() {
    cacheDom();
    store = loadStore();

    if (root.Sound) {
      root.Sound.setEnabled(store.sound);
    }
    updateSoundButton();

    state.dayKey = getTodayKey();
    state.dailySet = DAILY
      ? DAILY.getDailySet(state.dayKey, root.QUESTIONS || [])
      : { dayKey: state.dayKey, dayNumber: 1, zirve: [], dip: [], orta: [] };

    if (root.Scene) {
      if (typeof root.Scene.init === 'function') {
        root.Scene.init(dom.canvas);
      }
      if (typeof root.Scene.onZoneEnter === 'function') {
        root.Scene.onZoneEnter(function (z) {
          updateZoneBadge(true, z);
        });
      }
    }

    bindEvents();
    updateDebugBox();

    if (paramShot) {
      handleShotMode();
      return;
    }

    if (paramAuto && (CFG.MODES[paramAuto] || paramAuto === 'sinirsiz')) {
      startMode(paramAuto);
      return;
    }

    renderMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : globalThis);
