// ============================================================
// Inglés para Viajar — utilidades de interfaz compartidas.
// ============================================================

export function aviso(mensaje, tipo) {
  let cont = document.getElementById("avisos");
  if (!cont) {
    cont = document.createElement("div");
    cont.id = "avisos";
    document.body.appendChild(cont);
  }
  const el = document.createElement("div");
  el.className = "aviso" + (tipo ? " aviso-" + tipo : "");
  el.textContent = mensaje;
  cont.appendChild(el);
  requestAnimationFrame(() => el.classList.add("visible"));
  setTimeout(() => {
    el.classList.remove("visible");
    setTimeout(() => el.remove(), 300);
  }, 4200);
}

export function modal(contenidoHtml, { alCerrar } = {}) {
  const fondo = document.createElement("div");
  fondo.className = "fondo-modal";
  fondo.innerHTML = `<div class="caja-modal">${contenidoHtml}</div>`;
  document.body.appendChild(fondo);

  const cerrar = () => {
    fondo.remove();
    if (alCerrar) alCerrar();
  };
  fondo.addEventListener("click", (e) => {
    if (e.target === fondo || e.target.hasAttribute("data-cerrar")) cerrar();
  });
  return { elemento: fondo.querySelector(".caja-modal"), cerrar };
}

export function confirmar(mensaje, textoBoton = "Aceptar") {
  return new Promise((resolver) => {
    const { elemento, cerrar } = modal(
      `<p>${escapar(mensaje)}</p>
       <div class="fila-botones" style="justify-content:flex-end">
         <button class="btn btn-secundario" data-accion="no">Cancelar</button>
         <button class="btn btn-principal" data-accion="si">${escapar(textoBoton)}</button>
       </div>`
    );
    elemento.addEventListener("click", (e) => {
      const accion = e.target.getAttribute("data-accion");
      if (!accion) return;
      cerrar();
      resolver(accion === "si");
    });
  });
}

export function escapar(texto) {
  return String(texto == null ? "" : texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function elemento(html) {
  const plantilla = document.createElement("template");
  plantilla.innerHTML = html.trim();
  return plantilla.content.firstElementChild;
}

// Cabecera común de todas las pantallas de la app.
export function pintarCabecera(titulo) {
  const cabecera = document.querySelector(".cabecera .contenedor");
  if (!cabecera) return;
  cabecera.innerHTML = `
    <a href="index.html">← Inicio</a>
    <h1>${escapar(titulo)}</h1>
    <a href="../index.html">Aprende y Repasa</a>`;
}

export function barajar(lista) {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function parametro(nombre) {
  return new URLSearchParams(window.location.search).get(nombre);
}
