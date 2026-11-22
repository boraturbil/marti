(function (root) {
  'use strict';

  var pool = {
    id: 'fx_ilce_39',
    asOf: '2026-11',
    closed: true,
    expect: 39,
    yearKind: 'kurulus',
    sources: ['fixture'],
    license: ['fixture'],
    cols: ['label', 'aliases', 'year', 'src', 'sl', 'f'],
    rows: [
      ['Adalar', ['prens adaları'], 1923, 'm', 38, 2],
      ['Arnavutköy', [], 2008, 'm', 22, 2],
      ['Ataşehir', [], 2008, 'm', 26, 2],
      ['Avcılar', [], 1992, 'm', 24, 2],
      ['Bağcılar', [], 1992, 'm', 25, 2],
      ['Bahçelievler', [], 1992, 'm', 23, 2],
      ['Bakırköy', [], 1926, 'm', 34, 2],
      ['Başakşehir', [], 2008, 'm', 24, 2],
      ['Bayrampaşa', [], 1990, 'm', 22, 2],
      ['Beşiktaş', [], 1930, 'm', 45, 2],
      ['Beykoz', [], 1930, 'm', 30, 2],
      ['Beylikdüzü', [], 2008, 'm', 25, 2],
      ['Beyoğlu', ['pera'], 1926, 'm', 44, 2],
      ['Büyükçekmece', [], 1987, 'm', 24, 2],
      ['Çatalca', [], 1926, 'm', 21, 2],
      ['Çekmeköy', [], 2008, 'm', 20, 2],
      ['Esenler', [], 1993, 'm', 21, 2],
      ['Esenyurt', [], 2008, 'm', 27, 2],
      ['Eyüpsultan', ['eyüp'], 1936, 'm', 35, 2],
      ['Fatih', [], 1926, 'm', 42, 2],
      ['Gaziosmanpaşa', ['gop'], 1963, 'm', 24, 2],
      ['Güngören', [], 1992, 'm', 20, 2],
      ['Kadıköy', [], 1930, 'm', 48, 2],
      ['Kağıthane', [], 1987, 'm', 23, 2],
      ['Kartal', [], 1926, 'm', 28, 2],
      ['Küçükçekmece', [], 1987, 'm', 26, 2],
      ['Maltepe', [], 1992, 'm', 27, 2],
      ['Pendik', [], 1987, 'm', 27, 2],
      ['Sancaktepe', [], 2008, 'm', 19, 2],
      ['Sarıyer', [], 1930, 'm', 33, 2],
      ['Silivri', [], 1926, 'm', 24, 2],
      ['Sultanbeyli', [], 1992, 'm', 18, 2],
      ['Sultangazi', [], 2008, 'm', 16, 2],
      ['Şile', [], 1926, 'm', 22, 2],
      ['Şişli', [], 1954, 'm', 36, 2],
      ['Tuzla', [], 1992, 'm', 24, 2],
      ['Ümraniye', [], 1987, 'm', 28, 2],
      ['Üsküdar', [], 1926, 'm', 41, 2],
      ['Zeytinburnu', [], 1957, 'm', 25, 2]
    ]
  };

  // Kapalı küme: 39 ilçe, toplam pay = 100.0
  var shareList = [
    ['Kadıköy', 11.5], ['Beşiktaş', 9.5], ['Üsküdar', 8.0], ['Şişli', 6.5],
    ['Fatih', 6.0], ['Beyoğlu', 5.5], ['Bakırköy', 5.0], ['Sarıyer', 4.0],
    ['Ataşehir', 3.5], ['Maltepe', 3.2], ['Kartal', 2.8], ['Pendik', 2.5],
    ['Ümraniye', 2.5], ['Beykoz', 2.2], ['Esenyurt', 2.2], ['Bağcılar', 2.0],
    ['Bahçelievler', 2.0], ['Küçükçekmece', 1.8], ['Başakşehir', 1.7], ['Eyüpsultan', 1.7],
    ['Zeytinburnu', 1.5], ['Avcılar', 1.4], ['Beylikdüzü', 1.4], ['Gaziosmanpaşa', 1.3],
    ['Kağıthane', 1.3], ['Tuzla', 1.2], ['Büyükçekmece', 1.1], ['Bayrampaşa', 1.0],
    ['Esenler', 0.9], ['Güngören', 0.8], ['Adalar', 0.7], ['Silivri', 0.7],
    ['Şile', 0.6], ['Çekmeköy', 0.4], ['Sancaktepe', 0.4], ['Arnavutköy', 0.3],
    ['Sultanbeyli', 0.3], ['Sultangazi', 0.3], ['Çatalca', 0.3]
  ];

  var question = {
    id: 'fx_ilce_01',
    cat: 'turkiye',
    subject: 'İSTANBUL İLÇESİ',
    text: 'Bir tane İSTANBUL İLÇESİ söyle.',
    scope: 'İstanbul’un 39 ilçesi (2026-11)',
    pool: 'fx_ilce_39',
    closed: true,
    expect: 39,
    authority: 'İçişleri / trwiki İstanbul’un ilçeleri',
    yearKind: 'kurulus',
    share: {
      estimated: true,
      by: 'fixture-2026-11',
      list: shareList
    },
    invalid: [
      { aliases: ['taksim', 'levent', 'nişantaşı', 'bebek', 'moda'], reason: 'Bu bir semt/mahalle, ilçe değil.' },
      { aliases: ['gebze', 'izmit', 'çorlu', 'ankara', 'izmir'], reason: 'İstanbul ilçesi değil.' }
    ]
  };

  var data = { pool: pool, question: question };
  root.PUSULLA_FIXTURES = root.PUSULLA_FIXTURES || {};
  root.PUSULLA_FIXTURES.ilce_39 = data;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = data;
  }
})(typeof window !== 'undefined' ? window : globalThis);
