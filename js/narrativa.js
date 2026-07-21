// ============================================================
// Narrativa: banco de datos + lógica del quiz
// ============================================================

const GENERO_ENTRIES = [
  { display: "Narración breve, con pocos personajes y una trama sencilla que ocurre en poco tiempo.", tipo: "Cuento" },
  { display: "Historia corta que se puede leer de una sola vez, con pocos personajes.", tipo: "Cuento" },
  { display: "Narración extensa, con muchos personajes y varias historias que se entrelazan.", tipo: "Novela" },
  { display: "Obra larga dividida en capítulos, con tramas complejas.", tipo: "Novela" },
  { display: "Mezcla hechos reales con elementos mágicos o fantásticos, y explica el origen de algo.", tipo: "Leyenda" },
  { display: "Historia transmitida de generación en generación sobre el origen de un lugar.", tipo: "Leyenda" },
];

const NARRADOR_ENTRIES = [
  { display: "Yo caminaba solo por el bosque cuando escuché un ruido.", tipo: "1ª persona" },
  { display: "Ella caminaba sola por el bosque cuando escuchó un ruido.", tipo: "3ª persona" },
  { display: "Recuerdo aquel verano como si fuera ayer.", tipo: "1ª persona" },
  { display: "Él recordaba aquel verano como si fuera ayer.", tipo: "3ª persona" },
  { display: "Nunca olvidaré el día en que gané la carrera.", tipo: "1ª persona" },
  { display: "Ana nunca olvidaría el día en que ganó la carrera.", tipo: "3ª persona" },
];

const ELEMENTOS_ENTRIES_NARRATIVA = [
  { display: "Quien cuenta la historia.", tipo: "Narrador" },
  { display: "El bosque oscuro donde transcurre toda la historia.", tipo: "Espacio" },
  { display: "El castillo donde vive la princesa.", tipo: "Espacio" },
  { display: "Hace mucho tiempo, en una época muy lejana.", tipo: "Tiempo" },
  { display: "Hace 100 años, en un pueblo pequeño.", tipo: "Tiempo" },
  { display: "El protagonista de la historia.", tipo: "Personaje principal" },
  { display: "El malvado que se enfrenta al héroe.", tipo: "Personaje principal" },
  { display: "El amigo que ayuda al protagonista de vez en cuando.", tipo: "Personaje secundario" },
];

const SUBGENERO_ENTRIES = [
  { display: "El protagonista viaja por selvas peligrosas buscando un tesoro escondido.", tipo: "Aventuras" },
  { display: "Un detective investiga quién cometió el robo en la mansión.", tipo: "Misterio o policíaca" },
  { display: "En el año 3000, los humanos viajan entre planetas en naves espaciales.", tipo: "Ciencia ficción" },
  { display: "Un joven mago descubre un reino habitado por dragones y hechiceros.", tipo: "Fantástica" },
  { display: "La historia ocurre durante la Segunda Guerra Mundial.", tipo: "Histórica" },
  { display: "Los exploradores cruzan una jungla llena de peligros para llegar a las ruinas.", tipo: "Aventuras" },
  { display: "Un inspector busca pistas para resolver un misterioso asesinato.", tipo: "Misterio o policíaca" },
  { display: "Robots inteligentes conviven con humanos en una ciudad futurista.", tipo: "Ciencia ficción" },
];

const MODE_GROUPS_NARRATIVA = {
  genero: {
    pool: GENERO_ENTRIES,
    field: "tipo",
    question: () => "¿Es un cuento, una novela o una leyenda?",
    options: ["Cuento", "Novela", "Leyenda"],
  },
  narrador: {
    pool: NARRADOR_ENTRIES,
    field: "tipo",
    question: () => "¿Está contado en 1ª o en 3ª persona?",
    options: ["1ª persona", "3ª persona"],
  },
  elementos: {
    pool: ELEMENTOS_ENTRIES_NARRATIVA,
    field: "tipo",
    question: () => "¿A qué parte de la narración corresponde esto?",
    options: ["Narrador", "Personaje principal", "Personaje secundario", "Espacio", "Tiempo"],
  },
  subgenero: {
    pool: SUBGENERO_ENTRIES,
    field: "tipo",
    question: () => "¿A qué subgénero de novela pertenece?",
    options: ["Aventuras", "Misterio o policíaca", "Ciencia ficción", "Fantástica", "Histórica"],
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

const NARRATIVA_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo el narrador (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo distinguir si un texto está narrado en 1ª o en 3ª persona, sin los demás conceptos.",
    example: "«Yo caminaba solo por el bosque...» → 1ª persona",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer los fragmentos.",
    example: "«Ella caminaba sola por el bosque...» → 3ª persona → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Cuento, novela o leyenda» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo el narrador y ayuda extra",
    text: "Igual que en ACS, se trabaja solo distinguir 1ª de 3ª persona, dando más tiempo para pensar cada respuesta.",
    example: "«Recuerdo aquel verano...» → 1ª persona",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Subgénero de novela",
    text: "Se practica directamente con el contenido más avanzado: identificar el <strong>subgénero de novela</strong> entre cinco categorías posibles.",
    example: "«Un joven mago descubre un reino con dragones» → fantástica",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Es cuento, novela o leyenda? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, NARRATIVA_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), NARRATIVA_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-narrativa"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  const modeKeys = Object.keys(MODE_GROUPS_NARRATIVA);
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "genero";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "narrador";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "narrador"));
    } else if (diff.is("altas")) {
      mode = "subgenero";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "subgenero"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "genero";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "genero"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS_NARRATIVA[groupKey];
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
    AppProgress.record("narrativa", isCorrect);
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

registerLenguaFicha("narrativa", {
  label: "La narrativa",
  resumen: "Los textos narrativos (cuentos, novelas, leyendas) cuentan hechos protagonizados por unos personajes en un espacio y un tiempo.",
  easyMode: "narrador",
  altasMode: "subgenero",
  defaultMode: "genero",
  pools: {
    genero: { pool: GENERO_ENTRIES, field: "tipo", question: () => "¿Es un cuento, una novela o una leyenda?", displayField: "display", options: ["Cuento", "Novela", "Leyenda"] },
    narrador: { pool: NARRADOR_ENTRIES, field: "tipo", question: () => "¿Está contado en 1ª o en 3ª persona?", displayField: "display", options: ["1ª persona", "3ª persona"] },
    elementos: { pool: ELEMENTOS_ENTRIES_NARRATIVA, field: "tipo", question: () => "¿A qué parte de la narración corresponde esto?", displayField: "display", options: ["Narrador", "Personaje principal", "Personaje secundario", "Espacio", "Tiempo"] },
    subgenero: { pool: SUBGENERO_ENTRIES, field: "tipo", question: () => "¿A qué subgénero de novela pertenece?", displayField: "display", options: ["Aventuras", "Misterio o policíaca", "Ciencia ficción", "Fantástica", "Histórica"] },
  },
});
