// ============================================================
// Propiedades de las operaciones (5º T1 bloque 2 y 6º SdA 1)
// - Explora: la distributiva con un rectángulo de cuadraditos,
//   agrupar para calcular mejor y qué pasa con la resta y la
//   división. No guarda progreso.
// - Práctica: las igualdades se generan al azar y cada pregunta trae
//   su pista y la explicación que se ve al corregir. Solo la práctica
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

function uniqueOptions(correct, candidates, count = 4) {
  const out = [correct];
  for (const c of candidates) {
    if (out.length >= count) break;
    if (c !== undefined && c !== null && c !== "" && !out.includes(c)) out.push(c);
  }
  return out;
}

// Punto de miles, como en el resto de la app.
const miles = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// Tres números distintos entre min y max.
function tresDistintos(min, max) {
  const s = new Set();
  while (s.size < 3) s.add(randInt(min, max));
  return [...s];
}

const PROPS = ["Conmutativa", "Asociativa", "Distributiva", "Elemento neutro"];

// ------------------------------------------------------------
// Niveles
// ------------------------------------------------------------
const LEVELS = {
  normal: { max: 12, props: ["conm", "asoc", "dist", "neutro"], resta: false },
  facil: { max: 9, props: ["conm", "asoc", "dist", "neutro"], resta: false },
  acs: { max: 9, props: ["conm", "neutro"], resta: false },
  altas: { max: 25, props: ["conm", "asoc", "dist", "neutro"], resta: true },
};

// Valor de una expresión con +, −, × y paréntesis (para descartar
// opciones falsas que, por casualidad, valen lo mismo).
function valor(expr) {
  const js = expr.replace(/×/g, "*").replace(/−/g, "-");
  return /^[\d\s()+\-*]+$/.test(js) ? Function(`return (${js})`)() : NaN;
}

// Una igualdad que muestra una propiedad.
function igualdad(L, tipo) {
  const [a, b, c] = tresDistintos(2, L.max);
  const op = pick(["+", "×"]);
  if (tipo === "conm") return { texto: `${a} ${op} ${b} = ${b} ${op} ${a}`, nombre: "Conmutativa", porque: `se cambia el orden de los ${op === "+" ? "sumandos" : "factores"} y el resultado no cambia (${miles(op === "+" ? a + b : a * b)})` };
  if (tipo === "asoc") {
    const v = op === "+" ? a + b + c : a * b * c;
    return { texto: `(${a} ${op} ${b}) ${op} ${c} = ${a} ${op} (${b} ${op} ${c})`, nombre: "Asociativa", porque: `se agrupan los ${op === "+" ? "sumandos" : "factores"} de otra manera y el resultado no cambia (${miles(v)})` };
  }
  if (tipo === "dist") {
    if (L.resta && Math.random() < 0.4) {
      const [x, y] = [Math.max(b, c), Math.min(b, c)];
      return { texto: `${a} × (${x} − ${y}) = ${a} × ${x} − ${a} × ${y}`, nombre: "Distributiva", porque: `se multiplica el ${a} por cada número del paréntesis (${miles(a * (x - y))})` };
    }
    return { texto: `${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × ${c}`, nombre: "Distributiva", porque: `se multiplica el ${a} por cada sumando del paréntesis (${miles(a * (b + c))})` };
  }
  return op === "+"
    ? { texto: `${a} + 0 = ${a}`, nombre: "Elemento neutro", porque: "sumar 0 no cambia el número: el 0 es el elemento neutro de la suma" }
    : { texto: `${a} × 1 = ${a}`, nombre: "Elemento neutro", porque: "multiplicar por 1 no cambia el número: el 1 es el elemento neutro de la multiplicación" };
}

// ------------------------------------------------------------
// Generadores
// ------------------------------------------------------------
function genIdentificar(L) {
  const tipo = pick(L.props);
  const ig = igualdad(L, tipo);
  const nombres = L === LEVELS.acs ? ["Conmutativa", "Elemento neutro", "Asociativa"] : PROPS;
  return {
    instruction: "¿Qué propiedad se usa en esta igualdad?",
    display: ig.texto,
    options: nombres.slice(),
    keepOrder: true,
    correct: ig.nombre,
    hint: "Conmutativa: cambia el orden. Asociativa: cambian los paréntesis. Distributiva: un número multiplica a una suma. Elemento neutro: sumar 0 o multiplicar por 1.",
    explain: `Es la propiedad ${ig.nombre.toLowerCase()}: ${ig.porque}.`,
  };
}

function genCompletar(L) {
  const [a, b, c] = tresDistintos(2, L.max);
  const tipo = pick(L.props);
  let display;
  let correct;
  let porque;
  if (tipo === "conm") {
    const op = pick(["+", "×"]);
    display = `${a} ${op} ${b} = ${b} ${op} ___`;
    correct = a;
    porque = "Conmutativa: los mismos números en otro orden.";
  } else if (tipo === "asoc") {
    const op = pick(["+", "×"]);
    display = `(${a} ${op} ${b}) ${op} ${c} = ${a} ${op} (___ ${op} ${c})`;
    correct = b;
    porque = "Asociativa: los mismos números, agrupados de otra manera.";
  } else if (tipo === "dist") {
    if (Math.random() < 0.5) {
      display = `${a} × (${b} + ${c}) = ${a} × ${b} + ___ × ${c}`;
      correct = a;
    } else {
      display = `${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × ___`;
      correct = c;
    }
    porque = `Distributiva: el ${a} multiplica a cada sumando.`;
  } else {
    const suma = Math.random() < 0.5;
    display = suma ? `${a} + ___ = ${a}` : `${a} × ___ = ${a}`;
    correct = suma ? 0 : 1;
    porque = suma ? "El 0 es el elemento neutro de la suma." : "El 1 es el elemento neutro de la multiplicación (multiplicar por 0 da 0).";
  }
  return {
    instruction: "¿Qué número falta?",
    display,
    options: uniqueOptions(String(correct), [a, b, c, 0, 1, a + b, a * b].map(String)),
    correct: String(correct),
    hint: "Las propiedades no cambian los números: solo el orden, la forma de agruparlos o cómo se reparte la multiplicación.",
    explain: `Falta el ${correct}. ${porque}`,
  };
}

// ¿Verdadero o falso? Incluye lo que NO se cumple (resta y división).
function genVerdad(L) {
  const [a, b, c] = tresDistintos(2, L.max);
  const casos = [];
  // Verdaderas
  casos.push(() => {
    const ig = igualdad(L, pick(L.props));
    return { texto: ig.texto, v: true, por: `Es verdad: propiedad ${ig.nombre.toLowerCase()}.` };
  });
  // Falsas
  const [x, y] = [Math.max(a, b), Math.min(a, b)];
  casos.push(() => ({ texto: `${x} − ${y} = ${y} − ${x}`, v: false, por: `Es falso: la resta no es conmutativa. ${x} − ${y} = ${x - y}, pero ${y} − ${x} no se puede hacer con números naturales.` }));
  casos.push(() => {
    const d = randInt(2, 4);
    const n = d * randInt(2, 5);
    return { texto: `${n} ÷ ${d} = ${d} ÷ ${n}`, v: false, por: `Es falso: la división no es conmutativa. ${n} ÷ ${d} = ${n / d}, pero ${d} ÷ ${n} ni siquiera es un número natural.` };
  });
  if (L !== LEVELS.acs) {
    casos.push(() => ({ texto: `${a} × (${b} + ${c}) = ${a} × ${b} + ${c}`, v: false, por: `Es falso: el ${a} tiene que multiplicar a los dos sumandos. ${a} × (${b} + ${c}) = ${miles(a * (b + c))}, y ${a} × ${b} + ${c} = ${miles(a * b + c)}.` }));
    casos.push(() => {
      // (x − y) − z frente a x − (y − z), con y > z para que se pueda.
      const [p, q, r] = [a + b + c, Math.max(b, c), Math.min(b, c)];
      return { texto: `(${p} − ${q}) − ${r} = ${p} − (${q} − ${r})`, v: false, por: `Es falso: la resta no es asociativa. (${p} − ${q}) − ${r} = ${p - q - r} y ${p} − (${q} − ${r}) = ${p - (q - r)}.` };
    });
    casos.push(() => ({ texto: `${a} × 0 = ${a}`, v: false, por: `Es falso: cualquier número multiplicado por 0 da 0. El elemento neutro de la multiplicación es el 1.` }));
  } else {
    casos.push(() => ({ texto: `${a} + 1 = ${a}`, v: false, por: `Es falso: ${a} + 1 = ${a + 1}. El número que no cambia nada al sumar es el 0.` }));
  }
  // Mitad verdaderas, mitad falsas.
  const caso = Math.random() < 0.5 ? casos[0]() : pick(casos.slice(1))();
  return {
    instruction: "¿Es verdadera o falsa esta igualdad?",
    display: caso.texto,
    options: ["Verdadera", "Falsa"],
    keepOrder: true,
    correct: caso.v ? "Verdadera" : "Falsa",
    hint: "Calcula los dos lados. Recuerda: la suma y la multiplicación son conmutativas y asociativas; la resta y la división, no.",
    explain: caso.por,
  };
}

function genDistributiva(L) {
  let a;
  let b;
  let c;
  do [a, b, c] = tresDistintos(2, L.max);
  while (b * c === b + c);
  const tipo = randInt(1, L === LEVELS.facil ? 2 : 3);
  if (tipo === 1) {
    const correct = `${a} × ${b} + ${a} × ${c}`;
    return {
      instruction: "¿Qué es igual a esta multiplicación?",
      display: `${a} × (${b} + ${c})`,
      options: uniqueOptions(correct, [`${a} × ${b} + ${c}`, `${a} × ${b} × ${c}`, `${a} + ${b} × ${c}`, `${a} × ${b} + ${b} × ${c}`].filter((x) => valor(x) !== a * (b + c))),
      correct,
      hint: `El ${a} multiplica a cada número del paréntesis.`,
      explain: `${a} × (${b} + ${c}) = ${correct} = ${a * b} + ${a * c} = ${miles(a * (b + c))}. Fíjate: ${a} × ${b} + ${c} = ${miles(a * b + c)}, no es lo mismo.`,
    };
  }
  if (tipo === 2) {
    const correct = `${a} × (${b} + ${c})`;
    return {
      instruction: "Saca factor común: ¿qué es igual a esta suma?",
      display: `${a} × ${b} + ${a} × ${c}`,
      options: uniqueOptions(correct, [`${a} × ${b} × ${c}`, `(${a} + ${a}) × (${b} + ${c})`, `${a} + (${b} + ${c})`, `${a} × ${b} + ${c}`].filter((x) => valor(x) !== a * (b + c))),
      correct,
      hint: `El ${a} se repite en los dos sumandos: sale fuera y multiplica a (${b} + ${c}).`,
      explain: `${a} × ${b} + ${a} × ${c} = ${correct} = ${a} × ${b + c} = ${miles(a * (b + c))}. Es la propiedad distributiva al revés: «sacar factor común».`,
    };
  }
  // Multiplicar descomponiendo: 7 × 13 = 7 × (10 + 3).
  const k = randInt(3, 9);
  let n;
  do n = randInt(11, L === LEVELS.altas ? 49 : 29);
  while (n % 10 === 0);
  const d = Math.floor(n / 10) * 10;
  const u = n - d;
  const v = k * n;
  return {
    instruction: `Calcula ${k} × ${n} descomponiendo el ${n} en ${d} + ${u}:`,
    display: `${k} × ${n} = ${k} × (${d} + ${u})`,
    options: uniqueOptions(String(v), [k * d + u, k * d, k * u + d, v + k, v - k].filter((x) => x !== v).map(String)),
    correct: String(v),
    hint: `${k} × ${d} + ${k} × ${u}.`,
    explain: `${k} × (${d} + ${u}) = ${k} × ${d} + ${k} × ${u} = ${k * d} + ${k * u} = ${v}.`,
  };
}

// Cálculo mental usando las propiedades.
function genCalculo(L) {
  const tipo = randInt(1, L === LEVELS.facil ? 2 : 3);
  if (tipo === 1) {
    // x + y + z con x + z redondo.
    const redondo = L === LEVELS.facil ? 10 : pick([100, 100, 50]);
    const x = randInt(Math.ceil(redondo * 0.1), Math.floor(redondo * 0.9));
    const z = redondo - x;
    const y = randInt(L === LEVELS.facil ? 2 : 11, L === LEVELS.facil ? 9 : 89);
    if (x === z || y === x || y === z) return genCalculo(L);
    const v = x + y + z;
    return {
      instruction: "Calcula de cabeza (busca la pareja que suma un número redondo):",
      display: `${x} + ${y} + ${z}`,
      options: uniqueOptions(String(v), [String(v + 10), String(v - 10), String(v + 1), String(v - 1)]),
      correct: String(v),
      hint: `Junta primero ${x} + ${z}.`,
      explain: `Por las propiedades conmutativa y asociativa: ${x} + ${z} = ${redondo}, y ${redondo} + ${y} = ${v}.`,
    };
  }
  if (tipo === 2) {
    const [p, q] = pick(L === LEVELS.facil ? [[5, 2]] : [[25, 4], [5, 2], [50, 2], [20, 5], [25, 4]]);
    const k = randInt(3, L === LEVELS.altas ? 19 : 9);
    if (k === p || k === q) return genCalculo(L);
    const v = p * k * q;
    const orden = shuffle([p, k, q]);
    if (orden[1] !== k && Math.random() < 0.5) [orden[0], orden[1]] = [orden[1], orden[0]];
    return {
      instruction: "Calcula de cabeza (busca la pareja que da 10 o 100):",
      display: orden.join(" × "),
      options: uniqueOptions(miles(v), [v * 10, v / 10, v + p * q, v - k].filter(Number.isInteger).map(miles)),
      correct: miles(v),
      hint: `Multiplica primero ${p} × ${q}.`,
      explain: `Por las propiedades conmutativa y asociativa: ${p} × ${q} = ${p * q}, y ${p * q} × ${k} = ${miles(v)}.`,
    };
  }
  // k × 99, k × 11, k × 21 con la distributiva.
  const [m, base, ajuste] = pick([[99, 100, -1], [11, 10, 1], [21, 20, 1], [19, 20, -1], [101, 100, 1]]);
  const k = randInt(3, L === LEVELS.altas ? 25 : 9);
  const v = k * m;
  return {
    instruction: "Calcula de cabeza con la propiedad distributiva:",
    display: `${k} × ${m}`,
    options: uniqueOptions(miles(v), [k * base, k * base + (ajuste > 0 ? -k : k), v + 1, v - 1, k * base + ajuste].map(miles)),
    correct: miles(v),
    hint: `${m} = ${base} ${ajuste > 0 ? "+" : "−"} 1.`,
    explain: `${k} × ${m} = ${k} × (${base} ${ajuste > 0 ? "+" : "−"} 1) = ${miles(k * base)} ${ajuste > 0 ? "+" : "−"} ${k} = ${miles(v)}.`,
  };
}

function genProblema(L) {
  const peque = L === LEVELS.acs || L === LEVELS.facil;
  const a = randInt(3, peque ? 5 : 9);
  let b;
  let c;
  do {
    b = randInt(2, peque ? 6 : 12);
    c = randInt(2, peque ? 6 : 12);
  } while (b === c);
  const ctx = pick([
    { t: `Una caja de bombones tiene ${a} filas de ${b} bombones de chocolate negro y ${a} filas de ${c} bombones de chocolate blanco. ¿Cuántos bombones hay?`, u: "bombones" },
    { t: `Para la clase se compran ${a} cuadernos a ${b} € y ${a} carpetas a ${c} €. ¿Cuánto se paga en total?`, u: "€" },
    { t: `En el huerto escolar hay ${a} filas con ${b} lechugas y ${c} tomateras en cada fila. ¿Cuántas plantas hay?`, u: "plantas" },
  ]);
  const v = a * (b + c);
  return {
    instruction: "Lee el problema:",
    display: ctx.t,
    options: uniqueOptions(String(v), [String(a * b + c), String(a + b + c), String(a * b), String(a * b * c)]),
    correct: String(v),
    hint: `Se puede hacer de dos formas: ${a} × ${b} + ${a} × ${c}, o ${a} × (${b} + ${c}).`,
    explain: `${a} × (${b} + ${c}) = ${a} × ${b + c} = ${v} ${ctx.u}. También ${a} × ${b} + ${a} × ${c} = ${a * b} + ${a * c} = ${v}: es la propiedad distributiva.`,
  };
}

const MODE_GROUPS = {
  identificar: [genIdentificar],
  completar: [genCompletar],
  verdad: [genVerdad],
  distributiva: [genDistributiva],
  calculo: [genCalculo],
  problemas: [genProblema],
};

const ACS_GENERATORS = [genIdentificar, genCompletar, genVerdad, genProblema];

const PROPIEDADES_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Conmutativa y elemento neutro (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja que <strong>en la suma y la multiplicación se puede cambiar el orden</strong> (y en la resta y la división no), que sumar 0 o multiplicar por 1 no cambia nada, y problemas sencillos.",
    example: "3 + 5 = 5 + 3 · 7 × 1 = 7 · 9 − 2 ≠ 2 − 9",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantienen las mismas propiedades, pero con una tipografía más legible para leer las igualdades.",
    example: "4 + 7 = 7 + 4 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «¿Qué propiedad es?» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todas las propiedades, con números hasta el 9 y la pista a la vista",
    text: "Se trabajan todos los modos con números hasta el 9 y la pista abierta desde el principio. Sin «Mezcla». En Explora, el rectángulo de cuadraditos ayuda a ver la distributiva.",
    example: "3 × (4 + 2) → Pista: el 3 multiplica a cada número del paréntesis",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Cálculo mental con las propiedades y números mayores",
    text: "Empieza en <strong>Cálculo mental</strong> (25 × 13 × 4, 17 × 99…), incluye la distributiva con la resta y usa números hasta el 25.",
    example: "17 × 99 = 17 × 100 − 17 = 1.683",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Qué propiedad se usa? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, PROPIEDADES_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), PROPIEDADES_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("pr-rect")) initExplore();
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
  // 1. Rectángulo de a filas y (b + c) columnas.
  const R = { a: 3, b: 4, c: 2, girado: false };
  function renderRect() {
    const { a, b, c, girado } = R;
    ["a", "b", "c"].forEach((k) => (document.getElementById(`pr-rect-${k}`).textContent = R[k]));
    const filas = girado ? b + c : a;
    const cols = girado ? a : b + c;
    const S = Math.min(26, Math.floor(260 / Math.max(filas, cols)));
    let out = "";
    for (let f = 0; f < filas; f++) {
      for (let k = 0; k < cols; k++) {
        const parteB = girado ? f < b : k < b;
        out += `<rect x="${k * S + 2}" y="${f * S + 2}" width="${S - 2}" height="${S - 2}" rx="3" fill="${parteB ? "var(--color-teal-tint)" : "var(--color-amber-tint)"}" stroke="${parteB ? "var(--color-teal)" : "var(--color-amber)"}" stroke-width="1.5"/>`;
      }
    }
    document.getElementById("pr-rect-draw").innerHTML = `<svg viewBox="0 0 ${cols * S + 4} ${filas * S + 4}" width="${cols * S + 4}" style="max-width:100%" role="img" aria-label="Rectángulo de ${filas} por ${cols} cuadraditos">${out}</svg>`;
    const total = a * (b + c);
    document.getElementById("pr-rect-msg").innerHTML =
      `<p><strong>${a} × (${b} + ${c}) = ${a} × ${b + c} = ${total}</strong> cuadraditos.</p>` +
      `<p>Contando cada color: <span class="pr-b">${a} × ${b}</span> + <span class="pr-c">${a} × ${c}</span> = <span class="pr-b">${a * b}</span> + <span class="pr-c">${a * c}</span> = ${total}. Es la propiedad <strong>distributiva</strong>.</p>` +
      (girado ? `<p>Girado, son ${b + c} filas de ${a}: (${b} + ${c}) × ${a} = ${total}. El orden de los factores no cambia el resultado: propiedad <strong>conmutativa</strong>.</p>` : "");
  }
  document.querySelectorAll("[data-pr]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const k = btn.dataset.key;
      R[k] = Math.max(1, Math.min(k === "a" ? 8 : 6, R[k] + Number(btn.dataset.delta)));
      renderRect();
    })
  );
  document.getElementById("pr-rect-girar").addEventListener("click", () => {
    R.girado = !R.girado;
    renderRect();
  });

  // 2. Agrupar para calcular mejor (asociativa y conmutativa).
  const EJ = [
    [25, "×", 7, 4],
    [38, "+", 47, 62],
    [5, "×", 13, 2],
    [16, "+", 29, 84],
    [50, "×", 9, 2],
    [75, "+", 18, 25],
  ];
  let ej = 0;
  let agr = 0;
  function calc(x, op, y) {
    return op === "+" ? x + y : x * y;
  }
  function renderAgr() {
    const [x, op, y, z] = EJ[ej];
    const formas = [
      { t: `(${x} ${op} ${y}) ${op} ${z}`, p1: `${x} ${op} ${y} = ${calc(x, op, y)}`, p2: `${calc(x, op, y)} ${op} ${z}` },
      { t: `${x} ${op} (${y} ${op} ${z})`, p1: `${y} ${op} ${z} = ${calc(y, op, z)}`, p2: `${x} ${op} ${calc(y, op, z)}` },
      { t: `(${x} ${op} ${z}) ${op} ${y}`, p1: `${x} ${op} ${z} = ${calc(x, op, z)}`, p2: `${calc(x, op, z)} ${op} ${y}` },
    ];
    const cont = document.getElementById("pr-agr-opciones");
    cont.innerHTML = "";
    formas.forEach((f, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `btn btn-secondary${i === agr ? " active" : ""}`;
      b.textContent = f.t;
      b.addEventListener("click", () => {
        agr = i;
        renderAgr();
      });
      cont.appendChild(b);
    });
    document.getElementById("pr-agr-expr").textContent = `${x} ${op} ${y} ${op} ${z}`;
    const total = calc(calc(x, op, y), op, z);
    const f = formas[agr];
    document.getElementById("pr-agr-msg").innerHTML =
      `<p>${f.p1}; después ${f.p2} = <strong>${total}</strong>.</p>` +
      (agr === 2
        ? `<p>¡Esta es la más fácil! ${x} ${op} ${z} da un número redondo. Se puede cambiar el orden (conmutativa) y agrupar como queramos (asociativa): el resultado es siempre ${total}.</p>`
        : `<p>El resultado es el mismo con cualquier agrupación. Prueba a juntar el ${x} con el ${z}.</p>`);
  }
  document.getElementById("pr-agr-otro").addEventListener("click", () => {
    ej = (ej + 1) % EJ.length;
    agr = 0;
    renderAgr();
  });

  // 3. ¿Y con la resta y la división?
  const Q = { a: 12, b: 4 };
  function renderRD() {
    const { a, b } = Q;
    document.getElementById("pr-rd-a").textContent = a;
    document.getElementById("pr-rd-b").textContent = b;
    const resta = (x, y) => (x >= y ? `${x} − ${y} = ${x - y}` : `${x} − ${y}: no se puede con números naturales`);
    const divi = (x, y) => (x % y === 0 ? `${x} ÷ ${y} = ${x / y}` : `${x} ÷ ${y}: no es exacta (cociente ${Math.floor(x / y)}, resto ${x % y})`);
    const iguales = a === b;
    document.getElementById("pr-rd-msg").innerHTML =
      `<p>${a} + ${b} = ${a + b} y ${b} + ${a} = ${a + b} ✔ · ${a} × ${b} = ${a * b} y ${b} × ${a} = ${a * b} ✔</p>` +
      `<p>${resta(a, b)} · ${resta(b, a)}</p>` +
      `<p>${divi(a, b)} · ${divi(b, a)}</p>` +
      `<p>${iguales ? "Con dos números iguales da lo mismo, pero en general no:" : ""} la suma y la multiplicación son conmutativas; <strong>la resta y la división no</strong>.</p>`;
  }
  document.querySelectorAll("[data-pr-rd]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const k = btn.dataset.prRd;
      Q[k] = Math.max(1, Math.min(30, Q[k] + Number(btn.dataset.delta)));
      renderRD();
    })
  );

  renderRect();
  renderAgr();
  renderRD();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-propiedades"),
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
    els.modeBtns.forEach((b) => {
      b.disabled = acs || (b.dataset.mode === "mezcla" && (diff.is("tdah") || diff.is("discalculia")));
    });

    if (diff.is("altas")) setActiveMode("calculo");
    else if (acs) setActiveMode("identificar");
    else if ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla") setActiveMode("identificar");

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
    AppProgress.record("propiedades-operaciones", isCorrect);
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
