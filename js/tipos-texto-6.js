// ============================================================
// Textos científicos, históricos, descriptivos y discontinuos: banco de datos + quiz
// ============================================================

const IDENTIFICAR_ENTRIES = [
  { display: "Explica cómo se forman los volcanes, con datos y vocabulario técnico.", correct: "Científico", options: ["Científico", "Histórico", "Descriptivo", "Discontinuo"] },
  { display: "Cuenta cómo se descubrió América en 1492 y sus consecuencias.", correct: "Histórico", options: ["Histórico", "Científico", "Descriptivo", "Discontinuo"] },
  { display: "\"La casa era pequeña, blanca, con un jardín lleno de flores.\"", correct: "Descriptivo", options: ["Descriptivo", "Científico", "Histórico", "Discontinuo"] },
  { display: "Un horario de trenes organizado en columnas.", correct: "Discontinuo", options: ["Discontinuo", "Científico", "Histórico", "Descriptivo"] },
  { display: "Explica el ciclo del agua paso a paso con datos comprobables.", correct: "Científico", options: ["Científico", "Histórico", "Descriptivo", "Discontinuo"] },
  { display: "Narra la Revolución Francesa situándola en 1789.", correct: "Histórico", options: ["Histórico", "Científico", "Descriptivo", "Discontinuo"] },
  { display: "\"Era alto, delgado, de ojos verdes y sonrisa amable.\"", correct: "Descriptivo", options: ["Descriptivo", "Histórico", "Científico", "Discontinuo"] },
  { display: "Un gráfico de barras con la población de varias ciudades.", correct: "Discontinuo", options: ["Discontinuo", "Descriptivo", "Científico", "Histórico"] },
];

const DESCRIPCION_ENTRIES = [
  { display: "\"Tenía el pelo rizado, los ojos azules y era muy alto.\"", correct: "Prosopografía", options: ["Prosopografía", "Etopeya", "Retrato", "Topografía"] },
  { display: "\"Era una persona generosa, alegre y muy trabajadora.\"", correct: "Etopeya", options: ["Etopeya", "Prosopografía", "Retrato", "Topografía"] },
  { display: "\"Alto y fuerte, pero también tímido y muy paciente.\"", correct: "Retrato", options: ["Retrato", "Prosopografía", "Etopeya", "Topografía"] },
  { display: "\"El valle estaba rodeado de montañas y cruzado por un río.\"", correct: "Topografía", options: ["Topografía", "Prosopografía", "Etopeya", "Retrato"] },
  { display: "\"Su rostro ovalado tenía la nariz pequeña y labios finos.\"", correct: "Prosopografía", options: ["Prosopografía", "Etopeya", "Retrato", "Topografía"] },
  { display: "\"Era honesto, curioso y siempre dispuesto a ayudar.\"", correct: "Etopeya", options: ["Etopeya", "Prosopografía", "Retrato", "Topografía"] },
];

const CONTINUODISCONTINUO_ENTRIES = [
  { display: "Un cuento narrado en párrafos seguidos.", correct: "Continuo", options: ["Continuo", "Discontinuo"] },
  { display: "Una tabla con los horarios de autobús.", correct: "Discontinuo", options: ["Discontinuo", "Continuo"] },
  { display: "Un mapa con símbolos y leyenda.", correct: "Discontinuo", options: ["Discontinuo", "Continuo"] },
  { display: "Una carta escrita a un amigo.", correct: "Continuo", options: ["Continuo", "Discontinuo"] },
  { display: "Un billete de tren con datos en casillas.", correct: "Discontinuo", options: ["Discontinuo", "Continuo"] },
  { display: "Una noticia de periódico en párrafos.", correct: "Continuo", options: ["Continuo", "Discontinuo"] },
  { display: "Un gráfico circular de resultados de una encuesta.", correct: "Discontinuo", options: ["Discontinuo", "Continuo"] },
  { display: "Un texto científico explicado en varios párrafos.", correct: "Continuo", options: ["Continuo", "Discontinuo"] },
];

const MODE_GROUPS = {
  identificar: {
    pool: IDENTIFICAR_ENTRIES,
    field: "correct",
    question: () => "¿Qué tipo de texto es?",
  },
  descripcion: {
    pool: DESCRIPCION_ENTRIES,
    field: "correct",
    question: () => "¿Qué tipo de descripción es?",
  },
  continuodiscontinuo: {
    pool: CONTINUODISCONTINUO_ENTRIES,
    field: "correct",
    question: () => "¿Es un texto continuo o discontinuo?",
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
  let mode = "identificar";
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
