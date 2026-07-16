// ============================================================
// Página de Cálculo mental: cambio de pestañas (Teoría/Práctica/
// Ficha), juego de práctica (un truco por vez, respuesta numérica)
// y generador de fichas en Word con su hoja de soluciones.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initTabsCM();
  initPracticaCM();
  initFichaCM();
});

function initTabsCM() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = {
    teoria: document.getElementById("tab-teoria"),
    practica: document.getElementById("tab-practica"),
    ficha: document.getElementById("tab-ficha"),
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

function initPracticaCM() {
  const modePicker = document.getElementById("mode-picker");
  const els = {
    equation: document.getElementById("cm-equation"),
    hint: document.getElementById("cm-hint"),
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

  function pickTruco() {
    if (mode === "mezcla") return cmPick(TRUCOS_CALCULO_MENTAL);
    return TRUCOS_CALCULO_MENTAL.find((t) => t.id === mode);
  }

  function startRound() {
    current = pickTruco().generar();
    attempts = 0;

    els.equation.textContent = current.enunciado + " =";
    els.hint.innerHTML = `<strong>Pista:</strong> ${current.pista}`;
    els.input.value = "";
    els.input.classList.remove("correct", "incorrect");
    els.input.disabled = false;
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";
  }

  function checkAnswer() {
    if (els.input.value.trim() === "") return;
    const val = Number(els.input.value);
    if (Number.isNaN(val)) return;
    attempts++;
    const isCorrect = val === current.respuesta;

    if (isCorrect) {
      scoreOk++;
      els.scoreOk.textContent = scoreOk;
      els.input.classList.add("correct");
      els.input.disabled = true;
      els.feedback.classList.add("show", "ok");
      els.feedback.innerHTML = `<p class="feedback-title">Correcto</p><p>${current.enunciado} = <strong>${current.respuesta}</strong></p>`;
      els.nextBtn.style.display = "";
      return;
    }

    if (attempts >= 2) {
      scoreKo++;
      els.scoreKo.textContent = scoreKo;
      els.input.classList.remove("incorrect");
      els.input.classList.add("correct");
      els.input.value = current.respuesta;
      els.input.disabled = true;
      els.feedback.classList.add("show", "ko");
      els.feedback.innerHTML = `<p class="feedback-title">No era esa</p><p>${current.enunciado} = <strong>${current.respuesta}</strong></p>`;
      els.nextBtn.style.display = "";
    } else {
      els.input.classList.add("incorrect");
      setTimeout(() => {
        els.input.classList.remove("incorrect");
        els.input.value = "";
      }, 700);
    }
  }

  modePicker.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      modePicker.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      mode = btn.dataset.mode;
      startRound();
    });
  });

  els.checkBtn.addEventListener("click", checkAnswer);
  els.input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
  });
  els.nextBtn.addEventListener("click", startRound);

  startRound();
}

function initFichaCM() {
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

  function renderPreview(semana, bloquesSeleccionados, show) {
    previewEl.innerHTML = "";
    bloquesSeleccionados.forEach((bloqueId) => {
      const bloque = BLOQUES_CALCULO_MENTAL.find((b) => b.id === bloqueId);
      const bar = document.createElement("div");
      bar.className = "lectgen-section-bar";
      bar.textContent = bloque.label;
      previewEl.appendChild(bar);

      trucosDeBloque(bloqueId).forEach((truco) => {
        const label = document.createElement("p");
        label.className = "lectgen-question";
        label.textContent = truco.label;
        previewEl.appendChild(label);

        const list = document.createElement("ol");
        list.className = "cm-preview-list";
        semana[truco.id].forEach((ej) => {
          const li = document.createElement("li");
          li.textContent = show ? `${ej.enunciado} = ${ej.respuesta}` : `${ej.enunciado} = ______`;
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
      currentResult = generarCalculoMentalYSoluciones(bloquesSeleccionados, porTruco, curso);
      currentResult.bloquesSeleccionados = bloquesSeleccionados;
      showSolutions = false;
      toggleBtn.textContent = "Mostrar soluciones";
      renderPreview(currentResult.semana, bloquesSeleccionados, showSolutions);
      previewWrap.style.display = "";

      const totalEjercicios = bloquesSeleccionados.reduce((acc, id) => acc + trucosDeBloque(id).length * porTruco, 0);
      statusEl.classList.add("show", "ok");
      statusEl.innerHTML = `<p class="feedback-title">¡Ficha generada!</p><p>${totalEjercicios} ejercicios en total (${curso}º de Primaria).</p>`;
    } catch (err) {
      statusEl.classList.add("show", "ko");
      statusEl.innerHTML = `<p class="feedback-title">Ha ocurrido un error</p><p>${err.message}</p>`;
    }
  });

  toggleBtn.addEventListener("click", () => {
    if (!currentResult) return;
    showSolutions = !showSolutions;
    toggleBtn.textContent = showSolutions ? "Ocultar soluciones" : "Mostrar soluciones";
    renderPreview(currentResult.semana, currentResult.bloquesSeleccionados, showSolutions);
  });

  downloadBtn.addEventListener("click", () => {
    if (!currentResult) return;
    downloadBlob(currentResult.fichaBlob, `calculo_mental_${curso}.docx`);
    setTimeout(() => downloadBlob(currentResult.solucionesBlob, `soluciones_calculo_mental_${curso}.docx`), 400);
  });
}
