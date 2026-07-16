// ============================================================
// Generador de operaciones básicas (sumas, restas, multiplicaciones
// y divisiones): crea una ficha semanal con 5 columnas (lunes a
// viernes), cada una con las 4 operaciones alineadas en vertical
// (fuente monoespaciada + alineación a la derecha para que las
// cifras coincidan en columnas), y su hoja de soluciones.
// ============================================================

const MONO_FONT = "Consolas";
const DAY_NAMES = ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES"];

function opRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomWithDigits(digits) {
  const d = Math.max(1, digits);
  const min = d === 1 ? 1 : Math.pow(10, d - 1);
  const max = Math.pow(10, d) - 1;
  return opRandomInt(min, max);
}

function todayEsOperaciones() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

// ---------------- Generación de operaciones ----------------

function generarSuma(digitsList) {
  const addends = digitsList.map(randomWithDigits);
  const total = addends.reduce((a, b) => a + b, 0);
  return { addends, total };
}

function generarResta(digitsMinuendo, digitsSustraendo) {
  const minuendo = randomWithDigits(digitsMinuendo);
  let sustraendo;
  if (digitsSustraendo < digitsMinuendo) {
    sustraendo = randomWithDigits(digitsSustraendo);
  } else {
    const d = digitsSustraendo;
    const minD = d === 1 ? 1 : Math.pow(10, d - 1);
    const maxD = Math.min(Math.pow(10, d) - 1, minuendo);
    sustraendo = opRandomInt(minD, Math.max(minD, maxD));
  }
  return { minuendo, sustraendo, resultado: minuendo - sustraendo };
}

function generarMultiplicacion(digitsA, digitsB) {
  const multiplicando = randomWithDigits(digitsA);
  const multiplicador = randomWithDigits(digitsB);
  return { multiplicando, multiplicador, resultado: multiplicando * multiplicador };
}

function generarDivision(digitsDividendo, digitsDivisor) {
  const dividendo = randomWithDigits(digitsDividendo);
  const divisor = randomWithDigits(digitsDivisor);
  return { dividendo, divisor, cociente: Math.floor(dividendo / divisor), resto: dividendo % divisor };
}

function generarSemana(config) {
  const dias = [];
  for (let i = 0; i < 5; i++) {
    dias.push({
      suma: generarSuma(config.sumaDigits),
      resta: generarResta(config.restaDigits.minuendo, config.restaDigits.sustraendo),
      multiplicacion: generarMultiplicacion(config.multiplicacionDigits.multiplicando, config.multiplicacionDigits.multiplicador),
      division: generarDivision(config.divisionDigits.dividendo, config.divisionDigits.divisor),
    });
  }
  return dias;
}

// ---------------- Construcción del documento (docx) ----------------

function allBorders(color, sz) {
  return { top: { color, sz }, left: { color, sz }, bottom: { color, sz }, right: { color, sz } };
}

function labelCell(text) {
  return {
    shading: "D9D9D9",
    borders: allBorders("808080", 4),
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    paragraphs: [{ runs: [{ text, bold: true, size: 20 }] }],
  };
}

function valueCell(text) {
  return {
    borders: allBorders("808080", 4),
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    paragraphs: [{ runs: [{ text, bold: true, size: 20 }] }],
  };
}

function buildHeaderBlocks(curso, fecha) {
  const blocks = [];
  blocks.push({ runs: [{ text: "Aprende y Repasa", bold: true, size: 18, color: "595959" }], spacingAfter: 30 });
  blocks.push({ runs: [{ text: "Operaciones básicas", bold: true, size: 32 }], spacingAfter: 100 });

  blocks.push({
    table: {
      columnWidths: [1600, 3300, 1200, 3538],
      rows: [
        { cells: [labelCell("Nombre:"), valueCell(""), labelCell("Curso:"), valueCell(`${curso}º de Primaria`)] },
        { cells: [labelCell("Contenido:"), valueCell("Sumas, restas, multiplicaciones y divisiones"), labelCell("Fecha:"), valueCell(fecha)] },
      ],
    },
  });
  blocks.push({ runs: [{ text: " " }], spacingAfter: 200 });
  return blocks;
}

function monoPara(text, bold) {
  return { runs: [{ text, font: MONO_FONT, size: 19, bold: !!bold }], align: "right" };
}

function opLabel(text) {
  return { runs: [{ text, bold: true, size: 17 }], spacingBefore: 100, spacingAfter: 20 };
}

function spacerPara(spacingAfter) {
  return { runs: [{ text: " " }], spacingAfter: spacingAfter || 40 };
}

function buildSumaBlock(data, showSolutions) {
  const paragraphs = [];
  paragraphs.push(opLabel("Suma"));
  data.addends.forEach((n, i) => {
    const isLast = i === data.addends.length - 1;
    paragraphs.push(monoPara(isLast ? `+ ${n}` : `${n}`));
  });
  const ruleWidth = String(data.total).length + 2;
  paragraphs.push(monoPara("_".repeat(ruleWidth)));
  paragraphs.push(showSolutions ? monoPara(String(data.total), true) : spacerPara(160));
  return paragraphs;
}

function buildRestaBlock(data, showSolutions) {
  const paragraphs = [];
  paragraphs.push(opLabel("Resta"));
  paragraphs.push(monoPara(String(data.minuendo)));
  paragraphs.push(monoPara(`- ${data.sustraendo}`));
  const ruleWidth = String(data.minuendo).length + 2;
  paragraphs.push(monoPara("_".repeat(ruleWidth)));
  paragraphs.push(showSolutions ? monoPara(String(data.resultado), true) : spacerPara(160));
  return paragraphs;
}

function buildMultiplicacionBlock(data, showSolutions) {
  const paragraphs = [];
  paragraphs.push(opLabel("Multiplicación"));
  paragraphs.push(monoPara(String(data.multiplicando)));
  paragraphs.push(monoPara(`× ${data.multiplicador}`));
  paragraphs.push(spacerPara(40));
  paragraphs.push(spacerPara(40));
  const ruleWidth = String(data.resultado).length + 2;
  paragraphs.push(monoPara("_".repeat(ruleWidth)));
  paragraphs.push(showSolutions ? monoPara(String(data.resultado), true) : spacerPara(160));
  return paragraphs;
}

function buildDivisionBlock(data, showSolutions) {
  const paragraphs = [];
  paragraphs.push(opLabel("División"));
  paragraphs.push({ runs: [{ text: `${data.dividendo} ÷ ${data.divisor}`, bold: true, size: 19 }], spacingAfter: 60 });
  paragraphs.push(spacerPara(40));
  paragraphs.push(spacerPara(40));
  paragraphs.push(spacerPara(60));
  if (showSolutions) {
    paragraphs.push({
      runs: [
        { text: "Cociente: ", bold: true, size: 17 }, { text: String(data.cociente), size: 17 },
        { text: "   Resto: ", bold: true, size: 17 }, { text: String(data.resto), size: 17 },
      ],
    });
  } else {
    paragraphs.push({
      runs: [
        { text: "Cociente: ", bold: true, size: 17 }, { text: "________", size: 17 },
        { text: "   Resto: ", bold: true, size: 17 }, { text: "________", size: 17 },
      ],
    });
  }
  return paragraphs;
}

function buildDayCellParagraphs(dayName, dayOps, showSolutions) {
  const paragraphs = [];
  paragraphs.push({ runs: [{ text: dayName, bold: true, color: "FFFFFF", size: 18 }], shading: "595959", align: "center", spacingAfter: 100 });
  paragraphs.push(...buildSumaBlock(dayOps.suma, showSolutions));
  paragraphs.push(...buildRestaBlock(dayOps.resta, showSolutions));
  paragraphs.push(...buildMultiplicacionBlock(dayOps.multiplicacion, showSolutions));
  paragraphs.push(...buildDivisionBlock(dayOps.division, showSolutions));
  return paragraphs;
}

function buildWeekTableBlock(weekData, showSolutions) {
  const totalWidth = 9638;
  const base = Math.floor(totalWidth / 5);
  const remainder = totalWidth - base * 5;
  const columnWidths = [0, 1, 2, 3, 4].map((i) => base + (i < remainder ? 1 : 0));

  const cells = weekData.map((dayOps, i) => ({
    borders: allBorders("D9D9D9", 4),
    margins: { top: 80, bottom: 80, left: 80, right: 80 },
    vAlign: "top",
    paragraphs: buildDayCellParagraphs(DAY_NAMES[i], dayOps, showSolutions),
  }));

  return { table: { columnWidths, rows: [{ cells }] } };
}

function buildOperacionesDocument({ curso, fecha, weekData, showSolutions }) {
  const blocks = [];
  blocks.push(...buildHeaderBlocks(curso, fecha));
  blocks.push(buildWeekTableBlock(weekData, showSolutions));
  blocks.push({ runs: [{ text: " " }] });
  return blocks;
}

// ---------------- API pública ----------------

function generarOperacionesYSoluciones(config, curso) {
  const weekData = generarSemana(config);
  const fecha = todayEsOperaciones();
  const fichaBlocks = buildOperacionesDocument({ curso, fecha, weekData, showSolutions: false });
  const solucionesBlocks = buildOperacionesDocument({ curso, fecha, weekData, showSolutions: true });
  const fichaBlob = createDocxBlob(fichaBlocks);
  const solucionesBlob = createDocxBlob(solucionesBlocks);
  return { weekData, fichaBlob, solucionesBlob };
}
