(function (root) {
  'use strict';

  var CFG = (root.PUSULLA && root.PUSULLA.config) || (typeof require === 'function' ? require('./config.js') : {});
  var STORAGE_KEY = CFG.STORAGE_KEY || 'pusulla.v3';
  var REPORTS_KEY = CFG.REPORTS_STORAGE_KEY || 'pusulla.v3.reports';

  var memMap = {};
  var persistentOk = null;

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function defaultState() {
    return {
      version: 3,
      days: {},
      stats: {
        playedDays: 0,
        streak: 0,
        bestStreak: 0,
        lastCompletedDay: null,
        bestDayScore: 0,
        bestByMode: {},
        modeTotals: {},
        modeCounts: {},
        tierCounts: { tam: 0, cokyakin: 0, yakin: 0, uzak: 0, zayif: 0 }
      },
      recentFreeIds: [],
      pending: null
    };
  }

  function probeLocalStorage() {
    try {
      if (typeof root.localStorage === 'undefined' || !root.localStorage) {
        return false;
      }
      var probeKey = STORAGE_KEY + '.__probe';
      root.localStorage.setItem(probeKey, '1');
      root.localStorage.removeItem(probeKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  function rawGet(key) {
    try {
      if (typeof root.localStorage !== 'undefined' && root.localStorage) {
        var val = root.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch (e) {
      persistentOk = false;
    }
    return Object.prototype.hasOwnProperty.call(memMap, key) ? memMap[key] : null;
  }

  function rawSet(key, value) {
    memMap[key] = String(value);
    try {
      if (typeof root.localStorage !== 'undefined' && root.localStorage) {
        root.localStorage.setItem(key, String(value));
        persistentOk = true;
        return true;
      }
    } catch (e) {
      persistentOk = false;
    }
    persistentOk = false;
    return false;
  }

  function rawRemove(key) {
    delete memMap[key];
    try {
      if (typeof root.localStorage !== 'undefined' && root.localStorage) {
        root.localStorage.removeItem(key);
        return true;
      }
    } catch (e) {
      persistentOk = false;
    }
    return false;
  }

  function sanitizeState(parsed) {
    var base = defaultState();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return base;
    }
    if (parsed.days && typeof parsed.days === 'object' && !Array.isArray(parsed.days)) {
      base.days = parsed.days;
    }
    if (parsed.stats && typeof parsed.stats === 'object' && !Array.isArray(parsed.stats)) {
      var s = parsed.stats;
      base.stats.playedDays = Number(s.playedDays) || 0;
      base.stats.streak = Number(s.streak) || 0;
      base.stats.bestStreak = Number(s.bestStreak) || 0;
      base.stats.lastCompletedDay = s.lastCompletedDay ? String(s.lastCompletedDay) : null;
      base.stats.bestDayScore = Number(s.bestDayScore) || 0;
      if (s.bestByMode && typeof s.bestByMode === 'object') base.stats.bestByMode = s.bestByMode;
      if (s.modeTotals && typeof s.modeTotals === 'object') base.stats.modeTotals = s.modeTotals;
      if (s.modeCounts && typeof s.modeCounts === 'object') base.stats.modeCounts = s.modeCounts;
      if (s.tierCounts && typeof s.tierCounts === 'object') {
        var tiers = ['tam', 'cokyakin', 'yakin', 'uzak', 'zayif'];
        for (var i = 0; i < tiers.length; i++) {
          base.stats.tierCounts[tiers[i]] = Number(s.tierCounts[tiers[i]]) || 0;
        }
      }
    }
    if (Array.isArray(parsed.recentFreeIds)) {
      base.recentFreeIds = parsed.recentFreeIds.slice(-40);
    }
    if (parsed.pending && typeof parsed.pending === 'object') {
      base.pending = parsed.pending;
    }
    return base;
  }

  function read() {
    if (persistentOk === null) {
      persistentOk = probeLocalStorage();
    }
    try {
      var raw = rawGet(STORAGE_KEY);
      if (!raw) return defaultState();
      var parsed = JSON.parse(raw);
      return sanitizeState(parsed);
    } catch (e) {
      return defaultState();
    }
  }

  function write(data) {
    var clean = sanitizeState(data);
    var json;
    try {
      json = JSON.stringify(clean);
    } catch (e) {
      return { ok: false, persistent: false };
    }
    var ok = rawSet(STORAGE_KEY, json);
    return { ok: true, persistent: ok };
  }

  function reset() {
    rawRemove(STORAGE_KEY);
    var fresh = defaultState();
    return clone(fresh);
  }

  function readReports() {
    try {
      var raw = rawGet(REPORTS_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function addReport(entry) {
    var list = readReports();
    list.push(entry);
    try {
      rawSet(REPORTS_KEY, JSON.stringify(list));
    } catch (e) {
      // ignore serialization failure
    }
    return list.length;
  }

  function clearReports() {
    rawRemove(REPORTS_KEY);
    return 0;
  }

  var store = {
    STORAGE_KEY: STORAGE_KEY,
    REPORTS_STORAGE_KEY: REPORTS_KEY,
    getDefault: defaultState,
    isPersistent: function () {
      if (persistentOk === null) persistentOk = probeLocalStorage();
      return Boolean(persistentOk);
    },
    read: read,
    load: read,
    write: write,
    save: write,
    reset: reset,
    readReports: readReports,
    addReport: addReport,
    clearReports: clearReports
  };

  root.PUSULLA = root.PUSULLA || {};
  root.PUSULLA.store = store;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = store;
  }
})(typeof window !== 'undefined' ? window : globalThis);
