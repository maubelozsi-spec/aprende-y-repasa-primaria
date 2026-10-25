// ============================================================
// Cálculo mental: banco de "trucos" organizados en 3 bloques
// progresivos (pensados para trabajar a lo largo del curso, uno
// por trimestre aproximadamente). Cada truco tiene una función
// generadora que, según el nivel, crea una operación al azar con su
// pista, la respuesta, los pasos resueltos y errores típicos (para
// las opciones de respuesta). Lo usan el juego de práctica, la
// pestaña Explora y el generador de fichas en Word.
// Niveles: "acs", "facil" (discalculia), "normal" y "altas".
// ============================================================

function cmRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cmPick(arr) {
  return arr[cmRandomInt(0, arr.length - 1)];
}

function cmRoundToNearest(n, base) {
  return Math.round(n / base) * base;
}

// Números con punto de miles y coma decimal: 4.700 · 3,45.
function cmFmt(n) {
  const r = Math.round(n * 1e6) / 1e6;
  const [ent, dec] = String(Math.abs(r)).split(".");
  return `${r < 0 ? "−" : ""}${ent.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${dec ? `,${dec}` : ""}`;
}

// Elige el rango según el nivel: [acs, facil, normal, altas].
const cmNivelIdx = { acs: 0, facil: 1, normal: 2, altas: 3 };
function cmRango(nivel, rangos) {
  const r = rangos[cmNivelIdx[nivel] ?? 2];
  return cmRandomInt(r[0], r[1]);
}

// ---------------- Bloque 1 · Sumas y restas ----------------

function truco_compensacionSuma(nivel = "normal") {
  const a = cmRango(nivel, [[10, 40], [12, 60], [20, 900], [200, 9000]]);
  const bTens = cmRango(nivel, [[1, 3], [1, 4], [1, 8], [3, 9]]) * 10;
  const bUnit = cmPick([7, 8, 9]);
  const b = bTens + bUnit;
  const R = bTens + 10;
  const d = R - b;
  return {
    enunciado: `${cmFmt(a)} + ${b}`,
    pista: `Redondea ${b} a ${R} y, al final, resta ${d}.`,
    respuesta: a + b,
    pasos: [`${b} está cerca de ${R} (${d === 1 ? "le falta" : "le faltan"} ${d}).`, `${cmFmt(a)} + ${R} = ${cmFmt(a + R)}`, `Has sumado ${d} de más: ${cmFmt(a + R)} − ${d} = ${cmFmt(a + b)}`],
    errores: [a + R, a + R + d],
  };
}

function truco_compensacionResta(nivel = "normal") {
  const bTens = cmRango(nivel, [[1, 3], [1, 4], [2, 8], [3, 9]]) * 10;
  const bUnit = cmPick([7, 8, 9]);
  const b = bTens + bUnit;
  const a = b + cmRango(nivel, [[10, 30], [10, 50], [20, 400], [200, 4000]]);
  const R = bTens + 10;
  const d = R - b;
  return {
    enunciado: `${cmFmt(a)} − ${b}`,
    pista: `Resta ${R} y, al final, suma ${d}.`,
    respuesta: a - b,
    pasos: [`${b} está cerca de ${R} (${d === 1 ? "le falta" : "le faltan"} ${d}).`, `${cmFmt(a)} − ${R} = ${cmFmt(a - R)}`, `Has quitado ${d} de más: ${cmFmt(a - R)} + ${d} = ${cmFmt(a - b)}`],
    errores: [a - R, a - R - d],
  };
}

function truco_nueves(nivel = "normal") {
  const n = nivel === "acs" ? 9 : nivel === "facil" ? cmPick([9, 99]) : cmPick([9, 99, 999]);
  const suma = Math.random() < 0.5;
  const R = n + 1;
  const a = suma ? cmRango(nivel, [[11, 60], [20, 300], [50, 5000], [500, 50000]]) : R + cmRango(nivel, [[5, 60], [10, 300], [20, 5000], [200, 50000]]);
  const res = suma ? a + n : a - n;
  return {
    enunciado: `${cmFmt(a)} ${suma ? "+" : "−"} ${cmFmt(n)}`,
    pista: suma ? `Suma ${cmFmt(R)} y resta 1.` : `Resta ${cmFmt(R)} y suma 1.`,
    respuesta: res,
    pasos: suma
      ? [`${cmFmt(n)} = ${cmFmt(R)} − 1`, `${cmFmt(a)} + ${cmFmt(R)} = ${cmFmt(a + R)}`, `${cmFmt(a + R)} − 1 = ${cmFmt(res)}`]
      : [`${cmFmt(n)} = ${cmFmt(R)} − 1`, `${cmFmt(a)} − ${cmFmt(R)} = ${cmFmt(a - R)}`, `${cmFmt(a - R)} + 1 = ${cmFmt(res)}`],
    errores: suma ? [a + R, a + R + 1] : [a - R, a - R - 1],
  };
}

// Suma por partes; la resta, quitando primero centenas, luego decenas y luego unidades
// (restar cada orden «por separado» falla cuando hay que llevar: 532 − 278).
function truco_descomposicionSumaResta(nivel = "normal") {
  const suma = Math.random() < 0.5;
  const tres = nivel !== "acs" && nivel !== "facil";
  const lim = tres ? [100, nivel === "altas" ? 990 : 900] : [11, 89];
  if (suma) {
    const a = cmRandomInt(lim[0], lim[1]);
    const b = cmRandomInt(lim[0], lim[1]);
    const c = (x) => Math.floor(x / 100) * 100;
    const dd = (x) => Math.floor((x % 100) / 10) * 10;
    const u = (x) => x % 10;
    const pasos = tres
      ? [`Centenas: ${c(a)} + ${c(b)} = ${cmFmt(c(a) + c(b))}`, `Decenas: ${dd(a)} + ${dd(b)} = ${dd(a) + dd(b)}`, `Unidades: ${u(a)} + ${u(b)} = ${u(a) + u(b)}`, `${cmFmt(c(a) + c(b))} + ${dd(a) + dd(b)} + ${u(a) + u(b)} = ${cmFmt(a + b)}`]
      : [`Decenas: ${dd(a)} + ${dd(b)} = ${dd(a) + dd(b)}`, `Unidades: ${u(a)} + ${u(b)} = ${u(a) + u(b)}`, `${dd(a) + dd(b)} + ${u(a) + u(b)} = ${a + b}`];
    return {
      enunciado: `${a} + ${b}`,
      pista: tres ? "Suma las centenas, las decenas y las unidades por separado y júntalas." : "Suma las decenas y las unidades por separado y júntalas.",
      respuesta: a + b,
      pasos,
      errores: [a + b - 10, a + b + 10, a + b - 100],
    };
  }
  const b = cmRandomInt(lim[0], Math.floor(lim[1] * 0.7));
  const a = b + cmRandomInt(tres ? 50 : 5, tres ? 300 : 40);
  const partes = tres ? [Math.floor(b / 100) * 100, Math.floor((b % 100) / 10) * 10, b % 10] : [Math.floor(b / 10) * 10, b % 10];
  let acc = a;
  const pasos = [];
  partes.filter((x) => x).forEach((x) => {
    pasos.push(`${cmFmt(acc)} − ${x} = ${cmFmt(acc - x)}`);
    acc -= x;
  });
  return {
    enunciado: `${a} − ${b}`,
    pista: `Quita el ${b} por partes: ${partes.filter((x) => x).join(", luego ")}.`,
    respuesta: a - b,
    pasos: [`${b} = ${partes.filter((x) => x).join(" + ")}`, ...pasos],
    errores: [a - b + 10, a - b - 10, a - b + 100],
  };
}

function truco_complementoCien(nivel = "normal") {
  const target = nivel === "acs" ? 100 : nivel === "facil" ? cmPick([10, 100]) : cmPick([100, 1000]);
  const a = cmRandomInt(target / 10 + 1, target - 1);
  const siguiente = Math.ceil(a / (target / 10)) * (target / 10);
  const p1 = siguiente - a;
  const p2 = target - siguiente;
  return {
    enunciado: `${cmFmt(target)} − ${a}`,
    pista: `¿Cuánto le falta a ${a} para llegar a ${cmFmt(target)}? Ve primero al siguiente número redondo.`,
    respuesta: target - a,
    pasos: p1 && p2 ? [`De ${a} a ${siguiente}: ${p1}`, `De ${siguiente} a ${cmFmt(target)}: ${p2}`, `${p1} + ${p2} = ${target - a}`] : [`A ${a} le faltan ${target - a} para llegar a ${cmFmt(target)}.`],
    errores: [target - a + 10, target - a - 10, target - a + (target / 10)],
  };
}

// ---------------- Bloque 2 · Multiplicación y división ----------------

function truco_doblesMitades(nivel = "normal") {
  const factor = nivel === "acs" ? 2 : nivel === "facil" ? cmPick([2, 4]) : cmPick([4, 8]);
  const n = cmRango(nivel, [[6, 40], [6, 50], [6, 90], [25, 250]]);
  const veces = Math.log2(factor);
  const pasos = [];
  let x = n;
  for (let i = 0; i < veces; i++) {
    pasos.push(`Doble de ${cmFmt(x)} = ${cmFmt(x * 2)}`);
    x *= 2;
  }
  return {
    enunciado: `${n} × ${factor}`,
    pista: factor === 2 ? `Calcula el doble de ${n}.` : `Calcula el doble de ${n} ${veces === 2 ? "dos" : "tres"} veces seguidas.`,
    respuesta: n * factor,
    pasos,
    errores: [n * factor / 2, n * factor * 2, n * (factor + 1)],
  };
}

function truco_mitades(nivel = "normal") {
  const div = nivel === "acs" ? 2 : nivel === "facil" ? cmPick([2, 4]) : cmPick([4, 8]);
  const q = cmRango(nivel, [[3, 30], [4, 40], [6, 90], [25, 250]]);
  const n = q * div;
  const veces = Math.log2(div);
  const pasos = [];
  let x = n;
  for (let i = 0; i < veces; i++) {
    pasos.push(`Mitad de ${cmFmt(x)} = ${cmFmt(x / 2)}`);
    x /= 2;
  }
  return {
    enunciado: `${cmFmt(n)} ÷ ${div}`,
    pista: div === 2 ? `Calcula la mitad de ${cmFmt(n)}.` : `Calcula la mitad de ${cmFmt(n)} ${veces === 2 ? "dos" : "tres"} veces seguidas.`,
    respuesta: q,
    pasos,
    errores: [q * 2, q / 2, q + 1].filter(Number.isInteger),
  };
}

function truco_multiplicarPotenciasDiez(nivel = "normal") {
  const factor = nivel === "acs" ? 10 : nivel === "facil" ? cmPick([10, 100]) : cmPick([10, 100, 1000]);
  const ceros = Math.log10(factor);
  const dividir = nivel !== "acs" && Math.random() < 0.4;
  if (dividir) {
    const q = cmRango(nivel, [[2, 50], [2, 90], [2, 900], [12, 9000]]);
    return {
      enunciado: `${cmFmt(q * factor)} ÷ ${cmFmt(factor)}`,
      pista: `Quita ${ceros} ${ceros === 1 ? "cero" : "ceros"} del final.`,
      respuesta: q,
      pasos: [`${cmFmt(factor)} tiene ${ceros} ${ceros === 1 ? "cero" : "ceros"}: se quitan del final de ${cmFmt(q * factor)}.`, `${cmFmt(q * factor)} ÷ ${cmFmt(factor)} = ${cmFmt(q)}`],
      errores: [q * 10, q / 10, q * factor].filter(Number.isInteger),
    };
  }
  const n = cmRango(nivel, [[2, 50], [2, 90], [2, 900], [12, 9000]]);
  return {
    enunciado: `${cmFmt(n)} × ${cmFmt(factor)}`,
    pista: `Añade ${ceros} ${ceros === 1 ? "cero" : "ceros"} a la derecha de ${cmFmt(n)}.`,
    respuesta: n * factor,
    pasos: [`${cmFmt(factor)} tiene ${ceros} ${ceros === 1 ? "cero" : "ceros"}: se añaden a ${cmFmt(n)}.`, `${cmFmt(n)} × ${cmFmt(factor)} = ${cmFmt(n * factor)}`],
    errores: [n * factor * 10, n * factor / 10, n + factor].filter(Number.isInteger),
  };
}

function truco_multiplicarPorCinco(nivel = "normal") {
  const n = cmRango(nivel, [[4, 20], [4, 40], [12, 400], [120, 4000]]);
  return {
    enunciado: `${cmFmt(n)} × 5`,
    pista: `Multiplica ${cmFmt(n)} × 10 y calcula la mitad.`,
    respuesta: n * 5,
    pasos: [`${cmFmt(n)} × 10 = ${cmFmt(n * 10)}`, `Mitad de ${cmFmt(n * 10)} = ${cmFmt(n * 5)}`],
    errores: [n * 10, n * 5 + 5, n * 5 - 5],
  };
}

function truco_dividirEntreCinco(nivel = "normal") {
  const q = cmRango(nivel, [[2, 20], [2, 40], [6, 200], [60, 2000]]);
  const n = q * 5;
  return {
    enunciado: `${cmFmt(n)} ÷ 5`,
    pista: `Calcula el doble de ${cmFmt(n)} y divide entre 10.`,
    respuesta: q,
    pasos: [`Doble de ${cmFmt(n)} = ${cmFmt(n * 2)}`, `${cmFmt(n * 2)} ÷ 10 = ${cmFmt(q)}`],
    errores: [q * 2, q + 1, q - 1],
  };
}

function truco_multiplicarPorNueve(nivel = "normal") {
  const n = cmRango(nivel, [[2, 12], [3, 20], [12, 90], [45, 450]]);
  return {
    enunciado: `${cmFmt(n)} × 9`,
    pista: `Multiplica ${cmFmt(n)} × 10 y resta ${cmFmt(n)}.`,
    respuesta: n * 9,
    pasos: [`${cmFmt(n)} × 10 = ${cmFmt(n * 10)}`, `${cmFmt(n * 10)} − ${cmFmt(n)} = ${cmFmt(n * 9)}`],
    errores: [n * 10, n * 10 - 1, n * 9 + 10],
  };
}

function truco_por25y50(nivel = "normal") {
  const f = nivel === "facil" ? 50 : cmPick([25, 50]);
  const k = f === 25 ? 4 : 2;
  const n = cmRango(nivel, [[2, 10], [2, 20], [4, 80], [16, 400]]);
  return {
    enunciado: `${cmFmt(n)} × ${f}`,
    pista: `Multiplica por 100 y divide entre ${k}.`,
    respuesta: n * f,
    pasos: [`${f} = 100 ÷ ${k}`, `${cmFmt(n)} × 100 = ${cmFmt(n * 100)}`, `${cmFmt(n * 100)} ÷ ${k} = ${cmFmt(n * f)}`],
    errores: [n * 100, n * f * 2, n * f + f].filter(Number.isInteger),
  };
}

// ---------------- Bloque 3 · Trucos avanzados ----------------

function truco_multiplicarPorOnce(nivel = "normal") {
  const decenas = cmRandomInt(1, 9);
  const unidades = nivel === "facil" ? cmRandomInt(0, 9 - decenas) : cmRandomInt(0, 9);
  const n = decenas * 10 + unidades;
  const s = decenas + unidades;
  const pasos =
    s < 10
      ? [`Separa las cifras de ${n}: ${decenas} … ${unidades}`, `En medio va su suma: ${decenas} + ${unidades} = ${s}`, `${n} × 11 = ${n * 11}`]
      : [`Separa las cifras de ${n}: ${decenas} … ${unidades}`, `Su suma es ${s}: en medio va el ${s - 10} y se suma 1 a la primera cifra (${decenas} + 1 = ${decenas + 1})`, `${n} × 11 = ${cmFmt(n * 11)}`];
  return {
    enunciado: `${n} × 11`,
    pista: s < 10 ? `Pon la suma de las cifras (${decenas} + ${unidades}) en medio.` : `Pon la suma de las cifras en medio; como pasa de 9, suma 1 a la primera cifra.`,
    respuesta: n * 11,
    pasos,
    errores: [decenas * 100 + s * 10 + unidades, n * 10, n * 11 + 10].filter((x) => x !== n * 11),
  };
}

function truco_descomposicionMultiplicar(nivel = "normal") {
  const n = cmRango(nivel, [[11, 19], [11, 29], [13, 99], [101, 999]]);
  const factor = cmRandomInt(3, 9);
  const grande = Math.floor(n / 10) * 10;
  const u = n % 10;
  if (u === 0) return truco_descomposicionMultiplicar(nivel);
  return {
    enunciado: `${cmFmt(n)} × ${factor}`,
    pista: `${cmFmt(n)} = ${cmFmt(grande)} + ${u}: multiplica cada parte por ${factor} y suma.`,
    respuesta: n * factor,
    pasos: [`${cmFmt(grande)} × ${factor} = ${cmFmt(grande * factor)}`, `${u} × ${factor} = ${u * factor}`, `${cmFmt(grande * factor)} + ${u * factor} = ${cmFmt(n * factor)}`],
    errores: [grande * factor + u, grande * factor, n * factor + 10],
  };
}

function truco_redondeoAproximar(nivel = "normal") {
  const base = nivel === "acs" || nivel === "facil" ? 10 : cmPick([10, 100]);
  const range = base === 10 ? [11, 89] : [110, 890];
  let a;
  let b;
  // Sin números que acaben justo en 5 (o 50): así el redondeo no da dudas.
  do {
    a = cmRandomInt(range[0], range[1]);
    b = cmRandomInt(range[0], range[1]);
  } while (a % base === base / 2 || b % base === base / 2 || a % base === 0 || b % base === 0);
  const aR = cmRoundToNearest(a, base);
  const bR = cmRoundToNearest(b, base);
  const unidad = base === 10 ? "decena" : "centena";
  return {
    enunciado: `${a} + ${b} ≈`,
    pista: `Redondea cada número a la ${unidad} más cercana y suma los números redondeados.`,
    respuesta: aR + bR,
    pasos: [`${a} → ${aR}`, `${b} → ${bR}`, `${aR} + ${bR} = ${cmFmt(aR + bR)} (el resultado exacto es ${cmFmt(a + b)})`],
    errores: [a + b, aR + bR + base, aR + bR - base].filter((x) => x !== aR + bR),
    estimacion: true,
  };
}

function truco_porcentajesMentales(nivel = "normal") {
  const pct = nivel === "facil" ? cmPick([10, 50]) : cmPick([10, 50, 25, 20, 75]);
  const n = cmRango(nivel, [[1, 10], [1, 20], [2, 50], [10, 200]]) * 20;
  const r = (n * pct) / 100;
  const pasos = {
    10: [`10% = dividir entre 10`, `${cmFmt(n)} ÷ 10 = ${cmFmt(r)}`],
    50: [`50% = la mitad`, `Mitad de ${cmFmt(n)} = ${cmFmt(r)}`],
    25: [`25% = la mitad de la mitad`, `Mitad de ${cmFmt(n)} = ${cmFmt(n / 2)}`, `Mitad de ${cmFmt(n / 2)} = ${cmFmt(r)}`],
    20: [`20% = el doble del 10%`, `10% de ${cmFmt(n)} = ${cmFmt(n / 10)}`, `Doble de ${cmFmt(n / 10)} = ${cmFmt(r)}`],
    75: [`75% = 50% + 25%`, `50% de ${cmFmt(n)} = ${cmFmt(n / 2)} y 25% = ${cmFmt(n / 4)}`, `${cmFmt(n / 2)} + ${cmFmt(n / 4)} = ${cmFmt(r)}`],
  }[pct];
  return {
    enunciado: `${pct}% de ${cmFmt(n)}`,
    pista: { 10: "Divide entre 10.", 50: "Calcula la mitad.", 25: "Calcula la mitad de la mitad.", 20: "Calcula el 10% y dóblalo.", 75: "Suma la mitad y la cuarta parte." }[pct],
    respuesta: r,
    pasos,
    errores: [n - r, r * 2, n / 10, pct].filter((x) => x !== r && Number.isInteger(x)),
  };
}

function truco_decimalesPorDiez(nivel = "normal") {
  const mult = Math.random() < 0.5;
  const decs = cmRandomInt(1, 2);
  // Al dividir, como mucho tres cifras decimales (milésimas) en el resultado.
  const posibles = nivel === "facil" ? [10] : [10, 100, 1000].filter((f) => mult || decs + Math.log10(f) <= 3);
  const factor = cmPick(posibles);
  const ceros = Math.log10(factor);
  const entero = cmRandomInt(nivel === "altas" ? 10 : 1, nivel === "altas" ? 999 : 99);
  const n = Math.round((entero + cmRandomInt(1, 10 ** decs - 1) / 10 ** decs) * 1000) / 1000;
  const r = Math.round((mult ? n * factor : n / factor) * 100000) / 100000;
  return {
    enunciado: `${cmFmt(n)} ${mult ? "×" : "÷"} ${cmFmt(factor)}`,
    pista: `Mueve la coma ${ceros} ${ceros === 1 ? "lugar" : "lugares"} a la ${mult ? "derecha" : "izquierda"}.`,
    respuesta: r,
    pasos: [`${mult ? "Multiplicar por" : "Dividir entre"} ${cmFmt(factor)}: la coma se mueve ${ceros} ${ceros === 1 ? "lugar" : "lugares"} a la ${mult ? "derecha" : "izquierda"}.`, `${cmFmt(n)} ${mult ? "×" : "÷"} ${cmFmt(factor)} = ${cmFmt(r)}`],
    errores: [mult ? n / factor : n * factor, mult ? r * 10 : r / 10, mult ? r / 10 : r * 10].map((x) => Math.round(x * 100000) / 100000).filter((x) => x !== r),
  };
}

function truco_fraccionCantidad(nivel = "normal") {
  const den = nivel === "facil" ? cmPick([2, 4]) : cmPick([2, 3, 4, 5, 10]);
  const num = nivel === "facil" ? 1 : cmRandomInt(1, den - 1);
  const parte = cmRango(nivel, [[2, 10], [2, 15], [3, 30], [12, 120]]);
  const n = parte * den;
  return {
    enunciado: `${num}/${den} de ${cmFmt(n)}`,
    pista: `Divide entre ${den} y multiplica por ${num}.`,
    respuesta: parte * num,
    pasos: num === 1 ? [`${cmFmt(n)} ÷ ${den} = ${cmFmt(parte)}`] : [`${cmFmt(n)} ÷ ${den} = ${cmFmt(parte)}`, `${cmFmt(parte)} × ${num} = ${cmFmt(parte * num)}`],
    errores: [parte, n / num, parte * (num + 1), n - parte * num].filter((x) => Number.isInteger(x) && x !== parte * num),
  };
}

// ---------------- Registro de trucos y bloques ----------------

const TRUCOS_CALCULO_MENTAL = [
  { id: "compensacion-suma", bloque: 1, label: "Compensación en la suma", generar: truco_compensacionSuma },
  { id: "compensacion-resta", bloque: 1, label: "Compensación en la resta", generar: truco_compensacionResta },
  { id: "nueves", bloque: 1, label: "Sumar y restar 9, 99 y 999", generar: truco_nueves },
  { id: "descomposicion-suma-resta", bloque: 1, label: "Descomposición en sumas y restas", generar: truco_descomposicionSumaResta },
  { id: "complemento-cien", bloque: 1, label: "Complemento a 100 / 1.000", generar: truco_complementoCien },
  { id: "dobles-mitades", bloque: 2, label: "Dobles encadenados (× 2, × 4, × 8)", generar: truco_doblesMitades },
  { id: "mitades", bloque: 2, label: "Mitades encadenadas (÷ 2, ÷ 4, ÷ 8)", generar: truco_mitades },
  { id: "multiplicar-potencias-diez", bloque: 2, label: "Multiplicar y dividir por 10, 100 y 1.000", generar: truco_multiplicarPotenciasDiez },
  { id: "multiplicar-cinco", bloque: 2, label: "Multiplicar por 5", generar: truco_multiplicarPorCinco },
  { id: "dividir-cinco", bloque: 2, label: "Dividir entre 5", generar: truco_dividirEntreCinco },
  { id: "multiplicar-nueve", bloque: 2, label: "Multiplicar por 9", generar: truco_multiplicarPorNueve },
  { id: "por-25-50", bloque: 2, label: "Multiplicar por 25 y por 50", generar: truco_por25y50 },
  { id: "multiplicar-once", bloque: 3, label: "Multiplicar por 11", generar: truco_multiplicarPorOnce },
  { id: "descomposicion-multiplicar", bloque: 3, label: "Descomposición para multiplicar", generar: truco_descomposicionMultiplicar },
  { id: "redondeo-aproximar", bloque: 3, label: "Redondeo para estimar", generar: truco_redondeoAproximar },
  { id: "porcentajes-mentales", bloque: 3, label: "Porcentajes mentales", generar: truco_porcentajesMentales },
  { id: "decimales-diez", bloque: 3, label: "Decimales por 10, 100 y 1.000", generar: truco_decimalesPorDiez },
  { id: "fraccion-cantidad", bloque: 3, label: "Fracción de una cantidad", generar: truco_fraccionCantidad },
];

// ACS: los trucos más sencillos, con números de dos cifras.
const TRUCOS_CALCULO_MENTAL_ACS = TRUCOS_CALCULO_MENTAL.filter((t) =>
  ["compensacion-suma", "compensacion-resta", "nueves", "descomposicion-suma-resta", "complemento-cien", "dobles-mitades", "mitades", "multiplicar-potencias-diez"].includes(t.id)
).map((t) => ({ ...t, generar: () => t.generar("acs") }));

const BLOQUES_CALCULO_MENTAL = [
  { id: 1, label: "Bloque 1 · Sumas y restas ágiles" },
  { id: 2, label: "Bloque 2 · Multiplicación y división ágiles" },
  { id: 3, label: "Bloque 3 · Trucos avanzados" },
];

function trucosDeBloque(bloqueId, lista = TRUCOS_CALCULO_MENTAL) {
  return lista.filter((t) => t.bloque === bloqueId);
}
