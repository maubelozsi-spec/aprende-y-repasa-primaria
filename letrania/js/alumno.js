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
  arrayUnion,
  addDoc,
  collection,
  increment,
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
let equipo = null; // letEquipos/{heroe.equipo}, si tiene
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
    puerta("guardian-1", "Letrania está cerrada para ti", "Tu maestro todavía no te ha apuntado a Letrania.", `<a class="btn" href="../index.html">Volver al inicio</a>`);
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
    puerta("guardian-6", "Se acabó el tiempo de hoy", "Lo has hecho muy bien. Tu héroe te espera para la próxima sesión.", `<a class="btn sea" href="../index.html">Salir</a>`);
  } else {
    $("#puerta").hidden = true;
    $("#juego").hidden = false;
    arrancarReloj();
    pintarChip();
    // En plena prueba no se repinta: un cambio de su héroe (el premio
    // recién guardado, por ejemplo) no debe cortar la partida.
    if (vista !== "prueba") mostrar(vista);
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
  if (v !== "prueba" && juego) juego.pararArcade();
  document.querySelectorAll("nav.tabs button[data-v]").forEach((b) => b.setAttribute("aria-selected", b.dataset.v === v));
  document.querySelectorAll(".view").forEach((s) => (s.hidden = s.id !== "v-" + v));
  if (v === "mapa") pintarMapa();
  else if (v === "prueba") abrirPrueba();
  else if (v === "equipo") abrirEquipo();
  else pintarCreador();
}
document.querySelector("nav.tabs").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-v]");
  if (!b) return;
  if (b.dataset.v !== "heroe" && !heroe.retrato) {
    aviso("Primero elige tu héroe y guárdalo.");
    return;
  }
  mostrar(b.dataset.v);
});

// ---------- Prueba de hoy (js/juego.js y el banco de su senda) ----------

let juego = null;
let partidasGuardadas = 0;
const cargados = {};

function cargarScript(src) {
  if (!cargados[src]) {
    cargados[src] = new Promise((ok, mal) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = ok;
      s.onerror = mal;
      document.head.appendChild(s);
    });
  }
  return cargados[src];
}

// Solo se descarga el banco de su senda (y los pictogramas, si es la
// Senda del Unicornio): menos peso para los portátiles del centro.
let preparandoJuego = null;
function abrirPrueba() {
  // Una sola vez aunque se llame dos veces seguidas (pestaña + «Combatir»):
  // dos motores sobre la misma sección responderían a la vez.
  if (!preparandoJuego) preparandoJuego = crearJuego().finally(() => (preparandoJuego = null));
  return preparandoJuego.then(() => juego && juego.mostrar());
}

async function crearJuego() {
  const v = $("#v-prueba");
  if (!juego) {
    v.innerHTML = '<div class="parch"><p style="margin:0">Preparando la prueba…</p></div>';
    try {
      await cargarScript("js/bancos/util.js");
      await cargarScript("js/bancos/" + heroe.senda + ".js");
      await cargarScript("js/juego.js");
      await cargarScript("js/arcade.js");
      if (uni()) await cargarScript("../js/arasaac.js").catch(() => {});
    } catch (e) {
      v.innerHTML = '<div class="parch"><p style="margin:0">No se ha podido cargar la prueba. Comprueba la conexión.</p></div>';
      return;
    }
    juego = window.LetraniaJuego.crear({
      contenedor: v,
      heroe: () => heroe,
      banco: window.LetraniaBanco.bancos[heroe.senda],
      clave: esDemo ? "" : sesion.code,
      efectos: efectos,
      hablar: hablar,
      alTerminar: guardarResultado,
      alMapa: () => mostrar("mapa"),
      cartas: () => heroe.recibidas || {},
      usarCarta: usarCarta,
      poder: poderActual,
      usarPoder: usarPoder,
      arcadeDisponible: arcadeDisponible,
      guardarArcade: guardarArcade,
    });
    $("#atribucion").hidden = !uni();
  }
}

// ---------- Cartas recibidas y poder de clase ----------

async function usarCarta(tipo) {
  const quedan = (heroe.recibidas || {})[tipo] || 0;
  if (quedan <= 0) return false;
  if (esDemo) {
    heroe.recibidas[tipo] = quedan - 1;
    return true;
  }
  try {
    await updateDoc(refHeroe(), { ["recibidas." + tipo]: increment(-1) });
    if (!heroe.recibidas) heroe.recibidas = {};
    heroe.recibidas[tipo] = quedan - 1;
    return true;
  } catch (e) {
    aviso("No se ha podido usar la carta.");
    return false;
  }
}

function poderActual() {
  const clase = L.claseDe(heroe.retrato).id;
  const region = Math.min(L.regionDe(heroe.ficha) + 1, L.REGIONES.length);
  return { clase: clase, region: region, disponible: (heroe.poderes || []).indexOf(region) === -1, ...L.PODERES[clase] };
}

async function usarPoder(extra) {
  const p = poderActual();
  if (!p.disponible) return false;
  if (esDemo) {
    heroe.poderes = (heroe.poderes || []).concat([p.region]);
    if (extra && extra.trazo) heroe.trazo = true;
    return true;
  }
  try {
    await updateDoc(refHeroe(), Object.assign({ poderes: arrayUnion(p.region) }, extra || {}));
    heroe.poderes = (heroe.poderes || []).concat([p.region]);
    return true;
  } catch (e) {
    aviso("No se ha podido usar el poder.");
    return false;
  }
}

// Combate contra el guardián de una región: si gana (70 % a la primera),
// +15 XP una sola vez por región. Perder no quita nada.
async function guardarGuardian(r) {
  const gana = r.aciertos >= Math.ceil(r.total * 0.7);
  const ya = (heroe.guardianes || []).indexOf(r.region) !== -1;
  if (!gana || ya) return { guardian: true, gana: gana, ya: ya };
  if (!esDemo) await updateDoc(refHeroe(), { guardianes: arrayUnion(r.region), xp: increment(L.XP_GUARDIAN) });
  heroe.guardianes = (heroe.guardianes || []).concat([r.region]);
  if (esDemo) heroe.xp += L.XP_GUARDIAN;
  pintarChip();
  return { guardian: true, gana: true, xp: L.XP_GUARDIAN };
}

// El guardián se puede retar al terminar las fichas esenciales de su
// región (las que el maestro no ha marcado como opcionales) y si esa
// región ya tiene banco de ítems.
function guardianDisponible(region) {
  const r = L.REGIONES[region - 1];
  const opcionales = ajustes.opcionales || [];
  const esenciales = [];
  for (let f = r.desde; f <= r.hasta; f++) if (opcionales.indexOf(f) === -1) esenciales.push(f);
  const ultima = esenciales.length ? esenciales[esenciales.length - 1] : r.desde - 1;
  return (heroe.ficha || 1) > ultima;
}

// ---------- Mi equipo ----------

async function cargarEquipo() {
  if (esDemo || !heroe || !heroe.equipo) {
    equipo = esDemo ? equipo : null;
    return;
  }
  try {
    const snap = await getDoc(doc(db, "letEquipos", heroe.equipo));
    equipo = snap.exists() ? snap.data() : null;
  } catch (e) {
    // Sin conexión: se queda lo último que se leyó.
  }
}

function companeros() {
  if (!equipo) return [];
  return Object.keys(equipo.miembros || {})
    .filter((id) => id !== heroe.heroeId)
    .map((id) => Object.assign({ id: id }, equipo.miembros[id]));
}

const nombrePublico = (m) => m.nombre || "Héroe en revisión";

async function abrirEquipo() {
  await cargarEquipo();
  pintarEquipo();
}

function pintarEquipo() {
  const v = $("#v-equipo");
  const mios = heroe.cartas || [];
  const recibidas = heroe.recibidas || {};
  let cabecera;
  if (!equipo) {
    cabecera = `<div class="parch"><h2>Mi equipo</h2><p class="muted">Tu maestro todavía no te ha puesto en un equipo. Mientras, puedes guardar tus cartas: en cuanto tengas equipo, podrás regalarlas.</p></div>`;
  } else {
    const miembros = Object.keys(equipo.miembros || {}).map((id) => Object.assign({ id: id }, equipo.miembros[id]));
    const umbral = ajustes.esenciaPuerta || L.ESENCIA_PUERTA;
    const puertas = equipo.puertas || [];
    const siguiente = [1, 2, 3, 4, 5, 6].find((r) => puertas.indexOf(r) === -1);
    const necesita = umbral * (puertas.length + 1);
    const sinSello = siguiente ? miembros.filter((m) => (m.ficha || 1) <= L.REGIONES[siguiente - 1].desde) : [];
    cabecera = `<div class="parch"><span class="eyebrow">Mi equipo</span><h2>${esc(equipo.nombre)}</h2>
      <p class="muted" style="margin:4px 0 0">Para abrir la puerta de una región, cada miembro tiene que aportar un sello (una ficha terminada en esa región) y el equipo tiene que reunir la esencia necesaria. Al abrirla, cada uno gana una carta.</p>
      <div class="team">${miembros
        .map((m) => `<div class="member">${m.retrato ? `<img src="${srcImg(m.retrato)}" alt="" loading="lazy">` : '<div class="member-vacio"></div>'}<b>${esc(nombrePublico(m))}${m.id === heroe.heroeId ? " (tú)" : ""}</b><span class="pill ${L.SENDAS[m.senda].cls}">${L.SENDAS[m.senda].nombre}</span><small>Estación ${Math.min(m.ficha || 1, L.TOTAL_FICHAS)} · ${m.gemas || 0} gemas</small></div>`)
        .join("")}</div></div>
      <div class="bars"><div class="bar"><svg width="54" height="54" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2h8l3 4-7 8-7-8z" fill="#5fd3c4" stroke="#bff0e8" stroke-width=".6"/></svg><div><b>Esencia del equipo</b> <small>· ${siguiente ? "puerta de " + esc(L.REGIONES[siguiente - 1].nombre) : "todas las puertas abiertas"}</small><div class="track"><i style="width:${Math.min(100, ((equipo.esencia || 0) / necesita) * 100)}%;background:linear-gradient(90deg,#2f9a92,#5fd3c4)"></i></div><small>${equipo.esencia || 0} de ${necesita}${sinSello.length ? " · falta el sello de: " + sinSello.map((m) => (m.id === heroe.heroeId ? "tu héroe" : esc(nombrePublico(m)))).join(", ") : ""}</small></div></div>
      <div class="bar"><img src="${srcImg("cofre")}" alt=""><div><b>Puertas abiertas</b><div><small>${puertas.length ? puertas.map((r) => esc(L.REGIONES[r - 1].nombre)).join(" · ") : "Todavía ninguna"}</small></div></div></div></div>`;
  }
  const otros = companeros();
  const pausado = !!heroe.regalosPausados;
  const cartasRegalo = mios.length
    ? mios
        .map((c, i) => `<div class="card"><h3>${esc(L.CARTAS[c].nombre)}</h3><p>${esc(L.CARTAS[c].desc)}</p>
          ${otros.length && !pausado
            ? `<label style="font-size:14px">Regalar a <select id="regalo-${i}">${otros.map((o) => `<option value="${esc(o.id)}">${esc(nombrePublico(o))}</option>`).join("")}</select></label><button class="btn" type="button" data-regalar="${i}">Regalar</button>`
            : `<small>${pausado ? "Los regalos de tu equipo están en pausa." : "Podrás regalarla cuando tengas equipo."}</small>`}</div>`)
        .join("")
    : '<p class="muted">No tienes cartas para regalar. Ganarás una al terminar tu próxima ficha.</p>';
  const usables = L.TIPOS_CARTA.filter((t) => (recibidas[t] || 0) > 0);
  const cartasUso = usables.length
    ? usables
        .map((t) => `<div class="card"><h3>${esc(L.CARTAS[t].nombre)} × ${recibidas[t]}</h3><p>${esc(L.CARTAS[t].desc)}</p>${t === "llave" ? '<button class="btn sea" type="button" id="usarLlave">Abrir el cofre</button>' : "<small>Se usa en la Prueba de hoy.</small>"}</div>`)
        .join("")
    : '<p class="muted">Todavía no te han regalado cartas.</p>';
  const p = poderActual();
  v.innerHTML = `${cabecera}
    <div class="parch" style="margin-top:16px"><h2>Cartas para regalar</h2><p class="muted" style="margin:4px 0 0">Estas cartas no puedes usarlas tú: solo puedes regalarlas a un compañero de tu equipo. Le llegan en cuanto tu maestro tenga abierto su panel.</p><div class="cards">${cartasRegalo}</div>${(heroe.regalos || []).length ? `<p class="nota">Regalos de camino: ${heroe.regalos.length}.</p>` : ""}</div>
    <div class="parch" style="margin-top:16px"><h2>Cartas que te han regalado</h2><div class="cards">${cartasUso}</div></div>
    <div class="parch" style="margin-top:16px"><h2>Tu poder: ${esc(p.nombre)}</h2><p class="muted" style="margin:4px 0 0">${esc(p.desc)} Una vez por región.</p><p><b>${p.disponible ? "Disponible en esta región." : "Ya lo has usado en esta región."}</b></p>
      ${p.clase === "maga" && p.disponible ? '<button class="btn" type="button" id="usarTrazo">Usar Trazo mágico en la próxima ficha</button>' : ""}
      ${p.clase === "maga" && heroe.trazo ? '<p class="nota">Trazo mágico preparado: tu maestro lo aplicará al corregir tu buena letra.</p>' : ""}</div>`;
}

$("#v-equipo").addEventListener("click", async (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.regalar !== undefined) {
    const i = +b.dataset.regalar;
    const carta = (heroe.cartas || [])[i];
    const para = $("#regalo-" + i).value;
    const destino = companeros().find((o) => o.id === para);
    if (!carta || !destino) return;
    const cartas = heroe.cartas.slice();
    cartas.splice(i, 1);
    const regalos = (heroe.regalos || []).concat([{ carta: carta, para: para }]);
    b.disabled = true;
    try {
      if (!esDemo) await updateDoc(refHeroe(), { cartas: cartas, regalos: regalos });
      heroe.cartas = cartas;
      heroe.regalos = regalos;
      aviso("Has regalado «" + L.CARTAS[carta].nombre + "» a " + nombrePublico(destino) + ".");
    } catch (err) {
      aviso("No se ha podido regalar. ¿Se ha acabado el tiempo?");
    }
    pintarEquipo();
  } else if (b.id === "usarLlave") {
    b.disabled = true;
    try {
      if (!esDemo) await updateDoc(refHeroe(), { "recibidas.llave": increment(-1), xp: increment(L.XP_LLAVE) });
      heroe.recibidas.llave--;
      if (esDemo) heroe.xp += L.XP_LLAVE;
      aviso("¡Cofre abierto! +" + L.XP_LLAVE + " XP");
      pintarChip();
    } catch (err) {
      aviso("No se ha podido abrir el cofre.");
    }
    pintarEquipo();
  } else if (b.id === "usarTrazo") {
    if (await usarPoder({ trazo: true })) {
      heroe.trazo = true;
      aviso("Trazo mágico preparado para tu próxima ficha.");
    }
    pintarEquipo();
  }
});

// Premio de la sesión: hasta 20 XP (mínimo 5 por jugar) y 1-2 gemas,
// UNA vez por sesión (firestore.rules lo comprueba con «premio», que
// queda igual a «inicio»). Las rondas siguientes son de entrenamiento.
// «repaso» guarda lo fallado para el calentamiento de otro día.
async function guardarResultado(r) {
  if (r.modo === "guardian") return guardarGuardian(r);
  const yaPremiado = !!(heroe.premio && heroe.inicio && ms(heroe.premio) === ms(heroe.inicio));
  const fallados = new Set(r.fallados);
  const repaso = (heroe.repaso || [])
    .filter((id) => r.acertadosRepaso.indexOf(id) === -1 && !fallados.has(id))
    .concat(r.fallados)
    .slice(-30);
  const xp = Math.min(20, 5 + 2 * r.aciertos);
  const gemasBase = r.aciertos >= Math.ceil(r.total * 0.7) ? 2 : 1;
  const doble = !!r.doble && ((heroe.recibidas || {}).doble || 0) > 0 && !yaPremiado;
  const gemas = doble ? gemasBase * 2 : gemasBase;
  // Racha: cada 3 sesiones seguidas con premio, un cofre (una carta más).
  const racha = (heroe.racha || 0) + 1;
  const cofre = racha % L.RACHA_COFRE === 0;
  const carta = L.TIPOS_CARTA[Math.floor(Math.random() * L.TIPOS_CARTA.length)];
  if (esDemo) {
    heroe.repaso = repaso;
    if (heroe.premiadoDemo) return { yaPremiado: true };
    heroe.premiadoDemo = true;
    heroe.xp += xp;
    heroe.gemas += gemas;
    heroe.racha = racha;
    if (cofre) heroe.cartas = (heroe.cartas || []).concat([carta]);
    pintarChip();
    return { xp: xp, gemas: gemas, racha: racha, cofre: cofre ? carta : null, doble: doble };
  }
  let premio;
  if (!yaPremiado) {
    const cambios = { xp: increment(xp), gemas: increment(gemas), premio: heroe.inicio, repaso: repaso, racha: increment(1) };
    if (cofre) cambios.cartas = (heroe.cartas || []).concat([carta]);
    if (doble) cambios["recibidas.doble"] = increment(-1);
    await updateDoc(refHeroe(), cambios);
    premio = { xp: xp, gemas: gemas, racha: racha, cofre: cofre ? carta : null, doble: doble };
  } else {
    if (repaso.join() !== (heroe.repaso || []).join()) await updateDoc(refHeroe(), { repaso: repaso });
    premio = { yaPremiado: true };
  }
  // Registro para el informe del maestro (contenidos más fallados). Como
  // mucho 6 rondas por sesión, para no gastar escrituras.
  if (partidasGuardadas < 6) {
    partidasGuardadas++;
    const hoy = new Date(ahora());
    const dia = hoy.getFullYear() + "-" + String(hoy.getMonth() + 1).padStart(2, "0") + "-" + String(hoy.getDate()).padStart(2, "0");
    addDoc(collection(db, "letPartidas"), {
      teacherId: heroe.teacherId,
      clave: sesion.code,
      ficha: r.ficha,
      senda: heroe.senda,
      plantilla: r.plantilla,
      contenido: r.titulo,
      aciertos: r.aciertos,
      total: r.total,
      fallados: r.fallados.slice(0, 40),
      palabras: r.palabras.slice(0, 40).map((p) => String(p).slice(0, 60)),
      premio: !yaPremiado,
      dia: dia,
      fecha: serverTimestamp(),
    }).catch(() => {});
  }
  return premio;
}

// ---------- Juego de recompensa ----------
// Uno con premio por sesión (1-5 XP, nunca gemas), solo después de
// cobrar el premio de la prueba. Las repeticiones solo guardan el récord
// de la región (records.r1…r6). Las reglas imponen los mismos límites.

function arcadeDisponible() {
  if (esDemo) return heroe.arcadeDemo ? "libre" : "premio";
  const cobrado = heroe.premio && heroe.inicio && ms(heroe.premio) === ms(heroe.inicio);
  if (!cobrado) return null;
  return heroe.arcade && ms(heroe.arcade) === ms(heroe.inicio) ? "libre" : "premio";
}

async function guardarArcade(region, puntos) {
  const tipo = arcadeDisponible();
  const clave = "r" + region;
  const records = Object.assign({}, heroe.records || {});
  const antes = records[clave] || 0;
  const nuevo = puntos > antes;
  if (nuevo) records[clave] = Math.min(Math.round(puntos), 99999);
  const xp = tipo === "premio" ? window.LetraniaArcade.xpDe(region, puntos, uni()) : 0;
  if (esDemo) {
    if (xp) {
      heroe.arcadeDemo = true;
      heroe.xp += xp;
      pintarChip();
    }
    heroe.records = records;
    return { xp: xp, record: Math.max(antes, puntos), nuevo: nuevo };
  }
  const cambios = {};
  if (xp) {
    cambios.xp = increment(xp);
    cambios.arcade = heroe.inicio;
  }
  if (nuevo) cambios.records = records;
  if (Object.keys(cambios).length) await updateDoc(refHeroe(), cambios);
  // Hasta que llegue el aviso de Firestore, para no ofrecer otro premio.
  if (xp) heroe.arcade = heroe.inicio;
  heroe.records = records;
  return { xp: xp, record: Math.max(antes, puntos), nuevo: nuevo };
}

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
    <div class="guard"><img src="${srcImg(r.gimg)}" alt="${esc(r.guardian)}" loading="lazy"><div><span class="eyebrow" style="color:#c9b48a">Guardián de la región</span><h3>${esc(r.guardian)}</h3><p style="margin:6px 0 0">${esc(r.gdesc)}</p>${pieGuardian(regionVista + 1, lista.length)}</div></div>`;
}

function pieGuardian(region, n) {
  if ((heroe.guardianes || []).indexOf(region) !== -1) return '<p style="margin:8px 0 0;color:var(--gold-2)"><b>¡Derrotado!</b> Has vencido a este guardián.</p>';
  if (guardianDisponible(region)) return `<p style="margin:8px 0 0;font-size:14px;color:#c9b48a">Combate de repaso con las ${n} estaciones de la región.</p><button class="btn" type="button" data-combatir="${region}" style="margin-top:8px">Combatir</button>`;
  return `<p style="margin:8px 0 0;font-size:14px;color:#c9b48a">Combate de repaso con las ${n} estaciones de la región. Se abre al terminar las fichas esenciales.</p>`;
}

$("#regionInfo").addEventListener("click", async (e) => {
  if (e.target.closest("#cerrarTesoro")) return pintarRegion();
  const b = e.target.closest("[data-combatir]");
  if (!b) return;
  mostrar("prueba");
  await abrirPrueba();
  if (juego) juego.combatir(+b.dataset.combatir);
});

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
  const eq = equipo
    ? `<div class="bar"><svg width="54" height="54" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2h8l3 4-7 8-7-8z" fill="#5fd3c4" stroke="#bff0e8" stroke-width=".6"/></svg><div><b>${esc(equipo.nombre)}</b> <small>· esencia del equipo</small><div class="track"><i style="width:${Math.min(100, ((equipo.esencia || 0) / ((ajustes.esenciaPuerta || L.ESENCIA_PUERTA) * ((equipo.puertas || []).length + 1))) * 100)}%;background:linear-gradient(90deg,#2f9a92,#5fd3c4)"></i></div><small>${equipo.esencia || 0} de ${(ajustes.esenciaPuerta || L.ESENCIA_PUERTA) * ((equipo.puertas || []).length + 1)} para la próxima puerta</small></div></div>`
    : "";
  const abierto = L.tesoroAbierto(ajustes.fechaTesoro);
  $("#bars").innerHTML = eq + `<div class="bar"><img src="${srcImg("cofre")}" alt=""><div><b>Alianza de Letrania</b> <small>· ${abierto ? "¡el cofre del tesoro está abierto!" : "el cofre del tesoro se abre " + esc(fecha)}</small><div class="track"><i style="width:${Math.min(100, (alianza / total) * 100)}%;background:linear-gradient(90deg,#e9b04a,#f8d98c)"></i></div><small>${alianza} de ${total} gemas entre todos los héroes</small>${abierto ? '<br><button class="btn" type="button" id="verTesoro" style="margin-top:8px">Entrar en la Cámara del Tesoro</button>' : ""}</div></div>`;
}

// Cámara del Tesoro: toda la clase unida vence a Borrón. Las piezas
// dependen de las gemas de la Alianza (al menos una); lo que hay dentro
// lo decide y lo entrega el maestro.
function pintarTesoro() {
  const r = L.REGIONES[5];
  const piezas = L.piezasTesoro(ajustes.alianza, ajustes.umbralAlianza);
  const huecos = Array.from({ length: L.PIEZAS_TESORO }, (x, i) =>
    `<span class="pieza-tesoro ${i < piezas ? "ganada" : ""}" aria-hidden="true">${i < piezas ? L.gemaSVG : ""}</span>`
  ).join("");
  const texto = piezas === L.PIEZAS_TESORO
    ? "¡La Alianza ha llenado el cofre! Habéis recuperado las " + L.PIEZAS_TESORO + " piezas del tesoro."
    : "La Alianza ha recuperado " + piezas + (piezas === 1 ? " pieza" : " piezas") + " de " + L.PIEZAS_TESORO + " del tesoro.";
  $("#regionInfo").innerHTML = `<div class="tesoro"><span class="eyebrow">Región 6 · ${esc(r.lugar)}</span><h2>La Cámara del Tesoro</h2>
    <p>El hechicero Borrón ha sido vencido por toda la clase unida: las palabras vuelven a Letrania.</p>
    <div class="cofre-abierto ${efectos() ? "brilla" : ""}"><img src="${srcImg("cofre")}" alt="El cofre del tesoro, abierto"></div>
    <div class="piezas-tesoro" role="img" aria-label="${piezas} de ${L.PIEZAS_TESORO} piezas">${huecos}</div>
    <p><b>${esc(texto)}</b> Tu maestro te contará qué había dentro.</p>
    ${uni() ? botonOir(texto + " Tu maestro te contará qué había dentro.") : ""}
    <button class="btn ghost" type="button" id="cerrarTesoro">Volver al mapa</button></div>`;
  if (efectos()) setTimeout(() => document.querySelector(".cofre-abierto") && document.querySelector(".cofre-abierto").classList.add("abierto"), 50);
  $("#regionInfo").scrollIntoView({ behavior: efectos() ? "smooth" : "auto", block: "start" });
}

$("#bars").addEventListener("click", (e) => {
  if (e.target.closest("#verTesoro")) pintarTesoro();
});

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
    heroe = { senda: "dragon", ficha: 8, xp: 140, gemas: 5, retrato: "", estandarte: 0, nombrePropuesto: "", nombreEstado: "sin", heroeId: "demo", cartas: ["pista", "lupa"], recibidas: { segunda: 1, lupa: 1, doble: 1, llave: 1 }, poderes: [], guardianes: [], racha: 2 };
    ajustes = { alianza: 212, umbralAlianza: 600, esenciaPuerta: 20 };
    equipo = {
      nombre: "Equipo de ejemplo",
      esencia: 14,
      puertas: [],
      miembros: {
        demo: { retrato: "guard-1", nombre: "Tu héroe", senda: "dragon", ficha: 8, gemas: 5 },
        d2: { retrato: "bardo-2", nombre: "Flor de Salina", senda: "unicornio", ficha: 7, gemas: 4 },
        d3: { retrato: "maga-3", nombre: "", senda: "grifo", ficha: 6, gemas: 5 },
      },
    };
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
  await cargarEquipo();
  if (heroe && heroe.inicio && estado() === "jugando") escuchar();
  vista = heroe && heroe.retrato ? "mapa" : "heroe";
  pintarEstado();
}

iniciar();
