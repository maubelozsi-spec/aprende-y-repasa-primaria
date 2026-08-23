// ============================================================
// Novela Colectiva — el recuadro de prueba del tutorial.
// Usa exactamente el mismo corrector que la app de verdad, pero sin
// guardar nada en ningún sitio: es para perderle el miedo.
// ============================================================

import { el, escapaHtml, contarLineas } from "./comun.js";
import { revisarTexto, aplicarSugerencia } from "./corrector.js";

const demo = el("demo");
let avisosActuales = [];

function revisar() {
  const texto = demo.value;
  const lineas = contarLineas(texto);
  el("demo-contador").textContent = lineas + " de 10 líneas";
  const barra = el("demo-barra");
  barra.firstElementChild.style.width = Math.min(100, lineas * 10) + "%";
  barra.classList.toggle("casi", lineas >= 8 && lineas <= 10);
  barra.classList.toggle("pasado", lineas > 10);

  const { avisos, propios } = revisarTexto(texto, {});
  avisosActuales = avisos;
  const cont = el("demo-avisos");
  const trozos = avisos.map((a, i) => {
    const sugerencias = (a.sugerencias || []).map((s) =>
      `<button class="btn-sugerencia" data-i="${i}" data-s="${escapaHtml(s)}">${escapaHtml(s)}</button>`).join("");
    return `<li class="${a.tipo === "falta" ? "falta" : "duda"}">
      <span class="palabra-mal">${escapaHtml(a.texto.trim() || "espacio")}</span>
      <span class="explica">${escapaHtml(a.regla)}</span>
      <span class="sugerencias">${sugerencias}</span></li>`;
  });
  for (const p of propios) {
    trozos.push(`<li class="coherencia"><span class="palabra-mal">${escapaHtml(p.palabra)}</span>
      <span class="explica">Esto parece el nombre de alguien o de algún sitio.
      En la novela de verdad, aquí te pediría su ficha.</span></li>`);
  }
  if (!trozos.length && texto.trim()) {
    trozos.push('<li class="bien">¡Perfecto! No he encontrado nada que corregir.</li>');
  }
  cont.innerHTML = trozos.join("");

  cont.querySelectorAll("[data-s]").forEach((btn) => {
    btn.addEventListener("click", () => {
      demo.value = aplicarSugerencia(demo.value, avisosActuales[Number(btn.dataset.i)], btn.dataset.s);
      revisar();
    });
  });
}

demo.addEventListener("input", revisar);
revisar();
