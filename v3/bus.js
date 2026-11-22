(function (global) {
  'use strict';

  var P = (global.PUSULLA = global.PUSULLA || {});
  P.version = P.version || '3.0.0-f1';

  var isDebug = false;
  try {
    if (global.location && global.location.search) {
      isDebug = /(?:^\?|&)debug(?:=|&|$)/.test(global.location.search);
    }
  } catch (e) {
    isDebug = false;
  }

  var listeners = Object.create(null);
  var eventLog = [];

  function on(name, fn) {
    if (!name || typeof fn !== 'function') return function () {};
    if (!listeners[name]) listeners[name] = [];
    listeners[name].push(fn);
    return function () {
      off(name, fn);
    };
  }

  function off(name, fn) {
    var list = listeners[name];
    if (!list) return;
    for (var i = list.length - 1; i >= 0; i--) {
      if (list[i] === fn) list.splice(i, 1);
    }
  }

  function once(name, fn) {
    if (typeof fn !== 'function') return function () {};
    function wrapper(data) {
      off(name, wrapper);
      fn(data);
    }
    return on(name, wrapper);
  }

  function invokeList(list, name, data) {
    if (!list || !list.length) return;
    var copy = list.slice();
    for (var i = 0; i < copy.length; i++) {
      try {
        copy[i](data, name);
      } catch (err) {
        if (global.console && typeof global.console.error === 'function') {
          global.console.error('[PUSULLA.bus] Dinleyici hatası (' + name + '):', err);
        }
      }
    }
  }

  function emit(name, data) {
    var payload = data === undefined ? {} : data;
    var entry = {
      name: name,
      data: payload,
      ts: Date.now()
    };
    eventLog.push(entry);
    if (eventLog.length > 300) {
      eventLog.shift();
    }

    if (isDebug && global.console && typeof global.console.log === 'function') {
      global.console.log('[PUSULLA]', name, payload);
    }

    invokeList(listeners[name], name, payload);
    if (name !== '*') {
      invokeList(listeners['*'], name, payload);
    }
  }

  var bus = {
    on: on,
    off: off,
    once: once,
    emit: emit,
    getLog: function () {
      return eventLog.slice();
    },
    clearLog: function () {
      eventLog.length = 0;
    },
    isDebug: function () {
      return isDebug;
    }
  };

  // Sözleşme (§2.9) PUSULLA.events ve brief PUSULLA.bus adlarını birlikte destekle
  P.events = bus;
  P.bus = bus;

  // Opsiyonel alt sistemler için güvenli varsayılanlar
  if (!P.scene) {
    P.scene = {
      setScene: function () {},
      setMode: function () {}
    };
  }
  if (!P.sound) {
    var soundEnabled = true;
    P.sound = {
      setEnabled: function (val) {
        soundEnabled = !!val;
      },
      isEnabled: function () {
        return soundEnabled;
      }
    };
  }
  if (!P.actions) P.actions = {};
  if (!P.state) {
    P.state = {
      get: function () {
        return {
          phase: 'menu',
          modeId: null,
          index: 0,
          score: 0,
          question: null,
          lastResult: null
        };
      }
    };
  }
})(typeof window !== 'undefined' ? window : globalThis);
