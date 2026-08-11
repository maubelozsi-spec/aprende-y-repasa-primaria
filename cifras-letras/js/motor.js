// ============================================================
// Cifras y Letras — motor del juego (sin dependencias).
// Bolsas de letras con frecuencias del español, sorteo de la
// prueba de cifras por niveles, solucionador exacto de cifras
// (estilo "Countdown"), búsqueda de la mejor palabra posible y
// tablas de puntuación adaptadas del programa de televisión.
// ============================================================

// ---------- utilidades ----------

export function idAleatorio() {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
}

// Código de partida: 6 caracteres fáciles de dictar en voz alta
// (sin O/0 ni I/1 para que no se confundan en la pizarra).
export function generarCodigo() {
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c = "";
  for (let i = 0; i < 6; i++) c += abc[Math.floor(Math.random() * abc.length)];
  return c;
}

export function normalizarPalabra(texto) {
  // Mayúsculas, sin tildes ni diéresis; la Ñ se conserva como letra propia.
  return String(texto || "")
    .toUpperCase()
    .replace(/Á/g, "A").replace(/É/g, "E").replace(/Í/g, "I")
    .replace(/Ó/g, "O").replace(/Ú/g, "U").replace(/Ü/g, "U")
    .replace(/[^A-ZÑ]/g, "");
}

function elegirPonderado(pares) {
  // pares: [[valor, peso], …]
  const total = pares.reduce((s, p) => s + p[1], 0);
  let r = Math.random() * total;
  for (const [valor, peso] of pares) {
    r -= peso;
    if (r <= 0) return valor;
  }
  return pares[pares.length - 1][0];
}

// ============================================================
//  PRUEBA DE LETRAS
// ============================================================

// Frecuencias aproximadas de las letras en español. La K y la W
// no entran (apenas forman palabras que conozcan los alumnos).
const VOCALES = [["A", 12], ["E", 14], ["I", 6], ["O", 9], ["U", 5]];
const CONSONANTES = [
  ["S", 8], ["R", 7], ["N", 7], ["L", 6], ["T", 5], ["C", 5], ["D", 5],
  ["M", 4], ["P", 3], ["B", 2], ["G", 2], ["V", 1.5], ["H", 1.5], ["F", 1],
  ["J", 1], ["Z", 1], ["Y", 1], ["Q", 0.5], ["X", 0.3], ["Ñ", 0.3],
];

// Saca una letra del tipo pedido, evitando más de 3 repeticiones
// de la misma letra en la ronda (pasa poco, pero desluce el juego).
export function sortearLetra(tipo, yaSacadas) {
  const bolsa = tipo === "vocal" ? VOCALES : CONSONANTES;
  for (let intento = 0; intento < 20; intento++) {
    const letra = elegirPonderado(bolsa);
    const repetidas = (yaSacadas || []).filter((l) => l === letra).length;
    if (repetidas < 3) return letra;
  }
  return elegirPonderado(bolsa);
}

// Sorteo automático equilibrado (para el modo rápido y las salas
// de alumnos): reparte vocales y consonantes a ojo de buen cubero.
export function sortearLetrasAutomatico(numLetras) {
  const vocales = numLetras <= 8 ? 3 : 4;
  const tipos = [];
  for (let i = 0; i < numLetras; i++) tipos.push(i < vocales ? "vocal" : "consonante");
  // Barajamos para que no salgan todas las vocales seguidas.
  for (let i = tipos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tipos[i], tipos[j]] = [tipos[j], tipos[i]];
  }
  const letras = [];
  for (const t of tipos) letras.push(sortearLetra(t, letras));
  return letras;
}

// ¿Se puede formar `palabra` solo con las letras disponibles
// (cada ficha se usa una vez como mucho)?
export function palabraCabeEnLetras(palabra, letras) {
  const disponibles = {};
  for (const l of letras) disponibles[l] = (disponibles[l] || 0) + 1;
  for (const l of normalizarPalabra(palabra)) {
    if (!disponibles[l]) return false;
    disponibles[l]--;
  }
  return true;
}

// Mejores palabras posibles con esas letras según el diccionario
// (lista de formas ya normalizadas). Devuelve las más largas.
export function mejoresPalabras(letras, formas, maximo) {
  const encontradas = [];
  let mejorLongitud = 0;
  for (const forma of formas) {
    if (forma.length < 3 || forma.length > letras.length) continue;
    if (forma.length < mejorLongitud) continue;
    if (!palabraCabeEnLetras(forma, letras)) continue;
    if (forma.length > mejorLongitud) {
      mejorLongitud = forma.length;
      encontradas.length = 0;
    }
    if (!encontradas.includes(forma)) encontradas.push(forma);
  }
  return encontradas.slice(0, maximo || 5);
}

// Puntuación de letras, adaptada de la tele: un punto por letra
// de la palabra válida y el doble si se usan todas las fichas.
export function puntosLetras(palabra, numLetras) {
  const n = normalizarPalabra(palabra).length;
  if (!n) return 0;
  return n === numLetras ? n * 2 : n;
}

// ============================================================
//  PRUEBA DE CIFRAS
// ============================================================

// Niveles pensados para 5º y 6º de primaria. El 3 es el clásico
// del programa (6 fichas, objetivo de tres cifras).
export const NIVELES_CIFRAS = {
  1: { nombre: "Iniciación", fichas: 4, grandes: 0, objetivoMin: 11, objetivoMax: 99 },
  2: { nombre: "Avanzado", fichas: 5, grandes: 1, objetivoMin: 101, objetivoMax: 499 },
  3: { nombre: "Como en la tele", fichas: 6, grandes: 2, objetivoMin: 101, objetivoMax: 999 },
};

const FICHAS_GRANDES = [25, 50, 75, 100];

function sortearFichas(nivel) {
  const cfg = NIVELES_CIFRAS[nivel] || NIVELES_CIFRAS[1];
  // Bolsa clásica: dos juegos del 1 al 10 y una ficha de cada grande.
  const pequenas = [];
  for (let n = 1; n <= 10; n++) { pequenas.push(n, n); }
  const grandes = FICHAS_GRANDES.slice();
  const fichas = [];
  const numGrandes = cfg.grandes ? 1 + Math.floor(Math.random() * cfg.grandes) : 0;
  for (let i = 0; i < Math.min(numGrandes, cfg.grandes); i++) {
    fichas.push(grandes.splice(Math.floor(Math.random() * grandes.length), 1)[0]);
  }
  while (fichas.length < cfg.fichas) {
    fichas.push(pequenas.splice(Math.floor(Math.random() * pequenas.length), 1)[0]);
  }
  return fichas.sort((a, b) => a - b);
}

// Solucionador exacto: combina las fichas de dos en dos con las
// cuatro operaciones (división exacta y resta positiva, como en la
// tele) y apunta todos los resultados alcanzables con su "receta".
function explorarAlcanzables(fichas, minimo, maximo) {
  const alcanzables = new Map(); // valor → pasos [{a, op, b, r}]
  const visitados = new Set();

  function clave(nums) { return nums.slice().sort((a, b) => a - b).join(","); }

  function explorar(nums, pasos) {
    const k = clave(nums) + "|" + pasos.length;
    if (visitados.has(k)) return;
    visitados.add(k);
    for (const n of nums) {
      if (n >= minimo && n <= maximo && !alcanzables.has(n)) {
        alcanzables.set(n, pasos.slice());
      }
    }
    if (nums.length < 2) return;
    for (let i = 0; i < nums.length; i++) {
      for (let j = 0; j < nums.length; j++) {
        if (i === j) continue;
        const a = nums[i], b = nums[j];
        if (a < b) continue; // basta con a ≥ b (suma y producto conmutan; resta y división exigen a ≥ b)
        const resto = nums.filter((_, idx) => idx !== i && idx !== j);
        const opciones = [
          ["+", a + b], ["×", a * b],
        ];
        if (a - b > 0) opciones.push(["−", a - b]);
        if (b > 1 && a % b === 0) opciones.push(["÷", a / b]);
        if (b === 0) continue;
        for (const [op, r] of opciones) {
          if (r > 100000) continue;
          explorar(resto.concat([r]), pasos.concat([{ a: a, op: op, b: b, r: r }]));
        }
      }
    }
  }

  explorar(fichas, []);
  return alcanzables;
}

// Sortea una ronda de cifras GARANTIZANDO que el objetivo tiene
// solución exacta (en la tele no siempre la hay; con niños es
// mejor que el "¡se podía!" exista siempre).
export function sortearRondaCifras(nivel) {
  const cfg = NIVELES_CIFRAS[nivel] || NIVELES_CIFRAS[1];
  for (let intento = 0; intento < 8; intento++) {
    const fichas = sortearFichas(nivel);
    const alcanzables = explorarAlcanzables(fichas, cfg.objetivoMin, cfg.objetivoMax);
    // Quitamos los objetivos "regalados": los que son una ficha tal cual.
    const candidatos = [...alcanzables.keys()].filter((v) => !fichas.includes(v));
    if (candidatos.length < 5) continue;
    const objetivo = candidatos[Math.floor(Math.random() * candidatos.length)];
    return { fichas: fichas, objetivo: objetivo, solucion: alcanzables.get(objetivo) };
  }
  // Plan B (rarísimo): objetivo suma de dos fichas.
  const fichas = sortearFichas(nivel);
  const objetivo = fichas[0] + fichas[fichas.length - 1];
  return { fichas: fichas, objetivo: objetivo, solucion: [{ a: fichas[fichas.length - 1], op: "+", b: fichas[0], r: objetivo }] };
}

// Texto legible de una receta de pasos: "75 × 4 = 300 · 300 − 2 = 298".
export function textoSolucion(pasos) {
  if (!pasos || !pasos.length) return "";
  return pasos.map((p) => p.a + " " + p.op + " " + p.b + " = " + p.r).join("  ·  ");
}

// Comprueba en el servidor de la verdad (este mismo código) que los
// pasos enviados por un jugador son legales y usan solo sus fichas.
export function validarPasosCifras(fichas, pasos) {
  const disponibles = fichas.slice();
  for (const p of pasos) {
    const ia = disponibles.indexOf(p.a);
    if (ia === -1) return { ok: false, motivo: "usa un número que no tenía" };
    disponibles.splice(ia, 1);
    const ib = disponibles.indexOf(p.b);
    if (ib === -1) return { ok: false, motivo: "usa un número que no tenía" };
    disponibles.splice(ib, 1);
    let r;
    if (p.op === "+") r = p.a + p.b;
    else if (p.op === "−" || p.op === "-") r = p.a - p.b;
    else if (p.op === "×" || p.op === "*") r = p.a * p.b;
    else if (p.op === "÷" || p.op === "/") r = p.b !== 0 && p.a % p.b === 0 ? p.a / p.b : NaN;
    else return { ok: false, motivo: "operación desconocida" };
    if (!Number.isInteger(r) || r <= 0) return { ok: false, motivo: "operación no permitida (resultado no natural)" };
    if (r !== p.r) return { ok: false, motivo: "hay una cuenta mal hecha" };
    disponibles.push(r);
  }
  return { ok: true };
}

// Puntuación de cifras, la clásica del programa: 8 puntos el pleno
// y va bajando con la distancia al objetivo (a partir de 7, nada).
export function puntosCifras(distancia) {
  if (distancia === 0) return 8;
  const tabla = { 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1 };
  return tabla[distancia] || 0;
}

// ---------- reparto de puntos de una ronda ----------

// respuestas: [{ estado, puntosPosibles }] con estado "valida"/"invalida".
// modo "todos": cada uno se lleva sus puntos; modo "mejor": solo
// quien haya hecho la mejor jugada válida (como en la tele).
export function repartirPuntos(respuestas, modo) {
  const validas = respuestas.filter((r) => r.estado === "valida" && r.puntosPosibles > 0);
  if (modo === "mejor") {
    const tope = Math.max(0, ...validas.map((r) => r.puntosPosibles));
    return respuestas.map((r) =>
      r.estado === "valida" && r.puntosPosibles === tope && tope > 0 ? r.puntosPosibles : 0);
  }
  return respuestas.map((r) => (r.estado === "valida" ? r.puntosPosibles : 0));
}
