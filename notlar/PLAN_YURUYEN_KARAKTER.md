# PLAN — Yürüyen karakter + paralaks sahne + HUD (PUSULLA v3) — 2026-11-23

Referans: eraly.io (yalnız fikir; varlık/kod kopyalanmaz). Uygulayan: agy `gemini-4-hydrogen-medium`, 3 işçi.
Dal: `entegrasyon`'dan `agy/yuruyen-karakter` aç, bitince `entegrasyon`'a birleştir (main'de son v3 işleri yok).
Adım 0: `DEVIR_NOTU.md` "Kim ne yapıyor" okunur; `scenes/`, `ui/`, `style.css` başkasında görünüyorsa DUR, sor. Sonra işçi→dosya satırları yazılır.
agy skill'leri (yalnız ilke, harici kütüphane YOK): `threejs-game-ui-designer` (HUD), `threejs-qa-release` (duman testi/ekran görüntüsü)
— yol: `C:\Users\Emir\.gemini\antigravity-cli\skills\<ad>\`.

## 0. Mevcut durum (okundu)
- `scenes/core.js`: `PUSULLA.scene = {mount, setScene(eraId,{year,modeId}), setMode, register, pick, labels, show, themes, util}`.
  İki canvas (`.pu-scene`) CSS opacity ile 520 ms çapraz solma; tek rAF, 83 ms kapı (~12 fps); reduced-motion ve `visibilitychange` var.
  Tema = `build(c,G,u)` (G.W genişliğinde tek statik resim, önbellekli) + `frame(c,G,t,st,u)` (üst animasyon).
- `pick(eraId, year)`: yıl varsa yıla göre (misir < -1000 < antik < 500 < selcuklu < 1300 < fetih < 1500 < kesif < 1800 < sanayi < 1900 < cumhuriyet < 1950 < uzay < 1990 < dijital < 2010 < metropol), yoksa `BY_ERA`; `simdi` → bogaz.
- `game.js` `finalizeAnswer`: `answer:valid` → `era:change {eraId, year}` → `scene.setScene(...)` → `result:show` (senkron). pass/timeout sahne değiştirmez. Menü: `setScene('simdi')`.
- `ui/question.js` başlığı (`header.qtop`): solda mod rozeti, ortada `.pips` (total = mode:start.total, 5), sağda SORU n/5 + PUAN. `eraName()` = `scene.pick + scene.labels`.
- Zemin satırları: themes.js `gy = 0.7H` (misir, antik, selcuklu, fetih, sanayi, cumhuriyet, uzay, metropol); kesif `hz 0.62H` (deniz), dijital `hz 0.6H`, bogaz `hz 0.6H` (su). misir (0.88H) ve selcuklu (0.85H) kendi kervan yürüyücülerini çizer.
- Testler (v3 içinde): `tools/match_test.js` 19/19, `tools/score_test.js` 8/8, `tools/check.js --demo` 0 HATA; kökte `node v2/tools/check.js` 868/868.

## 1. Arayüz (işçiler başlamadan sabit; W1 ve W2 buna göre paralel çalışır)
```
PUSULLA.scene.walker = {          // scenes/walker.js (W2) koyar; yoksa core no-op
  W: 16, H: 24,                   // sprite boyu, düşük çözünürlük pikseli
  draw(ctx, cx, feetY, dir, phase, moving),  // dir: 1 sağ / -1 sol; phase: saniye; moving: bool
  road(ctx, G, y, offset, themeId, mixToId, mixT) // y'den itibaren 6 px yol şeridi, offset = tam sayı kayma, iki tema paleti arası mixT
}
```
- `draw` yürürken 4 kare (8 kare/sn), dururken 2 kare nefes (2 kare/sn). İki yön açılışta offscreen canvas'a bir kez pişirilir (her kare flip yok).
- `road` deseni 8 px periyotlu, kenarsız sarmalanır (dikiş yok); palet tablosu `ROADS[themeId] = [ana, açık, koyu]` 11 tema için (bogaz=rıhtım taşı, misir=kum, antik=mermer, selcuklu=kerpiç taş, fetih=arnavut kaldırımı, kesif=iskele tahtası, sanayi=kömürlü taş, cumhuriyet=parke, uzay=beton pist, dijital=neon ızgara, metropol=asfalt+şerit).

## 2. İşçi W1 — `scenes/core.js` (+ yalnız kervan satırları için `scenes/themes.js`)
1. **Dolgulu önbellek:** `PAD = ceil(G.W*0.08)`. `staticFor` temayı `G2 = {W: G.W+2*PAD, H, S}` ile kurar; her katmanın kendi offscreen'i (G2 boyu) olur: `drawImage(static)` + `th.frame(off, G2, t, st, u)`; sonra görünür canvas'a bantlarla kopyalanır.
2. **Bant paralaksı (dikişsiz, sarmalama yok):** offscreen 3 bant halinde `drawImage` kaynak dikdörtgeniyle kopyalanır:
   gök `[0, 0.45H)` katsayı 0.15; uzak `[0.45H, 0.7H)` 0.4; yakın `[0.7H, H)` 0.8. Bant kayması = `round(PAD * k * s)`, `s ∈ [-1,1]`, tam sayı piksel. Kenar asla görünmez.
3. **Yürüyüş kanvası:** üçüncü canvas `class="pu-scene pu-walker"`; `mount()` iki sahne kanvasını `firstChild`'a koyduğu için `layers[0]` sonraki kardeştir → `root.insertBefore(walkerCv, layers[0].cv.nextSibling)` (DOM'da sahnelerden sonra, görselde üstte), opacity hep 1, aynı G.W/G.H/G.S, `resize()` ile birlikte boyutlanır. Her karede temizlenir: `walker.road(...)` sonra `walker.draw(...)`.
   `resize()` sonunda: `document.documentElement.style.setProperty('--walker-h', (24+10)*G.S + 'px')` (W3'ün CSS'i bunu okur).
4. **Ayak çizgisi:** `feetY = G.H - ceil(46/G.S) - 4` (alt tuş şeridinin hemen üstü); yol `feetY`'den 6 px. Karakter `cx = floor(G.W/2)`, yatayda TAM ORTA, sabit.
5. **Yürüyüş durumu (yalnız core içi):** `prevYear` (başta `parseInt(String(P.config.ASOF).slice(0,4))` — `config.js` anahtarı `ASOF`, örn. '2026-11-22'; yoksa `new Date().getFullYear()`), `walk = {from, to, dir, t0, dur}`.
   `prevYear = target` HER sahne değişiminde yazılır (yürüyüşlü, anlık, menü/`simdi`, reduced-motion, gizli faz dahil).
   Temsili yıl tablosu `MID = {misir:-2500, antik:-300, selcuklu:1100, fetih:1453, kesif:1600, sanayi:1850, cumhuriyet:1930, uzay:1970, dijital:2000, metropol:2020, bogaz:asOf}`.
   `setScene(eraId, opts)`: `id = pick(...)`, `target = (year sayı ise year) : MID[id]`; `dir = target >= prevYear ? 1 : -1`;
   `dur = clamp(0.8 + 0.5*log10(1+|target-prevYear|), 0.8, 2.4)` sn. Aynı tema + farklı yıl → 0.6 sn kısa yürüyüş, solma/kayma yok (yalnız yol + karakter). Aynı yıl → durur.
6. **Zaman çizelgesi (ilerleme zamana bağlı, piksele değil; resize ortasında bozulmaz):** `p = (now - t0)/dur`, `f = 0.52/dur`, `ease(x)=x*x*(3-2x)`.
   - p=0.40'ta mevcut `show(id)` çapraz solması tetiklenir (520 ms, değişmez). `show()` `front`'u solma bitince çevirir: solma süresince ESKİ = `layers[front]`, YENİ = `layers[1-front]`; solma bittikten sonra yeni = `layers[front]`. Kayma değeri katman nesnesine (`L.s_off`) yazılır, indekse değil.
   - Eski katman: `p ∈ [0, 0.4+f]` aralığında `s = -dir * ease(p/(0.4+f))`. Yeni katman: `p ∈ [0.4, 1]` aralığında `s = dir * (1 - ease((p-0.4)/0.6))`; p ≥ 1'de 0.
   - Yol `offset -= dir * 40 px/sn * dt` (sürekli); yol paleti `mixT = clamp((p-0.4)/0.4,0,1)` ile eski→yeni.
   - p ≥ 1: `moving=false`, `prevYear = target`, karakter durur (nefes kareleri).
7. **Kesme:** yürüyüş sürerken yeni `setScene` gelirse mevcut yürüyüş anında sona sarılır (`finishFade`, s=0, prevYear=target) sonra yenisi başlar.
8. **Ne zaman görünür:** karakter + yol yalnız `document.body.dataset.phase` ∈ {question, result} iken çizilir (motor yazar: `game.js:246` `setAttribute('data-phase', …)`). Yürüyüş sürerken faz başka bir değere geçerse yürüyüş sona sarılır. `simdi`/menü/özet/istatistik: yürüyüş YOK, anlık geçiş (mevcut yol), walker kanvası boş.
9. **Kare hızı:** tek rAF korunur; kapı yürürken 33 ms (~30 fps), dururken 83 ms (~12 fps). `doc.hidden` → durur. Kare başına 3 bant×2 katman + yol + sprite: hedef < 4 ms (`?debug` ile `performance.now` ölçümü konsola, 1 sn'de bir).
10. **prefers-reduced-motion:** yürüyüş ve kayma yok, anlık geçiş (mevcut `reduced` dalı), karakter tek duran kare, yol sabit.
11. **Hata güvenliği:** `walker` yoksa veya `draw/road` atarsa try/catch, sahne çalışmaya devam eder (mevcut `paint` deseni).
12. **Hata ayıklama kancası:** `PUSULLA.scene.walkTo(year)`. DİKKAT: `pick(null, y)` her zaman 'bogaz' döner; bu yüzden walkTo eraId'yi `config.ERAS`'tan yıla göre bulur (`min ≤ y ≤ max`) ve `setScene(thatEraId, {year: y})` çağırır.
13. **themes.js:** misir (0.88H) ve selcuklu (0.85H) kervan satırları `0.78H`'ye taşınır (kahramanla çakışmasın). Başka tema değişmez.
14. Sözleşme değişmez: `setScene/setMode` imzası aynı, yeni API yalnız ekleme (`walker`, `walkTo`).

## 3. İşçi W2 — yeni `scenes/walker.js` + `index.html` GORSEL bloğu (tek satır)
1. Klasik IIFE, `PUSULLA.scene` yoksa çık (bosphorus.js deseni). Bölüm 1'deki API'yi uygular; DOM'a dokunmaz.
2. Sprite ÖZGÜN: 16×24 gezgin (şapka, atkı, sırt çantası, elde küçük pusula; 6-8 renk, koyu kontur `#1a1128`). Piksel verisi dize dizisi + palet harfleri.
   Kareler: `idle0, idle1` (1 px nefes), `walk0..walk3` (bacak/kol döngüsü, walk1/3'te 1 px zıplama). Sol yön = yatay ayna, açılışta pişirilir.
3. `road`: `ROADS` tablosu (Bölüm 1) + Bayer dither ile 6 px şerit; üst satır açık kenar, alt satır koyu; `util.mix` ile iki palet arası karışım.
4. Ölçek: sprite düşük çözünürlükte çizilir, büyütmeyi core'un tam sayı `G.S`'i yapar (bulanıklık yok).
5. `index.html`: yalnız `<!-- GORSEL:BASLA -->` içinde `scenes/themes.js` satırından SONRA `<script src="scenes/walker.js"></script>`. Başka satır değişmez.

## 4. İşçi W3 — `ui/question.js` + `style.css` (HUD)
1. `qtop` solunda mod rozetinin altına/yanına **dönem etiketi** `els.eraTag`: biçim `"<yıl> · <ETİKET>"` (yıl `fy()`; negatif → MÖ; yıl yoksa yalnız etiket). Etiket `eraName(eraId, year)`.
   Güncelleme: `era:change`'de anında. `question:show`'da son dönemi korur; tur başında (`mode:start`) "BOĞAZ · ŞİMDİ".
2. `.pips`: eraly benzeri kutucuk görünümü (kare, piksel kenarlı); sayı `st.total`'dan (5) — 7'ye sabitleme YOK. Mevcut done/now sınıfları korunur.
3. PUAN sağ üstte kalır; puan artınca 300 ms `steps()` sayaç/parlama (reduced-motion'da yok).
4. **Panel yarı saydam:** `.qbody` arka planı `rgba(...,.72)`, `backdrop-filter` YOK (performans).
5. **Karakter görünürlüğü (zorunlu):** karakter alt tuş şeridinin üstünde `24*G.S` px (768p'de 72 px, 1080p'de 96 px) yer kaplar. `.qmain`'e `padding-bottom: calc(var(--walker-h, 80px) + 8px)` ver; `--walker-h` değerini W1 yazar (Bölüm 2 madde 3); yoksa 80px varsayılan. Kısa ekranda (`max-height: 620px`) panel üstte kalır, karakter panelin altında kesilmeden görünür.
6. Sonuç panelindeki mevcut `era-chip` kalır.

## 5. Dosya sahipliği (çakışma yok)
| işçi | düzenler | dokunmaz |
|---|---|---|
| W1 | `scenes/core.js`, `scenes/themes.js` (yalnız 2 satır) | ui/*, style.css, index.html, game.js |
| W2 | `scenes/walker.js` (yeni), `index.html` GORSEL bloğu 1 satır | core.js, themes.js, ui/* |
| W3 | `ui/question.js`, `style.css` | scenes/*, index.html |
Kimse: `game.js`, `bus.js`, `engine.js`, `matcher.js`, `sound.js`, `data/*`, `SOZLESME.md` tablosu. Ses için ayak sesi olayı (`scene:walk {dir, ms}`) gerekirse yalnız `SOZLESME.md` ÖNERİ bölümüne yazılır, kullanıcı onayı beklenir.
Sıra: W1/W2/W3 paralel (API Bölüm 1'de sabit) → W1 birleşik duman testini yapar → agy Opus/argon kontrol, ≤2 revize tur.

## 6. Kabul testleri (her işçi kendi dosyası için 1-2; birleşik 3-6)
1. `node --check` değişen her .js (`scenes/core.js`, `scenes/walker.js`, `scenes/themes.js`, `ui/question.js`).
2. `cd v3; node tools/match_test.js` → 19/19; `node tools/score_test.js` → 8/8; `node tools/check.js --demo` → 0 HATA.
3. Kökte `node v2/tools/check.js` → 868/868.
4. Tarayıcı duman testi (`v3/index.html`, file:// veya yerel sunucu, `?debug`):
   - Menü: karakter yok, Boğaz sahnesi eskisi gibi.
   - Önce tur başlat (faz `question`, karakter ortada alt şeritte durur). Konsolda `walkTo(-2000)` → SOLA ~2,4 sn, Mısır; `walkTo(2008)` → SAĞA, dijital; `walkTo(2005)` → 0,6 sn kısa sol adım, solma yok.
   - Gelen sorulardan yılı olan gerçek bir cevap ver (hangisi çıkarsa): yön yıla uygun, sahne yürüyüşün ortasında solarak değişir, HUD "<yıl> · <ETİKET>". Yılsız cevap (örn. Çorba/mercimek, simdi): Boğaz'daysa yürümez.
   - Geç/süre doldu: yürüme yok. Art arda `walkTo(1450); walkTo(1900)`: ilk yürüyüş kesilip ikincisi başlar, hayalet yok. Menüye dön → sonraki tur ilk cevabın yönü ASOF yılına göre doğru.
   - Konsolda hata yok; `?debug` kare süresi < 4 ms; dururken ~12 fps.
5. Reduced-motion emülasyonu: hareket yok, anlık geçiş, karakter durur.
6. Ekran görüntüsü (küçük ölçek) 1366×768, 1920×1080, 375×812 → `v3/shots/gorsel/walk_*.png`: karakterin başı ve ayakları `.qbody`'nin altında TAM görünür, yol şeridinde dikiş yok, yürürken sprite titremesi yok.

## 7. Teslim
Ana oturum sonucu kısaca özetler; `DEVIR_NOTU.md` güncellenir; commit/push kullanıcı onayıyla (CLAUDE.md oturum sonu adımları).
