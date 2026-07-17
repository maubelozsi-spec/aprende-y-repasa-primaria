// ============================================================
// Los signos de puntuación: banco de datos + lógica del quiz
// ============================================================

const IDENTIFICAR_ENTRIES = [
  { display: "Quería ir al cine; sin embargo, se quedó estudiando.", correct: "Punto y coma", options: ["Punto y coma", "Puntos suspensivos", "Paréntesis", "Comillas", "Raya"] },
  { display: "No sé si ir o quedarme...", correct: "Puntos suspensivos", options: ["Puntos suspensivos", "Punto y coma", "Paréntesis", "Comillas", "Raya"] },
  { display: "Cristóbal Colón (1451-1506) llegó a América.", correct: "Paréntesis", options: ["Paréntesis", "Punto y coma", "Puntos suspensivos", "Comillas", "Raya"] },
  { display: "Mi madre dijo: \"Vuelve pronto a casa.\"", correct: "Comillas", options: ["Comillas", "Punto y coma", "Puntos suspensivos", "Paréntesis", "Raya"] },
  { display: "—¿Vienes al parque? —preguntó Ana.", correct: "Raya", options: ["Raya", "Punto y coma", "Puntos suspensivos", "Paréntesis", "Comillas"] },
  { display: "El pastel tenía chocolate, nata y fresas; también tenía canela.", correct: "Punto y coma", options: ["Punto y coma", "Puntos suspensivos", "Paréntesis", "Comillas", "Raya"] },
  { display: "Y de repente...", correct: "Puntos suspensivos", options: ["Puntos suspensivos", "Punto y coma", "Paréntesis", "Comillas", "Raya"] },
  { display: "Leímos el poema \"Verde que te quiero verde\".", correct: "Comillas", options: ["Comillas", "Punto y coma", "Puntos suspensivos", "Paréntesis", "Raya"] },
];

const COMPLETAR_ENTRIES = [
  { display: "Quería ir ___ sin embargo, se quedó. (unir dos ideas relacionadas)", correct: ";", options: [";", "...", "()", "\" \""] },
  { display: "No sabía qué decir ___ (frase incompleta con suspense)", correct: "...", options: ["...", ";", "()", "\" \""] },
  { display: "Cristóbal Colón ___1451-1506___ descubrió América. (aclaración que se puede quitar)", correct: "()", options: ["()", ";", "...", "\" \""] },
  { display: "Ana dijo: ___Ya voy___ (cita textual)", correct: "\" \"", options: ["\" \"", ";", "...", "()"] },
  { display: "___¿Vienes? ___preguntó Juan. (marcar diálogo)", correct: "—", options: ["—", ";", "...", "()"] },
];

const MODE_GROUPS = {
  identificar: {
    pool: IDENTIFICAR_ENTRIES,
    field: "correct",
    question: () => "¿Qué signo de puntuación destaca en esta frase?",
  },
  completar: {
    pool: COMPLETAR_ENTRIES,
    field: "correct",
    question: () => "¿Qué signo hay que usar aquí?",
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

const SIGNOSPUNTUACION_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo identificar el signo (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo reconocer qué signo aparece en la frase, sin tener que elegir cuál usar.",
    example: "«No sé si ir o quedarme...» → puntos suspensivos",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para distinguir bien los signos.",
    example: "«Mi madre dijo: \"Vuelve pronto.\"» → comillas → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Identificar el signo» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo identificar el signo y ayuda extra",
    text: "Igual que en ACS, se trabaja solo reconocer el signo que aparece en la frase, dando más tiempo para pensar cada respuesta.",
    example: "«—¿Vienes al parque? —preguntó Ana.» → raya",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Elegir el signo correcto",
    text: "Se practica directamente con el contenido más exigente: decidir qué signo hay que <strong>usar</strong> en un hueco, según la regla.",
    example: "Cristóbal Colón ___1451-1506___ descubrió América. → ()",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Qué signo destaca? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, SIGNOSPUNTUACION_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), SIGNOSPUNTUACION_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-signospuntuacion"),
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
  let mode = "identificar";
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
      mode = "completar";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "completar"));
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
    AppProgress.record("signos-puntuacion", isCorrect);
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

registerLenguaFicha("signos-puntuacion", {
  label: "Los signos de puntuación",
  resumen: "Los signos de puntuación organizan el texto y ayudan a entenderlo mejor: coma, punto, punto y coma, dos puntos y muchos más.",
  easyMode: "identificar",
  altasMode: "completar",
  pools: {
    identificar: { pool: IDENTIFICAR_ENTRIES, field: "correct", question: () => "¿Qué signo de puntuación destaca en esta frase?", displayField: "display", perEntryOptions: true },
    completar: { pool: COMPLETAR_ENTRIES, field: "correct", question: () => "¿Qué signo hay que usar aquí?", displayField: "display", perEntryOptions: true },
  },
});
