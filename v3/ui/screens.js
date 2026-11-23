/* PUSULLA görsel katman — tur özeti, günlük özet + paylaş, istatistik. */
(function (global) {
  'use strict';
  var P = global.PUSULLA;
  var ui = P && P.ui;
  if (!ui) return;
  var U = ui.util, h = U.h;
  var els = {};
  var cur = { modeId: null, daily: false, idx: 0, timeout: false };
  var day = { legs: {}, rows: [] };
  var LEGS = ['yaygin', 'nadir', 'eski', 'yeni'];
  var ARROW = { yaygin: '↑', nadir: '↓', eski: '←', yeni: '→', karma: '✦' };

  function cfgLegs() { var c = U.cfg(); return (c && c.DAILY_LEGS) || LEGS; }
  function header(title) {
    return h('header', { class: 'top' }, [
      h('div', { class: 'brand' }, [U.brandGlyph ? U.brandGlyph() : null, 'PUSULLA']),
      h('div', { class: 'date', text: title }),
      h('div')
    ]);
  }
  function foot(items) {
    return h('footer', { class: 'keys' }, items.map(function (it) { return h('span', null, [U.kbd(it[0]), it[1]]); }));
  }
  function btn(cls, label, key, fn) {
    return h('button', { class: 'btn ' + cls, type: 'button', onclick: fn }, key ? [label, U.kbd(key)] : [label]);
  }
  function focusFirst(box) {
    var b = box.querySelector('.btn');
    if (b) { try { b.focus({ preventScroll: true }); } catch (e) { b.focus(); } }
  }
  function squares(tiers, n) {
    var row = h('span', { class: 'tsq', 'aria-hidden': 'true' });
    for (var i = 0; i < (n || 5); i++) {
      var t = tiers[i];
      row.appendChild(h('i', t ? { style: 'background:var(--tier-' + t + ')', class: 'on' } : null));
    }
    return row;
  }
  function isRealAnswer(a) { return a && a.charAt(0) !== '(' && a !== '—'; }

  /* ---------- tur özeti ---------- */
  function renderRound(d) {
    var box = U.clear(els.sumBody);
    var id = d.modeId || cur.modeId || 'rota';
    ui.root.style.setProperty('--accent', 'var(--mode-' + id + ')');
    var rows = d.rows || [];
    var tiers = rows.map(function (r) { return r.tierId || 'zayif'; });
    U.append(box, [
      h('div', { class: 'sum-head' }, [
        h('div', null, [
          h('div', { class: 'over', style: 'color:var(--mode-' + id + ')', text: (ARROW[id] ? ARROW[id] + ' ' : '') + U.upper(U.modeInfo(id).name || '') + ' · TUR BİTTİ' }),
          h('div', { class: 'big-score' }, [String(d.score || 0), h('small', { text: ' / ' + (d.max || 500) })])
        ]),
        squares(tiers, Math.max(5, rows.length))
      ])
    ]);
    var table = h('div', { class: 'rows', role: 'table', 'aria-label': 'Tur özeti' });
    table.appendChild(h('div', { class: 'row row--head', role: 'row' }, ['#', 'KONU', 'CEVABIN', 'KATMAN', 'PUAN'].map(function (t) { return h('span', { role: 'columnheader', text: t }); })));
    rows.forEach(function (r, i) {
      var t = r.tierId || 'zayif';
      table.appendChild(h('div', { class: 'row', role: 'row' }, [
        h('span', { class: 'n', text: String(i + 1) }),
        h('span', { class: 'subj', text: r.subject || '' }),
        h('span', { class: 'ans' + (isRealAnswer(r.answer) ? '' : ' ans--none'), text: r.answer || '—' }),
        h('span', { class: 'tier', style: 'color:var(--tier-' + t + ')' }, [h('i', { style: 'background:var(--tier-' + t + ')' }), U.tierLabel(t)]),
        h('span', { class: 'p', text: String(r.points || 0) })
      ]));
    });
    if (rows.length) box.appendChild(table);
    var acts = [btn('btn-primary', 'MENÜ', '↵', function () { U.act('toMenu'); })];
    if (!cur.daily && id && id !== 'rota') acts.push(btn('btn-ghost', 'TEKRAR OYNA', null, function () { U.act('selectMode', id); }));
    box.appendChild(h('div', { class: 'acts' }, acts));
  }

  /* ---------- günlük özet ---------- */
  function renderDay(d) {
    var box = U.clear(els.sumBody);
    ui.root.style.setProperty('--accent', 'var(--mode-rota)');
    var status = h('span', { class: 'note', 'aria-live': 'polite' });
    var grid = h('div', { class: 'day-grid' });
    cfgLegs().forEach(function (id) {
      var tiers = day.legs[id] || [];
      grid.appendChild(h('div', { class: 'day-leg' }, [
        h('span', { class: 'ar', style: 'color:var(--mode-' + id + ')', text: ARROW[id] || '' }),
        h('span', { class: 'nm', text: U.modeInfo(id).name || id }),
        squares(tiers, 5)
      ]));
    });
    var best = day.rows.filter(function (r) { return isRealAnswer(r.answer); })
      .sort(function (a, b) { return (b.points || 0) - (a.points || 0); }).slice(0, 3);
    U.append(box, [
      h('div', { class: 'sum-head' }, [
        h('div', null, [
          h('div', { class: 'over', text: 'GÜNÜN ROTASI TAMAM' }),
          h('div', { class: 'big-score' }, [String(d.score || 0), h('small', { text: ' / ' + (d.max || 2000) })]),
          h('div', { class: 'sub', text: 'Seri ' + (d.streak || 0) + ' gün' })
        ]),
        grid
      ])
    ]);
    if (best.length) {
      box.appendChild(h('div', { class: 'over over--dim', text: 'BUGÜNÜN EN İYİ CEVAPLARIN' }));
      var list = h('div', { class: 'best-list' });
      best.forEach(function (r) {
        var t = r.tierId || 'tam';
        list.appendChild(h('div', { class: 'best' }, [
          h('i', { style: 'background:var(--tier-' + t + ')' }),
          h('span', { class: 'b-subj', text: r.subject || '' }),
          h('b', { text: r.answer || '' }),
          h('span', { class: 'b-p', text: '+' + (r.points || 0) })
        ]));
      });
      box.appendChild(list);
    }
    if (d.shareText) {
      box.appendChild(h('div', { class: 'over over--dim', text: 'PAYLAŞIM (CEVAPLAR GİZLİ)' }));
      box.appendChild(h('pre', { class: 'share', text: String(d.shareText) }));
    }
    box.appendChild(h('div', { class: 'acts' }, [
      btn('btn-primary', 'PANOYA KOPYALA', '↵', function () { U.act('copyShare'); status.textContent = 'Panoya kopyalandı.'; }),
      btn('btn-ghost', 'MENÜ', 'Esc', function () { U.act('toMenu'); }),
      status
    ]));
    day = { legs: {}, rows: [] };
  }

  /* ---------- istatistik ---------- */
  function renderStats(d) {
    var box = U.clear(els.statBody);
    ui.root.style.setProperty('--accent', 'var(--mode-rota)');
    var s = d && d.stats ? d.stats : (d || {});
    function pick() { for (var i = 0; i < arguments.length; i++) if (s[arguments[i]] !== undefined && s[arguments[i]] !== null) return s[arguments[i]]; return null; }
    var tiles = [
      ['OYNANAN GÜN', pick('playedDays', 'played')],
      ['SERİ', pick('streak')],
      ['EN UZUN SERİ', pick('bestStreak')],
      ['EN İYİ GÜN', pick('bestDayScore', 'best')]
    ].filter(function (t) { return t[1] !== null; });
    box.appendChild(h('div', { class: 'over', text: 'İSTATİSTİK' }));
    box.appendChild(h('div', { class: 'stat-grid', style: 'grid-template-columns:repeat(' + Math.max(1, tiles.length) + ',1fr)' }, tiles.map(function (t) {
      return h('div', null, [h('span', { class: 'over', text: t[0] }), h('b', { text: String(t[1]) })]);
    })));

    // mod ortalamaları
    var totals = s.modeTotals || {}, counts = s.modeCounts || {};
    var modes = cfgLegs().concat(['karma']).filter(function (m) { return counts[m]; });
    if (modes.length) {
      box.appendChild(h('div', { class: 'over over--dim', text: 'MOD ORTALAMASI (SORU BAŞI, /100)' }));
      var mlist = h('div', { class: 'mbars' });
      modes.forEach(function (m) {
        var avg = Math.round((totals[m] || 0) / counts[m]);
        mlist.appendChild(h('div', { class: 'mbar' }, [
          h('span', { class: 'nm', style: 'color:var(--mode-' + m + ')', text: (ARROW[m] || '') + ' ' + (U.modeInfo(m).name || m) }),
          h('span', { class: 'pr-bar' }, [h('i', { style: 'width:' + Math.max(2, Math.min(100, avg)) + '%;background:var(--mode-' + m + ')' })]),
          h('span', { class: 'v', text: String(avg) })
        ]));
      });
      box.appendChild(mlist);
    }
    // katman dağılımı
    var tc = s.tierCounts;
    if (tc) {
      var sum = 0, order = ['tam', 'cokyakin', 'yakin', 'uzak', 'zayif'];
      order.forEach(function (t) { sum += +tc[t] || 0; });
      if (sum) {
        box.appendChild(h('div', { class: 'over over--dim', text: 'KATMAN DAĞILIMI' }));
        var bar = h('div', { class: 'tierbar', role: 'img', 'aria-label': order.map(function (t) { return U.tierLabel(t) + ' ' + (tc[t] || 0); }).join(', ') });
        var legend = h('div', { class: 'tierleg' });
        order.forEach(function (t) {
          var n = +tc[t] || 0;
          if (n) bar.appendChild(h('i', { style: 'flex:' + n + ';background:var(--tier-' + t + ')' }));
          legend.appendChild(h('span', null, [h('i', { style: 'background:var(--tier-' + t + ')' }), U.tierLabel(t) + ' ' + n]));
        });
        box.appendChild(bar);
        box.appendChild(legend);
      }
    }
    if (!modes.length && !tc) box.appendChild(h('p', { class: 'sub', text: 'Mod ortalamaları ve katman dağılımı, birkaç tur oynadıktan sonra burada görünür.' }));
    var reps = (s.reports !== undefined && s.reports !== null) ? s.reports : null;
    box.appendChild(h('div', { class: 'acts' }, [
      btn('btn-primary', 'MENÜ', '↵', function () { U.act('toMenu'); }),
      ui.parts.overlay ? btn('btn-ghost', 'BİLDİRİMLERİM' + (reps !== null ? ' (' + reps + ')' : ''), null, function () { ui.parts.overlay.open('reports'); }) : null
    ]));
  }

  function keyToMenu(e) {
    var tag = e.target && e.target.tagName;
    if (e.key === 'Escape') { e.preventDefault(); U.act('toMenu'); return; }
    if ((e.key === 'Enter' || e.code === 'NumpadEnter') && tag !== 'BUTTON') { e.preventDefault(); var b = global.document.querySelector('.scr:not([hidden]) .acts .btn'); if (b) b.click(); }
  }

  ui.parts.summary = {
    init: function (sec) {
      els.sumBody = h('div', { class: 'sum' });
      els.sumTitle = h('div');
      U.append(sec, [header('ÖZET'), h('main', { class: 'center' }, [els.sumBody]), foot([['↵', 'seçili düğme'], ['Esc', 'menü']])]);
    },
    onShow: function () { focusFirst(els.sumBody); },
    onKey: keyToMenu,
    events: {
      'mode:start': function (d) {
        d = d || {};
        cur.modeId = d.modeId; cur.daily = !!d.daily; cur.idx = 0; cur.timeout = false;
        if (cur.daily && d.modeId) day.legs[d.modeId] = [];
      },
      'question:show': function (d) { cur.idx = (d && d.index) || 0; cur.timeout = false; cur.pass = false; },
      'answer:pass': function () { cur.pass = true; if (cur.daily && day.legs[cur.modeId]) day.legs[cur.modeId][cur.idx] = 'pas'; },
      'answer:timeout': function () { cur.timeout = true; },
      'result:show': function (d) {
        if (!cur.daily || !day.legs[cur.modeId]) return;
        day.legs[cur.modeId][cur.idx] = cur.pass ? 'pas' : (cur.timeout ? 'sure' : ((d && d.tierId) || 'zayif'));
      },
      'round:end': function (d) {
        d = d || {};
        if (cur.daily) (d.rows || []).forEach(function (r) { day.rows.push(r); });
        renderRound(d); ui.show('summary');
      },
      'day:complete': function (d) { renderDay(d || {}); ui.show('summary'); }
    }
  };

  ui.parts.stats = {
    init: function (sec) {
      els.statBody = h('div', { class: 'sum' });
      U.append(sec, [header('İSTATİSTİK'), h('main', { class: 'center' }, [els.statBody]), foot([['↵', 'seçili düğme'], ['Esc', 'menü']])]);
    },
    onShow: function () { focusFirst(els.statBody); },
    onKey: keyToMenu,
    events: {
      'stats:show': function (d) { renderStats(d || {}); ui.show('stats'); }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
