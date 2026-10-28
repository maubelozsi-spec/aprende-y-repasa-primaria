// ============================================================
// Siglas, abreviaturas y símbolos (6º, SdA 7).
// - Siglas: iniciales de varias palabras, en mayúsculas, sin puntos y
//   sin plural con -s (las ONG). Si se leen como una palabra son
//   acrónimos (ONU, OTAN, IVA).
// - Abreviaturas: una palabra recortada, con punto (Sr., pág., etc.).
// - Símbolos: sin punto ni plural (km, kg, h, €).
// - Explora: desmontar una sigla letra a letra y comparar los tres tipos.
// - Práctica: banco con pista y explicación. Solo la práctica llama a
//   AppProgress.
// ============================================================

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// [forma, tipo, significado, nivel, se lee como palabra (siglas),
//  plural (solo las siglas de cosas que se pueden contar)]
const BANCO_SIGLAS = [
  ["ONU", "sigla", "[O]rganización de las [N]aciones [U]nidas", "base", true],
  ["UE", "sigla", "[U]nión [E]uropea", "base", false],
  ["ONG", "sigla", "[o]rganización [n]o [g]ubernamental", "base", false, "las ONG"],
  ["DNI", "sigla", "[d]ocumento [n]acional de [i]dentidad", "base", false, "los DNI"],
  ["ADN", "sigla", "[á]cido [d]esoxirribo[n]ucleico", "normal", false],
  ["RAE", "sigla", "[R]eal [A]cademia [E]spañola", "normal", true],
  ["DGT", "sigla", "[D]irección [G]eneral de [T]ráfico", "normal", false],
  ["ESO", "sigla", "[e]ducación [s]ecundaria [o]bligatoria", "base", true],
  ["CEIP", "sigla", "[c]olegio de [e]ducación [i]nfantil y [p]rimaria", "normal", true, "los CEIP"],
  ["AMPA", "sigla", "[a]sociación de [m]adres y [p]adres de [a]lumnos", "normal", true, "las AMPA"],
  ["IVA", "sigla", "[i]mpuesto sobre el [v]alor [a]ñadido", "normal", true],
  ["UCI", "sigla", "[u]nidad de [c]uidados [i]ntensivos", "altas", true, "las UCI"],
  ["OTAN", "sigla", "[O]rganización del [T]ratado del [A]tlántico [N]orte", "altas", true],
  ["Sr.", "abreviatura", "señor", "base"],
  ["Sra.", "abreviatura", "señora", "base"],
  ["Dr.", "abreviatura", "doctor", "base"],
  ["pág.", "abreviatura", "página", "base"],
  ["etc.", "abreviatura", "etcétera", "base"],
  ["Ud.", "abreviatura", "usted", "normal"],
  ["avda.", "abreviatura", "avenida", "normal"],
  ["c/", "abreviatura", "calle", "normal"],
  ["tel.", "abreviatura", "teléfono", "normal"],
  ["n.º", "abreviatura", "número", "normal"],
  ["ej.", "abreviatura", "ejemplo", "normal"],
  ["dcha.", "abreviatura", "derecha", "normal"],
  ["izq.", "abreviatura", "izquierda", "normal"],
  ["aprox.", "abreviatura", "aproximadamente", "altas"],
  ["p. ej.", "abreviatura", "por ejemplo", "altas"],
  ["a. C.", "abreviatura", "antes de Cristo", "altas"],
  ["EE. UU.", "abreviatura", "Estados Unidos", "altas"],
  ["atte.", "abreviatura", "atentamente", "altas"],
  ["km", "símbolo", "kilómetro", "base"],
  ["kg", "símbolo", "kilogramo", "base"],
  ["cm", "símbolo", "centímetro", "normal"],
  ["min", "símbolo", "minuto", "normal"],
  ["h", "símbolo", "hora", "normal"],
  ["€", "símbolo", "euro", "base"],
  ["%", "símbolo", "por ciento", "normal"],
  ["N", "símbolo", "norte", "altas"],
].map(([forma, tipo, marcado, nivel, palabra, plural]) => ({ forma, tipo, marcado, significado: marcado.replace(/[[\]]/g, ""), nivel, palabra: !!palabra, plural }));

// ¿Cuál está bien escrita? Errores frecuentes.
const ERRORES_SIGLAS = [
  { bien: "En mi barrio hay tres ONG.", mal: "En mi barrio hay tres ONGs.", explica: "las siglas no añaden -s en plural: el plural se ve en el artículo (las ONG, los DNI)", nivel: "base" },
  { bien: "Hoy hemos andado 5 km.", mal: "Hoy hemos andado 5 kms.", explica: "los símbolos no llevan punto ni -s de plural: 5 km, 3 kg", nivel: "base" },
  { bien: "Abrid el libro por la pág. 12.", mal: "Abrid el libro por la pag 12.", explica: "la abreviatura termina en punto y conserva la tilde de la palabra: pág. (página)", nivel: "base" },
  { bien: "Necesito el DNI de tu padre.", mal: "Necesito el D.N.I. de tu padre.", explica: "las siglas se escriben sin puntos", nivel: "base" },
  { bien: "El Sr. García vive en el tercero.", mal: "El Sr García vive en el tercero.", explica: "las abreviaturas llevan punto al final: Sr.", nivel: "normal" },
  { bien: "La película dura 2 h.", mal: "La película dura 2 hrs.", explica: "el símbolo de hora es h, sin punto y sin plural", nivel: "normal" },
  { bien: "La ONU se fundó en 1945.", mal: "La O.N.U. se fundó en 1945.", explica: "las siglas se escriben en mayúsculas y sin puntos", nivel: "normal" },
  { bien: "Leed las págs. 10 y 11.", mal: "Leed las pág. 10 y 11.", explica: "el plural de una abreviatura se forma añadiendo -s: págs. (páginas)", nivel: "altas" },
  { bien: "Viaja a EE. UU. en verano.", mal: "Viaja a EE.UU en verano.", explica: "en la abreviatura de Estados Unidos se duplican las letras para indicar plural, y cada parte lleva su punto con un espacio: EE. UU.", nivel: "altas" },
  { bien: "Cuesta 20 € con el IVA.", mal: "Cuesta 20 €. con el IVA.", explica: "los símbolos, como €, nunca llevan punto", nivel: "normal" },
];

const NIVELES_SIGLAS = { acs: ["base"], normal: ["base", "normal"], altas: ["base", "normal", "altas"] };
const TIPOS = ["Sigla", "Abreviatura", "Símbolo"];
const cap = (t) => t[0].toUpperCase() + t.slice(1);

function porQueTipo(e) {
  if (e.tipo === "sigla") return `${e.forma} es una sigla de «${e.significado}»: se forma con las iniciales, en mayúsculas y sin puntos${e.palabra ? ". Como se lee como una palabra, también se llama acrónimo" : ""}.`;
  if (e.tipo === "abreviatura") return `${e.forma} es una abreviatura de «${e.significado}»: es la palabra recortada y termina en punto${e.forma.includes("/") ? " (o con una barra, como c/)" : ""}.`;
  return `${e.forma} es un símbolo de «${e.significado}»: no lleva punto ni cambia en plural.`;
}

function genTipo(niveles, conSimbolos) {
  const pool = BANCO_SIGLAS.filter((e) => niveles.includes(e.nivel) && (conSimbolos || e.tipo !== "símbolo"));
  const e = pick(pool);
  return {
    instruction: conSimbolos ? "¿Es una sigla, una abreviatura o un símbolo?" : "¿Es una sigla o una abreviatura?",
    display: e.forma,
    options: conSimbolos ? TIPOS : TIPOS.slice(0, 2),
    keepOrder: true,
    correct: cap(e.tipo),
    hint: "Sigla: varias mayúsculas, sin puntos. Abreviatura: una palabra recortada con punto. Símbolo: sin punto, como en las medidas (km, kg) o el euro (€).",
    explain: porQueTipo(e),
  };
}

function genSignificado(niveles) {
  const e = pick(BANCO_SIGLAS.filter((x) => niveles.includes(x.nivel)));
  // Distractores del mismo tipo, para que no se descarten por la forma.
  const otros = shuffle(BANCO_SIGLAS.filter((x) => x.tipo === e.tipo && x.significado !== e.significado)).slice(0, 3).map((x) => cap(x.significado));
  return {
    instruction: "¿Qué significa?",
    display: e.forma,
    options: shuffle([cap(e.significado), ...otros]),
    keepOrder: true,
    correct: cap(e.significado),
    hint: e.tipo === "sigla" ? "Cada letra es la inicial de una palabra importante." : "Piensa en qué palabra empieza así.",
    explain: porQueTipo(e),
  };
}

function genEscritura(niveles) {
  const e = pick(ERRORES_SIGLAS.filter((x) => niveles.includes(x.nivel)));
  return {
    instruction: "¿Cuál está bien escrita?",
    display: "",
    options: Math.random() < 0.5 ? [e.bien, e.mal] : [e.mal, e.bien],
    keepOrder: true,
    correct: e.bien,
    hint: "Siglas: sin puntos y sin -s en plural. Abreviaturas: con punto. Símbolos: sin punto ni plural.",
    explain: `<strong>${e.bien}</strong> Recuerda: ${e.explica}.`,
  };
}

const MODE_GROUPS_SIGLAS_ABREVIATURAS = {
  siglaoabrev: [(n) => genTipo(n, n.includes("normal"))],
  significado: [genSignificado],
  escritura: [genEscritura],
};

const SIGLAS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Sigla o abreviatura, con las más conocidas (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja distinguir siglas y abreviaturas muy frecuentes (ONU, DNI, Sr., pág.) y lo que significan, sin los símbolos.",
    example: "«Sr.» → abreviatura de señor",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para distinguir bien las letras y los puntos.",
    example: "«ONU» → sigla → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «¿Sigla, abreviatura o símbolo?» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Mismo nivel que la clase",
    text: "La discalculia afecta al cálculo y al sentido del número, no a la lengua: aquí se practica el mismo contenido que el resto de la clase. Si además hay dificultades de lectura, usa la adaptación de dislexia.",
    example: "Mismas preguntas y mismos pasos que sin adaptación",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Escribirlas bien y las menos frecuentes",
    text: "Empieza en <strong>¿Cuál está bien escrita?</strong> y añade abreviaturas como p. ej., a. C. o EE. UU., sus plurales (págs.) y siglas como UCI u OTAN.",
    example: "«las ONGs» → mal: las siglas no llevan -s (las ONG)",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Sigla o abreviatura? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, SIGLAS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), SIGLAS_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("sg-siglas")) initExplore();
  if (document.getElementById("word-display")) initGame(diff, (fn) => restartCallbacks.push(fn));
});

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

// ============================================================
// EXPLORA: desmontar una sigla
// ============================================================
// En el banco, las letras que forman la sigla van entre corchetes.
function desmontar(e) {
  return e.marcado.replace(/\[(.+?)\]/g, (m, l) => `<strong class="sg-ini">${l.toUpperCase()}</strong>`);
}

function initExplore() {
  const siglas = BANCO_SIGLAS.filter((e) => e.tipo === "sigla");
  let actual = siglas[0].forma;
  const cont = document.getElementById("sg-siglas");
  cont.innerHTML = siglas.map((e) => `<button type="button" class="btn btn-secondary" data-sg="${e.forma}">${e.forma}</button>`).join("");
  function render() {
    cont.querySelectorAll("[data-sg]").forEach((b) => b.classList.toggle("active", b.dataset.sg === actual));
    const e = siglas.find((x) => x.forma === actual);
    document.getElementById("sg-letras").textContent = e.forma.split("").join(" · ");
    document.getElementById("sg-msg").innerHTML = `${desmontar(e)}<br>${e.palabra ? `Se lee como una palabra («${e.forma.toLowerCase()}»): es un <strong>acrónimo</strong>.` : "Se lee letra por letra."}${e.plural ? ` En plural no cambia: ${e.plural}.` : ""}`;
  }
  cont.querySelectorAll("[data-sg]").forEach((b) => b.addEventListener("click", () => { actual = b.dataset.sg; render(); }));
  render();

  let tipo = "sigla";
  const RESUMEN = {
    sigla: "Iniciales de varias palabras, en mayúsculas, <strong>sin puntos</strong>. En plural no añaden -s: las ONG.",
    abreviatura: "Una palabra recortada que termina en <strong>punto</strong> y mantiene la tilde si la tiene (pág.). En plural se añade -s: págs., Sres.",
    símbolo: "Formas fijas de medidas, monedas o puntos cardinales: <strong>sin punto y sin plural</strong> (5 km, 3 kg, 20 €).",
  };
  function renderTipo() {
    document.querySelectorAll("[data-sg-tipo]").forEach((b) => b.classList.toggle("active", b.dataset.sgTipo === tipo));
    const ej = BANCO_SIGLAS.filter((e) => e.tipo === tipo).slice(0, 8).map((e) => `<span class="or-chip">${e.forma} <small>${e.significado}</small></span>`).join("");
    document.getElementById("sg-tipo-ej").innerHTML = ej;
    document.getElementById("sg-tipo-msg").innerHTML = RESUMEN[tipo];
  }
  document.querySelectorAll("[data-sg-tipo]").forEach((b) => b.addEventListener("click", () => { tipo = b.dataset.sgTipo; renderTipo(); }));
  renderTipo();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-siglas"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    hintBtn: document.getElementById("hint-btn"),
    hintBox: document.getElementById("hint-box"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "siglaoabrev";
  let current;
  let lastKey = "";

  function niveles() {
    if (diff.is("acs")) return NIVELES_SIGLAS.acs;
    if (diff.is("altas")) return NIVELES_SIGLAS.altas;
    return NIVELES_SIGLAS.normal;
  }

  function setActiveMode(m) {
    mode = m;
    els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === m));
  }

  function applyDifficultyUI() {
    const acs = diff.is("acs");
    els.modeBtns.forEach((b) => {
      b.disabled = (acs && b.dataset.mode === "escritura") || (b.dataset.mode === "mezcla" && (diff.is("tdah") || acs));
    });
    if (acs && (mode === "escritura" || mode === "mezcla")) setActiveMode("siglaoabrev");
    else if (diff.is("altas")) setActiveMode("escritura");
    else if (diff.is("tdah") && mode === "mezcla") setActiveMode("siglaoabrev");
    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const grupo = mode === "mezcla" ? pick(Object.keys(MODE_GROUPS_SIGLAS_ABREVIATURAS)) : mode;
    let q;
    let tries = 0;
    do {
      q = pick(MODE_GROUPS_SIGLAS_ABREVIATURAS[grupo])(niveles());
      tries++;
    } while ((q.display || q.correct) === lastKey && tries < 10);
    lastKey = q.display || q.correct;
    return q;
  }

  function startRound() {
    current = pickQuestion();
    els.instructions.textContent = current.instruction;
    els.wordDisplay.textContent = current.display;
    els.wordDisplay.style.display = current.display ? "" : "none";

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";
    els.hintBox.classList.remove("show");
    els.hintBox.innerHTML = "";
    els.hintBtn.disabled = false;

    els.answerButtons.innerHTML = "";
    els.answerButtons.classList.toggle("sp-frases", !current.display);
    current.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "syllable-chip";
      btn.textContent = opt;
      btn.addEventListener("click", () => chooseAnswer(opt, btn));
      els.answerButtons.appendChild(btn);
    });
  }

  function chooseAnswer(chosen, btn) {
    const correct = current.correct;
    const isCorrect = chosen === correct;

    if (isCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("siglas-abreviaturas", isCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.answerButtons.querySelectorAll(".syllable-chip").forEach((b) => {
      b.disabled = true;
      if (b.textContent === correct) b.classList.add("correct");
      else if (b === btn && !isCorrect) b.classList.add("incorrect");
    });
    els.hintBtn.disabled = true;

    els.feedback.classList.add("show", isCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `<p class="feedback-title">${isCorrect ? "Correcto" : "No era esa"}</p><p>${current.explain}</p>`;
    els.nextBtn.style.display = "";
  }

  els.modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveMode(btn.dataset.mode);
      startRound();
    });
  });

  els.hintBtn.addEventListener("click", () => {
    els.hintBox.innerHTML = `<strong>Pista:</strong> ${current.hint}`;
    els.hintBox.classList.add("show");
  });
  els.nextBtn.addEventListener("click", startRound);

  applyDifficultyUI();
  startRound();
}

// ---------------- Ficha ----------------
const sinHtml = (t) => t.replace(/<[^>]+>/g, "");
const fichaPoolSiglas = (niveles, conSimbolos) => BANCO_SIGLAS.filter((e) => niveles.includes(e.nivel) && (conSimbolos || e.tipo !== "símbolo")).map((e) => ({
  pregunta: `¿Es ${conSimbolos ? "una sigla, una abreviatura o un símbolo" : "una sigla o una abreviatura"}? ¿Qué significa? ${e.forma}`,
  respuesta: porQueTipo(e),
  opciones: conSimbolos ? TIPOS : TIPOS.slice(0, 2),
}));
const fichaPoolErrores = (niveles) => ERRORES_SIGLAS.filter((e) => niveles.includes(e.nivel)).map((e) => {
  const ab = Math.random() < 0.5 ? [e.bien, e.mal] : [e.mal, e.bien];
  return { pregunta: `¿Cuál está bien escrita? Corrige la otra. a) ${ab[0]}   b) ${ab[1]}`, respuesta: `${ab[0] === e.bien ? "a" : "b"}) ${e.bien} ${cap(e.explica)}.`, opciones: ["a", "b"] };
});
const fichaModoSiglas = (pool) => ({ pool, field: "respuesta", question: (e) => e.pregunta, selfContained: true, answerFn: (e) => sinHtml(e.respuesta), optionsFn: (e) => e.opciones });

registerLenguaFicha("siglas-abreviaturas", {
  label: "Siglas, abreviaturas y símbolos",
  resumen: "Las siglas se forman con las iniciales de varias palabras, en mayúsculas y sin puntos, y no añaden -s en plural (las ONG); si se leen como una palabra son acrónimos (ONU). Las abreviaturas recortan una palabra y terminan en punto (Sr., pág.). Los símbolos no llevan punto ni plural (5 km, 3 kg, 20 €).",
  easyMode: "base",
  altasMode: "escritura",
  defaultMode: ["siglaoabrev", "escritura"],
  pools: {
    base: fichaModoSiglas(fichaPoolSiglas(NIVELES_SIGLAS.acs, false)),
    siglaoabrev: fichaModoSiglas(fichaPoolSiglas(NIVELES_SIGLAS.normal, true)),
    escritura: fichaModoSiglas(fichaPoolErrores(NIVELES_SIGLAS.altas)),
  },
});
