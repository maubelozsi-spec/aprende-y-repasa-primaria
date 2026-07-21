// ============================================================
// Generador de fichas de Word para los temas de Lengua: cada tema
// registra su configuración (con registerLenguaFicha, llamado al
// final del propio archivo del tema, p. ej. js/adjetivo.js) y este
// módulo se encarga de elegir preguntas según la dificultad elegida
// y de construir los dos documentos (ficha en blanco + soluciones)
// con el motor de js/docx-writer.js.
// ============================================================

const LENGUA_FICHA_CONFIG = {};

function registerLenguaFicha(topicId, config) {
  LENGUA_FICHA_CONFIG[topicId] = config;
}

function lenguaShuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function lenguaUniqueValues(pool, field) {
  return [...new Set(pool.map((e) => e[field]))];
}

function lenguaResolveOptions(mode, entry, correct) {
  const raw = mode.perEntryOptions ? entry.options : mode.options;
  const source = raw ? raw.slice() : lenguaUniqueValues(mode.pool, mode.field);
  if (source.length <= 4) return lenguaShuffle(source);
  const others = source.filter((o) => o !== correct);
  return lenguaShuffle([correct, ...lenguaShuffle(others).slice(0, 3)]);
}

// ---------------- Selección de preguntas ----------------

function lenguaModeKeyFor(config, dificultad) {
  const easyOnly = dificultad === "acs" || dificultad === "discalculia";
  if (easyOnly) return config.easyMode;
  if (dificultad === "altas") return config.altasMode;
  return config.defaultMode || config.easyMode;
}

function lenguaPickProblems(config, dificultad, count) {
  const modeKey = lenguaModeKeyFor(config, dificultad);
  const mode = config.pools[modeKey];
  const shuffledPool = lenguaShuffle(mode.pool);

  const problems = [];
  for (let i = 0; i < count; i++) {
    const entry = shuffledPool[i % shuffledPool.length];
    const correct = mode.answerFn ? mode.answerFn(entry) : entry[mode.field];

    let enunciado = mode.question(entry);
    if (!mode.selfContained && mode.displayField) {
      const displayText = String(entry[mode.displayField]);
      const alreadyQuoted = /^["«]/.test(displayText.trim());
      enunciado += alreadyQuoted ? ` ${displayText}` : ` «${displayText}»`;
    }
    if (dificultad === "discalculia") enunciado += " Tómate tu tiempo.";

    let respuesta = String(correct);
    if (!mode.answerFn && mode.explainField && entry[mode.explainField]) {
      respuesta += ` (${entry[mode.explainField]})`;
    }

    const problem = { enunciado, respuesta };
    if (dificultad === "disgrafia") {
      problem.opciones = mode.optionsFn ? mode.optionsFn(entry) : lenguaResolveOptions(mode, entry, correct);
    }
    problems.push(problem);
  }
  return problems;
}

// ---------------- Construcción del documento (docx) ----------------

function lenguaAllBorders(color, sz) {
  return { top: { color, sz }, left: { color, sz }, bottom: { color, sz }, right: { color, sz } };
}

function lenguaLabelCell(text) {
  return {
    shading: "D9D9D9",
    borders: lenguaAllBorders("808080", 4),
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    paragraphs: [{ runs: [{ text, bold: true, size: 20 }] }],
  };
}

function lenguaValueCell(text) {
  return {
    borders: lenguaAllBorders("808080", 4),
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    paragraphs: [{ runs: [{ text, bold: true, size: 20 }] }],
  };
}

function lenguaTodayEs() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function buildLenguaHeaderBlocks(topic, curso, fecha) {
  const blocks = [];
  blocks.push({ runs: [{ text: "Aprende y Repasa", bold: true, size: 18, color: "595959" }], spacingAfter: 30 });
  blocks.push({ runs: [{ text: "Ficha de Lengua", bold: true, size: 32 }], spacingAfter: 100 });
  blocks.push({
    table: {
      columnWidths: [1600, 3300, 1200, 3538],
      rows: [
        { cells: [lenguaLabelCell("Nombre:"), lenguaValueCell(""), lenguaLabelCell("Curso:"), lenguaValueCell(`${curso}º de Primaria`)] },
        { cells: [lenguaLabelCell("Contenido:"), lenguaValueCell(topic.label), lenguaLabelCell("Fecha:"), lenguaValueCell(fecha)] },
      ],
    },
  });
  return blocks;
}

function lenguaSectionBar(text) {
  return {
    runs: [{ text, bold: true, color: "FFFFFF", size: 18 }],
    shading: "595959",
    spacingBefore: 40,
    spacingAfter: 0,
  };
}

function lenguaBlankBox(spacingAfter) {
  return { runs: [{ text: " " }], border: true, shading: "D9D9D9", spacingAfter };
}

function lenguaFilledBox(text, bold, spacingAfter) {
  return { runs: [{ text, bold: !!bold, italic: !bold, color: bold ? undefined : "595959" }], border: true, shading: "D9D9D9", spacingAfter };
}

const LENGUA_DIFFICULTY_NOTES = {
  acs: "Adaptación curricular significativa: mismo contenido con un nivel de dificultad equivalente a dos cursos por debajo.",
  discalculia: "Discalculia: mismo nivel que la ACS, dando más tiempo para pensar cada respuesta.",
  altas: "Altas capacidades: preguntas sobre el contenido más exigente de este tema.",
  dislexia: "Dislexia: mismo contenido, con letra más grande y más espacio entre líneas para facilitar la lectura.",
  tdah: "TDAH: cada pregunta se presenta en su propia página, para trabajar de una en una sin saturar la vista.",
  disgrafia: "Disgrafía: se responde eligiendo entre varias opciones en vez de escribir la respuesta completa.",
};

function buildLenguaProblemParagraphs(problem, index, showSolutions, dificultad) {
  const paragraphs = [];
  const pageBreakEvery = dificultad === "tdah" ? 1 : 5;
  const startsNewPage = index > 0 && index % pageBreakEvery === 0;

  paragraphs.push({
    runs: [{ text: `Pregunta ${index + 1}`, bold: true, size: 22 }],
    spacingBefore: startsNewPage ? 0 : 90,
    spacingAfter: 30,
    pageBreakBefore: startsNewPage,
  });
  paragraphs.push({ runs: [{ text: problem.enunciado }], spacingAfter: 40 });

  paragraphs.push(lenguaSectionBar("Respuesta"));
  if (showSolutions) {
    paragraphs.push(lenguaFilledBox(problem.respuesta, true, 140));
  } else if (dificultad === "disgrafia" && problem.opciones) {
    paragraphs.push(lenguaFilledBox(problem.opciones.join("     "), false, 140));
  } else {
    paragraphs.push(lenguaBlankBox(140));
  }

  return paragraphs;
}

function applyDislexiaStylingLengua(paragraphs) {
  return paragraphs.map((p) => {
    if (p.table) return p;
    return {
      ...p,
      spacingBefore: p.spacingBefore !== undefined ? Math.round(p.spacingBefore * 1.3) : p.spacingBefore,
      spacingAfter: p.spacingAfter !== undefined ? Math.round(p.spacingAfter * 1.3) : p.spacingAfter,
      runs: p.runs.map((r) => (r.break ? r : { ...r, size: (r.size || 22) + 6 })),
    };
  });
}

function buildLenguaFichaDocument({ topic, curso, fecha, problems, dificultad, showSolutions }) {
  const paragraphs = [];
  paragraphs.push(...buildLenguaHeaderBlocks(topic, curso, fecha));

  if (showSolutions) {
    paragraphs.push({ runs: [{ text: "Hoja de soluciones", bold: true, size: 24 }], spacingAfter: 140 });
  } else {
    paragraphs.push({ runs: [{ text: topic.resumen }], border: true, shading: "D9D9D9", spacingAfter: 100 });
  }

  const note = LENGUA_DIFFICULTY_NOTES[dificultad];
  if (note) {
    paragraphs.push({ runs: [{ text: note, italic: true, color: "0369A1" }], spacingAfter: 140 });
  }

  problems.forEach((p, i) => {
    paragraphs.push(...buildLenguaProblemParagraphs(p, i, showSolutions, dificultad));
  });

  return dificultad === "dislexia" ? applyDislexiaStylingLengua(paragraphs) : paragraphs;
}

// ---------------- API pública ----------------

function generarFichaYSoluciones(topicId, curso, count, dificultad = "none", options = {}) {
  const topic = LENGUA_FICHA_CONFIG[topicId];
  if (!topic) throw new Error("Tema no encontrado: " + topicId);

  const problems = lenguaPickProblems(topic, dificultad, count);
  const fecha = lenguaTodayEs();

  const fichaParagraphs = buildLenguaFichaDocument({ topic, curso, fecha, problems, dificultad, showSolutions: false });
  const solucionesParagraphs = buildLenguaFichaDocument({ topic, curso, fecha, problems, dificultad, showSolutions: true });

  const fichaBlob = createDocxBlob(fichaParagraphs);
  const solucionesBlob = createDocxBlob(solucionesParagraphs);

  const sufijo = dificultad && dificultad !== "none" ? `_${dificultad}` : "";
  const fichaFile = { blob: fichaBlob, filename: `ficha_lengua_${topicId}_${curso}${sufijo}.docx` };
  const solucionesFile = { blob: solucionesBlob, filename: `soluciones_lengua_${topicId}_${curso}${sufijo}.docx` };

  if (options.download === false) return { ficha: fichaFile, soluciones: solucionesFile };

  downloadBlob(fichaBlob, fichaFile.filename);
  setTimeout(() => downloadBlob(solucionesBlob, solucionesFile.filename), 400);
  return { ficha: fichaFile, soluciones: solucionesFile };
}
