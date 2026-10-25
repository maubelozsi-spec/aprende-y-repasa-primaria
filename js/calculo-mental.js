// ============================================================
// Página de Cálculo mental: pestañas (Teoría/Explora/Práctica/
// Ficha), el truco paso a paso, el juego de práctica (un truco por
// vez, respuesta escrita o eligiendo) y el generador de fichas en
// Word con su hoja de soluciones. Solo la práctica llama a
// AppProgress.
// ============================================================

const CALCMENTAL_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Los trucos más sencillos, con números de dos cifras",
    text: "Para el alumnado con adaptación curricular significativa se practican los trucos de sumas y restas del Bloque 1, los dobles, las mitades y multiplicar por 10, con números pequeños y la pista a la vista. La ficha también se adapta.",
    example: "100 − 87 → ¿qué le falta a 87 para llegar a 100? 13",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantienen los mismos trucos, pero con una tipografía más legible para leer las operaciones y las pistas.",
    example: "58 + 36 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo truco cada vez, sin mezclar",
    text: "Se practica siempre con un <strong>truco concreto</strong> (nunca todos mezclados), para no ir cambiando constantemente de estrategia y mantener mejor la atención.",
    example: "Practicando solo «Compensación en la suma» hasta que cambies de truco tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todos los trucos, con números más pequeños y la pista a la vista",
    text: "Se pueden practicar todos los trucos (sin «Mezcla»), con números más pequeños y la pista abierta desde el principio. En Explora, cada truco se ve paso a paso. La ficha usa los mismos números pequeños.",
    example: "47 + 9 → Pista: suma 10 y resta 1",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Todos los trucos mezclados y con números mayores",
    text: "Se practica directamente en modo <strong>«Mezcla»</strong>, con números más grandes en todos los trucos. La ficha también usa números mayores.",
    example: "3.468 + 997 → suma 1.000 y resta 3",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Responde eligiendo, sin escribir",
    text: "En vez de escribir el número, se elige la respuesta entre varias opciones con un solo clic.",
    example: "58 + 36 = ? → elige entre 94, 84, 104, 98",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabsCM();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, CALCMENTAL_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), CALCMENTAL_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("cm-ex-trucos")) initExploraCM();
  initPracticaCM(diff, (fn) => restartCallbacks.push(fn));
  initFichaCM(diff);
});

// Nivel de los números según la adaptación.
function nivelCM(diff) {
  if (diff.is("acs")) return "acs";
  if (diff.is("discalculia")) return "facil";
  if (diff.is("altas")) return "altas";
  return "normal";
}

// Lee lo que escribe el alumno: admite «1.234», «3,45» y «3.45».
function parseRespuestaCM(texto) {
  let t = String(texto).trim().replace(/\s/g, "");
  if (!t) return NaN;
  if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, "");
  return Number(t);
}

const igualCM = (a, b) => Math.abs(a - b) < 1e-9;

// Opciones para elegir: primero los errores típicos del truco, después cercanos.
function opcionesCM(ej) {
  const r = ej.respuesta;
  const out = [];
  const add = (v) => {
    if (Number.isFinite(v) && v >= 0 && !igualCM(v, r) && !out.some((x) => igualCM(x, v))) out.push(v);
  };
  (ej.errores || []).forEach(add);
  const cerca = Number.isInteger(r) ? [r + 10, r - 10, r + 1, r - 1, r + 100, r + 2] : [r * 10, r / 10, r + 1, r - 1, r + 0.1].map((v) => Math.round(v * 100000) / 100000);
  cerca.forEach((v) => out.length < 3 && add(v));
  return shuffleArrayCM([r, ...out.slice(0, 3)]);
}

function shuffleArrayCM(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function initTabsCM() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = {
    teoria: document.getElementById("tab-teoria"),
    explora: document.getElementById("tab-explora"),
    practica: document.getElementById("tab-practica"),
    ficha: document.getElementById("tab-ficha"),
  };
  if (tabBtns.length === 0) return;

  function activateTab(name) {
    tabBtns.forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
    Object.entries(panels).forEach(([key, el]) => el && el.classList.toggle("active", key === name));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  tabBtns.forEach((btn) => btn.addEventListener("click", () => activateTab(btn.dataset.tab)));

  ["go-to-practice", "go-to-practice-2"].forEach((id) => {
    const goBtn = document.getElementById(id);
    if (goBtn) goBtn.addEventListener("click", () => activateTab("practica"));
  });
}

// ============================================================
// EXPLORA: el truco paso a paso
// ============================================================
function initExploraCM() {
  const picker = document.getElementById("cm-ex-trucos");
  const exprEl = document.getElementById("cm-ex-expr");
  const pasosEl = document.getElementById("cm-ex-pasos");
  const sigBtn = document.getElementById("cm-ex-sig");
  let truco = TRUCOS_CALCULO_MENTAL[0];
  let ej;
  let mostrados = 0;

  BLOQUES_CALCULO_MENTAL.forEach((bloque) => {
    const grupo = document.createElement("optgroup");
    grupo.label = bloque.label;
    trucosDeBloque(bloque.id).forEach((t) => {
      const o = document.createElement("option");
      o.value = t.id;
      o.textContent = t.label;
      grupo.appendChild(o);
    });
    picker.appendChild(grupo);
  });

  function nuevo() {
    ej = truco.generar("normal");
    mostrados = 0;
    render();
  }
  function render() {
    exprEl.textContent = `${ej.enunciado}${ej.estimacion ? "" : " ="} ?`;
    pasosEl.innerHTML = ej.pasos
      .slice(0, mostrados)
      .map((p, i) => `<li class="${i === mostrados - 1 ? "cm-paso-nuevo" : ""}">${p}</li>`)
      .join("");
    const fin = mostrados >= ej.pasos.length;
    sigBtn.disabled = fin;
    document.getElementById("cm-ex-msg").innerHTML = fin
      ? `<strong>${ej.enunciado}${ej.estimacion ? "" : " ="} ${cmFmt(ej.respuesta)}</strong>. Truco: ${ej.pista}`
      : mostrados === 0
        ? `Truco: ${ej.pista} Pulsa «Siguiente paso».`
        : "Pulsa «Siguiente paso» para seguir.";
  }
  picker.addEventListener("change", () => {
    truco = TRUCOS_CALCULO_MENTAL.find((t) => t.id === picker.value);
    nuevo();
  });
  sigBtn.addEventListener("click", () => {
    mostrados++;
    render();
  });
  document.getElementById("cm-ex-otro").addEventListener("click", nuevo);
  nuevo();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initPracticaCM(diff, registerRestart) {
  const modePicker = document.getElementById("mode-picker");
  const els = {
    card: document.getElementById("practica-calculo-mental"),
    equation: document.getElementById("cm-equation"),
    hintBtn: document.getElementById("cm-hint-btn"),
    hint: document.getElementById("cm-hint"),
    inputsRow: document.getElementById("cm-inputs-row"),
    choices: document.getElementById("cm-answer-choices"),
    input: document.getElementById("cm-answer-input"),
    checkBtn: document.getElementById("cm-check-btn"),
    feedback: document.getElementById("cm-feedback"),
    nextBtn: document.getElementById("cm-next-btn"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  TRUCOS_CALCULO_MENTAL.forEach((truco, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-secondary" + (i === 0 ? " active" : "");
    btn.textContent = truco.label;
    btn.dataset.mode = truco.id;
    modePicker.appendChild(btn);
  });
  const mezclaBtn = document.createElement("button");
  mezclaBtn.type = "button";
  mezclaBtn.className = "btn btn-secondary";
  mezclaBtn.textContent = "Mezcla";
  mezclaBtn.dataset.mode = "mezcla";
  modePicker.appendChild(mezclaBtn);

  let scoreOk = 0;
  let scoreKo = 0;
  let mode = TRUCOS_CALCULO_MENTAL[0].id;
  let current;
  let attempts = 0;

  const acsIds = TRUCOS_CALCULO_MENTAL_ACS.map((t) => t.id);

  function setActiveMode(m) {
    mode = m;
    modePicker.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.mode === m));
  }

  function applyDifficultyUI() {
    const acs = diff.is("acs");
    modePicker.querySelectorAll("button").forEach((b) => {
      b.disabled = (acs && !acsIds.includes(b.dataset.mode)) || (b.dataset.mode === "mezcla" && (diff.is("tdah") || diff.is("discalculia")));
    });
    if (diff.is("altas")) setActiveMode("mezcla");
    else if ((acs && !acsIds.includes(mode)) || ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla")) setActiveMode(TRUCOS_CALCULO_MENTAL[0].id);

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickTruco() {
    if (mode === "mezcla") return cmPick(diff.is("acs") ? TRUCOS_CALCULO_MENTAL_ACS : TRUCOS_CALCULO_MENTAL);
    return TRUCOS_CALCULO_MENTAL.find((t) => t.id === mode);
  }

  function showHint() {
    els.hint.innerHTML = `<strong>Pista:</strong> ${current.pista}`;
    els.hint.classList.add("show");
  }

  function startRound() {
    current = pickTruco().generar(nivelCM(diff));
    attempts = 0;

    els.equation.textContent = current.enunciado + (current.estimacion ? "" : " =");
    els.hint.classList.remove("show");
    els.hint.innerHTML = "";
    els.hintBtn.disabled = false;
    if (diff.is("discalculia") || diff.is("acs")) showHint();
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    if (diff.is("disgrafia")) {
      els.inputsRow.style.display = "none";
      els.choices.style.display = "";
      renderChoiceButtons();
    } else {
      els.inputsRow.style.display = "";
      els.choices.style.display = "none";
      els.input.value = "";
      els.input.classList.remove("correct", "incorrect");
      els.input.disabled = false;
    }
  }

  function explicacion() {
    return `<p>${current.enunciado}${current.estimacion ? "" : " ="} <strong>${cmFmt(current.respuesta)}</strong></p><ol class="cm-pasos">${current.pasos.map((p) => `<li>${p}</li>`).join("")}</ol>`;
  }

  function terminar(isCorrect) {
    if (isCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("calculo-mental", isCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;
    els.hintBtn.disabled = true;
    els.feedback.classList.add("show", isCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `<p class="feedback-title">${isCorrect ? "Correcto" : "No era esa"}</p>${explicacion()}`;
    els.nextBtn.style.display = "";
  }

  function renderChoiceButtons() {
    els.choices.innerHTML = "";
    opcionesCM(current).forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "syllable-chip";
      btn.textContent = cmFmt(opt);
      btn.dataset.valor = opt;
      btn.addEventListener("click", () => chooseAnswerButton(opt, btn));
      els.choices.appendChild(btn);
    });
  }

  function chooseAnswerButton(chosen, btn) {
    const isCorrect = igualCM(chosen, current.respuesta);
    attempts++;
    const allBtns = els.choices.querySelectorAll(".syllable-chip");
    allBtns.forEach((b) => (b.disabled = true));

    if (isCorrect) {
      btn.classList.add("correct");
      terminar(true);
      return;
    }
    btn.classList.add("incorrect");
    if (attempts >= 2) {
      allBtns.forEach((b) => {
        if (igualCM(Number(b.dataset.valor), current.respuesta)) b.classList.add("correct");
      });
      terminar(false);
    } else {
      // Segundo intento: se abre la pista.
      showHint();
      setTimeout(() => {
        allBtns.forEach((b) => {
          if (b !== btn) b.disabled = false;
        });
      }, 700);
    }
  }

  function checkAnswer() {
    const val = parseRespuestaCM(els.input.value);
    if (Number.isNaN(val)) return;
    attempts++;
    if (igualCM(val, current.respuesta)) {
      els.input.classList.add("correct");
      els.input.disabled = true;
      terminar(true);
      return;
    }
    if (attempts >= 2) {
      els.input.classList.remove("incorrect");
      els.input.classList.add("correct");
      els.input.value = cmFmt(current.respuesta);
      els.input.disabled = true;
      terminar(false);
    } else {
      els.input.classList.add("incorrect");
      showHint();
      setTimeout(() => {
        els.input.classList.remove("incorrect");
        els.input.value = "";
        els.input.focus();
      }, 700);
    }
  }

  modePicker.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveMode(btn.dataset.mode);
      startRound();
    });
  });

  els.hintBtn.addEventListener("click", showHint);
  els.checkBtn.addEventListener("click", checkAnswer);
  els.input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
  });
  els.nextBtn.addEventListener("click", startRound);

  applyDifficultyUI();
  startRound();
}

// ============================================================
// FICHA PARA IMPRIMIR
// ============================================================
// Nivel de la ficha: la adaptación manda; si no hay, en 6º los números son mayores.
function nivelFichaCM(diff, curso) {
  if (diff.is("acs")) return "acs";
  if (diff.is("discalculia")) return "facil";
  if (diff.is("altas") || curso === "6") return "altas";
  return "normal";
}

function initFichaCM(diff) {
  const bloquePicker = document.getElementById("cm-bloque-picker");
  const countInput = document.getElementById("cm-count");
  const cursoBtns = document.querySelectorAll("#cm-curso-picker [data-curso]");
  const generateBtn = document.getElementById("cm-generate-btn");
  const statusEl = document.getElementById("cm-gen-status");
  const previewWrap = document.getElementById("cm-preview-wrap");
  const previewEl = document.getElementById("cm-preview");
  const toggleBtn = document.getElementById("cm-toggle-solutions");
  const downloadBtn = document.getElementById("cm-download-btn");

  let curso = "5";
  let currentResult = null;
  let showSolutions = false;

  BLOQUES_CALCULO_MENTAL.forEach((bloque, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-secondary" + (i === 0 ? " active" : "");
    btn.textContent = bloque.label;
    btn.dataset.bloque = bloque.id;
    btn.addEventListener("click", () => btn.classList.toggle("active"));
    bloquePicker.appendChild(btn);
  });

  cursoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      cursoBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      curso = btn.dataset.curso;
    });
  });

  function getSelectedBloques() {
    return [...bloquePicker.querySelectorAll("button.active")].map((b) => Number(b.dataset.bloque));
  }

  function renderPreview(res, show) {
    previewEl.innerHTML = "";
    res.bloquesSeleccionados.forEach((bloqueId) => {
      const trucos = trucosDeBloque(bloqueId, res.lista);
      if (!trucos.length) return;
      const bloque = BLOQUES_CALCULO_MENTAL.find((b) => b.id === bloqueId);
      const bar = document.createElement("div");
      bar.className = "lectgen-section-bar";
      bar.textContent = bloque.label;
      previewEl.appendChild(bar);

      trucos.forEach((truco) => {
        const label = document.createElement("p");
        label.className = "lectgen-question";
        label.textContent = truco.label;
        previewEl.appendChild(label);

        const list = document.createElement("ol");
        list.className = "cm-preview-list";
        res.semana[truco.id].forEach((ej) => {
          const li = document.createElement("li");
          const igual = ej.estimacion ? "" : " =";
          li.textContent = show ? `${ej.enunciado}${igual} ${cmFmt(ej.respuesta)}` : `${ej.enunciado}${igual} ______`;
          list.appendChild(li);
        });
        previewEl.appendChild(list);
      });
    });
  }

  generateBtn.addEventListener("click", () => {
    statusEl.classList.remove("show", "ok", "ko");
    statusEl.innerHTML = "";

    const bloquesSeleccionados = getSelectedBloques();
    const porTruco = Math.min(8, Math.max(1, Number(countInput.value) || 3));
    countInput.value = porTruco;

    if (!bloquesSeleccionados.length) {
      statusEl.classList.add("show", "ko");
      statusEl.innerHTML = `<p class="feedback-title">Elige al menos un bloque</p><p>Selecciona uno o varios bloques para generar la ficha.</p>`;
      previewWrap.style.display = "none";
      currentResult = null;
      return;
    }

    try {
      const nivel = nivelFichaCM(diff, curso);
      const lista = diff.is("acs") ? TRUCOS_CALCULO_MENTAL_ACS : TRUCOS_CALCULO_MENTAL;
      const conPista = !diff.is("altas");
      currentResult = generarCalculoMentalYSoluciones(bloquesSeleccionados, porTruco, curso, { nivel, lista, conPista });
      currentResult.bloquesSeleccionados = bloquesSeleccionados;
      currentResult.lista = lista;
      showSolutions = false;
      toggleBtn.textContent = "Mostrar soluciones";
      renderPreview(currentResult, showSolutions);
      previewWrap.style.display = "";

      const totalEjercicios = bloquesSeleccionados.reduce((acc, id) => acc + trucosDeBloque(id, lista).length * porTruco, 0);
      const adapt = { acs: " · adaptación ACS", facil: " · números pequeños (discalculia)", altas: diff.is("altas") ? " · altas capacidades" : " · números de 6º" }[nivel] || "";
      statusEl.classList.add("show", "ok");
      statusEl.innerHTML = `<p class="feedback-title">¡Ficha generada!</p><p>${totalEjercicios} ejercicios en total (${curso}º de Primaria${adapt}).</p>`;
    } catch (err) {
      statusEl.classList.add("show", "ko");
      statusEl.innerHTML = `<p class="feedback-title">Ha ocurrido un error</p><p>${err.message}</p>`;
    }
  });

  toggleBtn.addEventListener("click", () => {
    if (!currentResult) return;
    showSolutions = !showSolutions;
    toggleBtn.textContent = showSolutions ? "Ocultar soluciones" : "Mostrar soluciones";
    renderPreview(currentResult, showSolutions);
  });

  downloadBtn.addEventListener("click", () => {
    if (!currentResult) return;
    downloadBlob(currentResult.fichaBlob, `calculo_mental_${curso}.docx`);
    setTimeout(() => downloadBlob(currentResult.solucionesBlob, `soluciones_calculo_mental_${curso}.docx`), 400);
  });
}
