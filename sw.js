const CACHE_NAME = 'mindmap-v1-20260207-2021';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/mindmap.js',
  './js/html2canvas.min.js',
  './js/pwa.js',
  './js/example.js',
  './js/export.js',
  './manifest.json',
  './assets/favicon/favicon.png',
  './css/mindmap.css',
  './css/node-color.css',
  './css/scroll.css',
  './css/preview.css',

];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
