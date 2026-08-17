// ============================================================
// Inglés para Viajar — capa opcional de IA (Claude).
//
// La app funciona entera sin esto. Si pegas tu propia clave de la
// API de Anthropic en los ajustes, se desbloquean dos cosas:
//   1. correcciones sobre CUALQUIER frase, no solo las previstas
//      en el guion, con traducción de verdad
//   2. el modo conversación libre, en el que Claude improvisa la
//      situación en lugar de seguir un guion
//
// AVISO IMPORTANTE SOBRE LA CLAVE
// La clave se guarda en este navegador y viaja directamente de
// aquí a api.anthropic.com. Eso es aceptable para uso personal en
// tu propio dispositivo, pero NO publiques esta app con tu clave
// puesta ni la uses en un ordenador compartido: cualquiera con
// acceso al navegador podría leerla y gastar tu saldo.
// ============================================================

import { ajustes } from "./almacen.js";

const ENDPOINT = "https://api.anthropic.com/v1/messages";
const VERSION_API = "2023-06-01";

export const MODELOS = [
  { id: "claude-opus-5", nombre: "Claude Opus 5 (el más capaz)" },
  { id: "claude-sonnet-5", nombre: "Claude Sonnet 5 (más barato y rápido)" },
  { id: "claude-haiku-4-5", nombre: "Claude Haiku 4.5 (el más económico)" },
];

export function hayIA() {
  const a = ajustes();
  return !!(a.usarIA && a.claveIA && a.claveIA.trim());
}

// ------------------------------------------------------------
// Llamada base
// ------------------------------------------------------------

async function llamar({ sistema, mensajes, esquema, maxTokens = 1200 }) {
  const a = ajustes();
  if (!a.claveIA) throw new Error("Falta la clave de la API en los ajustes.");

  const cuerpo = {
    model: a.modeloIA || "claude-opus-5",
    max_tokens: maxTokens,
    system: sistema,
    messages: mensajes,
    output_config: {
      effort: "low", // conversación corta: no hace falta más
      format: { type: "json_schema", schema: esquema },
    },
  };

  let respuesta;
  try {
    respuesta = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": a.claveIA.trim(),
        "anthropic-version": VERSION_API,
        // Necesario para poder llamar a la API desde el navegador.
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(cuerpo),
    });
  } catch (e) {
    throw new Error("No he podido conectar. Comprueba tu conexión a internet.");
  }

  if (!respuesta.ok) {
    const detalle = await respuesta.text().catch(() => "");
    if (respuesta.status === 401) throw new Error("La clave de la API no es válida. Revísala en los ajustes.");
    if (respuesta.status === 429) throw new Error("Demasiadas peticiones seguidas. Espera unos segundos.");
    if (respuesta.status === 400) throw new Error("La API ha rechazado la petición: " + detalle.slice(0, 180));
    throw new Error(`Error ${respuesta.status} al llamar a la API.`);
  }

  const datos = await respuesta.json();

  // Los clasificadores de seguridad pueden declinar una petición:
  // llega un 200 con stop_reason "refusal" y sin contenido. Hay
  // que comprobarlo ANTES de leer content.
  if (datos.stop_reason === "refusal") {
    throw new Error("La IA ha declinado responder a este mensaje. Prueba a reformularlo.");
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
// 1. Corrección libre
// ------------------------------------------------------------

const ESQUEMA_CORRECCION = {
  type: "object",
  properties: {
    correcta: { type: "boolean" },
    natural: { type: "string" },
    traduccion: { type: "string" },
    explicaciones: {
      type: "array",
      items: {
        type: "object",
        properties: {
          que: { type: "string" },
          porque: { type: "string" },
        },
        required: ["que", "porque"],
        additionalProperties: false,
      },
    },
  },
  required: ["correcta", "natural", "traduccion", "explicaciones"],
  additionalProperties: false,
};

const SISTEMA_CORRECCION = `Eres profesor de inglés para viajar. Tu alumno es un adulto hispanohablante que empieza desde cero (nivel A1) y practica situaciones de viaje.

Recibirás la situación, lo que acaba de decirle el interlocutor y la frase que ha dicho el alumno.

Devuelve:
- correcta: true si la frase se entiende y es apropiada para la situación, aunque tenga algún fallo menor.
- natural: la frase reescrita como la diría un nativo en esa situación, respetando lo que el alumno quería decir. Si ya está bien, repítela tal cual.
- traduccion: la traducción al español de "natural".
- explicaciones: como máximo tres. Cada una con "que" (el cambio concreto, citando las palabras) y "porque" (la razón, explicada en español claro para alguien que no sabe gramática inglesa). Si la frase está perfecta, devuelve una lista vacía.

Escribe siempre las explicaciones en español. Sé breve y concreto: nada de teoría general.`;

export async function corregirConIA({ texto, turno, escena }) {
  const contexto = [
    `Situación: ${escena}`,
    `El interlocutor acaba de decir: "${turno.di.en}"`,
    `Lo que el alumno tenía que conseguir: ${turno.objetivo}`,
    `Respuesta modelo de referencia: "${turno.modelo.en}"`,
    "",
    `Frase del alumno: "${texto}"`,
  ].join("\n");

  return llamar({
    sistema: SISTEMA_CORRECCION,
    mensajes: [{ role: "user", content: contexto }],
    esquema: ESQUEMA_CORRECCION,
    maxTokens: 900,
  });
}

// ------------------------------------------------------------
// 2. Conversación libre
// ------------------------------------------------------------

const ESQUEMA_TURNO = {
  type: "object",
  properties: {
    en: { type: "string" },
    es: { type: "string" },
    nota: { type: "string" },
    objetivo: { type: "string" },
    estructura: { type: "string" },
    estructuraEs: { type: "string" },
    modelo_en: { type: "string" },
    modelo_es: { type: "string" },
    terminar: { type: "boolean" },
  },
  required: ["en", "es", "nota", "objetivo", "estructura", "estructuraEs", "modelo_en", "modelo_es", "terminar"],
  additionalProperties: false,
};

const SISTEMA_CONVERSACION = `Eres el interlocutor en una simulación de conversación para aprender inglés de viaje. El alumno es un adulto hispanohablante de nivel principiante (A1-A2).

Interpretas a una persona real en la situación indicada (recepcionista, camarero, agente...). En cada turno devuelves:
- en: tu siguiente frase, en inglés. UNA o DOS frases cortas como mucho. Vocabulario sencillo y frecuente. Nada de expresiones raras ni bromas difíciles.
- es: la traducción al español de esa frase.
- nota: una aclaración breve en español si hay algo cultural o de uso que convenga saber; cadena vacía si no hace falta.
- objetivo: en español, qué tiene que conseguir el alumno con su respuesta.
- estructura: un andamio de frase en inglés con huecos, del tipo "I'd like ______, please."
- estructuraEs: ese mismo andamio traducido.
- modelo_en y modelo_es: una respuesta modelo completa y su traducción.
- terminar: true solo cuando la situación esté resuelta de forma natural (después de 5 o 6 turnos).

Reacciona SIEMPRE a lo que ha dicho el alumno: si ha pedido algo, dáselo o ponle una pega verosímil; si ha preguntado, responde. No corrijas su inglés aquí, de eso se encarga otra parte de la app.`;

export async function siguienteTurnoIA({ situacion, nivel, historial }) {
  const dificultad = {
    1: "Muy fácil: frases de tres o cuatro palabras, presente simple, sin condicionales.",
    2: "Normal: frases completas, pasado y futuro sencillos, la situación transcurre sin sobresaltos.",
    3: "Difícil: mete una complicación verosímil (algo no está disponible, hay un error, falta un dato) que obligue al alumno a negociar.",
  }[nivel] || "Normal.";

  const mensajes = [];
  mensajes.push({
    role: "user",
    content: `Situación: ${situacion}\nDificultad: ${dificultad}\n\nEmpieza tú la conversación con la primera frase.`,
  });

  historial.forEach((entrada) => {
    if (entrada.quien === "app") {
      mensajes.push({ role: "assistant", content: JSON.stringify(entrada.datos) });
    } else {
      mensajes.push({ role: "user", content: `El alumno ha dicho: "${entrada.texto}"` });
    }
  });

  return llamar({
    sistema: SISTEMA_CONVERSACION,
    mensajes,
    esquema: ESQUEMA_TURNO,
    maxTokens: 900,
  });
}

// ------------------------------------------------------------
// 3. Comprobación de la clave
// ------------------------------------------------------------

export async function probarClave() {
  const resultado = await llamar({
    sistema: "Responde en español.",
    mensajes: [{ role: "user", content: "Di únicamente que la conexión funciona." }],
    esquema: {
      type: "object",
      properties: { mensaje: { type: "string" } },
      required: ["mensaje"],
      additionalProperties: false,
    },
    maxTokens: 100,
  });
  return resultado.mensaje;
}
