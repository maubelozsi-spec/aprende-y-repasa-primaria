// ============================================================
// Números enteros: banco de datos + lógica del quiz
// ============================================================

const COMPARAR_ENTRIES = [
  { display: "−2 ␣ −5", correct: ">" },
  { display: "3 ␣ −8", correct: ">" },
  { display: "−6 ␣ −1", correct: "<" },
  { display: "−4 ␣ 0", correct: "<" },
  { display: "0 ␣ −3", correct: ">" },
  { display: "−7 ␣ −7", correct: "=" },
  { display: "5 ␣ −5", correct: ">" },
  { display: "−9 ␣ −2", correct: "<" },
];

const ABSOLUTO_ENTRIES = [
  { display: "|−5|", correct: "5", options: ["5", "−5", "0", "10"] },
  { display: "|8|", correct: "8", options: ["8", "−8", "0", "16"] },
  { display: "|−12|", correct: "12", options: ["12", "−12", "24", "0"] },
  { display: "|−1|", correct: "1", options: ["1", "−1", "0", "2"] },
  { display: "|20|", correct: "20", options: ["20", "−20", "0", "40"] },
  { display: "|−7|", correct: "7", options: ["7", "−7", "0", "14"] },
];

const SUMAR_ENTRIES = [
  { display: "(−3) + (−4)", correct: "−7", options: ["−7", "7", "−1", "1"] },
  { display: "(+2) + (+5)", correct: "+7", options: ["+7", "−7", "+3", "−3"] },
  { display: "(+7) + (−3)", correct: "+4", options: ["+4", "−4", "+10", "−10"] },
  { display: "(−9) + (+4)", correct: "−5", options: ["−5", "+5", "−13", "+13"] },
  { display: "(−6) + (+6)", correct: "0", options: ["0", "+12", "−12", "+6"] },
  { display: "(+8) + (−2)", correct: "+6", options: ["+6", "−6", "+10", "−10"] },
  { display: "(−5) + (−5)", correct: "−10", options: ["−10", "10", "0", "−5"] },
  { display: "(+3) + (−9)", correct: "−6", options: ["−6", "+6", "−12", "+12"] },
];

const ACS_ENTRIES = [
  { display: "3 ␣ −2", correct: ">" },
  { display: "−5 ␣ 1", correct: "<" },
  { display: "2 ␣ −4", correct: ">" },
  { display: "−1 ␣ 0", correct: "<" },
  { display: "0 ␣ −3", correct: ">" },
  { display: "−2 ␣ 5", correct: "<" },
];

const ACS_GROUP = {
  pool: ACS_ENTRIES,
  field: "correct",
  question: () => "¿Qué signo va en el hueco (␣)? (recuerda: todo positivo es mayor que cualquier negativo)",
  options: ["<", "=", ">"],
};

const MODE_GROUPS = {
  comparar: {
    pool: COMPARAR_ENTRIES,
    field: "correct",
    question: () => "¿Qué signo va en el hueco (␣)?",
    options: ["<", "=", ">"],
  },
  absoluto: {
    pool: ABSOLUTO_ENTRIES,
    field: "correct",
    question: () => "Calcula el valor absoluto:",
  },
  sumar: {
    pool: SUMAR_ENTRIES,
    field: "correct",
    question: () => "Calcula la suma:",
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

const ENTEROS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo distinguir positivos y negativos (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo la idea de que <strong>cualquier número positivo es mayor que cualquier número negativo</strong>, sin valor absoluto ni sumas de enteros.",
    example: "3 > −2 (positivo siempre es mayor que negativo)",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de números enteros, pero con una tipografía más legible para distinguir bien el signo.",
    example: "(−3) + (−4) = −7 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Comparar» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo distinguir positivos y negativos y ayuda extra",
    text: "Igual que en ACS, se trabaja solo comparando positivos y negativos, dando más tiempo para pensar cada respuesta.",
    example: "2 > −4 (positivo siempre es mayor que negativo)",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Sumar números enteros",
    text: "Se practica directamente con el nivel más exigente: <strong>calcular sumas de números enteros</strong> con distinto signo.",
    example: "(−9) + (+4) = −5",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "|−5| = ? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  renderNumberLine();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, ENTEROS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), ENTEROS_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("word-display")) initGame(diff, (fn) => restartCallbacks.push(fn));
});

function renderNumberLine() {
  const g = document.getElementById("tickmarks");
  if (!g) return;
  const x0 = 30;
  const x1 = 470;
  const min = -5;
  const max = 5;
  const span = max - min;
  let html = "";
  for (let n = min; n <= max; n++) {
    const x = x0 + ((n - min) / span) * (x1 - x0);
    const isZero = n === 0;
    html += `<line x1="${x}" y1="38" x2="${x}" y2="52" stroke="var(--text)" stroke-width="${isZero ? 2.5 : 1.5}"/>`;
    html += `<text x="${x}" y="72" text-anchor="middle" font-size="14" font-weight="${isZero ? 700 : 400}" fill="${n < 0 ? "var(--color-error)" : "var(--text)"}">${n}</text>`;
  }
  g.innerHTML = html;
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

function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-enteros"),
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
  let mode = "comparar";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (diff.is("altas")) {
      mode = "sumar";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "sumar"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "comparar";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "comparar"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    if (diff.is("acs") || diff.is("discalculia")) {
      let entry;
      do {
        entry = ACS_GROUP.pool[Math.floor(Math.random() * ACS_GROUP.pool.length)];
      } while (ACS_GROUP.pool.length > 1 && entry.display === lastDisplay);
      lastDisplay = entry.display;
      return { entry, group: ACS_GROUP };
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
    AppProgress.record("numeros-enteros", isCorrect);
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

  applyDifficultyUI();
  startRound();
}
