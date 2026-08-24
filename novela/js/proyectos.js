// ============================================================
// Novela Colectiva — acceso a los datos (Firestore).
//
// Colecciones (todas con prefijo "nov" para no chocar con el resto
// de la web, que comparte el mismo proyecto de Firebase):
//
//   novProyectos    una novela: título, semilla, estado, ajustes
//   novFragmentos   cada tanda de 10 líneas que publica un alumno
//   novFichas       personajes, lugares y palabras inventadas
//   novNotas        correcciones e indicaciones del docente
//
// Nota sobre el plan gratuito: 25 alumnos escuchando la novela en
// directo gasta lecturas deprisa. Por eso se escucha SOLO el
// proyecto abierto y sus fragmentos, y nada más.
// ============================================================

import {
  collection, doc, addDoc, getDocs, updateDoc, deleteDoc,
  query, where, onSnapshot, serverTimestamp, runTransaction,
  arrayUnion, arrayRemove, increment,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { db } from "./firebase-init.js";

const PROYECTOS = "novProyectos";
const FRAGMENTOS = "novFragmentos";
const FICHAS = "novFichas";
const NOTAS = "novNotas";

export const MAX_LINEAS = 10;

// ---------- proyectos ----------

export async function crearProyecto(datos) {
  const ref = await addDoc(collection(db, PROYECTOS), {
    teacherId: datos.teacherId,
    classId: datos.classId || null,
    titulo: datos.titulo,
    semilla: datos.semilla || { genero: "", epoca: "", tono: "", personajes: "" },
    participantes: datos.participantes || [],
    estado: "abierto",              // abierto | pausado | cerrado
    modoTurno: "libre",             // libre | cola
    moderacionPrevia: !!datos.moderacionPrevia,
    autoriaVisible: false,          // los alumnos NO ven quién escribe cada parte
    maxLineas: datos.maxLineas || MAX_LINEAS,
    maxFragmentosPorSesion: datos.maxFragmentosPorSesion || 0, // 0 = sin límite
    escrituraAbierta: true,
    siguienteOrden: 1,
    numFragmentos: 0,
    numPalabras: 0,
    resumenManual: "",
    turnoDe: null,
    cerradorAutorizado: null,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  });
  return ref.id;
}

export function escucharProyectosDelDocente(teacherId, cb) {
  const q = query(collection(db, PROYECTOS), where("teacherId", "==", teacherId));
  return onSnapshot(q, (snap) => {
    const lista = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
    lista.sort((a, b) => (b.creadoEn?.seconds || 0) - (a.creadoEn?.seconds || 0));
    cb(lista);
  });
}

// Proyectos en los que el docente ha autorizado a este alumno.
export async function proyectosDelAlumno(codigo) {
  const q = query(collection(db, PROYECTOS), where("participantes", "array-contains", codigo));
  const snap = await getDocs(q);
  const lista = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
  lista.sort((a, b) => (b.creadoEn?.seconds || 0) - (a.creadoEn?.seconds || 0));
  return lista;
}

export function escucharProyecto(id, cb) {
  return onSnapshot(doc(db, PROYECTOS, id), (snap) => {
    if (snap.exists()) cb(Object.assign({ id: snap.id }, snap.data()));
    else cb(null);
  });
}

export async function actualizarProyecto(id, cambios) {
  await updateDoc(doc(db, PROYECTOS, id), Object.assign({ actualizadoEn: serverTimestamp() }, cambios));
}

export async function autorizarAlumnos(id, codigos) {
  await updateDoc(doc(db, PROYECTOS, id), { participantes: arrayUnion.apply(null, codigos) });
}

export async function quitarAlumno(id, codigo) {
  await updateDoc(doc(db, PROYECTOS, id), { participantes: arrayRemove(codigo) });
}

export async function borrarProyecto(id) {
  // se borran también sus fragmentos, fichas y notas
  for (const col of [FRAGMENTOS, FICHAS, NOTAS]) {
    const snap = await getDocs(query(collection(db, col), where("proyectoId", "==", id)));
    for (const d of snap.docs) await deleteDoc(d.ref);
  }
  await deleteDoc(doc(db, PROYECTOS, id));
}

// ---------- fragmentos ----------

export function escucharFragmentos(proyectoId, cb) {
  const q = query(collection(db, FRAGMENTOS), where("proyectoId", "==", proyectoId));
  return onSnapshot(q, (snap) => {
    const lista = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
    lista.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    cb(lista);
  });
}

// Publica una tanda. El número de orden se pide dentro de una
// transacción: si dos alumnos pulsan el botón a la vez, cada uno se
// lleva un número distinto y ninguno pisa al otro.
export async function publicarFragmento(proyecto, datos) {
  const refProyecto = doc(db, PROYECTOS, proyecto.id);
  const refFragmento = doc(collection(db, FRAGMENTOS));
  const palabras = (String(datos.texto).trim().match(/[^\s]+/g) || []).length;

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(refProyecto);
    if (!snap.exists()) throw new Error("Este proyecto ya no existe.");
    const p = snap.data();
    if (p.estado === "cerrado") throw new Error("Esta novela ya está terminada.");
    if (p.escrituraAbierta === false) throw new Error("Ahora mismo la escritura está cerrada.");

    const orden = p.siguienteOrden || 1;
    tx.set(refFragmento, {
      proyectoId: proyecto.id,
      teacherId: p.teacherId,
      orden: orden,
      texto: datos.texto,
      textoOriginal: datos.texto,     // lo que escribió el alumno, intacto
      autorCode: datos.autorCode,
      estado: p.moderacionPrevia ? "pendiente" : "publicado",
      entidades: datos.entidades || [],
      avisosAlPublicar: datos.avisos || 0,
      palabras: palabras,
      creadoEn: serverTimestamp(),
      editadoEn: null,
      vecesEditado: 0,
    });
    tx.update(refProyecto, {
      siguienteOrden: orden + 1,
      numFragmentos: increment(1),
      numPalabras: increment(palabras),
      actualizadoEn: serverTimestamp(),
      turnoDe: p.modoTurno === "cola" && p.turnoDe === datos.autorCode ? null : (p.turnoDe || null),
    });
  });
  return refFragmento.id;
}

// El alumno puede volver sobre lo suyo: se guarda el texto nuevo pero
// nunca se pierde `textoOriginal`, que es lo que de verdad escribió.
export async function editarFragmento(id, textoNuevo) {
  const palabras = (String(textoNuevo).trim().match(/[^\s]+/g) || []).length;
  await updateDoc(doc(db, FRAGMENTOS, id), {
    texto: textoNuevo,
    palabras: palabras,
    editadoEn: serverTimestamp(),
    vecesEditado: increment(1),
    estado: "publicado",
  });
}

export async function cambiarEstadoFragmento(id, estado) {
  await updateDoc(doc(db, FRAGMENTOS, id), { estado: estado });
}

export async function borrarFragmento(id) {
  await deleteDoc(doc(db, FRAGMENTOS, id));
}

// ---------- fichas de personajes, lugares e inventos ----------

export function escucharFichas(proyectoId, cb) {
  const q = query(collection(db, FICHAS), where("proyectoId", "==", proyectoId));
  return onSnapshot(q, (snap) => {
    const lista = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
    lista.sort((a, b) => String(a.nombre).localeCompare(String(b.nombre), "es"));
    cb(lista);
  });
}

export async function crearFicha(proyecto, datos) {
  const ref = await addDoc(collection(db, FICHAS), {
    proyectoId: proyecto.id,
    teacherId: proyecto.teacherId,
    tipo: datos.tipo,                 // personaje | lugar | invento
    nombre: datos.nombre,
    respuestas: datos.respuestas || {},
    estadoNarrativo: datos.estadoNarrativo || "en la historia",
    autorCode: datos.autorCode,
    creadoEn: serverTimestamp(),
  });
  return ref.id;
}

export async function actualizarFicha(id, cambios) {
  await updateDoc(doc(db, FICHAS, id), cambios);
}

export async function borrarFicha(id) {
  await deleteDoc(doc(db, FICHAS, id));
}

// ---------- notas del docente ----------

export function escucharNotas(proyectoId, cb) {
  const q = query(collection(db, NOTAS), where("proyectoId", "==", proyectoId));
  return onSnapshot(q, (snap) => {
    const lista = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
    lista.sort((a, b) => (b.creadoEn?.seconds || 0) - (a.creadoEn?.seconds || 0));
    cb(lista);
  });
}

export async function crearNota(proyecto, datos) {
  await addDoc(collection(db, NOTAS), {
    proyectoId: proyecto.id,
    teacherId: proyecto.teacherId,
    fragmentoId: datos.fragmentoId || null,
    destinatarioCode: datos.destinatarioCode,
    tipo: datos.tipo || "indicacion",   // correccion | indicacion | felicitacion
    texto: datos.texto,
    leido: false,
    resuelto: false,
    creadoEn: serverTimestamp(),
  });
}

export async function marcarNotaLeida(id) {
  await updateDoc(doc(db, NOTAS, id), { leido: true });
}

export async function marcarNotaResuelta(id) {
  await updateDoc(doc(db, NOTAS, id), { resuelto: true });
}

export async function borrarNota(id) {
  await deleteDoc(doc(db, NOTAS, id));
}

// ---------- turnos ----------

// En modo cola solo escribe quien tiene el turno. Se pide con una
// transacción para que no se lo lleven dos a la vez.
export async function pedirTurno(proyectoId, codigo) {
  const ref = doc(db, PROYECTOS, proyectoId);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const p = snap.data();
    if (p.turnoDe && p.turnoDe !== codigo) return false;
    tx.update(ref, { turnoDe: codigo, turnoDesde: serverTimestamp() });
    return true;
  });
}

export async function soltarTurno(proyectoId) {
  await updateDoc(doc(db, PROYECTOS, proyectoId), { turnoDe: null, turnoDesde: null });
}

// ---------- alumnos de la clase (para el panel docente) ----------

export async function alumnosDelDocente(teacherId, classId) {
  const q = query(collection(db, "students"), where("teacherId", "==", teacherId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => Object.assign({ code: d.id }, d.data()))
    .filter((a) => !classId || a.classId === classId)
    .sort((a, b) => String(a.nickname || a.code).localeCompare(String(b.nickname || b.code), "es"));
}

export async function clasesDelDocente(teacherId) {
  const q = query(collection(db, "classes"), where("teacherId", "==", teacherId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
}
