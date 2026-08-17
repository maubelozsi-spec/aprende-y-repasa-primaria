// ============================================================
// Inglés para Viajar — vocabulario y sistema de repaso.
//
// El repaso usa cajas (el método Leitner de toda la vida, que
// funciona): cada palabra que aciertas sube de caja y tarda más
// en volver a salir; cada palabra que fallas vuelve a la primera
// caja y reaparece en la misma sesión. Los intervalos son
// 1, 2, 4, 8, 16 y 35 días.
//
// Además la forma de preguntar cambia según la caja, para que no
// acabes reconociendo la respuesta por la forma de la tarjeta:
//   caja 0 -> elegir el significado (lo más fácil)
//   caja 1 -> escuchar y elegir
//   caja 2 -> escribirla en inglés desde el español
//   caja 3+ -> decirla en alto por el micrófono
// ============================================================

import { VOCABULARIO, VOCAB_POR_ID, TEMAS_VOCABULARIO } from "./datos-vocabulario.js";
import { hablar, callar, escuchar, soportaMicrofono, explicarErrorMicrofono } from "./voz.js";
import { parecido } from "./pronunciacion.js";
import { normalizar } from "./gramatica.js";
import { tarjeta, tarjetasPendientes, registrarRepaso, ajustes, INTERVALOS } from "./almacen.js";
import { aviso, escapar, pintarCabecera, parametro, barajar } from "./comun.js";

const pantalla = document.getElementById("pantalla");
const TODOS_IDS = VOCABULARIO.map((v) => v.id);

let sesion = null;

if (parametro("modo") === "repaso") iniciarRepaso();
else pintarIndice();

// ============================================================
// Índice: ver el vocabulario y empezar el repaso
// ============================================================

function pintarIndice() {
  pintarCabecera("Vocabulario imprescindible");
  callar();

  const { pendientes, nuevas } = tarjetasPendientes(TODOS_IDS);
  const vistas = TODOS_IDS.length - nuevas.length;
  const dominadas = TODOS_IDS.filter((id) => { const t = tarjeta(id); return t && t.caja >= 4; }).length;

  const listaTemas = TEMAS_VOCABULARIO.map((tema) => {
    const items = VOCABULARIO.filter((v) => v.tema === tema.id);
    const hechas = items.filter((v) => tarjeta(v.id)).length;
    return `
      <details class="tarjeta" style="padding:0">
        <summary style="padding:14px 16px; cursor:pointer; font-weight:600">
          ${tema.icono} ${escapar(tema.nombre)}
          <span class="texto-tenue" style="font-weight:400"> · ${hechas}/${items.length}</span>
        </summary>
        <div style="padding:0 16px 14px">
          <ul class="lista-vocab">${items.map(filaVocab).join("")}</ul>
        </div>
      </details>`;
  }).join("");

  pantalla.innerHTML = `
    <div class="tarjeta centrado" style="margin-top:14px">
      <h2 style="margin-bottom:4px">Repaso de hoy</h2>
      <p class="texto-suave" style="font-size:0.92rem">
        ${pendientes.length > 0
          ? `Toca repasar <strong>${pendientes.length}</strong> ${pendientes.length === 1 ? "palabra" : "palabras"}.`
          : "No tienes repasos vencidos."}
        ${nuevas.length > 0 ? ` Quedan <strong>${nuevas.length}</strong> palabras por aprender.` : " Ya has visto todo el vocabulario."}
      </p>
      <div class="marcador" style="margin-top:12px">
        <span>Vistas <b>${vistas}</b></span>
        <span>Dominadas <b>${dominadas}</b></span>
        <span>Total <b>${TODOS_IDS.length}</b></span>
      </div>
      <button class="btn btn-acento btn-bloque" id="btn-repasar">
        ${pendientes.length > 0 ? "Empezar el repaso" : "Aprender palabras nuevas"}
      </button>
      <p class="texto-tenue" style="margin:10px 0 0">
        Sesión de ${ajustes().nuevasPorDia} palabras nuevas como máximo, más lo que toque repasar.
      </p>
    </div>

    <h2 style="margin-top:24px">Todo el vocabulario</h2>
    <p class="texto-suave" style="font-size:0.92rem">
      Pulsa el altavoz para oír cualquier palabra. La etiqueta de la derecha indica en qué caja de
      repaso está: cuanto más alta, más tiempo tardará en volver a preguntártela.
    </p>
    ${listaTemas}`;

  document.getElementById("btn-repasar").addEventListener("click", iniciarRepaso);
  pantalla.addEventListener("click", (e) => {
    const boton = e.target.closest("[data-hablar]");
    if (boton) hablar(boton.getAttribute("data-hablar"));
  });
}

function filaVocab(v) {
  const t = tarjeta(v.id);
  const etiqueta = !t
    ? `<span class="caja-caja">nueva</span>`
    : t.caja >= 4
      ? `<span class="caja-caja dominada">caja ${t.caja}</span>`
      : `<span class="caja-caja pendiente">caja ${t.caja}</span>`;

  return `
    <li>
      <button class="btn-audio" data-hablar="${escapar(v.en)}" aria-label="Escuchar">🔊</button>
      <div class="cuerpo-vocab">
        <div class="en-vocab">${escapar(v.en)}</div>
        <div class="es-vocab">${escapar(v.es)} · <span class="pron-vocab">${escapar(v.pron)}</span></div>
      </div>
      ${etiqueta}
    </li>`;
}

// ============================================================
// Sesión de repaso
// ============================================================

function iniciarRepaso() {
  const { pendientes, nuevas } = tarjetasPendientes(TODOS_IDS);
  const limiteNuevas = ajustes().nuevasPorDia || 8;

  // Las nuevas entran por orden de nivel: primero lo de
  // supervivencia, y solo después lo más fino.
  const nuevasOrdenadas = nuevas
    .map((id) => VOCAB_POR_ID[id])
    .sort((a, b) => a.nivel - b.nivel || a.id.localeCompare(b.id))
    .slice(0, limiteNuevas)
    .map((v) => v.id);

  const cola = barajar(pendientes).concat(nuevasOrdenadas);

  if (!cola.length) {
    aviso("No queda nada por repasar hoy. ¡Buen trabajo!", "exito");
    pintarIndice();
    return;
  }

  sesion = { cola, indice: 0, aciertos: 0, fallos: 0, total: cola.length, respondiendo: false, reintentos: {} };
  pintarCabecera("Repaso de vocabulario");
  history.replaceState(null, "", "vocabulario.html?modo=repaso");
  siguienteTarjeta();
}

function modoDePregunta(id) {
  const t = tarjeta(id);
  const caja = t ? t.caja : 0;
  if (caja === 0) return "reconocer";
  if (caja === 1) return "escuchar";
  if (caja === 2) return "recordar";
  return soportaMicrofono() ? "decir" : "recordar";
}

function siguienteTarjeta() {
  callar();
  if (sesion.indice >= sesion.cola.length) { terminarSesion(); return; }

  const id = sesion.cola[sesion.indice];
  const item = VOCAB_POR_ID[id];
  const modo = modoDePregunta(id);
  sesion.respondiendo = true;

  const marcador = `
    <div class="marcador">
      <span>Tarjeta <b>${sesion.indice + 1}</b> de ${sesion.cola.length}</span>
      <span>Aciertos <b>${sesion.aciertos}</b></span>
    </div>
    <div class="barra" style="margin-bottom:16px"><div style="width:${(sesion.indice / sesion.cola.length) * 100}%"></div></div>`;

  if (modo === "reconocer") pintarOpciones(item, marcador, "reconocer");
  else if (modo === "escuchar") pintarOpciones(item, marcador, "escuchar");
  else if (modo === "recordar") pintarEscribir(item, marcador);
  else pintarDecir(item, marcador);
}

// --- modo 1 y 2: elegir entre cuatro ---

function pintarOpciones(item, marcador, modo) {
  const mismoTema = VOCABULARIO.filter((v) => v.tema === item.tema && v.id !== item.id);
  const resto = VOCABULARIO.filter((v) => v.tema !== item.tema && v.id !== item.id);
  const senuelos = barajar(mismoTema).slice(0, 3);
  while (senuelos.length < 3) senuelos.push(barajar(resto)[senuelos.length]);
  const opciones = barajar([item].concat(senuelos));

  const esNueva = !tarjeta(item.id);

  pantalla.innerHTML = `
    ${marcador}
    <div class="tarjeta-repaso">
      <div class="instruccion">${modo === "escuchar" ? "Escucha y elige el significado" : "¿Qué significa?"}</div>
      ${modo === "escuchar"
        ? `<button class="btn btn-principal" id="btn-oir" style="margin:0 auto">🔊 Escuchar otra vez</button>`
        : `<div class="pregunta">${escapar(item.en)}</div>
           <div class="pista-pron">${escapar(item.pron)}</div>`}
      ${esNueva ? `<div class="texto-tenue">Palabra nueva: fíjate bien, luego te la preguntaré más veces.</div>` : ""}
    </div>
    <div class="opciones-repaso" id="opciones">
      ${opciones.map((o) => `<button class="opcion-repaso" data-id="${o.id}">${escapar(o.es)}</button>`).join("")}
    </div>`;

  if (modo === "escuchar") {
    hablar(item.en);
    document.getElementById("btn-oir").addEventListener("click", () => hablar(item.en, { lento: true }));
  } else {
    hablar(item.en);
  }

  document.getElementById("opciones").addEventListener("click", (e) => {
    const boton = e.target.closest(".opcion-repaso");
    if (!boton || !sesion.respondiendo) return;
    const acertada = boton.dataset.id === item.id;

    document.querySelectorAll(".opcion-repaso").forEach((b) => {
      b.disabled = true;
      if (b.dataset.id === item.id) b.classList.add("correcta");
      else if (b === boton) b.classList.add("fallada");
    });

    resolverTarjeta(item, acertada);
  });
}

// --- modo 3: escribirla en inglés ---

function pintarEscribir(item, marcador) {
  pantalla.innerHTML = `
    ${marcador}
    <div class="tarjeta-repaso">
      <div class="instruccion">Escríbelo en inglés</div>
      <div class="pregunta">${escapar(item.es)}</div>
      <div class="texto-tenue">${escapar(item.ejemplo.es)}</div>
    </div>
    <div style="margin-top:14px">
      <input type="text" id="escrito" placeholder="Escríbelo en inglés…" autocomplete="off" autocapitalize="off" spellcheck="false">
      <div class="fila-botones" style="margin-top:10px">
        <button class="btn btn-principal" id="btn-comprobar">Comprobar</button>
        <button class="btn btn-secundario" id="btn-no-se">No me acuerdo</button>
      </div>
    </div>`;

  const caja = document.getElementById("escrito");
  caja.focus();

  const comprobar = () => {
    if (!sesion.respondiendo) return;
    const escrito = normalizar(caja.value);
    const objetivo = normalizar(item.en);
    const acertada = escrito === objetivo || parecido(escrito, objetivo) >= 0.85;
    resolverTarjeta(item, acertada);
  };

  document.getElementById("btn-comprobar").addEventListener("click", comprobar);
  caja.addEventListener("keydown", (e) => { if (e.key === "Enter") comprobar(); });
  document.getElementById("btn-no-se").addEventListener("click", () => resolverTarjeta(item, false));
}

// --- modo 4: decirla en alto ---

function pintarDecir(item, marcador) {
  pantalla.innerHTML = `
    ${marcador}
    <div class="tarjeta-repaso">
      <div class="instruccion">Dilo en alto, en inglés</div>
      <div class="pregunta">${escapar(item.es)}</div>
      <div class="texto-tenue">${escapar(item.ejemplo.es)}</div>
    </div>
    <div class="zona-respuesta" style="margin-top:14px">
      <div class="micro-fila">
        <button class="btn-micro" id="btn-micro">🎤</button>
        <div class="estado-micro" id="estado-micro">Pulsa el micrófono y dilo en inglés.</div>
      </div>
      <div class="fila-botones">
        <button class="btn btn-secundario btn-pequeno" id="btn-no-se">No me acuerdo</button>
      </div>
    </div>`;

  document.getElementById("btn-no-se").addEventListener("click", () => resolverTarjeta(item, false));
  document.getElementById("btn-micro").addEventListener("click", async () => {
    const boton = document.getElementById("btn-micro");
    const info = document.getElementById("estado-micro");
    boton.classList.add("grabando");
    boton.textContent = "⏹";
    info.textContent = "Escuchando…";
    try {
      const { texto } = await escuchar();
      boton.classList.remove("grabando");
      boton.textContent = "🎤";
      info.textContent = `He entendido: «${texto}»`;
      const acertada = parecido(normalizar(texto), normalizar(item.en)) >= 0.6;
      resolverTarjeta(item, acertada, texto);
    } catch (error) {
      boton.classList.remove("grabando");
      boton.textContent = "🎤";
      info.textContent = explicarErrorMicrofono(error);
    }
  });
}

// --- resultado de la tarjeta ---

function resolverTarjeta(item, acertada, escuchado) {
  if (!sesion.respondiendo) return;
  sesion.respondiendo = false;

  registrarRepaso(item.id, acertada);
  if (acertada) sesion.aciertos += 1;
  else {
    sesion.fallos += 1;
    // Las falladas vuelven a salir al final de la misma sesión:
    // es lo que hace que se queden. Con un tope de dos repeticiones,
    // para que una palabra atravesada no alargue la sesión sin fin
    // (si sigue sin salir, ya volverá mañana).
    const yaEnCola = sesion.cola.slice(sesion.indice + 1).includes(item.id);
    const repeticiones = sesion.reintentos[item.id] || 0;
    if (!yaEnCola && repeticiones < 2) {
      sesion.cola.push(item.id);
      sesion.reintentos[item.id] = repeticiones + 1;
    }
  }

  hablar(item.en);

  const bloque = document.createElement("div");
  bloque.className = "tarjeta";
  bloque.style.marginTop = "14px";
  bloque.innerHTML = `
    <span class="veredicto ${acertada ? "v-perfecto" : "v-flojo"}">${acertada ? "Correcto" : "Fallada — volverá a salir"}</span>
    <div class="linea-audio" style="margin-top:8px">
      <button class="btn-audio" data-hablar="${escapar(item.en)}">🔊</button>
      <button class="btn-audio" data-hablar="${escapar(item.en)}" data-lento>🐢</button>
      <div class="texto-linea">
        <p class="en">${escapar(item.en)}</p>
        <p class="es">${escapar(item.es)}</p>
      </div>
    </div>
    <p class="pista-pron" style="margin:6px 0 10px; color:var(--coral); font-weight:600">Suena: ${escapar(item.pron)}</p>
    <div class="tarjeta-plana">
      <p style="margin:0 0 3px; font-weight:600">${escapar(item.ejemplo.en)}</p>
      <p class="texto-suave" style="margin:0; font-style:italic; font-size:0.9rem">${escapar(item.ejemplo.es)}</p>
    </div>
    ${escuchado && !acertada ? `<p class="texto-tenue" style="margin-top:8px">El reconocedor entendió «${escapar(escuchado)}». Vuelve a oírla y repítela.</p>` : ""}
    <button class="btn btn-principal btn-bloque" id="btn-siguiente" style="margin-top:14px">Siguiente</button>`;

  pantalla.appendChild(bloque);
  bloque.addEventListener("click", (e) => {
    const audio = e.target.closest("[data-hablar]");
    if (audio) hablar(audio.getAttribute("data-hablar"), { lento: audio.hasAttribute("data-lento") });
  });
  document.getElementById("btn-siguiente").addEventListener("click", () => {
    sesion.indice += 1;
    siguienteTarjeta();
  });
  bloque.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function terminarSesion() {
  callar();
  const total = sesion.aciertos + sesion.fallos;
  const porcentaje = total ? Math.round((sesion.aciertos / total) * 100) : 0;
  const proximas = INTERVALOS.slice(1, 4).join(", ");

  pantalla.innerHTML = `
    <div class="tarjeta centrado" style="margin-top:20px">
      <div style="font-size:2.6rem">${porcentaje >= 80 ? "🎉" : "💪"}</div>
      <h2>Repaso terminado</h2>
      <p style="font-size:1.9rem; margin:4px 0; font-weight:700; color:var(--mar)">${sesion.aciertos} / ${total}</p>
      <div class="barra ${porcentaje >= 80 ? "verde" : "coral"}" style="max-width:280px;margin:0 auto 14px"><div style="width:${porcentaje}%"></div></div>
      <p class="texto-suave">
        Las que has acertado volverán dentro de ${proximas}… días, según lo seguro que las tengas.
        Las falladas volverán mañana.
      </p>
      <div class="fila-botones" style="justify-content:center; margin-top:6px">
        <a class="btn btn-principal" href="vocabulario.html">Ver el vocabulario</a>
        <a class="btn btn-secundario" href="conversar.html">Ir a conversar</a>
      </div>
    </div>`;
}
