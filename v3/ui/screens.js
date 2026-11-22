/* PUSULLA görsel katman — tur özeti, günlük özet, istatistik (aşama 2: işlevsel temel; aşama 4'te genişler). */
(function (global) {
  'use strict';
  var ui = global.PUSULLA && global.PUSULLA.ui;
  if (!ui) return;
  var U = ui.util, h = U.h;
  var els = {}, lastMode = null;

  function header(title) {
    return h('header', { class: 'top' }, [
      h('div', { class: 'brand' }, [U.brandGlyph ? U.brandGlyph() : null, 'PUSULLA']),
      h('div', { class: 'date', text: title }),
      h('div')
    ]);
  }
  function foot() {
    return h('footer', { class: 'keys' }, [h('span', null, [U.kbd('↵'), 'menü']), h('span', null, [U.kbd('Esc'), 'menü'])]);
  }
  function menuBtn() {
    return h('button', { class: 'btn btn-primary', type: 'button', onclick: function () { U.act('toMenu'); } }, ['MENÜ', U.kbd('↵')]);
  }
  function focusFirst(box) {
    var b = box.querySelector('.btn');
    if (b) { try { b.focus({ preventScroll: true }); } catch (e) { b.focus(); } }
  }
  function keyToMenu(e) {
    var tag = e.target && e.target.tagName;
    if (e.key === 'Escape') { e.preventDefault(); U.act('toMenu'); return; }
    if ((e.key === 'Enter' || e.code === 'NumpadEnter') && tag !== 'BUTTON') { e.preventDefault(); U.act('toMenu'); }
  }

  function renderRound(d) {
    var box = U.clear(els.sumBody);
    var id = d.modeId || lastMode || 'rota';
    ui.root.style.setProperty('--accent', 'var(--mode-' + id + ')');
    var rows = d.rows || [];
    U.append(box, [
      h('div', { class: 'over', style: 'color:var(--mode-' + id + ')', text: U.upper(U.modeInfo(id).name || '') + ' · TUR BİTTİ' }),
      h('div', { class: 'big-score' }, [String(d.score || 0), h('small', { text: ' / ' + (d.max || 500) })])
    ]);
    var table = h('div', { class: 'rows', role: 'table', 'aria-label': 'Tur özeti' });
    rows.forEach(function (r, i) {
      var t = r.tierId || 'zayif';
      table.appendChild(h('div', { class: 'row', role: 'row' }, [
        h('span', { class: 'n', text: String(i + 1) }),
        h('span', { class: 'subj', text: r.subject || '' }),
        h('span', { class: 'ans', text: r.answer || '—' }),
        h('span', { class: 'tier', style: 'color:var(--tier-' + t + ')' }, [h('i', { style: 'background:var(--tier-' + t + ')' }), U.tierLabel(t)]),
        h('span', { class: 'p', text: String(r.points || 0) })
      ]));
    });
    if (rows.length) box.appendChild(table);
    var again = (id && id !== 'rota') ? h('button', { class: 'btn btn-ghost', type: 'button', onclick: function () { U.act('selectMode', id); } }, ['TEKRAR OYNA']) : null;
    box.appendChild(h('div', { class: 'acts' }, [menuBtn(), again]));
  }

  function renderDay(d) {
    var box = U.clear(els.sumBody);
    ui.root.style.setProperty('--accent', 'var(--mode-rota)');
    var status = h('span', { class: 'note', 'aria-live': 'polite' });
    U.append(box, [
      h('div', { class: 'over', style: 'color:var(--mode-rota)', text: 'GÜNÜN ROTASI TAMAM' }),
      h('div', { class: 'big-score' }, [String(d.score || 0), h('small', { text: ' / ' + (d.max || 2000) })]),
      h('p', { class: 'sub', text: 'Seri ' + (d.streak || 0) + ' gün' }),
      d.shareText ? h('pre', { class: 'share', text: String(d.shareText) }) : null,
      h('div', { class: 'acts' }, [
        h('button', { class: 'btn btn-primary', type: 'button', onclick: function () { U.act('copyShare'); status.textContent = 'Panoya kopyalandı.'; } }, ['PAYLAŞ', U.kbd('↵')]),
        h('button', { class: 'btn btn-ghost', type: 'button', onclick: function () { U.act('toMenu'); } }, ['MENÜ']),
        status
      ])
    ]);
  }

  var STAT_LABELS = [['played', 'Oynanan tur'], ['best', 'En iyi'], ['streak', 'Seri (gün)'], ['reports', 'Bildirimlerim']];
  function renderStats(d) {
    var box = U.clear(els.statBody);
    ui.root.style.setProperty('--accent', 'var(--mode-rota)');
    U.append(box, h('div', { class: 'over', text: 'İSTATİSTİK' }));
    var grid = h('div', { class: 'stat-grid' });
    STAT_LABELS.forEach(function (s) {
      if (d[s[0]] === undefined || d[s[0]] === null) return;
      grid.appendChild(h('div', null, [h('span', { class: 'over', text: U.upper(s[1]) }), h('b', { text: String(d[s[0]]) })]));
    });
    box.appendChild(grid);
    box.appendChild(h('div', { class: 'acts' }, [menuBtn()]));
  }

  ui.parts.summary = {
    init: function (sec) {
      els.sumBody = h('div', { class: 'sum' });
      U.append(sec, [header('ÖZET'), h('main', { class: 'center' }, [els.sumBody]), foot()]);
    },
    onShow: function () { focusFirst(els.sumBody); },
    onKey: function (e) {
      var tag = e.target && e.target.tagName;
      if (tag === 'BUTTON' && (e.key === 'Enter' || e.code === 'Space')) return;
      keyToMenu(e);
    },
    events: {
      'mode:start': function (d) { lastMode = d && d.modeId; },
      'round:end': function (d) { renderRound(d || {}); ui.show('summary'); },
      'day:complete': function (d) { renderDay(d || {}); ui.show('summary'); }
    }
  };

  ui.parts.stats = {
    init: function (sec) {
      els.statBody = h('div', { class: 'sum' });
      U.append(sec, [header('İSTATİSTİK'), h('main', { class: 'center' }, [els.statBody]), foot()]);
    },
    onShow: function () { focusFirst(els.statBody); },
    onKey: keyToMenu,
    events: {
      'stats:show': function (d) { renderStats(d || {}); ui.show('stats'); }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
