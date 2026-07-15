// ============================================================
// Porcentajes: banco de datos + lógica del quiz
// ============================================================

const RELACION_ENTRIES = [
  { display: "25%", correct: "0,25", options: ["0,25", "2,5", "0,025", "25,0"] },
  { display: "8%", correct: "0,08", options: ["0,08", "0,8", "0,008", "80"] },
  { display: "130%", correct: "1,3", options: ["1,3", "13", "0,13", "1,03"] },
  { display: "0,4", correct: "40%", options: ["40%", "4%", "0,4%", "400%"] },
  { display: "0,05", correct: "5%", options: ["5%", "0,5%", "50%", "0,05%"] },
  { display: "0,75", correct: "75%", options: ["75%", "7,5%", "750%", "0,75%"] },
];

const PORCENTAJEDENUM_ENTRIES = [
  { display: "20% de 50", correct: "10", options: ["10", "20", "2", "100"] },
  { display: "10% de 90", correct: "9", options: ["9", "90", "0,9", "19"] },
  { display: "50% de 24", correct: "12", options: ["12", "24", "2,4", "48"] },
  { display: "25% de 80", correct: "20", options: ["20", "80", "4", "55"] },
  { display: "5% de 200", correct: "10", options: ["10", "40", "20", "5"] },
  { display: "75% de 40", correct: "30", options: ["30", "40", "10", "35"] },
];

const PROBLEMAS_ENTRIES = [
  { display: "En una clase de 25 alumnos, el 20% lleva gafas. ¿Cuántos llevan gafas?", correct: "5", options: ["5", "20", "2", "10"] },
  { display: "Un pantalón de 40€ tiene un 25% de descuento. ¿Cuánto se descuenta?", correct: "10", options: ["10", "25", "30", "15"] },
  { display: "De 200 caramelos, el 15% son de fresa. ¿Cuántos son de fresa?", correct: "30", options: ["30", "15", "20", "35"] },
  { display: "Un depósito de 80 litros está lleno al 50%. ¿Cuántos litros tiene?", correct: "40", options: ["40", "50", "30", "60"] },
];

const AUMENTODISMINUCION_ENTRIES = [
  { display: "Aumentar 80 un 20%", correct: "96", options: ["96", "100", "16", "64"] },
  { display: "Disminuir 80 un 20%", correct: "64", options: ["64", "60", "16", "96"] },
  { display: "Aumentar 50 un 10%", correct: "55", options: ["55", "60", "5", "45"] },
  { display: "Disminuir 50 un 10%", correct: "45", options: ["45", "40", "5", "55"] },
  { display: "Aumentar 200 un 15%", correct: "230", options: ["230", "215", "30", "170"] },
  { display: "Disminuir 200 un 15%", correct: "170", options: ["170", "185", "30", "230"] },
  { display: "Aumentar 40 un 25%", correct: "50", options: ["50", "45", "10", "30"] },
  { display: "Disminuir 40 un 25%", correct: "30", options: ["30", "35", "10", "50"] },
];

const MODE_GROUPS = {
  relacion: {
    pool: RELACION_ENTRIES,
    field: "correct",
    question: () => "Escribe la forma equivalente:",
  },
  porcentajedenum: {
    pool: PORCENTAJEDENUM_ENTRIES,
    field: "correct",
    question: () => "Calcula el resultado:",
  },
  problemas: {
    pool: PROBLEMAS_ENTRIES,
    field: "correct",
    question: () => "Resuelve el problema:",
  },
  aumentodisminucion: {
    pool: AUMENTODISMINUCION_ENTRIES,
    field: "correct",
    question: () => "Calcula el resultado:",
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
  let mode = "relacion";
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
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>La respuesta correcta es <strong>${correct}</strong>.</p>`;

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
