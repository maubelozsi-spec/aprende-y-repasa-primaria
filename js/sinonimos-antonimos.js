// ============================================================
// Sinónimos y antónimos: banco de palabras + lógica del quiz
// ============================================================

const ENTRIES = [
  // ---- Sinónimos ----
  { word: "feliz", type: "sinonimo", correct: "contento", options: ["contento", "triste", "rápido", "alto"] },
  { word: "triste", type: "sinonimo", correct: "apenado", options: ["apenado", "feliz", "grande", "limpio"] },
  { word: "grande", type: "sinonimo", correct: "enorme", options: ["enorme", "pequeño", "rápido", "oscuro"] },
  { word: "pequeño", type: "sinonimo", correct: "diminuto", options: ["diminuto", "grande", "feliz", "ancho"] },
  { word: "bonito", type: "sinonimo", correct: "hermoso", options: ["hermoso", "feo", "lento", "vacío"] },
  { word: "rápido", type: "sinonimo", correct: "veloz", options: ["veloz", "lento", "triste", "bajo"] },
  { word: "inteligente", type: "sinonimo", correct: "listo", options: ["listo", "torpe", "débil", "sucio"] },
  { word: "valiente", type: "sinonimo", correct: "audaz", options: ["audaz", "cobarde", "tacaño", "oscuro"] },
  { word: "comenzar", type: "sinonimo", correct: "empezar", options: ["empezar", "terminar", "subir", "comprar"] },
  { word: "mirar", type: "sinonimo", correct: "observar", options: ["observar", "escuchar", "oler", "tocar"] },
  { word: "casa", type: "sinonimo", correct: "vivienda", options: ["vivienda", "coche", "camino", "río"] },
  { word: "fuerte", type: "sinonimo", correct: "robusto", options: ["robusto", "débil", "fino", "claro"] },

  // ---- Antónimos ----
  { word: "feliz", type: "antonimo", correct: "triste", options: ["triste", "contento", "alegre", "animado"] },
  { word: "grande", type: "antonimo", correct: "pequeño", options: ["pequeño", "enorme", "alto", "ancho"] },
  { word: "rápido", type: "antonimo", correct: "lento", options: ["lento", "veloz", "ágil", "ligero"] },
  { word: "alto", type: "antonimo", correct: "bajo", options: ["bajo", "grande", "largo", "ancho"] },
  { word: "día", type: "antonimo", correct: "noche", options: ["noche", "tarde", "mañana", "sol"] },
  { word: "subir", type: "antonimo", correct: "bajar", options: ["bajar", "entrar", "saltar", "correr"] },
  { word: "comprar", type: "antonimo", correct: "vender", options: ["vender", "pagar", "ganar", "ahorrar"] },
  { word: "abrir", type: "antonimo", correct: "cerrar", options: ["cerrar", "entrar", "salir", "romper"] },
  { word: "ganar", type: "antonimo", correct: "perder", options: ["perder", "jugar", "competir", "empatar"] },
  { word: "limpio", type: "antonimo", correct: "sucio", options: ["sucio", "brillante", "mojado", "roto"] },
  { word: "caliente", type: "antonimo", correct: "frío", options: ["frío", "templado", "ardiente", "húmedo"] },
  { word: "valiente", type: "antonimo", correct: "cobarde", options: ["cobarde", "audaz", "fuerte", "tímido"] },
];

function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const SINANT_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo antónimos (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo encontrar antónimos (palabras contrarias), que son más intuitivos que los sinónimos.",
    example: "«grande» → pequeño",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las palabras.",
    example: "«feliz» → contento → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente entre sinónimos y antónimos, y mantener mejor la atención.",
    example: "Solo preguntas de «Sinónimos» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo antónimos y ayuda extra",
    text: "Igual que en ACS, se trabaja solo encontrar antónimos, dando más tiempo para pensar cada respuesta.",
    example: "«subir» → bajar",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Sinónimos",
    text: "Se practica directamente con el contenido más exigente: encontrar <strong>sinónimos</strong>, que requieren distinguir matices de significado más sutiles.",
    example: "«valiente» → audaz",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "Elige el sinónimo o el antónimo → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, SINANT_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), SINANT_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-sinonimos"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "sinonimo";
  let current;
  let lastWord = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "antonimo";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "antonimo"));
    } else if (diff.is("altas")) {
      mode = "sinonimo";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "sinonimo"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "sinonimo";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "sinonimo"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pool() {
    if (mode === "mezcla") return ENTRIES;
    return ENTRIES.filter((e) => e.type === mode);
  }

  function pickEntry() {
    const list = pool();
    let entry;
    do {
      entry = list[Math.floor(Math.random() * list.length)];
    } while (list.length > 1 && entry.word === lastWord);
    lastWord = entry.word;
    return entry;
  }

  function startRound() {
    current = pickEntry();

    els.instructions.textContent =
      (current.type === "sinonimo" ? "Elige el sinónimo (la palabra que significa lo mismo):" : "Elige el antónimo (la palabra que significa lo contrario):") +
      (diff.is("discalculia") ? " Tómate tu tiempo." : "");
    els.wordDisplay.textContent = current.word;

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    const options = shuffle(current.options);
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
    const isCorrect = chosen === current.correct;

    if (isCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("sinonimos-antonimos", isCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    const allBtns = els.answerButtons.querySelectorAll(".syllable-chip");
    allBtns.forEach((b) => {
      b.disabled = true;
      if (b.textContent === current.correct) b.classList.add("correct");
      else if (b === btn && !isCorrect) b.classList.add("incorrect");
    });

    const relation = current.type === "sinonimo" ? "un sinónimo de" : "un antónimo de";
    const titleText = isCorrect ? "Correcto" : "No era esa";

    els.feedback.classList.add("show", isCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p><strong>${current.correct}</strong> es ${relation} <strong>${current.word}</strong>.</p>`;

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

const SINANT_FICHA_SINONIMOS = ENTRIES.filter((e) => e.type === "sinonimo");
const SINANT_FICHA_ANTONIMOS = ENTRIES.filter((e) => e.type === "antonimo");

registerLenguaFicha("sinonimos-antonimos", {
  label: "Sinónimos y antónimos",
  resumen: "Los sinónimos son palabras que significan lo mismo; los antónimos son palabras que significan lo contrario.",
  easyMode: "antonimo",
  altasMode: "sinonimo",
  defaultMode: "sinonimo",
  pools: {
    sinonimo: { pool: SINANT_FICHA_SINONIMOS, field: "correct", question: () => "Elige el sinónimo (la palabra que significa lo mismo):", displayField: "word", perEntryOptions: true },
    antonimo: { pool: SINANT_FICHA_ANTONIMOS, field: "correct", question: () => "Elige el antónimo (la palabra que significa lo contrario):", displayField: "word", perEntryOptions: true },
  },
});
