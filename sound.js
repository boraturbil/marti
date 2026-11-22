(function (root) {
  'use strict';

  var enabled = true;
  var ctx = null;
  var master = null;

  function ensureContext() {
    if (ctx) {
      try {
        if (ctx.state !== 'running' && typeof ctx.resume === 'function') {
          var p = ctx.resume();
          if (p && p.catch) p.catch(function () {});
        }
      } catch (e) {}
      return ctx;
    }
    try {
      var AudioCtx = root.AudioContext || root.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
      master = ctx.createGain();
      master.gain.value = enabled ? 0.15 : 0;
      master.connect(ctx.destination);
      if (ctx.state !== 'running' && typeof ctx.resume === 'function') {
        var p2 = ctx.resume();
        if (p2 && p2.catch) p2.catch(function () {});
      }
      return ctx;
    } catch (e) {
      ctx = null;
      master = null;
      return null;
    }
  }

  function tone(type, freq, startOffset, durSec, gainScale, endFreq, useLowpass) {
    if (!ctx || !master) return;
    try {
      var t0 = ctx.currentTime + (startOffset || 0);
      var dur = Math.max(0.015, durSec || 0.08);
      var peak = Math.max(0.001, gainScale == null ? 1 : gainScale);

      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(freq, t0);
      if (endFreq && endFreq > 0) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, t0 + dur);
      }

      var attack = Math.min(0.005, dur * 0.3);
      var release = Math.min(0.04, dur * 0.6);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(peak, t0 + attack);
      if (dur > attack + release) {
        g.gain.setValueAtTime(peak, t0 + dur - release);
      }
      g.gain.linearRampToValueAtTime(0.0001, t0 + dur);

      if (useLowpass) {
        var filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(useLowpass, t0);
        osc.connect(filter);
        filter.connect(g);
      } else {
        osc.connect(g);
      }
      g.connect(master);

      osc.start(t0);
      osc.stop(t0 + dur + 0.015);
    } catch (e) {}
  }

  function unlock() {
    if (!enabled) return;
    ensureContext();
  }

  function play(name) {
    if (!enabled) return;
    if (!ensureContext()) return;

    switch (name) {
      case 'correct':
        tone('square', 523.25, 0, 0.08, 1);
        tone('square', 659.25, 0.08, 0.08, 1);
        break;

      case 'perfect':
        tone('square', 523.25, 0.00, 0.07, 1);
        tone('square', 659.25, 0.07, 0.07, 1);
        tone('square', 783.99, 0.14, 0.07, 1);
        tone('square', 1046.50, 0.21, 0.07, 1);
        tone('triangle', 1046.50, 0.21, 0.20, 0.9);
        break;

      case 'weak':
        tone('triangle', 329.63, 0.00, 0.09, 0.9);
        tone('triangle', 261.63, 0.09, 0.12, 0.9);
        break;

      case 'wrong':
        tone('triangle', 220.00, 0.00, 0.07, 0.6);
        tone('triangle', 174.61, 0.07, 0.11, 0.6);
        break;

      case 'tick':
        tone('square', 1200, 0, 0.03, 0.4);
        break;

      case 'timeout':
        tone('square', 392.00, 0.00, 0.12, 0.9);
        tone('square', 293.66, 0.12, 0.12, 0.9);
        tone('square', 196.00, 0.24, 0.12, 0.9);
        break;

      case 'zone':
        tone('sawtooth', 300, 0, 0.40, 0.7, 900);
        for (var i = 0; i < 3; i++) {
          var f = 1500 + Math.random() * 1000;
          tone('square', f, 0.40 + i * 0.055, 0.04, 0.5);
        }
        break;

      case 'dive':
        tone('sawtooth', 700, 0, 0.50, 0.8, 180, 1200);
        break;

      case 'finish':
        tone('square', 523.25, 0.00, 0.11, 0.95);
        tone('square', 659.25, 0.11, 0.11, 0.95);
        tone('square', 783.99, 0.22, 0.11, 0.95);
        tone('square', 659.25, 0.33, 0.11, 0.95);
        tone('square', 1046.50, 0.44, 0.16, 0.95);
        break;

      case 'click':
        tone('square', 800, 0, 0.02, 0.3);
        break;
    }
  }

  function setEnabled(val) {
    enabled = !!val;
    if (master && ctx) {
      try {
        master.gain.setValueAtTime(enabled ? 0.15 : 0, ctx.currentTime);
      } catch (e) {
        master.gain.value = enabled ? 0.15 : 0;
      }
    }
    if (!enabled && ctx && ctx.state === 'running' && typeof ctx.suspend === 'function') {
      try {
        var ps = ctx.suspend();
        if (ps && ps.catch) ps.catch(function () {});
      } catch (e) {}
    } else if (enabled && ctx && ctx.state !== 'running' && typeof ctx.resume === 'function') {
      try {
        var pr = ctx.resume();
        if (pr && pr.catch) pr.catch(function () {});
      } catch (e) {}
    }
  }

  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('visibilitychange', function () {
      if (!ctx) return;
      try {
        if (document.hidden) {
          if (ctx.state === 'running' && typeof ctx.suspend === 'function') {
            var ps = ctx.suspend();
            if (ps && ps.catch) ps.catch(function () {});
          }
        } else if (enabled) {
          if (ctx.state !== 'running' && typeof ctx.resume === 'function') {
            var pr = ctx.resume();
            if (pr && pr.catch) pr.catch(function () {});
          }
        }
      } catch (e) {}
    });
  }

  function isEnabled() {
    return enabled;
  }

  root.Sound = {
    unlock: unlock,
    play: play,
    setEnabled: setEnabled,
    isEnabled: isEnabled
  };
})(typeof window !== 'undefined' ? window : globalThis);
