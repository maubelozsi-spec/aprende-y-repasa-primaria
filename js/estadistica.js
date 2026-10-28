// ============================================================
// Estadística: gráficos, tablas de frecuencias, moda, media, mediana y
// rango (5º y 6º; en 6º, SdA 9 «Arquitectos responsables»: tabla de
// frecuencias y media, moda, mediana y rango).
// - Explora: construir un diagrama de barras con su tabla de
//   frecuencias y ver la media como un reparto en torres de cubos (y
//   qué le pasa con un dato muy grande). No guarda progreso.
// - Práctica: los datos y los gráficos se generan al azar y cada
//   pregunta trae su pista y su explicación. Solo la práctica llama a
//   AppProgress.
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

// 12.5 → "12,5"
function fmt(n) {
  const r = Math.round(n * 100) / 100;
  return String(r).replace(".", ",");
}

// Opciones numéricas: no negativas, enteras o con media unidad (solo
// enteras si «enteras»).
function opcionesNum(correct, valores, enteras = false) {
  return uniqueOptions(fmt(correct), valores.filter((v) => v >= 0 && Number.isInteger(enteras ? v : v * 2) && Math.abs(v - correct) > 1e-9).map(fmt));
}

const suma = (xs) => xs.reduce((a, b) => a + b, 0);
const ordenar = (xs) => xs.slice().sort((a, b) => a - b);
function frecuencias(xs) {
  const f = new Map();
  ordenar(xs).forEach((x) => f.set(x, (f.get(x) || 0) + 1));
  return f;
}
function mediana(xs) {
  const o = ordenar(xs);
  const c = Math.floor(o.length / 2);
  return o.length % 2 ? o[c] : (o[c - 1] + o[c]) / 2;
}

// ------------------------------------------------------------
// Contextos de datos
// ------------------------------------------------------------
const CONTEXTOS = [
  { frase: (n) => `Notas de ${n} alumnos en un examen`, min: 3, max: 10 },
  { frase: (n) => `Número de hermanos de ${n} compañeros`, min: 0, max: 4 },
  { frase: (n) => `Goles marcados por un equipo en ${n} partidos`, min: 0, max: 6 },
  { frase: (n) => `Libros leídos por ${n} alumnos este trimestre`, min: 1, max: 9 },
  { frase: (n) => `Puntos de ${n} jugadores en un partido de baloncesto`, min: 2, max: 12, normal: true },
  { frase: (n) => `Temperatura máxima (°C) durante ${n} días`, min: 14, max: 30, normal: true },
];

const LEVELS = {
  normal: { n: [6, 9], medias: 2, saltos: [2, 5], lineas: true },
  facil: { n: [4, 5], medias: 1, saltos: [1], pequeños: true },
  acs: { n: [4, 5], medias: 1, saltos: [1], pequeños: true },
  altas: { n: [7, 10], medias: 2, saltos: [2, 5, 10], lineas: true, altas: true },
};

function contexto(L) {
  return pick(CONTEXTOS.filter((c) => !(L.pequeños && c.normal)));
}

function datos(L, c, n) {
  return Array.from({ length: n }, () => randInt(c.min, c.max));
}

// ------------------------------------------------------------
// Dibujos
// ------------------------------------------------------------
// Diagrama de barras o de líneas con su escala. data-y0 y data-px
// permiten leer los valores desde el dibujo.
function graficoSVG(cats, vals, salto, titY, lineas = false) {
  const W = 320;
  const H = 230;
  const m = { l: 44, r: 10, t: 24, b: 40 };
  const ymax = Math.max(salto * Math.ceil(Math.max(...vals) / salto), salto);
  const ticks = ymax / salto;
  const px = (H - m.t - m.b) / ymax;
  const Y = (v) => H - m.b - v * px;
  const slot = (W - m.l - m.r) / cats.length;
  let out = "";
  for (let i = 0; i <= ticks; i++) {
    const v = i * salto;
    out += `<line x1="${m.l}" y1="${Y(v).toFixed(1)}" x2="${W - m.r}" y2="${Y(v).toFixed(1)}" stroke="var(--border-strong)" stroke-width="1"/>`;
    if (ticks <= 10 || i % 2 === 0) out += `<text x="${m.l - 6}" y="${(Y(v) + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--text-muted)">${v}</text>`;
  }
  if (lineas) {
    const pts = vals.map((v, i) => `${(m.l + slot * (i + 0.5)).toFixed(1)},${Y(v).toFixed(1)}`);
    out += `<polyline points="${pts.join(" ")}" fill="none" stroke="var(--color-indigo)" stroke-width="3"/>`;
    vals.forEach((v, i) => {
      out += `<circle class="es-dato" data-v="${v}" cx="${(m.l + slot * (i + 0.5)).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="5" fill="var(--color-indigo)"/>`;
    });
  } else {
    vals.forEach((v, i) => {
      out += `<rect class="es-dato" data-v="${v}" x="${(m.l + slot * i + slot * 0.18).toFixed(1)}" y="${Y(v).toFixed(1)}" width="${(slot * 0.64).toFixed(1)}" height="${(v * px).toFixed(1)}" fill="var(--color-indigo)" rx="2"/>`;
    });
  }
  cats.forEach((c, i) => {
    out += `<text x="${(m.l + slot * (i + 0.5)).toFixed(1)}" y="${H - m.b + 16}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--text)">${c}</text>`;
  });
  out += `<line x1="${m.l}" y1="${m.t - 8}" x2="${m.l}" y2="${H - m.b}" stroke="var(--text)" stroke-width="2"/><line x1="${m.l}" y1="${H - m.b}" x2="${W - m.r}" y2="${H - m.b}" stroke="var(--text)" stroke-width="2"/>`;
  out += `<text x="${m.l - 36}" y="${m.t - 12}" font-size="11" font-weight="700" fill="var(--text)">${titY}</text>`;
  return `<svg class="es-grafico" viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" data-y0="${H - m.b}" data-px="${px}" role="img" aria-label="${lineas ? "Gráfico de líneas" : "Diagrama de barras"}">${out}</svg>`;
}

// ------------------------------------------------------------
// Generadores
// ------------------------------------------------------------
// nom: cómo se nombra cada opción dentro de una frase.
const ENCUESTAS = [
  { tit: "Fruta favorita de la clase", y: "Alumnos", cats: ["Fresa", "Plátano", "Manzana", "Pera", "Kiwi"], nom: ["fresa", "plátano", "manzana", "pera", "kiwi"],
    valor: (a) => `¿Cuántos alumnos eligieron ${a}?`, mas: "¿Qué fruta eligieron más alumnos?", menos: "¿Qué fruta eligieron menos alumnos?",
    dif: (a, b) => `¿Cuántos alumnos más eligieron ${a} que ${b}?`, total: "¿Cuántos alumnos votaron en total?" },
  { tit: "Deporte favorito", y: "Votos", cats: ["Fútbol", "Tenis", "Natación", "Básquet", "Ciclismo"], nom: ["el fútbol", "el tenis", "la natación", "el baloncesto", "el ciclismo"],
    valor: (a) => `¿Cuántos votos tiene ${a}?`, mas: "¿Qué deporte tiene más votos?", menos: "¿Qué deporte tiene menos votos?",
    dif: (a, b) => `¿Cuántos votos más tiene ${a} que ${b}?`, total: "¿Cuántos votos hay en total?" },
  { tit: "Cómo venimos al colegio", y: "Alumnos", cats: ["Andando", "Coche", "Bus", "Bici"], nom: ["andando", "en coche", "en bus", "en bici"],
    valor: (a) => `¿Cuántos alumnos vienen ${a}?`, mas: "¿Cómo vienen más alumnos?", menos: "¿Cómo vienen menos alumnos?",
    dif: (a, b) => `¿Cuántos alumnos más vienen ${a} que ${b}?`, total: "¿Cuántos alumnos hay en total?" },
  { tit: "Libros prestados en la biblioteca", y: "Libros", cats: ["Lun", "Mar", "Mié", "Jue", "Vie"], nom: ["el lunes", "el martes", "el miércoles", "el jueves", "el viernes"],
    valor: (a) => `¿Cuántos libros se prestaron ${a}?`, mas: "¿Qué día se prestaron más libros?", menos: "¿Qué día se prestaron menos libros?",
    dif: (a, b) => `¿Cuántos libros más se prestaron ${a} que ${b}?`, total: "¿Cuántos libros se prestaron en total?" },
];
const LINEAS = [
  { tit: "Temperatura media de cada mes", y: "°C", cats: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"], u: "°C" },
  { tit: "Altura de una planta cada semana", y: "cm", cats: ["S1", "S2", "S3", "S4", "S5", "S6"], u: "cm" },
];

function valoresDistintos(k, salto, L) {
  const tope = L.pequeños ? 10 : 10 * salto;
  const pool = [];
  for (let v = salto; v <= tope; v += salto) pool.push(v);
  return shuffle(pool).slice(0, k);
}

function genGrafico(L) {
  if (L.lineas && Math.random() < 0.3) return genLineas(L);
  const e = pick(ENCUESTAS);
  const salto = pick(L.saltos);
  const k = L.pequeños ? 4 : e.cats.length;
  const cats = e.cats.slice(0, k);
  const vals = valoresDistintos(k, salto, L);
  const visual = `<p class="es-tit">${e.tit}</p>${graficoSVG(cats, vals, salto, e.y)}`;
  const iMax = vals.indexOf(Math.max(...vals));
  const iMin = vals.indexOf(Math.min(...vals));
  const tipos = L.pequeños ? ["valor", "valor", "mayor", "menor"] : ["valor", "mayor", "menor", "diferencia", "total", "moda"];
  const tipo = pick(tipos);
  if (tipo === "valor") {
    const i = randInt(0, k - 1);
    return {
      instruction: "Mira el gráfico y contesta:",
      display: e.valor(e.nom[i]),
      visual,
      options: opcionesNum(vals[i], [vals[i] + salto, vals[i] - salto, vals[i] + 1, vals[i] - 1, vals[i] / salto]),
      correct: fmt(vals[i]),
      hint: `Sigue la parte de arriba de la barra hasta la escala de la izquierda. Cada raya de la escala vale ${salto}.`,
      explain: `La barra de ${e.cats[i]} llega hasta el ${vals[i]} de la escala${salto > 1 ? ` (cada raya vale ${salto})` : ""}.`,
    };
  }
  if (tipo === "mayor" || tipo === "menor") {
    const i = tipo === "mayor" ? iMax : iMin;
    return {
      instruction: "Mira el gráfico y contesta:",
      display: tipo === "mayor" ? e.mas : e.menos,
      visual,
      options: [cats[i], ...shuffle(cats.filter((c) => c !== cats[i])).slice(0, 3)],
      correct: cats[i],
      hint: `Busca la barra ${tipo === "mayor" ? "más alta" : "más baja"}.`,
      explain: `La barra ${tipo === "mayor" ? "más alta" : "más baja"} es la de ${cats[i]} (${vals[i]}).`,
    };
  }
  if (tipo === "moda") {
    return {
      instruction: "Mira el gráfico y contesta:",
      display: "¿Cuál es la moda de estos datos?",
      visual,
      options: [cats[iMax], ...shuffle(cats.filter((c, j) => j !== iMax)).slice(0, 2), fmt(vals[iMax])],
      correct: cats[iMax],
      hint: "La moda es lo que más se repite: la barra más alta. ¡Es una de las opciones, no un número!",
      explain: `La moda es ${cats[iMax]}, la barra más alta. El ${vals[iMax]} es su frecuencia (cuántas veces se eligió), no la moda.`,
    };
  }
  if (tipo === "diferencia") {
    const [a, b] = shuffle([...cats.keys()]).slice(0, 2).sort((x, y) => vals[y] - vals[x]);
    const d = vals[a] - vals[b];
    return {
      instruction: "Mira el gráfico y contesta:",
      display: e.dif(e.nom[a], e.nom[b]),
      visual,
      options: opcionesNum(d, [vals[a] + vals[b], vals[a], d + salto, d - salto, vals[b]]),
      correct: fmt(d),
      hint: "Lee las dos barras en la escala y resta.",
      explain: `${cats[a]}: ${vals[a]}; ${cats[b]}: ${vals[b]}. ${vals[a]} − ${vals[b]} = ${d}.`,
    };
  }
  const t = suma(vals);
  return {
    instruction: "Mira el gráfico y contesta:",
    display: e.total,
    visual,
    options: opcionesNum(t, [t + salto, t - salto, Math.max(...vals), t + 10, t - 10]),
    correct: fmt(t),
    hint: "Lee el valor de cada barra y súmalos.",
    explain: `${vals.join(" + ")} = ${t}.`,
  };
}

function genLineas(L) {
  const g = pick(LINEAS);
  let salto;
  let vals;
  if (g.u === "cm") {
    // La planta crece (o se queda igual) cada semana.
    salto = pick([1, 2, 5]);
    vals = [salto * randInt(1, 2)];
    while (vals.length < 6) vals.push(vals[vals.length - 1] + salto * randInt(0, 2));
  } else {
    // Temperaturas de enero a junio en Andalucía: suben de unos 10 °C a unos 26 °C.
    salto = 2;
    do {
      vals = [2 * randInt(4, 6)];
      while (vals.length < 6) vals.push(vals[vals.length - 1] + 2 * randInt(0, 2));
    } while (vals[5] > 30 || vals[5] < 20);
  }
  const visual = `<p class="es-tit">${g.tit}</p>${graficoSVG(g.cats, vals, salto, g.y, true)}`;
  const i = randInt(0, 4);
  const j = randInt(i + 1, 5);
  if (Math.random() < 0.5) {
    const k = randInt(0, 5);
    return {
      instruction: "Mira el gráfico de líneas y contesta:",
      display: `¿Qué valor tiene en ${g.cats[k]}?`,
      visual,
      options: opcionesNum(vals[k], [vals[k] + salto, vals[k] - salto, vals[k] + 1, vals[k] - 1]).map((o) => `${o} ${g.u}`),
      correct: `${fmt(vals[k])} ${g.u}`,
      hint: `Busca el punto encima de ${g.cats[k]} y llévalo a la escala. Cada raya vale ${salto}.`,
      explain: `El punto de ${g.cats[k]} está a la altura del ${vals[k]}: ${vals[k]} ${g.u}.`,
    };
  }
  const d = vals[j] - vals[i];
  return {
    instruction: "Mira el gráfico de líneas y contesta:",
    display: `¿Cuánto ${g.u === "cm" ? "creció" : "subió"} de ${g.cats[i]} a ${g.cats[j]}?`,
    visual,
    options: opcionesNum(d, [vals[j], vals[i] + vals[j], d + salto, d - salto, d + 1]).map((o) => `${o} ${g.u}`),
    correct: `${fmt(d)} ${g.u}`,
    hint: "Lee los dos puntos en la escala y resta el menor al mayor.",
    explain: `${g.cats[j]}: ${vals[j]} ${g.u}; ${g.cats[i]}: ${vals[i]} ${g.u}. ${vals[j]} − ${vals[i]} = ${d} ${g.u}.`,
  };
}

function genFrecuencia(L) {
  const c = contexto(L);
  const valores = [];
  // Pocos valores distintos para que se repitan.
  const base = randInt(c.min, Math.max(c.min, c.max - 4));
  const n = L.pequeños ? randInt(6, 9) : randInt(10, 16);
  for (let i = 0; i < n; i++) valores.push(base + randInt(0, L.pequeños ? 2 : 4));
  const f = frecuencias(valores);
  const vs = [...f.keys()];
  const v = pick(vs);
  const tipo = L.altas ? pick(["abs", "total", "rel"]) : L.pequeños ? "abs" : pick(["abs", "abs", "total"]);
  const display = `${c.frase(n)}: ${valores.join(", ")}.`;
  if (tipo === "total") {
    return {
      instruction: "¿Cuántos datos hay en total?",
      display,
      options: opcionesNum(n, [n + 1, n - 1, vs.length, Math.max(...valores)]),
      correct: fmt(n),
      hint: "Cuenta todos los números de la lista, aunque se repitan. Es la suma de las frecuencias.",
      explain: `Hay ${n} datos. Sumando las frecuencias: ${[...f.values()].join(" + ")} = ${n}.`,
    };
  }
  if (tipo === "rel") {
    const fr = `${f.get(v)}/${n}`;
    return {
      instruction: `¿Cuál es la frecuencia relativa del ${v}?`,
      display,
      options: uniqueOptions(fr, [`${f.get(v)}/${vs.length}`, `${v}/${n}`, `${n}/${f.get(v)}`, `${f.get(v) + 1}/${n}`]),
      correct: fr,
      hint: "Frecuencia relativa = veces que aparece : total de datos (se escribe como fracción).",
      explain: `El ${v} aparece ${f.get(v)} veces de ${n} datos: ${fr}.`,
    };
  }
  return {
    instruction: `¿Cuántas veces aparece el ${v}? (su frecuencia)`,
    display,
    options: opcionesNum(f.get(v), [f.get(v) + 1, f.get(v) - 1, v, n, f.get(v) + 2, f.get(v) + 3].filter((x) => x > 0)),
    correct: fmt(f.get(v)),
    hint: `Ve tachando cada ${v} que encuentres y cuéntalos.`,
    explain: `El ${v} aparece ${f.get(v)} veces. Tabla de frecuencias: ${[...f].map(([x, k]) => `${x} → ${k}`).join("; ")}.`,
  };
}

function genModa(L) {
  const c = contexto(L);
  let moda;
  let fm;
  do {
    moda = randInt(c.min, c.max);
    fm = L.pequeños ? 3 : randInt(3, 4);
  } while (moda === fm);
  const otros = shuffle(Array.from({ length: c.max - c.min + 1 }, (_, i) => c.min + i).filter((x) => x !== moda));
  // Un rival con una vez menos (o sueltos) para que haya que contar.
  const fr = L.pequeños ? pick([1, 2]) : fm - 1;
  let valores = Array(fm).fill(moda).concat(Array(fr).fill(otros[0]));
  const n = L.pequeños ? 5 : randInt(7, 10);
  for (let i = 1; valores.length < n && i < otros.length; i++) valores.push(otros[i]);
  valores = shuffle(valores);
  const f = frecuencias(valores);
  const rival = [...f].filter(([x]) => x !== moda).sort((a, b) => b[1] - a[1])[0][0];
  return {
    instruction: "¿Cuál es la moda de estos datos?",
    display: `${c.frase(valores.length)}: ${valores.join(", ")}.`,
    options: opcionesNum(moda, [fm, rival, Math.max(...valores), mediana(valores), moda + 1, moda - 1, Math.min(...valores)], true),
    correct: fmt(moda),
    hint: "La moda es el dato que más se repite. Cuenta cuántas veces sale cada uno.",
    explain: `El ${moda} aparece ${fm} veces, más que ningún otro (el ${rival}, ${f.get(rival)} ${f.get(rival) === 1 ? "vez" : "veces"}). La moda es ${moda}; el ${fm} es cuántas veces se repite.`,
  };
}

// Datos cuya media es entera (o con media unidad si L.medias = 2).
function datosConMedia(L, c, n) {
  for (let t = 0; t < 200; t++) {
    const xs = datos(L, c, n);
    const s = suma(xs);
    // A veces (nivel normal, n par) la media acaba en ,5.
    const div = L.medias === 2 && n % 2 === 0 && Math.random() < 0.3 ? n / 2 : n;
    if (s % div === 0) return xs;
    // Ajustar el último dato para que la división sea exacta.
    const falta = (div - (s % div)) % div;
    const nuevo = xs[n - 1] + falta;
    if (nuevo <= c.max) {
      xs[n - 1] = nuevo;
      return xs;
    }
  }
  const m = randInt(c.min, c.max);
  return Array(n).fill(m);
}

function genMedia(L) {
  const c = contexto(L);
  const n = randInt(...L.n);
  const xs = datosConMedia(L, c, n);
  const s = suma(xs);
  const m = s / n;
  return {
    instruction: "¿Cuál es la media de estos datos?",
    display: `${c.frase(n)}: ${xs.join(", ")}.`,
    options: opcionesNum(m, [s, mediana(xs), s / (n - 1), m + 1, m - 1, Math.round(m) + 2], L.medias === 1),
    correct: fmt(m),
    hint: `Suma todos los datos y divide entre cuántos hay (${n}).`,
    explain: `Suma: ${xs.join(" + ")} = ${s}. Hay ${n} datos: ${s} : ${n} = ${fmt(m)}.`,
  };
}

function genMediana(L) {
  const c = contexto(L);
  const par = !L.pequeños && Math.random() < 0.4;
  let n = randInt(...L.n);
  if (par !== (n % 2 === 0)) n += 1;
  let xs;
  do xs = datos(L, c, n);
  while (xs[Math.floor(n / 2)] === mediana(xs));
  const o = ordenar(xs);
  const me = mediana(xs);
  const c2 = Math.floor(n / 2);
  return {
    instruction: "¿Cuál es la mediana de estos datos?",
    display: `${c.frase(n)}: ${xs.join(", ")}.`,
    // Errores: no ordenar, hacer la media, quedarse con uno de los centrales.
    options: opcionesNum(me, [xs[c2], suma(xs) / n, par ? o[c2] : o[c2 + 1], o[c2 - 1], me + 1, me - 1, me + 2], L.medias === 1),
    correct: fmt(me),
    hint: `Primero ordena los datos de menor a mayor. ${par ? "Como hay un número par de datos, haz la media de los dos del centro." : "Después busca el que queda justo en el centro."}`,
    explain: par
      ? `Ordenados: ${o.join(", ")}. En el centro están el ${o[c2 - 1]} y el ${o[c2]}: (${o[c2 - 1]} + ${o[c2]}) : 2 = ${fmt(me)}.`
      : `Ordenados: ${o.join(", ")}. El del centro (hay ${c2} a cada lado) es el ${me}. Sin ordenar, el del centro sería el ${xs[c2]}: por eso hay que ordenar.`,
  };
}

function genRango(L) {
  const c = contexto(L);
  const n = randInt(...L.n);
  let xs;
  do xs = datos(L, c, n);
  while (Math.max(...xs) === Math.min(...xs));
  const ma = Math.max(...xs);
  const mi = Math.min(...xs);
  return {
    instruction: "¿Cuál es el rango de estos datos?",
    display: `${c.frase(n)}: ${xs.join(", ")}.`,
    options: opcionesNum(ma - mi, [ma, ma + mi, mi, xs[n - 1] - xs[0], ma - mi + 1]),
    correct: fmt(ma - mi),
    hint: "Busca el dato mayor y el menor y réstalos.",
    explain: `Mayor: ${ma}. Menor: ${mi}. Rango: ${ma} − ${mi} = ${ma - mi}.`,
  };
}

// Ampliación (altas): el dato que falta y el efecto de un dato atípico.
function genFalta() {
  const n = randInt(4, 6);
  const m = randInt(5, 8);
  let xs;
  let x;
  do {
    xs = Array.from({ length: n - 1 }, () => randInt(3, 10));
    x = m * n - suma(xs);
  } while (x < 1 || x > 10);
  return {
    instruction: "Ampliación · el dato que falta:",
    display: `Ana ha sacado ${xs.join(", ")} y una nota más en ${n} exámenes. Su media es ${m}. ¿Qué nota le falta?`,
    options: opcionesNum(x, [m, x + 1, x - 1, m * n, suma(xs) / (n - 1)]),
    correct: fmt(x),
    hint: `Si la media es ${m} con ${n} notas, todas juntas suman ${m} × ${n}.`,
    explain: `Entre todas suman ${m} × ${n} = ${m * n}. Las que conocemos suman ${suma(xs)}. Falta ${m * n} − ${suma(xs)} = ${x}.`,
  };
}

function genAtipico() {
  let xs;
  do xs = Array.from({ length: 5 }, () => randInt(2, 9));
  while (suma(xs) % 5 !== 0);
  // Un dato muy grande que deja la nueva media exacta.
  let extra = 30;
  while ((suma(xs) + extra) % 6 !== 0) extra++;
  const ys = xs.concat(extra);
  const [m1, m2] = [suma(xs) / 5, suma(ys) / 6];
  const [d1, d2] = [mediana(xs), mediana(ys)];
  return {
    instruction: "Ampliación · un dato muy distinto:",
    display: `Datos: ${xs.join(", ")}. Si añadimos el ${extra}, ¿qué cambia más?`,
    options: ["La media", "La mediana", "Las dos cambian igual"],
    keepOrder: true,
    correct: "La media",
    hint: "Calcula la media y la mediana antes y después de añadir el dato.",
    explain: `Antes: media ${fmt(m1)}, mediana ${fmt(d1)}. Después: media ${fmt(m2)}, mediana ${fmt(d2)}. Un dato muy grande arrastra la media; la mediana casi no se mueve.`,
  };
}

const MODE_GROUPS = {
  graficos: [genGrafico],
  frecuencias: [genFrecuencia],
  moda: [genModa],
  media: [genMedia],
  mediana: [genMediana],
  rango: [genRango],
};
// La mezcla de 5º (libro de 5º: diagramas de barras, moda y media): sin
// los modos de 6º.
const MEZCLA = ["graficos", "moda", "media"];

const ACS_GENERATORS = [genGrafico, genGrafico, genFrecuencia, genModa];

const ESTADISTICA_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Leer un diagrama de barras, contar y la moda (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja leer diagramas de barras con la escala de 1 en 1, contar cuántas veces aparece un dato y encontrar el que más se repite, con pocos datos y números pequeños.",
    example: "¿Cuántos alumnos eligieron fresa? → la barra llega al 6",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantienen los mismos contenidos, pero con una tipografía más legible para leer los datos y los gráficos.",
    example: "4, 6, 8 → media 6 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Gráficos» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todos los contenidos, con pocos datos y la pista a la vista",
    text: "Se trabajan todos los modos con 4 o 5 datos pequeños, medias exactas (sin decimales), escala de 1 en 1 en los gráficos y la pista abierta desde el principio. Sin «Mezcla». En Explora se ve la media como un reparto de cubos.",
    example: "Media de 2, 4, 6 → 12 : 3 = 4. Pista: suma y divide entre 3",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Más datos, frecuencia relativa y problemas de ampliación",
    text: "Empieza en <strong>Media</strong> con más datos y medias con decimales; añade la frecuencia relativa, el dato que falta para tener una media y qué le pasa a la media y a la mediana con un dato muy distinto.",
    example: "Notas 6, 7, 9 y ?; media 7 → falta un 6",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Cuál es la moda? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, ESTADISTICA_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), ESTADISTICA_DIFFICULTY_EXPLANATIONS);

  const ej = document.getElementById("ejemplo-barras");
  if (ej) ej.innerHTML = graficoSVG(["Rojo", "Azul", "Verde", "Amarillo"], [5, 8, 3, 6], 1, "Votos");
  if (document.getElementById("es-barras")) initExplore();
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
// Torres de cubos con la línea de la media.
function svgTorres(vals, media) {
  const maxV = Math.max(...vals);
  const c = maxV > 10 ? 12 : 22;
  const W = vals.length * (c + 14) + 64;
  const H = maxV * c + 30;
  const base = H - 10;
  let out = "";
  vals.forEach((v, i) => {
    const x = 54 + i * (c + 14);
    for (let k = 0; k < v; k++) out += `<rect x="${x}" y="${base - (k + 1) * c}" width="${c}" height="${c}" fill="${k < media ? "var(--color-teal-tint)" : "var(--color-rose-tint)"}" stroke="var(--color-indigo)" stroke-width="1.5"/>`;
  });
  const ym = base - media * c;
  out += `<line x1="46" y1="${ym}" x2="${W - 4}" y2="${ym}" stroke="var(--color-plum)" stroke-width="3" stroke-dasharray="6 4"/>`;
  out += `<text x="42" y="${ym + 4}" text-anchor="end" font-size="12" font-weight="800" fill="var(--color-plum)">${fmt(media)}</text>`;
  out += `<line x1="46" y1="${base}" x2="${W - 4}" y2="${base}" stroke="var(--text)" stroke-width="2"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="Torres de cubos y la media">${out}</svg>`;
}

function initExplore() {
  const lim = (v, a, z) => Math.max(a, Math.min(z, v));

  // 1. Construir el diagrama de barras.
  const cats = ["Fresa", "Chocolate", "Vainilla", "Limón"];
  const votos = [5, 8, 3, 6];
  function renderBarras() {
    votos.forEach((v, i) => (document.getElementById(`es-v${i}`).textContent = v));
    document.getElementById("es-barras-draw").innerHTML = graficoSVG(cats, votos, 1, "Votos");
    const total = suma(votos);
    const max = Math.max(...votos);
    const modas = cats.filter((c, i) => votos[i] === max);
    document.getElementById("es-barras-tabla").innerHTML = `<table class="rules-table es-frec"><tr><th>Sabor</th><th>Frecuencia</th></tr>${cats.map((c, i) => `<tr><td>${c}</td><td>${votos[i]}</td></tr>`).join("")}<tr><td><strong>Total</strong></td><td><strong>${total}</strong></td></tr></table>`;
    document.getElementById("es-barras-msg").innerHTML =
      max === 0
        ? "Todavía no hay votos."
        : modas.length === cats.length
          ? `Todos los sabores tienen ${max} votos: <strong>no hay moda</strong>.`
          : modas.length > 1
            ? `Hay empate: <strong>${modas.join(" y ")}</strong> tienen ${max} votos. Hay ${modas.length} modas.`
            : `La <strong>moda</strong> es ${modas[0].toLowerCase()}: es la barra más alta (${max} votos de ${total}). La moda es el sabor, no el número.`;
  }
  document.querySelectorAll("[data-es-i]").forEach((b) => b.addEventListener("click", () => {
    const i = Number(b.dataset.esI);
    votos[i] = lim(votos[i] + Number(b.dataset.esD), 0, 10);
    renderBarras();
  }));

  // 2. La media como reparto.
  const torres = [2, 6, 3, 5, 4];
  let atipico = false;
  function renderMedia() {
    torres.forEach((v, i) => (document.getElementById(`es-t${i}`).textContent = v));
    const xs = atipico ? torres.concat(20) : torres;
    const m = suma(xs) / xs.length;
    document.getElementById("es-atip").textContent = atipico ? "Quitar el dato 20" : "Añadir un dato muy grande (20)";
    document.getElementById("es-media-draw").innerHTML = svgTorres(xs, m);
    const o = ordenar(xs);
    document.getElementById("es-media-msg").innerHTML =
      `Suma: ${xs.join(" + ")} = ${suma(xs)}. Media: ${suma(xs)} : ${xs.length} ${Number.isInteger(m * 100) ? "=" : "≈"} <strong>${fmt(m)}</strong>. ` +
      (atipico
        ? `Ordenados: ${o.join(", ")}; mediana = <strong>${fmt(mediana(xs))}</strong>. Sin el 20 la media era ${fmt(suma(torres) / torres.length)} y la mediana ${fmt(mediana(torres))}: el dato grande arrastra la media, pero la mediana casi no cambia.`
        : `Si repartes los cubos para que todas las torres sean iguales, cada una tendría ${fmt(m)}: eso es la media (la línea). Mediana: ordenados ${o.join(", ")}, el del centro es el ${fmt(mediana(xs))}.`);
  }
  document.querySelectorAll("[data-es-t]").forEach((b) => b.addEventListener("click", () => {
    const i = Number(b.dataset.esT);
    torres[i] = lim(torres[i] + Number(b.dataset.esD), 1, 9);
    renderMedia();
  }));
  document.getElementById("es-atip").addEventListener("click", () => { atipico = !atipico; renderMedia(); });

  renderBarras();
  renderMedia();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-estadistica"),
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
  let mode = "graficos";
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

    if (diff.is("altas")) setActiveMode("media");
    else if (acs) setActiveMode("graficos");
    else if ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla") setActiveMode("graficos");

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function generatorsFor() {
    if (diff.is("acs")) return ACS_GENERATORS;
    if (mode === "mezcla") return MODE_GROUPS[pick(MEZCLA)];
    if (diff.is("altas") && mode === "media") return [genMedia, genMedia, genFalta, genAtipico];
    return MODE_GROUPS[mode];
  }

  function pickQuestion() {
    let q;
    let tries = 0;
    do {
      q = pick(generatorsFor())(level());
      tries++;
    } while (q.instruction + q.display + (q.visual || "") === lastKey && tries < 10);
    lastKey = q.instruction + q.display + (q.visual || "");
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
    AppProgress.record("estadistica", isCorrect);
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
