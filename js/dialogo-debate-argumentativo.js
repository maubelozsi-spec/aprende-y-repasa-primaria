// ============================================================
// El diálogo, el debate y el texto argumentativo: banco de datos + quiz
// ============================================================

const ELEMENTOS_ENTRIES = [
  { display: "Organiza los turnos de palabra y controla el tiempo.", correct: "Moderador", options: ["Moderador", "Participante", "Tema", "Conclusión"] },
  { display: "Defiende su postura con argumentos.", correct: "Participante", options: ["Participante", "Moderador", "Tema", "Conclusión"] },
  { display: "La cuestión sobre la que se discute.", correct: "Tema", options: ["Tema", "Moderador", "Participante", "Conclusión"] },
  { display: "Resumen final de las posturas expuestas.", correct: "Conclusión", options: ["Conclusión", "Moderador", "Participante", "Tema"] },
];

const PARTESARGUMENTATIVO_ENTRIES = [
  { display: "\"Deberíamos reciclar más.\"", correct: "Tesis", options: ["Tesis", "Argumento", "Conclusión"] },
  { display: "\"Porque reduce la contaminación y ahorra recursos.\"", correct: "Argumento", options: ["Argumento", "Tesis", "Conclusión"] },
  { display: "\"Por eso, reciclar es fundamental para el planeta.\"", correct: "Conclusión", options: ["Conclusión", "Tesis", "Argumento"] },
  { display: "\"El deporte debería ser obligatorio en el colegio.\"", correct: "Tesis", options: ["Tesis", "Argumento", "Conclusión"] },
  { display: "\"Porque mejora la salud y la concentración.\"", correct: "Argumento", options: ["Argumento", "Tesis", "Conclusión"] },
  { display: "\"Así pues, el deporte debe formar parte del horario escolar.\"", correct: "Conclusión", options: ["Conclusión", "Tesis", "Argumento"] },
];

const IDENTIFICAR_ENTRIES = [
  { display: "—¿Vienes al parque? —Sí, ahora mismo salgo.", correct: "Diálogo", options: ["Diálogo", "Debate", "Texto argumentativo"] },
  { display: "Varias personas discuten ordenadamente si los móviles deben estar en el colegio, con un moderador.", correct: "Debate", options: ["Debate", "Diálogo", "Texto argumentativo"] },
  { display: "\"Creo que deberíamos reciclar más porque ayuda al planeta.\"", correct: "Texto argumentativo", options: ["Texto argumentativo", "Diálogo", "Debate"] },
  { display: "—Hola, ¿qué tal? —Bien, ¿y tú?", correct: "Diálogo", options: ["Diálogo", "Debate", "Texto argumentativo"] },
  { display: "El profesor modera una discusión en clase sobre el uso de uniformes escolares.", correct: "Debate", options: ["Debate", "Diálogo", "Texto argumentativo"] },
  { display: "\"El deporte es esencial porque mejora la salud; por eso debería ser obligatorio.\"", correct: "Texto argumentativo", options: ["Texto argumentativo", "Diálogo", "Debate"] },
];

const MODE_GROUPS = {
  elementos: {
    pool: ELEMENTOS_ENTRIES,
    field: "correct",
    question: () => "¿A qué elemento del debate corresponde?",
  },
  partesargumentativo: {
    pool: PARTESARGUMENTATIVO_ENTRIES,
    field: "correct",
    question: () => "¿Es la tesis, un argumento o la conclusión?",
  },
  identificar: {
    pool: IDENTIFICAR_ENTRIES,
    field: "correct",
    question: () => "¿Es un diálogo, un debate o un texto argumentativo?",
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

const DIALOGO_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo diálogo, debate o argumentativo (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo distinguir entre las tres formas de texto, sin entrar en sus partes internas.",
    example: "—¿Vienes al parque? —Sí, ahora mismo salgo. → diálogo",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer los ejemplos.",
    example: "—Hola, ¿qué tal? —Bien, ¿y tú? → diálogo → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «¿Diálogo, debate o argumentativo?» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo diálogo, debate o argumentativo y ayuda extra",
    text: "Igual que en ACS, se trabaja solo distinguir entre las tres formas de texto, dando más tiempo para pensar cada respuesta.",
    example: "El profesor modera una discusión en clase → debate",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Partes del texto argumentativo",
    text: "Se practica directamente con el contenido más exigente: identificar si una frase es la <strong>tesis</strong>, un <strong>argumento</strong> o la <strong>conclusión</strong>.",
    example: "«Porque mejora la salud y la concentración.» → argumento",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Es tesis, argumento o conclusión? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, DIALOGO_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), DIALOGO_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-dialogo"),
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
  let mode = "elementos";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "identificar";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "identificar"));
    } else if (diff.is("altas")) {
      mode = "partesargumentativo";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "partesargumentativo"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "identificar";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "identificar"));
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
    AppProgress.record("dialogo-debate-argumentativo", isCorrect);
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
