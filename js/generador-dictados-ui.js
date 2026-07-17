// ============================================================
// Interfaz del generador de dictados: pinta los botones de reglas
// ortográficas, gestiona el número de frases, genera la historia,
// y controla el modo "corrección" (colores + explicación al
// pulsar sobre cada palabra marcada).
// ============================================================

const DICTADO_EASY_RULES = ["h", "gj", "bv", "yll", "cz", "xs", "mayus"];
const DICTADO_ADVANCED_RULES = ["td", "agudas", "llanas", "esdrujulas", "diptongo", "hiato"];

const DICTADO_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo reglas de letras y mayúsculas",
    text: "Para el alumnado con adaptación curricular significativa se restringe a las reglas más concretas (h, g/j, b/v, y/ll, c/z, x/s y mayúsculas), con un dictado más corto.",
    example: "Se desactivan las reglas de acentuación (agudas, llanas, esdrújulas, diptongo, hiato, tilde diacrítica).",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo dictado, texto más legible",
    text: "Se mantienen las mismas reglas y frases, pero el texto de la historia se muestra con una tipografía más legible.",
    example: "Mismo dictado, con un formato más cómodo de leer en pantalla.",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Dictados más cortos",
    text: "Se sugiere un número menor de frases por defecto, para mantener sesiones de dictado más breves y evitar la pérdida de atención.",
    example: "El número de frases se ajusta a 5 al elegir esta adaptación (se puede cambiar).",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Solo reglas de letras y mayúsculas",
    text: "Igual que en ACS, se restringe a las reglas más concretas y se acorta el dictado.",
    example: "Se desactivan las reglas de acentuación, igual que en ACS.",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Solo reglas de acentuación",
    text: "Se practica directamente con las reglas más abstractas: agudas, llanas, esdrújulas, diptongo, hiato y tilde diacrítica.",
    example: "Se activan por defecto las reglas de acentuación en vez de las reglas de letras.",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Dictados más cortos",
    text: "Se sugiere un número menor de frases por defecto, para reducir la cantidad de escritura a mano necesaria.",
    example: "El número de frases se ajusta a 5 al elegir esta adaptación (se puede cambiar).",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const rulesContainer = document.getElementById("dict-rules");
  const selectAllBtn = document.getElementById("dict-select-all");
  const selectNoneBtn = document.getElementById("dict-select-none");
  const countInput = document.getElementById("dict-count");
  const generateBtn = document.getElementById("dict-generate-btn");
  const toggleBtn = document.getElementById("dict-toggle-colors");
  const copyBtn = document.getElementById("dict-copy-btn");
  const statusEl = document.getElementById("dict-status");
  const storyEl = document.getElementById("dict-story");
  const legendEl = document.getElementById("dict-legend");

  let currentDictado = null;
  let showColors = false;
  let popoverEl = null;

  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, DICTADO_DIFFICULTY_EXPLANATIONS);
    applyDifficultyUI();
  });
  renderDifficultyBox("difficulty-box", diff.get(), DICTADO_DIFFICULTY_EXPLANATIONS);

  DICTADO_RULES.forEach((rule, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dictado-rule-toggle" + (i < 2 ? " active" : "");
    btn.dataset.rule = rule.id;
    btn.style.setProperty("--rule-color", rule.color);
    const swatch = document.createElement("span");
    swatch.className = "dictado-swatch";
    const label = document.createElement("span");
    label.textContent = rule.label;
    btn.appendChild(swatch);
    btn.appendChild(label);
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      btn.classList.toggle("active");
    });
    rulesContainer.appendChild(btn);
  });

  function applyDifficultyUI() {
    const easyOnly = diff.is("acs") || diff.is("discalculia");
    const allBtns = [...rulesContainer.querySelectorAll(".dictado-rule-toggle")];

    allBtns.forEach((b) => {
      b.disabled = easyOnly && DICTADO_ADVANCED_RULES.includes(b.dataset.rule);
      if (b.disabled) b.classList.remove("active");
    });

    if (easyOnly && !allBtns.some((b) => b.classList.contains("active"))) {
      allBtns.forEach((b) => b.classList.toggle("active", DICTADO_EASY_RULES.slice(0, 2).includes(b.dataset.rule)));
    }

    if (diff.is("altas")) {
      allBtns.forEach((b) => b.classList.toggle("active", DICTADO_ADVANCED_RULES.includes(b.dataset.rule)));
    }

    if (diff.is("tdah") || diff.is("disgrafia")) {
      countInput.value = 5;
    }

    storyEl.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  applyDifficultyUI();

  selectAllBtn.addEventListener("click", () => {
    rulesContainer.querySelectorAll(".dictado-rule-toggle").forEach((b) => {
      if (!b.disabled) b.classList.add("active");
    });
  });
  selectNoneBtn.addEventListener("click", () => {
    rulesContainer.querySelectorAll(".dictado-rule-toggle").forEach((b) => b.classList.remove("active"));
  });

  function getSelectedRules() {
    return [...rulesContainer.querySelectorAll(".dictado-rule-toggle.active")].map((b) => b.dataset.rule);
  }

  function ensurePopover() {
    if (popoverEl) return popoverEl;
    popoverEl = document.createElement("div");
    popoverEl.className = "dictado-popover";
    popoverEl.style.display = "none";
    document.body.appendChild(popoverEl);
    document.addEventListener("click", (e) => {
      if (popoverEl.style.display !== "none" && !popoverEl.contains(e.target) && !e.target.classList.contains("dictado-word")) {
        closePopover();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePopover();
    });
    window.addEventListener("scroll", () => closePopover(), true);
    return popoverEl;
  }

  function closePopover() {
    if (popoverEl) {
      popoverEl.style.display = "none";
      popoverEl._forSpan = null;
    }
  }

  function togglePopover(span, token) {
    const pop = ensurePopover();
    if (pop.style.display !== "none" && pop._forSpan === span) {
      closePopover();
      return;
    }
    const rule = DICTADO_RULES.find((r) => r.id === token.ruleId);
    pop.innerHTML = "";
    const title = document.createElement("div");
    title.className = "dictado-popover-title";
    title.style.color = rule.color;
    title.textContent = rule.label;
    const body = document.createElement("div");
    body.className = "dictado-popover-body";
    body.textContent = token.reason;
    pop.appendChild(title);
    pop.appendChild(body);
    pop.style.borderColor = rule.color;
    pop.style.display = "block";
    pop._forSpan = span;

    const rect = span.getBoundingClientRect();
    const left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY + 8;
    pop.style.top = top + "px";
    pop.style.left = left + "px";

    requestAnimationFrame(() => {
      const popRect = pop.getBoundingClientRect();
      const maxLeft = window.scrollX + document.documentElement.clientWidth - popRect.width - 10;
      if (left > maxLeft) pop.style.left = Math.max(10, maxLeft) + "px";
    });
  }

  function renderLegend(reglaIds) {
    legendEl.innerHTML = "";
    if (!showColors || !reglaIds.length) {
      legendEl.style.display = "none";
      return;
    }
    legendEl.style.display = "";
    reglaIds.forEach((id) => {
      const rule = DICTADO_RULES.find((r) => r.id === id);
      if (!rule) return;
      const item = document.createElement("span");
      item.className = "dictado-legend-item";
      const dot = document.createElement("span");
      dot.className = "dictado-swatch";
      dot.style.setProperty("--rule-color", rule.color);
      item.appendChild(dot);
      item.appendChild(document.createTextNode(rule.label));
      legendEl.appendChild(item);
    });
  }

  function renderStory(dictado) {
    storyEl.innerHTML = "";
    const titleEl = document.createElement("h3");
    titleEl.className = "dictado-title";
    titleEl.textContent = dictado.titulo;
    storyEl.appendChild(titleEl);

    const usedRules = new Set();

    dictado.frases.forEach((frase) => {
      const p = document.createElement("p");
      p.className = "dictado-sentence";
      frase.tokens.forEach((token) => {
        if (token.ruleId && showColors) {
          usedRules.add(token.ruleId);
          const rule = DICTADO_RULES.find((r) => r.id === token.ruleId);
          const span = document.createElement("span");
          span.className = "dictado-word";
          span.textContent = token.text;
          span.tabIndex = 0;
          span.style.setProperty("--rule-color", rule ? rule.color : "#20232e");
          span.addEventListener("click", (e) => {
            e.stopPropagation();
            togglePopover(span, token);
          });
          span.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              togglePopover(span, token);
            }
          });
          p.appendChild(span);
        } else {
          p.appendChild(document.createTextNode(token.text));
        }
      });
      storyEl.appendChild(p);
    });

    renderLegend([...usedRules]);
  }

  generateBtn.addEventListener("click", () => {
    closePopover();
    const reglaIds = getSelectedRules();
    const count = Math.min(20, Math.max(3, Number(countInput.value) || 8));
    countInput.value = count;

    statusEl.classList.remove("show", "ok", "ko");
    statusEl.innerHTML = "";
    storyEl.innerHTML = "";
    legendEl.innerHTML = "";
    legendEl.style.display = "none";

    if (!reglaIds.length) {
      statusEl.classList.add("show", "ko");
      statusEl.innerHTML = `<p class="feedback-title">Elige al menos una regla</p><p>Marca una o varias reglas ortográficas para generar el dictado.</p>`;
      toggleBtn.disabled = true;
      copyBtn.disabled = true;
      currentDictado = null;
      return;
    }

    try {
      currentDictado = generarDictado(reglaIds, count);
      showColors = false;
      toggleBtn.textContent = "Mostrar corrección";
      toggleBtn.disabled = false;
      copyBtn.disabled = false;
      renderStory(currentDictado);

      statusEl.classList.add("show", "ok");
      let msg = `<p class="feedback-title">¡Dictado listo!</p><p>${currentDictado.generadas} frase${currentDictado.generadas === 1 ? "" : "s"} generada${currentDictado.generadas === 1 ? "" : "s"}`;
      if (currentDictado.generadas < currentDictado.solicitadas) {
        msg += ` (solo hay ${currentDictado.generadas} frases distintas disponibles para las reglas elegidas)`;
      }
      msg += `. Dicta el texto y, cuando termines, pulsa "Mostrar corrección" para revisar las palabras clave.</p>`;
      statusEl.innerHTML = msg;
    } catch (err) {
      statusEl.classList.add("show", "ko");
      statusEl.innerHTML = `<p class="feedback-title">Ha ocurrido un error</p><p>${err.message}</p>`;
    }
  });

  toggleBtn.addEventListener("click", () => {
    if (!currentDictado) return;
    showColors = !showColors;
    toggleBtn.textContent = showColors ? "Ocultar corrección" : "Mostrar corrección";
    closePopover();
    renderStory(currentDictado);
  });

  copyBtn.addEventListener("click", () => {
    if (!currentDictado) return;
    navigator.clipboard.writeText(dictadoTextoPlano(currentDictado)).then(() => {
      const original = copyBtn.textContent;
      copyBtn.textContent = "¡Copiado!";
      setTimeout(() => {
        copyBtn.textContent = original;
      }, 1500);
    });
  });

  toggleBtn.disabled = true;
  copyBtn.disabled = true;
});
