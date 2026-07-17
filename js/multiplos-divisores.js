// ============================================================
// Múltiplos, divisores y números primos: banco de datos + lógica del quiz
// ============================================================

const MULTIPLOS_ENTRIES = [
  { display: "¿Es 42 múltiplo de 6?", correct: "Sí" },
  { display: "¿Es 20 múltiplo de 3?", correct: "No" },
  { display: "¿Es 45 múltiplo de 9?", correct: "Sí" },
  { display: "¿Es 50 múltiplo de 7?", correct: "No" },
  { display: "¿Es 100 múltiplo de 10?", correct: "Sí" },
  { display: "¿Es 36 múltiplo de 8?", correct: "No" },
  { display: "¿Es 63 múltiplo de 7?", correct: "Sí" },
  { display: "¿Es 81 múltiplo de 6?", correct: "No" },
];

const DIVISORES_ENTRIES = [
  { display: "¿Es 6 divisor de 42?", correct: "Sí" },
  { display: "¿Es 4 divisor de 20?", correct: "Sí" },
  { display: "¿Es 5 divisor de 42?", correct: "No" },
  { display: "¿Es 9 divisor de 81?", correct: "Sí" },
  { display: "¿Es 8 divisor de 36?", correct: "No" },
  { display: "¿Es 7 divisor de 63?", correct: "Sí" },
  { display: "¿Es 6 divisor de 81?", correct: "No" },
  { display: "¿Es 10 divisor de 100?", correct: "Sí" },
];

const DIVISIBILIDAD_ENTRIES = [
  { display: "¿Es 348 divisible entre 3?", correct: "Sí" },
  { display: "¿Es 125 divisible entre 2?", correct: "No" },
  { display: "¿Es 430 divisible entre 5?", correct: "Sí" },
  { display: "¿Es 217 divisible entre 3?", correct: "No" },
  { display: "¿Es 590 divisible entre 10?", correct: "Sí" },
  { display: "¿Es 246 divisible entre 2?", correct: "Sí" },
  { display: "¿Es 705 divisible entre 10?", correct: "No" },
  { display: "¿Es 522 divisible entre 3?", correct: "Sí" },
];

const PRIMOS_COMPUESTOS_ENTRIES = [
  { display: "17", correct: "Primo" },
  { display: "24", correct: "Compuesto" },
  { display: "1", correct: "Ninguno de los dos" },
  { display: "13", correct: "Primo" },
  { display: "20", correct: "Compuesto" },
  { display: "29", correct: "Primo" },
  { display: "15", correct: "Compuesto" },
  { display: "2", correct: "Primo" },
];

const MCD_ENTRIES = [
  { display: "M.C.D. de 12 y 18", correct: "6", options: ["6", "3", "36", "2"] },
  { display: "M.C.D. de 8 y 20", correct: "4", options: ["4", "2", "40", "8"] },
  { display: "M.C.D. de 15 y 25", correct: "5", options: ["5", "3", "75", "1"] },
  { display: "M.C.D. de 24 y 36", correct: "12", options: ["12", "6", "4", "72"] },
  { display: "M.C.D. de 9 y 27", correct: "9", options: ["9", "3", "27", "18"] },
  { display: "M.C.D. de 10 y 15", correct: "5", options: ["5", "3", "30", "1"] },
];

const MCM_ENTRIES = [
  { display: "m.c.m. de 4 y 6", correct: "12", options: ["12", "24", "2", "6"] },
  { display: "m.c.m. de 3 y 5", correct: "15", options: ["15", "8", "3", "5"] },
  { display: "m.c.m. de 6 y 8", correct: "24", options: ["24", "48", "2", "14"] },
  { display: "m.c.m. de 2 y 9", correct: "18", options: ["18", "11", "9", "2"] },
  { display: "m.c.m. de 5 y 10", correct: "10", options: ["10", "50", "5", "15"] },
  { display: "m.c.m. de 4 y 10", correct: "20", options: ["20", "40", "14", "10"] },
];

const ACS_ENTRIES = [
  { display: "¿Es 20 múltiplo de 2?", correct: "Sí" },
  { display: "¿Es 15 múltiplo de 2?", correct: "No" },
  { display: "¿Es 25 múltiplo de 5?", correct: "Sí" },
  { display: "¿Es 22 múltiplo de 5?", correct: "No" },
  { display: "¿Es 30 múltiplo de 10?", correct: "Sí" },
  { display: "¿Es 34 múltiplo de 10?", correct: "No" },
];

const ACS_GROUP = {
  pool: ACS_ENTRIES,
  field: "correct",
  question: () => "Responde Sí o No:",
  options: ["Sí", "No"],
};

const MODE_GROUPS = {
  multiplos: {
    pool: MULTIPLOS_ENTRIES,
    field: "correct",
    question: () => "Responde Sí o No:",
    options: ["Sí", "No"],
  },
  divisores: {
    pool: DIVISORES_ENTRIES,
    field: "correct",
    question: () => "Responde Sí o No:",
    options: ["Sí", "No"],
  },
  divisibilidad: {
    pool: DIVISIBILIDAD_ENTRIES,
    field: "correct",
    question: () => "Responde Sí o No:",
    options: ["Sí", "No"],
  },
  primoscompuesto: {
    pool: PRIMOS_COMPUESTOS_ENTRIES,
    field: "correct",
    question: () => "¿Es un número primo, compuesto o ninguno de los dos?",
    options: ["Primo", "Compuesto", "Ninguno de los dos"],
  },
  mcd: {
    pool: MCD_ENTRIES,
    field: "correct",
    question: () => "Calcula el máximo común divisor:",
    options: null,
  },
  mcm: {
    pool: MCM_ENTRIES,
    field: "correct",
    question: () => "Calcula el mínimo común múltiplo:",
    options: null,
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

const MULTDIV_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo múltiplos de 2, 5 y 10 (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo si un número es múltiplo de 2, 5 o 10, usando los trucos más sencillos (acabar en cifra par, en 0 o en 5).",
    example: "20 → múltiplo de 2, de 5 y de 10 · 22 → múltiplo de 2, pero no de 5 ni de 10",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de contenido, pero con una tipografía más legible para leer las preguntas.",
    example: "¿Es 42 múltiplo de 6? → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Múltiplos» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo múltiplos de 2, 5 y 10 y ayuda extra",
    text: "Igual que en ACS, se trabaja solo con múltiplos de 2, 5 y 10, dando más tiempo para pensar cada respuesta.",
    example: "30 → múltiplo de 2, de 5 y de 10",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Mínimo común múltiplo (m.c.m.)",
    text: "Se practica directamente con el contenido más avanzado: calcular el <strong>mínimo común múltiplo</strong> de dos números.",
    example: "m.c.m. de 6 y 8 = 24",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Es 42 múltiplo de 6? → elige Sí o No",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, MULTDIV_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), MULTDIV_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-multiplos"),
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
  let mode = "multiplos";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (diff.is("altas")) {
      mode = "mcm";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "mcm"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "multiplos";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "multiplos"));
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

    const correct = entry[group.field];
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
    AppProgress.record("multiplos-divisores", isCorrect);
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
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>${entry.display} → <strong>${correct}</strong>.</p>`;

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
