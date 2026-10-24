// ============================================================
// Las potencias (6º, SdA 2 «¡A toda máquina!»)
// - Explora: cuadrados y cubos con cubitos, la potencia por dentro,
//   potencias de 10 y descomposición de un número. No guarda
//   progreso: es para entender, no para puntuar.
// - Práctica: las preguntas se generan al azar y cada una trae su
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

// Exponente en superíndice: 10 → ¹⁰.
const sup = (e) => String(e).split("").map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join("");
const pot = (b, e) => `${b}${sup(e)}`;
// Punto de miles, como en el resto de la app: 1.000, 100.000.
const miles = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const factores = (b, e) => Array(e).fill(b).join(" × ");

function uniqueOptions(correct, candidates, count = 4) {
  const out = [correct];
  for (const c of candidates) {
    if (out.length >= count) break;
    if (c !== undefined && c !== null && c !== "" && !out.includes(c)) out.push(c);
  }
  return out;
}

const NUM_TXT = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince"];
const leerPot = (b, e) => `${NUM_TXT[b]} ${e === 2 ? "al cuadrado" : e === 3 ? "al cubo" : `elevado a ${NUM_TXT[e]}`}`;

// Nombre de las potencias de 10 (10¹ … 10⁹).
const NOMBRE_10 = ["uno", "diez", "cien", "mil", "diez mil", "cien mil", "un millón", "diez millones", "cien millones", "mil millones"];

// Explicación de una potencia: 2⁵ = 2 × 2 × 2 × 2 × 2 = 32.
function explicaPot(b, e) {
  const v = b ** e;
  if (e === 0) return `Cualquier número (distinto de 0) elevado a 0 vale 1: ${pot(b, 0)} = 1.`;
  if (e === 1) return `Elevado a 1, el número no cambia: ${pot(b, 1)} = ${b}.`;
  if (b === 10) return `${pot(10, e)} = ${factores(10, e)} = ${miles(v)}: un 1 seguido de ${e} ceros.`;
  return `${pot(b, e)} = ${factores(b, e)} = ${miles(v)}. La base (${b}) se repite ${e} veces como factor.`;
}

// ------------------------------------------------------------
// Niveles: qué potencias salen en cada adaptación.
// ------------------------------------------------------------
function rango(a, b) {
  const out = [];
  for (let i = a; i <= b; i++) out.push(i);
  return out;
}

const LEVELS = {
  normal: {
    grupos: [
      rango(2, 12).map((b) => [b, 2]),
      rango(2, 6).map((b) => [b, 3]),
      [[2, 4], [2, 5], [2, 6], [3, 4], [5, 4]],
      rango(2, 6).map((e) => [10, e]),
    ],
    raras: [[7, 1], [9, 1], [4, 0], [8, 0]],
    cifras: [4, 6],
  },
  facil: {
    grupos: [rango(2, 5).map((b) => [b, 2]), rango(2, 4).map((b) => [b, 3]), [[2, 4], [10, 2], [10, 3]]],
    raras: [[5, 1], [3, 1]],
    cifras: [3, 4],
  },
  acs: {
    grupos: [rango(2, 5).map((b) => [b, 2])],
    raras: [],
    cifras: [3, 3],
  },
  altas: {
    grupos: [
      rango(11, 15).map((b) => [b, 2]),
      rango(5, 10).map((b) => [b, 3]),
      [[2, 7], [2, 8], [2, 9], [2, 10], [3, 5], [3, 6], [4, 5], [5, 5], [6, 4], [7, 4]],
      rango(5, 9).map((e) => [10, e]),
    ],
    raras: [[12, 1], [15, 0]],
    cifras: [6, 7],
  },
};

function randPot(L, conRaras = true) {
  if (conRaras && L.raras.length && Math.random() < 0.08) return pick(L.raras);
  return pick(pick(L.grupos));
}

// ------------------------------------------------------------
// Generadores
// ------------------------------------------------------------
function genCalcular(L) {
  const [b, e] = randPot(L);
  const v = b ** e;
  const correct = miles(v);
  // Errores típicos: base × exponente, base + exponente, un factor de menos o de más.
  const cands = [miles(b * e), miles(b + e), e >= 2 ? miles(b ** (e - 1)) : "0", miles(b ** (e + 1)), e !== b && b !== 10 ? miles(e ** b) : null, miles(v + b)];
  return {
    instruction: L === LEVELS.acs ? "Calcula el cuadrado (el número multiplicado por sí mismo):" : "Calcula el valor de la potencia:",
    display: pot(b, e),
    options: uniqueOptions(correct, cands),
    correct,
    hint: e === 0 ? "Fíjate en el exponente: es 0." : e === 1 ? "El exponente 1 dice que la base aparece una sola vez." : `Escribe la multiplicación: ${factores(b, e)}. No multipliques ${b} × ${e}.`,
    explain: explicaPot(b, e) + (e >= 2 && b !== 10 && b * e !== v ? ` Ojo: no es ${b} × ${e} = ${b * e}.` : ""),
  };
}

function genMultiplicacion(L) {
  let b;
  let e;
  do [b, e] = randPot(L, false);
  while (b === 10 && e > 4);
  if (L === LEVELS.acs || Math.random() < 0.5) {
    const correct = factores(b, e);
    return {
      instruction: "¿Qué multiplicación es esta potencia?",
      display: pot(b, e),
      options: uniqueOptions(correct, [`${b} × ${e}`, factores(e, b), Array(e).fill(b).join(" + "), factores(b, e + 1)]),
      correct,
      hint: `La base es ${b} y el exponente es ${e}: ¿cuántas veces se escribe el ${b}?`,
      explain: `El exponente ${e} dice que el ${b} se repite ${e} veces como factor: ${pot(b, e)} = ${correct}${b === 10 && e > 3 ? "" : ` = ${miles(b ** e)}`}.`,
    };
  }
  const correct = pot(b, e);
  return {
    instruction: "Escribe la multiplicación en forma de potencia:",
    display: factores(b, e),
    options: uniqueOptions(correct, [pot(e, b), pot(b, e + 1), pot(b, Math.max(1, e - 1)), String(b * e)]),
    correct,
    hint: "El número que se repite es la base; las veces que se repite, el exponente.",
    explain: `Se repite el ${b} (base) ${e} veces (exponente): ${correct}. ${e !== b ? `No es ${pot(e, b)}, que sería ${factores(e, b)}.` : ""}`.trim(),
  };
}

function genLeer(L) {
  let b;
  let e;
  // Sin 2²: base y exponente iguales no sirven para distinguirlos.
  do [b, e] = randPot(L, false);
  while (b > 15 || e > 15 || b === e);
  const tipo = randInt(1, 3);
  if (tipo === 1) {
    const correct = leerPot(b, e);
    // Las otras lecturas siempre son incorrectas: no se ofrece «elevado a dos» junto a «al cuadrado».
    const cands = [e !== b && e <= 15 ? leerPot(e, b) : null, `${NUM_TXT[b]} por ${NUM_TXT[e]}`, leerPot(b, e === 2 ? 3 : 2)];
    return {
      instruction: "¿Cómo se lee?",
      display: pot(b, e),
      options: uniqueOptions(correct, cands),
      correct,
      hint: "Primero se lee la base (el número grande) y después el exponente (el pequeño de arriba). Con 2 se dice «al cuadrado» y con 3, «al cubo».",
      explain: `${pot(b, e)} se lee «${correct}»${e === 2 || e === 3 ? ` (también «${NUM_TXT[b]} elevado a ${NUM_TXT[e]}»)` : ""}.`,
    };
  }
  if (tipo === 2) {
    const correct = pot(b, e);
    return {
      instruction: "¿Qué potencia es?",
      display: `«${leerPot(b, e)[0].toUpperCase()}${leerPot(b, e).slice(1)}»`,
      options: uniqueOptions(correct, [e !== b ? pot(e, b) : null, String(b * e), pot(b, e === 2 ? 3 : 2), `${b} × ${e}`]),
      correct,
      hint: "El primer número que se dice es la base.",
      explain: `«${leerPot(b, e)}» se escribe ${correct}: base ${b} y exponente ${e}.`,
    };
  }
  const preguntaBase = Math.random() < 0.5;
  const correct = String(preguntaBase ? b : e);
  return {
    instruction: `En esta potencia, ¿cuál es ${preguntaBase ? "la base" : "el exponente"}?`,
    display: pot(b, e),
    options: uniqueOptions(correct, [String(preguntaBase ? e : b), miles(b ** e), String(b * e), String(b + e)]),
    correct,
    hint: "La base es el número grande que se multiplica; el exponente, el pequeño de arriba, que dice cuántas veces.",
    explain: `En ${pot(b, e)}, la base es ${b} (el factor que se repite) y el exponente es ${e} (las veces que se repite).`,
  };
}

function genDiez(L) {
  const emax = L === LEVELS.altas ? 9 : L === LEVELS.facil ? 4 : 6;
  const e = randInt(2, emax);
  const tipo = randInt(1, L === LEVELS.facil ? 2 : 4);
  const v = 10 ** e;
  if (tipo === 1) {
    const correct = miles(v);
    return {
      instruction: "¿Cuánto vale?",
      display: pot(10, e),
      options: uniqueOptions(correct, [miles(10 * e), miles(v / 10), miles(v * 10), `10${e}`]),
      correct,
      hint: `Un 1 seguido de tantos ceros como dice el exponente (${e}).`,
      explain: `${pot(10, e)} = ${correct} (${NOMBRE_10[e]}): un 1 seguido de ${e} ceros. No es 10 × ${e} = ${10 * e}.`,
    };
  }
  if (tipo === 2) {
    const correct = pot(10, e);
    return {
      instruction: "Escribe el número como potencia de 10:",
      display: miles(v),
      options: uniqueOptions(correct, [pot(10, e + 1), pot(10, e - 1), pot(e, 10), String(10 * e)]),
      correct,
      hint: "Cuenta los ceros: ese es el exponente.",
      explain: `${miles(v)} tiene ${e} ceros, así que es ${correct}.`,
    };
  }
  if (tipo === 3) {
    const a = randInt(2, 9);
    const correct = miles(a * v);
    return {
      instruction: "Calcula:",
      display: `${a} × ${pot(10, e)}`,
      options: uniqueOptions(correct, [miles(a * v * 10), miles((a * v) / 10), miles(a * 10 * e), miles(a ** e)]),
      correct,
      hint: `${pot(10, e)} = ${miles(v)}. Multiplicar por ${miles(v)} es añadir ${e} ceros.`,
      explain: `${pot(10, e)} = ${miles(v)}, así que ${a} × ${miles(v)} = ${correct}: el ${a} seguido de ${e} ceros.`,
    };
  }
  const ee = e === 2 ? 6 : pick([3, 6, e]);
  const correct = pot(10, ee);
  return {
    instruction: "¿Qué potencia de 10 es?",
    display: `${NOMBRE_10[ee][0].toUpperCase()}${NOMBRE_10[ee].slice(1)}`,
    options: uniqueOptions(correct, [pot(10, ee + 1), pot(10, ee - 1), pot(10, ee === 6 ? 3 : 6), pot(10, ee + 2)]),
    correct,
    hint: `Escribe ${NOMBRE_10[ee]} con cifras y cuenta los ceros.`,
    explain: `${NOMBRE_10[ee][0].toUpperCase()}${NOMBRE_10[ee].slice(1)} = ${miles(10 ** ee)}, que tiene ${ee} ceros: ${correct}.`,
  };
}

// Descomposición con potencias de 10: 40.302 = 4 × 10⁴ + 3 × 10² + 2.
function termino(d, pos) {
  if (pos === 0) return String(d);
  if (pos === 1) return `${d} × 10`;
  return `${d} × ${pot(10, pos)}`;
}
const descomp = (digits) => digits.map((d, i) => [d, digits.length - 1 - i]).filter(([d]) => d !== 0).map(([d, p]) => termino(d, p)).join(" + ");

function numeroConCeros(L) {
  const n = randInt(L.cifras[0], L.cifras[1]);
  const digits = [randInt(1, 9)];
  for (let i = 1; i < n; i++) digits.push(Math.random() < 0.35 ? 0 : randInt(1, 9));
  if (!digits.slice(1).includes(0) && Math.random() < 0.6) digits[randInt(1, n - 1)] = 0;
  return digits;
}

function genDescomponer(L) {
  const digits = numeroConCeros(L);
  const n = Number(digits.join(""));
  const correct = descomp(digits);
  // Errores: exponente = número de cifras (uno de más), uno de menos, saltarse los ceros.
  const conExp = (shift) => digits.map((d, i) => [d, digits.length - 1 - i + shift]).filter(([d, p]) => d !== 0 && p >= 0).map(([d, p]) => termino(d, p)).join(" + ");
  const sinCeros = descomp(digits.filter((d) => d !== 0));
  if (Math.random() < 0.5) {
    return {
      instruction: "¿Cuál es la descomposición con potencias de 10?",
      display: miles(n),
      options: uniqueOptions(correct, [conExp(1), sinCeros, conExp(-1), descomp(digits.slice().reverse())]),
      correct,
      hint: "El exponente de cada cifra es el número de cifras que tiene a su derecha. Las cifras 0 no se escriben.",
      explain: `${miles(n)} = ${correct}. ${digits.map((d, i) => (d !== 0 ? `${d} → ${["unidades", "decenas", "centenas", "unidades de millar", "decenas de millar", "centenas de millar", "unidades de millón"][digits.length - 1 - i]}` : null)).filter(Boolean).join(", ")}.`,
    };
  }
  const correctN = miles(n);
  const conCifras = (ds) => miles(Number(ds.join("")));
  return {
    instruction: "¿Qué número es?",
    display: correct,
    options: uniqueOptions(correctN, [conCifras(digits.filter((d) => d !== 0)), miles(n * 10), digits.length > 1 && n % 10 === 0 ? miles(n / 10) : miles(n + 10 ** (digits.length - 1)), miles(Number(digits.slice().reverse().join("")))]),
    correct: correctN,
    hint: "Calcula cada término (3 × 10³ = 3.000) y súmalos. Donde no hay término, va un 0.",
    explain: `${correct} = ${digits.map((d, i) => [d, digits.length - 1 - i]).filter(([d]) => d !== 0).map(([d, p]) => miles(d * 10 ** p)).join(" + ")} = ${correctN}.`,
  };
}

function genComparar(L) {
  let p1;
  let p2;
  const trampa = [[[2, 5], [5, 2]], [[3, 4], [4, 3]], [[2, 4], [4, 2]], [[2, 3], [3, 2]], [[2, 6], [6, 2]], [[10, 2], [2, 6]]];
  const trampaAltas = [[[2, 10], [10, 3]], [[3, 5], [5, 3]], [[2, 7], [7, 2]], [[4, 5], [5, 4]], [[2, 9], [9, 2]]];
  const r = Math.random();
  if (L !== LEVELS.acs && r < 0.45) {
    [p1, p2] = shuffle(pick(L === LEVELS.altas ? trampaAltas : L === LEVELS.facil ? trampa.slice(0, 4) : trampa));
  } else {
    do {
      p1 = randPot(L, false);
      p2 = randPot(L, false);
    } while ((p1[0] === p2[0] && p1[1] === p2[1]) || Math.max(p1[0] ** p1[1], p2[0] ** p2[1]) > 100000);
  }
  const v1 = p1[0] ** p1[1];
  const v2 = p2[0] ** p2[1];
  const sign = v1 < v2 ? "<" : v1 > v2 ? ">" : "=";
  return {
    instruction: "¿Qué signo va en el hueco (␣)?",
    display: `${pot(...p1)} ␣ ${pot(...p2)}`,
    options: ["<", "=", ">"],
    keepOrder: true,
    correct: sign,
    hint: "Calcula las dos potencias antes de comparar. No basta con mirar los números.",
    explain: `${pot(...p1)} = ${miles(v1)} y ${pot(...p2)} = ${miles(v2)}, así que ${pot(...p1)} ${sign} ${pot(...p2)}.${p1[0] === p2[1] && p1[1] === p2[0] ? " Al cambiar la base por el exponente, el resultado cambia (casi siempre)." : ""}`,
  };
}

// --- Problemas ---
function opcionesNum(v, b, e) {
  return uniqueOptions(miles(v), [miles(b * e), miles(b + e), miles(b ** (e - 1)), miles(b ** (e + 1)), miles(v + b)]);
}

function genProbCajas(L) {
  const b = L === LEVELS.acs ? randInt(2, 4) : randInt(L === LEVELS.altas ? 6 : 2, L === LEVELS.facil ? 4 : L === LEVELS.altas ? 12 : 8);
  const e = L === LEVELS.acs ? 2 : L === LEVELS.altas ? 4 : 3;
  const v = b ** e;
  const niveles = e === 2 ? `${b} cajas y en cada caja hay ${b} engranajes` : e === 3 ? `${b} cajas, en cada caja hay ${b} bolsas y en cada bolsa hay ${b} engranajes` : `${b} palés, en cada palé hay ${b} cajas, en cada caja ${b} bolsas y en cada bolsa ${b} engranajes`;
  return {
    instruction: "Lee el problema:",
    display: `En el almacén de una fábrica de máquinas hay ${niveles}. ¿Cuántos engranajes hay en total?`,
    options: opcionesNum(v, b, e),
    correct: miles(v),
    hint: `Se repite el ${b} ${e} veces: es la potencia ${pot(b, e)}.`,
    explain: `${factores(b, e)} = ${pot(b, e)} = ${miles(v)} engranajes.`,
  };
}

function genProbBaldosas(L) {
  const b = L === LEVELS.acs ? randInt(2, 5) : randInt(L === LEVELS.altas ? 11 : 3, L === LEVELS.facil ? 6 : L === LEVELS.altas ? 25 : 12);
  const v = b * b;
  return {
    instruction: "Lee el problema:",
    display: `El suelo cuadrado de una sala tiene ${b} baldosas en cada lado. ¿Cuántas baldosas tiene en total?`,
    options: uniqueOptions(String(v), [String(b * 4), String(b * 2), String((b - 1) * (b - 1)), String(b * (b + 1))]),
    correct: String(v),
    hint: `Hay ${b} filas de ${b} baldosas: ${b}².`,
    explain: `${b} filas de ${b} baldosas: ${b} × ${b} = ${pot(b, 2)} = ${v}. Por eso elevar a 2 se dice «al cuadrado». No es 4 × ${b} = ${b * 4}: eso sería sumar los cuatro lados.`,
  };
}

function genProbCubitos(L) {
  const b = randInt(L === LEVELS.altas ? 6 : 2, L === LEVELS.facil ? 4 : L === LEVELS.altas ? 12 : 6);
  const v = b ** 3;
  return {
    instruction: "Lee el problema:",
    display: `Con cubitos iguales construimos un cubo grande que tiene ${b} cubitos en cada arista. ¿Cuántos cubitos hemos usado?`,
    options: opcionesNum(v, b, 3),
    correct: miles(v),
    hint: `Cada capa tiene ${b} × ${b} cubitos y hay ${b} capas: ${b}³.`,
    explain: `${b} capas de ${b} × ${b} = ${b * b} cubitos: ${pot(b, 3)} = ${factores(b, 3)} = ${miles(v)}. Por eso a elevar a 3 se le llama «al cubo».`,
  };
}

function genProbCadena(L) {
  const b = randInt(2, L === LEVELS.facil ? 3 : 5);
  const dia = randInt(3, L === LEVELS.altas ? 7 : L === LEVELS.facil ? 3 : 5);
  const v = b ** dia;
  return {
    instruction: "Lee el problema:",
    display: `Lucía envía un mensaje a ${b} amigos (día 1). Al día siguiente, cada uno lo reenvía a ${b} personas nuevas, y así cada día. ¿Cuántas personas lo reciben el día ${dia}?`,
    options: opcionesNum(v, b, dia),
    correct: miles(v),
    hint: `Día 1: ${b}; día 2: ${b} × ${b}; día 3: ${b} × ${b} × ${b}… El día ${dia} es ${pot(b, dia)}.`,
    explain: `Cada día se multiplica por ${b}: el día ${dia} lo reciben ${pot(b, dia)} = ${factores(b, dia)} = ${miles(v)} personas.`,
  };
}

const MODE_GROUPS = {
  calcular: [genCalcular],
  multiplicacion: [genMultiplicacion],
  leer: [genLeer],
  diez: [genDiez],
  descomponer: [genDescomponer],
  comparar: [genComparar],
  problemas: [genProbCajas, genProbBaldosas, genProbCubitos, genProbCadena],
};

const ACS_GENERATORS = [genCalcular, genMultiplicacion, genProbBaldosas, genProbCajas];

const POTENCIAS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "El cuadrado como multiplicación de un número por sí mismo (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo el cuadrado de números del 2 al 5, escrito como multiplicación, y problemas de baldosas y cajas.",
    example: "3² = 3 × 3 = 9",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantienen las mismas potencias, pero con una tipografía más legible para distinguir bien la base del exponente.",
    example: "4³ = 64 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Calcular» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todos los contenidos, con potencias pequeñas y la pista a la vista",
    text: "Se trabajan todos los modos con bases del 2 al 5, exponentes 2 y 3, potencias de 10 hasta 10⁴ y números de 3 o 4 cifras, con la pista abierta desde el principio. Sin «Mezcla». En Explora se ven los cuadrados y cubos con cubitos.",
    example: "4³ → Pista: escribe la multiplicación: 4 × 4 × 4",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Potencias grandes y comparaciones con trampa",
    text: "Empieza en <strong>Comparar</strong> con parejas como 2¹⁰ y 10³, y en el resto de modos usa exponentes más altos, potencias de 10 hasta 10⁹ y números de 6 y 7 cifras.",
    example: "2¹⁰ = 1.024 > 10³ = 1.000",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "3² = ? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, POTENCIAS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), POTENCIAS_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("po-cubo")) initExplore();
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

// Cuadrado de lado n (cuadrícula) o cubo de arista n en perspectiva.
function dibujoCuadrado(n) {
  const S = Math.min(28, Math.floor(220 / n));
  const W = n * S;
  let out = "";
  for (let f = 0; f < n; f++) {
    for (let c = 0; c < n; c++) {
      out += `<rect x="${c * S + 2}" y="${f * S + 2}" width="${S}" height="${S}" fill="var(--color-teal-tint, #d9f2ee)" stroke="var(--color-teal)" stroke-width="1.5"/>`;
    }
  }
  return `<svg viewBox="0 0 ${W + 4} ${W + 4}" width="${W + 4}" style="max-width:100%" role="img" aria-label="Cuadrado de ${n} por ${n}">${out}</svg>`;
}

function dibujoCubo(n) {
  // Perspectiva isométrica: se ven la cara de arriba (z = n) y las dos de delante (x = n, y = n).
  const s = Math.min(24, Math.floor(130 / n));
  const dx = s * 0.866;
  const dy = s * 0.5;
  const pad = 4;
  const cx = n * dx + pad;
  const cy = n * s + pad;
  const P = (x, y, z) => `${(cx + (x - y) * dx).toFixed(1)},${(cy + (x + y) * dy - z * s).toFixed(1)}`;
  const cara = (pts, fill, stroke) => `<polygon points="${pts.map((q) => P(...q)).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`;
  let out = "";
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      out += cara([[i, j, n], [i + 1, j, n], [i + 1, j + 1, n], [i, j + 1, n]], "var(--color-amber-tint, #fdf0d5)", "var(--color-amber)");
      out += cara([[n, i, j], [n, i + 1, j], [n, i + 1, j + 1], [n, i, j + 1]], "var(--color-indigo-tint, #e3e5fb)", "var(--color-indigo)");
      out += cara([[i, n, j], [i + 1, n, j], [i + 1, n, j + 1], [i, n, j + 1]], "var(--color-teal-tint, #d9f2ee)", "var(--color-teal)");
    }
  }
  const W = Math.ceil(2 * n * dx + 2 * pad);
  const H = Math.ceil(n * s + 2 * n * dy + 2 * pad);
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="Cubo de ${n} cubitos de arista">${out}</svg>`;
}

function initExplore() {
  const state = { cubo: { n: 3, cubo: false }, pot: { b: 2, e: 5 }, diez: { e: 3 }, desc: { digits: [4, 0, 3, 0, 2] } };

  function renderCubo() {
    const { n, cubo } = state.cubo;
    document.getElementById("po-cubo-n").textContent = n;
    document.querySelectorAll("#po-cubo-tipo [data-po-tipo]").forEach((b) => b.classList.toggle("active", (b.dataset.poTipo === "cubo") === cubo));
    document.getElementById("po-cubo-draw").innerHTML = cubo ? dibujoCubo(n) : dibujoCuadrado(n);
    document.getElementById("po-cubo-msg").innerHTML = cubo
      ? `<strong>${pot(n, 3)} = ${factores(n, 3)} = ${n ** 3}</strong> cubitos. Hay ${n} capas de ${n} × ${n} = ${n * n} cubitos. Por eso elevar a 3 se dice «al cubo».`
      : `<strong>${pot(n, 2)} = ${n} × ${n} = ${n * n}</strong> cuadraditos: ${n} filas de ${n}. Por eso elevar a 2 se dice «al cuadrado».${n > 2 ? ` Ojo: no es ${n} × 2 = ${n * 2}.` : ""}`;
  }

  function renderPot() {
    const { b, e } = state.pot;
    document.getElementById("po-pot-b").textContent = b;
    document.getElementById("po-pot-e").textContent = e;
    const v = b ** e;
    const pasos = [];
    let acc = 1;
    for (let i = 1; i <= e; i++) {
      acc *= b;
      pasos.push(`<span class="po-paso">${pot(b, i)} = ${miles(acc)}</span>`);
    }
    document.getElementById("po-pot-big").innerHTML = `<span class="po-base">${b}</span><sup class="po-exp">${e}</sup> = ${e === 0 ? "1" : `${factores(b, e)} = ${miles(v)}`}`;
    document.getElementById("po-pot-msg").innerHTML =
      `<p>Se lee «${leerPot(b, e)}». La <span class="po-base">base</span> es ${b} y el <span class="po-exp">exponente</span> es ${e}.</p>` +
      (e === 0 ? "<p>Cualquier número (distinto de 0) elevado a 0 vale 1.</p>" : `<p>Cada vez que el exponente sube 1, se multiplica otra vez por ${b}: ${pasos.join(" → ")}</p>`) +
      (e >= 2 && b * e !== v ? `<p>Error frecuente: ${pot(b, e)} no es ${b} × ${e} = ${b * e}.</p>` : "");
  }

  function renderDiez() {
    const { e } = state.diez;
    document.getElementById("po-diez-e").textContent = e;
    document.getElementById("po-diez-big").textContent = `${pot(10, e)} = ${miles(10 ** e)}`;
    document.getElementById("po-diez-msg").innerHTML = `<strong>${NOMBRE_10[e][0].toUpperCase()}${NOMBRE_10[e].slice(1)}</strong>: un 1 seguido de ${e} ${e === 1 ? "cero" : "ceros"}. El exponente cuenta los ceros.${e >= 2 ? ` Por ejemplo, 3 × ${pot(10, e)} = ${miles(3 * 10 ** e)}.` : ""}`;
  }

  const ORDEN = ["U", "D", "C", "UM", "DM", "CM", "U. millón"];
  function renderDesc() {
    const { digits } = state.desc;
    const n = Number(digits.join(""));
    const k = digits.length;
    let tabla = "<table class=\"rules-table po-tabla\"><tr>";
    for (let i = 0; i < k; i++) tabla += `<th>${ORDEN[k - 1 - i]}</th>`;
    tabla += "</tr><tr>";
    for (let i = 0; i < k; i++) tabla += `<td>${digits[i]}</td>`;
    tabla += "</tr><tr>";
    for (let i = 0; i < k; i++) tabla += `<td>${k - 1 - i === 0 ? "1" : k - 1 - i === 1 ? "10" : pot(10, k - 1 - i)}</td>`;
    tabla += "</tr></table>";
    document.getElementById("po-desc-num").textContent = miles(n);
    document.getElementById("po-desc-tabla").innerHTML = tabla;
    document.getElementById("po-desc-msg").innerHTML = `<strong>${miles(n)} = ${descomp(digits)}</strong>. El exponente de cada cifra es el número de cifras que tiene a su derecha.${digits.includes(0) ? " Los ceros no se escriben, pero guardan el sitio." : ""}`;
  }

  document.querySelectorAll("[data-po]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const g = btn.dataset.po;
      const k = btn.dataset.key;
      const d = Number(btn.dataset.delta);
      if (g === "cubo") state.cubo.n = Math.max(1, Math.min(6, state.cubo.n + d));
      if (g === "pot" && k === "b") state.pot.b = Math.max(2, Math.min(10, state.pot.b + d));
      if (g === "pot" && k === "e") state.pot.e = Math.max(0, Math.min(8, state.pot.e + d));
      if (g === "diez") state.diez.e = Math.max(1, Math.min(9, state.diez.e + d));
      ({ cubo: renderCubo, pot: renderPot, diez: renderDiez })[g]();
    });
  });
  document.querySelectorAll("#po-cubo-tipo [data-po-tipo]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.cubo.cubo = btn.dataset.poTipo === "cubo";
      renderCubo();
    });
  });
  document.getElementById("po-desc-otro").addEventListener("click", () => {
    state.desc.digits = numeroConCeros({ cifras: [4, 7] });
    renderDesc();
  });

  renderCubo();
  renderPot();
  renderDiez();
  renderDesc();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-potencias"),
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
  let mode = "calcular";
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

    if (diff.is("altas")) setActiveMode("comparar");
    else if (acs) setActiveMode("calcular");
    else if ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla") setActiveMode("calcular");

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
    AppProgress.record("potencias", isCorrect);
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
