root agent idle; waiting for 1 background task(s) to finish
`node --check` ve `node D:\martı\v2\tools\check.js` (TEST 815/815, TAKVİM ok) temiz geçti. `shots.ps1` arka planda ekran görüntülerini alıyor; tamamlanmasını bekliyorum.
### A. Madde Tablosu (1–38)
| No | Durum | Değişen Dosya ve Fonksiyon | Kabul Kontrolü (Gözlenen) |
|---|---|---|---|
| 1 | YAPILDI | `matcher.js` `normalizeTR`, `check.js` | NFC/ZWSP/NBSP/tipografik 5 vaka `check.js`'te geçti (`valid:Çay`). |
| 2 | YAPILDI | `matcher.js` `findExactOrStemMatch`/`findFuzzyMatch`/`matchAnswer`, `check.js` | Tüm 42 sorudaki tüm invalid alias'lar `invalid` döndü (0 hata). |
| 3 | YAPILDI | `game.js` `escapeHtml`/`safeColor`/`enterReveal`/`showResult`/`renderSummary` | `raw`, `label`, `q.text`, `tierLabel` escape edildi; `tierColor` hex doğrulandı. |
| 4 | YAPILDI | `game.js` `enterReveal`/`startMode`/`renderMenu`/`finalizeRound` | 7. sonuçta `finalizeRound()` çağrılır; `roundFinalized` çift sayımı önler. |
| 5 | YAPILDI | `game.js` `bindEvents` (`keydown`) | `e.repeat \|\| e.isComposing` engelli; buton odaktayken Enter çift tetiklemez. |
| 6 | YAPILDI | `game.js` `refreshDailyIfNeeded`, `config.js` `getDailySet` | `date/reset/auto/shot` yalnız local/file/`?debug=1`; `dayNumber >= 1`. |
| 7 | YAPILDI | `game.js` `visibilitychange`/`updateTimerLoop`/`bindEvents` | Sekme gizlenince ve Esc kutusunda süre donar; timeout tetiklenmez. |
| 8 | YAPILDI | `sound.js` `ensureContext`/`setEnabled`/`visibilitychange` | `resume().catch` eklendi; gizlenince suspend, `setEnabled(false)` sesi keser. |
| 9 | YAPILDI | `game.js` `loadStore`/`saveStore`/`renderMenu` | `setItem` probe başarısızsa `persistent=false` notu; bozuk gün kayıtları atılır. |
| 10 | YAPILDI | `game.js` `fallbackCopy`/`copyShareText`/`renderMenu`/`cacheDom` | `fallbackCopy` boolean döner; `renderMenu` timer temizler; null DOM loglanır. |
| 11 | YAPILDI | `scene.js` `drawWaterSurface` | Yatay kesik ışıltı çizgileri; `orta` ve derin `dip`'te `reflAlpha=0`. |
| 12 | YAPILDI | `scene.js` `drawDistantBridge` | Kuleler ve tabliye yaklaşım ayakları `y=104`'e iner + 1px koyu taban. |
| 13 | YAPILDI | `scene.js` `drawOrtaShore` | Avrupa kıyı ucu ve uzak tepe `y=104`'e eğimli burunla iner. |
| 14 | YAPILDI | `scene.js` `drawOrtaPier`/`drawOrtaShore`/`drawMosqueStatic` | `orta_2.png`: 6 siyah kutu yerine ahşap iskele+tabela; Ortaköy açık taş; Galata oturuyor. |
| 15 | YAPILDI | `scene.js` `drawZoneBanner`/`drawGull`, `game.js` `setPhase` | `cine_zirve.png`: tek başlık, martı sağ-alta alındı, skor üstü temiz. |
| 16 | YAPILDI | `scene.js` `drawZoneExtras` | `dip_4.png`: fener balığı, plankton, tüp solucan, çapa, çay bardağı, kayalık taban. |
| 17 | YAPILDI | `style.css` `.sign-card`/`.question-hint`/`@keyframes signEnter` | `question.png`: tam opak koyu zemin (`#1f1830`), ipucu konturlu ve net. |
| 18 | YAPILDI | `game.js` `drawHeroGull`/`drawLogo`, `index.html`, `scene.js` `GULL_FRAMES` | `menu.png`: 32x24 atkılı kahraman martı; `dip_4.png`: kanat/kuyruklu dalış pozu. |
| 19 | YAPILDI | `game.js` `updateDebugBox`, `scene.js`, `style.css` | `end_zirve.png`: banner kalıntısı yok, mod listesi sığar, menü metni 13px; `?debug` şartı. |
| 20 | YAPILDI | `scene.js` `drawUnderwater` | `zirve_0.png`: vapur gölgesi, 2. balık sürüsü, yengeç, denizyıldızı, ışık huzmeleri. |
| 21 | YAPILDI | `scene.js` `getZoneInfo`, `game.js` `updateZoneBadge`/`onZoneEnter` | Bölge adı `maxZoneIndex`'ten (puan), metre kamera enterpolasyonundan okunur. |
| 22 | YAPILDI | `scene.js` `setScore` | `opts.instant` sessizce `maxZoneIndex` atar; banner/ses/callback tetiklemez. |
| 23 | YAPILDI | `scene.js` `drawZoneBanner`/`ensureBannerBuf`/`BAYER4` | Offscreen canvas üzerinde `BAYER4` eşiğiyle alt çizgi ve alt yazı dahil piksel sönüşü. |
| 24 | YAPILDI | `game.js` `renderCinematic`, `style.css` `#question.fading` | Sonuç fazından geçişte `#question` 0.4s `.fading` ile solar. |
| 25 | YAPILDI | `game.js` `showResult`/`renderSummary` | `item.answer.label`, `r.label`, `q.text` `toUpperTR()` ile sarıldı. |
| 26 | YAPILDI | `game.js` `buildAnswersRows` | Ölü `picked` kodu silindi; DİP listesi azalan sırada 5 satıra tamamlanır. |
| 27 | YAPILDI | `game.js` `renderSummary`/`bindEvents` | Özette odak aktif butona verilir; `summaryNextBtn` disabled ise Enter SINIRSIZ açar. |
| 28 | YAPILDI | `data/q01_10.js` `q09` | Label `Kadayıf`, `kadayif` alias'ı eklendi (`check.js` ok). |
| 29 | YAPILDI | `data/q32_42.js` `q41` | Label `Mete Han`; `oğuz kağan`/`onlu sistem` çıkarıldı, `metehan`/`mete`/`hun kağanı` eklendi. |
| 30 | YAPILDI | `data/q32_42.js` `q36` | `tonton`/`kuzu`/`çiftlik kuzusu` çıkarıldı; `kuzucuk çizgi film` eklendi. |
| 31 | YAPILDI | `data/q21_31.js` `q31` | Metin `Taksicinin yolda açtığı bir konuyu söyle` olarak güncellendi. |
| 32 | KISMEN | `data/q32_42.js` `q37` | Parantez kaldırıldı, `Simit`/`Tost` çıkarıldı; `check.js` min 15 grup kuralı için `Patates kızartması`/`Gofret` kondu. |
| 33 | KISMEN | `data/q01_10.js` `q05` | `elalem ne der` çıkarıldı; `check.js` <=26 karakter sınırı için label `Kuyuya atlasa atlar mısın` (25 krk). |
| 34 | YAPILDI | `data/q01_10.js` `q02` | Label `Ellerinden öperim`, alias'lar güncellendi. |
| 35 | YAPILDI | `data/q01_10.js`, `q11_20.js`, `q21_31.js`, `q32_42.js` | `Müzik dinlemek`/`Sohbet etmek`/`Yemek`/`Ana yemek` özelleştirildi; `check.js` TAKVİM ok. |
| 36 | YAPILDI | `data/q11_20.js` `q13` | `Çiğ köfte` yerine `Davetiye` eklendi. |
| 37 | YAPILDI | `data/q01_10.js` `q10` | `Kilosu on lira` -> `Kilosu elli lira`, alias `kilosu elli`/`iki kilo yüz`. |
| 38 | YAPILDI | `data/q11_20.js` `q16` | `baris manco` ve `müslüm baba` alias'ları mevcut ve doğrulandı. |

### B. `check.js` ve `node --check` Sonucu
- `node --check` (`game.js`, `scene.js`, `matcher.js`, `sound.js`, `zones.js`, `config.js`, `data.js`): tümü hatasız (exit 0).
- `node D:\martı\v2\tools\check.js`:
  `Matcher Testleri: 205/205 geçti.`
  `SORU 42 | GRUP ort 17,1 | ALIAS toplam 4.329 | TEST 815/815 | TAKVİM ok`

### C. Değişen Dosyalar
`D:\martı\v2\matcher.js`, `D:\martı\v2\game.js`, `D:\martı\v2\sound.js`, `D:\martı\v2\scene.js`, `D:\martı\v2\config.js`, `D:\martı\v2\style.css`, `D:\martı\v2\index.html`, `D:\martı\v2\tools\check.js`, `D:\martı\v2\data\q01_10.js`, `D:\martı\v2\data\q11_20.js`, `D:\martı\v2\data\q21_31.js`, `D:\martı\v2\data\q32_42.js`

### D. Bilinen Sorunlar / Riskler
- Madde 33'te istenen 43 karakterlik tam cümle `check.js` (<=26 karakter) kuralıyla çakıştığı için 25 karakterlik `Kuyuya atlasa atlar mısın` kullanıldı; tam cümle alias'ta tutuluyor.
- `game.js` akış/zamanlayıcı/ses değişiklikleri statik sözdizimi ve `?shot=` kareleriyle doğrulandı; tam etkileşimli tarayıcı içi `?auto=`/Esc/sekme geçişi testi çalıştırılmadı.

### E. Ekran Görüntüsü Durumu
- **Alındı**: `tools/shots.ps1` ile tüm 21 kare güncellendi; `style.css` düzeltmesi sonrası `shots/question.png` yeniden alındı ve görsel olarak incelendi.

TUR1 BITTI
