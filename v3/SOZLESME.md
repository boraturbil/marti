### 2.9 Arayüz sözleşmesi (motor ↔ görsel ↔ ses) — ÇAKIŞMASIZ PARALEL ÇALIŞMANIN TEMELİ
Motor (agy) DOM çizmez; durum makinesi + olay yayar + `body` veri öznitelikleri koyar. Görsel katman (arkadaş) çizer ve kullanıcı girişini `actions`'a iletir. Ses (kullanıcı) yalnız olay dinler. Motor ilk fazda bu sözleşmeyi **stub** ile karşılar; görsel ve ses motor bitmeden ilerler.

**Ad alanı:** `window.PUSULLA = { version, config, events, actions, state, scene, sound, ui }` (`v3/bus.js` kurar, ilk yüklenen motor dosyası).
**Olay veriyolu (`bus.js`, motor sahibi):** `PUSULLA.events.on(ad, fn)`, `.off(ad, fn)`, `.once(ad, fn)`, `.emit(ad, veri)`; dinleyici hatası yakalanır ve konsola yazılır, oyunu durdurmaz. `?debug` ile tüm olaylar konsola düşer.

| olay | veri (alanlar) | kim dinler |
|---|---|---|
| `app:ready` | `{asOf, modes, keymap}` | görsel, ses |
| `menu:show` | `{dailyProgress:{yaygin:3,…}, best, streak}` | görsel |
| `menu:focus` | `{modeId}` | görsel, ses (iğne tıkı) |
| `mode:start` | `{modeId, daily:bool, total:5}` | görsel, ses |
| `question:show` | `{index, total, modeId, subject, text, scope, closed, poolSize}` | görsel |
| `timer:tick` | `{left, total}` (saniyede 4 kez) | görsel |
| `timer:warn` | `{left}` (son 5 sn, her saniye) | ses |
| `answer:valid` | `{label, raw, fuzzy:bool, tierId, points, year, share}` | görsel, ses |
| `answer:invalid` | `{raw, reason}` | görsel, ses |
| `answer:none` | `{raw, newerThanAsOf:bool, canReport:true}` | görsel, ses |
| `answer:pass` / `answer:timeout` | `{}` | görsel, ses |
| `result:show` | `{kind:'time'|'pop'|'combo', modeId, tierId, points, player:{label,year,share,rankT,rankP}, best:[…], dots:[{label,year,approx,share,info,src,isPlayer,isBest}], poolSize}` | görsel |
| `era:change` | `{eraId, year}` | görsel (sahne), ses |
| `round:end` | `{modeId, score, max:500, rows:[…]}` | görsel, ses |
| `day:complete` | `{score, max:2000, streak, shareText}` | görsel, ses |
| `report:saved` | `{count}` | görsel |
| `stats:show` | `{…store özeti}` | görsel |

**Eylemler (UI → motor, `game.js`):** `actions.startDaily()`, `selectMode(modeId)`, `submit(text)`, `pass()`, `next()`, `toMenu()`, `report()`, `copyShare()`, `showStats()`. Hepsi senkron ve idempotent (çift Enter koruması motorda).
**Durum okuma:** `PUSULLA.state.get()` → salt-okunur kopya `{phase, modeId, index, score, question, lastResult}`.
**DOM kancaları:** motor yalnız şunları yazar: `<body data-phase="menu|question|result|summary|stats" data-mode="<modeId>" data-era="<eraId>">`. Görsel katman `#app` kabının içini tümüyle yönetir. Kök kap `<div id="app"></div>` index.html'de sabittir.
**CSS değişkenleri (adları sözleşme, değerleri arkadaşın):** `--mode-yaygin, --mode-nadir, --mode-eski, --mode-yeni, --mode-klasik, --mode-gundem, --mode-antika, --mode-kesif, --tier-tam, --tier-cokyakin, --tier-yakin, --tier-uzak, --tier-zayif, --ok, --bad`. Stub da bunları kullanır.
**Sahne API (arkadaş uygular):** `PUSULLA.scene = { setScene(eraId, {year, modeId}), setMode(modeId) }`; motor `era:change` yaydıktan sonra `scene.setScene` çağırır; yoksa no-op stub.
**Ses API (kullanıcı uygular):** `PUSULLA.sound = { setEnabled(bool), isEnabled() }`; ses dosyası olayları kendisi dinler; `M` tuşunu ses dosyası yakalar.
**UI kaydı:** arkadaşın UI'si yüklenince `PUSULLA.ui = { name:'gorsel', mount(rootEl) }` koyar; motor `app:ready` öncesi `ui.mount` çağırır. `PUSULLA.ui` yoksa motorun `ui_stub.js`'i düz DOM ile çalışır (test ve geliştirme için yeterli, güzel değil).
**index.html bölgeleri:** dosya agy'nindir; içinde iki sahipli blok vardır, sahibi dışında kimse değiştirmez:
`<!-- GORSEL:BASLA --> … <!-- GORSEL:BITIR -->` (arkadaş: `style.css`, `ui/*.js`, `scenes/*.js` etiketleri) ve `<!-- SES:BASLA --> … <!-- SES:BITIR -->` (kullanıcı: `sound.js`).
Yükleme sırası (sabit): `bus.js, config.js, data/_meta.js, data/q_*.js, matcher.js, engine.js, daily.js, store.js` → SES bloğu → GORSEL bloğu → `ui_stub.js, game.js`. Havuz dosyaları (`data/pool/*.js`) motor tarafından ihtiyaçta dinamik `<script>` ile yüklenir (file:// uyumlu).
**Sözleşme değişikliği:** yalnız ekleme yapılır (geriye uyumlu); kaldırma/ad değiştirme için `v3/SOZLESME.md`'ye öneri yazılır, kullanıcı onaylar. `SOZLESME.md` bu bölümün birebir kopyasıdır (F1'de agy yazar), sahibi ana oturum.

---

## ÖNERİ (F1 İşçi A — Geriye Uyumlu Eklemeler)

1. **Yazım hatası onayı ("Şunu mu demek istedin?"):**
   - Yeni olay: `answer:confirm` — veri `{ raw, suggestion, label }` (görsel, ses dinler). Otomatik kabul yerine kullanıcı onayı istendiğinde yayılır.
   - Yeni eylem: `actions.confirmSuggestion(accept)` (`true`: öneriyi kabul et, `false`: reddet ve girişe dön).
2. **Menüde tek KARMA mod girişi:**
   - 4 çapraz uç (`klasik`, `gundem`, `antika`, `kesif`) sözleşmede `modeId` ve CSS değişkeni olarak korunur; menüde tek bir `karma` modu sunulması için `modes` listesinde `karma` (ve `--mode-karma` opsiyonel değişkeni) kullanılabilir.
3. **NADİR modda havuzda olup pay listesinde olmayan geçerli cevap:**
   - `answer:valid` ve `result:show` olaylarında `share: null` iken `points: 100`, `tierId: 'tam'` dönebilir.
4. **Menü odak eylemi:**
   - `actions.focusMode(modeId)` eklenebilir (`menu:focus` olayını tetikler).
5. **`index.html` script sırası ve blok işaretçileri:**
   - F1 iskeletinde `config.js, store.js, daily.js, bus.js, ui_stub.js, game.js` sırası ve `<!-- BEGIN GORSEL -->` / `<!-- GORSEL:BASLA -->` işaretçileri birlikte desteklenmiştir.
