/* PUSULLA görsel katman — menü: pusula gülü, odak açıklaması, günün rotası defteri. */
(function (global) {
  'use strict';
  var ui = global.PUSULLA && global.PUSULLA.ui;
  if (!ui) return;
  var U = ui.util, h = U.h;

  var LEGS = [
    { id: 'yaygin', arrow: '↑' }, { id: 'yeni', arrow: '→' },
    { id: 'nadir', arrow: '↓' }, { id: 'eski', arrow: '←' }
  ];
  var DESC = {
    yaygin: 'Çoğu insanın aklına ilk gelen cevabı yaz. Tahmini paylarda ne kadar üstteysen o kadar puan.',
    nadir: 'Geçerli ama az kişinin söyleyeceği cevabı bul. Listede hiç olmayan geçerli bir cevap tam puan alır.',
    eski: 'Kümedeki en eski olanı yaz. Hedefe yıl olarak ne kadar yakınsan o kadar puan.',
    yeni: 'Kümedeki en yeni olanı yaz. Veriler belli bir tarihte donar; daha yenisini bildirebilirsin.',
    karma: 'Çapraz uçlar tek bir KARMA moda açılır: soru karma havuzdan gelir, puan iki ölçütün birleşimidir.',
    rota: 'Rota herkes için aynıdır ve serini belirler. Dört bacağı istediğin sırayla oynayabilirsin.'
  };
  var DEG = { yaygin: 0, gundem: 45, yeni: 90, kesif: 135, nadir: 180, antika: 225, eski: 270, klasik: 315 };

  var rose = null, els = {}, data = { dailyProgress: {}, best: null, streak: 0 };
  var held = {}, lastArrow = null;

  function isMix(id) { return id === 'klasik' || id === 'gundem' || id === 'antika' || id === 'kesif'; }
  function engineId(id) { return isMix(id) ? 'karma' : id; }

  function todayText() {
    var d = new Date();
    try {
      var wd = d.toLocaleDateString('tr-TR', { weekday: 'long' });
      var dt = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
      return U.upper(wd) + ' · ' + U.upper(dt);
    } catch (e) { return ''; }
  }

  function renderInfo(id) {
    var box = U.clear(els.info);
    var dirs = ui.parts.rose.byId;
    var dir = dirs[id];
    var mix = isMix(id);
    var info = U.modeInfo(id === 'rota' ? 'rota' : id);
    var over = id === 'rota' ? 'MERKEZ · GÜNLÜK' : (dir ? dir.card + ' · ' + ('00' + DEG[id]).slice(-3) + '°' + (mix ? ' · KARMA' : '') : '');
    var title = id === 'rota' ? 'GÜNÜN ROTASI' : (dir ? dir.name : U.upper(info.name));
    var color = id === 'rota' ? 'var(--mode-rota)' : 'var(--mode-' + id + ')';
    var prog = data.dailyProgress || {};
    var total = 0; LEGS.forEach(function (l) { total += Math.min(5, +prog[l.id] || 0); });

    U.append(box, [
      h('div', { class: 'over', text: over }),
      h('h2', { class: 'mi-title', style: 'color:' + color, text: title }),
      h('div', { class: 'mi-goal', text: info.hint || '' }),
      h('p', { class: 'mi-desc', text: DESC[mix ? 'karma' : id] || '' })
    ]);

    var f1, f2;
    if (id === 'rota') { f1 = ['BUGÜN', total, '/ 20']; f2 = ['SERİ', data.streak || 0, 'gün']; }
    else if (mix) { f1 = ['MOD', 'KARMA', '']; f2 = ['OYUN', 'SERBEST', '']; }
    else { f1 = ['BU BACAK', Math.min(5, +prog[id] || 0), '/ 5']; f2 = ['SERİ', data.streak || 0, 'gün']; }
    U.append(box, h('div', { class: 'facts' }, [f1, f2].map(function (f) {
      return h('div', null, [h('span', { class: 'over', text: f[0] }), h('b', null, [String(f[1]), f[2] ? h('small', { text: ' ' + f[2] }) : null])]);
    })));

    var label = id === 'rota' ? 'ROTAYA BAŞLA' : (mix ? 'KARMAYA BAŞLA' : 'BAŞLA');
    var btn = h('button', { class: 'btn btn-primary', type: 'button', style: '--accent:' + color, onclick: function () { start(id); } }, [label, U.kbd('↵')]);
    U.append(box, btn);
  }

  function renderLog() {
    var box = U.clear(els.log);
    var prog = data.dailyProgress || {};
    var total = 0;
    U.append(box, h('div', { class: 'over', text: 'BUGÜNÜN ROTASI' }));
    var list = h('div', { class: 'legs' });
    LEGS.forEach(function (l) {
      var n = Math.max(0, Math.min(5, +prog[l.id] || 0));
      total += n;
      var sq = h('span', { class: 'sq', 'aria-hidden': 'true' });
      for (var i = 0; i < 5; i++) sq.appendChild(h('i', i < n ? { class: 'on', style: 'background:var(--mode-' + l.id + ')' } : null));
      list.appendChild(h('button', {
        class: 'leg', type: 'button', 'aria-label': U.modeInfo(l.id).name + ' ' + n + ' / 5',
        onclick: function () { start(l.id); }, onmouseenter: function () { setFocus(l.id, true); }
      }, [
        h('span', { class: 'ar', style: 'color:var(--mode-' + l.id + ')', text: l.arrow }),
        h('span', { class: 'nm', text: U.modeInfo(l.id).name }),
        sq,
        h('span', { class: 'pt' + (n ? '' : ' none'), text: n + '/5' })
      ]));
    });
    box.appendChild(list);
    U.append(box, h('div', { class: 'total' }, [h('span', { class: 'over', text: 'TOPLAM' }), h('b', null, [String(total), h('small', { text: ' / 20' })])]));
    var sub = [];
    sub.push('Seri ' + (data.streak || 0) + ' gün');
    if (data.best !== null && data.best !== undefined) sub.push('En iyi ' + data.best);
    U.append(box, h('div', { class: 'sub', text: sub.join(' · ') }));
    U.append(box, h('div', { class: 'karma' }, [
      h('div', { class: 'over', text: 'SERBEST OYUN · KARMA' }),
      h('p', { text: 'Çapraz uçlar tek bir karma moda açılır: iki ölçüt birden, hem eski hem yaygın gibi.' }),
      h('div', { class: 'chips' }, ['klasik', 'gundem', 'antika', 'kesif'].map(function (id) {
        return h('span', { style: 'color:var(--mode-' + id + ')', text: ui.parts.rose.byId[id].name });
      }))
    ]));
    if (rose) rose.setProgress(prog);
    els.streak.textContent = 'Seri ' + (data.streak || 0);
  }

  function setFocus(id, emit) {
    if (!id || !rose || rose.current() === id) return;
    rose.setFocus(id);
    renderInfo(id);
    if (emit) U.act('focusMode', engineId(id)); // yalnız değişince: iğne tıkı bir kez
  }

  function start(id) {
    id = id || (rose && rose.current()) || 'rota';
    if (id === 'rota') U.act('startDaily');
    else U.act('selectMode', engineId(id));
  }

  function keyTarget(e) {
    var km = ui.keymap || {};
    var code = e.code;
    if (km.arrows && km.arrows[code]) {
      var now = Date.now(), other = null;
      for (var k in held) if (held[k] && k !== code && km.arrows[k]) other = k;
      if (!other && lastArrow && lastArrow.code !== code && now - lastArrow.t <= (km.COMBO_MS || 250)) other = lastArrow.code;
      lastArrow = { code: code, t: now };
      if (other && km.arrowCombos && km.arrowCombos[other + '+' + code]) return km.arrowCombos[other + '+' + code];
      return km.arrows[code];
    }
    if (km.numpad && km.numpad[code]) return km.numpad[code];
    if (km.wasd && km.wasd[code]) return km.wasd[code];
    return null;
  }

  function isConfirm(e) {
    var km = (ui.keymap && ui.keymap.actions && ui.keymap.actions.confirm) || ['Enter', 'Space'];
    return km.indexOf(e.code) >= 0 || e.key === 'Enter' || e.code === 'NumpadEnter';
  }

  ui.parts.menu = {
    init: function (sec) {
      var top = h('header', { class: 'top' }, [
        h('div', { class: 'date', text: todayText() }),
        h('div'),
        h('nav', { class: 'nav' }, [
          els.streak = h('span', { class: 'streak', text: 'Seri 0' }),
          h('button', { class: 'lnk', type: 'button', text: 'Nasıl oynanır', onclick: function () { if (ui.parts.overlay) ui.parts.overlay.open('help'); } }),
          h('button', { class: 'lnk', type: 'button', text: 'İstatistik', onclick: function () { U.act('showStats'); } }),
          h('button', { class: 'lnk', type: 'button', text: 'Hakkında', onclick: function () { if (ui.parts.overlay) ui.parts.overlay.open('about'); } })
        ])
      ]);
      els.info = h('section', { class: 'mi panel', 'aria-live': 'polite' });
      els.roseWrap = h('div', { class: 'rose-wrap' });
      els.logoWrap = h('h1', { class: 'logo-wrap' });
      els.log = h('aside', { class: 'log panel' });
      var main = h('main', { class: 'menu' }, [els.info, h('div', { class: 'center-col' }, [els.logoWrap, els.roseWrap]), els.log]);
      var foot = h('footer', { class: 'keys' }, [
        h('span', null, [U.kbd('↑'), U.kbd('↓'), U.kbd('←'), U.kbd('→'), 'yön seç']),
        h('span', { text: 'iki ok birlikte: çapraz' }),
        h('span', null, [U.kbd('S'), 'günün rotası']),
        h('span', null, [U.kbd('↵'), 'başla'])
      ]);
      U.append(sec, [top, main, foot]);

      if (ui.parts.logo) ui.parts.logo.create(els.logoWrap);
      rose = ui.parts.rose.create(els.roseWrap);
      var hits = rose.el.querySelectorAll('.hit');
      for (var i = 0; i < hits.length; i++) {
        (function (el) {
          var id = el.getAttribute('data-id');
          el.addEventListener('mouseenter', function () { setFocus(id, true); });
          el.addEventListener('focus', function () { setFocus(id, true); });
          el.addEventListener('click', function () { setFocus(id, false); start(id); });
        })(hits[i]);
      }
      global.document.addEventListener('keyup', function (e) { held[e.code] = false; });
      global.addEventListener('blur', function () { held = {}; });
      setFocus('rota', false);
      renderLog();
    },
    onShow: function () {
      if (!rose) return;
      if (rose.fit) rose.fit();
      if (rose.resume) rose.resume();
      rose.focusEl(rose.current() || 'rota');
    },
    onKey: function (e) {
      if (e.repeat && !(ui.keymap && ui.keymap.arrows && ui.keymap.arrows[e.code])) return;
      var tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      var id = keyTarget(e);
      if (id) {
        held[e.code] = true;
        e.preventDefault();
        setFocus(id, true);
        rose.focusEl(id);
        return;
      }
      if (isConfirm(e)) {
        // odak bir düğmedeyse (ör. İstatistik) tarayıcı varsayılanı çalışsın
        if (tag === 'BUTTON') return;
        e.preventDefault();
        start(rose.current());
      }
    },
    roseEl: function () { return rose && (rose.canvas || rose.el); },
    events: {
      'menu:show': function (d) {
        d = d || {};
        data = { dailyProgress: d.dailyProgress || {}, best: d.best, streak: d.streak || 0 };
        renderLog();
        if (rose) renderInfo(rose.current() || 'rota');
        ui.show('menu');
      },
      'menu:focus': function (d) {
        var id = d && d.modeId;
        if (!id || !rose) return;
        if (id === 'karma') { if (!isMix(rose.current())) setFocus('klasik', false); return; }
        if (id !== rose.current()) setFocus(id, false);
      }
    }
  };

  function brandGlyph() {
    var wrap = h('span', { class: 'glyph', 'aria-hidden': 'true' });
    wrap.innerHTML = '<svg viewBox="-12 -12 24 24"><path d="M0,-11 L2.4,-2.4 L11,0 L2.4,2.4 L0,11 L-2.4,2.4 L-11,0 L-2.4,-2.4Z" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M0,-11 L2.4,-2.4 L0,0Z M11,0 L2.4,2.4 L0,0Z M0,11 L-2.4,2.4 L0,0Z M-11,0 L-2.4,-2.4 L0,0Z" fill="currentColor"/></svg>';
    return wrap;
  }
  ui.util.brandGlyph = brandGlyph;
})(typeof window !== 'undefined' ? window : globalThis);
