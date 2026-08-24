// ============================================================
// Novela Colectiva — corrector ortográfico propio, sin conexión y
// sin coste. Trabaja en tres niveles, de más seguro a menos:
//
//   1. REGLAS de alta seguridad (mayúscula después de punto, signo
//      de apertura que falta, "aver" por "a ver"…). Se marcan en
//      rojo porque casi nunca fallan.
//   2. FALTAS deducidas del diccionario: la palabra no existe pero
//      sí existe con la tilde bien puesta, con h, con b en vez de
//      v… También en rojo, y con la explicación de la regla.
//   3. DUDAS: la palabra no la conocemos y no se parece a nada
//      claro. En ámbar y con un "¿seguro que se escribe así?",
//      NUNCA como falta: el diccionario de la app no puede tener
//      todas las palabras del español.
//
// El corrector nunca impide publicar. Avisa, explica y ofrece la
// forma correcta; corregir o no es decisión de quien escribe (y
// luego del docente, que lo ve todo en su panel).
// ============================================================

import { existe, sugerencias, mismasSinTilde, esPropioConocido, sinTildes } from "./diccionario.js";

const LETRAS = "a-záéíóúüñA-ZÁÉÍÓÚÜÑ";
const RE_PALABRA = new RegExp("[" + LETRAS + "]+", "g");

// Pronombres que se pegan detrás del verbo (dime, contárselo…).
const ENCLITICOS = ["melo", "mela", "melos", "melas", "telo", "tela", "telos", "telas",
  "selo", "sela", "selos", "selas", "noslo", "nosla", "noslos", "noslas",
  "me", "te", "se", "le", "lo", "la", "les", "los", "las", "nos", "os"];

function quitaEncliticos(p) {
  for (const enc of ENCLITICOS) {
    if (p.length > enc.length + 2 && p.endsWith(enc)) {
      const base = p.slice(0, -enc.length);
      // al pegar el pronombre se añade una tilde que el verbo solo no
      // lleva: "da" → "dámelo"; por eso probamos también sin tilde
      if (existe(base) || existe(sinTildes(base))) return base;
    }
  }
  return null;
}

// ---------- nivel 2: faltas deducidas del diccionario ----------

// Cambios de letra típicos de 5.º y 6.º. Si al deshacer el cambio la
// palabra sí existe, es que la falta es esa y podemos explicarla.
const CAMBIOS = [
  { de: /^h/, a: "", regla: "Esta palabra se escribe sin h." },
  { de: /^/, a: "h", regla: "Esta palabra lleva h al principio, aunque no se oiga." },
  { de: /b/g, a: "v", regla: "Ojo: aquí va v, no b." },
  { de: /v/g, a: "b", regla: "Ojo: aquí va b, no v." },
  { de: /g/g, a: "j", regla: "Ojo: aquí va j, no g." },
  { de: /j/g, a: "g", regla: "Ojo: aquí va g, no j." },
  { de: /ll/g, a: "y", regla: "Ojo: aquí va y, no ll." },
  { de: /y/g, a: "ll", regla: "Ojo: aquí va ll, no y." },
  { de: /s/g, a: "c", regla: "Ojo: aquí va c, no s." },
  { de: /c/g, a: "s", regla: "Ojo: aquí va s, no c." },
  { de: /z/g, a: "c", regla: "Delante de e o de i se escribe c, no z (cielo, cinco)." },
  { de: /c/g, a: "z", regla: "Delante de a, o, u se escribe z, no c." },
  { de: /qu/g, a: "cu", regla: "Aquí suena /ku/: se escribe cu." },
  { de: /nb/g, a: "mb", regla: "Antes de b siempre se escribe m, nunca n." },
  { de: /np/g, a: "mp", regla: "Antes de p siempre se escribe m, nunca n." },
  { de: /rr/g, a: "r", regla: "Aquí basta con una r." },
  { de: /([aeiou])r([aeiou])/g, a: "$1rr$2", regla: "Entre vocales, el sonido fuerte se escribe rr." },
];

function faltaPorCambio(p) {
  for (const c of CAMBIOS) {
    let candidata;
    try { candidata = p.replace(c.de, c.a); } catch (e) { continue; }
    if (candidata === p) continue;
    if (existe(candidata)) return { correcta: candidata, regla: c.regla };
    // puede que además le falte la tilde: "enpezo" → "empezo" → "empezó"
    const conTilde = mismasSinTilde(candidata);
    if (conTilde.length) {
      return { correcta: conTilde[0], regla: c.regla + " Y le falta la tilde." };
    }
  }
  return null;
}

// ---------- análisis de una palabra suelta ----------

export function revisaPalabra(palabraOriginal) {
  const p = String(palabraOriginal || "").toLowerCase();
  if (p.length < 2) return null;
  if (existe(p)) return null;
  if (quitaEncliticos(p)) return null;

  // ¿es la misma palabra mal acentuada?
  const conTilde = mismasSinTilde(p);
  if (conTilde.length) {
    const correcta = conTilde[0];
    const llevaMas = (correcta.match(/[áéíóú]/g) || []).length > (p.match(/[áéíóú]/g) || []).length;
    return {
      tipo: "falta",
      correcta: correcta,
      sugerencias: conTilde.slice(0, 3),
      regla: llevaMas ? "Le falta la tilde." : "Aquí sobra la tilde.",
    };
  }

  const cambio = faltaPorCambio(p);
  if (cambio) {
    return {
      tipo: "falta",
      correcta: cambio.correcta,
      sugerencias: [cambio.correcta].concat(sugerencias(p, 2).filter((s) => s !== cambio.correcta)),
      regla: cambio.regla,
    };
  }

  return {
    tipo: "duda",
    correcta: null,
    sugerencias: sugerencias(p, 4),
    regla: "No conozco esta palabra. ¿Seguro que se escribe así?",
  };
}

// ---------- nivel 1: reglas sobre el texto entero ----------

// `grupo` indica qué parte del hallazgo se resalta y se sustituye
// (1 = primer paréntesis). `cambio` es el texto correcto; si es null,
// el aviso solo explica y no ofrece arreglo automático.
const REGLAS_TEXTO = [
  { re: /\baver\b/gi, cambio: "a ver",
    mensaje: '«aver» no existe: es «a ver» (a ver qué pasa) o «haber» (tiene que haber alguien).' },
  { re: /\bhaber si\b/gi, cambio: "a ver si",
    mensaje: 'Aquí es «a ver si», de mirar; «haber» es el verbo.' },
  { re: /\bay que\b/gi, cambio: "hay que",
    mensaje: 'Es «hay que», del verbo haber. «Ay» es un grito.' },
  { re: /\bosea\b/gi, cambio: "o sea", mensaje: "Se escribe separado: «o sea»." },
  { re: /\benserio\b/gi, cambio: "en serio", mensaje: "Se escribe separado: «en serio»." },
  { re: /\bsobretodo\b/gi, cambio: "sobre todo",
    mensaje: "Cuando significa «principalmente» va separado: «sobre todo»." },
  { re: /\bdeacuerdo\b/gi, cambio: "de acuerdo", mensaje: "Se escribe separado: «de acuerdo»." },
  { re: /\bporfavor\b/gi, cambio: "por favor", mensaje: "Se escribe separado: «por favor»." },
  { re: /\bapartir\b/gi, cambio: "a partir", mensaje: "Se escribe separado: «a partir»." },
  { re: /\bencuanto\b/gi, cambio: "en cuanto", mensaje: "Se escribe separado: «en cuanto»." },
  { re: /(\s+)[,;:.!?]/g, grupo: 1, cambio: "",
    mensaje: "Delante de una coma o un punto no se deja espacio." },
  { re: /[,;:](?=[^\s\d])/g, cambio: null,
    mensaje: "Después de la coma o los dos puntos hay que dejar un espacio." },
  { re: /[a-záéíóúñ]{2}\.(?=[a-záéíóúñ])/g, cambio: null,
    mensaje: "Después del punto hay que dejar un espacio." },
  { re: /[.!?]["»)]?\s+([a-záéíóúñ])/g, grupo: 1, mayuscula: true,
    mensaje: "Después de un punto se empieza con mayúscula." },
  { re: /\b([a-záéíóúñ]{2,})\s+\1\b/gi, cambio: null,
    mensaje: "Has repetido la misma palabra dos veces seguidas." },
  { re: /\s{2,}/g, cambio: " ", mensaje: "Aquí hay dos espacios seguidos." },
];

const REPETIBLES = new Set(["que", "no", "sí", "si", "muy", "ja", "je", "ay", "oh"]);

// ---------- revisión completa ----------

// Devuelve { avisos, propios } donde cada aviso lleva la posición
// exacta dentro del texto para poder sustituir la palabra de un clic.
export function revisarTexto(texto, opciones) {
  const conf = opciones || {};
  // Los nombres ya fichados no se marcan ni se vuelven a preguntar.
  // Se guardan enteros ("Cabo Sombrío") y también palabra a palabra,
  // porque en el texto pueden aparecer sueltos ("el Cabo").
  const yaFichados = new Set();
  for (const n of conf.nombresFichados || []) {
    const limpio = String(n).toLowerCase();
    yaFichados.add(limpio);
    for (const trozo of limpio.split(/\s+/)) if (trozo) yaFichados.add(trozo);
  }
  const avisos = [];
  const propios = [];
  const t = String(texto || "");

  // --- reglas de texto ---
  for (const regla of REGLAS_TEXTO) {
    regla.re.lastIndex = 0;
    let m;
    while ((m = regla.re.exec(t)) !== null) {
      if (m[0].length === 0) { regla.re.lastIndex++; continue; }
      if (regla.re.source.includes("\\1") && REPETIBLES.has(String(m[1]).toLowerCase())) continue;

      const grupo = regla.grupo || 0;
      const trozo = m[grupo] != null ? m[grupo] : m[0];
      const inicio = grupo ? m.index + m[0].indexOf(trozo) : m.index;
      let arreglo = null;
      if (regla.mayuscula) arreglo = trozo.toUpperCase();
      else if (regla.cambio != null) arreglo = regla.cambio;

      avisos.push({
        tipo: "falta", clase: "regla",
        inicio: inicio, fin: inicio + trozo.length, texto: trozo,
        regla: regla.mensaje,
        sugerencias: arreglo === null ? [] : [arreglo],
      });
    }
  }

  // --- signos de apertura ---
  contarAperturas(t, "?", "¿", avisos);
  contarAperturas(t, "!", "¡", avisos);

  // --- primera letra en mayúscula ---
  const primera = t.search(/\S/);
  if (primera >= 0 && /[a-záéíóúñ]/.test(t[primera])) {
    avisos.push({
      tipo: "falta", clase: "regla", inicio: primera, fin: primera + 1, texto: t[primera],
      regla: "El texto tiene que empezar con mayúscula.",
      sugerencias: [t[primera].toUpperCase()],
    });
  }

  // --- palabra a palabra ---
  RE_PALABRA.lastIndex = 0;
  let mp;
  while ((mp = RE_PALABRA.exec(t)) !== null) {
    const palabra = mp[0];
    const inicio = mp.index;
    const clave = palabra.toLowerCase();
    if (esPropioConocido(palabra) || yaFichados.has(clave)) continue;

    const enMayuscula = /^[A-ZÁÉÍÓÚÜÑ]/.test(palabra);
    const empiezaFrase = esInicioDeFrase(t, inicio);
    const r = revisaPalabra(palabra);

    if (enMayuscula) {
      // Una mayúscula en mitad de la frase es casi siempre el nombre
      // de alguien o de algún sitio: no es una falta, es una ficha
      // que hay que rellenar. Solo se marca como falta cuando el
      // diccionario está seguro (le falta una tilde, una h…).
      if (r && r.tipo === "falta" && empiezaFrase) {
        avisos.push(hazAviso(r, palabra, inicio));
      } else if (!empiezaFrase || (r && r.tipo === "duda")) {
        propios.push({ palabra: palabra, inicio: inicio, fin: inicio + palabra.length });
      }
      continue;
    }

    if (r) avisos.push(hazAviso(r, palabra, inicio));
  }

  // Los nombres de dos o más palabras seguidas son UNA sola cosa:
  // "Cabo Sombrío" o "la Torre de los Vientos" se piden en una única
  // ficha, no en tres.
  const propiosUnidos = [];
  for (const p of propios) {
    const anterior = propiosUnidos[propiosUnidos.length - 1];
    if (anterior) {
      const medio = t.slice(anterior.fin, p.inicio);
      if (/^ (de |del |de la |de los |la |el )?$/.test(medio)) {
        anterior.fin = p.fin;
        anterior.palabra = t.slice(anterior.inicio, p.fin);
        continue;
      }
    }
    propiosUnidos.push(Object.assign({}, p));
  }
  const propiosFinales = propiosUnidos.filter((p) => !yaFichados.has(p.palabra.toLowerCase()));

  avisos.sort((a, b) => a.inicio - b.inicio || (a.clase === "regla" ? -1 : 1));

  // Si una regla y el diccionario señalan el mismo trozo de texto, se
  // queda solo la regla: explica mejor y evita dos avisos para lo mismo.
  const limpios = [];
  for (const a of avisos) {
    const solapa = limpios.some((b) => b.clase === "regla" && b.inicio <= a.inicio && b.fin >= a.fin);
    if (!solapa) limpios.push(a);
  }
  return { avisos: limpios, propios: propiosFinales };
}

function hazAviso(r, palabra, inicio) {
  return {
    tipo: r.tipo,
    clase: "palabra",
    inicio: inicio,
    fin: inicio + palabra.length,
    texto: palabra,
    regla: r.regla,
    sugerencias: (r.sugerencias || []).map((s) => respetaMayuscula(palabra, s)),
    posibleInvento: r.tipo === "duda" && (r.sugerencias || []).length === 0,
  };
}

function contarAperturas(t, cierre, apertura, avisos) {
  let desde = 0;
  let pos;
  while ((pos = t.indexOf(cierre, desde)) !== -1) {
    const trozo = t.slice(0, pos);
    const aperturas = (trozo.match(new RegExp("\\" + apertura, "g")) || []).length;
    const cierres = (trozo.match(new RegExp("\\" + cierre, "g")) || []).length;
    if (aperturas <= cierres) {
      avisos.push({
        tipo: "falta", clase: "regla", inicio: pos, fin: pos + 1, texto: cierre,
        regla: "En español las preguntas y las exclamaciones se abren con " + apertura +
               " y se cierran con " + cierre + ".",
        sugerencias: [],
      });
    }
    desde = pos + 1;
  }
}

function esInicioDeFrase(t, inicio) {
  for (let i = inicio - 1; i >= 0; i--) {
    const c = t[i];
    if (/\s/.test(c)) continue;
    if (/["«—–\-(¿¡']/.test(c)) continue;
    return /[.!?:;]/.test(c);
  }
  return true;
}

function respetaMayuscula(original, sugerida) {
  if (/^[A-ZÁÉÍÓÚÜÑ]/.test(original)) return sugerida.charAt(0).toUpperCase() + sugerida.slice(1);
  return sugerida;
}

// Aplica una sugerencia sobre el texto y devuelve el texto nuevo.
export function aplicarSugerencia(texto, aviso, sugerida) {
  return texto.slice(0, aviso.inicio) + sugerida + texto.slice(aviso.fin);
}

// Resumen corto para el panel docente: faltas por cada 100 palabras.
export function indiceDeFaltas(texto) {
  const { avisos } = revisarTexto(texto, {});
  const faltas = avisos.filter((a) => a.tipo === "falta").length;
  const palabras = (String(texto || "").trim().match(RE_PALABRA) || []).length || 1;
  return { faltas: faltas, palabras: palabras, por100: Math.round((faltas * 1000) / palabras) / 10 };
}
