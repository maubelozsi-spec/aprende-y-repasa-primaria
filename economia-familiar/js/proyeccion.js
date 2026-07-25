// ============================================================
// Economía Familiar 2.0 — panel de proyección para la pizarra.
// Vista de solo lectura pensada en grande: podio, ranking,
// estado del mes, gráfica de evolución y análisis del último
// mes cerrado. Requiere la sesión de docente (misma que el
// panel), y se refresca con el botón Actualizar.
// ============================================================

import {
  doc, getDoc, collection, query, where, getDocs,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { db, auth } from "./firebase-init.js";
import { NOMBRES_MES } from "./catalogos.js";
import { euros } from "./motor.js";
import { graficaLineas, PALETA_FAMILIAS, el, escapaHtml } from "./comun.js";

const $ = el;

let uid = null;
let partidas = [];
let partida = null;
let familias = [];
let meses = [];

document.addEventListener("DOMContentLoaded", () => {
  $("btn-actualizar").addEventListener("click", () => partida && cargarPartida(partida.id));
  let primera = true;
  onAuthStateChanged(auth, async (user) => {
    if (!primera) return;
    primera = false;
    if (user && !user.isAnonymous) {
      uid = user.uid;
      const snap = await getDocs(query(collection(db, "ecoPartidas"), where("teacherId", "==", uid)));
      partidas = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      $("mensaje-acceso").textContent = partidas.length ? "Elige la partida que quieres proyectar:" : "No tienes partidas todavía.";
      $("selector-partida").innerHTML = partidas.map((p) =>
        '<button class="btn btn-azul" style="margin:4px;" data-partida="' + p.id + '">🎲 ' + escapaHtml(p.nombre) + "</button>").join("");
      document.querySelectorAll("[data-partida]").forEach((b) =>
        b.addEventListener("click", () => cargarPartida(b.dataset.partida)));
    }
  });
});

async function cargarPartida(pid) {
  const [pSnap, fSnap, mSnap] = await Promise.all([
    getDoc(doc(db, "ecoPartidas", pid)),
    getDocs(query(collection(db, "ecoFamilias"), where("partidaId", "==", pid), where("teacherId", "==", uid))),
    getDocs(query(collection(db, "ecoMeses"), where("partidaId", "==", pid), where("teacherId", "==", uid))),
  ]);
  partida = { id: pid, ...pSnap.data() };
  familias = fSnap.docs.map((d) => ({ codigo: d.id, ...d.data() }));
  meses = mSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  pintar();
}

function pintar() {
  $("vista-acceso").classList.remove("activa");
  $("vista-panel").classList.add("activa");
  $("btn-actualizar").style.display = "";
  $("titulo-proyeccion").textContent = "🎲 " + partida.nombre;

  const mes = partida.mesActual || 0;
  const registrosMes = meses.filter((x) => x.mes === mes && x.completado);
  const hechas = new Set(registrosMes.map((x) => x.familiaCodigo));

  const ranking = [...familias].sort((a, b) => (b.ahorros || 0) - (a.ahorros || 0));
  const podio = ranking.slice(0, 3);

  let html = "";

  // Estado del mes.
  html += '<div class="tarjeta" style="text-align:center;">' +
    "<h2>📅 " + (mes ? NOMBRES_MES[mes] : "En preparación") +
    (partida.estado === "terminada" ? " — 🏁 ¡Juego terminado!" : partida.mesAbierto ? " — mes en juego" : " — mes cerrado") + "</h2>" +
    (mes && partida.estado !== "terminada"
      ? '<div class="leyenda" style="justify-content:center;">' + familias.map((f) =>
          '<span class="chip ' + (hechas.has(f.codigo) ? "chip-verde" : "") + '">' +
          (hechas.has(f.codigo) ? "✅ " : "⏳ ") + f.emoji + " " + escapaHtml(f.nombre) + "</span>").join("") + "</div>"
      : "") + "</div>";

  // Podio.
  if (podio.length >= 2) {
    const caja = (f, clase, medalla) => f
      ? '<div class="puesto ' + clase + '"><div class="emoji">' + medalla + "</div><div>" + f.emoji + " <strong>" +
        escapaHtml(f.nombre) + "</strong></div><div>" + euros(f.ahorros) + "</div></div>"
      : "";
    html += '<div class="tarjeta"><h2 style="text-align:center;">🏆 Podio del ahorro</h2><div class="podio">' +
      caja(podio[1], "p2", "🥈") + caja(podio[0], "p1", "🥇") + caja(podio[2], "p3", "🥉") + "</div></div>";
  }

  // Ranking completo.
  html += '<div class="tarjeta"><h2>📋 Ranking completo</h2><div class="tabla-envoltura"><table><thead>' +
    "<tr><th>#</th><th>Familia</th><th>Ahorros</th><th>⭐</th><th>❤️</th><th>⚠️</th><th>Meta</th></tr></thead><tbody>" +
    ranking.map((f, i) => {
      const progresoMeta = f.meta ? Math.min(100, Math.round(100 * Math.max(0, f.ahorros) / f.meta.importe)) : null;
      return "<tr><td>" + (i + 1) + "</td><td>" + f.emoji + " " + escapaHtml(f.nombre) +
        (f.planRescate && f.planRescate.activo ? " 🚨" : "") + "</td>" +
        "<td style='font-weight:800;'>" + euros(f.ahorros) + "</td>" +
        "<td>" + (f.estrellas || 0) + "</td><td>" + (f.corazones || 0) + "</td><td>" + (f.alertas || 0) + "</td>" +
        "<td>" + (f.meta ? f.meta.emoji + " " + (f.meta.cumplida ? "✅" : progresoMeta + "%") : "—") + "</td></tr>";
    }).join("") + "</tbody></table></div></div>";

  // Gráfica de evolución.
  html += '<div class="tarjeta"><h2>📈 La carrera del ahorro</h2>' +
    '<div class="grafica-caja" style="height:360px;"><canvas id="grafica-proyeccion"></canvas></div>' +
    '<div class="leyenda">' + familias.map((f, i) =>
      '<span class="item"><span class="punto" style="background:' + PALETA_FAMILIAS[i % PALETA_FAMILIAS.length] + ';"></span>' +
      f.emoji + " " + escapaHtml(f.nombre) + "</span>").join("") + "</div></div>";

  // Último análisis.
  const analisis = partida.analisis || {};
  const cerrados = Object.keys(analisis).map(Number).sort((a, b) => b - a);
  if (cerrados.length) {
    html += '<div class="tarjeta"><h2>📊 Análisis de ' + NOMBRES_MES[cerrados[0]] + "</h2>" +
      "<p style='white-space:pre-line;'>" + escapaHtml(analisis[String(cerrados[0])]) + "</p></div>";
  }

  $("vista-panel").innerHTML = html;

  const ultimoMes = Math.max(1, mes || 1);
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
    const canvas = $("grafica-proyeccion");
    if (canvas && series.length) graficaLineas(canvas, series, etiquetas, { grosor: 3.5, radioPunto: 4 });
  });
}
