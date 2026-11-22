// v1 arşiv — kullanılmıyor
/**
 * PUSULLA — Soru ve Cevap Veri Seti (data.js)
 *
 * Yeni bir soru eklemek için QUESTIONS dizisinin sonuna aynı şemada
 * yeni bir nesne eklemeniz yeterlidir:
 * {
 *   id: 5,
 *   text: "Soru metni",
 *   answers: [ { label: "Görünen Ad", share: 35.0, aliases: ["eş anlam", ...] }, ... ],
 *   invalid: [ { aliases: ["geçersiz cevap"], reason: "Kısa açıklama" }, ... ]
 * }
 */
(function (root) {
  'use strict';

  var QUESTIONS = [
    {
      id: 1,
      text: 'Kahvaltıda olmazsa olmaz bir şey söyle',
      answers: [
        {
          label: 'Çay',
          share: 36.4,
          aliases: ['cay', 'demli çay', 'demli cay', 'çay içmek', 'cay icmek', 'ince belli çay', 'siyah çay', 'türk çayı', 'bir bardak çay']
        },
        {
          label: 'Peynir',
          share: 16.8,
          aliases: ['beyaz peynir', 'kaşar', 'kaşar peyniri', 'kasar', 'ezine', 'ezine peyniri', 'tulum', 'tulum peyniri', 'örgü peyniri', 'lor']
        },
        {
          label: 'Zeytin',
          share: 11.2,
          aliases: ['siyah zeytin', 'yeşil zeytin', 'yesil zeytin', 'kırma zeytin', 'sele zeytin']
        },
        {
          label: 'Yumurta',
          share: 9.5,
          aliases: ['haşlanmış yumurta', 'haslanmis yumurta', 'sahanda yumurta', 'omlet', 'rafadan yumurta', 'göz yumurta', 'kayısı yumurta']
        },
        {
          label: 'Simit',
          share: 6.4,
          aliases: ['gevrek', 'sıcak simit', 'sicak simit', 'susamlı simit', 'sokak simidi', 'ankara simidi']
        },
        {
          label: 'Ekmek',
          share: 4.8,
          aliases: ['taze ekmek', 'kızarmış ekmek', 'kizarmis ekmek', 'sıcak ekmek', 'ekmek kızartması', 'somun']
        },
        {
          label: 'Domates & Salatalık',
          share: 3.6,
          aliases: ['domates', 'salatalık', 'salatalik', 'domates salatalık', 'söğüş', 'sogus', 'yeşillik', 'biber']
        },
        {
          label: 'Menemen',
          share: 2.8,
          aliases: ['melemen', 'soğanlı menemen', 'soğansız menemen']
        },
        {
          label: 'Sucuk',
          share: 2.2,
          aliases: ['sucuklu yumurta', 'kızarmış sucuk', 'tavada sucuk']
        },
        {
          label: 'Bal & Kaymak',
          share: 1.9,
          aliases: ['bal', 'kaymak', 'bal kaymak', 'süzme bal', 'petek bal']
        },
        {
          label: 'Tereyağı',
          share: 1.4,
          aliases: ['tereyagi', 'tereyağ', 'tereyag', 'köy tereyağı']
        },
        {
          label: 'Reçel',
          share: 1.1,
          aliases: ['recel', 'çilek reçeli', 'vişne reçeli', 'gül reçeli', 'marmelat']
        },
        {
          label: 'Börek',
          share: 0.9,
          aliases: ['borek', 'su böreği', 'peynirli börek', 'sigara böreği', 'kol böreği']
        },
        {
          label: 'Poğaça',
          share: 0.7,
          aliases: ['pogaca', 'poaça', 'açma', 'acma', 'peynirli poğaça']
        },
        {
          label: 'Zeytinyağı',
          share: 0.3,
          aliases: ['zeytinyagi', 'zeytin yağı', 'zeytin yagi', 'kekikli zeytinyağı']
        }
      ],
      invalid: [
        {
          aliases: ['kahve', 'türk kahvesi', 'filtre kahve', 'nescafe'],
          reason: 'Kahve genelde kahvaltıdan sonra içilir.'
        },
        {
          aliases: ['kola', 'gazoz', 'fanta', 'soğuk içecek'],
          reason: 'Sabah kahvaltısında asitli içecek pek sayılmaz.'
        },
        {
          aliases: ['çorba', 'corba', 'mercimek çorbası', 'işkembe'],
          reason: 'Klasik Türk kahvaltı sofrasının öğesi değil.'
        },
        {
          aliases: ['lahmacun', 'kebap', 'döner', 'hamburger', 'pizza'],
          reason: 'Bu daha çok öğle veya akşam yemeği.'
        },
        {
          aliases: ['su', 'bir bardak su'],
          reason: 'Su temel ihtiyaç, kahvaltıya özel değil.'
        },
        {
          aliases: ['sigara'],
          reason: 'Kahvaltılık yiyecek ya da içecek değil.'
        },
        {
          aliases: ['hiçbir şey', 'hicbir sey', 'yok', 'bilmem'],
          reason: 'Gerçek bir kahvaltılık yazmalısın.'
        }
      ]
    },
    {
      id: 2,
      text: 'Bayramda büyüklerin söylediği bir söz söyle',
      answers: [
        {
          label: 'Maşallah çok büyümüşsün',
          share: 28.5,
          aliases: ['masallah cok buyumussun', 'çok büyümüşsün', 'büyümüşsün', 'kocaman olmuşsun', 'boyun uzamış', 'maşallah', 'ne çabuk büyüdün']
        },
        {
          label: 'Bayramın mübarek olsun',
          share: 18.4,
          aliases: ['bayramin mubarek olsun', 'iyi bayramlar', 'hayırlı bayramlar', 'hayirli bayramlar', 'bayramınız mübarek olsun', 'mutlu bayramlar']
        },
        {
          label: 'Okul nasıl gidiyor',
          share: 12.6,
          aliases: ['okul nasil gidiyor', 'dersler nasıl', 'derslerin nasıl', 'kaçıncı sınıf oldun', 'okul bitti mi', 'sınavlar nasıl']
        },
        {
          label: 'Ne zaman evleniyorsun',
          share: 9.8,
          aliases: ['evlilik ne zaman', 'mürüvvetini görelim', 'düğün ne zaman', 'evlenmiyor musun', 'kısmetin çıkmadı mı']
        },
        {
          label: 'Allah razı olsun',
          share: 7.2,
          aliases: ['allah razi olsun', 'allah kabul etsin', 'sağ ol evladım', 'berhudar ol']
        },
        {
          label: 'El öpenlerin çok olsun',
          share: 5.6,
          aliases: ['el openlerin cok olsun', 'el öpenlerin sağ olsun', 'öpenlerin çok olsun']
        },
        {
          label: 'Nerede o eski bayramlar',
          share: 4.5,
          aliases: ['nerede o eski bayramlar', 'eski bayramlar', 'eski bayramlar kalmadı', 'nerde o eski bayramlar']
        },
        {
          label: 'Bizi hiç aramıyorsun',
          share: 3.7,
          aliases: ['bizi hic aramiyorsun', 'hiç sormuyorsun', 'gözümüz yollarda kaldı', 'ancak bayramdan bayrama', 'özledik seni']
        },
        {
          label: 'Al bakalım bayram harçlığı',
          share: 3.1,
          aliases: ['al bakalim harclik', 'harçlık', 'bayram harçlığı', 'al bu da harçlığın', 'cep harçlığı', 'şeker alırsın']
        },
        {
          label: 'İş güç nasıl',
          share: 2.4,
          aliases: ['is guc nasil', 'iş buldun mu', 'işler nasıl', 'çalışıyor musun', 'maaşın iyi mi']
        },
        {
          label: 'Sevgilin var mı',
          share: 1.8,
          aliases: ['sevgilin var mi', 'yok mu birileri', 'nişanlın var mı', 'görüştüğün biri var mı']
        },
        {
          label: 'Kaç yaşına geldin',
          share: 1.2,
          aliases: ['kac yasina geldin', 'kaç yaşındasın', 'yaşın kaç oldu']
        },
        {
          label: 'Büyüklerin ellerinden küçüklerin gözlerinden',
          share: 0.8,
          aliases: ['ellerinden öperim', 'gözlerinden öperim', 'büyüklerin ellerinden']
        },
        {
          label: 'Sağlığın sıhhatin nasıl',
          share: 0.4,
          aliases: ['sagligin sihhatin nasil', 'nasılsın iyi misin', 'keyfin nasıl', 'afiyetin nasıl']
        }
      ],
      invalid: [
        {
          aliases: ['günaydın', 'gunaydin', 'tünaydın'],
          reason: 'Bu her sabah söylenen sıradan bir selam.'
        },
        {
          aliases: ['merhaba', 'selam', 'selamün aleyküm', 'slm'],
          reason: 'Bayrama özgü bir büyük sözü değil.'
        },
        {
          aliases: ['afiyet olsun', 'eline sağlık'],
          reason: 'Bu yemek sofrasında söylenir.'
        },
        {
          aliases: ['geçmiş olsun', 'gecmis olsun'],
          reason: 'Bu hastalık veya kaza durumunda söylenir.'
        },
        {
          aliases: ['iyi geceler', 'tatlı rüyalar'],
          reason: 'Bayram ziyareti sözü değil.'
        },
        {
          aliases: ['doğum günün kutlu olsun', 'mutlu yıllar'],
          reason: 'Bu doğum günü kutlaması, bayram değil.'
        },
        {
          aliases: ['görüşürüz', 'hoşça kal', 'bay bay'],
          reason: 'Sıradan vedalaşma; bayrama özel bir kalıp dene.'
        }
      ]
    },
    {
      id: 3,
      text: 'Vapurda yapılan bir şey söyle',
      answers: [
        {
          label: 'Simit atmak',
          share: 32.2,
          aliases: ['martıya simit atmak', 'martılara simit atmak', 'martılara simit', 'martıya simit', 'martı beslemek', 'martılara ekmek atmak', 'simit fırlatmak']
        },
        {
          label: 'Çay içmek',
          share: 24.6,
          aliases: ['cay icmek', 'vapurda çay', 'çay', 'ince belli çay içmek', 'sıcak çay içmek']
        },
        {
          label: 'Manzara izlemek',
          share: 12.8,
          aliases: ['boğazı izlemek', 'bogazi izlemek', 'denizi izlemek', 'denizi seyretmek', 'boğazı seyretmek', 'etrafı izlemek', 'manzara']
        },
        {
          label: 'Simit yemek',
          share: 7.5,
          aliases: ['peynirli simit yemek', 'çay simit', 'simit peynir yemek', 'simit']
        },
        {
          label: 'Fotoğraf çekmek',
          share: 5.4,
          aliases: ['fotograf cekmek', 'foto çekmek', 'selfie çekmek', 'özçekim', 'video çekmek', 'hikaye atmak']
        },
        {
          label: 'Müzik dinlemek',
          share: 4.2,
          aliases: ['muzik dinlemek', 'kulaklıkla müzik', 'şarkı dinlemek', 'kulaklık takmak']
        },
        {
          label: 'Sohbet etmek',
          share: 3.4,
          aliases: ['muhabbet etmek', 'konuşmak', 'arkadaşlarla sohbet']
        },
        {
          label: 'Rüzgarı hissetmek',
          share: 2.8,
          aliases: ['ruzgari hissetmek', 'hava almak', 'güvertede oturmak', 'dışarıda oturmak', 'rüzgar yemek', 'serinlemek']
        },
        {
          label: 'Kitap okumak',
          share: 2.2,
          aliases: ['gazete okumak', 'dergi okumak', 'kitap']
        },
        {
          label: 'Tost yemek',
          share: 1.7,
          aliases: ['vapur tostu', 'kaşarlı tost yemek', 'tost']
        },
        {
          label: 'Martıları izlemek',
          share: 1.3,
          aliases: ['martilari izlemek', 'martı izlemek', 'martılara bakmak']
        },
        {
          label: 'Uyuklamak',
          share: 0.9,
          aliases: ['kestirmek', 'uyumak', 'şekerleme yapmak']
        },
        {
          label: 'Kahve veya salep içmek',
          share: 0.6,
          aliases: ['salep içmek', 'kahve içmek', 'sıcak salep']
        },
        {
          label: 'Telefonla oynamak',
          share: 0.4,
          aliases: ['telefona bakmak', 'sosyal medyaya bakmak', 'telefon']
        }
      ],
      invalid: [
        {
          aliases: ['yüzmek', 'yuzmek', 'denize girmek'],
          reason: 'Vapurun içinden denize atlanmaz.'
        },
        {
          aliases: ['balık tutmak', 'balik tutmak', 'olta atmak'],
          reason: 'Vapur hareket halindeyken olta atılmaz.'
        },
        {
          aliases: ['araba sürmek', 'araba kullanmak'],
          reason: 'Yolcu vapurunda araba sürülmez.'
        },
        {
          aliases: ['koşmak', 'kosmak', 'koşu yapmak'],
          reason: 'Güverte koşu pisti değildir.'
        },
        {
          aliases: ['top oynamak', 'futbol oynamak', 'maç yapmak'],
          reason: 'Vapurda top oynamaya yer yok.'
        },
        {
          aliases: ['ateş yakmak', 'mangal yapmak'],
          reason: 'Vapurda ateş yakmak yasaktır.'
        },
        {
          aliases: ['bisiklet sürmek', 'bisiklete binmek'],
          reason: 'Bisiklet vapura biner ama içinde sürülmez.'
        }
      ]
    },
    {
      id: 4,
      text: 'Bir Türk dizisi söyle',
      answers: [
        {
          label: 'Kurtlar Vadisi',
          share: 21.4,
          aliases: ['kv', 'kurtlar vadisi pusu', 'polat alemdar']
        },
        {
          label: 'Aşk-ı Memnu',
          share: 16.8,
          aliases: ['aski memnu', 'aşkı memnu', 'bihter', 'behlül']
        },
        {
          label: 'Muhteşem Yüzyıl',
          share: 13.2,
          aliases: ['muhtesem yuzyil', 'kanuni', 'hürrem']
        },
        {
          label: 'Ezel',
          share: 10.5,
          aliases: ['ramiz dayı', 'ezel dizisi']
        },
        {
          label: 'Leyla ile Mecnun',
          share: 8.4,
          aliases: ['leyla mecnun', 'ismail abi', 'l&m']
        },
        {
          label: 'Avrupa Yakası',
          share: 6.6,
          aliases: ['avrupa yakasi', 'burhan altıntop', 'gaffur']
        },
        {
          label: 'Yaprak Dökümü',
          share: 5.2,
          aliases: ['yaprak dokumu', 'ali rıza bey']
        },
        {
          label: 'Behzat Ç.',
          share: 4.1,
          aliases: ['behzat c', 'behzat ç', 'bir ankara polisiyesi', 'amir']
        },
        {
          label: 'Diriliş Ertuğrul',
          share: 3.3,
          aliases: ['dirilis ertugrul', 'ertuğrul', 'kuruluş osman']
        },
        {
          label: 'Arka Sokaklar',
          share: 2.6,
          aliases: ['arka sokak', 'rıza baba', 'mesut komiser']
        },
        {
          label: 'Çukur',
          share: 2.2,
          aliases: ['cukur', 'yamaç', 'koçovalı']
        },
        {
          label: 'Kızılcık Şerbeti',
          share: 1.8,
          aliases: ['kizilcik serbeti', 'kızılcık']
        },
        {
          label: 'Çocuklar Duymasın',
          share: 1.4,
          aliases: ['cocuklar duymasin', 'taş fırın erkek', 'haluk']
        },
        {
          label: 'Yalı Çapkını',
          share: 1.1,
          aliases: ['yali capkini', 'ferit seyran']
        },
        {
          label: 'Gibi',
          share: 0.9,
          aliases: ['gibi dizisi', 'yılmaz ilkkan']
        },
        {
          label: 'Poyraz Karayel',
          share: 0.5,
          aliases: ['poyraz', 'albayım']
        }
      ],
      invalid: [
        {
          aliases: ['breaking bad', 'better call saul'],
          reason: 'Bu yabancı (ABD) bir dizi.'
        },
        {
          aliases: ['game of thrones', 'got'],
          reason: 'Bu yabancı bir dizi, Türk dizisi değil.'
        },
        {
          aliases: ['friends', 'how i met your mother', 'the office'],
          reason: 'Bu yabancı bir komedi dizisi.'
        },
        {
          aliases: ['recep ivedik', 'gora', 'yahşi batı'],
          reason: 'Bu bir sinema filmi, dizi değil.'
        },
        {
          aliases: ['hababam sınıfı', 'hababam sinifi', 'tosun paşa'],
          reason: 'Bu klasik bir sinema filmi, dizi değil.'
        },
        {
          aliases: ['survivor', 'masterchef', 'o ses türkiye'],
          reason: 'Bu bir yarışma programı, dizi değil.'
        },
        {
          aliases: ['müge anlı', 'muge anli', 'esra erol'],
          reason: 'Bu bir gündüz kuşağı programı, dizi değil.'
        }
      ]
    }
  ];

  root.QUESTIONS = QUESTIONS;
})(typeof window !== 'undefined' ? window : globalThis);
