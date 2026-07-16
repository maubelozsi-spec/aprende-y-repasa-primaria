// ============================================================
// Ángulos: banco de datos + lógica del quiz
// ============================================================

const ANGULO_ENTRIES = [
  { degrees: 30, tipo: "Agudo" },
  { degrees: 45, tipo: "Agudo" },
  { degrees: 60, tipo: "Agudo" },
  { degrees: 75, tipo: "Agudo" },
  { degrees: 90, tipo: "Recto" },
  { degrees: 100, tipo: "Obtuso" },
  { degrees: 120, tipo: "Obtuso" },
  { degrees: 150, tipo: "Obtuso" },
  { degrees: 170, tipo: "Obtuso" },
  { degrees: 180, tipo: "Llano" },
  { degrees: 360, tipo: "Completo" },
];

const TIPOS = ["Agudo", "Recto", "Obtuso", "Llano", "Completo"];

function angleSVG(degrees) {
  const cx = 110;
  const cy = 120;
  const r = 85;

  if (degrees === 360) {
    return `<svg viewBox="0 0 220 220" width="220" height="220">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--color-indigo)" stroke-width="4" stroke-dasharray="8 8"/>
      <line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="var(--text)" stroke-width="4"/>
      <circle cx="${cx}" cy="${cy}" r="5" fill="var(--text)"/>
    </svg>`;
  }

  const rad = (degrees * Math.PI) / 180;
  const x2 = cx + r * Math.cos(rad);
  const y2 = cy - r * Math.sin(rad);

  let extra = "";
  if (degrees === 90) {
    const s = 18;
    extra = `<path d="M ${cx + s} ${cy} L ${cx + s} ${cy - s} L ${cx} ${cy - s}" fill="none" stroke="var(--color-plum)" stroke-width="3"/>`;
  }

  return `<svg viewBox="0 0 220 220" width="220" height="220">
    <line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="var(--text)" stroke-width="4"/>
    <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="var(--text)" stroke-width="4"/>
    ${extra}
    <circle cx="${cx}" cy="${cy}" r="5" fill="var(--text)"/>
  </svg>`;
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  if (document.getElementById("angle-display")) initGame();
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

function initGame() {
  const els = {
    angleDisplay: document.getElementById("angle-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  let scoreOk = 0;
  let scoreKo = 0;
  let current;
  let lastDegrees = null;

  function pickEntry() {
    let entry;
    do {
      entry = ANGULO_ENTRIES[Math.floor(Math.random() * ANGULO_ENTRIES.length)];
    } while (entry.degrees === lastDegrees);
    lastDegrees = entry.degrees;
    return entry;
  }

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function startRound() {
    current = pickEntry();

    els.angleDisplay.innerHTML = angleSVG(current.degrees) + `<span class="pv-label" style="font-size:16px; margin-top:8px;">${current.degrees}°</span>`;

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";

    const options = shuffle(TIPOS.slice());

    els.answerButtons.innerHTML = "";
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "syllable-chip";
      btn.textContent = opt;
      btn.addEventListener("click", () => chooseAnswer(opt, btn));
      els.answerButtons.appendChild(btn);
    });
  }

  function chooseAnswer(chosen, btn) {
    const correct = current.tipo;
    const isCorrect = chosen === correct;

    if (isCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("angulos", isCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    const allBtns = els.answerButtons.querySelectorAll(".syllable-chip");
    allBtns.forEach((b) => {
      b.disabled = true;
      if (b.textContent === correct) b.classList.add("correct");
      else if (b === btn && !isCorrect) b.classList.add("incorrect");
    });

    const titleText = isCorrect ? "Correcto" : "No era esa";

    els.feedback.classList.add("show", isCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `<p class="feedback-title">${titleText}</p><p>${current.degrees}° → <strong>${correct}</strong>.</p>`;

    els.nextBtn.style.display = "";
  }

  els.nextBtn.addEventListener("click", startRound);

  startRound();
}
