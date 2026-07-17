// ============================================================
// Interfaz del generador de lectura comprensiva: pinta los botones
// de tipo de texto, gestiona el curso, genera la lectura, la
// muestra en pantalla y permite descargarla en Word junto con su
// hoja de soluciones.
// ============================================================

const LECTGEN_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Texto más corto y menos preguntas",
    text: "Para el alumnado con adaptación curricular significativa se muestran solo los dos primeros párrafos del texto y las dos primeras preguntas de comprensión, sin opinión ni reflexión adicionales.",
    example: "Se acorta el texto y se reduce a 2 preguntas de comprensión.",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo texto, más legible y más lento al escuchar",
    text: "Se mantiene el mismo texto y las mismas preguntas, con una tipografía más legible en pantalla y en el documento, y una velocidad de lectura en voz alta más pausada.",
    example: "Mismo texto, con más espacio entre líneas y voz más lenta al pulsar «Escuchar el texto».",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Pausas cada dos párrafos",
    text: "Se mantiene el mismo texto, pero se marca una pausa visual cada dos párrafos, tanto en pantalla como en el documento, para ayudar a mantener la atención.",
    example: "«· Pausa · Respira un momento antes de seguir ·» entre bloques de párrafos.",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Texto más corto, menos preguntas y más tiempo",
    text: "Igual que en ACS, se acorta el texto a los dos primeros párrafos y se reduce a 2 preguntas, añadiendo un recordatorio para tomarse el tiempo necesario en la opinión y la reflexión.",
    example: "Texto y preguntas reducidos, con «Tómate tu tiempo» en las preguntas abiertas.",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Una pregunta de profundización más",
    text: "Se mantiene el texto completo y se añade una cuarta pregunta de comprensión que pide resumir el texto con las propias palabras del alumno.",
    example: "«Resume el texto con tus propias palabras en 3 o 4 líneas.»",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Menos líneas para escribir",
    text: "En el documento para imprimir (no en las soluciones), la opinión y la reflexión llevan una sola línea en blanco en vez de tres, para reducir la cantidad de escritura a mano.",
    example: "1 línea en blanco para responder en vez de 3.",
  },
};

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
  let speechSupported = "speechSynthesis" in window;
  let currentUtterance = null;

  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, LECTGEN_DIFFICULTY_EXPLANATIONS);
  });
  renderDifficultyBox("difficulty-box", diff.get(), LECTGEN_DIFFICULTY_EXPLANATIONS);

  function stopSpeech() {
    if (speechSupported) window.speechSynthesis.cancel();
    currentUtterance = null;
  }

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

  function buildSpeechControls(texto) {
    const wrap = document.createElement("div");
    wrap.className = "lectgen-speech-row";

    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "btn btn-secondary";
    playBtn.textContent = "Escuchar el texto";

    const stopBtn = document.createElement("button");
    stopBtn.type = "button";
    stopBtn.className = "btn btn-secondary";
    stopBtn.textContent = "Detener";
    stopBtn.disabled = true;

    function setIdleState() {
      playBtn.textContent = "Escuchar el texto";
      stopBtn.disabled = true;
    }

    playBtn.addEventListener("click", () => {
      const synth = window.speechSynthesis;

      if (synth.speaking && !synth.paused) {
        synth.pause();
        playBtn.textContent = "Reanudar";
        return;
      }
      if (synth.paused) {
        synth.resume();
        playBtn.textContent = "Pausar";
        return;
      }

      stopSpeech();
      const textoPlano = texto.titulo + ". " + texto.cuerpo.replace(/\n+/g, " ");
      const utterance = new SpeechSynthesisUtterance(textoPlano);
      utterance.lang = "es-ES";
      utterance.rate = diff.is("dislexia") ? 0.8 : 0.95;
      utterance.onend = setIdleState;
      utterance.onerror = setIdleState;
      currentUtterance = utterance;
      synth.speak(utterance);
      playBtn.textContent = "Pausar";
      stopBtn.disabled = false;
    });

    stopBtn.addEventListener("click", () => {
      stopSpeech();
      setIdleState();
    });

    wrap.appendChild(playBtn);
    wrap.appendChild(stopBtn);
    return wrap;
  }

  function renderPreview(texto) {
    stopSpeech();
    previewEl.innerHTML = "";
    previewEl.classList.toggle("difficulty-readable", diff.is("dislexia"));

    const tipoLabel = (TIPOS_TEXTO_LECTURA.find((t) => t.id === texto.tipoId) || {}).label || "";
    const tag = document.createElement("p");
    tag.className = "lectgen-tipo-tag";
    tag.textContent = "Tipo de texto: " + tipoLabel;
    previewEl.appendChild(tag);

    const title = document.createElement("h3");
    title.className = "lectgen-title";
    title.textContent = texto.titulo;
    previewEl.appendChild(title);

    if (speechSupported) {
      previewEl.appendChild(buildSpeechControls(texto));
    }

    const bodyWrap = document.createElement("div");
    bodyWrap.className = "lectgen-body";
    texto.cuerpo.split("\n\n").forEach((paragraph, i) => {
      if (diff.is("tdah") && i > 0 && i % 2 === 0) {
        const pause = document.createElement("p");
        pause.className = "lectgen-pause";
        pause.textContent = "· Pausa · Respira un momento antes de seguir ·";
        bodyWrap.appendChild(pause);
      }
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
      currentResult = generarLecturaYSoluciones(tipoId, curso, diff.get());
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
