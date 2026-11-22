# Ses kaynakları (hepsi ElevenLabs, 2026-11-22)
Ham üretimler `F:\Desktop\YENİ DENEMELER\uzun_video\ses_kutuphane\{sfx,muzik}\pusulla_*_01.mp3` içinde, index.json'a işlendi.
Oyundaki dosyalar: ham çıktı → ffmpeg loudnorm (SFX -21 LUFS, müzik -23 LUFS, TP -3 dB), mono, 64 kbps mp3. Toplam ≈ 0,8 MB.
SFX: `POST /v1/sound-generation` (prompt_influence 0.5); Müzik: `POST /v1/music` (instrumental). Ortak SFX önekli prompt:
"8-bit chiptune retro video game sound effect, soft, gentle, low volume, square wave, not harsh, no noise. " + aşağıdaki
| dosya | süre | olay | prompt eki |
|---|---|---|---|
| ui_hover | 0.5 | menu:focus | tiny soft tick, single short blip, very quiet menu cursor move |
| ui_click | 0.6 | buton tıkı | soft menu confirm click, short two-note blip rising |
| mode_select | 1.2 | mode:start | friendly selection jingle, three quick rising notes, ending bright |
| tam | 1.6 | answer:valid tam | perfect answer success, fast ascending major arpeggio of four notes with sparkle, happy |
| cokyakin | 1.4 | valid çok yakın | very good answer, ascending three note arpeggio, pleasant |
| yakin | 1.2 | valid yakın | okay answer, two neutral soft notes, gentle |
| uzak | 1.2 | valid uzak/zayıf | far answer, two soft descending notes, mildly disappointed but gentle |
| invalid | 0.8 | answer:invalid | invalid answer, soft low dull bonk, short, polite |
| none | 1.2 | answer:none | not found in list, soft low wobble then down, mellow shrug |
| pass | 0.9 | answer:pass | skip, soft quick downward slide blip |
| timeout | 1.5 | answer:timeout | time is up, three descending soft notes, slightly sad |
| warn | 0.5 | timer:warn | gentle clock tick, single soft blip, tense but quiet |
| streak | 1.4 | art arda tam/çok yakın (≥2) | streak bonus, quick rising arpeggio with sparkle, rewarding |
| round_end | 2.5 | round:end | round summary jingle, short pleasant melody resolving to a final chord |
| day_complete | 3.5 | day:complete | daily challenge complete fanfare, cheerful short victory melody, soft not loud |
| era_change | 1.8 | era:change | time travel transition, soft swirling arpeggio sweeping upward then settling |
| confirm | 0.8 | answer:confirm | question prompt, two rising soft notes like asking did you mean |
Müzik (instrumental, `force_instrumental`):
- muzik_menu (30 sn, ~85 bpm): Calm relaxing 8-bit chiptune loop, soft square and triangle waves, gentle arpeggios, warm, dreamy, retro menu music, seamless loop, quiet and unobtrusive
- muzik_soru (30 sn, ~105 bpm): Light mid-tempo 8-bit chiptune loop, soft triangle bass, gentle square lead, thinking, curious, playful, retro puzzle game background
- muzik_gerilim (15 sn, ~120 bpm): Soft tense 8-bit chiptune loop, pulsing low triangle bass, quiet ticking rhythm, mild suspense, countdown feeling (timer:warn, left ≤ 3)
Earshot: tam → "8-bit sound effect" z +4,2, "chiptune" z +3,6 (stil tuttu). Müzik döngü sonu dikişi gerçek kulakla dinlenmedi.
