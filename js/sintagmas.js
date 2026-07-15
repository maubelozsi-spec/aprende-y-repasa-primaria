// ============================================================
// Los sintagmas: banco de datos + lógica del quiz
// ============================================================

const CLASIFICAR_ENTRIES = [
  { display: "el perro negro", correct: "SN", options: ["SN", "SAdj", "SAdv", "SPrep"] },
  { display: "muy alto", correct: "SAdj", options: ["SAdj", "SN", "SAdv", "SPrep"] },
  { display: "bastante lejos", correct: "SAdv", options: ["SAdv", "SN", "SAdj", "SPrep"] },
  { display: "de mi casa", correct: "SPrep", options: ["SPrep", "SN", "SAdj", "SAdv"] },
  { display: "una casa grande", correct: "SN", options: ["SN", "SAdj", "SAdv", "SPrep"] },
  { display: "con mis amigos", correct: "SPrep", options: ["SPrep", "SN", "SAdj", "SAdv"] },
  { display: "muy despacio", correct: "SAdv", options: ["SAdv", "SN", "SAdj", "SPrep"] },
  { display: "tan simpático", correct: "SAdj", options: ["SAdj", "SN", "SAdv", "SPrep"] },
  { display: "para el colegio", correct: "SPrep", options: ["SPrep", "SN", "SAdj", "SAdv"] },
  { display: "aquellos libros nuevos", correct: "SN", options: ["SN", "SAdj", "SAdv", "SPrep"] },
];

const NUCLEO_ENTRIES = [
  { display: "el perro negro", correct: "perro", options: ["perro", "el", "negro", "el perro"] },
  { display: "muy alto", correct: "alto", options: ["alto", "muy", "alta", "altura"] },
  { display: "bastante lejos", correct: "lejos", options: ["lejos", "bastante", "cerca", "lejano"] },
  { display: "una casa grande", correct: "casa", options: ["casa", "una", "grande", "una casa"] },
  { display: "tan simpático", correct: "simpático", options: ["simpático", "tan", "simpatía", "amable"] },
  { display: "aquellos libros nuevos", correct: "libros", options: ["libros", "aquellos", "nuevos", "aquellos libros"] },
  { display: "muy despacio", correct: "despacio", options: ["despacio", "muy", "lento", "rápido"] },
  { display: "mi hermana pequeña", correct: "hermana", options: ["hermana", "mi", "pequeña", "mi hermana"] },
];

const MODE_GROUPS = {
  clasificar: {
    pool: CLASIFICAR_ENTRIES,
    field: "correct",
    question: () => "¿Qué tipo de sintagma es?",
  },
  nucleo: {
    pool: NUCLEO_ENTRIES,
    field: "correct",
    question: () => "¿Cuál es el núcleo de este sintagma?",
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
  let mode = "clasificar";
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
