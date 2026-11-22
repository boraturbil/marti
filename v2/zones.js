(function (root) {
  'use strict';

  var SKY_ZIRVE_0 = ['#2b1e4a', '#5a2a5e', '#a13d63', '#e0605a', '#f59a5c', '#ffd27a'];
  var SKY_ZIRVE_1 = ['#3a2457', '#7a3466', '#c24d63', '#ef7a5c', '#f8ae6a', '#ffd89a'];
  var SKY_ZIRVE_2 = ['#2a2350', '#4f3070', '#8a4378', '#c8667a', '#e99a86', '#f6c7a0'];
  var SKY_ZIRVE_3 = ['#1d2148', '#33306a', '#5b4488', '#8e5c98', '#c486a6', '#e8b6b8'];
  var SKY_ZIRVE_4 = ['#0b0f24', '#121a3a', '#1a2550', '#243266', '#2f3f78', '#3c4a85'];
  var SKY_ZIRVE_5 = ['#04050f', '#070a1c', '#0b1028', '#101634', '#141c40', '#18224a'];

  root.ZONES = {
    zirve: [
      { id: 'bogaz', name: 'BOĞAZ', score: 0, cam: 0, meters: 0, sky: SKY_ZIRVE_0, starAlpha: 0, rayAlpha: 0.07, lightsOn: true, layers: ['surface'] },
      { id: 'galata', name: 'GALATA HİZASI', score: 60, cam: 56, meters: 60, sky: SKY_ZIRVE_1, starAlpha: 0, rayAlpha: 0.07, lightsOn: true, layers: ['otherGulls'] },
      { id: 'camlica', name: 'ÇAMLICA', score: 160, cam: 140, meters: 370, sky: SKY_ZIRVE_2, starAlpha: 0.15, rayAlpha: 0.05, lightsOn: true, layers: ['kites'] },
      { id: 'bulut', name: 'BULUT DENİZİ', score: 280, cam: 300, meters: 2000, sky: SKY_ZIRVE_3, starAlpha: 0.35, rayAlpha: 0, lightsOn: true, layers: ['cloudSea', 'plane'] },
      { id: 'gece', name: 'GECE İSTANBUL', score: 420, cam: 470, meters: 9000, sky: SKY_ZIRVE_4, starAlpha: 0.8, rayAlpha: 0, lightsOn: true, layers: ['cityCarpet', 'nightClouds'] },
      { id: 'ay', name: 'AY IŞIĞI', score: 560, cam: 640, meters: 30000, sky: SKY_ZIRVE_5, starAlpha: 1.0, rayAlpha: 0, lightsOn: true, layers: ['moon', 'shootingStar', 'satellite'] }
    ],
    dip: [
      { id: 'bogaz', name: 'BOĞAZ', score: 0, cam: 0, meters: 0, sky: SKY_ZIRVE_0, starAlpha: 0, rayAlpha: 0.07, lightsOn: true, layers: ['surface'] },
      { id: 'siglik', name: 'SIĞLIK', score: 60, cam: -110, meters: 5, sky: ['#3f8aa0', '#337a94', '#2a6a86', '#225b78', '#1b4c69', '#153f5b'], starAlpha: 0, rayAlpha: 0.09, lightsOn: true, layers: ['siglik'] },
      { id: 'akinti', name: 'AKINTI', score: 200, cam: -250, meters: 25, sky: ['#22607a', '#1c5370', '#174764', '#123b57', '#0e304b', '#0a263f'], starAlpha: 0, rayAlpha: 0.05, lightsOn: true, layers: ['akinti'] },
      { id: 'batik', name: 'BATIK', score: 360, cam: -400, meters: 60, sky: ['#143c52', '#103247', '#0c283b', '#091f30', '#071827', '#05121e'], starAlpha: 0, rayAlpha: 0.02, lightsOn: true, layers: ['batik'] },
      { id: 'karanlik', name: 'KARANLIK DİP', score: 520, cam: -560, meters: 110, sky: ['#061420', '#050f19', '#040c14', '#03090f', '#02060b', '#010407'], starAlpha: 0, rayAlpha: 0, lightsOn: true, layers: ['karanlik'] }
    ],
    orta: [
      { id: 'eminonu', name: 'EMİNÖNÜ', score: 0, camX: 0, km: 0, sky: SKY_ZIRVE_0, starAlpha: 0, rayAlpha: 0.07, lightsOn: true, layers: ['eminonu'] },
      { id: 'besiktas', name: 'BEŞİKTAŞ', score: 100, camX: 420, km: 3.5, sky: SKY_ZIRVE_1, starAlpha: 0, rayAlpha: 0.07, lightsOn: true, layers: ['besiktas'] },
      { id: 'ortakoy', name: 'ORTAKÖY', score: 220, camX: 840, km: 6, sky: SKY_ZIRVE_2, starAlpha: 0.15, rayAlpha: 0.06, lightsOn: true, layers: ['ortakoy'] },
      { id: 'bebek', name: 'BEBEK', score: 340, camX: 1260, km: 9, sky: ['#2a2550', '#46306a', '#743f73', '#a85872', '#d07e7a', '#e9a98c'], starAlpha: 0.25, rayAlpha: 0.05, lightsOn: true, layers: ['bebek'] },
      { id: 'rumeli', name: 'RUMELİ HİSARI', score: 460, camX: 1680, km: 11, sky: SKY_ZIRVE_3, starAlpha: 0.35, rayAlpha: 0.04, lightsOn: true, layers: ['rumeli'] },
      { id: 'sariyer', name: 'SARIYER', score: 580, camX: 2100, km: 19, sky: ['#141a3c', '#232a58', '#3a3a72', '#5a4a84', '#7e5f92', '#a07898'], starAlpha: 0.5, rayAlpha: 0.03, lightsOn: true, layers: ['sariyer'] }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
