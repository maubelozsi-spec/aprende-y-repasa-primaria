// ============================================================
// El adjetivo: banco de datos + lógica del quiz
// ============================================================

const CLASES_ENTRIES = [
  { word: "alto", clase: "Calificativo" },
  { word: "inteligente", clase: "Calificativo" },
  { word: "feliz", clase: "Calificativo" },
  { word: "rápido", clase: "Calificativo" },
  { word: "amable", clase: "Calificativo" },
  { word: "generoso", clase: "Calificativo" },
  { word: "español", clase: "Gentilicio" },
  { word: "madrileño", clase: "Gentilicio" },
  { word: "francés", clase: "Gentilicio" },
  { word: "italiano", clase: "Gentilicio" },
  { word: "andaluz", clase: "Gentilicio" },
  { word: "mexicano", clase: "Gentilicio" },
];

const GRADO_ENTRIES = [
  { phrase: "Juan es alto", grado: "Positivo" },
  { phrase: "El vestido es bonito", grado: "Positivo" },
  { phrase: "Este coche es rápido", grado: "Positivo" },
  { phrase: "Juan es más alto que Pedro", grado: "Comparativo" },
  { phrase: "Este vestido es tan bonito como el otro", grado: "Comparativo" },
  { phrase: "Soy menos rápido que tú", grado: "Comparativo" },
  { phrase: "Ana es menos alta que su hermano", grado: "Comparativo" },
  { phrase: "Estoy tan feliz como siempre", grado: "Comparativo" },
  { phrase: "Juan es altísimo", grado: "Superlativo" },
  { phrase: "El vestido es muy bonito", grado: "Superlativo" },
  { phrase: "Es el más rápido de la clase", grado: "Superlativo" },
  { phrase: "Este pastel está buenísimo", grado: "Superlativo" },
];

const MODE_GROUPS = {
  clases: { pool: CLASES_ENTRIES, field: "clase", label: (e) => e.word, question: (e) => `¿"${e.word}" es un adjetivo calificativo o gentilicio?`, options: ["Calificativo", "Gentilicio"] },
  grados: { pool: GRADO_ENTRIES, field: "grado", label: (e) => e.phrase, question: (e) => `«${e.phrase}» → ¿en qué grado está el adjetivo?`, options: ["Positivo", "Comparativo", "Superlativo"] },
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

  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "clases";
  let current;
  let lastLabel = "";

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? (Math.random() < 0.5 ? "clases" : "grados") : mode;
    const group = MODE_GROUPS[groupKey];
    let entry;
    do {
      entry = group.pool[Math.floor(Math.random() * group.pool.length)];
    } while (group.pool.length > 1 && group.label(entry) === lastLabel);
    lastLabel = group.label(entry);
    return { entry, group };
  }

  function startRound() {
    current = pickQuestion();

    els.instructions.textContent = "Responde:";
    els.wordDisplay.textContent = current.group.question(current.entry);

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    const options = shuffle(current.group.options);
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
    AppProgress.record("adjetivo", isCorrect);
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
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>${current.group.label(current.entry)} → <strong>${correct}</strong>.</p>`;

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
