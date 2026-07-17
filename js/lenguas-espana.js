// ============================================================
// Las lenguas de España: banco de datos + lógica del quiz
// ============================================================

const LENGUAS_ENTRIES = [
  { display: "¿Dónde es cooficial el catalán?", correct: "Cataluña e Islas Baleares", options: ["Cataluña e Islas Baleares", "Galicia", "País Vasco", "Andalucía"] },
  { display: "¿Dónde es cooficial el gallego?", correct: "Galicia", options: ["Galicia", "Cataluña", "País Vasco", "Canarias"] },
  { display: "¿Dónde es cooficial el euskera?", correct: "País Vasco y parte de Navarra", options: ["País Vasco y parte de Navarra", "Galicia", "Cataluña", "Andalucía"] },
  { display: "¿Cuál es la lengua oficial de todo el Estado español?", correct: "El castellano", options: ["El castellano", "El catalán", "El gallego", "El euskera"] },
  { display: "¿Qué significa que una lengua sea \"cooficial\"?", correct: "Que tiene reconocimiento oficial junto al castellano en esa comunidad", options: ["Que tiene reconocimiento oficial junto al castellano en esa comunidad", "Que es la única lengua permitida", "Que ya no se habla castellano allí", "Que es un dialecto del castellano"] },
];

const VARIEDADES_ENTRIES = [
  { display: "Aspira o pierde la \"s\" final de las palabras.", correct: "Andaluz", options: ["Andaluz", "Canario", "Castellano del norte", "Español de América"] },
  { display: "Usa \"ustedes\" en vez de \"vosotros\".", correct: "Canario", options: ["Canario", "Andaluz", "Castellano del norte", "Español de América"] },
  { display: "Distingue la pronunciación de \"c/z\" y \"s\".", correct: "Castellano del norte", options: ["Castellano del norte", "Andaluz", "Canario", "Español de América"] },
  { display: "Usa \"vos\" en vez de \"tú\" (voseo) en varios países.", correct: "Español de América", options: ["Español de América", "Andaluz", "Canario", "Castellano del norte"] },
  { display: "Las variedades del español son...", correct: "Formas igual de válidas de hablar el mismo idioma", options: ["Formas igual de válidas de hablar el mismo idioma", "Errores que hay que corregir", "Idiomas completamente distintos", "Solo se usan en la escritura"] },
];

const MODE_GROUPS = {
  lenguas: {
    pool: LENGUAS_ENTRIES,
    field: "correct",
    question: () => "Responde:",
  },
  variedades: {
    pool: VARIEDADES_ENTRIES,
    field: "correct",
    question: () => "¿Qué variedad del español es?",
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

const LENGUASESPANA_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo lenguas cooficiales (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo dónde son cooficiales el catalán, el gallego y el euskera, sin las variedades del español.",
    example: "¿Dónde es cooficial el gallego? → Galicia",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las preguntas.",
    example: "¿Cuál es la lengua oficial de todo el Estado? → el castellano → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Lenguas cooficiales» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo lenguas cooficiales y ayuda extra",
    text: "Igual que en ACS, se trabaja solo dónde son cooficiales las lenguas de España, dando más tiempo para pensar cada respuesta.",
    example: "¿Dónde es cooficial el euskera? → País Vasco y parte de Navarra",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Variedades del español",
    text: "Se practica directamente con el contenido más exigente: reconocer las <strong>variedades del español</strong> por sus rasgos característicos.",
    example: "Usa «vos» en vez de «tú» en varios países → español de América",
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
    renderDifficultyBox("difficulty-box", value, LENGUASESPANA_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), LENGUASESPANA_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-lenguasespana"),
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
  let mode = "lenguas";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "lenguas";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "lenguas"));
    } else if (diff.is("altas")) {
      mode = "variedades";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "variedades"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "lenguas";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "lenguas"));
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
    AppProgress.record("lenguas-espana", isCorrect);
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
