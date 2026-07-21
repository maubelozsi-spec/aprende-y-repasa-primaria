// ============================================================
// Constructor de documentos de Unidad Didáctica que no encajan en el
// motor de fichas (pregunta/respuesta): documento de explicación +
// solucionario razonado, y reto final + rúbrica. Construidos
// directamente sobre js/docx-writer.js, reutilizando las celdas y
// barras ya definidas en js/lengua-ficha-generator.js.
//
// Igual que en el resto de la app, dislexia y TDAH son adaptaciones
// de FORMATO (mismo contenido, letra más grande / bloques cortos con
// autocontrol) y ACS es la única que cambia el CONTENIDO: si el
// fichero de la UDI aporta un `variantesACS` con una versión más
// sencilla, se usa esa; si no, se genera la versión estándar.
// ============================================================

function udiTituloBlocks(eyebrow, titulo) {
  return [
    { runs: [{ text: eyebrow, bold: true, size: 18, color: "595959" }], spacingAfter: 30 },
    { runs: [{ text: titulo, bold: true, size: 32 }], spacingAfter: 140 },
  ];
}

function udiHeadingBlock(text) {
  return { runs: [{ text, bold: true, size: 24, color: "1F2937" }], spacingBefore: 160, spacingAfter: 80 };
}

function udiParagraphBlock(text, options = {}) {
  return { runs: [{ text, italic: !!options.italic }], spacingAfter: options.spacingAfter ?? 60 };
}

function udiNoteBox(text) {
  return { runs: [{ text }], border: true, shading: "D9D9D9", spacingAfter: 100 };
}

function udiCheckboxBlock() {
  return { runs: [{ text: "He terminado esta parte  ☐", bold: true, color: "B45309" }], border: true, shading: "FDF0DC", spacingBefore: 40, spacingAfter: 160 };
}

// ---------------- Adaptaciones de formato (dislexia / TDAH) ----------------

function udiApplyDislexiaStyling(blocks) {
  return blocks.map((b) => {
    if (b.table) {
      return {
        table: {
          ...b.table,
          rows: b.table.rows.map((row) => ({
            cells: row.cells.map((cell) => ({
              ...cell,
              paragraphs: (cell.paragraphs || []).map((p) => ({
                ...p,
                runs: p.runs.map((r) => (r.break ? r : { ...r, size: (r.size || 20) + 4 })),
              })),
            })),
          })),
        },
      };
    }
    return {
      ...b,
      spacingBefore: b.spacingBefore !== undefined ? Math.round(b.spacingBefore * 1.3) : b.spacingBefore,
      spacingAfter: b.spacingAfter !== undefined ? Math.round(b.spacingAfter * 1.3) : b.spacingAfter,
      runs: (b.runs || []).map((r) => (r.break ? r : { ...r, size: (r.size || 22) + 6 })),
    };
  });
}

// Agrupa bloques en "secciones" cortas: en TDAH, cada sección empieza
// en página nueva y termina con una casilla de autocontrol, para
// trabajar de una en una sin saturar la vista (misma filosofía que ya
// aplica js/lengua-ficha-generator.js a las fichas de pregunta/respuesta).
function udiFlattenSecciones(secciones, dificultad) {
  const blocks = [];
  secciones.forEach((seccion, i) => {
    seccion.forEach((block, j) => {
      if (dificultad === "tdah" && i > 0 && j === 0) blocks.push({ ...block, pageBreakBefore: true });
      else blocks.push(block);
    });
    if (dificultad === "tdah") blocks.push(udiCheckboxBlock());
  });
  return blocks;
}

// ---------------- Documento de explicación + solucionario ----------------

function generarDocumentoExplicacion(dataBase, dificultad = "none", options = {}) {
  const data = (dificultad === "acs" && dataBase.variantesACS) ? { ...dataBase, ...dataBase.variantesACS } : dataBase;
  const { titulo, subtitulo, teoria = [], ejemplo, comoCorregir = [] } = data;

  const cabecera = udiTituloBlocks("Documento de explicación y solucionario", titulo);
  if (subtitulo) cabecera.push(udiNoteBox(subtitulo));

  const secciones = [];

  teoria.forEach((seccion) => {
    const group = [udiHeadingBlock(seccion.heading)];
    (seccion.paragraphs || []).forEach((p) => group.push(udiParagraphBlock(p)));
    secciones.push(group);
  });

  if (ejemplo) {
    const group = [udiHeadingBlock(ejemplo.heading || "Ejemplo resuelto")];
    if (ejemplo.titulo) group.push(udiParagraphBlock(ejemplo.titulo, { spacingAfter: 80 }));
    (ejemplo.partes || []).forEach((parte) => {
      group.push({ runs: [{ text: parte.parte, bold: true, color: "0369A1", size: 20 }], spacingBefore: 60, spacingAfter: 20 });
      group.push(udiParagraphBlock(parte.texto, { spacingAfter: 100 }));
    });
    secciones.push(group);
  }

  if (comoCorregir.length) {
    comoCorregir.forEach((item, i) => {
      const group = [];
      if (i === 0) group.push(udiHeadingBlock("Cómo corregir cada tipo de pregunta"));
      group.push({ runs: [{ text: item.tipo, bold: true, size: 20 }], spacingBefore: 60, spacingAfter: 20 });
      group.push(udiParagraphBlock(item.explicacion, { spacingAfter: 80 }));
      if (item.ejemplo) group.push(udiParagraphBlock(`Ejemplo: ${item.ejemplo}`, { italic: true, spacingAfter: 100 }));
      secciones.push(group);
    });
  }

  let blocks = [...cabecera, ...udiFlattenSecciones(secciones, dificultad)];
  if (dificultad === "dislexia") blocks = udiApplyDislexiaStyling(blocks);

  const blob = createDocxBlob(blocks);
  const sufijo = dificultad && dificultad !== "none" ? `_${dificultad}` : "";
  const filename = `explicacion_${data.id || "documento"}${sufijo}.docx`;
  if (options.download === false) return { blob, filename };
  downloadBlob(blob, filename);
  return { blob, filename };
}

// ---------------- Reto final + rúbrica ----------------

function udiRubricaHeaderRow(niveles) {
  const cells = [lenguaLabelCell("Objetivo")];
  niveles.forEach((n) => cells.push(lenguaLabelCell(n)));
  return { cells };
}

function udiRubricaRow(criterio) {
  const cells = [lenguaValueCell(criterio.nombre)];
  criterio.niveles.forEach((texto) => {
    cells.push({
      borders: lenguaAllBorders("808080", 4),
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      paragraphs: [{ runs: [{ text: texto, size: 18 }] }],
    });
  });
  return { cells };
}

function generarRetoYRubrica(dataBase, dificultad = "none", options = {}) {
  const data = (dificultad === "acs" && dataBase.variantesACS) ? { ...dataBase, ...dataBase.variantesACS } : dataBase;
  const {
    titulo, consigna = [], pasos = [], criterios = [],
    niveles = ["Lo consigo", "No del todo", "Con dificultad", "No lo consigo"],
  } = data;

  const cabecera = udiTituloBlocks("Reto final", titulo);

  const secciones = [];

  if (consigna.length) {
    secciones.push(consigna.map((p) => udiParagraphBlock(p, { spacingAfter: 80 })));
  }

  pasos.forEach((paso, i) => {
    const group = [];
    if (i === 0) group.push(udiHeadingBlock("Pasos a seguir"));
    group.push(udiParagraphBlock(`${i + 1}. ${paso}`, { spacingAfter: 60 }));
    secciones.push(group);
  });

  let blocks = [...cabecera, ...udiFlattenSecciones(secciones, dificultad)];
  if (dificultad === "dislexia") blocks = udiApplyDislexiaStyling(blocks);

  blocks.push({ runs: [{ text: " " }], spacingAfter: 40, pageBreakBefore: dificultad === "tdah" });
  blocks.push(dificultad === "dislexia" ? udiApplyDislexiaStyling([udiHeadingBlock("Rúbrica sencilla")])[0] : udiHeadingBlock("Rúbrica sencilla"));

  const columnWidths = [2600, 1734, 1734, 1734, 1734];
  const rows = [udiRubricaHeaderRow(niveles)];
  criterios.forEach((c) => rows.push(udiRubricaRow(c)));
  const tableBlock = { table: { columnWidths, rows } };
  blocks.push(dificultad === "dislexia" ? udiApplyDislexiaStyling([tableBlock])[0] : tableBlock);

  const blob = createDocxBlob(blocks);
  const sufijo = dificultad && dificultad !== "none" ? `_${dificultad}` : "";
  const filename = `reto_${data.id || "documento"}${sufijo}.docx`;
  if (options.download === false) return { blob, filename };
  downloadBlob(blob, filename);
  return { blob, filename };
}
