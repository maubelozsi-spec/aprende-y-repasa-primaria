// ============================================================
// La Ciudadela · conexión con Firebase (solo con clave de alumno)
//
// Se carga desde comun.js ÚNICAMENTE si en este dispositivo hay un
// alumno que ha entrado con su clave de Aprende y Repasa. Quien usa la
// Ciudadela sin clave no descarga nada de Firebase.
//
// Dos cosas:
//   1. Avisos del botón «Necesito ayuda»: colección de primer nivel
//      "ciudadelaAvisos", que el docente de la clase ve en su panel
//      (js/docente-avisos.js). Las reglas de firestore.rules solo dejan
//      crear un aviso desde el dispositivo activo del alumno y solo
//      dejan leerlo a su docente.
//   2. El diario: students/{clave}/ciudadelaDiario. Las reglas solo lo
//      dejan leer y escribir al propio alumno (su dispositivo activo).
//      La app no se lo enseña a nadie más, tampoco al docente.
// ============================================================

import {
  doc,
  collection,
  addDoc,
  setDoc,
  getDocs,
  deleteDoc,
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

// Cada dispositivo tiene su propia sesión anónima: antes de escribir
// hay que marcar este como el activo del alumno (igual que hace
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

// Espera como mucho `ms`: sin conexión, Firestore deja la escritura en
// cola y la promesa no termina hasta que vuelve la red.
function conLimite(promesa, ms) {
  return Promise.race([
    promesa.then(() => "enviado"),
    new Promise((resolve) => setTimeout(() => resolve("en-cola"), ms)),
  ]);
}

async function enviarAviso(datos) {
  const s = await preparar();
  const escritura = addDoc(collection(db, "ciudadelaAvisos"), {
    teacherId: s.teacherId,
    classId: s.classId || "",
    studentCode: s.code,
    nickname: s.nickname || s.code,
    motivo: String(datos.motivo || "otro").slice(0, 30),
    mensaje: String(datos.mensaje || "").slice(0, 500),
    origen: String(datos.origen || "").slice(0, 30),
    atendido: false,
    createdAt: serverTimestamp(),
  });
  return conLimite(escritura, 8000);
}

function coleccionDiario(s) {
  return collection(db, "students", s.code, "ciudadelaDiario");
}

async function listarDiario() {
  const s = await preparar();
  const snap = await getDocs(coleccionDiario(s));
  return snap.docs
    .map((d) => Object.assign({ id: d.id }, d.data()))
    .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
}

async function anadirDiario(entrada) {
  const s = await preparar();
  const id = String(entrada.id || Date.now());
  const datos = Object.assign({}, entrada);
  delete datos.id;
  await conLimite(setDoc(doc(coleccionDiario(s), id), datos), 8000);
  return id;
}

async function borrarDiario(id) {
  const s = await preparar();
  await conLimite(deleteDoc(doc(coleccionDiario(s), String(id))), 8000);
}

window.CiudadelaNube = {
  enviarAviso: enviarAviso,
  diario: { listar: listarDiario, anadir: anadirDiario, borrar: borrarDiario },
};
document.dispatchEvent(new CustomEvent("ciudadela:nube-lista"));
