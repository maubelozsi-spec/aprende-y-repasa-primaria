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

// ¿Cuál está bien puntuada? Parejas con el error más frecuente de
// cada signo (normas de la Ortografía de la RAE).
const CORREGIR_ENTRIES = [
  { bien: "Mi madre dijo: «Vuelve pronto a casa».", mal: "Mi madre dijo: «Vuelve pronto a casa.»", explica: "el punto va detrás de las comillas de cierre, no dentro" },
  { bien: "No sé si ir o quedarme...", mal: "No sé si ir o quedarme....", explica: "los puntos suspensivos son siempre tres, ni más ni menos" },
  { bien: "Compramos pan, leche, huevos...", mal: "Compramos pan, leche, huevos, etc...", explica: "los puntos suspensivos ya significan «etcétera»: no se ponen los dos juntos" },
  { bien: "—¿Vienes al parque? —preguntó Ana.", mal: "—¿Vienes al parque?— preguntó Ana.", explica: "la raya que introduce las palabras del narrador va pegada a ellas («—preguntó»), separada por un espacio de lo que dice el personaje" },
  { bien: "Quería ir al cine; sin embargo, se quedó estudiando.", mal: "Quería ir al cine, sin embargo se quedó estudiando.", explica: "delante de «sin embargo», uniendo dos oraciones, va punto y coma, y detrás, coma" },
  { bien: "Cristóbal Colón (1451-1506) llegó a América.", mal: "Cristóbal Colón (1451-1506), llegó a América.", explica: "no se pone coma entre el sujeto (Cristóbal Colón) y el verbo (llegó), aunque haya un paréntesis" },
  { bien: "Mi abuela —que tiene noventa años— monta en bici.", mal: "Mi abuela —que tiene noventa años monta en bici.", explica: "una aclaración entre rayas necesita la raya de apertura y la de cierre" },
  { bien: "Leímos el poema «Romance sonámbulo».", mal: "Leímos el poema (Romance sonámbulo).", explica: "el título de un poema, cuento o canción va entre comillas, no entre paréntesis" },
  { bien: "Tengo tres hermanos: Ana, Luis y Pedro.", mal: "Tengo tres hermanos; Ana, Luis y Pedro.", explica: "delante de una enumeración que se anuncia van los dos puntos" },
  { bien: "¿Qué hora es?", mal: "Qué hora es?", explica: "en español las preguntas llevan signo de apertura (¿) y de cierre (?)" },
  { bien: "Hoy hace frío; mañana, dicen, hará sol.", mal: "Hoy hace frío, mañana, dicen, hará sol.", explica: "para separar dos oraciones relacionadas cuando ya hay comas se usa punto y coma" },
];

// Pistas: para qué sirve cada signo.
const PISTA_SIGNOS = "Piensa para qué sirve cada signo: unir oraciones relacionadas o separar partes con comas (;), dejar en suspense o sin terminar (...), añadir una aclaración (( ) o — —), citar palabras exactas o títulos (« ») y marcar el diálogo (—).";
const PISTA_CORREGIR = "Fíjate en los detalles: ¿el punto va dentro o fuera de las comillas? ¿Cuántos puntos suspensivos hay? ¿Se cierra la raya? ¿Hay una coma entre el sujeto y el verbo?";

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
  corregir: {
    pool: CORREGIR_ENTRIES.map((e) => ({ ...e, display: "", correct: e.bien, options: [e.bien, e.mal] })),
    field: "correct",
    question: () => "¿Cuál está bien puntuada?",
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
    title: "Mismo nivel que la clase",
    text: "La discalculia afecta al cálculo y al sentido del número, no a la lengua: aquí se practica el mismo contenido que el resto de la clase. Si además hay dificultades de lectura, usa la adaptación de dislexia.",
    example: "Mismas preguntas y mismos pasos que sin adaptación",
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

  if (document.getElementById("sp-signos")) initExplore();
  if (document.getElementById("word-display")) initGame(diff, (fn) => restartCallbacks.push(fn));
});

// ============================================================
// EXPLORA
// ============================================================
const SIGNOS_EXPLORA = [
  // error: posición en CORREGIR_ENTRIES del error típico de ese signo.
  { id: "Punto y coma", simbolo: ";", error: 4 },
  { id: "Puntos suspensivos", simbolo: "...", error: 1 },
  { id: "Paréntesis", simbolo: "( )", error: 5 },
  { id: "Comillas", simbolo: "« »", error: 0 },
  { id: "Raya", simbolo: "—", error: 3 },
];

function initExplore() {
  let signo = "Punto y coma";
  const cont = document.getElementById("sp-signos");
  cont.innerHTML = SIGNOS_EXPLORA.map((x) => `<button type="button" class="btn btn-secondary" data-sp="${x.id}"><strong>${x.simbolo}</strong> ${x.id.toLowerCase()}</button>`).join("");
  function renderSigno() {
    cont.querySelectorAll("[data-sp]").forEach((b) => b.classList.toggle("active", b.dataset.sp === signo));
    const usos = IDENTIFICAR_ENTRIES.filter((e) => e.correct === signo);
    const errores = [CORREGIR_ENTRIES[SIGNOS_EXPLORA.find((x) => x.id === signo).error]];
    document.getElementById("sp-usos").innerHTML = usos.map((e) => `<p><strong>Sirve para:</strong> ${e.explica}.<br><span class="examples">${e.display}</span></p>`).join("") +
      (errores.length ? `<p><strong>Cuidado:</strong> ${errores[0].explica}.<br><span class="examples">Bien: ${errores[0].bien}<br>Mal: ${errores[0].mal}</span></p>` : "");
  }
  cont.querySelectorAll("[data-sp]").forEach((b) => b.addEventListener("click", () => { signo = b.dataset.sp; renderSigno(); }));
  renderSigno();

  // Una aclaración, tres maneras.
  const FORMAS = {
    comas: { txt: "Mi abuela, que tiene noventa años, todavía monta en bici.", exp: "Con <strong>comas</strong>, la aclaración se lee dentro de la oración, como una parte más." },
    parentesis: { txt: "Mi abuela (que tiene noventa años) todavía monta en bici.", exp: "Con <strong>paréntesis</strong>, la aclaración queda más apartada: es un dato que se podría quitar sin que se note." },
    rayas: { txt: "Mi abuela —que tiene noventa años— todavía monta en bici.", exp: "Con <strong>rayas</strong>, la aclaración se separa más que con comas y se destaca: llama la atención." },
  };
  let forma = "comas";
  function renderForma() {
    document.querySelectorAll("[data-sp-forma]").forEach((b) => b.classList.toggle("active", b.dataset.spForma === forma));
    document.getElementById("sp-frase").textContent = FORMAS[forma].txt;
    document.getElementById("sp-forma-msg").innerHTML = `${FORMAS[forma].exp} Si quitas la aclaración, la oración sigue teniendo sentido: «Mi abuela todavía monta en bici».`;
  }
  document.querySelectorAll("[data-sp-forma]").forEach((b) => b.addEventListener("click", () => { forma = b.dataset.spForma; renderForma(); }));
  renderForma();
}

function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = {
    teoria: document.getElementById("tab-teoria"),
    explora: document.getElementById("tab-explora"),
    practica: document.getElementById("tab-practica"),
  };
  if (tabBtns.length === 0) return;

  function activateTab(name) {
    tabBtns.forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
    Object.entries(panels).forEach(([key, el]) => el && el.classList.toggle("active", key === name));
  }

  tabBtns.forEach((btn) => btn.addEventListener("click", () => activateTab(btn.dataset.tab)));

  ["go-to-practice", "go-to-practice-2"].forEach((id) => {
    const goBtn = document.getElementById(id);
    if (goBtn) goBtn.addEventListener("click", () => activateTab("practica"));
  });
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
    hintBtn: document.getElementById("hint-btn"),
    hintBox: document.getElementById("hint-box"),
  };

  const modeKeys = Object.keys(MODE_GROUPS_SIGNOS_PUNTUACION);
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "identificar";
  let current;
  let lastDisplay = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs");
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
    } while (group.pool.length > 1 && (entry.display || entry.correct) === lastDisplay);
    lastDisplay = entry.display || entry.correct;
    return { entry, group };
  }

  function startRound() {
    current = pickQuestion();
    const { entry, group } = current;

    els.instructions.textContent = group.question(entry);
    els.wordDisplay.textContent = entry.display;
    els.wordDisplay.style.display = entry.display ? "" : "none";
    els.hintBox.classList.remove("show");
    els.hintBox.innerHTML = "";
    els.hintBtn.disabled = false;

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    const correct = entry[group.field];
    const options = shuffle(entry.options.slice());

    els.answerButtons.innerHTML = "";
    els.answerButtons.classList.toggle("sp-frases", group === MODE_GROUPS_SIGNOS_PUNTUACION.corregir);
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

    els.hintBtn.disabled = true;
    const titleText = isCorrect ? "Correcto" : "No era esa";

    els.feedback.classList.add("show", isCorrect ? "ok" : "ko");
    const regla = entry.explica ? ` La regla: ${entry.explica}.` : "";
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>Respuesta correcta: <strong>${correct}</strong>${/[.?!»]$/.test(correct) ? "" : "."}${regla}</p>`;

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
  els.hintBtn.addEventListener("click", () => {
    els.hintBox.innerHTML = `<strong>Pista:</strong> ${current.group === MODE_GROUPS_SIGNOS_PUNTUACION.corregir ? PISTA_CORREGIR : PISTA_SIGNOS}`;
    els.hintBox.classList.add("show");
  });

  applyDifficultyUI();
  startRound();
}

registerLenguaFicha("signos-puntuacion", {
  label: "Los signos de puntuación",
  resumen: "El punto y coma une oraciones relacionadas; los puntos suspensivos dejan la frase en suspense o sin terminar; los paréntesis y la raya encierran aclaraciones; las comillas citan palabras exactas o títulos de textos cortos.",
  easyMode: "identificar",
  defaultMode: ["identificar", "completar", "corregir"],
  altasMode: "corregir",
  pools: {
    identificar: { pool: signosParaFicha(IDENTIFICAR_ENTRIES), field: "correct", question: (e) => e.pregunta, displayField: "displayFicha", perEntryOptions: true, explainField: "explica" },
    completar: { pool: signosParaFicha(COMPLETAR_ENTRIES_SIGNOS_PUNTUACION), field: "correct", question: () => "¿Qué signo hay que usar aquí?", displayField: "displayFicha", perEntryOptions: true, explainField: "explica" },
    corregir: {
      pool: CORREGIR_ENTRIES.map((e) => ({ ...e, ab: Math.random() < 0.5 ? [e.bien, e.mal] : [e.mal, e.bien] })),
      field: "bien",
      question: (e) => `¿Cuál está bien puntuada? Rodéala y explica el error de la otra. a) ${e.ab[0]}   b) ${e.ab[1]}`,
      selfContained: true,
      answerFn: (e) => `${e.ab[0] === e.bien ? "a" : "b"}) ${e.bien} En la otra, ${e.explica}.`,
      optionsFn: (e) => ["a", "b"],
    },
  },
});
