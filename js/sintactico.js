// ============================================================
// Análisis sintáctico: banco de oraciones + lógica del artefacto
// ============================================================

const SENTENCES = [
  // ---- Sujeto omitido ----
  { words: ["Vamos", "al", "cine", "esta", "tarde"], subject: { omitted: true }, predicateType: "verbal", complements: ["CC"] },
  { words: ["Comen", "pizza", "los", "sábados"], subject: { omitted: true }, predicateType: "verbal", complements: ["CD", "CC"] },
  { words: ["Como", "manzanas", "todos", "los", "días"], subject: { omitted: true }, predicateType: "verbal", complements: ["CD", "CC"] },
  { words: ["Duermo", "ocho", "horas", "cada", "noche"], subject: { omitted: true }, predicateType: "verbal", complements: ["CC"] },
  { words: ["Sonríes", "siempre"], subject: { omitted: true }, predicateType: "verbal", complements: ["CC"] },
  { words: ["Escribo", "un", "mensaje", "a", "mi", "profesora"], subject: { omitted: true }, predicateType: "verbal", complements: ["CD", "CI"] },

  // ---- Predicado nominal ----
  { words: ["El", "cielo", "está", "nublado"], subject: { indices: [0, 1] }, predicateType: "nominal", atributo: "nublado" },
  { words: ["Mi", "madre", "es", "profesora"], subject: { indices: [0, 1] }, predicateType: "nominal", atributo: "profesora" },
  { words: ["Los", "estudiantes", "parecen", "cansados"], subject: { indices: [0, 1] }, predicateType: "nominal", atributo: "cansados" },
  { words: ["Este", "ejercicio", "es", "muy", "difícil"], subject: { indices: [0, 1] }, predicateType: "nominal", atributo: "muy difícil" },
  { words: ["Esta", "sopa", "está", "deliciosa"], subject: { indices: [0, 1] }, predicateType: "nominal", atributo: "deliciosa" },

  // ---- Predicado verbal, sujeto expreso ----
  { words: ["El", "perro", "ladra", "mucho"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CC"] },
  { words: ["Los", "niños", "juegan", "en", "el", "parque"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CC"] },
  { words: ["María", "compra", "un", "regalo"], subject: { indices: [0] }, predicateType: "verbal", complements: ["CD"] },
  { words: ["Mi", "hermano", "escribe", "una", "carta", "a", "su", "amigo"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CD", "CI"] },
  { words: ["Ana", "y", "Luis", "viven", "en", "Madrid"], subject: { indices: [0, 1, 2] }, predicateType: "verbal", complements: ["CC"] },
  { words: ["Pedro", "regala", "flores", "a", "su", "abuela"], subject: { indices: [0] }, predicateType: "verbal", complements: ["CD", "CI"] },
  { words: ["Los", "pájaros", "vuelan", "alto"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CC"] },
  { words: ["El", "profesor", "explica", "la", "lección", "con", "paciencia"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CD", "CC"] },
  { words: ["Mis", "padres", "compran", "fruta", "en", "el", "mercado"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CD", "CC"] },
  { words: ["El", "agua", "hierve", "a", "cien", "grados"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CC"] },
  { words: ["Nosotros", "estudiamos", "inglés", "los", "lunes"], subject: { indices: [0] }, predicateType: "verbal", complements: ["CD", "CC"] },
  { words: ["El", "pastel", "huele", "muy", "bien"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CC"] },
  { words: ["Los", "abuelos", "cuentan", "historias", "a", "los", "nietos"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CD", "CI"] },
  { words: ["El", "tren", "llega", "tarde"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CC"] },
  { words: ["Mi", "vecino", "riega", "las", "plantas", "por", "la", "mañana"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CD", "CC"] },

  // ---- Predicado verbal sin complementos ----
  { words: ["Los", "pájaros", "cantan"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: [] },
  { words: ["El", "bebé", "duerme"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: [] },
  { words: ["Mi", "perro", "ladra"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: [] },
];

const TIPO_ORACION_ENTRIES = [
  { sentence: "Hace frío.", tipo: "Enunciativa" },
  { sentence: "El perro ladra en el jardín.", tipo: "Enunciativa" },
  { sentence: "No me gusta el pescado.", tipo: "Enunciativa" },
  { sentence: "¿Hace frío?", tipo: "Interrogativa" },
  { sentence: "¿Vienes a la fiesta?", tipo: "Interrogativa" },
  { sentence: "¡Qué frío hace!", tipo: "Exclamativa" },
  { sentence: "¡Qué alegría verte!", tipo: "Exclamativa" },
  { sentence: "Abrígate.", tipo: "Imperativa" },
  { sentence: "Cierra la puerta.", tipo: "Imperativa" },
  { sentence: "Ojalá no haga frío.", tipo: "Desiderativa" },
  { sentence: "Ojalá apruebe el examen.", tipo: "Desiderativa" },
  { sentence: "Quizás haga frío.", tipo: "Dubitativa" },
  { sentence: "Tal vez llueva mañana.", tipo: "Dubitativa" },
];

const VOZ_ENTRIES = [
  { sentence: "El perro muerde la pelota.", voz: "Activa" },
  { sentence: "La pelota es mordida por el perro.", voz: "Pasiva" },
  { sentence: "María escribe la carta.", voz: "Activa" },
  { sentence: "La carta es escrita por María.", voz: "Pasiva" },
  { sentence: "El gato caza al ratón.", voz: "Activa" },
  { sentence: "El ratón es cazado por el gato.", voz: "Pasiva" },
  { sentence: "Los alumnos hacen los deberes.", voz: "Activa" },
  { sentence: "Los deberes son hechos por los alumnos.", voz: "Pasiva" },
];

const ELIPSIS_ENTRIES = [
  { sentence: "Vamos al cine.", omitidoLabel: "Sí" },
  { sentence: "Los niños juegan.", omitidoLabel: "No" },
  { sentence: "Como fruta.", omitidoLabel: "Sí" },
  { sentence: "Ella canta muy bien.", omitidoLabel: "No" },
  { sentence: "Llegamos tarde.", omitidoLabel: "Sí" },
  { sentence: "El sol brilla.", omitidoLabel: "No" },
  { sentence: "Estudiamos mucho.", omitidoLabel: "Sí" },
  { sentence: "Mi hermano cocina bien.", omitidoLabel: "No" },
];

const ATRIBUTO_ENTRIES = [
  { sentence: "El cielo está nublado.", correct: "nublado", options: ["nublado", "El cielo", "está", "cielo"] },
  { sentence: "Mi madre es profesora.", correct: "profesora", options: ["profesora", "Mi madre", "es", "madre"] },
  { sentence: "Los estudiantes parecen cansados.", correct: "cansados", options: ["cansados", "Los estudiantes", "parecen", "estudiantes"] },
  { sentence: "Este ejercicio es muy difícil.", correct: "muy difícil", options: ["muy difícil", "difícil", "Este ejercicio", "es"] },
  { sentence: "Esta sopa está deliciosa.", correct: "deliciosa", options: ["deliciosa", "Esta sopa", "está", "sopa"] },
  { sentence: "El examen parece bastante fácil.", correct: "bastante fácil", options: ["bastante fácil", "fácil", "El examen", "parece"] },
];

const SECONDARY_MODE_GROUPS = {
  tipo: {
    pool: TIPO_ORACION_ENTRIES,
    field: "tipo",
    question: () => "¿Qué tipo de oración es esta?",
    options: ["Enunciativa", "Interrogativa", "Exclamativa", "Imperativa", "Desiderativa", "Dubitativa"],
  },
  voz: {
    pool: VOZ_ENTRIES,
    field: "voz",
    question: () => "¿Esta oración está en voz activa o pasiva?",
    options: ["Activa", "Pasiva"],
  },
  elipsis: {
    pool: ELIPSIS_ENTRIES,
    field: "omitidoLabel",
    question: () => "¿Tiene el sujeto omitido (elíptico) esta oración?",
    options: ["Sí", "No"],
  },
  atributo: {
    pool: ATRIBUTO_ENTRIES,
    field: "correct",
    question: () => "¿Cuál es el atributo de esta oración?",
    options: null,
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

function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

const SINTACTICO_EASY_SENTENCES = SENTENCES.filter((s) => (s.complements || []).length <= 1);
const SINTACTICO_ALTAS_SENTENCES = SENTENCES.filter((s) => (s.complements || []).length >= 2);

const SINTACTICO_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Oraciones más sencillas y menos opciones",
    text: "Para el alumnado con adaptación curricular significativa se usan oraciones con como mucho un complemento, y en el segundo juego se practica solo si el sujeto está omitido o no.",
    example: "«El perro ladra mucho.» → sujeto: el perro · predicado verbal · CC",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido en los dos juegos, pero con una tipografía más legible.",
    example: "«María compra un regalo.» → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "El primer juego (sujeto, predicado y complementos) ya presenta un solo paso cada vez. En el segundo juego se practica sin el modo «Mezcla», para mantener mejor la atención.",
    example: "Solo preguntas de «Sujeto elíptico» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Oraciones más sencillas y ayuda extra",
    text: "Igual que en ACS, se usan oraciones con como mucho un complemento y se simplifica el segundo juego, dando más tiempo para pensar cada paso.",
    example: "«Los pájaros vuelan alto.» → sujeto: los pájaros · predicado verbal · CC",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Oraciones con dos complementos y el atributo",
    text: "Se practica con las oraciones que llevan dos complementos a la vez (CD y CI, o CD y CC), y en el segundo juego se identifica el atributo con precisión, el contenido más abstracto de 6º.",
    example: "«Pedro regala flores a su abuela.» → CD y CI a la vez",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde pulsando, sin escribir",
    text: "Los dos juegos ya funcionan pulsando palabras, botones y chips de opción, así que no hace falta ningún cambio: no requieren escribir nada.",
    example: "Selecciona las palabras del sujeto pulsándolas → sin necesidad de escribir",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, SINTACTICO_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), SINTACTICO_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("word-tokens")) {
    initGame(diff, (fn) => restartCallbacks.push(fn));
  }
  if (document.getElementById("quiz-answer-buttons")) {
    initSecondaryQuiz(diff, (fn) => restartCallbacks.push(fn));
  }
  initPracticaModePicker();
});

function initPracticaModePicker() {
  const picker = document.getElementById("practica-mode-picker");
  if (!picker) return;
  const btns = picker.querySelectorAll("[data-pmode]");
  const panels = {
    analisis: document.getElementById("practica-analisis"),
    quiz: document.getElementById("practica-quiz"),
  };

  function setMode(pmode) {
    Object.entries(panels).forEach(([key, el]) => {
      if (el) el.style.display = key === pmode ? "" : "none";
    });
    btns.forEach((b) => b.classList.toggle("active", b.dataset.pmode === pmode));
  }

  btns.forEach((btn) => btn.addEventListener("click", () => setMode(btn.dataset.pmode)));
  setMode("analisis");
}

function initSecondaryQuiz(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-quiz"),
    modeBtns: document.querySelectorAll("#quiz-mode-picker [data-mode]"),
    instructions: document.getElementById("quiz-instructions"),
    sentenceDisplay: document.getElementById("quiz-sentence"),
    answerButtons: document.getElementById("quiz-answer-buttons"),
    feedback: document.getElementById("quiz-feedback"),
    nextBtn: document.getElementById("quiz-next"),
    scoreOk: document.getElementById("score-ok-2"),
    scoreKo: document.getElementById("score-ko-2"),
  };

  const modeKeys = Object.keys(SECONDARY_MODE_GROUPS);
  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "tipo";
  let current;
  let lastSentence = "";

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.modeBtns.forEach((b) => (b.disabled = easyOnly));

    const mezclaBtn = [...els.modeBtns].find((b) => b.dataset.mode === "mezcla");
    if (mezclaBtn) mezclaBtn.disabled = easyOnly || diff.is("tdah");

    if (easyOnly) {
      mode = "elipsis";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "elipsis"));
    } else if (diff.is("altas")) {
      mode = "atributo";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "atributo"));
    } else if (diff.is("tdah") && mode === "mezcla") {
      mode = "elipsis";
      els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === "elipsis"));
    }

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startQuizRound();
  });

  function pickQuestion() {
    const groupKey = mode === "mezcla" ? modeKeys[Math.floor(Math.random() * modeKeys.length)] : mode;
    const group = SECONDARY_MODE_GROUPS[groupKey];
    let entry;
    do {
      entry = group.pool[Math.floor(Math.random() * group.pool.length)];
    } while (group.pool.length > 1 && entry.sentence === lastSentence);
    lastSentence = entry.sentence;
    return { entry, group };
  }

  function startQuizRound() {
    current = pickQuestion();

    els.instructions.textContent = current.group.question() + (diff.is("discalculia") ? " Tómate tu tiempo." : "");
    els.sentenceDisplay.textContent = current.entry.sentence;

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    const correct = current.entry[current.group.field];
    let options = (current.entry.options || current.group.options).slice();
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
      btn.addEventListener("click", () => chooseQuizAnswer(opt, btn));
      els.answerButtons.appendChild(btn);
    });
  }

  function chooseQuizAnswer(chosen, btn) {
    const correct = current.entry[current.group.field];
    const isCorrect = chosen === correct;

    if (isCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("sintactico", isCorrect);
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
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>Respuesta: <strong>${correct}</strong>.</p>`;

    els.nextBtn.style.display = "";
  }

  els.modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      els.modeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      mode = btn.dataset.mode;
      startQuizRound();
    });
  });

  els.nextBtn.addEventListener("click", startQuizRound);

  applyDifficultyUI();
  startQuizRound();
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

function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-analisis"),
    stepSubject: document.getElementById("step-subject"),
    stepPredtype: document.getElementById("step-predtype"),
    stepComplements: document.getElementById("step-complements"),
    wordTokens: document.getElementById("word-tokens"),
    omittedToggle: document.getElementById("omitted-toggle"),
    checkSubjectBtn: document.getElementById("check-subject"),
    sentenceAfterSubject: document.getElementById("sentence-after-subject"),
    ptButtons: document.querySelectorAll("#step-predtype [data-pt]"),
    compChips: document.querySelectorAll("#complement-chips [data-comp]"),
    checkComplementsBtn: document.getElementById("check-complements"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-sentence"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
    progressFill: document.getElementById("progress-fill"),
    instructionEls: document.querySelectorAll("#practica-analisis .instructions"),
  };

  const originalInstructions = [...els.instructionEls].map((el) => el.textContent);

  let scoreOk = 0;
  let scoreKo = 0;
  let lastSentence = null;
  let current, selected, omitted, subjectAttempts, roundOk;
  let chosenComplements = new Set();

  function pool() {
    if (diff.is("acs") || diff.is("discalculia")) return SINTACTICO_EASY_SENTENCES;
    if (diff.is("altas")) return SINTACTICO_ALTAS_SENTENCES;
    return SENTENCES;
  }

  function applyDifficultyUI() {
    els.instructionEls.forEach((el, i) => {
      el.textContent = originalInstructions[i] + (diff.is("discalculia") ? " Tómate tu tiempo." : "");
    });
    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickSentence() {
    const source = pool();
    let entry;
    do {
      entry = source[Math.floor(Math.random() * source.length)];
    } while (source.length > 1 && entry === lastSentence);
    lastSentence = entry;
    return entry;
  }

  function setProgress(percent) {
    els.progressFill.style.width = percent + "%";
  }

  function clearFeedback() {
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
  }

  function showTempMessage(msg) {
    els.feedback.classList.add("show");
    els.feedback.classList.remove("ok", "ko");
    els.feedback.innerHTML = `<p>${msg}</p>`;
  }

  function renderTokens(locked) {
    els.wordTokens.innerHTML = "";
    current.words.forEach((word, i) => {
      const chip = document.createElement("button");
      chip.className = "syllable-chip" + (selected.has(i) ? " selected" : "");
      chip.textContent = word;
      if (!locked) {
        chip.addEventListener("click", () => {
          if (omitted) return;
          if (selected.has(i)) selected.delete(i);
          else selected.add(i);
          chip.classList.toggle("selected", selected.has(i));
        });
      } else {
        chip.disabled = true;
      }
      els.wordTokens.appendChild(chip);
    });
  }

  function startRound() {
    current = pickSentence();
    selected = new Set();
    omitted = false;
    subjectAttempts = 0;
    roundOk = { subject: null, predtype: null, complements: null };
    chosenComplements = new Set();

    els.stepSubject.style.display = "";
    els.stepPredtype.style.display = "none";
    els.stepComplements.style.display = "none";
    els.nextBtn.style.display = "none";
    els.checkSubjectBtn.disabled = false;
    els.omittedToggle.classList.remove("active");
    setProgress(0);

    clearFeedback();
    renderTokens(false);
  }

  els.omittedToggle.addEventListener("click", () => {
    omitted = !omitted;
    els.omittedToggle.classList.toggle("active", omitted);
    if (omitted) {
      selected.clear();
      renderTokens(false);
    }
  });

  function checkSubject() {
    subjectAttempts++;
    let isCorrect;
    if (current.subject.omitted) {
      isCorrect = omitted;
    } else {
      isCorrect = !omitted && setsEqual(selected, new Set(current.subject.indices));
    }

    if (isCorrect) {
      roundOk.subject = true;
      clearFeedback();
      goToPredType();
      return;
    }

    if (subjectAttempts >= 2) {
      roundOk.subject = false;
      if (current.subject.omitted) {
        omitted = true;
        els.omittedToggle.classList.add("active");
        selected.clear();
      } else {
        selected = new Set(current.subject.indices);
        omitted = false;
        els.omittedToggle.classList.remove("active");
      }
      renderTokens(true);
      els.checkSubjectBtn.disabled = true;
      showTempMessage("El sujeto correcto es: <strong>" + (current.subject.omitted ? "sujeto omitido" : current.subject.indices.map((i) => current.words[i]).join(" ")) + "</strong>. ¡Sigamos!");
      setTimeout(() => {
        clearFeedback();
        goToPredType();
      }, 1700);
    } else {
      showTempMessage("Todavía no es correcto, ¡prueba otra vez!");
    }
  }

  function subjectPhrase() {
    return current.subject.omitted ? "(sujeto omitido)" : current.subject.indices.map((i) => current.words[i]).join(" ");
  }

  function goToPredType() {
    setProgress(50);
    els.stepSubject.style.display = "none";
    els.stepPredtype.style.display = "";

    els.sentenceAfterSubject.innerHTML = current.words
      .map((w, i) => (!current.subject.omitted && current.subject.indices.includes(i) ? `<span class="tag-subject">${w}</span>` : w))
      .join(" ") + (current.subject.omitted ? ` <span class="tag-subject">(sujeto omitido)</span>` : "");

    els.ptButtons.forEach((b) => {
      b.disabled = false;
      b.classList.remove("correct", "incorrect");
    });
  }

  function choosePredType(answer, btn) {
    const isCorrect = answer === current.predicateType;
    roundOk.predtype = isCorrect;

    els.ptButtons.forEach((b) => {
      b.disabled = true;
      if (b.dataset.pt === current.predicateType) b.classList.add("correct");
      else if (b === btn && !isCorrect) b.classList.add("incorrect");
    });

    setTimeout(() => {
      if (current.predicateType === "verbal") {
        goToComplements();
      } else {
        showFinalFeedback();
      }
    }, 1000);
  }

  function goToComplements() {
    setProgress(75);
    els.stepPredtype.style.display = "none";
    els.stepComplements.style.display = "";

    els.compChips.forEach((c) => {
      c.classList.remove("selected", "correct", "incorrect");
      c.disabled = false;
    });
  }

  els.compChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const comp = chip.dataset.comp;
      if (comp === "NINGUNO") {
        chosenComplements.clear();
        chosenComplements.add("NINGUNO");
      } else {
        chosenComplements.delete("NINGUNO");
        if (chosenComplements.has(comp)) chosenComplements.delete(comp);
        else chosenComplements.add(comp);
      }
      els.compChips.forEach((c) => c.classList.toggle("selected", chosenComplements.has(c.dataset.comp)));
    });
  });

  function checkComplements() {
    const correctSet = new Set(current.complements.length ? current.complements : ["NINGUNO"]);
    const isCorrect = setsEqual(chosenComplements, correctSet);
    roundOk.complements = isCorrect;

    els.compChips.forEach((c) => {
      c.disabled = true;
      if (correctSet.has(c.dataset.comp)) c.classList.add("correct");
      else if (chosenComplements.has(c.dataset.comp) && !correctSet.has(c.dataset.comp)) c.classList.add("incorrect");
    });

    setTimeout(showFinalFeedback, 1000);
  }

  function showFinalFeedback() {
    setProgress(100);
    els.stepComplements.style.display = "none";

    const allCorrect =
      roundOk.subject &&
      roundOk.predtype &&
      (current.predicateType === "nominal" || roundOk.complements);

    if (allCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("sintactico", allCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    const sentenceText = current.words.join(" ") + ".";
    const titleText = allCorrect ? "Correcto" : "Revisemos esta oración";

    let bodyHtml = `<p><strong>Sujeto:</strong> ${subjectPhrase()}</p>`;
    bodyHtml += `<p><strong>Predicado:</strong> ${current.predicateType === "nominal" ? "nominal" : "verbal"}</p>`;

    if (current.predicateType === "nominal") {
      bodyHtml += `<p>El atributo es <strong>${current.atributo}</strong>, porque describe cómo es o cómo está el sujeto junto a un verbo como ser, estar o parecer.</p>`;
    } else {
      const compNames = { CD: "complemento directo (CD)", CI: "complemento indirecto (CI)", CC: "complemento circunstancial (CC)" };
      if (current.complements.length === 0) {
        bodyHtml += `<p>Este predicado verbal no lleva complementos: solo tiene el verbo.</p>`;
      } else {
        bodyHtml += `<p>Esta oración lleva: ${current.complements.map((c) => compNames[c]).join(", ")}.</p>`;
      }
    }

    els.feedback.classList.add("show", allCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `
      <p class="feedback-title">${titleText}</p>
      <span class="accented-word">${sentenceText}</span>
      ${bodyHtml}
    `;

    els.nextBtn.style.display = "";
  }

  els.checkSubjectBtn.addEventListener("click", checkSubject);
  els.ptButtons.forEach((btn) => btn.addEventListener("click", () => choosePredType(btn.dataset.pt, btn)));
  els.checkComplementsBtn.addEventListener("click", checkComplements);
  els.nextBtn.addEventListener("click", startRound);

  applyDifficultyUI();
  startRound();
}

registerLenguaFicha("sintactico", {
  label: "Análisis sintáctico",
  resumen: "Toda oración tiene sujeto y predicado; el predicado puede ser nominal o verbal, y puede llevar distintos complementos.",
  easyMode: "elipsis",
  altasMode: "atributo",
  pools: {
    tipo: { pool: TIPO_ORACION_ENTRIES, field: "tipo", question: () => "¿Qué tipo de oración es esta?", displayField: "sentence", options: ["Enunciativa", "Interrogativa", "Exclamativa", "Imperativa", "Desiderativa", "Dubitativa"] },
    voz: { pool: VOZ_ENTRIES, field: "voz", question: () => "¿Esta oración está en voz activa o pasiva?", displayField: "sentence", options: ["Activa", "Pasiva"] },
    elipsis: { pool: ELIPSIS_ENTRIES, field: "omitidoLabel", question: () => "¿Tiene el sujeto omitido (elíptico) esta oración?", displayField: "sentence", options: ["Sí", "No"] },
    atributo: { pool: ATRIBUTO_ENTRIES, field: "correct", question: () => "¿Cuál es el atributo de esta oración?", displayField: "sentence", perEntryOptions: true },
  },
});
