(function (root) {
  'use strict';

  var pool = {
    id: 'fx_tarayici',
    asOf: '2026-11',
    closed: false,
    yearKind: 'ilk-genel-surum',
    sources: ['fixture'],
    license: ['fixture'],
    cols: ['label', 'aliases', 'year', 'src', 'sl', 'f'],
    rows: [
      ['WorldWideWeb', ['nexus'], 1990, 'm', 42, 2],
      ['Lynx', ['lynx browser'], 1992, 'm', 35, 2],
      ['Mosaic', ['ncsa mosaic'], 1993, 'm', 45, 2],
      ['Netscape', ['netscape navigator'], 1994, 'm', 58, 2],
      ['Opera', ['opera browser'], 1995, 'm', 64, 2],
      ['Internet Explorer', ['msie'], 1995, 'm', 72, 2],
      ['IE', ['ie6', 'ie11'], 1995, 'm', 40, 2],
      ['Mozilla Firefox', ['mozilla', 'fx'], 2002, 'm', 78, 2],
      ['Firefox', ['ff'], 2004, 'm', 75, 2],
      ['Safari', ['apple safari'], 2003, 'm', 68, 2],
      ['Google Chrome', ['google chrome browser'], 2008, 'm', 88, 2],
      ['Chrome', ['krom', 'chrome browser'], 2008, 'm', 85, 2],
      ['Edge', ['microsoft edge'], 2015, 'm', 62, 2],
      ['Vivaldi', ['vivaldi browser'], 2016, 'm', 38, 2],
      ['Brave', ['brave browser'], 2016, 'm', 46, 2]
    ]
  };

  var question = {
    id: 'fx_tarayici_01',
    cat: 'teknoloji',
    subject: 'WEB TARAYICI',
    text: 'Bir tane WEB TARAYICI söyle.',
    scope: '1990–2026',
    pool: 'fx_tarayici',
    closed: false,
    yearKind: 'ilk-genel-surum',
    share: {
      estimated: true,
      by: 'fixture-2026-11',
      list: [
        ['Chrome', 30.0],
        ['Google Chrome', 20.0],
        ['Safari', 14.0],
        ['Firefox', 10.0],
        ['Edge', 9.0],
        ['Opera', 6.5],
        ['Internet Explorer', 4.5],
        ['Mozilla Firefox', 2.5],
        ['Brave', 1.8],
        ['Vivaldi', 1.0],
        ['Netscape', 0.7]
      ]
    },
    invalid: [
      { aliases: ['google', 'yandex', 'bing', 'duckduckgo'], reason: 'Bu bir arama motoru, web tarayıcı değil.' },
      { aliases: ['windows', 'linux', 'macos', 'android'], reason: 'Bu bir işletim sistemi, web tarayıcı değil.' }
    ]
  };

  var data = { pool: pool, question: question };
  root.PUSULLA_FIXTURES = root.PUSULLA_FIXTURES || {};
  root.PUSULLA_FIXTURES.tarayici = data;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = data;
  }
})(typeof window !== 'undefined' ? window : globalThis);
