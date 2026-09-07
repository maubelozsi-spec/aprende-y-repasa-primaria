// ============================================================
// Catálogo de fichas de Apoyo ACS: pinta las tarjetas a partir de
// ACS_FICHAS y filtra por área y tipo de actividad.
// ============================================================

const ACS_AREA_COLOR = {
  lengua: { color: "var(--color-indigo)", tint: "var(--color-indigo-tint)" },
  matematicas: { color: "var(--color-teal)", tint: "var(--color-teal-tint)" },
};

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("acs-grid");
  const chips = document.querySelectorAll(".acs-filtro-chip");

  const filtro = { area: "todas", tipo: "todas" };

  function pintar() {
    grid.innerHTML = "";
    const visibles = ACS_FICHAS.filter(
      (f) =>
        (filtro.area === "todas" || f.area === filtro.area) &&
        (filtro.tipo === "todas" || f.tipo === filtro.tipo)
    );

    if (!visibles.length) {
      const vacio = document.createElement("p");
      vacio.className = "acs-card-empty";
      vacio.textContent = "No hay fichas con estos filtros todavía.";
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
      [ficha.area === "lengua" ? "Lengua" : "Matemáticas", ficha.etiqueta, ficha.nivel].forEach((texto) => {
        const tag = document.createElement("span");
        tag.className = "acs-tag";
        tag.textContent = texto;
        tags.appendChild(tag);
      });
      card.appendChild(tags);

      grid.appendChild(card);
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const grupo = chip.dataset.filtro;
      document.querySelectorAll(`.acs-filtro-chip[data-filtro="${grupo}"]`).forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      filtro[grupo] = chip.dataset.valor;
      pintar();
    });
  });

  pintar();
});
