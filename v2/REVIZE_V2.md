# REVİZE V2 — Tur 1 birleşik düzeltme listesi

Kaynaklar: rev/REV_1_KOD.md, rev/REV_2_SORU.md, rev/REV_3_GORSEL.md, rev/REV_4_ISEMRI.md
Yedek (tur 0): D:\martı\v2_yedek_tur0
Kapsam: yalnız D:\martı\v2. v1 (D:\martı kök *.js) DOKUNULMAZ.
Kurallar: saf HTML/CSS/JS, harici kütüphane/API yok, file:// ile açılmalı.
Başarı ölçütü: `node tools/check.js` 205/205 ve üzeri, `node --check` (game.js, scene.js, matcher.js, sound.js, zones.js, config.js, data.js) temiz.

Satır numaraları tur 0 kodunadır; değişiklikle kayabilir, fonksiyon adını esas al.

---

## (a) GÜVENLİK / AKIŞ HATALARI (önce bunlar)

1. **[matcher] Unicode normalizasyonu ve tipografik karakterler** (REV_1 #1) — `normalizeTR` (matcher.js ~71-81):
   - Girdiye `String(input).normalize('NFC')` ekle (toLocaleLowerCase'den önce).
   - Noktalama temizliğine ekle: `‘ ’ “ ” … – —`, NBSP (U+00A0), sıfır genişlikli boşluk (U+200B), U+200D, U+FEFF, tire.
   - Kabul: `ÇAY’`, `“çay”`, `çay…`, `çay` (sıfır genişlikli boşluklu), `çay` (ayrışık ç, NFD) → hepsi `valid:Çay`. Bu 5 vaka check.js'e test olarak eklenir.

2. **[matcher] matchAnswer sırası** (REV_1 #2) — `matchAnswer` (~515-585): geçersiz (invalid) eşleşme, geçerli fuzzy'den önce gelmeli değil; sıra şöyle olmalı: valid exact/stem → invalid exact/stem → valid fuzzy → invalid fuzzy → content → token. `findNormalMatch`'i kademelere böl.
   - Hata örnekleri: q34 `denizaltı` → Denizatı (fuzzy) yanlış; q38 `karne almak` → Dilek listesi yazmak (fuzzy) yanlış.
   - Kabul: tüm sorularda her invalid label/alias için matchAnswer `invalid` döner (hedef 0 hata). Bu döngü check.js'e kalıcı test olur.

3. **[game] Kaçışsız innerHTML (XSS / bozuk özet)** (REV_1 #3 + REV_4 #7, birleştirildi) — `renderSummary` (game.js ~1079-1091), `tierStrip` (~757), `answersList` (~900-910):
   - `escapeHtml()` yardımcısı yaz (`& < > " '`).
   - `written` (r.raw, toUpperTR sonrası dahil), `r.label`, `q.text`, `r.tierLabel` için uygula.
   - `tierColor` yalnız `/^#[0-9a-f]{3,8}$/i` ile geçsin; değilse varsayılan renk.
   - Kabul: cevap kutusuna `<img src=x onerror=alert(1)>` veya `<b>x` yazılıp tur bitince özet metni düz görünür: `SEN: <B>X`, alert yok, düzen bozulmaz.

4. **[game] Son soru bitince yenileme / Esc: tur tamamlanmadan kapanıyor** (REV_1 #4 + REV_4 #2, birleştirildi) — `finalizeRound()` yalnız `advanceFromResult` içinde çağrılıyor; 7. sonuç `done:false` kalıyor; `startMode` `results.length < 7` şartıyla tur sıfırdan başlatıyor.
   - `enterReveal` içinde son sorunun sonucu kaydedilince `finalizeRound()` çağır (özet yine sonra açılır).
   - `startMode`'da `results.length >= 7 && !done` ise finalize et + özeti aç; q1'e dönülmez.
   - Menüde bu durumda `DEVAM ET 7/7` yerine bitmiş tur davranışı (özet / skor).
   - Kabul: 7. sonuç ekranında Esc veya yenileme → menüde mod "✓ skor"; tıklayınca özet açılır; yeniden oynanmaz, seri artar.

5. **[game] Enter çift tetikleme, tuş tekrarı, IME** (REV_1 #5) — keydown başında `if (e.repeat || e.isComposing) return;`. Odak `button` ise Enter'ı kendi click'ine bırak (menü kartı ve özet Enter kısayolu yalnız odak buton dışındayken çalışsın). Özet: `summaryNextBtn` disabled ise Enter SINIRSIZ turunu başlatır (REV_4 #9 bu maddeye bağlı, bkz. (c)).
   - Kabul: menüde Tab ile 2. karta git, Enter → yalnız o mod 1 kez başlar; Enter basılı tutulunca en fazla 1 aşama ilerler.

6. **[game] Gün sınırı ve ?date= / ?reset= suistimali** (REV_1 #6) — `dayKey/dailySet` yalnız init'te hesaplanıyor.
   - `visibilitychange` ve `renderMenu()` içinde `getTodayKey()` değiştiyse `dailySet`'i yeniden üret.
   - `date / reset / auto / shot` parametrelerini yalnız `localhost`, `file:` ya da `?debug=1` ile kabul et. Canlıda etkisiz.
   - `dayNumber` için `Math.max(1, ...)`.
   - Kabul: cihaz saati 23:59 → 00:01 yapılıp menüye dönülünce yeni gün numarası görünür; canlıda `?date=` etkisiz.

7. **[game] Zamanlayıcı: Esc kutusu, sekme arka planı, yenileme** (REV_1 #7)
   - `visibilitychange`'de gizli kalınan ms kadar `state.deadline` uzat (ya da duraklat).
   - Esc onayı açılınca kalan süreyi dondur, kapanınca devam et. Süre dolumu onay açıkken reveal'a geçirmesin.
   - Yenileme: `persistPartialRound`'a `qStartedAt` yaz ya da notla bırak (kabul edilebilir ise notla).
   - Kabul: soru sırasında sekme 20 sn gizlenip dönülünce soru PAS olmaz; Esc kutusu açıkken sayaç durur.

8. **[sound] WebAudio autoplay / durum** (REV_1 #8) — `ensureContext`:
   - `if (ctx.state !== 'running') { var p = ctx.resume(); if (p && p.catch) p.catch(function(){}); }` (`interrupted` dahil).
   - `visibilitychange`: gizlenince `ctx.suspend()`, görünürde resume.
   - `setEnabled(false)` çalan tonları da kessin (düşük etki, varsa basit).
   - Kabul: konsolda `unhandledrejection` yok; sekme dönüşünden sonra ses çalışır.

9. **[game] localStorage yokluğu ve bozuk veri** (REV_1 #9) — `loadStore/saveStore`:
   - İlk `setItem` başarısızsa `store.persistent=false`; menüde "İlerleme kaydedilemiyor" notu.
   - `loadStore`'da her gün/mod kaydı için `Array.isArray(results)` ve `typeof score==='number'` doğrula; bozuğu at.
   - `?nostorage=1` ile uyarı görünür; bozuk JSON'da menü hatasız açılır.

10. **[game] Küçük dayanıklılık** (REV_1 #10)
   - `fallbackCopy` boolean döndürsün; başarısızsa "KOPYALANAMADI" göster, "KOPYALANDI ✓" yazma.
   - `renderMenu` başında `clearTimers()` (introTimer, revealTimer, timerRaf, scoreAnimRaf null).
   - `cacheDom` sonunda null elemanları `console.error` ile listele.

---

## (b) GÖRSEL (scene.js / style.css / index.html) — REV_3 sırasıyla

11. **Güneş yansıması üçgen/alev** (REV_3 #1) — `drawWaterSurface` (~1343-1364): yansımayı yatay, kesik, aralıklı ışıltı çizgilerine çevir (2-3 satırda bir; genişlik sabit ya da aşağı daralsın; satır başına hafif rastgele kayma). Güneş karanın arkasındaysa (ORTA) `reflAlpha=0`. DİP'te yüzey kapalı.
    - Kabul: menü/ZİRVE'de üçgen şekil yok; ORTA'da güneş görünmüyorsa yansıma yok.

12. **ORTA uzak köprü havada** (REV_3 #2) — `drawDistantBridge` (~1853-1872), çağrı ~1888-1894: kule alt ucunu uzak kıyı profiline (fy / 104) uzat; tabliye iki ucta uzak kıyıya bağlansın; ayak altına 1px koyu taban çizgisi.
    - Kabul: kuleler ve tabliye uçları kıyıya/suya değiyor; altta boşluk yok.

13. **Avrupa kıyısı sağ ucu dikey kesik** (REV_3 #3) — `drawOrtaShore` (~1896-1906, `if (x > limitX) continue`) ve uzak tepe (~1877-1885): kıyı ucunu `limitX`'e doğru 20-30 px eğimle suya indir (burun/kayalık); uzak tepe başlangıcını tepeyle yumuşat.
    - Kabul: sağ uç eğimli burun olarak suya iniyor; dikey kesik kenar yok.

14. **Durak siyah kutular, Ortaköy camii, Galata Köprüsü** (REV_3 #4) — `drawOrtaShore` (~1938-2021, ink kutular): 22x7 siyah kutular yerine iskele/tabela sprite'ı (ahşap iskele + durak adı levhası). Ortaköy camii açık taş renkli (bldC/cream) ve konturlu, kıyıdan ayrılsın. Galata Köprüsü uçları iki kıyıya bağlansın, ayakları suya değsin.
    - Kabul: 6 durağın hiçbirinde siyah kutu yok; Ortaköy camii arka planla ayırt ediliyor; Galata Köprüsü iki uçtan karaya oturuyor.

15. **ZİRVE sinematik çift başlık, martı yazının üstünde** (REV_3 #5) — `drawZoneBanner` (~2110-2152, y=132 scale 3), `drawGull` (~2052-2083, GULL_Y 96), index.html 90-93 (`cine-zone`):
    - Sinematikte tek başlık: canvas banner'ı sinematik/özet ekranında bastır VEYA HTML başlığını kaldır (ikisi birden yok).
    - Sinematikte martıyı puan yazısının dışına (alt-sağ ya da yazının üstünden 30 px) taşı.
    - Kabul: sinematik karede başlık bir kez görünüyor; puan yazısının üstünde sprite yok.

16. **DİP (Karanlık Dip) boş ve fakir** (REV_3 #6) — `drawZoneExtras` (~1802-1847): fener balığı (ışık yemi, yavaş salınım), biyolüminesan plankton kümeleri, tabanda tüp solucan/kaya + yarı gömülü Boğaz'a özgü nesne (kayık çapası, çay bardağı; tekrar etmeden), martının etrafında küçük ışık halkası; taban profilini kayalık yap.
    - Kabul: dip_4'te en az 3 farklı canlı/nesne türü, biçimli taban; boş alan %60'ın altında.

17. **Soru tabelası şeffaf, bulutlar okumayı bozuyor** (REV_3 #7) — style.css `.sign-card` (~389-403), `signEnter`: kart arka planı tam opak koyu (#1f1830 vb.); giriş animasyonunda opaklık en geç 0,35 sn'de 1'e çıksın; ipucu metnine 1px koyu kontur/gölge. Gerekirse bulutları kart alanından kaydır (`drawClouds` ~1202).
    - Kabul: soru, ipucu ve sayaç 1080p'de arkadaki bulutlardan bağımsız net okunuyor.

18. **Martı maskotu küçük / dive pozu kalem gibi** (REV_3 #8) — `GULL_FRAMES` (~85-150), `drawGull` (~2052-2083), `drawGullSprite` (~2557): menü için ayrı büyük kahraman martı (≈32x24, belirgin göz, sarı gaga, hafif kalın kontur, tek imza aksesuar) + bekleme animasyonu (göz kırpma, kafa çevirme). Oyun içi sprite'ta göz + gaga 1 px büyüsün; dive karesine kanat/kuyruk silueti ekle.
    - Kabul: menüde martı ilk bakışta maskot olarak okunuyor; dip_4'te dalış pozu martı olarak tanınıyor.

19. **Özet/sinematik banner kalıntısı, debug kutusu, küçük menü metni** (REV_3 #9) — `drawZoneBanner` (~2110): özet açılınca `banner=null` (end karesinde "GECE İSTANBUL" ve sarı çizgi taşmasın). "Bugünkü modlar" listesinin son satırı (ORTA KARAR) çerçeveye sığsın (alt boşluk). `debugBox` (game.js ~85-101) yalnız `?debug` ile görünsün (şu an "HATA: 0 · SELFTEST: ok" her karede görünüyor). Menü kart açıklama ve istatistik fontu ≥13 px (1080p).
    - Kabul: end karesinde yazı kalıntısı yok; normal açılışta debug kutusu yok; menü küçük metinleri rahat okunuyor.

20. **Su altı yarısı boş ve düz bantlar** (REV_3 #10) — `drawUnderwater` (~1449-1539): derinlik katmanı (ışık huzmeleri belirginleşsin), orta mesafede ikinci balık sürüsü, kıyı raflarında yengeç/denizyıldızı, yüzey altında vapur gölgesi. Menü için kamerayı biraz yukarı alıp su altı payını ~%30'a indirmek seçenek.
    - Kabul: menü ve zirve_0'da su altında en az 3 hareketli öğe ve 2 derinlik katmanı.

Korunacak (değiştirme): Ana Boğaz Köprüsü ayakları `landTop` ile kıyıya oturuyor (`drawBridgeStatic` ~620-647); gün batımı paleti, bulutlar, kıyı ışıkları, vapur, menü kompozisyonu.

---

## (c) İŞ EMRİ EKSİKLERİ (IS_EMRI_V2.md ile uyum) — REV_4 sırasıyla (#2, #7, #9 yukarıda (a)'da)

21. **Bölge adı kameradan okunuyor, puandan değil** (REV_4 #1) — `getZoneInfo` (scene.js ~2459-2476) ve `getZoneBlend` (~1050-1059): `name/index` = puan tabanlı son `setScore` bölgesi (`maxZoneIndex` ya da saklanan `scoreZoneIndex`); yalnız `label` kamera ile enterpole edilsin. `onZoneEnter` (game.js ~1457-1459) → `updateZoneBadge(true)` callback'teki `{name,label}`'i doğrudan kullansın. Etkilenen yerler: game.js ~451-469, 777, 940-945, 981-987 (`finalizeRound` zoneName, sinematik, paylaş).
    - Kabul: ZİRVE'de 60 puana çıkan cevapta rozet aynı reveal içinde `▲ GALATA HİZASI` olur ve `glow` sınıfı alır; 130 puanla biten turda sinematik ve paylaş `GALATA HİZASI` yazar. `?auto` modunda da doğru.

22. **setScore instant geri yüklemede banner/ses/callback tetikliyor** (REV_4 #3) — scene.js ~2404-2417: `opts.instant` ise `maxZoneIndex = zoneIndex` sessizce ata; banner, flaş, ses, callback yok. game.js ~415 (bitmiş mod özeti) ve ~446 (DEVAM ET) bunu kullanır.
    - Kabul: 300 puanlık yarım ZİRVE turuna DEVAM ET'te "BULUT DENİZİ" banner'ı ve `zone` sesi çıkmaz; rozet doğru bölgeyi gösterir.

23. **Banner sönüşü alpha yerine Bayer dithering; alt çizgi ve rozet satırı aniden kayboluyor** (REV_4 #4) — scene.js ~2143-2151: banner offscreen'e çizilsin; 1.9–2.3 sn'de `BAYER4[y%4][x%4]/16 < fade` olan pikseller silinsin. Alt çizgi ve `+60 m` satırı aynı maskeyle sönsün.
    - Kabul: 2.1 sn karesinde banner piksel deseniyle yarı silinmiş (yarı saydam değil); alt çizgi ve `+60 m` sönüş boyunca görünür.

24. **Sinematikte tabela ve dock anında kayboluyor** (REV_4 #5) — game.js ~241-249 (`setPhase`) ve style.css ~160-169 (`.screen{display:none}`): `renderCinematic` önce `#question`'a `fading` sınıfı (opacity 1→0, 0.4 s) eklesin, 400 ms sonra fazı değiştirsin.
    - Kabul: son sonuçtan sonra tabela/dock 0.4 sn solarak kaybolur, sonra bölge adı görünür.

25. **Büyük harf kuralı** (REV_4 #6) — game.js ~910 (`item.answer.label`), ~1084 (`r.label`), ~1088 (`q.text`): üçü `toUpperTR()` ile sarılsın (UI büyük harf, text-transform yok).
    - Kabul: sonuç listesinde `1. ÇAY (sen)`, özette `1. KAHVALTIDA…` ve `→ İNECEK VAR`; Türkçe İ/I doğru.

26. **DİP sonuç listesi** (REV_4 #8) — game.js ~801-816 (`picked`/`addUnique` ölü kod, kullanılmıyor): sil. Oyuncu ilk 2'deyse 3. en çok verileni ekleyerek 5 satıra tamamla (ya da kuralı yorumla belgele). Paya göre azalan; oyuncu satırı kalın + `(sen)`.
    - Kabul: DİP'te 1. cevap verildiğinde liste 5 satır, oyuncu satırı kalın + `(sen)`.

27. **Özette Enter ile SINIRSIZ OYNA'ya ulaşılamıyor** (REV_4 #9) — game.js ~1276-1285: `summaryNextBtn.disabled` ise Enter → `startMode('sinirsiz')`; özet açılınca odak ilk aktif butona verilsin. ESC menüye dönsün.
    - Kabul: üç mod bitmişken özette Enter SINIRSIZ turunu başlatır; fare olmadan menü → tur → özet → menü çalışır.

---

## (d) SORU VERİSİ (data.js ve data/q*.js; satırlar data\ altındaki dosyalara göre) — REV_2

28. **q09 Kadayif aksanı** (q01_10.js:398): label `Kadayıf`; alias'a `kadayif` ekle (`kadayıf` zaten var).

29. **q41 Metehan** (q32_42.js:414): label `Mete Han`; alias'tan `oğuz kağan` çıkar; `metehan`, `mete`, `hun kağanı` ekle; `onlu sistem` zayıf, kaldır/değiştir.

30. **q36 Kuzucuk alias** (q32_42.js:201): `tonton`, `kuzu`, `çiftlik kuzusu` alias'larını çıkar; `kuzucuk çizgi film` bırak.

31. **q31 soru kalıbı** (q21_31.js:413): "...hangi konuyu açar?" → "Taksicinin yolda açtığı bir konuyu söyle".

32. **q37 parantez ve çakışan cevaplar** (q32_42.js): "(kahvaltı dışı)" parantezini kaldır, metin "Sevilen bir atıştırmalık söyle" olsun; `Simit` ve `Tost` cevaplarını çıkar (kahvaltıyla çakışıyor).

33. **q05 yarım label** (q01_10.js:236): label `Arkadaşın kuyuya atlasa sen de atlar mısın`; `elalem ne der` alias'ını bu soruda kaldır ya da ayrı cevap yap.

34. **q02 yarım label** (q01_10.js:130): label `Ellerinden öperim` (ya da `Ellerinden öperim, gözlerinden`); alias'lar ona göre güncellenir.

35. **Jenerik / tekrar eden cevaplar** (REV_2 #8, #9): `Müzik dinlemek` ve `Sohbet etmek` (q03, q33, q38, q14, q35) → özelleştir (`Çalışırken müzik dinlemek`) ya da çıkar; q13 `Yemek` → `Düğün yemeği`; q40 `Yemek` → `Yemek siparişi`; q24 `Ana yemek` alias'ında `kebap` çıkar; q34 `Balık` alias'larında `orkinos` ile çakışanları ayır. `Çay` (6 soru) ve `Baklava`/`Börek` tekrarları: en azından q30-q32 ve q03-q35 art arda gelmeyecek şekilde takvimi (config.js/getDailySet) kontrol et; takvim değişikliği check.js'te TAKVİM ok kalmalı.

36. **q13 Çiğ köfte** (q21_31.js): düğün için zayıf; çıkar, yerine `Pilav` ya da `Davetiye`.

37. **q10 fiyat güncelliği** (q01_10.js:434): `Kilosu on lira` → `Kilosu elli lira` (ya da `Kilosu bir tık`); alias `iki kilo yirmi` güncellenir.

38. **ASCII alias (opsiyonel, düşük öncelik)**: q16 için `müslüm baba`, `baris manco` (Müslüm Gürses / Barış Manço). Normalize ediliyor, zorunlu değil.

---

## Teslim notu
- Her madde için kabul ölçütü ayrı kontrol edilsin; yapılamayan madde gerekçesiyle raporda "YAPILMADI" olarak işaretlensin.
- Çelişki olursa: (a) güvenlik/akış > (b) görsel > (c) iş emri > (d) veri.
- Bitişte: `node --check` (tüm js dosyaları), `node tools/check.js` (205/205 ve üzeri, SORU 42, TAKVİM ok), v2/shots yeniden alınabiliyorsa (tools/shots.ps1) alınsın; alınamazsa neden alınamadığı yazılsın.
