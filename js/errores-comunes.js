// ============================================================
// Errores ortográficos comunes: banco de datos + lógica del quiz
// ============================================================

const PORQUE_ENTRIES = [
  { display: "No vino a clase ___ estaba enfermo.", correct: "porque", options: ["porque", "por qué", "porqué"] },
  { display: "¿___ no viniste ayer a la excursión?", correct: "por qué", options: ["por qué", "porque", "porqué"] },
  { display: "Nadie entendía el ___ de su enfado.", correct: "porqué", options: ["porqué", "porque", "por qué"] },
  { display: "Llegamos tarde ___ había mucho tráfico.", correct: "porque", options: ["porque", "por qué", "porqué"] },
  { display: "Dime ___ estás tan contento hoy.", correct: "por qué", options: ["por qué", "porque", "porqué"] },
  { display: "No entendemos el ___ de tu decisión.", correct: "porqué", options: ["porqué", "porque", "por qué"] },
];

const AVER_ENTRIES = [
  { display: "Vamos ___ qué pasa en el jardín.", correct: "a ver", options: ["a ver", "haber"] },
  { display: "Debe de ___ una solución fácil.", correct: "haber", options: ["haber", "a ver"] },
  { display: "Voy ___ si encuentro las llaves.", correct: "a ver", options: ["a ver", "haber"] },
  { display: "Tiene que ___ alguien en casa.", correct: "haber", options: ["haber", "a ver"] },
  { display: "¡___ quién llega primero a la meta!", correct: "A ver", options: ["A ver", "Haber"] },
  { display: "Puede ___ más de cien invitados en la boda.", correct: "haber", options: ["haber", "a ver"] },
];

const HAY_ENTRIES = [
  { display: "___ mucha gente en el mercado hoy.", correct: "Hay", options: ["Hay", "Ahí", "Ay"] },
  { display: "Deja el libro ___, encima de la mesa.", correct: "ahí", options: ["ahí", "hay", "ay"] },
  { display: "¡___, me he hecho daño en el dedo!", correct: "Ay", options: ["Ay", "Hay", "Ahí"] },
  { display: "No ___ nadie en la biblioteca a esta hora.", correct: "hay", options: ["hay", "ahí", "ay"] },
  { display: "El gato se escondió ___ detrás.", correct: "ahí", options: ["ahí", "hay", "ay"] },
  { display: "¿Cuántos cachorros ___ en el establo?", correct: "hay", options: ["hay", "ahí", "ay"] },
];

const SINO_ENTRIES = [
  { display: "No quiero té, ___ café.", correct: "sino", options: ["sino", "si no"] },
  { display: "___ terminas los deberes, no podrás salir a jugar.", correct: "Si no", options: ["Si no", "Sino"] },
  { display: "No fue Hugo ___ Nora quien lo hizo.", correct: "sino", options: ["sino", "si no"] },
  { display: "___ llueve mañana, iremos de excursión.", correct: "Si no", options: ["Si no", "Sino"] },
  { display: "No es que no quiera, ___ que no puedo.", correct: "sino", options: ["sino", "si no"] },
  { display: "Avísame ___ vienes a la fiesta.", correct: "si no", options: ["si no", "sino"] },
];

const TAMBIEN_ENTRIES = [
  { display: "A mí ___ me gusta el chocolate.", correct: "también", options: ["también", "tan bien"] },
  { display: "Canta ___ que parece profesional.", correct: "tan bien", options: ["tan bien", "también"] },
  { display: "Yo ___ quiero venir a la excursión.", correct: "también", options: ["también", "tan bien"] },
  { display: "Juega al fútbol ___ como su hermano mayor.", correct: "tan bien", options: ["tan bien", "también"] },
  { display: "Nora ___ sabe montar en bici.", correct: "también", options: ["también", "tan bien"] },
  { display: "Lo explicó ___ que todos lo entendieron.", correct: "tan bien", options: ["tan bien", "también"] },
];

const AUN_ENTRIES = [
  { display: "___ no ha llegado el autobús.", correct: "Aún", options: ["Aún", "Aun"] },
  { display: "Iré a la fiesta, ___ si llueve.", correct: "aun", options: ["aun", "aún"] },
  { display: "___ es de día, pero pronto oscurecerá.", correct: "Aún", options: ["Aún", "Aun"] },
  { display: "Terminó el trabajo ___ estando enfermo.", correct: "aun", options: ["aun", "aún"] },
  { display: "¿___ sigues despierto a estas horas?", correct: "Aún", options: ["Aún", "Aun"] },
  { display: "Le gustan todos los animales, ___ las arañas.", correct: "aun", options: ["aun", "aún"] },
];

const HALLA_ENTRIES = [
  { display: "Espero que Hugo ___ terminado los deberes.", correct: "haya", options: ["haya", "halla"] },
  { display: "El explorador ___ un tesoro escondido.", correct: "halla", options: ["halla", "haya"] },
  { display: "No creo que ___ ningún problema con el plan.", correct: "haya", options: ["haya", "halla"] },
  { display: "Por fin se ___ la solución del misterio.", correct: "halla", options: ["halla", "haya"] },
  { display: "Ojalá ___ traído el paraguas.", correct: "haya", options: ["haya", "halla"] },
  { display: "Cuando se ___ perdido, siempre pregunta.", correct: "halla", options: ["halla", "haya"] },
];

const YEO_ENTRIES = [
  { display: "Diana ___ Irene son hermanas.", correct: "e", options: ["e", "y"] },
  { display: "Pablo ___ Marta cocinaron juntos.", correct: "y", options: ["y", "e"] },
  { display: "Padres ___ hijos disfrutaron del espectáculo.", correct: "e", options: ["e", "y"] },
  { display: "Ese perro ___ aquel gato siempre pelean.", correct: "y", options: ["y", "e"] },
  { display: "Vicente ___ Óscar llegaron tarde.", correct: "u", options: ["u", "o"] },
  { display: "Siete ___ ocho son quince.", correct: "u", options: ["u", "o"] },
  { display: "¿Prefieres plata ___ oro?", correct: "u", options: ["u", "o"] },
  { display: "Ayer ___ hoy hemos jugado en el parque.", correct: "u", options: ["u", "o"] },
];

const MODE_GROUPS = {
  porque: { pool: PORQUE_ENTRIES, field: "correct", question: () => "Elige la forma correcta:" },
  aver: { pool: AVER_ENTRIES, field: "correct", question: () => "Elige la forma correcta:" },
  hay: { pool: HAY_ENTRIES, field: "correct", question: () => "Elige la forma correcta:" },
  sino: { pool: SINO_ENTRIES, field: "correct", question: () => "Elige la forma correcta:" },
  tambien: { pool: TAMBIEN_ENTRIES, field: "correct", question: () => "Elige la forma correcta:" },
  aun: { pool: AUN_ENTRIES, field: "correct", question: () => "Elige la forma correcta:" },
  halla: { pool: HALLA_ENTRIES, field: "correct", question: () => "Elige la forma correcta:" },
  yeo: { pool: YEO_ENTRIES, field: "correct", question: () => "Elige la conjunción correcta:" },
};

function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const ERRORES_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo hay / ahí / ay (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo la confusión más concreta y fácil de reconocer por su significado: hay (existencia), ahí (lugar) y ay (queja).",
    example: "«Hay mucha gente» → hay",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las frases con el hueco.",
    example: "«Deja el libro ___» → ahí → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de confusión cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de confusión y mantener mejor la atención.",
    example: "Solo preguntas de «Porque / por qué» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo hay / ahí / ay y ayuda extra",
    text: "Igual que en ACS, se trabaja solo la confusión hay/ahí/ay, dando más tiempo para pensar cada respuesta.",
    example: "«¡Ay, me he hecho daño!» → ay",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Porque / por qué / porqué",
    text: "Se practica directamente con la confusión más exigente: distinguir <strong>porque</strong>, <strong>por qué</strong> y <strong>el porqué</strong>.",
    example: "«Nadie entendía el ___ de su enfado» → porqué",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "Elige la forma correcta → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, ERRORES_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), ERRORES_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-errores"),
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
  let mode = "porque";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "hay";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "hay"));
    } else if (diff.is("altas")) {
      mode = "porque";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "porque"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "porque";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "porque"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

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

    els.instructions.textContent = group.question() + (diff.is("discalculia") ? " Tómate tu tiempo." : "");
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
    AppProgress.record("errores-comunes", isCorrect);
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
