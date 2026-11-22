# RAPOR — Ses
- `v3/sound.js` + `v3/sound/*.mp3` (17 SFX + 3 müzik döngüsü, toplam ≈ 0,8 MB) hazır; ElevenLabs (SFX + /v1/music), 8-bit/yumuşak.
- Harcama: SFX ≈ 250 karakter-kredi, müzik 3 parça (kredi başlığı dönmedi); bütçe 5000'in çok altında. TTS/klon yok.
- sound.js: PUSULLA.events'e abone (app:ready, menu:*, mode:start, question:show, timer:warn, answer:*, era:change, round:end, day:complete, stats:show); buton tıkı; M tuşu; ses seviyesi/açık-kapalı localStorage.
- Müzik: menü / soru / gerilim (≤3 sn) arası 1 sn çapraz geçiş; autoplay için ilk etkileşimde başlar.
- Sözleşme: `PUSULLA.sound.setEnabled/isEnabled` + `setVolume/getVolume`.
- Kütüphane: ham 20 dosya `ses_kutuphane\{sfx,muzik}\pusulla_*` + index.json (yedek: index.json.bak_pusulla_2026-11-22).
- Doğrulama: earshot ölçüm/describe (8-bit etiketi z>3.5), node sahte-Audio olay testi. GERÇEK TARAYICIDA dinlenmedi.
- YAPILACAK: index.html SES bloğuna `<script src="sound.js"></script>` (bkz. rev\NOT_ses.md).
- Kaynak/prompt: sound\KAYNAK.md.
