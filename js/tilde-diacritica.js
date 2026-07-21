// ============================================================
// Tilde diacrítica: banco de datos + lógica del quiz
// ============================================================

const DIACRITICA_ENTRIES = [
  { display: "___ llegó tarde a la fiesta. (pronombre)", correct: "Él", options: ["Él", "El"] },
  { display: "___ perro está durmiendo. (determinante)", correct: "El", options: ["El", "Él"] },
  { display: "___ vienes conmigo? (pronombre)", correct: "Tú", options: ["Tú", "Tu"] },
  { display: "Ese es ___ libro. (determinante)", correct: "tu", options: ["tu", "tú"] },
  { display: "Este regalo es para ___. (pronombre)", correct: "mí", options: ["mí", "mi"] },
  { display: "Este es ___ cuaderno. (determinante)", correct: "mi", options: ["mi", "mí"] },
  { display: "Dijo que ___ vendría. (afirmación)", correct: "sí", options: ["sí", "si"] },
  { display: "___ vienes, avísame. (condicional)", correct: "Si", options: ["Si", "Sí"] },
  { display: "Quiero un ___ con limón. (bebida)", correct: "té", options: ["té", "te"] },
  { display: "___ veo desde aquí. (pronombre)", correct: "Te", options: ["Te", "Té"] },
  { display: "Quiso ir, ___ no pudo. (equivale a \"pero\")", correct: "mas", options: ["mas", "más"] },
  { display: "Quiero ___ tarta, por favor. (cantidad)", correct: "más", options: ["más", "mas"] },
];

const EXCLAMATIVA_ENTRIES = [
  { display: "¿___ quieres comer?", correct: "Qué", options: ["Qué", "Que"] },
  { display: "Dijo ___ vendría a la fiesta.", correct: "que", options: ["que", "qué"] },
  { display: "¿___ vives ahora?", correct: "Dónde", options: ["Dónde", "Donde"] },
  { display: "La casa ___ vivo es pequeña.", correct: "donde", options: ["donde", "dónde"] },
  { display: "No sé ___ lo hizo tan rápido.", correct: "cómo", options: ["cómo", "como"] },
  { display: "Lo hizo ___ quiso.", correct: "como", options: ["como", "cómo"] },
  { display: "¿___ cuesta este libro?", correct: "Cuánto", options: ["Cuánto", "Cuanto"] },
  { display: "Come ___ quiera, sin problema.", correct: "cuanto", options: ["cuanto", "cuánto"] },
  { display: "¡___ alegría verte!", correct: "Qué", options: ["Qué", "Que"] },
  { display: "No sé ___ hacer con esto.", correct: "qué", options: ["qué", "que"] },
];

const MODE_GROUPS_TILDE_DIACRITICA = {
  diacritica: {
    pool: DIACRITICA_ENTRIES,
    field: "correct",
    question: () => "Elige la palabra correcta para completar la frase:",
  },
  exclamativa: {
    pool: EXCLAMATIVA_ENTRIES,
    field: "correct",
    question: () => "Elige la forma correcta (¿lleva tilde o no?):",
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

const TILDEDIACRITICA_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo palabras con tilde diacrítica",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo elegir entre pares de palabras (él/el, tú/tu...), sin las exclamativas e interrogativas.",
    example: "«___ llegó tarde a la fiesta. (pronombre)» → Él",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las frases.",
    example: "«___ vienes conmigo? (pronombre)» → Tú → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo «Mezcla», para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Elegir la palabra correcta» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo palabras con tilde diacrítica y ayuda extra",
    text: "Igual que en ACS, se trabaja solo elegir entre pares de palabras, dando más tiempo para pensar cada respuesta.",
    example: "«Este regalo es para ___. (pronombre)» → mí",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Qué, cómo, dónde... ¿con tilde?",
    text: "Se practica directamente con el contenido más abstracto: decidir si una palabra como qué, cómo o dónde lleva tilde según su función en la frase.",
    example: "«La casa ___ vivo es pequeña.» → donde (sin tilde)",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "Elige la palabra correcta → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, TILDEDIACRITICA_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), TILDEDIACRITICA_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-tilde"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  const modeKeys = Object.keys(MODE_GROUPS_TILDE_DIACRITICA);
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "diacritica";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "diacritica";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "diacritica"));
    } else if (diff.is("altas")) {
      mode = "exclamativa";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "exclamativa"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "diacritica";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "diacritica"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS_TILDE_DIACRITICA[groupKey];
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

    els.instructions.textContent = group.question() + (diff.is("discalculia") ? " Tómate tu tiempo." : "");
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
    AppProgress.record("tilde-diacritica", isCorrect);
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

registerLenguaFicha("tilde-diacritica", {
  label: "Tilde diacrítica",
  resumen: "La tilde diacrítica sirve para distinguir palabras que se escriben igual pero cumplen una función distinta.",
  easyMode: "diacritica",
  altasMode: "exclamativa",
  pools: {
    diacritica: { pool: DIACRITICA_ENTRIES, field: "correct", question: () => "Elige la palabra correcta para completar la frase:", displayField: "display", perEntryOptions: true },
    exclamativa: { pool: EXCLAMATIVA_ENTRIES, field: "correct", question: () => "Elige la forma correcta (¿lleva tilde o no?):", displayField: "display", perEntryOptions: true },
  },
});
