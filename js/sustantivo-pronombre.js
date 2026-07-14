// ============================================================
// El sustantivo y el pronombre: banco de datos + lógica del quiz
// ============================================================

const NOUNS = [
  { word: "perro", tipo: "comun", concrecion: "concreto", cantidad: "individual", genero: "masculino", numero: "singular" },
  { word: "mesa", tipo: "comun", concrecion: "concreto", cantidad: "individual", genero: "femenino", numero: "singular" },
  { word: "flores", tipo: "comun", concrecion: "concreto", cantidad: "individual", genero: "femenino", numero: "plural" },
  { word: "libros", tipo: "comun", concrecion: "concreto", cantidad: "individual", genero: "masculino", numero: "plural" },
  { word: "coche", tipo: "comun", concrecion: "concreto", cantidad: "individual", genero: "masculino", numero: "singular" },
  { word: "ventana", tipo: "comun", concrecion: "concreto", cantidad: "individual", genero: "femenino", numero: "singular" },
  { word: "rebaño", tipo: "comun", concrecion: "concreto", cantidad: "colectivo", genero: "masculino", numero: "singular" },
  { word: "bosque", tipo: "comun", concrecion: "concreto", cantidad: "colectivo", genero: "masculino", numero: "singular" },
  { word: "equipo", tipo: "comun", concrecion: "concreto", cantidad: "colectivo", genero: "masculino", numero: "singular" },
  { word: "enjambre", tipo: "comun", concrecion: "concreto", cantidad: "colectivo", genero: "masculino", numero: "singular" },
  { word: "alumnado", tipo: "comun", concrecion: "concreto", cantidad: "colectivo", genero: "masculino", numero: "singular" },
  { word: "alegría", tipo: "comun", concrecion: "abstracto", genero: "femenino", numero: "singular" },
  { word: "libertad", tipo: "comun", concrecion: "abstracto", genero: "femenino", numero: "singular" },
  { word: "bondad", tipo: "comun", concrecion: "abstracto", genero: "femenino", numero: "singular" },
  { word: "amistad", tipo: "comun", concrecion: "abstracto", genero: "femenino", numero: "singular" },
  { word: "miedo", tipo: "comun", concrecion: "abstracto", genero: "masculino", numero: "singular" },
  { word: "Madrid", tipo: "propio", numero: "singular" },
  { word: "Ana", tipo: "propio", numero: "singular" },
  { word: "España", tipo: "propio", numero: "singular" },
  { word: "Everest", tipo: "propio", numero: "singular" },
  { word: "Pirineos", tipo: "propio", numero: "plural" },
];

const PRONOUNS = [
  { word: "yo", persona: "1ª", numero: "singular" },
  { word: "tú", persona: "2ª", numero: "singular" },
  { word: "él", persona: "3ª", numero: "singular" },
  { word: "ella", persona: "3ª", numero: "singular" },
  { word: "nosotros", persona: "1ª", numero: "plural" },
  { word: "nosotras", persona: "1ª", numero: "plural" },
  { word: "vosotros", persona: "2ª", numero: "plural" },
  { word: "vosotras", persona: "2ª", numero: "plural" },
  { word: "ellos", persona: "3ª", numero: "plural" },
  { word: "ellas", persona: "3ª", numero: "plural" },
];

const QUESTION_TYPES = {
  tipo: {
    applicable: (e) => e.tipo !== undefined,
    prompt: (e) => `¿"${e.word}" es un sustantivo común o propio?`,
    correct: (e) => (e.tipo === "comun" ? "Común" : "Propio"),
    options: ["Común", "Propio"],
  },
  cantidad: {
    applicable: (e) => e.cantidad !== undefined,
    prompt: (e) => `¿"${e.word}" es un sustantivo individual o colectivo?`,
    correct: (e) => (e.cantidad === "individual" ? "Individual" : "Colectivo"),
    options: ["Individual", "Colectivo"],
  },
  concrecion: {
    applicable: (e) => e.concrecion !== undefined,
    prompt: (e) => `¿"${e.word}" es un sustantivo concreto o abstracto?`,
    correct: (e) => (e.concrecion === "concreto" ? "Concreto" : "Abstracto"),
    options: ["Concreto", "Abstracto"],
  },
  genero: {
    applicable: (e) => e.genero !== undefined,
    prompt: (e) => `¿Cuál es el género de "${e.word}"?`,
    correct: (e) => (e.genero === "masculino" ? "Masculino" : "Femenino"),
    options: ["Masculino", "Femenino"],
  },
  numero: {
    applicable: (e) => e.numero !== undefined,
    prompt: (e) => `¿"${e.word}" está en singular o en plural?`,
    correct: (e) => (e.numero === "singular" ? "Singular" : "Plural"),
    options: ["Singular", "Plural"],
  },
  pronombre: {
    applicable: (e) => e.persona !== undefined,
    prompt: (e) => `¿A qué persona y número corresponde "${e.word}"?`,
    correct: (e) => `${e.persona} persona ${e.numero}`,
    options: [
      "1ª persona singular",
      "2ª persona singular",
      "3ª persona singular",
      "1ª persona plural",
      "2ª persona plural",
      "3ª persona plural",
    ],
  },
};

const MODE_GROUPS = {
  clases: { pool: NOUNS, types: ["tipo", "cantidad", "concrecion"] },
  generonumero: { pool: NOUNS, types: ["genero", "numero"] },
  pronombres: { pool: PRONOUNS, types: ["pronombre"] },
  mezcla: { pool: [...NOUNS, ...PRONOUNS], types: ["tipo", "cantidad", "concrecion", "genero", "numero", "pronombre"] },
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
  let lastWord = "";

  function pickQuestion() {
    const group = MODE_GROUPS[mode];
    let entry, typeKey;
    let attempts = 0;
    do {
      entry = group.pool[Math.floor(Math.random() * group.pool.length)];
      const applicableTypes = group.types.filter((t) => QUESTION_TYPES[t].applicable(entry));
      typeKey = applicableTypes.length ? applicableTypes[Math.floor(Math.random() * applicableTypes.length)] : null;
      attempts++;
    } while ((!typeKey || entry.word === lastWord) && attempts < 30);
    lastWord = entry.word;
    return { entry, type: QUESTION_TYPES[typeKey] };
  }

  function startRound() {
    current = pickQuestion();

    els.instructions.textContent = "Responde:";
    els.wordDisplay.innerHTML = current.type.prompt(current.entry);

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    const correct = current.type.correct(current.entry);
    let options = current.type.options.slice();
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
    const correct = current.type.correct(current.entry);
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
