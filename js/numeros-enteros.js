// ============================================================
// Números enteros
// - Explora: un número en la recta (opuesto y valor absoluto),
//   comparar dos enteros y sumar caminando por la recta. No guarda
//   progreso: es para entender, no para puntuar.
// - Práctica: las preguntas se generan al azar y cada una trae su
//   pista y la explicación que se ve al corregir. Solo la práctica
//   llama a AppProgress.
// Los negativos se escriben con el signo menos (−), no con guion, y
// los resultados positivos sin signo (7, no +7): así no se mezclan
// dos formas de escribir la misma respuesta.
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

// −7, 0, 7
const z = (n) => (n < 0 ? `−${-n}` : String(n));
// (−7), (+7), 0
const zp = (n) => (n < 0 ? `(−${-n})` : n > 0 ? `(+${n})` : "0");

function parseZ(s) {
  const t = String(s).trim().replace("−", "-").replace(/^\+/, "");
  return /^-?\d+$/.test(t) ? Number(t) : NaN;
}

// Opciones distintas por texto y por valor.
function uniqueOptions(correct, candidates, count = 4) {
  const out = [correct];
  const vals = [parseZ(correct)];
  shuffle(candidates).forEach((c) => {
    if (out.length >= count || c === undefined || c === null) return;
    const s = String(c);
    if (out.includes(s) || /undefined|NaN/.test(s)) return;
    const v = parseZ(s);
    if (!isNaN(v) && vals.includes(v)) return;
    vals.push(v);
    out.push(s);
  });
  return out;
}

// Recta numérica de `lo` a `hi` con una marca por entero.
function rectaZ(lo, hi, marks, flecha) {
  const W = 520;
  const x0 = 24;
  const x1 = W - 24;
  const y = 56;
  const xOf = (v) => x0 + ((x1 - x0) * (v - lo)) / (hi - lo);
  const paso = hi - lo > 24 ? 5 : hi - lo > 12 ? 2 : 1;
  let out = `<line x1="${x0 - 10}" y1="${y}" x2="${x1 + 10}" y2="${y}" stroke="var(--text)" stroke-width="2"/>`;
  out += `<polygon points="${x1 + 14},${y} ${x1 + 4},${y - 5} ${x1 + 4},${y + 5}" fill="var(--text)"/><polygon points="${x0 - 14},${y} ${x0 - 4},${y - 5} ${x0 - 4},${y + 5}" fill="var(--text)"/>`;
  for (let v = lo; v <= hi; v++) {
    const big = v === 0;
    out += `<line x1="${xOf(v)}" y1="${y - (big ? 10 : 6)}" x2="${xOf(v)}" y2="${y + (big ? 10 : 6)}" stroke="var(--text)" stroke-width="${big ? 2.5 : 1.2}"/>`;
    if (v % paso === 0 || v === lo || v === hi) {
      out += `<text x="${xOf(v)}" y="${y + 28}" text-anchor="middle" font-size="13" font-weight="${big ? 800 : 600}" fill="${v < 0 ? "var(--color-error)" : "var(--text)"}">${z(v)}</text>`;
    }
  }
  if (flecha) {
    const xa = xOf(flecha.from);
    const xb = xOf(flecha.to);
    const yy = y - 26;
    out += `<path d="M ${xa} ${y - 8} Q ${(xa + xb) / 2} ${yy - 14} ${xb} ${y - 8}" fill="none" stroke="var(--color-amber)" stroke-width="2.5"/>`;
    const dir = xb >= xa ? -1 : 1;
    out += `<polygon points="${xb},${y - 8} ${xb + dir * 9},${y - 16} ${xb + dir * 2},${y - 18}" fill="var(--color-amber)"/>`;
  }
  const xs = marks.map((m) => xOf(m.v));
  marks.forEach((m, i) => {
    const juntas = marks.length === 2 && Math.abs(xs[0] - xs[1]) < 20;
    const lx = juntas ? xs[i] + (i === 0 ? -12 : 12) : xs[i];
    out += `<circle cx="${xs[i]}" cy="${y}" r="7" fill="${m.color}"/>`;
    if (m.label) out += `<text x="${lx}" y="16" text-anchor="middle" font-size="13" font-weight="800" fill="${m.color}">${m.label}</text>`;
  });
  return `<svg viewBox="0 0 ${W} 96" width="100%" style="max-width:${W}px" role="img" aria-label="Recta numérica">${out}</svg>`;
}

// ------------------------------------------------------------
// Niveles
// ------------------------------------------------------------
const LEVELS = {
  normal: { max: 20 },
  facil: { max: 10 },
  acs: { max: 6 },
  altas: { max: 60 },
};

const randZ = (L, sinCero = true) => {
  let n;
  do {
    n = randInt(-L.max, L.max);
  } while (sinCero && n === 0);
  return n;
};

const NOMBRE_NUM = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte"];
const leerZ = (n) => (Math.abs(n) <= 20 ? `${n < 0 ? "menos " : n > 0 ? "más " : ""}${NOMBRE_NUM[Math.abs(n)]}` : `${n < 0 ? "menos" : "más"} ${Math.abs(n)}`);

function explicaComparar(a, b) {
  if (a === b) return `Es el mismo número: ${z(a)} = ${z(b)}.`;
  const [mayor, menor] = a > b ? [a, b] : [b, a];
  if (mayor >= 0 && menor < 0) return `${z(mayor)} ${mayor === 0 ? "es el cero, y el cero es mayor que cualquier negativo" : "es positivo y todo positivo es mayor que cualquier negativo"}. En la recta, ${z(mayor)} está a la derecha de ${z(menor)}.`;
  if (menor >= 0) return `Los dos son positivos (o cero): es mayor el más alejado del 0, ${z(mayor)}.`;
  return `Los dos son negativos: es mayor el que está más cerca del 0. ${z(mayor)} está más cerca del 0 que ${z(menor)}. Piensa en temperaturas: con ${z(menor)} ºC hace más frío que con ${z(mayor)} ºC.`;
}

function explicaSuma(a, b, conRecta = true) {
  const r = a + b;
  if (a === 0 || b === 0) return `Sumar 0 no cambia el número: ${zp(a)} + ${zp(b)} = ${z(r)}.`;
  if ((a > 0) === (b > 0)) {
    return `Los dos tienen el mismo signo (${a > 0 ? "positivo" : "negativo"}): se suman los valores absolutos, ${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(r)}, y se deja el signo: ${z(r)}.`;
  }
  if (r === 0) return `Son opuestos: ${zp(a)} + ${zp(b)} = 0.`;
  const grande = Math.abs(a) > Math.abs(b) ? a : b;
  return `Tienen distinto signo: se restan los valores absolutos, ${Math.max(Math.abs(a), Math.abs(b))} − ${Math.min(Math.abs(a), Math.abs(b))} = ${Math.abs(r)}, y se deja el signo del de mayor valor absoluto (${z(grande)}): ${z(r)}.${conRecta ? ` En la recta: sales de ${z(a)} y ${b > 0 ? `avanzas ${b}` : `retrocedes ${-b}`}.` : ""}`;
}

// ------------------------------------------------------------
// Generadores
// ------------------------------------------------------------
const CONTEXTOS = [
  (n) => [`${Math.abs(n)} ${Math.abs(n) === 1 ? "grado" : "grados"} ${n < 0 ? "bajo" : "sobre"} cero`, "ºC"],
  (n) => [n < 0 ? `el sótano ${-n} de un edificio` : `el piso ${n} de un edificio`, "piso"],
  (n) => [n < 0 ? `una deuda de ${-n} €` : `tener ${n} € ahorrados`, "€"],
  (n) => [`${Math.abs(n)} ${Math.abs(n) === 1 ? "metro" : "metros"} ${n < 0 ? "bajo" : "sobre"} el nivel del mar`, "m"],
];

function genRepresentar(L) {
  const tipo = randInt(1, 3);
  const lim = Math.min(L.max, 10);
  if (tipo === 1) {
    const n = randInt(-lim, lim);
    const correct = z(n);
    return {
      instruction: "¿Qué número marca el punto?",
      visual: rectaZ(-lim, lim, [{ v: n, color: "var(--color-rose)" }]),
      display: "",
      options: uniqueOptions(correct, [z(-n), z(n + 1), z(n - 1), n !== 0 ? z(n + (n > 0 ? -2 : 2)) : "2"]),
      correct,
      hint: "Cuenta las rayitas desde el 0: a la derecha son positivos y a la izquierda, negativos.",
      explain: n === 0 ? "El punto está en el 0." : `El punto está ${Math.abs(n)} ${Math.abs(n) === 1 ? "rayita" : "rayitas"} a la ${n > 0 ? "derecha" : "izquierda"} del 0: ${correct}.`,
    };
  }
  if (tipo === 2) {
    const n = randZ({ max: Math.min(L.max, 15) });
    const [texto] = pick(CONTEXTOS)(n);
    const correct = z(n);
    return {
      instruction: "¿Qué número entero corresponde?",
      display: `«${texto[0].toUpperCase()}${texto.slice(1)}»`,
      options: uniqueOptions(correct, [z(-n), z(n + 1), String(Math.abs(n) * 10)]),
      correct,
      hint: "Bajo cero, sótanos, deudas y bajo el nivel del mar son negativos.",
      explain: `${texto[0].toUpperCase()}${texto.slice(1)} se escribe ${correct}: ${n < 0 ? "es una cantidad por debajo de 0, negativa" : "es una cantidad por encima de 0, positiva"}.`,
    };
  }
  const n = randZ({ max: Math.min(L.max, 20) });
  const correct = leerZ(n);
  return {
    instruction: "¿Cómo se lee?",
    display: z(n),
    options: uniqueOptions(correct, [leerZ(-n), `${n < 0 ? "más" : "menos"} ${NOMBRE_NUM[Math.min(20, Math.abs(n) + 1)] || Math.abs(n) + 1}`, `${n < 0 ? "menos" : "más"} ${NOMBRE_NUM[Math.max(1, Math.abs(n) - 1)]}`]),
    correct,
    hint: "El signo − se lee «menos» y el signo + se lee «más».",
    explain: `${z(n)} se lee «${correct}».`,
  };
}

function genComparar(L) {
  let a;
  let b;
  const r = Math.random();
  if (r < 0.45) {
    // Los dos negativos: el error típico es fijarse solo en el número.
    a = -randInt(1, L.max);
    do {
      b = -randInt(1, L.max);
    } while (b === a);
  } else if (r < 0.55) {
    a = randZ(L);
    b = a;
  } else if (L === LEVELS.acs || r < 0.8) {
    a = randInt(1, L.max) * (Math.random() < 0.5 ? 1 : -1);
    b = Math.random() < 0.2 ? 0 : -Math.sign(a) * randInt(1, L.max);
  } else {
    a = randZ(L, false);
    b = randZ(L, false);
  }
  const sign = a < b ? "<" : a > b ? ">" : "=";
  return {
    instruction: "¿Qué signo va en el hueco (␣)?",
    display: `${z(a)} ␣ ${z(b)}`,
    options: ["<", "=", ">"],
    keepOrder: true,
    correct: sign,
    hint: "En la recta, el mayor es el que está más a la derecha. Entre dos negativos, el más cercano al 0.",
    explain: explicaComparar(a, b),
  };
}

function genOrdenar(L) {
  const vals = new Set();
  const n = L === LEVELS.acs ? 3 : 4;
  while (vals.size < n) vals.add(randZ(L, false));
  const arr = [...vals];
  const sorted = arr.slice().sort((x, y) => x - y);
  const str = (xs) => xs.map(z).join(" < ");
  const correct = str(sorted);
  // Error típico: ordenar por el valor absoluto, sin mirar el signo.
  const porAbs = arr.slice().sort((x, y) => Math.abs(x) - Math.abs(y) || x - y);
  const perms = [str(porAbs), str(sorted.slice().reverse()), str([sorted[1], sorted[0]].concat(sorted.slice(2))), str(sorted.slice(0, -2).concat([sorted[n - 1], sorted[n - 2]]))];
  return {
    instruction: "Ordena de menor a mayor:",
    display: shuffle(arr).map(z).join("   ·   "),
    options: uniqueOptions(correct, perms.filter((p) => p !== correct)),
    correct,
    hint: "Primero los negativos (el más alejado del 0 es el menor), después el 0 y por último los positivos.",
    explain: `En la recta, de izquierda a derecha: ${correct}.${str(porAbs) !== correct ? ` Ordenar sin mirar el signo (${str(porAbs)}) está mal.` : ""}`,
  };
}

function genAbsolutoOpuesto(L) {
  const n = randZ(L);
  if (Math.random() < 0.5) {
    const correct = String(Math.abs(n));
    return {
      instruction: "Calcula el valor absoluto:",
      display: `|${z(n)}|`,
      options: uniqueOptions(correct, [z(-Math.abs(n)), "0", String(Math.abs(n) * 2), String(Math.abs(n) + 1)]),
      correct,
      hint: "El valor absoluto es la distancia hasta el 0: nunca es negativo.",
      explain: `${z(n)} está a ${Math.abs(n)} ${Math.abs(n) === 1 ? "paso" : "pasos"} del 0, así que |${z(n)}| = ${correct}.`,
    };
  }
  const correct = z(-n);
  return {
    instruction: "¿Cuál es el opuesto?",
    display: `Opuesto de ${z(n)}`,
    options: uniqueOptions(correct, [z(n), "0", z(-n + (n > 0 ? -1 : 1)), String(Math.abs(n) * 2)]),
    correct,
    hint: "El opuesto está a la misma distancia del 0, pero al otro lado.",
    explain: `El opuesto de ${z(n)} es ${correct}: los dos están a ${Math.abs(n)} del 0, uno a cada lado. Además, ${zp(n)} + ${zp(-n)} = 0.`,
  };
}

function genSumar(L) {
  let a;
  let b;
  let c = null;
  const tres = L === LEVELS.altas && Math.random() < 0.4;
  do {
    a = randZ(L);
    b = randZ(L);
    if (tres) c = randZ(L);
  } while (a === -b && !tres);
  const r = a + b + (c || 0);
  const correct = z(r);
  const display = `${zp(a)} + ${zp(b)}${c !== null ? ` + ${zp(c)}` : ""}`;
  const cands = [z(-r), z(Math.abs(a) + Math.abs(b) + Math.abs(c || 0)), z(-(Math.abs(a) + Math.abs(b))), z(a - b), z(r + 1), z(r - 1)];
  return {
    instruction: "Calcula la suma:",
    display,
    // Con números pequeños (discalculia, ACS) se da la recta con el punto de salida, sin la flecha, para no dar la solución.
    visual: L.max <= 10 && !tres ? rectaZ(-L.max * 2, L.max * 2, [{ v: a, color: COLOR_A, label: "salida" }]) : undefined,
    options: uniqueOptions(correct, cands),
    correct,
    hint: "Mismo signo: se suman y se deja el signo. Distinto signo: se restan y se deja el signo del que tiene mayor valor absoluto.",
    explain: c === null ? explicaSuma(a, b) : `Primero ${zp(a)} + ${zp(b)} = ${z(a + b)}; después ${zp(a + b)} + ${zp(c)} = ${correct}. También puedes juntar los positivos y los negativos por separado.`,
  };
}

// --- Problemas ---
function genProbTemperatura(L) {
  const inicial = randInt(-Math.min(L.max, 10), Math.min(L.max, 8));
  let cambio;
  do {
    cambio = randInt(-Math.min(L.max, 12), Math.min(L.max, 12));
  } while (cambio === 0);
  const final = inicial + cambio;
  const correct = z(final);
  return {
    instruction: "Lee el problema:",
    display: `A las 7 de la mañana el termómetro marca ${z(inicial)} ºC. A mediodía la temperatura ha ${cambio > 0 ? "subido" : "bajado"} ${Math.abs(cambio)} grados. ¿Qué temperatura hace a mediodía?`,
    options: uniqueOptions(correct, [z(inicial - cambio), z(-final), z(Math.abs(inicial) + Math.abs(cambio)), z(final + 1)]),
    correct,
    hint: `${cambio > 0 ? "Subir" : "Bajar"} ${Math.abs(cambio)} grados es sumar ${zp(cambio)}.`,
    explain: `${zp(inicial)} + ${zp(cambio)} = ${correct} ºC. ${explicaSuma(inicial, cambio)}`,
  };
}

function genProbAscensor(L) {
  const sotanos = Math.min(L.max, 4);
  const inicial = randInt(-sotanos, Math.min(L.max, 10));
  let mov;
  do {
    mov = randInt(-Math.min(L.max, 8), Math.min(L.max, 8));
  } while (mov === 0 || inicial + mov < -sotanos || inicial + mov > Math.min(L.max, 12));
  const final = inicial + mov;
  const nombre = (p) => (p < 0 ? `el sótano ${-p} (${z(p)})` : p === 0 ? "la planta baja (0)" : `el piso ${p}`);
  const correct = z(final);
  return {
    instruction: "Lee el problema:",
    display: `Un ascensor está en ${nombre(inicial)}. ${mov > 0 ? "Sube" : "Baja"} ${Math.abs(mov)} ${Math.abs(mov) === 1 ? "planta" : "plantas"}. ¿En qué planta está ahora? (Los sótanos son negativos y la planta baja es el 0.)`,
    options: uniqueOptions(correct, [z(inicial - mov), z(-final), z(final + (final >= 0 ? 1 : -1)), z(Math.abs(inicial) + Math.abs(mov))]),
    correct,
    hint: `${mov > 0 ? "Subir" : "Bajar"} es sumar ${zp(mov)}.`,
    explain: `${zp(inicial)} + ${zp(mov)} = ${correct}: ${final < 0 ? `el sótano ${-final}` : final === 0 ? "la planta baja" : `el piso ${final}`}.`,
  };
}

function genProbCuenta(L) {
  let saldo;
  let mov;
  do {
    saldo = randInt(-Math.min(L.max * 5, 100), Math.min(L.max * 5, 100));
    mov = randInt(-Math.min(L.max * 5, 80), Math.min(L.max * 5, 80));
  } while (saldo === 0 || mov === 0 || saldo + mov === 0);
  const final = saldo + mov;
  const correct = z(final);
  return {
    instruction: "Lee el problema:",
    display: `La cuenta del club tiene un saldo de ${z(saldo)} €${saldo < 0 ? " (debe dinero)" : ""}. ${mov > 0 ? `Ingresan ${mov}` : `Pagan una factura de ${-mov}`} €. ¿Cuál es el saldo ahora?`,
    options: uniqueOptions(correct, [z(saldo - mov), z(-final), z(Math.abs(saldo) + Math.abs(mov)), z(final + 10), z(final - 10)]),
    correct,
    hint: `${mov > 0 ? "Ingresar es sumar un positivo" : "Pagar es sumar un negativo"}: ${zp(saldo)} + ${zp(mov)}.`,
    explain: `${zp(saldo)} + ${zp(mov)} = ${correct} €. ${final < 0 ? "El saldo es negativo: el club debe dinero." : "El saldo es positivo."}`,
  };
}

function genProbDistancia(L) {
  const a = -randInt(1, Math.min(L.max, 15));
  const b = Math.random() < 0.7 ? randInt(1, Math.min(L.max, 15)) : -randInt(0, -a - 1);
  const dif = b - a;
  const correct = String(dif);
  return {
    instruction: "Lee el problema:",
    display: `En un pueblo de montaña, la temperatura mínima del día fue de ${z(a)} ºC y la máxima de ${z(b)} ºC. ¿Cuántos grados de diferencia hay entre la máxima y la mínima?`,
    options: uniqueOptions(correct, [String(Math.abs(Math.abs(b) - Math.abs(a))), String(Math.abs(a) + Math.abs(b) + 1), z(a + b), String(dif + 2)].filter((x) => x !== "0")),
    correct,
    hint: "Cuenta los pasos en la recta desde la mínima hasta la máxima.",
    explain: b >= 0
      ? `De ${z(a)} al 0 hay ${-a} grados y del 0 a ${z(b)} hay ${b}: ${-a} + ${b} = ${dif} grados.`
      : `Los dos son negativos: de ${z(a)} a ${z(b)} hay ${dif} pasos en la recta (${-a} − ${-b} = ${dif}).`,
  };
}

const MODE_GROUPS = {
  representar: [genRepresentar],
  comparar: [genComparar],
  ordenar: [genOrdenar],
  absoluto: [genAbsolutoOpuesto],
  sumar: [genSumar],
  problemas: [genProbTemperatura, genProbAscensor, genProbCuenta, genProbDistancia],
};

const ACS_GENERATORS = [genRepresentar, genComparar, genComparar, genProbAscensor];

const ENTEROS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Positivos y negativos en la recta y en situaciones (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabajan números del −6 al 6: situarlos en la recta, reconocerlos en situaciones (bajo cero, sótanos) y compararlos, sobre todo positivos con negativos. Sin valor absoluto ni sumas formales.",
    example: "3 > −2 (positivo siempre es mayor que negativo)",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de números enteros, pero con una tipografía más legible para distinguir bien el signo.",
    example: "(−3) + (−4) = −7 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Leer y representar» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todos los contenidos, con números del −10 al 10 y la pista a la vista",
    text: "Se trabajan todos los modos (representar, comparar, ordenar, valor absoluto, sumas y problemas) con números del −10 al 10 y la pista abierta desde el principio. Sin «Mezcla». La recta de Explora ayuda a sumar caminando.",
    example: "(−3) + (+5) → Pista: distinto signo: se restan y se deja el signo del mayor",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Sumas de tres enteros y números más grandes",
    text: "Empieza en <strong>sumar enteros</strong>, con sumas de tres números y valores hasta ±60, y en el resto de modos usa números más grandes.",
    example: "(−25) + (+40) + (−18) = −3",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "|−5| = ? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  renderNumberLine();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, ENTEROS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), ENTEROS_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("ze-num")) initExplore();
  if (document.getElementById("word-display")) initGame(diff, (fn) => restartCallbacks.push(fn));
});

function renderNumberLine() {
  const g = document.getElementById("tickmarks");
  if (!g) return;
  const x0 = 30;
  const x1 = 470;
  const min = -5;
  const max = 5;
  const span = max - min;
  let html = "";
  for (let n = min; n <= max; n++) {
    const x = x0 + ((n - min) / span) * (x1 - x0);
    const isZero = n === 0;
    html += `<line x1="${x}" y1="38" x2="${x}" y2="52" stroke="var(--text)" stroke-width="${isZero ? 2.5 : 1.5}"/>`;
    html += `<text x="${x}" y="72" text-anchor="middle" font-size="14" font-weight="${isZero ? 700 : 400}" fill="${n < 0 ? "var(--color-error)" : "var(--text)"}">${z(n)}</text>`;
  }
  g.innerHTML = html;
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
  const LIM = 10;
  const state = { num: { a: -4 }, comp: { a: -2, b: -6 }, suma: { a: -3, b: 7 } };

  function renderNum() {
    const { a } = state.num;
    document.getElementById("ze-num-a").textContent = z(a);
    const marks = [{ v: a, color: COLOR_A, label: z(a) }];
    if (a !== 0) marks.push({ v: -a, color: COLOR_B, label: z(-a) });
    document.getElementById("ze-num-line").innerHTML = rectaZ(-LIM, LIM, marks);
    const ctx = a < 0 ? `${-a} grados bajo cero, el sótano ${-a} o una deuda de ${-a} €` : a > 0 ? `${a} grados sobre cero, el piso ${a} o tener ${a} € ahorrados` : "la planta baja o 0 grados";
    document.getElementById("ze-num-msg").innerHTML =
      `<p><strong>${z(a)}</strong> se lee «${leerZ(a)}». ${a === 0 ? "El 0 no es positivo ni negativo." : `Es ${a > 0 ? "positivo: está a la derecha del 0" : "negativo: está a la izquierda del 0"}.`}</p>` +
      `<p>Valor absoluto: |${z(a)}| = ${Math.abs(a)} (la distancia hasta el 0).</p>` +
      (a !== 0 ? `<p>Opuesto: <span class="fr-b">${z(-a)}</span>, al otro lado del 0 y a la misma distancia.</p>` : "") +
      `<p>Puede ser: ${ctx}.</p>`;
  }

  function renderComp() {
    const { a, b } = state.comp;
    document.getElementById("ze-comp-a").textContent = z(a);
    document.getElementById("ze-comp-b").textContent = z(b);
    document.getElementById("ze-comp-line").innerHTML = rectaZ(-LIM, LIM, [
      { v: a, color: COLOR_A, label: "A" },
      { v: b, color: COLOR_B, label: "B" },
    ]);
    const sign = a < b ? "<" : a > b ? ">" : "=";
    document.getElementById("ze-comp-msg").innerHTML = `<strong>${z(a)} ${sign} ${z(b)}</strong>. ${explicaComparar(a, b)}`;
  }

  function renderSuma() {
    const { a, b } = state.suma;
    const r = a + b;
    document.getElementById("ze-suma-a").textContent = z(a);
    document.getElementById("ze-suma-b").textContent = zp(b);
    document.getElementById("ze-suma-line").innerHTML = rectaZ(-LIM - 10, LIM + 10, [
      { v: a, color: COLOR_A, label: z(a) },
      { v: r, color: "var(--color-amber)", label: z(r) },
    ], b !== 0 ? { from: a, to: r } : null);
    document.getElementById("ze-suma-msg").innerHTML = `<strong>${zp(a)} + ${zp(b)} = ${z(r)}</strong>. Sales de ${z(a)} y ${b > 0 ? `avanzas ${b} ${b === 1 ? "paso" : "pasos"} a la derecha` : b < 0 ? `retrocedes ${-b} ${-b === 1 ? "paso" : "pasos"} a la izquierda` : "no te mueves"}: llegas a ${z(r)}. ${explicaSuma(a, b, false)}`;
  }

  const renders = { num: renderNum, comp: renderComp, suma: renderSuma };
  document.querySelectorAll("[data-ze]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const g = btn.dataset.ze;
      const k = btn.dataset.key;
      state[g][k] = Math.max(-LIM, Math.min(LIM, state[g][k] + Number(btn.dataset.delta)));
      renders[g]();
    });
  });

  renderNum();
  renderComp();
  renderSuma();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-enteros"),
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
  let mode = "representar";
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

    if (diff.is("altas")) setActiveMode("sumar");
    else if (acs) setActiveMode("representar");
    else if ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla") setActiveMode("representar");

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
    AppProgress.record("numeros-enteros", isCorrect);
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
