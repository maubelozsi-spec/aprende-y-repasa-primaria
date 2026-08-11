// ============================================================
// Cifras y Letras — panel del docente.
// Cuenta real de Firebase (la misma que el resto de Aprende y
// Repasa): crear concursos, dirigir el sorteo de letras y cifras,
// controlar el tiempo, validar las respuestas (con comodín sobre
// el diccionario) y repartir los puntos. Todo en tiempo real:
// los cambios llegan solos a jugadores y proyección.
// ============================================================

import {
  doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs,
  onSnapshot, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { db, auth } from "./firebase-init.js";
import { textoSolucion } from "./motor.js";
import { enlaceRae, tamanoDiccionario } from "./diccionario.js";
import {
  crearPartida, prepararRondaLetras, prepararRondaCifras, sacarLetra,
  empezarTiempo, pasarAValidacion, evaluarRespuesta, cerrarRondaYRepartir,
  terminarPartida, refPartida, NIVELES_CIFRAS,
} from "./rondas.js";
import {
  CLAVE_SESION_DOCENTE, guardarSesion, borrarSesion, aviso, confirmar,
  el, escapaHtml, segundosRestantes, formatoTiempo, esErrorPermisos,
} from "./comun.js";

const $ = el;

let docente = null;
let modoRegistro = false;
let partidas = [];
let partida = null;        // doc vivo de cylPartidas
let jugadores = [];        // docs vivos de cylJugadores
let respuestas = [];       // docs vivos de cylRespuestas (toda la partida)
const decisiones = new Map(); // respuestaId → "valida" | "invalida" (comodín del docente)
let paras = [];            // funciones para des-suscribir los onSnapshot
let reloj = null;          // setInterval del tiempo
let cerrandoRonda = false;

// ---------- arranque ----------

document.addEventListener("DOMContentLoaded", () => {
  $("form-login").addEventListener("submit", entrar);
  $("btn-cambiar-modo").addEventListener("click", () => {
    modoRegistro = !modoRegistro;
    $("caja-nombre").style.display = modoRegistro ? "" : "none";
    $("btn-entrar").textContent = modoRegistro ? "Crear cuenta y entrar" : "Entrar";
    $("btn-cambiar-modo").textContent = modoRegistro ? "Ya tengo cuenta" : "No tengo cuenta: crear una";
  });
  $("btn-salir").addEventListener("click", salir);
  $("form-nueva").addEventListener("submit", nuevaPartida);
  $("btn-volver").addEventListener("click", () => { cerrarSuscripciones(); mostrarVista("partidas"); cargarYPintarPartidas(); });

  let primera = true;
  onAuthStateChanged(auth, async (user) => {
    if (!primera) return;
    primera = false;
    if (user && !user.isAnonymous) {
      const snap = await getDoc(doc(db, "teachers", user.uid));
      docente = { uid: user.uid, email: user.email, nombre: snap.exists() ? snap.data().displayName : user.email };
      mostrarVista("partidas");
      await cargarYPintarPartidas();
    } else {
      mostrarVista("login");
    }
  });
});

function mostrarVista(nombre) {
  ["login", "partidas", "partida"].forEach((v) => {
    $("vista-" + v).classList.toggle("activa", v === nombre);
  });
  $("btn-salir").style.display = nombre === "login" ? "none" : "";
}

async function entrar(e) {
  e.preventDefault();
  const email = $("campo-email").value.trim();
  const clave = $("campo-clave").value;
  const err = $("error-login");
  err.textContent = "Entrando…";
  try {
    let cred;
    if (modoRegistro) {
      cred = await createUserWithEmailAndPassword(auth, email, clave);
      await setDoc(doc(db, "teachers", cred.user.uid), {
        displayName: $("campo-nombre").value.trim() || email,
        email: email,
        createdAt: serverTimestamp(),
      });
    } else {
      cred = await signInWithEmailAndPassword(auth, email, clave);
    }
    const snap = await getDoc(doc(db, "teachers", cred.user.uid));
    docente = { uid: cred.user.uid, email: email, nombre: snap.exists() ? snap.data().displayName : email };
    guardarSesion(CLAVE_SESION_DOCENTE, { email: email });
    err.textContent = "";
    mostrarVista("partidas");
    await cargarYPintarPartidas();
  } catch (ex) {
    err.textContent = traducirError(ex);
  }
}

function traducirError(ex) {
  const c = (ex && ex.code) || "";
  if (c.includes("invalid-credential") || c.includes("wrong-password") || c.includes("user-not-found"))
    return "Correo o contraseña incorrectos.";
  if (c.includes("email-already-in-use")) return "Ya existe una cuenta con ese correo: entra con ella.";
  if (c.includes("weak-password")) return "La contraseña necesita al menos 6 caracteres.";
  if (c.includes("invalid-email")) return "Ese correo no parece válido.";
  return ex.message || "No se ha podido entrar.";
}

async function salir() {
  cerrarSuscripciones();
  await signOut(auth);
  borrarSesion(CLAVE_SESION_DOCENTE);
  window.location.reload();
}

// ============================================================
//  LISTA DE PARTIDAS
// ============================================================

async function cargarYPintarPartidas() {
  try {
    const snap = await getDocs(query(collection(db, "cylPartidas"), where("teacherId", "==", docente.uid)));
    partidas = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => ((b.creadaEn && b.creadaEn.seconds) || 0) - ((a.creadaEn && a.creadaEn.seconds) || 0));
  } catch (ex) {
    partidas = [];
    if (esErrorPermisos(ex)) {
      aviso("⚠️ Faltan las reglas de Firestore por publicar: copia el archivo firestore.rules del proyecto en la consola de Firebase (Firestore → Reglas → Publicar).", "error");
    } else { throw ex; }
  }
  const cont = $("lista-partidas");
  if (!partidas.length) {
    cont.innerHTML = '<p class="texto-suave">Aún no tienes ningún concurso. Crea el primero aquí abajo.</p>';
    return;
  }
  cont.innerHTML = partidas.map((p) =>
    '<div class="fila-respuesta">' +
    '<span class="nombre">' + escapaHtml(p.nombre) + "</span>" +
    '<span class="jugada">Código: <strong>' + escapaHtml(p.codigo) + "</strong> · " +
    (p.estado === "fin" ? "terminado" : p.estado === "lobby" ? "en el vestíbulo" : "ronda " + ((p.rondasJugadas || 0) + 1)) + "</span>" +
    '<button class="btn btn-mini btn-principal" data-abrir="' + p.id + '">Abrir</button>' +
    '<button class="btn btn-mini btn-peligro" data-borrar="' + p.id + '">Borrar</button>' +
    "</div>").join("");
  cont.querySelectorAll("[data-abrir]").forEach((b) => b.addEventListener("click", () => abrirPartida(b.dataset.abrir)));
  cont.querySelectorAll("[data-borrar]").forEach((b) => b.addEventListener("click", async () => {
    if (!(await confirmar("¿Borrar este concurso? Se perderá su marcador.", "Borrar"))) return;
    await deleteDoc(doc(db, "cylPartidas", b.dataset.borrar));
    aviso("Concurso borrado.", "exito");
    cargarYPintarPartidas();
  }));
}

async function nuevaPartida(e) {
  e.preventDefault();
  try {
    const codigo = await crearPartida(db, {
      tipo: "aula",
      teacherId: docente.uid,
      anfitrionUid: docente.uid,
      nombre: $("nueva-nombre").value.trim() || "Concurso de clase",
      config: {
        nivelCifras: Number($("nueva-nivel").value),
        ayudaCalculo: $("nueva-ayuda").value,
        validacion: $("nueva-validacion").value,
        numLetras: Number($("nueva-numletras").value),
        duracionLetras: Number($("nueva-tletras").value),
        duracionCifras: Number($("nueva-tcifras").value),
        puntuacion: $("nueva-puntuacion").value,
      },
    });
    aviso("Concurso creado con el código " + codigo + ".", "exito");
    abrirPartida(codigo);
  } catch (ex) {
    aviso(esErrorPermisos(ex) ? "Faltan las reglas de Firestore por publicar." : (ex.message || "No se ha podido crear."), "error");
  }
}

// ============================================================
//  DIRIGIR UNA PARTIDA (todo en tiempo real)
// ============================================================

function cerrarSuscripciones() {
  paras.forEach((p) => p());
  paras = [];
  if (reloj) { clearInterval(reloj); reloj = null; }
  partida = null; jugadores = []; respuestas = []; decisiones.clear();
}

function abrirPartida(codigo) {
  cerrarSuscripciones();
  mostrarVista("partida");

  paras.push(onSnapshot(refPartida(db, codigo), (snap) => {
    if (!snap.exists()) { aviso("Este concurso ya no existe.", "error"); mostrarVista("partidas"); return; }
    const anterior = partida;
    partida = { id: snap.id, ...snap.data({ serverTimestamps: "estimate" }) };
    // Al cambiar de ronda se olvidan las decisiones del comodín.
    if (!anterior || !anterior.ronda || !partida.ronda || anterior.ronda.numero !== partida.ronda.numero) decisiones.clear();
    pintarPartida();
  }));

  paras.push(onSnapshot(query(collection(db, "cylJugadores"), where("partida", "==", codigo)), (snap) => {
    jugadores = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.puntos || 0) - (a.puntos || 0) || String(a.nombre).localeCompare(String(b.nombre)));
    pintarPartida();
  }));

  paras.push(onSnapshot(query(collection(db, "cylRespuestas"), where("partida", "==", codigo)), (snap) => {
    respuestas = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    pintarPartida();
  }));

  reloj = setInterval(latidoReloj, 500);
}

// Cada medio segundo: refresca el reloj y cierra la ronda al llegar
// a cero (con 1,5 s de cortesía para que entren los últimos envíos).
async function latidoReloj() {
  if (!partida || !partida.ronda || partida.ronda.estado !== "jugando") return;
  const seg = segundosRestantes(partida.ronda);
  const elReloj = $("reloj-docente");
  if (elReloj) {
    elReloj.textContent = formatoTiempo(seg);
    elReloj.classList.toggle("apurado", seg <= 10);
    const barra = $("barra-docente");
    if (barra) barra.style.width = (100 * seg / partida.ronda.duracion) + "%";
  }
  if (seg <= 0 && partida.ronda.empiezaEn && !cerrandoRonda) {
    cerrandoRonda = true;
    setTimeout(async () => {
      try { if (partida && partida.ronda && partida.ronda.estado === "jugando") await pasarAValidacion(db, partida); }
      finally { cerrandoRonda = false; }
    }, 1500);
  }
}

function respuestasDeLaRonda() {
  if (!partida || !partida.ronda) return [];
  return respuestas.filter((r) => r.ronda === partida.ronda.numero)
    .sort((a, b) => String(a.nombre).localeCompare(String(b.nombre)));
}

// ---------- pintado ----------

function pintarPartida() {
  if (!partida) return;
  pintarCabecera();
  pintarControl();
  pintarMarcador($("zona-marcador"), jugadores);
}

function pintarCabecera() {
  const enlaceProy = "proyeccion.html?codigo=" + partida.codigo;
  $("zona-cabecera").innerHTML =
    "<h2>" + escapaHtml(partida.nombre) + "</h2>" +
    '<div class="codigo-partida">' + partida.codigo + "</div>" +
    '<p class="texto-suave" style="margin-top:8px;">Los equipos entran en <strong>cifras-letras → Jugar</strong> con este código · ' +
    '<a href="' + enlaceProy + '" target="_blank">abrir proyección 📽️</a></p>';
}

function pintarControl() {
  const z = $("zona-control");
  const r = partida.ronda;

  if (partida.estado === "fin") {
    z.innerHTML = "<h3>🏁 Concurso terminado</h3><p>El podio está en el marcador y en la proyección. ¡Enhorabuena a todos!</p>";
    return;
  }

  // ----- vestíbulo o ronda cerrada: elegir la siguiente prueba -----
  if (partida.estado === "lobby" || (r && r.estado === "cerrada")) {
    let html = "";
    if (partida.estado === "lobby") {
      html += "<h3>🎬 Vestíbulo</h3>" +
        '<p class="texto-suave">Equipos conectados (' + jugadores.length + "):</p>" +
        '<div class="chips-jugadores">' +
        (jugadores.map((j) => '<span class="chip">' + escapaHtml(j.nombre) + "</span>").join("") || '<span class="texto-suave">nadie todavía…</span>') +
        "</div>";
    } else {
      html += resumenRondaCerrada(r);
    }
    html += '<hr class="separador"><div class="botones-operaciones">' +
      '<button class="btn btn-letras btn-grande" id="btn-ronda-letras">🔤 Ronda de LETRAS</button>' +
      '<button class="btn btn-cifras btn-grande" id="btn-ronda-cifras">🔢 Ronda de CIFRAS</button>' +
      '<button class="btn btn-secundario" id="btn-fin">🏁 Terminar el concurso</button>' +
      "</div>";
    z.innerHTML = html;
    $("btn-ronda-letras").addEventListener("click", () => prepararRondaLetras(db, partida));
    $("btn-ronda-cifras").addEventListener("click", () => prepararRondaCifras(db, partida));
    $("btn-fin").addEventListener("click", async () => {
      if (await confirmar("¿Terminar el concurso y enseñar el podio?", "Terminar")) await terminarPartida(db, partida);
    });
    return;
  }

  if (!r) { z.innerHTML = ""; return; }

  // ----- sorteo -----
  if (r.estado === "sorteo") {
    if (r.tipo === "letras") {
      const max = partida.config.numLetras;
      const fichas = [];
      for (let i = 0; i < max; i++) {
        const l = r.letras[i];
        fichas.push('<button class="ficha-letra' + (l ? "" : " hueco") + '" disabled>' + (l || "·") + "</button>");
      }
      z.innerHTML =
        '<h3><span class="etiqueta-ronda etiqueta-letras">Letras</span> · Sorteo del panel (' + r.letras.length + "/" + max + ")</h3>" +
        '<p class="texto-suave">Pregunta a los equipos: ¿vocal o consonante?</p>' +
        '<div class="panel-fichas">' + fichas.join("") + "</div>" +
        '<div class="botones-operaciones">' +
        '<button class="btn btn-letras" id="btn-vocal">Vocal</button>' +
        '<button class="btn btn-letras" id="btn-consonante">Consonante</button>' +
        '<button class="btn btn-secundario" id="btn-auto">Completar solo 🎲</button>' +
        '<button class="btn btn-principal btn-grande" id="btn-empezar"' + (r.letras.length < max ? " disabled" : "") + ">⏱️ ¡Empieza el tiempo!</button>" +
        "</div>";
      const lleno = r.letras.length >= max;
      $("btn-vocal").disabled = lleno; $("btn-consonante").disabled = lleno;
      $("btn-vocal").addEventListener("click", () => sacarLetra(db, partida, "vocal"));
      $("btn-consonante").addEventListener("click", () => sacarLetra(db, partida, "consonante"));
      $("btn-auto").addEventListener("click", () => sacarLetra(db, partida, "auto"));
      $("btn-empezar").addEventListener("click", () => empezarTiempo(db, partida));
    } else {
      z.innerHTML =
        '<h3><span class="etiqueta-ronda etiqueta-cifras">Cifras</span> · ' +
        escapaHtml(NIVELES_CIFRAS[partida.config.nivelCifras].nombre) + "</h3>" +
        '<div class="centrado"><div class="objetivo-cifras">' + r.objetivo + "</div></div>" +
        '<div class="panel-fichas">' +
        r.fichas.map((f) => '<button class="ficha-cifra" disabled>' + f + "</button>").join("") +
        "</div>" +
        '<div class="botones-operaciones">' +
        '<button class="btn btn-secundario" id="btn-otro-sorteo">🎲 Sortear otros números</button>' +
        '<button class="btn btn-principal btn-grande" id="btn-empezar">⏱️ ¡Empieza el tiempo!</button>' +
        "</div>";
      $("btn-otro-sorteo").addEventListener("click", () => prepararRondaCifras(db, partida));
      $("btn-empezar").addEventListener("click", () => empezarTiempo(db, partida));
    }
    return;
  }

  // ----- jugando -----
  if (r.estado === "jugando") {
    const deRonda = respuestasDeLaRonda();
    z.innerHTML =
      "<h3>" + etiquetaRonda(r) + " · ¡Tiempo en marcha!</h3>" +
      '<div class="reloj" id="reloj-docente">' + formatoTiempo(segundosRestantes(r)) + "</div>" +
      '<div class="barra-tiempo"><div id="barra-docente" style="width:100%"></div></div>' +
      (r.tipo === "letras"
        ? '<div class="panel-fichas">' + r.letras.map((l) => '<button class="ficha-letra" disabled>' + l + "</button>").join("") + "</div>"
        : '<div class="centrado"><div class="objetivo-cifras">' + r.objetivo + '</div></div><div class="panel-fichas">' + r.fichas.map((f) => '<button class="ficha-cifra" disabled>' + f + "</button>").join("") + "</div>") +
      '<p class="texto-suave centrado">Respuestas recibidas: <strong>' + deRonda.length + "</strong> de " + jugadores.length + "</p>" +
      '<div class="chips-jugadores">' + jugadores.map((j) => {
        const ha = deRonda.some((x) => x.jugadorId === j.id);
        return '<span class="chip">' + (ha ? "✅ " : "⌛ ") + escapaHtml(j.nombre) + "</span>";
      }).join("") + "</div>" +
      '<div class="botones-operaciones"><button class="btn btn-peligro" id="btn-cerrar-ya">✋ Cerrar la ronda ya</button></div>';
    $("btn-cerrar-ya").addEventListener("click", () => pasarAValidacion(db, partida));
    return;
  }

  // ----- validando -----
  if (r.estado === "validando") {
    const deRonda = respuestasDeLaRonda();
    let html = "<h3>" + etiquetaRonda(r) + " · Revisión de respuestas</h3>";
    if (r.tipo === "letras") {
      html += '<div class="panel-fichas">' + r.letras.map((l) => '<button class="ficha-letra" disabled>' + l + "</button>").join("") + "</div>";
      html += '<p class="texto-suave">Diccionario de la app: ' + tamanoDiccionario().toLocaleString("es-ES") +
        " formas. Si una palabra buena no aparece, usa tu comodín ✓ (puedes comprobarla en la RAE).</p>";
    } else {
      html += '<div class="centrado"><div class="objetivo-cifras">' + r.objetivo + "</div></div>";
    }
    if (!deRonda.length) html += '<p class="texto-suave">Nadie ha enviado respuesta en esta ronda.</p>';
    html += deRonda.map((resp) => {
      const ev = evaluarRespuesta(resp, r, partida.config);
      const estado = decisiones.get(resp.id) || (ev.estado === "pendiente" ? "pendiente" : ev.estado);
      const jugada = r.tipo === "letras"
        ? "<strong>" + escapaHtml(String(resp.palabra || "").toUpperCase()) + "</strong> (" + (resp.palabra || "").length + " letras → " + ev.puntosPosibles + " pts)"
        : escapaHtml((resp.pasos || []).map((p) => p.a + " " + p.op + " " + p.b + " = " + p.r).join(" · ") || "sin operaciones") +
          " → <strong>" + escapaHtml(String(resp.resultado != null ? resp.resultado : "?")) + "</strong> (" + ev.puntosPosibles + " pts)";
      const rae = r.tipo === "letras"
        ? ' · <a href="' + enlaceRae(resp.palabra) + '" target="_blank">ver en la RAE ↗</a>' : "";
      return '<div class="fila-respuesta ' + estado + '" data-resp="' + resp.id + '">' +
        '<span class="nombre">' + escapaHtml(resp.nombre) + "</span>" +
        '<span class="jugada">' + jugada + "</span>" +
        '<button class="btn btn-mini btn-exito" data-ok="' + resp.id + '">✓ Vale</button>' +
        '<button class="btn btn-mini btn-peligro" data-no="' + resp.id + '">✗ No vale</button>' +
        '<span class="motivo">' + escapaHtml(ev.motivo || "") + (estado === "pendiente" ? " · decide con los botones" : " · " + estado) + rae + "</span>" +
        "</div>";
    }).join("");
    html += '<div class="botones-operaciones"><button class="btn btn-principal btn-grande" id="btn-repartir">🏆 Repartir puntos y cerrar la ronda</button></div>';
    z.innerHTML = html;
    z.querySelectorAll("[data-ok]").forEach((b) => b.addEventListener("click", () => { decisiones.set(b.dataset.ok, "valida"); pintarControl(); }));
    z.querySelectorAll("[data-no]").forEach((b) => b.addEventListener("click", () => { decisiones.set(b.dataset.no, "invalida"); pintarControl(); }));
    $("btn-repartir").addEventListener("click", repartir);
  }
}

function etiquetaRonda(r) {
  return '<span class="etiqueta-ronda etiqueta-' + r.tipo + '">' + (r.tipo === "letras" ? "Letras" : "Cifras") + "</span> · Ronda " + r.numero;
}

function resumenRondaCerrada(r) {
  let html = "<h3>" + etiquetaRonda(r) + " · Resultados</h3>";
  const deRonda = respuestasDeLaRonda().slice().sort((a, b) => (b.puntos || 0) - (a.puntos || 0));
  html += deRonda.map((resp) =>
    '<div class="fila-respuesta ' + resp.estado + '">' +
    '<span class="nombre">' + escapaHtml(resp.nombre) + "</span>" +
    '<span class="jugada">' + (r.tipo === "letras"
      ? escapaHtml(String(resp.palabra || "").toUpperCase())
      : escapaHtml(String(resp.resultado != null ? resp.resultado : "—"))) + "</span>" +
    '<span class="puntos" style="font-weight:800; color:var(--acento);">+' + (resp.puntos || 0) + "</span>" +
    "</div>").join("") || '<p class="texto-suave">Sin respuestas.</p>';
  if (r.solucion) {
    html += '<div class="centrado"><div class="solucion-caja">' + (r.tipo === "letras"
      ? "💡 Se podía: <strong>" + (r.solucion.palabras || []).map(escapaHtml).join(", ").toUpperCase() + "</strong>"
      : "💡 Una manera exacta: <strong>" + escapaHtml(textoSolucion(r.solucion.pasos)) + "</strong>") + "</div></div>";
  }
  return html;
}

async function repartir() {
  const r = partida.ronda;
  const deRonda = respuestasDeLaRonda();
  const listas = deRonda.map((resp) => {
    const ev = evaluarRespuesta(resp, r, partida.config);
    const estado = decisiones.get(resp.id) || ev.estado;
    return { id: resp.id, jugadorId: resp.jugadorId, estado: estado, puntosPosibles: ev.puntosPosibles, pendiente: estado === "pendiente" };
  });
  const pendientes = listas.filter((x) => x.pendiente);
  if (pendientes.length) {
    const seguir = await confirmar("Hay " + pendientes.length + " palabra(s) sin decidir: se contarán como NO válidas. ¿Repartir igualmente?", "Repartir");
    if (!seguir) return;
    pendientes.forEach((x) => { x.estado = "invalida"; });
  }
  try {
    await cerrarRondaYRepartir(db, partida, listas.map(({ pendiente, ...x }) => x));
    aviso("Puntos repartidos. ¡Ronda cerrada!", "exito");
  } catch (ex) {
    aviso(ex.message || "No se han podido repartir los puntos.", "error");
  }
}

// ---------- marcador (lo usa también el resumen) ----------

function pintarMarcador(cont, lista) {
  if (!cont) return;
  if (!lista.length) { cont.innerHTML = '<p class="texto-suave">Todavía no hay equipos.</p>'; return; }
  const medallas = ["🥇", "🥈", "🥉"];
  cont.innerHTML = '<table class="tabla-marcador"><tr><th></th><th>Equipo</th><th style="text-align:right;">Puntos</th></tr>' +
    lista.map((j, i) =>
      "<tr><td>" + (medallas[i] || (i + 1) + "º") + "</td><td>" + escapaHtml(j.nombre) + "</td>" +
      '<td class="puntos">' + (j.puntos || 0) + "</td></tr>").join("") +
    "</table>";
}
