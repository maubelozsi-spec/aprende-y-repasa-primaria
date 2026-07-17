// ============================================================
// Interfaz del generador de fichas: rellena el desplegable de
// contenidos, gestiona el selector de curso y el botón de generar,
// y muestra una vista previa del primer problema.
// ============================================================

const GENERADOR_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Problemas mucho más sencillos",
    text: "La ficha se genera con problemas de nivel muy básico, con números pequeños y un solo paso, igual que la adaptación curricular significativa del resto de la web.",
    example: "En vez del problema habitual del tema, se genera una versión mucho más sencilla.",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo contenido, ficha más legible",
    text: "Se generan los mismos problemas que sin adaptación, pero con letra más grande y más espacio entre líneas para facilitar la lectura en papel.",
    example: "Mismos problemas, con un formato más cómodo de leer.",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un problema por página",
    text: "Se generan los mismos problemas que sin adaptación, pero cada uno se imprime en su propia página, para trabajar de uno en uno sin saturar la vista.",
    example: "Problema 1 en la página 1, problema 2 en la página 2...",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Problemas más sencillos y con más tiempo",
    text: "Igual que en ACS, se generan problemas de nivel muy básico, y el enunciado incluye un recordatorio para tomarse el tiempo necesario.",
    example: "Mismo nivel que ACS, con un aviso de \"Tómate tu tiempo\" en el enunciado.",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Problemas más exigentes",
    text: "Se generan problemas con números más grandes o con un paso adicional, para plantear un reto mayor sobre el mismo contenido.",
    example: "En vez del problema habitual del tema, se genera una versión con más dificultad.",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Datos y Operación ya resueltos",
    text: "En la ficha para imprimir (no en las soluciones), los apartados de Datos y Operación aparecen ya completados; solo hay que escribir la Solución final.",
    example: "Menos escritura manual: solo se completa el resultado final.",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const topicSelect = document.getElementById("gen-topic");
  const cursoBtns = document.querySelectorAll("#gen-curso-picker [data-curso]");
  const countInput = document.getElementById("gen-count");
  const resumenEl = document.getElementById("gen-resumen");
  const generateBtn = document.getElementById("gen-generate-btn");
  const statusEl = document.getElementById("gen-status");
  const previewEl = document.getElementById("gen-preview");

  let curso = "5";

  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, GENERADOR_DIFFICULTY_EXPLANATIONS);
  });
  renderDifficultyBox("difficulty-box", diff.get(), GENERADOR_DIFFICULTY_EXPLANATIONS);

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
      const dificultad = diff.get();
      const previewProblem = generarProblemas(topic, curso, 1, dificultad)[0];
      showPreview(previewProblem);

      generarFichaYSoluciones(topicId, curso, count, dificultad);

      statusEl.classList.add("show", "ok");
      statusEl.innerHTML = `<p class="feedback-title">¡Listo!</p><p>Se han descargado la ficha y la hoja de soluciones (${count} problema${count === 1 ? "" : "s"}, ${curso}º de Primaria).</p>`;
    } catch (err) {
      statusEl.classList.add("show", "ko");
      statusEl.innerHTML = `<p class="feedback-title">Ha ocurrido un error</p><p>${err.message}</p>`;
    }
  });
});
