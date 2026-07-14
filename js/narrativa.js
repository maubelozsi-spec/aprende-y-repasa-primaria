// ============================================================
// Narrativa: banco de datos + lógica del quiz
// ============================================================

const GENERO_ENTRIES = [
  { display: "Narración breve, con pocos personajes y una trama sencilla que ocurre en poco tiempo.", tipo: "Cuento" },
  { display: "Historia corta que se puede leer de una sola vez, con pocos personajes.", tipo: "Cuento" },
  { display: "Narración extensa, con muchos personajes y varias historias que se entrelazan.", tipo: "Novela" },
  { display: "Obra larga dividida en capítulos, con tramas complejas.", tipo: "Novela" },
  { display: "Mezcla hechos reales con elementos mágicos o fantásticos, y explica el origen de algo.", tipo: "Leyenda" },
  { display: "Historia transmitida de generación en generación sobre el origen de un lugar.", tipo: "Leyenda" },
];

const NARRADOR_ENTRIES = [
  { display: "Yo caminaba solo por el bosque cuando escuché un ruido.", tipo: "1ª persona" },
  { display: "Ella caminaba sola por el bosque cuando escuchó un ruido.", tipo: "3ª persona" },
  { display: "Recuerdo aquel verano como si fuera ayer.", tipo: "1ª persona" },
  { display: "Él recordaba aquel verano como si fuera ayer.", tipo: "3ª persona" },
  { display: "Nunca olvidaré el día en que gané la carrera.", tipo: "1ª persona" },
  { display: "Ana nunca olvidaría el día en que ganó la carrera.", tipo: "3ª persona" },
];

const ELEMENTOS_ENTRIES = [
  { display: "Quien cuenta la historia.", tipo: "Narrador" },
  { display: "El bosque oscuro donde transcurre toda la historia.", tipo: "Espacio" },
  { display: "El castillo donde vive la princesa.", tipo: "Espacio" },
  { display: "Hace mucho tiempo, en una época muy lejana.", tipo: "Tiempo" },
  { display: "Hace 100 años, en un pueblo pequeño.", tipo: "Tiempo" },
  { display: "El protagonista de la historia.", tipo: "Personaje principal" },
  { display: "El malvado que se enfrenta al héroe.", tipo: "Personaje principal" },
  { display: "El amigo que ayuda al protagonista de vez en cuando.", tipo: "Personaje secundario" },
];

const MODE_GROUPS = {
  genero: {
    pool: GENERO_ENTRIES,
    field: "tipo",
    question: () => "¿Es un cuento, una novela o una leyenda?",
    options: ["Cuento", "Novela", "Leyenda"],
  },
  narrador: {
    pool: NARRADOR_ENTRIES,
    field: "tipo",
    question: () => "¿Está contado en 1ª o en 3ª persona?",
    options: ["1ª persona", "3ª persona"],
  },
  elementos: {
    pool: ELEMENTOS_ENTRIES,
    field: "tipo",
    question: () => "¿A qué parte de la narración corresponde esto?",
    options: ["Narrador", "Personaje principal", "Personaje secundario", "Espacio", "Tiempo"],
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
  let mode = "genero";
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
