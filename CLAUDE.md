# Martı — ortak proje kuralları
- Türkçe konuş, kısa cevap ver.
- Oturuma başlarken ÖNCE `git pull`, sonra `DEVIR_NOTU.md` oku.
- Oturum sonunda: `node v2/tools/check.js` (868/868 olmalı), `DEVIR_NOTU.md` güncelle, `git add` + `git commit` + `git push`.
- Ana sürüm `v2/`. Kökteki v1 dosyalarına dokunma.
- Büyük değişiklikte kendi dalında çalış (`git checkout -b isim/konu`), main'e PR/merge ile birleştir.
- Aynı anda aynı dosyayı düzenleme; kim hangi dosyada çalışıyor `DEVIR_NOTU.md` "Kim ne yapıyor" bölümüne yazılır.
- Önemli kararları `notlar/` klasörüne tarihli .md olarak yaz (sohbet bağlamı repo üzerinden taşınır).
