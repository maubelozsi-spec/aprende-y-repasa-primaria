// ============================================================
// La tira cómica (SDA "Reír y pensar", 5º, Bloque de Educación
// literaria): banco de datos + lógica del quiz. Mismo patrón que
// js/comunicacion-textos.js.
// ============================================================

const LITERARIO_ENTRIES = [
  { display: "Un poema sobre el mar.", tipo: "Literario" },
  { display: "Un cuento de aventuras.", tipo: "Literario" },
  { display: "Una tira cómica con personajes inventados.", tipo: "Literario" },
  { display: "Una leyenda sobre un dragón.", tipo: "Literario" },
  { display: "Una obra de teatro con diálogos.", tipo: "Literario" },
  { display: "Las instrucciones de un juego de mesa.", tipo: "No literario" },
  { display: "Una receta de cocina.", tipo: "No literario" },
  { display: "Una lista de la compra.", tipo: "No literario" },
  { display: "El prospecto de una medicina.", tipo: "No literario" },
  { display: "Una noticia del periódico.", tipo: "No literario" },
];

const ELEMENTOSTIRA_ENTRIES = [
  { display: "Se presentan los personajes y el lugar donde ocurre la historia.", tipo: "Presentación" },
  { display: "Se plantea quiénes son los protagonistas de la tira.", tipo: "Presentación" },
  { display: "Aparece la situación conflictiva o el problema.", tipo: "Desarrollo" },
  { display: "Los personajes se enfrentan al problema que ha surgido.", tipo: "Desarrollo" },
  { display: "La tensión de la historia va aumentando viñeta a viñeta.", tipo: "Desarrollo" },
  { display: "Se resuelve el conflicto de una forma que hace reír.", tipo: "Final sorprendente" },
  { display: "La última viñeta da un giro que sorprende al lector.", tipo: "Final sorprendente" },
  { display: "El desenlace hace reflexionar sobre lo ocurrido.", tipo: "Final sorprendente" },
];

const RECURSOSTIRA_ENTRIES = [
  { display: "¡Bang!", tipo: "Onomatopeya" },
  { display: "¡Crash!", tipo: "Onomatopeya" },
  { display: "¡Zzz!", tipo: "Onomatopeya" },
  { display: "Nube de texto que sale de la boca de un personaje.", tipo: "Bocadillo" },
  { display: "Globo con forma de nube que representa lo que piensa un personaje.", tipo: "Bocadillo" },
  { display: "Recuadro con el texto de lo que grita un personaje.", tipo: "Bocadillo" },
  { display: "Rayas detrás de un personaje que corre.", tipo: "Línea de movimiento" },
  { display: "Trazos curvos alrededor de una mano que saluda.", tipo: "Línea de movimiento" },
  { display: "¡Splash!", tipo: "Onomatopeya" },
  { display: "Líneas que muestran que un objeto cae rápido.", tipo: "Línea de movimiento" },
];

const MODE_GROUPS_TIRA = {
  literario: {
    pool: LITERARIO_ENTRIES,
    field: "tipo",
    question: () => "¿Es un texto literario o no literario?",
    options: ["Literario", "No literario"],
  },
  elementos: {
    pool: ELEMENTOSTIRA_ENTRIES,
    field: "tipo",
    question: () => "¿A qué parte de la tira cómica pertenece esto?",
    options: ["Presentación", "Desarrollo", "Final sorprendente"],
  },
  recursos: {
    pool: RECURSOSTIRA_ENTRIES,
    field: "tipo",
    question: () => "¿Qué recurso de la tira cómica es este?",
    options: ["Bocadillo", "Línea de movimiento", "Onomatopeya"],
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

const TIRACOMICA_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo literario o no literario",
    text: "Para el alumnado con adaptación curricular significativa se trabaja únicamente distinguir si un texto es literario o no, sin entrar en las partes ni en los recursos de la tira cómica.",
    example: "«Una receta de cocina» → no literario",
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
    example: "Solo preguntas de «Partes de la tira» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo literario o no literario, con más tiempo",
    text: "Igual que en ACS, se trabaja solo distinguir literario de no literario, dando más tiempo para pensar cada respuesta.",
    example: "«Un cuento de aventuras» → literario",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Los recursos de la tira cómica",
    text: "Se practica directamente con el contenido más exigente: reconocer si algo es un <strong>bocadillo</strong>, una <strong>línea de movimiento</strong> o una <strong>onomatopeya</strong>.",
    example: "«¡Crash!» → onomatopeya",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Qué parte de la tira es? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, TIRACOMICA_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), TIRACOMICA_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-tira"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  const modeKeys = Object.keys(MODE_GROUPS_TIRA);
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
      mode = "literario";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "literario"));
    } else if (diff.is("altas")) {
      mode = "recursos";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "recursos"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "elementos";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "elementos"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS_TIRA[groupKey];
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
    AppProgress.record("tira-comica", isCorrect);
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

registerLenguaFicha("tira-comica", {
  label: "La tira cómica",
  resumen: "La tira cómica es un texto literario en viñetas con presentación, desarrollo y un final sorprendente. Usa bocadillos, líneas de movimiento y onomatopeyas para contar la historia.",
  easyMode: "literario",
  altasMode: "recursos",
  defaultMode: "elementos",
  pools: {
    literario: { pool: LITERARIO_ENTRIES, field: "tipo", question: () => "¿Es un texto literario o no literario?", displayField: "display", options: ["Literario", "No literario"] },
    elementos: { pool: ELEMENTOSTIRA_ENTRIES, field: "tipo", question: () => "¿A qué parte de la tira cómica pertenece esto?", displayField: "display", options: ["Presentación", "Desarrollo", "Final sorprendente"] },
    recursos: { pool: RECURSOSTIRA_ENTRIES, field: "tipo", question: () => "¿Qué recurso de la tira cómica es este?", displayField: "display", options: ["Bocadillo", "Línea de movimiento", "Onomatopeya"] },
  },
});
