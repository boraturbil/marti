/* PUSULLA görsel katman — çekirdek: kayıt, yardımcılar, ekran yönetimi, klavye yönlendirme.
 * Yalnız PUSULLA.ui ekler (alt parçalar PUSULLA.ui.parts altında). Motor dosyalarına dokunmaz. */
(function (global) {
  'use strict';

  var P = (global.PUSULLA = global.PUSULLA || {});
  var doc = global.document;

  /* ---------- yardımcılar ---------- */
  function h(tag, attrs, kids) {
    var el = doc.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        var v = attrs[k];
        if (v === null || v === undefined || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'style') el.setAttribute('style', v);
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    if (kids) append(el, kids);
    return el;
  }
  function append(el, kids) {
    if (!Array.isArray(kids)) kids = [kids];
    for (var i = 0; i < kids.length; i++) {
      var c = kids[i];
      if (c === null || c === undefined || c === false) continue;
      el.appendChild(typeof c === 'string' || typeof c === 'number' ? doc.createTextNode(String(c)) : c);
    }
    return el;
  }
  function clear(el) { while (el && el.firstChild) el.removeChild(el.firstChild); return el; }
  function upper(s) { return String(s == null ? '' : s).toLocaleUpperCase('tr-TR'); }
  function kbd(label) { return h('kbd', { text: label }); }
  function cfg() { return P.config || {}; }
  function modeInfo(id) {
    var c = cfg();
    if (id === 'karma') return c.KARMA_GROUP || { id: 'karma', name: 'KARMA', hint: 'İki ölçüt birden.' };
    return (c.MODES && c.MODES[id]) || { id: id, name: upper(id || ''), hint: '' };
  }
  function act(name) {
    var a = P.actions || {};
    if (typeof a[name] !== 'function') return;
    var args = Array.prototype.slice.call(arguments, 1);
    a[name].apply(a, args);
  }
  function reducedMotion() {
    try { return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }

  var TIER_LABELS = { tam: 'TAM İSABET', cokyakin: 'ÇOK YAKIN', yakin: 'YAKIN', uzak: 'UZAK', zayif: 'ZAYIF', pas: 'PAS', sure: 'SÜRE DOLDU' };
  function tierLabel(id) {
    var m = cfg().TIER_MAP;
    if (m && m[id] && m[id].label) return m[id].label;
    return TIER_LABELS[id] || upper(id || '');
  }

  /* ---------- ekran yönetimi ---------- */
  var ui = {
    name: 'gorsel',
    parts: {},
    util: {
      h: h, append: append, clear: clear, upper: upper, kbd: kbd, cfg: cfg,
      modeInfo: modeInfo, act: act, reducedMotion: reducedMotion, tierLabel: tierLabel
    },
    root: null,
    screen: null,
    screens: {},
    keymap: null,
    show: show,
    mount: mount
  };

  function show(name) {
    if (!ui.root) return;
    var prev = ui.screen;
    if (prev && prev !== name && ui.parts[prev] && typeof ui.parts[prev].onHide === 'function') ui.parts[prev].onHide();
    ui.screen = name;
    ui.root.setAttribute('data-screen', name);
    for (var k in ui.screens) {
      if (!Object.prototype.hasOwnProperty.call(ui.screens, k)) continue;
      ui.screens[k].hidden = (k !== name);
    }
    var part = ui.parts[name];
    if (part && typeof part.onShow === 'function') part.onShow(prev);
  }

  function onKey(e) {
    if (e.defaultPrevented) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.code === 'KeyM') return; // M tuşu sesin
    var ov = ui.parts.overlay;
    if (ov && ov.isOpen && ov.isOpen()) { ov.onKey(e); return; }
    var part = ui.parts[ui.screen];
    if (part && typeof part.onKey === 'function') part.onKey(e);
  }

  function mount(rootEl) {
    if (ui.root) return;
    ui.root = rootEl;
    rootEl.classList.add('pu');
    ui.keymap = (cfg().KEYMAP) || null;

    if (P.scene && typeof P.scene.mount === 'function') P.scene.mount(rootEl);

    ['menu', 'question', 'summary', 'stats'].forEach(function (name) {
      var part = ui.parts[name];
      if (!part) return;
      var sec = h('section', { class: 'scr scr--' + name, hidden: true });
      ui.screens[name] = sec;
      rootEl.appendChild(sec);
      part.init(sec);
    });

    if (ui.parts.overlay) ui.parts.overlay.init(rootEl);

    var ev = P.events || P.bus;
    if (ev && typeof ev.on === 'function') {
      ev.on('app:ready', function (d) {
        if (d && d.keymap && d.keymap.arrows) ui.keymap = d.keymap;
      });
      for (var name in ui.parts) {
        if (!Object.prototype.hasOwnProperty.call(ui.parts, name)) continue;
        var p = ui.parts[name];
        if (p.events) {
          for (var evName in p.events) {
            if (Object.prototype.hasOwnProperty.call(p.events, evName)) ev.on(evName, p.events[evName]);
          }
        }
      }
    }
    doc.addEventListener('keydown', onKey);
    show('menu');
  }

  P.ui = ui;
})(typeof window !== 'undefined' ? window : globalThis);
