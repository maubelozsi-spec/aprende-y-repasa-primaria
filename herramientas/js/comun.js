// ============================================================
// Utilidades comunes de las herramientas del tablero.
//
//  Herramienta.embebido      true si va dentro del tablero (?embed=1)
//  Herramienta.cargar(k, d)  ajustes guardados con valores por defecto
//  Herramienta.guardar(k, o) guarda en localStorage (sin romper si falla)
//  Herramienta.sonar(tipo)   "campana", "gong", "aviso", "exito", "tic"
//
// Los sonidos se generan con Web Audio, sin archivos. El navegador solo
// deja sonar audio después de un toque en la página, así que el audio
// se "desbloquea" con el primer toque o tecla.
// ============================================================
(function () {
  "use strict";

  const embebido = /[?&]embed=1\b/.test(location.search);
  if (embebido) document.documentElement.classList.add("embebido");

  function cargar(clave, porDefecto) {
    try {
      const datos = JSON.parse(localStorage.getItem(clave) || "null");
      if (datos && typeof datos === "object") return Object.assign({}, porDefecto, datos);
    } catch (e) {
      // Datos dañados o sin localStorage.
    }
    return Object.assign({}, porDefecto);
  }

  function guardar(clave, objeto) {
    try {
      localStorage.setItem(clave, JSON.stringify(objeto));
    } catch (e) {
      // Ventana privada o almacenamiento bloqueado: no se recuerda.
    }
  }

  let ctx = null;
  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  }
  ["pointerdown", "keydown"].forEach((ev) => document.addEventListener(ev, audio, { once: true, capture: true }));

  // Cada nota: [frecuencia, inicio (s), duración (s), volumen].
  const SONIDOS = {
    campana: [[880, 0, 1.2, 0.3], [1320, 0, 0.9, 0.12], [880, 0.6, 1.2, 0.3], [1320, 0.6, 0.9, 0.12]],
    gong: [[196, 0, 2.4, 0.4], [294, 0, 1.6, 0.15], [392, 0.02, 1.0, 0.08]],
    aviso: [[440, 0, 0.35, 0.25], [330, 0.35, 0.45, 0.25]],
    exito: [[523, 0, 0.18, 0.22], [659, 0.15, 0.18, 0.22], [784, 0.3, 0.35, 0.22]],
    tic: [[1200, 0, 0.04, 0.08]],
  };

  function sonar(tipo) {
    const notas = SONIDOS[tipo];
    const c = audio();
    if (!notas || !c) return;
    const t0 = c.currentTime + 0.02;
    notas.forEach(([f, inicio, dur, vol]) => {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0 + inicio);
      g.gain.exponentialRampToValueAtTime(vol, t0 + inicio + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + inicio + dur);
      osc.connect(g).connect(c.destination);
      osc.start(t0 + inicio);
      osc.stop(t0 + inicio + dur + 0.05);
    });
  }

  // Abre y cierra un panel de ajustes con su botón.
  function conmutador(boton, panel) {
    boton.addEventListener("click", () => {
      const abrir = panel.hidden;
      panel.hidden = !abrir;
      boton.setAttribute("aria-expanded", String(abrir));
      if (abrir) panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  window.Herramienta = { embebido, cargar, guardar, sonar, conmutador };
})();
