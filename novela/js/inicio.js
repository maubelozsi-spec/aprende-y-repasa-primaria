// ============================================================
// Novela Colectiva — portada: entrada del alumno y lista de las
// novelas en las que el docente le ha dado permiso para escribir.
// ============================================================

import { el, aviso, escapaHtml, borrarLocal, CLAVE_PROYECTO_ABIERTO } from "./comun.js";
import { proyectosDelAlumno } from "./proyectos.js";

const ESTADOS = {
  abierto: { etiqueta: "Se puede escribir", clase: "verde" },
  pausado: { etiqueta: "En pausa", clase: "ambar" },
  cerrado: { etiqueta: "Terminada", clase: "morada" },
};

function sesion() {
  return window.Auth ? window.Auth.loadStudentSession() : null;
}

async function pintar() {
  const s = sesion();
  const sinEntrar = el("alumno-sin-entrar");
  const dentro = el("alumno-dentro");
  if (!s) {
    sinEntrar.classList.remove("oculto");
    dentro.classList.add("oculto");
    return;
  }
  sinEntrar.classList.add("oculto");
  dentro.classList.remove("oculto");
  el("saludo").textContent = "Has entrado con la clave " + s.code + ".";

  const cont = el("lista-novelas");
  cont.innerHTML = '<p class="texto-suave">Buscando tus novelas…</p>';
  let lista = [];
  try {
    lista = await proyectosDelAlumno(s.code);
  } catch (e) {
    cont.innerHTML = '<p class="aviso-caja error">No he podido conectar. Comprueba el wifi e inténtalo otra vez.</p>';
    return;
  }
  if (!lista.length) {
    cont.innerHTML = '<div class="aviso-caja alerta">Todavía no estás en ninguna novela. ' +
      'Tu profesor o profesora tiene que darte permiso desde su panel.</div>';
    return;
  }
  cont.innerHTML = '<ul class="lista-proyectos">' + lista.map((p) => {
    const est = ESTADOS[p.estado] || ESTADOS.abierto;
    return `<li data-id="${p.id}">
      <span class="nombre-proyecto">${escapaHtml(p.titulo)}</span>
      <span class="etiqueta ${est.clase}">${est.etiqueta}</span>
      <span class="pequeno texto-suave">${p.numFragmentos || 0} partes · ${p.numPalabras || 0} palabras</span>
    </li>`;
  }).join("") + "</ul>";

  cont.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", () => {
      location.href = "escribir.html?p=" + encodeURIComponent(li.dataset.id);
    });
  });
}

document.addEventListener("ar:auth-ready", () => {
  pintar();

  el("form-clave").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const error = el("error-clave");
    error.textContent = "";
    const clave = el("clave").value.trim();
    if (!clave) return;
    try {
      await window.Auth.claimStudentCode(clave);
      aviso("¡Dentro! Estas son tus novelas.", "exito");
      pintar();
    } catch (e) {
      error.textContent = e.message || "No he podido entrar con esa clave.";
    }
  });

  el("btn-salir").addEventListener("click", async () => {
    await window.Auth.logoutStudent();
    borrarLocal(CLAVE_PROYECTO_ABIERTO);
    pintar();
  });
});

// Si auth.js ya se había cargado antes que este módulo.
if (window.Auth) document.dispatchEvent(new CustomEvent("ar:auth-ready"));
