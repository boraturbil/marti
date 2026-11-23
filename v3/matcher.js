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

  var GENERAL_SUBJECT_SUFFIXES = [
    'milli takimi', 'milli takim',
    'cuce gezegeni', 'cuce gezegen',
    'isletim sistemi', 'programlama dili', 'sosyal medyasi', 'sosyal medya platformu',
    'oyun konsolu', 'spor dali', 'para birimi', 'uzay sondasi', 'sinan yapisi',
    'telefon markasi', 'otomobil markasi', 'turk markasi', 'havayolu sirketi',
    'turk filmi', 'turk dizisi', 'dunya sehri', 'super lig takimi',
    'gezegeni', 'gezegen', 'sehri', 'sehir', 'ilcesi', 'ilce', 'ili', 'il',
    'elementi', 'element', 'corbasi', 'corba', 'filmi', 'film', 'dizisi', 'dizi',
    'takimi', 'takim', 'tarayicisi', 'tarayici', 'oyunu', 'oyun', 'markasi', 'marka',
    'sirketi', 'sirket', 'dili', 'dil', 'konsolu', 'konsol', 'sarkisi', 'sarki',
    'padisahi', 'padisah', 'baskenti', 'baskent', 'ulkesi', 'ulke', 'sondasi', 'sonda',
    'uydusu', 'uydu', 'muzesi', 'muze', 'yapisi', 'yapi', 'meyvesi', 'meyve',
    'sebzesi', 'sebze', 'tatlisi', 'tatli', 'hayvani', 'hayvan', 'meslegi', 'meslek',
    'icadi', 'icat', 'belediyesi', 'belediye', 'kahvaltiligi', 'kahvaltilik',
    'cumhurbaskani', 'genel sekreteri'
  ];

  // Havuz adının sonundaki TÜR kelimesi (katlanmış). Oyuncu yalnız adı yazınca da eşleşsin:
  // "Muradiye Camii" ← "muradiye", "Klasik müzik" ← "klasik", "Sokollu Mehmed Paşa Köprüsü" ← "sokollu mehmed pasa".
  // İndekste ek anahtar olarak eklenir (label/alias'tan); uzundan kısaya, tek katman.
  var HEAD_WORDS = [
    // yapı ve yer
    'camii', 'camisi', 'cami', 'mescidi', 'kulliyesi', 'kulliye', 'medresesi', 'medrese', 'hamami', 'hamam',
    'koprusu', 'kopru', 'kervansarayi', 'kervansaray', 'turbesi', 'turbe', 'sarayi', 'saray', 'kasri', 'kosku',
    'kalesi', 'kale', 'kulesi', 'kule', 'cesmesi', 'sebili', 'imareti', 'darussifasi', 'bedesteni', 'carsisi',
    'kilisesi', 'kilise', 'sinagogu', 'katedrali', 'bazilikasi', 'manastiri', 'muzesi', 'muze', 'parki', 'meydani',
    'milli parki', 'tabiat parki', 'adasi', 'golu', 'dagi', 'nehri', 'irmagi', 'bogazi', 'korfezi', 'stadyumu', 'stadi', 'universitesi',
    'kutuphanesi', 'tiyatrosu', 'istasyonu', 'havalimani', 'limani',
    // kültür, yemek, kurum
    'muzigi', 'muzik', 'muzikleri', 'dansi', 'corbasi', 'tatlisi', 'kebabi', 'boregi', 'pilavi', 'salatasi',
    'dolmasi', 'sarmasi', 'helvasi', 'peyniri', 'ekmegi', 'spor kulubu', 'futbol kulubu', 'kulubu', 'partisi',
    'gazetesi', 'bankasi', 'holding', 'isletim sistemi', 'programlama dili'
  ].sort(function (a, b) { return b.length - a.length; });
  var HEAD_NATIONAL_PREFIXES = ['turk'];
  // Eser adlarında (film, dizi, şarkı, oyun, kitap) baştaki kelime adın parçasıdır: tür/virgül kısaltması YAPILMAZ.
  var NO_HEAD_POOL_RE = /(film|dizi|sarki|oyun|pixar|kitap|album|roman)/;

  // Bir indeks anahtarından "tür kelimesi atılmış" ek anahtarlar üretir.
  function headStrippedKeys(key) {
    var out = [];
    if (!key) return out;
    var bases = [key];
    var comma = key.indexOf(',');
    if (comma > 0) bases.push(key.slice(0, comma).trim());
    var paren = key.indexOf('(');
    if (paren > 0) bases.push(key.slice(0, paren).trim());
    for (var b = 0; b < bases.length; b++) {
      var base = bases[b].replace(/[,()]/g, ' ').replace(/\s+/g, ' ').trim();
      if (base !== key && out.indexOf(base) === -1) out.push(base);
      for (var h = 0; h < HEAD_WORDS.length; h++) {
        var needle = ' ' + HEAD_WORDS[h];
        if (base.length > needle.length && base.slice(-needle.length) === needle) {
          var rest = base.slice(0, -needle.length).trim();
          if (rest && out.indexOf(rest) === -1) out.push(rest);
          for (var p = 0; p < HEAD_NATIONAL_PREFIXES.length; p++) {
            var pre = HEAD_NATIONAL_PREFIXES[p] + ' ';
            if (rest.length > pre.length && rest.slice(0, pre.length) === pre) {
              var core = rest.slice(pre.length).trim();
              if (core && out.indexOf(core) === -1) out.push(core);
            }
          }
          break;
        }
      }
    }
    return out;
  }

  var POOL_SUFFIXES = {
    gezegen: ['cuce gezegeni', 'cuce gezegen', 'gezegeni', 'gezegen'],
    baskent: ['baskenti', 'baskent', 'sehri', 'sehir'],
    dunya_sehri: ['dunya sehri', 'sehri', 'sehir'],
    olimpiyat_sehri: ['olimpiyat sehri', 'sehri', 'sehir'],
    ist_ilce: ['ilcesi', 'ilce', 'belediyesi', 'belediye'],
    tr_il: ['ili', 'il', 'sehri', 'sehir'],
    ulke: ['ulkesi', 'ulke', 'devleti', 'devlet'],
    element: ['elementi', 'element', 'atomu'],
    corba: ['corbasi', 'corba'],
    film: ['filmi', 'film'],
    turk_filmi: ['turk filmi', 'filmi', 'film'],
    pixar: ['pixar filmi', 'filmi', 'film'],
    turk_dizisi: ['turk dizisi', 'dizisi', 'dizi'],
    dk_sampiyon: ['milli takimi', 'milli takim', 'takimi', 'takim'],
    super_lig: ['futbol takimi', 'spor kulubu', 'takimi', 'takim', 'kulubu'],
    tarayici: ['web tarayicisi', 'tarayicisi', 'tarayici'],
    video_oyunu: ['video oyunu', 'oyunu', 'oyun'],
    turk_markasi: ['turk markasi', 'markasi', 'marka', 'sirketi'],
    telefon_markasi: ['telefon markasi', 'markasi', 'marka'],
    otomobil_markasi: ['otomobil markasi', 'araba markasi', 'markasi', 'marka'],
    havayolu: ['havayolu sirketi', 'havayollari', 'havayolu', 'sirketi'],
    sosyal_medya: ['sosyal medya platformu', 'sosyal medyasi', 'platformu', 'uygulamasi'],
    prog_dili: ['programlama dili', 'yazilim dili', 'dili', 'dil'],
    isletim_sistemi: ['isletim sistemi', 'sistemi'],
    oyun_konsolu: ['oyun konsolu', 'konsolu', 'konsol'],
    sarki: ['sarkisi', 'sarki', 'parcasi'],
    osmanli_padisahi: ['osmanli padisahi', 'padisahi', 'padisah', 'sultani'],
    cumhurbaskani: ['cumhurbaskani'],
    bm_genel_sekreter: ['genel sekreteri', 'bm genel sekreteri'],
    uzay_sondasi: ['uzay sondasi', 'uzay araci', 'sondasi', 'sonda'],
    gunes_uydu: ['uydusu', 'uydu'],
    ist_muze: ['muzesi', 'muze'],
    sinan_yapisi: ['sinan yapisi', 'yapisi', 'eseri'],
    meyve: ['meyvesi', 'meyve'],
    sebze: ['sebzesi', 'sebze'],
    tatli: ['tatlisi', 'tatli'],
    hayvan: ['hayvani', 'hayvan'],
    meslek: ['meslegi', 'meslek'],
    spor_dali: ['spor dali', 'sporu', 'dali'],
    para_birimi: ['para birimi', 'birimi'],
    icat: ['icadi', 'icat'],
    kahvaltilik: ['kahvaltiligi', 'kahvaltilik']
  };

  var POOL_PREFIXES = {
    ist_ilce: ['istanbul ilcesi', 'istanbul'],
    ist_muze: ['istanbul muzesi', 'istanbul'],
    tr_il: ['turkiye ili', 'turkiye'],
    gezegen: ['gunes sistemi', 'gezegen'],
    dk_sampiyon: ['dunya kupasi', 'milli takim'],
    super_lig: ['super lig'],
    sinan_yapisi: ['mimar sinan'],
    osmanli_padisahi: ['osmanli padisahi', 'osmanli'],
    cumhurbaskani: ['turkiye cumhurbaskani', 'turkiye'],
    pixar: ['pixar'],
    turk_markasi: ['turk markasi'],
    turk_filmi: ['turk filmi'],
    turk_dizisi: ['turk dizisi']
  };

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
    var headMap = new Map(); // tür kelimesi atılmış kısa adlar (ek soymaya kapalı, < 5 harf)
    var invalidMap = new Map();
    var buckets = new Map(); // length -> [{ key, mask }]
    var seenFuzzyKey = new Set();

    function addExactKey(key, rowIdx, noFuzzy) {
      if (!key) return;
      var arr = exactMap.get(key);
      if (!arr) {
        exactMap.set(key, [rowIdx]);
      } else if (arr.indexOf(rowIdx) === -1) {
        arr.push(rowIdx);
      }
      if (!noFuzzy && !seenFuzzyKey.has(key) && key.length >= 4) {
        seenFuzzyKey.add(key);
        var b = buckets.get(key.length);
        if (!b) {
          b = [];
          buckets.set(key.length, b);
        }
        b.push({ key: key, mask: charMask(key) });
      }
    }

    function addHeadKey(key, rowIdx, noFuzzy) {
      if (!key || exactMap.has(key)) return; // gerçek ad/alias önceliklidir
      var arr = headMap.get(key);
      if (!arr) headMap.set(key, [rowIdx]); else if (arr.indexOf(rowIdx) === -1) arr.push(rowIdx);
      if (!noFuzzy && !seenFuzzyKey.has(key) && key.length >= 4) {
        seenFuzzyKey.add(key);
        var hb = buckets.get(key.length);
        if (!hb) { hb = []; buckets.set(key.length, hb); }
        hb.push({ key: key, mask: charMask(key) });
      }
    }
    var headPending = []; // [anahtar, satır] — tür kelimesi atılmış ek anahtarlar
    var headPoolId = (question && question.pool) || (!Array.isArray(pool) && pool && pool.id) || '';
    var headsOn = !NO_HEAD_POOL_RE.test(headPoolId);
    function queueHeads(key, rowIdx) {
      if (!headsOn) return;
      var hs = headStrippedKeys(key);
      for (var hh = 0; hh < hs.length; hh++) headPending.push([hs[hh], rowIdx]);
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
      queueHeads(lblKey, i);
      // "Osman Şah Camii, Tırhala" / "X (Y)": virgül/parantezden önceki ad da anahtar olsun (normalize virgülü siler)
      var rawBase = String(r.label).split(/[,(]/)[0];
      if (headsOn && rawBase !== r.label) {
        var baseKey = normFold(rawBase);
        if (baseKey && baseKey !== lblKey) { headPending.push([baseKey, i]); queueHeads(baseKey, i); }
      }

      // f & 8 = alias incelemede (oyunda kullanılmaz)
      if (!(r.f & 8)) {
        for (var a = 0; a < r.aliases.length; a++) {
          var aKey = normFold(r.aliases[a]);
          if (!aKey) continue;
          addExactKey(aKey, i);
          var aCompact = compact(aKey);
          if (aCompact && aCompact !== aKey) addExactKey(aCompact, i);
          queueHeads(aKey, i);
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

    // Tür kelimesi atılmış anahtarlar: geçersiz/genel kelimeyi ezmez, en az 3 harf, kısa olanlar bulanığa girmez
    for (var hp = 0; hp < headPending.length; hp++) {
      var hk = headPending[hp][0];
      var hkc = compact(hk);
      if (hkc.length < 3 || !/[a-z]{3,}/.test(hkc)) continue;
      if (GENERIC_WORDS.indexOf(hk) !== -1 || invalidMap.has(hk) || invalidMap.has(hkc)) continue;
      addHeadKey(hk, headPending[hp][1], hk.length < 6);
      if (hkc !== hk) addHeadKey(hkc, headPending[hp][1], true);
    }

    return {
      rows: rows,
      exactMap: exactMap,
      headMap: headMap,
      invalidMap: invalidMap,
      buckets: buckets,
      size: rows.length,
      poolId: (question && question.pool) || (!Array.isArray(pool) && pool && pool.id) || '',
      subject: (question && question.subject) || ''
    };
  }

  function hasEnoughLetters(str) {
    var comp = compact(str);
    return comp.length >= 2 && /[a-z0-9]{2,}/.test(comp);
  }

  function getActiveSuffixes(poolId, subjectFold) {
    if (poolId && POOL_SUFFIXES[poolId]) return POOL_SUFFIXES[poolId];
    if (subjectFold) {
      var keys = Object.keys(POOL_SUFFIXES);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (subjectFold.indexOf(k.replace(/_/g, ' ')) !== -1) {
          return POOL_SUFFIXES[k];
        }
      }
      var kwMap = [
        ['ilce', 'ist_ilce'],
        ['baskent', 'baskent'],
        ['sehir', 'dunya_sehri'],
        ['sehri', 'dunya_sehri'],
        ['gezegen', 'gezegen'],
        ['element', 'element'],
        ['corba', 'corba'],
        ['tarayici', 'tarayici'],
        ['dizi', 'turk_dizisi'],
        ['film', 'film'],
        ['sampiyon', 'dk_sampiyon'],
        ['takim', 'super_lig'],
        ['ulke', 'ulke'],
        ['sarki', 'sarki'],
        ['padisah', 'osmanli_padisahi'],
        ['oyun', 'video_oyunu'],
        ['konsol', 'oyun_konsolu'],
        ['isletim', 'isletim_sistemi'],
        ['marka', 'turk_markasi'],
        ['havayolu', 'havayolu'],
        ['meyve', 'meyve'],
        ['sebze', 'sebze'],
        ['tatli', 'tatli'],
        ['hayvan', 'hayvan'],
        ['meslek', 'meslek'],
        ['spor', 'spor_dali'],
        ['para', 'para_birimi']
      ];
      for (var ki = 0; ki < kwMap.length; ki++) {
        if (subjectFold.indexOf(kwMap[ki][0]) !== -1) {
          return POOL_SUFFIXES[kwMap[ki][1]];
        }
      }
    }
    return GENERAL_SUBJECT_SUFFIXES;
  }

  function getActivePrefixes(poolId, subjectFold) {
    var list = [];
    if (subjectFold) {
      list.push(subjectFold);
      var sp = subjectFold.split(' ');
      if (sp.length > 1 && sp[0].length >= 3) list.push(sp[0]);
    }
    if (poolId && POOL_PREFIXES[poolId]) {
      var pp = POOL_PREFIXES[poolId];
      for (var i = 0; i < pp.length; i++) {
        if (list.indexOf(pp[i]) === -1) list.push(pp[i]);
      }
    }
    return list;
  }

  function buildStrippedCandidates(rawInput, qFold, poolId, subject) {
    var out = [];
    function pushCand(c) {
      if (!c || c === qFold) return;
      if (!hasEnoughLetters(c)) return;
      if (GENERIC_WORDS.indexOf(c) !== -1) return;
      if (out.indexOf(c) === -1) out.push(c);
    }

    var baseList = [qFold];
    var rawStr = rawInput === null || rawInput === undefined ? '' : String(rawInput);
    if (rawStr.indexOf('(') !== -1 && rawStr.indexOf(')') !== -1) {
      var noParen = normFold(rawStr.replace(/\([^)]*\)/g, ' '));
      if (noParen && noParen !== qFold) {
        pushCand(noParen);
        baseList.push(noParen);
      }
    }

    var subjectFold = subject ? normFold(subject) : '';
    var suffixes = getActiveSuffixes(poolId, subjectFold);
    var prefixes = getActivePrefixes(poolId, subjectFold);

    for (var bi = 0; bi < baseList.length; bi++) {
      var base = baseList[bi];
      var afterSuffix = null;

      for (var si = 0; si < suffixes.length; si++) {
        var sfx = suffixes[si];
        var needle = ' ' + sfx;
        if (base.length > needle.length && base.slice(-needle.length) === needle) {
          var cand = base.slice(0, -needle.length).trim();
          if (hasEnoughLetters(cand)) {
            pushCand(cand);
            if (!afterSuffix) afterSuffix = cand;
          }
          break;
        }
      }

      for (var pi = 0; pi < prefixes.length; pi++) {
        var pfx = prefixes[pi];
        var pNeedle = pfx + ' ';
        if (base.length > pNeedle.length && base.slice(0, pNeedle.length) === pNeedle) {
          pushCand(base.slice(pNeedle.length).trim());
        }
        if (afterSuffix && afterSuffix.length > pNeedle.length && afterSuffix.slice(0, pNeedle.length) === pNeedle) {
          pushCand(afterSuffix.slice(pNeedle.length).trim());
        }
      }
    }

    return out;
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

  function tryExactInvalidStem(key, index, viaTag) {
    var comp = compact(key);

    // 1. Tam anahtar (boşluklu / boşluksuz)
    var hm = index.headMap;
    var exactHits = index.exactMap.get(key) || (comp !== key ? index.exactMap.get(comp) : null) ||
      (hm ? (hm.get(key) || (comp !== key ? hm.get(comp) : null)) : null);
    if (exactHits && exactHits.length > 0) {
      var picked = pickHomonym(exactHits, index.rows, key);
      var row = index.rows[picked.index];
      var res = {
        status: 'eslesti',
        type: 'valid',
        row: row,
        rowIndex: picked.index,
        label: row.label,
        fuzzy: false,
        homonyms: picked.homonyms
      };
      if (viaTag) res.via = viaTag;
      return res;
    }

    // 2. Invalid tam anahtar
    var invReason = index.invalidMap.get(key) || (comp !== key ? index.invalidMap.get(comp) : null);
    if (invReason) {
      return {
        status: 'gecersiz',
        type: 'invalid',
        reason: invReason
      };
    }

    // 3. Ek soyma (en çok 2 katman, kök >= 3, ünsüz yumuşaması geri alma)
    var stems = getStemVariants(key);
    for (var s = 0; s < stems.length; s++) {
      var st = stems[s];
      var stComp = compact(st);
      var stemHits = index.exactMap.get(st) || (stComp !== st ? index.exactMap.get(stComp) : null) ||
        (hm && stComp.length >= 5 ? (hm.get(st) || (stComp !== st ? hm.get(stComp) : null)) : null);
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
          via: viaTag ? (viaTag + '+stem') : 'stem',
          homonyms: sPicked.homonyms
        };
      }
      var stemInv = index.invalidMap.get(st);
      if (stemInv) {
        return { status: 'gecersiz', type: 'invalid', reason: stemInv };
      }
    }

    return null;
  }

  function tryFuzzy(qFold, index) {
    var len = qFold.length;
    var maxDist = 0;
    if (len >= 5 && len <= 7) maxDist = 1;
    else if (len >= 8) maxDist = index.size > 2000 ? 1 : 2;
    if (maxDist <= 0) return null;

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

        var candRows = index.exactMap.get(cand.key) || (index.headMap ? index.headMap.get(cand.key) : null);
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
    return null;
  }

  function matchAnswer(input, index, opts) {
    var qNorm = normalize(input);
    var qFold = fold(qNorm);
    if (!qFold) {
      return { status: 'yok', type: 'none', canReport: false };
    }

    // 1-3. Tam, invalid, ek soyma
    var direct = tryExactInvalidStem(qFold, index, null);
    if (direct) return direct;

    // 3b. Parantez + konu eki/oneki soyma
    var poolId = (opts && opts.poolId) || index.poolId || '';
    var subject = (opts && opts.subject) || index.subject || '';
    var strippedList = buildStrippedCandidates(input, qFold, poolId, subject);
    for (var ci = 0; ci < strippedList.length; ci++) {
      var subRes = tryExactInvalidStem(strippedList[ci], index, 'subject');
      if (subRes) return subRes;
    }

    // 4. Sınırlı bulanık eşleşme (§5.2) -> "onay iste" (otomatik kabul YOK)
    var fuzzyDirect = tryFuzzy(qFold, index);
    if (fuzzyDirect) return fuzzyDirect;

    for (var fi = 0; fi < strippedList.length; fi++) {
      if (strippedList[fi].length >= 5) {
        var fuzzySub = tryFuzzy(strippedList[fi], index);
        if (fuzzySub) return fuzzySub;
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
