// ============================================================
// Tipos de enunciado e interjecciones (SDA "Interpretando la
// realidad", 5º, Bloque de Reflexión sobre la lengua): banco de
// datos + lógica del quiz. Mismo patrón que js/comunicacion-textos.js.
// ============================================================

const ENUNCIADO_BASICO_ENTRIES = [
  { display: "El perro corre por el parque.", tipo: "Enunciativo" },
  { display: "Hoy no hace frío.", tipo: "Enunciativo" },
  { display: "Mi hermana estudia quinto de primaria.", tipo: "Enunciativo" },
  { display: "El autobús llega a las nueve.", tipo: "Enunciativo" },
  { display: "¿Vienes a la fiesta esta tarde?", tipo: "Interrogativo" },
  { display: "¿Dónde has dejado las llaves?", tipo: "Interrogativo" },
  { display: "¿Te gusta el chocolate?", tipo: "Interrogativo" },
  { display: "¡Qué susto me has dado!", tipo: "Exclamativo" },
  { display: "¡Qué bonito atardecer!", tipo: "Exclamativo" },
  { display: "¡Cuidado con el escalón!", tipo: "Exclamativo" },
];

const ENUNCIADO_COMPLETO_ENTRIES = [
  { display: "El perro corre por el parque.", tipo: "Enunciativo" },
  { display: "El museo abre a las diez.", tipo: "Enunciativo" },
  { display: "¿Vienes a la fiesta esta tarde?", tipo: "Interrogativo" },
  { display: "¿Has hecho ya los deberes?", tipo: "Interrogativo" },
  { display: "¡Qué susto me has dado!", tipo: "Exclamativo" },
  { display: "¡No me lo puedo creer!", tipo: "Exclamativo" },
  { display: "Cierra la puerta, por favor.", tipo: "Imperativo" },
  { display: "Recoge tu habitación antes de cenar.", tipo: "Imperativo" },
  { display: "Ojalá llueva mañana.", tipo: "Desiderativo" },
  { display: "Ojalá apruebe el examen.", tipo: "Desiderativo" },
  { display: "Quizás vengan mis primos este fin de semana.", tipo: "Dubitativo" },
  { display: "A lo mejor mañana hace sol.", tipo: "Dubitativo" },
];

const ORACIONAL_ENTRIES = [
  { display: "El tren llega tarde.", tipo: "Oracional" },
  { display: "¡Fuego!", tipo: "No oracional" },
  { display: "Buenos días.", tipo: "No oracional" },
  { display: "Mis padres trabajan en el hospital.", tipo: "Oracional" },
  { display: "¡Socorro!", tipo: "No oracional" },
  { display: "Gracias por tu ayuda.", tipo: "No oracional" },
  { display: "El profesor explica la lección.", tipo: "Oracional" },
  { display: "¡Adiós!", tipo: "No oracional" },
  { display: "Los niños juegan en el patio.", tipo: "Oracional" },
  { display: "¡Enhorabuena!", tipo: "No oracional" },
];

const INTERJECCION_ENTRIES = [
  { display: "¡Ay!", tipo: "Dolor" },
  { display: "¡Oh!", tipo: "Sorpresa" },
  { display: "¡Eh!", tipo: "Llamar la atención" },
  { display: "¡Uf!", tipo: "Cansancio o alivio" },
  { display: "¡Hola!", tipo: "Saludo" },
  { display: "¡Chss!", tipo: "Pedir silencio" },
  { display: "¡Bravo!", tipo: "Aprobación o alegría" },
  { display: "¡Cuidado!", tipo: "Advertencia" },
  { display: "¡Vaya!", tipo: "Sorpresa o disgusto" },
  { display: "¡Ojalá!", tipo: "Deseo" },
];

const MODE_GROUPS_ENUNCIADO = {
  basico: {
    pool: ENUNCIADO_BASICO_ENTRIES,
    field: "tipo",
    question: () => "¿Qué tipo de enunciado es este?",
    options: ["Enunciativo", "Interrogativo", "Exclamativo"],
  },
  completo: {
    pool: ENUNCIADO_COMPLETO_ENTRIES,
    field: "tipo",
    question: () => "¿Qué tipo de enunciado es este?",
    options: ["Enunciativo", "Interrogativo", "Exclamativo", "Imperativo", "Desiderativo", "Dubitativo"],
  },
  oracional: {
    pool: ORACIONAL_ENTRIES,
    field: "tipo",
    question: () => "¿Es un enunciado oracional (tiene verbo) o no oracional?",
    options: ["Oracional", "No oracional"],
  },
  interjeccion: {
    pool: INTERJECCION_ENTRIES,
    field: "tipo",
    question: () => "¿Qué expresa esta interjección?",
    options: ["Dolor", "Sorpresa", "Llamar la atención", "Cansancio o alivio", "Saludo", "Pedir silencio", "Aprobación o alegría", "Advertencia", "Sorpresa o disgusto", "Deseo"],
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

const ENUNCIADO_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo los 3 tipos más fáciles de reconocer",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo distinguir entre enunciativo, interrogativo y exclamativo (los que tienen una marca clara: ¿? o ¡!), sin imperativo, desiderativo ni dubitativo.",
    example: "«¿Vienes a la fiesta?» → interrogativo",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo contenido, lectura más cómoda",
    text: "Se mantiene el mismo nivel de exigencia (los 6 tipos de enunciado), pero con una tipografía más legible para leer los ejemplos.",
    example: "Misma actividad de siempre, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Tipos de enunciado» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo los 3 tipos más fáciles, con más tiempo",
    text: "Igual que en ACS, se trabaja solo enunciativo, interrogativo y exclamativo, dando más tiempo para pensar cada respuesta.",
    example: "«¡Qué bonito atardecer!» → exclamativo",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Oracional o no oracional",
    text: "Se practica directamente con el contenido más abstracto: distinguir si un enunciado es <strong>oracional</strong> (tiene un verbo conjugado) o <strong>no oracional</strong>.",
    example: "«¡Socorro!» → no oracional (no tiene verbo)",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Qué tipo de enunciado es? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, ENUNCIADO_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), ENUNCIADO_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-enunciado"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  const modeKeys = Object.keys(MODE_GROUPS_ENUNCIADO);
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "completo";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "basico";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "basico"));
    } else if (diff.is("altas")) {
      mode = "oracional";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "oracional"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "completo";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "completo"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS_ENUNCIADO[groupKey];
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
    AppProgress.record("tipos-enunciado", isCorrect);
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

registerLenguaFicha("tipos-enunciado", {
  label: "Tipos de enunciado e interjecciones",
  resumen: "Según la intención del hablante, un enunciado puede ser enunciativo, interrogativo, exclamativo, imperativo, desiderativo o dubitativo. Las interjecciones son palabras cortas que expresan una emoción (¡ay!, ¡oh!, ¡uf!...).",
  easyMode: "basico",
  altasMode: "oracional",
  defaultMode: "completo",
  pools: {
    basico: { pool: ENUNCIADO_BASICO_ENTRIES, field: "tipo", question: () => "¿Qué tipo de enunciado es este?", displayField: "display", options: ["Enunciativo", "Interrogativo", "Exclamativo"] },
    completo: { pool: ENUNCIADO_COMPLETO_ENTRIES, field: "tipo", question: () => "¿Qué tipo de enunciado es este?", displayField: "display", options: ["Enunciativo", "Interrogativo", "Exclamativo", "Imperativo", "Desiderativo", "Dubitativo"] },
    oracional: { pool: ORACIONAL_ENTRIES, field: "tipo", question: () => "¿Es un enunciado oracional (tiene verbo) o no oracional?", displayField: "display", options: ["Oracional", "No oracional"] },
    interjeccion: { pool: INTERJECCION_ENTRIES, field: "tipo", question: () => "¿Qué expresa esta interjección?", displayField: "display", options: ["Dolor", "Sorpresa", "Llamar la atención", "Cansancio o alivio", "Saludo", "Pedir silencio", "Aprobación o alegría", "Advertencia", "Sorpresa o disgusto", "Deseo"] },
  },
});
