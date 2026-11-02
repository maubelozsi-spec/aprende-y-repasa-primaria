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
// Identidad del alumnado: los documentos de la novela NUNCA guardan la
// clave de acceso (la ven todos los compañeros de la novela y, con ella,
// se entra como ese alumno). Guardan su identificador público
// (students/{clave}.publicId, aleatorio y sin valor para entrar) y, en
// lo que escribe, su apodo (autorNombre) para firmar.
//
// Nota sobre el plan gratuito: 25 alumnos escuchando la novela en
// directo gasta lecturas deprisa. Por eso se escucha SOLO el
// proyecto abierto y sus fragmentos, y nada más.
// ============================================================

import {
  collection, doc, addDoc, getDocs, updateDoc, deleteDoc,
  query, where, onSnapshot, serverTimestamp, runTransaction,
  arrayUnion, arrayRemove, increment, writeBatch, deleteField,
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

// Proyectos en los que el docente ha autorizado a este alumno. El filtro
// por teacherId es obligatorio: las reglas de Firestore solo dejan a
// una sesión de alumno listar los proyectos de SU docente.
export async function proyectosDelAlumno(publicId, teacherId) {
  const q = query(collection(db, PROYECTOS),
    where("teacherId", "==", teacherId),
    where("participantes", "array-contains", publicId));
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

export async function autorizarAlumnos(id, publicIds) {
  await updateDoc(doc(db, PROYECTOS, id), { participantes: arrayUnion.apply(null, publicIds) });
}

export async function quitarAlumno(id, publicId) {
  await updateDoc(doc(db, PROYECTOS, id), { participantes: arrayRemove(publicId) });
}

export async function borrarProyecto(id, teacherId) {
  // se borran también sus fragmentos, fichas y notas
  for (const col of [FRAGMENTOS, FICHAS, NOTAS]) {
    const snap = await getDocs(query(collection(db, col),
      where("teacherId", "==", teacherId), where("proyectoId", "==", id)));
    for (const d of snap.docs) await deleteDoc(d.ref);
  }
  await deleteDoc(doc(db, PROYECTOS, id));
}

// ---------- fragmentos ----------

// teacherId: el del docente dueño del proyecto (las reglas exigen el filtro).
export function escucharFragmentos(proyectoId, teacherId, cb) {
  const q = query(collection(db, FRAGMENTOS),
    where("teacherId", "==", teacherId),
    where("proyectoId", "==", proyectoId));
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
      autorId: datos.autorId,
      autorNombre: String(datos.autorNombre || "").slice(0, 60),
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
      turnoDe: p.modoTurno === "cola" && p.turnoDe === datos.autorId ? null : (p.turnoDe || null),
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

// teacherId: el del docente dueño del proyecto (las reglas exigen el filtro).
export function escucharFichas(proyectoId, teacherId, cb) {
  const q = query(collection(db, FICHAS),
    where("teacherId", "==", teacherId),
    where("proyectoId", "==", proyectoId));
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
    autorId: datos.autorId,
    autorNombre: String(datos.autorNombre || "").slice(0, 60),
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

// teacherId: el del docente dueño del proyecto (las reglas exigen el filtro).
export function escucharNotas(proyectoId, teacherId, cb) {
  const q = query(collection(db, NOTAS),
    where("teacherId", "==", teacherId),
    where("proyectoId", "==", proyectoId));
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
    destinatarioId: datos.destinatarioId,
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
export async function pedirTurno(proyectoId, publicId) {
  const ref = doc(db, PROYECTOS, proyectoId);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const p = snap.data();
    if (p.turnoDe && p.turnoDe !== publicId) return false;
    tx.update(ref, { turnoDe: publicId, turnoDesde: serverTimestamp() });
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

// ---------- identificador público y migración (panel docente) ----------

// Identificador público de un alumno: aleatorio, sin relación con su clave.
export function nuevoIdPublico() {
  const bytes = new Uint8Array(9);
  crypto.getRandomValues(bytes);
  return "a" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Da un identificador público a los alumnos que aún no lo tienen (los
// creados antes de este cambio). Lo hace el docente, que es quien puede
// escribir en su ficha. Devuelve cuántos ha completado.
export async function asegurarIdsPublicos(alumnos) {
  const sinId = alumnos.filter((a) => !a.publicId);
  for (let i = 0; i < sinId.length; i += 400) {
    const lote = writeBatch(db);
    sinId.slice(i, i + 400).forEach((a) => {
      a.publicId = nuevoIdPublico();
      lote.update(doc(db, "students", a.code), { publicId: a.publicId });
    });
    await lote.commit();
  }
  return sinId.length;
}

// Quita las claves de acceso de las novelas guardadas antes de este
// cambio y las sustituye por el identificador público. Solo toca los
// documentos que aún llevan claves, así que repetirla no cuesta
// escrituras. Las lecturas sí: por eso el panel la ejecuta una vez por
// navegador (ver novela/js/docente.js).
export async function migrarClavesDeNovelas(teacherId, alumnos) {
  const porClave = new Map(alumnos.filter((a) => a.publicId).map((a) => [a.code, a]));
  const idDe = (v) => (porClave.has(v) ? porClave.get(v).publicId : v);
  const cambios = [];

  const proyectos = await getDocs(query(collection(db, PROYECTOS), where("teacherId", "==", teacherId)));
  proyectos.forEach((d) => {
    const p = d.data();
    const c = {};
    const part = (p.participantes || []).map(idDe);
    if (part.some((v, i) => v !== (p.participantes || [])[i])) c.participantes = part;
    ["turnoDe", "cerradorAutorizado", "cerradaPor"].forEach((k) => {
      if (p[k] && idDe(p[k]) !== p[k]) c[k] = idDe(p[k]);
    });
    if (Object.keys(c).length) cambios.push([d.ref, c]);
  });

  for (const col of [FRAGMENTOS, FICHAS]) {
    const snap = await getDocs(query(collection(db, col), where("teacherId", "==", teacherId)));
    snap.forEach((d) => {
      const f = d.data();
      if (!("autorCode" in f)) return;
      const a = porClave.get(f.autorCode);
      cambios.push([d.ref, {
        autorId: a ? a.publicId : "",
        autorNombre: f.autorNombre || (a ? String(a.nickname || "").slice(0, 60) : ""),
        autorCode: deleteField(),
      }]);
    });
  }

  const notas = await getDocs(query(collection(db, NOTAS), where("teacherId", "==", teacherId)));
  notas.forEach((d) => {
    const n = d.data();
    if (!("destinatarioCode" in n)) return;
    const a = porClave.get(n.destinatarioCode);
    cambios.push([d.ref, { destinatarioId: a ? a.publicId : "", destinatarioCode: deleteField() }]);
  });

  for (let i = 0; i < cambios.length; i += 400) {
    const lote = writeBatch(db);
    cambios.slice(i, i + 400).forEach(([ref, c]) => lote.update(ref, c));
    await lote.commit();
  }
  return cambios.length;
}
