// ============================================================
// Cifras y Letras — pantalla de proyección para la pizarra.
// Solo lectura: enseña en grande el código de la partida, el
// sorteo de letras, el objetivo de cifras, el reloj, los
// resultados de cada ronda y el podio final. Todo llega en
// tiempo real desde Firestore.
// ============================================================

import {
  collection, query, where, onSnapshot, getDoc,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { db, auth } from "./firebase-init.js";
import { textoSolucion } from "./motor.js";
import { refPartida } from "./rondas.js";
import {
  CLAVE_SESION_PROYECCION, guardarSesion, cargarSesion,
  el, escapaHtml, segundosRestantes, formatoTiempo, esErrorPermisos,
} from "./comun.js";

const $ = el;

let partida = null;
let jugadores = [];
let respuestas = [];
let reloj = null;

document.addEventListener("DOMContentLoaded", () => {
  $("form-codigo").addEventListener("submit", (e) => {
    e.preventDefault();
    const codigo = $("campo-codigo").value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (codigo.length === 6) empezar(codigo);
  });
  const params = new URLSearchParams(location.search);
  const codigoUrl = (params.get("codigo") || "").toUpperCase();
  const sesion = cargarSesion(CLAVE_SESION_PROYECCION);
  if (codigoUrl.length === 6) empezar(codigoUrl);
  else if (sesion && sesion.codigo) $("campo-codigo").value = sesion.codigo;
});

async function empezar(codigo) {
  const err = $("error-codigo");
  try {
    if (!auth.currentUser) await signInAnonymously(auth);
    const snap = await getDoc(refPartida(db, codigo));
    if (!snap.exists()) { err.textContent = "No existe ninguna partida con ese código."; return; }
  } catch (ex) {
    err.textContent = esErrorPermisos(ex)
      ? "Faltan las reglas de Firestore por publicar (avisa al docente)."
      : (ex.message || "No se ha podido conectar.");
    return;
  }
  guardarSesion(CLAVE_SESION_PROYECCION, { codigo: codigo });
  $("vista-codigo").classList.remove("activa");
  $("vista-proyeccion").classList.add("activa");

  onSnapshot(refPartida(db, codigo), (snap) => {
    if (!snap.exists()) { window.location.href = "proyeccion.html"; return; }
    partida = { id: snap.id, ...snap.data({ serverTimestamps: "estimate" }) };
    pintar();
  });
  onSnapshot(query(collection(db, "cylJugadores"), where("partida", "==", codigo)), (snap) => {
    jugadores = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.puntos || 0) - (a.puntos || 0) || String(a.nombre).localeCompare(String(b.nombre)));
    pintar();
  });
  onSnapshot(query(collection(db, "cylRespuestas"), where("partida", "==", codigo)), (snap) => {
    respuestas = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    pintar();
  });
  reloj = setInterval(() => {
    if (!partida || !partida.ronda || partida.ronda.estado !== "jugando") return;
    const seg = segundosRestantes(partida.ronda);
    const elReloj = $("reloj-proyeccion");
    if (elReloj) {
      elReloj.textContent = formatoTiempo(seg);
      elReloj.classList.toggle("apurado", seg <= 10);
    }
  }, 400);
}

function respuestasDeLaRonda() {
  if (!partida || !partida.ronda) return [];
  return respuestas.filter((r) => r.ronda === partida.ronda.numero);
}

function pintar() {
  if (!partida) return;
  const z = $("zona-escena");
  const r = partida.ronda;
  let html = "<h1 style='font-size:1.6rem;'>" + escapaHtml(partida.nombre) + "</h1>";

  if (partida.estado === "fin") {
    html += pintarPodio();
  } else if (partida.estado === "lobby") {
    html += '<p class="titulo-ronda">Uníos con este código</p>' +
      '<div class="codigo-partida codigo-gigante">' + partida.codigo + "</div>" +
      '<div class="chips-jugadores" style="justify-content:center; margin-top:18px;">' +
      (jugadores.map((j) => '<span class="chip">' + escapaHtml(j.nombre) + "</span>").join("") ||
        '<span class="texto-suave">esperando equipos…</span>') + "</div>";
  } else if (r) {
    html += '<p class="titulo-ronda">Ronda ' + r.numero + " · " + (r.tipo === "letras" ? "🔤 Letras" : "🔢 Cifras") + "</p>";

    if (r.tipo === "letras") {
      const max = (partida.config && partida.config.numLetras) || 9;
      let fichas = "";
      for (let i = 0; i < max; i++) {
        const l = r.letras && r.letras[i];
        fichas += '<button class="ficha-letra ficha-grande' + (l ? "" : " hueco") + '" disabled>' + (l || "·") + "</button>";
      }
      html += '<div class="panel-fichas">' + fichas + "</div>";
    } else {
      html += '<div class="objetivo-cifras" style="font-size:4rem;">' + r.objetivo + "</div>" +
        '<div class="panel-fichas">' +
        (r.fichas || []).map((f) => '<button class="ficha-cifra" style="min-width:80px; height:74px; font-size:2rem;" disabled>' + f + "</button>").join("") +
        "</div>";
    }

    if (r.estado === "sorteo") {
      html += '<p class="texto-suave" style="font-size:1.2rem;">Sorteando…</p>';
    } else if (r.estado === "jugando") {
      const n = respuestasDeLaRonda().length;
      html += '<div class="reloj" id="reloj-proyeccion" style="font-size:5rem;">' + formatoTiempo(segundosRestantes(r)) + "</div>" +
        '<p class="texto-suave" style="font-size:1.2rem;">Respuestas recibidas: ' + n + " de " + jugadores.length + "</p>";
    } else if (r.estado === "validando") {
      html += '<p class="texto-suave" style="font-size:1.3rem;">✋ ¡Tiempo! Revisando las respuestas…</p>';
    } else if (r.estado === "cerrada") {
      const deRonda = respuestasDeLaRonda().slice().sort((a, b) => (b.puntos || 0) - (a.puntos || 0));
      html += deRonda.map((resp) =>
        '<div class="fila-respuesta ' + resp.estado + '" style="max-width:640px; margin:6px auto; text-align:left;">' +
        '<span class="nombre">' + escapaHtml(resp.nombre) + "</span>" +
        '<span class="jugada">' + (r.tipo === "letras"
          ? escapaHtml(String(resp.palabra || "").toUpperCase())
          : escapaHtml(String(resp.resultado != null ? resp.resultado : "—"))) + "</span>" +
        '<span style="font-weight:800; color:var(--acento); font-size:1.2rem;">+' + (resp.puntos || 0) + "</span>" +
        "</div>").join("") || '<p class="texto-suave">Nadie envió respuesta.</p>';
      if (r.solucion) {
        html += '<div class="solucion-caja">' + (r.tipo === "letras"
          ? "💡 Se podía: <strong>" + (r.solucion.palabras || []).map(escapaHtml).join(", ").toUpperCase() + "</strong>"
          : "💡 Una manera exacta: <strong>" + escapaHtml(textoSolucion(r.solucion.pasos)) + "</strong>") + "</div>";
      }
    }
  }

  z.innerHTML = html;
  pintarMarcador();
}

function pintarPodio() {
  const top = jugadores.slice(0, 3);
  const orden = [1, 0, 2];
  const clases = ["p1", "p2", "p3"];
  const emojis = ["🥇", "🥈", "🥉"];
  let html = '<p class="titulo-ronda">🏁 Final del concurso</p><div class="podio">';
  for (const idx of orden) {
    const j = top[idx];
    if (!j) continue;
    html += '<div class="puesto ' + clases[idx] + '">' +
      '<div class="emoji">' + emojis[idx] + "</div>" +
      '<div class="nombre">' + escapaHtml(j.nombre) + "</div>" +
      '<div class="pts">' + (j.puntos || 0) + " pts</div></div>";
  }
  return html + "</div>";
}

function pintarMarcador() {
  const cont = $("zona-marcador");
  if (!cont) return;
  if (!jugadores.length) { cont.innerHTML = ""; return; }
  const medallas = ["🥇", "🥈", "🥉"];
  cont.innerHTML = '<table class="tabla-marcador"><tr><th></th><th>Equipo</th><th style="text-align:right;">Puntos</th></tr>' +
    jugadores.map((j, i) =>
      "<tr><td>" + (medallas[i] || (i + 1) + "º") + "</td><td>" + escapaHtml(j.nombre) + "</td>" +
      '<td class="puntos">' + (j.puntos || 0) + "</td></tr>").join("") +
    "</table>";
}
