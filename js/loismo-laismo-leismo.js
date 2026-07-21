// ============================================================
// Loísmo, laísmo y leísmo: banco de datos + lógica del quiz
// ============================================================

const COMPLETAR_ENTRIES_LOISMO_LAISMO_LEISMO = [
  { display: "Compré el pan. ___ compré esta mañana. (CD masculino)", correct: "Lo", options: ["Lo", "La", "Le"] },
  { display: "Vi a María. ___ vi en el parque. (CD femenino)", correct: "La", options: ["La", "Lo", "Le"] },
  { display: "Regalé flores a mi madre. ___ regalé flores. (CI)", correct: "Le", options: ["Le", "Lo", "La"] },
  { display: "Escribí una carta a mi amigo. ___ escribí una carta. (CI)", correct: "Le", options: ["Le", "Lo", "La"] },
  { display: "Compré los libros. ___ compré ayer. (CD masculino plural)", correct: "Los", options: ["Los", "Las", "Les"] },
  { display: "Vi a mis primas. ___ vi el sábado. (CD femenino plural)", correct: "Las", options: ["Las", "Los", "Les"] },
  { display: "Conté un secreto a mis amigos. ___ conté un secreto. (CI plural)", correct: "Les", options: ["Les", "Los", "Las"] },
  { display: "Compré la mesa. ___ compré nueva. (CD femenino)", correct: "La", options: ["La", "Lo", "Le"] },
];

const IDENTIFICARERROR_ENTRIES = [
  { display: "Lo dije la verdad a mi padre.", correct: "Loísmo", options: ["Loísmo", "Laísmo", "Leísmo", "Correcta"] },
  { display: "La dije que viniera a la fiesta.", correct: "Laísmo", options: ["Laísmo", "Loísmo", "Leísmo", "Correcta"] },
  { display: "Le vi ayer en el parque (a él, como CD).", correct: "Leísmo", options: ["Leísmo", "Loísmo", "Laísmo", "Correcta"] },
  { display: "Le regalé un libro a mi hermano.", correct: "Correcta", options: ["Correcta", "Loísmo", "Laísmo", "Leísmo"] },
  { display: "Lo vi ayer en el parque.", correct: "Correcta", options: ["Correcta", "Loísmo", "Laísmo", "Leísmo"] },
  { display: "La compré un regalo a mi amiga.", correct: "Laísmo", options: ["Laísmo", "Loísmo", "Leísmo", "Correcta"] },
  { display: "Lo compré flores a mi madre.", correct: "Loísmo", options: ["Loísmo", "Laísmo", "Leísmo", "Correcta"] },
  { display: "La vi en la tienda ayer.", correct: "Correcta", options: ["Correcta", "Loísmo", "Laísmo", "Leísmo"] },
];

const MODE_GROUPS_LOISMO_LAISMO_LEISMO = {
  completar: {
    pool: COMPLETAR_ENTRIES_LOISMO_LAISMO_LEISMO,
    field: "correct",
    question: () => "Completa correctamente el hueco:",
  },
  identificarerror: {
    pool: IDENTIFICARERROR_ENTRIES,
    field: "correct",
    question: () => "¿Qué tipo de error tiene esta oración (o está correcta)?",
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

const LOISMO_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo completar con lo/la/le (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo completar el hueco correcto, con la pista de qué complemento sustituye, sin identificar el nombre del error.",
    example: "Compré el pan. ___ compré esta mañana. (CD masculino) → Lo",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las frases.",
    example: "Vi a María. ___ vi en el parque. → La → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Completar con lo/la/le» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo completar con lo/la/le y ayuda extra",
    text: "Igual que en ACS, se trabaja solo completar el hueco con la pista dada, dando más tiempo para pensar cada respuesta.",
    example: "Regalé flores a mi madre. ___ regalé flores. (CI) → Le",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Identificar el error",
    text: "Se practica directamente con el contenido más exigente: identificar si una frase tiene <strong>loísmo</strong>, <strong>laísmo</strong>, <strong>leísmo</strong> o está correcta.",
    example: "«La dije que viniera a la fiesta.» → laísmo",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "Completa el hueco → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, LOISMO_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), LOISMO_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-loismo"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  const modeKeys = Object.keys(MODE_GROUPS_LOISMO_LAISMO_LEISMO);
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "completar";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "completar";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "completar"));
    } else if (diff.is("altas")) {
      mode = "identificarerror";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "identificarerror"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "completar";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "completar"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS_LOISMO_LAISMO_LEISMO[groupKey];
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
    AppProgress.record("loismo-laismo-leismo", isCorrect);
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

registerLenguaFicha("loismo-laismo-leismo", {
  label: "Loísmo, laísmo y leísmo",
  resumen: "El loísmo, el laísmo y el leísmo son usos incorrectos de los pronombres lo, la y le en lugar del que corresponde.",
  easyMode: "completar",
  altasMode: "identificarerror",
  pools: {
    completar: { pool: COMPLETAR_ENTRIES_LOISMO_LAISMO_LEISMO, field: "correct", question: () => "Completa correctamente el hueco:", displayField: "display", perEntryOptions: true },
    identificarerror: { pool: IDENTIFICARERROR_ENTRIES, field: "correct", question: () => "¿Qué tipo de error tiene esta oración (o está correcta)?", displayField: "display", perEntryOptions: true },
  },
});
