// ============================================================
// Siglas y abreviaturas: banco de datos + lógica del quiz
// ============================================================

const SIGLAOABREV_ENTRIES = [
  { display: "ONU", correct: "Sigla", options: ["Sigla", "Abreviatura"] },
  { display: "Sr.", correct: "Abreviatura", options: ["Abreviatura", "Sigla"] },
  { display: "ADN", correct: "Sigla", options: ["Sigla", "Abreviatura"] },
  { display: "pág.", correct: "Abreviatura", options: ["Abreviatura", "Sigla"] },
  { display: "OVNI", correct: "Sigla", options: ["Sigla", "Abreviatura"] },
  { display: "etc.", correct: "Abreviatura", options: ["Abreviatura", "Sigla"] },
  { display: "UE", correct: "Sigla", options: ["Sigla", "Abreviatura"] },
  { display: "Dr.", correct: "Abreviatura", options: ["Abreviatura", "Sigla"] },
  { display: "ONG", correct: "Sigla", options: ["Sigla", "Abreviatura"] },
  { display: "Ud.", correct: "Abreviatura", options: ["Abreviatura", "Sigla"] },
];

const SIGNIFICADO_ENTRIES = [
  { display: "ONU", correct: "Organización de las Naciones Unidas", options: ["Organización de las Naciones Unidas", "Organización Nacional Unida", "Oficina Nacional Unificada", "Organismo de Nutrición Universal"] },
  { display: "ADN", correct: "Ácido desoxirribonucleico", options: ["Ácido desoxirribonucleico", "Análisis de Nutrientes", "Agencia de Noticias", "Asociación de Naturaleza"] },
  { display: "OVNI", correct: "Objeto volador no identificado", options: ["Objeto volador no identificado", "Órgano vital no invasivo", "Objeto vertical no inflable", "Organización de vuelos nacionales"] },
  { display: "Sr.", correct: "Señor", options: ["Señor", "Sur", "Servicio", "Sierra"] },
  { display: "pág.", correct: "Página", options: ["Página", "Paga", "Pagaré", "Pasaje"] },
  { display: "etc.", correct: "Etcétera", options: ["Etcétera", "Etiqueta", "Estructura", "Extracto"] },
  { display: "UE", correct: "Unión Europea", options: ["Unión Europea", "Unidad Educativa", "Universidad Estatal", "Unión Estudiantil"] },
];

const MODE_GROUPS = {
  siglaoabrev: {
    pool: SIGLAOABREV_ENTRIES,
    field: "correct",
    question: () => "¿Es una sigla o una abreviatura?",
  },
  significado: {
    pool: SIGNIFICADO_ENTRIES,
    field: "correct",
    question: () => "¿Qué significa?",
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

const SIGLAS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo sigla o abreviatura (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo distinguir si es una sigla o una abreviatura, sin conocer su significado exacto.",
    example: "«Sr.» → abreviatura",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las siglas y abreviaturas.",
    example: "«ONU» → sigla → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «¿Sigla o abreviatura?» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo sigla o abreviatura y ayuda extra",
    text: "Igual que en ACS, se trabaja solo distinguir sigla de abreviatura, dando más tiempo para pensar cada respuesta.",
    example: "«ADN» → sigla",
  },
  altas: {
    badge: "Altas capacidades",
    title: "¿Qué significa?",
    text: "Se practica directamente con el contenido más exigente: recordar el <strong>significado completo</strong> de cada sigla o abreviatura.",
    example: "«OVNI» → objeto volador no identificado",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Es sigla o abreviatura? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, SIGLAS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), SIGLAS_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-siglas"),
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
  let mode = "siglaoabrev";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "siglaoabrev";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "siglaoabrev"));
    } else if (diff.is("altas")) {
      mode = "significado";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "significado"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "siglaoabrev";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "siglaoabrev"));
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
    AppProgress.record("siglas-abreviaturas", isCorrect);
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
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>Respuesta correcta: <strong>${correct}</strong>.</p>`;

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

registerLenguaFicha("siglas-abreviaturas", {
  label: "Siglas y abreviaturas",
  resumen: "Las siglas se forman con las iniciales de varias palabras; las abreviaturas acortan una palabra manteniendo alguna letra clave.",
  easyMode: "siglaoabrev",
  altasMode: "significado",
  pools: {
    siglaoabrev: { pool: SIGLAOABREV_ENTRIES, field: "correct", question: () => "¿Es una sigla o una abreviatura?", displayField: "display", perEntryOptions: true },
    significado: { pool: SIGNIFICADO_ENTRIES, field: "correct", question: () => "¿Qué significa?", displayField: "display", perEntryOptions: true },
  },
});
