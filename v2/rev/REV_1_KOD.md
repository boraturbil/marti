# REV_1_KOD — Kod/hata denetimi (öncelik sıralı)

`node tools/check.js`: GEÇTİ (matcher testleri 205/205, 42 soru, takvim ok). Mevcut testler aşağıdaki hataları yakalamıyor. Ek doğrulama betiği çalıştırıldı, kod DEĞİŞTİRİLMEDİ.

## 1. matcher.js:71-81 (normalizeTR) — Unicode NFC ve tipografik noktalama yok
Sorun: Girdiye `normalize('NFC')` uygulanmıyor; `’ ‘ “ ” … – —`, NBSP, sıfır genişlikli boşluk (​) temizlenmiyor. Doğrulandı: `ÇAY’`, `“çay”`, `çay…`, `çay​`, `çay` (ayrışık ç) → `none`. Mobil/Mac klavye ve otomatik düzeltme bunları üretir; 5 harften kısa anahtarda fuzzy kurtarmaz.
Yapılacak: `String(input).normalize('NFC')` ekle (toLocaleLowerCase'den önce). Noktalama regex'ine `‘’“”…–— ​-‍﻿` ekle.
Tamam: Yukarıdaki 5 girdi q01'de `valid:Çay` döner; bu vakalar tools/check.js'e test olarak eklenir, hepsi geçer.

## 2. matcher.js:515-585 (matchAnswer) — geçerli FUZZY, geçersiz TAM eşleşmeden önce geliyor
Sorun: Sıra valid(exact→stem→fuzzy) sonra invalid(exact→stem→fuzzy). Listede "geçersiz" işaretli kelime, geçerli cevaba 1 harf yakınsa puan alıyor. Doğrulandı (2 vaka): q34 `denizaltı` → Denizatı (fuzzy); q38 `karne almak` → Dilek listesi yazmak (fuzzy).
Yapılacak: Sırayı değiştir: valid exact/stem → invalid exact/stem → valid fuzzy → invalid fuzzy → content → token. `findNormalMatch`'i kademeye böl.
Tamam: Tüm sorularda her `invalid` label/alias için `matchAnswer` `invalid` döner (şu an 2 hata, hedef 0); bu döngü check.js'e kalıcı test olur.

## 3. game.js:1079-1091 (renderSummary) — kullanıcı girdisi escape edilmeden innerHTML
Sorun: `written = toUpperTR(r.raw)` doğrudan innerHTML'e yazılıyor (input maxlength 64) ve localStorage'a kaydedildiği için her açılışta yeniden basılıyor. `<b>` yazan özeti bozar, `<img onerror=...>` script çalıştırır. `r.label`, `r.tierLabel`, `r.tierColor` de escape'siz (localStorage kurcalama).
Yapılacak: `escapeHtml()` yardımcısı; `written`, `r.label`, `q.text`, `r.tierLabel` için kullan; `tierColor`'ı `/^#[0-9a-f]{3,8}$/i` ile doğrula. Aynı kontrol satır 757 (tierStrip) ve 900-910 (answersList) için.
Tamam: Cevap kutusuna `<img src=x onerror=alert(1)>` yazıp özete gidince alert yok, metin düz görünür.

## 4. game.js:938-976 + Esc işleyicileri (~1220-1245) — son soruda Esc/yenileme turu bitirmeden bırakıyor
Sorun: `finalizeRound()` yalnız `advanceFromResult` içinde çağrılıyor. Son soruyu cevaplayıp reveal/result'ta Esc ya da sayfa yenileme → kayıt `done:false`, `results.length == 7`. `startMode` `results.length < 7` şartı yüzünden bunu devam saymıyor ve tur SIFIRDAN başlıyor: günlük sorular cevapları görülmüş halde yeniden oynanıyor, seri/best yazılmıyor.
Yapılacak: `enterReveal` içinde son sorunun sonucu kaydedilince `finalizeRound()` çağır (özet yine sonra gösterilir); ek olarak `startMode`'da `results.length >= 7 && !done` ise finalize edip özeti aç.
Tamam: Son soruyu cevapla, result ekranında Esc, menüde mod "✓ skor" görünür ve tıklayınca özet açılır; yeniden oynanmaz, seri artar.

## 5. game.js:1186-1245 + 1160-1172 — Enter çift tetikleme, tuş tekrarı, IME
Sorun: (a) Menüde odaklı `.mode-card` butonuna Enter: document keydown `menuFocusIdx` modunu başlatır, ardından butonun click'i `card.dataset.mode`'u başlatır; ikisi farklıysa iki mod art arda başlar. `summaryNextBtn` için startMode iki kez çalışır. (b) `e.repeat` kontrolü yok: Enter basılı tutulursa submit→reveal→result→sonraki soru atlanır. (c) `e.isComposing` yok: mobil/IME'de kompozisyon onay Enter'ı yarım yazıyı gönderir.
Yapılacak: Keydown başında `if (e.repeat || e.isComposing) return;`. Hedef `button` ise Enter'ı kendi click'ine bırak (menü/özet Enter kısayolu yalnız odak buton dışındayken).
Tamam: Menüde Tab ile 2. karta git, Enter → yalnız o mod 1 kez başlar; Enter basılı tutulunca en fazla 1 aşama ilerler.

## 6. game.js:60-69 (getTodayKey) + init — gün sınırı ve ?date= / ?reset= suistimali
Sorun: `dayKey/dailySet` yalnız init'te hesaplanıyor; sayfa gece yarısını aşarsa eski gün oynanır, seri bozulur. `?date=2099-01-01` ve `?reset=1` herkese açık: seri/best şişirilebilir, paylaşım metnine yansır. Epoch öncesi tarihte `dayNumber` 0/negatif.
Yapılacak: `visibilitychange` ve `renderMenu()` içinde `getTodayKey()` değiştiyse `dailySet`'i yeniden üret. `date/reset/auto/shot` parametrelerini yalnız `localhost`/`file:` ya da `?debug=1`'de kabul et; `dayNumber` için `Math.max(1, ...)`.
Tamam: Cihaz saati 23:59→00:01 yapılıp menüye dönülünce yeni gün numarası görünür; canlı sitede `?date=` etkisiz.

## 7. game.js:549-622 (zamanlayıcı) — Esc kutusu, sekme arka planı, yenileme
Sorun: (a) Esc onay kutusu açıkken süre akar; süre dolunca onay açıkken reveal'a geçilir. (b) Sekme arka plana alınınca rAF durur ama `performance.now()` deadline'ı akar: dönüşte ilk karede süre dolmuş sayılıp soru PAS olur. (c) Sayfa yenilemede aktif sorunun süresi 30 sn'ye sıfırlanır.
Yapılacak: `visibilitychange`'de gizli kalınan ms kadar `state.deadline`'ı uzat (veya duraklat); Esc onayı açılınca kalan süreyi dondur, kapanınca devam et. (c) kabul edilebilir ise notla bırak; değilse `persistPartialRound`'a `qStartedAt` yaz.
Tamam: Soru sırasında sekme 20 sn gizlenip dönülünce soru PAS olmaz; Esc kutusu açıkken sayaç durur.

## 8. sound.js:7-33 + game.js:251-268 — WebAudio autoplay/durum yönetimi
Sorun: (a) `ensureContext` yalnız `suspended`'ı resume ediyor; iOS Safari `interrupted` durumunda ses bir daha gelmez. (b) `resume()` Promise'i yakalanmıyor: reddedilirse `unhandledrejection` → debug kutusunda HATA sayısı artar (game.js:97). (c) `setEnabled(false)` çalan tonları kesmez (kısa, düşük etki). (d) Sekme gizlenince context askıya alınmıyor.
Yapılacak: `if (ctx.state !== 'running') { var p = ctx.resume(); if (p && p.catch) p.catch(function(){}); }`; `visibilitychange` ile hidden'da `ctx.suspend()`, görünürde resume.
Tamam: iOS/Android'de arama veya sekme dönüşünden sonra sesler çalışır; konsolda `unhandledrejection` yok.

## 9. game.js:116-178 (loadStore/saveStore) — doğrulama ve localStorage yokluğu
Sorun: localStorage yoksa/kapalıysa (gizli mod, SecurityError) oyun sessizce çalışır: günlük tamamlandı kaydı yenilemede kaybolur, aynı gün tekrar oynanır, seri sıfırlanır; kullanıcıya bildirim yok. `parsed.days` içindeki kayıtlar (`results`, `score`) tip doğrulaması olmadan kullanılıyor; elle bozulmuş JSON `renderMenu`/`renderSummary`'de hata verip menüyü kırabilir.
Yapılacak: İlk `setItem` başarısızsa `store.persistent=false` ve menüde "İlerleme kaydedilemiyor" notu. `loadStore`'da her gün/mod kaydı için `Array.isArray(results)`, `typeof score==='number'` doğrula, bozuğu at.
Tamam: `?nostorage=1` ile uyarı görünür; localStorage'a `{"days":{"2026-11-22":{"zirve":{"done":true}}}}` yazılınca menü hatasız açılır.

## 10. game.js:1028-1058 (copyShareText) + renderMenu/clearTimers — küçük dayanıklılık
Sorun: (a) `fallbackCopy` başarısız olsa da "KOPYALANDI ✓" yazılır (execCommand false dönebilir). (b) `renderMenu` `clearTimers()` çağırmıyor: result/summary fazından menüye dönüşte bekleyen `scoreAnimRaf` veya timer eski ekranı günceller. (c) `cacheDom` eksik id'leri doğrulamıyor; index.html'de bir id değişirse init sessizce çöker.
Yapılacak: `fallbackCopy` boolean döndürsün, başarısızsa "Kopyalanamadı" göster. `renderMenu` başında `clearTimers()`. `cacheDom` sonunda null elemanları `console.error` ile listele.
Tamam: Menüye dönünce `state.revealTimer/introTimer/timerRaf/scoreAnimRaf` null; clipboard engelliyken yanlış "KOPYALANDI" görünmez.

---
Not (sorun değil, doğrulandı): `toLocaleLowerCase('tr-TR')` ile İ/ı doğru (SİMİT, ŞİMİT, CAY); `toAsciiKey` eşlemesi doğru; fuzzy beraberlikte ilk havuz kazanıyor (deterministik). zones.js ve config.js'de mantık hatası bulunmadı (config.js getDailySet 42 soruda gün başına 21 farklı soru, deterministik).
