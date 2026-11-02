// ============================================================
// Novela Colectiva — diccionario completo de español en segundo plano.
//
// Carga el diccionario de LibreOffice para español (RLA-ES, en
// novela/vendor/diccionario-es, ver su LICENCIA.txt) con nspell
// (novela/vendor/nspell.js, licencia MIT). Prepararlo cuesta unos
// segundos de proceso: por eso va en un Web Worker, para que la página
// no se congele mientras tanto en los Chromebooks.
//
// Mensajes: { id, palabras: [...] } → { id, resultado: { palabra: true|false } }
// Si no se puede cargar, responde { id, error } y el corrector sigue
// solo con su vocabulario propio (novela/js/lexico.js).
// ============================================================

/* global importScripts, nspellModulo */
importScripts("../vendor/nspell.js");

const listo = Promise.all([
  fetch("../vendor/diccionario-es/es.aff").then((r) => { if (!r.ok) throw new Error("aff " + r.status); return r.text(); }),
  fetch("../vendor/diccionario-es/es.dic").then((r) => { if (!r.ok) throw new Error("dic " + r.status); return r.text(); }),
]).then(([aff, dic]) => nspellModulo(aff, dic));

self.onmessage = async (e) => {
  const { id, palabras } = e.data || {};
  try {
    const corrector = await listo;
    const resultado = {};
    for (const p of palabras || []) resultado[p] = corrector.correct(p);
    self.postMessage({ id, resultado });
  } catch (err) {
    self.postMessage({ id, error: String((err && err.message) || err) });
  }
};
