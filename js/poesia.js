// ============================================================
// Poesía y recursos literarios: banco de datos + lógica del quiz
// ============================================================

const VERSO_ESTROFA_ENTRIES = [
  { display: "Cada línea de un poema.", tipo: "Verso" },
  { display: "Un conjunto de versos agrupados.", tipo: "Estrofa" },
  { display: "cielo / suelo", tipo: "Rima consonante" },
  { display: "cantar / lugar", tipo: "Rima consonante" },
  { display: "luna / cuna", tipo: "Rima consonante" },
  { display: "cielo / beso", tipo: "Rima asonante" },
  { display: "casa / cara", tipo: "Rima asonante" },
  { display: "monte / noche", tipo: "Rima asonante" },
];

const RECURSOS_ENTRIES = [
  { display: "Sus ojos son dos luceros.", tipo: "Metáfora" },
  { display: "Su pelo es de oro.", tipo: "Metáfora" },
  { display: "Sus dientes son perlas blancas.", tipo: "Metáfora" },
  { display: "El viento silbaba una canción triste.", tipo: "Personificación" },
  { display: "Las estrellas guiñaban un ojo en el cielo.", tipo: "Personificación" },
  { display: "El sol se despertó perezoso esta mañana.", tipo: "Personificación" },
  { display: "Te lo he dicho un millón de veces.", tipo: "Hipérbole" },
  { display: "Me morí de vergüenza.", tipo: "Hipérbole" },
  { display: "Lloré un río de lágrimas.", tipo: "Hipérbole" },
];

const HAIKU_REFRAN_ENTRIES = [
  { display: "Hoja que cae / el viento la levanta / y sigue el vuelo.", tipo: "Haiku" },
  { display: "Luna de invierno / brilla sobre la nieve / silencio blanco.", tipo: "Haiku" },
  { display: "Gato negro duerme / bajo el sol de la tarde / sueños de pez.", tipo: "Haiku" },
  { display: "A quien madruga, Dios le ayuda.", tipo: "Refrán" },
  { display: "En boca cerrada no entran moscas.", tipo: "Refrán" },
  { display: "Más vale tarde que nunca.", tipo: "Refrán" },
];

const MODE_GROUPS_POESIA = {
  versoestrofa: {
    pool: VERSO_ESTROFA_ENTRIES,
    field: "tipo",
    question: () => "¿Verso, estrofa, rima consonante o rima asonante?",
    options: ["Verso", "Estrofa", "Rima consonante", "Rima asonante"],
  },
  recursos: {
    pool: RECURSOS_ENTRIES,
    field: "tipo",
    question: () => "¿Qué recurso literario se usa en esta frase?",
    options: ["Metáfora", "Personificación", "Hipérbole"],
  },
  haikurefran: {
    pool: HAIKU_REFRAN_ENTRIES,
    field: "tipo",
    question: () => "¿Es un haiku o un refrán?",
    options: ["Haiku", "Refrán"],
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

const POESIA_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo haiku o refrán (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo distinguir un haiku de un refrán, sin recursos literarios ni tipos de rima.",
    example: "«A quien madruga, Dios le ayuda.» → refrán",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer los versos y frases.",
    example: "«Hoja que cae...» → haiku → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Haiku o refrán» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo haiku o refrán y ayuda extra",
    text: "Igual que en ACS, se trabaja solo distinguir un haiku de un refrán, dando más tiempo para pensar cada respuesta.",
    example: "«Más vale tarde que nunca.» → refrán",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Verso, estrofa o tipo de rima",
    text: "Se practica directamente con el contenido más exigente: distinguir verso, estrofa, <strong>rima consonante</strong> y <strong>rima asonante</strong>.",
    example: "«cielo / beso» → rima asonante",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Es un haiku o un refrán? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, POESIA_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), POESIA_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-poesia"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  const modeKeys = Object.keys(MODE_GROUPS_POESIA);
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "versoestrofa";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "haikurefran";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "haikurefran"));
    } else if (diff.is("altas")) {
      mode = "versoestrofa";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "versoestrofa"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "haikurefran";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "haikurefran"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS_POESIA[groupKey];
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
    AppProgress.record("poesia", isCorrect);
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

registerLenguaFicha("poesia", {
  label: "La poesía",
  resumen: "Los poemas se organizan en versos y estrofas, riman de forma consonante o asonante, y usan recursos literarios y formas como el haiku o el refrán.",
  easyMode: "haikurefran",
  altasMode: "versoestrofa",
  pools: {
    versoestrofa: { pool: VERSO_ESTROFA_ENTRIES, field: "tipo", question: () => "¿Verso, estrofa, rima consonante o rima asonante?", displayField: "display", options: ["Verso", "Estrofa", "Rima consonante", "Rima asonante"] },
    recursos: { pool: RECURSOS_ENTRIES, field: "tipo", question: () => "¿Qué recurso literario se usa en esta frase?", displayField: "display", options: ["Metáfora", "Personificación", "Hipérbole"] },
    haikurefran: { pool: HAIKU_REFRAN_ENTRIES, field: "tipo", question: () => "¿Es un haiku o un refrán?", displayField: "display", options: ["Haiku", "Refrán"] },
  },
});
