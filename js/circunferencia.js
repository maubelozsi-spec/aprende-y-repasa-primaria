// ============================================================
// Circunferencia y círculo: banco de datos + lógica del quiz
// ============================================================

const RADIODIAMETRO_ENTRIES = [
  { display: "Radio 5 cm → ¿diámetro?", correct: "10", options: ["10", "5", "2,5", "15"] },
  { display: "Diámetro 12 cm → ¿radio?", correct: "6", options: ["6", "24", "12", "3"] },
  { display: "Radio 8 cm → ¿diámetro?", correct: "16", options: ["16", "8", "4", "24"] },
  { display: "Diámetro 20 cm → ¿radio?", correct: "10", options: ["10", "40", "20", "5"] },
  { display: "Radio 3,5 cm → ¿diámetro?", correct: "7", options: ["7", "3,5", "1,75", "10,5"] },
  { display: "Diámetro 9 cm → ¿radio?", correct: "4,5", options: ["4,5", "18", "9", "3"] },
];

const LONGITUD_ENTRIES = [
  { display: "Circunferencia de radio 5 cm", correct: "31,4", options: ["31,4", "15,7", "78,5", "62,8"] },
  { display: "Circunferencia de radio 10 cm", correct: "62,8", options: ["62,8", "31,4", "314", "20"] },
  { display: "Circunferencia de radio 2 cm", correct: "12,56", options: ["12,56", "6,28", "4", "25,12"] },
  { display: "Circunferencia de radio 4 cm", correct: "25,12", options: ["25,12", "12,56", "50,24", "8"] },
  { display: "Circunferencia de radio 1 cm", correct: "6,28", options: ["6,28", "3,14", "12,56", "1"] },
];

const AREA_ENTRIES = [
  { display: "Círculo de radio 4 cm", correct: "50,24", options: ["50,24", "25,12", "12,56", "100,48"] },
  { display: "Círculo de radio 2 cm", correct: "12,56", options: ["12,56", "6,28", "25,12", "4"] },
  { display: "Círculo de radio 5 cm", correct: "78,5", options: ["78,5", "31,4", "15,7", "157"] },
  { display: "Círculo de radio 10 cm", correct: "314", options: ["314", "62,8", "628", "100"] },
  { display: "Círculo de radio 3 cm", correct: "28,26", options: ["28,26", "18,84", "9,42", "56,52"] },
];

const ACS_ENTRIES = [
  { display: "Radio 5 cm → ¿diámetro?", correct: "10", options: ["10", "5", "15", "20"] },
  { display: "Diámetro 12 cm → ¿radio?", correct: "6", options: ["6", "24", "12", "3"] },
  { display: "Radio 8 cm → ¿diámetro?", correct: "16", options: ["16", "8", "4", "24"] },
  { display: "Diámetro 20 cm → ¿radio?", correct: "10", options: ["10", "40", "20", "5"] },
];

const ACS_GROUP = {
  pool: ACS_ENTRIES,
  field: "correct",
  question: () => "Calcula:",
};

const MODE_GROUPS = {
  radiodiametro: {
    pool: RADIODIAMETRO_ENTRIES,
    field: "correct",
    question: () => "Calcula:",
  },
  longitud: {
    pool: LONGITUD_ENTRIES,
    field: "correct",
    question: () => "Calcula la longitud de la circunferencia (usa π = 3,14):",
  },
  area: {
    pool: AREA_ENTRIES,
    field: "correct",
    question: () => "Calcula el área del círculo (usa π = 3,14):",
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

const CIRCUNFERENCIA_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo radio y diámetro (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo la relación entre el radio y el diámetro, sin calcular longitudes ni áreas con π.",
    example: "Radio 5 cm → diámetro = 5 × 2 = 10 cm",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de contenido, pero con una tipografía más legible para leer las preguntas.",
    example: "Radio 5 cm → diámetro = 10 cm → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Radio y diámetro» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo radio y diámetro y ayuda extra",
    text: "Igual que en ACS, se trabaja solo la relación entre radio y diámetro, dando más tiempo para pensar cada respuesta.",
    example: "Diámetro 12 cm → radio = 12 ÷ 2 = 6 cm",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Área del círculo",
    text: "Se practica directamente con el cálculo más exigente: el <strong>área del círculo</strong> usando π.",
    example: "Círculo de radio 5 cm → Área = 3,14 × 5 × 5 = 78,5 cm²",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "Radio 5 cm → ¿diámetro? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, CIRCUNFERENCIA_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), CIRCUNFERENCIA_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-circunferencia"),
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
  let mode = "radiodiametro";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (diff.is("altas")) {
      mode = "area";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "area"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "radiodiametro";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "radiodiametro"));
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
    AppProgress.record("circunferencia", isCorrect);
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
