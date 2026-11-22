# NOT_E_F4 — F4 İşçi E Farklar ve Notlar

1. **`para_birimi` (158 vs 159):** `data/manual/para_birimi.js` içindeki `expectNote` `159` belirtmektedir; `50_merge.js` QID/ad tekilleştirmesi sonrası `158` tekil satır üretmektedir (`RAPOR_C_F4.md` ve `NOT_C_F4.md` ile uyumlu).
2. **Gelecek yıllar (ASOF `2026-11` sonrası):** `turk_dizisi` (`2027`) ve `video_oyunu` (`2027` × 2) satırları `50_merge.js` tarafından `null` yapılarak `YEAR_CONFLICTS.md` dosyasına işlendi.
3. **`check.js --demo` bulguları (8 HATA, 8 UYARI):**
   - `hayvan_01`: `gecerli eksen yok` (`q_demo.js`'de `share` yok) ve `invalid alias "Meşe" havuz satiri ile cakisiyor` (ham `raw_hayvan.json` içinde `"Meşe"` etiketi var).
   - `uzay_sondasi_01` (`77.0%` yıl), `sinan_yapisi_01` (`65.1%` yıl), `ist_muze_01` (`33.3%` yıl): açık küme yıl kapsamı `< %90` ve `q_demo.js`'de `share` olmadığı için `axis=null` (HATA).
   - `ist_ilce_01`, `para_birimi_01`, `tarayici_01`, `isletim_sistemi_01`, `oyun_konsolu_01`, `prog_dili_01`, `sosyal_medya_01`, `turk_dizisi_01`: yıl kapsamı eşiği altında kaldığından `engine.axesOf` ile uyumlu olarak `P` moduna düşüyor (UYARI).
4. **Kör cevap testi (`rev/BLIND_RAPOR.md`):** 42 soru, 1260 cevap → `787` geçerli, `144` bulanık (onay), `0` geçersiz, `329` havuzda yok.
