// ============================================================
// Fracciones y número mixto: banco de datos + lógica del quiz
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

function fractionVisual(num, denom, color) {
  const wholeBars = Math.floor(num / denom);
  const remainder = num % denom;
  const totalBars = Math.max(remainder > 0 ? wholeBars + 1 : wholeBars, 1);
  let out = '<div style="display:flex; flex-wrap:wrap; gap:6px; justify-content:center;">';
  for (let b = 0; b < totalBars; b++) {
    const filled = b < wholeBars ? denom : remainder;
    out += fractionBarSVG(filled, denom, color);
  }
  out += "</div>";
  return out;
}

const IDENTIFICAR_ENTRIES = [
  { num: 3, denom: 5, correct: "3/5", options: ["3/5", "5/3", "2/5", "3/8"] },
  { num: 2, denom: 3, correct: "2/3", options: ["2/3", "3/2", "1/3", "2/5"] },
  { num: 5, denom: 4, correct: "5/4", options: ["5/4", "4/5", "5/8", "4/4"] },
  { num: 7, denom: 3, correct: "7/3", options: ["7/3", "3/7", "6/3", "7/4"] },
  { num: 1, denom: 6, correct: "1/6", options: ["1/6", "6/1", "1/5", "2/6"] },
  { num: 4, denom: 4, correct: "4/4", options: ["4/4", "4/1", "1/4", "4/5"] },
];

const PROPIA_IMPROPIA_ENTRIES = [
  { display: "3/5", correct: "Propia" },
  { display: "7/4", correct: "Impropia" },
  { display: "2/9", correct: "Propia" },
  { display: "6/6", correct: "Impropia" },
  { display: "5/8", correct: "Propia" },
  { display: "11/3", correct: "Impropia" },
  { display: "1/2", correct: "Propia" },
  { display: "9/4", correct: "Impropia" },
];

const MIXTO_ENTRIES = [
  { display: "11/4", correct: "2 3/4", options: ["2 3/4", "3 1/4", "2 2/4", "1 3/4"] },
  { display: "7/3", correct: "2 1/3", options: ["2 1/3", "1 2/3", "3 1/3", "2 2/3"] },
  { display: "9/2", correct: "4 1/2", options: ["4 1/2", "3 1/2", "4 1/4", "5 1/2"] },
  { display: "13/5", correct: "2 3/5", options: ["2 3/5", "3 2/5", "2 2/5", "1 3/5"] },
  { display: "10/3", correct: "3 1/3", options: ["3 1/3", "2 1/3", "3 2/3", "4 1/3"] },
  { display: "8/3", correct: "2 2/3", options: ["2 2/3", "3 2/3", "2 1/3", "1 2/3"] },
];

const COMPARAR_ENTRIES = [
  { display: "3/5 ␣ 4/5", correct: "<" },
  { display: "2/3 ␣ 2/5", correct: ">" },
  { display: "5/8 ␣ 5/8", correct: "=" },
  { display: "7/4 ␣ 5/4", correct: ">" },
  { display: "4/9 ␣ 4/7", correct: "<" },
  { display: "9/10 ␣ 9/10", correct: "=" },
  { display: "3/8 ␣ 7/8", correct: "<" },
  { display: "6/5 ␣ 6/9", correct: ">" },
];

const MODE_GROUPS = {
  identificar: {
    pool: IDENTIFICAR_ENTRIES,
    field: "correct",
    question: () => "¿Qué fracción representa el dibujo?",
    display: "visual",
  },
  propiaimpropia: {
    pool: PROPIA_IMPROPIA_ENTRIES,
    field: "correct",
    question: () => "¿Es una fracción propia o impropia?",
    options: ["Propia", "Impropia"],
    display: "text",
  },
  mixto: {
    pool: MIXTO_ENTRIES,
    field: "correct",
    question: () => "¿Cuál es el número mixto correcto?",
    display: "text",
  },
  comparar: {
    pool: COMPARAR_ENTRIES,
    field: "correct",
    question: () => "¿Qué signo va en el hueco (␣)?",
    options: ["<", "=", ">"],
    display: "text",
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
  if (document.getElementById("game-visual")) initGame();
});

function renderTeoriaExamples() {
  const fEl = document.getElementById("ejemplo-fraccion");
  if (fEl) fEl.innerHTML = fractionVisual(3, 5);

  const propiaEl = document.getElementById("ejemplo-propia");
  if (propiaEl) propiaEl.innerHTML = fractionVisual(3, 5, "var(--color-teal)");

  const impropiaEl = document.getElementById("ejemplo-impropia");
  if (impropiaEl) impropiaEl.innerHTML = fractionVisual(7, 4, "var(--color-plum)");

  const mixtoEl = document.getElementById("ejemplo-mixto");
  if (mixtoEl) mixtoEl.innerHTML = fractionVisual(7, 3, "var(--color-amber)");
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
    gameVisual: document.getElementById("game-visual"),
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
  let lastEntry = null;

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS[groupKey];
    let entry;
    do {
      entry = group.pool[Math.floor(Math.random() * group.pool.length)];
    } while (group.pool.length > 1 && entry === lastEntry);
    lastEntry = entry;
    return { entry, group };
  }

  function startRound() {
    current = pickQuestion();
    const { entry, group } = current;

    els.instructions.textContent = group.question();
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    if (group.display === "visual") {
      els.gameVisual.style.display = "";
      els.wordDisplay.style.display = "none";
      els.gameVisual.innerHTML = fractionVisual(entry.num, entry.denom);
    } else {
      els.gameVisual.style.display = "none";
      els.wordDisplay.style.display = "";
      els.wordDisplay.textContent = entry.display;
    }

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
