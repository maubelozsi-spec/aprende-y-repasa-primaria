// ============================================================
// Novela Colectiva — pantalla de proyección para la pizarra.
//
// Se abre desde el panel docente y se deja puesta toda la sesión: la
// novela va creciendo sola en la pizarra según publica cada alumno,
// con la última parte resaltada para que la clase vea al momento lo
// que acaba de entrar.
//
// Es solo lectura: aquí no se escribe, no se corrige y no se borra.
// Así se puede proyectar sin miedo a tocar nada sin querer.
// ============================================================

import { el, param, escapaHtml, guardarLocal, cargarLocal } from "./comun.js";
import { escucharProyecto, escucharFragmentos } from "./proyectos.js";
import { hayVoz, leerFragmentos, pararVoz } from "./voz.js";

const CLAVE_TAMANO = "nov_proyeccion_tamano";
const TAMANOS = [1, 1.25, 1.55, 1.9];

const estado = {
  proyectoId: null,
  proyecto: null,
  fragmentos: [],
  ultimoVisto: 0,
  leyendo: false,
};

function arrancar() {
  estado.proyectoId = param("p");
  if (!estado.proyectoId) {
    el("cargando").classList.add("oculto");
    el("sin-sesion").classList.remove("oculto");
    return;
  }

  escucharProyecto(estado.proyectoId, (p) => {
    if (!p) {
      el("cargando").textContent = "Esta novela ya no existe.";
      return;
    }
    estado.proyecto = p;
    el("cargando").classList.add("oculto");
    el("escenario").classList.remove("oculto");
    el("proy-titulo").textContent = p.titulo;
    pintar();
  });

  escucharFragmentos(estado.proyectoId, (lista) => {
    estado.fragmentos = lista;
    pintar();
  });

  prepararTamano();
  prepararVoz();
}

// Solo lo publicado: en la pizarra no pintan ni lo pendiente de
// aprobar, ni lo oculto, ni lo que está en la papelera.
function publicadas() {
  return estado.fragmentos.filter((f) => f.estado === "publicado");
}

function pintar() {
  if (!estado.proyecto) return;
  const lista = publicadas();
  const cont = el("proy-texto");

  el("proy-contadores").textContent =
    lista.length + " partes · " + (estado.proyecto.numPalabras || 0) + " palabras · " +
    new Set(lista.map((f) => f.autorCode)).size + " autores";

  if (!lista.length) {
    cont.innerHTML = '<p class="proy-vacia">La novela está en blanco.<br>' +
      "Lo que escriba el primero aparecerá aquí.</p>";
    el("proy-ultima").textContent = "";
    return;
  }

  const cerrados = estado.proyecto.capitulos || [];
  const trozos = [];
  let anterior = null;
  for (let i = 0; i < lista.length; i++) {
    const f = lista[i];
    const cap = f.capitulo || 1;
    if (cerrados.length && cap !== anterior) {
      anterior = cap;
      const info = cerrados.find((c) => c.numero === cap);
      if (info) trozos.push(`<h2 class="proy-capitulo">${escapaHtml(info.titulo)}</h2>`);
    }
    const nueva = i === lista.length - 1 && lista.length > estado.ultimoVisto;
    trozos.push(`<p class="proy-parte${nueva ? " recien-llegada" : ""}" data-i="${i}">${escapaHtml(f.texto)}</p>`);
  }
  cont.innerHTML = trozos.join("");

  // Cuando entra una parte nueva, la pizarra baja sola hasta ella.
  if (lista.length > estado.ultimoVisto) {
    estado.ultimoVisto = lista.length;
    const ultima = cont.lastElementChild;
    if (ultima) ultima.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  const f = lista[lista.length - 1];
  el("proy-ultima").textContent = "Última parte: la " + f.orden +
    (estado.proyecto.autoriaVisible ? " · " + f.autorCode : "");
}

// ---------- tamaño de la letra ----------
//
// Cada pizarra es de un tamaño y se ve desde una distancia distinta.
// El botón va pasando por cuatro tamaños y recuerda el elegido en el
// propio ordenador del aula.

function prepararTamano() {
  let indice = Number(cargarLocal(CLAVE_TAMANO));
  if (!Number.isInteger(indice) || indice < 0 || indice >= TAMANOS.length) indice = 1;
  aplicarTamano(indice);

  el("btn-tamano").addEventListener("click", () => {
    indice = (indice + 1) % TAMANOS.length;
    aplicarTamano(indice);
    guardarLocal(CLAVE_TAMANO, indice);
  });
}

function aplicarTamano(indice) {
  document.documentElement.style.setProperty("--escala-proyeccion", TAMANOS[indice]);
  el("btn-tamano").textContent = "A" + "+".repeat(indice + 1);
}

// ---------- lectura en voz alta ----------

function prepararVoz() {
  const btn = el("btn-voz");
  if (!hayVoz()) { btn.classList.add("oculto"); return; }

  btn.addEventListener("click", () => {
    if (estado.leyendo) {
      pararVoz();
      terminarLectura();
      return;
    }
    const lista = publicadas();
    if (!lista.length) return;
    estado.leyendo = true;
    btn.textContent = "⏹ Parar";

    leerFragmentos(lista.map((f) => f.texto), {
      alEmpezarUno: (i) => {
        document.querySelectorAll(".proy-parte").forEach((p) => p.classList.remove("leyendo"));
        const p = document.querySelector('.proy-parte[data-i="' + i + '"]');
        if (p) {
          p.classList.add("leyendo");
          p.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      },
      alTerminar: terminarLectura,
    });
  });
}

function terminarLectura() {
  estado.leyendo = false;
  el("btn-voz").textContent = "🔊 Leer en voz alta";
  document.querySelectorAll(".proy-parte").forEach((p) => p.classList.remove("leyendo"));
}

// ---------- puesta en marcha ----------

document.addEventListener("ar:auth-ready", arrancar);
if (window.Auth) arrancar();
