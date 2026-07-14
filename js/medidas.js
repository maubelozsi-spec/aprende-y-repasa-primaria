// ============================================================
// Medidas: longitud, capacidad, masa y superficie: banco de datos + quiz
// ============================================================

const LONGITUD_ENTRIES = [
  { display: "3 km = ___ m", correct: "3000", options: ["3000", "300", "30000", "30"] },
  { display: "250 cm = ___ m", correct: "2,5", options: ["2,5", "25", "0,25", "250"] },
  { display: "4 m = ___ cm", correct: "400", options: ["400", "40", "4000", "0,4"] },
  { display: "1,5 km = ___ m", correct: "1500", options: ["1500", "150", "15000", "15"] },
  { display: "8 dm = ___ cm", correct: "80", options: ["80", "8", "800", "0,8"] },
  { display: "600 mm = ___ m", correct: "0,6", options: ["0,6", "6", "60", "0,06"] },
];

const CAPACIDAD_ENTRIES = [
  { display: "2 l = ___ ml", correct: "2000", options: ["2000", "200", "20000", "20"] },
  { display: "500 ml = ___ l", correct: "0,5", options: ["0,5", "5", "50", "0,05"] },
  { display: "3,5 l = ___ ml", correct: "3500", options: ["3500", "350", "35000", "35"] },
  { display: "150 cl = ___ l", correct: "1,5", options: ["1,5", "15", "0,15", "150"] },
  { display: "7 dl = ___ l", correct: "0,7", options: ["0,7", "7", "70", "0,07"] },
  { display: "2000 ml = ___ l", correct: "2", options: ["2", "20", "0,2", "200"] },
];

const MASA_ENTRIES = [
  { display: "3 kg = ___ g", correct: "3000", options: ["3000", "300", "30000", "30"] },
  { display: "750 g = ___ kg", correct: "0,75", options: ["0,75", "7,5", "75", "0,075"] },
  { display: "2,5 kg = ___ g", correct: "2500", options: ["2500", "250", "25000", "25"] },
  { display: "500 g = ___ kg", correct: "0,5", options: ["0,5", "5", "50", "0,05"] },
  { display: "4000 mg = ___ g", correct: "4", options: ["4", "40", "0,4", "400"] },
  { display: "6 hg = ___ g", correct: "600", options: ["600", "60", "6000", "6"] },
];

const SUPERFICIE_ENTRIES = [
  { display: "2 m² = ___ cm²", correct: "20000", options: ["20000", "200", "2000", "200000"] },
  { display: "3 dm² = ___ cm²", correct: "300", options: ["300", "30", "3000", "30000"] },
  { display: "1 m² = ___ dm²", correct: "100", options: ["100", "10", "1000", "10000"] },
  { display: "500 cm² = ___ dm²", correct: "5", options: ["5", "50", "0,5", "5000"] },
  { display: "2 dam² = ___ m²", correct: "200", options: ["200", "20", "2000", "20000"] },
  { display: "10000 cm² = ___ m²", correct: "1", options: ["1", "10", "0,1", "100"] },
];

const MODE_GROUPS = {
  longitud: {
    pool: LONGITUD_ENTRIES,
    field: "correct",
    question: () => "Completa la conversión:",
  },
  capacidad: {
    pool: CAPACIDAD_ENTRIES,
    field: "correct",
    question: () => "Completa la conversión:",
  },
  masa: {
    pool: MASA_ENTRIES,
    field: "correct",
    question: () => "Completa la conversión:",
  },
  superficie: {
    pool: SUPERFICIE_ENTRIES,
    field: "correct",
    question: () => "Completa la conversión (recuerda: ×100 cada escalón):",
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
  let mode = "longitud";
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
