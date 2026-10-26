// ============================================================
// Ángulos (5º T1 bloque 1: el grado, el transportador y la
// clasificación; complementarios y suplementarios como contenido
// de 6º / ampliación)
// - Explora: abrir un ángulo sobre el transportador, los ángulos del
//   reloj y complementario y suplementario. No guarda progreso.
// - Práctica: los ángulos se generan al azar (en cualquier posición)
//   y cada pregunta trae su pista y su explicación. Solo la práctica
//   llama a AppProgress.
// ============================================================

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function uniqueOptions(correct, candidates, count = 4) {
  const out = [correct];
  for (const c of candidates) {
    if (out.length >= count) break;
    if (c !== undefined && c !== null && c !== "" && !out.includes(c)) out.push(c);
  }
  return out;
}

function tipoAngulo(g) {
  if (g === 0) return "Nulo";
  if (g < 90) return "Agudo";
  if (g === 90) return "Recto";
  if (g < 180) return "Obtuso";
  if (g === 180) return "Llano";
  if (g < 360) return "Cóncavo";
  return "Completo";
}

const POR_QUE = {
  Agudo: "mide menos de 90°: está más cerrado que la esquina de un folio",
  Recto: "mide exactamente 90°: es como la esquina de un folio",
  Obtuso: "mide más de 90° y menos de 180°: está más abierto que una esquina",
  Llano: "mide 180°: los dos lados forman una línea recta",
  Completo: "mide 360°: es una vuelta entera",
  Cóncavo: "mide más de 180° y menos de 360°",
};

// ------------------------------------------------------------
// Dibujo
// ------------------------------------------------------------
const rad = (g) => (g * Math.PI) / 180;

// Ángulo de `g` grados con vértice en (cx, cy); el primer lado forma
// `giro` grados con la horizontal. Con `transp`, el transportador.
function svgAngulo(g, { giro = 0, transp = false, etiqueta = null, size = 240 } = {}) {
  const cx = size / 2;
  const cy = transp ? size * 0.72 : size / 2;
  const L = size * (transp ? 0.44 : 0.4);
  const P = (ang, r) => [cx + r * Math.cos(rad(ang)), cy - r * Math.sin(rad(ang))];
  let out = "";
  if (transp) {
    const R = L * 0.95;
    out += `<path d="M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy} Z" fill="var(--color-teal-tint)" fill-opacity="0.6" stroke="var(--color-teal)" stroke-width="1.5"/>`;
    for (let a = 0; a <= 180; a += 5) {
      const largo = a % 10 === 0 ? 10 : 5;
      const [x1, y1] = P(a, R);
      const [x2, y2] = P(a, R - largo);
      out += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--color-teal)" stroke-width="${a % 10 === 0 ? 1.4 : 0.8}"/>`;
      if (a % 30 === 0) {
        // Escala exterior (de 0 a 180 en sentido contrario a las agujas) e interior (al revés).
        const [tx, ty] = P(a, R - 20);
        out += `<text x="${tx.toFixed(1)}" y="${(ty + 4).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="700" fill="var(--text)">${a}</text>`;
        const [ix, iy] = P(a, R - 34);
        out += `<text x="${ix.toFixed(1)}" y="${(iy + 4).toFixed(1)}" text-anchor="middle" font-size="9" fill="var(--text-muted)">${180 - a}</text>`;
      }
    }
  }
  const [ax, ay] = P(giro, L);
  const [bx, by] = P(giro + g, L);
  // Arco de la abertura.
  const r = 26;
  if (g > 0 && g < 360) {
    const [sx, sy] = P(giro, r);
    const [ex, ey] = P(giro + g, r);
    if (g === 90) {
      const s = 16;
      const [p1x, p1y] = P(giro, s);
      const [p3x, p3y] = P(giro + 90, s);
      const p2x = p1x + (p3x - cx);
      const p2y = p1y + (p3y - cy);
      out += `<path d="M ${p1x.toFixed(1)} ${p1y.toFixed(1)} L ${p2x.toFixed(1)} ${p2y.toFixed(1)} L ${p3x.toFixed(1)} ${p3y.toFixed(1)}" fill="none" stroke="var(--color-plum)" stroke-width="3"/>`;
    } else {
      out += `<path d="M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${r} ${r} 0 ${g > 180 ? 1 : 0} 0 ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="var(--color-plum)" stroke-width="3"/>`;
    }
  } else if (g === 360) {
    out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--color-plum)" stroke-width="3" stroke-dasharray="5 4"/>`;
  }
  out += `<line x1="${cx}" y1="${cy}" x2="${ax.toFixed(1)}" y2="${ay.toFixed(1)}" stroke="var(--text)" stroke-width="4" stroke-linecap="round"/>`;
  if (g !== 360 && g !== 0) out += `<line x1="${cx}" y1="${cy}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="var(--color-indigo)" stroke-width="4" stroke-linecap="round"/>`;
  out += `<circle cx="${cx}" cy="${cy}" r="5" fill="var(--text)"/>`;
  if (etiqueta) out += `<text x="${cx}" y="${size - 6}" text-anchor="middle" font-size="16" font-weight="800" fill="var(--text)">${etiqueta}</text>`;
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" style="max-width:100%" role="img" aria-label="Ángulo${etiqueta ? ` de ${etiqueta}` : ""}">${out}</svg>`;
}

// Un recto o un llano partido en dos ángulos: c y el que le falta.
function svgPartido(total, c, size = 170) {
  const cx = size / 2;
  const cy = total === 90 ? size * 0.78 : size * 0.62;
  const ox = total === 90 ? size * 0.22 : cx;
  const L = size * (total === 90 ? 0.62 : 0.42);
  const P = (ang, r) => [ox + r * Math.cos(rad(ang)), cy - r * Math.sin(rad(ang))];
  const arco = (a1, a2, r, color) => {
    const [sx, sy] = P(a1, r);
    const [ex, ey] = P(a2, r);
    return `<path d="M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${r} ${r} 0 0 0 ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="${color}" stroke-width="4"/>`;
  };
  const ray = (a, color) => {
    const [x, y] = P(a, L);
    return `<line x1="${ox}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>`;
  };
  let out = arco(0, c, 26, "var(--color-indigo)") + arco(c, total, 34, "var(--color-amber)");
  out += ray(0, "var(--text)") + ray(total, "var(--text)") + ray(c, "var(--color-indigo)");
  out += `<circle cx="${ox}" cy="${cy}" r="4" fill="var(--text)"/>`;
  out += `<text x="${cx}" y="${size - 6}" text-anchor="middle" font-size="13" font-weight="800" fill="var(--text)"><tspan fill="var(--color-indigo)">${c}°</tspan> + <tspan fill="var(--color-amber)">${total - c}°</tspan> = ${total}°</text>`;
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" style="max-width:100%" role="img" aria-label="${c}° más ${total - c}° son ${total}°">${out}</svg>`;
}

// Reloj con las dos agujas a una hora en punto (o y media).
function svgReloj(h, m) {
  const S = 200;
  const c = S / 2;
  const R = 84;
  let out = `<circle cx="${c}" cy="${c}" r="${R}" fill="var(--surface)" stroke="var(--text)" stroke-width="3"/>`;
  for (let i = 1; i <= 12; i++) {
    const a = rad(90 - i * 30);
    out += `<text x="${(c + (R - 16) * Math.cos(a)).toFixed(1)}" y="${(c - (R - 16) * Math.sin(a) + 5).toFixed(1)}" text-anchor="middle" font-size="13" font-weight="700" fill="var(--text)">${i}</text>`;
  }
  const aH = rad(90 - (h % 12) * 30 - m / 2);
  const aM = rad(90 - m * 6);
  out += `<line x1="${c}" y1="${c}" x2="${(c + 45 * Math.cos(aH)).toFixed(1)}" y2="${(c - 45 * Math.sin(aH)).toFixed(1)}" stroke="var(--text)" stroke-width="6" stroke-linecap="round"/>`;
  out += `<line x1="${c}" y1="${c}" x2="${(c + 68 * Math.cos(aM)).toFixed(1)}" y2="${(c - 68 * Math.sin(aM)).toFixed(1)}" stroke="var(--color-indigo)" stroke-width="4" stroke-linecap="round"/>`;
  out += `<circle cx="${c}" cy="${c}" r="5" fill="var(--text)"/>`;
  return `<svg viewBox="0 0 ${S} ${S}" width="${S}" style="max-width:100%" role="img" aria-label="Reloj">${out}</svg>`;
}

// Ángulo menor entre las agujas.
function anguloReloj(h, m) {
  const d = Math.abs(((h % 12) * 30 + m / 2) - m * 6);
  return Math.min(d, 360 - d);
}

// ------------------------------------------------------------
// Niveles
// ------------------------------------------------------------
const LEVELS = {
  normal: { paso: 5, margen: 10, tipos: ["Agudo", "Recto", "Obtuso", "Llano", "Completo"] },
  facil: { paso: 10, margen: 20, tipos: ["Agudo", "Recto", "Obtuso", "Llano"] },
  acs: { paso: 15, margen: 30, tipos: ["Agudo", "Recto", "Obtuso"] },
  altas: { paso: 1, margen: 4, tipos: ["Agudo", "Recto", "Obtuso", "Llano", "Completo"] },
};

// Un ángulo del tipo pedido, lejos del límite según el nivel.
function anguloDeTipo(tipo, L) {
  const m = L.margen;
  const multiplo = (a, b) => L.paso * randInt(Math.ceil(a / L.paso), Math.floor(b / L.paso));
  if (tipo === "Agudo") return multiplo(Math.max(L.paso, 10), 90 - m);
  if (tipo === "Obtuso") return multiplo(90 + m, 180 - m);
  return { Recto: 90, Llano: 180, Completo: 360 }[tipo];
}

// ------------------------------------------------------------
// Generadores
// ------------------------------------------------------------
function genClasificar(L) {
  // Más agudos y obtusos que rectos, llanos y completos.
  const tipo = Math.random() < 0.65 ? pick(["Agudo", "Obtuso"]) : pick(L.tipos);
  const g = anguloDeTipo(tipo, L);
  const giro = L === LEVELS.acs ? 0 : randInt(0, 359);
  return {
    instruction: "¿Qué tipo de ángulo es?",
    display: `${g}°`,
    visual: svgAngulo(g, { giro }),
    soloVisual: true,
    options: L.tipos.slice(),
    keepOrder: true,
    correct: tipo,
    hint: "Compáralo con la esquina de un folio (90°): ¿es más cerrado, igual o más abierto? ¿Forma una línea recta (180°)?",
    explain: `Mide ${g}°: es ${tipo.toLowerCase()}, porque ${POR_QUE[tipo]}.${giro && tipo !== "Completo" ? " Fíjate en que el tipo no depende de cómo esté girado el ángulo." : ""}`,
  };
}

function genMedir(L) {
  const g = L.paso * randInt(Math.ceil(10 / L.paso), Math.floor(170 / L.paso));
  const correct = `${g}°`;
  // Error típico: leer la otra escala del transportador (180 − g).
  const cands = [180 - g, g + 10, g - 10, g + L.paso * 2, g + 5].filter((x) => x > 0 && x < 180 && x !== g).map((x) => `${x}°`);
  return {
    instruction: "¿Cuánto mide el ángulo? Usa el transportador.",
    display: correct,
    visual: svgAngulo(g, { transp: true }),
    soloVisual: true,
    options: uniqueOptions(correct, cands),
    correct,
    hint: "Un lado está en el 0 de la escala de fuera. Lee en esa misma escala donde corta el otro lado.",
    explain: `El lado negro está en el 0 de la escala exterior, así que se lee esa escala: ${g}°.${180 - g !== g ? ` Si se lee la escala de dentro sale ${180 - g}°: es el error más frecuente al usar el transportador.` : ""}`,
  };
}

function genEstimar(L) {
  const opciones = L === LEVELS.acs ? [30, 90, 150] : [20, 45, 90, 135, 170];
  const g0 = pick(opciones);
  const g = L === LEVELS.altas ? g0 + randInt(-4, 4) : g0;
  const giro = randInt(0, 359);
  return {
    instruction: L === LEVELS.altas ? "¿Cuánto mide, aproximadamente?" : "¿Cuánto mide, más o menos?",
    display: `${g}°`,
    visual: svgAngulo(g, { giro }),
    soloVisual: true,
    options: opciones.map((x) => `${x}°`),
    keepOrder: true,
    correct: `${g0}°`,
    hint: "Usa como referencia el ángulo recto (90°) y la línea recta (180°). La mitad de un recto son 45°.",
    explain: `Mide ${g === g0 ? `${g}°` : `unos ${g0}° (en realidad, ${g}°)`}: es un ángulo ${tipoAngulo(g).toLowerCase()}. ${g0 < 90 ? `Es más cerrado que un recto${g0 <= 45 ? ", como mucho la mitad de un recto" : ""}.` : g0 === 90 ? "Forma una esquina como la de un folio." : g0 < 180 ? "Es más abierto que un recto." : "Es casi una línea recta."}`,
  };
}

function genReloj(L) {
  const m = L === LEVELS.altas && Math.random() < 0.5 ? 30 : 0;
  // A las 12 en punto las agujas están juntas (0°): no se pregunta.
  const h = m ? randInt(1, 12) : randInt(1, 11);
  const g = anguloReloj(h, m);
  const correct = `${g}°`;
  const hora = `${h === 1 ? "la una" : `las ${h}`}${m ? " y media" : " en punto"}`;
  return {
    instruction: `Son ${hora}. ¿Qué ángulo forman las agujas?`,
    display: `${h}:${m ? "30" : "00"}`,
    visual: svgReloj(h, m),
    soloVisual: true,
    options: uniqueOptions(correct, [g + 30, g - 30, 360 - g, g + 15, h * 10].filter((x) => x > 0 && x <= 360 && x !== g).map((x) => `${x}°`)),
    correct,
    hint: "Entre dos números seguidos del reloj hay 30°, porque 360° ÷ 12 = 30°.",
    explain: m
      ? `A las ${h}:30 la aguja larga está en el 6 y la corta, a mitad de camino entre el ${h} y el ${h % 12 + 1}. Entre ellas hay ${g}° (cada hora son 30° y media hora, 15°).`
      : `Entre las agujas hay ${Math.min(h % 12, 12 - (h % 12))} ${Math.min(h % 12, 12 - (h % 12)) === 1 ? "espacio" : "espacios"} de 30°: ${Math.min(h % 12, 12 - (h % 12))} × 30° = ${g}°. Es un ángulo ${tipoAngulo(g).toLowerCase()}.`,
  };
}

function genGiros(L) {
  const giros = [
    ["un cuarto de vuelta", 90],
    ["media vuelta", 180],
    ["tres cuartos de vuelta", 270],
    ["una vuelta entera", 360],
  ];
  const [txt, g] = pick(L === LEVELS.acs ? giros.filter(([, x]) => x !== 270) : giros);
  const quien = pick(["Una peonza gira", "Una noria da", "El brazo de una grúa gira", "Un patinador da"]);
  return {
    instruction: "¿Cuántos grados son?",
    display: `${quien} ${txt}.`,
    options: uniqueOptions(`${g}°`, ["90°", "180°", "270°", "360°", "45°"]),
    correct: `${g}°`,
    hint: "Una vuelta entera son 360°. Media vuelta es la mitad y un cuarto de vuelta, la cuarta parte.",
    explain: g === 360 ? "Una vuelta entera son 360°." : `${txt[0].toUpperCase()}${txt.slice(1)} = ${g === 90 ? "360° ÷ 4" : g === 180 ? "360° ÷ 2" : "3 × 90°"} = ${g}°.`,
  };
}

// 6º / ampliación: complementario y suplementario.
function genRelaciones(L) {
  const suple = Math.random() < 0.5;
  const tot = suple ? 180 : 90;
  const paso = L === LEVELS.altas ? 1 : 5;
  const g = paso * randInt(Math.ceil(10 / paso), Math.floor((tot - 10) / paso));
  const r = tot - g;
  return {
    instruction: `¿Cuál es el ${suple ? "suplementario" : "complementario"} de este ángulo?`,
    display: `${g}°`,
    options: uniqueOptions(`${r}°`, [suple ? 90 - g : 180 - g, r + 10, r - 10, g].filter((x) => x > 0).map((x) => `${x}°`)),
    correct: `${r}°`,
    hint: suple ? "Dos ángulos suplementarios suman 180° (un llano)." : "Dos ángulos complementarios suman 90° (un recto).",
    explain: `${tot}° − ${g}° = ${r}°, porque ${suple ? "los suplementarios suman 180°" : "los complementarios suman 90°"}: ${g}° + ${r}° = ${tot}°.`,
  };
}

const MODE_GROUPS = {
  clasificar: [genClasificar],
  medir: [genMedir],
  estimar: [genEstimar],
  reloj: [genReloj, genGiros],
  relaciones: [genRelaciones],
};

const ACS_GENERATORS = [genClasificar, genClasificar, genEstimar, genGiros];

const ANGULOS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Agudo, recto y obtuso, y giros (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabajan los tres tipos de ángulo más fáciles de distinguir a simple vista, estimar si un ángulo es pequeño o grande y los giros (cuarto de vuelta, media vuelta, vuelta entera).",
    example: "Agudo: más cerrado que una esquina · Recto: como la esquina de un folio · Obtuso: más abierto",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantienen los mismos ángulos, pero con una tipografía más legible para leer la pregunta y las opciones.",
    example: "45° → Agudo → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Clasificar» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todos los contenidos, con medidas redondas y la pista a la vista",
    text: "Se trabajan todos los modos con ángulos que son múltiplos de 10°, lejos del límite entre un tipo y otro, y la pista abierta desde el principio. Sin «Mezcla». En Explora se puede abrir el ángulo sobre el transportador.",
    example: "70° → Pista: compáralo con la esquina de un folio",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Medir al grado, ángulos cerca del límite y el reloj y media",
    text: "Empieza en <strong>Medir</strong>, con ángulos de cualquier medida, ángulos muy cerca de 90° y 180° al clasificar, el reloj a las «y media» y complementarios y suplementarios.",
    example: "A las 3:30 las agujas forman 75°",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Qué tipo de ángulo es? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, ANGULOS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), ANGULOS_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("an-abrir")) initExplore();
  if (document.getElementById("word-display")) initGame(diff, (fn) => restartCallbacks.push(fn));
});

function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = {
    teoria: document.getElementById("tab-teoria"),
    explora: document.getElementById("tab-explora"),
    practica: document.getElementById("tab-practica"),
  };
  if (tabBtns.length === 0) return;

  function activateTab(name) {
    tabBtns.forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
    Object.entries(panels).forEach(([key, el]) => el && el.classList.toggle("active", key === name));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  tabBtns.forEach((btn) => btn.addEventListener("click", () => activateTab(btn.dataset.tab)));

  ["go-to-practice", "go-to-practice-2"].forEach((id) => {
    const goBtn = document.getElementById(id);
    if (goBtn) goBtn.addEventListener("click", () => activateTab("practica"));
  });
}

// ============================================================
// EXPLORA
// ============================================================
function initExplore() {
  // 1. Abrir el ángulo sobre el transportador.
  let g = 50;
  function renderAbrir() {
    document.getElementById("an-abrir-g").textContent = `${g}°`;
    document.getElementById("an-abrir-draw").innerHTML = svgAngulo(g, { transp: g <= 180 });
    const t = tipoAngulo(g);
    document.getElementById("an-abrir-msg").innerHTML =
      g === 0
        ? "Los dos lados están juntos: el ángulo mide 0°."
        : `<strong>${g}°: ángulo ${t.toLowerCase()}</strong>. ${POR_QUE[t][0].toUpperCase()}${POR_QUE[t].slice(1)}.${g <= 180 ? ` En el transportador se lee en la escala de fuera, la que empieza en 0 en el lado negro (la de dentro marcaría ${180 - g}).` : ""}`;
  }
  document.querySelectorAll("[data-an-abrir]").forEach((b) =>
    b.addEventListener("click", () => {
      g = Math.max(0, Math.min(360, g + Number(b.dataset.anAbrir)));
      renderAbrir();
    })
  );

  // 2. El reloj.
  let h = 3;
  function renderReloj() {
    document.getElementById("an-reloj-h").textContent = `${h}:00`;
    document.getElementById("an-reloj-draw").innerHTML = svgReloj(h, 0);
    const n = Math.min(h % 12, 12 - (h % 12));
    const ang = anguloReloj(h, 0);
    document.getElementById("an-reloj-msg").innerHTML =
      ang === 0
        ? "A las 12 las dos agujas están juntas: 0°."
        : `Entre las agujas hay ${n} ${n === 1 ? "hora" : "horas"} de 30° cada una: <strong>${n} × 30° = ${ang}°</strong>, un ángulo ${tipoAngulo(ang).toLowerCase()}.`;
  }
  document.querySelectorAll("[data-an-reloj]").forEach((b) =>
    b.addEventListener("click", () => {
      h = ((h - 1 + Number(b.dataset.anReloj) + 12) % 12) + 1;
      renderReloj();
    })
  );

  // 3. Complementario y suplementario.
  let c = 35;
  function renderRel() {
    document.getElementById("an-rel-g").textContent = `${c}°`;
    document.getElementById("an-rel-comp").innerHTML = c < 90 ? svgPartido(90, c) : "";
    document.getElementById("an-rel-sup").innerHTML = svgPartido(180, c);
    document.getElementById("an-rel-msg").innerHTML =
      (c < 90 ? `Complementario de ${c}°: <strong>${90 - c}°</strong> (juntos forman un recto). ` : `${c}° no tiene complementario: ya mide 90° o más. `) +
      `Suplementario: <strong>${180 - c}°</strong> (juntos forman un llano).`;
  }
  document.querySelectorAll("[data-an-rel]").forEach((b) =>
    b.addEventListener("click", () => {
      c = Math.max(5, Math.min(175, c + Number(b.dataset.anRel)));
      renderRel();
    })
  );

  renderAbrir();
  renderReloj();
  renderRel();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-angulos"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    gameVisual: document.getElementById("game-visual"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    hintBtn: document.getElementById("hint-btn"),
    hintBox: document.getElementById("hint-box"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "clasificar";
  let current;
  let lastKey = "";

  function level() {
    if (diff.is("acs")) return LEVELS.acs;
    if (diff.is("discalculia")) return LEVELS.facil;
    if (diff.is("altas")) return LEVELS.altas;
    return LEVELS.normal;
  }

  function setActiveMode(m) {
    mode = m;
    els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === m));
  }

  function applyDifficultyUI() {
    const acs = diff.is("acs");
    els.modeBtns.forEach((b) => {
      b.disabled = acs || (b.dataset.mode === "mezcla" && (diff.is("tdah") || diff.is("discalculia")));
    });

    if (diff.is("altas")) setActiveMode("medir");
    else if (acs) setActiveMode("clasificar");
    else if ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla") setActiveMode("clasificar");

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function generatorsFor() {
    if (diff.is("acs")) return ACS_GENERATORS;
    if (mode === "mezcla") return MODE_GROUPS[pick(Object.keys(MODE_GROUPS))];
    return MODE_GROUPS[mode];
  }

  function pickQuestion() {
    let q;
    let tries = 0;
    do {
      q = pick(generatorsFor())(level());
      tries++;
    } while (q.instruction + q.display === lastKey && tries < 10);
    lastKey = q.instruction + q.display;
    return q;
  }

  function showHint() {
    els.hintBox.innerHTML = `<strong>Pista:</strong> ${current.hint}`;
    els.hintBox.classList.add("show");
  }

  function startRound() {
    current = pickQuestion();

    els.instructions.textContent = current.instruction;
    // En los dibujos no se escribe la medida: hay que mirarla (o medirla).
    els.wordDisplay.textContent = current.soloVisual ? "" : current.display;
    els.wordDisplay.style.display = current.soloVisual ? "none" : "";
    els.gameVisual.style.display = current.visual ? "" : "none";
    els.gameVisual.innerHTML = current.visual || "";

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";
    els.hintBox.classList.remove("show");
    els.hintBox.innerHTML = "";
    els.hintBtn.disabled = false;
    if (diff.is("discalculia")) showHint();

    const options = current.keepOrder ? current.options : shuffle(current.options);
    els.answerButtons.innerHTML = "";
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "syllable-chip";
      btn.textContent = opt;
      btn.addEventListener("click", () => chooseAnswer(opt, btn));
      els.answerButtons.appendChild(btn);
    });
  }

  function chooseAnswer(chosen, btn) {
    const correct = current.correct;
    const isCorrect = chosen === correct;

    if (isCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("angulos", isCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.answerButtons.querySelectorAll(".syllable-chip").forEach((b) => {
      b.disabled = true;
      if (b.textContent === correct) b.classList.add("correct");
      else if (b === btn && !isCorrect) b.classList.add("incorrect");
    });
    els.hintBtn.disabled = true;

    els.feedback.classList.add("show", isCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `<p class="feedback-title">${isCorrect ? "Correcto" : `No era esa: la respuesta es ${correct}`}</p><p>${current.explain}</p>`;

    els.nextBtn.style.display = "";
  }

  els.modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveMode(btn.dataset.mode);
      startRound();
    });
  });

  els.hintBtn.addEventListener("click", showHint);
  els.nextBtn.addEventListener("click", startRound);

  applyDifficultyUI();
  startRound();
}
