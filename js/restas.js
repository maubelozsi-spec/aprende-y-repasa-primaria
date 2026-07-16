// ============================================================
// Restas: motor de cálculo paso a paso + demo teórica + juego
// Dos métodos: resta escrita en columna (con llevadas) y
// cálculo mental (restar por partes).
// ============================================================

function computeSubtractionSteps(minuend, subtrahend) {
  const digitsA = String(minuend).split("").map(Number);
  const digitsB = String(subtrahend).split("").map(Number);
  const n = digitsA.length;

  const steps = [];
  let borrow = 0;
  for (let i = n - 1; i >= 0; i--) {
    const topDigit = digitsA[i] - borrow;
    let adjusted = topDigit;
    let borrowed = false;
    if (adjusted < digitsB[i]) {
      adjusted += 10;
      borrow = 1;
      borrowed = true;
    } else {
      borrow = 0;
    }
    const resultDigit = adjusted - digitsB[i];
    steps.push({ position: i, originalDigit: digitsA[i], adjustedDigit: adjusted, subtrahendDigit: digitsB[i], borrowed, resultDigit });
  }

  return { a: String(minuend), b: String(subtrahend), digitsA, digitsB, n, steps, finalCarry: 0, result: minuend - subtrahend };
}

function placeValueLabel(pv) {
  if (pv === 1) return "unidades";
  if (pv === 10) return "decenas";
  if (pv === 100) return "centenas";
  if (pv === 1000) return "millares";
  return `× ${pv}`;
}

function computeSubtractionMental(minuend, subtrahend) {
  const digitsB = String(subtrahend).split("").map(Number);
  const n = digitsB.length;
  const parts = [];
  let running = minuend;
  for (let i = 0; i < n; i++) {
    const pv = Math.pow(10, n - 1 - i);
    const chunk = digitsB[i] * pv;
    if (chunk === 0) continue;
    const before = running;
    running -= chunk;
    parts.push({ label: placeValueLabel(pv), chunk, before, after: running });
  }
  return { minuend, subtrahend, n, parts, total: minuend - subtrahend };
}

// ---------------- Vista compartida (tiles) ----------------

function createArithView(prefix) {
  return {
    carries: document.getElementById(prefix + "-carries"),
    addendA: document.getElementById(prefix + "-addend-a"),
    addendB: document.getElementById(prefix + "-addend-b"),
    result: document.getElementById(prefix + "-result"),
  };
}

function makeTile(text, extraClass) {
  const span = document.createElement("span");
  span.className = "letter" + (extraClass ? " " + extraClass : "");
  span.textContent = text;
  return span;
}

function resetSubtractionView(view, problem) {
  view.addendA.innerHTML = "";
  problem.digitsA.forEach((d) => view.addendA.appendChild(makeTile(d)));

  view.addendB.innerHTML = "";
  problem.digitsB.forEach((d) => view.addendB.appendChild(makeTile(d)));

  view.carries.innerHTML = "";
  for (let k = 0; k < problem.n; k++) {
    const span = document.createElement("span");
    span.className = "carry-tile";
    view.carries.appendChild(span);
  }

  view.result.innerHTML = "";
  for (let k = 0; k < problem.n; k++) {
    view.result.appendChild(makeTile("", "empty"));
  }
}

function fillResultDigit(view, position, digit) {
  const tile = view.result.children[position];
  tile.textContent = digit;
  tile.classList.remove("empty");
}

function showBorrowMark(view, position) {
  if (position - 1 >= 0) {
    view.carries.children[position - 1].textContent = "−1";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initMethodPicker();
  if (document.getElementById("demo-addend-a")) initDemo();
  if (document.getElementById("game-addend-a")) initGame();
  if (document.getElementById("mental-demo-equation")) initMentalDemo();
  if (document.getElementById("mental-game-equation")) initMentalGame();
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

  document.querySelectorAll("#go-to-practice-escrita, #go-to-practice-mental").forEach((btn) => {
    btn.addEventListener("click", () => activateTab("practica"));
  });
}

function initMethodPicker() {
  const picker = document.getElementById("method-picker");
  if (!picker) return;
  const btns = picker.querySelectorAll("[data-method]");
  const groups = {
    escrita: [document.getElementById("teoria-escrita"), document.getElementById("practica-escrita")],
    mental: [document.getElementById("teoria-mental"), document.getElementById("practica-mental")],
  };

  function setMethod(method) {
    Object.entries(groups).forEach(([key, els]) => {
      els.forEach((el) => {
        if (el) el.style.display = key === method ? "" : "none";
      });
    });
    btns.forEach((b) => b.classList.toggle("active", b.dataset.method === method));
  }

  btns.forEach((btn) => btn.addEventListener("click", () => setMethod(btn.dataset.method)));
  setMethod("escrita");
}

// ---------------- Generación aleatoria ----------------

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomOrderedPairSameLength(length) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  let a = randomInt(min, max);
  let b = randomInt(min, max);
  if (a < b) {
    const tmp = a;
    a = b;
    b = tmp;
  }
  return { minuend: a, subtrahend: b };
}

// ---------------- Demo (Teoría · método escrito) ----------------

const DEMO_EXAMPLES = [
  { a: 83, b: 47 },
  { a: 754, b: 238 },
  { a: 6182, b: 3487 },
];

function initDemo() {
  const view = createArithView("demo");
  const explanationEl = document.getElementById("demo-explanation");
  const prevBtn = document.getElementById("demo-prev");
  const nextBtn = document.getElementById("demo-next");
  const resetBtn = document.getElementById("demo-reset");
  const pickerBtns = document.querySelectorAll("#example-picker [data-example]");

  let problem;
  let stepIndex;

  function stepExplanation(step) {
    const pv = Math.pow(10, problem.n - 1 - step.position);
    let text = `Columna de las ${placeValueLabel(pv)}: `;
    if (step.borrowed) {
      text += `como ${step.originalDigit} es menor que ${step.subtrahendDigit}, pedimos prestada 1 decena a la columna siguiente: ${step.originalDigit} se convierte en ${step.adjustedDigit}. `;
    }
    text += `${step.adjustedDigit} − ${step.subtrahendDigit} = ${step.resultDigit}.`;
    return text;
  }

  function rebuildUpTo(idx) {
    stepIndex = idx;
    resetSubtractionView(view, problem);

    for (let s = 0; s <= idx && s < problem.steps.length; s++) {
      fillResultDigit(view, problem.steps[s].position, problem.steps[s].resultDigit);
      if (problem.steps[s].borrowed) showBorrowMark(view, problem.steps[s].position);
    }

    if (idx === -1) {
      explanationEl.innerHTML = "Pulsa «Siguiente paso» para empezar.";
    } else if (idx >= problem.steps.length) {
      explanationEl.innerHTML = `Ya no quedan más columnas. El resultado es <strong>${problem.result}</strong>.`;
    } else {
      explanationEl.innerHTML = stepExplanation(problem.steps[idx]);
    }

    prevBtn.disabled = stepIndex <= -1;
    nextBtn.disabled = stepIndex >= problem.steps.length;
    nextBtn.textContent = stepIndex === problem.steps.length - 1 ? "Ver resultado final" : "Siguiente paso";
  }

  function loadExample(idx) {
    const ex = DEMO_EXAMPLES[idx];
    problem = computeSubtractionSteps(ex.a, ex.b);
    rebuildUpTo(-1);
  }

  nextBtn.addEventListener("click", () => {
    if (stepIndex < problem.steps.length) rebuildUpTo(stepIndex + 1);
  });
  prevBtn.addEventListener("click", () => {
    if (stepIndex > -1) rebuildUpTo(stepIndex - 1);
  });
  resetBtn.addEventListener("click", () => rebuildUpTo(-1));

  pickerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      pickerBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      loadExample(Number(btn.dataset.example));
    });
  });

  loadExample(0);
}

// ---------------- Juego (Práctica · método escrito) ----------------

function initGame() {
  const view = createArithView("game");
  const els = {
    lengthBtns: document.querySelectorAll("#length-picker-w [data-len]"),
    instruction: document.getElementById("game-instruction"),
    digitButtons: document.getElementById("digit-buttons"),
    feedback: document.getElementById("feedback-w"),
    nextBtn: document.getElementById("next-problem-w"),
    scoreOk: document.getElementById("score-ok-w"),
    scoreKo: document.getElementById("score-ko-w"),
    progressFill: document.getElementById("progress-fill-w"),
  };

  let scoreOk = 0;
  let scoreKo = 0;
  let currentLength = 2;
  let problem, stepIndex, attempts, roundHasError;

  function setProgress(pct) {
    els.progressFill.style.width = pct + "%";
  }

  function renderDigitButtons() {
    els.digitButtons.innerHTML = "";
    for (let d = 0; d <= 9; d++) {
      const btn = document.createElement("button");
      btn.className = "syllable-chip";
      btn.textContent = d;
      btn.addEventListener("click", () => chooseDigit(d, btn));
      els.digitButtons.appendChild(btn);
    }
  }

  function startProblem() {
    const { minuend, subtrahend } = randomOrderedPairSameLength(currentLength);
    problem = computeSubtractionSteps(minuend, subtrahend);
    stepIndex = 0;
    attempts = 0;
    roundHasError = false;

    resetSubtractionView(view, problem);
    setProgress(0);
    els.nextBtn.style.display = "none";
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";

    askCurrentStep();
  }

  function askCurrentStep() {
    const step = problem.steps[stepIndex];
    const pv = Math.pow(10, problem.n - 1 - step.position);
    const borrowText = step.borrowed
      ? ` (pedimos prestada 1 decena, así que ${step.originalDigit} se convierte en ${step.adjustedDigit})`
      : "";
    els.instruction.innerHTML = `Columna de las ${placeValueLabel(pv)}${borrowText}: ¿cuánto es ${step.adjustedDigit} − ${step.subtrahendDigit}?`;
    renderDigitButtons();
  }

  function chooseDigit(digit, btn) {
    const step = problem.steps[stepIndex];
    const isCorrect = digit === step.resultDigit;
    attempts++;

    const allBtns = els.digitButtons.querySelectorAll(".syllable-chip");
    allBtns.forEach((b) => (b.disabled = true));

    if (isCorrect) {
      btn.classList.add("correct");
      setTimeout(revealStep, 500);
      return;
    }

    btn.classList.add("incorrect");

    if (attempts >= 2) {
      roundHasError = true;
      allBtns.forEach((b) => {
        if (Number(b.textContent) === step.resultDigit) b.classList.add("correct");
      });
      setTimeout(revealStep, 900);
    } else {
      setTimeout(() => {
        allBtns.forEach((b) => {
          b.disabled = false;
          b.classList.remove("incorrect");
        });
      }, 700);
    }
  }

  function revealStep() {
    const step = problem.steps[stepIndex];
    fillResultDigit(view, step.position, step.resultDigit);
    if (step.borrowed) showBorrowMark(view, step.position);

    setProgress(Math.round(((stepIndex + 1) / problem.steps.length) * 100));

    stepIndex++;
    attempts = 0;

    if (stepIndex < problem.steps.length) {
      setTimeout(askCurrentStep, 500);
    } else {
      setTimeout(finishRound, 600);
    }
  }

  function finishRound() {
    const allCorrect = !roundHasError;
    if (allCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("restas", allCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.instruction.textContent = "";
    els.digitButtons.innerHTML = "";

    const titleText = allCorrect ? "Correcto en todos los pasos" : "Casi, revisa los pasos marcados";

    els.feedback.classList.add("show", allCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `
      <p class="feedback-title">${titleText}</p>
      <p><strong>${problem.a} − ${problem.b} = ${problem.result}</strong></p>
    `;

    els.nextBtn.style.display = "";
  }

  els.lengthBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      els.lengthBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentLength = Number(btn.dataset.len);
      startProblem();
    });
  });

  els.nextBtn.addEventListener("click", startProblem);

  startProblem();
}

// ---------------- Demo (Teoría · cálculo mental) ----------------

const MENTAL_EXAMPLES = [
  { a: 83, b: 47 },
  { a: 754, b: 238 },
  { a: 6182, b: 3487 },
];

function initMentalDemo() {
  const equationEl = document.getElementById("mental-demo-equation");
  const explanationEl = document.getElementById("mental-demo-explanation");
  const prevBtn = document.getElementById("mental-demo-prev");
  const nextBtn = document.getElementById("mental-demo-next");
  const resetBtn = document.getElementById("mental-demo-reset");
  const pickerBtns = document.querySelectorAll("#mental-example-picker [data-example]");

  let data;
  let stepIndex;

  function render() {
    const chainText = data.parts.map((p) => `− ${p.chunk}`).join(" ");
    equationEl.innerHTML = `${data.minuend} − ${data.subtrahend} = ${data.minuend} ${chainText}`;

    if (stepIndex === -1) {
      explanationEl.innerHTML = "Pulsa «Siguiente paso» para empezar.";
    } else if (stepIndex >= data.parts.length) {
      explanationEl.innerHTML = `Ya hemos restado todas las partes. El resultado es <strong>${data.total}</strong>.`;
    } else {
      const p = data.parts[stepIndex];
      explanationEl.innerHTML = `Restamos las ${p.label}: ${p.before} − ${p.chunk} = <strong>${p.after}</strong>.`;
    }

    prevBtn.disabled = stepIndex <= -1;
    nextBtn.disabled = stepIndex >= data.parts.length;
    nextBtn.textContent = stepIndex === data.parts.length - 1 ? "Ver resultado final" : "Siguiente paso";
  }

  function loadExample(idx) {
    const ex = MENTAL_EXAMPLES[idx];
    data = computeSubtractionMental(ex.a, ex.b);
    stepIndex = -1;
    render();
  }

  nextBtn.addEventListener("click", () => {
    if (stepIndex < data.parts.length) {
      stepIndex++;
      render();
    }
  });
  prevBtn.addEventListener("click", () => {
    if (stepIndex > -1) {
      stepIndex--;
      render();
    }
  });
  resetBtn.addEventListener("click", () => {
    stepIndex = -1;
    render();
  });

  pickerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      pickerBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      loadExample(Number(btn.dataset.example));
    });
  });

  loadExample(0);
}

// ---------------- Juego (Práctica · cálculo mental) ----------------

function initMentalGame() {
  const els = {
    lengthBtns: document.querySelectorAll("#length-picker-m [data-len]"),
    equation: document.getElementById("mental-game-equation"),
    instruction: document.getElementById("mental-game-instruction"),
    input: document.getElementById("mental-answer-input"),
    checkBtn: document.getElementById("mental-check-btn"),
    feedback: document.getElementById("feedback-m"),
    nextBtn: document.getElementById("next-problem-m"),
    scoreOk: document.getElementById("score-ok-m"),
    scoreKo: document.getElementById("score-ko-m"),
    progressFill: document.getElementById("progress-fill-m"),
  };

  let scoreOk = 0;
  let scoreKo = 0;
  let currentLength = 2;
  let data, stage, attempts, roundHasError;

  function setProgress(pct) {
    els.progressFill.style.width = pct + "%";
  }

  function startProblem() {
    const { minuend, subtrahend } = randomOrderedPairSameLength(currentLength);
    data = computeSubtractionMental(minuend, subtrahend);
    stage = 0;
    attempts = 0;
    roundHasError = false;

    setProgress(0);
    els.nextBtn.style.display = "none";
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.input.style.display = "";
    els.checkBtn.style.display = "";

    const chainText = data.parts.map((p) => `− ${p.chunk}`).join(" ");
    els.equation.innerHTML = `${data.minuend} − ${data.subtrahend} = ${data.minuend} ${chainText}`;

    askStage();
  }

  function askStage() {
    els.input.value = "";
    els.input.classList.remove("correct", "incorrect");
    els.input.disabled = false;

    const p = data.parts[stage];
    els.instruction.innerHTML = `¿Cuánto es <strong>${p.before} − ${p.chunk}</strong>? (${p.label})`;
  }

  function checkAnswer() {
    if (els.input.value.trim() === "") return;
    const val = Number(els.input.value);
    if (Number.isNaN(val)) return;

    const expected = data.parts[stage].after;
    const isCorrect = val === expected;
    attempts++;

    if (isCorrect) {
      els.input.classList.add("correct");
      els.input.disabled = true;
      setTimeout(advanceStage, 600);
      return;
    }

    els.input.classList.add("incorrect");

    if (attempts >= 2) {
      roundHasError = true;
      els.input.disabled = true;
      els.input.value = expected;
      els.input.classList.remove("incorrect");
      els.input.classList.add("correct");
      setTimeout(advanceStage, 900);
    } else {
      setTimeout(() => {
        els.input.classList.remove("incorrect");
        els.input.value = "";
      }, 700);
    }
  }

  function advanceStage() {
    setProgress(Math.round(((stage + 1) / data.parts.length) * 100));
    attempts = 0;
    if (stage < data.parts.length - 1) {
      stage++;
      askStage();
    } else {
      finishRound();
    }
  }

  function finishRound() {
    const allCorrect = !roundHasError;
    if (allCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("restas", allCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.instruction.textContent = "";
    els.input.style.display = "none";
    els.checkBtn.style.display = "none";

    const titleText = allCorrect ? "Correcto en todos los pasos" : "Casi, revisa los pasos marcados";

    els.feedback.classList.add("show", allCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `
      <p class="feedback-title">${titleText}</p>
      <p><strong>${data.minuend} − ${data.subtrahend} = ${data.total}</strong></p>
    `;

    els.nextBtn.style.display = "";
  }

  els.checkBtn.addEventListener("click", checkAnswer);
  els.input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
  });

  els.lengthBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      els.lengthBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentLength = Number(btn.dataset.len);
      startProblem();
    });
  });

  els.nextBtn.addEventListener("click", startProblem);

  startProblem();
}
