// sw.js - Кэширование игры для оффлайн-режима
const CACHE_NAME = 'narzan-cache-v3';
const urlsToCache = [
  './',
  './index.html'
];

// Установка: сохраняем файлы в кэш
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Активация: чистим старый кэш, если обновилась версия
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Перехват запросов: пытаемся загрузить из сети, если нет - берем из кэша
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});