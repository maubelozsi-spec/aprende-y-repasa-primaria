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
  escucharFichas, escucharNotas, actualizarProyecto, borrarProyecto,
  cambiarEstadoFragmento, borrarFragmento, crearNota, actualizarFicha,
  borrarFicha, alumnosDelDocente, clasesDelDocente,
} from "./proyectos.js";
import { indiceDeFaltas } from "./corrector.js";
import { TIPOS, ESTADOS_NARRATIVOS } from "./fichas.js";
import { descargarNovela, descargarCuadernoDocente } from "./exportar.js";
import { MODELOS, ajustesIA, guardarAjustesIA, hayIA, revisarCoherenciaConIA, resumirConIA } from "./ia.js";

const estado = {
  docente: null,
  proyectos: [],
  proyecto: null,
  fragmentos: [],
  fichas: [],
  notas: [],
  alumnos: [],
  clases: [],
  desuscribir: [],
};

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
    descargarNovela(estado.proyecto, estado.fragmentos, estado.fichas, estado.alumnos));
  el("btn-pdf-docente").addEventListener("click", () =>
    descargarCuadernoDocente(estado.proyecto, estado.fragmentos, estado.fichas, estado.notas, estado.alumnos));
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
  }));
  estado.desuscribir.push(escucharFichas(id, (lista) => {
    estado.fichas = lista;
    pintarFichas();
  }));
  estado.desuscribir.push(escucharNotas(id, (lista) => {
    estado.notas = lista;
  }));
}

// ---------- la novela con autoría ----------

function pintarNovela() {
  if (!estado.proyecto) return;
  const cont = el("fragmentos");
  el("datos-novela").textContent =
    estado.fragmentos.length + " partes · " + (estado.proyecto.numPalabras || 0) + " palabras · " +
    new Set(estado.fragmentos.map((f) => f.autorCode)).size + " autores";

  if (!estado.fragmentos.length) {
    cont.innerHTML = '<p class="novela-vacia">Todavía no ha escrito nadie.</p>';
    return;
  }
  cont.innerHTML = estado.fragmentos.map((f) => {
    const clases = ["fragmento"];
    if (f.estado === "pendiente") clases.push("pendiente");
    if (f.estado === "oculto") clases.push("oculto-docente");
    if (f.estado === "cambios") clases.push("necesita-cambios");
    const color = colorDeCodigo(f.autorCode);
    return `<div class="${clases.join(" ")}" data-id="${f.id}" style="border-left-color:${color}">${escapaHtml(f.texto)}</div>`;
  }).join("");

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

  const caja = document.createElement("div");
  caja.className = "detalle-fragmento";
  caja.innerHTML =
    `<span>Parte ${f.orden}</span>` +
    `<span class="autor" style="color:${colorDeCodigo(f.autorCode)}">${escapaHtml(alumno ? (alumno.nickname || f.autorCode) : f.autorCode)}</span>` +
    `<span class="codigo-alumno">${escapaHtml(f.autorCode)}</span>` +
    `<span>${escapaHtml(fechaCorta(f.creadoEn))}</span>` +
    `<span>${idx.palabras} palabras · ${idx.por100} faltas/100</span>` +
    (f.vecesEditado ? `<span class="etiqueta">corregido ${f.vecesEditado}×</span>` : "") +
    `<span class="botonera">
      ${f.estado === "pendiente" ? '<button class="btn btn-mini btn-exito" data-accion="aprobar">Aprobar</button>' : ""}
      ${hayIA() ? '<button class="btn btn-mini btn-secundario" data-accion="ia">🤖 Revisar con IA</button>' : ""}
      <button class="btn btn-mini btn-secundario" data-accion="indicacion">Enviar indicación</button>
      <button class="btn btn-mini btn-secundario" data-accion="felicitar">Felicitar</button>
      <button class="btn btn-mini btn-secundario" data-accion="devolver">Devolver para corregir</button>
      <button class="btn btn-mini btn-secundario" data-accion="${f.estado === "oculto" ? "mostrar" : "ocultar"}">${f.estado === "oculto" ? "Recuperar" : "Quitar de la novela"}</button>
      <button class="btn btn-mini btn-peligro" data-accion="borrar">Borrar</button>
    </span>`;
  div.after(caja);

  caja.querySelectorAll("[data-accion]").forEach((btn) => {
    btn.addEventListener("click", async (ev) => {
      ev.stopPropagation();
      const accion = btn.dataset.accion;
      if (accion === "aprobar") await cambiarEstadoFragmento(f.id, "publicado");
      else if (accion === "ocultar") await cambiarEstadoFragmento(f.id, "oculto");
      else if (accion === "mostrar") await cambiarEstadoFragmento(f.id, "publicado");
      else if (accion === "borrar") {
        if (await confirmar("¿Borrar del todo esta parte? No se puede deshacer. Si solo quieres que no aparezca, usa «Quitar de la novela».", "Borrar")) {
          await borrarFragmento(f.id);
        }
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
  for (const f of estado.fragmentos) {
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
  if (!estado.fichas.length) {
    cont.innerHTML = '<p class="texto-suave">Todavía no hay fichas.</p>';
    return;
  }
  cont.innerHTML = estado.fichas.map((f) => {
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
      if (await confirmar("¿Borrar esta ficha? El nombre volverá a marcarse como palabra desconocida.", "Borrar")) {
        await borrarFicha(b.dataset.borrar);
      }
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
