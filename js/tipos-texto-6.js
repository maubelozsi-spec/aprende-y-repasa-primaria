// ============================================================
// Textos científicos, históricos, descriptivos y discontinuos: banco de datos + quiz
// ============================================================

const IDENTIFICAR_ENTRIES_TIPOS_TEXTO_6 = [
  { display: "Explica cómo se forman los volcanes, con datos y vocabulario técnico.", correct: "Científico", options: ["Científico", "Histórico", "Descriptivo", "Discontinuo"] },
  { display: "Cuenta cómo se descubrió América en 1492 y sus consecuencias.", correct: "Histórico", options: ["Histórico", "Científico", "Descriptivo", "Discontinuo"] },
  { display: "\"La casa era pequeña, blanca, con un jardín lleno de flores.\"", correct: "Descriptivo", options: ["Descriptivo", "Científico", "Histórico", "Discontinuo"] },
  { display: "Un horario de trenes organizado en columnas.", correct: "Discontinuo", options: ["Discontinuo", "Científico", "Histórico", "Descriptivo"] },
  { display: "Explica el ciclo del agua paso a paso con datos comprobables.", correct: "Científico", options: ["Científico", "Histórico", "Descriptivo", "Discontinuo"] },
  { display: "Narra la Revolución Francesa situándola en 1789.", correct: "Histórico", options: ["Histórico", "Científico", "Descriptivo", "Discontinuo"] },
  { display: "\"Era alto, delgado, de ojos verdes y sonrisa amable.\"", correct: "Descriptivo", options: ["Descriptivo", "Histórico", "Científico", "Discontinuo"] },
  { display: "Un gráfico de barras con la población de varias ciudades.", correct: "Discontinuo", options: ["Discontinuo", "Descriptivo", "Científico", "Histórico"] },
];

const DESCRIPCION_ENTRIES = [
  { display: "\"Tenía el pelo rizado, los ojos azules y era muy alto.\"", correct: "Prosopografía", options: ["Prosopografía", "Etopeya", "Retrato", "Topografía"] },
  { display: "\"Era una persona generosa, alegre y muy trabajadora.\"", correct: "Etopeya", options: ["Etopeya", "Prosopografía", "Retrato", "Topografía"] },
  { display: "\"Alto y fuerte, pero también tímido y muy paciente.\"", correct: "Retrato", options: ["Retrato", "Prosopografía", "Etopeya", "Topografía"] },
  { display: "\"El valle estaba rodeado de montañas y cruzado por un río.\"", correct: "Topografía", options: ["Topografía", "Prosopografía", "Etopeya", "Retrato"] },
  { display: "\"Su rostro ovalado tenía la nariz pequeña y labios finos.\"", correct: "Prosopografía", options: ["Prosopografía", "Etopeya", "Retrato", "Topografía"] },
  { display: "\"Era honesto, curioso y siempre dispuesto a ayudar.\"", correct: "Etopeya", options: ["Etopeya", "Prosopografía", "Retrato", "Topografía"] },
];

const CONTINUODISCONTINUO_ENTRIES = [
  { display: "Un cuento narrado en párrafos seguidos.", correct: "Continuo", options: ["Continuo", "Discontinuo"] },
  { display: "Una tabla con los horarios de autobús.", correct: "Discontinuo", options: ["Discontinuo", "Continuo"] },
  { display: "Un mapa con símbolos y leyenda.", correct: "Discontinuo", options: ["Discontinuo", "Continuo"] },
  { display: "Una carta escrita a un amigo.", correct: "Continuo", options: ["Continuo", "Discontinuo"] },
  { display: "Un billete de tren con datos en casillas.", correct: "Discontinuo", options: ["Discontinuo", "Continuo"] },
  { display: "Una noticia de periódico en párrafos.", correct: "Continuo", options: ["Continuo", "Discontinuo"] },
  { display: "Un gráfico circular de resultados de una encuesta.", correct: "Discontinuo", options: ["Discontinuo", "Continuo"] },
  { display: "Un texto científico explicado en varios párrafos.", correct: "Continuo", options: ["Continuo", "Discontinuo"] },
];

const MODE_GROUPS_TIPOS_TEXTO_6 = {
  identificar: {
    pool: IDENTIFICAR_ENTRIES_TIPOS_TEXTO_6,
    field: "correct",
    question: () => "¿Qué tipo de texto es?",
  },
  descripcion: {
    pool: DESCRIPCION_ENTRIES,
    field: "correct",
    question: () => "¿Qué tipo de descripción es?",
  },
  continuodiscontinuo: {
    pool: CONTINUODISCONTINUO_ENTRIES,
    field: "correct",
    question: () => "¿Es un texto continuo o discontinuo?",
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

const TIPOSTEXTO6_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo continuo o discontinuo",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo distinguir texto continuo de discontinuo, sin los tipos de texto ni las descripciones.",
    example: "«Una tabla con los horarios de autobús.» → Discontinuo",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer los textos.",
    example: "«Un mapa con símbolos y leyenda.» → Discontinuo → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo «Mezcla», para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Continuo o discontinuo» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo continuo o discontinuo y ayuda extra",
    text: "Igual que en ACS, se trabaja solo distinguir texto continuo de discontinuo, dando más tiempo para pensar cada respuesta.",
    example: "«Un billete de tren con datos en casillas.» → Discontinuo",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Tipo de descripción",
    text: "Se practica directamente con el vocabulario más abstracto: distinguir prosopografía, etopeya, retrato y topografía.",
    example: "«Era honesto, curioso y siempre dispuesto a ayudar.» → Etopeya",
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
    renderDifficultyBox("difficulty-box", value, TIPOSTEXTO6_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), TIPOSTEXTO6_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-tipostexto6"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  const modeKeys = Object.keys(MODE_GROUPS_TIPOS_TEXTO_6);
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "identificar";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "continuodiscontinuo";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "continuodiscontinuo"));
    } else if (diff.is("altas")) {
      mode = "descripcion";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "descripcion"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "continuodiscontinuo";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "continuodiscontinuo"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS_TIPOS_TEXTO_6[groupKey];
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
    AppProgress.record("tipos-texto-6", isCorrect);
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

registerLenguaFicha("tipos-texto-6", {
  label: "Textos científicos, históricos, descriptivos y discontinuos",
  resumen: "En 6º se estudian nuevos tipos de texto: el científico, el histórico, la descripción y los textos discontinuos.",
  easyMode: "continuodiscontinuo",
  altasMode: "descripcion",
  defaultMode: "identificar",
  pools: {
    identificar: { pool: IDENTIFICAR_ENTRIES_TIPOS_TEXTO_6, field: "correct", question: () => "¿Qué tipo de texto es?", displayField: "display", perEntryOptions: true },
    descripcion: { pool: DESCRIPCION_ENTRIES, field: "correct", question: () => "¿Qué tipo de descripción es?", displayField: "display", perEntryOptions: true },
    continuodiscontinuo: { pool: CONTINUODISCONTINUO_ENTRIES, field: "correct", question: () => "¿Es un texto continuo o discontinuo?", displayField: "display", perEntryOptions: true },
  },
});
