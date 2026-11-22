/**
 * PUSULLA — Türkçe Normalizasyon ve Toleranslı Eşleştirme Motoru v2 (matcher.js)
 *
 * Sıra:
 * 1. normalizeTR: tr-TR küçük harf + \u0307 temizliği + noktalama → boşluk + trim
 * 2. toAsciiKey: Türkçe aksanlı harfleri ASCII karşılığına indirger
 * 3. Genişletilmiş ek temizleme: son kelimeye en fazla 2 katman (kök >=3; tek harf >=4)
 * 4. Levenshtein: Aksansız anahtar uzunluğuna göre tolerans (<=4: 0, 5-8: 1, 9+: 2)
 * 5. İçerik anahtarı geçişi: hafif fiilleri ve ekleri düşürerek >=4 harf tam eşleşme
 * 6. Kelime (token) geçişi: dolgu kelimeleri atıp tek kalan tek-kelimelik eşleşme
 * 7. Öncelik: (a) geçerli normal → (b) geçersiz normal → (c) geçerli içerik → (d) geçersiz içerik → (e) token → (f) none
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

  // Uzundan kısaya sıralı genişletilmiş Türkçe + ASCII isim çekim son ekleri (§10.2)
  var SUFFIXES = [
    'ları', 'leri', 'lari',
    'dan', 'den', 'tan', 'ten', 'yla', 'yle',
    'nın', 'nin', 'nun', 'nün',
    'mız', 'miz', 'muz', 'müz',
    'lar', 'ler',
    'sı', 'si', 'su', 'sü',
    'yı', 'yi', 'yu', 'yü',
    'ya', 'ye', 'da', 'de', 'ta', 'te', 'la', 'le',
    'ın', 'in', 'un', 'ün',
    'ım', 'im', 'um', 'üm',
    'a', 'e', 'ı', 'i', 'u', 'ü'
  ].filter(function (v, idx, arr) {
    return arr.indexOf(v) === idx;
  }).sort(function (a, b) {
    return b.length - a.length;
  });

  // İçerik kökü soyma için ek fiil + isim çekim ekleri
  var CONTENT_SUFFIXES = [
    'iyorum', 'ıyorum', 'uyorum', 'üyorum',
    'mişim', 'mışım', 'muşum', 'müşüm', 'misim',
    'mişti', 'mıştı', 'muştu', 'müştü', 'misti', 'mıstı', 'mustu',
    'ları', 'leri', 'lari',
    'iyor', 'ıyor', 'uyor', 'üyor',
    'dan', 'den', 'tan', 'ten', 'yla', 'yle',
    'nın', 'nin', 'nun', 'nün',
    'mız', 'miz', 'muz', 'müz',
    'miş', 'mış', 'muş', 'müş', 'mis', 'mus',
    'dım', 'dim', 'dum', 'düm', 'tım', 'tim', 'tum', 'tüm',
    'dın', 'din', 'dun', 'dün', 'tın', 'tin', 'tun', 'tün',
    'dık', 'dik', 'duk', 'dük', 'tık', 'tik', 'tuk', 'tük',
    'mak', 'mek',
    'yor',
    'lar', 'ler',
    'sı', 'si', 'su', 'sü',
    'yı', 'yi', 'yu', 'yü',
    'ya', 'ye', 'da', 'de', 'ta', 'te', 'la', 'le',
    'dı', 'di', 'du', 'dü', 'tı', 'ti', 'tu', 'tü',
    'ın', 'in', 'un', 'ün',
    'ım', 'im', 'um', 'üm',
    'a', 'e', 'ı', 'i', 'u', 'ü'
  ].filter(function (v, idx, arr) {
    return arr.indexOf(v) === idx;
  }).sort(function (a, b) {
    return b.length - a.length;
  });

  // Uzundan kısaya fiil çekim ekleri (§10.3)
  var VERB_ENDINGS = [
    'ıyorum', 'iyorum', 'uyorum', 'üyorum',
    'ıyor', 'iyor', 'uyor', 'üyor',
    'maya', 'meye', 'mayı', 'meyi', 'mayi',
    'arım', 'erim', 'ırım', 'irim', 'arim',
    'alım', 'elim', 'alim',
    'mak', 'mek',
    'dım', 'dim', 'tım', 'tim',
    'ar', 'er',
    'dı', 'di', 'tı', 'ti'
  ].filter(function (v, idx, arr) {
    return arr.indexOf(v) === idx;
  }).sort(function (a, b) {
    return b.length - a.length;
  });

  var HAFIF_FIILLER = ['yap', 'et', 'git', 'gid', 'ol', 'eyle', 'kıl', 'kil', 'gez'];

  // İçerik örtüşmesinde tek başına ana isim kökü sayılamayacak hafif/fiil/zaman kökleri
  var WEAK_OVERLAP_ROOTS = [
    'kal', 'gec', 'ol', 'var', 'yok', 'git', 'gid', 'gel', 'yap', 'et', 'eyle',
    'kil', 'gez', 'al', 'ver', 'de', 'ye', 'ic', 'ac', 'bak', 'cik', 'gir',
    'tut', 'at', 'koy', 'kes', 'bit', 'cal', 'dur', 'bas', 'cek', 'sur', 'kac'
  ];

  // İçerik örtüşmesinde alias köklerine ek olarak bulunmasına izin verilen tüketim/eylem kökleri
  var EXTRA_VERB_ROOTS = ['ye', 'yemek', 'ic', 'icmek', 'yap', 'et', 'ol', 'git', 'al'];

  // Token geçişinde tek kelimelik anahtarın yanında bulunabilecek yardımcı fiil/zaman kelimeleri
  var TOKEN_COMPANIONS = ['yemek', 'içmek', 'icmek', 'yerim', 'içerim', 'icerim', 'akşam', 'aksam', 'sabah'];

  var DOLGU = [
    'bir', 'çok', 'cok', 'en', 've', 'ile', 'de', 'da', 'ki',
    'şey', 'sey', 'bence', 'herhalde', 'yani', 'tabi', 'tabii',
    'mi', 'mı', 'mu', 'mü', 'ya', 'galiba'
  ];

  // İçerik sözcük örtüşmesinde yalnız tam alias bağlamında kabul edilen kısa kökler
  var SAFE_SHORT_ROOTS = ['su'];

  // Fiil gövdesi/türetim ekleri (içerik örtüşmesi için; ör. kesik/kesil/kesinti -> kes, kaçır -> kaç)
  var VERB_DERIV_SUFFIXES = [
    'inti', 'ıntı', 'untu', 'üntü',
    'il', 'ıl', 'ul', 'ül',
    'ik', 'ık', 'uk', 'ük',
    'in', 'ın', 'un', 'ün',
    'ir', 'ır', 'ur', 'ür'
  ].sort(function (a, b) {
    return b.length - a.length;
  });

  // Ek soyma sırasında bozulmaması gereken kalıplaşmış isimler
  var NO_STRIP_WORDS = ['gelin', 'kuruyemiş', 'kuruyemis', 'süleymaniye', 'suleymaniye', 'kolonya', 'otobüs', 'otobus'];

  // Tek kök birleştirmede (özne + kesinti/arıza yüklemi) kabul edilen durum kökleri
  var OUTAGE_VERBS = ['kes', 'git', 'yok', 'bit', 'kac', 'boz'];

  function normalizeTR(input) {
    if (input === null || input === undefined) {
      return '';
    }
    return String(input)
      .normalize('NFC')
      .replace(/[\u200B\u200D\uFEFF]/g, '')
      .replace(/\u00A0/g, ' ')
      .toLocaleLowerCase('tr-TR')
      .replace(/\u0307/g, '')
      .replace(/[.,!?;:'"‘’“”…–—()\[\]{}\-_/\\&+*=<>~`|@#%^$]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function toAsciiKey(normalizedStr) {
    return String(normalizedStr).replace(/[çğıöşüâîû]/g, function (ch) {
      return TR_CHAR_MAP[ch] || ch;
    });
  }

  var BUFFER_2_SUFFIXES = ['ya', 'ye', 'yı', 'yi', 'yu', 'yü', 'sı', 'si', 'su', 'sü'];

  /**
   * Tek katman isim ek soyma: tek harfli (a/e/ı/i/u/ü) ekler için kalan kök >= 4,
   * diğer ekler için kalan kök >= 3 olmalıdır ('sular' -> 'su' hariç).
   */
  function stripOneLayer(word) {
    var out = [];
    if (!word || word.length < 4 || NO_STRIP_WORDS.indexOf(word) !== -1) {
      return out;
    }
    var hasBufferMatch = false;
    for (var i = 0; i < SUFFIXES.length; i++) {
      var sfx = SUFFIXES[i];
      if (sfx.length === 1 && hasBufferMatch) {
        continue;
      }
      var stemLen = word.length - sfx.length;
      if (stemLen < 2 || word.slice(-sfx.length) !== sfx) {
        continue;
      }
      var stem = word.slice(0, -sfx.length);
      if ((sfx === 'su' || sfx === 'sü') && (stem === 'otobu' || stem === 'otobü')) {
        continue;
      }
      var minRoot = sfx.length === 1 ? 4 : 3;
      var allowShort = (sfx === 'lar' || sfx === 'ler') && stem === 'su';
      if (stemLen >= minRoot || allowShort) {
        if (BUFFER_2_SUFFIXES.indexOf(sfx) !== -1) {
          hasBufferMatch = true;
        }
        if (out.indexOf(stem) === -1) {
          out.push(stem);
        }
      }
    }
    return out;
  }

  function stripContentOneLayer(word) {
    var out = [];
    if (!word || word.length < 4 || NO_STRIP_WORDS.indexOf(word) !== -1) {
      return out;
    }
    var hasBufferMatch = false;
    for (var i = 0; i < CONTENT_SUFFIXES.length; i++) {
      var sfx = CONTENT_SUFFIXES[i];
      if (sfx.length === 1 && hasBufferMatch) {
        continue;
      }
      var stemLen = word.length - sfx.length;
      if (stemLen < 2 || word.slice(-sfx.length) !== sfx) {
        continue;
      }
      var stem = word.slice(0, -sfx.length);
      if ((sfx === 'su' || sfx === 'sü') && (stem === 'otobu' || stem === 'otobü')) {
        continue;
      }
      var minRoot = sfx.length === 1 ? 4 : 3;
      var allowShort = (stem === 'su' && (sfx === 'lar' || sfx === 'ler')) ||
        (stem === 'ye' && (sfx === 'dim' || sfx === 'dım' || sfx === 'dik' || sfx === 'dık' || sfx === 'mek' || sfx === 'miş' || sfx === 'mis'));
      if (stemLen >= minRoot || allowShort) {
        if (BUFFER_2_SUFFIXES.indexOf(sfx) !== -1) {
          hasBufferMatch = true;
        }
        if (out.indexOf(stem) === -1) {
          out.push(stem);
        }
      }
    }
    return out;
  }

  function stripContentDeepest(word) {
    var cur = word;
    for (var layer = 0; layer < 2; layer++) {
      var next = stripContentOneLayer(cur);
      if (next.length === 0) break;
      cur = next[0];
    }
    return cur;
  }

  /**
   * En fazla 2 katman ek soyma uygular ve tüm olası kök adaylarını döner.
   */
  function stripTurkishSuffixesAll(word) {
    var out = [];
    var layer1 = stripOneLayer(word);
    for (var i = 0; i < layer1.length; i++) {
      var s1 = layer1[i];
      if (out.indexOf(s1) === -1) out.push(s1);
      var layer2 = stripOneLayer(s1);
      for (var j = 0; j < layer2.length; j++) {
        var s2 = layer2[j];
        if (out.indexOf(s2) === -1) out.push(s2);
      }
    }
    return out;
  }

  function stripTurkishSuffixDeepest(word) {
    var cur = word;
    for (var layer = 0; layer < 2; layer++) {
      var next = stripOneLayer(cur);
      if (next.length === 0) break;
      cur = next[0];
    }
    return cur;
  }

  function stripTurkishSuffix(word) {
    var all = stripOneLayer(word);
    return all.length > 0 ? all[0] : word;
  }

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

    var words = normalizedStr.split(' ');
    if (words.length === 1) {
      var wholeStems = stripTurkishSuffixesAll(normalizedStr);
      for (var i = 0; i < wholeStems.length; i++) {
        pushUnique(wholeStems[i]);
      }
    } else {
      var strippedDeepest = words.map(stripTurkishSuffixDeepest).join(' ');
      pushUnique(strippedDeepest);

      var strippedFirst = words.map(stripTurkishSuffix).join(' ');
      pushUnique(strippedFirst);

      var lastStems = stripTurkishSuffixesAll(words[words.length - 1]);
      var prefix = words.slice(0, -1).join(' ');
      for (var j = 0; j < lastStems.length; j++) {
        pushUnique(prefix + ' ' + lastStems[j]);
      }
    }

    return variants;
  }

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

  function getMaxDistance(keyLength) {
    if (keyLength <= 4) return 0;
    if (keyLength <= 8) return 1;
    return 2;
  }

  /**
   * İçerik anahtarı üretimi (§10.3):
   * Son kelimeden fiil çekimlerini at; kök HAFIF_FIILLER içindeyse düşür.
   * Kalan her kelimeye ek temizleme uygula ve boşlukla birleştir.
   * Yalnız >= 4 harfse döner (TR ve ASCII).
   */
  function buildContentKeys(norm) {
    var out = [];
    if (!norm) return out;
    var words = norm.split(' ');
    if (words.length === 0) return out;

    var last = words[words.length - 1];
    var dropLast = false;

    if (HAFIF_FIILLER.indexOf(last) !== -1 || HAFIF_FIILLER.indexOf(toAsciiKey(last)) !== -1) {
      dropLast = true;
    } else {
      for (var i = 0; i < VERB_ENDINGS.length; i++) {
        var end = VERB_ENDINGS[i];
        if (last.length > end.length && last.slice(-end.length) === end) {
          var rootWord = last.slice(0, -end.length);
          if (HAFIF_FIILLER.indexOf(rootWord) !== -1 || HAFIF_FIILLER.indexOf(toAsciiKey(rootWord)) !== -1) {
            dropLast = true;
            break;
          }
        }
      }
    }

    var kept = dropLast ? words.slice(0, -1) : words.slice();
    if (kept.length === 0) return out;

    var strippedTR = kept.map(stripTurkishSuffixDeepest).join(' ').trim();
    var strippedAsc = kept.map(function (w) {
      return stripTurkishSuffixDeepest(toAsciiKey(w));
    }).join(' ').trim();
    var trToAsc = toAsciiKey(strippedTR);

    if (strippedTR.length >= 4 && out.indexOf(strippedTR) === -1) out.push(strippedTR);
    if (trToAsc.length >= 4 && out.indexOf(trToAsc) === -1) out.push(trToAsc);
    if (strippedAsc.length >= 4 && out.indexOf(strippedAsc) === -1) out.push(strippedAsc);

    return out;
  }

  /**
   * Tek bir ifade için normalize + aksansız + ek-soyulmuş ASCII anahtar listesi döner.
   * tools/check.js çakışma kontrolü tarafından kullanılır.
   */
  function buildKeys(phrase) {
    var norm = normalizeTR(phrase);
    if (!norm) return [];
    var asc = toAsciiKey(norm);
    var out = [];

    function pushU(k) {
      if (k && out.indexOf(k) === -1) out.push(k);
    }

    pushU(asc);
    var stemsTR = getStemVariants(norm);
    for (var i = 0; i < stemsTR.length; i++) {
      pushU(toAsciiKey(stemsTR[i]));
    }
    var stemsAsc = getStemVariants(asc);
    for (var j = 0; j < stemsAsc.length; j++) {
      pushU(stemsAsc[j]);
    }
    return out;
  }

  function buildKeySet(phrases) {
    var exactTR = [];
    var exactAscii = [];
    var stemTR = [];
    var stemAscii = [];
    var contentKeys = [];

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

      var ascStems = getStemVariants(asc);
      for (var k = 0; k < ascStems.length; k++) {
        if (stemAscii.indexOf(ascStems[k]) === -1) stemAscii.push(ascStems[k]);
      }

      var cKeys = buildContentKeys(norm);
      for (var c = 0; c < cKeys.length; c++) {
        if (contentKeys.indexOf(cKeys[c]) === -1) contentKeys.push(cKeys[c]);
      }
    }

    return {
      exactTR: exactTR,
      exactAscii: exactAscii,
      stemTR: stemTR,
      stemAscii: stemAscii,
      contentKeys: contentKeys
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

  function stemContentWord(word) {
    var asc = toAsciiKey(word);
    if (!asc) return '';
    if (NO_STRIP_WORDS.indexOf(asc) !== -1 || NO_STRIP_WORDS.indexOf(word) !== -1) {
      return asc;
    }
    if (asc.indexOf('kalabalik') === 0) {
      return 'tikal';
    }
    var cur = stripContentDeepest(asc);
    for (var i = 0; i < VERB_DERIV_SUFFIXES.length; i++) {
      var ds = toAsciiKey(VERB_DERIV_SUFFIXES[i]);
      if (cur.length - ds.length >= 3 && cur.slice(-ds.length) === ds) {
        cur = cur.slice(0, -ds.length);
        break;
      }
    }
    return cur;
  }

  function extractContentRoots(normPhrase) {
    var roots = [];
    if (!normPhrase) return roots;
    var words = normPhrase.split(' ');
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (!w) continue;
      if (DOLGU.indexOf(w) !== -1 || DOLGU.indexOf(toAsciiKey(w)) !== -1) {
        continue;
      }
      var root = stemContentWord(w);
      if (root && roots.indexOf(root) === -1) {
        roots.push(root);
      }
    }
    return roots;
  }

  function isMainNounRoot(root) {
    if (!root || root.length < 4) return false;
    if (HAFIF_FIILLER.indexOf(root) !== -1) return false;
    if (WEAK_OVERLAP_ROOTS.indexOf(root) !== -1) return false;
    return true;
  }

  function isEligibleSingleRoot(root) {
    if (!root) return false;
    return root.length >= 3 || SAFE_SHORT_ROOTS.indexOf(root) !== -1;
  }

  /**
   * Soru için ön dizin (_mIndex) oluşturur ve soru nesnesinde saklar.
   */
  function ensureIndex(question) {
    if (question._mIndex) {
      return question._mIndex;
    }

    var answers = question.answers || [];
    var invalid = question.invalid || [];

    var answerPools = answers.map(function (ans, idx) {
      var phrases = [ans.label].concat(ans.aliases || []);
      var phraseRoots = [];
      var shortRoots = Object.create(null);
      var mainNounRoots = Object.create(null);
      var wordPrefixes = Object.create(null);

      var normLabel = normalizeTR(ans.label);
      if (normLabel) {
        var lWords = toAsciiKey(normLabel).split(' ');
        for (var lw = 0; lw < lWords.length; lw++) {
          if (lWords[lw].length >= 4) {
            wordPrefixes[lWords[lw].slice(0, 4)] = true;
          }
        }
      }

      for (var p = 0; p < phrases.length; p++) {
        var normP = normalizeTR(phrases[p]);
        if (!normP) continue;
        var rList = extractContentRoots(normP);
        if (rList.length > 0) {
          phraseRoots.push(rList);
          if (rList.length <= 2) {
            for (var r = 0; r < rList.length; r++) {
              var rt = rList[r];
              shortRoots[rt] = true;
              if (isMainNounRoot(rt)) {
                mainNounRoots[rt] = true;
              }
            }
          }
        }
      }
      return {
        idx: idx,
        item: ans,
        keys: buildKeySet(phrases),
        phraseRoots: phraseRoots,
        shortRoots: shortRoots,
        mainNounRoots: mainNounRoots,
        wordPrefixes: wordPrefixes
      };
    });

    var invalidPools = invalid.map(function (inv, idx) {
      var phrases = inv.aliases || [];
      var phraseRoots = [];
      for (var p = 0; p < phrases.length; p++) {
        var normP = normalizeTR(phrases[p]);
        if (!normP) continue;
        var rList = extractContentRoots(normP);
        if (rList.length > 0) {
          phraseRoots.push(rList);
        }
      }
      return {
        idx: idx,
        item: inv,
        keys: buildKeySet(phrases),
        phraseRoots: phraseRoots
      };
    });

    // Tek kelimelik alias/etiketlerin grup dizini (token geçişi için)
    var singleWordMap = Object.create(null);
    function addSingleWordKey(key, groupIdx) {
      if (!key || key.indexOf(' ') !== -1) return;
      if (!singleWordMap[key]) {
        singleWordMap[key] = [groupIdx];
      } else if (singleWordMap[key].indexOf(groupIdx) === -1) {
        singleWordMap[key].push(groupIdx);
      }
    }

    // İçerik köklerinin grup dizini (tekil kök eşleşmesi için)
    var contentRootMap = Object.create(null);
    var shortRootMap = Object.create(null);
    for (var i = 0; i < answerPools.length; i++) {
      var pool = answerPools[i];
      var phrases = [pool.item.label].concat(pool.item.aliases || []);
      for (var p = 0; p < phrases.length; p++) {
        var normP = normalizeTR(phrases[p]);
        if (!normP) continue;
        if (normP.indexOf(' ') === -1) {
          var swKeys = buildKeySet([normP]);
          var allSw = swKeys.exactTR.concat(swKeys.exactAscii, swKeys.stemTR, swKeys.stemAscii);
          for (var s = 0; s < allSw.length; s++) {
            addSingleWordKey(allSw[s], pool.idx);
          }
        }
      }
      for (var pr = 0; pr < pool.phraseRoots.length; pr++) {
        var roots = pool.phraseRoots[pr];
        var isShort = roots.length <= 2;
        for (var rk = 0; rk < roots.length; rk++) {
          var rt = roots[rk];
          if (!isEligibleSingleRoot(rt)) continue;
          if (!contentRootMap[rt]) {
            contentRootMap[rt] = [pool.idx];
          } else if (contentRootMap[rt].indexOf(pool.idx) === -1) {
            contentRootMap[rt].push(pool.idx);
          }
          if (isShort) {
            if (!shortRootMap[rt]) {
              shortRootMap[rt] = [pool.idx];
            } else if (shortRootMap[rt].indexOf(pool.idx) === -1) {
              shortRootMap[rt].push(pool.idx);
            }
          }
        }
      }
    }

    // Tek kelimelik invalid alias'ların grup dizini
    var invalidSingleWordMap = Object.create(null);
    for (var ii = 0; ii < invalidPools.length; ii++) {
      var iPool = invalidPools[ii];
      var iPhrases = iPool.item.aliases || [];
      for (var ip = 0; ip < iPhrases.length; ip++) {
        var normIP = normalizeTR(iPhrases[ip]);
        if (!normIP || normIP.indexOf(' ') !== -1) continue;
        var iswKeys = buildKeySet([normIP]);
        var allISw = iswKeys.exactTR.concat(iswKeys.exactAscii, iswKeys.stemTR, iswKeys.stemAscii);
        for (var is = 0; is < allISw.length; is++) {
          var ik = allISw[is];
          if (ik && ik.indexOf(' ') === -1 && !invalidSingleWordMap[ik]) {
            invalidSingleWordMap[ik] = iPool;
          }
        }
      }
    }

    question._mIndex = {
      answers: answerPools,
      invalid: invalidPools,
      singleWordMap: singleWordMap,
      invalidSingleWordMap: invalidSingleWordMap,
      contentRootMap: contentRootMap,
      shortRootMap: shortRootMap
    };
    return question._mIndex;
  }

  function findExactOrStemMatch(inputKeys, pools) {
    // 1. Tam eşleşme
    for (var i = 0; i < pools.length; i++) {
      var k = pools[i].keys;
      if (hasOverlap(inputKeys.exactTR, k.exactTR) || hasOverlap(inputKeys.exactAscii, k.exactAscii)) {
        return { pool: pools[i], via: 'exact' };
      }
    }

    // 2. Ek temizleme sonrası eşleşme
    for (var i2 = 0; i2 < pools.length; i2++) {
      var k2 = pools[i2].keys;
      if (hasOverlap(inputKeys.stemTR, k2.stemTR) || hasOverlap(inputKeys.stemAscii, k2.stemAscii)) {
        return { pool: pools[i2], via: 'stem' };
      }
    }

    return null;
  }

  function findFuzzyMatch(inputKeys, pools) {
    // 3. Levenshtein toleranslı eşleşme
    var bestPool = null;
    var bestDist = Infinity;

    for (var i3 = 0; i3 < pools.length; i3++) {
      var targetKeys = pools[i3].keys.stemAscii;
      for (var a = 0; a < inputKeys.stemAscii.length; a++) {
        var inStr = inputKeys.stemAscii[a];
        var inMax = getMaxDistance(inStr.length);
        var inWords = inStr.split(' ');
        for (var b = 0; b < targetKeys.length; b++) {
          var tStr = targetKeys[b];
          var maxAllowed = Math.min(inMax, getMaxDistance(tStr.length));
          if (maxAllowed === 0) continue;
          if (Math.abs(inStr.length - tStr.length) > maxAllowed) continue;

          var d = levenshtein(inStr, tStr);
          if (d > maxAllowed || d >= bestDist) continue;

          var tWords = tStr.split(' ');
          if (inWords.length > 1 || tWords.length > 1) {
            if (inWords.length !== tWords.length) {
              if (d > 1) continue;
            } else {
              var wordOk = true;
              for (var wi = 0; wi < inWords.length; wi++) {
                var wA = inWords[wi];
                var wB = tWords[wi];
                if (wA === wB) continue;
                var wMax = Math.min(getMaxDistance(wA.length), getMaxDistance(wB.length));
                if (wMax === 0 || (Math.min(wA.length, wB.length) <= 7 && wA.charAt(0) !== wB.charAt(0))) {
                  wordOk = false;
                  break;
                }
                if (levenshtein(wA, wB) > wMax) {
                  wordOk = false;
                  break;
                }
              }
              if (!wordOk) continue;
            }
          } else {
            if (Math.min(inStr.length, tStr.length) <= 7 && inStr.charAt(0) !== tStr.charAt(0)) {
              continue;
            }
          }

          bestDist = d;
          bestPool = pools[i3];
        }
      }
    }

    if (bestPool) {
      return { pool: bestPool, via: 'fuzzy' };
    }
    return null;
  }

  function findNormalMatch(inputKeys, pools) {
    return findExactOrStemMatch(inputKeys, pools) || findFuzzyMatch(inputKeys, pools);
  }

  function findContentMatch(inputKeys, pools) {
    if (!inputKeys.contentKeys || inputKeys.contentKeys.length === 0) {
      return null;
    }
    for (var i = 0; i < pools.length; i++) {
      if (hasOverlap(inputKeys.contentKeys, pools[i].keys.contentKeys)) {
        return pools[i];
      }
    }
    return null;
  }

  /**
   * İçerik sözcük örtüşmesi:
   * En az 2 kelimeli girdide, alias'ın tüm kökleri girdide bulunmalı,
   * içinde en az bir ana isim kökü (veya 2 köklü 'su' tam bağlamı) yer almalı,
   * girdide fazladan tanınmayan isim kökü bulunmamalıdır.
   */
  function findContentOverlapMatch(norm, pools) {
    var words = norm.split(' ');
    if (words.length < 2) return null;

    var inputRoots = extractContentRoots(norm);
    if (inputRoots.length < 2) return null;

    var bestPool = null;
    var bestScore = 0;

    for (var i = 0; i < pools.length; i++) {
      var phraseRoots = pools[i].phraseRoots || [];
      for (var p = 0; p < phraseRoots.length; p++) {
        var aliasRoots = phraseRoots[p];
        if (aliasRoots.length < 2) continue;
        if (inputRoots.length < aliasRoots.length || inputRoots.length > aliasRoots.length + 1) {
          continue;
        }

        var matched = 0;
        var hasMainNoun = false;
        for (var a = 0; a < aliasRoots.length; a++) {
          var ar = aliasRoots[a];
          if (inputRoots.indexOf(ar) !== -1) {
            matched++;
            if (isMainNounRoot(ar) || (aliasRoots.length === 2 && SAFE_SHORT_ROOTS.indexOf(ar) !== -1)) {
              hasMainNoun = true;
            }
          }
        }
        if (matched !== aliasRoots.length || !hasMainNoun) continue;

        if (inputRoots.length > aliasRoots.length) {
          var extraOk = true;
          for (var ir = 0; ir < inputRoots.length; ir++) {
            if (aliasRoots.indexOf(inputRoots[ir]) === -1 && EXTRA_VERB_ROOTS.indexOf(inputRoots[ir]) === -1) {
              extraOk = false;
              break;
            }
          }
          if (!extraOk) continue;
        }

        var score = matched * 100 - (inputRoots.length - aliasRoots.length) * 10;
        if (score > bestScore) {
          bestScore = score;
          bestPool = pools[i];
        }
      }
    }

    return bestPool;
  }

  /**
   * Tekil içerik kökü eşleşmesi (en az 2 kelimeli girdide):
   * Girdinin TÜM içerik kökleri aynı cevap grubunun <=2 köklü kısa alias'larında bulunmalı,
   * içinde mutlaka grubun ana isim kökü (veya 'su' + kesinti/gitme bağlamı) yer almalı ve
   * yalnızca tek bir cevap grubuna denk gelmelidir.
   */
  function findSingleRootMatch(norm, index) {
    var words = norm.split(' ');
    if (words.length < 2) return null;

    var inputRoots = extractContentRoots(norm);
    if (inputRoots.length !== 2) return null;

    var r0 = inputRoots[0];
    var r1 = inputRoots[1];
    if (!isEligibleSingleRoot(r0) || !isEligibleSingleRoot(r1)) {
      return null;
    }

    var matchedPool = null;
    for (var i = 0; i < index.answers.length; i++) {
      var pool = index.answers[i];
      if (!pool.shortRoots[r0] || !pool.shortRoots[r1]) {
        continue;
      }
      var pairOk =
        ((pool.mainNounRoots[r0] || r0 === 'su') && OUTAGE_VERBS.indexOf(r1) !== -1) ||
        ((pool.mainNounRoots[r1] || r1 === 'su') && OUTAGE_VERBS.indexOf(r0) !== -1);
      if (pairOk) {
        if (matchedPool !== null) {
          return null;
        }
        matchedPool = pool;
      }
    }

    return matchedPool;
  }

  function getWordSingleCandidates(w) {
    var wKeys = buildKeySet([w]);
    return wKeys.exactTR.concat(wKeys.exactAscii, wKeys.stemTR, wKeys.stemAscii);
  }

  function findInvalidTokenMatch(norm, index, onlySingleRemaining) {
    var words = norm.split(' ');
    if (words.length <= 1) return null;

    var remaining = [];
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (DOLGU.indexOf(w) === -1 && DOLGU.indexOf(toAsciiKey(w)) === -1) {
        remaining.push(w);
      }
    }
    if (remaining.length === 0) return null;
    if (onlySingleRemaining && remaining.length !== 1) return null;

    // Çok kelimeli girdide geçerli tek kelimelik bir cevaba denk gelen kelime varsa doğru cevabı ezme
    for (var v = 0; v < remaining.length; v++) {
      var vCands = getWordSingleCandidates(remaining[v]);
      for (var vc = 0; vc < vCands.length; vc++) {
        if (index.singleWordMap[vCands[vc]]) {
          return null;
        }
      }
    }

    for (var r = 0; r < remaining.length; r++) {
      var candidates = getWordSingleCandidates(remaining[r]);
      for (var c = 0; c < candidates.length; c++) {
        var invPool = index.invalidSingleWordMap[candidates[c]];
        if (invPool) {
          return invPool;
        }
      }
    }
    return null;
  }

  function findTokenMatch(norm, index) {
    var words = norm.split(' ');
    if (words.length <= 1) return null;

    var remaining = [];
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (DOLGU.indexOf(w) === -1 && DOLGU.indexOf(toAsciiKey(w)) === -1) {
        remaining.push(w);
      }
    }
    if (remaining.length === 0 || remaining.length > 3) return null;

    var matchedWordCount = 0;
    var targetGroupIdx = -1;
    var unmatchedWords = [];

    for (var r = 0; r < remaining.length; r++) {
      var candidates = getWordSingleCandidates(remaining[r]);
      var hitGroups = [];
      var isInvalidWord = false;
      for (var c = 0; c < candidates.length; c++) {
        var groups = index.singleWordMap[candidates[c]];
        if (groups) {
          for (var g = 0; g < groups.length; g++) {
            if (hitGroups.indexOf(groups[g]) === -1) {
              hitGroups.push(groups[g]);
            }
          }
        }
        if (index.invalidSingleWordMap[candidates[c]]) {
          isInvalidWord = true;
        }
      }
      if (hitGroups.length > 0) {
        matchedWordCount++;
        if (matchedWordCount > 1 || hitGroups.length !== 1) {
          return null;
        }
        targetGroupIdx = hitGroups[0];
      } else if (!isInvalidWord) {
        unmatchedWords.push(remaining[r]);
      }
    }

    if (matchedWordCount === 1 && targetGroupIdx !== -1) {
      var targetPool = index.answers[targetGroupIdx];
      for (var u = 0; u < unmatchedWords.length; u++) {
        var uw = unmatchedWords[u];
        var uwAsc = toAsciiKey(uw);
        var isCompanion = TOKEN_COMPANIONS.indexOf(uw) !== -1 || TOKEN_COMPANIONS.indexOf(uwAsc) !== -1;
        var isGroupVerb = uwAsc.length >= 4 && targetPool.wordPrefixes && targetPool.wordPrefixes[uwAsc.slice(0, 4)];
        if (!isCompanion && !isGroupVerb) {
          return null;
        }
      }
      return targetPool;
    }
    return null;
  }

  /**
   * Kullanıcı girdisini soru nesnesine karşı eşleştirir.
   * Dönüş:
   * - { type: 'valid', index, answer, via }
   * - { type: 'invalid', reason, via }
   * - { type: 'none' }
   */
  function matchAnswer(rawInput, question) {
    var norm = normalizeTR(rawInput);
    if (!norm || !question) {
      return { type: 'none' };
    }

    var idx = ensureIndex(question);
    var inputKeys = buildKeySet([norm]);

    // (a) Geçerli tam/ek eşleşme (exact -> stem)
    var validExactStem = findExactOrStemMatch(inputKeys, idx.answers);
    if (validExactStem) {
      return {
        type: 'valid',
        index: validExactStem.pool.idx,
        answer: validExactStem.pool.item,
        via: validExactStem.via
      };
    }

    // (b) Geçersiz tam/ek eşleşme (exact -> stem)
    var invalidExactStem = findExactOrStemMatch(inputKeys, idx.invalid);
    if (invalidExactStem) {
      return {
        type: 'invalid',
        reason: invalidExactStem.pool.item.reason || 'Bu cevap geçerli değil.',
        via: invalidExactStem.via
      };
    }

    // (b2) Geçersiz içerik örtüşmesi veya yalnızca dolgu+tek-kelime invalid token (valid fuzzy'den ÖNCE)
    var invalidOverlapEarly = findContentOverlapMatch(norm, idx.invalid);
    if (invalidOverlapEarly) {
      return {
        type: 'invalid',
        reason: invalidOverlapEarly.item.reason || 'Bu cevap geçerli değil.',
        via: 'overlap'
      };
    }

    var invalidSingleTokenEarly = findInvalidTokenMatch(norm, idx, true);
    if (invalidSingleTokenEarly) {
      return {
        type: 'invalid',
        reason: invalidSingleTokenEarly.item.reason || 'Bu cevap geçerli değil.',
        via: 'token'
      };
    }

    // (c) Geçerli fuzzy eşleşme
    var validFuzzy = findFuzzyMatch(inputKeys, idx.answers);
    if (validFuzzy) {
      return {
        type: 'valid',
        index: validFuzzy.pool.idx,
        answer: validFuzzy.pool.item,
        via: validFuzzy.via
      };
    }

    // (d) Geçersiz fuzzy eşleşme
    var invalidFuzzy = findFuzzyMatch(inputKeys, idx.invalid);
    if (invalidFuzzy) {
      return {
        type: 'invalid',
        reason: invalidFuzzy.pool.item.reason || 'Bu cevap geçerli değil.',
        via: invalidFuzzy.via
      };
    }

    // (e) Geçersiz içerik anahtarı ve içerik örtüşmesi (valid örtüşmesinden ÖNCE)
    var invalidContent = findContentMatch(inputKeys, idx.invalid);
    if (invalidContent) {
      return {
        type: 'invalid',
        reason: invalidContent.item.reason || 'Bu cevap geçerli değil.',
        via: 'content'
      };
    }

    var invalidOverlap = findContentOverlapMatch(norm, idx.invalid);
    if (invalidOverlap) {
      return {
        type: 'invalid',
        reason: invalidOverlap.item.reason || 'Bu cevap geçerli değil.',
        via: 'overlap'
      };
    }

    // (f) Geçerli içerik anahtarı
    var validContent = findContentMatch(inputKeys, idx.answers);
    if (validContent) {
      return {
        type: 'valid',
        index: validContent.idx,
        answer: validContent.item,
        via: 'content'
      };
    }

    // (g) Geçerli içerik kök örtüşmesi
    var validOverlap = findContentOverlapMatch(norm, idx.answers);
    if (validOverlap) {
      return {
        type: 'valid',
        index: validOverlap.idx,
        answer: validOverlap.item,
        via: 'overlap'
      };
    }

    // (h) Kelime (token) geçişi
    var tokenHit = findTokenMatch(norm, idx);
    if (tokenHit) {
      return {
        type: 'valid',
        index: tokenHit.idx,
        answer: tokenHit.item,
        via: 'token'
      };
    }

    // (i) Tekil içerik kökü geçişi
    var singleRootHit = findSingleRootMatch(norm, idx);
    if (singleRootHit) {
      return {
        type: 'valid',
        index: singleRootHit.idx,
        answer: singleRootHit.item,
        via: 'root'
      };
    }

    // (j) Çok kelimeli girdide tekil invalid token (geçerli hiçbir yola eşleşmediyse)
    var invalidTokenHit = findInvalidTokenMatch(norm, idx, false);
    if (invalidTokenHit) {
      return {
        type: 'invalid',
        reason: invalidTokenHit.item.reason || 'Bu cevap geçerli değil.',
        via: 'token'
      };
    }

    // (k) Bulunamadı
    return { type: 'none' };
  }

  /**
   * Otomatik matcher birim testleri (§10.7):
   * - v1 vakaları (q01..q04)
   * - Her sorunun tests dizisi
   * - İçerik anahtarı ve token fixture (fx) testleri
   */
  function runMatcherTests() {
    var questions = root.QUESTIONS || [];
    if (!questions.length) {
      console.error('QUESTIONS dizisi bulunamadı!');
      return false;
    }

    var fx = {
      id: 'fx',
      text: 'test',
      answers: [
        { label: 'Alışverişe gitmek', share: 50, aliases: ['alışveriş'] },
        { label: 'Yemek yapmak', share: 30, aliases: ['yemek'] },
        { label: 'Dizi izlemek', share: 20, aliases: ['dizi'] }
      ],
      invalid: [{ aliases: ['uyumak'], reason: 'x' }]
    };

    var cases = [
      // v1 vakaları (q01..q04)
      { qId: 'q01', input: 'Çay', expectType: 'valid', expectLabel: 'Çay' },
      { qId: 'q01', input: 'CAY', expectType: 'valid', expectLabel: 'Çay' },
      { qId: 'q01', input: 'çaylar', expectType: 'valid', expectLabel: 'Çay' },
      { qId: 'q01', input: 'ÇAYI', expectType: 'valid', expectLabel: 'Çay' },
      { qId: 'q01', input: 'simiti', expectType: 'valid', expectLabel: 'Simit' },
      { qId: 'q01', input: 'yumurtayı', expectType: 'valid', expectLabel: 'Yumurta' },
      { qId: 'q01', input: 'menemn', expectType: 'valid', expectLabel: 'Menemen' },
      { qId: 'q01', input: 'çax', expectType: 'none' },
      { qId: 'q01', input: 'kahve', expectType: 'invalid' },
      { qId: 'q01', input: 'lahmacun', expectType: 'invalid' },

      { qId: 'q02', input: 'Maşallah çok büyümüşsün', expectType: 'valid', expectLabel: 'Maşallah çok büyümüşsün' },
      { qId: 'q02', input: 'masallah cok buyumusssun', expectType: 'valid', expectLabel: 'Maşallah çok büyümüşsün' },
      { qId: 'q02', input: 'İYİ BAYRAMLAR', expectType: 'valid', expectLabel: 'Bayramın mübarek olsun' },
      { qId: 'q02', input: 'harclik', expectType: 'valid', expectLabel: 'Al bakalım bayram harçlığı' },
      { qId: 'q02', input: 'günaydın', expectType: 'invalid' },
      { qId: 'q02', input: 'rastgele bir cümle xyz', expectType: 'none' },

      { qId: 'q03', input: 'martıya simit atmak', expectType: 'valid', expectLabel: 'Simit atmak' },
      { qId: 'q03', input: 'MARTILARA SİMİT', expectType: 'valid', expectLabel: 'Simit atmak' },
      { qId: 'q03', input: 'boğazı izlemek', expectType: 'valid', expectLabel: 'Manzara izlemek' },
      { qId: 'q03', input: 'fotograf cekmk', expectType: 'valid', expectLabel: 'Fotoğraf çekmek' },
      { qId: 'q03', input: 'yüzmek', expectType: 'invalid' },
      { qId: 'q03', input: 'balık tutmak', expectType: 'invalid' },

      { qId: 'q04', input: 'Kurtlar Vadisi', expectType: 'valid', expectLabel: 'Kurtlar Vadisi' },
      { qId: 'q04', input: 'aski memnu', expectType: 'valid', expectLabel: 'Aşk-ı Memnu' },
      { qId: 'q04', input: 'muhtsem yuzyil', expectType: 'valid', expectLabel: 'Muhteşem Yüzyıl' },
      { qId: 'q04', input: 'kizilcik serbeti', expectType: 'valid', expectLabel: 'Kızılcık Şerbeti' },
      { qId: 'q04', input: 'Behzat Ç.', expectType: 'valid', expectLabel: 'Behzat Ç.' },
      { qId: 'q04', input: 'Breaking Bad', expectType: 'invalid' },
      { qId: 'q04', input: 'Recep İvedik', expectType: 'invalid' },
      { qId: 'q04', input: 'olmayan dizi 123', expectType: 'none' },

      // Fixture (fx) vakaları (§10.7)
      { qObj: fx, input: 'alışveriş yapmak', expectType: 'valid', expectLabel: 'Alışverişe gitmek', expectVia: 'content' },
      { qObj: fx, input: 'alisverise gidiyorum', expectType: 'valid', expectLabel: 'Alışverişe gitmek', expectVia: 'content' },
      { qObj: fx, input: 'yemek yaparım', expectType: 'valid', expectLabel: 'Yemek yapmak' },
      { qObj: fx, input: 'akşam dizi izlerim', expectType: 'valid', expectLabel: 'Dizi izlemek', expectVia: 'token' },
      { qObj: fx, input: 'uyumak', expectType: 'invalid' },
      { qObj: fx, input: 'zıplamak', expectType: 'none' }
    ];

    // Her sorunun kendi tests dizisini ekle
    for (var qi = 0; qi < questions.length; qi++) {
      var qItem = questions[qi];
      var qTests = qItem.tests || [];
      for (var ti = 0; ti < qTests.length; ti++) {
        var t = qTests[ti];
        if (t.expect === 'invalid' || t.expect === 'none') {
          cases.push({ qId: qItem.id, input: t.in, expectType: t.expect });
        } else {
          cases.push({ qId: qItem.id, input: t.in, expectType: 'valid', expectLabel: t.expect });
        }
      }
    }

    var passed = 0;
    var report = [];
    var failures = [];

    for (var i = 0; i < cases.length; i++) {
      var tc = cases[i];
      var q = tc.qObj || null;
      if (!q) {
        for (var j = 0; j < questions.length; j++) {
          if (questions[j].id === tc.qId) {
            q = questions[j];
            break;
          }
        }
      }
      var res = matchAnswer(tc.input, q);
      var ok = res.type === tc.expectType;
      if (ok && tc.expectLabel) {
        ok = !!(res.answer && res.answer.label === tc.expectLabel);
      }
      if (ok && tc.expectVia) {
        ok = res.via === tc.expectVia;
      }
      if (ok && tc.expectType === 'invalid') {
        ok = typeof res.reason === 'string' && res.reason.length > 0;
      }
      if (ok) passed++;

      var row = {
        Soru: q ? q.id : tc.qId,
        Girdi: tc.input,
        Beklenen: tc.expectLabel ? tc.expectType + ':' + tc.expectLabel : tc.expectType,
        Sonuc: res.type + (res.answer ? ':' + res.answer.label : res.reason ? ':' + res.reason : '') + (res.via ? ' [' + res.via + ']' : ''),
        Durum: ok ? 'GEÇTİ' : 'KALDI'
      };
      report.push(row);
      if (!ok) {
        failures.push(row);
      }
    }

    if (typeof console.table === 'function') {
      console.table(failures.length > 0 ? failures : report.slice(0, 12));
    }
    if (failures.length > 0) {
      for (var f = 0; f < failures.length; f++) {
        console.error('TEST HATASI:', failures[f]);
      }
    }
    console.log('Matcher Testleri: ' + passed + '/' + cases.length + ' geçti.');
    return passed === cases.length;
  }

  root.Matcher = {
    normalizeTR: normalizeTR,
    toAsciiKey: toAsciiKey,
    buildKeys: buildKeys,
    stripTurkishSuffix: stripTurkishSuffix,
    getStemVariants: getStemVariants,
    levenshtein: levenshtein,
    getMaxDistance: getMaxDistance,
    matchAnswer: matchAnswer
  };
  root.runMatcherTests = runMatcherTests;
})(typeof window !== 'undefined' ? window : globalThis);
