// ============================================================
// Economía Familiar 2.0 — pantalla de la familia.
// Entrada con código (mismo esquema que los alumnos de Aprende y
// Repasa), panel de la familia y el flujo del mes por pasos:
// ingresos → gastos → tarjeta → reto → eventos → banco → negocio
// → solidaridad → decisión de ocio/ahorro → reflexión → resumen.
// El borrador del mes se guarda en localStorage para que un
// recargón de página no cambie las tiradas de azar.
// ============================================================

import {
  doc, getDoc, setDoc, updateDoc, addDoc, collection, query, where, getDocs, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { db, auth } from "./firebase-init.js";
import {
  METAS_AHORRO, INSIGNIAS, NEGOCIOS, ESTRATEGIAS_NEGOCIO, CONFIG_JUEGO, NOMBRES_MES,
} from "./catalogos.js";
import {
  euros, redondear, sacarTarjeta, retoDelMes, eventosDelMes, resultadoNegocio,
  gastosFijosDelMes, ingresosDelMes, calcularISE, premiosDelMes, insigniasNuevas, idAleatorio,
} from "./motor.js";
import {
  CLAVE_SESION_FAMILIA, guardarSesion, cargarSesion, borrarSesion,
  aviso, confirmar, graficaLineas, el, escapaHtml,
} from "./comun.js";

// ---------- estado global de la página ----------

let sesion = null;      // { codigo }
let familia = null;     // datos del doc ecoFamilias (+ codigo)
let partida = null;     // datos del doc ecoPartidas (+ id)
let eventos = [];       // ecoEventos de la partida
let marcador = null;    // ecoMarcador/{partidaId}
let historial = [];     // ecoMeses de esta familia, ordenados por mes
let prestamos = [];     // ecoPrestamosFamilias de la partida
let m = null;           // borrador del mes en curso (wizard)
let pasoActual = 0;

const $ = el;

// ---------- arranque ----------

document.addEventListener("DOMContentLoaded", async () => {
  $("form-login").addEventListener("submit", entrarConCodigo);
  $("btn-salir").addEventListener("click", salir);
  document.querySelectorAll(".pestana").forEach((p) => {
    p.addEventListener("click", () => {
      document.querySelectorAll(".pestana").forEach((x) => x.classList.remove("activa"));
      p.classList.add("activa");
      ["inicio", "historial", "ranking"].forEach((v) => {
        $("subvista-" + v).classList.toggle("activa", v === p.dataset.vista);
      });
    });
  });

  sesion = cargarSesion(CLAVE_SESION_FAMILIA);
  if (sesion && sesion.codigo) {
    mostrarVista("login");
    $("error-login").textContent = "Entrando…";
    try {
      await reclamarCodigo(sesion.codigo);
      await cargarTodo();
      mostrarPanel();
    } catch (e) {
      $("error-login").textContent = "";
      borrarSesion(CLAVE_SESION_FAMILIA);
      mostrarVista("login");
    }
  } else {
    mostrarVista("login");
  }
});

function mostrarVista(nombre) {
  ["login", "panel", "mes"].forEach((v) => {
    $("vista-" + v).classList.toggle("activa", v === nombre);
  });
  $("btn-salir").style.display = nombre === "login" ? "none" : "";
}

async function entrarConCodigo(e) {
  e.preventDefault();
  const codigo = $("campo-codigo").value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const err = $("error-login");
  err.textContent = "";
  if (codigo.length < 4) { err.textContent = "Escribid el código completo."; return; }
  err.textContent = "Comprobando…";
  try {
    await reclamarCodigo(codigo);
    sesion = { codigo: codigo };
    guardarSesion(CLAVE_SESION_FAMILIA, sesion);
    await cargarTodo();
    mostrarPanel();
  } catch (ex) {
    if (ex && (ex.code === "permission-denied" || String(ex.message || "").includes("insufficient permissions"))) {
      err.textContent = "La app aún no está activada del todo: falta publicar las reglas de la base de datos. Avisad a vuestro profesor o profesora.";
    } else {
      err.textContent = ex.message || "No se ha podido entrar con ese código.";
    }
  }
}

async function reclamarCodigo(codigo) {
  if (!auth.currentUser) await signInAnonymously(auth);
  const ref = doc(db, "ecoFamilias", codigo);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Ese código no existe. Revisadlo con vuestro profe.");
  const datos = snap.data();
  if (datos.activo === false) throw new Error("Este código está desactivado. Hablad con vuestro profe.");
  await updateDoc(ref, { authUid: auth.currentUser.uid, lastLoginAt: serverTimestamp() });
  familia = { ...datos, codigo: codigo, authUid: auth.currentUser.uid };
}

function salir() {
  borrarSesion(CLAVE_SESION_FAMILIA);
  window.location.href = "index.html";
}

// ---------- carga de datos ----------

async function cargarTodo() {
  const pid = familia.partidaId;
  const [pSnap, evSnap, marcaSnap, mesesSnap, prestamosSnap] = await Promise.all([
    getDoc(doc(db, "ecoPartidas", pid)),
    getDocs(query(collection(db, "ecoEventos"), where("partidaId", "==", pid))),
    getDoc(doc(db, "ecoMarcador", pid)),
    getDocs(query(collection(db, "ecoMeses"),
      where("partidaId", "==", pid), where("familiaCodigo", "==", familia.codigo))),
    getDocs(query(collection(db, "ecoPrestamosFamilias"), where("partidaId", "==", pid))),
  ]);
  partida = pSnap.exists() ? { id: pid, ...pSnap.data() } : null;
  eventos = evSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  marcador = marcaSnap.exists() ? marcaSnap.data() : { familias: {} };
  historial = mesesSnap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => a.mes - b.mes);
  prestamos = prestamosSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function recargarFamilia() {
  const snap = await getDoc(doc(db, "ecoFamilias", familia.codigo));
  familia = { ...snap.data(), codigo: familia.codigo };
}

// ============================================================
//  PANEL DE LA FAMILIA
// ============================================================

function mostrarPanel() {
  mostrarVista("panel");
  pintarCabeceraFamilia();
  pintarInicio();
  pintarHistorial();
  pintarRanking();
}

function pintarCabeceraFamilia() {
  $("titulo-cabecera").textContent = familia.emoji + " " + familia.nombre;
  const ise = historial.length ? historial[historial.length - 1].ise : null;
  $("panel-familia-cabecera").innerHTML =
    '<div class="panel-cifras">' +
    cifra(euros(familia.ahorros), "Ahorros", familia.ahorros >= 0 ? "positiva" : "negativa") +
    cifra("⭐ " + (familia.estrellas || 0), "Estrellas") +
    cifra("❤️ " + (familia.corazones || 0), "Corazones") +
    cifra("⚠️ " + (familia.alertas || 0), "Alertas") +
    cifra(ise == null ? "—" : ise + "/100", "Salud emocional") +
    "</div>";
}

function cifra(valor, titulo, clase) {
  return '<div class="cifra ' + (clase || "") + '"><div class="valor">' + valor +
    '</div><div class="titulo">' + titulo + "</div></div>";
}

function pintarInicio() {
  const c = $("subvista-inicio");
  let html = "";

  if (!partida) {
    c.innerHTML = '<div class="tarjeta">No se encuentra vuestra partida. Avisad a vuestro profe.</div>';
    return;
  }

  // Aviso de plan de rescate.
  if (familia.planRescate && familia.planRescate.activo) {
    html += '<div class="tarjeta" style="border:2px solid var(--peligro); background:#fdf5f5;">' +
      "<h3>🚨 Plan de rescate</h3>" +
      "<p>No devolvisteis el préstamo al banco a tiempo. Durante <strong>" +
      familia.planRescate.mesesRestantes + " meses</strong> tenéis que apretaros el cinturón: " +
      "ocio máximo del " + CONFIG_JUEGO.ocioMaxRescate + "% de los ingresos, sin pedir préstamos y sin montar negocios. " +
      "Si al terminar estáis en positivo, ¡saldréis adelante y ganaréis la insignia La gran remontada!</p></div>";
  }

  // Préstamos solidarios pendientes de aceptar o cobrar.
  html += htmlAvisosPrestamos();

  // Estado del mes.
  const mesActual = partida.mesActual || 0;
  const jugado = historial.some((h) => h.mes === mesActual && h.completado);
  if (partida.estado === "terminada") {
    html += '<div class="tarjeta destacada"><h3>🎉 ¡El juego ha terminado!</h3>' +
      "<p>Habéis vivido un año entero gestionando vuestra economía. Mirad vuestro historial y esperad al gran repaso en clase.</p></div>";
  } else if (mesActual === 0 || partida.estado === "preparacion") {
    html += '<div class="tarjeta"><h3>⏳ La partida aún no ha empezado</h3>' +
      "<p>Vuestro profe abrirá el primer mes en clase. ¡Preparaos!</p></div>";
  } else if (jugado) {
    html += '<div class="tarjeta"><h3>✅ ' + NOMBRES_MES[mesActual] + " completado</h3>" +
      "<p>Ya habéis tomado vuestras decisiones de este mes. Cuando todas las familias terminen, el profe pasará al mes siguiente.</p></div>";
  } else if (!partida.mesAbierto) {
    html += '<div class="tarjeta"><h3>🔒 El mes está cerrado</h3>' +
      "<p>Esperad a que vuestro profe abra " + NOMBRES_MES[mesActual] + " en clase.</p></div>";
  } else {
    html += '<div class="tarjeta destacada" style="text-align:center;">' +
      "<h3>📅 ¡" + NOMBRES_MES[mesActual] + " os espera!</h3>" +
      "<p>Toca gestionar el mes: cobrar, pagar y decidir con cabeza.</p>" +
      '<button class="btn btn-principal btn-grande" id="btn-jugar-mes">▶️ Jugar ' + NOMBRES_MES[mesActual] + "</button></div>";
  }

  // Meta de ahorro.
  if (!familia.meta) {
    html += '<div class="tarjeta"><h3>🎯 Elegid vuestra meta de ahorro</h3>' +
      "<p>Toda familia necesita un sueño. Elegid una meta: si la alcanzáis, ganaréis la insignia 🏆.</p>" +
      '<div class="rejilla">' +
      METAS_AHORRO.map((meta) =>
        '<div class="tarjeta" style="margin:0;"><div style="font-size:1.6rem;">' + meta.emoji + "</div>" +
        "<strong>" + meta.titulo + "</strong><p style='font-size:0.9rem;'>" + meta.descripcion + "</p>" +
        "<p><strong>" + euros(meta.importe) + "</strong></p>" +
        '<button class="btn btn-azul btn-mini" data-meta="' + meta.id + '">Esta es la nuestra</button></div>'
      ).join("") + "</div></div>";
  } else {
    const progreso = Math.min(100, Math.round(100 * Math.max(0, familia.ahorros) / familia.meta.importe));
    html += '<div class="tarjeta"><h3>🎯 Meta: ' + familia.meta.emoji + " " + escapaHtml(familia.meta.titulo) +
      (familia.meta.cumplida ? " — ¡CUMPLIDA! 🏆" : "") + "</h3>" +
      '<div style="background:var(--gris-borde); border-radius:99px; height:20px; overflow:hidden;">' +
      '<div style="width:' + progreso + '%; height:100%; background:var(--exito); transition:width 0.6s;"></div></div>' +
      "<p style='margin-top:6px;'>" + euros(Math.max(0, familia.ahorros)) + " de " + euros(familia.meta.importe) +
      " (" + progreso + "%)</p></div>";
  }

  // La familia: miembros, gastos, banco, negocio, insignias.
  html += '<div class="rejilla-2">';
  html += '<div class="tarjeta" style="margin:0;"><h3>👪 Nuestra familia</h3><ul>' +
    (familia.miembros || []).map((mi) =>
      "<li><strong>" + escapaHtml(mi.nombre) + "</strong> (" + mi.edad + " años) — " + escapaHtml(mi.rol) +
      (mi.ingresos ? " · " + euros(mi.ingresos) + "/mes" : "") + "</li>").join("") +
    (familia.mascotas ? "<li>🐾 " + escapaHtml(familia.mascotas) + "</li>" : "") +
    "</ul><p><strong>Ingresos: " + euros(familia.ingresosMensuales) + "/mes</strong></p>" +
    (familia.alumnos ? "<p style='color:var(--gris-texto);'>Jugadores: " + escapaHtml(familia.alumnos) + "</p>" : "") +
    "</div>";

  html += '<div class="tarjeta" style="margin:0;"><h3>🧾 Gastos fijos</h3><ul>' +
    (familia.gastosFijos || []).map((g) => "<li>" + escapaHtml(g.concepto) + ": " + euros(g.importe) + "</li>").join("") +
    "</ul><p><strong>Total: " + euros((familia.gastosFijos || []).reduce((s, g) => s + g.importe, 0)) + "/mes</strong>" +
    (partida.ajustes && partida.ajustes.inflacion ? " <span class='chip chip-naranja'>+" + CONFIG_JUEGO.inflacionMensual + "% de inflación al mes</span>" : "") +
    "</p></div>";

  // Banco.
  let bancoHtml = "";
  if (familia.prestamoBanco && familia.prestamoBanco.activo) {
    const p = familia.prestamoBanco;
    bancoHtml += "<p>💳 Préstamo pendiente: <strong>" + euros(p.importe - (p.devuelto || 0)) +
      "</strong> (devolver antes de " + NOMBRES_MES[p.mesLimite] + ")</p>";
  }
  if (familia.cuentaAhorro && familia.cuentaAhorro.activa) {
    bancoHtml += "<p>🏦 Cuenta de ahorro: <strong>" + euros(familia.cuentaAhorro.saldo) +
      "</strong> al " + (familia.cuentaAhorro.interes || CONFIG_JUEGO.interesCuentaAhorro) + "% mensual</p>";
  }
  if (!bancoHtml) bancoHtml = "<p>Sin préstamos ni cuenta de ahorro. El banco os espera durante el mes.</p>";
  html += '<div class="tarjeta" style="margin:0;"><h3>🏦 Banco</h3>' + bancoHtml + "</div>";

  // Negocio.
  let negHtml = "";
  if (familia.negocio && familia.negocio.activo) {
    negHtml = "<p>" + familia.negocio.emoji + " <strong>" + escapaHtml(familia.negocio.nombre) + "</strong></p>" +
      "<p>Abierto desde " + NOMBRES_MES[familia.negocio.mesInicio] + " · Balance total: " +
      euros(familia.negocio.totalGanado || 0) + "</p>";
  } else {
    negHtml = "<p>Todavía no tenéis negocio. Si ahorráis lo suficiente, podréis montar uno durante el mes.</p>";
  }
  html += '<div class="tarjeta" style="margin:0;"><h3>🚀 Nuestro negocio</h3>' + negHtml + "</div>";
  html += "</div>";

  // Insignias.
  html += '<div class="tarjeta"><h3>🎖️ Insignias</h3><div class="leyenda">' +
    INSIGNIAS.map((i) => {
      const tiene = (familia.insignias || []).includes(i.id);
      return '<span class="chip ' + (tiene ? "chip-verde" : "") + '" title="' + i.descripcion + '"' +
        (tiene ? "" : ' style="opacity:0.35;"') + ">" + i.emoji + " " + i.nombre + "</span>";
    }).join("") + "</div></div>";

  c.innerHTML = html;

  const btnJugar = $("btn-jugar-mes");
  if (btnJugar) btnJugar.addEventListener("click", empezarMes);
  c.querySelectorAll("[data-meta]").forEach((b) => {
    b.addEventListener("click", async () => {
      const meta = METAS_AHORRO.find((x) => x.id === b.dataset.meta);
      const ok = await confirmar("¿Elegís la meta <strong>" + meta.emoji + " " + meta.titulo +
        "</strong> (" + euros(meta.importe) + ")? No se puede cambiar después.", "¡Sí, a por ella!");
      if (!ok) return;
      await updateDoc(doc(db, "ecoFamilias", familia.codigo), {
        meta: { id: meta.id, titulo: meta.titulo, emoji: meta.emoji, importe: meta.importe, cumplida: false },
      });
      await recargarFamilia();
      aviso("¡Meta elegida! A ahorrar 💪", "exito");
      pintarInicio();
    });
  });
  c.querySelectorAll("[data-aceptar-prestamo]").forEach((b) => b.addEventListener("click", () => aceptarPrestamo(b.dataset.aceptarPrestamo)));
  c.querySelectorAll("[data-cobrar-prestamo]").forEach((b) => b.addEventListener("click", () => cobrarPrestamo(b.dataset.cobrarPrestamo)));
}

// ---------- préstamos solidarios: aceptar y cobrar ----------

function htmlAvisosPrestamos() {
  let html = "";
  const pendientesAceptar = prestamos.filter((p) => p.aPublicId === familia.publicId && p.estado === "pendiente");
  for (const p of pendientesAceptar) {
    html += '<div class="tarjeta" style="border:2px solid var(--exito); background:#f4fcf6;">' +
      "<h3>❤️ ¡Os llega ayuda!</h3><p><strong>" + escapaHtml(p.deNombre) + "</strong> os presta <strong>" +
      euros(p.importe) + "</strong>. Tendréis que devolverlo antes de " + NOMBRES_MES[p.mesLimite] + ".</p>" +
      '<button class="btn btn-exito" data-aceptar-prestamo="' + p.id + '">Aceptar el préstamo</button></div>';
  }
  const porCobrar = prestamos.filter((p) => p.dePublicId === familia.publicId && p.estado === "devuelto" && !p.cobrado);
  for (const p of porCobrar) {
    html += '<div class="tarjeta" style="border:2px solid var(--secundario); background:#f5f8fd;">' +
      "<h3>💶 Os han devuelto un préstamo</h3><p><strong>" + escapaHtml(p.aNombre) +
      "</strong> os devuelve <strong>" + euros(p.importe) + "</strong>. ¡Gracias por ayudar!</p>" +
      '<button class="btn btn-azul" data-cobrar-prestamo="' + p.id + '">Recoger el dinero</button></div>';
  }
  return html;
}

async function aceptarPrestamo(id) {
  const p = prestamos.find((x) => x.id === id);
  if (!p) return;
  await updateDoc(doc(db, "ecoPrestamosFamilias", id), { estado: "aceptado" });
  await updateDoc(doc(db, "ecoFamilias", familia.codigo), { ahorros: redondear(familia.ahorros + p.importe) });
  await recargarFamilia();
  const pr = prestamos.find((x) => x.id === id); pr.estado = "aceptado";
  aviso("Préstamo aceptado: +" + euros(p.importe), "exito");
  pintarCabeceraFamilia(); pintarInicio();
}

async function cobrarPrestamo(id) {
  const p = prestamos.find((x) => x.id === id);
  if (!p) return;
  await updateDoc(doc(db, "ecoPrestamosFamilias", id), { cobrado: true });
  await updateDoc(doc(db, "ecoFamilias", familia.codigo), { ahorros: redondear(familia.ahorros + p.importe) });
  await recargarFamilia();
  const pr = prestamos.find((x) => x.id === id); pr.cobrado = true;
  aviso("Habéis recuperado " + euros(p.importe), "exito");
  pintarCabeceraFamilia(); pintarInicio();
}

// ---------- historial ----------

function pintarHistorial() {
  const c = $("subvista-historial");
  if (!historial.length) {
    c.innerHTML = '<div class="tarjeta">Aún no habéis completado ningún mes.</div>';
    return;
  }
  let html = '<div class="tarjeta"><h3>📈 Evolución de los ahorros y la salud emocional</h3>' +
    '<div class="grafica-caja"><canvas id="grafica-familia"></canvas></div>' +
    '<div class="leyenda">' +
    '<span class="item"><span class="punto" style="background:var(--primario);"></span> Ahorros (€)</span>' +
    '<span class="item"><span class="punto" style="background:var(--morado);"></span> Salud emocional (0-100)</span>' +
    "</div></div>";

  html += '<div class="tarjeta"><h3>📒 Mes a mes</h3><div class="tabla-envoltura"><table><thead>' +
    "<tr><th>Mes</th><th>Saldo</th><th>Ahorros</th><th>Ocio</th><th>ISE</th><th>Premios</th><th>Qué pasó</th></tr></thead><tbody>" +
    historial.map((h) => {
      const premios = (h.premios && h.premios.estrella ? "⭐" : "") +
        (h.premios && h.premios.corazon ? "❤️" : "") +
        (h.premios && h.premios.alerta ? "⚠️" : "") +
        (h.premioReflexion ? "🏅" : "");
      const sucesos = [
        h.tarjeta ? h.tarjeta.emoji + " " + h.tarjeta.texto : "",
        h.reto ? "🎯 " + h.reto.descripcion : "",
        h.negocio && h.negocio.importe != null ? "🚀 Negocio: " + euros(h.negocio.importe) : "",
      ].filter(Boolean).join(" · ");
      return "<tr><td><strong>" + NOMBRES_MES[h.mes] + "</strong></td>" +
        "<td style='color:" + ((h.saldoMes || 0) >= 0 ? "var(--exito)" : "var(--peligro)") + ";'>" + euros(h.saldoMes) + "</td>" +
        "<td>" + euros(h.ahorroTotal) + "</td><td>" + euros(h.ocio) + "</td><td>" + (h.ise || "—") + "</td>" +
        "<td>" + premios + "</td><td style='font-size:0.85rem;'>" + escapaHtml(sucesos) + "</td></tr>";
    }).join("") + "</tbody></table></div></div>";

  c.innerHTML = html;

  const etiquetas = historial.map((h) => NOMBRES_MES[h.mes].slice(0, 3));
  requestAnimationFrame(() => {
    graficaLineas($("grafica-familia"), [
      { nombre: "Ahorros", color: "#e07a3f", valores: historial.map((h) => h.ahorroTotal) },
      { nombre: "ISE", color: "#8a5fd6", valores: historial.map((h) => h.ise) },
    ], etiquetas);
  });
}

// ---------- ranking ----------

function pintarRanking() {
  const c = $("subvista-ranking");
  const filas = Object.entries((marcador && marcador.familias) || {})
    .map(([pubId, f]) => ({ pubId: pubId, ...f }))
    .sort((a, b) => (b.ahorros || 0) - (a.ahorros || 0));
  if (!filas.length) {
    c.innerHTML = '<div class="tarjeta">El ranking aparecerá cuando las familias completen su primer mes.</div>';
    return;
  }
  c.innerHTML = '<div class="tarjeta"><h3>🏆 Ranking de la clase</h3><div class="tabla-envoltura"><table><thead>' +
    "<tr><th>#</th><th>Familia</th><th>Ahorros</th><th>⭐</th><th>❤️</th><th>⚠️</th><th>ISE</th></tr></thead><tbody>" +
    filas.map((f, i) => {
      const esMia = f.pubId === familia.publicId;
      return "<tr" + (esMia ? " style='background:#fdf3d8; font-weight:700;'" : "") + "><td>" + (i + 1) + "</td>" +
        "<td>" + f.emoji + " " + escapaHtml(f.nombre) + (f.rescate ? " 🚨" : "") + "</td>" +
        "<td>" + euros(f.ahorros) + "</td><td>" + (f.estrellas || 0) + "</td><td>" + (f.corazones || 0) + "</td>" +
        "<td>" + (f.alertas || 0) + "</td><td>" + (f.ise == null ? "—" : f.ise) + "</td></tr>";
    }).join("") + "</tbody></table></div>" +
    "<p style='color:var(--gris-texto); font-size:0.88rem;'>El dinero no lo es todo: mirad también los corazones y la salud emocional.</p></div>";
}

// ============================================================
//  EL MES, PASO A PASO
// ============================================================

function claveBorrador() {
  return "eco_borrador_" + familia.codigo + "_m" + partida.mesActual;
}

function guardarBorrador() {
  try { localStorage.setItem(claveBorrador(), JSON.stringify({ m: m, paso: pasoActual })); } catch (e) { /* nada */ }
}

function empezarMes() {
  const mes = partida.mesActual;
  const ajustes = partida.ajustes || {};

  // Recuperar borrador si lo hay (mismas tiradas de azar tras recargar).
  let borrador = null;
  try { borrador = JSON.parse(localStorage.getItem(claveBorrador())); } catch (e) { /* nada */ }

  if (borrador && borrador.m && borrador.m.mes === mes) {
    m = borrador.m;
    pasoActual = borrador.paso || 0;
  } else {
    const enRescate = familia.planRescate && familia.planRescate.activo;
    m = {
      mes: mes,
      enRescate: !!enRescate,
      ingresos: ingresosDelMes(familia, mes, ajustes),
      gastosFijos: gastosFijosDelMes(familia, mes, ajustes),
      tarjeta: sacarTarjeta(familia),
      reto: retoDelMes(familia, mes),
      eventos: eventosDelMes(eventos, mes).map((ev) => ({ ...ev, participa: !ev.opcional })),
      banco: { prestamoPedido: 0, prestamoDevuelto: 0, deposito: 0, retirada: 0, abrirCuenta: false },
      negocio: { montado: null, estrategia: null, resultado: null },
      solidaridad: { aPublicId: null, aNombre: null, importe: 0, devoluciones: [] },
      ocio: 0,
      reflexion: "",
    };
    pasoActual = 0;
  }
  guardarBorrador();
  mostrarVista("mes");
  pintarPaso();
}

// Lista de pasos según lo que toque este mes.
function pasosDelMes() {
  const pasos = ["intro", "ingresos", "gastos", "tarjeta"];
  if (m.reto) pasos.push("reto");
  if (m.eventos.length) pasos.push("eventos");
  pasos.push("banco");
  if ((familia.negocio && familia.negocio.activo) || puedeMontarNegocio()) pasos.push("negocio");
  pasos.push("solidaridad", "decision", "reflexion", "resumen");
  return pasos;
}

function puedeMontarNegocio() {
  return !m.enRescate && !(familia.negocio && familia.negocio.activo);
}

// Dinero del mes acumulado hasta el paso actual (caja del mes).
function cajaDelMes() {
  let caja = m.ingresos.total - m.gastosFijos + m.tarjeta.importe;
  if (m.reto) caja += m.reto.importe;
  for (const ev of m.eventos) if (ev.participa) caja += ev.importe;
  caja += m.banco.prestamoPedido - m.banco.prestamoDevuelto - m.banco.deposito + m.banco.retirada;
  if (m.negocio.resultado) caja += m.negocio.resultado.importe;
  caja -= m.solidaridad.importe || 0;
  for (const d of m.solidaridad.devoluciones) caja -= d.importe;
  return redondear(caja);
}

// Cambios directos sobre los ahorros (fuera de la caja del mes).
function ahorrosExtra() {
  return m.negocio.montado ? -m.negocio.montado.coste : 0;
}

function pintarBarraPasos() {
  const pasos = pasosDelMes();
  $("barra-pasos").innerHTML = pasos.map((p, i) =>
    '<div class="paso-punto ' + (i < pasoActual ? "hecho" : i === pasoActual ? "actual" : "") + '"></div>'
  ).join("");
}

function botonesPaso(opciones) {
  const opts = opciones || {};
  return '<div style="display:flex; gap:10px; justify-content:space-between; margin-top:18px;">' +
    (pasoActual > 0 && !opts.sinAtras
      ? '<button class="btn btn-secundario" id="btn-paso-atras">← Atrás</button>'
      : "<span></span>") +
    '<button class="btn btn-principal" id="btn-paso-seguir">' + (opts.texto || "Seguir →") + "</button></div>";
}

function conectarBotonesPaso(alSeguir) {
  const atras = $("btn-paso-atras");
  if (atras) atras.addEventListener("click", () => { pasoActual--; guardarBorrador(); pintarPaso(); });
  $("btn-paso-seguir").addEventListener("click", async () => {
    if (alSeguir && (await alSeguir()) === false) return;
    pasoActual++;
    guardarBorrador();
    pintarPaso();
  });
}

function pintarPaso() {
  pintarBarraPasos();
  const pasos = pasosDelMes();
  const paso = pasos[pasoActual];
  const c = $("contenido-paso");
  const mesNombre = NOMBRES_MES[m.mes];

  // ---------- INTRO ----------
  if (paso === "intro") {
    c.innerHTML = '<div class="tarjeta destacada" style="text-align:center;">' +
      '<div style="font-size:3rem;">📅</div><h2>' + mesNombre + "</h2>" +
      "<p>Empieza un nuevo mes para la " + familia.emoji + " <strong>" + escapaHtml(familia.nombre) + "</strong>.</p>" +
      "<p>Ahorros actuales: <strong>" + euros(familia.ahorros) + "</strong></p>" +
      (m.enRescate ? "<p class='chip chip-rojo'>🚨 Estáis en plan de rescate: mes de máxima prudencia</p>" : "") +
      botonesPaso({ texto: "¡Empezamos!", sinAtras: true }) + "</div>";
    conectarBotonesPaso();
    return;
  }

  // ---------- INGRESOS ----------
  if (paso === "ingresos") {
    c.innerHTML = '<div class="tarjeta"><h2>💶 Ingresos de ' + mesNombre + "</h2>" +
      "<ul>" + (familia.miembros || []).filter((x) => x.ingresos > 0).map((x) =>
        "<li>" + escapaHtml(x.nombre) + " (" + escapaHtml(x.rol) + "): <strong>" + euros(x.ingresos) + "</strong></li>"
      ).join("") + "</ul>" +
      (m.ingresos.pagaExtra > 0
        ? '<div class="tarjeta-sorpresa suerte" style="margin:12px 0;"><div class="emoji-grande">🎉</div>' +
          "<h3>¡Paga extraordinaria!</h3><p>En " + mesNombre + " llega la paga extra: <strong>+" +
          euros(m.ingresos.pagaExtra) + "</strong></p></div>"
        : "") +
      '<p class="importe-grande positivo">Total: +' + euros(m.ingresos.total) + "</p>" +
      botonesPaso() + "</div>";
    conectarBotonesPaso();
    return;
  }

  // ---------- GASTOS FIJOS ----------
  if (paso === "gastos") {
    const base = (familia.gastosFijos || []).reduce((s, g) => s + g.importe, 0);
    const subida = redondear(m.gastosFijos - base);
    c.innerHTML = '<div class="tarjeta"><h2>🧾 Gastos fijos</h2><ul>' +
      (familia.gastosFijos || []).map((g) => "<li>" + escapaHtml(g.concepto) + ": " + euros(g.importe) + "</li>").join("") +
      "</ul>" +
      (subida > 0.5 ? "<p class='chip chip-naranja'>📈 Inflación: todo cuesta ya " + euros(subida) + " más al mes que en enero</p>" : "") +
      '<p class="importe-grande negativo">Total: −' + euros(m.gastosFijos) + "</p>" +
      botonesPaso() + "</div>";
    conectarBotonesPaso();
    return;
  }

  // ---------- TARJETA SORPRESA ----------
  if (paso === "tarjeta") {
    const t = m.tarjeta;
    if (!m.tarjetaVista) {
      c.innerHTML = '<div class="tarjeta" style="text-align:center;"><h2>🃏 La tarjeta del mes</h2>' +
        "<p>Cada mes la vida sorprende. ¿Suerte o imprevisto?</p>" +
        '<button class="btn btn-principal btn-grande" id="btn-revelar">Sacar tarjeta</button></div>';
      $("btn-revelar").addEventListener("click", () => { m.tarjetaVista = true; guardarBorrador(); pintarPaso(); });
      return;
    }
    c.innerHTML = '<div class="tarjeta-sorpresa ' + t.tipo + '">' +
      '<div class="emoji-grande">' + t.emoji + "</div>" +
      "<h2>" + (t.tipo === "suerte" ? "🍀 ¡Suerte!" : "🌩️ Imprevisto") + "</h2>" +
      "<p>" + escapaHtml(t.texto) + "</p>" +
      '<p class="importe-grande ' + (t.importe >= 0 ? "positivo" : "negativo") + '">' +
      (t.importe >= 0 ? "+" : "−") + euros(Math.abs(t.importe)) + "</p>" +
      botonesPaso() + "</div>";
    conectarBotonesPaso();
    return;
  }

  // ---------- RETO DEL TRAMO ----------
  if (paso === "reto") {
    const r = m.reto;
    c.innerHTML = '<div class="tarjeta"><h2>🎯 Vuestro reto familiar</h2>' +
      "<p>" + escapaHtml(r.descripcion) + (r.recurrente ? " <span class='chip chip-azul'>cada mes del tramo</span>" : "") + "</p>" +
      '<p class="importe-grande ' + (r.importe >= 0 ? "positivo" : "negativo") + '">' +
      (r.importe >= 0 ? "+" : "−") + euros(Math.abs(r.importe)) + "</p>" +
      botonesPaso() + "</div>";
    conectarBotonesPaso();
    return;
  }

  // ---------- EVENTOS ----------
  if (paso === "eventos") {
    c.innerHTML = '<div class="tarjeta"><h2>📅 Qué pasa en ' + mesNombre + "</h2>" +
      m.eventos.map((ev, i) =>
        '<div class="tarjeta" style="margin-bottom:10px;">' +
        "<h3>" + ev.emoji + " " + escapaHtml(ev.titulo) + "</h3>" +
        "<p>" + escapaHtml(ev.descripcion) + "</p>" +
        '<p class="importe-grande ' + (ev.importe >= 0 ? "positivo" : "negativo") + '" style="font-size:1.4rem;">' +
        (ev.importe >= 0 ? "+" : "−") + euros(Math.abs(ev.importe)) + "</p>" +
        (ev.opcional
          ? '<label style="display:flex; gap:8px; align-items:center; font-weight:600;">' +
            '<input type="checkbox" style="width:auto;" data-evento="' + i + '"' + (ev.participa ? " checked" : "") + "> " +
            (ev.importe >= 0 ? "Queremos participar" : "Decidimos gastarlo") + "</label>"
          : '<span class="chip chip-naranja">Obligatorio</span>') +
        "</div>"
      ).join("") + botonesPaso() + "</div>";
    c.querySelectorAll("[data-evento]").forEach((chk) => {
      chk.addEventListener("change", () => {
        m.eventos[Number(chk.dataset.evento)].participa = chk.checked;
        guardarBorrador();
      });
    });
    conectarBotonesPaso();
    return;
  }

  // ---------- BANCO ----------
  if (paso === "banco") {
    const p = familia.prestamoBanco;
    const cta = familia.cuentaAhorro;
    const pendiente = p && p.activo ? redondear(p.importe - (p.devuelto || 0) - m.banco.prestamoDevuelto) : 0;
    let html = '<div class="tarjeta"><h2>🏦 El banco</h2>';

    if (m.enRescate) {
      html += "<p class='chip chip-rojo'>🚨 En plan de rescate no se puede pedir dinero.</p>";
    } else if (p && p.activo) {
      html += '<div class="tarjeta"><h3>💳 Vuestro préstamo</h3>' +
        "<p>Debéis <strong>" + euros(pendiente) + "</strong>. Fecha límite: <strong>" + NOMBRES_MES[p.mesLimite] + "</strong>." +
        (m.mes >= p.mesLimite ? " <span class='chip chip-rojo'>¡Último aviso!</span>" : "") + "</p>" +
        '<div class="fila-campos"><div class="campo"><label>Devolver este mes (€)</label>' +
        '<input type="number" id="campo-devolver" min="0" max="' + pendiente + '" value="' + m.banco.prestamoDevuelto + '"></div></div>' +
        "</div>";
    } else {
      html += '<div class="tarjeta"><h3>💳 Pedir un préstamo</h3>' +
        "<p>El banco presta sin intereses, pero hay que devolverlo TODO antes de " +
        CONFIG_JUEGO.mesesPrestamoBanco + " meses. Si no… plan de rescate. 🚨</p>" +
        '<div class="fila-campos"><div class="campo"><label>Cantidad (€)</label>' +
        '<input type="number" id="campo-pedir" min="0" step="50" value="' + m.banco.prestamoPedido + '"></div></div></div>';
    }

    if (cta && cta.activa) {
      html += '<div class="tarjeta"><h3>🐷 Cuenta de ahorro</h3>' +
        "<p>Saldo: <strong>" + euros(cta.saldo) + "</strong> al " + (cta.interes || CONFIG_JUEGO.interesCuentaAhorro) + "% mensual.</p>" +
        '<div class="fila-campos">' +
        '<div class="campo"><label>Meter más dinero (€)</label><input type="number" id="campo-deposito" min="0" step="10" value="' + m.banco.deposito + '"></div>' +
        (cta.retirada
          ? ""
          : '<div class="campo"><label>Sacarlo TODO (solo se puede una vez)</label>' +
            '<label style="font-weight:400; display:flex; gap:8px; align-items:center;"><input type="checkbox" id="campo-retirar" style="width:auto;"' +
            (m.banco.retirada > 0 ? " checked" : "") + "> Retirar " + euros(cta.saldo) + "</label></div>") +
        "</div></div>";
    } else if (!cta || !cta.activa) {
      html += '<div class="tarjeta"><h3>🐷 Abrir una cuenta de ahorro</h3>' +
        "<p>El dinero guardado crece un " + CONFIG_JUEGO.interesCuentaAhorro + "% cada mes, pero solo podréis sacarlo UNA vez en todo el juego.</p>" +
        '<label style="display:flex; gap:8px; align-items:center; font-weight:600;">' +
        '<input type="checkbox" id="campo-abrir-cuenta" style="width:auto;"' + (m.banco.abrirCuenta ? " checked" : "") + "> Abrir cuenta</label>" +
        '<div class="campo" id="caja-deposito-inicial" style="margin-top:8px;' + (m.banco.abrirCuenta ? "" : "display:none;") + '">' +
        '<label>Primer depósito (€)</label><input type="number" id="campo-deposito" min="0" step="10" value="' + m.banco.deposito + '"></div>';
      html += "</div>";
    }

    html += "<p style='color:var(--gris-texto);'>Dinero del mes hasta ahora: <strong>" + euros(cajaDelMes()) + "</strong> · Ahorros: <strong>" + euros(familia.ahorros) + "</strong></p>";
    html += botonesPaso() + "</div>";
    c.innerHTML = html;

    const chkAbrir = $("campo-abrir-cuenta");
    if (chkAbrir) chkAbrir.addEventListener("change", () => {
      $("caja-deposito-inicial").style.display = chkAbrir.checked ? "" : "none";
    });

    conectarBotonesPaso(async () => {
      const pedir = Number(($("campo-pedir") || {}).value || 0);
      const devolver = Number(($("campo-devolver") || {}).value || 0);
      const deposito = Number(($("campo-deposito") || {}).value || 0);
      const retirar = $("campo-retirar") ? $("campo-retirar").checked : false;
      const abrir = chkAbrir ? chkAbrir.checked : false;

      if (pedir < 0 || devolver < 0 || deposito < 0) { aviso("Las cantidades no pueden ser negativas.", "error"); return false; }
      if (p && p.activo && devolver > redondear(p.importe - (p.devuelto || 0))) { aviso("Estáis devolviendo más de lo que debéis.", "error"); return false; }
      if (pedir > 3000) { aviso("El banco no presta más de 3.000 € de golpe.", "error"); return false; }

      m.banco.prestamoPedido = m.enRescate ? 0 : (p && p.activo ? 0 : redondear(pedir));
      m.banco.prestamoDevuelto = p && p.activo ? redondear(devolver) : 0;
      m.banco.abrirCuenta = !!abrir && !(cta && cta.activa);
      m.banco.deposito = (m.banco.abrirCuenta || (cta && cta.activa)) ? redondear(deposito) : 0;
      m.banco.retirada = retirar && cta && cta.activa && !cta.retirada ? redondear(cta.saldo) : 0;

      // El depósito sale del dinero disponible (caja + ahorros).
      const disponibleTotal = redondear(cajaDelMes() + familia.ahorros + ahorrosExtra());
      if (m.banco.deposito > 0 && m.banco.deposito > disponibleTotal) {
        aviso("No tenéis tanto dinero para meter en la cuenta.", "error");
        m.banco.deposito = 0;
        return false;
      }
      return true;
    });
    return;
  }

  // ---------- NEGOCIO ----------
  if (paso === "negocio") {
    const neg = familia.negocio;
    // Negocio ya en marcha: elegir estrategia y ver el resultado.
    if (neg && neg.activo) {
      if (!m.negocio.resultado) {
        c.innerHTML = '<div class="tarjeta"><h2>🚀 ' + neg.emoji + " " + escapaHtml(neg.nombre) + "</h2>" +
          "<p>¿Qué estrategia seguís este mes?</p>" +
          '<div class="rejilla">' +
          ESTRATEGIAS_NEGOCIO.map((e) =>
            '<div class="tarjeta" style="margin:0;"><h3>' + e.emoji + " " + e.nombre + "</h3>" +
            "<p style='font-size:0.9rem;'>" + e.descripcion + "</p>" +
            "<p><span class='chip'>" + (e.coste ? "Cuesta " + euros(e.coste) : "Gratis") + "</span></p>" +
            '<button class="btn btn-azul btn-mini" data-estrategia="' + e.id + '">Elegir</button></div>'
          ).join("") + "</div>" +
          '<div style="margin-top:14px;"><button class="btn btn-secundario" id="btn-paso-atras">← Atrás</button></div></div>';
        c.querySelectorAll("[data-estrategia]").forEach((b) => {
          b.addEventListener("click", () => {
            m.negocio.estrategia = b.dataset.estrategia;
            m.negocio.resultado = resultadoNegocio(neg, b.dataset.estrategia, m.mes);
            guardarBorrador();
            pintarPaso();
          });
        });
        const atras = $("btn-paso-atras");
        if (atras) atras.addEventListener("click", () => { pasoActual--; guardarBorrador(); pintarPaso(); });
        return;
      }
      const r = m.negocio.resultado;
      c.innerHTML = '<div class="tarjeta-sorpresa ' + (r.importe >= 0 ? "suerte" : "imprevisto") + '">' +
        '<div class="emoji-grande">' + (r.importe >= 0 ? "🤑" : "😓") + "</div>" +
        "<h2>" + (r.exito ? "¡Buen mes para el negocio!" : "Mes flojo en el negocio") + "</h2>" +
        "<p>Estrategia: " + r.estrategiaNombre +
        (r.temporada > 1.1 ? " · 🔥 ¡Temporada alta!" : r.temporada < 0.9 ? " · 🥶 Temporada baja" : "") + "</p>" +
        '<p class="importe-grande ' + (r.importe >= 0 ? "positivo" : "negativo") + '">' +
        (r.importe >= 0 ? "+" : "−") + euros(Math.abs(r.importe)) + "</p>" +
        botonesPaso() + "</div>";
      conectarBotonesPaso();
      return;
    }

    // Sin negocio: posibilidad de montar uno.
    const dineroTotal = redondear(familia.ahorros + cajaDelMes());
    const asequibles = NEGOCIOS.filter((n) => n.coste <= dineroTotal + 3000); // se puede combinar con préstamo
    c.innerHTML = '<div class="tarjeta"><h2>🚀 ¿Montamos un negocio?</h2>' +
      "<p>Un negocio puede daros ingresos cada mes… o pérdidas. El coste inicial sale de vuestros ahorros. " +
      "Dinero total disponible: <strong>" + euros(dineroTotal) + "</strong>.</p>" +
      (asequibles.length
        ? '<div class="rejilla">' + asequibles.slice(0, 12).map((n, i) =>
            '<div class="tarjeta" style="margin:0;"><h3>' + n.emoji + " " + n.nombre + "</h3>" +
            "<p style='font-size:0.88rem;'>" + n.descripcion + "</p>" +
            "<p><span class='chip chip-naranja'>Coste: " + euros(n.coste) + "</span> " +
            "<span class='chip chip-azul'>Éxito: " + n.exito + "%</span> " +
            "<span class='chip chip-verde'>Puede dar: " + euros(n.beneficioBase) + "/mes</span></p>" +
            '<button class="btn btn-exito btn-mini" data-negocio="' + NEGOCIOS.indexOf(n) + '"' +
            (n.coste > dineroTotal ? " disabled title='No os llega el dinero'" : "") + ">Montarlo</button></div>"
          ).join("") + "</div>"
        : "<p>De momento ningún negocio está a vuestro alcance. ¡Seguid ahorrando!</p>") +
      botonesPaso({ texto: "Este mes no montamos nada →" }) + "</div>";
    c.querySelectorAll("[data-negocio]").forEach((b) => {
      b.addEventListener("click", async () => {
        const n = NEGOCIOS[Number(b.dataset.negocio)];
        const ok = await confirmar("¿Montáis <strong>" + n.emoji + " " + n.nombre + "</strong> por " + euros(n.coste) +
          "? El dinero sale de vuestros ahorros y no hay vuelta atrás.", "¡Emprendemos!");
        if (!ok) return;
        m.negocio.montado = { ...n };
        guardarBorrador();
        pasoActual++;
        pintarPaso();
        aviso("¡Negocio en marcha! Empezará a funcionar el mes que viene.", "exito");
      });
    });
    conectarBotonesPaso();
    return;
  }

  // ---------- SOLIDARIDAD ----------
  if (paso === "solidaridad") {
    const otras = Object.entries((marcador && marcador.familias) || {})
      .map(([pubId, f]) => ({ pubId: pubId, ...f }))
      .filter((f) => f.pubId !== familia.publicId);
    const misDeudas = prestamos.filter((p) =>
      p.aPublicId === familia.publicId && p.estado === "aceptado" &&
      !m.solidaridad.devoluciones.some((d) => d.id === p.id));

    let html = '<div class="tarjeta"><h2>❤️ Solidaridad entre familias</h2>';

    if (misDeudas.length) {
      html += "<h3>Préstamos que debéis devolver</h3>";
      for (const p of misDeudas) {
        html += '<div class="tarjeta"><p><strong>' + escapaHtml(p.deNombre) + "</strong> os prestó <strong>" +
          euros(p.importe) + "</strong> (devolver antes de " + NOMBRES_MES[p.mesLimite] + ")" +
          (m.mes >= p.mesLimite ? " <span class='chip chip-rojo'>¡Ya toca!</span>" : "") + "</p>" +
          '<button class="btn btn-azul btn-mini" data-devolver="' + p.id + '">Devolver ahora (' + euros(p.importe) + ")</button></div>";
      }
    }
    if (m.solidaridad.devoluciones.length) {
      html += "<p class='chip chip-verde'>Este mes devolvéis: " +
        m.solidaridad.devoluciones.map((d) => euros(d.importe)).join(" + ") + "</p>";
    }

    if (m.enRescate) {
      html += "<p class='chip chip-rojo'>En plan de rescate no podéis prestar dinero.</p>";
    } else if (m.solidaridad.importe > 0) {
      html += "<p class='chip chip-verde'>❤️ Este mes prestáis " + euros(m.solidaridad.importe) +
        " a " + escapaHtml(m.solidaridad.aNombre) + '</p> <button class="btn btn-mini btn-secundario" id="btn-quitar-prestamo">Cambiar</button>';
    } else if (otras.length) {
      html += "<h3>¿Echamos una mano?</h3>" +
        "<p>Podéis prestar dinero a otra familia. Os lo devolverá en un máximo de " +
        CONFIG_JUEGO.mesesPrestamoSolidario + " meses y ganaréis un corazón ❤️.</p>" +
        '<div class="fila-campos">' +
        '<div class="campo"><label>Familia</label><select id="campo-familia-destino">' +
        '<option value="">— Elegid —</option>' +
        otras.map((f) => '<option value="' + f.pubId + '">' + f.emoji + " " + escapaHtml(f.nombre) +
          " (ahorros: " + euros(f.ahorros) + ")</option>").join("") + "</select></div>" +
        '<div class="campo"><label>Cantidad (€)</label><input type="number" id="campo-importe-prestamo" min="0" step="10" value="0"></div>' +
        "</div>" +
        '<button class="btn btn-exito" id="btn-prestar">Prestar</button>';
    } else {
      html += "<p>Cuando las demás familias entren en juego, podréis ayudarlas desde aquí.</p>";
    }

    html += "<p style='color:var(--gris-texto); margin-top:10px;'>Dinero del mes: <strong>" + euros(cajaDelMes()) + "</strong></p>";
    html += botonesPaso() + "</div>";
    c.innerHTML = html;

    c.querySelectorAll("[data-devolver]").forEach((b) => {
      b.addEventListener("click", () => {
        const p = prestamos.find((x) => x.id === b.dataset.devolver);
        m.solidaridad.devoluciones.push({ id: p.id, importe: p.importe, aNombre: p.deNombre });
        guardarBorrador();
        pintarPaso();
      });
    });
    const btnQuitar = $("btn-quitar-prestamo");
    if (btnQuitar) btnQuitar.addEventListener("click", () => {
      m.solidaridad = { aPublicId: null, aNombre: null, importe: 0, devoluciones: m.solidaridad.devoluciones };
      guardarBorrador(); pintarPaso();
    });
    const btnPrestar = $("btn-prestar");
    if (btnPrestar) btnPrestar.addEventListener("click", () => {
      const sel = $("campo-familia-destino");
      const importe = Number($("campo-importe-prestamo").value || 0);
      if (!sel.value) { aviso("Elegid a qué familia prestáis.", "error"); return; }
      if (importe <= 0) { aviso("Poned una cantidad.", "error"); return; }
      if (importe > redondear(familia.ahorros + cajaDelMes())) { aviso("No tenéis tanto dinero.", "error"); return; }
      const f = otras.find((x) => x.pubId === sel.value);
      m.solidaridad.aPublicId = f.pubId;
      m.solidaridad.aNombre = f.nombre;
      m.solidaridad.importe = redondear(importe);
      guardarBorrador();
      pintarPaso();
    });
    conectarBotonesPaso();
    return;
  }

  // ---------- DECISIÓN OCIO / AHORRO ----------
  if (paso === "decision") {
    const disponible = cajaDelMes();
    const topeRescate = redondear(m.ingresos.total * CONFIG_JUEGO.ocioMaxRescate / 100);
    const maxOcio = Math.max(0, m.enRescate ? Math.min(disponible, topeRescate) : disponible);
    if (m.ocio > maxOcio) m.ocio = maxOcio;

    c.innerHTML = '<div class="tarjeta"><h2>⚖️ La gran decisión: ¿gastar o ahorrar?</h2>' +
      "<p>Después de todo el mes os quedan <strong class='" + (disponible >= 0 ? "positivo" : "negativo") +
      "'>" + euros(disponible) + "</strong>.</p>" +
      (disponible <= 0
        ? "<p class='chip chip-rojo'>Este mes no sobra nada: toca apretarse el cinturón. El ocio gratis (paseos, juegos, biblioteca) ¡también cuenta para ser felices!</p>"
        : "<p>Decidid cuánto dedicáis a <strong>ocio y caprichos</strong> (cine, salir, extras…). " +
          "Lo que no gastéis irá a vuestros ahorros. Recordad: no disfrutar nada baja la salud emocional, " +
          "pero pasarse gastando vacía la hucha.</p>") +
      (m.enRescate ? "<p class='chip chip-rojo'>Plan de rescate: máximo " + euros(topeRescate) + " de ocio.</p>" : "") +
      '<div class="campo"><label>Ocio este mes: <span id="etiqueta-ocio">' + euros(m.ocio) + "</span></label>" +
      '<input type="range" id="campo-ocio" min="0" max="' + maxOcio + '" step="5" value="' + m.ocio + '"></div>' +
      '<div class="panel-cifras">' +
      cifra("<span id='res-ocio'>" + euros(m.ocio) + "</span>", "Ocio 🎉") +
      cifra("<span id='res-ahorro'>" + euros(Math.max(0, disponible - m.ocio)) + "</span>", "A la hucha 🐷") +
      "</div>" +
      botonesPaso() + "</div>";

    const slider = $("campo-ocio");
    slider.addEventListener("input", () => {
      m.ocio = Number(slider.value);
      $("etiqueta-ocio").textContent = euros(m.ocio);
      $("res-ocio").textContent = euros(m.ocio);
      $("res-ahorro").textContent = euros(Math.max(0, disponible - m.ocio));
      guardarBorrador();
    });
    conectarBotonesPaso();
    return;
  }

  // ---------- REFLEXIÓN ----------
  if (paso === "reflexion") {
    c.innerHTML = '<div class="tarjeta"><h2>💭 Reflexión del mes</h2>' +
      "<p>Escribid entre todos: ¿qué decisiones habéis tomado y por qué? ¿Qué haríais distinto? " +
      "La mejor reflexión de la clase gana un premio 🏅.</p>" +
      '<textarea id="campo-reflexion" rows="5" placeholder="Este mes hemos decidido…">' +
      escapaHtml(m.reflexion) + "</textarea>" +
      botonesPaso() + "</div>";
    conectarBotonesPaso(async () => {
      m.reflexion = $("campo-reflexion").value.trim();
      if (m.reflexion.length < 15) {
        aviso("Escribid un poquito más: al menos una frase de verdad.", "aviso");
        return false;
      }
      return true;
    });
    return;
  }

  // ---------- RESUMEN Y GUARDAR ----------
  if (paso === "resumen") {
    const disponible = cajaDelMes();
    const saldoMes = redondear(disponible - m.ocio);
    const ahorrosFinales = redondear(familia.ahorros + saldoMes + ahorrosExtra());
    const lineas = [
      ["💶 Ingresos", m.ingresos.total],
      ["🧾 Gastos fijos", -m.gastosFijos],
      [m.tarjeta.emoji + " " + m.tarjeta.texto, m.tarjeta.importe],
    ];
    if (m.reto) lineas.push(["🎯 " + m.reto.descripcion, m.reto.importe]);
    for (const ev of m.eventos) if (ev.participa) lineas.push([ev.emoji + " " + ev.titulo, ev.importe]);
    if (m.banco.prestamoPedido) lineas.push(["💳 Préstamo del banco", m.banco.prestamoPedido]);
    if (m.banco.prestamoDevuelto) lineas.push(["💳 Devolución al banco", -m.banco.prestamoDevuelto]);
    if (m.banco.deposito) lineas.push(["🐷 A la cuenta de ahorro", -m.banco.deposito]);
    if (m.banco.retirada) lineas.push(["🐷 Retirada de la cuenta", m.banco.retirada]);
    if (m.negocio.resultado) lineas.push(["🚀 Resultado del negocio", m.negocio.resultado.importe]);
    if (m.negocio.montado) lineas.push(["🏗️ Montar " + m.negocio.montado.nombre + " (de los ahorros)", -m.negocio.montado.coste]);
    if (m.solidaridad.importe) lineas.push(["❤️ Préstamo a " + m.solidaridad.aNombre, -m.solidaridad.importe]);
    for (const d of m.solidaridad.devoluciones) lineas.push(["🤝 Devolución a " + d.aNombre, -d.importe]);
    lineas.push(["🎉 Ocio", -m.ocio]);

    c.innerHTML = '<div class="tarjeta"><h2>📋 Resumen de ' + mesNombre + "</h2>" +
      '<div class="tabla-envoltura"><table><tbody>' +
      lineas.map(([texto, importe]) =>
        "<tr><td>" + escapaHtml(texto) + "</td><td style='text-align:right; font-weight:700; color:" +
        (importe >= 0 ? "var(--exito)" : "var(--peligro)") + ";'>" +
        (importe >= 0 ? "+" : "−") + euros(Math.abs(importe)) + "</td></tr>").join("") +
      "</tbody></table></div>" +
      '<div class="panel-cifras" style="margin-top:12px;">' +
      cifra(euros(saldoMes), "Saldo del mes", saldoMes >= 0 ? "positiva" : "negativa") +
      cifra(euros(ahorrosFinales), "Ahorros totales", ahorrosFinales >= 0 ? "positiva" : "negativa") +
      "</div>" +
      "<p style='color:var(--gris-texto);'>Al confirmar, el mes quedará cerrado para vuestra familia y no se podrá cambiar.</p>" +
      '<div style="display:flex; gap:10px; justify-content:space-between; margin-top:14px;">' +
      '<button class="btn btn-secundario" id="btn-paso-atras">← Atrás</button>' +
      '<button class="btn btn-exito btn-grande" id="btn-confirmar-mes">✅ Confirmar el mes</button></div></div>';

    $("btn-paso-atras").addEventListener("click", () => { pasoActual--; guardarBorrador(); pintarPaso(); });
    $("btn-confirmar-mes").addEventListener("click", guardarMes);
    return;
  }
}

// ---------- guardar el mes ----------

async function guardarMes() {
  const boton = $("btn-confirmar-mes");
  boton.disabled = true;
  boton.textContent = "Guardando…";
  try {
    const disponible = cajaDelMes();
    const saldoMes = redondear(disponible - m.ocio);
    const ahorroDecidido = Math.max(0, saldoMes);
    let ahorrosFinales = redondear(familia.ahorros + saldoMes + ahorrosExtra());

    // --- estado del banco tras el mes ---
    let prestamoBanco = familia.prestamoBanco || null;
    if (m.banco.prestamoPedido > 0) {
      prestamoBanco = {
        importe: m.banco.prestamoPedido,
        devuelto: 0,
        mesConcedido: m.mes,
        mesLimite: Math.min(12, m.mes + CONFIG_JUEGO.mesesPrestamoBanco),
        activo: true,
      };
    } else if (prestamoBanco && prestamoBanco.activo && m.banco.prestamoDevuelto > 0) {
      const devuelto = redondear((prestamoBanco.devuelto || 0) + m.banco.prestamoDevuelto);
      prestamoBanco = { ...prestamoBanco, devuelto: devuelto, activo: devuelto < prestamoBanco.importe };
    }

    let cuentaAhorro = familia.cuentaAhorro || null;
    if (m.banco.abrirCuenta) {
      cuentaAhorro = {
        saldo: m.banco.deposito, interes: CONFIG_JUEGO.interesCuentaAhorro,
        mesApertura: m.mes, retirada: false, activa: true,
      };
    } else if (cuentaAhorro && cuentaAhorro.activa) {
      let saldo = redondear(cuentaAhorro.saldo + m.banco.deposito);
      if (m.banco.retirada > 0) {
        saldo = 0;
        cuentaAhorro = { ...cuentaAhorro, saldo: 0, retirada: true, activa: false };
      } else {
        cuentaAhorro = { ...cuentaAhorro, saldo: saldo };
      }
    }

    // --- negocio ---
    let negocio = familia.negocio || null;
    if (m.negocio.montado) {
      const n = m.negocio.montado;
      negocio = {
        nombre: n.nombre, emoji: n.emoji, coste: n.coste, exito: n.exito,
        beneficioBase: n.beneficioBase, temporada: n.temporada || {},
        descripcion: n.descripcion || "",
        activo: true, mesInicio: m.mes, mesesActivo: 0, totalGanado: 0,
      };
    } else if (negocio && negocio.activo && m.negocio.resultado) {
      negocio = {
        ...negocio,
        mesesActivo: (negocio.mesesActivo || 0) + 1,
        totalGanado: redondear((negocio.totalGanado || 0) + m.negocio.resultado.importe),
      };
    }

    // --- meta ---
    let meta = familia.meta || null;
    let metaCumplidaAhora = false;
    if (meta && !meta.cumplida && ahorrosFinales >= meta.importe) {
      meta = { ...meta, cumplida: true, mesCumplida: m.mes };
      metaCumplidaAhora = true;
    }

    // --- salud emocional y premios ---
    const prestamoVencido = !!(prestamoBanco && prestamoBanco.activo && m.mes >= prestamoBanco.mesLimite);
    const ise = calcularISE({
      ingresos: m.ingresos.total,
      ocio: m.ocio,
      ahorrosFinales: ahorrosFinales,
      gastosFijos: m.gastosFijos,
      saldoMes: saldoMes,
      progresoMeta: meta ? Math.min(1, Math.max(0, ahorrosFinales) / meta.importe) : 0,
      prestamoVencido: prestamoVencido,
      enRescate: m.enRescate,
    });
    const premios = premiosDelMes({
      saldoMes: saldoMes, ahorroDecidido: ahorroDecidido,
      ahorrosFinales: ahorrosFinales, solidaridadDada: m.solidaridad.importe,
    });

    const alertasSeguidas = premios.alerta ? (familia.alertasSeguidas || 0) + 1 : 0;

    // --- registro del mes ---
    const registro = {
      partidaId: partida.id,
      teacherId: familia.teacherId,
      familiaCodigo: familia.codigo,
      familiaPublicId: familia.publicId,
      mes: m.mes,
      ingresos: m.ingresos.total,
      pagaExtra: m.ingresos.pagaExtra,
      gastosFijos: m.gastosFijos,
      tarjeta: m.tarjeta,
      reto: m.reto || null,
      eventos: m.eventos.map((ev) => ({ titulo: ev.titulo, emoji: ev.emoji, importe: ev.importe, participa: ev.participa })),
      banco: m.banco,
      negocio: m.negocio.resultado || (m.negocio.montado ? { montado: m.negocio.montado.nombre, coste: m.negocio.montado.coste } : null),
      solidaridadDada: m.solidaridad.importe || 0,
      solidaridadA: m.solidaridad.aNombre || null,
      devoluciones: m.solidaridad.devoluciones.map((d) => d.importe),
      ocio: m.ocio,
      ahorroDecidido: ahorroDecidido,
      saldoMes: saldoMes,
      ahorroTotal: ahorrosFinales,
      ise: ise,
      premios: premios,
      reflexion: m.reflexion,
      completado: true,
      guardadoEn: serverTimestamp(),
    };

    // --- insignias ---
    const familiaTrasMes = {
      ...familia,
      corazones: (familia.corazones || 0) + (premios.corazon ? 1 : 0),
      negocio: negocio, cuentaAhorro: cuentaAhorro, meta: meta,
    };
    const nuevas = insigniasNuevas(familiaTrasMes, [...historial, registro]);
    const insignias = [...new Set([...(familia.insignias || []), ...nuevas])];

    // --- escrituras en Firestore ---
    await setDoc(doc(db, "ecoMeses", familia.codigo + "_m" + m.mes), registro);

    await updateDoc(doc(db, "ecoFamilias", familia.codigo), {
      ahorros: ahorrosFinales,
      estrellas: (familia.estrellas || 0) + (premios.estrella ? 1 : 0),
      alertas: (familia.alertas || 0) + (premios.alerta ? 1 : 0),
      alertasSeguidas: alertasSeguidas,
      corazones: (familia.corazones || 0) + (premios.corazon ? 1 : 0),
      insignias: insignias,
      prestamoBanco: prestamoBanco,
      cuentaAhorro: cuentaAhorro,
      negocio: negocio,
      meta: meta,
    });

    // Préstamo solidario dado: crear el documento.
    if (m.solidaridad.importe > 0) {
      await addDoc(collection(db, "ecoPrestamosFamilias"), {
        partidaId: partida.id,
        teacherId: familia.teacherId,
        dePublicId: familia.publicId,
        deNombre: familia.nombre,
        aPublicId: m.solidaridad.aPublicId,
        aNombre: m.solidaridad.aNombre,
        importe: m.solidaridad.importe,
        mesConcedido: m.mes,
        mesLimite: Math.min(12, m.mes + CONFIG_JUEGO.mesesPrestamoSolidario),
        estado: "pendiente",
        cobrado: false,
        creadoEn: serverTimestamp(),
      });
    }

    // Devoluciones de préstamos solidarios recibidos.
    for (const d of m.solidaridad.devoluciones) {
      await updateDoc(doc(db, "ecoPrestamosFamilias", d.id), { estado: "devuelto" });
    }

    // Marcador público de la partida.
    await setDoc(doc(db, "ecoMarcador", partida.id), {
      familias: {
        [familia.publicId]: {
          nombre: familia.nombre,
          emoji: familia.emoji,
          ahorros: ahorrosFinales,
          estrellas: (familia.estrellas || 0) + (premios.estrella ? 1 : 0),
          corazones: (familia.corazones || 0) + (premios.corazon ? 1 : 0),
          alertas: (familia.alertas || 0) + (premios.alerta ? 1 : 0),
          ise: ise,
          rescate: !!(familia.planRescate && familia.planRescate.activo),
          mesCompletado: m.mes,
        },
      },
    }, { merge: true });

    try { localStorage.removeItem(claveBorrador()); } catch (e) { /* nada */ }

    // Celebraciones.
    if (metaCumplidaAhora) aviso("🏆 ¡¡META CUMPLIDA!! " + familia.meta.emoji + " " + familia.meta.titulo, "exito");
    if (premios.estrella) aviso("⭐ ¡Estrella conseguida! Mes en positivo y con ahorro.", "exito");
    if (premios.corazon) aviso("❤️ Corazón por vuestra solidaridad.", "exito");
    if (premios.alerta) aviso("⚠️ Alerta: el mes ha acabado en números rojos.", "aviso");
    for (const id of nuevas) {
      const ins = INSIGNIAS.find((x) => x.id === id);
      if (ins) aviso("🎖️ Nueva insignia: " + ins.emoji + " " + ins.nombre, "exito");
    }

    m = null;
    await recargarFamilia();
    await cargarTodo();
    mostrarPanel();
  } catch (e) {
    console.error(e);
    aviso("No se ha podido guardar el mes: " + (e.message || e), "error");
    boton.disabled = false;
    boton.textContent = "✅ Confirmar el mes";
  }
}
