// ============================================================
// Novela Colectiva — lectura en voz alta.
//
// Usa la voz que ya trae el navegador (SpeechSynthesis): no hay que
// instalar nada, no se envía el texto a ningún sitio y no cuesta
// dinero. Sirve para escuchar la novela en la pizarra, y sobre todo
// para el alumnado que lee con dificultad: oír lo que llevan escrito
// antes de escribir su parte cambia mucho las cosas.
//
// Los Chromebooks tardan un momento en tener listas las voces, así
// que se piden dos veces: al cargar y cuando el navegador avisa.
// ============================================================

let vocesListas = [];

function cargarVoces() {
  try {
    vocesListas = window.speechSynthesis.getVoices() || [];
  } catch (e) {
    vocesListas = [];
  }
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  cargarVoces();
  window.speechSynthesis.addEventListener("voiceschanged", cargarVoces);
}

export function hayVoz() {
  return typeof window !== "undefined" &&
    !!window.speechSynthesis && typeof window.SpeechSynthesisUtterance === "function";
}

// Se prefiere una voz de España; si no hay, cualquiera en español;
// si tampoco, la que traiga el sistema (mejor leer con acento raro
// que no leer).
function vozEspanola() {
  if (!vocesListas.length) cargarVoces();
  return vocesListas.find((v) => v.lang === "es-ES") ||
    vocesListas.find((v) => String(v.lang).startsWith("es")) ||
    null;
}

export function pararVoz() {
  if (!hayVoz()) return;
  try { window.speechSynthesis.cancel(); } catch (e) { /* nada que parar */ }
}

// Lee una lista de textos seguidos. `alEmpezarUno` recibe el índice
// del que empieza, para poder resaltarlo en pantalla.
export function leerFragmentos(textos, opciones) {
  if (!hayVoz()) return;
  const conf = opciones || {};
  pararVoz();

  const lista = (textos || []).filter((t) => String(t || "").trim());
  if (!lista.length) {
    if (conf.alTerminar) conf.alTerminar();
    return;
  }

  const voz = vozEspanola();
  let i = 0;

  function siguiente() {
    if (i >= lista.length) {
      if (conf.alTerminar) conf.alTerminar();
      return;
    }
    const indice = i++;
    if (conf.alEmpezarUno) conf.alEmpezarUno(indice);

    const frase = new SpeechSynthesisUtterance(lista[indice]);
    frase.lang = "es-ES";
    if (voz) frase.voice = voz;
    frase.rate = conf.velocidad || 0.95;   // un pelín más lento que el habla normal
    frase.pitch = 1;
    frase.onend = siguiente;
    // Si una parte falla (a veces pasa con textos largos), se sigue
    // con la siguiente en vez de dejar la lectura colgada.
    frase.onerror = siguiente;
    window.speechSynthesis.speak(frase);
  }

  siguiente();
}
