# PUSULLA v3 — Yürüyen Karakter + Paralaks Sahne + HUD Raporu

## Değiştirilen Dosyalar ve Satır Sayısı (`git diff --stat`)
- `v3/index.html` (+1 / -0) — `<!-- GORSEL:BASLA -->` bloğunda `scenes/themes.js` sonrasına `<script src="scenes/walker.js"></script>` eklendi.
- `v3/scenes/walker.js` (YENİ, 179 satır) — 16×24 özgün gezgin sprite'ı (şapka, atkı, sırt çantası, pusula; `#1a1128` konturlu 8 renk; `idle0..idle1`, `walk0..walk3`; açılışta sağ/sol offscreen pişirme) ve 11 temalı 8 px periyotlu Bayer dither yol şeridi (`ROADS` + `util.mix`).
- `v3/scenes/core.js` (+161 / -12) — `PAD = ceil(G.W*0.08)` dolgulu `G2` önbellek, katman başına offscreen canvas ve 3 bant paralaks (gök 0.15, uzak 0.4, yakın 0.8), `pu-walker` 3. canvas, `--walker-h` CSS değişkeni, `prevYear` + zaman çizelgesi (`p=0.40` çapraz solma, kesme/interrupt, `question`/`result` faz görünürlüğü, 30/12 fps kapısı, `prefers-reduced-motion`, `?debug` kare süresi ölçümü, `walkTo(year)`).
- `v3/scenes/themes.js` (+2 / -2) — `misir` (0.88H → 0.78H) ve `selcuklu` (0.85H → 0.78H) kervan satırları kahramanla çakışmayacak şekilde taşındı.
- `v3/ui/question.js` (+24 / -2) — `qtop` solunda `.era-tag` dönem etiketi (`mode:start` → `BOĞAZ · ŞİMDİ`, `era:change` → `<yıl> · <ETİKET>`), `renderScore` 300 ms `score-pop` animasyonu.
- `v3/style.css` (+33 / -4) — `.era-tag`, `.qstats b.score-pop` (`steps()`), `.qbody` yarı saydam `rgba(46, 30, 74, .72)`, `.qmain` alt boşluğu `calc(var(--walker-h, 80px) + 8px)`, `@media (max-height: 620px)` ve `@media (max-width: 640px)` / `.subj-cv` mobil uyumu, `prefers-reduced-motion` kuralı.

## Kabul Testleri Sonuçları
1. `node --check` (`v3/scenes/core.js`, `v3/scenes/walker.js`, `v3/scenes/themes.js`, `v3/ui/question.js`): **PASS** (0 hata).
2. `v3` birim ve veri testleri:
   - `node tools/match_test.js`: **PASS** (19/19).
   - `node tools/score_test.js`: **PASS** (8/8).
   - `node tools/check.js --demo`: **PASS** (Havuz: 72, HATA: 0, UYARI: 0).
3. `node v2/tools/check.js`: **PASS** (868/868).
4. Tarayıcı duman testi (`http://127.0.0.1:5055/?debug`, headless Chrome CDP): **PASS**
   - Menü (`menu`): karakter yok (`nonZero: 0`), Boğaz sahnesi aktif.
   - Tur başlangıcı (`question`): karakter alt şerit üstünde ortada (`nonZero: 2944`), `.era-tag` = `"BOĞAZ · ŞİMDİ"`.
   - `walkTo(-2000)`: sola yürüyüş (~2,4 sn), `misir`.
   - `walkTo(2008)`: sağa yürüyüş, `dijital`.
   - `walkTo(2005)`: 0,6 sn kısa adım, `dijital` (solmasız).
   - `walkTo(1450); walkTo(1900)`: ilk yürüyüş kesilip ikinciye geçildi (`cumhuriyet`), hayalet yok.
   - Konsol / sayfa hatası: **YOK** (`ERRORS: []`).
   - `?debug` kare süresi: **0.60 – 1.70 ms** (< 4 ms hedefi), dururken **~12 fps**, yürürken **~30 fps**.
   - `prefers-reduced-motion: reduce`: hareket yok, anlık geçiş (`misir`), tek duran kare.
5. Ekran görüntüleri (`1366x768`, `1920x1080`, `375x812` → `v3/shots/gorsel/walk_*.png`): **PASS**
   - Karakter `.qbody` altında ve `.keys` üstünde tam görünür (`1366x768`: qbodyBottom=577 < head=636; `1920x1080`: 716 < 920; `375x812`: 584 < 681). Yol şeridi dikişsiz.

## Açık Kalanlar
- Gerçek oyuncu cevabı (yıllı/yılsız/geç/süre doldu) ve ses senkronu (`scene:walk`) kullanıcı/ana oturum incelemesine açıktır; `SOZLESME.md` tablosuna dokunulmadı.

## Özet (10 Madde)
1. `v3/scenes/walker.js` içine 16×24 gezgin sprite'ı (8 renk, 6 kare, sağ/sol offscreen pişirme) yazıldı.
2. `walker.js` içinde 11 tema paletli, 8 px periyotlu Bayer dither yol şeridi (`road`) eklendi.
3. `v3/index.html` içindeki `GORSEL:BASLA` bloğuna `scenes/walker.js` eklendi.
4. `v3/scenes/core.js` dolgulu `G2` önbellek ve 3 bant paralaks (0.15 / 0.4 / 0.8) ile güncellendi.
5. `core.js` içine `pu-walker` 3. kanvası, `--walker-h` ayarı ve zaman çizelgeli yürüyüş motoru eklendi.
6. `core.js` içinde `walkTo(year)` hata ayıklama kancası ve `?debug` kare süresi ölçümü eklendi.
7. `v3/scenes/themes.js` içinde Mısır ve Selçuklu kervan satırları `0.78H`'ye taşındı.
8. `v3/ui/question.js` başlığına `.era-tag` dönem etiketi ve `score-pop` animasyonu eklendi.
9. `v3/style.css` içinde yarı saydam `.qbody`, `--walker-h` alt boşluğu ve kısa/dar ekran kuralları yazıldı.
10. Tüm sözdizimi, birim/veri (19/19, 8/8, 0 hata, 868/868) ve tarayıcı/ekran görüntüsü testleri PASS olarak doğrulandı.
