// ============================================================
// Área y perímetro de figuras planas (5º Tema 7: perímetro y área
// del cuadrado, el rectángulo y el triángulo y áreas por
// cuadrículas; 6º SdA 8: además romboide, rombo, polígonos
// regulares y figuras irregulares)
// - Explora: rectángulos y triángulos en la cuadrícula, del romboide
//   al rectángulo y mismo perímetro con distinta área. No guarda
//   progreso.
// - Práctica: las figuras se generan al azar, dibujadas con sus
//   medidas, y cada pregunta trae su pista y su explicación. Solo la
//   práctica llama a AppProgress.
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

// 1234,5 → "1.234,5"
function fmt(n) {
  const r = Math.round(n * 100) / 100;
  const [ent, dec] = String(Math.abs(r)).split(".");
  const conPuntos = ent.length > 3 ? ent.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ent;
  return `${r < 0 ? "−" : ""}${conPuntos}${dec ? `,${dec}` : ""}`;
}

// Opciones con unidad, solo valores positivos y sin repetir.
function conUnidad(correct, valores, u) {
  return uniqueOptions(`${fmt(correct)} ${u}`, valores.filter((v) => v > 0 && Number.isFinite(v)).map((v) => `${fmt(v)} ${u}`));
}

const cuad = (u) => `${u}²`;

// ------------------------------------------------------------
// Dibujo de figuras con sus medidas
// ------------------------------------------------------------
// pts en unidades (y hacia arriba), en sentido contrario a las agujas.
// etiquetas: [{i, txt}] pone txt junto al lado que va del punto i al i+1.
// extra: [{from, to, txt}] segmentos discontinuos (alturas, diagonales).
function figuraSVG(pts, { etiquetas = [], extra = [], max = 200, sombra = null, interior = null } = {}) {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const ex = extra.flatMap((e) => [e.from, e.to]);
  const minX = Math.min(...xs, ...ex.map((p) => p[0]));
  const maxX = Math.max(...xs, ...ex.map((p) => p[0]));
  const minY = Math.min(...ys, ...ex.map((p) => p[1]));
  const maxY = Math.max(...ys, ...ex.map((p) => p[1]));
  const s = Math.min(max / (maxX - minX || 1), (max * 0.75) / (maxY - minY || 1), 34);
  const m = 60;
  const W = (maxX - minX) * s + m * 2;
  const H = (maxY - minY) * s + m * 2;
  const X = (x) => m + (x - minX) * s;
  const Y = (y) => H - m - (y - minY) * s;
  let out = "";
  out += `<polygon points="${pts.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(" ")}" fill="var(--color-indigo-tint)" stroke="var(--color-indigo)" stroke-width="3" stroke-linejoin="round"/>`;
  if (sombra) out += `<polygon points="${sombra.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(" ")}" fill="var(--color-amber-tint)" stroke="var(--color-amber)" stroke-width="2" stroke-dasharray="5 4"/>`;
  if (interior) out += `<polygon points="${interior.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(" ")}" fill="var(--surface)" stroke="var(--color-indigo)" stroke-width="3"/>`;
  extra.forEach((e) => {
    out += `<line x1="${X(e.from[0]).toFixed(1)}" y1="${Y(e.from[1]).toFixed(1)}" x2="${X(e.to[0]).toFixed(1)}" y2="${Y(e.to[1]).toFixed(1)}" stroke="${e.color || "var(--color-plum)"}" stroke-width="2.5" stroke-dasharray="6 4"/>`;
    if (e.txt) {
      const f = e.pos ?? 0.5;
      const mx = X(e.from[0]) + (X(e.to[0]) - X(e.from[0])) * f;
      const my = Y(e.from[1]) + (Y(e.to[1]) - Y(e.from[1])) * f;
      const vertical = Math.abs(X(e.from[0]) - X(e.to[0])) < 1;
      out += `<text x="${(mx + (vertical ? 6 : 0)).toFixed(1)}" y="${(my + (vertical ? 4 : -6)).toFixed(1)}" text-anchor="${vertical ? "start" : "middle"}" font-size="13" font-weight="800" fill="${e.color || "var(--color-plum)"}" stroke="var(--surface)" stroke-width="3" paint-order="stroke">${e.txt}</text>`;
    }
  });
  const poligonos = [pts, ...(interior ? [interior] : [])];
  etiquetas.forEach(({ i, txt, en = 0 }) => {
    const P = poligonos[en];
    const [x1, y1] = P[i];
    const [x2, y2] = P[(i + 1) % P.length];
    const sx1 = X(x1);
    const sy1 = Y(y1);
    const sx2 = X(x2);
    const sy2 = Y(y2);
    // Normal hacia fuera (en pantalla la y va hacia abajo).
    let nx = -(sy2 - sy1);
    let ny = sx2 - sx1;
    const L = Math.hypot(nx, ny) || 1;
    nx /= L;
    ny /= L;
    const d = 16;
    const tx = (sx1 + sx2) / 2 + nx * d;
    const ty = (sy1 + sy2) / 2 + ny * d + 4;
    const anchor = Math.abs(nx) > 0.6 ? (nx > 0 ? "start" : "end") : "middle";
    out += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${anchor}" font-size="13" font-weight="700" fill="var(--text)">${txt}</text>`;
  });
  return `<svg data-escala="${s}" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" width="${Math.min(W, 320).toFixed(0)}" style="max-width:100%" role="img" aria-label="Figura con sus medidas">${out}</svg>`;
}

// Cuadrícula con las casillas pintadas. celdas: Set de "x,y".
function cuadriculaSVG(cols, rows, celdas, { tri = null, guia = null, color = "var(--color-indigo)", tint = "var(--color-indigo-tint)" } = {}) {
  const c = Math.min(30, Math.floor(280 / cols));
  const m = 8;
  const W = cols * c + m * 2;
  const H = rows * c + m * 2;
  const X = (x) => m + x * c;
  const Y = (y) => H - m - y * c;
  let out = "";
  celdas.forEach((k) => {
    const [x, y] = k.split(",").map(Number);
    out += `<rect x="${X(x)}" y="${Y(y + 1)}" width="${c}" height="${c}" fill="${tint}"/>`;
  });
  if (tri) out += `<polygon points="${tri.map(([x, y]) => `${X(x)},${Y(y)}`).join(" ")}" fill="${tint}" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`;
  for (let i = 0; i <= cols; i++) out += `<line x1="${X(i)}" y1="${Y(0)}" x2="${X(i)}" y2="${Y(rows)}" stroke="var(--border-strong)" stroke-width="1"/>`;
  for (let j = 0; j <= rows; j++) out += `<line x1="${X(0)}" y1="${Y(j)}" x2="${X(cols)}" y2="${Y(j)}" stroke="var(--border-strong)" stroke-width="1"/>`;
  // Contorno de la figura: lados de casilla que no tocan otra casilla.
  celdas.forEach((k) => {
    const [x, y] = k.split(",").map(Number);
    const borde = (dx, dy) => !celdas.has(`${x + dx},${y + dy}`);
    const linea = (x1, y1, x2, y2) => `<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
    if (borde(0, -1)) out += linea(x, y, x + 1, y);
    if (borde(0, 1)) out += linea(x, y + 1, x + 1, y + 1);
    if (borde(-1, 0)) out += linea(x, y, x, y + 1);
    if (borde(1, 0)) out += linea(x + 1, y, x + 1, y + 1);
  });
  if (guia) out += `<rect x="${X(guia[0])}" y="${Y(guia[1] + guia[3])}" width="${guia[2] * c}" height="${guia[3] * c}" fill="none" stroke="var(--color-plum)" stroke-width="2.5" stroke-dasharray="6 4"/>`;
  if (tri) out += `<polygon points="${tri.map(([x, y]) => `${X(x)},${Y(y)}`).join(" ")}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`;
  return `<svg data-celda="${c}" viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="Figura en una cuadrícula">${out}</svg>`;
}

function rectCeldas(x0, y0, w, h, set = new Set()) {
  for (let x = x0; x < x0 + w; x++) for (let y = y0; y < y0 + h; y++) set.add(`${x},${y}`);
  return set;
}

function perimetroCeldas(celdas) {
  let p = 0;
  celdas.forEach((k) => {
    const [x, y] = k.split(",").map(Number);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!celdas.has(`${x + dx},${y + dy}`)) p++;
  });
  return p;
}

// Ternas pitagóricas: (desplazamiento, altura, lado inclinado).
const TERNAS = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [9, 12, 15], [12, 9, 15], [12, 5, 13]];

// ------------------------------------------------------------
// Niveles
// ------------------------------------------------------------
const LEVELS = {
  normal: { max: 12, trampa: true },
  facil: { max: 6, trampa: false },
  acs: { max: 5, trampa: false },
  altas: { max: 20, trampa: true, altas: true },
};

// ------------------------------------------------------------
// Generadores
// ------------------------------------------------------------
// 5º: áreas por cuadrículas.
function genCuadricula(L) {
  if (L !== LEVELS.acs && Math.random() < 0.35) {
    // Triángulo rectángulo: la mitad del rectángulo que lo rodea.
    let b;
    let h;
    do {
      b = randInt(2, L === LEVELS.facil ? 6 : 8);
      h = randInt(2, L === LEVELS.facil ? 6 : 7);
    } while ((b * h) % 2);
    const a = (b * h) / 2;
    return {
      instruction: "¿Cuántos cuadraditos ocupa el triángulo?",
      display: `${a}`,
      visual: cuadriculaSVG(b + 2, h + 2, new Set(), { tri: [[1, 1], [b + 1, 1], [1, h + 1]], guia: [1, 1, b, h] }),
      soloVisual: true,
      options: conUnidad(a, [b * h, a + b, a - 1, b + h, a + 2], "cuadraditos"),
      correct: `${fmt(a)} cuadraditos`,
      hint: "El triángulo es justo la mitad del rectángulo morado. Cuenta los cuadraditos del rectángulo y divide entre 2.",
      explain: `El rectángulo morado tiene ${b} × ${h} = ${b * h} cuadraditos. El triángulo es la mitad: ${b * h} ÷ 2 = ${a} cuadraditos. Por eso el área del triángulo es (base × altura) ÷ 2.`,
    };
  }
  let celdas;
  let w1;
  let h1;
  let w2;
  let h2;
  const max = L === LEVELS.acs ? 4 : L === LEVELS.facil ? 5 : 6;
  w1 = randInt(2, max);
  h1 = randInt(2, L === LEVELS.acs ? 3 : 4);
  celdas = rectCeldas(0, 0, w1, h1);
  if (L !== LEVELS.acs) {
    w2 = randInt(1, Math.max(1, w1 - 1));
    h2 = randInt(1, 3);
    rectCeldas(randInt(0, w1 - w2), h1, w2, h2, celdas);
  }
  const area = celdas.size;
  const per = perimetroCeldas(celdas);
  const cols = w1 + 2;
  const rows = h1 + (h2 || 0) + 2;
  const mover = new Set([...celdas].map((k) => k.split(",").map(Number)).map(([x, y]) => `${x + 1},${y + 1}`));
  return {
    instruction: "Cada cuadradito es una unidad. ¿Cuál es el área de la figura?",
    display: `${area}`,
    visual: cuadriculaSVG(cols, rows, mover),
    soloVisual: true,
    options: conUnidad(area, [per, area + 1, area - 1, w1 * h1, area + 2], "cuadraditos"),
    correct: `${fmt(area)} cuadraditos`,
    hint: "El área es cuántos cuadraditos caben dentro. Si la figura tiene partes rectangulares, cuenta filas: filas × cuadraditos en cada fila.",
    explain: L === LEVELS.acs
      ? `Hay ${h1} filas de ${w1} cuadraditos: ${w1} × ${h1} = ${area} cuadraditos.`
      : `Abajo hay ${h1} ${h1 === 1 ? "fila" : "filas"} de ${w1}: ${w1} × ${h1} = ${w1 * h1}. Arriba, ${h2} ${h2 === 1 ? "fila" : "filas"} de ${w2}: ${w2} × ${h2} = ${w2 * h2}. Total: ${w1 * h1} + ${w2 * h2} = ${area} cuadraditos.${per !== area ? ` (${per} sería el perímetro: los lados del borde.)` : ""}`,
  };
}

// 5º: cuadrado, rectángulo y triángulo.
function genCalcular(L) {
  const u = "cm";
  const tipos = L === LEVELS.acs ? ["cuadrado", "rectángulo"] : ["cuadrado", "rectángulo", "triángulo", "triángulo"];
  const tipo = pick(tipos);
  if (tipo === "cuadrado") {
    const l = randInt(2, L.max);
    return {
      instruction: "¿Cuál es el área del cuadrado?",
      display: `${l * l}`,
      visual: figuraSVG([[0, 0], [l, 0], [l, l], [0, l]], { etiquetas: [{ i: 0, txt: `${l} ${u}` }, { i: 3, txt: `${l} ${u}` }] }),
      soloVisual: true,
      options: conUnidad(l * l, [4 * l, 2 * l, l * l + l, l * l + 1, l * l - 1], cuad(u)),
      correct: `${fmt(l * l)} ${cuad(u)}`,
      hint: "Área del cuadrado = lado × lado.",
      explain: `${l} × ${l} = ${l * l} ${cuad(u)}.${l !== 2 ? ` Ojo: ${l} × 2 = ${2 * l} no es el área.` : ""} ${4 * l} ${u} sería el perímetro (los cuatro lados).`,
    };
  }
  if (tipo === "rectángulo") {
    const b = randInt(2, L.max);
    let h;
    do h = randInt(2, Math.max(3, L.max - 2));
    while (h === b);
    return {
      instruction: "¿Cuál es el área del rectángulo?",
      display: `${b * h}`,
      visual: figuraSVG([[0, 0], [b, 0], [b, h], [0, h]], { etiquetas: [{ i: 0, txt: `${b} ${u}` }, { i: 3, txt: `${h} ${u}` }] }),
      soloVisual: true,
      options: conUnidad(b * h, [2 * (b + h), b + h, b * h + b, (b * h) / 2], cuad(u)),
      correct: `${fmt(b * h)} ${cuad(u)}`,
      hint: "Área del rectángulo = base × altura.",
      explain: `${b} × ${h} = ${b * h} ${cuad(u)}. ${2 * (b + h)} ${u} sería el perímetro, que es el borde, no la superficie.`,
    };
  }
  // Triángulo. Con trampa: se ve también el lado inclinado.
  let b;
  let h;
  let o;
  let lado = null;
  if (L.trampa && Math.random() < 0.6) {
    const t = pick(TERNAS.filter(([d, alt]) => d < L.max && alt <= L.max));
    [o, h, lado] = t;
    do b = randInt(o + 1, Math.max(o + 2, L.max));
    while ((b * h) % 2);
  } else {
    do {
      b = randInt(2, L.max);
      h = randInt(2, L.max);
    } while ((b * h) % 2);
    o = L.altas && Math.random() < 0.3 ? -randInt(1, 3) : randInt(0, b);
  }
  const a = (b * h) / 2;
  const fuera = o < 0 || o > b;
  const extra = [{ from: [o, h], to: [o, 0], txt: `${h} ${u}` }];
  if (fuera) extra.push({ from: [0, 0], to: [o, 0], color: "var(--text-muted)" });
  return {
    instruction: "¿Cuál es el área del triángulo?",
    display: `${a}`,
    visual: figuraSVG([[0, 0], [b, 0], [o, h]], { etiquetas: [{ i: 0, txt: `${b} ${u}` }, ...(lado ? [{ i: 2, txt: `${lado} ${u}` }] : [])], extra }),
    soloVisual: true,
    options: conUnidad(a, [b * h, lado ? (b * lado) / 2 : b + h, lado ? b * lado : a + b, a / 2, b + h], cuad(u)),
    correct: `${fmt(a)} ${cuad(u)}`,
    hint: "Área del triángulo = (base × altura) ÷ 2. La altura es la línea discontinua, que forma un ángulo recto con la base.",
    explain: `(${b} × ${h}) ÷ 2 = ${b * h} ÷ 2 = ${fmt(a)} ${cuad(u)}.${lado ? ` El lado de ${lado} ${u} no es la altura: está inclinado.` : ""}${fuera ? " Aquí la altura cae fuera del triángulo, sobre la prolongación de la base." : ""} Sin dividir entre 2 saldría el área del rectángulo entero.`,
  };
}

// 6º: romboide, rombo y polígonos regulares.
function genMas6(L) {
  const u = "cm";
  const tipo = pick(L === LEVELS.facil ? ["romboide", "rombo"] : ["romboide", "rombo", "polígono"]);
  if (tipo === "romboide") {
    let b;
    let h;
    let o;
    let lado = null;
    if (L.trampa && Math.random() < 0.6) {
      [o, h, lado] = pick(TERNAS.filter(([d, alt]) => d <= 8 && alt <= L.max));
      b = randInt(3, L.max);
    } else {
      b = randInt(3, L.max);
      h = randInt(2, L.max);
      o = randInt(1, 3);
    }
    return {
      instruction: "¿Cuál es el área del romboide?",
      display: `${b * h}`,
      visual: figuraSVG([[0, 0], [b, 0], [b + o, h], [o, h]], { etiquetas: [{ i: 0, txt: `${b} ${u}` }, ...(lado ? [{ i: 3, txt: `${lado} ${u}` }] : [])], extra: [{ from: [o, h], to: [o, 0], txt: `${h} ${u}` }] }),
      soloVisual: true,
      options: conUnidad(b * h, [(b * h) / 2, lado ? b * lado : b + h, lado ? 2 * (b + lado) : 2 * b * h, b * h + o], cuad(u)),
      correct: `${fmt(b * h)} ${cuad(u)}`,
      hint: "Área del romboide = base × altura. Si cortas un triángulo de un lado y lo pegas en el otro, sale un rectángulo.",
      explain: `${b} × ${h} = ${b * h} ${cuad(u)}.${lado ? ` El lado inclinado (${lado} ${u}) no es la altura.` : ""} No se divide entre 2: eso es en el triángulo.`,
    };
  }
  if (tipo === "rombo") {
    let D;
    let d;
    // Ni muy aplastado ni casi un cuadrado: D / 2 ≤ d < D.
    do {
      D = 2 * randInt(2, Math.floor(L.max / 2) + 2);
      d = 2 * randInt(1, Math.floor(L.max / 2));
    } while (d >= D || 2 * d < D);
    const a = (D * d) / 2;
    return {
      instruction: "¿Cuál es el área del rombo?",
      display: `${a}`,
      visual: figuraSVG([[0, d / 2], [D / 2, 0], [D, d / 2], [D / 2, d]], { extra: [{ from: [0, d / 2], to: [D, d / 2], txt: `D = ${D} ${u}`, color: "var(--color-plum)", pos: 0.22 }, { from: [D / 2, 0], to: [D / 2, d], txt: `d = ${d} ${u}`, color: "var(--color-teal)", pos: 0.8 }] }),
      soloVisual: true,
      options: conUnidad(a, [D * d, D + d, a / 2, 2 * (D + d)], cuad(u)),
      correct: `${fmt(a)} ${cuad(u)}`,
      hint: "Área del rombo = (diagonal mayor × diagonal menor) ÷ 2. El rombo es la mitad del rectángulo que lo rodea.",
      explain: `(${D} × ${d}) ÷ 2 = ${D * d} ÷ 2 = ${fmt(a)} ${cuad(u)}. El rectángulo que rodea al rombo mide ${D} × ${d} = ${D * d} ${cuad(u)}, y el rombo ocupa justo la mitad.`,
    };
  }
  // Polígono regular: perímetro × apotema ÷ 2.
  const n = pick([5, 6, 8]);
  const nombre = { 5: "pentágono", 6: "hexágono", 8: "octógono" }[n];
  const l = randInt(2, L.altas ? 12 : 8);
  const ap = Math.round((l / (2 * Math.tan(Math.PI / n))) * 10) / 10;
  const P = n * l;
  const a = Math.round(P * ap * 50) / 100;
  const pts = [];
  for (let k = 0; k < n; k++) {
    const ang = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * k) / n;
    const R = l / (2 * Math.sin(Math.PI / n));
    pts.push([R * Math.cos(ang), R * Math.sin(ang)]);
  }
  const mid = [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2];
  return {
    instruction: `¿Cuál es el área del ${nombre} regular?`,
    display: fmt(a),
    visual: figuraSVG(pts, { etiquetas: [{ i: 0, txt: `${l} ${u}` }], extra: [{ from: [0, 0], to: mid, txt: `${fmt(ap)} ${u}` }] }),
    soloVisual: true,
    options: conUnidad(a, [P * ap, (l * ap) / 2, P, a + l], cuad(u)),
    correct: `${fmt(a)} ${cuad(u)}`,
    hint: "Área del polígono regular = (perímetro × apotema) ÷ 2. La apotema va del centro al punto medio de un lado.",
    explain: `Perímetro: ${n} lados × ${l} = ${P} ${u}. Área: (${P} × ${fmt(ap)}) ÷ 2 = ${fmt(P * ap)} ÷ 2 = ${fmt(a)} ${cuad(u)}.`,
  };
}

function genPerimetro(L) {
  const u = "cm";
  const tipo = pick(L === LEVELS.acs ? ["rect", "cuad", "red"] : ["rect", "cuad", "tri", "red", "inversa", "regular"]);
  if (tipo === "red") {
    // Perímetro en la cuadrícula.
    const w1 = randInt(2, L === LEVELS.acs ? 4 : 5);
    const h1 = randInt(1, 3);
    const celdas = rectCeldas(1, 1, w1, h1);
    if (L !== LEVELS.acs) rectCeldas(1 + randInt(0, w1 - 1), 1 + h1, 1, randInt(1, 2), celdas);
    const p = perimetroCeldas(celdas);
    const rows = Math.max(...[...celdas].map((k) => Number(k.split(",")[1]))) + 2;
    return {
      instruction: "Cada lado de un cuadradito mide 1 cm. ¿Cuál es el perímetro de la figura?",
      display: `${p}`,
      visual: cuadriculaSVG(w1 + 2, rows, celdas),
      soloVisual: true,
      options: conUnidad(p, [celdas.size, p - 2, p + 2, p - 1], u),
      correct: `${fmt(p)} ${u}`,
      hint: "El perímetro es el borde. Recorre el contorno con el dedo y cuenta los lados de cuadradito.",
      explain: `Contando todos los lados del borde salen ${p} ${u}. El área serían los cuadraditos de dentro: ${celdas.size}.`,
    };
  }
  if (tipo === "cuad" || tipo === "rect") {
    const b = randInt(2, L.max);
    const h = tipo === "cuad" ? b : (() => {
      let x;
      do x = randInt(2, L.max);
      while (x === b);
      return x;
    })();
    const p = 2 * (b + h);
    return {
      instruction: `¿Cuál es el perímetro del ${tipo === "cuad" ? "cuadrado" : "rectángulo"}?`,
      display: `${p}`,
      visual: figuraSVG([[0, 0], [b, 0], [b, h], [0, h]], { etiquetas: [{ i: 0, txt: `${b} ${u}` }, { i: 3, txt: `${h} ${u}` }] }),
      soloVisual: true,
      options: conUnidad(p, [b * h, b + h, 2 * b + h, p + 2], u),
      correct: `${fmt(p)} ${u}`,
      hint: "El perímetro es la suma de todos los lados. Los lados de enfrente miden lo mismo.",
      explain: tipo === "cuad" ? `Cuatro lados iguales: ${b} + ${b} + ${b} + ${b} = 4 × ${b} = ${p} ${u}.` : `${b} + ${h} + ${b} + ${h} = ${p} ${u}. Solo se ven dos medidas, pero hay cuatro lados.`,
    };
  }
  if (tipo === "tri") {
    // Dos ternas con la misma altura: los tres lados salen enteros.
    const ternas = L.max <= 6 ? TERNAS.slice(0, 2) : TERNAS;
    const [o, h, lado] = pick(ternas);
    const [o2, , otro] = pick(ternas.filter((t) => t[1] === h));
    const b = o + o2;
    const lados = [b, otro, lado];
    const p = b + otro + lado;
    return {
      instruction: "¿Cuál es el perímetro del triángulo?",
      display: fmt(p),
      visual: figuraSVG([[0, 0], [b, 0], [o, h]], { etiquetas: [{ i: 0, txt: `${b} ${u}` }, { i: 1, txt: `${fmt(otro)} ${u}` }, { i: 2, txt: `${lado} ${u}` }] }),
      soloVisual: true,
      options: conUnidad(p, [b + lado, (b * h) / 2, p + 1, p - 2], u),
      correct: `${fmt(p)} ${u}`,
      hint: "Suma los tres lados.",
      explain: `${lados.map(fmt).join(" + ")} = ${fmt(p)} ${u}.`,
    };
  }
  if (tipo === "regular") {
    const n = pick([5, 6, 8]);
    const nombre = { 5: "pentágono", 6: "hexágono", 8: "octógono" }[n];
    const l = randInt(2, L.max);
    return {
      instruction: "¿Cuál es su perímetro?",
      display: `Un ${nombre} regular tiene ${l} cm de lado.`,
      options: conUnidad(n * l, [(n - 1) * l, 4 * l, n + l, (n + 1) * l], u),
      correct: `${fmt(n * l)} ${u}`,
      hint: `Un ${nombre} tiene ${n} lados y, si es regular, todos miden lo mismo.`,
      explain: `${n} lados × ${l} ${u} = ${n * l} ${u}.`,
    };
  }
  // Al revés: del perímetro al lado.
  const l = randInt(2, L.max);
  return {
    instruction: "¿Cuánto mide su lado?",
    display: `Un cuadrado tiene ${4 * l} cm de perímetro.`,
    options: conUnidad(l, [2 * l, 4 * l, l + 1, l * l], u),
    correct: `${fmt(l)} ${u}`,
    hint: "El cuadrado tiene 4 lados iguales: reparte el perímetro entre 4.",
    explain: `${4 * l} ÷ 4 = ${l} ${u}. Comprobación: 4 × ${l} = ${4 * l}.`,
  };
}

const CASOS = [
  ["Poner una valla alrededor de un huerto", "Perímetro", "la valla va por el borde"],
  ["Plantar césped en un jardín", "Área", "el césped cubre toda la superficie"],
  ["Poner un marco a un cuadro", "Perímetro", "el marco rodea el cuadro"],
  ["Pintar una pared", "Área", "la pintura cubre toda la pared"],
  ["Poner baldosas en el suelo de la cocina", "Área", "las baldosas cubren todo el suelo"],
  ["Poner una cinta alrededor del mural", "Perímetro", "la cinta va por el borde"],
  ["Forrar la tapa de un libro", "Área", "el forro cubre toda la tapa"],
  ["Dar una vuelta corriendo alrededor del campo de fútbol", "Perímetro", "se recorre el borde"],
  ["Comprar una alfombra para el salón", "Área", "la alfombra cubre el suelo"],
  ["Poner rodapié en una habitación", "Perímetro", "el rodapié va por el borde de las paredes"],
  ["Comprar tela para cubrir la mesa", "Área", "la tela cubre toda la mesa"],
  ["Poner luces por el borde de la ventana", "Perímetro", "las luces van por el borde"],
];

function genAreaOPerimetro() {
  const [txt, sol, por] = pick(CASOS);
  return {
    instruction: "¿Qué hay que calcular: el área o el perímetro?",
    display: `${txt}.`,
    options: ["Área", "Perímetro"],
    keepOrder: true,
    correct: sol,
    hint: "El perímetro es el borde (se mide en cm, m...). El área es toda la superficie de dentro (se mide en cm², m²...).",
    explain: `${sol}: ${por}.`,
  };
}

function genProblemas(L) {
  const tipo = pick(L === LEVELS.acs ? ["suelo", "valla"] : ["suelo", "valla", "pintura", "inversa", "mural", "precio"]);
  const m = L === LEVELS.facil ? 6 : L === LEVELS.altas ? 25 : 12;
  if (tipo === "suelo") {
    const b = randInt(2, m);
    const h = randInt(2, m);
    return {
      instruction: "Resuelve el problema:",
      display: `El suelo de una habitación mide ${b} m de largo y ${h} m de ancho. ¿Cuántas baldosas de 1 m² hacen falta para cubrirlo?`,
      options: conUnidad(b * h, [2 * (b + h), b + h, b * h + b], "baldosas"),
      correct: `${fmt(b * h)} baldosas`,
      hint: "Cada baldosa ocupa 1 m²: hay que calcular el área del suelo.",
      explain: `Área: ${b} × ${h} = ${b * h} m², así que hacen falta ${b * h} baldosas de 1 m².`,
    };
  }
  if (tipo === "valla") {
    const b = randInt(3, m + 3);
    const h = randInt(2, m);
    const puerta = L === LEVELS.acs || L === LEVELS.facil ? 0 : randInt(1, 2);
    const p = 2 * (b + h) - puerta;
    return {
      instruction: "Resuelve el problema:",
      display: `Un huerto rectangular mide ${b} m de largo y ${h} m de ancho. ${puerta ? `Se quiere vallar todo menos una puerta de ${puerta} m. ¿Cuántos metros de valla hacen falta?` : "¿Cuántos metros de valla hacen falta para rodearlo?"}`,
      options: conUnidad(p, [b * h, 2 * (b + h) + (puerta ? 0 : 2), b + h, puerta ? 2 * (b + h) + puerta : b * h - 1], "m"),
      correct: `${fmt(p)} m`,
      hint: "La valla va por el borde: es el perímetro.",
      explain: `Perímetro: ${b} + ${h} + ${b} + ${h} = ${2 * (b + h)} m${puerta ? `. Sin la puerta: ${2 * (b + h)} − ${puerta} = ${p} m` : ""}.`,
    };
  }
  if (tipo === "pintura") {
    const cubre = pick([2, 3, 4, 5]);
    let b;
    let h;
    do {
      b = randInt(2, 8);
      h = randInt(2, 4);
    } while ((b * h) % cubre);
    const botes = (b * h) / cubre;
    return {
      instruction: "Resuelve el problema:",
      display: `Una pared mide ${b} m de largo y ${h} m de alto. Con un bote de pintura se pintan ${cubre} m². ¿Cuántos botes hacen falta?`,
      options: conUnidad(botes, [b * h, botes + 1, 2 * (b + h) / cubre, botes * 2], botes === 1 ? "bote" : "botes").map((o) => o.replace(/^1 botes$/, "1 bote")),
      correct: `${fmt(botes)} ${botes === 1 ? "bote" : "botes"}`,
      hint: "Primero calcula el área de la pared. Después, cuántas veces caben los m² de un bote.",
      explain: `Área: ${b} × ${h} = ${b * h} m². Botes: ${b * h} ÷ ${cubre} = ${botes}.`,
    };
  }
  if (tipo === "inversa") {
    const b = randInt(2, m);
    const h = randInt(2, m);
    return {
      instruction: "Resuelve el problema:",
      display: `Un rectángulo tiene ${b * h} cm² de área y su base mide ${b} cm. ¿Cuánto mide su altura?`,
      options: conUnidad(h, [b * h - b, (b * h) / 2, h + 1, b * h * b], "cm"),
      correct: `${fmt(h)} cm`,
      hint: "Base × altura = área. ¿Por qué número hay que multiplicar la base para que dé el área?",
      explain: `${b} × ? = ${b * h} → ${b * h} ÷ ${b} = ${h} cm.`,
    };
  }
  if (tipo === "mural") {
    // Reto de la UDI de 5º: el mural de la campaña.
    const b = randInt(2, 6);
    const h = randInt(1, 3);
    const hojas = 4;
    return {
      instruction: "Resuelve el problema:",
      display: `El mural de la campaña mide ${b} m de largo y ${h} m de alto. Cada cartulina cubre 1 m² y en cada una caben ${hojas} dibujos. ¿Cuántos dibujos caben en todo el mural?`,
      options: conUnidad(b * h * hojas, [b * h, 2 * (b + h) * hojas, (b + h) * hojas, b * h + hojas], "dibujos"),
      correct: `${fmt(b * h * hojas)} dibujos`,
      hint: "Primero calcula el área del mural: así sabes cuántas cartulinas hay.",
      explain: `Área: ${b} × ${h} = ${b * h} m², es decir, ${b * h} cartulinas. Dibujos: ${b * h} × ${hojas} = ${b * h * hojas}.`,
    };
  }
  const b = randInt(2, 9);
  const h = randInt(2, 6);
  const precio = pick([5, 10, 12, 15, 20]);
  return {
    instruction: "Resuelve el problema:",
    display: `Se quiere poner césped artificial en un patio de ${b} m × ${h} m. Cada metro cuadrado cuesta ${precio} €. ¿Cuánto cuesta en total?`,
    options: conUnidad(b * h * precio, [2 * (b + h) * precio, b * h + precio, (b + h) * precio, b * h * precio + precio], "€"),
    correct: `${fmt(b * h * precio)} €`,
    hint: "Primero el área del patio; después, multiplica por el precio de cada m².",
    explain: `Área: ${b} × ${h} = ${b * h} m². Coste: ${b * h} × ${precio} = ${fmt(b * h * precio)} €.`,
  };
}

// 6º: figuras irregulares.
function genIrregular(L) {
  const u = "m";
  const tipo = pick(L.altas ? ["L", "T", "hueco", "perL"] : L === LEVELS.facil ? ["L", "T"] : ["L", "T", "hueco"]);
  const m = L === LEVELS.facil ? 6 : L.altas ? 16 : 10;
  if (tipo === "L" || tipo === "perL") {
    const W = randInt(4, m);
    const H = randInt(4, m);
    const w = randInt(2, W - 2);
    const h = randInt(2, H - 2);
    // Rectángulo W × H al que le falta la esquina de arriba a la derecha.
    const pts = [[0, 0], [W, 0], [W, H - h], [W - w, H - h], [W - w, H], [0, H]];
    const area = W * H - w * h;
    if (tipo === "perL") {
      const p = 2 * (W + H);
      return {
        instruction: "¿Cuál es el perímetro de la figura?",
        display: `${p}`,
        visual: figuraSVG(pts, { etiquetas: [{ i: 0, txt: `${W} ${u}` }, { i: 5, txt: `${H} ${u}` }, { i: 2, txt: `${w} ${u}` }, { i: 3, txt: `${h} ${u}` }] }),
        soloVisual: true,
        options: conUnidad(p, [p - w - h, area, p + w + h, W + H + w + h], u),
        correct: `${fmt(p)} ${u}`,
        hint: "Calcula primero los lados que faltan. Truco: los dos escalones juntos miden lo mismo que el lado de enfrente.",
        explain: `Lados que faltan: arriba ${W} − ${w} = ${W - w} y a la derecha ${H} − ${h} = ${H - h}. Perímetro: ${W} + ${H - h} + ${w} + ${h} + ${W - w} + ${H} = ${p} ${u}. Es lo mismo que el rectángulo entero: 2 × (${W} + ${H}) = ${p}.`,
      };
    }
    return {
      instruction: "¿Cuál es el área de la figura?",
      display: `${area}`,
      visual: figuraSVG(pts, { etiquetas: [{ i: 0, txt: `${W} ${u}` }, { i: 5, txt: `${H} ${u}` }, { i: 2, txt: `${w} ${u}` }, { i: 3, txt: `${h} ${u}` }], extra: [{ from: [0, H - h], to: [W - w, H - h] }] }),
      soloVisual: true,
      options: conUnidad(area, [W * H, W * H - w - h, W * (H - h), area + w * h + w], cuad(u)),
      correct: `${fmt(area)} ${cuad(u)}`,
      hint: "Pártela por la línea discontinua en dos rectángulos, o calcula el rectángulo entero y quita la esquina que falta.",
      explain: `Rectángulo de abajo: ${W} × ${H - h} = ${W * (H - h)}. Rectángulo de arriba: ${W - w} × ${h} = ${(W - w) * h}. Total: ${W * (H - h)} + ${(W - w) * h} = ${area} ${cuad(u)}. También: ${W} × ${H} − ${w} × ${h} = ${W * H} − ${w * h} = ${area}.`,
    };
  }
  if (tipo === "T") {
    const W = randInt(5, m);
    const a = randInt(1, 3);
    const c = randInt(1, W - 3);
    const d = randInt(2, m - 2);
    const x0 = Math.floor((W - c) / 2);
    const pts = [[x0, 0], [x0 + c, 0], [x0 + c, d], [W, d], [W, d + a], [0, d + a], [0, d], [x0, d]];
    const area = W * a + c * d;
    return {
      instruction: "¿Cuál es el área de la figura?",
      display: `${area}`,
      visual: figuraSVG(pts, { etiquetas: [{ i: 4, txt: `${W} ${u}` }, { i: 5, txt: `${a} ${u}` }, { i: 0, txt: `${c} ${u}` }, { i: 1, txt: `${d} ${u}` }], extra: [{ from: [x0, d], to: [x0 + c, d] }] }),
      soloVisual: true,
      options: conUnidad(area, [W * (a + d), W * a, c * d, W * a + c + d, (W + c) * (a + d)], cuad(u)),
      correct: `${fmt(area)} ${cuad(u)}`,
      hint: "Separa la barra de arriba y la columna de abajo. Calcula el área de cada rectángulo y súmalas.",
      explain: `Barra de arriba: ${W} × ${a} = ${W * a}. Columna: ${c} × ${d} = ${c * d}. Total: ${W * a} + ${c * d} = ${area} ${cuad(u)}.`,
    };
  }
  // Rectángulo con un hueco (jardín con piscina).
  const W = randInt(6, m + 2);
  const H = randInt(5, m);
  const w = randInt(2, W - 3);
  const h = randInt(2, H - 3);
  const area = W * H - w * h;
  const x0 = Math.floor((W - w) / 2);
  const y0 = Math.floor((H - h) / 2);
  return {
    instruction: "Un jardín tiene una piscina en el centro. ¿Cuántos m² de césped hay?",
    display: `${area}`,
    visual: figuraSVG([[0, 0], [W, 0], [W, H], [0, H]], { etiquetas: [{ i: 0, txt: `${W} ${u}` }, { i: 3, txt: `${H} ${u}` }, { en: 1, i: 0, txt: `${w} ${u}` }, { en: 1, i: 3, txt: `${h} ${u}` }], interior: [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]] }),
    soloVisual: true,
    options: conUnidad(area, [W * H, W * H + w * h, w * h, W * H - w - h], cuad(u)),
    correct: `${fmt(area)} ${cuad(u)}`,
    hint: "Calcula el área de todo el jardín y quítale la de la piscina.",
    explain: `Jardín entero: ${W} × ${H} = ${W * H}. Piscina: ${w} × ${h} = ${w * h}. Césped: ${W * H} − ${w * h} = ${area} ${cuad(u)}.`,
  };
}

// Altas: mismo perímetro, distinta área.
function genMismoPerimetro() {
  const s = randInt(6, 12);
  const b1 = randInt(1, Math.floor(s / 2) - 1);
  let b2;
  do b2 = randInt(b1 + 1, Math.floor(s / 2));
  while (b2 === b1);
  const [r1, r2] = [[b1, s - b1], [b2, s - b2]];
  const a1 = r1[0] * r1[1];
  const a2 = r2[0] * r2[1];
  return {
    instruction: "Los dos tienen el mismo perímetro. ¿Cuál tiene más área?",
    display: `Rectángulo A: ${r1[0]} cm × ${r1[1]} cm. Rectángulo B: ${r2[0]} cm × ${r2[1]} cm.`,
    options: ["A", "B", "Tienen la misma"],
    keepOrder: true,
    correct: a1 > a2 ? "A" : "B",
    hint: "Comprueba que el perímetro es igual y calcula el área de cada uno.",
    explain: `Los dos tienen ${2 * s} cm de perímetro. Áreas: A = ${a1} cm², B = ${a2} cm². Cuanto más se parece el rectángulo a un cuadrado, más área tiene con el mismo perímetro.`,
  };
}

const MODE_GROUPS = {
  cuadricula: [genCuadricula],
  calcular: [genCalcular],
  perimetro: [genPerimetro, genPerimetro, genAreaOPerimetro],
  problemas: [genProblemas],
  mas6: [genMas6],
  irregular: [genIrregular],
};

// La mezcla es de los contenidos de 5º; los de 6º se eligen aparte.
const MEZCLA = ["cuadricula", "calcular", "perimetro", "problemas"];

const ACS_GENERATORS = [genCuadricula, genCalcular, genPerimetro, genAreaOPerimetro, genProblemas];

const AREAS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Contar cuadraditos, cuadrado y rectángulo (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja el área contando cuadraditos, el área y el perímetro del cuadrado y del rectángulo con números pequeños, y distinguir cuándo se calcula el área y cuándo el perímetro.",
    example: "Rectángulo de 4 × 3 → 3 filas de 4 cuadraditos = 12 cuadraditos",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantienen las mismas figuras, pero con una tipografía más legible para leer los enunciados y las medidas.",
    example: "Rectángulo de 6 cm × 4 cm → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Contar cuadraditos» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todos los contenidos, con medidas pequeñas y la pista a la vista",
    text: "Se trabajan todos los modos con medidas de hasta 6 (las tablas más fáciles), sin lados inclinados que despisten y con la pista abierta desde el principio. Sin «Mezcla». En Explora se ven los cuadraditos de cada figura.",
    example: "Triángulo de base 4 y altura 3 → Pista: (base × altura) ÷ 2",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Figuras de 6º, trampas y mismo perímetro con distinta área",
    text: "Empieza en <strong>Figuras irregulares</strong>, con medidas mayores, triángulos con la altura por fuera, perímetros de figuras en L y rectángulos con el mismo perímetro y distinta área.",
    example: "Un rectángulo de 2 × 8 y uno de 5 × 5 tienen el mismo perímetro, pero no la misma área",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Cuál es el área del rectángulo? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, AREAS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), AREAS_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("ar-rect")) initExplore();
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
  // 1. Rectángulo y triángulo en la cuadrícula.
  let b = 5;
  let h = 3;
  let tri = false;
  function renderRect() {
    document.getElementById("ar-b").textContent = b;
    document.getElementById("ar-h").textContent = h;
    document.getElementById("ar-tri").textContent = tri ? "Ver el rectángulo" : "Partirlo por la diagonal";
    const celdas = tri ? new Set() : rectCeldas(1, 1, b, h);
    document.getElementById("ar-rect-draw").innerHTML = cuadriculaSVG(b + 2, h + 2, celdas, tri ? { tri: [[1, 1], [b + 1, 1], [1, h + 1]], guia: [1, 1, b, h] } : {});
    const a = b * h;
    document.getElementById("ar-rect-msg").innerHTML = tri
      ? `El triángulo es la mitad del rectángulo: <strong>${b} × ${h} ÷ 2 = ${fmt(a / 2)} cuadraditos</strong>.${a % 2 ? " Sale con medio cuadradito porque la diagonal parte algunos por la mitad." : ""}`
      : `Hay ${h} ${h === 1 ? "fila" : "filas"} de ${b} cuadraditos: <strong>área = ${b} × ${h} = ${a} cuadraditos</strong>. El borde mide ${b} + ${h} + ${b} + ${h} = <strong>${2 * (b + h)}</strong>: es el perímetro.`;
  }
  document.querySelectorAll("[data-ar-b]").forEach((x) => x.addEventListener("click", () => { b = Math.max(1, Math.min(10, b + Number(x.dataset.arB))); renderRect(); }));
  document.querySelectorAll("[data-ar-h]").forEach((x) => x.addEventListener("click", () => { h = Math.max(1, Math.min(8, h + Number(x.dataset.arH))); renderRect(); }));
  document.getElementById("ar-tri").addEventListener("click", () => { tri = !tri; renderRect(); });

  // 2. Del romboide al rectángulo.
  let rb = 5;
  let rh = 3;
  let ro = 2;
  let pegado = false;
  function renderRomb() {
    document.getElementById("ar-rb").textContent = rb;
    document.getElementById("ar-rh").textContent = rh;
    document.getElementById("ar-ro").textContent = ro;
    document.getElementById("ar-pegar").textContent = pegado ? "Volver al romboide" : "Cortar el triángulo y pegarlo";
    const pts = pegado ? [[ro, 0], [rb + ro, 0], [rb + ro, rh], [ro, rh]] : [[0, 0], [rb, 0], [rb + ro, rh], [ro, rh]];
    const sombra = pegado ? [[rb, 0], [rb + ro, 0], [rb + ro, rh]] : [[0, 0], [ro, 0], [ro, rh]];
    document.getElementById("ar-romb-draw").innerHTML = figuraSVG(pts, {
      etiquetas: [{ i: 0, txt: `base ${rb}` }],
      extra: [{ from: [ro, rh], to: [ro, 0], txt: `altura ${rh}` }],
      sombra,
      max: 220,
    });
    document.getElementById("ar-romb-msg").innerHTML = pegado
      ? `El triángulo naranja se ha pasado al otro lado: ahora es un <strong>rectángulo de ${rb} × ${rh}</strong>. El área no ha cambiado: <strong>${rb} × ${rh} = ${rb * rh}</strong>.`
      : `Romboide de base ${rb} y altura ${rh}. Si cortas el triángulo naranja y lo pegas al otro lado, ¿qué figura sale?`;
  }
  const lim = (v, a, z) => Math.max(a, Math.min(z, v));
  document.querySelectorAll("[data-ar-rb]").forEach((x) => x.addEventListener("click", () => { rb = lim(rb + Number(x.dataset.arRb), 3, 8); renderRomb(); }));
  document.querySelectorAll("[data-ar-rh]").forEach((x) => x.addEventListener("click", () => { rh = lim(rh + Number(x.dataset.arRh), 2, 6); renderRomb(); }));
  document.querySelectorAll("[data-ar-ro]").forEach((x) => x.addEventListener("click", () => { ro = lim(ro + Number(x.dataset.arRo), 1, 3); renderRomb(); }));
  document.getElementById("ar-pegar").addEventListener("click", () => { pegado = !pegado; renderRomb(); });

  // 3. Mismo perímetro, distinta área.
  const S = 12;
  let pb = 2;
  function renderPer() {
    const ph = S - pb;
    document.getElementById("ar-pb").textContent = `${pb} × ${ph}`;
    document.getElementById("ar-per-draw").innerHTML = cuadriculaSVG(13, 13, rectCeldas(1, 1, pb, ph), { color: "var(--color-teal)", tint: "var(--color-teal-tint)" });
    const a = pb * ph;
    document.getElementById("ar-per-msg").innerHTML = `Perímetro: ${pb} + ${ph} + ${pb} + ${ph} = <strong>${2 * S}</strong> (siempre el mismo). Área: ${pb} × ${ph} = <strong>${a} cuadraditos</strong>.${pb === 6 ? " Es un cuadrado: es el que más área tiene con este perímetro." : ""}`;
  }
  document.querySelectorAll("[data-ar-pb]").forEach((x) => x.addEventListener("click", () => { pb = lim(pb + Number(x.dataset.arPb), 1, 11); renderPer(); }));

  renderRect();
  renderRomb();
  renderPer();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-areas"),
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
  let mode = "cuadricula";
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

    if (diff.is("altas")) setActiveMode("irregular");
    else if (acs) setActiveMode("cuadricula");
    else if ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla") setActiveMode("cuadricula");

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function generatorsFor() {
    if (diff.is("acs")) return ACS_GENERATORS;
    if (mode === "mezcla") return MODE_GROUPS[pick(MEZCLA)];
    if (diff.is("altas") && (mode === "perimetro" || mode === "irregular")) return [...MODE_GROUPS[mode], genMismoPerimetro];
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
    AppProgress.record("areas", isCorrect);
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
