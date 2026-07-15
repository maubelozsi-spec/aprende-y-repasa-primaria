// ============================================================
// Préstamos, palabras tabú y eufemismos: banco de datos + lógica del quiz
// ============================================================

const ORIGEN_ENTRIES = [
  { display: "fútbol", correct: "Inglés", options: ["Inglés", "Francés", "Italiano", "Árabe"] },
  { display: "croissant", correct: "Francés", options: ["Francés", "Inglés", "Italiano", "Árabe"] },
  { display: "pizza", correct: "Italiano", options: ["Italiano", "Francés", "Inglés", "Árabe"] },
  { display: "selfi", correct: "Inglés", options: ["Inglés", "Francés", "Italiano", "Alemán"] },
  { display: "almohada", correct: "Árabe", options: ["Árabe", "Inglés", "Francés", "Italiano"] },
  { display: "aceituna", correct: "Árabe", options: ["Árabe", "Italiano", "Francés", "Inglés"] },
  { display: "azúcar", correct: "Árabe", options: ["Árabe", "Inglés", "Francés", "Italiano"] },
  { display: "anorak", correct: "Lengua inuit", options: ["Lengua inuit", "Inglés", "Francés", "Italiano"] },
];

const EUFEMISMO_ENTRIES = [
  { display: "morir", correct: "Fallecer", options: ["Fallecer", "Estirar la pata", "Diñarla", "Palmarla"] },
  { display: "viejo", correct: "Persona de la tercera edad", options: ["Persona de la tercera edad", "Carcamal", "Vejestorio", "Anciano decrépito"] },
  { display: "despedir (del trabajo)", correct: "Prescindir de sus servicios", options: ["Prescindir de sus servicios", "Poner de patitas en la calle", "Echar", "Largar del trabajo"] },
  { display: "gordo", correct: "Persona con sobrepeso", options: ["Persona con sobrepeso", "Gordinflón", "Foca", "Obeso mórbido (informal)"] },
  { display: "pobre", correct: "Persona con pocos recursos", options: ["Persona con pocos recursos", "Muerto de hambre", "Pelagatos", "Mendigo (despectivo)"] },
];

const MODE_GROUPS = {
  origen: {
    pool: ORIGEN_ENTRIES,
    field: "correct",
    question: () => "¿De qué idioma viene esta palabra prestada?",
  },
  eufemismo: {
    pool: EUFEMISMO_ENTRIES,
    field: "correct",
    question: () => "¿Cuál es el eufemismo correcto para esta palabra tabú?",
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
  let mode = "origen";
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
