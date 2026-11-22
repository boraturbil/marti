/* PUSULLA görsel katman — soru ekranı: süre cetveli, ilerleme kutuları, cevap, geri bildirim, sonuç paneli. */
(function (global) {
  'use strict';
  var P = global.PUSULLA;
  var ui = P && P.ui;
  if (!ui) return;
  var U = ui.util, h = U.h;

  var els = {}, badge = null;
  var st = {
    modeId: null, daily: false, index: 0, total: 5, tiers: [], closed: false,
    sub: 'input', passOpen: false, lastValid: null, flyTimer: null, asOf: null
  };

  function cfgNum(k, d) { var c = U.cfg(); return (c && typeof c[k] === 'number') ? c[k] : d; }

  /* ---------- başlık ---------- */
  function renderHead() {
    var id = st.modeId || 'rota';
    var info = U.modeInfo(id);
    ui.root.style.setProperty('--accent', 'var(--mode-' + id + ')');
    els.modeName.textContent = U.upper(info.name || id);
    els.modeHint.textContent = info.hint || '';
    els.dailyTag.hidden = !st.daily;
    if (badge) badge.setMode(id === 'karma' ? null : id);
    els.badgeWrap.setAttribute('data-karma', id === 'karma' ? '1' : '0');
  }

  function renderPips() {
    U.clear(els.pips);
    for (var i = 0; i < st.total; i++) {
      var t = st.tiers[i];
      var cls = 'pip' + (t ? ' done' : '') + (!t && i === st.index ? ' now' : '');
      els.pips.appendChild(h('span', {
        class: cls, style: t ? 'background:var(--tier-' + t + ')' : null,
        'aria-label': (i + 1) + '. soru' + (t ? ': ' + U.tierLabel(t) : (i === st.index ? ' (şimdi)' : '')),
        text: String(i + 1)
      }));
    }
    els.qNum.textContent = String(Math.min(st.index + 1, st.total));
    els.qTot.textContent = ' / ' + st.total;
  }

  function renderScore() {
    var s = 0;
    try { s = (P.state && P.state.get && P.state.get().score) || 0; } catch (e) { s = 0; }
    els.score.textContent = String(s);
  }

  /* ---------- soru metni ---------- */
  function renderQuestion(d) {
    var text = String(d.text || ''), subj = String(d.subject || '');
    U.clear(els.qline);
    var at = subj ? text.indexOf(subj) : -1;
    var len = subj.length;
    els.qline.className = 'q-line' + (len > 22 ? ' q-xl' : len > 13 ? ' q-l' : '');
    if (at >= 0) {
      var pre = text.slice(0, at).trim(), post = text.slice(at + len).trim();
      if (pre) els.qline.appendChild(h('span', { class: 'q-pre', text: pre }));
      els.qline.appendChild(subjectNode(subj));
      if (post) els.qline.appendChild(h('span', { class: 'q-post', text: post }));
    } else {
      els.qline.appendChild(subjectNode(text || subj));
    }
    var bits = [];
    bits.push(d.closed ? 'Kapalı küme' : 'Açık küme');
    if (d.scope) bits.push(String(d.scope));
    U.clear(els.scope);
    bits.forEach(function (b, i) { if (i) els.scope.appendChild(h('i', { class: 'sep', text: '·' })); els.scope.appendChild(h('span', { text: b })); });
    if (d.poolSize) {
      els.scope.appendChild(h('i', { class: 'sep', text: '·' }));
      els.scope.appendChild(h('span', null, ['havuzda ', h('b', { text: String(d.poolSize) }), ' aday']));
    }
  }

  // konu: piksel yazı (canvas, aria-hidden) + ekran okuyucu için gizli metin; eksik glif varsa düz metin
  function subjectNode(str) {
    var pf = ui.parts.pixfont;
    var wrap = h('span', { class: 'subj' }, [h('span', { class: 'sr', text: str })]);
    if (!pf || pf.missing(str).length) { wrap.appendChild(h('span', { class: 'subj-txt', 'aria-hidden': 'true', text: str })); return wrap; }
    var MAXW = 760, words = String(str).split(/\s+/), lines = [str];
    var w1 = pf.measure(str, 1).w;
    if (w1 * 4 > MAXW && words.length > 1) {
      var best = null;
      for (var i = 1; i < words.length; i++) {
        var a = words.slice(0, i).join(' '), b = words.slice(i).join(' ');
        var m = Math.max(pf.measure(a, 1).w, pf.measure(b, 1).w);
        if (!best || m < best.m) best = { m: m, l: [a, b] };
      }
      lines = best.l;
    }
    var lw = 0;
    lines.forEach(function (l) { lw = Math.max(lw, pf.measure(l, 1).w); });
    var scale = Math.max(2, Math.min(6, Math.floor(MAXW / (lw + 2))));
    var cv = global.document.createElement('canvas');
    cv.width = lw + 3; cv.height = lines.length * 11 + 2;
    cv.className = 'subj-cv';
    cv.setAttribute('aria-hidden', 'true');
    var c = cv.getContext('2d');
    c.imageSmoothingEnabled = false;
    lines.forEach(function (l, i) {
      var w = pf.measure(l, 1).w;
      pf.draw(c, l, 1 + Math.round((lw - w) / 2), i * 11, { color: '#fff1d6', outline: '#1a1128', shadow: '#5a2a5e' });
    });
    cv.setAttribute('data-scale', String(scale));
    cv.style.width = (cv.width * scale) + 'px';
    cv.style.height = (cv.height * scale) + 'px';
    wrap.appendChild(cv);
    return wrap;
  }

  /* ---------- geri bildirim ---------- */
  function addFb(node) {
    els.fbs.insertBefore(node, els.fbs.firstChild);
    while (els.fbs.children.length > 3) els.fbs.removeChild(els.fbs.lastChild);
  }
  function dropConfirm() {
    var c = els.fbs.querySelector('.fb--confirm');
    if (c) c.parentNode.removeChild(c);
  }
  function q(s) { return h('q', { text: s }); }

  function setSub(sub) {
    st.sub = sub;
    els.main.setAttribute('data-sub', sub);
    renderKeys();
  }

  function openPass() {
    if (st.passOpen) return;
    st.passOpen = true;
    els.pass.disabled = false;
    els.passNote.textContent = '';
  }

  function renderKeys() {
    U.clear(els.keys);
    var items;
    if (st.sub === 'confirm') items = [[['↵'], 'evet'], [['Esc'], 'hayır, düzelt']];
    else if (st.sub === 'result') items = [[['↵'], st.index + 1 >= st.total ? 'turu bitir' : 'sonraki soru'], [['Esc'], 'menü']];
    else items = [[['↵'], 'gönder'], [['Tab'], 'düğmelere geç'], [['Esc'], 'menü']];
    items.forEach(function (it) {
      els.keys.appendChild(h('span', null, it[0].map(U.kbd).concat([it[1]])));
    });
  }

  /* ---------- sonuç ---------- */
  function fy(y, approx) {
    var c = ui.parts.charts;
    return c && c._fmtYear ? c._fmtYear(y, approx) : String(y);
  }
  function renderResult(d) {
    var R = U.clear(els.result);
    var tier = d.tierId || 'zayif';
    var pts = +d.points || 0;
    var player = d.player || {};
    var timedOut = st.lastTimeout;
    var head = h('div', { class: 'res-head' }, [
      h('div', { class: 'res-tier', style: 'color:var(--tier-' + tier + ')' }, [
        h('span', { class: 'res-dot', style: 'background:var(--tier-' + tier + ')' }),
        timedOut ? 'SÜRE DOLDU' : U.tierLabel(tier)
      ]),
      h('div', { class: 'res-pts' }, ['+' + pts, h('small', { text: ' puan' })])
    ]);
    R.appendChild(head);

    var line = h('p', { class: 'res-line' });
    if (timedOut || !player.label || player.label === '—') {
      line.appendChild(h('span', { text: 'Bu soruda cevap yok.' }));
    } else {
      line.appendChild(h('span', { class: 'res-ans', text: player.label }));
      var meta = [];
      if (player.year !== null && player.year !== undefined) meta.push(fy(player.year, player.approx));
      if (player.share !== null && player.share !== undefined) meta.push('%' + player.share + ' tahmini pay');
      else if (d.kind === 'pop' && d.modeId === 'nadir') meta.push('listede yok: çok nadir');
      if (meta.length) line.appendChild(h('span', { class: 'res-meta', text: meta.join(' · ') }));
    }
    R.appendChild(line);
    var lv = st.lastValid;
    if (lv && lv.fuzzy && lv.raw) {
      R.appendChild(h('p', { class: 'res-note' }, [q(lv.raw), ' → ', h('b', { text: lv.label }), ' olarak sayıldı.']));
    }
    var best = (d.best && d.best[0]) || null;
    if (best && best.label && best.label !== player.label) {
      R.appendChild(h('p', { class: 'res-note' }, ['Hedefteki cevap: ', h('b', { text: best.label }), best.year !== null && best.year !== undefined ? ' (' + fy(best.year, best.approx) + ')' : '']));
    }
    // sonuçta grafiğe yer aç: konu yazısını en çok 3 kata indir
    var scv = els.qline.querySelector('.subj-cv');
    if (scv) {
      var k = Math.min(3, +scv.getAttribute('data-scale') || 3);
      scv.style.width = (scv.width * k) + 'px';
      scv.style.height = (scv.height * k) + 'px';
    }
    els.chart = h('div', { class: 'res-chart', 'data-kind': d.kind || '' });
    R.appendChild(els.chart);
    if (ui.parts.charts && typeof ui.parts.charts.render === 'function') ui.parts.charts.render(els.chart, d);
    var last = st.index + 1 >= st.total;
    var nextBtn = h('button', { class: 'btn btn-primary', type: 'button', onclick: function () { U.act('next'); } }, [last ? 'TURU BİTİR' : 'SONRAKİ', U.kbd('↵')]);
    R.appendChild(h('div', { class: 'res-acts' }, [
      nextBtn,
      d.poolSize ? h('span', { class: 'res-pool', text: 'havuzda ' + d.poolSize + ' aday' }) : null
    ]));
    setSub('result');
    try { nextBtn.focus({ preventScroll: true }); } catch (e) { nextBtn.focus(); }
  }

  /* ---------- menüden rozete uçuş ---------- */
  function fly() {
    var menu = ui.parts.menu && ui.parts.menu.roseEl && ui.parts.menu.roseEl();
    if (!menu || U.reducedMotion()) return;
    var from = menu.getBoundingClientRect(), to = els.badgeWrap.getBoundingClientRect();
    if (!from.width || !to.width) return;
    var clone;
    if (menu.tagName === 'CANVAS') {
      clone = global.document.createElement('canvas');
      clone.width = menu.width; clone.height = menu.height;
      var cc = clone.getContext('2d');
      cc.imageSmoothingEnabled = false;
      cc.drawImage(menu, 0, 0);
    } else {
      clone = menu.cloneNode(true);
    }
    clone.setAttribute('aria-hidden', 'true');
    clone.classList.add('rose-fly');
    clone.style.left = from.left + 'px'; clone.style.top = from.top + 'px';
    clone.style.width = from.width + 'px'; clone.style.height = from.height + 'px';
    ui.root.appendChild(clone);
    els.badgeWrap.style.opacity = '0';
    var s = menu.tagName === 'CANVAS' ? to.width / (from.width * 152 / menu.width) : (to.width / 500) / (from.width / 664);
    var dx = (to.left + to.width / 2) - (from.left + from.width / 2);
    var dy = (to.top + to.height / 2) - (from.top + from.height / 2);
    global.requestAnimationFrame(function () {
      global.requestAnimationFrame(function () {
        clone.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')';
        clone.style.opacity = '0.2';
      });
    });
    st.flyTimer = global.setTimeout(endFly, 420);
    st.flyClone = clone;
  }
  function endFly() {
    if (st.flyTimer) global.clearTimeout(st.flyTimer);
    st.flyTimer = null;
    if (st.flyClone && st.flyClone.parentNode) st.flyClone.parentNode.removeChild(st.flyClone);
    st.flyClone = null;
    if (els.badgeWrap) els.badgeWrap.style.opacity = '';
  }

  function focusInput() {
    try { els.input.focus({ preventScroll: true }); } catch (e) { els.input.focus(); }
  }

  ui.parts.question = {
    init: function (sec) {
      els.badgeWrap = h('div', { class: 'mini', 'aria-hidden': 'true' });
      els.modeName = h('b');
      els.modeHint = h('span');
      els.dailyTag = h('em', { class: 'daily-tag', text: 'GÜNÜN ROTASI', hidden: true });
      els.pips = h('div', { class: 'pips', role: 'list', 'aria-label': 'Tur ilerlemesi' });
      els.qNum = h('span', { text: '1' });
      els.qTot = h('small', { text: ' / 5' });
      els.score = h('b', { text: '0' });
      var top = h('header', { class: 'qtop top' }, [
        h('div', { class: 'modebadge' }, [els.badgeWrap, h('div', null, [h('div', { class: 'mb-name' }, [els.modeName, els.dailyTag]), els.modeHint])]),
        els.pips,
        h('div', { class: 'qstats' }, [
          h('div', null, [h('span', { class: 'over', text: 'SORU' }), h('b', null, [els.qNum, els.qTot])]),
          h('div', null, [h('span', { class: 'over', text: 'PUAN' }), els.score])
        ])
      ]);

      els.fill = h('div', { class: 'fill' });
      els.secs = h('span', { text: '30' });
      els.timer = h('div', { class: 'timer', role: 'timer', 'aria-label': 'Kalan süre' }, [
        h('div', { class: 'track' }, [els.fill]),
        h('div', { class: 'secs' }, [els.secs, h('small', { text: 'sn' })])
      ]);

      els.qline = h('div', { class: 'q-line' });
      els.scope = h('div', { class: 'scope' });
      els.input = h('input', { type: 'text', autocomplete: 'off', spellcheck: 'false', maxlength: '80', 'aria-label': 'Cevabın', placeholder: 'Cevabını yaz…' });
      els.input.addEventListener('input', function () {
        if (st.sub === 'confirm') { dropConfirm(); setSub('input'); }
      });
      var send = h('button', { class: 'btn btn-ghost', type: 'button', onclick: function () { submit(); } }, ['GÖNDER', U.kbd('↵')]);
      els.answer = h('div', { class: 'answer' }, [els.input, send]);
      els.pass = h('button', { class: 'btn-text', type: 'button', disabled: true, onclick: function () { U.act('pass'); } }, ['GEÇ']);
      els.passNote = h('span', { class: 'note' });
      els.aux = h('div', { class: 'aux' }, [
        h('span', null, [els.pass, els.passNote]),
        h('span', { text: 'Türkçe karakter şart değil' })
      ]);
      els.fbs = h('div', { class: 'fbs', 'aria-live': 'polite' });
      els.result = h('div', { class: 'result', 'aria-live': 'polite' });
      els.body = h('div', { class: 'qbody' }, [
        h('div', { class: 'q' }, [els.qline, els.scope]),
        h('div', { class: 'qinput' }, [els.answer, els.aux, els.fbs]),
        els.result
      ]);
      els.main = h('main', { class: 'qmain', 'data-sub': 'input' }, [els.timer, els.body]);
      els.keys = h('footer', { class: 'keys' });
      U.append(sec, [top, els.main, els.keys]);
      badge = ui.parts.rose.create(els.badgeWrap, { badge: true });
      renderKeys();
    },
    onShow: function (prev) {
      if (prev === 'menu') fly();
      els.main.classList.remove('enter');
      void els.main.offsetWidth;
      els.main.classList.add('enter');
      if (st.sub === 'input') focusInput();
    },
    onHide: function () { endFly(); },
    onKey: function (e) {
      var tag = e.target && e.target.tagName;
      var enter = e.key === 'Enter' || e.code === 'NumpadEnter';
      if (e.key === 'Escape') {
        e.preventDefault();
        if (st.sub === 'confirm') { U.act('confirmSuggestion', false); return; }
        U.act('toMenu');
        return;
      }
      if (st.sub === 'confirm' && enter) { e.preventDefault(); U.act('confirmSuggestion', true); return; }
      if (st.sub === 'result' && (enter || e.code === 'Space')) {
        if (tag === 'BUTTON' && e.target.closest && !e.target.closest('.res-acts')) return;
        e.preventDefault(); U.act('next'); return;
      }
      if (st.sub === 'input' && enter && tag !== 'BUTTON') { e.preventDefault(); submit(); }
    },
    events: {
      'app:ready': function (d) { st.asOf = d && d.asOf; },
      'mode:start': function (d) {
        d = d || {};
        st.modeId = d.modeId || null;
        st.daily = !!d.daily;
        st.total = d.total || cfgNum('QUESTIONS_PER_ROUND', 5);
        st.tiers = [];
        st.index = 0;
        renderHead();
        renderPips();
        renderScore();
      },
      'question:show': function (d) {
        d = d || {};
        if (d.modeId && d.modeId !== st.modeId) { st.modeId = d.modeId; renderHead(); }
        st.index = d.index || 0;
        st.total = d.total || st.total;
        st.closed = !!d.closed;
        st.passOpen = false;
        st.lastValid = null;
        st.lastTimeout = false;
        els.pass.disabled = true;
        els.passNote.textContent = cfgNum('SKIP_AFTER', 10) + ' sn sonra açılır';
        U.clear(els.fbs);
        U.clear(els.result);
        els.input.value = '';
        els.input.disabled = false;
        els.timer.classList.remove('warn');
        els.fill.style.transform = 'scaleX(1)';
        renderQuestion(d);
        renderPips();
        renderScore();
        setSub('input');
        if (ui.screen !== 'question') ui.show('question'); else focusInput();
      },
      'timer:tick': function (d) {
        if (!d || !d.total) return;
        var left = Math.max(0, +d.left || 0);
        els.fill.style.transform = 'scaleX(' + (left / d.total).toFixed(4) + ')';
        els.secs.textContent = String(Math.ceil(left));
        els.timer.classList.toggle('warn', left <= cfgNum('WARN', 5));
        if (d.total - left >= cfgNum('SKIP_AFTER', 10)) openPass();
      },
      'answer:invalid': function (d) {
        d = d || {};
        if (st.sub === 'confirm') { dropConfirm(); setSub('input'); }
        addFb(h('div', { class: 'fb fb--bad' }, [h('span', { class: 'mk', text: '×' }), h('span', { class: 'tx' }, [d.raw ? q(d.raw) : null, d.raw ? ' — ' : '', String(d.reason || 'Geçersiz cevap.')])]));
        focusInput(); els.input.select();
      },
      'answer:none': function (d) {
        d = d || {};
        var msg = st.closed ? 'bu listede yok. Yazımı kontrol et.' : 'havuzumda yok' + (st.asOf ? ' (veri: ' + st.asOf + ')' : '') + '. Başka dene ya da bildir.';
        if (d.newerThanAsOf) msg = 'veri tarihimden daha yeni olabilir. Bildirirsen eklenebilir.';
        var kids = [h('span', { class: 'mk', text: '?' }), h('span', { class: 'tx' }, [q(d.raw || ''), ' ' + msg])];
        if (d.canReport !== false) {
          kids.push(h('span', { class: 'acts' }, [h('button', { class: 'btn btn-no', type: 'button', onclick: function () { U.act('report'); } }, ['BİLDİR'])]));
        }
        addFb(h('div', { class: 'fb fb--none' }, kids));
        openPass();
        focusInput(); els.input.select();
      },
      'answer:confirm': function (d) {
        d = d || {};
        dropConfirm();
        addFb(h('div', { class: 'fb fb--confirm' }, [
          h('span', { class: 'tx' }, [h('small', { text: '“' + (d.raw || '') + '” yazdın' }), 'Şunu mu demek istedin: ', h('b', { text: d.label || d.suggestion || '' }), '?']),
          h('span', { class: 'acts' }, [
            h('button', { class: 'btn btn-ok', type: 'button', onclick: function () { U.act('confirmSuggestion', true); } }, ['EVET', U.kbd('↵')]),
            h('button', { class: 'btn btn-no', type: 'button', onclick: function () { U.act('confirmSuggestion', false); } }, ['HAYIR', U.kbd('Esc')])
          ])
        ]));
        setSub('confirm');
      },
      'report:saved': function (d) {
        var n = (d && d.count) || 0;
        var btn = els.fbs.querySelector('.fb--none .acts');
        if (btn) { U.clear(btn); btn.appendChild(h('span', { class: 'reported', text: 'Bildirildi' + (n ? ' · toplam ' + n : '') })); }
      },
      'answer:valid': function (d) { st.lastValid = d || null; },
      'answer:pass': function () { st.tiers[st.index] = 'pas'; renderPips(); },
      'answer:timeout': function () { st.lastTimeout = true; st.tiers[st.index] = 'sure'; renderPips(); },
      'result:show': function (d) {
        d = d || {};
        if (ui.screen !== 'question') return;
        if (!st.lastTimeout) st.tiers[st.index] = d.tierId || 'zayif';
        renderPips();
        renderScore();
        renderResult(d);
      }
    }
  };

  function submit() {
    if (st.sub !== 'input') return;
    var v = els.input.value;
    if (!String(v).trim()) { focusInput(); return; }
    U.act('submit', v);
  }
})(typeof window !== 'undefined' ? window : globalThis);
