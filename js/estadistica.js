// ============================================================
// Estadística: diagramas de barras, moda y media: banco de datos + quiz
// ============================================================

function barChartSVG(categories, values) {
  const width = 280;
  const height = 180;
  const margin = 30;
  const maxVal = Math.max(...values);
  const gap = 10;
  const barWidth = (width - margin * 2) / categories.length - gap;

  let bars = "";
  categories.forEach((cat, i) => {
    const val = values[i];
    const chartHeight = height - margin * 2;
    const barH = (val / maxVal) * chartHeight;
    const x = margin + i * (barWidth + gap);
    const y = height - margin - barH;
    bars += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" fill="var(--color-indigo)"/>`;
    bars += `<text x="${x + barWidth / 2}" y="${height - margin + 14}" font-size="11" text-anchor="middle" fill="var(--text)">${cat}</text>`;
    bars += `<text x="${x + barWidth / 2}" y="${y - 4}" font-size="12" text-anchor="middle" font-weight="700" fill="var(--text)">${val}</text>`;
  });

  const axisY = `<line x1="${margin}" y1="${margin - 10}" x2="${margin}" y2="${height - margin}" stroke="var(--text)" stroke-width="2"/>`;
  const axisX = `<line x1="${margin}" y1="${height - margin}" x2="${width - 10}" y2="${height - margin}" stroke="var(--text)" stroke-width="2"/>`;

  return `<svg viewBox="0 0 ${width} ${height}" width="280" height="180">${axisY}${axisX}${bars}</svg>`;
}

const LEERBARRAS_ENTRIES = [
  { categories: ["Perro", "Gato", "Pez", "Pájaro"], values: [7, 5, 2, 4], question: "¿Qué mascota es la más votada?", correct: "Perro", options: ["Perro", "Gato", "Pez", "Pájaro"] },
  { categories: ["Lunes", "Martes", "Miércoles"], values: [3, 6, 4], question: "¿Cuántos hubo el martes?", correct: "6", options: ["6", "3", "4", "13"] },
  { categories: ["Fresa", "Chocolate", "Vainilla", "Limón"], values: [9, 12, 6, 3], question: "¿Qué sabor es el menos votado?", correct: "Limón", options: ["Limón", "Vainilla", "Fresa", "Chocolate"] },
  { categories: ["A", "B", "C", "D"], values: [10, 10, 5, 15], question: "¿Cuántos tiene la categoría D?", correct: "15", options: ["15", "10", "5", "40"] },
  { categories: ["Enero", "Febrero", "Marzo"], values: [20, 15, 25], question: "¿Qué mes tiene más?", correct: "Marzo", options: ["Marzo", "Enero", "Febrero", "Los tres iguales"] },
  { categories: ["Norte", "Sur", "Este", "Oeste"], values: [8, 8, 3, 6], question: "¿Cuántos tiene el Sur?", correct: "8", options: ["8", "3", "6", "25"] },
];

const MODA_ENTRIES = [
  { display: "3, 5, 3, 7, 3, 8", correct: "3", options: ["3", "5", "7", "8"] },
  { display: "2, 4, 4, 6, 8, 4", correct: "4", options: ["4", "2", "6", "8"] },
  { display: "10, 12, 10, 15, 12, 12", correct: "12", options: ["12", "10", "15", "11"] },
  { display: "1, 1, 2, 2, 2, 3", correct: "2", options: ["2", "1", "3", "2,5"] },
  { display: "7, 9, 7, 7, 9", correct: "7", options: ["7", "9", "8", "16"] },
  { display: "6, 6, 6, 4, 4, 9", correct: "6", options: ["6", "4", "9", "5"] },
];

const MEDIA_ENTRIES = [
  { display: "4, 6, 8", correct: "6", options: ["6", "18", "9", "5"] },
  { display: "2, 4, 6, 8", correct: "5", options: ["5", "20", "4", "6"] },
  { display: "10, 20, 30", correct: "20", options: ["20", "60", "15", "30"] },
  { display: "5, 5, 5, 5", correct: "5", options: ["5", "20", "4", "10"] },
  { display: "3, 7, 5", correct: "5", options: ["5", "15", "3", "7"] },
  { display: "10, 15, 20, 25", correct: "17,5", options: ["17,5", "70", "18", "17"] },
];

const MEDIANA_ENTRIES = [
  { display: "3, 5, 7, 8, 9", correct: "7", options: ["7", "8", "6,4", "5"] },
  { display: "2, 4, 6, 8", correct: "5", options: ["5", "6", "4", "14"] },
  { display: "1, 3, 3, 6, 9", correct: "3", options: ["3", "6", "4,4", "1"] },
  { display: "10, 12, 14, 16", correct: "13", options: ["13", "14", "12", "26"] },
  { display: "5, 5, 6, 8, 10", correct: "6", options: ["6", "5", "8", "6,8"] },
  { display: "4, 8, 12, 16, 20", correct: "12", options: ["12", "8", "16", "10"] },
];

const RANGO_ENTRIES = [
  { display: "3, 5, 7, 8, 9", correct: "6", options: ["6", "9", "3", "32"] },
  { display: "2, 4, 6, 8", correct: "6", options: ["6", "8", "2", "20"] },
  { display: "10, 12, 14, 16", correct: "6", options: ["6", "16", "10", "52"] },
  { display: "5, 5, 6, 8, 10", correct: "5", options: ["5", "10", "6", "34"] },
  { display: "1, 3, 3, 6, 9", correct: "8", options: ["8", "9", "1", "22"] },
  { display: "20, 25, 30, 45", correct: "25", options: ["25", "45", "20", "120"] },
];

const FRECUENCIAS_ENTRIES = [
  { display: "Datos: 3, 5, 3, 7, 3, 7. ¿Frecuencia del 3?", correct: "3", options: ["3", "2", "1", "6"] },
  { display: "Datos: 3, 5, 3, 7, 3, 7. ¿Frecuencia del 7?", correct: "2", options: ["2", "3", "1", "6"] },
  { display: "Datos: 2, 2, 4, 4, 4, 6. ¿Frecuencia del 4?", correct: "3", options: ["3", "2", "1", "6"] },
  { display: "Datos: 1, 1, 1, 2, 3, 3. ¿Frecuencia del 1?", correct: "3", options: ["3", "2", "1", "6"] },
  { display: "Datos: 8, 9, 9, 9, 10, 10. ¿Frecuencia del 10?", correct: "2", options: ["2", "3", "1", "6"] },
];

const ACS_GROUP = {
  pool: MODA_ENTRIES,
  field: "correct",
  question: () => "¿Cuál es la moda de estos datos (el que más se repite)?",
  display: "text",
};

const MODE_GROUPS = {
  leerbarras: {
    pool: LEERBARRAS_ENTRIES,
    field: "correct",
    display: "chart",
  },
  moda: {
    pool: MODA_ENTRIES,
    field: "correct",
    question: () => "¿Cuál es la moda de estos datos?",
    display: "text",
  },
  media: {
    pool: MEDIA_ENTRIES,
    field: "correct",
    question: () => "¿Cuál es la media de estos datos?",
    display: "text",
  },
  mediana: {
    pool: MEDIANA_ENTRIES,
    field: "correct",
    question: () => "¿Cuál es la mediana de estos datos?",
    display: "text",
  },
  rango: {
    pool: RANGO_ENTRIES,
    field: "correct",
    question: () => "¿Cuál es el rango de estos datos?",
    display: "text",
  },
  frecuencias: {
    pool: FRECUENCIAS_ENTRIES,
    field: "correct",
    question: () => "Calcula la frecuencia pedida:",
    display: "text",
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

const ESTADISTICA_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo la moda (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo encontrar el valor que más se repite en una lista de datos.",
    example: "3, 5, 3, 7, 3, 8 → el 3 se repite más veces → la moda es 3",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de contenido, pero con una tipografía más legible para leer los datos.",
    example: "4, 6, 8 → media 6 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Leer el diagrama» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo la moda y ayuda extra",
    text: "Igual que en ACS, se trabaja solo encontrar el valor que más se repite, dando más tiempo para pensar cada respuesta.",
    example: "2, 4, 4, 6, 8, 4 → la moda es 4",
  },
  altas: {
    badge: "Altas capacidades",
    title: "La mediana",
    text: "Se practica directamente con el cálculo más exigente: ordenar los datos y encontrar la <strong>mediana</strong>.",
    example: "3, 5, 7, 8, 9 → mediana = 7",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Cuál es la moda? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  renderTeoriaExample();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, ESTADISTICA_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), ESTADISTICA_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("game-chart")) initGame(diff, (fn) => restartCallbacks.push(fn));
});

function renderTeoriaExample() {
  const el = document.getElementById("ejemplo-barras");
  if (el) el.innerHTML = barChartSVG(["Rojo", "Azul", "Verde", "Amarillo"], [5, 8, 3, 6]);
}

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
    card: document.getElementById("practica-estadistica"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    gameChart: document.getElementById("game-chart"),
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
  let mode = "leerbarras";
  let current;
  let lastEntry = null;

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (diff.is("altas")) {
      mode = "mediana";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "mediana"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "leerbarras";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "leerbarras"));
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
      } while (ACS_GROUP.pool.length > 1 && entry === lastEntry);
      lastEntry = entry;
      return { entry, group: ACS_GROUP };
    }
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS[groupKey];
    let entry;
    do {
      entry = group.pool[Math.floor(Math.random() * group.pool.length)];
    } while (group.pool.length > 1 && entry === lastEntry);
    lastEntry = entry;
    return { entry, group };
  }

  function startRound() {
    current = pickQuestion();
    const { entry, group } = current;

    const baseQuestion = group.display === "chart" ? entry.question : group.question();
    els.instructions.textContent = baseQuestion + (diff.is("discalculia") ? " Tómate tu tiempo para pensarlo." : "");
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    if (group.display === "chart") {
      els.gameChart.style.display = "";
      els.wordDisplay.style.display = "none";
      els.gameChart.innerHTML = barChartSVG(entry.categories, entry.values);
    } else {
      els.gameChart.style.display = "none";
      els.wordDisplay.style.display = "";
      els.wordDisplay.textContent = entry.display;
    }

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
    AppProgress.record("estadistica", isCorrect);
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

  applyDifficultyUI();
  startRound();
}
