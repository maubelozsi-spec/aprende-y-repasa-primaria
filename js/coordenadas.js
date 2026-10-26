// ============================================================
// Coordenadas, simetrías, traslaciones y giros (5º T3: el plano y
// las coordenadas en el primer cuadrante, traslaciones y giros;
// 6º SdA 7: los cuatro cuadrantes con números enteros, simetrías
// respecto a los ejes, giros y semejanza)
// - Explora: mover un punto, mover una figura y ampliar o reducir.
//   No guarda progreso.
// - Práctica: los puntos y las figuras se generan al azar y cada
//   pregunta trae su pista y su explicación. Solo la práctica llama
//   a AppProgress.
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

// En el plano de 5º no se ofrecen opciones con números negativos.
function opciones(p, correct, cands) {
  return uniqueOptions(correct, p === "1" ? cands.filter((c) => !c.includes("−")) : cands);
}

// Números con el signo menos tipográfico.
const num = (n) => (n < 0 ? `−${-n}` : String(n));
const par = (x, y) => `(${num(x)}, ${num(y)})`;
const vec = (dx, dy) => `(${dx > 0 ? "+" : ""}${num(dx)}, ${dy > 0 ? "+" : ""}${num(dy)})`;
const cuadros = (n) => `${n} ${n === 1 ? "cuadro" : "cuadros"}`;

// "3 cuadros a la derecha y 2 hacia abajo"
function pasos(dx, dy) {
  const h = dx ? `${cuadros(Math.abs(dx))} a la ${dx > 0 ? "derecha" : "izquierda"}` : "";
  const v = dy ? `${dx ? Math.abs(dy) : cuadros(Math.abs(dy))} hacia ${dy > 0 ? "arriba" : "abajo"}` : "";
  return h && v ? `${h} y ${v}` : h || v || "ningún cuadro";
}

// "3 a la derecha y 5 hacia arriba", sin la palabra cuadros.
function pasosCortos(dx, dy) {
  const h = dx ? `${Math.abs(dx)} a la ${dx > 0 ? "derecha" : "izquierda"}` : "";
  const v = dy ? `${Math.abs(dy)} hacia ${dy > 0 ? "arriba" : "abajo"}` : "";
  return h && v ? `${h} y ${v}` : h || v;
}

// ------------------------------------------------------------
// Planos: solo positivos (5º) o los cuatro cuadrantes (6º)
// ------------------------------------------------------------
const PLANOS = {
  1: { min: 0, max: 8, cell: 30 },
  4: { min: -6, max: 6, cell: 22 },
};

let planoId = 0;

// Dibuja el plano con los números de los ejes.
// puntos: [{x, y, label, color}] · figuras: [{pts, color, tint, labels}]
// recta: {x} o {y} · centro: {x, y, label} · flecha: {from, to}
function plano(p, { puntos = [], figuras = [], recta = null, centro = null, flecha = null } = {}) {
  const P = PLANOS[p];
  const m = 24;
  const n = P.max - P.min;
  const total = n * P.cell + m * 2;
  const sx = (x) => m + (x - P.min) * P.cell;
  const sy = (y) => m + (P.max - y) * P.cell;
  const id = `co-flecha-${++planoId}`;
  let out = "";

  for (let i = P.min; i <= P.max; i++) {
    out += `<line x1="${sx(i)}" y1="${sy(P.min)}" x2="${sx(i)}" y2="${sy(P.max)}" stroke="var(--border-strong)" stroke-width="1"/>`;
    out += `<line x1="${sx(P.min)}" y1="${sy(i)}" x2="${sx(P.max)}" y2="${sy(i)}" stroke="var(--border-strong)" stroke-width="1"/>`;
  }
  // Ejes y sus números.
  out += `<line x1="${sx(P.min)}" y1="${sy(0)}" x2="${sx(P.max)}" y2="${sy(0)}" stroke="var(--text)" stroke-width="2.5"/>`;
  out += `<line x1="${sx(0)}" y1="${sy(P.min)}" x2="${sx(0)}" y2="${sy(P.max)}" stroke="var(--text)" stroke-width="2.5"/>`;
  out += `<text x="${sx(P.max) + 4}" y="${sy(0) + 4}" font-size="12" font-weight="800" fill="var(--text)">X</text>`;
  out += `<text x="${sx(0) - 4}" y="${sy(P.max) - 8}" text-anchor="middle" font-size="12" font-weight="800" fill="var(--text)">Y</text>`;
  for (let i = P.min; i <= P.max; i++) {
    if (i === 0) continue;
    out += `<text x="${sx(i)}" y="${sy(0) + 14}" text-anchor="middle" font-size="10" fill="var(--text-muted)">${num(i)}</text>`;
    out += `<text x="${sx(0) - 5}" y="${sy(i) + 4}" text-anchor="end" font-size="10" fill="var(--text-muted)">${num(i)}</text>`;
  }
  out += `<text x="${sx(0) - 5}" y="${sy(0) + 14}" text-anchor="end" font-size="10" fill="var(--text-muted)">0</text>`;

  if (recta) {
    if (recta.x !== undefined)
      out += `<line x1="${sx(recta.x)}" y1="${sy(P.min) + 6}" x2="${sx(recta.x)}" y2="${sy(P.max) - 6}" stroke="var(--color-plum)" stroke-width="3" stroke-dasharray="7 5"/>`;
    else
      out += `<line x1="${sx(P.min) - 6}" y1="${sy(recta.y)}" x2="${sx(P.max) + 6}" y2="${sy(recta.y)}" stroke="var(--color-plum)" stroke-width="3" stroke-dasharray="7 5"/>`;
  }

  figuras.forEach((f) => {
    const color = f.color || "var(--color-indigo)";
    const pts = f.pts.map(([x, y]) => `${sx(x)},${sy(y)}`).join(" ");
    out += `<polygon points="${pts}" fill="${f.tint || "var(--color-indigo-tint)"}" fill-opacity="0.85" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`;
    (f.labels || []).forEach((l) => {
      out += `<circle cx="${sx(l.x)}" cy="${sy(l.y)}" r="4" fill="${color}"/>`;
      out += etiqueta(P, sx(l.x), sy(l.y), l.x, l.y, l.label, color);
    });
  });

  if (flecha) {
    const [x1, y1] = flecha.from;
    const [x2, y2] = flecha.to;
    out += `<defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-amber)"/></marker></defs>`;
    out += `<line x1="${sx(x1)}" y1="${sy(y1)}" x2="${sx(x2)}" y2="${sy(y2)}" stroke="var(--color-amber)" stroke-width="3" marker-end="url(#${id})"/>`;
  }

  if (centro) {
    out += `<circle cx="${sx(centro.x)}" cy="${sy(centro.y)}" r="6" fill="var(--surface)" stroke="var(--color-plum)" stroke-width="3"/>`;
    out += etiqueta(P, sx(centro.x), sy(centro.y), centro.x, centro.y, centro.label || "C", "var(--color-plum)");
  }

  puntos.forEach((pt) => {
    const color = pt.color || "var(--color-indigo)";
    out += `<circle cx="${sx(pt.x)}" cy="${sy(pt.y)}" r="5.5" fill="${color}"/>`;
    if (pt.label) out += etiqueta(P, sx(pt.x), sy(pt.y), pt.x, pt.y, pt.label, color);
  });

  return `<svg viewBox="0 0 ${total} ${total}" width="${total}" style="max-width:100%" role="img" aria-label="Plano de coordenadas">${out}</svg>`;
}

// Etiqueta de un punto, sin salirse del dibujo.
function etiqueta(P, cx, cy, x, y, txt, color) {
  const derecha = x < P.max;
  const arriba = y < P.max;
  return `<text x="${cx + (derecha ? 8 : -8)}" y="${cy + (arriba ? -8 : 17)}" text-anchor="${derecha ? "start" : "end"}" font-size="14" font-weight="800" fill="${color}" stroke="var(--surface)" stroke-width="3" paint-order="stroke">${txt}</text>`;
}

function similarRectSVG(w1, h1, w2, h2) {
  const cell = 18;
  const gap = 40;
  const margin = 20;
  const maxH = Math.max(h1, h2) * cell;
  const totalW = (w1 + w2) * cell + (w2 ? gap : 0) + margin * 2;
  const totalH = maxH + margin * 2 + 24;
  const x1 = margin;
  const y1 = margin + (maxH - h1 * cell);
  const x2 = x1 + w1 * cell + gap;
  const y2 = margin + (maxH - h2 * cell);
  const cuadricula = (x, y, w, h) => {
    let s = "";
    for (let i = 1; i < w; i++) s += `<line x1="${x + i * cell}" y1="${y}" x2="${x + i * cell}" y2="${y + h * cell}" stroke="var(--border-strong)" stroke-width="1"/>`;
    for (let j = 1; j < h; j++) s += `<line x1="${x}" y1="${y + j * cell}" x2="${x + w * cell}" y2="${y + j * cell}" stroke="var(--border-strong)" stroke-width="1"/>`;
    return s;
  };
  const ancho = Math.min(320, totalW);

  return `<svg viewBox="0 0 ${totalW} ${totalH}" width="${ancho}" style="max-width:100%" role="img" aria-label="Rectángulo de ${w1} por ${h1}${w2 ? ` y rectángulo de ${w2} por ${h2}` : ""}">
    <rect x="${x1}" y="${y1}" width="${w1 * cell}" height="${h1 * cell}" fill="var(--color-indigo-tint)" stroke="var(--color-indigo)" stroke-width="2"/>
    ${cuadricula(x1, y1, w1, h1)}
    <text x="${x1 + (w1 * cell) / 2}" y="${y1 + h1 * cell + 16}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--color-indigo)">${w1} × ${h1}</text>
    ${w2 ? `<rect x="${x2}" y="${y2}" width="${w2 * cell}" height="${h2 * cell}" fill="var(--color-teal-tint)" stroke="var(--color-teal)" stroke-width="2"/>
    ${cuadricula(x2, y2, w2, h2)}
    <text x="${x2 + (w2 * cell) / 2}" y="${y2 + h2 * cell + 16}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--color-teal)">${w2} × ${h2}</text>` : ""}
  </svg>`;
}

// ------------------------------------------------------------
// Movimientos
// ------------------------------------------------------------
// Giro de un vector: A = sentido contrario a las agujas del reloj,
// H = sentido de las agujas del reloj, M = media vuelta.
function rotar(dx, dy, sentido) {
  if (sentido === "A") return [-dy, dx];
  if (sentido === "H") return [dy, -dx];
  return [-dx, -dy];
}

function mover([x, y], mov) {
  if (mov.tipo === "tras") return [x + mov.dx, y + mov.dy];
  if (mov.tipo === "simV") return [2 * mov.k - x, y];
  if (mov.tipo === "simH") return [x, 2 * mov.k - y];
  const [rx, ry] = rotar(x - mov.cx, y - mov.cy, mov.sentido);
  return [mov.cx + rx, mov.cy + ry];
}

const GIRO_TXT = {
  A: "un cuarto de vuelta en sentido contrario a las agujas del reloj",
  H: "un cuarto de vuelta en el sentido de las agujas del reloj",
  M: "media vuelta",
};
const GIRO_TXT6 = {
  A: "90° en sentido contrario a las agujas del reloj",
  H: "90° en el sentido de las agujas del reloj",
  M: "180° (media vuelta)",
};
const DIR = { "1,0": "a la derecha", "-1,0": "a la izquierda", "0,1": "hacia arriba", "0,-1": "hacia abajo" };

// "los 3 a la derecha pasan a ser 3 hacia arriba y el 1 hacia arriba pasa a ser 1 a la izquierda"
function reglaGiro(dx, dy, sentido) {
  const partes = [];
  for (const [n, u] of [[dx, [Math.sign(dx), 0]], [dy, [0, Math.sign(dy)]]]) {
    if (!n) continue;
    const [a, b] = rotar(u[0], u[1], sentido);
    const k = Math.abs(n);
    partes.push(`${k === 1 ? "el 1" : `los ${k}`} ${DIR[u.join(",")]} ${k === 1 ? "pasa" : "pasan"} a ser ${k} ${DIR[`${a},${b}`]}`);
  }
  return partes.join(" y ");
}

// Figura en L de cuatro cuadros: no tiene ejes de simetría ni se
// parece a sí misma al girarla, así que cada movimiento se distingue.
const FIGURA_L = [[0, 0], [2, 0], [2, 1], [1, 1], [1, 3], [0, 3]];

const dentro = (p, lo, hi) => p.every(([x, y]) => x >= lo && x <= hi && y >= lo && y <= hi);
function caja(pts) {
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
}
function separadas(a, b) {
  const A = caja(a);
  const B = caja(b);
  return A.x1 <= B.x0 || B.x1 <= A.x0 || A.y1 <= B.y0 || B.y1 <= A.y0;
}

// ------------------------------------------------------------
// Niveles
// ------------------------------------------------------------
// max1: hasta dónde llegan los puntos en el plano de 5º.
// r4: hasta dónde llegan en el de 6º. paso: cuánto se mueven.
const LEVELS = {
  normal: { max1: 8, r4: 6, paso: 4, ejes: true },
  facil: { max1: 6, r4: 4, paso: 3, ejes: false },
  acs: { max1: 5, r4: 4, paso: 3, ejes: false },
  altas: { max1: 8, r4: 6, paso: 5, ejes: true, altas: true },
};

function rango(L, p) {
  if (p === "4") return [-L.r4, L.r4];
  return [L.ejes ? 0 : 1, L.max1];
}

// Un punto al azar del plano. En el de 6º casi siempre con algún
// número negativo, que es lo que hay que practicar.
function puntoAzar(L, p, { distintos = true } = {}) {
  const [lo, hi] = rango(L, p);
  let x;
  let y;
  let n = 0;
  do {
    x = randInt(lo, hi);
    y = randInt(lo, hi);
    n++;
    if (n > 200) break;
  } while (
    (distintos && x === y) ||
    (p === "4" && (x === 0 || y === 0) && Math.random() < 0.8) ||
    (p === "4" && x >= 0 && y >= 0 && Math.random() < 0.85) ||
    (p === "1" && (x === 0 || y === 0) && Math.random() < 0.85)
  );
  return [x, y];
}

const PISTA_LEER = {
  1: "Desde el 0, cuenta primero en horizontal (eje X) y después en vertical (eje Y). Primero se anda y después se sube.",
  4: "Primero la x (horizontal) y después la y (vertical). A la izquierda del 0 y por debajo del 0 los números son negativos.",
};

function lugar(x, y) {
  if (x === 0 && y === 0) return "Es el origen, donde se cruzan los ejes";
  if (x === 0) return `Está sobre el eje Y, así que no se mueve en horizontal (x = 0) y va ${cuadros(Math.abs(y))} hacia ${y > 0 ? "arriba" : "abajo"}`;
  if (y === 0) return `Está sobre el eje X: va ${cuadros(Math.abs(x))} a la ${x > 0 ? "derecha" : "izquierda"} y no sube ni baja (y = 0)`;
  return `Desde el origen, va ${pasos(x, y)}`;
}

// ------------------------------------------------------------
// Generadores
// ------------------------------------------------------------
function genLeer(L, p) {
  const [x, y] = puntoAzar(L, p);
  const correct = par(x, y);
  const cands = [par(y, x)];
  if (p === "4") cands.push(par(-x, y), par(x, -y), par(-y, -x));
  cands.push(par(x + 1, y), par(x, y - 1), par(x - 1, y + 1));
  return {
    instruction: "¿Cuáles son las coordenadas del punto P?",
    display: correct,
    visual: plano(p, { puntos: [{ x, y, label: "P" }] }),
    soloVisual: true,
    options: opciones(p, correct, cands),
    correct,
    hint: PISTA_LEER[p],
    explain: `${lugar(x, y)}: P${correct}.${x !== y ? ` Cuidado: ${par(y, x)} es otro punto, porque primero va siempre la x.` : ""}`,
  };
}

function genSituar(L, p) {
  const [lo, hi] = rango(L, p);
  const [x, y] = puntoAzar(L, p);
  const ok = (q) => q[0] >= lo && q[0] <= hi && q[1] >= lo && q[1] <= hi;
  const cands = [[y, x]];
  if (p === "4") cands.push([-x, y], [x, -y], [-x, -y]);
  cands.push([x + 1, y], [x, y + 1], [x - 1, y - 1], [x + 2, y - 1]);
  const usados = [[x, y]];
  for (const c of cands) {
    if (usados.length >= 4) break;
    if (ok(c) && !usados.some((u) => u[0] === c[0] && u[1] === c[1])) usados.push(c);
  }
  while (usados.length < 4) {
    const c = [randInt(lo, hi), randInt(lo, hi)];
    if (!usados.some((u) => u[0] === c[0] && u[1] === c[1])) usados.push(c);
  }
  const letras = shuffle(["A", "B", "C", "D"]);
  const colores = ["var(--color-indigo)", "var(--color-teal)", "var(--color-plum)", "var(--color-amber)"];
  const puntos = usados.map((u, i) => ({ x: u[0], y: u[1], label: letras[i], color: colores[i] }));
  const correct = letras[0];
  const cambiado = usados.findIndex((u) => u[0] === y && u[1] === x);
  return {
    instruction: `¿Qué punto está en ${par(x, y)}?`,
    display: par(x, y),
    visual: plano(p, { puntos }),
    soloVisual: true,
    options: ["A", "B", "C", "D"],
    keepOrder: true,
    correct,
    hint: PISTA_LEER[p],
    explain: `${lugar(x, y)}: es el punto ${correct}.${cambiado > 0 ? ` El punto ${letras[cambiado]} está en ${par(y, x)}: tiene los números cambiados de orden.` : ""}`,
  };
}

function genTraslacion(L, p) {
  const [lo, hi] = rango(L, p);
  let x;
  let y;
  let dx;
  let dy;
  do {
    [x, y] = puntoAzar(L, p, { distintos: false });
    dx = L === LEVELS.acs ? randInt(0, L.paso) : randInt(-L.paso, L.paso);
    dy = L === LEVELS.acs ? randInt(0, L.paso) : randInt(-L.paso, L.paso);
  } while ((dx === 0 && dy === 0) || x + dx < lo || x + dx > hi || y + dy < lo || y + dy > hi || (p === "1" && (x + dx === 0 || y + dy === 0) && !L.ejes));

  // Altas: dos traslaciones seguidas.
  if (L.altas && Math.random() < 0.4) {
    let ex;
    let ey;
    let n = 0;
    do {
      ex = randInt(-L.paso, L.paso);
      ey = randInt(-L.paso, L.paso);
      n++;
    } while (n < 100 && ((ex === 0 && ey === 0) || x + dx + ex < lo || x + dx + ex > hi || y + dy + ey < lo || y + dy + ey > hi || (ex === -dx && ey === -dy)));
    if (n < 100) {
      const fx = x + dx + ex;
      const fy = y + dy + ey;
      const correct = par(fx, fy);
      const que = p === "4" ? `según el vector ${vec(dx, dy)} y después según el vector ${vec(ex, ey)}` : `${pasos(dx, dy)} y después ${pasos(ex, ey)}`;
      return {
        instruction: `Traslada el punto A ${que}. ¿Dónde queda al final?`,
        display: correct,
        visual: plano(p, { puntos: [{ x, y, label: "A" }] }),
        soloVisual: true,
        options: opciones(p, correct, [par(x + dx, y + dy), par(x + ex, y + ey), par(fy, fx), par(x + dx - ex, y + dy - ey), par(fx + 1, fy)]),
        correct,
        hint: "Puedes hacer los dos movimientos uno detrás de otro, o juntarlos en uno solo sumando lo horizontal con lo horizontal y lo vertical con lo vertical.",
        explain:
          p === "4"
            ? `En total, en horizontal: ${num(dx)} + ${ex < 0 ? `(${num(ex)})` : ex} = ${num(dx + ex)}; en vertical: ${num(dy)} + ${ey < 0 ? `(${num(ey)})` : ey} = ${num(dy + ey)}. Desde A${par(x, y)}, con el vector ${vec(dx + ex, dy + ey)}: ${correct}.`
            : `Juntando los dos movimientos, A se mueve en total ${pasos(dx + ex, dy + ey)}. Desde A${par(x, y)} se llega a ${correct}.`,
      };
    }
  }

  const nx = x + dx;
  const ny = y + dy;
  const correct = par(nx, ny);
  const cands = [par(x + dy, y + dx), par(x - dx, y - dy), par(x + dx, y - dy), par(x - dx, y + dy), par(nx + 1, ny), par(nx, ny - 1)];
  const que = p === "4" ? `según el vector ${vec(dx, dy)}` : pasos(dx, dy);
  return {
    instruction: `Traslada el punto A ${que}. ¿Dónde queda A'?`,
    display: correct,
    visual: plano(p, { puntos: [{ x, y, label: "A" }] }),
    soloVisual: true,
    options: opciones(p, correct, cands),
    correct,
    hint:
      p === "4"
        ? "El primer número del vector dice cuánto se mueve en horizontal (+ derecha, − izquierda) y el segundo, en vertical (+ arriba, − abajo)."
        : "Pon el dedo en A y cuenta los cuadros: primero en horizontal y después en vertical.",
    explain:
      p === "4"
        ? `Se suma el vector a las coordenadas: x = ${num(x)} ${dx < 0 ? "−" : "+"} ${Math.abs(dx)} = ${num(nx)}; y = ${num(y)} ${dy < 0 ? "−" : "+"} ${Math.abs(dy)} = ${num(ny)}. A' está en ${correct}.`
        : `Desde A${par(x, y)}, ${pasos(dx, dy)}: ${dx ? `${x} ${dx < 0 ? "−" : "+"} ${Math.abs(dx)} = ${nx}` : `la x sigue siendo ${x}`}${dy ? ` y ${y} ${dy < 0 ? "−" : "+"} ${Math.abs(dy)} = ${ny}` : ` y la y sigue siendo ${y}`}. A' está en ${correct}.`,
  };
}

// Qué traslación lleva una figura a la otra.
function genTraslacionFigura(L, p) {
  const [lo, hi] = rango(L, p);
  let base;
  let img;
  let dx;
  let dy;
  let n = 0;
  do {
    const ox = randInt(lo, hi - 2);
    const oy = randInt(lo, hi - 3);
    base = FIGURA_L.map(([a, b]) => [a + ox, b + oy]);
    dx = randInt(-L.paso - 1, L.paso + 1);
    dy = randInt(-L.paso - 1, L.paso + 1);
    img = base.map((q) => mover(q, { tipo: "tras", dx, dy }));
    n++;
  } while (n < 500 && (!dentro(img, lo, hi) || !separadas(base, img) || dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)));
  const fmt = p === "4" ? (a, b) => vec(a, b) : (a, b) => pasosCortos(a, b);
  const correct = fmt(dx, dy);
  const [ax, ay] = base[0];
  return {
    instruction: p === "4" ? "¿Con qué vector se ha trasladado la figura azul hasta la verde?" : "¿Cuánto se ha movido la figura azul para llegar a la verde?",
    display: correct,
    visual: plano(p, {
      figuras: [
        { pts: base, labels: [{ x: ax, y: ay, label: "A" }] },
        { pts: img, color: "var(--color-teal)", tint: "var(--color-teal-tint)", labels: [{ x: ax + dx, y: ay + dy, label: "A'" }] },
      ],
    }),
    soloVisual: true,
    options: opciones(p, correct, [fmt(dy, dx), fmt(-dx, dy), fmt(dx, -dy), fmt(-dx, -dy), fmt(dx + 1, dy)]),
    correct,
    hint: "Fíjate solo en un vértice, A, y cuenta cuántos cuadros hay hasta A': primero en horizontal y después en vertical.",
    explain: `De A${par(ax, ay)} a A'${par(ax + dx, ay + dy)} hay ${pasos(dx, dy)}${p === "4" ? `: el vector es ${correct}` : ""}. Todos los puntos de la figura se mueven lo mismo, y la figura no gira ni cambia de tamaño.`,
  };
}

function genSimetria(L, p) {
  const [lo, hi] = rango(L, p);
  const vertical = Math.random() < 0.5;
  let k;
  if (p === "4" && !L.altas) k = 0;
  else k = randInt(lo + 2, hi - 2);
  // El punto, a un lado de la recta y con sitio para su simétrico.
  const lejos = Math.min(k - lo, hi - k);
  const d = randInt(1, Math.min(lejos, L.paso)) * (Math.random() < 0.5 ? 1 : -1);
  let otra;
  do otra = randInt(lo, hi);
  while ((p === "4" && otra === 0) || (!L.ejes && otra === 0));
  const [x, y] = vertical ? [k + d, otra] : [otra, k + d];
  const [sx, sy] = vertical ? [k - d, y] : [x, k - d];
  const correct = par(sx, sy);
  const cands = vertical
    ? [par(k, y), par(sx + (d > 0 ? -1 : 1), y), par(x, 2 * k - y), par(sy, sx), par(sx + (d > 0 ? 1 : -1), y)]
    : [par(x, k), par(x, sy + (d > 0 ? -1 : 1)), par(2 * k - x, y), par(sy, sx), par(x, sy + (d > 0 ? 1 : -1))];
  const nombreRecta =
    p === "4" && k === 0
      ? vertical
        ? "el eje Y"
        : "el eje X"
      : vertical
        ? `la recta morada (vertical, pasa por el ${num(k)} del eje X)`
        : `la recta morada (horizontal, pasa por el ${num(k)} del eje Y)`;
  const dist = cuadros(Math.abs(d));
  let explain;
  if (p === "4" && k === 0)
    explain = vertical
      ? `A está a ${dist} del eje Y; su simétrico está a ${dist} al otro lado. Respecto al eje Y, la x cambia de signo y la y se queda igual: ${par(x, y)} → ${correct}.`
      : `A está a ${dist} del eje X; su simétrico está a ${dist} al otro lado. Respecto al eje X, la y cambia de signo y la x se queda igual: ${par(x, y)} → ${correct}.`;
  else
    explain = `A está a ${dist} de la recta, ${vertical ? (d > 0 ? "a su derecha" : "a su izquierda") : d > 0 ? "por encima" : "por debajo"}; su simétrico tiene que estar a ${dist} al otro lado: ${correct}. La ${vertical ? "y" : "x"} no cambia, porque el punto se mueve en ${vertical ? "horizontal" : "vertical"}, directo hacia la recta.`;
  return {
    instruction: `¿Dónde está el simétrico de A respecto ${nombreRecta.startsWith("el ") ? `al ${nombreRecta.slice(3)}` : `a ${nombreRecta}`}?`,
    display: correct,
    visual: plano(p, { puntos: [{ x, y, label: "A" }], recta: vertical ? { x: k } : { y: k } }),
    soloVisual: true,
    options: opciones(p, correct, cands),
    correct,
    hint: "Cuenta los cuadros que hay desde A hasta la recta, en línea recta, y cuenta los mismos al otro lado. Es como un espejo.",
    explain,
  };
}

function genGiro(L, p) {
  const [lo, hi] = rango(L, p);
  const sentido = L === LEVELS.facil ? pick(["A", "H"]) : pick(["A", "H", "M"]);
  let cx;
  let cy;
  if (p === "4" && !L.altas) [cx, cy] = [0, 0];
  else {
    cx = randInt(lo + 2, hi - 2);
    cy = randInt(lo + 2, hi - 2);
  }
  const m = Math.min(cx - lo, hi - cx, cy - lo, hi - cy, L.paso);
  let dx;
  let dy;
  do {
    dx = randInt(-m, m);
    dy = randInt(-m, m);
    // Discalculia: el punto en línea recta con el centro.
    if (L === LEVELS.facil) {
      if (Math.random() < 0.5) dy = 0;
      else dx = 0;
    }
  } while ((dx === 0 && dy === 0) || (L !== LEVELS.facil && (dx === 0 || dy === 0) && Math.random() < 0.7) || (!L.ejes && (cx + dx === 0 || cy + dy === 0)));
  const x = cx + dx;
  const y = cy + dy;
  const [rx, ry] = rotar(dx, dy, sentido);
  const correct = par(cx + rx, cy + ry);
  const otros = ["A", "H", "M"].filter((s) => s !== sentido).map((s) => {
    const [a, b] = rotar(dx, dy, s);
    return par(cx + a, cy + b);
  });
  const cands = [...otros, par(cx + dy, cy + dx), par(cx - dy, cy - dx), par(cx + rx + 1, cy + ry), par(cx - dx, cy + dy)];
  const origen = p === "4" && cx === 0 && cy === 0;
  const nombreC = origen ? "el origen" : "C";
  const txt = p === "4" ? GIRO_TXT6[sentido] : GIRO_TXT[sentido];
  return {
    instruction: `Gira el punto A ${txt} alrededor ${origen ? "del origen" : "de C"}. ¿Dónde queda A'?`,
    display: correct,
    visual: plano(p, { puntos: [{ x, y, label: "A" }], centro: { x: cx, y: cy, label: origen ? "O" : "C" } }),
    soloVisual: true,
    options: opciones(p, correct, cands),
    correct,
    hint: `Imagina un palo que va de ${nombreC} a A y gíralo como la aguja de un reloj. Cuenta los cuadros desde ${origen ? "el origen" : "C"}: cuántos en horizontal y cuántos en vertical.`,
    explain: `Desde ${nombreC}, A está ${pasosCortos(dx, dy)}. Al girar ${sentido === "M" ? "media vuelta" : "un cuarto de vuelta"}, ${reglaGiro(dx, dy, sentido)}. Así que, desde ${nombreC}, A' está ${pasosCortos(rx, ry)}: ${correct}.${origen && sentido === "M" ? " Con media vuelta alrededor del origen, las dos coordenadas cambian de signo." : ""}`,
  };
}

// ¿Qué movimiento lleva la figura azul a la verde?
function genMovimiento(L, p) {
  const [lo, hi] = rango(L, p);
  const tipo = pick(["Traslación", "Simetría", "Giro"]);
  let base;
  let img;
  let mov;
  let n = 0;
  do {
    const ox = randInt(lo, hi - 2);
    const oy = randInt(lo, hi - 3);
    base = FIGURA_L.map(([a, b]) => [a + ox, b + oy]);
    if (tipo === "Traslación") mov = { tipo: "tras", dx: randInt(-5, 5), dy: randInt(-5, 5) };
    else if (tipo === "Simetría") mov = { tipo: pick(["simV", "simH"]), k: randInt(lo + 1, hi - 1) };
    else mov = { tipo: "giro", sentido: pick(["A", "H", "M"]), cx: randInt(lo + 1, hi - 1), cy: randInt(lo + 1, hi - 1) };
    img = base.map((q) => mover(q, mov));
    n++;
  } while (n < 1000 && (!dentro(img, lo, hi) || !separadas(base, img) || (mov.tipo === "tras" && (mov.dx === 0 || mov.dy === 0) && Math.random() < 0.5)));
  const explain = {
    Traslación: `Es una traslación: la figura se ha deslizado ${pasos(mov.dx, mov.dy)} sin girar ni darse la vuelta. Todos sus puntos se han movido lo mismo.`,
    Simetría: `Es una simetría: la figura verde es el reflejo de la azul en un espejo, una recta ${mov.tipo === "simV" ? "vertical" : "horizontal"}. Fíjate en que la L está «dada la vuelta»: el pie apunta hacia el otro lado.`,
    Giro: `Es un giro de ${mov.sentido === "M" ? "media vuelta" : "un cuarto de vuelta"}: la figura ha cambiado de orientación, pero no está reflejada. Si la recortas, puedes ponerla encima de la otra solo girándola, sin darle la vuelta.`,
  }[tipo];
  return {
    instruction: "¿Qué movimiento lleva la figura azul hasta la verde?",
    display: tipo,
    visual: plano(p, { figuras: [{ pts: base }, { pts: img, color: "var(--color-teal)", tint: "var(--color-teal-tint)" }] }),
    soloVisual: true,
    options: ["Traslación", "Simetría", "Giro"],
    keepOrder: true,
    correct: tipo,
    hint: "Si mira hacia el mismo sitio, es una traslación. Si está «dada la vuelta», como en un espejo, es una simetría. Si está girada, es un giro.",
    explain,
  };
}

// 6º: semejanza y escala.
function genSemejanza(L) {
  const k = L === LEVELS.facil ? 2 : pick([2, 3]);
  const w = randInt(1, L === LEVELS.facil ? 3 : 4);
  let h;
  do h = randInt(1, L === LEVELS.facil ? 3 : 4);
  while (h === w);
  const amplia = Math.random() < 0.5;
  const [w1, h1, w2, h2] = amplia ? [w, h, w * k, h * k] : [w * k, h * k, w, h];
  const correct = amplia ? `×${k}` : `÷${k}`;
  return {
    instruction: "La figura verde es semejante a la azul. ¿A qué escala se ha ampliado o reducido?",
    display: correct,
    visual: similarRectSVG(w1, h1, w2, h2),
    soloVisual: true,
    options: ["×2", "×3", "÷2", "÷3"],
    keepOrder: true,
    correct,
    hint: "Compara un lado de la azul con el mismo lado de la verde: ¿por qué número se ha multiplicado o dividido?",
    explain: amplia
      ? `Cada lado se ha multiplicado por ${k}: ${w1} × ${k} = ${w2} y ${h1} × ${k} = ${h2}. Se ha ampliado a escala ×${k}.`
      : `Cada lado se ha dividido entre ${k}: ${w1} ÷ ${k} = ${w2} y ${h1} ÷ ${k} = ${h2}. Se ha reducido a escala ÷${k}.`,
  };
}

// ¿Son semejantes? Error típico: sumar lo mismo a los lados.
function genSemejantes(L) {
  const w = randInt(1, 3);
  let h;
  do h = randInt(1, 4);
  while (h === w);
  const si = Math.random() < 0.5;
  const k = 2;
  const s = randInt(1, 2);
  const [w2, h2] = si ? [w * k, h * k] : [w + s, h + s];
  // Sumar s a los dos lados solo da una semejante si los lados ya eran iguales.
  return {
    instruction: "¿Son semejantes estos dos rectángulos?",
    display: si ? "Sí" : "No",
    visual: similarRectSVG(w, h, w2, h2),
    soloVisual: true,
    options: ["Sí", "No"],
    keepOrder: true,
    correct: si ? "Sí" : "No",
    hint: "Son semejantes si los dos lados se han multiplicado por el mismo número. Sumar lo mismo a los dos lados no vale.",
    explain: si
      ? `Sí: los dos lados se han multiplicado por ${k}: ${w} × ${k} = ${w2} y ${h} × ${k} = ${h2}.`
      : `No: a los dos lados se les ha sumado ${s} (${w} + ${s} = ${w2} y ${h} + ${s} = ${h2}), pero no se han multiplicado por el mismo número (${w2} ÷ ${w} ${w2 % w === 0 ? `= ${w2 / w}` : "no es exacto"}, ${h2} ÷ ${h} ${h2 % h === 0 ? `= ${h2 / h}` : "no es exacto"}). La forma ha cambiado.`,
  };
}

function genEscalaPlano(L, p) {
  const escala = L === LEVELS.facil ? 100 : pick([100, 100, 1000]);
  const cm = randInt(2, 9);
  const real = (cm * escala) / 100;
  const correct = `${real} m`;
  const cands = [`${cm * escala} m`, `${real * 10} m`, `${real / 10} m`.replace(".", ","), `${cm} m`, `${real} cm`];
  return {
    instruction: "En el plano de una casa a escala 1:" + escala + ", el salón mide " + cm + " cm de largo. ¿Cuánto mide de verdad?",
    display: `1:${escala} · ${cm} cm`,
    options: opciones(p, correct, cands),
    correct,
    hint: `1:${escala} quiere decir que 1 cm del plano son ${escala} cm de verdad. Y 100 cm son 1 m.`,
    explain: `${cm} cm × ${escala} = ${(cm * escala).toLocaleString("es-ES")} cm, que son ${real} m (se divide entre 100).`,
  };
}

const MODE_GROUPS = {
  leer: [genLeer],
  situar: [genSituar],
  traslacion: [genTraslacion, genTraslacion, genTraslacionFigura],
  simetria: [genSimetria],
  giro: [genGiro],
  movimiento: [genMovimiento],
  semejanza: [genSemejanza, genSemejantes, genEscalaPlano],
};

const ACS_GENERATORS = [genLeer, genSituar, genTraslacion];

const COORDENADAS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Leer y situar puntos y moverlos (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo con números positivos y pequeños: leer las coordenadas de un punto, encontrar el punto que está en unas coordenadas y moverlo unos cuadros a la derecha o hacia arriba.",
    example: "P está 3 a la derecha y 2 hacia arriba → P(3, 2)",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las coordenadas y las opciones.",
    example: "(3, 5) → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Leer coordenadas» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todos los movimientos, con números positivos y la pista a la vista",
    text: "Se trabajan todos los modos en el plano de los números positivos, con puntos cercanos, movimientos cortos, giros de un cuarto de vuelta con el punto en línea recta con el centro y la pista abierta desde el principio. Sin «Mezcla». En Explora se puede mover el punto y la figura.",
    example: "Gira A un cuarto de vuelta → Pista: cuenta los cuadros desde C",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Los cuatro cuadrantes y movimientos más difíciles",
    text: "Empieza en el plano de los cuatro cuadrantes, con giros alrededor de cualquier punto, simetrías respecto a rectas que no son los ejes, dos traslaciones seguidas y semejanza.",
    example: "A(−2, 3) gira 90° alrededor de C(1, 1)",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Cuáles son las coordenadas del punto P? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  renderTeoriaExamples();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, COORDENADAS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), COORDENADAS_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("co-punto")) initExplore();
  if (document.getElementById("word-display")) initGame(diff, (fn) => restartCallbacks.push(fn));
});

function renderTeoriaExamples() {
  const pon = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };
  pon("ejemplo-coordenadas", plano("1", { puntos: [{ x: 3, y: 5, label: "P(3, 5)" }, { x: 5, y: 3, label: "Q(5, 3)", color: "var(--color-amber)" }] }));
  pon("ejemplo-cuadrantes", plano("4", { puntos: [{ x: 3, y: 2, label: "A" }, { x: -4, y: 1, label: "B", color: "var(--color-teal)" }, { x: -2, y: -3, label: "C", color: "var(--color-plum)" }, { x: 2, y: -4, label: "D", color: "var(--color-amber)" }] }));
  pon("ejemplo-traslacion", plano("1", {
    figuras: [
      { pts: FIGURA_L.map(([a, b]) => [a + 1, b + 1]), labels: [{ x: 1, y: 1, label: "A" }] },
      { pts: FIGURA_L.map(([a, b]) => [a + 5, b + 3]), color: "var(--color-teal)", tint: "var(--color-teal-tint)", labels: [{ x: 5, y: 3, label: "A'" }] },
    ],
    flecha: { from: [1, 1], to: [5, 3] },
  }));
  pon("ejemplo-simetria", plano("1", {
    figuras: [
      { pts: FIGURA_L.map(([a, b]) => [a + 1, b + 2]), labels: [{ x: 1, y: 2, label: "A" }] },
      { pts: FIGURA_L.map(([a, b]) => [7 - a, b + 2]), color: "var(--color-teal)", tint: "var(--color-teal-tint)", labels: [{ x: 7, y: 2, label: "A'" }] },
    ],
    recta: { x: 4 },
  }));
  pon("ejemplo-giro", plano("1", {
    puntos: [{ x: 7, y: 5, label: "A" }, { x: 3, y: 7, label: "A'", color: "var(--color-teal)" }],
    centro: { x: 4, y: 4 },
  }));
  pon("ejemplo-simetria-ejes", plano("4", {
    puntos: [{ x: 4, y: 3, label: "A" }, { x: -4, y: 3, label: "A'", color: "var(--color-teal)" }, { x: 4, y: -3, label: "A''", color: "var(--color-plum)" }],
  }));
  pon("ejemplo-semejanza", similarRectSVG(2, 3, 4, 6));
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
  let p = "1";

  // 1. Mover un punto.
  let px = 3;
  let py = 5;
  function renderPunto() {
    const P = PLANOS[p];
    px = Math.max(P.min, Math.min(P.max, px));
    py = Math.max(P.min, Math.min(P.max, py));
    document.getElementById("co-px").textContent = num(px);
    document.getElementById("co-py").textContent = num(py);
    document.getElementById("co-punto-draw").innerHTML = plano(p, { puntos: [{ x: px, y: py, label: `P${par(px, py)}` }] });
    let cuadrante = "";
    if (p === "4" && px && py)
      cuadrante = ` Está en el ${px > 0 ? (py > 0 ? "primer" : "cuarto") : py > 0 ? "segundo" : "tercer"} cuadrante${px < 0 || py < 0 ? `: ${px < 0 && py < 0 ? "los dos números son negativos" : px < 0 ? "la x es negativa porque está a la izquierda del eje Y" : "la y es negativa porque está por debajo del eje X"}` : ""}.`;
    document.getElementById("co-punto-msg").innerHTML = `<strong>P${par(px, py)}</strong>. ${lugar(px, py)}.${cuadrante}`;
  }
  document.querySelectorAll("[data-co-px]").forEach((b) => b.addEventListener("click", () => { px += Number(b.dataset.coPx); renderPunto(); }));
  document.querySelectorAll("[data-co-py]").forEach((b) => b.addEventListener("click", () => { py += Number(b.dataset.coPy); renderPunto(); }));

  // 2. Mover una figura.
  let fig;
  let ultimo = "";
  const origen = () => FIGURA_L.map(([a, b]) => [a + 1, b + 1]);
  const ref = () => (p === "4" ? { k: 0, cx: 0, cy: 0 } : { k: 4, cx: 4, cy: 4 });
  function renderFigura() {
    const r = ref();
    const [ax, ay] = fig[0];
    document.getElementById("co-figura-draw").innerHTML = plano(p, {
      figuras: [
        { pts: origen(), color: "var(--text-muted)", tint: "var(--surface)" },
        { pts: fig, color: "var(--color-teal)", tint: "var(--color-teal-tint)", labels: [{ x: ax, y: ay, label: "A" }] },
      ],
      recta: ultimo === "simV" ? { x: r.k } : ultimo === "simH" ? { y: r.k } : null,
      centro: ultimo.startsWith("giro") ? { x: r.cx, y: r.cy, label: p === "4" ? "O" : "C" } : null,
    });
  }
  function mensaje(txt) {
    document.getElementById("co-figura-msg").innerHTML = txt;
  }
  function moverFigura(m) {
    const r = ref();
    const P = PLANOS[p];
    if (m === "reset") {
      fig = origen();
      ultimo = "";
      renderFigura();
      mensaje("La figura gris es la de partida. Muévela con los botones.");
      return;
    }
    const tras = { der: [1, 0], izq: [-1, 0], arr: [0, 1], aba: [0, -1] }[m];
    let mov;
    if (tras) mov = { tipo: "tras", dx: tras[0], dy: tras[1] };
    else if (m === "simV" || m === "simH") mov = { tipo: m, k: r.k };
    else mov = { tipo: "giro", sentido: { giroA: "A", giroH: "H", giro180: "M" }[m], cx: r.cx, cy: r.cy };
    const nueva = fig.map((q) => mover(q, mov));
    if (!dentro(nueva, P.min, P.max)) {
      mensaje("Así se saldría del plano: prueba otro movimiento.");
      return;
    }
    const [ax, ay] = fig[0];
    const [bx, by] = nueva[0];
    fig = nueva;
    ultimo = m;
    renderFigura();
    const centro = p === "4" ? "del origen" : "de C(4, 4)";
    const recta = m === "simV" ? (p === "4" ? "al eje Y" : "a la recta vertical que pasa por el 4") : p === "4" ? "al eje X" : "a la recta horizontal que pasa por el 4";
    const txt = tras
      ? `<strong>Traslación</strong>: la figura se desliza ${pasos(tras[0], tras[1])}, sin girar.`
      : mov.tipo === "giro"
        ? `<strong>Giro</strong> de ${GIRO_TXT[mov.sentido]} alrededor ${centro}: la figura cambia de orientación.`
        : `<strong>Simetría</strong> respecto ${recta}: la figura se refleja como en un espejo y queda «dada la vuelta».`;
    mensaje(`${txt} El vértice A pasa de ${par(ax, ay)} a ${par(bx, by)}. La forma y el tamaño no cambian.`);
  }
  document.querySelectorAll("[data-co-mov]").forEach((b) => b.addEventListener("click", () => moverFigura(b.dataset.coMov)));

  // 3. Ampliar y reducir (6º).
  let w = 2;
  let h = 3;
  let k = "2";
  function renderEscala() {
    document.getElementById("co-ew").textContent = w;
    document.getElementById("co-eh").textContent = h;
    document.querySelectorAll("[data-co-k]").forEach((b) => b.classList.toggle("active", b.dataset.coK === k));
    const msg = document.getElementById("co-escala-msg");
    if (k === "/2" && (w % 2 || h % 2)) {
      document.getElementById("co-escala-draw").innerHTML = similarRectSVG(w, h, 0, 0);
      msg.className = "md-msg ko";
      msg.innerHTML = `Para reducir a escala ÷2 en la cuadrícula, los dos lados tienen que ser pares: ${w % 2 ? w : h} entre 2 no da un número entero de cuadros.`;
      return;
    }
    const f = k === "/2" ? 0.5 : Number(k);
    const w2 = w * f;
    const h2 = h * f;
    document.getElementById("co-escala-draw").innerHTML = similarRectSVG(w, h, w2, h2);
    msg.className = "md-msg ok";
    const op = k === "/2" ? "÷ 2" : `× ${k}`;
    const area = w * h;
    const area2 = w2 * h2;
    msg.innerHTML = `Cada lado ${op}: ${w} ${op} = ${w2} y ${h} ${op} = ${h2}. Tienen la misma forma: son <strong>semejantes</strong>. Pero el área no ${k === "/2" ? "se divide entre 2" : `se multiplica por ${k}`}: pasa de ${area} a ${area2} ${area2 === 1 ? "cuadro" : "cuadros"}${k === "/2" ? " (entre 4)" : ` (× ${Number(k) * Number(k)})`}.`;
  }
  document.querySelectorAll("[data-co-ew]").forEach((b) => b.addEventListener("click", () => { w = Math.max(1, Math.min(4, w + Number(b.dataset.coEw))); renderEscala(); }));
  document.querySelectorAll("[data-co-eh]").forEach((b) => b.addEventListener("click", () => { h = Math.max(1, Math.min(4, h + Number(b.dataset.coEh))); renderEscala(); }));
  document.querySelectorAll("[data-co-k]").forEach((b) => b.addEventListener("click", () => { k = b.dataset.coK; renderEscala(); }));

  // Plano de 5º o de 6º para las dos primeras tarjetas.
  function setPlano(nuevo) {
    p = nuevo;
    document.querySelectorAll("[data-co-plano]").forEach((b) => b.classList.toggle("active", b.dataset.coPlano === p));
    renderPunto();
    moverFigura("reset");
  }
  document.querySelectorAll("[data-co-plano]").forEach((b) => b.addEventListener("click", () => setPlano(b.dataset.coPlano)));

  setPlano("1");
  renderEscala();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-coordenadas"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    planoBtns: document.querySelectorAll("#plano-picker [data-plano]"),
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
  let mode = "leer";
  let p = "1";
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

  function setPlano(nuevo) {
    p = nuevo;
    els.planoBtns.forEach((b) => b.classList.toggle("active", b.dataset.plano === p));
  }

  function applyDifficultyUI() {
    const acs = diff.is("acs");
    const soloPositivos = acs || diff.is("discalculia");
    els.modeBtns.forEach((b) => {
      b.disabled = acs || (b.dataset.mode === "mezcla" && (diff.is("tdah") || diff.is("discalculia")));
    });
    els.planoBtns.forEach((b) => (b.disabled = soloPositivos));

    if (soloPositivos) setPlano("1");
    else if (diff.is("altas")) setPlano("4");

    if (diff.is("altas")) setActiveMode("giro");
    else if (acs) setActiveMode("leer");
    else if ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla") setActiveMode("leer");

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function generatorsFor() {
    if (diff.is("acs")) return ACS_GENERATORS;
    if (mode === "mezcla") {
      // La semejanza es de 6º: solo entra en la mezcla con el plano de 6º.
      const claves = Object.keys(MODE_GROUPS).filter((k) => p === "4" || k !== "semejanza");
      return MODE_GROUPS[pick(claves)];
    }
    return MODE_GROUPS[mode];
  }

  function pickQuestion() {
    let q;
    let tries = 0;
    do {
      q = pick(generatorsFor())(level(), p);
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
    els.wordDisplay.style.display = current.soloVisual || current.visual ? "none" : "";
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
    AppProgress.record("coordenadas", isCorrect);
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
  els.planoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setPlano(btn.dataset.plano);
      startRound();
    });
  });

  els.hintBtn.addEventListener("click", showHint);
  els.nextBtn.addEventListener("click", startRound);

  applyDifficultyUI();
  startRound();
}
