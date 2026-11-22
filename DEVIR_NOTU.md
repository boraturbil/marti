# Martı — Devir notu (güncelleme: 2026-11-22, gece)

## Ne bu
Türkçe, piksel sanat "çoğu insanın vereceği cevabı tahmin et" tarayıcı oyunu. Yalnız PC. Saf HTML/CSS/JS,
klasik script (file:// açılır), harici kütüphane/API yok (tarandı: http/fetch yok). Referans analizi: `WONDERHOP_ANALIZ.md`
(kopyalama yok, tema özgün: İstanbul Boğazı, maskot martı).

## Sürümler
- **v1** (kök `D:\martı\*.js`): 4 soru, dikey sahne. DOKUNMA (yedek). Paylaşım: `marti_demo.zip`.
- **v2** (`D:\martı\v2\`): ana sürüm. Modlar ZİRVE ▲ / DİP ▼ / ORTA KARAR ◆ / SINIRSIZ ∞. 42 soru (data/q*.js),
  384x216 yatay sahne, İstanbul bölgeleri, sinematik bitiş, özet, seri, paylaş, WebAudio ses.
  - **Paylaşım paketi:** `D:\martı\marti_v2_demo.zip` (12 dosya, 159 KB; index.html'i çift tıkla aç). Tarayıcı dışında bir şey gerekmez.

## Bu oturumda yapılanlar (tur 1-5)
- Opus denetimi (kod/soru/görsel/iş emri) → `v2/REVIZE_V2.md` → agy hydrogen düzeltmeleri; ayrıntı raporlar `v2/rev/`, `REVIZE_V2_TUR2/3/4.md`.
- Güvenlik/akış: escapeHtml, NFC+tırnak, Enter çift tetik, ?date/?reset yalnız yerel/debug, sekme gizlenince süre donar, F5/Esc ile yarım soru süreyle devam (pending), son soruda bölge adı doğru.
- Görsel: ORTA köprü/kıyı oturuyor, siyah kutular gitti, güneş yansıması, tek başlık, Dip/su altı zenginleşti, kahraman martı, menü okunur.
- Kullanıcı isteği: sonuç paneli açılınca yazma bölümü (soru ekranı) gizlenir, SONRAKİ SORU'da geri gelir (`game.js` setPhase).
- Esnek eşleştirme: `sular kesikti` ↔ `elektrikler kesildi` gibi çekim/fiil kökü/içerik örtüşmesi (`matcher.js`); alias'lar ~6 → 16-24/cevap (check.js tavanı 15→40). Yanlış pozitif 1.051 → 18 (fp.js).
- Kontrol: `node tools/check.js` → 868/868 test, takvim ok. `node --check` hepsi temiz.

## Açık işler / riskler
1. **Cevap payları (%) YAPAY ZEKA TAHMİNİ** (README'de yazıyor); gerçek veri değil. Karar: önce **simüle anket** (çok kişilikli çoklu örnekleme + varlık sorularında Wikipedia görüntüleme/Google Trends), sonra gerçek oyuncu verisi (başlangıç tahmini + gerçek sayım; sunucu/form gerekir). Google otomatik tamamlama pilotu işe yaramadı (`v2/rev/SINYAL_PILOT.md`). Tek net bulgu: q09 `Kadayıf` payı Revani/Lokma/Tulumba üstüne çıkmalı (uygulanmadı).
2. `check.js` YAKIN-INVALID sayısı 25→48 çıktı, incelenmedi.
3. pos.js olumlu testler 33/36: q36 `temel reis`/`kırmızı başlıklı kız`, `sucuklu yumurta` (veri kaynaklı; belki test beklentisi yanlış).
4. Genel kelimeli alias'lar bırakıldı: q19 `Trabzon`, q11 `aslan/kartal/paşa` (karar gerekebilir).
5. (11-22 devam) check.js 868/868 + tarayıcıda ZİRVE'de soru 1→2 elle oynandı (menü, yazma, esnek eşleşme `mayolar`→Mayo, sonuç paneli, sonraki soru, konsol hatası yok): OK. Henüz bakılmayan: DİP/ORTA/SINIRSIZ tam tur, bitiş sinematiği, son Opus kontrolü.
6. q05 etiketi "Sen de kuyuya atlar mısın", q37 kahvaltılık-invalid grubu yeni; kullanıcı gözüyle bakılmadı.
7. ORTA'da kıyı silüeti/köprü oturması ve Karanlık Dip dip_4 karesi agy beyanı, bağımsız doğrulanmadı.
8. Kullanıcı isteği (eski): daha çok soru/kelime/mod; 3 mod × 7 soru = günde 21 soru; 5 gün için ~105 soru gerekir.
9. (11-22) Yeni mod tasarımı yazıldı: ZAMAN / en eski icat, `notlar/MOD_ESKI_ICAT_TASARIM.md` (kod yok; tartışmalı tarihler [DOĞRULANMALI], 5 karar §9.5).

## Çalıştırma
- v1: `npx serve .` (5173), v2: `npx serve v2` (5174). `.claude/launch.json` içinde `marti` / `marti-v2`. Ya da v2/index.html çift tık.
- Kontrol: `cd v2; node tools/check.js`. Ekran görüntüsü: `v2/tools/shots.ps1` (21 PNG, `v2/shots/`).

## Yedek/dağınık dosyalar (silinebilir, onay sonrası)
`D:\martı\v2_yedek_tur0..5`, `v2_yedek_tur2b`, `v2_yedek_tur4b`, `v2_yedek_data_a/b/b2`, `v2_game_pre_tur2_isciA.js.bak`. Güncel yedek: `v2_yedek_tur5`.
Çalışma raporları: `v2/rev/`, `v2/REVIZE_V2*.md`, `v2/IS_EMRI_V2.md` (98 KB iş emri).

## Çalışma düzeni (bu proje)
Opus kontrol/plan (alt ajan) → agy hydrogen/argon uygular (dosya sahipliğine göre en çok 3 paralel işçi) → Opus kontrol. DERS: paralel agy işçileri birbirinin dosyasını yedekten geri yüklememeli; brief'te dosya sahipliği ve "geri yükleme yok" yazılmalı, brief dosyaları benzersiz adlı olmalı.

## Kim ne yapıyor
- F1 agy (gemini-4-hydrogen-medium, İşçi A + B): tamam. Iskelet/sözleşme v3\ altında, node --check ve daily_sim PASS; tarayıcı (?mock) testi yapılmadı.
- F2 agy (gemini-4-hydrogen-medium, İşçi A akış/UI + B motor/fikstür): tamam; score 8/8, match 8/8, bench indeks 48 ms (hedef 40), smoke A+B PASS; tarayıcı testi yapılmadı.
- F3/F4 veri hattı (ana oturum + agy C/D/E/G/H): bitti (2026-11-23 00:30); 42 havuz (24978 satır, 1,32 MB ham), q_demo.js 42 soru, check --demo 0 HATA/0 UYARI, kör test %96,7 (kalanı matcher eki/yazım hatası). Yıllar/paylar AI tahmini ve "genel bilgi" notlu; Haiku yıl doğrulaması (rev/YIL_DOGRULAMA.md) YAPILMADI. Üniversite sorusu BM Genel Sekreteri ile değişti. Rapor: v3/rev/DEMO_SORULAR.md.
- F5 agy (gemini-4-hydrogen-medium): matcher soyma (match_test 19/19), index.html 42 havuz + _meta + q_demo bagli, score 8/8, bench 38 ms/1000 sorgu, duman testi PASS; tarayici testi yapilmadi.
- F2 agy (gemini-4-hydrogen-medium, İşçi A akış/UI + B motor/fikstür): tamam; score 8/8, match 8/8, bench indeks 48 ms (hedef 40), smoke A+B PASS; tarayıcı testi yapılmadı.
