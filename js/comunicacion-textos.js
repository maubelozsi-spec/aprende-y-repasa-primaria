// ============================================================
// Comunicación y tipos de texto: banco de datos + lógica del quiz
// ============================================================

const ELEMENTOS_ENTRIES = [
  { display: "La persona que escribe la carta", tipo: "Emisor" },
  { display: "El profesor que explica la lección", tipo: "Emisor" },
  { display: "La persona que lee la carta", tipo: "Receptor" },
  { display: "Los alumnos que escuchan la explicación", tipo: "Receptor" },
  { display: "Lo que dice la carta", tipo: "Mensaje" },
  { display: "El papel por el que viaja la carta escrita", tipo: "Canal" },
  { display: "El aire por el que viaja la voz al hablar", tipo: "Canal" },
  { display: "El idioma español en el que está escrita la carta", tipo: "Código" },
  { display: "El momento y el lugar en que se lee la carta", tipo: "Contexto" },
];

const VERBAL_NOVERBAL_ENTRIES = [
  { display: "Una señal de stop", tipo: "No verbal" },
  { display: "Una carta escrita", tipo: "Verbal" },
  { display: "Un gesto de saludo con la mano", tipo: "No verbal" },
  { display: "Una conversación por teléfono", tipo: "Verbal" },
  { display: "Un semáforo en rojo", tipo: "No verbal" },
  { display: "Un mensaje de texto", tipo: "Verbal" },
  { display: "Una sonrisa", tipo: "No verbal" },
  { display: "Un cartel con una flecha", tipo: "No verbal" },
  { display: "Un cuento leído en voz alta", tipo: "Verbal" },
];

const TIPO_TEXTO_ENTRIES = [
  { display: "«El pronóstico dice que mañana lloverá en el norte.»", tipo: "Predictivo" },
  { display: "«Se prevé un aumento de las temperaturas la próxima semana.»", tipo: "Predictivo" },
  { display: "«Creo que deberíamos reciclar más porque ayuda al planeta.»", tipo: "Argumentativo" },
  { display: "«Pienso que el uniforme escolar es buena idea porque evita desigualdades.»", tipo: "Argumentativo" },
  { display: "«El agua es un recurso natural formado por hidrógeno y oxígeno.»", tipo: "Expositivo" },
  { display: "«Los volcanes son aberturas en la corteza terrestre por donde sale magma.»", tipo: "Expositivo" },
  { display: "«Bate los huevos, añade la harina y hornea 20 minutos.»", tipo: "Instructivo" },
  { display: "«Corta las verduras, ponlas en la sartén y cocina 10 minutos.»", tipo: "Instructivo" },
  { display: "«Ayer se celebró un partido de fútbol en el estadio municipal.»", tipo: "Noticia" },
  { display: "«Un reportaje sobre la vida de los pingüinos, con entrevistas a científicos.»", tipo: "Reportaje" },
];

const MODE_GROUPS = {
  elementos: {
    pool: ELEMENTOS_ENTRIES,
    field: "tipo",
    question: () => "¿A qué elemento de la comunicación corresponde esto?",
    options: ["Emisor", "Receptor", "Mensaje", "Canal", "Código", "Contexto"],
  },
  verbalnoverbal: {
    pool: VERBAL_NOVERBAL_ENTRIES,
    field: "tipo",
    question: () => "¿Es lenguaje verbal o no verbal?",
    options: ["Verbal", "No verbal"],
  },
  tipotexto: {
    pool: TIPO_TEXTO_ENTRIES,
    field: "tipo",
    question: () => "¿Qué tipo de texto es este?",
    options: ["Predictivo", "Argumentativo", "Expositivo", "Instructivo", "Noticia", "Reportaje"],
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
  let mode = "elementos";
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
    AppProgress.record("comunicacion-textos", isCorrect);
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
