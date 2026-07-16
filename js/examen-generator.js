// ============================================================
// Generador de exámenes mixtos: combina preguntas de varios temas
// de Matemáticas (elegidos por el usuario, con su propio número de
// preguntas) en una única prueba, reutilizando el banco de temas y
// las funciones de maquetación ya definidas en ficha-generator.js
// (TOPICS, sectionBar, blankBox, filledBox, todayEs) y el motor
// docx-writer.js.
// ============================================================

function buildExamenHeaderBlocks(curso, fecha, temaLabels) {
  const contenidoText = temaLabels.length <= 3 ? temaLabels.join(", ") : `${temaLabels.length} temas combinados`;
  return [
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
}

function buildExamenTopicHeader(label) {
  return {
    runs: [{ text: label.toUpperCase(), bold: true, color: "FFFFFF", size: 20 }],
    shading: "595959",
    spacingBefore: 160,
    spacingAfter: 100,
  };
}

function buildExamenProblemParagraphs(problem, globalIndex, showSolutions) {
  const paragraphs = [];
  paragraphs.push({
    runs: [{ text: `Problema ${globalIndex}`, bold: true, size: 22 }],
    spacingBefore: 90,
    spacingAfter: 30,
  });
  paragraphs.push({ runs: [{ text: problem.enunciado }], spacingAfter: 40 });

  paragraphs.push(sectionBar("Datos"));
  paragraphs.push(showSolutions ? filledBox([{ text: problem.datos.join("   ·   ") }], 30) : blankBox(1, 30));

  paragraphs.push(sectionBar("Operación"));
  paragraphs.push(showSolutions ? filledBox([{ text: problem.operacion }], 30) : blankBox(0, 30));

  paragraphs.push(sectionBar("Solución"));
  paragraphs.push(showSolutions ? filledBox([{ text: problem.solucion, bold: true }], 140) : blankBox(0, 140));

  return paragraphs;
}

function buildExamenDocument({ curso, fecha, bloques, showSolutions }) {
  const temaLabels = bloques.map((b) => b.topic.label);
  const blocks = [];
  blocks.push(...buildExamenHeaderBlocks(curso, fecha, temaLabels));

  let globalIndex = 0;
  bloques.forEach((bloque) => {
    blocks.push(buildExamenTopicHeader(bloque.topic.label));
    bloque.problemas.forEach((p) => {
      globalIndex++;
      blocks.push(...buildExamenProblemParagraphs(p, globalIndex, showSolutions));
    });
  });

  blocks.push({ runs: [{ text: " " }] });
  return blocks;
}

// ---------------- API pública ----------------

function generarExamenMixtoYSoluciones(seleccion, curso) {
  // seleccion: array de { topicId, count }
  if (!seleccion.length) throw new Error("Elige al menos un tema y un número de preguntas mayor que 0.");

  const bloques = seleccion.map(({ topicId, count }) => {
    const topic = TOPICS.find((t) => t.id === topicId);
    if (!topic) throw new Error("Tema no encontrado: " + topicId);
    const problemas = [];
    for (let i = 0; i < count; i++) problemas.push(topic.generate(curso));
    return { topic, problemas };
  });

  const fecha = todayEs();
  const fichaBlocks = buildExamenDocument({ curso, fecha, bloques, showSolutions: false });
  const solucionesBlocks = buildExamenDocument({ curso, fecha, bloques, showSolutions: true });
  const fichaBlob = createDocxBlob(fichaBlocks);
  const solucionesBlob = createDocxBlob(solucionesBlocks);

  downloadBlob(fichaBlob, `examen_mixto_matematicas_${curso}.docx`);
  setTimeout(() => downloadBlob(solucionesBlob, `soluciones_examen_mixto_matematicas_${curso}.docx`), 400);

  return { bloques };
}
