// ============================================================
// Generador de exámenes mixtos de Matemáticas CON soporte de
// dificultad (a diferencia de js/examen-generator.js, que no lo tiene).
// Combina varios temas del banco TOPICS de ficha-generator.js en una
// única prueba, reutilizando generarProblemas / buildProblemParagraphs
// / applyDislexiaStyling / DIFFICULTY_FICHA_NOTES ya definidos allí.
// Se usa desde el Generador de Unidad Didáctica (motor "mate-examen").
// ============================================================

function buildMateExamenHeaderBlocks(curso, fecha, temaLabels, dificultad) {
  const contenidoText = temaLabels.length <= 3 ? temaLabels.join(", ") : `${temaLabels.length} temas combinados`;
  const blocks = [
    { runs: [{ text: "Aprende y Repasa", bold: true, size: 18, color: "595959" }], spacingAfter: 30 },
    { runs: [{ text: "Examen mixto de Matemáticas", bold: true, size: 32 }], spacingAfter: 100 },
    {
      runs: [
        { text: "Área: ", bold: true }, { text: "Matemáticas      " },
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
  const note = DIFFICULTY_FICHA_NOTES[dificultad];
  if (note) blocks.push({ runs: [{ text: note, italic: true, color: "0369A1" }], spacingAfter: 100 });
  return blocks;
}

function buildMateExamenTopicHeader(label) {
  return {
    runs: [{ text: label.toUpperCase(), bold: true, color: "FFFFFF", size: 20 }],
    shading: "595959",
    spacingBefore: 160,
    spacingAfter: 100,
  };
}

function buildMateExamenDocument({ curso, fecha, bloques, dificultad, showSolutions }) {
  const temaLabels = bloques.map((b) => b.topic.label);
  let blocks = [];
  blocks.push(...buildMateExamenHeaderBlocks(curso, fecha, temaLabels, dificultad));

  let globalIndex = 0;
  bloques.forEach((bloque) => {
    blocks.push(buildMateExamenTopicHeader(bloque.topic.label));
    bloque.problemas.forEach((p) => {
      const paragraphs = buildProblemParagraphs(p, globalIndex, showSolutions, dificultad);
      globalIndex++;
      blocks.push(...paragraphs);
    });
  });

  blocks.push({ runs: [{ text: " " }] });
  return dificultad === "dislexia" ? applyDislexiaStyling(blocks) : blocks;
}

// ---------------- API pública ----------------

function generarExamenMixtoMateYSoluciones(seleccion, curso, dificultad = "none", options = {}) {
  // seleccion: array de { topicId, count }
  if (!seleccion.length) throw new Error("Elige al menos un tema y un número de preguntas mayor que 0.");

  const bloques = seleccion.map(({ topicId, count }) => {
    const topic = TOPICS.find((t) => t.id === topicId);
    if (!topic) throw new Error("Tema no encontrado: " + topicId);
    const problemas = generarProblemas(topic, curso, count, dificultad);
    return { topic, problemas };
  });

  const fecha = todayEs();
  const fichaBlocks = buildMateExamenDocument({ curso, fecha, bloques, dificultad, showSolutions: false });
  const solucionesBlocks = buildMateExamenDocument({ curso, fecha, bloques, dificultad, showSolutions: true });
  const fichaBlob = createDocxBlob(fichaBlocks);
  const solucionesBlob = createDocxBlob(solucionesBlocks);

  const sufijo = dificultad && dificultad !== "none" ? `_${dificultad}` : "";
  const fichaFile = { blob: fichaBlob, filename: `examen_mixto_matematicas_${curso}${sufijo}.docx` };
  const solucionesFile = { blob: solucionesBlob, filename: `soluciones_examen_mixto_matematicas_${curso}${sufijo}.docx` };

  if (options.download === false) return { ficha: fichaFile, soluciones: solucionesFile };

  downloadBlob(fichaBlob, fichaFile.filename);
  setTimeout(() => downloadBlob(solucionesBlob, solucionesFile.filename), 400);
  return { ficha: fichaFile, soluciones: solucionesFile };
}
