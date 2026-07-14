// ============================================================
// El verbo: banco de datos + lógica del quiz
// ============================================================

const FORMAS_ENTRIES = [
  { word: "cantar", forma: "Infinitivo" },
  { word: "comer", forma: "Infinitivo" },
  { word: "vivir", forma: "Infinitivo" },
  { word: "saltar", forma: "Infinitivo" },
  { word: "cantando", forma: "Gerundio" },
  { word: "comiendo", forma: "Gerundio" },
  { word: "viviendo", forma: "Gerundio" },
  { word: "jugando", forma: "Gerundio" },
  { word: "cantado", forma: "Participio" },
  { word: "comido", forma: "Participio" },
  { word: "vivido", forma: "Participio" },
  { word: "roto", forma: "Participio" },
  { word: "canto", forma: "Forma personal" },
  { word: "comes", forma: "Forma personal" },
  { word: "vivimos", forma: "Forma personal" },
  { word: "cantaremos", forma: "Forma personal" },
  { word: "comían", forma: "Forma personal" },
];

const CONJUGACION_ENTRIES = [
  { word: "cantar", conjugacion: "1ª conjugación" },
  { word: "saltar", conjugacion: "1ª conjugación" },
  { word: "jugar", conjugacion: "1ª conjugación" },
  { word: "estudiar", conjugacion: "1ª conjugación" },
  { word: "comer", conjugacion: "2ª conjugación" },
  { word: "beber", conjugacion: "2ª conjugación" },
  { word: "temer", conjugacion: "2ª conjugación" },
  { word: "correr", conjugacion: "2ª conjugación" },
  { word: "vivir", conjugacion: "3ª conjugación" },
  { word: "partir", conjugacion: "3ª conjugación" },
  { word: "dormir", conjugacion: "3ª conjugación" },
  { word: "escribir", conjugacion: "3ª conjugación" },
];

const PERSONA_OPTIONS = [
  "1ª persona singular",
  "2ª persona singular",
  "3ª persona singular",
  "1ª persona plural",
  "2ª persona plural",
  "3ª persona plural",
];

const PERSONA_ENTRIES = [
  { word: "canto", label: "1ª persona singular" },
  { word: "cantas", label: "2ª persona singular" },
  { word: "canta", label: "3ª persona singular" },
  { word: "cantamos", label: "1ª persona plural" },
  { word: "cantáis", label: "2ª persona plural" },
  { word: "cantan", label: "3ª persona plural" },
  { word: "como", label: "1ª persona singular" },
  { word: "comes", label: "2ª persona singular" },
  { word: "come", label: "3ª persona singular" },
  { word: "comemos", label: "1ª persona plural" },
  { word: "coméis", label: "2ª persona plural" },
  { word: "comen", label: "3ª persona plural" },
];

const CONJUGAR_VERBOS = [
  { infinitivo: "cantar", terminacion: "ar" },
  { infinitivo: "saltar", terminacion: "ar" },
  { infinitivo: "estudiar", terminacion: "ar" },
  { infinitivo: "bailar", terminacion: "ar" },
  { infinitivo: "comer", terminacion: "er" },
  { infinitivo: "beber", terminacion: "er" },
  { infinitivo: "correr", terminacion: "er" },
  { infinitivo: "aprender", terminacion: "er" },
  { infinitivo: "vivir", terminacion: "ir" },
  { infinitivo: "escribir", terminacion: "ir" },
  { infinitivo: "partir", terminacion: "ir" },
  { infinitivo: "abrir", terminacion: "ir" },
];

const TENSES = [
  { key: "presente", label: "presente" },
  { key: "preteritoPerfectoSimple", label: "pretérito perfecto simple" },
  { key: "preteritoImperfecto", label: "pretérito imperfecto" },
  { key: "futuro", label: "futuro" },
  { key: "condicional", label: "condicional" },
];

const PERSONS = [
  { key: "1s", label: "yo" },
  { key: "2s", label: "tú" },
  { key: "3s", label: "él/ella" },
  { key: "1p", label: "nosotros/as" },
  { key: "2p", label: "vosotros/as" },
  { key: "3p", label: "ellos/ellas" },
];

const TENSE_ENDINGS = {
  presente: { ar: ["o", "as", "a", "amos", "áis", "an"], er: ["o", "es", "e", "emos", "éis", "en"], ir: ["o", "es", "e", "imos", "ís", "en"] },
  preteritoPerfectoSimple: { ar: ["é", "aste", "ó", "amos", "asteis", "aron"], er: ["í", "iste", "ió", "imos", "isteis", "ieron"], ir: ["í", "iste", "ió", "imos", "isteis", "ieron"] },
  preteritoImperfecto: { ar: ["aba", "abas", "aba", "ábamos", "abais", "aban"], er: ["ía", "ías", "ía", "íamos", "íais", "ían"], ir: ["ía", "ías", "ía", "íamos", "íais", "ían"] },
};

const FULL_INFINITIVE_ENDINGS = {
  futuro: ["é", "ás", "á", "emos", "éis", "án"],
  condicional: ["ía", "ías", "ía", "íamos", "íais", "ían"],
};

function conjugate(infinitivo, terminacion, tenseKey, personIndex) {
  if (tenseKey === "futuro" || tenseKey === "condicional") {
    return infinitivo + FULL_INFINITIVE_ENDINGS[tenseKey][personIndex];
  }
  const stem = infinitivo.slice(0, -2);
  return stem + TENSE_ENDINGS[tenseKey][terminacion][personIndex];
}

function normalizeAnswer(str) {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

const MODE_GROUPS = {
  formas: {
    pool: FORMAS_ENTRIES,
    field: "forma",
    question: (e) => `¿Qué tipo de forma verbal es "${e.word}"?`,
    options: ["Infinitivo", "Gerundio", "Participio", "Forma personal"],
  },
  conjugacion: {
    pool: CONJUGACION_ENTRIES,
    field: "conjugacion",
    question: (e) => `¿A qué conjugación pertenece "${e.word}"?`,
    options: ["1ª conjugación", "2ª conjugación", "3ª conjugación"],
  },
  persona: {
    pool: PERSONA_ENTRIES,
    field: "label",
    question: (e) => `¿Persona y número de "${e.word}"?`,
    options: PERSONA_OPTIONS,
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
    conjugarRow: document.getElementById("conjugar-input-row"),
    conjugarInput: document.getElementById("conjugar-input"),
    conjugarCheckBtn: document.getElementById("conjugar-check-btn"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  const choiceModeKeys = Object.keys(MODE_GROUPS);
  const allModeKeys = [...choiceModeKeys, "conjugar"];
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "formas";
  let current;
  let lastWord = "";

  function pickConjugarQuestion() {
    const verbo = CONJUGAR_VERBOS[Math.floor(Math.random() * CONJUGAR_VERBOS.length)];
    const tense = TENSES[Math.floor(Math.random() * TENSES.length)];
    const personIndex = Math.floor(Math.random() * PERSONS.length);
    const person = PERSONS[personIndex];
    const correct = conjugate(verbo.infinitivo, verbo.terminacion, tense.key, personIndex);
    return { kind: "conjugar", verbo, tense, person, correct };
  }

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? allModeKeys[Math.floor(Math.random() * allModeKeys.length)] : mode;
    if (groupKey === "conjugar") return pickConjugarQuestion();

    const group = MODE_GROUPS[groupKey];
    let entry;
    do {
      entry = group.pool[Math.floor(Math.random() * group.pool.length)];
    } while (group.pool.length > 1 && entry.word === lastWord);
    lastWord = entry.word;
    return { kind: "choice", entry, group };
  }

  function startRound() {
    current = pickQuestion();

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    if (current.kind === "conjugar") {
      els.answerButtons.style.display = "none";
      els.answerButtons.innerHTML = "";
      els.conjugarRow.style.display = "";
      els.instructions.textContent = "Escribe la forma verbal correcta:";
      els.wordDisplay.innerHTML = `Conjuga <strong>${current.verbo.infinitivo}</strong> en ${current.tense.label} (${current.person.label})`;
      els.conjugarInput.value = "";
      els.conjugarInput.disabled = false;
      els.conjugarInput.classList.remove("correct", "incorrect");
      els.conjugarInput.focus();
      return;
    }

    els.answerButtons.style.display = "";
    els.conjugarRow.style.display = "none";
    els.instructions.textContent = "Responde:";
    els.wordDisplay.textContent = current.group.question(current.entry);

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

  function checkConjugar() {
    if (els.conjugarInput.value.trim() === "") return;

    const isCorrect = normalizeAnswer(els.conjugarInput.value) === normalizeAnswer(current.correct);

    if (isCorrect) scoreOk++;
    else scoreKo++;
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.conjugarInput.disabled = true;
    els.conjugarInput.classList.add(isCorrect ? "correct" : "incorrect");

    const titleText = isCorrect ? "Correcto" : "No era esa";
    els.feedback.classList.add("show", isCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>${current.verbo.infinitivo} (${current.tense.label}, ${current.person.label}) → <strong>${current.correct}</strong>.</p>`;

    els.nextBtn.style.display = "";
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

  els.conjugarCheckBtn.addEventListener("click", checkConjugar);
  els.conjugarInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkConjugar();
  });

  els.nextBtn.addEventListener("click", startRound);

  startRound();
}
