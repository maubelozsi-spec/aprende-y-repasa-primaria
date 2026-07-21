// ============================================================
// Autenticación y sesiones de docente/alumno. Expone window.Auth
// para que las páginas clásicas (docente-dashboard.js, alumno
// login, etc.) lo usen sin tener que ser ellas mismas módulos ES.
//
// Docente: cuenta real de Firebase Auth (correo/contraseña) — cada
// docente tiene la suya, aislada de los demás vía teacherId.
// Alumno: autenticación anónima de Firebase + una clave de 6
// caracteres que el docente genera y comparte. La clave identifica
// al alumno; la sesión anónima solo sirve para que las reglas de
// seguridad puedan comprobar "esta petición viene de quien reclamó
// esta clave" (ver firestore.rules).
// ============================================================

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { db, auth } from "./firebase-init.js";

const TEACHER_SESSION_KEY = "ar_docente";
const STUDENT_SESSION_KEY = "ar_estudiante";
const VISIBILITY_STORAGE_KEY = "ar_visibilidad";

function saveTeacherSession(profile) {
  try {
    localStorage.setItem(TEACHER_SESSION_KEY, JSON.stringify(profile));
  } catch (e) {
    // localStorage no disponible.
  }
}

function loadTeacherSession() {
  try {
    const raw = localStorage.getItem(TEACHER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function clearTeacherSession() {
  try {
    localStorage.removeItem(TEACHER_SESSION_KEY);
  } catch (e) {
    // localStorage no disponible.
  }
}

function saveStudentSession(profile) {
  try {
    localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(profile));
  } catch (e) {
    // localStorage no disponible.
  }
}

function loadStudentSession() {
  try {
    const raw = localStorage.getItem(STUDENT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function clearStudentSession() {
  try {
    localStorage.removeItem(STUDENT_SESSION_KEY);
    localStorage.removeItem(VISIBILITY_STORAGE_KEY);
  } catch (e) {
    // localStorage no disponible.
  }
}

async function signUpTeacher(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "teachers", cred.user.uid), {
    displayName: displayName,
    email: email,
    createdAt: serverTimestamp(),
  });
  const profile = { uid: cred.user.uid, email: email, displayName: displayName };
  saveTeacherSession(profile);
  return profile;
}

async function loginTeacher(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, "teachers", cred.user.uid));
  const data = snap.exists() ? snap.data() : {};
  const profile = { uid: cred.user.uid, email: email, displayName: data.displayName || email };
  saveTeacherSession(profile);
  return profile;
}

async function logoutTeacher() {
  await signOut(auth);
  clearTeacherSession();
}

function normalizeCode(code) {
  return String(code || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

async function claimStudentCode(rawCode) {
  const code = normalizeCode(rawCode);
  if (!code) throw new Error("Introduce la clave que te ha dado tu profesor o profesora.");

  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }

  const ref = doc(db, "students", code);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Esa clave no existe. Comprueba que la has escrito bien.");

  const data = snap.data();
  if (data.active === false) throw new Error("Esta clave ha sido desactivada. Habla con tu profesor o profesora.");

  await updateDoc(ref, {
    authUid: auth.currentUser.uid,
    lastLoginAt: serverTimestamp(),
  });

  await setDoc(doc(db, "students", code, "logins", String(Date.now())), {
    ts: serverTimestamp(),
    ua: navigator.userAgent.slice(0, 120),
  });

  const profile = {
    code: code,
    nickname: data.nickname || code,
    classId: data.classId,
    teacherId: data.teacherId,
  };
  saveStudentSession(profile);
  return profile;
}

async function logoutStudent() {
  clearStudentSession();
}

// El mismo alumno puede trabajar en clase y en casa. Como cada
// dispositivo tiene su propia sesión anónima, al abrir la app desde
// otro ordenador hay que volver a marcar cuál es el activo; si no, sus
// respuestas no se podrían guardar en la nube desde ese equipo.
// No añade un registro de acceso nuevo: eso solo pasa al teclear la
// clave.
async function refreshStudentDevice() {
  const session = loadStudentSession();
  if (!session || !session.code) return;
  try {
    if (!auth.currentUser) await signInAnonymously(auth);
    await updateDoc(doc(db, "students", session.code), {
      authUid: auth.currentUser.uid,
      lastLoginAt: serverTimestamp(),
    });
  } catch (e) {
    // Sin conexión o clave desactivada: se sigue practicando en local.
  }
}

window.Auth = {
  signUpTeacher: signUpTeacher,
  loginTeacher: loginTeacher,
  logoutTeacher: logoutTeacher,
  loadTeacherSession: loadTeacherSession,
  claimStudentCode: claimStudentCode,
  logoutStudent: logoutStudent,
  loadStudentSession: loadStudentSession,
  refreshStudentDevice: refreshStudentDevice,
};

document.dispatchEvent(new CustomEvent("ar:auth-ready"));

refreshStudentDevice();
