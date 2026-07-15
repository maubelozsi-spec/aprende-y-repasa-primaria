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
  renderTeoriaExample();
  if (document.getElementById("game-chart")) initGame();
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

function initGame() {
  const els = {
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

  function pickQuestion() {
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

    els.instructions.textContent = group.display === "chart" ? entry.question : group.question();
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
