// ============================================================
// Panel docente · avisos de La Ciudadela («Necesito ayuda»)
//
// Escucha en directo la colección "ciudadelaAvisos" filtrada por el
// docente que ha iniciado sesión y pinta una tarjeta al principio del
// panel: los avisos pendientes en rojo, con el nombre del alumno, su
// clase, el motivo y el mensaje (si lo escribió). El docente los marca
// como atendidos cuando ha hablado con el alumno.
//
// Solo se filtra por teacherId (índice automático de un campo): el
// orden por fecha se hace aquí, para no exigir un índice compuesto que
// habría que crear a mano en la consola de Firebase.
// ============================================================

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { db, auth } from "./firebase-init.js";

const MOTIVOS = {
  dano: "Alguien le está haciendo daño",
  miedo: "Tiene miedo de alguien",
  triste: "Está muy triste o muy mal",
  otro: "Otra cosa",
};

const ORIGENES = {
  "kit-calma": "desde el kit de calma",
  diario: "desde el diario",
  sesion: "desde la sesión del día",
  portada: "desde la portada",
  sabios: "desde Los sabios",
};

const nombresDeClase = {};
let verAtendidos = false;
let ultimos = [];

function fecha(ts) {
  if (!ts || !ts.toDate) return "hace un momento";
  return ts.toDate().toLocaleString("es-ES", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

async function nombreDeClase(classId) {
  if (!classId) return "";
  if (!(classId in nombresDeClase)) {
    nombresDeClase[classId] = "";
    try {
      const snap = await getDoc(doc(db, "classes", classId));
      nombresDeClase[classId] = snap.exists() ? snap.data().name || "" : "";
    } catch (e) {
      // Sin conexión: se muestra el aviso sin el nombre de la clase.
    }
  }
  return nombresDeClase[classId];
}

function crearTarjeta() {
  const tarjeta = document.createElement("section");
  tarjeta.className = "game-card generator-card avisos-card";
  tarjeta.id = "avisos-ciudadela";
  tarjeta.innerHTML =
    '<div class="avisos-cab"><h2>Avisos de La Ciudadela</h2>' +
    '<button type="button" class="btn btn-secondary" id="avisos-toggle">Ver atendidos</button></div>' +
    '<p class="content-subtitle">Cuando un alumno o alumna con clave pulsa <strong>«Necesito ayuda»</strong> en La Ciudadela, el aviso aparece aquí. ' +
    "No es una alarma instantánea: el alumnado ve el mensaje de que también debe decírselo a un adulto en persona.</p>" +
    '<div id="avisos-lista" class="avisos-lista"></div>';
  const ancla = document.querySelector(".docente-layout");
  ancla.parentNode.insertBefore(tarjeta, ancla);
  document.getElementById("avisos-toggle").addEventListener("click", () => {
    verAtendidos = !verAtendidos;
    pintar(ultimos);
  });
}

async function pintar(avisos) {
  ultimos = avisos;
  const lista = document.getElementById("avisos-lista");
  const tarjeta = document.getElementById("avisos-ciudadela");
  const pendientes = avisos.filter((a) => !a.atendido);
  const atendidos = avisos.filter((a) => a.atendido);
  tarjeta.classList.toggle("avisos-hay", pendientes.length > 0);
  document.getElementById("avisos-toggle").textContent = verAtendidos
    ? "Ocultar atendidos"
    : "Ver atendidos (" + atendidos.length + ")";
  document.getElementById("avisos-toggle").style.display = atendidos.length ? "" : "none";
  document.title = (pendientes.length ? "(" + pendientes.length + ") " : "") + "Panel docente · Aprende y Repasa";

  const mostrar = verAtendidos ? pendientes.concat(atendidos) : pendientes;
  lista.innerHTML = "";
  if (!mostrar.length) {
    const p = document.createElement("p");
    p.className = "avisos-vacio";
    p.textContent = "No hay avisos pendientes.";
    lista.appendChild(p);
    return;
  }
  for (const a of mostrar) {
    const item = document.createElement("article");
    item.className = "aviso-item" + (a.atendido ? " atendido" : "");
    const cab = document.createElement("div");
    cab.className = "aviso-item-cab";
    const quien = document.createElement("strong");
    quien.textContent = a.nickname || a.studentCode;
    cab.appendChild(quien);
    const meta = document.createElement("span");
    meta.className = "review-item-meta";
    const clase = await nombreDeClase(a.classId);
    meta.textContent = [clase, fecha(a.createdAt), ORIGENES[a.origen] || ""].filter(Boolean).join(" · ");
    cab.appendChild(meta);
    item.appendChild(cab);

    const motivo = document.createElement("p");
    motivo.className = "aviso-motivo";
    motivo.textContent = MOTIVOS[a.motivo] || a.motivo;
    item.appendChild(motivo);
    if (a.mensaje) {
      const m = document.createElement("blockquote");
      m.className = "aviso-mensaje";
      m.textContent = a.mensaje;
      item.appendChild(m);
    }
    if (!a.atendido) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn btn-primary";
      b.textContent = "Marcar como atendido";
      b.addEventListener("click", async () => {
        b.disabled = true;
        try {
          await updateDoc(doc(db, "ciudadelaAvisos", a.id), { atendido: true, atendidoAt: serverTimestamp() });
        } catch (e) {
          b.disabled = false;
          b.textContent = "No se ha podido guardar. Reintentar";
        }
      });
      item.appendChild(b);
    } else {
      const ok = document.createElement("p");
      ok.className = "review-item-meta";
      ok.textContent = "Atendido " + (a.atendidoAt ? fecha(a.atendidoAt) : "");
      item.appendChild(ok);
    }
    lista.appendChild(item);
  }
}

let escuchando = null;
onAuthStateChanged(auth, (user) => {
  if (escuchando) {
    escuchando();
    escuchando = null;
  }
  const teacher = window.Auth && window.Auth.loadTeacherSession ? window.Auth.loadTeacherSession() : null;
  if (!user || !teacher || teacher.uid !== user.uid) return;
  if (!document.getElementById("avisos-ciudadela")) crearTarjeta();
  escuchando = onSnapshot(
    query(collection(db, "ciudadelaAvisos"), where("teacherId", "==", user.uid)),
    (snap) => {
      const avisos = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
      avisos.sort((x, y) => {
        const tx = x.createdAt && x.createdAt.toMillis ? x.createdAt.toMillis() : Date.now();
        const ty = y.createdAt && y.createdAt.toMillis ? y.createdAt.toMillis() : Date.now();
        return ty - tx;
      });
      pintar(avisos);
    },
    () => {
      const lista = document.getElementById("avisos-lista");
      if (lista) lista.textContent = "No se han podido cargar los avisos. Si acabas de actualizar la app, revisa que las reglas de Firestore estén publicadas (firestore.rules).";
    }
  );
});
