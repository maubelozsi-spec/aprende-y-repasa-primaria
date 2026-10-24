// ============================================================
// Multiplicación y división de decimales
// - Explora: la coma salta (× y : 10, 100, 1000), multiplicar paso a
//   paso y dividir paso a paso (también entre un decimal, 6º). No
//   guarda progreso: es para entender, no para puntuar.
// - Práctica: las preguntas se generan al azar y cada una trae su
//   pista y la explicación que se ve al corregir. Solo la práctica
//   llama a AppProgress.
// Cada número es { n, k }: sus cifras sin coma y cuántas son
// decimales (3,45 → n = 345, k = 2), que es justo cómo se explica
// en clase («multiplica sin comas y cuenta los decimales») y evita
// los errores de coma flotante.
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

// Quita los ceros finales de la parte decimal: {250, 2} → {25, 1}.
function norm(x) {
  let { n, k } = x;
  while (k > 0 && n % 10 === 0) {
    n /= 10;
    k--;
  }
  return { n, k };
}

function D(n, k) {
  return norm({ n, k });
}

function fmtD(x) {
  const { n, k } = x;
  if (k <= 0) return String(n * Math.pow(10, -k));
  const s = String(n).padStart(k + 1, "0");
  return `${s.slice(0, -k)},${s.slice(-k)}`;
}

const val = (x) => x.n / Math.pow(10, x.k);

function mul(a, b) {
  return D(a.n * b.n, a.k + b.k);
}

// Multiplicar o dividir por 10^e.
function shift(x, e) {
  return e >= 0 ? (x.k >= e ? D(x.n, x.k - e) : D(x.n * Math.pow(10, e - x.k), 0)) : D(x.n, x.k - e);
}

// "3,45" → {345, 2} (o null si no es un número válido).
function parseD(str) {
  const m = String(str).trim().replace(".", ",").match(/^(\d{1,7})(?:,(\d{1,6}))?$/);
  if (!m) return null;
  const dec = m[2] || "";
  return D(Number(m[1] + dec), dec.length);
}

function answerValue(s) {
  const x = parseD(s);
  return x ? val(x) : NaN;
}

function uniqueOptions(correct, candidates, count = 4) {
  const out = [correct];
  const vals = [answerValue(correct)];
  shuffle(candidates).forEach((c) => {
    if (out.length >= count || c === undefined || c === null) return;
    const s = String(c);
    if (out.includes(s) || /undefined|NaN|-/.test(s)) return;
    const v = answerValue(s);
    if (!isNaN(v) && (v <= 0 || vals.some((x) => !isNaN(x) && Math.abs(x - v) < 1e-9))) return;
    vals.push(v);
    out.push(s);
  });
  return out;
}

const cuenta = (n, sing, pl) => `${n} ${n === 1 ? sing : pl}`;

// Decimal al azar con k cifras decimales (la última no es 0).
function randDec(entMax, k, entMin = 0) {
  let f;
  do {
    f = randInt(1, Math.pow(10, k) - 1);
  } while (f % 10 === 0);
  return D(randInt(entMin, entMax) * Math.pow(10, k) + f, k);
}

// Estimación: cada factor redondeado a la unidad (o a la décima si es menor que 1).
function redondeoEstimar(x) {
  const v = val(x);
  if (v >= 1) return Math.round(v);
  return Math.round(v * 10) / 10;
}

function numEs(v) {
  return String(Math.round(v * 1000) / 1000).replace(".", ",");
}

// ------------------------------------------------------------
// Niveles
// ------------------------------------------------------------
// kRes: cifras decimales máximas de un resultado (3 = milésimas).
const LEVELS = {
  normal: { entMax: 20, kMax: 2, nat: [2, 9], kDivisor: 1, kRes: 3 },
  facil: { entMax: 9, kMax: 1, nat: [2, 5], kDivisor: 1, kRes: 2 },
  acs: { entMax: 5, kMax: 1, nat: [2, 3], kDivisor: 1, kRes: 2 },
  altas: { entMax: 60, kMax: 3, nat: [3, 15], kDivisor: 2, kRes: 4 },
};

const DM_NOMBRES = ["Ana", "Lucía", "Mario", "Pablo", "Marta", "Diego", "Sara", "Hugo", "Elena", "Noa"];

// ------------------------------------------------------------
// Generadores (5º)
// ------------------------------------------------------------
function genPotencias10(L) {
  const multiplica = Math.random() < 0.5;
  const eMax = L === LEVELS.acs ? 1 : 3;
  // Al dividir, el resultado no puede pasar de L.kRes cifras decimales:
  // primero el número y después cuántos lugares caben.
  const x = randDec(L.entMax, randInt(1, Math.min(L.kMax, L.kRes - 1)));
  const e = multiplica ? randInt(1, eMax) : randInt(1, Math.min(eMax, L.kRes - x.k));
  const p = Math.pow(10, e);
  const r = shift(x, multiplica ? e : -e);
  const correct = fmtD(r);
  const op = multiplica ? "×" : ":";
  const cands = [fmtD(shift(x, multiplica ? -e : e)), fmtD(shift(x, multiplica ? e + 1 : -(e + 1))), e > 1 ? fmtD(shift(x, multiplica ? e - 1 : -(e - 1))) : null];
  if (multiplica && x.k > 0) cands.push(`${fmtD(x)}${"0".repeat(e)}`);
  return {
    instruction: "Calcula moviendo la coma:",
    display: `${fmtD(x)} ${op} ${p}`,
    options: uniqueOptions(correct, cands),
    correct,
    hint: `${p} tiene ${cuenta(e, "cero", "ceros")}: la coma se mueve ${cuenta(e, "lugar", "lugares")} hacia la ${multiplica ? "derecha" : "izquierda"}.`,
    explain: `Al ${multiplica ? "multiplicar" : "dividir"} por ${p}, la coma se mueve ${cuenta(e, "lugar", "lugares")} a la ${multiplica ? "derecha" : "izquierda"}: ${fmtD(x)} ${op} ${p} = ${correct}.${multiplica && x.k < e ? " Como no hay cifras decimales suficientes, se añaden ceros al final." : ""}${!multiplica && correct.startsWith("0,0") ? " Como faltan cifras, se añaden ceros después de la coma." : ""}${multiplica && x.k > 0 ? ` Escribir ceros al final (${fmtD(x)}${"0".repeat(e)}) no multiplica: el número vale lo mismo.` : ""}`,
  };
}

function genMultNat(L) {
  const x = randDec(L.entMax, randInt(1, L.kMax));
  const m = randInt(L.nat[0], L.nat[1]);
  const r = mul(x, D(m, 0));
  const correct = fmtD(r);
  const ent = Math.floor(val(x));
  const decStr = fmtD(x).split(",")[1];
  // Error típico: multiplicar por separado la parte entera y la decimal (2,5 × 3 = 6,15).
  let separado = decStr ? `${ent * m},${Number(decStr) * m}` : null;
  if (separado && Math.abs(answerValue(separado) - val(r)) < 1e-9) separado = null;
  const options = uniqueOptions(correct, [fmtD(D(x.n * m, x.k + 1)), fmtD(D(x.n * m, Math.max(0, x.k - 1))), separado, fmtD(D(x.n * m + 1, x.k))]);
  if (!options.includes(separado)) separado = null;
  return {
    instruction: "Calcula el resultado:",
    display: `${fmtD(x)} × ${m}`,
    options,
    correct,
    hint: `Multiplica ${x.n} × ${m} sin la coma y luego separa ${cuenta(x.k, "cifra decimal", "cifras decimales")}.`,
    explain: `${x.n} × ${m} = ${x.n * m}. El factor ${fmtD(x)} tiene ${cuenta(x.k, "cifra decimal", "cifras decimales")}, así que el producto también: ${fmtD({ n: x.n * m, k: x.k })}${fmtD({ n: x.n * m, k: x.k }) !== correct ? ` = ${correct}` : ""}. Estimando: ${redondeoEstimar(x)} × ${m} ≈ ${numEs(redondeoEstimar(x) * m)}.${separado ? ` No se multiplican por separado la parte entera y la decimal (${separado} está mal).` : ""}`,
  };
}

function genMultDec(L) {
  const k1 = randInt(1, Math.min(2, L.kMax));
  const k2 = L === LEVELS.altas ? randInt(1, 2) : 1;
  const a = randDec(Math.min(L.entMax, 12), k1);
  const b = randDec(Math.min(L.entMax, 9), k2);
  const prodN = a.n * b.n;
  const kt = a.k + b.k;
  const r = D(prodN, kt);
  const correct = fmtD(r);
  const sinNorm = fmtD({ n: prodN, k: kt });
  const ceros = String(prodN).length <= kt;
  return {
    instruction: "Calcula el resultado:",
    display: `${fmtD(a)} × ${fmtD(b)}`,
    options: uniqueOptions(correct, [fmtD(D(prodN, Math.max(a.k, b.k))), fmtD(D(prodN, kt - 1)), fmtD(D(prodN, kt + 1)), fmtD(D(prodN, Math.min(a.k, b.k)))]),
    correct,
    hint: `Multiplica ${a.n} × ${b.n} sin comas y separa ${a.k} + ${b.k} = ${cuenta(kt, "cifra decimal", "cifras decimales")}.`,
    explain: `${a.n} × ${b.n} = ${prodN}. Entre los dos factores hay ${a.k} + ${b.k} = ${cuenta(kt, "cifra decimal", "cifras decimales")}: ${sinNorm}${sinNorm !== correct ? ` = ${correct}` : ""}.${ceros ? " Como no había cifras suficientes, se añaden ceros delante." : ""} Estimando: ${numEs(redondeoEstimar(a))} × ${numEs(redondeoEstimar(b))} ≈ ${numEs(redondeoEstimar(a) * redondeoEstimar(b))}.`,
  };
}

// Divisiones exactas: se elige el cociente y se calcula el dividendo.
function genDivNat(L) {
  const d = randInt(L.nat[0], L.nat[1]);
  const q = randDec(L === LEVELS.altas ? 30 : 9, randInt(1, L.kMax));
  const a = mul(q, D(d, 0));
  const correct = fmtD(q);
  const menor = val(a) < d;
  return {
    instruction: "Calcula el resultado:",
    display: `${fmtD(a)} : ${d}`,
    options: uniqueOptions(correct, [fmtD(shift(q, 1)), fmtD(shift(q, -1)), fmtD(D(q.n + 1, q.k)), fmtD(D(q.n, 0))]),
    correct,
    hint: `Divide como siempre y pon la coma en el cociente al bajar la primera cifra decimal de ${fmtD(a)}.`,
    explain: `${fmtD(a)} : ${d} = ${correct}${menor ? ` (como ${Math.floor(val(a))} < ${d}, el cociente empieza por «0,»)` : ""}. Comprueba multiplicando: ${correct} × ${d} = ${fmtD(a)}.`,
  };
}

// ¿Dónde va la coma? Las opciones tienen las mismas cifras.
function genEstimar(L) {
  let a;
  let b;
  let r;
  do {
    a = randDec(Math.min(L.entMax, 9), 1, 1);
    b = randDec(Math.min(L.entMax, 9), 1, 1);
    r = mul(a, b);
  } while (r.k < 1 || String(r.n).length < 3);
  const correct = fmtD(r);
  const digits = String(r.n);
  const cands = [0, 1, 2, 3].map((k) => fmtD({ n: r.n, k: r.k + 1 - k })).concat([`0,${digits}`]);
  const est = redondeoEstimar(a) * redondeoEstimar(b);
  return {
    instruction: "Sin hacer la cuenta, estima dónde va la coma:",
    display: `${fmtD(a)} × ${fmtD(b)} = ?`,
    options: uniqueOptions(correct, cands),
    correct,
    hint: `Redondea: ${fmtD(a)} ≈ ${redondeoEstimar(a)} y ${fmtD(b)} ≈ ${redondeoEstimar(b)}. ¿Qué número se parece a ${redondeoEstimar(a)} × ${redondeoEstimar(b)}?`,
    explain: `${redondeoEstimar(a)} × ${redondeoEstimar(b)} = ${est}, así que el resultado tiene que estar cerca de ${est}: ${correct}. También puedes contar los decimales: 1 + 1 = 2 cifras decimales.`,
  };
}

// --- Problemas (5º) ---
function eur(c) {
  return fmtD({ n: c, k: 2 });
}

// Reto de la UDI del Tema 8: la compra saludable con 7 €.
function genProbCompra(L) {
  const productos = shuffle([
    ["kg de manzanas", [120, 190]],
    ["kg de plátanos", [140, 220]],
    ["litros de leche", [75, 115]],
    ["paquetes de pan integral", [95, 160]],
    ["kg de zanahorias", [80, 130]],
  ]).slice(0, 2);
  const items = productos.map(([nombre, [min, max]]) => ({ nombre, precio: randInt(min / 5, max / 5) * 5, cant: randInt(1, L === LEVELS.acs ? 2 : 3) }));
  const total = items.reduce((s, it) => s + it.precio * it.cant, 0);
  const correct = eur(total);
  const llega = total <= 700;
  return {
    instruction: "Lee el problema:",
    display: `Lista de la compra con 7 €: ${items.map((it) => `${it.cant} ${it.nombre} a ${eur(it.precio)} €`).join(" y ")}. ¿Cuánto cuesta todo?`,
    options: uniqueOptions(correct, [eur(items[0].precio + items[1].precio), eur(total + 100), eur(Math.max(5, total - 100)), eur(total * 10), eur(items[0].precio * items[0].cant + items[1].precio)]),
    correct,
    hint: "Multiplica el precio de cada producto por la cantidad y suma los dos resultados.",
    explain: `${items.map((it) => `${eur(it.precio)} × ${it.cant} = ${eur(it.precio * it.cant)}`).join("; ")}. Total: ${correct} €. ${llega ? `Con 7 € llega y sobran ${eur(700 - total)} €.` : `Con 7 € no llega: faltan ${eur(total - 700)} €.`}`,
  };
}

function genProbReparto(L) {
  const d = randInt(L.nat[0], L.nat[1]);
  const q = randDec(L === LEVELS.altas ? 15 : 4, 1, 1);
  const a = mul(q, D(d, 0));
  const unidad = pick([["litros de zumo", "jarras", "cada una"], ["kg de arroz", "bolsas", "cada una"], ["metros de cinta", "trozos", "cada uno"]]);
  const correct = fmtD(q);
  return {
    instruction: "Lee el problema:",
    display: `Se reparten ${fmtD(a)} ${unidad[0]} en ${d} ${unidad[1]} iguales. ¿Cuánto lleva ${unidad[2]}?`,
    options: uniqueOptions(correct, [fmtD(shift(q, 1)), fmtD(shift(q, -1)), fmtD(D(q.n + 1, q.k)), fmtD(mul(a, D(d, 0)))]),
    correct,
    hint: "Repartir en partes iguales es dividir.",
    explain: `${fmtD(a)} : ${d} = ${correct} ${unidad[0]} en ${unidad[2]}. Comprueba: ${correct} × ${d} = ${fmtD(a)}.`,
  };
}

function genProbPrecio(L) {
  const precio = randInt(L === LEVELS.acs ? 10 : 25, L === LEVELS.altas ? 120 : 60) * 5;
  const kg = randInt(L.nat[0], L.nat[1]);
  const total = precio * kg;
  const pideUnidad = L !== LEVELS.acs && Math.random() < 0.5;
  if (pideUnidad) {
    const correct = eur(precio);
    return {
      instruction: "Lee el problema:",
      display: `${kg} kg de naranjas cuestan ${eur(total)} €. ¿Cuánto cuesta 1 kg?`,
      options: uniqueOptions(correct, [eur(precio * 10), eur(Math.max(5, precio - 10)), eur(total), eur(precio + 5)]),
      correct,
      hint: "Para saber el precio de 1 kg, divide el total entre los kilos.",
      explain: `${eur(total)} : ${kg} = ${correct} € cada kilo. Comprueba: ${correct} × ${kg} = ${eur(total)}.`,
    };
  }
  const correct = eur(total);
  return {
    instruction: "Lee el problema:",
    display: `Un kilo de naranjas cuesta ${eur(precio)} €. ¿Cuánto cuestan ${kg} kg?`,
    options: uniqueOptions(correct, [eur(total * 10), eur(Math.round(total / 10)), eur(precio + kg * 100), eur(total + 100)]),
    correct,
    hint: "Multiplica el precio de un kilo por los kilos.",
    explain: `${eur(precio)} × ${kg} = ${correct} €.`,
  };
}

// ------------------------------------------------------------
// 6º: dividir entre un decimal y sacar decimales en el cociente
// ------------------------------------------------------------
function genDivDec(L) {
  const kb = randInt(1, L.kDivisor);
  let b;
  do {
    b = randDec(L === LEVELS.altas ? 9 : 4, kb);
  } while (val(b) === 0);
  const q = Math.random() < 0.6 ? D(randInt(2, 15), 0) : randDec(9, 1, 1);
  const a = mul(q, b);
  const correct = fmtD(q);
  const a2 = shift(a, kb);
  const b2 = shift(b, kb);
  return {
    instruction: "Calcula (el divisor tiene coma):",
    display: `${fmtD(a)} : ${fmtD(b)}`,
    options: uniqueOptions(correct, [fmtD(shift(q, 1)), fmtD(shift(q, -1)), fmtD(D(q.n + 1, q.k)), fmtD(shift(q, 2))]),
    correct,
    hint: `Mueve la coma ${cuenta(kb, "lugar", "lugares")} a la derecha en el dividendo y en el divisor, hasta que el divisor no tenga coma.`,
    explain: `Se mueve la coma ${cuenta(kb, "lugar", "lugares")} en los dos: ${fmtD(a)} : ${fmtD(b)} = ${fmtD(a2)} : ${fmtD(b2)} = ${correct}. Comprueba: ${correct} × ${fmtD(b)} = ${fmtD(a)}.`,
  };
}

function genCocienteDecimal(L) {
  let a;
  let d;
  let q;
  do {
    d = pick([2, 4, 5, 8, 20, 25]);
    a = randInt(1, 40);
    q = (a * 1000) / d;
  } while (a % d === 0 || !Number.isInteger(q));
  const r = D(q, 3);
  const correct = fmtD(r);
  return {
    instruction: "Divide sacando decimales en el cociente:",
    display: `${a} : ${d}`,
    options: uniqueOptions(correct, [String(Math.floor(a / d)), `${Math.floor(a / d)},${a % d}`, fmtD(shift(r, 1)), fmtD(shift(r, -1))]),
    correct,
    hint: "Cuando sobre algo, pon la coma en el cociente, añade un 0 al resto y sigue dividiendo.",
    explain: `${a} : ${d} = ${Math.floor(a / d)} y sobra${a % d === 1 ? "" : "n"} ${a % d}. Se pone la coma y se sigue con ceros: ${a} : ${d} = ${correct}. El resto no se escribe detrás de la coma: ${Math.floor(a / d)},${a % d} está mal.`,
  };
}

const MODE_GROUPS = {
  potencias: [genPotencias10],
  multiplicar: [genMultNat, genMultNat, genMultDec],
  dividir: [genDivNat],
  estimar: [genEstimar],
  problemas: [genProbCompra, genProbReparto, genProbPrecio],
  dividirdecimal: [genDivDec, genDivDec, genCocienteDecimal],
};

const ACS_GENERATORS = [genMultNat, genMultNat, genPotencias10, genProbPrecio];

const DECIMALESMD_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Decimales con una cifra por números pequeños, y × 10 y : 10",
    text: "Para el alumnado con adaptación curricular significativa se trabaja multiplicar un decimal sencillo (una cifra decimal) por 2 o 3, multiplicar y dividir por 10, y el precio de unos kilos de fruta.",
    example: "1,5 × 2 → 15 × 2 = 30 → 3,0 = 3 · 4,7 × 10 = 47",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de operaciones, pero con una tipografía más legible para leer las cifras decimales.",
    example: "2,5 × 3 = 7,5 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Multiplicar» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Los mismos contenidos de 5º, con una cifra decimal y la pista a la vista",
    text: "Se trabajan todos los modos de 5º con números de una cifra decimal, multiplicadores y divisores hasta 5 y la pista abierta desde el principio. Sin «Mezcla» ni dividir entre decimales (6º). En Explora se puede ver cada cuenta paso a paso.",
    example: "2,5 × 3 → Pista: multiplica 25 × 3 sin la coma y luego separa 1 cifra decimal",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Dividir entre decimales y números más grandes",
    text: "Empieza en <strong>dividir entre un número decimal</strong> y sacar decimales en el cociente, y en el resto de modos usa números más grandes y milésimas.",
    example: "6,25 : 0,5 = 62,5 : 5 = 12,5 · 7 : 4 = 1,75",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "2,5 × 3 = ? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, DECIMALESMD_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), DECIMALESMD_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("dm-pot")) initExplore();
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
const ENTRADA_INVALIDA = "Escribe un número con coma, por ejemplo 3,45.";

// Tabla de valor posicional (UM C D U , d c m dm) de uno o más números.
function tablaPosicional(filas) {
  const cols = [["UM", 3], ["C", 2], ["D", 1], ["U", 0], ["d", -1], ["c", -2], ["m", -3], ["dmil", -4]];
  const digitoEn = (x, pos) => {
    const s = fmtD(x).split(",");
    const ent = s[0];
    const dec = s[1] || "";
    if (pos >= 0) {
      const i = ent.length - 1 - pos;
      return i >= 0 ? ent[i] : "";
    }
    return dec[-pos - 1] || "";
  };
  const head = cols.map(([l, p]) => `${p === -1 ? '<th class="de-comma"></th>' : ""}<th>${l}</th>`).join("");
  const body = filas
    .map(({ x, label, cls }) => `<tr class="${cls || ""}"><th>${label}</th>${cols.map(([, p]) => `${p === -1 ? '<td class="de-comma">,</td>' : ""}<td>${digitoEn(x, p)}</td>`).join("")}</tr>`)
    .join("");
  return `<table class="de-table"><tr><th></th>${head}</tr>${body}</table>`;
}

function initExplore() {
  // --- 1. La coma salta ---
  const potIn = document.getElementById("dm-pot-n");
  let potOp = "×";
  let potP = 100;

  function renderPot() {
    const x = parseD(potIn.value);
    const msg = document.getElementById("dm-pot-msg");
    const table = document.getElementById("dm-pot-table");
    if (!x) {
      table.innerHTML = "";
      msg.className = "md-msg ko";
      msg.textContent = ENTRADA_INVALIDA;
      return;
    }
    const e = String(potP).length - 1;
    const r = shift(x, potOp === "×" ? e : -e);
    // La tabla llega de las unidades de millar a las diezmilésimas; si
    // el número no cabe, se explica igual pero sin tabla.
    const cabe = (v) => val(v) < 10000 && v.k <= 4;
    table.innerHTML = cabe(x) && cabe(r)
      ? tablaPosicional([
          { x, label: fmtD(x), cls: "fr-a" },
          { x: r, label: fmtD(r), cls: "fr-b" },
        ])
      : '<p class="md-note">(Este número tiene demasiadas cifras para la tabla, pero la regla es la misma.)</p>';
    msg.className = "md-msg ok";
    msg.innerHTML = `<strong>${fmtD(x)} ${potOp} ${potP} = ${fmtD(r)}</strong>. Cada cifra se mueve ${cuenta(e, "lugar", "lugares")} hacia la ${potOp === "×" ? "izquierda y vale" : "derecha y vale"} ${potP} veces ${potOp === "×" ? "más" : "menos"}. Es lo mismo que mover la coma ${cuenta(e, "lugar", "lugares")} a la ${potOp === "×" ? "derecha" : "izquierda"}.`;
  }
  potIn.addEventListener("input", renderPot);
  document.querySelectorAll("#dm-pot-ops [data-dm-op]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#dm-pot-ops [data-dm-op]").forEach((b) => b.classList.toggle("active", b === btn));
      potOp = btn.dataset.dmOp;
      potP = Number(btn.dataset.dmP);
      renderPot();
    });
  });

  // --- 2. Multiplicar paso a paso ---
  const mulA = document.getElementById("dm-mul-a");
  const mulB = document.getElementById("dm-mul-b");

  function renderMul() {
    const a = parseD(mulA.value);
    const b = parseD(mulB.value);
    const out = document.getElementById("dm-mul-steps");
    if (!a || !b) {
      out.innerHTML = `<li>${ENTRADA_INVALIDA}</li>`;
      return;
    }
    const prod = a.n * b.n;
    const kt = a.k + b.k;
    const r = D(prod, kt);
    const largo = fmtD({ n: prod, k: kt });
    const ceros = kt > 0 && String(prod).length <= kt;
    out.innerHTML = [
      `Quita las comas: ${fmtD(a)} → <strong>${a.n}</strong> y ${fmtD(b)} → <strong>${b.n}</strong>.`,
      `Multiplica como números naturales: ${a.n} × ${b.n} = <strong>${prod}</strong>.`,
      `Cuenta las cifras decimales: ${fmtD(a)} tiene ${a.k} y ${fmtD(b)} tiene ${b.k}. En total, <strong>${kt}</strong>.`,
      kt === 0 ? `No hay cifras decimales: el resultado es <strong>${prod}</strong>.` : `Separa ${cuenta(kt, "cifra", "cifras")} desde la derecha${ceros ? " (añadiendo ceros delante, porque no hay cifras suficientes)" : ""}: <strong>${largo}</strong>${largo !== fmtD(r) ? ` = ${fmtD(r)}` : ""}.`,
      `Comprueba estimando: ${numEs(redondeoEstimar(a))} × ${numEs(redondeoEstimar(b))} ≈ ${numEs(redondeoEstimar(a) * redondeoEstimar(b))}. ${Math.abs(val(r) - redondeoEstimar(a) * redondeoEstimar(b)) <= Math.max(1, val(r) * 0.6) ? "El resultado está cerca: la coma está bien puesta." : "Con números menores que 1 la estimación es más aproximada, pero el orden de magnitud debe coincidir."}`,
    ]
      .map((li) => `<li>${li}</li>`)
      .join("");
  }
  mulA.addEventListener("input", renderMul);
  mulB.addEventListener("input", renderMul);

  // --- 3. Dividir paso a paso ---
  const divA = document.getElementById("dm-div-a");
  const divB = document.getElementById("dm-div-b");

  function renderDiv() {
    const out = document.getElementById("dm-div-steps");
    let a = parseD(divA.value);
    let b = parseD(divB.value);
    if (!a || !b || b.n === 0) {
      out.innerHTML = `<li>${!b || b.n !== 0 ? ENTRADA_INVALIDA : "No se puede dividir entre 0."}</li>`;
      return;
    }
    const pasos = [];
    if (b.k > 0) {
      const a2 = shift(a, b.k);
      const b2 = shift(b, b.k);
      pasos.push(`El divisor ${fmtD(b)} tiene coma (6º): mueve la coma ${cuenta(b.k, "lugar", "lugares")} a la derecha en los dos. ${fmtD(a)} : ${fmtD(b)} = <strong>${fmtD(a2)} : ${fmtD(b2)}</strong>.`);
      a = a2;
      b = b2;
    }
    const d = b.n;
    if (d > 999) {
      out.innerHTML = `<li>Prueba con un divisor más pequeño (hasta 999).</li>`;
      return;
    }
    // División larga cifra a cifra, con hasta 3 decimales añadidos.
    const [entStr, decStr = ""] = fmtD(a).split(",");
    const cifras = (entStr + decStr).split("").map(Number);
    const comaTras = entStr.length;
    let resto = 0;
    let cociente = "";
    let comaPuesta = false;
    let i = 0;
    let extra = 0;
    while (i < cifras.length || (resto !== 0 && extra < 3)) {
      if (i === comaTras && !comaPuesta) {
        if (cociente === "") cociente = "0";
        cociente += ",";
        comaPuesta = true;
        pasos.push(i < cifras.length ? `Al bajar la primera cifra decimal, pon la coma en el cociente: <strong>${cociente}</strong>` : `Sobra ${resto}: pon la coma en el cociente y sigue añadiendo ceros.`);
      }
      const cifra = i < cifras.length ? cifras[i] : 0;
      if (i >= cifras.length) extra++;
      const parcial = resto * 10 + cifra;
      const c = Math.floor(parcial / d);
      resto = parcial - c * d;
      if (!(cociente === "" && c === 0 && i < comaTras - 1)) cociente += String(c);
      pasos.push(`${i >= cifras.length ? "Añade un 0: " : ""}${parcial} : ${d} = ${c}${resto ? `, sobra ${resto}` : ""}.`);
      i++;
    }
    pasos.push(`Resultado: <strong>${cociente.replace(/^,/, "0,")}</strong>${resto ? " (aproximado: la división sigue)" : ""}.`);
    out.innerHTML = pasos.map((li) => `<li>${li}</li>`).join("");
  }
  divA.addEventListener("input", renderDiv);
  divB.addEventListener("input", renderDiv);

  renderPot();
  renderMul();
  renderDiv();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-decimalesmd"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
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
  let mode = "potencias";
  let current;
  let lastDisplay = "";

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
      b.disabled = acs || (disc && (m === "dividirdecimal" || m === "mezcla")) || (m === "mezcla" && diff.is("tdah"));
    });

    if (diff.is("altas")) setActiveMode("dividirdecimal");
    else if (acs) setActiveMode("multiplicar");
    else if (disc && (mode === "dividirdecimal" || mode === "mezcla")) setActiveMode("potencias");
    else if (diff.is("tdah") && mode === "mezcla") setActiveMode("potencias");

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
    } while (q.display === lastDisplay && tries < 10);
    lastDisplay = q.display;
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

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";
    els.hintBox.classList.remove("show");
    els.hintBox.innerHTML = "";
    els.hintBtn.disabled = false;
    if (diff.is("discalculia")) showHint();

    els.answerButtons.innerHTML = "";
    shuffle(current.options).forEach((opt) => {
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
    AppProgress.record("decimales-md", isCorrect);
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
