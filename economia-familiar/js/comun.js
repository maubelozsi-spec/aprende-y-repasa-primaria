// ============================================================
// Economía Familiar 2.0 — utilidades compartidas de interfaz:
// sesiones (docente y familia), avisos tipo "toast", modales de
// confirmación y gráficas de líneas dibujadas en canvas (sin
// librerías externas, igual que el resto del proyecto).
// ============================================================

export const CLAVE_SESION_FAMILIA = "eco_familia";
export const CLAVE_SESION_DOCENTE = "eco_docente";

export function guardarSesion(clave, datos) {
  try { localStorage.setItem(clave, JSON.stringify(datos)); } catch (e) { /* sin localStorage */ }
}

export function cargarSesion(clave) {
  try {
    const raw = localStorage.getItem(clave);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

export function borrarSesion(clave) {
  try { localStorage.removeItem(clave); } catch (e) { /* sin localStorage */ }
}

// ---------- avisos ----------

export function aviso(mensaje, tipo) {
  let cont = document.getElementById("eco-toasts");
  if (!cont) {
    cont = document.createElement("div");
    cont.id = "eco-toasts";
    document.body.appendChild(cont);
  }
  const el = document.createElement("div");
  el.className = "toast toast-" + (tipo || "info");
  el.textContent = mensaje;
  cont.appendChild(el);
  setTimeout(() => { el.classList.add("visible"); }, 20);
  setTimeout(() => {
    el.classList.remove("visible");
    setTimeout(() => el.remove(), 400);
  }, 4200);
}

// Confirmación con modal propio (los confirm() nativos quedan feos en PWA).
export function confirmar(mensaje, textoBoton) {
  return new Promise((resolve) => {
    const fondo = document.createElement("div");
    fondo.className = "modal-fondo";
    fondo.innerHTML =
      '<div class="modal-caja">' +
      '<p>' + mensaje + "</p>" +
      '<div class="modal-botones">' +
      '<button class="btn btn-secundario" data-accion="no">Cancelar</button>' +
      '<button class="btn btn-principal" data-accion="si">' + (textoBoton || "Aceptar") + "</button>" +
      "</div></div>";
    document.body.appendChild(fondo);
    fondo.addEventListener("click", (e) => {
      const accion = e.target.getAttribute && e.target.getAttribute("data-accion");
      if (accion || e.target === fondo) {
        fondo.remove();
        resolve(accion === "si");
      }
    });
  });
}

// ---------- gráficas ----------

// Gráfica de líneas multi-serie en canvas.
// series: [{ nombre, color, valores: [n|null,…] }], etiquetas: ["Ene",…]
export function graficaLineas(canvas, series, etiquetas, opciones) {
  const opts = opciones || {};
  const dpr = window.devicePixelRatio || 1;
  const cssAncho = canvas.clientWidth || 600;
  const cssAlto = canvas.clientHeight || 300;
  canvas.width = cssAncho * dpr;
  canvas.height = cssAlto * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssAncho, cssAlto);

  const margen = { arriba: 14, derecha: 12, abajo: 26, izquierda: 56 };
  const ancho = cssAncho - margen.izquierda - margen.derecha;
  const alto = cssAlto - margen.arriba - margen.abajo;

  const todos = series.flatMap((s) => s.valores.filter((v) => v != null));
  if (!todos.length) return;
  let min = Math.min(0, ...todos);
  let max = Math.max(0, ...todos);
  if (min === max) { max = min + 100; }
  const rango = max - min;
  min -= rango * 0.05;
  max += rango * 0.05;

  const x = (i) => margen.izquierda + (etiquetas.length <= 1 ? ancho / 2 : (ancho * i) / (etiquetas.length - 1));
  const y = (v) => margen.arriba + alto - ((v - min) / (max - min)) * alto;

  const estilos = getComputedStyle(document.documentElement);
  const colorEjes = estilos.getPropertyValue("--gris-borde").trim() || "#d8d2c7";
  const colorTexto = estilos.getPropertyValue("--gris-texto").trim() || "#6b675f";

  // Rejilla horizontal y etiquetas del eje Y.
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = colorTexto;
  ctx.strokeStyle = colorEjes;
  ctx.lineWidth = 1;
  const pasos = 4;
  for (let i = 0; i <= pasos; i++) {
    const v = min + ((max - min) * i) / pasos;
    const py = y(v);
    ctx.beginPath();
    ctx.moveTo(margen.izquierda, py);
    ctx.lineTo(margen.izquierda + ancho, py);
    ctx.stroke();
    ctx.textAlign = "right";
    ctx.fillText(Math.round(v).toLocaleString("es-ES"), margen.izquierda - 6, py + 4);
  }

  // Línea del cero, más marcada si hay valores negativos.
  if (min < 0) {
    ctx.strokeStyle = colorTexto;
    ctx.beginPath();
    ctx.moveTo(margen.izquierda, y(0));
    ctx.lineTo(margen.izquierda + ancho, y(0));
    ctx.stroke();
  }

  // Etiquetas del eje X.
  ctx.textAlign = "center";
  ctx.fillStyle = colorTexto;
  const salto = etiquetas.length > 8 ? 2 : 1;
  etiquetas.forEach((e, i) => {
    if (i % salto === 0) ctx.fillText(e, x(i), cssAlto - 8);
  });

  // Series.
  for (const s of series) {
    ctx.strokeStyle = s.color;
    ctx.lineWidth = opts.grosor || 2.5;
    ctx.lineJoin = "round";
    ctx.beginPath();
    let iniciada = false;
    s.valores.forEach((v, i) => {
      if (v == null) { iniciada = false; return; }
      if (!iniciada) { ctx.moveTo(x(i), y(v)); iniciada = true; }
      else ctx.lineTo(x(i), y(v));
    });
    ctx.stroke();
    // Puntos.
    ctx.fillStyle = s.color;
    s.valores.forEach((v, i) => {
      if (v == null) return;
      ctx.beginPath();
      ctx.arc(x(i), y(v), opts.radioPunto || 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

// Paleta para distinguir familias en las gráficas.
export const PALETA_FAMILIAS = [
  "#e07a3f", "#3f7ae0", "#3fae5c", "#c94f7c", "#8a5fd6",
  "#d6a23f", "#3fa9c9", "#a0522d", "#5c5cd6", "#7a9e3f",
];

// ---------- varios ----------

export function el(id) { return document.getElementById(id); }

export function escapaHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto == null ? "" : String(texto);
  return div.innerHTML;
}

export function fecha(ts) {
  try {
    const d = ts && ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("es-ES");
  } catch (e) { return ""; }
}
