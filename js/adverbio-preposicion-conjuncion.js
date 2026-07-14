// ============================================================
// El adverbio, la preposición y la conjunción: banco de datos + quiz
// ============================================================

const CATEGORIA_ENTRIES = [
  { word: "aquí", categoria: "Adverbio" },
  { word: "ayer", categoria: "Adverbio" },
  { word: "bien", categoria: "Adverbio" },
  { word: "mucho", categoria: "Adverbio" },
  { word: "siempre", categoria: "Adverbio" },
  { word: "despacio", categoria: "Adverbio" },
  { word: "a", categoria: "Preposición" },
  { word: "con", categoria: "Preposición" },
  { word: "de", categoria: "Preposición" },
  { word: "en", categoria: "Preposición" },
  { word: "para", categoria: "Preposición" },
  { word: "sin", categoria: "Preposición" },
  { word: "y", categoria: "Conjunción" },
  { word: "o", categoria: "Conjunción" },
  { word: "pero", categoria: "Conjunción" },
  { word: "porque", categoria: "Conjunción" },
  { word: "si", categoria: "Conjunción" },
  { word: "aunque", categoria: "Conjunción" },
];

const TIPO_ADVERBIO_ENTRIES = [
  { word: "aquí", tipo: "Lugar" },
  { word: "allí", tipo: "Lugar" },
  { word: "cerca", tipo: "Lugar" },
  { word: "arriba", tipo: "Lugar" },
  { word: "hoy", tipo: "Tiempo" },
  { word: "ayer", tipo: "Tiempo" },
  { word: "mañana", tipo: "Tiempo" },
  { word: "siempre", tipo: "Tiempo" },
  { word: "bien", tipo: "Modo" },
  { word: "mal", tipo: "Modo" },
  { word: "despacio", tipo: "Modo" },
  { word: "así", tipo: "Modo" },
  { word: "mucho", tipo: "Cantidad" },
  { word: "poco", tipo: "Cantidad" },
  { word: "bastante", tipo: "Cantidad" },
  { word: "demasiado", tipo: "Cantidad" },
  { word: "sí", tipo: "Afirmación" },
  { word: "también", tipo: "Afirmación" },
  { word: "no", tipo: "Negación" },
  { word: "nunca", tipo: "Negación" },
  { word: "tampoco", tipo: "Negación" },
  { word: "quizás", tipo: "Duda" },
  { word: "acaso", tipo: "Duda" },
];

const MODE_GROUPS = {
  categoria: {
    pool: CATEGORIA_ENTRIES,
    field: "categoria",
    question: (e) => `¿"${e.word}" es un adverbio, una preposición o una conjunción?`,
    options: ["Adverbio", "Preposición", "Conjunción"],
  },
  tipoadverbio: {
    pool: TIPO_ADVERBIO_ENTRIES,
    field: "tipo",
    question: (e) => `¿Qué tipo de adverbio es "${e.word}"?`,
    options: ["Lugar", "Tiempo", "Modo", "Cantidad", "Afirmación", "Negación", "Duda"],
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

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  if (document.getElementById("word-display")) initGame();
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

function initGame() {
  const els = {
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
  let mode = "categoria";
  let current;
  let lastWord = "";

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS[groupKey];
    let entry;
    do {
      entry = group.pool[Math.floor(Math.random() * group.pool.length)];
    } while (group.pool.length > 1 && entry.word === lastWord);
    lastWord = entry.word;
    return { entry, group };
  }

  function startRound() {
    current = pickQuestion();

    els.instructions.textContent = "Responde:";
    els.wordDisplay.textContent = current.group.question(current.entry);

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
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>"${current.entry.word}" → <strong>${correct}</strong>.</p>`;

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

  startRound();
}
