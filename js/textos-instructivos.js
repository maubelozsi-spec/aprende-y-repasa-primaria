// ============================================================
// Los textos instructivos (SDA de 5º, Bloque de Comunicación): banco
// de datos + lógica del quiz. Mismo patrón que js/comunicacion-textos.js.
// ============================================================

const INST_ESINSTRUCTIVO_ENTRIES = [
  { display: "Una receta para preparar un bizcocho.", tipo: "Instructivo" },
  { display: "Las normas de un juego de mesa.", tipo: "Instructivo" },
  { display: "El manual para montar una estantería.", tipo: "Instructivo" },
  { display: "Las instrucciones para usar una tablet.", tipo: "Instructivo" },
  { display: "Los pasos para plantar una semilla.", tipo: "Instructivo" },
  { display: "Una noticia sobre un partido de fútbol.", tipo: "No instructivo" },
  { display: "Un poema sobre el otoño.", tipo: "No instructivo" },
  { display: "Un cuento de piratas.", tipo: "No instructivo" },
  { display: "La descripción de un paisaje.", tipo: "No instructivo" },
  { display: "Una carta a un amigo contándole tus vacaciones.", tipo: "No instructivo" },
];

const INST_PARTES_ENTRIES = [
  { display: "Bizcocho de yogur", parte: "Título" },
  { display: "Cómo plantar un girasol", parte: "Título" },
  { display: "Normas del juego de la oca", parte: "Título" },
  { display: "Necesitas: 3 huevos, 1 vaso de azúcar y harina.", parte: "Materiales" },
  { display: "Materiales: una maceta, tierra y una semilla.", parte: "Materiales" },
  { display: "Necesitarás: un dado, cuatro fichas y el tablero.", parte: "Materiales" },
  { display: "1. Bate los huevos con el azúcar.", parte: "Pasos" },
  { display: "2. Añade la harina poco a poco.", parte: "Pasos" },
  { display: "3. Hornea durante 30 minutos.", parte: "Pasos" },
  { display: "Primero, haz un agujero en la tierra.", parte: "Pasos" },
];

const INST_ORDEN_ENTRIES = [
  { display: "En primer lugar,", tipo: "Conector de orden" },
  { display: "A continuación,", tipo: "Conector de orden" },
  { display: "Después,", tipo: "Conector de orden" },
  { display: "Por último,", tipo: "Conector de orden" },
  { display: "Finalmente,", tipo: "Conector de orden" },
  { display: "Bate los huevos.", tipo: "Verbo de instrucción" },
  { display: "Añade la harina.", tipo: "Verbo de instrucción" },
  { display: "Corta el papel.", tipo: "Verbo de instrucción" },
  { display: "Riega la planta.", tipo: "Verbo de instrucción" },
  { display: "Mezcla los ingredientes.", tipo: "Verbo de instrucción" },
];

const MODE_GROUPS_INSTRUCTIVOS = {
  esinstructivo: {
    pool: INST_ESINSTRUCTIVO_ENTRIES,
    field: "tipo",
    question: () => "¿Es un texto instructivo o no?",
    options: ["Instructivo", "No instructivo"],
  },
  partes: {
    pool: INST_PARTES_ENTRIES,
    field: "parte",
    question: () => "¿A qué parte de un texto instructivo pertenece esto?",
    options: ["Título", "Materiales", "Pasos"],
  },
  orden: {
    pool: INST_ORDEN_ENTRIES,
    field: "tipo",
    question: () => "¿Es un conector de orden o un verbo de instrucción?",
    options: ["Conector de orden", "Verbo de instrucción"],
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

const INSTRUCTIVOS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo reconocer si es un texto instructivo",
    text: "Para el alumnado con adaptación curricular significativa se trabaja únicamente distinguir si un texto sirve para explicar cómo hacer algo (instructivo) o no.",
    example: "«Una receta de cocina» → instructivo",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido y el mismo nivel de exigencia, pero con una tipografía más legible para leer los ejemplos.",
    example: "Misma actividad de siempre, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Partes del texto» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo reconocer si es instructivo, con más tiempo",
    text: "Igual que en ACS, se trabaja solo distinguir instructivo de no instructivo, dando más tiempo para pensar cada respuesta.",
    example: "«Un poema sobre el otoño» → no instructivo",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Conectores de orden y verbos de instrucción",
    text: "Se practica directamente con el contenido más exigente: distinguir los <strong>conectores de orden</strong> de los <strong>verbos de instrucción</strong>.",
    example: "«A continuación,» → conector de orden",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿A qué parte pertenece? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, INSTRUCTIVOS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), INSTRUCTIVOS_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-instructivos"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  const modeKeys = Object.keys(MODE_GROUPS_INSTRUCTIVOS);
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "partes";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "esinstructivo";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "esinstructivo"));
    } else if (diff.is("altas")) {
      mode = "orden";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "orden"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "partes";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "partes"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS_INSTRUCTIVOS[groupKey];
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
    AppProgress.record("textos-instructivos", isCorrect);
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

registerLenguaFicha("textos-instructivos", {
  label: "Los textos instructivos",
  resumen: "Un texto instructivo explica cómo hacer algo paso a paso. Suele tener un título, una lista de materiales y los pasos ordenados, con verbos de instrucción (bate, añade...) y conectores de orden (en primer lugar, a continuación, por último).",
  easyMode: "esinstructivo",
  altasMode: "orden",
  defaultMode: "partes",
  pools: {
    esinstructivo: { pool: INST_ESINSTRUCTIVO_ENTRIES, field: "tipo", question: () => "¿Es un texto instructivo o no?", displayField: "display", options: ["Instructivo", "No instructivo"] },
    partes: { pool: INST_PARTES_ENTRIES, field: "parte", question: () => "¿A qué parte de un texto instructivo pertenece esto?", displayField: "display", options: ["Título", "Materiales", "Pasos"] },
    orden: { pool: INST_ORDEN_ENTRIES, field: "tipo", question: () => "¿Es un conector de orden o un verbo de instrucción?", displayField: "display", options: ["Conector de orden", "Verbo de instrucción"] },
  },
});
