// ============================================================
// Letrania · datos fijos del juego (los comparten la pantalla del
// alumno y el panel del maestro). Copiados del prototipo y de
// LETRANIA_ESPECIFICACION.md; los contenidos de cada estación salen
// de la temporización del curso de ATLC de 5º.
// ============================================================
(function () {
  "use strict";

  const CLASES = [
    { id: "maga", nombre: "Magos de la Tinta", uno: "Mago de la Tinta", poder: "Trazo mágico", desc: "Duplica las gemas de «buena letra» una vez por región." },
    { id: "explo", nombre: "Exploradores de Sílabas", uno: "Explorador de Sílabas", poder: "Brújula", desc: "Descarta una opción incorrecta en una prueba." },
    { id: "guard", nombre: "Guardianes del Punto", uno: "Guardián del Punto", poder: "Escudo", desc: "Protege tu racha si un día no se juega." },
    { id: "bardo", nombre: "Bardos de las Palabras", uno: "Bardo de las Palabras", poder: "Eco", desc: "Repite el audio de las palabras sin límite." },
  ];

  // Los 16 retratos válidos (los mismos que acepta firestore.rules).
  const RETRATOS = [];
  CLASES.forEach((c) => [1, 2, 3, 4].forEach((n) => RETRATOS.push(c.id + "-" + n)));

  const ESTANDARTES = ["#c0582f", "#2f9a92", "#4a5aa8", "#5f8f3e", "#8a4a8f", "#d99a3d"];

  // La letra del grupo (A, B, C) solo la ve el maestro.
  const SENDAS = {
    dragon: { nombre: "Senda del Dragón", corto: "Dragón", grupo: "A", cls: "s-dragon" },
    grifo: { nombre: "Senda del Grifo", corto: "Grifo", grupo: "B", cls: "s-grifo" },
    unicornio: { nombre: "Senda del Unicornio", corto: "Unicornio", grupo: "C", cls: "s-unicornio" },
  };

  const REGIONES = [
    { nombre: "Puerto de las Primeras Letras", lugar: "a los pies de la Alcazaba", desde: 1, hasta: 6, guardian: "El Pulpo Sinpunto", gimg: "guardian-1", gdesc: "Se come los puntos y las mayúsculas de las frases.",
      c: { dragon: ["Mayúscula y punto", "Separar palabras", "La sílaba", "Sílaba tónica", "Palabras agudas", "Palabras llanas"], grifo: ["Mayúscula y punto", "Separar palabras", "Sílabas", "Sílaba tónica", "mp y mb", "r y rr"], unicornio: ["Las vocales", "La M", "La P", "La L", "La S", "La T"] } },
    { nombre: "Cordillera del Eco", lugar: "en las cumbres de Sierra Nevada", desde: 7, hasta: 12, guardian: "La Gorgona Muda", gimg: "guardian-2", gdesc: "Convierte en piedra las palabras sin tilde.",
      c: { dragon: ["Palabras esdrújulas", "Tilde en las agudas", "Tilde en llanas y esdrújulas", "La b", "La v", "La h"], grifo: ["c y qu", "z y c", "g y gu", "El nombre", "Nombres propios", "El plural"], unicornio: ["La N", "La D", "Repaso", "La B", "La V", "La F"] } },
    { nombre: "Ciénaga de las Letras Gemelas", lugar: "en las salinas de Cabo de Gata", desde: 13, hasta: 18, guardian: "El Sapo Trastrueque", gimg: "guardian-3", gdesc: "Cambia unas letras por sus gemelas para liar a los viajeros.",
      c: { dragon: ["¿? y ¡!", "La coma", "El sustantivo", "Género y número", "El adjetivo", "Sinónimos"], grifo: ["¿? y ¡!", "El género", "El artículo", "El adjetivo", "Sinónimos", "Antónimos"], unicornio: ["La C", "QU", "La G", "La J", "La H", "La Ñ"] } },
    { nombre: "Bosque de los Nombres Vivos", lugar: "entre los pinos de la Sierra de María", desde: 19, hasta: 24, guardian: "El Árbol Olvidadizo", gimg: "guardian-4", gdesc: "Ha olvidado el nombre de cada cosa del bosque.",
      c: { dragon: ["Antónimos", "El verbo y sus tiempos", "g y j", "ll e y", "r y rr", "c, qu y z"], grifo: ["El verbo", "Ayer, hoy y mañana", "La b", "La h", "La coma", "ll e y"], unicornio: ["La Z", "CE y CI", "LL", "La Y", "CH", "RR"] } },
    { nombre: "Torre del Escriba", lugar: "en el desierto de Tabernas", desde: 25, hasta: 30, guardian: "El Escriba Borroso", gimg: "guardian-5", gdesc: "Escribe historias sin orden ni conectores.",
      c: { dragon: ["Conectores", "La descripción", "El diálogo", "Sujeto y predicado", "Familias y prefijos", "Pronombres"], grifo: ["Ordenar una historia", "Describir un animal", "El diálogo", "ge, gi, je, ji", "Familias de palabras", "Pronombres"], unicornio: ["Sílabas inversas", "BR y BL", "PR y PL", "TR, FR y FL", "CR y CL", "GR y GL"] } },
    { nombre: "Cámara del Tesoro", lugar: "en la Cueva de los Letreros, donde nació el Indalo", desde: 31, hasta: 34, guardian: "Borrón, el hechicero", gimg: "guardian-6", gdesc: "Robó las palabras del reino. Lo vence toda la clase unida.",
      c: { dragon: ["El resumen", "Tilde en los hiatos", "La carta", "Gran repaso"], grifo: ["La carta", "Agudas y llanas", "La tilde", "Gran repaso"], unicornio: ["La mayúscula", "Frases de 3 palabras", "Escribo una frase", "Gran repaso"] } },
  ];

  const TOTAL_FICHAS = 34;

  // Casillas que marca el maestro al terminar cada ficha (apartado 6).
  const CRITERIOS = [
    { id: "completa", nombre: "Ficha completa", xp: 30, gemas: 2 },
    { id: "dictado", nombre: "Dictado con 0-2 fallos", xp: 15, gemas: 1 },
    { id: "letra", nombre: "Buena letra", xp: 15, gemas: 1 },
    { id: "comprension", nombre: "Comprensión lectora", xp: 10, gemas: 1 },
    { id: "esfuerzo", nombre: "Esfuerzo o mejora", xp: 10, gemas: 1 },
  ];

  const MINUTOS_POR_DEFECTO = 15;

  // Cartas de poder (apartado 7): se ganan al terminar una ficha, al
  // abrir una puerta de región y con la racha, y SOLO se pueden regalar
  // a un compañero del equipo. Las que te regalan, esas sí las usas.
  const CARTAS = {
    pista: { nombre: "Pista", desc: "Muestra una ayuda antes de responder." },
    segunda: { nombre: "Segunda oportunidad", desc: "El primer fallo de la ronda no cuenta: vuelves a intentarlo." },
    lupa: { nombre: "Lupa", desc: "Agranda la pregunta y la lee en voz alta." },
    hada: { nombre: "Tiempo de hada", desc: "Para el viento 10 segundos." },
    doble: { nombre: "Doble gema", desc: "Duplica las gemas del premio de hoy." },
    llave: { nombre: "Llave dorada", desc: "Abre un cofre pequeño: +10 XP." },
  };
  const TIPOS_CARTA = Object.keys(CARTAS);

  // Poder propio de cada clase: una vez por región.
  const PODERES = {
    maga: { nombre: "Trazo mágico", desc: "Tu maestro duplicará las gemas de «buena letra» de la próxima ficha." },
    explo: { nombre: "Brújula", desc: "Descarta una opción incorrecta en una pregunta." },
    guard: { nombre: "Escudo", desc: "Si un día no juegas, tu racha no se rompe (se activa solo)." },
    bardo: { nombre: "Eco", desc: "Una ronda con audio sin límite." },
  };

  const ESCUCHAS_POR_RONDA = 3; // Dragón y Grifo; el Unicornio, siempre sin límite
  const XP_LLAVE = 10;
  const XP_GUARDIAN = 15;
  const RACHA_COFRE = 3; // cada 3 sesiones seguidas, un cofre (una carta)
  const ESENCIA_PUERTA = 20; // por defecto; el maestro lo cambia en Ajustes

  // Cámara del Tesoro (apartado 7): se abre en la fecha que fija el
  // maestro, se llegue o no al umbral; con menos gemas, menos piezas.
  const PIEZAS_TESORO = 5;
  function piezasTesoro(alianza, umbral) {
    const u = Math.max(1, umbral || 600);
    return Math.max(1, Math.min(PIEZAS_TESORO, Math.floor((PIEZAS_TESORO * (alianza || 0)) / u)));
  }
  // fecha "AAAA-MM-DD"; se compara con el día local del dispositivo.
  function tesoroAbierto(fecha, ahora) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha || "")) return false;
    const d = ahora || new Date();
    const hoy = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    return hoy >= fecha;
  }

  function regionDe(ficha) {
    const f = Math.min(Math.max(ficha || 1, 1), TOTAL_FICHAS);
    return REGIONES.findIndex((r) => f >= r.desde && f <= r.hasta);
  }

  function contenidoDe(ficha, senda) {
    const ri = regionDe(ficha);
    const r = REGIONES[ri];
    return (r.c[senda] || r.c.dragon)[Math.min(ficha, TOTAL_FICHAS) - r.desde];
  }

  function claseDe(retrato) {
    return CLASES.find((c) => String(retrato || "").indexOf(c.id) === 0) || CLASES[0];
  }

  function nivel(xp) {
    return 1 + Math.floor((xp || 0) / 100);
  }

  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // Ilustración que todavía no está en img/ (faltan algunas): se deja el
  // hueco en vez de enseñar el icono de imagen rota.
  function srcImg(nombre) {
    return "img/" + nombre + ".webp";
  }

  document.addEventListener(
    "error",
    (e) => {
      const el = e.target;
      if (el && el.tagName === "IMG" && el.src.indexOf("/img/") !== -1) {
        el.classList.add("falta");
        const card = el.closest(".pcard");
        if (card && !card.classList.contains("falta")) {
          card.classList.add("falta");
          card.insertAdjacentHTML("beforeend", "<span>Retrato pendiente</span>");
        }
      }
    },
    true
  );

  const gemaSVG =
    '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2h8l3 4-7 8-7-8z" fill="#5fd3c4" stroke="#bff0e8" stroke-width="1"/><path d="M1 6h14M6 2l2 4 2-4M8 6v8" stroke="#bff0e8" stroke-width=".8" fill="none"/></svg>';

  window.Letrania = {
    CLASES,
    RETRATOS,
    ESTANDARTES,
    SENDAS,
    REGIONES,
    TOTAL_FICHAS,
    CRITERIOS,
    MINUTOS_POR_DEFECTO,
    CARTAS,
    TIPOS_CARTA,
    PODERES,
    ESCUCHAS_POR_RONDA,
    XP_LLAVE,
    XP_GUARDIAN,
    RACHA_COFRE,
    ESENCIA_PUERTA,
    PIEZAS_TESORO,
    piezasTesoro,
    tesoroAbierto,
    regionDe,
    contenidoDe,
    claseDe,
    nivel,
    esc,
    srcImg,
    gemaSVG,
  };
})();
