(function (global) {
  'use strict';

  var P = (global.PUSULLA = global.PUSULLA || {});

  // Görsel katman zaten kendi UI'sini kaydettiyse stub devreye girmez
  if (P.ui && P.ui.name && P.ui.name !== 'stub') {
    return;
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function hasQueryFlag(flag) {
    try {
      if (!global.location || !global.location.search) return false;
      var re = new RegExp('(?:^\\?|&)' + flag + '(?:=|&|$)');
      return re.test(global.location.search);
    } catch (e) {
      return false;
    }
  }

  var rootEl = null;
  var mainEl = null;
  var debugEl = null;
  var debugListEl = null;

  var viewState = {
    phase: 'menu',
    modes: [],
    dailyProgress: {},
    best: 0,
    streak: 0,
    question: null,
    timer: { left: 30, total: 30, warn: false },
    feedback: null,
    confirm: null,
    canReport: false,
    result: null,
    era: { eraId: 'simdi', year: null },
    roundEnd: null,
    dayComplete: null,
    stats: null
  };

  var lastArrowKey = null;
  var lastArrowTs = 0;

  function getKeymap() {
    if (P.config && P.config.KEYMAP && typeof P.config.KEYMAP === 'object') {
      return P.config.KEYMAP;
    }
    return {};
  }

  function callAction(name, arg) {
    if (P.actions && typeof P.actions[name] === 'function') {
      return P.actions[name](arg);
    }
    return undefined;
  }

  function modeColorVar(modeId) {
    var map = {
      yaygin: 'var(--mode-yaygin, #f2c14e)',
      nadir: 'var(--mode-nadir, #9b7be0)',
      eski: 'var(--mode-eski, #c8875a)',
      yeni: 'var(--mode-yeni, #4fc3c7)',
      klasik: 'var(--mode-klasik, #c29b61)',
      gundem: 'var(--mode-gundem, #9ad39b)',
      antika: 'var(--mode-antika, #b4849a)',
      kesif: 'var(--mode-kesif, #749fd3)',
      karma: 'var(--mode-karma, #8899aa)'
    };
    return map[modeId] || 'inherit';
  }

  function tierColorVar(tierId) {
    var map = {
      tam: 'var(--tier-tam, #7bc96f)',
      cokyakin: 'var(--tier-cokyakin, #a3d977)',
      yakin: 'var(--tier-yakin, #f2c14e)',
      uzak: 'var(--tier-uzak, #e59866)',
      zayif: 'var(--tier-zayif, #e2685c)'
    };
    return map[tierId] || 'inherit';
  }

  function renderMenu() {
    var menuModes = [
      { id: 'yaygin', label: 'YAYGIN', group: 'normal', dir: 'K ↑' },
      { id: 'nadir', label: 'NADİR', group: 'normal', dir: 'G ↓' },
      { id: 'eski', label: 'EN ESKİ', group: 'normal', dir: 'B ←' },
      { id: 'yeni', label: 'EN YENİ', group: 'normal', dir: 'D →' },
      { id: 'karma', label: 'KARMA', group: 'karma', dir: '✦' }
    ];

    var normalHtml = '';
    var karmaHtml = '';
    for (var i = 0; i < menuModes.length; i++) {
      var m = menuModes[i];
      var prog = viewState.dailyProgress && viewState.dailyProgress[m.id] !== undefined
        ? ' (' + escapeHtml(viewState.dailyProgress[m.id]) + '/5)'
        : '';
      var btn = '<button type="button" data-action="selectMode" data-mode="' + escapeHtml(m.id) + '" ' +
        'style="border-left: 4px solid ' + modeColorVar(m.id) + '; margin: 4px; padding: 8px 12px;">' +
        escapeHtml((m.dir ? m.dir + ' ' : '') + m.label) + prog +
        '</button>';
      if (m.group === 'karma') {
        karmaHtml += btn;
      } else {
        normalHtml += btn;
      }
    }

    return '' +
      '<section data-screen="menu">' +
        '<h1>PUSULLA (Stub UI)</h1>' +
        '<p>Seri: <strong>' + escapeHtml(viewState.streak) + '</strong> | En İyi: <strong>' + escapeHtml(viewState.best) + '</strong></p>' +
        '<div>' +
          '<button type="button" data-action="startDaily" style="padding: 10px 16px; font-weight: bold;">GÜNÜN ROTASI (4×5)</button> ' +
          '<button type="button" data-action="showStats" style="padding: 10px 12px;">İSTATİSTİKLER</button>' +
        '</div>' +
        '<h3>NORMAL MODLAR</h3>' +
        '<div>' + normalHtml + '</div>' +
        '<h3>KARMA MOD</h3>' +
        '<div>' + karmaHtml + '</div>' +
      '</section>';
  }

  function renderQuestion() {
    var q = viewState.question;
    if (!q) return '<p>Soru yükleniyor...</p>';

    var boxes = '';
    for (var i = 0; i < (q.total || 5); i++) {
      var mark = i < q.index ? '■' : (i === q.index ? '▣' : '□');
      boxes += '<span style="margin-right:4px;">' + mark + '</span>';
    }

    var warnStyle = viewState.timer.warn ? 'color: var(--bad, #e2685c); font-weight:bold;' : '';
    var fbHtml = '';
    if (viewState.feedback) {
      fbHtml = '<p style="color: var(--bad, #e2685c);">' + escapeHtml(viewState.feedback) + '</p>';
    }
    if (viewState.canReport) {
      fbHtml += '<p><button type="button" data-action="report">HAVUZDA YOK → BİLDİR</button></p>';
    }

    var confirmHtml = '';
    if (viewState.confirm) {
      confirmHtml = '' +
        '<div data-confirm="true" style="border: 1px solid #999; padding: 8px; margin: 8px 0;">' +
          '<p>Şunu mu demek istedin? <strong>' + escapeHtml(viewState.confirm.label || viewState.confirm.suggestion) + '</strong></p>' +
          '<button type="button" data-action="confirmYes">Evet, kabul et</button> ' +
          '<button type="button" data-action="confirmNo">Hayır (yanlış sayılır)</button>' +
        '</div>';
    }

    var subLabel = q.subModeId && q.subModeId !== q.modeId ? ' (' + String(q.subModeId).toUpperCase() + ')' : '';
    var hintHtml = q.stubHint
      ? '<p><small>Stub ipucu: ' + escapeHtml(q.stubHint) + '</small></p>'
      : '';

    return '' +
      '<section data-screen="question">' +
        '<div>' +
          '<strong style="color:' + modeColorVar(q.modeId) + ';">' + escapeHtml(String(q.modeId).toUpperCase() + subLabel) + '</strong> | ' +
          'Soru ' + escapeHtml((q.index || 0) + 1) + '/' + escapeHtml(q.total || 5) + ' ' + boxes + ' | ' +
          '<span data-timer="true" style="' + warnStyle + '">Süre: ' + escapeHtml(Math.ceil(viewState.timer.left)) + ' sn</span>' +
        '</div>' +
        '<h2>' + escapeHtml(q.text) + '</h2>' +
        '<p><small>Kapsam: ' + escapeHtml(q.scope || '-') + ' | Havuz: ' + escapeHtml(q.poolSize || 0) + ' aday' + (q.closed ? ' (kapalı)' : ' (açık)') + '</small></p>' +
        hintHtml +
        '<form data-form="answer">' +
          '<input type="text" id="stub-answer-input" autocomplete="off" placeholder="Cevabını yaz..." style="padding:6px; width:260px;"> ' +
          '<button type="submit">GÖNDER</button> ' +
          '<button type="button" data-action="pass">GEÇ</button> ' +
          '<button type="button" data-action="toMenu">MENÜ</button>' +
        '</form>' +
        fbHtml +
        confirmHtml +
      '</section>';
  }

  function renderResult() {
    var r = viewState.result;
    if (!r) return '<p>Sonuç yok.</p>';

    var p = r.player || {};
    var bestHtml = '';
    if (r.best && r.best.length) {
      bestHtml = '<ul>';
      for (var i = 0; i < r.best.length; i++) {
        var b = r.best[i];
        bestHtml += '<li>' + escapeHtml(b.label) +
          (b.year !== null && b.year !== undefined ? ' (' + escapeHtml(b.year) + ')' : '') +
          (b.share !== undefined && b.share !== null ? ' — %' + escapeHtml(b.share) : '') +
          '</li>';
      }
      bestHtml += '</ul>';
    }

    // Zaman şeridi metni ve pay listesi metni
    var dots = r.dots || [];
    var timeDots = dots.filter(function (d) { return d.year !== null && d.year !== undefined; })
      .sort(function (a, b) { return a.year - b.year; });
    var timelineHtml = '';
    if (timeDots.length) {
      var tParts = [];
      for (var ti = 0; ti < Math.min(timeDots.length, 10); ti++) {
        var td = timeDots[ti];
        tParts.push(td.year + ': ' + td.label + (td.isPlayer ? ' ★' : ''));
      }
      timelineHtml = '<p><small><strong>Zaman Şeridi:</strong> ' + escapeHtml(tParts.join(' → ')) + '</small></p>';
    }

    var popDots = dots.filter(function (d) { return d.share !== null && d.share !== undefined; })
      .sort(function (a, b) { return b.share - a.share; });
    var shareListHtml = '';
    if (popDots.length) {
      var pParts = [];
      for (var pi = 0; pi < Math.min(popDots.length, 10); pi++) {
        var pd = popDots[pi];
        pParts.push(pd.label + ' (%' + pd.share + ')' + (pd.isPlayer ? ' ★' : ''));
      }
      shareListHtml = '<p><small><strong>Pay Listesi:</strong> ' + escapeHtml(pParts.join(', ')) + '</small></p>';
    }

    var playerMeta = [];
    if (p.year !== null && p.year !== undefined) playerMeta.push('Yıl: ' + p.year);
    if (p.share !== null && p.share !== undefined) playerMeta.push('Pay (tahmini): %' + p.share);
    else if (r.modeId === 'nadir' && r.points === 100) playerMeta.push('Pay listesinde yok (çok nadir → tam puan)');
    if (p.rankT) playerMeta.push('Zaman sırası: #' + p.rankT);
    if (p.rankP) playerMeta.push('Pay sırası: #' + p.rankP);

    return '' +
      '<section data-screen="result">' +
        '<h2 style="color:' + tierColorVar(r.tierId) + ';">Katman: ' + escapeHtml(String(r.tierId).toUpperCase()) + ' — ' + escapeHtml(r.points) + ' puan</h2>' +
        '<p>Senin cevabın: <strong>' + escapeHtml(p.label || '-') + '</strong>' +
          (playerMeta.length ? ' (' + escapeHtml(playerMeta.join(' · ')) + ')' : '') +
        '</p>' +
        '<p><small>Dönem: ' + escapeHtml(viewState.era.eraId) + (viewState.era.year !== null && viewState.era.year !== undefined ? ' (' + escapeHtml(viewState.era.year) + ')' : '') + ' | Havuz: ' + escapeHtml(r.poolSize || 0) + ' aday</small></p>' +
        '<h4>Hedef / En İyi Cevaplar</h4>' +
        bestHtml +
        timelineHtml +
        shareListHtml +
        '<div>' +
          '<button type="button" data-action="next" style="padding:8px 14px; font-weight:bold;">SONRAKİ</button> ' +
          '<button type="button" data-action="report">YANLIŞ / EKSİK BİLDİR</button> ' +
          '<button type="button" data-action="toMenu">MENÜ</button>' +
        '</div>' +
      '</section>';
  }

  function renderSummary() {
    var re = viewState.roundEnd;
    var dc = viewState.dayComplete;
    var html = '<section data-screen="summary">';

    if (dc) {
      html += '<h2>GÜNÜN ROTASI TAMAMLANDI!</h2>' +
        '<p>Toplam Puan: <strong>' + escapeHtml(dc.score) + ' / ' + escapeHtml(dc.max) + '</strong> | Seri: ' + escapeHtml(dc.streak) + '</p>' +
        '<pre style="background:#f4f4f4; padding:8px;">' + escapeHtml(dc.shareText) + '</pre>' +
        '<button type="button" data-action="copyShare">PAYLAŞIMI KOPYALA</button> ';
    } else if (re) {
      html += '<h2>TUR BİTTİ (' + escapeHtml(String(re.modeId).toUpperCase()) + ')</h2>' +
        '<p>Tur Puanı: <strong>' + escapeHtml(re.score) + ' / ' + escapeHtml(re.max) + '</strong></p>';
      if (re.rows && re.rows.length) {
        html += '<ol>';
        for (var i = 0; i < re.rows.length; i++) {
          var row = re.rows[i];
          html += '<li>' + escapeHtml(row.subject) + ': ' + escapeHtml(row.answer || '-') + ' → ' + escapeHtml(row.points) + ' p</li>';
        }
        html += '</ol>';
      }
    }

    html += '<div style="margin-top:10px;"><button type="button" data-action="toMenu">MENÜYE DÖN</button></div>';
    html += '</section>';
    return html;
  }

  function renderStats() {
    var s = viewState.stats || {};
    return '' +
      '<section data-screen="stats">' +
        '<h2>İSTATİSTİKLER</h2>' +
        '<ul>' +
          '<li>Oynanan Gün: <strong>' + escapeHtml(s.playedDays || 0) + '</strong></li>' +
          '<li>Güncel Seri: <strong>' + escapeHtml(s.streak || 0) + '</strong> (En İyi: ' + escapeHtml(s.bestStreak || 0) + ')</li>' +
          '<li>En İyi Gün Puanı: <strong>' + escapeHtml(s.bestDayScore || 0) + '</strong></li>' +
          '<li>Kaydedilen Bildirim: <strong>' + escapeHtml(s.reportsCount || 0) + '</strong></li>' +
        '</ul>' +
        '<pre>' + escapeHtml(JSON.stringify(s, null, 2)) + '</pre>' +
        '<button type="button" data-action="toMenu">MENÜYE DÖN</button>' +
      '</section>';
  }

  function render() {
    if (!mainEl) return;
    var html = '';
    if (viewState.phase === 'menu') html = renderMenu();
    else if (viewState.phase === 'question') html = renderQuestion();
    else if (viewState.phase === 'result') html = renderResult();
    else if (viewState.phase === 'summary') html = renderSummary();
    else if (viewState.phase === 'stats') html = renderStats();
    mainEl.innerHTML = html;

    if (viewState.phase === 'question' && !viewState.confirm) {
      var input = global.document.getElementById('stub-answer-input');
      if (input && typeof input.focus === 'function') {
        input.focus();
      }
    }
  }

  function appendDebugLine(name, data) {
    if (!debugListEl) return;
    var li = global.document.createElement('li');
    li.textContent = name + ' ' + JSON.stringify(data || {});
    debugListEl.appendChild(li);
  }

  function setupDebugPanel() {
    if (!hasQueryFlag('debug') || !rootEl) return;
    debugEl = global.document.createElement('aside');
    debugEl.id = 'debug-panel';
    debugEl.style.cssText = 'margin-top:24px; border-top:2px solid #ccc; padding-top:8px; font-family:monospace; font-size:12px;';

    var header = global.document.createElement('div');
    header.innerHTML = '<strong>DEBUG OLAY GÜNLÜĞÜ</strong> ';

    if (P.game && typeof P.game.runMockTour === 'function') {
      var tourBtn = global.document.createElement('button');
      tourBtn.type = 'button';
      tourBtn.textContent = 'Tüm Olayları Tetikle';
      tourBtn.addEventListener('click', function () {
        P.game.runMockTour();
      });
      header.appendChild(tourBtn);
    }

    debugListEl = global.document.createElement('ol');
    debugListEl.style.maxHeight = '260px';
    debugListEl.style.overflow = 'auto';

    debugEl.appendChild(header);
    debugEl.appendChild(debugListEl);
    rootEl.appendChild(debugEl);

    if (P.events && typeof P.events.getLog === 'function') {
      var existing = P.events.getLog();
      for (var i = 0; i < existing.length; i++) {
        appendDebugLine(existing[i].name, existing[i].data);
      }
    }
  }

  function bindEvents() {
    var bus = P.events || P.bus;
    if (!bus) return;

    bus.on('*', function (data, name) {
      appendDebugLine(name, data);
    });

    bus.on('app:ready', function (d) {
      viewState.modes = (d && d.modes) || [];
    });

    bus.on('menu:show', function (d) {
      viewState.phase = 'menu';
      viewState.dailyProgress = (d && d.dailyProgress) || {};
      viewState.best = (d && d.best) || 0;
      viewState.streak = (d && d.streak) || 0;
      viewState.roundEnd = null;
      viewState.dayComplete = null;
      render();
    });

    bus.on('mode:start', function () {
      viewState.roundEnd = null;
      viewState.dayComplete = null;
    });

    bus.on('question:show', function (d) {
      viewState.phase = 'question';
      viewState.question = d;
      viewState.feedback = null;
      viewState.confirm = null;
      viewState.canReport = false;
      viewState.timer = { left: 30, total: 30, warn: false };
      render();
    });

    bus.on('timer:tick', function (d) {
      if (viewState.phase !== 'question') return;
      viewState.timer.left = d.left;
      viewState.timer.total = d.total;
      viewState.timer.warn = d.left <= 5;
      var span = mainEl && mainEl.querySelector('[data-timer="true"]');
      if (span) {
        span.textContent = 'Süre: ' + Math.ceil(d.left) + ' sn';
        if (viewState.timer.warn) {
          span.style.color = 'var(--bad, #e2685c)';
          span.style.fontWeight = 'bold';
        }
      }
    });

    bus.on('timer:warn', function () {
      viewState.timer.warn = true;
    });

    bus.on('answer:invalid', function (d) {
      viewState.feedback = (d && d.reason) || 'Geçersiz giriş.';
      viewState.confirm = null;
      viewState.canReport = false;
      render();
    });

    bus.on('answer:none', function (d) {
      viewState.feedback = '"' + ((d && d.raw) || '') + '" havuzda bulunamadı.';
      viewState.confirm = null;
      viewState.canReport = !!(d && d.canReport);
      render();
    });

    bus.on('answer:confirm', function (d) {
      viewState.confirm = d;
      viewState.feedback = null;
      render();
    });

    bus.on('report:saved', function (d) {
      viewState.feedback = 'Bildirimin kaydedildi (toplam: ' + ((d && d.count) || 1) + ').';
      viewState.canReport = false;
      render();
    });

    bus.on('era:change', function (d) {
      viewState.era = d || { eraId: 'simdi', year: null };
    });

    bus.on('result:show', function (d) {
      viewState.phase = 'result';
      viewState.result = d;
      viewState.confirm = null;
      render();
    });

    bus.on('round:end', function (d) {
      viewState.phase = 'summary';
      viewState.roundEnd = d;
      render();
    });

    bus.on('day:complete', function (d) {
      viewState.phase = 'summary';
      viewState.dayComplete = d;
      render();
    });

    bus.on('stats:show', function (d) {
      viewState.phase = 'stats';
      viewState.stats = d;
      render();
    });
  }

  function bindDomInput() {
    if (!rootEl) return;

    rootEl.addEventListener('click', function (ev) {
      var target = ev.target;
      if (!target || !target.getAttribute) return;
      var action = target.getAttribute('data-action');
      if (!action) return;

      if (action === 'selectMode') {
        callAction('selectMode', target.getAttribute('data-mode'));
      } else if (action === 'startDaily') {
        callAction('startDaily');
      } else if (action === 'showStats') {
        callAction('showStats');
      } else if (action === 'pass') {
        callAction('pass');
      } else if (action === 'toMenu') {
        callAction('toMenu');
      } else if (action === 'next') {
        callAction('next');
      } else if (action === 'report') {
        callAction('report');
      } else if (action === 'copyShare') {
        callAction('copyShare');
      } else if (action === 'confirmYes') {
        callAction('confirmSuggestion', true);
      } else if (action === 'confirmNo') {
        callAction('confirmSuggestion', false);
      }
    });

    rootEl.addEventListener('submit', function (ev) {
      var form = ev.target;
      if (!form || form.getAttribute('data-form') !== 'answer') return;
      ev.preventDefault();
      var input = global.document.getElementById('stub-answer-input');
      callAction('submit', input ? input.value : '');
    });

    global.document.addEventListener('keydown', function (ev) {
      var tag = ev.target && ev.target.tagName ? ev.target.tagName.toUpperCase() : '';
      var inInput = tag === 'INPUT' || tag === 'TEXTAREA';
      var km = getKeymap();

      if (ev.key === 'Escape') {
        callAction('toMenu');
        return;
      }

      if (inInput) return;

      if (viewState.phase === 'result' && (ev.key === 'Enter' || ev.key === ' ')) {
        ev.preventDefault();
        callAction('next');
        return;
      }

      if (viewState.phase === 'menu') {
        var now = Date.now();
        var mapped = null;
        if (km.arrows && km.arrows[ev.key]) {
          if (lastArrowKey && lastArrowKey !== ev.key && (now - lastArrowTs) <= (km.COMBO_MS || 250)) {
            var comboKey = lastArrowKey + '+' + ev.key;
            if (km.arrowCombos && km.arrowCombos[comboKey]) {
              mapped = 'karma';
            }
          }
          if (!mapped) mapped = km.arrows[ev.key];
          lastArrowKey = ev.key;
          lastArrowTs = now;
        } else if (km.numpad && km.numpad[ev.code]) {
          mapped = km.numpad[ev.code];
        } else if (km.wasd && km.wasd[ev.code]) {
          mapped = km.wasd[ev.code];
        }

        if (mapped) {
          if (mapped === 'rota') {
            callAction('startDaily');
          } else {
            if (mapped === 'klasik' || mapped === 'gundem' || mapped === 'antika' || mapped === 'kesif') {
              mapped = 'karma';
            }
            callAction('focusMode', mapped);
          }
        }
      }
    });
  }

  P.ui = {
    name: 'stub',
    mount: function (el) {
      rootEl = el;
      rootEl.innerHTML = '';
      mainEl = global.document.createElement('div');
      mainEl.id = 'stub-main';
      rootEl.appendChild(mainEl);
      setupDebugPanel();
      bindEvents();
      bindDomInput();
      render();
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
