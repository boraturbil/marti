# NOT_C_F4 — Belirsizlikler ve Kararlar

## 1. `universite` (Kapalı Küme Kesinleştirilemedi)
- `universite kapali kume kesinlestirilemedi, yedek: ISTANBUL KOPRUSU (T, k)`
- `raw_universite.json` içinde 232 satır bulunuyor; KKTC, kapatılmış veya mükerrer kayıtların YÖK resmi (~208) sayısıyla birebir eşleştirilmesi ağ/resmi liste doğrulaması gerektirdiğinden `expect` uydurulmadı ve `data/manual/universite.js` oluşturulmadı.

## 2. `50_merge.js` ve Halk Havuzları (`kahvaltilik`, `icat`)
- `tools/harvest/out/` içinde `raw_kahvaltilik.json` ve `raw_icat.json` bulunmadığı için `50_merge.js` (yalnız `raw_*.json` dosyalarını taradığından) `data/manual/kahvaltilik.js` (65 öğe) ve `data/manual/icat.js` (120 öğe) dosyalarını doğrudan birleştirmez. Görev gereği `50_merge.js` ve `raw_*` dosyalarına dokunulmadı.

## 3. Yıl Alt Sınırı (`-5000`) ve `approx` Kararları
- `tools/harvest/lib/years.js` içindeki `isValidYear` fonksiyonu `-5000` ile `2026` arasındaki yılları kabul etmektedir. Bu nedenle:
  - **`element`**: Tarih öncesi/antik bilinen elementlerden `bakır`, `altın`, `kurşun` için `-5000` (`approx: true`), `kalay` için `-3500` (`approx: true`), `cıva` için `-1500` (`approx: true`), `antimon` için `1450` (`approx: true`), `Çinko` için `1746` (`approx: true`), `Bizmut` için `1753` (`approx: true`) yazıldı.
  - **`icat`**: `MOD_ESKI_ICAT_TASARIM.md` sözlüğündeki 10.000+ yıllık erken icatlar (taş bıçak, ateş yakma, ot yatak, kemik iğne, çömlek, ekmek, sepet, ip, kayık, kil fırın, obsidyen ayna) `-5000` (`approx: true`) ile kaydedildi.

## 4. Diğer Havuz Kararları
- **`ulke` (195)**: `Kosova` ham veride zaten hariç tutulmuştu; 196. satır olarak kalan `Tayvan (Q865)` çıkarılarak BM 193 + 2 gözlemci (`Vatikan`, `Filistin`) = 195 sayısına ulaşıldı.
- **`baskent` (195)**: Çok başkentli ülkelerde tek ana başkent seçildi (`La Paz` tutuldu / `Sucre` çıkarıldı; `Pretoria` tutuldu / `Kap Şehri`, `Bloemfontein` çıkarıldı; `Amsterdam` / `Lahey`; `Sri Jayawardenapura-Kotte` / `Kolombo`; `Porto-Novo` / `Cotonou`; `Kuala Lumpur` / `Putrajaya`; `Mbabane` / `Lobamba`; `Sana'a` / `Aden`; `Cakarta` / `Nusantara`; `Kudüs` / `Tel Aviv`; `Ramallah` / `Doğu Kudüs`). `Taipei` çıkarıldı ve `raw_baskent.json`'da eksik olan Antigua ve Barbuda başkenti `St. John's (Q36262)` eklendi.
- **`pixar` (30)**: Görevdeki 30 filmlik liste (`Oyuncak Hikâyesi` → `Hoplayanlar`) esas alındı; `Oyuncak Hikâyesi 5 (2026)` liste dışı olduğu için çıkarıldı, eksik olan `Cesur (2012)` eklendi.
- **`para_birimi` (158)**: Vikiveri `P498` (ISO 4217) olup `P576` (son bulma) olmayanlar filtrelendiğinde ham 251 satırdan 159 satır kaldı; `50_merge.js` tekilleştirmesiyle 158 tekil satır elde edildi.
- **Doğrulama Notları**: Elle girilen tüm öğelerde `genel bilgi - Vikipedi <madde> ile dogrulanacak` notu eklendi.
