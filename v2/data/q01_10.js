(function (root) {
  'use strict';
  root.QUESTIONS = root.QUESTIONS || [];
  root.QUESTIONS.push(
    {
      id: 'q01',
      cat: 'yemek',
      text: 'Kahvaltıda olmazsa olmaz bir şey söyle',
      answers: [
        {
          label: 'Çay',
          share: 36.1,
          aliases: ['cay', 'çayı', 'cayi', 'çaya', 'caya', 'demli çay', 'demli cay', 'çay içmek', 'cay icmek', 'ince belli çay', 'siyah çay', 'türk çayı', 'bir bardak çay', 'sıcak çay', 'sicak cay', 'taze çay', 'çayımız', 'çaysız olmaz', 'tavşan kanı çay', 'tavsan kani cay', 'rize çayı', 'kaçak çay', 'demleme çay']
        },
        {
          label: 'Peynir',
          share: 16.8,
          aliases: ['peyniri', 'beyaz peynir', 'kaşar', 'kaşar peyniri', 'kasar', 'ezine', 'ezine peyniri', 'tulum', 'tulum peyniri', 'örgü peyniri', 'lor peyniri', 'peynirler', 'kasar peyniri', 'orgu peyniri', 'çökelek', 'cokelek', 'krem peynir', 'üçgen peynir', 'ucgen peynir', 'dil peyniri', 'köy peyniri', 'koy peyniri', 'hellim peyniri', 'süzme peynir']
        },
        {
          label: 'Zeytin',
          share: 11.2,
          aliases: ['zeytini', 'siyah zeytin', 'yeşil zeytin', 'yesil zeytin', 'kırma zeytin', 'sele zeytin', 'zeytin ezmesi', 'zeytinler', 'kirma zeytin', 'gemlik zeytini', 'çizik zeytin', 'cizik zeytin', 'biberli zeytin', 'kekikli zeytin', 'zeytinyağlı zeytin', 'kuru sele zeytin', 'yağlı zeytin', 'yagli zeytin', 'sofra zeytini']
        },
        {
          label: 'Yumurta',
          share: 9.5,
          aliases: ['yumurtayi', 'haşlanmış yumurta', 'haslanmis yumurta', 'sahanda yumurta', 'omlet', 'rafadan yumurta', 'göz yumurta', 'kayısı yumurta', 'çırpılmış yumurta', 'yumurtayı', 'yumurtalar', 'goz yumurta', 'kayisi yumurta', 'cirpilmis yumurta', 'köy yumurtası', 'koy yumurtasi', 'tavada yumurta', 'peynirli omlet', 'katı yumurta', 'kati yumurta', 'sıcak yumurta']
        },
        {
          label: 'Simit',
          share: 6.4,
          aliases: ['simiti', 'simidi', 'gevrek', 'sıcak simit', 'sicak simit', 'susamlı simit', 'sokak simidi', 'ankara simidi', 'simitler', 'susamli simit', 'çıtır simit', 'citir simit', 'taze simit', 'fırın simidi', 'firin simidi', 'pastane simidi', 'izmir gevreği', 'izmir gevregi', 'kazan simidi']
        },
        {
          label: 'Ekmek',
          share: 4.6,
          aliases: ['ekmegi', 'ekmeği', 'taze ekmek', 'kızarmış ekmek', 'kizarmis ekmek', 'sıcak ekmek', 'ekmek kızartması', 'somun', 'ekmekler', 'sicak ekmek', 'ekmek kizartmasi', 'somun ekmek', 'fırın ekmeği', 'firin ekmegi', 'köy ekmeği', 'koy ekmegi', 'kepek ekmeği', 'tam buğday ekmeği', 'tost ekmeği', 'çıtır ekmek', 'ekşi mayalı ekmek']
        },
        {
          label: 'Domates & Salatalık',
          share: 3.5,
          aliases: ['domates', 'salatalık', 'salatalik', 'domates salatalık', 'söğüş', 'sogus', 'yeşillik', 'biber', 'domates salatalik', 'yesillik', 'hıyar', 'hiyar', 'çeri domates', 'ceri domates', 'yeşil biber', 'yesil biber', 'sivri biber', 'maydanoz', 'roka', 'domates söğüş', 'salatalık söğüş']
        },
        {
          label: 'Menemen',
          share: 2.7,
          aliases: ['melemen', 'menemeni', 'soğanlı menemen', 'soğansız menemen', 'kaşarlı menemen', 'sucuklu menemen', 'soganli menemen', 'sogansiz menemen', 'kasarli menemen', 'sıcak menemen', 'sicak menemen', 'tavada menemen', 'ekmek banmalık menemen', 'yumurtalı menemen', 'domatesli menemen', 'biberli menemen', 'acı menemen', 'sahanda menemen']
        },
        {
          label: 'Sucuk',
          share: 2.1,
          aliases: ['sucuğu', 'sucugu', 'sucuklu yumurta', 'kızarmış sucuk', 'tavada sucuk', 'kasap sucuk', 'sucuklar', 'kizarmis sucuk', 'sahanda sucuk', 'dana sucuk', 'kangal sucuk', 'acılı sucuk', 'acili sucuk', 'afyon sucuğu', 'kayseri sucuğu', 'sucuk tava', 'baharatlı sucuk', 'fermente sucuk']
        },
        {
          label: 'Bal & Kaymak',
          share: 1.8,
          aliases: ['bal', 'kaymak', 'bal kaymak', 'süzme bal', 'petek bal', 'manda kaymağı', 'bali', 'balı', 'kaymağı', 'kaymagi', 'suzme bal', 'manda kaymagi', 'çiçek balı', 'cicek bali', 'çam balı', 'cam bali', 'ballı kaymak', 'balli kaymak', 'petekli bal', 'köy kaymağı']
        },
        {
          label: 'Tereyağı',
          share: 1.4,
          aliases: ['tereyagi', 'tereyağ', 'tereyag', 'köy tereyağı', 'tuzlu tereyağı', 'tereyağlı ekmek', 'tereyağını', 'tereyagini', 'koy tereyagi', 'tuzlu tereyagi', 'tereyagli ekmek', 'trabzon tereyağı', 'trabzon tereyagi', 'yayık tereyağı', 'yayik tereyagi', 'doğal tereyağı', 'halis tereyağı', 'süt tereyağı']
        },
        {
          label: 'Reçel',
          share: 1.2,
          aliases: ['recel', 'reçeli', 'çilek reçeli', 'vişne reçeli', 'gül reçeli', 'marmelat', 'receli', 'reçeller', 'cilek receli', 'visne receli', 'gul receli', 'kayısı reçeli', 'kayisi receli', 'incir reçeli', 'portakal reçeli', 'ev reçeli', 'ev receli', 'böğürtlen reçeli']
        },
        {
          label: 'Börek',
          share: 1.0,
          aliases: ['borek', 'böreği', 'su böreği', 'peynirli börek', 'sigara böreği', 'kol böreği', 'boregi', 'börekler', 'su boregi', 'peynirli borek', 'sigara boregi', 'kol boregi', 'kıymalı börek', 'kiymali borek', 'ıspanaklı börek', 'ispanakli borek', 'patatesli börek', 'tepsi böreği', 'kalem böreği']
        },
        {
          label: 'Poğaça',
          share: 0.8,
          aliases: ['pogaca', 'poaça', 'açma', 'acma', 'peynirli poğaça', 'sıcak poğaça', 'poğaçalar', 'poaca', 'pogaça', 'peynirli pogaca', 'sicak pogaca', 'zeytinli poğaça', 'zeytinli pogaca', 'patatesli poğaça', 'dereotlu poğaça', 'sade poğaça', 'pastane poğaçası', 'ev poğaçası', 'sıcak açma']
        },
        {
          label: 'Kuymak',
          share: 0.6,
          aliases: ['mıhlama', 'mihlama', 'muhlama', 'karadeniz kuymağı', 'tereyağlı kuymak', 'peynirli kuymak', 'kuymağı', 'kuymagi', 'mıhlaması', 'mihlamasi', 'karadeniz kuymagi', 'tereyagli kuymak', 'peynirli mıhlama', 'peynirli mihlama', 'mısır unlu kuymak', 'trabzon kuymağı', 'rize mıhlaması', 'sıcak kuymak']
        },
        {
          label: 'Pişi',
          share: 0.4,
          aliases: ['pisi', 'hamur kızartması', 'hamur kizartmasi', 'sıcak pişi', 'lokma pişi', 'yağlı ekmek', 'pişiler', 'pişisi', 'pisisi', 'sicak pisi', 'yagli ekmek', 'kızarmış hamur', 'kizarmis hamur', 'peynirli pişi', 'mayalı pişi', 'mayasız pişi', 'puf böreği', 'puf pişi']
        },
        {
          label: 'Gözleme',
          share: 0.2,
          aliases: ['gozleme', 'peynirli gözleme', 'patatesli gözleme', 'ıspanaklı gözleme', 'sac gözlemesi', 'el açması gözleme', 'gözlemeler', 'gözlemesi', 'gozlemesi', 'peynirli gozleme', 'patatesli gozleme', 'ispanakli gozleme', 'sac gozlemesi', 'el acmasi gozleme', 'kıymalı gözleme', 'kiymali gozleme', 'kaşarlı gözleme', 'sıcak gözleme']
        }
      ],
      invalid: [
        { aliases: ['kahve', 'türk kahvesi', 'filtre kahve', 'nescafe'], reason: 'Kahve genelde kahvaltıdan sonra içilir.' },
        { aliases: ['kola', 'gazoz', 'fanta', 'soğuk içecek'], reason: 'Sabah kahvaltısında asitli içecek pek sayılmaz.' },
        { aliases: ['çorba', 'corba', 'mercimek çorbası', 'işkembe'], reason: 'Klasik Türk kahvaltı sofrasının öğesi değil.' },
        { aliases: ['lahmacun', 'kebap', 'döner', 'hamburger', 'pizza'], reason: 'Bu daha çok öğle veya akşam yemeği.' },
        { aliases: ['su', 'bir bardak su'], reason: 'Su temel ihtiyaç, kahvaltıya özel değil.' },
        { aliases: ['sigara'], reason: 'Kahvaltılık yiyecek ya da içecek değil.' },
        { aliases: ['hiçbir şey', 'hicbir sey', 'yok', 'bilmem'], reason: 'Gerçek bir kahvaltılık yazmalısın.' }
      ],
      tests: [
        { in: 'Çay', expect: 'Çay' },
        { in: 'mihlama', expect: 'Kuymak' },
        { in: 'söğüş', expect: 'Domates & Salatalık' },
        { in: 'kahve', expect: 'invalid' },
        { in: 'bilinmeyen kahvaltılık xyz', expect: 'none' }
      ]
    },
    {
      id: 'q02',
      cat: 'gelenek',
      text: 'Bayramda büyüklerin söylediği bir söz söyle',
      answers: [
        { label: 'Maşallah çok büyümüşsün', share: 28.4, aliases: ['masallah cok buyumussun', 'çok büyümüşsün', 'büyümüşsün', 'kocaman olmuşsun', 'boyun uzamış', 'maşallah', 'ne çabuk büyüdün', 'cok buyumussun', 'buyumussun', 'kocaman olmussun', 'boyun uzamis', 'masallah', 'ne cabuk buyudun', 'ne kadar büyümüşsün', 'ne kadar buyumussun', 'maşallah boy atmışsın', 'koca kız olmuşsun', 'delikanlı olmuşsun'] },
        { label: 'Bayramın mübarek olsun', share: 18.4, aliases: ['bayramin mubarek olsun', 'iyi bayramlar', 'hayırlı bayramlar', 'hayirli bayramlar', 'bayramınız mübarek olsun', 'mutlu bayramlar', 'bayraminiz mubarek olsun', 'hayırlı bayramlar evladım', 'iyi bayramlar yavrum', 'bayramın kutlu olsun', 'bayramin kutlu olsun', 'nice bayramlara', 'huzurlu bayramlar', 'mübarek bayramlar', 'mubarek bayramlar', 'bayramınız kutlu olsun', 'bayraminiz kutlu olsun', 'hayırlı mutlu bayramlar'] },
        { label: 'Okul nasıl gidiyor', share: 12.2, aliases: ['okul nasil gidiyor', 'dersler nasıl', 'derslerin nasıl', 'kaçıncı sınıf oldun', 'okul bitti mi', 'sınavlar nasıl', 'dersler nasil', 'derslerin nasil', 'kacinci sinif oldun', 'sinavlar nasil', 'karne nasıl', 'karne nasil', 'okulun nasıl', 'okulun nasil', 'hangi bölümdü', 'mezun oldun mu', 'dersler iyi mi', 'okul ne zaman bitiyor'] },
        { label: 'Ne zaman evleniyorsun', share: 9.6, aliases: ['evlilik ne zaman', 'mürüvvetini görelim', 'düğün ne zaman', 'evlenmiyor musun', 'kısmetin çıkmadı mı', 'ne zaman evleneceksin', 'muruvvetini gorelim', 'dugun ne zaman', 'kismetin cikmadi mi', 'evlilik yok mu', 'sana bir kısmet bulalım', 'mürüvvetini ne zaman göreceğiz', 'başını bağlayalım', 'basini baglayalim', 'düğününüz ne zaman', 'evlenme vakti geldi', 'yok mu düğün', 'ne zaman mürüvvet'] },
        { label: 'Allah razı olsun', share: 7.0, aliases: ['allah razi olsun', 'allah kabul etsin', 'sağ ol evladım', 'berhudar ol', 'allah ömür versin', 'eksik olma', 'allah kabul etsin evladım', 'sag ol evladim', 'allah omur versin', 'allah ne muradın varsa versin', 'allah bahtını açık etsin', 'allah bahtini acik etsin', 'çok yaşa evladım', 'cok yasa', 'var ol evladım', 'allah zihin açıklığı versin', 'sağ olasın', 'sag olasin'] },
        { label: 'El öpenlerin çok olsun', share: 5.5, aliases: ['el openlerin cok olsun', 'el öpenlerin sağ olsun', 'öpenlerin çok olsun', 'el öpenlerin eksik olmasın', 'elini öpeyim', 'sağ ol yavrum', 'el openlerin sag olsun', 'openlerin cok olsun', 'el openlerin eksik olmasin', 'elini opeyim', 'sag ol yavrum', 'öpenlerin sağ olsun', 'openlerin sag olsun', 'el öpenlerin bol olsun', 'el openlerin bol olsun', 'senin de el öpenlerin çok olsun', 'el öpenin çok olsun', 'el openin cok olsun'] },
        { label: 'Nerede o eski bayramlar', share: 4.4, aliases: ['nerede o eski bayramlar', 'eski bayramlar', 'eski bayramlar kalmadı', 'nerde o eski bayramlar', 'bizim zamanımızda', 'eski bayram', 'eski bayramlar kalmadi', 'bizim zamanimizda', 'ah o eski bayramlar', 'eskiden bayramlar başkaydı', 'eskiden bayramlar baskaydi', 'eski bayramların tadı yok', 'eski bayramlarin tadi yok', 'nerde eski bayramlar', 'eski bayramlar nerede', 'bayramların eski tadı kalmadı', 'bizim çocukluğumuzda bayram', 'eskiden bayram'] },
        { label: 'Bizi hiç aramıyorsun', share: 3.6, aliases: ['bizi hic aramiyorsun', 'hiç sormuyorsun', 'gözümüz yollarda kaldı', 'ancak bayramdan bayrama', 'özledik seni', 'arayıp sormuyorsun', 'hic sormuyorsun', 'gozumuz yollarda kaldi', 'arayıp sormuyorsun hiç', 'arayip sormuyorsun', 'ozledik seni', 'yüzünü gören cennetlik', 'yuzunu goren cennetlik', 'bizi unuttun', 'hiç uğramıyorsun', 'hic ugramiyorsun', 'bayramdan bayrama geliyorsun', 'sesin soluğun çıkmıyor'] },
        { label: 'Al bakalım bayram harçlığı', share: 3.0, aliases: ['al bakalim harclik', 'harçlık', 'bayram harçlığı', 'al bu da harçlığın', 'cep harçlığı', 'şeker alırsın', 'harclik', 'bayram harcligi', 'al bu da harcligin', 'cep harcligi', 'seker alirsin', 'al bakalım harçlık', 'harçlığını al', 'harcligini al', 'kendine bir şey alırsın', 'bayram parası', 'bayram parasi', 'al şu harçlığı'] },
        { label: 'İş güç nasıl', share: 2.4, aliases: ['is guc nasil', 'iş buldun mu', 'işler nasıl', 'çalışıyor musun', 'maaşın iyi mi', 'iş nasıl gidiyor', 'is buldun mu', 'isler nasil', 'calisiyor musun', 'maasin iyi mi', 'is nasil gidiyor', 'işe girdin mi', 'ise girdin mi', 'işin gücün nasıl', 'isin gucun nasil', 'ne iş yapıyorsun', 'ne is yapiyorsun', 'atanamadın mı'] },
        { label: 'Sevgilin var mı', share: 1.8, aliases: ['sevgilin var mi', 'yok mu birileri', 'nişanlın var mı', 'görüştüğün biri var mı', 'sözlün var mı', 'sevdiğin var mı', 'nisanlin var mi', 'gorustugun biri var mi', 'sozlun var mi', 'sevdigin var mi', 'kız arkadaşın var mı', 'kiz arkadasin var mi', 'erkek arkadaşın var mı', 'erkek arkadasin var mi', 'kısmet var mı', 'kismet var mi', 'hayatında biri var mı', 'hayatinda biri var mi'] },
        { label: 'Kaç yaşına geldin', share: 1.3, aliases: ['kac yasina geldin', 'kaç yaşındasın', 'yaşın kaç oldu', 'yaşın kaç', 'büyüdün artık', 'koca adam oldun', 'kac yasindasin', 'yasin kac oldu', 'yasin kac', 'buyudun artik', 'kaç oldun sen', 'kac oldun sen', 'yaş kaç oldu', 'yas kac oldu', 'büyüdün kocaman oldun', 'kaç yaşındaydın', 'kac yasindaydin', 'yaşın ilerledi'] },
        { label: 'Ellerinden öperim', share: 0.9, aliases: ['büyüklerin ellerinden küçüklerin gözlerinden', 'büyüklerin ellerinden', 'gözlerinden öperim', 'küçüklerin gözlerinden', 'ellerinden öperiz', 'gözlerinden öperiz', 'buyuklerin ellerinden kucuklerin gozlerinden', 'buyuklerin ellerinden', 'gozlerinden operim', 'kucuklerin gozlerinden', 'ellerinden operiz', 'gozlerinden operiz', 'ellerinden öperim evladım', 'gözlerinden öperim yavrum', 'yanaklarından öperim', 'yanaklarindan operim', 'büyüklerin ellerinden öperim', 'küçüklerin gözlerinden öperim'] },
        { label: 'Sağlığın sıhhatin nasıl', share: 0.7, aliases: ['sagligin sihhatin nasil', 'nasılsın iyi misin', 'keyfin nasıl', 'afiyetin nasıl', 'sıhhatin nasıl', 'iyi misin', 'nasilsin iyi misin', 'keyfin nasil', 'afiyetin nasil', 'sihhatin nasil', 'sağlığın nasıl', 'sagligin nasil', 'keyifler nasıl', 'keyifler nasil', 'halin vaktin nasıl', 'halin vaktin nasil', 'afiyette misin', 'sağlığın yerinde mi'] },
        { label: 'Yemek ye zayıflamışsın', share: 0.5, aliases: ['yemek ye zayiflamissin', 'çok zayıflamışsın', 'zayıflamışsın', 'bir deri bir kemik', 'aç mısın', 'tabağını bitir', 'cok zayiflamissin', 'zayiflamissin', 'ac misin', 'tabagini bitir', 'hiç mi yemek yemiyorsun', 'hic mi yemek yemiyorsun', 'süzülmüşsün', 'suzulmussun', 'biraz kilo al', 'yüzün süzülmüş', 'biraz yemek ye', 'kemiklerin sayılıyor'] },
        { label: 'Askere ne zaman', share: 0.3, aliases: ['askere ne zaman gidiyorsun', 'askerlik ne zaman', 'askerlik bitti mi', 'vatan borcu', 'askere gitmedin mi', 'bedelli mi', 'askerlik ne zaman bitiyor', 'askere gidecek misin', 'tecil bitti mi', 'askerlik yaptın mı', 'askerlik yaptin mi', 'ne zaman askere', 'askerlik var mı', 'askerlik var mi', 'askere gitmiyor musun', 'askerlik nereye çıktı', 'bedelli askerlik mi', 'askerlik tecilli mi'] }
      ],
      invalid: [
        { aliases: ['günaydın', 'gunaydin', 'tünaydın'], reason: 'Bu her sabah söylenen sıradan bir selam.' },
        { aliases: ['merhaba', 'selam', 'selamün aleyküm', 'slm'], reason: 'Bayrama özgü bir büyük sözü değil.' },
        { aliases: ['afiyet olsun', 'eline sağlık'], reason: 'Bu yemek sofrasında söylenir.' },
        { aliases: ['geçmiş olsun', 'gecmis olsun'], reason: 'Bu hastalık veya kaza durumunda söylenir.' },
        { aliases: ['iyi geceler', 'tatlı rüyalar'], reason: 'Bayram ziyareti sözü değil.' },
        { aliases: ['doğum günün kutlu olsun', 'mutlu yıllar'], reason: 'Bu doğum günü kutlaması, bayram değil.' },
        { aliases: ['görüşürüz', 'hoşça kal', 'bay bay'], reason: 'Sıradan vedalaşma; bayrama özel bir kalıp dene.' }
      ],
      tests: [
        { in: 'Maşallah çok büyümüşsün', expect: 'Maşallah çok büyümüşsün' },
        { in: 'eski bayramlar', expect: 'Nerede o eski bayramlar' },
        { in: 'çok zayıflamışsın', expect: 'Yemek ye zayıflamışsın' },
        { in: 'günaydın', expect: 'invalid' }
      ]
    },
    {
      id: 'q03',
      cat: 'şehir',
      text: 'Vapurda yapılan bir şey söyle',
      answers: [
        { label: 'Simit atmak', share: 32.2, aliases: ['martıya simit atmak', 'martılara simit atmak', 'martılara simit', 'martıya simit', 'martı beslemek', 'martılara ekmek atmak', 'simit fırlatmak', 'martiya simit atmak', 'martilara simit atmak', 'martilara simit', 'martiya simit', 'marti beslemek', 'simit firlatmak', 'kuşlara simit atmak', 'kuslara simit atmak', 'martılara simit vermek', 'havada simit yakalatmak', 'martıya ekmek atmak'] },
        { label: 'Çay içmek', share: 24.6, aliases: ['cay icmek', 'vapurda çay', 'çay', 'ince belli çay içmek', 'sıcak çay içmek', 'çay söylemek', 'vapurda cay', 'cay', 'sicak cay icmek', 'cay soylemek', 'vapur çayı içmek', 'vapur cayi icmek', 'çay yudumlamak', 'demli çay içmek', 'büfeden çay almak', 'çaycıdan çay almak', 'bir bardak çay içmek', 'güvertede çay içmek'] },
        { label: 'Manzara izlemek', share: 12.8, aliases: ['boğazı izlemek', 'bogazi izlemek', 'denizi izlemek', 'denizi seyretmek', 'boğazı seyretmek', 'etrafı izlemek', 'manzara', 'bogazi seyretmek', 'etrafi izlemek', 'manzarayı seyretmek', 'manzarayi seyretmek', 'manzaraya bakmak', 'denize bakmak', 'kız kulesini izlemek', 'galata kulesini izlemek', 'köpküyü izlemek', 'dalgaları izlemek', 'ufka bakmak'] },
        { label: 'Simit yemek', share: 7.4, aliases: ['peynirli simit yemek', 'çay simit', 'simit peynir yemek', 'simit', 'simit kemirmek', 'susamlı simit yemek', 'cay simit', 'susamli simit yemek', 'vapurda simit yemek', 'çayla simit yemek', 'cayla simit yemek', 'üçgen peynirle simit', 'taze simit yemek', 'sıcak simit yemek', 'simit ısırmak', 'simit bölmek', 'simit paylaşmak', 'vapur simidi yemek'] },
        { label: 'Fotoğraf çekmek', share: 5.3, aliases: ['fotograf cekmek', 'foto çekmek', 'selfie çekmek', 'özçekim', 'video çekmek', 'hikaye atmak', 'foto cekmek', 'selfie cekmek', 'ozcekim', 'video cekmek', 'story atmak', 'fotoğraf çekilmek', 'fotograf cekilmek', 'boğaz fotoğrafı çekmek', 'manzara fotoğrafı çekmek', 'martı fotoğrafı çekmek', 'instagrama story atmak', 'resim çekmek'] },
        { label: 'Kulaklıkla müzik dinlemek', share: 4.1, aliases: ['muzik dinlemek', 'kulaklıkla müzik', 'şarkı dinlemek', 'kulaklık takmak', 'kulaklıkla şarkı', 'müzik açmak', 'müzik dinlemek', 'kulaklikla muzik', 'sarki dinlemek', 'kulaklik takmak', 'kulaklikla sarki', 'muzik acmak', 'kulaklıkla müzik dinlemek', 'kulaklikla muzik dinlemek', 'şarkı açmak', 'playlist dinlemek', 'podcast dinlemek', 'müzik dinleyip dalmak'] },
        { label: 'Güvertede sohbet etmek', share: 3.3, aliases: ['muhabbet etmek', 'güvertede konuşmak', 'arkadaşlarla sohbet', 'sohbet', 'dedikodu yapmak', 'laklak etmek', 'guvertede sohbet etmek', 'sohbet etmek', 'guvertede konusmak', 'arkadaslarla sohbet', 'arkadaşla muhabbet', 'sevgiliyle sohbet etmek', 'dertleşmek', 'dertlesmek', 'laflamak', 'gülüşmek', 'arkadaşlarla konuşmak', 'muhabbet yapmak'] },
        { label: 'Rüzgarı hissetmek', share: 2.7, aliases: ['ruzgari hissetmek', 'hava almak', 'güvertede oturmak', 'dışarıda oturmak', 'rüzgar yemek', 'serinlemek', 'guvertede oturmak', 'disarida oturmak', 'ruzgar yemek', 'deniz havası almak', 'deniz havasi almak', 'temiz hava almak', 'boğaz havası almak', 'bogaz havasi almak', 'esintiyi hissetmek', 'açık havada oturmak', 'güverteye çıkmak', 'rüzgara karşı durmak'] },
        { label: 'Kitap okumak', share: 2.2, aliases: ['gazete okumak', 'dergi okumak', 'kitap', 'roman okumak', 'okuma yapmak', 'dergi karıştırmak', 'dergi karistirmak', 'vapurda kitap okumak', 'gazete karıştırmak', 'bulmaca çözmek', 'bulmaca cozmek', 'kitap sayfası çevirmek', 'şiir okumak', 'haber okumak', 'hikaye okumak', 'kitaba dalmak', 'gazeteye bakmak', 'roman bitirmek'] },
        { label: 'Tost yemek', share: 1.7, aliases: ['vapur tostu', 'kaşarlı tost yemek', 'tost', 'sucuklu tost', 'karışık tost', 'büfeden tost', 'kasarli tost yemek', 'karisik tost', 'bufeden tost', 'vapur tostu yemek', 'kaşarlı tost', 'kasarli tost', 'büfeden tost almak', 'sıcak tost yemek', 'sicak tost yemek', 'çift kaşarlı tost', 'tost söylemek', 'vapur büfesi tostu'] },
        { label: 'Martıları izlemek', share: 1.3, aliases: ['martilari izlemek', 'martı izlemek', 'martılara bakmak', 'martıları seyretmek', 'kuşları izlemek', 'martı kovalamak', 'marti izlemek', 'martilara bakmak', 'martilari seyretmek', 'kuslari izlemek', 'marti kovalamak', 'uçan martıları izlemek', 'martıları dinlemek', 'martı sesleri dinlemek', 'karabatakları izlemek', 'martılarla bakışmak', 'kuşları seyretmek', 'martı sürüsü izlemek'] },
        { label: 'Uyuklamak', share: 0.9, aliases: ['kestirmek', 'vapurda uyumak', 'şekerleme yapmak', 'uyuklama', 'gözünü dinlendirmek', 'kafayı koymak', 'sekerleme yapmak', 'gozunu dinlendirmek', 'kafayi koymak', 'iç geçirmek', 'ic gecirmek', 'oturduğu yerde uyumak', 'cam kenarında uyumak', 'başını cama yaslamak', 'dalıp gitmek', 'uykuya dalmak', 'biraz uyumak', 'gözlerini kapatmak'] },
        { label: 'Kahve veya salep içmek', share: 0.7, aliases: ['salep içmek', 'kahve içmek', 'sıcak salep', 'türk kahvesi içmek', 'tarçınlı salep', 'salep', 'salep icmek', 'kahve icmek', 'sicak salep', 'turk kahvesi icmek', 'tarcinli salep', 'kahve', 'sahlep içmek', 'sahlep icmek', 'nescafe içmek', 'vapurda salep', 'vapurda kahve', 'sıcak kahve içmek'] },
        { label: 'Telefonla oynamak', share: 0.5, aliases: ['telefona bakmak', 'sosyal medyaya bakmak', 'telefon', 'mesajlaşmak', 'oyun oynamak', 'internette gezinmek', 'telefonla ilgilenmek', 'mesajlasmak', 'telefondan video izlemek', 'instagrama bakmak', 'whatsapp mesajlaşmak', 'telefon ekranına bakmak', 'telefonda takılmak', 'telefonda gezmek', 'haberlere bakmak', 'sosyal medyada gezinmek', 'telefon kurcalamak', 'mobil oyun oynamak'] },
        { label: 'Yunus aramak', share: 0.3, aliases: ['yunus görmek', 'yunuslara bakmak', 'yunus izlemek', 'yunus balığı aramak', 'denizde yunus', 'yunus', 'yunus gormek', 'yunus baligi aramak', 'yunusları izlemek', 'yunuslari izlemek', 'yunus sürüsü görmek', 'boğazda yunus görmek', 'bogazda yunus gormek', 'yunusları seyretmek', 'denizde yunus aramak', 'yunus geçti mi bakmak', 'yunus balığı görmek', 'yunus gözetlemek'] }
      ],
      invalid: [
        { aliases: ['yüzmek', 'yuzmek', 'denize girmek'], reason: 'Vapurun içinden denize atlanmaz.' },
        { aliases: ['balık tutmak', 'balik tutmak', 'olta atmak'], reason: 'Vapur hareket halindeyken olta atılmaz.' },
        { aliases: ['araba sürmek', 'araba kullanmak'], reason: 'Yolcu vapurunda araba sürülmez.' },
        { aliases: ['koşmak', 'kosmak', 'koşu yapmak'], reason: 'Güverte koşu pisti değildir.' },
        { aliases: ['top oynamak', 'futbol oynamak', 'maç yapmak'], reason: 'Vapurda top oynamaya yer yok.' },
        { aliases: ['ateş yakmak', 'mangal yapmak'], reason: 'Vapurda ateş yakmak yasaktır.' },
        { aliases: ['bisiklet sürmek', 'bisiklete binmek'], reason: 'Bisiklet vapura biner ama içinde sürülmez.' }
      ],
      tests: [
        { in: 'martıya simit atmak', expect: 'Simit atmak' },
        { in: 'vapurda cay', expect: 'Çay içmek' },
        { in: 'yunus balığı aramak', expect: 'Yunus aramak' },
        { in: 'yüzmek', expect: 'invalid' }
      ]
    },
    {
      id: 'q04',
      cat: 'kültür',
      text: 'Bir Türk dizisi söyle',
      answers: [
        { label: 'Kurtlar Vadisi', share: 21.6, aliases: ['kvp', 'kurtlar vadisi pusu', 'polat alemdar', 'memati', 'süleyman çakır', 'kurtlar', 'suleyman cakir', 'abdulhey', 'abdülhey', 'güllü erhan', 'laz ziya', 'aslan akbey', 'necati şaşmaz', 'necati sasmaz', 'kurtlar vadisi dizisi', 'memati baş', 'polat alemdar efsanesi', 'kurtlar vadisi kılıç', 'çakır bey'] },
        { label: 'Aşk-ı Memnu', share: 16.8, aliases: ['aski memnu', 'aşkı memnu', 'bihter', 'behlül', 'adnan ziyagil', 'firdevs hanım', 'bihter ziyagil', 'behlul', 'firdevs hanim', 'firdevs yöreoğlu', 'nihal ziyagil', 'matmazel', 'beşir ağa', 'beren saat bihter', 'kıvanç tatlıtuğ behlül', 'bihter behlül', 'aşk ı memnu', 'ask i memnu'] },
        { label: 'Muhteşem Yüzyıl', share: 13.4, aliases: ['muhtesem yuzyil', 'kanuni', 'hürrem', 'hürrem sultan', 'süleyman kanuni', 'pargalı', 'hurrem', 'hurrem sultan', 'kanuni sultan süleyman', 'pargalı ibrahim', 'pargali ibrahim', 'mahidevran', 'mihrimah sultan', 'halit ergenç', 'meryem uzerli', 'sumbul aga', 'sümbül ağa', 'muhteşem yüzyıl dizisi'] },
        { label: 'Ezel', share: 10.2, aliases: ['ramiz dayı', 'ezel dizisi', 'ömer uçak', 'eyşan', 'kenan imirzalıoğlu', 'ezel bayraktar', 'ramiz dayi', 'omer ucak', 'eysan', 'kenan imirzalioglu', 'ramiz karaeski', 'kerpeten ali', 'cengiz atay', 'tefo', 'tevfik zaim', 'dayı ezel', 'eyşan tezcan', 'tuncel kurtiz ramiz'] },
        { label: 'Leyla ile Mecnun', share: 8.2, aliases: ['leyla mecnun', 'ismail abi', 'erdal bakkal', 'mecnun çınar', 'aksakallı dede', 'kireçburnu', 'mecnun cinar', 'aksakalli dede', 'kirecburnu', 'iskender baba', 'yavuz hırsız', 'hırsız yavuz', 'ali atay', 'serkan keskin', 'ogem', 'o gemi bir gün gelecek', 'leyla ile mecnun dizisi', 'mecnun'] },
        { label: 'Avrupa Yakası', share: 6.4, aliases: ['avrupa yakasi', 'burhan altıntop', 'gaffur', 'volkan sütçüoğlu', 'aslı sütçüoğlu', 'şahika', 'burhan altintop', 'volkan sutcuoglu', 'asli sutcuoglu', 'sahika', 'gülse birsel', 'gulse birsel', 'ata demirer', 'engin günaydın', 'sütçüoğlu', 'makbule', 'kubilay', 'tanrıverdi'] },
        { label: 'Yaprak Dökümü', share: 5.0, aliases: ['yaprak dokumu', 'ali rıza bey', 'hayriye hanım', 'ferhunde', 'oğuz yaprak dökümü', 'tekinoğlu ailesi', 'ali riza bey', 'hayriye hanim', 'oguz yaprak dokumu', 'tekinoglu ailesi', 'aman ağzımızın tadı kaçmasın', 'fikret yaprak dökümü', 'leyla necla', 'necla yaprak dökümü', 'şevket yaprak dökümü', 'sevket yaprak dokumu', 'halil ergün', 'yaprak dökümü dizisi'] },
        { label: 'Behzat Ç.', share: 4.0, aliases: ['behzat c', 'behzat ç', 'bir ankara polisiyesi', 'behzat ç amir', 'behzat harun', 'behzat hayalet', 'behzat ç.', 'behzat amirim', 'behzat akbaba', 'ercüment çözer', 'ercument cozer', 'memduh başgan', 'erdal beşikçioğlu', 'erdal besikcioglu', 'savcı esra', 'ankara polisiyesi', 'cinayet büro', 'behzat amir'] },
        { label: 'Diriliş Ertuğrul', share: 3.2, aliases: ['dirilis ertugrul', 'ertuğrul', 'kuruluş osman', 'ertuğrul gazi', 'bamsı', 'turgut alp', 'ertugrul', 'kurulus osman', 'ertugrul gazi', 'bamsi', 'halime sultan', 'kayı boyu', 'kayi boyu', 'süleyman şah', 'engin altan düzyatan', 'doğan alp', 'diriliş', 'dirilis'] },
        { label: 'Arka Sokaklar', share: 2.5, aliases: ['arka sokak', 'rıza baba', 'mesut komiser', 'hüsnü çoban', 'selin komiser', 'arka sokaklar aylin', 'riza baba', 'husnu coban', 'hüsnü komiser', 'mesut güneri', 'garip kont', 'arka sokaklar zeliş', 'metin tekin çoban', 'arka sokaklar suat', 'engin komiser', 'zafer ergin', 'şevket çoruh', 'arka sokaklar dizisi'] },
        { label: 'Çukur', share: 2.1, aliases: ['cukur', 'yamaç', 'koçovalı', 'vartolu', 'idris baba', 'cumali koçovalı abi', 'yamac', 'kocovali', 'yamaç koçovalı', 'yamac kocovali', 'vartolu sadettin', 'salih koçovalı', 'idris koçovalı', 'cumali koçovalı', 'aras bulut iynemli', 'çukur evimiz', 'cukur evimiz', 'sena koçovalı'] },
        { label: 'Kızılcık Şerbeti', share: 1.7, aliases: ['kizilcik serbeti', 'kızılcık', 'doğa fatih', 'pembe hanım', 'abdullah bey', 'kıvılcım', 'kizilcik', 'doga fatih', 'pembe hanim', 'kivilcim', 'ömer ünal', 'nursema', 'kızılcık alev', 'kızılcık apo', 'kızılcık doğa', 'fatih ünal', 'kızılcık şerbeti dizisi', 'ünal ailesi'] },
        { label: 'Çocuklar Duymasın', share: 1.4, aliases: ['cocuklar duymasin', 'taş fırın erkek', 'haluk taş fırın', 'meltem karakteri', 'havuç emre', 'dominant teyze', 'tas firin erkek', 'çocuklar duymasın dizisi', 'taş fırın haluk', 'light erkek', 'çaycı hüseyin', 'cayci huseyin', 'çaycı hüseyin çaylar', 'pınar altuğ', 'tamer karadağlı', 'gönül dominant teyze', 'emine hizmetçi', 'duygusal çocuk'] },
        { label: 'Yalı Çapkını', share: 1.1, aliases: ['yali capkini', 'ferit seyran', 'ferit korhan', 'seyran şanlı', 'halis ağa', 'kazım ağa', 'halis aga', 'kazim aga', 'seyran korhan', 'suna şanlı', 'abidin yalı çapkını', 'afra saraçoğlu', 'mert ramazan demir', 'korhan yalısı', 'yalı çapkını dizisi', 'ifakat', 'orhan korhan', 'gülgün korhan'] },
        { label: 'Gibi', share: 0.9, aliases: ['gibi dizisi', 'yılmaz ilkkan', 'gibi ersoy', 'feyyaz yiğit', 'kıvanç kılınç', 'ilkkan gibi', 'yilmaz ilkkan', 'feyyaz yigit', 'kivanc kilinc', 'ahmet kürşat öçalan', 'gibi yılmaz', 'gibi yilmaz', 'exxen gibi', 'kokoreççi', 'babaanneme yedirdim', 'yamyam bölümü', 'kanuni gibi', 'yılmaz ersoy ilkkan'] },
        { label: 'Poyraz Karayel', share: 0.7, aliases: ['poyraz', 'albayım poyraz', 'ayşegül umman', 'bahri baba', 'zülfikar', 'ilker kaleli', 'albayim poyraz', 'aysegul umman', 'zulfikar', 'ahmet poyraz karayel', 'bahri umman', 'burçin terzioğlu', 'burcin terzioglu', 'sinan karayel', 'poyraz karayel sefer', 'taşkafa', 'sadreddin', 'celil nalçakan'] },
        { label: 'Bizimkiler', share: 0.5, aliases: ['bizimkiler dizisi', 'katil yavuz', 'sabri bey', 'bizimkiler cemil', 'bizimkiler sevim', 'apartman dizisi', 'benim adım cemil', 'benim adim cemil', 'sevim koş', 'sevim kos', 'kapıcı cafer', 'kapici cafer', 'halil pazarlama', 'bizimkiler şükrü', 'bizimkiler sukru', 'dunkof', 'bizimkiler katil', 'şale apartmanı'] },
        { label: 'Ekmek Teknesi', share: 0.3, aliases: ['ekmek teknesi dizisi', 'nusret baba', 'heredot cevdet', 'ekmek teknesi kirli', 'ekmek teknesi jale', 'fırıncı nusret', 'firinci nusret', 'savaş dinçel', 'savas dincel', 'peker açıkalın', 'cengiz küçükkayvaz', 'ekmek teknesi korkut', 'ekmek teknesi celal', 'fırın dizisi', 'mahalle kahvesi', 'herodot cevdet', 'nusret babanın kızları', 'ekmek teknesi'] }
      ],
      invalid: [
        { aliases: ['breaking bad', 'better call saul'], reason: 'Bu yabancı (ABD) bir dizi.' },
        { aliases: ['game of thrones', 'taht oyunları'], reason: 'Bu yabancı bir dizi, Türk dizisi değil.' },
        { aliases: ['friends', 'how i met your mother', 'the office'], reason: 'Bu yabancı bir komedi dizisi.' },
        { aliases: ['recep ivedik', 'gora', 'yahşi batı'], reason: 'Bu bir sinema filmi, dizi değil.' },
        { aliases: ['hababam sınıfı', 'hababam sinifi', 'tosun paşa'], reason: 'Bu klasik bir sinema filmi, dizi değil.' },
        { aliases: ['survivor', 'masterchef', 'o ses türkiye'], reason: 'Bu bir yarışma programı, dizi değil.' },
        { aliases: ['müge anlı', 'muge anli', 'esra erol'], reason: 'Bu bir gündüz kuşağı programı, dizi değil.' }
      ],
      tests: [
        { in: 'Kurtlar Vadisi', expect: 'Kurtlar Vadisi' },
        { in: 'aski memnu', expect: 'Aşk-ı Memnu' },
        { in: 'heredot cevdet', expect: 'Ekmek Teknesi' },
        { in: 'Breaking Bad', expect: 'invalid' }
      ]
    },
    {
      id: 'q05',
      cat: 'aile',
      text: 'Annelerin en sık söylediği bir sözü söyle',
      answers: [
        { label: 'Üşüteceksin', share: 18.0, aliases: ['usuteceksin', 'üşürsün', 'usursun', 'hırkanı al', 'hirkani al', 'üstüne bir şey al', 'kalın giyin', 'ustune bir sey al', 'kalin giyin', 'montunu giy', 'ceketini al', 'hava soğuk', 'hava soguk', 'üşüyeceksin', 'usuyeceksin', 'atlet giydin mi', 'atletini giy', 'sıkı giyin'] },
        { label: 'Yemek yedin mi', share: 14.0, aliases: ['yemek yedinmi', 'aç mısın', 'karnın aç mı', 'bir şey yedin mi', 'yemeğini yedin mi', 'aç kalma', 'ac misin', 'karnin ac mi', 'bir sey yedin mi', 'yemegini yedin mi', 'ac kalma', 'karnını doyurdun mu', 'karnini doyurdun mu', 'yemek hazırlayayım mı', 'sofra hazır', 'sofra hazir', 'yemeğe gel', 'tabağını bitir'] },
        { label: 'Odanı topla', share: 12.4, aliases: ['odani topla', 'bu oda ne hal', 'dağınıklığı topla', 'yatağını topla', 'ortalıgı topla', 'odanı temizle', 'daginikligi topla', 'yatagini topla', 'ortalığı topla', 'ortaligi topla', 'odani temizle', 'odan ahır gibi', 'odan ahir gibi', 'kıyafetlerini katla', 'dolabını düzelt', 'masanı topla', 'şu odanın haline bak', 'evini topla'] },
        { label: 'Sen de kuyuya atlar mısın', share: 10.2, aliases: ['arkadaşın kuyuya atlasa sen de atlar mısın', 'kuyuya atlasa atlar mısın', 'herkes atlasa sen de atlar mısın', 'o atlasa sen de atlar mısın', 'kuyuya atlasa', 'arkadasin kuyuya atlasa', 'herkes atlasa sen de mi', 'sen de kuyuya atlar misin', 'kuyuya atlasa sen de mi atlayacaksın', 'camdan atlasa sen de atlar mısın', 'herkes yapsa sen de mi yapacaksın', 'başkasına bakma', 'baskasina bakma', 'elalem atlasa sen de mi', 'arkadaşın camdan atlasa', 'kuyuya atlamak', 'onlar atlasa sen de atlar mısın', 'kuyuya atlar misin'] },
        { label: 'Eve gelince konuşuruz', share: 8.4, aliases: ['eve gelince konusuruz', 'eve gidince görürsün', 'akşam baban gelince', 'hele bir eve gel', 'baban duymasın', 'evde görüşürüz', 'eve gidince gorursun', 'aksam baban gelince', 'baban duymasin', 'evde gorusuruz', 'babana söyleyeceğim', 'babana soyleyecegim', 'eve gidince sorarım sana', 'hele eve bir gidelim', 'evde hesabını sorarım', 'akşam babana anlatırım', 'eve varınca görüşürüz', 'evde konuşacağız'] },
        { label: 'Sen bilirsin', share: 6.4, aliases: ['sen bilirsin artik', 'kendi bilirsin', 'nasıl istersen', 'ben karışmam', 'bana sorma', 'keyfin bilir', 'nasil istersen', 'ben karismam', 'kendin bilirsin', 'ne halin varsa gör', 'ne halin varsa gor', 'istediğini yap', 'istedigini yap', 'sonra ağlama', 'sonra bana gelme', 'iyi sen bilirsin', 'peki sen bilirsin', 'kafana göre yap'] },
        { label: 'Ben sana demiştim', share: 5.2, aliases: ['ben sana demistim', 'demedim mi', 'söylemiştim', 'dinlemedin ki', 'sözümü dinle', 'ben bilirim', 'soylemistim', 'sozumu dinle', 'ben sana söylemiştim', 'ben sana soylemistim', 'anne sözü dinle', 'anne sozu dinle', 'beni dinlemedin', 'dediğim çıktı', 'dedigim cikti', 'haklı çıktım', 'ben demedim mi sana', 'sözüme geldin mi'] },
        { label: 'Bu saatte nereye', share: 4.4, aliases: ['bu saatte nereye gidiyorsun', 'nereye böyle', 'saat kaç oldu', 'geç kalma', 'hava karardı', 'akşam oldu', 'nereye boyle', 'saat kac oldu', 'gec kalma', 'hava karardi', 'aksam oldu', 'akşam ezanı okunmadan evde ol', 'gece gece nereye', 'bu vakitte nereye', 'kaçta geleceksin', 'kacta geleceksin', 'çok geç kalma', 'erken gel'] },
        { label: 'Terlik giy', share: 3.8, aliases: ['terlik giymedin mi', 'ayağına terlik giy', 'yalınayak gezme', 'yerler soğuk', 'çıplak ayak gezme', 'terliğini giy', 'ayagina terlik giy', 'yalinayak gezme', 'yerler soguk', 'ciplak ayak gezme', 'terligini giy', 'betona basma', 'taşlara basma', 'yalın ayak dolaşma', 'terliksiz gezme', 'ayağını üşütürsün', 'terliklerini giy', 'soğuk yere basma'] },
        { label: 'Elini yıka', share: 3.4, aliases: ['elini yika', 'ellerini yıka', 'dışarıdan geldin elini yıka', 'sabunla yıka', 'temizle elini', 'yemekten önce elini yıka', 'ellerini yika', 'disaridan geldin elini yika', 'sabunla yika', 'yemekten once elini yika', 'elini yüzünü yıka', 'elini yuzunu yika', 'ellerini sabunla', 'üstünü değiştir elini yıka', 'mikrop kaparsın', 'ellerini yıkadın mı', 'el yıkamadan sofraya oturma', 'git elini yıka'] },
        { label: 'Ders çalış', share: 3.0, aliases: ['ders calis', 'dersini çalış', 'ödevini yap', 'sınavın yok mu', 'kitap aç biraz', 'hep oyun', 'dersini calis', 'odevini yap', 'sinavin yok mu', 'kitap ac biraz', 'git ders çalış', 'git ders calis', 'ödevlerin bitti mi', 'odevlerin bitti mi', 'biraz test çöz', 'biraz test coz', 'hiç ders çalışmıyorsun', 'kalk dersinin başına'] },
        { label: 'Telefonu bırak', share: 2.6, aliases: ['telefonu birak', 'elinden düşürme şu telefonu', 'gözün bozulacak', 'hep telefon', 'ekrana bakma', 'kapat şunu', 'elinden dusurme su telefonu', 'gozun bozulacak', 'kapat sunu', 'bırak şu telefonu', 'birak su telefonu', 'telefonla oynamayı bırak', 'bilgisayarı kapat', 'bilgisayari kapat', 'gözlerin dört oldu', 'telefona gömüldün yine', 'yatarken telefonu bırak', 'şu telefonu elinden bırak'] },
        { label: 'Aradığımda aç', share: 2.2, aliases: ['aradigimda ac', 'telefonunu aç', 'meraktan öldüm', 'haber ver', 'varınca ara', 'mesaj at', 'telefonunu ac', 'meraktan oldum', 'varinca ara', 'arayınca aç şu telefonu', 'arayinca ac su telefonu', 'neden açmıyorsun telefonu', 'telefonun neden sessizde', 'gittiğinde haber ver', 'merak ediyorum', 'aklın bende kalmasın ara', 'beni habersiz bırakma', 'telefonuna bak'] },
        { label: 'Misafir gelecek', share: 1.8, aliases: ['misafir gelecek uslu dur', 'evin halini görsünler', 'ayıp olur', 'misafir yanında', 'düzgün otur', 'saçını tara', 'evin halini gorsunler', 'ayip olur', 'misafir yaninda', 'duzgun otur', 'sacini tara', 'misafire dokunma', 'salona girme', 'misafirlik koltuklar', 'evimize misafir geliyor', 'uslu dur misafir var', 'hoş geldiniz de', 'misafirin yanında şımarma'] },
        { label: 'Dua et', share: 1.4, aliases: ['dua et evladım', 'allah yardımcın olsun', 'besmele çek', 'duam seninle', 'hayırlısı olsun', 'şükret', 'dua et evladim', 'allah yardimcin olsun', 'besmele cek', 'hayirlisi olsun', 'sukret', 'allah korusun', 'dualarım seninle', 'dualarim seninle', 'namazını kıl', 'allah zihin açıklığı versin yavrum', 'bismillah de', 'şükür et'] },
        { label: 'Çorap giy', share: 1.0, aliases: ['corap giy', 'çorabını giy', 'ayağın üşür', 'kalın çorap giy', 'böbreklerin üşür', 'çorapsız gezme', 'corabini giy', 'ayagin usur', 'kalin corap giy', 'bobreklerin usur', 'corapsiz gezme', 'ayağına çorap giy', 'ayagina corap giy', 'çoraplarını çıkarıp atma', 'yün çorap giy', 'karnın ağrır çorap giy', 'ayağından soğuk alırsın', 'çorapsız dolaşma'] },
        { label: 'Kapıyı kilitle', share: 0.8, aliases: ['kapiyi kilitle', 'kapıyı iyi kapat', 'anahtarı unutma', 'kapıyı çek', 'kapiyi iyi kapat', 'anahtari unutma', 'kapiyi cek', 'anahtarını aldın mı', 'anahtarini aldin mi', 'kapıyı iki kere kilitle', 'kapıyı kilitle', 'kapıyı kilitledin mi', 'kapiyi kilitledin mi', 'kapı kilitli mi', 'kapıyı sürgüle', 'kapıyı kontrol et', 'çelik kapıyı kilitle', 'kapi kilitli mi', 'kapıyı kilitlemeyi unutma'] },
        { label: 'Yine mi dışarı', share: 0.6, aliases: ['yine mi disari', 'evde otur biraz', 'otel gibi kullanıyorsun', 'dışarıda ne var', 'her gün dışarı', 'evde dur', 'otel gibi kullaniyorsun', 'disarida ne var', 'her gun disari', 'evi otel yaptın', 'evi otel yaptin', 'bir gün de evde otur', 'bir gun de evde otur', 'dışarıda ne buluyorsun', 'yine nereye gidiyorsun', 'daha yeni geldin', 'sokakta ne var', 'evde yüzünü göremiyoruz'] },
        { label: 'Sırtın terli', share: 0.4, aliases: ['sirtin terli', 'terli terli su içme', 'sırtına havlu koy', 'cereyanda kalma', 'rüzgar yeme', 'hasta olacaksın', 'terli terli su icme', 'sirtina havlu koy', 'ruzgar yeme', 'hasta olacaksin', 'soğuk su içme', 'soguk su icme', 'terin soğumasın', 'terin sogumasin', 'üstünü değiştir terlisin', 'yel vurur', 'cereyanda durma', 'terli gezme'] }
      ],
      invalid: [
        { aliases: ['günaydın', 'gunaydin', 'tünaydın'], reason: 'Bu her sabah söylenen sıradan bir selam.' },
        { aliases: ['iyi geceler', 'tatlı rüyalar'], reason: 'Annelere özgü ikonik bir uyarı cümlesi değil.' },
        { aliases: ['kolay gelsin', 'iyi çalışmalar'], reason: 'Bu iş veya okul ortamında söylenen bir dilek.' },
        { aliases: ['afiyet olsun', 'eline sağlık'], reason: 'Sofrada söylenen genel bir nezaket sözü.' },
        { aliases: ['hoş geldin', 'güle güle'], reason: 'Karşılama veya uğurlama sözü, anne uyarısı değil.' },
        { aliases: ['tebrik ederim', 'başarılar'], reason: 'Kutlama sözü; annelerin klasik kalıbı değil.' }
      ],
      tests: [
        { in: 'Üşüteceksin', expect: 'Üşüteceksin' },
        { in: 'usuteceksin', expect: 'Üşüteceksin' },
        { in: 'hirkani al', expect: 'Üşüteceksin' },
        { in: 'günaydın', expect: 'invalid' }
      ]
    },
    {
      id: 'q06',
      cat: 'gelenek',
      text: 'Misafire ikram edilen bir şey söyle',
      answers: [
        { label: 'Çay', share: 29.8, aliases: ['cay', 'çayı', 'demli çay', 'tavşan kanı çay', 'ince belli çay', 'sıcak çay', 'cayi', 'demli cay', 'tavsan kani cay', 'sicak cay', 'taze çay', 'taze cay', 'siyah çay', 'bir bardak çay', 'kağıt helva yanı çay', 'misafir çayı', 'semaver çayı', 'demlik çay'] },
        { label: 'Türk kahvesi', share: 21.8, aliases: ['turk kahvesi', 'kahve', 'orta kahve', 'şekerli kahve', 'sade kahve', 'fincan kahve', 'sekerli kahve', 'bol köpüklü kahve', 'bol kopuklu kahve', 'köpüklü türk kahvesi', 'kopuklu turk kahvesi', 'dibek kahvesi', 'menengiç kahvesi', 'damla sakızlı kahve', 'az şekerli kahve', 'bir fincan kahve', 'misafir kahvesi', 'cezve kahvesi'] },
        { label: 'Kolonya', share: 10.2, aliases: ['limon kolonyası', 'kolonya tutmak', 'kolonyası', 'tütün kolonyası', 'lavanta kolonyası', 'el kolonyası', 'limon kolonyasi', 'kolonyasi', 'tutun kolonyasi', 'lavanta kolonyasi', 'el kolonyasi', 'bayram kolonyası', 'bayram kolonyasi', 'mandalina kolonyası', 'zeytin çiçeği kolonyası', 'kolonya dökmek', 'kolonya ikramı', '80 derece kolonya'] },
        { label: 'Lokum', share: 8.2, aliases: ['güllü lokum', 'fıstıklı lokum', 'türk lokumu', 'çifte kavrulmuş', 'lokumu', 'kahve yanı lokum', 'gullu lokum', 'fistikli lokum', 'turk lokumu', 'cifte kavrulmus', 'kahve yani lokum', 'çifte kavrulmuş lokum', 'kuş lokumu', 'kus lokumu', 'narlı lokum', 'cevizli lokum', 'hindistan cevizli lokum', 'fındıklı lokum'] },
        { label: 'Kuruyemiş', share: 6.2, aliases: ['kuruyemis', 'çerez', 'cerez', 'fındık fıstık', 'çekirdek', 'badem kaju', 'findik fistik', 'cekirdek', 'karışık kuruyemiş', 'karisik kuruyemis', 'karışık çerez', 'karisik cerez', 'leblebi', 'antep fıstığı', 'antep fistigi', 'fındık', 'badem', 'çerez tabağı'] },
        { label: 'Kek & pasta', share: 5.4, aliases: ['kek', 'pasta', 'anne keki', 'kakaolu kek', 'yaş pasta', 'dilim kek', 'yas pasta', 'ev keki', 'havuçlu tarçınlı kek', 'havuclu kek', 'limonlu kek', 'mozaik pasta', 'ağlayan pasta', 'aglayan pasta', 'ıslak kek', 'islak kek', 'meyveli kek', 'çikolatalı pasta'] },
        { label: 'Meyve', share: 4.8, aliases: ['meyve tabağı', 'elma portakal', 'mandalina', 'üzüm', 'mevsim meyvesi', 'soyulmuş meyve', 'meyve tabagi', 'uzum', 'soyulmus meyve', 'dilimlenmiş elma', 'muz', 'çilek', 'cilek', 'kiraz', 'karpuz kavun', 'portakal', 'elma', 'karışık meyve'] },
        { label: 'Börek', share: 4.0, aliases: ['borek', 'su böreği', 'peynirli börek', 'sigara böreği', 'tepsi böreği', 'el açması börek', 'su boregi', 'peynirli borek', 'sigara boregi', 'tepsi boregi', 'el acmasi borek', 'kol böreği', 'kol boregi', 'patatesli börek', 'ıspanaklı börek', 'kıymalı börek', 'gül böreği', 'sıcak börek'] },
        { label: 'Çikolata', share: 3.0, aliases: ['cikolata', 'madlen', 'bayram çikolatası', 'bitter çikolata', 'sütlü çikolata', 'kutu çikolata', 'bayram cikolatasi', 'bitter cikolata', 'sutlu cikolata', 'kutu cikolata', 'madlen çikolata', 'madlen cikolata', 'fındıklı çikolata', 'fıstıklı çikolata', 'ikramlık çikolata', 'şeker çikolata', 'bonbon şeker', 'bayram şekeri'] },
        { label: 'Baklava', share: 2.0, aliases: ['fıstıklı baklava', 'cevizli baklava', 'şerbetli baklava', 'şerbetli tatlı', 'ev baklavası', 'sütlü nuriye', 'fistikli baklava', 'serbetli baklava', 'serbetli tatli', 'ev baklavasi', 'sutlu nuriye', 'soğuk baklava', 'soguk baklava', 'bayram baklavası', 'tepsi baklava', 'fıstık şöbiyet', 'kuru baklava', 'antep baklavası'] },
        { label: 'Kısır', share: 1.4, aliases: ['kisir', 'kısır salatası', 'gün kısırı', 'bulgur kısırı', 'nar ekşili kısır', 'marullu kısır', 'kisir salatasi', 'gun kisiri', 'bulgur kisiri', 'nar eksili kisir', 'marullu kisir', 'altın günü kısırı', 'mercimek köftesi', 'mercimek koftesi', 'bol yeşillikli kısır', 'salçalı kısır', 'limonlu kısır', 'kısır tabağı'] },
        { label: 'Poğaça', share: 1.0, aliases: ['pogaca', 'peynirli poğaça', 'dereotlu poğaça', 'sıcak poğaça', 'ev poğaçası', 'tuzlu poğaça', 'peynirli pogaca', 'dereotlu pogaca', 'sicak pogaca', 'ev pogacasi', 'tuzlu pogaca', 'zeytinli poğaça', 'patatesli poğaça', 'mayalı poğaça', 'mayasız poğaça', 'yumuşak poğaça', 'susamlı poğaça', 'anne poğaçası'] },
        { label: 'Kurabiye', share: 0.8, aliases: ['tuzlu kurabiye', 'un kurabiyesi', 'elmalı kurabiye', 'tarçınlı kurabiye', 'kurabiyeler', 'bisküvi', 'elmali kurabiye', 'tarcinli kurabiye', 'biskuvi', 'tatlı kurabiye', 'tatli kurabiye', 'damla çikolatalı kurabiye', 'anne kurabiyesi', 'ev kurabiyesi', 'kuru pasta', 'tuzlu kuru pasta', 'susamlı kurabiye', 'çay kurabiyesi'] },
        { label: 'Şerbet', share: 0.6, aliases: ['serbet', 'osmanlı şerbeti', 'gül şerbeti', 'vişne şerbeti', 'soğuk şerbet', 'lohusa şerbeti', 'osmanli serbeti', 'gul serbeti', 'visne serbeti', 'soguk serbet', 'lohusa serbeti', 'reyhan şerbeti', 'reyhan serbeti', 'demirhindi şerbeti', 'kızılcık şerbeti', 'ramazan şerbeti', 'ev şerbeti', 'meyve şerbeti'] },
        { label: 'Ayran', share: 0.4, aliases: ['soğuk ayran', 'köpüklü ayran', 'yayık ayranı', 'naneli ayran', 'ev ayranı', 'bir bardak ayran', 'soguk ayran', 'kopuklu ayran', 'yayik ayrani', 'ev ayrani', 'tuzlu ayran', 'yoğurt ayranı', 'köy ayranı', 'koy ayrani', 'bol köpüklü ayran', 'buz gibi ayran', 'açık ayran', 'ayran ikramı'] },
        { label: 'Cezerye', share: 0.2, aliases: ['havuç cezeryesi', 'fıstıklı cezerye', 'cevizli cezerye', 'mersin cezeryesi', 'cezeryesi', 'tatlı cezerye', 'havuc cezeryesi', 'fistikli cezerye', 'tatli cezerye', 'fındıklı cezerye', 'findikli cezerye', 'hindistan cevizli cezerye', 'adana cezeryesi', 'havuçlu cezerye', 'dilim cezerye', 'atom cezerye', 'sarma cezerye', 'cezerye tatlısı'] }
      ],
      invalid: [
        { aliases: ['hamburger', 'pizza', 'fast food'], reason: 'Ev ziyaretinde klasik misafir ikramı sayılmaz.' },
        { aliases: ['ilaç', 'ilac', 'ağrı kesici'], reason: 'İlaç ikram edilmez, ihtiyaç halinde verilir.' },
        { aliases: ['fatura', 'para', 'harçlık'], reason: 'Bu yiyecek veya içecek ikramı değil.' },
        { aliases: ['sigara', 'puro'], reason: 'Klasik Türk misafir ikramı yiyecek ve içecektir.' },
        { aliases: ['kuru fasulye', 'pilav', 'işkembe'], reason: 'Bu ikramlık değil, ana öğün yemeği.' },
        { aliases: ['bulaşık', 'deterjan'], reason: 'İkram edilebilir bir şey değil.' }
      ],
      tests: [
        { in: 'Türk kahvesi', expect: 'Türk kahvesi' },
        { in: 'turk kahvesi', expect: 'Türk kahvesi' },
        { in: 'çerez', expect: 'Kuruyemiş' },
        { in: 'hamburger', expect: 'invalid' }
      ]
    },
    {
      id: 'q07',
      cat: 'şehir',
      text: 'Dolmuşta ya da otobüste sık duyulan bir söz söyle',
      answers: [
        { label: 'İnecek var', share: 26.0, aliases: ['inecek var kaptan', 'inecek', 'inicek var', 'inecek var şoför bey', 'sağda ineceğim', 'durakta inecek var', 'inecek var sofor bey', 'sagda inecegim', 'kaptan inecek var', 'şoför bey inecek var', 'inicek', 'inecek var usta', 'önde inecek var', 'durakta ineceğim', 'inecek var abi', 'burada inecek var', 'sağda inecek var', 'sagda inecek var'] },
        { label: 'Arkaya doğru ilerleyelim', share: 18.0, aliases: ['arkaya dogru ilerleyelim', 'arkaya geçelim', 'arkalar boş', 'arkaya ilerleyin', 'orta kapıya doğru', 'arkada yer var', 'arkaya gecelim', 'arkalar bos', 'orta kapiya dogru', 'arkaya doğru yürüyelim', 'arkaya dogru yuruyelim', 'arkalar bomboş', 'arkalar bombos', 'ön tarafı boşaltalım', 'arkaya doğru kayalım', 'koridorda ilerleyelim', 'arkaya geçin lütfen', 'beyler bayanlar arkaya'] },
        { label: 'Müsait bir yerde', share: 15.0, aliases: ['musait bir yerde', 'müsait bir yerde inebilir miyim', 'müsait yerde', 'köşede ineceğim', 'ışıklarda duralım', 'şurada inebilir miyim', 'musait bir yerde inebilir miyim', 'musait yerde', 'kosede inecegim', 'isiklarda duralim', 'surada inebilir miyim', 'müsait bir yerde indirir misin', 'musait bir yerde indirir misin', 'sağda müsait bir yerde', 'sagda musait bir yerde', 'köşeyi dönünce müsait yerde', 'ileride müsait bir yerde', 'müsait yerde ineyim'] },
        { label: 'Parayı uzatır mısınız', share: 10.0, aliases: ['parayi uzatir misiniz', 'uzatır mısınız', 'bir kişi uzatır mısınız', 'şu parayı uzat', 'iki kişi alır mısın', 'ücreti uzat', 'uzatir misiniz', 'bir kisi uzatir misiniz', 'su parayi uzat', 'iki kisi alir misin', 'ucreti uzat', 'şunu uzatır mısınız', 'sunu uzatir misiniz', 'bir tam bir öğrenci alır mısın', 'bir kişi alır mısınız', 'elden ele uzatalım', 'parayı iletir misiniz', 'şoföre uzatır mısın'] },
        { label: 'Bakiye yetersiz', share: 8.0, aliases: ['bakiye yetersiz', 'yetersiz bakiye', 'kart basmadı', 'akbil bitmiş', 'istanbulkart bitti', 'para yok kartta', 'kart basmadi', 'akbil bitmis', 'kartta bakiye yok', 'bakiye bitmiş', 'bakiye bitmis', 'akbilde para kalmamış', 'kartımda para bitti', 'fazla akbili olan var mı', 'kartta para kalmamış', 'bakiye yetersiz sesi', 'yetersiz bakiye uyarısı', 'kartım boş'] },
        { label: 'Kapı açılsın', share: 6.0, aliases: ['kapi acilsin', 'arka kapı', 'kaptan arka kapı', 'orta kapıyı açar mısın', 'kapıyı aç', 'düğmeye bastım', 'arka kapi', 'kaptan arka kapi', 'orta kapiyi acar misin', 'kapiyi ac', 'dugmeye bastim', 'şoför bey arka kapı', 'sofor bey arka kapi', 'orta kapı kaptan', 'orta kapi kaptan', 'kapıyı açar mısınız', 'kapiyi acar misiniz', 'arka kapıyı aç'] },
        { label: 'Biraz sıkışalım', share: 5.0, aliases: ['biraz sikisalim', 'yer açalım', 'sıkışın biraz', 'kapı önünü boşaltalım', 'inip binecekler var', 'kenara çekilin', 'yer acalim', 'sikisin biraz', 'kapi onunu bosaltalim', 'kenara cekilin', 'kapı ağzında durmayalım', 'kapi agzinda durmayalim', 'içeri doğru sıkışalım', 'iceri dogru sikisalim', 'dışarıda kalanlar var', 'bir adım içeri', 'basamakta durmayın', 'kapı kapansın çekilin'] },
        { label: 'Üstü kalsın', share: 3.2, aliases: ['ustu kalsin', 'para üstü', 'para üstü gelmedi', 'bozuk yok mu', 'üstü gelmedi', 'kaç lira oldu', 'para ustu', 'para ustu gelmedi', 'ustu gelmedi', 'kac lira oldu', 'para üstünü unuttunuz', 'para ustunu unuttunuz', 'bozuk para var mı', 'bozuk para var mi', 'elli liranın üstü', 'para üstü uzatır mısınız', 'ücret ne kadar', 'üstü gelmedi kaptan'] },
        { label: 'Yer verir misiniz', share: 2.4, aliases: ['yer verir misiniz', 'yaşlıya yer', 'hamileye yer', 'oturur musunuz teyze', 'gençler yer verin', 'buyurun oturun', 'yasliya yer', 'teyzeye yer verin', 'amca buyur otur', 'teyze gel otur', 'yer vereyim', 'şöyle oturun', 'soyle oturun', 'yaşlılara yer verelim', 'çocuklu kadına yer ver', 'kalkıp yer vermek', 'buyur abla otur', 'gençlik ölmüş yer veren yok'] },
        { label: 'Kartı okutun', share: 1.8, aliases: ['karti okutun', 'akbil basın', 'kartı bas', 'öğrenci mi tam mı', 'basmayan var mı', 'kart geçmedi', 'akbil basin', 'karti bas', 'ogrenci mi tam mi', 'basmayan var mi', 'kart gecmedi', 'akbil uzatır mısınız', 'akbil basar mısınız', 'akbil basar misiniz', 'kartınızı okutun', 'kartinizi okutun', 'ücret ödemeyen var mı', 'bir tam basar mısın'] },
        { label: 'Şuradan geçer mi', share: 1.4, aliases: ['suradan gecer mi', 'buradan geçiyor mu', 'taksimden geçer mi', 'kadıköye gider mi', 'nereden dönüyor', 'güzergah', 'buradan geciyor mu', 'taksimden gecer mi', 'kadikoye gider mi', 'nereden donuyor', 'guzergah', 'meydandan geçer mi', 'meydandan gecer mi', 'hastaneden geçiyor mu', 'metrobüse gider mi', 'sahilden geçer mi', 'bu duraktan geçiyor mu', 'çarşıdan geçer mi'] },
        { label: 'Camı açalım', share: 1.0, aliases: ['cami acalim', 'camı kapat', 'çok sıcak', 'hava alalım', 'camı açar mısın', 'havasız kaldı', 'cami kapat', 'cok sicak', 'hava alalim', 'cami acar misin', 'havasiz kaldi', 'pencereyi açar mısınız', 'pencereyi acar misiniz', 'camı kapatır mısın cereyan yaptı', 'cami kapatir misin', 'içerisi çok havasız', 'şu camı aralayalım', 'camı biraz aç'] },
        { label: 'Şoför bey klima', share: 0.8, aliases: ['sofor bey klima', 'klimayı açar mısınız', 'klima çalışmıyor mu', 'çok sıcak oldu', 'klimayı kapat', 'ısıtıcıyı aç', 'klimayi acar misiniz', 'klima calismiyor mu', 'cok sicak oldu', 'klimayi kapat', 'isiticiyi ac', 'kaptan klimayı aç', 'kaptan klimayi ac', 'klima bozuk mu', 'donduk klimayı kapat', 'piştik klimayı aç', 'kaloriferi aç kaptan', 'klima açsana kaptan'] },
        { label: 'Bu araç nereye gidiyor', share: 0.6, aliases: ['bu arac nereye gidiyor', 'nereye gidiyor', 'son durak neresi', 'buraya gider mi', 'karşıya geçer mi', 'bu hat nereye', 'karsiya gecer mi', 'bu otobüs nereye gidiyor', 'bu otobus nereye gidiyor', 'bu dolmuş nereye gider', 'bu dolmus nereye gider', 'son durağı neresi', 'son duragi neresi', 'hangi yöne gidiyor', 'bu minibüs nereye gidiyor', 'nereye kadar gidiyor', 'bu araç nereden geçiyor', 'son durak mı'] },
        { label: 'Aktarma var mı', share: 0.4, aliases: ['aktarma var mi', 'aktarma geçiyor mu', 'aktarma yapar mı', 'ücretsiz aktarma', 'metroya aktarma', 'aktarma', 'aktarma geciyor mu', 'aktarma yapar mi', 'ucretsiz aktarma', 'aktarma aldı mı', 'aktarma aldi mi', 'metrobüse aktarma var mı', 'vapura aktarma', 'marmaraya aktarma', 'aktarma süresi', 'aktarma basıyor mu', 'buradan aktarma yapılır mı', 'ikinci aktarma'] },
        { label: 'Durak geçti', share: 0.2, aliases: ['durak gecti', 'durağı kaçırdım', 'basmadın mı', 'durmadı', 'bir sonraki durak', 'az önce inecektim', 'duragi kacirdim', 'basmadin mi', 'durmadi', 'az once inecektim', 'kaptan durağı geçtin', 'kaptan duragi gectin', 'inecektim durmadın', 'inecektim durmadin', 'durakta durmadı', 'durağı geçtik şoför bey', 'yanlış durakta indim', 'durağımı kaçırdım'] }
      ],
      invalid: [
        { aliases: ['günaydın', 'iyi akşamlar'], reason: 'Sıradan selamlaşma, toplu taşımaya özgü kalıp değil.' },
        { aliases: ['hesap lütfen', 'garson'], reason: 'Bu restoranda söylenen bir ifade.' },
        { aliases: ['uçuşumuz başlamıştır', 'kemerlerinizi bağlayın'], reason: 'Bu uçakta duyulan bir anons.' },
        { aliases: ['bilet kontrol', 'pasaport lütfen'], reason: 'Bu havaalanı veya tren garında duyulur.' },
        { aliases: ['indirim var mı', 'son fiyat'], reason: 'Bu pazarda ya da mağazada söylenir.' },
        { aliases: ['el öpenlerin çok olsun', 'iyi bayramlar'], reason: 'Bayram ziyaretinde söylenen bir söz.' }
      ],
      tests: [
        { in: 'İnecek var', expect: 'İnecek var' },
        { in: 'inicek var', expect: 'İnecek var' },
        { in: 'arka kapı', expect: 'Kapı açılsın' },
        { in: 'hesap lütfen', expect: 'invalid' }
      ]
    },
    {
      id: 'q08',
      cat: 'şehir',
      text: 'Bir İstanbul semti söyle',
      answers: [
        { label: 'Kadıköy', share: 18.5, aliases: ['kadikoy', 'kadıköyde', 'kadıköye', 'caferağa', 'bahariye', 'altıyol', 'kadikoyde', 'kadikoye', 'caferaga', 'altiyol', 'boğa heykeli', 'boga heykeli', 'rasimpaşa', 'yeldeğirmeni', 'yeldegirmeni', 'fenerbahçe semti', 'kalamış', 'acibadem kadikoy', 'söğütlüçeşme', 'rıhtım kadıköy'] },
        { label: 'Beşiktaş', share: 14.5, aliases: ['besiktas', 'beşiktaşa', 'çarşı', 'ihlamur', 'akaretler', 'sinanpaşa', 'besiktasa', 'carsi', 'sinanpasa', 'beşiktaşta', 'besiktasta', 'abbasağa', 'abbasaga', 'yıldız', 'yildiz', 'dikilitaş', 'dikilitas', 'gayrettepe', 'levazım', 'levent'] },
        { label: 'Üsküdar', share: 10.5, aliases: ['uskudar', 'üsküdara', 'salacak', 'kız kulesi yanı', 'mimar sinan', 'bağlarbaşı', 'uskudara', 'kiz kulesi yani', 'baglarbasi', 'üsküdarda', 'uskudarda', 'çengelköy', 'cengelkoy', 'beylerbeyi', 'altunizade', 'çamlıca', 'camlica', 'sultantepe', 'doğancılar', 'acibadem uskudar'] },
        { label: 'Taksim / Beyoğlu', share: 9.5, aliases: ['taksim', 'beyoğlu', 'beyoglu', 'istiklal', 'cihangir', 'galata', 'taksime', 'taksimde', 'beyoğluna', 'beyogluna', 'istiklal caddesi', 'tarlabaşı', 'tarlabasi', 'tophane', 'asmalımescit', 'asmalimescit', 'çukurcuma', 'cukurcuma', 'tünel', 'kasımpaşa'] },
        { label: 'Fatih', share: 6.5, aliases: ['fatih semti', 'aksaray', 'çemberlitaş', 'sultanahmet', 'laleli', 'çapa', 'cemberlitas', 'capa', 'fatihe', 'fatihte', 'şehremini', 'sehremini', 'fındıkzade', 'findikzade', 'vefa', 'zeyrek', 'kocamustafapaşa', 'samatya', 'yedikule', 'karagümrük'] },
        { label: 'Bakırköy', share: 5.5, aliases: ['bakirkoy', 'yeşilköy', 'ataköy', 'florya', 'bakırköye', 'incirli', 'yesilkoy', 'atakoy', 'bakirkoye', 'bakırköyde', 'bakirkoyde', 'yeşilyurt', 'yesilyurt', 'zuhuratbaba', 'osmaniye bakırköy', 'kartaltepe', 'şenlikköy', 'senlikkoy', 'cevizlik', 'bakırköy meydan'] },
        { label: 'Sarıyer', share: 4.7, aliases: ['sariyer', 'tarabya', 'yeniköy', 'istinye', 'emirgan', 'maslak', 'yenikoy', 'sarıyere', 'sariyere', 'sarıyerde', 'sariyerde', 'zekeriyaköy', 'zekeriyakoy', 'büyükdere', 'buyukdere', 'kireçburnu', 'kirecburnu', 'rumelihisarı', 'baltalimanı', 'ayazağa'] },
        { label: 'Eminönü', share: 4.2, aliases: ['eminonu', 'karaköy', 'karakoy', 'sirkeci', 'tahtakale', 'mısır çarşısı', 'misir carsisi', 'eminönüne', 'eminonune', 'eminönünde', 'eminonunde', 'cağaloğlu', 'cagaloglu', 'süleymaniye', 'mahmutpaşa', 'mahmutpasa', 'beyazıt', 'beyazit', 'kapalıçarşı', 'unkapanı'] },
        { label: 'Şişli', share: 4.0, aliases: ['sisli', 'mecidiyeköy', 'nişantaşı', 'osmanbey', 'bomonti', 'harbiye', 'mecidiyekoy', 'nisantasi', 'şişliye', 'sisliye', 'şişlide', 'sislide', 'teşvikiye', 'tesvikiye', 'kurtuluş', 'kurtulus', 'feriköy', 'ferikoy', 'pangaltı', 'okmeydanı'] },
        { label: 'Ortaköy', share: 3.7, aliases: ['ortakoy', 'kuruçeşme', 'arnavutköy', 'bebek', 'etiler', 'ulusta', 'kurucesme', 'arnavutkoy', 'ortaköye', 'ortakoye', 'ortaköyde', 'ortakoyde', 'ulus', 'nisbetiye', 'akatlar', 'mecidiye ortaköy', 'ortaköy sahil', 'ortakoy sahil', 'bebek sahil', 'kuruçeşme sahil'] },
        { label: 'Bostancı', share: 3.4, aliases: ['bostanci', 'suadiye', 'caddebostan', 'erenköy', 'bağdat caddesi', 'göztepe', 'erenkoy', 'bagdat caddesi', 'goztepe', 'bostancıya', 'bostanciya', 'bostancıda', 'bostancida', 'kozyatağı', 'kozyatagi', 'şaşkınbakkal', 'saskinbakkal', 'feneryolu', 'çiftehavuzlar', 'bostancı sahil'] },
        { label: 'Ataşehir', share: 3.1, aliases: ['atasehir', 'batı ataşehir', 'içerenköy', 'kayışdağı', 'barbaros', 'küçükbakkalköy', 'bati atasehir', 'icerenkoy', 'kayisdagi', 'kucukbakkalkoy', 'ataşehire', 'atasehire', 'ataşehirde', 'atasehirde', 'yenisahra', 'örnek mahallesi', 'ferhatpaşa', 'esatpaşa', 'mustafa kemal ataşehir', 'doğu ataşehir'] },
        { label: 'Maltepe', share: 2.8, aliases: ['maltepe sahil', 'küçükyalı', 'idealtepe', 'süreyyapaşa', 'altayçeşme', 'cevizli', 'kucukyali', 'sureyyapasa', 'altaycesme', 'maltepeye', 'maltepede', 'bağlarbaşı maltepe', 'zümrütevler', 'zumrutevler', 'feyzullah', 'aydınevler', 'büyükbakkalköy', 'başıbüyük', 'basibuyuk', 'dragos'] },
        { label: 'Beykoz', share: 2.5, aliases: ['beykoz çayırı', 'kanlıca', 'anadoluhisarı', 'kavacık', 'paşabahçe', 'çubuklu', 'beykoz cayiri', 'kanlica', 'anadoluhisari', 'kavacik', 'pasabahce', 'cubuklu', 'beykoza', 'beykozda', 'polonezköy', 'polonezkoy', 'anadolukavağı', 'anadolukavagi', 'riva', 'göksu'] },
        { label: 'Pendik', share: 2.2, aliases: ['pendik sahil', 'kaynarca', 'kurtköy', 'güzelyalı', 'pendiğe', 'batı mahallesi', 'kurtkoy', 'guzelyali', 'pendige', 'bati mahallesi', 'pendikte', 'velibaba', 'çamçeşme', 'camcesme', 'kavakpınar', 'esenyalı', 'esenyali', 'yenişehir pendik', 'sapanbağları', 'pendik çarşı'] },
        { label: 'Kuzguncuk', share: 1.5, aliases: ['kuzguncuk sahil', 'icadiye', 'nakkaştepe', 'kuzguncuğa', 'üryanizade', 'kuzguncukta', 'nakkastepe', 'kuzguncuga', 'uryanizade', 'kuzguncuk sokakları', 'kuzguncuk sokaklari', 'kuzguncuk bostanı', 'kuzguncuk bostani', 'icadiye caddesi', 'perihan abla sokağı', 'simitçi tahir sokağı', 'üsküdar kuzguncuk', 'kuzguncuk iskelesi'] },
        { label: 'Balat', share: 1.0, aliases: ['fener', 'fener balat', 'ayvansaray', 'balat sokakları', 'balata', 'haliç kıyısı', 'balat sokaklari', 'halic kiyisi', 'balatta', 'renkli evler balat', 'fener rum patrikhanesi', 'merdivenli yokuş', 'merdivenli yokus', 'vodina caddesi', 'demir kilise', 'cibali', 'fatih balat', 'balat sahil'] },
        { label: 'Moda', share: 0.8, aliases: ['moda sahil', 'moda burnu', 'moda iskelesi', 'modaya', 'modada', 'moda caddesi', 'kadıköy moda', 'kadikoy moda', 'moda çay bahçesi', 'moda cay bahcesi', 'moda parkı', 'moda parki', 'barış manço evi', 'yoğurtçu parkı', 'yogurtcu parki', 'mühürdar', 'muhurdar', 'moda tramvayı'] },
        { label: 'Rumelifeneri', share: 0.6, aliases: ['rumeli feneri', 'garipçe', 'rumelifenerine', 'boğaz çıkışı', 'karadeniz ağzı', 'fener köyü', 'garipce', 'bogaz cikisi', 'karadeniz agzi', 'fener koyu', 'rumelifenerinde', 'rumeli kavağı', 'rumeli kavagi', 'sarıyer rumelifeneri', 'rumeli feneri kalesi', 'garipçe köyü', 'garipce koyu', 'boğazın karadeniz ucu'] },
        { label: 'Kilyos', share: 0.4, aliases: ['kumköy', 'kilyos sahil', 'kilyosa', 'karadeniz kıyısı', 'kilyos plajı', 'sarıyer kilyos', 'kumkoy', 'karadeniz kiyisi', 'kilyos plaji', 'sariyer kilyos', 'kilyosta', 'demirciköy', 'demircikoy', 'uskumruköy', 'uskumrukoy', 'gümüşdere', 'kilyos denizi', 'kumköy kilyos'] }
      ],
      invalid: [
        { aliases: ['ankara', 'kızılay', 'çankaya'], reason: 'Ankara Türkiye başkenti, İstanbul semti değil.' },
        { aliases: ['izmir', 'alsancak', 'konak'], reason: 'Bu İzmir şehrine ait bir yer.' },
        { aliases: ['bursa', 'nilüfer', 'osmangazi'], reason: 'Bursa ayrı bir il, İstanbul semti değil.' },
        { aliases: ['antalya', 'lara', 'konyaaltı'], reason: 'Antalya Akdeniz şehri, İstanbul semti değil.' },
        { aliases: ['boğaz köprüsü', 'kız kulesi'], reason: 'Bu bir semt değil, İstanbul yapısı.' },
        { aliases: ['türkiye', 'marmara'], reason: 'Semt adı değil, ülke veya bölge adı.' }
      ],
      tests: [
        { in: 'Kadıköy', expect: 'Kadıköy' },
        { in: 'besiktas', expect: 'Beşiktaş' },
        { in: 'moda sahil', expect: 'Moda' },
        { in: 'ankara', expect: 'invalid' }
      ]
    },
    {
      id: 'q09',
      cat: 'yemek',
      text: 'Türk mutfağından bir tatlı söyle',
      answers: [
        { label: 'Baklava', share: 34.4, aliases: ['fıstıklı baklava', 'cevizli baklava', 'gaziantep baklavası', 'baklavası', 'ev baklavası', 'şöbiyet', 'fistikli baklava', 'gaziantep baklavasi', 'baklavasi', 'ev baklavasi', 'sobiyet', 'soğuk baklava', 'soguk baklava', 'havuç dilimi baklava', 'havuc dilimi', 'kuru baklava', 'midye baklava', 'antep baklavası', 'sütlü nuriye', 'bülbül yuvası'] },
        { label: 'Künefe', share: 14.4, aliases: ['kunefe', 'hatay künefesi', 'peynirli künefe', 'kaymaklı künefe', 'sıcak künefe', 'künefesi', 'hatay kunefesi', 'peynirli kunefe', 'kaymakli kunefe', 'sicak kunefe', 'kunefesi', 'antakya künefesi', 'antakya kunefesi', 'fıstıklı künefe', 'fistikli kunefe', 'hasır künefe', 'hasir kunefe', 'çıtır künefe', 'katmer künefe'] },
        { label: 'Sütlaç', share: 10.4, aliases: ['sutlac', 'fırın sütlaç', 'firin sutlac', 'hamsiköy sütlacı', 'tarçınlı sütlaç', 'sütlaçı', 'hamsikoy sutlaci', 'tarcinli sutlac', 'sutlaci', 'sütlacı', 'fırında sütlaç', 'firinda sutlac', 'güveçte sütlaç', 'guvecte sutlac', 'anne sütlacı', 'pirinçli sütlaç', 'fındıklı sütlaç', 'soğuk sütlaç'] },
        { label: 'Kazandibi', share: 6.6, aliases: ['kazan dibi', 'yanık kazandibi', 'tavuklu kazandibi', 'sütlü kazandibi', 'kazandibisi', 'saray kazandibi', 'yanik kazandibi', 'sutlu kazandibi', 'rulo kazandibi', 'dondurmalı kazandibi', 'dondurmali kazandibi', 'gerçek kazandibi', 'osmanlı kazandibi', 'karamelize kazandibi', 'tepsi kazandibi', 'sakızlı kazandibi', 'tarçınlı kazandibi', 'kazandibi tatlısı'] },
        { label: 'Revani', share: 5.6, aliases: ['irmikli revani', 'portakallı revani', 'şerbetli revani', 'haşhaşlı revani', 'limonlu revani', 'revanisi', 'portakalli revani', 'serbetli revani', 'hashasli revani', 'revani tatlısı', 'revani tatlisi', 'yoğurtlu revani', 'yogurtlu revani', 'hindistan cevizli revani', 'süngersiz revani', 'ev revanisi', 'irmik tatlısı revani', 'şambali'] },
        { label: 'Lokma', share: 5.0, aliases: ['izmir lokması', 'saray lokması', 'şerbetli lokma', 'lokma tatlısı', 'çıtır lokma', 'dökme lokma', 'izmir lokmasi', 'saray lokmasi', 'serbetli lokma', 'lokma tatlisi', 'citir lokma', 'dokme lokma', 'hayır lokması', 'hayir lokmasi', 'delikli lokma', 'tarçınlı lokma', 'sıcak lokma', 'lokmacı'] },
        { label: 'Aşure', share: 4.4, aliases: ['asure', 'aşure tatlısı', 'muharrem aşuresi', 'narlı aşure', 'cevizli aşure', 'aşuresi', 'asure tatlisi', 'muharrem asuresi', 'narli asure', 'cevizli asure', 'asuresi', 'nuhun tatlısı', 'fındıklı aşure', 'incirli aşure', 'kayısılı aşure', 'komşu aşuresi', 'bol malzemeli aşure', 'aşure çorbası'] },
        { label: 'Tulumba', share: 3.8, aliases: ['tulumba tatlısı', 'çıtır tulumba', 'şerbetli tulumba', 'balkan tulumbası', 'tulumbası', 'halka tatlısı', 'tulumba tatlisi', 'citir tulumba', 'serbetli tulumba', 'balkan tulumbasi', 'tulumbasi', 'halka tatlisi', 'mini tulumba', 'osmanlı tulumbası', 'sıcak tulumba', 'kızarmış tulumba', 'kerhane tatlısı', 'müşebbek'] },
        { label: 'Güllaç', share: 3.4, aliases: ['gullac', 'ramazan güllacı', 'cevizli güllaç', 'narlı güllaç', 'sütlü güllaç', 'güllacı', 'ramazan gullaci', 'cevizli gullac', 'narli gullac', 'sutlu gullac', 'gullaci', 'gül sulu güllaç', 'gul sulu gullac', 'fıstıklı güllaç', 'fistikli gullac', 'güllaç tatlısı', 'gullac tatlisi', 'saray güllacı'] },
        { label: 'Trileçe', share: 3.0, aliases: ['trilece', 'karamelli trileçe', 'frambuazlı trileçe', 'sütlü trileçe', 'balkan trileçesi', 'triliçe', 'karamelli trilece', 'frambuazli trilece', 'sutlu trilece', 'balkan trilecesi', 'trilice', 'üç sütlü tatlı', 'uc sutlu tatli', 'arnavut tatlısı trileçe', 'çilekli trileçe', 'cilekli trilece', 'fıstıklı trileçe', 'trileçe tatlısı'] },
        { label: 'Kadayıf', share: 2.6, aliases: ['kadayif', 'tel kadayıf', 'ekmek kadayıfı', 'burma kadayıf', 'cevizli kadayıf', 'fıstıklı kadayıf', 'tel kadayif', 'ekmek kadayifi', 'burma kadayif', 'cevizli kadayif', 'fistikli kadayif', 'kadayıf dolması', 'kadayif dolmasi', 'taş kadayıf', 'tas kadayif', 'yassı kadayıf', 'kaymaklı ekmek kadayıfı', 'fırın kadayıf'] },
        { label: 'Muhallebi', share: 2.0, aliases: ['su muhallebisi', 'damla sakızlı muhallebi', 'sütlü muhallebi', 'fırın muhallebi', 'muhallebisi', 'keşkül muhallebi', 'damla sakizli muhallebi', 'sutlu muhallebi', 'firin muhallebi', 'keskul muhallebi', 'saray muhallebisi', 'bici bici', 'vişneli muhallebi', 'kakaolu muhallebi', 'pirinç unlu muhallebi', 'tarçınlı muhallebi', 'güllü muhallebi', 'ev muhallebisi'] },
        { label: 'Şekerpare', share: 1.6, aliases: ['sekerpare', 'bademli şekerpare', 'fındıklı şekerpare', 'irmikli şekerpare', 'şekerparesi', 'ev şekerparesi', 'bademli sekerpare', 'findikli sekerpare', 'irmikli sekerpare', 'sekerparesi', 'ev sekerparesi', 'pastane şekerparesi', 'pastane sekerparesi', 'cevizli şekerpare', 'şerbetli şekerpare', 'kalburabastı', 'kalburabasti', 'şekerpare tatlısı'] },
        { label: 'Tavuk göğsü', share: 1.0, aliases: ['tavuk gogsu', 'yalancı tavuk göğsü', 'tarçınlı tavuk göğsü', 'sütlü tavuk göğsü', 'tavukgöğsü', 'saray tatlısı', 'yalanci tavuk gogsu', 'tarcinli tavuk gogsu', 'sutlu tavuk gogsu', 'tavukgogsu', 'saray tatlisi', 'gerçek tavuk göğsü', 'gercek tavuk gogsu', 'tavuk göğsü tatlısı', 'osmanlı tavuk göğsü', 'sakızlı tavuk göğsü', 'dondurmalı tavuk göğsü', 'bisküvili tavuk göğsü'] },
        { label: 'Keşkül', share: 0.8, aliases: ['keskul', 'keşkül-ü fukara', 'bademli keşkül', 'fıstıklı keşkül', 'hindistan cevizli keşkül', 'keşkülu', 'keskul u fukara', 'bademli keskul', 'fistikli keskul', 'hindistan cevizli keskul', 'keskulu', 'keşkülü', 'fukara keşkülü', 'cevizli keşkül', 'sütlü keşkül', 'keşkül tatlısı', 'keskul tatlisi', 'osmanlı keşkülü'] },
        { label: 'Kabak tatlısı', share: 0.6, aliases: ['kabak tatlisi', 'tahinli kabak', 'cevizli kabak tatlısı', 'bal kabağı tatlısı', 'fırında kabak', 'fırında kabak tatlısı', 'cevizli kabak tatlisi', 'bal kabagi tatlisi', 'firinda kabak', 'tahinli kabak tatlısı', 'tahinli kabak tatlisi', 'kireçte kabak tatlısı', 'hatay kabak tatlısı', 'balkabağı tatlısı', 'balkabagi tatlisi', 'kaymaklı kabak tatlısı', 'pekmezli kabak tatlısı', 'fırınlanmış kabak tatlısı'] },
        { label: 'Höşmerim', share: 0.4, aliases: ['hosmerim', 'balıkesir höşmerimi', 'peynir helvası', 'irmikli höşmerim', 'sıcak höşmerim', 'höşmerimi', 'balikesir hosmerimi', 'peynir helvasi', 'irmikli hosmerim', 'sicak hosmerim', 'hosmerimi', 'peynir tatlısı höşmerim', 'çanakkale peynir helvası', 'tekirdağ peynir helvası', 'höşmerim tatlısı', 'hosmerim tatlisi', 'dondurmalı höşmerim', 'fırınlanmış peynir helvası'] }
      ],
      invalid: [
        { aliases: ['tiramisu', 'cheesecake', 'brownie'], reason: 'Bu yabancı mutfaklara ait bir tatlı.' },
        { aliases: ['profiterol', 'sufle', 'ekler'], reason: 'Bu Fransız kökenli bir pastane tatlısı.' },
        { aliases: ['waffle', 'pankek', 'krep'], reason: 'Geleneksel Türk mutfağı tatlısı sayılmaz.' },
        { aliases: ['dondurma', 'maraş dondurması'], reason: 'Serinletici olsa da klasik pişirilen tatlı grubu değil.' },
        { aliases: ['lahmacun', 'kebap', 'mantı'], reason: 'Bu bir tatlı değil, ana yemek.' },
        { aliases: ['çay', 'kahve', 'ayran'], reason: 'Tatlı değil, içecek.' }
      ],
      tests: [
        { in: 'Baklava', expect: 'Baklava' },
        { in: 'firin sutlac', expect: 'Sütlaç' },
        { in: 'hosmerim', expect: 'Höşmerim' },
        { in: 'tiramisu', expect: 'invalid' }
      ]
    },
    {
      id: 'q10',
      cat: 'şehir',
      text: 'Pazarda satıcının bağırdığı bir şey söyle',
      answers: [
        { label: 'Gel abla gel', share: 20.5, aliases: ['gel abla', 'buyur abla', 'gel ablam gel', 'abla gel', 'gel abi gel', 'buyur abi', 'gel vatandaş gel', 'gel vatandas gel', 'gel kardeşim gel', 'gel teyzem gel', 'yaklaş abla yaklaş', 'buyurun abla', 'gel ablacığım gel', 'gel ablacim gel', 'koş abla koş', 'gel yenge gel', 'buyur ablam', 'gel buraya gel'] },
        { label: 'Taze bunlar taze', share: 15.5, aliases: ['taze taze', 'tarladan taze', 'sabah geldi', 'dalından taze', 'yeni geldi', 'taptaze', 'dalindan taze', 'bahçeden yeni toplandı', 'bahceden yeni toplandi', 'tarladan halka', 'daha yeni koptu', 'sabah toplandı', 'sabah toplandi', 'canlı bunlar canlı', 'suyu üstünde taze', 'kütür kütür taze', 'kutur kutur taze', 'dalından yeni koptu'] },
        { label: 'Ucuz ucuz', share: 12.4, aliases: ['ucuzluk', 'sudan ucuz', 'bedava', 'neredeyse bedava', 'en ucuz burada', 'kapatıyoruz', 'kapatiyoruz', 'bedavadan biraz pahalı', 'bedavadan biraz pahali', 'böyle ucuz yok', 'boyle ucuz yok', 'ucuzluk pazarı', 'fiyatları kırdık', 'fiyatlari kirdik', 'çok ucuz', 'cok ucuz', 'ucuzladı', 'bedava bunlar'] },
        { label: 'Bal gibi', share: 10.0, aliases: ['bal bunlar bal', 'şeker gibi', 'lokum gibi', 'tatlı bunlar', 'bal bal', 'çikolata gibi', 'seker gibi', 'tatli bunlar', 'cikolata gibi', 'şerbet gibi', 'serbet gibi', 'kaymak gibi', 'bal küpü', 'bal kupu', 'şeker bunlar şeker', 'ağızda dağılıyor', 'agizda dagiliyor', 'tatlı mı tatlı'] },
        { label: 'Seç beğen al', share: 9.0, aliases: ['sec begen al', 'seç al', 'beğendiğini al', 'kendin seç', 'seçmece', 'elini korkak alıştırma', 'sec al', 'begendigini al', 'kendin sec', 'secmece', 'elini korkak alistirma', 'seçmece bunlar', 'secmece bunlar', 'istediğini seç', 'istedigini sec', 'doldur poşete seç', 'elle seç', 'seçmek serbest'] },
        { label: 'Tatmadan geçme', share: 5.4, aliases: ['tatmadan gecme', 'tadına bak', 'ikramımız', 'tadımlık', 'beğenmezsen alma', 'ye öyle al', 'tadina bak', 'ikramimiz', 'tadimlik', 'begenmezsen alma', 'ye oyle al', 'tadına bakmak bedava', 'tadina bakmak bedava', 'önce tat sonra al', 'once tat sonra al', 'bir tane at ağzına', 'tatmadan alma', 'tadı damağında kalır'] },
        { label: 'Son fiyat', share: 4.8, aliases: ['son bunlar', 'son kalanlar', 'tezgahı kapatıyoruz', 'akşam pazarı', 'son üç kilo', 'döküyoruz', 'tezgahi kapatiyoruz', 'aksam pazari', 'son uc kilo', 'dokuyoruz', 'tezgahın sonu', 'tezgahin sonu', 'son kasalar', 'akşam indirimi', 'aksam indirimi', 'kalanları bitiriyoruz', 'son iki kilo', 'dip fiyat'] },
        { label: 'Yer misin yemez misin', share: 4.0, aliases: ['yer misin', 'yemez misin', 'yemeyene yok', 'yemediysen alma', 'yiyen bir daha alır', 'lezzetine bak', 'yiyen bir daha alir', 'yemede yanında yat', 'yemede yaninda yat', 'parmaklarını yersin', 'parmaklarini yersin', 'yiyen pişman olmaz', 'yemeyen pişman', 'şunun güzelliğine bak', 'sunun guzelligine bak', 'insan yemeye kıyamaz', 'tadı efsane', 'tadına doyum olmaz'] },
        { label: 'Kilosu elli lira', share: 3.6, aliases: ['kilosu elli', 'iki kilo yüz', 'üç kilosu', 'etikete bak', 'fiyat düştü', 'yarı fiyatına', 'iki kilo yuz', 'uc kilosu', 'fiyat dustu', 'yari fiyatina', 'kilosu on lira', 'kilosu yirmi lira', 'kilosu otuz lira', 'üç kilo yüz lira', 'uc kilo yuz lira', 'demeti on lira', 'tanesi beş lira', 'yarım kilosu'] },
        { label: 'Domates domates', share: 3.2, aliases: ['domates biber', 'çilek çilek', 'kiraz bunlar', 'karpuz karpuz', 'kavun bunlar', 'taze fasulye', 'cilek cilek', 'salkım domates', 'salkim domates', 'çanakkale domatesi', 'canakkale domatesi', 'salatalık bunlar', 'biber bunlar', 'limon limon', 'sulu limon', 'patates soğan', 'patates sogan', 'elma armut'] },
        { label: 'Batan geminin malları', share: 2.8, aliases: ['batan geminin mallari', 'batan gemi', 'patron çıldırdı', 'zararına satış', 'maliyetine', 'elimizde kalmasın', 'patron cildirdi', 'zararina satis', 'elimizde kalmasin', 'batan geminin malları bunlar', 'zararına veriyoruz', 'zararina veriyoruz', 'maliyetine satış', 'maliyetine satis', 'fabrikadan halka', 'kar istemiyoruz', 'patron zararına satıyor', 'yağma var'] },
        { label: 'Çürük çıkarsa getir', share: 2.4, aliases: ['curuk cikarsa getir', 'kelek çıkarsa', 'garantili', 'kötü çıkarsa değiştir', 'seçilmiş bunlar', 'bir tane çürük yok', 'kelek cikarsa', 'kotu cikarsa degistir', 'secilmis bunlar', 'bir tane curuk yok', 'kesmece karpuz', 'kelek çıkarsa geri getir', 'kelek cikarsa geri getir', 'bıçak garantili', 'bicak garantili', 'beğenmezsen geri getir', 'iade garantili', 'ezik çürük yok'] },
        { label: 'İndirim var', share: 2.0, aliases: ['indirim', 'yüzde elli', 'kampanya', 'ikinci yarı fiyatına', 'pazarlık yok', 'düşürdük', 'yuzde elli', 'ikinci yari fiyatina', 'pazarlik yok', 'dusurduk', 'büyük indirim', 'buyuk indirim', 'damga vuran indirim', 'indirim yaptık', 'indirim yaptik', 'fiyatları düşürdük', 'şok indirim', 'dev kampanya'] },
        { label: 'Kaçırma', share: 1.6, aliases: ['kacirma', 'fırsat bu fırsat', 'bir daha bulamazsın', 'yetişen alır', 'kalmadı', 'bitiyor', 'firsat bu firsat', 'bir daha bulamazsin', 'yetisen alir', 'kalmadi', 'kapış kapış gidiyor', 'kapis kapis gidiyor', 'alan aldı', 'alan aldi', 'son fırsat', 'son firsat', 'yetişen kapıyor', 'tükeniyor'] },
        { label: 'Hepsi bir fiyat', share: 1.0, aliases: ['hepsi bir', 'ne alırsan', 'tek fiyat', 'seçtiğin her şey', 'aynı fiyat', 'karışık aynı fiyat', 'ne alirsan', 'sectigin her sey', 'ayni fiyat', 'karisik ayni fiyat', 'ne seçersen tek fiyat', 'ne secersen tek fiyat', 'hangisini alırsan al', 'tezgahta ne varsa tek fiyat', 'karıştır doldur aynı fiyat', 'hepsi aynı para', 'ne alırsan elli', 'ne alırsan yüz'] },
        { label: 'Hadi eve gidiyoruz', share: 0.8, aliases: ['hadi eve', 'pazar bitiyor', 'toparlanıyoruz', 'akşam oldu', 'son müşteriye', 'hayırlı işler', 'toparlaniyoruz', 'aksam oldu', 'son musteriye', 'hayirli isler', 'eve gideceğiz', 'eve gidecegiz', 'tezgah toplanıyor', 'tezgah toplaniyor', 'pazar dağılıyor', 'son satışlar', 'kalanı eve götürmeyelim', 'paydos ediyoruz'] },
        { label: 'Poşet ister misin', share: 0.6, aliases: ['poset ister misin', 'iki poşet yapayım', 'kese kağıdı', 'taşıyabilecek misin', 'fileyi doldur', 'çift poşet', 'iki poset yapayim', 'kese kagidi', 'tasiyabilecek misin', 'cift poset', 'poşete koyayım mı', 'posete koyayim mi', 'pazar arabasına koy', 'pazar arabasina koy', 'sağlam poşet vereyim', 'iki kiloya tamamlayayım mı', 'üstünü tamamlayalım', 'tartıya koyalım'] },
        { label: 'Abla bak hele', share: 0.4, aliases: ['abla bak', 'teyze gel', 'yenge gel', 'kızım bak', 'hanımefendi', 'gençler buyurun', 'kizim bak', 'hanimefendi', 'gencler buyurun', 'ablacığım buraya bak', 'ablacigim buraya bak', 'teyzeciğim gel', 'teyzecigim gel', 'anneciğim buyur', 'annecigim buyur', 'güzel ablam bak', 'şöyle buyur abla', 'soyle buyur abla'] }
      ],
      invalid: [
        { aliases: ['sessiz olun', 'derse geçiyoruz'], reason: 'Bu okulda öğretmenin söylediği bir söz.' },
        { aliases: ['inecek var', 'müsait bir yerde'], reason: 'Bu dolmuş veya otobüste söylenir.' },
        { aliases: ['kredi kartı geçerli', 'pos cihazı'], reason: 'Pazar bağırışı değil, ödeme bilgisi.' },
        { aliases: ['afiyet olsun', 'hoş geldiniz'], reason: 'Genel nezaket sözü, pazar sloganı değil.' },
        { aliases: ['iyi bayramlar', 'el öpenlerin çok olsun'], reason: 'Bu bayram ziyaretinde söylenir.' },
        { aliases: ['barkod okuyucu', 'kasa sırası'], reason: 'Bu süpermarkete özgü bir durum.' }
      ],
      tests: [
        { in: 'Gel abla gel', expect: 'Gel abla gel' },
        { in: 'sec begen al', expect: 'Seç beğen al' },
        { in: 'patron çıldırdı', expect: 'Batan geminin malları' },
        { in: 'inecek var', expect: 'invalid' }
      ]
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
