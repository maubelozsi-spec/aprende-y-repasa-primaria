// ============================================================
// Constructor de documentos de Unidad Didáctica que no encajan en el
// motor de fichas (pregunta/respuesta): documento de explicación +
// solucionario razonado, y reto final + rúbrica. Construidos
// directamente sobre js/docx-writer.js, reutilizando las celdas y
// barras ya definidas en js/lengua-ficha-generator.js.
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

// ---------------- Documento de explicación + solucionario ----------------

function generarDocumentoExplicacion(data, options = {}) {
  const { titulo, subtitulo, teoria = [], ejemplo, comoCorregir = [] } = data;
  const blocks = [];

  blocks.push(...udiTituloBlocks("Documento de explicación y solucionario", titulo));
  if (subtitulo) blocks.push(udiNoteBox(subtitulo));

  teoria.forEach((seccion) => {
    blocks.push(udiHeadingBlock(seccion.heading));
    (seccion.paragraphs || []).forEach((p) => blocks.push(udiParagraphBlock(p)));
  });

  if (ejemplo) {
    blocks.push(udiHeadingBlock(ejemplo.heading || "Ejemplo resuelto"));
    if (ejemplo.titulo) blocks.push(udiParagraphBlock(ejemplo.titulo, { spacingAfter: 80 }));
    (ejemplo.partes || []).forEach((parte) => {
      blocks.push({ runs: [{ text: parte.parte, bold: true, color: "0369A1", size: 20 }], spacingBefore: 60, spacingAfter: 20 });
      blocks.push(udiParagraphBlock(parte.texto, { spacingAfter: 100 }));
    });
  }

  if (comoCorregir.length) {
    blocks.push(udiHeadingBlock("Cómo corregir cada tipo de pregunta"));
    comoCorregir.forEach((item) => {
      blocks.push({ runs: [{ text: item.tipo, bold: true, size: 20 }], spacingBefore: 60, spacingAfter: 20 });
      blocks.push(udiParagraphBlock(item.explicacion, { spacingAfter: 80 }));
      if (item.ejemplo) blocks.push(udiParagraphBlock(`Ejemplo: ${item.ejemplo}`, { italic: true, spacingAfter: 100 }));
    });
  }

  const blob = createDocxBlob(blocks);
  const filename = `explicacion_${data.id || "documento"}.docx`;
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

function generarRetoYRubrica(data, options = {}) {
  const { titulo, consigna = [], pasos = [], criterios = [], niveles = ["Lo consigo", "No del todo", "Con dificultad", "No lo consigo"] } = data;
  const blocks = [];

  blocks.push(...udiTituloBlocks("Reto final", titulo));

  consigna.forEach((p) => blocks.push(udiParagraphBlock(p, { spacingAfter: 80 })));

  if (pasos.length) {
    blocks.push(udiHeadingBlock("Pasos a seguir"));
    pasos.forEach((paso, i) => {
      blocks.push(udiParagraphBlock(`${i + 1}. ${paso}`, { spacingAfter: 60 }));
    });
  }

  blocks.push({ runs: [{ text: " " }], spacingAfter: 40 });
  blocks.push(udiHeadingBlock("Rúbrica sencilla"));

  const columnWidths = [2600, 1734, 1734, 1734, 1734];
  const rows = [udiRubricaHeaderRow(niveles)];
  criterios.forEach((c) => rows.push(udiRubricaRow(c)));
  blocks.push({ table: { columnWidths, rows } });

  const blob = createDocxBlob(blocks);
  const filename = `reto_${data.id || "documento"}.docx`;
  if (options.download === false) return { blob, filename };
  downloadBlob(blob, filename);
  return { blob, filename };
}
