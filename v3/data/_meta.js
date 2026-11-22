(function (root) {
  'use strict';

  var YEAR_KINDS = {
    'kurulus':          { label: 'Kuruluş yılı',       approxNote: 'Yaklaşık kuruluş tarihi' },
    'ilk-genel-surum':  { label: 'İlk genel sürüm',   approxNote: 'Yaklaşık ilk genel sürüm yılı' },
    'vizyon':           { label: 'Vizyon yılı',        approxNote: 'Yaklaşık ilk gösterim yılı' },
    'ilk-yayin':        { label: 'İlk yayın yılı',     approxNote: 'Yaklaşık ilk yayın yılı' },
    'piyasa-cikisi':    { label: 'Piyasaya çıkış',     approxNote: 'Yaklaşık piyasaya çıkış yılı' },
    'kesif':            { label: 'Keşif yılı',         approxNote: 'Antik veya yaklaşık keşif yılı' },
    'firlatma':         { label: 'Fırlatma yılı',      approxNote: 'Yaklaşık fırlatma yılı' },
    'tahta-cikis':      { label: 'Tahta çıkış yılı',   approxNote: 'Yaklaşık tahta çıkış yılı' },
    'goreve-baslama':   { label: 'Göreve başlama',     approxNote: 'Yaklaşık göreve başlama yılı' },
    'ilk-ev-sahipligi': { label: 'İlk ev sahipliği',   approxNote: 'Yaklaşık ev sahipliği yılı' },
    'ilk-sampiyonluk':  { label: 'İlk şampiyonluk',    approxNote: 'Yaklaşık ilk şampiyonluk yılı' },
    'icat-yaklasik':    { label: 'Yaklaşık icat yılı', approxNote: 'Tarihsel kaynaklara göre yaklaşık dönem' }
  };

  var CATEGORIES = {
    'turkiye':   { id: 'turkiye',   name: 'Türkiye',       pools: ['ist_ilce', 'tr_il', 'super_lig', 'osmanli_padisahi', 'cumhurbaskani', 'turk_markasi', 'turk_filmi', 'turk_dizisi', 'sinan_yapisi', 'ist_muze'] },
    'cografya':  { id: 'cografya',  name: 'Coğrafya',      pools: ['ulke', 'baskent', 'dunya_sehri'] },
    'mutfak':    { id: 'mutfak',    name: 'Mutfak',        pools: ['corba', 'kahvaltilik', 'tatli', 'meyve', 'sebze'] },
    'doga':      { id: 'doga',      name: 'Doğa & Bilim',  pools: ['hayvan', 'element', 'gezegen', 'uzay_sondasi', 'gunes_uydu'] },
    'teknoloji': { id: 'teknoloji', name: 'Teknoloji',     pools: ['tarayici', 'isletim_sistemi', 'oyun_konsolu', 'prog_dili', 'sosyal_medya', 'icat'] },
    'kultur':    { id: 'kultur',    name: 'Kültür & Sanat', pools: ['video_oyunu', 'film', 'sarki', 'pixar'] },
    'marka':     { id: 'marka',     name: 'Marka & Ekonomi', pools: ['telefon_markasi', 'otomobil_markasi', 'havayolu', 'para_birimi'] },
    'spor':      { id: 'spor',      name: 'Spor',          pools: ['spor_dali', 'dk_sampiyon', 'olimpiyat_sehri'] },
    'toplum':    { id: 'toplum',    name: 'Toplum & Yaşam', pools: ['meslek', 'bm_genel_sekreter'] }
  };

  var meta = {
    ASOF: '2026-11',
    YEAR_KINDS: YEAR_KINDS,
    CATEGORIES: CATEGORIES,
    ATTRIBUTION: 'Soru adayları Vikiveri (CC0), Vikipedi (CC BY-SA 4.0) ve GeoNames (CC BY 4.0) verilerinden derlenmiştir. Paylar yapay zekâ tahminidir.'
  };

  root.PUSULLA_META = meta;
  root.PUSULLA = root.PUSULLA || {};
  root.PUSULLA.meta = meta;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = meta;
  }
})(typeof window !== 'undefined' ? window : globalThis);
