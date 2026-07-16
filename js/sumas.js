// ============================================================
// Sumas: motor de cálculo paso a paso + demo teórica + juego
// Dos métodos: suma escrita en columna (con llevadas) y
// cálculo mental (descomposición por valor posicional).
// ============================================================

function computeAdditionSteps(a, b) {
  const digitsA = String(a).split("").map(Number);
  const digitsB = String(b).split("").map(Number);
  const n = digitsA.length;

  const steps = [];
  let carry = 0;
  for (let i = n - 1; i >= 0; i--) {
    const carryIn = carry;
    const total = digitsA[i] + digitsB[i] + carryIn;
    const resultDigit = total % 10;
    carry = Math.floor(total / 10);
    steps.push({ position: i, digitA: digitsA[i], digitB: digitsB[i], carryIn, total, resultDigit, carryOut: carry });
  }

  const finalCarry = carry;
  return { a: String(a), b: String(b), digitsA, digitsB, n, steps, finalCarry, result: a + b };
}

function placeValueLabel(pv) {
  if (pv === 1) return "unidades";
  if (pv === 10) return "decenas";
  if (pv === 100) return "centenas";
  if (pv === 1000) return "millares";
  return `× ${pv}`;
}

function computeAdditionMental(a, b) {
  const digitsA = String(a).split("").map(Number);
  const digitsB = String(b).split("").map(Number);
  const n = digitsA.length;
  const parts = [];
  for (let i = 0; i < n; i++) {
    const pv = Math.pow(10, n - 1 - i);
    parts.push({
      label: placeValueLabel(pv),
      partA: digitsA[i] * pv,
      partB: digitsB[i] * pv,
      subtotal: (digitsA[i] + digitsB[i]) * pv,
    });
  }
  return { a, b, n, parts, total: a + b };
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

function resetAdditionView(view, problem) {
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

  const slotCount = problem.n + (problem.finalCarry > 0 ? 1 : 0);
  view.result.innerHTML = "";
  for (let k = 0; k < slotCount; k++) {
    view.result.appendChild(makeTile("", "empty"));
  }
}

function fillResultDigit(view, problem, position, digit) {
  const offset = problem.finalCarry > 0 ? 1 : 0;
  const tile = view.result.children[position + offset];
  tile.textContent = digit;
  tile.classList.remove("empty");
}

function showCarryMark(view, position, carryOut) {
  if (position - 1 >= 0 && carryOut > 0) {
    view.carries.children[position - 1].textContent = carryOut;
  }
}

function fillFinalCarry(view, problem) {
  if (problem.finalCarry > 0) {
    const tile = view.result.children[0];
    tile.textContent = problem.finalCarry;
    tile.classList.remove("empty");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initMethodPicker();
  if (document.getElementById("demo-addend-a")) initDemo();
  if (document.getElementById("game-addend-a")) initGame();
  if (document.getElementById("mental-demo-line1")) initMentalDemo();
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

function randomPairSameLength(length) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return { a: randomInt(min, max), b: randomInt(min, max) };
}

// ---------------- Demo (Teoría · método escrito) ----------------

const DEMO_EXAMPLES = [
  { a: 47, b: 38 },
  { a: 754, b: 238 },
  { a: 3487, b: 2695 },
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
    const carryText = step.carryIn > 0 ? ` + 1 que llevábamos` : "";
    let text = `Columna de las ${placeValueLabel(Math.pow(10, problem.n - 1 - step.position))}: ${step.digitA} + ${step.digitB}${carryText} = ${step.total}.`;
    if (step.carryOut > 0) {
      text += ` Escribimos ${step.resultDigit} y llevamos ${step.carryOut} a la siguiente columna.`;
    } else {
      text += ` Escribimos ${step.resultDigit}.`;
    }
    return text;
  }

  function rebuildUpTo(idx) {
    stepIndex = idx;
    resetAdditionView(view, problem);

    for (let s = 0; s <= idx && s < problem.steps.length; s++) {
      fillResultDigit(view, problem, problem.steps[s].position, problem.steps[s].resultDigit);
      showCarryMark(view, problem.steps[s].position, problem.steps[s].carryOut);
    }

    if (idx === -1) {
      explanationEl.innerHTML = "Pulsa «Siguiente paso» para empezar.";
    } else if (idx >= problem.steps.length) {
      fillFinalCarry(view, problem);
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
    problem = computeAdditionSteps(ex.a, ex.b);
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
    const { a, b } = randomPairSameLength(currentLength);
    problem = computeAdditionSteps(a, b);
    stepIndex = 0;
    attempts = 0;
    roundHasError = false;

    resetAdditionView(view, problem);
    setProgress(0);
    els.nextBtn.style.display = "none";
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";

    askCurrentStep();
  }

  function askCurrentStep() {
    const step = problem.steps[stepIndex];
    const pv = Math.pow(10, problem.n - 1 - step.position);
    const carryText = step.carryIn > 0 ? " + 1 que llevamos" : "";
    els.instruction.innerHTML = `Columna de las ${placeValueLabel(pv)}: ¿cuánto es ${step.digitA} + ${step.digitB}${carryText}? (escribe solo la cifra de las unidades del resultado)`;
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
    fillResultDigit(view, problem, step.position, step.resultDigit);
    showCarryMark(view, step.position, step.carryOut);

    setProgress(Math.round(((stepIndex + 1) / problem.steps.length) * 100));

    stepIndex++;
    attempts = 0;

    if (stepIndex < problem.steps.length) {
      setTimeout(askCurrentStep, 500);
    } else {
      fillFinalCarry(view, problem);
      setTimeout(finishRound, 600);
    }
  }

  function finishRound() {
    const allCorrect = !roundHasError;
    if (allCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("sumas", allCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.instruction.textContent = "";
    els.digitButtons.innerHTML = "";

    const titleText = allCorrect ? "Correcto en todos los pasos" : "Casi, revisa los pasos marcados";

    els.feedback.classList.add("show", allCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `
      <p class="feedback-title">${titleText}</p>
      <p><strong>${problem.a} + ${problem.b} = ${problem.result}</strong></p>
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
  { a: 47, b: 38 },
  { a: 754, b: 238 },
  { a: 3487, b: 2695 },
];

function initMentalDemo() {
  const line1 = document.getElementById("mental-demo-line1");
  const line2 = document.getElementById("mental-demo-line2");
  const line3 = document.getElementById("mental-demo-line3");
  const prevBtn = document.getElementById("mental-demo-prev");
  const nextBtn = document.getElementById("mental-demo-next");
  const resetBtn = document.getElementById("mental-demo-reset");
  const pickerBtns = document.querySelectorAll("#mental-example-picker [data-example]");

  let data;
  let stepIndex;

  function render() {
    if (stepIndex < 0) {
      line1.textContent = "Pulsa «Siguiente paso» para empezar.";
      line2.innerHTML = "";
      line3.innerHTML = "";
    } else {
      const decompText = data.parts.map((p) => `(${p.partA}+${p.partB})`).join(" + ");
      line1.innerHTML = `${data.a} + ${data.b} = ${decompText}`;
      line2.innerHTML =
        stepIndex >= 1 ? data.parts.map((p) => `${p.partA} + ${p.partB} = <span class="fact">${p.subtotal}</span>`).join(" &nbsp;&nbsp; ") : "";
      line3.innerHTML =
        stepIndex >= 2 ? `${data.parts.map((p) => p.subtotal).join(" + ")} = <span class="fact">${data.total}</span>` : "";
    }
    prevBtn.disabled = stepIndex <= -1;
    nextBtn.disabled = stepIndex >= 2;
  }

  function loadExample(idx) {
    const ex = MENTAL_EXAMPLES[idx];
    data = computeAdditionMental(ex.a, ex.b);
    stepIndex = -1;
    render();
  }

  nextBtn.addEventListener("click", () => {
    if (stepIndex < 2) {
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
  let data, stage, attempts, roundHasError, totalStages;

  function setProgress(pct) {
    els.progressFill.style.width = pct + "%";
  }

  function startProblem() {
    const { a, b } = randomPairSameLength(currentLength);
    data = computeAdditionMental(a, b);
    totalStages = data.n + 1;
    stage = 0;
    attempts = 0;
    roundHasError = false;

    setProgress(0);
    els.nextBtn.style.display = "none";
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.input.style.display = "";
    els.checkBtn.style.display = "";

    const decompText = data.parts.map((p) => `(${p.partA}+${p.partB})`).join(" + ");
    els.equation.innerHTML = `${data.a} + ${data.b} = ${decompText}`;

    askStage();
  }

  function askStage() {
    els.input.value = "";
    els.input.classList.remove("correct", "incorrect");
    els.input.disabled = false;

    if (stage < data.n) {
      const p = data.parts[stage];
      els.instruction.innerHTML = `¿Cuánto es <strong>${p.partA} + ${p.partB}</strong>? (${p.label})`;
    } else {
      const sumText = data.parts.map((p) => p.subtotal).join(" + ");
      els.instruction.innerHTML = `¿Cuánto es <strong>${sumText}</strong>?`;
    }
  }

  function expectedAnswer() {
    if (stage < data.n) return data.parts[stage].subtotal;
    return data.total;
  }

  function checkAnswer() {
    if (els.input.value.trim() === "") return;
    const val = Number(els.input.value);
    if (Number.isNaN(val)) return;

    const expected = expectedAnswer();
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
    setProgress(Math.round(((stage + 1) / totalStages) * 100));
    attempts = 0;
    if (stage < data.n) {
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
    AppProgress.record("sumas", allCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.instruction.textContent = "";
    els.input.style.display = "none";
    els.checkBtn.style.display = "none";

    const titleText = allCorrect ? "Correcto en todos los pasos" : "Casi, revisa los pasos marcados";

    els.feedback.classList.add("show", allCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `
      <p class="feedback-title">${titleText}</p>
      <p><strong>${data.a} + ${data.b} = ${data.total}</strong></p>
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
