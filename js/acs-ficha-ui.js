// ============================================================
// Interfaz del visor de una ficha de Apoyo ACS: lee el id de la
// URL, genera su contenido (js/acs-fichas-data.js), la renderiza con
// el motor (js/acs-ficha-engine.js) y gestiona las pestañas y los
// botones. Cada ficha tira de un generador, así que "Generar otra
// ficha" no solo reinicia el estado: cambia las palabras/números.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // js/layout.js hace scrollIntoView del enlace activo del sidebar,
  // y "Apoyo ACS" queda al final de una barra lateral muy larga: sin
  // esto la página se abriría desplazada hacia abajo en vez de mostrar
  // el título de la ficha. Se registra después de layout.js, así que
  // corre después de su scrollIntoView.
  window.scrollTo(0, 0);

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const entry = ACS_FICHAS_REGISTRO[id];

  const noEncontrada = document.getElementById("acs-ficha-no-encontrada");
  const contenido = document.getElementById("acs-ficha-contenido");

  if (!entry) {
    noEncontrada.style.display = "";
    return;
  }

  document.title = entry.titulo + " · Apoyo ACS";
  document.getElementById("acs-ficha-titulo").textContent = entry.titulo;
  contenido.style.display = "";

  const digitalEl = document.getElementById("acs-digital");
  const sheetEl = document.getElementById("acs-sheet");
  const instruccionEl = document.getElementById("acs-ficha-instruccion");
  const cursoBtns = document.querySelectorAll("#acs-curso-picker [data-curso]");
  const recortarToggle = document.getElementById("acs-recortar-toggle");
  const recortarCheck = document.getElementById("acs-recortar-check");

  let curso = "1";

  function render() {
    const ficha = acsGenerarFichaPorId(id, curso);
    instruccionEl.textContent = ficha.instruccion;

    // El recorte solo tiene sentido en "unir-parejas" (parejas que se
    // pueden recortar como cuadros sencillos). Para otros tipos se
    // oculta la casilla en vez de dejarla sin efecto.
    recortarToggle.style.display = ficha.tipo === "unir-parejas" ? "" : "none";
    if (ficha.tipo === "unir-parejas" && recortarCheck.checked) {
      ficha.imprimirComo = "recortar";
    }

    initAcsFicha(ficha, digitalEl, sheetEl);
  }
  render();

  cursoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      cursoBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      curso = btn.dataset.curso;
      render();
    });
  });

  recortarCheck.addEventListener("change", render);

  document.getElementById("acs-reiniciar-btn").addEventListener("click", render);
  document.getElementById("acs-imprimir-btn").addEventListener("click", acsEsperarImagenesEImprimir);

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
