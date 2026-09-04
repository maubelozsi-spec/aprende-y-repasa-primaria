// ============================================================
// Novela Colectiva — la portada la dibuja el alumnado.
//
// Un lienzo sencillo, con dedo o ratón: seis colores, tres grosores
// y una goma. Nada de capas ni de herramientas raras; la gracia está
// en que el libro acabe con un dibujo hecho a mano por alguien de la
// clase, no en tener un editor de imágenes.
//
// Se guarda en JPEG y reducido a 900 píxeles de ancho, que es de
// sobra para imprimirlo en la portada del PDF y deja el archivo en
// unas decenas de kilobytes: cabe holgadamente en un documento de
// Firestore, que es lo que impone el límite de verdad.
// ============================================================

import { modal, escapaHtml } from "./comun.js";

const COLORES = ["#1f2430", "#c62828", "#1565c0", "#2e7d32", "#f9a825", "#6a1b9a"];
const GROSORES = [3, 8, 18];
const ANCHO_GUARDADO = 900;

export function dibujarPortada(opciones) {
  const conf = opciones || {};
  return modal((caja, cerrar) => {
    caja.classList.add("modal-ancho");
    caja.innerHTML = `
      <h2>Dibuja la portada de «${escapaHtml(conf.titulo || "la novela")}»</h2>
      <p class="texto-suave pequeno">Tu profe elegirá una de todas las que dibuje la clase para
        ponerla en la primera página del libro.</p>

      <div class="barra-dibujo">
        <span class="grupo-colores" id="colores"></span>
        <span class="grupo-grosores" id="grosores"></span>
        <button class="btn btn-mini btn-secundario" id="goma">🧽 Goma</button>
        <button class="btn btn-mini btn-secundario" id="limpiar">Empezar de nuevo</button>
      </div>

      <div class="marco-lienzo">
        <canvas id="lienzo" width="600" height="800"></canvas>
      </div>

      <div class="modal-botones">
        <button class="btn btn-secundario" id="cancelar">Cancelar</button>
        <button class="btn btn-principal" id="guardar">Guardar mi portada</button>
      </div>`;

    const lienzo = caja.querySelector("#lienzo");
    const ctx = lienzo.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, lienzo.width, lienzo.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    let color = COLORES[0];
    let grosor = GROSORES[1];
    let borrando = false;
    let pintando = false;

    // ---------- paleta ----------

    const paleta = caja.querySelector("#colores");
    paleta.innerHTML = COLORES.map((c, i) =>
      `<button class="pincel-color ${i === 0 ? "activo" : ""}" data-color="${c}" style="background:${c}" title="Color"></button>`).join("");
    paleta.addEventListener("click", (e) => {
      const b = e.target.closest("[data-color]");
      if (!b) return;
      color = b.dataset.color;
      borrando = false;
      paleta.querySelectorAll(".pincel-color").forEach((x) => x.classList.remove("activo"));
      b.classList.add("activo");
      caja.querySelector("#goma").classList.remove("activo");
    });

    const grosores = caja.querySelector("#grosores");
    grosores.innerHTML = GROSORES.map((g, i) =>
      `<button class="pincel-grosor ${i === 1 ? "activo" : ""}" data-grosor="${g}" title="Grosor">
         <span style="width:${g}px; height:${g}px"></span></button>`).join("");
    grosores.addEventListener("click", (e) => {
      const b = e.target.closest("[data-grosor]");
      if (!b) return;
      grosor = Number(b.dataset.grosor);
      grosores.querySelectorAll(".pincel-grosor").forEach((x) => x.classList.remove("activo"));
      b.classList.add("activo");
    });

    caja.querySelector("#goma").addEventListener("click", (e) => {
      borrando = !borrando;
      e.currentTarget.classList.toggle("activo", borrando);
    });

    caja.querySelector("#limpiar").addEventListener("click", () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, lienzo.width, lienzo.height);
    });

    // ---------- dibujar ----------
    //
    // Se usan eventos de puntero: valen igual para el dedo en la
    // pantalla táctil, el lápiz y el ratón, sin escribir tres veces
    // lo mismo.

    function punto(ev) {
      const caja2 = lienzo.getBoundingClientRect();
      return {
        x: (ev.clientX - caja2.left) * (lienzo.width / caja2.width),
        y: (ev.clientY - caja2.top) * (lienzo.height / caja2.height),
      };
    }

    lienzo.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      pintando = true;
      lienzo.setPointerCapture(ev.pointerId);
      const p = punto(ev);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      // Un toque suelto también deja marca, que si no los puntos no
      // se pueden pintar.
      ctx.lineTo(p.x + 0.1, p.y);
      trazar();
    });

    lienzo.addEventListener("pointermove", (ev) => {
      if (!pintando) return;
      ev.preventDefault();
      const p = punto(ev);
      ctx.lineTo(p.x, p.y);
      trazar();
    });

    function fin() { pintando = false; }
    lienzo.addEventListener("pointerup", fin);
    lienzo.addEventListener("pointercancel", fin);
    lienzo.addEventListener("pointerleave", fin);

    function trazar() {
      ctx.strokeStyle = borrando ? "#ffffff" : color;
      ctx.lineWidth = borrando ? Math.max(18, grosor * 2.5) : grosor;
      ctx.stroke();
    }

    // ---------- guardar ----------

    caja.querySelector("#cancelar").addEventListener("click", () => cerrar(null));
    caja.querySelector("#guardar").addEventListener("click", () => {
      // Se reescala a un lienzo aparte para no tocar el dibujo que
      // el alumno tiene delante por si le da a cancelar después.
      const salida = document.createElement("canvas");
      salida.width = ANCHO_GUARDADO;
      salida.height = Math.round(ANCHO_GUARDADO * (lienzo.height / lienzo.width));
      const sctx = salida.getContext("2d");
      sctx.fillStyle = "#ffffff";
      sctx.fillRect(0, 0, salida.width, salida.height);
      sctx.drawImage(lienzo, 0, 0, salida.width, salida.height);
      cerrar(salida.toDataURL("image/jpeg", 0.82));
    });
  }, { cerrarFuera: false });
}
