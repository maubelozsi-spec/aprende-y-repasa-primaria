// ============================================================
// Sucesos y probabilidad (5º y 6º): sucesos seguros, posibles e
// imposibles, comparar probabilidades y calcularlas con la regla de
// Laplace (casos favorables / casos posibles).
// - Explora: lanzar un dado muchas veces y llenar una bolsa de bolas.
//   No guarda progreso.
// - Práctica: los experimentos se generan al azar y cada pregunta trae
//   su pista y su explicación. Solo la práctica llama a AppProgress.
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

function mcd(a, b) {
  return b === 0 ? a : mcd(b, a % b);
}
// «4/8 = 1/2» si se puede simplificar.
function simplifica(f, t) {
  const g = mcd(f, t);
  if (f === t) return " = 1";
  return g > 1 && f > 0 ? ` = ${f / g}/${t / g}` : "";
}

// Opciones de probabilidad: fracciones entre 0 y 1 con valor distinto a la
// correcta.
function opcionesFraccion(f, t, candidatos) {
  const v = f / t;
  const vistos = new Set([v.toFixed(6)]);
  const out = [];
  candidatos.forEach(([a, b]) => {
    if (b <= 0 || a < 0 || a > b) return;
    const k = (a / b).toFixed(6);
    if (vistos.has(k)) return;
    vistos.add(k);
    out.push(`${a}/${b}`);
  });
  return uniqueOptions(`${f}/${t}`, out);
}

// ------------------------------------------------------------
// Bolas y colores
// ------------------------------------------------------------
// La letra dentro de cada bola permite distinguirlas sin depender del color.
const COLORES = [
  { id: "roja", pl: "rojas", letra: "R", fill: "var(--color-rose)", txt: "#fff" },
  { id: "azul", pl: "azules", letra: "A", fill: "var(--color-sky)", txt: "#fff" },
  { id: "verde", pl: "verdes", letra: "V", fill: "var(--color-teal)", txt: "#fff" },
  { id: "blanca", pl: "blancas", letra: "B", fill: "#ffffff", txt: "var(--text)" },
];
const colorDe = (id) => COLORES.find((c) => c.id === id);
// «roja» → «rojo» para hablar del color.
const colorNombre = (id) => ({ roja: "rojo", blanca: "blanco" })[id] || id;
const cap = (t) => `${t[0].toUpperCase()}${t.slice(1)}`;
const nombreCuenta = (c, n) => `${n} ${n === 1 ? c.id : c.pl}`;

// bolsa: [{id, n}]
function bolsaTexto(bolsa) {
  const partes = bolsa.filter((b) => b.n > 0).map((b) => nombreCuenta(colorDe(b.id), b.n));
  return partes.length > 1 ? `${partes.slice(0, -1).join(", ")} y ${partes[partes.length - 1]}` : partes[0] || "ninguna bola";
}

function bolsaSVG(bolsa, titulo = "") {
  const bolas = [];
  bolsa.forEach((b) => {
    for (let i = 0; i < b.n; i++) bolas.push(colorDe(b.id));
  });
  const porFila = 5;
  const r = 13;
  const filas = Math.max(1, Math.ceil(bolas.length / porFila));
  const W = 2 * 18 + porFila * 2 * (r + 3);
  const H = 34 + filas * 2 * (r + 3) + 16;
  let out = `<path d="M 14 26 Q 10 ${H - 4} ${W / 2} ${H - 4} Q ${W - 10} ${H - 4} ${W - 14} 26 Z" fill="var(--surface-alt, #f6f7fb)" stroke="var(--text-soft)" stroke-width="2"/>`;
  out += `<path d="M 14 26 Q ${W / 2} 14 ${W - 14} 26" fill="none" stroke="var(--text-soft)" stroke-width="2"/>`;
  bolas.forEach((c, i) => {
    const fila = Math.floor(i / porFila);
    const col = i % porFila;
    const enFila = Math.min(porFila, bolas.length - fila * porFila);
    const x0 = W / 2 - (enFila * 2 * (r + 3)) / 2 + (r + 3);
    const cx = x0 + col * 2 * (r + 3);
    const cy = 34 + r + fila * 2 * (r + 3);
    out += `<circle class="pb-bola" data-c="${c.id}" cx="${cx}" cy="${cy}" r="${r}" fill="${c.fill}" stroke="var(--text)" stroke-width="1.5"/><text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="12" font-weight="800" fill="${c.txt}">${c.letra}</text>`;
  });
  if (titulo) out += `<text x="${W / 2}" y="14" text-anchor="middle" font-size="13" font-weight="800" fill="var(--text)">${titulo}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="${titulo ? `${titulo}: ` : ""}bolsa con ${bolsaTexto(bolsa)}">${out}</svg>`;
}

// Ruleta de n sectores iguales: colores = lista de ids por sector.
function ruletaSVG(colores) {
  const R = 80;
  const cx = 95;
  const cy = 95;
  const n = colores.length;
  let out = "";
  colores.forEach((id, i) => {
    const c = colorDe(id);
    const a0 = (i / n) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
    const p = (a) => `${(cx + R * Math.cos(a)).toFixed(1)} ${(cy + R * Math.sin(a)).toFixed(1)}`;
    out += `<path class="pb-sector" data-c="${id}" d="M ${cx} ${cy} L ${p(a0)} A ${R} ${R} 0 0 1 ${p(a1)} Z" fill="${c.fill}" stroke="var(--text)" stroke-width="1.5"/>`;
    const am = (a0 + a1) / 2;
    out += `<text x="${(cx + R * 0.62 * Math.cos(am)).toFixed(1)}" y="${(cy + R * 0.62 * Math.sin(am) + 5).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="800" fill="${c.txt}">${c.letra}</text>`;
  });
  out += `<polygon points="${cx - 7},4 ${cx + 7},4 ${cx},20" fill="var(--text)"/>`;
  return `<svg viewBox="0 0 190 190" width="190" style="max-width:100%" role="img" aria-label="Ruleta de ${n} partes iguales">${out}</svg>`;
}

// ------------------------------------------------------------
// Niveles
// ------------------------------------------------------------
const LEVELS = {
  // multiplos: al comparar bolsas, un total es el doble o el triple del
  // otro, para que la fracción equivalente sea fácil.
  normal: { max: 6, colores: 3, mismoTotal: false, multiplos: true },
  facil: { max: 4, colores: 2, mismoTotal: true, pequeños: true },
  acs: { max: 4, colores: 2, mismoTotal: true, pequeños: true },
  altas: { max: 8, colores: 3, mismoTotal: false, altas: true },
};

function bolsaAlAzar(L, distintos = false) {
  const k = L.pequeños ? 2 : randInt(2, L.colores);
  const ids = shuffle(COLORES.map((c) => c.id)).slice(0, k);
  let ns;
  do ns = ids.map(() => randInt(1, L.max));
  while (distintos && new Set(ns).size < ns.length);
  return ids.map((id, i) => ({ id, n: ns[i] }));
}

// ------------------------------------------------------------
// Generadores
// ------------------------------------------------------------
const TIPOS = ["Seguro", "Posible", "Imposible"];

function sucesoDado() {
  const casos = [
    () => { const k = randInt(3, 6); return [`sacar un número menor que ${k}`, "Posible", `${k === 3 ? "pueden salir el 1 y el 2" : `pueden salir los números del 1 al ${k - 1}`}, pero también otros`]; },
    () => [`sacar un número menor que ${pick([7, 8, 10])}`, "Seguro", "todas las caras (del 1 al 6) cumplen la condición"],
    () => { const k = randInt(1, 5); return [`sacar un número mayor que ${k}`, "Posible", `pueden salir los números del ${k + 1} al 6, o no`]; },
    () => [`sacar un número mayor que ${pick([6, 7])}`, "Imposible", "ninguna cara es mayor que 6"],
    () => [`sacar un ${pick([0, 7, 8, 9])}`, "Imposible", "el dado solo tiene los números del 1 al 6"],
    () => ["sacar un número par", "Posible", "pueden salir el 2, el 4 o el 6, o un impar"],
    () => ["sacar un número de una cifra", "Seguro", "todos los números del 1 al 6 tienen una cifra"],
    () => ["sacar un número entre 1 y 6 (los dos incluidos)", "Seguro", "todas las caras están entre 1 y 6"],
  ];
  const [ev, tipo, por] = pick(casos)();
  return { txt: `Al lanzar un dado normal, ${ev}.`, tipo, por };
}

function sucesoBolsa(L) {
  const bolsa = bolsaAlAzar(L);
  const dentro = bolsa.map((b) => b.id);
  const fuera = COLORES.map((c) => c.id).filter((id) => !dentro.includes(id));
  const r = Math.random();
  if (r < 0.15) {
    const una = [{ id: dentro[0], n: bolsa[0].n + 1 }];
    return { txt: `En una bolsa con ${bolsaTexto(una)}, sacar una bola ${dentro[0]}.`, tipo: "Seguro", por: `todas las bolas son ${colorDe(dentro[0]).pl}`, visual: bolsaSVG(una) };
  }
  if (r < 0.4 && fuera.length) {
    const c = pick(fuera);
    return { txt: `En una bolsa con ${bolsaTexto(bolsa)}, sacar una bola ${c}.`, tipo: "Imposible", por: `en la bolsa no hay ninguna bola ${c}`, visual: bolsaSVG(bolsa) };
  }
  if (r < 0.55) {
    return { txt: `En una bolsa con ${bolsaTexto(bolsa)}, sacar una bola ${dentro.slice(0, -1).join(", ")} o ${dentro[dentro.length - 1]}.`, tipo: "Seguro", por: "todas las bolas de la bolsa son de esos colores", visual: bolsaSVG(bolsa) };
  }
  const c = pick(dentro);
  return { txt: `En una bolsa con ${bolsaTexto(bolsa)}, sacar una bola ${c}.`, tipo: "Posible", por: `hay bolas ${colorDe(c).pl}, pero también de otros colores`, visual: bolsaSVG(bolsa) };
}

function sucesoOtros() {
  return pick([
    { txt: "Al lanzar una moneda, que salga cara o cruz.", tipo: "Seguro", por: "la moneda solo tiene cara y cruz" },
    { txt: "Al lanzar una moneda, que salga cara.", tipo: "Posible", por: "puede salir cara o cruz" },
    { txt: "Al sacar una carta de la baraja española, que sea de oros.", tipo: "Posible", por: "hay 10 cartas de oros, pero también de copas, espadas y bastos" },
    { txt: "Al sacar una carta de la baraja española, que sea el 9 de copas.", tipo: "Imposible", por: "la baraja española de 40 cartas no tiene ochos ni nueves" },
    { txt: "Al girar una ruleta con los números del 1 al 8, que salga un número menor que 10.", tipo: "Seguro", por: "todos los números de la ruleta son menores que 10" },
    { txt: "Al elegir un día de la semana al azar, que empiece por «m».", tipo: "Posible", por: "pueden salir martes o miércoles, pero también otros días" },
    { txt: "Al elegir un mes al azar, que tenga 32 días.", tipo: "Imposible", por: "ningún mes tiene más de 31 días" },
  ]);
}

function genTipo(L) {
  const s = pick([sucesoDado, sucesoBolsa, sucesoBolsa, sucesoOtros])(L);
  return {
    instruction: "¿Es un suceso seguro, posible o imposible?",
    display: s.txt,
    visual: s.visual,
    options: TIPOS,
    keepOrder: true,
    correct: s.tipo,
    hint: "Seguro: pasa siempre. Imposible: no pasa nunca. Posible: puede pasar o no.",
    explain: `${s.tipo}: ${s.por}.`,
  };
}

// ¿Qué color es más (o menos) probable? Con dibujo de bolsa o ruleta.
function genMasProbable(L) {
  const ruleta = Math.random() < 0.35;
  // Con dos colores, a veces hay las mismas: igual de probable.
  const empate = Math.random() < 0.2;
  let bolsa = bolsaAlAzar({ ...L, colores: 3 }, true);
  if (empate) {
    const n = randInt(2, L.max);
    bolsa = bolsa.slice(0, 2).map((b) => ({ ...b, n }));
  }
  const total = bolsa.reduce((a, b) => a + b.n, 0);
  if (ruleta && total > 12) return genMasProbable(L);
  const sectores = shuffle(bolsa.flatMap((b) => Array(b.n).fill(b.id)));
  const mas = Math.random() < 0.6;
  const ord = bolsa.slice().sort((a, b) => b.n - a.n);
  const ok = mas ? ord[0] : ord[ord.length - 1];
  const donde = ruleta ? "la ruleta" : "la bolsa";
  const cuenta = bolsa.map((b) => (ruleta ? `${b.n} ${b.n === 1 ? "parte" : "partes"} de color ${colorNombre(b.id)}` : nombreCuenta(colorDe(b.id), b.n))).join(", ");
  return {
    instruction: ruleta ? "Giramos la ruleta. Contesta:" : "Sacamos una bola sin mirar. Contesta:",
    display: `¿Qué color es ${mas ? "más" : "menos"} probable?`,
    visual: ruleta ? ruletaSVG(sectores) : bolsaSVG(bolsa),
    options: [...bolsa.map((b) => cap(colorNombre(b.id))), "Igual de probable"],
    keepOrder: true,
    correct: empate ? "Igual de probable" : cap(colorNombre(ok.id)),
    hint: `Cuenta ${ruleta ? "las partes" : "las bolas"} de cada color.`,
    explain: empate
      ? `En ${donde} hay ${cuenta}: los dos colores tienen las mismas, así que son igual de probables.`
      : `En ${donde} hay ${cuenta}. El ${colorNombre(ok.id)} es el que tiene ${mas ? "más" : "menos"}: es el ${mas ? "más" : "menos"} probable.`,
  };
}

// Comparar dos bolsas: lo que cuenta es la proporción, no el número de bolas.
function genComparar(L) {
  let a;
  let ta;
  let b;
  let tb;
  const trampa = !L.mismoTotal && Math.random() < 0.4;
  const igual = !L.mismoTotal && !trampa && Math.random() < 0.25;
  for (;;) {
    ta = randInt(3, L.pequeños ? 6 : L.multiplos ? 5 : 10);
    tb = L.mismoTotal ? ta : L.multiplos ? ta * pick([2, 3]) : randInt(3, 10);
    if (L.multiplos && tb > 12) continue;
    if (L.multiplos && Math.random() < 0.5) [ta, tb] = [tb, ta];
    a = randInt(1, ta - 1);
    b = randInt(1, tb - 1);
    if (L.mismoTotal && a !== b) break;
    if (L.mismoTotal) continue;
    if (ta === tb) continue;
    if (igual && a * tb === b * ta) break;
    // Trampa: la bolsa con más rojas es la menos probable.
    if (trampa && ((a > b && a * tb < b * ta) || (b > a && b * ta < a * tb))) break;
    if (!igual && !trampa && a * tb !== b * ta) break;
  }
  const A = [{ id: "roja", n: a }, { id: "azul", n: ta - a }];
  const B = [{ id: "roja", n: b }, { id: "azul", n: tb - b }];
  const correct = a * tb === b * ta ? "Igual de probable" : a * tb > b * ta ? "Bolsa A" : "Bolsa B";
  const den = (ta * tb) / mcd(ta, tb);
  const eqA = `${a}/${ta}${ta !== den ? ` = ${(a * den) / ta}/${den}` : ""}`;
  const eqB = `${b}/${tb}${tb !== den ? ` = ${(b * den) / tb}/${den}` : ""}`;
  return {
    instruction: "Sacamos una bola sin mirar. ¿En qué bolsa es más probable sacar una bola roja?",
    display: `Bolsa A: ${bolsaTexto(A)}. Bolsa B: ${bolsaTexto(B)}.`,
    visual: `<div class="pb-pareja">${bolsaSVG(A, "Bolsa A")}${bolsaSVG(B, "Bolsa B")}</div>`,
    options: ["Bolsa A", "Bolsa B", "Igual de probable"],
    keepOrder: true,
    correct,
    hint: L.mismoTotal ? "Las dos bolsas tienen las mismas bolas en total: gana la que tenga más rojas." : "No basta con contar las rojas: compara las rojas con el total de bolas de cada bolsa (como fracción).",
    explain: L.mismoTotal
      ? `Las dos tienen ${ta} bolas. A tiene ${a} rojas y B tiene ${b}: ${correct === "Bolsa A" ? "gana A" : "gana B"}.`
      : `A: ${nombreCuenta(colorDe("roja"), a)} de ${ta} → ${eqA}. B: ${nombreCuenta(colorDe("roja"), b)} de ${tb} → ${eqB}. ${correct === "Igual de probable" ? "Son fracciones equivalentes: igual de probable." : `Es mayor en la bolsa ${correct.slice(-1)}.`}${trampa ? " La bolsa con más bolas rojas no es la más probable: en proporción, tiene más azules." : ""}`,
  };
}

const PALABRAS = ["PROBABILIDAD", "MATEMATICAS", "CARACOL", "BANANA", "PELOTA", "ESTADISTICA", "CALCULADORA"];

function genCalcular(L) {
  const tipos = L.pequeños ? ["bolsa", "bolsa", "dado", "ruleta"] : L.altas ? ["bolsa", "dado", "ruleta", "letras", "baraja", "baraja"] : ["bolsa", "bolsa", "dado", "ruleta", "letras", "baraja"];
  const tipo = pick(tipos);
  let f;
  let t;
  let display;
  let visual = "";
  let que;
  if (tipo === "bolsa") {
    const bolsa = bolsaAlAzar(L);
    t = bolsa.reduce((s, b) => s + b.n, 0);
    const c = pick(bolsa);
    f = c.n;
    que = `bolas ${colorDe(c.id).pl}`;
    display = `Una bolsa tiene ${bolsaTexto(bolsa)}. ¿Qué probabilidad hay de sacar una bola ${c.id}?`;
    visual = bolsaSVG(bolsa);
  } else if (tipo === "ruleta") {
    const bolsa = bolsaAlAzar({ ...L, max: 3 });
    const sectores = shuffle(bolsa.flatMap((b) => Array(b.n).fill(b.id)));
    t = sectores.length;
    const c = pick(bolsa);
    f = c.n;
    que = `partes de color ${colorNombre(c.id)}`;
    display = `Giramos la ruleta. ¿Qué probabilidad hay de que salga ${colorNombre(c.id)}?`;
    visual = ruletaSVG(sectores);
  } else if (tipo === "dado") {
    const ev = pick([
      ["un número par", [2, 4, 6]], ["un número impar", [1, 3, 5]], ["un 4", [4]], ["un número mayor que 4", [5, 6]],
      ["un número menor que 3", [1, 2]], ["un múltiplo de 3", [3, 6]], ["un número mayor que 1", [2, 3, 4, 5, 6]],
    ]);
    f = ev[1].length;
    t = 6;
    que = ev[1].join(", ");
    display = `Lanzamos un dado normal. ¿Qué probabilidad hay de sacar ${ev[0]}?`;
  } else if (tipo === "letras") {
    const w = pick(PALABRAS);
    const letras = [...new Set(w)];
    const l = pick(letras.filter((x) => w.split(x).length - 1 >= 1));
    f = w.split(l).length - 1;
    t = w.length;
    que = `letras «${l}»`;
    display = `Escribimos cada letra de la palabra ${w} en una tarjeta y sacamos una sin mirar. ¿Qué probabilidad hay de sacar una «${l}»?`;
  } else {
    const ev = pick([["una carta de oros", 10], ["un as", 4], ["una figura (sota, caballo o rey)", 12], ["el rey de espadas", 1], ["una carta de copas o de bastos", 20]]);
    [, f] = ev;
    t = 40;
    que = ev[0].replace(/^una carta de /, "cartas de ").replace(/^un as$/, "ases").replace(/^una figura.*/, "4 sotas, 4 caballos y 4 reyes").replace(/^el rey/, "el rey");
    display = `Sacamos una carta de una baraja española de 40 cartas. ¿Qué probabilidad hay de sacar ${ev[0]}?`;
  }
  return {
    instruction: "Calcula la probabilidad:",
    display,
    visual: visual || undefined,
    // Errores: favorables entre desfavorables, desfavorables entre total, al revés.
    options: opcionesFraccion(f, t, [[t - f, t], [f, t - f], [1, t], [f + 1, t], [f, t + 1], [f - 1, t], [f, t - 1]]),
    correct: `${f}/${t}`,
    hint: "Probabilidad = casos favorables / casos posibles. Cuenta primero cuántos casos hay en total.",
    explain: `Casos posibles: ${t}. Casos favorables (${que}): ${f}. Probabilidad: ${f}/${t}${simplifica(f, t)}.`,
  };
}

// Ampliación (altas): dos dados y cambiar la bolsa.
function genDosDados() {
  const s = randInt(2, 12);
  const f = 6 - Math.abs(7 - s);
  const pares = [];
  for (let x = 1; x <= 6; x++) if (s - x >= 1 && s - x <= 6) pares.push(`${x}+${s - x}`);
  return {
    instruction: "Ampliación · dos dados:",
    display: `Lanzamos dos dados y sumamos los puntos. ¿Qué probabilidad hay de que la suma sea ${s}?`,
    options: opcionesFraccion(f, 36, [[1, 11], [f, 12], [1, 36], [f + 1, 36], [f, 6]]),
    correct: `${f}/36`,
    hint: "Hay 6 × 6 = 36 parejas posibles (el primer dado y el segundo). Cuenta las que suman lo que te piden.",
    explain: `Parejas que suman ${s}: ${pares.join(", ")} → ${f}. Posibles: 36. Probabilidad: ${f}/36${simplifica(f, 36)}. Ojo: no todas las sumas son igual de probables; la más probable es el 7.`,
  };
}

function genAnadir() {
  const r = randInt(1, 5);
  const az = r + randInt(1, 5);
  const objetivo = pick(["igual", "doble"]);
  const x = objetivo === "igual" ? az - r : 2 * az - r;
  return {
    instruction: "Ampliación · cambiar la bolsa:",
    display: `Una bolsa tiene ${nombreCuenta(colorDe("roja"), r)} y ${nombreCuenta(colorDe("azul"), az)}. ¿Cuántas bolas rojas hay que añadir para que ${objetivo === "igual" ? "sacar roja sea igual de probable que sacar azul" : "sacar roja sea el doble de probable que sacar azul"}?`,
    options: uniqueOptions(String(x), [String(x + 1), String(Math.max(1, x - 1)), String(az), String(az + r), String(x + 2)]),
    correct: String(x),
    hint: objetivo === "igual" ? "Igual de probable: tiene que haber las mismas rojas que azules." : "El doble de probable: tiene que haber el doble de rojas que de azules.",
    explain: objetivo === "igual" ? `Hacen falta ${az} rojas (como azules). Hay ${r}: ${az} − ${r} = ${x}.` : `Hacen falta 2 × ${az} = ${2 * az} rojas. Hay ${r}: ${2 * az} − ${r} = ${x}.`,
  };
}

const MODE_GROUPS = {
  tipo: [genTipo],
  masprobable: [genMasProbable],
  comparar: [genComparar],
  calcular: [genCalcular],
};

const ACS_GENERATORS = [genTipo, genTipo, genMasProbable];

const PROBABILIDAD_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Seguro, posible e imposible y el color más probable (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja distinguir si un suceso es seguro, posible o imposible y decidir, contando, qué color es más o menos probable en una bolsa o una ruleta dibujada.",
    example: "Bolsa con 4 rojas y 1 azul → es más probable sacar roja",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantienen los mismos contenidos, pero con una tipografía más legible para leer los enunciados. Las bolsas y las ruletas están dibujadas.",
    example: "Al lanzar una moneda, sacar cara → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Seguro, posible o imposible» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todos los contenidos, con pocas bolas y la pista a la vista",
    text: "Se trabajan todos los modos con bolsas de pocas bolas y dos colores, comparando bolsas con el mismo total y con la pista abierta desde el principio. Sin «Mezcla». En Explora se puede llenar la bolsa y ver la probabilidad.",
    example: "Bolsa con 3 rojas y 1 azul → probabilidad de roja: 3/4",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Comparar con fracciones, la baraja, dos dados y cambiar la bolsa",
    text: "Empieza en <strong>Calcular</strong>, con la baraja española y palabras; compara bolsas de distinto total con fracciones equivalentes y, como ampliación, calcula probabilidades con dos dados y cuántas bolas hay que añadir para cambiar una probabilidad.",
    example: "Suma 7 con dos dados → 6/36",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Es seguro, posible o imposible? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, PROBABILIDAD_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), PROBABILIDAD_DIFFICULTY_EXPLANATIONS);

  const ej = document.getElementById("pb-ejemplo");
  if (ej) ej.innerHTML = bolsaSVG([{ id: "roja", n: 3 }, { id: "azul", n: 2 }]);
  if (document.getElementById("pb-dado")) initExplore();
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
function barrasDado(cuentas) {
  const W = 300;
  const H = 170;
  const max = Math.max(...cuentas, 1);
  const bw = 32;
  let out = "";
  cuentas.forEach((c, i) => {
    const h = (c / max) * (H - 50);
    const x = 24 + i * 46;
    out += `<rect x="${x}" y="${H - 24 - h}" width="${bw}" height="${h}" fill="var(--color-indigo)" rx="2"/>`;
    out += `<text x="${x + bw / 2}" y="${H - 28 - h}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--text)">${c}</text>`;
    out += `<text x="${x + bw / 2}" y="${H - 8}" text-anchor="middle" font-size="13" font-weight="800" fill="var(--text)">${i + 1}</text>`;
  });
  out += `<line x1="16" y1="${H - 24}" x2="${W - 6}" y2="${H - 24}" stroke="var(--text)" stroke-width="2"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="Veces que ha salido cada cara">${out}</svg>`;
}

function initExplore() {
  const lim = (v, a, z) => Math.max(a, Math.min(z, v));

  // 1. Lanzar un dado muchas veces.
  let cuentas = [0, 0, 0, 0, 0, 0];
  let ultima = null;
  function renderDado() {
    const n = cuentas.reduce((a, b) => a + b, 0);
    document.getElementById("pb-dado-draw").innerHTML = barrasDado(cuentas);
    document.getElementById("pb-dado-msg").innerHTML = n === 0
      ? "Pulsa un botón para lanzar el dado."
      : `${ultima !== null ? `Último lanzamiento: <strong>${ultima}</strong>. ` : ""}Llevas <strong>${n}</strong> lanzamientos. El 6 ha salido ${cuentas[5]} ${cuentas[5] === 1 ? "vez" : "veces"} (${cuentas[5]}/${n}). La probabilidad de cada cara es 1/6: con pocos lanzamientos las barras son muy distintas; con muchos, se van igualando y cada cara sale más o menos 1 de cada 6 veces.`;
  }
  document.querySelectorAll("[data-pb-lanzar]").forEach((b) => b.addEventListener("click", () => {
    for (let i = 0; i < Number(b.dataset.pbLanzar); i++) {
      ultima = randInt(1, 6);
      cuentas[ultima - 1]++;
    }
    renderDado();
  }));
  document.getElementById("pb-dado-reset").addEventListener("click", () => { cuentas = [0, 0, 0, 0, 0, 0]; ultima = null; renderDado(); });

  // 2. Llenar la bolsa.
  const bolsa = [{ id: "roja", n: 3 }, { id: "azul", n: 2 }, { id: "verde", n: 0 }];
  function renderBolsa() {
    bolsa.forEach((b) => (document.getElementById(`pb-n-${b.id}`).textContent = b.n));
    const t = bolsa.reduce((a, b) => a + b.n, 0);
    document.getElementById("pb-bolsa-draw").innerHTML = bolsaSVG(bolsa);
    if (t === 0) {
      document.getElementById("pb-bolsa-msg").innerHTML = "La bolsa está vacía: añade bolas.";
      return;
    }
    const linea = (b) => {
      const tipo = b.n === 0 ? "imposible" : b.n === t ? "seguro" : "posible";
      return `<li>Sacar ${b.id}: <strong>${b.n}/${t}</strong>${simplifica(b.n, t)} (${tipo})</li>`;
    };
    const ord = bolsa.slice().sort((a, b) => b.n - a.n);
    document.getElementById("pb-bolsa-msg").innerHTML = `<ul class="pb-lista">${bolsa.map(linea).join("")}</ul>${ord[0].n === t ? `Es seguro sacar ${ord[0].id}: la probabilidad es 1.` : ord[0].n > ord[1].n ? `Lo más probable es sacar ${ord[0].id}.` : "Hay colores igual de probables."}`;
  }
  document.querySelectorAll("[data-pb-c]").forEach((b) => b.addEventListener("click", () => {
    const c = bolsa.find((x) => x.id === b.dataset.pbC);
    c.n = lim(c.n + Number(b.dataset.pbD), 0, 8);
    renderBolsa();
  }));

  renderDado();
  renderBolsa();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-probabilidad"),
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
  let mode = "tipo";
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

    if (diff.is("altas")) setActiveMode("calcular");
    else if (acs) setActiveMode("tipo");
    else if ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla") setActiveMode("tipo");

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function generatorsFor() {
    if (diff.is("acs")) return ACS_GENERATORS;
    if (mode === "mezcla") return MODE_GROUPS[pick(Object.keys(MODE_GROUPS))];
    if (diff.is("altas") && mode === "calcular") return [genCalcular, genCalcular, genDosDados, genAnadir];
    return MODE_GROUPS[mode];
  }

  function pickQuestion() {
    let q;
    let tries = 0;
    do {
      q = pick(generatorsFor())(level());
      tries++;
    } while (q.instruction + q.display + (q.visual || "") === lastKey && tries < 10);
    lastKey = q.instruction + q.display + (q.visual || "");
    return q;
  }

  function showHint() {
    els.hintBox.innerHTML = `<strong>Pista:</strong> ${current.hint}`;
    els.hintBox.classList.add("show");
  }

  function startRound() {
    current = pickQuestion();

    els.instructions.textContent = current.instruction;
    els.wordDisplay.textContent = current.display;
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
    AppProgress.record("probabilidad", isCorrect);
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
