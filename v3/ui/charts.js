/* PUSULLA görsel katman — sonuç grafikleri: zaman şeridi (time), sıralı pay listesi (pop), karma harita (combo)
 * ve ortak bilgi kartı. Veri metni yalnız textContent ile DOM'a girer. */
(function (global) {
  'use strict';
  var ui = global.PUSULLA && global.PUSULLA.ui;
  if (!ui) return;
  var U = ui.util, h = U.h;
  var MAX_DOTS = 60;

  /* ---------- biçimlendirme ---------- */
  function fmtYear(y, approx) {
    if (y === null || y === undefined || y === '') return '';
    var n = +y;
    var s = n < 0 ? 'MÖ ' + (-n) : String(n);
    return (approx ? '~' : '') + s;
  }
  function fmtShare(s) {
    if (s === null || s === undefined) return '';
    var n = +s;
    return '%' + (n >= 10 ? Math.round(n) : (Math.round(n * 10) / 10)).toString().replace('.', ',');
  }
  var YEAR_KIND = {
    kurulus: 'kuruluş', 'ilk-genel-surum': 'ilk genel sürüm', vizyon: 'vizyon', 'ilk-yayin': 'ilk yayın',
    'piyasa-cikisi': 'piyasaya çıkış', kesif: 'keşif', firlatma: 'fırlatma', 'tahta-cikis': 'tahta çıkış',
    'goreve-baslama': 'göreve başlama', 'ilk-ev-sahipligi': 'ilk ev sahipliği', 'ilk-sampiyonluk': 'ilk şampiyonluk',
    'icat-yaklasik': 'icat (yaklaşık)'
  };
  function fmtSrc(src) {
    if (!src) return '';
    src = String(src);
    if (/^Q\d+$/.test(src)) return 'Vikiveri';
    if (src.indexOf('tr:') === 0) return 'Vikipedi: ' + src.slice(3);
    if (src.indexOf('gn:') === 0) return 'GeoNames';
    if (src === 'm') return 'elle derlendi';
    if (src === 'stub') return 'deneme verisi';
    return src;
  }

  /* ---------- seçim: en çok 60 nokta (oyuncu + hedef + eşit aralıklı örnek) ---------- */
  function sample(list, keyFn) {
    if (list.length <= MAX_DOTS) return list.slice();
    var keep = list.filter(function (d) { return d.isPlayer || d.isBest; });
    var rest = list.filter(function (d) { return !(d.isPlayer || d.isBest); }).sort(function (a, b) { return keyFn(a) - keyFn(b); });
    var need = MAX_DOTS - keep.length, out = keep.slice();
    for (var i = 0; i < need; i++) out.push(rest[Math.floor(i * rest.length / need)]);
    return out;
  }

  /* ---------- bilgi kartı ---------- */
  function makeCard(box) {
    var card = h('div', { class: 'icard', role: 'tooltip', hidden: true });
    box.appendChild(card);
    var owner = null;
    function show(btn, d) {
      owner = btn;
      U.clear(card);
      var tags = [];
      if (d.isPlayer) tags.push(h('span', { class: 'tag tag--you', text: 'SENİN CEVABIN' }));
      if (d.isBest) tags.push(h('span', { class: 'tag tag--best', text: 'HEDEF' }));
      U.append(card, [
        tags.length ? h('div', { class: 'ic-tags' }, tags) : null,
        h('div', { class: 'ic-name', text: d.label || '' })
      ]);
      var meta = [];
      if (d.year !== null && d.year !== undefined) {
        var yl = h('span', null, [h('b', { text: fmtYear(d.year, d.approx) })]);
        if (d.yearKind && YEAR_KIND[d.yearKind]) yl.appendChild(global.document.createTextNode(' · ' + YEAR_KIND[d.yearKind]));
        if (d.approx) yl.appendChild(h('span', { class: 'badge', text: 'yaklaşık' }));
        meta.push(yl);
      }
      if (d.share !== null && d.share !== undefined) meta.push(h('span', null, [h('b', { text: fmtShare(d.share) }), ' pay ', h('span', { class: 'badge', text: 'tahmini' })]));
      else if (d.kindHint === 'pop') meta.push(h('span', { text: 'pay listesinde yok' }));
      if (meta.length) card.appendChild(h('div', { class: 'ic-meta' }, meta));
      if (d.info && d.info !== d.label) card.appendChild(h('p', { class: 'ic-info', text: String(d.info) }));
      var src = fmtSrc(d.src);
      if (src) card.appendChild(h('div', { class: 'ic-src', text: 'Kaynak: ' + src }));
      card.hidden = false;
      // konum: noktanın üstünde, kutu içinde
      var br = box.getBoundingClientRect(), r = btn.getBoundingClientRect();
      var cw = card.offsetWidth, ch = card.offsetHeight;
      var x = r.left - br.left + r.width / 2 - cw / 2;
      x = Math.max(0, Math.min(br.width - cw, x));
      var y = r.top - br.top - ch - 8;
      if (y < -br.top + 4) y = r.bottom - br.top + 8;
      card.style.left = Math.round(x) + 'px';
      card.style.top = Math.round(y) + 'px';
    }
    function hide(btn) { if (!btn || btn === owner) { card.hidden = true; owner = null; } }
    return { show: show, hide: hide };
  }

  // nokta/satır düğmesine kart + ok tuşu gezinmesi bağla
  function wire(box, card, items) {
    items.forEach(function (it, i) {
      var b = it.el, d = it.d;
      b.addEventListener('mouseenter', function () { card.show(b, d); });
      b.addEventListener('mouseleave', function () { if (global.document.activeElement !== b) card.hide(b); });
      b.addEventListener('focus', function () { card.show(b, d); });
      b.addEventListener('blur', function () { card.hide(b); });
      b.addEventListener('keydown', function (e) {
        var j = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = Math.min(items.length - 1, i + 1);
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = Math.max(0, i - 1);
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = items.length - 1;
        else if (e.key === 'Escape') { e.preventDefault(); card.hide(); b.blur(); return; }
        if (j >= 0) { e.preventDefault(); items[j].el.focus(); }
      });
      // yalnız ilk öğe Tab sırasında; diğerlerine oklarla geçilir
      b.tabIndex = i === 0 ? 0 : -1;
    });
    // oyuncu/hedef varsa Tab ile ilk ona gelinsin
    var first = items.filter(function (it) { return it.d.isPlayer; })[0] || items.filter(function (it) { return it.d.isBest; })[0];
    if (first && items.length) { items[0].el.tabIndex = -1; first.el.tabIndex = 0; }
  }

  function dotLabel(d) {
    var bits = [d.label || ''];
    if (d.year !== null && d.year !== undefined) bits.push(fmtYear(d.year, d.approx));
    if (d.share !== null && d.share !== undefined) bits.push(fmtShare(d.share) + ' tahmini pay');
    if (d.isPlayer) bits.push('senin cevabın');
    if (d.isBest) bits.push('hedef');
    return bits.join(', ');
  }

  function stagger(el, i, n) {
    if (U.reducedMotion()) return;
    el.style.animationDelay = Math.round(380 + (i / Math.max(1, n)) * 700) + 'ms';
  }

  /* ================= ZAMAN ŞERİDİ ================= */
  function renderTime(box, d) {
    var all = (d.dots || []).filter(function (x) { return x && x.year !== null && x.year !== undefined && x.year !== ''; });
    var noYear = (d.dots || []).length - all.length;
    if (!all.length) { box.appendChild(h('p', { class: 'ch-empty', text: 'Bu soruda gösterilecek yıl verisi yok.' })); return; }
    var dots = sample(all, function (x) { return +x.year; });
    var W = 780, PADX = 18, stepY = 12;

    // parçalı ölçek: büyük boşluklarda // kırığı
    var ys = dots.map(function (x) { return +x.year; }).sort(function (a, b) { return a - b; });
    var uniq = ys.filter(function (v, i) { return i === 0 || v !== ys[i - 1]; });
    var lo = uniq[0], hi = uniq[uniq.length - 1], span = Math.max(1, hi - lo);
    var gaps = [];
    for (var i = 1; i < uniq.length; i++) gaps.push({ i: i, g: uniq[i] - uniq[i - 1] });
    gaps.sort(function (a, b) { return b.g - a.g; });
    var cuts = gaps.filter(function (g) { return g.g > span * 0.28 && span > 120; }).slice(0, 2).map(function (g) { return g.i; }).sort(function (a, b) { return a - b; });
    var segs = [], s0 = 0;
    cuts.concat([uniq.length]).forEach(function (c) { segs.push({ a: uniq[s0], b: uniq[c - 1] }); s0 = c; });
    var BREAK = 26, usable = W - PADX * 2 - BREAK * (segs.length - 1);
    var weights = segs.map(function (sg) { return Math.max(sg.b - sg.a, span * 0.1); });
    var wsum = weights.reduce(function (p, q) { return p + q; }, 0);
    var x0 = PADX;
    segs.forEach(function (sg, k) {
      sg.x0 = x0; sg.w = usable * weights[k] / wsum; x0 += sg.w + BREAK;
    });
    function X(y) {
      for (var k = 0; k < segs.length; k++) {
        var sg = segs[k];
        if (y <= sg.b || k === segs.length - 1) {
          if (sg.b === sg.a) return sg.x0 + sg.w / 2;
          return sg.x0 + (Math.max(sg.a, Math.min(sg.b, y)) - sg.a) / (sg.b - sg.a) * sg.w;
        }
      }
      return PADX;
    }

    var stage = h('div', { class: 'ch ch-time', style: 'width:' + W + 'px' });
    var AXB = 4, lastTickR = -999;
    function tickLabel(x, txt, mode) {
      var w = txt.length * 7 + 4, l = mode === 'c' ? x - w / 2 : (mode ? x - w : x);
      if (l < lastTickR + 8) return;
      lastTickR = l + w;
      stage.appendChild(h('span', { class: 'tk' + (mode === 'c' ? ' tk--c' : (mode ? ' tk--r' : '')), style: 'left:' + x + 'px', text: txt }));
    }
    var axis = h('div', { class: 'ax' });
    segs.forEach(function (sg, k) {
      axis.appendChild(h('i', { class: 'ax-seg', style: 'left:' + sg.x0 + 'px;width:' + Math.max(2, sg.w) + 'px;animation-delay:' + (k * 120) + 'ms' }));
      if (k > 0) axis.appendChild(h('span', { class: 'ax-break', style: 'left:' + (sg.x0 - BREAK / 2 - 7) + 'px', text: '//' }));
      // uç etiketleri (çakışan etiket atlanır)
      if (sg.b === sg.a) tickLabel(sg.x0 + sg.w / 2, fmtYear(sg.a), 'c');
      else {
        tickLabel(sg.x0, fmtYear(sg.a), false);
        if (sg.w > 40) tickLabel(sg.x0 + sg.w, fmtYear(sg.b), true);
      }
    });
    stage.appendChild(axis);

    // aynı yıl/sütun yığını
    var order = dots.slice().sort(function (a, b) { return (+a.year) - (+b.year) || (b.isPlayer ? 1 : 0) - (a.isPlayer ? 1 : 0); });
    var cols = {}, items = [], placed = [], maxLvl = 0;
    order.forEach(function (dt, n) {
      var x = Math.round(X(+dt.year));
      var key = Math.round(x / 8);
      var lvl = cols[key] = (cols[key] === undefined ? 0 : cols[key] + 1);
      lvl = Math.min(lvl, 6);
      maxLvl = Math.max(maxLvl, lvl);
      var cls = 'dot' + (dt.isPlayer ? ' dot--you' : '') + (dt.isBest ? ' dot--best' : '');
      var b = h('button', { type: 'button', class: cls, 'aria-label': dotLabel(dt), style: 'left:' + x + 'px;bottom:' + (AXB + 6 + lvl * stepY) + 'px' });
      if (dt.isBest) b.appendChild(h('span', { class: 'star', 'aria-hidden': 'true', text: '★' }));
      stagger(b, n, order.length);
      stage.appendChild(b);
      items.push({ el: b, d: dt });
      placed.push({ d: dt, x: x, key: key });
    });
    // oyuncu/hedef bayrakları: kendi yığınının üstünde, kenarda içeri hizalı
    var flagRows = [];
    function flag(p, cls, txt) {
      var top = cols[p.key] === undefined ? 0 : Math.min(cols[p.key], 6);
      var bottom = AXB + 6 + (top + 1) * stepY + 10;
      var wpx = txt.length * 7 + 12;
      var left = p.x - wpx / 2;
      left = Math.max(0, Math.min(W - wpx, left));
      flagRows.forEach(function (f) { if (Math.abs(f.left - left) < wpx && Math.abs(f.bottom - bottom) < 18) bottom = f.bottom + 20; });
      flagRows.push({ left: left, bottom: bottom });
      stage.appendChild(h('span', { class: 'flag ' + cls, style: 'left:' + Math.round(left) + 'px;bottom:' + bottom + 'px', text: txt }));
      return bottom + 18;
    }
    var topY = AXB + 6 + (maxLvl + 1) * stepY + 14;
    placed.forEach(function (p) { if (p.d.isPlayer) topY = Math.max(topY, flag(p, 'flag--you', 'SEN · ' + fmtYear(p.d.year, p.d.approx))); });
    placed.forEach(function (p) { if (p.d.isBest && !p.d.isPlayer) topY = Math.max(topY, flag(p, 'flag--best', 'HEDEF · ' + fmtYear(p.d.year, p.d.approx))); });
    stage.style.height = Math.max(70, topY) + 'px';
    var dir = d.modeId === 'yeni' ? 'daha yeni →' : '← daha eski';
    box.appendChild(h('div', { class: 'ch-head' }, [
      h('span', { class: 'over', text: 'ZAMAN ŞERİDİ' }),
      h('span', { class: 'ch-dir', text: dir }),
      h('span', { class: 'ch-note', text: noteText(d, dots.length, all.length, noYear) })
    ]));
    box.appendChild(stage);
    var card = makeCard(stage);
    wire(stage, card, items);
  }

  function noteText(d, shown, total, noYear) {
    var bits = [];
    if (d.poolSize) bits.push('havuzda ' + d.poolSize + ' aday');
    if (shown < total || (d.poolSize && shown < d.poolSize)) bits.push('grafikte ' + shown);
    if (noYear) bits.push(noYear + ' yılsız');
    return bits.join(' · ');
  }

  /* ================= PAY LİSTESİ ================= */
  function renderPop(box, d) {
    var all = (d.dots || []).filter(Boolean);
    if (!all.length) { box.appendChild(h('p', { class: 'ch-empty', text: 'Bu soruda gösterilecek pay verisi yok.' })); return; }
    var listed = all.filter(function (x) { return x.share !== null && x.share !== undefined; }).sort(function (a, b) { return b.share - a.share; });
    var unlisted = all.filter(function (x) { return x.share === null || x.share === undefined; });
    var MAXR = 7, rows = listed.slice(0, MAXR), gapAfter = false;
    listed.forEach(function (x, i) {
      if (i >= MAXR && (x.isPlayer || x.isBest)) { rows.push(x); gapAfter = true; }
    });
    unlisted.forEach(function (x) { if (x.isPlayer || x.isBest) rows.push(x); });
    var maxS = listed.length ? listed[0].share : 1;

    box.appendChild(h('div', { class: 'ch-head' }, [
      h('span', { class: 'over', text: d.modeId === 'nadir' ? 'PAY SIRALAMASI · EN AZ YAZILAN KAZANIR' : 'PAY SIRALAMASI' }),
      h('span', { class: 'badge badge--big', text: 'PAYLAR TAHMİNİ' }),
      h('span', { class: 'ch-note', text: noteText(d, rows.length, all.length, 0) })
    ]));
    var list = h('div', { class: 'ch ch-pop', role: 'list' });
    var items = [];
    rows.forEach(function (x, n) {
      var rank = listed.indexOf(x);
      if (n === MAXR && gapAfter) list.appendChild(h('div', { class: 'pop-gap', 'aria-hidden': 'true', text: '⋯' }));
      var on = x.share !== null && x.share !== undefined;
      var w = on ? Math.max(2, Math.round((x.share / maxS) * 100)) : 0;
      var xd = {}; for (var k in x) if (Object.prototype.hasOwnProperty.call(x, k)) xd[k] = x[k];
      xd.kindHint = 'pop';
      var b = h('button', { type: 'button', class: 'pop-row' + (x.isPlayer ? ' is-you' : '') + (x.isBest ? ' is-best' : ''), 'aria-label': dotLabel(x), role: 'listitem' }, [
        h('span', { class: 'pr-rank', text: on ? '#' + (rank + 1) : '—' }),
        h('span', { class: 'pr-name' }, [
          h('span', { class: 'pr-label', text: x.label || '' }),
          x.isPlayer ? h('span', { class: 'tag tag--you', text: 'SEN' }) : null,
          x.isBest ? h('span', { class: 'tag tag--best', text: '★ HEDEF' }) : null
        ]),
        h('span', { class: 'pr-bar' + (on ? '' : ' pr-bar--none') }, on ? [h('i', { style: 'width:' + w + '%' })] : [h('em', { text: 'listede yok · çok nadir' })]),
        h('span', { class: 'pr-val', text: on ? fmtShare(x.share) : '' })
      ]);
      stagger(b, n, rows.length);
      list.appendChild(b);
      items.push({ el: b, d: xd });
    });
    box.appendChild(list);
    var card = makeCard(list);
    wire(list, card, items);
  }

  /* ================= KARMA HARİTA ================= */
  function renderCombo(box, d) {
    var all = (d.dots || []).filter(function (x) { return x && x.year !== null && x.year !== undefined; });
    var noYear = (d.dots || []).length - all.length;
    if (!all.length) { box.appendChild(h('p', { class: 'ch-empty', text: 'Bu soruda gösterilecek iki eksenli veri yok.' })); return; }
    var dots = sample(all, function (x) { return +x.year; });
    var W = 780, H = 190, P = 16;
    // yüzdelik eksenler: x = yıl sırası (eski → yeni), y = pay sırası (yaygın üstte; listede olmayan en altta)
    var byYear = dots.slice().sort(function (a, b) { return a.year - b.year; });
    var shared = dots.filter(function (x) { return x.share !== null && x.share !== undefined; }).sort(function (a, b) { return b.share - a.share; });
    function px(x) { var i = byYear.indexOf(x); return P + (byYear.length > 1 ? i / (byYear.length - 1) : 0.5) * (W - 2 * P); }
    function py(x) {
      if (x.share === null || x.share === undefined) return H - P;
      var i = shared.indexOf(x);
      return P + (shared.length > 1 ? i / (shared.length - 1) : 0.5) * (H - 2 * P - 18);
    }
    var map = h('div', { class: 'ch ch-combo', style: 'width:' + W + 'px;height:' + H + 'px' });
    map.appendChild(h('i', { class: 'cx', 'aria-hidden': 'true' }));
    map.appendChild(h('i', { class: 'cy', 'aria-hidden': 'true' }));
    [['klasik', 'q-tl'], ['gundem', 'q-tr'], ['antika', 'q-bl'], ['kesif', 'q-br']].forEach(function (q) {
      var on = d.modeId === q[0] || (d.modeId === 'karma' && false);
      map.appendChild(h('span', { class: 'quad ' + q[1] + (on ? ' on' : ''), style: 'color:var(--mode-' + q[0] + ')', text: ui.parts.rose.byId[q[0]].name }));
    });
    map.appendChild(h('span', { class: 'axl axl-x0', text: '← eski' }));
    map.appendChild(h('span', { class: 'axl axl-x1', text: 'yeni →' }));
    map.appendChild(h('span', { class: 'axl axl-y0', text: '↑ yaygın' }));
    map.appendChild(h('span', { class: 'axl axl-y1', text: 'nadir ↓' }));
    var items = [];
    byYear.forEach(function (x, n) {
      var cls = 'dot' + (x.isPlayer ? ' dot--you' : '') + (x.isBest ? ' dot--best' : '');
      var b = h('button', { type: 'button', class: cls, 'aria-label': dotLabel(x), style: 'left:' + Math.round(px(x)) + 'px;top:' + Math.round(py(x)) + 'px' });
      if (x.isBest) b.appendChild(h('span', { class: 'star', 'aria-hidden': 'true', text: '★' }));
      stagger(b, n, byYear.length);
      map.appendChild(b);
      items.push({ el: b, d: x });
    });
    box.appendChild(h('div', { class: 'ch-head' }, [
      h('span', { class: 'over', text: 'KARMA HARİTA' }),
      h('span', { class: 'badge badge--big', text: 'PAYLAR TAHMİNİ' }),
      h('span', { class: 'ch-note', text: noteText(d, dots.length, all.length, noYear) })
    ]));
    box.appendChild(map);
    var card = makeCard(map);
    wire(map, card, items);
  }

  ui.parts.charts = {
    render: function (box, d) {
      U.clear(box);
      if (!d) return;
      var kind = d.kind || 'pop';
      try {
        if (kind === 'time') renderTime(box, d);
        else if (kind === 'combo') renderCombo(box, d);
        else renderPop(box, d);
      } catch (e) {
        if (global.console) global.console.error('[PUSULLA.ui] grafik çizilemedi:', e);
      }
    },
    _fmtYear: fmtYear
  };
})(typeof window !== 'undefined' ? window : globalThis);
