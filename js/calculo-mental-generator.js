// ============================================================
// Generador de fichas de cálculo mental: construye una ficha (y su
// hoja de soluciones) con ejercicios variados de los trucos
// elegidos, agrupados por bloque, en el mismo diseño en escala de
// grises del resto de fichas de la aplicación.
// ============================================================

function todayEsCalculoMental() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function allBordersCM(color, sz) {
  return { top: { color, sz }, left: { color, sz }, bottom: { color, sz }, right: { color, sz } };
}

function labelCellCM(text) {
  return {
    shading: "D9D9D9",
    borders: allBordersCM("808080", 4),
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    paragraphs: [{ runs: [{ text, bold: true, size: 20 }] }],
  };
}

function valueCellCM(text) {
  return {
    borders: allBordersCM("808080", 4),
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    paragraphs: [{ runs: [{ text, bold: true, size: 20 }] }],
  };
}

function buildCMHeaderBlocks(curso, fecha) {
  const blocks = [];
  blocks.push({ runs: [{ text: "Aprende y Repasa", bold: true, size: 18, color: "595959" }], spacingAfter: 30 });
  blocks.push({ runs: [{ text: "Cálculo mental", bold: true, size: 32 }], spacingAfter: 100 });

  blocks.push({
    table: {
      columnWidths: [1600, 3300, 1200, 3538],
      rows: [
        { cells: [labelCellCM("Nombre:"), valueCellCM(""), labelCellCM("Curso:"), valueCellCM(`${curso}º de Primaria`)] },
        { cells: [labelCellCM("Contenido:"), valueCellCM("Trucos de cálculo mental"), labelCellCM("Fecha:"), valueCellCM(fecha)] },
      ],
    },
  });
  blocks.push({ runs: [{ text: " " }], spacingAfter: 200 });
  return blocks;
}

function sectionBarCM(text) {
  return { runs: [{ text, bold: true, color: "FFFFFF", size: 19 }], shading: "595959", spacingBefore: 140, spacingAfter: 100 };
}

function trucoLabelCM(text) {
  return { runs: [{ text, bold: true, size: 20 }], spacingBefore: 100, spacingAfter: 60 };
}

function buildCMDocument({ curso, fecha, bloquesSeleccionados, porTruco, semana, showSolutions }) {
  const blocks = [];
  blocks.push(...buildCMHeaderBlocks(curso, fecha));

  bloquesSeleccionados.forEach((bloqueId) => {
    const bloque = BLOQUES_CALCULO_MENTAL.find((b) => b.id === bloqueId);
    blocks.push(sectionBarCM(bloque.label.toUpperCase()));

    trucosDeBloque(bloqueId).forEach((truco) => {
      blocks.push(trucoLabelCM(truco.label));
      const ejercicios = semana[truco.id];
      ejercicios.forEach((ej, i) => {
        blocks.push({
          runs: [{ text: `${i + 1}. ${ej.enunciado} = ` }, { text: showSolutions ? String(ej.respuesta) : "______________", bold: showSolutions }],
          spacingAfter: showSolutions ? 20 : 30,
        });
        if (!showSolutions) {
          blocks.push({ runs: [{ text: "Pista: " + ej.pista, italic: true, size: 18, color: "595959" }], spacingAfter: 140 });
        }
      });
    });
  });

  blocks.push({ runs: [{ text: " " }] });
  return blocks;
}

function generarSemanaCalculoMental(bloquesSeleccionados, porTruco) {
  const semana = {};
  bloquesSeleccionados.forEach((bloqueId) => {
    trucosDeBloque(bloqueId).forEach((truco) => {
      const ejercicios = [];
      for (let i = 0; i < porTruco; i++) ejercicios.push(truco.generar());
      semana[truco.id] = ejercicios;
    });
  });
  return semana;
}

function generarCalculoMentalYSoluciones(bloquesSeleccionados, porTruco, curso) {
  if (!bloquesSeleccionados.length) throw new Error("Selecciona al menos un bloque.");
  const semana = generarSemanaCalculoMental(bloquesSeleccionados, porTruco);
  const fecha = todayEsCalculoMental();
  const fichaBlocks = buildCMDocument({ curso, fecha, bloquesSeleccionados, porTruco, semana, showSolutions: false });
  const solucionesBlocks = buildCMDocument({ curso, fecha, bloquesSeleccionados, porTruco, semana, showSolutions: true });
  const fichaBlob = createDocxBlob(fichaBlocks);
  const solucionesBlob = createDocxBlob(solucionesBlocks);
  return { semana, fichaBlob, solucionesBlob };
}
