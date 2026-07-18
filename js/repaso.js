// ============================================================
// Página "Repasa tus fallos": lista los elementos que tocan hoy
// según AppReview (definido en js/layout.js), con repetición
// espaciada tipo SM-2 simplificado. El "snapshot" guardado es una
// foto del texto que había en pantalla en el momento del fallo, no
// la pregunta original reconstruida (ver nota en layout.js).
// ============================================================

function findTopicInfo(topicId) {
  for (const section of NAV) {
    for (const group of section.groups || []) {
      for (const item of group.items || []) {
        if (item.id === topicId) return { label: item.label, href: item.href };
      }
    }
  }
  return { label: topicId, href: "#" };
}

function renderReviewList() {
  const wrap = document.getElementById("review-list");
  const due = AppReview.getDue();

  if (!due.length) {
    wrap.innerHTML = `
      <div class="empty-state">
        <h2>Nada pendiente de repasar hoy</h2>
        <p>Cuando falles alguna pregunta al practicar, aparecerá aquí para que la repases más adelante.</p>
      </div>
    `;
    return;
  }

  wrap.innerHTML = "";
  due.forEach((item) => {
    const info = findTopicInfo(item.topicId);
    const row = document.createElement("div");
    row.className = "review-item";
    row.innerHTML = `
      <div class="review-item-meta">
        <a href="${info.href}">${info.label}</a> · fallado ${item.wrongCount} ${item.wrongCount === 1 ? "vez" : "veces"}
      </div>
      <div class="review-item-text">${item.snapshot}</div>
      <div class="review-item-actions">
        <button type="button" class="btn btn-success" data-right="1">Ya lo sé</button>
        <button type="button" class="btn btn-secondary" data-right="0">Todavía no</button>
      </div>
    `;
    row.querySelectorAll("[data-right]").forEach((btn) => {
      btn.addEventListener("click", () => {
        AppReview.markReviewed(item.topicId, item.key, btn.dataset.right === "1");
        renderReviewList();
      });
    });
    wrap.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", renderReviewList);
