// ============================================================
// Loísmo, laísmo y leísmo (6º, SdA 8): lo, la, los, las sustituyen al
// complemento directo (CD) y le, les al indirecto (CI).
// - Explora: la máquina de pronombres (función, género, número, persona
//   o cosa → el pronombre correcto y los errores posibles).
// - Práctica: oraciones del banco, sin pistas en el enunciado, con pista
//   y explicación. Solo la práctica llama a AppProgress.
// Norma (RAE): el leísmo de persona masculina en singular («le vi», a
// Juan) está admitido; el resto de leísmos, el loísmo y el laísmo no.
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

// [oración con el complemento entre corchetes, función, género, número,
//  persona (true) o cosa, oración con el pronombre ({P}), nivel]
const ORACIONES_PRON = [
  ["Compré [el pan] esta mañana.", "CD", "m", "s", false, "{P} compré esta mañana.", "base"],
  ["Leí [la novela] en dos días.", "CD", "f", "s", false, "{P} leí en dos días.", "base"],
  ["Guardé [los juguetes] en la caja.", "CD", "m", "p", false, "{P} guardé en la caja.", "base"],
  ["Regué [las plantas] del balcón.", "CD", "f", "p", false, "{P} regué.", "base"],
  ["Vi [a María] en el parque.", "CD", "f", "s", true, "{P} vi en el parque.", "base"],
  ["Llamé [a mis primas] por teléfono.", "CD", "f", "p", true, "{P} llamé por teléfono.", "normal"],
  ["Saludé [a mis amigos] en la puerta.", "CD", "m", "p", true, "{P} saludé en la puerta.", "normal"],
  ["Esperé [a Juan] en la estación.", "CD", "m", "s", true, "{P} esperé en la estación.", "normal"],
  ["Pintamos [la valla] de verde.", "CD", "f", "s", false, "{P} pintamos de verde.", "normal"],
  ["Escribí [el cuento] en clase.", "CD", "m", "s", false, "{P} escribí en clase.", "normal"],
  ["Regalé flores [a mi madre].", "CI", "f", "s", true, "{P} regalé flores.", "base"],
  ["Escribí una carta [a mi amigo].", "CI", "m", "s", true, "{P} escribí una carta.", "base"],
  ["Conté un secreto [a mis amigos].", "CI", "m", "p", true, "{P} conté un secreto.", "normal"],
  ["Di los deberes [a las profesoras].", "CI", "f", "p", true, "{P} di los deberes.", "normal"],
  ["Pedí ayuda [a mi hermana].", "CI", "f", "s", true, "{P} pedí ayuda.", "base"],
  ["Dije la verdad [a mi padre].", "CI", "m", "s", true, "{P} dije la verdad.", "normal"],
  ["Compré un regalo [a mi abuela].", "CI", "f", "s", true, "{P} compré un regalo.", "normal"],
  ["Enviamos una postal [a los abuelos].", "CI", "m", "p", true, "{P} enviamos una postal.", "normal"],
  ["Puse agua [a las plantas].", "CI", "f", "p", false, "{P} puse agua.", "altas"],
  ["Cambié la rueda [a la bici].", "CI", "f", "s", false, "{P} cambié la rueda.", "altas"],
].map(([frase, fn, g, n, persona, conP, nivel]) => ({ frase, fn, g, n, persona, conP, nivel, sust: frase.match(/\[(.+?)\]/)[1] }));

// Pronombre correcto según función, género y número.
function pronombre(fn, g, n) {
  if (fn === "CI") return n === "p" ? "les" : "le";
  return (g === "m" ? "lo" : "la") + (n === "p" ? "s" : "");
}

const cap = (t) => t[0].toUpperCase() + t.slice(1);
const conPronombre = (o, p) => o.conP.replace("{P}", cap(p));
const limpia = (f) => f.replace(/[[\]]/g, "");

// Qué error es usar el pronombre «p» en esta oración (o «Correcta»).
function errorDe(o, p) {
  const ok = pronombre(o.fn, o.g, o.n);
  if (p === ok) return "Correcta";
  if (o.fn === "CI") return p.startsWith("lo") ? "Loísmo" : "Laísmo";
  // CD sustituido por le/les.
  if (p.startsWith("le")) return o.persona && o.g === "m" && o.n === "s" ? "Leísmo admitido" : "Leísmo";
  return "Otro";
}

function porQue(o) {
  const ok = pronombre(o.fn, o.g, o.n);
  return o.fn === "CD"
    ? `«${o.sust}» es el complemento directo: recibe directamente la acción del verbo. Se sustituye por ${ok} (${o.g === "m" ? "masculino" : "femenino"}, ${o.n === "s" ? "singular" : "plural"}).`
    : `«${o.sust}» es el complemento indirecto: a quién o para quién se hace algo. Se sustituye por ${ok}, sea masculino o femenino.`;
}

const NIVELES_PRON = { acs: ["base"], normal: ["base", "normal"], altas: ["base", "normal", "altas"] };

// 1. Sustituir el complemento por el pronombre.
function genSustituir(niveles) {
  const o = pick(ORACIONES_PRON.filter((x) => niveles.includes(x.nivel)));
  const ok = pronombre(o.fn, o.g, o.n);
  const opciones = o.n === "s" ? ["lo", "la", "le"] : ["los", "las", "les"];
  return {
    instruction: `¿Qué pronombre sustituye a «${o.sust}»?`,
    display: limpia(o.frase),
    options: opciones.map(cap),
    keepOrder: true,
    correct: cap(ok),
    hint: "¿Es lo que se compra, se lee, se ve… (complemento directo: lo, la, los, las) o a quién o para quién se hace algo (complemento indirecto: le, les)?",
    explain: `${porQue(o)} → <strong>${conPronombre(o, ok)}</strong>${o.fn === "CD" && o.persona && o.g === "m" && o.n === "s" ? " (También se admite «le», pero lo recomendado es «lo».)" : ""}`,
  };
}

// 2. ¿Está bien usado el pronombre?
function genDetectar(niveles) {
  const o = pick(ORACIONES_PRON.filter((x) => niveles.includes(x.nivel)));
  const ok = pronombre(o.fn, o.g, o.n);
  let candidatos;
  if (o.fn === "CI") candidatos = [ok, o.n === "p" ? "los" : "lo", o.n === "p" ? "las" : "la"];
  // El leísmo admitido (persona masculina singular) no se pregunta.
  else candidatos = o.persona && o.g === "m" && o.n === "s" ? [ok] : [ok, o.n === "p" ? "les" : "le"];
  const usado = Math.random() < 0.35 ? ok : pick(candidatos);
  const correct = errorDe(o, usado);
  return {
    instruction: "¿Está bien usado el pronombre?",
    display: `${limpia(o.frase)} → ${conPronombre(o, usado)}`,
    options: ["Correcta", "Loísmo", "Laísmo", "Leísmo"],
    keepOrder: true,
    correct,
    hint: "Mira a quién sustituye el pronombre. Complemento directo: lo, la, los, las. Complemento indirecto: le, les.",
    explain: `${porQue(o)} ${correct === "Correcta" ? "Está bien usado." : `Usar «${usado}» es <strong>${correct.toLowerCase()}</strong>: lo correcto es <strong>${conPronombre(o, ok)}</strong>`}`,
  };
}

const MODE_GROUPS_LOISMO_LAISMO_LEISMO = {
  completar: [genSustituir],
  identificarerror: [genDetectar],
};

const LOISMO_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo sustituir por lo, la o le (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo sustituir el complemento por el pronombre, con oraciones cortas, sin poner nombre a los errores.",
    example: "Compré el pan → Lo compré",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las frases.",
    example: "Vi a María → La vi → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Sustituir por lo, la o le» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Mismo nivel que la clase",
    text: "La discalculia afecta al cálculo y al sentido del número, no a la lengua: aquí se practica el mismo contenido que el resto de la clase. Si además hay dificultades de lectura, usa la adaptación de dislexia.",
    example: "Mismas preguntas y mismos pasos que sin adaptación",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Detectar el error y complementos indirectos de cosa",
    text: "Empieza en <strong>¿Está bien usado?</strong> y añade complementos indirectos que son cosas («puse agua a las plantas» → les puse agua).",
    example: "«Cambié la rueda a la bici» → le cambié la rueda (no la)",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Qué pronombre? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, LOISMO_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), LOISMO_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("lo-maquina")) initExplore();
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
// EXPLORA: la máquina de pronombres
// ============================================================
function initExplore() {
  const estado = { fn: "CD", g: "m", n: "s", p: "cosa" };
  function render() {
    document.querySelectorAll("[data-lo]").forEach((b) => {
      const [k, v] = b.dataset.lo.split(":");
      b.classList.toggle("active", estado[k] === v);
    });
    const ok = pronombre(estado.fn, estado.g, estado.n);
    const ej = ORACIONES_PRON.find((o) => o.fn === estado.fn && o.g === estado.g && o.n === estado.n && o.persona === (estado.p === "persona"));
    const o = ej || { fn: estado.fn, g: estado.g, n: estado.n, persona: estado.p === "persona" };
    const malos = (estado.fn === "CI" ? [estado.n === "p" ? "los" : "lo", estado.n === "p" ? "las" : "la"] : [estado.n === "p" ? "les" : "le"]).map((p) => `«${p}» sería <strong>${errorDe(o, p).toLowerCase()}</strong>`);
    document.getElementById("lo-pron").textContent = ok;
    document.getElementById("lo-msg").innerHTML =
      `Un complemento ${estado.fn === "CD" ? "directo" : "indirecto"} ${estado.g === "m" ? "masculino" : "femenino"} ${estado.n === "s" ? "singular" : "plural"} se sustituye por <strong>${ok}</strong>.` +
      (ej ? `<br>${limpia(ej.frase)} → <strong>${conPronombre(ej, ok)}</strong>` : "") +
      `<br>${malos.join("; ")}.` +
      (estado.fn === "CI" ? "<br>En el complemento indirecto da igual el género: siempre le o les." : "") +
      (estado.fn === "CD" && estado.g === "m" && estado.n === "s" && estado.p === "persona" ? "<br>Con una persona masculina, la RAE admite «le» (le vi a Juan), aunque lo recomendado es «lo»." : "");
  }
  document.querySelectorAll("[data-lo]").forEach((b) => b.addEventListener("click", () => {
    const [k, v] = b.dataset.lo.split(":");
    estado[k] = v;
    render();
  }));
  render();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-loismo"),
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
  let mode = "completar";
  let current;
  let lastKey = "";

  function niveles() {
    if (diff.is("acs")) return NIVELES_PRON.acs;
    if (diff.is("altas")) return NIVELES_PRON.altas;
    return NIVELES_PRON.normal;
  }

  function setActiveMode(m) {
    mode = m;
    els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === m));
  }

  function applyDifficultyUI() {
    const acs = diff.is("acs");
    els.modeBtns.forEach((b) => {
      b.disabled = acs || (b.dataset.mode === "mezcla" && diff.is("tdah"));
    });
    if (acs) setActiveMode("completar");
    else if (diff.is("altas")) setActiveMode("identificarerror");
    else if (diff.is("tdah") && mode === "mezcla") setActiveMode("completar");
    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const grupo = mode === "mezcla" ? pick(Object.keys(MODE_GROUPS_LOISMO_LAISMO_LEISMO)) : mode;
    let q;
    let tries = 0;
    do {
      q = pick(MODE_GROUPS_LOISMO_LAISMO_LEISMO[grupo])(niveles());
      tries++;
    } while (q.display === lastKey && tries < 10);
    lastKey = q.display;
    return q;
  }

  function startRound() {
    current = pickQuestion();
    els.instructions.textContent = current.instruction;
    els.wordDisplay.textContent = current.display;

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";
    els.hintBox.classList.remove("show");
    els.hintBox.innerHTML = "";
    els.hintBtn.disabled = false;

    els.answerButtons.innerHTML = "";
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
    AppProgress.record("loismo-laismo-leismo", isCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.answerButtons.querySelectorAll(".syllable-chip").forEach((b) => {
      b.disabled = true;
      if (b.textContent === correct) b.classList.add("correct");
      else if (b === btn && !isCorrect) b.classList.add("incorrect");
    });
    els.hintBtn.disabled = true;

    els.feedback.classList.add("show", isCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `<p class="feedback-title">${isCorrect ? "Correcto" : `No era esa: es «${correct}»`}</p><p>${current.explain}</p>`;
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
const sinEtiquetas = (t) => t.replace(/<[^>]+>/g, "");
function fichaSustituir(niveles) {
  return ORACIONES_PRON.filter((o) => niveles.includes(o.nivel)).map((o) => {
    const ok = pronombre(o.fn, o.g, o.n);
    return {
      pregunta: `Sustituye «${o.sust}» por un pronombre (lo, la, los, las, le o les): ${limpia(o.frase)}`,
      respuesta: `${conPronombre(o, ok)} ${sinEtiquetas(porQue(o))}`,
      opciones: (o.n === "s" ? ["lo", "la", "le"] : ["los", "las", "les"]),
    };
  });
}
function fichaDetectar(niveles) {
  const out = [];
  ORACIONES_PRON.filter((o) => niveles.includes(o.nivel)).forEach((o) => {
    const ok = pronombre(o.fn, o.g, o.n);
    const mal = o.fn === "CI" ? (o.g === "m" ? (o.n === "p" ? "los" : "lo") : o.n === "p" ? "las" : "la") : o.persona && o.g === "m" && o.n === "s" ? null : o.n === "p" ? "les" : "le";
    if (!mal) return;
    out.push({
      pregunta: `¿Está bien usado el pronombre? Si no, corrígelo y di si es loísmo, laísmo o leísmo: «${conPronombre(o, mal)}» (${limpia(o.frase)})`,
      respuesta: `${errorDe(o, mal)}. Lo correcto: ${conPronombre(o, ok)}`,
      opciones: ["Correcta", "Loísmo", "Laísmo", "Leísmo"],
    });
  });
  return out;
}
const fichaModoPron = (pool) => ({ pool, field: "respuesta", question: (e) => e.pregunta, selfContained: true, answerFn: (e) => e.respuesta, optionsFn: (e) => e.opciones });

registerLenguaFicha("loismo-laismo-leismo", {
  label: "Loísmo, laísmo y leísmo",
  resumen: "Lo, la, los y las sustituyen al complemento directo (Compré el pan → Lo compré). Le y les sustituyen al complemento indirecto, sea masculino o femenino (Regalé flores a mi madre → Le regalé flores). Usar lo o la en lugar de le es loísmo o laísmo; usar le en lugar de lo o la es leísmo. La RAE solo admite el leísmo con una persona masculina en singular (le vi a Juan).",
  easyMode: "completarBase",
  altasMode: "identificarerror",
  defaultMode: ["completar", "identificarerror"],
  pools: {
    completarBase: fichaModoPron(fichaSustituir(NIVELES_PRON.acs)),
    completar: fichaModoPron(fichaSustituir(NIVELES_PRON.normal)),
    identificarerror: fichaModoPron(fichaDetectar(NIVELES_PRON.altas)),
  },
});
