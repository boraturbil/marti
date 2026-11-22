'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const USER_AGENT = 'PusullaBuild/1.0 (https://pusulla.io)';
const ALLOWED_HOSTS = new Set(['query.wikidata.org', 'tr.wikipedia.org', 'www.wikidata.org']);
const MIN_DELAY_MS = 1500;
const DEFAULT_CACHE_DIR = path.resolve(__dirname, '..', 'out', 'cache');

let lastRequestAt = 0;

function sleep(ms, signal) {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (signal && signal.aborted) {
      return reject(signal.reason || new Error('İstek iptal edildi (zaman aşımı)'));
    }
    const timer = setTimeout(() => {
      if (signal) signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(signal.reason || new Error('İstek iptal edildi (zaman aşımı)'));
    }
    if (signal) signal.addEventListener('abort', onAbort, { once: true });
  });
}

function hashKey(str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex').slice(0, 24);
}

/**
 * Yalnızca query.wikidata.org ve tr.wikipedia.org adreslerine istek atar.
 * Önbellekte varsa ağa çıkmaz; istekler arası en az 1,5 sn bekler; 429/503/504'te üstel geri çekilme uygular.
 */
async function cachedFetchJson(urlStr, opts = {}) {
  const parsed = new URL(urlStr);
  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    throw new Error(`İzin verilmeyen host: ${parsed.hostname}`);
  }

  const cacheDir = opts.cacheDir || DEFAULT_CACHE_DIR;
  const cacheKey = opts.cacheKey || hashKey(urlStr + (opts.body || ''));
  const cachePath = path.join(cacheDir, `${cacheKey}.json`);

  if (fs.existsSync(cachePath)) {
    const raw = fs.readFileSync(cachePath, 'utf8');
    return JSON.parse(raw);
  }

  if (opts.offline) {
    throw new Error(`Çevrimdışı modda önbellek bulunamadı: ${cacheKey}`);
  }

  const extSignal = opts.signal || null;
  if (extSignal && extSignal.aborted) {
    throw extSignal.reason || new Error('60sn zaman aşımı');
  }

  fs.mkdirSync(cacheDir, { recursive: true });

  const method = opts.method || 'GET';
  const headers = {
    'User-Agent': USER_AGENT,
    'Accept': 'application/json',
    ...(opts.headers || {})
  };

  let attempt = 0;
  const maxAttempts = opts.maxAttempts || 4;

  while (true) {
    if (extSignal && extSignal.aborted) {
      throw extSignal.reason || new Error('60sn zaman aşımı');
    }
    attempt++;
    const now = Date.now();
    const wait = MIN_DELAY_MS - (now - lastRequestAt);
    if (wait > 0) await sleep(wait, extSignal);
    lastRequestAt = Date.now();

    let res;
    const controller = new AbortController();
    const onExtAbort = () => controller.abort(extSignal.reason || new Error('60sn zaman aşımı'));
    if (extSignal) {
      if (extSignal.aborted) throw extSignal.reason || new Error('60sn zaman aşımı');
      extSignal.addEventListener('abort', onExtAbort, { once: true });
    }
    const timeoutId = setTimeout(() => controller.abort(new Error('HTTP zaman aşımı')), opts.timeoutMs || 45000);

    try {
      res = await fetch(urlStr, {
        method,
        headers,
        body: opts.body,
        signal: controller.signal
      });
    } catch (err) {
      if (extSignal && extSignal.aborted) {
        throw extSignal.reason || new Error('60sn zaman aşımı');
      }
      if (attempt >= maxAttempts) throw err;
      const backoff = Math.min(15000, 2000 * Math.pow(2, attempt - 1));
      await sleep(backoff, extSignal);
      continue;
    } finally {
      clearTimeout(timeoutId);
      if (extSignal) extSignal.removeEventListener('abort', onExtAbort);
    }

    if (res.status === 429 || res.status === 500 || res.status === 502 || res.status === 503 || res.status === 504) {
      if (attempt >= maxAttempts) {
        throw new Error(`HTTP ${res.status} (${parsed.hostname}) — deneme sınırı aşıldı`);
      }
      const retryAfter = parseInt(res.headers.get('retry-after') || '0', 10);
      const backoff = Math.max(retryAfter * 1000, Math.min(20000, 2500 * Math.pow(2, attempt - 1)));
      await sleep(backoff, extSignal);
      continue;
    }

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} (${parsed.hostname}): ${txt.slice(0, 180)}`);
    }

    const data = await res.json();
    fs.writeFileSync(cachePath, JSON.stringify(data), 'utf8');
    return data;
  }
}

module.exports = { cachedFetchJson, hashKey, USER_AGENT, DEFAULT_CACHE_DIR };
