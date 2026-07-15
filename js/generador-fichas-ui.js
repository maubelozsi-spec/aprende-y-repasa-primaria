// ============================================================
// Interfaz del generador de fichas: rellena el desplegable de
// contenidos, gestiona el selector de curso y el botón de generar,
// y muestra una vista previa del primer problema.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const topicSelect = document.getElementById("gen-topic");
  const cursoBtns = document.querySelectorAll("#gen-curso-picker [data-curso]");
  const countInput = document.getElementById("gen-count");
  const resumenEl = document.getElementById("gen-resumen");
  const generateBtn = document.getElementById("gen-generate-btn");
  const statusEl = document.getElementById("gen-status");
  const previewEl = document.getElementById("gen-preview");

  let curso = "5";

  const byCategory = getTopicsByCategory();
  Object.keys(byCategory).forEach((category) => {
    const group = document.createElement("optgroup");
    group.label = category;
    byCategory[category].forEach((topic) => {
      const option = document.createElement("option");
      option.value = topic.id;
      option.textContent = topic.label;
      group.appendChild(option);
    });
    topicSelect.appendChild(group);
  });

  function updateResumen() {
    const topic = TOPICS.find((t) => t.id === topicSelect.value);
    resumenEl.textContent = topic ? topic.resumen : "";
  }

  topicSelect.addEventListener("change", updateResumen);
  updateResumen();

  cursoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      cursoBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      curso = btn.dataset.curso;
    });
  });

  function showPreview(problem) {
    document.getElementById("gen-preview-enunciado").textContent = problem.enunciado;
    document.getElementById("gen-preview-datos").innerHTML = problem.datos.join("<br>");
    document.getElementById("gen-preview-operacion").textContent = problem.operacion;
    document.getElementById("gen-preview-solucion").textContent = problem.solucion;
    previewEl.style.display = "";
  }

  generateBtn.addEventListener("click", () => {
    const topicId = topicSelect.value;
    const count = Math.min(10, Math.max(1, Number(countInput.value) || 5));
    countInput.value = count;

    statusEl.classList.remove("show", "ok", "ko");
    statusEl.innerHTML = "";

    try {
      const topic = TOPICS.find((t) => t.id === topicId);
      const previewProblem = topic.generate(curso);
      showPreview(previewProblem);

      generarFichaYSoluciones(topicId, curso, count);

      statusEl.classList.add("show", "ok");
      statusEl.innerHTML = `<p class="feedback-title">¡Listo!</p><p>Se han descargado la ficha y la hoja de soluciones (${count} problema${count === 1 ? "" : "s"}, ${curso}º de Primaria).</p>`;
    } catch (err) {
      statusEl.classList.add("show", "ko");
      statusEl.innerHTML = `<p class="feedback-title">Ha ocurrido un error</p><p>${err.message}</p>`;
    }
  });
});
