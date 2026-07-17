// ============================================================
// Las potencias: banco de datos + lógica del quiz
// ============================================================

const CALCULAR_ENTRIES = [
  { display: "2²", correct: "4", options: ["4", "2", "6", "8"] },
  { display: "3²", correct: "9", options: ["9", "6", "12", "27"] },
  { display: "4²", correct: "16", options: ["16", "8", "12", "64"] },
  { display: "5²", correct: "25", options: ["25", "10", "20", "125"] },
  { display: "6²", correct: "36", options: ["36", "12", "18", "216"] },
  { display: "2³", correct: "8", options: ["8", "6", "4", "9"] },
  { display: "3³", correct: "27", options: ["27", "9", "6", "18"] },
  { display: "4³", correct: "64", options: ["64", "16", "12", "48"] },
  { display: "5³", correct: "125", options: ["125", "25", "15", "50"] },
  { display: "10²", correct: "100", options: ["100", "20", "10", "1.000"] },
  { display: "10³", correct: "1.000", options: ["1.000", "100", "30", "10.000"] },
  { display: "10⁴", correct: "10.000", options: ["10.000", "1.000", "40", "100.000"] },
  { display: "7¹", correct: "7", options: ["7", "1", "14", "49"] },
  { display: "9⁰", correct: "1", options: ["1", "0", "9", "90"] },
];

const DESCOMPONER_ENTRIES = [
  { display: "3⁴", correct: "3×3×3×3", options: ["3×3×3×3", "3×4", "4×4×4", "3+3+3+3"] },
  { display: "2⁵", correct: "2×2×2×2×2", options: ["2×2×2×2×2", "2×5", "5×5", "2+2+2+2+2"] },
  { display: "5³", correct: "5×5×5", options: ["5×5×5", "5×3", "3×3×3", "5+5+5"] },
  { display: "6²", correct: "6×6", options: ["6×6", "6×2", "2×2", "6+6"] },
  { display: "4³", correct: "4×4×4", options: ["4×4×4", "4×3", "3×3×3", "4+4+4"] },
  { display: "7²", correct: "7×7", options: ["7×7", "7×2", "2×2", "7+7"] },
];

const ACS_ENTRIES = [
  { display: "2²", correct: "4", options: ["4", "2", "6", "8"] },
  { display: "3²", correct: "9", options: ["9", "6", "12", "3"] },
  { display: "4²", correct: "16", options: ["16", "8", "12", "4"] },
  { display: "5²", correct: "25", options: ["25", "10", "20", "5"] },
];

const ACS_GROUP = {
  pool: ACS_ENTRIES,
  field: "correct",
  question: () => "Calcula el cuadrado de este número:",
  connector: "=",
};

const MODE_GROUPS = {
  calcular: {
    pool: CALCULAR_ENTRIES,
    field: "correct",
    question: () => "Calcula el valor de esta potencia:",
    connector: "=",
  },
  descomponer: {
    pool: DESCOMPONER_ENTRIES,
    field: "correct",
    question: () => "Escribe esta potencia como una multiplicación:",
    connector: "=",
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

const POTENCIAS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo el cuadrado de números pequeños (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo elevar al cuadrado números del 2 al 5, viéndolo como una multiplicación del número por sí mismo.",
    example: "3² = 3 × 3 = 9",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantienen las mismas potencias, pero con una tipografía más legible para leer la base y el exponente.",
    example: "4³ = 64 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Calcular la potencia» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo el cuadrado de números pequeños y ayuda extra",
    text: "Igual que en ACS, se trabaja solo elevar al cuadrado números del 2 al 5, dando más tiempo para pensar cada respuesta.",
    example: "4² = 4 × 4 = 16",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Todo mezclado",
    text: "Se practica directamente en modo <strong>«Mezcla»</strong>, combinando el cálculo del valor y la descomposición en multiplicación.",
    example: "2⁵ = 2×2×2×2×2 = 32",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "3² = ? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, POTENCIAS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), POTENCIAS_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-potencias"),
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
  let mode = "calcular";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (diff.is("altas")) {
      mode = "mezcla";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "mezcla"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "calcular";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "calcular"));
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
    AppProgress.record("potencias", isCorrect);
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
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>${entry.display} ${group.connector} <strong>${correct}</strong>.</p>`;

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
