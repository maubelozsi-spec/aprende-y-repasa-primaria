// ============================================================
// Análisis morfológico: banco de palabras + lógica del artefacto
// ============================================================

const ENTRIES = [
  // Frase 1
  { words: ["El", "perro", "pequeño", "corre", "rápido", "por", "el", "parque"], target: 0, category: "determinante", subtype: "artículo" },
  { words: ["El", "perro", "pequeño", "corre", "rápido", "por", "el", "parque"], target: 1, category: "sustantivo" },
  { words: ["El", "perro", "pequeño", "corre", "rápido", "por", "el", "parque"], target: 2, category: "adjetivo" },
  { words: ["El", "perro", "pequeño", "corre", "rápido", "por", "el", "parque"], target: 3, category: "verbo" },
  { words: ["El", "perro", "pequeño", "corre", "rápido", "por", "el", "parque"], target: 4, category: "adverbio", subtype: "modo" },
  { words: ["El", "perro", "pequeño", "corre", "rápido", "por", "el", "parque"], target: 5, category: "preposicion" },
  { words: ["El", "perro", "pequeño", "corre", "rápido", "por", "el", "parque"], target: 7, category: "sustantivo" },

  // Frase 2
  { words: ["Mi", "hermana", "mayor", "estudia", "mucho", "todos", "los", "días"], target: 0, category: "determinante", subtype: "posesivo" },
  { words: ["Mi", "hermana", "mayor", "estudia", "mucho", "todos", "los", "días"], target: 1, category: "sustantivo" },
  { words: ["Mi", "hermana", "mayor", "estudia", "mucho", "todos", "los", "días"], target: 2, category: "adjetivo" },
  { words: ["Mi", "hermana", "mayor", "estudia", "mucho", "todos", "los", "días"], target: 3, category: "verbo" },
  { words: ["Mi", "hermana", "mayor", "estudia", "mucho", "todos", "los", "días"], target: 4, category: "adverbio", subtype: "cantidad" },
  { words: ["Mi", "hermana", "mayor", "estudia", "mucho", "todos", "los", "días"], target: 5, category: "determinante", subtype: "indefinido" },
  { words: ["Mi", "hermana", "mayor", "estudia", "mucho", "todos", "los", "días"], target: 6, category: "determinante", subtype: "artículo" },
  { words: ["Mi", "hermana", "mayor", "estudia", "mucho", "todos", "los", "días"], target: 7, category: "sustantivo" },

  // Frase 3
  { words: ["Ellos", "nunca", "llegan", "tarde", "a", "clase"], target: 0, category: "pronombre", subtype: "personal" },
  { words: ["Ellos", "nunca", "llegan", "tarde", "a", "clase"], target: 1, category: "adverbio", subtype: "negación" },
  { words: ["Ellos", "nunca", "llegan", "tarde", "a", "clase"], target: 2, category: "verbo" },
  { words: ["Ellos", "nunca", "llegan", "tarde", "a", "clase"], target: 3, category: "adverbio", subtype: "tiempo" },
  { words: ["Ellos", "nunca", "llegan", "tarde", "a", "clase"], target: 4, category: "preposicion" },
  { words: ["Ellos", "nunca", "llegan", "tarde", "a", "clase"], target: 5, category: "sustantivo" },

  // Frase 4
  { words: ["Aquella", "casa", "azul", "es", "muy", "antigua"], target: 0, category: "determinante", subtype: "demostrativo" },
  { words: ["Aquella", "casa", "azul", "es", "muy", "antigua"], target: 1, category: "sustantivo" },
  { words: ["Aquella", "casa", "azul", "es", "muy", "antigua"], target: 2, category: "adjetivo" },
  { words: ["Aquella", "casa", "azul", "es", "muy", "antigua"], target: 3, category: "verbo" },
  { words: ["Aquella", "casa", "azul", "es", "muy", "antigua"], target: 4, category: "adverbio", subtype: "cantidad" },
  { words: ["Aquella", "casa", "azul", "es", "muy", "antigua"], target: 5, category: "adjetivo" },

  // Frase 5
  { words: ["Nosotros", "compramos", "pan", "y", "leche", "en", "la", "tienda"], target: 0, category: "pronombre", subtype: "personal" },
  { words: ["Nosotros", "compramos", "pan", "y", "leche", "en", "la", "tienda"], target: 1, category: "verbo" },
  { words: ["Nosotros", "compramos", "pan", "y", "leche", "en", "la", "tienda"], target: 2, category: "sustantivo" },
  { words: ["Nosotros", "compramos", "pan", "y", "leche", "en", "la", "tienda"], target: 3, category: "conjuncion" },
  { words: ["Nosotros", "compramos", "pan", "y", "leche", "en", "la", "tienda"], target: 4, category: "sustantivo" },
  { words: ["Nosotros", "compramos", "pan", "y", "leche", "en", "la", "tienda"], target: 5, category: "preposicion" },
  { words: ["Nosotros", "compramos", "pan", "y", "leche", "en", "la", "tienda"], target: 6, category: "determinante", subtype: "artículo" },
  { words: ["Nosotros", "compramos", "pan", "y", "leche", "en", "la", "tienda"], target: 7, category: "sustantivo" },

  // Frase 6
  { words: ["Este", "libro", "es", "interesante", "pero", "muy", "largo"], target: 0, category: "determinante", subtype: "demostrativo" },
  { words: ["Este", "libro", "es", "interesante", "pero", "muy", "largo"], target: 1, category: "sustantivo" },
  { words: ["Este", "libro", "es", "interesante", "pero", "muy", "largo"], target: 2, category: "verbo" },
  { words: ["Este", "libro", "es", "interesante", "pero", "muy", "largo"], target: 3, category: "adjetivo" },
  { words: ["Este", "libro", "es", "interesante", "pero", "muy", "largo"], target: 4, category: "conjuncion" },
  { words: ["Este", "libro", "es", "interesante", "pero", "muy", "largo"], target: 6, category: "adjetivo" },

  // Frase 7
  { words: ["Alguien", "dejó", "su", "mochila", "aquí"], target: 0, category: "pronombre", subtype: "indefinido" },
  { words: ["Alguien", "dejó", "su", "mochila", "aquí"], target: 1, category: "verbo" },
  { words: ["Alguien", "dejó", "su", "mochila", "aquí"], target: 2, category: "determinante", subtype: "posesivo" },
  { words: ["Alguien", "dejó", "su", "mochila", "aquí"], target: 3, category: "sustantivo" },
  { words: ["Alguien", "dejó", "su", "mochila", "aquí"], target: 4, category: "adverbio", subtype: "lugar" },

  // Frase 8
  { words: ["Los", "alumnos", "trabajan", "bien", "en", "equipo"], target: 0, category: "determinante", subtype: "artículo" },
  { words: ["Los", "alumnos", "trabajan", "bien", "en", "equipo"], target: 1, category: "sustantivo" },
  { words: ["Los", "alumnos", "trabajan", "bien", "en", "equipo"], target: 2, category: "verbo" },
  { words: ["Los", "alumnos", "trabajan", "bien", "en", "equipo"], target: 3, category: "adverbio", subtype: "modo" },
  { words: ["Los", "alumnos", "trabajan", "bien", "en", "equipo"], target: 4, category: "preposicion" },
  { words: ["Los", "alumnos", "trabajan", "bien", "en", "equipo"], target: 5, category: "sustantivo" },

  // Frase 9
  { words: ["También", "iremos", "si", "terminamos", "pronto"], target: 0, category: "adverbio", subtype: "afirmación" },
  { words: ["También", "iremos", "si", "terminamos", "pronto"], target: 1, category: "verbo" },
  { words: ["También", "iremos", "si", "terminamos", "pronto"], target: 2, category: "conjuncion" },
  { words: ["También", "iremos", "si", "terminamos", "pronto"], target: 3, category: "verbo" },
  { words: ["También", "iremos", "si", "terminamos", "pronto"], target: 4, category: "adverbio", subtype: "tiempo" },

  // Frase 10
  { words: ["Aquel", "señor", "amable", "nos", "ayudó", "mucho"], target: 0, category: "determinante", subtype: "demostrativo" },
  { words: ["Aquel", "señor", "amable", "nos", "ayudó", "mucho"], target: 1, category: "sustantivo" },
  { words: ["Aquel", "señor", "amable", "nos", "ayudó", "mucho"], target: 2, category: "adjetivo" },
  { words: ["Aquel", "señor", "amable", "nos", "ayudó", "mucho"], target: 3, category: "pronombre", subtype: "personal" },
  { words: ["Aquel", "señor", "amable", "nos", "ayudó", "mucho"], target: 4, category: "verbo" },
  { words: ["Aquel", "señor", "amable", "nos", "ayudó", "mucho"], target: 5, category: "adverbio", subtype: "cantidad" },
];

const CATEGORY_LABELS = {
  sustantivo: "sustantivo",
  adjetivo: "adjetivo",
  determinante: "determinante",
  pronombre: "pronombre",
  verbo: "verbo",
  adverbio: "adverbio",
  preposicion: "preposición",
  conjuncion: "conjunción",
};

function explanationFor(entry) {
  const word = entry.words[entry.target];
  switch (entry.category) {
    case "sustantivo":
      return `«${word}» es un sustantivo: nombra una persona, animal, cosa o idea.`;
    case "adjetivo":
      return `«${word}» es un adjetivo: expresa una cualidad y concuerda en género y número con el sustantivo al que acompaña.`;
    case "determinante":
      return `«${word}» es un determinante (${entry.subtype}): va delante del sustantivo y lo concreta.`;
    case "pronombre":
      return `«${word}» es un pronombre (${entry.subtype}): sustituye a un sustantivo.`;
    case "verbo":
      return `«${word}» es un verbo: expresa una acción, un estado o un proceso.`;
    case "adverbio":
      return `«${word}» es un adverbio de ${entry.subtype}: modifica al verbo, al adjetivo o a otro adverbio, y no cambia de forma.`;
    case "preposicion":
      return `«${word}» es una preposición: relaciona palabras dentro de la oración.`;
    case "conjuncion":
      return `«${word}» es una conjunción: une palabras u oraciones.`;
    default:
      return "";
  }
}

const MORFOLOGICO_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo sustantivo, adjetivo y verbo",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo con las tres categorías más concretas: sustantivo, adjetivo y verbo, ocultando el resto de botones.",
    example: "«El <u>perro</u> pequeño corre.» → sustantivo",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las frases.",
    example: "«El perro <u>pequeño</u> corre.» → adjetivo → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Ya se presenta una palabra cada vez",
    text: "Esta actividad ya muestra una sola frase y una sola pregunta cada vez, sin mezclar bloques de contenido, así que no hace falta ningún ajuste adicional.",
    example: "Una palabra subrayada → una pregunta → siguiente palabra",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo sustantivo, adjetivo y verbo y ayuda extra",
    text: "Igual que en ACS, se trabaja solo con sustantivo, adjetivo y verbo, dando más tiempo para pensar cada respuesta.",
    example: "«Mi hermana mayor <u>estudia</u> mucho.» → verbo",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Las 8 categorías completas",
    text: "Se practica con las 8 categorías gramaticales completas, incluyendo determinante, pronombre, adverbio, preposición y conjunción, sin ninguna restricción.",
    example: "«Nosotros compramos pan <u>y</u> leche.» → conjunción",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la categoría correcta.",
    example: "¿Qué categoría gramatical es? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, MORFOLOGICO_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), MORFOLOGICO_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("sentence-display")) {
    initGame(diff, (fn) => restartCallbacks.push(fn));
  }
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

const MORFOLOGICO_EASY_CATEGORIES = ["sustantivo", "adjetivo", "verbo"];

function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-morfologico"),
    sentenceDisplay: document.getElementById("sentence-display"),
    instructions: document.getElementById("instructions"),
    catButtons: document.querySelectorAll("#category-buttons [data-cat]"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  let scoreOk = 0;
  let scoreKo = 0;
  let lastEntry = null;
  let current;

  function pool() {
    if (diff.is("acs") || diff.is("discalculia")) {
      return ENTRIES.filter((e) => MORFOLOGICO_EASY_CATEGORIES.includes(e.category));
    }
    return ENTRIES;
  }

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    els.catButtons.forEach((b) => {
      b.style.display = easyOnly && !MORFOLOGICO_EASY_CATEGORIES.includes(b.dataset.cat) ? "none" : "";
    });
    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickEntry() {
    const source = pool();
    let entry;
    do {
      entry = source[Math.floor(Math.random() * source.length)];
    } while (source.length > 1 && entry === lastEntry);
    lastEntry = entry;
    return entry;
  }

  function startRound() {
    current = pickEntry();

    els.sentenceDisplay.innerHTML =
      current.words.map((w, i) => (i === current.target ? `<span class="target-word">${w}</span>` : w)).join(" ") + ".";

    els.instructions.textContent = "¿Qué categoría gramatical es la palabra subrayada?" + (diff.is("discalculia") ? " Tómate tu tiempo." : "");

    els.catButtons.forEach((b) => {
      b.disabled = false;
      b.classList.remove("correct", "incorrect");
    });

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";
  }

  function chooseCategory(answer, btn) {
    const isCorrect = answer === current.category;

    if (isCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("morfologico", isCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.catButtons.forEach((b) => {
      b.disabled = true;
      if (b.dataset.cat === current.category) b.classList.add("correct");
      else if (b === btn && !isCorrect) b.classList.add("incorrect");
    });

    const titleText = isCorrect ? "Correcto" : "No es esa categoría";

    els.feedback.classList.add("show", isCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `
      <p class="feedback-title">${titleText}</p>
      <p>${explanationFor(current)}</p>
    `;

    els.nextBtn.style.display = "";
  }

  els.catButtons.forEach((btn) => btn.addEventListener("click", () => chooseCategory(btn.dataset.cat, btn)));
  els.nextBtn.addEventListener("click", startRound);

  applyDifficultyUI();
  startRound();
}
