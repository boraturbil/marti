# PUSULLA (v3) — Plan ve agy iş emri
Tarih: 2026-11-22 · Yazan: Claude Opus planlayıcı · Durum: KARARLAR İŞLENDİ, uygulamaya hazır (açık sorular §8.2)
Kapsam: `D:\martı\v3\` (yeni klasör). v1 (kök) ve v2 (`v2\`) DOKUNULMAZ. Saf HTML/CSS/JS, klasik `<script src>` (module yok),
file:// ile açılır, oyun çalışırken ağ/API/fetch yok, harici kütüphane/font yok, yalnız PC (klavye + fare). Tüm dosyalar UTF-8, `<meta charset="utf-8">`.
Bağlı belgeler: `notlar/KARARLAR_2026-11-22.md` (çelişkide O geçerli), `notlar/VERI_KAYNAKLARI.md` (kaynak/lisans araştırması),
`notlar/MOD_ESKI_ICAT_TASARIM.md` (İCAT eşya sözlüğü ve çağ fikri; v3'te İCAT elle havuzunun ve dönem sahnelerinin kaynağı),
`notlar/ARKADAS_GORSEL_PROMPT.md` (görsel tasarımcının Claude'una verilecek prompt).

> ### Güncelleme 2026-11-22 (kullanıcı kararları + veri araştırması + görev paylaşımı)
> 1. **Ad: PUSULLA** (pusulla.io). KERTERİZ/PUSULA adları kaldırıldı; depolama anahtarı `pusulla.v3`, tohum `'pusulla|'`. (§1.2)
> 2. **Günlük rota: 4 ana uç × 5 soru = 20 soru/gün**, aynı gün aynı soru yok; karma modlar yalnız serbest oyunda. Tur = 5 soru, tur en çok 500, gün en çok 2000. (§2.6, §2.7)
> 3. **Tekrarsız gün hesabı yeniden yapıldı:** 150 soru → 7 gün, 42 soru → 2 gün; W gün penceresi için 20·W soru gerekir; öneri v3.0 = 300 soru (15 gün). (§2.8)
> **SON KARARLAR (2. tur, KARARLAR madde 8-9, bu plandaki çelişkili satırları geçersiz kılar):** (a) Hedef 300 soru. (b) 4 ana yön = NORMAL modlar (YAYGIN/NADİR/EN ESKİ/EN YENİ); 4 çapraz uç ayrı ayrı DEĞİL, menüde TEK bir KARMA mod (karma havuz). (c) Yazım hatasında otomatik kabul yok: "Şunu mu demek istedin?" onayı sorulur. (d) NADİR'de havuzda olup pay listesinde olmayan geçerli cevap = TAM PUAN (100); koşul: havuz geniş, check.js havuz genişliğini sınar (§2.7, §8.2-S3 bu karara göre uygulanır). (e) Rota numaralaması başlangıcı 2026-12-01.
> 4. **İki eksenli sorular tek eksenli modlara da girer**; **açık konular (film/şarkı…) zaman modlarına girer**: `closed` artık "tüm üyeler havuzda + beklenen sayı belli" demek; açık havuzda zaman puanı yıl farkıyla. (§2.7, §4.1)
> 5. **YENİ VERİ HATTI:** cevap havuzu kuralı; Wikidata (CC0) ana kaynak + trwiki başlık/yönlendirme + GeoNames (CC BY) + Natural Earth; IMDb/MovieLens/TMDB/TDK/OpenFoodFacts YOK. Build-time Node betikleri `v3/tools/harvest/00..70` → `v3/data/pool/*.js`; gzip ~500 KB bütçe. (§3, §4)
> 6. **Şema genişledi:** `pool`, `closed`, `expect`, `aliases`, `year+yearKind+src`, `curated`, `share` (yalnız AI, `estimated:true`), elle tamamlama `v3/data/manual/*.js`. (§3)
> 7. **Eşleştirici v3'te yeniden yazılır** (önceden indeks, ASCII katlama, ek soyma, sınırlı bulanık eşleşme); "havuzda yok → BİLDİR" yerel kayıt. (§5)
> 8. **Görev paylaşımı (yeni karar):** genel görsel tasarım = kullanıcının ARKADAŞI (kendi Claude'u), ses tasarımı = KULLANICI, agy = motor + veri hattı + içerik + test. Arayüz sözleşmesi (olay veriyolu, DOM kancaları, CSS değişkenleri, `setScene`) §2.9'da; motor önce sözleşmeye uyan iskelet + stub verir. (§2.9, §7)
> 9. **Fazlar yeniden yazıldı:** F0 sonda → F1 iskelet+sözleşme → F2 motor → F3 veri hattı → F4 demo içerik (42 soru) → F5 entegrasyon testi; her fazda kullanıcıya gösterilecek çıktı tanımlı. (§7)
> 10. Çözülmüş eski açık sorular (ad, günlük yapı, iki eksen, mod adları, demo, açık konular) silindi; kalan 5 soru §8.2.

---

## 1. Konsept, ad, görsel/ses yönü

### 1.1 Konsept
Her soru aynı kalıpta: **"Bir tane ___ söyle."** (TARAYICI, ÇORBA, İSTANBUL İLÇESİ…). Oyuncu serbest yazar.
Ana ekran bir **pusula gülü**; her yön bir mod (mod adları onaylı):

| Yön | Mod | Hedef | Doğru cevap türü |
|---|---|---|---|
| K ↑ | **YAYGIN** | en çok yazılan | pay (%) — AI tahmini |
| G ↓ | **NADİR** | en az yazılan ama geçerli | pay (%) — AI tahmini |
| B ← | **EN ESKİ** | en erken tarihli | yıl — olgusal, kaynaklı |
| D → | **EN YENİ** | en geç tarihli | yıl — olgusal, kaynaklı |
| KB ↖ | **KLASİK** (Eski+Yaygın) | hem eski hem yaygın | yıl + pay |
| KD ↗ | **GÜNDEM** (Yeni+Yaygın) | hem yeni hem yaygın | yıl + pay |
| GB ↙ | **ANTİKA** (Eski+Nadir) | hem eski hem nadir | yıl + pay |
| GD ↘ | **KEŞİF** (Yeni+Nadir) | hem yeni hem nadir | yıl + pay |

4 ana uç büyük, 4 ara uç (karma) küçük çizilir. Mod kimlikleri (kodda sabit): `yaygin, nadir, eski, yeni, klasik, gundem, antika, kesif`, günlük rota `rota`.

### 1.2 Ad
**PUSULLA** (kesin; alan adı pusulla.io). Görünen ad her yerde "PUSULLA"; kod anahtarları `pusulla.v3`. "pusula gülü" yalnız arayüz nesnesinin adıdır.

### 1.3 Görsel yön (SAHİBİ: arkadaş; aşağısı başlangıç önerisidir, bağlayıcı olan §2.9 sözleşmesi)
- Vektör (inline SVG), piksel değil; v2'nin 384×216 sahnesi ve martı varlıkları kullanılmaz. Üslup önerisi "gece haritası / seyir aleti": koyu zemin, fildişi ince çizgi, pirinç vurgu.
- Mod renk önerisi: YAYGIN altın `#f2c14e`, NADİR mor `#9b7be0`, ESKİ sepya-bakır `#c8875a`, YENİ camgöbeği `#4fc3c7`; karmalar iki ana rengin karışımı. Doğru `#7bc96f`, geçersiz `#e2685c`.
- Tipografi harici font olmadan (serif başlık + sistem sans arayüz, `tabular-nums` rakamlar); Türkçe büyük harf `toLocaleUpperCase('tr-TR')`.
- Sonuç grafikleri: ESKİ/YENİ zaman şeridi, YAYGIN/NADİR sıralı liste, karma iki eksenli mini harita; her noktada hover/Tab bilgi kartı (yalnız kaynaklı olgu; payda "tahmini", yaklaşık yılda "~" rozeti).
- Animasyon önerisi: iğne yay sönümüyle döner, mod seçiminde pusula rozete küçülür, şerit soldan sağa çizilir; `prefers-reduced-motion` saygısı; GSAP vb. yok.

### 1.4 Dönem sahneleri (SAHİBİ: arkadaş; kimlikler sözleşmedir)
Yıla göre 8 dönem (motor `engine.eraOf(year)` ile hesaplar, `setScene(eraId)` çağırır):
`antik (<500)`, `ortacag (500–1449)`, `erken_modern (1450–1799)`, `sanayi (1800–1899)`, `yy20_basi (1900–1949)`, `elektronik (1950–1989)`, `dijital (1990–2009)`, `akilli (2010+)`, ayrıca nötr `simdi` (menü/zaman dışı modlar).
Fikir kaynağı `MOD_ESKI_ICAT_TASARIM.md` §1-2 ("doğru cevabın dönemine sahne döner"); v3'te yalnız arka plan katmanı değişir, okunurluk bozulmaz.

### 1.5 Ses (SAHİBİ: kullanıcı)
`v3/sound.js` kullanıcıya aittir; motor ses çalmaz, yalnız §2.9 olaylarını yayar. Eski öneri (iğne tıkı, puana göre arpej, "listede yok" için yumuşak tok, `M` ile aç/kapa, ilk etkileşimden önce AudioContext açılmaz) kullanıcıya bilgi olarak kalır.

---

## 2. Ekranlar, akış, puan, sözleşme

### 2.1 Ana pusula (menü)
- Ortada pusula gülü; merkezde **GÜNÜN ROTASI**. 8 uç = 8 mod; ana uçlarda bugünkü rota ilerlemesi ("3/5").
- **Fare:** uca hover → iğne döner + açıklama; tık → mod; merkeze tık → Günün Rotası.
- **Klavye:** `↑ ↓ ← →` ana uçlar; çapraz için iki ok birlikte **ya da** ikinci ok 250 ms içinde; numpad `7 8 9 / 4 5 6 / 1 2 3` (5 = rota) ve `Q W E / A S D / Z X C` (S = rota). `Enter`/`Space` başlatır, `Esc` menü. Odak halkası görünür.
- Klavye/fare girişini UI katmanı yakalar ve `PUSULLA.actions.*` çağırır (§2.9); kısayol tablosu motorun `config.js` `KEYMAP` sabitindedir (UI okur).

### 2.2 Soru ekranı
Üstte mod adı + hedef cümlesi ("EN ESKİ olanı söyle"), büyük soru ("Bir tane **TARAYICI** söyle."), `scope` satırı (ör. "2025-26 sezonu"), tek satır giriş + GÖNDER, 30 sn süre (10 sn sonra veya ilk `none`dan sonra GEÇ), **5 ilerleme kutusu**, geri bildirim satırı (§5.3 mesajları).

### 2.3 Sonuç paneli
Puan katmanı (TAM İSABET / ÇOK YAKIN / YAKIN / UZAK / ZAYIF), puan, tek cümle; grafik türü moda göre (§1.3). Açık havuzda grafikte en çok 60 nokta: oyuncu, hedef uç(lar), pay listesi (top-K) ve yıl dağılımından örneklem; "havuzda N aday" yazılır. Yazma alanı gizli, SONRAKİ ile döner (v2 kararı).

### 2.4 Tur özeti
5 satır: konu, cevabın, katman, puan; toplam /500. Rota bitince günlük özet: 4 bacak × 5 kare, toplam /2000, "bugünün en iyi cevapları".

### 2.5 Seri / istatistik / paylaşım
- `localStorage` anahtarı `pusulla.v3` (try/catch; yoksa bellek içi, v2 `getStorageBackend`). Bildirimler ayrı anahtar `pusulla.v3.reports` (§5.4).
- Seri: Günün Rotası'nın 4 bacağı bitince artar (§8.2-S2). İstatistik: oynanan gün, seri, en iyi, mod ortalaması, katman dağılımı.
- Paylaşım (panoya): `PUSULLA #12 · 1540/2000` + 4 satır `↑🟨🟩🟦🟨🟥` (yön oku + 5 katman karesi; cevap sızdırılmaz).

### 2.6 Günün Rotası ve serbest oyun
- **GÜNÜN ROTASI (günlük, seriyi belirler):** 4 bacak: YAYGIN 5, EN YENİ 5, NADİR 5, EN ESKİ 5 = **20 soru**. Bacaklar pusuladan herhangi sırayla açılabilir; yarım bacak F5 sonrası devam eder (v2 `pending`). Tarih tohumlu (`fnv1a('pusulla|'+döngü)` + `mulberry32`), herkese aynı. **Aynı gün aynı soru iki kez çıkmaz** (bir sorunun eksenleri ne olursa olsun günde tek bacakta).
- **Uygunluk:** T (yalnız zaman) → ESKİ/YENİ; P (yalnız pay) → YAYGIN/NADİR; B (iki eksen) → 4 ana uç + 4 karma. Açık ve kapalı kümeler bütün uygun modlara girer (karar 3 ve 6).
- **Seçici (`daily.js`):** havuz döngüsü = `floor(N/20)` gün; döngü başında tohumlu karıştırma, sonra her güne 20 soru: önce T'ler zaman bacaklarına, P'ler pay bacaklarına, B'ler açığı kapatır; döngü içinde soru tekrarı yok; döngü sınırında son 3 günün soruları ilk 3 güne konmaz.
- **SERBEST:** 8 mod, 5 soruluk tur, seri/istatistiği etkilemez; oturumda son 40 soru dışlanır; o günün rota soruları serbestte o gün çıkmaz.

### 2.7 Puanlama (soru başı en çok 100, tur 500, gün 2000)
- **Zaman sırası (kapalı küme)** `rt(a)` = 1 + (a'dan kesin eski aday sayısı) [ESKİ], YENİ'de tersi; aynı yıl = aynı sıra, `date` (YYYY-MM) ayırır. `d=(r-1)/(N-1)`: `r=1 → 100`, `d≤0.10 → 70`, `≤0.25 → 50`, `≤0.50 → 30`, aksi `10`.
- **Zaman (açık küme):** hedef yıl `y*` = havuzdaki en küçük (ESKİ) / en büyük (YENİ, `asOf` yılını geçemez) yıl; `dy=|y−y*|/(ymax−ymin)`: `y==y* → 100` (aynı yıldaki herkes), `dy≤0.03 → 70`, `≤0.10 → 50`, `≤0.30 → 30`, aksi `10`. Yılı olmayan havuz satırı zaman modunda "geçerli ama yılsız" → 10 + mesaj.
- **Pay:** YAYGIN `rp=1 → 100`, `d≤0.10 → 70`, `≤0.25 → 50`, `≤0.50 → 30`, aksi 10; pay listesinde (top-K) olmayan satır YAYGIN'da 10. NADİR (v2 DİP, pay eşikli): `share≤0.5 → 100`, `≤1.5 → 70`, `≤4 → 50`, `≤10 → 30`, aksi 10; **pay listesinde olmayan (uzun kuyruk)** satır: varsayılan `sl` (sitelinks) havuz medyanı altındaysa 100, üstündeyse 70 (§8.2-S3).
- **Karma:** `D = sqrt(dt²+dp²)/√2`; açık kümede `dt` yıl yüzdeliği, `dp` pay sırası (kuyrukta `sl` yüzdeliği). `D==Dmin → 100`, `≤Dmin+0.10 → 70`, `≤+0.25 → 50`, `≤+0.45 → 30`, aksi 10.
- PAS / SÜRE: 0. Geçersiz ve havuzda-yok: puan yok, tekrar dene. Bulanık eşleşme puanı tam sayılır (UX §8.2-S4).
- Formüller `v3/engine.js` saf fonksiyonlar; `tools/score_test.js` ile node'da test.

### 2.8 Tekrarsız gün hesabı (20 soru/gün)
Tanım (katı): bir soru kimliği döngü bitmeden HİÇBİR modda tekrar gelmez. Gün sayısı = `floor(N/20)`.
Her gün 10 zaman yuvası (ESKİ+YENİ, T∪B'den) ve 10 pay yuvası (YAYGIN+NADİR, P∪B'den) gerekir. N = 20·W için koşul: **T ≤ N/2 ve P ≤ N/2** (B dengeyi kurar).

| havuz | dağılım T/P/B | tekrarsız gün | denge (B'nin zaman yuvasına giden kısmı x) |
|---|---|---|---|
| 42 (demo) | 12/14/16 | **2 gün** (40 soru kullanılır) | 8 ≤ x ≤ 10 ✓ |
| 150 | 40/50/60 | **7 gün** (140 soru) | 30 ≤ x ≤ 40 ✓ |
| 280 | — | 14 gün | T,P ≤ 140 |
| **300 (öneri v3.0)** | 60/80/160 | **15 gün** | x = 90 ✓ |
| 600 | — | 30 gün | T,P ≤ 300 |

Dipnot (varsayılan DEĞİL): aynı soru farklı günde farklı modda gelebilseydi (soru×mod çifti) 150 → 21 gün, 42 → 5 gün olurdu. Demo 2 günlük döngüyle çalışır; check.js `--demo` bayrağı takvim kuralını 2 güne gevşetir. Hedef soru sayısı kullanıcı kararı (§8.2-S1).

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

## 3. Veri şeması

### 3.1 Dosya düzeni ve sahiplik
```
v3/
  index.html          (agy; GORSEL/SES blokları hariç)   SOZLESME.md (ana oturum)
  bus.js config.js engine.js matcher.js daily.js store.js game.js ui_stub.js   (agy, motor)
  style.css  ui/*.js  scenes/*.js  assets/*.svg     (ARKADAŞ, görsel)
  sound.js  (+ sound/*)                             (KULLANICI, ses)
  data/
    _meta.js                (ASOF, yearKind sözlüğü, kategori tablosu, atıf metni)
    q_demo.js q_*.js        (sorular; dosya başı ≤ 50 soru)
    pool/<poolId>.js        (YALNIZ 60_emit üretir; elle düzenleme YASAK)
    manual/<poolId>.js      (elle tamamlama/düzeltme; tek yazma yeri)
    share/<qid>.js          (AI pay tahminleri, top-K)
  tools/
    check.js score_test.js match_test.js match_bench.js blind_test.js daily_sim.js pool_report.js
    harvest/ lib/ 00_probe.js 10_closed.js 20_geo.js 30_trwiki.js 40_open.js 50_merge.js 60_emit.js 70_reports.js
    harvest/.cache/ (ham yanıtlar, git'e girmez)  harvest/out/ (raporlar)  harvest/in/ (indirilen zip'ler, bildirim JSON'ları)
  brief/  rev/  shots/  README.md
```
Veri dosyaları UMD kalıbı: `(function(r){ … })(typeof window!=='undefined'?window:globalThis);` (node'da `require` edilebilir).

### 3.2 Soru alanları (`data/q_*.js` → `PUSULLA_QUESTIONS.push({...})`)
| alan | tür | zorunlu | açıklama |
|---|---|---|---|
| `id` | string | ✓ | `ist_ilce_01` |
| `cat` | string | ✓ | `_meta.js` kategori kimliği |
| `subject` / `text` | string | ✓ | `İSTANBUL İLÇESİ` / `Bir tane İSTANBUL İLÇESİ söyle.` (kalıp check.js ile) |
| `scope` | string | kapalıda ✓ | kümenin tanımı, ekranda küçük: "İstanbul'un 39 ilçesi (2026-11)" |
| `pool` | string | ✓ | havuz kimliği (`ist_ilce`); bir havuz birden çok soruya hizmet edebilir |
| `filter` | obje | – | havuzdan alt küme: `{minYear, maxYear, tag}` (ör. aynı film havuzundan "TÜRK FİLMİ") |
| `closed` | bool | ✓ | `true` = tüm üyeler havuzda ve `expect` belli (§4.1) |
| `expect` | int | kapalıda ✓ | beklenen üye sayısı; `authority`: sayının dayanağı ("İçişleri/trwiki İstanbul'un ilçeleri") |
| `yearKind` | string | zaman ekseninde ✓ | `kurulus, ilk-genel-surum, vizyon, ilk-yayin, piyasa-cikisi, kesif, firlatma, tahta-cikis, goreve-baslama, ilk-ev-sahipligi, ilk-sampiyonluk, icat-yaklasik` |
| `share` | obje | pay ekseninde ✓ | `{estimated:true, by:'agy-persona-2026-11', list:[['Kadıköy',9.5],…]}` top-K (kapalıda tüm üyeler, açıkta K=40) |
| `invalid` | dizi | ✓ | `{aliases, reason}` (v2 ile aynı), en az 2 grup |
| `asOf` | string | – | yoksa `_meta.ASOF` (`2026-11`) |

### 3.3 Havuz dosyası (`data/pool/<poolId>.js`, 60_emit çıktısı)
```js
(function(r){ (r.PUSULLA_POOLS = r.PUSULLA_POOLS || {})['ist_ilce'] = {
  id:'ist_ilce', asOf:'2026-11', closed:true, expect:39, yearKind:'kurulus',
  sources:['wikidata','geonames','manual'], license:['CC0','CC BY 4.0'],
  cols:['label','aliases','year','src','sl','f'],
  rows:[ ['Üsküdar',['uskudar'],null,'Q…',41,0],          // src: Wikidata QID | 'tr:Başlık' | 'gn:<id>' | 'm' (manual)
         ['Sultangazi',[],2008,'m',12,2] ]               // f bit: 1=approx yıl, 2=curated (elle), 4=yıl doğrulandı, 8=alias incelemede
}; })(typeof window!=='undefined'?window:globalThis);
```
- `label` Türkçe doğal yazım (trwiki başlığı > Wikidata tr etiketi > en etiketi yalnız marka/film/oyun gibi Latin adlarda).
- `aliases` yalnız süzgeçten geçen varyantlar (§4.6); ASCII katlanmış hâl YAZILMAZ (matcher üretir).
- `year` int veya null; negatif = M.Ö.; çoklu tarihte MIN + aralık >1 yıl ise `approx`. `yearKind` havuz düzeyinde.
- `sl` Wikidata sitelinks sayısı: YALNIZ sıralama/kuyruk vekili; asla `share` yerine yazılmaz ve yüzdeye çevrilmez.
- Oyunda gösterilen kaynak: `src` QID ise "Vikiveri", `tr:` ise "Vikipedi: Başlık", `m` ise manual dosyasındaki not.

### 3.4 Elle tamamlama (`data/manual/<poolId>.js`; `curated`)
```js
(function(r){ (r.PUSULLA_MANUAL = r.PUSULLA_MANUAL || {})['ist_ilce'] = {
  add:   [ {label:'Sultangazi', aliases:[], year:2008, src:'tr:Sultangazi', note:'Wikidata P31 farklı sınıf'} ],
  drop:  [ {label:'…', note:'tarihî ilçe, bugün yok'} ],
  alias: { 'Beşiktaş':['bjk değil — kulüp','!bjk'] },   // '!' önekli = kaldır
  year:  { 'Ataşehir':{year:2008, note:'tr:Ataşehir'} },
  verifiedBy: 'haiku-2026-11-xx'
}; })(…);
```
50_merge sırası: kaynak satırları → `drop` → `add` (`f|=2`) → `alias` → `year`. Her `add`/`year` girişinde `src` veya `note` zorunlu (uydurma yasak). Halk kategorileri (çorba, kahvaltılık, İCAT) baştan manual dosyasıdır.

### 3.5 Eksen uygunluğu (alanlardan türetilir, `engine.axesOf(q)`)
- **Zaman** = soruda `yearKind` + havuz (filtre sonrası) satırlarının **kapalıda %100'ünde, açıkta ≥ %90'ında** `year` var. Açıkta yılsız satırlar geçerli cevaptır ama zaman puanı 10.
- **Pay** = `share.estimated===true`, `list` ≥ 10 (kapalıda tüm üyeler), toplam 99–101.
- İkisi → B (4 ana uç + 4 karma); yalnız biri → T veya P. `CFG.BOTH_FEEDS_SINGLE = true` (karar 3). Elle `axes` alanı YOK.

### 3.6 Boyut bütçesi ve yükleme
- Hedef: tüm `data/` toplamı **ham ≤ 1,8 MB, gzip ≈ 500 KB**; ilk açılış (motor + sorular + `_meta`) ≤ 150 KB ham.
- Havuz tavanı: açık havuz ≤ 5000 satır ve ≤ 250 KB ham; büyük açık havuzlar `sl` sırasıyla kırpılır (en düşük `sl` atılır, `pool_report` kaç satır atıldığını yazar).
- Havuz, sorusu başlarken dinamik `<script src="data/pool/x.js">` ile yüklenir; bir sonraki sorunun havuzu arka planda önden yüklenir; yüklenemezse soru atlanır ve konsola yazılır. Eşleştirme indeksi havuz başına bir kez kurulur (§5.1).

---

## 4. Veri hattı (build-time; oyun çalışırken API yok)

### 4.1 Cevap havuzu kuralı (KARAR 7) — kapalı / açık küme
- **Kapalı küme (`closed:true`):** üyeler sayılabilir, dayanaklı bir `expect` sayısı ve `scope` metni vardır (39 ilçe, 81 il, 118 element, 2025-26 Süper Lig'in 18 takımı, BM üyesi+gözlemci 195 ülke…). **Havuz = tüm üyeler**; `rows.length === expect` değilse check HATA. Doğru bir üyeyi yazan oyuncu ASLA "havuzda yok" görmez. Zaman sırası rank tabanlı (§2.7).
- **Açık küme (`closed:false`):** `expect` yazılamıyorsa açıktır (tarayıcı, işletim sistemi, konsol, programlama dili, marka, havayolu, film, dizi, şarkı, oyun, şehir, meyve, meslek…). Havuz **olabildiğince geniş** (bütçe §3.6), zaman puanı yıl farkıyla (§2.7). Açık konular zaman modlarına girer (karar 6).
- **YENİ modunda güncellik:** havuz `asOf` tarihinde donar; `none` olunca mesaj "Veri tarihim 2026-11; bu daha yeni olabilir" + BİLDİR (§5.4). Yılda en az bir hasat yenilemesi.
- **Antik/yaklaşık yıllar:** `approx` + ekranda "~" ve "yaklaşık"; beraberlikte hepsi TAM İSABET.

### 4.2 Kaynaklar ve lisans (ayrıntı `VERI_KAYNAKLARI.md`)
| kaynak | ne için | lisans / atıf |
|---|---|---|
| **Wikidata** (query.wikidata.org SPARQL) | ANA: üyeler, tr etiket/altLabel, yıl, sitelinks, trwiki başlığı | CC0 |
| **trwiki** MediaWiki API (`categorymembers`, `allredirects`) | yalnız **başlık + yönlendirme** (alias) ve kategori üyeliği; madde metni kopyalanmaz | CC BY-SA 4.0 → atıf |
| **GeoNames** (`TR.zip`, `cities15000.zip`, `alternateNamesV2.zip`) | il/ilçe tamlık kontrolü, dünya şehri havuzu, tr/ASCII alias | CC BY 4.0 → atıf ZORUNLU |
| **Natural Earth** (admin-0 ülkeler, `NAME_TR`) | ülke/başkent çapraz kontrol | public domain |
| AI (agy persona simülasyonu) | yalnız `share` (top-K), `estimated:true` | — |
**KULLANILMAZ:** IMDb, MovieLens, TMDB, TDK ve türevleri, Open Food Facts, DBpedia, vocably. Atıf metni `_meta.js`'te, "Hakkında" ekranında: "Soru adayları Vikiveri (CC0), Vikipedi (CC BY-SA 4.0) ve GeoNames (CC BY 4.0) verilerinden derlenmiştir. Paylar yapay zekâ tahminidir."

### 4.3 Betikler (Node ≥18, yerleşik `fetch`; bağımlılık yok, `npm i` yok)
Ortak `harvest/lib/`: `sparql.js` (User-Agent `PusullaBuild/1.0 (https://pusulla.io)` — kişisel adres YOK; istekler arası 1,5 sn; 429/503/504'te üstel geri çekilme; `LIMIT 2000 OFFSET n` + `ORDER BY ?i`; yanıtı `.cache/<hash>.json` önbelleğe yaz, önbellek varsa ağa çıkma), `mw.js` (trwiki API, aynı kurallar), `normalize.js` (matcher ile AYNI normalize fonksiyonunu `require` eder), `aliasfilter.js` (§4.6), `years.js` (MIN yıl, approx). Her betik `--only <poolId>` ve `--offline` (yalnız önbellek) bayrağı alır, sonunda `harvest/out/<betik>.md` özet yazar.

| betik | girdi → çıktı | brief özü | bitiş ölçütü |
|---|---|---|---|
| `00_probe.js` | `harvest/demo_plan.json` (soru→aday sınıf etiketi) → `out/classes.json`, `out/PROBE.md` | Her konu için `GROUP BY ?t` P31 dağılımı + aday sınıf için satır sayısı, yıl kapsamı %, tr etiket %, tr alias %, trwiki makalesi %. **Sınıf kimliği tahmin edilmez**; seçilen Q, sayılarla birlikte yazılır. | 42 sorunun hepsi için bir satır; kapalılar için sayı vs `expect` |
| `10_closed.js` | `classes.json` → `.cache` + `out/closed_<pool>.json` | Kapalı kümeler: şablon §4.4-A, ek filtreler (egemen ülke, P576 yok, sezon). | her kapalı havuzda sayı raporu |
| `20_geo.js` | `in/TR.zip`, `in/cities15000.zip`, `in/alternateNamesV2.zip`, Natural Earth admin-0 → `out/geo_*.json`, `out/GEO_DIFF.md` | il/ilçe adları + alias; Wikidata ile çapraz fark (ör. İstanbul 36/39 → eksik 3 adı listeler); dünya şehri havuzu (nüfus sıralı, tr ad). | farklar listelendi |
| `30_trwiki.js` | kategori listesi → `out/trwiki_<pool>.json` | kategori ağacı derinlik ≤2 (çorba, tatlı, kahvaltılık, meyve, sebze, meslek…); havuz başlıklarının yönlendirmeleri → alias adayı. Yalnız başlık. | her halk kategorisinde üye sayısı |
| `40_open.js` | `classes.json` → `out/open_<pool>.json` | Açık kümeler: şablon §4.4-B, `sl` eşiği, trwiki makalesi önceliği, üst sınır §3.6. | havuz boyutları hedefin ≥ %80'i veya gerekçe |
| `50_merge.js` | `out/*.json` + `data/manual/*.js` → `out/merged_<pool>.json`, `out/ALIAS_REVIEW.md`, `out/YEAR_CONFLICTS.md`, `out/MISSING.md` | QID + normalize ada göre birleştir, manual uygula (§3.4), alias süz, çakışan anahtarları işaretle, kapalıda `expect` farkını MISSING'e yaz. | kapalılarda fark 0 ya da MISSING'de açık liste |
| `60_emit.js` | merged → `data/pool/*.js`, `out/SIZE.md` | kompakt satır biçimi (§3.3), kırpma (§3.6), boyut raporu (ham + gzip tahmini `zlib`). | bütçe içinde |
| `70_reports.js` | `in/reports_*.json` (oyuncudan kopyalanan bildirimler) → `out/REPORTS.md` | bildirimleri havuz/soru bazında grupla, manual'e öneri satırı üret (otomatik ekleme YOK). | — |
**Ağ işi:** agy'de web/MCP yok; ağa çıkan betikler (00, 10, 30, 40) ve zip indirme **Haiku alt ajanla ana Claude oturumunda** çalıştırılır. Zip/dump indirmeden önce kullanıcıya dosya adı, kaynak ve boyut söylenip onay alınır (`TR.zip` ~birkaç MB, `cities15000.zip` ~3 MB, `alternateNamesV2.zip` ~200 MB büyükse yalnız `TR` alternatif adları; Natural Earth admin-0 ~1 MB). 50/60/70 çevrimdışıdır, agy çalıştırabilir.

### 4.4 SPARQL şablonları
**Yalnız doğrulanmış kimlikler yazılıdır** (VERI_KAYNAKLARI §0): ilçe `wdt:P31 wd:Q1147395 ; wdt:P131 wd:Q534799`; kulüp `wdt:P31 wd:Q476028 ; wdt:P17 wd:Q43`; ülke `wd:Q6256`, egemen devlet `wd:Q3624078`; video oyunu `wd:Q7889`; film `wd:Q11424 ; wdt:P495 wd:Q43`; çorba `wd:Q41415`; marka `wd:Q431289`. Özellikler: P31, P279, P131, P17, P118 (lig), P495 (köken ülke), P571 (kuruluş), P577 (yayın), P575 (keşif), P1619 (açılış), P729 (hizmete giriş), P580 (başlangıç), P569 (doğum), P576 (son bulma), P1449/P1813/P1705 (takma/kısa/yerli ad), P1843 (halk adı), P619 (fırlatma). Diğer tüm sınıflar **"00_probe ile bulunur"**.
- **A (kapalı):** `SELECT ?i ?l (GROUP_CONCAT(DISTINCT ?a;separator="|") AS ?al) (MIN(?d) AS ?y) ?sl ?trt WHERE { ?i wdt:P31 wd:<SINIF> . <FİLTRE> ?i rdfs:label ?l FILTER(lang(?l)="tr") OPTIONAL{?i skos:altLabel ?a FILTER(lang(?a)="tr")} OPTIONAL{?i wdt:<YIL_P> ?d} OPTIONAL{?w schema:about ?i ; schema:isPartOf <https://tr.wikipedia.org/> ; schema:name ?trt} ?i wikibase:sitelinks ?sl } GROUP BY ?i ?l ?sl ?trt ORDER BY ?i`
- **B (açık):** A ile aynı, `wdt:P31/wdt:P279* wd:<SINIF>`, tr etiket yoksa `en` etiket (yalnız Latin adlı türler), `FILTER(?sl >= <EŞİK>)`, `LIMIT 2000 OFFSET n`; film/dizide `MIN(?d)` zorunlu (bölgesel tarih tekrarı).
- **Ders:** önce `SELECT ?t (COUNT(*) AS ?n) WHERE { … } GROUP BY ?t ORDER BY DESC(?n)` ile dağılım; `P131*` gibi geçişli yollar zaman aşımına düşer, kullanma.

### 4.5 Demo: 42 soru (T 12 / P 14 / B 16) — kaynak ve havuz hedefi
k = kapalı (`expect`), a = açık. "probe" = sınıf 00_probe ile bulunur. İlk kullanıcı kapısı (F0) bu tabloyu probe sayılarıyla gösterir; zayıf çıkan soru yedekle değişir.

| # | konu | eksen | küme | kaynak / sınıf | yıl türü | havuz hedefi |
|---|---|---|---|---|---|---|
| 1 | İSTANBUL İLÇESİ | P (39/39 yıl bulunursa B) | k 39 | WD `Q1147395/P131 Q534799` (36) + GeoNames ADM2 + manual 3 | kurulus | 39 |
| 2 | TÜRKİYE İLİ | P | k 81 | probe + GeoNames ADM1 | — | 81 |
| 3 | ÜLKE (BM üyesi + gözlemci) | P | k 195 | WD `Q3624078`, P576 yok + Natural Earth | — | 195 |
| 4 | BAŞKENT | P | k (probe sonrası sabit) | 3 no'lu küme + P36 (probe) | — | ~200 |
| 5 | DÜNYA ŞEHRİ | P | a | GeoNames cities15000 tr adı | — | 3000 |
| 6 | ÇORBA | P | a | **manual** + trwiki kategori + WD `Q41415` (14) | — | 80 |
| 7 | KAHVALTILIK | P | a | **manual** + trwiki | — | 60 |
| 8 | TATLI | P | a | trwiki kategori + manual | — | 120 |
| 9 | MEYVE | P | a | probe + trwiki | — | 150 |
| 10 | SEBZE | P | a | probe + trwiki | — | 100 |
| 11 | HAYVAN | P | a | probe (P1843 halk adı) | — | 2000 |
| 12 | MESLEK | P | a | probe + trwiki + manual | — | 800 |
| 13 | SPOR DALI | P | a | probe | — | 400 |
| 14 | TÜRK MARKASI | P | a | WD `Q431289` + P17 Q43 (probe) + manual | — | 500 |
| 15 | TARAYICI | B | a | probe | ilk-genel-surum | 150 |
| 16 | İŞLETİM SİSTEMİ | B | a | probe | ilk-genel-surum | 300 |
| 17 | OYUN KONSOLU | B | a | probe | piyasa-cikisi | 120 |
| 18 | PROGRAMLAMA DİLİ | B | a | probe | ilk-yayin | 800 |
| 19 | SOSYAL MEDYA PLATFORMU | B | a | probe | kurulus | 150 |
| 20 | VİDEO OYUNU | B | a | WD `Q7889` (P31/P279*), `sl` eşikli | ilk-yayin | 4000 |
| 21 | TELEFON MARKASI | B | a | probe | kurulus | 200 |
| 22 | OTOMOBİL MARKASI | B | a | probe | kurulus | 600 |
| 23 | HAVAYOLU ŞİRKETİ | B | a | probe, P576 yok | kurulus | 600 |
| 24 | TÜRK FİLMİ | B | a | WD `Q11424 ; P495 Q43`, trwiki makaleli, `MIN(P577)` | vizyon | 2500 |
| 25 | FİLM | B | a | WD `Q11424`, `sl` eşikli | vizyon | 4000 |
| 26 | TÜRK DİZİSİ | B | a | probe + P495 Q43 | ilk-yayin | 1200 |
| 27 | ŞARKI | B | a | probe (zayıfsa yedek: TÜRK MÜZİK GRUBU, kurulus) | ilk-yayin | 1000 |
| 28 | SÜPER LİG TAKIMI (2025-26) | B | k 18 | WD `Q476028 ; P17 Q43` + sezon listesi (trwiki başlığı) + manual | kurulus | 18 |
| 29 | PARA BİRİMİ (bugün kullanılan) | B | k (probe sonrası sabit) | probe + P576 yok | ilk-yayin | ~160 |
| 30 | PIXAR FİLMİ (uzun metraj) | B | k (probe sonrası sabit) | probe (yapımcı) | vizyon | ~29 |
| 31 | ELEMENT | T | k 118 | probe, P575 (antik = approx) | kesif | 118 |
| 32 | GEZEGEN veya CÜCE GEZEGEN | T | k 13 | probe + manual (antikler approx) | kesif | 13 |
| 33 | OSMANLI PADİŞAHI | T | k 36 | probe (P39) + manual | tahta-cikis | 36 |
| 34 | CUMHURBAŞKANI (TC) | T | k 12 | probe (P39) | goreve-baslama | 12 |
| 35 | TÜRK ÜNİVERSİTESİ | T | k (YÖK sayısı, probe sonrası) | probe + P17 Q43 + manual | kurulus | ~208 |
| 36 | DÜNYA KUPASI ŞAMPİYONU (ülke) | T | k 8 | manual (trwiki başlıkları) | ilk-sampiyonluk | 8 |
| 37 | YAZ OLİMPİYATI EV SAHİBİ ŞEHİR | T | k (probe sonrası) | probe + manual | ilk-ev-sahipligi | ~23 |
| 38 | UZAY SONDASI | T | a | probe, P619 | firlatma | 300 |
| 39 | GÜNEŞ SİSTEMİ UYDUSU | T | a | probe, P575 | kesif | 300 |
| 40 | İCAT | T | a | **manual** (`MOD_ESKI_ICAT_TASARIM.md` eşya sözlüğü + trwiki) | icat-yaklasik | 120 |
| 41 | MİMAR SİNAN YAPISI | T | a | probe (mimar özelliği) | kurulus | 200 |
| 42 | İSTANBUL MÜZESİ | T | a | probe + P131 İstanbul | kurulus | 100 |
Toplam havuz ≈ 25 bin satır → bütçe kontrolü 60_emit'te; aşarsa önce 5/20/25 kırpılır. Yedek sorular (zayıf probe için): MÜZİK ALETİ (P), TÜRK BANKASI (B), İSTANBUL KÖPRÜSÜ (T, k).

### 4.6 Eksik ve gürültü yönetimi
- **Alias süzgeci (`aliasfilter.js`):** kabul: tek/iki sözcük, label'dan farklı normalize anahtar. Otomatik kırp: "ilçesi", "ili", ", İstanbul", " (… )" parantez, "Spor Kulübü/SK/JK/FK/A.Ş." (kırpılmış hâl label ile aynıysa atılır). Şüpheli → `f|=8` ve `ALIAS_REVIEW.md`: virgüllü, ≥4 sözcük, rakamla başlayan, `Q\d+`, başka yazı sistemi, başka havuz label'ına eşit, 3 harften kısa. Şüpheli alias oyuna YAZILMAZ; manual'de onaylanırsa girer.
- **Kapalı kümelerde doğrulama:** `rows.length === expect`, ayrıca en az iki bağımsız kaynakta (Wikidata + GeoNames/Natural Earth/trwiki liste başlıkları) sayılar eşleşmeli; eşleşmeyen üye `MISSING.md`'de. Eksik üye manual `add` ile kapatılmadan soru oyuna girmez (check HATA).
- **Yıl:** çoklu tarih → MIN + approx; `YEAR_CONFLICTS.md` (Wikidata vs manual). Yıl doğrulama (Haiku, WebFetch ile Wikipedia): her sorunun **en eski 5 + en yeni 5** satırı + rastgele %5 → `rev/YIL_DOGRULAMA.md`; uyanlar manual `year`/`verifiedBy` ile `f|=4` alır; uç satırlar doğrulanmadan check `--strict` HATA.
- **Pay (`share`):** hydrogen v2 yöntemi (≥5 persona "Türkiye'de 1000 kişiye sorulsa"), kapalıda tüm üyeler, açıkta top-40 (havuzda olmayan ad YAZILAMAZ: check). Claude Opus alt ajanı 8 soruluk örneklem denetimi → `rev/PAY_DENETIM.md`.

---

## 5. Eşleştirme (`v3/matcher.js`, v2'den uyarlanarak yeniden yazılır)

### 5.1 İndeks (havuz yüklenince bir kez)
- `normalize(s)`: NFC → `tr` küçük harf (İ/ı doğru) → apostroftan (`'` `’`) sonrasını at → noktalama/tire → tek boşluk → trim. `fold(s)`: ASCII katlama (ı→i, ş→s, ğ→g, ç→c, ö→o, ü→u, â/î/û). Anahtarlar: `fold(label)`, `fold(alias)` ve boşluksuz hâlleri; ek-kırpılmış hâl ("kadıköy belediyesi"→"kadikoy") yalnız kategori sözlüğünden.
- Yapılar: `Map<anahtar, satırIdx[]>` (tam eşleşme O(1)); bulanık için `Map<uzunluk, anahtar[]>` kovaları + ilk harf alt kovası. Soru `invalid` anahtarları ayrı `Map`.
- Performans hedefi (`match_bench.js`, node): 5000 satırlık havuzda indeks ≤ 40 ms, 1000 sorgu toplam ≤ 150 ms; tarayıcıda tek sorgu ≤ 5 ms.

### 5.2 Eşleştirme sırası
1. Tam anahtar (normalize + fold, boşluklu/boşluksuz). 2. `invalid` tam anahtar. 3. **Ek soyma**: en uzun önce, en çok 2 katman, kök ≥ 3 harf: `-lar/-ler`, `-da/-de/-ta/-te`, `-dan/-den/-tan/-ten`, `-(y)a/-(y)e`, `-(y)ı/i/u/ü`, `-(n)ın/in/un/ün`, `-dır/dir`, `-ki`; ünsüz yumuşaması geri alma (b→p, c→ç, d→t, ğ→k/g); her adayda tam anahtar araması. 4. **Bulanık** (yalnız 1–3 sonuçsuzsa): Levenshtein sınırlı (erken kesme); eşik uzunluk ≤4: 0, 5–7: 1, ≥8: 2; havuz > 2000 satırsa en çok 1. Tek ve açık ara en iyi aday şart (ikinci en iyi ≥ +1); en iyi aday bir `invalid` anahtarına da aynı yakınlıktaysa sonuç `none`. Dönüş `{type:'valid', row, fuzzy:true}` → UI "X olarak saydım".
5. **Eşsesli** (bir anahtar → birden çok satır, ör. aynı adlı iki film): label tam eşitse o; değilse en yüksek `sl`; sonuç panelinde "aynı adlı N kayıt" notu.
Dönüş türleri: `valid | invalid | none` (v2 uyumlu) + `fuzzy` bayrağı.

### 5.3 Yanlış-pozitif önlemleri ve mesajlar
- Genel kelime kara listesi (`_meta.GENERIC`: "film", "takım", "şehir", "yok", "bilmiyorum"…) her soruda `invalid` gibi davranır ("Belirli bir ad yazmalısın").
- `match_test.js`: her label/alias kendi satırına; başka havuzlardan rastgele 300 label bu soruda bulanık/ek-soyma ile `valid` dönerse UYARI listesi; kısa adlar (≤4) bulanık yok.
- Mesajlar: `invalid` → gerekçe; `none` kapalıda → "Bunu bu listede bulamadım. Yazımı kontrol et." (doğru üye zaten havuzda, kalan olasılık yazım/yanlış küme); `none` açıkta → "Havuzumda yok (veri: 2026-11). Başka dene ya da BİLDİR."; 3. `none`'da ipucu (hedefe en uzak 2 aday).

### 5.4 "Havuzda yok → BİLDİR" (yerel, sunucusuz)
- `none` ve bulanık eşleşme satırında **BİLDİR** düğmesi (`actions.report()`), sonuç panelinde "yanlış eşleşti" bağlantısı.
- Kayıt: `localStorage['pusulla.v3.reports']` = en çok 300 kayıt (FIFO) `{d:'2026-11-22', q:'ist_ilce_01', t:'<yazılan, ≤60 karakter>', k:'none|fuzzy|wrong'}`; kimlik/kişisel veri yok; erişilemezse sessizce bellek içi.
- "Hakkında → Bildirimlerim (N)": liste + "Panoya kopyala (JSON)" + "Temizle". Geliştirici JSON'u `harvest/in/reports_*.json`'a koyar → `70_reports.js` → manual önerileri (insan onaylı).
- Hedef: kör cevap testinde (§6.1) "havuzda yok" kapalıda %0, açıkta ≤ %10.

---

## 6. Kalite kapıları

### 6.1 Komutlar (hepsi node, çevrimdışı)
- `check.js` (0 HATA şart): id benzersiz; `text` kalıbı; NFC; `pool` dosyası var; `cat` tabloda; `invalid` ≥2 grup; kapalıda `expect`+`scope`+`authority` var ve (`filter` sonrası) satır sayısı `=== expect`; zaman ekseninde yıl kapsamı (§3.5), `-5000 ≤ year ≤ ASOF`, approx'ta not; `share` toplam 99–101, `list`teki her ad havuzda, `estimated:true`; NADİR için kuyrukta ≥5 aday `share≤1.0` ya da açık havuz (uzun kuyruk); aynı soruda iki satır↔invalid anahtar çakışması HATA; `f&8` alias oyunda yok; bütçe (§3.6). `--strict`: uç yıllar doğrulanmış. `--demo`: takvim 2 gün.
- `daily_sim.js`: 60 gün; her gün 20 farklı soru, her bacak 5 uygun soru, döngü içinde tekrar yok, döngü sınırı kuralı; gün sayısını §2.8 tablosuyla karşılaştırır.
- `score_test.js`: her soruda her uygun mod için ≥1 satır 100 alır; ters kutup ≤30; açık zaman puanı; karma Dmin; beraberlik; PAS/SÜRE 0.
- `match_test.js` + `match_bench.js` (§5).
- `blind_test.js` (**kör cevap testi**): Claude Opus alt ajanı havuzu GÖRMEDEN her demo sorusu için 30 makul cevap yazar (`rev/blind/<qid>.txt`, yaygın + yazım hatalı + ekli); betik oranı raporlar: kapalıda valid %100 (yanlış küme hariç), açıkta ≥ %90.
- `pool_report.js`: havuz boyutu, yıl %, alias %, curated sayısı, şüpheli alias sayısı, kırpılan satır, ham/gzip KB.

### 6.2 Tarayıcı testi (Haiku, Claude Browser)
1. `v3/index.html` file:// ve yerel sunucu ile; konsol hatası 0 (stub UI ve arkadaşın UI'siyle ayrı ayrı).
2. Menü fare + klavye (oklar, iki ok çapraz, numpad, QWE/ASD/ZXC, Enter, Esc).
3. Her modda 1 tam tur (5 soru): geçerli, bulanık, geçersiz, havuzda yok + BİLDİR, PAS, süre; sonuç türü doğru.
4. Günün Rotası: 4 bacak × 5, aynı gün tekrar yok, F5 devamı, seri +1, paylaşım metni.
5. `localStorage` kapalıyken çalışır; büyük havuz (film) yüklenirken takılma yok.
6. 1366×768 ve 1920×1080 ekran görüntüleri → `v3/shots/`.
7. Olay günlüğü (`?debug`) §2.9 tablosundaki her olayı en az bir kez gösterir (ses/görsel entegrasyonu için).

---

## 7. İŞ EMRİ VE GÖREV PAYLAŞIMI

### 7.0 Kim ne yapar (çakışmasız)
| iz | sahip | dosyalar | çalışma yeri |
|---|---|---|---|
| Motor + veri + içerik + test | **agy** `gemini-4-hydrogen-medium` (`--dangerously-skip-permissions`) | §3.1'deki agy dosyaları, `data/**`, `tools/**`, `brief/`, `rev/` | `D:\martı`, dal `main` |
| Planlama / revize / pay denetimi / kör test cevapları | **Claude Opus alt ajanı** (agy Opus kotası kapalı) | `rev/OPUS_*.md`, `rev/blind/*` | — |
| Ağ betikleri, indirme, check/test/ekran görüntüsü komutları | **Haiku alt ajanı** (ana Claude oturumu) | yalnız çıktı (`.cache/`, `out/`, `shots/`) | — |
| Görsel tasarım (UI, CSS, pusula, grafikler, sahneler, animasyon) | **Arkadaş** (kendi Claude'u; prompt `notlar/ARKADAS_GORSEL_PROMPT.md`) | `v3/style.css`, `v3/ui/*`, `v3/scenes/*`, `v3/assets/*`, index.html GORSEL bloğu, `v3/shots/gorsel/*` | GitHub `boraturbil/marti`, dal `gorsel` → PR |
| Ses tasarımı | **Kullanıcı** | `v3/sound.js`, `v3/sound/*`, index.html SES bloğu | dal `ses` veya doğrudan |
| Kullanıcıyla konuşma, aktarım, kısa özet, `SOZLESME.md` | ana oturum | `DEVIR_NOTU.md`, `v3/SOZLESME.md` | — |
Kurallar: agy görsel/ses dosyalarına ASLA yazmaz (stub'lar `ui_stub.js` içinde ve yalnız `PUSULLA.ui`/`scene`/`sound` yoksa devreye girer). Arkadaş ve kullanıcı motor/veri dosyalarına yazmaz; sözleşme eksikse `SOZLESME.md`'ye öneri bırakır. Ana oturum sonucu tekrar denetlemez; denetim Opus alt ajanı + Haiku komutlarıdır.

### 7.1 Tüm agy brief'lerine yazılacak ortak kurallar
1. Çalışma kökü `D:\martı\v3\`. `v2\`, kök v1, `notlar\` DEĞİŞTİRİLMEZ (okuma serbest).
2. **Dosya sahipliği:** yalnız brief'teki "SENİN DOSYALARIN". Başka dosyayı yazma, **yedekten geri yükleme yok, başkasının dosyasını "düzeltme" yok, silme yok.** Sorun → `v3/rev/NOT_<işçi>_<faz>.md`.
3. Paralel en çok **3 işçi**, dosya kümeleri ayrık. `D:\martı\DEVIR_NOTU.md` "Kim ne yapıyor" bölümüne kendi satırı (`başladı`/`bitti`), yalnız kendi satırı.
4. Klasik script UMD, module/import/fetch YOK (harvest betikleri hariç: onlar node). Harici kütüphane YOK, `npm i` YOK.
5. UTF-8 (BOM yok); PowerShell ile dosya yazma YOK.
6. Kullanıcıya görünen metin Türkçe; veri metni DOM'a `escapeHtml` olmadan konmaz (stub dahil).
7. Bitince kendi kontrolünü yap ve `v3/rev/RAPOR_<işçi>_<faz>.md` (≤15 satır: yapılan, komut çıktısı, açık sorun).
8. Skill: brief'i yazan ajan `C:\Users\Emir\.gemini\antigravity-cli\skills\` listesine bakıp işe uygun 1–3 skill'i adı ve yoluyla yazar (görsel/ses skill'leri agy işine girmez).
9. Uydurma veri yasak: yıl/üye kaynaksızsa yazılmaz; manual girişlerde `src`/`note` zorunlu.
Brief adı: `v3/brief/AGY_<FAZ>_<IŞÇI>_<KONU>.txt`; her brief: amaç, SENİN DOSYALARIN, okunacaklar (bu planın ilgili §'leri + `SOZLESME.md`), adımlar, bitiş ölçütü, bu 9 kural.

### 7.2 Fazlar
**F0 — Veri sondası** (F1 ile paralel) · İşçi C · `AGY_F0_C_PROBE.txt`
- Dosyalar: `tools/harvest/lib/*`, `00_probe.js`, `harvest/demo_plan.json` (§4.5 tablosu makine biçiminde).
- Çalıştırma: Haiku (ağ). Bitiş: `out/PROBE.md` 42 satır (sınıf Q, satır sayısı, yıl %, tr etiket %, alias %, kapalıda sayı/expect).
- Kontrol: Opus alt ajanı PROBE'u okur → zayıf soruları yedekle değiştiren `rev/OPUS_F0.md`.
- **Kullanıcıya:** 42 soruluk liste + probe sayıları + değişen sorular (tablo). Onaysız F4'e geçilmez.

**F1 — İskelet + sözleşme** · 2 paralel işçi (F0'daki C ile toplam 3)
- **İşçi A** `AGY_F1_A_ISKELET.txt`: `index.html` (GORSEL/SES blokları boş işaretli), `bus.js`, `ui_stub.js`, `game.js` (durum makinesi iskeleti: sahte sorularla tüm fazlar, tüm §2.9 olayları), `SOZLESME.md` taslağı (§2.9 kopyası; ana oturum onaylar). `index.html?mock` = motor verisi olmadan sahte sorularla tüm olay akışını yayan mod (görsel ve ses izleri buna karşı çalışır). Bitiş: stub ile menü→soru→sonuç→özet dolaşılır; `?mock` ve `?debug` çalışır, her olay en az bir kez yayılır; konsol hatası 0.
- **İşçi B** `AGY_F1_B_CONFIG.txt`: `config.js` (sabitler: ROUND_SECONDS 30, QUESTIONS_PER_ROUND 5, ROUND_MAX 500, DAY_MAX 2000, SKIP_AFTER 10, WARN 5, EPOCH (§8.2-S5), STORAGE_KEY 'pusulla.v3', BOTH_FEEDS_SINGLE true, 9 mod, KEYMAP, katman eşikleri), `store.js`, `daily.js` + `tools/daily_sim.js` (sahte 42/150/300 soruluk fikstürle §2.8 tablosunu doğrular). Bitiş: `node tools/daily_sim.js` geçer.
- **Kullanıcıya + arkadaşa:** `SOZLESME.md` ve stub ekran görüntüsü (arkadaş bu noktadan itibaren bağımsız çalışır).

**F2 — Motor** · İşçi A (akış) + İşçi B (puan/eşleştirme)
- **A** `AGY_F2_A_AKIS.txt`: `game.js` tam akış (süre, GEÇ, pending, rota bacakları, serbest, paylaşım, BİLDİR), dinamik havuz yükleyici, `era:change` + `scene.setScene` çağrısı, `ui_stub.js` güncel.
- **B** `AGY_F2_B_MOTOR.txt`: `engine.js` (§2.7 tamamı, `axesOf`, `eraOf`), `matcher.js` (§5), `tools/score_test.js`, `match_test.js`, `match_bench.js`, fikstür havuzları `tools/fixtures/*.js` (kapalı 39 + açık 5000 sahte).
- Bitiş: üç test + bench geçer; fikstürle 8 mod + rota oynanır; konsol 0.
- Kontrol: Haiku komutları; Opus alt ajanı kod taraması `rev/OPUS_F2.md` (≤2 tur düzeltme, her işçi yalnız kendi dosyası).
- **Kullanıcıya:** stub ekranında 3 ekran görüntüsü (soru, zaman sonucu, pay sonucu) + test özeti.

**F3 — Veri hattı betikleri** · 3 paralel işçi
- **C** `AGY_F3_C_KAPALI.txt`: `10_closed.js`, `20_geo.js`. **D** `AGY_F3_D_ACIK.txt`: `30_trwiki.js`, `40_open.js`. **E** `AGY_F3_E_BIRLESTIR.txt`: `50_merge.js`, `60_emit.js`, `70_reports.js`, `lib/aliasfilter.js`, `lib/years.js`, `tools/check.js`, `tools/pool_report.js`, `data/_meta.js`.
- Çalıştırma: Haiku ağ betiklerini çalıştırır (zip'ler için kullanıcı onayı §4.3); 50/60 agy.
- Bitiş: 42 sorunun havuzları `data/pool/`'da; `out/MISSING.md`, `ALIAS_REVIEW.md`, `YEAR_CONFLICTS.md`, `SIZE.md` var; bütçe içinde.
- **Kullanıcıya:** `SIZE.md` + kapalı kümelerde eksik listesi (ör. "İstanbul 36/39: eksik 3 ad").

**F4 — Demo içerik (42 soru)** · İşçi C (manual), İşçi D (sorular + pay), İşçi E (düzeltme döngüsü/check)
- **C**: `data/manual/*.js` (eksik kapalı üyeler, halk havuzları: çorba, kahvaltılık, İCAT; onaylanan aliaslar). **D**: `data/q_demo.js`, `data/share/*.js` (persona pay). **E**: yeniden 50/60 + check + `blind_test.js` koşturma.
- Haiku: yıl doğrulama (§4.6) + kör test; Opus alt ajanı: kör test cevapları, pay denetimi `rev/PAY_DENETIM.md`.
- Bitiş: `check.js --demo` 0 HATA; kör test kapalı %100 / açık ≥ %90; uç yıllar doğrulanmış.
- **Kullanıcıya (son hâlden önce):** `rev/DEMO_SORULAR.md` — her soru için: metin, eksen, kapalı/açık, havuz boyutu, ilk 15 satır, curated sayısı, şüpheli alias sayısı, top-10 pay, en eski/en yeni 3 satır. Kullanıcı onayı/düzeltmesi sonrası F5.

**F5 — Entegrasyon ve teslim** · Haiku (+ gerekirse İşçi A)
- Arkadaşın `gorsel` dalı ve kullanıcının `sound.js`'i `main`'e birleşince §6.2 tarayıcı testi; uyumsuzluk varsa sözleşme ihlali raporu `rev/ENTEGRASYON.md` (kimin dosyası olduğu yazılır; agy yalnız kendi dosyasını düzeltir).
- `check.js --strict --demo` 0 HATA, tüm testler geçer; paket `D:\martı\pusulla_v3_demo.zip` (brief/rev/shots/.cache hariç).
- **Kullanıcıya:** 1366×768 ekran görüntüleri (menü, 4 ana mod soru, 3 sonuç türü, rota özeti, Bildirimlerim) + test özeti + bilinen sorunlar.

### 7.3 Paralel görsel ve ses izi (agy dışı)
- Arkadaş: F1 sonunda `SOZLESME.md` + stub ile başlar; motor bitmeden `?mock` (stub'ın sahte olay akışı) ile tüm ekranları çizer. Teslim: `gorsel` dalında PR + `v3/shots/gorsel/`.
- Kullanıcı: aynı olay akışıyla `sound.js`. Ana oturum her iki izi yalnız F5'te birleştirir.

---

## 8. Riskler, açık sorular, iş sırası

### 8.1 Riskler
1. **Wikidata gürültüsü/eksikliği** (ilçe 36/39, çorba 14, alias seyrek): probe-önce, manual dosyası, iki kaynakla sayı kontrolü, kör test.
2. **Boyut** (film/oyun/şehir havuzları): `sl` kırpma, dinamik yükleme, 60_emit bütçe raporu.
3. **Bulanık eşleşmede yanlış pozitif** (kısa/çok anlamlı adlar: Opera, Safari, Mercury): eşikler, tek-aday şartı, çapraz havuz testi, "X olarak saydım" şeffaflığı.
4. **Pay gerçek değil:** her yerde "tahmini"; ileride gerçek oyuncu sayımı (sunucu gerektirir, kapsam dışı).
5. **Üç iz (agy/arkadaş/kullanıcı) çakışması:** dosya sahipliği, index.html blokları, yalnız-eklemeli sözleşme, ayrı git dalları.

### 8.2 Kullanıcıya sorulacak kararlar (5)
- **S1 — Hedef soru sayısı:** v3.0 için 300 soru (15 gün tekrarsız, önerilen) mı, 600 (30 gün) mı? (Demo 42 = 2 gün.)
- **S2 — Rota bacakları ve seri:** 4 bacak istenen sırada ayrı ayrı mı oynansın (önerilen), tek akışta 20 soru mu? Seri için 4 bacağın hepsi mi gerekli (önerilen) yoksa en az 1?
- **S3 — NADİR uzun kuyruk:** pay listesinde olmayan ama havuzda olan bir cevap (ör. az bilinen bir film) kaç puan alsın: `sl` medyanına göre 100/70 (önerilen) mi, hep 100 mü?
- **S4 — Yazım toleransı:** bulanık eşleşme otomatik kabul + "X olarak saydım" notu (önerilen) mu, yoksa "X mi demek istedin? Evet/Hayır" onayı mı?
- **S5 — Başlangıç günü (EPOCH, #1 numaralı rota):** 2026-12-01 (öneri) uygun mu?

### 8.3 İş sırası
1. Ana oturum: bu planı + `ARKADAS_GORSEL_PROMPT.md`'yi kullanıcıya özetler, S1–S5 sorulur (varsayılanlarla ilerlenebilir).
2. F0 (C) ‖ F1 (A, B) → kullanıcıya soru listesi + sözleşme → F1 sonunda ana oturum, kullanıcı onayıyla `v3/` iskeletini ve `notlar/` (plan, kararlar, veri kaynakları, prompt; şu an git'te izlenmiyor) commit + push eder → ancak SONRA `ARKADAS_GORSEL_PROMPT.md` arkadaşa verilir; arkadaş ve kullanıcı izleri başlar.
3. F2 (A, B) → Opus revize → kullanıcıya stub ekranları.
4. F3 (C, D, E) → kullanıcıya boyut/eksik raporu.
5. F4 (C, D, E) → **kullanıcıya DEMO_SORULAR.md** → onay.
6. F5 entegrasyon + zip + DEVIR_NOTU (ana oturum).
