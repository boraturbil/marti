# Wonderhop analizi (wonderhop.io/tr, 2026-11-22)

Türkçe modda **Gökyüzü** baştan sona oynandı (440/700), **Derinlik**'in 1. sorusu denendi.
Ekran görüntüleri: `analiz/` klasörü (01–14).

---

## 1. Genel yapı
- **4 günlük mod**, hepsi aynı mekanik, farklı hedef:
  - Gökyüzü ▲: en çok verilen cevap → balon yükselir
  - Derinlik ▼: en nadir (ama geçerli) cevap → balon suya dalar
  - Geçmiş / Gelecek: en eski / en yeni cevap
- Ek: Sınırsız, Arşiv, Temalı paketler, Film ve oyunlar, Liderlik tablosu, Lig, "Günümü paylaş".
- **Her gün 7 soru**, soru başına **30 sn**, maks **700 puan**. Gün sınırı: Montreal gece yarısı.
- 9 dil; yüzdeler **tüm dillerden ortak** hesaplanıyor (yabancı soruların çevirisi hissediliyor:
  "beer pong" Türkçe'de %32,8 ile 1. cevap).
- Hesapsız oynanıyor, otomatik takma ad ("Bunny-550856"), sonradan değiştirilebilir.
- Yüzdeler: başta tahmini değerlerle başlıyor, oyuncu cevaplarıyla güncelleniyor.
- Liste dışı cevaplar bir **yapay zekâ hakemine** gidiyor: kabul ederse tahmini pay verir (asla 1.'den yüksek değil),
  reddederse tek cümlelik gerekçe yazar.

## 2. Ana menü (01)
- Üstte büyük piksel logo, arkada sahnenin kendisi (balon su yüzeyinde, sis/şerit efekti).
- 2×2 büyük kart: Gökyüzü / Derinlik / Geçmiş / Gelecek, her birinin altında tek satır açıklama.
- Altta ikincil satırlar: Sınırsız, Arşiv, Temalı paketler, Liderlik, Lig. Sol altta dil seçici.
- İlk girişte "Sıralama için adını seç — DAHA SONRA / SEÇ" penceresi.

## 3. Soru ekranı (02)
- Giriş animasyonu: önce ekran ortasında büyük yazı "Herkesin vereceği cevabı ver.", sonra tabela iner.
- **Tabela kartı**: koyu, ipe asılı (üstte küçük zincir), hafif sallanıyor.
  İçerik: 7 ilerleme kutucuğu + puan, "▲ GÖKYÜZÜ SORU 1/7", büyük piksel yazı tipiyle soru,
  sarı küçük "Herkesin vereceği cevabı ver.", altında **ince süre çubuğu** (kartın içinde).
- **Cevap kutusu** ekranın altında sabit, koyu panel içinde: sarı çerçeveli input + "GÖNDER".
- **GEÇ butonu baştan yok**: ilk yanlış cevaptan sonra ya da ~10 sn geçince cevap kutusunun sağ üstünde beliriyor.
- Sol üstte rozet: bölge adı + yükseklik (örn. "KIYI +900 m"). Sağ üstte ses düğmesi.

## 4. Yanlış / geçersiz cevap (03)
- Cevap kutusunun **hemen üstünde** aynı koyu panelin parçası gibi bir şerit açılıyor; açıklama **beyaz/krem** yazıyla
  (kırmızı değil, sakin): "Lacivert bir renktir, tekerlekli ve itilen bir şey değildir."
- Süre durmuyor, input içeriği kalıyor, oyuncu düzeltip tekrar deniyor. Puan kesilmiyor.

## 5. Doğru cevap akışı (04–09)
1. Gönderince önce **altta kademe şeridi** kayıyor: ikon + kademe adı + "+30 puan" (kademe renginde, örn. yeşil).
2. Aynı anda **kamera yükseliyor**: balon tırmanıyor, su aşağı kayıyor, bulut katmanları parallax ile geçiyor (~2–3 sn).
3. Sonra **sonuç paneli** ekranın ortasında-altta açılıyor (tabela üstte kalıyor, ama "Herkesin…" satırı kalkıyor):
   - Kademe renginde başlık şeridi: ikon + "İDARE EDER" + büyük "+30 puan".
   - Tek cümle:
     - 1. ise "Bu 1 numaralı cevap."
     - 2–3. ise "Bu 3 numaralı cevap: verenlerin oranı %8,4."
     - Zayıf ise "Az verilmiş (%0,01): yukarı sadece küçük bir adım."
     - Süre biterse "Süre doldu."
   - "DİĞER CEVAPLARDAN ÖRNEKLER": 4–5 satır, sağda gri yatay çubuk + "%50,8". Oyuncunun satırı kalın ve "(sen)",
     çubuğu kademe renginde. İlk 4'te değilse 5. satır olarak ekleniyor.
   - Büyük krem renkli "SONRAKİ SORU" butonu (Enter çalışıyor). Son soruda "PUANIMI GÖR".
4. Tabeladaki ilerleme kutucuğu kademenin ikon/rengiyle doluyor.

### Kademeler (Gökyüzü'nde gözlenen)
| Kademe | Renk / ikon | Puan | Örnek |
|---|---|---|---|
| MÜKEMMEL | altın, ★, harfleri tek tek zıplayan yazı, panel çerçevesi parlıyor | +100 | 1. cevap |
| (ÇOK İYİ / HARİKA / SÜPER) | – | 70 / 50 ? | 2. cevap (görülmedi) |
| İDARE EDER | yeşil, ◇ | +30 | **3. cevap (%8,4)** |
| ZAYIF | kırmızı, ➜ | +10 | %0,01 |
| SÜRE DOLDU | gri, ⌛ | 0 | |
Not: kademe **sıra + paya göre**; 3. cevap bile "İdare eder" sayılmış.
Derinlik'te tablo ters: listede her satırın solunda kademe etiketi var (Mükemmel %0,02 … Zayıf %4,8),
cümle "İyi saklanmış: verenlerin oranı sadece %0,76."

### Eşleştirme gözlemi
- "alışveriş yapmak" → "alışverişe gitmek"e, "yemek" → "yemek yapmak"a eşlendi (kök/anlam eşleşmesi, muhtemelen yapay zekâ).
- Özette oyuncunun kendi yazdığı metin gösteriliyor, listede ise eşlenen etiket.

## 6. Arka plan / dünya değişimi (en güçlü kısım)
Puan = yükseklik. Her eşik bir **bölge**; yeni bölgeye girişte ekranın üstünde büyük piksel yazıyla bölge adı
(altı çizili) çıkıyor, rozet de güncelleniyor.
| Puan | Yükseklik | Bölge | Görsel |
|---|---|---|---|
| 0 | yüzey | YÜZEY | gün batımı, sakin deniz, iki yanda kayalık, deniz feneri, şamandıra, yelkenli, su altında balıklar ve ışık hüzmeleri, alt yarı su altı kesiti |
| 30–40 | ~900 m | KIYI | su ekranın altına iniyor, tozlu pembe-bej gökyüzü, ufukta kayalık ve fener |
| 240 | ~1.100 m | UÇUŞ KORİDORU | lacivert-gri gece, karlı dağ silüetleri, bulut bantları, düşen kar/parçacık |
| 340 | ~10.000 m | KUTUP IŞIKLARI | koyu gece, yeşil aurora perdeleri, uzakta gezegenler |
| 440 | ~13.000 m | GALAKSİ | uzay: sarmal galaksi, halkalı gezegen, nebula bulutları, balon altın renge dönüyor |
- Bölgeler arası geçişler kesintisiz: kamera yukarı kayıyor, katmanlar farklı hızda.
- Derinlik'te ters yön: balon suya dalıyor (rozet "BERRAK SU −3 m"), su altı yosun, kaya, eski çömlekler.
- Bitişte **sinematik ekran**: kamera bulunulan bölgede, ortada bölge adı + puan, "GEÇMEK İÇİN DOKUN".
- Tüm sahne düşük çözünürlüklü piksel sanat, hafif yatay şerit/sis dokusu, sürekli küçük canlılık
  (kuş sürüleri, balıklar, dalga parıltısı, düşen parçacıklar).

## 7. Bitiş / özet ekranı (13)
- Sol sütun: "GÜNÜN GÖKYÜZÜ 440/700 PUAN", **günlük seri** kutusu (alev ikonu, "Serin başlıyor"),
  7 sorunun listesi (soru, oyuncunun cevabı, kademe etiketi, puan; açılır ▾ detay).
- Büyük buton "Sıradaki: Derinlik — en nadir cevap" (modlar arası zincirleme), PAYLAŞ, OYUNUMU İNCELE,
  mod sekmeleri (✓ işaretli), YARIN HATIRLAT, ANA SAYFA.
- Sağ sütun: takma ad + DEĞİŞTİR, **sıralama**: "49.122 oyuncu içinde 31049. — %35'inden iyi",
  puan dağılımı histogramı (ortalama 475, "SEN" işaretli), günün ilk 10'u, mod bazında puanlar, en iyi oyunlar ("Gün 48").

## 8. Neden iyi hissettiriyor
1. **Puanın fiziksel karşılığı**: her doğru cevap görünür bir yükselişe dönüşüyor; büyük ödül yeni bölge açmak.
2. **Merak**: bir sonraki bölgenin neye benzediğini görmek için daha iyi oynamak istiyorsun.
3. **Yumuşak hata**: yanlış cevap cezasız, açıklamalı; GEÇ geç beliriyor (vazgeçmeyi teşvik etmiyor).
4. **Ritim**: şerit → kamera hareketi → panel; her cevap ~3 sn'lik küçük bir ödül sahnesi.
5. **Sosyal halka**: seri, sıralama, histogram, paylaş, "yarın hatırlat", modlar arası zincir.

## 9. Martı için çıkarımlar (kopyalamadan, kendi temamızla)
- **Bölge sistemi** ekle: İstanbul'a özgü kendi katmanlarımız; örnek: Boğaz yüzeyi → Galata hizası → Çamlıca tepesi
  → bulutlar/fırtına → gece İstanbul ışıkları yukarıdan → yıldızlar/ay. Girişte büyük bölge adı + rozet (yükseklik).
- **Sonuç akışı**: önce kademe şeridi + kamera hareketi, sonra panel (şu an panel hemen açılıyor).
- **Geçersiz cevap mesajı** daha sakin (kırmızı yerine krem yazı, panelin parçası).
- **GEÇ** baştan değil, ~10 sn sonra ya da ilk yanlıştan sonra görünsün.
- MÜKEMMEL'de harf harf zıplayan yazı + panel çerçevesi parıltısı.
- Bitişte **sinematik ekran** (bölge adı + puan) → sonra özet (soru listesi + kademe + puan, günlük seri).
- İleride: ikinci mod (en nadir cevap → martı suya dalar), günlük seri, sabit tarih tabanlı günlük set.
- Kaçınılacak: sıcak hava balonu, tavşan, deniz feneri, onların bölge adları ve logo stili (özgün kalmalı).
