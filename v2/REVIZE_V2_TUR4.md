# REVIZE V2 — TUR 4 (matcher esnekliği + alias genişletmesi kontrolü)

Tarih: 2026-11-22. Kod ve veri değiştirilmedi. Test betikleri scratchpad'de (load.js, fp.js, pos.js, dbg.js).

## Durum özeti
- `node tools/check.js`: TEST 845/845, matcher 205/205, alias toplamı 4.335'ten 12.934'e çıktı. Hata yok.
- Etiketler, share değerleri, sıralama, `text`/`cat`, `invalid` ve `tests`: yedekle (v2_yedek_tur3) **birebir aynı** (0 fark). game/config/scene/index değişmemiş. Not: check.js'teki 6-40 alias tavanı yedekte de vardı; check.js'e yalnız 24 esneklik/koruma testi eklenmiş.
- OLUMLU: q21 "sular kesikti", "elektrikler kesikti", "su gitmişti" doğru gruba gidiyor (3/3). 10 soruda 33 doğal alternatiften 33'ü geçerli bir cevaba eşleşti; 2'si yanlış gruba düştü (aşağıda), 1'i eşleşmedi ("temel reis", q36; bu kabul edilebilir).
- YANLIŞ POZİTİF: **Ciddi sorun var.** 42 soruda 25.379 alakasız/yanlış girdi denendi (genel kelimeler, saçma cümleler, kısa kökler, başka soruların cevapları ve invalid'leri). 1.286'sı "valid" sayıldı, bunların **1.055'i yeni** (yedekte eşleşmiyordu). Yeni eşleşmelerin yolları: root 934, token 49, fuzzy 28, overlap 24, stem 13, content 4, exact 3.

## Sorunlar (öncelik sırasıyla)

1. **matcher.js:309-346 `findSingleRootMatch`, adım (i) satır 886-895: tek kök eşleşmesi çok gevşek (934 yanlış pozitif).** En az 2 kelimeli girdide tek bir ≥4 harfli kök (ya da `su`/`ev`/`el`/`at` gibi güvenli kısa kök) tek bir grubun herhangi bir alias'ında geçiyorsa cevap doğru sayılıyor. Girdinin geri kalan kelimeleri hiç tanınmasa bile oluyor (`if (!groups) continue`). Örnekler:
   - q36 "çok güzel" → Pamuk Prenses (alias "uyuyan güzel")
   - q27 "kesinlikle hayır" → El öpmek ("el öpüp hayır duası almak")
   - q26 "adana kebap" → Aile Arasında ("adana aile arasında")
   - q09 "su içmek" → Muhallebi ("su muhallebisi")
   - q40 "su içtim" → Market alışverişi
   - q21 "su içmeye gittim" ve "elektrik faturası" → Elektrikler kesildi
   - q21 "boğaz köprüsü" → Trafik vardı
   - q20 "trafik vardı" → Haritalar

   **Yapılacak:** Bu adımı kaldır, ya da şöyle sıkılaştır: girdideki tüm içerik kökleri aynı grupta bulunmalı (tanınmayan kök kalırsa eşleşme yok); kök yalnız ≤2 köklü kısa alias'lardan gelmeli (`shortRootMap`); `su`/`ev`/`el`/`at` tek başına tetiklememeli. Bundan sonra q21'deki 3 hedef girdi yine geçmeli ("su kesildi" ve "elektrikler gitti" alias'ları ikisini de karşılıyor). check.js'e de yukarıdaki örnekleri "not_valid" testi olarak ekle.

2. **matcher.js:267-302 `findContentOverlapMatch`: oran ≥0.6 ve en az 2 kök şartı, alias'ın ana ismini atlamaya izin veriyor.** 3 köklü bir alias'ta yalnız fiil/zaman kökleri tutsa da eşleşme oluyor. Örnekler:
   - q21 "işe geç kaldım" (sorunun kendisi) → Otobüsü kaçırdım ("otobüs geç kaldı")
   - q11 "siyah beyaz film" → Beşiktaş
   - q14 "çay içmek" → Tekrar kahve yapmak
   - q28 "Mimar Sinan" → Süleymaniye Camii
   - q03 "Türk kahvesi" → Kahve veya salep içmek

   **Yapılacak:** Eşleşen köklerin içinde alias'ın isim kökü (fiil ya da `HAFIF_FIILLER` olmayan, ≥4 harf) bulunsun; `kal`/`gec`/`ol`/`var`/`git` gibi hafif kökleri sayma; 3 köklü alias'ta 3/3 şartı koy.

3. **matcher.js:27-30 ve 89: yeni ekler isim köklerini fiil kökleriyle çakıştırıyor.** Değişiklikler: SUFFIXES'e `dı/di/tı/ti`, `miş`, `iyor` eklendi; `lar`/`ler` için kalan kök sınırı 2'ye indi. Sonuçlar:
   - q13 "geldi" → Gelin (gelin ile geldi aynı `gel` köküne iniyor), "hoş geldin" → Gelin
   - q10 "bitti" → Kaçırma ("bitiyor")
   - q22 "Kuruyemiş" → Kuru fasulye (kuruye**miş** soyuluyor ve `kuru` kalıyor)
   - q04 "çay", "çay içmek", "demli çay" → Çocuklar Duymasın ("çaylar" → `çay`, 2 harfli kök)

   **Yapılacak:** Fiil ekleri (`di`/`ti`/`miş`/`iyor`) yalnız fiil alias'larında ya da içerik örtüşmesi yolunda kullanılsın, tek kelimelik isim anahtarlarında (`buildKeySet` ile exact/stem) kullanılmasın. `lar`/`ler` için kök sınırı yeniden 3 olsun ya da yalnız `su`/`ev` gibi beyaz listedeki kökler için 2 kalsın.

4. **Alias: yanlış gruba ait ya da tehlikeli tek kelimeler (yeni eklenenler).**
   - q04 Çocuklar Duymasın: "çaylar", "gönül", "emine", "meltem", "haluk", "havuç". Karakter adları ve genel kelimeler; "çay" ve "havuç" girdilerini diziye bağlıyor.
   - q38 Taksim'e gitmek: "kadıköy" (yılbaşında Kadıköy'e gitmek Taksim değil).
   - q36 Pepee: "kalemim" ("kalem" → Pepee).
   - q24 Peynir: tek başına "iftariyelik" (girdi "iftariyelik" → Peynir; Zeytin ve Hurma da iftariyelik).
   - q21 Metro arızalandı: "metrobüs kalabalıktı" ("yollar kalabalıktı" → Metro, oysa Trafik vardı olmalı).

   **Yapılacak:** Bu alias'ları sil ya da çok kelimeli hale getir (ör. "çaycı hüseyin" kalsın, "çaylar" silinsin).

5. **Alias: anlam kayması / grup şişmesi (spot kontrolde 12 cevaptan 4'ünde).**
   - q25 Cüzdan: "kimlik", "ehliyet", "kredi kartı", "nüfus cüzdanı" (cüzdan değil, ayrı eşyalar; "kimlik kartı" → Cüzdan).
   - q05 Kapıyı kilitle: "ocağı kontrol et", "ışıkları söndür", "ütü fişte mi", "doğalgazı kapat", "camı kapat" (kapı kilitlemek değil, genel "kontrol et" uyarıları).
   - q33 Nazar boncuğu takmak: "kolye takmak", "bileklik takmak".

   **Yapılacak:** Bu alias'ları gruptan çıkar. Ayrıca tasarım kararı gerekiyor: bunlar "Kapıyı kilitle" gibi ayrı bir şemsiye gruba mı alınacak, yoksa geçersiz mi sayılacak? Diğer kalabalık gruplarda da aynı tarama yapılmalı.

6. **Kısa alias'lar fuzzy eşleşmeyi yanlış yöne çekiyor (28 yeni fuzzy eşleşme).**
   - q17 "Tarkan" → Çorba ("tarhana")
   - q25 "makarna" → İğne / iplik ("makara"), "kesildi" → Makas ("kesici")
   - q04 "kilim" → Kurtlar Vadisi ("kılıç"), "şeker" → Poyraz Karayel
   - q21 "kredi kartı" → Kedim hastalandı ("kedi kaçtı")
   - q39 "deneme" → Babaanne ("nenem")

   **Yapılacak:** Yeni eklenen ≤6 harfli tek kelimelik alias'lar fuzzy aramaya katılmasın (yalnız exact/stem eşleşsin), ya da bu alias'larda fuzzy mesafesi 1'e indirilsin.

7. **matcher.js:348-367 + 794-811: `findInvalidTokenMatch`, valid fuzzy/content'ten önce çalışıyor.** Çok kelimeli girdide tek bir kelime tek kelimelik bir invalid alias'a denk gelirse cevabın tamamı invalid sayılıyor. Taramada bu yolla yanlış pozitif görülmedi, ama doğru cevaplar ezilebilir (ör. geçerli cevabın içinde invalid'deki bir kelime geçmesi). **Yapılacak:** check.js'e 2-3 karma örnek (geçerli kelime + invalid kelime) test olarak ekle ve davranışın istenen bu mu olduğuna karar ver. Düşük öncelik.

## Sonuç
Yapı (etiketler, share değerleri, sıra) sağlam ve q21 hedef girdileri çalışıyor. Ancak yeni esneklik katmanı, özellikle tek kök eşleşmesi (1. madde) ve gevşek örtüşme (2. madde), alakasız girdileri doğru sayıyor. 1-3. maddeler düzeltilmeden yayına alınmamalı. Düzeltmeden sonra scratchpad'deki `fp.js` yeniden çalıştırılmalı; hedef, yeni eşleşmelerin 1.055'ten <50'ye inmesi ve kalanların gerçekten doğru cevap olduğunun elle doğrulanması.
