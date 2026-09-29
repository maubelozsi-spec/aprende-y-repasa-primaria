// ============================================================
// Panel docente · avisos de La Ciudadela («Necesito ayuda»)
//
// Escucha en directo la colección "ciudadelaAvisos" filtrada por el
// docente que ha iniciado sesión y pinta una tarjeta al principio del
// panel: los avisos nuevos en rojo, con el nombre del alumno, su clase,
// el motivo y el mensaje (si lo escribió). Al verlos quedan marcados
// como vistos y pasan al registro de mensajes, donde el docente puede
// seleccionarlos y eliminarlos.
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
  writeBatch,
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
let ultimos = [];

// Un aviso sale en rojo solo la primera vez que el docente lo ve: en
// cuanto está en pantalla se marca como visto en Firestore (campo
// "atendido", el único que las reglas dejan cambiar) y, desde la
// siguiente vez que se abra el panel, ya solo aparece en el registro.
// Durante esta visita se sigue enseñando arriba para que dé tiempo a
// leerlo; con «Leído» se pasa al registro en el momento.
const vistosEnEstaVisita = new Set();
const pasadosAlRegistro = new Set();
const marcando = new Set();
const seleccionados = new Set();
let registroAbierto = false;
let turnoDePintado = 0;

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
    '<div class="avisos-cab"><h2>Avisos de La Ciudadela</h2></div>' +
    '<p class="content-subtitle">Cuando un alumno o alumna con clave pulsa <strong>«Necesito ayuda»</strong> en La Ciudadela, el aviso aparece aquí en rojo. ' +
    "En cuanto lo ves queda marcado como visto: la próxima vez que abras el panel ya no saldrá como aviso y lo tendrás en el registro de mensajes, " +
    "donde puedes seleccionarlo y eliminarlo. No es una alarma instantánea: el alumnado ve el mensaje de que también debe decírselo a un adulto en persona.</p>" +
    '<div id="avisos-lista" class="avisos-lista"></div>' +
    '<details id="avisos-registro" class="avisos-registro"><summary id="avisos-registro-titulo">Registro de mensajes</summary>' +
    '<div class="avisos-registro-barra">' +
    '<label class="aviso-check"><input type="checkbox" id="avisos-sel-todos"> Seleccionar todos</label>' +
    '<button type="button" class="btn btn-secondary" id="avisos-eliminar" disabled>Eliminar seleccionados</button>' +
    "</div>" +
    '<div id="avisos-registro-lista" class="avisos-lista"></div></details>';
  const ancla = document.querySelector(".docente-layout");
  ancla.parentNode.insertBefore(tarjeta, ancla);

  document.getElementById("avisos-registro").addEventListener("toggle", (e) => {
    registroAbierto = e.target.open;
  });
  document.getElementById("avisos-sel-todos").addEventListener("change", (e) => {
    const enRegistro = ultimos.filter((a) => !esAvisoNuevo(a));
    seleccionados.clear();
    if (e.target.checked) enRegistro.forEach((a) => seleccionados.add(a.id));
    pintar(ultimos);
  });
  document.getElementById("avisos-eliminar").addEventListener("click", eliminarSeleccionados);

  // Con el panel abierto en otra pestaña, un aviso que llega no cuenta
  // como visto hasta que el docente vuelve a esta.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") marcarVistos(ultimos);
  });
}

function esAvisoNuevo(a) {
  return (!a.atendido || vistosEnEstaVisita.has(a.id)) && !pasadosAlRegistro.has(a.id);
}

function marcarVistos(avisos) {
  if (document.visibilityState !== "visible") return;
  avisos
    .filter((a) => !a.atendido && !marcando.has(a.id))
    .forEach((a) => {
      marcando.add(a.id);
      vistosEnEstaVisita.add(a.id);
      updateDoc(doc(db, "ciudadelaAvisos", a.id), { atendido: true, atendidoAt: serverTimestamp() }).catch(() => {
        // Sin conexión o sin permiso: se reintentará en el siguiente pintado.
        marcando.delete(a.id);
      });
    });
}

async function eliminarSeleccionados() {
  const ids = Array.from(seleccionados).filter((id) => ultimos.some((a) => a.id === id));
  if (!ids.length) return;
  if (!window.confirm("¿Eliminar " + ids.length + " mensaje(s) del registro? Esta acción no se puede deshacer.")) return;
  const boton = document.getElementById("avisos-eliminar");
  boton.disabled = true;
  boton.textContent = "Eliminando...";
  try {
    // Un lote admite hasta 500 operaciones.
    for (let i = 0; i < ids.length; i += 450) {
      const lote = writeBatch(db);
      ids.slice(i, i + 450).forEach((id) => lote.delete(doc(db, "ciudadelaAvisos", id)));
      await lote.commit();
    }
    seleccionados.clear();
  } catch (e) {
    window.alert("No se han podido eliminar los mensajes. Comprueba la conexión e inténtalo de nuevo.");
  }
  pintar(ultimos);
}

async function crearItem(a, enRegistro) {
  const item = document.createElement("article");
  item.className = "aviso-item" + (enRegistro ? " atendido" : "");
  const cab = document.createElement("div");
  cab.className = "aviso-item-cab";
  if (enRegistro) {
    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "aviso-item-check";
    check.checked = seleccionados.has(a.id);
    check.setAttribute("aria-label", "Seleccionar el mensaje de " + (a.nickname || a.studentCode));
    check.addEventListener("change", () => {
      if (check.checked) seleccionados.add(a.id);
      else seleccionados.delete(a.id);
      actualizarBarraRegistro();
    });
    cab.appendChild(check);
  }
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
  if (enRegistro) {
    const visto = document.createElement("p");
    visto.className = "review-item-meta";
    visto.textContent = "Visto " + (a.atendidoAt ? fecha(a.atendidoAt) : "");
    item.appendChild(visto);
  } else {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn btn-primary";
    b.textContent = "Leído: pasar al registro";
    b.addEventListener("click", () => {
      pasadosAlRegistro.add(a.id);
      marcarVistos([a]);
      pintar(ultimos);
    });
    item.appendChild(b);
  }
  return item;
}

function actualizarBarraRegistro() {
  const enRegistro = ultimos.filter((a) => !esAvisoNuevo(a));
  const marcados = enRegistro.filter((a) => seleccionados.has(a.id)).length;
  const boton = document.getElementById("avisos-eliminar");
  boton.disabled = marcados === 0;
  boton.textContent = marcados ? "Eliminar seleccionados (" + marcados + ")" : "Eliminar seleccionados";
  const todos = document.getElementById("avisos-sel-todos");
  todos.checked = enRegistro.length > 0 && marcados === enRegistro.length;
  todos.indeterminate = marcados > 0 && marcados < enRegistro.length;
}

async function pintar(avisos) {
  ultimos = avisos;
  const turno = ++turnoDePintado;
  marcarVistos(avisos);

  const nuevos = avisos.filter(esAvisoNuevo);
  const registro = avisos.filter((a) => !esAvisoNuevo(a));
  // Lo seleccionado que ya no existe (borrado desde otro equipo) se olvida.
  Array.from(seleccionados).forEach((id) => {
    if (!registro.some((a) => a.id === id)) seleccionados.delete(id);
  });

  // Los nombres de clase se piden a Firestore mientras se construye la
  // lista; si entretanto llega otra actualización, este pintado se descarta.
  const itemsNuevos = [];
  for (const a of nuevos) itemsNuevos.push(await crearItem(a, false));
  const itemsRegistro = [];
  for (const a of registro) itemsRegistro.push(await crearItem(a, true));
  if (turno !== turnoDePintado) return;

  const tarjeta = document.getElementById("avisos-ciudadela");
  tarjeta.classList.toggle("avisos-hay", nuevos.length > 0);
  document.title = (nuevos.length ? "(" + nuevos.length + ") " : "") + "Panel docente · Aprende y Repasa";

  const lista = document.getElementById("avisos-lista");
  lista.innerHTML = "";
  if (!itemsNuevos.length) {
    const p = document.createElement("p");
    p.className = "avisos-vacio";
    p.textContent = "No hay avisos nuevos.";
    lista.appendChild(p);
  } else {
    itemsNuevos.forEach((el) => lista.appendChild(el));
  }

  const detalles = document.getElementById("avisos-registro");
  detalles.style.display = registro.length ? "" : "none";
  detalles.open = registroAbierto;
  document.getElementById("avisos-registro-titulo").textContent = "Registro de mensajes (" + registro.length + ")";
  const listaRegistro = document.getElementById("avisos-registro-lista");
  listaRegistro.innerHTML = "";
  itemsRegistro.forEach((el) => listaRegistro.appendChild(el));
  actualizarBarraRegistro();
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
