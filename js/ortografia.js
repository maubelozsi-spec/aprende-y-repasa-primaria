// ============================================================
// Ortografía: banco de palabras + lógica del artefacto interactivo
// ============================================================

const WORDS = [
  // ---- Agudas con tilde ----
  { plain: "camion",   syllables: ["ca","mion"],        stress: 1, tilde: true,  accented: "camión",   vowelGroup: "diptongo", groupLetters: "io" },
  { plain: "jardin",   syllables: ["jar","din"],        stress: 1, tilde: true,  accented: "jardín",   vowelGroup: "ninguno" },
  { plain: "cafe",     syllables: ["ca","fe"],          stress: 1, tilde: true,  accented: "café",     vowelGroup: "ninguno" },
  { plain: "sofa",     syllables: ["so","fa"],          stress: 1, tilde: true,  accented: "sofá",     vowelGroup: "ninguno" },
  { plain: "autobus",  syllables: ["au","to","bus"],    stress: 2, tilde: true,  accented: "autobús",  vowelGroup: "diptongo", groupLetters: "au" },
  { plain: "corazon",  syllables: ["co","ra","zon"],    stress: 2, tilde: true,  accented: "corazón",  vowelGroup: "ninguno" },
  { plain: "compas",   syllables: ["com","pas"],        stress: 1, tilde: true,  accented: "compás",   vowelGroup: "ninguno" },
  { plain: "maletin",  syllables: ["ma","le","tin"],    stress: 2, tilde: true,  accented: "maletín",  vowelGroup: "ninguno" },

  // ---- Agudas sin tilde ----
  { plain: "reloj",    syllables: ["re","loj"],         stress: 1, tilde: false, accented: "reloj",    vowelGroup: "ninguno" },
  { plain: "papel",    syllables: ["pa","pel"],         stress: 1, tilde: false, accented: "papel",    vowelGroup: "ninguno" },
  { plain: "verdad",   syllables: ["ver","dad"],        stress: 1, tilde: false, accented: "verdad",   vowelGroup: "ninguno" },
  { plain: "feliz",    syllables: ["fe","liz"],         stress: 1, tilde: false, accented: "feliz",    vowelGroup: "ninguno" },
  { plain: "comer",    syllables: ["co","mer"],         stress: 1, tilde: false, accented: "comer",    vowelGroup: "ninguno" },
  { plain: "ciudad",   syllables: ["ciu","dad"],        stress: 1, tilde: false, accented: "ciudad",   vowelGroup: "diptongo", groupLetters: "iu" },

  // ---- Agudas con hiato acentual (rompen la regla general) ----
  { plain: "raiz",     syllables: ["ra","iz"],          stress: 1, tilde: true,  accented: "raíz",     vowelGroup: "hiato_acentual", groupLetters: "aí" },
  { plain: "baul",     syllables: ["ba","ul"],          stress: 1, tilde: true,  accented: "baúl",     vowelGroup: "hiato_acentual", groupLetters: "aú" },
  { plain: "oir",      syllables: ["o","ir"],           stress: 1, tilde: true,  accented: "oír",      vowelGroup: "hiato_acentual", groupLetters: "oí" },

  // ---- Llanas con tilde ----
  { plain: "arbol",    syllables: ["ar","bol"],         stress: 0, tilde: true,  accented: "árbol",    vowelGroup: "ninguno" },
  { plain: "lapiz",    syllables: ["la","piz"],         stress: 0, tilde: true,  accented: "lápiz",    vowelGroup: "ninguno" },
  { plain: "azucar",   syllables: ["a","zu","car"],     stress: 1, tilde: true,  accented: "azúcar",   vowelGroup: "ninguno" },
  { plain: "futbol",   syllables: ["fut","bol"],        stress: 0, tilde: true,  accented: "fútbol",   vowelGroup: "ninguno" },
  { plain: "carcel",   syllables: ["car","cel"],        stress: 0, tilde: true,  accented: "cárcel",   vowelGroup: "ninguno" },
  { plain: "dificil",  syllables: ["di","fi","cil"],    stress: 1, tilde: true,  accented: "difícil",  vowelGroup: "ninguno" },
  { plain: "huesped",  syllables: ["hues","ped"],       stress: 0, tilde: true,  accented: "huésped",  vowelGroup: "diptongo", groupLetters: "ue" },

  // ---- Llanas sin tilde ----
  { plain: "mesa",     syllables: ["me","sa"],          stress: 0, tilde: false, accented: "mesa",     vowelGroup: "ninguno" },
  { plain: "casa",     syllables: ["ca","sa"],          stress: 0, tilde: false, accented: "casa",     vowelGroup: "ninguno" },
  { plain: "ventana",  syllables: ["ven","ta","na"],    stress: 1, tilde: false, accented: "ventana",  vowelGroup: "ninguno" },
  { plain: "joven",    syllables: ["jo","ven"],         stress: 0, tilde: false, accented: "joven",    vowelGroup: "ninguno" },
  { plain: "examen",   syllables: ["e","xa","men"],     stress: 1, tilde: false, accented: "examen",   vowelGroup: "ninguno" },
  { plain: "agua",     syllables: ["a","gua"],          stress: 0, tilde: false, accented: "agua",     vowelGroup: "diptongo", groupLetters: "ua" },
  { plain: "tiempo",   syllables: ["tiem","po"],        stress: 0, tilde: false, accented: "tiempo",   vowelGroup: "diptongo", groupLetters: "ie" },
  { plain: "cielo",    syllables: ["cie","lo"],         stress: 0, tilde: false, accented: "cielo",    vowelGroup: "diptongo", groupLetters: "ie" },
  { plain: "fuego",    syllables: ["fue","go"],         stress: 0, tilde: false, accented: "fuego",    vowelGroup: "diptongo", groupLetters: "ue" },
  { plain: "aceite",   syllables: ["a","cei","te"],     stress: 1, tilde: false, accented: "aceite",   vowelGroup: "diptongo", groupLetters: "ei" },
  { plain: "jaula",    syllables: ["jau","la"],         stress: 0, tilde: false, accented: "jaula",    vowelGroup: "diptongo", groupLetters: "au" },
  { plain: "familia",  syllables: ["fa","mi","lia"],    stress: 1, tilde: false, accented: "familia",  vowelGroup: "diptongo", groupLetters: "ia" },
  { plain: "radio",    syllables: ["ra","dio"],         stress: 0, tilde: false, accented: "radio",    vowelGroup: "diptongo", groupLetters: "io" },

  // ---- Llanas con hiato acentual ----
  { plain: "dia",      syllables: ["di","a"],           stress: 0, tilde: true,  accented: "día",      vowelGroup: "hiato_acentual", groupLetters: "ía" },
  { plain: "rio",      syllables: ["ri","o"],           stress: 0, tilde: true,  accented: "río",      vowelGroup: "hiato_acentual", groupLetters: "ío" },
  { plain: "tia",      syllables: ["ti","a"],           stress: 0, tilde: true,  accented: "tía",      vowelGroup: "hiato_acentual", groupLetters: "ía" },
  { plain: "policia",  syllables: ["po","li","ci","a"], stress: 2, tilde: true,  accented: "policía",  vowelGroup: "hiato_acentual", groupLetters: "ía" },
  { plain: "sonrie",   syllables: ["son","ri","e"],     stress: 1, tilde: true,  accented: "sonríe",   vowelGroup: "hiato_acentual", groupLetters: "íe" },
  { plain: "actua",    syllables: ["ac","tu","a"],      stress: 1, tilde: true,  accented: "actúa",    vowelGroup: "hiato_acentual", groupLetters: "úa" },

  // ---- Hiato simple (dos vocales fuertes) ----
  { plain: "poeta",    syllables: ["po","e","ta"],      stress: 1, tilde: false, accented: "poeta",    vowelGroup: "hiato", groupLetters: "oe" },
  { plain: "teatro",   syllables: ["te","a","tro"],     stress: 1, tilde: false, accented: "teatro",   vowelGroup: "hiato", groupLetters: "ea" },
  { plain: "museo",    syllables: ["mu","se","o"],      stress: 1, tilde: false, accented: "museo",    vowelGroup: "hiato", groupLetters: "eo" },
  { plain: "real",     syllables: ["re","al"],          stress: 1, tilde: false, accented: "real",     vowelGroup: "hiato", groupLetters: "ea" },
  { plain: "roedor",   syllables: ["ro","e","dor"],     stress: 2, tilde: false, accented: "roedor",   vowelGroup: "hiato", groupLetters: "oe" },
  { plain: "caos",     syllables: ["ca","os"],          stress: 0, tilde: false, accented: "caos",     vowelGroup: "hiato", groupLetters: "ao" },

  // ---- Esdrújulas ----
  { plain: "pagina",     syllables: ["pa","gi","na"],        stress: 0, tilde: true, accented: "página",     vowelGroup: "ninguno" },
  { plain: "musica",     syllables: ["mu","si","ca"],        stress: 0, tilde: true, accented: "música",     vowelGroup: "ninguno" },
  { plain: "telefono",   syllables: ["te","le","fo","no"],   stress: 1, tilde: true, accented: "teléfono",   vowelGroup: "ninguno" },
  { plain: "sabado",     syllables: ["sa","ba","do"],        stress: 0, tilde: true, accented: "sábado",     vowelGroup: "ninguno" },
  { plain: "numero",     syllables: ["nu","me","ro"],        stress: 0, tilde: true, accented: "número",     vowelGroup: "ninguno" },
  { plain: "rapido",     syllables: ["ra","pi","do"],        stress: 0, tilde: true, accented: "rápido",     vowelGroup: "ninguno" },
  { plain: "medico",     syllables: ["me","di","co"],        stress: 0, tilde: true, accented: "médico",     vowelGroup: "ninguno" },
  { plain: "camara",     syllables: ["ca","ma","ra"],        stress: 0, tilde: true, accented: "cámara",     vowelGroup: "ninguno" },
  { plain: "murcielago", syllables: ["mur","cie","la","go"], stress: 1, tilde: true, accented: "murciélago", vowelGroup: "diptongo", groupLetters: "ie" },
  { plain: "linea",      syllables: ["li","ne","a"],         stress: 0, tilde: true, accented: "línea",      vowelGroup: "hiato", groupLetters: "ea" },

  // ---- Sobresdrújulas ----
  { plain: "cuentamelo",  syllables: ["cuen","ta","me","lo"],      stress: 0, tilde: true, accented: "cuéntamelo",  vowelGroup: "diptongo", groupLetters: "ue" },
  { plain: "digaselo",    syllables: ["di","ga","se","lo"],        stress: 0, tilde: true, accented: "dígaselo",    vowelGroup: "ninguno" },
  { plain: "explicamelo", syllables: ["ex","pli","ca","me","lo"],  stress: 1, tilde: true, accented: "explícamelo", vowelGroup: "ninguno" },

  // ---- Monosílabos con triptongo (no llevan tilde) ----
  { plain: "buey", syllables: ["buey"], stress: 0, tilde: false, accented: "buey", vowelGroup: "triptongo", groupLetters: "uey" },
  { plain: "miau", syllables: ["miau"], stress: 0, tilde: false, accented: "miau", vowelGroup: "triptongo", groupLetters: "iau" },

  // ---- Agudas con triptongo ----
  { plain: "estudiais",  syllables: ["es","tu","diais"],  stress: 2, tilde: true, accented: "estudiáis",  vowelGroup: "triptongo", groupLetters: "iai" },
  { plain: "cambiais",   syllables: ["cam","biais"],      stress: 1, tilde: true, accented: "cambiáis",   vowelGroup: "triptongo", groupLetters: "iai" },
  { plain: "apreciais",  syllables: ["a","pre","ciais"],  stress: 2, tilde: true, accented: "apreciáis",  vowelGroup: "triptongo", groupLetters: "iai" },
];

function computeType(len, stress) {
  if (len === 1) return "monosilaba";
  const diffLen = (len - 1) - stress;
  if (diffLen === 0) return "aguda";
  if (diffLen === 1) return "llana";
  if (diffLen === 2) return "esdrujula";
  return "sobresdrujula";
}

const EASY_WORDS = WORDS.filter(
  (w) => !["triptongo", "hiato_acentual"].includes(w.vowelGroup) && computeType(w.syllables.length, w.stress) !== "sobresdrujula"
);
const ALTAS_WORDS = WORDS.filter(
  (w) => ["triptongo", "hiato_acentual"].includes(w.vowelGroup) || computeType(w.syllables.length, w.stress) === "sobresdrujula"
);

const ORTOGRAFIA_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Palabras más sencillas y sin el paso 4",
    text: "Para el alumnado con adaptación curricular significativa se usan solo palabras agudas, llanas y esdrújulas sencillas (sin triptongos, sobresdrújulas ni hiatos acentuales), y se practican los 3 primeros pasos: sílabas, sílaba tónica y tilde. El paso de diptongo/hiato/triptongo se omite.",
    example: "«ár·bol» → llana, con tilde, sin pasar al paso 4",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido y los mismos 4 pasos, pero con una tipografía más legible.",
    example: "«ca·mi·ón» → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Ya se practica un paso cada vez",
    text: "Esta actividad ya presenta un solo paso a la vez (sílabas, tónica, tilde, vocales), con una barra de progreso, sin mezclar bloques de contenido, así que no hace falta ningún ajuste adicional.",
    example: "Paso 1 de 4 → paso 2 de 4 → paso 3 de 4 → paso 4 de 4",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Palabras más sencillas, sin el paso 4 y ayuda extra",
    text: "Igual que en ACS, se usan palabras más sencillas y se omite el paso de diptongo/hiato/triptongo, dando más tiempo para pensar cada paso.",
    example: "«me·sa» → llana, sin tilde, sin pasar al paso 4",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Solo los casos más difíciles",
    text: "Se practica únicamente con sobresdrújulas, triptongos e hiatos acentuales: los casos más avanzados y con más excepciones a la regla general.",
    example: "«ra·íz» → aguda que lleva tilde por hiato acentual, aunque acabe en consonante distinta de N o S",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde pulsando, sin escribir",
    text: "Este juego ya funciona pulsando huecos entre letras y botones de opción, así que no hace falta ningún cambio: no requiere escribir nada.",
    example: "Pulsa entre las letras para separar en sílabas → sin necesidad de escribir",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, ORTOGRAFIA_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), ORTOGRAFIA_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("word-display")) {
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

function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-ortografia"),
    wordDisplay: document.getElementById("word-display"),
    stepSyllables: document.getElementById("step-syllables"),
    stepStress: document.getElementById("step-stress"),
    stepTilde: document.getElementById("step-tilde"),
    stepVowelgroup: document.getElementById("step-vowelgroup"),
    checkSyllablesBtn: document.getElementById("check-syllables"),
    syllableRow: document.getElementById("syllable-row"),
    tildeSiBtn: document.getElementById("tilde-si"),
    tildeNoBtn: document.getElementById("tilde-no"),
    vgButtons: document.querySelectorAll("#step-vowelgroup [data-vg]"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
    progressFill: document.getElementById("progress-fill"),
    instructionEls: document.querySelectorAll(".instructions"),
  };

  const originalInstructions = [...els.instructionEls].map((el) => el.textContent);

  let scoreOk = 0;
  let scoreKo = 0;
  let lastWord = null;
  let current, dividers, syllableAttempts, roundOk, skippedVowelGroup;

  function isEasyOnly() {
    return diff.is("acs") || diff.is("discalculia");
  }

  function currentPool() {
    if (isEasyOnly()) return EASY_WORDS;
    if (diff.is("altas")) return ALTAS_WORDS;
    return WORDS;
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

  function pickWord() {
    const source = currentPool();
    let word;
    do {
      word = source[Math.floor(Math.random() * source.length)];
    } while (source.length > 1 && word === lastWord);
    lastWord = word;
    return word;
  }

  function correctDividerSet() {
    const set = new Set();
    let pos = -1;
    for (let i = 0; i < current.syllables.length - 1; i++) {
      pos += current.syllables[i].length;
      set.add(pos);
    }
    return set;
  }

  function renderWordDisplay(locked) {
    els.wordDisplay.innerHTML = "";
    const letters = current.plain.split("");
    letters.forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = "letter";
      span.textContent = ch.toUpperCase();
      els.wordDisplay.appendChild(span);

      if (i < letters.length - 1) {
        const gap = document.createElement("span");
        gap.className = "divider-gap" + (dividers[i] ? " active" : "");
        gap.textContent = "·";
        if (!locked) {
          gap.addEventListener("click", () => {
            dividers[i] = !dividers[i];
            gap.classList.toggle("active", dividers[i]);
          });
        }
        els.wordDisplay.appendChild(gap);
      }
    });
  }

  function showTempMessage(msg) {
    els.feedback.classList.add("show");
    els.feedback.classList.remove("ok", "ko");
    els.feedback.innerHTML = `<p>${msg}</p>`;
  }

  function clearFeedback() {
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
  }

  function setProgress(percent) {
    els.progressFill.style.width = percent + "%";
  }

  function startRound() {
    current = pickWord();
    dividers = new Array(current.plain.length - 1).fill(false);
    syllableAttempts = 0;
    roundOk = { syll: null, stress: null, tilde: null, vg: null };
    skippedVowelGroup = false;

    els.stepSyllables.style.display = "";
    els.stepStress.style.display = "none";
    els.stepTilde.style.display = "none";
    els.stepVowelgroup.style.display = "none";
    els.nextBtn.style.display = "none";
    els.checkSyllablesBtn.disabled = false;
    setProgress(0);

    clearFeedback();
    renderWordDisplay(false);
  }

  function checkSyllables() {
    const correctSet = correctDividerSet();
    const chosenSet = new Set(dividers.map((v, i) => (v ? i : null)).filter((v) => v !== null));
    const isCorrect =
      correctSet.size === chosenSet.size && [...correctSet].every((i) => chosenSet.has(i));

    syllableAttempts++;

    if (isCorrect) {
      roundOk.syll = true;
      clearFeedback();
      goToStress();
      return;
    }

    if (syllableAttempts >= 2) {
      roundOk.syll = false;
      dividers = dividers.map((_, i) => correctSet.has(i));
      renderWordDisplay(true);
      els.checkSyllablesBtn.disabled = true;
      showTempMessage("La separación correcta es: <strong>" + current.syllables.join(" - ") + "</strong>. ¡Sigamos!");
      setTimeout(() => {
        clearFeedback();
        goToStress();
      }, 1600);
    } else {
      showTempMessage("Todavía no es correcto, ¡prueba otra vez!");
    }
  }

  function goToStress() {
    setProgress(25);
    els.stepSyllables.style.display = "none";
    els.stepStress.style.display = "";
    els.syllableRow.innerHTML = "";

    current.syllables.forEach((syl, i) => {
      const chip = document.createElement("button");
      chip.className = "syllable-chip";
      chip.textContent = syl.toUpperCase();
      chip.addEventListener("click", () => chooseStress(i, chip));
      els.syllableRow.appendChild(chip);
    });
  }

  function chooseStress(i, chip) {
    const chips = els.syllableRow.querySelectorAll(".syllable-chip");
    const isCorrect = i === current.stress;
    roundOk.stress = isCorrect;

    chips.forEach((c, idx) => {
      c.disabled = true;
      if (idx === current.stress) c.classList.add("correct");
      else if (idx === i && !isCorrect) c.classList.add("incorrect");
    });

    setTimeout(goToTilde, 1000);
  }

  function goToTilde() {
    setProgress(50);
    els.stepStress.style.display = "none";
    els.stepTilde.style.display = "";
    els.tildeSiBtn.disabled = false;
    els.tildeNoBtn.disabled = false;
    els.tildeSiBtn.classList.remove("correct", "incorrect");
    els.tildeNoBtn.classList.remove("correct", "incorrect");
  }

  function chooseTilde(answer) {
    const isCorrect = answer === current.tilde;
    roundOk.tilde = isCorrect;
    els.tildeSiBtn.disabled = true;
    els.tildeNoBtn.disabled = true;

    const correctBtn = current.tilde ? els.tildeSiBtn : els.tildeNoBtn;
    const chosenBtn = answer ? els.tildeSiBtn : els.tildeNoBtn;
    correctBtn.classList.add("correct");
    if (!isCorrect) chosenBtn.classList.add("incorrect");

    if (isEasyOnly()) {
      skippedVowelGroup = true;
      setTimeout(showFinalFeedback, 1000);
    } else {
      setTimeout(goToVowelGroup, 1000);
    }
  }

  function goToVowelGroup() {
    setProgress(75);
    els.stepTilde.style.display = "none";
    els.stepVowelgroup.style.display = "";
    els.vgButtons.forEach((b) => {
      b.disabled = false;
      b.classList.remove("correct", "incorrect");
    });
  }

  function chooseVowelGroup(answer, btn) {
    const normalizedCorrect = current.vowelGroup === "hiato_acentual" ? "hiato" : current.vowelGroup;
    const isCorrect = answer === normalizedCorrect;
    roundOk.vg = isCorrect;

    els.vgButtons.forEach((b) => {
      b.disabled = true;
      if (b.dataset.vg === normalizedCorrect) b.classList.add("correct");
      else if (b === btn && !isCorrect) b.classList.add("incorrect");
    });

    setTimeout(showFinalFeedback, 900);
  }

  function showFinalFeedback() {
    setProgress(100);
    els.stepTilde.style.display = "none";
    els.stepVowelgroup.style.display = "none";

    const type = computeType(current.syllables.length, current.stress);
    const allCorrect = roundOk.syll && roundOk.stress && roundOk.tilde && (skippedVowelGroup || roundOk.vg);

    if (allCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("ortografia", allCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    const typeNames = {
      aguda: "aguda",
      llana: "llana",
      esdrujula: "esdrújula",
      sobresdrujula: "sobresdrújula",
      monosilaba: "monosílaba (una sola sílaba)",
    };

    let ruleText;
    if (type === "monosilaba") {
      ruleText = "Al tener una sola sílaba, esta palabra no necesita tilde (los monosílabos normalmente no se acentúan).";
    } else if (current.vowelGroup === "hiato_acentual") {
      ruleText = `Es una palabra ${typeNames[type]}, pero lleva tilde por el <strong>hiato acentual</strong>: la vocal débil (i/u) suena con fuerza junto a una vocal fuerte, así que siempre se acentúa, aunque la regla general de las ${typeNames[type]}s no lo pida.`;
    } else {
      ruleText = `Es una palabra <strong>${typeNames[type]}</strong> y por eso ${current.tilde ? "lleva tilde." : "no lleva tilde."}`;
    }

    let vgText;
    if (current.vowelGroup === "diptongo") {
      vgText = `Tiene un <strong>diptongo</strong> (${current.groupLetters || ""}): una vocal fuerte y una débil sin fuerza juntas en la misma sílaba.`;
    } else if (current.vowelGroup === "hiato") {
      vgText = `Tiene un <strong>hiato</strong> (${current.groupLetters || ""}): dos vocales fuertes que se separan en sílabas distintas.`;
    } else if (current.vowelGroup === "hiato_acentual") {
      vgText = `Tiene un <strong>hiato acentual</strong> (${current.groupLetters || ""}): vocal fuerte + vocal débil tónica, separadas en dos sílabas.`;
    } else if (current.vowelGroup === "triptongo") {
      vgText = `Tiene un <strong>triptongo</strong> (${current.groupLetters || ""}): tres vocales juntas en una sola sílaba.`;
    } else {
      vgText = "No tiene ningún grupo vocálico especial (ni diptongo, ni hiato, ni triptongo).";
    }

    const syllablesHtml = current.syllables
      .map((s, i) => (i === current.stress ? `<u>${s.toUpperCase()}</u>` : s.toUpperCase()))
      .join(" - ");

    const titleText = allCorrect ? (skippedVowelGroup ? "Correcto en los 3 pasos" : "Correcto en los 4 pasos") : "Revisemos esta palabra";

    els.feedback.classList.add("show", allCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `
      <p class="feedback-title">${titleText}</p>
      <span class="accented-word">${current.accented}</span>
      <p><strong>Sílabas:</strong> ${syllablesHtml}</p>
      <p>${ruleText}</p>
      <p>${vgText}</p>
    `;

    els.nextBtn.style.display = "";
  }

  els.checkSyllablesBtn.addEventListener("click", checkSyllables);
  els.tildeSiBtn.addEventListener("click", () => chooseTilde(true));
  els.tildeNoBtn.addEventListener("click", () => chooseTilde(false));
  els.vgButtons.forEach((btn) => btn.addEventListener("click", () => chooseVowelGroup(btn.dataset.vg, btn)));
  els.nextBtn.addEventListener("click", startRound);

  applyDifficultyUI();
  startRound();
}
