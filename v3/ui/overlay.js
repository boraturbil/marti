/* PUSULLA görsel katman — üst pencereler: Nasıl oynanır, Hakkında, Bildirimlerim.
 * Odak pencere içinde tutulur; Esc kapatır ve odağı açan öğeye geri verir. */
(function (global) {
  'use strict';
  var P = global.PUSULLA;
  var ui = P && P.ui;
  if (!ui) return;
  var U = ui.util, h = U.h, doc = global.document;

  var back = null, win = null, openName = null, returnTo = null, asOf = null, sessionReports = 0;
  var FALLBACK_ATTR = 'Soru adayları Vikiveri (CC0), Vikipedi (CC BY-SA 4.0) ve GeoNames (CC BY 4.0) verilerinden derlenmiştir. KARMA modunda soru puanı 0–100 arası sürekli yüzdeliktir (en iyi cevap 100, en kötü 0). Paylar yapay zekâ tahminidir.';
  var KIND = { none: 'havuzda yok', fuzzy: 'yanlış eşleşme şüphesi', wrong: 'yanlış eşleşti' };

  function metaAttribution() {
    var cands = [P.meta, P.data && P.data.meta, global.PUSULLA_META];
    for (var i = 0; i < cands.length; i++) {
      var m = cands[i];
      if (m && typeof m === 'object') {
        var t = m.attribution || m.ATTRIBUTION || m.atif || m.ATIF;
        if (typeof t === 'string' && t.trim()) return { text: t, fromMeta: true };
      }
    }
    return { text: FALLBACK_ATTR, fromMeta: false };
  }
  function readReports() {
    try { if (P.store && typeof P.store.readReports === 'function') return P.store.readReports() || []; } catch (e) { /* yok say */ }
    return [];
  }

  function close() {
    if (!back) return;
    back.hidden = true;
    openName = null;
    if (returnTo && typeof returnTo.focus === 'function' && returnTo.isConnected) { try { returnTo.focus({ preventScroll: true }); } catch (e) { returnTo.focus(); } }
    returnTo = null;
  }
  function frame(title, body, acts) {
    U.clear(win);
    var tid = 'ov-title';
    win.setAttribute('aria-labelledby', tid);
    U.append(win, [
      h('div', { class: 'ov-head' }, [
        h('h2', { id: tid, class: 'ov-title', text: title }),
        h('button', { class: 'btn btn-no ov-x', type: 'button', 'aria-label': 'Kapat', onclick: close }, ['KAPAT', U.kbd('Esc')])
      ]),
      h('div', { class: 'ov-body' }, body),
      acts && acts.length ? h('div', { class: 'ov-acts' }, acts) : null
    ]);
  }

  /* ---------- Nasıl oynanır ---------- */
  function help() {
    var tiers = (U.cfg().TIERS || []).length ? U.cfg().TIERS : [
      { id: 'tam', label: 'TAM İSABET', points: 100 }, { id: 'cokyakin', label: 'ÇOK YAKIN', points: 70 },
      { id: 'yakin', label: 'YAKIN', points: 50 }, { id: 'uzak', label: 'UZAK', points: 30 }, { id: 'zayif', label: 'ZAYIF', points: 10 }];
    var dirs = [
      ['↑', 'yaygin', 'YAYGIN', 'En çok yazılan cevabı söyle.'],
      ['↓', 'nadir', 'NADİR', 'En az yazılan ama geçerli cevabı söyle.'],
      ['←', 'eski', 'EN ESKİ', 'En erken tarihli cevabı söyle.'],
      ['→', 'yeni', 'EN YENİ', 'En geç tarihli cevabı söyle.'],
      ['✦', 'karma', 'KARMA', 'Çapraz uçlar: iki ölçüt birden (ör. hem eski hem yaygın).']
    ];
    frame('NASIL OYNANIR', [
      h('p', { class: 'ov-lead' }, ['Her soru aynı kalıpta: ', h('b', { text: 'Bir tane ___ söyle.' }), ' Aklına gelen cevabı yaz; puanını pusulada seçtiğin yön belirler.']),
      h('div', { class: 'ov-dirs' }, dirs.map(function (d) {
        return h('div', { class: 'ov-dir' }, [
          h('span', { class: 'ar', style: 'color:var(--mode-' + d[1] + ')', text: d[0] }),
          h('b', { style: 'color:var(--mode-' + d[1] + ')', text: d[2] }),
          h('span', { text: d[3] })
        ]);
      })),
      h('div', { class: 'ov-cols' }, [
        h('div', null, [
          h('div', { class: 'over', text: 'GÜNÜN ROTASI' }),
          h('p', { text: 'Dört ana yönden 5’er soru, toplam 20. Rota herkes için aynıdır ve serini belirler; bacakları istediğin sırayla oyna.' }),
          h('div', { class: 'over', text: 'SÜRE VE CEVAP' }),
          h('p', { text: 'Her soruda 30 saniye. 10 saniye sonra GEÇ açılır. Yazım hatasında “Şunu mu demek istedin?” diye sorulur. Havuzda bulunmayan bir cevabı BİLDİR ile işaretleyebilirsin.' })
        ]),
        h('div', null, [
          h('div', { class: 'over', text: 'PUAN (SORU BAŞI)' }),
          h('div', { class: 'ov-tiers' }, tiers.map(function (t) {
            return h('div', null, [h('i', { style: 'background:var(--tier-' + t.id + ')' }), h('span', { text: t.label }), h('b', { text: String(t.points) })]);
          })),
          h('p', { class: 'ov-small', text: 'Tur 5 soru, en çok 500 puan; günün rotası en çok 2000 puan. KARMA modunda soru puanı 0–100 arası sürekli yüzdeliktir (en iyi cevap 100, en kötü 0). Paylar yapay zekâ tahminidir.' })
        ])
      ]),
      h('div', { class: 'over', text: 'KLAVYE' }),
      h('div', { class: 'ov-keys' }, [
        h('span', null, [U.kbd('↑'), U.kbd('↓'), U.kbd('←'), U.kbd('→'), 'yön (iki ok: çapraz)']),
        h('span', null, [U.kbd('Q'), U.kbd('W'), U.kbd('E'), U.kbd('A'), U.kbd('D'), U.kbd('Z'), U.kbd('X'), U.kbd('C'), 'yön']),
        h('span', null, [U.kbd('S'), 'ya da ', U.kbd('5'), 'günün rotası']),
        h('span', null, [U.kbd('↵'), 'başla / gönder']),
        h('span', null, [U.kbd('Esc'), 'menü'])
      ])
    ], [h('button', { class: 'btn btn-primary', type: 'button', onclick: close }, ['ANLADIM', U.kbd('↵')])]);
  }

  /* ---------- Hakkında ---------- */
  function about() {
    var a = metaAttribution();
    var n = readReports().length || sessionReports;
    frame('HAKKINDA', [
      h('p', { class: 'ov-lead' }, [h('b', { text: 'PUSULLA' }), ' — günlük yön bulmacası. Herkesin aklına gelen mi, kimsenin bilmediği mi? Bir yön seç, bir tane söyle.']),
      h('div', { class: 'over', text: 'VERİ VE ATIF' }),
      h('p', { class: 'ov-attr', text: a.text }),
      asOf ? h('p', { class: 'ov-small', text: 'Veri tarihi: ' + asOf + '. Bu tarihten yeni cevaplar havuzda olmayabilir; BİLDİR ile işaretleyebilirsin.' }) : null,
      h('div', { class: 'over', text: 'GİZLİLİK' }),
      h('p', { class: 'ov-small', text: 'Oyun internete bağlanmaz. İlerlemen ve bildirimlerin yalnız bu tarayıcıda saklanır; kimlik bilgisi tutulmaz.' }),
      P.version ? h('p', { class: 'ov-small', text: 'Sürüm ' + P.version }) : null
    ], [
      h('button', { class: 'btn btn-ghost', type: 'button', onclick: function () { open('reports'); } }, ['BİLDİRİMLERİM (' + n + ')']),
      h('button', { class: 'btn btn-primary', type: 'button', onclick: close }, ['TAMAM', U.kbd('↵')])
    ]);
  }

  /* ---------- Bildirimlerim ---------- */
  function reports() {
    var list = readReports();
    var status = h('span', { class: 'note', 'aria-live': 'polite' });
    var body = [];
    if (!list.length) {
      body.push(h('p', { class: 'ov-lead', text: sessionReports ? 'Bu oturumda ' + sessionReports + ' bildirim yapıldı, ama kalıcı kayıt bulunamadı (deneme modu ya da tarayıcı depolaması kapalı).' : 'Henüz bildirim yok. Havuzda olmayan bir cevap yazdığında BİLDİR ile işaretleyebilirsin.' }));
    } else {
      body.push(h('p', { class: 'ov-small', text: list.length + ' kayıt. Panoya kopyalayıp geliştiriciye iletebilirsin; kimlik bilgisi içermez.' }));
      var tbl = h('div', { class: 'rep-list', role: 'table', 'aria-label': 'Bildirimlerim' });
      tbl.appendChild(h('div', { class: 'rep rep--head', role: 'row' }, ['TARİH', 'SORU', 'YAZDIĞIN', 'TÜR'].map(function (t) { return h('span', { role: 'columnheader', text: t }); })));
      list.slice().reverse().forEach(function (r) {
        r = r || {};
        tbl.appendChild(h('div', { class: 'rep', role: 'row' }, [
          h('span', { text: String(r.d || '') }),
          h('span', { class: 'rep-q', text: String(r.q || '') }),
          h('b', { text: String(r.t || '') }),
          h('span', { text: KIND[r.k] || String(r.k || '') })
        ]));
      });
      body.push(tbl);
    }
    var canClear = !!(P.store && typeof P.store.clearReports === 'function') && list.length > 0;
    var armed = false, timer = null;
    var clearBtn = h('button', { class: 'btn btn-no', type: 'button', disabled: !canClear }, ['TEMİZLE']);
    clearBtn.addEventListener('click', function () {
      if (!armed) {
        armed = true; clearBtn.firstChild.textContent = 'EMİN MİSİN? TEMİZLE'; clearBtn.classList.add('btn-danger');
        timer = global.setTimeout(function () { armed = false; clearBtn.firstChild.textContent = 'TEMİZLE'; clearBtn.classList.remove('btn-danger'); }, 3500);
        return;
      }
      if (timer) global.clearTimeout(timer);
      try { P.store.clearReports(); } catch (e) { /* yok say */ }
      sessionReports = 0;
      reports();
      var s = win.querySelector('.note'); if (s) s.textContent = 'Bildirimler temizlendi.';
    });
    frame('BİLDİRİMLERİM', body, [
      h('button', { class: 'btn btn-primary', type: 'button', disabled: !list.length, onclick: function () { copyJSON(list, status); } }, ['PANOYA KOPYALA (JSON)']),
      clearBtn,
      status
    ]);
  }
  function copyJSON(list, status) {
    var txt = JSON.stringify(list, null, 2);
    function fallback() {
      var ta = h('textarea', { class: 'sr', 'aria-hidden': 'true' });
      ta.value = txt; win.appendChild(ta); ta.select();
      var ok = false;
      try { ok = doc.execCommand('copy'); } catch (e) { ok = false; }
      win.removeChild(ta);
      status.textContent = ok ? 'Panoya kopyalandı.' : 'Kopyalanamadı; tarayıcı izin vermedi.';
    }
    if (global.navigator && global.navigator.clipboard && global.navigator.clipboard.writeText) {
      global.navigator.clipboard.writeText(txt).then(function () { status.textContent = 'Panoya kopyalandı.'; }, fallback);
    } else fallback();
  }

  function open(name) {
    if (!back) return;
    if (!openName) returnTo = doc.activeElement;
    openName = name;
    win.setAttribute('data-name', name);
    if (name === 'help') help(); else if (name === 'about') about(); else reports();
    back.hidden = false;
    var first = win.querySelector('.ov-acts .btn-primary:not([disabled])') || win.querySelector('.btn');
    if (first) { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') {
      var f = Array.prototype.filter.call(win.querySelectorAll('button:not([disabled]), [tabindex="0"]'), function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var i = f.indexOf(doc.activeElement);
      if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && (i === f.length - 1 || i < 0)) { e.preventDefault(); f[0].focus(); }
    }
  }

  ui.parts.overlay = {
    init: function (root) {
      back = h('div', { class: 'ov-back', hidden: true });
      win = h('div', { class: 'ov-win', role: 'dialog', 'aria-modal': 'true' });
      back.appendChild(win);
      back.addEventListener('mousedown', function (e) { if (e.target === back) close(); });
      root.appendChild(back);
    },
    open: open, close: close, onKey: onKey,
    isOpen: function () { return !!openName; },
    events: {
      'app:ready': function (d) { asOf = d && d.asOf; },
      'report:saved': function (d) { sessionReports = (d && d.count) || sessionReports + 1; },
      'mode:start': function () { close(); }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
