// ============================================================
// Multiplicaciones: motor de cálculo paso a paso + demo teórica + juego
// Dos métodos: productos parciales (escrito) y cálculo mental
// (descomposición distributiva del multiplicador).
// ============================================================

function computeMultiplicationSteps(multiplicand, multiplier) {
  const multiplierDigits = String(multiplier).split("").map(Number);
  const n = multiplierDigits.length;
  const partials = [];
  for (let i = n - 1; i >= 0; i--) {
    const digit = multiplierDigits[i];
    const placeValue = Math.pow(10, n - 1 - i);
    const factor = digit * placeValue;
    partials.push({ digit, placeValue, factor, partialValue: multiplicand * factor });
  }
  const total = multiplicand * multiplier;
  return { multiplicand, multiplier, multiplierDigits, n, partials, total };
}

function computeMultiplicationMental(multiplicand, multiplier) {
  const mStr = String(multiplier);
  const numDigits = mStr.length;
  if (numDigits === 1) {
    return { multiplicand, multiplier, trivial: true, total: multiplicand * multiplier };
  }
  const leadingDigit = Number(mStr[0]);
  const placeValue = Math.pow(10, numDigits - 1);
  const part1M = leadingDigit * placeValue;
  const part2M = multiplier - part1M;
  const part1Value = multiplicand * part1M;
  const part2Value = multiplicand * part2M;
  return {
    multiplicand,
    multiplier,
    part1M,
    part2M,
    part1Value,
    part2Value,
    total: multiplicand * multiplier,
    trivial: part2M === 0,
  };
}

// ---------------- Vista compartida (tiles) ----------------

function makeTile(text, extraClass) {
  const span = document.createElement("span");
  span.className = "letter" + (extraClass ? " " + extraClass : "");
  span.textContent = text;
  return span;
}

function renderNumberTiles(container, number) {
  container.innerHTML = "";
  String(number)
    .split("")
    .forEach((d) => container.appendChild(makeTile(d)));
}

function makePartialRow(value) {
  const row = document.createElement("div");
  row.className = "mult-partial-row";
  String(value)
    .split("")
    .forEach((d) => row.appendChild(makeTile(d)));
  return row;
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initMethodPicker();
  if (document.getElementById("demo-multiplicand")) initDemo();
  if (document.getElementById("game-multiplicand")) initGame();
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

function randomMultiplier(length) {
  if (length === 1) return randomInt(2, 9);
  if (length === 2) return randomInt(10, 99);
  return randomInt(100, 999);
}

function randomMultiplicand() {
  return randomInt(100, 9999);
}

// ---------------- Demo (Teoría · método escrito) ----------------

const DEMO_EXAMPLES = [
  { multiplicand: 236, multiplier: 4 },
  { multiplicand: 3995, multiplier: 49 },
  { multiplicand: 482, multiplier: 137 },
];

function initDemo() {
  const mcEl = document.getElementById("demo-multiplicand");
  const mrEl = document.getElementById("demo-multiplier");
  const partialsEl = document.getElementById("demo-partials");
  const sumLineEl = document.getElementById("demo-sum-line");
  const resultEl = document.getElementById("demo-result");
  const explanationEl = document.getElementById("demo-explanation");
  const prevBtn = document.getElementById("demo-prev");
  const nextBtn = document.getElementById("demo-next");
  const resetBtn = document.getElementById("demo-reset");
  const pickerBtns = document.querySelectorAll("#example-picker [data-example]");

  let problem;
  let stepIndex;

  function rebuildUpTo(idx) {
    stepIndex = idx;
    renderNumberTiles(mcEl, problem.multiplicand);
    renderNumberTiles(mrEl, problem.multiplier);

    partialsEl.innerHTML = "";
    const shown = Math.min(Math.max(idx + 1, 0), problem.partials.length);
    for (let k = 0; k < shown; k++) {
      partialsEl.appendChild(makePartialRow(problem.partials[k].partialValue));
    }

    const finalStage = idx >= problem.partials.length;
    sumLineEl.style.display = problem.partials.length > 1 && shown === problem.partials.length ? "" : "none";
    resultEl.style.display = finalStage ? "" : "none";
    if (finalStage) renderNumberTiles(resultEl, problem.total);

    if (idx === -1) {
      explanationEl.innerHTML = "Pulsa «Siguiente paso» para empezar.";
    } else if (idx < problem.partials.length) {
      const p = problem.partials[idx];
      explanationEl.innerHTML = `Multiplicamos ${problem.multiplicand} × ${p.factor} = <strong>${p.partialValue}</strong> (la cifra ${p.digit} del multiplicador vale ${p.factor}).`;
    } else if (problem.partials.length > 1) {
      const sumText = problem.partials.map((p) => p.partialValue).join(" + ");
      explanationEl.innerHTML = `Sumamos todos los productos parciales: ${sumText} = <strong>${problem.total}</strong>.`;
    } else {
      explanationEl.innerHTML = `El resultado es <strong>${problem.total}</strong>.`;
    }

    prevBtn.disabled = stepIndex <= -1;
    nextBtn.disabled = stepIndex >= problem.partials.length;
    nextBtn.textContent = stepIndex === problem.partials.length - 1 ? "Ver resultado final" : "Siguiente paso";
  }

  function loadExample(idx) {
    const ex = DEMO_EXAMPLES[idx];
    problem = computeMultiplicationSteps(ex.multiplicand, ex.multiplier);
    rebuildUpTo(-1);
  }

  nextBtn.addEventListener("click", () => {
    if (stepIndex < problem.partials.length) rebuildUpTo(stepIndex + 1);
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
  const mcEl = document.getElementById("game-multiplicand");
  const mrEl = document.getElementById("game-multiplier");
  const partialsEl = document.getElementById("game-partials");
  const sumLineEl = document.getElementById("game-sum-line");
  const resultEl = document.getElementById("game-result");

  const els = {
    lengthBtns: document.querySelectorAll("#length-picker-w [data-len]"),
    instruction: document.getElementById("game-instruction"),
    input: document.getElementById("game-answer-input"),
    checkBtn: document.getElementById("game-check-btn"),
    feedback: document.getElementById("feedback-w"),
    nextBtn: document.getElementById("next-problem-w"),
    scoreOk: document.getElementById("score-ok-w"),
    scoreKo: document.getElementById("score-ko-w"),
    progressFill: document.getElementById("progress-fill-w"),
  };

  let scoreOk = 0;
  let scoreKo = 0;
  let currentLength = 1;
  let problem, stage, attempts, roundHasError, totalStages;

  function setProgress(pct) {
    els.progressFill.style.width = pct + "%";
  }

  function startProblem() {
    problem = computeMultiplicationSteps(randomMultiplicand(), randomMultiplier(currentLength));
    totalStages = problem.partials.length + (problem.partials.length > 1 ? 1 : 0);
    stage = 0;
    attempts = 0;
    roundHasError = false;

    renderNumberTiles(mcEl, problem.multiplicand);
    renderNumberTiles(mrEl, problem.multiplier);
    partialsEl.innerHTML = "";
    sumLineEl.style.display = "none";
    resultEl.style.display = "none";

    setProgress(0);
    els.nextBtn.style.display = "none";
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.input.style.display = "";
    els.checkBtn.style.display = "";

    askStage();
  }

  function askStage() {
    els.input.value = "";
    els.input.classList.remove("correct", "incorrect");
    els.input.disabled = false;

    if (stage < problem.partials.length) {
      const p = problem.partials[stage];
      els.instruction.innerHTML = `¿Cuánto es <strong>${problem.multiplicand} × ${p.factor}</strong>?`;
    } else {
      const sumText = problem.partials.map((p) => p.partialValue).join(" + ");
      els.instruction.innerHTML = `¿Cuánto es <strong>${sumText}</strong>?`;
    }
  }

  function expectedAnswer() {
    if (stage < problem.partials.length) return problem.partials[stage].partialValue;
    return problem.total;
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
    if (stage < problem.partials.length) {
      partialsEl.appendChild(makePartialRow(problem.partials[stage].partialValue));
    }

    setProgress(Math.round(((stage + 1) / totalStages) * 100));
    attempts = 0;
    stage++;

    if (stage < totalStages) {
      if (stage === problem.partials.length && problem.partials.length > 1) {
        sumLineEl.style.display = "";
      }
      askStage();
    } else {
      if (problem.partials.length > 1) {
        resultEl.style.display = "";
        renderNumberTiles(resultEl, problem.total);
      }
      finishRound();
    }
  }

  function finishRound() {
    const allCorrect = !roundHasError;
    if (allCorrect) scoreOk++;
    else scoreKo++;
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.instruction.textContent = "";
    els.input.style.display = "none";
    els.checkBtn.style.display = "none";

    const titleText = allCorrect ? "Correcto en todos los pasos" : "Casi, revisa los pasos marcados";

    els.feedback.classList.add("show", allCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `
      <p class="feedback-title">${titleText}</p>
      <p><strong>${problem.multiplicand} × ${problem.multiplier} = ${problem.total}</strong></p>
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

// ---------------- Demo (Teoría · cálculo mental) ----------------

const MENTAL_EXAMPLES = [
  { multiplicand: 236, multiplier: 4 },
  { multiplicand: 236, multiplier: 34 },
  { multiplicand: 482, multiplier: 137 },
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
  let maxStep;

  function render() {
    if (data.trivial) {
      line1.innerHTML =
        stepIndex >= 0
          ? `${data.multiplicand} × ${data.multiplier} = <span class="fact">${data.total}</span>`
          : "Pulsa «Siguiente paso» para empezar.";
      line2.innerHTML = "";
      line3.innerHTML = "";
    } else if (stepIndex < 0) {
      line1.textContent = "Pulsa «Siguiente paso» para empezar.";
      line2.innerHTML = "";
      line3.innerHTML = "";
    } else {
      line1.innerHTML = `${data.multiplicand} × ${data.multiplier} = ${data.multiplicand} × (<span class="fact">${data.part1M}</span> + <span class="fact">${data.part2M}</span>)`;
      line2.innerHTML =
        stepIndex >= 1
          ? `${data.multiplicand} × ${data.part1M} = <span class="fact">${data.part1Value}</span> &nbsp;&nbsp; ${data.multiplicand} × ${data.part2M} = <span class="fact">${data.part2Value}</span>`
          : "";
      line3.innerHTML =
        stepIndex >= 2 ? `${data.part1Value} + ${data.part2Value} = <span class="fact">${data.total}</span>` : "";
    }

    prevBtn.disabled = stepIndex <= -1;
    nextBtn.disabled = stepIndex >= maxStep;
  }

  function loadExample(idx) {
    const ex = MENTAL_EXAMPLES[idx];
    data = computeMultiplicationMental(ex.multiplicand, ex.multiplier);
    maxStep = data.trivial ? 0 : 2;
    stepIndex = -1;
    render();
  }

  nextBtn.addEventListener("click", () => {
    if (stepIndex < maxStep) {
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
    data = computeMultiplicationMental(randomMultiplicand(), randomMultiplier(currentLength));
    totalStages = data.trivial ? 1 : 3;
    stage = 0;
    attempts = 0;
    roundHasError = false;

    setProgress(0);
    els.nextBtn.style.display = "none";
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.input.style.display = "";
    els.checkBtn.style.display = "";

    els.equation.innerHTML = data.trivial
      ? `${data.multiplicand} × ${data.multiplier}`
      : `${data.multiplicand} × ${data.multiplier} = ${data.multiplicand} × (${data.part1M}+${data.part2M})`;

    askStage();
  }

  function askStage() {
    els.input.value = "";
    els.input.classList.remove("correct", "incorrect");
    els.input.disabled = false;

    if (data.trivial) {
      els.instruction.innerHTML = `¿Cuánto es <strong>${data.multiplicand} × ${data.multiplier}</strong>?`;
    } else if (stage === 0) {
      els.instruction.innerHTML = `¿Cuánto es <strong>${data.multiplicand} × ${data.part1M}</strong>?`;
    } else if (stage === 1) {
      els.instruction.innerHTML = `¿Cuánto es <strong>${data.multiplicand} × ${data.part2M}</strong>?`;
    } else {
      els.instruction.innerHTML = `¿Cuánto es <strong>${data.part1Value} + ${data.part2Value}</strong>?`;
    }
  }

  function expectedAnswer() {
    if (data.trivial) return data.total;
    if (stage === 0) return data.part1Value;
    if (stage === 1) return data.part2Value;
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
    stage++;
    if (stage < totalStages) {
      askStage();
    } else {
      finishRound();
    }
  }

  function finishRound() {
    const allCorrect = !roundHasError;
    if (allCorrect) scoreOk++;
    else scoreKo++;
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.instruction.textContent = "";
    els.input.style.display = "none";
    els.checkBtn.style.display = "none";

    const titleText = allCorrect ? "Correcto en todos los pasos" : "Casi, revisa los pasos marcados";

    els.feedback.classList.add("show", allCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `
      <p class="feedback-title">${titleText}</p>
      <p><strong>${data.multiplicand} × ${data.multiplier} = ${data.total}</strong></p>
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
