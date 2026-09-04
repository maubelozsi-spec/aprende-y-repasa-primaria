// ============================================================
// Cuaderno Digital — cajas de texto e imágenes (páginas de PDF
// incluidas: se insertan como imágenes, una por página del PDF).
//
// Cada elemento es un <div> posicionado en el lienzo, que se puede
// arrastrar (barra superior) y redimensionar (esquina inferior
// derecha). El texto admite negrita/cursiva/subrayado con los
// atajos de teclado normales del navegador (Ctrl+B/I/U) porque es
// un contenteditable normal: no hay barra de formato aparte, para no
// añadir complejidad que no pidió el profesor.
// ============================================================

const ANCHO_MIN = 60;
const ALTO_MIN = 40;

class GestorElementos {
  // opciones: { onMover, onRedimensionar, onTextoEditado, onTraerAlFrente, onEliminar }
  constructor(contenedorEl, opciones) {
    this.contenedor = contenedorEl;
    this.opciones = opciones;
    this.nodos = new Map(); // id -> HTMLElement
    this.urlsImagen = new Map(); // id -> object URL / download URL en curso
  }

  limpiar() {
    this.contenedor.innerHTML = "";
    this.nodos.clear();
  }

  cargarElementos(elementos, resolverUrlImagen) {
    this.limpiar();
    for (const el of elementos) this.agregarElementoDom(el, resolverUrlImagen);
  }

  agregarElementoDom(elemento, resolverUrlImagen) {
    const nodo = document.createElement("div");
    nodo.className = "cd-elemento";
    nodo.dataset.id = elemento.id;
    nodo.style.left = elemento.x + "px";
    nodo.style.top = elemento.y + "px";
    nodo.style.width = elemento.w + "px";
    nodo.style.height = elemento.h + "px";
    nodo.style.zIndex = String(elemento.z || 1);

    const barra = document.createElement("div");
    barra.className = "cd-elemento-barra";
    const eliminarBtn = document.createElement("button");
    eliminarBtn.type = "button";
    eliminarBtn.className = "cd-elemento-eliminar";
    eliminarBtn.title = "Eliminar";
    eliminarBtn.textContent = "✕";
    eliminarBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (confirm("¿Eliminar este elemento de la página?")) this.opciones.onEliminar(elemento.id);
    });
    barra.appendChild(eliminarBtn);

    const cuerpo = document.createElement(elemento.tipo === "texto" ? "div" : "div");
    cuerpo.className = "cd-elemento-cuerpo";

    if (elemento.tipo === "texto") {
      cuerpo.contentEditable = "true";
      cuerpo.className += " cd-elemento-texto";
      cuerpo.innerHTML = elemento.html || "";
      let temporizador = null;
      cuerpo.addEventListener("input", () => {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => {
          this.opciones.onTextoEditado(elemento.id, cuerpo.innerHTML);
        }, 600);
      });
      cuerpo.addEventListener("pointerdown", () => this.opciones.onTraerAlFrente(elemento.id));
    } else {
      const img = document.createElement("img");
      img.className = "cd-elemento-imagen";
      img.alt = elemento.nombreArchivo || "Imagen";
      cuerpo.appendChild(img);
      if (resolverUrlImagen) {
        resolverUrlImagen(elemento).then((url) => {
          if (url) img.src = url;
        });
      }
    }

    const resize = document.createElement("div");
    resize.className = "cd-elemento-resize";

    nodo.appendChild(barra);
    nodo.appendChild(cuerpo);
    nodo.appendChild(resize);
    this.contenedor.appendChild(nodo);
    this.nodos.set(elemento.id, nodo);

    this._activarArrastre(nodo, elemento, barra);
    this._activarRedimension(nodo, elemento, resize);

    return nodo;
  }

  quitarElementoDom(id) {
    const nodo = this.nodos.get(id);
    if (nodo) nodo.remove();
    this.nodos.delete(id);
  }

  // Aplica un cambio llegado de Firestore (propio u otro dispositivo)
  // sin reconstruir todo el DOM, para no perder el foco si se está
  // editando texto en ese mismo momento.
  // Actualiza el texto de un elemento llegado de Firestore, pero solo
  // si no se está editando en ESTE dispositivo ahora mismo: si no, se
  // pisaría lo que el docente está escribiendo en ese instante.
  actualizarTextoDom(id, html) {
    const nodo = this.nodos.get(id);
    if (!nodo) return;
    const cuerpo = nodo.querySelector(".cd-elemento-texto");
    if (!cuerpo || document.activeElement === cuerpo) return;
    if (cuerpo.innerHTML !== html) cuerpo.innerHTML = html || "";
  }

  actualizarPosicionDom(id, x, y, w, h, z) {
    const nodo = this.nodos.get(id);
    if (!nodo) return;
    if (x != null) nodo.style.left = x + "px";
    if (y != null) nodo.style.top = y + "px";
    if (w != null) nodo.style.width = w + "px";
    if (h != null) nodo.style.height = h + "px";
    if (z != null) nodo.style.zIndex = String(z);
  }

  _activarArrastre(nodo, elemento, manija) {
    let activo = false;
    let inicioX = 0;
    let inicioY = 0;
    let baseLeft = 0;
    let baseTop = 0;

    manija.addEventListener("pointerdown", (e) => {
      activo = true;
      manija.setPointerCapture(e.pointerId);
      inicioX = e.clientX;
      inicioY = e.clientY;
      baseLeft = nodo.offsetLeft;
      baseTop = nodo.offsetTop;
      this.opciones.onTraerAlFrente(elemento.id);
    });
    manija.addEventListener("pointermove", (e) => {
      if (!activo) return;
      const escala = this._escalaLienzo(nodo);
      const nuevoX = Math.max(0, baseLeft + (e.clientX - inicioX) / escala);
      const nuevoY = Math.max(0, baseTop + (e.clientY - inicioY) / escala);
      nodo.style.left = nuevoX + "px";
      nodo.style.top = nuevoY + "px";
    });
    const soltar = (e) => {
      if (!activo) return;
      activo = false;
      this.opciones.onMover(elemento.id, nodo.offsetLeft, nodo.offsetTop);
    };
    manija.addEventListener("pointerup", soltar);
    manija.addEventListener("pointercancel", soltar);
  }

  _activarRedimension(nodo, elemento, manija) {
    let activo = false;
    let inicioX = 0;
    let inicioY = 0;
    let baseW = 0;
    let baseH = 0;

    manija.addEventListener("pointerdown", (e) => {
      activo = true;
      manija.setPointerCapture(e.pointerId);
      inicioX = e.clientX;
      inicioY = e.clientY;
      baseW = nodo.offsetWidth;
      baseH = nodo.offsetHeight;
      e.stopPropagation();
    });
    manija.addEventListener("pointermove", (e) => {
      if (!activo) return;
      const escala = this._escalaLienzo(nodo);
      const nuevoAncho = Math.max(ANCHO_MIN, baseW + (e.clientX - inicioX) / escala);
      const nuevoAlto = Math.max(ALTO_MIN, baseH + (e.clientY - inicioY) / escala);
      nodo.style.width = nuevoAncho + "px";
      nodo.style.height = nuevoAlto + "px";
    });
    const soltar = () => {
      if (!activo) return;
      activo = false;
      this.opciones.onRedimensionar(elemento.id, nodo.offsetWidth, nodo.offsetHeight);
    };
    manija.addEventListener("pointerup", soltar);
    manija.addEventListener("pointercancel", soltar);
  }

  _escalaLienzo(nodo) {
    const contenedor = this.contenedor.getBoundingClientRect();
    return contenedor.width / this.contenedor.offsetWidth || 1;
  }
}

export { GestorElementos };
