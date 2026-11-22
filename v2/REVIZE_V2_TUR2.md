# REVİZE V2 — Tur 2 (agy tur 1 kontrolü, 2026-11-22)

Girdi: REVIZE_V2.md (38 madde), rev/AGY_TUR1_CIKTI.md, yedek v2_yedek_tur0. Kod değiştirilmedi.

## Kontrol sonuçları (özet)
- **check.js gevşetilmedi.** `15-20 grup` (satır 93), `etiket ≤ 26` (satır 107), `6-15 alias` (satır 133) aynı. Yalnız test eklendi.
- **815 gerçek ama şişkin:** 205 (eski: 169 veri testi + sabit `+36`) + 5 NFC/tipografik + 605 "her invalid alias → invalid" öz-testi. Testler gerçekten çalışıyor; ancak `+36` (satır 372) koşulan bir test değil, elle yazılmış sabit sayı (tur 0'dan kalma).
- `node --check` (tüm *.js, data/*.js, tools/*.js) temiz; `node tools/check.js` → `SORU 42 | GRUP ort 17,1 | ALIAS 4.329 | TEST 815/815 | TAKVİM ok`.
- **v1 dokunulmamış:** kök data/game/index/matcher/scene/style/README, marti_demo.zip ile birebir aynı. Değişiklikler yalnız v2 içinde (12 dosya + rev/ + REVIZE_V2.md). v2/data.js (v1 arşivi, yüklenmiyor) değişmemiş.
- Kodda doğrulandı (doğru): escapeHtml/safeColor (#3, #25), NFC/ZWSP/tipografik tırnak (#1), matchAnswer sırası valid exact/stem → invalid exact/stem → valid fuzzy → invalid fuzzy (#2), 7/7 kayıtta finalize + özet (#4), `e.repeat/isComposing` (#5), ?date/?reset/?auto/?shot yalnız local/file/?debug=1 + `Math.max(1,…)` (#6), Esc ve sekme gizliyken süre donuyor (#7, kısmen), sound resume().catch (#8), loadStore doğrulama + persistent notu (#9), fallbackCopy boolean (#10), yansıma yatay kesik çizgi + ORTA'da 0 (#11), getZoneInfo adı maxZoneIndex'ten (#21), setScore instant sessiz (#22), banner Bayer sönüşü offscreen (#23), sinematik/özet fazında banner=null → tek başlık (#15, #19; cine_zirve.png doğruladı), menü kahraman martı ~32x24 (#18; menu.png).

## Kalan / yanlış yapılan maddeler (öncelik sırası)

Etiketler: **[MANTIK]** game.js/matcher.js/sound.js • **[GÖRSEL]** scene.js/style.css/index.html • **[VERİ]** data/*.js, config.js, tools/check.js. Farklı etiketler paralel işçiye verilebilir; aynı etiket tek işçi.

1. **[MANTIK] game.js:879-881 — son soruda finalizeRound, setScore'dan ÖNCE çağrılıyor.**
   Sorun: `finalizeRound()` (zoneName'i `Scene.getZoneInfo()`'dan okur, satır 1061-1066) 7. cevabın `Scene.setScore(..., {instant:false})` çağrısından (satır 904) önce koşuyor. 7. cevap yeni bölgeye geçirirse kaydedilen `zoneName` bir önceki bölge olur; paylaş metni (satır 1133-1134) bu bayat değeri kullanır.
   Yapılacak: 879-881'deki `if (state.currentQ >= …-1) finalizeRound();` bloğunu setScore bloğundan sonraya (satır ~909, `updateZoneBadge` öncesine/sonrasına) taşı.
   Tamam: ZİRVE'de 7. cevapla bölge atlatan `?auto` turunda `store.days[gün].zirve.zoneName` ve paylaş metni sinematikteki başlıkla aynı.

2. **[VERİ] data/q01_10.js q05 (madde 33, KISMEN) — etiket `Kuyuya atlasa atlar mısın` anlamca bozuk.**
   Sorun: özne düşmüş ("kim atlasa?"). 26 karakter kuralı doğru korunmuş, kural gevşetilmemeli.
   Yapılacak: label `Sen de kuyuya atlar mısın` (25 krk; istersen `Sen de kuyuya atlar mısın?` 26 krk). Alias'a `kuyuya atlasa atlar mısın` ekle (eski etiketle yazan eşleşsin); tam cümle alias'ı kalsın; `elalem ne der` çıkarılmış durumda kalsın.
   Tamam: check.js temiz; `arkadaşın kuyuya atlasa sen de atlar mısın` ve `sen de kuyuya atlar mısın` → valid aynı grup.

3. **[VERİ] data/q32_42.js q37 (madde 32, KISMEN) — Simit/Tost çıkınca bu cevaplar artık "bulunamadı" düşüyor; yeni gruplar uydurma pay aldı.**
   Sorun: 16 grup var, 2 çıkarılınca 14 olurdu → 2 yenisi eklenmesi doğru (min 15 korunmalı). Ama `simit`, `tost`, `poğaça` invalid listesinde yok (oyuncu "bulunamadı" görür, neden açıklanmaz). `Patates kızartması` Simit'in 8.0 payını, `Gofret` Tost'un 0.2 payını hazır devraldı (gerekçesiz, 5. sıraya patates kızartması tartışmalı).
   Yapılacak: invalid'e `{ aliases: ['simit','tost','poğaça','açma','gevrek'], reason: 'Bu kahvaltılık; soru kahvaltı dışı atıştırmalık soruyor.' }` ekle. Patates kızartması payını gerçekçi bir sıraya (≈2-3) çek, diğer payları azalan sırada ve fark ≥0,2 kuralıyla yeniden dağıt.
   Tamam: check.js temiz (15-20 grup, pay farkı); `simit` → invalid + açıklama; `gofret` → valid:Gofret, `kraker` → valid:Bisküvi.

4. **[MANTIK] game.js persistPartialRound / startMode (madde 7 alt maddesi, YAPILMADI, not da bırakılmadı) — yenileme/Esc ile aynı soruyu tam süreyle yeniden oynama.**
   Sorun: soru açıkken sayfa yenilenir ya da Esc→menü yapılırsa `results.length` değişmediği için aynı soru, soru görülmüş olarak, sıfır süreyle yeniden başlar (cevap arama açığı). `qStartedAt` yazılmıyor; AGY çıktısında da not yok.
   Yapılacak: soru başlarken (`startQuestion`) kayda `pending: { idx, startedAt: Date.now() }` yaz. `startMode` devamında `pending.idx === results.length` ise kalan süre = ROUND_SECONDS − geçen; ≤0 ise o soruyu PAS (0 puan) kaydet ve sonrakine geç. Sınırsız modda gerek yok.
   Tamam: soru 10 sn açıkken yenile → aynı soru ~ROUND_SECONDS−10 sn ile döner; 60 sn bekleyip yenile → PAS kaydı, sonraki soru.

5. **[VERİ] config.js getDailySet (madde 35 takvim alt maddesi, YAPILMADI) — q30/q32 aynı modda art arda geliyor.**
   Sorun: 60 günlük taramada (bugünden) 2026-12-02 ZİRVE ve 2027-01-03 DİP'te q30→q32 ardışık. "TAKVİM ok" bunu ölçmüyor. (q03/q35 ardışık çıkmadı.)
   Yapılacak: shuffle sonrası her mod listesinde yasak çiftler (`[q30,q32]`, `[q03,q35]`, gerekirse Çay içeren sorular) yan yana ise deterministik takas (ör. ikinciyi bir sonraki uygun konumla değiştir). check.js'e 365 günlük "yasak çift ardışık değil" testi ekle.
   Tamam: check.js 365 gün tarar, 0 ardışık yasak çift; TAKVİM ok sürer; aynı tarih her çalışmada aynı seti verir.

6. **[VERİ] data/q32_42.js q34 (madde 35 alt maddesi, YAPILMADI) — `Orkinos` grubu başka balıkları topluyor.**
   Sorun: Orkinos alias'ları `kılıç balığı, kalkan, uskumru, istavrit, mezgit`: bunlar orkinos değil; `Balık` grubuyla anlamca çakışıyor (diff'te q34'e dokunulmamış). Ayrıca `.map` içinde i=17/13/12/11/10 için elle pay ezme var; sıralama sonrası pay farklarını kontrol et.
   Yapılacak: Orkinos alias → `ton balığı, ton, orkinos balığı, mavi yüzgeçli orkinos, orkinoslar, tuna`; uskumru/istavrit/mezgit/kalkan/kılıç balığı → `Balık` alias'ına (≤15). `.map` ile pay ezmeyi kaldırıp payları doğrudan yaz.
   Tamam: check.js temiz; `uskumru` → valid:Balık, `ton balığı` → valid:Orkinos.

7. **[GÖRSEL] scene.js menü sahnesi + style.css `.menu-day` (menu.png) — tarih satırı güneşin üstünde okunmuyor, oyun martısı alt yazının arkasından görünüyor.**
   Sorun: "MARTI #1 · 22.11.2026" satırı parlak güneş diskiyle çakışıyor (düşük kontrast); GULL_X/GULL_Y'deki oyun içi martı sprite'ı menüde de çiziliyor ve tarih satırının altına giriyor.
   Yapılacak: menü modunda oyun içi martıyı çizme (`mode==='menu'` ise drawGull atla) ya da kahraman martıyla birleştir; `.menu-subtitle/.menu-day`'e 1px koyu kontur + yarı opak koyu şerit.
   Tamam: menu.png'de tarih ve alt başlık her harfiyle okunuyor, ikinci martı görünmüyor.

8. **[GÖRSEL] scene.js drawUnderwater / ORTA (orta_2.png) — ORTA'da su altı yarısı hâlâ düz bant ve boş (madde 20 yalnız ZİRVE karelerinde görünür).**
   Yapılacak: madde 20 öğelerini (ışık huzmesi, 2. balık sürüsü, vapur gölgesi) ORTA kesitinde de çiz ya da ORTA'da kamerayı yukarı alıp su altı payını ~%30'a indir.
   Tamam: orta_0…5.png'de su altı bandında en az 2 hareketli öğe ve derinlik geçişi var; düz renk bandı yatay şerit olarak görünmüyor.

9. **[GÖRSEL] scene.js drawZoneExtras DİP (dip_4.png, madde 16 KISMEN) — Karanlık Dip hâlâ seyrek.**
   Sorun: fener balığı, tüp solucan, çapa, çay bardağı var; biyolüminesan plankton kümeleri karede seçilmiyor, orta alan boş; martı halkası içinde çok küçük.
   Yapılacak: plankton kümelerini 3-4 belirgin küme (Bayer ile parlak nokta, yavaş nabız) olarak orta alana yay; fener balığı ışık yemini 1 px büyüt.
   Tamam: dip_4.png'de (768 px'e küçültülmüş halde bile) plankton kümeleri ve fener balığı yemi seçiliyor.

10. **[MANTIK] Etkileşimli kabul testleri koşulmadı (AGY D bölümü kendisi söylüyor) — madde 4, 5, 7, 27.**
    Yapılacak: tarayıcıda (Haiku/Browser) şu senaryolar: 7. sonuç ekranında Esc ve F5 → menüde "✓ skor"; Tab ile 2. kart + Enter → yalnız o mod; Enter basılı → tek aşama; sekme 20 sn gizli → soru PAS olmaz; Esc kutusu açıkken sayaç durur; özette sonraki mod yokken Enter → SINIRSIZ. Konsolda hata/unhandledrejection yok.
    Tamam: 6 senaryonun her biri geçti, kısa log `rev/TUR2_ETKILESIM.md`.

11. **[VERİ] tools/check.js:372 — test sayısı okunur değil, `+36` sabit.**
    Yapılacak: çıktıyı ayrı yaz: `MATCHER 205 | INVALID-ALIAS 605 | NFC 5`; `+36`'yı `runMatcherTests()`'in gerçekten koştuğu sayıdan al (fonksiyon sayı döndürsün). Ayrıca madde 2 için açık bir test: bir sorunun invalid alias'ı, geçerli bir alias'a 1 harf uzaksa yine invalid dönmeli (ör. q37 `kola` / benzeri).
    Tamam: özet satırı kaynak başına sayı veriyor, toplam koşulan test sayısına eşit.

12. **[MANTIK] game.js loadStore (~180-200) — `results[].points` doğrulanmıyor.**
    Sorun: bozuk/elle değiştirilmiş kayıtta `points` dize olursa `reduce` (satır 451, 552, 564) dize birleştirir; sonuç `innerHTML` ile menüye yazılır (satır 449-463, kendi tarayıcısında XSS/bozuk skor).
    Yapılacak: loadStore'da her sonucu `points = Number(points)||0`, `tierLabel/label/raw` String'e zorla; menüde `statusText` için `escapeHtml`.
    Tamam: localStorage'a `points:"<b>x</b>"` yazılıp açılınca menü sayısal skor gösterir.

13. **[GÖRSEL] scene.js:2276-2281 — `BAYER4` ikinci kez `var` ile tanımlanmış (47-52 ile aynı).**
    Yapılacak: 2276-2281'i sil.
    Tamam: `node --check scene.js` temiz, banner sönüşü aynı görünüyor.

## Paralel dağıtım önerisi
- İşçi A **[MANTIK]**: 1, 4, 12 (game.js) → sonra 10 (tarayıcı testi, Haiku).
- İşçi B **[VERİ]**: 2, 3, 5, 6, 11 (data/*.js, config.js, tools/check.js).
- İşçi C **[GÖRSEL]**: 7, 8, 9, 13 (scene.js, style.css) → bitince `tools/shots.ps1`.
- Sıra kısıtı: 10 numaralı test, A ve B bittikten sonra; ekran görüntüleri C'den sonra.
