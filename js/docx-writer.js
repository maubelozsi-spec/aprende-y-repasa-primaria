// ============================================================
// Escritor mínimo de documentos .docx directamente en el navegador,
// sin dependencias externas: construye un ZIP (método STORE, sin
// compresión) con las 3 partes OOXML imprescindibles para que Word
// abra el documento (Content_Types, _rels/.rels y word/document.xml).
// ============================================================

// ---------------- CRC32 (necesario para las cabeceras ZIP) ----------------

const CRC_TABLE = (() => {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date) {
  const time = ((date.getHours() & 0x1f) << 11) | ((date.getMinutes() & 0x3f) << 5) | ((date.getSeconds() >> 1) & 0x1f);
  const day = (((date.getFullYear() - 1980) & 0x7f) << 9) | (((date.getMonth() + 1) & 0xf) << 5) | (date.getDate() & 0x1f);
  return { time, day };
}

// ---------------- Escritor de bytes con enteros little-endian ----------------

class ByteWriter {
  constructor() {
    this.chunks = [];
    this.length = 0;
  }
  pushBytes(arr) {
    this.chunks.push(arr);
    this.length += arr.length;
  }
  pushUint16(v) {
    this.pushBytes(new Uint8Array([v & 0xff, (v >>> 8) & 0xff]));
  }
  pushUint32(v) {
    this.pushBytes(new Uint8Array([v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff]));
  }
  toUint8Array() {
    const out = new Uint8Array(this.length);
    let offset = 0;
    for (const chunk of this.chunks) {
      out.set(chunk, offset);
      offset += chunk.length;
    }
    return out;
  }
}

// ---------------- ZIP (sin compresión, método STORE) ----------------

function buildZip(files) {
  const encoder = new TextEncoder();
  const localWriter = new ByteWriter();
  const centralWriter = new ByteWriter();
  const { time, day } = dosDateTime(new Date());

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name);
    const data = file.data;
    const crc = crc32(data);
    const offset = localWriter.length;

    localWriter.pushUint32(0x04034b50);
    localWriter.pushUint16(20);
    localWriter.pushUint16(0);
    localWriter.pushUint16(0);
    localWriter.pushUint16(time);
    localWriter.pushUint16(day);
    localWriter.pushUint32(crc);
    localWriter.pushUint32(data.length);
    localWriter.pushUint32(data.length);
    localWriter.pushUint16(nameBytes.length);
    localWriter.pushUint16(0);
    localWriter.pushBytes(nameBytes);
    localWriter.pushBytes(data);

    centralWriter.pushUint32(0x02014b50);
    centralWriter.pushUint16(20);
    centralWriter.pushUint16(20);
    centralWriter.pushUint16(0);
    centralWriter.pushUint16(0);
    centralWriter.pushUint16(time);
    centralWriter.pushUint16(day);
    centralWriter.pushUint32(crc);
    centralWriter.pushUint32(data.length);
    centralWriter.pushUint32(data.length);
    centralWriter.pushUint16(nameBytes.length);
    centralWriter.pushUint16(0);
    centralWriter.pushUint16(0);
    centralWriter.pushUint16(0);
    centralWriter.pushUint16(0);
    centralWriter.pushUint32(0);
    centralWriter.pushUint32(offset);
    centralWriter.pushBytes(nameBytes);
  });

  const centralOffset = localWriter.length;
  const centralSize = centralWriter.length;

  const endWriter = new ByteWriter();
  endWriter.pushUint32(0x06054b50);
  endWriter.pushUint16(0);
  endWriter.pushUint16(0);
  endWriter.pushUint16(files.length);
  endWriter.pushUint16(files.length);
  endWriter.pushUint32(centralSize);
  endWriter.pushUint32(centralOffset);
  endWriter.pushUint16(0);

  const finalWriter = new ByteWriter();
  finalWriter.pushBytes(localWriter.toUint8Array());
  finalWriter.pushBytes(centralWriter.toUint8Array());
  finalWriter.pushBytes(endWriter.toUint8Array());
  return finalWriter.toUint8Array();
}

// ---------------- Contenido OOXML ----------------

const CONTENT_TYPES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;

const RELS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildRunProps(run) {
  let rpr = "";
  if (run.font) rpr += `<w:rFonts w:ascii="${run.font}" w:hAnsi="${run.font}" w:cs="${run.font}"/>`;
  if (run.bold) rpr += "<w:b/>";
  if (run.italic) rpr += "<w:i/>";
  if (run.strike) rpr += "<w:strike/>";
  if (run.color) rpr += `<w:color w:val="${run.color}"/>`;
  const size = run.size || 22;
  rpr += `<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>`;
  if (run.underline) rpr += `<w:u w:val="single"/>`;
  return rpr ? `<w:rPr>${rpr}</w:rPr>` : "";
}

function buildRun(run) {
  if (run.break) return `<w:r><w:br/></w:r>`;
  if (run.tab) return `<w:r>${buildRunProps(run)}<w:tab/></w:r>`;
  return `<w:r>${buildRunProps(run)}<w:t xml:space="preserve">${escapeXml(run.text)}</w:t></w:r>`;
}

function buildParagraph(p) {
  let pPr = "";
  // Word exige este orden dentro de w:pPr: keepNext, pageBreakBefore,
  // pBdr, shd, tabs, spacing, ind, jc.
  if (p.keepNext) pPr += `<w:keepNext/>`;
  if (p.pageBreakBefore) pPr += `<w:pageBreakBefore/>`;
  if (p.border) {
    const color = p.borderColor || "999999";
    pPr += `<w:pBdr><w:top w:val="single" w:sz="8" w:space="6" w:color="${color}"/><w:left w:val="single" w:sz="8" w:space="6" w:color="${color}"/><w:bottom w:val="single" w:sz="8" w:space="6" w:color="${color}"/><w:right w:val="single" w:sz="8" w:space="6" w:color="${color}"/></w:pBdr>`;
  } else if (p.borders) {
    // Bordes sueltos por lado, p. ej. { bottom: { val: "dotted" } } para
    // una línea punteada donde escribir, o { left: { sz: 24 } } para la
    // barra lateral de un título de apartado.
    let bdr = "";
    ["top", "left", "bottom", "right"].forEach((side) => {
      const b = p.borders[side];
      if (b) bdr += `<w:${side} w:val="${b.val || "single"}" w:sz="${b.sz || 4}" w:space="${b.space !== undefined ? b.space : 1}" w:color="${b.color || "000000"}"/>`;
    });
    if (bdr) pPr += `<w:pBdr>${bdr}</w:pBdr>`;
  }
  if (p.shading) {
    pPr += `<w:shd w:val="clear" w:color="auto" w:fill="${p.shading}"/>`;
  }
  // Tabulación con relleno (p. ej. puntos hasta el final de la línea,
  // para dejar una línea de puntos donde escribir).
  if (p.tabLeader) pPr += `<w:tabs><w:tab w:val="right" w:leader="${p.tabLeader.leader || "dot"}" w:pos="${p.tabLeader.pos}"/></w:tabs>`;
  if (p.spacingBefore !== undefined || p.spacingAfter !== undefined || p.line !== undefined) {
    const before = p.spacingBefore !== undefined ? ` w:before="${p.spacingBefore}"` : "";
    const after = p.spacingAfter !== undefined ? ` w:after="${p.spacingAfter}"` : "";
    const line = p.line !== undefined ? ` w:line="${p.line}" w:lineRule="auto"` : "";
    pPr += `<w:spacing${before}${after}${line}/>`;
  }
  if (p.indent) {
    pPr += `<w:ind w:left="${p.indent}" w:right="${p.indent}"/>`;
  }
  if (p.align) pPr += `<w:jc w:val="${p.align}"/>`;

  const pPrXml = pPr ? `<w:pPr>${pPr}</w:pPr>` : "";
  const runsXml = (p.runs || []).map(buildRun).join("");
  return `<w:p>${pPrXml}${runsXml}</w:p>`;
}

function buildTableCellProps(cell, width) {
  let tcPr = `<w:tcW w:w="${width}" w:type="dxa"/>`;
  if (cell.colspan) tcPr += `<w:gridSpan w:val="${cell.colspan}"/>`;
  // Orden que exige Word dentro de w:tcPr: tcW, gridSpan, vMerge,
  // tcBorders, shd, tcMar, vAlign.
  if (cell.vMerge) tcPr += cell.vMerge === "restart" ? `<w:vMerge w:val="restart"/>` : `<w:vMerge/>`;
  if (cell.borders) {
    let bordersXml = "";
    ["top", "left", "bottom", "right"].forEach((side) => {
      const b = cell.borders[side];
      if (b) bordersXml += `<w:${side} w:val="${b.val || "single"}" w:sz="${b.sz || 4}" w:space="0" w:color="${b.color || "000000"}"/>`;
    });
    if (bordersXml) tcPr += `<w:tcBorders>${bordersXml}</w:tcBorders>`;
  }
  if (cell.shading) tcPr += `<w:shd w:val="clear" w:color="auto" w:fill="${cell.shading}"/>`;
  if (cell.margins) {
    let marginsXml = "";
    ["top", "left", "bottom", "right"].forEach((side) => {
      if (cell.margins[side] !== undefined) marginsXml += `<w:${side} w:w="${cell.margins[side]}" w:type="dxa"/>`;
    });
    if (marginsXml) tcPr += `<w:tcMar>${marginsXml}</w:tcMar>`;
  }
  if (cell.vAlign) tcPr += `<w:vAlign w:val="${cell.vAlign}"/>`;
  return `<w:tcPr>${tcPr}</w:tcPr>`;
}

function buildTableCell(cell, width) {
  const tcPr = buildTableCellProps(cell, width);
  const paragraphs = cell.paragraphs && cell.paragraphs.length ? cell.paragraphs : [{ runs: [] }];
  const content = paragraphs.map(buildParagraph).join("");
  return `<w:tc>${tcPr}${content}</w:tc>`;
}

function buildTableRow(row, columnWidths) {
  // Con colspan, el ancho de la celda es la suma de las columnas que
  // ocupa; sin él, cada celda avanza una columna.
  let col = 0;
  const cellsXml = row.cells
    .map((cell) => {
      const span = cell.colspan || 1;
      const width = columnWidths.slice(col, col + span).reduce((a, b) => a + b, 0);
      col += span;
      return buildTableCell(cell, width);
    })
    .join("");
  // cantSplit: la fila no se parte entre dos páginas (un ejercicio
  // enmarcado se queda entero en una sola hoja).
  let trPrInner = row.cantSplit ? `<w:cantSplit/>` : "";
  if (row.height) trPrInner += `<w:trHeight w:val="${row.height}" w:hRule="atLeast"/>`;
  const trPr = trPrInner ? `<w:trPr>${trPrInner}</w:trPr>` : "";
  return `<w:tr>${trPr}${cellsXml}</w:tr>`;
}

function buildTable(table) {
  const gridXml = table.columnWidths.map((w) => `<w:gridCol w:w="${w}"/>`).join("");
  const totalWidth = table.columnWidths.reduce((a, b) => a + b, 0);
  const rowsXml = table.rows.map((row) => buildTableRow(row, table.columnWidths)).join("");
  return `<w:tbl><w:tblPr><w:tblW w:w="${totalWidth}" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders><w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/></w:tblBorders></w:tblPr><w:tblGrid>${gridXml}</w:tblGrid>${rowsXml}</w:tbl>`;
}

function buildBlock(block) {
  return block.table ? buildTable(block.table) : buildParagraph(block);
}

function buildDocumentXml(blocks) {
  const bodyXml = blocks.map(buildBlock).join("\n");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>
${bodyXml}
<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>
</w:body></w:document>`;
}

// ---------------- API pública ----------------

function createDocxBlob(blocks) {
  const encoder = new TextEncoder();
  const documentXml = buildDocumentXml(blocks);

  const files = [
    { name: "[Content_Types].xml", data: encoder.encode(CONTENT_TYPES_XML) },
    { name: "_rels/.rels", data: encoder.encode(RELS_XML) },
    { name: "word/document.xml", data: encoder.encode(documentXml) },
  ];

  const zipBytes = buildZip(files);
  return new Blob([zipBytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ============================================================
// Plantilla de las fichas de cada contenido (Matemáticas y Lengua),
// con la misma maqueta que las fichas de repaso que se usan en clase:
// cabecera con casilla de n.º de lista, tabla de Nombre/Fecha,
// apartados con barra lateral y cada ejercicio en un recuadro con su
// número en una columna a la izquierda y líneas punteadas para
// contestar. Blanco y negro (se imprime bien en cualquier impresora)
// y letra Calibri. La usan js/ficha-generator.js y
// js/lengua-ficha-generator.js.
// ============================================================

const FICHA_FUENTE = "Calibri";
const FICHA_ANCHO = 9638; // ancho útil de un A4 con márgenes de 2 cm (en dxa)
const FICHA_GRIS = "7F7F7F";
const FICHA_GRIS_LINEA = "8C8C8C";
const FICHA_GRIS_MARCO = "BFBFBF";

function fichaBordes(color, sz, val) {
  const b = { color, sz, val };
  return { top: b, left: b, bottom: b, right: b };
}

// Cabecera: casilla «N.º Lista», título en mayúsculas y dos líneas
// de detalle (contenido en negrita y una línea gris en cursiva). Es
// una tabla de dos filas: a la izquierda el rótulo y debajo la
// casilla; a la derecha, los textos ocupando las dos filas.
function fichaCabecera({ titulo, subtitulo, detalle, sinCasilla }) {
  const sinBordes = { top: null, left: null, bottom: null, right: null };
  const textos = [{ runs: [{ text: titulo, bold: true, size: 30 }], spacingAfter: 20 }];
  if (subtitulo) textos.push({ runs: [{ text: subtitulo, bold: true, size: 20 }], spacingAfter: 20 });
  if (detalle) textos.push({ runs: [{ text: detalle, italic: true, size: 17, color: FICHA_GRIS }], spacingAfter: 0 });
  const columnaTextos = { borders: sinBordes, vAlign: "center", margins: { left: 260 }, paragraphs: textos };
  if (sinCasilla) {
    return { table: { columnWidths: [FICHA_ANCHO], rows: [{ cells: [{ ...columnaTextos, margins: { left: 0 } }] }] } };
  }
  return {
    table: {
      columnWidths: [760, FICHA_ANCHO - 760],
      rows: [
        {
          cells: [
            { borders: sinBordes, margins: { left: 0, right: 0 }, paragraphs: [{ runs: [{ text: "N.º Lista", size: 14, color: FICHA_GRIS }], align: "center", spacingAfter: 20 }] },
            { ...columnaTextos, vMerge: "restart" },
          ],
        },
        {
          height: 560,
          cells: [{ borders: fichaBordes(FICHA_GRIS, 6), paragraphs: [{ runs: [{ text: " " }], spacingAfter: 0 }] }, { borders: sinBordes, vMerge: "continue" }],
        },
      ],
    },
  };
}

// Fila de NOMBRE y FECHA en blanco, para rellenar a mano.
function fichaNombreFecha() {
  const marco = fichaBordes("808080", 4);
  const etiqueta = (text) => ({
    borders: marco,
    vAlign: "center",
    margins: { top: 100, bottom: 100, left: 110, right: 110 },
    paragraphs: [{ runs: [{ text, bold: true, size: 16 }], spacingAfter: 0 }],
  });
  const hueco = { borders: marco, paragraphs: [{ runs: [{ text: " ", size: 22 }], spacingAfter: 0 }] };
  return {
    table: {
      columnWidths: [1060, 5300, 860, FICHA_ANCHO - 1060 - 5300 - 860],
      rows: [{ cells: [etiqueta("NOMBRE"), hueco, etiqueta("FECHA"), hueco] }],
    },
  };
}

function fichaSeparador(spacingAfter = 160) {
  return { runs: [{ text: " ", size: 8 }], spacingBefore: 0, spacingAfter };
}

// Título de apartado: barra negra a la izquierda y raya debajo.
function fichaApartado(texto) {
  return {
    runs: [{ text: texto, bold: true, size: 22 }],
    borders: { left: { sz: 24, space: 4 }, bottom: { sz: 8, space: 1 } },
    spacingBefore: 120,
    spacingAfter: 60,
    keepNext: true,
  };
}

// Ancho del texto dentro del recuadro de un ejercicio (columna de
// contenido menos sus márgenes): hasta ahí llegan las líneas de puntos.
const FICHA_ANCHO_RECUADRO = FICHA_ANCHO - 620 - 320;

// Línea de puntos para escribir (tabulación con puntos guía, que
// Word no fusiona aunque haya varias seguidas). Con etiqueta
// («Datos:», «Solución:») esta aparece en gris al principio, como en
// las fichas del aula; con valor (disgrafía) la respuesta ya viene
// escrita.
function fichaLinea({ etiqueta, valor } = {}) {
  const runs = [];
  if (etiqueta) runs.push({ text: `${etiqueta} `, size: 20, color: FICHA_GRIS });
  if (valor) runs.push({ text: `${valor} `, size: 21 });
  runs.push({ tab: true, size: 20, color: FICHA_GRIS_LINEA });
  return { runs, tabLeader: { pos: FICHA_ANCHO_RECUADRO, leader: "dot" }, spacingBefore: 240, spacingAfter: 0 };
}

// Hueco en blanco (sin líneas) para hacer cuentas.
function fichaHueco(lineas, etiqueta) {
  const runs = [];
  if (etiqueta) runs.push({ text: etiqueta, size: 20, color: FICHA_GRIS });
  for (let i = 0; i < lineas; i++) runs.push({ break: true });
  if (!runs.length) runs.push({ text: " " });
  return { runs, spacingBefore: 160, spacingAfter: 0, line: 300 };
}

// Recuadro de un ejercicio: número grande en una columna estrecha
// separada por una raya gruesa, y el contenido a la derecha. La fila
// no se parte entre páginas. saltoPagina lo empieza en hoja nueva
// (TDAH: un ejercicio por página).
function fichaEjercicio(numero, contenido, { saltoPagina } = {}) {
  const marco = FICHA_GRIS_MARCO;
  const celdaNumero = {
    vAlign: "center",
    borders: { top: { color: marco, sz: 4 }, left: { color: marco, sz: 4 }, bottom: { color: marco, sz: 4 }, right: { color: "000000", sz: 18 } },
    paragraphs: [{ runs: [{ text: String(numero), bold: true, size: 28 }], align: "center", spacingAfter: 0 }],
  };
  const celdaContenido = {
    vAlign: "top",
    borders: fichaBordes(marco, 4),
    margins: { top: 100, bottom: 160, left: 160, right: 160 },
    paragraphs: contenido,
  };
  const bloques = [];
  if (saltoPagina) bloques.push({ runs: [{ text: " ", size: 8 }], pageBreakBefore: true, spacingAfter: 0 });
  bloques.push({
    table: {
      columnWidths: [620, FICHA_ANCHO - 620],
      rows: [{ cantSplit: true, cells: [celdaNumero, celdaContenido] }],
    },
  });
  bloques.push(fichaSeparador(200));
  return bloques;
}

// Opciones para rodear (disgrafía), centradas y bien separadas.
function fichaOpciones(opciones) {
  return {
    runs: [{ text: opciones.join("        "), bold: true, size: 24 }],
    align: "center",
    spacingBefore: 160,
    spacingAfter: 40,
  };
}

// Aplica la letra de la plantilla a todos los textos y, con
// agrandar (dislexia), sube el tamaño y el interlineado, también
// dentro de las tablas.
function fichaAplicarEstilo(bloques, { agrandar } = {}) {
  const parrafo = (p) => ({
    ...p,
    line: agrandar ? Math.max(p.line || 240, 336) : p.line,
    spacingBefore: agrandar && p.spacingBefore !== undefined ? Math.round(p.spacingBefore * 1.3) : p.spacingBefore,
    spacingAfter: agrandar && p.spacingAfter !== undefined ? Math.round(p.spacingAfter * 1.3) : p.spacingAfter,
    runs: (p.runs || []).map((r) => (r.break ? r : { ...r, font: r.font || FICHA_FUENTE, size: (r.size || 22) + (agrandar ? 4 : 0) })),
  });
  return bloques.map((b) => {
    if (!b.table) return parrafo(b);
    return {
      table: {
        ...b.table,
        rows: b.table.rows.map((row) => ({
          ...row,
          cells: row.cells.map((cell) => ({ ...cell, paragraphs: (cell.paragraphs || []).map(parrafo) })),
        })),
      },
    };
  });
}

// Cabecera completa (cabecera + Nombre/Fecha) de ficha o solucionario.
function fichaInicio({ area, curso, contenido, fecha, soluciones }) {
  const tipo = soluciones ? "SOLUCIONES" : "FICHA DE REPASO";
  return [
    fichaCabecera({
      titulo: `${tipo} · ${area.toUpperCase()} · ${curso}.º`,
      subtitulo: contenido,
      detalle: `Aprende y repasa · Ficha generada el ${fecha}`,
      sinCasilla: soluciones,
    }),
    fichaSeparador(140),
    ...(soluciones ? [] : [fichaNombreFecha(), fichaSeparador(60)]),
  ];
}
