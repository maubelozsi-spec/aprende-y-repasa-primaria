// ============================================================
// Service Worker: permite instalar la app y abrirla sin conexión.
// Estrategia: cache-first para lo que ya se visitó (con caché en
// segundo plano de lo nuevo), más una página de repliegue
// (index.html) si se pide una navegación sin red y sin caché.
//
// IMPORTANTE: subir el número de CACHE_NAME en cada actualización
// notable del sitio para invalidar la caché de los navegadores ya
// instalados (no hay proceso de build que lo haga automáticamente).
// ============================================================

const CACHE_NAME = "ar-cache-v3";
const APP_SHELL = [
  "./",
  "index.html",
  "manifest.json",
  "css/style.css",
  "js/layout.js",
  "js/gamification.js",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {
        // Si algún recurso del listado falla (por ejemplo, servidor
        // de desarrollo distinto), la instalación no se bloquea.
      })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          if (req.mode === "navigate") return caches.match("index.html");
          return undefined;
        });
    })
  );
});
