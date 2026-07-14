// ============================================================
// Divisiones: motor de cálculo paso a paso + demo teórica + juego
// ============================================================

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

  let qDigit = Math.floor(working / divisor);
  let product = qDigit * divisor;
  let remainder = working - product;
  steps.push({ broughtDigits: brought, workingNumber: working, quotientDigit: qDigit, product, remainder, digitsUsedUpTo: i });

  while (i < digits.length) {
    const nextDigit = digits[i];
    const newWorking = remainder * 10 + nextDigit;
    i++;
    qDigit = Math.floor(newWorking / divisor);
    product = qDigit * divisor;
    remainder = newWorking - product;
    steps.push({ broughtDigits: String(nextDigit), workingNumber: newWorking, quotientDigit: qDigit, product, remainder, digitsUsedUpTo: i });
  }

  const quotient = String(Number(steps.map((s) => s.quotientDigit).join("")));
  return { dividend: String(dividend), divisor, digits, steps, quotient, finalRemainder: remainder };
}

function stepExplanation(problem, stepIndex) {
  const step = problem.steps[stepIndex];
  const isFirst = stepIndex === 0;
  const bringText = isFirst
    ? `Tomamos las primeras cifras del dividendo: <strong>${step.broughtDigits}</strong>.`
    : `Bajamos la siguiente cifra (<strong>${step.broughtDigits}</strong>) y formamos el <strong>${step.workingNumber}</strong>.`;
  return `${bringText} ¿Cuántas veces cabe el ${problem.divisor} en ${step.workingNumber}? → <strong>${step.quotientDigit}</strong> veces, porque ${step.quotientDigit} × ${problem.divisor} = ${step.product}. Restamos: ${step.workingNumber} − ${step.product} = ${step.remainder}.`;
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
  };
}

function renderDividend(view, problem, usedCount) {
  view.dividend.innerHTML = "";
  problem.digits.forEach((d, i) => {
    const span = document.createElement("span");
    span.className = "letter" + (i < usedCount ? " used" : "");
    span.textContent = d;
    view.dividend.appendChild(span);
  });
}

function resetDivisionView(view, problem) {
  view.divisor.textContent = problem.divisor;
  view.workarea.innerHTML = "";
  view.quotient.innerHTML = "";
  renderDividend(view, problem, 0);
}

function appendQuotientDigit(view, digit) {
  const span = document.createElement("span");
  span.className = "letter";
  span.textContent = digit;
  view.quotient.appendChild(span);
}

function appendWorkStep(view, step) {
  const block = document.createElement("div");
  block.className = "division-step-block";
  block.innerHTML = `
    <div>${step.workingNumber}</div>
    <div class="op-line">− ${step.product}</div>
    <div class="result-line">${step.remainder}</div>
  `;
  view.workarea.appendChild(block);
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  if (document.getElementById("demo-dividend")) initDemo();
  if (document.getElementById("game-dividend")) initGame();
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

  const goBtn = document.getElementById("go-to-practice");
  if (goBtn) goBtn.addEventListener("click", () => activateTab("practica"));
}

// ---------------- Demo (Teoría) ----------------

const DEMO_EXAMPLES = [
  { dividend: 936, divisor: 4 },
  { dividend: 1476, divisor: 12 },
  { dividend: 40824, divisor: 204 },
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
      appendQuotientDigit(view, problem.steps[s].quotientDigit);
    }

    const lastVisibleStep = Math.min(idx, problem.steps.length - 1);
    const usedCount = idx >= 0 ? problem.steps[lastVisibleStep].digitsUsedUpTo : 0;
    renderDividend(view, problem, usedCount);

    if (idx === -1) {
      explanationEl.innerHTML = "Pulsa «Siguiente paso» para empezar.";
    } else if (idx >= problem.steps.length) {
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

  pickerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      pickerBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      loadExample(Number(btn.dataset.example));
    });
  });

  nextBtn.addEventListener("click", goNext);
  prevBtn.addEventListener("click", goPrev);
  resetBtn.addEventListener("click", () => rebuildUpTo(-1));

  loadExample(0);
}

// ---------------- Juego (Práctica) ----------------

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDivisionProblem(length) {
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
  return computeDivisionSteps(dividend, divisor);
}

function initGame() {
  const view = createDivisionView("game");
  const els = {
    lengthBtns: document.querySelectorAll("#length-picker [data-len]"),
    instruction: document.getElementById("game-instruction"),
    digitButtons: document.getElementById("digit-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-problem"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
    progressFill: document.getElementById("progress-fill"),
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
    appendQuotientDigit(view, step.quotientDigit);
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
