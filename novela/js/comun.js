// ============================================================
// Novela Colectiva — utilidades compartidas: sesiones, avisos,
// modales y pequeños ayudantes de DOM y de texto.
// Mismo estilo que Cifras y Letras para no reinventar nada.
// ============================================================

export const CLAVE_PROYECTO_ABIERTO = "nov_proyecto";
export const CLAVE_BORRADOR = "nov_borrador";
export const CLAVE_TUTORIAL_VISTO = "nov_tutorial_visto";

// ---------- almacenamiento local (siempre entre try/catch: en
// algunos Chromebooks con sesión de invitado no está disponible) ----------

export function guardarLocal(clave, datos) {
  try { localStorage.setItem(clave, JSON.stringify(datos)); } catch (e) { /* sin localStorage */ }
}

export function cargarLocal(clave) {
  try {
    const raw = localStorage.getItem(clave);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

export function borrarLocal(clave) {
  try { localStorage.removeItem(clave); } catch (e) { /* sin localStorage */ }
}

// ---------- DOM ----------

export function el(id) { return document.getElementById(id); }

export function escapaHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto == null ? "" : String(texto);
  return div.innerHTML;
}

export function param(nombre) {
  return new URLSearchParams(location.search).get(nombre);
}

export function mostrarVista(idVista) {
  document.querySelectorAll(".vista").forEach((v) => {
    v.classList.toggle("activa", v.id === idVista);
  });
}

// ---------- avisos ----------

export function aviso(mensaje, tipo) {
  let cont = document.getElementById("nov-toasts");
  if (!cont) {
    cont = document.createElement("div");
    cont.id = "nov-toasts";
    document.body.appendChild(cont);
  }
  const t = document.createElement("div");
  t.className = "toast toast-" + (tipo || "info");
  t.textContent = mensaje;
  cont.appendChild(t);
  setTimeout(() => t.classList.add("visible"), 20);
  setTimeout(() => {
    t.classList.remove("visible");
    setTimeout(() => t.remove(), 400);
  }, 4200);
}

export function confirmar(mensaje, textoBoton) {
  return new Promise((resolve) => {
    const fondo = document.createElement("div");
    fondo.className = "modal-fondo";
    fondo.innerHTML =
      '<div class="modal-caja">' +
      "<p>" + escapaHtml(mensaje) + "</p>" +
      '<div class="modal-botones">' +
      '<button class="btn btn-secundario" data-accion="no">Cancelar</button>' +
      '<button class="btn btn-principal" data-accion="si">' + escapaHtml(textoBoton || "Aceptar") + "</button>" +
      "</div></div>";
    document.body.appendChild(fondo);
    fondo.addEventListener("click", (e) => {
      const accion = e.target.getAttribute && e.target.getAttribute("data-accion");
      if (accion || e.target === fondo) {
        fondo.remove();
        resolve(accion === "si");
      }
    });
  });
}

// Modal con contenido libre. `construir` recibe la caja y una
// función cerrar(valor); la promesa se resuelve con ese valor.
export function modal(construir, opciones) {
  return new Promise((resolve) => {
    const fondo = document.createElement("div");
    fondo.className = "modal-fondo";
    const caja = document.createElement("div");
    caja.className = "modal-caja";
    fondo.appendChild(caja);
    document.body.appendChild(fondo);

    function cerrar(valor) {
      fondo.remove();
      resolve(valor);
    }
    if (!opciones || opciones.cerrarFuera !== false) {
      fondo.addEventListener("click", (e) => { if (e.target === fondo) cerrar(null); });
    }
    construir(caja, cerrar);
  });
}

// ---------- texto ----------

// Cuenta las líneas "de verdad" de un texto. Un renglón de 90
// caracteres cuenta como una línea; así nadie hace trampa metiendo
// diez líneas de una palabra ni se le penaliza por escribir seguido.
export const CARACTERES_POR_LINEA = 90;

export function contarLineas(texto) {
  const renglones = String(texto || "").replace(/\r/g, "").split("\n");
  let total = 0;
  for (const r of renglones) {
    const limpio = r.trim();
    total += limpio.length === 0 ? 1 : Math.ceil(limpio.length / CARACTERES_POR_LINEA);
  }
  return total;
}

export function contarPalabras(texto) {
  const t = String(texto || "").trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

// Recorta el texto a un número máximo de líneas, sin cortar palabras.
export function recortarALineas(texto, maxLineas) {
  if (contarLineas(texto) <= maxLineas) return texto;
  const palabras = String(texto).split(/(\s+)/);
  let acumulado = "";
  for (const trozo of palabras) {
    if (contarLineas(acumulado + trozo) > maxLineas) break;
    acumulado += trozo;
  }
  return acumulado.trimEnd();
}

export function fechaCorta(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" }) +
    " " + d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

// Color estable por código de alumno, para el panel docente: el
// mismo alumno se ve siempre del mismo color sin guardar nada.
export function colorDeCodigo(codigo) {
  let suma = 0;
  const s = String(codigo || "");
  for (let i = 0; i < s.length; i++) suma = (suma * 31 + s.charCodeAt(i)) % 360;
  return "hsl(" + suma + ", 62%, 42%)";
}
