# PLAN — Yeni tarih arkaplanları (PUSULLA v3) — 2026-11-23

Hedef: mevcut 11 sahnenin (bogaz + 10 yıl sahnesi) yanına **36 yeni sahne**. Her sahne dönemi tek bakışta belli eden bir simge yapı gösterir. Seçim **yıla göre** yapılır: tek, sıralı bir `PICK_BY_YEAR` tablosu var ve 46 yıl sahnesi bu tabloda boşluksuz, çakışmasız yer alır. Ayrıca soru verisine isteğe bağlı bir `scene` alanı eklenebilir; bu alan yalnız yere bağlı sorularda yıl seçimini ezer.
Uygulama agy `gemini-4-hydrogen-medium` ile yapılır: 6 işçi (A–F), her işçi yalnız kendi `v3/scenes/bg_<x>.js` dosyasını yazar. Entegrasyon ayrı bir adımdır (tek kişi).
Dal: `entegrasyon`'dan `agy/arkaplan` açılır, iş bitince `entegrasyon`'a birleştirilir.
agy skill (yalnız ilke için, harici kütüphane YOK): `threejs-qa-release` (duman testi ve ekran görüntüsü ilkesi), yolu `C:\Users\Emir\.gemini\antigravity-cli\skills\threejs-qa-release\` (yoksa atlanır).

---

## 0. Mevcut durum (okundu)

- `scenes/core.js`
  - `P.scene = {mount, setScene(eraId,{year,modeId}), walkTo, register, pick, labels, show, themes, util, walker}`.
  - `register(id, {build, frame})` yalnız `themes[id]` alanına yazar, DOM'a dokunmaz. Bu yüzden node'da da yüklenebilir.
- `pick(eraId, year)` (satır 140–156): if-zinciriyle 10 yıl sahnesi seçer. `simdi` ya da yıl yoksa `bogaz` veya `BY_ERA` döner.
- `MID` (satır 172): yalnız yıl yoksa yürüyüş hedefi olarak kullanılır.
- `labels` (satır 480–481): `ui/question.js:165` bunu okur ve sonuç ekranında sahne adı olarak gösterir (`pick(id, year)` → `labels[th]`).
- Çizim düzeni
  - `staticFor(id)` sahne başına bir kez `build(c, G2, u)` çağırır (önbellekli). Her karede önce statik resim kopyalanır, sonra `frame(c, G2, t, st, u)` üstüne çizer. Temizlemeye gerek yok.
  - `build`/`frame` hataları yutulur (core.js:182, 188, 201).
  - `show(id)`: kayıtlı olmayan id sessizce `bogaz` olur. Bu yüzden "konsol hatasız" tek başına kanıt değildir; node duman testi şart (Adım 0).
- Çözünürlük
  - `G.S = max(2, round(vh/250))`, `G.W = ceil(vw/S)`, `G.H = ceil(vh/S)`. Örnekler: 1920×1080 → 480×270; 1366×768 → 456×256; 375×812 → 125×271.
  - `build` **G2** alır: `G2.W = G.W + 2·PAD`, `PAD = ceil(0.08·G.W)`. Durağan halde görünen bölge `[PAD, PAD+G.W]`, yani build genişliğinin yaklaşık %7–%93'ü.
- Paralaks bantları
  - Gök `0–0.45H` (k 0.15), uzak `0.45–0.70H` (k 0.4), yakın `0.70H–H` (k 0.8).
  - 0.45H ve 0.70H çizgisini kesen yüksek yapılar yürürken hafifçe kayar (kabul).
- Yol: core yürüyüş yolunu `feetY = G.H - ceil(46/S) - 4` çizgisine `P.scene.walker.road(...)` ile çizer. Palet `walker.js` `ROADS[themeId]` (satır 159–171) tablosundan gelir; eksik id `bogaz` yolunu alır.
- Soru verisi (72 soru, `q_demo.js` 42 + `q_demo2.js` 30)
  - Yıl soruda değil, cevabın havuz satırında: `pool/<id>.js` `rows[i][2]`.
  - Satırlarda bölge ya da şehir alanı yok.
- Yıl yoğunluğu (havuz medyanları)
  - film 2002 (4390), video_oyunu 2006 (4761), sarki 2010, turk_dizisi 2017, havayolu 1998, prog_dili 1992, isletim_sistemi 2001, sosyal_medya 2008, yapay_zeka 2023, uzay_sondasi 1974, otomobil 1947, avrupa_kulubu 1902, olimpiyat 1960, sinan_yapisi 1566, osmanli_padisahi 1648.
  - Antik ve orta çağ yıllarını yalnız element, icat, dunya_sehri, baskent, antik_uygarlik, para_birimi, gezegen/gunes_uydu, ist_muze ve savas_antlasma havuzları getirir.
  - Sonuç: 1880–2026 aralığı ince bölünür, 1300 öncesi geniş bölünür.
- Ekran görüntüsü aracı
  - Python yok, npm paketi yok.
  - Edge headless kullanılır: `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`, `--headless=new --screenshot`. `v2/tools/shots.ps1` aynı yolu kullanıyor.

---

## 1. Seçim tasarımı (karar)

- **Tek tablo, yalnız yıl.** `PICK_BY_YEAR = [[üstSınırHariç, id], ...]` artan sırada tutulur ve `Infinity` ile biter. `pick` ilk `y < sınır` satırını döndürür. Bu biçimde boşluk ve çakışma oluşamaz. Bölümdeki `[min,max]` sütunu bu tablodan türetilmiştir.
- `simdi`, `eraId == null` ya da yıl yok: davranış aynı kalır (`bogaz` / `BY_ERA`, BY_ERA değişmez).
- **İsteğe bağlı `scene` alanı.** Soru nesnesine `"scene":"<id>"` yazılabilir. Alan doluysa ve sahne kayıtlıysa yıl tablosu yerine o sahne gösterilir. Yalnız tek bir yere bağlı sorularda kullanılır; diğer soruların yılı zaten doğru sahneyi seçer. Uygulaması §6.6b'de.
  - Adaylar:

    | soru | `scene` | neden |
    |------|---------|-------|
    | `ist_ilce_01` | `yeni_istanbul` | Kuruluş yılı 1926–2008: yıl seçimi Tokyo, Berlin ve Pekin gösterirdi. |
    | `ankara_ilce_01` | `cumhuriyet` | Kuruluş yılı 1923–2008. |
    | `cumhurbaskani_01` | `cumhuriyet` | Bayar 1950 New York/BM'ye düşerdi. |
    | `turk_universitesi_01` | `cumhuriyet` | İTÜ 1773 Philadelphia'ya düşerdi. |

  - `sinan_yapisi`, `osmanli_padisahi` ve `ist_muze` yıl tabanlı kalır; yılları doğru sahneyi seçiyor.
  - `v3/tools/check.js` soru anahtarlarını sıkı denetlemiyor (grep: `scene`/izinli anahtar listesi yok). Yeni alan "0 HATA" sonucunu bozmaz; entegrasyonda yine de `check.js --demo` çalıştırılarak doğrulanır.
- Cevap metnine göre bölge/şehir ipucu (ör. "Pekin" cevabı → `yasak_sehir`) **şimdi yapılmıyor**. Faz 2'de istenirse §8'deki çağrı noktaları değişir.
- Mevcut 10 yıl sahnesinin hepsi tabloda kalır, yalnız aralıkları daralır. `antik` sahnesinin etiketi "HELENİSTİK ÇAĞ" olur (tapınak + amfitiyatro Bergama/Efes'e uyar).

### 1.1 Tam yıl tablosu (46 satır; ★ = yeni, işçi harfi parantezde)

| # | id | aralık [min, max] | ad / yer | işçi |
|---|----|------------------|----------|------|
| 1 | ★ gobeklitepe | [−∞, −3501] | Göbeklitepe, Şanlıurfa | A |
| 2 | ★ ur_ziggurat | [−3500, −2601] | Sümer, Ur Zigguratı | A |
| 3 | misir | [−2600, −1601] | Gize piramitleri (mevcut) | – |
| 4 | ★ hattusa | [−1600, −1201] | Hitit, Hattuşa | A |
| 5 | ★ truva | [−1200, −801] | Truva, Çanakkale | A |
| 6 | ★ babil | [−800, −501] | Babil, İştar Kapısı | A |
| 7 | ★ atina | [−500, −331] | Atina, Akropolis | A |
| 8 | antik | [−330, −221] | Helenistik (mevcut) | – |
| 9 | ★ cin_seddi | [−220, −28] | Qin/Han, Çin Seddi | B |
| 10 | ★ roma | [−27, 199] | Roma, Kolezyum | B |
| 11 | ★ maya | [200, 499] | Maya, Tikal | B |
| 12 | ★ ayasofya | [500, 749] | Bizans, Ayasofya | B |
| 13 | ★ bagdat | [750, 899] | Abbasi Bağdat | B |
| 14 | ★ viking | [900, 1065] | Viking fiyortu | B |
| 15 | ★ hacli | [1066, 1199] | Haçlılar, Kudüs | C |
| 16 | selcuklu | [1200, 1242] | Selçuklu kervansarayı (mevcut) | – |
| 17 | ★ mogol | [1243, 1298] | Moğol, Karakurum | C |
| 18 | ★ bursa | [1299, 1405] | Osmanlı kuruluşu, Bursa | C |
| 19 | ★ yasak_sehir | [1406, 1439] | Ming, Yasak Şehir | C |
| 20 | fetih | [1440, 1481] | İstanbul'un fethi (mevcut) | – |
| 21 | ★ ronesans | [1482, 1519] | Rönesans, Floransa | C |
| 22 | ★ suleymaniye | [1520, 1599] | Osmanlı klasik, Süleymaniye | D |
| 23 | kesif | [1600, 1629] | Keşifler, kalyon (mevcut) | – |
| 24 | ★ tac_mahal | [1630, 1679] | Babür, Tac Mahal | C |
| 25 | ★ lale_devri | [1680, 1749] | Lale Devri, Sadabad | D |
| 26 | ★ abd_bagimsizlik | [1750, 1788] | ABD bağımsızlığı, Philadelphia | D |
| 27 | ★ fransiz_devrimi | [1789, 1814] | Fransız Devrimi, Paris | D |
| 28 | sanayi | [1815, 1838] | Sanayi devrimi (mevcut) | – |
| 29 | ★ tanzimat | [1839, 1875] | Tanzimat, Dolmabahçe | D |
| 30 | ★ londra | [1876, 1888] | Viktorya Londrası | D |
| 31 | ★ eyfel | [1889, 1913] | Belle Époque, Eyfel | E |
| 32 | ★ canakkale | [1914, 1918] | Çanakkale 1915 | E |
| 33 | cumhuriyet | [1919, 1938] | TBMM (mevcut) | – |
| 34 | ★ ikinci_dunya | [1939, 1945] | II. Dünya Savaşı, Londra | E |
| 35 | ★ bm_newyork | [1946, 1956] | Savaş sonrası New York, BM | E |
| 36 | uzay | [1957, 1968] | Uzay yarışı, fırlatma (mevcut) | – |
| 37 | ★ ay_inisi | [1969, 1975] | Apollo 11, Ay | E |
| 38 | ★ tokyo_80 | [1976, 1984] | Tokyo neon | E |
| 39 | ★ berlin_duvari | [1985, 1991] | Berlin Duvarı | F |
| 40 | dijital | [1992, 2000] | Dijital çağ, CRT (mevcut) | – |
| 41 | ★ silikon | [2001, 2006] | Web 2.0, Silikon Vadisi | F |
| 42 | ★ kus_yuvasi | [2007, 2009] | Pekin 2008 | F |
| 43 | ★ dubai | [2010, 2014] | Dubai, Burj Halife | F |
| 44 | ★ yeni_istanbul | [2015, 2019] | Yeni İstanbul, Çamlıca | F |
| 45 | ★ mars | [2020, 2023] | Mars, Perseverance | F |
| 46 | metropol | [2024, +∞] | Akıllı şehir (mevcut) | – |

`bogaz` tabloda yoktur; yalnız menüde ve `simdi` durumunda gösterilir.

---

## 2. Dosya şablonu (tüm işçiler AYNEN uyar)

```js
/* PUSULLA — arkaplan paketi <X> (scenes/bg_<x>.js). Sahneler: id1, id2, id3, id4, id5, id6.
 * META id1 {"min":-3500,"max":-2601,"label":"SÜMER UR","road":["#b48a5a","#d2aa78","#7e5e3a"]}
 * META id2 {...}   (6 satır; değerler ARKAPLAN_PLAN.md'den kopyalanır, entegrasyon buradan doğrular)
 * Kurallar: ES5, dış bağımlılık yok, global yok, yalnız S.register. */
(function (global) {
  'use strict';
  var S = global.PUSULLA && global.PUSULLA.scene;
  if (!S || !S.register) return;

  function gy(G) { return Math.round(G.H * 0.7); }                    // zemin çizgisi
  function xl(G, f) { return Math.round(G.W * (0.10 + 0.20 * f)); }   // sol güvenli bölge %10–%30
  function xr(G, f) { return Math.round(G.W * (0.70 + 0.20 * f)); }   // sağ güvenli bölge %70–%90
  function sz(G, k) { return Math.max(3, Math.round(Math.min(G.W * 0.45, G.H) * k)); } // boyut H'ye bağlı

  /* ---------- yerel yardımcılar (yalnız bu dosyada; u'ya ekleme YOK) ---------- */
  function arch(u, c, x, y, w, h, col) { /* ... */ }

  /* ================= id1 — Ad (min – max) ================= */
  S.register('id1', {
    build: function (c, G, u) {
      var W = G.W, H = G.H, g = gy(G), R = u.rng(101);              // seed: işçi tablosundaki
      u.bands(c, ['#..', '#..', '#..', '#..'], 0, g, W, 11);         // 1) gök (gradyan yok, bant)
      // 2) güneş/ay/yıldız (u.sun, u.stars)  3) uzak profil (u.profile, 0.45H–0.70H)
      // 4) sol simge xl(G,..)  5) sağ simge xr(G,..)  6) zemin u.bands(g..H) + doku
      return { g: g, clouds: u.makeClouds(u.rng(1011), 3, W, H, 0.05, 0.25) /*, sprite koordinatları */ };
    },
    frame: function (c, G, t, st, u) {
      u.drawClouds(c, st.clouds, t * 0.6, G.W, ['#..', '#..', '#..', '#..']);
      // küçük sprite animasyonları (t saniye; Math.floor(t*k)%n ile kare seç)
    }
  });

  /* ... id2 – id6 aynı düzen ... */
})(typeof window !== 'undefined' ? window : globalThis);
```

### 2.1 Kesin kurallar

1. **Dil ve kapsam**
   - ES5 yazılır: `var`, `function`. `let`/`const`/ok fonksiyonu/şablon dizesi yok (themes.js ile aynı).
   - IIFE kullanılır. Global değişken yok, `u` nesnesine ekleme yok, `S` üzerinde `register` dışında hiçbir şey çağrılmaz.
   - Dış dosya, görsel, font ve ağ isteği yok.
2. **Rastgelelik:** yalnız `u.rng(seed)` kullanılır, o da yalnız `build` içinde. `Math.random` ve `Date` yasak. `frame` yalnız `t` ve `st` değerinden belirlenir.
3. **build** her şeyi statik çizer: gök, uzak profil, simgeler ve zemin.
   - `createLinearGradient` yerine `u.bands`/`u.ramp` kullanılır.
   - Çizim `u.px` / `u.poly` / `u.circle` / `u.profile` ile yapılır (tam sayı piksel).
   - Süre: 1920×1080'de ≤ 15 ms (tarayıcı). Node duman testinde ≤ 30 ms (`BUILD_MAX = 30 ms`, kalibrasyon: en yavaş mevcut `misir` 12.66 ms).
4. **frame** yalnız üst katmanı çizer: bulut, kuş, araç, bayrak, ışık, duman, yansıma. 12 fps bütçesi:
   - kare başına ≤ 3940 `fillRect` (`RECT_MAX = 3940`, kalibrasyon: en yüksek mevcut `dijital` 3152 rect; duman testi sayar);
   - tam ekran piksel döngüsü yok;
   - `getImageData`/`putImageData`/`shadowBlur`/`filter`/yeni canvas yok;
   - döngüler `t` ile sarar (`%`), süreklilik kopmaz.
5. **Yerleşim**
   - Simgeler **sol %10–30, sağ %70–90** bölgesine konur. %8'den sol ve %92'den sağ kenar kırpılır.
   - Orta %35–65 × 0.12H–0.68H bölgesini soru paneli kapatır. Burada yalnız gök ve alçak uzak profil olur.
   - Zemin çizgisi `g = 0.7H`. `H-18 … H` şeridine yol çizilir, oraya detay konmaz.
   - Simge yüksekliği 0.30–0.60H (`sz` ile), mobilde (W≈145) üst üste binmemek için `Math.min` kullanılır.
6. **İçerik**
   - Sahnede yazı/harf/rakam yok, gerçek marka logosu yok.
   - Bayrak olarak yalnız Türk bayrağı (`u.flag`) gerçek çizilir. Diğerleri sade renk şeritleriyle temsil edilir.
   - Gamalı haç, kan, ölü ve şiddet yok. Savaş sahneleri gözetleme, ışıldak, siluet ve dumanla anlatılır.
7. **Kimlik:** `id` küçük harf ascii, tabloyla birebir aynı. Her sahnenin `u.rng` seed'i işçinin aralığındadır: A 101–169, B 201–269, C 301–369, D 401–469, E 501–569, F 601–669 (sahne k → `X01+10k`, bulutlar için `X01+10k+1` vb.).
8. **Tekrar yok:** `themes.js` ve `bosphorus.js` sahnelerindeki simgeler kopyalanmaz. Örnek: `uzay` fırlatma kulesi, `fetih` Theodosius surları, `bogaz` vapuru. Üslup (palet bantları, piksel gölge, 1px vurgu) ise onlarla aynı olur.
9. **Boyut:** dosya ≤ 40 KB. Her sahne ~60–120 satır.

---

## 3. Sahne tarifleri (36)

Her sahnede şunlar verilir: yer · sol simge · sağ simge · gök/ışık · palet (hex) · animasyon (`frame`) · yol `[ana, açık, koyu]` · sık denk gelen sorular.

### İşçi A — Antik Yakındoğu ve Ege (seed 101–169)

**A1 `gobeklitepe` — "GÖBEKLİTEPE"** [−∞, −3501]
- Yer: Şanlıurfa, Neolitik.
- Sol: yarı gömülü dairesel taş halka. İçinde 3 T biçimli dikilitaş var; ön büyük taşta 2–3 px tilki/yaban domuzu kabartması.
- Sağ: kazılmamış ikinci halka, kayalık tepe, yabani buğday başakları, avcı ateşi.
- Gök: alacakaranlık mor→turuncu.
- Palet `#2a2140 #6b3f5e #d9774a #f2b766 #c9a37a`.
- frame: ateş titremesi (3 kare) + `u.smoke`, turna sürüsü (`u.birds`), başaklar 1 px salınır.
- Yol `['#9a7a58','#b89670','#6a5038']`.
- Sorular: icat, element (bakır/altın −5000), gunes_uydu (Ay), dunya_sehri/baskent (Şam, Eriha).

**A2 `ur_ziggurat` — "SÜMER UR"** [−3500, −2601]
- Yer: Güney Irak.
- Sol: 3 katlı basamaklı ziggurat. Ortada merdiven, tepede küçük tapınak ve meşale.
- Sağ: Fırat kıyısı, sazlık, kamış "mudhif" evi (kemerli), hurmalar.
- Gök: sıcak ikindi.
- Palet `#4a6fa5 #9cc2d8 #f3e2b0 #c8955a #7a5a3a`.
- frame: kamış kayık sağdan sola süzülür, hurma yaprağı salınır, meşale yanar, kuşlar uçar.
- Yol `['#b48a5a','#d2aa78','#7e5e3a']`.
- Sorular: icat (yazı, tekerlek), para_birimi (şekel), element (kalay, kurşun), antik_uygarlik (Sümer, Akad).

**A3 `hattusa` — "HİTİT HATTUŞA"** [−1600, −1201]
- Yer: Çorum, Boğazkale.
- Sol: Aslanlı Kapı. Kesme taş sur, iki kule, kemerin iki yanında aslan başları.
- Sağ: Yazılıkaya kaya kabartması (sıra halinde yürüyen 8–12 tanrı silueti), bozkır tepeleri.
- Gök: berrak bozkır mavisi.
- Palet `#5b86b8 #a9c9e0 #e8d9a8 #a88a5c #6e6a4a`.
- frame: uzakta iki atlı savaş arabası geçer (tekerlek 2 kare), kartal süzülür, bulutlar akar.
- Yol `['#a08866','#c0a882','#6e5c44']`.
- Sorular: savas_antlasma (Kadeş −1259), antik_uygarlik (Hitit), tr_il, antik_kent_tr, element (demir).

**A4 `truva` — "TRUVA"** [−1200, −801]
- Yer: Çanakkale, Ege kıyısı.
- Sol: eğimli Truva surları (şev), kule, kapı.
- Sağ: tekerlekli platformda tahta Truva atı. Kıyıda kara gövdeli Akha gemileri; deniz şeridi.
- Gök: gün batımı.
- Palet `#3a2e5e #b0506a #f08a5a #ffd08a #2e5a7a`.
- frame: deniz parıltısı (seyrek 1 px), gemiler ±1 px salınır, sur meşaleleri yanar, martılar uçar.
- Yol `['#a8906c','#c8b08a','#76603e']`.
- Sorular: antik_kent_tr, dunya_sehri, baskent, icat (Fenike alfabesi).

**A5 `babil` — "BABİL"** [−800, −501]
- Yer: Irak.
- Sol: lacivert sırlı İştar Kapısı. Sarı aslan ve ejder sıraları (2 px), kale dişleri.
- Sağ: Asma Bahçeler (basamaklı teras, sarkan yeşillik, palmiye). Uzakta Etemenanki kulesi.
- Gök: sıcak akşam.
- Palet `#2b2a5a #6e4a7e #e2865a #ffcf80 #1f4fa0 #d8b040`.
- frame: teraslardan su şelalesi (piksel kayması), palmiye salınımı, kuşlar.
- Yol `['#b89a64','#d8ba84','#84683e']`.
- Sorular: dunya_harikasi, antik_uygarlik (Babil, Asur, Pers), para_birimi (Lidya sikkesi), baskent.

**A6 `atina` — "ATİNA AKROPOLİS"** [−500, −331]
- Sol: kayalık Akropolis tepesinde 8 sütunlu, alınlıklı Parthenon ön yüzü ve Propylaia.
- Sağ: Agora stoası, zeytin ağaçları, uzakta Pire limanında trireme.
- Gök: parlak Akdeniz sabahı.
- Palet `#3d7cc9 #8cc0ea #f4f0e4 #d9c9a8 #6d7d3f`.
- frame: trireme kürekleri (2 kare) ve gidiş, bulutlar, kuşlar.
- Yol `['#d8d0c0','#f0ead8','#a09886']`.
- Sorular: antik_uygarlik (Antik Yunan), element, dunya_harikasi, baskent (Atina).
- Not: `antik` sahnesindeki tapınaktan ayırt edilmeli. Burada Parthenon tepe üstünde ve büyük; amfitiyatro yok.

### İşçi B — Klasik imparatorluklar ve erken orta çağ (seed 201–269)

**B1 `cin_seddi` — "ÇİN SEDDİ"** [−220, −28]
- Sol: dağ sırtında kıvrılan Sed (dişli duvar) ve gözetleme kulesi.
- Sağ: önde 4–5 pişmiş toprak asker figürü, çam ve kayalık dağ.
- Gök: puslu sabah.
- Palet `#6e86a8 #b9c6d4 #e9e1cf #8a6a4e #4e6a4a`.
- frame: kulede işaret dumanı (`u.smoke`), 2–3 yarı saydam sis şeridi yavaş kayar, turnalar.
- Yol `['#8e7a66','#ae9a84','#5e5040']`.
- Sorular: dunya_harikasi, antik_uygarlik (Han, Qin), para_birimi, icat.

**B2 `roma` — "ROMA KOLEZYUM"** [−27, 199]
- Sol: Kolezyum (3 kat kemer + düz üst kat, travertin; tam hali).
- Sağ: iki katlı su kemeri (aqueduct), Titus Takı, selviler.
- Gök: sıcak ikindi.
- Palet `#4a78b0 #9ec4e0 #f6e6c0 #d8b884 #8a5a3a #2e4a3a`.
- frame: 3–4 lejyoner (kırmızı kalkan) yürür, kemer üstünde su pırıltısı, kartal sancağı dalgalanır, bulutlar.
- Yol `['#8a8478','#aaa496','#5c574e']` (taş döşeme).
- Sorular: dunya_harikasi, dunya_sehri/baskent (Londra, Paris, Viyana kuruluşu), icat (beton), para_birimi, antik_kent_tr.

**B3 `maya` — "MAYA TİKAL"** [200, 499]
- Sol: dik, basamaklı Tikal Tapınak I; tepede "çatı tarağı".
- Sağ: ikinci alçak piramit, top sahası duvarı, yoğun cangıl tepeleri.
- Gök: nemli sabah, turkuaz.
- Palet `#2e5a6a #6aa8a0 #e8e0b0 #7a8a5a #3a6a3a #c8b89a`.
- frame: kırmızı ara papağanları uçar, cangılda sis kayar, tapınakta tütsü dumanı.
- Yol `['#9a8a6a','#bcac88','#6a5c44']`.
- Sorular: antik_uygarlik (Maya), dunya_harikasi, icat, takımyıldız/gök.

**B4 `ayasofya` — "BİZANS AYASOFYA"** [500, 749]
- Sol: Ayasofya. Büyük kubbe, yarım kubbeler, payandalar. MİNARESİZ (Bizans dönemi).
- Sağ: Hipodrom'da Dikilitaş ve Yılanlı Sütun; Haliç'te dromon kadırgası.
- Gök: altın-mor akşam.
- Palet `#2a2a5a #5a3e7a #c87a4a #f2c060 #c0a888 #7a2a3a`.
- frame: uzakta 2 quadriga yarışır, kadırga kürekleri çalışır, martılar uçar.
- Yol `['#a89a88','#c8baa6','#766a5c']`.
- Sorular: ist_muze (Ayasofya 532), baskent, dunya_harikasi.
- `fetih` ile karışmaması için sur kullanılmaz.

**B5 `bagdat` — "ABBASİ BAĞDAT"** [750, 899]
- Sol: yuvarlak şehir surları ve yeşil kubbeli saray.
- Sağ: Samarra'nın sarmal minaresi (Malviye), Dicle'de yelkenli kayık, hurmalar.
- Gök: lacivert gece, hilal, yıldızlar.
- Palet `#141a3a #2a3466 #5a4a8a #e8c070 #c89a5a #2e7a6a`.
- frame: seçili 20 yıldız 2 kare kırpışır, kayık süzülür, pencere kandilleri titreşir.
- Yol `['#a8865a','#c8a678','#765a3a']`.
- Sorular: icat (kâğıt fabrikası, cebir), bilim_insani, element, baskent/dunya_sehri.

**B6 `viking` — "VİKİNG FİYORDU"** [900, 1065]
- Sol: fiyort kayalıkları, çim çatılı uzun ev (çatıda ejder başlı kirişler).
- Sağ: ejder başlı drakkar (kırmızı-beyaz çizgili yelken) ve rün taşı.
- Gök: gece, kuzey ışıkları.
- Palet `#0e1a2e #1e3a5a #3ac0a0 #8ae0c0 #5a6a7a #c8d8e8`.
- frame:
  - aurora: 3–4 sinüs şerit; her sütunda tek `fillRect`, sütun adımı 2 px; bütçeye dikkat;
  - drakkar salınır, kürek ritmi, ocak dumanı.
- Yol `['#6a6e72','#8a8e92','#44474a']`.
- Sorular: dunya_sehri (Kahire 969 vb.), ada, ulke, icat.

### İşçi C — Orta çağ Asya, Haçlı, Osmanlı kuruluşu, Rönesans, Babür (seed 301–369)

**C1 `hacli` — "HAÇLI SEFERLERİ"** [1066, 1199]
- Sol: kayalık üstünde iç içe surlu, yuvarlak kuleli kale (Krak des Chevaliers tarzı).
- Sağ: Kudüs, altın Kubbetüs-Sahra (sekizgen), şehir surları, zeytin.
- Gök: sıcak kumlu öğle.
- Palet `#5a7ab0 #b0c8d8 #f0d8a8 #c8a070 #d8a830 #7a6a5a`.
- frame: flamalı süvari kolu geçer, toz bulutu (`u.smoke` açık renk), kartal.
- Yol `['#b0946a','#d0b48a','#7c6646']`.
- Sorular: dunya_sehri (Moskova 1147), antik_uygarlik, savas_antlasma.

**C2 `mogol` — "MOĞOL BOZKIRI"** [1243, 1298]
- Sol: beyaz keçe yurtlardan (ger) bir küme, kırmızı kapılar, at sürüsü.
- Sağ: Karakurum'un taş kaplumbağası, at kılı tuğlar, uzakta karlı Altay dağı.
- Gök: geniş mavi, kabarık bulut.
- Palet `#3a6ab8 #8ab8e8 #e8f0f0 #9ab06a #6a8a4a #f0ece0`.
- frame: dörtnala 2–3 atlı (bacak 4 kare), tuğ dalgalanır, yurt dumanı, avcı kartalı.
- Yol `['#9a9a6a','#baba88','#6a6a44']`.
- Sorular: antik_uygarlik, dunya_sehri, savas_antlasma.

**C3 `bursa` — "OSMANLI KURULUŞU"** [1299, 1405]
- Sol: Bursa Ulu Camii (çok kubbeli dikdörtgen kütle, 2 minare).
- Sağ: yeşil çinili sekizgen Yeşil Türbe, selviler, çınar, karlı Uludağ.
- Gök: serin sabah.
- Palet `#4a7ab0 #a0c8e0 #f0e8d0 #2e8a6a #7a9a5a #e8e8f0`.
- frame: Uludağ'dan bulut kayar, uzakta atlı akıncı geçer, kuşlar, çınar yaprağı salınır.
- Yol `['#9a8a74','#bcaa92','#6a5c4c']`.
- Sorular: osmanli_padisahi (Osman 1299, Orhan 1324, Murad I 1362, Bayezid I 1389), sinan_yapisi (erken satırlar), tr_il.

**C4 `yasak_sehir` — "MİNG YASAK ŞEHİR"** [1406, 1439]
- Sol: Taihe salonu. Kırmızı duvar, sarı çift katlı kıvrık çatı, mermer teras.
- Sağ: Cennet Tapınağı (mavi üç katlı yuvarlak çatı), söğüt, kırmızı fenerler.
- Gök: güz akşamı.
- Palet `#3a3a6a #8a5a7a #e8a070 #c8302a #e8c040 #2e5a8a`.
- frame: fenerler sallanır, ejder uçurtması süzülür, kuşlar.
- Yol `['#a0786a','#c09888','#704e44']`.
- Sorular: dunya_sehri, icat, antik_uygarlik.

**C5 `ronesans` — "RÖNESANS FLORANSA"** [1482, 1519]
- Sol: Floransa Duomo. Brunelleschi kubbesi (kiremit kırmızısı, beyaz nervür), beyaz-yeşil mermer çan kulesi.
- Sağ: Palazzo Vecchio kulesi, Arno üstünde Ponte Vecchio.
- Gök: altın saat.
- Palet `#5a6aa8 #c8a0a8 #f8d0a0 #b0503a #e8e0d0 #3a6a4a`.
- frame: Leonardo'nun kanat çırpan uçan makinesi süzülür (3 kare), Arno'da yansıma parıltısı, güvercinler.
- Yol `['#a8987e','#c8b89c','#786a56']`.
- Sorular: icat, bilim_insani, dunya_sehri, klasik_besteci.

**C6 `tac_mahal` — "BABÜR TAC MAHAL"** [1630, 1679]
- Sol: Tac Mahal. Beyaz soğan kubbe, 4 minare, kemerli iwan.
- Sağ: Kızıl Kale (kırmızı kumtaşı surlar), uzun su kanalı, süslü fil, selviler.
- Gök: pembe şafak.
- Palet `#4a3a6a #c87a9a #f8c0a0 #f8f0e8 #b04a3a #3a6a4a`.
- frame: fil yürür (4 kare), kanalda dalga yansıması, papağan sürüsü.
- Yol `['#c0806a','#e0a08a','#8a5444']`.
- Sorular: dunya_harikasi (Tac Mahal 1653), osmanli_padisahi (IV. Mehmed 1648), element (fosfor 1669), icat.

### İşçi D — Osmanlı klasik, Lale Devri, devrimler, Tanzimat, Viktorya (seed 401–469)

**D1 `suleymaniye` — "OSMANLI KLASİK"** [1520, 1599]
- Sol: Haliç sırtında Süleymaniye Camii. Merkezi kubbe, yarım kubbeler, 4 ince minare (2'si kısa).
- Sağ: konik külahlı Galata Kulesi, Haliç'te kalyon ve kadırga.
- Gök: akşam turuncu-mor.
- Palet `#2e2a5a #7a4a7e #e88a5a #ffd090 #e8e0d0 #3a5a7a`.
- frame: martılar, deniz parıltısı, kadırga kürekleri.
- Yol `['#9a8c86','#bcaea6','#6a5e5a']`.
- Sorular: **sinan_yapisi (medyan 1566, en yoğun)**, osmanli_padisahi (Kanuni 1520, II. Selim, III. Murad).
- `bogaz` ve `fetih` ile tekrar olmaz: Kız Kulesi ve köprü yok.

**D2 `lale_devri` — "LALE DEVRİ"** [1680, 1749]
- Sol: III. Ahmed Çeşmesi. Kare gövde, geniş saçak, kurşun külahlar, çini kuşak.
- Sağ: Sadabad köşkü, kırmızı/sarı lale tarhları, Kâğıthane deresi.
- Gök: bahar akşamı pastel.
- Palet `#4a4a7a #c890a8 #f8d0b0 #c82a3a #f0c030 #3a7a4a`.
- frame: sırtında mum taşıyan kaplumbağalar lale arasında yürür (çırağan eğlencesi, mum 2 kare titrer), derede kayık, kelebek.
- Yol `['#a8907a','#c8b09a','#786652']`.
- Sorular: osmanli_padisahi (II. Mustafa 1695, III. Ahmed 1703, I. Mahmud 1730), icat (buhar makinesi 1712), element (kobalt 1735).

**D3 `abd_bagimsizlik` — "ABD BAĞIMSIZLIĞI"** [1750, 1788]
- Sol: Bağımsızlık Salonu. Kırmızı tuğla, beyaz çan kulesi.
- Sağ: ahşap çerçevede asılı çatlak Özgürlük Çanı, yıldız halkalı sade bayrak (şerit + mavi kare), limanda uzun direkli gemi.
- Gök: yaz öğle.
- Palet `#3a6ab0 #90c0e8 #f0f0e8 #a83a2a #e8e0d0 #2a3a6a`.
- frame: bayrak dalgalanır (2 kare), at arabası geçer, kuşlar.
- Yol `['#8a6a5a','#aa8a78','#5a443a']`.
- Sorular: element (hidrojen 1766, azot 1772, oksijen 1774), icat (paratoner, Watt buharı), gezegen (Uranüs 1781). turk_universitesi `scene` ile `cumhuriyet` sahnesine yönlenir.

**D4 `fransiz_devrimi` — "FRANSIZ DEVRİMİ"** [1789, 1814]
- Sol: 8 yuvarlak kuleli koyu taş Bastille ve barikat.
- Sağ: Zafer Takı, Paris çatıları ve bacaları, mavi-beyaz-kırmızı bayrak (3 dikey şerit).
- Gök: dumanlı bulutlu.
- Palet `#4a4a6a #8a8aa8 #d8c8b8 #2a4aa0 #d82a2a #f0f0f0`.
- frame: bayrak dalgalanır, barikattan duman, güvercinler, kalabalık silueti 1 px sallanır.
- Yol `['#7a7470','#9a9490','#4e4a46']`.
- Sorular: element (uranyum 1789, titan 1791), icat (pil 1800, aşı 1796), dunya_sehri, savas_antlasma.

**D5 `tanzimat` — "TANZİMAT"** [1839, 1875]
- Sol: Dolmabahçe Sarayı. Beyaz neobarok cephe, saltanat kapısı. Saat kulesi YOK (1895).
- Sağ: iki ince minareli neobarok Ortaköy Camii, Boğaz'da dumanlı çarklı vapur.
- Gök: berrak Boğaz sabahı.
- Palet `#3a7ab8 #a0d0f0 #f8f0e0 #e8e4dc #2a5a8a #c8282f`.
- frame: çarklı vapur geçer (çark 2 kare + `u.smoke`), martılar, `u.flag(…, Math.floor(t*4)%2)`.
- Yol `['#8e8a86','#aeaaa6','#5e5a56']`.
- Sorular: osmanli_padisahi (Abdülmecid 1839, Abdülaziz 1861), turk_markasi (1856+), element (helyum 1868), icat (telgraf).
- `bogaz` vapurundan farklı olsun (çarklı, eski). Önce bosphorus.js'e bakılır.

**D6 `londra` — "VİKTORYA LONDRASI"** [1876, 1888]
- Sol: Westminster ve Big Ben (gotik kule, saat kadranı).
- Sağ: Tower Bridge (iki gotik kule, mavi askı), Thames'te buharlı gemi, gaz lambaları.
- Gök: sisli kurşuni akşam.
- Palet `#3a3a4a #6a6a7a #a8a098 #e8c070 #4a3a3a #7a8a9a`.
- frame: gaz lambaları titreşir, gemi dumanı, 2–3 sis şeridi kayar, Big Ben yelkovanı `t` ile döner (tek çizgi).
- Yol `['#5e5a5a','#7e7a7a','#3a3838']`.
- Sorular: icat (telefon 1876, ampul 1879, otomobil 1886), telefon_markasi (Ericsson 1876), avrupa_kulubu (1878+), otomobil_markasi.

### İşçi E — 1889–1984: Belle Époque'tan Tokyo neonuna (seed 501–569)

**E1 `eyfel` — "BELLE ÉPOQUE PARİS"** [1889, 1913]
- Sol: Eyfel Kulesi. Kafes demir, bronz-kahve, 3 kat, kemerli taban.
- Sağ: Haussmann binaları, yeşil Art Nouveau metro girişi, Seine kıyısı.
- Gök: pembe-altın akşam.
- Palet `#4a3a6a #b87a9a #f8c090 #8a5a3a #e8dcc8 #2a4a3a`.
- frame: tepede dönen projektör ışığı, sıcak hava balonu süzülür, ilk otomobil/bisiklet geçer, güvercinler.
- Yol `['#76706a','#96908a','#4c4844']`.
- Sorular: **avrupa_kulubu (medyan 1902)**, super_lig (Beşiktaş 1903, Galatasaray 1905, Fenerbahçe 1907), olimpiyat_sehri (Atina 1896, Paris 1900, Londra 1908, Stockholm 1912), otomobil_markasi, film (1911+).

**E2 `canakkale` — "ÇANAKKALE 1915"** [1914, 1918]
- Sol: yonca planlı Kilitbahir Kalesi, tabya topu, Türk bayrağı.
- Sağ: Nusret mayın gemisi, uzakta gri zırhlı silueti, siper hattı, gelincikler.
- Gök: dramatik bulutlu gün batımı.
- Palet `#3a3048 #7a4a5a #d8704a #f0b070 #5a6a5a #c8282f`.
- frame: `u.flag` dalgalanır, Nusret yavaş ilerler, uzakta top dumanı (`u.smoke`), deniz parıltısı, martı.
- Kan/ölü yok.
- Yol `['#8a7a5e','#aa9a7c','#5a4e3c']`.
- Sorular: savas_antlasma (Mondros 1918), avrupa_kulubu, film, otomobil_markasi, icat.

**E3 `ikinci_dunya` — "II. DÜNYA SAVAŞI"** [1939, 1945]
- Sol: dumanlar arasında St Paul Katedrali kubbesi (Londra Blitz), ışıldaklar.
- Sağ: kablolu gri baraj balonları, çift katlı otobüs, kırmızı telefon kulübesi.
- Gök: gece; ışıldak hüzmeleri.
- Palet `#0e1222 #1e2a44 #3a4a6a #e8e0a0 #a83a2a #8a8a8a`.
- frame: 2–3 ışıldak hüzmesi salınır (yarı saydam `u.poly`), balonlar ±2 px yükselip alçalır, uzakta uçak siluetleri geçer.
- Patlama, gamalı haç ve kan YOK.
- Yol `['#3e4048','#5e6068','#24262c']`.
- Sorular: icat (bilgisayar, radar), element (plütonyum 1940), film, otomobil_markasi.

**E4 `bm_newyork` — "SAVAŞ SONRASI NEW YORK"** [1946, 1956]
- Sol: ince yeşil camlı BM Genel Merkezi ve bayrak direkleri sırası (soyut renkli kare bayraklar).
- Sağ: Empire State (art deco), Chrysler tepesi, sarı taksi.
- Gök: açık öğleden sonra.
- Palet `#4a7ab8 #a8d0f0 #f0f0e8 #5a8a8a #c8b8a0 #e8c020`.
- frame: taksi ve araba trafiği, bayrak dizisi dalgalanır, bulutlar, kuşlar.
- Yol `['#56585e','#76787e','#36383c']`.
- Sorular: bm_genel_sekreter (Lie 1946, Hammarskjöld 1953), nba_takimi, otomobil_markasi, ulke (1947+ bağımsızlıklar).

**E5 `ay_inisi` — "AY'A İNİŞ"** [1969, 1975]
- Zemin gri regolith ve krater.
- Sol: Ay modülü (altın folyo alt gövde, örümcek bacak) ve yanında sade şeritli bayrak.
- Sağ: beyaz giysili astronot, kraterler; gökte yarım mavi-yeşil Dünya.
- Gök: siyah uzay ve yıldızlar.
- Palet `#05060c #1a1c26 #8a8a90 #c8c8cc #d8a830 #3a7ad0`.
- frame: astronot yavaş sinüs zıplar, yıldızlar kırpışır, yörüngede komuta modülü geçer, toz parçacıkları.
- Yol `['#7a7a80','#9a9aa0','#4e4e54']`.
- `uzay` fırlatma sahnesinden farklıdır: roket ve kule yok.
- Sorular: **uzay_sondasi (medyan 1974)**, gunes_uydu, oyun_konsolu (1972), prog_dili (C 1972).

**E6 `tokyo_80` — "TOKYO 80'LER"** [1976, 1984]
- Sol: kırmızı-beyaz kafes Tokyo Kulesi, dar binalarda yazısız neon tabela blokları.
- Sağ: viyadükte beyaz-mavi 0 serisi Shinkansen, uzakta Fuji, atari salonu ışıkları.
- Gök: mor-pembe gece.
- Palet `#120e2a #3a1e5a #a83a8a #f07ab0 #40e0e0 #e8e8f0`.
- frame: neon blokları yanıp söner (2 kare, seçili 10–15 blok), Shinkansen hızla geçer, yıldızlar.
- Yol `['#2e2a44','#e05aa8','#1a1828']`.
- Sorular: oyun_konsolu (Atari 2600, NES 1983), video_oyunu (Pac-Man 1980), isletim_sistemi (MS-DOS 1981), sarki, film, telefon_markasi.

### İşçi F — 1985 sonrası (seed 601–669)

**F1 `berlin_duvari` — "BERLİN DUVARI"** [1985, 1991]
- Sol: üstünde quadriga olan sütunlu Brandenburg Kapısı.
- Sağ: yazısız soyut grafitili duvar, gözetleme kulesi, Trabant, uzakta TV kulesi (küre).
- Gök: soğuk kış gecesi.
- Palet `#1a2238 #3a4a6a #8a9ab0 #e8e8f0 #e85a3a #40a8e0`.
- frame: havai fişek (2 noktadan zamanlı patlama halkası), 30 kar tanesi, Trabant dumanla geçer, duvar üstünde el sallayan siluet.
- Yol `['#5a5e66','#7a7e86','#3a3d42']`.
- Sorular: tarayici (WWW 1990), prog_dili (C++ 1985, Python 1991), isletim_sistemi (Windows 1.0), oyun_konsolu (Game Boy 1989), video_oyunu (Tetris, Mario), turk_muzik_grubu.

**F2 `silikon` — "WEB 2.0"** [2001, 2006]
- Sol: sisli turuncu Golden Gate (kule + kablo).
- Sağ: logosuz cam ofis kampüsü, sunucu dolabı ışıkları penceresi, bisikletli çalışan.
- Gök: Kaliforniya gün batımı.
- Palet `#3a4a8a #e07a6a #f8c080 #d8502a #c8d8e0 #2a3a4a`.
- frame: köprüde araç ışıkları akar, sis şeridi kayar, sunucu LED'leri kırpışır, pelikanlar.
- Yol `['#4a4e58','#6a6e78','#2e3036']`.
- Sorular: sosyal_medya (Facebook 2004, YouTube 2005, Twitter 2006), tarayici (Firefox 2004), isletim_sistemi (XP 2001), oyun_konsolu (Xbox 2001), video_oyunu, film, sarki.

**F3 `kus_yuvasi` — "PEKİN 2008"** [2007, 2009]
- Sol: çapraz örgülü çelik Kuş Yuvası stadyumu, içten kırmızı ışık.
- Sağ: mavi kabarcık cepheli Su Küpü, döngü biçimli CCTV kulesi, modern silüet.
- Gök: gece, olimpiyat havai fişekleri.
- Palet `#0e1430 #2a2a5a #c83a3a #40a0e8 #e8c040 #e8e8f0`.
- frame: havai fişek dizisi, Su Küpü kabarcıkları 3 renk sırayla değişir, stadyumda ışık atımı.
- Yol `['#3a3c4a','#5a5c6a','#22232c']`.
- Sorular: isletim_sistemi (Android 2008), tarayici (Chrome 2008), sosyal_medya (WhatsApp 2009), olimpiyat_sehri, film, sarki.

**F4 `dubai` — "DUBAİ"** [2010, 2014]
- Sol: kademeli, sivri Burj Halife (≈0.6H, tablodaki en uzun yapı).
- Sağ: yelken biçimli Burj Al Arab, palmiyeler, kumul, metro viyadüğü.
- Gök: sıcak altın akşam.
- Palet `#2a3a6a #c8806a #f8c87a #e8e8f0 #c8a060 #3a8aa8`.
- frame: Burj tepesinde kırmızı uyarı ışığı yanıp söner, metro geçer, deniz parıltısı, helikopter.
- Yol `['#b8a07a','#d8c09a','#88704e']`.
- Sorular: sosyal_medya (Instagram 2010), turk_dizisi, sarki, film, yapay_zeka (Siri 2011), oyun_konsolu (PS4 2013), havayolu.

**F5 `yeni_istanbul` — "YENİ İSTANBUL"** [2015, 2019]
- Sol: tepe üzerinde 6 minareli Çamlıca Camii.
- Sağ: eğik askılı A kuleli Yavuz Sultan Selim Köprüsü ve Boğaz'ın kuzey ağzı.
- Gök: berrak mavi.
- Palet `#3a78c8 #9ad0f0 #f0f4f8 #c8282f #e8e8e8 #2a6a9a`.
- frame: köprüde araç akışı, modern vapur geçer, martılar, `u.flag`.
- Yol `['#5e6068','#7e8088','#3c3e44']`.
- Sorular: **turk_dizisi (medyan 2017)**, turk_filmi, sarki, film, sosyal_medya (TikTok 2016).
- `bogaz` sahnesinden farklı olsun (gündüz, kuzey ağzı). Önce bosphorus.js'e bakılır.

**F6 `mars` — "MARS ÇAĞI"** [2020, 2023]
- Zemin kızıl.
- Sol: 6 tekerlekli Perseverance gezgini (direk kamera).
- Sağ: Jezero krateri kenarı, kızıl kayalar; gökte Phobos ve Deimos.
- Gök: tozlu somon, ufukta mavi hale.
- Palet `#c8805a #e8a878 #f0c8a0 #8a3a2a #5a2a20 #6a9ad0`.
- frame: Ingenuity helikopteri kalkıp süzülür (pervane 2 kare), uzakta dönen toz şeytanı (piksel sütunu), gezgin direği döner.
- Yol `['#9a4e36','#ba6e52','#6a3222']`.
- Sorular: **yapay_zeka (ChatGPT 2022, medyan 2023)**, uzay_sondasi, gunes_uydu, video_oyunu, sarki, turk_dizisi.

---

## 4. Adım 0 — Altyapı (işçilerden ÖNCE; tek işçi hydrogen ya da Haiku)

1. `git checkout entegrasyon && git pull && git checkout -b agy/arkaplan`.
2. `DEVIR_NOTU.md` "Kim ne yapıyor" bölümüne şunlar yazılır:
   - `agy arkaplan: bg_a..bg_f (İşçi A–F, her biri kendi dosyası)`
   - `entegrasyon: core.js/walker.js/index.html (tek kişi, işçiler bitince)`
   - `scenes/` başkasında görünüyorsa DUR, sor.
3. Üç araç yazılır. Bunlar işçi dosyası değildir; işçiler değiştirmez.

**a) `v3/tools/scene_smoke.js` (node, bağımlılıksız)**
- `globalThis.window = globalThis;` atanır. `vm.runInThisContext` ile sırayla yüklenir: `scenes/core.js`, `scenes/bosphorus.js`, `scenes/themes.js`, `scenes/walker.js`, ardından `--files` ile verilen `scenes/bg_*.js` (varsayılan: var olan tüm `bg_*.js`).
  - `globalThis.document = {createElement: () => fakeCanvas}` stub'ı **koşulsuz** konur. Grep sonucu: core.js ve walker.js yükleme anında yalnız `var doc = global.document` okur. walker.js sprite canvas'ını tembel oluşturur (satır 124/138, `!doc` korumalı). bosphorus.js DOM kullanmaz. Smoke testin walker.js'e ihtiyacı yok; yüklenirse de stub zarar vermez.
- Sahte 2D bağlam bir Proxy'dir: tüm metotlar no-op'tur, `createLinearGradient` → `{addColorStop(){}}` döner, `fillRect` çağrı sayacı tutulur. Değerler ve `NaN` koordinatları yakalanır: `fillRect` argümanı `NaN`/`Infinity` ise hata sayılır.
- Her id için (`--ids` ya da dosyadaki `S.register('…'` eşleşmeleri):
  - `themes[id]` kayıtlı mı;
  - 3 G2 boyutunda `build` çağrılır (try/catch YOK, hata = FAIL): 1920×1080 → `{W:558,H:270,S:4}`, 1366×768 → `{W:530,H:256,S:3}`, 375×812 → `{W:145,H:271,S:3}`;
  - `build` süresi (ms) ölçülür;
  - `frame` t = 0, 0.25 … 6 için çağrılır; kare başına `fillRect` sayısı bütçe içinde olmalı (bütçe: aşağıdaki kalibrasyon);
  - aynı `t` için iki çağrı aynı sayıyı vermeli (belirlenimlilik).
- Çıktı: sahne başına tek satır, örnek `PASS roma build 4.1ms frame max 640 rect`. Sonunda `SMOKE n/n`; hata varsa çıkış kodu 1.
- `--year-table` bayrağı entegrasyon sonrası için ayrılır (§6.8).

**b) `v3/tools/scene_preview.html` (mount KULLANMAZ; build/frame'i doğrudan çağırır)**
- Script'ler: `../scenes/core.js`, `bosphorus.js`, `themes.js`, `walker.js`. `?files=bg_a.js,bg_b.js` (boşsa tüm `bg_a..bg_f`) sırayla `createElement('script')` + `onload` zinciriyle eklenir; dosya yoksa `onerror` → atla.
- Parametreler:
  - `?scene=<id>` tek sahne;
  - `?grid=a,b,c,d` 2×2 kontak sayfası;
  - `&vw=1920&vh=1080` (varsayılan), `&t=2.0` (frame zamanı);
  - `&panel=1` (orta soru paneli yerine yarı saydam koyu dikdörtgen, varsayılan 1);
  - `&road=1` (varsayılan 1).
- Her karo için `G` core.resize ile aynı hesaplanır (`S=max(2,round(vh/250))`, `W=ceil(vw/S)`, `PAD=ceil(.08W)`, `G2={W+2PAD,H,S}`).
  - Önce G2 offscreen canvas'a `build` çizilir, sonra `frame(c,G2,t,st,u)`.
  - Görünür kesit `[PAD, PAD+W]` hedef canvas'a kopyalanır.
  - Yol `P.scene.walker.road(ctx, G, G.H - ceil(46/S) - 4, 0, id)` ile çizilir.
  - Canvas CSS'te `imageSmoothing` kapalı, tam sayı ölçekle büyütülür.
- Grid'de her karo 960×540 CSS px boyutundadır (1920×1080 pencere = 4 karo). Sol üstte DOM etiketi gösterilir: `id · [min,max] · label` (`P.scene.labels` / META bilgisi varsa).
- Hatalar `window.onerror` + build/frame try/catch ile `<pre id="err">` öğesine yazılır (kırmızı, görünür). Eksik id → "KAYITLI DEĞİL: id". `document.title` = `OK` ya da `ERR`.

**c) `v3/tools/shot_scenes.js` (node, Edge headless, bağımlılıksız)**
- Edge yolu: `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`, yoksa `C:\Program Files\...`.
- URL `url.pathToFileURL('D:/martı/v3/tools/scene_preview.html').href + '?grid=…'` ile kurulur (`ı` → `%C4%B1`).
- Komut: `spawnSync(edge, ['--headless=new','--disable-gpu','--hide-scrollbars','--user-data-dir='+os.tmpdir()+'/pusulla_shot','--window-size=1920,1080','--virtual-time-budget=3000','--screenshot='+out, url])`.
- Modlar:
  - `--worker a`: `bg_a.js` içindeki id'ler 4'erli gruplanır → `v3/shots/bg/a_1.png` (4) ve `a_2.png` (2 + boş);
  - `--ids x,y`: tek tek `v3/shots/bg/<id>.png`;
  - `--all`: §1.1 sırasıyla 46 sahne + bogaz = 47 sahne → `v3/shots/bg/sheet_01.png … sheet_12.png` (sıra: `P.scene.PICK_BY_YEAR` varsa ondan, yoksa dosya sırası);
  - `--check`: aynı URL'ler `--dump-dom` ile çalıştırılır, çıktıdaki `<pre id="err">` içeriği okunur; boş değilse ekrana basılır ve çıkış kodu 1.
- Yedek yöntem: grid sayfası bozulursa tek sahne PNG'leri ffmpeg ile birleştirilir: `ffmpeg -i a.png -i b.png -i c.png -i d.png -filter_complex "[0][1][2][3]xstack=inputs=4:layout=0_0|w0_0|0_h0|w0_h0" sheet.png`.
4. Altyapı kabulü:
   - **Bütçe kalibrasyonu.** Önce `node v3/tools/scene_smoke.js --files themes.js,bosphorus.js --report` çalıştırılır: eşik uygulanmaz, mevcut 11 sahnenin en yavaş build süresi ve en yüksek kare-rect sayısı ölçülür. Bütçeler şöyle belirlenir ve smoke betiğinin başına sabit olarak yazılır:
     - `RECT_MAX = max(2000, ceil(1.25 × en kötü mevcut))`;
     - `BUILD_MAX = max(30, ceil(1.25 × en kötü mevcut)) ms`.
     Ölçülen sayılar bu plana (§2.1 madde 3–4'ün yanına) ve DEVIR_NOTU'na not edilir. §2.1 ve §5.0'daki "≤2000 / ≤30 ms" değerleri, kalibrasyon sonrası bu sabitlerle değiştirilmiş sayılır.
   - Ardından `node v3/tools/scene_smoke.js --files themes.js,bosphorus.js` → mevcut 10 sahne + bogaz PASS;
   - `node v3/tools/shot_scenes.js --ids misir,antik,uzay,metropol` → 4 PNG;
   - `--grid` çıktısı 2×2 görünür.
   - Commit: `Arkaplan: sahne duman testi + önizleme + kontak sayfası araçları`.

---

## 5. İşçi brief'leri (agy hydrogen'e aynen verilir; `<X>` ve `<x>` değiştirilir)

### 5.0 Ortak brief metni

```
Görev: PUSULLA v3 için 6 yeni piksel-sanat arkaplan sahnesi yaz. YALNIZ bu dosyayı oluştur/düzenle:
  D:\martı\v3\scenes\bg_<x>.js
YASAK: core.js, themes.js, bosphorus.js, walker.js, index.html, tools/*, başka işçinin bg_*.js dosyası.
Dal: agy/arkaplan (checkout yapma, sadece dosyanı yaz; commit'i entegrasyon yapar).

Önce oku (büyük dosyalarda offset/limit):
  - D:\martı\notlar\ARKAPLAN_PLAN.md  §0, §2 (şablon + kurallar), §3 "İşçi <X>" bölümü (senin 6 sahnen)
  - D:\martı\v3\scenes\themes.js satır 1-115 (üslup örneği: misir, antik) ve core.js satır 33-136 (u yardımcıları)
  - D:\martı\v3\scenes\bosphorus.js (bogaz ile tekrar yapma)
Skill (yalnız ilke): C:\Users\Emir\.gemini\antigravity-cli\skills\threejs-qa-release\ (varsa)

Yapılacak: §2 şablonunu birebir kullan; dosya başına 6 META satırı (id, min, max, label, road — plandaki değerler).
Her sahne: build'de gök (u.bands) + ışık kaynağı + uzak profil + SOL simge (%10–30) + SAĞ simge (%70–90) + zemin (g=0.7H);
frame'de plandaki animasyonlar (≤2000 fillRect/kare, Math.random yok, yalnız t ve st).
Simge tanınır olmalı: oran ve siluet doğru, 2-4 ton gölge, 1px vurgu. Yazı/logo yok.

Kabul (hepsi geçmeden bitmiş sayılmaz):
  1) node --check D:\martı\v3\scenes\bg_<x>.js
  2) node D:\martı\v3\tools\scene_smoke.js --files bg_<x>.js   → 6/6 PASS (build ≤30ms, frame ≤2000 rect, NaN yok)
  3) node D:\martı\v3\tools\shot_scenes.js --worker <x>        → v3\shots\bg\<x>_1.png, <x>_2.png
  4) node D:\martı\v3\tools\shot_scenes.js --worker <x> --check → hata yok
  5) PNG'lere kendin bak (küçük ölçek): simgeler yalnız kenarlarda, orta sakin, zemin 0.7H, yol bandı boş, 6 sahne birbirinden ve mevcut 11 sahneden ayırt edilir.
  6) git status: yalnız bg_<x>.js ve shots\bg\<x>_*.png değişmiş.
Rapor (5 satır): sahne listesi, smoke sonucu (en yavaş build ms, en yüksek rect), PNG yolları, bilinen zayıf nokta, değişen dosya.
```

### 5.1 İşçi ekleri

| İşçi | dosya | sahneler (§3) | seed | özel not |
|------|-------|---------------|------|----------|
| A | `bg_a.js` | gobeklitepe, ur_ziggurat, hattusa, truva, babil, atina | 101–169 | Taş dokusu ortak `stoneBlock()` yerel yardımcısıyla çizilir. Atina, `antik` sahnesinden belirgin biçimde ayrılmalı. |
| B | `bg_b.js` | cin_seddi, roma, maya, ayasofya, bagdat, viking | 201–269 | Kemer yardımcısı `arch()` roma/bagdat/ayasofya'da ortak kullanılır. Viking aurorasında bütçeye dikkat. Ayasofya minaresiz. |
| C | `bg_c.js` | hacli, mogol, bursa, yasak_sehir, ronesans, tac_mahal | 301–369 | Kubbe yardımcısı `dome()` hacli/bursa/ronesans/tac_mahal'da ortaktır (soğan/yarım/sivri varyant). Moğol at animasyonu 4 kare. |
| D | `bg_d.js` | suleymaniye, lale_devri, abd_bagimsizlik, fransiz_devrimi, tanzimat, londra | 401–469 | Minare yardımcısı `minaret()` (şerefe sayısı parametreli) suleymaniye/tanzimat'ta kullanılır. Türk bayrağı için `u.flag`. Boğaz sahneleri bosphorus.js'ten farklı olmalı. |
| E | `bg_e.js` | eyfel, canakkale, ikinci_dunya, bm_newyork, ay_inisi, tokyo_80 | 501–569 | Kafes yardımcısı `lattice()` eyfel ve tokyo kulesinde ortaktır. ikinci_dunya/canakkale'de şiddet ve gamalı haç YOK. ay_inisi'nde roket yok. |
| F | `bg_f.js` | berlin_duvari, silikon, kus_yuvasi, dubai, yeni_istanbul, mars | 601–669 | Havai fişek yardımcısı `firework(c,u,x,y,t,cols)` berlin ve kus_yuvasi'nda ortaktır. Logo yok. Yeni İstanbul gündüz ve Boğaz'ın kuzey ağzında. |

Paralellik: 6 işçi aynı anda çalışabilir (her biri kendi dosyası; makine sınırı 4–6 agy işçisi). Ekran görüntüsü komutları 2–3'ten fazla aynı anda çalıştırılmaz. Edge profil klasörü işçi başına ayrıdır (`pusulla_shot_<x>`); shot_scenes.js bunu `--worker` adından türetir.

### 5.2 Gözden geçirme (≤ 2 tur)

- Altı işçi bitince 12 PNG (`a_1 … f_2`) agy Opus'a gider. Kota yoksa Claude Opus alt ajanına gider.
- Kontrol listesi:
  - simge tanınırlığı;
  - kenar yerleşimi;
  - paletin döneme uyması;
  - mevcut sahnelerle tekrar olmaması;
  - mobil (375×812) kırpılması (`shot_scenes.js --ids x` + `&vw=375&vh=812`).
- Revize listesi işçiye gider; işçi yalnız kendi dosyasını düzeltir.

---

## 6. Entegrasyon (tek kişi; işçiler ve gözden geçirme bittikten sonra)

1. **index.html**
   - 14. satırdaki `<script src="scenes/themes.js"></script>` satırının hemen ardından, `walker.js` satırından önce 6 satır eklenir.
   - Satırlar GORSEL işaretleri arasında kalır:
   ```html
     <script src="scenes/bg_a.js"></script>
     <script src="scenes/bg_b.js"></script>
     <script src="scenes/bg_c.js"></script>
     <script src="scenes/bg_d.js"></script>
     <script src="scenes/bg_e.js"></script>
     <script src="scenes/bg_f.js"></script>
   ```
2. **core.js 139–156: `pick`**
   - `BY_ERA` aynı kalır. if-zinciri yerine tablo konur:
   ```js
   var PICK_BY_YEAR = [
     [-3500,'gobeklitepe'],[-2600,'ur_ziggurat'],[-1600,'misir'],[-1200,'hattusa'],[-800,'truva'],[-500,'babil'],
     [-330,'atina'],[-220,'antik'],[-27,'cin_seddi'],[200,'roma'],[500,'maya'],[750,'ayasofya'],[900,'bagdat'],
     [1066,'viking'],[1200,'hacli'],[1243,'selcuklu'],[1299,'mogol'],[1406,'bursa'],[1440,'yasak_sehir'],[1482,'fetih'],
     [1520,'ronesans'],[1600,'suleymaniye'],[1630,'kesif'],[1680,'tac_mahal'],[1750,'lale_devri'],[1789,'abd_bagimsizlik'],
     [1815,'fransiz_devrimi'],[1839,'sanayi'],[1876,'tanzimat'],[1889,'londra'],[1914,'eyfel'],[1919,'canakkale'],
     [1939,'cumhuriyet'],[1946,'ikinci_dunya'],[1957,'bm_newyork'],[1969,'uzay'],[1976,'ay_inisi'],[1985,'tokyo_80'],
     [1992,'berlin_duvari'],[2001,'dijital'],[2007,'silikon'],[2010,'kus_yuvasi'],[2015,'dubai'],[2020,'yeni_istanbul'],
     [2024,'mars'],[Infinity,'metropol']
   ];
   function pick(eraId, year) {
     if (eraId === 'simdi' || eraId == null) return 'bogaz';
     var y = (year === null || year === undefined || year === '') ? null : +year;
     if (y !== null && !isNaN(y)) {
       for (var i = 0; i < PICK_BY_YEAR.length; i++) if (y < PICK_BY_YEAR[i][0]) { var id = PICK_BY_YEAR[i][1]; return themes[id] ? id : (BY_ERA[eraId] || 'bogaz'); }
     }
     return BY_ERA[eraId] || 'bogaz';
   }
   ```
   - `themes` aşağıda (satır 159) tanımlıdır. Fonksiyon çağrıldığında dolu olur; kayıtsız yeni id gelirse dönem sahnesine düşer (güvenli geri dönüş).
   - Satır 4'teki üst yorum güncellenir: "yıl → PICK_BY_YEAR tablosu (46 sahne)".
3. **core.js 172: `MID`** (yalnız yıl yoksa kullanılır; simge yılı):
   ```js
   var MID = { gobeklitepe:-9600, ur_ziggurat:-2900, misir:-2560, hattusa:-1350, truva:-1180, babil:-575, atina:-440, antik:-250,
     cin_seddi:-210, roma:80, maya:350, ayasofya:537, bagdat:830, viking:980, hacli:1099, selcuklu:1229, mogol:1260, bursa:1399,
     yasak_sehir:1420, fetih:1453, ronesans:1504, suleymaniye:1557, kesif:1610, tac_mahal:1653, lale_devri:1728, abd_bagimsizlik:1776,
     fransiz_devrimi:1789, sanayi:1830, tanzimat:1856, londra:1886, eyfel:1889, canakkale:1915, cumhuriyet:1923, ikinci_dunya:1941,
     bm_newyork:1952, uzay:1961, ay_inisi:1969, tokyo_80:1980, berlin_duvari:1989, dijital:1996, silikon:2004, kus_yuvasi:2008,
     dubai:2010, yeni_istanbul:2017, mars:2021, metropol:2025 };
   ```
4. **core.js 480–481: `labels`**. Mevcutlar korunur, `antik` değişir, yeni satırlar eklenir:
   ```js
   labels: { bogaz:'BOĞAZ', gobeklitepe:'GÖBEKLİTEPE', ur_ziggurat:'SÜMER UR', misir:'ESKİ MISIR', hattusa:'HİTİT HATTUŞA',
     truva:'TRUVA', babil:'BABİL', atina:'ATİNA AKROPOLİS', antik:'HELENİSTİK ÇAĞ', cin_seddi:'ÇİN SEDDİ', roma:'ROMA KOLEZYUM',
     maya:'MAYA TİKAL', ayasofya:'BİZANS AYASOFYA', bagdat:'ABBASİ BAĞDAT', viking:'VİKİNG FİYORDU', hacli:'HAÇLI SEFERLERİ',
     selcuklu:'SELÇUKLU DÖNEMİ', mogol:'MOĞOL BOZKIRI', bursa:'OSMANLI KURULUŞU', yasak_sehir:'MİNG YASAK ŞEHİR', fetih:'FETİH DÖNEMİ',
     ronesans:'RÖNESANS FLORANSA', suleymaniye:'OSMANLI KLASİK', kesif:'KEŞİFLER ÇAĞI', tac_mahal:'BABÜR TAC MAHAL',
     lale_devri:'LALE DEVRİ', abd_bagimsizlik:'ABD BAĞIMSIZLIĞI', fransiz_devrimi:'FRANSIZ DEVRİMİ', sanayi:'SANAYİ DEVRİMİ',
     tanzimat:'TANZİMAT', londra:'VİKTORYA LONDRASI', eyfel:'BELLE ÉPOQUE PARİS', canakkale:'ÇANAKKALE 1915',
     cumhuriyet:'CUMHURİYET DÖNEMİ', ikinci_dunya:'II. DÜNYA SAVAŞI', bm_newyork:'SAVAŞ SONRASI NEW YORK', uzay:'UZAY ÇAĞI',
     ay_inisi:"AY'A İNİŞ", tokyo_80:"TOKYO 80'LER", berlin_duvari:'BERLİN DUVARI', dijital:'DİJİTAL ÇAĞ', silikon:'WEB 2.0',
     kus_yuvasi:'PEKİN 2008', dubai:'DUBAİ', yeni_istanbul:'YENİ İSTANBUL', mars:'MARS ÇAĞI', metropol:'AKILLI ÇAĞ' },
   ```
   - Etiket sonuç ekranında DOM metni olarak çıkar (`question.js:185` `span.era-chip`), pixfont kullanılmaz; `É`, `.`, `'` ve rakamlar sorunsuz görünür. Etiket ileride pixfont'a taşınırsa `scene_pick_test.js` her etiket karakterinin `ui/pixfont.js` glif tablosunda olduğunu da doğrulamalı (rakam ve `'` mevcut, `É` yoksa `BELLE EPOQUE PARİS`).
5. **core.js 472–485: `P.scene`** nesnesine `PICK_BY_YEAR: PICK_BY_YEAR` eklenir (test ve kontak sayfası sırası için).
6. **core.js geliştirici kancası `?scene=<id>`**
   - `mount` sonunda (`start()` sonrası):
     `var m = /[?&]scene=([a-z0-9_]+)/.exec((global.location && global.location.search) || ''); if (m && themes[m[1]]) { forced = m[1]; show(forced); }`
   - `setScene` başına: `if (forced) { show(forced); return; }`.
   - `forced` değişkeni `cur` satırının yanında `var forced = null;` olarak tanımlanır.
   - Console'dan `PUSULLA.scene.show('roma')` zaten çalışıyor.
6b. **İsteğe bağlı soru `scene` alanı** (§1). Üç çağrı noktası birlikte değişir:
   - `game.js:1079`: `safeSetScene(eraId, { year: …, modeId: state.modeId, scene: q && q.scene })`. `q` değişkeni o fonksiyonda zaten var (1081. satırda `buildResultPayload(item, points, tierId, q, …)`).
   - `core.js` `setScene` (satır 380): `var id = (opts && opts.scene && themes[opts.scene]) ? opts.scene : pick(eraId, yr);`
   - `ui/question.js:165` `eraName`: etiket de aynı sahneyi göstermeli. Sonuç durumunda sorunun `scene` alanı varsa `sc.labels[scene]` döner; yoksa `pick(id, year)` ile mevcut davranış sürer. Soru nesnesi `st` içinde yoksa `game.js` `result:show` yüküne `scene` eklenir ve question.js oradan okur.
   - Veri: `v3/data/q_demo.js` / `q_demo2.js` içinde dört soruya `"scene"` eklenir (§1 tablosu). İki dosya üretilmiş veriyse, üreten betik (`tools/harvest/60_emit.js` ya da f4 betikleri) de aynı alanı yazacak şekilde güncellenir; aksi halde yeniden üretimde alan kaybolur.
   - Test: `scene_pick_test.js` içinde `setScene('elektronik', {year:1950, scene:'cumhuriyet'})` çağrısından sonra sahnenin `cumhuriyet` olduğu (`P.scene` iç durumu ya da `data-scene` stub'ı ile) ve `scene:'yok_boyle'` verilince yıla düşüldüğü doğrulanır.
7. **walker.js 158–171: `ROADS`**
   - Yorum "47 tema için" olur. Mevcut 11 satır korunur, 36 satır §3'teki yol değerleriyle eklenir (META satırlarıyla çapraz kontrol).
   - `S.walker = {…}` (satır 214) içine `ROADS: ROADS` eklenir (test için).
8. **Test betiği `v3/tools/scene_pick_test.js`** (entegrasyon yazar; node, vm ile core + themes + bosphorus + walker + bg_a..f yüklenir). Doğrulananlar:
   - her `PICK_BY_YEAR[i]` için `min = önceki sınır` (ilk için −1e6) ve `max = sınır−1` (son için 2100). Hem `pick('antik', min)` hem `pick('antik', max)` `PICK_BY_YEAR[i][1]` döner;
   - `pick('simdi', 1500) === 'bogaz'`, `pick(null) === 'bogaz'`, `pick('ortacag', null) === 'selcuklu'`;
   - 46 id + bogaz `themes` içinde kayıtlı, `labels` dolu, `walker.ROADS` dolu;
   - META satırları (bg_*.js başı) core `PICK_BY_YEAR`/`labels`/`ROADS` ile aynı (regex ile okunur).
   - Çıktı `PICK 46/46`; hata varsa çıkış 1.
9. **Kontroller (sırayla)**
   1. `node --check` tüm `v3/scenes/*.js`.
   2. `node v3/tools/scene_smoke.js` → 47/47.
   3. `node v3/tools/scene_pick_test.js` → PASS.
   4. `node v3/tools/check.js --demo` → 0 HATA.
   5. `node v2/tools/check.js` → 868/868 (proje kuralı).
   6. `node v3/tools/shot_scenes.js --all` → `v3/shots/bg/sheet_01..12.png`.
   7. `--all --check` → hata yok.
10. **Tarayıcı duman testi** (Haiku; yerel sunucu ya da file://)
    - `index.html?scene=roma` açılır; Roma görünür, konsol temizdir.
    - `?scene` olmadan bir tur oynanır. Console'da sırayla `PUSULLA.scene.walkTo(-9000)`, `walkTo(537)`, `walkTo(1566)`, `walkTo(1915)`, `walkTo(2022)` çalıştırılır. Beklenen: göbeklitepe → ayasofya → suleymaniye → canakkale → mars yürüyüşü; pan geçişlerinde dikiş yok; sonuç ekranı etiketi doğru.
    - 375×812 ekranda bir kare alınır.
11. **Kapanış**
    - `DEVIR_NOTU.md` güncellenir: "Kim ne yapıyor" satırları kapatılır, sonuç ve kalan işler yazılır.
    - Commit: `Pusulla v3: 36 yeni tarih arkaplanı (bg_a..f) + PICK_BY_YEAR seçim tablosu`.
    - Push, ardından `agy/arkaplan` → `entegrasyon` birleştirilir.

---

## 7. Kontak sayfası (4'lü, 2×2) — kısa tarif

- Araç: `scene_preview.html?grid=a,b,c,d&t=2&panel=1&road=1`. Edge headless 1920×1080 penceresinde 4 karo (960×540) üretir; her karonun sol üstünde `id · [min,max] · etiket` yazar.
- Çalıştırma:
  - `node v3/tools/shot_scenes.js --all` → 47 sahneden 12 sayfa (son sayfada 3 sahne + boş);
  - `--worker <x>` → işçi başına 2 sayfa;
  - `--grid a,b,c,d --out <yol>` → serbest seçim.
- Gözden geçirme sırasında görsel token için 12 sayfa yarım ölçekte bakılır. Tek tek sahne yalnız revize gerekirse açılır.
- Hareket kontrolü gerekiyorsa aynı grid `&t=0`, `&t=1.5`, `&t=3` ile üç kez çekilir (3 PNG yan yana karşılaştırılır; GIF gerekmez).

---

## 8. Faz 2 (opsiyonel, şimdi YAPILMAZ) — bölge/şehir ipucu

Ör. dunya_sehri "Pekin" cevabı (kuruluş −1045 → truva) yerine `yasak_sehir` göstermek için:
1. `game.js:1079` `safeSetScene(eraId, {year, modeId, pool: q.pool, label: item.label})`.
2. `core.js` `pick(eraId, year, hint)` → önce `HINTS` (yalnız dunya_sehri/baskent/ulke/dunya_harikasi/antik_uygarlik havuzlarında, etiket anahtar kelimesi → id, ör. `Pekin|Çin → yasak_sehir`, `Paris|Fransa → eyfel`, `Londra → londra`, `Roma|İtalya → roma`, `Atina|Yunanistan → atina`, `Kahire|Mısır → misir`, `Tokyo|Japonya → tokyo_80`, `Berlin → berlin_duvari`, `New York|Washington → bm_newyork`, `Dubai → dubai`, `Ankara → cumhuriyet`, `Kudüs → hacli`, `Bağdat|Irak → bagdat`, `Hindistan|Yeni Delhi → tac_mahal`, `Moğolistan|Ulan Batur → mogol`, `Oslo|Stockholm|Kopenhag|İzlanda → viking`, `Meksiko|Guatemala → maya`, `Floransa|Venedik → ronesans`, `İstanbul → suleymaniye`); bulunmazsa `PICK_BY_YEAR`.
3. `setScene` içinde `pick(eraId, yr, opts)`.
4. `ui/question.js:165` `eraName(id, year)` aynı ipucuyla çağrılmalı; aksi halde etiket çizilen sahneyle uyuşmaz (§6.6b'deki `scene` yolu genişletilir).
5. `scene_pick_test.js`'e ipucu vakaları eklenir.
