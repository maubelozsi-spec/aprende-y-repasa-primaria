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

  // En casi todas las fichas "cantidad" es el número de ítems y se
  // puede quitar uno para que quepa en el folio. En la serie numérica
  // no: ahí es hasta dónde llega la serie, así que se pide la versión
  // por defecto, que además escala sola con el curso (hasta el 20 en
  // 1º, hasta el 50 en 2º).
  const ajustable = entry.cantidadEsItems !== false;

  // Genera la ficha con N ítems y dibuja su hoja de imprimir, para
  // que el ajuste al folio pueda medirla. El modo "recortar y pegar"
  // se aplica aquí y no después: cambia bastante el alto de la hoja,
  // así que medir sin él daría una medida que no es la que se imprime.
  function fabricar(cantidad) {
    const ficha = acsGenerarFichaPorId(id, curso, ajustable ? cantidad : undefined);
    if (ficha.tipo === "unir-parejas" && recortarCheck.checked) {
      ficha.imprimirComo = "recortar";
    }
    const temporal = document.createElement("div");
    ACS_RENDERERS[ficha.tipo].sheet(ficha, temporal);
    return { ficha, hoja: temporal.firstElementChild };
  }

  function render() {
    // La ficha se recorta si hace falta para que quepa entera en un
    // folio: partida entre dos hojas no se puede usar en clase (ver
    // acsBuscarVersionQueQuepa en js/acs-ficha-engine.js).
    const { ficha } = acsBuscarVersionQueQuepa(
      fabricar,
      entry.cantidadDefecto,
      entry.cantidadMin || 2,
      ajustable
    );
    instruccionEl.textContent = ficha.instruccion;

    // El recorte solo tiene sentido en "unir-parejas" (parejas que se
    // pueden recortar como cuadros sencillos). Para otros tipos se
    // oculta la casilla en vez de dejarla sin efecto.
    recortarToggle.style.display = ficha.tipo === "unir-parejas" ? "" : "none";

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
