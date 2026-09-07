// ============================================================
// Catálogo de fichas de Apoyo ACS: pinta las tarjetas de cada área
// (Lengua / Matemáticas) por separado a partir de ACS_FICHAS, y
// filtra por tipo de actividad.
// ============================================================

const ACS_AREA_COLOR = {
  lengua: { color: "var(--color-indigo)", tint: "var(--color-indigo-tint)" },
  matematicas: { color: "var(--color-teal)", tint: "var(--color-teal-tint)" },
};

document.addEventListener("DOMContentLoaded", () => {
  // Ver comentario equivalente en js/acs-ficha-ui.js.
  window.scrollTo(0, 0);

  const grids = {
    lengua: document.getElementById("acs-grid-lengua"),
    matematicas: document.getElementById("acs-grid-matematicas"),
  };
  const chips = document.querySelectorAll(".acs-filtro-chip");

  let tipoActivo = "todas";

  function pintarArea(area) {
    const grid = grids[area];
    grid.innerHTML = "";
    const visibles = ACS_FICHAS.filter((f) => f.area === area && (tipoActivo === "todas" || f.tipo === tipoActivo));

    if (!visibles.length) {
      const vacio = document.createElement("p");
      vacio.className = "acs-card-empty";
      vacio.textContent = "No hay fichas de este tipo en esta área todavía.";
      grid.appendChild(vacio);
      return;
    }

    visibles.forEach((ficha) => {
      const colores = ACS_AREA_COLOR[ficha.area] || ACS_AREA_COLOR.lengua;
      const card = document.createElement("a");
      card.className = "acs-card";
      card.href = "ficha.html?id=" + encodeURIComponent(ficha.id);
      card.style.setProperty("--card-color", colores.color);
      card.style.setProperty("--card-tint", colores.tint);

      const h3 = document.createElement("h3");
      h3.textContent = ficha.titulo;
      card.appendChild(h3);

      const p = document.createElement("p");
      p.textContent = ficha.resumen;
      card.appendChild(p);

      const tags = document.createElement("div");
      tags.className = "acs-card-tags";
      [ficha.etiqueta, ficha.nivel].forEach((texto) => {
        const tag = document.createElement("span");
        tag.className = "acs-tag";
        tag.textContent = texto;
        tags.appendChild(tag);
      });
      card.appendChild(tags);

      grid.appendChild(card);
    });
  }

  function pintarTodo() {
    pintarArea("lengua");
    pintarArea("matematicas");
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      tipoActivo = chip.dataset.valor;
      pintarTodo();
    });
  });

  pintarTodo();
});
