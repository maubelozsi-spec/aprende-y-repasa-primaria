// ============================================================
// Operaciones con fracciones
// - Explora: fracción de una cantidad con fichas en grupos, sumar y
//   restar con el mismo denominador y sumar con distinto denominador
//   (6º). No guarda progreso: es para entender, no para puntuar.
// - Práctica: las preguntas se generan al azar y cada una trae su
//   pista y la explicación que se ve al corregir. Las opciones se
//   comparan por su valor, para que nunca haya dos respuestas que
//   valgan lo mismo (6/12 y 2/4). Solo la práctica llama a AppProgress.
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

// Una o varias barras (si la fracción es mayor que 1).
function fractionBars(num, denom, color) {
  const whole = Math.floor(num / denom);
  const rest = num % denom;
  const total = Math.max(rest > 0 ? whole + 1 : whole, 1);
  let out = '<div class="of-bars">';
  for (let b = 0; b < total; b++) out += fractionBarSVG(b < whole ? denom : rest, denom, color);
  return out + "</div>";
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

// Valor de una respuesta: fracción "a/b", entero o decimal con coma.
function answerValue(str) {
  const m = String(str).match(/^(\d+)\/(\d+)$/);
  if (m) return Number(m[2]) === 0 ? NaN : Number(m[1]) / Number(m[2]);
  const n = Number(String(str).replace(",", "."));
  return isNaN(n) ? NaN : n;
}

// Opciones distintas por valor (si se puede calcular) y por texto.
function uniqueOptions(correct, candidates, count = 4) {
  const out = [correct];
  const vals = [answerValue(correct)];
  shuffle(candidates).forEach((c) => {
    if (out.length >= count || c === undefined || c === null) return;
    const s = String(c);
    if (out.includes(s) || /undefined|NaN|\/0$/.test(s)) return;
    const v = answerValue(s);
    if (!isNaN(v) && (v < 0 || vals.some((x) => !isNaN(x) && Math.abs(x - v) < 1e-9))) return;
    vals.push(v);
    out.push(s);
  });
  return out;
}

// "… = 6/12 = 1/2" cuando se puede simplificar, "= 2" si sale un
// entero y el número mixto si es mayor que 1.
function simplifyNote(n, d) {
  if (n === 0 || d === 1) return "";
  const g = gcd(n, d);
  const red = n / g;
  const den = d / g;
  if (den === 1) return ` = ${red}`;
  let note = g > 1 ? ` = ${fs(red, den)}` : "";
  if (red > den) note += ` (${Math.floor(red / den)} ${red % den}/${den} como número mixto)`;
  return note;
}

function decimalEs(x) {
  return String(Math.round(x * 1000) / 1000).replace(".", ",");
}

// ------------------------------------------------------------
// Niveles
// ------------------------------------------------------------
const LEVELS = {
  normal: { dens: [3, 4, 5, 6, 7, 8, 9, 10], grupos: [2, 8], distDens: [2, 3, 4, 5, 6], visual: false },
  facil: { dens: [2, 3, 4, 5, 6], grupos: [2, 5], distDens: [2, 3, 4], visual: true },
  acs: { dens: [2, 3, 4], grupos: [2, 5], distDens: [2, 4], visual: true },
  altas: { dens: [4, 5, 6, 7, 8, 9, 10, 12], grupos: [3, 12], distDens: [2, 3, 4, 5, 6, 8, 9, 10, 12], visual: false },
};

const OF_NOMBRES = ["Ana", "Lucía", "Mario", "Pablo", "Marta", "Diego", "Sara", "Hugo", "Elena", "Noa"];

function sumVisual(a, b, d, op) {
  return `<div class="of-op-visual">${fractionBars(a, d, "var(--color-teal)")}<span class="of-op-sign">${op}</span>${fractionBars(b, d, "var(--color-amber)")}</div>`;
}

// ------------------------------------------------------------
// 5º: fracción de una cantidad, sumas y restas, combinadas
// ------------------------------------------------------------
function genFraccionDe(L) {
  const d = L === LEVELS.acs ? pick([2, 3, 4]) : pick(L.dens);
  const n = L === LEVELS.acs ? 1 : randInt(1, d - 1);
  const m = randInt(L.grupos[0], L.grupos[1]);
  const T = d * m;
  const correct = n * m;
  return {
    instruction: "Calcula:",
    display: `${fs(n, d)} de ${T}`,
    options: uniqueOptions(String(correct), [m, T - correct, correct + m, correct + 1, T * n, correct - 1].filter((x) => x > 0 && x !== T).map(String)),
    correct: String(correct),
    hint: `Divide ${T} entre ${d} (eso es 1/${d}) y multiplica el resultado por ${n}.`,
    explain: n === 1
      ? `${T} : ${d} = ${m}. 1/${d} de ${T} es ${m}.`
      : `${T} : ${d} = ${m} es 1/${d} de ${T}. Como quieres ${n} partes: ${m} × ${n} = ${correct}. Si solo divides, te sale ${m}, que es 1/${d}, no ${fs(n, d)}.`,
  };
}

function genSumaIgual(L) {
  const d = pick(L.dens);
  const impropia = L !== LEVELS.acs && Math.random() < 0.25;
  const a = randInt(1, d - 1);
  const b = impropia ? randInt(Math.max(1, d - a + 1), d - 1) : randInt(1, Math.max(1, d - a - 1));
  const s = a + b;
  const correct = fs(s, d);
  return {
    instruction: "Calcula el resultado:",
    display: `${fs(a, d)} + ${fs(b, d)}`,
    visual: L.visual ? sumVisual(a, b, d, "+") : "",
    options: uniqueOptions(correct, [fs(s, 2 * d), fs(a * b, d), fs(s + 1, d), fs(Math.max(1, s - 1), d), fs(s, d + 1)]),
    correct,
    hint: "Con el mismo denominador, se suman los numeradores y el denominador se queda igual.",
    explain: `${a} + ${b} = ${s} y el denominador sigue siendo ${d}: ${correct}${simplifyNote(s, d)}. Los denominadores no se suman: las partes siguen siendo del mismo tamaño.`,
  };
}

function genRestaIgual(L) {
  const d = pick(L.dens);
  const a = randInt(2, L === LEVELS.acs ? d : d + 2);
  const b = randInt(1, a - 1);
  const r = a - b;
  const correct = fs(r, d);
  return {
    instruction: "Calcula el resultado:",
    display: `${fs(a, d)} − ${fs(b, d)}`,
    visual: L.visual ? sumVisual(a, b, d, "−") : "",
    options: uniqueOptions(correct, [fs(a + b, d), fs(r + 1, d), fs(b, d), fs(r, d + 1), fs(Math.max(1, r - 1), d)]),
    correct,
    hint: "Con el mismo denominador, se restan los numeradores y el denominador se queda igual.",
    explain: `${a} − ${b} = ${r} y el denominador sigue siendo ${d}: ${correct}${simplifyNote(r, d)}.`,
  };
}

function genCombinadaIgual(L) {
  const d = pick(L.dens.filter((x) => x >= 4));
  const forma = randInt(1, 4);
  let display;
  let res;
  let pasos;
  let errores = [];
  let hint = "Primero los paréntesis; después, sumas y restas de izquierda a derecha.";
  if (forma === 1) {
    const a = randInt(1, d);
    const b = randInt(1, d);
    const c = randInt(1, a + b - 1);
    res = a + b - c;
    display = `${fs(a, d)} + ${fs(b, d)} − ${fs(c, d)}`;
    pasos = `${fs(a, d)} + ${fs(b, d)} = ${fs(a + b, d)}; ${fs(a + b, d)} − ${fs(c, d)} = ${fs(res, d)}`;
    errores = [fs(a + b + c, d), fs(res, 3 * d)];
  } else if (forma === 2) {
    const a = randInt(2, d + 1);
    const b = randInt(1, a - 1);
    const c = randInt(1, d);
    res = a - b + c;
    display = `(${fs(a, d)} − ${fs(b, d)}) + ${fs(c, d)}`;
    pasos = `Paréntesis: ${fs(a, d)} − ${fs(b, d)} = ${fs(a - b, d)}; ${fs(a - b, d)} + ${fs(c, d)} = ${fs(res, d)}`;
    errores = [Math.abs(a - (b + c)) > 0 ? fs(Math.abs(a - b - c), d) : null, fs(a + b + c, d)];
  } else if (forma === 3) {
    const a = randInt(1, d - 2);
    const b = randInt(1, d - 1 - a);
    res = d - a - b;
    display = `1 − (${fs(a, d)} + ${fs(b, d)})`;
    pasos = `Paréntesis: ${fs(a, d)} + ${fs(b, d)} = ${fs(a + b, d)}. El 1 es ${fs(d, d)}: ${fs(d, d)} − ${fs(a + b, d)} = ${fs(res, d)}`;
    errores = [fs(a + b, d), fs(Math.max(1, Math.abs(1 - a - b)), d)];
    hint = `Resuelve el paréntesis y escribe el 1 como ${fs(d, d)}.`;
  } else {
    const b = randInt(1, d - 1);
    const c = randInt(1, d - 1);
    const a = b + c + randInt(1, d);
    res = a - b - c;
    display = `${fs(a, d)} − (${fs(b, d)} + ${fs(c, d)})`;
    pasos = `Paréntesis: ${fs(b, d)} + ${fs(c, d)} = ${fs(b + c, d)}; ${fs(a, d)} − ${fs(b + c, d)} = ${fs(res, d)}`;
    errores = [fs(a - b + c, d), fs(a + b + c, d)];
  }
  const correct = fs(res, d);
  return {
    instruction: "Resuelve la operación combinada:",
    display,
    options: uniqueOptions(correct, errores.concat([fs(res + 1, d), fs(Math.max(1, res - 1), d), fs(res, d + 1)])),
    correct,
    hint,
    explain: `${pasos}${simplifyNote(res, d)}.`,
  };
}

// --- Problemas (5º) ---
function genProbPaginas(L) {
  const d = pick(L.dens.filter((x) => x <= 8));
  const n = randInt(1, d - 1);
  // Libros de entre 20 y 120 páginas (hasta 60 con números pequeños).
  const m = randInt(Math.ceil(20 / d), Math.floor((L.visual ? 60 : 120) / d));
  const T = d * m;
  const leidas = n * m;
  const quedan = T - leidas;
  const preguntaQueda = Math.random() < 0.5;
  const correct = String(preguntaQueda ? quedan : leidas);
  return {
    instruction: "Lee el problema:",
    display: `Un libro tiene ${T} páginas y ${pick(OF_NOMBRES)} ya ha leído ${fs(n, d)}. ¿Cuántas páginas ${preguntaQueda ? "le quedan por leer" : "ha leído"}?`,
    options: uniqueOptions(correct, [preguntaQueda ? leidas : quedan, m, T - m, Number(correct) + m, Number(correct) + 1, Number(correct) - 1, Number(correct) + 2].filter((x) => x > 0 && x !== T).map(String)),
    correct,
    hint: preguntaQueda ? `Calcula primero ${fs(n, d)} de ${T} y réstalo del total.` : `Divide ${T} entre ${d} y multiplica por ${n}.`,
    explain: `${T} : ${d} = ${m}; ${m} × ${n} = ${leidas} páginas leídas.${preguntaQueda ? ` Le quedan ${T} − ${leidas} = ${quedan} (que es ${fs(d - n, d)} del libro).` : ""}`,
  };
}

function genProbEnergia(L) {
  const d = pick(L.dens.filter((x) => x >= 4));
  const a = randInt(1, d - 2);
  const b = randInt(1, d - 1 - a);
  const res = d - a - b;
  const correct = fs(res, d);
  return {
    instruction: "Lee el problema:",
    display: `Empiezas el día con toda tu energía. Por la mañana gastas ${fs(a, d)} y por la tarde ${fs(b, d)}. ¿Qué fracción de energía te queda por la noche?`,
    options: uniqueOptions(correct, [fs(a + b, d), fs(res, 2 * d), fs(res + 1, d), fs(d - a, d)]),
    correct,
    hint: `Toda la energía es 1 = ${fs(d, d)}. Resta lo que gastas por la mañana y por la tarde.`,
    explain: `Gastas ${fs(a, d)} + ${fs(b, d)} = ${fs(a + b, d)}. Te queda ${fs(d, d)} − ${fs(a + b, d)} = ${correct}${simplifyNote(res, d)}.`,
  };
}

function genProbPizza(L) {
  const d = pick(L.dens.filter((x) => x >= 4));
  const a = randInt(1, d - 2);
  const b = randInt(1, d - 1 - a);
  const [p1, p2] = shuffle(OF_NOMBRES);
  const correct = fs(a + b, d);
  return {
    instruction: "Lee el problema:",
    display: `Una pizza está cortada en ${d} trozos iguales. ${p1} se come ${fs(a, d)} y ${p2}, ${fs(b, d)}. ¿Qué fracción de pizza se han comido entre los dos?`,
    options: uniqueOptions(correct, [fs(a + b, 2 * d), fs(d - a - b, d), fs(a * b, d), fs(a + b + 1, d)]),
    correct,
    hint: "Suma las dos fracciones: tienen el mismo denominador.",
    explain: `${fs(a, d)} + ${fs(b, d)} = ${correct}: se suman los trozos (${a} + ${b}) y siguen siendo trozos de ${d}.`,
  };
}

function genProbDinero(L) {
  const d = pick(L.dens.filter((x) => x <= 6));
  const n = randInt(1, d - 1);
  // Entre 10 y 60 € (hasta 120 € en altas capacidades).
  const m = randInt(Math.ceil(10 / d), Math.floor((L === LEVELS.altas ? 120 : 60) / d));
  const T = d * m;
  const gasto = n * m;
  const correct = String(T - gasto);
  return {
    instruction: "Lee el problema:",
    display: `${pick(OF_NOMBRES)} tiene ${T} € y se gasta ${fs(n, d)} en un regalo. ¿Cuánto dinero le queda?`,
    options: uniqueOptions(correct, [gasto, m, T - m, T - gasto + 1, T - gasto - 1, T - gasto + m].filter((x) => x > 0 && x !== T).map(String)),
    correct,
    hint: `Calcula cuánto es ${fs(n, d)} de ${T} € y réstalo.`,
    explain: `${T} : ${d} = ${m}; ${m} × ${n} = ${gasto} € de gasto. Le quedan ${T} − ${gasto} = ${correct} €.`,
  };
}

// ------------------------------------------------------------
// 6º: distinto denominador, multiplicar, dividir, como división,
// combinadas con prioridad
// ------------------------------------------------------------
function twoFracs(dens) {
  let b;
  let d;
  do {
    b = pick(dens);
    d = pick(dens);
  } while (b === d || lcm(b, d) > 36);
  return [randInt(1, b - 1), b, randInt(1, d - 1), d];
}

function genSumaRestaDistinta(L) {
  let [a, b, c, d] = twoFracs(L.distDens);
  const resta = Math.random() < 0.5;
  if (resta && a * d < c * b) [a, b, c, d] = [c, d, a, b];
  if (resta && a * d === c * b) a = a < b - 1 ? a + 1 : a;
  const m = lcm(b, d);
  const A = a * (m / b);
  const C = c * (m / d);
  const r = resta ? A - C : A + C;
  const op = resta ? "−" : "+";
  const correct = fs(r, m);
  return {
    instruction: "Calcula (distinto denominador):",
    display: `${fs(a, b)} ${op} ${fs(c, d)}`,
    options: uniqueOptions(correct, [fs(resta ? Math.abs(a - c) || 1 : a + c, b + d), fs(resta ? Math.abs(a - c) || 1 : a + c, b * d), fs(r + 1, m), fs(Math.max(1, r - 1), m), fs(r, m + 1)]),
    correct,
    hint: `Busca el m.c.m. de ${b} y ${d} y pasa las dos fracciones a ese denominador.`,
    explain: `m.c.m.(${b}, ${d}) = ${m}. ${fs(a, b)} = ${fs(A, m)} y ${fs(c, d)} = ${fs(C, m)}. ${fs(A, m)} ${op} ${fs(C, m)} = ${correct}${simplifyNote(r, m)}. No se ${resta ? "restan" : "suman"} los denominadores: ${fs(resta ? Math.abs(a - c) : a + c, b + d)} está mal.`,
  };
}

function genMultiplicar(L) {
  if (Math.random() < 0.4) {
    const b = pick(L.distDens.concat([7, 8]));
    const a = randInt(1, b - 1);
    const k = randInt(2, 6);
    const correct = fs(a * k, b);
    return {
      instruction: "Multiplica:",
      display: `${fs(a, b)} × ${k}`,
      options: uniqueOptions(correct, [fs(a, b * k), fs(a + k, b), fs(a * k, b * k), fs(a * k + 1, b)]),
      correct,
      hint: "Un número entero es como una fracción con denominador 1: multiplica solo el numerador.",
      explain: `${fs(a, b)} × ${k} = ${fs(a * k, b)} (${a} × ${k} = ${a * k}; el denominador no cambia)${simplifyNote(a * k, b)}. Es lo mismo que sumar ${fs(a, b)} ${k} veces.`,
    };
  }
  const [a, b, c, d] = twoFracs(L.distDens.concat([7, 8]));
  const correct = fs(a * c, b * d);
  return {
    instruction: "Multiplica estas fracciones:",
    display: `${fs(a, b)} × ${fs(c, d)}`,
    options: uniqueOptions(correct, [fs(a + c, b + d), fs(a * d, b * c), fs(a * c, b + d), fs(a + c, b * d), fs(a * c + 1, b * d), fs(a * c, b * d + 1)]),
    correct,
    hint: "Multiplica numerador por numerador y denominador por denominador.",
    explain: `(${a} × ${c})/(${b} × ${d}) = ${correct}${simplifyNote(a * c, b * d)}.`,
  };
}

function genDividir(L) {
  let a;
  let b;
  let c;
  let d;
  do {
    [a, b, c, d] = twoFracs(L.distDens.concat([7, 8]));
  } while (a * d === b * c);
  const correct = fs(a * d, b * c);
  return {
    instruction: "Divide estas fracciones:",
    display: `${fs(a, b)} ÷ ${fs(c, d)}`,
    options: uniqueOptions(correct, [fs(a * c, b * d), fs(b * c, a * d), fs(a + d, b + c), fs(a * d + 1, b * c)]),
    correct,
    hint: "Multiplica la primera por la segunda dada la vuelta (o multiplica en cruz).",
    explain: `${fs(a, b)} ÷ ${fs(c, d)} = ${fs(a, b)} × ${fs(d, c)} = (${a} × ${d})/(${b} × ${c}) = ${correct}${simplifyNote(a * d, b * c)}.`,
  };
}

function genComoDivision(L) {
  const tipo = randInt(1, 3);
  if (tipo === 1) {
    const d = randInt(2, 9);
    const n = randInt(1, 12);
    return {
      instruction: "¿Qué división es igual a esta fracción?",
      display: `${fs(n, d)} = ?`,
      options: uniqueOptions(`${n} ÷ ${d}`, [`${d} ÷ ${n}`, `${n} × ${d}`, `${n} − ${d}`, `${n} + ${d}`]),
      correct: `${n} ÷ ${d}`,
      hint: "La raya de la fracción significa «dividido entre».",
      explain: `Una fracción es una división: el numerador entre el denominador. ${fs(n, d)} = ${n} ÷ ${d}${n % d === 0 ? ` = ${n / d}` : ""}.`,
    };
  }
  if (tipo === 2) {
    const d = pick([2, 4, 5, 10]);
    let n;
    do {
      n = randInt(1, d * 2);
    } while (n % d === 0);
    const correct = decimalEs(n / d);
    return {
      instruction: "Escribe la fracción como número decimal:",
      display: `${fs(n, d)} = ?`,
      options: uniqueOptions(correct, [`${n},${d}`, decimalEs(d / n), decimalEs(n / d / 10), decimalEs((n / d) * 10)].filter((x) => x !== "0")),
      correct,
      hint: `Divide ${n} entre ${d}.`,
      explain: `${fs(n, d)} = ${n} ÷ ${d} = ${correct}. No es «${n},${d}»: la raya no es una coma, es una división.`,
    };
  }
  const n = randInt(2, 7);
  let d;
  do {
    d = randInt(2, 8);
  } while (d === n);
  const correct = fs(n, d);
  return {
    instruction: "Lee el problema:",
    display: `Se reparten ${n} pizzas iguales entre ${d} amigos a partes iguales. ¿Qué fracción de pizza le toca a cada uno?`,
    options: uniqueOptions(correct, [fs(d, n), fs(1, d), fs(1, n), fs(n, d + n)]),
    correct,
    hint: "Repartir es dividir: pizzas entre amigos.",
    explain: `${n} ÷ ${d} = ${correct} de pizza para cada uno${n > d ? ` (más de una pizza: ${Math.floor(n / d)} ${n % d}/${d})` : ""}.`,
  };
}

// a/b + c/d × e/f (o con −): primero la multiplicación.
function genPrioridad(L) {
  let a;
  let b;
  let c;
  let d;
  let e;
  let f;
  let num;
  let den;
  const resta = Math.random() < 0.4;
  do {
    b = pick(L.distDens);
    a = randInt(1, b - 1);
    d = pick(L.distDens);
    c = randInt(1, d - 1);
    f = pick(L.distDens);
    e = randInt(1, f - 1);
    const pn = c * e;
    const pd = d * f;
    const m = lcm(b, pd);
    num = resta ? a * (m / b) - pn * (m / pd) : a * (m / b) + pn * (m / pd);
    den = m;
  } while (num <= 0 || den > 60);
  const g = gcd(num, den);
  const correct = fs(num / g, den / g);
  // Error típico: operar de izquierda a derecha.
  const ln = resta ? a * d - c * b : a * d + c * b;
  const wrongLR = ln > 0 ? fs((ln * e) / gcd(ln * e, b * d * f), (b * d * f) / gcd(ln * e, b * d * f)) : null;
  const op = resta ? "−" : "+";
  const pn = c * e;
  const pd = d * f;
  return {
    instruction: "Resuelve respetando la prioridad de las operaciones:",
    display: `${fs(a, b)} ${op} ${fs(c, d)} × ${fs(e, f)}`,
    options: uniqueOptions(correct, [wrongLR, fs(num / g + 1, den / g), fs(a + c + e, b + d + f), fs(Math.max(1, num / g - 1), den / g), fs(num / g, den / g + 1), fs(num / g + 2, den / g), resta ? fs(a * pd + pn * b, b * pd) : fs(Math.abs(a * pd - pn * b) || 1, b * pd)]),
    correct,
    hint: "Primero la multiplicación; después la suma o la resta.",
    explain: `Primero se multiplica: ${fs(c, d)} × ${fs(e, f)} = ${fs(pn, pd)}. Después: ${fs(a, b)} ${op} ${fs(pn, pd)} = ${fs(num, den)}${g > 1 ? ` = ${correct}` : ""}.${wrongLR ? ` Si operas de izquierda a derecha sale ${wrongLR}, que está mal.` : ""}`,
  };
}

const MODE_GROUPS = {
  fracciondenum: [genFraccionDe],
  sumarrestar: [genSumaIgual, genRestaIgual],
  combinadas: [genCombinadaIgual],
  problemas: [genProbPaginas, genProbEnergia, genProbPizza, genProbDinero],
  distintodenom: [genSumaRestaDistinta],
  multiplicar: [genMultiplicar],
  dividir: [genDividir],
  comodivision: [genComoDivision],
  combinadas6: [genPrioridad],
};

const ACS_GENERATORS = [genFraccionDe, genFraccionDe, genSumaIgual, genRestaIgual];
const QUINTO_MODES = ["fracciondenum", "sumarrestar", "combinadas", "problemas"];

const OPFRACCIONES_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "La mitad, el tercio y el cuarto, y sumas con dibujo",
    text: "Para el alumnado con adaptación curricular significativa se trabaja calcular 1/2, 1/3 o 1/4 de números pequeños y sumar o restar medios, tercios y cuartos viendo las barras.",
    example: "1/2 de 10 → 10 ÷ 2 = 5 · 1/4 + 2/4 = 3/4",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de operaciones, pero con una tipografía más legible para leer las fracciones y los problemas.",
    example: "2/7 + 3/7 = 5/7 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Fracción de un número» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Los mismos contenidos de 5º, con números pequeños, barras y la pista a la vista",
    text: "Se trabajan la fracción de una cantidad, las sumas y restas, las combinadas y los problemas con denominadores hasta 6, las barras dibujadas en las sumas y la pista abierta. Sin «Mezcla» ni los modos de 6º.",
    example: "2/5 + 1/5 → con las dos barras dibujadas y la pista: se suman los numeradores",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Combinadas con prioridad y números más grandes",
    text: "Empieza en las <strong>operaciones combinadas con multiplicación</strong> (prioridad de las operaciones), y en el resto de modos usa denominadores hasta 12.",
    example: "1/2 + 1/3 × 3/4 = 1/2 + 3/12 = 3/4",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "3/4 de 20 = ? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  renderTeoriaExamples();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, OPFRACCIONES_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), OPFRACCIONES_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("of-cant")) initExplore();
  if (document.getElementById("word-display")) initGame(diff, (fn) => restartCallbacks.push(fn));
});

function renderTeoriaExamples() {
  const sumaEl = document.getElementById("ejemplo-suma");
  if (sumaEl) {
    sumaEl.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:10px;">
        <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap; justify-content:center;">
          ${fractionBarSVG(2, 7, "var(--color-teal)")}
          <span style="font-size:22px; font-weight:800;">+</span>
          ${fractionBarSVG(3, 7, "var(--color-amber)")}
          <span style="font-size:22px; font-weight:800;">=</span>
          ${fractionBarSVG(5, 7, "var(--color-indigo)")}
        </div>
      </div>`;
  }
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
  const state = {
    cant: { n: 3, d: 4, m: 5 },
    suma: { a: 2, b: 3, d: 7, op: "+" },
    dist: { a: 1, b: 2, c: 1, e: 3 },
  };
  const LIMITS = {
    cant: { n: [1, (s) => s.d], d: [2, () => 8], m: [1, () => 6] },
    suma: { a: [1, (s) => s.d * 2], b: [1, (s) => (s.op === "−" ? s.a : s.d * 2)], d: [2, () => 10] },
    dist: { a: [1, (s) => s.b], b: [2, () => 6], c: [1, (s) => s.e], e: [2, () => 6] },
  };

  function renderCant() {
    const { n, d, m } = state.cant;
    ["n", "d", "m"].forEach((k) => (document.getElementById("of-cant-" + k).textContent = state.cant[k]));
    const T = d * m;
    let html = "";
    for (let g = 0; g < d; g++) {
      html += `<div class="of-group${g < n ? " tomado" : ""}">`;
      for (let i = 0; i < m; i++) html += '<span class="md-dot"></span>';
      html += "</div>";
    }
    document.getElementById("of-cant-groups").innerHTML = html;
    document.getElementById("of-cant-msg").innerHTML =
      `Hay <strong>${T} fichas</strong> repartidas en ${d} grupos iguales: ${T} : ${d} = ${m} en cada grupo (eso es 1/${d} de ${T}). ` +
      `Tomamos ${n} ${n === 1 ? "grupo" : "grupos"}: ${m} × ${n} = <strong>${m * n}</strong>. Así que <strong>${fs(n, d)} de ${T} = ${m * n}</strong>${n < d ? ` y quedan ${T - m * n} (${fs(d - n, d)} de ${T})` : ""}.`;
  }

  function renderSuma() {
    const { a, b, d, op } = state.suma;
    ["a", "b", "d"].forEach((k) => (document.getElementById("of-suma-" + k).textContent = k === "d" ? d : fs(state.suma[k], d)));
    const r = op === "+" ? a + b : a - b;
    document.getElementById("of-suma-bars").innerHTML =
      `<div class="fr-row"><span class="fr-row-label">${fs(a, d)}</span>${fractionBars(a, d, "var(--color-teal)")}</div>` +
      `<div class="fr-row"><span class="fr-row-label">${op} ${fs(b, d)}</span>${fractionBars(b, d, "var(--color-amber)")}</div>` +
      `<div class="fr-row"><span class="fr-row-label">= ${fs(r, d)}</span>${r > 0 ? fractionBars(r, d, "var(--color-indigo)") : '<span class="md-note">nada</span>'}</div>`;
    const extra = r > d ? ` Es más de una unidad: ${Math.floor(r / d)}${r % d ? ` ${r % d}/${d}` : ""}.` : r === d ? " Es justo una unidad entera." : "";
    document.getElementById("of-suma-msg").innerHTML =
      `${fs(a, d)} ${op} ${fs(b, d)} = <strong>${fs(r, d)}</strong>: ${a} ${op} ${b} = ${r} ${r === 1 ? "parte" : "partes"}, y cada parte sigue siendo 1/${d}, así que el denominador no cambia.${extra}`;
  }

  function renderDist() {
    const { a, b, c, e } = state.dist;
    ["a", "b", "c", "e"].forEach((k) => (document.getElementById("of-dist-" + k).textContent = state.dist[k]));
    document.getElementById("of-dist-f1").textContent = fs(a, b);
    document.getElementById("of-dist-f2").textContent = fs(c, e);
    const m = lcm(b, e);
    const A = a * (m / b);
    const C = c * (m / e);
    const s = A + C;
    let html =
      `<div class="fr-row"><span class="fr-row-label fr-a">${fs(a, b)}</span>${fractionBars(a, b, "var(--color-indigo)")}<span class="md-note">→</span>${fractionBars(A, m, "var(--color-indigo)")}<span class="fr-row-label fr-a">${fs(A, m)}</span></div>` +
      `<div class="fr-row"><span class="fr-row-label fr-b">${fs(c, e)}</span>${fractionBars(c, e, "var(--color-teal)")}<span class="md-note">→</span>${fractionBars(C, m, "var(--color-teal)")}<span class="fr-row-label fr-b">${fs(C, m)}</span></div>` +
      `<div class="fr-row"><span class="fr-row-label">= ${fs(s, m)}</span>${fractionBars(s, m, "var(--color-plum)")}</div>`;
    document.getElementById("of-dist-bars").innerHTML = html;
    document.getElementById("of-dist-msg").innerHTML = b === e
      ? `Ya tienen el mismo denominador: se suman los numeradores. ${fs(a, b)} + ${fs(c, e)} = <strong>${fs(a + c, b)}</strong>${simplifyNote(a + c, b)}.`
      : `Cortamos todo en partes de 1/${m} (m.c.m. de ${b} y ${e} = ${m}): ${fs(a, b)} = ${fs(A, m)} y ${fs(c, e)} = ${fs(C, m)}. Ahora sí: ${fs(A, m)} + ${fs(C, m)} = <strong>${fs(s, m)}</strong>${simplifyNote(s, m)}. Sumar a lo bruto daría ${fs(a + c, b + e)}, que está mal.`;
  }

  const renders = { cant: renderCant, suma: renderSuma, dist: renderDist };

  document.querySelectorAll("[data-of]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.dataset.of;
      const s = state[group];
      const key = btn.dataset.key;
      const [min, maxFn] = LIMITS[group][key];
      s[key] = Math.min(maxFn(s), Math.max(min, s[key] + Number(btn.dataset.delta)));
      Object.entries(LIMITS[group]).forEach(([k, [mn, mx]]) => {
        s[k] = Math.min(mx(s), Math.max(mn, s[k]));
      });
      renders[group]();
    });
  });

  document.querySelectorAll("#of-suma-op [data-of-op]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#of-suma-op [data-of-op]").forEach((b) => b.classList.toggle("active", b === btn));
      state.suma.op = btn.dataset.ofOp;
      if (state.suma.op === "−" && state.suma.b > state.suma.a) state.suma.b = state.suma.a;
      renderSuma();
    });
  });

  renderCant();
  renderSuma();
  renderDist();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-opfracciones"),
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
  let mode = "fracciondenum";
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
      b.disabled = acs || (disc && !QUINTO_MODES.includes(m)) || (m === "mezcla" && diff.is("tdah"));
    });

    if (diff.is("altas")) setActiveMode("combinadas6");
    else if (acs) setActiveMode("fracciondenum");
    else if (disc && !QUINTO_MODES.includes(mode)) setActiveMode("fracciondenum");
    else if (diff.is("tdah") && mode === "mezcla") setActiveMode("fracciondenum");

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
    els.gameVisual.style.display = current.visual ? "" : "none";
    els.gameVisual.innerHTML = current.visual || "";

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
    AppProgress.record("operaciones-fracciones", isCorrect);
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
