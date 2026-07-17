// ============================================================
// Formación de palabras: banco de datos + lógica del quiz
// ============================================================

const PREFIJO_SUFIJO_ENTRIES = [
  { display: "deshacer", tipo: "Prefijo" },
  { display: "infeliz", tipo: "Prefijo" },
  { display: "rehacer", tipo: "Prefijo" },
  { display: "prever", tipo: "Prefijo" },
  { display: "submarino", tipo: "Prefijo" },
  { display: "antihéroe", tipo: "Prefijo" },
  { display: "imposible", tipo: "Prefijo" },
  { display: "descontento", tipo: "Prefijo" },
  { display: "panadero", tipo: "Sufijo" },
  { display: "florista", tipo: "Sufijo" },
  { display: "niñez", tipo: "Sufijo" },
  { display: "felizmente", tipo: "Sufijo" },
  { display: "cantante", tipo: "Sufijo" },
  { display: "lentamente", tipo: "Sufijo" },
  { display: "jardinero", tipo: "Sufijo" },
  { display: "amistad", tipo: "Sufijo" },
];

const FAMILIA_CAMPO_ENTRIES = [
  { display: "pan — panadero", tipo: "Familia de palabras" },
  { display: "flor — florero", tipo: "Familia de palabras" },
  { display: "tierra — terrestre", tipo: "Familia de palabras" },
  { display: "diente — dentista", tipo: "Familia de palabras" },
  { display: "profesor — pizarra", tipo: "Campo semántico" },
  { display: "médico — hospital", tipo: "Campo semántico" },
  { display: "futbolista — balón", tipo: "Campo semántico" },
  { display: "cocinero — sartén", tipo: "Campo semántico" },
  { display: "perro — mesa", tipo: "Ninguna de las dos" },
  { display: "libro — luna", tipo: "Ninguna de las dos" },
];

const POLISEMIA_HOMOFONIA_ENTRIES = [
  { display: "banco (asiento) / banco (entidad financiera)", tipo: "Polisemia" },
  { display: "hoja (de papel) / hoja (de una planta)", tipo: "Polisemia" },
  { display: "gato (animal) / gato (herramienta)", tipo: "Polisemia" },
  { display: "planta (del pie) / planta (vegetal)", tipo: "Polisemia" },
  { display: "capital (ciudad) / capital (dinero)", tipo: "Polisemia" },
  { display: "vaca / baca", tipo: "Homofonía" },
  { display: "hola / ola", tipo: "Homofonía" },
  { display: "tuvo / tubo", tipo: "Homofonía" },
  { display: "hecho / echo", tipo: "Homofonía" },
  { display: "botar / votar", tipo: "Homofonía" },
];

const MORFEMAS_ENTRIES = [
  { display: "En \"niños\", el morfema -s indica número.", tipo: "Flexivo" },
  { display: "En \"niña\", el morfema -a indica género.", tipo: "Flexivo" },
  { display: "En \"cantas\", el morfema -as indica persona verbal.", tipo: "Flexivo" },
  { display: "En \"floristas\", el morfema -s indica número.", tipo: "Flexivo" },
  { display: "En \"deshacer\", el morfema des- crea una palabra nueva.", tipo: "Derivativo" },
  { display: "En \"panadero\", el morfema -ero crea una palabra nueva.", tipo: "Derivativo" },
  { display: "En \"florista\", el morfema -ista crea una palabra nueva.", tipo: "Derivativo" },
  { display: "En \"infeliz\", el morfema in- crea una palabra nueva.", tipo: "Derivativo" },
  { display: "En \"cantábamos\", el morfema -ábamos indica tiempo y persona.", tipo: "Flexivo" },
  { display: "En \"reponer\", el morfema re- crea una palabra nueva.", tipo: "Derivativo" },
];

const MODE_GROUPS = {
  prefijosufijo: {
    pool: PREFIJO_SUFIJO_ENTRIES,
    field: "tipo",
    question: () => "¿Esta palabra está formada con un prefijo o un sufijo?",
    options: ["Prefijo", "Sufijo"],
  },
  familiacampo: {
    pool: FAMILIA_CAMPO_ENTRIES,
    field: "tipo",
    question: () => "¿Estas dos palabras son de la misma familia de palabras o del mismo campo semántico?",
    options: ["Familia de palabras", "Campo semántico", "Ninguna de las dos"],
  },
  polisemiahomofonia: {
    pool: POLISEMIA_HOMOFONIA_ENTRIES,
    field: "tipo",
    question: () => "¿Es un caso de polisemia o de homofonía?",
    options: ["Polisemia", "Homofonía"],
  },
  morfemas: {
    pool: MORFEMAS_ENTRIES,
    field: "tipo",
    question: () => "¿Es un morfema flexivo o derivativo?",
    options: ["Flexivo", "Derivativo"],
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

const FORMACION_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo prefijo o sufijo (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo distinguir si una palabra tiene un prefijo o un sufijo, sin los demás conceptos.",
    example: "«deshacer» → prefijo",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las palabras.",
    example: "«panadero» → sufijo → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Prefijo o sufijo» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo prefijo o sufijo y ayuda extra",
    text: "Igual que en ACS, se trabaja solo distinguir prefijo de sufijo, dando más tiempo para pensar cada respuesta.",
    example: "«infeliz» → prefijo",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Tipo de morfema",
    text: "Se practica directamente con el contenido más avanzado: distinguir morfemas <strong>flexivos</strong> de <strong>derivativos</strong>.",
    example: "«En \"deshacer\", el morfema des- crea una palabra nueva.» → derivativo",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Prefijo o sufijo? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, FORMACION_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), FORMACION_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-formacion"),
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
  let mode = "prefijosufijo";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "prefijosufijo";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "prefijosufijo"));
    } else if (diff.is("altas")) {
      mode = "morfemas";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "morfemas"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "prefijosufijo";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "prefijosufijo"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

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

    els.instructions.textContent =
      current.group.question() + (diff.is("discalculia") ? " Tómate tu tiempo." : "");
    els.wordDisplay.textContent = current.entry.display;

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    const correct = current.entry[current.group.field];
    let options = current.group.options.slice();
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
    const correct = current.entry[current.group.field];
    const isCorrect = chosen === correct;

    if (isCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("formacion-palabras", isCorrect);
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
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>"${current.entry.display}" → <strong>${correct}</strong>.</p>`;

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

registerLenguaFicha("formacion-palabras", {
  label: "Formación de palabras",
  resumen: "Las palabras se pueden formar añadiendo prefijos o sufijos, y se relacionan por familia de palabras o campo semántico.",
  easyMode: "prefijosufijo",
  altasMode: "morfemas",
  pools: {
    prefijosufijo: { pool: PREFIJO_SUFIJO_ENTRIES, field: "tipo", question: () => "¿Esta palabra está formada con un prefijo o un sufijo?", displayField: "display", options: ["Prefijo", "Sufijo"] },
    familiacampo: { pool: FAMILIA_CAMPO_ENTRIES, field: "tipo", question: () => "¿Estas dos palabras son de la misma familia de palabras o del mismo campo semántico?", displayField: "display", options: ["Familia de palabras", "Campo semántico", "Ninguna de las dos"] },
    polisemiahomofonia: { pool: POLISEMIA_HOMOFONIA_ENTRIES, field: "tipo", question: () => "¿Es un caso de polisemia o de homofonía?", displayField: "display", options: ["Polisemia", "Homofonía"] },
    morfemas: { pool: MORFEMAS_ENTRIES, field: "tipo", question: () => "¿Es un morfema flexivo o derivativo?", displayField: "display", options: ["Flexivo", "Derivativo"] },
  },
});
