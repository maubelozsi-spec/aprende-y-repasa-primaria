// ============================================================
// Números decimales: banco de datos + lógica del quiz
// ============================================================

const FRACCIONADECIMAL_ENTRIES = [
  { display: "3/10", correct: "0,3", options: ["0,3", "0,03", "3,10", "1,3"] },
  { display: "25/100", correct: "0,25", options: ["0,25", "2,5", "0,025", "25,0"] },
  { display: "7/10", correct: "0,7", options: ["0,7", "0,07", "7,10", "1,7"] },
  { display: "125/1000", correct: "0,125", options: ["0,125", "1,25", "0,0125", "125,0"] },
  { display: "9/100", correct: "0,09", options: ["0,09", "0,9", "9,100", "0,009"] },
  { display: "4/1000", correct: "0,004", options: ["0,004", "0,04", "0,4", "4,1"] },
];

const COMPARAR_ENTRIES = [
  { display: "3,45 ␣ 3,5", correct: "<" },
  { display: "2,7 ␣ 2,70", correct: "=" },
  { display: "5,08 ␣ 5,8", correct: "<" },
  { display: "6,3 ␣ 6,29", correct: ">" },
  { display: "0,9 ␣ 0,90", correct: "=" },
  { display: "4,15 ␣ 4,105", correct: ">" },
  { display: "8,2 ␣ 8,25", correct: "<" },
  { display: "1,03 ␣ 1,3", correct: "<" },
];

const SUMARRESTAR_ENTRIES = [
  { display: "2,5 + 1,3", correct: "3,8", options: ["3,8", "3,7", "1,2", "4,8"] },
  { display: "4,25 + 2,5", correct: "6,75", options: ["6,75", "6,5", "4,50", "2,75"] },
  { display: "5,6 − 2,4", correct: "3,2", options: ["3,2", "3,3", "8,0", "2,4"] },
  { display: "7,35 − 3,15", correct: "4,2", options: ["4,2", "4,02", "3,20", "10,5"] },
  { display: "3,08 + 1,2", correct: "4,28", options: ["4,28", "4,20", "3,20", "4,08"] },
  { display: "9,4 − 5,15", correct: "4,25", options: ["4,25", "4,15", "14,55", "3,25"] },
];

const REDONDEAR_ENTRIES = [
  { display: "3,467 → a las décimas", correct: "3,5", options: ["3,5", "3,4", "3,47", "3,0"] },
  { display: "3,467 → a las centésimas", correct: "3,47", options: ["3,47", "3,46", "3,5", "3,4"] },
  { display: "5,832 → a las décimas", correct: "5,8", options: ["5,8", "5,9", "5,83", "6,0"] },
  { display: "5,832 → a las centésimas", correct: "5,83", options: ["5,83", "5,84", "5,8", "5,9"] },
  { display: "2,149 → a las décimas", correct: "2,1", options: ["2,1", "2,2", "2,15", "2,0"] },
  { display: "7,256 → a las centésimas", correct: "7,26", options: ["7,26", "7,25", "7,3", "7,2"] },
  { display: "0,948 → a las décimas", correct: "0,9", options: ["0,9", "1,0", "0,95", "0,8"] },
  { display: "4,375 → a las centésimas", correct: "4,38", options: ["4,38", "4,37", "4,4", "4,3"] },
];

const ACS_ENTRIES = [
  { display: "3/10", correct: "0,3", options: ["0,3", "0,03", "3,0", "1,3"] },
  { display: "7/10", correct: "0,7", options: ["0,7", "0,07", "7,0", "1,7"] },
  { display: "5/10", correct: "0,5", options: ["0,5", "0,05", "5,0", "1,5"] },
  { display: "1/10", correct: "0,1", options: ["0,1", "0,01", "1,0", "10,0"] },
  { display: "9/10", correct: "0,9", options: ["0,9", "0,09", "9,0", "1,9"] },
];

const ACS_GROUP = {
  pool: ACS_ENTRIES,
  field: "correct",
  question: () => "¿Cómo se escribe esta fracción en forma decimal?",
};

const MODE_GROUPS = {
  fraccionadecimal: {
    pool: FRACCIONADECIMAL_ENTRIES,
    field: "correct",
    question: () => "¿Cómo se escribe esta fracción en forma decimal?",
  },
  comparar: {
    pool: COMPARAR_ENTRIES,
    field: "correct",
    question: () => "¿Qué signo va en el hueco (␣)?",
    options: ["<", "=", ">"],
  },
  sumarrestar: {
    pool: SUMARRESTAR_ENTRIES,
    field: "correct",
    question: () => "Calcula el resultado:",
  },
  redondear: {
    pool: REDONDEAR_ENTRIES,
    field: "correct",
    question: () => "Redondea este número decimal:",
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

const DECIMALES_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo décimas (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo la relación entre fracciones de denominador 10 y su decimal con una sola cifra.",
    example: "3/10 = 0,3",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de decimales, pero con una tipografía más legible para distinguir bien la coma decimal.",
    example: "2,5 + 1,3 = 3,8 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Fracción a decimal» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo décimas y ayuda extra",
    text: "Igual que en ACS, se trabaja solo la relación entre fracciones de denominador 10 y su decimal, dando más tiempo para pensar.",
    example: "7/10 = 0,7",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Redondear números decimales",
    text: "Se practica directamente con el contenido más avanzado: <strong>redondear</strong> números decimales a las décimas o centésimas.",
    example: "3,467 → a las centésimas → 3,47",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "3/10 = ? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, DECIMALES_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), DECIMALES_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-decimales"),
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
  let mode = "fraccionadecimal";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (diff.is("altas")) {
      mode = "redondear";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "redondear"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "fraccionadecimal";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "fraccionadecimal"));
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
    AppProgress.record("decimales", isCorrect);
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
