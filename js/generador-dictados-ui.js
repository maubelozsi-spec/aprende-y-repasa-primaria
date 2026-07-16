// ============================================================
// Interfaz del generador de dictados: pinta los botones de reglas
// ortográficas, gestiona el número de frases, genera la historia,
// y controla el modo "corrección" (colores + explicación al
// pulsar sobre cada palabra marcada).
// ============================================================

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
    btn.addEventListener("click", () => btn.classList.toggle("active"));
    rulesContainer.appendChild(btn);
  });

  selectAllBtn.addEventListener("click", () => {
    rulesContainer.querySelectorAll(".dictado-rule-toggle").forEach((b) => b.classList.add("active"));
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
