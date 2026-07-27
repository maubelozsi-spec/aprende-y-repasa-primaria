// ============================================================
// Economía Familiar 2.0 — panel del docente.
// Cuenta real de Firebase (la misma que Aprende y Repasa): crear
// partidas, familias con su código, abrir y cerrar los meses,
// editar los eventos de la localidad, premiar la mejor reflexión,
// leer el análisis mensual automático e imprimir el informe final
// con diplomas.
// ============================================================

import {
  doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, collection, query, where, getDocs, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { db, auth } from "./firebase-init.js";
import {
  PERFILES_FAMILIA, EVENTOS_PLANTILLA, INSIGNIAS, CONFIG_JUEGO, NOMBRES_MES,
} from "./catalogos.js";
import {
  euros, redondear, generarCodigo, idAleatorio, sortearRetos, analisisDelMes, efectosCierreMes, inferirPatrimonio,
} from "./motor.js";
import {
  CLAVE_SESION_DOCENTE, guardarSesion, cargarSesion, borrarSesion,
  aviso, confirmar, graficaLineas, PALETA_FAMILIAS, el, escapaHtml,
} from "./comun.js";

const $ = el;

let docente = null;      // { uid, email, nombre }
let modoRegistro = false;
let partidas = [];
let partida = null;      // partida abierta { id, ... }
let familias = [];       // familias de la partida abierta
let eventos = [];
let meses = [];          // ecoMeses de la partida
let prestamos = [];

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
  $("btn-nueva-partida").addEventListener("click", nuevaPartida);
  $("btn-volver-partidas").addEventListener("click", () => { mostrarVista("partidas"); pintarPartidas(); });
  document.querySelectorAll("#vista-partida .pestana").forEach((p) => {
    p.addEventListener("click", () => {
      document.querySelectorAll("#vista-partida .pestana").forEach((x) => x.classList.remove("activa"));
      p.classList.add("activa");
      ["mes", "familias", "eventos", "analisis", "informe"].forEach((v) => {
        $("subvista-" + v).classList.toggle("activa", v === p.dataset.vista);
      });
    });
  });

  // Firebase mantiene la sesión sola: esperamos a saber si hay usuario.
  let primera = true;
  onAuthStateChanged(auth, async (user) => {
    if (!primera) return;
    primera = false;
    if (user && !user.isAnonymous) {
      const snap = await getDoc(doc(db, "teachers", user.uid));
      docente = { uid: user.uid, email: user.email, nombre: snap.exists() ? snap.data().displayName : user.email };
      await cargarPartidas();
      mostrarVista("partidas");
      pintarPartidas();
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
    await cargarPartidas();
    mostrarVista("partidas");
    pintarPartidas();
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
  await signOut(auth);
  borrarSesion(CLAVE_SESION_DOCENTE);
  window.location.reload();
}

// ============================================================
//  PARTIDAS
// ============================================================

async function cargarPartidas() {
  try {
    const snap = await getDocs(query(collection(db, "ecoPartidas"), where("teacherId", "==", docente.uid)));
    partidas = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.creadoEn && b.creadoEn.seconds || 0) - (a.creadoEn && a.creadoEn.seconds || 0));
  } catch (ex) {
    partidas = [];
    if (ex && (ex.code === "permission-denied" || String(ex.message || "").includes("insufficient permissions"))) {
      aviso("⚠️ Faltan las reglas de Firestore por publicar: copia el archivo firestore.rules del proyecto en la consola de Firebase (Firestore → Reglas → Publicar).", "error");
    } else {
      throw ex;
    }
  }
}

function pintarPartidas() {
  const c = $("lista-partidas");
  if (!partidas.length) {
    c.innerHTML = "<p>Aún no tienes partidas. ¡Crea la primera para tu clase!</p>";
    return;
  }
  c.innerHTML = '<div class="rejilla">' + partidas.map((p) =>
    '<div class="tarjeta fila-clicable" style="margin:0;" data-partida="' + p.id + '">' +
    "<h3>🎲 " + escapaHtml(p.nombre) + "</h3>" +
    "<p>📍 " + escapaHtml(p.localidad || "—") + "</p>" +
    "<p><span class='chip " + (p.estado === "terminada" ? "chip-verde" : p.estado === "en_curso" ? "chip-azul" : "chip-naranja") + "'>" +
    (p.estado === "terminada" ? "Terminada" : p.estado === "en_curso" ? "Mes " + p.mesActual + " (" + NOMBRES_MES[p.mesActual] + ")" : "En preparación") +
    "</span></p></div>"
  ).join("") + "</div>";
  c.querySelectorAll("[data-partida]").forEach((t) => {
    t.addEventListener("click", () => abrirPartida(t.dataset.partida));
  });
}

async function nuevaPartida() {
  const fondo = document.createElement("div");
  fondo.className = "modal-fondo";
  fondo.innerHTML = '<div class="modal-caja"><h3>➕ Nueva partida</h3>' +
    '<div class="campo"><label>Nombre (ej: 6ºA 2026-27)</label><input id="np-nombre"></div>' +
    '<div class="campo"><label>Localidad de las familias</label><input id="np-localidad" placeholder="Ej: La Cañada de San Urbano, Almería"></div>' +
    '<div class="campo"><label style="display:flex; gap:8px; align-items:center;"><input type="checkbox" id="np-inflacion" checked style="width:auto;"> Inflación (los gastos suben un ' + CONFIG_JUEGO.inflacionMensual + '% al mes)</label></div>' +
    '<div class="campo"><label style="display:flex; gap:8px; align-items:center;"><input type="checkbox" id="np-pagas" checked style="width:auto;"> Pagas extra en junio y diciembre</label></div>' +
    '<div class="modal-botones"><button class="btn btn-secundario" id="np-cancelar">Cancelar</button>' +
    '<button class="btn btn-principal" id="np-crear">Crear partida</button></div></div>';
  document.body.appendChild(fondo);
  fondo.querySelector("#np-cancelar").addEventListener("click", () => fondo.remove());
  fondo.querySelector("#np-crear").addEventListener("click", async () => {
    const nombre = fondo.querySelector("#np-nombre").value.trim();
    if (!nombre) { aviso("Ponle nombre a la partida.", "error"); return; }
    const ref = await addDoc(collection(db, "ecoPartidas"), {
      teacherId: docente.uid,
      nombre: nombre,
      localidad: fondo.querySelector("#np-localidad").value.trim(),
      mesActual: 0,
      mesAbierto: false,
      estado: "preparacion",
      ajustes: {
        inflacion: fondo.querySelector("#np-inflacion").checked,
        pagasExtra: fondo.querySelector("#np-pagas").checked,
      },
      analisis: {},
      creadoEn: serverTimestamp(),
    });
    // Sembrar los eventos de la plantilla (el docente los edita después).
    for (const ev of EVENTOS_PLANTILLA) {
      await addDoc(collection(db, "ecoEventos"), {
        ...ev, partidaId: ref.id, teacherId: docente.uid, activo: true,
      });
    }
    fondo.remove();
    aviso("Partida creada con sus eventos del año. ¡Ahora crea las familias!", "exito");
    await cargarPartidas();
    abrirPartida(ref.id);
  });
}

async function abrirPartida(pid) {
  partida = null;
  mostrarVista("partida");
  $("cabecera-partida").innerHTML = '<div class="tarjeta">Cargando…</div>';
  const [pSnap, fSnap, eSnap, mSnap, prSnap] = await Promise.all([
    getDoc(doc(db, "ecoPartidas", pid)),
    getDocs(query(collection(db, "ecoFamilias"), where("partidaId", "==", pid), where("teacherId", "==", docente.uid))),
    getDocs(query(collection(db, "ecoEventos"), where("partidaId", "==", pid))),
    getDocs(query(collection(db, "ecoMeses"), where("partidaId", "==", pid), where("teacherId", "==", docente.uid))),
    getDocs(query(collection(db, "ecoPrestamosFamilias"), where("partidaId", "==", pid))),
  ]);
  partida = { id: pid, ...pSnap.data() };
  familias = fSnap.docs.map((d) => ({ codigo: d.id, ...d.data() })).sort((a, b) => a.nombre.localeCompare(b.nombre));
  eventos = eSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  meses = mSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  prestamos = prSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  pintarPartida();
}

function pintarPartida() {
  pintarCabeceraPartida();
  pintarControlMes();
  pintarFamilias();
  pintarEventos();
  pintarAnalisis();
  pintarInforme();
}

function pintarCabeceraPartida() {
  $("cabecera-partida").innerHTML = '<div class="tarjeta">' +
    "<h2>🎲 " + escapaHtml(partida.nombre) + " <span style='font-weight:400; font-size:0.95rem; color:var(--gris-texto);'>📍 " +
    escapaHtml(partida.localidad || "") + "</span></h2>" +
    '<div class="panel-cifras">' +
    cifraHtml(partida.estado === "preparacion" ? "—" : NOMBRES_MES[partida.mesActual], "Mes actual") +
    cifraHtml(partida.mesAbierto ? "🔓 Abierto" : "🔒 Cerrado", "Estado del mes") +
    cifraHtml(String(familias.length), "Familias") +
    cifraHtml(partida.estado === "terminada" ? "🏁 Sí" : "No", "¿Terminada?") +
    "</div></div>";
}

function cifraHtml(valor, titulo, clase) {
  return '<div class="cifra ' + (clase || "") + '"><div class="valor">' + valor +
    '</div><div class="titulo">' + titulo + "</div></div>";
}

// ============================================================
//  CONTROL DEL MES
// ============================================================

function registrosDelMes(mes) {
  return meses.filter((x) => x.mes === mes && x.completado);
}

function pintarControlMes() {
  const c = $("subvista-mes");
  let html = "";

  if (partida.estado === "terminada") {
    html += '<div class="tarjeta destacada"><h3>🏁 Partida terminada</h3>' +
      "<p>Las familias han vivido su año completo. Toca el gran repaso: pestaña <strong>Informe final</strong>.</p></div>";
    c.innerHTML = html;
    return;
  }

  if (partida.estado === "preparacion") {
    html += '<div class="tarjeta destacada"><h3>🚦 Preparación</h3>' +
      "<p>Crea las familias en su pestaña y, cuando la clase esté lista, ¡arranca el año!</p>" +
      '<button class="btn btn-principal btn-grande" id="btn-arrancar" ' + (familias.length ? "" : "disabled") + ">▶️ Empezar la partida (Enero)</button>" +
      (familias.length ? "" : "<p style='color:var(--gris-texto);'>Necesitas al menos una familia.</p>") + "</div>";
    c.innerHTML = html;
    const btn = $("btn-arrancar");
    if (btn) btn.addEventListener("click", async () => {
      await updateDoc(doc(db, "ecoPartidas", partida.id), { estado: "en_curso", mesActual: 1, mesAbierto: true });
      partida.estado = "en_curso"; partida.mesActual = 1; partida.mesAbierto = true;
      aviso("¡Enero abierto! Las familias ya pueden jugar.", "exito");
      pintarPartida();
    });
    return;
  }

  const mes = partida.mesActual;
  const completados = registrosDelMes(mes);
  const codigosHechos = new Set(completados.map((x) => x.familiaCodigo));

  html += '<div class="tarjeta"><h3>📅 ' + NOMBRES_MES[mes] + " — " +
    (partida.mesAbierto ? "las familias están jugando" : "mes cerrado") + "</h3>" +
    '<div class="tabla-envoltura"><table><thead><tr><th>Familia</th><th>Código</th><th>¿Mes hecho?</th><th>Saldo</th><th>Ahorros</th><th>ISE</th></tr></thead><tbody>' +
    familias.map((f) => {
      const r = completados.find((x) => x.familiaCodigo === f.codigo);
      return "<tr><td>" + f.emoji + " " + escapaHtml(f.nombre) + (f.planRescate && f.planRescate.activo ? " 🚨" : "") + "</td>" +
        "<td><code>" + f.codigo + "</code></td>" +
        "<td>" + (r ? "✅" : "⏳") + "</td>" +
        "<td>" + (r ? euros(r.saldoMes) : "—") + "</td>" +
        "<td>" + euros(f.ahorros) + "</td>" +
        "<td>" + (r ? r.ise : "—") + "</td></tr>";
    }).join("") + "</tbody></table></div>";

  html += "<p><strong>" + codigosHechos.size + " de " + familias.length + "</strong> familias han completado el mes.</p>";

  if (partida.mesAbierto) {
    html += '<button class="btn btn-peligro" id="btn-cerrar-mes">🔒 Cerrar ' + NOMBRES_MES[mes] + "</button> " +
      "<span style='color:var(--gris-texto);'>Al cerrar: intereses del banco, control de préstamos y análisis del mes.</span>";
  } else {
    html += mes >= 12
      ? '<button class="btn btn-exito btn-grande" id="btn-terminar">🏁 Terminar la partida</button>'
      : '<button class="btn btn-exito" id="btn-abrir-mes">🔓 Abrir ' + NOMBRES_MES[mes + 1] + "</button>";
  }
  html += "</div>";

  // Premio a la mejor reflexión (con el mes cerrado y reflexiones a mano).
  if (!partida.mesAbierto && completados.length) {
    const yaPremiado = completados.find((x) => x.premioReflexion);
    html += '<div class="tarjeta"><h3>🏅 Mejor reflexión de ' + NOMBRES_MES[mes] + "</h3>";
    if (yaPremiado) {
      const f = familias.find((x) => x.codigo === yaPremiado.familiaCodigo);
      html += "<p>Premiada: <strong>" + (f ? f.emoji + " " + escapaHtml(f.nombre) : "—") + "</strong> (+10 de salud emocional).</p>";
    } else {
      html += "<p>Leed las reflexiones en voz alta y premiad la mejor (+10 de salud emocional):</p>" +
        completados.map((r) => {
          const f = familias.find((x) => x.codigo === r.familiaCodigo);
          return '<div class="tarjeta"><p><strong>' + (f ? f.emoji + " " + escapaHtml(f.nombre) : "") + "</strong>: " +
            escapaHtml(r.reflexion || "(sin reflexión)") + "</p>" +
            '<button class="btn btn-mini btn-azul" data-premiar="' + r.id + '">🏅 Premiar esta</button></div>';
        }).join("");
    }
    html += "</div>";
  }

  // Préstamos solidarios de la partida.
  const prestamosVivos = prestamos.filter((p) => p.estado !== "devuelto" || !p.cobrado);
  if (prestamosVivos.length) {
    html += '<div class="tarjeta"><h3>🤝 Préstamos entre familias</h3><div class="tabla-envoltura"><table><thead>' +
      "<tr><th>De</th><th>Para</th><th>Importe</th><th>Límite</th><th>Estado</th></tr></thead><tbody>" +
      prestamos.map((p) =>
        "<tr><td>" + escapaHtml(p.deNombre) + "</td><td>" + escapaHtml(p.aNombre) + "</td><td>" + euros(p.importe) + "</td>" +
        "<td>" + NOMBRES_MES[p.mesLimite] + "</td><td>" +
        (p.estado === "devuelto" ? "✅ Devuelto" : p.estado === "aceptado" ? "🔄 En marcha" : p.estado === "vencido" ? "⛔ Vencido" : "⏳ Pendiente de aceptar") +
        "</td></tr>").join("") + "</tbody></table></div></div>";
  }

  c.innerHTML = html;

  const btnCerrar = $("btn-cerrar-mes");
  if (btnCerrar) btnCerrar.addEventListener("click", cerrarMes);
  const btnAbrir = $("btn-abrir-mes");
  if (btnAbrir) btnAbrir.addEventListener("click", abrirSiguienteMes);
  const btnTerminar = $("btn-terminar");
  if (btnTerminar) btnTerminar.addEventListener("click", terminarPartida);
  c.querySelectorAll("[data-premiar]").forEach((b) => b.addEventListener("click", () => premiarReflexion(b.dataset.premiar)));
}

async function cerrarMes() {
  const mes = partida.mesActual;
  const completados = registrosDelMes(mes);
  const faltan = familias.length - completados.length;
  const ok = await confirmar(
    "¿Cerrar <strong>" + NOMBRES_MES[mes] + "</strong>?" +
    (faltan > 0 ? "<br>⚠️ Aún faltan " + faltan + " familias por completar el mes: ya no podrán jugarlo." : ""),
    "Cerrar el mes");
  if (!ok) return;

  const avisos = [];

  // Efectos automáticos por familia: intereses, rescates, insignia remontada.
  for (const f of familias) {
    const { cambios, avisos: avs } = efectosCierreMes(f, mes);
    avisos.push(...avs);
    const actualiza = {};
    if (cambios.cuentaAhorro) actualiza.cuentaAhorro = cambios.cuentaAhorro;
    if (cambios.planRescate) actualiza.planRescate = cambios.planRescate;
    if (cambios.insigniaRemontada) {
      actualiza.insignias = [...new Set([...(f.insignias || []), "remontada"])];
    }
    if (Object.keys(actualiza).length) {
      await updateDoc(doc(db, "ecoFamilias", f.codigo), actualiza);
      Object.assign(f, actualiza);
    }
  }

  // Préstamos solidarios vencidos.
  for (const p of prestamos) {
    if ((p.estado === "pendiente" || p.estado === "aceptado") && mes >= p.mesLimite) {
      await updateDoc(doc(db, "ecoPrestamosFamilias", p.id), { estado: "vencido" });
      p.estado = "vencido";
      avisos.push("⛔ El préstamo de " + p.deNombre + " a " + p.aNombre + " ha vencido sin devolverse.");
    }
  }

  // Análisis del mes por reglas.
  const analisis = analisisDelMes(mes, completados, familias.map((f) => ({ ...f, id: f.codigo })));
  const analisisNuevo = { ...(partida.analisis || {}) };
  analisisNuevo[String(mes)] = analisis;
  await updateDoc(doc(db, "ecoPartidas", partida.id), { mesAbierto: false, analisis: analisisNuevo });
  partida.mesAbierto = false;
  partida.analisis = analisisNuevo;

  aviso("Mes cerrado.", "exito");
  for (const a of avisos.slice(0, 4)) aviso(a, "aviso");
  pintarPartida();
}

async function abrirSiguienteMes() {
  const siguiente = partida.mesActual + 1;
  await updateDoc(doc(db, "ecoPartidas", partida.id), { mesActual: siguiente, mesAbierto: true });
  partida.mesActual = siguiente;
  partida.mesAbierto = true;
  aviso("¡" + NOMBRES_MES[siguiente] + " abierto!", "exito");
  pintarPartida();
}

async function terminarPartida() {
  const ok = await confirmar("¿Dar por <strong>terminada</strong> la partida? Las familias ya no podrán jugar más meses.", "Terminar");
  if (!ok) return;
  await updateDoc(doc(db, "ecoPartidas", partida.id), { estado: "terminada" });
  partida.estado = "terminada";
  aviso("🏁 ¡Partida terminada! El informe final os espera.", "exito");
  pintarPartida();
}

async function premiarReflexion(registroId) {
  const r = meses.find((x) => x.id === registroId);
  if (!r) return;
  const nuevoISE = Math.min(100, (r.ise || 0) + 10);
  await updateDoc(doc(db, "ecoMeses", registroId), { premioReflexion: true, ise: nuevoISE });
  r.premioReflexion = true;
  r.ise = nuevoISE;
  // Reflejar el ISE en el marcador si era su último mes.
  await setDoc(doc(db, "ecoMarcador", partida.id), {
    familias: { [r.familiaPublicId]: { ise: nuevoISE } },
  }, { merge: true });
  aviso("🏅 Reflexión premiada: +10 de salud emocional.", "exito");
  pintarControlMes();
}

// ============================================================
//  FAMILIAS
// ============================================================

function pintarFamilias() {
  const c = $("subvista-familias");
  let html = '<div class="tarjeta no-imprimir"><h3>👨‍👩‍👧‍👦 Familias de la partida</h3>' +
    '<button class="btn btn-principal" id="btn-nueva-familia">➕ Crear familia</button> ' +
    '<button class="btn btn-secundario" id="btn-imprimir-codigos">🖨️ Imprimir tarjetas con los códigos</button></div>';

  if (familias.length) {
    html += '<div class="rejilla">' + familias.map((f) =>
      '<div class="tarjeta" style="margin:0;">' +
      "<h3>" + f.emoji + " " + escapaHtml(f.nombre) +
      (f.planRescate && f.planRescate.activo ? " 🚨" : "") + "</h3>" +
      '<p>Código: <span class="codigo-familia">' + f.codigo + "</span></p>" +
      "<p>💶 " + euros(f.ingresosMensuales) + "/mes · Ahorros: <strong>" + euros(f.ahorros) + "</strong></p>" +
      "<p>⭐ " + (f.estrellas || 0) + " · ❤️ " + (f.corazones || 0) + " · ⚠️ " + (f.alertas || 0) +
      " · <span class='chip " + (f.dificultad === "facil" ? "chip-verde" : f.dificultad === "dificil" ? "chip-rojo" : "chip-azul") + "'>" +
      (f.dificultad === "facil" ? "Fácil" : f.dificultad === "dificil" ? "Difícil" : "Media") + "</span></p>" +
      (f.alumnos ? "<p style='font-size:0.85rem; color:var(--gris-texto);'>👧 " + escapaHtml(f.alumnos) + "</p>" : "") +
      "<p>🎯 Retos: " + (f.retos || []).map((r) => "<span title='" + escapaHtml(r.descripcion) + "'>" + r.meses + "</span>").join(" · ") + "</p>" +
      '<div style="display:flex; gap:6px; flex-wrap:wrap;">' +
      '<button class="btn btn-mini btn-azul" data-ver="' + f.codigo + '">Ver detalle</button>' +
      '<button class="btn btn-mini btn-secundario" data-editar="' + f.codigo + '">Editar</button>' +
      '<button class="btn btn-mini btn-peligro" data-borrar="' + f.codigo + '">Borrar</button>' +
      "</div></div>"
    ).join("") + "</div>";
  } else {
    html += '<div class="tarjeta">Aún no hay familias. Puedes crearlas desde cero o usar los perfiles preparados.</div>';
  }

  // Zona de impresión de tarjetas.
  html += '<div class="solo-impresion" id="zona-tarjetas-codigos">' +
    "<h2>Economía Familiar 2.0 — " + escapaHtml(partida.nombre) + "</h2>" +
    familias.map((f) =>
      '<div class="tarjeta"><h3>' + f.emoji + " " + escapaHtml(f.nombre) + "</h3>" +
      (f.alumnos ? "<p>Jugadores: " + escapaHtml(f.alumnos) + "</p>" : "") +
      '<p>Entrad en la app, pulsad "Somos una familia" y escribid:</p>' +
      '<p class="codigo-familia">' + f.codigo + "</p></div>"
    ).join("") + "</div>";

  c.innerHTML = html;
  $("btn-nueva-familia").addEventListener("click", () => formularioFamilia(null));
  $("btn-imprimir-codigos").addEventListener("click", () => window.print());
  c.querySelectorAll("[data-ver]").forEach((b) => b.addEventListener("click", () => verFamilia(b.dataset.ver)));
  c.querySelectorAll("[data-editar]").forEach((b) => b.addEventListener("click", () => {
    const f = familias.find((x) => x.codigo === b.dataset.editar);
    formularioFamilia(f);
  }));
  c.querySelectorAll("[data-borrar]").forEach((b) => b.addEventListener("click", async () => {
    const f = familias.find((x) => x.codigo === b.dataset.borrar);
    const ok = await confirmar("¿Borrar la familia <strong>" + f.emoji + " " + escapaHtml(f.nombre) +
      "</strong>? Se perderá todo su progreso.", "Borrar");
    if (!ok) return;
    await deleteDoc(doc(db, "ecoFamilias", f.codigo));
    familias = familias.filter((x) => x.codigo !== f.codigo);
    aviso("Familia borrada.", "exito");
    pintarPartida();
  }));
}

// Formulario de creación/edición de familia (con perfiles precargados).
function formularioFamilia(existente) {
  const perfilesUsados = new Set(familias.map((f) => f.nombre));
  const fondo = document.createElement("div");
  fondo.className = "modal-fondo";

  const f = existente || {
    nombre: "", emoji: "🏠", dificultad: "media", miembros: [], mascotas: "",
    gastosFijos: [], alumnos: "",
  };

  fondo.innerHTML = '<div class="modal-caja" style="max-width:680px;">' +
    "<h3>" + (existente ? "✏️ Editar familia" : "➕ Nueva familia") + "</h3>" +
    (existente ? "" :
      '<div class="campo"><label>Empezar desde un perfil preparado</label><select id="ff-perfil">' +
      '<option value="">— Familia desde cero —</option>' +
      PERFILES_FAMILIA.map((p, i) =>
        '<option value="' + i + '"' + (perfilesUsados.has(p.nombre) ? " disabled" : "") + ">" +
        p.emoji + " " + p.nombre + (perfilesUsados.has(p.nombre) ? " (ya en uso)" : "") + "</option>").join("") +
      "</select></div>") +
    '<div class="fila-campos">' +
    '<div class="campo"><label>Nombre</label><input id="ff-nombre" value="' + escapaHtml(f.nombre) + '"></div>' +
    '<div class="campo" style="max-width:90px;"><label>Emoji</label><input id="ff-emoji" value="' + f.emoji + '"></div>' +
    '<div class="campo"><label>Dificultad</label><select id="ff-dificultad">' +
    '<option value="facil"' + (f.dificultad === "facil" ? " selected" : "") + ">🟢 Fácil</option>" +
    '<option value="media"' + (f.dificultad === "media" || !f.dificultad ? " selected" : "") + ">🔵 Media</option>" +
    '<option value="dificil"' + (f.dificultad === "dificil" ? " selected" : "") + ">🔴 Difícil</option>" +
    "</select></div></div>" +
    '<div class="campo"><label>Alumnos que la juegan</label><input id="ff-alumnos" value="' + escapaHtml(f.alumnos || "") + '" placeholder="Ej: Lucía, Hugo y Vera"></div>' +
    '<div class="campo"><label>Mascotas (vacío si no hay)</label><input id="ff-mascotas" value="' + escapaHtml(f.mascotas || "") + '"></div>' +
    (() => {
      const pat = inferirPatrimonio(f);
      return '<div class="fila-campos">' +
        '<div class="campo"><label>Vivienda (aval del banco)</label><select id="ff-vivienda">' +
        '<option value="propia"' + (pat.vivienda === "propia" ? " selected" : "") + ">🏠 Casa en propiedad</option>" +
        '<option value="alquiler"' + (pat.vivienda === "alquiler" ? " selected" : "") + ">🔑 De alquiler</option>" +
        "</select></div>" +
        '<div class="campo"><label>Vehículos (aval del banco)</label>' +
        '<div style="display:flex; gap:12px; flex-wrap:wrap; padding-top:6px;">' +
        [["coche", "🚗 Coche"], ["moto", "🛵 Moto"], ["furgoneta", "🚐 Furgoneta"]].map((par) =>
          '<label style="font-weight:400; display:flex; gap:4px; align-items:center;"><input type="checkbox" class="ff-vehiculo" value="' + par[0] +
          '" style="width:auto;"' + (pat.vehiculos.includes(par[0]) ? " checked" : "") + ">" + par[1] + "</label>").join("") +
        "</div></div></div>";
    })() +
    "<h4>Miembros e ingresos</h4><div id='ff-miembros'></div>" +
    '<button class="btn btn-mini btn-secundario" id="ff-add-miembro">+ Añadir miembro</button>' +
    "<h4 style='margin-top:12px;'>Gastos fijos mensuales</h4><div id='ff-gastos'></div>" +
    '<button class="btn btn-mini btn-secundario" id="ff-add-gasto">+ Añadir gasto</button>' +
    '<div class="modal-botones"><button class="btn btn-secundario" id="ff-cancelar">Cancelar</button>' +
    '<button class="btn btn-principal" id="ff-guardar">' + (existente ? "Guardar cambios" : "Crear familia") + "</button></div></div>";

  document.body.appendChild(fondo);

  const pintarMiembros = (miembros) => {
    fondo.querySelector("#ff-miembros").innerHTML = miembros.map((mi, i) =>
      '<div class="fila-campos" data-miembro="' + i + '">' +
      '<div class="campo"><input placeholder="Nombre" class="mi-nombre" value="' + escapaHtml(mi.nombre) + '"></div>' +
      '<div class="campo" style="max-width:80px;"><input type="number" placeholder="Edad" class="mi-edad" value="' + (mi.edad || "") + '"></div>' +
      '<div class="campo"><input placeholder="Trabajo / rol" class="mi-rol" value="' + escapaHtml(mi.rol) + '"></div>' +
      '<div class="campo" style="max-width:110px;"><input type="number" placeholder="€/mes" class="mi-ingresos" value="' + (mi.ingresos || 0) + '"></div>' +
      '<button class="btn btn-mini btn-peligro" data-quitar-miembro="' + i + '">✕</button></div>'
    ).join("");
    fondo.querySelectorAll("[data-quitar-miembro]").forEach((b) => b.addEventListener("click", () => {
      const lista = leerMiembros(); lista.splice(Number(b.dataset.quitarMiembro), 1); pintarMiembros(lista);
    }));
  };
  const pintarGastos = (gastos) => {
    fondo.querySelector("#ff-gastos").innerHTML = gastos.map((g, i) =>
      '<div class="fila-campos" data-gasto="' + i + '">' +
      '<div class="campo"><input placeholder="Concepto" class="ga-concepto" value="' + escapaHtml(g.concepto) + '"></div>' +
      '<div class="campo" style="max-width:110px;"><input type="number" placeholder="€/mes" class="ga-importe" value="' + (g.importe || 0) + '"></div>' +
      '<button class="btn btn-mini btn-peligro" data-quitar-gasto="' + i + '">✕</button></div>'
    ).join("");
    fondo.querySelectorAll("[data-quitar-gasto]").forEach((b) => b.addEventListener("click", () => {
      const lista = leerGastos(); lista.splice(Number(b.dataset.quitarGasto), 1); pintarGastos(lista);
    }));
  };
  const leerMiembros = () => Array.from(fondo.querySelectorAll("[data-miembro]")).map((fila) => ({
    nombre: fila.querySelector(".mi-nombre").value.trim(),
    edad: Number(fila.querySelector(".mi-edad").value || 0),
    rol: fila.querySelector(".mi-rol").value.trim(),
    ingresos: Number(fila.querySelector(".mi-ingresos").value || 0),
  }));
  const leerGastos = () => Array.from(fondo.querySelectorAll("[data-gasto]")).map((fila) => ({
    concepto: fila.querySelector(".ga-concepto").value.trim(),
    importe: Number(fila.querySelector(".ga-importe").value || 0),
  }));

  pintarMiembros(f.miembros.length ? f.miembros : [{ nombre: "", edad: "", rol: "", ingresos: 0 }]);
  pintarGastos(f.gastosFijos.length ? f.gastosFijos : [{ concepto: "", importe: 0 }]);

  const selPerfil = fondo.querySelector("#ff-perfil");
  if (selPerfil) selPerfil.addEventListener("change", () => {
    if (selPerfil.value === "") return;
    const p = PERFILES_FAMILIA[Number(selPerfil.value)];
    fondo.querySelector("#ff-nombre").value = p.nombre;
    fondo.querySelector("#ff-emoji").value = p.emoji;
    fondo.querySelector("#ff-mascotas").value = p.mascotas || "";
    pintarMiembros(p.miembros.map((x) => ({ ...x })));
    pintarGastos(p.gastosFijos.map((x) => ({ ...x })));
    // Deducir vivienda y vehículos del perfil (hipoteca → propia, etc.).
    const pat = inferirPatrimonio(p);
    fondo.querySelector("#ff-vivienda").value = pat.vivienda;
    fondo.querySelectorAll(".ff-vehiculo").forEach((chk) => { chk.checked = pat.vehiculos.includes(chk.value); });
  });

  fondo.querySelector("#ff-add-miembro").addEventListener("click", () => {
    const lista = leerMiembros(); lista.push({ nombre: "", edad: "", rol: "", ingresos: 0 }); pintarMiembros(lista);
  });
  fondo.querySelector("#ff-add-gasto").addEventListener("click", () => {
    const lista = leerGastos(); lista.push({ concepto: "", importe: 0 }); pintarGastos(lista);
  });
  fondo.querySelector("#ff-cancelar").addEventListener("click", () => fondo.remove());

  fondo.querySelector("#ff-guardar").addEventListener("click", async () => {
    const nombre = fondo.querySelector("#ff-nombre").value.trim();
    const miembros = leerMiembros().filter((x) => x.nombre);
    const gastos = leerGastos().filter((x) => x.concepto);
    if (!nombre || !miembros.length || !gastos.length) {
      aviso("Hacen falta nombre, al menos un miembro y al menos un gasto.", "error");
      return;
    }
    const ingresos = miembros.reduce((s, x) => s + x.ingresos, 0);
    const dificultad = fondo.querySelector("#ff-dificultad").value;
    const datos = {
      nombre: nombre,
      emoji: fondo.querySelector("#ff-emoji").value.trim() || "🏠",
      dificultad: dificultad,
      alumnos: fondo.querySelector("#ff-alumnos").value.trim(),
      mascotas: fondo.querySelector("#ff-mascotas").value.trim(),
      vivienda: fondo.querySelector("#ff-vivienda").value,
      vehiculos: Array.from(fondo.querySelectorAll(".ff-vehiculo:checked")).map((x) => x.value),
      miembros: miembros,
      gastosFijos: gastos,
      ingresosMensuales: ingresos,
    };

    if (existente) {
      await updateDoc(doc(db, "ecoFamilias", existente.codigo), datos);
      Object.assign(existente, datos);
      aviso("Familia actualizada.", "exito");
    } else {
      const codigo = generarCodigo();
      const nueva = {
        ...datos,
        partidaId: partida.id,
        teacherId: docente.uid,
        publicId: idAleatorio(),
        ahorros: CONFIG_JUEGO.ahorroInicial,
        estrellas: 0, alertas: 0, alertasSeguidas: 0, corazones: 0,
        insignias: [],
        retos: sortearRetos(dificultad),
        prestamoBanco: null, cuentaAhorro: null, negocio: null, meta: null,
        planRescate: null,
        activo: true,
        authUid: null,
        creadoEn: serverTimestamp(),
      };
      await setDoc(doc(db, "ecoFamilias", codigo), nueva);
      familias.push({ ...nueva, codigo: codigo });
      aviso("Familia creada. Código: " + codigo, "exito");
    }
    fondo.remove();
    pintarPartida();
  });
}

function verFamilia(codigo) {
  const f = familias.find((x) => x.codigo === codigo);
  const susMeses = meses.filter((x) => x.familiaCodigo === codigo).sort((a, b) => a.mes - b.mes);
  const fondo = document.createElement("div");
  fondo.className = "modal-fondo";
  fondo.innerHTML = '<div class="modal-caja" style="max-width:720px;">' +
    "<h3>" + f.emoji + " " + escapaHtml(f.nombre) + " — <code>" + f.codigo + "</code></h3>" +
    "<p>Ahorros: <strong>" + euros(f.ahorros) + "</strong> · ⭐ " + (f.estrellas || 0) + " · ❤️ " + (f.corazones || 0) +
    " · ⚠️ " + (f.alertas || 0) + "</p>" +
    "<p>🎯 " + (f.retos || []).map((r) => "<strong>" + r.meses + "</strong>: " + escapaHtml(r.descripcion) +
      " (" + (r.importe >= 0 ? "+" : "") + r.importe + " €" + (r.recurrente ? "/mes" : "") + ")").join(" · ") + "</p>" +
    (f.prestamoBanco && f.prestamoBanco.activo
      ? "<p>💳 Debe al banco " + euros((f.prestamoBanco.total || f.prestamoBanco.importe) - (f.prestamoBanco.devuelto || 0)) +
        " con intereses (límite: " + NOMBRES_MES[f.prestamoBanco.mesLimite] + ")</p>" : "") +
    (f.cuentaAhorro && f.cuentaAhorro.activa ? "<p>🐷 Cuenta de ahorro: " + euros(f.cuentaAhorro.saldo) + "</p>" : "") +
    (f.negocio && f.negocio.activo ? "<p>🚀 " + f.negocio.emoji + " " + escapaHtml(f.negocio.nombre) +
      " (balance " + euros(f.negocio.totalGanado || 0) + ")</p>" : "") +
    (susMeses.length
      ? '<div class="tabla-envoltura"><table><thead><tr><th>Mes</th><th>Saldo</th><th>Ahorros</th><th>ISE</th><th>Reflexión</th></tr></thead><tbody>' +
        susMeses.map((r) => "<tr><td>" + NOMBRES_MES[r.mes] + "</td><td>" + euros(r.saldoMes) + "</td><td>" +
          euros(r.ahorroTotal) + "</td><td>" + (r.ise || "—") + "</td><td style='font-size:0.85rem;'>" +
          escapaHtml((r.reflexion || "").slice(0, 140)) + "</td></tr>").join("") + "</tbody></table></div>"
      : "<p>Aún sin meses jugados.</p>") +
    '<div class="modal-botones"><button class="btn btn-principal" id="vf-cerrar">Cerrar</button></div></div>';
  document.body.appendChild(fondo);
  fondo.querySelector("#vf-cerrar").addEventListener("click", () => fondo.remove());
}

// ============================================================
//  EVENTOS DE LA LOCALIDAD
// ============================================================

function pintarEventos() {
  const c = $("subvista-eventos");
  let html = '<div class="tarjeta"><h3>🎡 Eventos del año en ' + escapaHtml(partida.localidad || "vuestra localidad") + "</h3>" +
    "<p>Se sortean cada mes para las familias. Añade los de tu pueblo o ciudad: su feria, su romería, sus fiestas.</p>" +
    '<button class="btn btn-principal btn-mini" id="btn-nuevo-evento">➕ Añadir evento</button></div>';

  html += '<div class="rejilla">' + eventos
    .sort((a, b) => Math.min(...(a.meses || [13])) - Math.min(...(b.meses || [13])))
    .map((ev) =>
      '<div class="tarjeta" style="margin:0;' + (ev.activo === false ? " opacity:0.45;" : "") + '">' +
      "<h3>" + ev.emoji + " " + escapaHtml(ev.titulo) + "</h3>" +
      "<p style='font-size:0.88rem;'>" + escapaHtml(ev.descripcion || "") + "</p>" +
      "<p><span class='chip chip-azul'>" + (ev.meses || []).map((mm) => NOMBRES_MES[mm].slice(0, 3)).join(", ") + "</span> " +
      "<span class='chip " + (ev.tipo.startsWith("ingreso") ? "chip-verde" : "chip-rojo") + "'>" +
      (ev.tipo === "gasto_fijo" ? "Gasto obligatorio" : ev.tipo === "gasto_opcional" ? "Gasto opcional" :
        ev.tipo === "ingreso_fijo" ? "Ingreso seguro" : "Ingreso opcional") + "</span> " +
      "<span class='chip'>" + ev.importeMin + "–" + ev.importeMax + " €</span> " +
      "<span class='chip chip-morado'>" + (ev.probabilidad == null ? 100 : ev.probabilidad) + "%</span></p>" +
      '<div style="display:flex; gap:6px;">' +
      '<button class="btn btn-mini btn-secundario" data-editar-evento="' + ev.id + '">Editar</button>' +
      '<button class="btn btn-mini ' + (ev.activo === false ? "btn-exito" : "btn-secundario") + '" data-alternar-evento="' + ev.id + '">' +
      (ev.activo === false ? "Activar" : "Desactivar") + "</button>" +
      '<button class="btn btn-mini btn-peligro" data-borrar-evento="' + ev.id + '">✕</button></div></div>'
    ).join("") + "</div>";

  c.innerHTML = html;
  $("btn-nuevo-evento").addEventListener("click", () => formularioEvento(null));
  c.querySelectorAll("[data-editar-evento]").forEach((b) => b.addEventListener("click", () =>
    formularioEvento(eventos.find((x) => x.id === b.dataset.editarEvento))));
  c.querySelectorAll("[data-alternar-evento]").forEach((b) => b.addEventListener("click", async () => {
    const ev = eventos.find((x) => x.id === b.dataset.alternarEvento);
    const nuevo = ev.activo === false;
    await updateDoc(doc(db, "ecoEventos", ev.id), { activo: nuevo });
    ev.activo = nuevo;
    pintarEventos();
  }));
  c.querySelectorAll("[data-borrar-evento]").forEach((b) => b.addEventListener("click", async () => {
    const ev = eventos.find((x) => x.id === b.dataset.borrarEvento);
    const ok = await confirmar("¿Borrar el evento <strong>" + escapaHtml(ev.titulo) + "</strong>?", "Borrar");
    if (!ok) return;
    await deleteDoc(doc(db, "ecoEventos", ev.id));
    eventos = eventos.filter((x) => x.id !== ev.id);
    pintarEventos();
  }));
}

function formularioEvento(existente) {
  const ev = existente || {
    titulo: "", emoji: "🎉", descripcion: "", meses: [], tipo: "gasto_opcional",
    importeMin: 20, importeMax: 100, probabilidad: 100,
  };
  const fondo = document.createElement("div");
  fondo.className = "modal-fondo";
  fondo.innerHTML = '<div class="modal-caja"><h3>' + (existente ? "✏️ Editar evento" : "➕ Nuevo evento") + "</h3>" +
    '<div class="fila-campos">' +
    '<div class="campo"><label>Título</label><input id="fe-titulo" value="' + escapaHtml(ev.titulo) + '"></div>' +
    '<div class="campo" style="max-width:80px;"><label>Emoji</label><input id="fe-emoji" value="' + ev.emoji + '"></div></div>' +
    '<div class="campo"><label>Descripción</label><input id="fe-descripcion" value="' + escapaHtml(ev.descripcion || "") + '"></div>' +
    '<div class="campo"><label>Meses en los que puede pasar</label><div style="display:flex; flex-wrap:wrap; gap:6px;">' +
    Array.from({ length: 12 }, (_, i) => i + 1).map((mm) =>
      '<label style="display:flex; gap:4px; align-items:center; font-weight:400;"><input type="checkbox" class="fe-mes" value="' + mm +
      '" style="width:auto;"' + ((ev.meses || []).includes(mm) ? " checked" : "") + ">" + NOMBRES_MES[mm].slice(0, 3) + "</label>"
    ).join("") + "</div></div>" +
    '<div class="fila-campos">' +
    '<div class="campo"><label>Tipo</label><select id="fe-tipo">' +
    ["gasto_fijo|Gasto obligatorio", "gasto_opcional|Gasto opcional", "ingreso_fijo|Ingreso seguro", "ingreso_opcional|Ingreso opcional"]
      .map((par) => {
        const [v, t] = par.split("|");
        return '<option value="' + v + '"' + (ev.tipo === v ? " selected" : "") + ">" + t + "</option>";
      }).join("") + "</select></div>" +
    '<div class="campo"><label>€ mínimo</label><input type="number" id="fe-min" value="' + ev.importeMin + '"></div>' +
    '<div class="campo"><label>€ máximo</label><input type="number" id="fe-max" value="' + ev.importeMax + '"></div>' +
    '<div class="campo"><label>Probabilidad %</label><input type="number" id="fe-prob" min="1" max="100" value="' + (ev.probabilidad == null ? 100 : ev.probabilidad) + '"></div>' +
    "</div>" +
    '<div class="modal-botones"><button class="btn btn-secundario" id="fe-cancelar">Cancelar</button>' +
    '<button class="btn btn-principal" id="fe-guardar">Guardar</button></div></div>';
  document.body.appendChild(fondo);
  fondo.querySelector("#fe-cancelar").addEventListener("click", () => fondo.remove());
  fondo.querySelector("#fe-guardar").addEventListener("click", async () => {
    const mesesSel = Array.from(fondo.querySelectorAll(".fe-mes:checked")).map((x) => Number(x.value));
    const datos = {
      titulo: fondo.querySelector("#fe-titulo").value.trim(),
      emoji: fondo.querySelector("#fe-emoji").value.trim() || "📅",
      descripcion: fondo.querySelector("#fe-descripcion").value.trim(),
      meses: mesesSel,
      tipo: fondo.querySelector("#fe-tipo").value,
      importeMin: Number(fondo.querySelector("#fe-min").value || 0),
      importeMax: Number(fondo.querySelector("#fe-max").value || 0),
      probabilidad: Number(fondo.querySelector("#fe-prob").value || 100),
    };
    if (!datos.titulo || !mesesSel.length) { aviso("Hacen falta título y al menos un mes.", "error"); return; }
    if (existente) {
      await updateDoc(doc(db, "ecoEventos", existente.id), datos);
      Object.assign(existente, datos);
    } else {
      const ref = await addDoc(collection(db, "ecoEventos"), {
        ...datos, partidaId: partida.id, teacherId: docente.uid, activo: true,
      });
      eventos.push({ id: ref.id, partidaId: partida.id, teacherId: docente.uid, activo: true, ...datos });
    }
    fondo.remove();
    aviso("Evento guardado.", "exito");
    pintarEventos();
  });
}

// ============================================================
//  ANÁLISIS MENSUAL
// ============================================================

function pintarAnalisis() {
  const c = $("subvista-analisis");
  const analisis = partida.analisis || {};
  const mesesCerrados = Object.keys(analisis).map(Number).sort((a, b) => b - a);

  let html = '<div class="tarjeta"><h3>📊 Evolución de la clase</h3>' +
    '<div class="grafica-caja"><canvas id="grafica-clase"></canvas></div>' +
    '<div class="leyenda">' + familias.map((f, i) =>
      '<span class="item"><span class="punto" style="background:' + PALETA_FAMILIAS[i % PALETA_FAMILIAS.length] + ';"></span>' +
      f.emoji + " " + escapaHtml(f.nombre) + "</span>").join("") + "</div></div>";

  if (!mesesCerrados.length) {
    html += '<div class="tarjeta">El análisis de cada mes aparecerá aquí al cerrarlo.</div>';
  } else {
    for (const mm of mesesCerrados) {
      html += '<div class="tarjeta"><h3>' + NOMBRES_MES[mm] + "</h3><p style='white-space:pre-line;'>" +
        escapaHtml(analisis[String(mm)]) + "</p></div>";
    }
  }
  c.innerHTML = html;

  const ultimoMes = Math.max(1, partida.mesActual || 1);
  const etiquetas = Array.from({ length: ultimoMes }, (_, i) => NOMBRES_MES[i + 1].slice(0, 3));
  const series = familias.map((f, i) => ({
    nombre: f.nombre,
    color: PALETA_FAMILIAS[i % PALETA_FAMILIAS.length],
    valores: Array.from({ length: ultimoMes }, (_, idx) => {
      const r = meses.find((x) => x.familiaCodigo === f.codigo && x.mes === idx + 1);
      return r ? r.ahorroTotal : null;
    }),
  }));
  requestAnimationFrame(() => {
    const canvas = $("grafica-clase");
    if (canvas && series.length) graficaLineas(canvas, series, etiquetas);
  });
}

// ============================================================
//  INFORME FINAL E IMPRESIÓN
// ============================================================

function pintarInforme() {
  const c = $("subvista-informe");
  let html = '<div class="tarjeta no-imprimir"><h3>📄 Informe final</h3>' +
    "<p>Un resumen imprimible por familia con su año completo, sus reflexiones y su diploma. " +
    "Úsalo cuando la partida esté terminada (o cuando quieras un parcial).</p>" +
    '<button class="btn btn-principal" id="btn-imprimir-informe">🖨️ Imprimir informe y diplomas</button></div>';

  html += '<div id="zona-informe">';
  for (const f of familias) {
    const susMeses = meses.filter((x) => x.familiaCodigo === f.codigo && x.completado).sort((a, b) => a.mes - b.mes);
    const estrellas = f.estrellas || 0;
    html += '<div class="tarjeta salto-pagina"><h2>' + f.emoji + " " + escapaHtml(f.nombre) + "</h2>" +
      (f.alumnos ? "<p><strong>Jugado por:</strong> " + escapaHtml(f.alumnos) + "</p>" : "") +
      '<div class="panel-cifras">' +
      cifraHtml(euros(f.ahorros), "Ahorros finales", f.ahorros >= 0 ? "positiva" : "negativa") +
      cifraHtml("⭐ " + estrellas, "Estrellas") +
      cifraHtml("❤️ " + (f.corazones || 0), "Corazones") +
      cifraHtml("⚠️ " + (f.alertas || 0), "Alertas") +
      "</div>" +
      (f.meta ? "<p>🎯 Meta: " + f.meta.emoji + " " + escapaHtml(f.meta.titulo) +
        (f.meta.cumplida ? " — ✅ ¡CUMPLIDA!" : " — no alcanzada (" + euros(Math.max(0, f.ahorros)) + " de " + euros(f.meta.importe) + ")") + "</p>" : "") +
      (f.negocio ? "<p>🚀 Negocio: " + f.negocio.emoji + " " + escapaHtml(f.negocio.nombre) +
        " (balance total: " + euros(f.negocio.totalGanado || 0) + ")</p>" : "") +
      ((f.insignias || []).length
        ? "<p>🎖️ Insignias: " + f.insignias.map((id) => {
            const ins = INSIGNIAS.find((x) => x.id === id);
            return ins ? ins.emoji + " " + ins.nombre : id;
          }).join(" · ") + "</p>" : "") +
      (susMeses.length
        ? '<div class="tabla-envoltura"><table><thead><tr><th>Mes</th><th>Saldo</th><th>Ahorros</th><th>Ocio</th><th>ISE</th></tr></thead><tbody>' +
          susMeses.map((r) => "<tr><td>" + NOMBRES_MES[r.mes] + "</td><td>" + euros(r.saldoMes) + "</td><td>" +
            euros(r.ahorroTotal) + "</td><td>" + euros(r.ocio) + "</td><td>" + (r.ise || "—") + "</td></tr>").join("") +
          "</tbody></table></div>" : "") +
      (susMeses.some((r) => r.reflexion)
        ? "<h3>Sus reflexiones</h3>" + susMeses.filter((r) => r.reflexion).map((r) =>
            "<p><strong>" + NOMBRES_MES[r.mes] + (r.premioReflexion ? " 🏅" : "") + ":</strong> " +
            escapaHtml(r.reflexion) + "</p>").join("") : "") +
      // Diploma.
      '<div class="tarjeta" style="text-align:center; border:3px double var(--primario); margin-top:14px;">' +
      '<div style="font-size:2.4rem;">🎓</div><h2>Diploma de Economía Familiar</h2>' +
      "<p>Se otorga a la <strong>" + f.emoji + " " + escapaHtml(f.nombre) + "</strong>" +
      (f.alumnos ? " (" + escapaHtml(f.alumnos) + ")" : "") + "</p>" +
      "<p>por haber gestionado la economía de su hogar durante un año entero<br>en la partida <strong>" +
      escapaHtml(partida.nombre) + "</strong>" + (partida.localidad ? " · " + escapaHtml(partida.localidad) : "") + "</p>" +
      "<p style='font-size:1.3rem;'>" + "⭐".repeat(Math.min(12, estrellas)) + "</p></div>" +
      "</div>";
  }
  html += "</div>";
  c.innerHTML = html;
  $("btn-imprimir-informe").addEventListener("click", () => window.print());
}
