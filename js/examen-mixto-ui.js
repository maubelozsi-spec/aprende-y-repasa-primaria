// ============================================================
// Interfaz del generador de exámenes mixtos: pinta la lista de
// contenidos agrupados por categoría con una casilla y un número
// de preguntas por tema, gestiona el curso y el botón de generar.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("exm-topic-list");
  const cursoBtns = document.querySelectorAll("#exm-curso-picker [data-curso]");
  const resumenEl = document.getElementById("exm-resumen");
  const generateBtn = document.getElementById("exm-generate-btn");
  const statusEl = document.getElementById("exm-status");

  let curso = "5";

  const byCategory = getTopicsByCategory();
  Object.keys(byCategory).forEach((category) => {
    const groupEl = document.createElement("div");
    groupEl.className = "exm-topic-group";

    const groupTitle = document.createElement("p");
    groupTitle.className = "exm-topic-group-title";
    groupTitle.textContent = category;
    groupEl.appendChild(groupTitle);

    byCategory[category].forEach((topic) => {
      const row = document.createElement("label");
      row.className = "exm-topic-row";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.topicId = topic.id;

      const labelSpan = document.createElement("span");
      labelSpan.className = "exm-topic-label";
      labelSpan.textContent = topic.label;

      const countInput = document.createElement("input");
      countInput.type = "number";
      countInput.className = "number-input exm-topic-count";
      countInput.min = "1";
      countInput.max = "10";
      countInput.value = "3";
      countInput.disabled = true;

      checkbox.addEventListener("change", () => {
        countInput.disabled = !checkbox.checked;
        updateResumen();
      });
      countInput.addEventListener("change", updateResumen);

      row.appendChild(checkbox);
      row.appendChild(labelSpan);
      row.appendChild(countInput);
      groupEl.appendChild(row);
    });

    listEl.appendChild(groupEl);
  });

  function getSeleccion() {
    const seleccion = [];
    listEl.querySelectorAll(".exm-topic-row").forEach((row) => {
      const checkbox = row.querySelector("input[type=checkbox]");
      const countInput = row.querySelector(".exm-topic-count");
      if (checkbox.checked) {
        const count = Math.min(10, Math.max(1, Number(countInput.value) || 1));
        countInput.value = count;
        seleccion.push({ topicId: checkbox.dataset.topicId, count });
      }
    });
    return seleccion;
  }

  function updateResumen() {
    const seleccion = getSeleccion();
    if (!seleccion.length) {
      resumenEl.textContent = "Elige al menos un contenido y cuántas preguntas quieres de cada uno.";
      return;
    }
    const totalPreguntas = seleccion.reduce((sum, s) => sum + s.count, 0);
    resumenEl.textContent = `${seleccion.length} contenido${seleccion.length === 1 ? "" : "s"} seleccionado${seleccion.length === 1 ? "" : "s"}, ${totalPreguntas} pregunta${totalPreguntas === 1 ? "" : "s"} en total.`;
  }

  cursoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      cursoBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      curso = btn.dataset.curso;
    });
  });

  generateBtn.addEventListener("click", () => {
    statusEl.classList.remove("show", "ok", "ko");
    statusEl.innerHTML = "";

    const seleccion = getSeleccion();

    try {
      const { bloques } = generarExamenMixtoYSoluciones(seleccion, curso);
      const totalPreguntas = bloques.reduce((sum, b) => sum + b.problemas.length, 0);

      statusEl.classList.add("show", "ok");
      statusEl.innerHTML = `<p class="feedback-title">¡Listo!</p><p>Se han descargado el examen y la hoja de soluciones (${bloques.length} contenido${bloques.length === 1 ? "" : "s"}, ${totalPreguntas} pregunta${totalPreguntas === 1 ? "" : "s"}, ${curso}º de Primaria).</p>`;
    } catch (err) {
      statusEl.classList.add("show", "ko");
      statusEl.innerHTML = `<p class="feedback-title">Ha ocurrido un error</p><p>${err.message}</p>`;
    }
  });
});
