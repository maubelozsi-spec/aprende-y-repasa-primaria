// ============================================================
// Inglés para Viajar — pantalla de conversación.
//
// Dos vistas en el mismo archivo: el selector de situaciones y la
// conversación en marcha. La conversación avanza turno a turno:
// habla la app, respondes tú, se corrige, y hasta el siguiente.
// ============================================================

import { TEMAS, TEMA_POR_ID } from "./datos-conversaciones.js";
import { VOCAB_POR_ID } from "./datos-vocabulario.js";
import { evaluar } from "./evaluador.js";
import { hablar, callar, escuchar, pararEscucha, soportaMicrofono, soportaVoz, explicarErrorMicrofono } from "./voz.js";
import { hayIA, corregirConIA } from "./ia.js";
import {
  progresoNivel, nivelDesbloqueado, registrarNivel, registrarTurno,
  ajustes, guardarAjustes, tocarRacha,
} from "./almacen.js";
import { aviso, escapar, pintarCabecera, parametro } from "./comun.js";

const pantalla = document.getElementById("pantalla");
let estado = null;
let audioEnlazado = false;

arrancar();

function arrancar() {
  const temaId = parametro("tema");
  const nivel = parametro("nivel");
  if (temaId && TEMA_POR_ID[temaId] && nivel !== null && TEMA_POR_ID[temaId].niveles[Number(nivel)]) {
    iniciarConversacion(temaId, Number(nivel));
  } else {
    pintarSelector();
  }
}

// ============================================================
// Vista 1: elegir situación
// ============================================================

function pintarSelector() {
  pintarCabecera("Conversar");
  callar();

  const tarjetas = TEMAS.map((tema) => {
    const chips = tema.niveles.map((nivel, i) => {
      const hecho = progresoNivel(tema.id, i);
      const abierto = nivelDesbloqueado(tema.id, i);
      const clases = "chip-nivel" + (hecho && hecho.completado ? " hecho" : "");
      const marca = hecho && hecho.completado ? " ✓" : abierto ? "" : " 🔒";
      return `<button class="${clases}" data-tema="${tema.id}" data-nivel="${i}" ${abierto ? "" : "disabled"}
                title="${escapar(nivel.titulo)}">Nivel ${i + 1}${marca}</button>`;
    }).join("");

    return `
      <article class="tema">
        <div class="titulo-tema">
          <span class="icono">${tema.icono}</span>
          <h3>${escapar(tema.titulo)}</h3>
        </div>
        <p class="resumen">${escapar(tema.resumen)}</p>
        <div class="niveles">${chips}</div>
      </article>`;
  }).join("");

  pantalla.innerHTML = `
    <p class="texto-suave" style="margin-top:14px">
      Elige una situación. El <strong>nivel 1</strong> son frases de tres o cuatro palabras;
      el <strong>2</strong>, la conversación completa; el <strong>3</strong>, cuando algo se tuerce
      y hay que resolverlo. Cada nivel abre el siguiente.
    </p>
    <div class="rejilla-temas">${tarjetas}</div>
    ${avisoMicrofono()}`;

  pantalla.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip-nivel");
    if (chip && !chip.disabled) {
      iniciarConversacion(chip.dataset.tema, Number(chip.dataset.nivel));
    }
  });
}

function avisoMicrofono() {
  if (soportaMicrofono()) return "";
  return `
    <div class="tarjeta-plana" style="margin-top:18px">
      <strong>El micrófono no está disponible en este navegador.</strong>
      <p class="texto-suave" style="margin:6px 0 0; font-size:0.9rem">
        Puedes hacer todas las conversaciones escribiendo, y la app seguirá corrigiendo la gramática
        y la construcción de la frase. Para practicar la pronunciación, abre esta página en
        Chrome, Edge o Safari.
      </p>
    </div>`;
}

// ============================================================
// Vista 2: la conversación
// ============================================================

function iniciarConversacion(temaId, indiceNivel) {
  const tema = TEMA_POR_ID[temaId];
  const nivel = tema.niveles[indiceNivel];

  estado = {
    tema, nivel, indiceNivel,
    turno: 0,
    resultados: [],
    intencion: null,
    esperando: false,
  };

  pintarCabecera(`${tema.icono} ${tema.titulo} · Nivel ${indiceNivel + 1}`);
  history.replaceState(null, "", `conversar.html?tema=${temaId}&nivel=${indiceNivel}`);

  pantalla.innerHTML = `
    <section class="escena">
      <h2>${escapar(nivel.titulo)}</h2>
      <p>${escapar(nivel.escena)}</p>
      <p class="texto-tenue" style="margin-top:8px">Hablas con: ${escapar(nivel.personaje)}</p>
    </section>
    <div class="barra" id="barra" style="margin-bottom:16px"><div style="width:0%"></div></div>
    <div class="chat" id="chat"></div>
    <div id="zona"></div>`;

  if (!audioEnlazado) {
    pantalla.addEventListener("click", alPulsarAudio);
    audioEnlazado = true;
  }
  mostrarTurnoApp();
}

function alPulsarAudio(e) {
  const boton = e.target.closest("[data-hablar]");
  if (!boton) return;
  hablar(boton.getAttribute("data-hablar"), { lento: boton.hasAttribute("data-lento") });
}

function lineaAudio(en, es) {
  return `
    <div class="linea-audio">
      <button class="btn-audio" data-hablar="${escapar(en)}" title="Escuchar" aria-label="Escuchar">🔊</button>
      <button class="btn-audio" data-hablar="${escapar(en)}" data-lento title="Escuchar despacio" aria-label="Escuchar despacio">🐢</button>
      <div class="texto-linea">
        <p class="en">${escapar(en)}</p>
        <p class="es">${escapar(es)}</p>
      </div>
    </div>`;
}

function actualizarBarra() {
  const barra = document.querySelector("#barra > div");
  if (barra) barra.style.width = `${(estado.turno / estado.nivel.turnos.length) * 100}%`;
}

function mostrarTurnoApp() {
  const turno = estado.nivel.turnos[estado.turno];
  estado.intencion = null;
  actualizarBarra();

  const chat = document.getElementById("chat");
  chat.insertAdjacentHTML("beforeend", `
    <div class="burbuja burbuja-app">
      <div class="quien">${escapar(estado.nivel.personaje)}</div>
      ${lineaAudio(turno.di.en, turno.di.es)}
      ${turno.nota ? `<p class="nota">💡 ${escapar(turno.nota)}</p>` : ""}
    </div>`);

  if (soportaVoz()) hablar(turno.di.en);
  pintarZonaRespuesta(turno);
  chat.lastElementChild.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function pintarZonaRespuesta(turno) {
  const zona = document.getElementById("zona");
  const modoVoz = ajustes().modoEntrada === "voz" && soportaMicrofono();

  const sugerencias = [turno.modelo].concat(turno.alternativas || []).map((frase, i) => `
    <button class="opcion-sugerida" data-sugerencia="${i}">
      <b>${escapar(frase.en)}</b>
      <span>${escapar(frase.es)}</span>
    </button>`).join("");

  zona.innerHTML = `
    <div class="zona-respuesta">
      <div class="objetivo"><strong>Tu turno:</strong> ${escapar(turno.objetivo)}</div>

      ${modoVoz ? `
        <div class="micro-fila">
          <button class="btn-micro" id="btn-micro" title="Pulsa y habla">🎤</button>
          <div class="estado-micro" id="estado-micro">Pulsa el micrófono y di tu respuesta en inglés.</div>
        </div>` : ""}

      <label for="respuesta">${modoVoz ? "…o escríbelo aquí:" : "Escribe tu respuesta en inglés:"}</label>
      <textarea id="respuesta" placeholder="Write your answer in English..." rows="2"></textarea>
      <div class="fila-botones" style="margin-top:10px">
        <button class="btn btn-principal" id="btn-enviar">Comprobar</button>
        ${soportaMicrofono() ? `<button class="btn btn-secundario btn-pequeno" id="btn-modo">${modoVoz ? "Prefiero escribir" : "Prefiero hablar"}</button>` : ""}
      </div>

      <div class="ayudas">
        <details>
          <summary>No sé cómo empezar</summary>
          <div class="contenido-ayuda">
            <div class="estructura">${escapar(turno.estructura)}</div>
            <p class="texto-suave" style="font-size:0.88rem; margin:0">${escapar(turno.estructuraEs)}</p>
          </div>
        </details>
        <details>
          <summary>Dime qué puedo decir</summary>
          <div class="contenido-ayuda">
            <p class="texto-tenue" style="margin-bottom:8px">
              Pulsa una para usarla. Si estás hablando, léela en alto: la app sabrá qué intentabas decir
              y afinará más la corrección de pronunciación.
            </p>
            ${sugerencias}
          </div>
        </details>
        ${turno.vocab && turno.vocab.length ? `
        <details>
          <summary>Vocabulario de este turno</summary>
          <div class="contenido-ayuda">
            <ul class="lista-vocab">${turno.vocab.map(pintarVocab).join("")}</ul>
          </div>
        </details>` : ""}
      </div>
    </div>`;

  zona.querySelector("#btn-enviar").addEventListener("click", () => {
    const caja = zona.querySelector("#respuesta");
    responder(caja.value, false);
  });

  zona.querySelector("#respuesta").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      responder(e.target.value, false);
    }
  });

  const botonModo = zona.querySelector("#btn-modo");
  if (botonModo) {
    botonModo.addEventListener("click", () => {
      guardarAjustes({ modoEntrada: ajustes().modoEntrada === "voz" ? "texto" : "voz" });
      pintarZonaRespuesta(turno);
    });
  }

  const botonMicro = zona.querySelector("#btn-micro");
  if (botonMicro) botonMicro.addEventListener("click", () => grabar(turno));

  zona.querySelectorAll("[data-sugerencia]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const frases = [turno.modelo].concat(turno.alternativas || []);
      const elegida = frases[Number(boton.dataset.sugerencia)];
      estado.intencion = elegida.en;
      hablar(elegida.en, { lento: true });

      // La frase queda siempre en el cuadro de texto: si estás en
      // modo voz y no te sale, puedes enviarla escrita sin perderla.
      const caja = zona.querySelector("#respuesta");
      caja.value = elegida.en;
      if (!modoVoz) caja.focus();

      const estadoMicro = zona.querySelector("#estado-micro");
      if (estadoMicro) estadoMicro.textContent = `Escúchala y dila tú: «${elegida.en}»`;
    });
  });
}

function pintarVocab(id) {
  const v = VOCAB_POR_ID[id];
  if (!v) return "";
  return `
    <li>
      <button class="btn-audio" data-hablar="${escapar(v.en)}" aria-label="Escuchar">🔊</button>
      <div class="cuerpo-vocab">
        <div class="en-vocab">${escapar(v.en)}</div>
        <div class="es-vocab">${escapar(v.es)} · <span class="pron-vocab">${escapar(v.pron)}</span></div>
      </div>
    </li>`;
}

// ------------------------------------------------------------
// Micrófono
// ------------------------------------------------------------

async function grabar(turno) {
  const boton = document.getElementById("btn-micro");
  const info = document.getElementById("estado-micro");
  if (!boton || estado.esperando) return;

  if (boton.classList.contains("grabando")) {
    pararEscucha();
    return;
  }

  callar();
  boton.classList.add("grabando");
  boton.textContent = "⏹";
  info.textContent = "Escuchando… habla ahora. Pulsa otra vez para parar.";

  try {
    const { texto } = await escuchar({
      onParcial: (parcial) => { info.textContent = `…${parcial}`; },
    });
    boton.classList.remove("grabando");
    boton.textContent = "🎤";
    info.textContent = `He entendido: «${texto}»`;
    responder(texto, true);
  } catch (error) {
    boton.classList.remove("grabando");
    boton.textContent = "🎤";
    info.textContent = explicarErrorMicrofono(error);
  }
}

// ------------------------------------------------------------
// Responder y corregir
// ------------------------------------------------------------

async function responder(texto, porVoz) {
  if (estado.esperando) return;
  const limpio = String(texto || "").trim();
  if (!limpio) {
    aviso("Escribe o di algo antes de comprobar.", "error");
    return;
  }

  estado.esperando = true;
  const turno = estado.nivel.turnos[estado.turno];
  const resultado = evaluar({ texto: limpio, turno, porVoz, intencion: estado.intencion });

  document.getElementById("zona").innerHTML =
    `<div class="zona-respuesta texto-suave">Analizando tu respuesta…</div>`;

  // Si hay IA configurada, se le pide una segunda lectura: traduce
  // de verdad la frase corregida y explica los fallos que las
  // reglas fijas no cubren.
  let extra = null;
  if (hayIA()) {
    try {
      extra = await corregirConIA({ texto: limpio, turno, escena: estado.nivel.escena });
    } catch (error) {
      aviso(error.message, "error");
    }
  }

  pintarCorreccion(limpio, resultado, extra, porVoz);
  estado.resultados.push(resultado);
  registrarTurno(resultado.veredicto === "perfecto");
  tocarRacha();
  estado.esperando = false;
}

function pintarCorreccion(dicho, resultado, extra, porVoz) {
  const chat = document.getElementById("chat");
  const corregido = extra && extra.natural ? extra.natural : resultado.corregido;
  const traduccion = extra && extra.traduccion ? extra.traduccion : resultado.traduccion;
  const cambio = normalizarSimple(corregido) !== normalizarSimple(dicho);

  const avisos = resultado.avisos.map(pintarAviso).join("");
  const avisosIA = extra && extra.explicaciones
    ? extra.explicaciones.map((ex) => `<li><strong>${escapar(ex.que)}</strong> — ${escapar(ex.porque)}</li>`).join("")
    : "";

  const glosa = resultado.glosa.length && !traduccion
    ? `<div class="glosa">${resultado.glosa.map((g) => `
        <span class="palabra"><b>${escapar(g.palabra)}</b> ${g.significado ? `<span>${escapar(g.significado)}</span>` : `<span>?</span>`}</span>`).join("")}</div>`
    : "";

  chat.insertAdjacentHTML("beforeend", `
    <div class="burbuja burbuja-yo">
      <div class="quien">Tú ${porVoz ? "· dicho en alto" : "· escrito"}</div>
      <p class="en" style="font-weight:500">${escapar(dicho)}</p>

      <div class="correccion">
        <span class="veredicto v-${resultado.veredicto}">${escapar(resultado.etiqueta)}</span>

        ${cambio ? `
          <div style="margin-bottom:8px">
            <p class="texto-tenue" style="margin:0 0 3px">Así queda bien dicho:</p>
            ${lineaAudio(corregido, traduccion || "(significado palabra a palabra abajo)")}
          </div>` : `
          <p class="texto-suave" style="font-size:0.9rem; margin-bottom:8px">
            La frase está bien construida.${traduccion ? ` Significa: «${escapar(traduccion)}».` : ""}
          </p>`}

        ${avisos || avisosIA ? `<ul class="lista-avisos">${avisos}${avisosIA}</ul>` : ""}
        ${glosa}

        ${resultado.veredicto === "casi" || resultado.veredicto === "flojo" ? `
          <div style="margin-top:10px">
            <p class="texto-tenue" style="margin:0 0 3px">Una respuesta que encaja del todo:</p>
            ${lineaAudio(resultado.referencia.en, resultado.referencia.es)}
          </div>` : ""}
      </div>
    </div>`);

  chat.lastElementChild.scrollIntoView({ behavior: "smooth", block: "nearest" });

  const esUltimo = estado.turno >= estado.nivel.turnos.length - 1;
  document.getElementById("zona").innerHTML = `
    <div class="zona-respuesta centrado">
      <div class="fila-botones" style="justify-content:center">
        <button class="btn btn-principal" id="btn-seguir">${esUltimo ? "Ver el resultado" : "Siguiente turno →"}</button>
        <button class="btn btn-secundario" id="btn-repetir">Repetir este turno</button>
      </div>
    </div>`;

  document.getElementById("btn-seguir").addEventListener("click", () => {
    if (esUltimo) terminar();
    else { estado.turno += 1; mostrarTurnoApp(); }
  });
  document.getElementById("btn-repetir").addEventListener("click", () => {
    estado.resultados.pop();
    pintarZonaRespuesta(estado.nivel.turnos[estado.turno]);
  });
}

function pintarAviso(a) {
  if (a.tipo === "pronunciacion") {
    return `<li class="pron">
      <strong>🗣️ «${escapar(a.palabra)}»</strong> se ha entendido como «${escapar(a.entendido)}».
      ${a.suena ? ` Suena <strong>${escapar(a.suena)}</strong>.` : ""}
      ${a.consejo ? `<br>${escapar(a.consejo)}` : ""}
    </li>`;
  }
  const clase = a.grave ? "grave" : "";
  const cita = a.antes ? `<strong>«${escapar(a.antes)}»</strong>: ` : "";
  return `<li class="${clase}">${cita}${escapar(a.motivo)}</li>`;
}

// Para decidir si merece la pena enseñar la frase corregida. Se
// ignora el punto final (añadirlo no es una corrección que valga la
// pena mostrar) pero NO las mayúsculas: cambiar "i" por "I" sí es
// una corrección de verdad y quedaría raro decir que no hay ninguna.
function normalizarSimple(t) {
  return String(t || "").trim().replace(/[.!?]+$/, "").replace(/\s+/g, " ");
}

// ------------------------------------------------------------
// Final del nivel
// ------------------------------------------------------------

function terminar() {
  callar();
  const total = estado.resultados.length;
  const buenos = estado.resultados.filter((r) => r.veredicto === "perfecto" || r.veredicto === "bien").length;
  const porcentaje = total ? Math.round((buenos / total) * 100) : 0;

  registrarNivel(estado.tema.id, estado.indiceNivel, buenos, total);
  actualizarBarra();

  const haySiguiente = estado.indiceNivel < estado.tema.niveles.length - 1;
  const mensaje = porcentaje >= 80
    ? "Muy bien. Esta situación la tienes resuelta."
    : porcentaje >= 50
      ? "Bien. Repítela una vez más y quedará fijada."
      : "Esta cuesta. Vuelve a hacerla usando las sugerencias: no es hacer trampa, es cómo se aprende.";

  const palabras = [...new Set(estado.nivel.turnos.flatMap((t) => t.vocab || []))];

  document.getElementById("zona").innerHTML = `
    <div class="tarjeta centrado">
      <h2>Conversación terminada</h2>
      <p style="font-size:2rem; margin:6px 0; font-weight:700; color:var(--mar)">${buenos} / ${total}</p>
      <div class="barra ${porcentaje >= 80 ? "verde" : "coral"}" style="max-width:280px;margin:0 auto 14px">
        <div style="width:${porcentaje}%"></div>
      </div>
      <p class="texto-suave">${escapar(mensaje)}</p>

      ${palabras.length ? `
        <div class="tarjeta-plana" style="text-align:left; margin:16px 0">
          <h3 style="font-size:0.95rem">Vocabulario que ha salido</h3>
          <ul class="lista-vocab">${palabras.map(pintarVocab).join("")}</ul>
          <p class="texto-tenue" style="margin:8px 0 0">
            Estas palabras están en la sección de vocabulario con su sistema de repaso.
          </p>
        </div>` : ""}

      <div class="fila-botones" style="justify-content:center">
        ${haySiguiente ? `<a class="btn btn-acento" href="conversar.html?tema=${estado.tema.id}&nivel=${estado.indiceNivel + 1}">Nivel ${estado.indiceNivel + 2} →</a>` : ""}
        <button class="btn btn-secundario" id="btn-otra-vez">Repetir esta</button>
        <a class="btn btn-secundario" href="conversar.html">Otra situación</a>
      </div>
    </div>`;

  document.getElementById("btn-otra-vez").addEventListener("click", () => {
    iniciarConversacion(estado.tema.id, estado.indiceNivel);
  });
}
