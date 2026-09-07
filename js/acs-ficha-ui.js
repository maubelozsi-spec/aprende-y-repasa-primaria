// ============================================================
// Interfaz del visor de una ficha de Apoyo ACS: lee el id de la
// URL, la busca en ACS_FICHAS, la renderiza con el motor
// (js/acs-ficha-engine.js) y gestiona las pestañas y los botones.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const ficha = acsBuscarFicha(params.get("id"));

  const noEncontrada = document.getElementById("acs-ficha-no-encontrada");
  const contenido = document.getElementById("acs-ficha-contenido");

  if (!ficha) {
    noEncontrada.style.display = "";
    return;
  }

  document.title = ficha.titulo + " · Apoyo ACS";
  document.getElementById("acs-ficha-titulo").textContent = ficha.titulo;
  document.getElementById("acs-ficha-instruccion").textContent = ficha.instruccion;
  contenido.style.display = "";

  const digitalEl = document.getElementById("acs-digital");
  const sheetEl = document.getElementById("acs-sheet");

  function render() {
    initAcsFicha(ficha, digitalEl, sheetEl);
  }
  render();

  document.getElementById("acs-reiniciar-btn").addEventListener("click", render);
  document.getElementById("acs-imprimir-btn").addEventListener("click", () => window.print());

  const tabBtns = document.querySelectorAll(".acs-tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("acs-panel-digital").classList.toggle("active", btn.dataset.tab === "digital");
      document.getElementById("acs-panel-sheet").classList.toggle("active", btn.dataset.tab === "sheet");
    });
  });
});
