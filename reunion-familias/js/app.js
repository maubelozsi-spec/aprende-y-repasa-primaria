// ============================================================
// Reunión de familias — visor de diapositivas + edición en la nube.
//
// Cómo funciona:
//  - Las familias abren el enlace y ven la presentación (solo
//    lectura, sin iniciar sesión). El contenido llega de Firestore
//    y, si aún no hay nada guardado, se usa el contenido inicial
//    de contenido-inicial.js.
//  - El docente pulsa el lápiz e introduce el código de edición.
//    La PRIMERA VEZ que se usa la app, el código que se escriba
//    queda establecido como código oficial (se guarda en un
//    documento que nadie puede leer). Con el código activado, el
//    dispositivo queda inscrito como editor (colección
//    reunionFamiliasEditores) y puede escribir.
//  - Todo lo editable se guarda solo (autoguardado con retardo).
//
// Datos en Firestore:
//   reunionFamilias/app              → curso, grupo, tutor, centro,
//                                      tema y lista ordenada de
//                                      secciones (id, título, visible)
//   reunionFamiliasSecciones/{id}    → bloques de cada sección
//   reunionFamiliasSecret/main       → código de edición (ilegible)
//   reunionFamiliasEditores/{uid}    → dispositivos inscritos
// ============================================================

import { db, auth } from "../../js/firebase-init.js";
import {
  doc,
  collection,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
  signInAnonymously,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// La restauración de la sesión anónima tras recargar es asíncrona:
// hay que esperarla antes de escribir en Firestore, o el primer
// guardado saldría sin autenticar y sería rechazado.
const sesionRestaurada = new Promise((resolver) => {
  const parar = onAuthStateChanged(auth, (usuario) => {
    parar();
    resolver(usuario);
  });
});

const COL_APP = "reunionFamilias";
const COL_SECCIONES = "reunionFamiliasSecciones";
const COL_SECRETO = "reunionFamiliasSecret";
const COL_EDITORES = "reunionFamiliasEditores";

const TEMAS = [
  { id: "pizarra-negra", nombre: "Pizarra negra", fondo: "#1d1e22", tinta: "#f2f0e9" },
  { id: "pizarra-verde", nombre: "Pizarra verde", fondo: "#2c473a", tinta: "#f5f2e4" },
  { id: "noche", nombre: "Cielo nocturno", fondo: "#121a33", tinta: "#eef1ff" },
  { id: "corcho", nombre: "Corcho", fondo: "#b8875b", tinta: "#3a2a18" },
  { id: "cuaderno", nombre: "Cuaderno", fondo: "#fbf7ec", tinta: "#2c3242" },
];

const clon = (x) => JSON.parse(JSON.stringify(x));

// ---------------- Estado ----------------

const estado = {
  app: clon(window.CONTENIDO_INICIAL.app),
  secciones: clon(window.CONTENIDO_INICIAL.secciones),
  idx: 0,
  editando: false,
  inscrito: localStorage.getItem("rfEditor") === "1",
};

// Lista de diapositivas según el estado actual. En modo edición se
// incluyen también las secciones ocultas (atenuadas) para poder
// editarlas; en modo normal solo se muestran las visibles.
function listaDiapositivas() {
  const secs = estado.app.secciones.filter((s) => estado.editando || s.visible);
  return [{ tipo: "portada" }, { tipo: "indice" }].concat(
    secs.map((s) => ({ tipo: "seccion", id: s.id }))
  );
}

// ---------------- Utilidades DOM ----------------

const $ = (sel) => document.querySelector(sel);

function el(tag, clase, html) {
  const n = document.createElement(tag);
  if (clase) n.className = clase;
  if (html !== undefined) n.innerHTML = html;
  return n;
}

// ---------------- Render ----------------

function render() {
  const cont = $("#diapositivas");
  const listaAntes = listaDiapositivas();
  const claveActual = claveDiapo(listaAntes[estado.idx]);

  cont.innerHTML = "";
  const lista = listaDiapositivas();

  lista.forEach((d, i) => {
    let nodo;
    if (d.tipo === "portada") nodo = renderPortada();
    else if (d.tipo === "indice") nodo = renderIndice(lista);
    else nodo = renderSeccion(d.id);
    nodo.dataset.clave = claveDiapo(d);
    cont.appendChild(nodo);
  });

  // Mantener la diapositiva actual tras un re-render
  const nuevaIdx = lista.findIndex((d) => claveDiapo(d) === claveActual);
  estado.idx = Math.max(0, Math.min(nuevaIdx === -1 ? estado.idx : nuevaIdx, lista.length - 1));
  mostrarDiapo();
}

function claveDiapo(d) {
  return d ? (d.tipo === "seccion" ? "s:" + d.id : d.tipo) : "portada";
}

function mostrarDiapo() {
  const lista = listaDiapositivas();
  estado.idx = Math.max(0, Math.min(estado.idx, lista.length - 1));
  document.querySelectorAll(".diapositiva").forEach((n, i) => {
    n.classList.toggle("activa", i === estado.idx);
  });
  $("#contador").textContent = `${estado.idx + 1} / ${lista.length}`;
  $("#btn-anterior").disabled = estado.idx === 0;
  $("#btn-siguiente").disabled = estado.idx === lista.length - 1;
}

function ir(idx) {
  estado.idx = idx;
  mostrarDiapo();
  const activa = document.querySelector(".diapositiva.activa");
  if (activa) activa.scrollTop = 0;
}

// ---------- Portada ----------

function renderPortada() {
  const d = el("section", "diapositiva portada");
  d.append(
    el("span", "deco deco-1", "1"),
    el("span", "deco deco-2", "2"),
    el("span", "deco deco-3", "3"),
    el("span", "deco deco-4", "4")
  );
  const bienvenida = el("p", "bienvenida", "Bienvenid@s");
  const curso = el("h1", "curso-titulo", "Curso " + estado.app.curso);
  const raya = el("div", "raya");
  const tutor = el("p", "tutor-nombre", estado.app.tutor);
  const grupoCentro = el("p", "grupo-centro", estado.app.grupo + " · " + estado.app.centro);
  d.append(bienvenida, curso, raya, tutor, grupoCentro);

  if (estado.editando) {
    vincularCampoPortada(curso, "curso", "Curso ");
    vincularCampoPortada(tutor, "tutor", "");
    grupoCentro.contentEditable = "true";
    grupoCentro.addEventListener("input", () => {
      const partes = grupoCentro.textContent.split("·");
      estado.app.grupo = (partes[0] || "").trim();
      estado.app.centro = partes.slice(1).join("·").trim();
      programarGuardadoApp();
    });
  }
  return d;
}

function vincularCampoPortada(nodo, campo, prefijo) {
  nodo.contentEditable = "true";
  nodo.addEventListener("input", () => {
    let t = nodo.textContent;
    if (prefijo && t.startsWith(prefijo)) t = t.slice(prefijo.length);
    estado.app[campo] = t.trim();
    programarGuardadoApp();
  });
}

// ---------- Índice ----------

function renderIndice(lista) {
  const d = el("section", "diapositiva");
  d.appendChild(el("h2", "titulo-seccion", "Índice"));
  const rejilla = el("div", "rejilla-indice");

  let num = 0;
  estado.app.secciones.forEach((s) => {
    if (!s.visible && !estado.editando) return;
    if (s.visible) num++;
    const tarjeta = el("button", "tarjeta-indice" + (s.visible ? "" : " oculta"));
    tarjeta.appendChild(el("span", "num", s.visible ? String(num) : "·"));
    tarjeta.appendChild(el("span", "titulo-tarjeta", s.titulo));
    if (!s.visible) tarjeta.appendChild(el("span", "ojo", "🚫"));
    tarjeta.addEventListener("click", () => {
      const i = lista.findIndex((x) => x.tipo === "seccion" && x.id === s.id);
      if (i !== -1) ir(i);
    });
    rejilla.appendChild(tarjeta);
  });

  d.appendChild(rejilla);
  return d;
}

// ---------- Secciones ----------

function renderSeccion(id) {
  const conf = estado.app.secciones.find((s) => s.id === id) || { titulo: id };
  const datos = estado.secciones[id] || { bloques: [] };
  const d = el("section", "diapositiva");

  const titulo = el("h2", "titulo-seccion", conf.titulo);
  d.appendChild(titulo);
  if (estado.editando) {
    titulo.contentEditable = "true";
    titulo.addEventListener("input", () => {
      conf.titulo = titulo.textContent.trim();
      programarGuardadoApp();
    });
  }

  const cuerpo = el("div", "cuerpo-seccion");
  cuerpo.dataset.seccion = id;
  datos.bloques.forEach((b, i) => cuerpo.appendChild(renderBloque(id, b, i)));

  if (estado.editando) {
    const btn = el("button", "btn-anadir-bloque", "＋ Añadir bloque");
    btn.addEventListener("click", () => menuAnadirBloque(id));
    cuerpo.appendChild(btn);
  }

  d.appendChild(cuerpo);
  return d;
}

function renderBloque(secId, b, i) {
  const w = el("div", "bloque bloque-" + b.t);
  w.dataset.seccion = secId;
  w.dataset.indice = i;

  let contenido;
  if (b.t === "cols") {
    contenido = el("div", "cols");
    (b.cols || ["", ""]).forEach((html, ci) => {
      const c = el("div", "col", html);
      c.dataset.col = ci;
      if (estado.editando) c.contentEditable = "true";
      contenido.appendChild(c);
    });
  } else if (b.t === "img") {
    contenido = el("figure", "");
    contenido.style.margin = "0";
    if (b.src) {
      const img = document.createElement("img");
      img.src = b.src;
      img.alt = b.cap || "";
      contenido.appendChild(img);
    } else {
      contenido.appendChild(el("p", "por-confirmar", "[Imagen sin cargar: usa «Cambiar imagen»]"));
    }
    const cap = el("figcaption", "", b.cap || "");
    if (estado.editando) cap.contentEditable = "true";
    contenido.appendChild(cap);
  } else {
    contenido = el("div", "contenido-bloque", b.html || "");
    if (estado.editando) contenido.contentEditable = "true";
  }
  w.appendChild(contenido);

  if (estado.editando) {
    const ctr = el("div", "controles-bloque");
    const bSubir = el("button", "", "↑");
    bSubir.title = "Subir bloque";
    bSubir.addEventListener("click", () => moverBloque(secId, i, -1));
    const bBajar = el("button", "", "↓");
    bBajar.title = "Bajar bloque";
    bBajar.addEventListener("click", () => moverBloque(secId, i, +1));
    ctr.append(bSubir, bBajar);
    if (b.t === "img") {
      const bImg = el("button", "", "🖼");
      bImg.title = "Cambiar imagen";
      bImg.addEventListener("click", () => elegirImagen(secId, i));
      ctr.appendChild(bImg);
    }
    const bBorrar = el("button", "peligro", "✕");
    bBorrar.title = "Eliminar bloque";
    bBorrar.addEventListener("click", async () => {
      if (await confirmar("¿Eliminar este bloque?")) {
        estado.secciones[secId].bloques.splice(i, 1);
        programarGuardadoSeccion(secId, 0);
        render();
      }
    });
    ctr.appendChild(bBorrar);
    w.appendChild(ctr);
  }

  return w;
}

function moverBloque(secId, i, delta) {
  const b = estado.secciones[secId].bloques;
  const j = i + delta;
  if (j < 0 || j >= b.length) return;
  [b[i], b[j]] = [b[j], b[i]];
  programarGuardadoSeccion(secId, 0);
  render();
}

// ---------------- Edición: recogida de cambios ----------------

// Un solo listener para todos los bloques editables: al teclear se
// vuelca el HTML al estado y se programa el autoguardado.
$("#diapositivas").addEventListener("input", (ev) => {
  const bloque = ev.target.closest(".bloque");
  if (!bloque) return;
  const secId = bloque.dataset.seccion;
  const i = Number(bloque.dataset.indice);
  const b = estado.secciones[secId] && estado.secciones[secId].bloques[i];
  if (!b) return;

  if (b.t === "cols") {
    const cols = bloque.querySelectorAll(".col");
    b.cols = [cols[0].innerHTML, cols[1] ? cols[1].innerHTML : ""];
  } else if (b.t === "img") {
    const cap = bloque.querySelector("figcaption");
    b.cap = cap ? cap.textContent : "";
  } else {
    const c = bloque.querySelector(".contenido-bloque");
    b.html = c.innerHTML;
  }
  programarGuardadoSeccion(secId);
});

// ---------------- Autoguardado ----------------

const temporizadores = new Map();
let temporizadorApp = null;

function indicarGuardado(texto, esError) {
  const n = $("#estado-guardado");
  n.hidden = false;
  n.textContent = texto;
  n.classList.toggle("error", !!esError);
  if (!esError && texto === "Guardado ✓") {
    setTimeout(() => { if (n.textContent === "Guardado ✓") n.hidden = true; }, 2500);
  }
}

function programarGuardadoSeccion(secId, retardo = 1200) {
  if (!estado.inscrito) return;
  clearTimeout(temporizadores.get(secId));
  indicarGuardado("Guardando…");
  temporizadores.set(
    secId,
    setTimeout(() => guardarSeccion(secId), retardo)
  );
}

async function guardarSeccion(secId) {
  try {
    await sesionRestaurada;
    await setDoc(doc(db, COL_SECCIONES, secId), clon(estado.secciones[secId]));
    indicarGuardado("Guardado ✓");
  } catch (e) {
    console.error("Error guardando sección", secId, e);
    indicarGuardado("⚠ No se pudo guardar", true);
    if (e.code === "permission-denied") avisarPermisos();
  }
}

function programarGuardadoApp(retardo = 1200) {
  if (!estado.inscrito) return;
  clearTimeout(temporizadorApp);
  indicarGuardado("Guardando…");
  temporizadorApp = setTimeout(guardarApp, retardo);
}

async function guardarApp() {
  try {
    await sesionRestaurada;
    await setDoc(doc(db, COL_APP, "app"), clon(estado.app));
    indicarGuardado("Guardado ✓");
  } catch (e) {
    console.error("Error guardando configuración", e);
    indicarGuardado("⚠ No se pudo guardar", true);
    if (e.code === "permission-denied") avisarPermisos();
  }
}

let avisoPermisosMostrado = false;
async function avisarPermisos() {
  if (avisoPermisosMostrado) return;
  avisoPermisosMostrado = true;
  estado.inscrito = false;
  localStorage.removeItem("rfEditor");
  await aviso(
    "Sesión de edición caducada",
    "Este dispositivo ya no tiene permiso para editar. Vuelve a pulsar el lápiz e introduce el código de edición."
  );
  avisoPermisosMostrado = false;
}

// ---------------- Sincronización con Firestore ----------------

// Pasa a true en cuanto se consigue leer algo de Firestore. Si nunca
// se consigue, es casi seguro que faltan las reglas por publicar en
// la consola de Firebase, y los avisos de la app lo dicen así.
let nubeDisponible = false;

function escucharNube() {
  onSnapshot(
    doc(db, COL_APP, "app"),
    (snap) => {
      nubeDisponible = true;
      if (snap.metadata.hasPendingWrites) return;
      if (snap.exists()) {
        const datos = snap.data();
        if (datos && Array.isArray(datos.secciones)) {
          estado.app = datos;
          aplicarTema();
          render();
        }
      }
    },
    (e) => console.warn("Sin conexión con la nube (app):", e.code)
  );

  onSnapshot(
    collection(db, COL_SECCIONES),
    (qs) => {
      nubeDisponible = true;
      if (qs.metadata.hasPendingWrites) return;
      let hayCambios = false;
      qs.forEach((d) => {
        estado.secciones[d.id] = d.data();
        hayCambios = true;
      });
      if (hayCambios) render();
    },
    (e) => console.warn("Sin conexión con la nube (secciones):", e.code)
  );
}

// ---------------- Código secreto e inscripción ----------------

async function asegurarSesionAnonima() {
  await sesionRestaurada;
  if (!auth.currentUser) await signInAnonymously(auth);
  return auth.currentUser.uid;
}

async function inscribirse(codigo) {
  const uid = await asegurarSesionAnonima();
  const docEditor = doc(db, COL_EDITORES, uid);
  const datos = { code: codigo, since: Date.now() };
  try {
    await setDoc(docEditor, datos);
  } catch (e) {
    // Primera vez: el secreto aún no existe → lo crea este código.
    try {
      await setDoc(doc(db, COL_SECRETO, "main"), { code: codigo });
      await setDoc(docEditor, datos);
    } catch (e2) {
      return false; // código incorrecto
    }
  }
  estado.inscrito = true;
  localStorage.setItem("rfEditor", "1");
  return true;
}

// ---------------- Modo edición ----------------

async function alternarEdicion() {
  if (!estado.editando && !estado.inscrito) {
    const codigo = await pedirCodigo();
    if (!codigo) return;
    indicarGuardado("Comprobando…");
    const ok = await inscribirse(codigo).catch((e) => {
      console.error(e);
      return false;
    });
    $("#estado-guardado").hidden = true;
    if (!ok) {
      if (!nubeDisponible) {
        await aviso(
          "Falta un paso en Firebase",
          "La base de datos todavía no tiene publicadas las reglas de esta aplicación, así que no acepta ningún código. Hay que pegar el archivo firestore.rules en la consola de Firebase (Firestore Database → Reglas → sustituir todo → Publicar) y volver a intentarlo."
        );
      } else {
        await aviso("Código incorrecto", "El código de edición no es válido.");
      }
      return;
    }
  }
  estado.editando = !estado.editando;
  document.body.classList.toggle("editando", estado.editando);
  $("#barra-formato").hidden = !estado.editando;
  $("#btn-salir-edicion").hidden = !estado.editando;
  $("#btn-editar").hidden = estado.editando;
  if (!estado.editando) $("#panel-config").hidden = true;
  render();
}

// Barra de formato: mousedown con preventDefault para no perder la
// selección del texto que se está editando.
$("#barra-formato").addEventListener("mousedown", (ev) => {
  const btn = ev.target.closest("button");
  if (!btn) return;
  ev.preventDefault();
  if (btn.dataset.cmd) {
    document.execCommand(btn.dataset.cmd, false, null);
  } else if (btn.dataset.color) {
    let color = btn.dataset.color;
    if (color.startsWith("var(")) {
      color = getComputedStyle(document.body)
        .getPropertyValue(color.slice(4, -1))
        .trim();
    }
    document.execCommand("foreColor", false, color);
  }
});

// ---------------- Bloques nuevos e imágenes ----------------

const PLANTILLAS_BLOQUE = {
  h: { t: "h", html: "Nuevo título" },
  p: { t: "p", html: "Nuevo párrafo. Haz clic para editarlo." },
  ul: { t: "ul", html: "<ul><li>Primer punto</li><li>Segundo punto</li></ul>" },
  destacado: { t: "destacado", html: "Texto destacado con marco de tiza." },
  cols: { t: "cols", cols: ["Columna izquierda.", "Columna derecha."] },
  tabla: { t: "tabla", html: "<table><thead><tr><th>Columna 1</th><th>Columna 2</th></tr></thead><tbody><tr><td>—</td><td>—</td></tr><tr><td>—</td><td>—</td></tr></tbody></table>" },
  img: { t: "img", src: "", cap: "Pie de foto" },
};

async function menuAnadirBloque(secId) {
  const tipo = await elegirTipoBloque();
  if (!tipo) return;
  const nuevo = clon(PLANTILLAS_BLOQUE[tipo]);
  if (!estado.secciones[secId]) estado.secciones[secId] = { bloques: [] };
  estado.secciones[secId].bloques.push(nuevo);
  const i = estado.secciones[secId].bloques.length - 1;
  render();
  if (tipo === "img") {
    elegirImagen(secId, i);
  } else {
    programarGuardadoSeccion(secId, 0);
  }
}

function elegirImagenFondo() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", () => {
    const f = input.files && input.files[0];
    if (!f) return;
    const lector = new FileReader();
    lector.onload = () => comprimirImagen(
      lector.result,
      (dataUrl) => {
        if (!dataUrl) {
          aviso("Imagen demasiado grande", "No se pudo reducir lo suficiente. Prueba con otra imagen o recórtala antes.");
          return;
        }
        estado.app.fondoImagen = dataUrl;
        if (typeof estado.app.fondoVelo !== "number") estado.app.fondoVelo = 0.45;
        aplicarTema();
        programarGuardadoApp(0);
        renderConfig();
      },
      { max: 1600, blando: 600000, duro: 900000 }
    );
    lector.readAsDataURL(f);
  });
  input.click();
}

function elegirImagen(secId, i) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", () => {
    const f = input.files && input.files[0];
    if (!f) return;
    const lector = new FileReader();
    lector.onload = () => comprimirImagen(lector.result, (dataUrl) => {
      if (!dataUrl) {
        aviso("Imagen demasiado grande", "No se pudo reducir lo suficiente. Prueba con otra imagen o recórtala antes.");
        return;
      }
      estado.secciones[secId].bloques[i].src = dataUrl;
      programarGuardadoSeccion(secId, 0);
      render();
    });
    lector.readAsDataURL(f);
  });
  input.click();
}

// Reduce la imagen a un tamaño razonable para guardarla dentro del
// documento de Firestore (límite ~1 MB por documento).
function comprimirImagen(dataUrl, listo, opciones = {}) {
  const MAX = opciones.max || 1200;
  const LIMITE_BLANDO = opciones.blando || 500000;
  const LIMITE_DURO = opciones.duro || 700000;
  const img = new Image();
  img.onload = () => {
    const escala = Math.min(1, MAX / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * escala);
    canvas.height = Math.round(img.height * escala);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let salida = canvas.toDataURL("image/jpeg", 0.82);
    if (salida.length > LIMITE_BLANDO) salida = canvas.toDataURL("image/jpeg", 0.6);
    if (salida.length > LIMITE_DURO) salida = null;
    listo(salida);
  };
  img.onerror = () => listo(null);
  img.src = dataUrl;
}

// ---------------- Panel de configuración ----------------

function abrirConfig() {
  $("#panel-config").hidden = false;
  renderConfig();
}

function renderConfig() {
  const c = $("#config-contenido");
  c.innerHTML = "";

  // --- Datos generales ---
  const g1 = el("div", "config-grupo");
  g1.appendChild(el("h3", "", "Datos generales"));
  [
    ["Curso (p. ej. 2026/2027)", "curso"],
    ["Grupo (p. ej. 5º A)", "grupo"],
    ["Tutor/a", "tutor"],
    ["Centro", "centro"],
  ].forEach(([etiqueta, campo]) => {
    const f = el("div", "campo");
    const lab = el("label", "", etiqueta);
    const inp = document.createElement("input");
    inp.value = estado.app[campo] || "";
    inp.addEventListener("input", () => {
      estado.app[campo] = inp.value;
      programarGuardadoApp();
    });
    inp.addEventListener("change", () => render());
    f.append(lab, inp);
    g1.appendChild(f);
  });
  c.appendChild(g1);

  // --- Fondo ---
  const g2 = el("div", "config-grupo");
  g2.appendChild(el("h3", "", "Fondo de la presentación"));

  g2.appendChild(el("p", "nota-config", "Elige un tema (define los colores del texto y la tiza):"));
  const temas = el("div", "temas");
  TEMAS.forEach((t) => {
    const b = el("button", "tema-btn" + (estado.app.tema === t.id ? " activo" : ""));
    const mini = el("div", "mini");
    mini.style.background = t.fondo;
    mini.style.color = t.tinta;
    mini.style.fontFamily = "var(--fuente-titulos)";
    mini.style.display = "flex";
    mini.style.alignItems = "center";
    mini.style.justifyContent = "center";
    mini.textContent = "Abc";
    b.append(mini, document.createTextNode(t.nombre));
    b.addEventListener("click", () => {
      // Elegir un tema limpia el color y la imagen personalizados,
      // para que el resultado sea siempre el del tema elegido.
      estado.app.tema = t.id;
      estado.app.fondoColor = null;
      estado.app.fondoImagen = null;
      aplicarTema();
      programarGuardadoApp(0);
      renderConfig();
    });
    temas.appendChild(b);
  });
  g2.appendChild(temas);

  // Color de fondo libre
  const filaColor = el("div", "fila-fondo");
  const labColor = el("label", "", "Color de fondo personalizado:");
  labColor.htmlFor = "inp-color-fondo";
  const inpColor = document.createElement("input");
  inpColor.type = "color";
  inpColor.id = "inp-color-fondo";
  const temaActual = TEMAS.find((t) => t.id === estado.app.tema) || TEMAS[0];
  inpColor.value = estado.app.fondoColor || temaActual.fondo;
  inpColor.addEventListener("input", () => {
    estado.app.fondoColor = inpColor.value;
    aplicarTema();
    programarGuardadoApp();
  });
  inpColor.addEventListener("change", () => renderConfig());
  filaColor.append(labColor, inpColor);
  if (estado.app.fondoColor) {
    const quitarColor = el("button", "boton-mini", "✕ Quitar");
    quitarColor.title = "Volver al color del tema";
    quitarColor.addEventListener("click", () => {
      estado.app.fondoColor = null;
      aplicarTema();
      programarGuardadoApp(0);
      renderConfig();
    });
    filaColor.appendChild(quitarColor);
  }
  g2.appendChild(filaColor);

  // Imagen de fondo propia
  const btnImagenFondo = el(
    "button",
    "boton-config",
    estado.app.fondoImagen ? "🖼 Cambiar la imagen de fondo…" : "🖼 Poner una imagen de fondo…"
  );
  btnImagenFondo.addEventListener("click", () => elegirImagenFondo());
  g2.appendChild(btnImagenFondo);

  if (estado.app.fondoImagen) {
    const filaVelo = el("div", "fila-fondo");
    const labVelo = el("label", "", "Oscurecer la imagen:");
    labVelo.htmlFor = "inp-velo";
    const inpVelo = document.createElement("input");
    inpVelo.type = "range";
    inpVelo.id = "inp-velo";
    inpVelo.min = "0";
    inpVelo.max = "0.7";
    inpVelo.step = "0.05";
    inpVelo.value = String(typeof estado.app.fondoVelo === "number" ? estado.app.fondoVelo : 0.45);
    inpVelo.addEventListener("input", () => {
      estado.app.fondoVelo = Number(inpVelo.value);
      aplicarTema();
      programarGuardadoApp();
    });
    filaVelo.append(labVelo, inpVelo);
    g2.appendChild(filaVelo);

    const quitarImagen = el("button", "boton-config", "✕ Quitar la imagen de fondo");
    quitarImagen.addEventListener("click", () => {
      estado.app.fondoImagen = null;
      aplicarTema();
      programarGuardadoApp(0);
      renderConfig();
    });
    g2.appendChild(quitarImagen);
  }

  c.appendChild(g2);

  // --- Apartados ---
  const g3 = el("div", "config-grupo");
  g3.appendChild(el("h3", "", "Apartados (mostrar, ocultar y ordenar)"));
  estado.app.secciones.forEach((s, i) => {
    const fila = el("div", "fila-seccion" + (s.visible ? "" : " seccion-oculta"));
    const ojo = el("button", "", s.visible ? "👁" : "🚫");
    ojo.title = s.visible ? "Ocultar apartado" : "Mostrar apartado";
    ojo.addEventListener("click", () => {
      s.visible = !s.visible;
      programarGuardadoApp(0);
      render();
      renderConfig();
    });
    const nombre = el("span", "nombre", s.titulo);
    const subir = el("button", "", "↑");
    subir.title = "Subir";
    subir.addEventListener("click", () => moverSeccion(i, -1));
    const bajar = el("button", "", "↓");
    bajar.title = "Bajar";
    bajar.addEventListener("click", () => moverSeccion(i, +1));
    const renombrar = el("button", "", "✎");
    renombrar.title = "Renombrar";
    renombrar.addEventListener("click", async () => {
      const nuevo = await preguntar("Renombrar apartado", "Nuevo nombre:", s.titulo);
      if (nuevo) {
        s.titulo = nuevo;
        programarGuardadoApp(0);
        render();
        renderConfig();
      }
    });
    const borrar = el("button", "", "🗑");
    borrar.title = "Eliminar apartado";
    borrar.addEventListener("click", async () => {
      const seguro = await confirmar(
        `¿Eliminar el apartado «${s.titulo}» y todo su contenido? Si solo quieres que no se vea, usa el ojo 👁 para ocultarlo.`
      );
      if (!seguro) return;
      estado.app.secciones.splice(i, 1);
      delete estado.secciones[s.id];
      deleteDoc(doc(db, COL_SECCIONES, s.id)).catch(() => {});
      programarGuardadoApp(0);
      render();
      renderConfig();
    });
    fila.append(ojo, nombre, subir, bajar, renombrar, borrar);
    g3.appendChild(fila);
  });

  const btnNueva = el("button", "boton-config", "＋ Añadir apartado nuevo");
  btnNueva.addEventListener("click", async () => {
    const titulo = await preguntar("Nuevo apartado", "Título del apartado:", "");
    if (!titulo) return;
    const id = "s" + Date.now();
    estado.app.secciones.push({ id, titulo, visible: true });
    estado.secciones[id] = {
      bloques: [
        { t: "h", html: titulo },
        { t: "p", html: "Contenido del apartado. Haz clic para editarlo." },
      ],
    };
    programarGuardadoApp(0);
    programarGuardadoSeccion(id, 0);
    render();
    renderConfig();
  });
  g3.appendChild(btnNueva);
  c.appendChild(g3);

  // --- Seguridad y mantenimiento ---
  const g4 = el("div", "config-grupo");
  g4.appendChild(el("h3", "", "Seguridad y mantenimiento"));

  const btnCodigo = el("button", "boton-config", "🔑 Cambiar el código de edición");
  btnCodigo.addEventListener("click", async () => {
    const nuevo = await preguntar(
      "Cambiar código",
      "Nuevo código de edición (los dispositivos ya inscritos seguirán pudiendo editar):",
      ""
    );
    if (!nuevo) return;
    try {
      await sesionRestaurada;
      await setDoc(doc(db, COL_SECRETO, "main"), { code: nuevo });
      aviso("Código cambiado", "A partir de ahora, para inscribir un dispositivo nuevo hará falta el código nuevo. Los dispositivos ya inscritos (como este) siguen funcionando.");
    } catch (e) {
      console.error(e);
      if (!nubeDisponible) {
        aviso("Falta un paso en Firebase", "La base de datos todavía no tiene publicadas las reglas de esta aplicación. Hay que pegar el archivo firestore.rules en la consola de Firebase (Firestore Database → Reglas → sustituir todo → Publicar).");
      } else {
        aviso("Error", "No se pudo cambiar el código. Comprueba la conexión e inténtalo de nuevo.");
      }
    }
  });
  g4.appendChild(btnCodigo);

  const btnRestaurar = el("button", "boton-config peligro", "♻ Restaurar el contenido original");
  btnRestaurar.addEventListener("click", async () => {
    const seguro = await confirmar(
      "Se sustituirá TODO el contenido (textos, apartados, imágenes) por el contenido inicial de la plantilla. Esta acción no se puede deshacer. ¿Continuar?"
    );
    if (!seguro) return;
    estado.app = clon(window.CONTENIDO_INICIAL.app);
    estado.secciones = clon(window.CONTENIDO_INICIAL.secciones);
    aplicarTema();
    render();
    renderConfig();
    indicarGuardado("Guardando…");
    try {
      await setDoc(doc(db, COL_APP, "app"), clon(estado.app));
      for (const [id, datos] of Object.entries(estado.secciones)) {
        await setDoc(doc(db, COL_SECCIONES, id), clon(datos));
      }
      indicarGuardado("Guardado ✓");
    } catch (e) {
      console.error(e);
      indicarGuardado("⚠ No se pudo guardar", true);
    }
  });
  g4.appendChild(btnRestaurar);
  c.appendChild(g4);
}

function moverSeccion(i, delta) {
  const s = estado.app.secciones;
  const j = i + delta;
  if (j < 0 || j >= s.length) return;
  [s[i], s[j]] = [s[j], s[i]];
  programarGuardadoApp(0);
  render();
  renderConfig();
}

// ---------------- Tema ----------------

// El tema base define los colores del texto y la tiza; encima se
// pueden aplicar un color de fondo libre o una imagen de fondo
// propia (con un velo oscuro regulable para que el texto se lea).
function aplicarTema() {
  const tema = TEMAS.some((t) => t.id === estado.app.tema)
    ? estado.app.tema
    : "pizarra-negra";
  document.body.dataset.tema = tema;

  const s = document.body.style;
  if (estado.app.fondoImagen) {
    const velo = typeof estado.app.fondoVelo === "number" ? estado.app.fondoVelo : 0.45;
    s.backgroundImage =
      `linear-gradient(rgba(0,0,0,${velo}), rgba(0,0,0,${velo})), url("${estado.app.fondoImagen}")`;
    s.backgroundSize = "cover";
    s.backgroundPosition = "center";
    s.backgroundColor = estado.app.fondoColor || "";
  } else {
    s.backgroundImage = "";
    s.backgroundSize = "";
    s.backgroundPosition = "";
    s.backgroundColor = estado.app.fondoColor || "";
  }
}

// ---------------- Modales ----------------

function abrirModal(html) {
  const fondo = $("#fondo-modal");
  const modal = $("#modal");
  modal.innerHTML = html;
  fondo.hidden = false;
  return modal;
}

function cerrarModal() {
  $("#fondo-modal").hidden = true;
}

function pedirCodigo() {
  return new Promise((resolver) => {
    const m = abrirModal(`
      <h3>🔑 Código de edición</h3>
      <p>Introduce el código de edición para poder modificar la presentación.</p>
      <p style="font-size:14px;color:var(--texto-suave)">La primera vez que se usa la aplicación, el código que escribas quedará establecido como código de edición.</p>
      <input type="password" id="inp-codigo" autocomplete="off">
      <div class="acciones">
        <button class="secundario" id="m-cancelar">Cancelar</button>
        <button class="principal" id="m-aceptar">Entrar</button>
      </div>`);
    const inp = m.querySelector("#inp-codigo");
    inp.focus();
    const terminar = (v) => { cerrarModal(); resolver(v); };
    m.querySelector("#m-cancelar").addEventListener("click", () => terminar(null));
    m.querySelector("#m-aceptar").addEventListener("click", () => terminar(inp.value.trim() || null));
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") terminar(inp.value.trim() || null); });
  });
}

function confirmar(texto) {
  return new Promise((resolver) => {
    const m = abrirModal(`
      <h3>⚠️ Confirmar</h3>
      <p>${texto}</p>
      <div class="acciones">
        <button class="secundario" id="m-cancelar">Cancelar</button>
        <button class="peligro" id="m-aceptar">Sí, continuar</button>
      </div>`);
    m.querySelector("#m-cancelar").addEventListener("click", () => { cerrarModal(); resolver(false); });
    m.querySelector("#m-aceptar").addEventListener("click", () => { cerrarModal(); resolver(true); });
  });
}

function preguntar(titulo, texto, valor) {
  return new Promise((resolver) => {
    const m = abrirModal(`
      <h3>${titulo}</h3>
      <p>${texto}</p>
      <input id="inp-pregunta" autocomplete="off">
      <div class="acciones">
        <button class="secundario" id="m-cancelar">Cancelar</button>
        <button class="principal" id="m-aceptar">Aceptar</button>
      </div>`);
    const inp = m.querySelector("#inp-pregunta");
    inp.value = valor || "";
    inp.focus();
    inp.select();
    const terminar = (v) => { cerrarModal(); resolver(v); };
    m.querySelector("#m-cancelar").addEventListener("click", () => terminar(null));
    m.querySelector("#m-aceptar").addEventListener("click", () => terminar(inp.value.trim() || null));
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") terminar(inp.value.trim() || null); });
  });
}

function aviso(titulo, texto) {
  return new Promise((resolver) => {
    const m = abrirModal(`
      <h3>${titulo}</h3>
      <p>${texto}</p>
      <div class="acciones">
        <button class="principal" id="m-aceptar">Entendido</button>
      </div>`);
    m.querySelector("#m-aceptar").addEventListener("click", () => { cerrarModal(); resolver(); });
  });
}

function elegirTipoBloque() {
  return new Promise((resolver) => {
    const m = abrirModal(`
      <h3>＋ Añadir bloque</h3>
      <div class="menu-bloques">
        <button data-tipo="h">🅰 Título</button>
        <button data-tipo="p">¶ Párrafo</button>
        <button data-tipo="ul">• Lista</button>
        <button data-tipo="destacado">▣ Destacado</button>
        <button data-tipo="cols">◫ Dos columnas</button>
        <button data-tipo="tabla">⊞ Tabla</button>
        <button data-tipo="img">🖼 Imagen</button>
      </div>
      <div class="acciones">
        <button class="secundario" id="m-cancelar">Cancelar</button>
      </div>`);
    m.querySelectorAll("[data-tipo]").forEach((b) =>
      b.addEventListener("click", () => { cerrarModal(); resolver(b.dataset.tipo); })
    );
    m.querySelector("#m-cancelar").addEventListener("click", () => { cerrarModal(); resolver(null); });
  });
}

// ---------------- Navegación ----------------

$("#btn-siguiente").addEventListener("click", () => ir(estado.idx + 1));
$("#btn-anterior").addEventListener("click", () => ir(estado.idx - 1));
$("#btn-indice").addEventListener("click", () => ir(1));
$("#btn-editar").addEventListener("click", alternarEdicion);
$("#btn-salir-edicion").addEventListener("click", alternarEdicion);
// El engranaje está siempre visible: si aún no se está en modo
// edición, pide el código (mismo camino que el lápiz) y, una vez
// dentro, abre directamente el panel de configuración.
$("#btn-config").addEventListener("click", async () => {
  if (!estado.editando) {
    await alternarEdicion();
    if (!estado.editando) return; // código cancelado o incorrecto
  }
  abrirConfig();
});
$("#btn-cerrar-config").addEventListener("click", () => { $("#panel-config").hidden = true; });

document.addEventListener("keydown", (ev) => {
  const enEditable = ev.target.isContentEditable ||
    ev.target.tagName === "INPUT" || ev.target.tagName === "TEXTAREA";
  if (!$("#fondo-modal").hidden) {
    if (ev.key === "Escape") cerrarModal();
    return;
  }
  if (ev.key === "Escape") {
    if (!$("#panel-config").hidden) { $("#panel-config").hidden = true; return; }
    if (!enEditable) ir(1);
    return;
  }
  if (enEditable) return;
  if (ev.key === "ArrowRight" || ev.key === "PageDown" || ev.key === " ") ir(estado.idx + 1);
  if (ev.key === "ArrowLeft" || ev.key === "PageUp") ir(estado.idx - 1);
  if (ev.key === "Home") ir(0);
});

// Gestos táctiles (pasar de diapositiva deslizando)
let toqueX = null;
document.addEventListener("touchstart", (ev) => {
  if (ev.touches.length === 1) toqueX = ev.touches[0].clientX;
}, { passive: true });
document.addEventListener("touchend", (ev) => {
  if (toqueX === null || estado.editando) return;
  const dx = ev.changedTouches[0].clientX - toqueX;
  toqueX = null;
  if (Math.abs(dx) < 60) return;
  ir(estado.idx + (dx < 0 ? 1 : -1));
}, { passive: true });

// ---------------- Arranque ----------------

aplicarTema();
render();
escucharNube();
