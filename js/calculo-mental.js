// ============================================================
// Página de Cálculo mental: cambio de pestañas (Teoría/Práctica/
// Ficha), juego de práctica (un truco por vez, respuesta numérica)
// y generador de fichas en Word con su hoja de soluciones.
// ============================================================

const CALCMENTAL_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo los trucos del Bloque 1, con números más pequeños",
    text: "Para el alumnado con adaptación curricular significativa se practican solo los trucos de sumas y restas del Bloque 1, con números de dos cifras.",
    example: "100 − 87 → ¿qué le falta a 87 para llegar a 100? 13",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantienen los mismos trucos, pero con una tipografía más legible para leer las operaciones y las pistas.",
    example: "58 + 36 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo truco cada vez, sin mezclar",
    text: "Se practica siempre con un <strong>truco concreto</strong> (nunca todos mezclados), para no ir cambiando constantemente de estrategia y mantener mejor la atención.",
    example: "Practicando solo «Compensación en la suma» hasta que cambies de truco tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo los trucos del Bloque 1 y ayuda extra",
    text: "Igual que en ACS, se practican solo los trucos de sumas y restas del Bloque 1, con números de dos cifras, dando más tiempo para pensar.",
    example: "82 − 27 → redondea 27 a 30: 82 − 30 = 52 → suma 3: 55",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Todos los trucos mezclados",
    text: "Se practica directamente en modo <strong>«Mezcla»</strong>, combinando los trucos de los tres bloques sin previsibilidad.",
    example: "Un truco del Bloque 1, luego uno del Bloque 3, luego uno del Bloque 2...",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Responde eligiendo, sin escribir",
    text: "En vez de escribir el número, se elige la respuesta entre varias opciones con un solo clic.",
    example: "58 + 36 = ? → elige entre 94, 84, 104, 96",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabsCM();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, CALCMENTAL_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), CALCMENTAL_DIFFICULTY_EXPLANATIONS);

  initPracticaCM(diff, (fn) => restartCallbacks.push(fn));
  initFichaCM();
});

function numericDistractors(correct) {
  const candidates = new Set([correct + 1, correct - 1, correct + 10, correct - 10, correct + 2, correct - 2]);
  candidates.delete(correct);
  const pool = [...candidates].filter((v) => v >= 0);
  const distractors = [];
  while (distractors.length < 3 && pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    distractors.push(pool.splice(idx, 1)[0]);
  }
  while (distractors.length < 3) {
    distractors.push(correct + distractors.length + 3);
  }
  return distractors;
}

function shuffleArrayCM(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function initTabsCM() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = {
    teoria: document.getElementById("tab-teoria"),
    practica: document.getElementById("tab-practica"),
    ficha: document.getElementById("tab-ficha"),
  };
  if (tabBtns.length === 0) return;

  function activateTab(name) {
    tabBtns.forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
    Object.entries(panels).forEach(([key, el]) => el.classList.toggle("active", key === name));
  }

  tabBtns.forEach((btn) => btn.addEventListener("click", () => activateTab(btn.dataset.tab)));

  const goBtn = document.getElementById("go-to-practice");
  if (goBtn) goBtn.addEventListener("click", () => activateTab("practica"));
}

function initPracticaCM(diff, registerRestart) {
  const modePicker = document.getElementById("mode-picker");
  const els = {
    card: document.getElementById("practica-calculo-mental"),
    equation: document.getElementById("cm-equation"),
    hint: document.getElementById("cm-hint"),
    inputsRow: document.getElementById("cm-inputs-row"),
    choices: document.getElementById("cm-answer-choices"),
    input: document.getElementById("cm-answer-input"),
    checkBtn: document.getElementById("cm-check-btn"),
    feedback: document.getElementById("cm-feedback"),
    nextBtn: document.getElementById("cm-next-btn"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  TRUCOS_CALCULO_MENTAL.forEach((truco, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-secondary" + (i === 0 ? " active" : "");
    btn.textContent = truco.label;
    btn.dataset.mode = truco.id;
    modePicker.appendChild(btn);
  });
  const mezclaBtn = document.createElement("button");
  mezclaBtn.type = "button";
  mezclaBtn.className = "btn btn-secondary";
  mezclaBtn.textContent = "Mezcla";
  mezclaBtn.dataset.mode = "mezcla";
  modePicker.appendChild(mezclaBtn);

  let scoreOk = 0;
  let scoreKo = 0;
  let mode = TRUCOS_CALCULO_MENTAL[0].id;
  let current;
  let attempts = 0;

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    modePicker.querySelectorAll("button").forEach((b) => (b.disabled = easyOnly));

    if (!easyOnly) {
      const mezclaOption = [...modePicker.querySelectorAll("button")].find((b) => b.dataset.mode === "mezcla");
      if (mezclaOption) mezclaOption.disabled = diff.is("tdah");
    }

    if (diff.is("altas")) {
      mode = "mezcla";
      modePicker.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.mode === "mezcla"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = TRUCOS_CALCULO_MENTAL[0].id;
      modePicker.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickTruco() {
    if (diff.is("acs") || diff.is("discalculia")) return cmPick(TRUCOS_CALCULO_MENTAL_ACS);
    if (mode === "mezcla") return cmPick(TRUCOS_CALCULO_MENTAL);
    return TRUCOS_CALCULO_MENTAL.find((t) => t.id === mode);
  }

  function startRound() {
    current = pickTruco().generar();
    attempts = 0;

    els.equation.textContent = current.enunciado + " =";
    els.hint.innerHTML = `<strong>Pista:</strong> ${current.pista}` + (diff.is("discalculia") ? " Tómate tu tiempo." : "");
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    if (diff.is("disgrafia")) {
      els.inputsRow.style.display = "none";
      els.choices.style.display = "";
      renderChoiceButtons();
    } else {
      els.inputsRow.style.display = "";
      els.choices.style.display = "none";
      els.input.value = "";
      els.input.classList.remove("correct", "incorrect");
      els.input.disabled = false;
    }
  }

  function renderChoiceButtons() {
    const options = shuffleArrayCM([current.respuesta, ...numericDistractors(current.respuesta)]);
    els.choices.innerHTML = "";
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "syllable-chip";
      btn.textContent = opt;
      btn.addEventListener("click", () => chooseAnswerButton(opt, btn));
      els.choices.appendChild(btn);
    });
  }

  function chooseAnswerButton(chosen, btn) {
    const isCorrect = chosen === current.respuesta;
    attempts++;

    const allBtns = els.choices.querySelectorAll(".syllable-chip");
    allBtns.forEach((b) => (b.disabled = true));

    if (isCorrect) {
      scoreOk++;
      AppProgress.record("calculo-mental", true);
      els.scoreOk.textContent = scoreOk;
      btn.classList.add("correct");
      els.feedback.classList.add("show", "ok");
      els.feedback.innerHTML = `<p class="feedback-title">Correcto</p><p>${current.enunciado} = <strong>${current.respuesta}</strong></p>`;
      els.nextBtn.style.display = "";
      return;
    }

    btn.classList.add("incorrect");

    if (attempts >= 2) {
      scoreKo++;
      AppProgress.record("calculo-mental", false);
      els.scoreKo.textContent = scoreKo;
      allBtns.forEach((b) => {
        if (Number(b.textContent) === current.respuesta) b.classList.add("correct");
      });
      els.feedback.classList.add("show", "ko");
      els.feedback.innerHTML = `<p class="feedback-title">No era esa</p><p>${current.enunciado} = <strong>${current.respuesta}</strong></p>`;
      els.nextBtn.style.display = "";
    } else {
      setTimeout(() => {
        allBtns.forEach((b) => {
          b.disabled = false;
          b.classList.remove("incorrect");
        });
      }, 700);
    }
  }

  function checkAnswer() {
    if (els.input.value.trim() === "") return;
    const val = Number(els.input.value);
    if (Number.isNaN(val)) return;
    attempts++;
    const isCorrect = val === current.respuesta;

    if (isCorrect) {
      scoreOk++;
      AppProgress.record("calculo-mental", true);
      els.scoreOk.textContent = scoreOk;
      els.input.classList.add("correct");
      els.input.disabled = true;
      els.feedback.classList.add("show", "ok");
      els.feedback.innerHTML = `<p class="feedback-title">Correcto</p><p>${current.enunciado} = <strong>${current.respuesta}</strong></p>`;
      els.nextBtn.style.display = "";
      return;
    }

    if (attempts >= 2) {
      scoreKo++;
      AppProgress.record("calculo-mental", false);
      els.scoreKo.textContent = scoreKo;
      els.input.classList.remove("incorrect");
      els.input.classList.add("correct");
      els.input.value = current.respuesta;
      els.input.disabled = true;
      els.feedback.classList.add("show", "ko");
      els.feedback.innerHTML = `<p class="feedback-title">No era esa</p><p>${current.enunciado} = <strong>${current.respuesta}</strong></p>`;
      els.nextBtn.style.display = "";
    } else {
      els.input.classList.add("incorrect");
      setTimeout(() => {
        els.input.classList.remove("incorrect");
        els.input.value = "";
      }, 700);
    }
  }

  modePicker.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      modePicker.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      mode = btn.dataset.mode;
      startRound();
    });
  });

  els.checkBtn.addEventListener("click", checkAnswer);
  els.input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
  });
  els.nextBtn.addEventListener("click", startRound);

  applyDifficultyUI();
  startRound();
}

function initFichaCM() {
  const bloquePicker = document.getElementById("cm-bloque-picker");
  const countInput = document.getElementById("cm-count");
  const cursoBtns = document.querySelectorAll("#cm-curso-picker [data-curso]");
  const generateBtn = document.getElementById("cm-generate-btn");
  const statusEl = document.getElementById("cm-gen-status");
  const previewWrap = document.getElementById("cm-preview-wrap");
  const previewEl = document.getElementById("cm-preview");
  const toggleBtn = document.getElementById("cm-toggle-solutions");
  const downloadBtn = document.getElementById("cm-download-btn");

  let curso = "5";
  let currentResult = null;
  let showSolutions = false;

  BLOQUES_CALCULO_MENTAL.forEach((bloque, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-secondary" + (i === 0 ? " active" : "");
    btn.textContent = bloque.label;
    btn.dataset.bloque = bloque.id;
    btn.addEventListener("click", () => btn.classList.toggle("active"));
    bloquePicker.appendChild(btn);
  });

  cursoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      cursoBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      curso = btn.dataset.curso;
    });
  });

  function getSelectedBloques() {
    return [...bloquePicker.querySelectorAll("button.active")].map((b) => Number(b.dataset.bloque));
  }

  function renderPreview(semana, bloquesSeleccionados, show) {
    previewEl.innerHTML = "";
    bloquesSeleccionados.forEach((bloqueId) => {
      const bloque = BLOQUES_CALCULO_MENTAL.find((b) => b.id === bloqueId);
      const bar = document.createElement("div");
      bar.className = "lectgen-section-bar";
      bar.textContent = bloque.label;
      previewEl.appendChild(bar);

      trucosDeBloque(bloqueId).forEach((truco) => {
        const label = document.createElement("p");
        label.className = "lectgen-question";
        label.textContent = truco.label;
        previewEl.appendChild(label);

        const list = document.createElement("ol");
        list.className = "cm-preview-list";
        semana[truco.id].forEach((ej) => {
          const li = document.createElement("li");
          li.textContent = show ? `${ej.enunciado} = ${ej.respuesta}` : `${ej.enunciado} = ______`;
          list.appendChild(li);
        });
        previewEl.appendChild(list);
      });
    });
  }

  generateBtn.addEventListener("click", () => {
    statusEl.classList.remove("show", "ok", "ko");
    statusEl.innerHTML = "";

    const bloquesSeleccionados = getSelectedBloques();
    const porTruco = Math.min(8, Math.max(1, Number(countInput.value) || 3));
    countInput.value = porTruco;

    if (!bloquesSeleccionados.length) {
      statusEl.classList.add("show", "ko");
      statusEl.innerHTML = `<p class="feedback-title">Elige al menos un bloque</p><p>Selecciona uno o varios bloques para generar la ficha.</p>`;
      previewWrap.style.display = "none";
      currentResult = null;
      return;
    }

    try {
      currentResult = generarCalculoMentalYSoluciones(bloquesSeleccionados, porTruco, curso);
      currentResult.bloquesSeleccionados = bloquesSeleccionados;
      showSolutions = false;
      toggleBtn.textContent = "Mostrar soluciones";
      renderPreview(currentResult.semana, bloquesSeleccionados, showSolutions);
      previewWrap.style.display = "";

      const totalEjercicios = bloquesSeleccionados.reduce((acc, id) => acc + trucosDeBloque(id).length * porTruco, 0);
      statusEl.classList.add("show", "ok");
      statusEl.innerHTML = `<p class="feedback-title">¡Ficha generada!</p><p>${totalEjercicios} ejercicios en total (${curso}º de Primaria).</p>`;
    } catch (err) {
      statusEl.classList.add("show", "ko");
      statusEl.innerHTML = `<p class="feedback-title">Ha ocurrido un error</p><p>${err.message}</p>`;
    }
  });

  toggleBtn.addEventListener("click", () => {
    if (!currentResult) return;
    showSolutions = !showSolutions;
    toggleBtn.textContent = showSolutions ? "Ocultar soluciones" : "Mostrar soluciones";
    renderPreview(currentResult.semana, currentResult.bloquesSeleccionados, showSolutions);
  });

  downloadBtn.addEventListener("click", () => {
    if (!currentResult) return;
    downloadBlob(currentResult.fichaBlob, `calculo_mental_${curso}.docx`);
    setTimeout(() => downloadBlob(currentResult.solucionesBlob, `soluciones_calculo_mental_${curso}.docx`), 400);
  });
}
