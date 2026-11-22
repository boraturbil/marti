# Görsel izden sözleşme / motor notları (2026-11-22)

Görsel katman (`gorsel` dalı) F1 iskeletine (`c551fe4`) karşı denendi. Motor dosyalarına dokunulmadı; aşağıdakiler motor ekibine ve sözleşme sahibine bilgi/öneridir.

## A. Hatalar (motor, `game.js`)
1. **SONRAKİ geçerli cevaptan sonra çalışmıyor (engelleyici).** `actions.submit` ve `actions.confirmSuggestion` doğru eşleşmede `state.locked = true` yapıp `finalizeAnswer` çağırıyor; `finalizeAnswer` kilidi açmıyor. `actions.next` ise `state.locked` iken erken dönüyor. Sonuç: geçerli bir cevaptan sonra tur ilerlemiyor (yalnız süre dolunca ilerliyor). Deneme: `selectMode('yeni')` → GEÇ → `submit('firefox')` → `next()` → `state.get()` hâlâ `{phase:'result', index:1}`. Öneri: `finalizeAnswer` sonunda (ya da `result:show` yayınından önce) `state.locked = false`.
2. **Rotada tur özeti görünmüyor.** `finishRound` günlük rotada `round:end` yayınladıktan hemen sonra aynı çağrıda sonraki bacağı başlatıyor (`startMode`), bu yüzden özet ekranı bir kare bile kalmıyor. Öneri (ekleme): rotada sonraki bacak `actions.next()` (ya da yeni `actions.continueDaily()`) ile başlasın; bacaklar istenen sırada açılacaksa (plan §2.6) menüye dönülsün.

## B. Geriye uyumlu ekleme önerileri
1. `menu:show` için `dailyTiers: {yaygin:['tam','yakin',…], …}` ve `dailyScores: {yaygin:210, …}` alanları. Menüdeki "Bugünün rotası" kareleri şu an yalnız sayıyla doluyor; katman renkleri ve bacak puanı bu alanlarla gösterilir.
2. `question:show` için `yearKind` (ör. `ilk-genel-surum`) ve `asOf` alanları. Soru altındaki kapsam satırında "ilk genel sürüm yılı" gibi ölçütü yazmak için.
3. `answer:none` için kapalı/açık ayrımı zaten `question:show.closed`'dan okunuyor; ek alan gerekmez.
4. **Bildirimlerim için resmi yol.** Sözleşmede bildirim listesi/temizleme yok. Görsel katman şimdilik varsa `PUSULLA.store.readReports()` / `clearReports()` kullanıyor (yoksa yalnız `report:saved.count`). Öneri: `actions.listReports()` → `reports:show {list:[{d,q,t,k}]}` ve `actions.clearReports()` → `report:saved {count:0}`.
5. **Atıf metni alanı.** "Hakkında" ekranı atıf metnini sırayla `PUSULLA.meta.attribution`, `PUSULLA.data.meta.attribution`, `window.PUSULLA_META.attribution` alanlarında arıyor; bulamazsa plan §4.2 metnini gösteriyor. `_meta.js` yazılırken bu adlardan biri kullanılırsa doğrudan görünür.
6. **Günlük özet verisi.** `day:complete` yalnız `{score,max,streak,shareText}` veriyor; 4 bacak × 5 kare ve "bugünün en iyi cevapların" listesi görsel katmanda olaylardan (mode:start daily, result:show, round:end) toplanıyor. Öneri (ekleme): `day:complete` içine `legs:{yaygin:{score, tiers:[…]}, …}` ve `best:[{subject,answer,points,tierId}]`.
7. **İstatistik verisi.** `stats:show` şu an stub özeti (`best, streak, played, reports`) veriyor; görsel katman `store` biçimini de (`stats.playedDays, bestStreak, bestDayScore, modeTotals, modeCounts, tierCounts`) okuyabiliyor. Gerçek motorda `stats:show` bu `stats` nesnesini içerirse mod ortalamaları ve katman dağılımı da çizilir.

## C. Bilgi
- `index.html`'de GORSEL bloğu `<head>` içinde, motor betiklerinden önce. Görsel katman buna uyumlu: dosyalar yalnız `PUSULLA.ui` tanımlar, olaylara `mount` içinde abone olur. Sözleşmedeki "SES → GORSEL → ui_stub, game" sırasıyla da çalışır.
- `?mock` tüm olayları tek seferde art arda yayıp menüye dönüyor; görsel katman her olayı hatasız karşılıyor. Oynanabilir sahte akış için `?mock`'suz açılış (MOCK_QUESTIONS) kullanılıyor.
- Katman renkleri `config.js` paylaşım karelerine eşlendi: TAM 🟨 sarı, ÇOK YAKIN 🟩 yeşil, YAKIN 🟦 mavi, UZAK 🟧 turuncu, ZAYIF 🟥 kırmızı. Ek olarak `--tier-pas`, `--tier-sure`, `--mode-karma`, `--mode-rota` değişkenleri tanımlı.
- Çapraz uçlar (`klasik/gundem/antika/kesif`) menüde odaklanınca `actions.focusMode('karma')`, seçilince `actions.selectMode('karma')` çağrılıyor (tek KARMA mod kararı).
- Ses için (proje sahibi): cevap kutusuna yazarken `m` harfi de `keydown` üretir; `sound.js` `M` kısayolunu `e.target` bir `INPUT` iken yok saymalı.
