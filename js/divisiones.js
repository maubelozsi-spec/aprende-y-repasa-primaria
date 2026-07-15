// ============================================================
// Divisiones: motor de cálculo paso a paso + demo teórica + juego
// Dos métodos: división escrita (algoritmo tradicional) y
// cálculo mental (descomposición del dividendo).
// ============================================================

function tanteoInfo(workingNumber, divisor) {
  const divisorStr = String(divisor);
  const divisorDigits = divisorStr.length;
  const leadDigit = Number(divisorStr[0]);
  const scaledLead = leadDigit * Math.pow(10, divisorDigits - 1);
  const estimate = Math.min(9, Math.floor(workingNumber / scaledLead));
  return { leadDigit, estimate };
}

function computeDivisionSteps(dividend, divisor) {
  const digits = String(dividend).split("").map(Number);
  const steps = [];
  let i = 0;
  let working = 0;
  let brought = "";

  while (i < digits.length) {
    working = working * 10 + digits[i];
    brought += digits[i];
    i++;
    if (working >= divisor) break;
  }

  function buildStep(workingNumber, broughtDigits, digitsUsedUpTo) {
    const qDigit = Math.floor(workingNumber / divisor);
    const product = qDigit * divisor;
    const remainder = workingNumber - product;
    const { leadDigit, estimate } = tanteoInfo(workingNumber, divisor);
    const overshoot = estimate - qDigit;
    let caseType;
    if (qDigit === 0) caseType = "no-coge";
    else if (overshoot <= 0) caseType = "directo";
    else if (overshoot === 1) caseType = "se-pasa";
    else caseType = "se-pasa-mucho";
    return { broughtDigits, workingNumber, quotientDigit: qDigit, product, remainder, digitsUsedUpTo, leadDigit, estimate, overshoot, caseType };
  }

  steps.push(buildStep(working, brought, i));

  while (i < digits.length) {
    const nextDigit = digits[i];
    const newWorking = steps[steps.length - 1].remainder * 10 + nextDigit;
    i++;
    steps.push(buildStep(newWorking, String(nextDigit), i));
  }

  const quotient = String(Number(steps.map((s) => s.quotientDigit).join("")));
  const finalRemainder = steps[steps.length - 1].remainder;
  return { dividend: String(dividend), divisor, digits, steps, quotient, finalRemainder };
}

function computeMentalDecomposition(dividend, divisor) {
  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;

  const qStr = String(quotient);
  const numDigits = qStr.length;
  const leadingDigit = Number(qStr[0]);
  const placeValue = Math.pow(10, numDigits - 1);

  const part1Q = leadingDigit * placeValue;
  const part2Q = quotient - part1Q;
  const part1Dividend = part1Q * divisor;
  const part2Dividend = part2Q * divisor;

  return {
    dividend,
    divisor,
    quotient,
    remainder,
    part1Q,
    part2Q,
    part1Dividend,
    part2Dividend,
    trivial: numDigits === 1 || part2Q === 0,
  };
}

function stepExplanation(problem, stepIndex) {
  const step = problem.steps[stepIndex];
  const isFirst = stepIndex === 0;
  const bringText = isFirst
    ? `Tomamos las primeras cifras del dividendo: <strong>${step.broughtDigits}</strong>.`
    : `Bajamos la siguiente cifra (<strong>${step.broughtDigits}</strong>) y formamos el <strong>${step.workingNumber}</strong>.`;

  if (step.caseType === "no-coge") {
    const tanteoNote =
      step.overshoot > 0
        ? ` Si tanteamos <strong>${step.estimate}</strong>, ${step.estimate} × ${problem.divisor} = ${step.estimate * problem.divisor} también se pasa, así que confirmamos que es 0.`
        : "";
    return `${bringText} El grupo <strong>${step.workingNumber}</strong> es menor que el divisor (${problem.divisor}), así que esta cifra del cociente es <strong>0</strong> (no coge) y bajamos otra cifra sin restar.${tanteoNote}`;
  }

  const leadPhrase =
    problem.divisor < 10
      ? `comparamos el propio divisor (<strong>${problem.divisor}</strong>)`
      : `miramos la primera cifra del divisor (<strong>${step.leadDigit}</strong>)`;

  if (step.caseType === "directo") {
    return `${bringText} Tanteamos: ${leadPhrase} con <strong>${step.workingNumber}</strong> → probamos <strong>${step.estimate}</strong>. Comprobamos: ${step.estimate} × ${problem.divisor} = ${step.product} y no se pasa (resto ${step.remainder} &lt; ${problem.divisor}) → el cociente es <strong>${step.quotientDigit}</strong>. ¡A la primera!`;
  }

  const severity = step.caseType === "se-pasa-mucho" ? "¡se pasa mucho!" : "¡se pasa!";
  const adjustText = step.caseType === "se-pasa-mucho" ? "Bajamos el tanteo varias veces" : "Bajamos el tanteo";
  return `${bringText} Tanteamos: ${leadPhrase} con <strong>${step.workingNumber}</strong> → probamos <strong>${step.estimate}</strong>. Comprobamos: ${step.estimate} × ${problem.divisor} = ${step.estimate * problem.divisor}, ${severity} (mayor que ${step.workingNumber}). ${adjustText} hasta <strong>${step.quotientDigit}</strong>: ${step.quotientDigit} × ${problem.divisor} = ${step.product}, resto ${step.remainder}.`;
}

function finalExplanation(problem) {
  const check = problem.divisor * Number(problem.quotient) + problem.finalRemainder;
  return `Ya no quedan más cifras que bajar. El cociente es <strong>${problem.quotient}</strong> y el resto es <strong>${problem.finalRemainder}</strong>. Comprobación: ${problem.divisor} × ${problem.quotient} + ${problem.finalRemainder} = ${check}.`;
}

function createDivisionView(prefix) {
  return {
    dividend: document.getElementById(prefix + "-dividend"),
    workarea: document.getElementById(prefix + "-workarea"),
    divisor: document.getElementById(prefix + "-divisor"),
    quotient: document.getElementById(prefix + "-quotient"),
    resultBanner: document.getElementById(prefix + "-result-banner"),
  };
}

function renderDividend(view, problem, usedCount, currentStart) {
  const start = currentStart === undefined ? usedCount : currentStart;
  view.dividend.innerHTML = "";
  const bracket = view.dividend._bracket;
  problem.digits.forEach((d, i) => {
    const span = document.createElement("span");
    let cls = "letter";
    if (i < start) cls += " used";
    else if (i < usedCount) cls += " current";
    span.className = cls;
    span.textContent = d;
    view.dividend.appendChild(span);
  });
  if (bracket) view.dividend.appendChild(bracket);
}

function positionBracket(view, problem, stepIndex) {
  const bracket = view.dividend._bracket;
  if (!bracket) return;
  const DIGIT_W = 48;
  if (stepIndex <= 0 && problem.steps.length) {
    const groupSize = problem.steps[0].broughtDigits.length;
    bracket.style.width = groupSize * DIGIT_W - 2 + "px";
    bracket.style.opacity = "1";
  } else {
    bracket.style.opacity = "0";
  }
}

function showResultBanner(bannerEl, problem, visible) {
  if (!bannerEl) return;
  if (!visible) {
    bannerEl.classList.remove("show");
    bannerEl.innerHTML = "";
    return;
  }
  const resultText = problem.finalRemainder
    ? `${problem.dividend} ÷ ${problem.divisor} = ${problem.quotient}  (resto ${problem.finalRemainder})`
    : `${problem.dividend} ÷ ${problem.divisor} = ${problem.quotient}`;
  bannerEl.innerHTML = `${resultText}<span class="banner-emoji">🎉</span>`;
  bannerEl.classList.add("show");
}

function resetDivisionView(view, problem) {
  view.divisor.textContent = problem.divisor;
  view.workarea.innerHTML = "";
  view.quotient.innerHTML = "";
  const existingBracket = view.dividend.querySelector(".division-bracket");
  view.dividend._bracket = existingBracket || null;
  renderDividend(view, problem, 0, 0);
  positionBracket(view, problem, -1);
  showResultBanner(view.resultBanner, problem, false);
}

function appendQuotientDigit(view, step) {
  const slot = document.createElement("span");
  slot.className = "quotient-slot";
  if (step.overshoot > 0) {
    const wrong = document.createElement("span");
    wrong.className = "tanteo-wrong";
    wrong.textContent = step.estimate;
    slot.appendChild(wrong);
  }
  const final = document.createElement("span");
  final.className = "tanteo-final";
  final.textContent = step.quotientDigit;
  slot.appendChild(final);
  view.quotient.appendChild(slot);
}

function appendWorkStep(view, step) {
  const startDigitIndex = step.digitsUsedUpTo - step.broughtDigits.length;
  const block = document.createElement("div");
  block.className = "division-step-block";
  block.style.marginLeft = startDigitIndex * 48 + "px";
  block.innerHTML = `
    <div class="working-line">${step.workingNumber}</div>
    <div class="op-line">− ${step.product}</div>
    <div class="result-line">${step.remainder}</div>
  `;
  view.workarea.appendChild(block);
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initMethodPicker();
  if (document.getElementById("demo-dividend")) initDemo();
  if (document.getElementById("game-dividend")) initGame();
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

// ---------------- Demo (Teoría · método escrito) ----------------

const DEMO_EXAMPLES = [
  { dividend: 812, divisor: 4 },
  { dividend: 6273, divisor: 25 },
  { dividend: 92568, divisor: 134 },
];

function initDemo() {
  const view = createDivisionView("demo");
  const explanationEl = document.getElementById("demo-explanation");
  const prevBtn = document.getElementById("demo-prev");
  const nextBtn = document.getElementById("demo-next");
  const resetBtn = document.getElementById("demo-reset");
  const pickerBtns = document.querySelectorAll("#example-picker [data-example]");

  let problem;
  let stepIndex;

  function updateButtons() {
    prevBtn.disabled = stepIndex <= -1;
    nextBtn.disabled = stepIndex >= problem.steps.length;
    nextBtn.textContent = stepIndex === problem.steps.length - 1 ? "Ver resultado final" : "Siguiente paso";
  }

  function rebuildUpTo(idx) {
    stepIndex = idx;
    resetDivisionView(view, problem);

    for (let s = 0; s <= idx && s < problem.steps.length; s++) {
      appendWorkStep(view, problem.steps[s]);
      appendQuotientDigit(view, problem.steps[s]);
    }

    let usedCount = 0;
    let currentStart = 0;
    if (idx >= 0) {
      const lastVisibleStep = Math.min(idx, problem.steps.length - 1);
      usedCount = problem.steps[lastVisibleStep].digitsUsedUpTo;
      if (idx < problem.steps.length) {
        const curStep = problem.steps[idx];
        currentStart = curStep.digitsUsedUpTo - curStep.broughtDigits.length;
      } else {
        currentStart = usedCount;
      }
    }
    renderDividend(view, problem, usedCount, currentStart);
    positionBracket(view, problem, idx);

    const isFinished = idx >= problem.steps.length;
    showResultBanner(view.resultBanner, problem, isFinished);

    if (idx === -1) {
      explanationEl.innerHTML = "Pulsa «Siguiente paso» para empezar.";
    } else if (isFinished) {
      explanationEl.innerHTML = finalExplanation(problem);
    } else {
      explanationEl.innerHTML = stepExplanation(problem, idx);
    }

    updateButtons();
  }

  function loadExample(idx) {
    const ex = DEMO_EXAMPLES[idx];
    problem = computeDivisionSteps(ex.dividend, ex.divisor);
    rebuildUpTo(-1);
  }

  function goNext() {
    if (stepIndex < problem.steps.length) rebuildUpTo(stepIndex + 1);
  }

  function goPrev() {
    if (stepIndex > -1) rebuildUpTo(stepIndex - 1);
  }

  const videoCallout = document.getElementById("video-2cifras");

  pickerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      pickerBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      loadExample(Number(btn.dataset.example));
      if (videoCallout) videoCallout.style.display = btn.dataset.example === "1" ? "" : "none";
    });
  });

  nextBtn.addEventListener("click", goNext);
  prevBtn.addEventListener("click", goPrev);
  resetBtn.addEventListener("click", () => rebuildUpTo(-1));

  loadExample(0);
}

// ---------------- Generación aleatoria de problemas ----------------

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDivisionPair(length) {
  let divisor, dividend;
  if (length === 1) {
    divisor = randomInt(2, 9);
    dividend = randomInt(100, 999);
  } else if (length === 2) {
    divisor = randomInt(10, 99);
    dividend = randomInt(1000, 9999);
  } else {
    divisor = randomInt(100, 999);
    dividend = randomInt(10000, 99999);
  }
  return { dividend, divisor };
}

function generateDivisionProblem(length) {
  const { dividend, divisor } = randomDivisionPair(length);
  return computeDivisionSteps(dividend, divisor);
}

function generateMentalProblem(length) {
  let data;
  let attempts = 0;
  do {
    const { dividend, divisor } = randomDivisionPair(length);
    data = computeMentalDecomposition(dividend, divisor);
    attempts++;
  } while (data.trivial && attempts < 20);
  return data;
}

// ---------------- Juego (Práctica · método escrito) ----------------

function initGame() {
  const view = createDivisionView("game");
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
  let currentLength = 1;
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
    problem = generateDivisionProblem(currentLength);
    stepIndex = 0;
    attempts = 0;
    roundHasError = false;

    resetDivisionView(view, problem);
    setProgress(0);
    els.nextBtn.style.display = "none";
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";

    askCurrentStep();
  }

  function askCurrentStep() {
    const step = problem.steps[stepIndex];
    const isFirst = stepIndex === 0;
    const bring = isFirst
      ? `Tomamos las primeras cifras: <strong>${step.broughtDigits}</strong>.`
      : `Bajamos la siguiente cifra (<strong>${step.broughtDigits}</strong>) y formamos el <strong>${step.workingNumber}</strong>.`;
    els.instruction.innerHTML = `${bring} ¿Cuántas veces cabe el ${problem.divisor} en ${step.workingNumber}?`;
    renderDigitButtons();
  }

  function chooseDigit(digit, btn) {
    const step = problem.steps[stepIndex];
    const isCorrect = digit === step.quotientDigit;
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
        if (Number(b.textContent) === step.quotientDigit) b.classList.add("correct");
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
    appendWorkStep(view, step);
    appendQuotientDigit(view, step);
    renderDividend(view, problem, step.digitsUsedUpTo);

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
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.instruction.textContent = "";
    els.digitButtons.innerHTML = "";

    const check = problem.divisor * Number(problem.quotient) + problem.finalRemainder;
    const titleText = allCorrect ? "Correcto en todos los pasos" : "Casi, revisa los pasos marcados";
    const resultLine = problem.finalRemainder
      ? `${problem.dividend} ÷ ${problem.divisor} = ${problem.quotient}, resto ${problem.finalRemainder}`
      : `${problem.dividend} ÷ ${problem.divisor} = ${problem.quotient} (división exacta)`;

    els.feedback.classList.add("show", allCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `
      <p class="feedback-title">${titleText}</p>
      <p><strong>${resultLine}</strong></p>
      <p>Comprobación: ${problem.divisor} × ${problem.quotient} + ${problem.finalRemainder} = ${check}</p>
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
  { dividend: 936, divisor: 4 },
  { dividend: 1476, divisor: 12 },
  { dividend: 45678, divisor: 123 },
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
      line1.innerHTML = `${data.dividend} ÷ ${data.divisor} = (<span class="fact">${data.part1Dividend}</span> + <span class="fact">${data.part2Dividend}</span>) ÷ ${data.divisor}`;
      line2.innerHTML =
        stepIndex >= 1
          ? `${data.part1Dividend} ÷ ${data.divisor} = <span class="fact">${data.part1Q}</span> &nbsp;&nbsp; ${data.part2Dividend} ÷ ${data.divisor} = <span class="fact">${data.part2Q}</span>`
          : "";
      line3.innerHTML =
        stepIndex >= 2
          ? `${data.part1Q} + ${data.part2Q} = <span class="fact">${data.quotient}</span>` +
            (data.remainder ? ` &nbsp; (y sobran ${data.remainder})` : "")
          : "";
    }

    prevBtn.disabled = stepIndex <= -1;
    nextBtn.disabled = stepIndex >= 2;
  }

  function loadExample(idx) {
    const ex = MENTAL_EXAMPLES[idx];
    data = computeMentalDecomposition(ex.dividend, ex.divisor);
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
  let currentLength = 1;
  let data, stage, attempts, roundHasError;

  function setProgress(pct) {
    els.progressFill.style.width = pct + "%";
  }

  function startProblem() {
    data = generateMentalProblem(currentLength);
    stage = 0;
    attempts = 0;
    roundHasError = false;

    setProgress(0);
    els.nextBtn.style.display = "none";
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.input.style.display = "";
    els.checkBtn.style.display = "";

    els.equation.innerHTML = `${data.dividend} ÷ ${data.divisor} = (<span class="fact">${data.part1Dividend}</span> + <span class="fact">${data.part2Dividend}</span>) ÷ ${data.divisor}`;

    askStage();
  }

  function askStage() {
    els.input.value = "";
    els.input.classList.remove("correct", "incorrect");
    els.input.disabled = false;

    if (stage === 0) {
      els.instruction.innerHTML = `¿Cuánto es <strong>${data.part1Dividend} ÷ ${data.divisor}</strong>?`;
    } else if (stage === 1) {
      els.instruction.innerHTML = `¿Cuánto es <strong>${data.part2Dividend} ÷ ${data.divisor}</strong>?`;
    } else {
      els.instruction.innerHTML = `¿Cuánto es <strong>${data.part1Q} + ${data.part2Q}</strong>?`;
    }
  }

  function expectedAnswer() {
    if (stage === 0) return data.part1Q;
    if (stage === 1) return data.part2Q;
    return data.quotient;
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
    setProgress(Math.round(((stage + 1) / 3) * 100));
    attempts = 0;
    if (stage < 2) {
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
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.instruction.textContent = "";
    els.input.style.display = "none";
    els.checkBtn.style.display = "none";

    const titleText = allCorrect ? "Correcto en todos los pasos" : "Casi, revisa los pasos marcados";
    const resultLine = data.remainder
      ? `${data.dividend} ÷ ${data.divisor} = ${data.quotient}, resto ${data.remainder}`
      : `${data.dividend} ÷ ${data.divisor} = ${data.quotient} (división exacta)`;

    els.feedback.classList.add("show", allCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `
      <p class="feedback-title">${titleText}</p>
      <p><strong>${resultLine}</strong></p>
      <p>Descomposición: ${data.part1Dividend} ÷ ${data.divisor} = ${data.part1Q}, ${data.part2Dividend} ÷ ${data.divisor} = ${data.part2Q}, ${data.part1Q} + ${data.part2Q} = ${data.quotient}</p>
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
