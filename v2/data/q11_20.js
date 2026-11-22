(function (root) {
  'use strict';
  root.QUESTIONS = root.QUESTIONS || [];
  root.QUESTIONS.push(
    {
      id: 'q11',
      cat: 'spor',
      text: 'Bir Türk futbol takımı söyle',
      answers: [
        { label: 'Galatasaray', share: 29.8, aliases: ['cimbom', 'aslan', 'sarı kırmızılılar', 'galata', 'gs spor', 'galatasaray spor', 'cimbombom', 'aslanlar', 'sari kirmizililar', 'sarı kırmızı', 'sari kirmizi', 'galatasaray sk', 'ali sami yen', 'rams park', 'ultraslan', 'avrupa fatihi', 'galatasarayımız', 'cim bom'] },
        { label: 'Fenerbahçe', share: 27.6, aliases: ['fenerbahce', 'fener', 'kanarya', 'sarı kanarya', 'sarı lacivert', 'kadıköy boğası', 'sari kanarya', 'sari lacivert', 'kadikoy bogasi', 'fenerbahçe sk', 'fenerbahce sk', 'şükrü saracoğlu', 'sukru saracoglu', 'sarı lacivertliler', 'sari lacivertliler', 'fenerim', 'fenerbahçe spor', 'fb spor'] },
        { label: 'Beşiktaş', share: 19.6, aliases: ['besiktas', 'kara kartal', 'kartal', 'siyah beyaz', 'beşiktaş jk', 'çarşı takımı', 'besiktas jk', 'carsi takimi', 'kara kartallar', 'siyah beyazlılar', 'siyah beyazlilar', 'bjk spor', 'inönü stadı', 'tüpraş stadı', 'vodafone park', 'beşiktaşım', 'besiktasim', 'beşiktaş jimnastik kulübü'] },
        { label: 'Trabzonspor', share: 9.0, aliases: ['trabzon', 'bordo mavi', 'fırtına', 'karadeniz fırtınası', 'hamsi spor', 'trabzon spor', 'firtina', 'karadeniz firtinasi', 'bordo mavililer', 'trabzonspor kulübü', 'avni aker', 'papara park', 'şenol güneş stadı', 'ts spor', 'trabzon takımı', 'trabzonspor fk', 'bordo mavi fırtına', 'karadeniz kaplanı'] },
        { label: 'Başakşehir', share: 3.0, aliases: ['basaksehir', 'istanbul başakşehir', 'boz baykuşlar', 'turuncu lacivert', 'medipol başakşehir', 'başakşehir fk', 'istanbul basaksehir', 'boz baykuslar', 'medipol basaksehir', 'basaksehir fk', 'rams başakşehir', 'rams basaksehir', 'fatih terim stadı', 'başakşehir spor', 'basaksehir spor', 'ibfk', 'baykuşlar', 'başakşehir takımı'] },
        { label: 'Bursaspor', share: 2.4, aliases: ['bursa', 'yeşil timsah', 'timsahlar', 'yeşil beyaz', 'bursa spor', 'teksas', 'yesil timsah', 'yesil beyaz', 'timsah', 'bursaspor kulübü', 'timsah arena', 'yeşil beyazlılar', 'yesil beyazlilar', 'bursa takımı', 'bursa timsahlar', 'yeşil inci', 'bursaspor sk', 'anadolu şampiyonu bursa'] },
        { label: 'Göztepe', share: 1.6, aliases: ['goztepe', 'gözgöz', 'sarı kırmızı izmir', 'gürsel aksel', 'izmir göztepe', 'göztepe sk', 'gozgoz', 'sari kirmizi izmir', 'gursel aksel', 'izmir goztepe', 'goztepe sk', 'göztepe spor', 'goztepe spor', 'göz göz', 'goz goz', 'tam 35 göztepe', 'efsane göztepe', 'göztepeliler'] },
        { label: 'Sivasspor', share: 1.3, aliases: ['sivas', 'yiğidolar', 'kırmızı beyaz sivas', 'sivas spor', 'yiğido', 'anadolu yıldızı', 'yigidolar', 'kirmizi beyaz sivas', 'yigido', 'anadolu yildizi', 'ems yap sivasspor', 'demir grup sivasspor', '4 eylül stadı', 'sivasspor fk', 'sivasspor kulübü', 'kırmızı beyaz yiğido', 'sivas takımı', 'yiğido sivas'] },
        { label: 'Adana Demirspor', share: 1.1, aliases: ['adana demir', 'mavi şimşekler', 'demirspor', 'adana takımı', 'şimşekler', 'adana spor', 'mavi simsekler', 'adana takimi', 'simsekler', 'ads spor', 'adana demir spor', 'mavi lacivert adana', 'çukurova mavi şimşek', 'adana demirspor fk', 'demir spor', 'mavi şimşek', 'mavi simsek', 'adana ekibi'] },
        { label: 'Konyaspor', share: 0.9, aliases: ['konya', 'anadolu kartalı', 'yeşil beyaz konya', 'konya spor', 'tümosan konya', 'konya takımı', 'anadolu kartali', 'yesil beyaz konya', 'tumosan konya', 'konya takimi', 'tümosan konyaspor', 'tumosan konyaspor', 'ittifak holding konyaspor', 'nalçacılılar', 'nalcacililar', 'konyaspor fk', 'konyaspor kulübü', 'yeşil beyaz kartal'] },
        { label: 'Altay', share: 0.7, aliases: ['büyük altay', 'izmir altay', 'siyah beyaz izmir', 'altay sk', 'altay spor', 'alsancak altay', 'buyuk altay', 'altay izmir', 'altay kulübü', 'altay futbol', 'alsancak stadı altay', 'izmir büyük altay', 'altay takımı', 'altay fk', 'efsane altay', 'siyah beyaz altay', 'vahap özaltay', 'altaylılar'] },
        { label: 'Eskişehirspor', share: 0.5, aliases: ['eskisehirspor', 'es es', 'kırmızı şimşekler', 'eskişehir', 'eskişehir spor', 'anadolu efsanesi', 'kirmizi simsekler', 'eskisehir', 'eskisehir spor', 'eses', 'es-es', 'bando eses', 'kırmızı siyah eskişehir', 'kirmizi siyah eskisehir', 'eskişehir takımı', 'eskişehirspor fk', 'kırmızı şimşek', 'eskişehirspor kulübü'] },
        { label: 'Kasımpaşa', share: 0.3, aliases: ['kasimpasa', 'paşa', 'lacivert beyaz', 'kasımpaşa sk', 'recep tayyip erdoğan stadı', 'beyoğlu takımı', 'pasa', 'kasimpasa sk', 'recep tayyip erdogan stadi', 'beyoglu takimi', 'kasımpaşa spor', 'kasimpasa spor', 'apaçiler kasımpaşa', 'kasımpaşa fk', 'kasimpasa fk', 'semt takımı kasımpaşa', 'lacivert beyaz paşa', 'kasımpaşalılar'] },
        { label: 'Rizespor', share: 0.1, aliases: ['rize', 'çaykur rizespor', 'atmaca', 'yeşil mavi', 'rize spor', 'karadeniz atmacası', 'caykur rizespor', 'yesil mavi', 'karadeniz atmacasi', 'atmacalar', 'çaykur rize', 'caykur rize', 'rizespor fk', 'rizespor kulübü', 'yeşil mavililer', 'yesil mavililer', 'rize takımı', 'çaykur didi stadı'] },
        { label: 'Samsunspor', share: 2.1, aliases: ['samsun', 'karadeniz şimşeği', 'karadeniz samsun', 'samsun spor', 'yılport samsun', 'atatürk armalı', 'karadeniz simsegi', 'yilport samsun', 'ataturk armali', 'kırmızı şimşek samsun', 'kırmızı beyaz samsun', 'kirmizi beyaz samsun', 'yılport samsunspor', 'yilport samsunspor', '19 mayıs samsunspor', 'samsun takımı', 'samsunspor fk', 'atatrük armalı takım'] }
      ].sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['real madrid', 'barcelona', 'manchester united'], reason: 'Bu yabancı (Avrupa) bir futbol kulübü.' },
        { aliases: ['bayern münih', 'liverpool', 'juventus'], reason: 'Bu yabancı bir takım, Türk liginden değil.' },
        { aliases: ['anadolu efes', 'darüşşafaka'], reason: 'Bu basketbol kulübü, futbol takımı değil.' },
        { aliases: ['eczacıbaşı', 'vakıfbank'], reason: 'Bu voleybol kulübü, futbol takımı değil.' },
        { aliases: ['milli takım', 'a milli'], reason: 'Kulüp takımı değil, ulusal takım.' },
        { aliases: ['halı saha', 'mahalle takımı'], reason: 'Resmi bir Türk futbol kulübü adı yazmalısın.' }
      ],
      tests: [
        { in: 'Galatasaray', expect: 'Galatasaray' },
        { in: 'fenerbahce', expect: 'Fenerbahçe' },
        { in: 'kara kartal', expect: 'Beşiktaş' },
        { in: 'real madrid', expect: 'invalid' }
      ]
    },
    {
      id: 'q12',
      cat: 'tatil',
      text: 'Tatile giderken mutlaka alınan bir şey söyle',
      answers: [
        { label: 'Mayo', share: 20.0, aliases: ['bikini', 'deniz şortu', 'mayo bikini', 'şort', 'yüzme kıyafeti', 'haşema', 'deniz sortu', 'sort', 'yuzme kiyafeti', 'hasema', 'mayolar', 'bikiniler', 'yüzücü mayosu', 'yuzucu mayosu', 'tesettür mayo', 'tesettur mayo', 'deniz mayosu', 'plaj şortu'] },
        { label: 'Güneş kremi', share: 16.0, aliases: ['gunes kremi', 'koruyucu krem', 'bronzlaştırıcı', 'güneş yağı', 'spf krem', 'krem', 'bronzlastirici', 'gunes yagi', 'güneş losyonu', 'gunes losyonu', '50 faktör krem', 'güneş koruyucu', 'gunes koruyucu', 'kakao yağı', 'kakao yagi', 'havuç yağı', 'güneş sütü', 'bronzlaştırıcı yağ'] },
        { label: 'Şarj aleti', share: 12.0, aliases: ['sarj aleti', 'powerbank', 'telefon şarjı', 'şarj kablosu', 'taşınabilir şarj', 'adaptör', 'telefon sarji', 'sarj kablosu', 'tasinabilir sarj', 'adaptor', 'şarj cihazı', 'sarj cihazi', 'yedek batarya', 'hızlı şarj aleti', 'type c kablo', 'iphone şarj aleti', 'priz çoğaltıcı', 'taşınabilir batarya'] },
        { label: 'Güneş gözlüğü', share: 9.0, aliases: ['gunes gozlugu', 'gözlük', 'polarize gözlük', 'koyu gözlük', 'gözlüğüm', 'yazlık gözlük', 'gozluk', 'polarize gozluk', 'koyu gozluk', 'gozlugum', 'yazlik gozluk', 'güneş gözlükleri', 'gunes gozlukleri', 'uv korumalı gözlük', 'plaj gözlüğü', 'numaralı güneş gözlüğü', 'siyah gözlük', 'gözlük kabı'] },
        { label: 'Kitap', share: 6.4, aliases: ['roman', 'okuma kitabı', 'dergi', 'sahil kitabı', 'e-kitap', 'bulmaca kitabı', 'okuma kitabi', 'sahil kitabi', 'e kitap', 'bulmaca kitabi', 'tatil kitabı', 'tatil kitabi', 'hikaye kitabı', 'plajda okunacak kitap', 'kindle', 'sudoku kitabı', 'çengel bulmaca', 'kitaplar'] },
        { label: 'Terlik', share: 5.8, aliases: ['parmak arası terlik', 'plaj terliği', 'deniz terliği', 'sandalet', 'crocs', 'yazlık terlik', 'parmak arasi terlik', 'plaj terligi', 'deniz terligi', 'yazlik terlik', 'deniz ayakkabısı', 'deniz ayakkabisi', 'havuz terliği', 'havuz terligi', 'şeffaf deniz terliği', 'plaj sandaleti', 'banyo terliği', 'terlikler'] },
        { label: 'Havlu', share: 5.2, aliases: ['plaj havlusu', 'banyo havlusu', 'deniz havlusu', 'peştamal', 'bornoz', 'kurulanma havlusu', 'pestamal', 'peştemal', 'pestemal', 'büyük havlu', 'buyuk havlu', 'şezlong havlusu', 'sezlong havlusu', 'yüz havlusu', 'saç havlusu', 'mikrofiber havlu', 'yedek havlu', 'havlular'] },
        { label: 'Kimlik / pasaport', share: 4.6, aliases: ['kimlik', 'pasaport', 'nüfus cüzdanı', 'seyahat bileti', 'rezervasyon belgesi', 'ehliyet', 'nufus cuzdani', 'uçak bileti', 'ucak bileti', 'otobüs bileti', 'otobus bileti', 'sürücü belgesi', 'surucu belgesi', 'kimlik kartı', 'kimlik karti', 'vize evrakları', 'otel rezervasyonu', 'seyahat belgeleri'] },
        { label: 'Diş fırçası', share: 4.0, aliases: ['dis fircasi', 'diş macunu', 'dis macunu', 'diş ipi', 'diş fırçam', 'dis fircam', 'elektrikli diş fırçası', 'seyahat diş fırçası', 'fırça ve macun', 'ağız bakım seti', 'yumuşak diş fırçası', 'diş macunu ve fırça', 'diş fırçası kabı', 'yedek diş fırçası', 'diş fırçası', 'dis ipi', 'ağız bakım suyu', 'agiz bakim suyu', 'elektrikli dis fircasi', 'diş fırçası ve macun', 'fırça macun', 'diş temizliği'] },
        { label: 'Kıyafet', share: 3.4, aliases: ['tişört', 'elbise', 'şort tişört', 'yedek kıyafet', 'iç çamaşırı', 'akşamlık kıyafet', 'tisort', 'sort tisort', 'yedek kiyafet', 'ic camasiri', 'aksamlik kiyafet', 'yazlık elbise', 'yazlik elbise', 'gömlek', 'gomlek', 'keten gömlek', 'pijama', 'çamaşır'] },
        { label: 'Kulaklık', share: 2.8, aliases: ['kulaklik', 'bluetooth kulaklık', 'airpods', 'müzik kulaklığı', 'kulak içi', 'kablolu kulaklık', 'bluetooth kulaklik', 'muzik kulakligi', 'kulak ici', 'kablolu kulaklik', 'kablosuz kulaklık', 'kablosuz kulaklik', 'kulak üstü kulaklık', 'kulak ustu kulaklik', 'telefon kulaklığı', 'gürültü önleyici kulaklık', 'kulaklığım', 'hoparlör'] },
        { label: 'Para / kart', share: 2.4, aliases: ['cüzdan', 'nakit para', 'kredi kartı', 'banka kartı', 'döviz', 'harçlık', 'cuzdan', 'kredi karti', 'banka karti', 'doviz', 'harclik', 'nakit', 'bozuk para', 'tatil parası', 'tatil parasi', 'euro dolar', 'cüzdanım', 'para'] },
        { label: 'Şapka', share: 2.0, aliases: ['sapka', 'hasır şapka', 'güneş şapkası', 'kep', 'kasket', 'plaj şapkası', 'hasir sapka', 'gunes sapkasi', 'plaj sapkasi', 'bucket şapka', 'yazlık şapka', 'yazlik sapka', 'siperlikli şapka', 'beyzbol şapkası', 'bandana', 'bone', 'kovboy şapkası', 'şapkam'] },
        { label: 'İlaç çantası', share: 1.6, aliases: ['ilac cantasi', 'ağrı kesici', 'yara bandı', 'ilk yardım', 'sinek kovucu', 'düzenli ilaç', 'agri kesici', 'yara bandi', 'ilk yardim', 'duzenli ilac', 'ilaçlar', 'ilaclar', 'mide ilacı', 'mide ilaci', 'alerji ilacı', 'sinek ilacı', 'yanık kremi', 'yanik kremi'] },
        { label: 'Su matarası', share: 1.4, aliases: ['termos', 'matara', 'soğuk su şişesi', 'plastik şişe', 'su kabı', 'suluk', 'soguk su sisesi', 'plastik sise', 'su kabi', 'su şişesi', 'su sisesi', 'çelik termos', 'celik termos', 'soğuk tutan termos', 'su termosu', 'mataram', 'buzlu su şişesi', 'seyahat bardağı'] },
        { label: 'Deniz gözlüğü', share: 1.2, aliases: ['deniz gozlugu', 'şnorkel', 'palet', 'yüzücü gözlüğü', 'dalış maskesi', 'su gözlüğü', 'snorkel', 'yuzucu gozlugu', 'dalis maskesi', 'su gozlugu', 'havuz gözlüğü', 'havuz gozlugu', 'dalış gözlüğü', 'dalis gozlugu', 'şnorkel maske', 'deniz paleti', 'tam yüz maskesi', 'burun tıkacı'] },
        { label: 'Şişme simit', share: 0.9, aliases: ['sisme simit', 'deniz yatağı', 'kolluk', 'can simidi', 'deniz topu', 'flamingolu simit', 'deniz yatagi', 'deniz simidi', 'şişme yatak', 'sisme yatak', 'deniz kolluğu', 'deniz kollugu', 'şişme bot', 'sisme bot', 'plaj topu', 'pompa', 'şişme koltuk', 'unicorn deniz yatağı'] },
        { label: 'Tavla', share: 0.7, aliases: ['tavla takımı', 'iskambil kağıdı', 'okey takımı', 'kutu oyunu', 'uno kartları', 'sahil oyunu', 'tavla takimi', 'iskambil kagidi', 'okey takimi', 'uno kartlari', 'iskambil destesi', 'oyun kağıdı', 'oyun kagidi', 'uno', 'monopoly', 'satranç takımı', 'plaj raketi', 'kutu oyunları'] },
        { label: 'Çanta', share: 0.5, aliases: ['valiz', 'bavul', 'plaj çantası', 'sırt çantası', 'el çantası', 'hasır çanta', 'plaj cantasi', 'sirt cantasi', 'el cantasi', 'hasir canta', 'seyahat çantası', 'seyahat cantasi', 'kabin boy valiz', 'bez çanta', 'bez canta', 'bel çantası', 'makyaj çantası', 'bavulum'] },
        { label: 'Fotoğraf makinesi', share: 0.3, aliases: ['fotograf makinesi', 'kamera', 'gopro', 'tripod', 'selfie çubuğu', 'lens', 'selfie cubugu', 'aksiyon kamerası', 'aksiyon kamerasi', 'su altı kamerası', 'su alti kamerasi', 'polaroid makine', 'şipşak fotoğraf makinesi', 'video kamera', 'fotoğraf makinası', 'fotograf makinasi', 'hafıza kartı', 'drone'] }
      ].sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['kar montu', 'kaban', 'kazak'], reason: 'Yaz tatili valizinde kışlık kalın mont yer almaz.' },
        { aliases: ['ütü', 'elektrik süpürgesi'], reason: 'Ev temizlik aleti tatile götürülmez.' },
        { aliases: ['tencere', 'tava', 'düdüklü'], reason: 'Otel veya yazlık tatilinde mutfak eşyası taşınmaz.' },
        { aliases: ['çamaşır makinesi', 'buzdolabı'], reason: 'Büyük beyaz eşya valize sığmaz.' },
        { aliases: ['ders kitabı', 'test kitabı'], reason: 'Tatil dinlenme zamanı, sınav hazırlık eşyası sayılmaz.' },
        { aliases: ['soba', 'elektrikli ısıtıcı'], reason: 'Yazlık tatil bavulunun bir parçası değil.' }
      ],
      tests: [
        { in: 'Mayo', expect: 'Mayo' },
        { in: 'gunes kremi', expect: 'Güneş kremi' },
        { in: 'powerbank', expect: 'Şarj aleti' },
        { in: 'kar montu', expect: 'invalid' }
      ]
    },
    {
      id: 'q13',
      cat: 'gelenek',
      text: 'Düğünlerde mutlaka olan bir şey söyle',
      answers: [
        { label: 'Halay', share: 22.5, aliases: ['halay çekmek', 'mendil sallamak', 'oyun havası', 'çiftetelli', 'horon', 'zeybek', 'halay cekmek', 'oyun havasi', 'ciftetelli', 'halay başı', 'halay basi', 'erik dalı', 'erik dali', 'ankara havası', 'ankara havasi', 'göbek atmak', 'gobek atmak', 'kaşık oyunu'] },
        { label: 'Takı takma', share: 18.5, aliases: ['taki takma', 'altın takmak', 'çeyrek altın', 'bilezik', 'takı töreni', 'zarf atmak', 'altin takmak', 'ceyrek altin', 'taki toreni', 'para takmak', 'cumhuriyet altını', 'gram altın', 'gram altin', 'takı kurdelesi', 'taki kurdelesi', 'takı sandığı', 'takı merasimi', 'iğneyle para takmak'] },
        { label: 'Gelin', share: 10.6, aliases: ['gelinlik', 'duvak', 'gelin hanım', 'gelin çiçeği', 'gelin ayakkabısı', 'nedimeler', 'gelin hanim', 'gelin cicegi', 'gelin ayakkabisi', 'beyaz gelinlik', 'gelin tacı', 'gelin taci', 'gelin saçı', 'gelin saci', 'gelin makyajı', 'nedime', 'gelin kuaförü', 'kırmızı kuşak'] },
        { label: 'Düğün pastası', share: 8.4, aliases: ['dugun pastasi', 'pasta kesimi', 'katlı pasta', 'pasta', 'kılıçla pasta', 'düğün keki', 'katli pasta', 'kilicla pasta', 'dugun keki', 'yaş pasta', 'yas pasta', 'pasta kesmek', 'maket pasta', 'yedi katlı pasta', 'gelin damat pastası', 'pasta yedirmek', 'pasta töreni', 'kuru pasta'] },
        { label: 'Davul zurna', share: 7.8, aliases: ['davul', 'zurna', 'orkestra', 'canlı müzik', 'disk jokey', 'düğün müziği', 'canli muzik', 'dugun muzigi', 'davulcu', 'zurnacı', 'zurnaci', 'davul zurna ekibi', 'klarnet', 'düğün orkestrası', 'dugun orkestrasi', 'çalgıcılar', 'calgicilar', 'pavyon havası'] },
        { label: 'Damat', share: 6.4, aliases: ['damatlık', 'damat bey', 'smokin', 'papyon', 'damat tıraşı', 'sağdıç', 'damatlik', 'damat tirasi', 'sagdic', 'takım elbise damat', 'damat halayı', 'damat kahvesi', 'tuzlu kahve', 'yaka çiçeği', 'yaka cicegi', 'sağdıçlar', 'damat traşı', 'damadın arkadaşları'] },
        { label: 'Düğün yemeği', share: 5.8, aliases: ['dugun yemegi', 'et pilav', 'kavurma pilav', 'ikram', 'çerez', 'pasta börek', 'cerez', 'pasta borek', 'keşkek', 'keskek', 'düğün çorbası', 'dugun corbasi', 'yahni', 'gazoz ve kuru pasta', 'limonata kek', 'meyve suyu pasta', 'düğün pilavı', 'tavuklu pilav'] },
        { label: 'Kına', share: 4.2, aliases: ['kına yakmak', 'kına gecesi', 'bindallı', 'testi kırmak', 'kına tepsisi', 'yüksek yüksek tepelere', 'kina', 'kina yakmak', 'kina gecesi', 'bindalli', 'testi kirmak', 'kina tepsisi', 'yuksek yuksek tepelere', 'gelin ağlatma', 'gelin aglatma', 'avuç içi altın', 'kına türküsü', 'kuru kına dağıtmak'] },
        { label: 'Nikah memuru', share: 3.4, aliases: ['nikah', 'evet demek', 'nikah şahidi', 'imza atmak', 'evlilik cüzdanı', 'nikah töreni', 'nikah sahidi', 'evlilik cuzdani', 'nikah toreni', 'ayağa basmak', 'ayaga basmak', 'nikah masası', 'nikah masasi', 'aile cüzdanı', 'nikah şekeri', 'nikah sekeri', 'şahitler', 'nikah kıyılması'] },
        { label: 'İlk dans', share: 2.8, aliases: ['ilk dans', 'dans etmek', 'vals', 'pist', 'romantik dans', 'dans müziği', 'dans muzigi', 'açılış dansı', 'acilis dansi', 'gelin damat dansı', 'gelin damat dansi', 'slow dans', 'dans pisti', 'sisler içinde dans', 'romantik şarkı', 'dans şarkısı', 'piste çıkmak', 'alkışlarla ilk dans'] },
        { label: 'Fotoğrafçı', share: 2.4, aliases: ['fotografci', 'düğün fotoğrafı', 'kamera çekimi', 'albüm', 'dış çekim', 'düğün videosu', 'dugun fotografi', 'kamera cekimi', 'album', 'dis cekim', 'dugun videosu', 'kameraman', 'düğün fotoğrafçısı', 'dugun fotografcisi', 'aile fotoğrafı', 'video kayıt', 'drone çekimi', 'düğün klibi'] },
        { label: 'Konvoy', share: 2.0, aliases: ['düğün konvoyu', 'korna çalmak', 'araba kornası', 'gelin konvoyu', 'şehir turu', 'konvoy arabası', 'dugun konvoyu', 'korna calmak', 'araba kornasi', 'sehir turu', 'konvoy arabasi', 'kornaya basmak', 'araba konvoyu', 'camdan sarkmak', 'konvoyda havlu bağlamak', 'dörtlüleri yakmak', 'gelin alma konvoyu', 'korna sesi'] },
        { label: 'Çiçek atma', share: 1.6, aliases: ['cicek atma', 'gelin buketi', 'buket atmak', 'çiçek kapmak', 'gelin çiçeği atma', 'buket', 'cicek kapmak', 'gelin cicegi atma', 'gelin buketi atmak', 'çiçek fırlatmak', 'cicek firlatmak', 'bekarlara çiçek atmak', 'gelin çiçeğini yakalamak', 'çiçek tutmak', 'buket kapmaca', 'arkaya çiçek atmak', 'gelin buketini kapmak', 'çiçek atma merasimi'] },
        { label: 'Gelin arabası süslemek', share: 1.2, aliases: ['gelin arabasi', 'araba süslemek', 'tül bağlamak', 'plaka yazısı', 'evleniyoruz yazısı', 'süslü araba', 'gelin arabasi suslemek', 'araba suslemek', 'tul baglamak', 'plaka yazisi', 'evleniyoruz yazisi', 'suslu araba', 'gelin arabası', 'mutluyuz yazısı', 'arabada çiçek', 'dikiz aynasına havlu', 'klasik gelin arabası', 'araba önü çiçek'] },
        { label: 'Kapı önü bahşişi', share: 0.9, aliases: ['kapi onu bahsisi', 'kapı açılmıyor', 'sandık üstü oturma', 'bahşiş vermek', 'çocuklara zarf', 'yol kesme', 'kapi acilmiyor', 'sandik ustu oturma', 'bahsis vermek', 'cocuklara zarf', 'kapı tutma', 'kapi tutma', 'gelin arabası önü kesmek', 'zarf dağıtmak', 'zarf dagitmak', 'bahşiş zarfı', 'bahsis zarfi', 'çeyiz sandığına oturmak'] },
        { label: 'Ayakkabı yazısı', share: 0.7, aliases: ['ayakkabi yazisi', 'ayakkabı altı', 'isim yazmak', 'bekar arkadaş isimleri', 'silinen isim', 'gelin ayakkabısı altı', 'ayakkabi alti', 'bekar arkadas isimleri', 'gelin ayakkabisi alti', 'ayakkabının altına isim yazmak', 'ayakkabinin altina isim yazmak', 'ayakkabı altına ad yazmak', 'bekar kızların ismi', 'ismi silinen evlenir', 'gelin ayakkabısına isim', 'ayakkabı altı isim', 'altı silinen isim', 'ayakkabıya yazı yazmak'] },
        { label: 'Davetiye', share: 0.5, aliases: ['düğün davetiyesi', 'davetiye dağıtmak', 'davet kartı', 'düğün kartı', 'zarf davetiye', 'davetiye bastırmak', 'dugun davetiyesi', 'davetiye dagitmak', 'davet karti', 'dugun karti', 'davetiye bastirmak', 'düğün çağrısı', 'davetiye sözleri', 'davetiye zarfı', 'okuntu', 'düğüne davet', 'davetiyeler', 'online davetiye'] },
        { label: 'Havai fişek', share: 0.3, aliases: ['havai fisek', 'volkan', 'konfeti', 'meşale', 'maytap', 'ışık gösterisi', 'mesale', 'isik gosterisi', 'konfeti patlatmak', 'volkan yakmak', 'havai fişek gösterisi', 'havai fisek gosterisi', 'sis bombası', 'sis bombasi', 'kıvılcım volkan', 'renkli meşale', 'konfeti yağmuru', 'maytap yakmak'] }
      ].sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['cenaze', 'taziye'], reason: 'Bu hüzünlü bir tören, düğün neşesiyle ilgisi yok.' },
        { aliases: ['sınav', 'karne'], reason: 'Bu okul hayatına ait bir durum.' },
        { aliases: ['fatura ödeme', 'vergi'], reason: 'Düğün eğlencesiyle alakalı bir öğe değil.' },
        { aliases: ['ameliyat', 'hastane'], reason: 'Sağlık müdahalesi düğün geleneği değil.' },
        { aliases: ['asker uğurlama', 'şafak'], reason: 'Bu başka bir törene ait bir kavram.' },
        { aliases: ['maç izlemek', 'ofsayt'], reason: 'Düğün salonunun klasik parçası değil.' }
      ],
      tests: [
        { in: 'Halay', expect: 'Halay' },
        { in: 'taki takma', expect: 'Takı takma' },
        { in: 'sandık üstü oturma', expect: 'Kapı önü bahşişi' },
        { in: 'cenaze', expect: 'invalid' }
      ]
    },
    {
      id: 'q14',
      cat: 'gelenek',
      text: 'Türk kahvesi içtikten sonra yapılan bir şey söyle',
      answers: [
        { label: 'Fal bakmak', share: 45.6, aliases: ['fal', 'fal bakarım', 'kahve falı', 'fal baktırmak', 'fal açmak', 'fincan falı', 'fal bakarim', 'kahve fali', 'fal baktirmak', 'fal acmak', 'fincan fali', 'fala bakmak', 'kahve falına bakmak', 'falcıya göndermek', 'fal uygulaması', 'neyse halim çıksın falim', 'neyse halim ciksin falim', 'fal yorumlamak'] },
        { label: 'Su içmek', share: 15.0, aliases: ['su icmek', 'bir yudum su', 'kahve yanı su', 'suyu içmek', 'soğuk su içmek', 'bardak su', 'kahve yani su', 'suyu icmek', 'soguk su icmek', 'yanındaki suyu içmek', 'yanindaki suyu icmek', 'boğazı temizlemek için su', 'bir bardak su içmek', 'ağzı çalkalamak', 'kahve suyunu içmek', 'maden suyu içmek', 'soda içmek', 'su yudumlamak'] },
        { label: 'Lokum yemek', share: 8.2, aliases: ['lokum', 'çikolata yemek', 'tatlı yemek', 'güllü lokum yemek', 'ikramlık yemek', 'kurabiye yemek', 'cikolata yemek', 'tatli yemek', 'gullu lokum yemek', 'ikramlik yemek', 'kahve yanı lokum yemek', 'kuş lokumu yemek', 'fıstıklı lokum yemek', 'çifte kavrulmuş lokum yemek', 'badem şekeri yemek', 'draje yemek', 'madlen çikolata yemek', 'ağzı tatlandırmak'] },
        { label: 'Kahve sohbeti', share: 7.4, aliases: ['muhabbet etmek', 'dedikodu yapmak', 'konuşmak', 'dertleşmek', 'kırk yıl hatır', 'sohbet etmek', 'konusmak', 'dertlesmek', 'kirk yil hatir', 'kahve muhabbeti', 'gıybet yapmak', 'giybet yapmak', 'arkadaşlarla sohbet', 'koyu sohbet', 'kaynatmak', 'laflamak', 'dedikoduya devam etmek', 'sohbete dalmak'] },
        { label: 'Fincanı kapatmak', share: 6.6, aliases: ['fincani kapatmak', 'ters çevirmek', 'fincanı ters çevirmek', 'tabağı kapatmak', 'kahveyi kapatmak', 'fincan kapatma', 'ters cevirmek', 'fincani ters cevirmek', 'tabagi kapatmak', 'fal için kapatmak', 'fal icin kapatmak', 'kendime doğru kapatmak', 'tabağa ters kapatmak', 'fincanı devirmek', 'fincani devirmek', 'fincanı tabağa kapatmak', 'kahve fincanını kapatmak', 'kapattım fincanı'] },
        { label: 'Sigara içmek', share: 4.0, aliases: ['sigara', 'sigara yakmak', 'kahve sigara', 'bir dal yakmak', 'balkonda sigara', 'tüttürmek', 'tutturmek', 'sigara tellendirmek', 'bir sigara yakmak', 'kahve üstü sigara', 'kahve ustu sigara', 'balkona çıkıp sigara içmek', 'keyif sigarası', 'keyif sigarasi', 'tütün içmek', 'elektronik sigara', 'puf çekmek', 'sigara molası'] },
        { label: 'Dilek tutmak', share: 3.0, aliases: ['dilek', 'niye tutmak', 'niyet etmek', 'gönlünden geçirmek', 'kalbinden geçirmek', 'dilekte bulunmak', 'niyet tutmak', 'gonlunden gecirmek', 'kalbinden gecirmek', 'içinden dilek tutmak', 'icinden dilek tutmak', 'bir niyet tutmak', 'fal niyeti tutmak', 'aşk niyeti tutmak', 'iş niyeti tutmak', 'fincanı kapatırken dilek tutmak', 'gönlümden geçirdim', 'niyetlendim'] },
        { label: 'Yüzük koymak', share: 2.2, aliases: ['yuzuk koymak', 'fincanın üstüne yüzük', 'alyans koymak', 'metal para koymak', 'bozuk para koymak', 'soğusun diye yüzük', 'fincanin ustune yuzuk', 'sogusun diye yuzuk', 'fincan tepesine yüzük', 'altın yüzük koymak', 'altin yuzuk koymak', 'demir para koymak', 'üstüne para koymak', 'ustune para koymak', 'fincan üstüne metal koymak', 'çabuk soğusun diye para', 'yüzük bırakmak', 'fincana yüzük koymak'] },
        { label: 'Tabağı sallamak', share: 1.6, aliases: ['tabagi sallamak', 'fincanı çevirmek', 'saat yönünde çevirmek', 'üç kere çevirmek', 'çalkalamak', 'telve yaymak', 'fincani cevirmek', 'saat yonunde cevirmek', 'uc kere cevirmek', 'calkalamak', 'başın üstünde çevirmek', 'basin ustunde cevirmek', 'fincanı çalkalamak', 'fincani calkalamak', 'üç kez döndürmek', 'telveyi çalkalamak', 'fincanı sallamak', 'tabakla beraber çevirmek'] },
        { label: 'Fincanı soğutmak', share: 1.4, aliases: ['fincani sogutmak', 'soğumasını beklemek', 'üflemek', 'soğusun diye beklemek', 'fincan soğutma', 'ılımasını beklemek', 'sogumasini beklemek', 'uflemek', 'sogusun diye beklemek', 'fincan sogutma', 'ilimasini beklemek', 'fincan soğudu mu bakmak', 'fincan sogudu mu bakmak', 'üstüne peçete koymak', 'soğumasını kontrol etmek', 'elini fincana değdirmek', 'soğumuş mu diye dokunmak', 'fincanın soğuması'] },
        { label: 'Gülümsemek', share: 1.9, aliases: ['gülmek', 'keyif yapmak', 'dinlenmek', 'arkaya yaslanmak', 'rahatlamak', 'mola vermek', 'gulumsemek', 'gulmek', 'keyif çatmak', 'keyif catmak', 'huzur bulmak', 'yorgunluk atmak', 'keyiflenmek', 'oh demek', 'derin nefes almak', 'gevşemek', 'kahve keyfi yapmak', 'mutlu olmak'] },
        { label: 'Tekrar kahve yapmak', share: 1.1, aliases: ['ikinci kahve', 'bir fincan daha', 'tazelemek', 'devam etmek', 'çay demlemek', 'yeni kahve', 'tekrar kahve içmek', 'tekrar kahve icmek', 'bir kahve daha', 'ikinci fincanı içmek', 'üstüne çay içmek', 'ustune cay icmek', 'kahveyi tazelemek', 'cezveyi tekrar koymak', 'bir tur daha kahve', 'ikinciyi pişirmek', 'yeniden kahve yapmak', 'çaya geçmek'] },
        { label: 'Telveyi incelemek', share: 0.8, aliases: ['telveyi incelemek', 'şekillere bakmak', 'kuş görmek', 'yol görmek', 'telve okumak', 'fincanın içine bakmak', 'sekillere bakmak', 'kus gormek', 'yol gormek', 'fincanin icine bakmak', 'telveye bakmak', 'balık görmek', 'balik gormek', 'at görmek', 'harf aramak', 'üç vakte kadar demek', 'kabarık telveye bakmak', 'tabaktaki telveyi süzdürmek'] },
        { label: 'Kalp çıkarmak', share: 0.6, aliases: ['kalp cikarmak', 'parmakla kalp', 'fincan dibine dokunmak', 'dilek basmak', 'ortasına basmak', 'şekil çıkarmak', 'ortasina basmak', 'sekil cikarmak', 'başparmakla basmak', 'basparmakla basmak', 'fincanın ortasına parmak basmak', 'kalp şekli çıkarmak', 'kalp sekli cikarmak', 'telveye parmak basmak', 'yüreğini açmak', 'içini açmak parmakla', 'parmak izi basmak', 'telvenin ortasına basmak'] },
        { label: 'Fincanı yıkamak', share: 0.4, aliases: ['fincani yikamak', 'bulaşık yıkamak', 'makineye atmak', 'sudan geçirmek', 'fincanları toplamak', 'mutfağa götürmek', 'bulasik yikamak', 'sudan gecirmek', 'fincanlari toplamak', 'mutfaga goturmek', 'tepsiyi kaldırmak', 'tepsiyi kaldirmak', 'fincanı çalkalayıp yıkamak', 'lavaboya koymak', 'telvesini akıtmak', 'bulaşık makinesine dizmek', 'masayı toplamak', 'fincanları mutfağa taşımak'] },
        { label: 'Eline sağlık demek', share: 0.2, aliases: ['eline saglik', 'köpüklü olmuş demek', 'teşekkür etmek', 'çok güzel olmuş', 'afiyet olsun demek', 'kırk yıl hatırı var', 'kopuklu olmus demek', 'tesekkur etmek', 'cok guzel olmus', 'kirk yil hatiri var', 'ellerine sağlık', 'ellerine saglik', 'kahve şahane olmuş', 'tam kıvamında olmuş', 'köpüğü bol olmuş', 'yapanın eline sağlık', 'kırk yıl hatırı olsun', 'kesene bereket'] }
      ].sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['duş almak', 'banyo yapmak'], reason: 'Kahve keyfinin hemen ardından yapılan bir şey değil.' },
        { aliases: ['koşu yapmak', 'maraton'], reason: 'Kahve içtikten hemen sonra yapılan klasik davranış değil.' },
        { aliases: ['araba tamir etmek', 'lastik değiştirmek'], reason: 'Kahve ritüeliyle ilgisiz bir iş.' },
        { aliases: ['diş çekmek', 'ameliyat'], reason: 'Kahve sonrası adeti değil.' },
        { aliases: ['yüzmek', 'denize atlamak'], reason: 'Kahve fincanı geleneğine ait değil.' },
        { aliases: ['ders anlatmak', 'tahtaya yazmak'], reason: 'Bu okulda yapılan bir iş.' }
      ],
      tests: [
        { in: 'Fal bakmak', expect: 'Fal bakmak' },
        { in: 'fal bakarım', expect: 'Fal bakmak' },
        { in: 'ters çevirmek', expect: 'Fincanı kapatmak' },
        { in: 'duş almak', expect: 'invalid' }
      ]
    },
    {
      id: 'q15',
      cat: 'okul',
      text: 'Öğretmenin sık söylediği bir söz söyle',
      answers: [
        { label: 'Sessiz olun', share: 22.5, aliases: ['susun', 'sessizlik', 'konuşmayın', 'gürültü yapmayın', 'çıt çıkmasın', 'biraz sessiz', 'konusmayin', 'gurultu yapmayin', 'cit cikmasin', 'sessiz olalım', 'sessiz olalim', 'uğultu yapmayın', 'ugultu yapmayin', 'sınıf sus', 'sinif sus', 'sesinizi kesin', 'kendi aranızda konuşmayın', 'beni dinleyin'] },
        { label: 'Defterleri çıkarın', share: 12.5, aliases: ['defterleri cikarin', 'defter açın', 'kalemleri çıkarın', 'not alın', 'yazmaya başlayın', 'defterinizi açın', 'defter acin', 'kalemleri cikarin', 'not alin', 'yazmaya baslayin', 'defterinizi acin', 'yazdırıyorum', 'yazdiriyorum', 'başlık atın', 'baslik atin', 'tahtadakileri yazın', 'tahtadakileri deftere geçirin', 'defter kalem çıkarın'] },
        { label: 'Bu sınavda çıkacak', share: 11.5, aliases: ['bu sinavda cikacak', 'sınavda sorarım', 'yazılıda çıkar', 'buraya dikkat', 'yıldız koyun', 'kesin sorarım', 'sinavda sorarim', 'yazilida cikar', 'yildiz koyun', 'kesin sorarim', 'altını çizin', 'altini cizin', 'sınav sorusu', 'sinav sorusu', 'bunu not edin sınavda çıkar', 'yazılıda soracağım', 'önemli yer sınavda çıkar', 'yıldızlı soru'] },
        { label: 'Zil öğretmene çalar', share: 10.5, aliases: ['zil ogretmene calar', 'zil sizin için çalmıyor', 'ben çık demeden çıkmayın', 'oturun yerinize', 'ders bitmedi', 'toparlanmayın', 'zil sizin icin calmiyor', 'ben cik demeden cikmayin', 'toparlanmayin', 'zil bana çaldı', 'zil bana caldi', 'daha cümlem bitmedi', 'çantaları toplamayın', 'cantalari toplamayin', 'kimse yerinden kalkmasın', 'ben bitti demeden bitmez', 'zil öğrenciye çalmaz', 'yerinize oturun'] },
        { label: 'Kitapları açın', share: 7.5, aliases: ['kitaplari acin', 'sayfa kaçta kaldık', 'kitabınızı açın', 'sayfa elli', 'okumaya başla', 'kitaba bakın', 'sayfa kacta kaldik', 'kitabinizi acin', 'okumaya basla', 'kitaba bakin', 'ders kitabını açın', 'ders kitabini acin', 'nerede kalmıştık', 'nerede kalmistik', 'hangi sayfadaydık', 'kitapları çıkarın', 'kitaplari cikarin', 'sayfayı çevirin'] },
        { label: 'Velini çağıracağım', share: 6.5, aliases: ['velini cagiracagim', 'annenle konuşacağım', 'babanı arayacağım', 'disipline gönderirim', 'müdüre gidersin', 'veli toplantısında görüşürüz', 'annenle konusacagim', 'babani arayacagim', 'disipline gonderirim', 'mudure gidersin', 'veli toplantisinda gorusuruz', 'yarın velin gelsin', 'yarin velin gelsin', 'aileni okula çağırırım', 'veline haber vereceğim', 'tutanak tutarım', 'disiplin kuruluna veririm', 'anneni babani çağır'] },
        { label: 'Teneffüse çıkmıyoruz', share: 5.8, aliases: ['teneffuse cikmiyoruz', 'teneffüs yok', 'teneffüsten yerim', 'beş dakika daha', 'dersi uzatıyoruz', 'kimse çıkmasın', 'teneffus yok', 'teneffusten yerim', 'bes dakika daha', 'dersi uzatiyoruz', 'kimse cikmasin', 'teneffüs iptal', 'teneffus iptal', 'konuyu bitirmeden çıkmak yok', 'teneffüsünüzden alacağım', 'blok ders yapacağız', 'ara vermiyoruz', 'teneffüse çıkmak yok'] },
        { label: 'Bu sınıf ne olacak', share: 5.2, aliases: ['bu sinif ne olacak', 'en yaramaz sınıf', 'hiç böyle sınıf görmedim', 'diğer şube daha iyi', 'sizden adam olmaz', 'kendinize gelin', 'en yaramaz sinif', 'hic boyle sinif gormedim', 'diger sube daha iyi', 'okulun en gürültülü sınıfı', 'koridorun başından sesiniz geliyor', 'öğretmenler odasında herkes sizi konuşuyor', 'bu sınıfın hali ne', 'bu sinifin hali ne', 'diğer sınıflar çoktan bitirdi', 'en geri kalan sınıf', 'hiç ders çalışmıyorsunuz', 'kendinize çeki düzen verin'] },
        { label: 'Ödevleri görelim', share: 4.4, aliases: ['odevleri gorelim', 'ödevini kim yapmadı', 'ödev kontrolü', 'defterleri açın bakacağım', 'neden yapmadın', 'eksik olanlar', 'odevini kim yapmadi', 'odev kontrolu', 'defterleri acin bakacagim', 'neden yapmadin', 'ödevleri çıkarın', 'odevleri cikarin', 'ödev yapmayanlar ayağa kalksın', 'ödevini unutanlar', 'eksi veriyorum', 'kendini de unutaydın', 'kendini neden unutmadın', 'ödevleri kontrol edeceğim'] },
        { label: 'Parmak kaldırın', share: 3.8, aliases: ['parmak kaldirin', 'söz alarak konuşun', 'hep bir ağızdan değil', 'sırayla konuşun', 'parmak kaldır', 'söz hakkı iste', 'soz alarak konusun', 'hep bir agizdan degil', 'sirayla konusun', 'parmak kaldir', 'soz hakki iste', 'parmak kaldırmadan konuşmayın', 'parmak kaldirmadan konusmayin', 'söz isteyin', 'soz isteyin', 'hep bir ağızdan konuşmayın', 'parmak göreyim', 'bilen parmak kaldırsın'] },
        { label: 'Arka sıra dinlemiyor', share: 3.2, aliases: ['arka sira', 'arka taraf', 'siz ikiniz', 'ayıracağım sizi', 'cam kenarı', 'arka sıradakiler', 'ayiracagim sizi', 'cam kenari', 'arka siradakiler', 'arka sıra konuşmayın', 'arka sira konusmayin', 'yerlerinizi değiştireceğim', 'yerlerinizi degistirecegim', 'en arka sıra buraya bak', 'kalorifer kenarı', 'sizi öne alacağım', 'arka dörtlü', 'arkadakiler beni dinleyin'] },
        { label: 'Yoklama alıyorum', share: 2.4, aliases: ['yoklama', 'burada deyin', 'kimler yok', 'geç kalanlar', 'yok yazacağım', 'imza atın', 'yoklama aliyorum', 'gec kalanlar', 'yok yazacagim', 'imza atin', 'numarası okunan burada desin', 'bugün kim yok', 'bugun kim yok', 'nöbetçi kim', 'sınıf defterini getirin', 'sinif defterini getirin', 'geç kağıdı aldın mı', 'yoklama yapacağım'] },
        { label: 'Kendi kendine gülme', share: 1.4, aliases: ['komik bir şey varsa söyle', 'biz de gülelim', 'anlat da hepimiz gülelim', 'ne gülüyorsun', 'gülünecek ne var', 'ciddi olun', 'komik bir sey varsa soyle', 'biz de gulelim', 'anlat da hepimiz gulelim', 'ne guluyorsun', 'gulunecek ne var', 'söyle biz de gülelim', 'soyle biz de gulelim', 'çok mu komik', 'cok mu komik', 'neye gülüyorsunuz', 'gülme krizine mi girdin', 'burada komik bir şey yok'] },
        { label: 'Anlaşıldı mı', share: 1.0, aliases: ['anlasildi mi', 'sorusu olan var mı', 'anlamayan var mı', 'tekrar edeyim mi', 'buraya kadar tamam mı', 'kafanıza takılan', 'sorusu olan var mi', 'anlamayan var mi', 'buraya kadar tamam mi', 'kafaniza takilan', 'anlaşılmayan bir yer var mı', 'anlasilmayan bir yer var mi', 'herkes anladı mı', 'herkes anladi mi', 'geçiyorum bu konuyu', 'sorunuz var mı çocuklar', 'var mı anlamayan', 'baştan anlatayım mı'] },
        { label: 'Tahtaya kalk', share: 0.8, aliases: ['tahtaya kalk', 'tahtaya gel', 'soruyu çöz', 'tahtayı sil', 'nöbetçi tahtayı sil', 'gel bakalım', 'soruyu coz', 'tahtayi sil', 'nobetci tahtayi sil', 'gel bakalim', 'tahtaya kim kalkacak', 'listeden kaldıracağım', 'sözlüye kaldırıyorum', 'sozluye kaldiriyorum', 'tebeşiri al çöz', 'kalemi al tahtaya gel', 'tahtadaki soruyu yap', 'gönüllü olan var mı'] },
        { label: 'Dışarı çık', share: 0.6, aliases: ['disari cik', 'çık dışarı', 'müdüre git', 'kapının önünde bekle', 'dersimi bölme', 'sınıfı terk et', 'cik disari', 'mudure git', 'kapinin onunde bekle', 'dersimi bolme', 'sinifi terk et', 'yüzünü yıkayıp gel', 'yuzunu yikayip gel', 'müdür yardımcısına git', 'sınıftan çık', 'siniftan cik', 'dersten atarım', 'kapıyı çek çık'] },
        { label: 'Sakızı at', share: 0.4, aliases: ['sakizi at', 'sakız çiğneme', 'çöpe at şunu', 'ağzındaki ne', 'yemek yeme derste', 'sakızı çıkar', 'sakiz cigneme', 'cope at sunu', 'agzindaki ne', 'sakizi cikar', 'ağzındaki sakızı çöpe at', 'agzindaki sakizi cope at', 'derste sakız çiğnenmez', 'derste bir şey yenmez', 'ağzında ne var senin', 'git çöpe tükür şunu', 'sakızını çıkar', 'derste su içilmez'] },
        { label: 'Sıra arkadaşına bakma', share: 0.2, aliases: ['sira arkadasina bakma', 'kopya çekme', 'kağıdına bak', 'önüne dön', 'konuşma yanındakiyle', 'arkana dönme', 'kopya cekme', 'kagidina bak', 'onune don', 'konusma yanindakiyle', 'arkana donme', 'kendi kağıdına bak', 'kendi kagidina bak', 'gözün kendi kağıdında olsun', 'kopya çekeni sıfırlarım', 'kağıdını alırım', 'kagidini alirim', 'yanındakinin kağıdına bakma'] }
      ].sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['inecek var', 'müsait bir yerde'], reason: 'Bu okulda değil, toplu taşımada söylenir.' },
        { aliases: ['gel abla gel', 'taze bunlar'], reason: 'Bu pazarcı tezahüratı, öğretmen sözü değil.' },
        { aliases: ['el öpenlerin çok olsun', 'iyi bayramlar'], reason: 'Bayram ziyaretinde büyüklerin söylediği bir söz.' },
        { aliases: ['hesap lütfen', 'afiyet olsun'], reason: 'Restoranda söylenen ifadeler.' },
        { aliases: ['reçeteni yazdım', 'geçmiş olsun'], reason: 'Bu hastanede doktorun söylediği bir söz.' },
        { aliases: ['hız sınırını aştınız', 'ehliyet ruhsat'], reason: 'Trafik kontrolünde duyulan bir ifade.' }
      ],
      tests: [
        { in: 'Sessiz olun', expect: 'Sessiz olun' },
        { in: 'zil ogretmene calar', expect: 'Zil öğretmene çalar' },
        { in: 'biz de gülelim', expect: 'Kendi kendine gülme' },
        { in: 'inecek var', expect: 'invalid' }
      ]
    },
    {
      id: 'q16',
      cat: 'müzik',
      text: 'Bir Türk şarkıcı söyle',
      answers: [
        { label: 'Tarkan', share: 22.5, aliases: ['tarkan tevetoğlu', 'megastar', 'kuzu kuzu', 'şımarık', 'dudu', 'tarkanım', 'tarkan tevetoglu', 'simarik', 'tarkanim', 'megastar tarkan', 'öp öp', 'kış güneşi', 'kis gunesi', 'ölürüm sana', 'olurum sana', 'geççek', 'geccek', 'karma tarkan'] },
        { label: 'Sezen Aksu', share: 16.5, aliases: ['sezen', 'minik serçe', 'sezen aksu şarkıları', 'gülümse', 'firuze', 'aksu', 'minik serce', 'sezen aksu sarkilari', 'gulumse', 'tükeneceğiz', 'tukenecegiz', 'hadi bakalım', 'geri dön', 'sen ağlama', 'sen aglama', 'vazgeçtim sezen', 'sezen abla', 'fatma sezen yıldırım'] },
        { label: 'Barış Manço', share: 9.5, aliases: ['baris manco', 'barış abi', 'dağlar dağlar', 'adam olacak çocuk', 'gülpembe', 'manço', 'baris abi', 'daglar daglar', 'adam olacak cocuk', 'gulpembe', 'manco', 'arkadaşım eşek', 'arkadasim esek', 'dönence', 'donence', 'sarı çizmeli mehmet ağa', 'sari cizmeli mehmet aga', 'domates biber patlıcan'] },
        { label: 'Müslüm Gürses', share: 8.2, aliases: ['muslum gurses', 'müslüm baba', 'müslüm', 'nilüfer şarkısı', 'müslüm affet', 'gürses', 'muslum baba', 'muslum', 'nilufer sarkisi', 'gurses', 'hangimiz sevmedik', 'itirazım var', 'itirazim var', 'paramparça müslüm', 'unutamadım', 'unutamadim', 'yakarsa dünyayı garipler yakar', 'baba müslüm'] },
        { label: 'İbrahim Tatlıses', share: 7.2, aliases: ['ibrahim tatlises', 'ibo', 'imparator', 'tatlıses', 'mavişim', 'tatlıses urfa', 'tatlises', 'mavisim', 'imparator ibrahim tatlıses', 'ayağında kundura', 'ayaginda kundura', 'dom dom kurşunu', 'haydi söyle', 'haydi soyle', 'aramam', 'leylim ley', 'mutlu ol yeter', 'ibo show'] },
        { label: 'Ajda Pekkan', share: 6.5, aliases: ['ajda', 'süperstar', 'pekkan', 'yakar geçerim', 'bambaşka biri', 'ajda hanım', 'superstar', 'yakar gecerim', 'bambaska biri', 'ajda hanim', 'süperstar ajda', 'kimler geldi kimler geçti', 'palavra palavra', 'yaz yaz yaz', 'ajda petrol', 'hoşgör sen', 'arada sırada', 'ajda pekkan şarkıları'] },
        { label: 'Hadise', share: 5.0, aliases: ['hadise açıkgöz', 'düm tek tek', 'prenses', 'sıfır tolerans', 'stir me up', 'hadisem', 'hadise acikgoz', 'dum tek tek', 'sifir tolerans', 'deli oğlan', 'deli oglan', 'neredesin aşkım', 'neredesin askim', 'aşk kaç beden giyer', 'küçük bir yol', 'feryat hadise', 'şampiyon hadise', 'yaz günü hadise'] },
        { label: 'Kenan Doğulu', share: 4.5, aliases: ['kenan dogulu', 'kenan', 'doğulu', 'çakkıdı', 'aşk ile yap', 'rütbeni bileceksin', 'dogulu', 'cakkidi', 'ask ile yap', 'rutbeni bileceksin', 'shake it up şekerim', 'tencere kapak', 'doktor kenan', 'tutamıyorum zamanı', 'tutamiyorum zamani', 'baş harfi ben', 'yaparım bilirsin', 'kurşun adres sormaz ki'] },
        { label: 'Sertab Erener', share: 3.8, aliases: ['sertab', 'erener', 'everyway that i can', 'eurovision', 'sertab rüzgar', 'rengarenk', 'sertab ruzgar', 'sertap erener', 'sertap', 'kumsalda', 'olsun sertab', 'yanarım', 'yanarim', 'aşk sertab', 'koparılan çiçekler', 'bir çaresi bulunur', 'mecbursun', 'sertab lal'] },
        { label: 'Mabel Matiz', share: 3.4, aliases: ['mabel', 'matiz', 'antidepresan', 'mabel maya', 'fırtınadayım', 'mabel fan', 'firtinadayim', 'fatih karaca', 'öyle kolaysa', 'oyle kolaysa', 'sarmaşık', 'sarmasik', 'gel mabel', 'ya bu işler ne', 'gök nerede', 'fırtınadayım mabel', 'a canım', 'karakol şarkısı'] },
        { label: 'Yıldız Tilbe', share: 3.0, aliases: ['yildiz tilbe', 'yıldız', 'delikanlım', 'vazgeçtim', 'çabuk olalım aşkım', 'tilbe', 'yildiz', 'delikanlim', 'vazgectim', 'cabuk olalim askim', 'çat kapı', 'cat kapi', 'hastayım sana', 'aşk laftan anlamaz ki', 'el adamı', 'sana değer', 'yürü anca gidersin', 'yıldız abla'] },
        { label: 'Edis', share: 2.6, aliases: ['edis görgülü', 'martılar şarkısı', 'arıyorum', 'benim ol', 'edis dudak', 'çok çok', 'edis gorgulu', 'martilar sarkisi', 'ariyorum', 'cok cok', 'yalancı edis', 'an edis', 'perişanım', 'olmamış mı', 'romantik edis', 'bana ne edis', 'azimli edis', 'edis şarkıları'] },
        { label: 'Gülşen', share: 2.2, aliases: ['gulsen', 'bangır bangır', 'dan dan', 'lolipop', 'yatcaz kalkcaz', 'gülşen bayraktar', 'bangir bangir', 'gulsen bayraktar', 'bir ihtimal biliyorum', 'of of', 'be adam', 'sarışınım', 'yurtta aşk cihanda aşk', 'bi an gel', 'ilişki durumu karışık', 'kardan adam', 'büyük hatırın var', 'gülşen çolakoğlu'] },
        { label: 'Haluk Levent', share: 1.4, aliases: ['haluk levent şarkıları', 'elfida', 'akdeniz akşamları', 'haluk levent ankara', 'haluk levent ahbap', 'levent', 'akdeniz aksamlari', 'haluk abi', 'anlasana', 'aşkın mapushane', 'askin mapushane', 'zor aşk', 'dillere düşeceğiz', 'hüsran şarkısı', 'sevenler ağlarmış', 'yollarda bulurum seni', 'dağlar haluk levent', 'izmir marşı haluk'] },
        { label: 'Zeki Müren', share: 1.0, aliases: ['zeki muren', 'sanat güneşi', 'sanat güneşi paşa', 'gözlerin doğuyor', 'elbet bir gün', 'müren', 'sanat gunesi', 'sanat gunesi pasa', 'gozlerin doguyor', 'elbet bir gun', 'muren', 'şimdi uzaklardasın', 'simdi uzaklardasin', 'ah bu şarkıların gözü kör olsun', 'gitme sana muhtacım', 'bıldırcın yağmuru', 'manolyam', 'zeki müren paşa'] },
        { label: 'Cem Karaca', share: 0.8, aliases: ['karaca', 'tamirci çırağı', 'namus belası', 'resimdeki gözyaşları', 'ceviz ağacı', 'anadolu rock', 'tamirci ciragi', 'namus belasi', 'resimdeki gozyaslari', 'ceviz agaci', 'ıslak ıslak', 'islak islak', 'bu son olsun', 'herkes gibisin', 'çok yorgunum', 'cok yorgunum', 'deniz üstü köpürür', 'muhtar cem karaca'] },
        { label: 'Ferdi Tayfur', share: 0.6, aliases: ['ferdi baba', 'tayfur', 'emmoğlu', 'bana sor', 'sabahçı kahvesi', 'hatıran yeter', 'emmoglu', 'sabahci kahvesi', 'hatiran yeter', 'huzurum kalmadı', 'huzurum kalmadi', 'ben de özledim', 'bende ozledim', 'içim yanıyor', 'çeşme ferdi', 'merak etme sen', 'yıldızlar da kayar', 'gecenin sonu ferdi'] },
        { label: 'Neşet Ertaş', share: 0.4, aliases: ['neset ertas', 'bozkırın tezenesi', 'gönül dağı', 'neredesin sen', 'zahidem', 'ertaş', 'bozkirin tezenesi', 'gonul dagi', 'ertas', 'yalan dünya', 'yalan dunya', 'ah yalan dünyada', 'yazımı kışa çevirdin', 'yazimi kisa cevirdin', 'mühür gözlü', 'muhur gozlum', 'kırşehirli neşet ertaş', 'neşet baba'] },
        { label: 'Teoman', share: 0.2, aliases: ['teoman yakupoğlu', 'teoman papatya', 'paramparça', 'istanbulda sonbahar', 'teoman gemiler', 'renkli rüyalar oteli', 'teoman yakupoglu', 'paramparca', 'renkli ruyalar oteli', 'kupa kızı ve sinek valesi', 'kupa kizi', 'iki yabancı', 'iki yabanci', 'gönülçelen', 'gonulcelen', 'rüzgar gülü', 'serseri teoman', 'nasıl oluyor vakit bir türlü geçmiyor'] }
      ].sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['michael jackson', 'madonna', 'beyonce'], reason: 'Bu yabancı bir pop sanatçısı, Türk şarkıcı değil.' },
        { aliases: ['taylor swift', 'the weeknd', 'rihanna'], reason: 'Bu uluslararası bir yabancı şarkıcı.' },
        { aliases: ['kemal sunal', 'şener şen'], reason: 'Bu değerli bir sinema oyuncusu, şarkıcı değil.' },
        { aliases: ['orhan pamuk', 'yaşar kemal'], reason: 'Bu bir edebiyat yazarı, şarkıcı değil.' },
        { aliases: ['duman', 'mor ve ötesi', 'athena'], reason: 'Tek bir şarkıcı adı yerine müzik grubu adı yazdın.' },
        { aliases: ['arda güler', 'hakan şükür'], reason: 'Bu bir futbolcu, şarkıcı değil.' }
      ],
      tests: [
        { in: 'Tarkan', expect: 'Tarkan' },
        { in: 'minik serçe', expect: 'Sezen Aksu' },
        { in: 'bozkırın tezenesi', expect: 'Neşet Ertaş' },
        { in: 'michael jackson', expect: 'invalid' }
      ]
    },
    {
      id: 'q17',
      cat: 'yemek',
      text: 'Kışın içilen sıcak bir şey söyle',
      answers: [
        { label: 'Salep', share: 29.8, aliases: ['sahlep', 'tarçınlı salep', 'sıcak salep', 'salep içmek', 'fincan salep', 'gerçek salep', 'tarcinli salep', 'sicak salep', 'salep icmek', 'gercek salep', 'tarçınlı sahlep', 'tarcinli sahlep', 'sıcak sahlep', 'sicak sahlep', 'bucak salebi', 'maraş salebi', 'sütlü salep', 'kış salebi'] },
        { label: 'Çay', share: 19.8, aliases: ['cay', 'demli çay', 'siyah çay', 'sıcak çay', 'limonlu çay', 'ince belli çay', 'demli cay', 'siyah cay', 'sicak cay', 'limonlu cay', 'ince belli cay', 'tavşan kanı çay', 'tavsan kani cay', 'rize çayı', 'kaçak çay', 'semaver çayı', 'soba üstü çay', 'bir bardak sıcak çay'] },
        { label: 'Boza', share: 12.0, aliases: ['vefa bozası', 'tarçınlı boza', 'leblebili boza', 'kış bozası', 'bozası', 'ekşi boza', 'vefa bozasi', 'tarcinli boza', 'kis bozasi', 'bozasi', 'eksi boza', 'sıcak boza', 'bozacı', 'darı bozası', 'boza içmek', 'boza icmek', 'kışın boza', 'tarçınlı leblebili boza'] },
        { label: 'Ihlamur', share: 10.0, aliases: ['ihlamur çayı', 'limonlu ıhlamur', 'ballı ıhlamur', 'sıcak ıhlamur', 'bitki çayı', 'ihlamuru', 'ıhlamur', 'ihlamur', 'ihlamur cayi', 'ıhlamur çayı', 'limonlu ihlamur', 'balli ihlamur', 'sicak ihlamur', 'bitki cayi', 'ıhlamuru', 'kaynamış ıhlamur', 'elmalı ıhlamur', 'hasta ıhlamuru'] },
        { label: 'Sıcak çikolata', share: 8.0, aliases: ['sicak cikolata', 'sütlü sıcak çikolata', 'marshmallow sıcak çikolata', 'kakao', 'sütlü kakao', 'erimiş çikolata', 'sutlu sicak cikolata', 'sutlu kakao', 'erimis cikolata', 'sıcak kakao', 'sicak kakao', 'beyaz sıcak çikolata', 'kremalı sıcak çikolata', 'yoğun sıcak çikolata', 'fincanda sıcak çikolata', 'bitter sıcak çikolata', 'çikolatalı sıcak süt', 'hot chocolate'] },
        { label: 'Çorba', share: 5.4, aliases: ['corba', 'mercimek çorbası', 'tarhana çorbası', 'ezogelin çorbası', 'tavuk suyu çorba', 'sıcak çorba', 'mercimek corbasi', 'tarhana corbasi', 'tavuk suyu corba', 'sicak corba', 'kelle paça', 'kelle paca', 'işkembe çorbası', 'iskembe corbasi', 'şehriye çorbası', 'yayla çorbası', 'domates çorbası', 'sıcak tarhana çorbası', 'ezogelin corbasi'] },
        { label: 'Kahve', share: 4.8, aliases: ['türk kahvesi', 'filtre kahve', 'nescafe', 'latte', 'sıcak kahve', 'mocha', 'turk kahvesi', 'sicak kahve', 'cappuccino', 'americano', 'espresso', 'sütlü kahve', 'sutlu kahve', 'granül kahve', 'üçü bir arada', 'ucu bir arada', 'dibek kahvesi', 'menengiç kahvesi'] },
        { label: 'Adaçayı', share: 4.0, aliases: ['adacayi', 'ada çayı', 'sıcak adaçayı', 'limonlu adaçayı', 'doğal adaçayı', 'kış adaçayı', 'ada cayi', 'sicak adacayi', 'limonlu adacayi', 'dogal adacayi', 'kis adacayi', 'dağ adaçayı', 'dag adacayi', 'ballı adaçayı', 'demleme adaçayı', 'boğaz için adaçayı', 'adaçayı demlemek', 'ege adaçayı'] },
        { label: 'Nane limon', share: 2.0, aliases: ['nane limon çayı', 'kaynamış nane limon', 'limonlu nane', 'hasta çayı', 'ballı nane limon', 'nane limon içmek', 'nane limon cayi', 'kaynamis nane limon', 'hasta cayi', 'balli nane limon', 'sıcak nane limon', 'sicak nane limon', 'cezvede nane limon', 'kuru nane limon', 'mide için nane limon', 'grip çayı nane limon', 'nane limon kaynatmak', 'nane çayı'] },
        { label: 'Kuşburnu çayı', share: 1.4, aliases: ['kusburnu', 'kuşburnu', 'sıcak kuşburnu', 'marmelatlı kuşburnu', 'kış çayı', 'kuşburnu suyu', 'kusburnu cayi', 'sicak kusburnu', 'marmelatli kusburnu', 'kis cayi', 'kusburnu suyu', 'doğal kuşburnu', 'dogal kusburnu', 'c vitaminli kuşburnu', 'demleme kuşburnu', 'hibiskus kuşburnu', 'kırmızı kuşburnu çayı', 'ekşi kuşburnu'] },
        { label: 'Tarçınlı süt', share: 1.0, aliases: ['tarcinli sut', 'sıcak süt', 'ballı süt', 'sıcak tarçınlı süt', 'ılık süt', 'ballı sıcak süt', 'sicak sut', 'balli sut', 'sicak tarcinli sut', 'ilik sut', 'balli sicak sut', 'zencefilli süt', 'zerdeçallı süt', 'altın süt', 'kaynamış süt', 'kaynamis sut', 'gece sütü', 'ballı tarçınlı süt'] },
        { label: 'Zencefil çayı', share: 0.8, aliases: ['zencefil', 'ballı zencefil', 'limonlu zencefil', 'taze zencefil', 'zerdeçal çayı', 'zencefilli çay', 'zencefil cayi', 'balli zencefil', 'zerdecal cayi', 'zencefilli cay', 'ballı limonlu zencefil', 'balli limonlu zencefil', 'toz zencefil çayı', 'sıcak zencefil', 'sicak zencefil', 'boğaz yumuşatan zencefil', 'zencefil limon', 'tarçınlı zencefil çayı'] },
        { label: 'Elma çayı', share: 0.6, aliases: ['elma cayi', 'tarçınlı elma çayı', 'kuru elma çayı', 'sıcak elma', 'elmalı çay', 'oralet elma', 'tarcinli elma cayi', 'kuru elma cayi', 'sicak elma', 'elmali cay', 'elma kabuğu çayı', 'elma kabugu cayi', 'karanfilli elma çayı', 'elma tarçın çayı', 'kışlık elma çayı', 'demleme elma çayı', 'toz elma çayı', 'yeşil elma çayı'] },
        { label: 'Papatya çayı', share: 0.4, aliases: ['bitki papatya çayı', 'sıcak papatya', 'bitkisel papatya', 'uyku çayı', 'yeşil çay', 'rezene çayı', 'papatya cayi', 'sicak papatya', 'uyku cayi', 'yesil cay', 'rezene cayi', 'melisa çayı', 'melisa cayi', 'sakinleştirici papatya', 'kurutulmuş papatya çayı', 'ballı papatya çayı', 'yasemin çayı', 'kış bitki çayı'] },
        { label: 'Oralet', share: 0.2, aliases: ['portakallı oralet', 'kivi oralet', 'kıraathane oraleti', 'sıcak oralet', 'limonlu oralet', 'oralet çayı', 'portakalli oralet', 'kiraathane oraleti', 'sicak oralet', 'oralet cayi', 'kuşburnu oralet', 'muzlu oralet', 'karadut oralet', 'kahvehane oraleti', 'toz içecek oralet', 'kivili sıcak içecek', 'atom oralet', 'elmalı oralet'] }
      ].sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['dondurma', 'milkshake', 'ice tea'], reason: 'Bu yazın tercih edilen soğuk bir lezzet.' },
        { aliases: ['limonata', 'buzlu kahve', 'soğuk kahve'], reason: 'Soğuk içecek; kışın ısıtan sıcak içecek değil.' },
        { aliases: ['kola', 'gazoz', 'fanta'], reason: 'Asitli soğuk içecek sıcak kategorisine girmez.' },
        { aliases: ['karpuz', 'kavun', 'dondurulmuş yoğurt'], reason: 'Sıcak bir kış içeceği değil.' },
        { aliases: ['simit', 'börek', 'poğaça'], reason: 'Bu içecek değil, yiyecek.' },
        { aliases: ['soda', 'maden suyu'], reason: 'Maden suyu soğuk içilir, sıcak içecek değil.' }
      ],
      tests: [
        { in: 'Salep', expect: 'Salep' },
        { in: 'sahlep', expect: 'Salep' },
        { in: 'ballı süt', expect: 'Tarçınlı süt' },
        { in: 'limonata', expect: 'invalid' }
      ]
    },
    {
      id: 'q18',
      cat: 'çocukluk',
      text: 'Çocukların oynadığı bir sokak oyunu söyle',
      answers: [
        { label: 'Saklambaç', share: 27.6, aliases: ['saklambac', 'saklambaç oynamak', 'sobe', 'ebe', 'sobelemek', 'saklanmak', 'saklambac oynamak', 'önüm arkam sağım solum sobe', 'onum arkam sagim solum sobe', 'saklanan olmayan ebedir', 'göz yumma', 'duvara sobe', 'çanak çömlek patladı', 'canak comlek patladi', 'saklanma oyunu', 'ebe sobeleme', 'sayıp saklanmak', 'kurtarıcı sobe'] },
        { label: 'Yakan top', share: 14.0, aliases: ['yakantop', 'yakan top oynamak', 'ortada sıçan', 'top yakalama', 'yakalama top', 'can yakma', 'ortada sican', 'yakantop oynamak', 'can alma yakan top', 'iki çizgi arası top', 'topla vurma oyunu', 'can kazanma', 'yakan topu', 'ortada kalma oyunu', 'topta vurulmak', 'can bağışlama', 'yakar top', 'yakartop'] },
        { label: 'Körebe', share: 11.0, aliases: ['korebe', 'göz bağlama', 'kör ebe', 'ebeleme', 'gözü kapalı', 'körebe oynamak', 'goz baglama', 'kor ebe', 'gozu kapali', 'korebe oynamak', 'mendille göz bağlama', 'gözü bağlı yakalama', 'ses ver körebe', 'karanlıkta yakalama', 'ebe gözünü bağla', 'dokunup tanıma', 'gözleri bağlı ebe', 'kör ebe oyunu'] },
        { label: 'Seksek', share: 10.0, aliases: ['sek sek', 'tebeşirle seksek', 'taş atma seksek', 'tek ayak seksek', 'kare çizme', 'seksek oynamak', 'tebesirle seksek', 'tas atma seksek', 'kare cizme', 'sek sek oynamak', 'yere tebeşirle çizmek', 'tek ayak zıplama', 'çizgiye basmadan zıplama', 'mermer atıp zıplama', 'seksek çizgisi', 'seksek taşı', 'seksek tahtası', 'seksek oyunu'] },
        { label: 'İp atlama', share: 8.0, aliases: ['ip atlamak', 'ip atlama', 'çift ip', 'uzun ip', 'ip çevirme', 'atlama ipi', 'ip atlama oyunu', 'cift ip', 'ip cevirme', 'ipten atlamak', 'lastik atlama', 'lastik oyunu', 'iki kişi ip çevirme', 'ip sallama', 'atlama ipiyle oynamak', 'şıpşıp ip atlama', 'ip atlamaca', 'üçlü ip atlama'] },
        { label: 'Top / futbol', share: 7.0, aliases: ['futbol', 'maç yapmak', 'minyatür kale', 'iki taş kale', 'sokak maçı', 'tek kale', 'mac yapmak', 'minyatur kale', 'iki tas kale', 'sokak maci', 'tek kale maç', 'tek kale mac', 'mahalle maçı', 'mahalle maci', 'üç korner bir penaltı', 'uc korner bir penalti', 'atan alır spor', 'sokak futbolu'] },
        { label: 'Misket', share: 5.0, aliases: ['bilye', 'misket oynamak', 'bilye oynamak', 'gazoz kapağı', 'kuyu kazma', 'üçgen misket', 'gazoz kapagi', 'ucgen misket', 'cicoz', 'kemik misket', 'baş misket', 'bilye yuvarlama', 'misket vurma', 'başat', 'koca misket', 'cam bilye', 'toprakta bilye', 'misket oyunu'] },
        { label: 'Elim sende', share: 4.4, aliases: ['kovalamaca', 'ebelemece', 'yakalamaca', 'değmece', 'don ateş', 'yerden yüksek', 'degmece', 'don ates', 'yerden yuksek', 'elim sende oynamak', 'koşup ebelemek', 'dokunup kaçma', 'ebe kaç', 'değdim ebesin', 'donmama oyunu', 'tıp oyunu', 'elim sende oyunu', 'kovalama oyunu'] },
        { label: 'Çelik çomak', share: 3.4, aliases: ['celik comak', 'değnek oyunu', 'çomak vurma', 'çelik çomak oynamak', 'sopayla vurma', 'met oyunu', 'degnek oyunu', 'comak vurma', 'celik comak oynamak', 'iki sopa oyunu', 'dal parçasıyla vurma', 'çeliği havaya kaldırma', 'çomakla vurma', 'odun vurma oyunu', 'köy oyunu çelik çomak', 'çelik ve çomak', 'değnekle çomak', 'met değnek'] },
        { label: 'Kutu kutu pense', share: 2.6, aliases: ['kutu pense', 'elma dersem çık', 'halka oyunu', 'dönme oyunu', 'şarkılı oyun', 'arkasını dönsün', 'elma dersem cik', 'donme oyunu', 'sarkili oyun', 'arkasini donsun', 'armut dersem çıkma', 'armut dersem cikma', 'arkadaşım arkasını dönsün', 'arkadasim arkasini donsun', 'el ele tutuşup dönme', 'kutu kutu pense oynamak', 'tekerlemeli halka oyunu', 'kutu kutu pense şarkısı'] },
        { label: 'Yağ satarım', share: 2.0, aliases: ['yag satarim', 'bal satarım', 'ustam ölmüş', 'mendil bırakma', 'koşma oyunu', 'yağ satarım bal satarım', 'bal satarim', 'ustam olmus', 'mendil birakma', 'kosma oyunu', 'yag satarim bal satarim', 'ustam ölmüş ben satarım', 'ustam olmus ben satarim', 'arkaya mendil koyma', 'halka etrafında koşma', 'ustamın kürkü sarıdır', 'yağ satarım oyunu', 'mendille kovalama'] },
        { label: 'Uzun eşek', share: 1.4, aliases: ['uzun esek', 'atlama oyunu', 'sırt atlama', 'yastık olma', 'uzun eşek oynamak', 'tek çift', 'sirt atlama', 'yastik olma', 'uzun esek oynamak', 'tek cift', 'uzun eşek yastık', 'sırta atlama oyunu', 'eğilip sıra olma', 'tek mi çift mi uzun eşek', 'çökertme oyunu', 'uzun eşek atlama', 'yastık seçme', 'uzun eşek oyunu'] },
        { label: 'İstop', share: 1.0, aliases: ['istop oyunu', 'renk söyleme', 'topu havaya atma', 'renk tutma', 'istop oynamak', 'adını söyleme', 'renk soyleme', 'adini soyleme', 'isim söyleyip top atma', 'istop diye bağırma', 'renk bulma oyunu', 'havaya top fırlatma', 'topu tutup istop deme', 'renkli istop', 'isimli istop', 'topla renk oyunu', 'istop topu', 'simit oyunu'] },
        { label: 'Beş taş', share: 0.8, aliases: ['bes tas', '5 taş', 'beştaş', 'taş kapma', 'avuçlama', 'beş taş oynamak', '5 tas', 'bestas', 'tas kapma', 'avuclama', 'bes tas oynamak', 'küçük taşlarla oyun', 'taşı havaya atıp yerden toplama', 'köprüden taş geçirme', 'birler ikiler üçler beş taş', 'yerde beş taş', 'beş taş oyunu', 'taş toplama oyunu'] },
        { label: 'Birdirbir', share: 0.6, aliases: ['birdir bir', 'eğilip atlama', 'üstünden atlama', 'bir iki üç', 'birdirbir oynamak', 'atlamaca', 'egilip atlama', 'ustunden atlama', 'bir iki uc', 'birdir bir oynamak', 'sırayla üstten atlama', 'belden destek alıp atlama', 'birdirbir ikidir iki', 'eğilenin üstünden atlama', 'zincirleme atlama', 'birdirbir oyunu', 'atlayıp eğilme', 'sırt üstünden atlama'] },
        { label: 'Mendil kapmaca', share: 0.4, aliases: ['mendil kapma', 'iki takım mendil', 'koşup kapma', 'mendil oyunu', 'hakem mendil', 'mendil kapmaca oynamak', 'iki takim mendil', 'kosup kapma', 'mendil kapmacası', 'ortadaki mendili kapma', 'mendili alıp kaçma', 'numarayla mendil kapma', 'mendil tutucu', 'karşılıklı mendil kapma', 'hızlı koşup mendil alma', 'mendil kapıp çizgiye kaçma', 'mendil yarışması', 'mendil kapmaca oyunu'] },
        { label: 'Dokuz taş', share: 0.2, aliases: ['dokuz tas', 'taş dizme', 'kule yıkma', 'yedi kule', 'kiremit yıkma', 'dokuz kiremit', 'tas dizme', 'kule yikma', 'kiremit yikma', '9 taş', '9 tas', 'dalye', 'yedi taş', 'yedi tas', 'taşları üst üste dizme', 'topla kule devirme', 'kiremit dizme oyunu', 'dokuz taş oyunu'] }
      ].sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['playstation', 'fifa', 'valorant'], reason: 'Bu dijital bir bilgisayar veya konsol oyunu.' },
        { aliases: ['pubg', 'minecraft', 'fortnite'], reason: 'Sokakta değil, ekran başında oynanan bir oyun.' },
        { aliases: ['okey', 'tavla', 'batak'], reason: 'Genelde kahvehane veya masa oyunu, çocuk sokak oyunu değil.' },
        { aliases: ['satranç', 'dama', 'monopoly'], reason: 'Bu masa başında oynanan bir kutu oyunu.' },
        { aliases: ['tenis', 'golf', 'bilardo'], reason: 'Özel saha veya salon gerektiren spor dalı.' },
        { aliases: ['poker', 'rulet'], reason: 'Çocuk sokak oyunu kategorisinde yer almaz.' }
      ],
      tests: [
        { in: 'Saklambaç', expect: 'Saklambaç' },
        { in: 'yakantop', expect: 'Yakan top' },
        { in: 'bilye', expect: 'Misket' },
        { in: 'playstation', expect: 'invalid' }
      ]
    },
    {
      id: 'q19',
      cat: 'yöre',
      text: 'Karadeniz denince akla gelen bir şey söyle',
      answers: [
        { label: 'Hamsi', share: 29.8, aliases: ['hamsi tava', 'hamsili pilav', 'balık hamsi', 'hamsi buğulama', 'taze hamsi', 'hamsisi', 'balik hamsi', 'hamsi bugulama', 'hamsi kuşu', 'hamsi kusu', 'hamsi köftesi', 'hamsi koftesi', 'kızarmış hamsi', 'kizarmis hamsi', 'mısır unlu hamsi', 'karadeniz hamsisi', 'fırında hamsi', 'hamsi ızgara'] },
        { label: 'Yayla', share: 12.2, aliases: ['yaylalar', 'yeşil yayla', 'pokut yaylası', 'elevit', 'yayla havası', 'yayla şenliği', 'yesil yayla', 'pokut yaylasi', 'yayla havasi', 'yayla senligi', 'gito yaylası', 'gito yaylasi', 'huser yaylası', 'sal yaylası', 'kümbet yaylası', 'perşembe yaylası', 'yayla evleri', 'karadeniz yaylaları'] },
        { label: 'Yağmur', share: 10.2, aliases: ['yagmur', 'sis', 'yağmurlu hava', 'sağanak', 'dört mevsim yağmur', 'ıslak hava', 'yagmurlu hava', 'saganak', 'dort mevsim yagmur', 'islak hava', 'sisli dağlar', 'sisli daglar', 'bulutlu hava', 'çiseleyen yağmur', 'yağışlı iklim', 'yagisli iklim', 'şemsiye', 'karadeniz yağmuru'] },
        { label: 'Çay', share: 9.6, aliases: ['cay', 'rize çayı', 'çay bahçesi', 'çay tarlası', 'çay toplamak', 'yeşil çay yaprağı', 'rize cayi', 'cay bahcesi', 'cay tarlasi', 'cay toplamak', 'yesil cay yapragi', 'çaykur', 'caykur', 'çay makası', 'cay makasi', 'çaylık', 'caylik', 'taze demlenmiş çay'] },
        { label: 'Horon', share: 8.0, aliases: ['horon tepmek', 'horon oynamak', 'dik horon', 'el ele horon', 'hızlı horon', 'karadeniz horonu', 'hizli horon', 'horon halkası', 'horon halkasi', 'atabarı', 'atabari', 'kolbastı', 'kolbasti', 'tulumla horon', 'kemençeyle horon', 'horon vurmak', 'alaçatı değil karadeniz horonu', 'horoncular'] },
        { label: 'Trabzon', share: 6.0, aliases: ['trabzon ili', 'sümela manastırı', 'sümela', 'sumela manastiri', 'sumela', 'boztepe', 'maçka', 'of ilçesi', 'trabzonspor', 'akçaabat', 'sürmene', 'vakfıkebir', 'atatürk köşkü', 'trabzon kalesi', 'trabzon ekmeği', 'uzungöl trabzon', 'hıdırnebi', 'trabzon limanı'] },
        { label: 'Uzungöl', share: 5.0, aliases: ['uzungol', 'göl manzarası', 'trabzon uzungöl', 'çamlı göl', 'uzungölü', 'yayla gölü', 'gol manzarasi', 'trabzon uzungol', 'camli gol', 'uzungolu', 'yayla golu', 'çaykara uzungöl', 'caykara uzungol', 'borçka karagöl', 'borcka karagol', 'karagöl', 'sera gölü', 'uzungöl tabiat parkı'] },
        { label: 'Kemençe', share: 4.0, aliases: ['kemence', 'karadeniz tulum', 'karadeniz müziği', 'kemençe çalmak', 'tulum çalmak', 'kemençesi', 'karadeniz muzigi', 'kemence calmak', 'tulum calmak', 'kemencesi', 'karadeniz türküsü', 'karadeniz turkusu', 'kemençe sesi', 'kemence sesi', 'tulum sesi', 'yaylı kemençe', 'kemençeci', 'tulumcu'] },
        { label: 'Fındık', share: 3.4, aliases: ['findik', 'giresun fındığı', 'ordu fındığı', 'fındık bahçesi', 'fındık toplamak', 'kavrulmuş fındık', 'giresun findigi', 'ordu findigi', 'findik bahcesi', 'findik toplamak', 'kavrulmus findik', 'fındık ezmesi', 'findik ezmesi', 'fındık harmanı', 'findik harmani', 'yağlı fındık', 'çotanak', 'cotanak'] },
        { label: 'Yeşillik / orman', share: 2.8, aliases: ['yeşil doğa', 'orman', 'dağlar', 'çam ağaçları', 'doğa', 'yemyeşil', 'yesillik', 'yesil doga', 'daglar', 'cam agaclari', 'doga', 'yemyesil', 'yeşil dağlar', 'yesil daglar', 'gür ormanlar', 'ladin ağaçları', 'fırtına deresi', 'firtina deresi'] },
        { label: 'Pide', share: 2.2, aliases: ['karadeniz pidesi', 'trabzon pidesi', 'kavurmalı pide', 'peynirli pide', 'yumurtalı pide', 'uzun pide', 'kavurmali pide', 'yumurtali pide', 'bafra pidesi', 'samsun pidesi', 'giresun pidesi', 'kapalı pide', 'kapali pide', 'kıymalı karadeniz pidesi', 'tereyağlı pide', 'yuvarlak trabzon pidesi', 'taş fırın pidesi', 'acık pide'] },
        { label: 'Ayder', share: 1.8, aliases: ['ayder yaylası', 'rize ayder', 'kaplıca', 'ayder şelalesi', 'kaçkar', 'çamlıhemşin', 'ayder yaylasi', 'kaplica', 'ayder selalesi', 'kackar', 'camlihemsin', 'kaçkar dağları', 'kackar daglari', 'zilkale', 'palovit şelalesi', 'gelintülü şelalesi', 'ayder kaplıcaları', 'hemşin'] },
        { label: 'Laz böreği', share: 1.5, aliases: ['laz boregi', 'karadeniz tatlısı', 'muhallebili börek', 'şerbetli laz böreği', 'sütlü börek', 'laz böreği tatlısı', 'karadeniz tatlisi', 'muhallebili borek', 'serbetli laz boregi', 'sutlu borek', 'laz boregi tatlisi', 'hopa laz böreği', 'karabiberli laz böreği', 'artvin laz böreği', 'rize laz böreği', 'yufkalı muhallebi', 'şerbetli muhallebi böreği', 'çıtır laz böreği'] },
        { label: 'Karalahana', share: 1.2, aliases: ['kara lahana', 'karalahana çorbası', 'karalahana sarması', 'pancar çorbası', 'lahana sarması', 'karadeniz lahanası', 'karalahana corbasi', 'karalahana sarmasi', 'pancar corbasi', 'lahana sarmasi', 'karadeniz lahanasi', 'karalahana dolması', 'karalahana dolmasi', 'etli karalahana sarması', 'mısırlı karalahana çorbası', 'karalahana dible', 'lahana çorbası', 'kara lahana yemeği'] },
        { label: 'Temel fıkraları', share: 0.9, aliases: ['temel fıkrası adı', 'temel dursun', 'temel ile dursun', 'fadime fıkrası', 'karadeniz fıkrası', 'karadeniz şivesi', 'karadeniz fikrasi', 'karadeniz sivesi', 'temel fıkrası', 'temel fikrasi', 'temel fadime dursun', 'temel ve idris', 'uy uşağum', 'uy usagum', 'haçan uşağum', 'hacan usagum', 'da eki', 'laz fıkraları'] },
        { label: 'Mısır ekmeği', share: 0.7, aliases: ['misir ekmegi', 'mısır unu', 'sarı ekmek', 'yoğurtlu mısır ekmeği', 'fırın mısır ekmeği', 'karadeniz ekmeği', 'misir unu', 'sari ekmek', 'yogurtlu misir ekmegi', 'firin misir ekmegi', 'karadeniz ekmegi', 'sıcak mısır ekmeği', 'sicak misir ekmegi', 'yoğurda doğranan mısır ekmeği', 'köy mısır ekmeği', 'sacda mısır ekmeği', 'gugul mısır ekmeği', 'tavada mısır ekmeği'] },
        { label: 'Kuymak', share: 0.5, aliases: ['mıhlama', 'muhlama', 'tereyağlı kuymak', 'peynirli mıhlama', 'karadeniz kahvaltısı', 'uzayan peynir', 'mihlama', 'tereyagli kuymak', 'peynirli mihlama', 'karadeniz kahvaltisi', 'kolot peynirli kuymak', 'mısır unlu kuymak', 'trabzon kuymağı', 'rize mıhlaması', 'bakır tavada kuymak', 'sıcak kuymak', 'kuymak peyniri', 'tellı peynir kuymak'] },
        { label: 'Heyelan', share: 0.3, aliases: ['toprak kayması', 'sel', 'dere taşması', 'dik yamaç', 'heyelan bölgesi', 'sel baskını', 'toprak kaymasi', 'dere tasmasi', 'dik yamac', 'heyelan bolgesi', 'sel baskini', 'yamaçtan toprak kayması', 'yol kapanması heyelan', 'uçurum', 'sarp dağlar', 'dik yokuşlar', 'heyelan tehlikesi', 'taş düşmesi'] }
      ].sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['kebap', 'baklava', 'gaziantep'], reason: 'Bu Güneydoğu Anadolu yöresine ait bir simge.' },
        { aliases: ['zeytin', 'efes', 'izmir'], reason: 'Bu Ege bölgesinin öne çıkan değerlerinden.' },
        { aliases: ['çöl', 'kaktüs', 'deve'], reason: 'Yağışlı ve yeşil Karadeniz iklimiyle ilgisi yok.' },
        { aliases: ['kapadokya', 'peri bacaları'], reason: 'Bu İç Anadolu bölgesinde yer alan bir yer.' },
        { aliases: ['pamukkale', 'travertenler'], reason: 'Bu Ege bölgesine ait bir doğal güzellik.' },
        { aliases: ['tantuni', 'şalgam'], reason: 'Bu Akdeniz bölgesinin meşhur lezzetlerinden.' }
      ],
      tests: [
        { in: 'Hamsi', expect: 'Hamsi' },
        { in: 'kemence', expect: 'Kemençe' },
        { in: 'mıhlama', expect: 'Kuymak' },
        { in: 'kapadokya', expect: 'invalid' }
      ]
    },
    {
      id: 'q20',
      cat: 'teknoloji',
      text: 'Telefonda en çok kullanılan bir uygulama söyle',
      answers: [
        { label: 'WhatsApp', share: 35.4, aliases: ['whatsapp', 'vatsap', 'whatsup', 'whatsap', 'mesajlaşma', 'yeşil uygulama', 'mesajlasma', 'yesil uygulama', 'wp uygulaması', 'watsap', 'vatsap uygulaması', 'whatsapp mesaj', 'whatsapp arama', 'whatsapp durum', 'whatsapp grubu', 'görüntülü konuşma whatsapp', 'mesaj uygulaması', 'wattsap'] },
        { label: 'Instagram', share: 21.6, aliases: ['insta', 'instagrama', 'instagrm', 'reels', 'hikaye uygulaması', 'instgram', 'hikaye uygulamasi', 'ig uygulaması', 'ınstagram', 'story uygulaması', 'instagram reels', 'dm kutusu', 'instagram keşfet', 'instagram kesfet', 'fotoğraf paylaşma uygulaması', 'insta story', 'instagram hikaye', 'instaya girmek'] },
        { label: 'YouTube', share: 12.0, aliases: ['youtub', 'yutub', 'video izleme', 'youtube shorts', 'kırmızı video', 'youtube music', 'kirmizi video', 'yutup', 'yt video', 'youtube premium', 'youtube video', 'video uygulaması', 'video uygulamasi', 'youtube kanalı', 'youtubeda video izlemek', 'şarkı video youtube', 'yutuba girmek', 'youtube uygulaması'] },
        { label: 'TikTok', share: 9.0, aliases: ['tik tok', 'tiktoka', 'kısa video', 'fyp', 'tiktok canlı', 'tiktok izleme', 'kisa video', 'tiktok canli', 'tiktok videoları', 'tiktok videolari', 'keşfet tiktok', 'tiktok akımları', 'musical ly', 'tiktok yayını', 'tiktok kaydırmak', 'tiktok uygulaması', 'tiktokta gezmek', 'tik tok uygulaması'] },
        { label: 'Google / Chrome', share: 4.4, aliases: ['google', 'chrome', 'tarayıcı', 'internet', 'arama motoru', 'safari', 'tarayici', 'google chrome', 'gugıl', 'gugil', 'opera', 'firefox', 'brave', 'yandex browser', 'google arama', 'internete girmek', 'web tarayıcı', 'google uygulaması'] },
        { label: 'X / Twitter', share: 3.8, aliases: ['twitter', 'tviter', 'twit', 'gündem uygulaması', 'x app', 'mavi kuş', 'gundem uygulamasi', 'mavi kus', 'x uygulaması', 'x uygulamasi', 'tivitır', 'tivitir', 'tweet', 'tt listesi', 'twitter gündem', 'x sosyal medya', 'retweet', 'twittera bakmak'] },
        { label: 'Spotify', share: 3.0, aliases: ['müzik uygulaması', 'spotfy', 'şarkı dinleme', 'podcast', 'müzik listesi', 'yeşil müzik', 'muzik uygulamasi', 'sarki dinleme', 'yesil muzik', 'spotifay', 'spoti', 'spotify premium', 'müzik dinleme uygulaması', 'çalma listesi', 'calma listesi', 'apple music', 'fizy', 'muud'] },
        { label: 'Trendyol', share: 2.4, aliases: ['alışveriş uygulaması', 'trendyolmilla', 'alışveriş sepeti', 'kargo takip', 'indirim uygulaması', 'turuncu alışveriş', 'alisveris uygulamasi', 'indirim uygulamasi', 'turuncu alisveris', 'hepsiburada', 'amazon alışveriş', 'trendyol go', 'online alışveriş', 'online alisveris', 'trendyol hızlı market', 'trendyola bakmak', 'çiçeksepeti', 'n11'] },
        { label: 'Haritalar', share: 2.0, aliases: ['google maps', 'yandex', 'navigasyon', 'yol tarifi', 'harita', 'maps', 'yandex navigasyon', 'apple haritalar', 'apple maps', 'konum uygulaması', 'konum uygulamasi', 'google haritalar', 'harita uygulaması', 'yol bulma', 'trafik yoğunluğu harita', 'navigasyon açmak', 'konum atmak', 'yandex maps'] },
        { label: 'Banka uygulamaları', share: 1.6, aliases: ['mobil bankacılık', 'garanti', 'akbank', 'ziraat', 'işcep', 'enpara', 'mobil bankacilik', 'iscep', 'ziraat mobil', 'yapı kredi mobil', 'yapi kredi mobil', 'vakıfbank mobil', 'halkbank mobil', 'qnb finansbank', 'papara', 'iban para gönderme', 'fast havale', 'banka uygulaması'] },
        { label: 'Facebook', share: 1.3, aliases: ['face', 'feysbuk', 'mavi f', 'facebooka', 'eski sosyal medya', 'gruplar', 'feys', 'facebook uygulaması', 'facebook uygulamasi', 'facebook grupları', 'messenger', 'facebook messenger', 'facebook marketplace', 'feysbuka girmek', 'arkadaş ekleme facebook', 'meta facebook', 'facebook video', 'feysbuk uygulaması'] },
        { label: 'Sahibinden', share: 1.2, aliases: ['ikinci el', 'ilan sitesi', 'araba ilanı', 'ev ilanı', 'sarı site', 'sahibinden com', 'araba ilani', 'ev ilani', 'sari site', 'letgo', 'dolap uygulaması', 'gardrops', 'kiralık ev ilanı', 'satılık araba ilanı', 'sarı uygulama', 'sari uygulama', 'emlak araba uygulaması', 'sahibindene bakmak'] },
        { label: 'Telegram', share: 0.9, aliases: ['telgram', 'telegrame', 'mavi uçak', 'kanallar', 'gizli sohbet', 'telegrama', 'mavi ucak', 'telegram kanalları', 'telegram kanallari', 'telegram grubu', 'telegram mesaj', 'kağıt uçak uygulaması', 'telegram uygulaması', 'telegram uygulamasi', 'bip', 'signal', 'telegram sohbet', 'telegram bot'] },
        { label: 'Hesap makinesi', share: 0.7, aliases: ['hesap yapma', 'toplama çıkarma', 'hesapla', 'calculator', 'rakam hesaplama', 'hesap makinası', 'toplama cikarma', 'hesap makinasi', 'hesaplama uygulaması', 'hesaplama uygulamasi', 'çarpma bölme', 'carpma bolme', 'matematik hesap', 'telefonda hesap makinesi', 'yüzde hesaplama', 'para hesaplama', 'dört işlem', 'hesap makinesi açmak'] },
        { label: 'e-Devlet', share: 0.5, aliases: ['edevlet', 'e devlet', 'resmi işlemler', 'ikametgah', 'turkiye gov', 'devlet kapısı', 'resmi islem', 'devlet kapisi', 'e devlet kapısı', 'e devlet kapisi', 'mhrs', 'e nabız', 'e nabiz', 'adli sicil kaydı', 'sgk hizmet dökümü', 'turkiye gov tr', 'edevlet uygulaması', 'uyap'] },
        { label: 'Yemeksepeti', share: 0.3, aliases: ['yemek sepeti', 'yemek siparişi', 'getir yemek', 'trendyol yemek', 'online yemek', 'yemek kuryesi', 'yemek siparisi', 'getir yemeksepeti', 'migros yemek', 'migros hemen', 'eve yemek söylemek', 'yemek uygulaması', 'yemek uygulamasi', 'paket servis uygulaması', 'yemeksepeti mahalle', 'banabi', 'yemek sipariş uygulaması', 'acıktım uygulaması'] }
      ].map(function (a, i) {
        if (i === 11) a.share = 1.1;
        if (i === 10) a.share = 1.3;
        return a;
      }).sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['buzdolabı', 'çamaşır makinesi'], reason: 'Bu bir telefon uygulaması değil, ev eşyası.' },
        { aliases: ['kaşık', 'çatal', 'tabak'], reason: 'Mutfak gereci; dijital bir uygulama değil.' },
        { aliases: ['otobüs', 'vapur', 'metro'], reason: 'Ulaşım aracı; telefon uygulaması adı değil.' },
        { aliases: ['kalem', 'defter', 'silgi'], reason: 'Kırtasiye malzemesi, mobil uygulama değil.' },
        { aliases: ['çay', 'kahve', 'simit'], reason: 'Yiyecek ya da içecek; telefon uygulaması değil.' },
        { aliases: ['windows 98', 'ms dos'], reason: 'Eski masaüstü işletim sistemi, güncel telefon uygulaması değil.' }
      ],
      tests: [
        { in: 'WhatsApp', expect: 'WhatsApp' },
        { in: 'vatsap', expect: 'WhatsApp' },
        { in: 'edevlet', expect: 'e-Devlet' },
        { in: 'buzdolabı', expect: 'invalid' }
      ]
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
