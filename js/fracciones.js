// ============================================================
// Fracciones y número mixto
// - Explora: construir una fracción (barras y recta numérica),
//   fracciones equivalentes y comparar dos fracciones. No guarda
//   progreso: es para entender, no para puntuar.
// - Práctica: las preguntas se generan al azar y cada una trae su
//   pista y la explicación que se ve al corregir. Solo la práctica
//   llama a AppProgress.
// ============================================================

function fractionBarSVG(filled, denom, color) {
  const width = 220;
  const height = 50;
  const x0 = 10;
  const y0 = 5;
  const barH = 40;
  const segW = (width - 20) / denom;
  let rects = "";
  for (let i = 0; i < denom; i++) {
    const x = x0 + i * segW;
    const fill = i < filled ? color || "var(--color-indigo)" : "none";
    rects += `<rect x="${x}" y="${y0}" width="${segW}" height="${barH}" fill="${fill}" stroke="var(--text)" stroke-width="2"/>`;
  }
  return `<svg viewBox="0 0 ${width} ${height}" width="200" height="46">${rects}</svg>`;
}

function fractionVisual(num, denom, color) {
  const wholeBars = Math.floor(num / denom);
  const remainder = num % denom;
  const totalBars = Math.max(remainder > 0 ? wholeBars + 1 : wholeBars, 1);
  let out = '<div style="display:flex; flex-wrap:wrap; gap:6px; justify-content:center;">';
  for (let b = 0; b < totalBars; b++) {
    const filled = b < wholeBars ? denom : remainder;
    out += fractionBarSVG(filled, denom, color);
  }
  out += "</div>";
  return out;
}

// Recta numérica de 0 a `units` con marcas en cada 1/ticks (si se da)
// y un triángulo con su etiqueta para cada fracción de `marks`.
function numberLineSVG(marks, units, ticks) {
  const W = 520;
  const x0 = 20;
  const x1 = W - 20;
  const y = 52;
  const xOf = (v) => x0 + ((x1 - x0) * v) / units;
  let out = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="var(--text)" stroke-width="2"/>`;
  if (ticks) {
    for (let i = 1; i < units * ticks; i++) {
      if (i % ticks === 0) continue;
      out += `<line x1="${xOf(i / ticks)}" y1="${y - 5}" x2="${xOf(i / ticks)}" y2="${y + 5}" stroke="var(--text-faint)" stroke-width="1.5"/>`;
    }
  }
  for (let u = 0; u <= units; u++) {
    out += `<line x1="${xOf(u)}" y1="${y - 10}" x2="${xOf(u)}" y2="${y + 10}" stroke="var(--text)" stroke-width="2"/>`;
    out += `<text x="${xOf(u)}" y="${y + 28}" text-anchor="middle" font-size="15" font-weight="700" fill="var(--text)">${u}</text>`;
  }
  const xs = marks.map((m) => xOf(Math.min(units, m.n / m.d)));
  const juntas = xs.length === 2 && Math.abs(xs[0] - xs[1]) < 24;
  marks.forEach((m, i) => {
    const x = xs[i];
    const lx = juntas ? x + (i === 0 ? -12 : 12) : x;
    out += `<polygon points="${x - 7},${y - 22} ${x + 7},${y - 22} ${x},${y - 11}" fill="${m.color}"/>`;
    out += `<text x="${lx}" y="18" text-anchor="middle" font-size="14" font-weight="800" fill="${m.color}">${m.label || fs(m.n, m.d)}</text>`;
  });
  return `<svg viewBox="0 0 ${W} 96" width="100%" style="max-width:${W}px" role="img" aria-label="Recta numérica">${out}</svg>`;
}

// ------------------------------------------------------------
// Utilidades
// ------------------------------------------------------------
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

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

const fs = (n, d) => `${n}/${d}`;

function mixStr(q, r, d) {
  return r === 0 ? String(q) : `${q} ${r}/${d}`;
}

const NUM_PALABRA = ["cero", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiún", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve", "treinta", "treinta y un", "treinta y dos", "treinta y tres", "treinta y cuatro", "treinta y cinco", "treinta y seis"];
const DEN_PALABRA = { 2: "medio", 3: "tercio", 4: "cuarto", 5: "quinto", 6: "sexto", 7: "séptimo", 8: "octavo", 9: "noveno", 10: "décimo", 11: "onceavo", 12: "doceavo" };

function leerFraccion(n, d) {
  const nombre = DEN_PALABRA[d];
  return n === 1 ? `un ${nombre}` : `${NUM_PALABRA[n]} ${nombre}s`;
}

// Opciones distintas por texto y, si se da valor, también por valor.
function uniqueOptions(correct, candidates, count = 4, valueOf) {
  const out = [correct];
  const vals = valueOf ? [valueOf(correct)] : [];
  shuffle(candidates).forEach((c) => {
    if (out.length >= count || !c || out.includes(c)) return;
    if (valueOf) {
      const v = valueOf(c);
      if (!isFinite(v) || v <= 0 || vals.some((x) => Math.abs(x - v) < 1e-9)) return;
      vals.push(v);
    }
    out.push(c);
  });
  return out;
}

function fracValue(str) {
  const m = str.match(/^(\d+)\/(\d+)$/);
  return m ? Number(m[1]) / Number(m[2]) : NaN;
}

// ------------------------------------------------------------
// Niveles
// ------------------------------------------------------------
const LEVELS = {
  normal: { dens: [2, 3, 4, 5, 6, 7, 8, 9, 10], maxEnteros: 3, factores: [2, 3, 4, 5], gs: [2, 3, 4, 5, 6] },
  facil: { dens: [2, 3, 4, 5, 6], maxEnteros: 2, factores: [2, 3], gs: [2, 3] },
  acs: { dens: [2, 3, 4], maxEnteros: 1, factores: [2], gs: [2] },
  altas: { dens: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12], maxEnteros: 4, factores: [2, 3, 4, 5, 6], gs: [2, 3, 4, 5, 6, 8, 9, 10, 12] },
};

const YES_NO = ["Sí", "No"];
const SIGNOS = ["<", "=", ">"];

// ------------------------------------------------------------
// Generadores: { instruction, display | visual, options, correct,
// keepOrder?, hint, explain }
// ------------------------------------------------------------
function genIdentificar(L) {
  const d = pick(L.dens);
  const impropia = L !== LEVELS.acs && Math.random() < 0.25;
  const n = impropia ? randInt(d + 1, 2 * d - 1) : randInt(1, d - 1);
  const correct = fs(n, d);
  return {
    instruction: "¿Qué fracción representa el dibujo?",
    visual: fractionVisual(n, d),
    options: uniqueOptions(correct, [fs(d, n), fs(n + 1, d), fs(Math.max(1, n - 1), d), fs(n, d + 1), fs(d - n > 0 ? d - n : n + 2, d)], 4, fracValue),
    correct,
    hint: "Cuenta en cuántas partes iguales está dividida cada barra (denominador) y cuántas están coloreadas (numerador).",
    explain: impropia
      ? `Cada barra es una unidad dividida en ${d} partes iguales (denominador ${d}) y hay ${n} partes coloreadas en total (numerador ${n}): ${correct}, «${leerFraccion(n, d)}». Es mayor que una unidad.`
      : `La barra está dividida en ${d} partes iguales (denominador ${d}) y hay ${n} coloreadas (numerador ${n}): ${correct}, «${leerFraccion(n, d)}».`,
  };
}

function genLeer(L) {
  const d = pick(L.dens.filter((x) => x <= 12));
  const n = randInt(1, L === LEVELS.acs ? d - 1 : d + 2);
  const correct = fs(n, d);
  const words = leerFraccion(n, d);
  if (Math.random() < 0.5) {
    const cands = [leerFraccion(d, n > 1 ? n : 2), leerFraccion(n, d < 12 ? d + 1 : d - 1), leerFraccion(n + 1, d), leerFraccion(Math.max(1, n - 1), d)].filter((w) => !w.includes("undefined"));
    return {
      instruction: "¿Cómo se lee esta fracción?",
      display: correct,
      options: uniqueOptions(words, cands),
      correct: words,
      hint: `Primero se lee el numerador (${n}) y después el denominador (${d}) con su nombre: medios, tercios, cuartos, quintos…`,
      explain: `El numerador ${n} se lee «${NUM_PALABRA[n]}» y el denominador ${d}, «${DEN_PALABRA[d]}${n === 1 ? "" : "s"}»: ${correct} se lee «${words}».`,
    };
  }
  return {
    instruction: "¿Qué fracción es?",
    display: `«${words}»`,
    options: uniqueOptions(correct, [fs(d, n), fs(n + 1, d), fs(n, d + 1), fs(Math.max(1, n - 1), d)], 4, fracValue),
    correct,
    hint: `El nombre de la fracción dice el denominador: «${DEN_PALABRA[d]}s» son ${d} partes.`,
    explain: `«${DEN_PALABRA[d]}${n === 1 ? "" : "s"}» indica que el todo se divide en ${d} partes (denominador ${d}) y «${NUM_PALABRA[n]}» que se toman ${n} (numerador ${n}): ${correct}.`,
  };
}

function genPropiaImpropia(L) {
  const d = pick(L.dens);
  const propia = Math.random() < 0.5;
  const n = propia ? randInt(1, d - 1) : randInt(d + 1, d * 2 + 1);
  return {
    instruction: "¿Es una fracción propia o impropia?",
    display: fs(n, d),
    options: ["Propia", "Impropia"],
    keepOrder: true,
    correct: propia ? "Propia" : "Impropia",
    hint: "Compara el numerador (arriba) con el denominador (abajo).",
    explain: propia
      ? `${n} < ${d}: el numerador es menor que el denominador, así que es propia (menos de una unidad).`
      : `${n} > ${d}: el numerador es mayor que el denominador, así que es impropia (más de una unidad).`,
  };
}

function genUnidad(L) {
  const d = pick(L.dens);
  const r = Math.random();
  const n = r < 0.25 ? d : r < 0.62 ? randInt(1, d - 1) : randInt(d + 1, d * 2);
  const correct = n < d ? "Menor que 1" : n === d ? "Igual a 1" : "Mayor que 1";
  return {
    instruction: "Compara con la unidad:",
    display: `¿Cómo es ${fs(n, d)} comparada con 1?`,
    options: ["Menor que 1", "Igual a 1", "Mayor que 1"],
    keepOrder: true,
    correct,
    hint: `Una unidad entera son ${d}/${d}. ¿Tienes menos, las mismas o más partes?`,
    explain: n === d
      ? `${fs(n, d)}: se toman todas las partes (${d} de ${d}), así que es una unidad entera.`
      : n < d
        ? `${n} < ${d}: faltan partes para completar la unidad (${d}/${d}), así que es menor que 1.`
        : `${n} > ${d}: hay más partes de las que tiene una unidad (${d}/${d}), así que es mayor que 1.`,
  };
}

function genAMixto(L) {
  const d = pick(L.dens);
  const q = randInt(1, L.maxEnteros);
  const r = randInt(1, d - 1);
  const n = q * d + r;
  const correct = mixStr(q, r, d);
  return {
    instruction: "Escríbela como número mixto:",
    display: fs(n, d),
    visual: fractionVisual(n, d, "var(--color-amber)"),
    options: uniqueOptions(correct, [mixStr(q + 1, r, d), mixStr(q, d - r, d), q > 1 ? mixStr(q - 1, r, d) : mixStr(q, r, d + 1), mixStr(r, q, d), mixStr(q + 1, d - r, d)]),
    correct,
    hint: `Divide ${n} entre ${d}: el cociente son las unidades enteras y el resto, las partes que sobran.`,
    explain: `${n} : ${d} = ${q} y ${r === 1 ? "sobra 1" : `sobran ${r}`}. Salen ${q} ${q === 1 ? "unidad entera" : "unidades enteras"} y ${fs(r, d)}: ${fs(n, d)} = ${correct}.`,
  };
}

function genAImpropia(L) {
  const d = pick(L.dens);
  const q = randInt(1, L.maxEnteros);
  const r = randInt(1, d - 1);
  const n = q * d + r;
  const correct = fs(n, d);
  return {
    instruction: "Escríbelo como fracción:",
    display: mixStr(q, r, d),
    options: uniqueOptions(correct, [fs(q + r, d), fs(q * r + d, d), fs(q * d, d), fs(n, d + 1), fs(q * d - r, d)], 4, fracValue),
    correct,
    hint: `Cada unidad son ${d}/${d}. Calcula cuántas partes son ${q} ${q === 1 ? "unidad" : "unidades"} y suma las ${r} que sobran.`,
    explain: `${q} ${q === 1 ? "unidad" : "unidades"} = ${q} × ${d} = ${q * d} partes de 1/${d}. Más ${r}: ${q * d} + ${r} = ${n}. Por eso ${mixStr(q, r, d)} = ${correct}.`,
  };
}

// --- Comparar ---
function compareExplain(a, b, c, d, sign) {
  const A = fs(a, b);
  const B = fs(c, d);
  if (b === d) {
    return sign === "="
      ? `Son la misma fracción: ${A} = ${B}.`
      : `Las dos tienen denominador ${b}: partes del mismo tamaño. Es mayor la que toma más partes: ${Math.max(a, c)} > ${Math.min(a, c)}, así que ${A} ${sign} ${B}.`;
  }
  if (a === c) {
    return `Las dos toman ${a} ${a === 1 ? "parte" : "partes"}, pero las partes de la fracción con denominador ${Math.min(b, d)} son más grandes (el todo se divide en menos partes). Por eso ${A} ${sign} ${B}.`;
  }
  if ((a < b) !== (c < d) && a !== b && c !== d) {
    const menor = a < b ? A : B;
    const mayor = a < b ? B : A;
    return `${menor} es menor que 1 (numerador menor que denominador) y ${mayor} es mayor que 1. Por eso ${A} ${sign} ${B}.`;
  }
  const m = lcm(b, d);
  return `Se reducen a común denominador: m.c.m.(${b}, ${d}) = ${m}. ${A} = ${fs(a * (m / b), m)} y ${B} = ${fs(c * (m / d), m)}. Como ${a * (m / b)} ${sign} ${c * (m / d)}, ${A} ${sign} ${B}.`;
}

function signOf(a, b, c, d) {
  const x = a * d;
  const y = c * b;
  return x < y ? "<" : x > y ? ">" : "=";
}

function genComparar(L, forceDiff = false) {
  let a;
  let b;
  let c;
  let d;
  const tipo = forceDiff ? "distinto" : pick(L === LEVELS.altas ? ["den", "num", "unidad", "distinto"] : ["den", "den", "num", "unidad"]);
  if (tipo === "den") {
    b = d = pick(L.dens);
    a = randInt(1, b + 2);
    c = Math.random() < 0.15 ? a : randInt(1, b + 2);
  } else if (tipo === "num") {
    // Numerador menor que los dos denominadores: 2/3 y 2/5, no 2/2.
    const dens = L.dens.slice().sort((x, y) => x - y);
    a = c = randInt(1, Math.min(5, dens[dens.length - 2] - 1));
    [b, d] = shuffle(dens.filter((x) => x > a)).slice(0, 2);
  } else if (tipo === "unidad") {
    b = pick(L.dens);
    a = randInt(1, b - 1);
    d = pick(L.dens.filter((x) => x !== b));
    c = randInt(d + 1, 2 * d);
    if (Math.random() < 0.5) [a, b, c, d] = [c, d, a, b];
  } else {
    do {
      [b, d] = shuffle(L.dens.filter((x) => x <= 10)).slice(0, 2);
      a = randInt(1, b - 1);
      c = randInt(1, d - 1);
    } while (b === d || a === c || a * d === b * c);
  }
  const sign = signOf(a, b, c, d);
  return {
    instruction: "¿Qué signo va en el hueco (␣)?",
    display: `${fs(a, b)} ␣ ${fs(c, d)}`,
    options: SIGNOS,
    keepOrder: true,
    correct: sign,
    hint:
      tipo === "den" ? "Tienen el mismo denominador: fíjate en el numerador."
      : tipo === "num" ? "Tienen el mismo numerador: ¿cuál tiene las partes más grandes?"
      : tipo === "unidad" ? "Compara cada una con la unidad: ¿es menor o mayor que 1?"
      : "Busca fracciones equivalentes con el mismo denominador (el m.c.m. de los dos).",
    explain: compareExplain(a, b, c, d, sign),
  };
}

function genComunDenComparar(L) {
  return genComparar(L, true);
}

function genOrdenar(L, forceDiff = false) {
  const tipo = forceDiff ? "distinto" : pick(["den", "num"]);
  let fr;
  if (tipo === "den") {
    const d = pick(L.dens.filter((x) => x >= 4));
    const nums = shuffle(Array.from({ length: d + 2 }, (_, i) => i + 1)).slice(0, 3);
    fr = nums.map((n) => [n, d]);
  } else if (tipo === "num") {
    const n = randInt(1, 4);
    const dens = shuffle(L.dens).slice(0, 3);
    fr = dens.map((d) => [n, d]);
  } else {
    do {
      const dens = shuffle([2, 3, 4, 5, 6, 8, 10, 12]).slice(0, 3);
      fr = dens.map((d) => [randInt(1, d - 1), d]);
    } while (new Set(fr.map(([n, d]) => n / d)).size < 3 || lcm(lcm(fr[0][1], fr[1][1]), fr[2][1]) > 60);
  }
  const sorted = fr.slice().sort((x, y) => x[0] / x[1] - y[0] / y[1]);
  const str = (arr) => arr.map(([n, d]) => fs(n, d)).join(" < ");
  const correct = str(sorted);
  const perms = [[0, 2, 1], [1, 0, 2], [2, 1, 0], [1, 2, 0], [2, 0, 1]].map((p) => str(p.map((i) => sorted[i])));
  let explain;
  if (tipo === "den") explain = `Las tres tienen denominador ${fr[0][1]}: se ordenan por el numerador, de menor a mayor. ${correct}.`;
  else if (tipo === "num") explain = `Las tres tienen numerador ${fr[0][0]}: cuanto mayor es el denominador, más pequeñas son las partes. ${correct}.`;
  else {
    const m = lcm(lcm(fr[0][1], fr[1][1]), fr[2][1]);
    explain = `Con denominador común ${m}: ${sorted.map(([n, d]) => `${fs(n, d)} = ${fs(n * (m / d), m)}`).join(", ")}. Ordenadas: ${correct}.`;
  }
  return {
    instruction: "Ordena de menor a mayor:",
    display: shuffle(fr).map(([n, d]) => fs(n, d)).join("   ·   "),
    options: uniqueOptions(correct, perms),
    correct,
    hint: tipo === "den" ? "Mismo denominador: mira los numeradores." : tipo === "num" ? "Mismo numerador: la de denominador más grande es la más pequeña." : "Pásalas todas al mismo denominador.",
    explain,
  };
}

function genComunDenOrdenar(L) {
  return genOrdenar(L, true);
}

// --- Equivalentes ---
function crossText(a, b, c, d) {
  return `${a} × ${d} = ${a * d} y ${b} × ${c} = ${b * c}`;
}

function baseFraction(L) {
  let n;
  let d;
  do {
    d = pick(L.dens.filter((x) => x <= 8));
    n = randInt(1, d - 1);
  } while (gcd(n, d) !== 1);
  return [n, d];
}

function genEquivSiNo(L) {
  const [n, d] = baseFraction(L);
  const k = pick(L.factores);
  const yes = Math.random() < 0.5;
  let N = n * k;
  let D = d * k;
  let trampa = false;
  if (!yes) {
    const v = randInt(0, 2);
    if (v === 0) { N = n + k; D = d + k; trampa = true; }
    else if (v === 1) N = N + 1;
    else D = D + 1;
  }
  const swap = Math.random() < 0.5;
  const [p, q, r, s] = swap ? [N, D, n, d] : [n, d, N, D];
  return {
    instruction: "¿Son estas dos fracciones equivalentes?",
    display: `${fs(p, q)} y ${fs(r, s)}`,
    options: YES_NO,
    keepOrder: true,
    correct: yes ? "Sí" : "No",
    hint: "Mira si se pasa de una a otra multiplicando el numerador y el denominador por el mismo número, o multiplica en cruz.",
    explain: yes
      ? `Sí: ${n} × ${k} = ${n * k} y ${d} × ${k} = ${d * k}, numerador y denominador multiplicados por ${k}. En cruz: ${crossText(p, q, r, s)}, iguales.`
      : `No. En cruz: ${crossText(p, q, r, s)}, no son iguales.${trampa ? ` Se ha sumado ${k} arriba y abajo, y sumar no da fracciones equivalentes: hay que multiplicar o dividir.` : ""}`,
  };
}

function genCompletarEquiv(L) {
  const [n, d] = baseFraction(L);
  const k = pick(L.factores);
  const N = n * k;
  const D = d * k;
  if (Math.random() < 0.5) {
    return {
      instruction: "Amplía: completa la fracción equivalente.",
      display: `${fs(n, d)} = ?/${D}`,
      options: uniqueOptions(String(N), [String(n + D - d), String(N + 1), String(n * (k + 1)), String(Math.max(1, N - 1)), String(D)]),
      correct: String(N),
      hint: `¿Por cuánto has multiplicado el denominador para pasar de ${d} a ${D}? Haz lo mismo con el numerador.`,
      explain: `${d} × ${k} = ${D}, así que el numerador también se multiplica por ${k}: ${n} × ${k} = ${N}. ${fs(n, d)} = ${fs(N, D)}.`,
    };
  }
  return {
    instruction: "Simplifica: completa la fracción equivalente.",
    display: `${fs(N, D)} = ?/${d}`,
    options: uniqueOptions(String(n), [String(N - (D - d)), String(n + 1), String(N), String(k)].filter((x) => Number(x) > 0)),
    correct: String(n),
    hint: `¿Entre cuánto has dividido el denominador para pasar de ${D} a ${d}? Haz lo mismo con el numerador.`,
    explain: `${D} : ${k} = ${d}, así que el numerador también se divide entre ${k}: ${N} : ${k} = ${n}. ${fs(N, D)} = ${fs(n, d)}.`,
  };
}

function genEquivalenteDe(L) {
  const [n, d] = baseFraction(L);
  const k = pick(L.factores);
  const correct = fs(n * k, d * k);
  const cands = [fs(n + k, d + k), fs(n * k, d), fs(n, d * k), fs(n * k + 1, d * k), fs(d * k, n * k)];
  return {
    instruction: "Busca la fracción equivalente:",
    display: `¿Cuál es equivalente a ${fs(n, d)}?`,
    options: uniqueOptions(correct, cands.filter((c) => Math.abs(fracValue(c) - n / d) > 1e-9), 4, fracValue),
    correct,
    hint: "Busca la que se obtiene multiplicando el numerador y el denominador por el mismo número.",
    explain: `${fs(n, d)} = (${n} × ${k})/(${d} × ${k}) = ${correct}. Las demás no valen lo mismo: comprueba multiplicando en cruz.`,
  };
}

// --- 6º: irreducible ---
function smallestPrime(g) {
  for (let p = 2; p <= g; p++) if (g % p === 0) return p;
  return g;
}

function genIrreducible(L) {
  const [n, d] = baseFraction(L === LEVELS.altas ? L : LEVELS.normal);
  const g = pick(L.gs);
  const N = n * g;
  const D = d * g;
  const correct = fs(n, d);
  const p = smallestPrime(g);
  const cands = [fs(d, n), fs(n, D), fs(n + 1, d), fs(Math.max(1, n - 1), d + 1)];
  if (p !== g) cands.unshift(fs(N / p, D / p));
  const opts = [correct];
  cands.forEach((c) => {
    if (opts.length < 4 && !opts.includes(c) && c !== fs(N, D)) opts.push(c);
  });
  return {
    instruction: "Simplifica hasta la fracción irreducible:",
    display: fs(N, D),
    options: opts,
    correct,
    hint: `Busca el mayor número que divide a la vez a ${N} y a ${D} (su M.C.D.).`,
    explain: `M.C.D.(${N}, ${D}) = ${g}. ${N} : ${g} = ${n} y ${D} : ${g} = ${d}: ${correct}, que ya no se puede simplificar más.${p !== g ? ` ${fs(N / p, D / p)} es equivalente, pero todavía se puede simplificar.` : ""}`,
  };
}

// --- Problemas (5º) ---
// FR_: ficha-generator.js, cargado en la misma página, ya declara NOMBRES.
const FR_NOMBRES = ["Ana", "Lucía", "Mario", "Pablo", "Marta", "Diego", "Sara", "Hugo", "Elena", "Noa", "Bruno", "Claudia"];

function twoNames() {
  const [a, b] = shuffle(FR_NOMBRES);
  return [a, b];
}

function genProbQueda(L) {
  const d = pick(L.dens.filter((x) => x >= (L === LEVELS.acs ? 2 : 4)));
  const [p1, p2] = twoNames();
  if (L === LEVELS.acs || d < 4) {
    const a = randInt(1, d - 1);
    const q = d - a;
    const correct = fs(q, d);
    return {
      instruction: "Lee el problema:",
      display: `Una pizza está cortada en ${d} trozos iguales. ${p1} se come ${a === 1 ? "1 trozo" : `${a} trozos`}. ¿Qué fracción de la pizza queda?`,
      options: uniqueOptions(correct, [fs(a, d), fs(d, q), fs(q, d + 1)], 3),
      correct,
      hint: `La pizza entera son ${d}/${d}. Quita los trozos que se ha comido.`,
      explain: `La pizza entera son ${d}/${d}. Se come ${fs(a, d)}: quedan ${d} − ${a} = ${q} trozos, es decir, ${correct}.`,
    };
  }
  const a = randInt(1, d - 2);
  const b = randInt(1, d - 1 - a);
  const q = d - a - b;
  const correct = fs(q, d);
  return {
    instruction: "Lee el problema:",
    display: `Una pizza está cortada en ${d} trozos iguales. ${p1} se come ${a} y ${p2}, ${b}. ¿Qué fracción de la pizza queda?`,
    options: uniqueOptions(correct, [fs(a + b, d), fs(d, q), fs(q, a + b), fs(q, d - 1)], 4),
    correct,
    hint: `La pizza entera son ${d}/${d}. Resta los trozos que se han comido entre los dos.`,
    explain: `Entre ${p1} y ${p2} se comen ${a} + ${b} = ${a + b} trozos. Quedan ${d} − ${a + b} = ${q}: ${correct} de la pizza.`,
  };
}

function genProbCantidad(L) {
  const d = pick(L === LEVELS.acs ? [2, 4] : L.dens.filter((x) => x <= 8));
  const n = L === LEVELS.acs ? 1 : randInt(1, d - 1);
  // Clases de entre 12 y 30 alumnos (hasta 60 en altas capacidades).
  const m = randInt(Math.ceil(12 / d), Math.floor((L === LEVELS.altas ? 60 : 30) / d));
  const T = d * m;
  const correct = n * m;
  return {
    instruction: "Lee el problema:",
    display: `En una clase de ${T} alumnos, ${fs(n, d)} van al comedor. ¿Cuántos alumnos van al comedor?`,
    options: uniqueOptions(String(correct), [m, T - correct, correct + 1, correct - 1, correct + d, correct * 2].filter((x) => x > 0 && x !== T).map(String)),
    correct: String(correct),
    hint: `Divide ${T} entre ${d} para saber cuánto es 1/${d}, y multiplícalo por ${n}.`,
    explain: `${T} : ${d} = ${m} alumnos es 1/${d} de la clase. ${n === 1 ? `Así que van ${m}.` : `${fs(n, d)} son ${m} × ${n} = ${correct} alumnos.`}`,
  };
}

function genProbQuienMas(L) {
  const [p1, p2] = twoNames();
  const tipo = pick(["den", "num", "equiv"]);
  let a;
  let b;
  let c;
  let d;
  if (tipo === "den") {
    b = d = pick(L.dens.filter((x) => x >= 4));
    [a, c] = shuffle(Array.from({ length: b - 1 }, (_, i) => i + 1)).slice(0, 2);
  } else if (tipo === "num") {
    a = c = randInt(1, 3);
    [b, d] = shuffle(L.dens.filter((x) => x > a)).slice(0, 2);
  } else {
    const [n, den] = baseFraction(L);
    const k = pick(L.factores);
    [a, b, c, d] = Math.random() < 0.5 ? [n, den, n * k, den * k] : [n * k, den * k, n, den];
  }
  const sign = signOf(a, b, c, d);
  const correct = sign === ">" ? p1 : sign === "<" ? p2 : "Los dos igual";
  return {
    instruction: "Lee el problema:",
    display: `${p1} ha pintado ${fs(a, b)} de una valla y ${p2}, ${fs(c, d)} de otra valla igual. ¿Quién ha pintado más?`,
    options: [p1, p2, "Los dos igual"],
    keepOrder: true,
    correct,
    hint: tipo === "equiv" ? "Comprueba si las dos fracciones son equivalentes." : "Compara las dos fracciones.",
    explain: tipo === "equiv"
      ? `${fs(a, b)} y ${fs(c, d)} son equivalentes (en cruz: ${crossText(a, b, c, d)}): han pintado lo mismo.`
      : `${compareExplain(a, b, c, d, sign)} ${sign === "=" ? "Han pintado lo mismo." : `Ha pintado más ${correct}.`}`,
  };
}

function genProbMixto(L) {
  const d = pick(L.dens.filter((x) => x >= 3 && x <= 8));
  const q = randInt(1, L.maxEnteros);
  const r = randInt(1, d - 1);
  const n = q * d + r;
  const txt = (qq, rr) => `${qq} ${qq === 1 ? "tarta entera" : "tartas enteras"} y ${rr} ${rr === 1 ? "trozo" : "trozos"}`;
  const correct = txt(q, r);
  return {
    instruction: "Lee el problema:",
    display: `Cada tarta se corta en ${d} trozos iguales. En la mesa hay ${n} trozos (${fs(n, d)} de tarta). ¿Cuántas tartas enteras se pueden formar y cuántos trozos sobran?`,
    options: uniqueOptions(correct, [txt(q + 1, r), txt(q, d - r), txt(r, q), q > 1 ? txt(q - 1, r + d) : txt(q, r + 1)]),
    correct,
    hint: `Cada tarta entera son ${d} trozos. Divide ${n} entre ${d}.`,
    explain: `${n} : ${d} = ${q} y ${r === 1 ? "sobra 1" : `sobran ${r}`}: ${correct}. Es decir, ${fs(n, d)} = ${mixStr(q, r, d)}.`,
  };
}

const MODE_GROUPS = {
  identificar: [genIdentificar],
  leer: [genLeer],
  propiaimpropia: [genPropiaImpropia, genUnidad],
  mixto: [genAMixto, genAImpropia],
  comparar: [genComparar],
  ordenar: [genOrdenar],
  equivalentes: [genEquivSiNo, genCompletarEquiv, genEquivalenteDe],
  problemas: [genProbQueda, genProbCantidad, genProbQuienMas, genProbMixto],
  comundenominador: [genComunDenComparar, genComunDenOrdenar],
  irreducible: [genIrreducible],
};

// ACS: medios, tercios y cuartos con dibujo, su lectura y la pizza.
const ACS_GENERATORS = [genIdentificar, genIdentificar, genLeer, genProbQueda];
// Discalculia: contenidos de 5º con denominadores hasta 6 (sin los de 6º).
const SEXTO_MODES = ["comundenominador", "irreducible"];

const FRACCIONES_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Medios, tercios y cuartos (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja con fracciones sencillas (medios, tercios y cuartos): reconocerlas en un dibujo, leerlas y saber qué fracción de una pizza queda.",
    example: "Un dibujo dividido en 4 partes con 3 coloreadas → 3/4, «tres cuartos»",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de fracciones, pero con una tipografía más legible para leer numerador, denominador y problemas.",
    example: "3/5 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Identificar» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Los mismos contenidos de 5º, con denominadores pequeños y la pista a la vista",
    text: "Se trabajan todos los modos de 5º (identificar, leer, comparar, ordenar, equivalentes, número mixto y problemas) con denominadores hasta 6 y la pista abierta desde el principio. Sin «Mezcla» ni los modos de 6º. Las barras y la recta numérica de Explora ayudan a ver cada fracción.",
    example: "2/5 ␣ 4/5 → Pista: tienen el mismo denominador, fíjate en el numerador",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Fracción irreducible y denominadores más grandes",
    text: "Empieza en <strong>simplificar hasta la fracción irreducible</strong>, y en el resto de modos usa denominadores hasta 12 y comparaciones con distinto denominador.",
    example: "24/36 → 2/3 (irreducible)",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Qué fracción representa el dibujo? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  renderTeoriaExamples();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, FRACCIONES_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), FRACCIONES_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("fr-build")) initExplore();
  if (document.getElementById("game-visual")) initGame(diff, (fn) => restartCallbacks.push(fn));
});

function renderTeoriaExamples() {
  const fEl = document.getElementById("ejemplo-fraccion");
  if (fEl) fEl.innerHTML = fractionVisual(3, 5);

  const propiaEl = document.getElementById("ejemplo-propia");
  if (propiaEl) propiaEl.innerHTML = fractionVisual(3, 5, "var(--color-teal)");

  const impropiaEl = document.getElementById("ejemplo-impropia");
  if (impropiaEl) impropiaEl.innerHTML = fractionVisual(7, 4, "var(--color-plum)");

  const mixtoEl = document.getElementById("ejemplo-mixto");
  if (mixtoEl) mixtoEl.innerHTML = fractionVisual(7, 3, "var(--color-amber)");
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
const COLOR_A = "var(--color-indigo)";
const COLOR_B = "var(--color-teal)";

function initExplore() {
  const state = {
    build: { n: 3, d: 5 },
    equiv: { base: 0, k: 2 },
    comp: { n1: 2, d1: 3, n2: 2, d2: 5 },
  };
  const EQUIV_BASES = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [5, 6]];
  const LIMITS = {
    build: { n: [1, (s) => s.d * 3], d: [2, () => 12] },
    equiv: { base: [0, () => EQUIV_BASES.length - 1], k: [1, () => 5] },
    comp: { n1: [1, (s) => s.d1 * 2], d1: [2, () => 10], n2: [1, (s) => s.d2 * 2], d2: [2, () => 10] },
  };

  function renderBuild() {
    const { n, d } = state.build;
    document.getElementById("fr-build-n").textContent = n;
    document.getElementById("fr-build-d").textContent = d;
    document.getElementById("fr-build-bars").innerHTML = fractionVisual(n, d);
    const units = Math.max(1, Math.ceil(n / d));
    document.getElementById("fr-build-line").innerHTML = numberLineSVG([{ n, d, color: COLOR_A }], units, d);
    const q = Math.floor(n / d);
    const r = n % d;
    let tipo;
    if (n < d) tipo = `Es <strong>menor que 1</strong> (fracción propia): ${n} < ${d}.`;
    else if (n === d) tipo = `Es <strong>igual a 1</strong>: están todas las partes de la unidad (${d}/${d}).`;
    else tipo = `Es <strong>mayor que 1</strong> (fracción impropia). Como número mixto: ${n} : ${d} = ${q} y sobra${r === 1 ? "" : "n"} ${r} → <strong>${mixStr(q, r, d)}</strong>.`;
    const lectura = `«${leerFraccion(n, d)}»`;
    const msg = document.getElementById("fr-build-msg");
    msg.className = "md-msg ok";
    msg.innerHTML = `<strong>${fs(n, d)}</strong> se lee ${lectura}. Cada unidad está dividida en ${d} partes iguales y se ${n === 1 ? "toma 1" : `toman ${n}`}. ${tipo}`;
  }

  function renderEquiv() {
    const [n, d] = EQUIV_BASES[state.equiv.base];
    const k = state.equiv.k;
    document.getElementById("fr-equiv-base").textContent = fs(n, d);
    document.getElementById("fr-equiv-k").textContent = k;
    document.getElementById("fr-equiv-bars").innerHTML =
      `<div class="fr-row"><span class="fr-row-label">${fs(n, d)}</span>${fractionBarSVG(n, d, COLOR_A)}</div>` +
      `<div class="fr-row"><span class="fr-row-label">${fs(n * k, d * k)}</span>${fractionBarSVG(n * k, d * k, COLOR_B)}</div>`;
    document.getElementById("fr-equiv-msg").innerHTML = k === 1
      ? `Multiplicar por 1 deja la fracción igual. Prueba con 2, 3, 4…`
      : `(${n} × ${k})/(${d} × ${k}) = <strong>${fs(n * k, d * k)}</strong>. Hay ${k} veces más partes, pero cada una es ${k} veces más pequeña: <strong>${fs(n, d)} = ${fs(n * k, d * k)}</strong>. Y al revés, simplificando: ${fs(n * k, d * k)} → dividir entre ${k} → ${fs(n, d)}.`;
  }

  function renderComp() {
    const { n1, d1, n2, d2 } = state.comp;
    document.getElementById("fr-comp-a").textContent = fs(n1, d1);
    document.getElementById("fr-comp-b").textContent = fs(n2, d2);
    ["n1", "d1", "n2", "d2"].forEach((k) => (document.getElementById("fr-comp-" + k).textContent = state.comp[k]));
    document.getElementById("fr-comp-bars").innerHTML =
      `<div class="fr-row"><span class="fr-row-label fr-a">A · ${fs(n1, d1)}</span>${fractionVisual(n1, d1, COLOR_A)}</div>` +
      `<div class="fr-row"><span class="fr-row-label fr-b">B · ${fs(n2, d2)}</span>${fractionVisual(n2, d2, COLOR_B)}</div>`;
    const units = Math.max(1, Math.ceil(Math.max(n1 / d1, n2 / d2)));
    document.getElementById("fr-comp-line").innerHTML = numberLineSVG(
      [{ n: n1, d: d1, color: COLOR_A, label: "A" }, { n: n2, d: d2, color: COLOR_B, label: "B" }],
      units,
      d1 === d2 ? d1 : 0
    );
    const sign = signOf(n1, d1, n2, d2);
    const msg = document.getElementById("fr-comp-msg");
    msg.className = "md-msg ok";
    const extra = d1 !== d2 && n1 !== n2 && (n1 < d1) === (n2 < d2) ? " <em>(Comparar así es contenido de 6º; en 5º puedes verlo con las barras y la recta.)</em>" : "";
    msg.innerHTML = `<strong>${fs(n1, d1)} ${sign} ${fs(n2, d2)}</strong>. ${compareExplain(n1, d1, n2, d2, sign)}${extra}`;
  }

  const renders = { build: renderBuild, equiv: renderEquiv, comp: renderComp };

  document.querySelectorAll("[data-fr]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.dataset.fr;
      const key = btn.dataset.key;
      const s = state[group];
      const [min, maxFn] = LIMITS[group][key];
      s[key] = Math.min(maxFn(s), Math.max(min, s[key] + Number(btn.dataset.delta)));
      // Al cambiar un denominador, el numerador no puede pasar de su límite.
      Object.entries(LIMITS[group]).forEach(([k, [mn, mx]]) => {
        s[k] = Math.min(mx(s), Math.max(mn, s[k]));
      });
      renders[group]();
    });
  });

  renderBuild();
  renderEquiv();
  renderComp();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-fracciones"),
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
    const disc = diff.is("discalculia");
    els.modeBtns.forEach((b) => {
      const m = b.dataset.mode;
      b.disabled = acs || (disc && (SEXTO_MODES.includes(m) || m === "mezcla")) || (m === "mezcla" && diff.is("tdah"));
    });

    if (diff.is("altas")) setActiveMode("irreducible");
    else if (acs) setActiveMode("identificar");
    else if (disc && (SEXTO_MODES.includes(mode) || mode === "mezcla")) setActiveMode("identificar");
    else if (diff.is("tdah") && mode === "mezcla") setActiveMode("identificar");

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
    } while ((q.display || q.visual) === lastKey && tries < 10);
    lastKey = q.display || q.visual;
    return q;
  }

  function showHint() {
    els.hintBox.innerHTML = `<strong>Pista:</strong> ${current.hint}`;
    els.hintBox.classList.add("show");
  }

  function startRound() {
    current = pickQuestion();

    els.instructions.textContent = current.instruction;
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";
    els.hintBox.classList.remove("show");
    els.hintBox.innerHTML = "";
    els.hintBtn.disabled = false;
    if (diff.is("discalculia")) showHint();

    els.gameVisual.style.display = current.visual ? "" : "none";
    els.gameVisual.innerHTML = current.visual || "";
    els.wordDisplay.style.display = current.display ? "" : "none";
    els.wordDisplay.textContent = current.display || "";

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
    AppProgress.record("fracciones", isCorrect);
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
