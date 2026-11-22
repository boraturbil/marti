# PUSULA — Cevap havuzu veri kaynakları (araştırma, 2026-11-22)

Kapsam: "Bir tane X söyle" için kapalı kümelerde tüm üyeler, açık kümelerde çok üye + alias, tarihsel eksen için yıl.
Yöntem: web (WebSearch/WebFetch) + query.wikidata.org canlı deneme sorguları. Hiçbir şey indirilmedi/kurulmadı, oyuna dokunulmadı.
Doğrulama notu: "[doğrulandı]" = bu oturumda sayfadan okundu; "[bilgi]" = genel bilgi, kullanmadan önce lisans sayfası yeniden okunmalı (hukuki danışmanlık değildir).

## 0. Canlı Wikidata denemeleri (query.wikidata.org, HTTP 200, User-Agent'lı)
| Sorgu | Sonuç |
|---|---|
| İstanbul ilçeleri: `?i wdt:P31 wd:Q1147395 ; wdt:P131 wd:Q534799`, tr etiket + tr altLabel | **36 satır** (39 ilçeden; 3'ü eksik/başka P31). 17'sinde alias var ("Beşiktaş"→"Besiktas", "Şişli ilçesi", "Şişli, İstanbul"). Alias çoğu "ilçesi/İstanbul" eki ya da ASCII yazım: işe yarar ama gürültülü. |
| Hata dersi | İlk iki deneme `wd:Q1137713` / `Q1721483` ve `P131*` ile **0 satır** döndü: sınıf kimliklerini tahmin etme, önce `GROUP BY ?t` ile P31 dağılımına bak (İstanbul altı: cami 504, metro istasyonu 122, "district of Turkey" 38). |
| Türk futbol kulübü (`P31 Q476028 ; P17 Q43`) tr etiket | **478 satır**, 190'ında alias, 266'sında P571 (kuruluş yılı). Amatör/alt lig kulüpleri de var: filtre (Süper Lig/TFF liglerine üyelik P118) şart. |
| Ülke (`P31 Q6256`) tr etiket | **237 satır**, 103 alias, 236 yıl. Tarihî devletler karışıyor ("Waldeck" 1180): `Q3624078` (egemen devlet) + `P576` yok filtresi gerekir. |
| Video oyunu (`P31/P279* Q7889`, LIMIT 5000) | 5000 (limit; gerçekte çok daha fazla), 4928'inde P577 yıl. Tetris 1985, Wii Sports 2006 doğru. |
| Çorba (`P279* Q41415`) | **yalnız 14 satır**: gündelik yemek kategorileri Wikidata'da İNCE. |
| Türk filmi (`P31 Q11424 ; P495 Q43 ; P577`, trwiki makalesi olan) | 2883 satır ama aynı film P577'nin birden çok bölgesel tarihi yüzünden tekrarlı: `MIN(?d)` ile GROUP BY şart. Alias çıkmadı (filmde tr altLabel yok denecek kadar az). |
Sonuç: Wikidata kapalı/kurumsal kümelerde (ülke, ilçe, kulüp, oyun, element, marka) güçlü; gündelik yemek/eşya/meslek gibi "halk kategorilerinde" ve Türkçe alias'ta zayıf.

## 1. Kaynak değerlendirmeleri

### 1.1 Wikidata (ANA KAYNAK)
- Adres: https://query.wikidata.org (SPARQL, 60 sn zaman aşımı, tek istek tek sorgu, User-Agent zorunlu), https://dumps.wikimedia.org/wikidatawiki/entities/ (tam dump, onlarca GB; gerekmez).
- Lisans: **CC0** (ana ad alanı verisi) [doğrulandı, wikidata.org/wiki/Wikidata:Licensing]. Atıf zorunlu değil, ticari kullanım serbest. Etiket/açıklama için sayfa açıkça saymıyor ama aynı ad alanında; risk düşük.
- Türkçe: etiket kapsamı geniş ama yapı eksik (alias seyrek, §0). Yıl: P571 kuruluş, P577 yayın/vizyon, P575 keşif, P1619 açılış, P729 piyasa çıkışı, P580 başlangıç, P569 doğum. Elde edilen oranlar §0'da (kulüp %56, ülke %99, oyun %99 yıl).
- Ek değer: Q-kimliği ile `sitelinks` sayısı (popülerlik proxy'si), `P1449/P742` takma ad, `P1813` kısa ad, `P1705` yerli ad, `P856`.
- Yöntem: kategori başına SPARQL (§5), `P31/P279*` + ülke/tür filtresi, sayfalama `LIMIT/OFFSET` + `ORDER BY ?i`.

### 1.2 Türkçe Vikipedi (trwiki dump + kategoriler) — tamamlayıcı #1
- Adres: https://dumps.wikimedia.org/trwiki/latest/ — pages-articles.xml.bz2 ~1,07 GB, categorylinks.sql.gz ~123 MB, page.sql.gz ~108 MB [doğrulandı]. Canlı alternatif: MediaWiki API `list=categorymembers` (kurulumsuz, küçük kategoriler için).
- Lisans: **CC BY-SA 4.0** (+GFDL) [bilgi]. Madde METNİ kopyalanırsa atıf+share-alike; yalnız başlık/olgu (ad, yıl) çıkarmak telif konusu olmadığı için sorunsuz; yine de "Veriler Vikipedi ve Vikiveri'den" notu önerilir.
- Kalite: Türkçe başlıklar en doğal yazımla; kategori (ör. "Türk çorbaları", "Türk tatlıları", "Süper Lig takımları") Wikidata'nın boş bıraktığı halk kategorilerini kapatır. Yönlendirme sayfaları (`redirect`) = ücretsiz alias/yazım varyantı kaynağıdır (ör. "Besiktas"→"Beşiktaş JK").
- Çıkarma: `page` + `categorylinks` + `redirect` SQL dump'ları (hafif, makale metni indirme gerekmez). Küçük iş: API ile kategori ağacını 2 derinlik gez.
- Popülerlik: Wikimedia Pageviews API (https://wikimedia.org/api/rest_v1/metrics/pageviews/...) pay (share) tahmini için kaba proxy; veri CC0 [bilgi].

### 1.3 DBpedia
- Adres: https://www.dbpedia.org, SPARQL https://dbpedia.org/sparql, dump databus.dbpedia.org. Lisans CC BY-SA 3.0/GFDL (verisi) [bilgi]. Türkçe ayrı bölge sunucusu aktif değil/seyrek; çoğu İngilizce. **Önerilmez**: Wikidata+trwiki zaten daha taze ve CC0.

### 1.4 GeoNames
- Adres: https://download.geonames.org/export/dump/ (TR.zip, cities15000.zip, alternateNamesV2.zip). Lisans **CC BY 4.0**, ticari serbest, atıf şart [doğrulandı].
- İçerik: il/ilçe/köy/şehir; `alternateNames` dil kodlu (tr dahil), nüfus var, **yıl yok**. TR.zip ~birkaç MB; ilçe düzeyi (ADM2) Türkiye için temiz.
- Kullanım: il/ilçe/şehir ve dünya şehirleri için doğrulama + ASCII/yerel yazım alias. Başkentler ve ülkeler için Wikidata yeterli.

### 1.5 Natural Earth
- Adres: https://www.naturalearthdata.com. Lisans **public domain**, ticari serbest, atıf gerekmez [doğrulandı]. Ülke/başkent/şehir tablolarında `NAME_TR` alanı var [bilgi]; kapalı küme (ülke, başkent) için küçük ve temiz. Yıl yok.
- Kullanım: ülke listesi "egemen devlet" filtresi doğrulaması (Wikidata gürültüsünü ayıklamak için çapraz kontrol).

### 1.6 MusicBrainz
- Adres: https://musicbrainz.org/doc/MusicBrainz_Database/Download. Çekirdek veri (`mbdump.tar.bz2`) **CC0**; ek veriler (derived, edit, stats...) CC BY-NC-SA 3.0 → KULLANMA [doğrulandı].
- Sanatçı/albüm/çıkış yılı var; Türkçe etiket zayıf (ad evrensel, Türk sanatçılar iyi). Dump devasa (onlarca GB): oyun için **gereksiz**; Wikidata P175/P577/P436 (MusicBrainz id eşlemesi) ile Türk pop/rap sanatçı listesi yeter.

### 1.7 IMDb Non-Commercial Datasets
- https://data.imdb.com/non-commercial-datasets/ (title.basics, akas, ratings...; .tsv.gz). **"Yalnızca kişisel ve ticari olmayan kullanım"** [doğrulandı]. pusulla.io yayını (reklamsız bile olsa) risk: **KULLANMA**. Wikidata P345 (IMDb id) yalnızca kimlik, veri değil, o kadarı CC0 içinde.

### 1.8 MovieLens (GroupLens)
- https://grouplens.org/datasets/movielens/ — araştırma amaçlı, ticari yeniden dağıtım izni yok [bilgi]. **KULLANMA**. (Küçük, ~9 bin film; zaten Wikidata daha geniş.)

### 1.9 TMDB
- Veri API'si, ücretsiz katmanda ticari kullanım ayrı lisans/ atıf şartı, veri önbellekleme kısıtı [bilgi; terms sayfası bu oturumda açılamadı]. Çalışırken API çağrısı yasak olduğundan ve statik kopya şartlara aykırı olabileceğinden **önerilmez**. Türkçe film adı için Wikidata+trwiki yeter.

### 1.10 Open Food Facts
- https://world.openfoodfacts.org/data — **ODbL** (veritabanı) + DbCL (içerik) + CC BY-SA (görseller) [doğrulandı]. Atıf ZORUNLU, türev veritabanı kamuya sunulursa ODbL share-alike (copyleft): oyun veri dosyaları bu veriden türerse aynı lisansı taşımak zorunda kalabilirsiniz. CSV ~0,9 GB sıkışık [doğrulandı].
- Türkçe kapsama ve "yemek adı" amacına uygunluk düşük (barkodlu ambalajlı ürünler: marka/ürün). **Marka adı** doğrulaması için olası ama **önerilmez** (copyleft riski + gürültü); marka için Wikidata P31/P279* Q431289 (marka) daha temiz.

### 1.11 Wiktionary / TDK / sözlük setleri
- Türkçe Vikisözlük: CC BY-SA [bilgi]; kelime/ek bilgisi için, kategori üyeliği ("Türkçe hayvanlar" vb.) alias değil. Düşük öncelik.
- **TDK (sozluk.gov.tr)**: telif TDK'ya ait, açık lisans yok. Hugging Face `erogluegemen/TDK_Turkish_Words` meta verisi cc0-1.0 diyor ama içerik TDK'dan kazınmış; yükleyenin beyanı geçerli bir hak devri değil [doğrulandı: web araması, erişim "gated"]. **KULLANMA**.
- `vocably/tr` kelime-çeviri listesi: **AGPL-3.0** [web araması]: copyleft, kullanma.
- hunspell-tr (tdd-ai/hunspell-tr): kelime listesi + ek kuralları (GPL/LGPL karışık, lisans bu oturumda doğrulanmadı): yalnız **geliştirme sırasında** çekim/ek testi için; ürüne gömme.
- Zemberek-NLP (ahmetaa/zemberek-nlp): Apache-2.0 olduğu biliniyor [bilgi, bu oturumda doğrulanamadı]; Türkçe morfoloji/lemma. Çalışma zamanı için Java, tarayıcıda yok; **build-time** üretimde ek/çekim varyantı üretmek için kullanılabilir (§4).
- TS Corpus kelime listesi (3,2 milyon kelime; lisans doğrulanamadı): yazım sıklığı için ilginç ama lisans belirsiz; kullanma.
- Awesome liste: https://github.com/agmmnn/turkish-nlp-resources (kaynak bulma rehberi; içindekilerin lisansı tek tek bakılmalı).

### 1.12 "Cep ansiklopedisi" tipi veri setleri
- Açık lisanslı, Türkçe, kategori+yıl sunan ayrı bir set **bulunamadı**. Ansiklopedi içerikleri (Ana Britannica, Meydan Larousse, Vikipedi dışı) telifli. Gerçek aday yalnız Vikipedi/Vikiveri.

## 2. (1) Kategori türü → önerilen kaynak
| Tür | Örnek kategoriler (plan §3.6) | Ana | Tamamlayıcı | Yıl kaynağı |
|---|---|---|---|---|
| Kapalı küme, coğrafya | il, ilçe (İstanbul/81 il), ülke, başkent, şehir | Wikidata | GeoNames (ADM1/ADM2 + alternateNames), Natural Earth (ülke/başkent çapraz kontrol) | ülke: P571/P576 |
| Kapalı küme, bilim | gezegen, element, uzay aracı, bilim insanı | Wikidata | trwiki kategori | P575 keşif, P619/P620 fırlatma |
| Kapalı küme, kurum | futbol takımı, üniversite, havayolu, banka, otomobil/telefon markası | Wikidata (P31/P279*, ülke filtresi) | trwiki "Süper Lig takımları" gibi kategoriler, TFF listesi (elle) | P571 kuruluş |
| Kapalı küme, ekonomi | para birimi, programlama dili, işletim sistemi, konsol, tarayıcı | Wikidata | – | P571/P577/P729 |
| Açık küme, eser | film, dizi, oyun, kitap, şarkıcı, albüm | Wikidata (trwiki makalesi olanlar) | trwiki kategorisi + yönlendirmeler | P577 yayın (MIN) |
| Açık küme, halk kategorileri | çorba, tatlı, içecek, meyve, sebze, kuş, meslek, giysi, ev eşyası, spor dalı | **trwiki kategorileri + Wikidata P279 ağacı (birlikte)** | Vikisözlük kategorisi; elle küratörlük | – (pay verisi gerekir, kaynak yok) |
| Hayvan/bitki | hayvan, kuş, ağaç, çiçek | Wikidata taksonomi (P225) + P1843/ P1420 Türkçe halk adı | trwiki | – |
| Yalnız pay (P) | sofra/halk kategorileri | **AI/elle** (plan §6.3 kuralları) | Wikipedia sayfa görüntülemeleri kaba proxy | yok |
Önemli: oyundaki pay (YAYGIN/NADİR) verisi için açık lisanslı gerçek anket YOK; `share` yine AI tahmini kalmalı. Wikidata `sitelinks` sayısı + trwiki sayfa görüntüleme "popülerlik sırası" olarak kullanılabilir, yüzdeye çevirmek yanıltıcı olur.

## 3. (2) Lisans / atıf özeti ve riskler
| Kaynak | Lisans | Ticari | Atıf | Risk |
|---|---|---|---|---|
| Wikidata | CC0 | evet | yok (önerilir) | en düşük |
| MusicBrainz çekirdek | CC0 | evet | yok | ek dump'lar NC: dosya karıştırma |
| Natural Earth | PD | evet | yok | düşük |
| GeoNames | CC BY 4.0 | evet | **zorunlu** | atıf satırı |
| trwiki (dump/kategori) | CC BY-SA 4.0 | evet | **zorunlu + SA** | metin kopyalanırsa SA; yalnız başlık+yıl çıkarımı güvenli |
| Vikisözlük | CC BY-SA | evet | zorunlu | düşük öncelik |
| DBpedia | CC BY-SA | evet | zorunlu | gereksiz |
| Open Food Facts | ODbL | evet | zorunlu + SA (veritabanı) | **yüksek** (copyleft) |
| IMDb datasets | kişisel/ticari değil | **hayır** | – | kullanma |
| MovieLens | araştırma | **hayır** | – | kullanma |
| TMDB | özel şartlar | koşullu | zorunlu | kullanma |
| TDK ve türev setler | telifli | hayır | – | kullanma |
Önerilen atıf (sayfa altı/"Hakkında"): "Soru adayları Vikiveri (CC0), Vikipedi (CC BY-SA 4.0) ve GeoNames (CC BY 4.0) verilerinden derlenmiştir." Ham dump'ı yeniden dağıtmayız; yalnız çıkarılmış ad/yıl listesi yayında olur.

## 4. (3) Tarayıcıda çevrimdışı küçültme
Mimari: **build-time** Node betiği ham veriyi çeker → temizler → `v3/data/*.js` üretir; oyun çalışırken ağ yok. Plan §3 şemasına uyum: `label`, `aliases`, `year`, `src` ("tr:Sayfa"), `approx`, `verified`.
Boyut tahmini (UTF-8, sıkıştırmasız → gzip ~%25-30):
| Küme | Üye | Alias dahil kayıt başı | Dosya |
|---|---|---|---|
| Kapalı kümeler (50 kategori x ort. 60-250) | ~6.000 | ~45 bayt | ~300 KB |
| Açık kümeler (film, dizi, şarkıcı, oyun, marka, yemek...) üst 300-1500/kategori | ~15.000 | ~55 bayt | ~800 KB |
| Aliaslar (ASCII yazım, çekimsiz) | ~25.000 | ~14 bayt | ~350 KB |
| **Toplam** | ~21.000 ad | – | **~1,5 MB ham, ~400-500 KB gzip** |
Kurallar: (a) kategori başına üst N (sitelinks sırasına göre) açık küme sınırı; (b) satır biçimi kompakt dizi `["Beyoğlu",[aliases],1923]` (JSON anahtar tekrarı yok); (c) alias'ları normalize ederek matcher'da çalışma anında ASCII katlama yap, depolama anahtarı tek tutulur; (d) dosya başına ≤25 soru kuralı (plan §3.1) için havuzları ayrı `pool_*.js` dosyalarına böl, soru dosyası yalnız havuza kimlikle bağlansın (`poolRef`); (e) kategori başına lazy `<script>` yüklemesi ile ilk açılışı hafif tut.

## 5. (4) Alias / yazım varyantı ve Türkçe ek/çekim stratejisi
1. **Kaynaktan**: Wikidata `skos:altLabel@tr`, `P1449`; trwiki **yönlendirmeleri** (redirect → hedef başlık; en zengin Türkçe varyant kaynağı: "Besiktas", "BJK", "Beşiktaş JK"); İngilizce etiket de ikinci dil alias (marka/film için; "Lord of the Rings" gibi).
2. **Türetilen yazım**: ASCII katlama (ı→i, ş→s, ğ→g, ç→c, ö→o, ü→u, İ/I), boşluk/tire/noktalama kaldırma, büyük/küçük harf `tr` yerel (İ/ı) hatasız. Çalışma zamanı matcher'ın işi, veri dosyasında tekrarlanmaz.
3. **Eklerden arındırma**: oyuncu "kadıköyde", "Fenerbahçe'yi", "iPhone'lar" yazabilir. Üç katman: (a) apostrof sonrası eki at; (b) sondan ek soyma (-da/-de/-ta/-te, -dan/-den, -ya/-ye, -yı/-yi/-yu/-yü, -ın/-in, -lar/-ler, -dir/-dır) listesi ile en uzun eşleşme + ünlü/ünsüz yumuşaması (kitap→kitabı, çiçek→çiçeği, ağaç→ağacı); (c) build-time Zemberek ile her kapalı küme kaydı için çekim LİSTESİ ÜRETME (kayıt başı +10 varyant) SADECE matcher'ın (b) katmanı yetmezse; boyutu 5x şişirdiği için ilk tercih değil.
4. **Çok sözcüklü adlar**: "X Spor Kulübü"/"X JK"/"X FK" ön/son ek kümesi ("jk, fk, sk, spor, belediyesi, ilçesi, a.ş., ltd") sözlüğü; "Galatasaray SK"→"Galatasaray" alias'ı otomatik türet.
5. **Gürültü temizliği (zorunlu)**: Wikidata alias'larında "ilçesi", ", İstanbul", açıklama parantezi, başka dil gibi çöp var (§0 İstanbul örneği): kural tabanlı süz (virgüllü, 5+ sözcüklü, parantezli, `Q123` biçimli çıkar). Kararsız alias'lar `aliases_review.json`'a düşsün, insan/agy onaysız eklenmesin.
6. **Çakışma**: aynı alias iki adaya gidiyorsa (Ayasofya/Sultanahmet, "Mercedes"→marka/model) ikisi de işaretlenir, `invalid` ve `closed` politikası plan §4.3 gereği.
7. **Eksik kapsam kalıbı**: hiç alias çıkmayan filmler/yemekler için matcher'ın "Levenshtein ≤1 (kısa ad ≤2)" yazım hatası toleransı (plan §4 matcher zaten v2'den geliyor; sınırları orada ayarla).

## 6. (5) Çekme betikleri ve sıra (Node.js, hepsi `D:\martı\...\v3\tools\fetch\`, çıktı `.cache/` ham → `data/` temiz)
Ortak: `lib/sparql.js` (fetch, `User-Agent: Pusulla-build/1.0 (iletisim adresi)`, 1,5 sn bekleme, 429/504'te üstel geri çekilme, LIMIT/OFFSET sayfalama, önbellek), `lib/normalize.js` (ASCII katlama, alias süzgeci), `lib/years.js` (MIN yıl, çoklu tarihte `approx`).
1. `00_probe.js` P31 dağılım sorgusu (`GROUP BY ?t`): bir kategorinin doğru Q sınıfını bulur (§0 dersi). Çıktı: `classes.json`. **İlk bu**, sınıf kimliğini tahmin etme.
2. `10_closed.js` kapalı küme SPARQL'ları (ülke egemen filtresi, il/ilçe, element, gezegen, para birimi, futbol kulübü+lig, üniversite, havayolu, banka, işletim sistemi, tarayıcı, programlama dili...) → `closed_*.json`. Satır: Q, tr etiket, tr altLabel, yıl (P571/P575/P577 MIN), sitelinks.
3. `20_geonames.js` TR.zip + alternateNames → il/ilçe adları ve alias; `10_closed` ile çapraz kontrol raporu (ilçe eksikleri: İstanbul 36/39 gibi) → `geo_diff.md`.
4. `30_trwiki_cats.js` MediaWiki API ile belirtilen trwiki kategori ağaçlarını (derinlik 2) gez (çorba, tatlı, içecek, meyve, sebze, hayvan, meslek, giysi...) + yönlendirmeler (`list=allredirects`) → `trwiki_*.json`. Dump gerekirse `categorylinks` SQL ayrıştırması sonraya.
5. `40_open.js` açık kümeler: Wikidata film/dizi/oyun/albüm/şarkıcı, `sitelinks` ≥ eşik + trwiki makalesi olanlar, ülke filtresi (Türk/ yabancı ayrı) → `open_*.json`.
6. `50_merge.js` Q kimliği ve normalize ada göre birleştir; alias süz; yıl çakışmalarını raporla (`year_conflicts.md`); `src` alanını `tr:` sitelink'ten doldur.
7. `60_emit.js` `data/pool_*.js` yaz, `check.js` ile doğrula (boyut raporu `pool_report.js`).
8. Aralıklı: `70_pageviews.js` Wikimedia Pageviews ile popülerlik sırası (opsiyonel).
Sıra: 00 → 10 → 20 → 30 → 40 → 50 → 60. Yıl doğrulama damgası (`verified`) yine plan §6.3 insan/Haiku kontrolü; otomatik çekilen yıl "ham", doğrulanana dek `approx` işaretli kalmalı.

## 7. (6) Tavsiye
**Ana kaynak: Wikidata (CC0)** — kapalı kümeler + yıl + etiket/alias iskeleti, tek SPARQL hattı.
Tamamlayıcılar: **trwiki kategorileri ve yönlendirmeleri** (halk kategorileri + yazım varyantı), **GeoNames** (il/ilçe tamlığı, CC BY atıf), **Natural Earth** (ülke/başkent çapraz kontrol, PD). MusicBrainz çekirdek yalnız gerekirse (CC0).
Kullanma: IMDb, MovieLens, TMDB, TDK ve türevleri, vocably (AGPL), Open Food Facts (ODbL copyleft), DBpedia (gereksiz).
Açıklar (kaynakla kapanmaz, elle/AI): pay yüzdeleri, gündelik yemek/ev eşyası/meslek listeleri, yerel gündelik takma adlar.

## 8. Özet (8 satır)
1. Wikidata CC0, çalışıyor: İstanbul ilçeleri 36/39 satır (17 alias); Türk futbol kulübü 478; ülke 237; video oyunu 5000+ (yıllar %99).
2. Wikidata gündelik kategorilerde ince (çorba yalnız 14) ve Türkçe alias seyrek ve gürültülü: süzgeç şart.
3. Trwiki kategorileri + yönlendirmeleri (CC BY-SA) halk kategorilerini ve yazım varyantlarını kapatır; yalnız başlık/yıl çıkarılırsa SA yükü yok.
4. GeoNames (CC BY) il/ilçe tamlığı için; Natural Earth (PD) ülke/başkent çapraz kontrol.
5. IMDb/MovieLens/TMDB/TDK ticari yayın için uygun DEĞİL; OFF ODbL copyleft riskli; DBpedia gereksiz.
6. Çevrimdışı hedef: ~21 bin ad, ~1,5 MB ham, ~400-500 KB gzip; build-time Node betikleri, çalışma zamanında API yok.
7. Ek/çekim: apostrof/sondan ek soyma + ASCII katlama matcher'da; Zemberek yalnız gerekirse build-time.
8. Pay verisi için açık kaynak yok: `share` AI tahmini kalır; sitelinks/pageviews yalnız sıralama proxy'si. Sıra: 00_probe → 10_closed → 20_geonames → 30_trwiki → 40_open → 50_merge → 60_emit.
