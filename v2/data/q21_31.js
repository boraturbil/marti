(function (root) {
  'use strict';
  root.QUESTIONS = root.QUESTIONS || [];
  root.QUESTIONS.push(
    {
      id: 'q21',
      cat: 'iş',
      text: 'Geç kalınca söylenen bir bahane söyle',
      answers: [
        { label: 'Trafik vardı', share: 33.8, aliases: ['trafik', 'yol tıkalıydı', 'köprü trafiği', 'kaza olmuş', 'yollar kapalıydı', 'trafikte kaldım', 'trafik vardi', 'yol tikaliydi', 'kopru trafigi', 'kaza olmus', 'yollar kapaliydi', 'trafikte kaldim', 'yol kapalıydı', 'trafik kilitlendi', 'trafik çok yoğundu', 'trafik cok yogundu', 'yol tıkalı', 'kaza vardı', 'araba trafiği', 'trafik açılmadı'] },
        { label: 'Alarm çalmadı', share: 21.8, aliases: ['alarm calmadi', 'uyuyakaldım', 'saat çalmadı', 'telefonun şarjı bitmiş', 'uyanamadım', 'alarmı duymadım', 'alarm çalmadı', 'uyuyakaldim', 'saat calmadi', 'uyanamadim', 'alarmi duymadim', 'telefon kapandı', 'telefonun sarji bitmis', 'alarm kurmayı unutmuşum', 'alarmı kapattım', 'uyandım ama kalkamadım', 'saatim çalmadı', 'uyku tuttu'] },
        { label: 'Otobüsü kaçırdım', share: 12.0, aliases: ['otobusu kacirdim', 'otobüs gelmedi', 'dolmuş dolu geçti', 'araç bozuldu', 'otobüs geç kaldı', 'otobüse binemedim', 'otobüsü kaçırdım', 'otobus gelmedi', 'dolmus dolu gecti', 'otobus gec kaldi', 'otobuse binemedim', 'otobüs çok doluydu', 'dolmuş geçmedi', 'minibüsü kaçırdım', 'minibüs gelmedi', 'durakta bekledim', 'sefer iptal olmuş', 'otobüs erken geçti'] },
        { label: 'Rahatsızlandım', share: 7.2, aliases: ['hastalandım', 'midem bulandı', 'başım ağrıdı', 'kendimi iyi hissetmedim', 'doktora uğradım', 'hasta oldum', 'rahatsizlandim', 'hastalandim', 'midem bulandi', 'basim agrisi', 'basim agriyordu', 'ateşim çıktı', 'üşütmüşüm', 'eczaneye uğradım', 'acil servise gittim', 'tansiyonum düştü', 'mide ağrısı', 'hasta oldum evde'] },
        { label: 'Metro arızalandı', share: 6.0, aliases: ['metro arizalandi', 'marmaray durdu', 'metrobüs bozuldu', 'tramvay gecikti', 'raylarda arıza', 'metro çalışmadı', 'metro arızalandı', 'metrobus bozuldu', 'metro calismadi', 'metro durdu', 'marmaray arızalandı', 'marmaray gecikti', 'metrobus arizalandi', 'metroda arıza vardı', 'tren gecikti', 'tren arızalandı', 'raylı sistem durdu', 'metro seferi iptal'] },
        { label: 'Yağmur yağıyordu', share: 4.2, aliases: ['yagmur yagiyordu', 'fırtına vardı', 'hava çok kötüydü', 'kar yağdı', 'yollar kaygandı', 'sel vardı', 'yağmur yağıyordu', 'firtina vardi', 'hava cok kotuydu', 'kar yagdi', 'yollar kaygandi', 'sel vardi', 'sağanak yağmur', 'saganak yagmur', 'yağmurdan çıkamadım', 'kar yolları kapattı', 'dolu yağdı', 'fırtınaya yakalandım'] },
        { label: 'Anahtarı unuttum', share: 3.2, aliases: ['anahtari unuttum', 'kapıda kaldım', 'anahtar içeride kaldı', 'kilidi açamadım', 'çilingir bekledim', 'anahtarı bulamadım', 'anahtarı unuttum', 'kapida kaldim', 'anahtar iceride kaldi', 'kilidi acamadim', 'cilingir bekledim', 'anahtari bulamadim', 'kapı kilitli kaldı', 'anahtarı kaybettim', 'evden çıkamadım anahtar', 'kilit bozuldu', 'anahtar kırıldı', 'ev kapısı açılmadı'] },
        { label: 'Çocuk hastalandı', share: 2.6, aliases: ['çocuğu okula bıraktım', 'ailevi bir iş', 'acil bir iş çıktı', 'evde sorun çıktı', 'annemi doktora götürdüm', 'acil durum', 'cocuk hastalandi', 'çocuk hastalandı', 'cocugu okula biraktim', 'ailevi bir is', 'acil bir is cikti', 'evde sorun cikti', 'annemi doktora goturdum', 'çocuğum hastalandı', 'ailede acil durum', 'babamı hastaneye götürdüm', 'çocuğu kreşe bıraktım', 'evden acil çıktım'] },
        { label: 'Lastik patladı', share: 2.2, aliases: ['araba çalışmadı', 'akü bitti', 'araç arızalandı', 'tamirci bekledim', 'yakıt bitti', 'teker patladı', 'lastik patladi', 'araba calismadi', 'aku bitti', 'arac arizalandi', 'yakit bitti', 'araba bozuldu', 'arabanın lastiği patladı', 'çekici bekledim', 'benzin bitti', 'motor arızası', 'lastiğim indi', 'stepne taktım'] },
        { label: 'Yanlış yola girdim', share: 1.8, aliases: ['yanlis yola girdim', 'yolu karıştırdım', 'navigasyon yanılttı', 'ters yöne bindim', 'durağı kaçırdım', 'kayboldum', 'yanlış yola girdim', 'yolu karistirdim', 'navigasyon yaniltti', 'ters yone bindim', 'duragi kacirdim', 'yanlış durağa indim', 'harita yanlış gösterdi', 'yolu şaşırdım', 'yolu sasirdim', 'yanlış otobüse bindim', 'yanlış metroya bindim', 'ters yöne gittim'] },
        { label: 'Kıyafet bulamadım', share: 1.4, aliases: ['kiyafet bulamadim', 'ütü yaptım', 'gömleğim kirlendi', 'kahve döküldü', 'hazırlanamadım', 'duş aldım', 'kıyafet bulamadım', 'utu yaptim', 'gomlegim kirlendi', 'kahve dokuldu', 'hazirlanamadim', 'dus aldim', 'üstüme kahve döküldü', 'gömlek ütüledim', 'ne giyeceğimi bilemedim', 'kıyafetim ıslandı', 'pantolonum yırtıldı', 'ayakkabım koptu'] },
        { label: 'Kurye bekledim', share: 1.0, aliases: ['kargo bekledim', 'tamirci geldi', 'tesisatçı bekledim', 'kapıcı geldi', 'paket teslimi', 'kurye gecikti', 'kurye bekledim', 'tesisatci bekledim', 'kargocu geldi', 'kargo teslimatı', 'usta bekledim', 'doğalgazcı geldi', 'internet teknik servis', 'kargoyu bekledim', 'kapıya kargo geldi', 'su tesisatçısı geldi', 'servis bekledim', 'kargo geç geldi'] },
        { label: 'Kedim hastalandı', share: 0.8, aliases: ['kedim hastalandi', 'köpeğim kaçtı', 'veterinere gittim', 'kedi yavruladı', 'köpeği gezdirdim', 'evcil hayvan', 'kedim hastalandı', 'kopegim kacti', 'kopegi gezdirdim', 'veterinerdeydim', 'kediyi veterinere götürdüm', 'köpeğim hastalandı', 'kedi hasta oldu', 'kuşum hastalandı', 'evcil hayvanım hastalandı', 'köpeği veterinere götürdüm', 'kedim evden kaçtı', 'hayvan hastalandı'] },
        { label: 'Vapur kalkmıştı', share: 0.6, aliases: ['vapur kalkmisti', 'vapuru kaçırdım', 'feribot iptal oldu', 'sis yüzünden sefer yok', 'iskelede kaldım', 'tekne gecikti', 'vapur kalkmıştı', 'vapuru kacirdim', 'sis yuzunden sefer yok', 'iskelede kaldim', 'vapur seferi iptal', 'deniz otobüsü iptal', 'ido iptal oldu', 'lodos yüzünden vapur yok', 'motoru kaçırdım', 'vapur geç geldi', 'feribotu kaçırdım', 'deniz ulaşımı durdu'] },
        { label: 'Asansörde kaldım', share: 0.4, aliases: ['asansorde kaldim', 'asansör bozuldu', 'kapı açılmadı', 'apartmanda mahsur', 'asansör arızası', 'kilitli kaldım', 'asansörde kaldım', 'asansor bozuldu', 'kapi acilmadi', 'asansor arizasi', 'kilitli kaldim', 'asansör durdu', 'asansörde mahsur kaldım', 'asansor durdu', 'asansör kapısı açılmadı', 'asansörcü bekledim', 'apartman asansörü bozuldu', 'asansörde sıkıştım'] },
        { label: 'Elektrikler kesildi', share: 0.2, aliases: ['elektrik kesintisi', 'şarjım bitti', 'su kesildi', 'kombi bozuldu', 'elektrik yoktu', 'karanlıkta kaldım', 'elektrikler kesildi', 'elektrikler kesikti', 'sarjim bitti', 'karanlikta kaldim', 'sular kesikti', 'sular kesildi', 'su yoktu', 'elektrikler gitti', 'ışıklar gitti', 'isiklar gitti', 'internet koptu', 'internet kesildi', 'elektrik kesildi', 'su kesintisi'] },
        { label: 'Polis çevirmesi', share: 0.8, aliases: ['çevirme vardı', 'kimlik kontrolü', 'trafik polisi', 'denetim vardı', 'yol kontrolü', 'radar çevirmesi', 'polis cevirmesi', 'cevirme vardi', 'kimlik kontrolu', 'denetim vardi', 'yol kontrolu', 'radar cevirmesi', 'polis durdurdu', 'gbt kontrolü', 'ehliyet kontrolü', 'polis kontrolü', 'trafik çevirmesi', 'jandarma çevirmesi'] }
      ].map(function (a, i) {
        if (i === 16) a.share = 1.2;
        if (i === 11) a.share = 1.0;
        return a;
      }).sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['erken geldim', 'zamanında çıktım'], reason: 'Bu geç kalma bahanesi değil, vaktinde gelme durumu.' },
        { aliases: ['canım istemedi', 'keyfimden'], reason: 'Bu gerçek bir bahane değil, doğrudan itiraf.' },
        { aliases: ['işi bıraktım', 'istifa ettim'], reason: 'Bu geç kalma açıklaması değil.' },
        { aliases: ['maaş az', 'zam istiyorum'], reason: 'Geç kalma sebebiyle ilgisiz bir konu.' },
        { aliases: ['tatildeyim', 'izinliyim'], reason: 'İzinli olunca zaten işe geç kalınmış sayılmaz.' },
        { aliases: ['uzaylılar kaçırdı', 'ejderha saldırdı'], reason: 'Gerçek hayatta söylenen mantıklı bir bahane yaz.' }
      ],
      tests: [
        { in: 'Trafik vardı', expect: 'Trafik vardı' },
        { in: 'uyuyakaldım', expect: 'Alarm çalmadı' },
        { in: 'asansörde kaldım', expect: 'Asansörde kaldım' },
        { in: 'tatildeyim', expect: 'invalid' }
      ]
    },
    {
      id: 'q22',
      cat: 'yemek',
      text: 'Tatlı hariç bir Türk yemeği söyle',
      answers: [
        { label: 'Kebap', share: 18.0, aliases: ['adana kebap', 'urfa kebap', 'şiş kebap', 'patlıcan kebabı', 'beyti', 'cağ kebabı', 'kebap', 'adana kebabı', 'urfa kebabı', 'sis kebap', 'patlican kebabi', 'cag kebabi', 'beyti kebap', 'ali nazik', 'alinazik', 'kuzu şiş', 'tavuk şiş', 'tas kebabı', 'orman kebabı', 'kebaplar'] },
        { label: 'Döner', share: 14.0, aliases: ['doner', 'et döner', 'tavuk döner', 'dürüm döner', 'yaprak döner', 'ekmek arası döner', 'et doner', 'tavuk doner', 'durum doner', 'yaprak doner', 'ekmek arasi doner', 'döner kebap', 'pilav üstü döner', 'gobit döner', 'tombik döner', 'porsiyon döner', 'döner dürüm', 'hatay döner'] },
        { label: 'Mantı', share: 11.0, aliases: ['manti', 'kayseri mantısı', 'yoğurtlu mantı', 'sarımsaklı mantı', 'tepsi mantısı', 'çıtır mantı', 'kayseri mantisi', 'yogurtlu manti', 'sarimsakli manti', 'tepsi mantisi', 'citir manti', 'el açması mantı', 'ev mantısı', 'sinop mantısı', 'hingel', 'sosyete mantısı', 'mantısı', 'mantılar'] },
        { label: 'Lahmacun', share: 10.0, aliases: ['lahmacun ayran', 'acılı lahmacun', 'fındık lahmacun', 'antep lahmacunu', 'çıtır lahmacun', 'lahmacunu', 'acili lahmacun', 'findik lahmacun', 'antep lahmacun', 'citir lahmacun', 'acısız lahmacun', 'taş fırın lahmacun', 'lahmacunlar', 'ev lahmacunu', 'urfa lahmacunu', 'sumaklı lahmacun', 'bol acılı lahmacun', 'ince hamur lahmacun'] },
        { label: 'Kuru fasulye', share: 9.0, aliases: ['kuru pilav', 'fasulye', 'etli kuru fasulye', 'kuru fasülye', 'ispir fasulyesi', 'kuru', 'kuru fasulyesi', 'kuru fasulye pilav', 'pastırmalı kuru fasulye', 'sucuklu kuru fasulye', 'güveçte kuru fasulye', 'kurufasulye', 'kuru fasülye pilav', 'fasülye', 'etli kuru', 'kuru pilav turşu', 'çayeli kuru fasulyesi', 'kuru fasulyem'] },
        { label: 'İskender', share: 7.0, aliases: ['iskender kebap', 'bursa iskender', 'tereyağlı iskender', 'yoğurtlu iskender', 'uludağ kebabı', 'iskenderi', 'iskender kebabi', 'tereyagli iskender', 'yogurtlu iskender', 'uludag kebabi', 'bursa iskenderi', 'döner iskender', 'bol tereyağlı iskender', 'pideli iskender', 'soslu iskender', 'et iskender', 'tavuk iskender', 'iskenderci'] },
        { label: 'Karnıyarık', share: 6.0, aliases: ['karniyarik', 'kıymalı patlıcan', 'imambayıldı', 'patlıcan yemeği', 'karnıyarık pilav', 'karnıyarığı', 'kiymali patlican', 'imambayildi', 'patlican yemegi', 'karniyarik pilav', 'karniyarigi', 'fırında karnıyarık', 'zeytinyağlı imambayıldı', 'karnıyarıklar', 'patlıcan karnıyarık', 'ev usulü karnıyarık', 'domatesli karnıyarık', 'biberli karnıyarık'] },
        { label: 'Dolma / sarma', share: 5.4, aliases: ['yaprak sarma', 'zeytinyağlı sarma', 'biber dolması', 'sarma', 'dolma', 'lahana sarması', 'zeytinyagli sarma', 'biber dolmasi', 'lahana sarmasi', 'yaprak sarması', 'etli sarma', 'etli dolma', 'zeytinyağlı dolma', 'kabak dolması', 'patlıcan dolması', 'kuru dolma', 'vişneli sarma', 'kalem sarma'] },
        { label: 'Köfte', share: 4.8, aliases: ['kofte', 'ızgara köfte', 'inegöl köfte', 'akçaabat köfte', 'tekirdağ köftesi', 'anne köftesi', 'izgara kofte', 'inegol kofte', 'akcaabat kofte', 'tekirdag koftesi', 'anne koftesi', 'sulu köfte', 'ekmek arası köfte', 'kasap köfte', 'izmir köfte', 'kadınbudu köfte', 'köftesi', 'köfteler'] },
        { label: 'Pilav', share: 4.0, aliases: ['pirinç pilavı', 'bulgur pilavı', 'tavuklu pilav', 'nohutlu pilav', 'şehriyeli pilav', 'tereyağlı pilav', 'pirinc pilavi', 'bulgur pilavi', 'tavuklu pilav ustu', 'nohutlu pilavi', 'sehriyeli pilav', 'tereyagli pilav', 'pirinç pilav', 'meyhane pilavı', 'domatesli pilav', 'iç pilav', 'sade pilav', 'pilavı'] },
        { label: 'Pide', share: 3.4, aliases: ['kıymalı pide', 'kaşarlı pide', 'kuşbaşılı pide', 'karadeniz pidesi', 'sucuklu pide', 'açık pide', 'kiymali pide', 'kasarli pide', 'kusbasili pide', 'karadeniz pidesi sicak', 'pastırmalı pide', 'acik pide', 'kapalı pide', 'konya etli ekmek', 'etli ekmek', 'yumurtalı pide', 'kavurmalı pide', 'pidesi'] },
        { label: 'İçli köfte', share: 2.6, aliases: ['icli kofte', 'haşlama içli köfte', 'kızartma içli köfte', 'antep içli köfte', 'oruk', 'bulgurlu köfte', 'haslama icli kofte', 'kizartma icli kofte', 'antep icli kofte', 'bulgurlu kofte', 'kızarmış içli köfte', 'haşlanmış içli köfte', 'malatya içli köfte', 'adana içli köfte', 'cevizli içli köfte', 'içli köftesi', 'içli köfteler', 'kıymalı içli köfte'] },
        { label: 'Çiğ köfte', share: 2.0, aliases: ['cig kofte', 'etsiz çiğ köfte', 'çiğ köfte dürüm', 'acılı çiğ köfte', 'adıyaman çiğ köfte', 'marullu çiğ köfte', 'etsiz cig kofte', 'cig kofte durum', 'acili cig kofte', 'adiyaman cig kofte', 'marullu cig kofte', 'etli çiğ köfte', 'urfa çiğ köfte', 'nar ekşili çiğ köfte', 'lavaşlı çiğ köfte', 'çiğköfte', 'cigkofte', 'çiğ köftesi'] },
        { label: 'Kokoreç', share: 1.0, aliases: ['kokorec', 'yarım ekmek kokoreç', 'izmir kokoreç', 'kuzu kokoreç', 'sebzesiz kokoreç', 'kokoreçi', 'yarim ekmek kokorec', 'izmir kokorec', 'kuzu kokorec', 'sebzesiz kokorec', 'kokoreci', 'istanbul kokoreç', 'sebzeli kokoreç', 'çeyrek kokoreç', 'tam ekmek kokoreç', 'kokoreççi', 'atom kokoreç', 'süt kuzu kokoreç'] },
        { label: 'Tantuni', share: 0.8, aliases: ['mersin tantuni', 'et tantuni', 'tavuk tantuni', 'yoğurtlu tantuni', 'lavaş tantuni', 'tantunisi', 'mersin tantunisi', 'yogurtlu tantuni', 'lavas tantuni', 'ekmek arası tantuni', 'somun tantuni', 'çift lavaş tantuni', 'acılı tantuni', 'biftek tantuni', 'tantuni dürüm', 'sumaklı tantuni', 'tantunici', 'tantuniler'] },
        { label: 'Hünkarbeğendi', share: 0.6, aliases: ['hunkarbegendi', 'hünkar beğendi', 'patlıcan beğendi', 'beğendili kebap', 'saray yemeği', 'etli beğendi', 'hunkar begendi', 'patlican begendi', 'begendili kebap', 'saray yemegi', 'etli begendi', 'beğendili et', 'patlıcanlı hünkarbeğendi', 'tas kebap beğendi', 'hünkar beğendisi', 'kaşarlı beğendi', 'beğendi', 'begendi'] },
        { label: 'Keşkek', share: 0.4, aliases: ['keskek', 'düğün keşkeği', 'buğday keşkeği', 'tavuklu keşkek', 'etli keşkek', 'keşkeği', 'dugun keskegi', 'bugday keskegi', 'tavuklu keskek', 'etli keskek', 'keskegi', 'dövme keşkek', 'yarma keşkek', 'bayram keşkeği', 'tereyağlı keşkek', 'salçalı keşkek', 'ege keşkeği', 'keşkek yemeği'] }
      ].sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['baklava', 'künefe', 'sütlaç'], reason: 'Soru tatlı hariç yemek istiyor, bu bir tatlı.' },
        { aliases: ['pizza', 'hamburger', 'suşi'], reason: 'Bu yabancı mutfağa ait bir yemek.' },
        { aliases: ['makarna', 'spagetti', 'lazanya'], reason: 'Bu İtalyan mutfağı kökenli bir yemek.' },
        { aliases: ['taco', 'burrito', 'noodles'], reason: 'Geleneksel Türk yemeği değil.' },
        { aliases: ['çay', 'ayran', 'şalgam'], reason: 'Bu yemek değil, içecek.' },
        { aliases: ['kazandibi', 'güllaç', 'lokma'], reason: 'Tatlılar bu soruda hariç tutuluyor.' }
      ],
      tests: [
        { in: 'Kebap', expect: 'Kebap' },
        { in: 'yaprak sarma', expect: 'Dolma / sarma' },
        { in: 'hunkarbegendi', expect: 'Hünkarbeğendi' },
        { in: 'baklava', expect: 'invalid' }
      ]
    },
    {
      id: 'q23',
      cat: 'dil',
      text: 'Bir Türk atasözü söyle',
      answers: [
        { label: 'Damlaya damlaya göl olur', share: 18.2, aliases: ['damlaya damlaya gol olur', 'damlaya damlaya', 'birikim atasözü', 'azdan çok olur', 'damla damla göl', 'damlaya damlaya göl', 'damlaya damlaya gol', 'damla damla gol', 'damlaya damlaya olur', 'damla damla göl olur', 'birikim atasozu', 'damlaya damlaya göl olr', 'damlaya damlaya gölü', 'göl olur damlaya', 'azdan cok olur', 'az az birikir'] },
        { label: 'Sakla samanı gelir zamanı', share: 12.4, aliases: ['sakla samani gelir zamani', 'sakla samanı', 'gelir zamanı', 'samanı sakla', 'lazım olur', 'sakla samani', 'gelir zamani', 'samani sakla', 'lazim olur', 'sakla samanı zamanı gelir', 'samanı sakla gelir zamanı', 'sakla samani zamani gelir', 'tutumlu olmak atasözü', 'günü gelir lazım olur', 'sakla samanı bir gün', 'saman sakla'] },
        { label: 'Ağaç yaşken eğilir', share: 10.4, aliases: ['agac yasken egilir', 'ağaç yaş iken eğilir', 'yaşken eğilir', 'ağaç yaşken', 'çocukluktan eğitim', 'agac yas iken', 'agac yasken', 'yasken egilir', 'agac yas iken egilir', 'ağaç yaş iken', 'cocukluktan egitim', 'küçükken eğitilir', 'ağaç yaşken eğilr', 'yaşken eğilir ağaç', 'ağacı yaşken eğmek', 'eğitim yaşken'] },
        { label: 'Bugünün işini bırakma', share: 9.8, aliases: ['bugünün işini yarına bırakma', 'bugunun isini yarina birakma', 'bugünün işi yarına', 'yarına bırakma', 'işini yarına bırakma', 'bugunun isini', 'bugunun isi yarina', 'yarina birakma', 'isini yarina birakma', 'bugünün işini yarına', 'işi yarına bırakma', 'isi yarina birakma', 'bugünün işi', 'yarına iş bırakma', 'bugün yap yarına bırakma', 'erteleme atasözü'] },
        { label: 'Komşu komşunun külüne', share: 6.4, aliases: ['komşu komşunun külüne muhtaçtır', 'komsu komsunun kulune muhtactir', 'komşunun külüne muhtaçtır', 'komşu külüne muhtaç', 'komşuluk atasözü', 'külüne muhtaçtır', 'komsunun kulune muhtactir', 'komsu kulune muhtac', 'komsuluk atasozu', 'kulune muhtactir', 'komşu komşunun', 'komsu komsunun', 'komşunun külüne', 'komşu külüne', 'külüne muhtaç', 'komşu komşuya muhtaç'] },
        { label: 'Sabrın sonu selamettir', share: 5.8, aliases: ['sabrin sonu selamettir', 'sabrın sonu selamet', 'sabır selamettir', 'sabreden derviş', 'sabır taşı', 'sabrin sonu', 'sabrin sonu selamet', 'sabir selamettir', 'sabreden dervis', 'sabir tasi', 'sabırın sonu selamettir', 'sabrin sonu selametir', 'sabretmek selamettir', 'sabır selamet', 'sabreden muradına erer', 'sonu selamet'] },
        { label: 'Dost kara günde belli', share: 5.2, aliases: ['dost kara günde belli olur', 'dost kara gunde belli olur', 'kara günde belli olur', 'iyi günde kötü günde', 'gerçek dost', 'dost kara günde', 'kara gunde belli olur', 'iyi gunde kotu gunde', 'gercek dost', 'dost kara gunde', 'kara günde belli', 'dost kötü günde belli olur', 'dost kara günde belli olurmuş', 'kötü günde dost', 'kara gunde belli', 'gerçek dost kara günde'] },
        { label: 'Üzüm üzüme baka baka', share: 4.8, aliases: ['üzüm üzüme baka baka kararır', 'uzum uzume baka baka kararir', 'üzüm üzüme', 'baka baka kararır', 'uzum uzume', 'arkadaşlık atasözü', 'uzum uzume baka baka', 'baka baka kararir', 'arkadaslik atasozu', 'üzüm üzüme baka baka kararır mı', 'üzüm üzüme bakar', 'baka baka kararır üzüm', 'kötü arkadaş bozar', 'üzüm üzüme bakarak', 'kararır üzüm', 'üzüm üzüm'] },
        { label: 'Acele işe şeytan karışır', share: 4.4, aliases: ['acele ise seytan karisir', 'acele işe şeytan', 'hızlı giden çabuk yorulur', 'sabırsız iş', 'acele giden ecele gider', 'acele iş', 'acele ise seytan', 'hizli giden cabuk yorulur', 'sabirsiz is', 'acele is', 'acele işe şeytan karışırmış', 'aceleyle iş olmaz', 'şeytan karışır', 'seytan karisir', 'acele işten hayır gelmez', 'acele eden yorulur'] },
        { label: 'Ne ekersen onu biçersin', share: 4.0, aliases: ['ne ekersen onu bicersin', 'ne ekersen', 'onu biçersin', 'ektiğini biçersin', 'iyilik yapan iyilik bulur', 'ne ekersen onu', 'onu bicersin', 'ektigini bicersin', 'ne ekersen onu biçer', 'ne ekerseniz onu biçersiniz', 'ektiğini biçmek', 'ne ekersek onu biçeriz', 'bicersin', 'ekersen biçersin', 'ne ekersen onu bicer', 'ektiğini biç'] },
        { label: 'Gülü seven dikenine', share: 3.6, aliases: ['gülü seven dikenine katlanır', 'gulu seven dikenine katlanir', 'dikenine katlanır', 'gülü seven', 'katlanır dikenine', 'gül ve diken', 'dikenine katlanir', 'gulu seven', 'katlanir dikenine', 'gul ve diken', 'gülü seven dikenine katlanırmış', 'gül dikenine katlanır', 'sevince katlanılır', 'dikenine katlanmak', 'gülü seven diken', 'katlanır'] },
        { label: 'Taşıma su ile değirmen', share: 3.2, aliases: ['taşıma su ile değirmen dönmez', 'tasima su ile degirmen donmez', 'taşıma suyla değirmen', 'değirmen dönmez', 'taşıma su', 'tasima suyla', 'tasima su ile degirmen', 'degirmen donmez', 'tasima su', 'taşıma suyla değirmen dönmez', 'tasima suyla degirmen donmez', 'su ile değirmen dönmez', 'taşıma su değirmen', 'kalıcı çözüm atasözü', 'başkasının desteğiyle', 'değirmen dönmez taşıma'] },
        { label: 'Ayağını yorganına göre', share: 2.8, aliases: ['ayağını yorganına göre uzat', 'ayagini yorganina gore uzat', 'yorganına göre uzat', 'ayağını yorganına', 'hesabını bilmek', 'ayagini yorganina', 'yorganina gore uzat', 'hesabini bilmek', 'ayağını yorganına göre uzatacaksın', 'yorganına göre uzat ayağını', 'ayağı yorgana göre', 'bütçene göre harca', 'yorgana göre uzat', 'ayağını yorgana göre', 'yorganına göre', 'ayagini yorgana gore'] },
        { label: 'Bin bilsen bir bilene', share: 2.4, aliases: ['bin bilsen de bir bilene danış', 'bin bilsen de bir bilene danis', 'bir bilene danış', 'danışan dağları aşmış', 'bin bilsen de', 'bilene danış', 'bir bilene danis', 'danisan daglari asmis', 'bilene danis', 'bin bilsen de bir bilene', 'danışan dağları aşar', 'bilene danışmak', 'bin bilsen', 'bir bilene', 'bilene sor', 'danışan dağları'] },
        { label: 'İşleyen demir pas tutmaz', share: 2.0, aliases: ['isleyen demir pas tutmaz', 'işleyen demir ışıldar', 'pas tutmaz', 'çalışan paslanmaz', 'isleyen demir', 'demir pas tutmaz', 'isleyen demir isildar', 'calisan paslanmaz', 'çalışan demir pas tutmaz', 'işleyen demir ışıldarmış', 'demir ışıldar', 'işleyen demir paslanmaz', 'tembellik paslandırır', 'çalışmak pas tutmaz', 'demir paslanmaz', 'işleyen demir'] },
        { label: 'Azıcık aşım kaygısız başım', share: 1.0, aliases: ['azicik asim kaygisiz basim', 'azıcık aşım ağrısız başım', 'kaygısız başım', 'azıcık aşım', 'ağrısız başım', 'azicik asim', 'azicik asim agrisiz basim', 'kaygisiz basim', 'agrisiz basim', 'azıcık aş', 'kaygısız baş', 'ağrısız baş', 'az aşım kaygısız başım', 'kanaat atasözü', 'azla yetinmek', 'azicik as'] },
        { label: 'Keskin sirke küpüne zarar', share: 0.8, aliases: ['keskin sirke kupune zarar', 'sirke küpüne zarar', 'keskin sirke', 'öfke ile kalkan', 'küpüne zarar', 'keskin sirke kupune', 'sirke kupune zarar', 'ofke ile kalkan', 'kupune zarar', 'öfkeyle kalkan zararla oturur', 'keskin sirke küpüne', 'sirke küpüne zarar verir', 'öfke kendine zarar', 'küpüne zarar verir', 'sirke küpü', 'keskin sirke kup'] },
        { label: 'Mum dibine ışık vermez', share: 0.6, aliases: ['mum dibine isik vermez', 'mum dibine', 'kendi dibine ışık', 'terzi kendi söküğünü', 'ışık vermez', 'mum dibine isik', 'isik vermez', 'kendi dibine isik', 'terzi kendi sokugunu', 'terzi kendi söküğünü dikemez', 'mum dibine ışımaz', 'dibine ışık vermez', 'mum kendi dibini aydınlatmaz', 'ışık vermez dibine', 'kendi söküğünü', 'mum dibine isik vermezmis'] },
        { label: 'Söz gümüşse sükut altın', share: 0.4, aliases: ['soz gumusse sukut altindir', 'söz gümüşse sükut altındır', 'sükut altındır', 'susmak altındır', 'söz gümüş', 'az konuşmak', 'soz gumusse sukut altin', 'sukut altindir', 'susmak altindir', 'soz gumus', 'az konusmak', 'söz gümüş sükut altın', 'sükut altındır söz gümüşse', 'susmak en iyisi', 'söz gümüşse susmak altın', 'sükut altın'] },
        { label: 'Yalnız taş duvar olmaz', share: 1.8, aliases: ['yalniz tas duvar olmaz', 'bir elin nesi var', 'iki elin sesi var', 'yalnız taş', 'taş duvar olmaz', 'birlikten kuvvet doğar', 'yalniz tas', 'tas duvar olmaz', 'birlikten kuvvet dogar', 'yalnız taştan duvar olmaz', 'tek taş duvar olmaz', 'dayanışma atasözü', 'birlik beraberlik atasözü', 'tek başına olmaz', 'yalniz tastan duvar olmaz', 'bir elin nesi'] }
      ].sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['günaydın', 'iyi akşamlar'], reason: 'Bu atasözü değil, günlük selamlaşma.' },
        { aliases: ['çay içelim', 'hava güzel'], reason: 'Bu sıradan bir cümle, atasözü değil.' },
        { aliases: ['ne mutlu türküm diyene', 'yurtta sulh'], reason: 'Bu özdeyiş, anonim halk atasözü değil.' },
        { aliases: ['üşüteceksin', 'odanı topla'], reason: 'Bu anne sözü, atasözü kalıbı değil.' },
        { aliases: ['inecek var', 'müsait bir yerde'], reason: 'Bu dolmuş ifadesi, atasözü değil.' },
        { aliases: ['her şeye rağmen', 'hayat kısa'], reason: 'Tek başına kalıplaşmış bir Türk atasözü sayılmaz.' }
      ],
      tests: [
        { in: 'Damlaya damlaya göl olur', expect: 'Damlaya damlaya göl olur' },
        { in: 'agac yasken egilir', expect: 'Ağaç yaşken eğilir' },
        { in: 'sükut altındır', expect: 'Söz gümüşse sükut altın' },
        { in: 'günaydın', expect: 'invalid' }
      ]
    },
    {
      id: 'q24',
      cat: 'gelenek',
      text: 'İftar sofrasında olan bir şey söyle',
      answers: [
        { label: 'Hurma', share: 26.0, aliases: ['medine hurması', 'kudüs hurması', 'top hurması', 'hurmayla açmak', 'kuru hurma', 'hurması', 'hurma', 'medine hurmasi', 'kudus hurmasi', 'top hurmasi', 'hurmayla acmak', 'yaş hurma', 'taze hurma', 'hurmalar', 'iftar hurması', 'acve hurması', 'cevizli hurma'] },
        { label: 'Ramazan pidesi', share: 22.0, aliases: ['pide', 'sıcak pide', 'susamlı pide', 'yumurtalı pide', 'fırın pidesi', 'tırnak pide', 'ramazan pidesi', 'sicak pide', 'susamli pide', 'yumurtali pide', 'firin pidesi', 'tirnak pide', 'pide kuyruğu', 'pide ekmeği', 'iftar pidesi', 'taze pide', 'çörek otlu pide', 'pidesi'] },
        { label: 'Çorba', share: 16.0, aliases: ['corba', 'mercimek çorbası', 'ezogelin çorbası', 'tarhana çorbası', 'yayla çorbası', 'sıcak çorba', 'mercimek corbasi', 'ezogelin corbasi', 'tarhana corbasi', 'yayla corbasi', 'sicak corba', 'şehriye çorbası', 'domates çorbası', 'işkembe çorbası', 'tavuk çorbası', 'çorbası', 'bir kase çorba', 'iftar çorbası'] },
        { label: 'Zeytin', share: 6.2, aliases: ['siyah zeytin', 'yeşil zeytin', 'zeytinle açmak', 'kırma zeytin', 'kahvaltılık zeytin', 'zeytini', 'zeytin', 'yesil zeytin', 'zeytinle acmak', 'kirma zeytin', 'kahvaltilik zeytin', 'zeytin tabağı', 'selef zeytin', 'gemlik zeytini', 'zeytinler', 'iftariyelik zeytin', 'biberli zeytin', 'zeytinle'] },
        { label: 'Peynir', share: 5.4, aliases: ['beyaz peynir', 'kaşar peyniri', 'tulum peyniri', 'iftariyelik peynir', 'peynir tabağı', 'ezine', 'peynir', 'kasar peyniri', 'peynir tabagi', 'lor peyniri', 'örgü peynir', 'çökelek', 'ezine peyniri', 'peyniri', 'kaşar', 'taze kaşar', 'eski kaşar', 'iftarlık peynir'] },
        { label: 'Güllaç', share: 4.8, aliases: ['gullac', 'cevizli güllaç', 'narlı güllaç', 'sütlü güllaç', 'ramazan tatlısı', 'güllacı', 'cevizli gullac', 'narli gullac', 'sutlu gullac', 'ramazan tatlisi', 'gullaci', 'fıstıklı güllaç', 'gül sulu güllaç', 'güllaç tatlısı', 'ev yapımı güllaç', 'soğuk güllaç', 'güllaç yaprağı', 'güllac'] },
        { label: 'Su', share: 4.2, aliases: ['soğuk su', 'bir bardak su', 'suyla açmak', 'sürahi su', 'zemzem', 'içme suyu', 'soguk su', 'suyla acmak', 'surahi su', 'icme suyu', 'sürahi', 'zemzem suyu', 'ılık su', 'su şişesi', 'bardakta su', 'oruç açma suyu', 'temiz su', 'suyu'] },
        { label: 'Hoşaf', share: 3.6, aliases: ['hosaf', 'komposto', 'üzüm hoşafı', 'kayısı hoşafı', 'erik hoşafı', 'soğuk hoşaf', 'uzum hosafi', 'kayisi hosafi', 'erik hosafi', 'soguk hosaf', 'vişne hoşafı', 'elma kompostosu', 'şeftali kompostosu', 'kuru üzüm hoşafı', 'kuru kayısı hoşafı', 'hoşafı', 'kompostosu', 'meyve hoşafı'] },
        { label: 'Pastırma', share: 3.0, aliases: ['pastirma', 'kayseri pastırması', 'iftariyelik pastırma', 'çemenli pastırma', 'kayseri pastirmasi', 'iftariyelik pastirma', 'cemenli pastirma', 'çemensiz pastırma', 'pastırması', 'dilim pastırma', 'antrikot pastırma', 'dana pastırma', 'pastırmalı', 'pastırma tabağı', 'yağsız pastırma', 'sırt pastırma', 'özel pastırma', 'kayseri pastirma'] },
        { label: 'Ana yemek', share: 2.4, aliases: ['et yemeği', 'kavurma', 'etli yemek', 'tavuk yemeği', 'kuru fasulye', 'pilav', 'ana yemek', 'et yemegi', 'etli yemekler', 'tavuk yemegi', 'sulu yemek', 'tas kebabı', 'köfte pilav', 'tepsi kebabı', 'karnıyarık', 'hünkarbeğendi', 'güveç', 'tencere yemeği'] },
        { label: 'Börek', share: 2.0, aliases: ['borek', 'su böreği', 'sigara böreği', 'tepsi böreği', 'peynirli börek', 'kıymalı börek', 'su boregi', 'sigara boregi', 'tepsi boregi', 'peynirli borek', 'kiymali borek', 'patatesli börek', 'ıspanaklı börek', 'kol böreği', 'muska böreği', 'böreği', 'sıcak börek', 'ev böreği'] },
        { label: 'Salata', share: 1.6, aliases: ['çoban salata', 'mevsim salata', 'cacık', 'yeşillik', 'marul salatası', 'domates salatalık', 'salata', 'coban salata', 'cacik', 'yesillik', 'marul salatasi', 'domates salatalik', 'çoban salatası', 'yeşil salata', 'göbek salata', 'gavurdağı salatası', 'salatası', 'söğüş'] },
        { label: 'Şerbet', share: 1.0, aliases: ['serbet', 'ramazan şerbeti', 'demirhindi şerbeti', 'osmanlı şerbeti', 'reyhan şerbeti', 'gül şerbeti', 'ramazan serbeti', 'demirhindi serbeti', 'osmanli serbeti', 'reyhan serbeti', 'gul serbeti', 'lohusa şerbeti', 'kızılcık şerbeti', 'vişne şerbeti', 'soğuk şerbet', 'şerbeti', 'tarçınlı şerbet', 'karanfilli şerbet'] },
        { label: 'Çay', share: 0.8, aliases: ['cay', 'iftar sonrası çay', 'demli çay', 'semaver çayı', 'ince belli çay', 'sıcak çay', 'iftar sonrasi cay', 'demli cay', 'semaver cayi', 'ince belli cay', 'sicak cay', 'tavşan kanı çay', 'çaydanlık', 'siyah çay', 'türk çayı', 'bir bardak çay', 'demlik çay', 'çayı'] },
        { label: 'Mercimek köftesi', share: 0.6, aliases: ['mercimek koftesi', 'mercimek kofte', 'mercimek köfte', 'kırmızı mercimek köftesi', 'kirmizi mercimek koftesi', 'limonlu mercimek köftesi', 'marullu mercimek köftesi', 'ev yapımı mercimek köftesi', 'nar ekşili mercimek köftesi', 'anne mercimek köftesi', 'iftarlık mercimek köftesi', 'mercimek köftesi tabağı', 'yeşillikli mercimek köftesi', 'salçalı mercimek köftesi', 'taze soğanlı mercimek köftesi', 'sıcak mercimek köftesi'] },
        { label: 'Baklava', share: 0.4, aliases: ['fıstıklı baklava', 'cevizli baklava', 'baklava', 'fistikli baklava', 'baklavası', 'ev baklavası', 'antep baklavası', 'soğuk baklava', 'sütlü nuriye', 'kuru baklava', 'kare baklava', 'dilim baklava', 'şerbetli baklava', 'bayram baklavası', 'tepsi baklava', 'fıstık sarma baklava'] }
      ].sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['hamburger', 'patates kızartması'], reason: 'Geleneksel iftar sofrası öğesi değil.' },
        { aliases: ['bira', 'şarap', 'rakı'], reason: 'Ramazan iftar sofrasında alkollü içecek yer almaz.' },
        { aliases: ['kahvaltılık gevrek', 'müsli'], reason: 'İftar sofrasına özgü geleneksel bir lezzet değil.' },
        { aliases: ['dondurma', 'milkshake'], reason: 'Klasik iftar sofrası yiyeceği değil.' },
        { aliases: ['cips', 'kraker'], reason: 'İftar sofrasında ana öğün veya iftariyelik sayılmaz.' },
        { aliases: ['sushi', 'noodle'], reason: 'Uzak Doğu mutfağı; geleneksel Türk iftarında bulunmaz.' }
      ],
      tests: [
        { in: 'Hurma', expect: 'Hurma' },
        { in: 'top hurması', expect: 'Hurma' },
        { in: 'komposto', expect: 'Hoşaf' },
        { in: 'bira', expect: 'invalid' }
      ]
    },
    {
      id: 'q25',
      cat: 'ev',
      text: 'Evde sık kaybolan bir şey söyle',
      answers: [
        { label: 'Kumanda', share: 33.6, aliases: ['tv kumandası', 'televizyon kumandası', 'klima kumandası', 'uzaktan kumanda', 'kumandayı', 'kumandası', 'kumanda', 'tv kumandasi', 'televizyon kumandasi', 'klima kumandasi', 'kumandayi', 'kumandasi', 'uydu kumandası', 'kumandam', 'tv kumandası kayboldu', 'kumandalar', 'akıllı kumanda', 'kumandam kayıp'] },
        { label: 'Anahtar', share: 22.0, aliases: ['ev anahtarı', 'araba anahtarı', 'anahtarlık', 'kapı anahtarı', 'yedek anahtar', 'anahtarı', 'anahtar', 'ev anahtari', 'araba anahtari', 'anahtarlik', 'kapi anahtari', 'anahtari', 'anahtarım', 'ev anahtarım', 'dış kapı anahtarı', 'anahtarlar', 'yedek anahtarım', 'anahtar kayboldu'] },
        { label: 'Telefon', share: 10.2, aliases: ['cep telefonu', 'telefonum', 'akıllı telefon', 'iphone', 'telefonu', 'mobil telefon', 'telefon', 'akilli telefon', 'telefonum kayboldu', 'mobil', 'akıllı cep', 'android telefon', 'telefonlar', 'cep tel', 'telefon cihazı', 'ev telefonu', 'cep', 'telefonumu bulamıyorum'] },
        { label: 'Çorap teki', share: 9.6, aliases: ['corap teki', 'çorap', 'tek çorap', 'çorabın teki', 'çoraplar', 'çorabı', 'corap', 'tek corap', 'corabin teki', 'coraplar', 'corabi', 'diğer çorap', 'çorabın diğer teki', 'çorap tekleri', 'çift çorabın teki', 'bir tek çorap', 'makinede kaybolan çorap', 'çorabım'] },
        { label: 'Şarj aleti', share: 6.0, aliases: ['sarj aleti', 'şarj kablosu', 'adaptör', 'kablo', 'telefon şarjı', 'powerbank', 'sarj kablosu', 'adaptor', 'telefon sarji', 'şarj', 'sarj', 'şarj başlığı', 'usb kablo', 'type c kablo', 'hızlı şarj', 'şarj aletim', 'telefon kablosu', 'şarj cihazı'] },
        { label: 'Gözlük', share: 5.0, aliases: ['gozluk', 'okuma gözlüğü', 'güneş gözlüğü', 'numaralı gözlük', 'gözlüğüm', 'lens kabı', 'okuma gozlugu', 'gunes gozlugu', 'numarali gozluk', 'gozlugum', 'lens kabi', 'gözlük kabı', 'gözlüğüm nerede', 'gözlüğü', 'yakın gözlüğü', 'uzak gözlüğü', 'gözlükler', 'dinlendirici gözlük'] },
        { label: 'Toka', share: 3.2, aliases: ['saç tokası', 'tel toka', 'lastik toka', 'mandal toka', 'tokalar', 'siyah toka', 'toka', 'sac tokasi', 'tokalarım', 'saç lastiği', 'kıskaç toka', 'firkete', 'tokam', 'küçük toka', 'büyük toka', 'tel tokalar', 'saç tokaları', 'lastik tokalar'] },
        { label: 'Çakmak', share: 2.6, aliases: ['cakmak', 'zippo', 'mutfak çakmağı', 'kibrit', 'ocağı yakacak', 'çakmağı', 'mutfak cakmagi', 'ocagi yakacak', 'cakmagi', 'çakmağım', 'gazlı çakmak', 'manyetolu çakmak', 'ocak çakmağı', 'çakmaklar', 'uzun çakmak', 'bic çakmak', 'kibrit kutusu', 'çakmağımız'] },
        { label: 'Cüzdan', share: 2.0, aliases: ['cuzdan', 'kartlık', 'bozuk para', 'kartlik', 'cüzdanım', 'cüzdanı', 'para cüzdanı', 'erkek cüzdanı', 'kadın cüzdanı', 'kart cüzdanı', 'bozuk para kesesi', 'cüzdanlar', 'deri cüzdan', 'siyah cüzdan', 'cüzdanımı bulamıyorum', 'para kesesi', 'küçük cüzdan', 'cüzdanım kayboldu', 'deri cüzdanım', 'para cüzdan', 'cüzdanım nerede', 'cuzdanim nerede'] },
        { label: 'Kulaklık', share: 1.6, aliases: ['kulaklik', 'airpods', 'kulaklık teki', 'bluetooth kulaklık', 'kulaklık kutusu', 'kulaklığı', 'kulaklik teki', 'bluetooth kulaklik', 'kulaklik kutusu', 'kulakligi', 'kulaklığım', 'kablolu kulaklık', 'kablosuz kulaklık', 'tek kulaklık', 'kulak içi kulaklık', 'airpod', 'kulaklıklar', 'sağ kulaklık'] },
        { label: 'Kalem', share: 1.2, aliases: ['tükenmez kalem', 'kurşun kalem', 'silgi', 'kalemlik', 'not kalemi', 'kalemi', 'kalem', 'tukenmez kalem', 'kursun kalem', 'kurşun kalemim', 'tükenmez', 'uçlu kalem', 'kalemim', 'kalemler', 'kırmızı kalem', 'pilot kalem', 'mavi kalem', 'yazı kalemi'] },
        { label: 'Makas', share: 1.0, aliases: ['mutfak makası', 'kağıt makası', 'küçük makas', 'dikiş makası', 'makası', 'terzi makası ucu', 'makas', 'mutfak makasi', 'kagit makasi', 'kucuk makas', 'dikis makasi', 'makasi', 'makasım', 'kağıt makas', 'el işi makası', 'makaslar', 'büyük makas', 'terzi makası'] },
        { label: 'Tırnak makası', share: 0.8, aliases: ['tirnak makasi', 'törpü', 'cımbız', 'manikür seti', 'tırnak kesici', 'makası tırnak', 'torpu', 'cimbiz', 'manikur seti', 'tirnak kesici', 'makasi tirnak', 'tırnak makasım', 'tırnak makasını', 'ayak tırnak makası', 'küçük tırnak makası', 'tırnak törpüsü', 'tırnak makasları', 'manikür makası'] },
        { label: 'İğne / iplik', share: 0.6, aliases: ['iğne', 'dikiş iğnesi', 'çengelli iğne', 'toplu iğne', 'düğme', 'iplik', 'igne', 'dikis ignesi', 'cengelli igne', 'toplu igne', 'dugme', 'iğne iplik', 'igne iplik', 'yorgan iğnesi', 'dikiş ipliği', 'iplik makarası', 'iğneler', 'iğne iplik kutusu'] },
        { label: 'Kapak', share: 0.4, aliases: ['saklama kabı kapağı', 'tencere kapağı', 'şişe kapağı', 'kalem kapağı', 'kavanoz kapağı', 'plastik kapak', 'kapak', 'saklama kabi kapagi', 'tencere kapagi', 'sise kapagi', 'kalem kapagi', 'kavanoz kapagi', 'saklama kabı kapağını', 'tupperware kapağı', 'kapaklar', 'kapağı', 'kavanoz kapağını', 'kapak kayıp'] },
        { label: 'Pena', share: 0.2, aliases: ['gitar penası', 'penam', 'mızrap', 'elektro gitar penası', 'plastik pena', 'penalar', 'pena', 'gitar penasi', 'mizrap', 'elektro gitar penasi', 'gitar penam', 'bağlama tezene', 'tezene', 'penası', 'penayı', 'akustik gitar penası', 'pena kayboldu', 'pena kayıp'] }
      ].sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['buzdolabı', 'çamaşır makinesi'], reason: 'Büyük beyaz eşyalar evde yerinden kaybolmaz.' },
        { aliases: ['koltuk', 'kanepe', 'yatak'], reason: 'Büyük mobilyalar evin içinde kaybolacak şeyler değil.' },
        { aliases: ['televizyon', 'gardırop'], reason: 'Sabit duran büyük ev eşyaları kaybolmaz.' },
        { aliases: ['mutfak tezgahı', 'lavabo'], reason: 'Evin sabit parçaları kaybolmaz.' },
        { aliases: ['halı', 'perde'], reason: 'Göz önünde duran büyük eşyalar genelde kaybolmaz.' },
        { aliases: ['pencere', 'kapı'], reason: 'Yapı elemanları kaybolan eşyalardan değil.' }
      ],
      tests: [
        { in: 'Kumanda', expect: 'Kumanda' },
        { in: 'corap teki', expect: 'Çorap teki' },
        { in: 'tirnak makasi', expect: 'Tırnak makası' },
        { in: 'buzdolabı', expect: 'invalid' }
      ]
    },
    {
      id: 'q26',
      cat: 'kültür',
      text: 'Bir Türk komedi filmi söyle',
      answers: [
        { label: 'Hababam Sınıfı', share: 26.5, aliases: ['hababam sinifi', 'inek şaban', 'mahmut hoca', 'hababam', 'kel mahmut', 'güdük necmi', 'hababam sinif', 'inek saban', 'guduk necmi', 'damat ferit', 'badi ekrem', 'hafize ana', 'kemal sunal hababam', 'hababam sınıfı uyanıyor', 'hababam sınıfı tatilde', 'özel çamlıca lisesi', 'hababam sınıfını', 'hababam filmi'] },
        { label: 'Recep İvedik', share: 16.5, aliases: ['recep ivedik', 'şahan gökbakar', 'recep ivedik komedi', 'ivedik', 'recep ivedik 2', 'bohohoyt', 'sahan gokbakar', 'recep ivedik 1', 'recep ivedik 3', 'recep ivedik 4', 'recep ivedik 5', 'recep ivedik 6', 'recep ivedik 7', 'agresifim kompleksliyim', 'nene recep', 'nurullah', 'zeynep recep ivedik', 'recep ivedik filmi'] },
        { label: 'G.O.R.A.', share: 14.5, aliases: ['gora', 'arif ışık', 'komutan logar', 'cem yılmaz gora', '216', 'ceku', 'g o r a', 'arif isik', 'cem yilmaz gora', 'gora filmi', 'garavel', 'bob marley faruk', 'erşan kuneri gora', 'kutsal taşlar', 'ateş su toprak tahta', 'gora gezegeni', 'logar', 'amerikan dublaj gora'] },
        { label: 'Vizontele', share: 8.4, aliases: ['vizontele tuuba', 'deli emin', 'yılmaz erdoğan', 'belediye başkanı nazmi', 'vizontele 1', 'tele vizyon', 'vizontele 2', 'yilmaz erdogan', 'belediye baskani nazmi', 'vizontele filmi', 'zeki alasya vizontele', 'cem yılmaz vizontele', 'vizontele deli emin', 'sitki vizontele', 'radyo televizyon', 'gevaş vizontele', 'vizontele tuuba filmi', 'deli emin vizontele'] },
        { label: 'Düğün Dernek', share: 6.0, aliases: ['dugun dernek', 'tüpçü fikret', 'düğün dernek ismail', 'ahmet kural', 'murat cemcir', 'düğün dernek 2', 'tupcu fikret', 'düğün dernek 1', 'dugun dernek 2', 'düğün dernek sünnet', 'sivas düğünü', 'düğün dernek tarık', 'düğün dernek çetin', 'ahmet kural murat cemcir', 'sünnet düğünü filmi', 'düğün dernek filmi', 'leyla düğün dernek', 'halay düğün dernek'] },
        { label: 'Neşeli Günler', share: 5.0, aliases: ['neseli gunler', 'turşucu kazım', 'limon mu sirke mi', 'adilenaşit', 'münir özkul', 'saadet hanım', 'tursucu kazim', 'munir ozkul', 'adile nasit', 'saadet hanim', 'turşu suyu', 'sirke mi limon mu', 'kazım efendi', 'ziya', 'şener şen ziya', 'jilet ziya', 'neşeli günler filmi', 'turşucu'] },
        { label: 'Tosun Paşa', share: 4.0, aliases: ['tosun pasa', 'tellioğulları', 'seferoğulları', 'yeşil vadi', 'hakiki tosun paşa', 'leyla tosun paşa', 'telliogullari', 'seferogullari', 'yesil vadi', 'şaban tosun paşa', 'bekir tosun paşa', 'davud tosun paşa', 'lütfü tosun paşa', 'küçük enişte', 'kucuk eniste', 'hakiki tosun pasa', 'tosun paşa filmi', 'kemal sunal tosun paşa'] },
        { label: 'Kolpaçino', share: 3.4, aliases: ['kolpacino', 'özgür kolpaçino', 'sabri abi', 'şafak sezer', 'kolpaçino bomba', 'ganyotçu', 'ozgur kolpacino', 'safak sezer', 'kolpacino bomba', 'ganyotcu', 'kolpaçino 3', 'kolpaçino 4', 'kolpaçino bir şehir efsanesi', 'ekrem abi', 'tayfun kolpaçino', 'galerici şahin', 'hedef ben miyim tayfun', 'kolpaçino filmi'] },
        { label: 'A.R.O.G', share: 3.0, aliases: ['arog', 'taş devri cem yılmaz', 'arif taş devrinde', 'kaaya', 'ceku arog', 'arog filmi', 'tas devri cem yilmaz', 'arif tas devrinde', 'arog 2', 'cem yılmaz arog', 'kuba', 'dimi', 'mimi', 'arif ışık arog', 'türk icadı futbol', 'komutan logar arog', 'taş devri filmi', 'a r o g'] },
        { label: 'Süt Kardeşler', share: 2.6, aliases: ['sut kardesler', 'gulyabani', 'şaban süt kardeşler', 'süt kardeşler ramazan', 'melek hanım', 'süt kardeşler bayram', 'saban sut kardesler', 'ramazan süt kardeşler', 'melek hanim', 'süt kardeşler şaban', 'damat süt kardeşler', 'şener şen süt kardeşler', 'kemal sunal süt kardeşler', 'halit akçatepe', 'süt kardeşler filmi', 'korkunç gulyabani', 'gulyabani filmi', 'sut kardesler filmi'] },
        { label: 'Yahşi Batı', share: 2.2, aliases: ['yahsi bati', 'aziz vefa', 'lütfi yahşi batı', 'kovboy cem yılmaz', 'yahşi', 'şerif lloyd', 'lutfi yahsi bati', 'kovboy cem yilmaz', 'yahsi', 'serif lloyd', 'cem yılmaz yahşi batı', 'osmanlı kovboy', 'aziz vefa yahşi batı', 'johnny lale', 'mary lou', 'suzanne', 'yahşi batı filmi', 'yahsi bati filmi'] },
        { label: 'Eyvah Eyvah', share: 1.8, aliases: ['eyvah eyvah', 'hüseyin badem', 'firuzan', 'ata demirer', 'klarnetçi hüseyin', 'geyikli', 'huseyin badem', 'klarnetci huseyin', 'eyvah eyvah 1', 'eyvah eyvah 2', 'eyvah eyvah 3', 'ata demirer eyvah eyvah', 'demet akbağ firuzan', 'bozcaada', 'müjgan', 'trakyalı hüseyin', 'eyvah eyvah filmi', 'eyvah eyvah 2 filmi'] },
        { label: 'Aile Arasında', share: 1.4, aliases: ['aile arasinda', 'fikret aile arasında', 'solmaz aile arasında', 'engin günaydın', 'gülse birsel', 'demet evgar', 'engin gunaydin', 'gulse birsel', 'adana aile arasında', 'mihriban aile arasında', 'neco aile arasında', 'emircan aile arasında', 'zeynep aile arasında', 'aile arasında filmi', 'aile arasinda filmi', 'adanalı aile', 'solmaz fikret', 'gülse birsel filmi'] },
        { label: 'Şabanoğlu Şaban', share: 1.0, aliases: ['sabanoglu saban', 'kumandan hüsamettin', 'nazır paşa', 'kadırgalı eşref', 'şaban asker', 'şabanoğlu elmas', 'kumandan husamettin', 'nazir pasa', 'kadirgali esref', 'saban asker', 'şabanoğlu şaban filmi', 'kemal sunal şabanoğlu', 'ramazan şabanoğlu', 'şabanoğlu selma', 'şabanoğlu bahriye', 'kadırgalı şabanoğlu', 'sabanoglu saban filmi', 'halit akçatepe şabanoğlu'] },
        { label: 'Davaro', share: 0.8, aliases: ['memo davaro filmi', 'kan davası', 'sülo davaro filmi', 'kemal sunal davaro', 'şener şen davaro', 'cano davaro filmi', 'kan davasi', 'sulo davaro', 'sener sen davaro', 'davaro filmi', 'memo davaro', 'sülo davaro', 'hıyar ağası', 'ağa davaro', 'kan davası filmi', 'kartal tibet davaro', 'cano davaro', 'davaro kemal sunal'] },
        { label: 'Organize İşler', share: 0.6, aliases: ['organize isler', 'asım noyan', 'süpermen samet', 'sazan sarmalı', 'tolga çevik', 'organize işler 2', 'asim noyan', 'supermen samet', 'sazan sarmali', 'tolga cevik', 'organize isler 2', 'yılmaz erdoğan organize işler', 'cem yılmaz müslüm', 'müslüm duralmaz', 'organize işler sazan sarmalı', 'kıvanç tatlıtuğ sarı saruhan', 'sarı saruhan', 'organize işler filmi'] },
        { label: 'Hokkabaz', share: 0.4, aliases: ['iskender tünaydın', 'maradona', 'sait bey', 'sihirbaz', 'mazhar alanson', 'cem yılmaz hokkabaz', 'iskender tunaydin', 'cem yilmaz hokkabaz', 'hokkabaz filmi', 'sihirbaz iskender', 'turne hokkabaz', 'fatma hokkabaz', 'özkan uğur hokkabaz', 'bursa turnesi', 'kaybolma numarası', 'baba oğul hokkabaz', 'mazhar alanson hokkabaz', 'hokkabaz cem yılmaz'] },
        { label: 'Arif v 216', share: 2.4, aliases: ['arif ve 216', '216 robot', 'pembe şeker', 'ajda pekkan filmi', 'zeki müren filmi', 'arif 216', 'arif v 216', 'pembe seker', 'arif v 216 filmi', 'zeki muren filmi', 'arif ve 216 filmi', 'cem yılmaz arif v 216', 'ozan güven 216', 'perihan savaş', 'yeşilçam robot', '60lar istanbul', 'erşan kuneri arif', 'sadri alışık filmi'] }
      ].map(function (a, i) {
        if (i === 17) a.share = 2.4;
        if (i === 10) a.share = 2.0;
        if (i === 11) a.share = 1.6;
        if (i === 12) a.share = 1.3;
        return a;
      }).sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['kurtlar vadisi', 'aşk-ı memnu', 'ezel'], reason: 'Bu bir sinema filmi değil, televizyon dizisi.' },
        { aliases: ['hangover', 'maske', 'home alone'], reason: 'Bu yabancı bir komedi filmi, Türk filmi değil.' },
        { aliases: ['ayla', 'babam ve oğlum', 'issız adam'], reason: 'Bu komedi değil, dram türünde bir Türk filmi.' },
        { aliases: ['dabbe', 'siccin'], reason: 'Bu komedi değil, korku filmi.' },
        { aliases: ['avrupa yakası', 'leyla ile mecnun'], reason: 'Bu komedi dizisi, sinema filmi değil.' },
        { aliases: ['titanik', 'avatar'], reason: 'Yabancı yapım film; Türk komedi filmi değil.' }
      ],
      tests: [
        { in: 'Hababam Sınıfı', expect: 'Hababam Sınıfı' },
        { in: 'gora', expect: 'G.O.R.A.' },
        { in: 'gulyabani', expect: 'Süt Kardeşler' },
        { in: 'kurtlar vadisi', expect: 'invalid' }
      ]
    },
    {
      id: 'q27',
      cat: 'gelenek',
      text: 'Bayram sabahı yapılan bir şey söyle',
      answers: [
        { label: 'El öpmek', share: 34.0, aliases: ['el opmek', 'büyüklerin elini öpmek', 'anne baba eli öpmek', 'dede eli öpmek', 'el öpme', 'bayramlaşmak', 'buyuklerin elini opmek', 'anne baba eli opmek', 'dede eli opmek', 'el opme', 'bayramlasmak', 'el öpüp hayır duası almak', 'anneannenin elini öpmek', 'babaannenin elini öpmek', 'büyüklerin elini öpmeye gitmek', 'bayramlaşma', 'el öptürmek', 'büyük eli öpmek'] },
        { label: 'Bayram namazı', share: 18.0, aliases: ['bayram namazi', 'camiye gitmek', 'namaz kılmak', 'sabah namazı', 'cemaatle namaz', 'camide bayramlaşma', 'sabah cami', 'namaz kilmak', 'sabah namazi', 'bayram namazi cemaat', 'camide bayramlasma', 'bayram namazına gitmek', 'bayram namazi kilmak', 'camide bayram namazı', 'sabah camiye gitmek', 'erkeklerin camiye gitmesi', 'hutbe dinlemek', 'namazdan çıkmak'] },
        { label: 'Şeker yemek', share: 10.0, aliases: ['seker yemek', 'çikolata yemek', 'lokum yemek', 'bayram şekeri', 'tatlı yemek', 'baklava yemek', 'cikolata yemek', 'şeker ikram etmek', 'bayram sekeri', 'tatli yemek', 'çikolata ikramı', 'şeker toplamak', 'seker toplamak', 'bayram çikolatası', 'şeker ikramı', 'şeker yemek bayramda', 'akide şekeri', 'madlen çikolata'] },
        { label: 'Harçlık almak', share: 9.0, aliases: ['harclik almak', 'harçlık toplamak', 'bayram harçlığı', 'para almak', 'harçlık vermek', 'cep harçlığı', 'harclik toplamak', 'bayram harcligi', 'harçlık istemek', 'harclik vermek', 'cep harcligi', 'harçlık', 'harclik', 'büyüklerden harçlık', 'bayram parası', 'harçlık biriktirmek', 'çocuklara harçlık', 'zarf içinde harçlık'] },
        { label: 'Yeni kıyafet giymek', share: 8.0, aliases: ['bayramlık giymek', 'bayramlik giymek', 'yeni elbise', 'şık giyinmek', 'yeni ayakkabı', 'bayramlık', 'yeni kiyafet giymek', 'sik giyinmek', 'yeni ayakkabi', 'bayramlıklar giymek', 'yeni kıyafet', 'yeni kiyafet', 'bayramlık kıyafet', 'en güzel kıyafeti giymek', 'temiz giyinmek', 'takım elbise giymek', 'bayramlık ayakkabı', 'bayramliklar'] },
        { label: 'Mezarlık ziyareti', share: 6.0, aliases: ['mezarlik ziyareti', 'kabristan ziyareti', 'mezarlığa gitmek', 'dua okumak', 'kabir ziyareti', 'fatiha okumak', 'mezarliga gitmek', 'mezarlığa gidip dua etmek', 'mezarlık', 'mezarlik', 'kabristana gitmek', 'vefat edenleri ziyaret', 'mezar sulamak', 'yasin okumak', 'dede mezarı', 'kabristan', 'kabristana', 'mezar ziyareti'] },
        { label: 'Bayram kahvaltısı', share: 5.0, aliases: ['bayram kahvaltisi', 'aile kahvaltısı', 'kahvaltı yapmak', 'kavurma yemek', 'büyük sofra', 'hep birlikte kahvaltı', 'aile kahvaltisi', 'kahvalti yapmak', 'buyuk sofra', 'hep birlikte kahvalti', 'sabah kahvaltısı', 'ailece kahvaltı', 'kalabalık kahvaltı', 'bayram sofrası', 'kahvaltı sofrası', 'sıcak poğaça kahvaltı', 'börekli kahvaltı', 'kahvaltı etmek'] },
        { label: 'Akraba ziyareti', share: 3.2, aliases: ['misafirliğe gitmek', 'büyükleri ziyaret', 'anneanne ziyaret', 'köye gitmek', 'komşu ziyareti', 'akraba gezmek', 'misafirlige gitmek', 'buyukleri ziyaret', 'koye gitmek', 'komsu ziyareti', 'akraba ziyareti', 'akrabalara gitmek', 'ziyarete gitmek', 'eş dost ziyareti', 'dedelere gitmek', 'kapı kapı gezmek', 'bayram ziyareti', 'akraba ziyaretleri'] },
        { label: 'Kahve içmek', share: 2.4, aliases: ['türk kahvesi', 'misafire kahve', 'çay kahve', 'sabah kahvesi', 'kahve ikramı', 'fincan kahve', 'turk kahvesi', 'cay kahve', 'bayramda kahve', 'kahve ikrami', 'kahve icmek', 'kahve pişirmek', 'bayram kahvesi', 'köpüklü kahve', 'şekerli kahve', 'orta kahve', 'kahve yapmak', 'türk kahvesi içmek'] },
        { label: 'Kolonya dökmek', share: 1.4, aliases: ['kolonya dokmek', 'kolonya tutmak', 'limon kolonyası', 'ikram hazırlamak', 'misafir karşılamak', 'kolonya sürmek', 'limon kolonyasi', 'ikram hazirlamak', 'misafir karsilamak', 'kolonya surmek', 'kolonya ikram etmek', 'kolonya', 'misafire kolonya', 'gül kolonyası', 'kolonya şişesi', 'kolonya şeker', 'el kolonyası', 'kolonya dökmek'] },
        { label: 'Kurban kesmek', share: 1.0, aliases: ['kurban', 'kurbanlık', 'kavurma yapmak', 'et dağıtmak', 'kurban bayramı', 'hisse kesmek', 'kurbanlik', 'et dagitmak', 'kurban bayrami', 'kurban kesimi', 'kurban eti', 'kurban payı', 'kurban kesmeye gitmek', 'kurbanlık kesmek', 'büyükbaş kurban', 'küçükbaş kurban', 'kurban kesmek', 'kurban kesimi yapmak'] },
        { label: 'Tatlı hazırlamak', share: 0.8, aliases: ['tatli hazirlamak', 'baklava açmak', 'tepsi hazırlamak', 'börek yapmak', 'sofra kurmak', 'ikramlık dizmek', 'baklava acmak', 'tepsi hazirlamak', 'borek yapmak', 'ikramlik dizmek', 'tatlı yapmak', 'ev baklavası', 'sarma sarmak', 'şerbetli tatlı', 'misafirlik hazırlığı', 'börek açmak', 'ikram hazırlığı', 'tatlı ikram etmek'] },
        { label: 'Telefonla bayramlaşmak', share: 0.6, aliases: ['telefonla aramak', 'mesaj atmak', 'bayram mesajı', 'uzaktakileri aramak', 'görüntülü aramak', 'sms atmak', 'bayram mesaji', 'goruntulu aramak', 'telefonla bayramlasmak', 'iyi bayramlar demek', 'hayırlı bayramlar mesajı', 'whatsapp mesajı', 'sesli aramak', 'uzaktaki akrabaları aramak', 'bayram tebriği', 'telefonla kutlamak', 'arayarak bayramlaşmak', 'mesajla bayramlaşmak'] },
        { label: 'Fotoğraf çekilmek', share: 0.4, aliases: ['aile fotoğrafı', 'bayram pozu', 'hatıra fotoğrafı', 'selfie çekmek', 'fotoğraf çektirmek', 'anıyı kaydetmek', 'aile fotografi', 'hatira fotografi', 'selfie cekmek', 'fotograf cektirmek', 'aniyi kaydetmek', 'fotoğraf çekmek', 'fotograf cekilmek', 'ailece fotoğraf', 'bayram hatırası', 'toplu fotoğraf', 'el öperken fotoğraf', 'resim çekilmek'] },
        { label: 'Çocuklara şeker dağıtmak', share: 0.2, aliases: ['kapı çalan çocuklara şeker', 'şeker dağıtmak', 'çocuk sevindirmek', 'şeker vermek', 'mendil vermek', 'harçlık dağıtmak', 'kapi calan cocuklara seker', 'seker dagitmak', 'cocuk sevindirmek', 'seker vermek', 'harclik dagitmak', 'çocuklara şeker vermek', 'kapıya gelen çocuklara şeker', 'çocuklara harçlık vermek', 'çocuklara çikolata', 'kapı çalan çocuklar', 'cocuklara seker dagitmak', 'şeker dağıtma'] }
      ].sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['okula gitmek', 'derse girmek'], reason: 'Bayram sabahları okul tatildir, ders yapılmaz.' },
        { aliases: ['işe gitmek', 'mesaiye kalmak'], reason: 'Bayram resmi tatil günüdür, klasik iş günü değildir.' },
        { aliases: ['sınav çözmek', 'ders çalışmak'], reason: 'Bayram sabahı yapılan geleneksel bir şey değil.' },
        { aliases: ['oruç tutmak', 'sahura kalkmak'], reason: 'Ramazan bayramında oruç tutulmaz, bayram edilir.' },
        { aliases: ['kar topu oynamak', 'denize girmek'], reason: 'Mevsime bağlı aktivite; bayrama özgü gelenek değil.' },
        { aliases: ['fatura ödemek', 'vergi yatırmak'], reason: 'Bayram sabahı yapılan bir kutlama adeti değil.' }
      ],
      tests: [
        { in: 'El öpmek', expect: 'El öpmek' },
        { in: 'bayramlik giymek', expect: 'Yeni kıyafet giymek' },
        { in: 'kabir ziyareti', expect: 'Mezarlık ziyareti' },
        { in: 'okula gitmek', expect: 'invalid' }
      ]
    },
    {
      id: 'q28',
      cat: 'şehir',
      text: 'Bir İstanbul simgesi olan yapı söyle',
      answers: [
        { label: 'Galata Kulesi', share: 24.0, aliases: ['galata', 'galata kulesine', 'beyoğlu kulesi', 'galataya', 'hezarfen kulesi', 'kule galata', 'galata kulesi', 'beyoglu kulesi', 'galata kulesi istanbul', 'karaköy galata', 'ceneviz kulesi', 'galata kule', 'taksim galata', 'galata kulesinden', 'galata kulesini', 'galata kulesi beyoğlu', 'karaköy kulesi', 'galatada'] },
        { label: 'Ayasofya', share: 20.0, aliases: ['ayasofya camii', 'ayasofya müzesi', 'hagia sophia', 'ayasofyaya', 'büyük ayasofya', 'kubbeli ayasofya', 'ayasofya', 'ayasofya muzesi', 'buyuk ayasofya', 'ayasofya camisi istanbul', 'ayasofya cami', 'ayasofya kebir camii', 'ayasofya camisi', 'bizans ayasofya', 'fatih ayasofya', 'ayasofyayı', 'ayasofya meydanı', 'ayasofya müze'] },
        { label: 'Kız Kulesi', share: 14.0, aliases: ['kiz kulesi', 'salacak kulesi', 'üsküdar kulesi', 'leandros', 'boğazdaki kule', 'kız kulesine', 'uskudar kulesi', 'bogazdaki kule', 'kiz kulesine', 'kız kulesi üsküdar', 'denizin ortasındaki kule', 'kızkulesi', 'kizkulesi', 'kız kulesini', 'salacak kız kulesi', 'kız kulesi efsanesi', 'kız kulesi adası', 'üsküdar kız kulesi'] },
        { label: 'Boğaz Köprüsü', share: 10.0, aliases: ['bogaz koprusu', '15 temmuz şehitler köprüsü', 'birinci köprü', 'fatih sultan mehmet köprüsü', 'boğaziçi köprüsü', 'köprü', '15 temmuz sehitler koprusu', 'birinci kopru', 'fatih sultan mehmet koprusu', 'bogazici koprusu', 'kopru', 'fsm köprüsü', 'yavuz sultan selim köprüsü', 'istanbul boğaz köprüsü', 'ikinci köprü', 'üçüncü köprü', '15 temmuz köprüsü', 'boğaz köprüleri'] },
        { label: 'Sultanahmet Camii', share: 9.0, aliases: ['sultanahmet', 'mavi cami', 'blue mosque', 'altı minareli cami', 'sultanahmete', 'sultan ahmet', 'sultanahmet camii', 'alti minareli cami', 'sultanahmet cami', 'sultanahmet camisi', 'sultanahmet meydanı', 'mavi camii', '6 minareli cami', 'sultan ahmet camii', 'sultanahmetteki cami', 'sultanahmeti', 'tarihi yarımada camii', 'sedefkar mehmet ağa'] },
        { label: 'Topkapı Sarayı', share: 6.0, aliases: ['topkapi sarayi', 'topkapı', 'osmanlı sarayı', 'harem', 'topkapıya', 'sarayburnu', 'topkapi', 'osmanli sarayi', 'topkapiya', 'topkapı müzesi', 'osmanlı padişah sarayı', 'bab-ı hümayun', 'gülhane sarayı', 'topkapı sarayı müzesi', 'topkapı sarayını', 'cankurtaran sarayı', 'topkapi muzesi', 'sarayburnu sarayı'] },
        { label: 'Dolmabahçe Sarayı', share: 5.0, aliases: ['dolmabahce sarayi', 'dolmabahçe', 'beşiktaş sarayı', 'saat kulesi dolmabahçe', 'dolmabahçeye', 'atatürk odası', 'dolmabahce', 'besiktas sarayi', 'saat kulesi dolmabahce', 'dolmabahceye', 'ataturk odasi', 'dolmabahçe saat kulesi', 'dolmabahçe müzesi', 'atatürkün öldüğü saray', 'dolmabahçe sarayını', 'beşiktaş dolmabahçe', 'dolmabahce saray', 'dolmabahçe saray'] },
        { label: 'Kapalıçarşı', share: 4.0, aliases: ['kapalicarsi', 'grand bazaar', 'büyük çarşı', 'mısır çarşısı', 'çarşı kapalı', 'kapalı çarşı', 'buyuk carsi', 'misir carsisi', 'carsi kapali', 'kapali carsi', 'kapalı çarşı istanbul', 'beyazıt kapalıçarşı', 'mısır çarşısı eminönü', 'kapalıçarşıya', 'tarihi çarşı', 'kapalıçarşıyı', 'kuyumcular çarşısı', 'nuruosmaniye çarşısı'] },
        { label: 'Süleymaniye Camii', share: 2.6, aliases: ['suleymaniye', 'mimar sinan camii', 'süleymaniye külliyesi', 'haliç camii', 'süleymaniyeye', 'kanuni camii', 'süleymaniye', 'suleymaniye camii', 'süleymaniye istanbul', 'suleymaniye kulliyesi', 'halic camii', 'suleymaniyeye', 'süleymaniye cami', 'süleymaniye camisi', 'süleymaniye tepesi', 'mimar sinanın camisi', 'süleymaniyeyi', 'kanuni süleyman camii'] },
        { label: 'Ortaköy Camii', share: 1.8, aliases: ['ortakoy camii', 'büyük mecidiye camii', 'boğaz kenarı camii', 'ortaköye', 'mecidiye camii', 'kumpir camii', 'buyuk mecidiye camii', 'bogaz kenari camii', 'ortakoye', 'ortaköy cami', 'ortaköy camisi', 'köprü altındaki cami', 'ortaköy sahil camii', 'ortaköyü', 'beşiktaş ortaköy camii', 'ortakoy cami', 'ortaköy camisine', 'ortaköydeki cami'] },
        { label: 'Rumeli Hisarı', share: 1.0, aliases: ['rumeli hisari', 'boğazkesen', 'hisar', 'fatih kalesi', 'anadolu hisarı', 'surlar', 'bogazkesen', 'anadolu hisari', 'rumeli hisarı kalesi', 'bebek hisarı', 'hisarüstü kalesi', 'fatih rumeli hisarı', 'boğaz hisarı', 'rumeli hisarını', 'anadolu hisarı kalesi', 'istanbul hisarları', 'rumelihisarı', 'rumelihisari'] },
        { label: 'Yerebatan Sarnıcı', share: 0.8, aliases: ['yerebatan', 'medusa başı', 'basilica cistern', 'sarnıç', 'yerebatana', 'yeraltı sarnıcı', 'medusa basi', 'sarnic', 'yeralti sarnici', 'yerebatan sarnici', 'yerebatan sarayı', 'sultanahmet sarnıcı', 'medusa sütunu', 'yerebatan su sarnıcı', 'şerefiye sarnıcı', 'binbirdirek sarnıcı', 'yerebatanı', 'yeraltı sarnıcı istanbul'] },
        { label: 'Haydarpaşa Garı', share: 0.6, aliases: ['haydarpasa', 'haydarpaşa tren garı', 'kadıköy garı', 'tarihi gar', 'tren istasyonu', 'gar binası', 'haydarpaşa', 'haydarpasa tren gari', 'kadikoy gari', 'gar binasi', 'haydarpasa gari', 'haydarpaşa tren istasyonu', 'kadıköy haydarpaşa', 'anadolu yakası garı', 'haydarpaşa garını', 'sirkeci garı', 'haydarpaşa iskelesi', 'tarihi tren garı'] },
        { label: 'Çamlıca Kulesi', share: 0.4, aliases: ['camlica kulesi', 'televizyon kulesi', 'küçük çamlıca', 'büyük çamlıca', 'çamlıca camii', 'radyo kulesi', 'kucuk camlica', 'buyuk camlica', 'camlica camii', 'çamlıca tepesi kulesi', 'üsküdar çamlıca kulesi', 'tv kulesi', 'çamlıca tv kulesi', 'çamlıca cami', 'çamlıca kulesini', 'camlica kule', 'çamlıca kule', 'büyük çamlıca camii'] },
        { label: 'Valens Kemeri', share: 0.2, aliases: ['bozdoğan kemeri', 'bozdogan kemeri', 'su kemeri', 'roma kemeri', 'fatih kemeri', 'kemer', 'valens kemeri', 'unkapanı su kemeri', 'bozdoğan su kemeri', 'bozdogan su kemeri', 'saraçhane kemeri', 'valens su kemeri', 'tarihi su kemeri', 'bizans su kemeri', 'atatürk bulvarı kemeri', 'kemerler', 'valens kemer', 'bozdoğan'] },
        { label: 'Taksim Cumhuriyet Anıtı', share: 1.2, aliases: ['taksim anıtı', 'atatürk kültür merkezi', 'akm', 'taksim camii', 'gezi anıtı', 'meydan anıtı', 'taksim aniti', 'ataturk kultur merkezi', 'gezi aniti', 'meydan aniti', 'taksim meydanı anıtı', 'cumhuriyet anıtı', 'cumhuriyet aniti', 'taksim heykeli', 'taksim meydanı', 'istiklal anıtı', 'taksim cumhuriyet aniti', 'taksim cumhuriyet heykeli'] }
      ].map(function (a, i) {
        if (i === 15) a.share = 1.2;
        if (i === 10) a.share = 0.9;
        if (i === 11) a.share = 0.7;
        if (i === 12) a.share = 0.5;
        if (i === 13) a.share = 0.3;
        if (i === 14) a.share = 0.1;
        return a;
      }).sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['anıtkabir', 'atakule'], reason: 'Bu yapı İstanbul’da değil, Ankara’dadır.' },
        { aliases: ['eyfel kulesi', 'kolezyum'], reason: 'Bu dünyaca ünlü yabancı bir yapı, İstanbul simgesi değil.' },
        { aliases: ['izmir saat kulesi', 'efes'], reason: 'Bu İzmir’in simgesi olan bir yapı.' },
        { aliases: ['sümela manastırı', 'uzungöl'], reason: 'Bu Trabzon’da bulunan bir yapı veya yer.' },
        { aliases: ['nemrut dağı', 'göbeklitepe'], reason: 'Güneydoğu Anadolu bölgesinde yer alan tarihi bir alan.' },
        { aliases: ['aspendos', 'pamukkale'], reason: 'Bu yapılar İstanbul dışında yer alır.' }
      ],
      tests: [
        { in: 'Galata Kulesi', expect: 'Galata Kulesi' },
        { in: 'kiz kulesi', expect: 'Kız Kulesi' },
        { in: 'bozdoğan kemeri', expect: 'Valens Kemeri' },
        { in: 'anıtkabir', expect: 'invalid' }
      ]
    },
    {
      id: 'q29',
      cat: 'ev',
      text: 'Türk evlerinde çok bulunan bir eşya söyle',
      answers: [
        { label: 'Çaydanlık', share: 18.0, aliases: ['caydanlik', 'çift katlı çaydanlık', 'emaye çaydanlık', 'çelik çaydanlık', 'demlik', 'çay makinesi', 'çaydanlık', 'cift katli caydanlik', 'emaye caydanlik', 'celik caydanlik', 'cay makinesi', 'çaydanlığı', 'çaydanlıklar', 'porselen demlik', 'bakır çaydanlık', 'elektrikli çaydanlık', 'elektrikli çaycı', 'çay demliği'] },
        { label: 'Halı', share: 14.4, aliases: ['hali', 'el dokuma kilim', 'yün halı', 'salon halısı', 'yolluk', 'makine halısı', 'halı', 'yun hali', 'salon halisi', 'makine halisi', 'halısı', 'halılar', 'el dokuması halı', 'ısparta halısı', 'hereke halısı', 'koridor yolluğu', 'paspas', 'ev halısı'] },
        { label: 'Nazar boncuğu', share: 13.8, aliases: ['nazar boncugu', 'mavi boncuk', 'nazarlık', 'göz boncuğu', 'duvar nazarlığı', 'boncuk', 'nazar boncuğu', 'nazarlik', 'goz boncugu', 'duvar nazarligi', 'mavi nazar boncuğu', 'nazar boncuğunu', 'cam nazar boncuğu', 'nazar boncukları', 'kapı nazarlığı', 'nazar', 'mavi göz boncuğu', 'nazarlık boncuk'] },
        { label: 'Dantel örtü', share: 10.0, aliases: ['dantel ortu', 'dantel', 'sehpa örtüsü', 'televizyon örtüsü', 'el işi dantel', 'tığ işi', 'dantel örtü', 'sehpa ortusu', 'televizyon ortusu', 'el isi dantel', 'tig isi', 'dantel masa örtüsü', 'vitrin danteli', 'televizyon danteli', 'çeyiz danteli', 'oya dantel', 'dantelli örtü', 'danteller'] },
        { label: 'Kolonya', share: 8.0, aliases: ['limon kolonyası', 'kolonya şişesi', 'misafir kolonyası', 'tütün kolonyası', 'cam şişe kolonya', 'kolonyası', 'kolonya', 'limon kolonyasi', 'kolonya sisesi', 'misafir kolonyasi', 'tutun kolonyasi', 'cam sise kolonya', 'kolonyasi', 'tütün kolonyası şişesi', 'lavanta kolonyası', 'kolonyalar', '80 derece kolonya', 'el kolonyası'] },
        { label: 'Poşet dolu poşet', share: 7.0, aliases: ['poset dolu poset', 'poşetlik', 'market poşeti', 'poşet torbası', 'plastik poşetler', 'poşet içinde poşet', 'poşet dolu poşet', 'posetlik', 'market poseti', 'poset torbasi', 'plastik posetler', 'poset icinde poset', 'poşet poşeti', 'poşetlerin olduğu poşet', 'bim poşeti', 'poşet biriktirmek', 'mutfak poşetliği', 'poşetler'] },
        { label: 'Koltuk örtüsü', share: 6.0, aliases: ['koltuk ortusu', 'çekyat örtüsü', 'kanepe örtüsü', 'kırlent', 'koltuk şalı', 'koruyucu örtü', 'koltuk örtüsü', 'cekyat ortusu', 'kanepe ortusu', 'kirlent', 'koltuk sali', 'koruyucu ortu', 'çekyat', 'koltuk şalı örtüsü', 'kanepe şalı', 'kırlentler', 'koltuk kılıfı', 'koltuk örtüleri'] },
        { label: 'Tespih', share: 4.4, aliases: ['tesbih', 'kehribar tespih', 'oltu tespih', 'dede tespihi', 'doksan dokuzluk', 'namaz tespihi', 'tespih', 'tespihler', 'otuz üçlük tespih', 'kuka tespih', 'tespihi', 'baba tespihi', 'kehribar', 'oltu taşı tespih', 'doksan dokuzluk tespih', 'sabır tespihi', 'tesbihler', 'tespihim'] },
        { label: 'Televizyon', share: 3.6, aliases: ['televizyonu', 'plazma', 'akıllı tv', 'televizyon ünitesi', 'ekran', 'salon televizyonu', 'televizyon', 'akilli tv', 'televizyon unitesi', 'televizyon ekran', 'televizyonlar', 'tüplü televizyon', 'lcd televizyon', 'led tv', 'uydu alıcısı', 'televizyon ekranı', 'smart tv', 'televizyon sehpası'] },
        { label: 'Terlik', share: 3.0, aliases: ['misafir terliği', 'ev terliği', 'pofuduk terlik', 'plastik terlik', 'banyo terliği', 'çift terlik', 'terlik', 'misafir terligi', 'ev terligi', 'banyo terligi', 'cift terlik', 'terlikler', 'balkon terliği', 'anne terliği', 'keçe terlik', 'terliği', 'misafir terlikleri', 'örgü terlik'] },
        { label: 'Kurabiye kutusu', share: 2.6, aliases: ['dikiş kutusu', 'teneke kutu', 'iplik kutusu', 'danish butter cookies', 'mavi teneke kutu', 'düğme kutusu', 'kurabiye kutusu', 'dikis kutusu', 'teneke dikiş kutusu', 'kurabiye kutusu dikiş', 'dugme kutusu', 'dikiş iplik kutusu', 'teneke kurabiye kutusu', 'kurabiye tenekesi', 'iplik dolu kurabiye kutusu', 'mavi kurabiye kutusu', 'metal kurabiye kutusu', 'dikiş kutusu teneke'] },
        { label: 'Buzdolabı magneti', share: 2.2, aliases: ['magnet', 'mıknatıs', 'tatil magneti', 'buzdolabı süsü', 'not mıknatısı', 'şehir magneti', 'buzdolabi magneti', 'miknatis', 'buzdolabı magnetleri', 'buzdolabi susu', 'not miknatisi', 'sehir magneti', 'buzdolabı süsleri', 'magnetler', 'buzdolabı mıknatısı', 'nazarlı magnet', 'hatıra magneti', 'kapı magneti'] },
        { label: 'Tül perde', share: 1.8, aliases: ['perde', 'güneşlik', 'fon perde', 'korniş', 'stor perde', 'cam perdesi', 'tul perde', 'guneslik', 'kornis', 'tül', 'tül perdeler', 'salon perdesi', 'pencere perdesi', 'perdeler', 'tülü', 'stor tül', 'zebra perde', 'briz perde'] },
        { label: 'Semaver', share: 1.4, aliases: ['elektrikli semaver', 'kömürlü semaver', 'balkon semaveri', 'çay semaveri', 'bakır semaver', 'semaveri', 'semaver', 'komurlu semaver', 'cay semaveri', 'bakir semaver', 'çay semaver', 'piknik semaveri', 'odunlu semaver', 'semaverler', 'pirinç semaver', 'bahçe semaveri', 'elektrikli çay semaveri', 'semaverde çay'] },
        { label: 'Cezve', share: 1.0, aliases: ['bakır cezve', 'kahve cezvesi', 'çelik cezve', 'türk kahvesi cezvesi', 'küçük cezve', 'cezvesi', 'cezve', 'bakir cezve', 'celik cezve', 'turk kahvesi cezvesi', 'kucuk cezve', 'elektrikli cezve', 'emaye cezve', 'cezveler', 'kahve pişirme cezvesi', 'sütlük cezve', 'ikili cezve', 'bakır kahve cezvesi'] },
        { label: 'Sedir', share: 0.8, aliases: ['şark köşesi', 'yer minderi', 'kırlentli sedir', 'balkon sediri', 'minder', 'ahşap sedir', 'sedir', 'sark kosesi', 'kirlentli sedir', 'ahsap sedir', 'sedirler', 'divan', 'köşe sedir', 'oturma minderi', 'şark odası', 'sediri', 'köşe minderi', 'halı sedir'] },
        { label: 'Duvar saati', share: 0.6, aliases: ['saat', 'analog saat', 'sarkaçlı saat', 'mutfak saati', 'salon saati', 'pilli saat', 'duvar saati', 'sarkacli saat', 'duvar saatleri', 'büyük duvar saati', 'ahşap duvar saati', 'saati', 'duvardaki saat', 'akrep yelkovan', 'saatler', 'çalar duvar saati', 'duvar saati pilli', 'yuvarlak duvar saati'] },
        { label: 'Çeyiz sandığı', share: 0.4, aliases: ['ceyiz sandigi', 'ahşap sandık', 'çeyiz', 'oymalı sandık', 'bohça sandığı', 'annemin sandığı', 'çeyiz sandığı', 'ahsap sandik', 'ceyiz', 'oymali sandik', 'bohca sandigi', 'annemin sandigi', 'sandık', 'sandik', 'ceviz sandık', 'gelin sandığı', 'çeyiz sandıkları', 'işlemeli sandık'] },
        { label: 'Seccade', share: 1.0, aliases: ['namazlık', 'halı seccade', 'kadife seccade', 'desenli seccade', 'seccadesi', 'bohça seccadesi', 'seccade', 'namazlik', 'hali seccade', 'bohca seccadesi', 'seccadeler', 'namaz seccadesi', 'ipek seccade', 'kilim seccade', 'işlemeli seccade', 'misafir seccadesi', 'seccadeyi', 'bohça seccade'] }
      ].map(function (a, i) {
        if (i === 18) a.share = 1.2;
        if (i === 14) a.share = 1.0;
        return a;
      }).sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['şömine', 'jakuzi'], reason: 'Lüks villalarda olsa da ortalama her Türk evinde bulunmaz.' },
        { aliases: ['piyano', 'bilardo masası'], reason: 'Çok yaygın her evde bulunan klasik bir eşya değil.' },
        { aliases: ['traktör', 'biçerdöver'], reason: 'Ev içi eşyası değil, tarım aracı.' },
        { aliases: ['vapur', 'tramvay'], reason: 'Toplu taşıma aracı; ev eşyası değil.' },
        { aliases: ['trafik lambası', 'bank'], reason: 'Sokak veya park ekipmanı, ev eşyası değil.' },
        { aliases: ['teleskop', 'mikroskop'], reason: 'Her evin standart eşyası sayılmaz.' }
      ],
      tests: [
        { in: 'Çaydanlık', expect: 'Çaydanlık' },
        { in: 'dantel ortu', expect: 'Dantel örtü' },
        { in: 'dikiş kutusu', expect: 'Kurabiye kutusu' },
        { in: 'jakuzi', expect: 'invalid' }
      ]
    },
    {
      id: 'q30',
      cat: 'yemek',
      text: 'Bir yaz meyvesi söyle',
      answers: [
        { label: 'Karpuz', share: 37.6, aliases: ['diyarbakır karpuzu', 'çekirdeksiz karpuz', 'soğuk karpuz', 'karpuz peynir', 'kırmızı karpuz', 'karpuzu', 'karpuz', 'diyarbakir karpuzu', 'cekirdeksiz karpuz', 'soguk karpuz', 'kirmizi karpuz', 'karpuzlar', 'karpuz dilimi', 'tatlı karpuz', 'yaz karpuzu', 'dilim karpuz', 'kelek karpuz', 'karpuz kabuğu'] },
        { label: 'Kiraz', share: 14.0, aliases: ['napolyon kiraz', 'kırmızı kiraz', 'dalından kiraz', 'saplı kiraz', 'kirazı', 'tatlı kiraz', 'kiraz', 'kirmizi kiraz', 'dalindan kiraz', 'sapli kiraz', 'kirazi', 'tatli kiraz', 'kirazlar', 'kara kiraz', 'salihli kirazı', 'çift kiraz', 'küpe kiraz', 'taze kiraz'] },
        { label: 'Kavun', share: 12.0, aliases: ['kırkağaç kavunu', 'sarı kavun', 'bal kavun', 'kokulu kavun', 'kavunu', 'soğuk kavun', 'kavun', 'kirkagac kavunu', 'sari kavun', 'soguk kavun', 'kavunlar', 'tatlı kavun', 'çıtır kavun', 'kelek kavun', 'bal kavunu', 'kırkağaç', 'dilim kavun', 'yaz kavunu'] },
        { label: 'Şeftali', share: 9.0, aliases: ['seftali', 'tüylü şeftali', 'yarma şeftali', 'bursa şeftalisi', 'sulu şeftali', 'nektarin şeftali', 'şeftali', 'tuylu seftali', 'yarma seftali', 'bursa seftalisi', 'sulu seftali', 'şeftalisi', 'şeftaliler', 'tüylü', 'bursa şeftali', 'beyaz şeftali', 'yassı şeftali', 'olgun şeftali'] },
        { label: 'Çilek', share: 8.0, aliases: ['cilek', 'dağ çileği', 'kokulu çilek', 'kırmızı çilek', 'çileği', 'reçellik çilek', 'çilek', 'dag cilegi', 'kokulu cilek', 'kirmizi cilek', 'cilegi', 'recellik cilek', 'çilekler', 'tatlı çilek', 'osmanlı çileği', 'ereğli çileği', 'bahçe çileği', 'taze çilek'] },
        { label: 'Üzüm', share: 6.0, aliases: ['uzum', 'çekirdeksiz üzüm', 'siyah üzüm', 'yeşil üzüm', 'salkım üzüm', 'üzümü', 'üzüm', 'cekirdeksiz uzum', 'siyah uzum', 'yesil uzum', 'salkim uzum', 'uzumu', 'üzümler', 'sultaniye üzüm', 'razaki üzüm', 'kırmızı üzüm', 'asma üzümü', 'koruk üzüm'] },
        { label: 'İncir', share: 5.0, aliases: ['incir', 'aydın inciri', 'siyah incir', 'taze incir', 'bal incir', 'bardacık', 'aydin inciri', 'bardacik', 'incirler', 'inciri', 'yeşil incir', 'kuru incir', 'sütlü incir', 'bursa siyahı', 'dağ inciri', 'olgun incir', 'mor incir', 'incir meyvesi'] },
        { label: 'Kayısı', share: 4.0, aliases: ['kayisi', 'malatya kayısısı', 'şekerpare kayısı', 'sarı kayısı', 'taze kayısı', 'kayısısı', 'kayısı', 'malatya kayisisi', 'sekerpare kayisi', 'sari kayisi', 'taze kayisi', 'kayisisi', 'kayısılar', 'gün kurusu', 'tatlı kayısı', 'olgun kayısı', 'şekerpare', 'malatya kayısı'] },
        { label: 'Dut', share: 1.4, aliases: ['beyaz dut', 'karadut', 'kara dut', 'dut ağacı', 'taze dut', 'dutu', 'dut', 'dut agaci', 'dutlar', 'tatlı dut', 'siyah dut', 'ekşi dut', 'urmu dut', 'kuru dut', 'silkeleme dut', 'dut pekmezi', 'yaz dutu', 'dut meyvesi'] },
        { label: 'Erik', share: 1.0, aliases: ['yeşil erik', 'can erik', 'papaz eriği', 'mürdüm eriği', 'tuzlu erik', 'eriği', 'erik', 'yesil erik', 'papaz erigi', 'murdum erigi', 'erigi', 'erikler', 'kırmızı erik', 'sarı erik', 'anjelik erik', 'tuzlu yeşil erik', 'kütür erik', 'taze erik'] },
        { label: 'Vişne', share: 0.8, aliases: ['visne', 'ekşi vişne', 'kütahya vişnesi', 'vişne suyu', 'taze vişne', 'vişnesi', 'vişne', 'eksi visne', 'kutahya visnesi', 'visne suyu', 'taze visne', 'visnesi', 'vişneler', 'koyu vişne', 'reçellik vişne', 'dalından vişne', 'kırmızı vişne', 'vişne kompostosu'] },
        { label: 'Nektarin', share: 0.6, aliases: ['tüysüz şeftali', 'sarı nektarin', 'kırmızı nektarin', 'sert nektarin', 'nektarini', 'nektari', 'nektarin', 'tuysuz seftali', 'sari nektarin', 'kirmizi nektarin', 'nektarinler', 'tatlı nektarin', 'taze nektarin', 'nektar', 'tüysüz şeftali nektarin', 'kırmızı nektari', 'yaz nektarini', 'olgun nektarin'] },
        { label: 'Böğürtlen', share: 0.4, aliases: ['bogurtlen', 'orman böğürtleni', 'yabani böğürtlen', 'kara böğürtlen', 'taze böğürtlen', 'böğürtleni', 'böğürtlen', 'orman bogurtleni', 'yabani bogurtlen', 'kara bogurtlen', 'taze bogurtlen', 'bogurtleni', 'böğürtlenler', 'dikenli böğürtlen', 'yaban böğürtleni', 'siyah böğürtlen', 'tatlı böğürtlen', 'yaz böğürtleni'] },
        { label: 'Ahududu', share: 0.2, aliases: ['frambuaz', 'kırmızı ahududu', 'dağ ahududusu', 'ağaç çileği', 'taze ahududu', 'ahududusu', 'ahududu', 'kirmizi ahududu', 'dag ahududusu', 'agac cilegi', 'frambuaz ahududu', 'ahududular', 'frambuazlar', 'yaban ahududusu', 'orman ahududusu', 'tatlı ahududu', 'kırmızı frambuaz', 'ahududu meyvesi'] },
        { label: 'Kavun değil armut', share: 1.8, aliases: ['armut', 'yaz armutu', 'ankara armutu', 'deveci armut', 'santa maria', 'akça armut', 'akca armut', 'armutlar', 'armutu', 'sulu armut', 'mustafa bey armutu', 'williams armutu', 'şeker armut', 'taze armut', 'olgun armut', 'sarı armut', 'bal armudu', 'armut meyvesi'] }
      ].map(function (a, i) {
        if (i === 14) { a.label = 'Armut'; a.share = 1.8; }
        if (i === 0) a.share = 35.8;
        return a;
      }).sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['portakal', 'mandalina', 'greyfurt'], reason: 'Narenciye ürünleri kış meyvesidir.' },
        { aliases: ['ayva', 'nar', 'kestane'], reason: 'Bu sonbahar veya kış mevsiminin meyvesi.' },
        { aliases: ['domates', 'salatalık', 'biber'], reason: 'Mutfakta sebze olarak kullanılır, yaz meyvesi sayılmaz.' },
        { aliases: ['patlıcan', 'kabak', 'fasulye'], reason: 'Bu bir meyve değil, yaz sebzesi.' },
        { aliases: ['havuç', 'turp', 'lahana'], reason: 'Kış sebzesi; yaz meyvesi değil.' },
        { aliases: ['limon', 'kivi'], reason: 'Daha çok kış aylarında öne çıkan ekşi meyveler.' }
      ],
      tests: [
        { in: 'Karpuz', expect: 'Karpuz' },
        { in: 'seftali', expect: 'Şeftali' },
        { in: 'can erik', expect: 'Erik' },
        { in: 'mandalina', expect: 'invalid' }
      ]
    },
    {
      id: 'q31',
      cat: 'şehir',
      text: 'Taksicinin yolda açtığı bir konuyu söyle',
      answers: [
        { label: 'Trafik', share: 24.0, aliases: ['trafik durumu', 'yollar tıkalı', 'kaza var galiba', 'istanbul trafiği', 'bu saatte trafik', 'yol çalışması', 'trafik', 'yollar tikali', 'istanbul trafigi', 'yol calismasi', 'trafik çok', 'trafik felç', 'yol kilit', 'köprü trafiği', 'trafik sıkışık', 'her yer trafik', 'bu saatte hep böyle', 'trafik açılmıyor'] },
        { label: 'Siyaset', share: 20.0, aliases: ['politika', 'seçimler', 'belediye', 'ülke gündemi', 'haberler', 'parti', 'siyaset', 'secimler', 'ulke gundemi', 'memleket meseleleri', 'meclis', 'hükümet', 'muhalefet', 'siyasi gündem', 'seçim sonuçları', 'politikacı', 'ülke nereye gidiyor', 'siyasi konular'] },
        { label: 'Futbol', share: 16.0, aliases: ['maç', 'derbi', 'hangi takımlısın', 'hakemler', 'lig durumu', 'süper lig', 'futbol', 'mac', 'hangi takimlisin', 'super lig', 'galatasaray', 'fenerbahçe', 'beşiktaş', 'trabzonspor', 'milli takım', 'hakem hataları', 'dün akşamki maç', 'şampiyonluk'] },
        { label: 'Ekonomi / zamlar', share: 14.0, aliases: ['ekonomi', 'zamlar', 'mazot fiyatları', 'benzin zammı', 'hayat pahalılığı', 'enflasyon', 'ekonomi zamlar', 'mazot fiyatlari', 'benzin zammi', 'hayat pahaliligi', 'geçim derdi', 'gecim derdi', 'dolar kuru', 'euro', 'akaryakıt zamları', 'pahalılık', 'her şey zamlandı', 'paranın değeri'] },
        { label: 'Hava durumu', share: 6.0, aliases: ['hava nasıl', 'yağmur yağacak', 'çok sıcak', 'soğuk hava', 'kar geliyor', 'mevsimler değişti', 'hava durumu', 'yagmur yagacak', 'cok sicak', 'soguk hava', 'mevsimler degisti', 'havalar bozdu', 'ne sıcak hava', 'yağmur bastırdı', 'dolu yağacak', 'kış sert geçecek', 'hava buz gibi', 'havalar ısındı'] },
        { label: 'Memleket / nerelisin', share: 5.0, aliases: ['memleket', 'nerelisin', 'hangi şehirdensin', 'hemşehri', 'köyün neresi', 'memleket neresi', 'hemsehri', 'koyun neresi', 'nerelisin kardeş', 'memleket nere', 'hangi ildensin', 'aslen nerelisin', 'ben de oralıyım', 'memleket hasreti', 'köye gidiyor musun', 'nerelisiniz', 'memleketin neresi', 'hangi şehirden'] },
        { label: 'Eski İstanbul', share: 4.0, aliases: ['eski istanbul', 'eskiden buralar', 'benim gençliğimde', 'buralar hep tarlaydı', 'eski günler', 'doksanlar', 'benim gencligimde', 'buralar hep tarlaydi', 'eski gunler', 'eski istanbul böyle değildi', 'eskiden buralar dutluktu', 'seksenler', 'yetmişler', 'eski taksim', 'eski boğaz', 'nerede o eski günler', 'istanbul bozuldu', 'eskiden buralar ormandı'] },
        { label: 'Yolcu hikâyeleri', share: 3.0, aliases: ['yolcu hikayeleri', 'geçen bir müşteri', 'turistler', 'ilginç yolcular', 'başımdan geçen', 'dün akşamki müşteri', 'gecen bir musteri', 'ilginc yolcular', 'basimdan gecen', 'dun aksamki musteri', 'garip müşteriler', 'sarhoş yolcu', 'yabancı turistler', 'geçen gün bir yolcu', 'müşteri anıları', 'taksici anıları', 'yolcular neler anlatıyor', 'ünlü yolcu'] },
        { label: 'İş / meslek', share: 2.2, aliases: ['ne iş yapıyorsun', 'öğrenci misin', 'nerede çalışıyorsun', 'maaşlar', 'sektör', 'mesleğin ne', 'ne is yapiyorsun', 'ogrenci misin', 'nerede calisiyorsun', 'maaslar', 'sektor', 'meslegin ne', 'iş güç', 'is guc', 'ne iş yapıyorsunuz', 'hangi bölüm', 'işler nasıl', 'çalışma hayatı'] },
        { label: 'Aile / çocuklar', share: 1.6, aliases: ['evli misin', 'çocuk var mı', 'benim oğlan', 'benim kız', 'okul masrafları', 'aile konusu', 'cocuk var mi', 'benim oglan', 'benim kiz', 'okul masraflari', 'evli misiniz', 'çoluk çocuk', 'coluk cocuk', 'çocuklar büyüyor', 'üniversite sınavı', 'evlilik', 'aile hayatı', 'kaç çocuğun var'] },
        { label: 'Taksicilik zorluğu', share: 1.2, aliases: ['taksicilik zor', 'gece vardiyası', 'plaka kirası', 'uber', 'taksi uygulamaları', 'çalışma saatleri', 'gece vardiyasi', 'plaka kirasi', 'taksi uygulamalari', 'calisma saatleri', 'taksicilik zor meslek', 'taksi plakası', 'yevmiye', 'sabah akşam direksiyon', 'trafik stresi', 'martı tag', 'korsan taksi', 'taksici dertleri'] },
        { label: 'Askerlik anıları', share: 0.9, aliases: ['askerlik anilari', 'askerlik', 'doğuda yaptım', 'komutanım', 'şafak', 'acemi birliği', 'doguda yaptim', 'komutanim', 'safak', 'acemi birligi', 'askerlik yaptığım yer', 'usta birliği', 'nöbet anıları', 'komutan anısı', 'askerlik yaptın mı', 'bedelli askerlik', 'terhis', 'şafak saymak'] },
        { label: 'Kira fiyatları', share: 0.7, aliases: ['kira fiyatlari', 'ev kiraları', 'emlak', 'ev sahipleri', 'konut fiyatları', 'taşınmak', 'ev kiralari', 'konut fiyatlari', 'tasinmak', 'kira zammı', 'ev sahibi kiracı', 'kiralar uçtu', 'ev fiyatları', 'kiralık ev', 'aidatlar', 'ev kirası', 'emlak piyasası', 'fahiş kira'] },
        { label: 'Köprü geçişi', share: 0.5, aliases: ['kopru gecisi', 'köprü parası', 'tünel ücreti', 'avrasya tüneli', 'hgs', 'otoyol ücreti', 'kopru parasi', 'tunel ucreti', 'avrasya tuneli', 'otoyol ucreti', 'köprüden mi geçelim', 'birinci köprü mü ikinci mi', 'ogs', 'köprü ücreti', 'tünelden geçelim mi', 'fsm köprüsü', 'köprü gişeleri', 'geçiş ücreti'] },
        { label: 'Yapay zekâ', share: 0.3, aliases: ['yapay zeka', 'teknoloji', 'chatgpt', 'robotlar', 'telefonlar', 'internet çağı', 'yapay zekâ', 'robotlar işimizi alacak', 'akıllı telefonlar', 'internet cagi', 'teknoloji çok gelişti', 'yapay zeka çıktı', 'bilgisayarlar', 'dijital çağ', 'ekran bağımlılığı', 'sosyal medya', 'yeni nesil teknoloji', 'yapay zekalar'] },
        { label: 'Sağlık / hastalık', share: 0.6, aliases: ['bel ağrısı', 'sigara bırakma', 'hastane', 'doktorlar', 'uykusuzluk', 'şeker hastalığı', 'bel agrisi', 'sigara birakma', 'seker hastaligi', 'tansiyon', 'diz ağrısı', 'boyun fıtığı', 'bel fıtığı', 'hastalıklar', 'sağlık durumu', 'grip salgını', 'korona', 'sağlık sorunları'] }
      ].map(function (a, i) {
        if (i === 15) a.share = 1.1;
        if (i === 10) a.share = 1.3;
        if (i === 9) a.share = 1.6;
        if (i === 8) a.share = 2.0;
        if (i === 0) a.share = 23.7;
        return a;
      }).sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['kuantum fiziği', 'kara delikler'], reason: 'Klasik taksi sohbetinde pek açılan bir konu değil.' },
        { aliases: ['inecek var', 'arkaya ilerleyelim'], reason: 'Bu takside değil, dolmuşta söylenen bir söz.' },
        { aliases: ['susun', 'tahtaya kalk'], reason: 'Sınıfta öğretmenin söylediği ifadeler.' },
        { aliases: ['latince dilbilgisi', 'klasik bale'], reason: 'Gündelik taksici sohbeti konularından değil.' },
        { aliases: ['yemek tarifi', 'örgü modeli'], reason: 'Taksicilerin yolda sık açtığı konulardan sayılmaz.' },
        { aliases: ['el öpenlerin çok olsun', 'hayırlı bayramlar'], reason: 'Bu bayram ziyareti tebriği, sohbet konusu değil.' }
      ],
      tests: [
        { in: 'Trafik', expect: 'Trafik' },
        { in: 'benzin zammı', expect: 'Ekonomi / zamlar' },
        { in: 'askerlik', expect: 'Askerlik anıları' },
        { in: 'kuantum fiziği', expect: 'invalid' }
      ]
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
