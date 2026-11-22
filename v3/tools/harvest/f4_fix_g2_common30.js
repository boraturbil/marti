'use strict';

const fs = require('fs');
const path = require('path');
const matcher = require('../../matcher');
const engine = require('../../engine');

const COMMON_ANSWERS = {
  ist_ilce_01: [
    'Kadıköy', 'Beşiktaş', 'Üsküdar', 'Fatih', 'Şişli', 'Bakırköy', 'Beyoğlu', 'Sarıyer', 'Maltepe', 'Kartal',
    'Pendik', 'Ataşehir', 'Ümraniye', 'Esenyurt', 'Beylikdüzü', 'Avcılar', 'Küçükçekmece', 'Bahçelievler', 'Bağcılar', 'Zeytinburnu',
    'Eyüpsultan', 'Gaziosmanpaşa', 'Kağıthane', 'Beykoz', 'Tuzla', 'Büyükçekmece', 'Silivri', 'Adalar', 'Şile', 'Çatalca'
  ],
  tr_il_01: [
    'İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana', 'Trabzon', 'Konya', 'Gaziantep', 'Samsun',
    'Eskişehir', 'Mersin', 'Diyarbakır', 'Kayseri', 'Muğla', 'Kocaeli', 'Erzurum', 'Şanlıurfa', 'Hatay', 'Van',
    'Aydın', 'Denizli', 'Sakarya', 'Tekirdağ', 'Malatya', 'Balıkesir', 'Manisa', 'Çanakkale', 'Sivas', 'Edirne'
  ],
  ulke_01: [
    'Türkiye', 'Almanya', 'Fransa', 'İtalya', 'İspanya', 'İngiltere', 'Birleşik Krallık', 'Amerika', 'ABD', 'Rusya',
    'Japonya', 'Çin', 'Brezilya', 'Arjantin', 'Kanada', 'Avustralya', 'Yunanistan', 'Azerbaycan', 'Mısır', 'Hollanda',
    'İsviçre', 'İsveç', 'Norveç', 'Portekiz', 'Belçika', 'Avusturya', 'Polonya', 'Ukrayna', 'Güney Kore', 'Hindistan'
  ],
  baskent_01: [
    'Ankara', 'Paris', 'Londra', 'Berlin', 'Roma', 'Madrid', 'Tokyo', 'Moskova', 'Washington', 'Atina',
    'Pekin', 'Viyana', 'Amsterdam', 'Bakü', 'Kahire', 'Seul', 'Prag', 'Lizbon', 'Stokholm', 'Oslo',
    'Brüksel', 'Budapeşte', 'Varşova', 'Kopenhag', 'Bern', 'Ottawa', 'Canberra', 'Yeni Delhi', 'Tahran', 'Bağdat'
  ],
  dunya_sehri_01: [
    'İstanbul', 'Paris', 'Londra', 'New York', 'Tokyo', 'Roma', 'Ankara', 'İzmir', 'Berlin', 'Madrid',
    'Barselona', 'Amsterdam', 'Moskova', 'Dubai', 'Viyana', 'Prag', 'Atina', 'Kahire', 'Seul', 'Pekin',
    'Şanghay', 'Los Angeles', 'Şikago', 'Toronto', 'Sidney', 'Milano', 'Venedik', 'Münih', 'Bakü', 'Rio de Janeiro'
  ],
  corba_01: [
    'Mercimek', 'Mercimek çorbası', 'Ezogelin', 'Ezogelin çorbası', 'Domates', 'Domates çorbası', 'Tarhana', 'Tarhana çorbası', 'Yayla', 'Yayla çorbası',
    'İşkembe', 'İşkembe çorbası', 'Kelle paça', 'Kelle paça çorbası', 'Şehriye', 'Şehriye çorbası', 'Tavuk suyu', 'Tavuk suyu çorbası', 'Brokoli', 'Brokoli çorbası',
    'Mantar', 'Mantar çorbası', 'Soğan', 'Balkabağı', 'Ispanak', 'Havuç', 'Patates', 'Düğün çorbası', 'Beyran', 'Toyga'
  ],
  kahvaltilik_01: [
    'Peynir', 'Zeytin', 'Yumurta', 'Çay', 'Domates', 'Salatalık', 'Bal', 'Tereyağı', 'Ekmek', 'Simit',
    'Menemen', 'Beyaz peynir', 'Sucuk', 'Reçel', 'Kaşar', 'Kaymak', 'Omlet', 'Börek', 'Poğaça', 'Pastırma',
    'Tost', 'Gözleme', 'Açma', 'Mıhlama', 'Labne', 'Biber', 'Salam', 'Sosis', 'Tahin', 'Pekmez'
  ],
  tatli_01: [
    'Baklava', 'Künefe', 'Sütlaç', 'Tiramisu', 'Profiterol', 'Cheesecake', 'Trileçe', 'Güllaç', 'Tulumba', 'Aşure',
    'Kadayıf', 'Muhallebi', 'Browni', 'Sufle', 'Ekler', 'Dondurma', 'Waffle', 'Mozaik pasta', 'Kabak tatlısı', 'Fırın sütlaç',
    'Makaron', 'Puding', 'Kazandibi', 'Tavuk göğsü', 'Keşkül', 'Lokma', 'Revani', 'Şekerpare', 'İrmik helvası', 'Magnolia'
  ],
  meyve_01: [
    'Elma', 'Muz', 'Portakal', 'Çilek', 'Karpuz', 'Kiraz', 'Üzüm', 'Şeftali', 'Kavun', 'Armut',
    'Mandalina', 'Kayısı', 'Erik', 'İncir', 'Kivi', 'Ananas', 'Limon', 'Vişne', 'Ayva', 'Avokado',
    'Mango', 'Böğürtlen', 'Ahududu', 'Yaban mersini', 'Greyfurt', 'Hurma', 'Nar', 'Dut', 'Hindistan cevizi', 'Kızılcık'
  ],
  sebze_01: [
    'Domates', 'Patates', 'Salatalık', 'Biber', 'Soğan', 'Patlıcan', 'Havuç', 'Brokoli', 'Marul', 'Karnabahar',
    'Pırasa', 'Lahana', 'Sarımsak', 'Fasulye', 'Bezelye', 'Enginar', 'Turp', 'Pancar', 'Ispanak', 'Kabak',
    'Bamya', 'Kereviz', 'Roka', 'Maydanoz', 'Dereotu', 'Mısır', 'Nohut', 'Barbunya', 'Pazı', 'Şalgam'
  ],
  hayvan_01: [
    'Aslan', 'Kaplan', 'Köpek', 'Kedi', 'At', 'Fil', 'Zürafa', 'Ayı', 'Kurt', 'Tilki',
    'Tavşan', 'Kuş', 'Kartal', 'Penguen', 'Yunus', 'Balina', 'Köpekbalığı', 'Yılan', 'Timsah', 'Kaplumbağa',
    'Kurbağa', 'Arı', 'Kelebek', 'Örümcek', 'İnek', 'Koyun', 'Keçi', 'Tavuk', 'Maymun', 'Panda'
  ],
  meslek_01: [
    'Doktor', 'Öğretmen', 'Mühendis', 'Avukat', 'Polis', 'Mimar', 'Hemşire', 'Pilot', 'Aşçı', 'Muhasebeci',
    'Garson', 'Elektrikçi', 'Marangoz', 'Gazeteci', 'Oyuncu', 'Yazar', 'Şarkıcı', 'Berber', 'Terzi', 'Kasap',
    'Fırıncı', 'Futbolcu', 'İtfaiyeci', 'Psikolog', 'Diş hekimi', 'Eczacı', 'Veteriner', 'Hakim', 'Savcı', 'Asker'
  ],
  spor_dali_01: [
    'Futbol', 'Basketbol', 'Voleybol', 'Tenis', 'Yüzme', 'Boks', 'Güreş', 'Atletizm', 'Satranç', 'Masa tenisi',
    'Tekvando', 'Karate', 'Judo', 'Hentbol', 'Golf', 'Badminton', 'Bisiklet', 'Kayak', 'Jimnastik', 'Halter',
    'Okçuluk', 'Kick boks', 'Buz hokeyi', 'Eskrim', 'Yelken', 'Sörf', 'Sutopu', 'Kürek', 'Formula 1', 'Bilardo'
  ],
  turk_markasi_01: [
    'Turkcell', 'Arçelik', 'Ülker', 'Beko', 'Vestel', 'Türk Hava Yolları', 'Pegasus', 'Türk Telekom', 'BİM', 'Getir',
    'Mavi', 'LC Waikiki', 'Eti', 'Togg', 'Aselsan', 'Baykar', 'Migros', 'Şok', 'A101', 'Koton',
    'DeFacto', 'İş Bankası', 'Garanti', 'Ziraat Bankası', 'Akbank', 'Koç Holding', 'Sabancı', 'Şişecam', 'Paşabahçe', 'Trendyol'
  ],
  tarayici_01: [
    'Google Chrome', 'Chrome', 'Safari', 'Firefox', 'Mozilla Firefox', 'Microsoft Edge', 'Edge', 'Opera', 'Brave', 'Internet Explorer',
    'Yandex Browser', 'Tor Browser', 'Vivaldi', 'DuckDuckGo', 'DuckDuckGo Browser', 'Samsung Internet', 'Chromium', 'Arc', 'Netscape Navigator', 'Opera GX',
    'Opera Mini', 'Waterfox', 'Maxthon', 'UC Browser', 'SeaMonkey', 'Konqueror', 'Pale Moon', 'Midori', 'K-Meleon', 'GNOME Web'
  ],
  isletim_sistemi_01: [
    'Windows', 'Microsoft Windows', 'Windows 10', 'Windows 11', 'Windows 7', 'Windows XP', 'Windows 95', 'Windows 98', 'Linux', 'GNU/Linux',
    'macOS', 'Mac OS X', 'Android', 'iOS', 'Ubuntu', 'Debian', 'Fedora', 'ChromeOS', 'Unix', 'MS-DOS',
    'DOS', 'iPadOS', 'watchOS', 'Solaris', 'FreeBSD', 'Haiku', 'Pardus', 'Arch Linux', 'Linux Mint', 'Symbian'
  ],
  oyun_konsolu_01: [
    'PlayStation', 'PlayStation 2', 'PlayStation 3', 'PlayStation 4', 'PlayStation 5', 'PS5', 'PS4', 'Xbox', 'Xbox 360', 'Xbox One',
    'Xbox Series X', 'Nintendo Switch', 'Wii', 'Wii U', 'Nintendo DS', 'Nintendo 3DS', 'Game Boy', 'Game Boy Advance', 'PSP', 'PlayStation Vita',
    'Atari 2600', 'NES', 'SNES', 'Nintendo 64', 'GameCube', 'Sega Mega Drive', 'Sega Genesis', 'Dreamcast', 'Steam Deck', 'Sega Saturn'
  ],
  prog_dili_01: [
    'Python', 'JavaScript', 'Java', 'C', 'C++', 'C#', 'PHP', 'TypeScript', 'Go', 'Rust',
    'Swift', 'Kotlin', 'Ruby', 'SQL', 'R', 'MATLAB', 'Dart', 'Scala', 'Perl', 'Lua',
    'Haskell', 'Assembly', 'Fortran', 'COBOL', 'Delphi', 'Objective-C', 'Elixir', 'Erlang', 'Clojure', 'Visual Basic'
  ],
  sosyal_medya_01: [
    'Instagram', 'Facebook', 'X', 'Twitter', 'TikTok', 'YouTube', 'LinkedIn', 'Snapchat', 'Reddit', 'Pinterest',
    'WhatsApp', 'Telegram', 'Discord', 'Threads', 'Bluesky', 'Twitch', 'Spotify', 'Ekşi Sözlük', 'Tumblr', 'VK',
    'WeChat', 'Line', 'Medium', 'Quora', 'SoundCloud', 'Vine', 'Flickr', 'Clubhouse', 'Mastodon', 'Truth Social'
  ],
  video_oyunu_01: [
    'Minecraft', 'GTA V', 'Grand Theft Auto V', 'League of Legends', 'Valorant', 'Counter-Strike', 'CS:GO', 'Fortnite', 'PUBG', 'Tetris',
    'Roblox', 'FIFA', 'The Witcher 3', 'Red Dead Redemption 2', 'Super Mario Bros', 'Cyberpunk 2077', 'Brawl Stars', 'Clash of Clans', 'Dota 2', 'Half-Life',
    'Half-Life 2', 'God of War', 'The Last of Us', 'Skyrim', 'Elden Ring', 'Assassin\'s Creed', 'Portal', 'Pac-Man', 'Doom', 'GTA San Andreas'
  ],
  telefon_markasi_01: [
    'Apple', 'iPhone', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'Vivo', 'Realme', 'OnePlus', 'Nokia',
    'Motorola', 'Sony', 'LG', 'Honor', 'Google', 'HTC', 'BlackBerry', 'Asus', 'Lenovo', 'ZTE',
    'Alcatel', 'Tecno', 'Infinix', 'Nothing', 'General Mobile', 'Vestel', 'Casper', 'Reeder', 'Meizu', 'Sharp'
  ],
  otomobil_markasi_01: [
    'BMW', 'Mercedes', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Renault', 'Fiat', 'Toyota', 'Ford', 'Opel',
    'Togg', 'Hyundai', 'Honda', 'Ferrari', 'Porsche', 'Dacia', 'Kia', 'Volvo', 'Skoda', 'Nissan',
    'Peugeot', 'Citroen', 'Seat', 'Chery', 'BYD', 'Tesla', 'Lamborghini', 'Mazda', 'Chevrolet', 'Jeep'
  ],
  havayolu_01: [
    'Türk Hava Yolları', 'THY', 'Pegasus', 'AnadoluJet', 'AJet', 'SunExpress', 'Lufthansa', 'Emirates', 'Qatar Airways', 'British Airways',
    'Air France', 'Ryanair', 'KLM', 'American Airlines', 'Delta', 'United Airlines', 'easyJet', 'Wizz Air', 'Etihad', 'Singapore Airlines',
    'Aeroflot', 'Swiss', 'Austrian Airlines', 'Iberia', 'Qantas', 'Air Canada', 'Japan Airlines', 'Korean Air', 'Cathay Pacific', 'Alitalia'
  ],
  turk_filmi_01: [
    'Hababam Sınıfı', 'G.O.R.A.', 'Babam ve Oğlum', 'Eşkıya', 'Kış Uykusu', 'Bir Zamanlar Anadolu\'da', 'Recep İvedik', 'Ayla', 'Selvi Boylum Al Yazmalım', '7. Koğuştaki Mucize',
    'Tosun Paşa', 'Süt Kardeşler', 'Şabanoğlu Şaban', 'Neşeli Günler', 'Bizim Aile', 'Fetih 1453', 'Organize İşler', 'A.R.O.G', 'Issız Adam', 'Yol',
    'Uçurtmayı Vurmasınlar', 'Susuz Yaz', 'Ahlat Ağacı', 'Kuru Otlar Üstüne', 'Dünyayı Kurtaran Adam', 'Muhsin Bey', 'Vizontele', 'Kabadayı', 'Müslüm', 'Bergen'
  ],
  film_01: [
    'Titanik', 'Titanic', 'Esaretin Bedeli', 'Baba', 'The Godfather', 'Matrix', 'Başlangıç', 'Inception', 'Yıldızlararası', 'Interstellar',
    'Kara Şövalye', 'The Dark Knight', 'Dövüş Kulübü', 'Fight Club', 'Gladyatör', 'Yüzüklerin Efendisi', 'Harry Potter', 'Avatar', 'Forrest Gump', 'Oppenheimer',
    'Ucuz Roman', 'Pulp Fiction', 'Geleceğe Dönüş', 'Yeşil Yol', 'Joker', 'Parazit', 'Schindler\'in Listesi', 'Avengers: Endgame', 'Kuzuların Sessizliği', 'Terminatör'
  ],
  turk_dizisi_01: [
    'Kurtlar Vadisi', 'Aşk-ı Memnu', 'Ezel', 'Muhteşem Yüzyıl', 'Arka Sokaklar', 'Yaprak Dökümü', 'Yalı Çapkını', 'Kızılcık Şerbeti', 'Diriliş Ertuğrul', 'Çukur',
    'İçerde', 'Behzat Ç.', 'Leyla ile Mecnun', 'Avrupa Yakası', 'Süper Baba', 'İkinci Bahar', 'Ekmek Teknesi', 'Deli Yürek', 'Kuzey Güney', 'Fatmagül\'ün Suçu Ne?',
    'Medcezir', 'Kiralık Aşk', 'Sen Çal Kapımı', 'Kara Sevda', 'Yargı', 'Gönül Dağı', 'Poyraz Karayel', 'Sadakatsiz', 'Mucize Doktor', 'Öyle Bir Geçer Zaman ki'
  ],
  sarki_01: [
    'Bad Romance', 'Lose Yourself', 'Uptown Funk', 'Happy', 'Chandelier', 'Summertime Sadness', 'Bohemian Rhapsody', 'Shape of You', 'Despacito', 'Blinding Lights',
    'Billie Jean', 'Thriller', 'Smells Like Teen Spirit', 'Imagine', 'Hotel California', 'Yesterday', 'Rolling in the Deep', 'Someone Like You', 'Believer', 'Counting Stars',
    'Clocks', 'Viva La Vida', 'Dudu', 'Şımarık', 'Kuzu Kuzu', 'Gülümse', 'Firuze', 'Sarı Çizmeli Mehmet Ağa', 'Dağlar Dağlar', 'Gülpembe'
  ],
  super_lig_01: [
    'Galatasaray', 'Fenerbahçe', 'Beşiktaş', 'Trabzonspor', 'Başakşehir', 'Göztepe', 'Samsunspor', 'Konyaspor', 'Antalyaspor', 'Kayserispor',
    'Gençlerbirliği', 'Kocaelispor', 'Rizespor', 'Gaziantep FK', 'Kasımpaşa', 'Alanyaspor', 'Eyüpspor', 'Fatih Karagümrük'
  ],
  para_birimi_01: [
    'Türk lirası', 'Dolar', 'Amerikan doları', 'Euro', 'Sterlin', 'İngiliz sterlini', 'Japon yeni', 'İsviçre frangı', 'Rus rublesi', 'Azerbaycan manatı',
    'Kanada doları', 'Avustralya doları', 'Yuan', 'Suudi Arabistan riyali', 'Güney Kore wonu', 'Hindistan rupisi', 'Brezilya reali', 'İsveç kronu', 'Norveç kronu', 'Danimarka kronu',
    'Kuveyt dinarı', 'BAE dirhemi', 'Meksika pesosu', 'Arjantin pesosu', 'Zloti', 'Grivna', 'Bulgar levi', 'Rumen leyi', 'İran riyali', 'Mısır lirası'
  ],
  pixar_01: [
    'Oyuncak Hikayesi', 'Toy Story', 'Oyuncak Hikayesi 2', 'Oyuncak Hikayesi 3', 'Oyuncak Hikayesi 4', 'Kayıp Balık Nemo', 'Finding Nemo', 'Kayıp Balık Dori', 'Sevimli Canavarlar', 'İnanılmaz Aile',
    'Arabalar', 'Cars', 'Ratatuy', 'WALL-E', 'Yukarı Bak', 'Up', 'Cesur', 'Ters Yüz', 'Inside Out', 'Ters Yüz 2',
    'Coco', 'Soul', 'Luca', 'Kırmızı', 'Elio', 'İyi Bir Dinozor', 'Bir Böceğin Yaşamı', 'Onward'
  ],
  element_01: [
    'Hidrojen', 'Helyum', 'Lityum', 'Karbon', 'Azot', 'Oksijen', 'Flor', 'Neon', 'Sodyum', 'Magnezyum',
    'Alüminyum', 'Silisyum', 'Fosfor', 'Kükürt', 'Klor', 'Argon', 'Potasyum', 'Kalsiyum', 'Demir', 'Bakır',
    'Çinko', 'Gümüş', 'Kalay', 'İyot', 'Altın', 'Cıva', 'Kurşun', 'Uranyum', 'Platin', 'Titanyum'
  ],
  gezegen_01: [
    'Merkür', 'Venüs', 'Dünya', 'Mars', 'Jüpiter', 'Satürn', 'Uranüs', 'Neptün'
  ],
  osmanli_padisahi_01: [
    'Osman Gazi', 'Orhan Gazi', 'I. Murad', 'Yıldırım Bayezid', 'Çelebi Mehmed', 'II. Murad', 'Fatih Sultan Mehmet', 'II. Bayezid', 'Yavuz Sultan Selim', 'Kanuni Sultan Süleyman',
    'II. Selim', 'III. Murad', 'III. Mehmed', 'I. Ahmed', 'I. Mustafa', 'Genç Osman', 'IV. Murad', 'İbrahim', 'IV. Mehmed', 'II. Süleyman',
    'II. Ahmed', 'II. Mustafa', 'III. Ahmed', 'I. Mahmud', 'III. Osman', 'III. Mustafa', 'I. Abdülhamid', 'III. Selim', 'II. Mahmud', 'Abdülmecid'
  ],
  cumhurbaskani_01: [
    'Mustafa Kemal Atatürk', 'Atatürk', 'İsmet İnönü', 'Celal Bayar', 'Cemal Gürsel', 'Cevdet Sunay', 'Fahri Korutürk', 'Kenan Evren', 'Turgut Özal', 'Süleyman Demirel',
    'Ahmet Necdet Sezer', 'Abdullah Gül', 'Recep Tayyip Erdoğan'
  ],
  bm_genel_sekreter_01: [
    'Trygve Lie', 'Dag Hammarskjöld', 'U Thant', 'Kurt Waldheim', 'Javier Pérez de Cuéllar', 'Butros Butros-Gali', 'Kofi Annan', 'Ban Ki-mun', 'António Guterres'
  ],
  dk_sampiyon_01: [
    'Brezilya', 'Almanya', 'İtalya', 'Arjantin', 'Fransa', 'Uruguay', 'İngiltere', 'İspanya'
  ],
  olimpiyat_sehri_01: [
    'Atina', 'Paris', 'Londra', 'St. Louis', 'Stockholm', 'Anvers', 'Amsterdam', 'Los Angeles', 'Berlin', 'Helsinki',
    'Melbourne', 'Roma', 'Tokyo', 'Meksiko', 'Münih', 'Montreal', 'Moskova', 'Seul', 'Barselona', 'Atlanta',
    'Sidney', 'Pekin', 'Rio de Janeiro'
  ],
  uzay_sondasi_01: [
    'Voyager 1', 'Voyager 2', 'Pioneer 10', 'Pioneer 11', 'Cassini', 'New Horizons', 'Juno', 'Galileo', 'Viking 1', 'Viking 2',
    'Curiosity', 'Perseverance', 'Opportunity', 'Spirit', 'Rosetta', 'Hayabusa', 'Hayabusa2', 'Parker Solar Probe', 'James Webb', 'Hubble',
    'Mariner 2', 'Mariner 4', 'Mariner 10', 'Venera 7', 'Luna 1', 'Luna 2', 'Luna 9', 'Chandrayaan-3', 'Chang\'e 4', 'BepiColombo'
  ],
  gunes_uydu_01: [
    'Ay', 'Phobos', 'Deimos', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Titan', 'Enceladus', 'Mimas',
    'Tethys', 'Dione', 'Rhea', 'Iapetus', 'Hyperion', 'Titania', 'Oberon', 'Umbriel', 'Ariel', 'Miranda',
    'Triton', 'Proteus', 'Nereid', 'Charon', 'Amalthea', 'Phoebe', 'Larissa', 'Despina', 'Galatea', 'Puck'
  ],
  icat_01: [
    'Tekerlek', 'Matbaa', 'Telefon', 'Ampul', 'İnternet', 'Bilgisayar', 'Uçak', 'Buhar makinesi', 'Televizyon', 'Radyo',
    'Pusula', 'Barut', 'Kağıt', 'Fotoğraf makinesi', 'Telgraf', 'Otomobil', 'Penisilin', 'Röntgen', 'Transistör', 'Mikroskop',
    'Teleskop', 'Buzdolabı', 'Çamaşır makinesi', 'Saat', 'Lazer', 'Pil', 'Dinamit', 'Aşı', 'Dikiş makinesi', 'Klima'
  ],
  sinan_yapisi_01: [
    'Süleymaniye Camii', 'Selimiye Camii', 'Şehzade Camii', 'Mihrimah Sultan Camii', 'Rüstem Paşa Camii', 'Sokollu Mehmed Paşa Camii', 'Kılıç Ali Paşa Camii', 'Atik Valide Camii', 'Haseki Sultan Külliyesi', 'Zal Mahmud Paşa Camii',
    'Piyale Paşa Camii', 'Azapkapı Sokollu Camii', 'Büyükçekmece Köprüsü', 'Mağlova Kemeri', 'Drina Köprüsü', 'Mehmed Paşa Sokoloviç Köprüsü', 'Hüsrev Paşa Camii', 'Lala Mustafa Paşa Camii', 'Muradiye Camii', 'Şemsi Paşa Camii',
    'Molla Çelebi Camii', 'Sinan Paşa Camii', 'Nişancı Mehmed Paşa Camii', 'Yavuz Selim Medresesi', 'Kanuni Türbesi', 'Hürrem Sultan Hamamı', 'Çemberlitaş Hamamı', 'Kırkçeşme', 'Kurşunlu Han', 'Tekirdağ Rüstem Paşa Camii'
  ],
  ist_muze_01: [
    'Topkapı Sarayı', 'Ayasofya', 'İstanbul Arkeoloji Müzeleri', 'Dolmabahçe Sarayı', 'Yerebatan Sarnıcı', 'Kariye', 'Pera Müzesi', 'İstanbul Modern', 'Sakıp Sabancı Müzesi', 'Rahmi M. Koç Müzesi',
    'Türk ve İslam Eserleri Müzesi', 'Galata Kulesi', 'Rumeli Hisarı', 'Miniatürk', 'Panorama 1453', 'Masumiyet Müzesi', 'Beylerbeyi Sarayı', 'Yıldız Sarayı', 'Çinili Köşk', 'Askeri Müze',
    'Deniz Müzesi', 'Havacılık Müzesi', 'Oyuncak Müzesi', 'İstanbul Oyuncak Müzesi', 'Galata Mevlevihanesi', 'Aya İrini', 'Büyük Saray Mozaikleri Müzesi', 'Fethiye Müzesi', 'İslam Bilim ve Teknoloji Tarihi Müzesi', 'Sadberk Hanım Müzesi'
  ]
};

function loadQuestions() {
  globalThis.PUSULLA_QUESTIONS = [];
  require('../../data/q_demo.js');
  return globalThis.PUSULLA_QUESTIONS;
}

function loadPools() {
  globalThis.PUSULLA_POOLS = {};
  const poolDir = path.resolve(__dirname, '../../data/pool');
  for (const f of fs.readdirSync(poolDir)) {
    if (f.endsWith('.js')) require(path.join(poolDir, f));
  }
  return globalThis.PUSULLA_POOLS;
}

function main() {
  const qs = loadQuestions();
  const pools = loadPools();
  let totalAll = 0;
  let totalValid = 0;
  let totalConfirm = 0;
  let totalMissing = 0;

  for (const q of qs) {
    const list = COMMON_ANSWERS[q.id];
    if (!list) {
      console.log('MISSING LIST:', q.id);
      continue;
    }
    const pool = pools[q.pool];
    const filteredPool = q.filter ? Object.assign({}, pool, { rows: engine.filterPool(pool, q), cols: null }) : pool;
    const idx = matcher.createIndex(filteredPool, q);
    let valid = 0, confirm = 0;
    const fails = [];
    for (const ans of list) {
      const res = matcher.matchAnswer(ans, idx);
      if (res.type === 'valid') valid++;
      else if (res.type === 'confirm') { confirm++; fails.push(`${ans} -> CONFIRM(${res.suggestion})`); }
      else fails.push(`${ans} -> ${res.status}`);
    }
    totalAll += list.length;
    totalValid += valid;
    totalConfirm += confirm;
    totalMissing += (list.length - valid - confirm);
    const pct = ((valid + confirm) / list.length * 100).toFixed(1);
    const target = q.closed ? 100 : 90;
    const status = (valid + confirm) / list.length * 100 >= target ? 'OK' : 'FAIL';
    if (fails.length > 0 || status === 'FAIL') {
      console.log(`[${status}] ${q.id} (${q.closed ? 'K' : 'A'}): ${valid}/${list.length} valid, ${confirm} confirm (${pct}%)`);
      if (fails.length > 0) console.log('   ', fails.join(' | '));
    }
  }
  console.log(`\nTOTAL: ${totalValid}/${totalAll} valid, ${totalConfirm} confirm, ${totalMissing} missing (${((totalValid + totalConfirm) / totalAll * 100).toFixed(1)}%)`);
}

main();
