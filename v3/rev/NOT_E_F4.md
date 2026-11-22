# NOT_E_F4 — F4 İşçi E Farklar ve Notlar

1. **`para_birimi` (158 vs 159):** `data/manual/para_birimi.js` içindeki `expectNote` `159` belirtmektedir; `50_merge.js` QID/ad tekilleştirmesi sonrası `158` tekil satır üretmektedir (`RAPOR_C_F4.md` ve `NOT_C_F4.md` ile uyumlu). Sayı uydurulmadı, fark burada kayda geçirildi.
2. **Gelecek yıllar (ASOF `2026-11` sonrası):** `turk_dizisi` (Arka Sokaklar Çocuklar: 2027) ve `video_oyunu` (Kingdom Hearts IV: 2027, Persona 4 Revival: 2027) satırlarındaki `2027` yılları `50_merge.js` tarafından `null` yapılarak `YEAR_CONFLICTS.md` dosyasına işlendi (`check.js` yıl sınırı `-5000..2026` ile uyumlu).
3. **Bekleyen D havuzları (8 açık havuz):** `hayvan`, `meslek`, `spor_dali`, `turk_markasi`, `uzay_sondasi`, `gunes_uydu`, `sinan_yapisi`, `ist_muze` için `tools/harvest/out/raw_<id>.json` henüz oluşmadığından `SIZE.md` ve `MISSING.md` içinde `bekliyor` olarak işaretlendi.
4. **Soru ve kör test dosyaları:** `data/q_demo.js` ve `rev/blind/*.txt` henüz mevcut olmadığı için `check.js` yalnız havuzları denetledi, `blind_test.js` `girdi yok` çıktısı verdi.
