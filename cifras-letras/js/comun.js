// ============================================================
// Cifras y Letras — utilidades compartidas de interfaz: sesiones,
// avisos tipo "toast", modales de confirmación y pequeños ayudantes
// de DOM (mismo estilo que Economía Familiar).
// ============================================================

export const CLAVE_SESION_JUGADOR = "cyl_jugador";
export const CLAVE_SESION_DOCENTE = "cyl_docente";
export const CLAVE_SESION_PROYECCION = "cyl_proyeccion";

export function guardarSesion(clave, datos) {
  try { localStorage.setItem(clave, JSON.stringify(datos)); } catch (e) { /* sin localStorage */ }
}

export function cargarSesion(clave) {
  try {
    const raw = localStorage.getItem(clave);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

export function borrarSesion(clave) {
  try { localStorage.removeItem(clave); } catch (e) { /* sin localStorage */ }
}

export function el(id) { return document.getElementById(id); }

export function escapaHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto == null ? "" : String(texto);
  return div.innerHTML;
}

// ---------- avisos ----------

export function aviso(mensaje, tipo) {
  let cont = document.getElementById("cyl-toasts");
  if (!cont) {
    cont = document.createElement("div");
    cont.id = "cyl-toasts";
    document.body.appendChild(cont);
  }
  const elToast = document.createElement("div");
  elToast.className = "toast toast-" + (tipo || "info");
  elToast.textContent = mensaje;
  cont.appendChild(elToast);
  setTimeout(() => { elToast.classList.add("visible"); }, 20);
  setTimeout(() => {
    elToast.classList.remove("visible");
    setTimeout(() => elToast.remove(), 400);
  }, 4200);
}

export function confirmar(mensaje, textoBoton) {
  return new Promise((resolve) => {
    const fondo = document.createElement("div");
    fondo.className = "modal-fondo";
    fondo.innerHTML =
      '<div class="modal-caja">' +
      "<p>" + mensaje + "</p>" +
      '<div class="modal-botones">' +
      '<button class="btn btn-secundario" data-accion="no">Cancelar</button>' +
      '<button class="btn btn-principal" data-accion="si">' + (textoBoton || "Aceptar") + "</button>" +
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

// ---------- reloj de ronda ----------

// Segundos que quedan de una ronda cuyo campo empiezaEn es un
// Timestamp de Firestore y duracion va en segundos.
export function segundosRestantes(ronda) {
  if (!ronda || !ronda.empiezaEn || !ronda.duracion) return 0;
  const inicio = ronda.empiezaEn.toMillis ? ronda.empiezaEn.toMillis() : Number(ronda.empiezaEn);
  const fin = inicio + ronda.duracion * 1000;
  return Math.max(0, Math.ceil((fin - Date.now()) / 1000));
}

export function formatoTiempo(seg) {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return m + ":" + String(s).padStart(2, "0");
}

// Aviso estándar cuando faltan las reglas de Firestore.
export function esErrorPermisos(ex) {
  return !!ex && (ex.code === "permission-denied" || String(ex.message || "").includes("insufficient permissions"));
}
