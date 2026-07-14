// ============================================================
// Los determinantes: banco de datos + lógica del quiz
// ============================================================

const TIPO_ENTRIES = [
  { word: "el", tipo: "Artículo" },
  { word: "la", tipo: "Artículo" },
  { word: "los", tipo: "Artículo" },
  { word: "unas", tipo: "Artículo" },
  { word: "un", tipo: "Artículo" },
  { word: "este", tipo: "Demostrativo" },
  { word: "esa", tipo: "Demostrativo" },
  { word: "aquellos", tipo: "Demostrativo" },
  { word: "esas", tipo: "Demostrativo" },
  { word: "aquel", tipo: "Demostrativo" },
  { word: "mi", tipo: "Posesivo" },
  { word: "tu", tipo: "Posesivo" },
  { word: "su", tipo: "Posesivo" },
  { word: "nuestro", tipo: "Posesivo" },
  { word: "vuestras", tipo: "Posesivo" },
  { word: "dos", tipo: "Numeral" },
  { word: "tercero", tipo: "Numeral" },
  { word: "cinco", tipo: "Numeral" },
  { word: "primero", tipo: "Numeral" },
  { word: "diez", tipo: "Numeral" },
  { word: "algunos", tipo: "Indefinido" },
  { word: "muchos", tipo: "Indefinido" },
  { word: "ningún", tipo: "Indefinido" },
  { word: "varios", tipo: "Indefinido" },
  { word: "todos", tipo: "Indefinido" },
];

const ARTICULO_ENTRIES = [
  { word: "el", clase: "Determinado" },
  { word: "la", clase: "Determinado" },
  { word: "los", clase: "Determinado" },
  { word: "las", clase: "Determinado" },
  { word: "un", clase: "Indeterminado" },
  { word: "una", clase: "Indeterminado" },
  { word: "unos", clase: "Indeterminado" },
  { word: "unas", clase: "Indeterminado" },
];

const MODE_GROUPS = {
  tipo: {
    pool: TIPO_ENTRIES,
    field: "tipo",
    question: (e) => `¿Qué tipo de determinante es "${e.word}"?`,
    options: ["Artículo", "Demostrativo", "Posesivo", "Numeral", "Indefinido"],
  },
  articulo: {
    pool: ARTICULO_ENTRIES,
    field: "clase",
    question: (e) => `¿"${e.word}" es un artículo determinado o indeterminado?`,
    options: ["Determinado", "Indeterminado"],
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

  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "tipo";
  let current;
  let lastWord = "";

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? (Math.random() < 0.5 ? "tipo" : "articulo") : mode;
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
