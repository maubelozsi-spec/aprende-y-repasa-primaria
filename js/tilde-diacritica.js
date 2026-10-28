// ============================================================
// Tilde diacrítica (5º y 6º): monosílabos que se distinguen por la
// tilde (él/el, tú/tu, mí/mi, sí/si, té/te, sé/se, dé/de, más/mas) e
// interrogativos y exclamativos (qué, quién, cuál, cómo, dónde,
// cuándo, cuánto). Altas: aún/aun y lo que ya no lleva tilde (solo,
// este, la o entre números).
// - Explora: cada pareja con sus dos usos y el truco para distinguirla.
// - Práctica: frases al azar del banco, sin pistas en el enunciado, con
//   pista (el truco) y explicación. Solo la práctica llama a AppProgress.
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

// ------------------------------------------------------------
// Parejas y trucos
// ------------------------------------------------------------
// clave: la palabra sin tilde, en minúscula.
const PAREJAS = {
  el: { con: "él", sin: "el", conUso: "pronombre: «él llegó»", sinUso: "artículo, acompaña a un nombre: «el perro»", truco: "Si puedes cambiarla por «ella», es él, con tilde." },
  tu: { con: "tú", sin: "tu", conUso: "pronombre: «tú vienes»", sinUso: "posesivo, acompaña a un nombre: «tu casa»", truco: "Si puedes cambiarla por «usted» o «vosotros», es tú, con tilde. Si va delante de un nombre, es tu." },
  mi: { con: "mí", sin: "mi", conUso: "pronombre, después de para, a, de…: «para mí»", sinUso: "posesivo, acompaña a un nombre: «mi libro»", truco: "Si puedes cambiarla por «ti», es mí, con tilde." },
  si: { con: "sí", sin: "si", conUso: "afirmación: «dijo que sí»", sinUso: "condición: «si llueve, no salimos»", truco: "Si es una respuesta afirmativa (se puede cambiar por «claro»), es sí. Si pone una condición, es si." },
  te: { con: "té", sin: "te", conUso: "la bebida: «un té con limón»", sinUso: "pronombre: «te espero»", truco: "Solo lleva tilde cuando es la bebida." },
  se: { con: "sé", sin: "se", conUso: "del verbo saber («yo sé») o ser («sé bueno»)", sinUso: "pronombre: «se peina»", truco: "Si es «yo sé» (saber) o una orden de ser («sé bueno»), lleva tilde." },
  de: { con: "dé", sin: "de", conUso: "del verbo dar: «que te dé la llave»", sinUso: "preposición: «el libro de Ana»", truco: "Si es del verbo dar, lleva tilde." },
  mas: { con: "más", sin: "mas", conUso: "cantidad: «quiero más»", sinUso: "equivale a «pero»: «quiso ir, mas no pudo»", truco: "Si puedes cambiarla por «pero», es mas, sin tilde. Casi siempre es más (cantidad)." },
  aun: { con: "aún", sin: "aun", conUso: "todavía: «aún no ha llegado»", sinUso: "incluso, hasta: «aun así, seguimos»", truco: "Si puedes cambiarla por «todavía», lleva tilde: aún." },
  que: { con: "qué", sin: "que", conUso: "pregunta o exclamación: «¿qué quieres?», «no sé qué hacer»", sinUso: "une dos partes de la frase: «dijo que vendría»", truco: "Lleva tilde si pregunta o exclama, aunque no haya signos («no sé qué hacer»)." },
  quien: { con: "quién", sin: "quien", conUso: "pregunta: «¿quién ha llamado?»", sinUso: "«la persona que»: «quien llegue primero, gana»", truco: "Lleva tilde si pregunta (aunque sea indirecta: «no sé quién es»)." },
  cual: { con: "cuál", sin: "cual", conUso: "pregunta: «¿cuál prefieres?»", sinUso: "«el cual», «la cual»: «la razón por la cual vino»", truco: "Lleva tilde si pregunta." },
  como: { con: "cómo", sin: "como", conUso: "pregunta o exclamación: «¿cómo estás?», «¡cómo llueve!»", sinUso: "modo o comparación: «lo hizo como quiso», «alto como su padre»", truco: "Lleva tilde si pregunta o exclama." },
  donde: { con: "dónde", sin: "donde", conUso: "pregunta: «¿dónde vives?», «pregúntale dónde está»", sinUso: "lugar, sin pregunta: «la casa donde vivo»", truco: "Lleva tilde si pregunta." },
  cuando: { con: "cuándo", sin: "cuando", conUso: "pregunta: «¿cuándo empieza?»", sinUso: "tiempo, sin pregunta: «cuando llegues, llámame»", truco: "Lleva tilde si pregunta." },
  cuanto: { con: "cuánto", sin: "cuanto", conUso: "pregunta o exclamación: «¿cuánto cuesta?»", sinUso: "sin pregunta: «come cuanto quieras»", truco: "Lleva tilde si pregunta o exclama." },
  solo: { con: "sólo", sin: "solo", conUso: "ya no se escribe con tilde", sinUso: "«solo quedan dos», «está solo»", truco: "Desde 2010, solo no lleva tilde nunca." },
  este: { con: "éste", sin: "este", conUso: "ya no se escribe con tilde", sinUso: "«este es mi sitio», «este libro»", truco: "Desde 2010, este, ese y aquel no llevan tilde." },
  o: { con: "ó", sin: "o", conUso: "ya no se escribe con tilde", sinUso: "«3 o 4»", truco: "Desde 2010, la o entre números no lleva tilde." },
};

const INTERROGATIVOS = ["que", "quien", "cual", "como", "donde", "cuando", "cuanto"];

// Frases: la palabra correcta va entre corchetes; tipo «mono»
// (monosílabos) o «inter» (interrogativos y exclamativos).
const FRASES_TILDE = [
  // Monosílabos · base
  ["[Él] llegó tarde a la fiesta.", "el", "base", "Es pronombre: se puede decir «ella llegó tarde»."],
  ["[El] perro está durmiendo.", "el", "base", "Acompaña a un nombre (perro): es el artículo, sin tilde."],
  ["¿[Tú] vienes conmigo?", "tu", "base", "Es pronombre: «¿usted viene conmigo?»."],
  ["Ese es [tu] libro.", "tu", "base", "Va delante de un nombre (libro): es posesivo, sin tilde."],
  ["Este regalo es para [mí].", "mi", "base", "Va después de «para»: se puede decir «para ti». Lleva tilde."],
  ["Este es [mi] cuaderno.", "mi", "base", "Va delante de un nombre (cuaderno): es posesivo, sin tilde."],
  ["Le pregunté si venía y dijo que [sí].", "si", "base", "Es una respuesta afirmativa: sí, con tilde."],
  ["[Si] llueve, nos quedamos en casa.", "si", "base", "Pone una condición: si, sin tilde."],
  ["¿Quieres un [té] con limón?", "te", "base", "Es la bebida: té, con tilde."],
  ["[Te] espero en la puerta.", "te", "base", "Es pronombre (te espero a ti): sin tilde."],
  ["Yo [sé] la respuesta.", "se", "base", "Es del verbo saber (yo sé): con tilde."],
  ["Ana [se] peina cada mañana.", "se", "base", "Es pronombre (se peina): sin tilde."],
  // Monosílabos · normal
  ["Quiero [más] tarta, por favor.", "mas", "normal", "Indica cantidad: más, con tilde."],
  ["El libro [de] Ana está aquí.", "de", "normal", "Es preposición (el libro de Ana): sin tilde."],
  ["Dile que te [dé] la llave.", "de", "normal", "Es del verbo dar (que te dé): con tilde."],
  ["Mi hermano y [él] juegan juntos.", "el", "normal", "Es pronombre: «mi hermano y ella juegan»."],
  ["No [sé] si vendrá.", "se", "normal", "Es del verbo saber (no sé): con tilde."],
  ["Siempre piensa en [sí] mismo.", "si", "normal", "Es pronombre (en sí mismo): con tilde."],
  ["A [mí] me gusta el chocolate.", "mi", "normal", "Va después de «a»: se puede decir «a ti». Lleva tilde."],
  ["[Tu] mochila está en la clase.", "tu", "normal", "Va delante de un nombre (mochila): es posesivo, sin tilde."],
  // Monosílabos · altas
  ["Quiso ir, [mas] no pudo.", "mas", "altas", "Equivale a «pero» (quiso ir, pero no pudo): sin tilde."],
  ["[Sé] bueno con tu hermano.", "se", "altas", "Es una orden del verbo ser (sé bueno): con tilde."],
  ["[Aún] no ha llegado el autobús.", "aun", "altas", "Significa «todavía»: aún, con tilde."],
  ["[Aun] así, seguimos jugando.", "aun", "altas", "Significa «incluso»: aun, sin tilde."],
  ["[Solo] quedan dos galletas.", "solo", "altas", "Desde 2010, solo no lleva tilde nunca."],
  ["[Este] es mi sitio.", "este", "altas", "Desde 2010, este, ese y aquel no llevan tilde."],
  ["¿Quieres 3 [o] 4 caramelos?", "o", "altas", "Desde 2010, la o entre números no lleva tilde."],
  // Interrogativos y exclamativos · base
  ["¿[Qué] quieres comer?", "que", "base", "Pregunta: qué, con tilde."],
  ["Dijo [que] vendría a la fiesta.", "que", "base", "No pregunta: une dos partes de la frase. Sin tilde."],
  ["¿[Dónde] vives?", "donde", "base", "Pregunta: dónde, con tilde."],
  ["La casa [donde] vivo es pequeña.", "donde", "base", "No pregunta: indica el lugar. Sin tilde."],
  ["¡[Qué] alegría verte!", "que", "base", "Exclamación: qué, con tilde."],
  ["¿[Quién] ha llamado?", "quien", "base", "Pregunta: quién, con tilde."],
  ["¿[Cuándo] empieza la película?", "cuando", "base", "Pregunta: cuándo, con tilde."],
  ["[Cuando] llegues, llámame.", "cuando", "base", "No pregunta: indica el momento. Sin tilde."],
  // Interrogativos · normal
  ["No sé [cómo] lo hizo tan rápido.", "como", "normal", "Es una pregunta indirecta (no sé cómo…): lleva tilde aunque no haya signos."],
  ["Lo hizo [como] quiso.", "como", "normal", "No pregunta: indica el modo. Sin tilde."],
  ["¿[Cuánto] cuesta este libro?", "cuanto", "normal", "Pregunta: cuánto, con tilde."],
  ["No sé [qué] hacer con esto.", "que", "normal", "Pregunta indirecta (no sé qué…): lleva tilde."],
  ["Pregúntale [dónde] está el baño.", "donde", "normal", "Pregunta indirecta (pregúntale dónde…): lleva tilde."],
  ["Es tan alto [como] su padre.", "como", "normal", "Compara: sin tilde."],
  ["¿[Cuál] prefieres?", "cual", "normal", "Pregunta: cuál, con tilde."],
  ["El chico [que] vino ayer es mi primo.", "que", "normal", "No pregunta: une dos partes (el chico que vino). Sin tilde."],
  // Interrogativos · altas
  ["Come [cuanto] quieras.", "cuanto", "altas", "No pregunta: significa «todo lo que». Sin tilde."],
  ["Me preguntó [cuál] era mi color favorito.", "cual", "altas", "Pregunta indirecta (me preguntó cuál…): lleva tilde."],
  ["[Quien] llegue primero, gana.", "quien", "altas", "No pregunta: significa «la persona que». Sin tilde."],
  ["¡[Cómo] llueve!", "como", "altas", "Exclamación: cómo, con tilde."],
  ["No sabe [quién] es.", "quien", "altas", "Pregunta indirecta (no sabe quién…): lleva tilde."],
  ["Esa es la razón por la [cual] vino.", "cual", "altas", "No pregunta (la cual): sin tilde."],
].map(([frase, clave, nivel, porque]) => {
  const ok = frase.match(/\[(.+?)\]/)[1];
  const p = PAREJAS[clave];
  // La otra forma, con la misma mayúscula inicial.
  const minus = ok.toLowerCase();
  const otraMin = minus === p.con ? p.sin : p.con;
  const otra = ok[0] !== ok[0].toLowerCase() ? otraMin[0].toUpperCase() + otraMin.slice(1) : otraMin;
  return { frase: frase.replace(/\[.+?\]/, "___"), completa: frase.replace(/[[\]]/g, ""), ok, otra, clave, nivel, porque, tipo: INTERROGATIVOS.includes(clave) ? "inter" : "mono" };
});

const NIVELES_TILDE = { acs: ["base"], normal: ["base", "normal"], altas: ["base", "normal", "altas"] };

function genFraseTilde(tipo, niveles) {
  const f = pick(FRASES_TILDE.filter((x) => (tipo === "todo" || x.tipo === tipo) && niveles.includes(x.nivel)));
  return {
    instruction: "Elige la palabra que completa la frase:",
    display: f.frase,
    options: Math.random() < 0.5 ? [f.ok, f.otra] : [f.otra, f.ok],
    keepOrder: true,
    correct: f.ok,
    hint: PAREJAS[f.clave].truco,
    explain: `<strong>${f.completa}</strong> ${f.porque}`,
  };
}

const TILDEDIACRITICA_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Las parejas más frecuentes (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabajan él/el, tú/tu, mí/mi, sí/si, té/te y sé/se, y las preguntas con qué, dónde, quién y cuándo, en frases cortas y con el truco a mano.",
    example: "«___ perro está durmiendo» → El (acompaña a perro)",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las frases.",
    example: "«¿___ vienes conmigo?» → Tú → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo «Mezcla», para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Él, tú, mí, sí…» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Mismo nivel que la clase",
    text: "La discalculia afecta al cálculo y al sentido del número, no a la lengua: aquí se practica el mismo contenido que el resto de la clase. Si además hay dificultades de lectura, usa la adaptación de dislexia.",
    example: "Mismas preguntas y mismos pasos que sin adaptación",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Preguntas indirectas, aún/aun, mas/más y lo que ya no lleva tilde",
    text: "Se añaden las preguntas indirectas sin signos (me preguntó cuál…), quien y cual sin pregunta, aún/aun, mas (pero) y lo que ya no lleva tilde desde 2010: solo, este y la o entre números.",
    example: "«___ así, seguimos jugando» → Aun (significa «incluso»)",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "Elige la palabra correcta → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, TILDEDIACRITICA_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), TILDEDIACRITICA_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("td-parejas")) initExplore();
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
// EXPLORA: cada pareja, sus dos usos y el truco
// ============================================================
function initExplore() {
  const claves = ["el", "tu", "mi", "si", "te", "se", "de", "mas", "aun", "que", "como", "donde", "cuando", "quien", "cual", "cuanto"];
  let clave = "el";
  const cont = document.getElementById("td-parejas");
  cont.innerHTML = claves.map((c) => `<button type="button" class="btn btn-secondary" data-td="${c}">${PAREJAS[c].con} / ${PAREJAS[c].sin}</button>`).join("");
  function render() {
    cont.querySelectorAll("[data-td]").forEach((b) => b.classList.toggle("active", b.dataset.td === clave));
    const p = PAREJAS[clave];
    const ejemplos = FRASES_TILDE.filter((f) => f.clave === clave);
    const con = ejemplos.filter((f) => f.ok.toLowerCase() === p.con).map((f) => f.completa);
    const sin = ejemplos.filter((f) => f.ok.toLowerCase() === p.sin).map((f) => f.completa);
    document.getElementById("td-detalle").innerHTML = `
      <div class="td-col"><h4>${p.con} <span>(con tilde)</span></h4><p>${p.conUso}</p>${con.map((t) => `<p class="examples">${t}</p>`).join("")}</div>
      <div class="td-col"><h4>${p.sin} <span>(sin tilde)</span></h4><p>${p.sinUso}</p>${sin.map((t) => `<p class="examples">${t}</p>`).join("")}</div>`;
    document.getElementById("td-truco").innerHTML = `<strong>Truco:</strong> ${p.truco}`;
  }
  cont.querySelectorAll("[data-td]").forEach((b) => b.addEventListener("click", () => { clave = b.dataset.td; render(); }));
  render();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-tilde"),
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
  let mode = "diacritica";
  let current;
  let lastKey = "";

  function niveles() {
    if (diff.is("acs")) return NIVELES_TILDE.acs;
    if (diff.is("altas")) return NIVELES_TILDE.altas;
    return NIVELES_TILDE.normal;
  }

  function setActiveMode(m) {
    mode = m;
    els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === m));
  }

  function applyDifficultyUI() {
    els.modeBtns.forEach((b) => {
      b.disabled = b.dataset.mode === "mezcla" && diff.is("tdah");
    });
    if (diff.is("altas")) setActiveMode("exclamativa");
    else if (diff.is("tdah") && mode === "mezcla") setActiveMode("diacritica");
    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    const tipo = { diacritica: "mono", exclamativa: "inter", mezcla: "todo" }[mode];
    let q;
    let tries = 0;
    do {
      q = genFraseTilde(tipo, niveles());
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
    AppProgress.record("tilde-diacritica", isCorrect);
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
const fichaTilde = (tipos, niveles) =>
  FRASES_TILDE.filter((f) => tipos.includes(f.tipo) && niveles.includes(f.nivel)).map((f) => ({
    pregunta: `Completa con «${[f.ok, f.otra].sort().join("» o «")}»: ${f.frase}`,
    respuesta: `${f.completa} ${f.porque}`,
    opciones: [f.ok, f.otra].sort(),
  }));
const fichaModoTilde = (pool) => ({ pool, field: "respuesta", question: (e) => e.pregunta, selfContained: true, answerFn: (e) => e.respuesta, optionsFn: (e) => e.opciones });

registerLenguaFicha("tilde-diacritica", {
  label: "Tilde diacrítica",
  resumen: "La tilde diacrítica distingue palabras que se escriben igual: él (pronombre) / el (artículo), tú / tu, mí / mi, sí (afirmación) / si (condición), té (bebida) / te, sé (saber) / se, dé (dar) / de, más (cantidad) / mas (pero). Qué, quién, cuál, cómo, dónde, cuándo y cuánto llevan tilde cuando preguntan o exclaman, aunque sea sin signos (no sé qué hacer). Solo, este y la o entre números ya no llevan tilde.",
  easyMode: "base",
  altasMode: "altas",
  defaultMode: ["diacritica", "exclamativa"],
  pools: {
    base: fichaModoTilde(fichaTilde(["mono", "inter"], NIVELES_TILDE.acs)),
    diacritica: fichaModoTilde(fichaTilde(["mono"], NIVELES_TILDE.normal)),
    exclamativa: fichaModoTilde(fichaTilde(["inter"], NIVELES_TILDE.normal)),
    altas: fichaModoTilde(fichaTilde(["mono", "inter"], ["altas"])),
  },
});
