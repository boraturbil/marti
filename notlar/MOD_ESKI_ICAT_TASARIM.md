# Yeni mod tasarımı: "ZAMAN" (en eski icat)

Tarih: 2026-11-22 · Durum: TASARIM (kod yazılmadı) · Hedef sürüm: `v2/`
Bu belge kullanıcı fikrinden yola çıkar: "Evde kullanılan eşyalardan en eski icat edilen hangisi?" sorusuna serbest yazıyla cevap verilir, oyun tarihsel olarak doğru cevabı kabul eder ve sahne doğru cevabın dönemine döner. Mimari referanslar v2 kodunun 2026-11-22 hâlidir (`config.js`, `game.js`, `scene.js`, `zones.js`, `matcher.js`, `sound.js`, `tools/check.js`, `data/q*.js`).

> **Doğruluk ilkesi:** Bu belgedeki her tarih bir kaynak türüyle etiketlidir. `kesin`, belgelenmiş bir patent, tören ya da resmi kayıt anlamına gelir. `yaklaşık` uzlaşılmış ama aralıklı bir tarihtir (radyokarbon, dönem). `tartışmalı` için kaynaklar çelişir ya da yorum farklıdır. `bilinmiyor` güvenilir bir ilk tarihin olmadığını gösterir. **[DOĞRULANMALI]** etiketi, yalnız ikincil kaynaklarda bulduğum ve yayına almadan önce birincil kaynakla teyit edilmesi gereken bilgiler içindir. Uydurma tarih yoktur: emin olunmayan her şey bu etiketlerden birini taşır.

---

## 1. Mod adı, konsept, his ve menüye ekleme

### 1.1 Ad önerileri
| Öneri | Kart | Artı | Eksi |
|---|---|---|---|
| **ZAMAN** (önerilen) | `⧗ ZAMAN` | Kısa, diğer kartlar gibi tek kelime (ZİRVE / DİP), "zamanda yolculuk" sahnesiyle örtüşür | "Süre" ile karışabilir (alt yazı bunu çözer) |
| EN ESKİ | `⧗ EN ESKİ` | Görevi doğrudan söyler | İki kelime, ileride "en yeni" sorularına kapı kapatır |
| İLK İCAT | `⧗ İLK İCAT` | Net | "İcat" her soruya uymaz (yoğurt, telgraf hattı) |
| MAZİ | `⧗ MAZİ` | Sıcak, Türkçe, nostaljik | Gençlerde daha az tanıdık |

İkon: `⧗` (kum saati). `⌛`, `CFG.TIMEOUT_TIER.icon` olarak zaten kullanıldığı için seçilmedi.

### 1.2 Konsept (tek paragraf)
Diğer üç mod "çoğunluk ne der?" diye sorar. ZAMAN ise **olgusal** bir soru sorar: verilen kapsamda en eski icadı ya da ilk ortaya çıkan şeyi yazarsın. Tek bir doğru cevap vardır. Yanlış cevap da boşa gitmez: yazdığın şeyin çağı doğru cevaba ne kadar yakınsa o kadar puan alırsın. Cevap açılınca martı zaman tünelinden geçer ve sahne o döneme döner: mağara ateşi, Çatalhöyük damları, Mezopotamya avlusu, gaz lambalı Karaköy rıhtımı, lambalı radyolu bir Cumhuriyet evi... Ardından 2-4 küçük bilgi kartı açılır ("Kenya'da 3,3 milyon yıllık taş aletler bulundu").

### 1.3 Oyuncuya vaat edilen his
- **"Vay be" anı:** Sezginin yanıldığı yer ("faks telefondan eski mi?!"). Oyunun asıl ödülü bilgi kartıdır.
- **Zaman turistliği:** Her doğru cevap yeni bir dönem sahnesi açar. Sahneler sevimli ve canlıdır, martı her dönemde ayrı bir yere tüner.
- **Cezasız merak:** Yanlış cevap da sahneye kısa bir uğrama ve puan getirir. "Tamamen yanlış" duygusu azdır.
- **Yerel gurur ve nostalji:** Cezve, baklava, Vecihi'nin uçağı, Devrim otomobili, TRT'nin ilk yayını.

### 1.4 Menüye ekleme (mevcut 3 kart + SINIRSIZ yapısı)
Bugün `renderMenu()` (`game.js` 442-510), `CFG.MODE_ORDER = ['zirve','dip','orta']` üzerinden 3 kart çizer. SINIRSIZ ayrı bir geniş kart olarak (`#unlimited-card`) altta durur.

**`MODE_ORDER`'a EKLENMEZ.** Gerekçesi şunlar:
- `PUSULLA_DAILY.getDailySet()` yalnız zirve/dip/orta döndürür. Kart eklenirse `state.dailySet.icat` boş kalır.
- `check.js` takvim testi (satır 431) üç modu sabit kodlar.
- Bu dizi SINIRSIZ mod seçici düğmelerini de üretir.

**Öneri:** Üç kartın altına, SINIRSIZ kartının üstüne, ayrı ve geniş bir `#icat-card` eklenir. Kartın sepya-kehribar teması ve küçük bir kum saati animasyonu olur.
- `index.html`: `<div id="icat-card" class="icat-card"></div>`, `#mode-cards` ile `#unlimited-card` arasına.
- `CFG.MODES.icat`: `{ id:'icat', name:'ZAMAN', icon:'⧗', daily:true, scene:'icat', kind:'icat', desc:'En eski icadı bul, martı zamanda geri uçsun.', hint:'BU KAPSAMDA EN ESKİ OLANI YAZ.', listTitle:'ZAMAN ÇİZELGESİ', questionsPerRound:5, roundSeconds:40, maxScore:500, tiers:[…] }`
- Klavye: `menuFocusIdx` bugün `% 4` ile döner (satır 1432/1438). İndeksler şöyle olur: 0-2 kartlar, **3 ZAMAN**, 4 SINIRSIZ. Döngü `% 5` olur ve `if (idx < 3)` / `idx === 3` dalları güncellenir.
- İstatistik çubuğu (satır 499-507): `· ZAMAN <best.icat>` eklenir.
- SINIRSIZ seçicisi: `u-mode-btn` listesine ZAMAN eklenir. SINIRSIZ ZAMAN, `ICAT_QUESTIONS` havuzundan rastgele 5 soru verir.

---

## 2. Oyun akışı

### 2.1 Tur yapısı
| Parametre | Değer | Neden |
|---|---|---|
| Soru/tur | **5** | Zaman yolculuğu ve bilgi kartları soru başına yaklaşık 8-12 sn ekler. 7 soru turu yorar. |
| Süre | **40 sn** | Tahmin değil hatırlama ve akıl yürütme ister. Mevcut 30 sn biraz kısa kalır. |
| Maks puan | 500 (5 × 100) | |
| GEÇ | 10 sn sonra ya da ilk `invalid`/`none` cevaptan sonra (mevcut `SKIP_AFTER_SECONDS` mantığı) | Tutarlılık |
| İPUCU | 15 sn sonra görünür | Aşağıda (2.4) |

**Sabit kodlu yerler** (tur uzunluğu ve maks puan moda göre okunmalı). Yardımcı fonksiyonlar `roundLen()`, `roundSecs()` ve `maxScore()` önerilir:
- `CFG.QUESTIONS_PER_ROUND`: `renderMenu` 462/467, `startMode` 533/549/565/575/599, `enterReveal` 981.
- `CFG.ROUND_SECONDS`: `startMode` 580, `beginQuestion` / `updateTimerLoop`, ayrıca `index.html` içindeki `aria-valuemax="30"`.
- `CFG.MAX_SCORE`: `renderMenu` 461, `buildShareText` 1220/1227.

### 2.2 Bir sorunun akışı
1. **Soru fazı:** Sahne "GÜNÜMÜZ" evidir (bkz. 5, E11): pencereden Boğaz görünür, martı pervazda bekler. Tabelada soru metni ve altında gri **kapsam** satırı yer alır (ör. "Bugün bir evde bulunabilen taşınabilir eşya ya da mobilya").
2. Oyuncu yazar ve `handleSubmit()` çalışır. `Matcher.matchAnswer(raw, q)` olduğu gibi kullanılır (bkz. 3).
3. Sonuç türleri:
   - `valid` dönerse aday bulunur, puan kademesi hesaplanır (2.3) ve `enterReveal` çalışır.
   - `invalid` dönerse mevcut davranış sürer: bilgi çubuğunda gerekçe gösterilir, `wrong` sesi çalar, GEÇ açılır.
   - `none` dönerse moda özel metin çıkar: "Bunu bu sorunun zaman çizelgesinde bulamadım. Daha yaygın bir adla yaz ya da başka bir şey dene." (bkz. 3.4)
4. **Açılış (reveal):** Kademe şeridi görünür (mevcut `#tier-strip`). Ardından `Scene.travel()` ile zaman yolculuğu başlar (yaklaşık 2,2 sn, bkz. 5.3). Cevap yanlışsa yolculuk önce oyuncunun cevabının çağında **0,6 sn durur**, sonra doğru çağa iner.
5. **Sonuç paneli:** Sağdaki `#result-panel` açılır, bilgi kartları sol altta sırayla görünür (bkz. 6).
6. SONRAKİ SORU ile 0,6 sn'lik ileri yolculuk yapılır, sahne GÜNÜMÜZ'e döner ve yeni soru gelir.

### 2.3 Puanlama: çağ yakınlığı
Çağ dizisi `ICAT_ERAS` (bkz. 5.1) 12 basamaktır. `gap = eraIndex(oyuncu adayı) − eraIndex(doğru aday)` olarak hesaplanır. Doğru cevap tanım gereği en eski olduğundan gap ≥ 0 olur.

| Kademe | Koşul | Puan | Emoji | Etiket |
|---|---|---|---|---|
| `tam` | Aday = doğru ya da `q.esit` listesinde | 100 | 🟨 | TAM İSABET |
| `ayni` | gap = 0 (aynı çağ, başka aday) | 70 | 🟩 | AYNI ÇAĞ |
| `bir` | gap = 1 | 50 | 🟦 | BİR ÇAĞ YAKIN |
| `iki` | gap = 2 | 30 | 🟧 | İKİ ÇAĞ YAKIN |
| `uzak` | gap ≥ 3 | 10 | 🟥 | ZAMAN UZAK |
| `belirsiz` | Adayın `kesinlik:'bilinmiyor'` | 30 | 🟧 | TARİHİ BELİRSİZ |
| `pas` / `sure` | Mevcut `PASS_TIER` / `TIMEOUT_TIER` | 0 | ⬜ | |

**Tartışmalı tarih kuralı:** Aday `kesinlik:'tartismali'` ise ve `yilMin` değeri doğru cevabın çağına ya da daha eskisine uzanıyorsa, kademe en az `ayni` (70) olur. Asla `tam` olmaz, `tam` yalnız `q.esit` ile verilir. Böylece oyuncu, bilimin henüz karar vermediği bir yüzünden cezalandırılmaz.

**İpucu cezası:** İpucu kullanıldıysa kademe puanı en çok 70 ile sınırlanır (`tam` → 70, etiket "TAM İSABET (İPUCU)").

**Kod etkisi:** `evalTier(modeCfg, rank, share)` (satır 252) sıra ve pay kurallarıyla çalışır. ZAMAN için ayrı bir `evalIcatTier(modeCfg, cand, q, usedHint)` yazılır. `handleSubmit()` içinde `modeCfg.kind === 'icat'` dalı açılır. `state.results[i]` kaydına `yil` ve `era` eklenir. `rank` = gap+1 ve `share` = 0 tutulur, böylece eski özet kodları kırılmaz. `buildResultSentence()` de `icat` dalı alır. Örnekler:
- "Tam isabet: bıçak (taş kesici) ~3,3 milyon yıl önce."
- "Televizyon 1926'dan; en eskisi ise 3,3 milyon yıl önceki taş bıçak. Arada 9 çağ var."

### 2.4 İpucu ve GEÇ
- **İPUCU** düğmesi 15 sn sonra GEÇ'in yanında belirir. Basılınca bilgi çubuğunda doğru cevabın **çağ adı** yazar ("İpucu: Doğru cevap TAŞ DEVRİ'nden"). Sahne o çağın gökyüzü rengine hafifçe kayar, bu bir sezgi ipucudur. Tek kullanımlık. Puan tavanı 70.
- **GEÇ** mevcut davranışı korur (`handlePass` → `PASS_TIER`). Fark şudur: doğru cevap yine gösterilir, zaman yolculuğu yapılır ve kartlar açılır. Öğrenme ödülü kaybolmaz.

### 2.5 Seri, istatistik, günlük ve sınırsız
- **Günlük:** 5 soru/gün, `getDailyIcatSet(dayKey, ICAT_QUESTIONS)` ile seçilir (yeni fonksiyon). Algoritma `getDailySet` ile aynıdır: `fnv1a('pusulla-icat|'+cycle)` + `mulberry32` karıştırma, döngü başına havuzun `floor(n/5)` günü. Havuz 15 soruyla 3 günde döner. **Günlük yayın için en az 60 soru önerilir** (12 günlük döngü). O sayıya ulaşılana kadar mod yalnız SINIRSIZ'da ve "ÖNİZLEME" etiketiyle açılabilir (karar 2).
- **Seri:** `finalizeRound()` (1132-1171) günü moddan bağımsız sayar (`lastPlayedDay`). ZAMAN turu tamamlanınca da gün sayılır, mevcut kod buna göre değişiklik istemez. `st.best.icat` eklenir, `defaultStore().stats.best` ve `loadStore` göçü `icat:0` alır.
- **Kayıt:** `store.days[dayKey].icat = { done, score, zoneName: <ulaşılan en eski çağ adı>, results }`. Yarım tur ve `pending` mekanizması (F5 ile süreyle devam) aynen çalışır.
- **Sınırsız:** `stats.unlimitedRounds` artar, seriyi etkilemez (mevcut kural).
- **Paylaş:** `PUSULLA #N · ZAMAN ⧗ · tarih`, emoji satırı, `410/500 · en eski: TAŞ DEVRİ`, `🔥 N gün`.
- **Sinematik bitiş:** `renderCinematic()` içindeki `getZoneInfo()` ZAMAN modunda turda ulaşılan **en eski çağı** döndürür (ör. `{name:'TAŞ DEVRİ', label:'3,3 MİLYON YIL'}`). Sahne o çağda donar, altta 5 duraklı mini zaman şeridi görünür.

---

## 3. Cevap eşleştirme ve aday listeleri

### 3.1 matcher.js ile uyum (değişiklik gerekmez)
`Matcher.matchAnswer(rawInput, question)` yalnız iki alanı okur: `question.answers[i].label/aliases` ve `question.invalid[i].aliases/reason`. İndeksi `question._mIndex` üzerinde önbelleğe alır. Bu yüzden ZAMAN soruları **aday listesini `answers` alanında taşır**. Ek alanlar (`yil`, `kesinlik`...) matcher tarafından görmezden gelinir. Mevcut özellikler bedavaya gelir: NFC, Türkçe ek soyma (`stripTurkishSuffix`: "bıçağı", "aynalar"), Levenshtein bulanık eşleşme, içerik kökü örtüşmesi ("eski taş bıçak" → Bıçak) ve `invalid`'in valid fuzzy'den önce gelmesi.

**Neden `root.QUESTIONS`'a konmaz:** `check.js` her `QUESTIONS` kaydında 15-20 grup, pay toplamı 99-101, 6-10 invalid ve pay sırası şartı arar. `getDailySet` ise havuzu `n/21` ile böler. ZAMAN kayıtları bu kuralları kıracağı ve takvimi bozacağı için ayrı global olur: `root.ICAT_QUESTIONS`.

### 3.2 Ortak eşya sözlüğü (tek doğruluk kaynağı)
Aynı eşya (ayna, televizyon, buzdolabı) birden çok soruda geçer. Yılı ya da kaynağı soruya göre farklı yazmak hata üretir. Bu yüzden:
- `v2/data/icat_esya.js` → `root.ICAT_ITEMS = { id: {label, aliases, yil, yilMin, yilMax, yer, ne, kesinlik, kaynakTuru, kaynak, not} }`, ayrıca `root.ICAT_ERAS` ve yardımcılar (`eraOf`, `formatYil`). Bunlar `data/` altında durur, çünkü `check.js` yalnız `config.js`, `matcher.js` ve `data/*.js` dosyalarını yükler.
- `v2/data/icat_sorular.js` → `root.ICAT_QUESTIONS`. Her soru `adaylar: ['bicak','yatak',…]` ile eşyaya başvurur. Dosyanın sonundaki küçük bir kurucu, `q.answers` dizisini sözlükten üretir (`Object.assign({id}, ICAT_ITEMS[id], q.ozel && q.ozel[id])`).
- "Dünyada ilk" ile "Türkiye'ye geliş" farklı eşyalardır: `televizyon` (1926) ve `tr_televizyon` (TRT 1968) gibi.

### 3.3 Eş anlamlılar, ekler, genel ve özel sözcükler
- Her eşyada 6-30 alias bulunur: ASCII yazımlar (`cezve`/`çezve`), ekli biçimler ("bıçağı", "aynayı"), eş anlamlılar ("çömlek", "toprak kap", "güveç"), eski ve yöresel adlar ("gevrek"), İngilizce teknik adlar (yalnız yerleşik olanlar: "walkman", "rubik").
- **Genel sözcük politikası (öneri, karar 3):** Bir sözcük birden çok tarihsel biçimi kapsıyorsa ("kalem", "telefon", "tencere"), **o türün en eski biçimine** eşlenir. Sonuç kartında bu açıkça söylenir: "'Kalem' yazdın; en eski kalem türü kamış kalemi saydık (~MÖ 3000)." Özel biçimler ayrı adaydır: "kurşun kalem" 1560'lar, "tükenmez" 1938. Matcher'da önce tam ve ek eşleşme çalıştığından "kurşun kalem" özel adaya gider, tek başına "kalem" genel adaya gider. Bunu `check.js` alias çakışma testi korur.
- **Çok genel sözcükler** ("eşya", "giysi", "oyuncak", "araç") `invalid` olur ve gerekçe belirli bir şey ister: "Belirli bir giyim parçası yaz (ör. ayakkabı, şapka)."
- **Kapsam dışı** ama gerçek şeyler (ev sorusunda "ateş", giyim sorusunda "iğne", İstanbul toplu taşıma sorusunda "kayık") `invalid` gerekçesiyle kibarca yönlendirilir: "Kayıklar çok eskiden beri vardı ama tarifeli hat değildi." Gerekçe ≤90 karakterdir ve "yanlış" kelimesini içermez (mevcut `check.js` kuralı).

### 3.4 Soruda olmayan ama geçerli eşya ("çatal" sorunu)
Serbest yazıda listede olmayan gerçek eşyalar mutlaka yazılacaktır. Politika üç katmanlıdır:
1. **Kapsamlı aday listesi:** Her soruda 8-15 aday bulunur ve bir oyuncunun yazacağı makul her şeyi kapsamayı hedefler. İlk sürümden sonra 3. katmanın kayıtlarıyla genişletilir.
2. **`none` dönerse:** Puan verilmez, süre akmaya devam eder, oyuncu tekrar yazabilir. Mesaj kibardır ("zaman çizelgemde yok") ve GEÇ açılır. Bu, diğer modlardaki "listede bulamadım" davranışıyla tutarlıdır.
3. **Kaçırılan cevap kaydı (yalnız yerel):** `none` dönen girdiler `store.icatMiss[qid]` içinde en çok 50 kayıt olarak tutulur. Yalnız `?debug` ile görünür, ağ yok. Geliştirici bu listeyi aday genişletmek için kullanır.

**Kritik veri kuralı:** Kapsam dahilinde, bildirilen doğru cevaptan **daha eski** bir eşya varsa bu bir veri hatasıdır. Önlemler:
- `check.js`, `dogru` adayının yılının, adaylar içindeki en küçük yıl olduğunu doğrular (`bilinmiyor` hariç; eşitler `q.esit`'te).
- Editoryal kontrol listesi ("çok eski çekirdek eşyalar"): `bicak` (taş alet), `ocak` (ateş), `yatak`, `igne`, `comlek`, `ip`, `sepet`, `ogutme_tasi`. Kategorisi `ev`, `mutfak`, `hijyen` ya da `giyim` olan her soruda bunların her biri ya aday listesinde ya da `invalid` alias'larında (kapsam dışı gerekçesiyle) yer almalıdır. Yoksa `check.js` **uyarı** verir.

### 3.5 Yakınlık mantığı (yanlış cevap)
Yanlış ama geçerli bir aday için puanı 2.3'teki çağ farkı belirler. Sonuç panelindeki **zaman şeridinde** 12 çağ çentiği bulunur: oyuncunun adayı mavi işaret, doğru cevap altın işaret olur, aradaki çağ sayısı yazılır. Çağ kullanmanın gerekçesi: kesin yıl farkı (milyon yıl ile 50 yıl) ölçeksizdir ve tartışmalı tarihlerde sahte kesinlik üretir. Çağ basamağı hem sahneyle eşleşir hem de belirsizliği yutar.

**Bilinmeyen doğru cevaba erişilebilirlik:** Bazı soruların doğrusu az bilinen bir şeydir (Senet, Vecihi K-VI). Bunu dengeleyen üç şey var:
- Aynı çağdan bilinen bir aday (zar, Ur oyunu, radyo) yazan oyuncu 70 alır.
- Kapsam satırı ve ipucu çağ bilgisini verir.
- Bu sorular bir turda en fazla 1 kez gelir: `zorluk:3` etiketi ve günlük seçimde "turda en çok bir zorluk-3" kuralı.

---

## 4. Soru örnekleri (15 adet)

Tabloların sütunları: aday · ilk tarih · yer · kesinlik · kaynak türü (kısa künye). **Doğru cevap kalın yazılmıştır.** "Sahne" doğru cevabın çağıdır (bkz. 5). Bilgi kartlarının her biri tek cümledir.

### i01 · EV · "Evinde bulunan eşyalardan EN ESKİ icat edileni hangisi?"
Kapsam: bugün bir evde bulunabilen taşınabilir eşya ya da mobilya.
| Aday | Tarih | Yer | Kesinlik | Kaynak |
|---|---|---|---|---|
| **Bıçak (taş kesici)** | ~3,3 milyon yıl önce | Lomekwi 3, Kenya | yaklaşık | arkeoloji (Harmand ve ark., *Nature*, 2015) |
| Yatak (ot yatak) | ~200.000 yıl önce | Border Cave, Güney Afrika | yaklaşık | arkeoloji (Wadley ve ark., *Science*, 2020) |
| İğne (delikli kemik iğne) | ~40.000 yıl önce ve öncesi | Avrasya (ör. Denisova Mağarası) | tartışmalı | arkeoloji; en eski örneğin tarihi tartışmalı |
| Tencere / çömlek | ~20.000 yıl önce | Xianrendong Mağarası, Çin | yaklaşık | arkeoloji (Wu ve ark., *Science*, 2012) |
| Fırın (kubbeli kil fırın) | ~MÖ 7000-6000 | Anadolu (Çatalhöyük evleri) | yaklaşık | arkeoloji |
| Ayna (cilalı obsidyen) | ~MÖ 6000-5500 | Çatalhöyük, Konya | yaklaşık | arkeoloji (Mellaart kazıları) |
| Sandalye | ~MÖ 2600 (bilinen erken örnek) | Mısır, Kraliçe Hetepheres I mezar eşyası | tartışmalı | arkeoloji |
| Masa | bilinmiyor (erken örnekler Antik Mısır) | n/a | bilinmiyor | ansiklopedi |
| Halı (düğümlü) | MÖ 5.-4. yy | Pazırık, Altay (Hermitage) | yaklaşık | arkeoloji |
| Kalem (kamış kalem) — genel "kalem" buraya eşlenir | ~MÖ 3200 | Mezopotamya (çivi yazısı kalemi) ve Mısır | yaklaşık | arkeoloji/ansiklopedi |
| Kurşun kalem | 1560'lar | Borrowdale grafiti, İngiltere | yaklaşık | ansiklopedi |
| Buzdolabı (ev tipi elektrikli) | 1910'lar; yaygınlaşma 1927 | ABD | yaklaşık | ansiklopedi |
| Televizyon | 1926 | Londra (Baird gösterimi) | kesin | ansiklopedi |

Kullanıcının örnek sözcükleri bu soruda şöyle sonuçlanır (hepsi `tests`'te bulunur):
- "kalem" kamış kalem olur (E2, gap 2 → İKİ ÇAĞ YAKIN, 30).
- "masa" TARİHİ BELİRSİZ (30) olur.
- "fırın" Neolitik kil fırın olur (E1, gap 1 → 50).
- "televizyon" 1926 olur (E7, ZAMAN UZAK 10).

Invalid alias grupları:
- `ateş, ocak` → "Ateş bir eşya değil; onu başka bir soruda soracağız."
- `kapı, pencere, duvar` → "Evin bir parçası; taşınabilir bir eşya yaz."
- `eşya, mobilya` → "Belirli bir eşya yaz."

Bilgi kartları:
1. Kenya'daki Lomekwi 3'te bulunan taş aletler yaklaşık 3,3 milyon yıllıktır ve bilinen en eski kesici aletlerdir.
2. Güney Afrika'da 200.000 yıllık ot yataklar bulundu; araştırmacılara göre böcek kaçsın diye kül üstüne serilmişlerdi.
3. Konya Çatalhöyük'te yaklaşık 8.000 yıllık, cilalı obsidyenden yapılmış aynalar bulundu.
4. Masanın mağarada kullanıldığına dair kanıt yok; bilinen erken masalar Antik Mısır'dan.

Sahne: **TAŞ DEVRİ** (E0).
> Kullanıcı varsayımına not: "İlk masa mağaradaydı" varsayımını kayıtlar desteklemiyor. Mağaraya götüren eşya bıçak (taş alet) ve yataktır. Televizyon da Cumhuriyet'in ilk evine değil, Türkiye'de 1968'e (E8 sınırı) aittir. Bu iki düzeltme kartlarda kullanılır.

### i02 · MUTFAK · "Yemek pişirmek ya da saklamak için kullanılan kaplardan en eskisi hangisi?"
Kapsam: pişirme ve saklama kapları (bıçak, çatal gibi aletler değil).
| Aday | Tarih | Yer | Kesinlik | Kaynak |
|---|---|---|---|---|
| **Çömlek / tencere / güveç** | ~20.000 yıl önce | Xianrendong, Çin | yaklaşık | arkeoloji (Wu ve ark., 2012) |
| Sepet | bilinmiyor (örgü izleri ~26.000 yıl öncesine uzanır, doğrudan sepet kalıntısı çok daha genç) | Orta Avrupa | bilinmiyor | arkeoloji (yorum tartışmalı) |
| Cam kap / şişe / kavanoz | ~MÖ 1500 | Mezopotamya ve Mısır | yaklaşık | ansiklopedi |
| Düdüklü tencere | 1679 (Papin'in buharlı kabı); ev tipi 1930'lar | Londra | yaklaşık | ansiklopedi |
| Teneke kutu (konserve) | 1810 | İngiltere (Durand patenti) | kesin | patent |
| Cam kavanoz (Mason) | 1858 | ABD | kesin | patent |
| Termos | 1892 | Londra (Dewar) | kesin | ansiklopedi |
| Alüminyum folyo | 1910 civarı | İsviçre | yaklaşık | ansiklopedi |
| Buzdolabı | 1910'lar | ABD | yaklaşık | ansiklopedi |
| Saklama kabı (Tupperware) | 1946 | ABD | kesin | ansiklopedi |
| Mikrodalga fırın | 1945 patent başvurusu; ürün 1947 | ABD (Spencer) | kesin | patent |

Invalid alias grupları:
- `bıçak, çatal, kaşık, kepçe` → "Bu bir alet; pişirme ya da saklama kabı yaz."
- `ocak, fırın` → "Fırın bir kap değil, pişirme yeri."

Bilgi kartları:
1. Çin'deki Xianrendong Mağarası'ndaki çömlek parçaları yaklaşık 20.000 yıllıktır.
2. Ürdün'de 14.400 yıllık yanmış ekmek kırıntıları bulundu; ekmek tarımdan bile eskidir. *(kaynak alanı: Arranz-Otaegui ve ark., PNAS, 2018)*
3. Nicolas Appert yiyecekleri şişede saklama yöntemiyle 1810'da Fransız hükümetinin ödülünü aldı.
4. Mikrodalga fırın, radar mühendisi Percy Spencer'ın 1945'teki çalışmalarından doğdu.

Sahne: **TAŞ DEVRİ** (E0).

### i03 · TÜRK MUTFAĞI · "Şu lezzetlerden hangisinin adı yazılı kaynaklarda EN ÖNCE geçer?"
Kapsam: Türk mutfağında bugün yaygın yemek, içecek ve tatlılar. Ölçüt bilinen en eski yazılı kayıttır, lezzetin kendisinin yaşı değil.
| Aday | Tarih | Kaynak yeri | Kesinlik | Kaynak |
|---|---|---|---|---|
| **Yoğurt** | 1072-1074 | Kaşgarlı Mahmud, *Divanü Lügati't-Türk* | yaklaşık (eserin tarihi) | ansiklopedi/akademik |
| **Ayran** (eşit) | 1072-1074 | aynı eser | yaklaşık **[DOĞRULANMALI]** | ansiklopedi |
| Baklava | 1473 (bazı kaynaklar 1474) | Topkapı Sarayı mutfak defteri, Fatih dönemi | yaklaşık | arşiv (ikincil kaynaklardan) |
| Türk kahvesi | 1554-1555 | Tahtakale'de ilk kahvehaneler (Peçevi'nin aktarımı) | yaklaşık | arşiv/tarih |
| Simit | 16. yy sonu (sık aktarılan "1593 Üsküdar kadı sicili" kaydı) | İstanbul | tartışmalı **[DOĞRULANMALI]**: kayıt bulunamadı | arşiv |
| Lokum | 1777 (Hacı Bekir dükkânı); tatlının kendisi daha eski olabilir | İstanbul | tartışmalı | ansiklopedi |
| Döner | 19. yy (Bursa ve Kastamonu iddiaları) | Anadolu | tartışmalı | ansiklopedi |
| Çay (Rize çayı) | 1924 tarım kanunu, ilk fabrika 1947 (içecek Osmanlı'da daha önce de biliniyordu) | Rize | tartışmalı | resmi |

`q.esit = ['yogurt','ayran']` olduğundan ikisi de TAM İSABET sayılır. Ayran DLT'de doğrulanamazsa aday listeden çıkar ya da tarihi düzeltilir. DLT'de geçen başka yiyecek adları (ör. tutmaç) da eşit doğru olur. Bunlar kaynakta tek tek doğrulanıp `esit`'e eklenmeden bu soru yayınlanmaz **[DOĞRULANMALI]**. O zamana kadar bu adlar `none` döndürür.
Invalid alias grupları:
- `kebap, yemek` → "Belirli bir yemek adı yaz."
- `pizza, hamburger` → "Türk mutfağı lezzeti yaz."

Bilgi kartları:
1. Kaşgarlı Mahmud'un 1072-1074'te yazdığı *Divanü Lügati't-Türk*'te "yogurt" sözcüğü geçer.
2. Baklavanın bilinen en eski kaydı, Fatih dönemine ait 1473 tarihli bir Topkapı Sarayı mutfak defteridir.
3. Peçevi'ye göre İstanbul'un ilk kahvehaneleri 1554-55'te Tahtakale'de açıldı.
4. Rize'de çay tarımı 1924 tarihli bir kanunla başladı; ilk çay fabrikası 1947'de açıldı.

Sahne: **SELÇUKLU · ORTA ÇAĞ** (E4).

### i04 · HİJYEN · "Kişisel bakımda kullanılan şu şeylerden en eskisi hangisi?"
Kapsam: banyo ve kişisel bakım eşyaları.
| Aday | Tarih | Yer | Kesinlik | Kaynak |
|---|---|---|---|---|
| **Ayna (obsidyen)** | ~MÖ 6000-5500 | Çatalhöyük | yaklaşık | arkeoloji |
| Tarak | bilinmiyor (çok erken örnekler var, tarihleri belirsiz) | n/a | bilinmiyor | n/a |
| Ustura | ~MÖ 3000 (bakır ustura); taş kesiciler daha eski | Mısır | yaklaşık | arkeoloji/ansiklopedi |
| Sabun | ~MÖ 2800 (kil tablette sabunsu madde tarifi) | Babil | yaklaşık | ansiklopedi |
| Sifonlu tuvalet | 1596 | İngiltere (John Harington) | kesin | ansiklopedi |
| Kolonya (Köln suyu) | 1709 | Köln (J. M. Farina) | yaklaşık | ansiklopedi |
| Diş fırçası (seri üretim) | 1780 civarı (W. Addis); misvak ve Çin kıllı fırçaları daha eski | İngiltere | tartışmalı | ansiklopedi |
| Tuvalet kâğıdı (paketli) | 1857 | ABD (Gayetty) | kesin | ansiklopedi |
| Şampuan (ticari) | 20. yy başı | Avrupa | yaklaşık | ansiklopedi |

Invalid alias grupları:
- `hamam` → "Hamam bir yer; içinde kullanılan bir eşya yaz."
- `su` → "Su icat değil."

Bilgi kartları:
1. Çatalhöyük'teki cilalı obsidyen aynalar dünyanın bilinen en eski aynaları arasındadır.
2. Babil'den kalma bir kil tablette yağ ve odun külüyle yapılan sabunsu bir karışım tarif edilir.
3. John Harington 1596'da sifonlu bir tuvalet tasarladı ve vaftiz annesi Kraliçe I. Elizabeth için kurdu.
4. Mimar Sinan'ın yaptığı Çemberlitaş Hamamı 1584'ten beri İstanbul'da hizmet veriyor.

Sahne: **NEOLİTİK KÖY** (E1).

### i05 · ULAŞIM · "Şu ulaşım araçlarından hangisi en eski?"
Kapsam: insanların ya da yüklerin taşındığı araçlar (hayvanlar dahil değil, binicilik dahil).
| Aday | Tarih | Yer | Kesinlik | Kaynak |
|---|---|---|---|---|
| **Kayık / kano** | ~MÖ 8000-7600 | Pesse, Hollanda | yaklaşık | arkeoloji (radyokarbon) |
| Yelkenli | ~MÖ 3500-3000 (Nil tasvirleri) | Mısır | tartışmalı | arkeoloji |
| At (binme) | ~MÖ 3500 (Botai) | Kazakistan | tartışmalı | arkeoloji |
| Tekerlekli araba | ~MÖ 3500-3300 | Mezopotamya ve Avrupa | yaklaşık | arkeoloji |
| Tren (buharlı lokomotif) | 1804 | Galler (Trevithick) | kesin | ansiklopedi |
| Vapur (ticari buharlı gemi) | 1807 (Fulton) | ABD | yaklaşık (öncesinde denemeler var) | ansiklopedi |
| Bisiklet | 1817 | Almanya (Drais) | kesin | ansiklopedi |
| Metro | 1863 | Londra | kesin | ansiklopedi |
| Otomobil | 1886 | Almanya (Benz patenti) | kesin | patent |
| Uçak | 1903 | ABD (Wright) | kesin | ansiklopedi |
| Helikopter | 1939 | ABD (Sikorsky VS-300) | yaklaşık | ansiklopedi |

Invalid alias grupları:
- `yürümek, ayak` → "Bir araç yaz."
- `araç, taşıt` → "Belirli bir araç yaz."

Bilgi kartları:
1. Hollanda'daki Pesse kanosu 1955'te bir otoyol yapımında bulundu; yaklaşık 10.000 yaşındadır.
2. Slovenya'daki Ljubljana Bataklığı'nda bulunan ahşap tekerlek yaklaşık 5.150 yıllıktır.
3. Karl Drais'in 1817'deki "koşu makinesi"nin pedalı yoktu; ayakla itilerek gidiliyordu.
4. Wright kardeşlerin 17 Aralık 1903'teki ilk motorlu uçuşu 12 saniye sürdü.

Sahne: **NEOLİTİK KÖY**, *göl kıyısı varyantı* (E1). Not: MÖ 8000 Kuzey Avrupa'da kültürel olarak Mezolitik'tir. Çağ basamakları **tarihe** göre seçildiğinden E1 kullanılır ve sahne tarım değil göl ve kano gösterir.

### i06 · İSTANBUL (Türkiye'ye özgü) · "İstanbul'da şu toplu taşıma hizmetlerinden hangisi EN ÖNCE başladı?"
Kapsam: tarifeli ve hatlı toplu taşıma.
| Aday | Tarih | Kesinlik | Kaynak |
|---|---|---|---|
| **Vapur (buharlı yolcu gemisi)** | 1837 (Boğaz'da ilk özel buharlı vapurlar); 1844 devlet işletmesi Marmara seferleri; 1851 Şirket-i Hayriye | tartışmalı (yilMin 1837, yilMax 1851) | akademik/ansiklopedi (İstanbul Tarihi, istanbultarihi.ist) |
| Atlı tramvay | 1871 (Azapkapı–Beşiktaş) | kesin | akademik |
| Banliyö treni | 1870'ler | tartışmalı **[DOĞRULANMALI]** | ansiklopedi |
| Tünel (Karaköy–Beyoğlu) | 1875 | kesin | ansiklopedi |
| Elektrikli tramvay | 1914 | kesin | akademik |
| Otobüs (belediye) | 1920'ler | tartışmalı **[DOĞRULANMALI]** | n/a |
| Troleybüs | 1961 | yaklaşık | ansiklopedi |
| Hafif metro | 1989 | yaklaşık | ansiklopedi |
| Metro (M2) | 2000 | yaklaşık | ansiklopedi |
| Metrobüs | 2007 | kesin | resmi |
| Marmaray | 2013 | kesin | resmi |

Invalid alias grupları:
- `kayık, sandal, pazar kayığı` → "Kayıklar çok eskiden beri vardı ama tarifeli hat değildi."
- `taksi, dolmuş` → "Tarifeli hat değil."

Bilgi kartları:
1. 1875'te açılan Tünel, Londra'dan sonra dünyanın en eski ikinci yeraltı raylı sistemidir.
2. İstanbul'un ilk atlı tramvayı 1871'de Azapkapı ile Beşiktaş arasında çalışmaya başladı.
3. Boğaz'da buharlı yolcu vapurları 1830'larda görülmeye başladı; Şirket-i Hayriye 1851'de kuruldu.
4. Marmaray 2013'te açıldı ve İstanbul'un iki yakasını deniz altından raylı sistemle bağladı.

Sahne: **19. YÜZYIL İSTANBUL** (E6). Martı vapur rıhtımında, markayla en uyumlu sahne.

### i07 · İLETİŞİM · "Şu iletişim yollarından hangisi en eski?"
Kapsam: uzaktaki birine haber ulaştırmak için icat edilen yollar (konuşma, işaret dili, resim değil).
| Aday | Tarih | Yer | Kesinlik | Kaynak |
|---|---|---|---|---|
| **Yazı / mektup (kil tablet)** | ~MÖ 3200 (yazının ortaya çıkışı) | Uruk, Mezopotamya | yaklaşık | arkeoloji |
| Posta (ulak sistemi) | MÖ 6. yy | Pers İmparatorluğu | yaklaşık | ansiklopedi |
| Posta güvercini | bilinmiyor (antik çağdan beri) | n/a | bilinmiyor | n/a |
| Telgraf | 1837-1844 (Morse'un ilk mesajı 1844) | ABD | kesin | ansiklopedi |
| Faks | 1843 | İskoçya (Alexander Bain patenti) | kesin | patent |
| Telefon | 1876 | ABD (Bell patenti) | kesin | patent |
| Radyo | 1895-1896 | Marconi | yaklaşık | ansiklopedi |
| Televizyon | 1926 | Londra | kesin | ansiklopedi |
| İnternet (ARPANET) | 1969 | ABD | kesin | ansiklopedi |
| E-posta | 1971 | ABD (Tomlinson) | kesin | ansiklopedi |
| Cep telefonu | 1973 | ABD (Martin Cooper) | kesin | ansiklopedi |
| SMS | 1992 | İngiltere | kesin | ansiklopedi |

Invalid alias grupları:
- `konuşmak, dil, işaret, mağara resmi, duman` → "Bu bir icat değil ya da uzağa haber taşımaz; bir iletişim aracı yaz."

Duman işareti tartışmaya açık bir sınır durumudur ve karar 5 ile birlikte gözden geçirilir.

Bilgi kartları:
1. Bilinen en eski yazı örnekleri yaklaşık MÖ 3200'de Mezopotamya'daki Uruk kentinde kil tabletlere yazıldı.
2. Faksın patenti 1843'te alındı; yani telefondan 33 yıl daha eski.
3. Martin Cooper 3 Nisan 1973'te elde taşınan bir telefonla ilk aramayı yaptı.
4. Türkiye 12 Nisan 1993'te ODTÜ üzerinden internete bağlandı.

Sahne: **MEZOPOTAMYA · MISIR** (E2).

### i08 · CUMHURİYET (yerli) · "Cumhuriyet döneminde Türkiye'de tasarlanıp yapılan şu taşıt ve cihazlardan hangisi EN ÖNCE ortaya çıktı?"
Kapsam: 1923 sonrası Türkiye'de tasarlanan ya da üretilen taşıt, uçak ve ev aletleri. Kurum ve hizmetler kapsam dışıdır, çünkü Anadolu Ajansı (1920) gibi kurumlar Vecihi'den eskidir. 1923-1925 arasında daha eski bir yerli taşıt ya da cihaz olmadığı birincil kaynakla teyit edilmeli **[DOĞRULANMALI]**.
| Aday | Tarih | Kesinlik | Kaynak |
|---|---|---|---|
| **Vecihi K-VI uçağı** | 28 Ocak 1925 ilk uçuş, İzmir | kesin | ansiklopedi (TÜBİTAK, Wikipedia) |
| Nu.D.36 uçağı (Nuri Demirağ) | 1936 | yaklaşık | ansiklopedi |
| Çamaşır makinesi (Arçelik Ç-1) | 1959 | kesin | şirket kaynağı |
| Buzdolabı (Arçelik) | 1960 | kesin | şirket kaynağı |
| Devrim otomobili | 1961 | kesin | ansiklopedi |
| Anadol | 1966 | kesin | ansiklopedi |
| Murat 124 | 1971 | kesin | ansiklopedi |

Invalid alias grupları:
- `radyo, istanbul radyosu, trt, televizyon yayını, thy, türk hava yolları` → "Bu bir kurum ya da yayın; taşıt ya da cihaz yaz."

Bilgi kartları:
1. Vecihi Hürkuş kendi yaptığı K-VI uçağıyla 28 Ocak 1925'te İzmir'de izin beklemeden yaklaşık 15 dakika uçtu.
2. Nuri Demirağ'ın fabrikasında yapılan Nu.D.36 eğitim uçağı 1936'da uçtu.
3. Devrim otomobilleri 1961'de Eskişehir'de 129 günde yapıldı.
4. Anadol, 1966'da seri üretime giren ilk Türk otomobilidir ve gövdesi cam elyafındandı.

Sahne: **ERKEN CUMHURİYET EVİ** (E7).

### i09 · GİYİM · "Şu giyim eşyalarından hangisi en eski?"
Kapsam: belirli bir giyim parçası ya da giysi aksesuarı (genel "giysi" değil, dikiş aleti değil).
| Aday | Tarih | Yer | Kesinlik | Kaynak |
|---|---|---|---|---|
| **Ayakkabı / sandalet** | ~10.500-9.300 yıl önce | Fort Rock Mağarası, Oregon, ABD | yaklaşık | arkeoloji (radyokarbon) |
| Şapka / başlık | ~MÖ 3300 (Ötzi'nin ayı postu başlığı) | Alpler | yaklaşık | arkeoloji |
| Kemer | ~MÖ 3300 (Ötzi) | Alpler | yaklaşık | arkeoloji |
| Düğme (süs) | MÖ 3. binyıl; ilikli düğme 13. yy | İndus Vadisi / Avrupa | yaklaşık | arkeoloji/ansiklopedi |
| Pantolon | ~3.000 yıl önce | Yanghai, Çin | yaklaşık | arkeoloji (Beck ve ark., 2014) |
| Çorap | MS 3.-5. yy (örme) | Mısır | yaklaşık | arkeoloji |
| Sütyen | 15. yy buluntusu; modern patent 1914 | Lengberg Şatosu (Avusturya) / ABD | tartışmalı | arkeoloji/patent |
| Kot pantolon | 1873 | ABD (Strauss–Davis patenti) | kesin | patent |
| Fermuar | 1893 (Judson); modern 1913 (Sundback) | ABD | kesin | patent |
| Naylon çorap | 1939-1940 | ABD | kesin | ansiklopedi |

Invalid alias grupları:
- `giysi, elbise, kıyafet` → "Belirli bir giyim parçası yaz (ör. ayakkabı, şapka)."
- `iğne` → "İğne dikiş aleti; giyim parçası yaz."

Bilgi kartları:
1. Oregon'daki Fort Rock Mağarası'nda bulunan, yaklaşık 10.000 yıllık sandaletler en eski ayakkabılar arasındadır.
2. Ermenistan'daki Areni-1 Mağarası'nda 5.500 yıllık, deriden yapılmış bir ayakkabı bulundu.
3. 1991'de Alpler'de bulunan Ötzi'nin yanında ayı postu bir başlık ve deri ayakkabılar vardı.
4. Bilinen en eski pantolonlar Çin'de bulundu ve yaklaşık 3.000 yıllıktır.

Sahne: **NEOLİTİK KÖY** (E1).

### i10 · OYUN / OYUNCAK · "Şu oyun ve oyuncaklardan hangisi en eski?"
Kapsam: bir nesneyle oynanan oyunlar ve oyuncaklar (saklambaç gibi nesnesiz oyunlar değil).
| Aday | Tarih | Yer | Kesinlik | Kaynak |
|---|---|---|---|---|
| **Senet (tahta oyunu)** | ~MÖ 3100 | Mısır | yaklaşık | arkeoloji |
| Zar | ~MÖ 2800-2500 (aşık kemikleri daha eski olabilir) | Şehr-i Suhte, İran | tartışmalı | arkeoloji |
| Ur Kraliyet Oyunu | ~MÖ 2600 | Ur, Irak (British Museum) | yaklaşık | arkeoloji |
| Yo-yo | ~MÖ 500 (vazo resmi) | Antik Yunan | yaklaşık | arkeoloji |
| Uçurtma | ~MÖ 5.-4. yy | Çin | tartışmalı | ansiklopedi |
| Tavla (nard) | Sasani dönemi kaydı (MS 6. yy civarı); daha eski atası iddiaları tartışmalı | İran | tartışmalı | ansiklopedi |
| Satranç (çaturanga) | ~MS 6. yy | Hindistan | yaklaşık | ansiklopedi |
| Oyuncak bebek | bilinmiyor | n/a | bilinmiyor | n/a |
| LEGO tuğlası | 1958 | Danimarka (patent) | kesin | patent |
| Rubik küpü | 1974 | Macaristan | kesin | ansiklopedi |

Invalid alias grupları:
- `oyun, oyuncak` → "Belirli bir oyun ya da oyuncak yaz."
- `futbol, top` → kapsam kararı: kapsama alınırsa aday olur. Top çok eski ama tarihi bilinmiyor, `bilinmiyor` adayı olarak eklenmesi önerilir.

Bilgi kartları:
1. Ur Kraliyet Oyunu yaklaşık 4.500 yıllıktır; kuralları çok sonraki bir kil tabletten çözüldü.
2. Mısırlıların Senet oyunu yaklaşık 5.000 yıl önce oynanıyordu.
3. Rubik küpü 1974'te bir mimarlık hocası olan Ernő Rubik tarafından yapıldı.
4. Bugünkü LEGO tuğlasının patenti 1958'de alındı.

Sahne: **MEZOPOTAMYA · MISIR** (E2). `zorluk:3` (doğru cevap az bilinir).

### i11 · AYDINLATMA / ISINMA · "Evi ısıtan ya da aydınlatan şu şeylerden hangisi en eski?"
Kapsam: barınağı ısıtmak ya da aydınlatmak için kullanılan şey ve aletler (güneş, giysi değil).
| Aday | Tarih | Yer | Kesinlik | Kaynak |
|---|---|---|---|---|
| **Ocak / ateş (kontrollü ateş)** | ~1 milyon yıl önce (en eski kabul gören kanıt); daha eski iddialar var | Wonderwerk Mağarası, Güney Afrika | tartışmalı | arkeoloji (Berna ve ark., *PNAS*, 2012) |
| Kandil (taş yağ kandili) | ~17.000 yıl önce | Lascaux, Fransa | yaklaşık | arkeoloji |
| Mum | bilinmiyor (Roma döneminde kullanılıyordu) | n/a | bilinmiyor | ansiklopedi |
| Mangal | bilinmiyor | n/a | bilinmiyor | n/a |
| Soba (Franklin sobası) | 1742 (daha eski kapalı sobalar var) | ABD | tartışmalı | ansiklopedi |
| Gaz lambası | 1853 | Lviv (Łukasiewicz) | yaklaşık | ansiklopedi |
| Ampul | 1879 | ABD (Edison; Swan da eşzamanlı) | kesin | patent |
| El feneri | 1899 | ABD | yaklaşık | patent |
| Klima | 1902 | ABD (Carrier) | kesin | ansiklopedi |
| Elektrik (Türkiye) | 1902 Tarsus (kaynaklar 1902-1910 arası farklı) | Tarsus | tartışmalı | akademik |

Bilgi kartları:
1. Güney Afrika'daki Wonderwerk Mağarası'nda yaklaşık 1 milyon yıllık yanmış kemik ve bitki külü bulundu.
2. Fransa'daki Lascaux Mağarası'nda içinde hayvan yağı yakılan taş kandiller bulundu.
3. İstanbul'un ilk büyük elektrik santrali Silahtarağa 1914'te elektrik vermeye başladı; bugün santralistanbul müzesidir.
4. Willis Carrier klimayı 1902'de bir matbaadaki nemi kontrol etmek için tasarladı.

Sahne: **TAŞ DEVRİ** (E0). Ateş ışığı bu sahnenin baş animasyonudur.

### i12 · YAZI GEREÇLERİ · "Şu yazı gereçlerinden hangisi en eski?"
Kapsam: yazı yazmak için kullanılan alet ve yüzeyler (taşa kazıma ve boya resmi değil).
| Aday | Tarih | Yer | Kesinlik | Kaynak |
|---|---|---|---|---|
| **Kamış kalem** (çivi yazısı kalemi dahil) | ~MÖ 3200 | Uruk, Mezopotamya; Mısır'da ~MÖ 3000 | yaklaşık | arkeoloji/ansiklopedi |
| **Kil tablet** (eşit) | ~MÖ 3200 | Uruk, Mezopotamya | yaklaşık | arkeoloji |
| Papirüs | ~MÖ 3000 (Hemaka mezarındaki boş rulo) | Sakkara, Mısır | yaklaşık | arkeoloji |
| Mürekkep | bilinmiyor (MÖ 3. binyıl Mısır ve Çin) | n/a | bilinmiyor | ansiklopedi |
| Kâğıt | geleneksel MS 105 (Cai Lun); daha eski parçalar MÖ 2. yy | Çin | tartışmalı | arkeoloji |
| Kurşun kalem | 1560'lar | İngiltere | yaklaşık | ansiklopedi |
| Silgi (kauçuk) | 1770 | İngiltere (Priestley) | yaklaşık | ansiklopedi |
| Dolma kalem | 1827 (Poenaru patenti) | Paris | yaklaşık | patent |
| Daktilo | 1868 | ABD (Sholes patenti) | kesin | patent |
| Tükenmez kalem | 1938 | Bíró patenti | kesin | patent |
| F klavye | 1955 | Türkiye (İhsan Sıtkı Yener) | kesin | resmi/ansiklopedi |

Genel "kalem" sözcüğü kamış kaleme eşlenir (3.3). `q.esit = ['kamis_kalem','kil_tablet']`. Papirüs aynı çağda (E2) olduğu için AYNI ÇAĞ (70) alır. i07 ile tutarlıdır: ikisi de yazının başlangıcını ~MÖ 3200 Uruk olarak verir.
Bilgi kartları:
1. Mezopotamya'da ilk yazılar, ucu kesilmiş kamış kalemlerle ıslak kil tabletlere bastırılarak yazıldı.
2. Mısır'da Hemaka'nın yaklaşık 5.000 yıllık mezarında hiç yazılmamış bir papirüs rulosu bulundu.
2. Joseph Priestley 1770'te kauçuğun kurşun kalem izini sildiğini fark etti; İngilizce adı "rubber" buradan gelir.
4. Türkçeye göre tasarlanan F klavye 1955'te standart kabul edildi; öncüsü İhsan Sıtkı Yener'dir.

Sahne: **MEZOPOTAMYA · MISIR** (E2).

### i13 · TÜRKİYE'YE GELİŞ · "Şu ELEKTRİKLİ yeniliklerden hangisi Osmanlı'da / Türkiye'de EN ÖNCE kullanılmaya başlandı?"
Kapsam: elektrikle çalışan yenilikler. "Elektrikli" sınırı fotoğraf ve buharlı gemi gibi daha eski ama elektriksiz yenilikleri dışarıda tutar.
| Aday | Tarih | Kesinlik | Kaynak |
|---|---|---|---|
| **Telgraf** | 1855 (İstanbul–Edirne–Şumnu hattı; bazı kaynaklar İstanbul–Edirne kısmını 1854'e koyar) | yaklaşık | akademik/arşiv |
| Elektrik üretimi | 1902 Tarsus (kaynaklar 1902-1910) | tartışmalı | akademik |
| Telefon santrali (İstanbul) | 1900'lerin ilk çeyreği | tartışmalı **[DOĞRULANMALI]** | n/a |
| Elektrikli tramvay | Şubat 1914 | kesin | akademik |
| Radyo yayını | 1927 | kesin | resmi |
| Televizyon (deneme) | 1952 (İTÜ) | yaklaşık | ansiklopedi |
| Televizyon (TRT) | 31 Ocak 1968 | kesin | resmi |
| Renkli yayın | 1981 deneme, 1984 düzenli | tartışmalı | ansiklopedi |
| İnternet | 12 Nisan 1993 | kesin | akademik |
| Cep telefonu | 23 Şubat 1994 | kesin | basın/ansiklopedi |

Invalid alias grupları:
- `fotoğraf, vapur, tren` → "Bu yenilik elektrikli değil."

Bilgi kartları:
1. Osmanlı'nın ilk telgraf hattı Kırım Savaşı sırasında, 1855'te İstanbul–Edirne–Şumnu arasında açıldı.
2. İTÜ 1952'de Türkiye'nin ilk deneme televizyon yayınlarını yaptı.
3. Türkiye'de ilk cep telefonu görüşmesi 23 Şubat 1994'te yapıldı.
4. Türkiye internete 12 Nisan 1993'te ODTÜ üzerinden bağlandı.

Sahne: **19. YÜZYIL İSTANBUL** (E6), telgraf direkleri ön planda.

### i14 · TEKNOLOJİ (yakın dönem) · "Şu cihaz ve hizmetlerden hangisi dünyada EN ÖNCE piyasaya çıktı?"
Kapsam: 1979 sonrası tüketici teknolojisi. Kapsam satırı bunu söyler, böylece "telefon" gibi eski şeyler `invalid` olur.
| Aday | Tarih | Kesinlik | Kaynak |
|---|---|---|---|
| **Walkman** | 1 Temmuz 1979 | kesin | ansiklopedi |
| CD | 1982 | kesin | ansiklopedi |
| Ticari cep telefonu (DynaTAC) | 1983 | kesin | ansiklopedi |
| Game Boy | 1989 | kesin | ansiklopedi |
| World Wide Web | 1991 (halka açılış) | yaklaşık | ansiklopedi |
| DVD | 1996 | yaklaşık | ansiklopedi |
| USB bellek | 2000 | yaklaşık | ansiklopedi |
| iPod | 2001 | kesin | ansiklopedi |
| YouTube | 2005 | kesin | ansiklopedi |
| iPhone (akıllı telefon dalgası) | 2007 | kesin | ansiklopedi |
| Tablet (iPad) | 2010 | kesin | ansiklopedi |

Invalid alias grupları:
- `telefon, radyo, televizyon` → "Bu 1979'dan önce vardı; listedeki dönemden bir cihaz yaz."

Bilgi kartları:
1. Taşınabilir kasetçalar dönemi 1 Temmuz 1979'da piyasaya çıkan Walkman ile başladı.
2. Müzik CD'leri 1982'de satışa çıktı.
3. World Wide Web 1991'de herkesin kullanımına açıldı.
4. Dokunmatik akıllı telefon dalgası 2007'de başladı.

Sahne: **1970-80'LER** (E9). Bu soru yakın dönem sahnesini doğru cevap sahnesi olarak kullanır. **Not:** Marka adları kartta yalnız tarih bilgisi olarak geçer, sahnede logo ya da ürün kopyası çizilmez (bkz. 9).

### i15 · CUMHURİYET (ev) · TASLAK · "1950 sonrasında Türkiye'de seri üretilen ilk ev aletleri ve otomobillerden hangisi EN ÖNCE çıktı?"
Kapsam: 1950 sonrası Türkiye'de seri üretilen ev aletleri ve otomobiller. **Taslak:** 1950-1959 arasında daha eski bir yerli seri üretim ev aleti ya da otomobil olmadığı teyit edilmeden yayınlanmaz **[DOĞRULANMALI]**.
| Aday | Tarih | Kesinlik | Kaynak |
|---|---|---|---|
| **Çamaşır makinesi (Arçelik Ç-1)** | 1959 | kesin | şirket kaynağı |
| Buzdolabı (Arçelik) | 1960 | kesin | şirket kaynağı |
| Devrim otomobili | 1961 | kesin | ansiklopedi |
| Anadol | 1966 | kesin | ansiklopedi |
| Murat 124 | 1971 | kesin | ansiklopedi |

Kapsam dar ve aday sayısı az olduğundan `check.js` bu soruya `minAday: 5` istisnası tanır. Sahne: **1950-60'LAR** (E8).

Bilgi kartları:
1. Arçelik'in Ç-1 adlı ilk çamaşır makinesi 1959'da üretildi.
2. Arçelik'in ilk buzdolabı 1960'ta tanıtıldı.
3. Devrim otomobilleri 1961'de Eskişehir'de 129 günde yapıldı.
4. Tofaş'ın Murat 124 modeli 1971'de Bursa'da üretilmeye başlandı.

### Sahne kapsamı özeti
| Çağ | Doğru cevap olarak açan sorular |
|---|---|
| E0 TAŞ DEVRİ | i01, i02, i11 |
| E1 NEOLİTİK | i04, i05, i09 |
| E2 MEZOPOTAMYA·MISIR | i07, i10, i12 |
| E3 ROMA·BİZANS | (yok: havuz genişletmede yazılacak; ör. "hamamda kullanılanlar") |
| E4 SELÇUKLU·ORTA ÇAĞ | i03 |
| E5 OSMANLI | (yok: aday "İstanbul keyif ritüelleri: kahvehane 1554-55") |
| E6 19. YY | i06, i13 |
| E7 ERKEN CUMHURİYET | i08 |
| E8 1950-60'LAR | i15 |
| E9 1970-80'LER | i14 |
| E10 1990-2000'LER | (yalnız yanlış cevap durağı) |
| E11 GÜNÜMÜZ | soru fazı arka planı |

"En eski" sorusunun doğası çoğu cevabı tarih öncesine çeker. Modern sahnelerin de doğru cevap olarak görünmesi için havuzun en az %30'u **dar dönem kapsamlı** sorulardan oluşmalıdır (i08, i13, i14, i15 gibi).

---

## 5. Dönem sahneleri kataloğu

### 5.1 Çağ tablosu (`ICAT_ERAS`, `data/icat_esya.js`)
| # | id | Ad (banner) | Başlangıç | Bitiş |
|---|---|---|---|---|
| E0 | `tas` | TAŞ DEVRİ | −∞ | MÖ 10.000 |
| E1 | `neolitik` | NEOLİTİK KÖY | MÖ 10.000 | MÖ 3500 |
| E2 | `tunc` | MEZOPOTAMYA · MISIR | MÖ 3500 | MÖ 800 |
| E3 | `antik` | ROMA · BİZANS | MÖ 800 | MS 600 |
| E4 | `ortacag` | SELÇUKLU · ORTA ÇAĞ | 600 | 1450 |
| E5 | `osmanli` | OSMANLI KONAĞI | 1450 | 1800 |
| E6 | `yy19` | 19. YÜZYIL İSTANBUL | 1800 | 1923 |
| E7 | `cumhuriyet` | ERKEN CUMHURİYET EVİ | 1923 | 1950 |
| E8 | `altmislar` | 1950-60'LAR | 1950 | 1970 |
| E9 | `seksenler` | 1970-80'LER | 1970 | 1990 |
| E10 | `doksanlar` | 1990-2000'LER | 1990 | 2007 |
| E11 | `gunumuz` | GÜNÜMÜZ | 2007 | +∞ |

Aralıklar `[bas, bit)` biçimindedir. `eraOf(yil)` ilk eşleşen çağı döndürür. Çağlar **takvim aralığıdır**, kültür evresi değil. Sahne tarifleri bu yüzden genel ve "o dönemin dünyası" duygusunu verecek biçimde tutulur.

### 5.2 Sahne tarifleri (384×216, tamsayı ölçekli, mevcut `GEO.W/H`)
Her sahne üç katmandan oluşur: **arka** (gök, uzak silüet; statik önbellek), **orta** (mimari ve iç mekân; statik önbellek), **ön** (eşyalar ve canlı ayrıntılar; her kare çizilir). Statik katmanlar ilk ziyarette `makeCanvas(384,216)` üzerine bir kez çizilir. Palet sahne başına 5-6 renktir, mürekkep rengi olarak mevcut `PAL.ink #1a1128` paylaşılır ve dither mevcut `BAYER4` / `ditherRect` ile yapılır. Tüm çizimler **özgündür**. Müze nesneleri, logolar ve mağara resimleri birebir kopyalanmaz, yalnız "esinlenme" vardır.

| Çağ | Palet | Arka / orta / ön | Canlı ayrıntılar ve animasyon | Işık | Martı |
|---|---|---|---|---|---|
| **E0 TAŞ DEVRİ** | `#1b1420` kaya koyu, `#3b2a2f`, `#6b4a3a`, `#c0703a` köz, `#ffd27a` alev, `#8a9aa8` dış gün | Arka: sağda mağara ağzı, dışarıda soluk vadi ve tek bulut. Orta: kaya duvarda kırmızı okr el izleri ve özgün bir geyik figürü. Ön: ocak ateşi, taş aletler, kül üstünde ot yatak. | Alev 3 kare/8 fps; duman pikselleri yükselip söner; ateş ışığı yarıçapı ±3 px nabız atar (dither halka); mağara ağzından ara sıra kuş sürüsü (`drawFlocks` uyarlaması). | Sıcak, merkezden dışa; köşeler `#1b1420` vinyet | Ocak yanındaki kaya çıkıntısında; aksesuar yok |
| **E1 NEOLİTİK KÖY** | `#e8d6b0` kerpiç, `#c49a6c`, `#8a5a3a`, `#a33a2a` boya kırmızısı, `#9cc0d8` gök, `#4a3a2a` | Arka: geniş ova, uzakta iki tepeli dağ silüeti. Orta: bitişik, düz damlı kerpiç evler; **kapı yok, damdan merdivenle giriş** (Çatalhöyük'ün bilinen özelliği). Duvarda geometrik kırmızı desen. Ön: kil fırın, öğütme taşı, ışıkta parlayan obsidyen ayna. *Göl varyantı* (i05): kıyıda kütük kano, sazlık. | Damdan ince duman; keçi kuyruğu 2 kare; aynada 4 sn'de bir yıldız parıltısı; sazlar rüzgârla 1 px salınır. | Öğle, sert gölge, sağdan güneş | Merdivenin tepesinde |
| **E2 MEZOPOTAMYA · MISIR** | `#f2d28a` kum, `#c9963f`, `#7a5a2a`, `#2f6f8f` nehir, `#e86a3a` akşam, `#2b2436` | Arka: basamaklı tapınak silüeti ve palmiyeler. Orta: kerpiç avlu, çömlekçi çarkı, papirüs sazlığı. Ön: kil tablet ve kamış kalem, oyun tahtası. | Nehirde sazdan kayık kayar; palmiye yaprakları salınır; ısı titremesi (alt 20 satırda yatay ±1 px); çömlekçi çarkı döner. | Gün batımı turuncusu | Avlu duvarının üstünde |
| **E3 ROMA · BİZANS** | `#efe6d6` mermer, `#b8a890`, `#8a3b3b` kiremit, `#3f6a8a` mozaik mavi, `#d9a441` altın, `#2a2030` | Arka: kemerli revak ve servi. Orta: hamam salonu, sıcak havuz. Ön: mozaik zemin (özgün geometrik), amfora, yağ kandili. | Havuzdan buhar pikselleri; kandil alevi; suda dalgalı yansıma (mevcut `drawWaterSurface` mantığının küçültülmüşü). | Yüksek pencereden ışık huzmesi (mevcut `rayAlpha` fikri) | Amforanın ağzında, küçük defne tacı |
| **E4 SELÇUKLU · ORTA ÇAĞ** | `#2a3a5a` lacivert, `#3f8aa0` firuze, `#e8d6b0` taş, `#8a5a3a` ahşap, `#c9821f` kehribar, `#1a1428` | Arka: gece göğü, yıldızlar (mevcut `drawStars`). Orta: kervansaray avlusu, geometrik desenli taçkapı (özgün yıldız örgüsü). Ön: kandil, halı, el yazması, deve silüeti. | Kandil alevi; avlu çeşmesinden damlalar; yıldız kırpışması; deve başı ara sıra iner ve kalkar. | Gece, sıcak kandil havuzları | Taçkapı kemerinin tepesinde |
| **E5 OSMANLI KONAĞI** | `#6a2a2a` bordo, `#c9a35a` altın, `#f1ece2` sıva, `#2f5a40` yeşil, `#8a4f35` ahşap, `#1a1128` | Arka: kafesli pencereden Haliç ve kubbe-minare silüeti (mevcut `drawMosqueStatic` küçültülerek). Orta: sedirli oda, yüklük, çini pano. Ön: mangal, cezve ve fincan. | Cezveden buhar; mangal közü nabız atar; kafes arkasında kayık geçer (**vapur yok**, 1851 öncesi). | Akşamüstü, kafesten süzülen benekli ışık | Pencere pervazında |
| **E6 19. YY İSTANBUL** | `#3a2f4f`, `#e8b6b8` gün batımı, `#ffcf6b` gaz lambası, `#2a2a3a`, `#e8e2d8` vapur, `#a84c45` | Arka: Galata silüeti (mevcut `drawGalataStatic` yeniden kullanılır). Orta: Karaköy rıhtımı, vapur (mevcut `drawFerry` yeniden kullanılır), atlı tramvay. Ön: gaz lambası direği, telgraf direği ve telleri. | Vapur bacası dumanı; at kuyruğu ve tramvay 0,5 px/kare kayar; gaz lambası alevi titrer; telgraf telinde serçeler. | Alacakaranlık, lambalar yanar | Telgraf telinde, küçük **fes** (1829-1925 arası doğru) |
| **E7 ERKEN CUMHURİYET EVİ** | `#f0e2c0` krem duvar, `#7a4a2a` ceviz, `#2f4a6a` koyu mavi, `#e8d9a0` lamba, `#c03a3a` (az), `#2a2030` | Arka: pencereden Ankara ya da İstanbul sokağı ve tramvay teli. Orta: lambalı ahşap radyo, duvar saati, Latin harfli takvim yaprağı, soba ve borusu. Ön: dantel örtü, minder, terlik. | Radyo kadranı ışığı yavaşça nabız atar ve hoparlörden 3 piksellik "ses dalgası" çıkar; soba kapağı aralığında alev; duvar saati sarkacı; perde salınır. | Akşam, sarı ampul tepede | Radyonun üstünde, küçük **fötr şapka** (1925 Şapka Kanunu sonrası doğru) |
| **E8 1950-60'LAR** | `#f2c4a0` şeftali, `#8fc0b0` mint, `#e8e2d8`, `#c94a3a`, `#3a4a6a`, `#2a2030` | Arka: apartman penceresinden Boğaz ve vapur. Orta: yuvarlak köşeli buzdolabı, pikap, ayaklı radyo. Ön: sehpa, 45'lik plaklar. | Plak döner; pikap kolu iner; perde rüzgârla salınır; sokaktan özgün siluetli bir araba geçer. | Gündüz, pastel | Buzdolabının üstünde |
| **E9 1970-80'LER** | `#c98a3a` hardal, `#7a5a2a` kahve, `#3a6a4a` yeşil, `#e8d6b0` bej, `#6ad0ff` TV ışığı, `#1a1428` | Arka: perde arkasında gece. Orta: ahşap kaplı tüplü TV, çevirmeli telefon, kaset çalar, vitrin. Ön: dantel üstünde şekerlik, halı. | TV ekranında karlanma ve özgün bir test deseni (**TRT logosu kopyalanmaz**); TV mavi ışığı odaya dither ile vurur; kaset makaraları döner. | Gece, TV tek ışık kaynağı | TV antenine tünemiş |
| **E10 1990-2000'LER** | `#c0c0c8` bej-gri plastik, `#3a6aa8`, `#e84a5f`, `#5fd068` ekran yeşili, `#f6c445`, `#2a2030` | Orta: CRT monitörlü masaüstü bilgisayar, modem, tuşlu cep telefonu. Ön: disket, kulaklık. | Monitörde imleç yanıp söner; modem ışıkları; cep telefonu titreşir (±1 px). | Masa lambası | Monitörün üstünde |
| **E11 GÜNÜMÜZ** (soru fazı) | Mevcut Boğaz gün batımı (`PAL.sun*`, `water*`) + `#f6f1e7` duvar, `#5ab8e8` ekran, `#2a2436` | Arka: büyük pencereden Boğaz köprüsü (mevcut `caches.bridge` 1/2 ölçekte kırpılır). Orta: düz TV, raf. Ön: şarjdaki akıllı telefon, robot süpürge. | Robot süpürge yavaşça gezinir; telefon bildirim ışığı; pencerede vapur (`drawFerry`). | Gün batımı | Pencere pervazında (beklerken kafa sallar) |

### 5.3 scene.js genişletmesi
`scene.js` 96 KB'tır. Sahne çizimleri ayrı bir dosyaya konur ve `scene.js` yalnız kancaları taşır.

**Yeni dosya `v2/eras_scene.js`:**
```js
root.EraScenes = {
  ids: ['tas','neolitik','tunc','antik','ortacag','osmanli','yy19','cumhuriyet','altmislar','seksenler','doksanlar','gunumuz'],
  buildStatic: function (eraId, variant, H) { /* makeCanvas ile arka+orta katman, önbellek döner */ },
  drawLive:    function (ctx, eraId, variant, t, H) { /* ön katman ve animasyonlar */ },
  perch:       { tas:{x:150,y:120}, /* … */ gunumuz:{x:250,y:118} },
  accessory:   { yy19:'fes', cumhuriyet:'fotr', antik:'defne' }
};
```
`H`, `scene.js`'in dışa verdiği yardımcı paketidir: `{ px, fillPolyPx, fillCirclePx, fillDomePx, ditherRect, drawSprite, shade, lerpColor, makeCanvas, BAYER4, GEO, PAL, drawFerry, drawMosqueStatic, drawGalataStatic, caches }`. Böylece çizim kodu yinelenmez. `index.html` içinde `eras_scene.js`, `scene.js`'ten **önce** yüklenir. Fonksiyonlar çağrı anında `H` aldığından sıra sorunu olmaz.

**`scene.js` içindeki kancalar (küçük ve yerel):**
1. `getZonesForMode(m)`: `if (m === 'icat') return [];`. Bugün bilinmeyen mod zirve bölgelerine düşer (satır 1048), bu kanca o yüzden şart. Ayrıca `game.js`, ZAMAN modunda `Scene.setScore` çağırmaz.
2. `render(t)` başına: `if (mode === 'icat') { renderIcat(t); return; }`.
3. `renderIcat(t)` şunları yapar: aktif çağın statik önbelleğini çizer, `EraScenes.drawLive` çağırır, geçiş katmanını uygular (aşağıda), martıyı çizer, ardından `drawSparklesAndSmoke(t)` ve `drawZoneBanner(t)` gelir. Banner mevcut `banner = {text, sub, startTime}` mekanizmasıyla gösterilir, örneğin `{text:'TAŞ DEVRİ', sub:'3,3 MİLYON YIL ÖNCE'}`.
4. `drawGull(t)`: `GEO.GULL_X/Y` sabitine bağlıdır. `icatGullPos` (null değilse) önceliklidir, aksesuar için `drawGullSprite` sonrası 3-5 px'lik mini sprite çizilir.
5. `step(dt)`: ZAMAN modunda vapur, uçak ve uçurtma güncellemeleri atlanır (`if (mode === 'icat') { stepIcat(dt); return; }` gerekli alt kümeyle).
6. **Yeni API** (`root.Scene` nesnesine eklenir):
   - `setEra(eraId, {variant, instant})`: soru fazında `gunumuz`, sinematikte en eski çağ.
   - `travel({stops:[eraIdOyuncu?, eraIdDogru], yearText, playerYearText, reducedMotion})` → Promise benzeri bir `onDone` geri çağrısı.
   - `getEraInfo()` → `{id, name, label}`. `getZoneInfo()`, `mode === 'icat'` iken bunu döndürür, böylece `renderCinematic` ve `finalizeRound` değişmeden çalışır.
7. `debug({mode:'icat', era:'tunc', freezeTime})`: ekran görüntüsü aracı için (`handleShotMode` ve `tools/shots.ps1`).

**"Zamanda yolculuk" geçişi (toplam ~2,2 sn; `prefers-reduced-motion` açıksa 0,3 sn düz geçiş):**
| Zaman | Olay |
|---|---|
| 0-0,35 sn | Mevcut sahne `BAYER4` eşik maskesiyle 4×4 bloklar hâlinde koyu mora (`#1a1128`) çözülür. |
| 0,35-1,5 sn | **Tünel:** merkezden dışa kayan iç içe piksel dikdörtgen halkalar (renk = hedef çağın paletinden 3 ton). Ortada `PixelFont.draw()` ile büyük yıl sayacı 2026'dan hedefe **logaritmik** olarak geri sayar ("1926 … MÖ 3000 … 20.000 YIL ÖNCE … 3,3 MİLYON YIL ÖNCE"). Martı merkezde hızlı kanat çırpar, arkasında 6 piksellik tüy izi bırakır. |
| (yanlış cevapta) | Sayaç oyuncunun yılında **0,6 sn durur**. Arkada o çağın statik önbelleği %60 dither ile görünür, üstte "SENİN CEVABIN · 1926" yazar ve `era_stop` sesi çalar. Sonra geri sayım sürer. |
| 1,5-2,2 sn | Hedef çağ ters dither ile açılır. Martı tüneğine iner (sinüs düşüşü, son karede `perfect` ise mevcut `effect('perfect')` parıltısı). Banner gösterilir. |

**İleri yolculuk** (SONRAKİ SORU): 0,6 sn, sayaç ileri döner ve GÜNÜMÜZ'e dönülür. Sinematikte martı en eski çağdadır, alt kenarda 5 durakta yanıp sönen mini bir zaman şeridi çizilir.

**Performans:** 12 statik önbellek × 384×216 ≈ 12 × 330 KB RGBA ≈ 4 MB, bu sorun değildir. Önbellek tembel oluşturulur, yalnız ziyaret edilen çağlar için. Ön katman kare başına en çok yaklaşık 300 `fillRect` çağrısı yapar.

---

## 6. Bilgi kartı (popup) tasarımı

| Özellik | Karar |
|---|---|
| Tetikleyici | Zaman yolculuğu bitince (`travel` → `onDone`). Sonuç paneli ile ilk kart aynı anda açılır. GEÇ ve süre dolması durumunda da açılır. |
| Konum | Sol alt, sahne üstünde, sağdaki `#result-panel` ile çakışmayacak biçimde. Genişlik en çok `56 × --px`. Kartlar alttan yukarı yığılır (en yeni en üstte, en çok 2 görünür, eskisi soluklaşır). |
| İçerik | Üst satırda kaynak türü çipi (`ARKEOLOJİ` / `ARŞİV` / `PATENT` / `ANSİKLOPEDİ` / `AKADEMİK` / `RESMİ`) ve gerekiyorsa kehribar `YAKLAŞIK` / `TARTIŞMALI` çipi. Gövde tek cümledir (≤130 karakter). Alt satırda isteğe bağlı kısa künye (ör. "Harmand ve ark., Nature, 2015"), soluk renkte. |
| Sıra | `q.bilgi` dizisindeki sırayla gelir. 1. kart her zaman **doğru cevapla** ilgilidir. Oyuncunun cevabına ait bir `bilgi` varsa (eşyanın `not` alanı) o 2. sıraya alınır ("Televizyon 1926'da Londra'da gösterildi"). |
| Süre | Her kart 4 sn sonra otomatik olarak bir sonrakine geçer. Fare üstündeyken ya da odaktayken durur. Son kart kalıcıdır. |
| Kapatma | Karta tıklamak ya da `→` / `Space` sonraki kartı açar. Kart köşesindeki `×` hepsini kapatır. `Esc` sonuç fazında önce kartları kapatır, ikinci basış mevcut davranışa döner. `Enter` mevcut biçimde SONRAKİ SORU'ya geçer ve kartlar kapanır. |
| Erişilebilirlik | Kartlar `<aside id="fact-cards" aria-live="polite" aria-label="Bilgi kartları">` içinde, her biri `role="note"` ve `tabindex="0"`. Metin HTML'dir (canvas değil), `escapeHtml()` ile basılır. Yazı boyutu en az `2 × --px`. Kontrast: fildişi `#f3e6d8` zemin, `#1a1128` yazı (WCAG AA üstü). `prefers-reduced-motion` açıkken kaydırma animasyonu yerine anlık görünme olur. Ses kapalıysa görsel bir şey eksilmez. |
| Görünüm | Mevcut `pixel-btn` çerçevesi, köşede 6×6 kum saati piksel simgesi, kart girişinde 120 ms aşağıdan 4 px kayma. |
| Paylaşım | Kartlar paylaşım metnine girmez (spoiler önlemi). |

**Ses (sound.js `play()` switch'ine eklenir, mevcut `tone()` ile):**
| Ad | Tarif | Kullanım |
|---|---|---|
| `timewarp` | `tone('sawtooth', 1400, 0, 1.1, 0.6, 140, 1800)` ile alçalan süpürme, üstüne 0,06 sn aralıklı ve gittikçe seyrelen 10 adet `tone('square', 1800-i*90, i*0.1, 0.025, 0.35)` tıkırtısı | Tünel boyunca |
| `era_stop` | `tone('triangle', 440, 0, 0.12, 0.7)` + `tone('triangle', 330, 0.1, 0.16, 0.6)` | Yanlış cevabın durağı |
| `arrive` | `tone('triangle', 392,0,.18,.8)`, `494,.06,.18,.7`, `587,.12,.24,.7` akoru | Hedef çağa varış (tam isabette ardından mevcut `perfect`) |
| `card` | `tone('square', 1046.5, 0, 0.03, 0.25)` + `tone('triangle', 1318.5, 0.03, 0.06, 0.25)` | Her kart girişi |

Tümü mevcut `master` kazancı (0,15) ve `setEnabled` ile uyumludur. Yeni bir AudioContext açılmaz.

---

## 7. Veri biçimi şeması

### 7.1 Dosyalar ve yükleme sırası (`index.html`)
```html
<script src="config.js"></script>
<script src="data/q01_10.js"></script> … <script src="data/q32_42.js"></script>
<script src="data/icat_esya.js"></script>      <!-- ICAT_ERAS, eraOf, formatYil, ICAT_ITEMS -->
<script src="data/icat_sorular.js"></script>   <!-- ICAT_QUESTIONS + answers kurucusu -->
<script src="matcher.js"></script>
<script src="font.js"></script><script src="zones.js"></script>
<script src="eras_scene.js"></script>
<script src="scene.js"></script><script src="sound.js"></script><script src="game.js"></script>
```
Her iki veri dosyası da `data/` altında olduğundan `check.js` onları otomatik yükler (`/^data\/.*\.js$/`).

### 7.2 Eşya (`ICAT_ITEMS[id]`) alanları
| Alan | Tür | Zorunlu | Açıklama |
|---|---|---|---|
| `label` | string | ✓ | Gösterilen ad ("Bıçak (taş kesici)") |
| `aliases` | string[] | ✓ | 6-30 adet, ASCII ve ekli biçimlerle |
| `yil` | int \| null | ✓ | Takvim yılı, MÖ negatif (−3300000 = 3,3 milyon yıl önce). `null` yalnız `bilinmiyor` ile |
| `yilMin`, `yilMax` | int | tartışmalıda ✓ | Kaynaklar arası aralık (`yilMin ≤ yil ≤ yilMax`) |
| `yer` | string | ✓ | "Lomekwi 3, Kenya" |
| `ne` | string | – | Kısa tanım ("Taştan kesici alet") |
| `kesinlik` | enum | ✓ | `kesin` \| `yaklasik` \| `tartismali` \| `bilinmiyor` |
| `kaynakTuru` | enum | ✓ | `arkeoloji` \| `patent` \| `arsiv` \| `ansiklopedi` \| `akademik` \| `resmi` |
| `kaynak` | string | ✓ (bilinmiyor hariç) | Kısa künye |
| `not` | string | tartışmalı/bilinmiyorda ✓ | ≤130 karakter, kartta oyuncunun cevabı için kullanılır |
| `dogrula` | bool | – | `true` ise **[DOĞRULANMALI]**. `check.js` uyarı verir, yayın derlemesinde (`--release`) hata verir |

### 7.3 Soru (`ICAT_QUESTIONS[i]`) alanları
| Alan | Tür | Açıklama |
|---|---|---|
| `id` | `/^i\d{2,3}$/` | Benzersiz |
| `cat` | string | `ev`, `mutfak`, `turk_mutfagi`, `hijyen`, `ulasim`, `istanbul`, `iletisim`, `cumhuriyet`, `giyim`, `oyun`, `aydinlatma`, `yazi`, `turkiye_gelis`, `teknoloji` |
| `text` | string | Soru metni |
| `kapsam` | string | Tabelada gri satır, ≤70 karakter |
| `olcut` | enum | `icat` (varsayılan) \| `ilk_kayit` \| `turkiye_ilk` \| `piyasa` (sonuç cümlesinin fiilini belirler) |
| `adaylar` | string[] | `ICAT_ITEMS` id'leri, 6-15 adet (istisna `minAday`) |
| `ozel` | object | İsteğe bağlı, soruya özel alan üstüne yazma (ör. alias ekleme). Yıl üstüne yazmak **yasak** |
| `dogru` | string | Aday id'si |
| `esit` | string[] | İsteğe bağlı, `tam` sayılan eş adaylar (`dogru` dahil) |
| `sahne` | string | `ICAT_ERAS` id'si; `eraOf(dogru.yil)` ile aynı olmalı |
| `variant` | string | İsteğe bağlı sahne varyantı (`gol`) |
| `zorluk` | 1-3 | Günlük seçimde turda en çok bir adet 3 |
| `bilgi` | `{metin, kaynakTuru, kaynak?, ilgili?}`[] | 2-4 kart |
| `invalid` | `{aliases, reason}`[] | 2-8 adet (mevcut reason kuralları) |
| `tests` | `{in, expect}`[] | ≥5: doğru, bir yakın aday, bir genel sözcük, bir `invalid`, bir `none` |
| `answers` | (kurucu üretir) | `adaylar`'dan türetilir; elle yazılmaz |

### 7.4 Tam örnek kayıt
```js
// data/icat_esya.js
(function (root) {
  'use strict';
  root.ICAT_ERAS = [
    { id: 'tas',        name: 'TAŞ DEVRİ',            bas: -Infinity, bit: -10000 },
    { id: 'neolitik',   name: 'NEOLİTİK KÖY',         bas: -10000, bit: -3500 },
    { id: 'tunc',       name: 'MEZOPOTAMYA · MISIR',  bas: -3500,  bit: -800 },
    { id: 'antik',      name: 'ROMA · BİZANS',        bas: -800,   bit: 600 },
    { id: 'ortacag',    name: 'SELÇUKLU · ORTA ÇAĞ',  bas: 600,    bit: 1450 },
    { id: 'osmanli',    name: 'OSMANLI KONAĞI',       bas: 1450,   bit: 1800 },
    { id: 'yy19',       name: '19. YÜZYIL İSTANBUL',  bas: 1800,   bit: 1923 },
    { id: 'cumhuriyet', name: 'ERKEN CUMHURİYET EVİ', bas: 1923,   bit: 1950 },
    { id: 'altmislar',  name: "1950-60'LAR",          bas: 1950,   bit: 1970 },
    { id: 'seksenler',  name: "1970-80'LER",          bas: 1970,   bit: 1990 },
    { id: 'doksanlar',  name: "1990-2000'LER",        bas: 1990,   bit: 2007 },
    { id: 'gunumuz',    name: 'GÜNÜMÜZ',              bas: 2007,   bit: Infinity }
  ];
  root.ICAT_REF_YEAR = 2026;
  root.icatEraIndex = function (yil) {
    for (var i = 0; i < root.ICAT_ERAS.length; i++) {
      var e = root.ICAT_ERAS[i];
      if (yil >= e.bas && yil < e.bit) return i;
    }
    return -1;
  };
  // -3300000 -> "3,3 milyon yıl önce"; -18000 -> "yaklaşık 20.000 yıl önce"; -3000 -> "MÖ 3000"; 1926 -> "1926"
  root.icatFormatYil = function (yil, kesinlik) { /* … */ };

  root.ICAT_ITEMS = {
    bicak: {
      label: 'Bıçak (taş kesici)',
      aliases: ['bıçak', 'bicak', 'bıçağı', 'bicagi', 'bıçaklar', 'taş bıçak', 'tas bicak', 'taş alet', 'tas alet', 'mutfak bıçağı', 'kesici'],
      yil: -3300000, yer: 'Lomekwi 3, Kenya', ne: 'Taştan yontulmuş kesici alet',
      kesinlik: 'yaklasik', kaynakTuru: 'arkeoloji', kaynak: 'Harmand ve ark., Nature, 2015',
      not: 'Bugünkü anlamda bıçak değil; taştan yontulmuş kesici aletler.'
    },
    yatak: {
      label: 'Yatak',
      aliases: ['yatak', 'yatağı', 'yatagi', 'yataklar', 'döşek', 'dosek', 'şilte', 'silte', 'ot yatak', 'yer yatağı'],
      yil: -198000, yer: 'Border Cave, Güney Afrika', // ~200.000 yıl önce; aralık verilmez (kaynakta yok)
      kesinlik: 'yaklasik', kaynakTuru: 'arkeoloji', kaynak: 'Wadley ve ark., Science, 2020'
    },
    ayna: {
      label: 'Ayna',
      aliases: ['ayna', 'aynası', 'aynasi', 'aynalar', 'aynayı', 'obsidyen ayna', 'el aynası', 'duvar aynası', 'boy aynası'],
      yil: -6000, yilMin: -6000, yilMax: -5500, yer: 'Çatalhöyük, Konya',
      kesinlik: 'yaklasik', kaynakTuru: 'arkeoloji', kaynak: 'Çatalhöyük kazıları (Mellaart)'
    },
    masa: {
      label: 'Masa',
      aliases: ['masa', 'masası', 'masasi', 'masalar', 'yemek masası', 'sehpa', 'çalışma masası', 'sofra'],
      yil: null, yer: '—', kesinlik: 'bilinmiyor', kaynakTuru: 'ansiklopedi',
      not: 'İlk masanın tarihi bilinmiyor; bilinen erken örnekler Antik Mısır\'dan.'
    },
    televizyon: {
      label: 'Televizyon',
      aliases: ['televizyon', 'tv', 'televizyonu', 'tele', 'tüplü tv', 'tuplu tv', 'ekran', 'televizyonlar'],
      yil: 1926, yer: 'Londra (Baird gösterimi)', kesinlik: 'kesin', kaynakTuru: 'ansiklopedi',
      kaynak: 'J. L. Baird, Royal Institution gösterimi, 1926',
      not: 'Türkiye\'de düzenli yayın 31 Ocak 1968\'de TRT ile başladı.'
    }
    // … yatak, igne, comlek, firin, sandalye, hali, kursun_kalem, buzdolabi
  };
})(typeof window !== 'undefined' ? window : globalThis);
```
```js
// data/icat_sorular.js
(function (root) {
  'use strict';
  root.ICAT_QUESTIONS = root.ICAT_QUESTIONS || [];
  root.ICAT_QUESTIONS.push({
    id: 'i01', cat: 'ev', olcut: 'icat', zorluk: 1,
    text: 'Evinde bulunan eşyalardan EN ESKİ icat edileni hangisi?',
    kapsam: 'Bugün bir evde bulunabilen taşınabilir eşya ya da mobilya',
    adaylar: ['bicak', 'yatak', 'igne', 'comlek', 'firin', 'ayna', 'sandalye', 'masa', 'hali', 'kamis_kalem', 'kursun_kalem', 'buzdolabi', 'televizyon'],
    dogru: 'bicak',
    sahne: 'tas',
    bilgi: [
      { metin: 'Kenya\'daki Lomekwi 3\'te bulunan taş aletler yaklaşık 3,3 milyon yıllıktır ve bilinen en eski kesici aletlerdir.', kaynakTuru: 'arkeoloji', kaynak: 'Harmand ve ark., Nature, 2015', ilgili: 'bicak' },
      { metin: 'Güney Afrika\'da 200.000 yıllık ot yataklar bulundu; araştırmacılara göre böcek kaçsın diye kül üstüne serilmişlerdi.', kaynakTuru: 'arkeoloji', kaynak: 'Wadley ve ark., Science, 2020', ilgili: 'yatak' },
      { metin: 'Konya Çatalhöyük\'te yaklaşık 8.000 yıllık, cilalı obsidyenden yapılmış aynalar bulundu.', kaynakTuru: 'arkeoloji', ilgili: 'ayna' },
      { metin: 'Masanın mağarada kullanıldığına dair kanıt yok; bilinen erken masalar Antik Mısır\'dan.', kaynakTuru: 'ansiklopedi', ilgili: 'masa' }
    ],
    invalid: [
      { aliases: ['ateş', 'ates', 'ocak'], reason: 'Ateş bir eşya değil; onu başka bir soruda soracağız.' },
      { aliases: ['kapı', 'kapi', 'pencere', 'duvar', 'çatı'], reason: 'Evin bir parçası; taşınabilir bir eşya yaz.' },
      { aliases: ['eşya', 'esya', 'mobilya', 'hiçbir şey', 'bilmem'], reason: 'Belirli bir eşya yaz.' }
    ],
    tests: [
      { in: 'bıçak', expect: 'Bıçak (taş kesici)' },
      { in: 'taş alet', expect: 'Bıçak (taş kesici)' },
      { in: 'tv', expect: 'Televizyon' },
      { in: 'kalem', expect: 'Kalem (kamış kalem)' },
      { in: 'masa', expect: 'Masa' },
      { in: 'fırın', expect: 'Fırın (kubbeli kil fırın)' },
      { in: 'televizyon', expect: 'Televizyon' },
      { in: 'aynalar', expect: 'Ayna' },
      { in: 'kapı', expect: 'invalid' },
      { in: 'uzay gemisi xyz', expect: 'none' }
    ]
  });
  // Kurucu: answers = adaylar -> ICAT_ITEMS (matcher label/aliases okur)
  root.ICAT_QUESTIONS.forEach(function (q) {
    if (q.answers) return;
    q.answers = q.adaylar.map(function (id) {
      var base = root.ICAT_ITEMS[id] || {};
      var o = {}; for (var k in base) o[k] = base[k];
      var extra = q.ozel && q.ozel[id];
      if (extra && extra.aliases) o.aliases = (o.aliases || []).concat(extra.aliases);
      o.id = id; return o;
    });
  });
})(typeof window !== 'undefined' ? window : globalThis);
```

### 7.5 check.js eklemeleri (ayrı "İCAT" bölümü)
Mevcut 868 testlik sayaç **değişmez**. ZAMAN doğrulamaları ayrı sayaçlarla yürür ve ayrı bir satır basar:
`İCAT SORU 15 | ADAY ort 10,4 | BİLGİ 58 | TEST 92/92 | TAKVİM ok | DOĞRULANMALI 6`
Herhangi bir İCAT hatası `errors` dizisine eklenir, böylece çıkış kodu 1 olur.

1. **Çağ tablosu:** `ICAT_ERAS` bitişik (`e[i].bit === e[i+1].bas`), artan, −∞'dan +∞'a kesintisiz, id'ler benzersiz.
2. **Eşya:** `label` var; alias sayısı 6-30; `yil` tamsayı ya da `null`; `null ⇔ kesinlik==='bilinmiyor'`; `yil ≤ ICAT_REF_YEAR`; `yilMin ≤ yil ≤ yilMax` (varsa); `tartismali` için `yilMin`, `yilMax` ve `not` zorunlu; `kesinlik` ve `kaynakTuru` enum içinde; `kaynak` boş değil (bilinmiyor hariç); `not` ≤130 karakter; `dogrula:true` → uyarı (`--release` ile hata).
3. **Soru, yıl mantığı:**
   - `dogru ∈ adaylar`.
   - `dogru.yil === min(adaylar.yil, null hariç)`.
   - `esit` içindeki her adayın yılı ya aynı ya da `[yilMin, yilMax]` aralığı doğrunun aralığıyla örtüşüyor.
   - `esit` dışında doğrudan daha eski ya da eşit yıllı aday varsa → hata ("doğru cevap en eski değil").
   - `sahne === ICAT_ERAS[icatEraIndex(dogru.yil)].id`.
   - Her aday sözlükte var.
   - `ozel` içinde `yil`, `yilMin`, `yilMax` alanı → hata (yıl tek kaynaktan gelir).
4. **Boş içerik:** `text` ve `kapsam` boş değil (`kapsam` ≤70); `bilgi` 2-4 adet; her `metin` 20-130 karakter ve **tek cümle** (`/[.!?](\s|$)/g` eşleşme sayısı 1; "MÖ", "ve ark." gibi kısaltmalar bir istisna listesiyle); `kaynakTuru` enum; `metin` içinde "yanlış" yasak; en az bir kartın `ilgili === dogru`.
5. **Alias çakışması:** Mevcut `Matcher.buildKeys` döngüsü (satır 187-230) `checkAliasConflicts(qid, answers, invalid)` adlı bir fonksiyona çıkarılır ve hem `QUESTIONS` hem `ICAT_QUESTIONS` için çağrılır (bugünkü davranış aynen korunur). Ek olarak `ICAT_ITEMS` genelinde aynı anahtar iki eşyada varsa **uyarı** verilir. İki eşya aynı soruda birlikte geçiyorsa bu durum zaten soru içi kontrolde **hata** olur. Örnek: "kalem" hem `kamis_kalem` hem `kursun_kalem`'de olamaz.
6. **Testler:** Her soru için `Matcher.matchAnswer(t.in, q)`: `expect` bir etiketse `type==='valid' && answer.label===expect`, ayrıca `'invalid'` ve `'none'` beklentileri. ≥5 test; en az biri `invalid`, en az biri `none`.
7. **Çekirdek eski eşya uyarısı (kategoriye göre):** `CORE_OLD = { ev:['bicak','ocak','yatak','igne','comlek'], mutfak:['bicak','comlek','ogutme_tasi','ocak'], hijyen:['ayna','tarak','ustura'], giyim:['ayakkabi','igne'] }`. Sorunun kategorisindeki her eşya ya adaylarda ya da `invalid` alias'larında aranır, bulunmazsa uyarı verilir (3.4). Liste kategoriye özgü tutulur ki uyarı gürültüye dönmesin.
8. **Takvim:** `getDailyIcatSet` 60 gün simüle edilir. Aynı gün içinde tekrar ve aynı döngüde tekrar olmamalı, turda en çok bir `zorluk:3` bulunmalı.
9. **Biçim birim testleri:** `icatFormatYil(-3300000)` = "3,3 milyon yıl önce", `(-18000)` = "yaklaşık 20.000 yıl önce", `(-3000)` = "MÖ 3000", `(1926)` = "1926".

**Not (ana oturum için):** Bu yapıyla `node v2/tools/check.js` ilk satırda yine `868/868` gösterir, ZAMAN için ikinci bir satır eklenir. CLAUDE.md'deki "868/868" şartı bozulmaz. İstenirse yeni satır için de beklenen değer DEVIR_NOTU'na yazılır.

---

## 8. Uygulama planı

### 8.1 Dosya dosya iş listesi
| # | Dosya | İş | Zorluk |
|---|---|---|---|
| 1 | `data/icat_esya.js` (yeni) | `ICAT_ERAS`, `icatEraIndex`, `icatFormatYil`, `ICAT_ITEMS` (≈90 eşya) | Orta (içerik ağır) |
| 2 | `data/icat_sorular.js` (yeni) | 15 soru (bu belge) + `answers` kurucusu | Orta (içerik ağır) |
| 3 | `tools/check.js` | 7.5'teki bölüm; `checkAliasConflicts` dışa çıkarma | Orta |
| 4 | `config.js` | `MODES.icat` (tiers, `kind:'icat'`, `questionsPerRound:5`, `roundSeconds:40`, `maxScore:500`); `PUSULLA_DAILY.getDailyIcatSet` | Kolay |
| 5 | `game.js` | Menü kartı ve odak `% 5`; `refreshDailyIfNeeded` ve `init` içinde `state.dailySet.icat`; `startMode` (havuz `ICAT_QUESTIONS`, `roundLen()`); `beginQuestion` (kapsam satırı, `Scene.setEra('gunumuz')`); `handleSubmit` icat dalı → `evalIcatTier`; `none` metni ve `icatMiss`; İPUCU düğmesi; `enterReveal` (`setScore` yerine `Scene.travel`); `showResult` (zaman şeridi + `buildAnswersRows` icat sürümü: yıla göre sıralı aday listesi, "%" yerine yıl); bilgi kartı yöneticisi; `finalizeRound` (`best.icat`, `zoneName` = en eski çağ); `renderCinematic`, `buildShareText`, `renderSummary`; `defaultStore`/`loadStore` göçü; `MAX_SCORE` ve `QUESTIONS_PER_ROUND` kullanımlarını yardımcılarla değiştirme | **Zor** (en çok dokunulan yer) |
| 6 | `index.html` | `#icat-card`, `#hint-btn`, `#fact-cards`, `#question-scope`, `#era-strip`; script sırası | Kolay |
| 7 | `style.css` | Sepya kart, kart yığını, çipler, zaman şeridi, `prefers-reduced-motion` | Kolay-orta |
| 8 | `eras_scene.js` (yeni) | 12 sahne (statik + canlı), tünekler, aksesuarlar, göl varyantı | **Zor** (en büyük çizim işi) |
| 9 | `scene.js` | 5.3'teki kancalar, `travel` durum makinesi, yardımcıların dışa verilmesi, `debug` era desteği | Orta |
| 10 | `sound.js` | `timewarp`, `era_stop`, `arrive`, `card` | Kolay |
| 11 | `tools/shots.ps1` | `?shot=icat_<era>` ile 12 sahne + 1 tünel karesi | Kolay |

**Sıra:** (a) Bu belgedeki kararlar netleşir (bölüm 9). (b) 1-3 ile veri ve doğrulama yazılır, çünkü oyun kodu bu şemaya dayanır. Şema burada sabit olduğundan (c) 4-7 ve (d) 8-10 aynı anda başlayabilir. (e) Entegrasyon, (f) test, (g) Opus kontrolü (özellikle tarih doğrulama), (h) ≤2 revize turu.

### 8.2 agy hydrogen iş emri taslağı (dosya sahipliğine göre 3 paralel işçi)
Ortak üst bilgi (her brief dosyasının başına, brief adları benzersiz: `rev/ICAT_ISCI_A.txt`, `ICAT_ISCI_B.txt`, `ICAT_ISCI_C.txt`):
> Proje `D:\pusulla\v2`. Tasarım: `D:\pusulla\notlar\MOD_ESKI_ICAT_TASARIM.md` (bu belge; ilgili bölümleri oku). **Yalnız sana verilen dosyalara yaz. Başka dosyayı düzenleme, yedekten geri yükleme YAPMA, `git` komutu çalıştırma.** Kökteki v1 dosyalarına dokunma. Klasik script (module yok), harici kütüphane ve ağ yok, `file://` ile çalışmalı. Bitince `node --check <dosya>` çalıştır ve kendi kontrol listeni raporla.

- **İşçi A: oyun akışı ve arayüz.** Sahip olduğu dosyalar: `config.js`, `game.js`, `index.html`, `style.css`.
  - Görev: 8.1'deki 4-7. maddeler. `Scene.travel`, `Scene.setEra` ve `Scene.getEraInfo` yokken de çalışsın (`sceneCall` korumasıyla, yalnız log).
  - Veri şeması bölüm 7'dedir. Veri dosyaları hazır değilse 2 soruluk geçici bir test kaydıyla `?debug` altında dene, sonra sil.
  - Kabul ölçütleri: menüde 5 odak noktası klavyeyle gezilebiliyor; ZAMAN turu 5 soruda bitiyor; F5 ile yarım soru süresiyle devam ediyor; mevcut 3 modda davranış değişmiyor (`check.js` 868/868).
- **İşçi B: sahne ve ses.** Sahip olduğu dosyalar: `eras_scene.js` (yeni), `scene.js`, `sound.js`, `tools/shots.ps1`.
  - Görev: 8.1'deki 8-11. maddeler, bölüm 5 tablosuna birebir uyarak (palet, katman, animasyon, tünek).
  - Kabul ölçütleri: `Scene.debug({mode:'icat', era:X, freezeTime:1})` ile 12 sahnenin ekran görüntüsü alınabiliyor; geçiş `prefers-reduced-motion` ile kısalıyor; kare süresi 1080p'de 16 ms altında; `selfTest()` hâlâ boş dizi döndürüyor; zirve, dip ve orta görüntüleri değişmiyor (`shots.ps1` öncesi/sonrası karşılaştırma).
  - Sahneler özgün çizim olacak: logo, marka ve müze eseri kopyası yok.
- **İşçi C: veri ve doğrulama.** Sahip olduğu dosyalar: `data/icat_esya.js`, `data/icat_sorular.js`, `tools/check.js`.
  - Görev: 8.1'deki 1-3. maddeler. Tarihler ve kartlar bu belgeden **olduğu gibi** alınır, yeni tarih eklenmez. Belgede olmayan alias'lar eklenebilir, yıl eklenemez. **[DOĞRULANMALI]** maddeleri `dogrula:true` alır.
  - Kabul ölçütleri: `node tools/check.js` ilk satır `868/868`, İCAT satırında hata yok.

(agy Opus kotası kapalıyken plan ve kontrol Claude Opus alt ajanında yapılır. Kullanıcının agy iş hattı kuralı geçerlidir. Bu bölüm yalnız taslaktır, işçi başlatmak ana oturumun işidir.)

### 8.3 Test planı
1. **Statik:** `node --check` ile yeni ve değişen tüm `.js` dosyaları; `cd v2; node tools/check.js` → `868/868` + `İCAT … TEST n/n | TAKVİM ok`.
2. **Matcher örnekleri (check içinde):** ekli biçimler ("bıçağı", "aynalar"), ASCII ("cezve"/"cezveyi"), genel sözcük ("kalem" → kamış kalem), kapsam dışı ("ateş" → invalid), bulanık yazım ("televzyon").
3. **Tarayıcı** (`npx serve v2` ve `index.html` çift tıklama, Edge ve Chrome; 1366×768 ve 1920×1080):
   - Menü: 5 kart ve fare/klavye ile ZAMAN'a giriş.
   - Tam isabet, aynı çağ, uzak çağ, `belirsiz` (masa), `invalid`, `none` ve ardından doğru cevap, İPUCU ve ardından tam isabet (70 tavanı), GEÇ, süre dolması.
   - Zaman yolculuğu: yanlış cevapta iki duraklı tünel, banner, martı tüneği ve aksesuar.
   - Bilgi kartları: otomatik akış, `→`/`Space`, `×`, `Esc` sırası, Enter ile sonraki soru, ekran okuyucu (`aria-live`) metni.
   - F5 ve Esc ile yarım tur; sekme gizlenince süre donması; ses kapalı; `prefers-reduced-motion`.
   - Bitiş sinematiği (en eski çağ), özet, PAYLAŞ metni, ertesi gün (`?date=` yerel debug) yeni set.
   - Konsolda hata olmamalı. Diğer üç modda bir tam tur oynanır (gerileme kontrolü).
4. **Görsel:** `shots.ps1` ile 12 çağ + tünel karesi `v2/shots/icat_*.png`; Opus görsel kontrolü (palet, okunurluk, kopya ve logo yok).
5. **İçerik:** Opus alt ajanı her `bilgi` kartı ve aday tarihi için kaynağı kontrol eder ve `dogrula:true` maddeleri kapatır. Kapatılamayanlar aday listesinden çıkarılır.

---

## 9. Riskler ve açık sorular

### 9.1 Tarihsel doğruluk
- **Tartışmalı tarihler oyunun kalbinde.** "En eski" çoğu zaman arkeolojide "şimdilik bilinen en eski" demektir ve yeni buluntularla değişir (iğne, ateş, sepet, yelken). Önlemler: `kesinlik` alanı ve kartlarda YAKLAŞIK/TARTIŞMALI çipleri; tartışmalı adayların cezasız `ayni` kuralı; "bilinen en eski" dili ("ilk icat" demek yerine); yılda bir gözden geçirme notu `notlar/` altında.
- **[DOĞRULANMALI] listesi (yayından önce birincil kaynak):**
  - Simit 1593 Üsküdar kadı sicili: aramada kayıt bulunamadı, yalnız popüler kaynaklarda geçiyor.
  - Ayran'ın Divanü Lügati't-Türk'te geçmesi.
  - Baklava 1473/1474 (yalnız ikincil kaynaklarda, sayı farkı var).
  - İstanbul banliyö treni ve belediye otobüsü başlangıç yılları.
  - İstanbul telefon santrali yılı.
  - Tarsus 1902 (kaynaklar 1902-1910 arasında).
  - Telgraf 1854/1855.
  - i14 tarihleri (tek tek teyit).
  - i08 kapsamı: 1923-1925 arasında daha eski bir yerli taşıt ya da cihaz var mı?
  - i15 kapsamı (taslak).
  - i06 vapur: 1837 ilk özel buharlı vapur tarihi (tek İngilizce ikincil kaynak; 1844 ve 1851 iyi belgelenmiş).
- **"En eski" tanımı belirsiz sorular:** "kalem", "telefon", "tencere" gibi genel sözcükler (3.3'te çözüldü, karar 3); "icat" mı "ilk kayıt" mı "Türkiye'ye geliş" mi sorusu (`olcut` alanı ve kapsam satırı); kültür evresi ile takvim çağı farkı (Pesse kanosu, 5.1 notu). Kapsam satırı olmadan hiçbir soru yayınlanmaz.
- **Kapsam delikleri:** Oyuncu kapsam içinde, doğru cevaptan daha eski bir şey yazabilir (ör. i02'de "deri kese"). Önlemler: çekirdek eski eşya uyarısı, yerel `icatMiss` kaydı, dar kapsam metinleri. Gerçek bir delik bulunursa soru düzeltilene kadar havuzdan çıkarılır.

### 9.2 İçerik hakları
- Sahneler **tamamen özgün piksel çizimdir**. Lascaux resimleri, Çatalhöyük duvar resimleri, müze nesneleri, TRT test kartı, araba ve marka logoları kopyalanmaz, yalnız genel motifler kullanılır.
- Kartlardaki bilgiler kendi cümlelerimizdir. Kaynak metinlerden alıntı yapılmaz, künye yalnız yazar, yıl ve dergi adıdır.
- Marka ve ürün adları (Walkman, LEGO, Arçelik, iPhone) yalnız olgusal tarih bilgisi olarak metinde geçer, görselde kullanılmaz. Gerekirse genel adla değiştirilir ("kasetçalar").

### 9.3 Dengeleme
- Çoğu doğru cevap tarih öncesinde kalıyor (sahne kapsamı tablosu). Havuzun en az %30'u dar dönem kapsamlı olmalı.
- Bilinen-bilinmeyen dengesi: `zorluk:3` turda en çok bir kez; aynı çağdan bilinen bir adayın 70 alması.
- Çok zor algısı: ilk hafta verisi (yerel `icatMiss` ve ortalama puan, `?debug`) ile kapsam metinleri ve adaylar ayarlanır.
- Tur süresi: 5 soru × (40 sn + ~10 sn açılış) ≈ 4-5 dk, diğer modlarla benzer.
- Havuz boyutu: günlük yayın için ≥60 soru gerekir. Bu belge 15 soru verir, kalan 45 sorunun yazımı ayrı bir içerik işidir (Opus yazar, kaynak kontrolü ayrı yapılır).

### 9.4 Teknik riskler
- `game.js` en çok dokunulan dosyadır. Mod dallanmaları (`kind === 'icat'`) diğer modları kırabilir. Önlem: gerileme testi ve `shots.ps1` öncesi/sonrası karşılaştırması.
- `MODE_ORDER`'a ekleme yapılmaz (1.4). Yapılırsa takvim ve SINIRSIZ seçicisi bozulur.
- `scene.js` içinde bilinmeyen mod zirve bölgelerine düşer. `getZonesForMode('icat') → []` kancası şarttır.
- Kum saati ikonu `⧗` bazı sistem yazı tiplerinde eksik olabilir. `font.js`'te `missing()` kontrolü yapılır, eksikse `◷` kullanılır.

### 9.5 Kullanıcıya sorulacak 5 karar
1. **Mod adı:** ZAMAN (önerilen) / EN ESKİ / İLK İCAT / MAZİ?
2. **Yayın biçimi:** ZAMAN günlük mü olsun (5 soru/gün, seriyi sayar) yoksa havuz ≥60 olana kadar yalnız SINIRSIZ'da "önizleme" olarak mı kalsın?
3. **Genel sözcük politikası:** "kalem", "telefon" gibi sözcükler o türün en eski biçimine mi eşlensin (cömert, önerilen), yoksa oyuncudan "hangi kalem?" diye netleştirme mi istensin?
4. **Tartışmalı tarihler:** Tartışmalı adaylar aralığın en eski ucuna göre en az "AYNI ÇAĞ" (70) alsın mı (önerilen), yoksa yalnız uzlaşı yılı mı sayılsın?
5. **Soru türleri tek modda mı:** "Dünyada ilk icat", "ilk yazılı kayıt" ve "Türkiye'ye ilk geliş" soruları aynı ZAMAN havuzunda mı karışık gelsin (önerilen, kapsam satırıyla), yoksa Türkiye soruları ayrı bir alt modda ("YERLİ ZAMAN") mı toplansın? İPUCU düğmesi de bu kararla birlikte onaylanır.
