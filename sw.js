
/* ==========================================
   ECOGUARD - SERVICE WORKER
   Cache offline e atualização automática
========================================== */

const CACHE_NAME = "ecoguard-v5";

const APP_FILES = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/script.js",
  "./manifest.json",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

/* ==========================================
   INSTALAÇÃO
========================================== */

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_FILES);
    })
  );

  self.skipWaiting();
});

/* ==========================================
   ATIVAÇÃO E LIMPEZA
========================================== */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith("ecoguard-") &&
              key !== CACHE_NAME
          )
          .map((key) => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
});

/* ==========================================
   FUNCIONAMENTO OFFLINE
========================================== */

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Recursos externos não são armazenados.
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request);

        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);

          await cache.put(
            request,
            response.clone()
          );
        }

        return response;
      } catch (error) {
        const cached = await caches.match(request);

        if (cached) {
          return cached;
        }

        if (request.mode === "navigate") {
          const fallback = await caches.match(
            "./index.html"
          );

          if (fallback) {
            return fallback;
          }
        }

        return Response.error();
      }
    })()
  );
});

