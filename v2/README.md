# MARTI v2 — Türkçe Tahmin Oyunu

İstanbul Boğazı gün batımı temalı, tek oyunculu piksel sanat tahmin oyunu.
Saf HTML + CSS + vanilla JS ile yazılmıştır; harici kütüphane, web fontu, API veya medya dosyası yoktur.

## Çalıştırma

`index.html` dosyasını doğrudan tarayıcıda (`file://`) açmak yeterlidir.

## Modlar

- **ZİRVE ▲**: En çok verilen cevabı bul, martı Boğaz'dan gökyüzüne yükselsin (6 bölge).
- **DİP ▼**: En nadir ama geçerli cevabı bul, martı Boğaz'ın dibine dalsın (5 bölge).
- **ORTA KARAR ◆**: 4.–6. sıradaki ortadaki cevabı bul, martı vapur hattında kuzeye ilerlesin (6 durak).
- **SINIRSIZ ∞**: Havuzdan rastgele 7 soru; seri ve günlük istatistiği etkilemez.

Her tur 7 soru × 30 saniye (maksimum 700 puan) sürer. Günlük set tarih tabanlı deterministiktir; aynı gün üç mod birbirinden farklı 7'şer soru görür.

> **Not:** Sorulardaki cevap payları (%) tahmini değerlerdir.

## Dosya Yapısı

- `index.html`, `style.css` — Arayüz ve piksel panel stilleri
- `config.js` — `MARTI_CONFIG` (modlar, kademeler, süreler) ve `MARTI_DAILY` (günlük set)
- `data/q01_10.js`, `data/q11_20.js`, `data/q21_31.js`, `data/q32_42.js` — 42 soruluk havuz
- `matcher.js` — Türkçe normalizasyon, ek temizleme, yardımcı fiil/içerik anahtarı, token ve Levenshtein eşleştirme
- `font.js` — 5×10 bit eşlem piksel yazı tipi (`PixelFont`)
- `zones.js` — ZİRVE, DİP ve ORTA KARAR bölge tanımları ve paletleri
- `scene.js` — 384×216 piksel sanat Boğaz sahnesi, parallax kamera, martı sprite'ı ve `selfTest()`
- `sound.js` — WebAudio ile üretilen 8-bit ses efektleri
- `game.js` — Oyun akışı, durum makinesi, klavye kontrolü, depolama (`localStorage`)
- `tools/check.js` — Node veri, eşleştirme ve 30 günlük takvim doğrulama betiği
- `tools/shots.ps1` — Headless Edge ekran görüntüsü alma betiği

## Yeni Soru Ekleme

`data/q32_42.js` (veya yeni bir `data/*.js` dosyası) içine aşağıdaki şemada soru eklenebilir:

```js
{
  id: 'q43',
  cat: 'kategori',
  text: 'Soru metni',
  answers: [
    { label: 'Cevap Etiketi', share: 25.0, aliases: ['es anlam', 'varyant'] }
    // 15–20 grup, paya göre kesin azalan (ardışık fark >= 0.2), toplam 99.0–101.0,
    // en az 4 grup %0.1–1.0 aralığında
  ],
  invalid: [
    { aliases: ['yanlis ornek'], reason: 'Kısa açıklama.' } // 6–10 adet
  ],
  tests: [
    { in: 'Cevap Etiketi', expect: 'Cevap Etiketi' },
    { in: 'yanlis ornek', expect: 'invalid' }
  ] // en az 4 vaka
}
```

## Doğrulama ve Test

```powershell
node tools/check.js
```

Ekran görüntüleri için (Windows + Microsoft Edge):

```powershell
powershell -ExecutionPolicy Bypass -File tools/shots.ps1
```

## URL Parametreleri

- `?date=YYYY-MM-DD` — Günlük set tarihini geçersiz kılar
- `?shot=<mod>:<bölge>` / `?shot=menu|question|result:zirve:0|cine:zirve|end:zirve` — Ekran görüntüsü kontrol modu
- `?auto=zirve|dip|orta|sinirsiz` — Otomatik tur test botu
- `?reset=1` — Test depolama anahtarını (`marti.v2.test`) sıfırlar
- `?nostorage=1` — `localStorage` hatasını simüle eder
