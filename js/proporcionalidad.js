// ============================================================
// Proporcionalidad y escalas: banco de datos + lógica del quiz
// ============================================================

const ESPROPORCIONAL_ENTRIES = [
  { display: "2 kg de manzanas cuestan 4€, 4 kg cuestan 8€. ¿Es proporcional?", correct: "Sí" },
  { display: "Con 10 años mides 130 cm; con 20 años, ¿medirás 260 cm?", correct: "No" },
  { display: "1 entrada de cine cuesta 6€, 3 entradas cuestan 18€. ¿Es proporcional?", correct: "Sí" },
  { display: "Un bebé de 1 año pesa 10 kg. ¿A los 2 años pesará 20 kg?", correct: "No" },
  { display: "2 horas de trabajo dan 40€, 4 horas dan 80€. ¿Es proporcional?", correct: "Sí" },
  { display: "Un coche tarda 1 hora a 100 km/h. ¿A 200 km/h tardará 2 horas?", correct: "No" },
  { display: "3 litros de leche cuestan 3€, 6 litros cuestan 6€. ¿Es proporcional?", correct: "Sí" },
  { display: "Un examen dura 1 hora con 10 preguntas. ¿Con 20 preguntas durará 2 horas siempre?", correct: "No" },
];

const REGLATRES_ENTRIES = [
  { display: "3 lápices cuestan 6€. ¿Cuánto cuestan 5 lápices?", correct: "10", options: ["10", "15", "18", "8"] },
  { display: "4 kg de naranjas cuestan 8€. ¿Cuánto cuestan 6 kg?", correct: "12", options: ["12", "10", "16", "14"] },
  { display: "2 obreros construyen un muro en 6 días. Si son proporcionales, ¿cuántos días tarda 1 obrero (haciendo el doble de trabajo)?", correct: "12", options: ["12", "3", "6", "18"] },
  { display: "5 cuadernos cuestan 15€. ¿Cuánto cuestan 8 cuadernos?", correct: "24", options: ["24", "20", "18", "30"] },
  { display: "3 botellas de agua cuestan 4,5€. ¿Cuánto cuestan 6 botellas?", correct: "9", options: ["9", "7,5", "12", "6"] },
  { display: "2 entradas cuestan 14€. ¿Cuánto cuestan 5 entradas?", correct: "35", options: ["35", "28", "42", "21"] },
];

const ESCALAS_ENTRIES = [
  { display: "Escala 1:100, medida en el plano 3 cm → ¿medida real?", correct: "300 cm", options: ["300 cm", "3 cm", "30 cm", "3.000 cm"] },
  { display: "Escala 1:200, medida en el plano 5 cm → ¿medida real?", correct: "1.000 cm", options: ["1.000 cm", "200 cm", "100 cm", "500 cm"] },
  { display: "Escala 1:50, medida en el plano 4 cm → ¿medida real?", correct: "200 cm", options: ["200 cm", "50 cm", "100 cm", "20 cm"] },
  { display: "Escala 1:1000, medida real 5.000 cm → ¿medida en el plano?", correct: "5 cm", options: ["5 cm", "50 cm", "500 cm", "1 cm"] },
  { display: "Escala 1:10, medida real 80 cm → ¿medida en el plano?", correct: "8 cm", options: ["8 cm", "80 cm", "800 cm", "0,8 cm"] },
];

const MODE_GROUPS = {
  esproporcional: {
    pool: ESPROPORCIONAL_ENTRIES,
    field: "correct",
    question: () => "Responde Sí o No:",
    options: ["Sí", "No"],
  },
  reglatres: {
    pool: REGLATRES_ENTRIES,
    field: "correct",
    question: () => "Resuelve con la regla de tres:",
  },
  escalas: {
    pool: ESCALAS_ENTRIES,
    field: "correct",
    question: () => "Calcula usando la escala:",
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
  let mode = "esproporcional";
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
    const options = shuffle((entry.options || group.options).slice());

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
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>${entry.display} → <strong>${correct}</strong>.</p>`;

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
