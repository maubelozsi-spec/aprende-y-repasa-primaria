// ============================================================
// Porcentajes
// - Explora: la cuadrícula del 100, el porcentaje de una cantidad con
//   una barra partida en trozos del 10% y rebajas e impuestos. No
//   guarda progreso: es para entender, no para puntuar.
// - Práctica: las preguntas se generan al azar y cada una trae su
//   pista y la explicación que se ve al corregir. Solo la práctica
//   llama a AppProgress.
// Las cantidades se eligen para que los resultados sean exactos, y se
// calculan en centésimas enteras (sin errores de coma flotante).
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

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

// Número en centésimas enteras → texto con coma, sin ceros finales.
function fmtC(c) {
  const ent = Math.floor(c / 100);
  const dec = c % 100;
  if (dec === 0) return String(ent);
  return dec % 10 === 0 ? `${ent},${dec / 10}` : `${ent},${String(dec).padStart(2, "0")}`;
}

// Euros: siempre con dos decimales si no son exactos (12,50 €).
function eur(c) {
  return c % 100 === 0 ? String(c / 100) : `${Math.floor(c / 100)},${String(c % 100).padStart(2, "0")}`;
}

function answerValue(s) {
  const t = String(s).replace("%", "").trim();
  const f = t.match(/^(\d+)\/(\d+)$/);
  if (f) return Number(f[1]) / Number(f[2]);
  const m = t.match(/^(\d+)(?:,(\d+))?$/);
  if (!m) return NaN;
  return Number(m[1] + "." + (m[2] || "0")) * (String(s).includes("%") ? 1000 : 1);
}

// Opciones distintas por texto y por valor (los % se comparan entre sí).
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

// ------------------------------------------------------------
// Niveles: porcentajes y cantidades «redondas» para cada uno.
// ------------------------------------------------------------
const LEVELS = {
  normal: { pcts: [5, 10, 15, 20, 25, 30, 40, 50, 60, 75], maxCant: 400 },
  facil: { pcts: [10, 25, 50], maxCant: 100 },
  acs: { pcts: [10, 50], maxCant: 100 },
  altas: { pcts: [5, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75, 80, 90], maxCant: 1000 },
};

// Cantidad entera para la que el p% sale entero. Si es «redonda», además
// es múltiplo de 10 (en 5º: 25% de 80, no 25% de 272).
function cantidadPara(p, maxCant, min = 10, redonda = true) {
  const base = 100 / gcd(p, 100);
  const paso = redonda ? (base * 10) / gcd(base, 10) : base;
  const k = Math.max(1, Math.ceil(min / paso));
  return paso * randInt(k, Math.max(k, Math.floor(maxCant / paso)));
}

const NOMBRES_PC = ["Ana", "Lucía", "Mario", "Pablo", "Marta", "Diego", "Sara", "Hugo", "Elena", "Noa"];

const DE_CABEZA = {
  50: "la mitad: divide entre 2",
  25: "la cuarta parte: divide entre 4",
  75: "tres cuartas partes: divide entre 4 y multiplica por 3",
  10: "la décima parte: divide entre 10",
  20: "el 10% por 2",
  5: "la mitad del 10%",
  30: "el 10% por 3",
  40: "el 10% por 4",
  60: "el 10% por 6",
  15: "el 10% más la mitad del 10%",
};

function explicaPorcentaje(p, c) {
  const r = (p * c) / 100;
  const atajo = DE_CABEZA[p] ? ` De cabeza: el ${p}% es ${DE_CABEZA[p]}.` : "";
  return `${p}% de ${c} = ${c} × ${p} : 100 = ${c * p} : 100 = ${r}.${atajo}`;
}

// ------------------------------------------------------------
// Generadores (5º)
// ------------------------------------------------------------
// Milésimas enteras → texto (para el error típico 25% → 0,025).
function fmtMil(m) {
  const ent = Math.floor(m / 1000);
  const dec = String(m % 1000).padStart(3, "0").replace(/0+$/, "");
  return dec ? `${ent},${dec}` : String(ent);
}

function genRelacion(L) {
  const tipo = randInt(1, 3);
  const p = L === LEVELS.acs ? pick([10, 20, 30, 40, 50, 60, 70, 80, 90]) : pick([3, 5, 8, 12, 15, 20, 25, 30, 40, 45, 50, 60, 75, 80, 90]);
  const decimal = fmtC(p); // p centésimas: 8 → 0,08; 50 → 0,5
  if (tipo === 1) {
    return {
      instruction: "Escribe el porcentaje como número decimal:",
      display: `${p}%`,
      options: uniqueOptions(decimal, [fmtC(p * 10), fmtMil(p), String(p)]),
      correct: decimal,
      hint: "Un porcentaje es una parte de 100: divide entre 100 (la coma se mueve dos lugares a la izquierda).",
      explain: `${p}% = ${p}/100 = ${p} : 100 = ${decimal}.${p < 10 ? ` Cuidado: ${p}% no es 0,${p}, porque 0,${p} son ${p} décimas, es decir, ${p * 10}%.` : ""}`,
    };
  }
  if (tipo === 2) {
    const correct = `${p}%`;
    return {
      instruction: "Escribe el número decimal como porcentaje:",
      display: decimal,
      options: uniqueOptions(correct, [`${fmtC(p * 10)}%`, `${p * 10}%`, `${decimal}%`, p % 10 === 0 ? `${p / 10}%` : `${p + 10}%`]),
      correct,
      hint: "Multiplica por 100: la coma se mueve dos lugares a la derecha.",
      explain: `${decimal} × 100 = ${p}, así que ${decimal} = ${p}%.${p % 10 === 0 ? ` Ayuda pensar en centésimas: ${decimal} = 0,${String(p).padStart(2, "0")} = ${p} centésimas.` : ""}`,
    };
  }
  const correct = `${p}/100`;
  return {
    instruction: "Escribe el porcentaje como fracción:",
    display: `${p}%`,
    options: uniqueOptions(correct, [`${p}/10`, `1/${p}`, `100/${p}`, `${p}/1000`]),
    correct,
    hint: "«Por ciento» quiere decir «de cada 100».",
    explain: `${p}% quiere decir ${p} de cada 100: ${correct}. En la cuadrícula del 100 son ${p} cuadraditos coloreados.`,
  };
}

function genCabeza(L) {
  const p = pick(L === LEVELS.acs ? [10, 50] : L === LEVELS.facil ? [10, 25, 50] : [5, 10, 20, 25, 50, 75]);
  const c = cantidadPara(p, Math.min(L.maxCant, 200), 20);
  const r = (p * c) / 100;
  return {
    instruction: "Calcula de cabeza:",
    display: `${p}% de ${c}`,
    options: uniqueOptions(String(r), [String(c / 10), String(c / 2), String(c / 4), String(r * 2), String(c - r), String(p)].filter((x) => Number.isInteger(Number(x)))),
    correct: String(r),
    hint: `El ${p}% es ${DE_CABEZA[p]}.`,
    explain: `El ${p}% es ${DE_CABEZA[p]}: ${p}% de ${c} = ${r}.`,
  };
}

function genPorcentajeDe(L) {
  const p = pick(L.pcts);
  const c = cantidadPara(p, L.maxCant, 20, L !== LEVELS.altas);
  const r = (p * c) / 100;
  return {
    instruction: "Calcula el resultado:",
    display: `${p}% de ${c}`,
    options: uniqueOptions(String(r), [String(p), String(c - r), String(r * 10), String(c / 10), String(r + c / 10), c > p ? String(c - p) : null].filter((x) => x && Number.isInteger(Number(x)))),
    correct: String(r),
    hint: `Multiplica ${c} × ${p} y divide entre 100. O calcula primero el 10% (${c} : 10).`,
    explain: explicaPorcentaje(p, c),
  };
}

function genAumentoDisminucion(L) {
  const p = pick(L.pcts.filter((x) => x <= 50 || L === LEVELS.altas));
  const c = cantidadPara(p, L.maxCant, 20, L !== LEVELS.altas);
  const cambio = (p * c) / 100;
  const sube = Math.random() < 0.5;
  const r = sube ? c + cambio : c - cambio;
  return {
    instruction: "Calcula el resultado:",
    display: `${sube ? "Aumentar" : "Disminuir"} ${c} un ${p}%`,
    options: uniqueOptions(String(r), [String(sube ? c + p : c - p), String(cambio), String(sube ? c - cambio : c + cambio), String(r + 10)].filter((x) => Number(x) > 0)),
    correct: String(r),
    hint: `Calcula el ${p}% de ${c} y ${sube ? "súmalo" : "réstalo"}.`,
    explain: `${p}% de ${c} = ${cambio}. ${c} ${sube ? "+" : "−"} ${cambio} = ${r}.${p !== cambio ? ` No es ${c} ${sube ? "+" : "−"} ${p}: el ${p}% de ${c} no son ${p}.` : ""}`,
  };
}

// --- Problemas (5º): el mercado medieval (reto del Tema 9) ---
const PUESTOS = [
  ["una espada de madera", "€"],
  ["un escudo pintado", "€"],
  ["una bolsa de especias", "€"],
  ["un tarro de miel", "€"],
  ["una capa de lana", "€"],
  ["un libro de leyendas", "€"],
];

function genProbMercado(L) {
  const [objeto] = pick(PUESTOS);
  const p = pick(L.pcts.filter((x) => x <= 50 || L === LEVELS.altas));
  const precio = cantidadPara(p, Math.min(L.maxCant, 120), 10);
  const cambio = (p * precio) / 100;
  const desc = Math.random() < 0.6;
  const final = desc ? precio - cambio : precio + cambio;
  return {
    instruction: "Lee el problema:",
    display: desc
      ? `En el mercado medieval, ${objeto} cuesta ${precio} € y tiene un descuento del ${p}%. ¿Cuánto hay que pagar?`
      : `En el mercado medieval, ${objeto} cuesta ${precio} € más un impuesto del ${p}%. ¿Cuánto hay que pagar en total?`,
    options: uniqueOptions(String(final), [String(desc ? precio - p : precio + p), String(cambio), String(desc ? precio + cambio : precio - cambio), String(final + 5)].filter((x) => Number(x) > 0)),
    correct: String(final),
    hint: `Primero calcula el ${p}% de ${precio} €.`,
    explain: `${p}% de ${precio} = ${cambio} €. ${precio} ${desc ? "−" : "+"} ${cambio} = ${final} €.${desc ? ` Fíjate: pagas el ${100 - p}% del precio.` : ""}`,
  };
}

function genProbClase(L) {
  const total = pick(L === LEVELS.acs ? [10, 20] : [20, 25, 50]);
  const ps = [10, 20, 40, 50, 60, 80].concat(total === 25 ? [] : [30, 70]).filter((p) => (p * total) % 100 === 0);
  const p = pick(L === LEVELS.acs ? [10, 50] : ps);
  const r = (p * total) / 100;
  const cosa = pick(["lleva gafas", "va al comedor", "juega al fútbol", "toca un instrumento"]);
  return {
    instruction: "Lee el problema:",
    display: `En una clase de ${total} alumnos, el ${p}% ${cosa}. ¿Cuántos alumnos son?`,
    options: uniqueOptions(String(r), [String(p), String(total - r), String(r * 2), String(r + 1)].filter((x) => Number(x) > 0 && Number(x) <= total)),
    correct: String(r),
    hint: `Calcula el ${p}% de ${total}.`,
    explain: explicaPorcentaje(p, total),
  };
}

// ------------------------------------------------------------
// 6º: fracción, decimal y porcentaje; qué porcentaje es
// ------------------------------------------------------------
const TRIPLETAS = [[1, 2, 50], [1, 4, 25], [3, 4, 75], [1, 5, 20], [2, 5, 40], [3, 5, 60], [4, 5, 80], [1, 10, 10], [3, 10, 30], [7, 10, 70], [9, 10, 90], [1, 20, 5], [3, 20, 15], [1, 25, 4], [1, 50, 2]];

function genFraccionPorcentaje(L) {
  const [n, d, p] = pick(TRIPLETAS);
  if (Math.random() < 0.5) {
    const correct = `${p}%`;
    return {
      instruction: "Escribe la fracción como porcentaje:",
      display: `${n}/${d}`,
      options: uniqueOptions(correct, [`${d}%`, `${n}%`, `${n * 10}%`, `${100 - p}%`]),
      correct,
      hint: `Busca una fracción equivalente con denominador 100: ¿por cuánto multiplicas ${d} para llegar a 100?`,
      explain: `${n}/${d} = ${p}/100 (multiplicando por ${100 / d}) = ${p}%.`,
    };
  }
  const correct = `${n}/${d}`;
  return {
    instruction: "Escribe el porcentaje como fracción irreducible:",
    display: `${p}%`,
    options: uniqueOptions(correct, [`${p}/10`, `1/${p}`, `${d}/${n}`, `${n}/${d + 1}`]),
    correct,
    hint: `Escribe ${p}% como ${p}/100 y simplifica.`,
    explain: `${p}% = ${p}/100 = ${correct} (dividiendo entre ${100 / d}).`,
  };
}

function genQuePorcentaje(L) {
  const p = pick([5, 10, 20, 25, 30, 40, 50, 60, 75, 80]);
  const total = cantidadPara(p, 200, 20);
  const parte = (p * total) / 100;
  const correct = `${p}%`;
  return {
    instruction: "Lee el problema:",
    display: `De ${total} alumnos del colegio, ${parte} van en bici. ¿Qué porcentaje va en bici?`,
    options: uniqueOptions(correct, [`${parte}%`, `${100 - p}%`, p % 2 === 0 ? `${p / 2}%` : null, `${Math.min(95, p + 10)}%`]),
    correct,
    hint: "Divide la parte entre el total y multiplica por 100.",
    explain: `${parte} : ${total} = ${fmtC((parte * 100) / total)} → × 100 = ${p}%. ${parte !== p ? `No es ${parte}%: ${parte} es la cantidad de alumnos, no el porcentaje.` : ""}`,
  };
}

const MODE_GROUPS = {
  relacion: [genRelacion],
  cabeza: [genCabeza],
  porcentajedenum: [genPorcentajeDe],
  aumentodisminucion: [genAumentoDisminucion],
  problemas: [genProbMercado, genProbMercado, genProbClase],
  fraccion: [genFraccionPorcentaje],
  sexto: [genQuePorcentaje],
};
// Libro de 5º: relación entre fracción, decimal y porcentaje. «¿Qué
// porcentaje es?» queda para 6º y fuera de la mezcla.
const MEZCLA = ["relacion", "cabeza", "porcentajedenum", "aumentodisminucion", "problemas", "fraccion"];

const ACS_GENERATORS = [genCabeza, genCabeza, genRelacion, genProbClase];

const PORCENTAJES_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "El 50% y el 10% (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja calcular el 50% (dividir entre 2) y el 10% (dividir entre 10) de números sencillos, qué significa un porcentaje y problemas de la clase.",
    example: "50% de 20 → 20 : 2 = 10",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de porcentajes, pero con una tipografía más legible para leer las preguntas y los problemas.",
    example: "20% de 50 = 10 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Qué es un porcentaje» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Los mismos contenidos de 5º, con el 10%, el 25% y el 50% y la pista a la vista",
    text: "Se trabajan todos los modos de 5º (también descuentos e impuestos) con porcentajes que se calculan de cabeza, cantidades hasta 100 y la pista abierta. Sin «Mezcla» ni los contenidos de 6º. La cuadrícula y la barra de Explora ayudan a ver cada porcentaje.",
    example: "25% de 40 → Pista: el 25% es la cuarta parte: divide entre 4",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Fracción, decimal y porcentaje, y porcentajes menos redondos",
    text: "Empieza en <strong>pasar de fracción a porcentaje y calcular qué porcentaje es</strong>, y en el resto de modos usa porcentajes como el 12% o el 35% y cantidades hasta 1000.",
    example: "3/5 = 60% · 18 de 24 → 75%",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "25% = ? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, PORCENTAJES_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), PORCENTAJES_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("pc-grid")) initExplore();
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
function fraccionIrreducible(p) {
  const g = gcd(p, 100);
  return `${p / g}/${100 / g}`;
}

// Barra de 10 trozos (cada uno el 10%), con los primeros `p` por cien coloreados.
function barraPorcentaje(total, p, clsResto = "") {
  let out = '<div class="pc-bar-track">';
  for (let i = 0; i < 10; i++) {
    const relleno = Math.max(0, Math.min(10, p - i * 10)) * 10;
    out += `<div class="pc-seg${relleno === 100 ? " llena" : ""}${clsResto}"><div class="pc-fill" style="width:${relleno}%"></div><span>${fmtC(total * 10)}</span></div>`;
  }
  return out + "</div>";
}

function initExplore() {
  const state = { grid: { p: 25 }, cant: { c: 80, p: 25 }, reb: { c: 60, p: 20, tipo: "desc" } };
  const LIMITS = { grid: { p: [0, 100] }, cant: { c: [10, 500], p: [0, 100] }, reb: { c: [10, 300], p: [5, 50] } };

  function renderGrid() {
    const { p } = state.grid;
    document.getElementById("pc-grid-p").textContent = `${p}%`;
    let cells = "";
    for (let i = 0; i < 100; i++) cells += `<span class="de-cell${i < p ? " on" : ""}"></span>`;
    document.getElementById("pc-grid-cells").innerHTML = cells;
    const dec = p === 100 ? "1" : p % 10 === 0 ? `0,${p / 10}` : `0,${String(p).padStart(2, "0")}`;
    document.getElementById("pc-grid-msg").innerHTML =
      `<p><strong>${p}%</strong> = ${p} de cada 100 cuadraditos.</p>` +
      `<p>Como fracción: ${p}/100${gcd(p, 100) > 1 && p > 0 ? ` = ${fraccionIrreducible(p)}` : ""}.</p>` +
      `<p>Como decimal: ${dec}.</p>` +
      (p === 100 ? "<p>El 100% es todo.</p>" : p === 50 ? "<p>Es justo la mitad.</p>" : p === 25 ? "<p>Es la cuarta parte.</p>" : p === 75 ? "<p>Son tres cuartas partes.</p>" : "");
  }

  function renderCant() {
    const { c, p } = state.cant;
    document.getElementById("pc-cant-c").textContent = c;
    document.getElementById("pc-cant-p").textContent = `${p}%`;
    document.getElementById("pc-cant-bar").innerHTML = barraPorcentaje(c, p);
    const r100 = c * p; // en centésimas
    const decimo = c * 10;
    document.getElementById("pc-cant-msg").innerHTML =
      `La barra son ${c} (el 100%). Cada trozo es el 10%: ${c} : 10 = <strong>${fmtC(decimo)}</strong>. ` +
      `El ${p}% son ${p % 10 === 0 ? `${p / 10} ${p / 10 === 1 ? "trozo" : "trozos"}` : `${Math.floor(p / 10)} ${Math.floor(p / 10) === 1 ? "trozo" : "trozos"} y medio`}: <strong>${p}% de ${c} = ${fmtC(r100)}</strong>. ` +
      `Por escrito: ${c} × ${p} : 100 = ${fmtC(r100)}.`;
  }

  function renderReb() {
    const { c, p, tipo } = state.reb;
    document.getElementById("pc-reb-c").textContent = `${c} €`;
    document.getElementById("pc-reb-p").textContent = `${p}%`;
    const cambio = c * p; // en céntimos
    const desc = tipo === "desc";
    const final = desc ? c * 100 - cambio : c * 100 + cambio;
    document.getElementById("pc-reb-bar").innerHTML =
      `<div class="pc-reb-row"><span class="pc-reb-label">Precio</span>${barraPorcentaje(c, 100)}</div>` +
      `<div class="pc-reb-row"><span class="pc-reb-label">${desc ? "Pagas" : "Pagas"}</span>${barraPorcentaje(c, desc ? 100 - p : 100)}${desc ? "" : `<span class="pc-extra">+ ${eur(cambio)} €</span>`}</div>`;
    document.getElementById("pc-reb-msg").innerHTML = desc
      ? `Descuento: ${p}% de ${c} € = ${eur(cambio)} €. Pagas ${c} − ${eur(cambio)} = <strong>${eur(final)} €</strong>, que es el ${100 - p}% del precio.`
      : `Impuesto: ${p}% de ${c} € = ${eur(cambio)} €. Pagas ${c} + ${eur(cambio)} = <strong>${eur(final)} €</strong>, que es el ${100 + p}% del precio.`;
  }

  const renders = { grid: renderGrid, cant: renderCant, reb: renderReb };
  document.querySelectorAll("[data-pc]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const g = btn.dataset.pc;
      const k = btn.dataset.key;
      const [min, max] = LIMITS[g][k];
      state[g][k] = Math.min(max, Math.max(min, state[g][k] + Number(btn.dataset.delta)));
      renders[g]();
    });
  });
  document.querySelectorAll("#pc-reb-tipo [data-pc-tipo]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#pc-reb-tipo [data-pc-tipo]").forEach((b) => b.classList.toggle("active", b === btn));
      state.reb.tipo = btn.dataset.pcTipo;
      renderReb();
    });
  });

  renderGrid();
  renderCant();
  renderReb();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-porcentajes"),
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
  let mode = "relacion";
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
      b.disabled = acs || (disc && (m === "sexto" || m === "mezcla")) || (m === "mezcla" && diff.is("tdah"));
    });

    if (diff.is("altas")) setActiveMode("sexto");
    else if (acs) setActiveMode("cabeza");
    else if (disc && (mode === "sexto" || mode === "mezcla")) setActiveMode("relacion");
    else if (diff.is("tdah") && mode === "mezcla") setActiveMode("relacion");

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function generatorsFor() {
    if (diff.is("acs")) return ACS_GENERATORS;
    if (mode === "mezcla") return MODE_GROUPS[pick(MEZCLA)];
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
    AppProgress.record("porcentajes", isCorrect);
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
