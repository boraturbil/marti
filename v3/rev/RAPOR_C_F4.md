# RAPOR_C_F4 — F4 İşçi C (Manuel Düzeltme ve Halk Havuzları)

Üretici betik: `tools/harvest/f4_manual_gen.js` (`--offline` destekli, `lib/http.js` önbellekli).
Çıktılar: `data/manual/*.js` (16 dosya; `universite.js` dokunulmadı).

| Havuz | Önceki Satır | Hedef | Birleşen Satır | Durum | Belirsizlikler |
|---|---:|---:|---:|---|---|
| `ist_ilce` | 36 | 39 | 39 | TAMAM | 4 eksik ilçe (Çekmeköy, Eyüpsultan, Gaziosmanpaşa, Şile) + parantezsiz etiketler; yıl null bırakıldı |
| `tr_il` | 81 | 81 | 81 | TAMAM | Yok (74 il yılı null) |
| `ulke` | 196 | 195 | 195 | TAMAM | Kosova zaten yoktu; `Tayvan` çıkarıldı (BM 193 + Vatikan, Filistin) |
| `baskent` | 207 | 195 | 195 | TAMAM | Çok başkentlilerde 1 ana başkent seçildi; `St. John's` (Q36262) eklendi; 54 yıl null |
| `super_lig` | 458 | 18 | 18 | TAMAM | 2025-26 Süper Lig 18 takım tutuldu, FK/SK sonekleri doğal Türkçe yazıma alındı |
| `element` | 122 | 118 | 118 | TAMAM | 4 varsayımsal >118 element çıkarıldı; 8 antik/eksik yıl `approx` dolduruldu |
| `gezegen` | 0 | 13 | 13 | TAMAM | 8 gezegen + 5 cüce gezegen elle eklendi; antik gezegenler `-3000 approx` |
| `osmanli_padisahi` | 45 | 36 | 36 | TAMAM | 9 şehzade/Fetret/hanedan reisi çıkarıldı; çakışan `Divan Edebiyatı Müzesi` aliası temizlendi |
| `cumhurbaskani` | 15 | 12 | 12 | TAMAM | 3 cumhurbaşkanı vekili çıkarıldı |
| `pixar` | 43 | 30 | 30 | TAMAM | 14 kısa/gelecek/yapım-dışı (ve Toy Story 5) çıkarıldı; `Cesur` (2012) eklendi |
| `dk_sampiyon` | 0 | 8 | 8 | TAMAM | 8 FIFA Dünya Kupası şampiyonu elle eklendi |
| `para_birimi` | 251 | 158 | 158 | TAMAM | Vikiveri `P498` var + `P576` yok filtresiyle 92 tarihi/geçersiz birim çıkarıldı |
| `universite` | 232 | ~208 | 230 | BELİRSİZ | YÖK kesin sayısı doğrulanamadığı için `manual` yazılmadı (bkz. `NOT_C_F4.md`) |
| `olimpiyat_sehri` | 29 | 23 | 23 | TAMAM | 6 stadyum + Brisbane 2032 çıkarıldı; `Münih` (1972) eklendi; ilk ev sahipliği yılları düzeltildi |
| `tarayici` | 217 | açık | 215 | TAMAM | Chrome/IE/Edge/Firefox aliasları, `Opera GX` (2019) ve `WorldWideWeb` (1990) eklendi |
| `kahvaltilik` | 0 | 60+ | 65 (manual) | HAZIR | `data/manual/kahvaltilik.js` (65 öğe; `raw_kahvaltilik.json` yok, bkz. `NOT_C_F4.md`) |
| `icat` | 0 | 120 | 120 (manual) | HAZIR | `data/manual/icat.js` (120 öğe, `MOD_ESKI_ICAT_TASARIM.md` + genel; bkz. `NOT_C_F4.md`) |
