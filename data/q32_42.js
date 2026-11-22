(function (root) {
  'use strict';
  root.QUESTIONS = root.QUESTIONS || [];
  root.QUESTIONS.push(
    {
      id: 'q32',
      cat: 'genel',
      text: 'Kırmızı olan bir şey söyle',
      answers: [
        { label: 'Elma', share: 18.0, aliases: ['kırmızı elma', 'amasya elması', 'elmayı', 'elmalar', 'tatlı elma', 'parlak elma', 'elma', 'kirmizi elma', 'amasya elmasi', 'elmayi', 'tatli elma', 'kırmızı elmalar', 'starking elma', 'elma şekeri', 'kütür elma', 'sulu elma', 'elması', 'dalında elma'] },
        { label: 'Domates', share: 14.0, aliases: ['kırmızı domates', 'çeri domates', 'salçalık domates', 'salkım domates', 'domatesi', 'olgun domates', 'domates', 'kirmizi domates', 'ceri domates', 'salcalik domates', 'salkim domates', 'domatesler', 'tarla domatesi', 'çanakkale domatesi', 'ayaş domatesi', 'domates sosu', 'köy domatesi', 'kırmızı domatesler'] },
        { label: 'Gül', share: 12.4, aliases: ['kırmızı gül', 'gül çiçeği', 'gonca gül', 'aşk gülü', 'buket gül', 'gülü', 'gul', 'kirmizi gul', 'gul cicegi', 'gonca gul', 'ask gulu', 'buket gul', 'gulu', 'güller', 'kırmızı güller', 'tek gül', 'canlı gül', 'ısparta gülü'] },
        { label: 'Türk bayrağı', share: 11.6, aliases: ['turk bayragi', 'bayrak', 'ay yıldızlı bayrak', 'al bayrak', 'bayrağımız', 'kırmızı bayrak', 'türk bayrağı', 'ay yildizli bayrak', 'bayragimiz', 'kirmizi bayrak', 'şanlı bayrak', 'al sancağımız', 'ay yıldız', 'bayrağı', 'türk bayrağımız', 'bayraklar', 'kırmızı beyaz bayrak', 'bayrağımız kırmızı'] },
        { label: 'Çilek', share: 8.0, aliases: ['cilek', 'kırmızı çilek', 'dağ çileği', 'taze çilek', 'çileği', 'tatlı çilek', 'çilek', 'kirmizi cilek', 'dag cilegi', 'taze cilek', 'cilegi', 'tatli cilek', 'çilekler', 'olgun çilek', 'kırmızı çilekler', 'sulu çilek', 'bahçe çileği', 'kokulu çilek'] },
        { label: 'Kan', share: 7.0, aliases: ['kırmızı kan', 'damar kanı', 'kan damlası', 'kanı', 'kızıl kan', 'taze kan', 'kan', 'kirmizi kan', 'damar kani', 'kan damlasi', 'kani', 'kizil kan', 'kan rengi', 'kan kırmızısı', 'kanlar', 'kan akması', 'al kan', 'insan kanı'] },
        { label: 'Kiraz', share: 5.4, aliases: ['kırmızı kiraz', 'napolyon kiraz', 'kirazı', 'tatlı kiraz', 'dalından kiraz', 'olgun kiraz', 'kiraz', 'kirmizi kiraz', 'kirazi', 'tatli kiraz', 'dalindan kiraz', 'kirazlar', 'vişne kiraz', 'kırmızı kirazlar', 'saplı kiraz', 'salihli kirazı', 'sulu kiraz', 'taze kiraz'] },
        { label: 'Ateş', share: 4.4, aliases: ['ates', 'alev', 'kor ateş', 'sıcak köz', 'kızıl alev', 'yangın', 'ateş', 'kizil alev', 'yangin', 'ateş rengi', 'alevler', 'yanan ateş', 'şömine ateşi', 'kamp ateşi', 'kızıl ateş', 'ateş koru', 'ateşi', 'köz ateş'] },
        { label: 'Karpuz', share: 3.8, aliases: ['karpuz içi', 'kırmızı karpuz', 'karpuz dilimi', 'soğuk karpuz', 'karpuzu', 'olgun karpuz', 'karpuz', 'karpuz ici', 'kirmizi karpuz', 'soguk karpuz', 'karpuzlar', 'tatlı karpuz', 'kırmızı karpuz içi', 'çekirdekli karpuz', 'olgunlaşmış karpuz', 'karpuzun içi', 'yaz karpuzu', 'dilim karpuz'] },
        { label: 'Biber', share: 3.2, aliases: ['kırmızı biber', 'kapya biber', 'acı biber', 'pul biber', 'salçalık biber', 'biberi', 'biber', 'kirmizi biber', 'aci biber', 'salcalik biber', 'kırmızı kapya', 'kırmızı pul biber', 'toz biber', 'isot', 'cin biberi', 'kurutulmuş kırmızı biber', 'dolmalık kırmızı biber', 'kapya'] },
        { label: 'Kalp', share: 2.8, aliases: ['kırmızı kalp', 'kalp emojisi', 'sevgi kalbi', 'kalp şekli', 'kalbi', 'karton kalp', 'kalp', 'kirmizi kalp', 'kalp sekli', 'kalpler', 'kırmızı kalpler', 'kalp simgesi', 'aşk kalbi', 'peluş kalp', 'kalp balonu', 'kırmızı kalp emojisi', 'kalp çizimi', 'büyük kalp'] },
        { label: 'Trafik ışığı', share: 2.4, aliases: ['kırmızı ışık', 'dur ışığı', 'trafik lambası', 'stop lambası', 'fren lambası', 'ikaz ışığı', 'trafik ışığı', 'trafik isigi', 'kirmizi isik', 'dur isigi', 'trafik lambasi', 'stop lambasi', 'fren lambasi', 'ikaz isigi', 'kırmızı trafik ışığı', 'durma ışığı', 'trafik ışıkları', 'kırmızı sinyal'] },
        { label: 'Vişne', share: 2.0, aliases: ['visne', 'ekşi vişne', 'kırmızı vişne', 'vişne suyu', 'vişnesi', 'taze vişne', 'vişne', 'eksi visne', 'kirmizi visne', 'visne suyu', 'visnesi', 'vişneler', 'olgun vişne', 'koyu kırmızı vişne', 'vişne reçeli', 'dalından vişne', 'kütahya vişnesi', 'vişne tanesi'] },
        { label: 'İtfaiye aracı', share: 1.4, aliases: ['itfaiye araci', 'itfaiye', 'yangın aracı', 'kırmızı kamyon', 'itfaiye arabası', 'acil araç', 'itfaiye aracı', 'yangin araci', 'kirmizi kamyon', 'itfaiye arabasi', 'acil arac', 'itfaiyeci arabası', 'yangın kamyonu', 'itfaiye kamyonu', 'kırmızı itfaiye', 'itfaiye araçları', 'sirenli itfaiye', 'itfaiyeler'] },
        { label: 'Kırmızı halı', share: 1.0, aliases: ['kirmizi hali', 'ödül halısı', 'protokol halısı', 'galada halı', 'uzun kırmızı halı', 'halı kırmızı', 'kırmızı halı', 'odul halisi', 'protokol halisi', 'galada hali', 'uzun kirmizi hali', 'hali kirmizi', 'oscar halısı', 'festival halısı', 'tören halısı', 'kırmızı yolluk', 'kırmızı tören halısı', 'vip halı'] },
        { label: 'Uğur böceği', share: 0.8, aliases: ['ugur bocegi', 'benekli böcek', 'uç uç böceği', 'kırmızı böcek', 'uğur böceğini', 'küçük böcek', 'uğur böceği', 'benekli bocek', 'uc uc bocegi', 'kirmizi bocek', 'ugur bocegini', 'kucuk bocek', 'uğurböceği', 'ugurbocegi', 'uçuş böceği', 'kırmızı noktalı böcek', 'uğur böcekleri', 'benekli kırmızı böcek'] },
        { label: 'Nar', share: 0.6, aliases: ['kırmızı nar', 'nar tanesi', 'ekşi nar', 'tatlı nar', 'narı', 'nar suyu', 'nar', 'kirmizi nar', 'eksi nar', 'tatli nar', 'nari', 'narlar', 'olgun nar', 'kırmızı nar tanesi', 'taze nar', 'hicaz narı', 'nar çiçeği', 'kırmızı narlar'] },
        { label: 'Ruj', share: 0.4, aliases: ['kırmızı ruj', 'dudak boyası', 'ruju', 'parlak ruj', 'mat ruj', 'makyaj ruju', 'ruj', 'kirmizi ruj', 'dudak boyasi', 'rujlar', 'kırmızı dudak', 'kırmızı rujlar', 'likit ruj', 'kadife ruj', 'koyu kırmızı ruj', 'parlak kırmızı ruj', 'dudak ruju', 'makyaj'] },
        { label: 'Ferrari', share: 0.8, aliases: ['kırmızı spor araba', 'ferrari arabası', 'yarış arabası', 'kırmızı araba', 'spor otomobil', 'formula arabası', 'ferrari', 'kirmizi spor araba', 'ferrari arabasi', 'yaris arabasi', 'kirmizi araba', 'formula arabasi', 'kırmızı ferrari', 'ferrari otomobil', 'f1 arabası', 'süper araba', 'ferrariler', 'kırmızı yarış arabası'] }
      ].map(function (a, i) {
        if (i === 18) a.share = 1.2;
        if (i === 14) a.share = 0.9;
        if (i === 15) a.share = 0.7;
        if (i === 16) a.share = 0.5;
        if (i === 17) a.share = 0.3;
        return a;
      }).sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['muz', 'limon', 'ayçiçeği'], reason: 'Bu nesne sarı renklidir, kırmızı değil.' },
        { aliases: ['gökyüzü', 'deniz', 'okyanus'], reason: 'Bunlar mavi renkle özdeşleşir.' },
        { aliases: ['çimen', 'yaprak', 'ıspanak'], reason: 'Bunlar yeşil renkli şeylerdir.' },
        { aliases: ['kar', 'süt', 'pamuk'], reason: 'Bunlar beyaz renkli örneklerdir.' },
        { aliases: ['kömür', 'gece', 'zift'], reason: 'Bunlar siyah veya koyu renklidir.' },
        { aliases: ['patlıcan', 'lavanta', 'menekşe'], reason: 'Bu örnekler mor renktedir.' }
      ],
      tests: [
        { in: 'Elma', expect: 'Elma' },
        { in: 'turk bayragi', expect: 'Türk bayrağı' },
        { in: 'uç uç böceği', expect: 'Uğur böceği' },
        { in: 'limon', expect: 'invalid' }
      ]
    },
    {
      id: 'q33',
      cat: 'okul',
      text: 'Sınavdan önce yapılan bir şey söyle',
      answers: [
        { label: 'Ders çalışmak', share: 30.0, aliases: ['ders calismak', 'konu tekrar etmek', 'test çözmek', 'not okumak', 'sabahlamak', 'sınav çalışmak', 'ders çalışma', 'konu tekrari', 'test cozmek', 'sinav calismak', 'ders çalışırım', 'soru çözmek', 'deneme çözmek', 'konu çalışmak', 'tekrar yapmak', 'derslere çalışmak', 'son tekrar yapmak', 'ders çalışmak'] },
        { label: 'Dua etmek', share: 18.0, aliases: ['dua', 'okunmuş pirinç', 'ayetel kürsi okumak', 'besmele çekmek', 'allahım yardım et', 'dua okumak', 'dua etmek', 'ayetel kursi okumak', 'besmele cekmek', 'allahim yardim et', 'dua ederim', 'inşirah suresi okumak', 'fatiha okumak', 'namaz kılmak', 'allahım zihin açıklığı ver', 'zihin açıklığı duası', 'dualar etmek', 'el açıp dua etmek'] },
        { label: 'Kopya hazırlamak', share: 10.0, aliases: ['kopya hazirlamak', 'kopya yazmak', 'sıraya yazmak', 'küçük kağıt', 'avucuna yazmak', 'kopya çekmek', 'kopya', 'kopya kagidi', 'siraya yazmak', 'kucuk kagit', 'avuç içi kopya', 'kopya cekmek', 'sıra altı kopya', 'silgiye yazmak', 'kalemliğe kopya', 'kopya kağıdı hazırlamak', 'kopyalar', 'kopya yazma'] },
        { label: 'Uykusuz kalmak', share: 9.0, aliases: ['uykusuz kalmak', 'sabaha kadar çalışmak', 'az uyumak', 'hiç uyumamak', 'gece çalışmak', 'sabahlamak uyku', 'sabaha kadar calismak', 'hic uyumamak', 'gece calismak', 'sabaha kadar ders', 'uyumadan sınava girmek', 'gece boyu çalışmak', 'uykusuzluk', 'gözlerim kapanıyor', 'sabahlamış olmak', 'sabaha kadar ayakta', 'gece uyumamak', 'uykusuz'] },
        { label: 'Özet çıkarmak', share: 6.4, aliases: ['ozet cikarmak', 'not çıkarmak', 'altını çizmek', 'fosforlu kalem', 'küçük kartlar', 'formül yazmak', 'not cikarmak', 'altini cizmek', 'kucuk kartlar', 'formul yazmak', 'özet yazmak', 'ozet yazmak', 'önemli yerleri çizmek', 'not tutmak', 'özet defteri', 'kısa notlar', 'özetler', 'konu özeti'] },
        { label: 'Stres yapmak', share: 5.6, aliases: ['stres', 'heyecanlanmak', 'panik yapmak', 'kaygılanmak', 'karnı ağrımak', 'gerilmek', 'stres olmak', 'kaygilanmak', 'karni agrimak', 'sınav stresi', 'sinav stresi', 'paniklemek', 'kalp çarpıntısı', 'titremek', 'endişelenmek', 'stresli olmak', 'stres yaparım', 'heyecan yapmak'] },
        { label: 'Kahve içmek', share: 4.8, aliases: ['kahve icmek', 'türk kahvesi', 'enerji içeceği', 'çay içmek', 'kafein', 'uyku açıcı', 'turk kahvesi', 'enerji icecegi', 'cay icmek', 'uyku acici', 'filtre kahve', 'nescafe içmek', 'bir fincan kahve', 'kahve yapıp içmek', 'bol kahve', 'espresso', 'kahve', 'kahve tüketmek'] },
        { label: 'Kalem açmak', share: 4.0, aliases: ['kalem acmak', 'silgi hazırlamak', 'kalem kutusu', 'yedek kalem', 'kalemlik kontrol', 'uçlu kalem', 'silgi hazirlamak', 'kalemlik hazırlamak', 'uclu kalem', 'kalem silgi hazırlamak', 'kalemtıraş', 'uç takmak', 'kurşun kalem açmak', 'kalemleri hazırlamak', 'sınav kalemi hazırlamak', 'iki kalem almak', 'kalem açacağı', 'yedek silgi'] },
        { label: 'Arkadaşa sormak', share: 3.2, aliases: ['arkadasa sormak', 'son tekrar', 'kapı önünde sormak', 'not istemek', 'ne çıkar diye sormak', 'konuşmak', 'kapi onunde sormak', 'konusmak', 'arkadaşlarla tekrar', 'arkadaşa konu sormak', 'bu çıkar mı diye sormak', 'kankaya sormak', 'arkadaştan not almak', 'sınıf arkadaşına sormak', 'soru sormak', 'birbirine sormak', 'arkadaşlarla çalışmak', 'çalıştın mı diye sormak'] },
        { label: 'Motivasyon müziği', share: 2.4, aliases: ['muzik dinlemek', 'rahatlamak', 'derin nefes almak', 'kulaklık takmak', 'müzik dinlemek', 'yürümek', 'motivasyon muzigi', 'kulaklik takmak', 'yurumek', 'şarkı dinlemek', 'sarki dinlemek', 'motivasyon şarkısı', 'kafa dağıtmak', 'spor yapmak', 'meditasyon', 'müzik açmak', 'nefes egzersizi', 'müzik dinlerim'] },
        { label: 'Çikolata yemek', share: 1.8, aliases: ['cikolata yemek', 'şeker yemek', 'tatlı yemek', 'enerji almak', 'atıştırmak', 'badem yemek', 'seker yemek', 'tatli yemek', 'atistirmak', 'bitter çikolata', 'şekerli bir şey yemek', 'gofret yemek', 'çikolata', 'cikolata', 'zihin açsın diye çikolata', 'bisküvi yemek', 'tatlı bir şey yemek', 'çikolata yerim'] },
        { label: 'Erken yatmak', share: 1.4, aliases: ['uyumak', 'dinlenmek', 'kafayı dinlemek', 'erken uyumak', 'uyku düzeni', 'güzel uyumak', 'erkenden uyumak', 'uyku duzeni', 'guzel uyumak', 'erkenden yatmak', 'iyi uyumak', 'uykusunu almak', 'saat onda yatmak', 'erken uyuyup dinlenmek', 'dinç kalkmak', 'uyku', 'yatıp uyumak', 'erken yatarım'] },
        { label: 'Nazar boncuğu takmak', share: 1.0, aliases: ['nazar boncugu', 'uğur getiren eşya', 'muska', 'totem yapmak', 'nazar boncuğu takmak', 'ugur getiren esya', 'nazarlık takmak', 'uğur eşyası', 'şans bilekliği', 'totem', 'dua bilekliği', 'uğur getirmesi için takı', 'şans kolyesi', 'muska takmak', 'uğur getiren takı', 'nazarlık'] },
        { label: 'Uğurlu kalem', share: 0.8, aliases: ['ugurlu kalem', 'hep aynı kalem', 'şanslı kalem', 'sınav kalemi', 'özel kalem', 'uğurlu silgi', 'hep ayni kalem', 'sansli kalem', 'sinav kalemi', 'ozel kalem', 'ugurlu silgi', 'şans getiren kalem', 'en sevdiğim kalem', 'uğurlu kalemim', 'hep kullandığım kalem', 'aynı kalemle girmek', 'uğurlu kalemi', 'şanslı kalemim'] },
        { label: 'Sabah kahvaltı yapmak', share: 0.6, aliases: ['kahvaltı yapmak', 'yumurta yemek', 'bal yemek', 'ceviz yemek', 'pekmez içmek', 'güzel kahvaltı', 'kahvalti yapmak', 'pekmez icmek', 'guzel kahvalti', 'kahvaltı etmek', 'iyi kahvaltı yapmak', 'sağlam kahvaltı', 'tahin pekmez', 'kahvaltı', 'kahvalti', 'enerjik kahvaltı', 'kahvaltı yaparım', 'yumurta bal yemek'] },
        { label: 'Aynı tişörtü giymek', share: 0.4, aliases: ['şans getirsin diye aynı tişörtü giymek', 'uğurlu tişört', 'şanslı kazak', 'rahat giyinmek', 'eşofman giymek', 'uğurlu kıyafet', 'ayni tisortu giymek', 'ugurlu tisort', 'sansli kazak', 'esofman giymek', 'ugurlu kiyafet', 'şanslı tişört', 'aynı kazağı giymek', 'totem kıyafet', 'uğurlu giysi', 'rahat kıyafet giymek', 'aynı pantolonu giymek', 'şans getiren tişört'] },
        { label: 'Tuvalete gitmek', share: 0.6, aliases: ['lavaboya gitmek', 'el yüz yıkamak', 'su içmek', 'sınav öncesi lavabo', 'yüzünü yıkamak', 'hazırlanmak', 'tuvalete gitmek', 'el yuz yikamak', 'su icmek', 'sinav oncesi lavabo', 'yuzunu yikamak', 'hazirlanmak', 'wc gitmek', 'tuvalet', 'lavabo', 'sınavdan önce tuvalet', 'elini yüzünü yıkamak', 'tuvalet ihtiyacı'] }
      ].map(function (a, i) {
        if (i === 16) a.share = 0.6;
        if (i === 14) a.share = 0.4;
        if (i === 15) a.share = 0.2;
        if (i === 11) a.share = 1.4;
        if (i === 0) a.share = 30.2;
        return a;
      }).sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['tatile çıkmak', 'denize girmek'], reason: 'Sınav öncesi yapılan bir hazırlık değil.' },
        { aliases: ['düğüne gitmek', 'halay çekmek'], reason: 'Sınav hazırlığıyla ilgisi olmayan bir etkinlik.' },
        { aliases: ['karne almak', 'mezun olmak'], reason: 'Bu sınavdan sonra gerçekleşen bir sonuç.' },
        { aliases: ['tatil bavulu toplamak', 'uçak bileti'], reason: 'Sınav öncesi davranışlardan değil.' },
        { aliases: ['diploma töreni', 'kep atmak'], reason: 'Bu dönem veya okul bitince yapılır.' },
        { aliases: ['balık tutmak', 'kamp yapmak'], reason: 'Sınav öncesi klasik öğrenci davranışı değil.' }
      ],
      tests: [
        { in: 'Ders çalışmak', expect: 'Ders çalışmak' },
        { in: 'kopya hazirlamak', expect: 'Kopya hazırlamak' },
        { in: 'uğurlu tişört', expect: 'Aynı tişörtü giymek' },
        { in: 'karne almak', expect: 'invalid' }
      ]
    },
    {
      id: 'q34',
      cat: 'doğa',
      text: 'Bir deniz canlısı söyle',
      answers: [
        { label: 'Yunus', share: 20.6, aliases: ['yunus balığı', 'yunus baligi', 'afalina', 'sevimli yunus', 'yunuslar', 'yunusu', 'yunus', 'yunus balıkları', 'yunuslar denizde', 'akıllı yunus', 'şişe burunlu yunus', 'yunusu görmek', 'gri yunus', 'sürü yunus', 'yunus memelisi', 'eğitilmiş yunus', 'boğazda yunus', 'yunus balığıdır'] },
        { label: 'Köpekbalığı', share: 14.0, aliases: ['kopekbaligi', 'köpek balığı', 'büyük beyaz', 'camgöz', 'çekiç başlı', 'köpekbalıkları', 'köpekbalığı', 'kopek baligi', 'buyuk beyaz', 'camgoz', 'cekic basli', 'kopekbaliklari', 'büyük beyaz köpekbalığı', 'çekiç köpekbalığı', 'kaplan köpekbalığı', 'köpekbalığı balığı', 'beyaz köpekbalığı', 'köpekbalığını'] },
        { label: 'Ahtapot', share: 13.0, aliases: ['sekiz kollu', 'ahtapotlar', 'mürekkep balığı', 'ahtapotu', 'kollu ahtapot', 'deniz ahtapotu', 'ahtapot', 'murekkep baligi', 'ahtapotlar denizde', 'sekiz kollu ahtapot', 'kırmızı ahtapot', 'dev ahtapot', 'ahtapot kolu', 'akıllı ahtapot', 'kaya ahtapotu', 'ahtapotu görmek', 'ahtapot canlısı', 'deniz ahtapotları'] },
        { label: 'Balina', share: 10.0, aliases: ['mavi balina', 'katil balina', 'orka', 'kambur balina', 'balinalar', 'balinası', 'balina', 'balinasi', 'mavi balinalar', 'dev balina', 'gri balina', 'ispermeçet balinası', 'beyaz balina', 'okyanus balinası', 'balinayı', 'büyük balina', 'kambur balinalar', 'balina memelisi'] },
        { label: 'Denizanası', share: 9.0, aliases: ['denizanasi', 'deniz anası', 'medüz', 'yakan denizanası', 'şeffaf canlı', 'denizanaları', 'denizanası', 'meduz', 'yakan denizanasi', 'seffaf canli', 'denizanalari', 'mor denizanası', 'zehirli denizanası', 'deniz anaları', 'ay denizanası', 'şeffaf denizanası', 'pusula denizanası', 'denizanası yakması'] },
        { label: 'Yengeç', share: 7.0, aliases: ['yengec', 'mavi yengeç', 'kral yengeç', 'kıskaçlı', 'yengeçler', 'yengeci', 'yengeç', 'mavi yengec', 'kral yengec', 'kiskacli', 'yengecler', 'kum yengeci', 'pavurya', 'çağanoz', 'kıyı yengeci', 'yengeçler sahilde', 'kıskaçlı yengeç', 'kırmızı yengeç'] },
        { label: 'Balık', share: 6.0, aliases: ['balik', 'hamsi', 'lüfer', 'palamut', 'levrek', 'çipura', 'uskumru', 'istavrit', 'mezgit', 'kalkan', 'kılıç balığı', 'balık', 'lufer', 'cipura', 'kilic baligi', 'sardalya', 'barbunya', 'tekir', 'kefal', 'zargana', 'balıklar', 'baliklar'] },
        { label: 'Midye', share: 5.0, aliases: ['kara midye', 'istiridye', 'midyeler', 'midye kabuğu', 'deniz tarağı', 'midyesi', 'midye', 'midye dolma', 'kara midyeler', 'kum midyesi', 'midyecilik', 'kabuklu midye', 'deniz midyesi', 'midye kabukları', 'istiridyeler', 'inci midyesi', 'midyeyi', 'akdeniz midyesi'] },
        { label: 'Kaplumbağa', share: 3.4, aliases: ['caretta caretta', 'deniz kaplumbağası', 'su kaplumbağası', 'karetta', 'kaplumbağalar', 'caretta', 'kaplumbağa', 'kaplumbaga', 'deniz kaplumbagasi', 'su kaplumbagasi', 'kaplumbagalar', 'yeşil deniz kaplumbağası', 'iri başlı kaplumbağa', 'dalyan caretta', 'yumurtlayan kaplumbağa', 'deniz kaplumbağaları', 'kaplumbağayı', 'kaplumbağası'] },
        { label: 'Istakoz', share: 2.8, aliases: ['kerevit', 'karides', 'kırmızı ıstakoz', 'böcek ıstakoz', 'jumbo karides', 'istakozu', 'ıstakoz', 'istakoz', 'kirmizi istakoz', 'bocek istakoz', 'istakozlar', 'karidesler', 'mavi ıstakoz', 'dev ıstakoz', 'kıskaçlı ıstakoz', 'teke', 'çimçim karides', 'deniz böceği'] },
        { label: 'Mercan', share: 2.2, aliases: ['mercanlar', 'deniz mercanı', 'resif', 'kırmızı mercan', 'sünger', 'deniz süngeri', 'mercan', 'deniz mercani', 'kirmizi mercan', 'sunger', 'deniz sungeri', 'mercan kayalığı', 'mercan resifi', 'beyin mercanı', 'ateş mercanı', 'mercanları', 'renkli mercan', 'süngerler'] },
        { label: 'Denizatı', share: 1.6, aliases: ['denizati', 'deniz atı', 'küçük denizatı', 'hipokampus', 'deniz atları', 'denizatı balığı', 'denizatı', 'kucuk denizati', 'deniz atlari', 'denizati baligi', 'deniz atı balığı', 'küçük deniz atı', 'minik denizatı', 'denizatılar', 'denizatları', 'sevimli denizatı', 'erkek denizatı', 'kıvrık kuyruklu denizatı'] },
        { label: 'Deniz yıldızı', share: 1.4, aliases: ['deniz yildizi', 'beş kollu yıldız', 'yıldız balığı', 'deniz yıldızları', 'kırmızı yıldız', 'yıldız deniz', 'deniz yıldızı', 'bes kollu yildiz', 'yildiz baligi', 'deniz yildizlari', 'kirmizi yildiz', 'beş kollu deniz yıldızı', 'turuncu deniz yıldızı', 'deniz yıldızını', 'denizyıldızı', 'denizyildizi', 'sahilde deniz yıldızı', 'deniz yıldızı canlısı'] },
        { label: 'Fok', share: 1.2, aliases: ['akdeniz foku', 'fok balığı', 'deniz aslanı', 'mors', 'foklar', 'sevimli fok', 'fok', 'fok baligi', 'deniz aslani', 'akdeniz foku koruma', 'yavru fok', 'keşiş foku', 'beyaz fok', 'gri fok', 'kutup foku', 'fok balıkları', 'fok balığını', 'deniz aslanları'] },
        { label: 'Orkinos', share: 1.0, aliases: ['ton balığı', 'ton balığı orkinos', 'orkinos balığı', 'mavi yüzgeçli orkinos', 'orkinoslar', 'tuna balığı', 'orkinos', 'ton baligi', 'orkinos baligi', 'mavi yuzgecli orkinos', 'dev orkinos', 'beyaz ton', 'orkinosu', 'orkinos balıkları', 'büyük orkinos', 'akdeniz orkinosu', 'ton balıkları', 'tuna baligi'] },
        { label: 'Kalamar', share: 0.8, aliases: ['sübye', 'kalamarlar', 'mürekkep kalamar', 'kalamarı', 'deniz kalamarı', 'dev kalamar', 'kalamar', 'subye', 'murekkep kalamar', 'kalamari', 'deniz kalamari', 'kalamar balığı', 'mürekkepli kalamar', 'akdeniz kalamarı', 'kalamarlar denizde', 'küçük kalamar', 'kalamarı yakalamak', 'kalamar canlısı'] },
        { label: 'Vatoz', share: 0.6, aliases: ['vatoz balığı', 'elektrikli vatoz', 'manta', 'manta vatozu', 'vatozlar', 'yassı balık', 'vatoz', 'vatoz baligi', 'yassi balik', 'iğneli vatoz', 'dev manta', 'vatoz balıkları', 'kanatlı vatoz', 'kum vatozu', 'vatozu', 'deniz vatozu', 'benekli vatoz', 'vatoz balığını'] },
        { label: 'Deniz kestanesi', share: 0.4, aliases: ['deniz kestanesi', 'dikenli kestane', 'karakestane', 'kestaneler', 'siyah kestane', 'deniz dikeni', 'denizkestanesi', 'denizkestanesi siyah', 'mor deniz kestanesi', 'dikenli deniz kestanesi', 'kayalık kestanesi', 'deniz kestaneleri', 'kestane deniz', 'siyah dikenli kestane', 'deniz kestanesini', 'kestanesi', 'dikenli deniz canlısı', 'siyah deniz kestanesi'] }
      ],
      invalid: [
        { aliases: ['aslan', 'kaplan', 'fil'], reason: 'Bu kara hayvanı, deniz canlısı değil.' },
        { aliases: ['martı', 'kartal', 'güvercin'], reason: 'Bu denizde yaşayan bir canlı değil, kuş.' },
        { aliases: ['kedi', 'köpek', 'at'], reason: 'Bu karada yaşayan evcil bir hayvan.' },
        { aliases: ['kelebek', 'arı', 'karınca'], reason: 'Bu böcek türü, deniz canlısı değil.' },
        { aliases: ['timsah', 'su aygırı'], reason: 'Genelde tatlı su ve nehirlerde yaşar, deniz canlısı sayılmaz.' },
        { aliases: ['vapur', 'denizaltı'], reason: 'Bu canlı değil, deniz taşıtı.' }
      ],
      tests: [
        { in: 'Yunus', expect: 'Yunus' },
        { in: 'kopekbaligi', expect: 'Köpekbalığı' },
        { in: 'caretta caretta', expect: 'Kaplumbağa' },
        { in: 'aslan', expect: 'invalid' }
      ]
    },
    {
      id: 'q35',
      cat: 'ev',
      text: 'Akşam yemeğinden sonra yapılan bir şey söyle',
      answers: [
        { label: 'Çay içmek', share: 30.0, aliases: ['cay icmek', 'çay demlemek', 'demli çay', 'akşam çayı', 'çay', 'bir bardak çay', 'çay içmek', 'cay demlemek', 'demli cay', 'aksam cayi', 'bir bardak cay', 'çay koymak', 'çay keyfi', 'iki bardak çay', 'tavşan kanı çay', 'çaydanlık koymak', 'çay içilir', 'çay saati'] },
        { label: 'Televizyon izlemek', share: 22.0, aliases: ['tv izlemek', 'televizyon', 'haber izlemek', 'maç izlemek', 'program izlemek', 'kanallara bakmak', 'televizyon izlemek', 'mac izlemek', 'akşam tv izlemek', 'haberlere bakmak', 'tv açmak', 'televizyon seyretmek', 'akşam haberleri', 'belgesel izlemek', 'yarışma izlemek', 'kumandayı almak', 'tv seyretmek', 'televizyon karşısında oturmak'] },
        { label: 'Bulaşık yıkamak', share: 14.0, aliases: ['bulasik yikamak', 'mutfağı toplamak', 'bulaşık makinesini dizmek', 'sofrayı toplamak', 'bulaşıklar', 'mutfak temizliği', 'mutfagi toplamak', 'bulasik makinesini dizmek', 'sofrayi toplamak', 'bulasiklar', 'mutfak temizligi', 'bulaşık', 'bulasik', 'bulaşıkları yıkamak', 'makineye bulaşık dizmek', 'masayı toplamak', 'mutfağı temizlemek', 'bulaşıkları yerleştirmek'] },
        { label: 'Meyve yemek', share: 8.8, aliases: ['meyve', 'meyve soymak', 'elma portakal yemek', 'karpuz yemek', 'meyve tabağı', 'tatlı yemek', 'meyve yemek', 'meyve tabagi', 'tatli yemek', 'elma yemek', 'portakal soymak', 'mandalina yemek', 'muz yemek', 'meyve doğramak', 'meyveler', 'meyve saati', 'armut yemek', 'kivi yemek'] },
        { label: 'Yürüyüş yapmak', share: 6.0, aliases: ['yuruyus yapmak', 'yürümek', 'sahilde yürümek', 'dışarı çıkmak', 'hava almak', 'akşam yürüyüşü', 'yurumek', 'sahilde yurumek', 'disari cikmak', 'aksam yuruyusu', 'yürüyüş', 'yuruyus', 'mahallede yürümek', 'parkta yürümek', 'akşam gezmesi', 'hava almaya çıkmak', 'köpek gezdirmek', 'yürüyüşe çıkmak'] },
        { label: 'Dizi izlemek', share: 5.0, aliases: ['dizi', 'netflix izlemek', 'film izlemek', 'yeni bölüm izlemek', 'akşam dizisi', 'sinema izlemek', 'dizi izlemek', 'dizi izleme', 'yeni bolum izlemek', 'aksam dizisi', 'akşam filmi', 'dizi seyretmek', 'internetten dizi', 'bölüm izlemek', 'yerli dizi', 'yabancı dizi', 'film açmak', 'dizi keyfi'] },
        { label: 'Telefona bakmak', share: 4.4, aliases: ['sosyal medya', 'instagrama bakmak', 'telefonla oynamak', 'mesajlaşmak', 'youtube izlemek', 'ekrana bakmak', 'telefona bakmak', 'instagram gezinmek', 'mesajlasmak', 'telefona dalmak', 'reels izlemek', 'tiktok izlemek', 'twittera bakmak', 'telefonla ilgilenmek', 'oyun oynamak telefonda', 'bildirimlere bakmak', 'telefonda gezmek', 'telefon kurcalamak'] },
        { label: 'Uyumak', share: 3.6, aliases: ['yatmak', 'uyuklamak', 'kestirmek', 'yatağa girmek', 'erken yatmak', 'şekerleme yapmak', 'uyumak', 'yataga girmek', 'sekerleme yapmak', 'uykuya dalmak', 'koltukta uyuyakalmak', 'uyku', 'yatağa uzanmak', 'erkenden uyumak', 'gece uykusu', 'dinlenmek', 'uzanmak', 'uyuklamak koltukta'] },
        { label: 'Kahve içmek', share: 2.2, aliases: ['türk kahvesi', 'kahve', 'filtre kahve', 'akşam kahvesi', 'kahve keyfi', 'bir fincan kahve', 'kahve icmek', 'turk kahvesi', 'aksam kahvesi', 'türk kahvesi içmek', 'kahve içme', 'kahve yapmak', 'nescafe içmek', 'kahve pişirmek', 'yemek üstü kahve', 'sade kahve', 'orta kahve', 'kahve molası'] },
        { label: 'Aileyle sohbet', share: 1.4, aliases: ['aileyle konuşmak', 'muhabbet etmek', 'günün özetini anlatmak', 'oturup konuşmak', 'sohbet', 'dertleşmek', 'aileyle sohbet', 'aileyle konusmak', 'gunun ozetini anlatmak', 'oturup konusmak', 'dertlesmek', 'muhabbet', 'aile sohbeti', 'evdekilerle konuşmak', 'anne babayla sohbet', 'çay eşliğinde sohbet', 'sohbet etmek', 'günün kritiğini yapmak'] },
        { label: 'Çekirdek çitlemek', share: 1.0, aliases: ['cekirdek citlemek', 'çekirdek', 'ay çekirdeği', 'kuruyemiş yemek', 'çerez yemek', 'kabak çekirdeği', 'ay cekirdegi', 'kuruyemis yemek', 'cerez yemek', 'kabak cekirdegi', 'çerez', 'cerez', 'kuruyemiş', 'kuruyemis', 'fındık fıstık yemek', 'çekirdek yemek', 'çitlemek', 'tuzlu çekirdek'] },
        { label: 'Okey oynamak', share: 0.8, aliases: ['okey', 'tavla oynamak', 'kutu oyunu', 'iskambil oynamak', 'batak', 'pişti', 'okey oynamak', 'batak oynamak', 'pisti', 'tavla', 'kutu oyunları', 'okey taşları', '101 oynamak', 'ailece okey', 'oyun oynamak', 'monopoly', 'uno oynamak', 'kağıt oynamak'] },
        { label: 'Balkona çıkmak', share: 0.6, aliases: ['balkonda oturmak', 'sigara içmek', 'serinlemek', 'hava almak balkonda', 'balkon keyfi', 'dışarıyı izlemek', 'balkona cikmak', 'sigara icmek', 'balkonda oturma', 'disariyi izlemek', 'balkonda çay', 'balkonda oturup hava almak', 'sigara', 'balkon', 'temiz hava almak', 'balkonda serinlemek', 'akşam balkonu', 'balkona oturmak'] },
        { label: 'Ödev yapmak', share: 0.4, aliases: ['odev yapmak', 'ders çalışmak', 'kitap okumak', 'okuma yapmak', 'roman okumak', 'ev ödevi çalışmak', 'ders calismak', 'calismak', 'ödev', 'odev', 'ders çalışması', 'ders kitabı', 'okuma kitabı', 'ders tekrarı', 'test çözmek', 'ödevleri bitirmek', 'derslerine bakmak', 'okuma saati'] },
        { label: 'Diş fırçalamak', share: 0.2, aliases: ['dis fircalamak', 'el yüz yıkamak', 'pijama giymek', 'duş almak', 'gece bakımı', 'hazırlık', 'el yuz yikamak', 'dus almak', 'gece bakimi', 'hazirlik', 'dişleri fırçalamak', 'diş fırçası', 'yatmadan önce diş fırçalamak', 'pijama giyip diş fırçalamak', 'banyo yapmak', 'yüz yıkamak', 'cilt bakımı', 'uyku hazırlığı'] }
      ].sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['kahvaltı yapmak', 'yumurta haşlamak'], reason: 'Kahvaltı sabah öğünüdür, akşam yemeğinden sonra yapılmaz.' },
        { aliases: ['okula gitmek', 'işe gitmek'], reason: 'Bunlar sabah başlanan günlük işlerdir.' },
        { aliases: ['sahura kalkmak', 'bayram namazı'], reason: 'Akşam yemeği rutiniyle ilgili değil.' },
        { aliases: ['güneşlenmek', 'plaja gitmek'], reason: 'Akşam saatlerinde yapılan bir aktivite değil.' },
        { aliases: ['alarm kurmak değil', 'sabah sporu'], reason: 'Sabah yapılan bir rutin, akşam sonrası değil.' },
        { aliases: ['öğle uykusu', 'öğle molası'], reason: 'Gündüz saatlerine ait bir durum.' }
      ],
      tests: [
        { in: 'Çay içmek', expect: 'Çay içmek' },
        { in: 'bulasik yikamak', expect: 'Bulaşık yıkamak' },
        { in: 'ay çekirdeği', expect: 'Çekirdek çitlemek' },
        { in: 'kahvaltı yapmak', expect: 'invalid' }
      ]
    },
    {
      id: 'q36',
      cat: 'kültür',
      text: 'Bir masal ya da çizgi film kahramanı söyle',
      answers: [
        { label: 'Keloğlan', share: 33.8, aliases: ['keloglan', 'kel oğlan', 'keloğlan ve eşeği', 'balkız', 'huysuz', 'keloğlan uzun', 'keloğlan', 'kel oglan', 'keloglan ve esegi', 'balkiz', 'keloğlan masalı', 'keloğlan çizgi filmi', 'keloğlanın annesi', 'kara vezir', 'keloğlan sivri', 'cankız', 'uzun huysuz', 'kel oğlan masalları'] },
        { label: 'Nasreddin Hoca', share: 18.0, aliases: ['nasreddin', 'hoca', 'eşeğe ters binen', 'göle maya çalan', 'nasrettin hoca', 'akşehirli hoca', 'nasreddin hoca', 'esege ters binen', 'gole maya calan', 'aksehirli hoca', 'nasrettin', 'nasreddin hoca fıkraları', 'hoca nasreddin', 'ya tutarsa', 'kazan doğurdu', 'nasrettin hoca eşeği', 'akşehir', 'timurlenk nasreddin hoca'] },
        { label: 'Pepee', share: 12.0, aliases: ['pepe', 'bebee', 'şila', 'zulu', 'pepee çizgi film', 'balon pepee', 'pepee', 'sila', 'pepee cizgi film', 'pepee şarkıları', 'pepee çok üzgünüm', 'ekmek yedim büyüdüm', 'dede pepee', 'nene pepee', 'maymuş', 'pepee ve bebek', 'trt çocuk pepee', 'pepee ve şila'] },
        { label: 'Karagöz ve Hacivat', share: 9.4, aliases: ['karagöz', 'hacivat', 'karagoz hacivat', 'gölge oyunu', 'tuzsuz deli bekir', 'zenneler', 'karagoz', 'golge oyunu', 'karagöz hacivat', 'karagoz ve hacivat', 'hacivat karagöz', 'hacivat ve karagöz', 'çelebi', 'beberuhi', 'bursa karagöz', 'ramazan gölge oyunu', 'hacivatım', 'karagözüm'] },
        { label: 'Rafadan Tayfa', share: 8.6, aliases: ['hayri rafadan tayfa', 'kamil rafadan tayfa', 'akın rafadan tayfa', 'mert rafadan tayfa', 'sevim rafadan tayfa', 'hale rafadan tayfa', 'rafadan tayfa', 'akin rafadan tayfa', 'rafadan tayfa hayri', 'kamil hayri', 'basri amca', 'rüstem abi', 'yumak rafadan tayfa', 'mahalle arkadaşları', 'rafadan tayfa göbeklitepe', 'rafadan tayfa dehliz macerası', 'rafadan tayfa çizgi filmi', 'kamil ve hayri'] },
        { label: 'Kral Şakir', share: 7.0, aliases: ['kral sakir', 'şakir', 'fil necati', 'kral şakir remzi', 'kral şakir canan', 'kral şakir mirket', 'kral şakir', 'sakir', 'kral şakir fil necati', 'necati kral şakir', 'kral şakir çizgi filmi', 'varol yaşaroğlu', 'remzi baba', 'kadriye', 'peygamber devesi', 'tanju kral şakir', 'kral şakir korsanlar diyarı', 'kral şakir oyun zamanı'] },
        { label: 'Dede Korkut', share: 3.0, aliases: ['korkut ata', 'boğaç han', 'deli dumrul', 'bamsı beyrek', 'tepegöz', 'korkut', 'dede korkut', 'bogac han', 'bamsi beyrek', 'tepegoz', 'dede korkut hikayeleri', 'korkut dede', 'oğuz hikayeleri', 'dirse han', 'salur kazan', 'basat', 'dede korkut masalları', 'korkut ata hikayeleri'] },
        { label: 'Niloya', share: 2.2, aliases: ['niloya çizgi film', 'niloya mete', 'tosbik niloya', 'niloya mine', 'niloyanın kaplumbağası', 'niloyası', 'niloya', 'niloya cizgi film', 'niloyanin kaplumbagasi', 'niloyasi', 'niloya ve tosbik', 'trt çocuk niloya', 'niloya şarkısı', 'abisi murat', 'annesi niloya', 'köyde yaşayan kız', 'niloya çizgi', 'sevimli niloya'] },
        { label: 'Pamuk Prenses', share: 1.6, aliases: ['yedi cüceler', 'pamuk prenses', 'yedi cuceler', 'pamuk prenses ve yedi cüceler', 'pamuk prenses ve 7 cüceler', 'pamuk prenses masalı', 'zehirli elma', 'kötü kalpli kraliçe', 'ayna ayna söyle bana', 'prens ve pamuk prenses', 'yedi cüceler masalı', 'pamuk prenses çizgi filmi', 'pamuk prenses hikayesi', 'elmalı prenses', 'pamuk prenses ve prens', 'cüceler evi'] },
        { label: 'Pinokyo', share: 1.2, aliases: ['tahta çocuk', 'uzayan burun', 'gepetto', 'pinokyo masalı', 'pinokyosu', 'yalancı kukla', 'pinokyo', 'tahta cocuk', 'pinokyo masali', 'pinokyo kukla', 'yalanci kukla', 'burnu uzayan çocuk', 'tahta kukla', 'gepetto usta', 'mavi peri', 'pinokyo çizgi filmi', 'yalan söyleyince burnu uzayan', 'kukla pinokyo'] },
        { label: 'Köstebekgiller', share: 0.9, aliases: ['kostebekgiller', 'boyo', 'süslü', 'bebi', 'kösteban', 'köstebek', 'köstebekgiller', 'suslu', 'kosteban', 'kostebek', 'köstebekgiller çizgi filmi', 'köstebek ailesi', 'trt çocuk köstebekgiller', 'boyo süslü', 'köstebekgiller perili orman', 'köstebekgiller gölgenin tılsımı', 'sevimli köstebekler', 'köstebekler'] },
        { label: 'Tospik', share: 0.7, aliases: ['kaplumbağa tospik', 'tosbik', 'yeşil kaplumbağa', 'çizgi film kaplumbağa', 'tospik karakteri', 'sevimli kaplumbağa', 'tospik', 'kaplumbaga tospik', 'yesil kaplumbaga', 'cizgi film kaplumbaga', 'sevimli kaplumbaga', 'niloyanın tospiği', 'kaplumbağa', 'kaplumbaga', 'tospik kaplumbağa', 'uçan kaplumbağa', 'yeşil tospik', 'tospik çizgi'] },
        { label: 'Şahmeran', share: 0.5, aliases: ['sahmeran', 'yılanların kraliçesi', 'mersin efsanesi', 'lokman hekim', 'camşab', 'tarsus şahmeran', 'şahmeran', 'yilanlarin kralicesi', 'camsab', 'tarsus sahmeran', 'yılanların şahı', 'yarı kadın yarı yılan', 'şahmeran efsanesi', 'şahmaran', 'sahmaran', 'anadolu efsanesi şahmeran', 'şahmeran masalı', 'mardin şahmeran'] },
        { label: 'Cin Ali', share: 0.3, aliases: ['çöp adam', 'cin ali kitabı', 'siyah at', 'ilkokul kitabı', 'rasim kaygusuz', 'ali cin', 'cin ali', 'cop adam', 'cin ali kitabi', 'ilkokul kitabi', 'cin ali okula gidiyor', 'cin ali top oynuyor', 'cin ali at bin', 'çöp adam cin ali', 'cin alinin atı', 'cin ali serisi', 'okuma kitabı cin ali', 'cin ali karakteri'] },
        { label: 'Kuzucuk', share: 0.8, aliases: ['beyaz kuzucuk', 'trt çocuk kuzucuk', 'kuzucuk çizgi film', 'trt kuzucuk', 'çizgi film kuzucuk', 'kuzucuk çizgi', 'kuzucuk', 'trt cocuk kuzucuk', 'kuzucuk cizgi film', 'cizgi film kuzucuk', 'kuzucuk cizgi', 'sevimli kuzucuk', 'kuzu kuzucuk', 'kuzucuk ve arkadaşları', 'küçük kuzu', 'kuzucuk trt', 'kuzucuk karakteri', 'sevimli kuzu'] }
      ].map(function (a, i) {
        if (i === 14) a.share = 0.2;
        if (i === 13) a.share = 0.4;
        if (i === 12) a.share = 0.6;
        if (i === 11) a.share = 0.8;
        if (i === 10) a.share = 1.0;
        if (i === 0) a.share = 34.0;
        return a;
      }).sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['polat alemdar', 'memati'], reason: 'Bu gerçek oyuncuların oynadığı bir dizi karakteri.' },
        { aliases: ['recep ivedik', 'arif ışık'], reason: 'Bu sinema filmi karakteri, masal ya da çizgi film kahramanı değil.' },
        { aliases: ['tarkan', 'sezen aksu'], reason: 'Bu gerçek bir şarkıcı, kurgu kahraman değil.' },
        { aliases: ['fatih sultan mehmet', 'atatürk'], reason: 'Gerçek tarihi şahsiyet; masal veya çizgi film kahramanı değil.' },
        { aliases: ['bihter', 'behlül'], reason: 'Bu televizyon draması karakteri.' },
        { aliases: ['arda güler', 'alex'], reason: 'Bu gerçek bir futbolcu, çizgi film karakteri değil.' }
      ],
      tests: [
        { in: 'Keloğlan', expect: 'Keloğlan' },
        { in: 'fil necati', expect: 'Kral Şakir' },
        { in: 'gölge oyunu', expect: 'Karagöz ve Hacivat' },
        { in: 'polat alemdar', expect: 'invalid' }
      ]
    },
    {
      id: 'q37',
      cat: 'yemek',
      text: 'Sevilen bir atıştırmalık söyle',
      answers: [
        { label: 'Çekirdek', share: 35.4, aliases: ['cekirdek', 'ay çekirdeği', 'çiğdem', 'siyah çekirdek', 'kabak çekirdeği', 'tuzlu çekirdek', 'çekirdek', 'ay cekirdegi', 'cigdem', 'siyah cekirdek', 'kabak cekirdegi', 'tuzlu cekirdek', 'ayçekirdeği', 'aycekirdegi', 'tuzsuz çekirdek', 'çekirdek çitlemek', 'beyaz çekirdek', 'dakota çekirdek'] },
        { label: 'Cips', share: 15.0, aliases: ['patates cipsi', 'mısır cipsi', 'doritos', 'lays', 'ruffles', 'acı cips', 'cips', 'misir cipsi', 'aci cips', 'baharatlı cips', 'ketçaplı cips', 'peynirli cips', 'soğanlı cips', 'cipsler', 'pringles', 'cheetos', 'fırınlanmış cips', 'çıtır cips'] },
        { label: 'Leblebi', share: 10.6, aliases: ['sarı leblebi', 'beyaz leblebi', 'çorum leblebisi', 'soslu leblebi', 'şekerli leblebi', 'çıtır leblebi', 'leblebi', 'sari leblebi', 'corum leblebisi', 'sekerli leblebi', 'citir leblebi', 'tuzlu leblebi', 'acı soslu leblebi', 'kuru leblebi', 'çikolatalı leblebi', 'leblebi tozu', 'leblebiler', 'kavrulmuş leblebi'] },
        { label: 'Kuruyemiş', share: 9.4, aliases: ['kuruyemis', 'fındık', 'antep fıstığı', 'badem', 'kaju', 'karışık çerez', 'kuruyemiş', 'findik', 'antep fistigi', 'karisik cerez', 'çerez', 'cerez', 'ceviz', 'yer fıstığı', 'fıstık', 'kabuklu fıstık', 'lüks kuruyemiş', 'kuruyemişler'] },
        { label: 'Mısır', share: 7.4, aliases: ['misir', 'patlamış mısır', 'popcorn', 'közde mısır', 'haşlanmış mısır', 'bardakta mısır', 'mısır', 'patlamis misir', 'kozde misir', 'haslanmis misir', 'bardakta misir', 'süt mısır', 'tuzlu mısır', 'soslu mısır', 'yağlı mısır', 'sinema mısırı', 'haşlama mısır', 'köz mısır'] },
        { label: 'Kestane', share: 5.8, aliases: ['kestane kebap', 'közde kestane', 'kızarmış kestane', 'bursa kestanesi', 'kış kestanesi', 'kestanesi', 'kestane', 'kozde kestane', 'kizarmis kestane', 'kis kestanesi', 'kestane çizme', 'fırında kestane', 'soba kestanesi', 'haşlanmış kestane', 'kestaneler', 'sıcak kestane', 'kestane kebapçı', 'şeker kestane'] },
        { label: 'Bisküvi', share: 4.4, aliases: ['biskuvi', 'petibör', 'çikolatalı bisküvi', 'kraker', 'çubuk kraker', 'kremalı bisküvi', 'bisküvi', 'petibor', 'cikolatali biskuvi', 'cubuk kraker', 'kremali biskuvi', 'bisküviler', 'yulaflı bisküvi', 'burçak', 'biskrem', 'negro', 'nero', 'tuzlu kraker'] },
        { label: 'Çikolata', share: 3.4, aliases: ['cikolata', 'kare çikolata', 'fıstıklı çikolata', 'bitter', 'sütlü çikolata', 'bar çikolata', 'çikolata', 'kare cikolata', 'fistikli cikolata', 'sutlu cikolata', 'beyaz çikolata', 'antep fıstıklı çikolata', 'fındıklı çikolata', 'çikolatalar', 'tablet çikolata', 'karamelli çikolata', 'bitter çikolata', 'sütlü'] },
        { label: 'Patates kızartması', share: 2.4, aliases: ['patates kizartmasi', 'parmak patates', 'kızarmış patates', 'soslu patates', 'çıtır patates', 'sıcak patates', 'patates kızartması', 'kizarmis patates', 'citir patates', 'sicak patates', 'patates', 'elma dilim patates', 'ketçaplı patates', 'mayonezli patates', 'baharatlı patates', 'cajun patates', 'kumpir', 'fırında patates'] },
        { label: 'Meyve', share: 1.8, aliases: ['elma dilimi', 'muz', 'mandalina', 'üzüm', 'çilek', 'kuru meyve', 'meyve', 'uzum', 'cilek', 'elma', 'erik', 'kiraz', 'şeftali', 'armut', 'karpuz', 'kavun', 'meyve tabağı', 'taze meyve'] },
        { label: 'Dondurma', share: 1.4, aliases: ['külah dondurma', 'maraş dondurması', 'çubuk dondurma', 'vanilyalı dondurma', 'çikolatalı dondurma', 'dondurması', 'dondurma', 'kulah dondurma', 'maras dondurmasi', 'cubuk dondurma', 'vanilyali dondurma', 'cikolatali dondurma', 'dondurmasi', 'kaşık dondurma', 'cornetto', 'magnum', 'limonlu dondurma', 'fıstıklı dondurma'] },
        { label: 'Pestil', share: 1.0, aliases: ['dut pestili', 'cevizli sucuk', 'köme', 'kayısı pestili', 'erik pestili', 'pestili', 'pestil', 'kome', 'kayisi pestili', 'nar pestili', 'dut pestili cevizli', 'muska pestil', 'gümüşhane pestili', 'fındıklı pestil', 'cevizli pestil', 'sade pestil', 'köme cevizli', 'pestiller'] },
        { label: 'Çiğ köfte dürüm', share: 0.8, aliases: ['cig kofte durum', 'çiğ köfte', 'acılı dürüm', 'nar ekşili dürüm', 'lavaş çiğ köfte', 'dürüm', 'çiğ köfte dürüm', 'cig kofte', 'acili durum', 'nar eksili durum', 'lavas cig kofte', 'durum', 'marullu çiğ köfte dürüm', 'limonlu çiğ köfte', 'etsiz çiğ köfte dürüm', 'acı soslu dürüm', 'çiğköfte dürüm', 'nar ekşili çiğ köfte'] },
        { label: 'Lokum', share: 0.6, aliases: ['güllü lokum', 'fıstıklı lokum', 'cevizli lokum', 'türk lokumu', 'kuş lokumu', 'lokumu', 'lokum', 'gullu lokum', 'fistikli lokum', 'naneli lokum', 'turk lokumu', 'kus lokumu', 'lokumlar', 'fındıklı lokum', 'narlı lokum', 'çifte kavrulmuş lokum', 'sade lokum', 'safranbolu lokumu'] },
        { label: 'Kavrulmuş nohut', share: 0.4, aliases: ['kavrulmus nohut', 'tuzlu nohut', 'acı nohut', 'çıtır nohut', 'nohut çerezi', 'kuru nohut', 'kavrulmuş nohut', 'aci nohut', 'citir nohut', 'nohut cerezi', 'nohut', 'soslu nohut', 'baharatlı nohut', 'fırınlanmış nohut', 'çıtır nohutlar', 'nohut kavurması', 'kavrulmuş nohutlar', 'kavrulmuş tuzlu nohut'] },
        { label: 'Gofret', share: 0.2, aliases: ['çikolatalı gofret', 'fındıklı gofret', 'kat kat gofret', 'vanilyalı gofret', 'kremalı gofret', 'gofreti', 'gofret', 'cikolatali gofret', 'findikli gofret', 'vanilyali gofret', 'kremali gofret', 'gofretler', 'çilekli gofret', 'bitter gofret', 'sütlü gofret', 'ülker çikolatalı gofret', 'eti gofret', 'çıtır gofret'] }
      ],
      invalid: [
        { aliases: ['simit', 'tost', 'poğaça', 'açma', 'gevrek'], reason: 'Bu kahvaltılık; soru kahvaltı dışı atıştırmalık soruyor.' },
        { aliases: ['menemen', 'omlet', 'sahanda yumurta'], reason: 'Bu kahvaltılık bir yemek, gün içi atıştırmalık değil.' },
        { aliases: ['iskender', 'kuru fasulye'], reason: 'Bu atıştırmalık değil, doyurucu ana yemek.' },
        { aliases: ['mercimek çorbası', 'tarhana'], reason: 'Çorba atıştırmalık kategorisinde sayılmaz.' },
        { aliases: ['çay', 'kahve', 'kola'], reason: 'Bu atıştırmalık yiyecek değil, içecek.' },
        { aliases: ['karnıyarık', 'mantı'], reason: 'Bu ana öğün yemeği, atıştırmalık değil.' },
        { aliases: ['sucuklu yumurta', 'bal kaymak'], reason: 'Kahvaltı dışındaki atıştırmalıklar soruluyor.' }
      ],
      tests: [
        { in: 'Çekirdek', expect: 'Çekirdek' },
        { in: 'patlamış mısır', expect: 'Mısır' },
        { in: 'cevizli sucuk', expect: 'Pestil' },
        { in: 'menemen', expect: 'invalid' }
      ]
    },
    {
      id: 'q38',
      cat: 'gelenek',
      text: 'Yılbaşında yapılan bir şey söyle',
      answers: [
        { label: 'Milli Piyango almak', share: 22.0, aliases: ['milli piyango', 'bilet almak', 'piyango bileti', 'yılbaşı bileti', 'çeyrek bilet', 'büyük ikramiye', 'milli piyango almak', 'yilbasi bileti', 'ceyrek bilet', 'buyuk ikramiye', 'yarım bilet', 'tam bilet', 'kazı kazan', 'piyango', 'milli piyango bileti', 'şans oyunu', 'yılbaşı ikramiyesi', 'bilet çekilişi'] },
        { label: 'Çam ağacı süslemek', share: 14.0, aliases: ['cam agaci suslemek', 'yılbaşı ağacı', 'ağaç süslemek', 'ışık takmak', 'kokina', 'çam ağacı', 'çam ağacı süslemek', 'yilbasi agaci', 'agac suslemek', 'isik takmak', 'cam agaci', 'yılbaşı ağacı süslemek', 'ağaç kurmak', 'süs asmak', 'çam ağacına yıldız', 'led ışık takmak', 'yapay çam ağacı', 'ağacı süslemek'] },
        { label: 'Geri sayım', share: 12.0, aliases: ['geri sayim', 'on dokuz sekiz', 'saat on ikiyi beklemek', 'yeni yıla girmek', 'geri saymak', 'on saniye kala', 'geri sayım', 'on ikiye geri sayım', 'gece yarısı', 'saat 12', 'son on saniye', 'geri sayım yapmak', 'yeni yıl geri sayımı', '10 9 8 7', 'saat tam on ikide', 'yeni yıla geri sayım', 'geri saymak yılbaşında', '00 00'] },
        { label: 'Kırmızı iç çamaşırı', share: 10.0, aliases: ['kırmızı iç çamaşırı giymek', 'kirmizi ic camasiri', 'kırmızı giymek', 'şans getirsin diye kırmızı', 'kırmızı çorap', 'kırmızı kıyafet', 'kırmızı iç çamaşırı', 'kirmizi giymek', 'sans getirsin diye kirmizi', 'kirmizi corap', 'kirmizi kiyafet', 'kırmızı don', 'kırmızı boxer', 'kırmızı çamaşır', 'kırmızı giyinmek', 'şans için kırmızı', 'kırmızı kazak', 'kırmızı elbise'] },
        { label: 'Havai fişek izlemek', share: 9.0, aliases: ['havai fisek izlemek', 'havai fişek', 'maytap', 'boğazda havai fişek', 'ışık gösterisi', 'havai fişek atmak', 'havai fişek izlemek', 'havai fisek', 'bogazda havai fisek', 'isik gosterisi', 'havai fisek atmak', 'gökyüzü gösterisi', 'fişek patlatmak', 'yılbaşı havai fişeği', 'havai fişekler', 'havai fişek gösterisi', 'boğazda fişek', 'maytap yakmak'] },
        { label: 'Aileyle toplanmak', share: 8.0, aliases: ['aileyle oturmak', 'evde toplanmak', 'arkadaşlarla kutlamak', 'parti yapmak', 'hep birlikte olmak', 'misafir çağırmak', 'aileyle toplanmak', 'arkadaslarla kutlamak', 'misafir cagirmak', 'ailece kutlamak', 'ev partisi', 'arkadaş toplantısı', 'yılbaşı gecesi toplanmak', 'kalabalık toplanmak', 'akraba toplantısı', 'sohbet etmek', 'evde kutlamak', 'yılbaşı partisi'] },
        { label: 'Nar kırmak', share: 6.0, aliases: ['nar kirmak', 'kapıda nar kırmak', 'bereket için nar', 'nar patlatmak', 'nar atmak', 'nar', 'nar kırmak', 'kapida nar kirmak', 'bereket icin nar', 'kapı önünde nar kırmak', 'evde nar kırmak', 'bolluk için nar', 'nar kırma adeti', 'nar fırlatmak', 'kapıda nar', 'yılbaşında nar', 'nar kırarız', 'bereket narı'] },
        { label: 'Hindi yemek', share: 5.0, aliases: ['hindi', 'fırında hindi', 'yılbaşı yemeği', 'kestaneli pilav', 'tavuk yemek', 'özel yemek', 'hindi yemek', 'firinda hindi', 'yilbasi yemegi', 'ic pilavli hindi', 'iç pilavlı hindi', 'kızarmış hindi', 'yılbaşı hindisi', 'hindi dolması', 'yılbaşı sofrası', 'bütün hindi', 'hindi pişirmek', 'yılbaşı akşam yemeği'] },
        { label: 'Tombala oynamak', share: 4.0, aliases: ['tombala', 'çinko', 'tombala çekmek', 'ailece tombala', 'okey oynamak', 'kutu oyunu', 'tombala oynamak', 'cinko', 'tombala cekmek', 'birinci çinko', 'ikinci çinko', 'tombala kartı', 'tombala taşı', 'torbadan taş çekmek', 'tombala oyunu', 'tombala oynarız', 'yılbaşı tombalası', 'okey tombala'] },
        { label: 'Televizyon izlemek', share: 3.0, aliases: ['o ses türkiye', 'yılbaşı özel programı', 'tv izlemek', 'ibrahim tatlıses yılbaşı', 'dansöz izlemek', 'eğlence programı', 'televizyon izlemek', 'o ses turkiye', 'yilbasi ozel programi', 'ibrahim tatlises yilbasi', 'dansoz izlemek', 'eglence programi', 'yılbaşı televizyonu', 'güldür güldür yılbaşı', 'çok güzel hareketler', 'tv yılbaşı özel', 'müzik programı izlemek', 'televizyonda yılbaşı'] },
        { label: 'Hediyeleşmek', share: 2.2, aliases: ['hediye almak', 'çekiliş yapmak', 'yılbaşı çekilişi', 'hediye vermek', 'paket açmak', 'sürpriz hediye', 'hediyeleşmek', 'cekilis yapmak', 'yilbasi cekilisi', 'paket acmak', 'surpriz hediye', 'hediyeleşme', 'hediyeler almak', 'arkadaş çekilişi', 'ofis çekilişi', 'yılbaşı hediyesi', 'hediye paketi', 'hediye değişimi'] },
        { label: 'Dilek listesi yazmak', share: 1.4, aliases: ['dilek tutmak', 'yeni yıl kararları', 'hedef yazmak', 'karar almak', 'dilek yazmak', 'plan yapmak', 'yeni yil kararlari', 'yeni yıl dilekleri', 'dilek kağıdı', 'hedefler belirlemek', 'gelecek yıl planları', 'dilek listesi', 'yeni yıldan dilek', 'karar listesi', 'yazıp saklamak', 'dilek yazıp yakmak', '12 üzüm yemek', 'üzüm yiyip dilek tutmak'] },
        { label: 'Taksim’e gitmek', share: 1.0, aliases: ['taksime gitmek', 'meydana çıkmak', 'dışarıda kutlamak', 'istiklal caddesi', 'nişantaşı', 'sokak partisi', 'taksim e gitmek', 'disarida kutlamak', 'nisantasi', 'taksim meydanına gitmek', 'taksimde yeni yıl', 'istiklal caddesi yılbaşı', 'dışarı çıkmak', 'sokakta kutlamak', 'meydanlara çıkmak', 'taksim yılbaşı', 'istiklalde yürümek', 'mekana gitmek'] },
        { label: 'Yılbaşı şarkısı söylemek', share: 0.8, aliases: ['dans etmek', 'şarkı söylemek', 'karaoke yapmak', 'eğlenmek', 'müzik açmak', 'oynamak', 'yılbaşı şarkısı', 'sarki soylemek', 'eglenmek', 'muzik acmak', 'yeni yıl şarkısı', 'müzik dinlemek', 'dans müzik', 'şarkılar söylemek', 'parti müziği', 'oyun havası', 'eğlence', 'müzik açıp oynamak'] },
        { label: 'Fotoğraf çekilmek', share: 0.6, aliases: ['yılbaşı pozu', 'ağaç önünde fotoğraf', 'hatıra fotoğrafı', 'selfie', 'video çekmek', 'hikaye paylaşmak', 'fotoğraf çekilmek', 'yilbasi pozu', 'agac onunde fotograf', 'hatira fotografi', 'video cekmek', 'hikaye paylasmak', 'fotoğraf çekmek', 'fotograf cekilmek', 'aile fotoğrafı', 'yılbaşı fotoğrafı', 'story atmak', 'selfie çekmek'] },
        { label: 'Kapıda yeni yıl kartı', share: 0.4, aliases: ['yeni yıl kartı', 'tebrik kartı', 'mesaj atmak', 'mutlu yıllar demek', 'kutlama mesajı', 'tebrik etmek', 'yeni yil karti', 'tebrik karti', 'mutlu yillar demek', 'kutlama mesaji', 'iyi seneler demek', 'mutlu yıllar mesajı', 'yeni yıl tebriği', 'yılbaşı kartpostalı', 'sevdiklerini aramak', 'kutlama kartı', 'yeni yıl mesajı', 'iyi yıllar demek'] },
        { label: 'Kuruyemiş yemek', share: 0.6, aliases: ['çerez yemek', 'mandalina yemek', 'cips yemek', 'çekirdek çitlemek', 'atıştırmak', 'meyve yemek', 'kuruyemiş yemek', 'cerez yemek', 'çerez atıştırmak', 'cekirdek citlemek', 'atistirmak', 'kuruyemiş', 'kuruyemis', 'fındık fıstık yemek', 'yılbaşı çerezi', 'meyve çerez', 'karışık kuruyemiş', 'çekirdek'] }
      ].map(function (a, i) {
        if (i === 16) a.share = 0.6;
        if (i === 14) a.share = 0.4;
        if (i === 15) a.share = 0.2;
        if (i === 13) a.share = 0.8;
        if (i === 0) a.share = 22.4;
        return a;
      }).sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['kurban kesmek', 'bayram namazı'], reason: 'Bu dini bayramlara özgü bir ibadet veya gelenek.' },
        { aliases: ['el öpmek', 'harçlık toplamak'], reason: 'Bu Ramazan ve Kurban bayramlarında yapılan bir şey.' },
        { aliases: ['oruç tutmak', 'iftar açmak'], reason: 'Ramazan ayına ait bir gelenek, yılbaşı değil.' },
        { aliases: ['denize girmek', 'güneşlenmek'], reason: 'Aralık sonu kış mevsimi olduğu için yaz aktivitesi sayılmaz.' },
        { aliases: ['karne almak', 'okula başlamak'], reason: 'Okul takvimine ait bir olay, yılbaşı değil.' },
        { aliases: ['kına yakmak', 'halay çekmek'], reason: 'Daha çok düğün geleneklerine ait bir durum.' }
      ],
      tests: [
        { in: 'Milli Piyango almak', expect: 'Milli Piyango almak' },
        { in: 'cam agaci suslemek', expect: 'Çam ağacı süslemek' },
        { in: 'çinko', expect: 'Tombala oynamak' },
        { in: 'bayram namazı', expect: 'invalid' }
      ]
    },
    {
      id: 'q39',
      cat: 'aile',
      text: 'Bir akraba hitabı söyle',
      answers: [
        { label: 'Teyze', share: 18.0, aliases: ['teyzem', 'teyzeciğim', 'anne kız kardeşi', 'teyze hanım', 'küçük teyze', 'büyük teyze', 'teyze', 'teyzecigim', 'anne kiz kardesi', 'teyze hanim', 'kucuk teyze', 'buyuk teyze', 'teyzeler', 'teyzesi', 'teyzecim', 'teyzem benim', 'ortanca teyze', 'teyzeye'] },
        { label: 'Amca', share: 16.0, aliases: ['amcam', 'amcacığım', 'baba erkek kardeşi', 'amca bey', 'küçük amca', 'büyük amca', 'amca', 'amcacigim', 'baba erkek kardesi', 'kucuk amca', 'buyuk amca', 'amcalar', 'amcasi', 'amcacim', 'amcam benim', 'ortanca amca', 'emmi', 'amcaya'] },
        { label: 'Hala', share: 12.4, aliases: ['halam', 'halacığım', 'baba kız kardeşi', 'hala hanım', 'küçük hala', 'büyük hala', 'hala', 'halacigim', 'baba kiz kardesi', 'hala hanim', 'kucuk hala', 'buyuk hala', 'halalar', 'halasi', 'halacim', 'halam benim', 'ortanca hala', 'halaya'] },
        { label: 'Dayı', share: 11.6, aliases: ['dayi', 'dayım', 'dayıcığım', 'anne erkek kardeşi', 'küçük dayı', 'büyük dayı', 'dayı', 'dayim', 'dayicigim', 'anne erkek kardesi', 'kucuk dayi', 'buyuk dayi', 'dayılar', 'dayısı', 'dayıcım', 'dayım benim', 'ortanca dayı', 'dayıya'] },
        { label: 'Yenge', share: 9.0, aliases: ['yengem', 'yengeciğim', 'dayı karısı', 'amca karısı', 'abi eşi', 'yenge hanım', 'yenge', 'yengecigim', 'dayi karisi', 'amca karisi', 'abi esi', 'yenge hanim', 'yengeler', 'yengesi', 'yengecim', 'yengem benim', 'dayı eşi', 'amca eşi'] },
        { label: 'Enişte', share: 7.4, aliases: ['eniste', 'eniştem', 'teyze kocası', 'hala kocası', 'abla eşi', 'enişte bey', 'enişte', 'enistem', 'teyze kocasi', 'hala kocasi', 'abla esi', 'eniste bey', 'enişteler', 'eniştesi', 'enişteciğim', 'eniştem benim', 'teyze eşi', 'hala eşi'] },
        { label: 'Babaanne', share: 6.8, aliases: ['babaannem', 'büyük annem', 'babamın annesi', 'baba annesi', 'büyükanne', 'babaanem', 'babaanne', 'buyukanne', 'babaanneler', 'babaannesi', 'babaanneciğim', 'babaannecim', 'babanne', 'babaannem benim', 'benim nenem', 'babaanneciğim benim', 'nene baba', 'baba annem'] },
        { label: 'Anneanne', share: 6.2, aliases: ['anneannem', 'anne annesi', 'ananne', 'anneanem', 'anneanneciğim', 'nene anne', 'anneanne', 'anneannecigim', 'anneanneler', 'anneannesi', 'anneannecim', 'annanne', 'anneannem benim', 'anne tarafı nine', 'anne tarafı nene', 'ananem', 'anneanneciğim benim', 'anne annem'] },
        { label: 'Dede', share: 4.0, aliases: ['dedem', 'dedeciğim', 'büyükbaba', 'dedecim', 'ak sakallı dede', 'dedesi', 'dede', 'dedecigim', 'buyukbaba', 'ak sakalli dede', 'dedeler', 'dedem benim', 'büyük babam', 'dedeciğim benim', 'dedeye', 'dedelerimiz', 'büyükbabam', 'dedemler'] },
        { label: 'Kuzen', share: 3.0, aliases: ['kuzenim', 'amca oğlu', 'teyze kızı', 'dayı oğlu', 'hala kızı', 'emmi oğlu', 'kuzen', 'amca oglu', 'teyze kizi', 'dayi oglu', 'hala kizi', 'emmi oglu', 'kuzenler', 'kuzeni', 'kız kuzen', 'erkek kuzen', 'teyze oğlu', 'hala oğlu'] },
        { label: 'Yeğen', share: 2.0, aliases: ['yegen', 'yeğenim', 'kardeş çocuğu', 'abi çocuğu', 'abla çocuğu', 'yeğenler', 'yeğen', 'yegenim', 'kardes cocugu', 'abi cocugu', 'abla cocugu', 'yegenler', 'yeğeni', 'yeğenlerim', 'kız yeğen', 'erkek yeğen', 'yeğenim benim', 'yeğenime'] },
        { label: 'Elti', share: 1.0, aliases: ['eltim', 'kardeş eşleri', 'görümce elti', 'eltiler', 'küçük elti', 'büyük elti', 'elti', 'kardes esleri', 'gorumce elti', 'eltisi', 'kucuk elti', 'buyuk elti', 'eltim benim', 'eltilerim', 'kardeşinin eşi', 'kocanın erkek kardeşinin eşi', 'eltiye', 'elti hanım'] },
        { label: 'Görümce', share: 0.8, aliases: ['gorumce', 'görümcem', 'kocanın kız kardeşi', 'görümceler', 'küçük görümce', 'büyük görümce', 'görümce', 'gorumcem', 'kocanin kiz kardesi', 'gorumceler', 'kucuk gorumce', 'buyuk gorumce', 'görümcesi', 'görümcem benim', 'eşin kız kardeşi görümce', 'kocanın ablası', 'görümce hanım', 'görümceye'] },
        { label: 'Bacanak', share: 0.6, aliases: ['bacanağım', 'bacanaklar', 'baldız kocası', 'eşlerin kocaları', 'bacanağı', 'canım bacanağım', 'bacanak', 'bacanagim', 'baldiz kocasi', 'eslerin kocalari', 'bacanagi', 'canim bacanagim', 'bacanaklarım', 'bacanağımla', 'eşimin kız kardeşinin kocası', 'bacanak bey', 'bacanağa', 'bacanakım'] },
        { label: 'Kayınço', share: 0.4, aliases: ['kayinco', 'kayınbirader', 'eşin erkek kardeşi', 'kayınçom', 'kayınço', 'kayinbirader', 'esin erkek kardesi', 'kayincom', 'kayınçolar', 'kayınçosu', 'eşin abisi', 'kayınbiraderim', 'kayınçom benim', 'kayınço bey', 'kayınçomuz', 'kayınçoya', 'kayınçolarım', 'eşimin kardeşi'] },
        { label: 'Baldız', share: 0.2, aliases: ['baldiz', 'baldızım', 'eşin kız kardeşi', 'baldızlar', 'küçük baldız', 'büyük baldız', 'baldız', 'baldizim', 'esin kiz kardesi', 'baldizlar', 'kucuk baldiz', 'buyuk baldiz', 'baldızı', 'baldızım benim', 'eşin ablası', 'baldız baldan tatlıdır', 'baldız hanım', 'baldıza'] },
        { label: 'Dünür', share: 0.6, aliases: ['dunur', 'dünürüm', 'gelin ailesi', 'damat ailesi', 'dünürler', 'dünür', 'dunurum', 'dunurler', 'dünürü', 'dünürüm benim', 'dünürlerim', 'dünür bey', 'dünür hanım', 'gelin tarafı', 'damat tarafı', 'dünürümüz', 'dünürlerim benim', 'dünüre'] }
      ].map(function (a, i) {
        if (i === 16) a.share = 0.6;
        if (i === 13) a.share = 0.4;
        if (i === 14) a.share = 0.2;
        if (i === 15) a.share = 0.8;
        if (i === 12) a.share = 1.0;
        if (i === 11) a.share = 1.2;
        if (i === 0) a.share = 17.6;
        return a;
      }).sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['arkadaş', 'kanka', 'dost'], reason: 'Bu kan bağı veya evlilik yoluyla kurulan bir akrabalık değil.' },
        { aliases: ['komşu', 'kapı komşusu'], reason: 'Komşu akraba değildir, yakın oturulan kişidir.' },
        { aliases: ['patron', 'müdür', 'iş arkadaşı'], reason: 'Bu iş hayatına ait bir unvan, akraba değil.' },
        { aliases: ['öğretmen', 'doktor'], reason: 'Bu bir meslek adı, akraba hitabı değil.' },
        { aliases: ['sevgili', 'flört'], reason: 'Resmi veya geleneksel bir akrabalık unvanı değil.' },
        { aliases: ['yabancı', 'turist'], reason: 'Akrabalık ilişkisi ifade etmez.' }
      ],
      tests: [
        { in: 'Teyze', expect: 'Teyze' },
        { in: 'eniste', expect: 'Enişte' },
        { in: 'kayınbirader', expect: 'Kayınço' },
        { in: 'kanka', expect: 'invalid' }
      ]
    },
    {
      id: 'q40',
      cat: 'alışveriş',
      text: 'İnternetten sipariş edilen bir şey söyle',
      answers: [
        { label: 'Kıyafet', share: 26.0, aliases: ['kiyafet', 'elbise', 'tişört', 'pantolon', 'mont', 'kazak', 'kıyafet', 'tisort', 'giysi', 'üst baş', 'kazak hırka', 'gömlek', 'ceket', 'sweatshirt', 'etek', 'bluz', 'tekstil', 'moda kıyafet'] },
        { label: 'Yemek siparişi', share: 22.0, aliases: ['yemek', 'pizza', 'hamburger', 'kebap', 'lahmacun', 'döner', 'yemek siparişi', 'yemek siparisi', 'doner', 'ev yemeği', 'fast food', 'sıcak yemek', 'yemeksepeti', 'getir yemek', 'trendyol yemek', 'pide siparişi', 'çiğ köfte siparişi', 'suşi'] },
        { label: 'Ayakkabı', share: 9.4, aliases: ['ayakkabi', 'spor ayakkabı', 'bot', 'sneaker', 'terlik', 'topuklu ayakkabı', 'ayakkabı', 'spor ayakkabi', 'topuklu ayakkabi', 'sandalet', 'çizme', 'koşu ayakkabısı', 'günlük ayakkabı', 'babet', 'ayakkabılar', 'krampon', 'loafer', 'ayakkabıcı'] },
        { label: 'Elektronik / telefon', share: 8.6, aliases: ['elektronik', 'telefon', 'kulaklık', 'bilgisayar', 'şarj aleti', 'tablet', 'kulaklik', 'sarj aleti', 'akıllı saat', 'televizyon', 'laptop', 'mouse', 'klavye', 'powerbank', 'hoparlör', 'elektronik eşya', 'cep telefonu', 'kamera'] },
        { label: 'Kitap', share: 7.0, aliases: ['roman', 'test kitabı', 'çizgi roman', 'ders kitabı', 'dergi', 'okuma kitabı', 'kitap', 'test kitabi', 'cizgi roman', 'ders kitabi', 'okuma kitabi', 'kitaplar', 'ansiklopedi', 'hikaye kitabı', 'şiir kitabı', 'kpss kitabı', 'yks kitabı', 'kültür kitabı'] },
        { label: 'Kozmetik', share: 6.2, aliases: ['makyaj malzemesi', 'parfüm', 'krem', 'şampuan', 'ruj', 'cilt bakımı', 'kozmetik', 'parfum', 'sampuan', 'cilt bakimi', 'makyaj', 'nemlendirici', 'güneş kremi', 'rimel', 'fondöten', 'saç kremi', 'deodorant', 'kişisel bakım'] },
        { label: 'Market alışverişi', share: 5.6, aliases: ['market', 'su siparişi', 'süt yumurta', 'manav', 'temizlik malzemesi', 'atıştırmalık', 'market alışverişi', 'market alisverisi', 'su siparisi', 'sut yumurta', 'online market', 'atistirmalik', 'sanal market', 'getir market', 'migros sanal market', 'sebze meyve', 'deterjan', 'gıda'] },
        { label: 'Ev eşyası', share: 4.0, aliases: ['ev esyasi', 'nevresim', 'kupa bardak', 'lamba', 'halı', 'mutfak eşyası', 'ev eşyası', 'mutfak esyasi', 'bardak', 'tabak', 'tencere', 'tava', 'yastık', 'battaniye', 'mobilya', 'dekorasyon', 'perde', 'küçük ev aleti'] },
        { label: 'Aksesuar / takı', share: 3.0, aliases: ['çanta', 'saat', 'güneş gözlüğü', 'kolye', 'telefon kılıfı', 'cüzdan', 'canta', 'gunes gozlugu', 'telefon kilifi', 'cuzdan', 'takı', 'taki', 'küpe', 'bileklik', 'yüzük', 'kemer', 'şapka', 'aksesuar'] },
        { label: 'Kırtasiye', share: 2.2, aliases: ['defter', 'kalem', 'ajanda', 'boya', 'çanta okul', 'dosya', 'kırtasiye', 'kirtasiye', 'okul çantası', 'kalemlik', 'silgi', 'boya kalemi', 'fotokopi kağıdı', 'post it', 'planlayıcı', 'okul malzemesi', 'ofis malzemesi', 'kalem seti'] },
        { label: 'Spor malzemesi', share: 1.6, aliases: ['dambıl', 'yoga matı', 'forma', 'futbol topu', 'spor çantası', 'protein tozu', 'spor malzemesi', 'dambil', 'yoga mati', 'spor cantasi', 'pilates bandı', 'koşu bandı', 'atlama ipi', 'spor aleti', 'dumbell', 'eldiven spor', 'matara', 'fitness malzemesi'] },
        { label: 'Kedi maması', share: 1.0, aliases: ['kedi mamasi', 'köpek maması', 'kedi kumu', 'evcil hayvan maması', 'mama', 'yaş mama', 'kedi maması', 'kopek mamasi', 'evcil hayvan mamasi', 'yas mama', 'kuru mama', 'köpek kumu', 'kedi ödül maması', 'petshop', 'kedi oyuncağı', 'tırmalama tahtası', 'kuş yemi', 'hayvan maması'] },
        { label: 'Oyuncak', share: 0.8, aliases: ['lego', 'peluş ayı', 'kutu oyunu', 'bebek oyuncağı', 'oyun hamuru', 'kumandalı araba', 'oyuncak', 'pelus ayi', 'bebek oyuncagi', 'kumandali araba', 'oyuncaklar', 'barbie', 'puzzle', 'yapboz', 'akülü araba', 'oyuncak araba', 'figür', 'çocuk oyuncağı'] },
        { label: 'Bilet', share: 0.6, aliases: ['uçak bileti', 'konser bileti', 'sinema bileti', 'otobüs bileti', 'tiyatro bileti', 'maç bileti', 'bilet', 'ucak bileti', 'otobus bileti', 'mac bileti', 'etkinlik bileti', 'müze bileti', 'tren bileti', 'feribot bileti', 'festival bileti', 'stand up bileti', 'biletler', 'online bilet'] },
        { label: 'Çiçek', share: 0.4, aliases: ['cicek', 'buket', 'orkide', 'gül buketi', 'saksı çiçeği', 'çelenk', 'çiçek', 'gul buketi', 'saksi cicegi', 'celenk', 'çiçek sepeti', 'cicek sepeti', 'papatya buketi', 'teraryum', 'canlı çiçek', 'hediye çiçek', 'sukulent', 'kaktüs'] },
        { label: 'Yedek parça', share: 0.2, aliases: ['yedek parca', 'araba parçası', 'süpürge filtresi', 'batarya', 'ekran koruyucu', 'kablo ucu', 'yedek parça', 'araba parcasi', 'supurge filtresi', 'oto yedek parça', 'telefon bataryası', 'kablo', 'kumanda', 'ampul', 'filtre', 'aksesuar parça', 'tamir parçası', 'yedek parçalar'] },
        { label: 'Kahve / çay', share: 1.4, aliases: ['çekirdek kahve', 'filtre kahve', 'bitki çayı', 'kapsül kahve', 'çay paketi', 'toz kahve', 'cekirdek kahve', 'bitki cayi', 'kapsul kahve', 'cay paketi', 'türk kahvesi', 'turk kahvesi', 'granül kahve', 'nescafe', 'siyah çay', 'yeşil çay', 'matcha', 'kahve çekirdeği'] }
      ].sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['boğaz havası', 'güneş ışığı'], reason: 'Fiziksel olarak paketlenip kargolanabilecek bir şey değil.' },
        { aliases: ['mutluluk', 'huzur', 'sevgi'], reason: 'Soyut duygular internetten sipariş edilemez.' },
        { aliases: ['sağlık', 'zaman', 'gençlik'], reason: 'Para veya siparişle satın alınabilen bir ürün değil.' },
        { aliases: ['apartman', 'köprü'], reason: 'Büyük yapılar internet kargosuyla eve teslim edilmez.' },
        { aliases: ['uyku', 'rüya'], reason: 'Sipariş edilebilen bir eşya veya hizmet değil.' },
        { aliases: ['yağmur', 'rüzgar'], reason: 'Doğa olayları kargo ile sipariş verilmez.' }
      ],
      tests: [
        { in: 'Kıyafet', expect: 'Kıyafet' },
        { in: 'ayakkabi', expect: 'Ayakkabı' },
        { in: 'kedi kumu', expect: 'Kedi maması' },
        { in: 'mutluluk', expect: 'invalid' }
      ]
    },
    {
      id: 'q41',
      cat: 'tarih',
      text: 'Ünlü bir Türk tarihi kişiliği söyle',
      answers: [
        { label: 'Atatürk', share: 48.0, aliases: ['mustafa kemal atatürk', 'mustafa kemal', 'gazi mustafa kemal', 'atam', 'kemal atatürk', 'paşa atatürk', 'atatürk', 'ataturk', 'mustafa kemal ataturk', 'kemal ataturk', 'pasa ataturk', 'ulu önder', 'cumhuriyetin kurucusu', 'mustafa kemal paşa', 'başkomutan atatürk', 'mareşal atatürk', 'atamız', 'gazi paşa'] },
        { label: 'Fatih Sultan Mehmet', share: 14.0, aliases: ['fatih', 'ikinci mehmet', 'fatih sultan mehmed', 'istanbul fatihi', 'sultan mehmet', 'fatih han', 'fatih sultan mehmet', 'fatih sultan mehmed han', '2 mehmet', 'ii mehmet', 'fatih padişah', 'istanbulu fetheden padişah', 'fatih mehmet', 'sultan mehmed', 'hünkar fatih', 'fatih hanı', 'osmanlı padişahı fatih', 'fsm'] },
        { label: 'Kanuni Sultan Süleyman', share: 9.0, aliases: ['kanuni', 'sultan süleyman', 'muhteşem süleyman', 'birinci süleyman', 'kanuni süleyman', 'süleyman han', 'kanuni sultan süleyman', 'kanuni sultan suleyman', 'sultan suleyman', 'muhtesem suleyman', 'birinci suleyman', 'kanuni suleyman', 'suleyman han', '1 süleyman', 'i süleyman', 'muhteşem', 'kanuni padişah', 'sultan süleyman han'] },
        { label: 'Mimar Sinan', share: 6.0, aliases: ['koca sinan', 'mimar sinan eserleri', 'büyük mimar', 'süleymaniye mimarı', 'selimiye mimarı', 'mimar başı', 'mimar sinan', 'buyuk mimar', 'suleymaniye mimari', 'selimiye mimari', 'mimar basi', 'mimarbaşı sinan', 'koca mimar sinan', 'osmanlı mimarı', 'sinan ağa', 'ünlü mimar', 'selimiye ustası', 'mimar sinanımız'] },
        { label: 'Yavuz Sultan Selim', share: 4.0, aliases: ['yavuz', 'birinci selim', 'sultan selim', 'yavuz selim', 'yavuz han', 'selim han', 'yavuz sultan selim', '1 selim', 'i selim', 'yavuz sultan selim han', 'yavuz padişah', 'mısır fatihi', 'halife yavuz', 'sultan selim han', 'osmanlı sultanı selim', 'yavuz hanı', 'selim yavuz', 'birinci selim han'] },
        { label: 'Osman Gazi', share: 3.2, aliases: ['osman bey', 'osmanlı kurucusu', 'ertugrul oğlu osman', 'sultan osman', 'osman gazi han', 'birinci osman', 'osman gazi', 'osmanli kurucusu', 'ertugrul oglu osman', 'osman bey gazi', '1 osman', 'i osman', 'osmanlı devletinin kurucusu', 'osmanlıyı kuran', 'ertuğrul gazi oğlu', 'osmanlı beyi', 'gazi osman', 'osman han'] },
        { label: 'Alparslan', share: 2.8, aliases: ['sultan alparslan', 'malazgirt komutanı', 'büyük selçuklu sultanı', 'alp arslan', 'alparslan han', 'sultan alp arslan', 'alparslan', 'malazgirt komutani', 'buyuk selcuklu sultani', 'muhammed alparslan', 'malazgirt kahramanı', 'selçuklu sultanı alparslan', '1071 alparslan', 'sultan alparslan han', 'büyük selçuklu hükümdarı', 'anadolunun kapısını açan', 'alp arslan han', 'alparslan bey'] },
        { label: 'Barbaros Hayreddin', share: 2.4, aliases: ['barbaros hayrettin paşa', 'barbaros', 'kaptan paşa', 'hızır reis', 'preveze kahramanı', 'hayreddin paşa', 'barbaros hayreddin', 'barbaros hayrettin pasa', 'hizir reis', 'preveze kahramani', 'hayreddin pasa', 'barbaros hayrettin', 'kaptan-ı derya barbaros', 'denizci barbaros', 'osmanlı amirali barbaros', 'kızıl sakal', 'hayrettin paşa', 'barbaros paşa'] },
        { label: 'İsmet İnönü', share: 2.0, aliases: ['ismet inonu', 'inönü', 'ismet paşa', 'milli şef', 'lozan kahramanı', 'ikinci cumhurbaşkanı', 'ismet pasa', 'milli sef', 'lozan kahramani', 'ikinci cumhurbaskani', 'ismet inönü', 'inonu', 'paşa inönü', 'garp cephesi komutanı', 'lozan başdelegesi', 'cumhurbaşkanı inönü', 'inönü paşa', 'ismet bey'] },
        { label: 'Yunus Emre', share: 1.6, aliases: ['derviş yunus', 'aşık yunus emre', 'aşık yunus', 'halk şairi yunus', 'taptuk emre talebesi', 'emre yunus', 'yunus emre', 'dervis yunus', 'asik yunus', 'halk sairi yunus', 'yunus emre şiirleri', 'tasavvuf şairi yunus', 'şair yunus emre', 'anadolu ereni yunus', 'bizim yunus', 'yunus emremiz', 'ozan yunus', 'türkçe şairi yunus'] },
        { label: 'Mevlana', share: 1.2, aliases: ['mevlana celaleddin rumi', 'rumi', 'hazreti mevlana', 'konya mevlana', 'mesnevi yazarı', 'celaleddin rumi', 'mevlana', 'mevlana celaleddin', 'mevlana rumi', 'konya sultanı', 'şems arkadaşı mevlana', 'tasavvuf alimi mevlana', 'gel ne olursan ol', 'mevlana hazretleri', 'büyük mutasavvıf', 'mesnevi şairi', 'celaleddin-i rumi', 'mesnevi yazari'] },
        { label: 'Piri Reis', share: 0.9, aliases: ['dünya haritası', 'kitab-ı bahriye', 'denizci piri reis', 'amiral piri', 'haritacı piri', 'reis piri', 'piri reis', 'dunya haritasi', 'kitab i bahriye', 'haritaci piri', 'osmanlı denizcisi piri reis', 'harita çizen piri reis', 'amiral piri reis', 'ahmet muhiddin piri', 'ünlü denizci piri', 'piri reis haritası', 'kaptan piri reis', 'piri reis haritasi'] },
        { label: 'Nene Hatun', share: 0.7, aliases: ['erzurumlu nene hatun', 'aziziye kahramanı', 'doksanüç harbi', 'kahraman kadın', 'nene hatunumuz', 'hatun nene', 'nene hatun', 'aziziye kahramani', 'doksanuc harbi', 'kahraman kadin', 'erzurum kahramanı', '93 harbi kahramanı', 'aziziye tabyası', 'türk kadını kahramanı', 'erzurumlu kahraman', 'nene hatunu', 'kurtuluş kahramanı nene hatun', 'aziziye savunması'] },
        { label: 'Evliya Çelebi', share: 0.5, aliases: ['evliya celebi', 'seyahatname', 'seyyah', 'gezgin evliya', 'çelebi evliya', 'ünlü seyyah', 'evliya çelebi', 'unlu seyyah', 'osmanlı gezgini', 'seyahatname yazarı', 'seyyah evliya çelebi', 'büyük gezgin', 'evliya', 'seyahatnameyi yazan', 'türk seyyahı', 'gezgin evliya çelebi', 'evliya çelebi gezgini', 'celebi evliya'] },
        { label: 'Hezarfen Ahmed Çelebi', share: 0.3, aliases: ['hezarfen', 'ahmet çelebi', 'galatadan uçan', 'kanatlı çelebi', 'uçan adam', 'çelebi hezarfen', 'hezarfen ahmed celebi', 'hezarfen ahmet çelebi', 'ahmet celebi', 'galatadan ucan', 'kanatli celebi', 'ucan adam', 'celebi hezarfen', 'galata kulesinden uçan', 'üsküdara uçan', 'ilk uçan türk', 'kanat takıp uçan', 'hezarfen çelebi'] },
        { label: 'Kâtip Çelebi', share: 1.4, aliases: ['katip celebi', 'cihannüma', 'hacı halife', 'osmanlı bilgini', 'coğrafyacı katip', 'çelebi katip', 'kâtip çelebi', 'katip çelebi', 'cihannuma', 'haci halife', 'osmanli bilgini', 'cografyaci katip', 'celebi katip', 'mustafa bin abdullah', 'keşfüz zünun', 'osmanlı tarihçisi katip çelebi', 'bilim insanı katip çelebi', 'katip çelebi eserleri'] },
        { label: 'Mete Han', share: 1.0, aliases: ['metehan', 'mete han kağan', 'hun kağanı', 'asya hun hükümdarı', 'büyük hun kağanı', 'kağan mete', 'mete han', 'hun kagani', 'asya hun hukumdari', 'buyuk hun kagani', 'kagan mete', 'türk tarihinin ilk ordusu', 'onluk sistem kurucusu', 'oğuz kağan', 'hun imparatoru mete', 'asya hun devleti', 'metehan kağan', 'büyük hun imparatoru'] },
        { label: 'Halide Edib Adıvar', share: 1.0, aliases: ['halide edip', 'ateşten gömlek', 'sultanahmet mitingi', 'onbaşı halide', 'yazar halide', 'adıvar', 'halide edib adıvar', 'halide edib adivar', 'atesten gomlek', 'onbasi halide', 'adivar', 'halide onbaşı', 'halide edip adıvar', 'halide edip adivar', 'kurtuluş savaşı yazarı', 'sinekli bakkal yazarı', 'kadın yazar halide', 'halide edib'] }
      ].map(function (a, i) {
        if (i === 17) a.share = 1.1;
        if (i === 16) a.share = 1.3;
        if (i === 15) a.share = 1.5;
        if (i === 10) a.share = 1.7;
        if (i === 9) a.share = 1.9;
        if (i === 8) a.share = 2.1;
        if (i === 7) a.share = 2.4;
        if (i === 6) a.share = 2.8;
        if (i === 5) a.share = 3.2;
        if (i === 0) a.share = 45.6;
        return a;
      }).sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['napolyon', 'jül sezar'], reason: 'Bu yabancı tarihe ait bir lider, Türk tarihi kişiliği değil.' },
        { aliases: ['einstein', 'newton'], reason: 'Bu yabancı bir bilim insanı.' },
        { aliases: ['keloğlan', 'nasreddin hoca'], reason: 'Halk kahramanı veya masal figürü; resmi tarihi kişilik değil.' },
        { aliases: ['polat alemdar', 'süleyman çakır'], reason: 'Bu kurgusal bir dizi karakteri, tarihi şahsiyet değil.' },
        { aliases: ['tarkan', 'hadise'], reason: 'Günümüz sanatçısı; tarihi kişilik değil.' },
        { aliases: ['büyük iskender', 'cengiz han'], reason: 'Türk tarihi dışındaki ünlü komutan veya hükümdar.' }
      ],
      tests: [
        { in: 'Atatürk', expect: 'Atatürk' },
        { in: 'fatih', expect: 'Fatih Sultan Mehmet' },
        { in: 'seyahatname', expect: 'Evliya Çelebi' },
        { in: 'napolyon', expect: 'invalid' }
      ]
    },
    {
      id: 'q42',
      cat: 'komşuluk',
      text: 'Komşudan istenen bir şey söyle',
      answers: [
        { label: 'Tuz', share: 22.0, aliases: ['bir tutam tuz', 'bir kaşık tuz', 'tuzluk', 'sofra tuzu', 'tuzu', 'azıcık tuz', 'tuz', 'bir kasik tuz', 'azicik tuz', 'kaya tuzu', 'iyotlu tuz', 'tuzunuz var mı', 'biraz tuz', 'yemeklik tuz', 'tuz kavanozu', 'tuzum bitti', 'tuz rica etsem', 'tuzunuz'] },
        { label: 'Şeker', share: 20.0, aliases: ['seker', 'toz şeker', 'küp şeker', 'bir bardak şeker', 'kesme şeker', 'şekeri', 'şeker', 'toz seker', 'kup seker', 'bir bardak seker', 'kesme seker', 'sekeri', 'çay şekeri', 'bir kase şeker', 'şekeriniz var mı', 'şekerim bitti', 'pudra şekeri', 'azıcık şeker'] },
        { label: 'Yumurta', share: 12.0, aliases: ['bir yumurta', 'iki yumurta', 'kek için yumurta', 'köy yumurtası', 'yumurtayı', 'yumurtası', 'yumurta', 'koy yumurtasi', 'yumurtayi', 'yumurtasi', 'birkaç yumurta', '3 yumurta', 'kahvaltılık yumurta', 'yumurtanız var mı', 'yumurtam kalmamış', 'taze yumurta', 'organik yumurta', 'bir tane yumurta'] },
        { label: 'Soğan', share: 9.0, aliases: ['sogan', 'bir soğan', 'kuru soğan', 'iki tane soğan', 'soğanı', 'yemeklik soğan', 'soğan', 'bir sogan', 'kuru sogan', 'iki tane sogan', 'sogani', 'yemeklik sogan', 'soğanınız var mı', 'soğanım bitmiş', 'kırmızı soğan', 'taze soğan', 'küçük soğan', 'büyük soğan'] },
        { label: 'Un', share: 8.0, aliases: ['bir bardak un', 'buğday unu', 'kek unu', 'börek unu', 'unu', 'bir kase un', 'un var mı', 'bugday unu', 'borek unu', 'bir su bardağı un', 'ununuz var mı', 'unum bitti', 'mısır unu', 'tam buğday unu', 'ekmek unu', 'biraz un', 'kek için un', 'yarım kilo un'] },
        { label: 'Ekmek', share: 6.0, aliases: ['bir ekmek', 'yarım ekmek', 'taze ekmek', 'ekmeği', 'somun ekmek', 'ekmek var mı', 'ekmek', 'yarim ekmek', 'ekmegi', 'ekmek var mi', 'ekmeğiniz var mı', 'fazla ekmek', 'bayat ekmek', 'francala', 'köy ekmeği', 'iki dilim ekmek', 'ekmeğim kalmamış', 'ekmek alabilir miyim'] },
        { label: 'Çay', share: 5.0, aliases: ['cay', 'kuru çay', 'demlik çay', 'bir bardak çay', 'siyah çay', 'çayınız var mı', 'çay', 'kuru cay', 'demlik cay', 'bir bardak cay', 'siyah cay', 'cayiniz var mi', 'çayım bitmiş', 'bir demlik çay', 'sallama çay', 'poşet çay', 'rize çayı', 'kaçak çay'] },
        { label: 'Matkap / tornavida', share: 3.4, aliases: ['matkap', 'tornavida', 'çekiç', 'pense', 'alet çantası', 'ingiliz anahtarı', 'matkap tornavida', 'cekic', 'alet cantasi', 'ingiliz anahtari', 'yıldız tornavida', 'düz tornavida', 'darbeli matkap', 'şarjlı matkap', 'tamir aleti', 'vida', 'dübel', 'kargaburun'] },
        { label: 'Yoğurt', share: 2.8, aliases: ['yogurt', 'bir kaşık yoğurt', 'maya', 'yoğurt mayası', 'ev yoğurdu', 'kase yoğurt', 'yoğurt', 'bir kasik yogurt', 'yogurt mayasi', 'ev yogurdu', 'kase yogurt', 'bir kase yoğurt', 'yoğurdunuz var mı', 'yoğurt mayalamak için', 'süzme yoğurt', 'yoğurdum bitmiş', 'mayalık yoğurt', 'taze yoğurt'] },
        { label: 'Süt', share: 2.4, aliases: ['sut', 'bir bardak süt', 'kutu süt', 'tatlı için süt', 'sütü', 'yarım litre süt', 'süt', 'bir bardak sut', 'kutu sut', 'tatli icin sut', 'sutu', 'yarim litre sut', 'sütünüz var mı', 'sütüm kalmamış', 'günlük süt', 'pastörize süt', 'çocuk için süt', 'bir fincan süt'] },
        { label: 'Sıvı yağ', share: 2.0, aliases: ['sivi yag', 'ayçiçek yağı', 'zeytinyağı', 'yağ', 'bir fincan yağ', 'sıvı yağ', 'aycicek yagi', 'zeytinyagi', 'yag', 'bir fincan yag', 'ayçiçek', 'yağınız var mı', 'yağım bitmiş', 'mısırözü yağı', 'kızartma yağı', 'bir çay bardağı yağ', 'mısır yağı', 'kanola yağı'] },
        { label: 'Salça', share: 1.6, aliases: ['salca', 'domates salçası', 'biber salçası', 'bir kaşık salça', 'yemeklik salça', 'salçası', 'salça', 'domates salcasi', 'biber salcasi', 'bir kasik salca', 'yemeklik salca', 'salcasi', 'salçanız var mı', 'salçam bitmiş', 'köy salçası', 'acı salça', 'tatlı salça', 'bir yemek kaşığı salça'] },
        { label: 'Kahve', share: 1.2, aliases: ['türk kahvesi', 'bir fincan kahve', 'nescafe', 'kahvesi', 'fal kahvesi', 'kahveniz var mı', 'kahve', 'turk kahvesi', 'neskafe', 'kahveniz var mi', 'bir paket kahve', 'kahvem bitmiş', 'iki kaşık kahve', 'filtre kahve', 'granül kahve', 'dibek kahvesi', 'menengiç kahvesi', 'bir kaşık kahve'] },
        { label: 'Maydanoz', share: 0.9, aliases: ['bir tutam maydanoz', 'dereotu', 'nane', 'yeşillik', 'roka', 'maydanozu', 'maydanoz', 'yesillik', 'bir demet maydanoz', 'maydanozunuz var mı', 'taze nane', 'yeşil soğan', 'kıvırcık', 'marul', 'teresi', 'maydanozum kalmamış', 'birkaç dal maydanoz', 'salata yeşilliği'] },
        { label: 'Limon', share: 0.7, aliases: ['bir limon', 'yarım limon', 'çorba için limon', 'limon suyu', 'limonu', 'taze limon', 'limon', 'yarim limon', 'corba icin limon', 'limonunuz var mı', 'limonum bitmiş', 'iki tane limon', 'taze sıkılmış limon', 'sulu limon', 'limon tuzu', 'yeşil limon', 'bir dilim limon', 'limon var mı'] },
        { label: 'Tüp / çakmak', share: 0.5, aliases: ['çakmak', 'kibrit', 'piknik tüpü', 'mum', 'fener', 'el feneri', 'cakmak', 'piknik tupu', 'tüp', 'tup', 'çakmağınız var mı', 'ocağı yakmak için çakmak', 'elektrik kesilince mum', 'ışıldak', 'şarjlı lamba', 'kibritiniz var mı', 'tüp bitti', 'bir çakmak'] },
        { label: 'Merdiven', share: 0.3, aliases: ['katlanır merdiven', 'basamak', 'tabure', 'ampul takmak için merdiven', 'yüksek merdiven', 'merdiveni', 'merdiven', 'katlanir merdiven', 'yuksek merdiven', 'ev merdiveni', 'üç basamaklı merdiven', 'alüminyum merdiven', 'perde takmak için merdiven', 'merdiveniniz var mı', 'basamaklı tabure', 'küçük merdiven', 'boya merdiveni', 'uzun merdiven'] },
        { label: 'Wi-Fi şifresi', share: 0.1, aliases: ['wifi', 'internet şifresi', 'modem şifresi', 'kablosuz ağ', 'şifreniz ne', 'internetiniz', 'wi fi sifresi', 'wifi sifresi', 'internet sifresi', 'modem sifresi', 'kablosuz ag', 'sifreniz ne', 'wi-fi', 'kablosuz internet', 'modem şifreniz', 'internet şifreniz ne', 'wifi var mı', 'internete bağlanabilir miyim'] },
        { label: 'Kabartma tozu', share: 2.1, aliases: ['vanilya', 'karbonat', 'hamur kabartma tozu', 'maya kuru', 'instant maya', 'nişasta', 'kabartma tozu', 'nisasta', 'kabartma tozu var mı', 'şekerli vanilin', 'vanilin', 'yaş maya', 'hamur mayası', 'kek kabartma tozu', 'bir paket kabartma tozu', 'mısır nişastası', 'buğday nişastası', 'kuru maya'] }
      ].map(function (a, i) {
        if (i === 18) a.share = 1.4;
        if (i === 12) a.share = 1.1;
        if (i === 0) a.share = 22.8;
        return a;
      }).sort(function (a, b) { return b.share - a.share; }),
      invalid: [
        { aliases: ['araba', 'otomobil'], reason: 'Araba komşudan günlük ödünç istenen basit bir eşya değil.' },
        { aliases: ['kredi kartı', 'maaş'], reason: 'Kişisel finansal şeyler komşudan istenmez.' },
        { aliases: ['buzdolabı', 'çamaşır makinesi'], reason: 'Büyük beyaz eşya komşudan ödünç alınmaz.' },
        { aliases: ['televizyon', 'yatak'], reason: 'Temel ev mobilyası komşudan istenen şeylerden değil.' },
        { aliases: ['pasaport', 'kimlik'], reason: 'Resmi kimlik belgeleri başkalarından istenmez.' },
        { aliases: ['ev tapusu', 'anahtar değil'], reason: 'Mülkiyet belgeleri komşudan istenen şeylerden değil.' }
      ],
      tests: [
        { in: 'Tuz', expect: 'Tuz' },
        { in: 'seker', expect: 'Şeker' },
        { in: 'tornavida', expect: 'Matkap / tornavida' },
        { in: 'pasaport', expect: 'invalid' }
      ]
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
