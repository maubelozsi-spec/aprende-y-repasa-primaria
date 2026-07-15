// ============================================================
// El tiempo: banco de datos + lógica del quiz
// ============================================================

function clockSVG(hour, minute) {
  const cx = 80;
  const cy = 80;
  const r = 70;

  function pointAt(angleDeg, length) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + length * Math.cos(rad), y: cy + length * Math.sin(rad) };
  }

  let ticks = "";
  for (let i = 0; i < 12; i++) {
    const p1 = pointAt(i * 30, 62);
    const p2 = pointAt(i * 30, 70);
    ticks += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="var(--text)" stroke-width="2"/>`;
  }

  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  const minuteAngle = minute * 6;
  const hourPt = pointAt(hourAngle, 38);
  const minPt = pointAt(minuteAngle, 56);

  return `<svg viewBox="0 0 160 160" width="160" height="160">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--text)" stroke-width="3"/>
    ${ticks}
    <line x1="${cx}" y1="${cy}" x2="${hourPt.x}" y2="${hourPt.y}" stroke="var(--color-indigo)" stroke-width="5" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${minPt.x}" y2="${minPt.y}" stroke="var(--color-plum)" stroke-width="3" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="5" fill="var(--text)"/>
  </svg>`;
}

const LEERRELOJ_ENTRIES = [
  { hour: 3, minute: 0, correct: "3:00", options: ["3:00", "9:00", "3:30", "12:15"] },
  { hour: 6, minute: 30, correct: "6:30", options: ["6:30", "12:30", "6:00", "7:30"] },
  { hour: 9, minute: 15, correct: "9:15", options: ["9:15", "3:15", "9:45", "9:00"] },
  { hour: 12, minute: 45, correct: "12:45", options: ["12:45", "9:45", "12:15", "6:45"] },
  { hour: 4, minute: 20, correct: "4:20", options: ["4:20", "4:40", "8:20", "4:10"] },
  { hour: 7, minute: 50, correct: "7:50", options: ["7:50", "10:35", "7:10", "7:55"] },
];

const CONVERSIONES_ENTRIES = [
  { display: "2 h = ___ min", correct: "120", options: ["120", "60", "240", "180"] },
  { display: "180 s = ___ min", correct: "3", options: ["3", "30", "18", "60"] },
  { display: "5 min = ___ s", correct: "300", options: ["300", "50", "500", "60"] },
  { display: "1 h 30 min = ___ min", correct: "90", options: ["90", "130", "60", "150"] },
  { display: "2 h 15 min = ___ min", correct: "135", options: ["135", "215", "120", "145"] },
  { display: "3 min = ___ s", correct: "180", options: ["180", "30", "300", "130"] },
];

const SUMARRESTAR_ENTRIES = [
  { display: "2h 30min + 1h 45min", correct: "4h 15min", options: ["4h 15min", "3h 75min", "4h 75min", "3h 15min"] },
  { display: "3h 20min + 2h 50min", correct: "6h 10min", options: ["6h 10min", "5h 70min", "5h 10min", "6h 70min"] },
  { display: "5h 15min − 2h 40min", correct: "2h 35min", options: ["2h 35min", "3h 25min", "2h 25min", "3h 35min"] },
  { display: "4h 10min − 1h 30min", correct: "2h 40min", options: ["2h 40min", "3h 20min", "2h 20min", "3h 40min"] },
];

const MODE_GROUPS = {
  leerreloj: {
    pool: LEERRELOJ_ENTRIES,
    field: "correct",
    question: () => "¿Qué hora marca el reloj?",
    display: "clock",
  },
  conversiones: {
    pool: CONVERSIONES_ENTRIES,
    field: "correct",
    question: () => "Completa la conversión:",
    display: "text",
  },
  sumarrestar: {
    pool: SUMARRESTAR_ENTRIES,
    field: "correct",
    question: () => "Calcula el resultado:",
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
  renderTeoriaExample();
  if (document.getElementById("game-clock")) initGame();
});

function renderTeoriaExample() {
  const el = document.getElementById("ejemplo-reloj");
  if (el) el.innerHTML = clockSVG(3, 15);
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
    gameClock: document.getElementById("game-clock"),
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
  let mode = "leerreloj";
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

    if (group.display === "clock") {
      els.gameClock.style.display = "";
      els.wordDisplay.style.display = "none";
      els.gameClock.innerHTML = clockSVG(entry.hour, entry.minute);
    } else {
      els.gameClock.style.display = "none";
      els.wordDisplay.style.display = "";
      els.wordDisplay.textContent = entry.display;
    }

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
