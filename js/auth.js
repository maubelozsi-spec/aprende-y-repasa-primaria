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
// Si su clase le deja ver las hojas de soluciones de los generadores
// (lo sincroniza js/cloud-sync.js; lo lee __puedeVerSoluciones en
// js/layout.js).
const SOLUCIONES_STORAGE_KEY = "ar_soluciones";

// Vista previa: el docente mira la app tal y como la ve una clase o un
// alumno concreto, sin entrar con su clave.
//
// Es a propósito una sesión APARTE de la del alumno y NO pasa por
// claimStudentCode(). Entrar con la clave de un alumno para "ver lo
// que ve" tendría dos efectos que no se ven hasta que es tarde:
// reescribe su authUid —y, por las reglas de firestore.rules, su
// tablet dejaría de poder guardar el progreso hasta que volviera a
// teclear la clave— y le añade un acceso falso al registro de
// actividad, que es justo donde la maestra mira quién ha entrado.
// La vista previa no escribe NADA en Firestore: se lleva la lista de
// temas ocultos ya calculada y se limita a leerla.
const PREVIEW_SESSION_KEY = "ar_vista_alumno";

// Clave compartida para poder crear una cuenta de docente: solo sirve
// para que no se registre cualquiera que llegue a la página por
// casualidad, compartiéndola con el profesorado del centro. No es un
// secreto real: al comprobarse en el navegador, cualquiera que mire
// el código fuente de esta página puede leerla. Si se filtra, basta
// con cambiar este valor (las cuentas ya creadas no se ven afectadas).
const TEACHER_SIGNUP_PASSCODE = "5an1ñdalecio.26-27";

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
    localStorage.removeItem(SOLUCIONES_STORAGE_KEY);
  } catch (e) {
    // localStorage no disponible.
  }
}

function savePreviewSession(preview) {
  try {
    localStorage.setItem(PREVIEW_SESSION_KEY, JSON.stringify(preview));
  } catch (e) {
    // localStorage no disponible.
  }
}

function loadPreviewSession() {
  try {
    const raw = localStorage.getItem(PREVIEW_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function clearPreviewSession() {
  try {
    localStorage.removeItem(PREVIEW_SESSION_KEY);
  } catch (e) {
    // localStorage no disponible.
  }
}

// Entra en la vista del alumnado. Cierra la sesión de docente DE
// VERDAD (Firebase incluido), no solo de cara a la galería: si se
// quedara abierta, pedir la contraseña para volver sería puro teatro,
// porque bastaría con escribir la dirección del panel para entrar. A
// cambio se guarda el correo, para que al volver solo haya que
// escribir la contraseña.
//
// Las configuraciones no se tocan: viven en Firestore (hiddenTopics de
// la clase y de cada alumno) y nada de esto las escribe.
async function startStudentPreview(preview) {
  const teacher = loadTeacherSession();
  savePreviewSession(
    Object.assign(
      {
        teacherEmail: teacher ? teacher.email : "",
        teacherName: teacher ? teacher.displayName : "",
      },
      preview
    )
  );
  try {
    await signOut(auth);
  } catch (e) {
    // Sin conexión: la sesión local se cierra igualmente más abajo.
  }
  clearTeacherSession();
}

async function signUpTeacher(email, password, displayName, claveCentro) {
  if (String(claveCentro || "").trim() !== TEACHER_SIGNUP_PASSCODE) {
    throw new Error("La clave del centro no es correcta.");
  }
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
  // No se puede estar mirando la app como alumno y ser docente a la
  // vez: entrar con la contraseña es exactamente lo que cierra la
  // vista previa.
  clearPreviewSession();
  return profile;
}

async function logoutTeacher() {
  await signOut(auth);
  clearTeacherSession();
  clearPreviewSession();
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
  startStudentPreview: startStudentPreview,
  loadPreviewSession: loadPreviewSession,
  clearPreviewSession: clearPreviewSession,
};

document.dispatchEvent(new CustomEvent("ar:auth-ready"));

refreshStudentDevice();
