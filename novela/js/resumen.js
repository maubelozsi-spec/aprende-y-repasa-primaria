// ============================================================
// Novela Colectiva — resumen automático.
//
// Sirve para lo que pide cualquiera que llega nuevo a la sesión:
// "¿por dónde va la novela?". Se hace con extracción, sin IA y sin
// coste: la primera frase de cada tanda es casi siempre la que
// mueve la acción, y las fichas ya nos dicen quién es quién.
//
// El docente puede escribir además un resumen a mano (resumenManual
// en el proyecto), que se muestra por delante de este.
// ============================================================

const CHISPAS = [
  "Aparece alguien que no esperaba nadie.",
  "Se descubre que uno de los personajes ocultaba algo.",
  "Algo se rompe, se pierde o desaparece justo cuando hacía falta.",
  "Llega una carta, un mensaje o una señal.",
  "Cambia el tiempo: empieza una tormenta y hay que buscar refugio.",
  "Dos personajes discuten y se separan.",
  "Alguien encuentra una puerta, un pasadizo o un camino nuevo.",
  "Se acaba el tiempo para hacer algo importante.",
  "Un personaje tiene que elegir entre dos cosas y las dos son malas.",
  "Aparece una pista sobre el misterio principal.",
  "Alguien ayuda cuando menos se lo esperaban.",
  "Se cumple (o se rompe) una promesa.",
];

function frases(texto) {
  return String(texto || "")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((f) => f.trim())
    .filter((f) => f.length > 12);
}

// Resumen de un capítulo que se va a cerrar. Se propone al docente
// ya escrito, para que solo tenga que retocarlo: la primera frase de
// la primera parte sitúa, la última de la última cierra, y en medio
// van los personajes y lugares que de verdad salen en el capítulo.
export function resumenDeCapitulo(fragmentos, fichas) {
  const partes = (fragmentos || []).filter((f) => f.estado !== "oculto");
  if (!partes.length) return "";

  const texto = partes.map((f) => f.texto).join("\n");
  const todas = frases(texto);
  const trozos = [];
  if (todas.length) trozos.push(todas[0]);
  if (todas.length > 2) trozos.push(todas[Math.floor(todas.length / 2)]);
  if (todas.length > 1) trozos.push(todas[todas.length - 1]);

  const bajo = texto.toLowerCase();
  const salen = (tipo) => (fichas || [])
    .filter((f) => f.tipo === tipo && bajo.includes(String(f.nombre).toLowerCase()))
    .map((f) => f.nombre);

  const personajes = salen("personaje");
  const lugares = salen("lugar");
  const cola = [];
  if (personajes.length) cola.push("Salen: " + personajes.join(", ") + ".");
  if (lugares.length) cola.push("Transcurre en: " + lugares.join(", ") + ".");

  return trozos.join(" ") + (cola.length ? " " + cola.join(" ") : "");
}

export function construirResumen(proyecto, fragmentos, fichas) {
  const publicados = (fragmentos || []).filter((f) => f.estado !== "oculto");
  const texto = publicados.map((f) => f.texto).join("\n");
  const personajes = (fichas || []).filter((f) => f.tipo === "personaje");
  const lugares = (fichas || []).filter((f) => f.tipo === "lugar");
  const inventos = (fichas || []).filter((f) => f.tipo === "invento");

  const autores = new Set(publicados.map((f) => f.autorCode));
  const palabras = publicados.reduce((s, f) => s + (f.palabras || 0), 0);

  // cómo empieza: primera frase del primer fragmento
  const inicio = publicados.length ? (frases(publicados[0].texto)[0] || "") : "";

  // por dónde va: últimas frases publicadas
  const ultimas = [];
  for (let i = publicados.length - 1; i >= 0 && ultimas.length < 3; i--) {
    const fs = frases(publicados[i].texto);
    if (fs.length) ultimas.unshift(fs[fs.length - 1]);
  }

  // hilos abiertos: preguntas sin responder y promesas
  const hilos = [];
  for (const f of publicados.slice(-6)) {
    for (const fr of frases(f.texto)) {
      if (/\?$/.test(fr) || /\b(secreto|misterio|nadie sabía|no sabía|tenía que|prometió|buscaba|desapareció|escondía)\b/i.test(fr)) {
        if (hilos.length < 4 && !hilos.includes(fr)) hilos.push(fr);
      }
    }
  }

  // quién aparece más
  const apariciones = personajes.map((p) => {
    const re = new RegExp("\\b" + p.nombre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "gi");
    return { nombre: p.nombre, veces: (texto.match(re) || []).length, ficha: p };
  }).sort((a, b) => b.veces - a.veces);

  const desaparecidos = apariciones.filter((a) => a.veces > 0 && !ultimosFragmentosCitan(publicados, a.nombre));

  return {
    titulo: proyecto.titulo,
    manual: proyecto.resumenManual || "",
    numFragmentos: publicados.length,
    numAutores: autores.size,
    numPalabras: palabras,
    inicio: inicio,
    ultimas: ultimas,
    hilos: hilos,
    personajes: apariciones,
    lugares: lugares.map((l) => l.nombre),
    inventos: inventos.map((i) => i.nombre),
    desaparecidos: desaparecidos.map((d) => d.nombre),
  };
}

function ultimosFragmentosCitan(fragmentos, nombre) {
  const re = new RegExp("\\b" + nombre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
  return fragmentos.slice(-3).some((f) => re.test(f.texto));
}

// Tres ideas para quien se queda en blanco. Se construyen con los
// personajes y lugares de ESTA novela, así que nunca suenan a
// plantilla genérica.
export function chispas(resumen) {
  const ideas = [];
  const barajadas = CHISPAS.slice().sort(() => Math.random() - 0.5);
  const personaje = resumen.personajes.length
    ? resumen.personajes[Math.floor(Math.random() * resumen.personajes.length)].nombre : null;
  const olvidado = resumen.desaparecidos.length ? resumen.desaparecidos[0] : null;
  const lugar = resumen.lugares.length
    ? resumen.lugares[Math.floor(Math.random() * resumen.lugares.length)] : null;

  ideas.push(barajadas[0]);
  if (olvidado) ideas.push(`Hace un rato que no sabemos nada de ${olvidado}. ¿Qué ha estado haciendo?`);
  else if (personaje) ideas.push(`Cuenta qué está pensando ${personaje} en este momento.`);
  if (lugar) ideas.push(`Lleva la acción a ${lugar} y describe qué se oye al llegar.`);
  else ideas.push(barajadas[1]);
  if (resumen.hilos.length) ideas.push("Responde a esto que quedó en el aire: “" + resumen.hilos[0] + "”");
  return ideas.slice(0, 3);
}
