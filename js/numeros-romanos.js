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

const ACS_ROMANO_ENTRIES = [
  { display: "3", correct: "III", options: ["III", "IV", "II", "VI"] },
  { display: "6", correct: "VI", options: ["VI", "IV", "VII", "IX"] },
  { display: "8", correct: "VIII", options: ["VIII", "VII", "IX", "VI"] },
  { display: "11", correct: "XI", options: ["XI", "IX", "XII", "IV"] },
  { display: "15", correct: "XV", options: ["XV", "XIV", "XVI", "V"] },
];

const ACS_DECIMAL_ENTRIES = [
  { display: "III", correct: "3", options: ["3", "4", "2", "6"] },
  { display: "VI", correct: "6", options: ["6", "4", "7", "9"] },
  { display: "VIII", correct: "8", options: ["8", "7", "9", "3"] },
  { display: "XI", correct: "11", options: ["11", "9", "12", "4"] },
  { display: "XV", correct: "15", options: ["15", "14", "16", "5"] },
];

const ACS_GROUPS = {
  acsRomano: { pool: ACS_ROMANO_ENTRIES, field: "correct", question: () => "Escribe este número en romano:", connector: "→ en romano:" },
  acsDecimal: { pool: ACS_DECIMAL_ENTRIES, field: "correct", question: () => "¿Qué número es este número romano?", connector: "=" },
};

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

const ROMANOS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo números del 1 al 20 (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo con las letras I, V y X, para números pequeños del 1 al 20, sin L, C, D ni M.",
    example: "8 → VIII · XV → 15",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantienen los mismos números romanos, pero con una tipografía más legible para distinguir mejor las letras.",
    example: "XIV → 14 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente entre convertir a romano y convertir a número, y mantener mejor la atención.",
    example: "Solo preguntas de «De número a romano» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo números del 1 al 20 y ayuda extra",
    text: "Igual que en ACS, se trabaja solo con las letras I, V y X para números del 1 al 20, dando más tiempo para pensar cada respuesta.",
    example: "11 → XI",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Todo mezclado, con números grandes",
    text: "Se practica directamente en modo <strong>«Mezcla»</strong>, combinando conversiones en ambos sentidos con los números más grandes y complejos.",
    example: "MCMXCIV = 1994",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Qué número es XIV? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, ROMANOS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), ROMANOS_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("word-display")) initGame(diff, (fn) => restartCallbacks.push(fn));
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

function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-romanos"),
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
  const acsGroupKeys = Object.keys(ACS_GROUPS);
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "aromano";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (diff.is("altas")) {
      mode = "mezcla";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "mezcla"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "aromano";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "aromano"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    if (diff.is("acs") || diff.is("discalculia")) {
      const group = ACS_GROUPS[acsGroupKeys[Math.floor(Math.random() * acsGroupKeys.length)]];
      let entry;
      do {
        entry = group.pool[Math.floor(Math.random() * group.pool.length)];
      } while (group.pool.length > 1 && entry.display === lastDisplay);
      lastDisplay = entry.display;
      return { entry, group };
    }
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

    els.instructions.textContent =
      group.question() + (diff.is("discalculia") ? " Tómate tu tiempo para pensarlo." : "");
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

  applyDifficultyUI();
  startRound();
}
