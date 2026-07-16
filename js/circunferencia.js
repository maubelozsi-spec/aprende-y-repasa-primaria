// ============================================================
// Circunferencia y círculo: banco de datos + lógica del quiz
// ============================================================

const RADIODIAMETRO_ENTRIES = [
  { display: "Radio 5 cm → ¿diámetro?", correct: "10", options: ["10", "5", "2,5", "15"] },
  { display: "Diámetro 12 cm → ¿radio?", correct: "6", options: ["6", "24", "12", "3"] },
  { display: "Radio 8 cm → ¿diámetro?", correct: "16", options: ["16", "8", "4", "24"] },
  { display: "Diámetro 20 cm → ¿radio?", correct: "10", options: ["10", "40", "20", "5"] },
  { display: "Radio 3,5 cm → ¿diámetro?", correct: "7", options: ["7", "3,5", "1,75", "10,5"] },
  { display: "Diámetro 9 cm → ¿radio?", correct: "4,5", options: ["4,5", "18", "9", "3"] },
];

const LONGITUD_ENTRIES = [
  { display: "Circunferencia de radio 5 cm", correct: "31,4", options: ["31,4", "15,7", "78,5", "62,8"] },
  { display: "Circunferencia de radio 10 cm", correct: "62,8", options: ["62,8", "31,4", "314", "20"] },
  { display: "Circunferencia de radio 2 cm", correct: "12,56", options: ["12,56", "6,28", "4", "25,12"] },
  { display: "Circunferencia de radio 4 cm", correct: "25,12", options: ["25,12", "12,56", "50,24", "8"] },
  { display: "Circunferencia de radio 1 cm", correct: "6,28", options: ["6,28", "3,14", "12,56", "1"] },
];

const AREA_ENTRIES = [
  { display: "Círculo de radio 4 cm", correct: "50,24", options: ["50,24", "25,12", "12,56", "100,48"] },
  { display: "Círculo de radio 2 cm", correct: "12,56", options: ["12,56", "6,28", "25,12", "4"] },
  { display: "Círculo de radio 5 cm", correct: "78,5", options: ["78,5", "31,4", "15,7", "157"] },
  { display: "Círculo de radio 10 cm", correct: "314", options: ["314", "62,8", "628", "100"] },
  { display: "Círculo de radio 3 cm", correct: "28,26", options: ["28,26", "18,84", "9,42", "56,52"] },
];

const MODE_GROUPS = {
  radiodiametro: {
    pool: RADIODIAMETRO_ENTRIES,
    field: "correct",
    question: () => "Calcula:",
  },
  longitud: {
    pool: LONGITUD_ENTRIES,
    field: "correct",
    question: () => "Calcula la longitud de la circunferencia (usa π = 3,14):",
  },
  area: {
    pool: AREA_ENTRIES,
    field: "correct",
    question: () => "Calcula el área del círculo (usa π = 3,14):",
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
  let mode = "radiodiametro";
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
    AppProgress.record("circunferencia", isCorrect);
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
