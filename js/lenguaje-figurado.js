// ============================================================
// Lenguaje literal y figurado: banco de datos + lógica del quiz
// ============================================================

const LITERALFIGURADO_ENTRIES = [
  { display: "Llueve mucho hoy.", correct: "Literal", options: ["Literal", "Figurado"] },
  { display: "Está lloviendo a cántaros.", correct: "Figurado", options: ["Figurado", "Literal"] },
  { display: "Tiene la cabeza en las nubes.", correct: "Figurado", options: ["Figurado", "Literal"] },
  { display: "El avión vuela sobre las nubes.", correct: "Literal", options: ["Literal", "Figurado"] },
  { display: "Me costó un ojo de la cara.", correct: "Figurado", options: ["Figurado", "Literal"] },
  { display: "Se golpeó el ojo con la puerta.", correct: "Literal", options: ["Literal", "Figurado"] },
  { display: "Está que echa chispas.", correct: "Figurado", options: ["Figurado", "Literal"] },
  { display: "El cable eléctrico echa chispas.", correct: "Literal", options: ["Literal", "Figurado"] },
];

const FRASEHECHA_ENTRIES = [
  { display: "Costar un ojo de la cara", correct: "Ser muy caro", options: ["Ser muy caro", "Ser barato", "Doler mucho", "Estar cansado"] },
  { display: "Tomar el pelo", correct: "Burlarse o bromear", options: ["Burlarse o bromear", "Peinarse", "Enfadarse", "Despedirse"] },
  { display: "Estar en las nubes", correct: "Estar distraído", options: ["Estar distraído", "Estar feliz", "Estar volando", "Estar cansado"] },
  { display: "Ponerse las pilas", correct: "Esforzarse, ponerse a trabajar", options: ["Esforzarse, ponerse a trabajar", "Descansar", "Enfadarse", "Cargar el móvil"] },
  { display: "No dar pie con bola", correct: "Equivocarse mucho", options: ["Equivocarse mucho", "Jugar al fútbol", "Acertar siempre", "Caminar rápido"] },
  { display: "Estar como una cabra", correct: "Estar un poco loco", options: ["Estar un poco loco", "Estar tranquilo", "Ser fuerte", "Ser inteligente"] },
];

const HOMONIMIA_ENTRIES = [
  { display: "vaca / baca", correct: "Homófonas", options: ["Homófonas", "Homógrafas"] },
  { display: "banco (asiento) / banco (entidad financiera)", correct: "Homógrafas", options: ["Homógrafas", "Homófonas"] },
  { display: "hola / ola", correct: "Homófonas", options: ["Homófonas", "Homógrafas"] },
  { display: "vino (bebida) / vino (del verbo venir)", correct: "Homógrafas", options: ["Homógrafas", "Homófonas"] },
  { display: "tubo / tuvo", correct: "Homófonas", options: ["Homófonas", "Homógrafas"] },
  { display: "gato (animal) / gato (herramienta del coche)", correct: "Homógrafas", options: ["Homógrafas", "Homófonas"] },
  { display: "botar / votar", correct: "Homófonas", options: ["Homófonas", "Homógrafas"] },
];

const MODE_GROUPS = {
  literalfigurado: {
    pool: LITERALFIGURADO_ENTRIES,
    field: "correct",
    question: () => "¿Es lenguaje literal o figurado?",
  },
  frasehecha: {
    pool: FRASEHECHA_ENTRIES,
    field: "correct",
    question: () => "¿Qué significa esta frase hecha?",
  },
  homonimia: {
    pool: HOMONIMIA_ENTRIES,
    field: "correct",
    question: () => "¿Son homófonas u homógrafas?",
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

const LENGFIGURADO_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo literal o figurado (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo distinguir el lenguaje literal del figurado, sin frases hechas ni homonimia.",
    example: "«Está lloviendo a cántaros» → figurado",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las frases.",
    example: "«Llueve mucho hoy» → literal → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Literal o figurado» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo literal o figurado y ayuda extra",
    text: "Igual que en ACS, se trabaja solo distinguir literal de figurado, dando más tiempo para pensar cada respuesta.",
    example: "«El avión vuela sobre las nubes» → literal",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Homófonas u homógrafas",
    text: "Se practica directamente con el contenido más exigente: distinguir palabras <strong>homófonas</strong> de <strong>homógrafas</strong>.",
    example: "«vino (bebida) / vino (del verbo venir)» → homógrafas",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Es literal o figurado? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, LENGFIGURADO_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), LENGFIGURADO_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-lengfigurado"),
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
  let mode = "literalfigurado";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "literalfigurado";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "literalfigurado"));
    } else if (diff.is("altas")) {
      mode = "homonimia";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "homonimia"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "literalfigurado";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "literalfigurado"));
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
    AppProgress.record("lenguaje-figurado", isCorrect);
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
