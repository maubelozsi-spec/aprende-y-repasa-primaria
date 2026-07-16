// ============================================================
// Las lenguas de España: banco de datos + lógica del quiz
// ============================================================

const LENGUAS_ENTRIES = [
  { display: "¿Dónde es cooficial el catalán?", correct: "Cataluña e Islas Baleares", options: ["Cataluña e Islas Baleares", "Galicia", "País Vasco", "Andalucía"] },
  { display: "¿Dónde es cooficial el gallego?", correct: "Galicia", options: ["Galicia", "Cataluña", "País Vasco", "Canarias"] },
  { display: "¿Dónde es cooficial el euskera?", correct: "País Vasco y parte de Navarra", options: ["País Vasco y parte de Navarra", "Galicia", "Cataluña", "Andalucía"] },
  { display: "¿Cuál es la lengua oficial de todo el Estado español?", correct: "El castellano", options: ["El castellano", "El catalán", "El gallego", "El euskera"] },
  { display: "¿Qué significa que una lengua sea \"cooficial\"?", correct: "Que tiene reconocimiento oficial junto al castellano en esa comunidad", options: ["Que tiene reconocimiento oficial junto al castellano en esa comunidad", "Que es la única lengua permitida", "Que ya no se habla castellano allí", "Que es un dialecto del castellano"] },
];

const VARIEDADES_ENTRIES = [
  { display: "Aspira o pierde la \"s\" final de las palabras.", correct: "Andaluz", options: ["Andaluz", "Canario", "Castellano del norte", "Español de América"] },
  { display: "Usa \"ustedes\" en vez de \"vosotros\".", correct: "Canario", options: ["Canario", "Andaluz", "Castellano del norte", "Español de América"] },
  { display: "Distingue la pronunciación de \"c/z\" y \"s\".", correct: "Castellano del norte", options: ["Castellano del norte", "Andaluz", "Canario", "Español de América"] },
  { display: "Usa \"vos\" en vez de \"tú\" (voseo) en varios países.", correct: "Español de América", options: ["Español de América", "Andaluz", "Canario", "Castellano del norte"] },
  { display: "Las variedades del español son...", correct: "Formas igual de válidas de hablar el mismo idioma", options: ["Formas igual de válidas de hablar el mismo idioma", "Errores que hay que corregir", "Idiomas completamente distintos", "Solo se usan en la escritura"] },
];

const MODE_GROUPS = {
  lenguas: {
    pool: LENGUAS_ENTRIES,
    field: "correct",
    question: () => "Responde:",
  },
  variedades: {
    pool: VARIEDADES_ENTRIES,
    field: "correct",
    question: () => "¿Qué variedad del español es?",
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
  let mode = "lenguas";
  let current;
  let lastDisplay = "";

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

    els.instructions.textContent = group.question();
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
    AppProgress.record("lenguas-espana", isCorrect);
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

  startRound();
}
