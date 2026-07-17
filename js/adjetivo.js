// ============================================================
// El adjetivo: banco de datos + lógica del quiz
// ============================================================

const CLASES_ENTRIES = [
  { word: "alto", clase: "Calificativo" },
  { word: "inteligente", clase: "Calificativo" },
  { word: "feliz", clase: "Calificativo" },
  { word: "rápido", clase: "Calificativo" },
  { word: "amable", clase: "Calificativo" },
  { word: "generoso", clase: "Calificativo" },
  { word: "español", clase: "Gentilicio" },
  { word: "madrileño", clase: "Gentilicio" },
  { word: "francés", clase: "Gentilicio" },
  { word: "italiano", clase: "Gentilicio" },
  { word: "andaluz", clase: "Gentilicio" },
  { word: "mexicano", clase: "Gentilicio" },
];

const GRADO_ENTRIES = [
  { phrase: "Juan es alto", grado: "Positivo" },
  { phrase: "El vestido es bonito", grado: "Positivo" },
  { phrase: "Este coche es rápido", grado: "Positivo" },
  { phrase: "Juan es más alto que Pedro", grado: "Comparativo" },
  { phrase: "Este vestido es tan bonito como el otro", grado: "Comparativo" },
  { phrase: "Soy menos rápido que tú", grado: "Comparativo" },
  { phrase: "Ana es menos alta que su hermano", grado: "Comparativo" },
  { phrase: "Estoy tan feliz como siempre", grado: "Comparativo" },
  { phrase: "Juan es altísimo", grado: "Superlativo" },
  { phrase: "El vestido es muy bonito", grado: "Superlativo" },
  { phrase: "Es el más rápido de la clase", grado: "Superlativo" },
  { phrase: "Este pastel está buenísimo", grado: "Superlativo" },
];

const MODE_GROUPS = {
  clases: { pool: CLASES_ENTRIES, field: "clase", label: (e) => e.word, question: (e) => `¿"${e.word}" es un adjetivo calificativo o gentilicio?`, options: ["Calificativo", "Gentilicio"] },
  grados: { pool: GRADO_ENTRIES, field: "grado", label: (e) => e.phrase, question: (e) => `«${e.phrase}» → ¿en qué grado está el adjetivo?`, options: ["Positivo", "Comparativo", "Superlativo"] },
};

function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const ADJETIVO_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo calificativo o gentilicio (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo distinguir si un adjetivo es calificativo o gentilicio, sin trabajar los grados.",
    example: "«español» → gentilicio",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las palabras y frases.",
    example: "«alto» → calificativo → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Calificativo o gentilicio» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo calificativo o gentilicio y ayuda extra",
    text: "Igual que en ACS, se trabaja solo distinguir calificativo de gentilicio, dando más tiempo para pensar cada respuesta.",
    example: "«francés» → gentilicio",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Los grados del adjetivo",
    text: "Se practica directamente con el contenido más exigente: identificar el <strong>grado</strong> del adjetivo (positivo, comparativo o superlativo) en una frase completa.",
    example: "«Es el más rápido de la clase» → superlativo",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Calificativo o gentilicio? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, ADJETIVO_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), ADJETIVO_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-adjetivo"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "clases";
  let current;
  let lastLabel = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "clases";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "clases"));
    } else if (diff.is("altas")) {
      mode = "grados";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "grados"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "clases";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "clases"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? (Math.random() < 0.5 ? "clases" : "grados") : mode;
    const group = MODE_GROUPS[groupKey];
    let entry;
    do {
      entry = group.pool[Math.floor(Math.random() * group.pool.length)];
    } while (group.pool.length > 1 && group.label(entry) === lastLabel);
    lastLabel = group.label(entry);
    return { entry, group };
  }

  function startRound() {
    current = pickQuestion();

    els.instructions.textContent = "Responde:" + (diff.is("discalculia") ? " Tómate tu tiempo." : "");
    els.wordDisplay.textContent = current.group.question(current.entry);

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    const options = shuffle(current.group.options);
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
    const correct = current.entry[current.group.field];
    const isCorrect = chosen === correct;

    if (isCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("adjetivo", isCorrect);
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
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>${current.group.label(current.entry)} → <strong>${correct}</strong>.</p>`;

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
