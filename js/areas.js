// ============================================================
// Área de figuras planas y polígonos: banco de datos + lógica del quiz
// ============================================================

const CALCULAR_ENTRIES = [
  { display: "Cuadrado de lado 5 cm", correct: "25", options: ["25", "20", "10", "15"] },
  { display: "Cuadrado de lado 8 cm", correct: "64", options: ["64", "32", "16", "72"] },
  { display: "Rectángulo de base 6 cm y altura 4 cm", correct: "24", options: ["24", "20", "10", "48"] },
  { display: "Rectángulo de base 9 cm y altura 3 cm", correct: "27", options: ["27", "12", "18", "36"] },
  { display: "Triángulo de base 8 cm y altura 5 cm", correct: "20", options: ["20", "40", "13", "15"] },
  { display: "Triángulo de base 10 cm y altura 6 cm", correct: "30", options: ["30", "60", "16", "20"] },
  { display: "Romboide de base 7 cm y altura 4 cm", correct: "28", options: ["28", "11", "14", "56"] },
  { display: "Rombo de diagonales 10 cm y 6 cm", correct: "30", options: ["30", "60", "16", "8"] },
];

const FORMULA_ENTRIES = [
  { display: "Cuadrado", correct: "lado × lado", options: ["lado × lado", "base × altura", "(base × altura) ÷ 2", "(D × d) ÷ 2"] },
  { display: "Rectángulo", correct: "base × altura", options: ["lado × lado", "base × altura", "(base × altura) ÷ 2", "(D × d) ÷ 2"] },
  { display: "Triángulo", correct: "(base × altura) ÷ 2", options: ["lado × lado", "base × altura", "(base × altura) ÷ 2", "(D × d) ÷ 2"] },
  { display: "Romboide", correct: "base × altura", options: ["lado × lado", "base × altura", "(base × altura) ÷ 2", "(D × d) ÷ 2"] },
  { display: "Rombo", correct: "(D × d) ÷ 2", options: ["lado × lado", "base × altura", "(base × altura) ÷ 2", "(D × d) ÷ 2"] },
];

const PROBLEMAS_ENTRIES = [
  { display: "Un jardín rectangular mide 8 m de base y 5 m de altura. ¿Cuál es su área?", correct: "40", options: ["40", "13", "26", "20"] },
  { display: "Una vela triangular tiene 6 m de base y 4 m de altura. ¿Cuál es su área?", correct: "12", options: ["12", "24", "10", "20"] },
  { display: "Una baldosa cuadrada tiene 30 cm de lado. ¿Cuál es su área?", correct: "900", options: ["900", "60", "120", "300"] },
  { display: "Una cometa (rombo) tiene diagonales de 8 cm y 5 cm. ¿Cuál es su área?", correct: "20", options: ["20", "40", "13", "26"] },
];

const MODE_GROUPS = {
  calcular: {
    pool: CALCULAR_ENTRIES,
    field: "correct",
    question: () => "Calcula el área (en cm²):",
  },
  formula: {
    pool: FORMULA_ENTRIES,
    field: "correct",
    question: () => "¿Qué fórmula se usa para calcular su área?",
  },
  problemas: {
    pool: PROBLEMAS_ENTRIES,
    field: "correct",
    question: () => "Resuelve el problema:",
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
  let mode = "calcular";
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

  startRound();
}
