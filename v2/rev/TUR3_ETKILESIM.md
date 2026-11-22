# TUR 3 Etkileşimli Tarayıcı Testleri (2026-11-22)

Ortam: Headless Microsoft Edge (CDP, `127.0.0.1` yerel sunucu, `1920x1080`).

| Senaryo | Durum | Gözlem |
| --- | --- | --- |
| **(a)** Soru 10 sn açıkken F5 | GEÇTİ | `▲ ZİRVE · SORU 2/7`, kalan süre `20s` (`ROUND_SECONDS=30`) |
| **(b)** Esc → menü, 31 sn bekle, aynı moda gir | GEÇTİ | 2. soru PAS sayıldı; `▲ ZİRVE · SORU 3/7`, süre `30s` |
| **(c)** `?debug=1&auto=zirve` 7. soruda bölge atlama | GEÇTİ | `store.days[gün].zirve.zoneName = "AY IŞIĞI"` (`cineTitle = "AY IŞIĞI"`) |
| **(d)** Sonuç panelinde soru gizli, SONRAKİ SORU'da geri | GEÇTİ | `qHiddenInResult=true`, `qBackOnNext=true` (`▲ ZİRVE · SORU 2/7`) |
| **(e)** Esc kutusu açılıp kapanıyor | GEÇTİ | `opened=true, closed=true` |
| **(f)** Son soruda bölge adı görünüyor | GEÇTİ | `q7ZoneBadge = "▲ AY IŞIĞI  +30.000 m"` |
| **Madde 3** 30 sn sekme gizle → dön → F5 | GEÇTİ | Gizlemeden önce `20s`, 30 sn gizleme + F5 sonrası `18s` (`±2 sn` içinde), `SORU 2/7` korundu |
| **Konsol / Hata** | GEÇTİ | `console.error`, `exceptionThrown`, `unhandledrejection`: `0` |
