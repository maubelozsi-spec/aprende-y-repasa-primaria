// ============================================================
// Proporcionalidad y escalas (6º SdA 9 «Arquitectos responsables»:
// situaciones proporcionales y no proporcionales, tablas de
// proporcionalidad y escalas; reto: el plano de un edificio a escala)
// - Explora: la tabla y la gráfica de una relación proporcional (y la
//   de un taxi, que no lo es) y un plano a escala. No guarda progreso.
// - Práctica: las situaciones, las tablas y las escalas se generan al
//   azar y cada pregunta trae su pista y su explicación. Solo la
//   práctica llama a AppProgress.
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

// 1234,5 → "1.234,5"
function fmt(n) {
  const r = Math.round(n * 100) / 100;
  const [ent, dec] = String(Math.abs(r)).split(".");
  const conPuntos = ent.length > 3 ? ent.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ent;
  return `${r < 0 ? "−" : ""}${conPuntos}${dec ? `,${dec}` : ""}`;
}
// Euros: con dos decimales si los hay (2,50 €).
function euros(n) {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? `${fmt(r)}\u00a0€` : `${fmt(r).replace(/,(\d)$/, ",$10")}\u00a0€`;
}

// Opciones numéricas con unidad, positivas y sin repetir.
function opciones(correct, valores, f) {
  return uniqueOptions(f(correct), valores.filter((v) => v > 0 && Number.isFinite(v) && Math.abs(v - correct) > 1e-9).map(f));
}

// ------------------------------------------------------------
// Situaciones (magnitudes y su constante)
// ------------------------------------------------------------
// Proporcionales: magnitud A, su unidad, magnitud B, constantes posibles,
// formato de B y la frase con dos parejas de valores.
const PROPORCIONALES = [
  { a: "kg de naranjas", u: "kg", b: "€", k: [1.5, 2, 3], fb: euros, par: (x1, y1, x2, y2) => `${fmt(x1)} kg de naranjas cuestan ${euros(y1)} y ${fmt(x2)} kg cuestan ${euros(y2)}` },
  { a: "entradas de cine", u: "entrada", b: "€", k: [5, 6, 7], fb: euros, par: (x1, y1, x2, y2) => `${x1} entradas de cine cuestan ${euros(y1)} y ${x2} entradas cuestan ${euros(y2)}` },
  { a: "horas a velocidad constante", u: "hora", b: "km", k: [60, 80, 90], fb: (v) => `${fmt(v)} km`, par: (x1, y1, x2, y2) => `Un coche recorre ${fmt(y1)} km en ${x1} h y ${fmt(y2)} km en ${x2} h` },
  { a: "páginas a ritmo constante", u: "página", b: "min", k: [2, 3, 4], fb: (v) => `${fmt(v)} min`, par: (x1, y1, x2, y2) => `Marta lee ${x1} páginas en ${y1} min y ${x2} páginas en ${y2} min` },
  { a: "botes de pintura", u: "bote", b: "m²", k: [8, 10, 12], fb: (v) => `${fmt(v)} m²`, par: (x1, y1, x2, y2) => `Con ${x1} botes de pintura se pintan ${y1} m² y con ${x2} botes, ${y2} m²` },
  { a: "personas (receta)", u: "persona", b: "g de arroz", k: [80, 100, 120], fb: (v) => `${fmt(v)} g`, par: (x1, y1, x2, y2) => `Para ${x1} personas se usan ${fmt(y1)} g de arroz y para ${x2} personas, ${fmt(y2)} g` },
];

// No proporcionales, con su porqué.
const NO_PROPORCIONALES = [
  (L) => {
    const fijo = pick([2, 3, 4]);
    const km = L.enteros ? pick([1, 2]) : pick([1, 1.5, 2]);
    const [x1, x2] = [2, 4];
    return { txt: `Un taxi cobra ${euros(fijo)} al subir y ${euros(km)} por cada km: 2 km cuestan ${euros(fijo + km * x1)} y 4 km cuestan ${euros(fijo + km * x2)}`, por: `el doble de km no cuesta el doble (${euros(fijo + km * x1)} × 2 = ${euros(2 * (fijo + km * x1))}, no ${euros(fijo + km * x2)}): hay una parte fija, la bajada de bandera` };
  },
  () => ({ txt: "Con 5 años Lucía medía 110 cm y con 10 años mide 140 cm", por: "al doblar la edad no se dobla la altura" }),
  () => {
    const p = pick([1, 2, 3]);
    return { txt: `Con la oferta «3 × 2», 2 yogures cuestan ${euros(2 * p)} y 3 yogures también cuestan ${euros(2 * p)}`, por: "con la oferta, una unidad más no cuesta más" };
  },
  () => ({ txt: "Un coche a 50 km/h tarda 2 h en un viaje y a 100 km/h tarda 1 h", por: "al doblar la velocidad el tiempo no se dobla, se reduce a la mitad" }),
  () => ({ txt: "A las 8:00 hacía 12 °C y a las 16:00 hacía 20 °C", por: "la temperatura no depende de la hora de forma proporcional: al doblar la hora no se dobla la temperatura" }),
  () => {
    const cuota = pick([10, 15, 20]);
    return { txt: `Un gimnasio cobra ${euros(cuota)} de matrícula más 20 € al mes: 1 mes cuesta ${euros(cuota + 20)} y 2 meses cuestan ${euros(cuota + 40)}`, por: `2 meses no cuestan el doble que 1 (${euros(2 * (cuota + 20))}), por la matrícula` };
  },
];

// ------------------------------------------------------------
// Niveles
// ------------------------------------------------------------
const LEVELS = {
  normal: { enteros: false, factores: [2, 3, 4, 5, 6, 7, 8] },
  facil: { enteros: true, factores: [2, 3, 4] },
  acs: { enteros: true, factores: [2, 3] },
  altas: { enteros: false, factores: [3, 5, 6, 7, 9, 12, 15], altas: true },
};

function situacion(L) {
  const s = pick(PROPORCIONALES);
  const k = L.enteros ? pick(s.k.filter(Number.isInteger)) : pick(s.k);
  return { ...s, k };
}

// ------------------------------------------------------------
// Dibujo: tabla
// ------------------------------------------------------------
function tablaHTML(titA, titB, filas, hueco = null) {
  const celda = (v, i, col) => (hueco && hueco[0] === i && hueco[1] === col ? '<td class="pp-hueco">?</td>' : `<td>${v}</td>`);
  return `<div class="po-tabla-wrap"><table class="rules-table pp-tabla"><tr><th>${titA}</th>${filas.map((f, i) => celda(f[0], i, 0)).join("")}</tr><tr><th>${titB}</th>${filas.map((f, i) => celda(f[1], i, 1)).join("")}</tr></table></div>`;
}

// ------------------------------------------------------------
// Generadores
// ------------------------------------------------------------
function genEsProporcional(L) {
  if (Math.random() < 0.5) {
    const s = situacion(L);
    const x1 = randInt(2, 3);
    const f = pick(L.factores);
    const x2 = x1 * f;
    return {
      instruction: "¿Es una relación de proporcionalidad?",
      display: `${s.par(x1, x1 * s.k, x2, x2 * s.k)}.`,
      options: ["Sí", "No"],
      keepOrder: true,
      correct: "Sí",
      hint: "Mira si al multiplicar una cantidad por un número, la otra se multiplica por el mismo número.",
      explain: `Sí: ${x1} × ${f} = ${x2} y ${s.fb(x1 * s.k)} × ${f} = ${s.fb(x2 * s.k)}. Las dos se multiplican por ${f}. A cada ${s.u} le corresponde siempre lo mismo: ${s.fb(s.k)}.`,
    };
  }
  const n = pick(NO_PROPORCIONALES)(L);
  return {
    instruction: "¿Es una relación de proporcionalidad?",
    display: `${n.txt}.`,
    options: ["Sí", "No"],
    keepOrder: true,
    correct: "No",
    hint: "Mira si al multiplicar una cantidad por un número, la otra se multiplica por el mismo número.",
    explain: `No: ${n.por}.`,
  };
}

// ¿Es de proporcionalidad esta tabla?
function genTablaEs(L) {
  const s = situacion(L);
  const xs = shuffle([1, 2, 3, 4, 5, 6, 8, 10]).slice(0, 4).sort((a, b) => a - b);
  const si = Math.random() < 0.5;
  let ys = xs.map((x) => x * s.k);
  let cambio = null;
  if (!si) {
    // Una casilla rompe la constante: el error de sumar en vez de multiplicar.
    const i = randInt(1, 3);
    ys = ys.slice();
    ys[i] = ys[i - 1] + (xs[i] - xs[i - 1]) + (s.k === 1 ? 1 : 0);
    if (Math.abs(ys[i] - xs[i] * s.k) < 1e-9) ys[i] += 1;
    cambio = i;
  }
  return {
    instruction: "¿Es una tabla de proporcionalidad?",
    display: si ? "Sí" : "No",
    visual: tablaHTML(s.a[0].toUpperCase() + s.a.slice(1), s.b, xs.map((x, i) => [fmt(x), fmt(ys[i])])),
    soloVisual: true,
    options: ["Sí", "No"],
    keepOrder: true,
    correct: si ? "Sí" : "No",
    hint: "Divide cada número de abajo entre el de arriba. Si siempre sale lo mismo, es de proporcionalidad.",
    explain: si
      ? `Sí: ${xs.map((x, i) => `${fmt(ys[i])} : ${fmt(x)} = ${fmt(s.k)}`).join("; ")}. Siempre sale ${fmt(s.k)}: es la constante de proporcionalidad.`
      : `No: ${fmt(ys[0])} : ${fmt(xs[0])} = ${fmt(s.k)}, así que, si fuera proporcional, debajo de ${fmt(xs[cambio])} iría ${fmt(xs[cambio])} × ${fmt(s.k)} = ${fmt(xs[cambio] * s.k)}, no ${fmt(ys[cambio])}. Se ha sumado en vez de multiplicar.`,
  };
}

// Completar una tabla de proporcionalidad.
function genTabla(L) {
  const s = situacion(L);
  const xs = shuffle(L.enteros ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 8, 10, 12]).slice(0, 4).sort((a, b) => a - b);
  const ys = xs.map((x) => x * s.k);
  const i = randInt(1, 3);
  const arriba = !L.enteros && Math.random() < 0.3;
  const correct = arriba ? xs[i] : ys[i];
  const f = fmt;
  const cands = arriba ? [xs[i] + 1, xs[i] * 2, ys[i] - xs[i], xs[i] - 1] : [ys[i - 1] + (xs[i] - xs[i - 1]), ys[i] + s.k, ys[i] - s.k, xs[i] + s.k, ys[i] * 2];
  return {
    instruction: "Completa la tabla de proporcionalidad: ¿qué número va en el hueco?",
    display: f(correct),
    visual: tablaHTML(s.a[0].toUpperCase() + s.a.slice(1), s.b, xs.map((x, j) => [fmt(x), fmt(ys[j])]), [i, arriba ? 0 : 1]),
    soloVisual: true,
    options: opciones(correct, cands, f),
    correct: f(correct),
    hint: "Busca la constante: divide un número de abajo entre el de arriba. Luego multiplica (o divide) por ella.",
    explain: arriba
      ? `La constante es ${fmt(ys[0])} : ${fmt(xs[0])} = ${fmt(s.k)}. Arriba va ${fmt(ys[i])} : ${fmt(s.k)} = ${fmt(xs[i])}.`
      : `La constante es ${fmt(ys[0])} : ${fmt(xs[0])} = ${fmt(s.k)}. Abajo va ${fmt(xs[i])} × ${fmt(s.k)} = ${fmt(ys[i])}.${i > 0 ? ` No vale sumar lo mismo que arriba: ${fmt(ys[i - 1])} + ${fmt(xs[i] - xs[i - 1])} = ${fmt(ys[i - 1] + xs[i] - xs[i - 1])}.` : ""}`,
  };
}

// Problemas de proporcionalidad (reducción a la unidad / regla de tres).
function genProblema(L) {
  const s = situacion(L);
  let x1;
  let x2;
  do {
    x1 = randInt(2, L.enteros ? 4 : 8);
    x2 = randInt(2, L.enteros ? 8 : 15);
  } while (x1 === x2);
  const y1 = x1 * s.k;
  const y2 = x2 * s.k;
  const pregunta = {
    "kg de naranjas": `Si ${fmt(x1)} kg de naranjas cuestan ${euros(y1)}, ¿cuánto cuestan ${fmt(x2)} kg?`,
    "entradas de cine": `Si ${x1} entradas de cine cuestan ${euros(y1)}, ¿cuánto cuestan ${x2} entradas?`,
    "horas a velocidad constante": `Un coche a velocidad constante recorre ${fmt(y1)} km en ${x1} h. ¿Cuántos km recorre en ${x2} h?`,
    "páginas a ritmo constante": `Leyendo al mismo ritmo, ${x1} páginas se leen en ${y1} min. ¿Cuánto se tarda en leer ${x2} páginas?`,
    "botes de pintura": `Con ${x1} botes de pintura se pintan ${y1} m². ¿Cuántos m² se pintan con ${x2} botes?`,
    "personas (receta)": `Para ${x1} personas se usan ${y1} g de arroz. ¿Cuántos gramos hacen falta para ${x2} personas?`,
  }[s.a];
  return {
    instruction: "Resuelve el problema:",
    display: pregunta,
    // Errores típicos: sumar la diferencia, multiplicar sin dividir, invertir la división.
    options: opciones(y2, [y1 + (x2 - x1), y1 * x2, (y1 * x1) / x2, y2 + s.k, y2 - s.k].filter((v) => v >= 1 && Number.isInteger(v * (s.b === "€" && !L.enteros ? 100 : 1))), s.fb),
    correct: s.fb(y2),
    hint: "Calcula primero lo que corresponde a 1 (divide) y después multiplica por la cantidad que te piden.",
    explain: `Para 1: ${s.fb(y1)} : ${x1} = ${s.fb(s.k)}. Para ${x2}: ${s.fb(s.k)} × ${x2} = ${s.fb(y2)}. (Con regla de tres: ${x2} × ${fmt(y1)} : ${x1} = ${fmt(y2)}.)`,
  };
}

const ESCALAS = [50, 100, 200, 500, 1000];

// m o km a partir de cm, sin decimales raros.
function realTexto(cm) {
  if (cm >= 100000) return `${fmt(cm / 100000)} km`;
  if (cm >= 100) return `${fmt(cm / 100)} m`;
  return `${fmt(cm)} cm`;
}

function genEscala(L) {
  const facil = L.enteros;
  const tipo = pick(facil ? ["real", "real", "plano"] : ["real", "real", "plano", "cual", "mapa"]);
  if (tipo === "real") {
    const e = facil ? pick([10, 100]) : pick(ESCALAS);
    const p = facil ? randInt(2, 9) : pick([randInt(2, 15), randInt(2, 9) + 0.5]);
    const cm = p * e;
    const cosa = e <= 10 ? "En el dibujo de un mueble a escala 1:10, una mesa" : e <= 100 ? `En el plano de una casa a escala 1:${e}, una sala` : e <= 200 ? `En el plano de un colegio a escala 1:${e}, el patio` : `En el plano de un barrio a escala 1:${e}, un parque`;
    return {
      instruction: "Resuelve el problema de escala:",
      display: `${cosa} mide ${fmt(p)} cm de largo. ¿Cuánto mide de verdad?`,
      options: opciones(cm, [p * e * 10, (p * e) / 10, (p * e) / 100, (p + 1) * e].filter((v) => v >= 1 && !(facil && realTexto(v).includes(","))), realTexto),
      correct: realTexto(cm),
      hint: `1:${e} quiere decir que 1 cm del plano son ${fmt(e)} cm de verdad.${cm >= 100 ? " Después pasa los cm a metros (: 100)." : ""}`,
      explain: `${fmt(p)} × ${fmt(e)} = ${fmt(cm)} cm${cm >= 100 ? ` = ${realTexto(cm)}` : ""}.`,
    };
  }
  if (tipo === "plano") {
    const e = facil ? 100 : pick(ESCALAS);
    const p = facil ? randInt(2, 9) : randInt(2, 20);
    const m = (p * e) / 100;
    return {
      instruction: "Resuelve el problema de escala:",
      display: `Queremos dibujar a escala 1:${e} un muro que mide ${fmt(m)} m. ¿Cuántos centímetros medirá en el plano?`,
      // Errores: no pasar a cm, multiplicar en vez de dividir, un cero de más.
      options: opciones(p, [p * 10, m, m * 100, p + 1].filter((v) => Number.isInteger(v) || !facil), (v) => `${fmt(v)} cm`),
      correct: `${fmt(p)} cm`,
      hint: `Pasa los metros a centímetros (× 100) y divide entre ${fmt(e)}.`,
      explain: `${fmt(m)} m = ${fmt(m * 100)} cm. ${fmt(m * 100)} : ${fmt(e)} = ${fmt(p)} cm en el plano.`,
    };
  }
  if (tipo === "cual") {
    const e = pick(ESCALAS);
    const p = randInt(2, 12);
    const m = (p * e) / 100;
    const correct = `1:${e}`;
    return {
      instruction: "¿A qué escala está el plano?",
      display: `${e <= 100 ? "Una habitación" : e <= 200 ? "Un patio" : "Un parque"} de ${fmt(m)} m de largo mide ${p} cm en el plano.`,
      options: uniqueOptions(correct, ESCALAS.filter((x) => x !== e).map((x) => `1:${x}`).concat([`1:${fmt(m)}`])),
      correct,
      hint: "Pasa la medida real a centímetros y mira cuántas veces cabe la medida del plano.",
      explain: `${fmt(m)} m = ${fmt(m * 100)} cm. ${fmt(m * 100)} : ${p} = ${fmt(e)}: cada cm del plano son ${fmt(e)} cm reales, escala ${correct}.`,
    };
  }
  // Mapas: 1:50.000, 1:100.000…
  const e = pick([25000, 50000, 100000, 200000]);
  const p = e === 25000 ? pick([4, 6, 8, 10, 12]) : randInt(2, 12);
  const cm = p * e;
  return {
    instruction: "Resuelve el problema de escala:",
    display: `En un mapa a escala 1:${fmt(e)}, dos pueblos están a ${p} cm. ¿Qué distancia hay de verdad?`,
    options: opciones(cm, [cm * 10, cm / 10, cm / 100], realTexto),
    correct: realTexto(cm),
    hint: "Multiplica por la escala y pasa los centímetros a kilómetros: 1 km = 100.000 cm.",
    explain: `${p} × ${fmt(e)} = ${fmt(cm)} cm = ${realTexto(cm)} (se divide entre 100.000).`,
  };
}

// Ampliación (altas): proporcionalidad inversa.
function genInversa() {
  const casos = [
    () => {
      const a = randInt(2, 4);
      const b = a * pick([2, 3]);
      const d = b * randInt(2, 5);
      return { txt: `${a} pintores tardan ${d} días en pintar un colegio. Trabajando igual, ¿cuántos días tardarían ${b} pintores?`, sol: (a * d) / b, u: "días", exp: `Es proporcionalidad inversa: más pintores, menos días. ${a} × ${d} = ${a * d} días de trabajo de un pintor; ${a * d} : ${b} = ${(a * d) / b} días.` };
    },
    () => {
      let v;
      let t;
      let v2;
      do {
        v = pick([40, 50, 60]);
        t = pick([2, 3, 4, 6]);
        v2 = v * pick([2, 3]);
      } while (!Number.isInteger(((v * t) / v2) * 2));
      return { txt: `Un autobús a ${v} km/h tarda ${t} h en un viaje. ¿Cuánto tardaría a ${v2} km/h?`, sol: (v * t) / v2, u: "h", exp: `Proporcionalidad inversa: a más velocidad, menos tiempo. Distancia: ${v} × ${t} = ${v * t} km; ${v * t} : ${v2} = ${fmt((v * t) / v2)} h.` };
    },
  ];
  const c = pick(casos)();
  return {
    instruction: "Ampliación · proporcionalidad inversa:",
    display: c.txt,
    options: opciones(c.sol, [c.sol * 4, c.sol * 2, c.sol + 2, c.sol / 2].filter((x) => Number.isInteger(x * 2)), (v) => `${fmt(v)} ${c.u}`),
    correct: `${fmt(c.sol)} ${c.u}`,
    hint: "Aquí, si una cantidad se multiplica por 2, la otra se divide entre 2.",
    explain: c.exp,
  };
}

const MODE_GROUPS = {
  esproporcional: [genEsProporcional, genEsProporcional, genTablaEs],
  tablas: [genTabla],
  problemas: [genProblema],
  escalas: [genEscala],
};

const ACS_GENERATORS = [genEsProporcional, genTabla, genProblema, genEscala];

const PROPORCIONALIDAD_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "El doble y el triple, con números enteros (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja reconocer si al doble le corresponde el doble, completar tablas sencillas con precios enteros, problemas de «si 1 vale…» y escalas 1:10 y 1:100.",
    example: "1 entrada → 5 €; 3 entradas → 15 €",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantienen las mismas situaciones, pero con una tipografía más legible para leer los enunciados y las tablas.",
    example: "Si 3 kg cuestan 6 €… → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «¿Es proporcional?» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todos los contenidos, con números enteros y la pista a la vista",
    text: "Se trabajan todos los modos con constantes enteras (sin céntimos), tablas cortas y escalas 1:10 y 1:100, con la pista abierta desde el principio. Sin «Mezcla». En Explora se ve la tabla y la gráfica.",
    example: "2 kg → 6 €; 5 kg → ? Pista: primero 1 kg (6 : 2 = 3 €)",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Escalas de mapas, hallar la escala y proporcionalidad inversa",
    text: "Empieza en <strong>Escalas</strong>, con mapas (1:50.000), averiguar la escala de un plano, cantidades con decimales y, como ampliación, problemas de proporcionalidad inversa.",
    example: "3 pintores tardan 12 días → 6 pintores tardan 6 días",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Es proporcional? → elige Sí o No",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, PROPORCIONALIDAD_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), PROPORCIONALIDAD_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("pp-tabla")) initExplore();
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
// Gráfica de puntos: (x, f(x)) para x = 0..6.
function svgGrafica(f, color, etiquetaY) {
  const W = 300;
  const H = 210;
  const m = { l: 40, b: 30, t: 12, r: 12 };
  const xs = [0, 1, 2, 3, 4, 5, 6];
  const ymax = Math.ceil(Math.max(...xs.map(f)) / 10) * 10 || 10;
  const X = (x) => m.l + (x / 6) * (W - m.l - m.r);
  const Y = (y) => H - m.b - (y / ymax) * (H - m.b - m.t);
  let out = `<line x1="${m.l}" y1="${H - m.b}" x2="${W - m.r}" y2="${H - m.b}" stroke="var(--text)" stroke-width="2"/><line x1="${m.l}" y1="${H - m.b}" x2="${m.l}" y2="${m.t}" stroke="var(--text)" stroke-width="2"/>`;
  xs.forEach((x) => {
    out += `<text x="${X(x)}" y="${H - m.b + 16}" text-anchor="middle" font-size="11" fill="var(--text-muted)">${x}</text>`;
  });
  [0, 0.5, 1].forEach((p) => {
    const v = ymax * p;
    out += `<text x="${m.l - 6}" y="${Y(v) + 4}" text-anchor="end" font-size="11" fill="var(--text-muted)">${v}</text>`;
  });
  out += `<polyline points="${xs.map((x) => `${X(x).toFixed(1)},${Y(f(x)).toFixed(1)}`).join(" ")}" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="5 4"/>`;
  xs.forEach((x) => {
    out += `<circle cx="${X(x).toFixed(1)}" cy="${Y(f(x)).toFixed(1)}" r="5" fill="${color}"/>`;
  });
  out += `<text x="${m.l + 4}" y="${m.t + 4}" font-size="11" font-weight="700" fill="var(--text)">${etiquetaY}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="Gráfica de la relación">${out}</svg>`;
}

function initExplore() {
  const lim = (v, a, z) => Math.max(a, Math.min(z, v));

  // 1. Tabla y gráfica: proporcional o con parte fija (taxi).
  let k = 3;
  let taxi = false;
  function renderTabla() {
    document.getElementById("pp-k").textContent = euros(k);
    document.getElementById("pp-taxi").textContent = taxi ? "Ver sin bajada de bandera" : "Añadir 3 € de bajada de bandera";
    const f = (x) => (taxi ? 3 + k * x : k * x);
    const xs = [1, 2, 3, 4, 5];
    document.getElementById("pp-tabla-draw").innerHTML = tablaHTML("km", "€", xs.map((x) => [x, fmt(f(x))]));
    document.getElementById("pp-graf-draw").innerHTML = svgGrafica(f, taxi ? "var(--color-rose)" : "var(--color-teal)", "€");
    document.getElementById("pp-tabla-msg").innerHTML = taxi
      ? `<strong>No es proporcional</strong>: 2 km cuestan ${euros(f(2))}, pero 4 km no cuestan el doble (${euros(2 * f(2))}), sino ${euros(f(4))}. La gráfica no sale del 0 porque hay una parte fija.`
      : `<strong>Es proporcional</strong>: cada km cuesta ${euros(k)}, así que el precio dividido entre los km siempre da ${fmt(k)} (la constante). Los puntos están en una recta que sale del 0.`;
  }
  document.querySelectorAll("[data-pp-k]").forEach((b) => b.addEventListener("click", () => { k = lim(k + Number(b.dataset.ppK), 1, 9); renderTabla(); }));
  document.getElementById("pp-taxi").addEventListener("click", () => { taxi = !taxi; renderTabla(); });

  // 2. El plano a escala.
  const escalas = [50, 100, 200];
  let ie = 1;
  let ancho = 6;
  let largo = 4;
  function renderPlano() {
    const e = escalas[ie];
    document.getElementById("pp-e").textContent = `1:${e}`;
    document.getElementById("pp-ancho").textContent = `${ancho} m`;
    document.getElementById("pp-largo").textContent = `${largo} m`;
    const pa = (ancho * 100) / e;
    const pl = (largo * 100) / e;
    const px = 30;
    const W = Math.ceil(pa) * px + 60;
    const H = Math.ceil(pl) * px + 50;
    let out = `<rect x="40" y="20" width="${pa * px}" height="${pl * px}" fill="var(--color-indigo-tint)"/>`;
    for (let i = 0; i <= Math.ceil(pa); i++) out += `<line x1="${40 + i * px}" y1="20" x2="${40 + i * px}" y2="${20 + Math.ceil(pl) * px}" stroke="var(--border-strong)"/>`;
    for (let j = 0; j <= Math.ceil(pl); j++) out += `<line x1="40" y1="${20 + j * px}" x2="${40 + Math.ceil(pa) * px}" y2="${20 + j * px}" stroke="var(--border-strong)"/>`;
    out += `<rect x="40" y="20" width="${pa * px}" height="${pl * px}" fill="none" stroke="var(--color-indigo)" stroke-width="3"/>`;
    out += `<text x="${40 + (pa * px) / 2}" y="${20 + pl * px + 18}" text-anchor="middle" font-size="12" font-weight="800" fill="var(--text)">${fmt(pa)} cm</text>`;
    out += `<text x="34" y="${20 + (pl * px) / 2 + 4}" text-anchor="end" font-size="12" font-weight="800" fill="var(--text)">${fmt(pl)} cm</text>`;
    document.getElementById("pp-plano-draw").innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${Math.min(W, 320)}" style="max-width:100%" role="img" aria-label="Sala dibujada a escala">${out}</svg>`;
    document.getElementById("pp-plano-msg").innerHTML = `A escala <strong>1:${e}</strong>, 1 cm del plano son ${e} cm = ${fmt(e / 100)} m reales. La sala de ${ancho} m × ${largo} m se dibuja de <strong>${fmt(pa)} cm × ${fmt(pl)} cm</strong> (${ancho * 100} : ${e} y ${largo * 100} : ${e}). Cada cuadradito es 1 cm.`;
  }
  document.querySelectorAll("[data-pp-e]").forEach((b) => b.addEventListener("click", () => { ie = lim(ie + Number(b.dataset.ppE), 0, escalas.length - 1); renderPlano(); }));
  document.querySelectorAll("[data-pp-ancho]").forEach((b) => b.addEventListener("click", () => { ancho = lim(ancho + Number(b.dataset.ppAncho), 1, 10); renderPlano(); }));
  document.querySelectorAll("[data-pp-largo]").forEach((b) => b.addEventListener("click", () => { largo = lim(largo + Number(b.dataset.ppLargo), 1, 8); renderPlano(); }));

  renderTabla();
  renderPlano();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-proporcionalidad"),
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
  let mode = "esproporcional";
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

    if (diff.is("altas")) setActiveMode("escalas");
    else if (acs) setActiveMode("esproporcional");
    else if ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla") setActiveMode("esproporcional");

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function generatorsFor() {
    if (diff.is("acs")) return ACS_GENERATORS;
    if (mode === "mezcla") return MODE_GROUPS[pick(Object.keys(MODE_GROUPS))];
    if (diff.is("altas") && mode === "problemas") return [...MODE_GROUPS.problemas, genInversa];
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
    els.wordDisplay.textContent = current.soloVisual ? "" : current.display;
    els.wordDisplay.style.display = current.soloVisual ? "none" : "";
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
    AppProgress.record("proporcionalidad", isCorrect);
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
