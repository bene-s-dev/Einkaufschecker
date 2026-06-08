const CACHE_NAME = 'einkaufschecker-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  'https://unpkg.com/html5-qrcode'
];

// Service Worker installieren und Core-Assets cachen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Aktivieren und alten Cache bereinigen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Netzwerk-Anfragen verarbeiten
self.addEventListener('fetch', (event) => {
  // Live-APIs (Open Food Facts & Übersetzer) niemals cachen
  if (event.request.url.includes('openfoodfacts') || event.request.url.includes('mymemory')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});