// ============================================================
// Cifras y Letras — modo Práctica (entrenamiento en solitario).
// No usa Firebase para nada: todo pasa en el dispositivo, con el
// mismo motor y el mismo diccionario que las partidas de verdad.
// El alumno elige la prueba, sortea, juega contra el reloj (o sin
// él) y ve al momento sus puntos, la mejor palabra posible o una
// manera exacta de llegar al objetivo. Las marcas se guardan en
// localStorage.
// ============================================================

import {
  sortearLetra, sortearLetrasAutomatico, sortearRondaCifras, mejoresPalabras,
  puntosLetras, puntosCifras, normalizarPalabra, textoSolucion,
} from "./motor.js";
import { enDiccionario, formaBonita, todasLasFormas, enlaceRae } from "./diccionario.js";
import { aviso, el, escapaHtml, formatoTiempo } from "./comun.js";

const $ = el;
const CLAVE_MARCAS = "cyl_practica";

let config = null;   // { tiempo, numLetras, nivel, ayuda }
let ronda = null;    // ver empezarLetras() / empezarCifras()
let local = null;    // estado de juego (selección, pasos…)
let reloj = null;
let marcas = cargarMarcas();
let puntosSesion = 0;

// ---------- arranque ----------

document.addEventListener("DOMContentLoaded", () => {
  $("btn-practicar-letras").addEventListener("click", () => { leerConfig(); empezarLetras(); });
  $("btn-practicar-cifras").addEventListener("click", () => { leerConfig(); empezarCifras(); });
  $("btn-abandonar").addEventListener("click", volverAConfig);

  // Recupera la última configuración usada.
  const cfg = marcas.config || {};
  if (cfg.tiempo != null) $("cfg-tiempo").value = String(cfg.tiempo);
  if (cfg.numLetras) $("cfg-numletras").value = String(cfg.numLetras);
  if (cfg.nivel) $("cfg-nivel").value = String(cfg.nivel);
  if (cfg.ayuda) $("cfg-ayuda").value = cfg.ayuda;

  pintarMarcas();
});

function leerConfig() {
  config = {
    tiempo: Number($("cfg-tiempo").value),
    numLetras: Number($("cfg-numletras").value),
    nivel: Number($("cfg-nivel").value),
    ayuda: $("cfg-ayuda").value,
  };
  marcas.config = config;
  guardarMarcas();
}

function mostrarVista(nombre) {
  ["config", "ronda"].forEach((v) => $("vista-" + v).classList.toggle("activa", v === nombre));
}

function volverAConfig() {
  pararReloj();
  ronda = null;
  mostrarVista("config");
  pintarMarcas();
}

// ---------- marcas en localStorage ----------

function cargarMarcas() {
  try { return JSON.parse(localStorage.getItem(CLAVE_MARCAS)) || {}; } catch (e) { return {}; }
}
function guardarMarcas() {
  try { localStorage.setItem(CLAVE_MARCAS, JSON.stringify(marcas)); } catch (e) { /* sin localStorage */ }
}

// esExtra: puntos añadidos a una ronda ya contada (el comodín de la
// RAE en letras), para no sumar la ronda dos veces a las marcas.
function apuntarPuntos(tipo, puntos, esExtra) {
  puntosSesion += puntos;
  marcas.totales = marcas.totales || { letras: 0, cifras: 0, rondas: 0 };
  marcas.totales[tipo] += puntos;
  if (!esExtra) marcas.totales.rondas += 1;
  ronda.puntosTotales = (ronda.puntosTotales || 0) + puntos;
  marcas.records = marcas.records || {};
  if (!marcas.records[tipo] || ronda.puntosTotales > marcas.records[tipo]) marcas.records[tipo] = ronda.puntosTotales;
  guardarMarcas();
}

function pintarMarcas() {
  const t = marcas.totales || { letras: 0, cifras: 0, rondas: 0 };
  const r = marcas.records || {};
  $("zona-marcas").innerHTML =
    '<div class="chips-jugadores">' +
    '<span class="chip">🎯 Rondas practicadas: <strong>' + t.rondas + "</strong></span>" +
    '<span class="chip">🔤 Puntos en letras: <strong>' + t.letras + "</strong></span>" +
    '<span class="chip">🔢 Puntos en cifras: <strong>' + t.cifras + "</strong></span>" +
    '<span class="chip">⭐ Mejor ronda de letras: <strong>' + (r.letras || 0) + "</strong></span>" +
    '<span class="chip">⭐ Mejor ronda de cifras: <strong>' + (r.cifras || 0) + "</strong></span>" +
    (puntosSesion ? '<span class="chip">🔥 Hoy llevas: <strong>' + puntosSesion + "</strong></span>" : "") +
    "</div>";
}

// ---------- reloj ----------

function empezarReloj() {
  pararReloj();
  if (!config.tiempo) return; // sin límite
  ronda.finMs = Date.now() + config.tiempo * 1000;
  reloj = setInterval(() => {
    const seg = segundosRestantes();
    const elReloj = $("reloj-practica");
    if (elReloj) {
      elReloj.textContent = formatoTiempo(seg);
      elReloj.classList.toggle("apurado", seg <= 10);
      const barra = $("barra-practica");
      if (barra) barra.style.width = (100 * seg / config.tiempo) + "%";
    }
    if (seg <= 0) {
      aviso("⏰ ¡Tiempo!", "info");
      comprobar();
    }
  }, 400);
}

function pararReloj() {
  if (reloj) { clearInterval(reloj); reloj = null; }
}

function segundosRestantes() {
  if (!config.tiempo || !ronda || !ronda.finMs) return 0;
  return Math.max(0, Math.ceil((ronda.finMs - Date.now()) / 1000));
}

function cabeceraTiempo() {
  if (!config.tiempo) return '<p class="texto-suave centrado">Sin límite de tiempo: piensa con calma.</p>';
  return '<div class="reloj" id="reloj-practica">' + formatoTiempo(segundosRestantes() || config.tiempo) + "</div>" +
    '<div class="barra-tiempo"><div id="barra-practica" style="width:100%"></div></div>';
}

// ============================================================
//  LETRAS
// ============================================================

function empezarLetras() {
  ronda = { tipo: "letras", fase: "sorteo", letras: [], finMs: null };
  local = { seleccion: [], validadaAMano: false };
  mostrarVista("ronda");
  pintarLetras();
}

function pintarLetras() {
  const z = $("zona-juego");
  const max = config.numLetras;

  // ----- sorteo: el alumno pide vocal o consonante -----
  if (ronda.fase === "sorteo") {
    let fichas = "";
    for (let i = 0; i < max; i++) {
      const l = ronda.letras[i];
      fichas += '<button class="ficha-letra' + (l ? "" : " hueco") + '" disabled>' + (l || "·") + "</button>";
    }
    const lleno = ronda.letras.length >= max;
    z.innerHTML =
      '<h3><span class="etiqueta-ronda etiqueta-letras">Letras</span> · Sorteo del panel (' + ronda.letras.length + "/" + max + ")</h3>" +
      '<p class="texto-suave">Pide «vocal» o «consonante», como en la tele.</p>' +
      '<div class="panel-fichas">' + fichas + "</div>" +
      '<div class="botones-operaciones">' +
      '<button class="btn btn-letras" id="btn-vocal"' + (lleno ? " disabled" : "") + ">Vocal</button>" +
      '<button class="btn btn-letras" id="btn-consonante"' + (lleno ? " disabled" : "") + ">Consonante</button>" +
      '<button class="btn btn-secundario" id="btn-auto">Completar solo 🎲</button>' +
      '<button class="btn btn-principal btn-grande" id="btn-empezar"' + (lleno ? "" : " disabled") + ">⏱️ ¡A jugar!</button>" +
      "</div>";
    $("btn-vocal").addEventListener("click", () => { ronda.letras.push(sortearLetra("vocal", ronda.letras)); pintarLetras(); });
    $("btn-consonante").addEventListener("click", () => { ronda.letras.push(sortearLetra("consonante", ronda.letras)); pintarLetras(); });
    $("btn-auto").addEventListener("click", () => {
      const faltan = max - ronda.letras.length;
      ronda.letras = ronda.letras.concat(sortearLetrasAutomatico(max).slice(0, faltan));
      pintarLetras();
    });
    $("btn-empezar").addEventListener("click", () => { ronda.fase = "jugando"; empezarReloj(); pintarLetras(); });
    return;
  }

  // ----- jugando: marcar letras y construir la palabra debajo -----
  if (ronda.fase === "jugando") {
    const usadas = new Set(local.seleccion);
    const fichas = ronda.letras.map((l, i) =>
      '<button class="ficha-letra' + (usadas.has(i) ? " usada" : "") + '" data-letra="' + i + '"' +
      (usadas.has(i) ? " disabled" : "") + ">" + l + "</button>").join("");
    const palabra = local.seleccion.map((i, pos) =>
      '<button class="ficha-letra" data-quitar="' + pos + '">' + ronda.letras[i] + "</button>").join("");

    z.innerHTML =
      '<h3><span class="etiqueta-ronda etiqueta-letras">Letras</span> · ¡Forma tu palabra!</h3>' +
      cabeceraTiempo() +
      '<div class="panel-fichas">' + fichas + "</div>" +
      '<div class="zona-palabra">' + (palabra || '<span class="aviso-vacia">tu palabra aparecerá aquí…</span>') + "</div>" +
      '<div class="botones-operaciones">' +
      '<button class="btn btn-secundario" id="btn-borrar">⌫ Borrar última</button>' +
      '<button class="btn btn-secundario" id="btn-limpiar">🧹 Empezar de nuevo</button>' +
      '<button class="btn btn-principal btn-grande" id="btn-comprobar"' + (local.seleccion.length ? "" : " disabled") + ">✅ Comprobar palabra</button>" +
      "</div>";

    z.querySelectorAll("[data-letra]").forEach((b) => b.addEventListener("click", () => {
      local.seleccion.push(Number(b.dataset.letra));
      pintarLetras();
    }));
    z.querySelectorAll("[data-quitar]").forEach((b) => b.addEventListener("click", () => {
      local.seleccion.splice(Number(b.dataset.quitar), 1);
      pintarLetras();
    }));
    $("btn-borrar").addEventListener("click", () => { local.seleccion.pop(); pintarLetras(); });
    $("btn-limpiar").addEventListener("click", () => { local.seleccion = []; pintarLetras(); });
    $("btn-comprobar").addEventListener("click", comprobar);
    return;
  }

  // ----- resultado -----
  pintarResultadoLetras(z);
}

function pintarResultadoLetras(z) {
  const palabra = local.seleccion.map((i) => ronda.letras[i]).join("");
  const larga = normalizarPalabra(palabra).length >= 2;
  const enDic = larga && enDiccionario(palabra);
  const valida = enDic || local.validadaAMano;
  const puntos = valida ? puntosLetras(palabra, ronda.letras.length) : 0;

  let veredicto;
  if (!larga) {
    veredicto = "<p class='centrado' style='font-size:1.2rem;'>😅 No te ha dado tiempo a formar una palabra.</p>";
  } else if (valida) {
    veredicto = '<p class="centrado" style="font-size:1.4rem;">✅ <strong>' + escapaHtml(palabra) + "</strong> · " +
      palabra.length + " letras → <strong style='color:var(--acento);'>+" + puntos + " puntos</strong>" +
      (puntos === ronda.letras.length * 2 ? " 🎉 ¡has usado todas las letras!" : "") + "</p>";
  } else {
    veredicto = '<p class="centrado" style="font-size:1.2rem;">🤔 <strong>' + escapaHtml(palabra) + "</strong> no está en el diccionario de la app.</p>" +
      '<p class="centrado texto-suave">¿Crees que existe? <a href="' + enlaceRae(palabra) + '" target="_blank">Compruébala en la RAE ↗</a> y, si la encuentras, date los puntos con el botón.</p>' +
      '<div class="botones-operaciones"><button class="btn btn-exito" id="btn-vale">✓ Existe: me la doy por buena</button></div>';
  }

  const mejores = mejoresPalabras(ronda.letras, [...todasLasFormas()], 3).map((m) => formaBonita(m));
  z.innerHTML =
    '<h3><span class="etiqueta-ronda etiqueta-letras">Letras</span> · Resultado</h3>' +
    '<div class="panel-fichas">' + ronda.letras.map((l) => '<button class="ficha-letra" disabled>' + l + "</button>").join("") + "</div>" +
    veredicto +
    (mejores.length ? '<div class="centrado"><div class="solucion-caja">💡 Se podía: <strong>' + mejores.map(escapaHtml).join(", ").toUpperCase() + "</strong></div></div>" : "") +
    '<div class="botones-operaciones" style="margin-top:14px;">' +
    '<button class="btn btn-letras" id="btn-otra">🔁 Otra ronda de letras</button>' +
    '<button class="btn btn-cifras" id="btn-cambio">🔢 Probar con cifras</button>' +
    '<button class="btn btn-secundario" id="btn-menu">🏠 Elegir prueba</button>' +
    "</div>";

  // La ronda se apunta una sola vez al llegar al resultado; el
  // comodín de la RAE añade después los puntos que faltaban.
  if (!ronda.cerrada) {
    ronda.cerrada = true;
    if (puntos > 0) aviso("+" + puntos + " puntos 🎉", "exito");
    apuntarPuntos("letras", puntos, false);
  }
  const btnVale = $("btn-vale");
  if (btnVale) btnVale.addEventListener("click", () => {
    local.validadaAMano = true;
    const extra = puntosLetras(palabra, ronda.letras.length);
    apuntarPuntos("letras", extra, true);
    aviso("+" + extra + " puntos apuntados. ¡Bien visto!", "exito");
    pintarLetras();
  });
  $("btn-otra").addEventListener("click", empezarLetras);
  $("btn-cambio").addEventListener("click", empezarCifras);
  $("btn-menu").addEventListener("click", volverAConfig);
}

// ============================================================
//  CIFRAS
// ============================================================

function empezarCifras() {
  const sorteo = sortearRondaCifras(config.nivel);
  ronda = { tipo: "cifras", fase: "sorteo", fichas: sorteo.fichas, objetivo: sorteo.objetivo, solucion: sorteo.solucion, finMs: null };
  local = {
    fichas: sorteo.fichas.map((v) => ({ v: v, usada: false, nueva: false })),
    pasos: [], selA: null, op: null, declarado: "",
  };
  mostrarVista("ronda");
  pintarCifras();
}

function etiquetaFicha(f) {
  if (f.nueva && config.ayuda !== "pasos") return "★";
  return String(f.v);
}

function pintarCifras() {
  const z = $("zona-juego");

  if (ronda.fase === "sorteo") {
    z.innerHTML =
      '<h3><span class="etiqueta-ronda etiqueta-cifras">Cifras</span> · ¡Este es tu objetivo!</h3>' +
      '<div class="centrado"><div class="objetivo-cifras">' + ronda.objetivo + "</div></div>" +
      '<div class="panel-fichas">' + ronda.fichas.map((f) => '<button class="ficha-cifra" disabled>' + f + "</button>").join("") + "</div>" +
      '<div class="botones-operaciones">' +
      '<button class="btn btn-secundario" id="btn-otro-sorteo">🎲 Sortear otros números</button>' +
      '<button class="btn btn-principal btn-grande" id="btn-empezar">⏱️ ¡A jugar!</button>' +
      "</div>";
    $("btn-otro-sorteo").addEventListener("click", empezarCifras);
    $("btn-empezar").addEventListener("click", () => { ronda.fase = "jugando"; empezarReloj(); pintarCifras(); });
    return;
  }

  if (ronda.fase === "jugando") {
    const fichas = local.fichas.map((f, i) =>
      '<button class="ficha-cifra' + (f.nueva ? " nueva" : "") + (f.usada ? " usada" : "") + (local.selA === i ? " seleccionada" : "") +
      '" data-ficha="' + i + '"' + (f.usada ? " disabled" : "") + ">" + etiquetaFicha(f) + "</button>").join("");

    const ops = ["+", "−", "×", "÷"].map((op) =>
      '<button class="btn-op' + (local.op === op ? " seleccionada" : "") + '" data-op="' + op + '"' +
      (local.selA === null ? " disabled" : "") + ">" + op + "</button>").join("");

    // Operación en curso, en grande: número marcado + signo + hueco.
    const enCurso = local.selA === null
      ? '<span class="aviso-vacia">toca un número para empezar una operación…</span>'
      : '<button class="ficha-cifra seleccionada" disabled>' + etiquetaFicha(local.fichas[local.selA]) + "</button>" +
        '<span class="signo-en-curso' + (local.op ? "" : " esperando") + '">' + (local.op || "¿+ − × ÷?") + "</span>" +
        '<button class="ficha-cifra hueco-cifra" disabled>?</button>';

    const pasos = local.pasos.map((p) =>
      "<li>" + p.etiquetaA + " " + p.op + " " + p.etiquetaB + " = " + (config.ayuda === "pasos" ? p.r : "★") + "</li>").join("");

    const resultado = local.pasos.length ? local.pasos[local.pasos.length - 1].r : null;
    const textoResultado = resultado === null ? "—" : (config.ayuda === "pasos" ? String(resultado) : "★ (oculto)");

    let cajaMental = "";
    if (config.ayuda === "mental") {
      cajaMental = '<div class="campo" style="max-width:260px; margin:0 auto;">' +
        "<label>¿Qué resultado te da? (haz la cuenta de cabeza)</label>" +
        '<input type="number" id="campo-declarado" value="' + escapaHtml(local.declarado) + '"></div>';
    }

    z.innerHTML =
      '<h3><span class="etiqueta-ronda etiqueta-cifras">Cifras</span> · ¡Llega al objetivo!</h3>' +
      cabeceraTiempo() +
      '<div class="centrado"><div class="objetivo-cifras">' + ronda.objetivo + "</div></div>" +
      '<p class="texto-suave centrado">Toca un número, una operación y otro número. División exacta y sin negativos.</p>' +
      '<div class="panel-fichas">' + fichas + "</div>" +
      '<div class="botones-operaciones">' + ops + "</div>" +
      '<div class="zona-palabra zona-operacion">' + enCurso + "</div>" +
      '<ul class="lista-pasos">' + pasos + "</ul>" +
      '<p class="centrado">Tu resultado ahora mismo: <strong style="font-size:1.3rem;">' + textoResultado + "</strong></p>" +
      cajaMental +
      '<div class="botones-operaciones">' +
      '<button class="btn btn-secundario" id="btn-deshacer"' + (local.pasos.length ? "" : " disabled") + ">↩️ Deshacer</button>" +
      '<button class="btn btn-principal btn-grande" id="btn-comprobar"' + (local.pasos.length ? "" : " disabled") + ">✅ Este es mi resultado</button>" +
      "</div>";

    z.querySelectorAll("[data-ficha]").forEach((b) => b.addEventListener("click", () => tocarFicha(Number(b.dataset.ficha))));
    z.querySelectorAll("[data-op]").forEach((b) => b.addEventListener("click", () => { local.op = b.dataset.op; pintarCifras(); }));
    $("btn-deshacer").addEventListener("click", deshacerPaso);
    $("btn-comprobar").addEventListener("click", comprobar);
    const campoD = $("campo-declarado");
    if (campoD) campoD.addEventListener("input", () => { local.declarado = campoD.value; });
    return;
  }

  pintarResultadoCifras(z);
}

function tocarFicha(i) {
  if (local.selA === null) { local.selA = i; pintarCifras(); return; }
  if (i === local.selA) { local.selA = null; local.op = null; pintarCifras(); return; }
  if (!local.op) { local.selA = i; pintarCifras(); return; }

  const A = local.fichas[local.selA];
  const B = local.fichas[i];
  const a = A.v, b = B.v;
  let r;
  if (local.op === "+") r = a + b;
  else if (local.op === "×") r = a * b;
  else if (local.op === "−") r = a - b;
  else r = b !== 0 && a % b === 0 ? a / b : NaN;

  if (!Number.isInteger(r) || r <= 0) {
    aviso(local.op === "÷" ? "Esa división no es exacta." : "No valen resultados negativos o cero.", "error");
    local.op = null;
    pintarCifras();
    return;
  }

  A.usada = true; B.usada = true;
  local.pasos.push({ a: a, op: local.op, b: b, r: r, ia: local.selA, ib: i, etiquetaA: etiquetaFicha(A), etiquetaB: etiquetaFicha(B) });
  local.fichas.push({ v: r, usada: false, nueva: true });
  local.selA = null; local.op = null;
  pintarCifras();
}

function deshacerPaso() {
  const p = local.pasos.pop();
  if (!p) return;
  local.fichas.pop();
  local.fichas[p.ia].usada = false;
  local.fichas[p.ib].usada = false;
  local.selA = null; local.op = null;
  pintarCifras();
}

function pintarResultadoCifras(z) {
  const resultado = local.pasos.length ? local.pasos[local.pasos.length - 1].r : null;
  let puntos = 0;
  let veredicto;

  if (resultado === null) {
    veredicto = "<p class='centrado' style='font-size:1.2rem;'>😅 No has llegado a hacer ninguna operación.</p>";
  } else if (config.ayuda === "mental" && local.declarado !== "" && Number(local.declarado) !== resultado) {
    veredicto = '<p class="centrado" style="font-size:1.2rem;">❌ Declaraste <strong>' + escapaHtml(local.declarado) +
      "</strong>, pero tus operaciones dan <strong>" + resultado + "</strong>: la cuenta no vale (como en la tele).</p>";
  } else {
    const distancia = Math.abs(ronda.objetivo - resultado);
    puntos = puntosCifras(distancia);
    veredicto = '<p class="centrado" style="font-size:1.4rem;">' +
      (distancia === 0 ? "🎯 ¡PLENO! Has clavado el " + ronda.objetivo : "Tu resultado: <strong>" + resultado + "</strong> · te quedas a <strong>" + distancia + "</strong> del objetivo") +
      " → <strong style='color:var(--acento);'>+" + puntos + " puntos</strong></p>";
  }

  const pasosHechos = local.pasos.map((p) => "<li>" + p.a + " " + p.op + " " + p.b + " = " + p.r + "</li>").join("");

  z.innerHTML =
    '<h3><span class="etiqueta-ronda etiqueta-cifras">Cifras</span> · Resultado</h3>' +
    '<div class="centrado"><div class="objetivo-cifras">' + ronda.objetivo + "</div></div>" +
    (pasosHechos ? '<p class="texto-suave centrado" style="margin-top:10px;">Tus operaciones (ya sin tapar):</p><ul class="lista-pasos">' + pasosHechos + "</ul>" : "") +
    veredicto +
    '<div class="centrado"><div class="solucion-caja">💡 Una manera exacta: <strong>' + escapaHtml(textoSolucion(ronda.solucion)) + "</strong></div></div>" +
    '<div class="botones-operaciones" style="margin-top:14px;">' +
    '<button class="btn btn-cifras" id="btn-otra">🔁 Otra ronda de cifras</button>' +
    '<button class="btn btn-letras" id="btn-cambio">🔤 Probar con letras</button>' +
    '<button class="btn btn-secundario" id="btn-menu">🏠 Elegir prueba</button>' +
    "</div>";

  if (!ronda.cerrada) { ronda.cerrada = true; if (puntos > 0) aviso("+" + puntos + " puntos 🎉", "exito"); apuntarPuntos("cifras", puntos, false); }
  $("btn-otra").addEventListener("click", empezarCifras);
  $("btn-cambio").addEventListener("click", empezarLetras);
  $("btn-menu").addEventListener("click", volverAConfig);
}

// ---------- comprobar (fin de ronda) ----------

function comprobar() {
  if (!ronda || ronda.fase !== "jugando") return;
  pararReloj();
  ronda.fase = "resultado";
  if (ronda.tipo === "letras") pintarLetras();
  else pintarCifras();
}
