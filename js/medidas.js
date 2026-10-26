// ============================================================
// Medidas (5º Tema 6: unidades de longitud, capacidad, masa y
// superficie; 6º SdA 6: además tonelada y quintal, medidas agrarias
// y problemas con medidas)
// - Explora: la escalera de unidades con la tabla de cifras y por qué
//   la superficie va de 100 en 100. No guarda progreso.
// - Práctica: las medidas se generan al azar y cada pregunta trae su
//   pista y su explicación. Solo la práctica llama a AppProgress.
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
// Números exactos: N / 10^D (sin errores de coma flotante)
// ------------------------------------------------------------
function dec(N, D = 0) {
  while (D > 0 && N % 10 === 0) {
    N /= 10;
    D--;
  }
  return { N, D };
}

// Multiplica por 10^k (k puede ser negativo: divide).
function por10(x, k) {
  if (k >= 0) {
    if (k <= x.D) return dec(x.N, x.D - k);
    return dec(x.N * 10 ** (k - x.D), 0);
  }
  return dec(x.N, x.D - k);
}

const valor = (x) => x.N / 10 ** x.D;

// 2500 → "2.500"; 0,025 → "0,025"
function fmt(x) {
  const s = String(Math.abs(x.N)).padStart(x.D + 1, "0");
  const ent = x.D ? s.slice(0, -x.D) : s;
  const fr = x.D ? s.slice(-x.D) : "";
  const conPuntos = ent.length > 3 ? ent.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ent;
  return `${x.N < 0 ? "−" : ""}${conPuntos}${fr ? `,${fr}` : ""}`;
}

const veces = (k) => fmt(dec(10 ** k));

// ------------------------------------------------------------
// Las escaleras de unidades
// ------------------------------------------------------------
const MAG = {
  longitud: { u: ["km", "hm", "dam", "m", "dm", "cm", "mm"], salto: 1, nombre: "longitud", base: "metro" },
  capacidad: { u: ["kl", "hl", "dal", "l", "dl", "cl", "ml"], salto: 1, nombre: "capacidad", base: "litro" },
  masa: { u: ["kg", "hg", "dag", "g", "dg", "cg", "mg"], salto: 1, nombre: "masa", base: "gramo" },
  superficie: { u: ["km²", "hm²", "dam²", "m²", "dm²", "cm²", "mm²"], salto: 2, nombre: "superficie", base: "metro cuadrado" },
};

// Unidades más usadas para cada nivel: los pares que salen.
const COMUNES = {
  longitud: [["km", "m"], ["m", "cm"], ["m", "mm"], ["cm", "mm"], ["m", "dm"], ["dm", "cm"], ["km", "hm"], ["hm", "m"], ["dam", "m"], ["km", "dam"]],
  capacidad: [["l", "ml"], ["l", "cl"], ["l", "dl"], ["dl", "ml"], ["cl", "ml"], ["hl", "l"], ["kl", "l"], ["dal", "l"]],
  masa: [["kg", "g"], ["g", "mg"], ["hg", "g"], ["dag", "g"], ["kg", "hg"], ["g", "cg"], ["g", "dg"]],
  superficie: [["m²", "dm²"], ["m²", "cm²"], ["dm²", "cm²"], ["cm²", "mm²"], ["dam²", "m²"], ["hm²", "m²"], ["km²", "hm²"], ["km²", "m²"]],
};
const FACILES = {
  longitud: [["km", "m"], ["m", "cm"], ["cm", "mm"], ["m", "dm"]],
  capacidad: [["l", "ml"], ["l", "cl"], ["l", "dl"]],
  masa: [["kg", "g"], ["g", "mg"]],
  superficie: [["m²", "dm²"], ["dm²", "cm²"], ["m²", "cm²"]],
};

// Escalones (con signo) para pasar de a a b, y potencia de 10.
function pasos(mag, a, b) {
  const u = MAG[mag].u;
  const s = u.indexOf(b) - u.indexOf(a);
  return { s, k: s * MAG[mag].salto };
}

const LEVELS = {
  normal: { dec: 0.4, pares: COMUNES },
  facil: { dec: 0, pares: FACILES, enteros: true },
  acs: { dec: 0, pares: FACILES, enteros: true },
  altas: { dec: 0.6, pares: null },
};

// Una cantidad de partida que da un resultado razonable.
function cantidad(L, k) {
  if (k > 0) {
    // Hacia una unidad menor: se multiplica.
    if (Math.random() < L.dec) return dec(randInt(11, 99) * (Math.random() < 0.5 ? 1 : 10) + randInt(0, 9), 2);
    return dec(randInt(2, L.enteros ? 9 : 25), 0);
  }
  // Hacia una unidad mayor: se divide. Con enteros, que salga exacto.
  const m = -k;
  if (L.enteros) return dec(randInt(2, 9) * 10 ** m, 0);
  return dec(randInt(2, 999) * (Math.random() < 0.5 ? 10 ** Math.max(0, m - 2) : 1), 0);
}

function parAzar(L, mag) {
  if (L.pares) {
    const [a, b] = pick(L.pares[mag]);
    return Math.random() < 0.5 ? [a, b] : [b, a];
  }
  const u = MAG[mag].u;
  let i;
  let j;
  do {
    i = randInt(0, 6);
    j = randInt(0, 6);
  } while (i === j || (mag === "superficie" && Math.abs(i - j) > 3));
  return [u[i], u[j]];
}

function explicarPaso(mag, a, b, x) {
  const { s, k } = pasos(mag, a, b);
  const n = Math.abs(s);
  const r = por10(x, k);
  const escalones = `${n} ${n === 1 ? "escalón" : "escalones"}`;
  if (k > 0)
    return `De ${a} a ${b} se ${n === 1 ? "baja" : "bajan"} ${escalones}${MAG[mag].salto === 2 ? " y cada escalón es ×100" : ""}: se multiplica por ${veces(k)}. ${fmt(x)} × ${veces(k)} = ${fmt(r)} ${b} (la coma se mueve ${k} ${k === 1 ? "lugar" : "lugares"} a la derecha).`;
  return `De ${a} a ${b} se ${n === 1 ? "sube" : "suben"} ${escalones}${MAG[mag].salto === 2 ? " y cada escalón es ×100" : ""}: se divide entre ${veces(-k)}. ${fmt(x)} : ${veces(-k)} = ${fmt(r)} ${b} (la coma se mueve ${-k} ${-k === 1 ? "lugar" : "lugares"} a la izquierda).`;
}

// ------------------------------------------------------------
// Dibujo de la escalera
// ------------------------------------------------------------
function svgEscalera(mag, a = null, b = null) {
  const u = MAG[mag].u;
  const w = 44;
  const h = 22;
  const W = w * 7 + 20;
  const H = h * 7 + 40;
  let out = "";
  const ia = u.indexOf(a);
  const ib = u.indexOf(b);
  u.forEach((un, i) => {
    const x = 10 + i * w;
    const y = 10 + i * h;
    const tramo = a && b && i >= Math.min(ia, ib) && i <= Math.max(ia, ib);
    const fill = i === ia ? "var(--color-indigo)" : i === ib ? "var(--color-teal)" : tramo ? "var(--color-amber-tint)" : "var(--surface)";
    const color = i === ia || i === ib ? "#fff" : "var(--text)";
    out += `<rect x="${x}" y="${y}" width="${w - 2}" height="${H - y - 10}" rx="4" fill="${fill}" stroke="var(--border-strong)" stroke-width="1.5"/>`;
    out += `<text x="${x + (w - 2) / 2}" y="${y + 16}" text-anchor="middle" font-size="13" font-weight="800" fill="${color}">${un}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="Escalera de unidades de ${MAG[mag].nombre}">${out}</svg>`;
}

// ------------------------------------------------------------
// Generadores
// ------------------------------------------------------------
function genConvertir(L, mag) {
  const [a, b] = parAzar(L, mag);
  const { k } = pasos(mag, a, b);
  const x = cantidad(L, k);
  const r = por10(x, k);
  const salto = MAG[mag].salto;
  const cands = [por10(x, k + 1), por10(x, k - 1), por10(x, -k), por10(x, k + (k > 0 ? 2 : -2))];
  if (salto === 2) cands.unshift(por10(x, k / 2));
  const correct = `${fmt(r)} ${b}`;
  return {
    instruction: "Completa la equivalencia:",
    display: `${fmt(x)} ${a} = ___ ${b}`,
    visual: svgEscalera(mag, a, b),
    options: uniqueOptions(correct, cands.filter((c) => valor(c) !== valor(r)).map((c) => `${fmt(c)} ${b}`)),
    correct,
    hint: `Busca ${a} y ${b} en la escalera. Bajar es multiplicar y subir es dividir${salto === 2 ? ", y en superficie cada escalón vale 100" : ", y cada escalón vale 10"}.`,
    explain: explicarPaso(mag, a, b, x),
  };
}

function genComparar(L, mag) {
  const [a, b] = parAzar(L, mag);
  const { k } = pasos(mag, a, b);
  const x = cantidad(L, k);
  const enB = por10(x, k);
  // La otra cantidad, en la unidad b: igual, un poco mayor o un poco menor.
  const tipo = pick(["igual", "mayor", "menor", "mayor", "menor"]);
  let y;
  if (tipo === "igual") y = enB;
  else {
    const delta = dec(randInt(1, 9) * (enB.D ? 1 : Math.max(1, 10 ** (String(enB.N).length - 2))), enB.D);
    const N = tipo === "mayor" ? enB.N * 10 ** (delta.D - enB.D) + delta.N : enB.N * 10 ** (delta.D - enB.D) - delta.N;
    y = dec(N, Math.max(enB.D, delta.D));
    if (valor(y) <= 0) y = dec(enB.N * 2, enB.D);
  }
  const A = `${fmt(x)} ${a}`;
  const B = `${fmt(y)} ${b}`;
  const vx = valor(enB);
  const vy = valor(y);
  const correct = Math.abs(vx - vy) < 1e-9 ? "Son iguales" : vx > vy ? A : B;
  return {
    instruction: "¿Qué cantidad es mayor?",
    display: `${A}   o   ${B}`,
    options: [A, B, "Son iguales"],
    keepOrder: true,
    correct,
    hint: "Para comparar, pasa las dos cantidades a la misma unidad.",
    explain: `${A} = ${fmt(enB)} ${b}. Comparando ${fmt(enB)} ${b} con ${B}: ${correct === "Son iguales" ? "son la misma cantidad" : `es mayor ${correct}`}.`,
  };
}

const UNIDADES_OBJETOS = {
  longitud: [["el largo de un lápiz", "cm"], ["la distancia entre Sevilla y Málaga", "km"], ["el grosor de una moneda", "mm"], ["la altura de una puerta", "m"], ["el largo del patio del colegio", "m"], ["el ancho de una uña", "mm"], ["un viaje en coche de tres horas", "km"]],
  capacidad: [["una cucharada de jarabe", "ml"], ["una lata de refresco", "cl"], ["una garrafa de agua", "l"], ["el agua de una piscina olímpica", "kl"], ["una gota de agua", "ml"], ["una bañera llena", "l"]],
  masa: [["una persona", "kg"], ["una pastilla", "mg"], ["un yogur", "g"], ["una sandía", "kg"], ["una hormiga", "mg"], ["una carta", "g"], ["un saco de patatas", "kg"]],
  superficie: [["un país", "km²"], ["el suelo de una clase", "m²"], ["un sello", "cm²"], ["la uña de un dedo", "mm²"], ["una pista de pádel", "m²"], ["una baldosa", "dm²"]],
};

function genUnidad(L, mag) {
  const [que, u] = pick(UNIDADES_OBJETOS[mag]);
  const lista = L === LEVELS.acs || L === LEVELS.facil ? MAG[mag].u.filter((x) => ["km", "m", "cm", "mm", "l", "cl", "ml", "kl", "kg", "g", "mg", "km²", "m²", "cm²", "mm²", "dm²"].includes(x)) : MAG[mag].u;
  return {
    instruction: `¿Qué unidad de ${MAG[mag].nombre} usarías para medir…?`,
    display: `${que[0].toUpperCase()}${que.slice(1)}.`,
    options: uniqueOptions(u, shuffle(lista.filter((x) => x !== u))),
    correct: u,
    hint: "Piensa en el tamaño: para cosas pequeñas, unidades pequeñas; para cosas grandes, unidades grandes. Así el número no sale ni enorme ni diminuto.",
    explain: `Se usa el ${u}: es la unidad con la que la medida da un número cómodo, ni muy grande ni muy pequeño.`,
  };
}

// Formas complejas: 3 km 250 m.
function genCompleja(L) {
  const casos = L === LEVELS.acs || L === LEVELS.facil ? [["m", "cm", 2], ["km", "m", 3], ["kg", "g", 3], ["l", "ml", 3]] : [["m", "cm", 2], ["km", "m", 3], ["kg", "g", 3], ["l", "ml", 3], ["cm", "mm", 1], ["m", "dm", 1], ["l", "cl", 2]];
  const [mayor, menor, k] = pick(casos);
  const p = randInt(1, L === LEVELS.facil || L === LEVELS.acs ? 5 : 15);
  // Con frecuencia, una parte pequeña: es donde está el error típico (2 m 5 cm ≠ 25 cm).
  const q = Math.random() < 0.5 ? randInt(1, 9) : randInt(1, 10 ** k - 1);
  const total = p * 10 ** k + q;
  const alReves = L !== LEVELS.acs && L !== LEVELS.facil && Math.random() < 0.35;
  if (alReves) {
    const correct = `${p} ${mayor} ${q} ${menor}`;
    return {
      instruction: "Exprésalo en forma compleja:",
      display: `${fmt(dec(total))} ${menor} = ___ ${mayor} ___ ${menor}`,
      options: uniqueOptions(correct, [`${fmt(dec(p * 10))} ${mayor} ${fmt(dec(q))} ${menor}`, `${p} ${mayor} ${fmt(dec(q * 10))} ${menor}`, `${fmt(dec(Math.floor(total / 10)))} ${mayor} ${total % 10} ${menor}`, `${p + 1} ${mayor} ${fmt(dec(q))} ${menor}`].filter((o) => o !== correct)),
      correct,
      hint: `1 ${mayor} = ${fmt(dec(10 ** k))} ${menor}. ¿Cuántos ${mayor} enteros caben y cuántos ${menor} sobran?`,
      explain: `${fmt(dec(total))} ${menor} = ${fmt(dec(p * 10 ** k))} ${menor} + ${q} ${menor} = ${p} ${mayor} y ${q} ${menor}.`,
    };
  }
  const correct = `${fmt(dec(total))} ${menor}`;
  const malo = Number(`${p}${q}`);
  return {
    instruction: "Exprésalo en una sola unidad:",
    display: `${p} ${mayor} ${q} ${menor} = ___ ${menor}`,
    options: uniqueOptions(correct, [`${fmt(dec(malo))} ${menor}`, `${fmt(dec(p * 10 ** k))} ${menor}`, `${fmt(dec(total + 10 ** k))} ${menor}`, `${fmt(dec(p * 10 ** (k + 1) + q))} ${menor}`].filter((o) => o !== correct)),
    correct,
    hint: `Pasa primero los ${mayor} a ${menor} (1 ${mayor} = ${fmt(dec(10 ** k))} ${menor}) y después suma.`,
    explain: `${p} ${mayor} = ${p} × ${fmt(dec(10 ** k))} = ${fmt(dec(p * 10 ** k))} ${menor}. Más ${q} ${menor}: ${fmt(dec(total))} ${menor}.${malo !== total ? ` Ojo: no es ${fmt(dec(malo))}; no se pueden «pegar» los números.` : ""}`,
  };
}

function genProblemas(L) {
  const facil = L === LEVELS.acs || L === LEVELS.facil;
  const tipo = pick(facil ? ["botellas", "compra", "cinta"] : ["botellas", "compra", "cinta", "recorrido", "jarabe"]);
  if (tipo === "botellas") {
    const a = facil ? randInt(1, 2) : pick([1, 1.5, 2]);
    const b = pick([250, 500, 750]);
    const total = a * 1000 + b;
    return {
      instruction: "Resuelve el problema:",
      display: `Tenemos una botella de ${fmt(dec(a * 10, 1))} l y otra de ${b} ml. ¿Cuántos ml hay en total?`,
      options: uniqueOptions(`${fmt(dec(total))} ml`, [`${fmt(dec(a * 10 + b, 1))} ml`, `${fmt(dec(a * 100 + b))} ml`, `${fmt(dec(total + 1000))} ml`, `${fmt(dec(a * 1000 - b))} ml`]),
      correct: `${fmt(dec(total))} ml`,
      hint: "Antes de sumar, pasa los litros a mililitros: 1 l = 1.000 ml.",
      explain: `${fmt(dec(a * 10, 1))} l = ${fmt(dec(a * 1000))} ml. ${fmt(dec(a * 1000))} + ${b} = ${fmt(dec(total))} ml.`,
    };
  }
  if (tipo === "compra") {
    const kg = randInt(1, facil ? 3 : 5);
    const g = pick([250, 500, 750, 200, 300]);
    const total = kg * 1000 + g;
    return {
      instruction: "Resuelve el problema:",
      display: `Compramos ${kg} kg de patatas y ${g} g de tomates. ¿Cuántos gramos pesa la compra?`,
      options: uniqueOptions(`${fmt(dec(total))} g`, [`${fmt(dec(kg + g))} g`, `${fmt(dec(kg * 100 + g))} g`, `${fmt(dec(kg * 1000 - g))} g`, `${fmt(dec(total + 1000))} g`]),
      correct: `${fmt(dec(total))} g`,
      hint: "1 kg = 1.000 g. Pasa todo a gramos y suma.",
      explain: `${kg} kg = ${fmt(dec(kg * 1000))} g. ${fmt(dec(kg * 1000))} + ${g} = ${fmt(dec(total))} g.`,
    };
  }
  if (tipo === "cinta") {
    const m = randInt(2, facil ? 4 : 9);
    const t = pick([20, 25, 40, 50, 60, 80]);
    const n = randInt(2, Math.min(9, Math.floor((m * 100) / t) - 1));
    const queda = m * 100 - n * t;
    return {
      instruction: "Resuelve el problema:",
      display: `Una cinta mide ${m} m. Cortamos ${n} trozos de ${t} cm. ¿Cuántos centímetros quedan?`,
      options: uniqueOptions(`${queda} cm`, [`${m * 10 - n * t} cm`, `${n * t} cm`, `${queda + t} cm`, `${m * 100} cm`].filter((o) => !o.startsWith("-") && !o.startsWith("0 "))),
      correct: `${queda} cm`,
      hint: "Pasa la cinta a centímetros (1 m = 100 cm) y resta lo que se corta.",
      explain: `${m} m = ${m * 100} cm. Se cortan ${n} × ${t} = ${n * t} cm. Quedan ${m * 100} − ${n * t} = ${queda} cm.`,
    };
  }
  if (tipo === "recorrido") {
    const km = randInt(1, 5);
    const m1 = randInt(100, 900);
    const m2 = randInt(500, 2500);
    const total = km * 1000 + m1 + m2;
    return {
      instruction: "Resuelve el problema:",
      display: `Por la mañana caminamos ${km} km ${m1} m y por la tarde, ${fmt(dec(m2))} m. ¿Cuántos metros hemos caminado?`,
      options: uniqueOptions(`${fmt(dec(total))} m`, [`${fmt(dec(km + m1 + m2))} m`, `${fmt(dec(km * 100 + m1 + m2))} m`, `${fmt(dec(total - m2))} m`, `${fmt(dec(total + 1000))} m`]),
      correct: `${fmt(dec(total))} m`,
      hint: "Pasa todo a metros: 1 km = 1.000 m.",
      explain: `${km} km ${m1} m = ${fmt(dec(km * 1000 + m1))} m. ${fmt(dec(km * 1000 + m1))} + ${fmt(dec(m2))} = ${fmt(dec(total))} m.`,
    };
  }
  const bote = pick([100, 150, 200, 250]);
  const dosis = pick([5, 10]);
  return {
    instruction: "Resuelve el problema:",
    display: `Un bote de jarabe tiene ${fmt(dec(bote, 3))} l. Cada toma es de ${dosis} ml. ¿Cuántas tomas hay en el bote?`,
    options: uniqueOptions(`${bote / dosis} tomas`, [`${bote / dosis / 10} tomas`, `${(bote * 10) / dosis} tomas`, `${bote} tomas`, `${bote / dosis + 5} tomas`].filter((o) => !/\./.test(o.split(" ")[0]))),
    correct: `${bote / dosis} tomas`,
    hint: "Pasa los litros a mililitros (1 l = 1.000 ml) y reparte entre lo que ocupa cada toma.",
    explain: `${fmt(dec(bote, 3))} l = ${bote} ml. ${bote} : ${dosis} = ${bote / dosis} tomas.`,
  };
}

// 6º: tonelada, quintal y medidas agrarias.
function genSexto(L) {
  const tipo = pick(["t", "q", "agraria", "agraria"]);
  if (tipo === "t" || tipo === "q") {
    const f = tipo === "t" ? 1000 : 100;
    const nombre = tipo === "t" ? "tonelada" : "quintal métrico";
    const x = L.enteros || Math.random() < 0.5 ? dec(randInt(2, 30), 0) : dec(randInt(11, 99), 1);
    const r = por10(x, tipo === "t" ? 3 : 2);
    const haciaKg = Math.random() < 0.6;
    if (haciaKg)
      return {
        instruction: "Completa la equivalencia:",
        display: `${fmt(x)} ${tipo} = ___ kg`,
        options: uniqueOptions(`${fmt(r)} kg`, [por10(x, 1), por10(x, tipo === "t" ? 2 : 3), por10(x, 4)].map((c) => `${fmt(c)} kg`)),
        correct: `${fmt(r)} kg`,
        hint: `1 ${nombre} (${tipo}) = ${f === 1000 ? "1.000" : "100"} kg.`,
        explain: `1 ${tipo} = ${f === 1000 ? "1.000" : "100"} kg, así que ${fmt(x)} × ${f === 1000 ? "1.000" : "100"} = ${fmt(r)} kg.`,
      };
    return {
      instruction: "Completa la equivalencia:",
      display: `${fmt(r)} kg = ___ ${tipo}`,
      options: uniqueOptions(`${fmt(x)} ${tipo}`, [por10(x, 1), por10(x, -1), por10(x, tipo === "t" ? 1 : -1 - 1)].map((c) => `${fmt(c)} ${tipo}`)),
      correct: `${fmt(x)} ${tipo}`,
      hint: `1 ${nombre} (${tipo}) = ${f === 1000 ? "1.000" : "100"} kg: divide.`,
      explain: `${fmt(r)} : ${f === 1000 ? "1.000" : "100"} = ${fmt(x)} ${tipo}.`,
    };
  }
  // Medidas agrarias: ha = hm², a = dam², ca = m².
  const AG = [["ha", "hm²", 4], ["a", "dam²", 2], ["ca", "m²", 0]];
  let [i, j] = shuffle([0, 1, 2]).slice(0, 2);
  // Con discalculia, solo hacia la unidad menor y con enteros: sin decimales.
  if (L.enteros && i > j) [i, j] = [j, i];
  const [ua, , ka] = AG[i];
  const [ub, , kb] = AG[j];
  const x = L.enteros || Math.random() < 0.5 ? dec(randInt(2, 40), 0) : dec(randInt(11, 99), 1);
  const r = por10(x, ka - kb);
  return {
    instruction: "Completa la equivalencia (medidas agrarias):",
    display: `${fmt(x)} ${ua} = ___ ${ub}`,
    options: uniqueOptions(`${fmt(r)} ${ub}`, [por10(x, (ka - kb) / 2), por10(x, kb - ka), por10(x, ka - kb + 1), por10(x, ka - kb - 1)].filter((c) => valor(c) !== valor(r)).map((c) => `${fmt(c)} ${ub}`)),
    correct: `${fmt(r)} ${ub}`,
    hint: "1 ha = 1 hm² = 100 a. 1 a = 1 dam² = 100 ca. 1 ca = 1 m². Cada paso vale 100.",
    explain: `1 ${ua} = ${fmt(por10(dec(1), ka - kb))} ${ub}. ${fmt(x)} ${ka > kb ? "×" : ":"} ${veces(Math.abs(ka - kb))} = ${fmt(r)} ${ub}.`,
  };
}

const MODE_GROUPS = {
  longitud: [(L) => genConvertir(L, "longitud"), (L) => genConvertir(L, "longitud"), (L) => genComparar(L, "longitud"), (L) => genUnidad(L, "longitud")],
  capacidad: [(L) => genConvertir(L, "capacidad"), (L) => genConvertir(L, "capacidad"), (L) => genComparar(L, "capacidad"), (L) => genUnidad(L, "capacidad")],
  masa: [(L) => genConvertir(L, "masa"), (L) => genConvertir(L, "masa"), (L) => genComparar(L, "masa"), (L) => genUnidad(L, "masa")],
  superficie: [(L) => genConvertir(L, "superficie"), (L) => genConvertir(L, "superficie"), (L) => genComparar(L, "superficie"), (L) => genUnidad(L, "superficie")],
  complejas: [genCompleja],
  problemas: [genProblemas],
  sexto: [genSexto],
};

// La mezcla es de los contenidos de 5º; tonelada, quintal y agrarias se eligen aparte.
const MEZCLA = ["longitud", "capacidad", "masa", "superficie", "complejas", "problemas"];

const ACS_GENERATORS = [(L) => genConvertir(L, "longitud"), (L) => genConvertir(L, "masa"), (L) => genConvertir(L, "capacidad"), (L) => genUnidad(L, pick(["longitud", "masa", "capacidad"])), genCompleja, genProblemas];

const MEDIDAS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Las unidades más usadas (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja con km, m, cm y mm, kg y g y l, cl y ml, con números enteros: pasar de una unidad a otra, elegir la unidad adecuada, formas como «2 m 30 cm» y problemas de compra.",
    example: "3 m = 300 cm · 2 kg = 2.000 g",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantienen las mismas medidas, pero con una tipografía más legible para leer las unidades y las opciones.",
    example: "2,5 km = 2.500 m → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Longitud» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todos los contenidos, con números enteros y la escalera a la vista",
    text: "Se trabajan todos los modos con las unidades más usadas y números enteros, para que los resultados no tengan decimales, con la escalera de unidades dibujada y la pista abierta desde el principio. Sin «Mezcla». En Explora se ve cómo se mueve la coma.",
    example: "4 m = 400 cm → Pista: bajar es multiplicar",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Cualquier unidad, decimales y medidas de 6º",
    text: "Empieza en <strong>Tonelada, quintal y agrarias</strong>, con saltos entre cualquier unidad (de km a mm, de km² a cm²), cantidades con decimales y formas complejas en los dos sentidos.",
    example: "0,035 km² = 35.000 m²",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "3 km = ___ m → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, MEDIDAS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), MEDIDAS_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("me-escalera")) initExplore();
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
// Tabla de cifras: cada unidad es una columna (en superficie, dos cifras).
// Las columnas más allá de la última unidad se dejan sin nombre.
function tablaCifras(mag, x, unidad) {
  const u = MAG[mag].u;
  const sal = MAG[mag].salto;
  const iu = u.indexOf(unidad);
  const s = String(x.N).padStart(x.D + 1, "0");
  const cols = {};
  [...s].forEach((d, i) => {
    const p = s.length - 1 - i - x.D; // 0 = unidades, −1 = décimas...
    const col = iu - Math.floor(p / sal);
    const pos = sal === 2 ? ((p % 2) + 2) % 2 : 0; // 1 = decenas de la columna
    cols[col] = cols[col] || Array(sal).fill(null);
    cols[col][sal - 1 - pos] = d;
  });
  cols[iu] = cols[iu] || Array(sal).fill("0");
  const idx = Object.keys(cols).map(Number);
  const min = Math.min(...idx);
  const max = Math.max(...idx);
  let cab = "";
  let fila = "";
  for (let c = min; c <= max; c++) {
    let cif = (cols[c] || Array(sal).fill(null)).map((d) => d ?? "0").join("");
    if (c === min && sal === 2 && cif.length === 2 && cif[0] === "0" && c < iu) cif = cif.slice(1);
    if (c === iu && c === min && sal === 2 && cif[0] === "0") cif = cif.slice(1);
    const marca = c === iu ? ' class="me-col"' : "";
    cab += `<th${marca}>${c >= 0 && c < u.length ? u[c] : "&nbsp;"}</th>`;
    fila += `<td${marca}>${cif}${c === iu && c < max ? '<span class="me-coma">,</span>' : ""}</td>`;
  }
  return `<div class="po-tabla-wrap"><table class="rules-table me-tabla"><tr>${cab}</tr><tr>${fila}</tr></table></div>`;
}

function initExplore() {
  const valores = [dec(25, 1), dec(3, 0), dec(475, 2), dec(1250, 0), dec(8, 1), dec(36, 0)];
  let mag = "longitud";
  let iv = 0;
  let de = "m";
  let a = "cm";
  function render() {
    const u = MAG[mag].u;
    if (!u.includes(de)) de = u[3];
    if (!u.includes(a)) a = u[5];
    document.querySelectorAll("[data-me-mag]").forEach((b) => b.classList.toggle("active", b.dataset.meMag === mag));
    document.getElementById("me-de").innerHTML = u.map((x) => `<button type="button" class="btn btn-secondary${x === de ? " active" : ""}" data-me-de="${x}">${x}</button>`).join("");
    document.getElementById("me-a").innerHTML = u.map((x) => `<button type="button" class="btn btn-secondary${x === a ? " active" : ""}" data-me-a="${x}">${x}</button>`).join("");
    document.querySelectorAll("[data-me-de]").forEach((b) => b.addEventListener("click", () => { de = b.dataset.meDe; render(); }));
    document.querySelectorAll("[data-me-a]").forEach((b) => b.addEventListener("click", () => { a = b.dataset.meA; render(); }));
    const x = valores[iv];
    document.getElementById("me-valor").textContent = `${fmt(x)} ${de}`;
    document.getElementById("me-escalera-draw").innerHTML = svgEscalera(mag, de, a);
    const msg = document.getElementById("me-escalera-msg");
    if (de === a) {
      msg.innerHTML = `Elige dos unidades distintas para ver el cambio.`;
      document.getElementById("me-tablas").innerHTML = tablaCifras(mag, x, de);
      return;
    }
    const r = por10(x, pasos(mag, de, a).k);
    msg.innerHTML = `<strong>${fmt(x)} ${de} = ${fmt(r)} ${a}</strong>. ${explicarPaso(mag, de, a, x)}`;
    document.getElementById("me-tablas").innerHTML = `<p class="me-tabla-tit">En la tabla, las cifras no se mueven: solo cambia dónde va la coma.</p>${tablaCifras(mag, x, de)}${tablaCifras(mag, r, a)}`;
  }
  document.querySelectorAll("[data-me-mag]").forEach((b) => b.addEventListener("click", () => { mag = b.dataset.meMag; de = MAG[mag].u[3]; a = MAG[mag].u[5]; render(); }));
  document.getElementById("me-otro").addEventListener("click", () => { iv = (iv + 1) % valores.length; render(); });

  // 2. ¿Por qué la superficie va de 100 en 100?
  let zoom = false;
  function renderSup() {
    const c = 22;
    let out = "";
    for (let i = 0; i <= 10; i++) {
      out += `<line x1="${10 + i * c}" y1="10" x2="${10 + i * c}" y2="${10 + 10 * c}" stroke="${zoom ? "var(--color-teal)" : "var(--border-strong)"}" stroke-width="${i % 10 ? 1 : 3}"/>`;
      out += `<line x1="10" y1="${10 + i * c}" x2="${10 + 10 * c}" y2="${10 + i * c}" stroke="${zoom ? "var(--color-teal)" : "var(--border-strong)"}" stroke-width="${i % 10 ? 1 : 3}"/>`;
    }
    out += `<rect x="10" y="10" width="${c}" height="${c}" fill="var(--color-amber-tint)" stroke="var(--color-amber)" stroke-width="2"/>`;
    document.getElementById("me-sup-draw").innerHTML = `<svg viewBox="0 0 ${20 + 10 * c} ${20 + 10 * c}" width="${20 + 10 * c}" style="max-width:100%" role="img" aria-label="Un cuadrado dividido en 100 cuadraditos">${out}</svg>`;
    document.getElementById("me-sup-btn").textContent = zoom ? "Ver el m²" : "Ver el dm²";
    document.getElementById("me-sup-msg").innerHTML = zoom
      ? "El cuadrado grande es <strong>1 dm²</strong>: 10 cm de lado. Dentro caben 10 filas de 10 cuadraditos de 1 cm²: <strong>1 dm² = 100 cm²</strong>."
      : "El cuadrado grande es <strong>1 m²</strong>: 10 dm de lado. Dentro caben 10 filas de 10 cuadrados de 1 dm² (el naranja es uno): <strong>1 m² = 100 dm²</strong>, no 10. Por eso cada escalón de superficie vale 100.";
  }
  document.getElementById("me-sup-btn").addEventListener("click", () => { zoom = !zoom; renderSup(); });

  render();
  renderSup();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-medidas"),
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
  let mode = "longitud";
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

    if (diff.is("altas")) setActiveMode("sexto");
    else if (acs) setActiveMode("longitud");
    else if ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla") setActiveMode("longitud");

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function generatorsFor() {
    if (diff.is("acs")) return ACS_GENERATORS;
    if (mode === "mezcla") return MODE_GROUPS[pick(MEZCLA)];
    if (diff.is("altas") && mode === "sexto") return [...MODE_GROUPS.sexto, ...MODE_GROUPS.superficie, genCompleja];
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
    els.wordDisplay.textContent = current.display;
    // La escalera solo se enseña con la pista (o siempre, con discalculia).
    els.gameVisual.innerHTML = current.visual || "";
    els.gameVisual.style.display = current.visual && diff.is("discalculia") ? "" : "none";

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
    AppProgress.record("medidas", isCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.answerButtons.querySelectorAll(".syllable-chip").forEach((b) => {
      b.disabled = true;
      if (b.textContent === correct) b.classList.add("correct");
      else if (b === btn && !isCorrect) b.classList.add("incorrect");
    });
    els.hintBtn.disabled = true;
    if (current.visual) els.gameVisual.style.display = "";

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

  els.hintBtn.addEventListener("click", () => {
    showHint();
    if (current.visual) els.gameVisual.style.display = "";
  });
  els.nextBtn.addEventListener("click", startRound);

  applyDifficultyUI();
  startRound();
}
