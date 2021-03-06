var cacheName = 'sgtoilet-cache-' + Date.now();
var filesToCache = [
  '/',
  '/index.html',
  '/favicon.png',
  '/global.css',
  '/build/bundle.js',
  '/build/bundle.css',
];
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (thisCacheName) {
          if (thisCacheName !== cacheName) {
            return caches.delete(thisCacheName);
          }
        })
      );
    })
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
