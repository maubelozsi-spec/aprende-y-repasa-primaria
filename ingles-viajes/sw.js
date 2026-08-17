// ============================================================
// Inglés para Viajar — service worker.
//
// Sin esto la app no arranca sin conexión, y este es justo el caso
// de uso: practicar en el avión, en el metro o en un país sin datos.
// Todo lo que necesita (guiones, vocabulario, reglas) es estático,
// así que con guardarlo una vez basta.
//
// Estrategia: PRIMERO LA RED y, si falla, la caché. Es la misma que
// usa el sw.js de la raíz, y por el mismo motivo: si se sirviera
// primero la caché, las actualizaciones no llegarían nunca hasta
// subir a mano el número de versión.
//
// IMPORTANTE: subir CACHE_NAME en cada cambio notable de la app.
// ============================================================

const CACHE_NAME = "iv-cache-v1";

const APP_SHELL = [
  "./",
  "index.html",
  "conversar.html",
  "vocabulario.html",
  "progreso.html",
  "manifest.json",
  "css/estilos.css",
  "js/inicio.js",
  "js/conversar.js",
  "js/vocabulario.js",
  "js/progreso.js",
  "js/comun.js",
  "js/almacen.js",
  "js/voz.js",
  "js/evaluador.js",
  "js/gramatica.js",
  "js/pronunciacion.js",
  "js/ia.js",
  "js/datos-conversaciones.js",
  "js/datos-vocabulario.js",
  "js/datos-lexico.js",
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {
        // Si algún archivo falla al guardarse, la instalación no se
        // bloquea: se irá guardando sobre la marcha al navegar.
      })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((c) => c !== CACHE_NAME).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (evento) => {
  const peticion = evento.request;
  if (peticion.method !== "GET" || !peticion.url.startsWith(self.location.origin)) return;

  evento.respondWith(
    fetch(peticion)
      .then((respuesta) => {
        if (respuesta && respuesta.status === 200) {
          const copia = respuesta.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(peticion, copia));
        }
        return respuesta;
      })
      .catch(() =>
        caches.match(peticion).then((guardada) => {
          if (guardada) return guardada;
          // Sin conexión y sin nada guardado para esa dirección: se
          // devuelve la portada, que es mejor que un error del navegador.
          if (peticion.mode === "navigate") return caches.match("index.html");
          return undefined;
        })
      )
  );
});
