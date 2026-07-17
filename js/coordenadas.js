// ============================================================
// Coordenadas, simetrías, traslaciones y giros: banco de datos + lógica
// ============================================================

function gridSVG(points, opts) {
  opts = opts || {};
  const range = 6;
  const cell = 20;
  const size = (range * 2 + 1) * cell;
  const margin = 20;
  const total = size + margin * 2;
  const origin = total / 2;
  const toSx = (x) => origin + x * cell;
  const toSy = (y) => origin - y * cell;

  let gridLines = "";
  for (let i = -range; i <= range; i++) {
    gridLines += `<line x1="${toSx(i)}" y1="${toSy(-range)}" x2="${toSx(i)}" y2="${toSy(range)}" stroke="#e2e4ec" stroke-width="1"/>`;
    gridLines += `<line x1="${toSx(-range)}" y1="${toSy(i)}" x2="${toSx(range)}" y2="${toSy(i)}" stroke="#e2e4ec" stroke-width="1"/>`;
  }

  const axes = `<line x1="${toSx(-range)}" y1="${toSy(0)}" x2="${toSx(range)}" y2="${toSy(0)}" stroke="var(--text)" stroke-width="2"/>
    <line x1="${toSx(0)}" y1="${toSy(-range)}" x2="${toSx(0)}" y2="${toSy(range)}" stroke="var(--text)" stroke-width="2"/>`;

  let extra = "";
  if (opts.axisLine) {
    const { type, pos } = opts.axisLine;
    if (type === "vertical") {
      extra += `<line x1="${toSx(pos)}" y1="${toSy(-range)}" x2="${toSx(pos)}" y2="${toSy(range)}" stroke="var(--color-plum)" stroke-width="3" stroke-dasharray="6 4"/>`;
    } else {
      extra += `<line x1="${toSx(-range)}" y1="${toSy(pos)}" x2="${toSx(range)}" y2="${toSy(pos)}" stroke="var(--color-plum)" stroke-width="3" stroke-dasharray="6 4"/>`;
    }
  }

  let dots = "";
  points.forEach((p) => {
    const sx = toSx(p.x);
    const sy = toSy(p.y);
    const color = p.color || "var(--color-indigo)";
    dots += `<circle cx="${sx}" cy="${sy}" r="5" fill="${color}"/>`;
    dots += `<text x="${sx + 8}" y="${sy - 8}" font-size="13" font-weight="700" fill="${color}">${p.label || ""}</text>`;
  });

  return `<svg viewBox="0 0 ${total} ${total}" width="260" height="260">
    ${gridLines}
    ${axes}
    ${extra}
    ${dots}
  </svg>`;
}

function similarRectSVG(w1, h1, w2, h2) {
  const cell = 18;
  const gap = 40;
  const margin = 20;
  const maxH = Math.max(h1, h2) * cell;
  const totalW = (w1 + w2) * cell + gap + margin * 2;
  const totalH = maxH + margin * 2 + 24;
  const x1 = margin;
  const y1 = margin + (maxH - h1 * cell);
  const x2 = x1 + w1 * cell + gap;
  const y2 = margin + (maxH - h2 * cell);

  return `<svg viewBox="0 0 ${totalW} ${totalH}" width="280" height="${Math.round((totalH / totalW) * 280)}">
    <rect x="${x1}" y="${y1}" width="${w1 * cell}" height="${h1 * cell}" fill="var(--color-indigo-tint, #e4e4fb)" stroke="var(--color-indigo)" stroke-width="2"/>
    <text x="${x1 + (w1 * cell) / 2}" y="${y1 + h1 * cell + 16}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--color-indigo)">${w1}×${h1}</text>
    <rect x="${x2}" y="${y2}" width="${w2 * cell}" height="${h2 * cell}" fill="var(--color-teal-tint)" stroke="var(--color-teal)" stroke-width="2"/>
    <text x="${x2 + (w2 * cell) / 2}" y="${y2 + h2 * cell + 16}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--color-teal)">${w2}×${h2}</text>
  </svg>`;
}

const SEMEJANZA_ENTRIES = [
  { w1: 2, h1: 3, w2: 4, h2: 6, correct: "×2", options: ["×2", "×3", "÷2", "×1,5"] },
  { w1: 3, h1: 2, w2: 9, h2: 6, correct: "×3", options: ["×3", "×2", "÷3", "×1,5"] },
  { w1: 4, h1: 6, w2: 2, h2: 3, correct: "÷2", options: ["÷2", "÷3", "×2", "×0,5"] },
  { w1: 6, h1: 3, w2: 2, h2: 1, correct: "÷3", options: ["÷3", "÷2", "×3", "×2"] },
  { w1: 2, h1: 2, w2: 6, h2: 6, correct: "×3", options: ["×3", "×2", "÷3", "×4"] },
  { w1: 5, h1: 3, w2: 10, h2: 6, correct: "×2", options: ["×2", "×3", "÷2", "×1,5"] },
];

const COORDENADAS_ENTRIES = [
  { x: 3, y: 5, correct: "(3, 5)", options: ["(3, 5)", "(5, 3)", "(-3, 5)", "(3, -5)"] },
  { x: -4, y: 2, correct: "(-4, 2)", options: ["(-4, 2)", "(4, 2)", "(-4, -2)", "(2, -4)"] },
  { x: 5, y: -3, correct: "(5, -3)", options: ["(5, -3)", "(-5, 3)", "(5, 3)", "(-3, 5)"] },
  { x: -2, y: -6, correct: "(-2, -6)", options: ["(-2, -6)", "(2, 6)", "(-6, -2)", "(-2, 6)"] },
  { x: 0, y: 4, correct: "(0, 4)", options: ["(0, 4)", "(4, 0)", "(0, -4)", "(-4, 0)"] },
  { x: 6, y: 0, correct: "(6, 0)", options: ["(6, 0)", "(0, 6)", "(-6, 0)", "(6, 1)"] },
];

const SIMETRIA_ENTRIES = [
  { axisType: "vertical", A: [3, 4], B: [-3, 4], correct: "Sí" },
  { axisType: "vertical", A: [2, 5], B: [2, -5], correct: "No" },
  { axisType: "horizontal", A: [4, 3], B: [4, -3], correct: "Sí" },
  { axisType: "horizontal", A: [5, 2], B: [-5, 2], correct: "No" },
  { axisType: "vertical", A: [-2, 3], B: [2, 3], correct: "Sí" },
  { axisType: "horizontal", A: [3, -4], B: [3, 4], correct: "Sí" },
  { axisType: "vertical", A: [4, -2], B: [4, 2], correct: "No" },
  { axisType: "horizontal", A: [-3, 5], B: [-3, -5], correct: "Sí" },
];

const TRASLACION_ENTRIES = [
  { vector: [4, 1], A: [-3, -2], B: [1, -1], correct: "Sí" },
  { vector: [2, -3], A: [1, 4], B: [3, 0], correct: "No" },
  { vector: [-3, 2], A: [5, -1], B: [2, 1], correct: "Sí" },
  { vector: [-2, -4], A: [3, 5], B: [1, 2], correct: "No" },
  { vector: [3, 3], A: [-4, -3], B: [-1, 0], correct: "Sí" },
  { vector: [5, -2], A: [-1, 3], B: [4, 1], correct: "Sí" },
  { vector: [-1, 4], A: [2, -2], B: [1, 3], correct: "No" },
  { vector: [1, -5], A: [-2, 4], B: [-2, -1], correct: "No" },
];

const GIRO_ENTRIES = [
  { degrees: 90, A: [3, 2], B: [-2, 3], correct: "Sí" },
  { degrees: 180, A: [4, 1], B: [-4, -1], correct: "Sí" },
  { degrees: 270, A: [2, 5], B: [5, -2], correct: "Sí" },
  { degrees: 90, A: [-3, 4], B: [-4, 3], correct: "No" },
  { degrees: 180, A: [5, -2], B: [-5, -2], correct: "No" },
  { degrees: 270, A: [-1, -4], B: [-4, 1], correct: "Sí" },
  { degrees: 90, A: [6, 3], B: [3, -6], correct: "No" },
  { degrees: 180, A: [-2, -5], B: [2, 5], correct: "Sí" },
];

const ACS_ENTRIES = [
  { x: 3, y: 5, correct: "(3, 5)", options: ["(3, 5)", "(5, 3)", "(3, 4)", "(2, 5)"] },
  { x: 2, y: 4, correct: "(2, 4)", options: ["(2, 4)", "(4, 2)", "(2, 3)", "(1, 4)"] },
  { x: 5, y: 2, correct: "(5, 2)", options: ["(5, 2)", "(2, 5)", "(5, 1)", "(4, 2)"] },
  { x: 4, y: 1, correct: "(4, 1)", options: ["(4, 1)", "(1, 4)", "(4, 2)", "(3, 1)"] },
];

const ACS_GROUP = {
  pool: ACS_ENTRIES,
  field: "correct",
  question: () => "¿Cuáles son las coordenadas del punto marcado?",
  render: (entry) => gridSVG([{ x: entry.x, y: entry.y, label: "P", color: "var(--color-indigo)" }]),
};

const MODE_GROUPS = {
  coordenadas: {
    pool: COORDENADAS_ENTRIES,
    field: "correct",
    question: () => "¿Cuáles son las coordenadas del punto marcado?",
    render: (entry) => gridSVG([{ x: entry.x, y: entry.y, label: "P", color: "var(--color-indigo)" }]),
  },
  simetria: {
    pool: SIMETRIA_ENTRIES,
    field: "correct",
    question: (entry) => `¿Es B el simétrico de A respecto al eje ${entry.axisType === "vertical" ? "Y (vertical)" : "X (horizontal)"}?`,
    options: ["Sí", "No"],
    render: (entry) =>
      gridSVG(
        [
          { x: entry.A[0], y: entry.A[1], label: "A", color: "var(--color-indigo)" },
          { x: entry.B[0], y: entry.B[1], label: "B", color: "var(--color-teal)" },
        ],
        { axisLine: { type: entry.axisType, pos: 0 } }
      ),
  },
  traslacion: {
    pool: TRASLACION_ENTRIES,
    field: "correct",
    question: (entry) => `Vector (${entry.vector[0] >= 0 ? "+" : ""}${entry.vector[0]}, ${entry.vector[1] >= 0 ? "+" : ""}${entry.vector[1]}). ¿Es B el trasladado de A según ese vector?`,
    options: ["Sí", "No"],
    render: (entry) =>
      gridSVG([
        { x: entry.A[0], y: entry.A[1], label: "A", color: "var(--color-indigo)" },
        { x: entry.B[0], y: entry.B[1], label: "B", color: "var(--color-teal)" },
      ]),
  },
  giro: {
    pool: GIRO_ENTRIES,
    field: "correct",
    question: (entry) => `Giro de ${entry.degrees}° respecto al origen. ¿Es B el resultado de girar A?`,
    options: ["Sí", "No"],
    render: (entry) =>
      gridSVG([
        { x: entry.A[0], y: entry.A[1], label: "A", color: "var(--color-indigo)" },
        { x: entry.B[0], y: entry.B[1], label: "B", color: "var(--color-teal)" },
      ]),
  },
  semejanza: {
    pool: SEMEJANZA_ENTRIES,
    field: "correct",
    question: () => "¿Cuál es la escala entre las dos figuras semejantes?",
    render: (entry) => similarRectSVG(entry.w1, entry.h1, entry.w2, entry.h2),
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

const COORDENADAS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo coordenadas positivas (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo leer las coordenadas de puntos con números positivos, sin simetrías, traslaciones ni giros.",
    example: "Un punto 3 a la derecha y 5 hacia arriba → (3, 5)",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de contenido, pero con una tipografía más legible para leer las coordenadas.",
    example: "(3, 5) → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Coordenadas» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo coordenadas positivas y ayuda extra",
    text: "Igual que en ACS, se trabaja solo con coordenadas de puntos positivos, dando más tiempo para pensar cada respuesta.",
    example: "Un punto 2 a la derecha y 4 hacia arriba → (2, 4)",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Figuras semejantes y escala",
    text: "Se practica directamente con el contenido más avanzado: calcular la <strong>escala</strong> entre dos figuras semejantes.",
    example: "Un rectángulo de 2×3 ampliado a 4×6 → escala ×2",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Cuáles son las coordenadas del punto? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  renderTeoriaExamples();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, COORDENADAS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), COORDENADAS_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("game-grid")) initGame(diff, (fn) => restartCallbacks.push(fn));
});

function renderTeoriaExamples() {
  const coordEl = document.getElementById("ejemplo-coordenadas");
  if (coordEl) coordEl.innerHTML = gridSVG([{ x: 3, y: 5, label: "P(3, 5)", color: "var(--color-indigo)" }]);

  const simEl = document.getElementById("ejemplo-simetria");
  if (simEl)
    simEl.innerHTML = gridSVG(
      [
        { x: 4, y: 3, label: "A", color: "var(--color-indigo)" },
        { x: -4, y: 3, label: "B", color: "var(--color-teal)" },
      ],
      { axisLine: { type: "vertical", pos: 0 } }
    );

  const trasEl = document.getElementById("ejemplo-traslacion");
  if (trasEl)
    trasEl.innerHTML = gridSVG([
      { x: -3, y: -2, label: "A", color: "var(--color-indigo)" },
      { x: 1, y: -1, label: "B", color: "var(--color-teal)" },
    ]);

  const giroEl = document.getElementById("ejemplo-giro");
  if (giroEl)
    giroEl.innerHTML = gridSVG([
      { x: 3, y: 2, label: "A", color: "var(--color-indigo)" },
      { x: -2, y: 3, label: "B", color: "var(--color-teal)" },
    ]);

  const semEl = document.getElementById("ejemplo-semejanza");
  if (semEl) semEl.innerHTML = similarRectSVG(2, 3, 4, 6);
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
    card: document.getElementById("practica-coordenadas"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    gameGrid: document.getElementById("game-grid"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  const modeKeys = Object.keys(MODE_GROUPS);
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "coordenadas";
  let current;
  let lastEntry = null;

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (diff.is("altas")) {
      mode = "semejanza";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "semejanza"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "coordenadas";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "coordenadas"));
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

    const baseQuestion = typeof group.question === "function" ? group.question(entry) : group.question;
    els.instructions.textContent = baseQuestion + (diff.is("discalculia") ? " Tómate tu tiempo para pensarlo." : "");
    els.gameGrid.innerHTML = group.render(entry);

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
    AppProgress.record("coordenadas", isCorrect);
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
