// ============================================================
// Generador de exámenes mixtos de Lengua: combina preguntas de varios
// temas registrados en LENGUA_FICHA_CONFIG en una única prueba,
// reutilizando lenguaPickProblems (que ya sabe resolver acs/dislexia/
// tdah/discalculia/altas/disgrafia) y el motor docx-writer.js. A
// diferencia de examen-generator.js (Matemáticas), este sí admite
// dificultad desde el principio.
// ============================================================

function buildLenguaExamenHeaderBlocks(curso, fecha, temaLabels, dificultad) {
  const contenidoText = temaLabels.length <= 3 ? temaLabels.join(", ") : `${temaLabels.length} temas combinados`;
  const blocks = [
    { runs: [{ text: "Aprende y Repasa", bold: true, size: 18, color: "595959" }], spacingAfter: 30 },
    { runs: [{ text: "Examen mixto de Lengua", bold: true, size: 32 }], spacingAfter: 100 },
    {
      runs: [
        { text: "Área: ", bold: true }, { text: "Lengua castellana      " },
        { text: "Curso: ", bold: true }, { text: `${curso}º de Primaria` },
      ],
      spacingAfter: 40,
    },
    {
      runs: [
        { text: "Contenido: ", bold: true }, { text: `${contenidoText}      ` },
        { text: "Fecha: ", bold: true }, { text: fecha },
      ],
      spacingAfter: 120,
    },
  ];
  const note = LENGUA_DIFFICULTY_NOTES[dificultad];
  if (note) blocks.push({ runs: [{ text: note, italic: true, color: "0369A1" }], spacingAfter: 100 });
  return blocks;
}

function buildLenguaExamenTopicHeader(label) {
  return {
    runs: [{ text: label.toUpperCase(), bold: true, color: "FFFFFF", size: 20 }],
    shading: "595959",
    spacingBefore: 160,
    spacingAfter: 100,
  };
}

function buildLenguaExamenDocument({ curso, fecha, bloques, dificultad, showSolutions }) {
  const temaLabels = bloques.map((b) => b.topic.label);
  let blocks = [];
  blocks.push(...buildLenguaExamenHeaderBlocks(curso, fecha, temaLabels, dificultad));

  let globalIndex = 0;
  bloques.forEach((bloque) => {
    blocks.push(buildLenguaExamenTopicHeader(bloque.topic.label));
    bloque.problemas.forEach((p) => {
      const paragraphs = buildLenguaProblemParagraphs(p, globalIndex, showSolutions, dificultad);
      globalIndex++;
      blocks.push(...paragraphs);
    });
  });

  blocks.push({ runs: [{ text: " " }] });
  return dificultad === "dislexia" ? applyDislexiaStylingLengua(blocks) : blocks;
}

// ---------------- API pública ----------------

function generarExamenMixtoLenguaYSoluciones(seleccion, curso, dificultad = "none", options = {}) {
  // seleccion: array de { topicId, count }
  if (!seleccion.length) throw new Error("Elige al menos un tema y un número de preguntas mayor que 0.");

  const bloques = seleccion.map(({ topicId, count }) => {
    const topic = LENGUA_FICHA_CONFIG[topicId];
    if (!topic) throw new Error("Tema no encontrado: " + topicId);
    const problemas = lenguaPickProblems(topic, dificultad, count);
    return { topic, problemas };
  });

  const fecha = lenguaTodayEs();
  const fichaBlocks = buildLenguaExamenDocument({ curso, fecha, bloques, dificultad, showSolutions: false });
  const solucionesBlocks = buildLenguaExamenDocument({ curso, fecha, bloques, dificultad, showSolutions: true });
  const fichaBlob = createDocxBlob(fichaBlocks);
  const solucionesBlob = createDocxBlob(solucionesBlocks);

  const sufijo = dificultad && dificultad !== "none" ? `_${dificultad}` : "";
  const fichaFile = { blob: fichaBlob, filename: `examen_mixto_lengua_${curso}${sufijo}.docx` };
  const solucionesFile = { blob: solucionesBlob, filename: `soluciones_examen_mixto_lengua_${curso}${sufijo}.docx` };

  if (options.download === false) return { ficha: fichaFile, soluciones: solucionesFile };

  downloadBlob(fichaBlob, fichaFile.filename);
  setTimeout(() => downloadBlob(solucionesBlob, solucionesFile.filename), 400);
  return { ficha: fichaFile, soluciones: solucionesFile };
}
