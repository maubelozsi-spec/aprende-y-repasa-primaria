// ============================================================
// Cuerpos geométricos y su desarrollo (5º Tema 8: los cuerpos
// geométricos, su desarrollo plano y sus caras, aristas y vértices;
// 6º SdA 8: poliedros, prismas, pirámides y cuerpos redondos)
// - Explora: construir prismas y pirámides de cualquier base y
//   comprobar si un desarrollo forma un cubo. No guarda progreso.
// - Práctica: los cuerpos y los desarrollos se generan al azar y
//   cada pregunta trae su pista y su explicación. Solo la práctica
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

// ------------------------------------------------------------
// Los cuerpos
// ------------------------------------------------------------
const BASE = { 3: "triangular", 4: "cuadrangular", 5: "pentagonal", 6: "hexagonal", 7: "heptagonal", 8: "octogonal", 10: "decagonal", 12: "dodecagonal" };
const POLIGONO = { 3: "triángulos", 4: "cuadrados", 5: "pentágonos", 6: "hexágonos", 7: "heptágonos", 8: "octógonos" };
const POLIGONO1 = { 3: "triángulo", 4: "cuadrado", 5: "pentágono", 6: "hexágono", 7: "heptágono", 8: "octógono" };

function nombreCuerpo(tipo, n) {
  if (tipo === "prisma") return `Prisma ${BASE[n]}`;
  if (tipo === "piramide") return `Pirámide ${BASE[n]}`;
  return { cubo: "Cubo", cilindro: "Cilindro", cono: "Cono", esfera: "Esfera" }[tipo];
}

// Caras, aristas y vértices.
function cav(tipo, n) {
  if (tipo === "cubo") return { C: 6, A: 12, V: 8 };
  if (tipo === "prisma") return { C: n + 2, A: 3 * n, V: 2 * n };
  return { C: n + 1, A: 2 * n, V: n + 1 };
}

// ------------------------------------------------------------
// Dibujo en perspectiva
// ------------------------------------------------------------
const rad = (g) => (g * Math.PI) / 180;
const pt = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

function svgCuerpo(tipo, n = 4, { size = 220 } = {}) {
  const cx = size / 2;
  const cy = size * 0.76;
  const rx = size * 0.32;
  const ry = size * 0.1;
  const H = size * 0.5;
  const linea = (a, b, oculta = false, color = "var(--text)") =>
    `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${color}" stroke-width="${oculta ? 1.5 : 2.5}"${oculta ? ' stroke-dasharray="5 4"' : ""} stroke-linecap="round"/>`;
  let out = "";
  if (tipo === "cubo") {
    const l = size * 0.45;
    const d = l * 0.4;
    const x0 = cx - (l + d) / 2;
    const y0 = cy;
    const A = [x0, y0];
    const B = [x0 + l, y0];
    const C = [x0 + l, y0 - l];
    const D = [x0, y0 - l];
    const o = (p) => [p[0] + d, p[1] - d];
    out += `<polygon points="${[A, B, C, D].map(pt).join(" ")}" fill="var(--color-indigo-tint)"/>`;
    out += `<polygon points="${[D, C, o(C), o(D)].map(pt).join(" ")}" fill="var(--color-teal-tint)"/>`;
    out += `<polygon points="${[B, o(B), o(C), C].map(pt).join(" ")}" fill="var(--color-plum-tint)"/>`;
    out += linea(o(A), o(B), true) + linea(o(A), o(D), true) + linea(A, o(A), true);
    out += [[A, B], [B, C], [C, D], [D, A], [D, o(D)], [C, o(C)], [B, o(B)], [o(D), o(C)], [o(C), o(B)]].map(([p, q]) => linea(p, q)).join("");
  } else if (tipo === "prisma" || tipo === "piramide") {
    const base = [];
    for (let k = 0; k < n; k++) {
      // Un poco girada, para que se vea de lado y no de frente.
      const a = rad(90 - 180 / n + 20 + (360 * k) / n);
      base.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
    }
    const atras = (p) => p[1] < cy - 0.5;
    // Los vértices de los extremos forman el contorno: sus aristas se ven.
    const xs = base.map((p) => p[0]);
    const contorno = (p) => p[0] === Math.min(...xs) || p[0] === Math.max(...xs);
    const oculto = (p) => atras(p) && !contorno(p);
    const top = base.map(([x, y]) => [x, y - H]);
    const apex = [cx, cy - H - ry];
    if (tipo === "prisma") {
      out += `<polygon points="${top.map(pt).join(" ")}" fill="var(--color-teal-tint)"/>`;
      base.forEach((p, k) => {
        const q = base[(k + 1) % n];
        if (!atras([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2])) out += `<polygon points="${[p, q, top[(k + 1) % n], top[k]].map(pt).join(" ")}" fill="var(--color-indigo-tint)"/>`;
      });
      base.forEach((p, k) => {
        const q = base[(k + 1) % n];
        const oculta = atras([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]);
        out += linea(p, q, oculta);
        out += linea(top[k], top[(k + 1) % n]);
        out += linea(p, top[k], oculto(p));
      });
    } else {
      base.forEach((p, k) => {
        const q = base[(k + 1) % n];
        if (!atras([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2])) out += `<polygon points="${[p, q, apex].map(pt).join(" ")}" fill="var(--color-indigo-tint)"/>`;
      });
      base.forEach((p, k) => {
        const q = base[(k + 1) % n];
        out += linea(p, q, atras([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]));
        out += linea(p, apex, oculto(p));
      });
    }
  } else if (tipo === "cilindro" || tipo === "cono") {
    const arco = (y, delante) => `<path d="M ${cx - rx} ${y} A ${rx} ${ry} 0 0 ${delante ? 0 : 1} ${cx + rx} ${y}" fill="none" stroke="var(--text)" stroke-width="${delante ? 2.5 : 1.5}"${delante ? "" : ' stroke-dasharray="5 4"'}/>`;
    if (tipo === "cilindro") {
      out += `<path d="M ${cx - rx} ${cy} L ${cx - rx} ${cy - H} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy - H} L ${cx + rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy} Z" fill="var(--color-indigo-tint)"/>`;
      out += `<ellipse cx="${cx}" cy="${cy - H}" rx="${rx}" ry="${ry}" fill="var(--color-teal-tint)" stroke="var(--text)" stroke-width="2.5"/>`;
      out += linea([cx - rx, cy], [cx - rx, cy - H]) + linea([cx + rx, cy], [cx + rx, cy - H]);
    } else {
      const apex = [cx, cy - H - ry];
      out += `<path d="M ${cx - rx} ${cy} L ${pt(apex)} L ${cx + rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy} Z" fill="var(--color-indigo-tint)"/>`;
      out += linea([cx - rx, cy], apex) + linea([cx + rx, cy], apex);
    }
    out += arco(cy, true) + arco(cy, false);
  } else {
    const R = size * 0.34;
    const c2 = size * 0.52;
    out += `<circle cx="${cx}" cy="${c2}" r="${R}" fill="var(--color-indigo-tint)" stroke="var(--text)" stroke-width="2.5"/>`;
    out += `<path d="M ${cx - R} ${c2} A ${R} ${R * 0.3} 0 0 0 ${cx + R} ${c2}" fill="none" stroke="var(--text)" stroke-width="2"/>`;
    out += `<path d="M ${cx - R} ${c2} A ${R} ${R * 0.3} 0 0 1 ${cx + R} ${c2}" fill="none" stroke="var(--text)" stroke-width="1.5" stroke-dasharray="5 4"/>`;
  }
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" style="max-width:100%" role="img" aria-label="Cuerpo geométrico">${out}</svg>`;
}

// ------------------------------------------------------------
// Desarrollos planos
// ------------------------------------------------------------
// Polígono regular de n lados construido hacia fuera sobre el lado AB.
function poligonoSobre(A, B, n, haciaFuera) {
  const pts = [A, B];
  let [dx, dy] = [B[0] - A[0], B[1] - A[1]];
  const giro = rad(360 / n) * (haciaFuera ? 1 : -1);
  let p = B;
  for (let k = 2; k < n; k++) {
    [dx, dy] = [dx * Math.cos(giro) - dy * Math.sin(giro), dx * Math.sin(giro) + dy * Math.cos(giro)];
    p = [p[0] + dx, p[1] + dy];
    pts.push(p);
  }
  return pts;
}

function encajar(formas, W = 280, Hmax = 240) {
  const todos = formas.flatMap((f) => (f.circ ? [[f.c[0] - f.r, f.c[1] - f.r], [f.c[0] + f.r, f.c[1] + f.r]] : f.pts));
  const xs = todos.map((p) => p[0]);
  const ys = todos.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  const s = Math.min((W - 20) / (Math.max(...xs) - x0), (Hmax - 20) / (Math.max(...ys) - y0));
  const T = ([x, y]) => [10 + (x - x0) * s, 10 + (y - y0) * s];
  const ancho = (Math.max(...xs) - x0) * s + 20;
  const alto = (Math.max(...ys) - y0) * s + 20;
  let out = "";
  formas.forEach((f) => {
    const fill = f.fill || "var(--color-indigo-tint)";
    if (f.circ) {
      const [x, y] = T(f.c);
      out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(f.r * s).toFixed(1)}" fill="${fill}" stroke="var(--color-indigo)" stroke-width="2.5"/>`;
    } else if (f.sector) {
      const [a, b, c] = f.pts.map(T);
      out += `<path d="M ${pt(a)} L ${pt(b)} A ${(f.r * s).toFixed(1)} ${(f.r * s).toFixed(1)} 0 0 1 ${pt(c)} Z" fill="${fill}" stroke="var(--color-indigo)" stroke-width="2.5"/>`;
    } else {
      out += `<polygon points="${f.pts.map(T).map(pt).join(" ")}" fill="${fill}" stroke="${f.stroke || "var(--color-indigo)"}" stroke-width="2.5" stroke-linejoin="round"/>`;
    }
    if (f.txt) {
      const [x, y] = T(f.c || f.pts.reduce((a, p) => [a[0] + p[0] / f.pts.length, a[1] + p[1] / f.pts.length], [0, 0]));
      out += `<text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="800" fill="var(--text)">${f.txt}</text>`;
    }
  });
  return `<svg viewBox="0 0 ${ancho.toFixed(0)} ${alto.toFixed(0)}" width="${Math.min(ancho, W).toFixed(0)}" style="max-width:100%" role="img" aria-label="Desarrollo plano">${out}</svg>`;
}

function svgDesarrollo(tipo, n = 4) {
  if (tipo === "cubo") return svgRed(new Set(["1,0", "0,1", "1,1", "2,1", "3,1", "1,2"]));
  if (tipo === "prisma") {
    const w = 1;
    const h = n <= 4 ? 1.6 : 1.3;
    const formas = [];
    for (let k = 0; k < n; k++) formas.push({ pts: [[k * w, 0], [(k + 1) * w, 0], [(k + 1) * w, h], [k * w, h]] });
    formas.push({ pts: poligonoSobre([0, 0], [w, 0], n, false), fill: "var(--color-teal-tint)" });
    formas.push({ pts: poligonoSobre([w, h], [0, h], n, false), fill: "var(--color-teal-tint)" });
    return encajar(formas);
  }
  if (tipo === "piramide") {
    const base = [];
    const R = 1 / (2 * Math.sin(Math.PI / n));
    for (let k = 0; k < n; k++) {
      const a = rad(90 + 180 / n + (360 * k) / n);
      base.push([R * Math.cos(a), R * Math.sin(a)]);
    }
    const formas = [{ pts: base, fill: "var(--color-teal-tint)" }];
    base.forEach((p, k) => {
      const q = base[(k + 1) % n];
      const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      const L = Math.hypot(m[0], m[1]) || 1;
      const h = 1.3;
      formas.push({ pts: [p, q, [m[0] + (m[0] / L) * h, m[1] + (m[1] / L) * h]] });
    });
    return encajar(formas);
  }
  if (tipo === "cilindro") {
    const r = 0.5;
    const L = 2 * Math.PI * r;
    return encajar([
      { pts: [[0, 0], [L, 0], [L, 1.6], [0, 1.6]] },
      { circ: true, c: [L / 2, -r], r, fill: "var(--color-teal-tint)" },
      { circ: true, c: [L / 2, 1.6 + r], r, fill: "var(--color-teal-tint)" },
    ]);
  }
  // Cono: sector de radio g y ángulo 360·r/g, y un círculo de radio r.
  const g = 2;
  const r = 0.6;
  const ang = 360 * (r / g);
  const a1 = 90 - ang / 2;
  const a2 = 90 + ang / 2;
  const P = (a) => [g * Math.cos(rad(a)), g * Math.sin(rad(a))];
  const tangente = P(90);
  return encajar([
    { sector: true, pts: [[0, 0], P(a1), P(a2)], r: g },
    { circ: true, c: [tangente[0], tangente[1] + r], r, fill: "var(--color-teal-tint)" },
  ]);
}

// Red de 6 cuadrados (celdas "x,y") y las marcadas en otro color.
function svgRed(celdas, marcadas = new Set()) {
  const cs = [...celdas].map((k) => k.split(",").map(Number));
  const minX = Math.min(...cs.map((c) => c[0]));
  const minY = Math.min(...cs.map((c) => c[1]));
  const cols = Math.max(...cs.map((c) => c[0])) - minX + 1;
  const rows = Math.max(...cs.map((c) => c[1])) - minY + 1;
  const t = Math.min(44, Math.floor(260 / Math.max(cols, rows)));
  let out = "";
  cs.forEach(([x, y]) => {
    const m = marcadas.has(`${x},${y}`);
    out += `<rect x="${10 + (x - minX) * t}" y="${10 + (y - minY) * t}" width="${t}" height="${t}" fill="${m ? "var(--color-amber-tint)" : "var(--color-indigo-tint)"}" stroke="${m ? "var(--color-amber)" : "var(--color-indigo)"}" stroke-width="2.5"/>`;
  });
  const W = cols * t + 20;
  const H = rows * t + 20;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="Desarrollo de seis cuadrados">${out}</svg>`;
}

// ------------------------------------------------------------
// ¿Este desarrollo forma un cubo? Se «rueda» un dado por la red:
// es un cubo si cada cuadrado queda en una cara distinta.
// ------------------------------------------------------------
const RODAR = {
  // [dx, dy]: nueva cara de abajo y el resto de la orientación.
  "1,0": (o) => ({ D: o.E, U: o.W, E: o.U, W: o.D, N: o.N, S: o.S }),
  "-1,0": (o) => ({ D: o.W, U: o.E, W: o.U, E: o.D, N: o.N, S: o.S }),
  "0,1": (o) => ({ D: o.S, U: o.N, S: o.U, N: o.D, E: o.E, W: o.W }),
  "0,-1": (o) => ({ D: o.N, U: o.S, N: o.U, S: o.D, E: o.E, W: o.W }),
};

function plegar(celdas) {
  const lista = [...celdas];
  const cara = { [lista[0]]: { D: 1, U: 2, N: 3, S: 4, E: 5, W: 6 } };
  const cola = [lista[0]];
  while (cola.length) {
    const k = cola.shift();
    const [x, y] = k.split(",").map(Number);
    for (const d of Object.keys(RODAR)) {
      const [dx, dy] = d.split(",").map(Number);
      const v = `${x + dx},${y + dy}`;
      if (celdas.has(v) && !cara[v]) {
        cara[v] = RODAR[d](cara[k]);
        cola.push(v);
      }
    }
  }
  const abajo = {};
  lista.forEach((k) => (abajo[k] = cara[k].D));
  return abajo;
}

function formaCubo(celdas) {
  const abajo = plegar(celdas);
  return new Set(Object.values(abajo)).size === 6;
}

// Las que chocan: cuadrados que acabarían en la misma cara.
function chocan(celdas) {
  const abajo = plegar(celdas);
  const porCara = {};
  Object.entries(abajo).forEach(([k, c]) => (porCara[c] = [...(porCara[c] || []), k]));
  return new Set(Object.values(porCara).filter((l) => l.length > 1).flat());
}

function redAzar() {
  const celdas = new Set(["0,0"]);
  while (celdas.size < 6) {
    const [x, y] = pick([...celdas]).split(",").map(Number);
    const [dx, dy] = pick([[1, 0], [-1, 0], [0, 1], [0, -1]]);
    celdas.add(`${x + dx},${y + dy}`);
  }
  return celdas;
}

function redDe(valida) {
  let c;
  do c = redAzar();
  while (formaCubo(c) !== valida);
  return c;
}

// ------------------------------------------------------------
// Niveles
// ------------------------------------------------------------
const LEVELS = {
  normal: { n: [3, 4, 5, 6] },
  facil: { n: [3, 4] },
  acs: { n: [4] },
  altas: { n: [3, 4, 5, 6, 7, 8], altas: true },
};

function cuerpoAzar(L, { redondos = true } = {}) {
  const tipos = L === LEVELS.acs ? ["cubo", "prisma", "cilindro", "cono", "esfera"] : redondos ? ["prisma", "prisma", "piramide", "piramide", "cubo", "cilindro", "cono", "esfera"] : ["prisma", "prisma", "piramide", "piramide", "cubo"];
  const tipo = pick(tipos);
  return { tipo, n: pick(L.n) };
}

// ------------------------------------------------------------
// Generadores
// ------------------------------------------------------------
const DESCRIPCION = {
  cubo: "6 caras, todas cuadrados iguales",
  cilindro: "dos bases que son círculos y una superficie curva",
  cono: "una base que es un círculo, una superficie curva y un vértice (la cúspide)",
  esfera: "solo una superficie curva: todos sus puntos están a la misma distancia del centro",
};

function porQue(tipo, n) {
  if (tipo === "prisma") return `tiene dos bases iguales y paralelas, que son ${POLIGONO[n]}, y sus caras laterales son rectángulos`;
  if (tipo === "piramide") return `tiene una sola base, que es un ${POLIGONO1[n]}, y sus caras laterales son triángulos que se juntan en un vértice`;
  return `tiene ${DESCRIPCION[tipo]}`;
}

function genIdentificar(L) {
  const { tipo, n } = cuerpoAzar(L);
  const correct = nombreCuerpo(tipo, n);
  let cands;
  if (tipo === "prisma" || tipo === "piramide") {
    const otro = tipo === "prisma" ? "piramide" : "prisma";
    cands = [nombreCuerpo(otro, n), nombreCuerpo(tipo, n === 3 ? 4 : n - 1), nombreCuerpo(tipo, n + 1 > 8 ? 3 : n + 1), nombreCuerpo(otro, n + 1 > 8 ? 3 : n + 1)];
    if (L === LEVELS.acs) cands = ["Cubo", "Cilindro", "Pirámide cuadrangular"];
  } else cands = shuffle(["Cubo", "Cilindro", "Cono", "Esfera", "Prisma cuadrangular", "Pirámide cuadrangular"]);
  return {
    instruction: "¿Qué cuerpo geométrico es?",
    display: correct,
    visual: svgCuerpo(tipo, n),
    soloVisual: true,
    options: uniqueOptions(correct, cands),
    correct,
    hint: "¿Tiene dos bases iguales (prisma) o una base y un vértice arriba (pirámide)? ¿Cuántos lados tiene la base? ¿Tiene partes curvas?",
    explain: `Es ${tipo === "piramide" || ["cilindro", "cono", "esfera"].includes(tipo) ? "una" : "un"} ${correct.toLowerCase()}: ${porQue(tipo, n)}.`.replace("una cilindro", "un cilindro").replace("una cono", "un cono"),
  };
}

const OBJETOS = [
  ["un dado", "Cubo"],
  ["un cubito de hielo", "Cubo"],
  ["una caja de zapatos", "Prisma cuadrangular"],
  ["un ladrillo", "Prisma cuadrangular"],
  ["un tetrabrik de leche", "Prisma cuadrangular"],
  ["una tienda de campaña canadiense", "Prisma triangular"],
  ["un lápiz sin afilar de seis caras", "Prisma hexagonal"],
  ["una pirámide de Egipto", "Pirámide cuadrangular"],
  ["una lata de refresco", "Cilindro"],
  ["un rollo de papel de cocina", "Cilindro"],
  ["un cucurucho de helado", "Cono"],
  ["un cono de tráfico", "Cono"],
  ["una pelota de fútbol", "Esfera"],
  ["una canica", "Esfera"],
];

function genObjetos(L) {
  const lista = L === LEVELS.acs ? OBJETOS.filter(([, c]) => ["Cubo", "Cilindro", "Esfera", "Cono"].includes(c)) : OBJETOS;
  const [obj, correct] = pick(lista);
  const cands = L === LEVELS.acs ? ["Cubo", "Cilindro", "Esfera", "Cono"] : shuffle([...new Set(OBJETOS.map((o) => o[1]))]);
  return {
    instruction: "¿A qué cuerpo geométrico se parece?",
    display: `${obj[0].toUpperCase()}${obj.slice(1)}.`,
    options: uniqueOptions(correct, cands),
    correct,
    hint: "Piensa en sus caras: ¿son planas o curvas? ¿Qué forma tiene la base?",
    explain: `Se parece a ${/^(Pirámide|Esfera)/.test(correct) ? "una" : "un"} ${correct.toLowerCase()}: ${(() => {
      if (correct.startsWith("Prisma")) return porQue("prisma", Number(Object.keys(BASE).find((k) => correct.endsWith(BASE[k]))));
      if (correct.startsWith("Pirámide")) return porQue("piramide", 4);
      return porQue(correct.toLowerCase(), 4);
    })()}.`,
  };
}

function genPoliedroRedondo(L) {
  const usarObjeto = Math.random() < 0.5;
  let nombre;
  if (usarObjeto) nombre = pick(L === LEVELS.acs ? OBJETOS.filter(([, c]) => ["Cubo", "Cilindro", "Esfera", "Cono", "Prisma cuadrangular"].includes(c)) : OBJETOS);
  else {
    const { tipo, n } = cuerpoAzar(L);
    nombre = [null, nombreCuerpo(tipo, n)];
  }
  const cuerpo = nombre[1];
  const redondo = ["Cilindro", "Cono", "Esfera"].includes(cuerpo);
  const correct = redondo ? "Cuerpo redondo" : "Poliedro";
  return {
    instruction: "¿Es un poliedro o un cuerpo redondo?",
    display: usarObjeto ? `${nombre[0][0].toUpperCase()}${nombre[0].slice(1)} (${cuerpo.toLowerCase()}).` : `${cuerpo}.`,
    options: ["Poliedro", "Cuerpo redondo"],
    keepOrder: true,
    correct,
    hint: "Los poliedros tienen todas sus caras planas (polígonos). Los cuerpos redondos tienen alguna superficie curva: ruedan.",
    explain: redondo ? `${cuerpo}: tiene una superficie curva, así que es un cuerpo redondo.` : `${cuerpo}: todas sus caras son planas (polígonos), así que es un poliedro.`,
  };
}

function genCAV(L) {
  const tipo = L === LEVELS.acs ? "cubo" : pick(["prisma", "prisma", "piramide", "piramide", "cubo"]);
  const n = tipo === "cubo" ? 4 : pick(L.n);
  const nombre = nombreCuerpo(tipo, n);
  const k = cav(tipo, n);
  const que = pick([["C", "caras", "Cuántas"], ["A", "aristas", "Cuántas"], ["V", "vértices", "Cuántos"]]);
  const v = k[que[0]];
  const cands = [k.C, k.A, k.V, n, v + 1, v - 1, v + 2].filter((x) => x !== v && x > 0).map(String);
  let explain;
  if (tipo === "cubo") explain = { C: "6 caras: arriba, abajo y 4 alrededor.", A: "12 aristas: 4 abajo, 4 arriba y 4 de pie.", V: "8 vértices: 4 abajo y 4 arriba." }[que[0]];
  else if (tipo === "prisma") explain = { C: `2 bases + ${n} caras laterales = ${k.C} caras.`, A: `${n} aristas en cada base (2 × ${n} = ${2 * n}) + ${n} aristas de pie = ${k.A} aristas.`, V: `${n} vértices en cada base: 2 × ${n} = ${k.V} vértices.` }[que[0]];
  else explain = { C: `1 base + ${n} caras laterales (triángulos) = ${k.C} caras.`, A: `${n} aristas en la base + ${n} que suben al vértice = ${k.A} aristas.`, V: `${n} vértices en la base + 1 arriba = ${k.V} vértices.` }[que[0]];
  return {
    instruction: `¿${que[2]} ${que[1]} tiene ${tipo === "piramide" ? "esta" : "este"} ${nombre.toLowerCase()}?`,
    display: String(v),
    visual: svgCuerpo(tipo, n),
    soloVisual: true,
    options: uniqueOptions(String(v), cands),
    correct: String(v),
    hint: { caras: "Las caras son los polígonos que lo forman. Cuenta las bases y las caras de los lados.", aristas: "Las aristas son las líneas donde se juntan dos caras. Las líneas discontinuas son las de atrás: también cuentan.", vértices: "Los vértices son las esquinas, donde se juntan las aristas. Cuenta también las de atrás." }[que[1]],
    explain,
  };
}

function genDesarrollo(L) {
  const tipos = L === LEVELS.acs ? ["cubo", "cilindro", "piramide"] : ["prisma", "prisma", "piramide", "piramide", "cubo", "cilindro", "cono"];
  const tipo = pick(tipos);
  const n = tipo === "cubo" || L === LEVELS.acs ? 4 : pick(L.n);
  const correct = nombreCuerpo(tipo, n);
  let cands;
  if (tipo === "prisma" || tipo === "piramide") cands = [nombreCuerpo(tipo === "prisma" ? "piramide" : "prisma", n), nombreCuerpo(tipo, n === 3 ? 4 : n - 1), nombreCuerpo(tipo, n + 1), "Cubo"];
  else cands = shuffle(["Cilindro", "Cono", "Cubo", "Prisma cuadrangular", "Pirámide cuadrangular"]);
  const piezas = {
    cubo: "6 cuadrados iguales",
    cilindro: "2 círculos (las bases) y un rectángulo (la superficie curva desenrollada)",
    cono: "un círculo (la base) y un sector circular (la superficie curva)",
    prisma: `2 ${POLIGONO[n]} (las bases) y ${n} rectángulos (las caras laterales)`,
    piramide: `1 ${POLIGONO1[n]} (la base) y ${n} triángulos (las caras laterales)`,
  }[tipo];
  return {
    instruction: "Si recortas y doblas este desarrollo, ¿qué cuerpo se forma?",
    display: correct,
    visual: svgDesarrollo(tipo, n),
    soloVisual: true,
    options: uniqueOptions(correct, cands),
    correct,
    hint: "Cuenta las piezas: ¿hay dos bases iguales o una sola? ¿Las caras de los lados son rectángulos o triángulos?",
    explain: `Tiene ${piezas}: es el desarrollo de ${tipo === "piramide" ? "una" : "un"} ${correct.toLowerCase()}.`,
  };
}

function genCuboRed() {
  const valida = Math.random() < 0.5;
  const celdas = redDe(valida);
  return {
    instruction: "¿Se puede construir un cubo con este desarrollo?",
    display: valida ? "Sí" : "No",
    visual: svgRed(celdas),
    soloVisual: true,
    options: ["Sí", "No"],
    keepOrder: true,
    correct: valida ? "Sí" : "No",
    hint: "Imagina que doblas los cuadrados hacia arriba alrededor de uno que hace de suelo. ¿Quedan dos cuadrados en el mismo sitio? ¿Falta alguna cara?",
    explain: valida
      ? "Sí: al doblarlo, cada cuadrado ocupa una cara distinta del cubo. Puedes comprobarlo en Explora."
      : "No: al doblarlo, dos cuadrados se montarían en la misma cara y otra cara quedaría sin tapar. Compruébalo en Explora.",
  };
}

// 6º: fórmula de Euler.
function genEuler(L) {
  const tipo = pick(["prisma", "piramide", "cubo"]);
  const n = tipo === "cubo" ? 4 : pick(L.altas ? [5, 6, 7, 8, 10, 12] : L.n);
  const k = cav(tipo, n);
  const falta = pick(["C", "V", "A"]);
  const nombres = { C: "caras", V: "vértices", A: "aristas" };
  const dados = ["C", "V", "A"].filter((x) => x !== falta).map((x) => `${k[x]} ${nombres[x]}`).join(" y ");
  const v = k[falta];
  const op = { C: `C = ${k.A} + 2 − ${k.V} = ${k.C}`, V: `V = ${k.A} + 2 − ${k.C} = ${k.V}`, A: `A = ${k.C} + ${k.V} − 2 = ${k.A}` }[falta];
  return {
    instruction: `¿${falta === "V" ? "Cuántos" : "Cuántas"} ${nombres[falta]} tiene? Usa la fórmula de Euler: C + V = A + 2.`,
    display: `Un${tipo === "piramide" ? "a" : ""} ${nombreCuerpo(tipo, n).toLowerCase()} tiene ${dados}.`,
    options: uniqueOptions(String(v), [k.C, k.V, k.A, v + 2, v - 2].filter((x) => x !== v && x > 0).map(String)),
    correct: String(v),
    hint: "En todos los poliedros como estos: caras + vértices = aristas + 2.",
    explain: `${op}. Comprobación: ${k.C} + ${k.V} = ${k.C + k.V} y ${k.A} + 2 = ${k.A + 2}.`,
  };
}

// 6º: cuerpos de revolución.
function genRevolucion() {
  const casos = [
    ["un rectángulo alrededor de uno de sus lados", "Cilindro", "el lado que gira dibuja la superficie curva y los otros dos, los círculos de las bases"],
    ["un triángulo rectángulo alrededor de uno de sus catetos (los lados del ángulo recto)", "Cono", "el cateto es la altura, el otro cateto dibuja la base y la hipotenusa, la superficie curva"],
    ["un semicírculo alrededor de su diámetro", "Esfera", "la curva del semicírculo dibuja toda la superficie de la esfera"],
  ];
  const [fig, sol, porque] = pick(casos);
  return {
    instruction: "¿Qué cuerpo de revolución se forma?",
    display: `Haces girar ${fig}.`,
    options: uniqueOptions(sol, shuffle(["Cilindro", "Cono", "Esfera", "Prisma cuadrangular"])),
    correct: sol,
    hint: "Imagina la figura pegada a un palo que gira muy deprisa. ¿Qué forma deja?",
    explain: `${sol}: ${porque}. Los cuerpos redondos se llaman también cuerpos de revolución.`,
  };
}

// Altas: poliedros regulares.
const REGULARES = [
  ["Tetraedro", 4, "triángulos"],
  ["Cubo", 6, "cuadrados"],
  ["Octaedro", 8, "triángulos"],
  ["Dodecaedro", 12, "pentágonos"],
  ["Icosaedro", 20, "triángulos"],
];

function genRegulares() {
  const [nombre, caras, forma] = pick(REGULARES);
  return {
    instruction: "¿Qué poliedro regular es?",
    display: `Tiene ${caras} caras, todas ${forma} iguales.`,
    options: uniqueOptions(nombre, shuffle(REGULARES.map((r) => r[0]))),
    correct: nombre,
    hint: "En griego: tetra = 4, hexa = 6, octa = 8, dodeca = 12, icosa = 20. Al cubo también se le llama hexaedro.",
    explain: `${nombre}: ${caras} caras que son ${forma} iguales. Solo hay cinco poliedros regulares: tetraedro, cubo, octaedro, dodecaedro e icosaedro.`,
  };
}

const MODE_GROUPS = {
  identificar: [genIdentificar, genIdentificar, genObjetos, genPoliedroRedondo],
  cav: [genCAV],
  desarrollo: [genDesarrollo, genDesarrollo, genCuboRed],
  mas6: [genEuler, genRevolucion],
};

// La mezcla es de los contenidos de 5º; los de 6º se eligen aparte.
const MEZCLA = ["identificar", "cav", "desarrollo"];

const ACS_GENERATORS = [genIdentificar, genObjetos, genPoliedroRedondo, genCAV, genDesarrollo];

const CUERPOS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Los cuerpos más conocidos (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja reconocer el cubo, el prisma cuadrangular (una caja), el cilindro, el cono y la esfera en dibujos y en objetos, distinguir poliedros y cuerpos redondos, contar las caras, aristas y vértices del cubo y reconocer los desarrollos más sencillos.",
    example: "Una lata → cilindro · Un dado → cubo, con 6 caras",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantienen los mismos cuerpos, pero con una tipografía más legible para leer las preguntas y las opciones.",
    example: "Prisma pentagonal → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Identificar» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todos los contenidos, con bases de 3 y 4 lados y la pista a la vista",
    text: "Se trabajan todos los modos con prismas y pirámides de base triangular o cuadrangular, para contar menos caras, aristas y vértices, y con la pista abierta desde el principio. Sin «Mezcla». En Explora se pueden construir los cuerpos y ver sus números.",
    example: "Prisma triangular: 5 caras, 9 aristas y 6 vértices",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Bases de hasta 8 lados, Euler y poliedros regulares",
    text: "Empieza en <strong>Euler y cuerpos de revolución</strong>, con prismas y pirámides de hasta 12 lados en la base, la fórmula de Euler, los cuerpos de revolución y los cinco poliedros regulares.",
    example: "Un prisma decagonal tiene 12 caras y 20 vértices → 30 aristas",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Qué cuerpo geométrico es? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  renderTeoria();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, CUERPOS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), CUERPOS_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("cg-construir")) initExplore();
  if (document.getElementById("word-display")) initGame(diff, (fn) => restartCallbacks.push(fn));
});

function renderTeoria() {
  document.querySelectorAll("[data-cg-dibujo]").forEach((el) => {
    const [tipo, n, que] = el.dataset.cgDibujo.split(":");
    el.innerHTML = que === "red" ? svgDesarrollo(tipo, Number(n)) : svgCuerpo(tipo, Number(n), { size: 150 });
  });
}

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
  // 1. Construir prismas y pirámides.
  let tipo = "prisma";
  let n = 5;
  function renderConstruir() {
    document.getElementById("cg-n").textContent = n;
    document.querySelectorAll("[data-cg-tipo]").forEach((b) => b.classList.toggle("active", b.dataset.cgTipo === tipo));
    document.getElementById("cg-cuerpo").innerHTML = svgCuerpo(tipo, n, { size: 200 });
    document.getElementById("cg-red").innerHTML = svgDesarrollo(tipo, n);
    const k = cav(tipo, n);
    const regla = tipo === "prisma" ? `caras = ${n} + 2 · aristas = 3 × ${n} · vértices = 2 × ${n}` : `caras = ${n} + 1 · aristas = 2 × ${n} · vértices = ${n} + 1`;
    document.getElementById("cg-construir-msg").innerHTML = `<strong>${nombreCuerpo(tipo, n)}</strong>: ${k.C} caras, ${k.A} aristas y ${k.V} vértices (${regla}). Euler (6º): ${k.C} + ${k.V} = ${k.C + k.V} = ${k.A} + 2.`;
  }
  document.querySelectorAll("[data-cg-tipo]").forEach((b) => b.addEventListener("click", () => { tipo = b.dataset.cgTipo; renderConstruir(); }));
  document.querySelectorAll("[data-cg-n]").forEach((b) => b.addEventListener("click", () => { n = Math.max(3, Math.min(8, n + Number(b.dataset.cgN))); renderConstruir(); }));

  // 2. ¿Forma un cubo?
  let red = redDe(true);
  let doblado = false;
  function renderRed() {
    const valida = formaCubo(red);
    document.getElementById("cg-cubo-draw").innerHTML = svgRed(red, doblado && !valida ? chocan(red) : new Set());
    const msg = document.getElementById("cg-cubo-msg");
    if (!doblado) {
      msg.className = "md-msg ok";
      msg.innerHTML = "¿Crees que este desarrollo forma un cubo? Piénsalo y pulsa «Doblarlo».";
    } else if (valida) {
      msg.className = "md-msg ok";
      msg.innerHTML = "<strong>Sí, forma un cubo</strong>: cada cuadrado acaba en una cara distinta.";
    } else {
      msg.className = "md-msg ko";
      msg.innerHTML = "<strong>No forma un cubo</strong>: los cuadrados naranjas acaban en la misma cara, uno encima del otro, y otra cara se queda sin tapar.";
    }
  }
  document.getElementById("cg-doblar").addEventListener("click", () => { doblado = true; renderRed(); });
  document.getElementById("cg-otra").addEventListener("click", () => { red = redDe(Math.random() < 0.5); doblado = false; renderRed(); });

  renderConstruir();
  renderRed();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-cuerpos"),
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
  let mode = "identificar";
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

    if (diff.is("altas")) setActiveMode("mas6");
    else if (acs) setActiveMode("identificar");
    else if ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla") setActiveMode("identificar");

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function generatorsFor() {
    if (diff.is("acs")) return ACS_GENERATORS;
    if (mode === "mezcla") return MODE_GROUPS[pick(MEZCLA)];
    if (diff.is("altas") && mode === "mas6") return [...MODE_GROUPS.mas6, genRegulares];
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
    AppProgress.record("cuerpos-geometricos", isCorrect);
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
