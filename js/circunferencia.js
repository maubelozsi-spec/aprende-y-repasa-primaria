// ============================================================
// Circunferencia y círculo (6º SdA 8: la circunferencia y el círculo,
// sus elementos y la longitud de la circunferencia con π; el área
// del círculo, como ampliación)
// - Explora: radio y diámetro, desenrollar la circunferencia y el
//   área del círculo. No guarda progreso.
// - Práctica: los círculos se generan al azar, dibujados con sus
//   medidas, y cada pregunta trae su pista y su explicación. Solo la
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

// 1234,56 → "1.234,56"
function fmt(n) {
  const r = Math.round(n * 100) / 100;
  const [ent, dec] = String(Math.abs(r)).split(".");
  const conPuntos = ent.length > 3 ? ent.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ent;
  return `${r < 0 ? "−" : ""}${conPuntos}${dec ? `,${dec}` : ""}`;
}

function conUnidad(correct, valores, u) {
  return uniqueOptions(`${fmt(correct)} ${u}`, valores.filter((v) => v > 0 && Number.isFinite(v)).map((v) => `${fmt(v)} ${u}`));
}

// π × x con π = 3,14, sin errores de coma flotante.
const pi = (x) => Math.round(314 * x) / 100;

// ------------------------------------------------------------
// Dibujo
// ------------------------------------------------------------
const rad = (g) => (g * Math.PI) / 180;

// Circunferencia con un elemento resaltado.
// elemento: centro, radio, diametro, cuerda, arco, sector, semicirculo,
// tangente, secante, exterior, corona. medida: texto junto al radio o al diámetro.
function svgCirculo({ elemento = null, medida = null, relleno = false, giro = null } = {}) {
  const S = 240;
  const c = S / 2;
  const R = 78;
  const g = giro === null ? randInt(0, 359) : giro;
  const P = (ang, r = R) => [c + r * Math.cos(rad(ang)), c - r * Math.sin(rad(ang))];
  const col = "var(--color-plum)";
  let out = "";
  if (elemento === "corona") {
    out += `<circle cx="${c}" cy="${c}" r="${R}" fill="var(--color-teal-tint)" stroke="var(--color-indigo)" stroke-width="3"/>`;
    out += `<circle cx="${c}" cy="${c}" r="${R * 0.55}" fill="var(--surface)" stroke="var(--color-indigo)" stroke-width="3"/>`;
  } else {
    out += `<circle cx="${c}" cy="${c}" r="${R}" fill="${relleno ? "var(--color-indigo-tint)" : "none"}" stroke="var(--color-indigo)" stroke-width="3"/>`;
  }
  const linea = ([x1, y1], [x2, y2], color = col, w = 4) => `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  const texto = ([x, y], t, color = col) => `<text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="800" fill="${color}" stroke="var(--surface)" stroke-width="4" paint-order="stroke">${t}</text>`;
  if (elemento === "radio") {
    out += linea([c, c], P(g));
    if (medida) out += texto(P(g, R / 2 + 2).map((v, i) => v + (i ? -12 : 0)), medida);
  } else if (elemento === "diametro") {
    out += linea(P(g), P(g + 180));
    if (medida) out += texto(P(g + 90, 18), medida);
  } else if (elemento === "cuerda") {
    out += linea(P(g), P(g + randInt(70, 140)));
  } else if (elemento === "arco") {
    const a = randInt(60, 120);
    const [x1, y1] = P(g);
    const [x2, y2] = P(g + a);
    out += `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${R} ${R} 0 0 0 ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round"/>`;
  } else if (elemento === "sector" || elemento === "semicirculo") {
    const a = elemento === "sector" ? randInt(50, 110) : 180;
    const [x1, y1] = P(g);
    const [x2, y2] = P(g + a);
    out += `<path d="M ${c} ${c} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${R} ${R} 0 0 0 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="var(--color-plum-tint)" stroke="${col}" stroke-width="3"/>`;
  } else if (elemento === "tangente" || elemento === "secante" || elemento === "exterior") {
    const dist = elemento === "tangente" ? R : elemento === "secante" ? R * 0.5 : R * 1.25;
    const [px, py] = P(g, dist);
    // Media longitud para que la recta no se salga del dibujo.
    const medio = elemento === "tangente" ? 80 : elemento === "secante" ? 100 : 62;
    const dx = Math.cos(rad(g + 90)) * medio;
    const dy = -Math.sin(rad(g + 90)) * medio;
    out += linea([px - dx, py - dy], [px + dx, py + dy]);
  }
  out += `<circle cx="${c}" cy="${c}" r="${elemento === "centro" ? 7 : 4}" fill="${elemento === "centro" ? col : "var(--text)"}"/>`;
  return `<svg viewBox="0 0 ${S} ${S}" width="${S}" style="max-width:100%" role="img" aria-label="Circunferencia">${out}</svg>`;
}

// ------------------------------------------------------------
// Niveles
// ------------------------------------------------------------
const LEVELS = {
  normal: { max: 12, dec: true },
  facil: { max: 5, dec: false },
  acs: { max: 10, dec: false },
  altas: { max: 25, dec: true, altas: true },
};

// ------------------------------------------------------------
// Generadores
// ------------------------------------------------------------
const ELEMENTOS = {
  centro: ["Centro", "el centro", "el punto del medio; todos los puntos de la circunferencia están a la misma distancia de él"],
  radio: ["Radio", "un radio", "va del centro a la circunferencia"],
  diametro: ["Diámetro", "un diámetro", "va de un lado a otro de la circunferencia pasando por el centro; mide dos radios"],
  cuerda: ["Cuerda", "una cuerda", "une dos puntos de la circunferencia sin pasar por el centro"],
  arco: ["Arco", "un arco", "un trozo de la circunferencia, de la línea curva"],
  sector: ["Sector circular", "un sector circular", "un trozo del círculo entre dos radios, como una porción de pizza"],
  semicirculo: ["Semicírculo", "un semicírculo", "la mitad del círculo, cortada por un diámetro"],
  tangente: ["Recta tangente", "una recta tangente", "toca la circunferencia en un solo punto"],
  secante: ["Recta secante", "una recta secante", "corta la circunferencia en dos puntos"],
  exterior: ["Recta exterior", "una recta exterior", "no toca la circunferencia"],
  corona: ["Corona circular", "una corona circular", "la parte entre dos circunferencias con el mismo centro, como un anillo"],
};

function genElementos(L) {
  const claves = L === LEVELS.acs || L === LEVELS.facil ? ["centro", "radio", "diametro", "cuerda", "arco"] : Object.keys(ELEMENTOS);
  const k = pick(claves);
  const [nombre, conArticulo, porque] = ELEMENTOS[k];
  // Las opciones, de la misma familia: líneas, trozos o rectas.
  const familias = [["radio", "diametro", "cuerda", "arco", "centro"], ["sector", "semicirculo", "corona", "arco"], ["tangente", "secante", "exterior", "diametro"]];
  const fam = familias.find((f) => f.includes(k));
  const otros = [...shuffle(fam), ...shuffle(claves)].filter((x) => x !== k && claves.includes(x));
  return {
    instruction: "¿Cómo se llama lo que está en color morado?",
    display: nombre,
    visual: svgCirculo({ elemento: k }),
    soloVisual: true,
    options: uniqueOptions(nombre, otros.map((x) => ELEMENTOS[x][0])),
    correct: nombre,
    hint: "Fíjate en si pasa por el centro, si une dos puntos de la circunferencia o si es un trozo de la curva o del círculo.",
    explain: `Es ${conArticulo}: ${porque}.`,
  };
}

function genCircOCirculo() {
  const casos = [
    ["el borde de una moneda", "Circunferencia"],
    ["un aro de gimnasia", "Circunferencia"],
    ["la superficie de una pizza", "Círculo"],
    ["un posavasos redondo", "Círculo"],
    ["un anillo muy fino", "Circunferencia"],
    ["la tapa de un bote", "Círculo"],
    ["el contorno de un reloj", "Circunferencia"],
    ["una galleta redonda", "Círculo"],
  ];
  const [txt, sol] = pick(casos);
  return {
    instruction: "¿Se parece más a una circunferencia o a un círculo?",
    display: `${txt[0].toUpperCase()}${txt.slice(1)}.`,
    options: ["Circunferencia", "Círculo"],
    keepOrder: true,
    correct: sol,
    hint: "La circunferencia es solo la línea curva, el borde. El círculo es toda la superficie de dentro.",
    explain: sol === "Circunferencia" ? "Es una circunferencia: solo es la línea, el borde, sin nada dentro." : "Es un círculo: es toda la superficie, con el borde y lo de dentro.",
  };
}

function genRadioDiametro(L) {
  const dec = L.dec && Math.random() < 0.3;
  const r = dec ? randInt(1, L.max) + 0.5 : randInt(1, L.max);
  const d = r * 2;
  const deRadio = Math.random() < 0.5;
  if (deRadio)
    return {
      instruction: "Si el radio mide lo que se ve, ¿cuánto mide el diámetro?",
      display: `${fmt(r)} cm`,
      visual: svgCirculo({ elemento: "radio", medida: `${fmt(r)} cm` }),
      soloVisual: true,
      options: conUnidad(d, [r, L.dec ? r / 2 : r + 1, r + 2, r * 3, d + 1], "cm"),
      correct: `${fmt(d)} cm`,
      hint: "El diámetro mide lo mismo que dos radios.",
      explain: `Diámetro = 2 × radio = 2 × ${fmt(r)} = ${fmt(d)} cm.`,
    };
  return {
    instruction: "Si el diámetro mide lo que se ve, ¿cuánto mide el radio?",
    display: `${fmt(d)} cm`,
    visual: svgCirculo({ elemento: "diametro", medida: `${fmt(d)} cm` }),
    soloVisual: true,
    options: conUnidad(r, [d, d * 2, r + 1, r - 1, d - 2], "cm"),
    correct: `${fmt(r)} cm`,
    hint: "El radio es la mitad del diámetro.",
    explain: `Radio = diámetro ÷ 2 = ${fmt(d)} ÷ 2 = ${fmt(r)} cm.`,
  };
}

function genLongitud(L) {
  const conDiametro = Math.random() < 0.5;
  const r = L === LEVELS.facil ? randInt(1, 5) : L.dec && Math.random() < 0.2 ? randInt(1, 9) + 0.5 : randInt(1, L.max);
  const d = 2 * r;
  const Lc = pi(d);
  const u = pick(["cm", "m"]);
  const medida = conDiametro ? `${fmt(d)} ${u}` : `${fmt(r)} ${u}`;
  return {
    instruction: `¿Cuánto mide la circunferencia? (π = 3,14)`,
    display: medida,
    visual: svgCirculo({ elemento: conDiametro ? "diametro" : "radio", medida }),
    soloVisual: true,
    options: conUnidad(Lc, [pi(r), pi(r * r), pi(2 * d), d * 3, Lc + 1], u),
    correct: `${fmt(Lc)} ${u}`,
    hint: conDiametro ? "Longitud = π × diámetro = 3,14 × d." : "Longitud = 2 × π × radio. También puedes calcular primero el diámetro (2 × r) y multiplicarlo por 3,14.",
    explain: conDiametro
      ? `L = 3,14 × ${fmt(d)} = ${fmt(Lc)} ${u}. Es un poco más de 3 veces el diámetro (3 × ${fmt(d)} = ${fmt(3 * d)}).`
      : `Diámetro: 2 × ${fmt(r)} = ${fmt(d)}. L = 3,14 × ${fmt(d)} = ${fmt(Lc)} ${u}.${pi(r) !== Lc ? ` Si se olvida el 2 sale ${fmt(pi(r))}, que es solo la mitad.` : ""}`,
  };
}

// Estimar: la circunferencia mide un poco más de 3 diámetros.
function genEstimar(L) {
  const d = randInt(2, L === LEVELS.facil ? 10 : 30);
  const correct = `Unos ${3 * d} cm`;
  return {
    instruction: "Sin calcular exacto: ¿cuánto mide, más o menos, su circunferencia?",
    display: `Un plato tiene ${d} cm de diámetro.`,
    options: uniqueOptions(correct, [`Unos ${d} cm`, `Unos ${2 * d} cm`, `Unos ${6 * d} cm`, `Unos ${d + 3} cm`]),
    correct,
    hint: "La circunferencia mide un poco más de 3 veces el diámetro (π ≈ 3,14).",
    explain: `Un poco más de 3 diámetros: 3 × ${d} = ${3 * d}.${L === LEVELS.facil ? " En realidad, un poco más, porque π es 3,14…" : ` El valor exacto es 3,14 × ${d} = ${fmt(pi(d))} cm.`}`,
  };
}

function genProblemas(L) {
  const tipo = pick(L === LEVELS.facil ? ["rueda", "fuente", "contenedor"] : L.altas ? ["rueda", "fuente", "contenedor", "inversa", "vueltas"] : ["rueda", "fuente", "contenedor", "inversa"]);
  if (tipo === "rueda") {
    const d = pick(L === LEVELS.facil ? [1, 2] : [0.5, 1, 1.5, 2]);
    const v = randInt(2, L === LEVELS.facil ? 5 : 20);
    const una = pi(d);
    const total = Math.round(una * v * 100) / 100;
    return {
      instruction: "Resuelve el problema (π = 3,14):",
      display: `La rueda de una bici mide ${fmt(d)} m de diámetro. ¿Cuántos metros avanza la bici cuando la rueda da ${v} vueltas?`,
      options: conUnidad(total, [d * v, una, Math.round(pi(d / 2) * v * 100) / 100, total + d], "m"),
      correct: `${fmt(total)} m`,
      hint: "En cada vuelta la bici avanza lo que mide la circunferencia de la rueda.",
      explain: `Una vuelta: 3,14 × ${fmt(d)} = ${fmt(una)} m. ${v} vueltas: ${fmt(una)} × ${v} = ${fmt(total)} m.`,
    };
  }
  if (tipo === "fuente") {
    const r = randInt(1, L === LEVELS.facil ? 5 : 10);
    const Lc = pi(2 * r);
    return {
      instruction: "Resuelve el problema (π = 3,14):",
      display: `Una fuente redonda tiene ${r} m de radio. Se quiere rodear con una valla. ¿Cuántos metros de valla hacen falta?`,
      options: conUnidad(Lc, [pi(r), pi(r * r), 2 * r, Lc * 2], "m"),
      correct: `${fmt(Lc)} m`,
      hint: "La valla rodea la fuente: es la longitud de la circunferencia. ¡Te dan el radio!",
      explain: `Diámetro: 2 × ${r} = ${2 * r} m. Longitud: 3,14 × ${2 * r} = ${fmt(Lc)} m.`,
    };
  }
  if (tipo === "contenedor") {
    // Reto de la UDI: los contenedores del punto limpio.
    const d = pick(L === LEVELS.facil ? [1, 2] : [0.5, 1, 1.5, 2]);
    const Lc = pi(d);
    return {
      instruction: "Resuelve el problema (π = 3,14):",
      display: `Un contenedor cilíndrico del punto limpio mide ${fmt(d)} m de diámetro. ¿Cuántos metros de cinta hacen falta para darle una vuelta?`,
      options: conUnidad(Lc, [pi(d / 2), d * 2, pi(d * d), Lc + 1], "m"),
      correct: `${fmt(Lc)} m`,
      hint: "La cinta da una vuelta: es la longitud de la circunferencia, π × diámetro.",
      explain: `3,14 × ${fmt(d)} = ${fmt(Lc)} m.`,
    };
  }
  if (tipo === "inversa") {
    const d = randInt(2, 20);
    const Lc = pi(d);
    return {
      instruction: "Resuelve el problema (π = 3,14):",
      display: `Una circunferencia mide ${fmt(Lc)} cm. ¿Cuánto mide su diámetro?`,
      options: conUnidad(d, [d / 2, d * 2, Lc - 3.14, d + 1], "cm"),
      correct: `${fmt(d)} cm`,
      hint: "Longitud = 3,14 × diámetro. Para saber el diámetro, divide la longitud entre 3,14.",
      explain: `${fmt(Lc)} ÷ 3,14 = ${d} cm. Comprobación: 3,14 × ${d} = ${fmt(Lc)}.`,
    };
  }
  // Altas: vueltas que da una rueda en un recorrido.
  const d = pick([0.5, 1, 2]);
  const v = randInt(10, 100);
  const dist = Math.round(pi(d) * v * 100) / 100;
  return {
    instruction: "Resuelve el problema (π = 3,14):",
    display: `Una rueda de ${fmt(d)} m de diámetro ha recorrido ${fmt(dist)} m. ¿Cuántas vueltas ha dado?`,
    options: uniqueOptions(`${v} vueltas`, [`${v * 2} vueltas`, `${Math.round(v / 2)} vueltas`, `${v + 10} vueltas`, `${Math.round(dist / d)} vueltas`]),
    correct: `${v} vueltas`,
    hint: "Calcula cuánto avanza en una vuelta y mira cuántas veces cabe en el recorrido.",
    explain: `Una vuelta: 3,14 × ${fmt(d)} = ${fmt(pi(d))} m. Vueltas: ${fmt(dist)} ÷ ${fmt(pi(d))} = ${v}.`,
  };
}

// Ampliación: área del círculo.
function genArea(L) {
  const corona = L.altas && Math.random() < 0.3;
  if (corona) {
    const R = randInt(4, 10);
    const r = randInt(1, R - 2);
    const A = pi(R * R - r * r);
    return {
      instruction: "¿Cuál es el área de la corona circular? (π = 3,14)",
      display: `Radio grande: ${R} cm. Radio pequeño: ${r} cm.`,
      visual: svgCirculo({ elemento: "corona", giro: 0 }),
      soloVisual: false,
      options: conUnidad(A, [pi((R - r) * (R - r)), pi(R * R), pi(2 * (R - r)), A + 3.14], "cm²"),
      correct: `${fmt(A)} cm²`,
      hint: "Calcula el área del círculo grande y quítale la del pequeño.",
      explain: `Grande: 3,14 × ${R} × ${R} = ${fmt(pi(R * R))}. Pequeño: 3,14 × ${r} × ${r} = ${fmt(pi(r * r))}. Corona: ${fmt(pi(R * R))} − ${fmt(pi(r * r))} = ${fmt(A)} cm².`,
    };
  }
  const conDiametro = Math.random() < 0.35;
  const r = randInt(1, L === LEVELS.facil ? 5 : L.altas ? 20 : 10);
  const d = 2 * r;
  const A = pi(r * r);
  const medida = conDiametro ? `${d} cm` : `${r} cm`;
  return {
    instruction: "¿Cuál es el área del círculo? (π = 3,14)",
    display: medida,
    visual: svgCirculo({ elemento: conDiametro ? "diametro" : "radio", medida, relleno: true }),
    soloVisual: true,
    options: conUnidad(A, [pi(2 * r), pi(d * d), pi(2 * r * r), A + 3.14], "cm²"),
    correct: `${fmt(A)} cm²`,
    hint: `Área = π × radio × radio.${conDiametro ? " ¡Te dan el diámetro: calcula antes el radio!" : ""}`,
    explain: `${conDiametro ? `Radio: ${d} ÷ 2 = ${r}. ` : ""}A = 3,14 × ${r} × ${r} = 3,14 × ${r * r} = ${fmt(A)} cm².${conDiametro ? ` Con el diámetro en vez del radio saldría ${fmt(pi(d * d))}, cuatro veces más.` : ""}`,
  };
}

// Discalculia: sin decimales. La circunferencia mide «unas 3 veces»
// el diámetro (π ≈ 3), y se dice siempre que es aproximado.
const unos = (n, u) => `Unos ${fmt(n)} ${u}`;
const opcionesUnos = (correct, valores, u) => uniqueOptions(unos(correct, u), valores.filter((v) => v > 0 && v !== correct).map((v) => unos(v, u)));

function genLongitudAprox() {
  const conDiametro = Math.random() < 0.5;
  const r = randInt(1, 5);
  const d = 2 * r;
  const u = pick(["cm", "m"]);
  const medida = conDiametro ? `${d} ${u}` : `${r} ${u}`;
  return {
    instruction: "¿Cuánto mide, más o menos, la circunferencia? (π ≈ 3)",
    display: medida,
    visual: svgCirculo({ elemento: conDiametro ? "diametro" : "radio", medida }),
    soloVisual: true,
    options: opcionesUnos(3 * d, [d, 3 * r, 6 * d, 2 * d, 3 * d + 3], u),
    correct: unos(3 * d, u),
    hint: conDiametro ? "La circunferencia mide unas 3 veces el diámetro: multiplica el diámetro por 3." : "Primero el diámetro (2 × radio). Después, unas 3 veces el diámetro.",
    explain: `${conDiametro ? "" : `Diámetro: 2 × ${r} = ${d}. `}3 × ${d} = ${3 * d}: mide unos ${3 * d} ${u}. En realidad, un poco más, porque π es 3,14…${conDiametro ? "" : ` Si se olvida el 2 sale ${3 * r}, solo la mitad.`}`,
  };
}

function genProblemasAprox() {
  const tipo = pick(["rueda", "fuente", "contenedor"]);
  const instruction = "Resuelve el problema, más o menos (π ≈ 3):";
  if (tipo === "rueda") {
    const d = pick([1, 2]);
    const v = randInt(2, 5);
    return {
      instruction,
      display: `La rueda de una bici mide ${d} m de diámetro. ¿Cuántos metros avanza, más o menos, cuando la rueda da ${v} vueltas?`,
      options: opcionesUnos(3 * d * v, [d * v, 3 * d, 2 * d * v, 3 * d * v + 3], "m"),
      correct: unos(3 * d * v, "m"),
      hint: "En cada vuelta la bici avanza lo que mide la circunferencia de la rueda: unas 3 veces el diámetro.",
      explain: `Una vuelta: 3 × ${d} = ${3 * d} m. ${v} vueltas: ${3 * d} × ${v} = ${3 * d * v} m. Unos ${3 * d * v} m (un poco más, porque π es 3,14…).`,
    };
  }
  if (tipo === "fuente") {
    const r = randInt(1, 5);
    return {
      instruction,
      display: `Una fuente redonda tiene ${r} m de radio. ¿Cuántos metros de valla hacen falta, más o menos, para rodearla?`,
      options: opcionesUnos(6 * r, [3 * r, 2 * r, 3 * r * r, 6 * r + 2], "m"),
      correct: unos(6 * r, "m"),
      hint: "¡Te dan el radio! Calcula el diámetro (2 × radio) y después unas 3 veces el diámetro.",
      explain: `Diámetro: 2 × ${r} = ${2 * r} m. Valla: 3 × ${2 * r} = ${6 * r} m. Unos ${6 * r} m (un poco más).`,
    };
  }
  const d = pick([1, 2]);
  return {
    instruction,
    display: `Un contenedor cilíndrico del punto limpio mide ${d} m de diámetro. ¿Cuántos metros de cinta hacen falta, más o menos, para darle una vuelta?`,
    options: opcionesUnos(3 * d, [d, 2 * d, 6 * d, 3 * d + 1], "m"),
    correct: unos(3 * d, "m"),
    hint: "La cinta da una vuelta: unas 3 veces el diámetro.",
    explain: `3 × ${d} = ${3 * d} m. Unos ${3 * d} m (un poco más, porque π es 3,14…).`,
  };
}

function genAreaAprox() {
  const r = randInt(1, 5);
  return {
    instruction: "¿Cuál es, más o menos, el área del círculo? (π ≈ 3)",
    display: `${r} cm`,
    visual: svgCirculo({ elemento: "radio", medida: `${r} cm`, relleno: true }),
    soloVisual: true,
    options: opcionesUnos(3 * r * r, [6 * r, r * r, 3 * r, 12 * r * r], "cm²"),
    correct: unos(3 * r * r, "cm²"),
    hint: "Área = unos 3 × radio × radio.",
    explain: `3 × ${r} × ${r} = 3 × ${r * r} = ${3 * r * r}. Unos ${3 * r * r} cm² (un poco más, porque π es 3,14…).`,
  };
}

const MODE_GROUPS = {
  elementos: [genElementos, genElementos, genCircOCirculo],
  radiodiametro: [genRadioDiametro],
  longitud: [genLongitud, genLongitud, genEstimar],
  problemas: [genProblemas],
  area: [genArea],
};

// El área del círculo es ampliación: no entra en la mezcla.
const MEZCLA = ["elementos", "radiodiametro", "longitud", "problemas"];

const MODE_GROUPS_DISCALCULIA = {
  ...MODE_GROUPS,
  longitud: [genLongitudAprox, genLongitudAprox, genEstimar],
  problemas: [genProblemasAprox],
  area: [genAreaAprox],
};

const ACS_GENERATORS = [genElementos, genCircOCirculo, genRadioDiametro, genEstimar];

const CIRCUNFERENCIA_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Circunferencia, círculo, radio y diámetro (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja distinguir circunferencia y círculo, reconocer el centro, el radio, el diámetro, la cuerda y el arco, pasar de radio a diámetro con números enteros y estimar que la circunferencia mide unas 3 veces el diámetro, sin calcular con 3,14.",
    example: "Radio 5 cm → diámetro = 5 × 2 = 10 cm",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las preguntas y las medidas.",
    example: "Radio 5 cm → diámetro = 10 cm → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «Elementos» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todos los contenidos, sin decimales y con la pista a la vista",
    text: "Se trabajan todos los modos sin decimales: la circunferencia mide <strong>unas 3 veces el diámetro</strong> (π ≈ 3) y las respuestas son aproximadas («unos 12 cm»). Radios de 1 a 5 y la pista abierta desde el principio. Sin «Mezcla». En Explora se ve que la circunferencia mide un poco más de 3 diámetros.",
    example: "Diámetro 4 cm → 3 × 4 = unos 12 cm",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Problemas al revés, vueltas de una rueda y área del círculo",
    text: "Empieza en <strong>Problemas</strong>, con problemas inversos (de la longitud al diámetro), cuántas vueltas da una rueda y el área del círculo y de la corona circular como ampliación.",
    example: "Una rueda de 1 m de diámetro recorre 314 m → 100 vueltas",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "Radio 5 cm → ¿diámetro? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, CIRCUNFERENCIA_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), CIRCUNFERENCIA_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("ci-radio")) initExplore();
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
// Circunferencia de radio r (en cm) dibujada a escala.
function svgRadio(r) {
  const S = 240;
  const c = S / 2;
  const R = 10 + r * 10;
  return `<svg viewBox="0 0 ${S} ${S}" width="${S}" style="max-width:100%" role="img" aria-label="Circunferencia de radio ${r}">
    <circle cx="${c}" cy="${c}" r="${R}" fill="var(--color-indigo-tint)" stroke="var(--color-indigo)" stroke-width="3"/>
    <line x1="${c}" y1="${c - R}" x2="${c}" y2="${c + R}" stroke="var(--color-teal)" stroke-width="4"/>
    <line x1="${c}" y1="${c}" x2="${c + R}" y2="${c}" stroke="var(--color-plum)" stroke-width="4"/>
    <circle cx="${c}" cy="${c}" r="4" fill="var(--text)"/>
  </svg>`;
}

// La circunferencia desenrollada al lado de 3 diámetros.
function svgDesenrollar(d) {
  const W = 320;
  const k = (W - 20) / (3.3 * d);
  const y0 = 40;
  let out = `<text x="10" y="${y0 - 12}" font-size="12" font-weight="700" fill="var(--color-amber)">Circunferencia desenrollada</text>`;
  out += `<line x1="10" y1="${y0}" x2="${(10 + Math.PI * d * k).toFixed(1)}" y2="${y0}" stroke="var(--color-amber)" stroke-width="8" stroke-linecap="round"/>`;
  out += `<text x="10" y="${y0 + 34}" font-size="12" font-weight="700" fill="var(--color-teal)">3 diámetros</text>`;
  for (let i = 0; i < 3; i++) {
    const x = 10 + i * d * k;
    out += `<rect x="${x.toFixed(1)}" y="${y0 + 42}" width="${(d * k - 3).toFixed(1)}" height="10" rx="3" fill="var(--color-teal)"/>`;
  }
  const xr = 10 + 3 * d * k;
  out += `<rect x="${xr.toFixed(1)}" y="${y0 + 42}" width="${(0.14159 * d * k).toFixed(1)}" height="10" rx="2" fill="var(--color-plum)"/>`;
  out += `<text x="${W - 4}" y="${y0 + 72}" text-anchor="end" font-size="11" font-weight="700" fill="var(--color-plum)">+ un poco</text>`;
  return `<svg viewBox="0 0 ${W} ${y0 + 84}" width="${W}" style="max-width:100%" role="img" aria-label="La circunferencia mide un poco más de tres diámetros">${out}</svg>`;
}

// El círculo y el cuadrado del radio: el círculo ocupa unos 3,14 cuadrados.
function svgAreaCuadrados(r) {
  const S = 260;
  const c = S / 2;
  const R = 20 + r * 12;
  let out = `<circle cx="${c}" cy="${c}" r="${R}" fill="var(--color-indigo-tint)" stroke="var(--color-indigo)" stroke-width="3"/>`;
  const cuad = [[c, c - R], [c - R, c - R], [c - R, c], [c, c]];
  cuad.forEach(([x, y], i) => {
    out += `<rect x="${x}" y="${y}" width="${R}" height="${R}" fill="none" stroke="${i === 0 ? "var(--color-plum)" : "var(--color-plum)"}" stroke-width="${i === 0 ? 3 : 1.5}" stroke-dasharray="${i === 0 ? "" : "5 4"}"/>`;
  });
  out += `<text x="${c + R / 2}" y="${c - R / 2 + 5}" text-anchor="middle" font-size="13" font-weight="800" fill="var(--color-plum)">r × r</text>`;
  return `<svg viewBox="0 0 ${S} ${S}" width="${S}" style="max-width:100%" role="img" aria-label="Círculo y cuadrados de lado el radio">${out}</svg>`;
}

function initExplore() {
  const lim = (v, a, z) => Math.max(a, Math.min(z, v));

  // 1. Radio y diámetro.
  let r = 4;
  function renderRadio() {
    document.getElementById("ci-r").textContent = `${r} cm`;
    document.getElementById("ci-radio-draw").innerHTML = svgRadio(r);
    document.getElementById("ci-radio-msg").innerHTML = `Radio (morado): <strong>${r} cm</strong>. Diámetro (verde): 2 × ${r} = <strong>${2 * r} cm</strong>. Longitud de la circunferencia: 3,14 × ${2 * r} = <strong>${fmt(pi(2 * r))} cm</strong>.`;
  }
  document.querySelectorAll("[data-ci-r]").forEach((b) => b.addEventListener("click", () => { r = lim(r + Number(b.dataset.ciR), 1, 10); renderRadio(); }));

  // 2. Desenrollar.
  let d = 4;
  function renderDes() {
    document.getElementById("ci-d").textContent = `${d} cm`;
    document.getElementById("ci-des-draw").innerHTML = svgDesenrollar(d);
    document.getElementById("ci-des-msg").innerHTML = `Si cortas la circunferencia y la estiras, mide <strong>3,14 × ${d} = ${fmt(pi(d))} cm</strong>: tres diámetros (${3 * d} cm) y un poco más. Ese número, 3,14…, se llama <strong>π (pi)</strong> y es el mismo para todas las circunferencias.`;
  }
  document.querySelectorAll("[data-ci-d]").forEach((b) => b.addEventListener("click", () => { d = lim(d + Number(b.dataset.ciD), 1, 10); renderDes(); }));

  // 3. Área (ampliación).
  let ra = 3;
  function renderArea() {
    document.getElementById("ci-ra").textContent = `${ra} cm`;
    document.getElementById("ci-area-draw").innerHTML = svgAreaCuadrados(ra);
    document.getElementById("ci-area-msg").innerHTML = `El cuadrado morado tiene de lado el radio: ${ra} × ${ra} = ${ra * ra} cm². Los cuatro cuadrados rodean el círculo, pero el círculo no los llena: ocupa unos <strong>3,14 cuadrados</strong>. Área = 3,14 × ${ra} × ${ra} = <strong>${fmt(pi(ra * ra))} cm²</strong>.`;
  }
  document.querySelectorAll("[data-ci-ra]").forEach((b) => b.addEventListener("click", () => { ra = lim(ra + Number(b.dataset.ciRa), 1, 8); renderArea(); }));

  renderRadio();
  renderDes();
  renderArea();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-circunferencia"),
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
  let mode = "elementos";
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

    if (diff.is("altas")) setActiveMode("problemas");
    else if (acs) setActiveMode("elementos");
    else if ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla") setActiveMode("elementos");

    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function generatorsFor() {
    if (diff.is("acs")) return ACS_GENERATORS;
    const grupos = diff.is("discalculia") ? MODE_GROUPS_DISCALCULIA : MODE_GROUPS;
    if (mode === "mezcla") return grupos[pick(MEZCLA)];
    return grupos[mode];
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
    AppProgress.record("circunferencia", isCorrect);
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
