# NOT_D_F4 — Havuz / Manual / Check Notları

1. **Bekleyen 8 havuz (`data\pool\<id>.js` henüz yok):** `hayvan`, `meslek`, `spor_dali`, `turk_markasi`, `uzay_sondasi`, `gunes_uydu`, `sinan_yapisi`, `ist_muze`. `q_demo.js` içinde iskeletleri yazıldı (`share` listesi bekliyor).
2. **Yıl kapsamı yetersiz ama `pool.yearKind` yazılı 8 havuz (`check.js` `q.yearKind || pool.yearKind` nedeniyle hata veriyor):**
   - Kapalı: `ist_ilce` (29/39), `para_birimi` (8/158; ayrıca `expect:159` iken `rows:158`).
   - Açık (<%90): `tarayici` (%40.0), `isletim_sistemi` (%31.5), `oyun_konsolu` (%68.2), `prog_dili` (%53.5), `sosyal_medya` (%86.6), `turk_dizisi` (%43.6).
3. **Eksik yaygın adaylar (havuzda olmadığı için `share` top-40'a alınamadı):** `telefon_markasi` (Apple/Xiaomi/Huawei/Nokia yok, 58 satır), `sosyal_medya` (Instagram/WhatsApp/Discord yok), `oyun_konsolu` (PS4/PS5 yok), `dunya_sehri` (Paris/Berlin/Madrid/Viyana yok), `tatli` (Kazandibi/Katmer/Lokma/Revani yok), `corba` (Domates çorbası yok).
