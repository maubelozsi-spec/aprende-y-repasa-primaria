// ============================================================
// Interfaz del generador de operaciones básicas: rellena los
// selectores de cifras, gestiona el curso y el número de
// sumandos, genera la semana y pinta una vista previa en pantalla
// (con opción de mostrar/ocultar las soluciones) además de
// descargar la ficha y la hoja de soluciones en Word.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const cursoBtns = document.querySelectorAll("#opgen-curso-picker [data-curso]");
  const sumaCountSelect = document.getElementById("opgen-suma-count");
  const sumaD3Field = document.getElementById("opgen-suma-d3-field");
  const restaMinuendoSelect = document.getElementById("opgen-resta-minuendo");
  const restaSustraendoSelect = document.getElementById("opgen-resta-sustraendo");
  const generateBtn = document.getElementById("opgen-generate-btn");
  const statusEl = document.getElementById("opgen-status");
  const previewWrap = document.getElementById("opgen-preview-wrap");
  const previewEl = document.getElementById("opgen-preview");
  const toggleSolutionsBtn = document.getElementById("opgen-toggle-solutions");
  const downloadBtn = document.getElementById("opgen-download-btn");

  let curso = "5";
  let currentResult = null;
  let showSolutions = false;

  function fillDigitSelect(id, min, max, defaultValue) {
    const select = document.getElementById(id);
    select.innerHTML = "";
    for (let n = min; n <= max; n++) {
      const opt = document.createElement("option");
      opt.value = n;
      opt.textContent = `${n} cifra${n === 1 ? "" : "s"}`;
      if (n === defaultValue) opt.selected = true;
      select.appendChild(opt);
    }
    return select;
  }

  fillDigitSelect("opgen-suma-d1", 1, 4, 2);
  fillDigitSelect("opgen-suma-d2", 1, 4, 3);
  fillDigitSelect("opgen-suma-d3", 1, 4, 1);
  fillDigitSelect("opgen-resta-minuendo", 2, 6, 4);
  fillDigitSelect("opgen-resta-sustraendo", 1, 6, 3);
  fillDigitSelect("opgen-mult-multiplicando", 1, 4, 3);
  fillDigitSelect("opgen-mult-multiplicador", 1, 3, 2);
  fillDigitSelect("opgen-div-dividendo", 2, 5, 4);
  fillDigitSelect("opgen-div-divisor", 1, 3, 1);

  function updateSumaCount() {
    sumaD3Field.style.display = sumaCountSelect.value === "3" ? "" : "none";
  }
  sumaCountSelect.addEventListener("change", updateSumaCount);
  updateSumaCount();

  function capSustraendo() {
    const maxAllowed = Number(restaMinuendoSelect.value);
    [...restaSustraendoSelect.options].forEach((opt) => {
      opt.disabled = Number(opt.value) > maxAllowed;
    });
    if (Number(restaSustraendoSelect.value) > maxAllowed) {
      restaSustraendoSelect.value = String(maxAllowed);
    }
  }
  restaMinuendoSelect.addEventListener("change", capSustraendo);
  capSustraendo();

  cursoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      cursoBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      curso = btn.dataset.curso;
    });
  });

  function readConfig() {
    const sumaDigits = [Number(document.getElementById("opgen-suma-d1").value), Number(document.getElementById("opgen-suma-d2").value)];
    if (sumaCountSelect.value === "3") sumaDigits.push(Number(document.getElementById("opgen-suma-d3").value));
    return {
      sumaDigits,
      restaDigits: {
        minuendo: Number(restaMinuendoSelect.value),
        sustraendo: Number(restaSustraendoSelect.value),
      },
      multiplicacionDigits: {
        multiplicando: Number(document.getElementById("opgen-mult-multiplicando").value),
        multiplicador: Number(document.getElementById("opgen-mult-multiplicador").value),
      },
      divisionDigits: {
        dividendo: Number(document.getElementById("opgen-div-dividendo").value),
        divisor: Number(document.getElementById("opgen-div-divisor").value),
      },
    };
  }

  function monoLine(text, bold) {
    const div = document.createElement("div");
    div.className = "opgen-mono-line" + (bold ? " bold" : "");
    div.textContent = text;
    return div;
  }

  function opBlock(labelText) {
    const block = document.createElement("div");
    block.className = "opgen-op-block";
    const label = document.createElement("div");
    label.className = "opgen-op-label";
    label.textContent = labelText;
    block.appendChild(label);
    return block;
  }

  function renderSuma(data, show) {
    const block = opBlock("Suma");
    data.addends.forEach((n, i) => {
      const isLast = i === data.addends.length - 1;
      block.appendChild(monoLine(isLast ? `+ ${n}` : `${n}`));
    });
    block.appendChild(monoLine("_".repeat(String(data.total).length + 2)));
    block.appendChild(show ? monoLine(String(data.total), true) : monoLine(" "));
    return block;
  }

  function renderResta(data, show) {
    const block = opBlock("Resta");
    block.appendChild(monoLine(String(data.minuendo)));
    block.appendChild(monoLine(`- ${data.sustraendo}`));
    block.appendChild(monoLine("_".repeat(String(data.minuendo).length + 2)));
    block.appendChild(show ? monoLine(String(data.resultado), true) : monoLine(" "));
    return block;
  }

  function renderMultiplicacion(data, show) {
    const block = opBlock("Multiplicación");
    block.appendChild(monoLine(String(data.multiplicando)));
    block.appendChild(monoLine(`× ${data.multiplicador}`));
    const scratch = document.createElement("div");
    scratch.className = "opgen-mult-scratch";
    block.appendChild(scratch);
    block.appendChild(monoLine("_".repeat(String(data.resultado).length + 2)));
    block.appendChild(show ? monoLine(String(data.resultado), true) : monoLine(" "));
    return block;
  }

  function renderDivision(data, show) {
    const block = opBlock("División");
    const expr = document.createElement("div");
    expr.className = "opgen-div-expr";
    expr.textContent = `${data.dividendo} ÷ ${data.divisor}`;
    block.appendChild(expr);
    const scratch = document.createElement("div");
    scratch.className = "opgen-div-scratch";
    block.appendChild(scratch);
    const answer = document.createElement("div");
    answer.className = "opgen-div-answer";
    if (show) {
      answer.innerHTML = `<strong>Cociente:</strong> ${data.cociente} &nbsp; <strong>Resto:</strong> ${data.resto}`;
    } else {
      answer.innerHTML = `<strong>Cociente:</strong> ________ &nbsp; <strong>Resto:</strong> ________`;
    }
    block.appendChild(answer);
    return block;
  }

  function renderPreview(weekData, show) {
    previewEl.innerHTML = "";
    weekData.forEach((dayOps, i) => {
      const col = document.createElement("div");
      col.className = "opgen-day-col";
      const header = document.createElement("div");
      header.className = "opgen-day-header";
      header.textContent = DAY_NAMES[i];
      col.appendChild(header);
      const body = document.createElement("div");
      body.className = "opgen-day-body";
      body.appendChild(renderSuma(dayOps.suma, show));
      body.appendChild(renderResta(dayOps.resta, show));
      body.appendChild(renderMultiplicacion(dayOps.multiplicacion, show));
      body.appendChild(renderDivision(dayOps.division, show));
      col.appendChild(body);
      previewEl.appendChild(col);
    });
  }

  generateBtn.addEventListener("click", () => {
    statusEl.classList.remove("show", "ok", "ko");
    statusEl.innerHTML = "";

    try {
      const config = readConfig();
      currentResult = generarOperacionesYSoluciones(config, curso);
      showSolutions = false;
      toggleSolutionsBtn.textContent = "Mostrar soluciones";
      renderPreview(currentResult.weekData, showSolutions);
      previewWrap.style.display = "";

      statusEl.classList.add("show", "ok");
      statusEl.innerHTML = `<p class="feedback-title">¡Ficha generada!</p><p>Semana de lunes a viernes con suma, resta, multiplicación y división cada día (${curso}º de Primaria).</p>`;
    } catch (err) {
      statusEl.classList.add("show", "ko");
      statusEl.innerHTML = `<p class="feedback-title">Ha ocurrido un error</p><p>${err.message}</p>`;
    }
  });

  toggleSolutionsBtn.addEventListener("click", () => {
    if (!currentResult) return;
    showSolutions = !showSolutions;
    toggleSolutionsBtn.textContent = showSolutions ? "Ocultar soluciones" : "Mostrar soluciones";
    renderPreview(currentResult.weekData, showSolutions);
  });

  downloadBtn.addEventListener("click", () => {
    if (!currentResult) return;
    downloadBlob(currentResult.fichaBlob, `operaciones_basicas_${curso}.docx`);
    setTimeout(() => downloadBlob(currentResult.solucionesBlob, `soluciones_operaciones_basicas_${curso}.docx`), 400);
  });
});
