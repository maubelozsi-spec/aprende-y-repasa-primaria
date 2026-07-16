// ============================================================
// Multiplicación y división de decimales: banco de datos + lógica del quiz
// ============================================================

const MULTIPLICAR_ENTRIES = [
  { display: "2,5 × 3", correct: "7,5", options: ["7,5", "0,75", "75", "7,05"] },
  { display: "1,2 × 0,3", correct: "0,36", options: ["0,36", "3,6", "0,036", "36"] },
  { display: "4,5 × 2", correct: "9", options: ["9", "0,9", "90", "9,5"] },
  { display: "3,2 × 4", correct: "12,8", options: ["12,8", "1,28", "128", "12,08"] },
  { display: "0,6 × 5", correct: "3", options: ["3", "0,3", "30", "3,5"] },
  { display: "1,5 × 1,5", correct: "2,25", options: ["2,25", "22,5", "0,225", "2,5"] },
];

const DIVIDIR_ENTRIES = [
  { display: "7,5 ÷ 3", correct: "2,5", options: ["2,5", "25", "0,25", "2,05"] },
  { display: "9,6 ÷ 4", correct: "2,4", options: ["2,4", "24", "0,24", "2,04"] },
  { display: "12,8 ÷ 2", correct: "6,4", options: ["6,4", "64", "0,64", "6,04"] },
  { display: "6,3 ÷ 7", correct: "0,9", options: ["0,9", "9", "0,09", "90"] },
  { display: "15,6 ÷ 6", correct: "2,6", options: ["2,6", "26", "0,26", "2,06"] },
  { display: "8,4 ÷ 4", correct: "2,1", options: ["2,1", "21", "0,21", "2,01"] },
];

const PROBLEMAS_ENTRIES = [
  { display: "Un caramelo cuesta 0,35 €. ¿Cuánto cuestan 4 caramelos?", correct: "1,4", options: ["1,4", "1,04", "14", "0,4"] },
  { display: "Reparto 9,6 litros de agua entre 4 botellas iguales. ¿Cuántos litros lleva cada botella?", correct: "2,4", options: ["2,4", "24", "0,24", "2,04"] },
  { display: "Cada metro de tela cuesta 2,5 €. ¿Cuánto cuestan 6 metros?", correct: "15", options: ["15", "1,5", "150", "15,6"] },
  { display: "Un pastel de 8,4 kg se reparte en 4 trozos iguales. ¿Cuánto pesa cada trozo?", correct: "2,1", options: ["2,1", "21", "0,21", "4,2"] },
];

const DIVIDIRDECIMAL_ENTRIES = [
  { display: "4,8 ÷ 1,2", correct: "4", options: ["4", "0,4", "40", "4,8"] },
  { display: "6,25 ÷ 0,5", correct: "12,5", options: ["12,5", "1,25", "125", "6,25"] },
  { display: "3,6 ÷ 0,9", correct: "4", options: ["4", "0,4", "40", "3,6"] },
  { display: "9,6 ÷ 1,6", correct: "6", options: ["6", "0,6", "60", "16"] },
  { display: "5,4 ÷ 0,6", correct: "9", options: ["9", "0,9", "90", "5,4"] },
  { display: "8,4 ÷ 2,1", correct: "4", options: ["4", "0,4", "40", "2,1"] },
];

const MODE_GROUPS = {
  multiplicar: {
    pool: MULTIPLICAR_ENTRIES,
    field: "correct",
    question: () => "Calcula el resultado:",
  },
  dividir: {
    pool: DIVIDIR_ENTRIES,
    field: "correct",
    question: () => "Calcula el resultado:",
  },
  problemas: {
    pool: PROBLEMAS_ENTRIES,
    field: "correct",
    question: () => "Resuelve el problema:",
  },
  dividirdecimal: {
    pool: DIVIDIRDECIMAL_ENTRIES,
    field: "correct",
    question: () => "Calcula el resultado (divisor decimal):",
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
  let mode = "multiplicar";
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
    AppProgress.record("decimales-md", isCorrect);
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
