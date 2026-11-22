# RAPOR_E_F4 — F4 İşçi E (Birleştirme, Üretim, Kontrol, Kör Test)

- **Güncellenen/oluşturulan dosyalar:** `tools/harvest/50_merge.js`, `60_emit.js`, `tools/blind_test.js`, `data/_meta.js`, `tools/harvest/out/raw_bm_genel_sekreter.json`, `data/pool/*.js` (34 havuz), `rev/BLIND_RAPOR.md`, `rev/NOT_E_F4.md`.
- **Çıktı özeti:** 34 havuz birleştirildi (`23484` satır, `1227.35 KB` ham, `416.17 KB` gzip — bütçe `1843 KB` içinde). `universite` demo dışı bırakılıp atlandı (`_meta.js` güncellendi). `film` bütçe/tavan nedeniyle `243` satır kırpıldı (`249.96 KB`). `8` açık havuz (`hayvan`, `meslek`, `spor_dali`, `turk_markasi`, `uzay_sondasi`, `gunes_uydu`, `sinan_yapisi`, `ist_muze`) D çıktısı bekliyor.
- **Doğrulama:** `node --check` tümü geçti; `check.js` -> `Havuz: 34, HATA: 0, UYARI: 0` (`q_demo.js` yokken); `match_test.js` -> `8/8`; `blind_test.js` -> `girdi yok`.

| Kapalı Havuz | Beklenen | Üretilen | Durum |
|---|---:|---:|---|
| `ist_ilce` | 39 | 39 | TAMAM |
| `tr_il` | 81 | 81 | TAMAM |
| `ulke` | 195 | 195 | TAMAM |
| `baskent` | 195 | 195 | TAMAM |
| `super_lig` | 18 | 18 | TAMAM |
| `para_birimi` | 159 | 158 | FARK (-1, bkz. `NOT_E_F4.md`) |
| `pixar` | 30 | 30 | TAMAM |
| `element` | 118 | 118 | TAMAM |
| `gezegen` | 13 | 13 | TAMAM |
| `osmanli_padisahi` | 36 | 36 | TAMAM |
| `cumhurbaskani` | 12 | 12 | TAMAM |
| `bm_genel_sekreter` | 9 | 9 | TAMAM |
| `dk_sampiyon` | 8 | 8 | TAMAM |
| `olimpiyat_sehri` | 23 | 23 | TAMAM |
