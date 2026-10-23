// ============================================================
// Múltiplos, divisores y números primos
// - Explora: fichas en filas iguales, tabla del 100 (múltiplos y
//   criba de Eratóstenes) y detective de la divisibilidad. No
//   guarda progreso: es para entender, no para puntuar.
// - Práctica: las preguntas se generan al azar (no se repiten
//   siempre las mismas) y cada una trae su pista y la explicación
//   que se ve al corregir. Solo la práctica llama a AppProgress.
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

function divisorsOf(n) {
  const out = [];
  for (let d = 1; d <= n; d++) if (n % d === 0) out.push(d);
  return out;
}

function divisorPairs(n) {
  const pairs = [];
  for (let d = 1; d * d <= n; d++) if (n % d === 0) pairs.push([d, n / d]);
  return pairs;
}

function isPrime(n) {
  return n > 1 && divisorsOf(n).length === 2;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function digitSum(n) {
  return String(n).split("").reduce((s, c) => s + Number(c), 0);
}

function listMultiples(b, upTo) {
  const out = [];
  for (let m = b; m <= upTo; m += b) out.push(m);
  return out;
}

// Explica una división: "42 : 6 = 7 y el resto es 0".
function divisionText(a, b) {
  const q = Math.floor(a / b);
  const r = a % b;
  return `${a} : ${b} = ${q} y el resto es ${r}`;
}

// Opciones numéricas: la correcta más distractores distintos y positivos.
function numericOptions(correct, candidates, count = 4) {
  const set = [String(correct)];
  shuffle(candidates).forEach((c) => {
    const s = String(c);
    if (set.length < count && c > 0 && !set.includes(s)) set.push(s);
  });
  return set;
}

// ------------------------------------------------------------
// Rangos de números según el nivel
// ------------------------------------------------------------
const LEVELS = {
  normal: { bases: [2, 3, 4, 5, 6, 7, 8, 9, 10], maxQ: 12, divN: [12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48], primeMax: 50, critMin: 100, critMax: 999, crit: [2, 3, 5, 10] },
  facil: { bases: [2, 3, 4, 5, 10], maxQ: 10, divN: [6, 8, 10, 12, 15, 16, 18, 20], primeMax: 30, critMin: 10, critMax: 99, crit: [2, 5, 10] },
  acs: { bases: [2, 5, 10], maxQ: 10, divN: [], primeMax: 0, critMin: 10, critMax: 50, crit: [2, 5, 10] },
  altas: { bases: [3, 4, 6, 7, 8, 9, 11, 12, 15, 25], maxQ: 15, divN: [36, 48, 60, 72, 84, 90, 96, 100], primeMax: 100, critMin: 1000, critMax: 9999, crit: [2, 3, 5, 10] },
};

// ------------------------------------------------------------
// Generadores de preguntas. Cada uno devuelve:
// { instruction, display, options, correct, hint, explain }
// ------------------------------------------------------------
const YES_NO = ["Sí", "No"];

function genEsMultiplo(L, asDivisor = false) {
  const b = pick(L.bases);
  const q = randInt(2, L.maxQ);
  const yes = Math.random() < 0.5;
  const a = yes ? b * q : b * q + randInt(1, b - 1);
  return {
    instruction: "Responde Sí o No:",
    display: asDivisor ? `¿Es ${b} divisor de ${a}?` : `¿Es ${a} múltiplo de ${b}?`,
    options: YES_NO,
    keepOrder: true,
    correct: yes ? "Sí" : "No",
    hint: `Divide ${a} entre ${b}. Si el resto es 0, la respuesta es sí.`,
    explain: yes
      ? `${divisionText(a, b)}: la división es exacta, porque ${b} × ${q} = ${a}. Por eso ${a} es múltiplo de ${b} y ${b} es divisor de ${a}.`
      : `${divisionText(a, b)}: no es exacta. ${a} no está en la tabla del ${b} (… ${b * q}, ${b * (q + 1)} …), así que ${a} no es múltiplo de ${b} ni ${b} es divisor de ${a}.`,
  };
}

function genEsDivisor(L) {
  return genEsMultiplo(L, true);
}

function genCualMultiplo(L) {
  const b = pick(L.bases);
  const correct = b * randInt(2, L.maxQ);
  const wrong = [];
  for (let d = -4; d <= 4; d++) {
    const c = correct + d;
    if (c > 1 && c % b !== 0) wrong.push(c);
  }
  return {
    instruction: `Elige el número que es múltiplo de ${b}:`,
    display: `¿Cuál de estos números es múltiplo de ${b}?`,
    options: numericOptions(correct, wrong),
    correct: String(correct),
    hint: `Repasa la tabla del ${b}, o divide cada número entre ${b} y busca la división exacta.`,
    explain: `${b} × ${correct / b} = ${correct}, así que ${correct} es múltiplo de ${b}. Los demás números no están en la tabla del ${b}: al dividirlos entre ${b} sobra algo.`,
  };
}

function genSerie(L) {
  const b = pick(L.bases);
  const start = randInt(1, Math.max(1, L.maxQ - 5));
  const serie = [0, 1, 2, 3, 4].map((i) => b * (start + i));
  const hole = randInt(1, 3);
  const correct = serie[hole];
  const shown = serie.map((v, i) => (i === hole ? "?" : v)).join(", ");
  return {
    instruction: "¿Qué número falta en la serie?",
    display: `Múltiplos de ${b}: ${shown}`,
    options: numericOptions(correct, [correct + 1, correct - 1, correct - 2, correct + 2, correct + b + 1]),
    correct: String(correct),
    hint: `En los múltiplos de ${b}, cada número es ${b} más que el anterior.`,
    explain: `Los múltiplos de ${b} van de ${b} en ${b}: ${serie.join(", ")}. Falta el ${correct} = ${b} × ${correct / b}.`,
  };
}

function genNoEsDivisor(L) {
  const n = pick(L.divN.filter((x) => divisorsOf(x).length >= 5));
  const divs = divisorsOf(n);
  const noDivs = [];
  for (let d = 2; d < n; d++) if (n % d !== 0) noDivs.push(d);
  const correct = pick(noDivs.filter((d) => d <= Math.max(10, n / 2)));
  const shownDivs = shuffle(divs.filter((d) => d !== 1 && d !== n)).slice(0, 3);
  return {
    instruction: "Busca el intruso:",
    display: `¿Cuál de estos números NO es divisor de ${n}?`,
    options: [String(correct), ...shownDivs.map(String)],
    correct: String(correct),
    hint: `Divide ${n} entre cada opción. El que no da división exacta es el intruso.`,
    explain: `${divisionText(n, correct)}, así que ${correct} no es divisor de ${n}. Los divisores de ${n} son: ${divs.join(", ")}.`,
  };
}

function genCuantosDivisores(L) {
  const n = pick(L.divN);
  const divs = divisorsOf(n);
  const c = divs.length;
  const pairs = divisorPairs(n).map(([a, b]) => `${a} × ${b}`).join(" · ");
  return {
    instruction: "Cuenta los divisores:",
    display: `¿Cuántos divisores tiene ${n}?`,
    options: numericOptions(c, [c - 1, c + 1, c + 2, c - 2]),
    correct: String(c),
    hint: `Busca parejas de números que multiplicados den ${n}, empezando por 1 × ${n}.`,
    explain: `Parejas: ${pairs}. Divisores de ${n}: ${divs.join(", ")}. Son ${c} divisores.`,
  };
}

function genPareja(L) {
  const n = pick(L.divN);
  const pairs = divisorPairs(n).filter(([a, b]) => a > 1 && a !== b);
  if (!pairs.length) return genCuantosDivisores(L);
  const [d, q] = pick(pairs);
  return {
    instruction: "Los divisores van en parejas:",
    display: `${d} es divisor de ${n}. ¿Con qué divisor forma pareja?`,
    options: numericOptions(q, [q + 1, q - 1, n - d, d * 2, q + 2]),
    correct: String(q),
    hint: `Busca el número que multiplicado por ${d} da ${n}: ${n} : ${d}.`,
    explain: `${n} : ${d} = ${q}, porque ${d} × ${q} = ${n}. Por eso ${d} y ${q} forman una pareja de divisores de ${n}: ${divisorPairs(n).map(([x, y]) => `${x} × ${y}`).join(" · ")}.`,
  };
}

const CRIT_END = { 2: "0, 2, 4, 6 u 8", 5: "0 o en 5", 10: "0" };

const CRIT_TEXT = {
  2: "termina en 0, 2, 4, 6 u 8",
  3: "la suma de sus cifras es múltiplo de 3",
  5: "termina en 0 o en 5",
  10: "termina en 0",
};

// Frase completa: "348 termina en 8" / "348: sus cifras suman 3 + 4 + 8 = 15…".
function critReason(n, c) {
  const last = String(n).slice(-1);
  if (c === 3) {
    const s = digitSum(n);
    const sumText = String(n).split("").join(" + ") + " = " + s;
    return `${n}: sus cifras suman ${sumText}, y ${s} ${s % 3 === 0 ? "es" : "no es"} múltiplo de 3`;
  }
  return n % c === 0 ? `${n} termina en ${last}` : `${n} termina en ${last}, y tendría que terminar en ${CRIT_END[c]}`;
}

function randomDivisibleOrNot(L, c, wantYes) {
  for (let i = 0; i < 200; i++) {
    const n = randInt(L.critMin, L.critMax);
    if ((n % c === 0) === wantYes) return n;
  }
  return wantYes ? c * 12 : c * 12 + 1;
}

function genCriterioSiNo(L) {
  const c = pick(L.crit);
  const yes = Math.random() < 0.5;
  const n = randomDivisibleOrNot(L, c, yes);
  return {
    instruction: "Usa el criterio, sin hacer la división:",
    display: `¿Es ${n} divisible entre ${c}?`,
    options: YES_NO,
    keepOrder: true,
    correct: yes ? "Sí" : "No",
    hint: `Criterio del ${c}: un número es divisible entre ${c} si ${CRIT_TEXT[c]}.`,
    explain: `${yes ? "Sí" : "No"}. ${critReason(n, c)}. Comprobación: ${divisionText(n, c)}.`,
  };
}

function genCualDivisible(L) {
  const c = pick(L.crit);
  const correct = randomDivisibleOrNot(L, c, true);
  const wrong = [];
  while (wrong.length < 3) {
    const w = randomDivisibleOrNot(L, c, false);
    if (!wrong.includes(w) && w !== correct) wrong.push(w);
  }
  return {
    instruction: "Usa el criterio de divisibilidad:",
    display: `¿Cuál de estos números es divisible entre ${c}?`,
    options: [correct, ...wrong].map(String),
    correct: String(correct),
    hint: `Criterio del ${c}: ${CRIT_TEXT[c]}.`,
    explain: `${critReason(correct, c)}. Los otros no cumplen el criterio del ${c}.`,
  };
}

function genCifraTres(L) {
  if (!L.crit.includes(3)) return genCualDivisible(L);
  // Número de tres cifras con un hueco en medio: 4_7.
  const first = randInt(1, 9);
  const last = randInt(0, 9);
  const okDigits = [];
  const badDigits = [];
  for (let d = 0; d <= 9; d++) ((first + d + last) % 3 === 0 ? okDigits : badDigits).push(d);
  const correct = pick(okDigits);
  const options = [correct, ...shuffle(badDigits).slice(0, 3)].map(String);
  const n = first * 100 + correct * 10 + last;
  return {
    instruction: "Criterio del 3:",
    display: `¿Qué cifra puedes poner en ${first}_${last} para que sea divisible entre 3?`,
    options,
    correct: String(correct),
    hint: `Suma ${first} + ${last} y busca qué cifra le añades para llegar a un múltiplo de 3 (3, 6, 9, 12, 15, 18…).`,
    explain: `Con ${correct}: ${first} + ${correct} + ${last} = ${first + correct + last}, que es múltiplo de 3. ${n} : 3 = ${n / 3}. Con las otras cifras la suma no es múltiplo de 3.`,
  };
}

function primeExplain(n) {
  if (n === 1) return "El 1 solo tiene un divisor (él mismo), así que no es primo ni compuesto.";
  const divs = divisorsOf(n);
  if (divs.length === 2) return `${n} solo tiene dos divisores: 1 y ${n}. Es primo.`;
  return `${n} tiene ${divs.length} divisores (${divs.join(", ")}): más de dos, así que es compuesto.`;
}

const ODD_COMPOSITES = [9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55, 57, 63, 65, 69, 75, 77, 81, 85, 87, 91, 93, 95, 99];

function genPrimoCompuesto(L) {
  const r = Math.random();
  let n;
  if (r < 0.08) n = 1;
  else if (r < 0.5) n = pick(Array.from({ length: L.primeMax }, (_, i) => i + 1).filter(isPrime));
  else if (r < 0.75) n = pick(ODD_COMPOSITES.filter((x) => x <= L.primeMax));
  else n = randInt(2, Math.floor(L.primeMax / 2)) * 2;
  const correct = n === 1 ? "Ninguno de los dos" : isPrime(n) ? "Primo" : "Compuesto";
  return {
    instruction: "¿Es un número primo, compuesto o ninguno de los dos?",
    display: String(n),
    options: ["Primo", "Compuesto", "Ninguno de los dos"],
    keepOrder: true,
    correct,
    hint: "Busca sus divisores. Si solo tiene dos (el 1 y él mismo), es primo. Si tiene más, es compuesto.",
    explain: primeExplain(n),
  };
}

function genCualPrimo(L) {
  const primes = [];
  for (let i = 11; i <= L.primeMax; i++) if (isPrime(i)) primes.push(i);
  const correct = pick(primes.length ? primes : [7, 11, 13]);
  const wrong = shuffle(ODD_COMPOSITES.filter((x) => x <= L.primeMax)).slice(0, 3);
  return {
    instruction: "Solo uno es primo:",
    display: "¿Cuál de estos números es primo?",
    options: [correct, ...wrong].map(String),
    correct: String(correct),
    hint: "Prueba a dividir cada número entre 3, 5 y 7. El que no se puede dividir de forma exacta entre ninguno es primo.",
    explain: `${correct} solo tiene dos divisores: 1 y ${correct}. Los otros son compuestos: ${wrong.map((w) => `${w} = ${divisorPairs(w).find(([a]) => a > 1).join(" × ")}`).join(" · ")}.`,
  };
}

// --- Problemas con contexto ---
function genProbEquipos(L) {
  const k = pick(L.bases.filter((b) => b >= 3 && b <= 8).concat([3, 4, 5]));
  const yes = Math.random() < 0.5;
  const n = yes ? k * randInt(3, 7) : k * randInt(3, 7) + randInt(1, k - 1);
  return {
    instruction: "Lee el problema:",
    display: `En el patio hay ${n} niños y niñas. ¿Se pueden hacer equipos de ${k} sin que nadie se quede fuera?`,
    options: YES_NO,
    keepOrder: true,
    correct: yes ? "Sí" : "No",
    hint: `¿Es ${k} divisor de ${n}? Divide ${n} entre ${k}.`,
    explain: yes
      ? `${divisionText(n, k)}: salen ${n / k} equipos completos. ${k} es divisor de ${n}.`
      : `${divisionText(n, k)}: salen ${Math.floor(n / k)} equipos y se quedan ${n % k} fuera. ${k} no es divisor de ${n}.`,
  };
}

function genProbCajas(L) {
  const b = pick(L === LEVELS.acs ? [2, 5, 10] : [4, 6, 8, 10, 12]);
  const correct = b * randInt(3, 9);
  const wrong = [];
  for (let d = -5; d <= 5; d++) if (d !== 0 && (correct + d) % b !== 0) wrong.push(correct + d);
  return {
    instruction: "Lee el problema:",
    display: `Las magdalenas se venden en cajas de ${b}. ¿Qué cantidad puedes comprar llevando solo cajas completas?`,
    options: numericOptions(correct, wrong),
    correct: String(correct),
    hint: `Con cajas completas solo se pueden tener múltiplos de ${b}.`,
    explain: `${correct} = ${b} × ${correct / b}: son ${correct / b} cajas completas. Las otras cantidades no son múltiplos de ${b}.`,
  };
}

function genProbRana(L) {
  const b = pick(L.bases);
  const yes = Math.random() < 0.5;
  const t = yes ? b * randInt(4, L.maxQ + 2) : b * randInt(4, L.maxQ + 2) + randInt(1, b - 1);
  return {
    instruction: "Lee el problema:",
    display: `Una rana sale del 0 y avanza dando saltos de ${b} en ${b}. ¿Pisará la casilla ${t}?`,
    options: YES_NO,
    keepOrder: true,
    correct: yes ? "Sí" : "No",
    hint: `La rana solo pisa múltiplos de ${b}: ${b}, ${b * 2}, ${b * 3}…`,
    explain: yes
      ? `${t} = ${b} × ${t / b}: es múltiplo de ${b}, así que la rana la pisa en el salto ${t / b}.`
      : `${divisionText(t, b)}. ${t} no es múltiplo de ${b}: la rana pasa de la ${t - (t % b)} a la ${t - (t % b) + b} y se la salta.`,
  };
}

function genProbFilas(L) {
  const n = pick(L.divN.length ? L.divN : [12, 20]);
  const divs = divisorsOf(n).filter((d) => d > 1 && d < n);
  const correct = pick(divs);
  const wrong = [];
  for (let d = 2; d < Math.min(n, 13); d++) if (n % d !== 0) wrong.push(d);
  return {
    instruction: "Lee el problema:",
    display: `Hay que colocar ${n} sillas en filas iguales, sin que sobre ninguna. ¿Cuántas sillas puede haber en cada fila?`,
    options: numericOptions(correct, wrong),
    correct: String(correct),
    hint: `Las filas iguales salen con los divisores de ${n}.`,
    explain: `${n} : ${correct} = ${n / correct}: ${n / correct} filas de ${correct} sillas. Divisores de ${n}: ${divisorsOf(n).join(", ")}.`,
  };
}

// --- 6º: M.C.D. y m.c.m. ---
function genMCD(L) {
  let a;
  let b;
  let g;
  do {
    g = randInt(2, L === LEVELS.altas ? 12 : 8);
    const x = randInt(1, 6);
    const y = randInt(2, 7);
    a = g * x;
    b = g * y;
  } while (a === b || gcd(a, b) !== g || a < 4);
  const common = divisorsOf(g);
  const divA = divisorsOf(a);
  const divB = divisorsOf(b);
  const problem = Math.random() < 0.35;
  return {
    instruction: problem ? "Lee el problema:" : "Calcula el máximo común divisor:",
    display: problem
      ? `Tenemos ${a} lápices rojos y ${b} azules. Queremos hacer el mayor número posible de lotes iguales (todos con los mismos rojos y los mismos azules) sin que sobre ningún lápiz. ¿Cuántos lotes podemos hacer?`
      : `M.C.D. de ${a} y ${b}`,
    options: numericOptions(g, [lcm(a, b), common.length > 2 ? common[common.length - 2] : 1, Math.min(a, b) === g ? g * 2 : Math.min(a, b), g + 1, 1]),
    correct: String(g),
    hint: `Escribe los divisores de ${a} y los de ${b}, y busca el más grande que esté en las dos listas.`,
    explain: `Divisores de ${a}: ${divA.join(", ")}. Divisores de ${b}: ${divB.join(", ")}. Comunes: ${common.join(", ")}. El mayor es ${g}: M.C.D. (${a}, ${b}) = ${g}.${problem ? ` Salen ${g} lotes, cada uno con ${a / g} rojos y ${b / g} azules.` : ""}`,
  };
}

function genMCM(L) {
  let a;
  let b;
  let m;
  const top = L === LEVELS.altas ? 15 : 10;
  do {
    a = randInt(2, top);
    b = randInt(2, top);
    m = lcm(a, b);
  } while (a === b || m > (L === LEVELS.altas ? 120 : 60));
  const problem = Math.random() < 0.35;
  return {
    instruction: problem ? "Lee el problema:" : "Calcula el mínimo común múltiplo:",
    display: problem
      ? `Lucía va a la piscina cada ${a} días y Pablo cada ${b}. Hoy han coincidido. ¿Dentro de cuántos días volverán a coincidir?`
      : `m.c.m. de ${a} y ${b}`,
    options: numericOptions(m, [a * b, m * 2, gcd(a, b), a + b, m + Math.min(a, b)]),
    correct: String(m),
    hint: `Escribe los primeros múltiplos de ${a} y de ${b}, y busca el primero que esté en las dos listas.`,
    explain: `Múltiplos de ${a}: ${listMultiples(a, m).join(", ")}… Múltiplos de ${b}: ${listMultiples(b, m).join(", ")}… El primero que coincide es ${m}: m.c.m. (${a}, ${b}) = ${m}.`,
  };
}

const MODE_GROUPS = {
  multiplos: [genEsMultiplo, genCualMultiplo, genSerie],
  divisores: [genEsDivisor, genNoEsDivisor, genCuantosDivisores, genPareja],
  divisibilidad: [genCriterioSiNo, genCualDivisible, genCifraTres],
  primoscompuesto: [genPrimoCompuesto, genCualPrimo],
  problemas: [genProbEquipos, genProbCajas, genProbRana, genProbFilas],
  mcd: [genMCD],
  mcm: [genMCM],
};

// ACS: solo múltiplos de 2, 5 y 10 con números pequeños.
const ACS_GENERATORS = [genEsMultiplo, genCualMultiplo, genSerie, genProbCajas];
// Discalculia: contenidos de 5º con números pequeños (sin M.C.D. ni m.c.m.).
const FACIL_MODES = ["multiplos", "divisores", "divisibilidad", "primoscompuesto", "problemas"];

const MULTDIV_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo múltiplos de 2, 5 y 10 (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja solo si un número es múltiplo de 2, 5 o 10, con números hasta 100 y los trucos más sencillos (acabar en cifra par, en 0 o en 5). En Explora, el detective solo muestra esos tres criterios.",
    example: "20 → múltiplo de 2, de 5 y de 10 · 22 → múltiplo de 2, pero no de 5 ni de 10",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de contenido, pero con una tipografía más legible para leer las preguntas y los problemas.",
    example: "¿Es 42 múltiplo de 6? → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Múltiplos» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Los mismos contenidos de 5º, con números pequeños y la pista a la vista",
    text: "Se trabajan múltiplos, divisores, criterios, primos y problemas, pero con tablas hasta el 10, números de dos cifras y la pista abierta desde el principio. Sin modo «Mezcla» y sin M.C.D. ni m.c.m. Las fichas y la tabla del 100 de Explora ayudan a ver lo que se calcula.",
    example: "¿Es 18 múltiplo de 3? → Pista: divide 18 entre 3; si el resto es 0, es sí",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Números más grandes y mínimo común múltiplo",
    text: "Empieza en el <strong>mínimo común múltiplo</strong> (con problemas), y en el resto de modos usa números de cuatro cifras, primos hasta 100 y tablas hasta el 25.",
    example: "m.c.m. de 6 y 8 = 24 · ¿Es 4.371 divisible entre 3?",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Es 42 múltiplo de 6? → elige Sí o No",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, MULTDIV_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), MULTDIV_DIFFICULTY_EXPLANATIONS);

  const register = (fn) => restartCallbacks.push(fn);
  if (document.getElementById("md-rect")) initExplore(diff, register);
  if (document.getElementById("word-display")) initGame(diff, register);
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
function initExplore(diff, registerRestart) {
  initRectangles();
  initHundred();
  initDetective(diff, registerRestart);
}

// 1. Fichas en filas iguales
function initRectangles() {
  const MAX_N = 60;
  const state = { n: 12, k: 5 };
  const nOut = document.getElementById("md-rect-n");
  const kOut = document.getElementById("md-rect-k");
  const dots = document.getElementById("md-rect-dots");
  const msg = document.getElementById("md-rect-msg");
  const allOut = document.getElementById("md-rect-all-out");

  function render() {
    const { n, k } = state;
    nOut.textContent = n;
    kOut.textContent = k;
    const q = Math.floor(n / k);
    const r = n % k;
    dots.style.gridTemplateColumns = `repeat(${k}, var(--md-dot-size))`;
    dots.innerHTML = "";
    for (let i = 0; i < n; i++) {
      const dot = document.createElement("span");
      dot.className = "md-dot" + (i >= q * k ? " sobra" : "");
      dots.appendChild(dot);
    }
    if (r === 0) {
      msg.className = "md-msg ok";
      msg.innerHTML = `Salen <strong>${q} ${q === 1 ? "fila" : "filas"} de ${k}</strong> y no sobra ninguna: ${k} × ${q} = ${n}.<br><strong>${k} es divisor de ${n}</strong> y <strong>${n} es múltiplo de ${k}</strong>.`;
    } else {
      msg.className = "md-msg ko";
      msg.innerHTML = `Salen ${q} ${q === 1 ? "fila completa" : "filas completas"} de ${k} y <strong>${r === 1 ? "sobra 1 ficha" : `sobran ${r} fichas`}</strong> (en rosa): ${n} : ${k} = ${q}, resto ${r}.<br>${k} <strong>no</strong> es divisor de ${n}.`;
    }
    allOut.innerHTML = "";
  }

  document.querySelectorAll("#md-rect [data-step]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const delta = Number(btn.dataset.delta);
      if (btn.dataset.step === "n") {
        state.n = Math.min(MAX_N, Math.max(1, state.n + delta));
        state.k = Math.min(state.k, state.n);
      } else {
        state.k = Math.min(state.n, Math.max(1, state.k + delta));
      }
      render();
    });
  });

  document.getElementById("md-rect-all").addEventListener("click", () => {
    const n = state.n;
    const divs = divisorsOf(n);
    const pairs = divisorPairs(n).map(([a, b]) => `<span class="md-chip">${a} × ${b}</span>`).join("");
    let tipo;
    if (n === 1) tipo = "El 1 solo tiene un divisor: no es primo ni compuesto.";
    else if (divs.length === 2) tipo = `Solo se pueden hacer filas de 1 o de ${n}: <strong>${n} es un número primo</strong>.`;
    else tipo = `Tiene más de dos divisores: <strong>${n} es un número compuesto</strong>.`;
    allOut.innerHTML = `<p>Parejas que dan ${n}:</p><div class="md-chip-list">${pairs}</div><p>Divisores de ${n}: <strong>${divs.join(", ")}</strong>.</p><p>${tipo}</p>`;
  });

  render();
}

// 2. Tabla del 100: múltiplos y criba
function initHundred() {
  const grid = document.getElementById("md-cien-grid");
  const msg = document.getElementById("md-cien-msg");
  const pickA = document.getElementById("md-cien-a");
  const pickB = document.getElementById("md-cien-b");
  const multCtrl = document.getElementById("md-cien-multiplos-ctrl");
  const cribaCtrl = document.getElementById("md-cien-criba-ctrl");
  const nextBtn = document.getElementById("md-criba-next");
  const CRIBA_STEPS = [2, 3, 5, 7];

  const cells = [];
  for (let i = 1; i <= 100; i++) {
    const c = document.createElement("span");
    c.className = "md-cell";
    c.textContent = i;
    grid.appendChild(c);
    cells.push(c);
  }

  const state = { mode: "multiplos", a: 3, b: 0, step: 0 };

  function makePicker(container, key, withNone) {
    const values = (withNone ? [0] : []).concat([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    values.forEach((v) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-secondary md-pick-btn";
      btn.textContent = v === 0 ? "Ninguno" : v;
      btn.dataset.value = v;
      btn.addEventListener("click", () => {
        state[key] = v;
        render();
      });
      container.appendChild(btn);
    });
  }
  makePicker(pickA, "a", false);
  makePicker(pickB, "b", true);

  function renderMultiples() {
    const { a, b } = state;
    pickA.querySelectorAll("button").forEach((x) => x.classList.toggle("active", Number(x.dataset.value) === a));
    pickB.querySelectorAll("button").forEach((x) => x.classList.toggle("active", Number(x.dataset.value) === b));
    cells.forEach((c, idx) => {
      const n = idx + 1;
      const inA = n % a === 0;
      const inB = b > 0 && n % b === 0;
      c.className = "md-cell" + (inA && inB ? " mult-ab" : inA ? " mult-a" : inB ? " mult-b" : "");
    });
    const multA = listMultiples(a, 100);
    let html = `<p><span class="md-key mult-a"></span>Múltiplos de ${a} hasta 100 (${multA.length}): ${multA.join(", ")}.</p>`;
    if (b > 0 && b !== a) {
      const multB = listMultiples(b, 100);
      const comunes = multA.filter((m) => m % b === 0);
      html += `<p><span class="md-key mult-b"></span>Múltiplos de ${b} hasta 100 (${multB.length}): ${multB.join(", ")}.</p>`;
      html += comunes.length
        ? `<p><span class="md-key mult-ab"></span><strong>Múltiplos comunes de ${a} y ${b}:</strong> ${comunes.join(", ")}. El más pequeño es el <strong>${comunes[0]}</strong> (en 6º lo llamarás mínimo común múltiplo).</p>`
        : `<p><span class="md-key mult-ab"></span>No tienen múltiplos comunes hasta el 100.</p>`;
    }
    html += `<p class="md-note">Mira las columnas y diagonales que se forman: los múltiplos siguen un patrón.</p>`;
    msg.innerHTML = html;
  }

  function renderCriba() {
    const done = CRIBA_STEPS.slice(0, state.step);
    cells.forEach((c, idx) => {
      const n = idx + 1;
      let cls = "md-cell";
      if (n === 1) cls += " tachado";
      else if (done.includes(n)) cls += " primo";
      else if (done.some((p) => n % p === 0)) cls += " tachado";
      else if (state.step === CRIBA_STEPS.length) cls += " primo";
      c.className = cls;
    });
    nextBtn.disabled = state.step >= CRIBA_STEPS.length;
    if (state.step === 0) {
      msg.innerHTML = "<p>El 1 ya está tachado: no es primo ni compuesto. Pulsa «Siguiente paso» para tachar los múltiplos de 2 (menos el propio 2).</p>";
    } else if (state.step < CRIBA_STEPS.length) {
      const p = CRIBA_STEPS[state.step - 1];
      const next = CRIBA_STEPS[state.step];
      msg.innerHTML = `<p>Hemos dejado el <strong>${p}</strong> (es primo) y tachado sus otros múltiplos: ningún múltiplo de ${p} mayor que ${p} puede ser primo, porque ${p} es divisor suyo. Siguiente: el ${next}, que es el primer número que queda sin tachar.</p>`;
    } else {
      const primes = [];
      for (let i = 2; i <= 100; i++) if (isPrime(i)) primes.push(i);
      msg.innerHTML = `<p>Después del 7 ya no hace falta seguir: cualquier número compuesto hasta 100 tiene un divisor entre 2, 3, 5 y 7. Los que quedan sin tachar son los <strong>${primes.length} números primos hasta 100</strong>:</p><p>${primes.join(", ")}.</p>`;
    }
  }

  function render() {
    multCtrl.hidden = state.mode !== "multiplos";
    cribaCtrl.hidden = state.mode !== "criba";
    if (state.mode === "multiplos") renderMultiples();
    else renderCriba();
  }

  document.querySelectorAll("#md-cien-modes [data-cien-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#md-cien-modes [data-cien-mode]").forEach((b) => b.classList.toggle("active", b === btn));
      state.mode = btn.dataset.cienMode;
      render();
    });
  });
  nextBtn.addEventListener("click", () => {
    state.step = Math.min(CRIBA_STEPS.length, state.step + 1);
    render();
  });
  document.getElementById("md-criba-reset").addEventListener("click", () => {
    state.step = 0;
    render();
  });

  render();
}

// 3. Detective de la divisibilidad
function initDetective(diff, registerRestart) {
  const input = document.getElementById("md-det-n");
  const out = document.getElementById("md-det-out");

  function render() {
    const n = Math.floor(Number(input.value));
    if (!n || n < 1 || n > 99999) {
      out.innerHTML = "<p class=\"md-note\">Escribe un número entre 1 y 99.999.</p>";
      return;
    }
    const criteria = diff.is("acs") ? [2, 5, 10] : [2, 3, 5, 10];
    out.innerHTML = criteria
      .map((c) => {
        const ok = n % c === 0;
        return `<div class="md-crit ${ok ? "ok" : "ko"}">
          <p class="md-crit-title">${ok ? "✔" : "✘"} ${ok ? "Divisible" : "No divisible"} entre ${c}</p>
          <p>Regla: ${CRIT_TEXT[c]}.</p>
          <p>${critReason(n, c)}.</p>
          <p class="md-note">Comprobación: ${divisionText(n, c)}.</p>
        </div>`;
      })
      .join("");
  }

  input.addEventListener("input", render);
  registerRestart(render);
  render();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-multiplos"),
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
  let mode = "multiplos";
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
      b.disabled = acs || (disc && !FACIL_MODES.includes(m)) || (m === "mezcla" && diff.is("tdah"));
    });

    if (diff.is("altas")) setActiveMode("mcm");
    else if (disc && !FACIL_MODES.includes(mode)) setActiveMode("multiplos");
    else if (diff.is("tdah") && mode === "mezcla") setActiveMode("multiplos");
    else if (acs) setActiveMode("multiplos");

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function generatorsFor() {
    if (diff.is("acs")) return ACS_GENERATORS;
    if (mode === "mezcla") {
      const keys = Object.keys(MODE_GROUPS).filter((k) => !diff.is("discalculia") || FACIL_MODES.includes(k));
      return MODE_GROUPS[pick(keys)];
    }
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

    // Sí/No y primo/compuesto mantienen su orden; las numéricas se barajan.
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
    AppProgress.record("multiplos-divisores", isCorrect);
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
