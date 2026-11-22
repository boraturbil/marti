# RAPOR_D_F4 — 42 Sorulu Demo + Pay + Kör Test

- `v3/data/q_demo.js`: 42 soru (`pools.json` sırasıyla, #35 `bm_genel_sekreter`), UMD, NFC, `node --check` tamam.
- `v3/data/share/<qid>.js`: 33 P/B sorusu için AI persona (`agy-persona-2026-11`, `estimated:true`) pay dosyası yazıldı; `q_demo.js` içine gömüldü.
- `v3/rev/blind/<qid>.txt`: 42 soru × 30 kör cevap (havuzlara bakmadan ayrı kör alt ajanla üretildi).
- `node D:\martı\v3\tools\check.js --demo`: **Havuz: 42, HATA: 0, UYARI: 11** (yıl kapsamı yetersiz 11 havuz P moduna düşüyor).
- `node D:\martı\v3\tools\blind_test.js`: 42 soru, 1260 cevap -> 819 geçerli, 143 bulanık, 0 geçersiz, 298 yok (%76.3 eşleşme).
- `node D:\martı\v3\tools\score_test.js`: 8/8 test geçti.
- Açık havuz eksikleri ve yıl kapsamı yetersiz 11 havuz `v3/rev/NOT_D_F4.md` içine kaydedildi.
