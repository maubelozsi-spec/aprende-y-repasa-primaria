// ============================================================
// Números grandes y aproximación (5º T1 bloque 1 y 6º SdA 1)
// - Explora: tabla de valor posicional, redondear en la recta y
//   comparar cifra a cifra. No guarda progreso.
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

function uniqueOptions(correct, candidates, count = 4) {
  const out = [correct];
  for (const c of candidates) {
    if (out.length >= count) break;
    if (c !== undefined && c !== null && c !== "" && !out.includes(c)) out.push(c);
  }
  return out;
}

// Punto de miles, como en el resto de la app: 4.567, 348.256.
const miles = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const pot10 = (p) => 10 ** p;
const cifras = (n) => String(n).split("").map(Number);
// Cifra que ocupa la posición p (0 = unidades).
const cifraEn = (n, p) => Math.floor(n / pot10(p)) % 10;

const ORDEN = ["unidad", "decena", "centena", "unidad de millar", "decena de millar", "centena de millar", "unidad de millón", "decena de millón", "centena de millón"];
const ORDEN_PL = ["unidades", "decenas", "centenas", "unidades de millar", "decenas de millar", "centenas de millar", "unidades de millón", "decenas de millón", "centenas de millón"];
// «Redondea a la decena», «al millar», «al millón»…
const A_ORDEN = ["a la unidad", "a la decena", "a la centena", "al millar", "a la decena de millar", "a la centena de millar", "al millón", "a la decena de millón", "a la centena de millón"];
const SIGLA = ["U", "D", "C", "UM", "DM", "CM", "U. mill.", "D. mill.", "C. mill."];

// ------------------------------------------------------------
// Números en letras
// ------------------------------------------------------------
const L_UNI = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
const L_10_29 = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
const L_DEC = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const L_CEN = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

// Menor que 1.000. `apocope`: delante de «mil» o «millones», uno → un (veintiún mil).
function letras999(n, apocope = false) {
  if (n === 0) return "";
  if (n === 100) return "cien";
  const c = Math.floor(n / 100);
  const r = n % 100;
  let t = "";
  if (r > 0 && r < 10) t = L_UNI[r];
  else if (r >= 10 && r < 30) t = L_10_29[r - 10];
  else if (r >= 30) t = L_DEC[Math.floor(r / 10)] + (r % 10 ? ` y ${L_UNI[r % 10]}` : "");
  if (apocope) t = t.replace(/veintiuno$/, "veintiún").replace(/(^| )uno$/, "$1un");
  return [L_CEN[c], t].filter(Boolean).join(" ");
}

function enLetras(n) {
  if (n === 0) return "cero";
  const m = Math.floor(n / 1e6);
  const k = Math.floor(n / 1e3) % 1000;
  const u = n % 1000;
  const partes = [];
  if (m) partes.push(m === 1 ? "un millón" : `${letras999(m, true)} millones`);
  if (k) partes.push(k === 1 ? "mil" : `${letras999(k, true)} mil`);
  if (u) partes.push(letras999(u));
  return partes.join(" ");
}

// ------------------------------------------------------------
// Números al azar y errores típicos
// ------------------------------------------------------------
function numeroAzar(nDig, probCero = 0.25) {
  let s = String(randInt(1, 9));
  for (let i = 1; i < nDig; i++) s += Math.random() < probCero ? "0" : String(randInt(1, 9));
  return Number(s);
}

// Números «parecidos» con los errores típicos: cambiar dos cifras vecinas,
// quitar o añadir un cero, mover un cero de sitio.
function parecidos(n) {
  const d = cifras(n);
  const out = new Set();
  for (let i = 0; i + 1 < d.length; i++) {
    if (d[i] !== d[i + 1] && !(i === 0 && d[1] === 0)) {
      const e = d.slice();
      [e[i], e[i + 1]] = [e[i + 1], e[i]];
      out.add(Number(e.join("")));
    }
  }
  d.forEach((x, i) => {
    if (x === 0) out.add(Number(d.slice(0, i).concat(d.slice(i + 1)).join("")));
  });
  const conCero = d.slice();
  conCero.splice(randInt(1, d.length), 0, 0);
  out.add(Number(conCero.join("")));
  // Si salen pocos (números como 55.555), una cifra cambiada.
  for (let i = 0; out.size < 6 && i < 20; i++) {
    const e = d.slice();
    const k = randInt(0, d.length - 1);
    e[k] = k === 0 ? randInt(1, 9) : randInt(0, 9);
    out.add(Number(e.join("")));
  }
  out.delete(n);
  return shuffle([...out]);
}

const redondear = (n, p) => Math.round(n / pot10(p)) * pot10(p);

// ------------------------------------------------------------
// Niveles: cuántas cifras tienen los números
// ------------------------------------------------------------
const LEVELS = {
  normal: { dig: [5, 6], mill: [7, 9] },
  facil: { dig: [4, 5], mill: [7, 7] },
  acs: { dig: [3, 4], mill: [3, 4] },
  altas: { dig: [6, 9], mill: [8, 9] },
};

const nDigitos = (L, mill) => randInt(...(mill ? L.mill : L.dig));

// Tira de cifras con una marcada (para «la cifra marcada»).
function tiraCifras(n, marcada) {
  const d = cifras(n);
  return `<div class="pv-tiles ng-tira">${d
    .map((x, i) => {
      const sep = i > 0 && (d.length - i) % 3 === 0 ? '<span class="ng-punto">.</span>' : "";
      return `${sep}<span class="letter${d.length - 1 - i === marcada ? " highlight" : ""}">${x}</span>`;
    })
    .join("")}</div>`;
}

// ------------------------------------------------------------
// Generadores
// ------------------------------------------------------------
function genLeer(L, mill = false) {
  // Al menos dos cifras distintas de 0 (no vale «quinientos» a secas).
  let n;
  do n = numeroAzar(nDigitos(L, mill), 0.3);
  while (cifras(n).filter((x) => x).length < 2);
  const otros = parecidos(n).filter((x) => String(x).length >= 3);
  if (Math.random() < 0.5) {
    const correct = enLetras(n);
    return {
      instruction: "¿Cómo se lee este número?",
      display: miles(n),
      options: uniqueOptions(correct, otros.map(enLetras)),
      correct,
      hint: "Lee por grupos de tres cifras, de izquierda a derecha: primero los millones, después los miles y por último las unidades. Los ceros no se leen.",
      explain: `${miles(n)} se lee «${correct}».${String(n).includes("0") ? " Los ceros no se leen, pero ocupan su lugar." : ""}`,
    };
  }
  const correct = miles(n);
  return {
    instruction: "¿Qué número es?",
    display: `«${enLetras(n)}»`,
    options: uniqueOptions(correct, otros.map(miles)),
    correct,
    hint: "Escribe primero el grupo de los millones (si lo hay), después el de los miles y por último el de las unidades. Cada grupo, salvo el primero, tiene 3 cifras: completa con ceros.",
    explain: `«${enLetras(n)}» se escribe ${correct}.${String(n).includes("0") ? " Fíjate en los ceros: guardan el lugar de los órdenes que no se nombran." : ""}`,
  };
}

function genValor(L, mill = false) {
  const nDig = nDigitos(L, mill);
  let n;
  let p;
  // La cifra marcada no se repite en el número: así no hay dudas.
  do {
    n = numeroAzar(nDig, 0.15);
    p = randInt(0, nDig - 1);
  } while (cifraEn(n, p) === 0 || cifras(n).filter((x) => x === cifraEn(n, p)).length > 1);
  const d = cifraEn(n, p);
  const tipo = randInt(1, 3);
  if (tipo === 1) {
    const correct = miles(d * pot10(p));
    return {
      instruction: `¿Cuánto vale el ${d} en este número?`,
      display: miles(n),
      visual: tiraCifras(n, p),
      options: uniqueOptions(correct, [miles(d * pot10(p + 1)), p > 0 ? miles(d * pot10(p - 1)) : null, String(d), miles(d * pot10(p + 2)), miles(d * pot10(Math.max(0, p - 2)))]),
      correct,
      hint: "Cuenta los lugares desde la derecha: unidades, decenas, centenas, unidades de millar…",
      explain: `El ${d} está en las ${ORDEN_PL[p]}, así que vale ${d} × ${miles(pot10(p))} = ${correct}.`,
    };
  }
  if (tipo === 2) {
    const correct = ORDEN[p];
    const vecinos = [p + 1, p - 1, p + 2, p - 2, p + 3].filter((x) => x >= 0 && x < Math.max(nDig, 6)).map((x) => ORDEN[x]);
    return {
      instruction: `¿Qué lugar ocupa el ${d}?`,
      display: miles(n),
      visual: tiraCifras(n, p),
      options: uniqueOptions(correct, vecinos),
      correct,
      hint: "Desde la derecha: U, D, C (unidades) · UM, DM, CM (millares) · U, D, C de millón.",
      explain: `El ${d} es una ${correct}: vale ${miles(d * pot10(p))}.`,
    };
  }
  const correct = String(d);
  const otras = cifras(n).filter((x) => x !== d).map(String);
  return {
    instruction: `¿Qué cifra ocupa el lugar de las ${ORDEN_PL[p]}?`,
    display: miles(n),
    options: uniqueOptions(correct, shuffle(otras).concat(["0", "1", "9"])),
    correct,
    hint: "Cuenta los lugares desde la derecha, empezando por las unidades.",
    explain: `En ${miles(n)}, las ${ORDEN_PL[p]} son el ${d} (vale ${miles(d * pot10(p))}).`,
  };
}

const descomp = (n) => cifras(n).map((x, i, a) => x * pot10(a.length - 1 - i)).filter((x) => x).map(miles).join(" + ");

function genDescomponer(L, mill = false) {
  let n;
  do n = numeroAzar(nDigitos(L, mill), 0.3);
  while (!String(n).slice(1).includes("0"));
  const d = cifras(n);
  if (Math.random() < 0.5) {
    const correct = descomp(n);
    // Errores: saltarse los ceros (cada cifra baja de lugar), o un lugar de más.
    const sinCeros = Number(d.filter((x) => x).join(""));
    const cands = [descomp(sinCeros), d.map((x, i) => x * pot10(d.length - i)).filter((x) => x).map(miles).join(" + "), ...parecidos(n).slice(0, 2).map(descomp)];
    return {
      instruction: "¿Cuál es su descomposición?",
      display: miles(n),
      options: uniqueOptions(correct, cands),
      correct,
      hint: "Cada cifra vale según su lugar: escribe su valor con tantos ceros como lugares tiene a su derecha. Los ceros no se escriben.",
      explain: `${miles(n)} = ${correct}.`,
    };
  }
  const correct = miles(n);
  const conOrdenes = Math.random() < 0.5;
  const display = conOrdenes
    ? d.map((x, i) => [x, d.length - 1 - i]).filter(([x]) => x).map(([x, p]) => `${x} ${SIGLA[p]}`).join(" + ")
    : descomp(n);
  return {
    instruction: "¿Qué número es?",
    display,
    options: uniqueOptions(correct, [miles(Number(d.filter((x) => x).join(""))), ...parecidos(n).map(miles)]),
    correct,
    hint: conOrdenes ? "U = unidades, D = decenas, C = centenas, UM = unidades de millar, DM = decenas de millar, CM = centenas de millar. Pon un 0 en los lugares que no aparecen." : "Suma los valores. Pon un 0 en los lugares que no aparecen.",
    explain: `${display} = ${correct}. Los lugares que faltan llevan un 0.`,
  };
}

function genComparar(L, mill = false) {
  const nDig = nDigitos(L, mill);
  let a;
  let b;
  if (Math.random() < 0.25 && nDig > 3) {
    // Distinto número de cifras, pero el más corto empieza por una cifra mayor.
    a = numeroAzar(nDig - 1);
    b = numeroAzar(nDig);
    if (cifras(a)[0] <= cifras(b)[0]) a = Number(String(randInt(cifras(b)[0] + 1 > 9 ? 9 : cifras(b)[0] + 1, 9)) + String(a).slice(1));
  } else {
    // Mismas cifras: se diferencian en un lugar profundo.
    a = numeroAzar(nDig);
    const d = cifras(a);
    const k = randInt(1, nDig - 1);
    let nuevo;
    do nuevo = randInt(0, 9);
    while (nuevo === d[k]);
    const e = d.slice();
    e[k] = nuevo;
    b = Math.random() < 0.12 ? a : Number(e.join(""));
  }
  if (Math.random() < 0.5) [a, b] = [b, a];
  const sign = a < b ? "<" : a > b ? ">" : "=";
  const da = cifras(a);
  const db = cifras(b);
  let explain;
  if (a === b) explain = "Son el mismo número.";
  else if (da.length !== db.length) explain = `${miles(da.length > db.length ? a : b)} tiene más cifras (${Math.max(da.length, db.length)} frente a ${Math.min(da.length, db.length)}), así que es mayor, aunque el otro empiece por una cifra más alta.`;
  else {
    const k = da.findIndex((x, i) => x !== db[i]);
    explain = `Tienen las mismas cifras. Se comparan de izquierda a derecha: la primera diferencia está en las ${ORDEN_PL[da.length - 1 - k]} (${da[k]} ${da[k] < db[k] ? "<" : ">"} ${db[k]}).`;
  }
  return {
    instruction: "¿Qué signo va en el hueco (␣)?",
    display: `${miles(a)} ␣ ${miles(b)}`,
    options: ["<", "=", ">"],
    keepOrder: true,
    correct: sign,
    hint: "Primero cuenta las cifras: gana el que tiene más. Si tienen las mismas, compara de izquierda a derecha hasta encontrar una distinta.",
    explain: `${miles(a)} ${sign} ${miles(b)}. ${explain}`,
  };
}

function genOrdenar(L, mill = false) {
  const nDig = nDigitos(L, mill);
  const base = numeroAzar(nDig);
  const vals = new Set([base]);
  while (vals.size < 4) {
    const d = cifras(base);
    const k = randInt(1, nDig - 1);
    d[k] = randInt(0, 9);
    if (Math.random() < 0.25 && nDig > 4) vals.add(numeroAzar(nDig - 1));
    else vals.add(Number(d.join("")));
  }
  const arr = [...vals];
  const asc = arr.slice().sort((x, y) => x - y);
  const str = (xs) => xs.map(miles).join(" < ");
  const correct = str(asc);
  // Errores: ordenar por la primera cifra sin mirar cuántas tiene; intercambiar dos.
  const porTexto = arr.slice().sort((x, y) => (String(x) < String(y) ? -1 : 1));
  const cambio = asc.slice();
  [cambio[1], cambio[2]] = [cambio[2], cambio[1]];
  const cambio2 = asc.slice();
  [cambio2[2], cambio2[3]] = [cambio2[3], cambio2[2]];
  return {
    instruction: "Ordena de menor a mayor:",
    display: shuffle(arr).map(miles).join("   ·   "),
    options: uniqueOptions(correct, [str(porTexto), str(cambio), str(cambio2), str(asc.slice().reverse())]),
    correct,
    hint: "Primero los de menos cifras. Entre los de igual número de cifras, compara de izquierda a derecha.",
    explain: `De menor a mayor: ${correct}.`,
  };
}

function genComparacion(L, mill = false) {
  return Math.random() < 0.6 ? genComparar(L, mill) : genOrdenar(L, mill);
}

function genRedondear(L, mill = false) {
  const nDig = nDigitos(L, mill);
  let n;
  let p;
  do {
    n = numeroAzar(nDig, 0.15);
    // Con millones, a los órdenes grandes.
    p = randInt(mill && nDig > 6 ? 3 : 1, nDig - 1);
  } while (redondear(n, p) === n);
  const r = redondear(n, p);
  const correct = miles(r);
  const abajo = Math.floor(n / pot10(p)) * pot10(p);
  const arriba = abajo + pot10(p);
  // Error al subir: cambiar la cifra pero no poner a cero las de la derecha (274.849).
  const sinCeros = r + (n % pot10(p));
  const cands = [miles(r === abajo ? arriba : abajo), r === abajo ? null : miles(sinCeros), p + 1 < nDig ? miles(redondear(n, p + 1)) : null, p > 1 ? miles(redondear(n, p - 1)) : null, miles(arriba + pot10(p)), abajo - pot10(p) > 0 ? miles(abajo - pot10(p)) : null];
  const sig = cifraEn(n, p - 1);
  return {
    instruction: `Redondea ${A_ORDEN[p]}:`,
    display: miles(n),
    visual: tiraCifras(n, p),
    options: uniqueOptions(correct, cands),
    correct,
    hint: `Mira la cifra que está a la derecha de las ${ORDEN_PL[p]}: si es 5 o más, la de las ${ORDEN_PL[p]} sube 1; si es menor, se queda igual. Lo de la derecha, a cero.`,
    explain: `La cifra de las ${ORDEN_PL[p]} es ${cifraEn(n, p)} y la de su derecha es ${sig}: ${sig >= 5 ? "como es 5 o más, sube" : "como es menor que 5, se queda igual"}. ${miles(n)} → ${correct}. Está entre ${miles(abajo)} y ${miles(arriba)}, y más cerca de ${correct}.`,
  };
}

// --- Problemas ---
const CONTEXTOS = {
  5: [
    { t: (n) => `En un partido de fútbol hubo ${miles(n)} espectadores.`, d: [5, 5] },
    { t: (n) => `Una ciudad andaluza tiene ${miles(n)} habitantes.`, d: [5, 6] },
    { t: (n) => `La biblioteca provincial tiene ${miles(n)} libros.`, d: [5, 6] },
    { t: (n) => `Un museo recibió ${miles(n)} visitantes el año pasado.`, d: [5, 6] },
  ],
  6: [
    { t: (n) => `Un país tiene ${miles(n)} habitantes.`, d: [7, 8] },
    { t: (n) => `Una empresa vendió ${miles(n)} botellas de aceite de oliva en un año.`, d: [7, 8] },
    { t: (n) => `Una nave espacial ha recorrido ${miles(n)} km.`, d: [7, 9] },
  ],
};

function genProblema(L) {
  const grande = L === LEVELS.altas || (L === LEVELS.normal && Math.random() < 0.35);
  const ctx = pick(CONTEXTOS[grande ? 6 : 5]);
  const nDig = L === LEVELS.acs ? 4 : L === LEVELS.facil ? Math.min(5, ctx.d[1]) : randInt(...ctx.d);
  const n = numeroAzar(nDig, 0.15);
  const tipo = randInt(1, 2);
  if (tipo === 1) {
    // Redondear para una noticia.
    const p = nDig >= 7 ? pick([5, 6]) : nDig >= 5 ? pick([3, 4]) : 2;
    const r = redondear(n, p);
    if (r === n) return genProblema(L);
    const abajo = Math.floor(n / pot10(p)) * pot10(p);
    return {
      instruction: "Lee el problema:",
      display: `${ctx.t(n)} Para una noticia, redondea el dato ${A_ORDEN[p]}.`,
      options: uniqueOptions(miles(r), [miles(r === abajo ? abajo + pot10(p) : abajo), miles(redondear(n, p + 1)), miles(redondear(n, p - 1)), miles(r * 10)]),
      correct: miles(r),
      hint: `Mira la cifra a la derecha de las ${ORDEN_PL[p]}.`,
      explain: `La cifra de la derecha de las ${ORDEN_PL[p]} es ${cifraEn(n, p - 1)}: ${cifraEn(n, p - 1) >= 5 ? "sube" : "se queda igual"}. ${miles(n)} → ${miles(r)}.`,
    };
  }
  // Al revés: ¿qué dato real puede ser «unos X»?
  const p = nDig >= 7 ? 6 : nDig >= 5 ? 3 : 2;
  const r = redondear(n, p);
  const malos = [n + pot10(p), n - pot10(p) > 0 ? n - pot10(p) : n + 2 * pot10(p), n * 10, Math.floor(n / 10)].filter((x) => redondear(x, p) !== r);
  return {
    instruction: "Lee el problema:",
    display: `Una noticia dice que hay «unos ${miles(r)}» (redondeado ${A_ORDEN[p]}). ¿Cuál puede ser el dato exacto?`,
    options: uniqueOptions(miles(n), malos.map(miles)),
    correct: miles(n),
    hint: `Redondea cada opción ${A_ORDEN[p]} y mira cuál da ${miles(r)}.`,
    explain: `${miles(n)} redondeado ${A_ORDEN[p]} es ${miles(r)}. Las otras opciones dan otro redondeo.`,
  };
}

const mill = (g) => {
  const f = (L) => g(L, true);
  Object.defineProperty(f, "name", { value: `${g.name}Mill` });
  return f;
};

const MODE_GROUPS = {
  leer: [genLeer],
  valor: [genValor],
  descomponer: [genDescomponer],
  comparar: [genComparacion],
  redondear: [genRedondear],
  problemas: [genProblema],
  millones: [mill(genLeer), mill(genValor), mill(genDescomponer), mill(genComparacion), mill(genRedondear)],
};

const ACS_GENERATORS = [genValor, genComparar, genLeer, genDescomponer];

const NUMGRANDES_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Números de 3 y 4 cifras (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja con números de <strong>3 y 4 cifras</strong>: leerlos, el valor de cada cifra, descomponerlos y compararlos.",
    example: "3.482 → 3 UM + 4 C + 8 D + 2 U",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de números, pero con una tipografía más legible para leer las cifras y las preguntas.",
    example: "348.256 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Leer y escribir» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todos los contenidos, con números de 4 y 5 cifras y la pista a la vista",
    text: "Se trabajan todos los modos con números de 4 y 5 cifras (los millones, con 7 cifras) y la pista abierta desde el principio. Sin «Mezcla». En Explora se puede tocar cada cifra y ver lo que vale.",
    example: "45.307 → Pista: lee por grupos de tres cifras",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Números de millones desde el principio",
    text: "Empieza en <strong>Millones</strong>, con números de 8 y 9 cifras, y en el resto de modos usa números de 6 a 9 cifras.",
    example: "348.256.719 → trescientos cuarenta y ocho millones…",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Cuánto vale el 4 en 348.256? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, NUMGRANDES_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), NUMGRANDES_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("ng-tabla")) initExplore();
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
  // 1. Tabla de valor posicional: se toca una cifra y se ve lo que vale.
  const T = { n: 348256, p: 4, mill: false };
  function renderTabla() {
    const d = cifras(T.n);
    const cont = document.getElementById("ng-tabla-cifras");
    cont.innerHTML = "";
    d.forEach((x, i) => {
      const p = d.length - 1 - i;
      const col = document.createElement("button");
      col.type = "button";
      col.className = `pv-col ng-col${p === T.p ? " sel" : ""}${p >= 6 ? " ng-mill" : p >= 3 ? " ng-miles" : ""}`;
      col.innerHTML = `<span class="letter${p === T.p ? " highlight" : ""}">${x}</span><span class="pv-label">${SIGLA[p]}</span>`;
      col.setAttribute("aria-label", `${x}, ${ORDEN_PL[p]}`);
      col.addEventListener("click", () => {
        T.p = p;
        renderTabla();
      });
      cont.appendChild(col);
    });
    const x = cifraEn(T.n, T.p);
    document.getElementById("ng-tabla-msg").innerHTML =
      `<p><strong>${miles(T.n)}</strong> se lee «${enLetras(T.n)}».</p>` +
      `<p>El <strong>${x}</strong> está en las ${ORDEN_PL[T.p]}: vale ${x === 0 ? "0 (el cero guarda el lugar)" : `${x} × ${miles(pot10(T.p))} = <strong>${miles(x * pot10(T.p))}</strong>`}.</p>` +
      `<p>Descomposición: ${miles(T.n)} = ${descomp(T.n)}.</p>`;
  }
  document.getElementById("ng-tabla-otro").addEventListener("click", () => {
    T.n = numeroAzar(T.mill ? randInt(7, 9) : randInt(5, 6), 0.25);
    T.p = randInt(0, String(T.n).length - 1);
    renderTabla();
  });
  document.querySelectorAll("#ng-tabla-tipo [data-ng-tipo]").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll("#ng-tabla-tipo [data-ng-tipo]").forEach((x) => x.classList.toggle("active", x === b));
      T.mill = b.dataset.ngTipo === "mill";
      T.n = T.mill ? 348256719 : 348256;
      T.p = T.mill ? 7 : 4;
      renderTabla();
    })
  );

  // 2. Redondear en la recta.
  const R = { n: 273849, p: 3 };
  function rectaRedondeo(n, p) {
    const abajo = Math.floor(n / pot10(p)) * pot10(p);
    const arriba = abajo + pot10(p);
    const mitad = abajo + pot10(p) / 2;
    const r = redondear(n, p);
    const W = 520;
    const x0 = 40;
    const x1 = W - 40;
    const y = 50;
    const xOf = (v) => x0 + ((x1 - x0) * (v - abajo)) / (arriba - abajo);
    let out = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="var(--text)" stroke-width="2"/>`;
    for (let i = 0; i <= 10; i++) {
      const x = x0 + ((x1 - x0) * i) / 10;
      out += `<line x1="${x}" y1="${y - (i % 5 === 0 ? 10 : 5)}" x2="${x}" y2="${y + (i % 5 === 0 ? 10 : 5)}" stroke="var(--text)" stroke-width="${i % 5 === 0 ? 2 : 1}"/>`;
    }
    out += `<text x="${x0}" y="${y + 30}" text-anchor="middle" font-size="13" font-weight="${r === abajo ? 800 : 600}" fill="${r === abajo ? "var(--color-success)" : "var(--text)"}">${miles(abajo)}</text>`;
    out += `<text x="${x1}" y="${y + 30}" text-anchor="middle" font-size="13" font-weight="${r === arriba ? 800 : 600}" fill="${r === arriba ? "var(--color-success)" : "var(--text)"}">${miles(arriba)}</text>`;
    out += `<text x="${xOf(mitad)}" y="${y + 30}" text-anchor="middle" font-size="11" fill="var(--text-muted)">mitad</text>`;
    const xn = xOf(n);
    out += `<circle cx="${xn}" cy="${y}" r="7" fill="var(--color-rose)"/><text x="${Math.min(Math.max(xn, 50), W - 50)}" y="${y - 18}" text-anchor="middle" font-size="13" font-weight="800" fill="var(--color-rose)">${miles(n)}</text>`;
    return `<svg viewBox="0 0 ${W} 96" width="100%" style="max-width:${W}px" role="img" aria-label="Recta del redondeo">${out}</svg>`;
  }
  function renderRedondeo() {
    const nDig = String(R.n).length;
    const cont = document.getElementById("ng-red-ordenes");
    cont.innerHTML = "";
    for (let p = 1; p < nDig; p++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `btn btn-secondary${p === R.p ? " active" : ""}`;
      b.textContent = A_ORDEN[p].replace(/^a la |^al /, "");
      b.addEventListener("click", () => {
        R.p = p;
        renderRedondeo();
      });
      cont.appendChild(b);
    }
    document.getElementById("ng-red-num").textContent = miles(R.n);
    document.getElementById("ng-red-recta").innerHTML = rectaRedondeo(R.n, R.p);
    const sig = cifraEn(R.n, R.p - 1);
    const r = redondear(R.n, R.p);
    if (r === R.n) {
      document.getElementById("ng-red-msg").innerHTML = `${miles(R.n)} ya termina en ceros a partir de las ${ORDEN_PL[R.p]}: redondeado ${A_ORDEN[R.p]} se queda igual.`;
      return;
    }
    document.getElementById("ng-red-msg").innerHTML = `Redondeado ${A_ORDEN[R.p]}: <strong>${miles(r)}</strong>. La cifra a la derecha de las ${ORDEN_PL[R.p]} es ${sig}: ${sig >= 5 ? "es 5 o más, así que sube" : "es menor que 5, así que se queda igual"}. En la recta, ${miles(R.n)} está más cerca de ${miles(r)}${sig === 5 && R.n % pot10(R.p - 1) === 0 ? " (justo en la mitad: por convenio, se sube)" : ""}.`;
  }
  document.getElementById("ng-red-otro").addEventListener("click", () => {
    // La última cifra nunca es 0, para que siempre haya algo que redondear.
    R.n = numeroAzar(randInt(5, 7), 0.15);
    if (R.n % 10 === 0) R.n += randInt(1, 9);
    R.p = Math.min(R.p, String(R.n).length - 1);
    renderRedondeo();
  });

  // 3. Comparar cifra a cifra.
  const C = { a: 348256, b: 348512 };
  function renderComparar() {
    const da = cifras(C.a);
    const db = cifras(C.b);
    const len = Math.max(da.length, db.length);
    const pad = (d) => Array(len - d.length).fill("").concat(d);
    const pa = pad(da);
    const pb = pad(db);
    const k = da.length === db.length ? da.findIndex((x, i) => x !== db[i]) : -1;
    let html = '<table class="rules-table ng-comp"><tr>';
    for (let i = 0; i < len; i++) html += `<th>${SIGLA[len - 1 - i]}</th>`;
    html += "</tr>";
    [pa, pb].forEach((row) => {
      html += "<tr>";
      row.forEach((x, i) => (html += `<td class="${i === k ? "ng-dif" : i < k ? "ng-igual" : ""}">${x}</td>`));
      html += "</tr>";
    });
    html += "</table>";
    document.getElementById("ng-comp-tabla").innerHTML = html;
    const sign = C.a < C.b ? "<" : C.a > C.b ? ">" : "=";
    let msg;
    if (da.length !== db.length) msg = `${miles(da.length > db.length ? C.a : C.b)} tiene más cifras, así que es mayor.`;
    else if (k < 0) msg = "Son iguales.";
    else msg = `Las cifras coinciden hasta las ${ORDEN_PL[len - 1 - k]}, donde ${da[k]} ${da[k] < db[k] ? "<" : ">"} ${db[k]}. Lo que viene después ya no importa.`;
    document.getElementById("ng-comp-msg").innerHTML = `<strong>${miles(C.a)} ${sign} ${miles(C.b)}</strong>. ${msg}`;
  }
  document.getElementById("ng-comp-otro").addEventListener("click", () => {
    const q = genComparar(LEVELS.normal);
    const [x, y] = q.display.split(" ␣ ").map((s) => Number(s.replace(/\./g, "")));
    C.a = x;
    C.b = y;
    renderComparar();
  });

  renderTabla();
  renderRedondeo();
  renderComparar();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-numeros-grandes"),
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
  let mode = "leer";
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

    if (diff.is("altas")) setActiveMode("millones");
    else if (acs) setActiveMode("valor");
    else if ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla") setActiveMode("leer");

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
    // Con la tira de cifras a la vista, el número no se repite en grande.
    els.wordDisplay.textContent = current.visual ? "" : current.display;
    els.wordDisplay.style.display = current.visual ? "none" : "";
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
    AppProgress.record("numeros-grandes", isCorrect);
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
