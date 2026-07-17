// ============================================================
// Sucesos y probabilidad: banco de datos + lógica del quiz
// ============================================================

const TIPO_ENTRIES = [
  { display: "Al lanzar un dado, sacar un número menor que 7.", correct: "Seguro" },
  { display: "Al lanzar una moneda, sacar cara.", correct: "Posible" },
  { display: "Al lanzar un dado, sacar un 8.", correct: "Imposible" },
  { display: "Mañana lloverá.", correct: "Posible" },
  { display: "El sol saldrá mañana por el este.", correct: "Seguro" },
  { display: "Sacar una bola verde de una bolsa que solo tiene bolas rojas.", correct: "Imposible" },
  { display: "Al lanzar un dado, sacar un número par.", correct: "Posible" },
  { display: "Que un mes de febrero tenga 30 días.", correct: "Imposible" },
];

const COMPARAR_ENTRIES = [
  { display: "Bolsa A: 4 rojas y 1 azul. Bolsa B: 2 rojas y 3 azules. ¿En cuál es más probable sacar roja?", correct: "Bolsa A" },
  { display: "Bolsa A: 1 roja y 4 azules. Bolsa B: 3 rojas y 2 azules. ¿En cuál es más probable sacar roja?", correct: "Bolsa B" },
  { display: "Bolsa A: 3 rojas y 3 azules. Bolsa B: 2 rojas y 2 azules. ¿En cuál es más probable sacar roja?", correct: "Es igual de probable" },
  { display: "Bolsa A: 5 rojas y 0 azules. Bolsa B: 4 rojas y 1 azul. ¿En cuál es más probable sacar roja?", correct: "Bolsa A" },
  { display: "Bolsa A: 0 rojas y 5 azules. Bolsa B: 1 roja y 4 azules. ¿En cuál es más probable sacar roja?", correct: "Bolsa B" },
  { display: "Bolsa A: 2 rojas y 2 azules. Bolsa B: 1 roja y 1 azul. ¿En cuál es más probable sacar roja?", correct: "Es igual de probable" },
];

const CALCULAR_ENTRIES = [
  { display: "Bolsa con 3 rojas y 2 azules. Probabilidad de sacar roja.", correct: "3/5", options: ["3/5", "2/5", "3/2", "1/5"] },
  { display: "Bolsa con 4 verdes y 6 amarillas. Probabilidad de sacar verde.", correct: "4/10", options: ["4/10", "6/10", "4/6", "1/10"] },
  { display: "Dado de 6 caras. Probabilidad de sacar un 5.", correct: "1/6", options: ["1/6", "5/6", "1/5", "2/6"] },
  { display: "Bolsa con 2 rojas, 3 azules y 5 verdes. Probabilidad de sacar azul.", correct: "3/10", options: ["3/10", "2/10", "5/10", "3/5"] },
  { display: "Moneda. Probabilidad de sacar cara.", correct: "1/2", options: ["1/2", "1/1", "2/1", "0/2"] },
  { display: "Dado de 6 caras. Probabilidad de sacar un número par.", correct: "3/6", options: ["3/6", "1/6", "2/6", "4/6"] },
];

const ACS_GROUP = {
  pool: TIPO_ENTRIES,
  field: "correct",
  question: () => "¿Es un suceso seguro, posible o imposible?",
  options: ["Seguro", "Posible", "Imposible"],
};

const MODE_GROUPS = {
  tipo: {
    pool: TIPO_ENTRIES,
    field: "correct",
    question: () => "¿Es un suceso seguro, posible o imposible?",
    options: ["Seguro", "Posible", "Imposible"],
  },
  comparar: {
    pool: COMPARAR_ENTRIES,
    field: "correct",
    question: () => "Responde:",
    options: ["Bolsa A", "Bolsa B", "Es igual de probable"],
  },
  calcular: {
    pool: CALCULAR_ENTRIES,
    field: "correct",
    question: () => "Calcula la probabilidad:",
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

const PROBABILIDAD_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo seguro, posible e imposible (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo distinguir si un suceso es seguro, posible o imposible, sin comparar ni calcular probabilidades.",
    example: "Al lanzar un dado, sacar un 8 → imposible",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de contenido, pero con una tipografía más legible para leer los enunciados.",
    example: "Al lanzar una moneda, sacar cara → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Seguro, posible o imposible» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo seguro, posible e imposible y ayuda extra",
    text: "Igual que en ACS, se trabaja solo distinguir sucesos seguros, posibles e imposibles, dando más tiempo para pensar cada respuesta.",
    example: "Mañana lloverá → posible",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Calcular la probabilidad",
    text: "Se practica directamente con el cálculo más exigente: expresar la <strong>probabilidad</strong> como fracción de casos favorables entre casos totales.",
    example: "Bolsa con 3 rojas y 2 azules → probabilidad de roja = 3/5",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Es seguro, posible o imposible? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, PROBABILIDAD_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), PROBABILIDAD_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-probabilidad"),
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
  let mode = "tipo";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (diff.is("altas")) {
      mode = "calcular";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "calcular"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "tipo";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "tipo"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    if (diff.is("acs") || diff.is("discalculia")) {
      let entry;
      do {
        entry = ACS_GROUP.pool[Math.floor(Math.random() * ACS_GROUP.pool.length)];
      } while (ACS_GROUP.pool.length > 1 && entry.display === lastDisplay);
      lastDisplay = entry.display;
      return { entry, group: ACS_GROUP };
    }
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS[groupKey];
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

    els.instructions.textContent =
      group.question() + (diff.is("discalculia") ? " Tómate tu tiempo para pensarlo." : "");
    els.wordDisplay.textContent = entry.display;

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    const options = shuffle((entry.options || group.options).slice());

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
    AppProgress.record("probabilidad", isCorrect);
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
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>La respuesta correcta es <strong>${correct}</strong>.</p>`;

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
