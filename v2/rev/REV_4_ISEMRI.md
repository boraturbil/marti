# REV 4 — İŞ EMRİ UYUM DENETİMİ (IS_EMRI_V2.md ↔ kod)

Tarih: 2026-11-22 · Kod değiştirilmedi. Bakılan: game.js, index.html, zones.js, sound.js (+ scene.js/style.css ilgili satırlar).

**Uygulananlar (tamam):** §1 script sırası + data.js arşiv başlığı · §2 sözleşme (Scene/Sound/Matcher API) · §3 config kademeleri, evalTier, formatPct, sonuç cümleleri (tüm mod/durumlar) · §4 günlük set (FNV-1a+mulberry32, k=n/21, mod tohumu), `?date=`, SINIRSIZ (Math.random, yalnız unlimitedRounds++) · §5.3/5.4 ZONES tabloları (ad, eşik, cam/camX, meters/km, 6 bant renk, yıldız/ışın) birebir · §5.6 banner konumu/ölçek/renk/alt çizgi/flaş, `zone`/`dive` sesi · §6.16 shot modu + `__ERRORS` + HATA/SELFTEST kutusu · §7 durum makinesi, boş Enter sallanma, invalid/none krem şerit + select + `wrong` + GEÇ, GEÇ 10 sn/Ctrl+Enter, son 5 sn kehribar+tick, kademe şeridi, 2000/2600 ms reveal, Enter ile atlama, MÜKEMMEL harf zıplatma + altın parıltı, ZAYIF sallanma, SÜRE DOLDU, buton metinleri, ZİRVE/DİP/ORTA liste kuralları + DİP kısa etiketleri · §8.2 tabela/rozet/ses düğmesi/dock (maxlength 64, placeholder) · §8.3 logo (gradyan, martı 4 sn), mod kartları OYNA/DEVAM ET/✓ + tamamlanınca özet, SINIRSIZ mod seçici, istatistik şeridi, 1/2/3/4/oklar/Enter/M · §8.4 sinematik içerik + `finish`, özet başlıkları, seri kutusu, 7 satır, BUGÜNKÜ MODLAR, SIRADAKİ/YARIN + SINIRSIZ OYNA, paylaş metni (günlük + sınırsız) + clipboard/execCommand yedeği · §9 şema, test anahtarı, try/catch, `?nostorage=1`, seri/playedDays/bestStreak, yarım tur, 60 gün temizliği · §11 tüm 10 ses tarifi, ana kazanç 0.15, setEnabled + depolama · Kabul #1 (node --check temiz), #2–#4 (check.js: 42 soru, 205/205 test, TAKVİM ok), #12 (fetch/import/http yok), #13 (yasak adlar yok). **Toplam ≈ 70 madde uygulanmış.**

---

## Eksik / yanlış uygulananlar (öncelik sırasıyla)

### 1. Bölge adı kameradan okunuyor, puandan değil → rozet parlaması çalışmıyor, sinematik/paylaş adı banner'la çelişebilir
- **İş emri:** §5.6 (bölge puanla tetiklenir), §8.2 (rozet bölge değişiminde 0.4 sn parlayıp güncellenir), §8.4 (sinematik bölge adı, paylaşta bölge).
- **Yer:** scene.js:2459-2476 (`getZoneInfo` → `getZoneBlend` kamera tabanlı, scene.js:1050-1059 `idx = t>=0.5 ? i+1 : i`); game.js:1457-1459 (`onZoneEnter` → `updateZoneBadge(true)`), game.js:451-469, 777, 940-945, 981-987.
- **Ne eksik:** `onZoneEnter` anında kamera henüz hareket etmediği için `getZoneInfo().name` ESKİ bölgeyi döndürür; `info.name !== lastZoneLabel` sağlanmaz → rozet ne güncellenir ne parlar (yalnız sonraki soruda sessizce güncellenir). Ayrıca kamera ara noktada %50'yi geçince ad bir sonraki bölgeye atlar (ör. ZİRVE 130 puan → cam ≈ 115 → "ÇAMLICA", oysa eşik 160); `finalizeRound` zoneName'i, sinematik ve paylaş metni banner'ı hiç görülmemiş bir bölgeyi yazabilir. `?auto` modunda (250 ms reveal) kamera hiç varmadan okunur.
- **Yapılacak:** `getZoneInfo()` içinde `name/index` = puan tabanlı son `setScore` bölgesi (`maxZoneIndex` veya saklanan `scoreZoneIndex`); yalnız `label` kamera ile enterpole edilsin. `updateZoneBadge(true)` callback'teki `{name,label}`'i doğrudan kullansın.
- **Tamam ölçütü:** ZİRVE'de 60 puana çıkan cevapta rozet AYNI reveal içinde `▲ GALATA HİZASI` olur ve `glow` sınıfı eklenir; 130 puanla biten turda sinematik + paylaş `GALATA HİZASI` yazar.

### 2. Son soru kaydedilip tur bitirilmeden kapanırsa "DEVAM ET 7/7" ama tur baştan başlar
- **İş emri:** §9 yarım tur, §8.3 kart durumu.
- **Yer:** game.js:748 (`persistPartialRound` reveal'da 7. sonucu `done:false` yazar), game.js:345-346 (menü `DEVAM ET 7/7`), game.js:437 (`results.length < 7` şartı → sonuçlar atılır, q1'den başlar).
- **Yapılacak:** `startMode`'da `saved.results.length >= QUESTIONS_PER_ROUND && !done` ise `finalizeRound()` + `renderCinematic()` (ya da doğrudan özet); menüde bu durumda `DEVAM ET` yerine bitir davranışı.
- **Tamam ölçütü:** 7. sonuç ekranında sayfa yenilenip karta tıklanınca tur bitmiş sayılır, skor/seri yazılır, q1'e dönülmez.

### 3. `setScore(..., {instant:true})` geri yüklemede banner + bölge sesi + rozet callback'i tetikliyor
- **İş emri:** §9 (yarım tur geri yükleme `setScore(toplam,{instant:true})`), §5.6 (banner yalnız bölgeye ilk girişte).
- **Yer:** scene.js:2404-2417 (instant ayrımı yok; `setMode` maxZoneIndex'i 0'a çeker), game.js:415 (bitmiş mod özeti açılırken), game.js:446 (DEVAM ET).
- **Yapılacak:** `opts.instant` ise `maxZoneIndex = zoneIndex` sessizce ata; banner/flaş/ses/callback yok.
- **Tamam ölçütü:** 300 puanlık yarım ZİRVE turuna DEVAM ET'te "BULUT DENİZİ" banner'ı ve `zone` sesi çıkmaz; rozet doğru bölgeyi gösterir.

### 4. Banner sönüşü Bayer dithering değil alpha; alt çizgi ve rozet satırı 1.9 sn'de aniden kayboluyor
- **İş emri:** §5.6 ("1.9–2.3 sn ditherlı sön, Bayer eşiğini 0→1 artır").
- **Yer:** scene.js:2143-2151 (`globalAlpha` ile solma; `sub` ve alt çizgi bu dalda hiç çizilmez).
- **Yapılacak:** Banner'ı offscreen'e çiz, 1.9–2.3 sn'de `BAYER4[y%4][x%4]/16 < fade` olan pikselleri sil; alt çizgi + rozet satırı da aynı maskeyle sönsün.
- **Tamam ölçütü:** 2.1 sn karesinde banner piksel deseniyle yarı silinmiş görünür (yarı saydam değil); alt çizgi ve `+60 m` satırı da sönüş boyunca görünür.

### 5. Sinematikte tabela ve dock 0.4 sn'de kaybolmuyor (anında yok oluyor)
- **İş emri:** §8.4 ("tabela ve dock 0.4 sn'de kaybolur").
- **Yer:** game.js:241-249 (`setPhase` → `.screen` display toggle), style.css:160-169 (`.screen{display:none}`, geçiş yok).
- **Yapılacak:** `renderCinematic` önce `#question`'a `fading` sınıfı (opacity 1→0, 0.4 s) eklesin, 400 ms sonra fazı değiştirsin (ya da sinematik açıkken soru ekranı fade-out ile kalsın).
- **Tamam ölçütü:** son sonuçtan sonra tabela/dock 0.4 sn boyunca solarak kaybolur, sonra bölge adı görünür.

### 6. Büyük harf kuralı eksik: cevap etiketleri ve özet soru metni küçük harfli
- **İş emri:** §8.1 (UI büyük harf, `toLocaleUpperCase('tr-TR')` ile, text-transform yok), §7.4 liste satırı `{sıra}. {LABEL}`.
- **Yer:** game.js:910 (`item.answer.label`), game.js:1084 (`→ r.label`), game.js:1088 (`q.text`).
- **Yapılacak:** üçünü `toUpperTR()` ile sar.
- **Tamam ölçütü:** sonuç listesinde `1. ÇAY (sen)`, özette `1. KAHVALTIDA…` / `→ İNECEK VAR` görünür; Türkçe İ/I doğru.

### 7. Kullanıcı girdisi kaçışsız `innerHTML`'e yazılıyor
- **İş emri:** §8.4 özet satırı `SEN: {yazdığın}` (doğru görüntülenmeli); genel sağlamlık (§15 #6 HATA: 0).
- **Yer:** game.js:1081-1089 (`written = toUpperTR(r.raw)` → innerHTML), ayrıca 1084, 910 etiketler.
- **Yapılacak:** `escapeHtml()` ekle (`& < > " '`), raw ve etiketlere uygula.
- **Tamam ölçütü:** cevap olarak `<b>x` yazılıp tur bitince özette metin aynen `SEN: <B>X` görünür, düzen bozulmaz.

### 8. DİP sonuç listesi: ölü kod + oyuncu ilk 2'deyken 4 satır
- **İş emri:** §7.4 DİP ("en çok verilen 2 + en nadir 2 (oyuncunun dışında) + oyuncu").
- **Yer:** game.js:801-816 (`picked`/`addUnique` hesaplanıp kullanılmıyor), game.js:818-829.
- **Yapılacak:** ölü bloğu sil; oyuncu ilk 2'deyse 3. en çok verileni ekleyerek 5 satıra tamamla (ya da kural böyle kabul edilecekse yorumla belgele).
- **Tamam ölçütü:** DİP'te 1. cevap verildiğinde liste 5 satır, paya göre azalan, oyuncu satırı kalın + `(sen)`.

### 9. Özette klavyeyle SINIRSIZ OYNA'ya Enter ile ulaşılamıyor
- **İş emri:** §8.4 (hepsi bittiyse `YARIN YENİ SORULAR` pasif + `SINIRSIZ OYNA`), §15 #14 (fare olmadan menü → tur → özet → menü).
- **Yer:** game.js:1276-1285 (Enter yalnız `summaryNextBtn` aktifken; aksi hâlde hiçbir şey).
- **Yapılacak:** `summaryNextBtn.disabled` ise Enter → `startMode('sinirsiz')`; ayrıca özet açılınca odak ilk aktif butona verilsin.
- **Tamam ölçütü:** üç mod bitmişken özette Enter SINIRSIZ turunu başlatır; ESC menüye döner.
