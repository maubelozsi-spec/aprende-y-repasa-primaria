// ============================================================
// Números romanos: banco de datos + lógica del quiz
// ============================================================

const A_ROMANO_ENTRIES = [
  { display: "4", correct: "IV", options: ["IV", "IIII", "VI", "IX"] },
  { display: "9", correct: "IX", options: ["IX", "VIIII", "XI", "IV"] },
  { display: "14", correct: "XIV", options: ["XIV", "XIIII", "XVI", "XIX"] },
  { display: "19", correct: "XIX", options: ["XIX", "XVIIII", "XXI", "IXX"] },
  { display: "40", correct: "XL", options: ["XL", "XXXX", "LX", "XC"] },
  { display: "50", correct: "L", options: ["L", "XL", "LX", "C"] },
  { display: "90", correct: "XC", options: ["XC", "LXXXX", "CX", "XL"] },
  { display: "24", correct: "XXIV", options: ["XXIV", "XXIIII", "XXVI", "XIV"] },
  { display: "48", correct: "XLVIII", options: ["XLVIII", "XLIIX", "XXXXVIII", "LVIII"] },
  { display: "99", correct: "XCIX", options: ["XCIX", "IC", "LXXXXIX", "XCVIIII"] },
  { display: "100", correct: "C", options: ["C", "D", "L", "M"] },
  { display: "400", correct: "CD", options: ["CD", "CCCC", "DC", "CM"] },
  { display: "500", correct: "D", options: ["D", "CD", "DC", "M"] },
  { display: "900", correct: "CM", options: ["CM", "DCCCC", "MC", "CD"] },
  { display: "1994", correct: "MCMXCIV", options: ["MCMXCIV", "MDCCCXCIV", "MCMLXXXXIV", "MCMXCVI"] },
  { display: "2026", correct: "MMXXVI", options: ["MMXXVI", "MMXXIV", "MXXVI", "MMXVI"] },
];

const A_DECIMAL_ENTRIES = [
  { display: "IV", correct: "4", options: ["4", "6", "9", "14"] },
  { display: "IX", correct: "9", options: ["9", "11", "4", "19"] },
  { display: "XIV", correct: "14", options: ["14", "16", "6", "19"] },
  { display: "XL", correct: "40", options: ["40", "60", "90", "10"] },
  { display: "XC", correct: "90", options: ["90", "60", "110", "40"] },
  { display: "XLVIII", correct: "48", options: ["48", "58", "38", "42"] },
  { display: "XCIX", correct: "99", options: ["99", "89", "101", "91"] },
  { display: "CD", correct: "400", options: ["400", "600", "900", "150"] },
  { display: "CM", correct: "900", options: ["900", "1100", "400", "600"] },
  { display: "MCMXCIV", correct: "1994", options: ["1994", "1896", "2094", "1984"] },
  { display: "LXXII", correct: "72", options: ["72", "68", "82", "62"] },
  { display: "DCCCXXI", correct: "821", options: ["821", "811", "921", "719"] },
];

const MODE_GROUPS = {
  aromano: {
    pool: A_ROMANO_ENTRIES,
    field: "correct",
    question: () => "Escribe este número en romano:",
    connector: "→ en romano:",
  },
  adecimal: {
    pool: A_DECIMAL_ENTRIES,
    field: "correct",
    question: () => "¿Qué número es este número romano?",
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
  let mode = "aromano";
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
    AppProgress.record("numeros-romanos", isCorrect);
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
