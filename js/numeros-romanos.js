// ============================================================
// Números romanos (6º, SdA 1)
// - Explora: teclado romano que comprueba las reglas, del número al
//   romano lugar a lugar y los siglos. No guarda progreso.
// - Práctica: los números se generan al azar y cada pregunta trae su
//   pista y la explicación que se ve al corregir. Solo la práctica
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

// Punto de miles, como en el resto de la app (los años se escriben sin punto).
const miles = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

function uniqueOptions(correct, candidates, count = 4) {
  const out = [correct];
  for (const c of candidates) {
    if (out.length >= count) break;
    if (c !== undefined && c !== null && c !== "" && !out.includes(c)) out.push(c);
  }
  return out;
}

// ------------------------------------------------------------
// Conversión y reglas
// ------------------------------------------------------------
const RO_VAL = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
// Por lugares: unidades, decenas, centenas y millares.
const RO_LUGAR = [
  ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
  ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],
  ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"],
  ["", "M", "MM", "MMM"],
];
const RO_LUGAR_NOMBRE = ["unidades", "decenas", "centenas", "millares"];

function aRomano(n) {
  const d = String(n).split("").reverse().map(Number);
  return d.map((x, i) => RO_LUGAR[i][x]).reverse().join("");
}

// Valor leyendo de izquierda a derecha: si una letra es menor que la
// siguiente, resta; si no, suma. (No comprueba si está bien escrito.)
function deRomano(s) {
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const v = RO_VAL[s[i]];
    const sig = RO_VAL[s[i + 1]] || 0;
    total += v < sig ? -v : v;
  }
  return total;
}

const esValido = (s) => /^[IVXLCDM]+$/.test(s) && deRomano(s) > 0 && deRomano(s) < 4000 && aRomano(deRomano(s)) === s;

// Qué regla rompe una escritura incorrecta (para explicarlo).
function reglaRota(s) {
  if (/(IIII|XXXX|CCCC|MMMM)/.test(s)) return "una letra se repite más de tres veces seguidas";
  if (/(VV|LL|DD)/.test(s) || /V.*V|L.*L|D.*D/.test(s)) return "V, L y D no se repiten";
  if (/(IL|IC|ID|IM|XD|XM|VX|VL|VC|VD|VM|LC|LD|LM|DM)/.test(s)) return "solo I, X y C pueden restar, y solo delante de las dos letras siguientes (IV, IX · XL, XC · CD, CM)";
  if (/(IIV|IIX|XXL|XXC|CCD|CCM)/.test(s)) return "solo se puede restar una letra";
  return "no sigue el orden de mayor a menor (salvo las restas permitidas)";
}

// Desglose de la lectura: M + CM + XC + IV = 1000 + 900 + 90 + 4.
function desglose(n) {
  const d = String(n).split("").reverse().map(Number);
  const partes = d.map((x, i) => [RO_LUGAR[i][x], x * 10 ** i]).filter(([s]) => s).reverse();
  return { romano: partes.map(([s]) => s).join(" + "), valor: partes.map(([, v]) => miles(v)).join(" + ") };
}

// Errores típicos al escribir n.
function aditivo(n) {
  const AD = [
    ["", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "VIIII"],
    ["", "X", "XX", "XXX", "XXXX", "L", "LX", "LXX", "LXXX", "LXXXX"],
    ["", "C", "CC", "CCC", "CCCC", "D", "DC", "DCC", "DCCC", "DCCCC"],
    ["", "M", "MM", "MMM"],
  ];
  const d = String(n).split("").reverse().map(Number);
  return d.map((x, i) => AD[i][x]).reverse().join("");
}

// Resta «por atajo»: 99 → IC, 45 → VL, 8 → IIX.
function restaMala(n) {
  const out = [];
  const pares = [[99, "IC"], [49, "IL"], [999, "IM"], [990, "XM"], [490, "XD"], [45, "VL"], [95, "VC"], [450, "LD"], [950, "LM"], [499, "ID"]];
  for (const [v, s] of pares) {
    if (n % (v >= 100 ? 1000 : 100) === v) {
      const base = n - v;
      out.push(aRomano(base) + s);
    }
  }
  const d = String(n).split("").reverse().map(Number);
  d.forEach((x, i) => {
    if (i < 3 && (x === 8 || x === 7)) {
      const L = ["I", "X", "C"][i];
      const sup = ["X", "C", "M"][i];
      const trozo = (x === 8 ? L + L : L + L + L) + sup;
      const e = d.slice();
      const partes = e.map((y, j) => (j === i ? trozo : RO_LUGAR[j][y])).reverse().join("");
      out.push(partes);
    }
  });
  return out;
}

// Una pareja que resta escrita al revés: IV → VI.
function parejaAlReves(n) {
  const s = aRomano(n);
  const m = s.match(/IV|IX|XL|XC|CD|CM/);
  if (!m) return null;
  return s.replace(m[0], m[0][1] + m[0][0]);
}

// Sumar todas las letras sin restar (error al leer).
const sumaTodo = (s) => s.split("").reduce((a, c) => a + RO_VAL[c], 0);

// ------------------------------------------------------------
// Niveles
// ------------------------------------------------------------
const LEVELS = {
  normal: { max: 3999 },
  facil: { max: 100 },
  acs: { max: 20 },
  altas: { max: 3999 },
};

// Número al azar con muchos 4 y 9 (los casos difíciles).
function numAzar(L) {
  if (L.max <= 20) return randInt(1, 20);
  if (L.max <= 100) {
    const t = randInt(0, 9);
    const u = Math.random() < 0.4 ? pick([4, 9]) : randInt(0, 9);
    const n = t * 10 + u;
    return n === 0 ? 100 : n;
  }
  const cifra = () => (Math.random() < 0.35 ? pick([4, 9]) : randInt(0, 9));
  const m = L === LEVELS.altas ? randInt(1, 3) : pick([0, 1, 1, 2, 2, 3]);
  const n = m * 1000 + cifra() * 100 + cifra() * 10 + cifra();
  return n === 0 ? 4 : n;
}

// ------------------------------------------------------------
// Generadores
// ------------------------------------------------------------
function genARomano(L) {
  const n = numAzar(L);
  const correct = aRomano(n);
  const cands = [aditivo(n), ...restaMala(n), parejaAlReves(n), aRomano(n + 1), n > 1 ? aRomano(n - 1) : null, n + 10 < 4000 ? aRomano(n + 10) : null, n > 10 ? aRomano(n - 10) : null];
  const des = desglose(n);
  return {
    instruction: "Escribe en números romanos:",
    display: miles(n),
    options: uniqueOptions(correct, cands),
    correct,
    hint: "Escribe por separado los millares, las centenas, las decenas y las unidades, y júntalos. El 4 y el 9 se escriben restando: IV, IX, XL, XC, CD, CM.",
    explain: `${des.romano.includes("+") ? `${miles(n)} = ${des.valor} → ${des.romano} = ${correct}` : `${miles(n)} → ${correct}`}.${aditivo(n) !== correct ? ` ${aditivo(n)} está mal: ${reglaRota(aditivo(n))}.` : ""}`,
  };
}

function genADecimal(L) {
  const n = numAzar(L);
  const s = aRomano(n);
  const correct = miles(n);
  const des = desglose(n);
  const cands = [sumaTodo(s), n + 10, n - 1 > 0 ? n - 1 : n + 2, n + 1, n - 10 > 0 ? n - 10 : n + 20, n + 100].map(miles);
  return {
    instruction: "¿Qué número es?",
    display: s,
    options: uniqueOptions(correct, cands),
    correct,
    hint: "Lee de izquierda a derecha. Si una letra es menor que la que tiene a su derecha, se resta (IV = 4); si no, se suma.",
    explain: `${des.romano.includes("+") ? `${des.romano} = ${des.valor} = ${miles(n)}` : `${s} = ${miles(n)}`}.${sumaTodo(s) !== n ? ` Sumando todas las letras sin restar saldría ${miles(sumaTodo(s))}, que está mal.` : ""}`,
  };
}

// Todas valen lo mismo, pero solo una está bien escrita.
function genValido(L) {
  for (let intento = 0; intento < 200; intento++) {
    const n = numAzar(L);
    const correct = aRomano(n);
    const malas = new Set([aditivo(n), ...restaMala(n)]);
    // Repetir V, L o D: 10 = VV, 100 = LL, 1000 = DD.
    [["X", "VV"], ["C", "LL"], ["M", "DD"]].forEach(([a, b]) => {
      if (correct.includes(a) && !correct.includes(a + "L") && !correct.includes(a + "C") && !correct.includes(a + "D") && !correct.includes(a + "M")) malas.add(correct.replace(a, b));
    });
    const lista = [...malas].filter((x) => x !== correct && !esValido(x) && deRomano(x) === n);
    if (lista.length < 2) continue;
    const elegidas = shuffle(lista).slice(0, 3);
    return {
      instruction: `Todas valen ${miles(n)}, pero solo una está bien escrita. ¿Cuál?`,
      display: miles(n),
      options: uniqueOptions(correct, elegidas),
      correct,
      hint: "Ninguna letra se repite más de 3 veces; V, L y D no se repiten; solo restan I, X y C, y solo delante de las dos letras siguientes.",
      explain: `${correct} es la correcta. ${elegidas.map((x) => `${x}: ${reglaRota(x)}`).join(". ")}.`,
    };
  }
  return genARomano(L);
}

// --- En la vida diaria ---
const HECHOS = [
  { a: 711, t: "Los musulmanes llegaron a la península ibérica en el año 711." },
  { a: 929, t: "Abderramán III proclamó el Califato de Córdoba en el año 929." },
  { a: 1248, t: "Fernando III conquistó Sevilla en el año 1248." },
  { a: 1492, t: "Colón llegó a América en el año 1492." },
  { a: 1605, t: "Se publicó la primera parte del Quijote en el año 1605." },
  { a: 1812, t: "Se aprobó la Constitución de Cádiz en el año 1812." },
  { a: 1929, t: "Se celebró la Exposición Iberoamericana de Sevilla en el año 1929." },
  { a: 1978, t: "Se aprobó la Constitución española en el año 1978." },
  { a: 1992, t: "Se celebró la Exposición Universal de Sevilla en el año 1992." },
  { a: 2000, t: "Muchas personas celebraron el cambio de milenio en el año 2000." },
];
const siglo = (a) => Math.floor((a - 1) / 100) + 1;

const REYES = [
  ["Felipe VI", "sexto"],
  ["Carlos III", "tercero"],
  ["Isabel I", "primera"],
  ["Isabel II", "segunda"],
  ["Fernando VII", "séptimo"],
  ["Alfonso X", "décimo"],
  ["Felipe II", "segundo"],
  ["Felipe V", "quinto"],
  ["Juan Carlos I", "primero"],
];
const ORDINAL = ["", "primero", "segundo", "tercero", "cuarto", "quinto", "sexto", "séptimo", "octavo", "noveno", "décimo"];
const ORDINAL_F = ["", "primera", "segunda", "tercera", "cuarta", "quinta", "sexta", "séptima", "octava", "novena", "décima"];

function genVida(L) {
  const tipo = L === LEVELS.acs || L === LEVELS.facil ? pick([2, 3]) : randInt(1, 3);
  if (tipo === 1) {
    const h = pick(HECHOS);
    const s = siglo(h.a);
    const correct = aRomano(s);
    const primeras = Math.floor(h.a / 100);
    return {
      instruction: "¿En qué siglo fue?",
      display: h.t,
      options: uniqueOptions(correct, [aRomano(primeras === s ? s - 1 : primeras), aRomano(s + 1), aRomano(s - 1), aRomano(s + 2)]),
      correct,
      hint: "El siglo I va del año 1 al 100; el II, del 101 al 200… Truco: quita las dos últimas cifras y suma 1, salvo si el año acaba en 00.",
      explain: `${h.a} está entre ${(s - 1) * 100 + 1} y ${s * 100}: siglo ${correct} (${s}).${h.a % 100 === 0 ? ` Ojo: el año ${h.a} es el último del siglo ${correct}, no el primero del siguiente.` : ` No es el ${aRomano(primeras)}: hay que sumar 1 a las dos primeras cifras.`}`,
    };
  }
  if (tipo === 2) {
    const [rey, ord] = pick(REYES);
    const r = rey.split(" ").pop();
    const n = deRomano(r);
    const fem = rey.startsWith("Isabel");
    const O = fem ? ORDINAL_F : ORDINAL;
    const nombre = rey.slice(0, -r.length - 1);
    const correct = `${nombre} ${ord}`;
    const alReves = r.length === 2 && RO_VAL[r[0]] !== RO_VAL[r[1]] ? deRomano(r[1] + r[0]) : null;
    return {
      instruction: "¿Cómo se lee el nombre de este rey o reina?",
      display: rey,
      options: uniqueOptions(correct, [alReves && alReves <= 10 ? alReves : null, n + 1, n - 1, n + 2, n - 2, n + 3].filter((k) => k >= 1 && k <= 10).map((k) => `${nombre} ${O[k]}`)),
      correct,
      hint: "Los nombres de reyes, reinas y papas se leen con ordinales hasta el décimo: I = primero, II = segundo…",
      explain: `${r} = ${n}, así que se lee «${correct}».`,
    };
  }
  // Capítulos, tomos o la hora del reloj.
  const n = L === LEVELS.acs ? randInt(1, 12) : randInt(4, L === LEVELS.facil ? 40 : 60);
  const ctx = n <= 12 ? pick([`Las agujas del reloj de la plaza señalan el ${aRomano(n)}.`, `En la estantería está el tomo ${aRomano(n)} de una enciclopedia.`]) : `Estás leyendo el capítulo ${aRomano(n)} de un libro.`;
  const s = aRomano(n);
  return {
    instruction: "¿Qué número es?",
    display: ctx,
    options: uniqueOptions(String(n), [String(sumaTodo(s)), String(n + 1), String(n > 1 ? n - 1 : n + 2), String(n + 10), String(n > 10 ? n - 10 : n + 5)]),
    correct: String(n),
    hint: "Si una letra es menor que la de su derecha, se resta.",
    explain: desglose(n).romano.includes("+") ? `${desglose(n).romano} = ${desglose(n).valor} = ${n}.` : `${s} = ${n}.`,
  };
}

function genOperar(L) {
  const max = L === LEVELS.altas ? 1500 : L === LEVELS.facil ? 50 : L === LEVELS.acs ? 10 : 400;
  const a = randInt(2, max);
  const b = randInt(1, max);
  const resta = Math.random() < 0.4 && a !== b;
  const [x, y] = resta ? [Math.max(a, b), Math.min(a, b)] : [a, b];
  const r = resta ? x - y : x + y;
  const correct = aRomano(r);
  // Error típico: juntar las letras sin calcular.
  const juntas = aRomano(x) + aRomano(y);
  return {
    instruction: `Calcula y escribe el resultado en romanos:`,
    display: `${aRomano(x)} ${resta ? "−" : "+"} ${aRomano(y)}`,
    options: uniqueOptions(correct, [resta ? null : juntas, aditivo(r), aRomano(r + 1), aRomano(r > 1 ? r - 1 : r + 2), aRomano(r + 10), r > 10 ? aRomano(r - 10) : null]),
    correct,
    hint: "Pasa los dos números a nuestro sistema, opera y vuelve a escribir el resultado en romanos.",
    explain: `${aRomano(x)} = ${miles(x)} y ${aRomano(y)} = ${miles(y)}. ${miles(x)} ${resta ? "−" : "+"} ${miles(y)} = ${miles(r)} → ${correct}.`,
  };
}

const MODE_GROUPS = {
  aromano: [genARomano],
  adecimal: [genADecimal],
  valido: [genValido],
  vida: [genVida],
  operar: [genOperar],
};

const ACS_GENERATORS = [genARomano, genADecimal, genVida, genADecimal];

const ROMANOS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Números del 1 al 20 con I, V y X (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja con las letras I, V y X y números del 1 al 20: escribirlos, leerlos, el reloj y los reyes.",
    example: "8 → VIII · XIV → 14",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantienen los mismos números romanos, pero con una tipografía más legible para distinguir mejor las letras.",
    example: "XIV → 14 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «De número a romano» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todos los contenidos hasta el 100 y la pista a la vista",
    text: "Se trabajan todos los modos con números hasta el 100 (letras I, V, X, L y C) y la pista abierta desde el principio. Sin «Mezcla». En Explora se puede escribir con el teclado romano y ver el valor de cada letra.",
    example: "XLIV → Pista: si una letra es menor que la de su derecha, se resta",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Números hasta el 3999 y operaciones",
    text: "Empieza en <strong>¿Cuál está bien escrito?</strong>, con números de cuatro cifras, y en Operar suma y resta números hasta el 1500.",
    example: "MCMXCIV = 1994",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "XIV → 14 → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, ROMANOS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), ROMANOS_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("ro-teclado")) initExplore();
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
  // 1. Teclado romano: se escribe con letras y se ve el valor y si está bien.
  let escrito = "MCMXCIV";
  function renderTeclado() {
    document.getElementById("ro-tec-escrito").textContent = escrito || "—";
    const msg = document.getElementById("ro-tec-msg");
    if (!escrito) {
      msg.className = "md-msg ok";
      msg.innerHTML = "Pulsa las letras para escribir un número romano.";
      return;
    }
    const v = deRomano(escrito);
    const pasos = escrito.split("").map((c, i) => {
      const resta = RO_VAL[c] < (RO_VAL[escrito[i + 1]] || 0);
      return `<span class="${resta ? "ro-resta" : "ro-suma"}">${resta ? "−" : "+"}${RO_VAL[c]}</span>`;
    });
    if (esValido(escrito)) {
      msg.className = "md-msg ok";
      msg.innerHTML = `<p>${pasos.join(" ")} = <strong>${miles(v)}</strong></p><p>Está bien escrito: ${escrito} = ${miles(v)}.</p>`;
    } else {
      msg.className = "md-msg ko";
      const bien = v > 0 && v < 4000 ? ` ${miles(v)} se escribe <strong>${aRomano(v)}</strong>.` : "";
      msg.innerHTML = `<p>${pasos.join(" ")} = ${miles(v)}</p><p>No está bien escrito: ${reglaRota(escrito)}.${bien}</p>`;
    }
  }
  document.querySelectorAll("#ro-teclado [data-ro]").forEach((b) =>
    b.addEventListener("click", () => {
      const k = b.dataset.ro;
      if (k === "borrar") escrito = escrito.slice(0, -1);
      else if (k === "limpiar") escrito = "";
      else if (escrito.length < 15) escrito += k;
      renderTeclado();
    })
  );

  // 2. Del número al romano, lugar a lugar.
  const N = [1, 9, 9, 4];
  function renderLugares() {
    ["m", "c", "d", "u"].forEach((k, i) => (document.getElementById(`ro-lug-${k}`).textContent = N[i]));
    const n = N[0] * 1000 + N[1] * 100 + N[2] * 10 + N[3];
    const filas = N.map((x, i) => {
      const lugar = 3 - i;
      const s = RO_LUGAR[lugar][x];
      return `<tr><td>${RO_LUGAR_NOMBRE[lugar]}</td><td>${miles(x * 10 ** lugar)}</td><td><strong>${s || "—"}</strong></td></tr>`;
    }).join("");
    document.getElementById("ro-lug-tabla").innerHTML = `<table class="rules-table"><tr><th>Lugar</th><th>Valor</th><th>Romano</th></tr>${filas}</table>`;
    document.getElementById("ro-lug-msg").innerHTML = n === 0
      ? "Los romanos no tenían cero: elige un número mayor que 0."
      : `<strong>${miles(n)} = ${aRomano(n)}</strong>. Se escribe cada lugar por separado y se juntan, de los millares a las unidades.`;
  }
  document.querySelectorAll("[data-ro-lug]").forEach((b) =>
    b.addEventListener("click", () => {
      const i = Number(b.dataset.roLug);
      const max = i === 0 ? 3 : 9;
      N[i] = (N[i] + Number(b.dataset.delta) + max + 1) % (max + 1);
      renderLugares();
    })
  );

  // 3. Siglos.
  let anio = 1492;
  function renderSiglo() {
    document.getElementById("ro-sig-anio").textContent = anio;
    const s = siglo(anio);
    document.getElementById("ro-sig-msg").innerHTML = `El año ${anio} es del <strong>siglo ${aRomano(s)}</strong> (${s}), que va del ${(s - 1) * 100 + 1} al ${s * 100}.${anio % 100 === 0 ? " Es el último año de ese siglo." : ""}`;
  }
  document.querySelectorAll("[data-ro-sig]").forEach((b) =>
    b.addEventListener("click", () => {
      anio = Math.max(1, Math.min(3000, anio + Number(b.dataset.roSig)));
      renderSiglo();
    })
  );

  renderTeclado();
  renderLugares();
  renderSiglo();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-romanos"),
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
  let mode = "aromano";
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

    if (diff.is("altas")) setActiveMode("valido");
    else if (acs) setActiveMode("aromano");
    else if ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla") setActiveMode("aromano");

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
    } while (q.display === lastKey && tries < 10);
    lastKey = q.display;
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
    AppProgress.record("numeros-romanos", isCorrect);
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
