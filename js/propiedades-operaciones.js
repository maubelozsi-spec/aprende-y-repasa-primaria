// ============================================================
// Propiedades de las operaciones: banco de datos + lógica del quiz
// ============================================================

const IDENTIFICAR_ENTRIES = [
  { display: "4 + 7 = 7 + 4", correct: "Conmutativa", options: ["Conmutativa", "Asociativa", "Distributiva", "Elemento neutro"] },
  { display: "3 × 5 = 5 × 3", correct: "Conmutativa", options: ["Conmutativa", "Asociativa", "Distributiva", "Elemento neutro"] },
  { display: "(2 + 3) + 4 = 2 + (3 + 4)", correct: "Asociativa", options: ["Asociativa", "Conmutativa", "Distributiva", "Elemento neutro"] },
  { display: "(2 × 3) × 4 = 2 × (3 × 4)", correct: "Asociativa", options: ["Asociativa", "Conmutativa", "Distributiva", "Elemento neutro"] },
  { display: "3 × (4 + 5) = 3×4 + 3×5", correct: "Distributiva", options: ["Distributiva", "Conmutativa", "Asociativa", "Elemento neutro"] },
  { display: "6 × (2 + 7) = 6×2 + 6×7", correct: "Distributiva", options: ["Distributiva", "Conmutativa", "Asociativa", "Elemento neutro"] },
  { display: "9 + 0 = 9", correct: "Elemento neutro", options: ["Elemento neutro", "Conmutativa", "Asociativa", "Distributiva"] },
  { display: "9 × 1 = 9", correct: "Elemento neutro", options: ["Elemento neutro", "Conmutativa", "Asociativa", "Distributiva"] },
];

const COMPLETAR_ENTRIES = [
  { display: "6 + 9 = 9 + ___", correct: "6", options: ["6", "9", "15", "0"] },
  { display: "8 × 4 = 4 × ___", correct: "8", options: ["8", "4", "32", "1"] },
  { display: "(3 + 5) + 2 = 3 + (5 + ___)", correct: "2", options: ["2", "5", "8", "10"] },
  { display: "(4 × 2) × 6 = 4 × (2 × ___)", correct: "6", options: ["6", "4", "2", "48"] },
  { display: "5 × (3 + 4) = 5×3 + 5×___", correct: "4", options: ["4", "3", "5", "7"] },
  { display: "7 × (6 + 2) = 7×6 + ___×2", correct: "7", options: ["7", "6", "2", "14"] },
  { display: "12 + ___ = 12", correct: "0", options: ["0", "1", "12", "2"] },
  { display: "15 × ___ = 15", correct: "1", options: ["1", "0", "15", "5"] },
];

const DISTRIBUTIVA_ENTRIES = [
  { display: "4 × (3 + 2)", correct: "20", options: ["20", "12", "8", "24"] },
  { display: "6 × (5 + 1)", correct: "36", options: ["36", "30", "6", "42"] },
  { display: "3 × (7 + 2)", correct: "27", options: ["27", "21", "6", "23"] },
  { display: "5 × (4 + 3)", correct: "35", options: ["35", "20", "15", "40"] },
  { display: "2 × (8 + 5)", correct: "26", options: ["26", "16", "10", "13"] },
  { display: "8 × (2 + 6)", correct: "64", options: ["64", "16", "48", "56"] },
];

const MODE_GROUPS = {
  identificar: {
    pool: IDENTIFICAR_ENTRIES,
    field: "correct",
    question: () => "¿Qué propiedad se muestra en esta igualdad?",
    connector: "→ propiedad:",
  },
  completar: {
    pool: COMPLETAR_ENTRIES,
    field: "correct",
    question: () => "Completa la igualdad con el número que falta:",
    connector: "→ falta:",
  },
  distributiva: {
    pool: DISTRIBUTIVA_ENTRIES,
    field: "correct",
    question: () => "Calcula aplicando la propiedad distributiva:",
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
  let mode = "identificar";
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
