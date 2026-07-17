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

const ACS_ENTRIES = [
  { display: "2 lápices cuestan 4€. ¿Cuánto cuestan 4 lápices?", correct: "8", options: ["8", "6", "4", "10"] },
  { display: "3 kg de naranjas cuestan 6€. ¿Cuánto cuestan 6 kg?", correct: "12", options: ["12", "9", "6", "15"] },
  { display: "1 entrada cuesta 5€. ¿Cuánto cuestan 3 entradas?", correct: "15", options: ["15", "10", "5", "20"] },
  { display: "2 cuadernos cuestan 6€. ¿Cuánto cuestan 4 cuadernos?", correct: "12", options: ["12", "8", "6", "10"] },
];

const ACS_GROUP = {
  pool: ACS_ENTRIES,
  field: "correct",
  question: () => "Resuelve con la regla de tres:",
};

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

const PROPORCIONALIDAD_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo relaciones sencillas del doble y el triple (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja la regla de tres con relaciones fáciles de ver, como el doble o el triple, sin escalas ni casos no proporcionales.",
    example: "2 lápices cuestan 4€ → 4 lápices (el doble) cuestan 8€ (el doble)",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de contenido, pero con una tipografía más legible para leer los enunciados.",
    example: "3 lápices cuestan 6€ → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «¿Es proporcional?» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo doble y triple y ayuda extra",
    text: "Igual que en ACS, se trabaja la regla de tres con relaciones fáciles como el doble o el triple, dando más tiempo para pensar.",
    example: "3 kg de naranjas cuestan 6€ → 6 kg cuestan 12€ (el doble)",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Escalas",
    text: "Se practica directamente con el contenido más avanzado: calcular medidas reales o en el plano usando una <strong>escala</strong>.",
    example: "Escala 1:200, medida en el plano 5 cm → medida real 1.000 cm",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Es proporcional? → elige Sí o No",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, PROPORCIONALIDAD_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), PROPORCIONALIDAD_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("word-display")) initGame(diff, (fn) => restartCallbacks.push(fn));
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

function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-proporcionalidad"),
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

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (diff.is("altas")) {
      mode = "escalas";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "escalas"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "esproporcional";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "esproporcional"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    if (diff.is("acs") || diff.is("discalculia")) {
      let entry;
      do {
        entry = ACS_GROUP.pool[Math.floor(Math.random() * ACS_GROUP.pool.length)];
      } while (ACS_GROUP.pool.length > 1 && entry.display === lastDisplay);
      lastDisplay = entry.display;
      return { entry, group: ACS_GROUP };
    }
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

    els.instructions.textContent =
      group.question() + (diff.is("discalculia") ? " Tómate tu tiempo para pensarlo." : "");
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
    AppProgress.record("proporcionalidad", isCorrect);
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

  applyDifficultyUI();
  startRound();
}
