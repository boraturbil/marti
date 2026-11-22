# F4 İşçi H Raporu (Demo Rapor Üretici)

- Üretilen betik: `v3/tools/demo_report.js` (`node --check` hatasız, idempotent).
- Üretilen rapor: `v3/rev/DEMO_SORULAR.md` (1921 satır, 42 soru, UTF-8 BOM yok).
- Özet tablo: 42 soru, eksen dağılımı (T: 7, P: 27, B: 8), durum işaretleri (30 ✅, 12 ⚠️).
- Her soru için metin/konu/kategori/eksen, kapalı/açık meta, havuz/yıl/alias yüzdeleri, ilk 15 satır (`sl` azalan), `f&2`/`f&8`/toplam alias, share top-10 (AI tahmini), en eski/en yeni 3 satır (`~` approx), invalid grupları ve kapalı küme tutarlılığı eklendi.
- Sonda `SIZE.md` özeti (42 havuz, 26532 satır, 1404.31 KB ham, 475.12 KB gzip, bütçe 1843 KB) ve `MISSING.md` eksik listesi (`para_birimi`: beklenen 159, mevcut 158, fark -1) yer aldı.
