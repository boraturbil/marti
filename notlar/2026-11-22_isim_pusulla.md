# 2026-11-22 — Oyunun adı: Martı → Pusulla

## Karar
- Oyunun adı **Pusulla** (çift L bilerek; "pusula" kelimesinin oyun adı hâli). Repo adı da `pusulla` olacak.
- Yeni konsept pusula üzerine kurulacak. Bu adımda **yalnız isim** değişti; konsept ayrı tasarlanacak.

## Kapsam kuralı
- Oyunun **adı** geçen her yer değişti: logo, `<title>`, menü/paylaş metni, `PUSULLA_CONFIG`/`PUSULLA_DAILY`,
  depolama anahtarı `pusulla.v2`, günlük tohum `pusulla|`, launch.json, dokümanlar, `D:\pusulla\` yolları.
- **Kuşun kendisi** geçen yerler değişmedi: maskot/sprite'lar, mod açıklamaları ("martı göğe yükselsin"),
  soru verisi (q03 "martıya simit atmak", "Martıları izlemek", Edis "Martılar", deniz canlısı sorusundaki "martı → kuş").
  Maskot ve mod metinleri pusula konseptiyle birlikte değişecek.
- v1 (kök) ve geçmiş raporlar (`v2/rev/`, `REVIZE_V2*`, `IS_EMRI_V2.md`, `BRIEF.md`) arşiv; dokunulmadı.

## Yan etkiler
- Depolama anahtarı değiştiği için oyuncuların eski seri/istatistikleri görünmez (henüz yayında değil, sorun değil).
- Tohum değiştiği için günlük soru sırası değişti; `check.js` takvim kontrolü ok, 868/868.
- Logo tuvali 144×48 → 180×48 (7 harf sığsın diye); CSS oranı 15/4.
