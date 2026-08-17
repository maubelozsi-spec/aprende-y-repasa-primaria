// ============================================================
// Inglés para Viajar — voz: leer en alto y escuchar el micrófono.
//
// Todo con las APIs del propio navegador, sin librerías ni
// servicios externos: SpeechSynthesis para hablar y
// SpeechRecognition para escuchar. Funciona en Chrome, Edge y
// Safari (también en el iPhone). En Firefox el micrófono no está
// disponible, y la app lo detecta para ofrecer escribir.
// ============================================================

let vocesCargadas = [];

function cargarVoces() {
  if (!("speechSynthesis" in window)) return;
  vocesCargadas = window.speechSynthesis.getVoices() || [];
}

if ("speechSynthesis" in window) {
  cargarVoces();
  window.speechSynthesis.addEventListener("voiceschanged", cargarVoces);
}

export function soportaVoz() {
  return "speechSynthesis" in window;
}

function mejorVoz() {
  if (!vocesCargadas.length) cargarVoces();
  const inglesas = vocesCargadas.filter((v) => /^en(-|_)/i.test(v.lang));
  if (!inglesas.length) return null;
  // Se prefiere el inglés británico, que es el que más se oye
  // viajando por Europa, y dentro de él una voz que no sea la
  // robótica por defecto si hay alternativa.
  return (
    inglesas.find((v) => /en(-|_)GB/i.test(v.lang) && !/compact/i.test(v.name)) ||
    inglesas.find((v) => /en(-|_)GB/i.test(v.lang)) ||
    inglesas.find((v) => !/compact/i.test(v.name)) ||
    inglesas[0]
  );
}

/**
 * Lee una frase en inglés en voz alta.
 * @param {string} texto
 * @param {{lento?: boolean}} opciones
 */
export function hablar(texto, opciones = {}) {
  if (!soportaVoz() || !texto) return;
  window.speechSynthesis.cancel();
  const frase = new SpeechSynthesisUtterance(String(texto));
  const voz = mejorVoz();
  if (voz) frase.voice = voz;
  frase.lang = voz ? voz.lang : "en-GB";
  frase.rate = opciones.lento ? 0.62 : 0.92;
  frase.pitch = 1;
  window.speechSynthesis.speak(frase);
}

export function callar() {
  if (soportaVoz()) window.speechSynthesis.cancel();
}

// ------------------------------------------------------------
// Micrófono
// ------------------------------------------------------------

const Reconocedor = window.SpeechRecognition || window.webkitSpeechRecognition;

export function soportaMicrofono() {
  return !!Reconocedor;
}

let reconocimientoActivo = null;

/**
 * Escucha por el micrófono y devuelve lo que ha entendido.
 *
 * @param {{onParcial?: Function, onFin?: Function}} opciones
 * @returns {Promise<{texto: string, confianza: number}>}
 */
export function escuchar(opciones = {}) {
  return new Promise((resolver, rechazar) => {
    if (!Reconocedor) {
      rechazar(new Error("sin-microfono"));
      return;
    }
    if (reconocimientoActivo) {
      try { reconocimientoActivo.abort(); } catch (e) { /* ya estaba parado */ }
      reconocimientoActivo = null;
    }

    const rec = new Reconocedor();
    rec.lang = "en-GB";
    rec.interimResults = true;
    rec.maxAlternatives = 3;
    rec.continuous = false;

    let mejorTexto = "";
    let mejorConfianza = 0;
    let terminado = false;

    rec.onresult = (evento) => {
      let parcial = "";
      for (let i = evento.resultIndex; i < evento.results.length; i++) {
        const resultado = evento.results[i];
        const alternativa = resultado[0];
        if (resultado.isFinal) {
          mejorTexto = (mejorTexto + " " + alternativa.transcript).trim();
          mejorConfianza = Math.max(mejorConfianza, alternativa.confidence || 0);
        } else {
          parcial += alternativa.transcript;
        }
      }
      if (parcial && opciones.onParcial) opciones.onParcial(parcial);
    };

    rec.onerror = (evento) => {
      if (terminado) return;
      terminado = true;
      reconocimientoActivo = null;
      rechazar(new Error(evento.error || "error-microfono"));
    };

    rec.onend = () => {
      if (terminado) return;
      terminado = true;
      reconocimientoActivo = null;
      if (opciones.onFin) opciones.onFin();
      if (!mejorTexto.trim()) {
        rechazar(new Error("sin-audio"));
      } else {
        resolver({ texto: mejorTexto.trim(), confianza: mejorConfianza });
      }
    };

    reconocimientoActivo = rec;
    try {
      rec.start();
    } catch (e) {
      terminado = true;
      reconocimientoActivo = null;
      rechazar(new Error("no-se-pudo-iniciar"));
    }
  });
}

export function pararEscucha() {
  if (reconocimientoActivo) {
    try { reconocimientoActivo.stop(); } catch (e) { /* ya estaba parado */ }
  }
}

// Mensajes legibles para cada fallo del micrófono, porque los
// errores en crudo ("not-allowed", "no-speech") no dicen nada.
export function explicarErrorMicrofono(error) {
  const codigo = error && error.message ? error.message : String(error);
  const mensajes = {
    "sin-microfono": "Este navegador no admite el micrófono. Prueba con Chrome, Edge o Safari, o escribe tu respuesta.",
    "not-allowed": "Has bloqueado el micrófono. Actívalo en los permisos del navegador (el candado de la barra de direcciones).",
    "service-not-allowed": "El navegador no permite el reconocimiento de voz aquí. Escribe tu respuesta mientras tanto.",
    "no-speech": "No he oído nada. Acerca el micrófono y prueba otra vez.",
    "sin-audio": "No he entendido nada. Habla un poco más alto y vocaliza.",
    "audio-capture": "No encuentro ningún micrófono conectado.",
    network: "El reconocimiento de voz necesita conexión a internet.",
    aborted: "Grabación cancelada.",
    "no-se-pudo-iniciar": "No he podido encender el micrófono. Inténtalo de nuevo.",
  };
  return mensajes[codigo] || "No he podido usar el micrófono. Puedes escribir tu respuesta.";
}
