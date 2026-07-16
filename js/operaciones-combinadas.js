// ============================================================
// Operaciones combinadas: banco de datos + lógica del quiz
// ============================================================

const SIN_PARENTESIS_ENTRIES = [
  { display: "5 + 3 × 2", correct: "11", options: ["11", "16", "13", "10"] },
  { display: "20 − 4 × 3", correct: "8", options: ["8", "48", "16", "24"] },
  { display: "2 + 6 × 5", correct: "32", options: ["32", "40", "17", "36"] },
  { display: "10 + 20 ÷ 5", correct: "14", options: ["14", "6", "30", "8"] },
  { display: "30 − 20 ÷ 5", correct: "26", options: ["26", "2", "10", "22"] },
  { display: "8 + 12 ÷ 4", correct: "11", options: ["11", "5", "20", "9"] },
  { display: "60 − 16 ÷ 4", correct: "56", options: ["56", "11", "44", "52"] },
  { display: "4 + 3 × 2 − 1", correct: "9", options: ["9", "13", "5", "15"] },
];

const CON_PARENTESIS_ENTRIES = [
  { display: "(5 + 3) × 2", correct: "16", options: ["16", "11", "18", "14"] },
  { display: "(20 − 4) × 3", correct: "48", options: ["48", "8", "45", "51"] },
  { display: "(2 + 6) × 5", correct: "40", options: ["40", "32", "35", "45"] },
  { display: "(8 + 12) ÷ 4", correct: "5", options: ["5", "11", "4", "6"] },
  { display: "(10 + 20) ÷ 5", correct: "6", options: ["6", "14", "5", "8"] },
  { display: "(30 − 20) ÷ 5", correct: "2", options: ["2", "26", "3", "10"] },
  { display: "(15 − 5) × 2", correct: "20", options: ["20", "5", "25", "10"] },
  { display: "(6 + 4) × 3", correct: "30", options: ["30", "18", "24", "21"] },
];

const PRIMER_PASO_ENTRIES = [
  { display: "4 + (6 − 2) × 3", correct: "6 − 2", options: ["6 − 2", "2 × 3", "4 + 6", "4 + 2"] },
  { display: "(9 − 5) ÷ 2 + 7", correct: "9 − 5", options: ["9 − 5", "5 ÷ 2", "2 + 7", "9 ÷ 2"] },
  { display: "8 + 3 × 5", correct: "3 × 5", options: ["3 × 5", "8 + 3", "8 × 5", "8 + 5"] },
  { display: "20 − 12 ÷ 4", correct: "12 ÷ 4", options: ["12 ÷ 4", "20 − 12", "20 ÷ 4", "20 − 4"] },
  { display: "(7 + 3) × 4 − 2", correct: "7 + 3", options: ["7 + 3", "3 × 4", "4 − 2", "3 − 2"] },
  { display: "6 × (8 − 5) + 1", correct: "8 − 5", options: ["8 − 5", "6 × 8", "6 × 5", "5 + 1"] },
];

const MODE_GROUPS = {
  sinparentesis: {
    pool: SIN_PARENTESIS_ENTRIES,
    field: "correct",
    question: () => "Calcula el resultado (recuerda el orden de las operaciones):",
    connector: "=",
  },
  conparentesis: {
    pool: CON_PARENTESIS_ENTRIES,
    field: "correct",
    question: () => "Calcula el resultado (los paréntesis se resuelven primero):",
    connector: "=",
  },
  primerpaso: {
    pool: PRIMER_PASO_ENTRIES,
    field: "correct",
    question: () => "¿Qué operación se resuelve primero?",
    connector: "→ se resuelve primero:",
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
  let mode = "sinparentesis";
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
    AppProgress.record("operaciones-combinadas", isCorrect);
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

  startRound();
}
