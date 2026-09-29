// ============================================================
// Chispa y la Fábrica de Robots · progreso en la nube
//
// Se carga desde chispa-fabrica-robots.html ÚNICAMENTE si en este
// dispositivo hay un alumno que ha entrado con su clave de Aprende y
// Repasa. Quien juega sin clave no descarga nada de Firebase y su
// progreso se queda en el navegador, como antes.
//
// Guarda un único documento por alumno en
// students/{clave}/gamification/chispa, con las estrellas de cada reto
// y un resumen por ciclo (retos superados, total y estrellas) para que
// el panel docente lo pinte sin conocer la lista de retos. Las reglas
// de firestore.rules ya dejan leer y escribir esa subcolección al
// dispositivo activo del alumno y leerla a su docente.
// ============================================================

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { db, auth } from "../../js/firebase-init.js";

function sesion() {
  try {
    return JSON.parse(localStorage.getItem("ar_estudiante") || "null");
  } catch (e) {
    return null;
  }
}

// Cada dispositivo tiene su propia sesión anónima: antes de leer o
// escribir hay que marcar este como el activo del alumno (igual que
// refreshStudentDevice en js/auth.js), porque las reglas comprueban
// que la petición viene del authUid guardado en su ficha.
let preparado = null;
function preparar() {
  if (preparado) return preparado;
  const s = sesion();
  preparado = (async () => {
    if (!s || !s.code) throw new Error("sin-sesion");
    if (!auth.currentUser) {
      if (auth.authStateReady) await auth.authStateReady();
      if (!auth.currentUser) await signInAnonymously(auth);
    }
    await updateDoc(doc(db, "students", s.code), {
      authUid: auth.currentUser.uid,
      lastLoginAt: serverTimestamp(),
    });
    return s;
  })();
  preparado.catch(() => { preparado = null; });
  return preparado;
}

function refProgreso(s) {
  return doc(db, "students", s.code, "gamification", "chispa");
}

async function cargar() {
  const s = await preparar();
  const snap = await getDoc(refProgreso(s));
  return snap.exists() ? snap.data().progress || null : null;
}

// Sin conexión, Firestore deja la escritura en cola (caché persistente,
// ver js/firebase-init.js) y la envía sola al volver la red; no se
// espera a que termine para no bloquear el juego.
async function guardar(progress, resumen) {
  const s = await preparar();
  setDoc(refProgreso(s), {
    progress: progress,
    resumen: resumen,
    updatedAt: serverTimestamp(),
  }).catch(() => {});
}

window.ChispaNube = { cargar: cargar, guardar: guardar };
document.dispatchEvent(new CustomEvent("chispa:nube-lista"));
