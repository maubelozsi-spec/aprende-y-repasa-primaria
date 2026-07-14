// ============================================================
// Cuerpos geométricos y su desarrollo: banco de datos + lógica del quiz
// ============================================================

const IDENTIFICAR_ENTRIES = [
  { display: "Tiene 6 caras cuadradas iguales.", correct: "Cubo", options: ["Cubo", "Prisma triangular", "Pirámide cuadrangular", "Cilindro"] },
  { display: "Tiene una base circular y una superficie lateral curva que termina en un vértice.", correct: "Cono", options: ["Cono", "Cilindro", "Esfera", "Pirámide"] },
  { display: "Tiene dos bases circulares iguales y paralelas, unidas por una superficie curva.", correct: "Cilindro", options: ["Cilindro", "Cono", "Prisma", "Esfera"] },
  { display: "Tiene una base cuadrada y 4 caras triangulares que se juntan en un vértice.", correct: "Pirámide cuadrangular", options: ["Pirámide cuadrangular", "Prisma cuadrangular", "Cubo", "Cono"] },
  { display: "Todos sus puntos están a la misma distancia del centro; no tiene caras planas.", correct: "Esfera", options: ["Esfera", "Cilindro", "Cono", "Cubo"] },
  { display: "Tiene dos bases triangulares iguales y tres caras rectangulares.", correct: "Prisma triangular", options: ["Prisma triangular", "Pirámide triangular", "Cubo", "Cilindro"] },
];

const CAV_ENTRIES = [
  { display: "¿Cuántas caras tiene un cubo?", correct: "6", options: ["6", "8", "12", "4"] },
  { display: "¿Cuántas aristas tiene un cubo?", correct: "12", options: ["12", "6", "8", "10"] },
  { display: "¿Cuántos vértices tiene un cubo?", correct: "8", options: ["8", "6", "12", "4"] },
  { display: "¿Cuántas caras tiene una pirámide cuadrangular?", correct: "5", options: ["5", "4", "6", "8"] },
  { display: "¿Cuántos vértices tiene una pirámide cuadrangular?", correct: "5", options: ["5", "4", "8", "6"] },
  { display: "¿Cuántas caras tiene un prisma triangular?", correct: "5", options: ["5", "6", "3", "9"] },
  { display: "¿Cuántos vértices tiene un prisma triangular?", correct: "6", options: ["6", "5", "9", "8"] },
  { display: "¿Cuántas aristas tiene una pirámide cuadrangular?", correct: "8", options: ["8", "5", "12", "4"] },
];

const DESARROLLO_ENTRIES = [
  { display: "Cubo", correct: "6 cuadrados en forma de cruz", options: ["6 cuadrados en forma de cruz", "2 círculos y 1 rectángulo", "1 círculo y 1 sector circular", "1 cuadrado y 4 triángulos"] },
  { display: "Cilindro", correct: "2 círculos y 1 rectángulo", options: ["2 círculos y 1 rectángulo", "6 cuadrados en forma de cruz", "2 triángulos y 3 rectángulos", "1 cuadrado y 4 triángulos"] },
  { display: "Cono", correct: "1 círculo y 1 sector circular", options: ["1 círculo y 1 sector circular", "2 círculos y 1 rectángulo", "6 cuadrados en forma de cruz", "2 triángulos y 3 rectángulos"] },
  { display: "Prisma triangular", correct: "2 triángulos y 3 rectángulos", options: ["2 triángulos y 3 rectángulos", "1 cuadrado y 4 triángulos", "2 círculos y 1 rectángulo", "6 cuadrados en forma de cruz"] },
  { display: "Pirámide cuadrangular", correct: "1 cuadrado y 4 triángulos", options: ["1 cuadrado y 4 triángulos", "2 triángulos y 3 rectángulos", "1 círculo y 1 sector circular", "6 cuadrados en forma de cruz"] },
  { display: "Esfera", correct: "No tiene desarrollo plano", options: ["No tiene desarrollo plano", "2 círculos y 1 rectángulo", "6 cuadrados en forma de cruz", "1 círculo y 1 sector circular"] },
];

const MODE_GROUPS = {
  identificar: {
    pool: IDENTIFICAR_ENTRIES,
    field: "correct",
    question: () => "¿Qué cuerpo geométrico es?",
  },
  cav: {
    pool: CAV_ENTRIES,
    field: "correct",
    question: () => "Responde:",
  },
  desarrollo: {
    pool: DESARROLLO_ENTRIES,
    field: "correct",
    question: () => "¿Cuál es su desarrollo (al desdoblarlo en el plano)?",
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
