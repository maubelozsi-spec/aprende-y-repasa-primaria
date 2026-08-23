// ============================================================
// Novela Colectiva — vista del alumno: leer la novela, escribir su
// tanda de diez líneas y publicarla.
//
// El orden de las comprobaciones antes de publicar no es casual:
//   1. seguridad (nada de palabrotas ni datos reales)
//   2. fichas de los nombres nuevos (contexto obligatorio)
//   3. ortografía (avisa y ofrece la palabra correcta)
//   4. continuidad (que la historia no se vuelva loca)
// Ninguna de las tres últimas impide publicar salvo las fichas:
// la app enseña y avisa, pero quien escribe es el alumno.
// ============================================================

import {
  el, aviso, escapaHtml, param, confirmar, modal,
  contarLineas, contarPalabras, fechaCorta, guardarLocal, cargarLocal, borrarLocal,
  CLAVE_BORRADOR,
} from "./comun.js";
import {
  escucharProyecto, escucharFragmentos, escucharFichas, escucharNotas,
  publicarFragmento, editarFragmento, crearFicha, marcarNotaLeida,
  pedirTurno, soltarTurno, actualizarProyecto,
} from "./proyectos.js";
import { revisarTexto, aplicarSugerencia } from "./corrector.js";
import { anadirPalabrasDelProyecto } from "./diccionario.js";
import { pedirFicha, verFicha, nombresFichados, buscarFicha, TIPOS } from "./fichas.js";
import { revisarContinuidad } from "./coherencia.js";
import { construirResumen, chispas } from "./resumen.js";
import { revisarSeguridad } from "./moderacion.js";

const estado = {
  proyectoId: null,
  proyecto: null,
  fragmentos: [],
  fichas: [],
  notas: [],
  sesion: null,
  editando: null,        // id del fragmento propio que se está corrigiendo
  ultimoConocido: 0,     // para avisar de las partes nuevas mientras escribías
  avisosActuales: [],
};

// ---------- arranque ----------

function arrancar() {
  estado.sesion = window.Auth && window.Auth.loadStudentSession();
  estado.proyectoId = param("p");

  if (!estado.sesion) { location.href = "index.html"; return; }
  if (!estado.proyectoId) { location.href = "index.html"; return; }

  el("quien-soy").textContent = estado.sesion.code;

  escucharProyecto(estado.proyectoId, (p) => {
    if (!p) {
      el("cargando").textContent = "Esta novela ya no existe.";
      return;
    }
    estado.proyecto = p;
    anadirPalabrasDelProyecto([]);
    el("cargando").classList.add("oculto");
    el("todo").classList.remove("oculto");
    el("titulo-cabecera").textContent = p.titulo;
    el("titulo-novela").textContent = p.titulo;
    pintarCabecera();
    pintarEditor();
  });

  escucharFragmentos(estado.proyectoId, (lista) => {
    const habiaAntes = estado.ultimoConocido;
    estado.fragmentos = lista;
    const visibles = fragmentosVisibles();
    if (habiaAntes && visibles.length > habiaAntes && el("editor").value.trim()) {
      const nuevas = visibles.length - habiaAntes;
      aviso("Mientras escribías se han añadido " + nuevas + " parte(s) nueva(s). Léelas antes de enviar la tuya.", "info");
    }
    estado.ultimoConocido = visibles.length;
    pintarNovela();
    pintarResumen();
    pintarCabecera();
  });

  escucharFichas(estado.proyectoId, (lista) => {
    estado.fichas = lista;
    anadirPalabrasDelProyecto(nombresFichados(lista));
    pintarFichas();
    pintarResumen();
  });

  escucharNotas(estado.proyectoId, (lista) => {
    estado.notas = lista.filter((n) => n.destinatarioCode === estado.sesion.code);
    pintarNotas();
  });

  // borrador guardado en el propio Chromebook
  const borrador = cargarLocal(CLAVE_BORRADOR + estado.proyectoId);
  if (borrador && borrador.texto) el("editor").value = borrador.texto;

  el("editor").addEventListener("input", () => {
    actualizarContador();
    guardarLocal(CLAVE_BORRADOR + estado.proyectoId, { texto: el("editor").value });
    programarRevision();
  });
  el("btn-publicar").addEventListener("click", publicar);
  el("btn-revisar").addEventListener("click", () => revisarYPintar(true));
  el("btn-ideas").addEventListener("click", darIdeas);
  el("btn-cancelar-edicion").addEventListener("click", cancelarEdicion);
  actualizarContador();
}

// ---------- pintar la novela ----------

function fragmentosVisibles() {
  return estado.fragmentos.filter((f) =>
    f.estado === "publicado" ||
    (f.autorCode === estado.sesion.code && (f.estado === "pendiente" || f.estado === "cambios")));
}

function pintarNovela() {
  const cont = el("fragmentos");
  const lista = fragmentosVisibles();
  if (!lista.length) {
    cont.innerHTML = '<p class="novela-vacia">Todavía no hay nada escrito.<br>' +
      "Si eres el primero, empieza tú: presenta el sitio y a alguien que viva allí.</p>";
    return;
  }
  cont.innerHTML = lista.map((f) => {
    const clases = ["fragmento"];
    if (f.autorCode === estado.sesion.code) clases.push("mio");
    if (f.estado === "pendiente") clases.push("pendiente");
    if (f.estado === "cambios") clases.push("necesita-cambios");
    return `<div class="${clases.join(" ")}" data-id="${f.id}">${escapaHtml(f.texto)}</div>`;
  }).join("");

  cont.querySelectorAll(".fragmento").forEach((div) => {
    div.addEventListener("click", () => abrirDetalle(div, div.dataset.id));
  });
}

function abrirDetalle(div, id) {
  const abierto = div.nextElementSibling;
  if (abierto && abierto.classList.contains("detalle-fragmento")) {
    abierto.remove();
    div.classList.remove("abierto");
    return;
  }
  document.querySelectorAll(".detalle-fragmento").forEach((d) => d.remove());
  document.querySelectorAll(".fragmento").forEach((d) => d.classList.remove("abierto"));

  const f = estado.fragmentos.find((x) => x.id === id);
  if (!f) return;
  div.classList.add("abierto");

  const mio = f.autorCode === estado.sesion.code;
  const autor = estado.proyecto.autoriaVisible
    ? `Escrita por <span class="autor">${escapaHtml(f.autorCode)}</span>`
    : (mio ? "Esta parte la escribiste <strong>tú</strong>" : "Escrita por alguien de la clase");

  const caja = document.createElement("div");
  caja.className = "detalle-fragmento";
  caja.innerHTML =
    `<span>Parte ${f.orden}</span><span>${autor}</span>` +
    `<span>${escapaHtml(fechaCorta(f.creadoEn))}</span>` +
    `<span>${f.palabras || 0} palabras</span>` +
    (f.estado === "pendiente" ? '<span class="etiqueta ambar">Esperando el visto bueno</span>' : "") +
    (f.estado === "cambios" ? '<span class="etiqueta roja">Tu profe te pide que la corrijas</span>' : "") +
    (mio ? '<button class="btn btn-mini btn-secundario" data-editar="1">Corregir mi parte</button>' : "");
  div.after(caja);

  const btn = caja.querySelector("[data-editar]");
  if (btn) btn.addEventListener("click", (ev) => { ev.stopPropagation(); empezarEdicion(f); });
}

// ---------- cabecera y estado del proyecto ----------

function pintarCabecera() {
  const p = estado.proyecto;
  if (!p) return;
  const visibles = fragmentosVisibles();
  el("datos-novela").textContent =
    visibles.length + " partes · " + (p.numPalabras || 0) + " palabras" +
    (p.semilla && p.semilla.genero ? " · " + p.semilla.genero : "");

  const cont = el("avisos-cabecera");
  const trozos = [];
  if (p.estado === "cerrado") {
    trozos.push('<div class="aviso-caja exito"><strong>Esta novela está terminada.</strong> ' +
      "Ya no se puede escribir en ella, pero puedes leerla entera.</div>");
  } else if (p.estado === "pausado" || p.escrituraAbierta === false) {
    trozos.push('<div class="aviso-caja alerta"><strong>La escritura está cerrada ahora mismo.</strong> ' +
      "Tu profe la abrirá cuando toque.</div>");
  }
  if (p.modoTurno === "cola" && p.estado === "abierto") {
    const mio = p.turnoDe === estado.sesion.code;
    if (mio) {
      trozos.push('<div class="aviso-caja exito"><strong>Es tu turno.</strong> ' +
        'Escribe tu parte y envíala. <button class="btn btn-mini btn-secundario" id="btn-soltar">Dejar el turno</button></div>');
    } else if (p.turnoDe) {
      trozos.push('<div class="aviso-caja alerta">Ahora mismo está escribiendo otra persona. ' +
        "Puedes ir preparando tu texto: se enviará cuando te toque.</div>");
    } else {
      trozos.push('<div class="aviso-caja">Esta novela va por turnos. ' +
        '<button class="btn btn-mini btn-principal" id="btn-turno">Pedir el turno</button></div>');
    }
  }
  if (p.cerradorAutorizado === estado.sesion.code && p.estado === "abierto") {
    trozos.push('<div class="aviso-caja"><strong>Tu profe te ha dado permiso para dar por terminada esta novela.</strong> ' +
      "Hazlo solo cuando la clase esté de acuerdo en que ya tiene final. " +
      '<button class="btn btn-mini btn-exito" id="btn-terminar">Dar por terminada</button></div>');
  }

  const sinLeer = estado.notas.filter((n) => !n.leido).length;
  if (sinLeer) {
    trozos.push('<div class="aviso-caja alerta">Tienes ' + sinLeer +
      " mensaje(s) de tu profe sin leer, ahí a la derecha. 👉</div>");
  }
  cont.innerHTML = trozos.join("");

  const btnTurno = el("btn-turno");
  if (btnTurno) btnTurno.addEventListener("click", async () => {
    const conseguido = await pedirTurno(estado.proyectoId, estado.sesion.code);
    aviso(conseguido ? "¡Turno tuyo! Escribe tranquilo." : "Se te han adelantado. Espera un poco.", conseguido ? "exito" : "info");
  });
  const btnSoltar = el("btn-soltar");
  if (btnSoltar) btnSoltar.addEventListener("click", () => soltarTurno(estado.proyectoId));

  const btnTerminar = el("btn-terminar");
  if (btnTerminar) btnTerminar.addEventListener("click", async () => {
    const seguro = await confirmar(
      "¿Seguro que la novela ya tiene final? Después nadie podrá escribir más (tu profe siempre puede volver a abrirla).",
      "Sí, ya está terminada");
    if (!seguro) return;
    await actualizarProyecto(estado.proyectoId, { estado: "cerrado", escrituraAbierta: false, cerradaPor: estado.sesion.code });
    aviso("¡Novela terminada! Ahora tu profe puede descargarla en PDF. 🎉", "exito");
  });
}

function pintarEditor() {
  const p = estado.proyecto;
  const puede = p.estado === "abierto" && p.escrituraAbierta !== false;
  el("editor").disabled = !puede;
  el("btn-publicar").disabled = !puede;
  el("editor").placeholder = puede
    ? "Continúa la historia por donde la dejó el último. Puedes escribir hasta " + (p.maxLineas || 10) + " líneas."
    : "Ahora mismo no se puede escribir en esta novela.";
}

// ---------- contador de líneas ----------

function actualizarContador() {
  const max = (estado.proyecto && estado.proyecto.maxLineas) || 10;
  const texto = el("editor").value;
  const lineas = contarLineas(texto);
  const palabras = contarPalabras(texto);
  el("texto-contador").textContent = lineas + " de " + max + " líneas";
  el("contador-palabras").textContent = palabras + " palabras";

  const barra = el("barra");
  const relleno = barra.firstElementChild;
  relleno.style.width = Math.min(100, (lineas / max) * 100) + "%";
  barra.classList.toggle("casi", lineas >= max - 2 && lineas <= max);
  barra.classList.toggle("pasado", lineas > max);
  el("editor").classList.toggle("pasado", lineas > max);
  if (lineas > max) {
    el("texto-contador").textContent = "¡Te has pasado! " + lineas + " líneas de " + max;
  }
}

// ---------- corrector en vivo ----------

let temporizador = null;
function programarRevision() {
  clearTimeout(temporizador);
  temporizador = setTimeout(() => revisarYPintar(false), 900);
}

function revisarYPintar(manual) {
  const texto = el("editor").value;
  if (!texto.trim()) { el("avisos").innerHTML = ""; return []; }
  const { avisos } = revisarTexto(texto, { nombresFichados: nombresFichados(estado.fichas) });
  estado.avisosActuales = avisos;
  pintarAvisos(avisos, manual);
  return avisos;
}

function pintarAvisos(avisos, manual) {
  const cont = el("avisos");
  if (!avisos.length) {
    cont.innerHTML = manual
      ? '<li class="bien">¡Muy bien! No he encontrado ninguna falta.</li>'
      : "";
    return;
  }
  cont.innerHTML = avisos.map((a, i) => {
    const clase = a.tipo === "falta" ? "falta" : "duda";
    const sugerencias = (a.sugerencias || []).map((s) =>
      `<button class="btn-sugerencia" data-aviso="${i}" data-sug="${escapaHtml(s)}">${escapaHtml(s)}</button>`).join("");
    const invento = a.posibleInvento
      ? `<button class="btn-sugerencia" data-invento="${i}">Es una palabra que me he inventado</button>` : "";
    return `<li class="${clase}">
      <span class="palabra-mal">${escapaHtml(a.texto.trim() || "espacio")}</span>
      <span class="explica">${escapaHtml(a.regla)}</span>
      <span class="sugerencias">${sugerencias}${invento}</span>
    </li>`;
  }).join("");

  cont.querySelectorAll("[data-sug]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const a = estado.avisosActuales[Number(btn.dataset.aviso)];
      el("editor").value = aplicarSugerencia(el("editor").value, a, btn.dataset.sug);
      guardarLocal(CLAVE_BORRADOR + estado.proyectoId, { texto: el("editor").value });
      actualizarContador();
      revisarYPintar(false);
    });
  });
  cont.querySelectorAll("[data-invento]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const a = estado.avisosActuales[Number(btn.dataset.invento)];
      await pedirYGuardarFicha(a.texto, "invento");
      revisarYPintar(false);
    });
  });
}

// ---------- fichas ----------

async function pedirYGuardarFicha(nombre, tipoSugerido) {
  const ficha = await pedirFicha(nombre, tipoSugerido);
  if (!ficha) return null;
  await crearFicha(estado.proyecto, Object.assign({ autorCode: estado.sesion.code }, ficha));
  anadirPalabrasDelProyecto([ficha.nombre]);
  aviso("Ficha de " + ficha.nombre + " guardada. ¡Gracias!", "exito");
  return ficha;
}

function pintarFichas() {
  const cont = el("fichas");
  el("num-fichas").textContent = estado.fichas.length ? estado.fichas.length + " fichas" : "";
  if (!estado.fichas.length) {
    cont.innerHTML = '<p class="pequeno texto-suave">Todavía no hay ningún personaje ni lugar.</p>';
    return;
  }
  cont.innerHTML = estado.fichas.map((f) =>
    `<button class="ficha-chip ${f.tipo}" data-id="${f.id}">${TIPOS[f.tipo] ? TIPOS[f.tipo].icono : ""} ${escapaHtml(f.nombre)}</button>`
  ).join("");
  cont.querySelectorAll("[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = estado.fichas.find((x) => x.id === btn.dataset.id);
      if (f) verFicha(f, { mostrarAutor: false });
    });
  });
}

// ---------- resumen e ideas ----------

function pintarResumen() {
  if (!estado.proyecto) return;
  const r = construirResumen(estado.proyecto, fragmentosVisibles(), estado.fichas);
  const cont = el("resumen");
  const trozos = [];
  trozos.push(`<div class="datos-rapidos">
    <span class="dato"><strong>${r.numFragmentos}</strong>partes</span>
    <span class="dato"><strong>${r.numPalabras}</strong>palabras</span>
    <span class="dato"><strong>${r.numAutores}</strong>autores</span></div>`);
  if (r.manual) trozos.push(`<h3>Lo que dice tu profe</h3><p>${escapaHtml(r.manual)}</p>`);
  if (r.inicio) trozos.push(`<h3>Cómo empezó</h3><p>${escapaHtml(r.inicio)}</p>`);
  if (r.ultimas.length) trozos.push(`<h3>Lo último que ha pasado</h3><p>${escapaHtml(r.ultimas.join(" "))}</p>`);
  if (r.hilos.length) trozos.push(`<h3>Sin resolver</h3><p>${escapaHtml(r.hilos.slice(0, 2).join(" "))}</p>`);
  if (r.desaparecidos.length) trozos.push(`<h3>Hace rato que no salen</h3><p>${escapaHtml(r.desaparecidos.join(", "))}</p>`);
  if (!r.numFragmentos) trozos.push("<p>La novela está en blanco. El primero que escriba manda.</p>");
  cont.innerHTML = trozos.join("");
}

function darIdeas() {
  const r = construirResumen(estado.proyecto, fragmentosVisibles(), estado.fichas);
  const ideas = chispas(r);
  modal((caja, cerrar) => {
    caja.innerHTML = `<h2>💡 Tres ideas para seguir</h2>
      <p class="texto-suave pequeno">No tienes que usarlas: son solo para arrancar.</p>
      <ul class="lista-avisos">${ideas.map((i) => `<li class="coherencia">${escapaHtml(i)}</li>`).join("")}</ul>
      <div class="modal-botones"><button class="btn btn-principal" id="cerrar-ideas">Ya sé por dónde tirar</button></div>`;
    caja.querySelector("#cerrar-ideas").addEventListener("click", () => cerrar(null));
  });
}

// ---------- mensajes del docente ----------

function pintarNotas() {
  const cont = el("notas");
  if (!estado.notas.length) {
    cont.innerHTML = '<p class="pequeno texto-suave">No tienes ningún mensaje. ¡Todo en orden!</p>';
    return;
  }
  cont.innerHTML = estado.notas.map((n) => {
    const f = estado.fragmentos.find((x) => x.id === n.fragmentoId);
    return `<div class="nota ${n.tipo}">
      <div class="cabecera-nota">${n.tipo === "correccion" ? "✏️ Corrige esto" : n.tipo === "felicitacion" ? "🌟 ¡Muy bien!" : "💬 Una indicación"}</div>
      ${f ? `<div class="cita">${escapaHtml(f.texto.slice(0, 110))}…</div>` : ""}
      <div>${escapaHtml(n.texto)}</div>
      <div class="botonera" style="margin-top:6px">
        ${f && f.autorCode === estado.sesion.code ? `<button class="btn btn-mini btn-secundario" data-corregir="${f.id}">Ir a corregirlo</button>` : ""}
        ${n.leido ? '<span class="pequeno texto-suave">Leído</span>' : `<button class="btn btn-mini btn-principal" data-leido="${n.id}">Ya lo he leído</button>`}
      </div>
    </div>`;
  }).join("");

  cont.querySelectorAll("[data-leido]").forEach((b) =>
    b.addEventListener("click", () => marcarNotaLeida(b.dataset.leido)));
  cont.querySelectorAll("[data-corregir]").forEach((b) =>
    b.addEventListener("click", () => {
      const f = estado.fragmentos.find((x) => x.id === b.dataset.corregir);
      if (f) empezarEdicion(f);
    }));
}

// ---------- editar lo propio ----------

function empezarEdicion(f) {
  estado.editando = f.id;
  el("editor").value = f.texto;
  el("titulo-editor").textContent = "Corrige tu parte " + f.orden;
  el("btn-publicar").textContent = "Guardar los cambios";
  el("btn-cancelar-edicion").classList.remove("oculto");
  el("editor").focus();
  el("caja-editor").scrollIntoView({ behavior: "smooth", block: "center" });
  actualizarContador();
  revisarYPintar(false);
}

function cancelarEdicion() {
  estado.editando = null;
  el("editor").value = "";
  el("titulo-editor").textContent = "Escribe tu parte";
  el("btn-publicar").textContent = "Añadir a la novela";
  el("btn-cancelar-edicion").classList.add("oculto");
  el("avisos").innerHTML = "";
  actualizarContador();
}

// ---------- publicar ----------

async function publicar() {
  const texto = el("editor").value.trim();
  const max = estado.proyecto.maxLineas || 10;

  if (!texto) { aviso("Primero escribe algo. 😉", "error"); return; }
  if (contarLineas(texto) > max) {
    aviso("Te has pasado de " + max + " líneas. Recorta un poco y vuelve a intentarlo.", "error");
    return;
  }
  if (estado.proyecto.modoTurno === "cola" && estado.proyecto.turnoDe !== estado.sesion.code && !estado.editando) {
    aviso("Esta novela va por turnos y ahora no es el tuyo. Pide el turno arriba.", "error");
    return;
  }

  // 1. seguridad
  const problemas = revisarSeguridad(texto);
  const graves = problemas.filter((p) => p.grave);
  if (graves.length) {
    await modal((caja, cerrar) => {
      caja.innerHTML = `<h2>Espera un momento</h2>
        ${graves.map((p) => `<div class="aviso-caja error">${escapaHtml(p.mensaje)}</div>`).join("")}
        <div class="modal-botones"><button class="btn btn-principal" id="ok">Lo cambio</button></div>`;
      caja.querySelector("#ok").addEventListener("click", () => cerrar(null));
    });
    return;
  }

  // 2. fichas de los nombres nuevos
  const { avisos, propios } = revisarTexto(texto, { nombresFichados: nombresFichados(estado.fichas) });
  const nuevos = [];
  const vistos = new Set();
  for (const p of propios) {
    const clave = p.palabra.toLowerCase();
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    if (!buscarFicha(estado.fichas, p.palabra)) nuevos.push(p.palabra);
  }
  for (const nombre of nuevos) {
    const hecha = await pedirYGuardarFicha(nombre, "personaje");
    if (!hecha) {
      aviso("Para publicar hay que explicar quién o qué es " + nombre + ". Es solo un momento.", "error");
      return;
    }
  }

  // 3 y 4. ortografía y continuidad, en una sola ventana
  const continuidad = revisarContinuidad(texto, {
    fichas: estado.fichas,
    fragmentos: fragmentosVisibles(),
    propiosNuevos: nuevos,
  });
  const faltas = avisos.filter((a) => a.tipo === "falta");
  const dudas = avisos.filter((a) => a.tipo === "duda");
  const leves = problemas.filter((p) => !p.grave);

  if (faltas.length || continuidad.length || leves.length || dudas.length) {
    const seguir = await ventanaAntesDePublicar(faltas, dudas, continuidad, leves);
    if (!seguir) return;
  }

  // aviso suave: no acaparar
  const visibles = fragmentosVisibles();
  const ultimas = visibles.slice(-2);
  if (!estado.editando && ultimas.length === 2 && ultimas.every((f) => f.autorCode === estado.sesion.code)) {
    const sigo = await confirmar(
      "Las dos últimas partes también las has escrito tú. ¿Seguro que no le toca a otro compañero?",
      "Publicar igualmente");
    if (!sigo) return;
  }

  try {
    if (estado.editando) {
      await editarFragmento(estado.editando, texto);
      aviso("Cambios guardados. ¡Así se hace!", "exito");
      cancelarEdicion();
    } else {
      await publicarFragmento(estado.proyecto, {
        texto: texto,
        autorCode: estado.sesion.code,
        entidades: Array.from(vistos),
        avisos: faltas.length,
      });
      aviso(estado.proyecto.moderacionPrevia
        ? "Enviado. Tu profe lo verá antes de que aparezca en la novela."
        : "¡Ya está en la novela! 🎉", "exito");
      el("editor").value = "";
      borrarLocal(CLAVE_BORRADOR + estado.proyectoId);
      el("avisos").innerHTML = "";
      actualizarContador();
    }
  } catch (e) {
    aviso(e.message || "No he podido guardar. Comprueba el wifi.", "error");
  }
}

function ventanaAntesDePublicar(faltas, dudas, continuidad, leves) {
  return modal((caja, cerrar) => {
    const bloques = [];
    if (faltas.length) {
      bloques.push(`<h3>Faltas de ortografía (${faltas.length})</h3>
        <ul class="lista-avisos">${faltas.slice(0, 8).map((a) =>
          `<li class="falta"><span class="palabra-mal">${escapaHtml(a.texto.trim() || "espacio")}</span>
           <span class="explica">${escapaHtml(a.regla)}</span></li>`).join("")}</ul>`);
    }
    if (dudas.length) {
      bloques.push(`<h3>Palabras que no conozco (${dudas.length})</h3>
        <ul class="lista-avisos">${dudas.slice(0, 5).map((a) =>
          `<li class="duda"><span class="palabra-mal">${escapaHtml(a.texto)}</span>
           <span class="explica">Si es de tu invención, no pasa nada. Si no, míralo bien.</span></li>`).join("")}</ul>`);
    }
    if (continuidad.length) {
      bloques.push(`<h3>Para que la historia encaje</h3>
        <ul class="lista-avisos">${continuidad.map((c) =>
          `<li class="coherencia"><strong>${escapaHtml(c.mensaje)}</strong>
           <span class="explica">${escapaHtml(c.consejo)}</span></li>`).join("")}</ul>`);
    }
    if (leves.length) {
      bloques.push(`<ul class="lista-avisos">${leves.map((p) =>
        `<li class="duda"><span class="explica">${escapaHtml(p.mensaje)}</span></li>`).join("")}</ul>`);
    }

    caja.innerHTML = `<h2>Antes de añadirlo a la novela…</h2>
      <p class="texto-suave pequeno">Nada de esto te impide publicar. Pero si lo arreglas ahora,
      la novela quedará mucho mejor y tu profe lo verá.</p>
      ${bloques.join("")}
      <div class="modal-botones">
        <button class="btn btn-secundario" id="publicar-igual">Publicar así</button>
        <button class="btn btn-principal" id="volver">Voy a corregirlo</button>
      </div>`;
    caja.querySelector("#volver").addEventListener("click", () => cerrar(false));
    caja.querySelector("#publicar-igual").addEventListener("click", () => cerrar(true));
  }, { cerrarFuera: false });
}

// ---------- puesta en marcha ----------

document.addEventListener("ar:auth-ready", arrancar);
if (window.Auth) arrancar();
