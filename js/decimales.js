// ============================================================
// Números decimales
// - Explora: construir un decimal (cuadrícula de centésimas, lectura y
//   recta), comparar dos decimales cifra a cifra y sumar o restar en
//   columna. No guarda progreso: es para entender, no para puntuar.
// - Práctica: las preguntas se generan al azar y cada una trae su
//   pista y la explicación que se ve al corregir. Solo la práctica
//   llama a AppProgress.
// Los números se guardan en milésimas enteras (3,45 → 3450) para no
// arrastrar errores de coma flotante (0,1 + 0,2 ≠ 0,3 en JavaScript).
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

// mil: valor en milésimas; k: cifras decimales que se escriben.
function fmt(mil, k) {
  const ent = Math.floor(mil / 1000);
  if (k === 0) return String(ent);
  const dec = String(mil % 1000).padStart(3, "0").slice(0, k);
  return `${ent},${dec}`;
}

// Cifras decimales que hacen falta (sin ceros finales).
function cifrasDec(mil) {
  if (mil % 1000 === 0) return 0;
  if (mil % 100 === 0) return 1;
  if (mil % 10 === 0) return 2;
  return 3;
}

const fmtMin = (mil) => fmt(mil, cifrasDec(mil));

// "3,45" → 3450 (o NaN si no es un decimal válido con hasta 3 cifras).
function parseDec(str) {
  const m = String(str).trim().replace(".", ",").match(/^(\d{1,4})(?:,(\d{1,3}))?$/);
  if (!m) return NaN;
  return Number(m[1]) * 1000 + Number((m[2] || "").padEnd(3, "0"));
}

function answerValue(str) {
  const f = String(str).match(/^(\d+)\/(\d+)$/);
  if (f) return Number(f[1]) / Number(f[2]);
  const v = parseDec(str);
  return isNaN(v) ? NaN : v / 1000;
}

// Opciones distintas por texto y, si son números, también por valor.
function uniqueOptions(correct, candidates, count = 4) {
  const out = [correct];
  const vals = [answerValue(correct)];
  shuffle(candidates).forEach((c) => {
    if (out.length >= count || c === undefined || c === null) return;
    const s = String(c);
    if (out.includes(s) || /undefined|NaN|-/.test(s)) return;
    const v = answerValue(s);
    if (!isNaN(v) && vals.some((x) => !isNaN(x) && Math.abs(x - v) < 1e-9)) return;
    vals.push(v);
    out.push(s);
  });
  return out;
}

// ------------------------------------------------------------
// Lectura en palabras (femenino: unidades, décimas, centésimas…)
// ------------------------------------------------------------
const UNI_F = ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuna", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
const DEC_P = { 3: "treinta", 4: "cuarenta", 5: "cincuenta", 6: "sesenta", 7: "setenta", 8: "ochenta", 9: "noventa" };
const CEN_F = { 1: "ciento", 2: "doscientas", 3: "trescientas", 4: "cuatrocientas", 5: "quinientas", 6: "seiscientas", 7: "setecientas", 8: "ochocientas", 9: "novecientas" };

function palabrasF(n) {
  if (n < 30) return UNI_F[n];
  if (n < 100) return DEC_P[Math.floor(n / 10)] + (n % 10 ? " y " + UNI_F[n % 10] : "");
  if (n === 100) return "cien";
  return CEN_F[Math.floor(n / 100)] + (n % 100 ? " " + palabrasF(n % 100) : "");
}

const LUGAR = { 1: "décima", 2: "centésima", 3: "milésima" };
const cuenta = (n, sing, pl) => `${n} ${n === 1 ? sing : pl}`;
// "A, B y C" (las comas de los decimales no cuentan como separadores).
const enLista = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(", ")} y ${xs[xs.length - 1]}` : xs[0]);
const LUGAR_PL = { 1: "décimas", 2: "centésimas", 3: "milésimas" };

function leerDecimal(mil, k) {
  const ent = Math.floor(mil / 1000);
  const dec = Math.floor((mil % 1000) / Math.pow(10, 3 - k));
  const partes = [];
  if (ent > 0) partes.push(`${palabrasF(ent)} ${ent === 1 ? "unidad" : "unidades"}`);
  if (dec > 0) partes.push(`${palabrasF(dec)} ${dec === 1 ? LUGAR[k] : LUGAR_PL[k]}`);
  return partes.join(" y ") || "cero";
}

// ------------------------------------------------------------
// Niveles
// ------------------------------------------------------------
const LEVELS = {
  normal: { entMax: 20, kMax: 3, kSuma: 2 },
  facil: { entMax: 9, kMax: 2, kSuma: 2 },
  acs: { entMax: 5, kMax: 1, kSuma: 1 },
  altas: { entMax: 99, kMax: 3, kSuma: 3 },
};

// Decimal con exactamente k cifras decimales (la última no es 0).
function randDec(L, k, entMin = 0) {
  const ent = randInt(entMin, L.entMax);
  let f;
  do {
    f = randInt(1, Math.pow(10, k) - 1);
  } while (f % 10 === 0);
  return ent * 1000 + f * Math.pow(10, 3 - k);
}

const SIGNOS = ["<", "=", ">"];
const DE_NOMBRES = ["Ana", "Lucía", "Mario", "Pablo", "Marta", "Diego", "Sara", "Hugo", "Elena", "Noa"];

// Primera posición en la que difieren (para explicar comparaciones).
const POS_NOMBRE = ["la parte entera", "las décimas", "las centésimas", "las milésimas"];
// textoA/textoB: cómo se ven escritos (2,7 y 2,70), para explicar los ceros.
function explicaComparar(a, b, textoA = fmtMin(a), textoB = fmtMin(b)) {
  const A = fmt(a, 3);
  const B = fmt(b, 3);
  if (a === b) return `Valen lo mismo: ${textoA} = ${textoB}. Los ceros al final de la parte decimal no cambian el valor.`;
  const ea = Math.floor(a / 1000);
  const eb = Math.floor(b / 1000);
  if (ea !== eb) return `Se mira primero la parte entera: ${ea} ${ea > eb ? ">" : "<"} ${eb}. No hace falta mirar los decimales.`;
  const da = A.split(",")[1];
  const db = B.split(",")[1];
  let i = 0;
  while (da[i] === db[i]) i++;
  const iguales = i === 0 ? "La parte entera es igual" : `La parte entera y ${POS_NOMBRE.slice(1, i + 1).join(" y ")} son iguales`;
  return `${iguales}. En ${POS_NOMBRE[i + 1]}: ${da[i]} ${da[i] > db[i] ? ">" : "<"} ${db[i]}. Si igualas con ceros se ve mejor: ${A} y ${B}.`;
}

// ------------------------------------------------------------
// Generadores (5º)
// ------------------------------------------------------------
function genLeer(L) {
  const k = randInt(1, L.kMax);
  const mil = randDec(L, k);
  const words = leerDecimal(mil, k);
  const num = fmt(mil, k);
  if (Math.random() < 0.5) {
    const otros = [1, 2, 3].filter((x) => x !== k && x <= Math.max(2, L.kMax));
    const dec = Math.floor((mil % 1000) / Math.pow(10, 3 - k));
    const ent = Math.floor(mil / 1000);
    const cands = otros
      .filter((k2) => dec < Math.pow(10, k2))
      .map((k2) => leerDecimal(ent * 1000 + dec * Math.pow(10, 3 - k2), k2))
      .concat([leerDecimal(((ent + 1) % (L.entMax + 1)) * 1000 + (mil % 1000), k), `${palabrasF(ent || 1)} ${ent === 1 ? "unidad" : "unidades"} y ${palabrasF((dec % 10) || 1)} ${LUGAR_PL[k]}`]);
    return {
      instruction: "¿Cómo se lee este número?",
      display: num,
      options: uniqueOptions(words, cands),
      correct: words,
      hint: `Lee la parte entera con «unidades» y la parte decimal como un número, con el nombre de su última cifra (${LUGAR_PL[k]}).`,
      explain: `${num} tiene ${k} ${k === 1 ? "cifra decimal" : "cifras decimales"}: la última está en ${POS_NOMBRE[k]}. Se lee «${words}».`,
    };
  }
  const dec = Math.floor((mil % 1000) / Math.pow(10, 3 - k));
  const ent = Math.floor(mil / 1000);
  const cands = [1, 2, 3]
    .filter((k2) => k2 !== k && dec < Math.pow(10, k2))
    .map((k2) => fmt(ent * 1000 + dec * Math.pow(10, 3 - k2), k2))
    .concat([`${ent}${dec}`, fmt(((ent + 1) % (L.entMax + 2)) * 1000 + (mil % 1000), k), `${dec},${ent}`]);
  return {
    instruction: "Escribe el número con cifras:",
    display: `«${words}»`,
    options: uniqueOptions(num, cands),
    correct: num,
    hint: `«${LUGAR_PL[k]}» quiere decir que la parte decimal tiene ${k} ${k === 1 ? "cifra" : "cifras"}.`,
    explain: `Las ${LUGAR_PL[k]} ocupan ${k} ${k === 1 ? "cifra" : "cifras"} después de la coma: ${num}.${k > 1 && dec < Math.pow(10, k - 1) ? " Por eso hay que poner ceros delante." : ""}`,
  };
}

function genValor(L) {
  const k = randInt(Math.min(2, L.kMax), L.kMax);
  let mil;
  let digits;
  do {
    mil = randDec(L, k, 1);
    digits = fmt(mil, k).replace(",", "");
  } while (new Set(digits).size !== digits.length);
  const num = fmt(mil, k);
  const [entStr, decStr] = num.split(",");
  const pos = randInt(1, k);
  const cifra = decStr[pos - 1];
  if (Math.random() < 0.5) {
    const correct = `${cifra} ${LUGAR_PL[pos]}`;
    const cands = [1, 2, 3].filter((p) => p !== pos && p <= Math.max(2, k)).map((p) => `${cifra} ${LUGAR_PL[p]}`).concat([`${cifra} unidades`]);
    return {
      instruction: "¿Cuánto vale la cifra?",
      display: `¿Cuánto vale el ${cifra} en ${num}?`,
      options: uniqueOptions(correct, cands),
      correct,
      hint: "Después de la coma vienen, por orden: décimas, centésimas y milésimas.",
      explain: `En ${num}, el ${cifra} está en la posición ${pos} después de la coma: ${POS_NOMBRE[pos]}. Vale ${cifra} ${LUGAR_PL[pos]} = ${fmt(Number(cifra) * Math.pow(10, 3 - pos), pos)}.`,
    };
  }
  const correct = cifra;
  const cands = (entStr + decStr).split("").filter((c) => c !== cifra);
  return {
    instruction: "Busca la cifra:",
    display: `¿Qué cifra ocupa ${POS_NOMBRE[pos]} en ${num}?`,
    options: uniqueOptions(correct, cands),
    correct,
    hint: "Cuenta desde la coma hacia la derecha: décimas, centésimas, milésimas.",
    explain: `${num}: ${decStr.split("").map((c, i) => cuenta(Number(c), LUGAR[i + 1], LUGAR_PL[i + 1])).join(", ")}. En ${POS_NOMBRE[pos]} está el ${cifra}.`,
  };
}

function genFraccionDecimal(L) {
  const k = randInt(1, L.kMax);
  const den = Math.pow(10, k);
  let n;
  do {
    n = randInt(1, L === LEVELS.acs ? den - 1 : den * 3);
  } while (n % 10 === 0 || n === den);
  const mil = n * Math.pow(10, 3 - k);
  const dec = fmt(mil, k);
  if (Math.random() < 0.55) {
    const cands = [1, 2, 3].filter((k2) => k2 !== k && n < Math.pow(10, k2 + 1)).map((k2) => fmtMin(n * Math.pow(10, 3 - k2))).concat([`${n},${den}`, fmtMin(mil * 10)]);
    return {
      instruction: "Escribe la fracción como número decimal:",
      display: `${n}/${den}`,
      options: uniqueOptions(dec, cands),
      correct: dec,
      hint: `El denominador ${den} tiene ${k} ${k === 1 ? "cero" : "ceros"}: el decimal tendrá ${k} ${k === 1 ? "cifra" : "cifras"} después de la coma.`,
      explain: `${n}/${den} son ${n} ${LUGAR_PL[k]}: ${dec}. Con denominador ${den}, la parte decimal tiene ${k} ${k === 1 ? "cifra" : "cifras"}.${n < den / 10 ? " Por eso se ponen ceros después de la coma." : ""}`,
    };
  }
  const correct = `${n}/${den}`;
  const cands = [10, 100, 1000].filter((d) => d !== den).map((d) => `${n}/${d}`).concat([`${n * 10}/${den}`]);
  return {
    instruction: "Escribe el decimal como fracción:",
    display: dec,
    options: uniqueOptions(correct, cands),
    correct,
    hint: `Cuenta las cifras decimales: ${k} → denominador ${den}.`,
    explain: `${dec} tiene ${k} ${k === 1 ? "cifra decimal" : "cifras decimales"} (${LUGAR_PL[k]}): ${dec} = ${correct}.`,
  };
}

function parComparar(L) {
  const r = Math.random();
  if (r < 0.15) {
    const a = randDec(L, 1);
    return [a, a, fmt(a, 1), fmt(a, Math.min(2, Math.max(2, L.kMax)))];
  }
  const ent = randInt(0, L.entMax);
  if (r < 0.55 && L.kMax >= 2) {
    // Trampa: el número con más cifras decimales es el menor (3,45 < 3,5).
    const t = randInt(1, 8);
    const a = ent * 1000 + t * 100;
    const kb = randInt(2, L.kMax);
    let b;
    do {
      b = ent * 1000 + randInt(Math.max(1, (t - 1) * Math.pow(10, kb - 1)), t * Math.pow(10, kb - 1) - 1) * Math.pow(10, 3 - kb);
    } while (b % 10 === 0 && kb === 3);
    const pair = Math.random() < 0.5 ? [a, b] : [b, a];
    return [pair[0], pair[1], fmtMin(pair[0]), fmtMin(pair[1])];
  }
  const k1 = randInt(1, L.kMax);
  const k2 = randInt(1, L.kMax);
  let a;
  let b;
  do {
    a = randDec(L, k1);
    b = Math.floor(a / 1000) * 1000 + (randDec(L, k2) % 1000);
    if (L === LEVELS.acs) b = randDec(L, 1);
  } while (a === b);
  return [a, b, fmtMin(a), fmtMin(b)];
}

function genComparar(L) {
  const [a, b, A, B] = parComparar(L);
  const sign = a < b ? "<" : a > b ? ">" : "=";
  return {
    instruction: "¿Qué signo va en el hueco (␣)?",
    display: `${A} ␣ ${B}`,
    options: SIGNOS,
    keepOrder: true,
    correct: sign,
    hint: "Compara primero la parte entera y después cifra a cifra: décimas, centésimas… Si te ayuda, iguala las cifras con ceros.",
    explain: explicaComparar(a, b, A, B),
  };
}

function genOrdenar(L) {
  const ent = randInt(0, Math.min(L.entMax, 12));
  const vals = new Set();
  while (vals.size < 3) {
    const k = randInt(1, L.kMax);
    vals.add(ent * 1000 + (randDec(L, k) % 1000));
  }
  const arr = [...vals];
  const sorted = arr.slice().sort((x, y) => x - y);
  const str = (xs) => xs.map(fmtMin).join(" < ");
  const correct = str(sorted);
  const lex = arr.slice().sort((x, y) => Number(fmtMin(x).split(",")[1] || 0) - Number(fmtMin(y).split(",")[1] || 0));
  const perms = [[0, 2, 1], [1, 0, 2], [2, 1, 0], [1, 2, 0], [2, 0, 1]].map((p) => str(p.map((i) => sorted[i])));
  const cands = [str(lex)].concat(perms).filter((c) => c !== correct);
  return {
    instruction: "Ordena de menor a mayor:",
    display: shuffle(arr).map(fmtMin).join("   ·   "),
    options: uniqueOptions(correct, cands),
    correct,
    hint: "Iguala todos con ceros hasta que tengan las mismas cifras decimales y compáralos como números enteros.",
    explain: `Igualando con ceros: ${sorted.map((x) => fmt(x, 3)).join(", ")}. De menor a mayor: ${correct}. ${str(lex) !== correct ? `Cuidado: ordenarlos por la «cantidad» de cifras después de la coma (${str(lex)}) está mal.` : ""}`,
  };
}

// --- Recta numérica ---
function rectaSVG(desde, paso, marcaIdx, etiquetas) {
  const W = 520;
  const x0 = 30;
  const x1 = W - 30;
  const y = 48;
  const xOf = (i) => x0 + ((x1 - x0) * i) / 10;
  let out = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="var(--text)" stroke-width="2"/>`;
  for (let i = 0; i <= 10; i++) {
    const big = i === 0 || i === 10 || i === 5;
    out += `<line x1="${xOf(i)}" y1="${y - (big ? 11 : 7)}" x2="${xOf(i)}" y2="${y + (big ? 11 : 7)}" stroke="var(--text)" stroke-width="${big ? 2 : 1.5}"/>`;
  }
  out += `<text x="${xOf(0)}" y="${y + 30}" text-anchor="middle" font-size="15" font-weight="700" fill="var(--text)">${etiquetas[0]}</text>`;
  out += `<text x="${xOf(10)}" y="${y + 30}" text-anchor="middle" font-size="15" font-weight="700" fill="var(--text)">${etiquetas[1]}</text>`;
  if (marcaIdx !== null) {
    const x = xOf(marcaIdx);
    out += `<polygon points="${x - 8},${y - 30} ${x + 8},${y - 30} ${x},${y - 14}" fill="var(--color-rose)"/>`;
  }
  return `<svg viewBox="0 0 ${W} 86" width="100%" style="max-width:${W}px" role="img" aria-label="Recta numérica">${out}</svg>`;
}

function genRecta(L) {
  const centesimas = L.kMax >= 2 && Math.random() < 0.5;
  const ent = randInt(0, Math.min(L.entMax, 9));
  const i = randInt(1, 9);
  if (Math.random() < 0.3 && L !== LEVELS.acs) {
    // ¿Qué número está entre…?
    const d = randInt(1, 8);
    const lo = ent * 1000 + d * 100;
    const c = randInt(1, 9);
    const correct = fmt(lo + c * 10, 2);
    return {
      instruction: "Busca el número que está en medio:",
      display: `¿Qué número está entre ${fmt(lo, 1)} y ${fmt(lo + 100, 1)}?`,
      options: uniqueOptions(correct, [fmt(lo + 200, 1), fmt(lo - 10 * c > ent * 1000 ? lo - 10 * c : lo + 300, 2), fmt(ent * 1000 + c * 10, 2), fmt(lo + 100 + c * 10, 2)]),
      correct,
      hint: `Escribe ${fmt(lo, 1)} y ${fmt(lo + 100, 1)} con centésimas: ${fmt(lo, 2)} y ${fmt(lo + 100, 2)}.`,
      explain: `${fmt(lo, 1)} = ${fmt(lo, 2)} y ${fmt(lo + 100, 1)} = ${fmt(lo + 100, 2)}. Entre ellos están ${fmt(lo + 10, 2)}, ${fmt(lo + 20, 2)}… ${fmt(lo + 90, 2)}: ${correct} es uno de ellos.`,
    };
  }
  if (centesimas) {
    const d = randInt(0, 9);
    const base = ent * 1000 + d * 100;
    const mil = base + i * 10;
    const correct = fmt(mil, 2);
    return {
      instruction: "¿Qué número marca la flecha?",
      visual: rectaSVG(base, 10, i, [fmt(base, 1), fmt(base + 100, 1)]),
      display: "",
      options: uniqueOptions(correct, [fmt(base + i * 100 <= base + 900 ? ent * 1000 + i * 100 : base + 100, 1), fmt(mil + 10, 2), fmt(mil - 10, 2), fmt(ent * 1000 + i * 10, 2), fmt(base + 100 + i * 10, 2)]),
      correct,
      hint: `De ${fmt(base, 1)} a ${fmt(base + 100, 1)} hay una décima partida en 10 centésimas. Cuenta las rayitas.`,
      explain: `Cada rayita es una centésima (0,01). La flecha está ${cuenta(i, "rayita", "rayitas")} después de ${fmt(base, 2)}: ${correct}.`,
    };
  }
  const base = ent * 1000;
  const mil = base + i * 100;
  const correct = fmt(mil, 1);
  return {
    instruction: "¿Qué número marca la flecha?",
    visual: rectaSVG(base, 100, i, [String(ent), String(ent + 1)]),
    display: "",
    options: uniqueOptions(correct, [fmt(base + i * 10, 2), fmt(mil + 100, 1), fmt(mil - 100 >= base ? mil - 100 : mil + 200, 1), `${i},${ent}`, fmt((ent + 1) * 1000 + i * 100, 1)]),
    correct,
    hint: `De ${ent} a ${ent + 1} la unidad está partida en 10 décimas. Cuenta las rayitas.`,
    explain: `Cada rayita es una décima (0,1). La flecha está ${cuenta(i, "rayita", "rayitas")} después de ${ent}: ${correct}.`,
  };
}

// --- Sumar y restar ---
// Error típico: alinear por la derecha en vez de por la coma.
function sumaMalAlineada(a, ka, b, kb, resta) {
  const A = Number(fmt(a, ka).replace(",", ""));
  const B = Number(fmt(b, kb).replace(",", ""));
  const k = Math.max(ka, kb);
  const r = resta ? A - B : A + B;
  if (r <= 0) return null;
  return fmt(r * Math.pow(10, 3 - k), k);
}

function genSumaResta(L) {
  const resta = Math.random() < 0.5;
  const ka = randInt(1, L.kSuma);
  let kb = randInt(1, L.kSuma);
  if (L.kSuma > 1 && ka === kb && Math.random() < 0.6) kb = ka === 1 ? 2 : 1;
  let a = randDec(L, ka, resta ? 1 : 0);
  let b = randDec(L, kb);
  if (resta && a < b) [a, b] = [b, a];
  if (resta && a === b) a += 1000;
  const r = resta ? a - b : a + b;
  const k = Math.max(ka, kb, cifrasDec(a), cifrasDec(b));
  const A = fmt(a, Math.max(cifrasDec(a), 1));
  const B = fmt(b, Math.max(cifrasDec(b), 1));
  const correct = fmtMin(r) || "0";
  const op = resta ? "−" : "+";
  const mal = sumaMalAlineada(a, Math.max(cifrasDec(a), 1), b, Math.max(cifrasDec(b), 1), resta);
  return {
    instruction: "Calcula el resultado:",
    display: `${A} ${op} ${B}`,
    options: uniqueOptions(correct, [mal, fmtMin(r + 100), fmtMin(Math.max(1, r - 100)), fmtMin(r + 10), fmtMin(r * 10), fmtMin(r + 1000)]),
    correct,
    hint: "Coloca los números en columna con las comas una debajo de la otra. Rellena con ceros las cifras que falten.",
    explain: `En columna, con las comas alineadas: ${fmt(a, k)} ${op} ${fmt(b, k)} = ${fmt(r, k)}${fmt(r, k) !== correct ? ` = ${correct}` : ""}.${mal && mal !== correct ? ` Si alineas por la derecha sin mirar la coma, te sale ${mal}, que está mal.` : ""}`,
  };
}

// --- Problemas (5º) ---
function genProbCompra(L) {
  // Precios en céntimos (múltiplos de 5); fmt trabaja en milésimas.
  const p1 = randInt(L === LEVELS.acs ? 1 : 3, L === LEVELS.altas ? 60 : 20) * 100 + randInt(0, 19) * 5;
  const p2 = randInt(1, L === LEVELS.altas ? 30 : 9) * 100 + randInt(1, 19) * 5;
  const total = p1 + p2;
  const euros = (c) => fmt(c * 10, 2);
  const nombre = pick(DE_NOMBRES);
  if (Math.random() < 0.5) {
    const c = euros(total);
    return {
      instruction: "Lee el problema:",
      display: `${nombre} compra un libro de ${euros(p1)} € y un cuaderno de ${euros(p2)} €. ¿Cuánto paga en total?`,
      options: uniqueOptions(c, [euros(total + 100), euros(Math.max(5, total - 100)), sumaMalAlineada(p1 * 10, 2, p2 * 10, 2, false), euros(total + 10), euros(total + 1000)]),
      correct: c,
      hint: "Suma los dos precios en columna, con las comas alineadas.",
      explain: `${euros(p1)} + ${euros(p2)} = ${c} €.`,
    };
  }
  const billete = total <= 2000 ? 20 : total <= 5000 ? 50 : 100;
  const cambio = billete * 100 - total;
  const c = euros(cambio);
  return {
    instruction: "Lee el problema:",
    display: `${nombre} compra un libro de ${euros(p1)} € y un cuaderno de ${euros(p2)} €. Paga con un billete de ${billete} €. ¿Cuánto le devuelven?`,
    options: uniqueOptions(c, [euros(total), euros(cambio + 100), euros(Math.max(5, cambio - 100)), euros(cambio + 10)]),
    correct: c,
    hint: `Suma lo que cuesta todo y réstalo de ${billete} € (${billete},00 €).`,
    explain: `Total: ${euros(p1)} + ${euros(p2)} = ${euros(total)} €. Cambio: ${billete},00 − ${euros(total)} = ${c} €.`,
  };
}

function genProbAltura(L) {
  const [p1, p2] = shuffle(DE_NOMBRES);
  const a = 1000 + randInt(30, 60) * 10;
  let b;
  do {
    b = 1000 + randInt(30, 60) * 10;
    if (Math.random() < 0.4) b = Math.floor(b / 100) * 100;
  } while (b === a);
  const [alto, bajo] = a > b ? [p1, p2] : [p2, p1];
  const mayor = Math.max(a, b);
  const menor = Math.min(a, b);
  const diff = mayor - menor;
  const correct = fmt(diff, 2);
  return {
    instruction: "Lee el problema:",
    display: `${p1} mide ${fmtMin(a)} m y ${p2} mide ${fmtMin(b)} m. ¿Cuántos metros más alto es ${alto} que ${bajo}?`,
    options: uniqueOptions(correct, [fmt(diff * 10, 2), fmt(diff + 10, 2), fmt(Math.abs(diff - 10) || 20, 2), sumaMalAlineada(mayor, Math.max(1, cifrasDec(mayor)), menor, Math.max(1, cifrasDec(menor)), true)]),
    correct,
    hint: "Resta la altura menor a la mayor, con las comas alineadas.",
    explain: `${fmt(mayor, 2)} − ${fmt(menor, 2)} = ${correct} m, es decir, ${diff / 10} cm.`,
  };
}

function genProbCarrera(L) {
  const nombres = shuffle(DE_NOMBRES).slice(0, 3);
  const ent = randInt(11, 14);
  const vals = new Set();
  while (vals.size < 3) {
    const k = randInt(1, Math.min(2, L.kMax));
    vals.add(ent * 1000 + (randDec(L, k) % 1000));
  }
  const tiempos = [...vals];
  const minIdx = tiempos.indexOf(Math.min(...tiempos));
  return {
    instruction: "Lee el problema:",
    display: `En una carrera de 100 m, ${enLista(nombres.map((n, i) => `${n} tarda ${fmtMin(tiempos[i])} s`))}. ¿Quién gana?`,
    options: nombres,
    keepOrder: true,
    correct: nombres[minIdx],
    hint: "Gana quien tarda menos: busca el número más pequeño.",
    explain: `Gana quien tarda menos tiempo. Igualando con ceros: ${tiempos.map((t, i) => `${nombres[i]} ${fmt(t, 2)}`).join(", ")}. El menor es ${fmtMin(tiempos[minIdx])}: gana ${nombres[minIdx]}.`,
  };
}

// ------------------------------------------------------------
// 6º: redondear y fracciones con cualquier denominador
// ------------------------------------------------------------
const RED_LUGAR = [
  { k: 0, nombre: "las unidades" },
  { k: 1, nombre: "las décimas" },
  { k: 2, nombre: "las centésimas" },
];

function genRedondear(L) {
  const lugar = pick(RED_LUGAR);
  let mil;
  do {
    mil = randDec(L, 3, 1);
  } while (cifrasDec(mil) < 3);
  const paso = Math.pow(10, 3 - lugar.k);
  const trunc = Math.floor(mil / paso) * paso;
  const siguiente = Math.floor((mil % paso) / (paso / 10));
  const r = siguiente >= 5 ? trunc + paso : trunc;
  const correct = fmt(r, lugar.k);
  const otra = RED_LUGAR.filter((x) => x.k !== lugar.k).map((x) => {
    const p = Math.pow(10, 3 - x.k);
    const t = Math.floor(mil / p) * p;
    return fmt(Math.floor((mil % p) / (p / 10)) >= 5 ? t + p : t, x.k);
  });
  return {
    instruction: `Redondea a ${lugar.nombre}:`,
    display: fmt(mil, 3),
    options: uniqueOptions(correct, [fmt(trunc, lugar.k), fmt(trunc + paso, lugar.k), fmt(Math.max(0, trunc - paso), lugar.k)].concat(otra.map((o) => (answerValue(o) === answerValue(correct) ? null : o)))),
    correct,
    hint: `Mira la cifra que está justo a la derecha de ${lugar.nombre}: si es 5 o más, sube; si es menor que 5, se queda igual.`,
    explain: `A la derecha de ${lugar.nombre} está el ${siguiente}. ${siguiente >= 5 ? "Como es 5 o más, la cifra sube una unidad" : "Como es menor que 5, la cifra se queda igual"}: ${correct}.${siguiente >= 5 ? ` Si solo cortas, te sale ${fmt(trunc, lugar.k)}, que está mal.` : ""}`,
  };
}

const DEN_EXACTOS = [2, 4, 5, 8, 20, 25, 50];

function genFraccionCualquiera(L) {
  const d = pick(DEN_EXACTOS);
  let n;
  do {
    n = randInt(1, d * 2 - 1);
  } while (n === d || (n * 1000) % d !== 0 || n % d === 0);
  const mil = (n * 1000) / d;
  const correct = fmtMin(mil);
  const recip = (d * 1000) % n === 0 ? fmtMin((d * 1000) / n) : null;
  return {
    instruction: "Escribe la fracción como número decimal:",
    display: `${n}/${d}`,
    options: uniqueOptions(correct, [`${n},${d}`, recip, fmtMin(mil * 10), mil >= 100 ? fmtMin(mil / 10 - ((mil / 10) % 1)) : null, fmtMin(mil + 100)]),
    correct,
    hint: `Divide ${n} entre ${d}, o busca una fracción equivalente con denominador 10, 100 o 1000.`,
    explain: `${n}/${d} = ${n} : ${d} = ${correct}${(() => {
      for (const D of [10, 100, 1000]) if (D % d === 0) return ` (es lo mismo que ${(n * D) / d}/${D})`;
      return "";
    })()}. No es «${n},${d}»: la raya de la fracción es una división, no una coma.`,
  };
}

const MODE_GROUPS = {
  leer: [genLeer],
  valor: [genValor],
  fraccionadecimal: [genFraccionDecimal],
  comparar: [genComparar],
  ordenar: [genOrdenar],
  recta: [genRecta],
  sumarrestar: [genSumaResta],
  problemas: [genProbCompra, genProbAltura, genProbCarrera],
  redondear: [genRedondear, genRedondear, genFraccionCualquiera],
};

const ACS_GENERATORS = [genFraccionDecimal, genLeer, genComparar, genRecta];

const DECIMALES_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo décimas (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja con décimas: pasar de fracción con denominador 10 a decimal, leerlas, compararlas y situarlas en la recta.",
    example: "3/10 = 0,3, «tres décimas»",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de decimales, pero con una tipografía más legible para distinguir bien la coma decimal.",
    example: "2,5 + 1,3 = 3,8 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Leer y escribir» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Los mismos contenidos de 5º, con décimas y centésimas y la pista a la vista",
    text: "Se trabajan todos los modos de 5º con números de hasta dos cifras decimales y parte entera pequeña, con la pista abierta desde el principio. Sin «Mezcla» ni redondeo (6º). La cuadrícula y la recta de Explora ayudan a ver cada número.",
    example: "3,45 ␣ 3,5 → Pista: iguala con ceros: 3,45 y 3,50",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Redondear, fracciones y números más grandes",
    text: "Empieza en <strong>redondear y pasar fracciones a decimales</strong>, y en el resto de modos usa partes enteras de hasta dos cifras y milésimas.",
    example: "3,467 → a las centésimas → 3,47 · 3/4 = 0,75",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "3/10 = ? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, DECIMALES_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), DECIMALES_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("de-build")) initExplore();
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
const PLACES = [
  { key: "D", label: "D", title: "Decenas", mil: 10000 },
  { key: "U", label: "U", title: "Unidades", mil: 1000 },
  { key: "d", label: "d", title: "Décimas", mil: 100 },
  { key: "c", label: "c", title: "Centésimas", mil: 10 },
  { key: "m", label: "m", title: "Milésimas", mil: 1 },
];

// Recta de `lo` a `hi` (en milésimas) con marcas en cada `paso`.
function rectaRango(lo, hi, paso, marks) {
  const W = 520;
  const x0 = 30;
  const x1 = W - 30;
  const y = 52;
  const xOf = (v) => x0 + ((x1 - x0) * (v - lo)) / (hi - lo);
  let out = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="var(--text)" stroke-width="2"/>`;
  const n = Math.round((hi - lo) / paso);
  for (let i = 0; i <= n; i++) {
    const v = lo + i * paso;
    const big = i === 0 || i === n || i % 10 === 0;
    out += `<line x1="${xOf(v)}" y1="${y - (big ? 10 : 6)}" x2="${xOf(v)}" y2="${y + (big ? 10 : 6)}" stroke="var(--text)" stroke-width="${big ? 2 : 1.2}"/>`;
    if (big) out += `<text x="${xOf(v)}" y="${y + 28}" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text)">${fmtMin(v) || "0"}</text>`;
  }
  const xs = marks.map((m) => xOf(Math.max(lo, Math.min(hi, m.v))));
  const juntas = xs.length === 2 && Math.abs(xs[0] - xs[1]) < 26;
  marks.forEach((m, i) => {
    const lx = juntas ? xs[i] + (i === 0 ? -14 : 14) : xs[i];
    out += `<polygon points="${xs[i] - 7},${y - 26} ${xs[i] + 7},${y - 26} ${xs[i]},${y - 13}" fill="${m.color}"/>`;
    out += `<text x="${lx}" y="16" text-anchor="middle" font-size="13" font-weight="800" fill="${m.color}">${m.label}</text>`;
  });
  return `<svg viewBox="0 0 ${W} 92" width="100%" style="max-width:${W}px" role="img" aria-label="Recta numérica">${out}</svg>`;
}

function initExplore() {
  // --- 1. Construir ---
  const st = { D: 0, U: 3, d: 4, c: 5, m: 7 };
  const placesEl = document.getElementById("de-build-places");
  placesEl.innerHTML = PLACES.map(
    (p) => `<div class="de-place${p.key === "d" ? " de-after-comma" : ""}">
      <span class="md-stepper-label" title="${p.title}">${p.label}</span>
      <button type="button" class="btn btn-secondary" data-de-place="${p.key}" data-delta="1" aria-label="${p.title} más uno">+</button>
      <output id="de-place-${p.key}"></output>
      <button type="button" class="btn btn-secondary" data-de-place="${p.key}" data-delta="-1" aria-label="${p.title} menos uno">−</button>
    </div>`
  ).join("");

  function renderBuild() {
    PLACES.forEach((p) => (document.getElementById("de-place-" + p.key).textContent = st[p.key]));
    const mil = PLACES.reduce((s, p) => s + st[p.key] * p.mil, 0);
    const k = Math.max(1, cifrasDec(mil));
    const num = fmt(mil, k);
    document.getElementById("de-build-num").textContent = num;
    let grid = "";
    const centesimas = st.d * 10 + st.c;
    for (let col = 0; col < 10; col++) {
      for (let row = 0; row < 10; row++) {
        const idx = col * 10 + row;
        grid += `<span class="de-cell${idx < centesimas ? " on" : ""}"></span>`;
      }
    }
    document.getElementById("de-build-grid").innerHTML = grid;
    const ent = Math.floor(mil / 1000);
    const descomp = PLACES.filter((p) => st[p.key] > 0).map((p) => `${st[p.key]} ${p.label}`).join(" + ") || "0";
    const lectura = mil % 1000 === 0 ? `${palabrasF(ent)} ${ent === 1 ? "unidad" : "unidades"}` : leerDecimal(mil, cifrasDec(mil));
    document.getElementById("de-build-msg").innerHTML =
      `<p><strong>${num}</strong> se lee «${lectura}».</p>` +
      `<p>Descomposición: ${descomp}.</p>` +
      `<p>La cuadrícula es 1 unidad: hay ${centesimas} ${centesimas === 1 ? "centésima coloreada" : "centésimas coloreadas"} (${st.d} ${st.d === 1 ? "columna entera" : "columnas enteras"} = ${st.d} ${st.d === 1 ? "décima" : "décimas"}, y ${st.c} ${st.c === 1 ? "cuadradito" : "cuadraditos"} más).${st.m ? ` Las ${st.m} milésimas no se ven: cada cuadradito tendría que partirse en 10.` : ""}</p>` +
      (mil % 1000 ? `<p>Como fracción decimal: ${num} = ${mil / Math.pow(10, 3 - cifrasDec(mil))}/${Math.pow(10, cifrasDec(mil))}.</p>` : "");
    const lo = ent * 1000;
    document.getElementById("de-build-line").innerHTML = rectaRango(lo, lo + 1000, 100, [{ v: mil, color: "var(--color-indigo)", label: num }]);
  }

  placesEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-de-place]");
    if (!btn) return;
    const key = btn.dataset.dePlace;
    st[key] = (st[key] + Number(btn.dataset.delta) + 10) % 10;
    renderBuild();
  });

  // --- 2. Comparar ---
  const inA = document.getElementById("de-comp-a");
  const inB = document.getElementById("de-comp-b");

  function renderComp() {
    const a = parseDec(inA.value);
    const b = parseDec(inB.value);
    const msg = document.getElementById("de-comp-msg");
    if (isNaN(a) || isNaN(b)) {
      msg.className = "md-msg ko";
      msg.textContent = "Escribe dos números con coma y hasta tres cifras decimales, por ejemplo 3,45.";
      document.getElementById("de-comp-table").innerHTML = "";
      document.getElementById("de-comp-line").innerHTML = "";
      return;
    }
    // Tabla U | , | d c m con la primera cifra distinta resaltada.
    const filas = [a, b].map((v) => fmt(v, 3).split(","));
    const anchoEnt = Math.max(filas[0][0].length, filas[1][0].length);
    let difCol = null;
    if (filas[0][0] !== filas[1][0]) difCol = "ent";
    else for (let i = 0; i < 3 && difCol === null; i++) if (filas[0][1][i] !== filas[1][1][i]) difCol = i;
    const fila = ([ent, dec], cls, nombre) =>
      `<tr class="${cls}"><th>${nombre}</th><td class="${difCol === "ent" ? "de-diff" : ""}">${ent.padStart(anchoEnt, " ")}</td><td class="de-comma">,</td>` +
      dec.split("").map((c, i) => `<td class="${difCol === i ? "de-diff" : ""}">${c}</td>`).join("") + "</tr>";
    document.getElementById("de-comp-table").innerHTML =
      `<table class="de-table"><tr><th></th><th>Entera</th><th></th><th>d</th><th>c</th><th>m</th></tr>${fila(filas[0], "fr-a", "A")}${fila(filas[1], "fr-b", "B")}</table>`;
    const lo = Math.floor(Math.min(a, b) / 1000) * 1000;
    const hi = Math.max(lo + 1000, Math.ceil(Math.max(a, b) / 1000) * 1000);
    const span = (hi - lo) / 1000;
    document.getElementById("de-comp-line").innerHTML = span <= 3 ? rectaRango(lo, hi, span === 1 ? 100 : 1000, [{ v: a, color: "var(--color-indigo)", label: "A" }, { v: b, color: "var(--color-teal)", label: "B" }]) : "";
    const sign = a < b ? "<" : a > b ? ">" : "=";
    msg.className = "md-msg ok";
    msg.innerHTML = `<strong>${inA.value.trim()} ${sign} ${inB.value.trim()}</strong>. ${explicaComparar(a, b, inA.value.trim(), inB.value.trim())}`;
  }
  inA.addEventListener("input", renderComp);
  inB.addEventListener("input", renderComp);

  // --- 3. En columna ---
  const colA = document.getElementById("de-col-a");
  const colB = document.getElementById("de-col-b");
  let op = "+";

  function renderCol() {
    const a = parseDec(colA.value);
    const b = parseDec(colB.value);
    const out = document.getElementById("de-col-out");
    const msg = document.getElementById("de-col-msg");
    if (isNaN(a) || isNaN(b)) {
      out.innerHTML = "";
      msg.className = "md-msg ko";
      msg.textContent = "Escribe dos números con coma y hasta tres cifras decimales.";
      return;
    }
    if (op === "−" && a < b) {
      out.innerHTML = "";
      msg.className = "md-msg ko";
      msg.textContent = "Para restar, el primer número tiene que ser mayor o igual que el segundo.";
      return;
    }
    const ka = cifrasDec(a);
    const kb = cifrasDec(b);
    const k = Math.max(1, ka, kb);
    const r = op === "+" ? a + b : a - b;
    const anchoEnt = Math.max(...[a, b, r].map((v) => String(Math.floor(v / 1000)).length));
    // Fila: signo, cifras enteras alineadas a la derecha, coma, cifras
    // decimales; los ceros añadidos para igualar van en gris.
    const fila = (v, kv, signo, cls) => {
      const [ent, dec] = fmt(v, k).split(",");
      const enteras = ent.padStart(anchoEnt, " ").split("").map((c) => `<td>${c.trim()}</td>`).join("");
      const decs = dec.split("").map((c, i) => `<td class="${i >= Math.max(kv, 1) ? "de-zero" : ""}">${c}</td>`).join("");
      return `<tr class="${cls}"><td class="de-op">${signo}</td>${enteras}<td class="de-comma">,</td>${decs}</tr>`;
    };
    out.innerHTML = `<table class="de-table de-col">${fila(a, ka, "", "")}${fila(b, kb, op, "de-last")}${fila(r, k, "", "de-res")}</table>`;
    msg.className = "md-msg ok";
    msg.innerHTML = `${fmt(a, k)} ${op} ${fmt(b, k)} = <strong>${fmt(r, k)}</strong>${fmtMin(r) !== fmt(r, k) ? ` = ${fmtMin(r) || "0"}` : ""}. ${ka !== kb ? "Los ceros en gris se añaden para que los dos números tengan las mismas cifras decimales: no cambian su valor." : "Las comas van alineadas: décimas con décimas, centésimas con centésimas."}`;
  }
  colA.addEventListener("input", renderCol);
  colB.addEventListener("input", renderCol);
  document.querySelectorAll("#de-col-op [data-de-op]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#de-col-op [data-de-op]").forEach((b) => b.classList.toggle("active", b === btn));
      op = btn.dataset.deOp;
      renderCol();
    });
  });

  renderBuild();
  renderComp();
  renderCol();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-decimales"),
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
  let mode = "leer";
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
      b.disabled = acs || (disc && (m === "redondear" || m === "mezcla")) || (m === "mezcla" && diff.is("tdah"));
    });

    if (diff.is("altas")) setActiveMode("redondear");
    else if (acs) setActiveMode("leer");
    else if (disc && (mode === "redondear" || mode === "mezcla")) setActiveMode("leer");
    else if (diff.is("tdah") && mode === "mezcla") setActiveMode("leer");

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
    els.wordDisplay.textContent = current.display || "";
    els.wordDisplay.style.display = current.display ? "" : "none";
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
    AppProgress.record("decimales", isCorrect);
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
