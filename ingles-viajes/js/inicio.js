// ============================================================
// Inglés para Viajar — portada: el resumen de "qué toca hoy".
// ============================================================

import { VOCABULARIO } from "./datos-vocabulario.js";
import { TEMAS } from "./datos-conversaciones.js";
import { resumen } from "./almacen.js";
import { escapar } from "./comun.js";

const totalNiveles = TEMAS.reduce((n, t) => n + t.niveles.length, 0);
const ids = VOCABULARIO.map((v) => v.id);
const r = resumen(ids, totalNiveles);

const panel = document.getElementById("panel-hoy");
const empezando = r.nivelesHechos === 0 && r.palabrasVistas === 0;

if (empezando) {
  panel.innerHTML = `
    <div class="tarjeta" style="text-align:left; border-left:5px solid var(--coral)">
      <h3 style="margin-bottom:6px">Primera vez por aquí</h3>
      <p class="texto-suave" style="margin-bottom:12px; font-size:0.93rem">
        Empieza por «Saludar y presentarse», nivel 1: son cuatro turnos y frases de tres palabras.
        En cinco minutos habrás mantenido tu primera conversación entera en inglés.
      </p>
      <a class="btn btn-acento" href="conversar.html?tema=saludos&nivel=0">Empezar la primera conversación</a>
    </div>`;
} else {
  const pendientes = r.pendientesHoy;
  const textoRepaso = pendientes > 0
    ? `Tienes <strong>${pendientes}</strong> ${pendientes === 1 ? "palabra pendiente" : "palabras pendientes"} de repaso.`
    : "Hoy no tienes repasos pendientes: puedes aprender palabras nuevas.";

  panel.innerHTML = `
    <div class="tarjeta" style="text-align:left">
      <h3 style="margin-bottom:8px">Qué toca hoy</h3>
      <p class="texto-suave" style="font-size:0.93rem; margin-bottom:12px">
        ${textoRepaso}
        Llevas <strong>${r.nivelesHechos}</strong> de ${totalNiveles} conversaciones
        y <strong>${r.dominadas}</strong> ${r.dominadas === 1 ? "palabra dominada" : "palabras dominadas"}.
        ${r.racha > 1 ? `Racha de <strong>${escapar(String(r.racha))} días seguidos</strong>. 🔥` : ""}
      </p>
      <div class="fila-botones">
        <a class="btn btn-acento" href="vocabulario.html?modo=repaso">${pendientes > 0 ? "Repasar ahora" : "Aprender palabras nuevas"}</a>
        <a class="btn btn-secundario" href="conversar.html">Seguir conversando</a>
      </div>
    </div>`;
}
