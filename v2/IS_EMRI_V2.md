# MARTI v2 — İŞ EMRİ (uygulayıcı: agy `gemini-4-hydrogen-medium`)

Bu belge tek başına yeterli olacak şekilde yazıldı. Sırayla uygula, her adımın sonundaki DOĞRULAMA'yı geçmeden sonraki adıma geçme.
Belirsiz bir şey olursa bu belgedeki sayıları/renkleri AYNEN kullan; kendi yorumunla değiştirme.

- Çalışma klasörü: `D:\martı\v2\` (v1 kopyası). `D:\martı\` kökündeki v1 dosyalarına DOKUNMA.
- Okunacak bağlam (yalnız gerekirse): `D:\martı\BRIEF.md` (v1 kuralları hâlâ geçerli), `D:\martı\WONDERHOP_ANALIZ.md` (§5, §6, §7, §9).
- Teknik kısıtlar (DEĞİŞMEZ): saf HTML + CSS + vanilla JS; klasik `<script>` (module YOK), `file://` ile çift tıklayınca çalışır; harici kütüphane, web font, API, LLM YOK; ses ve görsel dosyası YOK (her şey kodla).
- Yalnız PC tarayıcı (mobil kontrol gerekmez). Tüm UI metni Türkçe, tam Türkçe karakterlerle.
- Tema: İstanbul Boğazı, gün batımı, maskot piksel martı. YASAK: sıcak hava balonu, tavşan, deniz feneri; referans oyunun bölge adları (Yüzey, Kıyı, Uçuş Koridoru, Kutup Işıkları, Galaksi, Berrak Su), mod adları (Gökyüzü, Derinlik, Geçmiş, Gelecek), logo stili ve metinleri. Bu belgedeki adlar özgündür.

---

## 0. ÖZET

| Konu | v2 kararı |
|---|---|
| Modlar | **ZİRVE ▲** (en yaygın cevap, martı yükselir) · **DİP ▼** (en nadir geçerli cevap, martı Boğaz'a dalar) · **ORTA KARAR ◆** (ne en çok ne en az: 4.–6. sıradaki cevap, martı vapur hattında kuzeye ilerler) · **SINIRSIZ ∞** (havuzdan rastgele, istatistiği etkilemez) |
| Tur | 7 soru × 30 sn, maks 700 puan |
| Günlük set | Tarih tabanlı deterministik; aynı gün 3 mod birbirinden FARKLI 7'şer soru görür |
| Soru havuzu | 42 soru (v1'in 4'ü + 38 yeni), her biri 15–20 cevap grubu, uzun kuyruk |
| Bölgeler | ZİRVE 6 bölge, DİP 5 bölge, ORTA KARAR 6 durak |
| Sahne | Canvas **384×216 yatay**, tam ekran arka plan, tam sayı ölçek; UI DOM katmanı üstte |
| Ses | WebAudio ile kodla üretilen 8-bit sesler, aç/kapa |

---

## 1. DOSYA YAPISI VE SAHİPLİK

```
v2/
  index.html        (İşçi C)  yeni yerleşim + script sırası
  style.css         (İşçi C)
  config.js         (İşçi C)  MARTI_CONFIG: modlar, kademeler, süreler  [YENİ]
  game.js           (İşçi C)  akış, günlük set, depolama, UI
  sound.js          (İşçi C)  WebAudio sesler                            [YENİ]
  data/q01_10.js    (İşçi A)  soru 1–10                                  [YENİ]
  data/q11_20.js    (İşçi A)  soru 11–20                                 [YENİ]
  data/q21_31.js    (İşçi A)  soru 21–31                                 [YENİ]
  data/q32_42.js    (İşçi A)  soru 32–42                                 [YENİ]
  matcher.js        (İşçi A)  eşleştirme + runMatcherTests
  tools/check.js    (İşçi A)  Node veri/eşleştirme/takvim kontrolü       [YENİ]
  font.js           (İşçi B)  PixelFont: 5×10 bit eşlem yazı tipi         [YENİ]
  zones.js          (İşçi B)  ZONES: bölge tanımları, paletler           [YENİ]
  scene.js          (İşçi B)  canvas sahne
  tools/shots.ps1   (İşçi B)  headless Edge ekran görüntüsü betiği       [YENİ]
  README.md         (son adım)
```

- Eski `v2/data.js` → içeriği `data/q01_10.js`'e taşınır, sonra `data.js` SİLİNMEZ ama index.html'den çıkarılır ve dosyanın başına `// v1 arşiv — kullanılmıyor` yazılır.
- Paralel çalışma: Adım 1'i TEK işçi yapar (sözleşmeleri kurar). Sonra A (adım 2–4), B (adım 5–6), C (adım 7–9) paralel çalışabilir; HER İŞÇİ YALNIZ KENDİ DOSYALARINA YAZAR. Adım 10 tek işçi.
- Paralel çalışırken başka işçinin global'ine ihtiyaç olursa §2'deki sözleşmeye göre yaz; o dosya yoksa geçici sahte (stub) kullanma, `if (root.Scene)` gibi koruma koy.

### index.html script sırası (aynen)
```html
<script src="config.js"></script>
<script src="data/q01_10.js"></script>
<script src="data/q11_20.js"></script>
<script src="data/q21_31.js"></script>
<script src="data/q32_42.js"></script>
<script src="matcher.js"></script>
<script src="font.js"></script>
<script src="zones.js"></script>
<script src="scene.js"></script>
<script src="sound.js"></script>
<script src="game.js"></script>
```
Her dosya `(function (root) { 'use strict'; ... })(typeof window !== 'undefined' ? window : globalThis);` kalıbında. Veri dosyaları: `root.QUESTIONS = root.QUESTIONS || []; root.QUESTIONS.push( {...}, {...} );`

---

## 2. MODÜLLER ARASI SÖZLEŞME (değiştirme)

```js
// config.js
window.MARTI_CONFIG = { ROUND_SECONDS, QUESTIONS_PER_ROUND, MAX_SCORE, SKIP_AFTER_SECONDS, WARN_SECONDS,
  REVEAL_MS, EPOCH, STORAGE_KEY, MODE_ORDER, MODES, PASS_TIER, TIMEOUT_TIER }   // §3

// data/*.js
window.QUESTIONS = [ { id:'q01', cat:'yemek', text:'...', answers:[{label, share, aliases:[]}], invalid:[{aliases:[], reason}], tests:[{in, expect}] } ]

// matcher.js
window.Matcher = {
  normalizeTR(str), toAsciiKey(str), buildKeys(phrase) -> string[],   // test/kontrol için dışa açık
  matchAnswer(raw, question) -> {type:'valid', index, answer, via} | {type:'invalid', reason, via} | {type:'none'}
}   // via: 'exact'|'stem'|'fuzzy'|'content'|'token'
window.runMatcherTests() -> boolean

// font.js
window.PixelFont = { draw(ctx, text, x, y, opts), measure(text, scale) -> {w,h}, missing(text) -> string[] }
  // opts: {scale:1, color:'#fff1d6', outline:'#1a1128'|null, shadow:'#5a2a5e'|null, align:'left'|'center', gradient:[...]|null}

// zones.js
window.ZONES = { zirve:[zone...], dip:[zone...], orta:[zone...] }   // §5.3

// scene.js
window.Scene = {
  init(canvasEl),                 // tam ekran ölçeklemeyi de kurar (resize dinler)
  setMode(modeId),                // 'menu'|'zirve'|'dip'|'orta'  -> kamerayı sıfırlar (yüzey / Eminönü)
  setScore(score, {instant}),     // hedef kamerayı ayarlar; döner: {zoneIndex, zoneChanged, zone}
  effect(name),                   // 'perfect'|'good'|'weak'|'pass'
  getZoneInfo() -> {index, name, label, icon},   // label: '+60 m' / '−25 m' / '6 km'
  onZoneEnter(cb),                // cb({index, name, label}) — bölgeye ilk girişte (banner ile aynı an)
  debug({mode, zoneIndex, freezeTime}),           // ekran görüntüsü için anında kamera
  selfTest() -> string[],         // geometri hataları listesi (boş = geçti)
  drawGullSprite(ctx, x, y, frame) // frame: 'mid'|'up'|'down'|'dive'; menü logosu (İşçi C) bunu kullanır
}

// sound.js
window.Sound = { unlock(), play(name), setEnabled(bool), isEnabled() }   // name: §11
```

---

## 3. MODLAR VE PUANLAMA — `config.js` (AYNEN yaz)

Kademe kuralı: `rank` = cevabın listedeki sırası (answers dizisi paya göre azalan, 1'den başlar), `share` = payı (%).
`rule` alanları isteğe bağlı: `rankMin`, `rankMax`, `shareMin`, `shareMax` (hepsi DAHİL). Kademeler yukarıdan aşağı denenir, İLK uyan kazanır; boş `rule:{}` her şeyi yakalar.

```js
(function (root) {
  'use strict';
  var T = function (id, label, points, emoji, color, icon, effect, rule) {
    return { id: id, label: label, points: points, emoji: emoji, color: color, icon: icon, effect: effect, rule: rule };
  };
  root.MARTI_CONFIG = {
    ROUND_SECONDS: 30,
    QUESTIONS_PER_ROUND: 7,
    MAX_SCORE: 700,
    SKIP_AFTER_SECONDS: 10,   // GEÇ butonu 10 sn sonra (ya da ilk geçersiz/bulunamadı cevaptan sonra)
    WARN_SECONDS: 5,          // son 5 sn: çubuk kehribar + tik sesi
    REVEAL_MS: 2000,          // kademe şeridi + kamera hareketi süresi, sonra sonuç paneli
    EPOCH: '2026-11-22',      // Martı #1 günü
    STORAGE_KEY: 'marti.v2',
    MODE_ORDER: ['zirve', 'dip', 'orta'],
    MODES: {
      zirve: {
        id: 'zirve', name: 'ZİRVE', icon: '▲', daily: true, scene: 'zirve',
        desc: 'En çok verilen cevabı bul, martı göğe yükselsin.',
        hint: 'HERKESİN VERECEĞİ CEVABI VER.',
        listTitle: 'EN ÇOK VERİLENLER',
        tiers: [
          T('mukemmel', 'MÜKEMMEL',   100, '🟨', '#ffcc4d', '★', 'perfect', { rankMax: 1 }),
          T('cokiyi',   'ÇOK İYİ',     70, '🟩', '#5fd068', '◆', 'good',    { rankMin: 2, rankMax: 2 }),
          T('iyi',      'İYİ',         50, '🟦', '#5ab8e8', '◆', 'good',    { rankMin: 3, rankMax: 3 }),
          T('idare',    'İDARE EDER',  30, '🟧', '#f0a04b', '◇', 'good',    { rankMin: 4, shareMin: 5 }),
          T('zayif',    'ZAYIF',       10, '🟥', '#e5594f', '➜', 'weak',    {})
        ]
      },
      dip: {
        id: 'dip', name: 'DİP', icon: '▼', daily: true, scene: 'dip',
        desc: 'En nadir ama geçerli cevabı bul, martı Boğaz\'ın dibine dalsın.',
        hint: 'EN NADİR AMA GEÇERLİ CEVABI VER.',
        listTitle: 'DERİNLERDEN ÖRNEKLER',
        tiers: [
          T('mukemmel', 'MÜKEMMEL',   100, '🟨', '#ffcc4d', '★', 'perfect', { shareMax: 0.5 }),
          T('cokiyi',   'ÇOK İYİ',     70, '🟩', '#5fd068', '◆', 'good',    { shareMax: 1.5 }),
          T('iyi',      'İYİ',         50, '🟦', '#5ab8e8', '◆', 'good',    { shareMax: 4 }),
          T('idare',    'İDARE EDER',  30, '🟧', '#f0a04b', '◇', 'good',    { shareMax: 10 }),
          T('zayif',    'ZAYIF',       10, '🟥', '#e5594f', '➜', 'weak',    {})
        ]
      },
      orta: {
        id: 'orta', name: 'ORTA KARAR', icon: '◆', daily: true, scene: 'orta',
        desc: 'Ne en çok ne en az: ortadaki cevabı bul, martı vapur hattında ilerlesin.',
        hint: 'NE EN ÇOK NE EN AZ: 4.–6. SIRADAKİ CEVABI BUL.',
        listTitle: 'ORTADAKİLER',
        tiers: [
          T('mukemmel', 'TAM ORTA',   100, '🟨', '#ffcc4d', '★', 'perfect', { rankMin: 4, rankMax: 6,  shareMin: 0.5 }),
          T('cokiyi',   'ÇOK YAKIN',   70, '🟩', '#5fd068', '◆', 'good',    { rankMin: 3, rankMax: 8,  shareMin: 0.5 }),
          T('iyi',      'YAKIN',       50, '🟦', '#5ab8e8', '◆', 'good',    { rankMin: 2, rankMax: 11, shareMin: 0.5 }),
          T('idare',    'UZAK',        30, '🟧', '#f0a04b', '◇', 'good',    { rankMin: 12, shareMin: 0.5 }),
          T('zayif',    'ZAYIF',       10, '🟥', '#e5594f', '➜', 'weak',    {})  // 1. cevap ve %0,5 altı buraya düşer
        ]
      },
      sinirsiz: {
        id: 'sinirsiz', name: 'SINIRSIZ', icon: '∞', daily: false, scene: null, // seçilen modun sahnesi ve kademeleri kullanılır
        desc: 'Havuzdan rastgele 7 soru. Seri ve istatistiği etkilemez.'
      }
    },
    PASS_TIER:    T('pas',   'PAS',        0, '⬜', '#8a8698', '⏭', 'pass', {}),
    TIMEOUT_TIER: T('sure',  'SÜRE DOLDU', 0, '⬜', '#8a8698', '⌛', 'pass', {})
  };
})(typeof window !== 'undefined' ? window : globalThis);
```

Kademe hesaplama fonksiyonu (game.js'te): `evalTier(mode, rank, share)` → kademeleri sırayla dene; `rank` ve `share` kural sınırlarını sağlayan ilk kademeyi döndür.

### Sonuç cümleleri (game.js, `%` sayıdan ÖNCE, Türkçe ondalık virgül)
Ondalık biçim: `formatPct(s)`: `s < 1` → 2 ondalığa kadar (`%0,25`, `%0,4`), yoksa 1 ondalık (`%40,3`). `toLocaleString('tr-TR', {minimumFractionDigits: 1, maximumFractionDigits: s < 1 ? 2 : 1})`, başa `%`.

| Mod | Durum | Cümle |
|---|---|---|
| ZİRVE | rank 1 | `Bu 1 numaralı cevap. Herkesle aynı kafadasın.` |
| ZİRVE | rank 2–3 | `Bu {r} numaralı cevap: verenlerin oranı {p}.` |
| ZİRVE | İDARE EDER | `{r}. sırada ({p}). Fena değil, biraz daha yukarı.` |
| ZİRVE | ZAYIF | `Az verilmiş ({p}): yukarı sadece küçük bir kanat çırpışı.` |
| DİP | MÜKEMMEL | `İyi saklanmış: verenlerin oranı sadece {p}.` |
| DİP | ÇOK İYİ | `Derinlerde ({p}). Dibe az kaldı.` |
| DİP | İYİ | `Orta sularda ({p}).` |
| DİP | İDARE EDER | `Epey kişi bunu demiş ({p}).` |
| DİP | ZAYIF | `Bu kalabalığın cevabı ({p}): dip değil, yüzey.` |
| ORTA | TAM ORTA | `Bu {r} numaralı cevap ({p}): tam ortada!` |
| ORTA | ÇOK YAKIN / YAKIN / UZAK | `Bu {r} numaralı cevap ({p}). Orta 4.–6. sıralar.` |
| ORTA | ZAYIF, rank 1 | `Bu 1 numaralı cevap: herkes bunu dedi, orta değil.` |
| ORTA | ZAYIF, %0,5 altı | `Çok nadir ({p}): ortanın epey altında.` |
| hepsi | süre bitti | `Süre doldu.` |
| hepsi | GEÇ | `Bu soruyu geçtin.` |

---

## 4. GÜNLÜK SET VE SINIRSIZ

- `dayKey` = tarayıcı yerel tarihi `YYYY-MM-DD`. Test için URL parametresi `?date=2026-11-25` dayKey'i ezer.
- `epochDay` = EPOCH (2026-11-22) ile dayKey arasındaki gün farkı (UTC gün hesabı: `Date.UTC(y,m-1,d)/86400000`). Gün numarası `#N = epochDay + 1`.
- Karıştırıcı: FNV-1a 32-bit hash + mulberry32 PRNG.
  ```js
  function fnv1a(str){ var h = 2166136261; for (var i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
  function mulberry32(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(arr, rng){ var a = arr.slice(); for (var i=a.length-1;i>0;i--){ var j = Math.floor(rng()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  ```
- Algoritma `getDailySet(dayKey)`:
  1. `pool` = QUESTIONS id'ye göre sıralı dizinler.
  2. `k = Math.max(1, Math.floor(n / 21))` (n = soru sayısı; 42 soruda k = 2), `cycle = Math.floor(epochDay / k)`, `part = ((epochDay % k) + k) % k`; `order = shuffle(pool, mulberry32(fnv1a('marti|' + cycle)))`.
  3. `dayPart = order.slice(part * 21, part * 21 + 21)` (bir döngü = k gün, döngü içinde hiç tekrar yok; havuz büyüdükçe k otomatik artar).
  4. Modlara böl: `zirve = dayPart[0..6]`, `dip = dayPart[7..13]`, `orta = dayPart[14..20]`.
  5. Her modun kendi sırası: `shuffle(modListesi, mulberry32(fnv1a(dayKey + '|' + modeId)))` (seed = tarih + mod).
  Böylece herkes aynı gün aynı soruları görür, aynı gün iki modda aynı soru çıkmaz.
- n < 21 ise her mod `order`'dan döngüsel 7 soru alır (tekrar olabilir; yalnız geliştirme sırasında).
- NOT: 42 soru × 3 mod = günde 21 soru → yalnız **2 gün tekrarsız**. 5 gün tekrarsız için ~105 soru gerekir; havuz sonradan büyütülünce kod değişmeden k artar.
- SINIRSIZ: `Math.random` ile havuzdan 7 farklı soru; menüde seçilen mod (varsayılan ZİRVE) sahnesi ve kademeleri; depolamaya YAZILMAZ (yalnız `stats.unlimitedRounds++`).

---

## 5. SAHNE — GENEL MİMARİ (`scene.js`, `zones.js`, `font.js`)

### 5.1 Çözünürlük kararı: 384×216 yatay, tam ekran
- v1'in 180×320 dikey "telefon kartı" PC'de dar ve boş görünüyor; referans tam ekran yatay sahne kullanıyor. **Karar: canvas iç çözünürlüğü 384×216 (16:9).** 1920×1080'de tam ×5, 2560×1440'ta ×7 (kırpılır), 1366×768'de ×4 (kırpılır).
- Ölçek: `s = Math.ceil(Math.max(innerWidth / 384, innerHeight / 216))`; canvas CSS boyutu `384*s × 216*s`, `position:fixed; left:(innerWidth-384*s)/2 px; top:(innerHeight-216*s)/2 px` (negatif olabilir = ortadan kırpma). `image-rendering: pixelated`. `resize`'da yeniden hesapla. `document.documentElement.style.setProperty('--px', s + 'px')`.
- GÜVENLİ ALAN: önemli öğeler x 40..344, y 12..204 içinde (kırpmada kaybolmasın). Martı sabit: merkez **(192, 96)**.
- CRT: canvas üstünde `div.crt` → `background: repeating-linear-gradient(to bottom, rgba(0,0,0,.10) 0, rgba(0,0,0,.10) calc(var(--px)*0.5), transparent calc(var(--px)*0.5), transparent var(--px))`, `pointer-events:none`.
- Performans: statik silüetleri (tepeler, köprü, cami, evlerin gövdesi) mod başında bir kez **offscreen canvas**'a çiz (`layerCache`), her karede `drawImage(cache, 0, Math.round(screenY − oy))`. Işıklar, su, canlılar her karede.
  - Önbellek boyutu kırpmasın: Çamlıca anteni y ≈ −41'e çıkar, kara dolguları 300 px aşağı iner (DİP'te görünür). Bu yüzden her önbellek tuvali `oy = 60` üst pay ile **384 × (216 + 60 + 320) = 384×596**; içine çizerken her y'ye `+ oy` eklenir. Parallax katsayısı farklı her grup (0.6 / 0.8 / 1.0) ayrı önbellek.

### 5.2 Kamera ve parallax
- Tek kamera değeri: `cam` (piksel). ZİRVE'de pozitif (yukarı), DİP'te negatif (aşağı). ORTA'da ayrıca `camX` (yatay), `cam = 0`.
- Hedef: `setScore(score)` → `targetCam` = bölge tablosundaki (score → cam) noktaları arasında doğrusal enterpolasyon. Son bölgeden sonra: ZİRVE `+0.5 px/puan`, DİP `−0.1 px/puan` ve `cam >= −575` sınırı, ORTA `camX` için `+3 px/puan`.
- Yumuşak geçiş (her karede): `cam += (targetCam - cam) * (1 - Math.exp(-dt * 2.2))` (≈2 sn'de oturur). `camX` aynı formül.
- **Dünya katmanı** (world layer) ekran konumu: `screenY = baseY + (cam - anchorCam) * p`, ORTA'da `screenX = baseX - (camX - anchorX) * p`. Her zaman `Math.round`.
- **Ekran katmanı** (screen layer): ekrana sabit, bölge ağırlığı `w` ile görünür (ör. yıldızlar, ay, şehir ışıkları halısı, uçak, akıntı çizgileri). Görünürlük: `w < 0.02` ise çizme; `ctx.globalAlpha = w` ya da üstten/alttan `(1-w)*40` px kaydırarak gir.
- Bölge ağırlığı: `cam`'ın içinde bulunduğu iki komşu bölge `i`, `i+1`; `t = (cam - zone[i].cam) / (zone[i+1].cam - zone[i].cam)` (0..1'e kırp); `w[i] = 1-t`, `w[i+1] = t`, diğerleri 0. DİP'te cam negatif olduğundan mutlak değerle hesapla.
- Parallax katsayıları (yüzey sahnesi): güneş **0.3**, uzak tepeler **0.6**, Çamlıca tepesi **0.8**, yakın kıyılar + köprü + evler + su + kesit + su altı **1.0** (aynı katsayı = kıyı ile su arasında boşluk oluşmaz). Bulutlar: uzak 0.4, orta 0.7, yakın 1.3.
- KURAL: Zemine oturan her kara poligonu kendi su hattının **300 px altına** kadar dolgu ile uzanır (alttan boşluk/havada kalma asla olmaz; önündeki katman üstünü örter).

### 5.3 Bölge tanımı formatı (`zones.js`)
```js
{ id:'galata', name:'GALATA HİZASI', score:60, cam:56, meters:60,       // ORTA'da cam yerine camX, meters yerine km
  sky:['#3a2457','#7a3466','#c24d63','#ef7a5c','#f8ae6a','#ffd89a'],    // üstten alta 6 bant
  starAlpha:0, rayAlpha:0.07, lightsOn:true,                              // ışıklar (pencere, köprü) yanık mı
  layers:['otherGulls'] }                                                 // bu bölgeye özel ekran/dünya katmanı adları
```
Rozet etiketi: ZİRVE `'+' + meters.toLocaleString('tr-TR') + ' m'` (0 için `'±0 m'`), DİP `'−' + ... + ' m'` (U+2212 eksi), ORTA `km.toLocaleString('tr-TR') + ' km'`. Bölge içinde iki komşu meters arasında `cam`'a göre enterpole ederek canlı göster (yuvarla: <100 m 1'e, <1000 m 10'a, üstü 100'e).

### 5.4 Bölge tabloları

**ZİRVE ▲ (yukarı)**

| # | Ad | Eşik puan | cam | Rozet | Gökyüzü bantları (üst→alt) | Yıldız | Özel canlı öğeler |
|---|---|---|---|---|---|---|---|
| 0 | BOĞAZ | 0 | 0 | ±0 m | `#2b1e4a #5a2a5e #a13d63 #e0605a #f59a5c #ffd27a` | 0 | güneş + suda yansıma şeridi, vapur, kayıklar, kuş sürüsü, su altı kesiti, yanan pencereler |
| 1 | GALATA HİZASI | 60 | 56 | +60 m | `#3a2457 #7a3466 #c24d63 #ef7a5c #f8ae6a #ffd89a` | 0 | Galata Kulesi balkonu martıyla aynı hizada; 3–4 küçük martı sürüsü yakından geçer; kule penceresi yanar |
| 2 | ÇAMLICA | 160 | 140 | +370 m | `#2a2350 #4f3070 #8a4378 #c8667a #e99a86 #f6c7a0` | 0.15 | Çamlıca Kulesi gövdesi/kapsülü martı hizasında, anten kırmızı ışık; 2 uçurtma (ip tepeye bağlı), çam ağaçları |
| 3 | BULUT DENİZİ | 280 | 300 | +2.000 m | `#1d2148 #33306a #5b4488 #8e5c98 #c486a6 #e8b6b8` | 0.35 | 3 derinlik bulut katmanı, yolcu uçağı + iz, aşağıda batan güneş bulutların arasında |
| 4 | GECE İSTANBUL | 420 | 470 | +9.000 m | `#0b0f24 #121a3a #1a2550 #243266 #2f3f78 #3c4a85` | 0.8 | alttan giren şehir ışıkları halısı (yukarıdan bakış), karanlık Boğaz şeridi, iki köprü ışık çizgisi |
| 5 | AY IŞIĞI | 560 | 640 | +30.000 m | `#04050f #070a1c #0b1028 #101634 #141c40 #18224a` | 1.0 | büyük piksel hilal ay, parlak yıldızlar, yıldız kayması (4–7 sn'de bir), yavaş giden uydu noktası |

**DİP ▼ (aşağı)** — `sky` burada su rengi bantlarıdır (kesit çizgisinin altındaki her yere uygulanır).

| # | Ad | Eşik puan | cam | Rozet | Su bantları (üst→alt) | Işın | Özel canlı öğeler |
|---|---|---|---|---|---|---|---|
| 0 | BOĞAZ | 0 | 0 | ±0 m | yüzey sahnesi (ZİRVE 0 ile aynı) | 0.07 | — |
| 1 | SIĞLIK | 60 | −110 | −5 m | `#3f8aa0 #337a94 #2a6a86 #225b78 #1b4c69 #153f5b` | 0.09 | iki yanda kaya rafları, midye kümeleri, yosun, istavrit sürüsü, kabarcıklar |
| 2 | AKINTI | 200 | −250 | −25 m | `#22607a #1c5370 #174764 #123b57 #0e304b #0a263f` | 0.05 | sola akan akıntı çizgileri (Boğaz alt akıntısı), lüfer/palamut sürüsü, yukarıdan sarkan zincirli çapa |
| 3 | BATIK | 360 | −400 | −60 m | `#143c52 #103247 #0c283b #091f30 #071827 #05121e` | 0.02 | sol kaya çıkıntısında batık ahşap tekne kaburgaları, amforalar, sandık, saklanan balıklar |
| 4 | KARANLIK DİP | 520 | −560 | −110 m | `#061420 #050f19 #040c14 #03090f #02060b #010407` | 0 | Boğaz'ın en derin tabanı (tam genişlik zemin), parlayan denizanaları, deniz karı, ışıklı küçük balık sürüsü |

**ORTA KARAR ◆ (yatay vapur hattı, Avrupa yakası boyunca kuzeye)**

| # | Durak | Eşik puan | camX | Rozet | Gökyüzü bantları | Simge yapı |
|---|---|---|---|---|---|---|
| 0 | EMİNÖNÜ | 0 | 0 | 0 km | ZİRVE 0 bantları | Yeni Cami (L cami, 2 minare) + alçak Galata Köprüsü |
| 1 | BEŞİKTAŞ | 100 | 420 | 3,5 km | ZİRVE 1 bantları | saat kulesi + iskele binası |
| 2 | ORTAKÖY | 220 | 840 | 6 km | ZİRVE 2 bantları | kıyıda küçük cami (M, 2 ince minare) + arkada köprü (yüzeydeki köprünün 0.6 ölçekli uzak hâli) |
| 3 | BEBEK | 340 | 1260 | 9 km | `#2a2550 #46306a #743f73 #a85872 #d07e7a #e9a98c` | yalılar, park ağaçları, demirli kayıklar |
| 4 | RUMELİ HİSARI | 460 | 1680 | 11 km | ZİRVE 3 bantları | yamaçta mazgallı surlar + 3 yuvarlak kule, arkada uzak köprü |
| 5 | SARIYER | 580 | 2100 | 19 km | `#141a3c #232a58 #3a3a72 #5a4a84 #7e5f92 #a07898` | renkli balıkçı tekneleri, ormanlı tepeler, sağda kıyı biter: açık Karadeniz ufku |

### 5.5 Gökyüzü / su rengi: `drawSky(zoneA, zoneB, t)`
- 6 bant rengini `lerpColor(A[k], B[k], t)` ile karıştır.
- Bant yükseklikleri ekranda sabit: 216 / 6 = 36 px. Bant `k` y aralığı `[36k, 36k+36)`.
- Geçiş: her bandın son 6 satırında (y = 36k+30 .. 36k+35) bir sonraki renkle **Bayer 4×4 dithering**: satır `j` (0..5) için eşik `level = (j+1)/7`; piksel `(x,y)` sonraki renkte boyanır eğer `BAYER4[y%4][x%4] / 16 < level`.
  `BAYER4 = [[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]]`.
- Hız için: dithering satırlarını offscreen'de bir kez üret, renk değiştiğinde (t 0.01'den fazla değişince) yeniden üret.
- DİP'te: kesit çizgisinin ekran y'si `kesitY = 132 + cam` (cam negatif → yukarı çıkar). `y < kesitY` → gökyüzü (BOĞAZ bantları), `y >= kesitY` → su bantları; su bantları kesitY'den başlayıp 36 px'lik bantlarla aşağı iner (son bant ekran sonuna kadar uzar). cam 0'da su bantları için ayrı yüzey su altı paleti kullanılır (§6.9).

### 5.6 Bölge giriş efekti
- Bölge değişimi oyuncunun **puanıyla** tetiklenir (kamera değil): `setScore` yeni bölge indeksini önceki maksimumdan büyük bulursa `zoneChanged:true`, banner kuyruğa girer, `onZoneEnter` geri çağrılır.
- `drawZoneBanner(text, t)`: PixelFont ölçek 3 (glyph 15×30 px — ölçek 3'te 5×10 hücre), metin büyük harf, yatay merkez x=192, **üst kenarı y=132** (martının altı, sonuç paneli açılmadan önceki boş alan; üstteki tabelayla çakışmaz).
  - Renk `#fff1d6`, 1 px kontur `#1a1128`, gölge (+1,+1) `#5a2a5e`.
  - Alt çizgi: metnin 3 px altında, 2 px kalın `#ffd27a`, genişlik 0 → metin genişliği, 0.4 sn.
  - Zamanlama: 0–0.3 sn yukarıdan 24 px kayarak gir (easeOutBack), 0.3–1.9 sn bekle, 1.9–2.3 sn ditherlı sön (Bayer eşiğini 0→1 artır).
  - Altında küçük satır (ölçek 1): rozet etiketi, ör. `+370 m`.
  - Aynı anda gökyüzüne 0.3 sn'lik hafif beyaz flaş (alpha 0.15 → 0) ve `Sound.play('zone')` (DİP'te `'dive'`).
- Sol üst rozet DOM'dadır (game.js günceller, §8.2).

### 5.7 Piksel yazı tipi `font.js`
- Hücre 5 genişlik × 10 yükseklik: satır 0–1 üst işaret alanı (İ noktası, Ö/Ü noktaları, Ğ kaşı), satır 2–8 harf gövdesi (7 satır), satır 9 alt işaret (Ç, Ş çengeli). Harf aralığı 1 px, boşluk 3 px.
- Gerekli karakterler: `A–Z` (Q W X dahil), `Ç Ğ I İ Ö Ş Ü`, `0–9`, boşluk, `. , : ! ? - + % / ' ( ) ★ ▲ ▼ ◆ ∞ ·` ve `−`.
- Format: her glyph 10 elemanlı dizi, her eleman 5 karakter (`#` dolu, `.` boş). Örnekler (bunları AYNEN kullan, diğerlerini aynı üslupta çiz):
```js
A: ['.....','.....','.###.','#...#','#...#','#####','#...#','#...#','#...#','.....'],
I: ['.....','.....','#####','..#..','..#..','..#..','..#..','..#..','#####','.....'],
İ: ['..#..','.....','#####','..#..','..#..','..#..','..#..','..#..','#####','.....'],
Ç: ['.....','.....','.###.','#...#','#....','#....','#....','#...#','.###.','..#..'],
Ğ: ['.###.','.....','.###.','#...#','#....','#.###','#...#','#...#','.###.','.....'],
Ö: ['.#.#.','.....','.###.','#...#','#...#','#...#','#...#','#...#','.###.','.....'],
Ş: ['.....','.....','.####','#....','#....','.###.','....#','....#','####.','..#..'],
Ü: ['.#.#.','.....','#...#','#...#','#...#','#...#','#...#','#...#','.###.','.....'],
'▲': ['.....','.....','..#..','..#..','.###.','.###.','#####','#####','.....','.....'],
```
- Metin önce `toLocaleUpperCase('tr-TR')`. `missing(text)` tabloda olmayan karakterleri döndürür (kontrol listesinde kullanılır).
- `draw` sırası: gölge → kontur (her dolu pikselin 4 komşusuna kontur rengi) → dolgu. `gradient` verilirse glyph satırına göre renk: `gradient[Math.min(gradient.length-1, satır-2 bazlı indeks)]`.

---

## 6. SAHNE GÖRSEL KALİTESİ (ZORUNLU, ayrıntılı)

v1'deki hatalar (DÜZELTİLECEK): köprü tabliyesi ve ayakları havada duruyor (ayaklar kıyıya/suya oturmuyor), halatlar kırık çizgi, silüetler kaba dikdörtgen yığını, cami oranları bozuk, kule zeminde değil. v2'de aşağıdaki tarifler **koordinatıyla birlikte** uygulanır. Bütün koordinatlar **cam = 0** (yüzey) ekran koordinatıdır; diğer cam değerlerinde §5.2 formülüyle kayar.

### 6.1 Piksel sanat kuralları
1. **Yumuşatma yok:** `ctx.imageSmoothingEnabled = false`; sprite ve silüetlerde `ctx.arc`, `ctx.lineTo` + `stroke`, `ellipse` YASAK. Yalnız tam sayı `fillRect` ve aşağıdaki yardımcılar. `globalAlpha` yalnız ışık hüzmesi, sis, parıltı halesi, iz ve bölge solması için.
2. **Yardımcılar (scene.js başında yaz):**
   - `px(x,y,w,h,c)` — `Math.round` ile fillRect.
   - `fillPolyPx(points, c)` — tarama çizgisi (scanline) ile poligon dolgu; her tam sayı y için kenar kesişimlerini bul, `[xa, xb]` arası doldur.
   - `fillCirclePx(cx,cy,r,c)` — her satır `dy` için `hw = Math.floor(Math.sqrt(r*r - dy*dy) + 0.5)`.
   - `fillDomePx(cx, baseY, r, c, rimC, sunSide)` — yalnız üst yarı: `dy = 0..r`, satır `y = baseY - dy`, `x ∈ [cx-hw, cx+hw]`; her satırın güneşe bakan uç pikseli `rimC`.
   - `ditherRect(x,y,w,h,c1,c2,level)` — Bayer 4×4, `level` 0..1.
   - `lerpColor(a,b,t)`, `shade(hex, k)` (k −1..1, HSL değil RGB çarpımı yeter).
   - `landTop(poly, x)` — poligonun üst profil noktaları (x'e göre sıralı) arasında doğrusal enterpolasyon, `Math.round`.
   - `groundBase(poly, x0, x1)` — `max(landTop(poly, x))`, x ∈ [x0, x1]. **Bir yapının tabanı = groundBase; gövde tabana kadar dolu çizilir** → hiçbir yapı havada kalmaz.
   - `drawSprite(grid, pal, x, y, {flipX, outline})` — karakter matrisi; `outline` verilirse önce her dolu pikselin boş 4 komşusuna kontur rengi.
3. **Gölgelendirme:** her nesnede 3–4 ton: koyu (gölge) / ana / açık / vurgu. Işık kaynağı güneş (192, 92): güneşin solundaki nesnelerde SAĞ kenar 1 px vurgu, sağındakilerde SOL kenar 1 px vurgu; nesnenin alt 1–2 satırı koyu ton.
4. **Kontur:** yakın ve hareketli nesnelerde (martı, vapur, kayık, balık, uçurtma, uçak) 1 px kontur, renk nesneden koyu (genelde `#1a1128` veya bölgenin en koyu tonu). Uzak silüetlerde kontur YOK (gökyüzüne karşı koyu kütle + üst kenarda 1 px kenar ışığı).
5. **Oranlar:** aşağıdaki ölçüler dışında boyut uydurma. Simetrik yapılar `cx` etrafında tam simetrik.
6. **Sınırlı ama zengin palet:** aşağıdaki `PAL` dışında renk ekleme (bölge paletleri hariç).

```js
var PAL = {
  ink:'#1a1128',
  farHill:'#5a3566', farHillRim:'#7e4a72',
  camHill:'#3a2550', camHillRim:'#5e3a66',
  land:'#261a38', landRim:'#4a3258', landDark:'#1c1229',
  bldA:'#24183a', bldB:'#2b1e40', bldC:'#33244a', bldRim:'#5a3a62',
  roof:'#5a2f45', roofDark:'#43223a',
  win1:'#ffcf6b', win2:'#ffb054', win3:'#fff0c0', winOff:'#3a2a4e',
  sunCore:'#ffe08a', sunMid:'#ffb35c', sunRim:'#ff7a59', sunHalo:'#ffb067',
  water1:'#6a3f6e', water2:'#7d4a72', water3:'#5a3a66', water4:'#3e2e5c', waterHi:'#c2708a', landRefl:'#33244f',
  refl1:'#ffd27a', refl2:'#ffb067', refl3:'#ff8a5c',
  foam:'#f3e6d8', surfLine:'#9fd0d8',
  uw1:'#2f6f8f', uw2:'#24597a', uw3:'#1b4666', uw4:'#12334f', ray:'#bfe6ee',
  sand:'#4a5a6a', sandDark:'#36444f', rock1:'#2c3a4c', rock2:'#3f5266', rock3:'#5d7488',
  weed1:'#2f7a4f', weed2:'#4fa065', weedDark:'#1f5236',
  fishSilver:'#c8d6e0', fishBlue:'#6f8fa8', fishDark:'#3a4a5a',
  gullW:'#f6f1e7', gullL:'#d9d2dc', gullG:'#a9a3b8', gullB:'#2b2436', gullY:'#f2b134', gullYd:'#c9821f', gullE:'#1a1428', gullO:'#3a2f4f',
  ferryHull:'#e8e2d8', ferryCab:'#f1ece2', ferryShade:'#c9c2b8', ferryDark:'#2a2a3a', ferryFunnel:'#f2b134', ferryWin:'#3a4a6a',
  wood1:'#6a3b2a', wood2:'#8a4f35', wood3:'#a8683f',
  tile1:'#8a3b3b', tile2:'#a84c45', tile3:'#5e2a33',
  pine1:'#1f3a2f', pine2:'#2f5a40', pine3:'#4a7a52',
  kiteA:'#e84a5f', kiteB:'#f6c445', kiteC:'#4fb0d8',
  cloudHi:'#f3d6d6', cloudMid:'#e8b6b8', cloudLo:'#c486a6', cloudShadow:'#a8708f',
  moon:'#fff3c4', moonShade:'#e8d9a0', moonGlow:'#3a3a6a',
  star:'#fff7e0', city1:'#ffcf6b', city2:'#ffa94d', city3:'#fff1c1', cityBase:'#0d1430',
  amph1:'#c07a4a', amph2:'#9a5a3a', amph3:'#6a3a2a',
  jelly:'#7fe0ff', snow:'#8aa0b0', red:'#ff4d4d', green:'#5fd068'
};
```

### 6.2 Yüzey sahnesinin sabit geometrisi (cam = 0)
```js
var GEO = {
  W:384, H:216, GULL_X:192, GULL_Y:96,
  SUN:{x:192, y:92, r:16},
  WATER_Y:104,            // uzak su hattı / kıyıların suya değdiği satır
  KESIT_Y:132,            // su altı kesit çizgisinin ortalama y'si
  SEABED_SHELF_Y:196,     // kıyı raflarının üst seviyesi
  DECK_Y:78,              // köprü tabliyesinin üst satırı
  TOWER_TOP:44,           // köprü kulesi tepe satırı
  TOWER_L:92, TOWER_R:292 // kule merkezleri (iki bacak: merkez-4..merkez-3 ve merkez+2..merkez+3)
};
```
Çizim sırası (arkadan öne): `drawSky → drawStars → drawSun → drawClouds(far) → drawFarHills → drawCamlicaHill(+kule, çamlar, uzak evler) → drawClouds(mid) → drawBridge → drawNearLand(sol+sağ, evler, cami, Galata) → drawWaterSurface (yansımalar, kayıklar, vapur) → drawKesit → drawUnderwater → bölge katmanları → drawGull → drawSparkles → drawClouds(near) → drawZoneBanner`.

### 6.3 Kara parçaları (iki yaka)
- **Uzak tepeler** (p 0.6, renk `farHill`, üst kenar 1 px `farHillRim`): üst profil noktaları
  `(0,96) (40,92) (90,95) (140,90) (192,94) (240,89) (300,93) (350,90) (384,94)`, alt `(384,103+300) (0,103+300)`.
  Üstüne seyrek uzak ışık: x her 7 px'de bir, `fnv1a('f'+x) % 5 === 0` ise (x, landTop+2) 1 px `win1` (lightsOn bölgelerde).
- **Sol yakın kara (Avrupa yakası)** (p 1.0, `land`, kenar `landRim`): üst profil
  `(0,58) (20,56) (44,60) (60,66) (76,76) (90,88) (98,96) (104,103)`, sonra `(104,403) (0,403)`.
- **Çamlıca tepesi (Anadolu, arkada)** (p 0.8, `camHill`, kenar `camHillRim`): üst profil
  `(236,103) (258,88) (286,72) (312,62) (334,58) (356,60) (384,66)`, alt `(384,403) (236,403)`.
- **Sağ yakın kara (Üsküdar)** (p 1.0, `land`): üst profil
  `(280,103) (292,96) (304,90) (318,84) (332,76) (350,70) (384,68)`, alt `(384,403) (280,403)`.
- Kara–su birleşimi: suyun ilk 2 satırında (y 104–105) kara altına düşen x aralıklarında (sol 0..104, sağ 280..384) `landRefl` renginde yansıma, her karede x'e `Math.round(Math.sin(t*2 + x*0.3))` titreşimi.

### 6.4 Boğaz köprüsü (`drawBridge`, p 1.0, köprü, yakın karalardan ÖNCE çizilir ki ayaklar ve tabliye uçları karanın içine gömülsün)
- **Kuleler:** sol merkez 92, sağ merkez 292. Her kule 2 bacak, her bacak 2 px: sol kule bacakları x **88–89** ve **94–95**; sağ kule x **288–289** ve **294–295**. Bacaklar y **44**'ten `landTop(nearLand, x) + 2`'ye kadar (sol için ≈ y 90–92, sağ için ≈ y 96–97). Böylece bacak alt ucu yamaçta kaybolur, kule karadan yükselir. ASLA suda/boşlukta bitmez.
- Kule tepe başlığı: x merkez−5..merkez+5, y 42–43 (2 satır). Kirişler (1 px): y **46, 64, 82**, x bacak sol kenarından sağ kenarına (88..95 / 288..295). Renk `bldB`, güneşe bakan iç kenar 1 px `bldRim` (sol kulede sağ bacak sağ kenarı, sağ kulede sol bacak sol kenarı).
- Kule tepesinde uçak ikaz ışığı: (92,41) ve (292,41) 1 px `red`, 1 Hz yanıp söner (yalnız lightsOn).
- **Tabliye:** y **78** (üst satır, `bldRim`), y **79–80** (`bldA`), y 81 her 2 px'de bir nokta (kafes, `landDark`). x 0'dan 384'e çizilir; uçları sol/sağ yakın kara poligonlarının (sonradan çizildikleri için) içine girer: sol yamaçta x≈78'de, sağda x≈327'de kaybolur. Kontrol: `landTop(sol, 70) < 78` ve `landTop(sağ, 340) < 78` olmalı.
- **Ana halat (doğru sarkma eğrisi = parabol):** x ∈ [92, 292] için
  `y(x) = 44 + 32 * (1 - ((x - 192) / 100) ** 2)` → kulelerde y=44, ortada (x=192) y=76 (tabliyenin 2 px üstü). Her x için 1 px `bldB`; ardışık iki x arasında y farkı >1 ise aradaki dikey pikselleri de doldur (kopuk görünmesin).
- **Yan halatlar:** sol: x 92'den `endX = 40`'a; sağ: x 292'den `endX = 344`'e. Her iki tarafta `endY = landTop(yakınKara, endX) + 2` (sol ≈ 61, sağ ≈ 74), `t = |x − kuleX| / |endX − kuleX|`, `y = 44 + (endY − 44)*t + 4*Math.sin(Math.PI*t)`. Böylece uç her iki yakada karanın içinde biter (havada asılı kalmaz).
- **Askı halatları:** x = 96, 100, ..., 288 (4 px aralık) için y(x)+1'den 77'ye 1 px dikey, renk `winOff`, `globalAlpha 0.7`.
- **Tabliye lambaları:** x = 4, 12, 20, ... her 8 px'de y=78'de 1 px `win1` (lightsOn).
- Kendi kendine test (`selfTest`): her bacak için `legBottom >= landTop(x)` (karaya giriyor), `y(192) === 76`, `y(92) === 44`, `y(292) === 44`, iki yan halat ucu için `endY >= landTop(endX)`.
- **Yapı ayak izi kuralı (genel):** aynı katmandaki yapıların x aralıkları KESİŞMEZ. Her yapı çizilirken `{name, x0, x1, layer}` kaydı `FOOTPRINTS` dizisine eklenir; `selfTest` aynı katmanda kesişen çiftleri hata olarak döndürür. Sol yakada şu aralıklar evlere KAPALI: **13–47** (L cami + minareler), **54–66** (Galata), **76–100** (tabliye çıkışı + sol kule). Sağ yakada **284–300** (sağ kule) ve **322–346** (tabliye çıkışı + yan halat ucu).

### 6.5 Cami (`drawMosque(cx, poly, size, minaretCount, lit)`)
Boyut tablosu (px):

| size | gövde g×y | kasnak g×y | ana kubbe r | yarım kubbe r / ofset | köşe kubbe r / ofset | minare ofset / genişlik / boy | şerefe yükseklikleri (tabandan) |
|---|---|---|---|---|---|---|---|
| L | 26×10 | 18×2 | 8 | 5 / ±9 | 2 / ±12 | ±15 / 2 / 36 | 24, 30 |
| M | 18×7 | 12×1 | 6 | 3 / ±6 | — | ±11 / 2 / 26 | 18 |
| S | 12×5 | 8×1 | 4 | — | — | ±8 / 1 / 18 | 13 |

- Gövde tabanı `base = groundBase(poly, cx - gw/2, cx + gw/2)`; gövde `y ∈ [base - gy, base]` dolu (`bldA`), üst satır `bldC`.
- Kasnak gövde üstünde ortalı; ana kubbe `fillDomePx(cx, kasnakÜst, r, bldB, bldRim, sunSide)`; yarım kubbeler gövde üstünde `cx ± ofset`, köşe kubbeler de öyle.
- Alem: ana kubbe tepesinin üstünde 1×2 px + üstte 1 px (`bldC`).
- **Minare:** tepeler simetrik olsun diye ORTAK tepe: `mTop = base − boy` (base = cami gövde tabanı); her minarenin alt ucu `max(base, landTop(poly, mx) + 1)`'e kadar uzar (yamaçta boşluk kalmaz, tepeler aynı hizada). Gövde `w`, şerefeler o yükseklikte `w+2` genişlik 1 px çıkıntı. Külah: gövde tepesinden yukarı L/M'de genişlik 2 iki satır + genişlik 1 üç satır; S'de genişlik 1 dört satır. Güneşe bakan kenar 1 px `bldRim`.
- Minare sayısı 4 ya da 6 ise ek minareler ±(ofset−4) ve ±(ofset−8), boyları %80 ve %65.
- Pencereler (lit): gövde ortasında, her 3 px'de bir 1 px `win1`/`win2` dönüşümlü (deterministik).
- Yerleşim: sol yakada **L cami cx=30** (ayak izi 13–47), sağ yakın karada **S cami cx=312, 1 minare (cx+8)** (ayak izi 304–321), Çamlıca tepesinde (p 0.8) **M cami cx=268, 6 minare** (minareler ±11, ±7, ±3 → ayak izi 255–281; Çamlıca camii). Böylece iki cami üst üste binmez ve ikisi de güvenli alanda (40..344) — sol L cami hariç, o kırpılırsa da sorun değil.

### 6.6 Galata Kulesi (`drawGalata(x=60, poly=solKara)`)
- `base = groundBase(poly, 55, 65)`; gövde x **56–64** (9 px), y `base-26 .. base` dolu `bldA`; her 6 satırda bir taş bandı satırı `bldC`; sağ kenar 1 px `bldRim` (güneş sağda).
- Pencere bandı: y `base-22`, x 57, 60, 63 → 1 px `win1` (lit).
- Balkon çıkıntısı: y `base-27`, x 55–65 (11 px) `bldC`.
- Külah (kenar düz, merdiven profil): balkonun üstünden yukarı satır genişlikleri `[11,9,9,7,7,5,5,3,3,1,1]`, cx=60 ortalı, renk `bldB`, sağ uç pikseli `bldRim`. En üstte 1 px `bldC` uç.
- GALATA HİZASI'nda kulenin balkonu martı hizasına gelir: balkon y = base−27 ≈ 40 → `GALATA.cam = 96 − 40 = 56` (zones.js'te bu değer; selfTest `balkonY + cam = 96 ± 3` kontrol eder).

### 6.7 Çamlıca Kulesi (`drawCamlicaTower(x=334, poly=camHill)`, p 0.8)
- `base = landTop(camHill, 334) + 1` (≈ 59). Gövde: y `base` → `-14` arası; y > 30 iken genişlik 4 (x 332–335), y ≤ 30 iken genişlik 2 (x 333–334). Renk `bldB`, sol kenar `bldRim` (güneş solda).
- Kapsül (pod): x 328–339, y **−22 .. −14** (9 satır): üst 2 satır genişlik 8 (x 330–337), orta 5 satır genişlik 12, alt 2 satır genişlik 8. Ortadaki satırda her 2 px'de pencere `win3` (lit).
- Anten: x 333, y −40 .. −23, 1 px; tepede (333, −41) `red` yanıp söner.
- Kule ekranın üstünden taşar (cam 0'da kapsül görünmez) — bilinçli: oyuncu yükseldikçe kule tamamen görünür. ÇAMLICA bölgesinde kapsül martı hizasında: `96 = -18 + 140*0.8` ✓ (selfTest ±4).
- Çam ağaçları (`drawPine(x, base, h)`): Çamlıca tepesinde x = 290, 299, 308, 318, 350, 362, 374 (ayak izi x−3..x+3; kule 328–339 ve cami 255–281 ile kesişmez): üçgen katmanlar, h=7: satır genişlikleri `[1,3,3,5,5,7,7]` yukarıdan aşağı; sol yarı `pine1`, sağ yarı `pine2`, tepe pikseli ve güneşe bakan kenar `pine3`; gövde 1×2 `wood1`. Taban `landTop+1`.
- Uzak minik evler: x = 240, 246, 284, 342, 368 (4×3 kutu `bldC`, tabanı groundBase; %40'ında 1 px pencere ışığı) — çam, cami ve kule aralıklarına girmez.

### 6.8 Evler ve pencere ışıkları (`drawHouse(x, w, h, poly, seed)`)
- `base = groundBase(poly, x, x+w-1)`, gövde `y ∈ [base-h, base]` dolu (renk `[bldA,bldB,bldC][seed%3]`), güneşe bakan kenar 1 px `bldRim`.
- Çatı: gövde üstünden yukarı `r = 0..ceil(w/2)-1` satırlarında genişlik `w+2-2r` (1 px saçak taşması), renk `roof`, ilk satır `roofDark`. Bazılarına (seed%4===0) 1×2 baca `roofDark`.
- Pencereler: `w ≥ 6` ise 2 pencere (x+1, x+w-2; y base-h+2), değilse 1. `lit = lightsOn && fnv1a('h'+x+'-'+i) % 3 !== 0`; renk `win1`, `win2`, `win3` deterministik seçim; yanmayanlar `winOff`. Her 6–12 sn'de rastgele bir pencere 0.5 sn söner/yanar (canlılık).
- Ev listeleri (x, w, h):
  - Sol yaka: `(1,6,6) (6,6,5) (48,5,5) (67,8,6)` — kapalı aralıklar 13–47, 54–66, 76–100 (çatı saçağı dahil x−1..x+w, hiçbiri bu aralıklara girmez).
  - Sağ yaka: `(347,8,7) (356,7,6) (364,8,6) (373,8,7)` — kapalı aralıklar 284–300, 304–321 (S cami), 322–346.
- Her pencere ışığının altına suda yansıma: (pencere x, 104 + (pencere satırının kıyıya uzaklığına göre 1–4)) 1×2 px aynı renk `globalAlpha 0.5`, `Math.sin(t*3+x)` ile ±1 px titreşim.

### 6.9 Güneş, su yüzeyi, yansıma, kesit, su altı
- **Güneş** (p 0.3): `fillCirclePx(192, 92, 16)` 3 ton: r 16 `sunRim`, r 13 `sunMid`, r 9 `sunCore`. Retro kesikler: y = 96, 97 ve 100 satırlarında daire içi gökyüzü bant rengiyle silinir. Hale: r 17–22 arası halka `ditherRect` benzeri, renk `sunHalo`, level 0.25. Uzak tepeler güneşin altını örter (sıra §6.2).
- **Su yüzeyi** y 104–131 (cam 0): satır renkleri 104–109 `water1`, 110–115 `water2`, 116–122 `water3`, 123–131 `water4`; bant geçişlerinde 2 satır dithering. Yatay parıltı çizgileri: 18 adet, uzunluk 3–8 px, renk `waterHi`, x = `(baseX + t*speed) % 384`, speed 4–10 px/sn, y deterministik.
- **Güneş yansıma şeridi:** her satır y ∈ [104, 131]: `hw = Math.round((y-104)*0.35 + 3 + 2*Math.sin(t*3 + y*0.7))`; x ∈ [192-hw, 192+hw] aralığını 3 px dolu + 1 px boş kesikli çiz, kesik başlangıcı satıra göre `(y*2 + Math.floor(t*4)) % 4` kaydırılır. Renk: y<114 `refl1`, y<122 `refl2`, aksi `refl3`. Şeridin alpha'sı = BOĞAZ + GALATA + ÇAMLICA bölge ağırlıklarının toplamı (yükseldikçe söner).
- **Kesit çizgisi** (yarı ekran su altı kesiti): her x için
  `ky(x) = 132 + Math.round(1.5*Math.sin(x*0.12 + t*1.8) + 0.8*Math.sin(x*0.31 - t*2.4))`.
  y < ky → yüzey suyu (yukarıdaki satır renkleri); y == ky → `surfLine`; iki sinüs de > 0.6 ise ky−1'de `foam` köpük pikseli; y > ky → su altı.
- **Su altı (cam 0)** y 133–216: bantlar 133–150 `uw1`, 151–170 `uw2`, 171–190 `uw3`, 191–216 `uw4`, aralarda 2 satır dithering.
  - **Işık hüzmeleri:** 5 adet, üst x = 60, 130, 200, 260, 330; her biri paralelkenar: üst genişlik 10, alt genişlik 18, kesitten zemine kadar, alt uç +12 px sağa kayık; `x += 4*Math.sin(t*0.5 + i)`; renk `ray`, `globalAlpha = zone.rayAlpha`.
  - **Kıyı rafları (zemin):** sol raf üst profil `(0,196) (40,194) (80,198) (120,204) (150,212) (160,216)`, sağ raf `(384,192) (350,194) (310,200) (280,208) (266,216)`; her ikisi 400 px aşağı dolgu. Renk: üst 2 satır `sand`, altı `sandDark`, aşağı indikçe her 40 px'de bir ton koyu (`rock1`). Ortası (x 160–266) açık: derinlik karanlığına iner.
  - **Kayalar:** raflar üzerinde x = 30, 92, 300, 352; her kaya `fillCirclePx` kümesi (r 4, 3, 3 yan yana) 3 ton: `rock1` gövde, `rock2` üst yarı, `rock3` güneşe (yukarı) bakan üst 1 px. Taban groundBase.
  - **Yosun:** x = 14, 52, 70, 110, 292, 322, 340, 370; boy 14–26; her 2 px yükseklik segmenti `x + Math.round(2*Math.sin(t*1.5 + y*0.3 + i))`, 2 px genişlik, alternatif `weed1`/`weed2`, uç `weedDark`. Kök raf üstünde (landTop).
  - **Batık küçük nesneler** (sevimli, raf üstünde, groundBase): çay bardağı (x 120) — grid:
    ```
    .###.
    .#.#.
    ..#..
    .#.#.
    #####
    ```
    renk `fishSilver`, içi `amph1` (çay); simit (x 60): 5×5 halka `wood3`, susam pikselleri `win3`; küçük çapa (x 330): gövde 1×7 `rock3`, alt kollar 7 px yay, üst halka 3×2.
  - **Balıklar:** istavrit sürüsü 8 balık (sprite `##>` benzeri 4×2: gövde `fishSilver`, sırt `fishBlue`, göz `ink`), sürü merkezi x `= 100 + 60*Math.sin(t*0.2)`, y 160, her balık ofseti `(i*7 + 3*Math.sin(t+i), (i%3)*5)`; yönü hareket yönüne göre flipX. 1 lüfer 8×3 `fishBlue` gövde, `fishDark` sırt, ayrı rotada (y 185, x 0→384 30 sn'de, sonra geri).
  - **Kabarcıklar:** yosun diplerinden 0.8–2 sn aralıkla 1 px `surfLine` kabarcık, 8 px/sn yükselir, x'te ±1 sinüs, kesite gelince kaybolur.

### 6.10 Vapur, kayıklar, kuş sürüleri (yüzey canlıları)
- **Vapur** (`drawFerry(x, y=118)`; y = su hattı satırı, sprite bundan yukarı çizilir; 30 px genişlik):
  - y−1: x+2..x+27 `ferryDark` (su hattı şeridi)
  - y−2: x+1..x+28 `ferryHull`; y−3: x+0..x+29 `ferryHull`; burun (sağ) x+29 üst satırda 1 px eğim
  - y−6..y−4: x+4..x+25 `ferryCab`, alt satır `ferryShade`; y−5'te x+5, x+7, ... x+23 pencere: lightsOn ise `win1`/`win3` dönüşümlü, değilse `ferryWin`
  - y−8..y−7: x+8..x+21 üst güverte `ferryCab`, y−9'da x+8..x+21 her 2 px korkuluk noktası `ferryShade`
  - baca: x+14..x+16, y−12..y−9 `ferryFunnel`, en üst satır `ferryDark`; bacadan 2 sn'de bir 2×2 duman pikseli yükselip sağa kayar ve söner (`cloudLo`, alpha 0.6)
  - tüm siluete 1 px kontur `ink` (drawSprite outline)
  - iz: kıç tarafında (sol) y−1..y satırlarında 6–10 px `foam` titrek pikseller
  - Hareket: soldan sağa 8 px/sn, ekrandan çıkınca 6–12 sn bekleyip yeniden.
- **Kayıklar** (uzakta, y 107–110, 9×3): satır y−1 x+1..x+7 `wood1`, y−2 x+0..x+8 `wood2`, üstte 1×2 kişi `ink`, 1 px kürek çizgisi; 3 adet, 1.5–3 px/sn, hafif ±1 px inip kalkma.
- **Kuş sürüleri** (ekran katmanı, BOĞAZ/GALATA/ÇAMLICA ağırlığıyla): 2 sürü, her biri 5–7 kuş V düzeni; kuş = 3 px "v" (`(x-1,y-1) (x,y) (x+1,y-1)`, kanat çırpma karesinde `(x-1,y) (x,y) (x+1,y)`), renk `ink` alpha 0.8; 6–10 px/sn sağdan sola; y 30–60.

### 6.11 Martı sprite'ı (`drawGull`) — 18×10 karakter matrisi, sağa bakar
Palet: `W gullW, L gullL, G gullG, B gullB, Y gullY, y gullYd, E gullE`, `.` boş. Kontur `gullO` otomatik (drawSprite outline).
```
ORTA (süzülme)                 YUKARI                         AŞAĞI
..................             ...BB.............             ..................
...........WW.....             ....GG.....WW.....             ...........WW.....
..........WWWW....             .....GG...WWWW....             ..........WWWW....
.BBGGGGGGGWWEWYY..             ......GGGGWWEWYY..             ..........WWEWYY..
.GGGWWWWWWWWWWy...             .GGGWWWWWWWWWWy...             .GGGWWWWWWWWWWy...
.GGWWWWWWWWWW.....             .GGWWWWWWWWWW.....             .GGWWWWWWWWWW.....
....LLLLLLLL......             ....LLLLLLLL......             ....LLGGGGLL......
..................             ..................             .....GGG..........
..................             ..................             ....BB............
..................             ..................             ..................
```
- Sprite sol üst köşesi `(GULL_X - 9, GULL_Y - 5 + bob)`; `bob = Math.round(Math.sin(t*2))`.
- Animasyon: varsayılan ORTA; her 3–4 sn'de 1.2 sn kanat çırpar: kareler YUKARI → ORTA → AŞAĞI → ORTA, 8 kare/sn. `effect('perfect')` → 0.9 sn hızlı çırpma (12 kare/sn).
- DİP'te `cam < −10` iken **dalış pozu**: ORTA matrisi saat yönünde 90° döndürülmüş (yeni[r][c] = eski[H−1−c][r], boyut 10×18, baş aşağıda) + her 0.3 sn martıdan 1 px kabarcık.
- ORTA KARAR'da martı sağa doğru uçar (zaten sağa bakıyor), vapur onun altında aynı x civarında (x = 170 + 6*sin(t*0.3)) eşlik eder.

### 6.12 Bulutlar (3 derinlik)
- Bulut = daire birleşimi: `{x, baseY, anchorCam, p, parts:[[dx,dy,r]...], speed}`; çizim: önce `cloudShadow` ile tüm dairelerin alt 2 satırı (+1 y kaydırılmış), sonra gövde `cloudMid` (uzak: `cloudLo`), sonra her dairenin üst 1–2 satırı `cloudHi`; dış kenar piksellerinde level 0.5 dithering ile gökyüzüne erime. Kontur yok.
- Deterministik üretim (seed 'bulut'): 
  - Gün batımı bulutları (anchorCam 0): 5 uzak (p 0.4, baseY 18–50, parça r 3–6), 3 orta (p 0.7, baseY 30–60).
  - BULUT DENİZİ (anchorCam 300): uzak katman 6 bulut p 0.4 baseY 60–90 geniş (r 6–10, 5–7 parça); orta 6 bulut p 0.7 baseY 110–150; yakın 4 bulut p 1.3 baseY 170–215 (r 10–16), yakınlar martının ÖNÜNDEN geçer (§6.2 sırası).
  - GECE İSTANBUL'da (anchorCam 470) 3 ince koyu bulut bandı `#243266`/`#2f3f78`.
- Yatay kayma: uzak 1, orta 2, yakın 4 px/sn; ekrandan çıkan karşıdan girer.

### 6.13 Bölgeye özel canlı öğeler (koordinatlı)
- **GALATA HİZASI — martı sürüsü** (ekran katmanı, w): 3 küçük martı 7×4 (gövde `gullW`, kanat `gullG`, 2 kare çırpma), y 70–110, 12–18 px/sn soldan sağa veya sağdan sola, farklı fazlarda.
- **ÇAMLICA — uçurtmalar** (dünya, p 0.8): 2 adet, merkezleri cam 0'da (300, −30) ve (356, −52). Eşkenar dörtgen 7×9: satır genişlikleri `[1,3,5,7,5,3,1,...]` (9 satır: 1,3,5,7,7,5,3,1,1 → son satır 1), sol yarı `kiteA`, sağ yarı `kiteB` (ikincisi `kiteC`/`kiteB`), orta dikey çizgi `ink`. Kuyruk: alt uçtan 5 fiyonk, her biri 2×1, `(x + 3*Math.sin(t*3 + k), y + 3k)`. İp: uçurtma alt ucundan Çamlıca tepesindeki (330, landTop) noktasına 1 px, sarkmalı: `y = lerp + 6*Math.sin(π*u)` (u 0..1), renk `star` alpha 0.5. Uçurtma `±2 px` salınır.
- **BULUT DENİZİ — yolcu uçağı** (ekran, w): 18×6 sprite: gövde y 2–3 x 0–15 `#e6e3ee`, burun x 16–17 tek satır, kuyruk x 0–2 y 0–1, kanat x 6–10 y 4–5 `#c9c5d6`, pencere y 2'de x 3..13 her 2 px `ferryWin`; seyir ışıkları: kanat ucu (8,5) `red`/`green` 1 Hz yanıp söner; kontur `ink`. y 40, x −20 → 404, 30 px/sn, her 9 sn'de bir. Arkasında iz: 1 px `cloudHi` çizgi, geçilen her x'te alpha 0.6'dan 4 sn'de 0'a.
- **GECE İSTANBUL — şehir ışıkları halısı** (ekran, alttan kayarak girer: `y0 = 170 + (1-w)*60`): y0..216 `cityBase` dolgu; üzerinde deterministik nokta ışıklar yoğunluk %8 (`city1` %60, `city2` %30, `city3` %10), %5'i yavaş kırpışır. Boğaz şeridi: her satır için `bx = 192 + 40*Math.sin(y*0.05)`, `[bx-10, bx+10]` ışıksız `#060a1a`. İki köprü: y0+12 ve y0+28 satırlarında Boğaz şeridini keserek `city3` 1 px kesikli ışık çizgisi (her 2 px). Üst kenarında 3 satır sis dithering `#2f3f78` level 0.5.
- **AY IŞIĞI — hilal ay** (ekran, üstten girer: `y = 50 - (1-w)*80`): `fillCirclePx(300, y, 14, moon)`, gölge kenarı `moonShade` (sol alt yarım halka 2 px), sonra `fillCirclePx(305, y-3, 12, o anki gökyüzü rengi)` ile oyarak hilal; hale: r 15–20 `moonGlow` level 0.3.
- **Yıldızlar** (ekran, `zone.starAlpha` karışımı): 140 yıldız deterministik; %90 1 px `star`, %10 artı şekli (merkez + 4 komşu, komşular alpha 0.5); her biri `0.5 + 0.5*Math.sin(t*rate + phase)` parıltı. Yıldızlar y < 150 aralığında.
- **Yıldız kayması** (AY IŞIĞI w > 0.5): 4–7 sn'de bir; başlangıç x 60–330, y 10–60; yön (−1, 0.45) normalize, 140 px/sn; iz 8 px, uzaklaştıkça alpha 1→0; 0.8 sn ömür.
- **Uydu**: 1 px `star` alpha 0.8, y 24, 6 px/sn soldan sağa.
- **SIĞLIK** (dünya, anchorCam −110): sol/sağ kaya rafları §6.9'dakilerdir (cam −110'da y ≈ 84–106'ya çıkarlar); ek olarak raf altı kaya duvarı: raf poligonunun dolgusu aşağı indikçe `rock1` → `#1e3346`, dikey 1 px doku çizgileri her 5 px `rock2` alpha 0.3. Midye kümeleri: kayaların yanında 2×3 ovaller `#1d2433` + 1 px `rock3` parıltı, 6 küme. İstavrit sürüsü 14 balık (ekran katmanı).
- **AKINTI**: akıntı çizgileri (ekran) 30 adet, uzunluk 6–14 px, 1 px `surfLine` alpha 0.15, hız −40..−70 px/sn (sola, alt akıntı kuzeye); palamut/lüfer sürüsü 12 balık 7×3 `fishBlue`/`fishDark`, sağdan sola; zincirli çapa (dünya, anchorCam −250, p 1): x 120, zincir y −400'den 120'ye, halkalar dönüşümlü 1×2 ve 2×1 `#4a5060`; çapa (120,120): gövde 1×12, alt yay 11 px (y = 132 − round(4*(1-((dx)/5)^2))), uçlar 2 px yukarı, üst çubuk 7×1, renk `#5a6070` + pas pikselleri `#8a5a3a`; ±2 px salınım.
- **BATIK** (dünya, anchorCam −400, p 1): sol kaya çıkıntısı üst profil `(0,170) (60,166) (130,172) (180,180) (200,216)`, 400 px dolgu `rock1`. Üzerinde batık tekne: omurga y 168, x 26–136, 2 px `wood1`; 7 kaburga x = 30, 46, 62, 78, 94, 110, 126: her biri (xi, 168)'den (xi+6, 140)'a çeyrek elips yay, 2 px, `wood2`, güneş yok → üst kenar 1 px `wood3`; kırık direk (80,160)→(110,120) 2 px `wood1`. Amforalar (150,176) ve (162,178), grid 5×9:
  ```
  .#.#.
  .###.
  ..#..
  .###.
  #####
  #####
  .###.
  .###.
  ..#..
  ```
  renk `amph2`, sol kenar `amph1`, alt 2 satır `amph3`; biri 1 px eğik. Sandık (60,160) 8×6 `wood2`, köşe pikselleri `win2` (pirinç). 3 balık kaburgalar arasında saklanıp çıkar.
- **KARANLIK DİP** (dünya, anchorCam −560, p 1): tam genişlik zemin, profil `y = 196 + Math.round(3*Math.sin(x*0.05) + 2*Math.sin(x*0.13))`, `#1a2a36`, birkaç soluk kaya `#2c3a4c`. Ekran katmanları: 4 denizanası (çan 7×5: satırlar 3,5,7,7,7; `jelly` alpha 0.6; 4 dokunaç 1 px dalgalı 6–10 px; 1.5 sn nabız: çan 1 satır daralıp genişler; hale r 6 `jelly` level 0.15 dithering; 3–6 px/sn yukarı süzülür); deniz karı 60 parçacık 1 px `snow` alpha 0.4, 3–6 px/sn aşağı; ışıklı küçük balık sürüsü 6 adet 2 px `jelly`.

### 6.14 ORTA KARAR yatay sahnesi
- Yüzey sahnesi kullanılır (gökyüzü, güneş, su, kesit, su altı, vapur, kayıklar), **sabit köprü ve iki yaka YERİNE** kayan Avrupa kıyısı:
  - Kıyı profili (dünya x = wx): `shoreTop(wx) = 72 + Math.round(10*Math.sin(wx*0.011) + 5*Math.sin(wx*0.037))`, ekran x = wx − camX; kıyı y 103'e kadar, 300 px aşağı dolgu `land`, üst kenar `landRim`. Kıyı ekranın SOL %70'ini kaplar: bunun için kara, ekran x ≤ 270 + 40*sin(wx*0.004) iken çizilir; sağ tarafta açık su + uzak Anadolu tepeleri (p 0.3, `farHill`, y 94–103).
  - Evler kıyı boyunca her 9–14 wx'te bir (deterministik), §6.8 kuralı (taban = groundBase(shoreTop)).
  - Durak simgesi `wx = durak.camX + 150` noktasında (ekran x ≈ 150 durakta): EMİNÖNÜ → `drawMosque(L, 2 minare)` + alçak Galata Köprüsü (y 98–100 tabliye, altında her 12 px'de 3 px genişlik kemer boşluğu, x durak+190..durak+300); BEŞİKTAŞ → saat kulesi (6×26: 4 kat, her kat 1 px daralır, en üstte saat 2×2 `win3`, sivri tepe 3 satır) + iskele binası (24×8 düz çatı, 3 px ayaklar suya iner y 103–106, pencereler); ORTAKÖY → `drawMosque(M, 2 minare)` kıyıda (taban 101) + arkada p 0.6 uzak köprü (§6.4 köprünün 0.6 ölçekli hâli: tüm sayılar 0.6 ile çarpılıp yuvarlanır, kuleler kıyı profiline oturur); BEBEK → 3 yalı (20×14, 2–3 kat, renkler `wood3`/`#c9a27a`/`#e8e2d8`, beyaz pencere çerçeveleri, düz saçak), 4 park ağacı (yuvarlak taç r 4 `pine2`/`pine3`), demirli 3 kayık; RUMELİ HİSARI → yamaç boyunca sur (yükseklik 6 px, üstte her 3 px'de 2×2 mazgal dişi), 3 yuvarlak kule (g×y: 12×34, 10×26, 14×30; tepede konik koyu çatı `#3a2a3a` 4 satır), arkada p 0.6 uzak köprü; SARIYER → 4 renkli balıkçı teknesi (16×7, gövde `kiteA`/`kiteC`/`win2`, kabin beyaz, direk 1×6), ormanlı tepeler (çam sırası), durak+250'den sonra kıyı biter, sağda açık deniz ve daha büyük dalgalar (kesit genliği ×1.5).
  - Her durak simgesinin yanında küçük iskele tabelası: 22×7 koyu levha, PixelFont ölçek 1 ile durak adı kısaltması değil tam adı sığmazsa yazma; tabela yalnız şekil (ad banner'da görünür).

### 6.15 Efektler
- `perfect`: 12 parıltı, martı merkezi etrafında r 14'te dönen (1.2 sn, 2 tur), artı şekilli 1–2 px `moon`/`refl1`; + hızlı kanat çırpma.
- `good`: 6 parıltı, 0.8 sn.
- `weak`: 0.5 sn boyunca her 50 ms'de x ±1 sallanma, kanat ORTA.
- `pass`: martı 8 px alçalır (passOffset), 1.5 sn'de toparlanır; 4 gri duman pikseli `#8a8698`.

### 6.16 Ekran görüntüsü kontrol modu
- `index.html?shot=<mod>:<bölgeIndeksi>` → game.js `body.classList.add('shot')` (CSS: `.shot #ui{display:none}`), `Scene.setMode(mod)`, `Scene.debug({mode, zoneIndex, freezeTime: 2.0})` (kamera anında bölge cam'ına, zaman 2.0 sn'de dondurulur — canlıların konumu deterministik), sağ altta küçük DOM kutusu: `HATA: n · SELFTEST: ok|<ilk hata>`.
- `?shot=menu`, `?shot=question`, `?shot=result:zirve:0` (1. soru, 0. cevap seçilmiş gibi sonuç paneli), `?shot=end:zirve` (sahte 7 sonuçla özet), `?shot=cine:zirve` (sinematik ekran): UI görünür kalır.
- `window.__ERRORS = []`; `window.addEventListener('error', e => __ERRORS.push(e.message))` game.js'in EN BAŞINDA.
- `tools/shots.ps1` (İşçi B yazar):
  ```powershell
  $edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
  $base = "file:///D:/mart%C4%B1/v2/index.html"   # 'ı' URL'de %C4%B1 olarak yazılmalı
  $out  = "D:\martı\v2\shots"; New-Item -ItemType Directory -Force $out | Out-Null
  $list = @('zirve:0','zirve:1','zirve:2','zirve:3','zirve:4','zirve:5','dip:1','dip:2','dip:3','dip:4',
            'orta:0','orta:1','orta:2','orta:3','orta:4','orta:5','menu','question','result:zirve:0','cine:zirve','end:zirve')
  foreach ($s in $list) {
    $f = Join-Path $out (($s -replace ':','_') + '.png')
    & $edge --headless=new --disable-gpu --hide-scrollbars --window-size=1920,1080 --virtual-time-budget=4000 "--screenshot=$f" "$base`?shot=$s"
  }
  ```
  (Edge yolu yoksa `C:\Program Files\Microsoft\Edge\Application\msedge.exe` dene.) Görüntüleri 1/4 ölçekte incele.

**Görüntü kontrol listesi (her görüntü için tek tek işaretle, rapora yaz):**
| Görüntü | Kontrol |
|---|---|
| zirve_0 | Köprünün iki kulesi kara yamacından yükseliyor, bacak altında boşluk/gökyüzü YOK; tabliye iki uçta karaya giriyor; ana halat düzgün U (parabol), ortada tabliyenin hemen üstünde; askı halatları düzenli; caminin kubbesi yarım daire, iki minare simetrik ve kubbeden uzun; Galata yamaçta, altında boşluk yok; evlerin hepsi zeminde; güneş yarı batık + suda kesikli yansıma şeridi; su altı kesiti ekranın alt ~%40'ı, ışık hüzmesi, yosun, balık, kaya, çay bardağı görünür; martı (192,96) merkezde, 1 px kontur |
| zirve_1 | Galata kule tepesi martıyla aynı hizada (±3 px); yakın martı sürüsü |
| zirve_2 | Çamlıca kapsülü martı hizasında, uçurtma ipi tepeye bağlı, çamlar zeminde |
| zirve_3 | 3 katman bulut, yakın bulut martının önünde, uçak + iz (zaman dondurulduğu için uçak görünmüyorsa freezeTime'ı uçağın ekranda olduğu ana ayarla) |
| zirve_4 | alttan şehir ışıkları halısı, karanlık Boğaz şeridi, köprü ışıkları; yıldızlar |
| zirve_5 | hilal ay (dolu daire DEĞİL), yoğun yıldız |
| dip_1..4 | kesit yukarıda/ekran dışında, su rengi bölgeye uygun, kaya rafları zeminli, zincirli çapa, batık tekne kaburgaları, karanlık dipte denizanası; martı dalış pozunda |
| orta_0..5 | her durağın simge yapısı ekranda, kıyı kesintisiz, yapılar zeminde, vapur martının altında |
| menu/question/result/cine/end | UI metinleri Türkçe karakterli, taşma yok, sahne arkada görünüyor, sağ altta `HATA: 0 · SELFTEST: ok` |

---

## 7. CEVAP AKIŞI (game.js + style.css)

Durum makinesi: `'menu' → 'intro' → 'question' → 'reveal' → 'result' → (sonraki soru 'intro' | 'cinematic' → 'summary') → 'menu'`.

1. **intro (0.9 sn):** ekran ortasında büyük yazı (mod ipucu: ör. `HERKESİN VERECEĞİ CEVABI VER.`) belirip söner; sonra tabela yukarıdan iner (0.35 sn). Sonra `question`.
2. **question:** odak cevap kutusunda; süre 30 sn başlar. GEÇ gizli.
   - Boş Enter: input 0.3 sn yatay sallanır, mesaj yok.
   - `matchAnswer` → `invalid`: **bilgi şeridi** (cevap kutusunun hemen üstünde, dock panelinin parçası): koyu `#2a2040` zemin, krem `#f3e6c8` yazı, 15 px, solunda `•`; metin `reason`. Kırmızı YOK. Süre durmaz, input içeriği kalır ve seçili hâle gelir (`select()`), `Sound.play('wrong')`. GEÇ görünür olur.
   - `none`: aynı şerit, metin `Bunu listede bulamadım. Başka türlü yaz ya da başka bir cevap dene.`
   - GEÇ: `SKIP_AFTER_SECONDS` (10 sn) dolunca veya ilk invalid/none'da dock'un sağ üst köşesinde 0.25 sn'de belirir. Kısayol: `Ctrl+Enter` (yalnız görünürken).
   - Son 5 sn: süre çubuğu `#f0a04b`, 0.5 sn nabız, her saniye `Sound.play('tick')`.
3. **reveal (geçerli cevap, ~2 sn):**
   - Input satırı gizlenir, yerine **kademe şeridi** (dock yüksekliğinde, kademe renginde zemin, `#1a1128` yazı): `{icon} {LABEL}  +{puan} PUAN`, alttan 0.25 sn kayar.
   - Aynı anda `Scene.setScore(toplam)` + `Scene.effect(tier.effect)` + ses (`perfect`/`correct`/`weak`); tabeladaki ilerleme kutucuğu kademe rengi + ikonla dolar; toplam puan sayaçla artar (0.6 sn).
   - Bölge değiştiyse banner sahnede oynar ve rozet güncellenir (`onZoneEnter`). Bölge değişiminde reveal süresi 2600 ms'ye uzar.
   - Enter reveal sırasında basılırsa doğrudan result'a geç.
4. **result:** sonuç paneli (ekranın alt-ortası, dock'un yerine, `min(560px, 90vw)`), tabelada ipucu satırı gizlenir:
   - Başlık şeridi: kademe renginde, `ikon + LABEL` solda, büyük `+X PUAN` sağda.
   - Cümle (§3 tablosu).
   - Liste başlığı mod `listTitle`; satırlar: `{sıra}. {LABEL}` + sağda gri yatay çubuk (`#5a5470`, genişlik = pay/maxPay) + `%40,3`. Oyuncunun satırı kalın, `(sen)` eki, çubuğu kademe renginde.
     - ZİRVE: ilk 5; oyuncu ilk 5'te değilse ilk 4 + oyuncu (5. satır).
     - DİP: en çok verilen 2 + en nadir 2 (oyuncunun dışında) + oyuncu, paya göre azalan sıralı; her satırın solunda küçük kademe etiketi (o satırın DİP kademesi, 1. harfler: `MÜK`, `ÇOK`, `İYİ`, `İDR`, `ZYF`, renkli).
     - ORTA: 3.–7. sıralar + oyuncu (aralık dışındaysa sona eklenir).
     - Süre doldu / GEÇ: ilgili modun listesi oyuncu satırı olmadan.
   - **MÜKEMMEL:** LABEL harfleri ayrı `<span>`'larda, her biri 60 ms gecikmeli 0.5 sn zıplama (translateY 0 → −8px → 0, sonsuz değil 2 tekrar); panel çerçevesinde 1.2 sn altın parıltı (`box-shadow` 0 → `0 0 0 3px #ffcc4d, 0 0 24px #ffcc4d88` → 0, 2 tekrar); sahnede parıltı halkası (Scene.effect zaten).
   - **ZAYIF:** panel başlığı 0.4 sn hafif sallanır; martı sallanır (Scene).
   - **Süre doldu:** gri şerit `⌛ SÜRE DOLDU  +0 PUAN`, cümle `Süre doldu.`, `Sound.play('timeout')`.
   - Buton: krem `#f3e6c8` zemin, koyu yazı, `SONRAKİ SORU ⏎`; son soruda `PUANIMI GÖR ⏎`. Enter çalışır.
5. Ara kayıt: her sonuçtan sonra günlük modlarda ilerleme depolamaya yazılır (§9).

---

## 8. EKRANLAR VE YERLEŞİM

### 8.1 Genel
- `body`: margin 0, overflow hidden, zemin `#1a1128`, yazı `ui-monospace, "Cascadia Mono", Consolas, monospace`, büyük harf (`text-transform` KULLANMA; Türkçe için JS'de `toLocaleUpperCase('tr-TR')`), harf aralığı 0.06em.
- `canvas#scene` (sahne, §5.1) + `div.crt` + `div#ui` (fixed inset 0, flex, sahnenin üstünde).
- Paneller: zemin `rgba(26,17,40,.92)`, 3 px kenar `#f3e6c8`, iç gölge `inset 0 -4px 0 rgba(0,0,0,.35)`, köşe 0 (piksel), `box-shadow: 4px 4px 0 #0b0714`.

### 8.2 Soru ekranı
- **Tabela** (üst orta, `top: 2.5vh`, `width: min(680px, 92vw)`): ipe asılı — üst kenardan 18 px yukarı iki zincir (`::before/::after`, 2 px genişlik, `repeating-linear-gradient` 3 px dolu/2 px boş, `#f3e6c8`, x %18 ve %82); kart `rotate(-1.2deg)`, 4 sn'lik ±0.6deg salınım animasyonu. İçerik:
  - Satır 1: 7 ilerleme kutucuğu (18×18, 2 px kenar, boş: `#3a3050`; dolu: kademe rengi + ikon) — sağda `120 PUAN`.
  - Satır 2: `▲ ZİRVE · SORU 3/7` (mod rengi `#ffd27a`).
  - Soru metni 26 px, kalın, 2 satıra kadar.
  - İpucu `#ffd27a` 13 px (mod `hint`).
  - Süre çubuğu kartın içinde altta 6 px, `#ffd27a` → son 5 sn `#f0a04b`; sağında saniye.
- **Rozet** (sol üst, 12 px kenar boşluk): `▲ GALATA HİZASI  +60 m` (DİP'te ▼, ORTA'da ◆ ve km). Bölge değişiminde 0.4 sn parlayıp güncellenir.
- **Ses düğmesi** (sağ üst): `SES: AÇIK` / `SES: KAPALI` (kısayol `M`).
- **Dock** (alt orta, `bottom: 3vh`, `width: min(680px, 92vw)`): bilgi şeridi (gizli/açık, yükseklik animasyonu) + input satırı: input (3 px `#ffd27a` kenar, zemin `#0f0b1a`, krem yazı 20 px, placeholder `CEVABIN…`, maxlength 64) + `GÖNDER`. GEÇ dock'un sağ üst köşesinde, dock'un dışına taşan küçük düğme (`top:-34px; right:0`).

### 8.3 Ana menü
- Üstte **logo**: `<canvas id="logo" width="120" height="40">`, CSS ölçek ×5 (pixelated). PixelFont ölçek 3 `MARTI`, ortalı; dolgu satır gradyanı `['#ffe7a8','#ffe7a8','#ffc46b','#ffc46b','#f2884f','#f2884f','#d9603f']`, kontur `#1a1128`, gölge (+2,+2) `#5a2a5e`; son harf `I`'nın tepesine 18×10 martı sprite'ı `Scene.drawGullSprite(logoCtx, x, y, frame)` ile (1:1) konar ve 4 sn'de bir kanat çırpar. Altında DOM alt başlık `HERKESİN VERECEĞİ CEVABI BUL` + küçük `MARTI #N · 22.11.2026`.
- Arka planda sahne `Scene.setMode('menu')` (yüzey, gün batımı, martı süzülür).
- **Mod kartları** (3'lü yatay sıra, her biri 200×150): büyük ikon (▲ ▼ ◆), ad, tek satır açıklama, alt durum satırı: oynanmadıysa `OYNA ⏎`; yarımdaysa `DEVAM ET 3/7`; bittiyse `✓ 480/700` (kart soluk, tıklanınca o günün özetini açar, yeniden oynatmaz).
- **SINIRSIZ** kartı (geniş, altta): `∞ SINIRSIZ` + mod seçici 3 küçük düğme `ZİRVE / DİP / ORTA` (seçili olan dolu) + `OYNA`.
- **İstatistik şeridi**: `OYNANAN GÜN 5 · SERİ 3 · EN UZUN SERİ 4 · EN İYİ: ZİRVE 560 · DİP 430 · ORTA 390 · SINIRSIZ TUR 12`.
- Klavye: `1/2/3` modlar, `4` Sınırsız, ok tuşları kartlar arası odak, Enter seçer, `M` ses.

### 8.4 Bitiş: sinematik → özet
- **Sinematik** (`cinematic`): tabela ve dock 0.4 sn'de kaybolur; sahne bulunulan bölgede kalır; ortada (y %38) bölge adı DOM 64 px kalın, harf aralığı 6 px, `text-shadow: 4px 4px 0 #1a1128`; altında `480 PUAN` 36 px `#ffd27a`; altında rozet etiketi; en altta yanıp sönen `DEVAM İÇİN TIKLA / ENTER`. Ses `Sound.play('finish')`. Tık veya Enter → özet.
- **Özet** (`summary`, orta panel `min(960px, 94vw)`, iki sütun):
  - Sol: başlık `BUGÜNÜN ZİRVESİ` (DİP: `BUGÜNÜN DİBİ`, ORTA: `BUGÜNÜN ORTA KARARI`, SINIRSIZ: `SINIRSIZ TUR`) + büyük `480/700 PUAN`; seri kutusu `🔥 3 GÜNLÜK SERİ` (ilk gün: `SERİN BAŞLIYOR`); 7 satırlık liste: soru metni (kısaltılmış, 1 satır, `…`), `SEN: {yazdığın}` + eşleşen etiket küçük gri `→ {label}` (aynıysa yazma), sağda kademe etiketi (renkli) + `+70`.
  - Sağ: `BUGÜNKÜ MODLAR`: üç satır `▲ ZİRVE ✓ 480` / `▼ DİP —` / `◆ ORTA KARAR —`; büyük buton `SIRADAKİ: DİP ▼ — EN NADİR CEVAP` (sıradaki oynanmamış günlük mod, MODE_ORDER sırasıyla; hepsi bittiyse buton `YARIN YENİ SORULAR` pasif ve yanında `SINIRSIZ OYNA`); `PAYLAŞ` (panoya kopyalar, `KOPYALANDI ✓` 2 sn); `ANA MENÜ (ESC)`.
- **Paylaş metni** (Wordle tarzı):
  ```
  MARTI #1 · ZİRVE ▲ · 22.11.2026
  🟨🟩⬜🟥🟩🟨🟧
  480/700 · GECE İSTANBUL
  🔥 3 gün
  ```
  Sınırsızda ilk satır `MARTI · SINIRSIZ (ZİRVE ▲)`, tarih ve seri satırı yok. Kopyalama: `navigator.clipboard.writeText`, olmazsa gizli textarea + `document.execCommand('copy')` (v1'deki gibi).

---

## 9. DEPOLAMA (`localStorage`, her erişim try/catch)

Anahtar `marti.v2` (test/shot/auto modunda `marti.v2.test`). Okuma başarısızsa bellek içi nesneyle devam et (oyun bozulmaz).
```js
{
  version: 2,
  sound: true,
  unlimitedMode: 'zirve',
  days: {
    '2026-11-22': {
      zirve: { done: true, score: 480, zoneName: 'GECE İSTANBUL',
               results: [ { qid:'q07', raw:'inecek var', label:'İnecek var', tierId:'mukemmel', points:100 }, ... ] },
      dip:   { done: false, results: [ ...3 sonuç ] }      // yarım tur: menüde DEVAM ET 3/7
    }
  },
  stats: { playedDays: 5, streak: 3, bestStreak: 4, lastPlayedDay: '2026-11-22',
           best: { zirve: 560, dip: 430, orta: 390 }, unlimitedRounds: 12 }
}
```
- Seri: bir günlük mod BİTİNCE: `lastPlayedDay === dayKey` → değişmez; `=== dün` → `streak+1`; aksi → `streak = 1`; `playedDays` yalnız günün ilk bitişinde +1; `bestStreak = max`.
- Yarım tur: her sonuçtan sonra `results` güncellenir; menüden devam edince kalan sorudan başlar, toplam puan ve sahne (`setScore(toplam, {instant:true})`) geri yüklenir.
- Günlük kayıtlar 60 günden eskiyse menü açılışında silinir.

---

## 10. matcher.js v2

v1 mantığı KORUNUR (normalize → aksansız anahtar → ek temizleme → Levenshtein toleransı: ≤4 harf 0, 5–8 harf 1, 9+ harf 2; öncelik geçerli → geçersiz → bulunamadı). Eklenecekler:

1. **Ön dizin (cache):** her soru için ilk çağrıda `question._mIndex` oluştur: her grup/invalid için anahtar kümeleri (normal, aksansız, ek temizlenmiş, içerik anahtarı). Sonraki çağrılar dizini kullanır.
2. **Genişletilmiş ek temizleme** (son kelimeye, en fazla 2 katman, kök en az 3 harf kalmalı; tek harfli `a/e/ı/i/u/ü` ekleri yalnız kalan kök ≥4 harfse):
   çoğul `lar ler`; iyelik/belirtme `ları leri sı si su sü yı yi yu yü ı i u ü`; yönelme `ya ye a e`; bulunma `da de ta te`; ayrılma `dan den tan ten`; vasıta `la le yla yle`; tamlayan `nın nin nun nün ın in un ün`; 1. tekil iyelik `ım im um üm`; `mız miz muz müz`. Uzun ekler önce denenir.
3. **Yardımcı fiil / içerik anahtarı geçişi** ("alışveriş yapmak" ↔ "alışverişe gitmek"):
   - Son kelimeden fiil çekimlerini at: `mak mek maya meye mayı meyi ıyorum iyorum uyorum üyorum ıyor iyor uyor üyor arım erim ırım irim ar er dım dim tım tim dı di tı ti alım elim` (uzun önce).
   - Kalan kök `HAFIF_FİİLLER = ['yap','et','git','gid','ol','eyle','kıl','gez']` içindeyse o kelimeyi tamamen düşür.
   - Kalan her kelimeye 2. maddedeki ek temizleme; boşlukla birleştir = **içerik anahtarı**. Yalnız içerik anahtarı ≥4 harfse kullanılır, Levenshtein YOK (tam eşleşme).
   - Öncelik sırası: (a) geçerli normal geçişler, (b) geçersiz normal geçişler, (c) geçerli içerik anahtarı, (d) geçersiz içerik anahtarı, (e) kelime geçişi, (f) `none`.
4. **Kelime geçişi (e):** girdi çok kelimeliyse, `DOLGU = ['bir','çok','en','ve','ile','de','da','ki','şey','bence','herhalde','yani','tabi','tabii']` atıldıktan sonra kalan kelimelerden TAM OLARAK BİRİ tek kelimelik bir alias'a (normal/aksansız/ek temizlenmiş anahtarla) eşleşiyor ve bu eşleşme TEK bir gruba gidiyorsa → o grup (`via:'token'`). İki farklı gruba giderse eşleşme yok.
5. Dönüşe `via` alanı ekle (hata ayıklama ve test).
6. `buildKeys(phrase)` dışa açılır (tools/check.js çakışma kontrolü kullanır).
7. **runMatcherTests():**
   - v1'deki elle yazılmış vakalar korunur; `qId: 1..4` → `'q01'..'q04'`; v2 verisinde etiket değiştiyse vakayı yeni etikete güncelle.
   - Her soru için `question.tests` dizisindeki her vaka çalıştırılır: `expect` bir etiket (geçerli ve o etiket), `'invalid'` ya da `'none'`.
   - Sahte (fixture) soru ile içerik anahtarı testleri (veriye eklenmez, matcher.js içinde):
     ```js
     { id:'fx', text:'test', answers:[ {label:'Alışverişe gitmek', share:50, aliases:['alışveriş']},
                                       {label:'Yemek yapmak', share:30, aliases:['yemek']},
                                       {label:'Dizi izlemek', share:20, aliases:['dizi']} ], invalid:[{aliases:['uyumak'], reason:'x'}] }
     // vakalar: 'alışveriş yapmak'→Alışverişe gitmek, 'alisverise gidiyorum'→Alışverişe gitmek, 'yemek yaparım'→Yemek yapmak,
     //          'akşam dizi izlerim'→Dizi izlemek (token), 'uyumak'→invalid, 'zıplamak'→none
     ```
   - Sonuçları `console.table` ile yaz; başarısızları ayrıca `console.error`; hepsi geçerse `true`.

---

## 11. SES — `sound.js` (WebAudio, dosya yok)

- `AudioContext` ilk kullanıcı etkileşiminde (`Sound.unlock()`, game.js ilk tık/tuşta çağırır) oluşturulur; yoksa sessiz devam (try/catch).
- Ana kazanç 0.15; her nota: `OscillatorNode` + `GainNode` zarfı (attack 5 ms, release 40 ms).
- Sesler:
  | ad | tarif |
  |---|---|
  | `correct` | square, C5 (523 Hz) 80 ms → E5 (659) 80 ms |
  | `perfect` | square arpej C5 E5 G5 C6 her biri 70 ms + son notada triangle C6 200 ms |
  | `weak` | triangle E4 (330) 90 ms → C4 (262) 120 ms |
  | `wrong` | triangle A3 (220) 70 ms → F3 (175) 110 ms, kazanç ×0.6 (sakin) |
  | `tick` | square 1200 Hz 30 ms, kazanç ×0.4 |
  | `timeout` | square G4 → D4 → G3, her biri 120 ms |
  | `zone` | sawtooth frekans süpürmesi 300 → 900 Hz 400 ms (`exponentialRampToValueAtTime`) + ardından 3 rastgele yüksek "parıltı" notası (1500–2500 Hz, 40 ms) |
  | `dive` | sawtooth 700 → 180 Hz 500 ms, `BiquadFilter` lowpass 1200 Hz |
  | `finish` | square C5 E5 G5 E5 C6, 110 ms |
  | `click` | square 800 Hz 20 ms, kazanç ×0.3 (buton) |
- `setEnabled(false)` → hiçbir ses çalmaz; durum depolamaya (`sound`) yazılır.

---

## 12. SORU HAVUZU (42 soru) — veri kuralları

Her soru nesnesi:
```js
{ id:'q05', cat:'aile', text:'Annelerin en sık söylediği bir sözü söyle',
  answers:[ { label:'Üşüteceksin', share:17, aliases:['üşüteceksin','usuteceksin','hırkanı al','hirkani al','üstüne bir şey al','üşürsün', ...] }, ... ],
  invalid:[ { aliases:['günaydın','iyi geceler'], reason:'Bu bir selam; annelere özgü bir söz değil.' }, ... ],
  tests:[ {in:'üşüteceksin', expect:'Üşüteceksin'}, {in:'usuteceksin', expect:'Üşüteceksin'}, {in:'hirkani al', expect:'Üşüteceksin'}, {in:'günaydın', expect:'invalid'} ] }
```
**agy genişletme kuralları (ZORUNLU):**
1. Aşağıda verilen ilk cevapların SIRASI ve etiketleri korunur; payları ±0,5 içinde ayarlanabilir.
2. Her soru toplam **15–20 grup**; paya göre **KESİN azalan** sıralı (ardışık iki grup arasında en az **0,2** fark — eşit pay YOK, yoksa aynı paylı iki cevap farklı kademe alır); toplam pay **99,0–101,0**. Aşağıdaki tabloda eşit görünen paylar (ör. 12 / 12) verilen sırayla 0,2–0,5 farkla ayrıştırılır.
3. Uzun kuyruk: her soruda **en az 4 grup %0,1–%1,0** aralığında (gerçek, mantıklı, nadir ama geçerli cevaplar — DİP modu bunlarla oynanır), en az 3 grup %1–%5 aralığında. Aşağıdaki "kuyruk önerisi"ni kullan, gerekirse ekle.
4. Alias: grup başına **6–15**: aksansız hâl, yaygın ekli hâller (`çayı`, `çaya`), eş anlamlılar, kısaltmalar, yaygın İngilizce/yanlış yazımlar (`vatsap`, `whatsup`), sayı varyantları. Fiilli cevaplarda hem `-mak/-mek` hem çekimli hâl (`fal bakmak`, `fal bakarım`, `fal`). Bir alias İKİ grupta ya da hem grupta hem invalid'de OLAMAZ (tools/check.js yakalar). 3 harften kısa alias koyma.
5. `invalid`: **6–10** tane, soruya özel, konuya yakın ama yanlış şeyler; `reason` tek cümle, ≤90 karakter, sakin ton, "yanlış" kelimesi YOK. Örn. kahvaltı sorusu: `kahve` → `Türk kahvesi kahvaltıdan sonra içilir, kahvaltının olmazsa olmazı sayılmıyor.`
6. `tests`: **en az 4**: (1) doğru etiket, (2) aksansız ya da 1 harf yazım hatası, (3) ekli/eş anlamlı alias, (4) invalid; en az bir soruda `none`.
7. Etiket ≤26 karakter, Türkçe cümle düzeni (ilk harf büyük).
8. Paylar "tahmini" değerlerdir; README'de belirtilir.

### Soru listesi (ilk cevaplar ve tahmini paylar %)

**data/q01_10.js**
| id | kat. | Soru | İlk cevaplar (pay) | Kuyruk önerisi (%0,1–1) |
|---|---|---|---|---|
| q01 | yemek | Kahvaltıda olmazsa olmaz bir şey söyle | v1 verisi korunur (Çay 36,4 · Peynir 16,8 · Zeytin 11,2 · Yumurta 9,5 · Simit 6,4 · Ekmek 4,8 · Domates & Salatalık 3,6 · Menemen 2,8 …) | kuymak, pişi, katmer, gözleme, tahin-pekmez, hellim |
| q02 | gelenek | Bayramda büyüklerin söylediği bir söz söyle | v1 verisi korunur | "dersler nasıl", "boyun uzamış", "yemek ye zayıflamışsın", "askere ne zaman" |
| q03 | şehir | Vapurda yapılan bir şey söyle | v1 verisi korunur (Simit atmak / Simit yemek ayrımı: "simit atmak" alias'ları "martıya" içersin, "simit yemek" alias'ları "yemek" içersin, çakışma olmasın) | balık tutanları izlemek, yunus aramak, uyuklamak, tavla oynamak |
| q04 | kültür | Bir Türk dizisi söyle | v1 verisi korunur | Bizimkiler, Kavak Yelleri, Ekmek Teknesi, Şubat, Hayat Bilgisi |
| q05 | aile | Annelerin en sık söylediği bir sözü söyle | Üşüteceksin 17 · Yemek yedin mi 13 · Odanı topla 12 · Arkadaşın kuyuya atlasa sen de atlar mısın 10 · Eve gelince konuşuruz 8 · Sen bilirsin 6 · Ben sana demiştim 5 · Bu saatte nereye 4 | "dua et", "telefonu bırak", "çorap giy", "kapıyı kilitle" |
| q06 | gelenek | Misafire ikram edilen bir şey söyle | Çay 30 · Türk kahvesi 22 · Kolonya 10 · Lokum 8 · Kuruyemiş 6 · Kek / pasta 6 · Meyve 5 · Börek 4 | şerbet, ayran, kurabiye, kalem böreği, cezerye |
| q07 | şehir | Dolmuşta ya da otobüste sık duyulan bir söz söyle | İnecek var 26 · Arkaya doğru ilerleyelim 18 · Müsait bir yerde 15 · Parayı uzatır mısınız 10 · Bakiye yetersiz 8 · Kapı açılsın 6 · Biraz sıkışalım 5 | "şoför bey klima", "bu araç nereye gidiyor", "aktarma var mı" |
| q08 | şehir | Bir İstanbul semti söyle | Kadıköy 18 · Beşiktaş 14 · Üsküdar 10 · Taksim / Beyoğlu 9 · Fatih 6 · Bakırköy 5 · Sarıyer 4 · Eminönü 4 | Kuzguncuk, Balat, Moda (Kadıköy'e ALIAS DEĞİL ayrı grup), Rumelifeneri, Kilyos |
| q09 | yemek | Türk mutfağından bir tatlı söyle | Baklava 34 · Künefe 14 · Sütlaç 10 · Kazandibi 6 · Revani 5 · Lokma 5 · Aşure 4 · Tulumba 4 | höşmerim, kabak tatlısı, trileçe (yaygın, %1–3), keşkül, tavuk göğsü |
| q10 | şehir | Pazarda satıcının bağırdığı bir şey söyle | Gel abla gel 20 · Taze bunlar taze 15 · Ucuz ucuz 12 · Bal gibi 10 · Seç beğen al 9 · Tatmadan geçme 5 · Son fiyat 5 · Yer misin yemez misin 4 | "kilosu on lira", "domates domates", "kaçırma", "hepsi bir fiyat" |

**data/q11_20.js**
| id | kat. | Soru | İlk cevaplar (pay) | Kuyruk önerisi |
|---|---|---|---|---|
| q11 | spor | Bir Türk futbol takımı söyle | Galatasaray 30 · Fenerbahçe 28 · Beşiktaş 20 · Trabzonspor 9 · Başakşehir 3 · Bursaspor 2,5 · Göztepe 1,5 · Sivasspor 1,2 | Altay, Eskişehirspor, Kasımpaşa, Rizespor, Samsunspor, Karşıyaka |
| q12 | tatil | Tatile giderken mutlaka alınan bir şey söyle | Mayo 20 · Güneş kremi 16 · Şarj aleti 12 · Güneş gözlüğü 9 · Kitap 6 · Terlik 6 · Havlu 5 · Kimlik / pasaport 5 | şapka, ilaç çantası, deniz gözlüğü, şişme simit, tavla |
| q13 | gelenek | Düğünlerde mutlaka olan bir şey söyle | Halay 22 · Takı takma 18 · Gelin 10 · Düğün pastası 8 · Davul zurna 8 · Damat 6 · Yemek 6 · Kına 4 | gelin arabası süslemek, kapı önü bahşişi, ayakkabı yazısı, çiğ köfte |
| q14 | gelenek | Türk kahvesi içtikten sonra yapılan bir şey söyle | Fal bakmak 46 · Su içmek 15 · Lokum yemek 8 · Sohbet etmek 8 · Fincanı kapatmak 7 · Sigara içmek 4 · Dilek tutmak 3 | fincanı soğutmak, kalp çıkarmak, fincanı yıkamak, telveyi incelemek |
| q15 | okul | Öğretmenin sık söylediği bir söz söyle | Sessiz olun 22 · Defterleri çıkarın 12 · Bu sınavda çıkacak 11 · Zil öğretmene çalar 10 · Kitapları açın 7 · Velini çağıracağım 6 · Teneffüse çıkmıyoruz 5 · Bu sınıf ne olacak 5 | "tahtaya kalk", "dışarı çık", "sakızı at", "sıra arkadaşına bakma" |
| q16 | müzik | Bir Türk şarkıcı söyle | Tarkan 22 · Sezen Aksu 16 · Barış Manço 9 · Müslüm Gürses 7 · İbrahim Tatlıses 7 · Ajda Pekkan 6 · Hadise 4 · Kenan Doğulu 4 | Cem Karaca, Zeki Müren, Ferdi Tayfur, Neşet Ertaş, Teoman |
| q17 | yemek | Kışın içilen sıcak bir şey söyle | Salep 30 · Çay 20 · Boza 12 · Ihlamur 10 · Sıcak çikolata 8 · Çorba 5 · Kahve 5 · Adaçayı 4 | kuşburnu çayı, tarçınlı süt, zencefil çayı, sahlep (ALIAS, salep), elma çayı |
| q18 | çocukluk | Çocukların oynadığı bir sokak oyunu söyle | Saklambaç 28 · Yakan top 14 · Körebe 11 · Seksek 10 · İp atlama 8 · Top / futbol 7 · Misket 5 · Elim sende 5 | uzun eşek, istop, beş taş, birdirbir, mendil kapmaca |
| q19 | yöre | Karadeniz denince akla gelen bir şey söyle | Hamsi 30 · Yayla 12 · Yağmur 10 · Çay 10 · Horon 8 · Trabzon 6 · Uzungöl 5 · Kemençe 4 | Temel fıkraları, mısır ekmeği, kuymak, heyelan, Ayder |
| q20 | teknoloji | Telefonda en çok kullanılan bir uygulama söyle | WhatsApp 36 · Instagram 22 · YouTube 12 · TikTok 9 · Google / Chrome 4 · X / Twitter 4 · Spotify 3 · Trendyol 2 | hesap makinesi, e-Devlet, Yemeksepeti, Getir, Sahibinden |

**data/q21_31.js**
| id | kat. | Soru | İlk cevaplar (pay) | Kuyruk önerisi |
|---|---|---|---|---|
| q21 | iş | Geç kalınca söylenen bir bahane söyle | Trafik vardı 34 · Alarm çalmadı 22 · Otobüsü kaçırdım 12 · Rahatsızlandım 7 · Metro arızalandı 6 · Yağmur yağıyordu 4 · Anahtarı unuttum 3 | "kedim hastaydı", "vapur kalkmıştı", "asansörde kaldım", "elektrikler kesildi" |
| q22 | yemek | Tatlı hariç bir Türk yemeği söyle | Kebap 18 · Döner 14 · Mantı 11 · Lahmacun 10 · Kuru fasulye 9 · İskender 7 · Karnıyarık 6 · Dolma / sarma 6 | hünkârbeğendi, keşkek, tantuni, kokoreç, çiğ köfte, içli köfte (yaygın) |
| q23 | dil | Bir Türk atasözü söyle | Damlaya damlaya göl olur 18 · Sakla samanı gelir zamanı 12 · Ağaç yaşken eğilir 10 · Bugünün işini yarına bırakma 10 · Komşu komşunun külüne muhtaçtır 6 · Sabrın sonu selamettir 6 · Dost kara günde belli olur 6 · Üzüm üzüme baka baka kararır 5 | "ayağını yorganına göre uzat", "bin bilsen de bir bilene danış", "işleyen demir pas tutmaz" (son ikisi %1–3) |
| q24 | gelenek | İftar sofrasında olan bir şey söyle | Hurma 26 · Ramazan pidesi 22 · Çorba 16 · Zeytin 6 · Peynir 5 · Güllaç 5 · Su 4 · Hoşaf 4 | şerbet, tatlı, mercimek köftesi, top hurması (ALIAS) |
| q25 | ev | Evde sık kaybolan bir şey söyle | Kumanda 34 · Anahtar 22 · Telefon 10 · Çorap teki 10 · Şarj aleti 6 · Gözlük 5 · Toka 3 · Çakmak 3 | makas, tırnak makası, cüzdan, kulaklık, kalem |
| q26 | kültür | Bir Türk komedi filmi söyle | Hababam Sınıfı 26 · Recep İvedik 16 · G.O.R.A. 14 · Vizontele 8 · Düğün Dernek 6 · Neşeli Günler 5 · Tosun Paşa 4 · Kolpaçino 3 | Şabanoğlu Şaban, Davaro, Organize İşler, Hokkabaz, Arif v 216 |
| q27 | gelenek | Bayram sabahı yapılan bir şey söyle | El öpmek 34 · Bayram namazı 18 · Şeker yemek 10 · Harçlık almak 9 · Yeni kıyafet giymek 8 · Mezarlık ziyareti 6 · Bayram kahvaltısı 5 | kolonya dökmek, kurban kesmek, tatlı hazırlamak, telefonla bayramlaşmak |
| q28 | şehir | Bir İstanbul simgesi olan yapı söyle | Galata Kulesi 24 · Ayasofya 20 · Kız Kulesi 14 · Boğaz Köprüsü 10 · Sultanahmet Camii 9 · Topkapı Sarayı 6 · Dolmabahçe Sarayı 5 · Kapalıçarşı 4 | Rumeli Hisarı, Yerebatan Sarnıcı, Haydarpaşa Garı, Çamlıca Kulesi, Valens Kemeri |
| q29 | ev | Türk evlerinde çok bulunan bir eşya söyle | Çaydanlık 18 · Halı 14 · Nazar boncuğu 14 · Dantel örtü 10 · Kolonya 8 · Poşet dolu poşet 7 · Koltuk örtüsü 6 · Tespih 4 | semaver, cezve, sedir, duvar saati, çeyiz sandığı |
| q30 | yemek | Bir yaz meyvesi söyle | Karpuz 38 · Kiraz 14 · Kavun 12 · Şeftali 9 · Çilek 8 · Üzüm 6 · İncir 5 · Kayısı 5 | dut, erik, vişne, nektarin, böğürtlen |
| q31 | şehir | Taksici yolda hangi konuyu açar? | Trafik 24 · Siyaset 20 · Futbol 16 · Ekonomi / zamlar 14 · Hava durumu 6 · Memleket / nerelisin 5 · Eski İstanbul 4 · Yolcu hikâyeleri 3 | askerlik anıları, kira fiyatları, köprü geçişi, yapay zekâ |

**data/q32_42.js**
| id | kat. | Soru | İlk cevaplar (pay) | Kuyruk önerisi |
|---|---|---|---|---|
| q32 | genel | Kırmızı olan bir şey söyle | Elma 18 · Domates 14 · Gül 12 · Türk bayrağı 12 · Çilek 8 · Kan 7 · Kiraz 5 · Ateş 4 | itfaiye aracı, kırmızı halı, uğur böceği, nar, ruj |
| q33 | okul | Sınavdan önce yapılan bir şey söyle | Ders çalışmak 30 · Dua etmek 18 · Kopya hazırlamak 10 · Uykusuz kalmak 9 · Özet çıkarmak 6 · Stres yapmak 6 · Kahve içmek 5 · Kalem açmak 4 | nazar boncuğu takmak, uğurlu kalem, sabah kahvaltı yapmak, şans getirsin diye aynı tişörtü giymek |
| q34 | doğa | Bir deniz canlısı söyle | Yunus 20 · Köpekbalığı 14 · Ahtapot 13 · Balina 10 · Denizanası 9 · Yengeç 7 · Balık 6 · Midye 5 | denizatı, deniz yıldızı, fok, kalamar, vatoz, Akdeniz foku |
| q35 | ev | Akşam yemeğinden sonra yapılan bir şey söyle | Çay içmek 30 · Televizyon izlemek 22 · Bulaşık yıkamak 14 · Meyve yemek 9 · Yürüyüş yapmak 6 · Dizi izlemek 5 · Telefona bakmak 5 · Uyumak 4 | çekirdek çitlemek, okey oynamak, balkona çıkmak, ödev yapmak |
| q36 | kültür | Bir masal ya da çizgi film kahramanı söyle | Keloğlan 34 · Nasreddin Hoca 18 · Pepee 12 · Karagöz ve Hacivat 9,5 · Rafadan Tayfa 9 · Kral Şakir 7 · Dede Korkut 3 | Köstebekgiller, Tospik, Şahmeran, Cin Ali, Kuzucuk |
| q37 | yemek | Sevilen bir atıştırmalık söyle (kahvaltı dışı) | Çekirdek 36 · Cips 14 · Leblebi 10 · Kuruyemiş 9 · Simit 8 · Mısır 6 · Kestane 5 · Bisküvi 4 | pestil, çiğ köfte dürüm, lokum, kavrulmuş nohut (patlamış mısır = Mısır grubunun ALIAS'ı) |
| q38 | gelenek | Yılbaşında yapılan bir şey söyle | Milli Piyango almak 22 · Çam ağacı süslemek 14 · Geri sayım 12 · Kırmızı iç çamaşırı giymek 10 · Havai fişek izlemek 9 · Aileyle toplanmak 8 · Nar kırmak 6 · Hindi yemek 5 | tombala oynamak, dilek listesi yazmak, kapıda yeni yıl kartı, Taksim'e gitmek |
| q39 | aile | Bir akraba hitabı söyle | Teyze 18 · Amca 16 · Hala 12 · Dayı 12 · Yenge 9 · Enişte 7 · Babaanne 7 · Anneanne 7 | elti, görümce, bacanak, kayınço, dünür, baldız |
| q40 | alışveriş | İnternetten sipariş edilen bir şey söyle | Kıyafet 26 · Yemek 22 · Ayakkabı 9 · Elektronik / telefon 9 · Kitap 7 · Kozmetik 6 · Market alışverişi 6 · Ev eşyası 4 | kedi maması, oyuncak, bilet, çiçek, yedek parça |
| q41 | tarih | Ünlü bir Türk tarihi kişiliği söyle | Atatürk 48 · Fatih Sultan Mehmet 14 · Kanuni Sultan Süleyman 9 · Mimar Sinan 6 · Yavuz Sultan Selim 4 · Osman Gazi 3 · Alparslan 3 · Barbaros Hayreddin 3 | Piri Reis, Nene Hatun, Evliya Çelebi, Hezarfen Ahmed Çelebi, Kâtip Çelebi |
| q42 | komşuluk | Komşudan istenen bir şey söyle | Tuz 22 · Şeker 20 · Yumurta 12 · Soğan 9 · Un 8 · Ekmek 6 · Çay 5 · Matkap / tornavida 3 | maydanoz, limon, tüp/çakmak, merdiven, wifi şifresi |

Notlar:
- Sorular arası aynı etiket olabilir (q06 Çay, q17 Çay) — çakışma kontrolü soru İÇİNDEdir.

---

## 13. tools/check.js (İşçi A) — Node kontrol betiği

`node tools/check.js` (v2 klasöründen). Adımlar:
1. `index.html`'i oku, `<script src="...">` listesini sırayla çıkar; yalnız `config.js`, `data/*.js`, `matcher.js` dosyalarını `require` et (diğerleri DOM ister).
2. Veri kontrolleri, her soru için: benzersiz `id`; 15 ≤ grup ≤ 20; paya göre kesin azalan ve ardışık fark ≥ 0,2; toplam 99,0–101,0; %0,1–1,0 aralığında ≥4 grup; `invalid` 6–10 ve her birinde `reason`; `tests` ≥4; etiketler benzersiz; **alias çakışması**: `Matcher.buildKeys` ile her grubun anahtar kümesi, aynı anahtar iki grupta ya da grup+invalid'de varsa hata (soru id, anahtar, iki sahip).
3. Toplam soru ≥35 (beklenen 42).
4. `runMatcherTests()` → `true` olmalı.
5. Takvim: game.js'teki `getDailySet` mantığını `tools/check.js` içinde AYNI kodla (kopyala; tek kaynak istersen `config.js`'e `MARTI_DAILY` yardımcı fonksiyonu olarak koy ve game.js de oradan kullansın — önerilen budur) önümüzdeki 30 gün için çalıştır: her gün her mod 7 farklı soru, aynı gün modlar arası kesişim 0, aynı döngüdeki (k gün) günler arasında tekrar 0.
6. Özet yaz: `SORU 42 | GRUP ort 17,2 | ALIAS toplam 4.318 | TEST 214/214 | TAKVİM ok` ; herhangi hata → `process.exit(1)`.

---

## 14. UYGULAMA SIRASI (10 adım)

> Her adım sonunda: `node --check` (değişen her .js), adımın DOĞRULAMA'sı, kısa not (`v2/NOTLAR_V2.txt` dosyasına 2–4 satır: ne yapıldı, ne kaldı). Hata varsa sonraki adıma geçme.

**Adım 1 — İskelet ve sözleşmeler (tek işçi, sıralı).**
- `config.js`'i §3'teki gibi AYNEN oluştur; ayrıca §4'teki `fnv1a`, `mulberry32`, `shuffle`, `getDailySet(dayKey, questions)` ve `dayKeyToEpochDay` fonksiyonlarını `root.MARTI_DAILY = {...}` olarak buraya koy (game.js ve check.js ortak kullanır).
- `data/` klasörü; v1 `data.js` içeriğini `data/q01_10.js`'e taşı (id'leri `'q01'..'q04'` yap, `cat` ekle), diğer üç dosyayı boş `push()` ile oluştur.
- `index.html`'i yeni yerleşime çevir: `canvas#scene`, `div.crt`, `div#ui` içinde ekranlar: `#menu`, `#question` (tabela, rozet, ses düğmesi, dock, GEÇ), `#result`, `#cinematic`, `#summary`, `#intro-text`, `#debug-box`; §1 script sırası.
- `font.js`, `zones.js`, `sound.js` için §2 API'sini sağlayan boş gövdeli iskeletler (fonksiyonlar var, iş yapmıyor).
- DOĞRULAMA: tüm .js `node --check`; `index.html` Edge'de açılınca konsol hatası yok (shots.ps1 henüz yoksa elle `msedge --headless --dump-dom` ile `__ERRORS` boş).

**Adım 2 — matcher.js v2 + tools/check.js (İşçi A).**
- §10'u uygula; §13 betiğini yaz (veri kontrollerinde 42 soru şartını geçici olarak uyarıya çevir: `--partial` bayrağı).
- q01–q04 verisini §12 kurallarına genişlet (15–20 grup, kuyruk, tests ≥4, invalid 6–10).
- DOĞRULAMA: `node tools/check.js --partial` → q01–q04 için hata yok, `runMatcherTests` true, fixture vakaları geçer.

**Adım 3 — Veri bölüm 1: q05–q20 (İşçi A).**
- `data/q01_10.js` (q05–q10) ve `data/q11_20.js`; §12 tablosu ve kuralları.
- DOĞRULAMA: `node tools/check.js --partial` → hata yok; çakışma raporu boş.

**Adım 4 — Veri bölüm 2: q21–q42 (İşçi A).**
- `data/q21_31.js`, `data/q32_42.js`.
- DOĞRULAMA: `node tools/check.js` (bayraksız) → 42 soru, tüm kontroller ve takvim ok, exit 0.

**Adım 5 — Sahne çekirdeği ve yüzey (İşçi B).**
- `scene.js`'i baştan yaz: 384×216, tam ekran ölçek (§5.1), yardımcılar (§6.1), `GEO`, `PAL`, layerCache, kamera (§5.2), yüzey sahnesi §6.2–§6.11 (kara parçaları, köprü, cami, Galata, Çamlıca kulesi ve çamlar, evler + pencereler + yansımalar, güneş, su, yansıma şeridi, kesit, su altı, vapur, kayıklar, kuş sürüleri, martı 3 kare + dalış pozu), efektler §6.15, `selfTest()` (köprü/halat/Galata/Çamlıca hiza kontrolleri, en az 8 madde), `debug()`.
- `font.js`'i tamamla (§5.7, tüm karakterler).
- `tools/shots.ps1` (§6.16).
- Adım 5 büyük olduğu için 4 ara kontrol noktasıyla yapılır; her biri sonunda `zirve:0` görüntüsü + `--dump-dom` ile `SELFTEST: ok`:
  - **5a** yardımcılar, PAL/GEO, ölçekleme, gökyüzü, güneş, kara parçaları, köprü, selfTest (köprü + halat maddeleri).
  - **5b** yapılar: cami, Galata, Çamlıca kulesi + çamlar, evler + pencereler, FOOTPRINTS çakışma testi.
  - **5c** su yüzeyi, yansıma şeridi, kesit, su altı (raflar, kaya, yosun, hüzme, küçük nesneler, kabarcık).
  - **5d** canlılar: vapur, kayıklar, kuş sürüleri, balıklar, martı 3 kare + dalış pozu, efektler, `Scene.drawGullSprite`.
- DOĞRULAMA: §6.16 tablosundaki zirve_0 maddelerini tek tek kontrol et; `SELFTEST: ok` (DOM dökümüyle). Görüntüyü 1/4 ölçekte bir kez incele; madde başarısızsa düzelt ve yeniden çek (her ara noktada en fazla 3 tur).

**Adım 6 — Bölgeler (İşçi B).**
- `zones.js` (§5.3, §5.4 tabloları AYNEN), `drawSky` karışım + dithering (§5.5), dünya/ekran katmanları ve bölge ağırlıkları, bulutlar §6.12, bölge öğeleri §6.13, ORTA yatay sahne §6.14, `setScore` → bölge değişimi, `drawZoneBanner` (§5.6), `onZoneEnter`, `getZoneInfo`.
- DOĞRULAMA: `shots.ps1` tüm sahne listesi (zirve 0–5, dip 1–4, orta 0–5); §6.16 tablosu tek tek; `selfTest` ok; ayrıca `PixelFont.missing()` tüm bölge adları için boş.

**Adım 7 — Oyun akışı (İşçi C).**
- `game.js`'i yeniden yaz: durum makinesi §7, `evalTier` §3, cümleler, sonuç listesi kuralları (mod başına), GEÇ zamanlaması, bilgi şeridi, süre uyarısı, reveal → result zamanlaması, günlük set (`MARTI_DAILY`), Sınırsız, `__ERRORS`.
- URL parametreleri (hepsi bu adımda): `date=YYYY-MM-DD` (gün ezme), `shot=...` (§6.16), `auto=zirve|dip|orta|sinirsiz` (bot), `reset=1` (test anahtarını temizle), `nostorage=1` (localStorage erişimini bilerek hata fırlatan sahte nesneyle değiştir). `shot`/`auto` varken depolama anahtarı `marti.v2.test`.
- Durum metinleri (`AUTO OK 7/7`, `HATA: n`, `SELFTEST: ok`) `#debug-box` içinde DOM metni olarak yazılır; doğrulama PNG okuyarak DEĞİL, DOM dökümüyle yapılır:
  `& $edge --headless=new --disable-gpu --virtual-time-budget=120000 --dump-dom "$base?auto=zirve" | Select-String 'AUTO OK 7/7|HATA: 0'`. Ekran görüntüleri yalnız görsel kontrol içindir.
- `style.css`: §8 (tabela, rozet, dock, şeritler, sonuç paneli, MÜKEMMEL harf zıplatma ve çerçeve parıltısı, ZAYIF sallanma).
- DOĞRULAMA: `?auto=zirve` modu ekle: bot her soruda 400 ms sonra 1. cevabın etiketini yazar ve gönderir, reveal ve result'ta Enter'a basar; 7 soru sonunda sinematik + özet görünür ve sağ altta `AUTO OK 7/7 · HATA: 0` yazar. `?auto=dip` (en nadir cevap), `?auto=orta` (5. cevap), `?auto=sinirsiz` aynı. Dördünü shots.ps1 benzeri headless komutla `--virtual-time-budget=120000` vererek çek ve kontrol et.

**Adım 8 — Bitiş, özet, depolama, menü (İşçi C).**
- Sinematik ve özet ekranı §8.4, paylaş metni, depolama §9 (seri, yarım tur devamı, eski gün temizliği), ana menü §8.3 (logo canvas'ı PixelFont ile, mod kartları ✓ ve puan, Sınırsız mod seçici, istatistik şeridi).
- DOĞRULAMA: (a) `?auto=zirve&date=2026-11-22` sonra `?auto=dip&date=2026-11-22` → menüde iki kart ✓; (b) `?date=2026-11-23` ile oynanınca seri 2; (c) `?date=2026-11-25` → seri 1'e düşer; (d) paylaş metni §8.4 biçiminde (konsola da yaz). Not: auto modu `marti.v2.test` anahtarını kullanır, testten önce temizler (`?reset=1`).

**Adım 9 — Ses, klavye, cila (İşçi C).**
- `sound.js` §11; ses düğmesi ve `M`; tüm klavye: Enter (gönder/sonraki/devam), Esc (soru sırasında küçük onay şeridi `TURU BIRAK? ENTER: EVET · ESC: HAYIR`; yarım tur kaydı korunur; diğer ekranlarda doğrudan menü), Ctrl+Enter (GEÇ), menüde 1–4/ok/Enter; odak her soruda otomatik input'ta.
- intro animasyonu, tabela salınımı, rozet parlaması.
- DOĞRULAMA: klavyeyle (fare kullanmadan) bir ZİRVE turunu elle bitir; Esc onayı çalışır; ses kapalıyken hiç `AudioContext` notası çalmaz (Sound.play erken döner).

**Adım 10 — Son kontrol ve README (tek işçi).**
- §15 kabul listesini sırayla çalıştır, sonucu `NOTLAR_V2.txt`'ye yaz.
- `README.md` güncelle: çalıştırma, modlar, dosya yapısı, yeni soru ekleme (veri şeması + tests), `node tools/check.js`, `tools/shots.ps1`, URL parametreleri, payların tahmini olduğu notu.
- Eski `data.js` başına arşiv yorumu.

**Paralel işçi önerisi:** Adım 1 bittikten sonra 3 işçi: **A** (2→3→4: matcher.js, tools/check.js, data/*), **B** (5→6: scene.js, zones.js, font.js, tools/shots.ps1), **C** (7→8→9: game.js, style.css, sound.js, index.html'deki küçük ekler; config.js'e yalnız C dokunur). Ortak dosya yok. C, B bitmeden Scene'in iskelet API'siyle çalışır; Adım 10 üçü bitince.

---

## 15. KABUL KRİTERLERİ VE KENDİ KONTROL LİSTESİ

| # | Kriter | Nasıl |
|---|---|---|
| 1 | Tüm JS sözdizimi temiz | `Get-ChildItem -Recurse *.js | % { node --check $_.FullName }` → çıktı yok |
| 2 | Veri ve eşleştirme | `node tools/check.js` → exit 0; 42 soru (≥35), her soru 15–20 grup, share toplamı 99–101, ≥4 kuyruk grubu, invalid 6–10, tests ≥4, alias çakışması 0 |
| 3 | runMatcherTests | tümü geçer (check.js içinde), fixture "alışveriş yapmak → Alışverişe gitmek" dahil |
| 4 | Günlük set | 30 günlük takvim kontrolü ok; aynı tarih iki kez açılınca aynı sorular |
| 5 | Her mod tam tur | `?auto=zirve|dip|orta|sinirsiz` → `AUTO OK 7/7 · HATA: 0` |
| 6 | Konsol hatası yok | tüm shot ve auto görüntülerinde `HATA: 0` |
| 7 | Sahne kalitesi | §6.16 tablosunun tüm maddeleri işaretli; `SELFTEST: ok`; köprü ayakları ve tüm yapılar zeminde |
| 8 | Bölge geçişi | ZİRVE'de 560+ puanda AY IŞIĞI banner'ı + rozet; DİP'te 520+ KARANLIK DİP; ORTA'da 580+ SARIYER |
| 9 | Cevap akışı | geçersiz: krem şerit, süre devam, GEÇ belirir; geçerli: şerit + kamera (~2 sn) sonra panel; MÜKEMMEL harf zıplatma + parıltı; ZAYIF sallanma; SÜRE DOLDU |
| 10 | Bitiş | sinematik → özet; seri, mod puanları, sıradaki mod, paylaş metni doğru biçim |
| 11 | Depolama | localStorage kapalıyken (ör. `?nostorage=1` ile erişimi bilerek fırlat) oyun çalışmaya devam eder |
| 12 | file:// | `index.html` çift tıklayınca çalışır (module, fetch, harici kaynak yok: `Select-String -Path *.html,*.js -Pattern 'import |fetch\(|https?://'` boş, README hariç) |
| 13 | Yasaklar | sahnede balon, tavşan, deniz feneri yok; referans adları UI'da yok: `Get-ChildItem -Recurse -Include *.js,*.html,*.css | Select-String -CaseSensitive -Pattern 'GÖKYÜZÜ|DERİNLİK|KUTUP|GALAKSİ|BERRAK|Gökyüzü|Derinlik'` boş (.md dosyaları hariç) |
| 14 | Klavye | fare olmadan menü → tur → özet → menü |

Teslim raporu (en fazla 10 satır): değişen/eklenen dosyalar, check.js özeti, auto sonuçları, shot listesi ve kontrol sonucu, bilinen eksikler.
