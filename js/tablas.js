// ============================================================
// Tablas de multiplicar: visor de teoría + juegos de práctica
// (opción múltiple tipo "tarjeta rápida", con racha de aciertos)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  if (document.getElementById("table-display")) initTableViewer();
  if (document.getElementById("fact-display")) initGame();
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

// ---------------- Visor de tablas (Teoría) ----------------

function initTableViewer() {
  const pickerBtns = document.querySelectorAll("#table-picker [data-table]");
  const display = document.getElementById("table-display");

  function renderTable(n) {
    display.innerHTML = "<tr><th>Multiplicación</th><th>Resultado</th></tr>";
    for (let i = 1; i <= 10; i++) {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${n} × ${i}</td><td>${n * i}</td>`;
      display.appendChild(row);
    }
  }

  pickerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      pickerBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderTable(Number(btn.dataset.table));
    });
  });

  renderTable(1);
}

// ---------------- Generación de preguntas ----------------

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateFact(mode, table) {
  if (mode === "tabla") {
    return { a: table, b: randomInt(1, 10) };
  }
  return { a: randomInt(1, 10), b: randomInt(1, 10) };
}

function generateDistractors(a, b, correct) {
  const candidates = new Set([
    correct - a,
    correct + a,
    correct - b,
    correct + b,
    correct - 10,
    correct + 10,
    correct - 1,
    correct + 1,
  ]);
  candidates.delete(correct);

  const filtered = [...candidates].filter((v) => v > 0 && v <= 100);
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }

  const distractors = [];
  for (const v of filtered) {
    if (distractors.length >= 3) break;
    if (!distractors.includes(v)) distractors.push(v);
  }
  let pad = 2;
  while (distractors.length < 3) {
    const fallback = correct + pad * (distractors.length % 2 === 0 ? 1 : -1);
    pad++;
    if (fallback > 0 && fallback !== correct && !distractors.includes(fallback)) distractors.push(fallback);
  }
  return distractors;
}

function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ---------------- Juego (Práctica) ----------------

function initGame() {
  const els = {
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    tablePickerWrap: document.getElementById("game-table-picker"),
    tableBtns: document.querySelectorAll("#game-table-picker [data-table]"),
    factDisplay: document.getElementById("fact-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
    scoreStreak: document.getElementById("score-streak"),
  };

  let scoreOk = 0;
  let scoreKo = 0;
  let streak = 0;
  let mode = "tabla";
  let selectedTable = 1;
  let current;
  let answered = false;

  function nextFact() {
    answered = false;
    current = generateFact(mode, selectedTable);
    const correct = current.a * current.b;
    const options = shuffle([correct, ...generateDistractors(current.a, current.b, correct)]);

    els.factDisplay.innerHTML = `${current.a} <span class="op">×</span> ${current.b} <span class="op">=</span> ?`;
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";

    els.answerButtons.innerHTML = "";
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "syllable-chip";
      btn.textContent = opt;
      btn.addEventListener("click", () => chooseAnswer(opt, correct, btn));
      els.answerButtons.appendChild(btn);
    });
  }

  function chooseAnswer(chosen, correct, btn) {
    if (answered) return;
    answered = true;

    const isCorrect = chosen === correct;
    const allBtns = els.answerButtons.querySelectorAll(".syllable-chip");
    allBtns.forEach((b) => {
      b.disabled = true;
      if (Number(b.textContent) === correct) b.classList.add("correct");
    });
    if (!isCorrect) btn.classList.add("incorrect");

    if (isCorrect) {
      scoreOk++;
      streak++;
    } else {
      scoreKo++;
      streak = 0;
    }
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;
    els.scoreStreak.textContent = streak;

    els.feedback.classList.add("show", isCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `<p class="feedback-title">${isCorrect ? "¡Correcto!" : "Esa no era"}</p><p>${current.a} × ${current.b} = ${correct}</p>`;

    setTimeout(nextFact, isCorrect ? 700 : 1300);
  }

  els.modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      els.modeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      mode = btn.dataset.mode;
      els.tablePickerWrap.style.display = mode === "tabla" ? "" : "none";
      nextFact();
    });
  });

  els.tableBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      els.tableBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedTable = Number(btn.dataset.table);
      nextFact();
    });
  });

  nextFact();
}
