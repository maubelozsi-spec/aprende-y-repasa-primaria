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

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  if (document.getElementById("word-display")) initGame();
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

function initGame() {
  const els = {
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

  function pickQuestion() {
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

    els.instructions.textContent = group.question();
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

  startRound();
}
