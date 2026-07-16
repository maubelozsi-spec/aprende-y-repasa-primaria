// ============================================================
// Números grandes y aproximación: banco de datos + lógica del quiz
// ============================================================

const POSITIONS = ["Centena de millar", "Decena de millar", "Unidad de millar", "Centena", "Decena", "Unidad"];

const VALOR_ENTRIES = [
  { number: "348256", idx: 0 },
  { number: "348256", idx: 1 },
  { number: "348256", idx: 2 },
  { number: "348256", idx: 3 },
  { number: "348256", idx: 4 },
  { number: "348256", idx: 5 },
  { number: "912074", idx: 0 },
  { number: "912074", idx: 3 },
  { number: "570631", idx: 1 },
  { number: "570631", idx: 4 },
  { number: "804395", idx: 2 },
  { number: "804395", idx: 5 },
].map((e) => ({ ...e, tipo: POSITIONS[e.idx] }));

const COMPARAR_ENTRIES = [
  { display: "348.256 ␣ 348.512", correct: "<" },
  { display: "512.300 ␣ 512.300", correct: "=" },
  { display: "789.001 ␣ 788.999", correct: ">" },
  { display: "45.320 ␣ 145.320", correct: "<" },
  { display: "630.000 ␣ 63.000", correct: ">" },
  { display: "271.845 ␣ 271.845", correct: "=" },
  { display: "999.999 ␣ 1.000.000", correct: "<" },
  { display: "820.500 ␣ 820.050", correct: ">" },
];

const APROXIMAR_ENTRIES = [
  { display: "273.849 → a la centena de millar", correct: "300.000", options: ["300.000", "270.000", "280.000", "200.000"] },
  { display: "273.849 → a la decena de millar", correct: "270.000", options: ["270.000", "280.000", "273.000", "300.000"] },
  { display: "273.849 → al millar", correct: "274.000", options: ["274.000", "273.000", "273.900", "275.000"] },
  { display: "273.849 → a la centena", correct: "273.800", options: ["273.800", "273.900", "274.000", "273.850"] },
  { display: "56.482 → a la decena de millar", correct: "60.000", options: ["60.000", "50.000", "56.000", "56.500"] },
  { display: "56.482 → al millar", correct: "56.000", options: ["56.000", "57.000", "56.500", "55.000"] },
  { display: "128.350 → a la centena de millar", correct: "100.000", options: ["100.000", "200.000", "130.000", "128.000"] },
  { display: "128.350 → a la centena", correct: "128.400", options: ["128.400", "128.300", "128.350", "128.000"] },
  { display: "6.482.930 → al millón", correct: "6.000.000", options: ["6.000.000", "7.000.000", "6.500.000", "6.480.000"] },
  { display: "12.740.000 → al millón", correct: "13.000.000", options: ["13.000.000", "12.000.000", "12.700.000", "13.500.000"] },
];

const POSITIONS_MILLONES = ["Centena de millón", "Decena de millón", "Unidad de millón", "Centena de millar", "Decena de millar", "Unidad de millar", "Centena", "Decena", "Unidad"];

const VALOR_MILLONES_ENTRIES = [
  { number: "348256719", idx: 0 },
  { number: "348256719", idx: 1 },
  { number: "348256719", idx: 2 },
  { number: "348256719", idx: 3 },
  { number: "348256719", idx: 6 },
  { number: "348256719", idx: 8 },
  { number: "912074305", idx: 0 },
  { number: "912074305", idx: 2 },
  { number: "570631842", idx: 1 },
  { number: "570631842", idx: 4 },
  { number: "804395210", idx: 2 },
  { number: "804395210", idx: 5 },
].map((e) => ({ ...e, tipo: POSITIONS_MILLONES[e.idx] }));

const MODE_GROUPS = {
  valorposicional: {
    pool: VALOR_ENTRIES,
    field: "tipo",
    question: () => "¿Qué valor tiene la cifra remarcada?",
    options: POSITIONS,
    display: "tiles",
  },
  comparar: {
    pool: COMPARAR_ENTRIES,
    field: "correct",
    question: () => "¿Qué signo va en el hueco (␣)?",
    options: ["<", "=", ">"],
    display: "text",
  },
  aproximar: {
    pool: APROXIMAR_ENTRIES,
    field: "correct",
    question: () => "Redondea este número:",
    options: null,
    display: "text",
  },
  millones: {
    pool: VALOR_MILLONES_ENTRIES,
    field: "tipo",
    question: () => "¿Qué valor tiene la cifra remarcada? (números más grandes)",
    options: POSITIONS_MILLONES,
    display: "tiles",
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
    tilesDisplay: document.getElementById("tiles-display"),
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
  let mode = "valorposicional";
  let current;
  let lastKey = "";

  function entryKey(entry) {
    return JSON.stringify(entry);
  }

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS[groupKey];
    let entry;
    do {
      entry = group.pool[Math.floor(Math.random() * group.pool.length)];
    } while (group.pool.length > 1 && entryKey(entry) === lastKey);
    lastKey = entryKey(entry);
    return { entry, group };
  }

  function startRound() {
    current = pickQuestion();
    const { entry, group } = current;

    els.instructions.textContent = group.question();
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    if (group.display === "tiles") {
      els.tilesDisplay.style.display = "";
      els.wordDisplay.style.display = "none";
      els.tilesDisplay.innerHTML = "";
      entry.number.split("").forEach((digit, i) => {
        const col = document.createElement("div");
        col.className = "pv-col";
        const tile = document.createElement("span");
        tile.className = "letter" + (i === entry.idx ? " highlight" : "");
        tile.textContent = digit;
        col.appendChild(tile);
        els.tilesDisplay.appendChild(col);
      });
    } else {
      els.tilesDisplay.style.display = "none";
      els.wordDisplay.style.display = "";
      els.wordDisplay.textContent = entry.display;
    }

    const correct = entry[group.field];
    let options = entry.options ? entry.options.slice() : group.options.slice();
    if (options.length > 4) {
      const others = options.filter((o) => o !== correct);
      options = shuffle([correct, ...shuffle(others).slice(0, 3)]);
    } else {
      options = shuffle(options);
    }

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
    AppProgress.record("numeros-grandes", isCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    const allBtns = els.answerButtons.querySelectorAll(".syllable-chip");
    allBtns.forEach((b) => {
      b.disabled = true;
      if (b.textContent === correct) b.classList.add("correct");
      else if (b === btn && !isCorrect) b.classList.add("incorrect");
    });

    const titleText = isCorrect ? "Correcto" : "No era esa";
    const shown = group.display === "tiles" ? entry.number : entry.display;

    els.feedback.classList.add("show", isCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>${shown} → <strong>${correct}</strong>.</p>`;

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
