# PUSULLA — Aşama 1: görsel yön taslakları

> **SEÇİM (2026-11-22): Yön A — Gece seyir aleti.** Aşama 2 bu yönle, `main`'e `v3/SOZLESME.md` + `v3/index.html` (`?mock`) gelince başlar.

Statik taslaklar (oyun kodu değil). Kaynak: `taslak/yon_a.html`, `taslak/yon_b.html` (`#menu` / `#soru`), ortak `taslak/rose.js` (pusula gülü SVG) ve `taslak/bg.js` (tek canvas doku). Görüntüler 1366×768, menüler ayrıca 1920×1080.

## Yön A — Gece seyir aleti
`01_A_menu.png`, `01_A_soru.png`, `01_A_menu_1920.png`
- Koyu kömür-lacivert zemin `#0e131b`, fildişi ince çizgi, pirinç vurgu; zeminde soluk topografik kontur ve enlem/boylam ağı.
- Gül çizgi işi (dolgusuz), renk yalnız iğnede ve halkadaki mod adlarında; dış derece halkası çok yavaş döner.
- Menü üç sütunlu: solda odaktaki modun anlatımı ve BAŞLA, ortada gül, sağda "seyir defteri" (rotanın 4 bacağı × 5 kare).
- Soru ekranında süre bir cetvel gibi (30 çentik, 5 sn'de bir uzun çentik); cevap alanı harita üstüne yazı gibi alt çizgili.

## Yön B — Atlas baskısı
`01_B_menu.png`, `01_B_soru.png`, `01_B_menu_1920.png`
- Açık kâğıt zemin `#f2ede2`, mürekkep lacivert, kiremit kırmızısı yön işaretleri; çift çizgili kenar çerçevesi; gazete bulmacası düzeni.
- Gül klasik gravür (siyah/beyaz yarımlar), mod renkleri kâğıtta okunur olsun diye koyulaştırıldı.
- Menü iki sütunlu: solda büyük PUSULLA başlığı, rota tablosu ve ROTAYA DEVAM; sağda gül ve altında odak açıklaması.
- Soru ekranı ortalanmış editoryal düzen: italik "Bir tane … söyle.", konu altı çizili, çerçeveli cevap kutusu.

## İki yönde ortak
- Mod renkleri: YAYGIN altın, NADİR mor, EN ESKİ bakır, EN YENİ camgöbeği; karmalar iki ana rengin karışımı.
- Derece katmanı rengi: TAM yeşil, ÇOK YAKIN sarı, YAKIN turuncu, UZAK kiremit, ZAYIF gri (A ve B'de tonları ayrı).
- Gül merkezinde Günün Rotası: 20 parçalı halka, her çeyrek kendi yönüne bakar.
- Çapraz uçlar (KLASİK/GÜNDEM/ANTİKA/KEŞİF) küçük çizilir ve tek KARMA moda açılır.
- Yazım hatasında "Şunu mu demek istedin?" satırı EVET (Enter) / HAYIR (Esc) ile gelir.
- Harici font yok: başlık ve rakamlar Georgia, arayüz Segoe UI, `tabular-nums`.
