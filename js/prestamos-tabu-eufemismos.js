// ============================================================
// Préstamos, palabras tabú y eufemismos: banco de datos + lógica del quiz
// ============================================================

const ORIGEN_ENTRIES = [
  { display: "fútbol", correct: "Inglés", options: ["Inglés", "Francés", "Italiano", "Árabe"] },
  { display: "croissant", correct: "Francés", options: ["Francés", "Inglés", "Italiano", "Árabe"] },
  { display: "pizza", correct: "Italiano", options: ["Italiano", "Francés", "Inglés", "Árabe"] },
  { display: "selfi", correct: "Inglés", options: ["Inglés", "Francés", "Italiano", "Alemán"] },
  { display: "almohada", correct: "Árabe", options: ["Árabe", "Inglés", "Francés", "Italiano"] },
  { display: "aceituna", correct: "Árabe", options: ["Árabe", "Italiano", "Francés", "Inglés"] },
  { display: "azúcar", correct: "Árabe", options: ["Árabe", "Inglés", "Francés", "Italiano"] },
  { display: "anorak", correct: "Lengua inuit", options: ["Lengua inuit", "Inglés", "Francés", "Italiano"] },
];

const EUFEMISMO_ENTRIES = [
  { display: "morir", correct: "Fallecer", options: ["Fallecer", "Estirar la pata", "Diñarla", "Palmarla"] },
  { display: "viejo", correct: "Persona de la tercera edad", options: ["Persona de la tercera edad", "Carcamal", "Vejestorio", "Anciano decrépito"] },
  { display: "despedir (del trabajo)", correct: "Prescindir de sus servicios", options: ["Prescindir de sus servicios", "Poner de patitas en la calle", "Echar", "Largar del trabajo"] },
  { display: "gordo", correct: "Persona con sobrepeso", options: ["Persona con sobrepeso", "Gordinflón", "Foca", "Obeso mórbido (informal)"] },
  { display: "pobre", correct: "Persona con pocos recursos", options: ["Persona con pocos recursos", "Muerto de hambre", "Pelagatos", "Mendigo (despectivo)"] },
];

const MODE_GROUPS_PRESTAMOS_TABU_EUFEMISMOS = {
  origen: {
    pool: ORIGEN_ENTRIES,
    field: "correct",
    question: () => "¿De qué idioma viene esta palabra prestada?",
  },
  eufemismo: {
    pool: EUFEMISMO_ENTRIES,
    field: "correct",
    question: () => "¿Cuál es el eufemismo correcto para esta palabra tabú?",
  },
};

function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const PRESTAMOS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo origen del préstamo (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo reconocer de qué idioma viene una palabra prestada, sin eufemismos.",
    example: "«pizza» → italiano",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las palabras.",
    example: "«fútbol» → inglés → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Origen del préstamo» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo origen del préstamo y ayuda extra",
    text: "Igual que en ACS, se trabaja solo el origen de la palabra prestada, dando más tiempo para pensar cada respuesta.",
    example: "«croissant» → francés",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Encontrar el eufemismo",
    text: "Se practica directamente con el contenido más exigente: elegir el <strong>eufemismo</strong> correcto entre opciones parecidas.",
    example: "«viejo» → persona de la tercera edad",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿De qué idioma viene? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, PRESTAMOS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), PRESTAMOS_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("word-display")) initGame(diff, (fn) => restartCallbacks.push(fn));
});

function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = {
    teoria: document.getElementById("tab-teoria"),
    practica: document.getElementById("tab-practica"),
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

function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-prestamos"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  const modeKeys = Object.keys(MODE_GROUPS_PRESTAMOS_TABU_EUFEMISMOS);
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "origen";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "origen";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "origen"));
    } else if (diff.is("altas")) {
      mode = "eufemismo";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "eufemismo"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "origen";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "origen"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS_PRESTAMOS_TABU_EUFEMISMOS[groupKey];
    let entry;
    do {
      entry = group.pool[Math.floor(Math.random() * group.pool.length)];
    } while (group.pool.length > 1 && entry.display === lastDisplay);
    lastDisplay = entry.display;
    return { entry, group };
  }

  function startRound() {
    current = pickQuestion();
    const { entry, group } = current;

    els.instructions.textContent = group.question() + (diff.is("discalculia") ? " Tómate tu tiempo." : "");
    els.wordDisplay.textContent = entry.display;

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    const correct = entry[group.field];
    const options = shuffle(entry.options.slice());

    els.answerButtons.innerHTML = "";
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "syllable-chip";
      btn.textContent = opt;
      btn.addEventListener("click", () => chooseAnswer(opt, btn));
      els.answerButtons.appendChild(btn);
    });
  }

  function chooseAnswer(chosen, btn) {
    const { entry, group } = current;
    const correct = entry[group.field];
    const isCorrect = chosen === correct;

    if (isCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("prestamos-tabu-eufemismos", isCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    const allBtns = els.answerButtons.querySelectorAll(".syllable-chip");
    allBtns.forEach((b) => {
      b.disabled = true;
      if (b.textContent === correct) b.classList.add("correct");
      else if (b === btn && !isCorrect) b.classList.add("incorrect");
    });

    const titleText = isCorrect ? "Correcto" : "No era esa";

    els.feedback.classList.add("show", isCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>Respuesta correcta: <strong>${correct}</strong>.</p>`;

    els.nextBtn.style.display = "";
  }

  els.modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      els.modeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      mode = btn.dataset.mode;
      startRound();
    });
  });

  els.nextBtn.addEventListener("click", startRound);

  applyDifficultyUI();
  startRound();
}

registerLenguaFicha("prestamos-tabu-eufemismos", {
  label: "Préstamos, palabras tabú y eufemismos",
  resumen: "Los préstamos son palabras tomadas de otros idiomas; los eufemismos sustituyen palabras tabú por otras más suaves.",
  easyMode: "origen",
  altasMode: "eufemismo",
  pools: {
    origen: { pool: ORIGEN_ENTRIES, field: "correct", question: () => "¿De qué idioma viene esta palabra prestada?", displayField: "display", perEntryOptions: true },
    eufemismo: { pool: EUFEMISMO_ENTRIES, field: "correct", question: () => "¿Cuál es el eufemismo correcto para esta palabra tabú?", displayField: "display", perEntryOptions: true },
  },
});
