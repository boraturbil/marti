# SİNYAL PİLOT RAPORU (5 soru)

Tarih: 2026-11-22. Veri dosyalarına dokunulmadı. Gönderilen tek şey soru/cevap metinleri (kişisel veri yok).

## (a) Yöntem işe yaradı mı? Dürüst sonuç

**Kısmen; otomatik pipeline olarak hayır, el ile "sıra sanity-check" olarak evet (yalnız tatlı sorusunda).**

- Google Suggest (`client=firefox&hl=tr`) çalışıyor ama bu soru tipi için neredeyse boş: "<soru kalıbı> <cevap>" sorgularının tamamı (kahvaltı x7, vapur, pazarcı, bahane) BOŞ döndü. Öneriler sıklık verisi vermiyor, yalnız sıra ve tamamlama veriyor; sıra de facto "popülerlik" ama sonuç yok.
- Çıkan tek anlamlı öneri: "vapurda simit / vapurda çay simit" (TRT programı "Vapurda Çay Simit Sohbet" kirletiyor, kullanıcı davranışı sinyali DEĞİL), "türk tatlıları tier list / sıralama", "işe geç kalma bahaneleri".
- WebSearch (5 sorgu): yalnız tatlı sorusunda gerçek yüzdeli kaynak bulundu (Areda Piar şerbetli tatlı anketi; çoklu seçim, "en sevilen", ilk-akla-gelen DEĞİL). Kahvaltıda "çay %97 kahvaltıda içilir" (Pragma) var ama başka cevaplarla kıyas yok. Bahane ve vapur için Türkiye'ye özgü yüzde yok (yalnız İngiltere AA anketi, trafik ağırlıklı). Pazarcı nidası için hiçbir kaynak.
- Eksik kısım: forum/Ekşi Sözlük başlıkları bu pilotta ayrıca taranmadı (WebFetch ile eksi tarama yapılmadı; süre/bot engeli riski). Bunu "sinyal yok" değil "denenmedi" say.

Sayım: 5 sorunun ~75 cevabından kullanılabilir sinyal bulunan: **~3 cevap (baklava, künefe, kadayıf; q09)** + zayıf yön sinyali 2 cevap (q21 trafik, q01 çay). Yani ~%5-7 kapsama.

## (b) Bulgular tablosu

| Soru | Mevcut pay (üst) | Bulunan sinyal | Uyum/çelişki | Sıra değişimi önerisi | Güven |
|---|---|---|---|---|---|
| q01 Kahvaltıda olmazsa olmaz | Çay 36.1, Peynir 16.8, Zeytin 11.2, Yumurta 9.5, Simit 6.4 | Çay kahvaltıda %97 içiliyor (Pragma, çay tüketim araştırması); metinlerde "peynir, zeytin, yumurta" çekirdek sayılıyor ama yüzde yok. Suggest boş. | Çay 1. sıra ile uyumlu; geri kalan sıra için sinyal yok | Yok | Düşük (çay 1. için orta) |
| q03 Vapurda yapılan | Simit atmak 32.2, Çay içmek 24.6, Manzara 12.8 | Suggest yalnız "vapurda simit / çay simit" (TV programı, kirli). Haberlerde "simit atmak" ve çay-simit öne çıkıyor, yüzde yok | Niteliksel uyum (simit+çay merkezi) | Yok | Düşük |
| q09 Türk tatlısı | Baklava 34.4, Künefe 14.4, Sütlaç 10.4, Kazandibi 6.6, Revani 5.6, Lokma 5, Aşure 4.4, Tulumba 3.8, Kadayıf 2.6 | Areda Piar şerbetli tatlı anketi (çoklu seçim): Baklava %64.1, Künefe %44.6, Kadayıf %31.7, Revani %11.5. Suggest: "türk tatlıları tier list/sıralama" var ama sıra içermiyor. Yemeksepeti sipariş listesinde sütlaç 2. (haber özeti, doğrulanmadı) | Baklava>Künefe uyumlu. ÇELİŞKİ: Kadayıf (2.6) anket sırasına göre Revani (5.6), Lokma, Tulumba'nın üstünde olmalı. Sütlaç sipariş verisiyle 2. sırayı iddia ediyor, bizde 3. | Kadayıf'ı en az Revani üstüne (ör. ~5-6) çıkar; Sütlaç/Künefe sırası belirsiz, dokunma | Orta (baklava/künefe), Düşük (kadayıf: şerbetli-only, "sevilen" ≠ "ilk akla gelen") |
| q10 Pazarcı bağırışı | Gel abla gel 20.5, Taze bunlar taze 15.5, Ucuz ucuz 12.4 | Suggest: "pazarcı sloganları / komik pazarcı sloganları" (içerik yok). Web: kaynak yok | Sinyal yok | Yok | Yok |
| q21 Geç kalma bahanesi | Trafik vardı 33.8, Alarm çalmadı 21.8, Otobüsü kaçırdım 12 | Kariyer.net: trafik/hava/hastalık tipik; PageGroup: Türkiye'de en uzun işe gidiş. İngiltere AA anketi trafik/yol kaynaklı öne çıkıyor. "Alarm çalmadı" için TR yüzdesi yok | Trafik 1. ile uyumlu; "Rahatsızlandım" (7.2) literatürde ilk 3'e girebilir (İngiltere: hastalık+uyuma %9, yalnız yön) | Yok (rahatsızlandım'ı yukarı almak istersen çok zayıf) | Düşük |

Not: Tüm Google sorguları kayıtlı: kahvaltıda olmazsa olmaz{,çay,peynir,zeytin,yumurta,simit,menemen,sucuk}, vapurda{yapılan,simit,çay,ne yapılır,yapılacak}, türk tatlıları{,baklava,künefe,sütlaç,en meşhur,en sevilen}, pazarcı{bağırışları,sloganları,gel abla,taze,ucuz}, geç kalma bahane varyantları.

## (c) Önerilen yöntem ve 42 soru iş yükü

Gerçek sinyal "ilk akla gelen cevap" payını doğrulayamaz; en fazla sıra/yön doğrulaması yapar ve yalnız bilinçli bir alt kümede.

1. **Kapsama sınıflandırması (kolay):** 42 soruyu 3 sınıfa ayır: (A) ölçülebilir/ansiklopedik (tatlı, içecek, şehir, marka, ürün, spor takımı, tarih; ~8-12 soru tahmini) -> anket/sipariş/liste kaynağı var; (B) davranış/deneyim (vapur, pazar, bahane; ~20) -> sinyal yok, AI tahmini kalır; (C) karışık.
2. **Yalnız A sınıfı için:** soru başına 3-4 WebSearch ("en sevilen/en çok tüketilen X anket", Yemeksepeti/Trendyol/Google Trends/TÜİK/Areda/Pragma tipi). Çıktı: yüzde değil **sıra çifti** (X>Y) ve eşleşmeyen çelişkiler; yalnız açık çelişkide (ör. kadayıf) pay ayarla, mutlak yüzdeyi anket sayısından türetme.
3. **Google Suggest:** otomatik tamamlama sıralaması yalnız "<kalıp> <ilk harf/ilk kelime>" biçiminde tür keşfi (hangi cevaplar eksik) için; sıralama kanıtı sayma. Tahmini 42 soru x 2 sorgu = ~1 dk betik (rate limit sorunu görülmedi).
4. **Ekşi Sözlük / forum:** bu pilotta denenmedi; B sınıfı için "alternatif cevap keşfi" (eksik aliaslar) amacıyla ayrı pilot önerilir, sıralama için değil.
5. **İş yükü:** A sınıfı ~10 soru x 3-4 arama + okuma ≈ 2-3 saat agy/Haiku işi; tüm 42 için sıfırdan "doğrulama" gerçekçi değil (sinyal çoğunda yok). Tahmini net kazanç: 42 sorunun ~5-8'inde 1-2 sıra düzeltmesi.
6. **Çıktı biçimi:** soru başına `kaynak URL, ölçüt (çoklu seçim/sipariş/liste), tarih, sıra çifti, güven`; güven "orta" altı otomatik uygulanmaz.

Kaynaklar (arama sonuçları): habergazetesi.com.tr (Baklava zirvede, Künefe yükseliyor / Areda Piar), gzt.com Areda Piar, kariyer.net rehber, marketingturkiye.com.tr (çay-simit), theaa.com (İngiltere bahane anketi).
