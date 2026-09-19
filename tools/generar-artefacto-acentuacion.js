#!/usr/bin/env node
// ============================================================
// Genera la versión autónoma de "El Pórtico de las Tildes" para
// publicarla como artefacto en claude.ai.
//
//   node tools/generar-artefacto-acentuacion.js <fichero-de-salida>
//
// La página del repositorio (lengua/juego-acentuacion.html) es la
// fuente: carga el banco de palabras desde js/acentuacion-banco.js.
// El artefacto no puede cargar archivos externos, así que este script
// incrusta el banco dentro del HTML y quita lo que solo tiene sentido
// dentro del sitio (el enlace "Volver a Lengua" y el esqueleto
// <html>/<head>/<body>, que claude.ai añade por su cuenta).
//
// Es opcional: el sitio funciona sin ejecutarlo nunca. Solo hace falta
// cuando se añaden palabras al banco y se quiere actualizar el
// artefacto publicado.
// ============================================================

const fs = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");
const ORIGEN = path.join(raiz, "lengua", "juego-acentuacion.html");
const BANCO = path.join(raiz, "js", "acentuacion-banco.js");

const salida = process.argv[2];
if (!salida) {
  console.error("Uso: node tools/generar-artefacto-acentuacion.js <fichero-de-salida>");
  process.exit(1);
}

const html = fs.readFileSync(ORIGEN, "utf8");
const banco = fs.readFileSync(BANCO, "utf8");

function extraer(expresion, descripcion) {
  const m = html.match(expresion);
  if (!m) {
    console.error("No encuentro " + descripcion + " en " + ORIGEN);
    process.exit(1);
  }
  return m;
}

// Título sin el sufijo del sitio: en la galería de artefactos sobra.
const titulo = extraer(/<title>([^<]*)<\/title>/, "el título")[1].replace(/\s*·.*$/, "");
const fuentes = extraer(/(<link rel="preconnect"[\s\S]*?display=swap">)/, "los enlaces de tipografías")[1];
const estilos = extraer(/(<style>\n:root\{[\s\S]*?<\/style>)/, "la hoja de estilos del juego")[1];
let cuerpo = extraer(/<body>\n([\s\S]*?)\n<\/body>/, "el cuerpo de la página")[1];

// El enlace de vuelta al índice de Lengua no lleva a ningún sitio fuera del sitio.
cuerpo = cuerpo.replace(/\n*\s*<p class="volver">[\s\S]*?<\/p>\n/, "\n");

// El banco se incrusta: el artefacto no puede cargar scripts del repositorio.
const etiqueta = '<script src="../js/acentuacion-banco.js"></script>';
if (cuerpo.indexOf(etiqueta) < 0) {
  console.error("No encuentro la etiqueta que carga el banco de palabras.");
  process.exit(1);
}
cuerpo = cuerpo.replace(
  etiqueta,
  "<script>\n/* === copia literal de js/acentuacion-banco.js === */\n" + banco.trimEnd() + "\n</script>"
);

fs.writeFileSync(salida, "<title>" + titulo + "</title>\n" + fuentes + "\n" + estilos + "\n\n" + cuerpo + "\n");

const palabras = (banco.match(/\["[^"]+",\s*\d+,\s*"/g) || []).length;
console.log("Escrito " + salida);
console.log("  título: " + titulo);
console.log("  palabras del banco incrustadas: " + palabras);
