// ============================================================
// Acentuación: lógica del artefacto interactivo de 4 pasos.
// El banco de palabras está en js/acentuacion-banco.js.
// ============================================================

// El banco de palabras vive en js/acentuacion-banco.js, compartido con
// lengua/juego-acentuacion.html. Para añadir palabras, edita ese archivo:
// esta ficha las recoge automáticamente.
if (!window.ACENTUACION_BANCO) {
  throw new Error(
    "Falta js/acentuacion-banco.js. Toda página que cargue js/ortografia.js " +
    "tiene que cargar antes el banco de palabras."
  );
}
const WORDS = window.ACENTUACION_BANCO.WORDS;

const computeType = window.ACENTUACION_BANCO.computeType;

// Tope de sílabas del pool sencillo (ACS): deja fuera las
// palabras largas del banco compartido (espectáculo, devuélvemelo) sin tocar
// el resto de perfiles. Baja el número para acortar más las palabras.
const EASY_MAX_SILABAS = 4;

const EASY_WORDS = WORDS.filter(
  (w) =>
    !["triptongo", "hiato_acentual"].includes(w.vowelGroup) &&
    computeType(w.syllables.length, w.stress) !== "sobresdrujula" &&
    w.syllables.length <= EASY_MAX_SILABAS
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
    title: "Mismo nivel que la clase",
    text: "La discalculia afecta al cálculo y al sentido del número, no a la lengua: aquí se practica el mismo contenido que el resto de la clase. Si además hay dificultades de lectura, usa la adaptación de dislexia.",
    example: "Mismas preguntas y mismos pasos que sin adaptación",
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

  if (document.getElementById("ac-maquina")) initExplore();
  if (document.getElementById("word-display")) {
    initGame(diff, (fn) => restartCallbacks.push(fn));
  }
});

// ------------------------------------------------------------
// Reglas (compartidas por Explora y la explicación final)
// ------------------------------------------------------------
const TIPO_NOMBRE = { aguda: "aguda", llana: "llana", esdrujula: "esdrújula", sobresdrujula: "sobresdrújula", monosilaba: "monosílaba" };

// «vocal», «n», «s» u «otra» según la última letra (la y final cuenta
// como consonante: Uruguay, estoy).
function claseFinal(palabra) {
  const u = palabra.slice(-1).toLowerCase();
  if ("aeiouáéíóú".includes(u)) return "vocal";
  if (u === "n" || u === "s") return u;
  return "otra";
}

function llevaTildePorRegla(tipo, fin) {
  if (tipo === "esdrujula" || tipo === "sobresdrujula") return true;
  if (tipo === "monosilaba") return false;
  const vns = fin !== "otra";
  return tipo === "aguda" ? vns : !vns;
}

function textoRegla(tipo) {
  return {
    aguda: "Las agudas llevan tilde si acaban en vocal, n o s.",
    llana: "Las llanas llevan tilde si NO acaban en vocal, n o s.",
    esdrujula: "Las esdrújulas llevan tilde siempre.",
    sobresdrujula: "Las sobresdrújulas llevan tilde siempre.",
  }[tipo];
}

const VOCALES_FUERTES = "aeo";

// Dos vocales seguidas: «diptongo», «hiato» o «hiato_acentual».
function grupoDeVocales(v1, v2, debilTonica) {
  const f1 = VOCALES_FUERTES.includes(v1);
  const f2 = VOCALES_FUERTES.includes(v2);
  if (v1 === v2) return "hiato";
  if (f1 && f2) return "hiato";
  if (f1 !== f2) return debilTonica ? "hiato_acentual" : "diptongo";
  return "diptongo";
}

// ============================================================
// EXPLORA
// ============================================================
function initExplore() {
  let tipo = "aguda";
  let fin = "n";
  const sinTilde = (w) => window.ACENTUACION_BANCO.quitarTilde(w);
  function renderMaquina() {
    document.querySelectorAll("[data-ac-tipo]").forEach((b) => b.classList.toggle("active", b.dataset.acTipo === tipo));
    document.querySelectorAll("[data-ac-fin]").forEach((b) => b.classList.toggle("active", b.dataset.acFin === fin));
    const lleva = llevaTildePorRegla(tipo, fin);
    const ejemplos = WORDS.filter((w) => w.tipo === tipo && w.vowelGroup !== "hiato_acentual" && claseFinal(w.plain) === fin).map((w) => w.accented);
    const finTxt = { vocal: "en vocal", n: "en n", s: "en s", otra: "en otra consonante" }[fin];
    document.getElementById("ac-maquina-msg").innerHTML =
      `Una palabra <strong>${TIPO_NOMBRE[tipo]}</strong> que acaba ${finTxt} <strong>${lleva ? "lleva tilde" : "no lleva tilde"}</strong>. ${textoRegla(tipo)}` +
      (ejemplos.length ? `<br>Ejemplos: ${lenguaShuffle(ejemplos).slice(0, 4).join(", ")}.` : "") +
      (tipo === "aguda" && fin === "otra" ? "<br>Ojo: la y final cuenta como consonante (Uruguay, estoy)." : "");
  }
  document.querySelectorAll("[data-ac-tipo]").forEach((b) => b.addEventListener("click", () => { tipo = b.dataset.acTipo; renderMaquina(); }));
  document.querySelectorAll("[data-ac-fin]").forEach((b) => b.addEventListener("click", () => { fin = b.dataset.acFin; renderMaquina(); }));

  let v1 = "i";
  let v2 = "e";
  let fuerza = false;
  function renderVocales() {
    document.querySelectorAll("[data-ac-v1]").forEach((b) => b.classList.toggle("active", b.dataset.acV1 === v1));
    document.querySelectorAll("[data-ac-v2]").forEach((b) => b.classList.toggle("active", b.dataset.acV2 === v2));
    const mixta = VOCALES_FUERTES.includes(v1) !== VOCALES_FUERTES.includes(v2);
    const btn = document.getElementById("ac-fuerza");
    btn.disabled = !mixta;
    if (!mixta) fuerza = false;
    btn.textContent = `La i o la u suenan con fuerza: ${fuerza ? "sí" : "no"}`;
    const g = grupoDeVocales(v1, v2, fuerza);
    const debil = VOCALES_FUERTES.includes(v1) ? v2 : v1;
    const par = fuerza ? (debil === v1 ? `${{ i: "í", u: "ú" }[v1]}${v2}` : `${v1}${{ i: "í", u: "ú" }[v2]}`) : `${v1}${v2}`;
    document.getElementById("ac-par").textContent = g === "diptongo" ? par : `${par[0]} · ${par.slice(1)}`;
    const ej = WORDS.filter((w) => w.vowelGroup === g && sinTilde(w.groupLetters).toLowerCase() === `${v1}${v2}`).map((w) => w.silabas.join("·"));
    const txt = {
      diptongo: VOCALES_FUERTES.includes(v1) || VOCALES_FUERTES.includes(v2)
        ? "<strong>Diptongo</strong>: una vocal fuerte (a, e, o) y una débil (i, u) que no suena con fuerza van en la misma sílaba."
        : "<strong>Diptongo</strong>: dos vocales débiles distintas (i, u) van en la misma sílaba.",
      hiato: v1 === v2 ? "<strong>Hiato</strong>: dos vocales iguales se separan en dos sílabas (le·er, chi·i·ta)." : "<strong>Hiato</strong>: dos vocales fuertes (a, e, o) se separan en dos sílabas.",
      hiato_acentual: "<strong>Hiato acentual</strong>: la i o la u suena con fuerza, se separa de la otra vocal y <strong>siempre lleva tilde</strong>, aunque la regla general no lo pida (ra·íz, dí·a).",
    }[g];
    document.getElementById("ac-vocales-msg").innerHTML = txt + (ej.length ? `<br>Ejemplos: ${lenguaShuffle(ej).slice(0, 3).join(", ")}.` : "");
  }
  document.querySelectorAll("[data-ac-v1]").forEach((b) => b.addEventListener("click", () => { v1 = b.dataset.acV1; renderVocales(); }));
  document.querySelectorAll("[data-ac-v2]").forEach((b) => b.addEventListener("click", () => { v2 = b.dataset.acV2; renderVocales(); }));
  document.getElementById("ac-fuerza").addEventListener("click", () => { fuerza = !fuerza; renderVocales(); });

  renderMaquina();
  renderVocales();
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
    card: document.getElementById("practica-ortografia"),
    wordDisplay: document.getElementById("word-display"),
    wordPanel: document.getElementById("word-panel"),
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
    hintBtn: document.getElementById("hint-btn"),
    hintBox: document.getElementById("hint-box"),
    instructionEls: document.querySelectorAll(".instructions"),
  };

  const originalInstructions = [...els.instructionEls].map((el) => el.textContent);

  let scoreOk = 0;
  let scoreKo = 0;
  let lastWord = null;
  let current, dividers, syllableAttempts, roundOk, skippedVowelGroup;
  // Paso en el que está el alumno: decide qué pista se enseña.
  let paso = "silabas";

  const PISTAS = {
    silabas: "Di la palabra despacio dando una palmada en cada golpe de voz. Cada sílaba tiene al menos una vocal. No se separan: pr, bl, tr…, ni ch, ll, rr.",
    tonica: "Dila en voz alta como si llamaras a alguien desde lejos: la sílaba que alargas es la tónica.",
    tilde: "Mira dónde está la fuerza (última, penúltima, antepenúltima) y en qué letra acaba la palabra. Agudas: tilde si acaban en vocal, n o s. Llanas: al revés. Esdrújulas y sobresdrújulas: siempre.",
    vocales: "Busca dos o tres vocales seguidas. Fuertes: a, e, o. Débiles: i, u. Si van en el mismo golpe de voz es diptongo (o triptongo, con tres); si se separan, hiato. Ojo: en que, qui, gue, gui la u no suena.",
  };
  function showHint() {
    if (!els.hintBox) return;
    els.hintBox.innerHTML = `<strong>Pista:</strong> ${PISTAS[paso]}`;
    els.hintBox.classList.add("show");
  }
  function hideHint() {
    if (!els.hintBox) return;
    els.hintBox.classList.remove("show");
    els.hintBox.innerHTML = "";
    els.hintBtn.disabled = false;
  }

  function isEasyOnly() {
    return diff.is("acs");
  }

  function currentPool() {
    if (isEasyOnly()) return EASY_WORDS;
    if (diff.is("altas")) return ALTAS_WORDS;
    return WORDS;
  }

  function applyDifficultyUI() {
    els.instructionEls.forEach((el, i) => {
      el.textContent = originalInstructions[i];
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

  // La palabra se queda a la vista en los pasos 2, 3 y 4: sin ella
  // delante cuesta mucho más decidir si lleva tilde o qué grupo de
  // vocales tiene. Cada paso enseña solo lo que ya se ha resuelto:
  //   "sílabas"  → la palabra y su separación (paso 2).
  //   "tónica"   → además, la sílaba tónica resaltada (paso 3). Sin
  //                tilde todavía: enseñarla daría la respuesta.
  //   "tilde"    → ya con su tilde, si la lleva (paso 4 y final).
  function renderWordPanel(fase) {
    if (!els.wordPanel) return;
    const conTilde = fase === "tilde";
    const palabra = conTilde ? current.accented : current.plain;

    // Las sílabas del banco vienen sin tilde; las de la palabra
    // acentuada se sacan cortando por las mismas longitudes.
    let pos = 0;
    const silabas = current.syllables.map((s) => {
      const trozo = conTilde ? current.accented.slice(pos, pos + s.length) : s;
      pos += s.length;
      return trozo;
    });

    els.wordPanel.innerHTML = "";
    const palabraEl = document.createElement("span");
    palabraEl.className = "word-panel-word";
    palabraEl.textContent = palabra.toUpperCase();
    els.wordPanel.appendChild(palabraEl);

    const silabasEl = document.createElement("span");
    silabasEl.className = "word-panel-syllables";
    silabas.forEach((s, i) => {
      if (i > 0) silabasEl.appendChild(document.createTextNode(" - "));
      const sil = document.createElement("span");
      sil.textContent = s.toUpperCase();
      if (fase !== "sílabas" && i === current.stress) sil.className = "word-panel-tonica";
      silabasEl.appendChild(sil);
    });
    els.wordPanel.appendChild(silabasEl);
    els.wordPanel.style.display = "";
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
    if (els.wordPanel) els.wordPanel.style.display = "none";
    els.checkSyllablesBtn.disabled = false;
    setProgress(0);
    paso = "silabas";
    hideHint();

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
    paso = "tonica";
    hideHint();
    els.stepSyllables.style.display = "none";
    els.stepStress.style.display = "";
    els.syllableRow.innerHTML = "";
    renderWordPanel("sílabas");

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
    paso = "tilde";
    hideHint();
    els.stepStress.style.display = "none";
    els.stepTilde.style.display = "";
    renderWordPanel("tónica");
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
    paso = "vocales";
    hideHint();
    els.stepTilde.style.display = "none";
    els.stepVowelgroup.style.display = "";
    renderWordPanel("tilde");
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
    hideHint();
    if (els.hintBtn) els.hintBtn.disabled = true;
    els.stepTilde.style.display = "none";
    els.stepVowelgroup.style.display = "none";
    renderWordPanel("tilde");

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
      const ultima = current.plain.slice(-1);
      const fin = claseFinal(current.plain);
      const porFinal = type === "aguda" || type === "llana" ? ` y acaba en «${ultima}»${ultima === "y" ? " (la y final cuenta como consonante)" : fin === "otra" ? ", que no es vocal, n ni s" : ""}` : "";
      ruleText = `Es una palabra <strong>${typeNames[type]}</strong>${porFinal}: ${textoRegla(type).charAt(0).toLowerCase()}${textoRegla(type).slice(1, -1)}. Por eso <strong>${current.tilde ? "lleva tilde" : "no lleva tilde"}</strong>.`;
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
    if (/qu[ei]|gu[ei]/.test(current.plain)) {
      vgText += " Ojo: en «que», «qui», «gue» y «gui» la u no suena, así que no forma diptongo.";
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
  if (els.hintBtn) els.hintBtn.addEventListener("click", showHint);

  applyDifficultyUI();
  startRound();
}

function ortografiaFichaType(entry) {
  const len = entry.syllables.length;
  if (len === 1) return "monosílaba";
  const diff = (len - 1) - entry.stress;
  if (diff === 0) return "aguda";
  if (diff === 1) return "llana";
  if (diff === 2) return "esdrújula";
  return "sobresdrújula";
}

const ORTOGRAFIA_VOWEL_TILDES = { a: "á", e: "é", i: "í", o: "ó", u: "ú" };

function ortografiaFichaOptions(entry) {
  if (entry.accented !== entry.plain) return lenguaShuffle([entry.accented, entry.plain]);
  const wrongAccented = entry.plain.replace(/[aeiou](?!.*[aeiou])/i, (m) => ORTOGRAFIA_VOWEL_TILDES[m] || m);
  return lenguaShuffle([entry.accented, wrongAccented]);
}

registerLenguaFicha("ortografia", {
  label: "Acentuación",
  resumen: "Toda palabra tiene una sílaba tónica; según dónde caiga y en qué letra termine la palabra, llevará tilde o no.",
  easyMode: "facil",
  altasMode: "dificil",
  pools: {
    facil: {
      pool: EASY_WORDS,
      question: (e) => `Separa en sílabas la palabra «${e.plain}», di si es aguda, llana o esdrújula, y escribe su forma correcta (con o sin tilde).`,
      selfContained: true,
      answerFn: (e) => `${e.syllables.join("-")} (${ortografiaFichaType(e)}) → ${e.accented}`,
      optionsFn: (e) => ortografiaFichaOptions(e),
    },
    dificil: {
      pool: ALTAS_WORDS,
      question: (e) => `Separa en sílabas la palabra «${e.plain}», clasifícala (aguda, llana, esdrújula o sobresdrújula) y di si tiene diptongo, hiato o triptongo.`,
      selfContained: true,
      answerFn: (e) => `${e.syllables.join("-")} (${ortografiaFichaType(e)}) → ${e.accented}. Grupo vocálico: ${e.vowelGroup === "ninguno" ? "ninguno" : e.vowelGroup}.`,
      optionsFn: (e) => ortografiaFichaOptions(e),
    },
  },
});
