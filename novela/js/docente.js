// ============================================================
// Novela Colectiva — panel docente.
//
// Lo que de verdad hace falta en clase: ver de un vistazo quién ha
// escrito cada parte, mandarle una indicación a quien haga falta,
// saber quién no ha escrito todavía y cerrar el libro cuando toca.
//
// Las correcciones NO cambian el texto del alumno: le llegan como
// mensaje para que lo corrija él, que es donde está el aprendizaje.
// El texto original se guarda siempre aparte, así que aunque se
// corrija mil veces sigue estando lo que escribió de su puño.
// ============================================================

import {
  el, aviso, escapaHtml, confirmar, modal, fechaCorta, colorDeCodigo,
} from "./comun.js";
import {
  crearProyecto, escucharProyectosDelDocente, escucharProyecto, escucharFragmentos,
  escucharFichas, escucharNotas, escucharPortadas, actualizarProyecto, borrarProyecto,
  cambiarEstadoFragmento, crearNota, actualizarFicha,
  alumnosDelDocente, clasesDelDocente,
  fragmentoAPapelera, restaurarFragmento, borrarFragmentoParaSiempre,
  fichaAPapelera, restaurarFicha, borrarFichaParaSiempre,
  intercambiarOrden, cerrarCapitulo, reabrirUltimoCapitulo, borrarPortada,
} from "./proyectos.js";
import { indiceDeFaltas } from "./corrector.js";
import { TIPOS, ESTADOS_NARRATIVOS } from "./fichas.js";
import { descargarNovela, descargarCuadernoDocente, descargarInformeCSV } from "./exportar.js";
import { resumenDeCapitulo } from "./resumen.js";
import { hayVoz, leerFragmentos, pararVoz } from "./voz.js";
import { MODELOS, ajustesIA, guardarAjustesIA, hayIA, revisarCoherenciaConIA, resumirConIA } from "./ia.js";

const estado = {
  docente: null,
  proyectos: [],
  proyecto: null,
  fragmentos: [],
  fichas: [],
  notas: [],
  portadas: [],
  alumnos: [],
  clases: [],
  desuscribir: [],
};

// Lo que está en la papelera no cuenta para nada: ni se lee, ni se
// exporta, ni suma en la participación. Sigue existiendo, sin más.
function vivos(lista) { return lista.filter((f) => f.estado !== "papelera"); }
function fichasVivas(lista) { return lista.filter((f) => !f.borrada); }

// ---------- arranque ----------

async function arrancar() {
  estado.docente = window.Auth && window.Auth.loadTeacherSession();
  if (!estado.docente) {
    el("sin-sesion").classList.remove("oculto");
    return;
  }
  el("panel").classList.remove("oculto");
  el("quien-soy").textContent = estado.docente.displayName || estado.docente.email || "Docente";

  estado.clases = await clasesDelDocente(estado.docente.uid);
  estado.alumnos = await alumnosDelDocente(estado.docente.uid, null);

  escucharProyectosDelDocente(estado.docente.uid, (lista) => {
    estado.proyectos = lista;
    pintarListaProyectos();
  });

  document.querySelectorAll(".pestana").forEach((p) => {
    p.addEventListener("click", () => {
      document.querySelectorAll(".pestana").forEach((x) => x.classList.remove("activa"));
      p.classList.add("activa");
      document.querySelectorAll(".vista").forEach((v) => v.classList.toggle("activa", v.id === p.dataset.vista));
    });
  });

  el("btn-nueva").addEventListener("click", nuevaNovela);
  el("btn-guardar-ajustes").addEventListener("click", guardarAjustes);
  el("btn-cerrar-novela").addEventListener("click", cerrarNovela);
  el("btn-borrar").addEventListener("click", borrarLaNovela);
  el("btn-guardar-alumnos").addEventListener("click", guardarAutorizados);
  el("btn-todos").addEventListener("click", () => marcarTodos(true));
  el("btn-ninguno").addEventListener("click", () => marcarTodos(false));
  prepararIA();
  el("btn-pdf-novela").addEventListener("click", () =>
    descargarNovela(estado.proyecto, vivos(estado.fragmentos), fichasVivas(estado.fichas),
      estado.alumnos, portadaElegida()));
  el("btn-pdf-docente").addEventListener("click", () =>
    descargarCuadernoDocente(estado.proyecto, vivos(estado.fragmentos), fichasVivas(estado.fichas),
      estado.notas, estado.alumnos));
  el("btn-csv").addEventListener("click", () =>
    descargarInformeCSV(estado.proyecto, vivos(estado.fragmentos), estado.notas, estado.alumnos));

  el("btn-cerrar-capitulo").addEventListener("click", cerrarElCapitulo);
  el("btn-reabrir-capitulo").addEventListener("click", async () => {
    if (!(estado.proyecto.capitulos || []).length) return;
    if (!await confirmar("Se deshace el cierre del último capítulo. Las partes no se tocan.", "Reabrir")) return;
    await reabrirUltimoCapitulo(estado.proyecto);
    aviso("Capítulo reabierto.", "info");
  });

  // Lectura en voz alta: si el navegador no la trae, el botón no aparece.
  const btnVoz = el("btn-voz");
  if (!hayVoz()) btnVoz.classList.add("oculto");
  else btnVoz.addEventListener("click", () => {
    const publicados = vivos(estado.fragmentos).filter((f) => f.estado === "publicado");
    if (!publicados.length) { aviso("Todavía no hay nada que leer.", "error"); return; }
    if (btnVoz.dataset.leyendo === "1") {
      pararVoz();
      btnVoz.dataset.leyendo = "";
      btnVoz.textContent = "🔊 Leer la novela en voz alta";
      return;
    }
    btnVoz.dataset.leyendo = "1";
    btnVoz.textContent = "⏹ Parar la lectura";
    leerFragmentos(publicados.map((f) => f.texto), {
      alTerminar: () => { btnVoz.dataset.leyendo = ""; btnVoz.textContent = "🔊 Leer la novela en voz alta"; },
    });
  });
}

function portadaElegida() {
  if (!estado.proyecto || !estado.proyecto.portadaElegida) return null;
  return estado.portadas.find((p) => p.id === estado.proyecto.portadaElegida) || null;
}

// ---------- capítulos ----------

async function cerrarElCapitulo() {
  const p = estado.proyecto;
  const actual = p.capituloActual || 1;
  const delCapitulo = vivos(estado.fragmentos)
    .filter((f) => (f.capitulo || 1) === actual && f.estado === "publicado");

  if (!delCapitulo.length) {
    aviso("Este capítulo todavía no tiene ninguna parte publicada.", "error");
    return;
  }

  const propuesta = resumenDeCapitulo(delCapitulo, fichasVivas(estado.fichas));
  const datos = await modal((caja, cerrar) => {
    caja.innerHTML = `
      <h2>Cerrar el capítulo ${actual}</h2>
      <p class="texto-suave pequeno">Se cierran las ${delCapitulo.length} partes escritas hasta ahora.
      Lo que se escriba a partir de aquí irá al capítulo ${actual + 1}. No se borra ni se cambia nada:
      es solo un corte, y siempre puedes deshacerlo.</p>
      <div class="campo">
        <label for="cap-titulo">Título del capítulo</label>
        <input type="text" id="cap-titulo" value="Capítulo ${actual}">
      </div>
      <div class="campo">
        <label for="cap-resumen">Resumen (se propone uno hecho con las propias partes)</label>
        <textarea id="cap-resumen" rows="4">${escapaHtml(propuesta)}</textarea>
        <p class="pista">Aparece como entradilla del capítulo en la novela y en el PDF.</p>
      </div>
      <div class="modal-botones">
        <button class="btn btn-secundario" id="cap-cancelar">Cancelar</button>
        <button class="btn btn-principal" id="cap-cerrar">Cerrar el capítulo</button>
      </div>`;
    caja.querySelector("#cap-cancelar").addEventListener("click", () => cerrar(null));
    caja.querySelector("#cap-cerrar").addEventListener("click", () => cerrar({
      titulo: caja.querySelector("#cap-titulo").value.trim() || "Capítulo " + actual,
      resumen: caja.querySelector("#cap-resumen").value.trim(),
    }));
  }, { cerrarFuera: false });

  if (!datos) return;
  await cerrarCapitulo(p, {
    titulo: datos.titulo,
    resumen: datos.resumen,
    hastaOrden: delCapitulo[delCapitulo.length - 1].orden,
  });
  aviso("Capítulo cerrado. La clase empieza el " + (actual + 1) + ".", "exito");
}

// ---------- ayuda de IA (opcional) ----------

function prepararIA() {
  const a = ajustesIA();
  el("ia-usar").checked = !!a.usar;
  el("ia-clave").value = a.clave || "";
  el("ia-modelo").innerHTML = MODELOS
    .map((m) => `<option value="${m.id}" ${m.id === a.modelo ? "selected" : ""}>${m.nombre}</option>`).join("");

  el("btn-guardar-ia").addEventListener("click", () => {
    guardarAjustesIA({
      usar: el("ia-usar").checked,
      clave: el("ia-clave").value.trim(),
      modelo: el("ia-modelo").value,
    });
    aviso(hayIA() ? "Ayuda de IA activada en este dispositivo." : "Ayuda de IA desactivada.", "exito");
    pintarNovela();
  });

  el("btn-resumen-ia").addEventListener("click", resumirNovelaConIA);
}

async function resumirNovelaConIA() {
  if (!hayIA()) { aviso("Primero activa la ayuda de IA y guarda tu clave.", "error"); return; }
  const publicados = estado.fragmentos.filter((f) => f.estado === "publicado");
  if (!publicados.length) { aviso("Todavía no hay nada que resumir.", "error"); return; }
  aviso("Pidiendo el resumen a la IA…", "info");
  try {
    const r = await resumirConIA({
      titulo: estado.proyecto.titulo,
      fragmentos: publicados.map((f) => f.texto),
    });
    const texto = r.resumen + (r.hilos && r.hilos.length ? "\n\nSin resolver: " + r.hilos.join(" · ") : "");
    el("aj-resumen").value = texto;
    aviso("Resumen escrito. Revísalo y pulsa «Guardar ajustes» para que lo vea la clase.", "exito");
  } catch (e) {
    aviso(e.message, "error");
  }
}

async function revisarFragmentoConIA(f) {
  if (!hayIA()) { aviso("Activa la ayuda de IA en Ajustes para usar esto.", "error"); return; }
  aviso("Revisando con la IA…", "info");
  let r;
  try {
    const anteriores = estado.fragmentos
      .filter((x) => x.orden < f.orden && x.estado === "publicado")
      .slice(-4).map((x) => x.texto);
    r = await revisarCoherenciaConIA({
      titulo: estado.proyecto.titulo,
      fichas: estado.fichas,
      ultimos: anteriores,
      textoNuevo: f.texto,
    });
  } catch (e) {
    aviso(e.message, "error");
    return;
  }

  const enviar = await modal((caja, cerrar) => {
    caja.innerHTML = `
      <h2>${r.encaja ? "✅ La parte encaja" : "⚠️ Hay cosas que no encajan"}</h2>
      ${(r.avisos || []).length ? `<ul class="lista-avisos">${r.avisos.map((a) =>
        `<li class="coherencia"><strong>${escapaHtml(a.que)}</strong>
         <span class="explica">${escapaHtml(a.consejo)}</span></li>`).join("")}</ul>` : ""}
      <h3>Cómo quedaría si se arreglara</h3>
      <div class="cita" style="font-family:var(--serif); border-left:3px solid var(--borde-fuerte); padding-left:10px">
        ${escapaHtml(r.propuesta || "")}
      </div>
      <p class="pequeno texto-suave">Esta propuesta NO se guarda ni sustituye nada: la app nunca
      cambia lo que escribió el alumno. Si te parece bien, mándale el mensaje de abajo para que
      lo corrija él mismo.</p>
      <div class="campo">
        <label for="ia-mensaje">Mensaje para el alumno</label>
        <textarea id="ia-mensaje" rows="3">${escapaHtml(r.paraElAlumno || "")}</textarea>
      </div>
      <div class="modal-botones">
        <button class="btn btn-secundario" id="ia-cerrar">Cerrar sin enviar</button>
        <button class="btn btn-principal" id="ia-enviar">Enviárselo</button>
      </div>`;
    caja.querySelector("#ia-cerrar").addEventListener("click", () => cerrar(null));
    caja.querySelector("#ia-enviar").addEventListener("click", () =>
      cerrar(caja.querySelector("#ia-mensaje").value.trim()));
  }, { cerrarFuera: false });

  if (!enviar) return;
  await crearNota(estado.proyecto, {
    fragmentoId: f.id,
    destinatarioCode: f.autorCode,
    tipo: "indicacion",
    texto: enviar,
  });
  aviso("Enviado al alumno.", "exito");
}

// ---------- lista de novelas ----------

function pintarListaProyectos() {
  const cont = el("lista-proyectos");
  if (!estado.proyectos.length) {
    cont.innerHTML = '<li class="texto-suave">Todavía no has creado ninguna. Pulsa «Nueva».</li>';
    return;
  }
  cont.innerHTML = estado.proyectos.map((p) => `
    <li data-id="${p.id}" class="${estado.proyecto && estado.proyecto.id === p.id ? "activo" : ""}">
      <span class="nombre-proyecto">${escapaHtml(p.titulo)}</span>
      <span class="etiqueta ${p.estado === "cerrado" ? "morada" : p.estado === "pausado" ? "ambar" : "verde"}">${p.estado}</span>
      <span class="pequeno texto-suave">${p.numFragmentos || 0} partes · ${(p.participantes || []).length} alumnos</span>
    </li>`).join("");
  cont.querySelectorAll("li[data-id]").forEach((li) =>
    li.addEventListener("click", () => abrirProyecto(li.dataset.id)));
}

async function nuevaNovela() {
  const datos = await modal((caja, cerrar) => {
    caja.innerHTML = `
      <h2>Nueva novela</h2>
      <div class="campo">
        <label for="n-titulo">Título</label>
        <input type="text" id="n-titulo" placeholder="El misterio del faro apagado">
        <p class="pista">Se puede cambiar después. Es lo único imprescindible para empezar.</p>
      </div>
      <div class="campo">
        <label for="n-clase">Grupo</label>
        <select id="n-clase">
          <option value="">Todos mis alumnos</option>
          ${estado.clases.map((c) => `<option value="${c.id}">${escapaHtml(c.name || c.id)}</option>`).join("")}
        </select>
      </div>
      <div class="campo">
        <label for="n-semilla">Género, época y tono (recomendable)</label>
        <input type="text" id="n-semilla" placeholder="Misterio · actualidad · con humor">
        <p class="pista">Media línea aquí evita que la novela acabe siendo diez historias distintas.</p>
      </div>
      <label class="interruptor"><input type="checkbox" id="n-moderacion">
        <span>Quiero aprobar cada parte antes de que se publique</span></label>
      <p class="error-form" id="n-error"></p>
      <div class="modal-botones">
        <button class="btn btn-secundario" id="n-cancelar">Cancelar</button>
        <button class="btn btn-principal" id="n-crear">Crear novela</button>
      </div>`;
    caja.querySelector("#n-cancelar").addEventListener("click", () => cerrar(null));
    caja.querySelector("#n-crear").addEventListener("click", () => {
      const titulo = caja.querySelector("#n-titulo").value.trim();
      if (!titulo) { caja.querySelector("#n-error").textContent = "Ponle un título."; return; }
      cerrar({
        titulo: titulo,
        classId: caja.querySelector("#n-clase").value || null,
        semilla: { genero: caja.querySelector("#n-semilla").value.trim(), epoca: "", tono: "", personajes: "" },
        moderacionPrevia: caja.querySelector("#n-moderacion").checked,
      });
    });
  }, { cerrarFuera: false });

  if (!datos) return;
  const participantes = estado.alumnos
    .filter((a) => !datos.classId || a.classId === datos.classId)
    .map((a) => a.code);
  const id = await crearProyecto({
    teacherId: estado.docente.uid,
    classId: datos.classId,
    titulo: datos.titulo,
    semilla: datos.semilla,
    moderacionPrevia: datos.moderacionPrevia,
    participantes: participantes,
  });
  aviso("Novela creada. Ya pueden escribir " + participantes.length + " alumnos.", "exito");
  abrirProyecto(id);
}

// ---------- abrir una novela ----------

function abrirProyecto(id) {
  estado.desuscribir.forEach((f) => f());
  estado.desuscribir = [];
  el("sin-proyecto").classList.add("oculto");
  el("proyecto").classList.remove("oculto");

  estado.desuscribir.push(escucharProyecto(id, (p) => {
    estado.proyecto = p;
    if (!p) return;
    el("titulo-novela").textContent = p.titulo;
    el("enlace-proyeccion").href = "proyeccion.html?p=" + encodeURIComponent(p.id);
    pintarListaProyectos();
    pintarAjustes();
    pintarAutorizar();
    pintarNovela();
  }));
  estado.desuscribir.push(escucharFragmentos(id, (lista) => {
    estado.fragmentos = lista;
    pintarNovela();
    pintarParticipacion();
    pintarPendientes();
    pintarPapelera();
  }));
  estado.desuscribir.push(escucharFichas(id, (lista) => {
    estado.fichas = lista;
    pintarFichas();
    pintarPapelera();
  }));
  estado.desuscribir.push(escucharNotas(id, (lista) => {
    estado.notas = lista;
  }));
  estado.desuscribir.push(escucharPortadas(id, (lista) => {
    estado.portadas = lista;
    pintarPortadas();
  }));
}

// ---------- la novela con autoría ----------

function pintarNovela() {
  if (!estado.proyecto) return;
  const cont = el("fragmentos");
  const lista = vivos(estado.fragmentos);
  el("datos-novela").textContent =
    lista.length + " partes · " + (estado.proyecto.numPalabras || 0) + " palabras · " +
    new Set(lista.map((f) => f.autorCode)).size + " autores";

  if (!lista.length) {
    cont.innerHTML = '<p class="novela-vacia">Todavía no ha escrito nadie.</p>';
    return;
  }

  // Se pinta capítulo a capítulo: cada uno con su título y su
  // resumen, y las partes que todavía no tienen capítulo cerrado al
  // final, bajo el que se está escribiendo ahora mismo.
  const cerrados = estado.proyecto.capitulos || [];
  const trozos = [];
  let anterior = null;
  for (const f of lista) {
    const cap = f.capitulo || 1;
    if (cap !== anterior) {
      anterior = cap;
      const info = cerrados.find((c) => c.numero === cap);
      trozos.push(`<div class="rotulo-capitulo">
        <h3>${escapaHtml(info ? info.titulo : "Capítulo " + cap + " (en marcha)")}</h3>
        ${info && info.resumen ? `<p>${escapaHtml(info.resumen)}</p>` : ""}
      </div>`);
    }
    const clases = ["fragmento"];
    if (f.estado === "pendiente") clases.push("pendiente");
    if (f.estado === "oculto") clases.push("oculto-docente");
    if (f.estado === "cambios") clases.push("necesita-cambios");
    trozos.push(`<div class="${clases.join(" ")}" data-id="${f.id}" ` +
      `style="border-left-color:${colorDeCodigo(f.autorCode)}">${escapaHtml(f.texto)}</div>`);
  }
  cont.innerHTML = trozos.join("");

  cont.querySelectorAll(".fragmento").forEach((div) =>
    div.addEventListener("click", () => abrirDetalle(div, div.dataset.id)));
}

function abrirDetalle(div, id) {
  const siguiente = div.nextElementSibling;
  if (siguiente && siguiente.classList.contains("detalle-fragmento")) {
    siguiente.remove(); div.classList.remove("abierto"); return;
  }
  document.querySelectorAll(".detalle-fragmento").forEach((d) => d.remove());
  document.querySelectorAll(".fragmento").forEach((d) => d.classList.remove("abierto"));

  const f = estado.fragmentos.find((x) => x.id === id);
  if (!f) return;
  div.classList.add("abierto");
  const alumno = estado.alumnos.find((a) => a.code === f.autorCode);
  const idx = indiceDeFaltas(f.textoOriginal || f.texto);

  // Vecinas para poder moverla: la de justo antes y la de justo
  // después dentro de lo que está vivo.
  const lista = vivos(estado.fragmentos);
  const pos = lista.findIndex((x) => x.id === f.id);
  const anterior = pos > 0 ? lista[pos - 1] : null;
  const siguienteF = pos >= 0 && pos < lista.length - 1 ? lista[pos + 1] : null;

  const caja = document.createElement("div");
  caja.className = "detalle-fragmento";
  caja.innerHTML =
    `<span>Parte ${f.orden}${f.capitulo ? " · cap. " + f.capitulo : ""}</span>` +
    `<span class="autor" style="color:${colorDeCodigo(f.autorCode)}">${escapaHtml(alumno ? (alumno.nickname || f.autorCode) : f.autorCode)}</span>` +
    `<span class="codigo-alumno">${escapaHtml(f.autorCode)}</span>` +
    `<span>${escapaHtml(fechaCorta(f.creadoEn))}</span>` +
    `<span>${idx.palabras} palabras · ${idx.por100} faltas/100</span>` +
    (f.vecesEditado ? `<span class="etiqueta">corregido ${f.vecesEditado}×</span>` : "") +
    `<span class="botonera">
      ${f.estado === "pendiente" ? '<button class="btn btn-mini btn-exito" data-accion="aprobar">Aprobar</button>' : ""}
      ${hayIA() ? '<button class="btn btn-mini btn-secundario" data-accion="ia">🤖 Revisar con IA</button>' : ""}
      <button class="btn btn-mini btn-secundario" data-accion="subir" ${anterior ? "" : "disabled"} title="Moverla antes">↑ Subir</button>
      <button class="btn btn-mini btn-secundario" data-accion="bajar" ${siguienteF ? "" : "disabled"} title="Moverla después">↓ Bajar</button>
      <button class="btn btn-mini btn-secundario" data-accion="indicacion">Enviar indicación</button>
      <button class="btn btn-mini btn-secundario" data-accion="felicitar">Felicitar</button>
      <button class="btn btn-mini btn-secundario" data-accion="devolver">Devolver para corregir</button>
      <button class="btn btn-mini btn-secundario" data-accion="${f.estado === "oculto" ? "mostrar" : "ocultar"}">${f.estado === "oculto" ? "Recuperar" : "Quitar de la novela"}</button>
      <button class="btn btn-mini btn-peligro" data-accion="borrar">A la papelera</button>
    </span>`;
  div.after(caja);

  caja.querySelectorAll("[data-accion]").forEach((btn) => {
    btn.addEventListener("click", async (ev) => {
      ev.stopPropagation();
      const accion = btn.dataset.accion;
      if (accion === "aprobar") await cambiarEstadoFragmento(f.id, "publicado");
      else if (accion === "ocultar") await cambiarEstadoFragmento(f.id, "oculto");
      else if (accion === "mostrar") await cambiarEstadoFragmento(f.id, "publicado");
      else if (accion === "subir" && anterior) {
        await intercambiarOrden(f.id, f.orden, anterior.id, anterior.orden);
      } else if (accion === "bajar" && siguienteF) {
        await intercambiarOrden(f.id, f.orden, siguienteF.id, siguienteF.orden);
      } else if (accion === "borrar") {
        await fragmentoAPapelera(f.id, estado.docente.uid);
        aviso("A la papelera. Puedes recuperarla desde la pestaña «Papelera».", "info");
      } else if (accion === "devolver") {
        await cambiarEstadoFragmento(f.id, "cambios");
        await mandarNota(f, "correccion", "Devuelta para corregir");
      } else if (accion === "ia") await revisarFragmentoConIA(f);
      else if (accion === "indicacion") await mandarNota(f, "indicacion", "Indicación");
      else if (accion === "felicitar") await mandarNota(f, "felicitacion", "Felicitación");
    });
  });
}

async function mandarNota(fragmento, tipo, titulo) {
  const texto = await modal((caja, cerrar) => {
    const sugerencias = {
      correccion: "Repasa las tildes de esta parte y vuelve a enviarla.",
      indicacion: "Muy bien la escena, pero cuenta cómo llegan hasta allí.",
      felicitacion: "Me ha encantado cómo has descrito el bosque. ¡Sigue así!",
    };
    caja.innerHTML = `
      <h2>${escapaHtml(titulo)} para ${escapaHtml(fragmento.autorCode)}</h2>
      <div class="cita" style="font-family:var(--serif); font-style:italic; border-left:3px solid var(--borde-fuerte); padding-left:10px; margin:8px 0">
        ${escapaHtml(fragmento.texto.slice(0, 220))}${fragmento.texto.length > 220 ? "…" : ""}
      </div>
      <div class="campo">
        <label for="nota-texto">¿Qué le dices?</label>
        <textarea id="nota-texto" rows="3" placeholder="${escapaHtml(sugerencias[tipo])}"></textarea>
        <p class="pista">Le llegará dentro de la app, con su parte al lado, para que la corrija él mismo.</p>
      </div>
      <div class="modal-botones">
        <button class="btn btn-secundario" id="nota-cancelar">Cancelar</button>
        <button class="btn btn-principal" id="nota-enviar">Enviar</button>
      </div>`;
    caja.querySelector("#nota-cancelar").addEventListener("click", () => cerrar(null));
    caja.querySelector("#nota-enviar").addEventListener("click", () => {
      const t = caja.querySelector("#nota-texto").value.trim();
      if (t) cerrar(t);
    });
  }, { cerrarFuera: false });

  if (!texto) return;
  await crearNota(estado.proyecto, {
    fragmentoId: fragmento.id,
    destinatarioCode: fragmento.autorCode,
    tipo: tipo,
    texto: texto,
  });
  aviso("Enviado. Lo verá al entrar en la novela.", "exito");
}

function pintarPendientes() {
  const cont = el("pendientes");
  const pendientes = estado.fragmentos.filter((f) => f.estado === "pendiente");
  if (!pendientes.length) { cont.classList.add("oculto"); return; }
  cont.classList.remove("oculto");
  cont.innerHTML = `<h2>⏳ ${pendientes.length} parte(s) esperando tu visto bueno</h2>` +
    pendientes.map((f) => `
      <div class="nota">
        <div class="cabecera-nota">${escapaHtml(f.autorCode)} · parte ${f.orden}</div>
        <div>${escapaHtml(f.texto)}</div>
        <div class="botonera" style="margin-top:6px">
          <button class="btn btn-mini btn-exito" data-ok="${f.id}">Publicar</button>
          <button class="btn btn-mini btn-secundario" data-no="${f.id}">Devolver para corregir</button>
        </div>
      </div>`).join("");
  cont.querySelectorAll("[data-ok]").forEach((b) =>
    b.addEventListener("click", () => cambiarEstadoFragmento(b.dataset.ok, "publicado")));
  cont.querySelectorAll("[data-no]").forEach((b) =>
    b.addEventListener("click", async () => {
      const f = estado.fragmentos.find((x) => x.id === b.dataset.no);
      await cambiarEstadoFragmento(f.id, "cambios");
      await mandarNota(f, "correccion", "Devuelta para corregir");
    }));
}

// ---------- alumnado ----------

function pintarAutorizar() {
  if (!estado.proyecto) return;
  const autorizados = new Set(estado.proyecto.participantes || []);
  const cont = el("lista-autorizar");
  const alumnos = estado.alumnos;
  if (!alumnos.length) {
    cont.innerHTML = '<p class="texto-suave">No tienes alumnos dados de alta. Créalos en el panel general del profesorado.</p>';
    return;
  }
  cont.innerHTML = alumnos.map((a) => `
    <label class="interruptor">
      <input type="checkbox" value="${a.code}" ${autorizados.has(a.code) ? "checked" : ""}>
      <span>${escapaHtml(a.nickname || a.code)} <span class="codigo-alumno">${a.code}</span></span>
    </label>`).join("");
}

function marcarTodos(valor) {
  el("lista-autorizar").querySelectorAll("input").forEach((i) => { i.checked = valor; });
}

async function guardarAutorizados() {
  const codigos = Array.from(el("lista-autorizar").querySelectorAll("input:checked")).map((i) => i.value);
  await actualizarProyecto(estado.proyecto.id, { participantes: codigos });
  aviso("Guardado: " + codigos.length + " alumnos pueden escribir.", "exito");
}

function pintarParticipacion() {
  const cont = el("tabla-participacion");
  const autorizados = (estado.proyecto && estado.proyecto.participantes) || [];
  const datos = new Map();
  for (const codigo of autorizados) datos.set(codigo, { partes: 0, palabras: 0, faltas: 0, total: 0, ultima: null });
  for (const f of vivos(estado.fragmentos)) {
    const d = datos.get(f.autorCode) || { partes: 0, palabras: 0, faltas: 0, total: 0, ultima: null };
    const idx = indiceDeFaltas(f.textoOriginal || f.texto);
    d.partes++; d.palabras += idx.palabras; d.faltas += idx.faltas; d.total += idx.palabras;
    d.ultima = f.creadoEn;
    datos.set(f.autorCode, d);
  }
  const maxPalabras = Math.max(1, ...Array.from(datos.values()).map((d) => d.palabras));
  const filas = Array.from(datos.entries()).sort((a, b) => b[1].palabras - a[1].palabras);

  cont.innerHTML = `<table class="tabla">
    <thead><tr><th>Alumno</th><th>Partes</th><th>Palabras</th><th>Faltas /100</th><th>Última vez</th><th></th></tr></thead>
    <tbody>${filas.map(([codigo, d]) => {
      const a = estado.alumnos.find((x) => x.code === codigo);
      const por100 = Math.round((d.faltas * 1000) / (d.total || 1)) / 10;
      return `<tr class="${d.partes ? "" : "sin-escribir"}">
        <td>${escapaHtml(a ? (a.nickname || codigo) : codigo)} <span class="codigo-alumno">${codigo}</span></td>
        <td class="num">${d.partes}</td>
        <td class="num">${d.palabras}</td>
        <td class="num">${d.partes ? por100 : "—"}</td>
        <td>${d.ultima ? escapaHtml(fechaCorta(d.ultima)) : "todavía no ha escrito"}</td>
        <td><span class="barra-participacion"><div style="width:${(d.palabras / maxPalabras) * 100}%; background:${colorDeCodigo(codigo)}"></div></span></td>
      </tr>`;
    }).join("")}</tbody></table>`;
}

// ---------- fichas ----------

function pintarFichas() {
  const cont = el("fichas-docente");
  const lista = fichasVivas(estado.fichas);
  if (!lista.length) {
    cont.innerHTML = '<p class="texto-suave">Todavía no hay fichas.</p>';
    return;
  }
  cont.innerHTML = lista.map((f) => {
    const t = TIPOS[f.tipo] || TIPOS.personaje;
    const respuestas = (t.preguntas || []).map((p) => {
      const r = (f.respuestas || {})[p.id];
      return r ? `<dt>${escapaHtml(p.texto)}</dt><dd>${escapaHtml(r)}</dd>` : "";
    }).join("");
    return `<div class="nota" style="background:var(--papel-hondo); border-left-color:var(--azul)">
      <div class="cabecera-nota">${t.icono} ${escapaHtml(f.nombre)}
        <span class="etiqueta">${t.etiqueta}</span>
        <span class="codigo-alumno">${escapaHtml(f.autorCode || "")}</span></div>
      <dl class="ficha-detalle">${respuestas}</dl>
      <div class="botonera">
        ${f.tipo === "personaje" ? `<select data-estado="${f.id}">${ESTADOS_NARRATIVOS.map((e) =>
          `<option ${e === (f.estadoNarrativo || "en la historia") ? "selected" : ""}>${e}</option>`).join("")}</select>` : ""}
        <button class="btn btn-mini btn-peligro" data-borrar="${f.id}">Borrar ficha</button>
      </div>
    </div>`;
  }).join("");

  cont.querySelectorAll("[data-estado]").forEach((sel) =>
    sel.addEventListener("change", () => actualizarFicha(sel.dataset.estado, { estadoNarrativo: sel.value })));
  cont.querySelectorAll("[data-borrar]").forEach((b) =>
    b.addEventListener("click", async () => {
      await fichaAPapelera(b.dataset.borrar);
      aviso("Ficha a la papelera. El nombre vuelve a marcarse como desconocido.", "info");
    }));
}

// ---------- papelera ----------

function pintarPapelera() {
  const cont = el("papelera");
  if (!cont) return;
  const partes = estado.fragmentos.filter((f) => f.estado === "papelera");
  const fichas = estado.fichas.filter((f) => f.borrada);
  const cuenta = partes.length + fichas.length;

  const chip = el("cuenta-papelera");
  if (chip) chip.textContent = cuenta ? String(cuenta) : "";

  if (!cuenta) {
    cont.innerHTML = '<p class="texto-suave">La papelera está vacía.</p>';
    return;
  }

  const trozos = [];
  if (partes.length) {
    trozos.push("<h3>Partes de la novela</h3>");
    trozos.push(partes.map((f) => `
      <div class="nota">
        <div class="cabecera-nota">Parte ${f.orden} · ${escapaHtml(f.autorCode)}
          ${f.borradoEn ? `<span class="pequeno texto-suave">${escapaHtml(fechaCorta(f.borradoEn))}</span>` : ""}</div>
        <div>${escapaHtml(f.texto.slice(0, 260))}${f.texto.length > 260 ? "…" : ""}</div>
        <div class="botonera" style="margin-top:6px">
          <button class="btn btn-mini btn-exito" data-recuperar="${f.id}">Recuperar</button>
          <button class="btn btn-mini btn-peligro" data-siempre="${f.id}">Borrar para siempre</button>
        </div>
      </div>`).join(""));
  }
  if (fichas.length) {
    trozos.push("<h3>Fichas</h3>");
    trozos.push(fichas.map((f) => `
      <div class="nota">
        <div class="cabecera-nota">${(TIPOS[f.tipo] || TIPOS.personaje).icono} ${escapaHtml(f.nombre)}</div>
        <div class="botonera" style="margin-top:6px">
          <button class="btn btn-mini btn-exito" data-recuperar-ficha="${f.id}">Recuperar</button>
          <button class="btn btn-mini btn-peligro" data-siempre-ficha="${f.id}">Borrar para siempre</button>
        </div>
      </div>`).join(""));
  }
  cont.innerHTML = trozos.join("");

  cont.querySelectorAll("[data-recuperar]").forEach((b) =>
    b.addEventListener("click", async () => {
      await restaurarFragmento(b.dataset.recuperar);
      aviso("Recuperada: vuelve a estar en la novela.", "exito");
    }));
  cont.querySelectorAll("[data-recuperar-ficha]").forEach((b) =>
    b.addEventListener("click", async () => {
      await restaurarFicha(b.dataset.recuperarFicha);
      aviso("Ficha recuperada.", "exito");
    }));
  cont.querySelectorAll("[data-siempre]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (await confirmar("Esto sí es definitivo: la parte desaparece y no hay vuelta atrás.", "Borrar para siempre")) {
        await borrarFragmentoParaSiempre(b.dataset.siempre);
        aviso("Borrada definitivamente.", "info");
      }
    }));
  cont.querySelectorAll("[data-siempre-ficha]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (await confirmar("Esto sí es definitivo: la ficha desaparece y no hay vuelta atrás.", "Borrar para siempre")) {
        await borrarFichaParaSiempre(b.dataset.siempreFicha);
      }
    }));
}

// ---------- portadas del alumnado ----------

function pintarPortadas() {
  const cont = el("portadas");
  if (!cont || !estado.proyecto) return;
  if (!estado.portadas.length) {
    cont.innerHTML = '<p class="texto-suave">Todavía no ha dibujado nadie. ' +
      "El alumnado tiene el botón «Dibujar la portada» en su pantalla de escribir.</p>";
    return;
  }
  const elegida = estado.proyecto.portadaElegida;
  cont.innerHTML = '<div class="rejilla-portadas">' + estado.portadas.map((p) => `
    <figure class="portada-card ${p.id === elegida ? "elegida" : ""}">
      <img src="${escapaHtml(p.imagen)}" alt="Portada de ${escapaHtml(p.autorCode)}">
      <figcaption>
        <span class="codigo-alumno">${escapaHtml(p.autorCode)}</span>
        ${p.id === elegida ? '<span class="etiqueta verde">En el libro</span>' : ""}
      </figcaption>
      <div class="botonera">
        <button class="btn btn-mini ${p.id === elegida ? "btn-secundario" : "btn-principal"}" data-elegir="${p.id}">
          ${p.id === elegida ? "Quitarla del libro" : "Poner en el libro"}</button>
        <button class="btn btn-mini btn-peligro" data-borrar-portada="${p.id}">Borrar</button>
      </div>
    </figure>`).join("") + "</div>";

  cont.querySelectorAll("[data-elegir]").forEach((b) =>
    b.addEventListener("click", async () => {
      const id = b.dataset.elegir;
      const nueva = estado.proyecto.portadaElegida === id ? null : id;
      await actualizarProyecto(estado.proyecto.id, { portadaElegida: nueva });
      aviso(nueva ? "Esa portada irá en el PDF." : "El libro vuelve a salir sin portada dibujada.", "exito");
    }));
  cont.querySelectorAll("[data-borrar-portada]").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!await confirmar("¿Borrar este dibujo?", "Borrar")) return;
      if (estado.proyecto.portadaElegida === b.dataset.borrarPortada) {
        await actualizarProyecto(estado.proyecto.id, { portadaElegida: null });
      }
      await borrarPortada(b.dataset.borrarPortada);
    }));
}

// ---------- ajustes ----------

function pintarAjustes() {
  const p = estado.proyecto;
  if (!p) return;
  el("aj-titulo").value = p.titulo || "";
  el("aj-resumen").value = p.resumenManual || "";
  el("aj-genero").value = (p.semilla && p.semilla.genero) || "";
  el("aj-escritura").checked = p.escrituraAbierta !== false;
  el("aj-cola").checked = p.modoTurno === "cola";
  el("aj-moderacion").checked = !!p.moderacionPrevia;
  el("aj-autoria").checked = !!p.autoriaVisible;
  el("aj-lineas").value = p.maxLineas || 10;
  el("btn-cerrar-novela").textContent = p.estado === "cerrado"
    ? "Volver a abrir la novela" : "Dar por terminada la novela";

  const cerrados = p.capitulos || [];
  el("estado-capitulos").textContent = cerrados.length
    ? cerrados.length + " capítulo(s) cerrado(s). Ahora se escribe el " + (p.capituloActual || 1) + "."
    : "Todavía no has cerrado ningún capítulo: la novela va de corrido.";
  el("btn-reabrir-capitulo").disabled = !cerrados.length;

  const sel = el("aj-cerrador");
  const autorizados = p.participantes || [];
  sel.innerHTML = '<option value="">Solo yo</option>' + estado.alumnos
    .filter((a) => autorizados.includes(a.code))
    .map((a) => `<option value="${a.code}" ${p.cerradorAutorizado === a.code ? "selected" : ""}>${escapaHtml(a.nickname || a.code)} (${a.code})</option>`)
    .join("");
}

async function guardarAjustes() {
  await actualizarProyecto(estado.proyecto.id, {
    titulo: el("aj-titulo").value.trim() || estado.proyecto.titulo,
    resumenManual: el("aj-resumen").value.trim(),
    semilla: Object.assign({}, estado.proyecto.semilla, { genero: el("aj-genero").value.trim() }),
    escrituraAbierta: el("aj-escritura").checked,
    modoTurno: el("aj-cola").checked ? "cola" : "libre",
    moderacionPrevia: el("aj-moderacion").checked,
    autoriaVisible: el("aj-autoria").checked,
    maxLineas: Math.max(3, Math.min(30, Number(el("aj-lineas").value) || 10)),
    cerradorAutorizado: el("aj-cerrador").value || null,
  });
  aviso("Ajustes guardados.", "exito");
}

async function cerrarNovela() {
  const abierta = estado.proyecto.estado !== "cerrado";
  if (abierta) {
    if (!await confirmar("¿Dar por terminada la novela? Ya no se podrá escribir, pero podrás descargarla y volver a abrirla.", "Terminar")) return;
    await actualizarProyecto(estado.proyecto.id, { estado: "cerrado", escrituraAbierta: false });
    aviso("Novela terminada. Ya puedes descargar el PDF. 🎉", "exito");
  } else {
    await actualizarProyecto(estado.proyecto.id, { estado: "abierto", escrituraAbierta: true });
    aviso("Novela reabierta.", "exito");
  }
}

async function borrarLaNovela() {
  if (!await confirmar("Se borrará la novela entera con todas sus partes, fichas y mensajes. Esto no se puede deshacer.", "Borrar todo")) return;
  await borrarProyecto(estado.proyecto.id);
  estado.proyecto = null;
  el("proyecto").classList.add("oculto");
  el("sin-proyecto").classList.remove("oculto");
  aviso("Novela borrada.", "info");
}

// ---------- puesta en marcha ----------

document.addEventListener("ar:auth-ready", arrancar);
if (window.Auth) arrancar();
