// ============================================================
// Letrania · pantalla del alumno (letrania/index.html).
//
// Acceso: solo entra quien tiene clave de Aprende y Repasa (lo
// comprueba antes js/acceso.js) Y además un héroe en letHeroes/{clave}
// que el maestro ha habilitado para hoy desde letrania/docente.html.
// El tiempo (15 minutos por defecto, lo fija el maestro) empieza a
// contar cuando el alumno pulsa «Entrar en Letrania»: entonces se
// guarda la hora del servidor en «inicio». Pasado ese tiempo, las
// reglas de firestore.rules rechazan cualquier cambio en su héroe y
// esta pantalla se cierra; para volver a jugar, el maestro tiene que
// habilitarlo otra vez.
//
// Consumo de Firestore por alumno y sesión: 1 escritura y 2 lecturas
// para marcar el dispositivo activo y saber la hora del servidor, 2
// lecturas (héroe y ajustes del maestro), 1 escritura al entrar, 1-2 al
// guardar el héroe y una escucha sobre SU documento (solo llegan los
// cambios que haga el maestro), que se cancela al acabar el tiempo o
// salir de la página.
//
// El docente y la vista del alumnado del panel ven un héroe de
// ejemplo que no se guarda en ningún sitio.
// ============================================================

import {
  doc,
  getDoc,
  getDocFromServer,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { db, auth } from "../../js/firebase-init.js";

const L = window.Letrania;
const { esc, srcImg } = L;
const $ = (s) => document.querySelector(s);

function leer(k) {
  try {
    return JSON.parse(localStorage.getItem(k) || "null");
  } catch (e) {
    return null;
  }
}

const sesion = leer("ar_estudiante");
const esDemo = !(sesion && sesion.code);

let heroe = null; // datos de letHeroes/{clave}
let ajustes = {}; // letConfig/{teacherId}
let desfase = 0; // hora del servidor - hora de este ordenador (ms)
let reloj = null;
let cancelarEscucha = null;
let vista = "heroe";
let conectado = false; // preparar() ha ido bien

// ---------- Efectos y voz ----------

const CLAVE_EFECTOS = "letrania-efectos";
function efectos() {
  try {
    return localStorage.getItem(CLAVE_EFECTOS) !== "no";
  } catch (e) {
    return true;
  }
}
function aplicarEfectos() {
  document.body.classList.toggle("nofx", !efectos());
  const b = $("#fxTog");
  b.setAttribute("aria-pressed", efectos());
  b.textContent = "Efectos: " + (efectos() ? "sí" : "no");
}
$("#fxTog").addEventListener("click", () => {
  try {
    localStorage.setItem(CLAVE_EFECTOS, efectos() ? "no" : "si");
  } catch (e) {
    // Sin localStorage: el cambio dura hasta recargar.
  }
  aplicarEfectos();
  if (vista === "mapa") pintarMapa();
});

function hablar(t) {
  try {
    if (!("speechSynthesis" in window) || !t) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "es-ES";
    u.rate = 0.85;
    speechSynthesis.speak(u);
  } catch (e) {
    // Navegador sin síntesis de voz.
  }
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-oir]");
  if (b) hablar(b.dataset.oir);
});
const botonOir = (texto) => `<button class="oir" type="button" data-oir="${esc(texto)}">🔊 Escuchar</button>`;

function aviso(t) {
  const el = $("#toast");
  el.textContent = t;
  el.classList.add("show");
  clearTimeout(aviso._t);
  aviso._t = setTimeout(() => el.classList.remove("show"), 2800);
}

// ---------- Conexión ----------

// Igual que en pensamiento-computacional/js/nube.js: antes de leer o
// escribir hay que marcar este dispositivo como el activo del alumno.
// De paso, la hora que guarda el servidor en lastLoginAt sirve para
// saber cuánto adelanta o atrasa el reloj de este portátil.
async function preparar() {
  if (!auth.currentUser) {
    if (auth.authStateReady) await auth.authStateReady();
    if (!auth.currentUser) await signInAnonymously(auth);
  }
  const ref = doc(db, "students", sesion.code);
  await updateDoc(ref, { authUid: auth.currentUser.uid, lastLoginAt: serverTimestamp() });
  try {
    const snap = await getDocFromServer(ref);
    const t = snap.data().lastLoginAt;
    if (t && t.toMillis) desfase = t.toMillis() - Date.now();
  } catch (e) {
    desfase = 0;
  }
}

const ahora = () => Date.now() + desfase;
const ms = (t) => (t && t.toMillis ? t.toMillis() : 0);
const refHeroe = () => doc(db, "letHeroes", sesion.code);

function finDeSesion() {
  if (!heroe || !heroe.inicio) return 0;
  return ms(heroe.inicio) + (heroe.minutos || L.MINUTOS_POR_DEFECTO) * 60000;
}

// Estado de acceso, calculado igual que en las reglas.
function estado() {
  if (esDemo) return "jugando";
  if (!heroe) return "sin-heroe";
  if (!heroe.habilitado) return heroe.inicio ? "agotado" : "cerrado";
  if (!heroe.inicio) return ahora() < ms(heroe.habilitadoHasta) ? "listo" : "cerrado";
  return ahora() < finDeSesion() ? "jugando" : "agotado";
}

// ---------- Pantallas de entrada ----------

function puerta(img, titulo, texto, boton) {
  pararReloj();
  $("#juego").hidden = true;
  $("#tiempo").hidden = true;
  const g = $("#puerta");
  g.hidden = false;
  g.innerHTML = `<div class="parch gate">
      <img src="${srcImg(img)}" alt="">
      <h2>${esc(titulo)}</h2>
      <p>${esc(texto)}</p>
      ${boton || ""}
      ${uni() ? botonOir(titulo + ". " + texto) : ""}
    </div>`;
}

function uni() {
  return !!(heroe && heroe.senda === "unicornio");
}

function pintarEstado() {
  document.body.classList.toggle("uni", uni());
  const e = estado();
  if (e === "sin-heroe") {
    puerta("guardian-1", "Letrania está cerrada para ti", "Tu maestro todavía no te ha apuntado a Letrania.", `<a class="btn" href="../juegos/index.html">Volver a los juegos</a>`);
  } else if (e === "cerrado") {
    puerta("guardian-2", "Aún no es tu turno", "Tu maestro abrirá Letrania cuando llegue el momento de jugar.", `<button class="btn sea" id="comprobar">Volver a mirar</button>`);
  } else if (e === "listo") {
    const min = heroe.minutos || L.MINUTOS_POR_DEFECTO;
    puerta("cofre", "Letrania te espera", `Tienes ${min} minutos de juego. Empiezan a contar cuando pulses el botón.`, `<button class="btn" id="entrar">Entrar en Letrania</button>`);
  } else if (e === "agotado") {
    if (cancelarEscucha) {
      cancelarEscucha();
      cancelarEscucha = null;
    }
    puerta("guardian-6", "Se acabó el tiempo de hoy", "Lo has hecho muy bien. Tu héroe te espera para la próxima sesión.", `<a class="btn sea" href="../juegos/index.html">Salir</a>`);
  } else {
    $("#puerta").hidden = true;
    $("#juego").hidden = false;
    arrancarReloj();
    pintarChip();
    mostrar(vista);
  }
}

$("#puerta").addEventListener("click", async (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.id === "comprobar") {
    b.disabled = true;
    if (!conectado) {
      iniciar();
      return;
    }
    await cargarHeroe();
    pintarEstado();
  } else if (b.id === "entrar") {
    b.disabled = true;
    b.textContent = "Abriendo…";
    try {
      await updateDoc(refHeroe(), { inicio: serverTimestamp() });
      const snap = await getDocFromServer(refHeroe());
      heroe = snap.data();
      // Recién escrito: la hora de «inicio» es la del servidor ahora mismo.
      if (heroe.inicio) desfase = ms(heroe.inicio) - Date.now();
      escuchar();
      vista = heroe.retrato ? "mapa" : "heroe";
      pintarEstado();
    } catch (err) {
      await cargarHeroe();
      pintarEstado();
      aviso("No se ha podido abrir. Avisa a tu maestro.");
    }
  }
});

// ---------- Reloj ----------

function arrancarReloj() {
  if (esDemo) {
    $("#tiempo").hidden = true;
    return;
  }
  $("#tiempo").hidden = false;
  const tic = () => {
    const quedan = Math.max(0, finDeSesion() - ahora());
    const m = Math.floor(quedan / 60000);
    const s = Math.floor((quedan % 60000) / 1000);
    const t = $("#tiempo");
    t.textContent = "⏳ " + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    t.classList.toggle("low", quedan < 120000);
    t.setAttribute("aria-label", "Te quedan " + m + " minutos");
    if (quedan <= 0) pintarEstado();
  };
  tic();
  if (!reloj) reloj = setInterval(tic, 1000);
}
function pararReloj() {
  if (reloj) {
    clearInterval(reloj);
    reloj = null;
  }
}

// Solo su propio documento: si el maestro le da más minutos, le quita
// el acceso o le marca una ficha, lo ve al momento.
function escuchar() {
  if (esDemo || cancelarEscucha) return;
  cancelarEscucha = onSnapshot(
    refHeroe(),
    (snap) => {
      if (!snap.exists()) {
        heroe = null;
        pintarEstado();
        return;
      }
      const antes = heroe;
      heroe = snap.data();
      if (antes && heroe.ficha > antes.ficha) aviso("¡Has avanzado a la estación " + heroe.ficha + "!");
      else if (antes && heroe.xp > antes.xp) aviso("¡Tu maestro te ha dado " + (heroe.xp - antes.xp) + " XP!");
      if (antes && antes.nombreEstado !== heroe.nombreEstado && heroe.nombreEstado === "aprobado") aviso("¡Tu maestro ha aprobado tu nombre de héroe!");
      pintarEstado();
    },
    () => {
      // Sin conexión: se sigue con lo último que se leyó.
    }
  );
}
window.addEventListener("pagehide", () => {
  if (cancelarEscucha) cancelarEscucha();
  cancelarEscucha = null;
});

// ---------- Cabecera ----------

function nombreVisible() {
  if (heroe.nombreEstado === "aprobado" && heroe.nombre) return heroe.nombre;
  return heroe.nombrePropuesto || "Héroe sin nombre";
}
const retrato = () => heroe.retrato || "maga-1";

function pintarChip() {
  const xp = heroe.xp || 0;
  $("#heroChip").innerHTML = `<span class="face"><img src="${srcImg(retrato())}" alt=""></span>
    <div><b>${esc(nombreVisible())}</b><span style="font-size:13px;color:#bdb6dc">Nivel ${L.nivel(xp)} · ${xp} XP</span>
    <div class="xpbar"><i style="width:${xp % 100}%"></i></div></div>
    <span class="gem" title="Gemas">${L.gemaSVG}${heroe.gemas || 0}</span>`;
}

function mostrar(v) {
  vista = v;
  document.querySelectorAll("nav.tabs button[data-v]").forEach((b) => b.setAttribute("aria-selected", b.dataset.v === v));
  document.querySelectorAll(".view").forEach((s) => (s.hidden = s.id !== "v-" + v));
  if (v === "mapa") pintarMapa();
  else pintarCreador();
}
document.querySelector("nav.tabs").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-v]");
  if (!b) return;
  if (b.dataset.v === "mapa" && !heroe.retrato && !borrador.retrato) {
    aviso("Primero elige tu héroe y guárdalo.");
    return;
  }
  mostrar(b.dataset.v);
});

// ---------- Héroe ----------

let borrador = {};
let claseVista = null;

function pintarCreador() {
  if (!borrador.cargado) {
    borrador = { cargado: true, retrato: heroe.retrato || "", estandarte: heroe.estandarte || 0, nombre: heroe.nombrePropuesto || "" };
  }
  const pic = borrador.retrato || "maga-1";
  const c = L.claseDe(pic);
  if (!claseVista) claseVista = c.id;
  const cv = L.CLASES.find((x) => x.id === claseVista);
  const nombre = borrador.nombre.trim() || "Héroe sin nombre";
  $("#stage").style.setProperty("--banner", L.ESTANDARTES[borrador.estandarte] || L.ESTANDARTES[0]);
  $("#heroBig").src = srcImg(pic);
  $("#heroBig").classList.remove("falta");
  $("#heroBig").alt = nombre;
  $("#heroNm").textContent = nombre;
  $("#heroCl").textContent = c.uno + " · " + c.poder + " · " + L.SENDAS[heroe.senda].nombre;
  const input = $("#heroName");
  if (document.activeElement !== input) input.value = borrador.nombre;
  $("#clsTabs").innerHTML = L.CLASES.map((x) => `<button class="ctab" type="button" data-cls="${x.id}" aria-pressed="${x.id === claseVista}">${x.nombre}</button>`).join("");
  $("#clsDesc").innerHTML = `<b>${esc(cv.poder)}:</b> ${esc(cv.desc)}`;
  $("#portraits").innerHTML = [1, 2, 3, 4]
    .map((n) => {
      const p = cv.id + "-" + n;
      return `<button class="pcard" type="button" data-pic="${p}" aria-pressed="${borrador.retrato === p}" aria-label="Héroe ${n} de ${esc(cv.nombre)}"><img src="${srcImg(p)}" alt="" loading="lazy"></button>`;
    })
    .join("");
  $("#swBanner").innerHTML = L.ESTANDARTES.map((col, i) => `<button class="sw" type="button" data-banner="${i}" aria-pressed="${borrador.estandarte === i}" aria-label="Color ${i + 1}" style="background:${col}"></button>`).join("");
  const est = $("#nombreEstado");
  const ne = heroe.nombreEstado || "sin";
  est.className = "nombre-estado " + ne;
  est.textContent =
    ne === "aprobado"
      ? "Tu maestro ha aprobado el nombre «" + (heroe.nombre || heroe.nombrePropuesto) + "»."
      : ne === "rechazado"
      ? "Tu maestro te pide que elijas otro nombre."
      : ne === "pendiente"
      ? "Tu maestro todavía tiene que revisar el nombre."
      : "";
  $("#oirClase").innerHTML = uni() ? botonOir(cv.nombre + ". " + cv.poder + ": " + cv.desc) : "";
}

$("#v-heroe").addEventListener("click", (e) => {
  const t = e.target.closest("[data-cls],[data-pic],[data-banner]");
  if (!t) return;
  if (t.dataset.cls) claseVista = t.dataset.cls;
  if (t.dataset.pic) borrador.retrato = t.dataset.pic;
  if (t.dataset.banner !== undefined) borrador.estandarte = +t.dataset.banner;
  pintarCreador();
});
$("#heroName").addEventListener("input", (e) => {
  borrador.nombre = e.target.value;
  $("#heroNm").textContent = borrador.nombre.trim() || "Héroe sin nombre";
});

$("#saveHero").addEventListener("click", async () => {
  if (!borrador.retrato) {
    aviso("Toca uno de los retratos para elegir tu héroe.");
    return;
  }
  const nombre = borrador.nombre.trim().replace(/\s+/g, " ").slice(0, 22);
  const cambios = { retrato: borrador.retrato, estandarte: borrador.estandarte, actualizadoEn: serverTimestamp() };
  const nombreNuevo = nombre !== (heroe.nombrePropuesto || "");
  if (nombreNuevo) {
    cambios.nombrePropuesto = nombre;
    cambios.nombreEstado = nombre ? "pendiente" : "sin";
  }
  if (esDemo) {
    Object.assign(heroe, cambios);
    pintarChip();
    aviso("Vista de ejemplo: no se guarda.");
    mostrar("mapa");
    return;
  }
  const b = $("#saveHero");
  b.disabled = true;
  try {
    await updateDoc(refHeroe(), cambios);
    Object.assign(heroe, cambios);
    pintarChip();
    aviso(nombreNuevo && nombre ? "Héroe guardado. Tu maestro revisará el nombre." : "Héroe guardado.");
    setTimeout(() => mostrar("mapa"), 600);
  } catch (err) {
    aviso("No se ha podido guardar. ¿Se ha acabado el tiempo?");
    await cargarHeroe();
    pintarEstado();
  } finally {
    b.disabled = false;
  }
});

// ---------- Mapa ----------

const TRAMOS = [
  "M380,800 C470,700 470,560 430,460",
  "M430,460 C300,420 240,300 560,300",
  "M560,300 C700,420 560,720 1060,640",
  "M1060,640 C1150,420 640,420 790,240",
  "M790,240 C960,120 1160,300 1420,210",
  "M1420,210 C1570,260 1540,380 1440,440",
];
const ETIQUETAS = [[30, 880], [30, 46], [640, 880], [600, 30], [1010, 30], [1180, 570]];
let regionVista = null;

function pintarMapa() {
  const ficha = Math.min(heroe.ficha || 1, L.TOTAL_FICHAS);
  const s = L.SENDAS[heroe.senda];
  $("#sendaPill").className = "pill " + s.cls;
  $("#sendaPill").textContent = s.nombre + " · estación " + ficha;
  const host = $("#mapSvg");
  host.innerHTML = `<svg viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mapa de Letrania con seis regiones y 34 estaciones">
    <image href="${srcImg("mapa")}" x="0" y="0" width="1600" height="900" preserveAspectRatio="xMidYMid slice"/>
    <g>${TRAMOS.map((d) => `<path d="${d}" fill="none" stroke="#5a3a1e" stroke-width="9" stroke-dasharray="2 18" stroke-linecap="round" opacity=".85"/>`).join("")}</g>
    <g id="stations"></g><g id="labels"></g><g id="herotok"></g></svg>`;
  const svg = host.querySelector("svg");
  const pts = [];
  TRAMOS.forEach((d, ri) => {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", d);
    svg.appendChild(p);
    const largo = p.getTotalLength();
    const n = L.REGIONES[ri].hasta - L.REGIONES[ri].desde + 1;
    for (let i = 0; i < n; i++) {
      const q = p.getPointAtLength(largo * (ri === 0 ? (i / (n - 1)) * 0.92 + 0.04 : (i + 1) / n));
      pts.push([q.x, q.y]);
    }
    p.remove();
  });
  let st = "";
  pts.forEach((q, i) => {
    const f = i + 1;
    const ri = L.regionDe(f);
    const esG = f === L.REGIONES[ri].hasta;
    const hecha = f < ficha;
    const ahoraF = f === ficha;
    const fill = hecha ? "#e9b04a" : ahoraF ? "#c0582f" : "#fff6dd";
    const forma = esG
      ? `<rect x="-17" y="-17" width="34" height="34" transform="rotate(45)" fill="${fill}" stroke="#2b1d12" stroke-width="4"/>`
      : `<circle r="15" fill="${fill}" stroke="#2b1d12" stroke-width="4"/>`;
    st += `<g class="station" transform="translate(${q[0].toFixed(1)} ${q[1].toFixed(1)})" data-r="${ri}" tabindex="0" role="button" aria-label="Estación ${f}${esG ? ", guardián" : ""}">${ahoraF && efectos() ? '<circle r="26" fill="#c0582f" class="pulse"/>' : ""}${forma}<text y="6" font-size="17" text-anchor="middle" font-family="Andika,sans-serif" font-weight="700" fill="${hecha || ahoraF ? "#fff" : "#6b5236"}">${esG ? "" : f}</text></g>`;
  });
  host.querySelector("#stations").innerHTML = st;
  host.querySelector("#labels").innerHTML = L.REGIONES.map((r, i) => {
    const [x, y] = ETIQUETAS[i];
    const t = i + 1 + " · " + r.nombre;
    const w = t.length * 11.2 + 28;
    const yy = y > 450 ? y - 40 : y;
    return `<g class="region-hit" data-r="${i}" role="button" tabindex="0" aria-label="${esc(r.nombre)}"><rect x="${x}" y="${yy}" width="${w}" height="40" rx="20" fill="#2b1d12" fill-opacity=".82" stroke="#e9b04a" stroke-width="2"/><text x="${x + 14}" y="${yy + 27}" font-family="Uncial Antiqua,serif" font-size="19" fill="#f8d98c">${esc(t)}</text></g>`;
  }).join("");
  const hp = pts[ficha - 1];
  host.querySelector("#herotok").innerHTML = `<g class="${efectos() ? "bob" : ""}"><ellipse cx="${hp[0]}" cy="${hp[1] + 4}" rx="34" ry="9" fill="rgba(0,0,0,.35)"/><image href="${srcImg(retrato())}" x="${hp[0] - 55}" y="${hp[1] - 150}" width="110" height="150" preserveAspectRatio="xMidYMax meet"/></g>`;
  if (regionVista === null) regionVista = L.regionDe(ficha);
  pintarRegion();
  pintarBarras();
}

function pintarRegion() {
  const ficha = heroe.ficha || 1;
  const r = L.REGIONES[regionVista];
  const lista = r.c[heroe.senda];
  const actual = ficha <= L.TOTAL_FICHAS ? L.contenidoDe(ficha, heroe.senda) : "";
  const leer = r.nombre + ". " + (actual && L.regionDe(ficha) === regionVista ? "Estás en la estación " + ficha + ": " + actual + "." : "");
  $("#regionInfo").innerHTML = `<div><span class="eyebrow">Región ${regionVista + 1} · ${esc(r.lugar)}</span><h2>${esc(r.nombre)}</h2>
    <ol start="${r.desde}">${lista
      .map((t, i) => {
        const f = r.desde + i;
        const cls = f < ficha ? "done" : f === ficha ? "now" : "";
        return `<li class="${cls}">${esc(t)}${f === ficha ? " · estás aquí" : ""}</li>`;
      })
      .join("")}</ol>${uni() ? botonOir(leer) : ""}</div>
    <div class="guard"><img src="${srcImg(r.gimg)}" alt="${esc(r.guardian)}" loading="lazy"><div><span class="eyebrow" style="color:#c9b48a">Guardián de la región</span><h3>${esc(r.guardian)}</h3><p style="margin:6px 0 0">${esc(r.gdesc)}</p><p style="margin:8px 0 0;font-size:14px;color:#c9b48a">Combate de repaso con las ${lista.length} estaciones de la región. Se abre al terminar las fichas esenciales.</p></div></div>`;
}

$("#mapSvg").addEventListener("click", (e) => {
  const g = e.target.closest("[data-r]");
  if (g) {
    regionVista = +g.dataset.r;
    pintarRegion();
  }
});
$("#mapSvg").addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const g = e.target.closest("[data-r]");
  if (g) {
    e.preventDefault();
    regionVista = +g.dataset.r;
    pintarRegion();
  }
});

function pintarBarras() {
  const total = Math.max(1, ajustes.umbralAlianza || 600);
  const alianza = ajustes.alianza || 0;
  let fecha = "en junio";
  if (ajustes.fechaTesoro) {
    const d = new Date(ajustes.fechaTesoro + "T12:00:00");
    if (!isNaN(d)) fecha = "el " + d.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
  }
  $("#bars").innerHTML = `<div class="bar"><img src="${srcImg("cofre")}" alt=""><div><b>Alianza de Letrania</b> <small>· el cofre del tesoro se abre ${esc(fecha)}</small><div class="track"><i style="width:${Math.min(100, (alianza / total) * 100)}%;background:linear-gradient(90deg,#e9b04a,#f8d98c)"></i></div><small>${alianza} de ${total} gemas entre todos los héroes</small></div></div>`;
}

// ---------- Arranque ----------

async function cargarHeroe() {
  try {
    const snap = await getDoc(refHeroe());
    heroe = snap.exists() ? snap.data() : null;
  } catch (e) {
    heroe = null;
  }
}

async function iniciar() {
  aplicarEfectos();
  if (esDemo) {
    const docente = leer("ar_docente");
    $("#demo").hidden = false;
    $("#demo").innerHTML = docente && docente.uid
      ? 'Vista de ejemplo para el docente: nada de esto se guarda. <a href="docente.html">Ir al panel de Letrania</a>'
      : "Vista de ejemplo: nada de esto se guarda.";
    heroe = { senda: "dragon", ficha: 8, xp: 140, gemas: 5, retrato: "", estandarte: 0, nombrePropuesto: "", nombreEstado: "sin" };
    ajustes = { alianza: 212, umbralAlianza: 600 };
    pintarEstado();
    return;
  }
  puerta("cofre", "Abriendo Letrania…", "Un momento.", "");
  try {
    await preparar();
    conectado = true;
  } catch (e) {
    puerta("guardian-2", "No hay conexión", "Letrania necesita internet para comprobar tu acceso. Inténtalo de nuevo.", `<button class="btn sea" id="comprobar">Volver a mirar</button>`);
    return;
  }
  await cargarHeroe();
  if (heroe && heroe.teacherId) {
    try {
      const a = await getDoc(doc(db, "letConfig", heroe.teacherId));
      ajustes = a.exists() ? a.data() : {};
    } catch (e) {
      ajustes = {};
    }
  }
  if (heroe && heroe.inicio && estado() === "jugando") escuchar();
  vista = heroe && heroe.retrato ? "mapa" : "heroe";
  pintarEstado();
}

iniciar();
