// ============================================================
// Loísmo, laísmo y leísmo: banco de datos + lógica del quiz
// ============================================================

const COMPLETAR_ENTRIES = [
  { display: "Compré el pan. ___ compré esta mañana. (CD masculino)", correct: "Lo", options: ["Lo", "La", "Le"] },
  { display: "Vi a María. ___ vi en el parque. (CD femenino)", correct: "La", options: ["La", "Lo", "Le"] },
  { display: "Regalé flores a mi madre. ___ regalé flores. (CI)", correct: "Le", options: ["Le", "Lo", "La"] },
  { display: "Escribí una carta a mi amigo. ___ escribí una carta. (CI)", correct: "Le", options: ["Le", "Lo", "La"] },
  { display: "Compré los libros. ___ compré ayer. (CD masculino plural)", correct: "Los", options: ["Los", "Las", "Les"] },
  { display: "Vi a mis primas. ___ vi el sábado. (CD femenino plural)", correct: "Las", options: ["Las", "Los", "Les"] },
  { display: "Conté un secreto a mis amigos. ___ conté un secreto. (CI plural)", correct: "Les", options: ["Les", "Los", "Las"] },
  { display: "Compré la mesa. ___ compré nueva. (CD femenino)", correct: "La", options: ["La", "Lo", "Le"] },
];

const IDENTIFICARERROR_ENTRIES = [
  { display: "Lo dije la verdad a mi padre.", correct: "Loísmo", options: ["Loísmo", "Laísmo", "Leísmo", "Correcta"] },
  { display: "La dije que viniera a la fiesta.", correct: "Laísmo", options: ["Laísmo", "Loísmo", "Leísmo", "Correcta"] },
  { display: "Le vi ayer en el parque (a él, como CD).", correct: "Leísmo", options: ["Leísmo", "Loísmo", "Laísmo", "Correcta"] },
  { display: "Le regalé un libro a mi hermano.", correct: "Correcta", options: ["Correcta", "Loísmo", "Laísmo", "Leísmo"] },
  { display: "Lo vi ayer en el parque.", correct: "Correcta", options: ["Correcta", "Loísmo", "Laísmo", "Leísmo"] },
  { display: "La compré un regalo a mi amiga.", correct: "Laísmo", options: ["Laísmo", "Loísmo", "Leísmo", "Correcta"] },
  { display: "Lo compré flores a mi madre.", correct: "Loísmo", options: ["Loísmo", "Laísmo", "Leísmo", "Correcta"] },
  { display: "La vi en la tienda ayer.", correct: "Correcta", options: ["Correcta", "Loísmo", "Laísmo", "Leísmo"] },
];

const MODE_GROUPS = {
  completar: {
    pool: COMPLETAR_ENTRIES,
    field: "correct",
    question: () => "Completa correctamente el hueco:",
  },
  identificarerror: {
    pool: IDENTIFICARERROR_ENTRIES,
    field: "correct",
    question: () => "¿Qué tipo de error tiene esta oración (o está correcta)?",
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
  let mode = "completar";
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
