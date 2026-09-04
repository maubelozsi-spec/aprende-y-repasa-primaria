// ============================================================
// Cuaderno Digital — service worker.
//
// Permite instalar la app y abrir el cascarón (HTML/CSS/JS) sin
// conexión. Las imágenes y PDFs de Firebase Storage NO se precargan
// aquí (pueden ser muchos y pesados): se cachean solos, de forma
// oportunista, la primera vez que se ven con conexión (misma
// estrategia "red primero, caché de repliegue" que el resto de la
// web). Los cuadernos/páginas en sí usan la caché offline de
// Firestore (ver js/firebase-init.js), no esta caché de service
// worker.
//
// IMPORTANTE: subir el número de CACHE_NAME en cada cambio notable.
// ============================================================

const CACHE_NAME = "cuaderno-digital-cache-v1";
const APP_SHELL = [
  "./",
  "index.html",
  "manifest.json",
  "css/estilos.css",
  "js/app.js",
  "js/firebase-init.js",
  "js/storage.js",
  "js/ink-canvas.js",
  "js/elementos.js",
  "js/pdf-import.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {})
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
    fetch(req)
      .then((res) => {
        if (res && res.status === 200) {
          const copia = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copia));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => {
          if (cached) return cached;
          if (req.mode === "navigate") return caches.match("index.html");
          return undefined;
        })
      )
  );
});
