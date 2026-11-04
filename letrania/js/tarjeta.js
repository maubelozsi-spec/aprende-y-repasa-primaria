// ============================================================
// Letrania · acceso desde Juegos para el alumnado.
//
// Muestra los elementos marcados con [data-letrania-acceso]: el aviso
// dentro de la tarjeta Juegos del inicio (index.html) y la tarjeta de
// Letrania en juegos/index.html. Solo aparecen mientras el maestro tiene habilitado al
// alumno (hoy y con minutos sin gastar). Al quitarle el acceso
// desaparece, pero su héroe, XP, gemas y estación siguen guardados en
// letHeroes/{clave}: quitar el acceso solo cambia «habilitado».
//
// La carga js/layout.js solo en esas dos páginas y solo si hay sesión de
// alumno. Consumo: una escucha sobre SU documento de letHeroes mientras
// la página está abierta (1 lectura al abrir y otra por cada cambio del
// maestro); se cancela al salir de la página.
// ============================================================

import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { db } from "../../js/firebase-init.js";

const elementos = document.querySelectorAll("[data-letrania-acceso]");

function sesion() {
  try {
    return JSON.parse(localStorage.getItem("ar_estudiante") || "null");
  } catch (e) {
    return null;
  }
}

const ms = (t) => (t && t.toMillis ? t.toMillis() : 0);
let ocultarT = null;

// Mismo criterio que la puerta de letrania/index.html: «listo» o «jugando».
function pintar(h) {
  clearTimeout(ocultarT);
  let hasta = 0;
  if (h && h.habilitado) {
    hasta = h.inicio ? ms(h.inicio) + (h.minutos || 15) * 60000 : ms(h.habilitadoHasta);
  }
  const visible = hasta > Date.now();
  elementos.forEach((el) => {
    el.style.display = visible ? "" : "none";
    el.hidden = !visible;
  });
  if (visible) ocultarT = setTimeout(() => pintar(h), Math.min(hasta - Date.now() + 500, 2147483000));
}

// js/auth.js marca este dispositivo como el activo del alumno; hasta
// entonces las reglas no dejan leer su héroe.
function dispositivoListo() {
  if (window.Auth) return Promise.resolve(window.Auth.dispositivoListo);
  return new Promise((ok) => document.addEventListener("ar:auth-ready", () => ok(window.Auth.dispositivoListo), { once: true }));
}

const s = sesion();
if (elementos.length && s && s.code) {
  dispositivoListo().then(() => {
    const cancelar = onSnapshot(
      doc(db, "letHeroes", s.code),
      (snap) => pintar(snap.exists() ? snap.data() : null),
      () => pintar(null) // sin héroe en Letrania o sin conexión: sin tarjeta
    );
    window.addEventListener("pagehide", () => cancelar(), { once: true });
  });
}
