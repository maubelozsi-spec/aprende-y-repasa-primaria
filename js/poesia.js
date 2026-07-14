// ============================================================
// Poesía y recursos literarios: banco de datos + lógica del quiz
// ============================================================

const VERSO_ESTROFA_ENTRIES = [
  { display: "Cada línea de un poema.", tipo: "Verso" },
  { display: "Un conjunto de versos agrupados.", tipo: "Estrofa" },
  { display: "cielo / suelo", tipo: "Rima consonante" },
  { display: "cantar / lugar", tipo: "Rima consonante" },
  { display: "luna / cuna", tipo: "Rima consonante" },
  { display: "cielo / beso", tipo: "Rima asonante" },
  { display: "casa / cara", tipo: "Rima asonante" },
  { display: "monte / noche", tipo: "Rima asonante" },
];

const RECURSOS_ENTRIES = [
  { display: "Sus ojos son dos luceros.", tipo: "Metáfora" },
  { display: "Su pelo es de oro.", tipo: "Metáfora" },
  { display: "Sus dientes son perlas blancas.", tipo: "Metáfora" },
  { display: "El viento silbaba una canción triste.", tipo: "Personificación" },
  { display: "Las estrellas guiñaban un ojo en el cielo.", tipo: "Personificación" },
  { display: "El sol se despertó perezoso esta mañana.", tipo: "Personificación" },
  { display: "Te lo he dicho un millón de veces.", tipo: "Hipérbole" },
  { display: "Me morí de vergüenza.", tipo: "Hipérbole" },
  { display: "Lloré un río de lágrimas.", tipo: "Hipérbole" },
];

const HAIKU_REFRAN_ENTRIES = [
  { display: "Hoja que cae / el viento la levanta / y sigue el vuelo.", tipo: "Haiku" },
  { display: "Luna de invierno / brilla sobre la nieve / silencio blanco.", tipo: "Haiku" },
  { display: "Gato negro duerme / bajo el sol de la tarde / sueños de pez.", tipo: "Haiku" },
  { display: "A quien madruga, Dios le ayuda.", tipo: "Refrán" },
  { display: "En boca cerrada no entran moscas.", tipo: "Refrán" },
  { display: "Más vale tarde que nunca.", tipo: "Refrán" },
];

const MODE_GROUPS = {
  versoestrofa: {
    pool: VERSO_ESTROFA_ENTRIES,
    field: "tipo",
    question: () => "¿Verso, estrofa, rima consonante o rima asonante?",
    options: ["Verso", "Estrofa", "Rima consonante", "Rima asonante"],
  },
  recursos: {
    pool: RECURSOS_ENTRIES,
    field: "tipo",
    question: () => "¿Qué recurso literario se usa en esta frase?",
    options: ["Metáfora", "Personificación", "Hipérbole"],
  },
  haikurefran: {
    pool: HAIKU_REFRAN_ENTRIES,
    field: "tipo",
    question: () => "¿Es un haiku o un refrán?",
    options: ["Haiku", "Refrán"],
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
  let mode = "versoestrofa";
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

    els.instructions.textContent = current.group.question();
    els.wordDisplay.textContent = current.entry.display;

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    const correct = current.entry[current.group.field];
    let options = current.group.options.slice();
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
    const correct = current.entry[current.group.field];
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
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>${current.entry.display} → <strong>${correct}</strong>.</p>`;

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
