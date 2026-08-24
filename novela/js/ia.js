// ============================================================
// Novela Colectiva — capa de IA OPCIONAL.
//
// La app entera funciona sin esto: el corrector, el resumen y los
// avisos de continuidad son propios y no cuestan nada. Esta capa
// solo se enciende si el docente pega su clave de la API de
// Anthropic, y sirve para dos cosas:
//   1. una revisión de coherencia de verdad, más fina que las
//      reglas locales, con una propuesta de arreglo;
//   2. un resumen redactado de por dónde va la novela.
//
// DÓNDE VIVE LA CLAVE Y POR QUÉ
// Solo en el panel docente, en el navegador del docente. Nunca se
// pide en los Chromebooks del alumnado. Así ningún alumno puede
// verla ni gastarla, y ningún texto sale del aula si el docente no
// pulsa el botón a conciencia.
//
// AVISO QUE HAY QUE DAR SIEMPRE: al usar esta capa, el fragmento de
// novela se envía a un servicio externo. Son textos de menores; por
// eso van sin nombre ni clave del autor, solo el texto.
//
// Y LA REGLA QUE NO SE ROMPE: la IA propone, nunca cambia nada. Lo
// que devuelve se le enseña al docente, que decide si se lo manda
// al alumno como indicación para que lo corrija él.
// ============================================================

import { cargarLocal, guardarLocal } from "./comun.js";

const ENDPOINT = "https://api.anthropic.com/v1/messages";
const VERSION_API = "2023-06-01";
const CLAVE_AJUSTES = "nov_ia";

export const MODELOS = [
  { id: "claude-opus-5", nombre: "Claude Opus 5 (el más capaz)" },
  { id: "claude-sonnet-5", nombre: "Claude Sonnet 5 (más barato y rápido)" },
  { id: "claude-haiku-4-5", nombre: "Claude Haiku 4.5 (el más económico)" },
];

export function ajustesIA() {
  return cargarLocal(CLAVE_AJUSTES) || { usar: false, clave: "", modelo: "claude-opus-5" };
}

export function guardarAjustesIA(ajustes) {
  guardarLocal(CLAVE_AJUSTES, ajustes);
}

export function hayIA() {
  const a = ajustesIA();
  return !!(a.usar && a.clave && a.clave.trim());
}

// ------------------------------------------------------------
// Llamada base
// ------------------------------------------------------------

async function llamar({ sistema, mensaje, esquema, esfuerzo }) {
  const a = ajustesIA();
  if (!a.clave) throw new Error("Falta la clave de la API en los ajustes.");

  const cuerpo = {
    model: a.modelo || "claude-opus-5",
    max_tokens: 2000,
    system: sistema,
    messages: [{ role: "user", content: mensaje }],
    output_config: {
      effort: esfuerzo || "low",
      format: { type: "json_schema", schema: esquema },
    },
    // Si los clasificadores declinan (una novela de aventuras puede
    // tener peleas o sustos), el servidor reencamina la petición en
    // vez de devolver una respuesta vacía.
    fallbacks: "default",
  };

  let respuesta;
  try {
    respuesta = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": a.clave.trim(),
        "anthropic-version": VERSION_API,
        "anthropic-beta": "server-side-fallback-2026-07-01",
        // Necesario para poder llamar a la API desde el navegador.
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(cuerpo),
    });
  } catch (e) {
    throw new Error("No he podido conectar con la IA. Comprueba la conexión.");
  }

  if (!respuesta.ok) {
    const detalle = await respuesta.text().catch(() => "");
    if (respuesta.status === 401) throw new Error("La clave de la API no es válida. Revísala en los ajustes.");
    if (respuesta.status === 429) throw new Error("Demasiadas peticiones seguidas. Espera unos segundos.");
    if (respuesta.status === 400) throw new Error("La API ha rechazado la petición: " + detalle.slice(0, 180));
    throw new Error("Error " + respuesta.status + " al llamar a la API.");
  }

  const datos = await respuesta.json();

  // Un 200 con stop_reason "refusal" llega sin contenido: hay que
  // comprobarlo ANTES de leer content.
  if (datos.stop_reason === "refusal") {
    throw new Error("La IA ha declinado revisar este texto. Míralo tú y, si hace falta, habla con el alumno.");
  }

  const bloque = (datos.content || []).find((b) => b.type === "text");
  if (!bloque) throw new Error("La respuesta de la IA llegó vacía.");
  try {
    return JSON.parse(bloque.text);
  } catch (e) {
    throw new Error("No he entendido la respuesta de la IA.");
  }
}

// ------------------------------------------------------------
// 1. Revisión de coherencia de un fragmento
// ------------------------------------------------------------

const ESQUEMA_COHERENCIA = {
  type: "object",
  properties: {
    encaja: { type: "boolean" },
    avisos: {
      type: "array",
      items: {
        type: "object",
        properties: {
          que: { type: "string" },
          consejo: { type: "string" },
        },
        required: ["que", "consejo"],
        additionalProperties: false,
      },
    },
    propuesta: { type: "string" },
    paraElAlumno: { type: "string" },
  },
  required: ["encaja", "avisos", "propuesta", "paraElAlumno"],
  additionalProperties: false,
};

const SISTEMA_COHERENCIA = `Ayudas a un maestro de 5.º y 6.º de Primaria (10-12 años) que tiene a su clase escribiendo una novela entre todos, por turnos de diez líneas.

Recibes: el título de la novela, las fichas de personajes y lugares que ha hecho la clase, las últimas partes escritas y la parte nueva que acaba de añadir un alumno.

Tu trabajo es decir si la parte nueva encaja con lo anterior. Fíjate en: personajes que reaparecen cuando no deberían, lugares que cambian sin explicación, saltos de tiempo verbal o de narrador, contradicciones con las fichas y cosas que se quedan sin sentido.

Devuelve:
- encaja: true si la parte continúa bien la historia, aunque tenga fallos menores.
- avisos: como mucho tres. Cada uno con "que" (el problema concreto, citando el texto) y "consejo" (cómo arreglarlo, en una frase).
- propuesta: la parte nueva reescrita de forma que encaje, respetando TODO lo que quiso contar el alumno, su vocabulario y su estilo. No la alargues ni la adornes: es su texto, no el tuyo. Si ya encaja, repítela tal cual.
- paraElAlumno: un mensaje corto y amable, de dos o tres frases, escrito directamente al alumno de 11 años, diciéndole qué ha hecho bien y qué puede mejorar. Ese mensaje lo va a leer él.

Escribe siempre en español de España, claro y sin tecnicismos. No inventes personajes ni giros nuevos: no eres el autor.`;

export async function revisarCoherenciaConIA({ titulo, fichas, ultimos, textoNuevo }) {
  const fichasTexto = (fichas || []).map((f) => {
    const respuestas = Object.values(f.respuestas || {}).filter(Boolean).join(" ");
    return "- " + f.nombre + " (" + f.tipo + (f.tipo === "personaje" ? ", " + (f.estadoNarrativo || "en la historia") : "") + "): " + respuestas;
  }).join("\n") || "(todavía no hay fichas)";

  const mensaje = [
    "Título de la novela: " + titulo,
    "",
    "Fichas de la clase:",
    fichasTexto,
    "",
    "Últimas partes escritas:",
    (ultimos || []).join("\n\n") || "(la novela empieza aquí)",
    "",
    "PARTE NUEVA que hay que revisar:",
    textoNuevo,
  ].join("\n");

  return llamar({
    sistema: SISTEMA_COHERENCIA,
    mensaje: mensaje,
    esquema: ESQUEMA_COHERENCIA,
    esfuerzo: "medium",
  });
}

// ------------------------------------------------------------
// 2. Resumen redactado de la novela
// ------------------------------------------------------------

const ESQUEMA_RESUMEN = {
  type: "object",
  properties: {
    resumen: { type: "string" },
    hilos: { type: "array", items: { type: "string" } },
  },
  required: ["resumen", "hilos"],
  additionalProperties: false,
};

const SISTEMA_RESUMEN = `Resumes novelas escritas por una clase de 5.º o 6.º de Primaria para que el propio alumnado sepa por dónde va la historia antes de seguir escribiendo.

Devuelve:
- resumen: entre cinco y ocho frases, en pasado, contando qué ha pasado hasta ahora, quién sale y dónde. Escrito para que lo entienda un niño de 11 años.
- hilos: entre dos y cuatro cosas que se han quedado en el aire y que alguien podría continuar. Cada una en una frase corta.

Escribe en español de España. No juzgues la calidad del texto, no corrijas y no inventes nada que no esté escrito.`;

export async function resumirConIA({ titulo, fragmentos }) {
  const mensaje = "Título: " + titulo + "\n\nLa novela hasta ahora:\n\n" + (fragmentos || []).join("\n\n");
  return llamar({
    sistema: SISTEMA_RESUMEN,
    mensaje: mensaje,
    esquema: ESQUEMA_RESUMEN,
    esfuerzo: "low",
  });
}
