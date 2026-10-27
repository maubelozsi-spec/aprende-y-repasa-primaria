// ============================================================
// El tiempo (5º Tema 9: las unidades de tiempo, el cambio de
// unidades y las operaciones con el tiempo; reto: los horarios del
// mercado medieval)
// - Explora: mover las agujas del reloj (con la hora en palabras y en
//   formato de 24 horas) y calcular cuánto tiempo pasa a saltos.
//   No guarda progreso.
// - Práctica: las horas y las duraciones se generan al azar y cada
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

const miles = (n) => (String(n).length > 3 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") : String(n));
const dos = (n) => String(n).padStart(2, "0");

// Hora digital: 9:05 (12 h) o 21:05 (24 h).
const digital = (h, m) => `${h}:${dos(m)}`;

// Duración: «2 h 35 min», «45 min», «3 h».
function dur(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  if (!m) return `${h} h`;
  return `${h} h ${m} min`;
}
// Duración sin normalizar (para los errores: «3 h 75 min»).
const durCruda = (h, m) => `${h} h ${m} min`;

// ------------------------------------------------------------
// La hora en palabras
// ------------------------------------------------------------
const HORAS = ["doce", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce"];
const MINUTOS = { 5: "cinco", 10: "diez", 15: "cuarto", 20: "veinte", 25: "veinticinco", 30: "media" };

function momento(h24) {
  if (h24 === 0) return "de la noche";
  if (h24 < 6) return "de la madrugada";
  if (h24 < 12) return "de la mañana";
  if (h24 < 14) return "del mediodía";
  if (h24 < 21) return "de la tarde";
  return "de la noche";
}

// Solo minutos múltiplos de 5. Con h24 se añade el momento del día.
function enPalabras(h, m, h24 = null) {
  const h12 = h % 12 === 0 ? 12 : h % 12;
  let txt;
  if (m === 0) txt = `${h12 === 1 ? "la" : "las"} ${HORAS[h12]} en punto`;
  else if (m <= 30) txt = `${h12 === 1 ? "la" : "las"} ${HORAS[h12]} y ${MINUTOS[m]}`;
  else {
    const sig = (h12 % 12) + 1;
    txt = `${sig === 1 ? "la" : "las"} ${HORAS[sig]} menos ${MINUTOS[60 - m]}`;
  }
  return h24 === null ? txt : `${txt} ${momento(h24)}`;
}

// ------------------------------------------------------------
// Dibujo del reloj
// ------------------------------------------------------------
function svgReloj(h, m, { minutos = false, size = 200 } = {}) {
  const c = size / 2;
  const R = size * 0.42;
  const P = (ang, r) => [c + r * Math.sin((ang * Math.PI) / 180), c - r * Math.cos((ang * Math.PI) / 180)];
  let out = `<circle cx="${c}" cy="${c}" r="${R}" fill="var(--surface)" stroke="var(--text)" stroke-width="3"/>`;
  for (let i = 0; i < 60; i++) {
    const [x1, y1] = P(i * 6, R - (i % 5 ? 4 : 9));
    const [x2, y2] = P(i * 6, R - 1);
    out += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--text)" stroke-width="${i % 5 ? 1 : 2.5}"/>`;
  }
  for (let i = 1; i <= 12; i++) {
    const [x, y] = P(i * 30, R - 22);
    out += `<text x="${x.toFixed(1)}" y="${(y + 6).toFixed(1)}" text-anchor="middle" font-size="${size * 0.085}" font-weight="800" fill="var(--text)">${i}</text>`;
    if (minutos) {
      const [mx, my] = P(i * 30, R + 13);
      out += `<text x="${mx.toFixed(1)}" y="${(my + 4).toFixed(1)}" text-anchor="middle" font-size="${size * 0.055}" font-weight="700" fill="var(--color-plum)">${(i * 5) % 60}</text>`;
    }
  }
  const [hx, hy] = P(((h % 12) + m / 60) * 30, R * 0.5);
  const [mx, my] = P(m * 6, R * 0.82);
  out += `<line x1="${c}" y1="${c}" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="var(--color-indigo)" stroke-width="7" stroke-linecap="round"/>`;
  out += `<line x1="${c}" y1="${c}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="var(--color-plum)" stroke-width="4" stroke-linecap="round"/>`;
  out += `<circle cx="${c}" cy="${c}" r="6" fill="var(--text)"/>`;
  const pad = minutos ? 18 : 4;
  return `<svg viewBox="${-pad} ${-pad} ${size + 2 * pad} ${size + 2 * pad}" width="${size}" style="max-width:100%" role="img" aria-label="Reloj de agujas">${out}</svg>`;
}

// ------------------------------------------------------------
// Niveles
// ------------------------------------------------------------
const LEVELS = {
  normal: { paso: 5, max: 3 },
  facil: { paso: 15, max: 2 },
  acs: { paso: 15, max: 1 },
  altas: { paso: 1, max: 6, altas: true },
};

function horaAzar(L) {
  return [randInt(1, 12), L.paso * randInt(0, 60 / L.paso - 1)];
}

// ------------------------------------------------------------
// Generadores
// ------------------------------------------------------------
function genReloj(L) {
  const [h, m] = horaAzar(L);
  const correct = digital(h, m);
  const sig = (h % 12) + 1;
  const ant = h === 1 ? 12 : h - 1;
  // Errores típicos: leer la hora siguiente cuando la aguja corta ya
  // está cerca, cambiar las agujas o leer el número del minutero.
  const cands = [digital(m > 30 ? sig : ant, m), digital(h, (m + 30) % 60)];
  if (m % 5 === 0 && m > 0) cands.push(digital(m / 5, (h % 12) * 5), digital(h, m / 5));
  cands.push(digital(sig, m), digital(h, (m + 15) % 60));
  return {
    instruction: "¿Qué hora marca el reloj?",
    display: correct,
    visual: svgReloj(h, m, { minutos: L === LEVELS.facil || L === LEVELS.acs }),
    soloVisual: true,
    options: uniqueOptions(correct, cands.filter((c) => c !== correct)),
    correct,
    hint: "La aguja corta (azul) marca la hora: mira el último número que ha pasado. La larga (morada) marca los minutos: cada número del reloj son 5 minutos.",
    explain: `La aguja larga está en ${m === 0 ? "el 12: en punto" : `${m % 5 === 0 ? `el ${m / 5 === 0 ? 12 : m / 5}` : `la rayita ${m}`}: ${m} minutos`}. La corta ${m === 0 ? `está justo en el ${h}` : `ha pasado el ${h} y aún no llega al ${sig}`}: ${h === 1 ? "es la" : "son las"} ${correct}${m % 5 === 0 ? `, ${enPalabras(h, m)}` : ""}.${m > 30 ? ` Aunque la aguja corta ya esté cerca del ${sig}, todavía no ha llegado.` : ""}`,
  };
}

function genPalabras(L) {
  const [h, m0] = horaAzar(L === LEVELS.altas ? LEVELS.normal : L);
  const m = m0;
  const correct = enPalabras(h, m);
  const sig = (h % 12) + 1;
  const ant = h === 1 ? 12 : h - 1;
  // Frase con cualquier hora: errores de «y»/«menos» y de hora.
  const fr = (hn, y, mw) => `${hn === 1 ? "la" : "las"} ${HORAS[hn]} ${mw === 0 ? "en punto" : `${y ? "y" : "menos"} ${MINUTOS[mw]}`}`;
  const cands = [];
  if (m === 0) cands.push(fr(h, true, 30), fr(sig, false, 0), fr(ant, false, 0));
  else if (m === 30) cands.push(fr(sig, true, 30), fr(ant, true, 30), fr(h, true, 15), fr(sig, false, 15));
  else if (m < 30) cands.push(fr(h, false, m), fr(sig, true, m), fr(sig, false, m), fr(ant, true, m));
  else cands.push(fr(h, false, 60 - m), fr(h, true, 60 - m), fr(sig, true, 60 - m), fr(h, true, m - 30 || 30));
  return {
    instruction: "¿Cómo se dice esta hora?",
    display: digital(h, m),
    visual: L === LEVELS.acs || L === LEVELS.facil ? svgReloj(h, m, { minutos: true, size: 160 }) : null,
    options: uniqueOptions(correct, cands.filter((c) => c !== correct)),
    correct,
    hint: "Hasta la media se dice «y» con la hora que es. A partir de la media se dice «menos» con la hora que viene.",
    explain: m <= 30
      ? `${digital(h, m)}: ${m === 0 ? "es la hora justa" : `han pasado ${m} minutos de ${h === 1 ? "la 1" : `las ${h}`}`} → ${correct}.`
      : `${digital(h, m)}: faltan ${60 - m} minutos para ${sig === 1 ? "la 1" : `las ${sig}`} → ${correct}. No se dice «${h === 1 ? "la" : "las"} ${HORAS[h]} menos…»: ya va camino de ${sig === 1 ? "la 1" : `las ${sig}`}.`,
  };
}

function gen24(L) {
  const tarde = Math.random() < 0.8;
  const h12 = randInt(1, 11);
  const m = 5 * randInt(0, 11);
  const h24 = tarde ? h12 + 12 : h12;
  const aDigital = Math.random() < 0.5;
  if (aDigital) {
    const correct = digital(h24, m);
    return {
      instruction: "¿Cómo se escribe en formato de 24 horas?",
      display: `${enPalabras(h12, m, h24)[0].toUpperCase()}${enPalabras(h12, m, h24).slice(1)}.`,
      options: uniqueOptions(correct, [digital(h12, m), digital(h24 + (m > 30 ? 1 : -1), m), digital(tarde ? h12 + 10 : h12 + 12, m), digital(h24, (m + 30) % 60), digital(h24 - 2, m)].filter((c) => c !== correct && Number(c.split(":")[0]) <= 23)),
      correct,
      hint: "Por la tarde y por la noche se suman 12 a la hora: la 1 de la tarde son las 13:00.",
      explain: tarde
        ? `Es ${momento(h24)}: ${m > 30 ? `las ${h12 % 12 + 1} menos ${MINUTOS[60 - m]} son las ${h12}:${dos(m)}, y ` : ""}${h12} + 12 = ${h24} → ${correct}.`
        : `Es por la mañana: la hora no cambia → ${correct}.`,
    };
  }
  const correct = enPalabras(h12, m, h24);
  const otros = [enPalabras(h12, m, tarde ? h12 : h12 + 12), enPalabras(h24 - 10 > 0 ? h24 - 10 : h12 + 2, m, h24), enPalabras((h12 % 12) + 1, m, h24), enPalabras(h12, (m + 30) % 60, h24)];
  return {
    instruction: "¿Qué hora es?",
    display: digital(h24, m),
    options: uniqueOptions(correct, otros.filter((c) => c !== correct)),
    correct,
    hint: "Si la hora pasa de 12, réstale 12: 17:00 son las 5 de la tarde.",
    explain: h24 > 12 ? `${h24} − 12 = ${h12}: ${digital(h24, m)} son ${correct}.` : `${digital(h24, m)} es por la mañana: ${correct}.`,
  };
}

function genConvertir(L) {
  const facil = L === LEVELS.acs || L === LEVELS.facil;
  const tipos = facil ? ["h-min", "fraccion", "dia-h", "compleja"] : ["h-min", "min-h", "compleja", "min-s", "fraccion", "decimal", "mayores", "dia-h"];
  const tipo = pick(tipos);
  if (tipo === "h-min") {
    const h = randInt(1, facil ? 4 : 9);
    return conv(`${h} h = ___ min`, `${h * 60} min`, [h * 100, h * 6, h * 30, h * 60 + 60].map((x) => `${miles(x)} min`), "1 h = 60 min: multiplica las horas por 60.", `${h} × 60 = ${h * 60} min. El tiempo va de 60 en 60, no de 100 en 100.`);
  }
  if (tipo === "min-s") {
    const m = randInt(2, 9);
    return conv(`${m} min = ___ s`, `${m * 60} s`, [m * 100, m * 10, m * 60 + 60, m * 30].map((x) => `${miles(x)} s`), "1 min = 60 s.", `${m} × 60 = ${m * 60} s.`);
  }
  if (tipo === "compleja") {
    const h = randInt(1, facil ? 3 : 5);
    const m = facil ? pick([15, 30, 45]) : randInt(1, 11) * 5;
    const t = h * 60 + m;
    return conv(`${h} h ${m} min = ___ min`, `${t} min`, [Number(`${h}${dos(m)}`), h * 100 + m, h * 60, t + 60].map((x) => `${miles(x)} min`), "Pasa las horas a minutos (× 60) y suma los minutos que hay.", `${h} h = ${h * 60} min. ${h * 60} + ${m} = ${t} min. No es ${h}${dos(m)}: no se pueden «pegar» los números.`);
  }
  if (tipo === "min-h") {
    const t = randInt(7, 40) * 5 + (L.altas ? randInt(0, 4) : 0);
    const correct = dur(t);
    return conv(`${t} min = ___ h ___ min`, correct, [durCruda(Math.floor(t / 100), t % 100), dur(t + 60), durCruda(Math.floor(t / 60), (t % 60) + 10), durCruda(Math.floor(t / 10), t % 10)].filter((x) => x !== correct && !/ 0 min/.test(x)), "¿Cuántas veces caben 60 minutos? Esas son las horas; lo que sobra, los minutos.", `${t} : 60 = ${Math.floor(t / 60)} y sobran ${t % 60}: ${correct}.`);
  }
  if (tipo === "fraccion") {
    const [txt, min] = pick([["un cuarto de hora", 15], ["media hora", 30], ["tres cuartos de hora", 45], ["hora y media", 90], ["dos horas y cuarto", 135]].filter((x) => !facil || x[1] <= 90));
    return conv(`${txt[0].toUpperCase()}${txt.slice(1)} = ___ min`, `${min} min`, [25, 50, 75, 150, 45, 15, 30].filter((x) => x !== min).map((x) => `${x} min`), "1 hora = 60 min. Media hora es la mitad (30) y un cuarto de hora, la cuarta parte (15).", `${txt[0].toUpperCase()}${txt.slice(1)} son ${min} minutos${min === 45 ? ": 3 × 15" : min === 90 ? ": 60 + 30" : min === 135 ? ": 120 + 15" : ""}.`);
  }
  if (tipo === "decimal") {
    // El error más típico: 1,5 h no es 1 h 50 min.
    const h = randInt(1, 4);
    const [d, mm] = pick([[5, 30], [25, 15], [75, 45]]);
    const txt = `${h},${d} h`;
    const correct = dur(h * 60 + mm);
    return conv(`${txt} = ___ h ___ min`, correct, [durCruda(h, d), durCruda(h, d * 2 > 60 ? d - 10 : d * 2), durCruda(h + 1, mm), durCruda(h, mm + 10)].filter((x) => x !== correct), "La parte decimal es una parte de hora: 0,5 h es media hora; 0,25 h, un cuarto.", `${txt} = ${h} h y ${d === 5 ? "media" : d === 25 ? "un cuarto" : "tres cuartos"} de hora = ${correct}. ¡No son ${h} h ${d} min!`);
  }
  if (tipo === "dia-h") {
    const d = randInt(2, facil ? 3 : 7);
    return conv(`${d} días = ___ h`, `${d * 24} h`, [d * 12, d * 60, d * 10, d * 24 + 24].map((x) => `${x} h`), "1 día tiene 24 horas.", `${d} × 24 = ${d * 24} h.`);
  }
  // Unidades mayores.
  const [txt, valor, u, por] = pick([
    ["3 semanas", 21, "días", "1 semana = 7 días"],
    ["2 años", 24, "meses", "1 año = 12 meses"],
    ["2 siglos", 200, "años", "1 siglo = 100 años"],
    ["3 décadas", 30, "años", "1 década = 10 años"],
    ["2 trimestres", 6, "meses", "1 trimestre = 3 meses"],
    ["4 semestres", 24, "meses", "1 semestre = 6 meses"],
    ["2 lustros", 10, "años", "1 lustro = 5 años"],
    ["1 milenio", 1000, "años", "1 milenio = 1.000 años"],
  ]);
  const n = Number(txt.split(" ")[0]);
  return conv(`${txt} = ___ ${u}`, `${miles(valor)} ${u}`, [valor / n * (n + 1), valor * 10, valor / 2, valor + n].filter((x) => Number.isInteger(x) && x !== valor).map((x) => `${miles(x)} ${u}`), `${por}.`, `${por}: ${txt} = ${miles(valor)} ${u}.`);
}

function conv(display, correct, cands, hint, explain) {
  return { instruction: "Completa:", display, options: uniqueOptions(correct, cands.filter((c) => c !== correct)), correct, hint, explain };
}

function genOperar(L) {
  const facil = L === LEVELS.acs || L === LEVELS.facil;
  const suma = Math.random() < 0.5;
  const step = facil ? 15 : 5;
  let a;
  let b;
  do {
    a = randInt(1, L.max + 1) * 60 + step * randInt(1, 60 / step - 1);
    b = randInt(0, L.max) * 60 + step * randInt(1, 60 / step - 1);
  } while ((suma && (a % 60) + (b % 60) < 60 && Math.random() < 0.75) || (!suma && (a <= b || ((a % 60) >= (b % 60) && Math.random() < 0.75))));
  const r = suma ? a + b : a - b;
  const correct = dur(r);
  const [ah, am, bh, bm] = [Math.floor(a / 60), a % 60, Math.floor(b / 60), b % 60];
  // Errores típicos: no cambiar 60 min por 1 h, o cambiar 1 h por 100 min.
  const cands = suma
    ? [durCruda(ah + bh, am + bm), dur(r + 40), dur(r - 60), dur(r + 60), dur(r + 10)]
    : [am < bm ? durCruda(ah - bh, bm - am) : null, am < bm ? durCruda(ah - bh - 1, am + 100 - bm) : null, dur(r + 60), dur(r - 20), dur(r + 10), dur(r + 40)];
  const lleva = suma ? am + bm >= 60 : am < bm;
  return {
    instruction: suma ? "Suma los tiempos:" : "Resta los tiempos:",
    display: `${dur(a)} ${suma ? "+" : "−"} ${dur(b)}`,
    options: uniqueOptions(correct, cands.filter((c) => c !== correct && !/−|-/.test(c) && !/^0 (h|min)/.test(c))),
    correct,
    hint: suma ? "Suma horas con horas y minutos con minutos. Si los minutos pasan de 60, cambia 60 min por 1 h." : "Resta horas con horas y minutos con minutos. Si no llegan los minutos, cambia 1 h por 60 min.",
    explain: suma
      ? `Minutos: ${am} + ${bm} = ${am + bm}${lleva ? ` → ${am + bm} − 60 = ${(am + bm) % 60} min y 1 h más` : " min"}. Horas: ${ah} + ${bh}${lleva ? " + 1" : ""} = ${Math.floor(r / 60)} h. Total: ${correct}.`
      : lleva
        ? `${am} min no llega para quitar ${bm}: se cambia 1 h por 60 min → ${am} + 60 = ${am + 60} min. ${am + 60} − ${bm} = ${(am + 60 - bm)} min. Horas: ${ah} − 1 − ${bh} = ${ah - 1 - bh}. Total: ${correct}.`
        : `Minutos: ${am} − ${bm} = ${am - bm}. Horas: ${ah} − ${bh} = ${ah - bh}. Total: ${correct}.`,
  };
}

// ¿A qué hora termina? ¿Cuánto dura?
function genHoras(L) {
  const facil = L === LEVELS.acs || L === LEVELS.facil;
  const step = facil ? 15 : L.altas ? 1 : 5;
  const ini = randInt(8, 18) * 60 + step * randInt(0, 60 / step - 1);
  const d = (facil ? 15 : 5) * randInt(facil ? 2 : 4, facil ? 12 : 40) + (L.altas ? randInt(0, 4) : 0);
  const fin = ini + d;
  const hm = (t) => digital(Math.floor(t / 60) % 24, t % 60);
  const contexto = pick([
    ["Una película", "empieza", "termina", "dura"],
    ["El partido", "empieza", "termina", "dura"],
    ["El puesto de dulces del mercado medieval", "abre", "cierra", "está abierto"],
    ["La excursión", "sale", "vuelve", "dura"],
    ["El taller de cerámica", "empieza", "acaba", "dura"],
  ]);
  if (Math.random() < 0.5) {
    const correct = hm(fin);
    const [ih, im] = [Math.floor(ini / 60), ini % 60];
    const [dh, dm] = [Math.floor(d / 60), d % 60];
    return {
      instruction: "Resuelve:",
      display: `${contexto[0]} ${contexto[1]} a las ${hm(ini)} y ${contexto[3]} ${dur(d)}. ¿A qué hora ${contexto[2]}?`,
      options: uniqueOptions(correct, [`${ih + dh}:${dos(im + dm)}`, hm(fin + 40), hm(fin - 60), hm(fin + 60)].filter((c) => c !== correct && !/:\d{3}|:[6-9]\d/.test(c))),
      correct,
      hint: "Suma primero las horas y después los minutos. Si los minutos pasan de 60, sube una hora.",
      explain: `${hm(ini)} + ${dur(d)}: ${dh ? `${ih} + ${dh} = ${ih + dh} h; ` : ""}${im} + ${dm} = ${im + dm} min${im + dm >= 60 ? ` → ${im + dm - 60} min y 1 h más` : ""}. ${contexto[0]} ${contexto[2]} a las ${correct}.`,
    };
  }
  // Duración, contando a saltos.
  const correct = dur(d);
  const hastaHora = Math.min((60 - (ini % 60)) % 60, d);
  const horasEnteras = Math.floor((fin - (ini + hastaHora)) / 60);
  const resto = fin - (ini + hastaHora) - horasEnteras * 60;
  const [ih, im, fh, fm] = [Math.floor(ini / 60), ini % 60, Math.floor(fin / 60), fin % 60];
  // Error típico: restar las horas como si fueran números (12:15 − 9:40 = 2 h 75 min).
  const v = fh * 100 + fm - (ih * 100 + im);
  const malo = v % 100 >= 60 ? durCruda(Math.floor(v / 100), v % 100) : null;
  return {
    instruction: "Resuelve:",
    display: `${contexto[0]} ${contexto[1]} a las ${hm(ini)} y ${contexto[2]} a las ${hm(fin)}. ¿Cuánto tiempo ${contexto[3]}?`,
    options: uniqueOptions(correct, [malo, dur(d + 60), dur(d - 20 > 0 ? d - 20 : d + 20), dur(d + 40), durCruda(fh - ih, Math.abs(fm - im))].filter((c) => c && c !== correct && !/^0 h|−/.test(c))),
    correct,
    hint: "Cuenta a saltos: primero hasta la siguiente hora en punto, luego las horas enteras y al final los minutos que quedan.",
    explain: `A saltos: ${hastaHora ? `de ${hm(ini)} a ${hm(ini + hastaHora)} hay ${hastaHora} min; ` : ""}${horasEnteras ? `de ${hm(ini + hastaHora)} a ${hm(ini + hastaHora + horasEnteras * 60)}, ${horasEnteras} h; ` : ""}${resto ? `y de ${hm(fin - resto)} a ${hm(fin)}, ${resto} min. ` : ""}Total: ${correct}.`,
  };
}

const MODE_GROUPS = {
  reloj: [genReloj, genReloj, genPalabras, gen24],
  conversiones: [genConvertir],
  operar: [genOperar],
  problemas: [genHoras],
};

const ACS_GENERATORS = [genReloj, genReloj, genPalabras, genConvertir, genHoras];

const TIEMPO_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "En punto, y cuarto, y media y menos cuarto (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja leer el reloj de agujas en punto, y cuarto, y media y menos cuarto (con los minutos escritos alrededor), decir esas horas en palabras, pasar horas a minutos y calcular cuándo termina algo que dura cuartos de hora.",
    example: "Las tres y cuarto → 3:15",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantienen las mismas horas, pero con una tipografía más legible para leer las preguntas y las opciones.",
    example: "Las cinco menos cuarto → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «El reloj» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todos los contenidos, con cuartos de hora y la pista a la vista",
    text: "Se trabajan todos los modos con horas en punto, y cuarto, y media y menos cuarto, duraciones de cuartos de hora y los minutos escritos alrededor del reloj, con la pista abierta desde el principio. Sin «Mezcla». En Explora se puede mover las agujas y contar a saltos.",
    example: "De 9:45 a 11:15 → 15 min + 1 h + 15 min = 1 h 30 min",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Minuto a minuto, 24 horas y duraciones largas",
    text: "Empieza en <strong>Problemas</strong>, con relojes de cualquier minuto, duraciones de varias horas, el formato de 24 horas y conversiones con decimales (1,25 h = 1 h 15 min).",
    example: "De 9:47 a 13:12 → 3 h 25 min",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Qué hora marca el reloj? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  const ej = document.getElementById("ejemplo-reloj");
  if (ej) ej.innerHTML = svgReloj(3, 15, { minutos: true, size: 180 });

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, TIEMPO_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), TIEMPO_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("ti-reloj")) initExplore();
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
// Línea del tiempo con los saltos: hasta la hora en punto, horas y minutos.
function svgSaltos(ini, fin) {
  const W = 320;
  const H = 110;
  const x = (t) => 14 + ((t - ini) / (fin - ini)) * (W - 28);
  // Si no se llega a la hora en punto, un solo salto.
  const hasta = Math.min((60 - (ini % 60)) % 60, fin - ini);
  const p1 = ini + hasta;
  const horas = Math.floor((fin - p1) / 60);
  const p2 = p1 + horas * 60;
  const hm = (t) => digital(Math.floor(t / 60), t % 60);
  let out = `<line x1="14" y1="70" x2="${W - 14}" y2="70" stroke="var(--text)" stroke-width="3"/>`;
  const salto = (a, b, txt, color) => {
    if (b <= a) return "";
    const xa = x(a);
    const xb = x(b);
    const xm = (xa + xb) / 2;
    return `<path d="M ${xa.toFixed(1)} 70 Q ${xm.toFixed(1)} 20 ${xb.toFixed(1)} 70" fill="none" stroke="${color}" stroke-width="3"/><text x="${xm.toFixed(1)}" y="36" text-anchor="middle" font-size="12" font-weight="800" fill="${color}" stroke="var(--surface)" stroke-width="3" paint-order="stroke">${txt}</text>`;
  };
  out += salto(ini, p1, `${hasta} min`, "var(--color-teal)");
  out += salto(p1, p2, `${horas} h`, "var(--color-indigo)");
  out += salto(p2, fin, `${fin - p2} min`, "var(--color-plum)");
  [...new Set([ini, p1, p2, fin])].forEach((t) => {
    out += `<circle cx="${x(t).toFixed(1)}" cy="70" r="4" fill="var(--text)"/><text x="${x(t).toFixed(1)}" y="92" text-anchor="middle" font-size="11" font-weight="700" fill="var(--text)">${hm(t)}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="Cuánto tiempo pasa, contado a saltos">${out}</svg>`;
}

function initExplore() {
  // 1. Mover las agujas.
  let t = 16 * 60 + 15;
  function renderReloj() {
    const h24 = Math.floor(t / 60);
    const m = t % 60;
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    document.getElementById("ti-reloj-draw").innerHTML = svgReloj(h12, m, { minutos: true });
    document.getElementById("ti-digital").textContent = `${dos(h24)}:${dos(m)}`;
    const frase = m % 5 === 0 ? enPalabras(h12, m, h24) : `${h12 === 1 ? "la" : "las"} ${h12} y ${m} ${momento(h24)}`;
    document.getElementById("ti-reloj-msg").innerHTML = `${frase.startsWith("la ") ? "Es" : "Son"} <strong>${frase}</strong>. En el reloj de agujas, ${digital(h12, m)}; en formato de 24 horas, <strong>${dos(h24)}:${dos(m)}</strong>.${h24 >= 13 ? ` (${h12} + 12 = ${h24})` : ""}`;
  }
  document.querySelectorAll("[data-ti-t]").forEach((b) => b.addEventListener("click", () => { t = (t + Number(b.dataset.tiT) + 1440) % 1440; renderReloj(); }));

  // 2. ¿Cuánto tiempo pasa?
  let ini = 9 * 60 + 40;
  let fin = 12 * 60 + 15;
  const hm = (x) => `${Math.floor(x / 60)}:${dos(x % 60)}`;
  function renderSaltos() {
    if (fin <= ini) fin = ini + 15;
    document.getElementById("ti-ini").textContent = hm(ini);
    document.getElementById("ti-fin").textContent = hm(fin);
    document.getElementById("ti-saltos-draw").innerHTML = svgSaltos(ini, fin);
    const hasta = Math.min((60 - (ini % 60)) % 60, fin - ini);
    const horas = Math.floor((fin - ini - hasta) / 60);
    const resto = fin - ini - hasta - horas * 60;
    const partes = [hasta ? `${hasta} min` : "", horas ? `${horas} h` : "", resto ? `${resto} min` : ""].filter(Boolean);
    document.getElementById("ti-saltos-msg").innerHTML = `De ${hm(ini)} a ${hm(fin)}: ${partes.join(" + ")} = <strong>${dur(fin - ini)}</strong>. Contar a saltos evita restar ${hm(fin)} − ${hm(ini)} como si fueran números normales.`;
  }
  document.querySelectorAll("[data-ti-ini]").forEach((b) => b.addEventListener("click", () => { ini = Math.max(0, Math.min(23 * 60, ini + Number(b.dataset.tiIni))); renderSaltos(); }));
  document.querySelectorAll("[data-ti-fin]").forEach((b) => b.addEventListener("click", () => { fin = Math.max(ini + 5, Math.min(24 * 60 - 5, fin + Number(b.dataset.tiFin))); renderSaltos(); }));

  renderReloj();
  renderSaltos();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-tiempo"),
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
  let mode = "reloj";
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
    else if (acs) setActiveMode("reloj");
    else if ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla") setActiveMode("reloj");

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
    AppProgress.record("tiempo", isCorrect);
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
