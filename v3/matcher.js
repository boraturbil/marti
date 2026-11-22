(function (root) {
  'use strict';

  var TR_FOLD_MAP = {
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

  var GENERIC_WORDS = [
    'film', 'dizi', 'sarki', 'kitap', 'oyun', 'sehir', 'ilce', 'il', 'ulke',
    'takim', 'marka', 'meyve', 'sebze', 'corba', 'meslek', 'tarayici', 'gezegen',
    'element', 'yok', 'bilmiyorum', 'pas', 'hicbiri', 'baska', 'test'
  ];

  // Uzundan kısaya Türkçe + ASCII katlanmış çekim ekleri (en fazla 2 katman)
  var SUFFIXES = [
    'ları', 'leri', 'lari',
    'ımız', 'imiz', 'umuz', 'ümüz', 'imiz', 'umuz',
    'dan', 'den', 'tan', 'ten', 'yla', 'yle',
    'nın', 'nin', 'nun', 'nün', 'nin', 'nun',
    'mız', 'miz', 'muz', 'müz', 'miz', 'muz',
    'dır', 'dir', 'dur', 'dür', 'tır', 'tir', 'tur', 'tür', 'dir', 'dur', 'tir', 'tur',
    'lar', 'ler',
    'sı', 'si', 'su', 'sü',
    'yı', 'yi', 'yu', 'yü',
    'ya', 'ye', 'da', 'de', 'ta', 'te', 'la', 'le', 'ki',
    'ın', 'in', 'un', 'ün',
    'ım', 'im', 'um', 'üm',
    'a', 'e', 'ı', 'i', 'u', 'ü'
  ].filter(function (v, idx, arr) {
    return arr.indexOf(v) === idx;
  }).sort(function (a, b) {
    return b.length - a.length;
  });

  var SOFTENING_REVERSE = {
    'b': 'p',
    'd': 't',
    'g': 'k'
  };

  var NO_STRIP_WORDS = [
    'gelin', 'kuruyemis', 'suleymaniye', 'kolonya', 'otobus', 'safari', 'opera', 'vivaldi'
  ];

  function normalize(input) {
    if (input === null || input === undefined) return '';
    return String(input)
      .normalize('NFC')
      .replace(/[\u200B\u200D\uFEFF]/g, '')
      .replace(/\u00A0/g, ' ')
      .toLocaleLowerCase('tr-TR')
      .replace(/\u0307/g, '')
      .replace(/['’][^\s]*/g, '')
      .replace(/[.,!?;:"“”…–—()\[\]{}\-_/\\&+*=<>~`|@#%^$]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function fold(normalizedStr) {
    return String(normalizedStr || '').replace(/[çğıöşüâîû]/g, function (ch) {
      return TR_FOLD_MAP[ch] || ch;
    });
  }

  function normFold(input) {
    return fold(normalize(input));
  }

  function compact(str) {
    return String(str || '').replace(/\s+/g, '');
  }

  function charMask(str) {
    var m = 0;
    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      if (code >= 97 && code <= 122) {
        m |= (1 << (code - 97));
      } else if (code >= 48 && code <= 57) {
        m |= (1 << (26 + (code % 6)));
      }
    }
    return m >>> 0;
  }

  function popcount32(x) {
    x = x - ((x >>> 1) & 0x55555555);
    x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
    return (((x + (x >>> 4)) & 0x0F0F0F0F) * 0x01010101) >>> 24;
  }

  function stripOneLayer(word) {
    var out = [];
    if (!word || word.length < 4 || NO_STRIP_WORDS.indexOf(word) !== -1) {
      return out;
    }
    for (var i = 0; i < SUFFIXES.length; i++) {
      var sfx = SUFFIXES[i];
      var stemLen = word.length - sfx.length;
      if (stemLen < 3 || word.slice(-sfx.length) !== sfx) continue;
      if (sfx.length === 1 && stemLen < 4) continue;

      var stem = word.slice(0, -sfx.length);
      if (out.indexOf(stem) === -1) out.push(stem);

      var lastCh = stem.charAt(stem.length - 1);
      if (SOFTENING_REVERSE[lastCh]) {
        var hardened = stem.slice(0, -1) + SOFTENING_REVERSE[lastCh];
        if (out.indexOf(hardened) === -1) out.push(hardened);
      }
    }
    return out;
  }

  function getStemVariants(foldedStr) {
    var out = [];
    if (!foldedStr) return out;

    function pushU(v) {
      if (v && out.indexOf(v) === -1) out.push(v);
    }

    var words = foldedStr.split(' ');
    if (words.length === 1) {
      var l1 = stripOneLayer(foldedStr);
      for (var i = 0; i < l1.length; i++) {
        pushU(l1[i]);
        var l2 = stripOneLayer(l1[i]);
        for (var j = 0; j < l2.length; j++) {
          pushU(l2[j]);
        }
      }
    } else {
      var last = words[words.length - 1];
      var prefix = words.slice(0, -1).join(' ');
      var lastL1 = stripOneLayer(last);
      for (var k = 0; k < lastL1.length; k++) {
        pushU(prefix + ' ' + lastL1[k]);
        var lastL2 = stripOneLayer(lastL1[k]);
        for (var m = 0; m < lastL2.length; m++) {
          pushU(prefix + ' ' + lastL2[m]);
        }
      }
    }
    return out;
  }

  // Sınırlı Damerau-Levenshtein (bitişik harf değişimi = 1, maxDist aşılınca erken keser)
  function boundedLevenshtein(a, b, maxDist) {
    if (a === b) return 0;
    var la = a.length;
    var lb = b.length;
    if (Math.abs(la - lb) > maxDist) return maxDist + 1;
    if (la === 0) return lb <= maxDist ? lb : maxDist + 1;
    if (lb === 0) return la <= maxDist ? la : maxDist + 1;

    var prev2 = new Int32Array(lb + 1);
    var prev = new Int32Array(lb + 1);
    var curr = new Int32Array(lb + 1);
    for (var j = 0; j <= lb; j++) prev[j] = j;

    for (var i = 1; i <= la; i++) {
      curr[0] = i;
      var rowMin = i;
      var ca = a.charCodeAt(i - 1);
      var caPrev = i > 1 ? a.charCodeAt(i - 2) : -1;
      for (var j2 = 1; j2 <= lb; j2++) {
        var cb = b.charCodeAt(j2 - 1);
        var cost = ca === cb ? 0 : 1;
        var del = prev[j2] + 1;
        var ins = curr[j2 - 1] + 1;
        var sub = prev[j2 - 1] + cost;
        var val = del < ins ? (del < sub ? del : sub) : (ins < sub ? ins : sub);
        if (i > 1 && j2 > 1 && ca === b.charCodeAt(j2 - 2) && caPrev === cb) {
          var trans = prev2[j2 - 2] + 1;
          if (trans < val) val = trans;
        }
        curr[j2] = val;
        if (val < rowMin) rowMin = val;
      }
      if (rowMin > maxDist) return maxDist + 1;
      var tmp = prev2;
      prev2 = prev;
      prev = curr;
      curr = tmp;
    }
    return prev[lb] <= maxDist ? prev[lb] : maxDist + 1;
  }

  function extractRow(rawRow, cols) {
    if (!rawRow) return null;
    if (!Array.isArray(rawRow)) {
      return {
        label: rawRow.label || '',
        aliases: Array.isArray(rawRow.aliases) ? rawRow.aliases : [],
        year: rawRow.year !== undefined ? rawRow.year : null,
        src: rawRow.src || null,
        sl: typeof rawRow.sl === 'number' ? rawRow.sl : 0,
        f: typeof rawRow.f === 'number' ? rawRow.f : 0
      };
    }
    var c = cols || ['label', 'aliases', 'year', 'src', 'sl', 'f'];
    var obj = { label: '', aliases: [], year: null, src: null, sl: 0, f: 0 };
    for (var i = 0; i < c.length && i < rawRow.length; i++) {
      obj[c[i]] = rawRow[i];
    }
    if (!Array.isArray(obj.aliases)) obj.aliases = [];
    if (typeof obj.sl !== 'number') obj.sl = 0;
    if (typeof obj.f !== 'number') obj.f = 0;
    return obj;
  }

  function createIndex(pool, question) {
    var rawRows = Array.isArray(pool) ? pool : ((pool && pool.rows) || []);
    var cols = (!Array.isArray(pool) && pool && pool.cols) ? pool.cols : null;
    var rows = new Array(rawRows.length);

    var exactMap = new Map();
    var invalidMap = new Map();
    var buckets = new Map(); // length -> [{ key, mask }]
    var seenFuzzyKey = new Set();

    function addExactKey(key, rowIdx) {
      if (!key) return;
      var arr = exactMap.get(key);
      if (!arr) {
        exactMap.set(key, [rowIdx]);
      } else if (arr.indexOf(rowIdx) === -1) {
        arr.push(rowIdx);
      }
      if (!seenFuzzyKey.has(key) && key.length >= 4) {
        seenFuzzyKey.add(key);
        var b = buckets.get(key.length);
        if (!b) {
          b = [];
          buckets.set(key.length, b);
        }
        b.push({ key: key, mask: charMask(key) });
      }
    }

    for (var i = 0; i < rawRows.length; i++) {
      var r = extractRow(rawRows[i], cols);
      rows[i] = r;
      if (!r || !r.label) continue;

      var lblKey = normFold(r.label);
      r._normLabel = lblKey;
      addExactKey(lblKey, i);
      var lblCompact = compact(lblKey);
      if (lblCompact && lblCompact !== lblKey) addExactKey(lblCompact, i);

      // f & 8 = alias incelemede (oyunda kullanılmaz)
      if (!(r.f & 8)) {
        for (var a = 0; a < r.aliases.length; a++) {
          var aKey = normFold(r.aliases[a]);
          if (!aKey) continue;
          addExactKey(aKey, i);
          var aCompact = compact(aKey);
          if (aCompact && aCompact !== aKey) addExactKey(aCompact, i);
        }
      }
    }

    // Genel kara liste + soru invalid grupları
    for (var g = 0; g < GENERIC_WORDS.length; g++) {
      invalidMap.set(GENERIC_WORDS[g], 'Belirli bir ad yazmalısın.');
    }

    var invList = (question && Array.isArray(question.invalid)) ? question.invalid : [];
    for (var ii = 0; ii < invList.length; ii++) {
      var grp = invList[ii];
      if (!grp || !Array.isArray(grp.aliases)) continue;
      var reason = grp.reason || 'Bu cevap bu soru için geçerli değil.';
      for (var ai = 0; ai < grp.aliases.length; ai++) {
        var ik = normFold(grp.aliases[ai]);
        if (ik) {
          invalidMap.set(ik, reason);
          var ikc = compact(ik);
          if (ikc && ikc !== ik) invalidMap.set(ikc, reason);
        }
      }
    }

    return {
      rows: rows,
      exactMap: exactMap,
      invalidMap: invalidMap,
      buckets: buckets,
      size: rows.length
    };
  }

  function pickHomonym(indices, rows, qFold) {
    if (indices.length === 1) return { index: indices[0], homonyms: 1 };
    var bestIdx = indices[0];
    var bestSl = -Infinity;
    for (var i = 0; i < indices.length; i++) {
      var idx = indices[i];
      var r = rows[idx];
      if (r._normLabel === qFold) {
        return { index: idx, homonyms: indices.length };
      }
      if ((r.sl || 0) > bestSl) {
        bestSl = r.sl || 0;
        bestIdx = idx;
      }
    }
    return { index: bestIdx, homonyms: indices.length };
  }

  function matchAnswer(input, index) {
    var qNorm = normalize(input);
    var qFold = fold(qNorm);
    if (!qFold) {
      return { status: 'yok', type: 'none', canReport: false };
    }
    var qComp = compact(qFold);

    // 1. Tam anahtar (boşluklu / boşluksuz)
    var exactHits = index.exactMap.get(qFold) || (qComp !== qFold ? index.exactMap.get(qComp) : null);
    if (exactHits && exactHits.length > 0) {
      var picked = pickHomonym(exactHits, index.rows, qFold);
      var row = index.rows[picked.index];
      return {
        status: 'eslesti',
        type: 'valid',
        row: row,
        rowIndex: picked.index,
        label: row.label,
        fuzzy: false,
        homonyms: picked.homonyms
      };
    }

    // 2. Invalid tam anahtar
    var invReason = index.invalidMap.get(qFold) || (qComp !== qFold ? index.invalidMap.get(qComp) : null);
    if (invReason) {
      return {
        status: 'gecersiz',
        type: 'invalid',
        reason: invReason
      };
    }

    // 3. Ek soyma (en çok 2 katman, kök >= 3, ünsüz yumuşaması geri alma)
    var stems = getStemVariants(qFold);
    for (var s = 0; s < stems.length; s++) {
      var st = stems[s];
      var stComp = compact(st);
      var stemHits = index.exactMap.get(st) || (stComp !== st ? index.exactMap.get(stComp) : null);
      if (stemHits && stemHits.length > 0) {
        var sPicked = pickHomonym(stemHits, index.rows, st);
        var sRow = index.rows[sPicked.index];
        return {
          status: 'eslesti',
          type: 'valid',
          row: sRow,
          rowIndex: sPicked.index,
          label: sRow.label,
          fuzzy: false,
          via: 'stem',
          homonyms: sPicked.homonyms
        };
      }
      var stemInv = index.invalidMap.get(st);
      if (stemInv) {
        return { status: 'gecersiz', type: 'invalid', reason: stemInv };
      }
    }

    // 4. Sınırlı bulanık eşleşme (§5.2) -> "onay iste" (otomatik kabul YOK)
    var len = qFold.length;
    var maxDist = 0;
    if (len >= 5 && len <= 7) maxDist = 1;
    else if (len >= 8) maxDist = index.size > 2000 ? 1 : 2;

    if (maxDist > 0) {
      var qMask = charMask(qFold);
      var maxBitDiff = maxDist * 2;
      var bestDist = maxDist + 1;
      var secondDist = maxDist + 2;
      var bestRowIdx = -1;
      var tieOnBest = false;

      for (var l = len - maxDist; l <= len + maxDist; l++) {
        var bucket = index.buckets.get(l);
        if (!bucket) continue;
        for (var bi = 0; bi < bucket.length; bi++) {
          var cand = bucket[bi];
          if (popcount32(qMask ^ cand.mask) > maxBitDiff) continue;
          var dist = boundedLevenshtein(qFold, cand.key, maxDist);
          if (dist > maxDist) continue;

          var candRows = index.exactMap.get(cand.key);
          var candRowIdx = candRows && candRows.length > 0 ? candRows[0] : -1;
          if (candRowIdx < 0) continue;

          if (dist < bestDist) {
            secondDist = bestDist;
            bestDist = dist;
            bestRowIdx = candRowIdx;
            tieOnBest = false;
          } else if (dist === bestDist) {
            if (candRowIdx !== bestRowIdx) {
              tieOnBest = true;
              secondDist = dist;
            }
          } else if (dist < secondDist) {
            secondDist = dist;
          }
        }
      }

      if (bestRowIdx >= 0 && !tieOnBest && secondDist >= bestDist + 1) {
        // En iyi aday bir invalid anahtarına da aynı yakınlıktaysa -> yok
        var invConflict = false;
        index.invalidMap.forEach(function (_, invKey) {
          if (invConflict) return;
          if (Math.abs(invKey.length - len) <= bestDist) {
            if (boundedLevenshtein(qFold, invKey, bestDist) <= bestDist) {
              invConflict = true;
            }
          }
        });

        if (!invConflict) {
          var fRow = index.rows[bestRowIdx];
          return {
            status: 'onay_iste',
            type: 'confirm',
            row: fRow,
            rowIndex: bestRowIdx,
            suggestion: fRow.label,
            label: fRow.label,
            fuzzy: true,
            distance: bestDist
          };
        }
      }
    }

    return {
      status: 'yok',
      type: 'none',
      newerThanAsOf: false,
      canReport: true
    };
  }

  var matcher = {
    normalize: normalize,
    fold: fold,
    normFold: normFold,
    compact: compact,
    getStemVariants: getStemVariants,
    boundedLevenshtein: boundedLevenshtein,
    createIndex: createIndex,
    matchAnswer: matchAnswer
  };

  root.PUSULLA = root.PUSULLA || {};
  root.PUSULLA.matcher = matcher;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = matcher;
  }
})(typeof window !== 'undefined' ? window : globalThis);
