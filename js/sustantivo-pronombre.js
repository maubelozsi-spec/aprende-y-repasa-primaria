// ============================================================
// El sustantivo y el pronombre: banco de datos + lógica del quiz
// ============================================================

const NOUNS = [
  { word: "perro", tipo: "comun", concrecion: "concreto", cantidad: "individual", genero: "masculino", numero: "singular" },
  { word: "mesa", tipo: "comun", concrecion: "concreto", cantidad: "individual", genero: "femenino", numero: "singular" },
  { word: "flores", tipo: "comun", concrecion: "concreto", cantidad: "individual", genero: "femenino", numero: "plural" },
  { word: "libros", tipo: "comun", concrecion: "concreto", cantidad: "individual", genero: "masculino", numero: "plural" },
  { word: "coche", tipo: "comun", concrecion: "concreto", cantidad: "individual", genero: "masculino", numero: "singular" },
  { word: "ventana", tipo: "comun", concrecion: "concreto", cantidad: "individual", genero: "femenino", numero: "singular" },
  { word: "rebaño", tipo: "comun", concrecion: "concreto", cantidad: "colectivo", genero: "masculino", numero: "singular" },
  { word: "bosque", tipo: "comun", concrecion: "concreto", cantidad: "colectivo", genero: "masculino", numero: "singular" },
  { word: "equipo", tipo: "comun", concrecion: "concreto", cantidad: "colectivo", genero: "masculino", numero: "singular" },
  { word: "enjambre", tipo: "comun", concrecion: "concreto", cantidad: "colectivo", genero: "masculino", numero: "singular" },
  { word: "alumnado", tipo: "comun", concrecion: "concreto", cantidad: "colectivo", genero: "masculino", numero: "singular" },
  { word: "alegría", tipo: "comun", concrecion: "abstracto", genero: "femenino", numero: "singular" },
  { word: "libertad", tipo: "comun", concrecion: "abstracto", genero: "femenino", numero: "singular" },
  { word: "bondad", tipo: "comun", concrecion: "abstracto", genero: "femenino", numero: "singular" },
  { word: "amistad", tipo: "comun", concrecion: "abstracto", genero: "femenino", numero: "singular" },
  { word: "miedo", tipo: "comun", concrecion: "abstracto", genero: "masculino", numero: "singular" },
  { word: "Madrid", tipo: "propio", numero: "singular" },
  { word: "Ana", tipo: "propio", numero: "singular" },
  { word: "España", tipo: "propio", numero: "singular" },
  { word: "Everest", tipo: "propio", numero: "singular" },
  { word: "Pirineos", tipo: "propio", numero: "plural" },
];

const PRONOUNS = [
  { word: "yo", persona: "1ª", numero: "singular" },
  { word: "tú", persona: "2ª", numero: "singular" },
  { word: "él", persona: "3ª", numero: "singular" },
  { word: "ella", persona: "3ª", numero: "singular" },
  { word: "nosotros", persona: "1ª", numero: "plural" },
  { word: "nosotras", persona: "1ª", numero: "plural" },
  { word: "vosotros", persona: "2ª", numero: "plural" },
  { word: "vosotras", persona: "2ª", numero: "plural" },
  { word: "ellos", persona: "3ª", numero: "plural" },
  { word: "ellas", persona: "3ª", numero: "plural" },
];

const QUESTION_TYPES = {
  tipo: {
    applicable: (e) => e.tipo !== undefined,
    prompt: (e) => `¿"${e.word}" es un sustantivo común o propio?`,
    correct: (e) => (e.tipo === "comun" ? "Común" : "Propio"),
    options: ["Común", "Propio"],
  },
  cantidad: {
    applicable: (e) => e.cantidad !== undefined,
    prompt: (e) => `¿"${e.word}" es un sustantivo individual o colectivo?`,
    correct: (e) => (e.cantidad === "individual" ? "Individual" : "Colectivo"),
    options: ["Individual", "Colectivo"],
  },
  concrecion: {
    applicable: (e) => e.concrecion !== undefined,
    prompt: (e) => `¿"${e.word}" es un sustantivo concreto o abstracto?`,
    correct: (e) => (e.concrecion === "concreto" ? "Concreto" : "Abstracto"),
    options: ["Concreto", "Abstracto"],
  },
  genero: {
    applicable: (e) => e.genero !== undefined,
    prompt: (e) => `¿Cuál es el género de "${e.word}"?`,
    correct: (e) => (e.genero === "masculino" ? "Masculino" : "Femenino"),
    options: ["Masculino", "Femenino"],
  },
  numero: {
    applicable: (e) => e.numero !== undefined,
    prompt: (e) => `¿"${e.word}" está en singular o en plural?`,
    correct: (e) => (e.numero === "singular" ? "Singular" : "Plural"),
    options: ["Singular", "Plural"],
  },
  pronombre: {
    applicable: (e) => e.persona !== undefined,
    prompt: (e) => `¿A qué persona y número corresponde "${e.word}"?`,
    correct: (e) => `${e.persona} persona ${e.numero}`,
    options: [
      "1ª persona singular",
      "2ª persona singular",
      "3ª persona singular",
      "1ª persona plural",
      "2ª persona plural",
      "3ª persona plural",
    ],
  },
};

const MODE_GROUPS = {
  clases: { pool: NOUNS, types: ["tipo", "cantidad", "concrecion"] },
  generonumero: { pool: NOUNS, types: ["genero", "numero"] },
  pronombres: { pool: PRONOUNS, types: ["pronombre"] },
  mezcla: { pool: [...NOUNS, ...PRONOUNS], types: ["tipo", "cantidad", "concrecion", "genero", "numero", "pronombre"] },
};

function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const SUSTPRON_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo género y número (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo el género y el número del sustantivo, sin las clases (común/propio, individual/colectivo, concreto/abstracto).",
    example: "«mesa» → femenino, singular",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las palabras.",
    example: "«libros» → plural → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Clases de sustantivo» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo género y número y ayuda extra",
    text: "Igual que en ACS, se trabaja solo el género y el número, dando más tiempo para pensar cada respuesta.",
    example: "«coche» → masculino, singular",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Pronombres personales",
    text: "Se practica directamente con el contenido más exigente: identificar la <strong>persona y el número</strong> del pronombre entre seis opciones.",
    example: "«vosotras» → 2ª persona plural",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "Responde → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, SUSTPRON_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), SUSTPRON_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-sustantivopronombre"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "clases";
  let current;
  let lastWord = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "generonumero";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "generonumero"));
    } else if (diff.is("altas")) {
      mode = "pronombres";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "pronombres"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "clases";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "clases"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const group = MODE_GROUPS[mode];
    let entry, typeKey;
    let attempts = 0;
    do {
      entry = group.pool[Math.floor(Math.random() * group.pool.length)];
      const applicableTypes = group.types.filter((t) => QUESTION_TYPES[t].applicable(entry));
      typeKey = applicableTypes.length ? applicableTypes[Math.floor(Math.random() * applicableTypes.length)] : null;
      attempts++;
    } while ((!typeKey || entry.word === lastWord) && attempts < 30);
    lastWord = entry.word;
    return { entry, type: QUESTION_TYPES[typeKey] };
  }

  function startRound() {
    current = pickQuestion();

    els.instructions.textContent = "Responde:" + (diff.is("discalculia") ? " Tómate tu tiempo." : "");
    els.wordDisplay.innerHTML = current.type.prompt(current.entry);

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    const correct = current.type.correct(current.entry);
    let options = current.type.options.slice();
    if (options.length > 4) {
      const others = options.filter((o) => o !== correct);
      options = shuffle([correct, ...shuffle(others).slice(0, 3)]);
    } else {
      options = shuffle(options);
    }

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
    const correct = current.type.correct(current.entry);
    const isCorrect = chosen === correct;

    if (isCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("sustantivo-pronombre", isCorrect);
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
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>"${current.entry.word}" → <strong>${correct}</strong>.</p>`;

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

const SUSTPRON_FICHA_POOL_CLASES = [];
NOUNS.forEach((e) => { ["tipo", "cantidad", "concrecion"].forEach((t) => { if (QUESTION_TYPES[t].applicable(e)) SUSTPRON_FICHA_POOL_CLASES.push({ entry: e, typeKey: t }); }); });
const SUSTPRON_FICHA_POOL_GENERONUMERO = [];
NOUNS.forEach((e) => { ["genero", "numero"].forEach((t) => { if (QUESTION_TYPES[t].applicable(e)) SUSTPRON_FICHA_POOL_GENERONUMERO.push({ entry: e, typeKey: t }); }); });
const SUSTPRON_FICHA_POOL_PRONOMBRES = PRONOUNS.map((e) => ({ entry: e, typeKey: "pronombre" }));

registerLenguaFicha("sustantivo-pronombre", {
  label: "El sustantivo y el pronombre",
  resumen: "El sustantivo nombra personas, animales, cosas o ideas; el pronombre lo sustituye para no repetirlo.",
  easyMode: "generonumero",
  altasMode: "pronombres",
  defaultMode: "clases",
  pools: {
    clases: {
      pool: SUSTPRON_FICHA_POOL_CLASES,
      question: (w) => QUESTION_TYPES[w.typeKey].prompt(w.entry),
      selfContained: true,
      answerFn: (w) => QUESTION_TYPES[w.typeKey].correct(w.entry),
      optionsFn: (w) => lenguaShuffle(QUESTION_TYPES[w.typeKey].options.slice()),
    },
    generonumero: {
      pool: SUSTPRON_FICHA_POOL_GENERONUMERO,
      question: (w) => QUESTION_TYPES[w.typeKey].prompt(w.entry),
      selfContained: true,
      answerFn: (w) => QUESTION_TYPES[w.typeKey].correct(w.entry),
      optionsFn: (w) => lenguaShuffle(QUESTION_TYPES[w.typeKey].options.slice()),
    },
    pronombres: {
      pool: SUSTPRON_FICHA_POOL_PRONOMBRES,
      question: (w) => QUESTION_TYPES[w.typeKey].prompt(w.entry),
      selfContained: true,
      answerFn: (w) => QUESTION_TYPES[w.typeKey].correct(w.entry),
      optionsFn: (w) => lenguaShuffle(QUESTION_TYPES[w.typeKey].options.slice()).slice(0, 4),
    },
  },
});
