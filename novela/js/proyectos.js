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
  collection, doc, addDoc, getDocs, updateDoc, deleteDoc, writeBatch,
  query, where, onSnapshot, serverTimestamp, runTransaction,
  arrayUnion, arrayRemove, increment,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { db } from "./firebase-init.js";

const PROYECTOS = "novProyectos";
const FRAGMENTOS = "novFragmentos";
const FICHAS = "novFichas";
const NOTAS = "novNotas";
const PORTADAS = "novPortadas";

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
    capituloActual: 1,              // en qué capítulo se está escribiendo
    capitulos: [],                  // los ya cerrados: {numero, titulo, resumen, hastaOrden}
    portadaElegida: null,           // id de la portada del alumnado que va en el PDF
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
  // se borran también sus fragmentos, fichas, notas y portadas
  for (const col of [FRAGMENTOS, FICHAS, NOTAS, PORTADAS]) {
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
      capitulo: p.capituloActual || 1,
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

// ---------- papelera ----------
//
// Borrar en un aula casi nunca significa "borrar": significa "quita
// esto de en medio, que me he equivocado". Por eso el botón de borrar
// manda a la papelera, donde la parte sigue entera y se puede
// recuperar. Vaciarla del todo es un segundo gesto, deliberado.

export async function fragmentoAPapelera(id, quien) {
  await updateDoc(doc(db, FRAGMENTOS, id), {
    estado: "papelera",
    borradoEn: serverTimestamp(),
    borradoPor: quien || null,
  });
}

export async function restaurarFragmento(id) {
  await updateDoc(doc(db, FRAGMENTOS, id), {
    estado: "publicado",
    borradoEn: null,
    borradoPor: null,
  });
}

export async function borrarFragmentoParaSiempre(id) {
  await deleteDoc(doc(db, FRAGMENTOS, id));
}

export async function fichaAPapelera(id) {
  await updateDoc(doc(db, FICHAS, id), { borrada: true, borradaEn: serverTimestamp() });
}

export async function restaurarFicha(id) {
  await updateDoc(doc(db, FICHAS, id), { borrada: false, borradaEn: null });
}

export async function borrarFichaParaSiempre(id) {
  await deleteDoc(doc(db, FICHAS, id));
}

// ---------- reordenar ----------
//
// Mover una parte es intercambiar su número de orden con el de su
// vecina. Las dos escrituras van en el mismo lote: o se mueven las
// dos o no se mueve ninguna, así nunca quedan dos partes con el
// mismo número ni un hueco en la numeración.

export async function intercambiarOrden(unoId, unoOrden, otroId, otroOrden) {
  const lote = writeBatch(db);
  lote.update(doc(db, FRAGMENTOS, unoId), { orden: otroOrden });
  lote.update(doc(db, FRAGMENTOS, otroId), { orden: unoOrden });
  await lote.commit();
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

// ---------- capítulos ----------
//
// Un capítulo no es más que un corte: "de aquí para atrás ya está".
// Se guardan en el propio proyecto (son cuatro datos y nunca serán
// muchos), así no hace falta otra colección ni otra regla. Cada
// fragmento recuerda en qué capítulo nació, de modo que cerrar uno
// no toca ni una sola de las partes ya escritas.

export async function cerrarCapitulo(proyecto, datos) {
  const capitulos = (proyecto.capitulos || []).slice();
  capitulos.push({
    numero: proyecto.capituloActual || 1,
    titulo: datos.titulo || "Capítulo " + (proyecto.capituloActual || 1),
    resumen: datos.resumen || "",
    hastaOrden: datos.hastaOrden || 0,
    cerradoEn: Date.now(),
  });
  await updateDoc(doc(db, PROYECTOS, proyecto.id), {
    capitulos: capitulos,
    capituloActual: (proyecto.capituloActual || 1) + 1,
    actualizadoEn: serverTimestamp(),
  });
}

export async function reabrirUltimoCapitulo(proyecto) {
  const capitulos = (proyecto.capitulos || []).slice();
  if (!capitulos.length) return;
  capitulos.pop();
  await updateDoc(doc(db, PROYECTOS, proyecto.id), {
    capitulos: capitulos,
    capituloActual: Math.max(1, (proyecto.capituloActual || 2) - 1),
    actualizadoEn: serverTimestamp(),
  });
}

// ---------- portadas dibujadas por el alumnado ----------

export function escucharPortadas(proyectoId, cb) {
  const q = query(collection(db, PORTADAS), where("proyectoId", "==", proyectoId));
  return onSnapshot(q, (snap) => {
    const lista = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
    lista.sort((a, b) => (b.creadoEn?.seconds || 0) - (a.creadoEn?.seconds || 0));
    cb(lista);
  });
}

export async function guardarPortada(proyecto, datos) {
  const ref = await addDoc(collection(db, PORTADAS), {
    proyectoId: proyecto.id,
    teacherId: proyecto.teacherId,
    autorCode: datos.autorCode,
    imagen: datos.imagen,          // JPEG en data URL, ya reducido
    titulo: datos.titulo || "",
    creadoEn: serverTimestamp(),
  });
  return ref.id;
}

export async function borrarPortada(id) {
  await deleteDoc(doc(db, PORTADAS, id));
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
