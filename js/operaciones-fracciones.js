// ============================================================
// Operaciones con fracciones: banco de datos + lógica del quiz
// ============================================================

function fractionBarSVG(filled, denom, color) {
  const width = 220;
  const height = 50;
  const x0 = 10;
  const y0 = 5;
  const barH = 40;
  const segW = (width - 20) / denom;
  let rects = "";
  for (let i = 0; i < denom; i++) {
    const x = x0 + i * segW;
    const fill = i < filled ? color || "var(--color-indigo)" : "none";
    rects += `<rect x="${x}" y="${y0}" width="${segW}" height="${barH}" fill="${fill}" stroke="var(--text)" stroke-width="2"/>`;
  }
  return `<svg viewBox="0 0 ${width} ${height}" width="200" height="46">${rects}</svg>`;
}

const FRACCIONDE_ENTRIES = [
  { display: "3/4 de 20", correct: "15", options: ["15", "12", "16", "5"] },
  { display: "2/5 de 25", correct: "10", options: ["10", "5", "15", "20"] },
  { display: "5/6 de 24", correct: "20", options: ["20", "4", "19", "18"] },
  { display: "3/8 de 32", correct: "12", options: ["12", "4", "96", "8"] },
  { display: "2/3 de 18", correct: "12", options: ["12", "6", "9", "15"] },
  { display: "7/10 de 30", correct: "21", options: ["21", "3", "23", "27"] },
];

const SUMARRESTAR_ENTRIES = [
  { display: "2/7 + 3/7", correct: "5/7", options: ["5/7", "5/14", "1/7", "6/7"] },
  { display: "4/9 + 3/9", correct: "7/9", options: ["7/9", "7/18", "1/9", "8/9"] },
  { display: "5/8 − 2/8", correct: "3/8", options: ["3/8", "3/16", "7/8", "2/8"] },
  { display: "7/10 − 4/10", correct: "3/10", options: ["3/10", "3/20", "11/10", "4/10"] },
  { display: "1/6 + 4/6", correct: "5/6", options: ["5/6", "5/12", "3/6", "6/6"] },
  { display: "9/11 − 5/11", correct: "4/11", options: ["4/11", "4/22", "14/11", "5/11"] },
  { display: "3/5 + 3/5", correct: "6/5", options: ["6/5", "6/10", "3/5", "9/5"] },
  { display: "6/7 − 2/7", correct: "4/7", options: ["4/7", "4/14", "8/7", "2/7"] },
];

const PROBLEMAS_ENTRIES = [
  { display: "Tengo 24 caramelos y regalo 1/3. ¿Cuántos regalo?", correct: "8", options: ["8", "3", "16", "12"] },
  { display: "Un libro tiene 40 páginas. Leo 3/8. ¿Cuántas páginas he leído?", correct: "15", options: ["15", "5", "24", "8"] },
  { display: "Hay 30 alumnos y 2/5 son chicas. ¿Cuántas chicas hay?", correct: "12", options: ["12", "6", "18", "15"] },
  { display: "Un depósito tiene 60 litros y se han usado 3/4. ¿Cuántos litros se han usado?", correct: "45", options: ["45", "15", "40", "30"] },
  { display: "En una granja hay 48 animales y 5/6 son gallinas. ¿Cuántas gallinas hay?", correct: "40", options: ["40", "8", "38", "44"] },
  { display: "Tengo 21 euros y gasto 2/3. ¿Cuánto he gastado?", correct: "14", options: ["14", "7", "16", "10"] },
];

const DISTINTODENOM_ENTRIES = [
  { display: "1/2 + 1/3", correct: "5/6", options: ["5/6", "2/5", "1/6", "3/6"] },
  { display: "1/4 + 1/2", correct: "3/4", options: ["3/4", "2/6", "1/4", "2/4"] },
  { display: "2/3 + 1/6", correct: "5/6", options: ["5/6", "3/9", "1/2", "3/6"] },
  { display: "1/2 − 1/4", correct: "1/4", options: ["1/4", "1/2", "0/4", "2/4"] },
  { display: "3/4 − 1/2", correct: "1/4", options: ["1/4", "2/4", "1/2", "2/2"] },
  { display: "1/3 + 1/4", correct: "7/12", options: ["7/12", "2/7", "1/12", "2/12"] },
  { display: "2/5 + 1/2", correct: "9/10", options: ["9/10", "3/7", "1/10", "3/10"] },
  { display: "5/6 − 1/3", correct: "1/2", options: ["1/2", "4/6", "4/3", "1/3"] },
];

const MULTIPLICAR_ENTRIES = [
  { display: "1/2 × 2/3", correct: "2/6", options: ["2/6", "3/5", "1/6", "2/3"] },
  { display: "2/3 × 3/4", correct: "6/12", options: ["6/12", "5/7", "2/4", "6/7"] },
  { display: "1/4 × 2/5", correct: "2/20", options: ["2/20", "3/9", "2/9", "1/20"] },
  { display: "3/5 × 1/2", correct: "3/10", options: ["3/10", "4/7", "3/5", "4/10"] },
  { display: "2/3 × 2/3", correct: "4/9", options: ["4/9", "4/6", "2/9", "4/3"] },
  { display: "1/2 × 1/2", correct: "1/4", options: ["1/4", "2/4", "1/2", "2/2"] },
];

const DIVIDIR_ENTRIES = [
  { display: "1/2 ÷ 1/3", correct: "3/2", options: ["3/2", "1/6", "2/3", "1/3"] },
  { display: "2/3 ÷ 1/2", correct: "4/3", options: ["4/3", "2/6", "3/4", "2/3"] },
  { display: "3/4 ÷ 1/2", correct: "6/4", options: ["6/4", "3/8", "4/6", "3/4"] },
  { display: "1/2 ÷ 2/3", correct: "3/4", options: ["3/4", "2/6", "4/3", "1/3"] },
  { display: "2/5 ÷ 1/2", correct: "4/5", options: ["4/5", "2/10", "5/4", "1/5"] },
  { display: "3/4 ÷ 3/4", correct: "1", options: ["1", "0", "9/16", "6/4"] },
];

const COMODIVISION_ENTRIES = [
  { display: "3/4 = ?", correct: "3 ÷ 4", options: ["3 ÷ 4", "4 ÷ 3", "3 × 4", "3 + 4"] },
  { display: "5/2 = ?", correct: "5 ÷ 2", options: ["5 ÷ 2", "2 ÷ 5", "5 × 2", "5 − 2"] },
  { display: "7/3 = ?", correct: "7 ÷ 3", options: ["7 ÷ 3", "3 ÷ 7", "7 × 3", "3 − 7"] },
  { display: "9/5 = ?", correct: "9 ÷ 5", options: ["9 ÷ 5", "5 ÷ 9", "9 × 5", "5 + 9"] },
];

const MODE_GROUPS = {
  fracciondenum: {
    pool: FRACCIONDE_ENTRIES,
    field: "correct",
    question: () => "Calcula:",
  },
  sumarrestar: {
    pool: SUMARRESTAR_ENTRIES,
    field: "correct",
    question: () => "Calcula el resultado:",
  },
  problemas: {
    pool: PROBLEMAS_ENTRIES,
    field: "correct",
    question: () => "Resuelve el problema:",
  },
  distintodenom: {
    pool: DISTINTODENOM_ENTRIES,
    field: "correct",
    question: () => "Calcula (distinto denominador):",
  },
  multiplicar: {
    pool: MULTIPLICAR_ENTRIES,
    field: "correct",
    question: () => "Multiplica estas fracciones:",
  },
  dividir: {
    pool: DIVIDIR_ENTRIES,
    field: "correct",
    question: () => "Divide estas fracciones:",
  },
  comodivision: {
    pool: COMODIVISION_ENTRIES,
    field: "correct",
    question: () => "¿Qué división es equivalente a esta fracción?",
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
  renderTeoriaExamples();
  if (document.getElementById("word-display")) initGame();
});

function renderTeoriaExamples() {
  const sumaEl = document.getElementById("ejemplo-suma");
  if (sumaEl) {
    sumaEl.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:10px;">
        <div style="display:flex; align-items:center; gap:14px;">
          ${fractionBarSVG(2, 7, "var(--color-teal)")}
          <span style="font-size:22px; font-weight:800;">+</span>
          ${fractionBarSVG(3, 7, "var(--color-amber)")}
          <span style="font-size:22px; font-weight:800;">=</span>
          ${fractionBarSVG(5, 7, "var(--color-indigo)")}
        </div>
      </div>`;
  }
}

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
  let mode = "fracciondenum";
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
    AppProgress.record("operaciones-fracciones", isCorrect);
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
