# RAPOR_E_F4 — F4 İşçi E (Birleştirme, Üretim, Kontrol, Kör Test)

- **Güncellenen/oluşturulan dosyalar:** `tools/harvest/50_merge.js`, `60_emit.js`, `tools/check.js`, `tools/blind_test.js`, `data/_meta.js`, `tools/harvest/out/raw_bm_genel_sekreter.json`, `data/pool/*.js` (42 havuz), `rev/BLIND_RAPOR.md`, `rev/NOT_E_F4.md`.
- **Çıktı özeti:** 42/42 havuz birleştirildi ve üretildi (`26532` satır, `1404.31 KB` ham, `475.12 KB` gzip — bütçe `1843 KB` içinde). `universite` demo dışı bırakılıp atlandı. `film` (`243` satır) kırpıldı. Şüpheli alias `3` (`f|=8`, oyuna yazılmadı).
- **Doğrulama:** `node --check` tümü geçti; `match_test.js` -> `8/8`; `check.js --demo` -> `Havuz: 42, HATA: 8, UYARI: 8` (bkz. `NOT_E_F4.md`); `blind_test.js` -> `42 soru, 1260 cevap: gecerli 787, bulanik 144, gecersiz 0, yok 329` (`rev/BLIND_RAPOR.md`).

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
