/**
 * MARTI — Türkçe Normalizasyon ve Toleranslı Eşleştirme Motoru (matcher.js)
 *
 * Sıra:
 * 1. normalizeTR: tr-TR küçük harf + \u0307 temizliği + noktalama → boşluk + trim
 * 2. toAsciiKey: Türkçe aksanlı harfleri ASCII karşılığına indirger
 * 3. Ek temizleme: Tam eşleşme olmazsa sondaki çoğul/hal eklerini soyar
 * 4. Levenshtein: Aksansız anahtar uzunluğuna göre tolerans (<=4: 0, 5-8: 1, 9+: 2)
 * 5. Öncelik: Geçerli gruplar (answers) → Geçersiz gruplar (invalid) → none
 */
(function (root) {
  'use strict';

  var TR_CHAR_MAP = {
    'ç': 'c',
    'ğ': 'g',
    'ı': 'i',
    'ö': 'o',
    'ş': 's',
    'ü': 'u',
    'â': 'a',
    'î': 'i',
    'û': 'u'
  };

  // Uzundan kısaya sıralı Türkçe ve aksansız son ekler
  var SUFFIXES = [
    'lar', 'ler',
    'yı', 'yi', 'yu', 'yü',
    'sı', 'si', 'su', 'sü',
    'ı', 'i', 'u', 'ü'
  ];

  /**
   * Türkçe kurallarına göre küçük harfe çevirir, birleşik nokta (\u0307) kalıntısını
   * temizler, noktalama işaretlerini boşluğa dönüştürür ve tek boşluğa indirger.
   */
  function normalizeTR(input) {
    if (input === null || input === undefined) {
      return '';
    }
    return String(input)
      .toLocaleLowerCase('tr-TR')
      .replace(/\u0307/g, '')
      .replace(/[.,!?;:'"()\[\]{}\-_/\\&+*=<>~`|@#%^$]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Normalize edilmiş dizgedeki Türkçe karakterleri aksansız ASCII'ye çevirir.
   */
  function toAsciiKey(normalizedStr) {
    return String(normalizedStr).replace(/[çğıöşüâîû]/g, function (ch) {
      return TR_CHAR_MAP[ch] || ch;
    });
  }

  /**
   * Tek bir kelimenin sonundan eşleşen tüm olası ekleri soyarak aday listesi döner.
   * Kök uzunluğu en az 2 karakter kalmalıdır.
   */
  function stripTurkishSuffixesAll(word) {
    var out = [];
    if (!word || word.length < 3) {
      return out;
    }
    for (var i = 0; i < SUFFIXES.length; i++) {
      var sfx = SUFFIXES[i];
      if (word.length - sfx.length >= 2 && word.slice(-sfx.length) === sfx) {
        var stem = word.slice(0, -sfx.length);
        if (out.indexOf(stem) === -1) {
          out.push(stem);
        }
      }
    }
    return out;
  }

  function stripTurkishSuffix(word) {
    var all = stripTurkishSuffixesAll(word);
    return all.length > 0 ? all[0] : word;
  }

  /**
   * Verilen normalize dizge için tam hali ve ekleri soyulmuş adayları üretir.
   */
  function getStemVariants(normalizedStr) {
    var variants = [];
    if (!normalizedStr) {
      return variants;
    }

    function pushUnique(v) {
      if (v && variants.indexOf(v) === -1) {
        variants.push(v);
      }
    }

    pushUnique(normalizedStr);

    var wholeStems = stripTurkishSuffixesAll(normalizedStr);
    for (var i = 0; i < wholeStems.length; i++) {
      pushUnique(wholeStems[i]);
    }

    var words = normalizedStr.split(' ');
    if (words.length > 1) {
      var strippedWords = words.map(stripTurkishSuffix).join(' ');
      pushUnique(strippedWords);

      var lastStems = stripTurkishSuffixesAll(words[words.length - 1]);
      var prefix = words.slice(0, -1).join(' ');
      for (var j = 0; j < lastStems.length; j++) {
        pushUnique(prefix + ' ' + lastStems[j]);
      }
    }

    return variants;
  }

  /**
   * İki dizge arasındaki Levenshtein düzenleme mesafesini hesaplar.
   */
  function levenshtein(a, b) {
    if (a === b) return 0;
    var la = a.length;
    var lb = b.length;
    if (la === 0) return lb;
    if (lb === 0) return la;

    var prev = new Array(lb + 1);
    var curr = new Array(lb + 1);

    for (var j = 0; j <= lb; j++) {
      prev[j] = j;
    }

    for (var i = 1; i <= la; i++) {
      curr[0] = i;
      var ca = a.charAt(i - 1);
      for (var j2 = 1; j2 <= lb; j2++) {
        var cost = ca === b.charAt(j2 - 1) ? 0 : 1;
        var del = prev[j2] + 1;
        var ins = curr[j2 - 1] + 1;
        var sub = prev[j2 - 1] + cost;
        curr[j2] = del < ins ? (del < sub ? del : sub) : (ins < sub ? ins : sub);
      }
      var tmp = prev;
      prev = curr;
      curr = tmp;
    }

    return prev[lb];
  }

  /**
   * Aksansız anahtar uzunluğuna göre maksimum Levenshtein toleransını döner.
   */
  function getMaxDistance(keyLength) {
    if (keyLength <= 4) return 0;
    if (keyLength <= 8) return 1;
    return 2;
  }

  /**
   * Bir aday kümesinin normalize ve ek-soyulmuş anahtarlarını hazırlar.
   */
  function buildKeySet(phrases) {
    var exactTR = [];
    var exactAscii = [];
    var stemTR = [];
    var stemAscii = [];

    for (var i = 0; i < phrases.length; i++) {
      var norm = normalizeTR(phrases[i]);
      if (!norm) continue;
      var asc = toAsciiKey(norm);

      if (exactTR.indexOf(norm) === -1) exactTR.push(norm);
      if (exactAscii.indexOf(asc) === -1) exactAscii.push(asc);

      var stems = getStemVariants(norm);
      for (var j = 0; j < stems.length; j++) {
        var sTR = stems[j];
        var sAsc = toAsciiKey(sTR);
        if (stemTR.indexOf(sTR) === -1) stemTR.push(sTR);
        if (stemAscii.indexOf(sAsc) === -1) stemAscii.push(sAsc);
      }

      // ASCII anahtar üzerinden de ek soyma (ör. "cayi" -> "cay")
      var ascStems = getStemVariants(asc);
      for (var k = 0; k < ascStems.length; k++) {
        if (stemAscii.indexOf(ascStems[k]) === -1) stemAscii.push(ascStems[k]);
      }
    }

    return {
      exactTR: exactTR,
      exactAscii: exactAscii,
      stemTR: stemTR,
      stemAscii: stemAscii
    };
  }

  function hasOverlap(listA, listB) {
    for (var i = 0; i < listA.length; i++) {
      if (listB.indexOf(listA[i]) !== -1) {
        return true;
      }
    }
    return false;
  }

  /**
   * Bir liste (answers veya invalid) içinde sırasıyla tam, ek-temizlenmiş ve
   * Levenshtein eşleşmesi arar.
   */
  function findBestMatchInPool(inputKeys, items, getPhrasesFn) {
    var pools = items.map(function (item, idx) {
      return {
        idx: idx,
        item: item,
        keys: buildKeySet(getPhrasesFn(item))
      };
    });

    // 1. Tam eşleşme (normalize TR veya aksansız ASCII)
    for (var i = 0; i < pools.length; i++) {
      var k = pools[i].keys;
      if (hasOverlap(inputKeys.exactTR, k.exactTR) || hasOverlap(inputKeys.exactAscii, k.exactAscii)) {
        return pools[i];
      }
    }

    // 2. Ek temizleme sonrası eşleşme
    for (var i2 = 0; i2 < pools.length; i2++) {
      var k2 = pools[i2].keys;
      if (hasOverlap(inputKeys.stemTR, k2.stemTR) || hasOverlap(inputKeys.stemAscii, k2.stemAscii)) {
        return pools[i2];
      }
    }

    // 3. Levenshtein toleranslı eşleşme (aksansız anahtarlar üzerinde)
    var bestPool = null;
    var bestDist = Infinity;

    for (var i3 = 0; i3 < pools.length; i3++) {
      var targetKeys = pools[i3].keys.stemAscii;
      for (var a = 0; a < inputKeys.stemAscii.length; a++) {
        var inStr = inputKeys.stemAscii[a];
        var inMax = getMaxDistance(inStr.length);
        for (var b = 0; b < targetKeys.length; b++) {
          var tStr = targetKeys[b];
          var maxAllowed = Math.min(inMax, getMaxDistance(tStr.length));
          if (maxAllowed === 0) continue;
          if (Math.abs(inStr.length - tStr.length) > maxAllowed) continue;

          var d = levenshtein(inStr, tStr);
          if (d <= maxAllowed && d < bestDist) {
            bestDist = d;
            bestPool = pools[i3];
          }
        }
      }
    }

    return bestPool;
  }

  /**
   * Kullanıcı girdisini soru nesnesine karşı eşleştirir.
   * Dönüş:
   * - { type: 'valid', index, answer }
   * - { type: 'invalid', reason }
   * - { type: 'none' }
   */
  function matchAnswer(rawInput, question) {
    var norm = normalizeTR(rawInput);
    if (!norm || !question) {
      return { type: 'none' };
    }

    var inputKeys = buildKeySet([norm]);

    // 1. Öncelik: Geçerli cevap grupları (label dahil)
    var validHit = findBestMatchInPool(inputKeys, question.answers || [], function (ans) {
      return [ans.label].concat(ans.aliases || []);
    });
    if (validHit) {
      return {
        type: 'valid',
        index: validHit.idx,
        answer: validHit.item
      };
    }

    // 2. Öncelik: Geçersiz cevap grupları
    var invalidHit = findBestMatchInPool(inputKeys, question.invalid || [], function (inv) {
      return inv.aliases || [];
    });
    if (invalidHit) {
      return {
        type: 'invalid',
        reason: invalidHit.item.reason || 'Bu cevap geçerli değil.'
      };
    }

    // 3. Bulunamadı
    return { type: 'none' };
  }

  /**
   * Otomatik matcher birim testleri. Tüm sorular için doğru, aksansız,
   * Türkçe büyük/küçük harf, ekli, yazım hatalı ve geçersiz örnekleri sınar.
   */
  function runMatcherTests() {
    var questions = root.QUESTIONS || [];
    if (!questions.length) {
      console.error('QUESTIONS dizisi bulunamadı!');
      return false;
    }

    var cases = [
      // Soru 1: Kahvaltı
      { qId: 1, input: 'Çay', expectType: 'valid', expectLabel: 'Çay' },
      { qId: 1, input: 'CAY', expectType: 'valid', expectLabel: 'Çay' },
      { qId: 1, input: 'çaylar', expectType: 'valid', expectLabel: 'Çay' },
      { qId: 1, input: 'ÇAYI', expectType: 'valid', expectLabel: 'Çay' },
      { qId: 1, input: 'simiti', expectType: 'valid', expectLabel: 'Simit' },
      { qId: 1, input: 'yumurtayı', expectType: 'valid', expectLabel: 'Yumurta' },
      { qId: 1, input: 'menemn', expectType: 'valid', expectLabel: 'Menemen' },
      { qId: 1, input: 'çax', expectType: 'none' }, // <= 4 harf: tolerans 0
      { qId: 1, input: 'kahve', expectType: 'invalid' },
      { qId: 1, input: 'lahmacun', expectType: 'invalid' },

      // Soru 2: Bayram sözleri
      { qId: 2, input: 'Maşallah çok büyümüşsün', expectType: 'valid', expectLabel: 'Maşallah çok büyümüşsün' },
      { qId: 2, input: 'masallah cok buyumusssun', expectType: 'valid', expectLabel: 'Maşallah çok büyümüşsün' },
      { qId: 2, input: 'İYİ BAYRAMLAR', expectType: 'valid', expectLabel: 'Bayramın mübarek olsun' },
      { qId: 2, input: 'harclik', expectType: 'valid', expectLabel: 'Al bakalım bayram harçlığı' },
      { qId: 2, input: 'günaydın', expectType: 'invalid' },
      { qId: 2, input: 'rastgele bir cümle xyz', expectType: 'none' },

      // Soru 3: Vapur
      { qId: 3, input: 'martıya simit atmak', expectType: 'valid', expectLabel: 'Simit atmak' },
      { qId: 3, input: 'MARTILARA SİMİT', expectType: 'valid', expectLabel: 'Simit atmak' },
      { qId: 3, input: 'boğazı izlemek', expectType: 'valid', expectLabel: 'Manzara izlemek' },
      { qId: 3, input: 'fotograf cekmk', expectType: 'valid', expectLabel: 'Fotoğraf çekmek' },
      { qId: 3, input: 'yüzmek', expectType: 'invalid' },
      { qId: 3, input: 'balık tutmak', expectType: 'invalid' },

      // Soru 4: Türk dizisi
      { qId: 4, input: 'Kurtlar Vadisi', expectType: 'valid', expectLabel: 'Kurtlar Vadisi' },
      { qId: 4, input: 'aski memnu', expectType: 'valid', expectLabel: 'Aşk-ı Memnu' },
      { qId: 4, input: 'muhtsem yuzyil', expectType: 'valid', expectLabel: 'Muhteşem Yüzyıl' },
      { qId: 4, input: 'kizilcik serbeti', expectType: 'valid', expectLabel: 'Kızılcık Şerbeti' },
      { qId: 4, input: 'Behzat Ç.', expectType: 'valid', expectLabel: 'Behzat Ç.' },
      { qId: 4, input: 'Breaking Bad', expectType: 'invalid' },
      { qId: 4, input: 'Recep İvedik', expectType: 'invalid' },
      { qId: 4, input: 'olmayan dizi 123', expectType: 'none' }
    ];

    var passed = 0;
    var report = [];

    for (var i = 0; i < cases.length; i++) {
      var tc = cases[i];
      var q = null;
      for (var j = 0; j < questions.length; j++) {
        if (questions[j].id === tc.qId) {
          q = questions[j];
          break;
        }
      }
      var res = matchAnswer(tc.input, q);
      var ok = res.type === tc.expectType;
      if (ok && tc.expectLabel) {
        ok = res.answer && res.answer.label === tc.expectLabel;
      }
      if (ok && tc.expectType === 'invalid') {
        ok = typeof res.reason === 'string' && res.reason.length > 0;
      }
      if (ok) passed++;

      report.push({
        Soru: tc.qId,
        Girdi: tc.input,
        Beklenen: tc.expectLabel ? tc.expectType + ':' + tc.expectLabel : tc.expectType,
        Sonuc: res.type + (res.answer ? ':' + res.answer.label : res.reason ? ':' + res.reason : ''),
        Durum: ok ? 'GEÇTİ' : 'KALDI'
      });
    }

    if (typeof console.table === 'function') {
      console.table(report);
    }
    console.log('Matcher Testleri: ' + passed + '/' + cases.length + ' geçti.');
    return passed === cases.length;
  }

  root.Matcher = {
    normalizeTR: normalizeTR,
    toAsciiKey: toAsciiKey,
    stripTurkishSuffix: stripTurkishSuffix,
    getStemVariants: getStemVariants,
    levenshtein: levenshtein,
    getMaxDistance: getMaxDistance,
    matchAnswer: matchAnswer
  };
  root.runMatcherTests = runMatcherTests;
})(typeof window !== 'undefined' ? window : globalThis);
