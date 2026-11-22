# REVİZE V2 — Tur 3 (agy tur 2 kontrolü, 2026-11-22)

Girdi: REVIZE_V2_TUR2.md (13 madde), yedek v2_yedek_tur1. Kod değiştirilmedi. Yalnız `diff -u` ile değişen kısımlara bakıldı.

## Doğrulanan (tamam)
- **#1** finalizeRound artık `Scene.setScore(..., {instant:false})` SONRASINDA (game.js ~970). `setPhase`'te `'result'` fazında soru ekranı gizleme (game.js:300-301) korunmuş, diff'te yok.
- **#4** pending `{idx,startedAt}`: startQuestion'da yazılıyor (yalnız `!isUnlimited && !paramShot`), aynı idx'te eski startedAt korunuyor (F5 süreyi sıfırlamıyor); startMode'da kalan süre = ROUND_SECONDS − geçen, ≤0 ise PAS kaydı + persist (pending silinir → çift sayım yok), 7. soruysa finalize + özet. Cevapta `persistPartialRound()` pending'siz yazıyor. SINIRSIZ etkilenmiyor.
- **#12** loadStore: `points/score` Number, `tierLabel/label/raw` String, bozuk öğe filtreleniyor; menüde `escapeHtml(statusText)`.
- **#2** q05 `Sen de kuyuya atlar mısın`; tam cümle, eski etiket ve yeni etiket → valid aynı grup.
- **#3** q37: `simit/tost/poğaça` → invalid; patates kızartması 2,4 (9. sıra); `gofret`→Gofret, `kraker`→Bisküvi.
- **#5** config.js `separateForbiddenPairs` deterministik takas; bağımsız tarama: 2026-11-22'den 800 gün, 3 mod → 0 yasak ardışık çift, 0 belirsizlik, 0 tekrar. 2026-12-02 zirve ve 2027-01-03 dip artık ayrık. check.js 365 gün tarıyor; 15-20 grup / ≤26 etiket / 6-15 alias kuralları diff'te yok (gevşetilmemiş).
- **#6** q34 Orkinos alias temiz; uskumru/kalkan → Balık, ton balığı → Orkinos; `.map` pay ezme kaldırılmış, paylar azalan.
- **#11** Çıktı: `MATCHER 205 | INVALID-ALIAS 610 | NFC 5 | YAKIN-INVALID 1` → `TEST 821/821`, toplam koşulan testlerin toplamı; `+36` sabiti yok.
- **#7** menu.png: alt başlık ve tarih koyu şeritle okunuyor, ikinci martı yok. **#8** orta_2.png: ışık huzmeleri, 2 balık sürüsü, vapur gölgesi, Bayer bant geçişi var. **#13** BAYER4 tek tanım (scene.js:47).
- `node --check` tüm *.js, data/*.js, tools/*.js temiz; `node tools/check.js` → `SORU 42 | GRUP ort 17,1 | ALIAS 4.335 | TEST 821/821 | TAKVİM ok`.
- v1 kökü (data/game/index/matcher/scene/style/README) marti_demo.zip ile birebir aynı. v2 dışında yalnız `D:\martı\v2_game_pre_tur2_isciA.js.bak` eklenmiş (v2_yedek_tur1/game.js ile aynı; zararsız, silinebilir).

## Kalan / yanlış maddeler (öncelik sırası)

1. **[GÖRSEL] scene.js:2231 — yeni `uiPhase === 'menu'` koşulu, bölge ekran görüntülerinde (`?shot=zirve|dip|orta:N`) martıyı gizliyor.**
   Sorun: `handleShotMode` (game.js:1520-1529) yalnız `Scene.debug` çağırıyor, `setUiPhase` hiç çağrılmıyor; uiPhase varsayılan `'menu'` kalıyor (scene.js:174) → drawGull erken dönüyor. dip_4.png'de ortadaki halka boş; zirve_*/orta_*/dip_* karelerinin hiçbirinde martı yok. Oyunda sorun yok (question.png'de martı var), ama görsel QA kareleri yanlış ve tur 2 madde 9'daki "martı halkada küçük" kontrolü yapılamıyor.
   Yapılacak: `Scene.debug` içinde `uiPhase = 'question'` ata (ya da handleShotMode'da bölge dalında `sceneCall('setUiPhase','question')`). drawGull koşulunu değiştirme (oyun sonu menüye dönüşte mode ≠ 'menu' olduğundan uiPhase kontrolü gerekli).
   Tamam: `tools/shots.ps1` sonrası dip_4.png halkada, zirve_0/orta_2.png'de martı görünüyor; menu.png'de hâlâ tek (kahraman) martı.

2. **[MANTIK] Tur 2 madde 10 — etkileşimli kabul testleri yine koşulmadı** (`rev/TUR2_ETKILESIM.md` yok).
   Yapılacak: Haiku/Browser ile tur 2'deki 6 senaryo + pending için 2 senaryo: (a) soru 10 sn açıkken F5 → aynı soru ~ROUND_SECONDS−10 sn; (b) soru açıkken Esc→menü, ROUND_SECONDS bekle, aynı moda gir → o soru PAS, sonraki soru tam süre; (c) 7. soruda bölge atlatan `?auto` turunda `store.days[gün].<mod>.zoneName` = sinematik başlığı.
   Tamam: 9 senaryo geçti, konsolda hata/unhandledrejection yok, kısa log `rev/TUR3_ETKILESIM.md`.

3. **[MANTIK] game.js:710-716 + 1385-1392 + 1441-1459 — pending.startedAt duvar saati; oyun içi duraklatma (Esc kutusu, gizli sekme) kayda yansımıyor.** (Düşük öncelik.)
   Sorun: oturum içinde gizli sekme/Esc kutusu süreyi donduruyor (deadline kaydırılıyor), ama `pending.startedAt` kaydırılmıyor. Kullanıcı 40 sn Esc kutusunda/gizli sekmede kalıp sonra F5 yaparsa soru PAS sayılır ya da süresi kısalır; oturum içi davranışla tutarsız.
   Yapılacak: duraklatma bitince (hidden→visible ve Esc iptal) duraklama süresini `pending.startedAt`'e ekleyip `persistPartialRound({idx: state.currentQ, startedAt: yeni})` yaz. Alternatif: kalan süreyi (`deadline − now`) her duraklatma/görünürlük değişiminde `pending.remainingMs` + `savedAt` olarak yaz; devamda onu kullan.
   Tamam: soru açıkken 30 sn sekme gizle → dön → F5: kalan süre gizlemeden önceki kalan süreyle (±2 sn) aynı.

Başka gerçek kalan/yanlış madde bulunmadı; tur 2'nin 13 maddesinden 11'i tam, madde 9 (DİP) kod olarak yapılmış (4 plankton kümesi + büyük yem karede seçiliyor) ama martı kontrolü yukarıdaki 1. madde yüzünden doğrulanamadı, madde 10 yapılmadı.
