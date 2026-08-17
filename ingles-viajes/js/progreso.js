// ============================================================
// Inglés para Viajar — progreso, ajustes y copia de seguridad.
// ============================================================

import { VOCABULARIO, VOCAB_POR_ID, TEMAS_VOCABULARIO } from "./datos-vocabulario.js";
import { TEMAS } from "./datos-conversaciones.js";
import {
  resumen, leer, tarjeta, progresoNivel, ajustes, guardarAjustes,
  exportar, importar, borrarTodo,
} from "./almacen.js";
import { hayIA, MODELOS, probarClave } from "./ia.js";
import { aviso, escapar, pintarCabecera, confirmar } from "./comun.js";
import { soportaMicrofono } from "./voz.js";

const pantalla = document.getElementById("pantalla");
const TODOS_IDS = VOCABULARIO.map((v) => v.id);
const TOTAL_NIVELES = TEMAS.reduce((n, t) => n + t.niveles.length, 0);

pintar();

function pintar() {
  pintarCabecera("Mi progreso");
  const r = resumen(TODOS_IDS, TOTAL_NIVELES);
  const a = ajustes();

  pantalla.innerHTML = `
    ${bloqueResumen(r)}
    ${bloqueConversaciones()}
    ${bloqueVocabulario()}
    ${bloqueFlojas()}
    ${bloqueAjustes(a)}
    ${bloqueIA(a)}
    ${bloqueRespaldo()}`;

  enlazar();
}

// ------------------------------------------------------------

function bloqueResumen(r) {
  const pctNiveles = Math.round((r.nivelesHechos / r.totalNiveles) * 100);
  const pctVocab = Math.round((r.dominadas / r.palabrasTotales) * 100);

  return `
    <div class="tarjeta" style="margin-top:14px">
      <h2 style="margin-bottom:12px">Dónde estás</h2>

      <p style="margin-bottom:4px"><strong>Conversaciones</strong> · ${r.nivelesHechos} de ${r.totalNiveles}</p>
      <div class="barra" style="margin-bottom:14px"><div style="width:${pctNiveles}%"></div></div>

      <p style="margin-bottom:4px"><strong>Vocabulario dominado</strong> · ${r.dominadas} de ${r.palabrasTotales}</p>
      <div class="barra verde" style="margin-bottom:16px"><div style="width:${pctVocab}%"></div></div>

      <div class="marcador" style="justify-content:flex-start; flex-wrap:wrap; gap:18px">
        <span>Turnos respondidos <b>${r.turnos}</b></span>
        <span>Bordados <b>${r.perfectos}</b></span>
        <span>Repasos hechos <b>${r.repasos}</b></span>
        <span>Racha <b>${r.racha} ${r.racha === 1 ? "día" : "días"}</b></span>
      </div>

      ${r.pendientesHoy > 0
        ? `<p class="texto-suave" style="margin:14px 0 0">
             Tienes <strong>${r.pendientesHoy}</strong> ${r.pendientesHoy === 1 ? "palabra" : "palabras"} esperando repaso.
             <a href="vocabulario.html?modo=repaso">Repasar ahora →</a>
           </p>`
        : `<p class="texto-suave" style="margin:14px 0 0">Al día con los repasos. 👌</p>`}
    </div>`;
}

function bloqueConversaciones() {
  const filas = TEMAS.map((tema) => {
    const chips = tema.niveles.map((_, i) => {
      const p = progresoNivel(tema.id, i);
      if (p && p.completado) {
        const nota = p.total ? Math.round((p.aciertos / p.total) * 100) : 0;
        return `<span class="caja-caja dominada" title="Mejor resultado">N${i + 1} · ${nota}%</span>`;
      }
      return `<span class="caja-caja">N${i + 1}</span>`;
    }).join(" ");

    return `
      <li>
        <span style="font-size:1.2rem">${tema.icono}</span>
        <div class="cuerpo-vocab"><div class="en-vocab">${escapar(tema.titulo)}</div></div>
        <div style="display:flex; gap:4px">${chips}</div>
      </li>`;
  }).join("");

  return `
    <div class="tarjeta">
      <h2>Conversaciones por tema</h2>
      <p class="texto-suave" style="font-size:0.9rem">El porcentaje es tu mejor resultado en cada nivel.</p>
      <ul class="lista-vocab">${filas}</ul>
    </div>`;
}

function bloqueVocabulario() {
  const filas = TEMAS_VOCABULARIO.map((tema) => {
    const items = VOCABULARIO.filter((v) => v.tema === tema.id);
    const dominadas = items.filter((v) => { const t = tarjeta(v.id); return t && t.caja >= 4; }).length;
    const pct = Math.round((dominadas / items.length) * 100);
    return `
      <div style="margin-bottom:10px">
        <p style="margin:0 0 3px; font-size:0.9rem">
          ${tema.icono} ${escapar(tema.nombre)}
          <span class="texto-tenue"> · ${dominadas}/${items.length}</span>
        </p>
        <div class="barra"><div style="width:${pct}%"></div></div>
      </div>`;
  }).join("");

  return `<div class="tarjeta"><h2>Vocabulario por bloques</h2>${filas}</div>`;
}

function bloqueFlojas() {
  const datos = leer();
  const flojas = Object.entries(datos.tarjetas)
    .filter(([, t]) => t.fallos >= 2 && t.fallos >= t.aciertos)
    .sort((a, b) => b[1].fallos - a[1].fallos)
    .slice(0, 10)
    .map(([id]) => VOCAB_POR_ID[id])
    .filter(Boolean);

  if (!flojas.length) return "";

  return `
    <div class="tarjeta">
      <h2>Las que se te resisten</h2>
      <p class="texto-suave" style="font-size:0.9rem">
        Estas las has fallado más veces de las que las has acertado. Míralas con calma:
        casi siempre es un problema de pronunciación, no de memoria.
      </p>
      <ul class="lista-vocab">
        ${flojas.map((v) => `
          <li>
            <button class="btn-audio" data-hablar="${escapar(v.en)}">🔊</button>
            <div class="cuerpo-vocab">
              <div class="en-vocab">${escapar(v.en)}</div>
              <div class="es-vocab">${escapar(v.es)} · <span class="pron-vocab">${escapar(v.pron)}</span></div>
            </div>
          </li>`).join("")}
      </ul>
    </div>`;
}

function bloqueAjustes(a) {
  return `
    <div class="tarjeta">
      <h2>Ajustes</h2>

      <label for="nuevas">Palabras nuevas por sesión de repaso</label>
      <select id="nuevas">
        ${[4, 6, 8, 12, 16, 20].map((n) => `<option value="${n}" ${a.nuevasPorDia === n ? "selected" : ""}>${n} palabras</option>`).join("")}
      </select>
      <p class="texto-tenue" style="margin:5px 0 14px">
        Ocho al día es un ritmo sostenible: en un mes son casi 250 palabras.
      </p>

      <label for="modo">Cómo prefieres responder en las conversaciones</label>
      <select id="modo" ${soportaMicrofono() ? "" : "disabled"}>
        <option value="voz" ${a.modoEntrada === "voz" ? "selected" : ""}>Hablando (micrófono)</option>
        <option value="texto" ${a.modoEntrada === "texto" ? "selected" : ""}>Escribiendo</option>
      </select>
      <p class="texto-tenue" style="margin:5px 0 0">
        ${soportaMicrofono()
          ? "Puedes cambiarlo también dentro de cada conversación."
          : "Este navegador no admite micrófono, así que solo está disponible escribir."}
      </p>
    </div>`;
}

function bloqueIA(a) {
  return `
    <div class="tarjeta">
      <h2>Conversación libre con IA <span class="caja-caja">opcional</span></h2>
      <p class="texto-suave" style="font-size:0.92rem">
        La app funciona entera sin esto. Si pegas aquí tu clave de la API de Anthropic, además de los
        guiones podrás recibir correcciones sobre <strong>cualquier</strong> frase que digas, con
        traducción real y explicaciones a medida.
      </p>
      <div class="tarjeta-plana" style="margin-bottom:14px">
        <p style="margin:0; font-size:0.88rem">
          <strong>Sobre la clave:</strong> se guarda solo en este navegador y se envía directamente a
          la API de Anthropic. Es razonable en tu móvil o tu ordenador personal; no la pongas en un
          equipo compartido, y no publiques la app con la clave dentro. El uso lo pagas tú, según lo
          que consumas.
        </p>
      </div>

      <label for="usar-ia">
        <input type="checkbox" id="usar-ia" ${a.usarIA ? "checked" : ""} style="width:auto; margin-right:6px">
        Activar las correcciones con IA
      </label>

      <label for="clave" style="margin-top:12px">Clave de la API</label>
      <input type="password" id="clave" value="${escapar(a.claveIA)}" placeholder="sk-ant-..." autocomplete="off">

      <label for="modelo" style="margin-top:12px">Modelo</label>
      <select id="modelo">
        ${MODELOS.map((m) => `<option value="${m.id}" ${a.modeloIA === m.id ? "selected" : ""}>${escapar(m.nombre)}</option>`).join("")}
      </select>

      <div class="fila-botones" style="margin-top:12px">
        <button class="btn btn-principal" id="btn-guardar-ia">Guardar</button>
        <button class="btn btn-secundario" id="btn-probar-ia">Probar la conexión</button>
      </div>
      <p class="texto-tenue" id="estado-ia" style="margin:10px 0 0">
        ${hayIA() ? "IA activada." : "IA desactivada: la app usa las correcciones propias, que funcionan sin conexión."}
      </p>
    </div>`;
}

function bloqueRespaldo() {
  return `
    <div class="tarjeta">
      <h2>Copia de seguridad</h2>
      <p class="texto-suave" style="font-size:0.92rem">
        Tu progreso vive solo en este dispositivo. Si cambias de móvil, descarga el archivo aquí
        y cárgalo en el nuevo. (La clave de la API no se incluye en el archivo, a propósito.)
      </p>
      <div class="fila-botones">
        <button class="btn btn-secundario" id="btn-exportar">Descargar mi progreso</button>
        <button class="btn btn-secundario" id="btn-importar">Cargar un archivo</button>
        <button class="btn btn-secundario" id="btn-borrar" style="color:var(--rojo)">Empezar de cero</button>
      </div>
      <input type="file" id="archivo" accept="application/json,.json" style="display:none">
    </div>`;
}

// ------------------------------------------------------------

function enlazar() {
  pantalla.addEventListener("click", (e) => {
    const audio = e.target.closest("[data-hablar]");
    if (audio) import("./voz.js").then((v) => v.hablar(audio.getAttribute("data-hablar")));
  });

  document.getElementById("nuevas").addEventListener("change", (e) => {
    guardarAjustes({ nuevasPorDia: Number(e.target.value) });
    aviso("Ajuste guardado.", "exito");
  });

  const modo = document.getElementById("modo");
  if (!modo.disabled) {
    modo.addEventListener("change", (e) => {
      guardarAjustes({ modoEntrada: e.target.value });
      aviso("Ajuste guardado.", "exito");
    });
  }

  document.getElementById("btn-guardar-ia").addEventListener("click", () => {
    guardarAjustes({
      usarIA: document.getElementById("usar-ia").checked,
      claveIA: document.getElementById("clave").value.trim(),
      modeloIA: document.getElementById("modelo").value,
    });
    document.getElementById("estado-ia").textContent = hayIA()
      ? "IA activada."
      : "IA desactivada: la app usa las correcciones propias, que funcionan sin conexión.";
    aviso("Ajustes de IA guardados.", "exito");
  });

  document.getElementById("btn-probar-ia").addEventListener("click", async () => {
    const boton = document.getElementById("btn-probar-ia");
    const estado = document.getElementById("estado-ia");
    guardarAjustes({
      usarIA: true,
      claveIA: document.getElementById("clave").value.trim(),
      modeloIA: document.getElementById("modelo").value,
    });
    boton.disabled = true;
    estado.textContent = "Probando…";
    try {
      const mensaje = await probarClave();
      estado.textContent = "✅ " + mensaje;
      document.getElementById("usar-ia").checked = true;
      aviso("Conexión correcta.", "exito");
    } catch (error) {
      estado.textContent = "❌ " + error.message;
      aviso(error.message, "error");
    } finally {
      boton.disabled = false;
    }
  });

  document.getElementById("btn-exportar").addEventListener("click", () => {
    const blob = new Blob([exportar()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = `ingles-viajes-progreso-${new Date().toISOString().slice(0, 10)}.json`;
    enlace.click();
    URL.revokeObjectURL(url);
  });

  const archivo = document.getElementById("archivo");
  document.getElementById("btn-importar").addEventListener("click", () => archivo.click());
  archivo.addEventListener("change", async () => {
    const fichero = archivo.files[0];
    if (!fichero) return;
    try {
      importar(await fichero.text());
      aviso("Progreso restaurado.", "exito");
      pintar();
    } catch (error) {
      aviso("No he podido leer ese archivo: " + error.message, "error");
    }
    archivo.value = "";
  });

  document.getElementById("btn-borrar").addEventListener("click", async () => {
    const seguro = await confirmar(
      "Se borrará todo tu progreso en este dispositivo: conversaciones, vocabulario y racha. No se puede deshacer.",
      "Borrar todo"
    );
    if (!seguro) return;
    borrarTodo();
    aviso("Progreso borrado.", "exito");
    pintar();
  });
}
