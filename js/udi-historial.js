// ============================================================
// Histórico opcional de Unidades Didácticas generadas: si hay una
// sesión docente activa, guarda un registro ligero en Firestore cada
// vez que se completa la fase de Compilación. Si no hay sesión (uso
// sin login, el caso habitual de esta herramienta), no hace nada: el
// Generador de UDI sigue funcionando igual de bien sin cuenta.
// ============================================================

import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { db } from "./firebase-init.js";

async function saveUdiHistorial(entry) {
  const teacher = window.Auth && window.Auth.loadTeacherSession();
  if (!teacher) return null;

  return addDoc(collection(db, "udiHistorial"), {
    teacherId: teacher.uid,
    udiId: entry.udiId,
    titulo: entry.titulo,
    curso: entry.curso,
    documentos: entry.documentos,
    generadoAt: serverTimestamp(),
  });
}

window.UdiHistorial = { save: saveUdiHistorial };
