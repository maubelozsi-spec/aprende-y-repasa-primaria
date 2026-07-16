// ============================================================
// Cálculo mental: banco de "trucos" organizados en 3 bloques
// progresivos (pensados para trabajar a lo largo del curso, uno
// por trimestre aproximadamente). Cada truco tiene una función
// generadora que crea una operación aleatoria adecuada para
// practicar esa estrategia concreta, junto con una pista y la
// respuesta correcta. Lo usan tanto el juego de práctica como el
// generador de fichas en Word.
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

// ---------------- Generadores de operaciones por truco ----------------

function truco_compensacionSuma() {
  const a = cmRandomInt(20, 900);
  const bTens = cmRandomInt(1, 8) * 10;
  const bUnit = cmPick([7, 8, 9]);
  const b = bTens + bUnit;
  const roundedB = bTens + 10;
  const diff = roundedB - b;
  return {
    enunciado: `${a} + ${b}`,
    pista: `Redondea ${b} a ${roundedB} y resta ${diff} al final.`,
    respuesta: a + b,
  };
}

function truco_compensacionResta() {
  const bTens = cmRandomInt(2, 8) * 10;
  const bUnit = cmPick([7, 8, 9]);
  const b = bTens + bUnit;
  const a = b + cmRandomInt(20, 400);
  const roundedB = bTens + 10;
  const diff = roundedB - b;
  return {
    enunciado: `${a} - ${b}`,
    pista: `Resta ${roundedB} (redondeando) y luego suma ${diff}.`,
    respuesta: a - b,
  };
}

function truco_descomposicionSumaResta() {
  const op = cmPick(["+", "-"]);
  if (op === "+") {
    const a = cmRandomInt(100, 900);
    const b = cmRandomInt(100, 900);
    return {
      enunciado: `${a} + ${b}`,
      pista: "Suma centenas, decenas y unidades por separado y luego júntalas.",
      respuesta: a + b,
    };
  }
  const b = cmRandomInt(100, 800);
  const a = b + cmRandomInt(50, 400);
  return {
    enunciado: `${a} - ${b}`,
    pista: "Resta centenas, decenas y unidades por separado.",
    respuesta: a - b,
  };
}

function truco_complementoCien() {
  const target = cmPick([100, 1000]);
  const a = target === 100 ? cmRandomInt(1, 99) : cmRandomInt(1, 999);
  return {
    enunciado: `${target} - ${a}`,
    pista: `Busca el complemento: ¿cuánto le falta a ${a} para llegar a ${target}?`,
    respuesta: target - a,
  };
}

function truco_doblesMitades() {
  const factor = cmPick([4, 8]);
  const n = cmRandomInt(6, 90);
  const pista = factor === 4 ? `Duplica ${n} dos veces seguidas.` : `Duplica ${n} tres veces seguidas.`;
  return { enunciado: `${n} × ${factor}`, pista, respuesta: n * factor };
}

function truco_multiplicarPotenciasDiez() {
  const factor = cmPick([10, 100, 1000]);
  const n = cmRandomInt(2, 900);
  return {
    enunciado: `${n} × ${factor}`,
    pista: `Añade los ceros de ${factor} a la derecha de ${n}.`,
    respuesta: n * factor,
  };
}

function truco_multiplicarPorCinco() {
  const n = cmRandomInt(4, 400);
  return { enunciado: `${n} × 5`, pista: `Multiplica ${n} × 10 y calcula la mitad.`, respuesta: n * 5 };
}

function truco_dividirEntreCinco() {
  const n = cmRandomInt(2, 200) * 5;
  return { enunciado: `${n} ÷ 5`, pista: `Duplica ${n} y divide el resultado entre 10.`, respuesta: n / 5 };
}

function truco_multiplicarPorNueve() {
  const n = cmRandomInt(2, 90);
  return { enunciado: `${n} × 9`, pista: `Multiplica ${n} × 10 y resta ${n}.`, respuesta: n * 9 };
}

function truco_multiplicarPorOnce() {
  const decenas = cmRandomInt(1, 9);
  const unidades = cmRandomInt(0, 9);
  const n = decenas * 10 + unidades;
  const sumaCifras = decenas + unidades;
  const pista =
    sumaCifras < 10
      ? `Suma las cifras de ${n} (${decenas}+${unidades}=${sumaCifras}) y colócala en medio: ${decenas}${sumaCifras}${unidades}.`
      : `Suma las cifras de ${n} (${decenas}+${unidades}=${sumaCifras}); como pasa de 9, se lleva 1 a las decenas.`;
  return { enunciado: `${n} × 11`, pista, respuesta: n * 11 };
}

function truco_descomposicionMultiplicar() {
  const n = cmRandomInt(11, 99);
  const factor = cmRandomInt(3, 9);
  const decenas = Math.floor(n / 10) * 10;
  const unidades = n % 10;
  return {
    enunciado: `${n} × ${factor}`,
    pista: `Multiplica ${decenas} × ${factor} y ${unidades} × ${factor}, y suma los resultados.`,
    respuesta: n * factor,
  };
}

function truco_redondeoAproximar() {
  const base = cmPick([10, 100]);
  const range = base === 10 ? [11, 89] : [110, 890];
  const a = cmRandomInt(range[0], range[1]);
  const b = cmRandomInt(range[0], range[1]);
  const aR = cmRoundToNearest(a, base);
  const bR = cmRoundToNearest(b, base);
  const unidad = base === 10 ? "decena" : "centena";
  return {
    enunciado: `${a} + ${b}  (estimación redondeando a ${unidad}s)`,
    pista: `Redondea cada número a la ${unidad} más cercana antes de sumar: ${a}→${aR}, ${b}→${bR}.`,
    respuesta: aR + bR,
  };
}

function truco_porcentajesMentales() {
  const pct = cmPick([10, 50, 25]);
  const n = cmRandomInt(2, 50) * 20;
  const pista =
    pct === 10 ? `Divide ${n} entre 10.` : pct === 50 ? `Calcula la mitad de ${n}.` : `Calcula la mitad de la mitad de ${n}.`;
  return { enunciado: `El ${pct}% de ${n}`, pista, respuesta: (n * pct) / 100 };
}

// ---------------- Registro de trucos y bloques ----------------

const TRUCOS_CALCULO_MENTAL = [
  { id: "compensacion-suma", bloque: 1, label: "Compensación en la suma", generar: truco_compensacionSuma },
  { id: "compensacion-resta", bloque: 1, label: "Compensación en la resta", generar: truco_compensacionResta },
  { id: "descomposicion-suma-resta", bloque: 1, label: "Descomposición en sumas y restas", generar: truco_descomposicionSumaResta },
  { id: "complemento-cien", bloque: 1, label: "Complemento a 100 / 1000", generar: truco_complementoCien },
  { id: "dobles-mitades", bloque: 2, label: "Dobles y mitades encadenados", generar: truco_doblesMitades },
  { id: "multiplicar-potencias-diez", bloque: 2, label: "Multiplicar por 10, 100 y 1000", generar: truco_multiplicarPotenciasDiez },
  { id: "multiplicar-cinco", bloque: 2, label: "Multiplicar por 5", generar: truco_multiplicarPorCinco },
  { id: "dividir-cinco", bloque: 2, label: "Dividir entre 5", generar: truco_dividirEntreCinco },
  { id: "multiplicar-nueve", bloque: 2, label: "Multiplicar por 9", generar: truco_multiplicarPorNueve },
  { id: "multiplicar-once", bloque: 3, label: "Multiplicar por 11", generar: truco_multiplicarPorOnce },
  { id: "descomposicion-multiplicar", bloque: 3, label: "Descomposición para multiplicar", generar: truco_descomposicionMultiplicar },
  { id: "redondeo-aproximar", bloque: 3, label: "Redondeo para aproximar", generar: truco_redondeoAproximar },
  { id: "porcentajes-mentales", bloque: 3, label: "Porcentajes mentales (10%, 50%, 25%)", generar: truco_porcentajesMentales },
];

const BLOQUES_CALCULO_MENTAL = [
  { id: 1, label: "Bloque 1 · Sumas y restas ágiles" },
  { id: 2, label: "Bloque 2 · Multiplicación y división ágiles" },
  { id: 3, label: "Bloque 3 · Trucos avanzados" },
];

function trucosDeBloque(bloqueId) {
  return TRUCOS_CALCULO_MENTAL.filter((t) => t.bloque === bloqueId);
}
