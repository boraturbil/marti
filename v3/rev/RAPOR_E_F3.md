# RAPOR_E_F3 — Birleştirme, Üretim ve Kontrol Hattı

- **Yazılan/güncellenen dosyalar:** `tools/harvest/50_merge.js`, `60_emit.js`, `70_reports.js`, `lib/aliasfilter.js` (geriye uyumlu `approvedSet`), `lib/years.js` (geriye uyumlu `isValidYear`/`mergeYears`/`formatYear`), `tools/check.js`, `tools/pool_report.js`, `data/_meta.js` (ASOF `2026-11`, 12 `yearKind`, 9 kategori, Türkçe atıf).
- **Fikstür testi (`out/fixtures_e/`):** 1 kapalı (5 satır) + 1 açık (6 ham → QID tekilleştirmeyle 5 satır) ile `50_merge -> 60_emit -> check -> pool_report` zinciri çalıştırıldı: 2 havuz, 10 satır, 1.10 KB ham / 0.76 KB gzip, 2 şüpheli alias ayrıldı (`f|=8`, oyuna yazılmadı), `check.js` HATA: 0, UYARI: 0.
- **Gerçek çalışma dizini:** C ve D işçilerinden henüz `out/raw_*.json` gelmediği için `50_merge`/`60_emit` 0 havuzla boş `ALIAS_REVIEW.md`, `YEAR_CONFLICTS.md`, `MISSING.md`, `SIZE.md` ve `70_reports` boş `REPORTS.md` üretti; `check.js` "soru yok" bilgisiyle 0 hata verdi.
- **`node --check`:** Tüm 8 JS dosyası hatasız geçti.
- **Normalize uyumsuzluğu (`lib/normalize.js` vs `matcher.js`):**
  1. `matcher.js` `\u200B/\u200D/\uFEFF`, `\u00A0` ve `\u0307` temizler; `lib/normalize.js` temizlemez.
  2. `matcher.js` kesme işaretinde yalnız sözcük sonunu (`['’][^\s]*`) atar; `lib/normalize.js` satır sonuna kadar (`['’].*$`) siler.
  3. `matcher.js` `fold(s)` normalize edilmiş girdi bekler; `lib/normalize.js` `fold(s)` içinde `normalize(s)` çağırır. (`50_merge.js` ve `check.js` doğrudan `matcher.normFold` kullanır; `lib/normalize.js`'e dokunulmadı.)
