// ============================================================
// Lenguaje literal y figurado: banco de datos + lógica del quiz
// ============================================================

const LITERALFIGURADO_ENTRIES = [
  { display: "Llueve mucho hoy.", correct: "Literal", options: ["Literal", "Figurado"] },
  { display: "Está lloviendo a cántaros.", correct: "Figurado", options: ["Figurado", "Literal"] },
  { display: "Tiene la cabeza en las nubes.", correct: "Figurado", options: ["Figurado", "Literal"] },
  { display: "El avión vuela sobre las nubes.", correct: "Literal", options: ["Literal", "Figurado"] },
  { display: "Me costó un ojo de la cara.", correct: "Figurado", options: ["Figurado", "Literal"] },
  { display: "Se golpeó el ojo con la puerta.", correct: "Literal", options: ["Literal", "Figurado"] },
  { display: "Está que echa chispas.", correct: "Figurado", options: ["Figurado", "Literal"] },
  { display: "El cable eléctrico echa chispas.", correct: "Literal", options: ["Literal", "Figurado"] },
];

const FRASEHECHA_ENTRIES = [
  { display: "Costar un ojo de la cara", correct: "Ser muy caro", options: ["Ser muy caro", "Ser barato", "Doler mucho", "Estar cansado"] },
  { display: "Tomar el pelo", correct: "Burlarse o bromear", options: ["Burlarse o bromear", "Peinarse", "Enfadarse", "Despedirse"] },
  { display: "Estar en las nubes", correct: "Estar distraído", options: ["Estar distraído", "Estar feliz", "Estar volando", "Estar cansado"] },
  { display: "Ponerse las pilas", correct: "Esforzarse, ponerse a trabajar", options: ["Esforzarse, ponerse a trabajar", "Descansar", "Enfadarse", "Cargar el móvil"] },
  { display: "No dar pie con bola", correct: "Equivocarse mucho", options: ["Equivocarse mucho", "Jugar al fútbol", "Acertar siempre", "Caminar rápido"] },
  { display: "Estar como una cabra", correct: "Estar un poco loco", options: ["Estar un poco loco", "Estar tranquilo", "Ser fuerte", "Ser inteligente"] },
];

const HOMONIMIA_ENTRIES = [
  { display: "vaca / baca", correct: "Homófonas", options: ["Homófonas", "Homógrafas"] },
  { display: "banco (asiento) / banco (entidad financiera)", correct: "Homógrafas", options: ["Homógrafas", "Homófonas"] },
  { display: "hola / ola", correct: "Homófonas", options: ["Homófonas", "Homógrafas"] },
  { display: "vino (bebida) / vino (del verbo venir)", correct: "Homógrafas", options: ["Homógrafas", "Homófonas"] },
  { display: "tubo / tuvo", correct: "Homófonas", options: ["Homófonas", "Homógrafas"] },
  { display: "gato (animal) / gato (herramienta del coche)", correct: "Homógrafas", options: ["Homógrafas", "Homófonas"] },
  { display: "botar / votar", correct: "Homófonas", options: ["Homófonas", "Homógrafas"] },
];

const MODE_GROUPS = {
  literalfigurado: {
    pool: LITERALFIGURADO_ENTRIES,
    field: "correct",
    question: () => "¿Es lenguaje literal o figurado?",
  },
  frasehecha: {
    pool: FRASEHECHA_ENTRIES,
    field: "correct",
    question: () => "¿Qué significa esta frase hecha?",
  },
  homonimia: {
    pool: HOMONIMIA_ENTRIES,
    field: "correct",
    question: () => "¿Son homófonas u homógrafas?",
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
  let mode = "literalfigurado";
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
