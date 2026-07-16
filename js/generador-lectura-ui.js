// ============================================================
// Interfaz del generador de lectura comprensiva: pinta los botones
// de tipo de texto, gestiona el curso, genera la lectura, la
// muestra en pantalla y permite descargarla en Word junto con su
// hoja de soluciones.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const tipoPicker = document.getElementById("lectgen-tipo-picker");
  const cursoBtns = document.querySelectorAll("#lectgen-curso-picker [data-curso]");
  const generateBtn = document.getElementById("lectgen-generate-btn");
  const statusEl = document.getElementById("lectgen-status");
  const previewWrap = document.getElementById("lectgen-preview-wrap");
  const previewEl = document.getElementById("lectgen-preview");
  const downloadBtn = document.getElementById("lectgen-download-btn");

  let curso = "5";
  let tipoId = TIPOS_TEXTO_LECTURA[0].id;
  let currentResult = null;

  TIPOS_TEXTO_LECTURA.forEach((tipo, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-secondary" + (i === 0 ? " active" : "");
    btn.textContent = tipo.label;
    btn.dataset.tipo = tipo.id;
    btn.addEventListener("click", () => {
      tipoPicker.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      tipoId = tipo.id;
    });
    tipoPicker.appendChild(btn);
  });

  cursoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      cursoBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      curso = btn.dataset.curso;
    });
  });

  function renderPreview(texto) {
    previewEl.innerHTML = "";

    const tipoLabel = (TIPOS_TEXTO_LECTURA.find((t) => t.id === texto.tipoId) || {}).label || "";
    const tag = document.createElement("p");
    tag.className = "lectgen-tipo-tag";
    tag.textContent = "Tipo de texto: " + tipoLabel;
    previewEl.appendChild(tag);

    const title = document.createElement("h3");
    title.className = "lectgen-title";
    title.textContent = texto.titulo;
    previewEl.appendChild(title);

    const bodyWrap = document.createElement("div");
    bodyWrap.className = "lectgen-body";
    texto.cuerpo.split("\n\n").forEach((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      bodyWrap.appendChild(p);
    });
    previewEl.appendChild(bodyWrap);

    function addSection(label) {
      const bar = document.createElement("div");
      bar.className = "lectgen-section-bar";
      bar.textContent = label;
      previewEl.appendChild(bar);
    }

    function addQuestion(text) {
      const q = document.createElement("p");
      q.className = "lectgen-question";
      q.textContent = text;
      previewEl.appendChild(q);
    }

    addSection("Comprensión lectora");
    texto.preguntas.forEach((p, i) => addQuestion(`${i + 1}. ${p.pregunta}`));

    addSection("Tu opinión");
    addQuestion(texto.opinion);

    addSection("Reflexión");
    addQuestion(texto.reflexion);
  }

  generateBtn.addEventListener("click", () => {
    statusEl.classList.remove("show", "ok", "ko");
    statusEl.innerHTML = "";

    try {
      currentResult = generarLecturaYSoluciones(tipoId, curso);
      renderPreview(currentResult.texto);
      previewWrap.style.display = "";

      statusEl.classList.add("show", "ok");
      const tipoLabel = (TIPOS_TEXTO_LECTURA.find((t) => t.id === tipoId) || {}).label || "";
      statusEl.innerHTML = `<p class="feedback-title">¡Lectura generada!</p><p>Texto ${tipoLabel.toLowerCase()} con preguntas de comprensión, opinión y reflexión (${curso}º de Primaria).</p>`;
    } catch (err) {
      statusEl.classList.add("show", "ko");
      statusEl.innerHTML = `<p class="feedback-title">Ha ocurrido un error</p><p>${err.message}</p>`;
    }
  });

  downloadBtn.addEventListener("click", () => {
    if (!currentResult) return;
    downloadBlob(currentResult.fichaBlob, `lectura_comprensiva_${tipoId}_${curso}.docx`);
    setTimeout(() => downloadBlob(currentResult.solucionesBlob, `soluciones_lectura_comprensiva_${tipoId}_${curso}.docx`), 400);
  });
});
