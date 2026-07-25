// ============================================================
// Economía Familiar 2.0 — service worker (ámbito: /economia-familiar/).
// Cachea el armazón de la app para que abra sin conexión; los datos
// van aparte: Firestore ya tiene su propia caché local persistente.
// Estrategia: red primero con caché de respaldo (así los cambios de
// código llegan en cuanto hay conexión).
// ============================================================

const CACHE = "eco-familiar-v1";
const ARCHIVOS = [
  "./",
  "./index.html",
  "./familia.html",
  "./docente.html",
  "./proyeccion.html",
  "./css/estilos.css",
  "./js/firebase-init.js",
  "./js/catalogos.js",
  "./js/motor.js",
  "./js/comun.js",
  "./js/familia.js",
  "./js/docente.js",
  "./js/proyeccion.js",
  "./manifest.json",
  "../js/firebase-config.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((claves) =>
      Promise.all(claves.filter((k) => k.startsWith("eco-familiar-") && k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // Solo gestionamos nuestros propios archivos (nunca Firebase/gstatic).
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        const copia = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copia));
        return resp;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("./index.html")))
  );
});
