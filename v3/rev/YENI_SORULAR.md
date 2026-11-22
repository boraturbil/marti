# PUSULLA — Yeni Sorular ve Düzeltme Raporu (YENI_SORULAR)

## 1. Eklenen 30 Yeni Soru (`data/q_demo2.js`) ve Havuzları (`data/pool/*.js`)
| # | Soru ID | Konu (`subject`) | Kategori (`cat` / Tema) | Havuz (`data/pool/`) | Küme / Eksen |
|---:|---|---|---|---|---|
| 1 | `ankara_ilce_01` | ANKARA İLÇESİ | `turkiye` (Türkiye) | `ankara_ilce.js` | Kapalı (25) / B |
| 2 | `turk_universitesi_01` | TÜRKİYE ÜNİVERSİTESİ | `turkiye` (Türkiye) | `turk_universitesi.js` | Açık / B |
| 3 | `antik_kent_tr_01` | TÜRKİYE ANTİK KENTİ | `turkiye` (Türkiye) | `antik_kent_tr.js` | Açık / P |
| 4 | `milli_park_tr_01` | TÜRKİYE MİLLİ PARKI | `turkiye` (Türkiye) | `milli_park_tr.js` | Açık / B |
| 5 | `avrupa_kulubu_01` | AVRUPA FUTBOL KULÜBÜ | `spor` (Spor) | `avrupa_kulubu.js` | Açık / B |
| 6 | `nba_takimi_01` | NBA TAKIMI | `spor` (Spor) | `nba_takimi.js` | Kapalı (30) / B |
| 7 | `f1_pilotu_01` | FORMULA 1 PİLOTU | `spor` (Spor) | `f1_pilotu.js` | Açık / P |
| 8 | `spor_ekipmani_01` | SPOR EKİPMANI | `spor` (Spor) | `spor_ekipmani.js` | Açık / P |
| 9 | `bilim_insani_01` | BİLİM İNSANI | `doga` (Bilim) | `bilim_insani.js` | Açık / P |
| 10 | `insan_organi_01` | İNSAN ORGANI | `doga` (Bilim) | `insan_organi.js` | Açık / P |
| 11 | `degerli_tas_01` | DEĞERLİ TAŞ veya MİNERAL | `doga` (Bilim) | `degerli_tas.js` | Açık / P |
| 12 | `takimyildiz_01` | TAKIMYILDIZ | `doga` (Bilim) | `takimyildiz.js` | Açık / P |
| 13 | `turk_kebabi_01` | KEBAP veya ET YEMEĞİ | `mutfak` (Yemek) | `turk_kebabi.js` | Açık / P |
| 14 | `peynir_cesidi_01` | PEYNİR ÇEŞİDİ | `mutfak` (Yemek) | `peynir_cesidi.js` | Açık / P |
| 15 | `baharat_01` | BAHARAT | `mutfak` (Yemek) | `baharat.js` | Açık / P |
| 16 | `icecek_01` | ALKOLSÜZ İÇECEK | `mutfak` (Yemek) | `icecek.js` | Açık / P |
| 17 | `muzik_aleti_01` | MÜZİK ALETİ | `kultur` (Müzik) | `muzik_aleti.js` | Açık / P |
| 18 | `muzik_turu_01` | MÜZİK TÜRÜ | `kultur` (Müzik) | `muzik_turu.js` | Açık / P |
| 19 | `turk_muzik_grubu_01` | TÜRK MÜZİK GRUBU | `kultur` (Müzik) | `turk_muzik_grubu.js` | Açık / B |
| 20 | `klasik_besteci_01` | KLASİK MÜZİK BESTECİSİ | `kultur` (Müzik) | `klasik_besteci.js` | Açık / P |
| 21 | `deniz_okyanus_01` | DENİZ veya OKYANUS | `cografya` (Coğrafya) | `deniz_okyanus.js` | Açık / P |
| 22 | `nehir_01` | NEHİR | `cografya` (Coğrafya) | `nehir.js` | Açık / P |
| 23 | `dag_01` | DAĞ | `cografya` (Coğrafya) | `dag.js` | Açık / P |
| 24 | `ada_01` | ADA | `cografya` (Coğrafya) | `ada.js` | Açık / P |
| 25 | `antik_uygarlik_01` | TARİHİ DEVLET veya UYGARLIK | `toplum` (Tarih) | `antik_uygarlik.js` | Açık / B |
| 26 | `savas_antlasma_01` | TARİHİ ANTLAŞMA | `toplum` (Tarih) | `savas_antlasma.js` | Açık / B |
| 27 | `dunya_harikasi_01` | DÜNYA HARİKASI veya ANIT | `toplum` (Tarih) | `dunya_harikasi.js` | Açık / P |
| 28 | `yapay_zeka_01` | YAPAY ZEKA MODELİ veya ARACI | `teknoloji` (Teknoloji) | `yapay_zeka.js` | Açık / B |
| 29 | `dosya_uzantisi_01` | DOSYA FORMATI veya UZANTISI | `teknoloji` (Teknoloji) | `dosya_uzantisi.js` | Açık / P |
| 30 | `bilgisayar_donanimi_01` | BİLGİSAYAR DONANIM PARÇASI | `teknoloji` (Teknoloji) | `bilgisayar_donanimi.js` | Açık / P |

## 2. GÖREV B — Hata Düzeltmesi (Kök Neden ve Dosya:Satır)
- **Kök Neden:** (1) `game.js:1328-1365` içinde `P.actions.submit(text)` fonksiyonu `valid` cevapta `state.locked = true` yaparken, `answer:none` (`game.js:1363`, ör. `ist_muze_01`'de `"topkapı"`) ve `answer:invalid` (`game.js:1335,1343`) durumlarında soru devam ettiği için kilitlemiyor ve aynı soruda daha önce/az önce gönderilen girdiyi (`triedInputs`) kontrol etmiyordu. (2) `ui/question.js:389-400` `answer:none` sonrasında `els.input.select()` ile `"topkapı"` metnini kutuda bırakıyor, `ui/question.js:336` `onKey` dinleyicisi ise `!e.repeat` kontrolü yapmadığından çift Enter veya basılı tutmada `submit()` iki kez çağrılıp `ui/question.js:397` (`addFb`) üzerinden üst üste iki uyarı kartı ekliyordu.
- **Düzeltme:** `game.js:176,875,1328-1334` içinde soru bazlı `state.triedInputs` (`normText` anahtarı) ve `state.pendingConfirm` koruması eklendi; `ui/question.js:336`'ya `!e.repeat` eklendi.

## 3. GÖREV C — Temizlenen Şüpheli Alias'lar ve `⚠️` Kayıtları
- `para_birimi.js:5,20,31,40,152` ve `MISSING.md`: `expect: 159` -> `158` eşitlendi (`DEMO_SORULAR.md` `⚠️` giderildi); `"pesosu"` -> `"Filipin pesosu"`, `"Agorot"`, `"Tayland'ın Para birimi"`, `"İran para birimi/parası"` kaldırıldı.
- `tr_il.js:31,52,82`: NUTS kodları (`TR421`, `TR310`, `TR511`) kaldırılıp `"İzmit"`, `"Kocaeli İli"`, `"İzmir İli"`, `"Ankara İli"` yazıldı.
- `baskent.js:19,42,45,140,167,179,201` ve `dunya_sehri.js:58,90,151,163,174,194,1048,1294,1696,1735,2851,3612`: Parantezli açıklama alias'ları (`"Sucre (anayasal)"` vb.), apostrof kesmesiyle tek/iki harfe düşenler (`"N'Camena"`, `"D'dorf"`, `"Ta'if"`, `"Ta'izz"`, `"No'kis"`) ve Vikiveri tanım sızıntıları (`"Senegal'de yerleşim birimi"`, `"Malta'nın başkenti"`) temizlendi.
- `ist_muze.js:14`, `isletim_sistemi.js:100,258,262,390`, `havayolu.js:305`, `video_oyunu.js:131,1147`, `corba.js:139`, `sebze.js:168`, `prog_dili.js:586`, `otomobil_markasi.js:383`, `q_demo.js:13,23,39,45,47`: Çakışan alias'lar (`"Microsoft Windows '96/'97"`, `"Sonic '06"`, `"FIFA '99"`, `"L'Aeropostale"`) ve `f&8` bayrağı temizlendi; `q_demo.js` `share.list` etiketleri (`Python`, `Samsung`, `Peugeot`, `Kereviz`, `Floransa`) ana satırlarla hizalandı.

## 4. `[DOĞRULANMALI]` Notlu Kayıtlar ve Kalan Riskler
- **`[DOĞRULANMALI]` Kayıtlar:** `ankara_ilce_01` (ilçe teşkilat yılları), `turk_universitesi_01` (kanun vs kök kurum yılları), `milli_park_tr_01` (DKMP ilan yılları), `nba_takimi_01` (BAA/franchise kuruluş yılları), `turk_muzik_grubu_01` (grup kuruluş yılları), `antik_uygarlik_01` (MÖ yaklaşık kuruluş yılları), `savas_antlasma_01` (Kadeş MÖ 1259 vb.), `yapay_zeka_01` (ilk genel sürüm yılları).
- **Kalan Riskler:** `para_birimi` kapalı havuzunda Vikiveri kaynaklı bazı eski/özel birimler (`Alman markı`, `Yugoslav dinarı`, `Vatikan lirası`, `Yatırım olarak gümüş`) `expect:158` ve `share.list` bütünlüğünü bozmamak için korundu `[DOĞRULANMALI]`. Toplam `data/` boyutu ~1828 KB olup 1843 KB tavanına yakındır.
