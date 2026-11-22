# Görev: "Martı" — Türkçe günlük tahmin oyunu (KÜÇÜK tarayıcı demosu, yalnız PC)

KULLANICI NOTU: Şimdilik mobil değil, PC tarayıcı için. Küçücük bir demo. Mobil uyumluluk ve 390px kontrolü GEREKMEZ.
Masaüstü: sahne canvas'ı ortada dikey bir "telefon kartı" gibi (ör. 360x640 CSS px, 180x320 canvas ×2) dursun, UI onun üstünde/altında.

Tarayıcıda çalışan, Türkçe, piksel sanat görünümlü küçük bir tahmin oyunu demosu.
Amaç: verilen soruya "çoğu insanın vereceği cevabı" tahmin etmek. Puan, cevabın yaygınlığına göre.

## Teknik kısıtlar
- Saf HTML + CSS + vanilla JS. Framework/build/harici kütüphane YOK. LLM/API çağrısı YOK.
- Dosyalar (D:\martı içinde): index.html, style.css, game.js (akış/UI), scene.js (canvas piksel sanat + animasyon),
  matcher.js (normalize + eşleştirme), data.js (`window.QUESTIONS = [...]`, file:// ile çift tıklayınca açılsın), README.md.
- Script'ler klasik <script> (module DEĞİL) ki file:// çalışsın. `npx serve .` ile de çalışmalı.

## Oyun akışı
1. Ana ekran: "MARTI" başlığı, "Herkesin vereceği cevabı bul", "BAŞLA" butonu.
2. Soru ekranı: üstte hafif eğik koyu tabela kartı: ilerleme kutucukları (soru başına kare), toplam puan,
   "SORU 1/4", soru metni, altında sarı küçük "Herkesin vereceği cevabı ver."
   Kartın altında 30 sn süre çubuğu (azalır). Altta cevap kutusu ("Cevabın…") + "GÖNDER" + küçük "GEÇ". Enter gönderir.
3. Kontrol: Geçersiz (invalid listesinde veya hiçbir şeye uymuyor) → kutunun üstünde kırmızı kısa mesaj, süre devam,
   tekrar denenir. invalid'de reason varsa onu göster, yoksa "Bu cevabı tanıyamadım, başka bir şey dene."
   Geçerli → sonuç paneli. Süre biter/GEÇ → 0 puan, sonuç paneli (cevapsız).
4. Sonuç paneli (alttan kayar): kademe renkli başlık şeridi: ikon + kademe adı + "+X puan".
   Cümle: "Bu 2 numaralı cevap." ya da "Az verilmiş (%0,5): biraz daha yukarı."
   "DİĞER CEVAPLAR": ilk 5 cevap, yatay yüzde çubuğu, "%40,3" (virgüllü). Oyuncunun cevabı kalın + "(sen)";
   ilk 5'te değilse sona ekle. "SONRAKİ SORU" butonu.
5. Bitiş: toplam / 400, kademe kutucukları, "Sonucu kopyala" (panoya ör. "Martı #1 🟨🟩⬜🟥 230/400").

## Puanlama (tek config nesnesi, ör. SCORING)
- 1. cevap → 100 "MÜKEMMEL" (altın 🟨)
- 2. → 70, 3. → 50 "ÇOK İYİ" (yeşil 🟩)
- pay ≥ %5 diğerleri → 30 "İDARE EDER" (açık yeşil 🟢 veya 🟩)
- pay < %5 geçerli → 10 "ZAYIF" (kırmızı 🟥)
- cevapsız → 0 "PAS" (gri ⬜)

## Sahne (scene.js) — ÖNEMLİ
- Tüm görseller kodla, düşük çözünürlüklü canvas (180x320), CSS `image-rendering: pixelated` ile büyüt. Hafif CRT tarama çizgisi.
- Tema: gün batımında İstanbul Boğazı (sıcak hava balonu, tavşan, deniz feneri YOK; başka oyun taklidi yok).
  - Bantlı/dithered turuncu-pembe-mor gökyüzü, piksel güneş, yavaş kayan bulutlar.
  - Ufukta silüet: cami kubbeleri + minareler, Galata benzeri kule, köprü silüeti.
  - Ön planda animasyonlu dalgalı su (birkaç ton + parıltı pikselleri), arada geçen küçük vapur.
  - Maskot: piksel martı, ortada süzülüp kanat çırpar.
- Puan → martı yükselir, kamera yumuşakça yukarı kayar (parallax). Yüksek puanda bulutlar arası, sonda yıldızlı gece.
  0 puanda martı biraz alçalır.
- MÜKEMMEL: martı etrafında parıltı pikselleri; ZAYIF: martı kısa sallanır.
- requestAnimationFrame; modüler fonksiyonlar: drawSky, drawSkyline, drawWater, drawGull, drawClouds, drawStars...
- Dışa açık küçük API: window.Scene = { init(canvas), setAltitude(score), effect('perfect'|'weak'|'pass') }.

## Matcher (matcher.js)
- toLocaleLowerCase('tr-TR'), trim, noktalama temizle, çoklu boşluk teke.
- Aksansız anahtar (ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u, â→a, î→i, û→u).
- Ek temizleme: önce tam eşleşme, olmazsa sondaki ekleri atarak dene ("lar/ler", "yı/yi/yu/yü", "sı/si/su/sü", "ı/i/u/ü").
- Her grup "aliases"; label da alias sayılır.
- Levenshtein toleransı (aksansız anahtarda): uzunluk ≤4 → 0, 5-8 → 1, 9+ → 2.
- Sıra: geçerli gruplar → invalid → bulunamadı. Dönüş ör. {type:'valid', index, answer} | {type:'invalid', reason} | {type:'none'}.
- `runMatcherTests()` global fonksiyonu: her soru için doğru, yazım hatalı, aksansız ve geçersiz örnekler; console.table/log ile
  sonuç, hepsi geçerse true döner. Node'da da çalışabilsin (window yoksa globalThis).

## Veri (data.js) — 4 soru, Türkiye'ye özgü, gerçekçi tahmini yüzdeler
Format: { id, text, answers:[{label, share, aliases:[...]}...] (12-20 grup, toplam ~100, uzun kuyruk %0,3 gibi),
invalid:[{aliases:[...], reason:"..."}] (6-10 tane, soruya özel açıklama) }
1. "Kahvaltıda olmazsa olmaz bir şey söyle" (çay: "cay","demli çay","çay içmek"...; peynir, zeytin, yumurta, simit, menemen, sucuk, bal-kaymak, domates...)
2. "Bayramda büyüklerin söylediği bir söz söyle" ("maşallah çok büyümüşsün", "okul nasıl gidiyor", "ne zaman evleniyorsun", "Allah razı olsun", "bayramın mübarek olsun"...)
3. "Vapurda yapılan bir şey söyle" ("simit atmak": "martıya simit atmak","martılara simit"...; çay içmek, manzara izlemek, fotoğraf çekmek, simit yemek...)
4. "Bir Türk dizisi söyle" (Muhteşem Yüzyıl, Kurtlar Vadisi, Yaprak Dökümü, Aşk-ı Memnu, Ezel, Leyla ile Mecnun, Avrupa Yakası, Behzat Ç, Diriliş Ertuğrul, Çukur, Kızılcık Şerbeti...)
Alias listeleri zengin olsun (eş anlam, kısaltma, yazım varyantı).

## Kalite
- Tüm UI metni Türkçe. Yazı tipi: sistem monospace + büyük harf + harf aralığı (web font yok).
- Klavyeyle tamamen oynanabilir (Enter: gönder / sonraki soru; odak otomatik cevap kutusunda).
- Kod yorumlu, yeni soru = data.js'e nesne eklemek.

## Kendi kontrolün (teslimden önce ZORUNLU)
- `node -e` ile data.js + matcher.js'i yükleyip runMatcherTests() çalıştır, hepsi geçsin.
- Tüm JS dosyalarını `node --check` ile sözdizimi kontrolünden geçir.
- Share toplamlarının ~100 olduğunu doğrula.
- Sonunda kısa rapor: oluşan dosyalar, test sonucu, bilinen eksikler.
