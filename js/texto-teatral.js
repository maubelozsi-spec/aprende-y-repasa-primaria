// ============================================================
// El texto teatral: banco de datos + lógica del quiz
// ============================================================

const DIALOGO_ACOTACION_ENTRIES = [
  { display: "(Entra corriendo y mira hacia la puerta.)", tipo: "Acotación" },
  { display: "¡No puedo creer que hayas venido!", tipo: "Diálogo" },
  { display: "(Se oye un trueno a lo lejos.)", tipo: "Acotación" },
  { display: "¿Dónde has estado todo este tiempo?", tipo: "Diálogo" },
  { display: "(Silencio. Todos se miran sorprendidos.)", tipo: "Acotación" },
  { display: "Yo no fui quien rompió el jarrón.", tipo: "Diálogo" },
  { display: "(Sale por la puerta de la izquierda.)", tipo: "Acotación" },
  { display: "Esto no puede estar pasando de verdad.", tipo: "Diálogo" },
];

const ACTO_ESCENA_ENTRIES = [
  { display: "Cada una de las grandes partes de una obra, marcada por un cambio de decorado", tipo: "Acto" },
  { display: "Cambia cuando entra o sale un personaje del escenario", tipo: "Escena" },
  { display: "Puede contener varias divisiones más pequeñas dentro", tipo: "Acto" },
  { display: "Es una subdivisión dentro de una parte más grande de la obra", tipo: "Escena" },
];

const ESTRUCTURA_ENTRIES = [
  { display: "Se presentan los personajes y el lugar donde ocurre la historia.", tipo: "Planteamiento" },
  { display: "Conocemos quién es el protagonista y dónde vive.", tipo: "Planteamiento" },
  { display: "Surge el problema o conflicto principal de la historia.", tipo: "Nudo" },
  { display: "Los personajes se enfrentan a las consecuencias del conflicto.", tipo: "Nudo" },
  { display: "Se resuelve el conflicto y termina la historia.", tipo: "Desenlace" },
  { display: "El problema encuentra su solución final.", tipo: "Desenlace" },
];

const MODE_GROUPS = {
  dialogoacotacion: {
    pool: DIALOGO_ACOTACION_ENTRIES,
    field: "tipo",
    question: () => "¿Es un diálogo o una acotación?",
    options: ["Diálogo", "Acotación"],
  },
  actoescena: {
    pool: ACTO_ESCENA_ENTRIES,
    field: "tipo",
    question: () => "¿Esto describe un acto o una escena?",
    options: ["Acto", "Escena"],
  },
  estructura: {
    pool: ESTRUCTURA_ENTRIES,
    field: "tipo",
    question: () => "¿A qué parte de la estructura corresponde esto?",
    options: ["Planteamiento", "Nudo", "Desenlace"],
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

const TEATRAL_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo diálogo o acotación (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo distinguir diálogo de acotación, sin actos, escenas ni estructura.",
    example: "«(Entra corriendo y mira hacia la puerta.)» → acotación",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer los fragmentos.",
    example: "«¡No puedo creer que hayas venido!» → diálogo → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Diálogo o acotación» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo diálogo o acotación y ayuda extra",
    text: "Igual que en ACS, se trabaja solo distinguir diálogo de acotación, dando más tiempo para pensar cada respuesta.",
    example: "«(Se oye un trueno a lo lejos.)» → acotación",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Acto o escena",
    text: "Se practica directamente con el contenido más abstracto: distinguir <strong>acto</strong> de <strong>escena</strong> a partir de definiciones, sin ejemplos directos.",
    example: "«Cambia cuando entra o sale un personaje del escenario» → escena",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Es diálogo o acotación? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, TEATRAL_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), TEATRAL_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-teatral"),
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
  let mode = "dialogoacotacion";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "dialogoacotacion";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "dialogoacotacion"));
    } else if (diff.is("altas")) {
      mode = "actoescena";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "actoescena"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "dialogoacotacion";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "dialogoacotacion"));
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
    AppProgress.record("texto-teatral", isCorrect);
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
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>${current.entry.display} → <strong>${correct}</strong>.</p>`;

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

registerLenguaFicha("texto-teatral", {
  label: "El texto teatral",
  resumen: "El texto teatral combina el diálogo de los personajes con las acotaciones del autor, y se organiza en actos y escenas.",
  easyMode: "dialogoacotacion",
  altasMode: "actoescena",
  pools: {
    dialogoacotacion: { pool: DIALOGO_ACOTACION_ENTRIES, field: "tipo", question: () => "¿Es un diálogo o una acotación?", displayField: "display", options: ["Diálogo", "Acotación"] },
    actoescena: { pool: ACTO_ESCENA_ENTRIES, field: "tipo", question: () => "¿Esto describe un acto o una escena?", displayField: "display", options: ["Acto", "Escena"] },
    estructura: { pool: ESTRUCTURA_ENTRIES, field: "tipo", question: () => "¿A qué parte de la estructura corresponde esto?", displayField: "display", options: ["Planteamiento", "Nudo", "Desenlace"] },
  },
});
