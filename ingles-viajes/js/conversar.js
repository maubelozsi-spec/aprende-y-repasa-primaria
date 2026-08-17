// ============================================================
// Inglés para Viajar — pantalla de conversación.
//
// Tres vistas en el mismo archivo: el selector de situaciones, la
// conversación guionizada y la conversación libre con IA. Las tres
// avanzan igual: habla la app, respondes tú, se corrige, siguiente.
//
// La diferencia entre guionizada y libre está solo en de dónde sale
// cada turno: del guion o de una llamada a Claude. Todo lo demás
// (burbujas, ayudas, micrófono, corrección) es el mismo código.
// ============================================================

import { TEMAS, TEMA_POR_ID } from "./datos-conversaciones.js";
import { VOCAB_POR_ID } from "./datos-vocabulario.js";
import { evaluar } from "./evaluador.js";
import { hablar, callar, escuchar, pararEscucha, soportaMicrofono, soportaVoz, explicarErrorMicrofono } from "./voz.js";
import { hayIA, corregirConIA, siguienteTurnoIA } from "./ia.js";
import {
  progresoNivel, nivelDesbloqueado, registrarNivel, registrarTurno,
  ajustes, guardarAjustes, tocarRacha,
} from "./almacen.js";
import { aviso, escapar, pintarCabecera, parametro } from "./comun.js";

const pantalla = document.getElementById("pantalla");
let estado = null;
let audioEnlazado = false;

// Tope de turnos en la conversación libre. Es una red de seguridad
// doble: evita que una charla se alargue sin fin y, sobre todo, que
// una sesión olvidada abierta se coma el saldo de tu clave de API.
const MAX_TURNOS_LIBRE = 10;

// Ojo: estas constantes tienen que quedar POR ENCIMA de arrancar(),
// que se ejecuta al cargar el módulo. Declaradas más abajo, la
// pantalla de conversación libre reventaría al abrirse.
const SITUACIONES_SUGERIDAS = [
  "Estás desayunando en el hotel y quieres pedir algo que no está en el bufé.",
  "Se te ha estropeado el móvil y entras en una tienda a que te lo miren.",
  "Has quedado con unos amigos ingleses y llegas media hora tarde.",
  "Quieres cambiar la habitación del hotel porque hay obras al lado.",
  "Estás en una tienda de ropa y buscas un regalo, pero no sabes la talla.",
  "Te has dejado la chaqueta en el tren y llamas a objetos perdidos.",
];

arrancar();

function arrancar() {
  const temaId = parametro("tema");
  const nivel = parametro("nivel");
  if (parametro("modo") === "libre") {
    pintarSelectorLibre();
  } else if (temaId && TEMA_POR_ID[temaId] && nivel !== null && TEMA_POR_ID[temaId].niveles[Number(nivel)]) {
    iniciarConversacion(temaId, Number(nivel));
  } else {
    pintarSelector();
  }
}

// El turno que se está jugando ahora, venga del guion o de la IA.
function turnoActual() {
  return estado.libre ? estado.turnoLibre : estado.nivel.turnos[estado.turno];
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
    ${tarjetaLibre()}
    ${avisoMicrofono()}`;

  pantalla.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip-nivel");
    if (chip && !chip.disabled) {
      iniciarConversacion(chip.dataset.tema, Number(chip.dataset.nivel));
    }
  });
}

function tarjetaLibre() {
  if (!hayIA()) {
    return `
      <div class="tarjeta" style="margin-top:20px; border-left:5px solid var(--coral)">
        <h3 style="margin-bottom:6px">🎙️ Conversación libre <span class="caja-caja">necesita clave de IA</span></h3>
        <p class="texto-suave" style="font-size:0.92rem; margin-bottom:10px">
          Además de los guiones, puedes conversar sobre cualquier situación que se te ocurra:
          la describes y Claude se mete en el papel e improvisa. Necesita tu clave de la API
          de Anthropic, y el gasto corre de tu cuenta.
        </p>
        <a class="btn btn-secundario" href="progreso.html">Configurar la clave</a>
      </div>`;
  }
  return `
    <div class="tarjeta" style="margin-top:20px; border-left:5px solid var(--coral)">
      <h3 style="margin-bottom:6px">🎙️ Conversación libre</h3>
      <p class="texto-suave" style="font-size:0.92rem; margin-bottom:10px">
        Describe cualquier situación y Claude se mete en el papel. Aquí no hay guion: puedes decir
        lo que quieras y la conversación se adapta a lo que respondas.
      </p>
      <a class="btn btn-acento" href="conversar.html?modo=libre">Empezar una conversación libre</a>
    </div>`;
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
// Vista 1b: elegir la situación de la conversación libre
// ============================================================

function pintarSelectorLibre() {
  pintarCabecera("Conversación libre");
  callar();

  if (!hayIA()) {
    pantalla.innerHTML = `
      <div class="tarjeta" style="margin-top:16px">
        <h2>Falta configurar la clave</h2>
        <p class="texto-suave">
          La conversación libre necesita tu clave de la API de Anthropic, porque es Claude quien
          improvisa el diálogo. Todo lo demás de la app funciona sin ella.
        </p>
        <div class="fila-botones">
          <a class="btn btn-principal" href="progreso.html">Ir a los ajustes</a>
          <a class="btn btn-secundario" href="conversar.html">Volver a las situaciones</a>
        </div>
      </div>`;
    return;
  }

  pantalla.innerHTML = `
    <div class="tarjeta" style="margin-top:16px">
      <h2>¿De qué quieres hablar?</h2>
      <p class="texto-suave" style="font-size:0.92rem">
        Describe la situación en español. Cuanto más concreta, mejor sale: di dónde estás,
        con quién hablas y qué quieres conseguir.
      </p>

      <label for="situacion">La situación</label>
      <textarea id="situacion" rows="3" placeholder="Estás en la recepción de un hotel y quieres dejar las maletas después de hacer el check-out…"></textarea>

      <p class="texto-tenue" style="margin:10px 0 6px">O toca una de estas:</p>
      ${SITUACIONES_SUGERIDAS.map((s, i) => `
        <button class="opcion-sugerida" data-situacion="${i}"><b>${escapar(s)}</b></button>`).join("")}

      <label for="dificultad" style="margin-top:14px">Dificultad</label>
      <select id="dificultad">
        <option value="1">Nivel 1 · frases muy cortas, sin complicaciones</option>
        <option value="2" selected>Nivel 2 · conversación normal</option>
        <option value="3">Nivel 3 · te ponen una pega y hay que negociar</option>
      </select>

      <button class="btn btn-acento btn-bloque" id="btn-empezar" style="margin-top:14px">Empezar a hablar</button>
      <p class="texto-tenue" style="margin:10px 0 0">
        La conversación dura como mucho ${MAX_TURNOS_LIBRE} turnos. Cada turno son dos llamadas a la API
        (una para el diálogo y otra para corregirte), y las pagas tú.
      </p>
    </div>
    <p class="centrado"><a class="btn btn-secundario" href="conversar.html">← Volver a las situaciones con guion</a></p>`;

  const caja = pantalla.querySelector("#situacion");
  pantalla.querySelectorAll("[data-situacion]").forEach((boton) => {
    boton.addEventListener("click", () => {
      caja.value = SITUACIONES_SUGERIDAS[Number(boton.dataset.situacion)];
      caja.focus();
    });
  });

  pantalla.querySelector("#btn-empezar").addEventListener("click", () => {
    const situacion = caja.value.trim();
    if (situacion.length < 10) {
      aviso("Describe la situación con un poco más de detalle.", "error");
      caja.focus();
      return;
    }
    iniciarLibre(situacion, Number(pantalla.querySelector("#dificultad").value));
  });
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

function iniciarLibre(situacion, nivel) {
  estado = {
    libre: true,
    situacion,
    nivelLibre: nivel,
    historial: [],
    turno: 0,
    turnoLibre: null,
    resultados: [],
    intencion: null,
    esperando: false,
  };

  pintarCabecera("🎙️ Conversación libre");
  history.replaceState(null, "", "conversar.html?modo=libre");

  pantalla.innerHTML = `
    <section class="escena">
      <h2>Tu situación</h2>
      <p>${escapar(situacion)}</p>
      <p class="texto-tenue" style="margin-top:8px">Dificultad: nivel ${nivel} · improvisado por Claude</p>
    </section>
    <div class="barra" id="barra" style="margin-bottom:16px"><div style="width:0%"></div></div>
    <div class="chat" id="chat"></div>
    <div id="zona"></div>`;

  if (!audioEnlazado) {
    pantalla.addEventListener("click", alPulsarAudio);
    audioEnlazado = true;
  }
  pedirTurnoLibre();
}

// Pide a la IA la siguiente intervención y la convierte en un turno
// con la misma forma que los del guion, para que el resto de la
// pantalla no tenga que enterarse de dónde ha salido.
async function pedirTurnoLibre() {
  const zona = document.getElementById("zona");
  zona.innerHTML = `<div class="zona-respuesta texto-suave centrado">Pensando qué decirte…</div>`;

  let datos;
  try {
    datos = await siguienteTurnoIA({
      situacion: estado.situacion,
      nivel: estado.nivelLibre,
      historial: estado.historial,
    });
  } catch (error) {
    zona.innerHTML = `
      <div class="zona-respuesta">
        <p style="margin:0 0 10px"><strong>No he podido continuar:</strong> ${escapar(error.message)}</p>
        <div class="fila-botones">
          <button class="btn btn-principal" id="btn-reintentar">Reintentar</button>
          <a class="btn btn-secundario" href="conversar.html">Salir</a>
        </div>
      </div>`;
    document.getElementById("btn-reintentar").addEventListener("click", pedirTurnoLibre);
    return;
  }

  estado.turnoLibre = {
    di: { en: datos.en, es: datos.es },
    nota: datos.nota || "",
    objetivo: datos.objetivo,
    modelo: { en: datos.modelo_en, es: datos.modelo_es },
    alternativas: [],
    // Sin criterio fijo: en la conversación libre quien juzga si has
    // dicho lo que tocaba es la propia IA, no una lista de palabras.
    requiere: [],
    estructura: datos.estructura,
    estructuraEs: datos.estructuraEs,
    vocab: [],
    terminar: !!datos.terminar,
  };
  estado.historial.push({ quien: "app", datos });
  estado.intencion = null;

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
  if (!barra) return;
  const total = estado.libre ? MAX_TURNOS_LIBRE : estado.nivel.turnos.length;
  barra.style.width = `${Math.min(100, (estado.turno / total) * 100)}%`;
}

function mostrarTurnoApp() {
  const turno = turnoActual();
  estado.intencion = null;
  actualizarBarra();

  const chat = document.getElementById("chat");
  chat.insertAdjacentHTML("beforeend", `
    <div class="burbuja burbuja-app">
      <div class="quien">${escapar(estado.libre ? "Tu interlocutor" : estado.nivel.personaje)}</div>
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
  const turno = turnoActual();
  const resultado = evaluar({ texto: limpio, turno, porVoz, intencion: estado.intencion });

  document.getElementById("zona").innerHTML =
    `<div class="zona-respuesta texto-suave">Analizando tu respuesta…</div>`;

  // Si hay IA configurada, se le pide una segunda lectura: traduce
  // de verdad la frase corregida y explica los fallos que las
  // reglas fijas no cubren.
  let extra = null;
  if (hayIA()) {
    try {
      extra = await corregirConIA({
        texto: limpio,
        turno,
        escena: estado.libre ? estado.situacion : estado.nivel.escena,
      });
    } catch (error) {
      aviso(error.message, "error");
    }
  }

  // En la conversación libre no hay lista de palabras clave contra la
  // que medir el contenido, así que el veredicto lo pone la IA.
  if (estado.libre && extra) {
    if (!extra.correcta) {
      resultado.veredicto = "casi";
      resultado.etiqueta = "Se entiende, pero revísalo";
    } else if (extra.explicaciones && extra.explicaciones.length) {
      resultado.veredicto = "bien";
      resultado.etiqueta = "Bien, con un detalle";
    }
  }

  if (estado.libre) estado.historial.push({ quien: "tu", texto: limpio });

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

  // La frase de referencia solo se enseña si aporta algo: cuando ya
  // se ha mostrado esa misma frase como corrección, repetirla sobra.
  const flojaOCasi = resultado.veredicto === "casi" || resultado.veredicto === "flojo";
  const mostrarReferencia = flojaOCasi &&
    normalizarSimple(resultado.referencia.en).toLowerCase() !== normalizarSimple(corregido).toLowerCase();

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

        ${mostrarReferencia ? `
          <div style="margin-top:10px">
            <p class="texto-tenue" style="margin:0 0 3px">Una respuesta que encaja del todo:</p>
            ${lineaAudio(resultado.referencia.en, resultado.referencia.es)}
          </div>` : ""}
      </div>
    </div>`);

  chat.lastElementChild.scrollIntoView({ behavior: "smooth", block: "nearest" });

  const esUltimo = estado.libre
    ? (turnoActual().terminar || estado.turno >= MAX_TURNOS_LIBRE - 1)
    : estado.turno >= estado.nivel.turnos.length - 1;

  document.getElementById("zona").innerHTML = `
    <div class="zona-respuesta centrado">
      <div class="fila-botones" style="justify-content:center">
        <button class="btn btn-principal" id="btn-seguir">${esUltimo ? "Ver el resultado" : "Siguiente turno →"}</button>
        <button class="btn btn-secundario" id="btn-repetir">Repetir este turno</button>
      </div>
    </div>`;

  document.getElementById("btn-seguir").addEventListener("click", () => {
    if (esUltimo) { terminar(); return; }
    estado.turno += 1;
    if (estado.libre) pedirTurnoLibre();
    else mostrarTurnoApp();
  });
  document.getElementById("btn-repetir").addEventListener("click", () => {
    estado.resultados.pop();
    // En la libre también se descarta la respuesta del historial, para
    // que la IA no vea el intento que estás rehaciendo.
    if (estado.libre) estado.historial = estado.historial.filter((h, i) => !(h.quien === "tu" && i === estado.historial.length - 1));
    pintarZonaRespuesta(turnoActual());
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

  if (estado.libre) { terminarLibre(total, buenos, porcentaje); return; }

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

function terminarLibre(total, buenos, porcentaje) {
  const barra = document.querySelector("#barra > div");
  if (barra) barra.style.width = "100%";

  const mensaje = porcentaje >= 80
    ? "Has sostenido la conversación entera. Eso es exactamente lo que vas a tener que hacer viajando."
    : porcentaje >= 50
      ? "Bien: has llegado hasta el final. Repite la misma situación y verás la diferencia."
      : "Improvisar cuesta más que seguir un guion. Vuelve a las situaciones con guion un rato y prueba otra vez.";

  document.getElementById("zona").innerHTML = `
    <div class="tarjeta centrado">
      <h2>Conversación terminada</h2>
      <p style="font-size:2rem; margin:6px 0; font-weight:700; color:var(--mar)">${buenos} / ${total}</p>
      <div class="barra ${porcentaje >= 80 ? "verde" : "coral"}" style="max-width:280px;margin:0 auto 14px">
        <div style="width:${porcentaje}%"></div>
      </div>
      <p class="texto-suave">${escapar(mensaje)}</p>
      <p class="texto-tenue">
        Puedes desplazarte hacia arriba para releer toda la conversación con sus traducciones.
      </p>
      <div class="fila-botones" style="justify-content:center">
        <a class="btn btn-acento" href="conversar.html?modo=libre">Otra conversación libre</a>
        <a class="btn btn-secundario" href="conversar.html">Situaciones con guion</a>
      </div>
    </div>`;
}
