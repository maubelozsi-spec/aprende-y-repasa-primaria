// ============================================================
// Ortografía: la h, g/j y x/s: banco de datos + lógica del quiz
// ============================================================

const H_ENTRIES = [
  { display: "¿Cuál está bien escrita?", correct: "hospital", options: ["hospital", "ospital", "hospita", "ospitál"] },
  { display: "¿Cuál está bien escrita?", correct: "huevo", options: ["huevo", "uevo", "güevo", "juevo"] },
  { display: "¿Cuál está bien escrita?", correct: "hielo", options: ["hielo", "ielo", "yelo", "jielo"] },
  { display: "¿Cuál está bien escrita?", correct: "humano", options: ["humano", "umano", "jumano", "gumano"] },
  { display: "¿Cuál está bien escrita?", correct: "hidratante", options: ["hidratante", "idratante", "jidratante", "hydratante"] },
  { display: "¿Cuál está bien escrita?", correct: "hago", options: ["hago", "ago", "jago", "hágo"] },
];

const GJ_ENTRIES = [
  { display: "¿Cuál está bien escrita?", correct: "geografía", options: ["geografía", "jeografía", "geografia", "jeografia"] },
  { display: "¿Cuál está bien escrita?", correct: "jirafa", options: ["jirafa", "girafa", "yirafa", "hirafa"] },
  { display: "¿Cuál está bien escrita?", correct: "recoger", options: ["recoger", "recojer", "recoguer", "recojel"] },
  { display: "¿Cuál está bien escrita?", correct: "viaje", options: ["viaje", "viage", "biaje", "viaje "] },
  { display: "¿Cuál está bien escrita?", correct: "dirigir", options: ["dirigir", "dirijir", "dirigír", "dirijír"] },
  { display: "¿Cuál está bien escrita?", correct: "garaje", options: ["garaje", "garage", "garaje ", "garacho"] },
];

const XS_ENTRIES = [
  { display: "¿Cuál está bien escrita?", correct: "explicar", options: ["explicar", "esplicar", "eksplicar", "explicár"] },
  { display: "¿Cuál está bien escrita?", correct: "extraordinario", options: ["extraordinario", "estraordinario", "extraordinário", "eztraordinario"] },
  { display: "¿Cuál está bien escrita?", correct: "espejo", options: ["espejo", "expejo", "espeljo", "espédjo"] },
  { display: "¿Cuál está bien escrita?", correct: "expresar", options: ["expresar", "espresar", "ekspresar", "expresár"] },
  { display: "¿Cuál está bien escrita?", correct: "estrella", options: ["estrella", "extrella", "estreya", "extreya"] },
  { display: "¿Cuál está bien escrita?", correct: "extraterrestre", options: ["extraterrestre", "estraterrestre", "extraterrrestre", "esxtraterrestre"] },
];

const MODE_GROUPS_ORTOGRAFIA_HGJXS = {
  h: {
    pool: H_ENTRIES,
    field: "correct",
    question: (entry) => entry.display,
  },
  gj: {
    pool: GJ_ENTRIES,
    field: "correct",
    question: (entry) => entry.display,
  },
  xs: {
    pool: XS_ENTRIES,
    field: "correct",
    question: (entry) => entry.display,
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

const ORTOHGJXS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo palabras con h (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo la ortografía de la h, sin g/j ni x/s.",
    example: "¿Cuál está bien escrita? → hospital",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para comparar bien las opciones parecidas.",
    example: "¿Cuál está bien escrita? → huevo → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de regla ortográfica y mantener mejor la atención.",
    example: "Solo preguntas de «Palabras con h» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo palabras con h y ayuda extra",
    text: "Igual que en ACS, se trabaja solo la ortografía de la h, dando más tiempo para pensar cada respuesta.",
    example: "¿Cuál está bien escrita? → hielo",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Palabras con x/s",
    text: "Se practica directamente con la regla más sutil de distinguir: la ortografía de <strong>x</strong> y <strong>s</strong>.",
    example: "¿Cuál está bien escrita? → extraordinario",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Cuál está bien escrita? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, ORTOHGJXS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), ORTOHGJXS_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-ortohgjxs"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  const modeKeys = Object.keys(MODE_GROUPS_ORTOGRAFIA_HGJXS);
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "h";
  let current;
  let lastEntry = null;

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "h";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "h"));
    } else if (diff.is("altas")) {
      mode = "xs";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "xs"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "h";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "h"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS_ORTOGRAFIA_HGJXS[groupKey];
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

    els.instructions.textContent = group.question(entry) + (diff.is("discalculia") ? " Tómate tu tiempo." : "");
    els.wordDisplay.textContent = "";

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
    AppProgress.record("ortografia-hgjxs", isCorrect);
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
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>La forma correcta es: <strong>${correct}</strong>.</p>`;

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

registerLenguaFicha("ortografia-hgjxs", {
  label: "Ortografía de la h, g/j y x/s",
  resumen: "Algunas letras se confunden fácilmente al escribir: la h, la g y la j, y la x y la s.",
  easyMode: "h",
  altasMode: "xs",
  pools: {
    h: { pool: H_ENTRIES, field: "correct", question: (entry) => entry.display, selfContained: true, perEntryOptions: true },
    gj: { pool: GJ_ENTRIES, field: "correct", question: (entry) => entry.display, selfContained: true, perEntryOptions: true },
    xs: { pool: XS_ENTRIES, field: "correct", question: (entry) => entry.display, selfContained: true, perEntryOptions: true },
  },
});
