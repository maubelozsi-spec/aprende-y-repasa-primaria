// ============================================================
// Novela Colectiva — service worker.
//
// En el aula el wifi se cae a media clase con toda naturalidad. Con
// esto la app abre igual, se puede leer la novela y seguir
// escribiendo: el borrador se guarda en el propio Chromebook y
// Firestore sube lo pendiente en cuanto vuelve la conexión.
//
// Estrategia: primero la red y, si falla, la caché (igual que el
// resto de la web). IMPORTANTE: subir CACHE_NAME en cada cambio.
// ============================================================

const CACHE_NAME = "novela-cache-v1";

const APP_SHELL = [
  "./",
  "index.html",
  "escribir.html",
  "docente.html",
  "tutorial.html",
  "manifest.json",
  "css/estilos.css",
  "js/comun.js",
  "js/inicio.js",
  "js/escribir.js",
  "js/docente.js",
  "js/tutorial.js",
  "js/proyectos.js",
  "js/firebase-init.js",
  "js/diccionario.js",
  "js/lexico.js",
  "js/corrector.js",
  "js/fichas.js",
  "js/coherencia.js",
  "js/resumen.js",
  "js/moderacion.js",
  "js/pdf.js",
  "js/exportar.js",
  "js/ia.js",
  "../js/firebase-config.js",
  "../js/auth.js",
  "../js/firebase-init.js",
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {
      // Si algún archivo falla, la instalación no se bloquea: se irá
      // guardando sobre la marcha al navegar.
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys()
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
          if (peticion.mode === "navigate") return caches.match("index.html");
          return undefined;
        })
      )
  );
});
