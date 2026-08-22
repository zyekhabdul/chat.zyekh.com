/*
 * chat.zyekh.com — Service Worker
 * Strategy: Cache-First for static assets, Network-First for navigation with offline fallback
 */

const CACHE_VERSION = '20260822_v1';
const APP_CACHE = `zyekh-chat-app-${CACHE_VERSION}`;
const ASSETS_CACHE = `zyekh-chat-assets-${CACHE_VERSION}`;

const PRECACHE_APP = [
  '/offline.html',
  '/favicon.ico',
  '/manifest.json'
];

/* Install: precache offline fallback shell */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE).then(cache => 
      Promise.allSettled(PRECACHE_APP.map(url => cache.add(url).catch(err => console.warn('[SW] Precache skip:', url, err))))
    )
  );
  self.skipWaiting();
});

/* Activate: clean outdated cache versions */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => 
          (k.startsWith('zyekh-chat-app-') && k !== APP_CACHE) ||
          (k.startsWith('zyekh-chat-assets-') && k !== ASSETS_CACHE)
        ).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* Fetch: Route by resource type */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests & API proxy routes (dynamic backend)
  if (request.method !== 'GET' || url.pathname.startsWith('/api/')) return;

  // Static Assets (CSS, JS, Fonts, Icons) -> Cache-First
  if (url.pathname.startsWith('/assets/') || url.origin !== self.location.origin) {
    if (url.pathname.startsWith('/assets/')) {
      event.respondWith(cacheFirst(request));
      return;
    }
    return;
  }

  // HTML Navigation -> Network-First with Offline Fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNav(request));
    return;
  }

  // Default -> Cache-First
  event.respondWith(cacheFirst(request));
});

/* Helper: Cache-First */
async function cacheFirst(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const targetCache = request.url.match(/\.(png|jpe?g|gif|webp|svg|woff2?|ttf|ico)$/i) ? ASSETS_CACHE : APP_CACHE;
      const cache = await caches.open(targetCache);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 408 });
  }
}

/* Helper: Network-First for Navigation */
async function networkFirstNav(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(APP_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || (await caches.match('/offline.html')) || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}
