// ============================================================
// Cifras y Letras — pantalla del jugador o equipo.
// Entrar con código y apodo (sesión anónima de Firebase), jugar
// las rondas en tiempo real y, si el jugador es el anfitrión de
// una sala libre, dirigir además el concurso desde un panel de
// control compacto (sortear, abrir el tiempo, validar, repartir).
// ============================================================

import {
  doc, getDoc, setDoc, updateDoc, addDoc, collection, query, where,
  onSnapshot, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { db, auth } from "./firebase-init.js";
import { normalizarPalabra, textoSolucion } from "./motor.js";
import { enlaceRae } from "./diccionario.js";
import {
  crearPartida, prepararRondaLetras, prepararRondaCifras, sacarLetra,
  empezarTiempo, pasarAValidacion, evaluarRespuesta, cerrarRondaYRepartir,
  terminarPartida, refPartida, idRespuesta,
} from "./rondas.js";
import {
  CLAVE_SESION_JUGADOR, guardarSesion, cargarSesion, borrarSesion,
  aviso, confirmar, el, escapaHtml, segundosRestantes, formatoTiempo, esErrorPermisos,
} from "./comun.js";

const $ = el;

let sesion = null;       // { codigo, jugadorId, nombre }
let partida = null;      // doc vivo de cylPartidas
let jugadores = [];      // docs vivos de cylJugadores
let respuestas = [];     // docs vivos de cylRespuestas
let soyAnfitrion = false;
const decisiones = new Map(); // comodín del anfitrión: respuestaId → estado
let paras = [];
let reloj = null;
let cerrandoRonda = false;

// Estado local de la ronda en curso (no se guarda hasta enviar).
let local = null; // ver reiniciarLocal()

// ---------- arranque ----------

document.addEventListener("DOMContentLoaded", async () => {
  $("form-unirse").addEventListener("submit", unirse);
  $("form-crear").addEventListener("submit", crearSala);
  $("btn-salir").addEventListener("click", salir);

  const params = new URLSearchParams(location.search);
  if (params.get("codigo")) $("campo-codigo").value = params.get("codigo").toUpperCase();
  if (location.hash === "#crear") $("crear-jugador").focus();

  sesion = cargarSesion(CLAVE_SESION_JUGADOR);
  if (sesion && sesion.codigo && sesion.jugadorId) {
    try { await reconectar(); } catch (ex) {
      borrarSesion(CLAVE_SESION_JUGADOR);
      sesion = null;
    }
  }
});

async function asegurarSesionAnonima() {
  if (!auth.currentUser) await signInAnonymously(auth);
  return auth.currentUser.uid;
}

// ---------- entrar, crear, salir ----------

async function unirse(e) {
  e.preventDefault();
  const err = $("error-unirse");
  const codigo = $("campo-codigo").value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const nombre = $("campo-nombre").value.trim();
  if (codigo.length < 6) { err.textContent = "El código tiene 6 letras y números."; return; }
  if (!nombre) { err.textContent = "Poned un nombre de equipo."; return; }
  err.textContent = "Entrando…";
  try {
    const uid = await asegurarSesionAnonima();
    const snap = await getDoc(refPartida(db, codigo));
    if (!snap.exists()) throw new Error("No existe ninguna partida con ese código.");
    if (snap.data().estado === "fin") throw new Error("Esa partida ya ha terminado.");
    const ref = await addDoc(collection(db, "cylJugadores"), {
      partida: codigo,
      nombre: nombre,
      authUid: uid,
      puntos: 0,
      esAnfitrion: false,
      creadoEn: serverTimestamp(),
    });
    sesion = { codigo: codigo, jugadorId: ref.id, nombre: nombre };
    guardarSesion(CLAVE_SESION_JUGADOR, sesion);
    err.textContent = "";
    await reconectar();
  } catch (ex) {
    err.textContent = esErrorPermisos(ex)
      ? "La app no está activada del todo: faltan las reglas de la base de datos. Avisad a vuestro profe."
      : (ex.message || "No se ha podido entrar.");
  }
}

async function crearSala(e) {
  e.preventDefault();
  const err = $("error-crear");
  const nombreJugador = $("crear-jugador").value.trim();
  if (!nombreJugador) { err.textContent = "Pon tu nombre de jugador."; return; }
  err.textContent = "Creando la sala…";
  try {
    const uid = await asegurarSesionAnonima();
    const codigo = await crearPartida(db, {
      tipo: "libre",
      teacherId: null,
      anfitrionUid: uid,
      nombre: $("crear-nombre").value.trim() || "Sala de " + nombreJugador,
      config: {
        nivelCifras: Number($("crear-nivel").value),
        ayudaCalculo: $("crear-ayuda").value,
        validacion: "auto",
      },
    });
    const ref = await addDoc(collection(db, "cylJugadores"), {
      partida: codigo,
      nombre: nombreJugador,
      authUid: uid,
      puntos: 0,
      esAnfitrion: true,
      creadoEn: serverTimestamp(),
    });
    sesion = { codigo: codigo, jugadorId: ref.id, nombre: nombreJugador };
    guardarSesion(CLAVE_SESION_JUGADOR, sesion);
    err.textContent = "";
    aviso("Sala creada. Comparte el código " + codigo + " para que entren.", "exito");
    await reconectar();
  } catch (ex) {
    err.textContent = esErrorPermisos(ex)
      ? "La app no está activada del todo: faltan las reglas de la base de datos."
      : (ex.message || "No se ha podido crear la sala.");
  }
}

async function reconectar() {
  const uid = await asegurarSesionAnonima();
  const snapJugador = await getDoc(doc(db, "cylJugadores", sesion.jugadorId));
  if (!snapJugador.exists()) throw new Error("jugador borrado");
  if (snapJugador.data().authUid !== uid) {
    await updateDoc(doc(db, "cylJugadores", sesion.jugadorId), { authUid: uid });
  }
  suscribir(sesion.codigo);
  $("vista-entrada").classList.remove("activa");
  $("vista-juego").classList.add("activa");
  $("btn-salir").style.display = "";
}

async function salir() {
  if (!(await confirmar("¿Salir de la partida? Vuestros puntos se quedan en el marcador.", "Salir"))) return;
  paras.forEach((p) => p());
  paras = [];
  if (reloj) clearInterval(reloj);
  borrarSesion(CLAVE_SESION_JUGADOR);
  window.location.href = "index.html";
}

// ---------- suscripciones en tiempo real ----------

function suscribir(codigo) {
  paras.push(onSnapshot(refPartida(db, codigo), (snap) => {
    if (!snap.exists()) { aviso("La partida ya no existe.", "error"); borrarSesion(CLAVE_SESION_JUGADOR); window.location.href = "index.html"; return; }
    const anterior = partida;
    partida = { id: snap.id, ...snap.data({ serverTimestamps: "estimate" }) };
    soyAnfitrion = !!auth.currentUser && partida.anfitrionUid === auth.currentUser.uid;
    // Al empezar otra ronda se limpia el estado local (palabra a
    // medias, pasos de cifras, decisiones del comodín…).
    const numAntes = anterior && anterior.ronda ? anterior.ronda.numero : null;
    const numAhora = partida.ronda ? partida.ronda.numero : null;
    if (numAntes !== numAhora) {
      reiniciarLocal();
      decisiones.clear();
    }
    pintarTodo();
  }));

  paras.push(onSnapshot(query(collection(db, "cylJugadores"), where("partida", "==", codigo)), (snap) => {
    jugadores = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.puntos || 0) - (a.puntos || 0) || String(a.nombre).localeCompare(String(b.nombre)));
    pintarMarcador();
    actualizarContadores();
  }));

  paras.push(onSnapshot(query(collection(db, "cylRespuestas"), where("partida", "==", codigo)), (snap) => {
    respuestas = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    actualizarContadores();
    // En revisión y resultados sí conviene repintar todo.
    if (partida && partida.ronda && (partida.ronda.estado === "validando" || partida.ronda.estado === "cerrada")) pintarTodo();
  }));

  reloj = setInterval(latidoReloj, 500);
}

function reiniciarLocal() {
  local = {
    seleccion: [],      // letras: índices de fichas usadas, en orden
    fichas: null,       // cifras: [{ v, usada, nueva }]
    pasos: [],          // cifras: [{ a, op, b, r, ia, ib }]
    selA: null, op: null,
    declarado: "",
    bloqueado: false,   // se acabó el tiempo en este dispositivo
  };
}

function respuestasDeLaRonda() {
  if (!partida || !partida.ronda) return [];
  return respuestas.filter((r) => r.ronda === partida.ronda.numero);
}

function miRespuesta() {
  return respuestasDeLaRonda().find((r) => r.jugadorId === sesion.jugadorId) || null;
}

// ---------- reloj ----------

async function latidoReloj() {
  if (!partida || !partida.ronda || partida.ronda.estado !== "jugando") return;
  const seg = segundosRestantes(partida.ronda);
  const elReloj = $("reloj-jugador");
  if (elReloj) {
    elReloj.textContent = formatoTiempo(seg);
    elReloj.classList.toggle("apurado", seg <= 10);
    const barra = $("barra-jugador");
    if (barra) barra.style.width = (100 * seg / partida.ronda.duracion) + "%";
  }
  if (seg <= 0 && partida.ronda.empiezaEn) {
    if (!local.bloqueado) {
      local.bloqueado = true;
      const botones = document.querySelectorAll("[data-bloqueable]");
      botones.forEach((b) => { b.disabled = true; });
      aviso("⏰ ¡Tiempo!", "info");
    }
    // El anfitrión de la sala libre cierra la ronda para todos.
    if (soyAnfitrion && !cerrandoRonda) {
      cerrandoRonda = true;
      setTimeout(async () => {
        try { if (partida && partida.ronda && partida.ronda.estado === "jugando") await pasarAValidacion(db, partida); }
        finally { cerrandoRonda = false; }
      }, 1500);
    }
  }
}

// ============================================================
//  PINTADO
// ============================================================

function pintarTodo() {
  if (!partida) return;
  pintarCabecera();
  pintarAnfitrion();
  pintarJuego();
  pintarMarcador();
}

function pintarCabecera() {
  const z = $("zona-cabecera-juego");
  if (!z) return;
  z.innerHTML =
    "<h2>" + escapaHtml(partida.nombre) + "</h2>" +
    '<div class="codigo-partida">' + partida.codigo + "</div>" +
    '<p class="texto-suave" style="margin:8px 0 0;">Sois <strong>' + escapaHtml(sesion.nombre) + "</strong>" +
    (soyAnfitrion ? " · 🎙️ diriges esta sala" : "") + "</p>";
}

function actualizarContadores() {
  const cont = $("contador-respuestas");
  if (cont && partida && partida.ronda) {
    cont.textContent = respuestasDeLaRonda().length + " de " + jugadores.length;
  }
  const chips = $("chips-lobby");
  if (chips) {
    chips.innerHTML = jugadores.map((j) => '<span class="chip">' + (j.esAnfitrion ? "🎙️ " : "") + escapaHtml(j.nombre) + "</span>").join("")
      || '<span class="texto-suave">nadie más todavía…</span>';
  }
}

// ---------- panel del anfitrión (salas libres) ----------

function pintarAnfitrion() {
  const z = $("zona-anfitrion");
  if (!soyAnfitrion || partida.tipo !== "libre" || partida.estado === "fin") {
    z.classList.add("oculto");
    return;
  }
  z.classList.remove("oculto");
  const r = partida.ronda;
  let html = '<h3>🎙️ Mandos del anfitrión</h3>';

  if (partida.estado === "lobby" || (r && r.estado === "cerrada")) {
    html += '<div class="botones-operaciones">' +
      '<button class="btn btn-letras" id="anf-letras">🔤 Ronda de letras</button>' +
      '<button class="btn btn-cifras" id="anf-cifras">🔢 Ronda de cifras</button>' +
      '<button class="btn btn-secundario btn-mini" id="anf-fin">🏁 Terminar</button>' +
      "</div>";
  } else if (r && r.estado === "sorteo" && r.tipo === "letras") {
    const lleno = r.letras.length >= partida.config.numLetras;
    html += '<div class="botones-operaciones">' +
      '<button class="btn btn-letras" id="anf-vocal"' + (lleno ? " disabled" : "") + ">Vocal</button>" +
      '<button class="btn btn-letras" id="anf-consonante"' + (lleno ? " disabled" : "") + ">Consonante</button>" +
      '<button class="btn btn-secundario" id="anf-auto">Completar 🎲</button>' +
      '<button class="btn btn-principal" id="anf-empezar"' + (lleno ? "" : " disabled") + ">⏱️ ¡Tiempo!</button>" +
      "</div>";
  } else if (r && r.estado === "sorteo" && r.tipo === "cifras") {
    html += '<div class="botones-operaciones">' +
      '<button class="btn btn-secundario" id="anf-otro">🎲 Otros números</button>' +
      '<button class="btn btn-principal" id="anf-empezar">⏱️ ¡Tiempo!</button>' +
      "</div>";
  } else if (r && r.estado === "jugando") {
    html += '<div class="botones-operaciones"><button class="btn btn-peligro btn-mini" id="anf-cerrar">✋ Cerrar la ronda ya</button></div>';
  } else if (r && r.estado === "validando") {
    html += pintarValidacionAnfitrion(r);
  }

  z.innerHTML = html;
  const acciones = {
    "anf-letras": () => prepararRondaLetras(db, partida),
    "anf-cifras": () => prepararRondaCifras(db, partida),
    "anf-vocal": () => sacarLetra(db, partida, "vocal"),
    "anf-consonante": () => sacarLetra(db, partida, "consonante"),
    "anf-auto": () => sacarLetra(db, partida, "auto"),
    "anf-otro": () => prepararRondaCifras(db, partida),
    "anf-empezar": () => empezarTiempo(db, partida),
    "anf-cerrar": () => pasarAValidacion(db, partida),
    "anf-fin": async () => { if (await confirmar("¿Terminar el concurso y ver el podio?", "Terminar")) await terminarPartida(db, partida); },
    "anf-repartir": repartirComoAnfitrion,
  };
  Object.keys(acciones).forEach((id) => {
    const b = document.getElementById(id);
    if (b) b.addEventListener("click", acciones[id]);
  });
  z.querySelectorAll("[data-ok]").forEach((b) => b.addEventListener("click", () => { decisiones.set(b.dataset.ok, "valida"); pintarAnfitrion(); }));
  z.querySelectorAll("[data-no]").forEach((b) => b.addEventListener("click", () => { decisiones.set(b.dataset.no, "invalida"); pintarAnfitrion(); }));
}

function pintarValidacionAnfitrion(r) {
  const deRonda = respuestasDeLaRonda().slice()
    .sort((a, b) => String(a.nombre).localeCompare(String(b.nombre)));
  let html = '<p class="texto-suave">Revisa las respuestas. Si el diccionario no conoce una palabra buena, dala por válida con tu comodín ✓.</p>';
  if (!deRonda.length) html += '<p class="texto-suave">No ha respondido nadie.</p>';
  html += deRonda.map((resp) => {
    const ev = evaluarRespuesta(resp, r, partida.config);
    const estado = decisiones.get(resp.id) || (ev.estado === "pendiente" ? "pendiente" : ev.estado);
    const jugada = r.tipo === "letras"
      ? "<strong>" + escapaHtml(String(resp.palabra || "").toUpperCase()) + "</strong> (" + ev.puntosPosibles + " pts)"
      : escapaHtml(String(resp.resultado != null ? resp.resultado : "?")) + " (" + ev.puntosPosibles + " pts)";
    const rae = r.tipo === "letras" ? ' · <a href="' + enlaceRae(resp.palabra) + '" target="_blank">RAE ↗</a>' : "";
    return '<div class="fila-respuesta ' + estado + '">' +
      '<span class="nombre">' + escapaHtml(resp.nombre) + "</span>" +
      '<span class="jugada">' + jugada + "</span>" +
      '<button class="btn btn-mini btn-exito" data-ok="' + resp.id + '">✓</button>' +
      '<button class="btn btn-mini btn-peligro" data-no="' + resp.id + '">✗</button>' +
      '<span class="motivo">' + escapaHtml(ev.motivo || "") + rae + "</span>" +
      "</div>";
  }).join("");
  html += '<div class="botones-operaciones"><button class="btn btn-principal" id="anf-repartir">🏆 Repartir puntos</button></div>';
  return html;
}

async function repartirComoAnfitrion() {
  const r = partida.ronda;
  const listas = respuestasDeLaRonda().map((resp) => {
    const ev = evaluarRespuesta(resp, r, partida.config);
    let estado = decisiones.get(resp.id) || ev.estado;
    if (estado === "pendiente") estado = "invalida"; // sin comodín, no vale
    return { id: resp.id, jugadorId: resp.jugadorId, estado: estado, puntosPosibles: ev.puntosPosibles };
  });
  try {
    await cerrarRondaYRepartir(db, partida, listas);
    aviso("Puntos repartidos.", "exito");
  } catch (ex) {
    aviso(ex.message || "No se han podido repartir los puntos.", "error");
  }
}

// ---------- zona de juego del jugador ----------

function pintarJuego() {
  const z = $("zona-juego");
  const r = partida.ronda;

  if (partida.estado === "fin") { z.innerHTML = pintarPodio(); return; }

  if (partida.estado === "lobby") {
    z.innerHTML = '<h3>🎬 Esperando a que empiece el concurso…</h3>' +
      '<p class="texto-suave">Ya estáis dentro. En cuanto ' + (partida.tipo === "aula" ? "vuestro profe" : "el anfitrión") + ' abra la primera ronda, aparecerá aquí.</p>' +
      '<div class="chips-jugadores" id="chips-lobby"></div>';
    actualizarContadores();
    return;
  }

  if (!r) { z.innerHTML = ""; return; }

  if (r.estado === "sorteo") {
    if (r.tipo === "letras") {
      const max = partida.config.numLetras;
      let fichas = "";
      for (let i = 0; i < max; i++) {
        const l = r.letras[i];
        fichas += '<button class="ficha-letra' + (l ? "" : " hueco") + '" disabled>' + (l || "·") + "</button>";
      }
      z.innerHTML = "<h3>" + etiquetaRonda(r) + " · Sorteo del panel</h3>" +
        '<p class="texto-suave">Las letras van saliendo… preparad la vista.</p>' +
        '<div class="panel-fichas">' + fichas + "</div>";
    } else {
      z.innerHTML = "<h3>" + etiquetaRonda(r) + " · ¡Atentos al objetivo!</h3>" +
        '<div class="centrado"><div class="objetivo-cifras">' + r.objetivo + "</div></div>" +
        '<div class="panel-fichas">' + r.fichas.map((f) => '<button class="ficha-cifra" disabled>' + f + "</button>").join("") + "</div>" +
        '<p class="texto-suave centrado">El tiempo empezará enseguida…</p>';
    }
    return;
  }

  if (r.estado === "jugando") {
    if (r.tipo === "letras") pintarJuegoLetras(z, r);
    else pintarJuegoCifras(z, r);
    return;
  }

  if (r.estado === "validando") {
    const mia = miRespuesta();
    z.innerHTML = "<h3>" + etiquetaRonda(r) + " · Revisión</h3>" +
      (mia
        ? "<p>Habéis enviado: <strong>" + (r.tipo === "letras"
            ? escapaHtml(String(mia.palabra || "").toUpperCase())
            : escapaHtml(String(mia.declarado != null && partida.config.ayudaCalculo === "mental" ? mia.declarado : (mia.resultado != null ? mia.resultado : "—")))) + "</strong></p>"
        : '<p class="texto-suave">No habéis enviado nada esta ronda.</p>') +
      '<p class="texto-suave">⏳ Se están revisando las respuestas…</p>';
    return;
  }

  if (r.estado === "cerrada") {
    z.innerHTML = resumenRondaCerrada(r) +
      '<p class="texto-suave centrado">Esperando la siguiente ronda…</p>';
  }
}

function etiquetaRonda(r) {
  return '<span class="etiqueta-ronda etiqueta-' + r.tipo + '">' + (r.tipo === "letras" ? "Letras" : "Cifras") + "</span> · Ronda " + r.numero;
}

function cabeceraTiempo(r) {
  return '<div class="reloj" id="reloj-jugador">' + formatoTiempo(segundosRestantes(r)) + "</div>" +
    '<div class="barra-tiempo"><div id="barra-jugador" style="width:100%"></div></div>';
}

// ----- LETRAS: marcar fichas y construir la palabra debajo -----

function pintarJuegoLetras(z, r) {
  const mia = miRespuesta();
  const usadas = new Set(local.seleccion);
  const fichas = r.letras.map((l, i) =>
    '<button class="ficha-letra' + (usadas.has(i) ? " usada" : "") + '" data-letra="' + i + '" data-bloqueable' +
    (local.bloqueado || usadas.has(i) ? " disabled" : "") + ">" + l + "</button>").join("");
  const palabra = local.seleccion.map((i, pos) =>
    '<button class="ficha-letra" data-quitar="' + pos + '" data-bloqueable' + (local.bloqueado ? " disabled" : "") + ">" + r.letras[i] + "</button>").join("");

  z.innerHTML = "<h3>" + etiquetaRonda(r) + "</h3>" + cabeceraTiempo(r) +
    '<p class="texto-suave centrado">Tocad las letras para formar vuestra palabra (cada ficha se usa una vez).</p>' +
    '<div class="panel-fichas">' + fichas + "</div>" +
    '<div class="zona-palabra">' + (palabra || '<span class="aviso-vacia">vuestra palabra aparecerá aquí…</span>') + "</div>" +
    '<div class="botones-operaciones">' +
    '<button class="btn btn-secundario" id="btn-borrar" data-bloqueable' + (local.bloqueado ? " disabled" : "") + ">⌫ Borrar última</button>" +
    '<button class="btn btn-secundario" id="btn-limpiar" data-bloqueable' + (local.bloqueado ? " disabled" : "") + ">🧹 Empezar de nuevo</button>" +
    '<button class="btn btn-principal btn-grande" id="btn-enviar" data-bloqueable' + (local.bloqueado || !local.seleccion.length ? " disabled" : "") + ">📤 Enviar palabra</button>" +
    "</div>" +
    (mia ? '<p class="centrado texto-suave">Enviada: <strong>' + escapaHtml(String(mia.palabra).toUpperCase()) + "</strong> · podéis cambiarla mientras quede tiempo.</p>" : "");

  z.querySelectorAll("[data-letra]").forEach((b) => b.addEventListener("click", () => {
    local.seleccion.push(Number(b.dataset.letra));
    pintarJuego();
  }));
  z.querySelectorAll("[data-quitar]").forEach((b) => b.addEventListener("click", () => {
    local.seleccion.splice(Number(b.dataset.quitar), 1);
    pintarJuego();
  }));
  $("btn-borrar").addEventListener("click", () => { local.seleccion.pop(); pintarJuego(); });
  $("btn-limpiar").addEventListener("click", () => { local.seleccion = []; pintarJuego(); });
  $("btn-enviar").addEventListener("click", enviarPalabra);
}

async function enviarPalabra() {
  const r = partida.ronda;
  const palabra = local.seleccion.map((i) => r.letras[i]).join("");
  if (normalizarPalabra(palabra).length < 2) { aviso("La palabra es demasiado corta.", "error"); return; }
  try {
    await setDoc(doc(db, "cylRespuestas", idRespuesta(partida.codigo, r.numero, sesion.jugadorId)), {
      partida: partida.codigo,
      ronda: r.numero,
      jugadorId: sesion.jugadorId,
      nombre: sesion.nombre,
      tipo: "letras",
      palabra: palabra,
      estado: "pendiente",
      puntos: 0,
      enviadaEn: serverTimestamp(),
    });
    aviso("Palabra enviada: " + palabra + " ✔", "exito");
    pintarJuego();
  } catch (ex) {
    aviso(ex.message || "No se ha podido enviar.", "error");
  }
}

// ----- CIFRAS: elegir número, operación, número -----

function prepararFichasCifras(r) {
  if (!local.fichas) {
    local.fichas = r.fichas.map((v) => ({ v: v, usada: false, nueva: false }));
  }
}

function etiquetaFicha(f) {
  // En los modos "final" y "mental" los resultados intermedios van tapados.
  if (f.nueva && partida.config.ayudaCalculo !== "pasos") return "★";
  return String(f.v);
}

function pintarJuegoCifras(z, r) {
  prepararFichasCifras(r);
  const mia = miRespuesta();
  const ayuda = partida.config.ayudaCalculo;

  const fichas = local.fichas.map((f, i) =>
    '<button class="ficha-cifra' + (f.nueva ? " nueva" : "") + (f.usada ? " usada" : "") + (local.selA === i ? " seleccionada" : "") +
    '" data-ficha="' + i + '" data-bloqueable' + (local.bloqueado || f.usada ? " disabled" : "") + ">" + etiquetaFicha(f) + "</button>").join("");

  const ops = ["+", "−", "×", "÷"].map((op) =>
    '<button class="btn-op' + (local.op === op ? " seleccionada" : "") + '" data-op="' + op + '" data-bloqueable' +
    (local.bloqueado || local.selA === null ? " disabled" : "") + ">" + op + "</button>").join("");

  const pasos = local.pasos.map((p, i) =>
    "<li>" + p.etiquetaA + " " + p.op + " " + p.etiquetaB + " = " + (ayuda === "pasos" ? p.r : "★") + "</li>").join("");

  const resultado = local.pasos.length ? local.pasos[local.pasos.length - 1].r : null;
  const textoResultado = resultado === null ? "—" : (ayuda === "pasos" ? String(resultado) : "★ (oculto)");

  let cajaMental = "";
  if (ayuda === "mental") {
    cajaMental = '<div class="campo" style="max-width:260px; margin:0 auto;">' +
      '<label>¿Qué resultado os da? (haced la cuenta de cabeza)</label>' +
      '<input type="number" id="campo-declarado" value="' + escapaHtml(local.declarado) + '" data-bloqueable' + (local.bloqueado ? " disabled" : "") + "></div>";
  }

  z.innerHTML = "<h3>" + etiquetaRonda(r) + "</h3>" + cabeceraTiempo(r) +
    '<div class="centrado"><div class="objetivo-cifras">' + r.objetivo + "</div></div>" +
    '<p class="texto-suave centrado">Tocad un número, una operación y otro número. La división tiene que ser exacta y no valen números negativos.</p>' +
    '<div class="panel-fichas">' + fichas + "</div>" +
    '<div class="botones-operaciones">' + ops + "</div>" +
    '<ul class="lista-pasos">' + pasos + "</ul>" +
    '<p class="centrado">Vuestro resultado ahora mismo: <strong style="font-size:1.3rem;">' + textoResultado + "</strong></p>" +
    cajaMental +
    '<div class="botones-operaciones">' +
    '<button class="btn btn-secundario" id="btn-deshacer" data-bloqueable' + (local.bloqueado || !local.pasos.length ? " disabled" : "") + ">↩️ Deshacer</button>" +
    '<button class="btn btn-principal btn-grande" id="btn-enviar-cifras" data-bloqueable' + (local.bloqueado || !local.pasos.length ? " disabled" : "") + ">📤 Enviar resultado</button>" +
    "</div>" +
    (mia ? '<p class="centrado texto-suave">Resultado enviado ✔ · podéis mejorarlo mientras quede tiempo.</p>' : "");

  z.querySelectorAll("[data-ficha]").forEach((b) => b.addEventListener("click", () => tocarFicha(Number(b.dataset.ficha))));
  z.querySelectorAll("[data-op]").forEach((b) => b.addEventListener("click", () => { local.op = b.dataset.op; pintarJuego(); }));
  $("btn-deshacer").addEventListener("click", deshacerPaso);
  $("btn-enviar-cifras").addEventListener("click", enviarCifras);
  const campoD = $("campo-declarado");
  if (campoD) campoD.addEventListener("input", () => { local.declarado = campoD.value; });
}

function tocarFicha(i) {
  if (local.selA === null) { local.selA = i; pintarJuego(); return; }
  if (i === local.selA) { local.selA = null; local.op = null; pintarJuego(); return; }
  if (!local.op) { local.selA = i; pintarJuego(); return; }

  // Tenemos número, operación y número: se hace la cuenta.
  const A = local.fichas[local.selA];
  const B = local.fichas[i];
  let a = A.v, b = B.v, r;
  if (local.op === "+") r = a + b;
  else if (local.op === "×") r = a * b;
  else if (local.op === "−") r = a - b;
  else r = b !== 0 && a % b === 0 ? a / b : NaN;

  if (!Number.isInteger(r) || r <= 0) {
    aviso(local.op === "÷" ? "Esa división no es exacta." : "No valen resultados negativos o cero.", "error");
    local.op = null;
    pintarJuego();
    return;
  }

  A.usada = true; B.usada = true;
  local.pasos.push({
    a: a, op: local.op, b: b, r: r,
    ia: local.selA, ib: i,
    etiquetaA: etiquetaFicha(A), etiquetaB: etiquetaFicha(B),
  });
  local.fichas.push({ v: r, usada: false, nueva: true });
  local.selA = null; local.op = null;
  pintarJuego();
}

function deshacerPaso() {
  const p = local.pasos.pop();
  if (!p) return;
  local.fichas.pop(); // la ficha nueva creada por ese paso
  local.fichas[p.ia].usada = false;
  local.fichas[p.ib].usada = false;
  local.selA = null; local.op = null;
  pintarJuego();
}

async function enviarCifras() {
  const r = partida.ronda;
  if (!local.pasos.length) return;
  const resultado = local.pasos[local.pasos.length - 1].r;
  const datos = {
    partida: partida.codigo,
    ronda: r.numero,
    jugadorId: sesion.jugadorId,
    nombre: sesion.nombre,
    tipo: "cifras",
    pasos: local.pasos.map((p) => ({ a: p.a, op: p.op, b: p.b, r: p.r })),
    resultado: resultado,
    declarado: null,
    estado: "pendiente",
    puntos: 0,
    enviadaEn: serverTimestamp(),
  };
  if (partida.config.ayudaCalculo === "mental") {
    if (local.declarado === "" || local.declarado === null) {
      aviso("Escribid el resultado que os da la cuenta (de cabeza).", "error");
      return;
    }
    datos.declarado = Number(local.declarado);
  }
  try {
    await setDoc(doc(db, "cylRespuestas", idRespuesta(partida.codigo, r.numero, sesion.jugadorId)), datos);
    if (partida.config.ayudaCalculo === "final") {
      aviso("Enviado. Vuestro resultado final es " + resultado + ".", "exito");
    } else {
      aviso("Resultado enviado ✔", "exito");
    }
    pintarJuego();
  } catch (ex) {
    aviso(ex.message || "No se ha podido enviar.", "error");
  }
}

// ---------- resultados y podio ----------

function resumenRondaCerrada(r) {
  const deRonda = respuestasDeLaRonda().slice().sort((a, b) => (b.puntos || 0) - (a.puntos || 0));
  const mia = miRespuesta();
  let html = "<h3>" + etiquetaRonda(r) + " · Resultados</h3>";
  if (mia) {
    html += '<p class="centrado" style="font-size:1.2rem;">' +
      (mia.estado === "valida" ? "✅" : "❌") + " Vuestra jugada: <strong>" +
      (r.tipo === "letras" ? escapaHtml(String(mia.palabra || "").toUpperCase()) : escapaHtml(String(mia.resultado != null ? mia.resultado : "—"))) +
      "</strong> · <strong style='color:var(--acento);'>+" + (mia.puntos || 0) + " puntos</strong></p>";
  }
  html += deRonda.map((resp) =>
    '<div class="fila-respuesta ' + resp.estado + '">' +
    '<span class="nombre">' + escapaHtml(resp.nombre) + "</span>" +
    '<span class="jugada">' + (r.tipo === "letras"
      ? escapaHtml(String(resp.palabra || "").toUpperCase())
      : escapaHtml(String(resp.resultado != null ? resp.resultado : "—"))) + "</span>" +
    '<span style="font-weight:800; color:var(--acento);">+' + (resp.puntos || 0) + "</span>" +
    "</div>").join("") || '<p class="texto-suave">Nadie envió respuesta.</p>';
  if (r.solucion) {
    html += '<div class="centrado"><div class="solucion-caja">' + (r.tipo === "letras"
      ? "💡 Se podía: <strong>" + (r.solucion.palabras || []).map(escapaHtml).join(", ").toUpperCase() + "</strong>"
      : "💡 Una manera exacta: <strong>" + escapaHtml(textoSolucion(r.solucion.pasos)) + "</strong>") + "</div></div>";
  }
  return html;
}

function pintarPodio() {
  const top = jugadores.slice(0, 3);
  const orden = [1, 0, 2]; // segundo, primero, tercero (visual de podio)
  const clases = ["p1", "p2", "p3"];
  const emojis = ["🥇", "🥈", "🥉"];
  let html = '<h3 class="centrado">🏁 ¡Final del concurso!</h3><div class="podio">';
  for (const idx of orden) {
    const j = top[idx];
    if (!j) continue;
    html += '<div class="puesto ' + clases[idx] + '">' +
      '<div class="emoji">' + emojis[idx] + "</div>" +
      '<div class="nombre">' + escapaHtml(j.nombre) + "</div>" +
      '<div class="pts">' + (j.puntos || 0) + " pts</div></div>";
  }
  html += "</div>";
  const yo = jugadores.find((j) => j.id === sesion.jugadorId);
  if (yo) {
    const puesto = jugadores.indexOf(yo) + 1;
    html += '<p class="centrado">Habéis quedado en <strong>' + puesto + "º puesto</strong> con <strong>" + (yo.puntos || 0) + " puntos</strong>. ¡Bien jugado!</p>";
  }
  return html;
}

function pintarMarcador() {
  const cont = $("zona-marcador");
  if (!cont) return;
  if (!jugadores.length) { cont.innerHTML = '<p class="texto-suave">Todavía no hay equipos.</p>'; return; }
  const medallas = ["🥇", "🥈", "🥉"];
  cont.innerHTML = '<table class="tabla-marcador"><tr><th></th><th>Equipo</th><th style="text-align:right;">Puntos</th></tr>' +
    jugadores.map((j, i) =>
      '<tr class="' + (j.id === sesion.jugadorId ? "yo" : "") + '"><td>' + (medallas[i] || (i + 1) + "º") + "</td><td>" +
      escapaHtml(j.nombre) + (j.esAnfitrion ? " 🎙️" : "") + "</td>" +
      '<td class="puntos">' + (j.puntos || 0) + "</td></tr>").join("") +
    "</table>";
}
