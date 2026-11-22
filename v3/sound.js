/* PUSULLA ses katmanı — klasik script, çevrimdışı. Sahibi: ses. Yalnız PUSULLA.events dinler.
   Dosyalar: sound/*.mp3 (HTMLAudio; file:// uyumlu). Ayar: localStorage 'pusulla.v3.sound' {on, vol}. */
(function () {
  'use strict';
  var P = (window.PUSULLA = window.PUSULLA || {});
  var DIR = 'sound/';
  var SFX = ['ui_hover', 'ui_click', 'mode_select', 'tam', 'cokyakin', 'yakin', 'uzak', 'invalid', 'none',
    'pass', 'timeout', 'warn', 'streak', 'round_end', 'day_complete', 'era_change', 'confirm'];
  var MUSIC = ['muzik_menu', 'muzik_soru', 'muzik_gerilim'];
  var SFX_VOL = 0.8, MUSIC_VOL = 0.55;

  var cfg = { on: true, vol: 0.7 };
  try {
    var s = JSON.parse(localStorage.getItem('pusulla.v3.sound') || 'null');
    if (s && typeof s === 'object') { cfg.on = s.on !== false; if (typeof s.vol === 'number') cfg.vol = Math.min(1, Math.max(0, s.vol)); }
  } catch (e) { /* localStorage yoksa bellekte */ }
  function save() { try { localStorage.setItem('pusulla.v3.sound', JSON.stringify(cfg)); } catch (e) {} }

  var unlocked = false;       // ilk kullanıcı etkileşimi öncesi ses çalınmaz
  var cache = {};             // ad -> Audio (taban)
  function base(name) {
    if (!cache[name]) {
      var a = new Audio(DIR + name + '.mp3');
      a.preload = 'auto';
      cache[name] = a;
    }
    return cache[name];
  }

  /* ---- SFX ---- */
  var lastPlay = {};
  function sfx(name, gap) {
    if (!cfg.on || !unlocked) return;
    var now = Date.now();
    if (gap && lastPlay[name] && now - lastPlay[name] < gap) return;
    lastPlay[name] = now;
    try {
      var a = base(name).cloneNode(true);
      a.volume = Math.min(1, cfg.vol * SFX_VOL);
      var pr = a.play();
      if (pr && pr.catch) pr.catch(function () {});
    } catch (e) {}
  }

  /* ---- Müzik (çapraz geçişli döngü) ---- */
  var cur = null, curName = '', fades = [];
  function tickFades() {
    for (var i = fades.length - 1; i >= 0; i--) {
      var f = fades[i], t = Math.min(1, (Date.now() - f.t0) / f.ms);
      var v = f.from + (f.to - f.from) * t;
      f.a.volume = Math.max(0, Math.min(1, v * cfg.vol * MUSIC_VOL));
      f.a._lv = v;
      if (t >= 1) { if (f.to === 0) { try { f.a.pause(); } catch (e) {} } fades.splice(i, 1); }
    }
    if (!fades.length && timer) { clearInterval(timer); timer = null; }
  }
  var timer = null;
  function fade(a, to, ms) {
    fades = fades.filter(function (f) { return f.a !== a; });
    fades.push({ a: a, from: a._lv || 0, to: to, ms: ms, t0: Date.now() });
    if (!timer) timer = setInterval(tickFades, 50);
  }
  var wanted = '';
  function music(name) {
    wanted = name;
    if (!cfg.on || !unlocked) return;
    if (name === curName && cur && !cur.paused) return;
    if (cur) fade(cur, 0, 900);
    curName = name;
    if (!name) { cur = null; return; }
    var a = new Audio(DIR + name + '.mp3');
    a.loop = true; a._lv = 0; a.volume = 0;
    cur = a;
    var pr = a.play();
    if (pr && pr.catch) pr.catch(function () {});
    fade(a, 1, 1200);
  }

  /* ---- Açma/kapama ---- */
  function applyEnabled() {
    if (!cfg.on) {
      fades = [];
      if (cur) { try { cur.pause(); } catch (e) {} }
      cur = null; curName = '';
    } else if (unlocked) {
      music(wanted);
    }
    try { document.body && (document.body.dataset.sound = cfg.on ? 'on' : 'off'); } catch (e) {}
  }
  P.sound = {
    setEnabled: function (b) { cfg.on = !!b; save(); applyEnabled(); },
    isEnabled: function () { return cfg.on; },
    setVolume: function (v) { cfg.vol = Math.min(1, Math.max(0, +v || 0)); save(); if (cur) cur.volume = cfg.vol * MUSIC_VOL * (cur._lv == null ? 1 : cur._lv); },
    getVolume: function () { return cfg.vol; }
  };

  /* ---- Kilit açma (ilk etkileşim) ---- */
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { document.removeEventListener(ev, unlock, true); });
    // ses dosyalarını önceden ısıt
    SFX.concat(MUSIC).forEach(function (n) { try { base(n).load(); } catch (e) {} });
    music(wanted || 'muzik_menu');
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { document.addEventListener(ev, unlock, true); });

  /* ---- M tuşu (yazı alanındayken devre dışı) ---- */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'm' && e.key !== 'M') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target, tag = t && t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
    P.sound.setEnabled(!cfg.on);
  }, false);

  /* ---- Genel tık (butonlar, bağlantılar) ---- */
  document.addEventListener('pointerdown', function (e) {
    var t = e.target && e.target.closest && e.target.closest('button,[role=button],a,.btn,[data-action]');
    if (t) sfx('ui_click', 80);
  }, true);

  /* ---- Olay haritası ---- */
  var streak = 0;
  var tierSfx = { tam: 'tam', cokyakin: 'cokyakin', yakin: 'yakin', uzak: 'uzak', zayif: 'uzak' };
  function bind() {
    var ev = P.events;
    if (!ev || !ev.on) return false;
    function on(n, fn) { ev.on(n, function (d) { try { fn(d || {}); } catch (e) { console.error('[sound]', n, e); } }); }

    on('app:ready', function () { music('muzik_menu'); });
    on('menu:show', function () { music('muzik_menu'); });
    on('menu:focus', function () { sfx('ui_hover', 60); });
    on('mode:start', function () { streak = 0; sfx('mode_select'); music('muzik_soru'); });
    on('question:show', function () { music('muzik_soru'); });
    on('timer:warn', function (d) {
      sfx('warn');
      if (typeof d.left === 'number' && d.left <= 3) music('muzik_gerilim');
    });
    on('answer:valid', function (d) {
      sfx(tierSfx[d.tierId] || 'yakin');
      if (d.tierId === 'tam' || d.tierId === 'cokyakin') {
        streak++;
        if (streak >= 2) setTimeout(function () { sfx('streak'); }, 650);
      } else streak = 0;
      music('muzik_soru');
    });
    on('answer:invalid', function () { sfx('invalid'); streak = 0; });
    on('answer:none', function () { sfx('none'); streak = 0; });
    on('answer:pass', function () { sfx('pass'); streak = 0; music('muzik_soru'); });
    on('answer:timeout', function () { sfx('timeout'); streak = 0; music('muzik_soru'); });
    on('answer:confirm', function () { sfx('confirm'); });
    on('era:change', function () { sfx('era_change', 400); });
    on('round:end', function () { sfx('round_end'); music('muzik_menu'); });
    on('day:complete', function () { setTimeout(function () { sfx('day_complete'); }, 400); music('muzik_menu'); });
    on('stats:show', function () { music('muzik_menu'); });
    return true;
  }
  // bus.js ses bloğundan önce yüklenir; yine de geç gelirse bekle.
  if (!bind()) {
    var tries = 0, iv = setInterval(function () { if (bind() || ++tries > 100) clearInterval(iv); }, 100);
  }
  if (document.readyState !== 'loading') applyEnabled();
  else document.addEventListener('DOMContentLoaded', applyEnabled);
})();
