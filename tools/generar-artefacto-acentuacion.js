#!/usr/bin/env node
// ============================================================
// Genera la versión autónoma de "El Pórtico de las Tildes" para
// publicarla como artefacto en claude.ai.
//
//   node tools/generar-artefacto-acentuacion.js <fichero-de-salida> [--autonomo]
//
// Sin --autonomo produce el trozo de HTML que espera claude.ai, que pone
// el <html>/<head>/<body> por su cuenta. Con --autonomo produce un
// documento completo: un único archivo que se abre con doble clic, sirve
// para repartir por correo o Classroom y funciona sin conexión salvo por
// las tipografías.
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

const argumentos = process.argv.slice(2);
const autonomo = argumentos.indexOf("--autonomo") >= 0;
const salida = argumentos.filter((a) => a.indexOf("--") !== 0)[0];
if (!salida) {
  console.error("Uso: node tools/generar-artefacto-acentuacion.js <fichero-de-salida> [--autonomo]");
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

const cabecera = "<title>" + titulo + "</title>\n" + fuentes + "\n" + estilos;

// El artefacto se apoya en el esqueleto que añade claude.ai (juego de
// caracteres, viewport y los márgenes de seguridad del móvil). Fuera de
// allí hay que escribirlo.
const documento = autonomo
  ? '<!DOCTYPE html>\n<html lang="es-ES">\n<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">\n' +
    '<meta name="description" content="Juego de acentuación para 3.er ciclo de Primaria: agudas, llanas, esdrújulas, sobresdrújulas, diptongo, hiato y triptongo.">\n' +
    cabecera + "\n" +
    "<style>\n" +
    "  :root{padding-top:env(safe-area-inset-top,0px); padding-bottom:env(safe-area-inset-bottom,0px)}\n" +
    "  html{color-scheme:light dark}\n" +
    "  body{margin:0}\n" +
    "  img{max-width:100%}\n" +
    "  [hidden]{display:none!important}\n" +
    "</style>\n</head>\n<body>\n\n" + cuerpo + "\n</body>\n</html>\n"
  : cabecera + "\n\n" + cuerpo + "\n";

fs.writeFileSync(salida, documento);

const palabras = (banco.match(/\["[^"]+",\s*\d+,\s*"/g) || []).length;
console.log("Escrito " + salida);
console.log("  formato: " + (autonomo ? "documento autónomo" : "artefacto de claude.ai"));
console.log("  título: " + titulo);
console.log("  palabras del banco incrustadas: " + palabras);
