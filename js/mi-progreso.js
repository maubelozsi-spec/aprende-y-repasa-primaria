// ============================================================
// Página "Mi progreso": recorre el mismo listado NAV usado en la
// barra lateral (js/layout.js) y muestra, para cada contenido, los
// aciertos y fallos guardados por AppProgress en localStorage.
// ============================================================

function formatFecha(iso) {
  if (!iso) return "Sin practicar todavía";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `Última vez: ${dd}/${mm}/${yyyy}`;
}

function renderProgressSummary(data) {
  const el = document.getElementById("progress-summary");
  const topics = Object.keys(data);
  let totalOk = 0;
  let totalKo = 0;
  topics.forEach((id) => {
    totalOk += data[id].aciertos;
    totalKo += data[id].fallos;
  });
  const total = totalOk + totalKo;
  const pct = total > 0 ? Math.round((totalOk / total) * 100) : 0;

  el.innerHTML = `
    <div class="progress-stat">
      <span class="progress-stat-value">${topics.length}</span>
      <span class="progress-stat-label">Contenidos practicados</span>
    </div>
    <div class="progress-stat ok">
      <span class="progress-stat-value">${totalOk}</span>
      <span class="progress-stat-label">Aciertos totales</span>
    </div>
    <div class="progress-stat ko">
      <span class="progress-stat-value">${totalKo}</span>
      <span class="progress-stat-label">Fallos totales</span>
    </div>
    <div class="progress-stat">
      <span class="progress-stat-value">${total > 0 ? pct + "%" : "—"}</span>
      <span class="progress-stat-label">Porcentaje de acierto</span>
    </div>
  `;
}

function renderProgressSections(data) {
  const wrap = document.getElementById("progress-sections");
  wrap.innerHTML = "";

  NAV.forEach((section) => {
    const sectionEl = document.createElement("div");
    sectionEl.className = "nav-section progress-section";
    sectionEl.style.setProperty("--section-color", `var(--color-${section.color})`);
    sectionEl.style.setProperty("--section-tint", `var(--color-${section.color}-tint)`);

    const header = document.createElement("div");
    header.className = "nav-section-label";
    header.textContent = section.label;
    sectionEl.appendChild(header);

    const body = document.createElement("div");
    body.className = "nav-section-body progress-section-body";

    (section.groups || []).forEach((group) => {
      (group.items || []).forEach((item) => {
        if (!item.available) return;
        const stats = data[item.id];
        const row = document.createElement("div");
        row.className = "progress-row" + (stats ? "" : " progress-row-empty");

        const total = stats ? stats.aciertos + stats.fallos : 0;
        const pct = total > 0 ? Math.round((stats.aciertos / total) * 100) : 0;

        row.innerHTML = `
          <div class="progress-row-main">
            <a href="${item.href}" class="progress-row-label">${item.label}</a>
            <span class="progress-row-meta">${stats ? formatFecha(stats.ultima) : "Sin practicar todavía"}</span>
          </div>
          <div class="progress-row-stats">
            ${
              stats
                ? `<span class="progress-row-count ok">${stats.aciertos} aciertos</span><span class="progress-row-count ko">${stats.fallos} fallos</span><div class="progress-bar"><div class="progress-bar-fill" style="width:${pct}%"></div></div>`
                : `<span class="progress-row-count muted">—</span>`
            }
          </div>
        `;
        body.appendChild(row);
      });
    });

    sectionEl.appendChild(body);
    wrap.appendChild(sectionEl);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  function render() {
    const data = AppProgress.getAll();
    renderProgressSummary(data);
    renderProgressSections(data);
  }

  render();

  const resetBtn = document.getElementById("progress-reset-btn");
  resetBtn.addEventListener("click", () => {
    if (window.confirm("¿Seguro que quieres borrar todo tu progreso guardado en este dispositivo? Esta acción no se puede deshacer.")) {
      AppProgress.reset();
      render();
    }
  });
});
