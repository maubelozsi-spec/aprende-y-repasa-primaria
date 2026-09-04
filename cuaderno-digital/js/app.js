// ============================================================
// Cuaderno Digital — lógica principal: cuadernos, secciones,
// páginas, y la página abierta (lienzo de tinta + elementos).
//
// Modelo de datos en Firestore (todo con teacherId == uid del
// docente, ver firestore.rules):
//   cdCuadernos/{id}                { teacherId, nombre, color, orden }
//   cdSecciones/{id}                { teacherId, cuadernoId, nombre, orden }
//   cdPaginas/{id}                  { teacherId, cuadernoId, seccionId, titulo, orden }
//     cdPaginas/{id}/elementos/{id} { teacherId, tipo, x, y, w, h, z, html|storagePath }
//     cdPaginas/{id}/trazos/{id}    { teacherId, herramienta, color, grosor, puntos, z }
//
// Cada trazo y cada elemento es su propio documento: eso es lo que
// permite que, si el docente escribe sin conexión en dos
// dispositivos a la vez, al reconectar no se pierda nada (ver la
// nota larga en firestore.rules).
// ============================================================

import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { db, auth } from "./firebase-init.js";
import { subirArchivo, obtenerUrl, borrarArchivo } from "./storage.js";
import { LienzoTinta } from "./ink-canvas.js";
import { GestorElementos } from "./elementos.js";
import { importarPaginasPDF } from "./pdf-import.js";

const ANCHO_PAGINA = 820;
const ALTO_MINIMO = 1100;
const COLORES_CUADERNO = ["#7c3aed", "#0f766e", "#b45309", "#be185d", "#0369a1", "#15803d"];
const COLORES_TINTA = ["#1f2937", "#dc2626", "#2563eb", "#15803d", "#b45309", "#ffffff"];

const el = (id) => document.getElementById(id);

let teacherId = null;
let cuadernos = [];
let secciones = [];
let paginas = [];
let cuadernoActualId = null;
let seccionActualId = null;
let paginaActualId = null;

let desuscribirSecciones = null;
let desuscribirPaginas = null;
let desuscribirElementos = null;
let desuscribirTrazos = null;

const elementosPorId = new Map();
const cacheUrlsImagen = new Map();
const pilaDeshacer = []; // trazos propios creados en esta sesión (para "Deshacer")
const pilaRehacer = [];

let lienzo = null;
let gestorElementos = null;
let escrituraPendientes = 0;

// ---------------- Arranque y sesión ----------------

function esperarAuthListo() {
  return new Promise((resolve) => {
    document.addEventListener("ar:auth-ready", resolve, { once: true });
  });
}

async function iniciar() {
  await esperarAuthListo();
  const sesion = window.Auth.loadTeacherSession();
  if (!sesion) {
    window.location.href = "../docente/login.html";
    return;
  }
  teacherId = sesion.uid;
  el("saludo-docente").textContent = sesion.displayName || sesion.email;

  configurarLienzoYElementos();
  configurarBarraHerramientas();
  configurarInsercion();
  configurarEstadoConexion();

  el("btn-cerrar-sesion").addEventListener("click", async () => {
    await window.Auth.logoutTeacher();
    window.location.href = "../docente/login.html";
  });

  suscribirCuadernos();
}

function marcarEscrituraInicio() {
  escrituraPendientes++;
  actualizarIndicadorGuardado();
}
function marcarEscrituraFin() {
  escrituraPendientes = Math.max(0, escrituraPendientes - 1);
  actualizarIndicadorGuardado();
}
function actualizarIndicadorGuardado() {
  const indicador = el("estado-guardado");
  if (!navigator.onLine) {
    indicador.textContent = "Sin conexión — se guarda en el dispositivo y sincroniza al volver";
    indicador.className = "cd-estado-guardado cd-estado-offline";
  } else if (escrituraPendientes > 0) {
    indicador.textContent = "Guardando…";
    indicador.className = "cd-estado-guardado cd-estado-guardando";
  } else {
    indicador.textContent = "Guardado";
    indicador.className = "cd-estado-guardado cd-estado-ok";
  }
}

function configurarEstadoConexion() {
  window.addEventListener("online", actualizarIndicadorGuardado);
  window.addEventListener("offline", actualizarIndicadorGuardado);
  actualizarIndicadorGuardado();
}

async function escribir(promesa) {
  marcarEscrituraInicio();
  try {
    return await promesa;
  } finally {
    marcarEscrituraFin();
  }
}

// ---------------- Cuadernos ----------------

function suscribirCuadernos() {
  const q = query(collection(db, "cdCuadernos"), where("teacherId", "==", teacherId));
  onSnapshot(q, (snap) => {
    cuadernos = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.orden || 0) - (b.orden || 0));
    renderizarCuadernos();
    if (!cuadernoActualId && cuadernos.length > 0) seleccionarCuaderno(cuadernos[0].id);
    if (cuadernoActualId && !cuadernos.some((c) => c.id === cuadernoActualId)) {
      seleccionarCuaderno(cuadernos[0] ? cuadernos[0].id : null);
    }
  });
}

function renderizarCuadernos() {
  const lista = el("lista-cuadernos");
  lista.innerHTML = "";
  for (const cuaderno of cuadernos) {
    const item = document.createElement("li");
    item.className = "cd-item-cuaderno" + (cuaderno.id === cuadernoActualId ? " activo" : "");
    item.style.setProperty("--color-cuaderno", cuaderno.color || "#7c3aed");
    const nombre = document.createElement("span");
    nombre.className = "cd-item-nombre";
    nombre.textContent = cuaderno.nombre;
    nombre.addEventListener("click", () => seleccionarCuaderno(cuaderno.id));
    item.appendChild(nombre);
    item.appendChild(crearBotonesFila(
      () => renombrarCuaderno(cuaderno),
      () => eliminarCuaderno(cuaderno)
    ));
    lista.appendChild(item);
  }
  if (cuadernos.length === 0) {
    const vacio = document.createElement("p");
    vacio.className = "cd-vacio";
    vacio.textContent = "Todavía no tienes ningún cuaderno. Crea el primero abajo.";
    lista.appendChild(vacio);
  }
}

function crearBotonesFila(onRenombrar, onEliminar) {
  const cont = document.createElement("span");
  cont.className = "cd-fila-botones";
  const btnEditar = document.createElement("button");
  btnEditar.type = "button";
  btnEditar.title = "Renombrar";
  btnEditar.textContent = "✎";
  btnEditar.addEventListener("click", (e) => { e.stopPropagation(); onRenombrar(); });
  const btnBorrar = document.createElement("button");
  btnBorrar.type = "button";
  btnBorrar.title = "Eliminar";
  btnBorrar.textContent = "🗑";
  btnBorrar.addEventListener("click", (e) => { e.stopPropagation(); onEliminar(); });
  cont.appendChild(btnEditar);
  cont.appendChild(btnBorrar);
  return cont;
}

async function crearCuaderno() {
  const nombre = prompt("Nombre del cuaderno:");
  if (!nombre || !nombre.trim()) return;
  const color = COLORES_CUADERNO[cuadernos.length % COLORES_CUADERNO.length];
  const orden = cuadernos.length;
  const ref = await escribir(addDoc(collection(db, "cdCuadernos"), {
    teacherId, nombre: nombre.trim(), color, orden,
    creadoEn: serverTimestamp(), actualizadoEn: serverTimestamp(),
  }));
  seleccionarCuaderno(ref.id);
}

async function renombrarCuaderno(cuaderno) {
  const nombre = prompt("Nuevo nombre:", cuaderno.nombre);
  if (!nombre || !nombre.trim()) return;
  await escribir(updateDoc(doc(db, "cdCuadernos", cuaderno.id), { nombre: nombre.trim(), actualizadoEn: serverTimestamp() }));
}

async function eliminarCuaderno(cuaderno) {
  if (!confirm(`¿Eliminar el cuaderno "${cuaderno.nombre}" con TODAS sus secciones y páginas? Esto no se puede deshacer.`)) return;
  await escribir(eliminarCuadernoCascada(cuaderno.id));
}

function seleccionarCuaderno(id) {
  cuadernoActualId = id;
  seccionActualId = null;
  paginaActualId = null;
  renderizarCuadernos();
  if (desuscribirSecciones) desuscribirSecciones();
  if (!id) { secciones = []; renderizarSecciones(); cerrarPagina(); return; }
  suscribirSecciones(id);
}

// ---------------- Secciones ----------------

function suscribirSecciones(cuadernoId) {
  // Firestore exige que las consultas "list" incluyan un where que
  // coincida exactamente con el campo que usan las reglas de
  // seguridad (teacherId): sin él, rechaza la consulta entera aunque
  // los documentos sean del propio docente.
  const q = query(
    collection(db, "cdSecciones"),
    where("teacherId", "==", teacherId),
    where("cuadernoId", "==", cuadernoId)
  );
  desuscribirSecciones = onSnapshot(q, (snap) => {
    secciones = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.orden || 0) - (b.orden || 0));
    renderizarSecciones();
    if (!seccionActualId && secciones.length > 0) seleccionarSeccion(secciones[0].id);
    if (seccionActualId && !secciones.some((s) => s.id === seccionActualId)) {
      seleccionarSeccion(secciones[0] ? secciones[0].id : null);
    }
  });
}

function renderizarSecciones() {
  const lista = el("lista-secciones");
  lista.innerHTML = "";
  for (const seccion of secciones) {
    const tab = document.createElement("div");
    tab.className = "cd-tab-seccion" + (seccion.id === seccionActualId ? " activo" : "");
    const nombre = document.createElement("span");
    nombre.textContent = seccion.nombre;
    nombre.addEventListener("click", () => seleccionarSeccion(seccion.id));
    tab.appendChild(nombre);
    tab.appendChild(crearBotonesFila(
      () => renombrarSeccion(seccion),
      () => eliminarSeccion(seccion)
    ));
    lista.appendChild(tab);
  }
  el("btn-nueva-seccion").disabled = !cuadernoActualId;
  if (secciones.length === 0 && cuadernoActualId) {
    const vacio = document.createElement("p");
    vacio.className = "cd-vacio";
    vacio.textContent = "Sin secciones todavía. Crea una para empezar a añadir páginas.";
    lista.appendChild(vacio);
  }
}

async function crearSeccion() {
  if (!cuadernoActualId) return;
  const nombre = prompt("Nombre de la sección (por ejemplo, un tema o una unidad):");
  if (!nombre || !nombre.trim()) return;
  const ref = await escribir(addDoc(collection(db, "cdSecciones"), {
    teacherId, cuadernoId: cuadernoActualId, nombre: nombre.trim(), orden: secciones.length,
    creadoEn: serverTimestamp(),
  }));
  seleccionarSeccion(ref.id);
}

async function renombrarSeccion(seccion) {
  const nombre = prompt("Nuevo nombre:", seccion.nombre);
  if (!nombre || !nombre.trim()) return;
  await escribir(updateDoc(doc(db, "cdSecciones", seccion.id), { nombre: nombre.trim() }));
}

async function eliminarSeccion(seccion) {
  if (!confirm(`¿Eliminar la sección "${seccion.nombre}" con todas sus páginas?`)) return;
  await escribir(eliminarSeccionCascada(seccion.id));
}

function seleccionarSeccion(id) {
  seccionActualId = id;
  paginaActualId = null;
  renderizarSecciones();
  if (desuscribirPaginas) desuscribirPaginas();
  if (!id) { paginas = []; renderizarPaginas(); cerrarPagina(); return; }
  suscribirPaginas(id);
}

// ---------------- Páginas ----------------

function suscribirPaginas(seccionId) {
  const q = query(
    collection(db, "cdPaginas"),
    where("teacherId", "==", teacherId),
    where("seccionId", "==", seccionId)
  );
  desuscribirPaginas = onSnapshot(q, (snap) => {
    paginas = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.orden || 0) - (b.orden || 0));
    renderizarPaginas();
    if (!paginaActualId && paginas.length > 0) abrirPagina(paginas[0].id);
    if (paginaActualId && !paginas.some((p) => p.id === paginaActualId)) {
      if (paginas.length > 0) abrirPagina(paginas[0].id); else cerrarPagina();
    }
  });
}

function renderizarPaginas() {
  const lista = el("lista-paginas");
  lista.innerHTML = "";
  for (const pagina of paginas) {
    const item = document.createElement("li");
    item.className = "cd-item-pagina" + (pagina.id === paginaActualId ? " activo" : "");
    const nombre = document.createElement("span");
    nombre.className = "cd-item-nombre";
    nombre.textContent = pagina.titulo || "Página sin título";
    nombre.addEventListener("click", () => abrirPagina(pagina.id));
    item.appendChild(nombre);
    item.appendChild(crearBotonesFila(
      () => renombrarPagina(pagina),
      () => eliminarPagina(pagina)
    ));
    lista.appendChild(item);
  }
  el("btn-nueva-pagina").disabled = !seccionActualId;
  if (paginas.length === 0 && seccionActualId) {
    const vacio = document.createElement("p");
    vacio.className = "cd-vacio";
    vacio.textContent = "Sección vacía. Crea la primera página.";
    lista.appendChild(vacio);
  }
}

async function crearPagina() {
  if (!seccionActualId || !cuadernoActualId) return;
  const ref = await escribir(addDoc(collection(db, "cdPaginas"), {
    teacherId, cuadernoId: cuadernoActualId, seccionId: seccionActualId,
    titulo: "Página sin título", orden: paginas.length, actualizadoEn: serverTimestamp(),
  }));
  abrirPagina(ref.id);
}

async function renombrarPagina(pagina) {
  const titulo = prompt("Título de la página:", pagina.titulo);
  if (!titulo || !titulo.trim()) return;
  await escribir(updateDoc(doc(db, "cdPaginas", pagina.id), { titulo: titulo.trim(), actualizadoEn: serverTimestamp() }));
  if (pagina.id === paginaActualId) el("titulo-pagina").value = titulo.trim();
}

async function eliminarPagina(pagina) {
  if (!confirm(`¿Eliminar la página "${pagina.titulo || "sin título"}"?`)) return;
  await escribir(eliminarPaginaCascada(pagina.id));
}

// ---------------- Cascada de borrado ----------------

async function eliminarCuadernoCascada(cuadernoId) {
  const seccionesSnap = await getDocs(query(
    collection(db, "cdSecciones"),
    where("teacherId", "==", teacherId),
    where("cuadernoId", "==", cuadernoId)
  ));
  for (const s of seccionesSnap.docs) await eliminarSeccionCascada(s.id);
  await deleteDoc(doc(db, "cdCuadernos", cuadernoId));
}

async function eliminarSeccionCascada(seccionId) {
  const paginasSnap = await getDocs(query(
    collection(db, "cdPaginas"),
    where("teacherId", "==", teacherId),
    where("seccionId", "==", seccionId)
  ));
  for (const p of paginasSnap.docs) await eliminarPaginaCascada(p.id);
  await deleteDoc(doc(db, "cdSecciones", seccionId));
}

async function eliminarPaginaCascada(paginaId) {
  const elementosSnap = await getDocs(query(
    collection(db, "cdPaginas", paginaId, "elementos"),
    where("teacherId", "==", teacherId)
  ));
  for (const e of elementosSnap.docs) {
    const data = e.data();
    if (data.tipo === "imagen" && data.storagePath) await borrarArchivo(data.storagePath);
    await deleteDoc(e.ref);
  }
  const trazosSnap = await getDocs(query(
    collection(db, "cdPaginas", paginaId, "trazos"),
    where("teacherId", "==", teacherId)
  ));
  for (const t of trazosSnap.docs) await deleteDoc(t.ref);
  await deleteDoc(doc(db, "cdPaginas", paginaId));
}

// ---------------- Página abierta: lienzo + elementos ----------------

function configurarLienzoYElementos() {
  lienzo = new LienzoTinta(el("canvas-tinta"), {
    onTrazoNuevo: (trazo) => guardarTrazoNuevo(trazo),
    onTrazoBorrado: (trazo) => borrarTrazo(trazo),
  });

  gestorElementos = new GestorElementos(el("elementos-contenedor"), {
    onMover: (id, x, y) => guardarPosicionElemento(id, { x, y }),
    onRedimensionar: (id, w, h) => guardarPosicionElemento(id, { w, h }),
    onTextoEditado: (id, html) => guardarTextoElemento(id, html),
    onTraerAlFrente: (id) => traerElementoAlFrente(id),
    onEliminar: (id) => eliminarElemento(id),
  });
}

function resolverUrlImagen(elemento) {
  if (!elemento.storagePath) return Promise.resolve(null);
  if (cacheUrlsImagen.has(elemento.storagePath)) return cacheUrlsImagen.get(elemento.storagePath);
  const promesa = obtenerUrl(elemento.storagePath).catch(() => null);
  cacheUrlsImagen.set(elemento.storagePath, promesa);
  return promesa;
}

function cerrarPagina() {
  paginaActualId = null;
  if (desuscribirElementos) desuscribirElementos();
  if (desuscribirTrazos) desuscribirTrazos();
  elementosPorId.clear();
  gestorElementos.limpiar();
  lienzo.cargarTrazos([]);
  lienzo.redimensionar(ANCHO_PAGINA, ALTO_MINIMO);
  pilaDeshacer.length = 0;
  pilaRehacer.length = 0;
  el("editor-pagina").classList.add("cd-sin-pagina");
  el("titulo-pagina").value = "";
}

function abrirPagina(id) {
  paginaActualId = id;
  renderizarPaginas();
  el("editor-pagina").classList.remove("cd-sin-pagina");

  const pagina = paginas.find((p) => p.id === id);
  el("titulo-pagina").value = pagina ? pagina.titulo || "" : "Página sin título";

  if (desuscribirElementos) desuscribirElementos();
  if (desuscribirTrazos) desuscribirTrazos();
  elementosPorId.clear();
  gestorElementos.limpiar();
  lienzo.cargarTrazos([]);
  lienzo.redimensionar(ANCHO_PAGINA, ALTO_MINIMO);
  el("lienzo-wrap").style.height = ALTO_MINIMO + "px";
  pilaDeshacer.length = 0;
  pilaRehacer.length = 0;

  desuscribirElementos = onSnapshot(
    query(collection(db, "cdPaginas", id, "elementos"), where("teacherId", "==", teacherId)),
    (snap) => {
      snap.docChanges().forEach((cambio) => {
        const elemento = { id: cambio.doc.id, ...cambio.doc.data() };
        if (cambio.type === "added") {
          if (!elementosPorId.has(elemento.id)) {
            elementosPorId.set(elemento.id, elemento);
            gestorElementos.agregarElementoDom(elemento, resolverUrlImagen);
          } else {
            elementosPorId.set(elemento.id, elemento);
          }
        } else if (cambio.type === "modified") {
          elementosPorId.set(elemento.id, elemento);
          gestorElementos.actualizarPosicionDom(elemento.id, elemento.x, elemento.y, elemento.w, elemento.h, elemento.z);
          if (elemento.tipo === "texto") gestorElementos.actualizarTextoDom(elemento.id, elemento.html);
        } else if (cambio.type === "removed") {
          elementosPorId.delete(elemento.id);
          gestorElementos.quitarElementoDom(elemento.id);
        }
      });
      recalcularAltoPagina();
    }
  );

  desuscribirTrazos = onSnapshot(
    query(collection(db, "cdPaginas", id, "trazos"), where("teacherId", "==", teacherId)),
    (snap) => {
      snap.docChanges().forEach((cambio) => {
        if (cambio.type === "removed") {
          lienzo.quitarTrazoPorId(cambio.doc.id);
          return;
        }
        if (cambio.type !== "added") return;
        // Firestore guarda cada punto como [x, y, p] (más compacto); el
        // lienzo trabaja con objetos {x, y, p}, así que se convierte al
        // cargar cada trazo (propio, ya reconciliado por id y descartado
        // por agregarTrazoRemoto, o de otro dispositivo).
        const datos = cambio.doc.data();
        const trazo = {
          id: cambio.doc.id,
          herramienta: datos.herramienta,
          color: datos.color,
          grosor: datos.grosor,
          z: datos.z,
          puntos: (datos.puntos || []).map(([x, y, p]) => ({ x, y, p })),
        };
        lienzo.agregarTrazoRemoto(trazo);
      });
      recalcularAltoPagina();
    }
  );
}

function recalcularAltoPagina() {
  let maxAbajo = 0;
  for (const elemento of elementosPorId.values()) {
    maxAbajo = Math.max(maxAbajo, (elemento.y || 0) + (elemento.h || 0));
  }
  for (const trazo of lienzo.trazos) {
    for (const punto of trazo.puntos) maxAbajo = Math.max(maxAbajo, punto.y);
  }
  const alto = Math.max(ALTO_MINIMO, maxAbajo + 200);
  lienzo.redimensionar(ANCHO_PAGINA, alto);
  el("lienzo-wrap").style.height = alto + "px";
}

// ---------------- Trazos (tinta) ----------------

function guardarTrazoNuevo(trazo) {
  if (!paginaActualId) return;
  const ref = doc(collection(db, "cdPaginas", paginaActualId, "trazos"));
  trazo.id = ref.id;
  pilaDeshacer.push(trazo);
  pilaRehacer.length = 0;
  escribir(setDoc(ref, {
    teacherId,
    herramienta: trazo.herramienta,
    color: trazo.color,
    grosor: trazo.grosor,
    z: trazo.z,
    puntos: trazo.puntos.map((p) => [Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10, Math.round((p.p || 0.5) * 100) / 100]),
    creadoEn: serverTimestamp(),
  }));
  recalcularAltoPagina();
}

function borrarTrazo(trazo) {
  if (!paginaActualId || !trazo.id) return;
  escribir(deleteDoc(doc(db, "cdPaginas", paginaActualId, "trazos", trazo.id)));
}

function deshacer() {
  const trazo = pilaDeshacer.pop();
  if (!trazo) return;
  lienzo.quitarTrazoPorId(trazo.id);
  pilaRehacer.push(trazo);
  escribir(deleteDoc(doc(db, "cdPaginas", paginaActualId, "trazos", trazo.id)));
}

function rehacer() {
  const trazo = pilaRehacer.pop();
  if (!trazo || !paginaActualId) return;
  const ref = doc(collection(db, "cdPaginas", paginaActualId, "trazos"));
  trazo.id = ref.id;
  lienzo.agregarTrazoRemoto(trazo);
  pilaDeshacer.push(trazo);
  escribir(setDoc(ref, {
    teacherId, herramienta: trazo.herramienta, color: trazo.color, grosor: trazo.grosor,
    z: trazo.z,
    puntos: trazo.puntos.map((p) => [p.x, p.y, p.p != null ? p.p : 0.5]),
    creadoEn: serverTimestamp(),
  }));
}

// ---------------- Elementos (texto/imagen) ----------------

let contadorZ = Date.now();
function siguienteZ() { return ++contadorZ; }

async function crearElementoTexto() {
  if (!paginaActualId) return;
  const ref = doc(collection(db, "cdPaginas", paginaActualId, "elementos"));
  const desplazamiento = (elementosPorId.size % 6) * 24;
  const elemento = {
    id: ref.id, tipo: "texto", x: 40 + desplazamiento, y: 40 + desplazamiento,
    w: 280, h: 120, z: siguienteZ(), html: "",
  };
  elementosPorId.set(ref.id, elemento);
  const nodo = gestorElementos.agregarElementoDom(elemento, resolverUrlImagen);
  const cuerpo = nodo.querySelector(".cd-elemento-texto");
  if (cuerpo) cuerpo.focus();
  recalcularAltoPagina();
  const { id, ...datos } = elemento;
  await escribir(setDoc(ref, { ...datos, teacherId, actualizadoEn: serverTimestamp() }));
}

async function insertarImagenes(archivos) {
  if (!paginaActualId || archivos.length === 0) return;
  let y = calcularSiguienteY();
  for (const archivo of archivos) {
    const dimensiones = await dimensionesImagen(archivo);
    const anchoMax = ANCHO_PAGINA - 80;
    let w = Math.min(anchoMax, dimensiones.ancho);
    let h = dimensiones.alto * (w / dimensiones.ancho);
    const ruta = await subirArchivo(archivo, archivo.name);
    const ref = doc(collection(db, "cdPaginas", paginaActualId, "elementos"));
    const elemento = { id: ref.id, tipo: "imagen", x: 40, y, w, h, z: siguienteZ(), storagePath: ruta, nombreArchivo: archivo.name };
    elementosPorId.set(ref.id, elemento);
    gestorElementos.agregarElementoDom(elemento, resolverUrlImagen);
    const { id, ...datos } = elemento;
    await escribir(setDoc(ref, { ...datos, teacherId, actualizadoEn: serverTimestamp() }));
    y += h + 24;
    recalcularAltoPagina();
  }
}

function dimensionesImagen(archivo) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(archivo);
    img.onload = () => {
      resolve({ ancho: img.naturalWidth, alto: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => resolve({ ancho: 400, alto: 300 });
    img.src = url;
  });
}

function calcularSiguienteY() {
  let maxAbajo = 0;
  for (const elemento of elementosPorId.values()) maxAbajo = Math.max(maxAbajo, (elemento.y || 0) + (elemento.h || 0));
  return maxAbajo > 0 ? maxAbajo + 24 : 40;
}

async function insertarPDF(archivo) {
  if (!paginaActualId) return;
  const estadoPdf = el("estado-pdf");
  estadoPdf.textContent = `Leyendo "${archivo.name}"…`;
  estadoPdf.hidden = false;
  try {
    let y = calcularSiguienteY();
    const paginasPdf = await importarPaginasPDF(archivo, (actual, total) => {
      estadoPdf.textContent = `Insertando "${archivo.name}": página ${actual} de ${total}…`;
    });
    for (const paginaPdf of paginasPdf) {
      const anchoMax = ANCHO_PAGINA - 80;
      const w = Math.min(anchoMax, paginaPdf.ancho);
      const h = paginaPdf.alto * (w / paginaPdf.ancho);
      const ruta = await subirArchivo(paginaPdf.blob, `${archivo.name}-p${paginaPdf.numeroPagina}.jpg`);
      const ref = doc(collection(db, "cdPaginas", paginaActualId, "elementos"));
      const elemento = {
        id: ref.id, tipo: "imagen", x: 40, y, w, h, z: siguienteZ(),
        storagePath: ruta, nombreArchivo: `${archivo.name} · página ${paginaPdf.numeroPagina}`,
      };
      elementosPorId.set(ref.id, elemento);
      gestorElementos.agregarElementoDom(elemento, resolverUrlImagen);
      const { id, ...datos } = elemento;
      await escribir(setDoc(ref, { ...datos, teacherId, actualizadoEn: serverTimestamp() }));
      y += h + 24;
      recalcularAltoPagina();
    }
    estadoPdf.textContent = `"${archivo.name}" insertado (${paginasPdf.length} páginas).`;
    setTimeout(() => { estadoPdf.hidden = true; }, 4000);
  } catch (e) {
    estadoPdf.textContent = "No se pudo importar el PDF: " + e.message;
  }
}

function guardarPosicionElemento(id, cambios) {
  const elemento = elementosPorId.get(id);
  if (!elemento) return;
  Object.assign(elemento, cambios);
  escribir(updateDoc(doc(db, "cdPaginas", paginaActualId, "elementos", id), { ...cambios, actualizadoEn: serverTimestamp() }));
  recalcularAltoPagina();
}

function guardarTextoElemento(id, html) {
  const elemento = elementosPorId.get(id);
  if (!elemento) return;
  elemento.html = html;
  escribir(updateDoc(doc(db, "cdPaginas", paginaActualId, "elementos", id), { html, actualizadoEn: serverTimestamp() }));
}

function traerElementoAlFrente(id) {
  const elemento = elementosPorId.get(id);
  if (!elemento) return;
  const z = siguienteZ();
  elemento.z = z;
  gestorElementos.actualizarPosicionDom(id, null, null, null, null, z);
  escribir(updateDoc(doc(db, "cdPaginas", paginaActualId, "elementos", id), { z }));
}

async function eliminarElemento(id) {
  const elemento = elementosPorId.get(id);
  if (!elemento) return;
  elementosPorId.delete(id);
  gestorElementos.quitarElementoDom(id);
  if (elemento.tipo === "imagen" && elemento.storagePath) await borrarArchivo(elemento.storagePath);
  await escribir(deleteDoc(doc(db, "cdPaginas", paginaActualId, "elementos", id)));
  recalcularAltoPagina();
}

// ---------------- Barra de herramientas ----------------

function configurarBarraHerramientas() {
  const botonesHerramienta = document.querySelectorAll("[data-herramienta]");
  botonesHerramienta.forEach((btn) => {
    btn.addEventListener("click", () => {
      botonesHerramienta.forEach((b) => b.classList.remove("activo"));
      btn.classList.add("activo");
      const herramienta = btn.dataset.herramienta;
      lienzo.fijarHerramienta(herramienta);
      el("canvas-tinta").style.touchAction = herramienta === "seleccionar" ? "auto" : "none";
      el("canvas-tinta").style.pointerEvents = "auto";
    });
  });

  const paletaColor = el("paleta-color");
  COLORES_TINTA.forEach((color, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cd-swatch" + (i === 0 ? " activo" : "");
    btn.style.setProperty("--color", color);
    btn.addEventListener("click", () => {
      lienzo.fijarColor(color);
      paletaColor.querySelectorAll(".cd-swatch").forEach((s) => s.classList.remove("activo"));
      btn.classList.add("activo");
    });
    paletaColor.appendChild(btn);
  });

  el("grosor-tinta").addEventListener("input", (e) => {
    lienzo.fijarGrosor(Number(e.target.value));
  });

  el("btn-deshacer").addEventListener("click", deshacer);
  el("btn-rehacer").addEventListener("click", rehacer);

  el("titulo-pagina").addEventListener("change", (e) => {
    if (!paginaActualId) return;
    const titulo = e.target.value.trim() || "Página sin título";
    escribir(updateDoc(doc(db, "cdPaginas", paginaActualId), { titulo, actualizadoEn: serverTimestamp() }));
  });
}

function configurarInsercion() {
  el("btn-nuevo-cuaderno").addEventListener("click", crearCuaderno);
  el("btn-nueva-seccion").addEventListener("click", crearSeccion);
  el("btn-nueva-pagina").addEventListener("click", crearPagina);

  el("btn-insertar-texto").addEventListener("click", crearElementoTexto);

  el("btn-insertar-imagen").addEventListener("click", () => el("input-imagen").click());
  el("input-imagen").addEventListener("change", (e) => {
    const archivos = Array.from(e.target.files || []);
    e.target.value = "";
    insertarImagenes(archivos);
  });

  el("btn-insertar-pdf").addEventListener("click", () => el("input-pdf").click());
  el("input-pdf").addEventListener("change", (e) => {
    const archivo = e.target.files && e.target.files[0];
    e.target.value = "";
    if (archivo) insertarPDF(archivo);
  });
}

iniciar();
