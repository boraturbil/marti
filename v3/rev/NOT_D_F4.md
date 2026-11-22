# NOT_D_F4 — Havuz / Manual / Check Notları

1. **Yıl kapsamı yetersiz ama `pool.yearKind` yazılı 11 havuz (`check.js` `q.yearKind || pool.yearKind` nedeniyle hata veriyor):**
   - Kapalı: `ist_ilce` (29/39), `para_birimi` (8/158; ayrıca `expect:159` iken `rows:158`).
   - Açık (<%90): `tarayici` (%40.0), `isletim_sistemi` (%31.5), `oyun_konsolu` (%68.2), `prog_dili` (%53.5), `sosyal_medya` (%86.6), `turk_dizisi` (%43.6), `uzay_sondasi` (%77.0), `sinan_yapisi` (%65.1), `ist_muze` (%33.3).
2. **Eksik/gürültülü yaygın adaylar (`share` top-40 dışı kalanlar):**
   - `hayvan` havuzunda bitki taksonları (Mısır, patates, Kedi nanesi vb.) karışmış, `kedi`/`köpek` tekil maddeleri eksik.
   - `telefon_markasi` (Apple/Xiaomi/Huawei/Nokia yok, 58 satır), `sosyal_medya` (Instagram/WhatsApp/Discord yok), `oyun_konsolu` (PS4/PS5 yok), `dunya_sehri` (Paris/Berlin/Madrid/Viyana yok), `tatli` (Kazandibi/Katmer/Lokma/Revani yok), `corba` (Domates çorbası yok).
