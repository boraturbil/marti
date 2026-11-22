/**
 * MARTI — Piksel Sanat Sahnesi (scene.js)
 *
 * 180x320 çözünürlüklü tuvalde tamamen kodla çizilen gün batımı İstanbul Boğazı sahnesi:
 * - Bantlı/dithered gün batımı gökyüzü, piksel güneş, yüksek irtifada yıldızlı gece
 * - Parallax bulut katmanları
 * - İstanbul silüeti (camiler, minareler, Galata benzeri kule, Boğaz köprüsü)
 * - Animasyonlu Boğaz suyu, parıltılar ve geçen küçük vapur
 * - Ortada süzülen piksel martı maskotu ve kademe efektleri
 *
 * Dışa açık API: window.Scene = { init(canvas), setAltitude(score), effect(type) }
 */
(function (root) {
  'use strict';

  var W = 180;
  var H = 320;
  var HORIZON_Y = 232;

  var ctx = null;
  var rafId = null;
  var lastTime = 0;
  var elapsed = 0;

  // Kamera ve irtifa durumu (0..1 arası normalize skor irtifası)
  var targetAltitude = 0;
  var currentAltitude = 0;
  var passOffset = 0;
  var passVelocity = 0;

  // Efekt zamanlayıcıları
  var shakeTimer = 0;
  var flapBoostTimer = 0;
  var sparkles = [];

  // Sahne nesneleri
  var stars = [];
  var clouds = [];
  var ferry = { x: -36, speed: 6.5 };

  // Gün batımı ve gece gökyüzü renk bantları (üstten alta)
  var SKY_BANDS = [
    '#12142b', // derin gece
    '#1d1e42', // koyu lacivert
    '#322559', // gece moru
    '#572b66', // mor
    '#873566', // koyu pembe-mor
    '#b8465a', // gül kurusu
    '#de6449', // mercan turuncu
    '#f28c43', // gün batımı turuncusu
    '#f7b654'  // ufuk sarısı
  ];

  function initEntities() {
    stars = [];
    for (var i = 0; i < 42; i++) {
      stars.push({
        x: Math.floor((i * 47 + 13) % W),
        y: Math.floor((i * 29 + 7) % 190),
        phase: i * 0.7,
        big: i % 5 === 0
      });
    }

    clouds = [
      { x: 12, y: 145, w: 34, speed: 2.4, layer: 0 },
      { x: 105, y: 120, w: 42, speed: 1.8, layer: 0 },
      { x: 48, y: 82, w: 38, speed: 3.1, layer: 1 },
      { x: 140, y: 55, w: 30, speed: 2.7, layer: 1 },
      { x: 20, y: 20, w: 44, speed: 2.1, layer: 1 }
    ];
  }

  function px(c, x, y, w, h, color) {
    c.fillStyle = color;
    c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  /**
   * Bantlı ve 2x2 satranç dither geçişli gün batımı gökyüzü + piksel güneş.
   */
  function drawSky(c, camY) {
    // camY arttıkça (0..120 px yukarı kayma) üstteki gece bantları aşağı iner
    var bandH = 34;
    for (var y = 0; y < H; y += 2) {
      var worldY = y - camY * 0.85;
      var rawIdx = (worldY + 60) / bandH;
      var idx = Math.max(0, Math.min(SKY_BANDS.length - 1, Math.floor(rawIdx)));
      var frac = rawIdx - Math.floor(rawIdx);
      var nextIdx = Math.max(0, Math.min(SKY_BANDS.length - 1, idx + 1));

      c.fillStyle = SKY_BANDS[idx];
      c.fillRect(0, y, W, 2);

      // Bant sınırlarında 2x2 dither geçişi
      if (frac > 0.72 && nextIdx !== idx) {
        c.fillStyle = SKY_BANDS[nextIdx];
        for (var x = (y % 4 === 0 ? 0 : 2); x < W; x += 4) {
          c.fillRect(x, y, 2, 1);
          c.fillRect(x + 1, y + 1, 1, 1);
        }
      }
    }

    // Piksel güneş (ufka yakın, kamera yükseldikçe aşağı kayar)
    var sunX = 128;
    var sunY = Math.round(HORIZON_Y - 34 + camY * 0.6);
    if (sunY < H + 20) {
      var r = 13;
      for (var sy = -r; sy <= r; sy++) {
        for (var sx = -r; sx <= r; sx++) {
          var dist2 = sx * sx + sy * sy;
          if (dist2 <= r * r) {
            var py = sunY + sy;
            if (py < HORIZON_Y + Math.round(camY * 0.7)) {
              c.fillStyle = dist2 < 64 ? '#fff3a8' : '#ffd166';
              c.fillRect(sunX + sx, py, 1, 1);
            }
          }
        }
      }
    }
  }

  /**
   * Yüksek puanda/irtifada belirginleşen kırpışan piksel yıldızlar.
   */
  function drawStars(c, camY, time) {
    var visibility = Math.max(0, Math.min(1, (currentAltitude - 0.28) * 1.4));
    if (visibility <= 0.02) return;

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var sy = Math.round(s.y + camY * 0.35);
      if (sy < 4 || sy > HORIZON_Y + camY * 0.6 - 20) continue;

      var twinkle = Math.sin(time * 3.2 + s.phase);
      if (twinkle < -0.35 && visibility < 0.7) continue;

      c.fillStyle = twinkle > 0.4 ? '#fff9d6' : '#b8c4ff';
      c.fillRect(s.x, sy, 1, 1);
      if (s.big && visibility > 0.55 && twinkle > 0.2) {
        c.fillRect(s.x - 1, sy, 3, 1);
        c.fillRect(s.x, sy - 1, 1, 3);
      }
    }
  }

  /**
   * Farklı parallax hızlarında yatay kayan piksel bulutlar.
   */
  function drawClouds(c, camY) {
    for (var i = 0; i < clouds.length; i++) {
      var cl = clouds[i];
      var cy = Math.round(cl.y + camY * (0.45 + cl.layer * 0.2));
      if (cy < -16 || cy > HORIZON_Y + camY * 0.7) continue;

      var cx = Math.round(cl.x);
      var topCol = currentAltitude > 0.65 ? '#594270' : '#f7a583';
      var baseCol = currentAltitude > 0.65 ? '#3a2b52' : '#c9686f';

      px(c, cx, cy, cl.w, 4, baseCol);
      px(c, cx + 4, cy - 3, cl.w - 10, 4, topCol);
      px(c, cx + 10, cy - 5, Math.floor(cl.w * 0.45), 3, topCol);
    }
  }

  /**
   * Ufukta İstanbul Boğazı silüeti: cami kubbeleri, minareler, Galata kulesi ve köprü.
   */
  function drawSkyline(c, camY) {
    var baseY = Math.round(HORIZON_Y + camY * 0.75);
    if (baseY > H + 30) return;

    var sil = '#1d1630';
    var silDark = '#140f24';
    var winGlow = '#ffd166';

    // Arka tepe silüeti
    px(c, 0, baseY - 8, 52, 8, silDark);
    px(c, 12, baseY - 12, 28, 4, silDark);
    px(c, 118, baseY - 7, 62, 7, silDark);

    // Sol tarafta cami kubbesi + 2 ince minare
    px(c, 18, baseY - 16, 18, 16, sil);
    px(c, 21, baseY - 21, 12, 5, sil);
    px(c, 24, baseY - 24, 6, 3, sil);
    px(c, 27, baseY - 27, 1, 3, sil); // alem
    // Minareler
    px(c, 14, baseY - 32, 2, 32, sil);
    px(c, 13, baseY - 24, 4, 1, sil); // şerefe
    px(c, 14, baseY - 35, 1, 3, sil);
    px(c, 38, baseY - 30, 2, 30, sil);
    px(c, 37, baseY - 22, 4, 1, sil);
    px(c, 38, baseY - 33, 1, 3, sil);

    // Galata benzeri konik çatılı kule (sol-orta)
    px(c, 54, baseY - 28, 8, 28, sil);
    px(c, 53, baseY - 30, 10, 2, sil);
    px(c, 55, baseY - 34, 6, 4, sil);
    px(c, 57, baseY - 38, 2, 4, sil);
    px(c, 56, baseY - 25, 1, 2, winGlow);
    px(c, 59, baseY - 25, 1, 2, winGlow);

    // Boğaz Köprüsü silüeti (orta-sağ)
    var bridgeY = baseY - 15;
    px(c, 74, bridgeY, 74, 2, sil); // tabliye
    // Köprü ayakları
    px(c, 86, baseY - 32, 2, 32, sil);
    px(c, 92, baseY - 32, 2, 32, sil);
    px(c, 86, baseY - 26, 8, 1, sil);
    px(c, 130, baseY - 32, 2, 32, sil);
    px(c, 136, baseY - 32, 2, 32, sil);
    px(c, 130, baseY - 26, 8, 1, sil);
    // Asma halatlar (piksel adımlı parabol)
    for (var bx = 74; bx <= 148; bx += 2) {
      var cableY = bridgeY;
      if (bx < 86) {
        cableY = baseY - 31 + Math.floor(((86 - bx) / 12) * 16);
      } else if (bx <= 136) {
        var norm = (bx - 111) / 25;
        cableY = baseY - 16 - Math.floor((1 - norm * norm) * 14);
      } else {
        cableY = baseY - 31 + Math.floor(((bx - 136) / 12) * 16);
      }
      px(c, bx, cableY, 1, 1, sil);
      if (bx % 6 === 0 && cableY < bridgeY) {
        px(c, bx, cableY, 1, bridgeY - cableY, silDark);
      }
    }

    // Sağ kıyıda küçük cami kubbesi ve binalar
    px(c, 154, baseY - 14, 14, 14, sil);
    px(c, 157, baseY - 18, 8, 4, sil);
    px(c, 169, baseY - 24, 2, 24, sil);
    px(c, 160, baseY - 9, 1, 1, winGlow);
    px(c, 164, baseY - 9, 1, 1, winGlow);
  }

  /**
   * Küçük piksel vapur (Boğaz'da yavaşça süzülür).
   */
  function drawFerry(c, waterY, time) {
    var fx = Math.round(ferry.x);
    var fy = Math.round(waterY + 12 + Math.sin(time * 2.5) * 0.6);

    // Gövde
    px(c, fx, fy + 4, 24, 4, '#1b1d33');
    px(c, fx + 2, fy + 2, 20, 2, '#f2efe9');
    px(c, fx + 4, fy, 14, 2, '#e8e2d5');
    // Pencereler
    px(c, fx + 6, fy + 1, 2, 1, '#ffd166');
    px(c, fx + 10, fy + 1, 2, 1, '#ffd166');
    px(c, fx + 14, fy + 1, 2, 1, '#ffd166');
    // Baca + kırmızı şerit
    px(c, fx + 10, fy - 4, 3, 4, '#2b2d42');
    px(c, fx + 10, fy - 3, 3, 1, '#d94f4f');
    // Duman pikselleri
    var puff = Math.floor(time * 4) % 4;
    px(c, fx + 8 - puff, fy - 6 - (puff % 2), 2, 1, '#b8a9c9');
    px(c, fx + 5 - puff, fy - 8, 2, 1, '#9e8fb2');
  }

  /**
   * Ön planda animasyonlu Boğaz suyu ve güneş yansıması.
   */
  function drawWater(c, camY, time) {
    var waterY = Math.round(HORIZON_Y + camY * 0.75);
    if (waterY >= H) return;

    px(c, 0, waterY, W, H - waterY, '#1d2247');
    px(c, 0, waterY, W, 6, '#2a2d5c');

    // Yatay dalga çizgileri
    for (var wy = waterY + 4; wy < H; wy += 6) {
      var shift = Math.round(Math.sin(time * 1.8 + wy * 0.25) * 4);
      var col = wy < waterY + 26 ? '#393d75' : '#151836';
      for (var wx = (wy % 12) + shift; wx < W; wx += 22) {
        px(c, wx, wy, 9, 1, col);
      }
    }

    // Güneş yansıma parıltıları (x=128 civarı)
    for (var ry = waterY + 2; ry < Math.min(H, waterY + 56); ry += 3) {
      var spread = Math.floor((ry - waterY) * 0.22);
      var shimmer = Math.round(Math.sin(time * 4 + ry * 0.6) * 2);
      var rx = 126 + shimmer - Math.floor(spread * 0.5);
      var rw = Math.max(2, 7 - Math.floor((ry - waterY) / 10));
      px(c, rx, ry, rw, 1, ry < waterY + 18 ? '#ffd166' : '#f28c43');
    }

    drawFerry(c, waterY, time);
  }

  /**
   * Ortada süzülen piksel martı maskotu.
   */
  function drawGull(c, time) {
    var bobY = Math.sin(time * 2.6) * 2.5;
    var shakeX = 0;
    var shakeY = 0;
    if (shakeTimer > 0) {
      shakeX = Math.round(Math.sin(time * 48) * 3);
      shakeY = Math.round(Math.cos(time * 38) * 1.5);
    }

    var gx = Math.round(W / 2 + shakeX);
    var gy = Math.round(164 - currentAltitude * 34 + passOffset + bobY + shakeY);

    var flapSpeed = flapBoostTimer > 0 ? 14 : 4.2;
    var flapFrame = Math.floor(time * flapSpeed) % 4; // 0: yukarı, 1: orta, 2: aşağı, 3: orta

    var white = '#f8f9fa';
    var shade = '#cfd8e3';
    var wingTip = '#343a40';
    var beak = '#f4a261';

    // Gövde
    px(c, gx - 5, gy - 1, 11, 4, white);
    px(c, gx - 4, gy + 2, 8, 1, shade);
    // Kuyruk
    px(c, gx - 8, gy - 1, 3, 2, shade);
    px(c, gx - 9, gy - 1, 2, 1, wingTip);
    // Kafa + göz + gaga
    px(c, gx + 4, gy - 3, 4, 3, white);
    px(c, gx + 6, gy - 2, 1, 1, '#1b1d33');
    px(c, gx + 8, gy - 2, 3, 1, beak);
    px(c, gx + 9, gy - 1, 1, 1, '#e76f51');

    // Kanatlar (kare bazlı çırpış)
    if (flapFrame === 0) {
      // Yukarı kalkık
      px(c, gx - 3, gy - 5, 5, 4, white);
      px(c, gx - 6, gy - 8, 4, 3, white);
      px(c, gx - 8, gy - 10, 3, 2, wingTip);
    } else if (flapFrame === 1 || flapFrame === 3) {
      // Süzülme (yatay)
      px(c, gx - 4, gy - 2, 6, 2, white);
      px(c, gx - 9, gy - 3, 5, 2, shade);
      px(c, gx - 11, gy - 3, 3, 1, wingTip);
    } else {
      // Aşağı vuruş
      px(c, gx - 3, gy + 2, 5, 3, shade);
      px(c, gx - 6, gy + 5, 4, 3, shade);
      px(c, gx - 7, gy + 7, 2, 2, wingTip);
    }

    return { gx: gx, gy: gy };
  }

  /**
   * 'perfect' efektinde martı etrafında parıltı pikselleri.
   */
  function drawSparkles(c, gullPos) {
    for (var i = sparkles.length - 1; i >= 0; i--) {
      var sp = sparkles[i];
      if (sp.life <= 0) {
        sparkles.splice(i, 1);
        continue;
      }
      var sx = Math.round(gullPos.gx + sp.x);
      var sy = Math.round(gullPos.gy + sp.y);
      var col = sp.life > 0.4 ? '#fff3a8' : '#ffd166';
      px(c, sx, sy, 2, 2, col);
    }
  }

  function spawnSparkles() {
    for (var i = 0; i < 16; i++) {
      var angle = (Math.PI * 2 * i) / 16;
      var speed = 18 + (i % 3) * 10;
      sparkles.push({
        x: Math.cos(angle) * 4,
        y: Math.sin(angle) * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 8,
        life: 0.75 + (i % 4) * 0.1
      });
    }
  }

  function update(dt) {
    elapsed += dt;

    // Kamera ve irtifa yumuşak geçişi
    currentAltitude += (targetAltitude - currentAltitude) * Math.min(1, dt * 3.2);

    // Pas durumunda kısa süreli alçalma ve toparlanma
    passOffset += passVelocity * dt;
    passVelocity *= Math.pow(0.08, dt);
    passOffset += (0 - passOffset) * Math.min(1, dt * 2.5);

    if (shakeTimer > 0) shakeTimer = Math.max(0, shakeTimer - dt);
    if (flapBoostTimer > 0) flapBoostTimer = Math.max(0, flapBoostTimer - dt);

    // Bulutları kaydır
    for (var i = 0; i < clouds.length; i++) {
      clouds[i].x += clouds[i].speed * dt;
      if (clouds[i].x > W + 10) {
        clouds[i].x = -clouds[i].w - 8;
      }
    }

    // Vapuru kaydır
    ferry.x += ferry.speed * dt;
    if (ferry.x > W + 16) {
      ferry.x = -34;
    }

    // Parıltıları güncelle
    for (var j = 0; j < sparkles.length; j++) {
      sparkles[j].x += sparkles[j].vx * dt;
      sparkles[j].y += sparkles[j].vy * dt;
      sparkles[j].life -= dt;
    }
  }

  function render() {
    if (!ctx) return;
    var camY = currentAltitude * 95;

    drawSky(ctx, camY);
    drawStars(ctx, camY, elapsed);
    drawClouds(ctx, camY);
    drawSkyline(ctx, camY);
    drawWater(ctx, camY, elapsed);

    var gullPos = drawGull(ctx, elapsed);
    drawSparkles(ctx, gullPos);
  }

  function tick(now) {
    if (!lastTime) lastTime = now;
    var dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    update(dt);
    render();

    rafId = root.requestAnimationFrame(tick);
  }

  var Scene = {
    init: function (canvas) {
      if (!canvas) return;
      canvas.width = W;
      canvas.height = H;
      ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      initEntities();
      lastTime = 0;
      if (rafId) {
        root.cancelAnimationFrame(rafId);
      }
      rafId = root.requestAnimationFrame(tick);
    },

    setAltitude: function (score) {
      var clamped = Math.max(0, Math.min(400, Number(score) || 0));
      targetAltitude = clamped / 400;
    },

    effect: function (type) {
      if (type === 'perfect') {
        flapBoostTimer = 0.9;
        spawnSparkles();
      } else if (type === 'weak') {
        shakeTimer = 0.45;
      } else if (type === 'pass') {
        passVelocity = 24;
      }
    }
  };

  root.Scene = Scene;
})(typeof window !== 'undefined' ? window : globalThis);
