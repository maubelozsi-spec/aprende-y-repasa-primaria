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

const MULT_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Multiplicar por una sola cifra (nivel simplificado)",
    text: "Se empieza multiplicando un número pequeño de dos cifras por un solo dígito, sin productos parciales que sumar.",
    example: "23 × 3 = 69 (un único paso, sin descomponer el multiplicador)",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene la misma dificultad, con instrucciones más cortas y una tipografía pensada para facilitar la lectura.",
    example: "236 × 4 → un producto parcial por cada cifra del multiplicador.",
  },
  tdah: {
    badge: "TDAH",
    title: "Multiplicar por una sola cifra, menos pasos",
    text: "Se practica siempre con un multiplicador de <strong>1 cifra</strong> (un único paso) para mantener mejor la atención.",
    example: "236 × 4 → un solo producto que calcular.",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Multiplicar por una cifra, con apoyo extra",
    text: "Igual que en ACS, se multiplica un número pequeño por un solo dígito, recordando en cada paso qué se está multiplicando.",
    example: "23 × 3 → multiplicamos 23 por 3, una sola vez.",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Multiplicador de 3 cifras, el nivel más exigente",
    text: "Se practica siempre con un multiplicador de <strong>3 cifras</strong>, con varios productos parciales que sumar.",
    example: "482 × 137 → tres productos parciales que sumar.",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Se responde eligiendo, no escribiendo a mano",
    text: "La respuesta de cada paso se elige entre varias opciones en lugar de teclearla.",
    example: "Elige el resultado correcto tocando un botón.",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initMethodPicker();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, MULT_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), MULT_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("demo-multiplicand")) initDemo();
  if (document.getElementById("game-multiplicand")) initGame(diff, (fn) => restartCallbacks.push(fn));
  if (document.getElementById("mental-demo-line1")) initMentalDemo();
  if (document.getElementById("mental-game-equation")) initMentalGame(diff, (fn) => restartCallbacks.push(fn));
});

function numericDistractors(correct) {
  const candidates = new Set([correct + 1, correct - 1, correct + 10, correct - 10, correct + 2, correct - 2]);
  candidates.delete(correct);
  const pool = [...candidates].filter((v) => v >= 0);
  const distractors = [];
  while (distractors.length < 3 && pool.length) {
    const idx = randomInt(0, pool.length - 1);
    distractors.push(pool.splice(idx, 1)[0]);
  }
  while (distractors.length < 3) {
    distractors.push(correct + distractors.length + 3);
  }
  return distractors;
}

function shuffleArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

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

function randomMultiplicandACS() {
  return randomInt(10, 30);
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

function initGame(diff, registerRestart) {
  const mcEl = document.getElementById("game-multiplicand");
  const mrEl = document.getElementById("game-multiplier");
  const partialsEl = document.getElementById("game-partials");
  const sumLineEl = document.getElementById("game-sum-line");
  const resultEl = document.getElementById("game-result");

  const els = {
    card: document.getElementById("practica-escrita"),
    lengthBtns: document.querySelectorAll("#length-picker-w [data-len]"),
    instruction: document.getElementById("game-instruction"),
    inputsRow: document.getElementById("game-inputs-row"),
    input: document.getElementById("game-answer-input"),
    checkBtn: document.getElementById("game-check-btn"),
    choices: document.getElementById("game-answer-choices"),
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

  function applyDifficultyUI() {
    const forced = diff.is("acs") || diff.is("discalculia") || diff.is("tdah") ? 1 : diff.is("altas") ? 3 : null;
    els.lengthBtns.forEach((b) => (b.disabled = forced !== null));
    if (forced !== null) {
      currentLength = forced;
      els.lengthBtns.forEach((b) => b.classList.toggle("active", Number(b.dataset.len) === forced));
    }
    els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startProblem();
  });
  applyDifficultyUI();

  function setProgress(pct) {
    els.progressFill.style.width = pct + "%";
  }

  function startProblem() {
    problem =
      diff.is("acs") || diff.is("discalculia")
        ? computeMultiplicationSteps(randomMultiplicandACS(), randomInt(2, 9))
        : computeMultiplicationSteps(randomMultiplicand(), randomMultiplier(currentLength));
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

    askStage();
  }

  function askStage() {
    if (diff.is("disgrafia")) {
      els.inputsRow.style.display = "none";
      els.choices.style.display = "";
    } else {
      els.inputsRow.style.display = "";
      els.choices.style.display = "none";
      els.input.value = "";
      els.input.classList.remove("correct", "incorrect");
      els.input.disabled = false;
    }

    if (stage < problem.partials.length) {
      const p = problem.partials[stage];
      els.instruction.innerHTML = `¿Cuánto es <strong>${problem.multiplicand} × ${p.factor}</strong>?`;
    } else {
      const sumText = problem.partials.map((p) => p.partialValue).join(" + ");
      els.instruction.innerHTML = `¿Cuánto es <strong>${sumText}</strong>?`;
    }

    if (diff.is("disgrafia")) renderChoiceButtons();
  }

  function renderChoiceButtons() {
    const expected = expectedAnswer();
    const options = shuffleArray([expected, ...numericDistractors(expected)]);
    els.choices.innerHTML = "";
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "syllable-chip";
      btn.textContent = opt;
      btn.addEventListener("click", () => chooseAnswerButton(opt, btn));
      els.choices.appendChild(btn);
    });
  }

  function chooseAnswerButton(chosen, btn) {
    const expected = expectedAnswer();
    const isCorrect = chosen === expected;
    attempts++;

    const allBtns = els.choices.querySelectorAll(".syllable-chip");
    allBtns.forEach((b) => (b.disabled = true));

    if (isCorrect) {
      btn.classList.add("correct");
      setTimeout(advanceStage, 600);
      return;
    }

    btn.classList.add("incorrect");

    if (attempts >= 2) {
      roundHasError = true;
      allBtns.forEach((b) => {
        if (Number(b.textContent) === expected) b.classList.add("correct");
      });
      setTimeout(advanceStage, 900);
    } else {
      setTimeout(() => {
        allBtns.forEach((b) => {
          b.disabled = false;
          b.classList.remove("incorrect");
        });
      }, 700);
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
    AppProgress.record("multiplicaciones", allCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.instruction.textContent = "";
    els.inputsRow.style.display = "none";
    els.choices.style.display = "none";

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

function initMentalGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-mental"),
    lengthBtns: document.querySelectorAll("#length-picker-m [data-len]"),
    equation: document.getElementById("mental-game-equation"),
    instruction: document.getElementById("mental-game-instruction"),
    inputsRow: document.getElementById("mental-inputs-row"),
    input: document.getElementById("mental-answer-input"),
    checkBtn: document.getElementById("mental-check-btn"),
    choices: document.getElementById("mental-answer-choices"),
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

  function applyDifficultyUI() {
    const forced = diff.is("acs") || diff.is("discalculia") || diff.is("tdah") ? 1 : diff.is("altas") ? 3 : null;
    els.lengthBtns.forEach((b) => (b.disabled = forced !== null));
    if (forced !== null) {
      currentLength = forced;
      els.lengthBtns.forEach((b) => b.classList.toggle("active", Number(b.dataset.len) === forced));
    }
    els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startProblem();
  });
  applyDifficultyUI();

  function setProgress(pct) {
    els.progressFill.style.width = pct + "%";
  }

  function startProblem() {
    data =
      diff.is("acs") || diff.is("discalculia")
        ? computeMultiplicationMental(randomMultiplicandACS(), randomInt(2, 9))
        : computeMultiplicationMental(randomMultiplicand(), randomMultiplier(currentLength));
    totalStages = data.trivial ? 1 : 3;
    stage = 0;
    attempts = 0;
    roundHasError = false;

    setProgress(0);
    els.nextBtn.style.display = "none";
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";

    els.equation.innerHTML = data.trivial
      ? `${data.multiplicand} × ${data.multiplier}`
      : `${data.multiplicand} × ${data.multiplier} = ${data.multiplicand} × (${data.part1M}+${data.part2M})`;

    askStage();
  }

  function askStage() {
    if (diff.is("disgrafia")) {
      els.inputsRow.style.display = "none";
      els.choices.style.display = "";
    } else {
      els.inputsRow.style.display = "";
      els.choices.style.display = "none";
      els.input.value = "";
      els.input.classList.remove("correct", "incorrect");
      els.input.disabled = false;
    }

    if (data.trivial) {
      els.instruction.innerHTML = `¿Cuánto es <strong>${data.multiplicand} × ${data.multiplier}</strong>?`;
    } else if (stage === 0) {
      els.instruction.innerHTML = `¿Cuánto es <strong>${data.multiplicand} × ${data.part1M}</strong>?`;
    } else if (stage === 1) {
      els.instruction.innerHTML = `¿Cuánto es <strong>${data.multiplicand} × ${data.part2M}</strong>?`;
    } else {
      els.instruction.innerHTML = `¿Cuánto es <strong>${data.part1Value} + ${data.part2Value}</strong>?`;
    }

    if (diff.is("disgrafia")) renderChoiceButtons();
  }

  function renderChoiceButtons() {
    const expected = expectedAnswer();
    const options = shuffleArray([expected, ...numericDistractors(expected)]);
    els.choices.innerHTML = "";
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "syllable-chip";
      btn.textContent = opt;
      btn.addEventListener("click", () => chooseAnswerButton(opt, btn));
      els.choices.appendChild(btn);
    });
  }

  function chooseAnswerButton(chosen, btn) {
    const expected = expectedAnswer();
    const isCorrect = chosen === expected;
    attempts++;

    const allBtns = els.choices.querySelectorAll(".syllable-chip");
    allBtns.forEach((b) => (b.disabled = true));

    if (isCorrect) {
      btn.classList.add("correct");
      setTimeout(advanceStage, 600);
      return;
    }

    btn.classList.add("incorrect");

    if (attempts >= 2) {
      roundHasError = true;
      allBtns.forEach((b) => {
        if (Number(b.textContent) === expected) b.classList.add("correct");
      });
      setTimeout(advanceStage, 900);
    } else {
      setTimeout(() => {
        allBtns.forEach((b) => {
          b.disabled = false;
          b.classList.remove("incorrect");
        });
      }, 700);
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
    AppProgress.record("multiplicaciones", allCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.instruction.textContent = "";
    els.inputsRow.style.display = "none";
    els.choices.style.display = "none";

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
