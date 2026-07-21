// ============================================================
// Comunicación y tipos de texto: banco de datos + lógica del quiz
// ============================================================

const ELEMENTOS_ENTRIES_COMUNICACION_TEXTOS = [
  { display: "La persona que escribe la carta", tipo: "Emisor" },
  { display: "El profesor que explica la lección", tipo: "Emisor" },
  { display: "La persona que lee la carta", tipo: "Receptor" },
  { display: "Los alumnos que escuchan la explicación", tipo: "Receptor" },
  { display: "Lo que dice la carta", tipo: "Mensaje" },
  { display: "El papel por el que viaja la carta escrita", tipo: "Canal" },
  { display: "El aire por el que viaja la voz al hablar", tipo: "Canal" },
  { display: "El idioma español en el que está escrita la carta", tipo: "Código" },
  { display: "El momento y el lugar en que se lee la carta", tipo: "Contexto" },
];

const VERBAL_NOVERBAL_ENTRIES = [
  { display: "Una señal de stop", tipo: "No verbal" },
  { display: "Una carta escrita", tipo: "Verbal" },
  { display: "Un gesto de saludo con la mano", tipo: "No verbal" },
  { display: "Una conversación por teléfono", tipo: "Verbal" },
  { display: "Un semáforo en rojo", tipo: "No verbal" },
  { display: "Un mensaje de texto", tipo: "Verbal" },
  { display: "Una sonrisa", tipo: "No verbal" },
  { display: "Un cartel con una flecha", tipo: "No verbal" },
  { display: "Un cuento leído en voz alta", tipo: "Verbal" },
];

const TIPO_TEXTO_ENTRIES = [
  { display: "«El pronóstico dice que mañana lloverá en el norte.»", tipo: "Predictivo" },
  { display: "«Se prevé un aumento de las temperaturas la próxima semana.»", tipo: "Predictivo" },
  { display: "«Creo que deberíamos reciclar más porque ayuda al planeta.»", tipo: "Argumentativo" },
  { display: "«Pienso que el uniforme escolar es buena idea porque evita desigualdades.»", tipo: "Argumentativo" },
  { display: "«El agua es un recurso natural formado por hidrógeno y oxígeno.»", tipo: "Expositivo" },
  { display: "«Los volcanes son aberturas en la corteza terrestre por donde sale magma.»", tipo: "Expositivo" },
  { display: "«Bate los huevos, añade la harina y hornea 20 minutos.»", tipo: "Instructivo" },
  { display: "«Corta las verduras, ponlas en la sartén y cocina 10 minutos.»", tipo: "Instructivo" },
  { display: "«Ayer se celebró un partido de fútbol en el estadio municipal.»", tipo: "Noticia" },
  { display: "«Un reportaje sobre la vida de los pingüinos, con entrevistas a científicos.»", tipo: "Reportaje" },
];

const MODE_GROUPS_COMUNICACION_TEXTOS = {
  elementos: {
    pool: ELEMENTOS_ENTRIES_COMUNICACION_TEXTOS,
    field: "tipo",
    question: () => "¿A qué elemento de la comunicación corresponde esto?",
    options: ["Emisor", "Receptor", "Mensaje", "Canal", "Código", "Contexto"],
  },
  verbalnoverbal: {
    pool: VERBAL_NOVERBAL_ENTRIES,
    field: "tipo",
    question: () => "¿Es lenguaje verbal o no verbal?",
    options: ["Verbal", "No verbal"],
  },
  tipotexto: {
    pool: TIPO_TEXTO_ENTRIES,
    field: "tipo",
    question: () => "¿Qué tipo de texto es este?",
    options: ["Predictivo", "Argumentativo", "Expositivo", "Instructivo", "Noticia", "Reportaje"],
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

const COMUNICACION_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo verbal o no verbal (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo distinguir si un ejemplo es lenguaje verbal o no verbal, sin elementos de la comunicación ni tipos de texto.",
    example: "Una señal de stop → no verbal",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer los ejemplos.",
    example: "Un semáforo en rojo → no verbal → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Verbal o no verbal» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo verbal o no verbal y ayuda extra",
    text: "Igual que en ACS, se trabaja solo distinguir verbal de no verbal, dando más tiempo para pensar cada respuesta.",
    example: "Una carta escrita → verbal",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Tipo de texto",
    text: "Se practica directamente con el contenido más exigente: identificar el <strong>tipo de texto</strong> entre seis categorías posibles.",
    example: "«Un reportaje sobre la vida de los pingüinos, con entrevistas a científicos.» → reportaje",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Qué tipo de texto es? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, COMUNICACION_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), COMUNICACION_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-comunicacion"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  const modeKeys = Object.keys(MODE_GROUPS_COMUNICACION_TEXTOS);
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "elementos";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "verbalnoverbal";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "verbalnoverbal"));
    } else if (diff.is("altas")) {
      mode = "tipotexto";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "tipotexto"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "verbalnoverbal";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "verbalnoverbal"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS_COMUNICACION_TEXTOS[groupKey];
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
    AppProgress.record("comunicacion-textos", isCorrect);
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

registerLenguaFicha("comunicacion-textos", {
  label: "La comunicación y los textos",
  resumen: "En todo acto de comunicación intervienen un emisor, un receptor, un mensaje, un canal, un código y un contexto.",
  easyMode: "verbalnoverbal",
  altasMode: "tipotexto",
  pools: {
    elementos: { pool: ELEMENTOS_ENTRIES_COMUNICACION_TEXTOS, field: "tipo", question: () => "¿A qué elemento de la comunicación corresponde esto?", displayField: "display", options: ["Emisor", "Receptor", "Mensaje", "Canal", "Código", "Contexto"] },
    verbalnoverbal: { pool: VERBAL_NOVERBAL_ENTRIES, field: "tipo", question: () => "¿Es lenguaje verbal o no verbal?", displayField: "display", options: ["Verbal", "No verbal"] },
    tipotexto: { pool: TIPO_TEXTO_ENTRIES, field: "tipo", question: () => "¿Qué tipo de texto es este?", displayField: "display", options: ["Predictivo", "Argumentativo", "Expositivo", "Instructivo", "Noticia", "Reportaje"] },
  },
});
