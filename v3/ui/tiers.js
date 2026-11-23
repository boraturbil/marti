/* PUSULLA görsel katman — sonuç ekranı: katman başına bir örnek cevap + alt şeritte dönem zaman çizelgesi.
 * result:show.dots içinde tierId varsa kullanılır (engine.js ekledi); yoksa question.js eski grafiğe düşer.
 * Veri metni yalnız textContent ile DOM'a girer. */
(function (global) {
  'use strict';
  var ui = global.PUSULLA && global.PUSULLA.ui;
  if (!ui) return;
  var U = ui.util, h = U.h;

  var ORDER = ['tam', 'cokyakin', 'yakin', 'uzak', 'zayif'];
  var POINTS = { tam: 100, cokyakin: 70, yakin: 50, uzak: 30, zayif: 10 };
  // Cetvel bölmeleri (eşit genişlik; sınırlarda yıl). Vurgu yıla göre yapılır, sahne adına değil.
  var SEGS = [
    ['misir', 'MISIR', -3000, -1000], ['antik', 'ANTİK', -1000, 500], ['selcuklu', 'SELÇUKLU', 500, 1300],
    ['fetih', 'FETİH', 1300, 1500], ['kesif', 'KEŞİF', 1500, 1800], ['sanayi', 'SANAYİ', 1800, 1900],
    ['cumhuriyet', 'CUMHURİYET', 1900, 1950], ['uzay', 'UZAY', 1950, 1990], ['dijital', 'DİJİTAL', 1990, 2010],
    ['metropol', 'METROPOL', 2010, 2030]
  ];

  function hasYear(y) { return y !== null && y !== undefined && y !== '' && !isNaN(+y); }
  function fy(y, approx) {
    var c = ui.parts.charts;
    return c && c._fmtYear ? c._fmtYear(y, approx) : String(y);
  }
  function fshare(s) {
    var n = +s;
    return '%' + (n >= 10 ? Math.round(n) : Math.round(n * 10) / 10).toString().replace('.', ',');
  }
  function tierPoints(t) {
    var m = U.cfg().TIER_MAP;
    return (m && m[t] && typeof m[t].points === 'number') ? m[t].points : POINTS[t];
  }

  // Katman başına bir örnek: oyuncunun katmanında oyuncunun cevabı, diğerlerinde en bilinen (sl) cevap.
  function pick(d) {
    var dots = (d && d.dots) || [];
    if (!dots.length || !dots.some(function (x) { return x && x.tierId; })) return null;
    var out = [];
    ORDER.forEach(function (t) {
      var grp = dots.filter(function (x) { return x && x.tierId === t; });
      var ex = grp.filter(function (x) { return x.isPlayer; })[0] || null;
      if (!ex) {
        grp.slice().sort(function (a, b) {
          return ((b.isBest ? 1 : 0) - (a.isBest ? 1 : 0)) || ((b.sl || 0) - (a.sl || 0));
        }).slice(0, 1).forEach(function (x) { ex = x; });
      }
      out.push({ tier: t, ex: ex, count: grp.length });
    });
    return out;
  }

  /* ---------- panel: katman örnekleri ---------- */
  function examples(box, d, list) {
    U.clear(box);
    var kind = d.kind || 'pop';
    var head = h('div', { class: 'ch-head' }, [
      h('span', { class: 'over', text: 'HER KATMANDAN BİR ÖRNEK' }),
      kind !== 'time' ? h('span', { class: 'badge badge--big', text: 'PAYLAR TAHMİNİ' }) : null,
      d.poolSize ? h('span', { class: 'ch-note', text: 'havuzda ' + d.poolSize + ' aday' }) : null
    ]);
    box.appendChild(head);
    var tbl = h('div', { class: 'tex', role: 'table', 'aria-label': 'Katman başına örnek cevaplar' });
    list.forEach(function (it) {
      var ex = it.ex, t = it.tier;
      var meta = [];
      if (ex) {
        if ((kind === 'time' || kind === 'combo') && hasYear(ex.year)) meta.push(fy(ex.year, ex.approx));
        if ((kind === 'pop' || kind === 'combo') && ex.share !== null && ex.share !== undefined) meta.push(fshare(ex.share));
        if (kind === 'pop' && (ex.share === null || ex.share === undefined)) meta.push('listede yok');
      }
      tbl.appendChild(h('div', { class: 'tex-row' + (ex && ex.isPlayer ? ' is-you' : '') + (ex ? '' : ' is-empty'), role: 'row' }, [
        h('span', { class: 'tex-tier', style: 'color:var(--tier-' + t + ')' }, [h('i', { style: 'background:var(--tier-' + t + ')' }), U.tierLabel(t)]),
        h('span', { class: 'tex-pts', text: '+' + tierPoints(t) }),
        h('span', { class: 'tex-ans' }, ex ? [
          h('b', { text: ex.label || '' })
        ] : [h('em', { text: 'bu katmanda cevap yok' })]),
        h('span', { class: 'tex-meta', text: meta.join(' · ') })
      ]));
    });
    box.appendChild(tbl);
  }

  /* ---------- alt şerit: dönem zaman çizelgesi ---------- */
  function xOf(y) {
    var n = SEGS.length;
    for (var i = 0; i < n; i++) {
      var s = SEGS[i];
      if (y < s[3] || i === n - 1) {
        var f = Math.max(0, Math.min(1, (y - s[2]) / (s[3] - s[2])));
        return (i + f) / n * 100;
      }
    }
    return 100;
  }
  function timeline(footer, d, list, eraId, eraYear) {
    var marks = [];
    (list || []).forEach(function (it) { if (it.ex && hasYear(it.ex.year)) marks.push({ y: +it.ex.year, t: it.tier, you: !!it.ex.isPlayer, label: it.ex.label, approx: it.ex.approx }); });
    var py = d.player && hasYear(d.player.year) ? +d.player.year : null;
    if (py !== null && !marks.some(function (m) { return m.you; })) marks.push({ y: py, t: d.tierId || 'zayif', you: true, label: d.player.label });
    if (!marks.length) return false;

    var cur = null, curIdx = -1;
    var sc = global.PUSULLA.scene;
    var refYear = py !== null ? py : (hasYear(eraYear) ? +eraYear : null);
    if (sc && sc.pick && refYear !== null) cur = sc.pick(eraId || 'antik', refYear);
    if (refYear !== null) for (var si = 0; si < SEGS.length; si++) { if (refYear < SEGS[si][3] || si === SEGS.length - 1) { curIdx = si; break; } }

    U.clear(footer);
    footer.classList.add('keys--tl', 'tl-v-a'); // tasarım: kilometre taşları
    // renkleri sahnedeki yürüme yolundan al: şerit yolun devamı gibi dursun
    var theme = cur || (sc && sc.pick ? sc.pick(eraId || 'simdi', eraYear) : 'bogaz') || 'bogaz';
    var roads = (sc && sc.walker && (sc.walker.ROADS || sc.walker.roads)) || {};
    var rp = roads[theme] || roads.bogaz || ['#5a4a6e', '#7d6b94', '#392c4a'];
    footer.style.setProperty('--rd', rp[0]); footer.style.setProperty('--rl', rp[1]); footer.style.setProperty('--rk', rp[2]);
    var bar = h('div', { class: 'tl', role: 'img', 'aria-label': 'Dönem zaman çizelgesi: ' + marks.map(function (m) { return m.label + ' ' + fy(m.y, m.approx); }).join(', ') });
    SEGS.forEach(function (s, i) {
      bar.appendChild(h('span', { class: 'tl-seg' + (i === curIdx ? ' is-cur' : ''), style: 'left:' + (i * 10) + '%;width:10%' }));
      if (i > 0) bar.appendChild(h('span', { class: 'tl-yr', style: 'left:' + (i * 10) + '%', text: fy(s[2]) }));
    });
    bar.appendChild(h('i', { class: 'tl-line' }));
    marks.sort(function (a, b) { return (a.you ? 1 : 0) - (b.you ? 1 : 0); });
    marks.forEach(function (m) {
      var x = xOf(m.y).toFixed(2);
      bar.appendChild(h('span', { class: 'tl-mk' + (m.you ? ' is-you' : ''), style: 'left:' + x + '%;--c:var(--tier-' + m.t + ')', title: m.label + ' · ' + fy(m.y, m.approx) }));
      if (m.you) bar.appendChild(h('span', { class: 'tl-flag', style: 'left:' + x + '%' }, [h('i'), h('b', { text: fy(m.y, m.approx) })]));
    });
    footer.appendChild(bar);
    return true;
  }

  ui.parts.tiers = { pick: pick, examples: examples, timeline: timeline };
})(typeof window !== 'undefined' ? window : globalThis);
