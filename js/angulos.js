// ============================================================
// Ángulos (5º, libro: clasificación según su amplitud y su posición
// y cálculo de ángulos en triángulos y cuadriláteros; complementarios
// y suplementarios como contenido de 6º / ampliación)
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

// ------------------------------------------------------------
// 5º: ángulos según su posición
// ------------------------------------------------------------
// Dos ángulos marcados (arcos de colores). tipo: consecutivos,
// adyacentes u opuestos (por el vértice). Devuelve el SVG.
function svgPosicion(tipo, a, b, giro = 0, etiquetas = ["", ""]) {
  const S = 220;
  const c = S / 2;
  const L = 92;
  // Se recoge lo dibujado para recortar el viewBox a su tamaño.
  const usados = [[c, c]];
  const P = (ang, r) => {
    const q = [c + r * Math.cos(rad(ang)), c - r * Math.sin(rad(ang))];
    usados.push(q);
    return q;
  };
  const rayo = (ang, color = "var(--text)") => {
    const [x, y] = P(ang, L);
    return `<line x1="${c}" y1="${c}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>`;
  };
  const arco = (a1, a2, r, color, txt) => {
    const [sx, sy] = P(a1, r);
    const [ex, ey] = P(a2, r);
    const [tx, ty] = P((a1 + a2) / 2, r + 18);
    return `<path class="an-arco" data-desde="${a1}" data-hasta="${a2}" d="M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="${color}" stroke-width="4"/>` +
      (txt ? `<text x="${tx.toFixed(1)}" y="${(ty + 5).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="800" fill="${color}" stroke="var(--surface)" stroke-width="3" paint-order="stroke">${txt}</text>` : "");
  };
  let out = "";
  if (tipo === "opuestos") {
    // Dos rectas que se cortan; se marcan los ángulos opuestos.
    out += rayo(giro) + rayo(giro + a) + rayo(giro + 180) + rayo(giro + 180 + a);
    out += arco(giro, giro + a, 30, "var(--color-indigo)", etiquetas[0]) + arco(giro + 180, giro + 180 + a, 30, "var(--color-amber)", etiquetas[1]);
  } else {
    // Consecutivos: comparten el vértice y un lado. Adyacentes: además,
    // los lados no comunes forman una recta (a + b = 180).
    out += rayo(giro) + rayo(giro + a, "var(--color-plum)") + rayo(giro + a + b);
    out += arco(giro, giro + a, 30, "var(--color-indigo)", etiquetas[0]) + arco(giro + a, giro + a + b, 40, "var(--color-amber)", etiquetas[1]);
  }
  out += `<circle cx="${c}" cy="${c}" r="5" fill="var(--text)"/>`;
  const m = 18;
  const x0 = Math.max(0, Math.min(...usados.map((q) => q[0])) - m);
  const y0 = Math.max(0, Math.min(...usados.map((q) => q[1])) - m);
  const x1 = Math.min(S, Math.max(...usados.map((q) => q[0])) + m);
  const y1 = Math.min(S, Math.max(...usados.map((q) => q[1])) + m);
  return `<svg viewBox="${x0.toFixed(0)} ${y0.toFixed(0)} ${(x1 - x0).toFixed(0)} ${(y1 - y0).toFixed(0)}" width="${(x1 - x0).toFixed(0)}" style="max-width:100%" role="img" aria-label="Dos ángulos ${tipo === "opuestos" ? "opuestos por el vértice" : tipo}">${out}</svg>`;
}

const POSICIONES = ["Consecutivos", "Adyacentes", "Opuestos por el vértice"];

function genPosicion(L) {
  const tipo = pick(["consecutivos", "adyacentes", "opuestos"]);
  const paso = L === LEVELS.altas ? 5 : 10;
  const giro = L === LEVELS.acs ? 0 : paso * randInt(0, 35);
  let a = paso * randInt(Math.ceil(30 / paso), Math.floor(130 / paso));
  let b;
  if (tipo === "adyacentes") b = 180 - a;
  else if (tipo === "consecutivos") {
    do b = paso * randInt(Math.ceil(30 / paso), Math.floor(120 / paso));
    while (Math.abs(a + b - 180) < 25 || a + b > 230);
  } else b = a;
  // A veces se pide calcular el otro ángulo (adyacentes u opuestos).
  if (tipo !== "consecutivos" && Math.random() < 0.5) {
    const otro = tipo === "adyacentes" ? 180 - a : a;
    return {
      instruction: `Estos ángulos son ${tipo === "adyacentes" ? "adyacentes" : "opuestos por el vértice"}. ¿Cuánto mide el ángulo naranja?`,
      display: `El azul mide ${a}°.`,
      visual: svgPosicion(tipo, a, b, giro, [`${a}°`, "?"]),
      options: uniqueOptions(`${otro}°`, [tipo === "adyacentes" ? a : 180 - a, 90 - a > 0 ? 90 - a : 360 - a, otro + 10, otro - 10].filter((x) => x > 0).map((x) => `${x}°`)),
      correct: `${otro}°`,
      hint: tipo === "adyacentes" ? "Los dos ángulos adyacentes juntos forman una línea recta: un llano, 180°." : "Los ángulos opuestos por el vértice miden lo mismo.",
      explain: tipo === "adyacentes" ? `Juntos forman un ángulo llano: 180° − ${a}° = ${180 - a}°.` : `Los ángulos opuestos por el vértice son iguales: el naranja también mide ${a}°.`,
    };
  }
  const correct = { consecutivos: "Consecutivos", adyacentes: "Adyacentes", opuestos: "Opuestos por el vértice" }[tipo];
  return {
    instruction: "¿Cómo son estos dos ángulos según su posición?",
    display: correct,
    visual: svgPosicion(tipo, a, b, giro),
    soloVisual: true,
    options: POSICIONES,
    keepOrder: true,
    correct,
    hint: "¿Comparten un lado? Si además los otros dos lados forman una línea recta, son adyacentes. Si los forman dos rectas que se cortan y están uno enfrente del otro, son opuestos por el vértice.",
    explain: {
      consecutivos: "Tienen el mismo vértice y un lado en común (el morado), pero los otros dos lados no forman una línea recta: son consecutivos.",
      adyacentes: `Tienen un lado en común y los otros dos forman una línea recta: son adyacentes (${a}° + ${b}° = 180°). Los adyacentes también son consecutivos, pero «adyacentes» dice más.`,
      opuestos: "Los forman dos rectas que se cortan y están uno enfrente del otro, sin lados en común: son opuestos por el vértice y miden lo mismo.",
    }[tipo],
  };
}

// ------------------------------------------------------------
// 5º: ángulos de triángulos y cuadriláteros
// ------------------------------------------------------------
// Intersección de dos rectas p + t·u y q + s·v.
function corte(p, u, q, v) {
  const det = u[0] * v[1] - u[1] * v[0];
  if (Math.abs(det) < 1e-9) return null;
  const t = ((q[0] - p[0]) * v[1] - (q[1] - p[1]) * v[0]) / det;
  const s2 = ((q[0] - p[0]) * u[1] - (q[1] - p[1]) * u[0]) / det;
  return t > 0 && s2 > 0 ? [p[0] + t * u[0], p[1] + t * u[1]] : null;
}
const dir = (g) => [Math.cos(rad(g)), Math.sin(rad(g))];

// Vértices (en sentido contrario a las agujas) de un polígono con esos
// ángulos interiores: triángulo (3) o cuadrilátero convexo (4).
function verticesDe(angs) {
  const A = [0, 0];
  const B = [1, 0];
  if (angs.length === 3) {
    const C = corte(A, dir(angs[0]), B, dir(180 - angs[1]));
    return C ? [A, B, C] : null;
  }
  for (let k = 0; k < 40; k++) {
    // D sobre el lado que sale de A; C donde se cortan el lado que sale de
    // B y el que sale de D con el ángulo pedido en D.
    const p = 0.5 + Math.random();
    const D = [p * Math.cos(rad(angs[0])), p * Math.sin(rad(angs[0]))];
    const dirDC = 180 + angs[0] + angs[3];
    const C = corte(B, dir(180 - angs[1]), D, dir(dirDC));
    if (!C) continue;
    const lados = [[A, B], [B, C], [C, D], [D, A]].map(([u, v]) => Math.hypot(v[0] - u[0], v[1] - u[1]));
    if (Math.min(...lados) / Math.max(...lados) < 0.35) continue;
    return [A, B, C, D];
  }
  return null;
}

// Polígono con sus ángulos: los conocidos con su medida y uno con «?».
function svgPoligono(vs, etiquetas) {
  const W = 260;
  const H = 210;
  const xs = vs.map((v) => v[0]);
  const ys = vs.map((v) => v[1]);
  const esc = Math.min((W - 60) / (Math.max(...xs) - Math.min(...xs)), (H - 50) / (Math.max(...ys) - Math.min(...ys)));
  const pt = (v) => [30 + (v[0] - Math.min(...xs)) * esc, H - 25 - (v[1] - Math.min(...ys)) * esc];
  const ps = vs.map(pt);
  let out = `<polygon points="${ps.map((p) => p.map((x) => x.toFixed(1)).join(",")).join(" ")}" fill="var(--color-indigo-tint)" stroke="var(--color-indigo)" stroke-width="3"/>`;
  ps.forEach((p, i) => {
    const prev = ps[(i + ps.length - 1) % ps.length];
    const next = ps[(i + 1) % ps.length];
    const u = [prev[0] - p[0], prev[1] - p[1]];
    const v = [next[0] - p[0], next[1] - p[1]];
    const nu = Math.hypot(...u);
    const nv = Math.hypot(...v);
    const bis = [u[0] / nu + v[0] / nv, u[1] / nu + v[1] / nv];
    const nb = Math.hypot(...bis) || 1;
    const r = 18;
    const a1 = [p[0] + (u[0] / nu) * r, p[1] + (u[1] / nu) * r];
    const a2 = [p[0] + (v[0] / nv) * r, p[1] + (v[1] / nv) * r];
    // El arco va por dentro: el giro corto de u a v (en pantalla, la y va hacia abajo).
    const sweep = u[0] * v[1] - u[1] * v[0] > 0 ? 1 : 0;
    out += `<path d="M ${a1[0].toFixed(1)} ${a1[1].toFixed(1)} A ${r} ${r} 0 0 ${sweep} ${a2[0].toFixed(1)} ${a2[1].toFixed(1)}" fill="none" stroke="var(--color-plum)" stroke-width="2.5"/>`;
    const t = [p[0] + (bis[0] / nb) * 40, p[1] + (bis[1] / nb) * 40];
    out += `<text class="an-vert" data-x="${p[0].toFixed(2)}" data-y="${p[1].toFixed(2)}" x="${t[0].toFixed(1)}" y="${(t[1] + 5).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="800" fill="${etiquetas[i] === "?" ? "var(--color-amber)" : "var(--text)"}">${etiquetas[i]}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="${vs.length === 3 ? "Triángulo" : "Cuadrilátero"} con sus ángulos">${out}</svg>`;
}

function genPoligonoAngulos(L) {
  const cuatro = L !== LEVELS.acs && Math.random() < 0.45;
  const paso = L === LEVELS.altas ? 1 : L === LEVELS.facil ? 10 : 5;
  const total = cuatro ? 360 : 180;
  let angs;
  let vs;
  do {
    if (cuatro) {
      angs = [0, 0, 0].map(() => paso * randInt(Math.ceil(55 / paso), Math.floor(125 / paso)));
      angs.push(360 - angs[0] - angs[1] - angs[2]);
    } else {
      angs = [0, 0].map(() => paso * randInt(Math.ceil(25 / paso), Math.floor(100 / paso)));
      angs.push(180 - angs[0] - angs[1]);
    }
    vs = angs.every((g) => g >= 20 && g <= 150) ? verticesDe(angs) : null;
  } while (!vs);
  const i = randInt(0, angs.length - 1);
  const conocidos = angs.filter((_, k) => k !== i);
  const x = angs[i];
  const etiquetas = angs.map((g, k) => (k === i ? "?" : `${g}°`));
  const fig = cuatro ? "cuadrilátero" : "triángulo";
  const s = conocidos.reduce((a, b) => a + b, 0);
  return {
    instruction: `¿Cuánto mide el ángulo que falta en este ${fig}?`,
    display: `Los otros ángulos miden ${conocidos.map((g) => `${g}°`).join(", ").replace(/, ([^,]*)$/, " y $1")}.`,
    visual: svgPoligono(vs, etiquetas),
    options: uniqueOptions(`${x}°`, [(cuatro ? 180 : 360) - s, x + 10, x - 10, 90, x + paso * 2].filter((y) => y > 0 && y < 360).map((y) => `${y}°`)),
    correct: `${x}°`,
    hint: cuatro ? "Los cuatro ángulos de un cuadrilátero suman 360°." : "Los tres ángulos de un triángulo suman 180°.",
    explain: `En un ${fig} los ángulos suman ${total}°. Los conocidos suman ${conocidos.join(" + ")} = ${s}°. Falta ${total} − ${s} = ${x}°.`,
  };
}

const MODE_GROUPS = {
  clasificar: [genClasificar],
  medir: [genMedir],
  estimar: [genEstimar],
  reloj: [genReloj, genGiros],
  posicion: [genPosicion],
  poligonos: [genPoligonoAngulos],
  relaciones: [genRelaciones],
};
// La mezcla es de 5º: sin complementarios y suplementarios.
const MEZCLA = ["clasificar", "medir", "estimar", "reloj", "posicion", "poligonos"];

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

  const ej = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };
  ej("an-ej-consecutivos", svgPosicion("consecutivos", 50, 70, 10));
  ej("an-ej-adyacentes", svgPosicion("adyacentes", 60, 120, 0, ["60°", "120°"]));
  ej("an-ej-opuestos", svgPosicion("opuestos", 50, 50, 15, ["50°", "50°"]));
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
    if (mode === "mezcla") return MODE_GROUPS[pick(MEZCLA)];
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
