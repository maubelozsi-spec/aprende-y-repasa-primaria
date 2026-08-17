// ============================================================
// Inglés para Viajar — evaluación de tus respuestas.
//
// Junta las tres piezas: si has dicho lo que había que decir
// (contenido), si lo has dicho bien (gramática) y si se te ha
// entendido (pronunciación). El resultado es siempre el mismo
// paquete, tanto si has hablado como si has escrito.
// ============================================================

import { normalizar, palabras, corregir } from "./gramatica.js";
import { compararPronunciacion } from "./pronunciacion.js";
import { significado } from "./datos-lexico.js";

// ¿Aparece esta clave en la frase? Las claves de varias palabras
// se buscan como fragmento; las de una sola, como palabra entera
// (para que "no" no case dentro de "nothing").
function contiene(normalizado, clave) {
  // La clave pasa por la misma normalización que la frase, para que
  // acentos, contracciones y mayúsculas no den falsos negativos.
  const c = normalizar(clave);
  if (c === "?") return normalizado.includes("?");
  if (c.includes(" ")) return normalizado.includes(c);
  return new RegExp(`(^|\\s)${c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|\\s|\\?)`).test(normalizado);
}

function cobertura(normalizado, requiere) {
  if (!requiere || !requiere.length) return { cubiertos: 1, total: 1, faltan: [] };
  let cubiertos = 0;
  const faltan = [];
  requiere.forEach((grupo) => {
    if (grupo.some((clave) => contiene(normalizado, clave))) cubiertos += 1;
    else faltan.push(grupo);
  });
  return { cubiertos, total: requiere.length, faltan };
}

// Parecido entre dos frases contando palabras compartidas.
function parecidoFrases(a, b) {
  const pa = palabras(a);
  const pb = palabras(b);
  if (!pa.length || !pb.length) return 0;
  const restantes = pb.slice();
  let comunes = 0;
  pa.forEach((p) => {
    const i = restantes.indexOf(p);
    if (i !== -1) { comunes += 1; restantes.splice(i, 1); }
  });
  return comunes / Math.max(pa.length, pb.length);
}

function frasesDeReferencia(turno) {
  return [turno.modelo].concat(turno.alternativas || []).filter(Boolean);
}

function masParecida(texto, referencias) {
  let mejor = { frase: referencias[0], valor: 0 };
  referencias.forEach((frase) => {
    const valor = parecidoFrases(texto, frase.en);
    if (valor > mejor.valor) mejor = { frase, valor };
  });
  return mejor;
}

/**
 * Evalúa una respuesta.
 *
 * @param {object} opciones
 * @param {string} opciones.texto      lo que has dicho o escrito
 * @param {object} opciones.turno      el turno del guion
 * @param {boolean} opciones.porVoz    true si viene del micrófono
 * @param {string} [opciones.intencion] la frase que pretendías decir,
 *        cuando has usado una de las sugerencias (mejora mucho el
 *        análisis de pronunciación, porque ya se sabe el objetivo)
 */
export function evaluar({ texto, turno, porVoz = false, intencion = null }) {
  const limpio = String(texto || "").trim();
  if (!limpio) {
    return {
      veredicto: "flojo",
      etiqueta: "Sin respuesta",
      corregido: "",
      traduccion: null,
      avisos: [{ tipo: "contenido", motivo: "No he recibido ninguna respuesta." }],
      glosa: [],
      referencia: turno.modelo,
      cobertura: { cubiertos: 0, total: 1 },
    };
  }

  const norm = normalizar(limpio);
  const cob = cobertura(norm, turno.requiere);
  const referencias = frasesDeReferencia(turno);
  const mejor = masParecida(limpio, referencias);

  // --- gramática ---
  const { corregido, avisos: avisosGramatica } = corregir(limpio);

  // --- pronunciación ---
  let avisosPronunciacion = [];
  if (porVoz) {
    const objetivo = intencion || (mejor.valor >= 0.45 ? mejor.frase.en : null);
    if (objetivo) avisosPronunciacion = compararPronunciacion(limpio, objetivo);
  }

  const avisos = avisosGramatica.concat(avisosPronunciacion);

  // --- contenido que falta ---
  if (cob.cubiertos < cob.total) {
    cob.faltan.forEach((grupo) => {
      avisos.push({
        tipo: "contenido",
        motivo: `Falta la idea clave de la respuesta. Se esperaba algo con «${grupo.slice(0, 3).join("» o «")}».`,
        grave: cob.cubiertos === 0,
      });
    });
  }

  // --- traducción de la frase corregida ---
  // Solo se puede traducir de verdad si coincide con una frase del
  // guion. Si no, en vez de inventar una traducción se enseña el
  // significado de cada palabra, que es honesto y además útil.
  const parecidoCorregido = masParecida(corregido, referencias);
  const traduccion = parecidoCorregido.valor >= 0.8 ? parecidoCorregido.frase.es : null;

  // --- glosa palabra a palabra ---
  const glosa = palabras(limpio).map((p) => ({ palabra: p, significado: significado(p) }));

  // --- veredicto ---
  const hayGrave = avisos.some((a) => a.grave);
  const todoCubierto = cob.cubiertos === cob.total;
  // Las notas informativas (falsos amigos y demás) se enseñan, pero
  // no bajan la nota: no son errores, son datos útiles.
  const errores = avisos.filter((a) => !a.informativo);
  let veredicto;
  let etiqueta;

  if (todoCubierto && errores.length === 0) {
    veredicto = "perfecto";
    etiqueta = "¡Perfecto!";
  } else if (todoCubierto && !hayGrave) {
    veredicto = "bien";
    etiqueta = "Bien, con un detalle";
  } else if (cob.cubiertos > 0) {
    veredicto = "casi";
    etiqueta = "Casi: te falta algo";
  } else {
    veredicto = "flojo";
    etiqueta = "Vamos a repasarlo";
  }

  return {
    veredicto,
    etiqueta,
    corregido,
    traduccion,
    avisos,
    glosa,
    referencia: mejor.valor >= 0.45 ? mejor.frase : turno.modelo,
    cobertura: cob,
    parecido: mejor.valor,
  };
}
