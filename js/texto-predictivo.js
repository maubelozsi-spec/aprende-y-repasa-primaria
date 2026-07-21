// ============================================================
// El texto predictivo (SDA "Un futuro... ¿del pasado?", 5º, Bloque 1
// Comunicación): banco de datos + lógica del quiz. Mismo patrón que
// js/comunicacion-textos.js.
// ============================================================

const PREDICCION_ENTRIES = [
  { display: "Dentro de cincuenta años, los coches funcionarán solo con energía solar.", tipo: "Predicción" },
  { display: "Los científicos creen que en 2060 habrá ciudades flotantes en el mar.", tipo: "Predicción" },
  { display: "Se espera que las temperaturas sigan subiendo si no cuidamos el planeta.", tipo: "Predicción" },
  { display: "Es probable que dentro de poco podamos hablar con robots como si fueran personas.", tipo: "Predicción" },
  { display: "En el futuro, probablemente reciclaremos casi toda nuestra basura.", tipo: "Predicción" },
  { display: "Puede que en el año 3030 las ciudades tengan más árboles que edificios.", tipo: "Predicción" },
  { display: "Ayer llovió mucho en toda la región.", tipo: "No es predicción" },
  { display: "El año pasado se plantaron mil árboles en el parque del barrio.", tipo: "No es predicción" },
  { display: "Mi abuela nació en un pueblo pequeño de Andalucía.", tipo: "No es predicción" },
  { display: "Los dinosaurios desaparecieron hace millones de años.", tipo: "No es predicción" },
  { display: "El curso pasado aprendimos a hacer divisiones con dos cifras.", tipo: "No es predicción" },
  { display: "El pronóstico anuncia que mañana bajarán las temperaturas.", tipo: "Predicción" },
];

const PARTES_ENTRIES = [
  { display: "¿Cómo será la vida dentro de cien años?", parte: "Introducción" },
  { display: "Yo creo que en el futuro las personas viviremos de forma más sostenible.", parte: "Introducción" },
  { display: "Imagino que las ciudades del futuro estarán llenas de zonas verdes.", parte: "Introducción" },
  { display: "En este texto voy a explicar cómo creo que será nuestro planeta en el año 3030.", parte: "Introducción" },
  { display: "En primer lugar, la tecnología nos ayudará a cuidar mejor los ecosistemas.", parte: "Desarrollo" },
  { display: "Para empezar, cada vez hay más personas concienciadas con el reciclaje.", parte: "Desarrollo" },
  { display: "En segundo lugar, las energías renovables sustituirán a los combustibles fósiles.", parte: "Desarrollo" },
  { display: "Además, los avances en la agricultura permitirán cultivar alimentos sin dañar la tierra.", parte: "Desarrollo" },
  { display: "Por otro lado, es posible que inventemos nuevas formas de transporte no contaminante.", parte: "Desarrollo" },
  { display: "En definitiva, el futuro dependerá de las decisiones que tomemos hoy.", parte: "Conclusión" },
  { display: "Por todo esto, creo que el planeta puede tener un futuro mejor si lo cuidamos.", parte: "Conclusión" },
  { display: "En conclusión, la tecnología y el cuidado del medioambiente irán de la mano.", parte: "Conclusión" },
  { display: "Por ello, es importante que empecemos a cambiar nuestros hábitos ya.", parte: "Conclusión" },
];

const CONECTORES_ENTRIES = [
  { display: "En primer lugar...", parte: "Desarrollo" },
  { display: "Para empezar...", parte: "Desarrollo" },
  { display: "En segundo lugar...", parte: "Desarrollo" },
  { display: "Para continuar...", parte: "Desarrollo" },
  { display: "En tercer lugar...", parte: "Desarrollo" },
  { display: "Por último...", parte: "Desarrollo" },
  { display: "Además...", parte: "Desarrollo" },
  { display: "Por otro lado...", parte: "Desarrollo" },
  { display: "En definitiva...", parte: "Conclusión" },
  { display: "En conclusión...", parte: "Conclusión" },
  { display: "En consecuencia...", parte: "Conclusión" },
  { display: "Por ello...", parte: "Conclusión" },
  { display: "Por todo esto...", parte: "Conclusión" },
  { display: "En resumen...", parte: "Conclusión" },
];

const MODE_GROUPS = {
  prediccion: {
    pool: PREDICCION_ENTRIES,
    field: "tipo",
    question: () => "¿Es una predicción sobre el futuro o no?",
    options: ["Predicción", "No es predicción"],
  },
  partes: {
    pool: PARTES_ENTRIES,
    field: "parte",
    question: () => "¿A qué parte del texto predictivo pertenece esta frase?",
    options: ["Introducción", "Desarrollo", "Conclusión"],
  },
  conectores: {
    pool: CONECTORES_ENTRIES,
    field: "parte",
    question: () => "¿En qué parte del texto se usa normalmente este conector?",
    options: ["Desarrollo", "Conclusión"],
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

const PREDICTIVO_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo reconocer si es una predicción",
    text: "Para el alumnado con adaptación curricular significativa se trabaja únicamente distinguir si una frase habla del futuro (predicción) o no, sin entrar en la estructura del texto.",
    example: "«El año pasado se plantaron mil árboles» → no es predicción",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido y el mismo nivel de exigencia, pero con una tipografía más legible y más espacio para leer los ejemplos.",
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
    title: "Solo reconocer si es una predicción, con más tiempo",
    text: "Igual que en ACS, se trabaja solo distinguir predicción de no predicción, dando más tiempo para pensar cada respuesta.",
    example: "«Mi abuela nació en un pueblo pequeño» → no es predicción",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Conectores del desarrollo y la conclusión",
    text: "Se practica directamente con el contenido más exigente: identificar a qué parte del texto pertenece cada <strong>conector</strong>.",
    example: "«En consecuencia...» → conclusión",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Qué parte del texto es? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, PREDICTIVO_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), PREDICTIVO_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-predictivo"),
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
  let mode = "partes";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "prediccion";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "prediccion"));
    } else if (diff.is("altas")) {
      mode = "conectores";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "conectores"));
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
    AppProgress.record("texto-predictivo", isCorrect);
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

registerLenguaFicha("texto-predictivo", {
  label: "El texto predictivo",
  resumen: "Un texto predictivo anuncia algo que va a ocurrir en el futuro. Se organiza en introducción (plantea la predicción), desarrollo (da razones, con conectores como «en primer lugar») y conclusión (resume, con conectores como «en definitiva»).",
  easyMode: "prediccion",
  altasMode: "conectores",
  pools: {
    prediccion: { pool: PREDICCION_ENTRIES, field: "tipo", question: () => "¿Es una predicción sobre el futuro o no?", displayField: "display", options: ["Predicción", "No es predicción"] },
    partes: { pool: PARTES_ENTRIES, field: "parte", question: () => "¿A qué parte del texto predictivo pertenece esta frase?", displayField: "display", options: ["Introducción", "Desarrollo", "Conclusión"] },
    conectores: { pool: CONECTORES_ENTRIES, field: "parte", question: () => "¿En qué parte del texto se usa normalmente este conector?", displayField: "display", options: ["Desarrollo", "Conclusión"] },
  },
});
