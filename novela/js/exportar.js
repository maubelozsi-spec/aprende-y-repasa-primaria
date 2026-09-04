// ============================================================
// Novela Colectiva — el documento final.
//
// Cuando la novela se da por terminada se puede descargar en PDF,
// en dos versiones:
//
//   · Novela: la portada, el texto seguido y los créditos de la
//     clase. Es la que se imprime, se enseña en casa o se sube al
//     blog del cole.
//   · Cuaderno del docente: lo mismo, pero con el autor de cada
//     parte, el número de palabras, las faltas por cada cien
//     palabras y las indicaciones que se enviaron. Sirve para
//     evaluar sin tener que ir contando a mano.
// ============================================================

import { nuevoDocumento, descargar } from "./pdf.js";
import { indiceDeFaltas } from "./corrector.js";
import { TIPOS } from "./fichas.js";

function fechaLarga() {
  return new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

function portada(doc, proyecto, datos, subtitulo, dibujo) {
  // Si la clase ha elegido una portada dibujada, va arriba y el
  // título debajo. Si no entra o no es un JPEG legible, el libro
  // sale como siempre: la portada nunca puede impedir la descarga.
  let conDibujo = false;
  if (dibujo && dibujo.imagen) {
    doc.salto(40);
    conDibujo = doc.imagen(dibujo.imagen, { ancho: 300 });
    if (conDibujo) doc.salto(24);
  }
  if (!conDibujo) doc.salto(150);
  doc.parrafo(proyecto.titulo, { fuente: "titular", tamano: 26, centrado: true, interlineado: 32 });
  doc.salto(10);
  doc.parrafo(subtitulo, { fuente: "cursiva", tamano: 13, centrado: true, gris: true });
  doc.salto(40);
  const s = proyecto.semilla || {};
  const rasgos = [s.genero, s.epoca, s.tono].filter(Boolean).join(" · ");
  if (rasgos) doc.parrafo(rasgos, { fuente: "pie", tamano: 11, centrado: true, gris: true });
  doc.salto(30);
  const quienes = datos.autores === 1 ? "Escrita por 1 autor o autora" : "Escrita entre " + datos.autores + " autores y autoras";
  const cuantas = datos.fragmentos === 1 ? "1 aportación" : datos.fragmentos + " aportaciones";
  doc.parrafo(quienes + " · " + cuantas + " · " + datos.palabras + " palabras",
    { fuente: "pie", tamano: 10, centrado: true, gris: true });
  doc.parrafo(fechaLarga(), { fuente: "pie", tamano: 10, centrado: true, gris: true });
  doc.saltoDePagina();
}

function creditos(doc, autores) {
  doc.saltoDePagina();
  doc.parrafo("Quiénes la han escrito", { fuente: "titular", tamano: 15 });
  doc.salto(6);
  doc.parrafo("Esta novela la ha escrito entre todos el grupo, por turnos, sin saber " +
    "de antemano cómo iba a acabar. Cada uno escribió su parte y la fue enlazando con la anterior.",
    { fuente: "normal", tamano: 11 });
  doc.salto(6);
  doc.parrafo(autores.join(" · "), { fuente: "negrita", tamano: 11 });
}

function anexoFichas(doc, fichas) {
  if (!fichas.length) return;
  doc.saltoDePagina();
  doc.parrafo("Quién es quién y qué es qué", { fuente: "titular", tamano: 15 });
  doc.salto(8);
  for (const tipo of ["personaje", "lugar", "invento"]) {
    const grupo = fichas.filter((f) => f.tipo === tipo);
    if (!grupo.length) continue;
    doc.parrafo(TIPOS[tipo].etiqueta + "s", { fuente: "negrita", tamano: 12 });
    doc.salto(2);
    for (const f of grupo) {
      const partes = (TIPOS[tipo].preguntas || [])
        .map((p) => (f.respuestas || {})[p.id])
        .filter(Boolean);
      doc.parrafo(f.nombre + " — " + partes.join(" ") , { fuente: "normal", tamano: 10.5, interlineado: 14 });
      doc.salto(3);
    }
    doc.salto(6);
  }
}

// ---------- versión para leer ----------

export function descargarNovela(proyecto, fragmentos, fichas, alumnos, dibujoPortada) {
  const publicados = fragmentos.filter((f) => f.estado === "publicado");
  const autores = Array.from(new Set(publicados.map((f) => f.autorCode)))
    .map((c) => nombreDe(alumnos, c));
  const doc = nuevoDocumento({ titulo: proyecto.titulo });

  portada(doc, proyecto, {
    autores: new Set(publicados.map((f) => f.autorCode)).size,
    fragmentos: publicados.length,
    palabras: publicados.reduce((s, f) => s + (f.palabras || 0), 0),
  }, "Una novela escrita entre toda la clase", dibujoPortada);

  doc.parrafo(proyecto.titulo, { fuente: "titular", tamano: 16, centrado: true });
  doc.salto(16);

  // Con capítulos cerrados, cada uno abre con su título y su
  // resumen; sin ellos, el texto va seguido como siempre.
  const cerrados = proyecto.capitulos || [];
  let capituloAnterior = null;
  for (const f of publicados) {
    const cap = f.capitulo || 1;
    if (cerrados.length && cap !== capituloAnterior) {
      capituloAnterior = cap;
      const info = cerrados.find((c) => c.numero === cap);
      if (info) {
        doc.salto(10);
        doc.parrafo(info.titulo, { fuente: "titular", tamano: 14, centrado: true });
        if (info.resumen) {
          doc.salto(4);
          doc.parrafo(info.resumen, { fuente: "cursiva", tamano: 10, centrado: true, gris: true, interlineado: 14 });
        }
        doc.salto(12);
      }
    }
    doc.parrafo(f.texto, { fuente: "normal", tamano: 11.5, interlineado: 17 });
    doc.salto(9);
  }

  anexoFichas(doc, fichas);
  creditos(doc, autores);
  if (dibujoPortada && dibujoPortada.autorCode) {
    doc.salto(10);
    doc.parrafo("Portada dibujada por " + nombreDe(alumnos, dibujoPortada.autorCode) + ".",
      { fuente: "cursiva", tamano: 10.5, gris: true });
  }
  descargar(doc.aBlob(), nombreArchivo(proyecto, "novela"));
}

// ---------- informe de evaluación en CSV ----------
//
// Lo mismo que el cuaderno del docente, pero para abrirlo en la hoja
// de cálculo y poner notas al lado. Se usa punto y coma y se pone el
// BOM porque es lo que espera el Excel en español; con coma y sin
// BOM, las tildes salen rotas y todo cae en una sola columna.

function celda(valor) {
  const t = String(valor == null ? "" : valor);
  return /[";\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
}

export function descargarInformeCSV(proyecto, fragmentos, notas, alumnos) {
  const publicados = fragmentos.filter((f) => f.estado !== "oculto" && f.estado !== "papelera");
  const porAlumno = new Map();
  for (const a of alumnos || []) {
    if ((proyecto.participantes || []).includes(a.code)) {
      porAlumno.set(a.code, { partes: 0, palabras: 0, faltas: 0, total: 0, editadas: 0, primera: null, ultima: null });
    }
  }
  for (const f of publicados) {
    const d = porAlumno.get(f.autorCode) ||
      { partes: 0, palabras: 0, faltas: 0, total: 0, editadas: 0, primera: null, ultima: null };
    const idx = indiceDeFaltas(f.textoOriginal || f.texto);
    d.partes++;
    d.palabras += idx.palabras;
    d.faltas += idx.faltas;
    d.total += idx.palabras;
    if (f.vecesEditado) d.editadas++;
    const cuando = f.creadoEn && f.creadoEn.toDate ? f.creadoEn.toDate() : null;
    if (cuando) {
      if (!d.primera || cuando < d.primera) d.primera = cuando;
      if (!d.ultima || cuando > d.ultima) d.ultima = cuando;
    }
    porAlumno.set(f.autorCode, d);
  }

  const notasPorAlumno = new Map();
  for (const n of notas || []) {
    notasPorAlumno.set(n.destinatarioCode, (notasPorAlumno.get(n.destinatarioCode) || 0) + 1);
  }

  const fecha = (d) => (d ? d.toLocaleDateString("es-ES") : "");
  const filas = [[
    "Alumno", "Código", "Partes", "Palabras", "Palabras por parte",
    "Faltas", "Faltas por 100 palabras", "Partes corregidas",
    "Indicaciones recibidas", "Primera vez", "Última vez",
  ]];

  const orden = Array.from(porAlumno.entries()).sort((a, b) => b[1].palabras - a[1].palabras);
  for (const [codigo, d] of orden) {
    const por100 = d.total ? Math.round((d.faltas * 1000) / d.total) / 10 : 0;
    const porParte = d.partes ? Math.round(d.palabras / d.partes) : 0;
    filas.push([
      nombreDe(alumnos, codigo), codigo, d.partes, d.palabras, porParte,
      d.faltas, String(por100).replace(".", ","), d.editadas,
      notasPorAlumno.get(codigo) || 0, fecha(d.primera), fecha(d.ultima),
    ]);
  }

  const texto = "﻿" + filas.map((f) => f.map(celda).join(";")).join("\r\n");
  descargar(new Blob([texto], { type: "text/csv;charset=utf-8" }),
    nombreArchivo(proyecto, "evaluacion").replace(/\.pdf$/, ".csv"));
}

// ---------- versión de trabajo para el docente ----------

export function descargarCuadernoDocente(proyecto, fragmentos, fichas, notas, alumnos) {
  const doc = nuevoDocumento({ titulo: proyecto.titulo + " (cuaderno del docente)" });
  const publicados = fragmentos.filter((f) => f.estado !== "oculto" && f.estado !== "papelera");

  portada(doc, proyecto, {
    autores: new Set(publicados.map((f) => f.autorCode)).size,
    fragmentos: publicados.length,
    palabras: publicados.reduce((s, f) => s + (f.palabras || 0), 0),
  }, "Cuaderno del docente: autoría, correcciones y datos de participación");

  // 1. la novela con autoría
  doc.parrafo("La novela, parte por parte", { fuente: "titular", tamano: 15 });
  doc.salto(10);
  for (const f of publicados) {
    const datos = indiceDeFaltas(f.textoOriginal || f.texto);
    doc.parrafo(
      "#" + f.orden + " · " + nombreDe(alumnos, f.autorCode) + " (" + f.autorCode + ") · " +
      datos.palabras + " palabras · " + datos.por100 + " faltas por cada 100 palabras" +
      (f.vecesEditado ? " · corregido " + f.vecesEditado + " vez/veces" : "") +
      (f.estado === "pendiente" ? " · PENDIENTE DE APROBAR" : ""),
      { fuente: "pie", tamano: 9, gris: true, interlineado: 12 }
    );
    doc.parrafo(f.texto, { fuente: "normal", tamano: 11, interlineado: 16 });
    if (f.textoOriginal && f.textoOriginal !== f.texto) {
      doc.parrafo("Texto original antes de corregir: " + f.textoOriginal,
        { fuente: "cursiva", tamano: 9.5, gris: true, interlineado: 13, sangria: 20 });
    }
    doc.salto(10);
  }

  // 2. participación
  doc.saltoDePagina();
  doc.parrafo("Participación de cada alumno", { fuente: "titular", tamano: 15 });
  doc.salto(10);
  const porAlumno = new Map();
  for (const f of publicados) {
    const d = porAlumno.get(f.autorCode) || { partes: 0, palabras: 0, faltas: 0, total: 0 };
    const idx = indiceDeFaltas(f.textoOriginal || f.texto);
    d.partes++; d.palabras += idx.palabras; d.faltas += idx.faltas; d.total += idx.palabras;
    porAlumno.set(f.autorCode, d);
  }
  for (const [codigo, d] of Array.from(porAlumno.entries()).sort((a, b) => b[1].palabras - a[1].palabras)) {
    const por100 = Math.round((d.faltas * 1000) / (d.total || 1)) / 10;
    doc.parrafo(nombreDe(alumnos, codigo) + " (" + codigo + "): " + d.partes + " partes, " +
      d.palabras + " palabras, " + por100 + " faltas por cada 100 palabras",
      { fuente: "normal", tamano: 10.5, interlineado: 15 });
  }
  const sinEscribir = (alumnos || []).filter((a) => !porAlumno.has(a.code));
  if (sinEscribir.length) {
    doc.salto(8);
    doc.parrafo("Todavía no han escrito nada: " +
      sinEscribir.map((a) => (a.nickname || a.code) + " (" + a.code + ")").join(", "),
      { fuente: "cursiva", tamano: 10.5, interlineado: 15 });
  }

  // 3. indicaciones enviadas
  if (notas && notas.length) {
    doc.saltoDePagina();
    doc.parrafo("Indicaciones enviadas", { fuente: "titular", tamano: 15 });
    doc.salto(10);
    for (const n of notas) {
      doc.parrafo("A " + nombreDe(alumnos, n.destinatarioCode) + " (" + n.destinatarioCode + ")" +
        (n.leido ? " · leída" : " · sin leer"),
        { fuente: "pie", tamano: 9, gris: true, interlineado: 12 });
      doc.parrafo(n.texto, { fuente: "normal", tamano: 10.5, interlineado: 15 });
      doc.salto(6);
    }
  }

  anexoFichas(doc, fichas);
  descargar(doc.aBlob(), nombreArchivo(proyecto, "cuaderno-docente"));
}

function nombreDe(alumnos, codigo) {
  const a = (alumnos || []).find((x) => x.code === codigo);
  return a ? (a.nickname || a.code) : codigo;
}

function nombreArchivo(proyecto, sufijo) {
  const limpio = String(proyecto.titulo || "novela")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  return (limpio || "novela") + "-" + sufijo + ".pdf";
}
