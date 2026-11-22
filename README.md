# MARTI — Türkçe Günlük Tahmin Oyunu Demosu

Masaüstü tarayıcıda çalışan, saf HTML/CSS/Vanilla JS ile geliştirilmiş piksel sanat görünümlü Türkçe tahmin oyunu demosu.

## Çalıştırma

1. **Doğrudan açma (`file://`):** `D:\martı\index.html` dosyasına çift tıklayarak tarayıcıda açabilirsiniz.
2. **Yerel sunucu ile:** Klasör içinde `npx serve .` çalıştırıp tarayıcıdan açabilirsiniz.

## Dosya Yapısı

- `index.html`: Masaüstü ortalanmış `360×640` dikey oyun kartı ve klasik `<script>` yükleme sırası.
- `style.css`: Piksel sanat tuval ölçekleme, CRT tarama çizgileri, eğik tabela kartı ve sonuç paneli stilleri.
- `data.js`: 4 soruluk Türkçe veri seti (`window.QUESTIONS`).
- `matcher.js`: Türkçe normalizasyon, aksansız anahtar, ek temizleme, Levenshtein toleranslı eşleştirme ve `runMatcherTests()`.
- `scene.js`: `180×320` tuvalde gün batımı İstanbul Boğazı, vapur, martı maskotu ve parallax kamera.
- `game.js`: Oyun durum makinesi, 30 sn süre sayacı, puanlama (`SCORING`) ve pano kopyalama.

## Yeni Soru Ekleme

`data.js` içindeki `QUESTIONS` dizisinin sonuna `{ id, text, answers, invalid }` şemasında yeni bir nesne eklemeniz yeterlidir.

## Test Komutu

`matcher.js` içindeki birim testlerini Node.js ile çalıştırmak için:

```bash
node -e "require('./data.js'); require('./matcher.js'); if (!globalThis.runMatcherTests()) process.exit(1);"
```
