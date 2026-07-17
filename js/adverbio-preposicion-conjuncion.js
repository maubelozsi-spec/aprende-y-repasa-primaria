// ============================================================
// El adverbio, la preposición y la conjunción: banco de datos + quiz
// ============================================================

const CATEGORIA_ENTRIES = [
  { word: "aquí", categoria: "Adverbio" },
  { word: "ayer", categoria: "Adverbio" },
  { word: "bien", categoria: "Adverbio" },
  { word: "mucho", categoria: "Adverbio" },
  { word: "siempre", categoria: "Adverbio" },
  { word: "despacio", categoria: "Adverbio" },
  { word: "a", categoria: "Preposición" },
  { word: "con", categoria: "Preposición" },
  { word: "de", categoria: "Preposición" },
  { word: "en", categoria: "Preposición" },
  { word: "para", categoria: "Preposición" },
  { word: "sin", categoria: "Preposición" },
  { word: "y", categoria: "Conjunción" },
  { word: "o", categoria: "Conjunción" },
  { word: "pero", categoria: "Conjunción" },
  { word: "porque", categoria: "Conjunción" },
  { word: "si", categoria: "Conjunción" },
  { word: "aunque", categoria: "Conjunción" },
];

const TIPO_ADVERBIO_ENTRIES = [
  { word: "aquí", tipo: "Lugar" },
  { word: "allí", tipo: "Lugar" },
  { word: "cerca", tipo: "Lugar" },
  { word: "arriba", tipo: "Lugar" },
  { word: "hoy", tipo: "Tiempo" },
  { word: "ayer", tipo: "Tiempo" },
  { word: "mañana", tipo: "Tiempo" },
  { word: "siempre", tipo: "Tiempo" },
  { word: "bien", tipo: "Modo" },
  { word: "mal", tipo: "Modo" },
  { word: "despacio", tipo: "Modo" },
  { word: "así", tipo: "Modo" },
  { word: "mucho", tipo: "Cantidad" },
  { word: "poco", tipo: "Cantidad" },
  { word: "bastante", tipo: "Cantidad" },
  { word: "demasiado", tipo: "Cantidad" },
  { word: "sí", tipo: "Afirmación" },
  { word: "también", tipo: "Afirmación" },
  { word: "no", tipo: "Negación" },
  { word: "nunca", tipo: "Negación" },
  { word: "tampoco", tipo: "Negación" },
  { word: "quizás", tipo: "Duda" },
  { word: "acaso", tipo: "Duda" },
];

const MODE_GROUPS = {
  categoria: {
    pool: CATEGORIA_ENTRIES,
    field: "categoria",
    question: (e) => `¿"${e.word}" es un adverbio, una preposición o una conjunción?`,
    options: ["Adverbio", "Preposición", "Conjunción"],
  },
  tipoadverbio: {
    pool: TIPO_ADVERBIO_ENTRIES,
    field: "tipo",
    question: (e) => `¿Qué tipo de adverbio es "${e.word}"?`,
    options: ["Lugar", "Tiempo", "Modo", "Cantidad", "Afirmación", "Negación", "Duda"],
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

const ADVPREPCONJ_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo adverbio, preposición o conjunción (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo distinguir entre las tres categorías básicas, sin los tipos de adverbio.",
    example: "«con» → preposición",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las palabras.",
    example: "«aquí» → adverbio → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Adverbio, preposición o conjunción» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo la categoría básica y ayuda extra",
    text: "Igual que en ACS, se trabaja solo distinguir adverbio, preposición o conjunción, dando más tiempo para pensar.",
    example: "«pero» → conjunción",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Tipo de adverbio",
    text: "Se practica directamente con el contenido más exigente: identificar el <strong>tipo de adverbio</strong> entre siete categorías posibles.",
    example: "«quizás» → adverbio de duda",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Qué categoría es? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, ADVPREPCONJ_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), ADVPREPCONJ_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-advprepconj"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  const modeKeys = Object.keys(MODE_GROUPS);
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "categoria";
  let current;
  let lastWord = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "categoria";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "categoria"));
    } else if (diff.is("altas")) {
      mode = "tipoadverbio";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "tipoadverbio"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "categoria";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "categoria"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS[groupKey];
    let entry;
    do {
      entry = group.pool[Math.floor(Math.random() * group.pool.length)];
    } while (group.pool.length > 1 && entry.word === lastWord);
    lastWord = entry.word;
    return { entry, group };
  }

  function startRound() {
    current = pickQuestion();

    els.instructions.textContent = "Responde:" + (diff.is("discalculia") ? " Tómate tu tiempo." : "");
    els.wordDisplay.textContent = current.group.question(current.entry);

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    const correct = current.entry[current.group.field];
    let options = current.group.options.slice();
    if (options.length > 4) {
      const others = options.filter((o) => o !== correct);
      options = shuffle([correct, ...shuffle(others).slice(0, 3)]);
    } else {
      options = shuffle(options);
    }

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
    AppProgress.record("adverbio-preposicion-conjuncion", isCorrect);
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
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>"${current.entry.word}" → <strong>${correct}</strong>.</p>`;

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
