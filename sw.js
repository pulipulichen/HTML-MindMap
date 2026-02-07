const CACHE_NAME = 'mindmap-v1-20260207-2021';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/mindmap.js',
  './js/html2canvas.min.js',
  './manifest.json',
  './assets/favicon/favicon.png'
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
