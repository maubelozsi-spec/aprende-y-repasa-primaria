// ============================================================
// Los signos de puntuación: banco de datos + lógica del quiz
// ============================================================

// Cada entrada pregunta por un uso concreto de un signo (no «qué signo
// destaca», que es ambiguo cuando la frase tiene varios) y explica la
// regla, que se ve al corregir y en el solucionario de la ficha.
// Comillas angulares « » y el punto detrás de las comillas de cierre,
// como recomienda la RAE.
const IDENTIFICAR_ENTRIES = [
  { pregunta: "¿Qué signo separa las dos oraciones, justo antes de «sin embargo»?", display: "Quería ir al cine; sin embargo, se quedó estudiando.", correct: "Punto y coma", options: ["Punto y coma", "Dos puntos", "Puntos suspensivos", "Raya"], explica: "une dos oraciones relacionadas delante de «sin embargo»" },
  { pregunta: "¿Qué signo separa las partes de la enumeración, que ya llevan comas?", display: "Cada grupo fue a un sitio: el primero, al museo; el segundo, al parque; el tercero, a la biblioteca.", correct: "Punto y coma", options: ["Punto y coma", "Dos puntos", "Paréntesis", "Puntos suspensivos"], explica: "separa los elementos de una enumeración cuando ya llevan comas" },
  { pregunta: "¿Qué signo muestra que la frase queda en duda, sin terminar?", display: "No sé si ir o quedarme...", correct: "Puntos suspensivos", options: ["Puntos suspensivos", "Punto y coma", "Comillas", "Raya"], explica: "dejan la frase incompleta y expresan duda" },
  { pregunta: "¿Qué signo crea suspense antes de la sorpresa?", display: "Y de repente... ¡se apagaron todas las luces!", correct: "Puntos suspensivos", options: ["Puntos suspensivos", "Raya", "Punto y coma", "Paréntesis"], explica: "hacen una pausa que crea suspense" },
  { pregunta: "¿Qué signo indica que la lista podría seguir?", display: "Compramos de todo: pan, leche, huevos, fruta...", correct: "Puntos suspensivos", options: ["Puntos suspensivos", "Punto y coma", "Comillas", "Paréntesis"], explica: "al final de una enumeración equivalen a «etcétera»" },
  { pregunta: "¿Qué signo encierra los años en que vivió Colón?", display: "Cristóbal Colón (1451-1506) llegó a América en 1492.", correct: "Paréntesis", options: ["Paréntesis", "Comillas", "Punto y coma", "Puntos suspensivos"], explica: "encierran una aclaración que se puede quitar sin cambiar el sentido" },
  { pregunta: "¿Qué signo encierra la aclaración de dónde está Granada?", display: "La Alhambra está en Granada (Andalucía).", correct: "Paréntesis", options: ["Paréntesis", "Comillas", "Raya", "Puntos suspensivos"], explica: "encierran un dato aclaratorio" },
  { pregunta: "¿Qué signo encierra las palabras exactas de la madre?", display: "Mi madre dijo: «Vuelve pronto a casa».", correct: "Comillas", options: ["Comillas", "Paréntesis", "Raya", "Punto y coma"], explica: "encierran una cita textual, las palabras exactas de alguien" },
  { pregunta: "¿Qué signo encierra el título del poema?", display: "Leímos el poema «Romance sonámbulo», de Federico García Lorca.", correct: "Comillas", options: ["Comillas", "Paréntesis", "Raya", "Puntos suspensivos"], explica: "encierran el título de un poema, un cuento o una canción" },
  { pregunta: "¿Qué signo indica que «ordenado» se dice en broma, con ironía?", display: "Dice que su cuarto está «ordenado», pero no se ve el suelo.", correct: "Comillas", options: ["Comillas", "Paréntesis", "Raya", "Punto y coma"], explica: "marcan una palabra usada con ironía o con un sentido especial" },
  { pregunta: "¿Qué signo marca lo que dice Ana y lo separa de las palabras del narrador?", display: "—¿Vienes al parque? —preguntó Ana.", correct: "Raya", options: ["Raya", "Comillas", "Paréntesis", "Puntos suspensivos"], explica: "en los diálogos introduce lo que dice cada personaje" },
  { pregunta: "¿Qué signo encierra la aclaración sobre la abuela?", display: "Mi abuela —que tiene noventa años— todavía monta en bici.", correct: "Raya", options: ["Raya", "Comillas", "Punto y coma", "Puntos suspensivos"], explica: "encierra una aclaración dentro de la oración, como los paréntesis" },
];

// Huecos con una pista entre paréntesis: en cada uno solo una de las
// opciones es correcta (por eso en el de Colón no se ofrece la raya,
// que también valdría para una aclaración).
const COMPLETAR_ENTRIES_SIGNOS_PUNTUACION = [
  { display: "Quería ir al cine ___ sin embargo, se quedó estudiando. (une dos oraciones relacionadas)", correct: ";", options: [";", "...", "( )", "« »"], explica: "punto y coma delante de «sin embargo»" },
  { display: "Cada grupo fue a un sitio: el primero, al museo ___ el segundo, al parque ___ el tercero, a la biblioteca. (separa partes que ya llevan comas)", correct: ";", options: [";", "...", "« »", "—"], explica: "punto y coma entre elementos que ya llevan comas" },
  { display: "No sabía qué decir ___ (la frase queda en suspense)", correct: "...", options: ["...", ";", "( )", "« »"], explica: "puntos suspensivos: la frase queda incompleta" },
  { display: "En la mochila llevo libros, cuadernos, lápices ___ (la lista podría seguir)", correct: "...", options: ["...", ";", "( )", "—"], explica: "puntos suspensivos al final de una enumeración abierta" },
  { display: "Cristóbal Colón ___1451-1506___ llegó a América. (aclaración de los años)", correct: "( )", options: ["( )", "« »", ";", "..."], explica: "paréntesis para un dato aclaratorio" },
  { display: "Ana dijo: ___Ya voy___. (palabras exactas de Ana)", correct: "« »", options: ["« »", "( )", "—", "..."], explica: "comillas para una cita textual; el punto va detrás" },
  { display: "En clase leímos la fábula ___La lechera___. (título de un texto corto)", correct: "« »", options: ["« »", "( )", "—", ";"], explica: "comillas para el título de un texto corto" },
  { display: "___¿Vienes? ___preguntó Juan. (diálogo: habla un personaje)", correct: "—", options: ["—", "« »", "( )", "..."], explica: "raya para marcar el diálogo" },
];

const MODE_GROUPS_SIGNOS_PUNTUACION = {
  identificar: {
    pool: IDENTIFICAR_ENTRIES,
    field: "correct",
    question: (e) => e.pregunta,
  },
  completar: {
    pool: COMPLETAR_ENTRIES_SIGNOS_PUNTUACION,
    field: "correct",
    question: () => "¿Qué signo hay que usar aquí?",
  },
};

// En la ficha la frase va entre comillas angulares, así que las
// comillas que ya tiene se pasan a inglesas (“ ”), como pide la RAE
// para entrecomillar dentro de un texto entrecomillado.
function signosParaFicha(entries) {
  return entries.map((e) => ({ ...e, displayFicha: e.display.replace(/«/g, "“").replace(/»/g, "”") }));
}

function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const SIGNOSPUNTUACION_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo identificar el signo (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo reconocer qué signo aparece en la frase, sin tener que elegir cuál usar.",
    example: "No sé si ir o quedarme... → puntos suspensivos",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para distinguir bien los signos.",
    example: "Mi madre dijo: «Vuelve pronto a casa». → comillas → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Identificar el signo» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo identificar el signo y ayuda extra",
    text: "Igual que en ACS, se trabaja solo reconocer el signo que aparece en la frase, dando más tiempo para pensar cada respuesta.",
    example: "—¿Vienes al parque? —preguntó Ana. → raya",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Elegir el signo correcto",
    text: "Se practica directamente con el contenido más exigente: decidir qué signo hay que <strong>usar</strong> en un hueco, según la regla.",
    example: "Cristóbal Colón ___1451-1506___ llegó a América. → ( )",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Qué signo encierra las palabras exactas de la madre? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, SIGNOSPUNTUACION_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), SIGNOSPUNTUACION_DIFFICULTY_EXPLANATIONS);

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
    card: document.getElementById("practica-signospuntuacion"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  const modeKeys = Object.keys(MODE_GROUPS_SIGNOS_PUNTUACION);
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "identificar";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "identificar";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "identificar"));
    } else if (diff.is("altas")) {
      mode = "completar";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "completar"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "identificar";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "identificar"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = MODE_GROUPS_SIGNOS_PUNTUACION[groupKey];
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

    els.instructions.textContent = group.question(entry) + (diff.is("discalculia") ? " Tómate tu tiempo." : "");
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
    AppProgress.record("signos-puntuacion", isCorrect);
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
    const regla = entry.explica ? ` La regla: ${entry.explica}.` : "";
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>Respuesta correcta: <strong>${correct}</strong>.${regla}</p>`;

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

registerLenguaFicha("signos-puntuacion", {
  label: "Los signos de puntuación",
  resumen: "El punto y coma une oraciones relacionadas; los puntos suspensivos dejan la frase en suspense o sin terminar; los paréntesis y la raya encierran aclaraciones; las comillas citan palabras exactas o títulos de textos cortos.",
  easyMode: "identificar",
  altasMode: "completar",
  pools: {
    identificar: { pool: signosParaFicha(IDENTIFICAR_ENTRIES), field: "correct", question: (e) => e.pregunta, displayField: "displayFicha", perEntryOptions: true, explainField: "explica" },
    completar: { pool: signosParaFicha(COMPLETAR_ENTRIES_SIGNOS_PUNTUACION), field: "correct", question: () => "¿Qué signo hay que usar aquí?", displayField: "displayFicha", perEntryOptions: true, explainField: "explica" },
  },
});
