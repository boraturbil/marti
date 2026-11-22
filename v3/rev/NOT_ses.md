# NOT — ses (sound.js)
1. **index.html SES bloğuna ekle (agy/ana oturum, ben dokunmadım):** `<!-- SES:BASLA -->` ile `<!-- SES:BITIR -->` arasına `<script src="sound.js"></script>` (bus.js'ten sonra, game.js'ten önce — mevcut yerleşim uygun). `bus.js` yoksa sound.js 10 sn bekleyip bağlanır.
2. Tarayıcı autoplay: ses ilk tık/tuş/dokunuştan sonra başlar (menü müziği o an açılır).
3. `M` tuşu aç/kapa; yazı alanındayken (input/textarea) yok sayılır, aksi halde cevapta "m" yazılamazdı. Durum `localStorage['pusulla.v3.sound']` {on, vol}; `PUSULLA.sound.setVolume(0..1)` eklendi. UI isterse ses simgesi için `body[data-sound=on|off]` yazılır.
4. Olay isteği (opsiyonel): "seri artışı" için sözleşmede olay yok; sound.js art arda ≥2 tam/çok yakın cevaptan çıkarır. `timer:warn.left ≤ 3` → gerilim müziği.
5. Dosyalar HTMLAudio ile çalar (file:// uyumlu, fetch yok). Müzik `loop` ile döner; dikişte çok kısa boşluk olabilir.
6. Test: node ile sahte Audio/bus; olaylar doğru dosyaları çağırdı. Gerçek tarayıcıda dinlenmedi.
