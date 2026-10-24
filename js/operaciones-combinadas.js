// ============================================================
// Operaciones combinadas (5º T1 bloque 2 y 6º SdA 1)
// - Explora: resolver paso a paso, los paréntesis cambian el
//   resultado y operaciones del mismo nivel. No guarda progreso.
// - Práctica: las expresiones se generan al azar y se resuelven con
//   un motor que sigue la jerarquía (paréntesis → × y ÷ → + y −, y
//   dentro del mismo nivel, de izquierda a derecha). Cada pregunta
//   trae su pista y la resolución paso a paso. Solo la práctica
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
    // Sin opciones absurdas de 4 cifras o más.
    if (c !== undefined && c !== null && c !== "" && !out.includes(c) && !(/^\d+$/.test(c) && Number(c) > 999)) out.push(c);
  }
  return out;
}

// ------------------------------------------------------------
// Motor de expresiones. Una expresión es una lista de fichas:
// números, operaciones ("+", "−", "×", "÷") y paréntesis.
// ------------------------------------------------------------
const PREC = { "+": 1, "−": 1, "×": 2, "÷": 2 };
const isOp = (t) => typeof t === "string" && t in PREC;

function exprStr(tokens) {
  let s = "";
  tokens.forEach((t, i) => {
    if (i > 0 && t !== ")" && tokens[i - 1] !== "(") s += " ";
    s += t;
  });
  return s;
}

// Solo naturales: sin restas negativas ni divisiones con resto
// (salvo con `real`, que se usa para comprobar si dos caminos dan lo mismo).
function aplicar(a, op, b, real = false) {
  if (op === "+") return a + b;
  if (op === "−") return real || a - b >= 0 ? a - b : null;
  if (op === "×") return a * b;
  if (op === "÷") return b !== 0 && (real || a % b === 0) ? a / b : null;
  return null;
}

// Quita los paréntesis que solo encierran un número: (8) → 8.
function limpiar(tokens) {
  const out = tokens.slice();
  for (let i = 0; i + 2 < out.length; i++) {
    if (out[i] === "(" && typeof out[i + 1] === "number" && out[i + 2] === ")") {
      out.splice(i, 3, out[i + 1]);
      i = -1;
    }
  }
  return out;
}

// Tramo donde toca operar: el primer paréntesis interior o toda la expresión.
function tramo(tokens) {
  let open = -1;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "(") open = i;
    if (tokens[i] === ")") return [open + 1, i];
  }
  return [0, tokens.length];
}

// Índice de la operación que toca según la regla (o según una regla equivocada).
function opQueToca(tokens, modo = "bien") {
  const [a, b] = tramo(tokens);
  const ops = [];
  for (let i = a; i < b; i++) if (isOp(tokens[i])) ops.push(i);
  if (!ops.length) return -1;
  if (modo === "izquierda") return ops[0];
  if (modo === "sumasPrimero") return ops.find((i) => PREC[tokens[i]] === 1) ?? ops[0];
  return ops.find((i) => PREC[tokens[i]] === 2) ?? ops[0];
}

function paso(tokens, k, real = false) {
  const a = tokens[k - 1];
  const b = tokens[k + 1];
  const v = aplicar(a, tokens[k], b, real);
  if (v === null) return null;
  const nuevo = tokens.slice(0, k - 1).concat([v], tokens.slice(k + 2));
  return { tokens: limpiar(nuevo), op: `${a} ${tokens[k]} ${b}`, valor: v };
}

// Resuelve la expresión. modo: "bien", "izquierda" (sin jerarquía),
// "sumasPrimero" o "sinParentesis" (como si no los hubiera).
function resolver(tokens, modo = "bien", real = false) {
  let t = limpiar(modo === "sinParentesis" ? tokens.filter((x) => x !== "(" && x !== ")") : tokens);
  const pasos = [];
  let guard = 0;
  while (t.length > 1 && guard++ < 20) {
    const k = opQueToca(t, modo === "sinParentesis" ? "bien" : modo);
    if (k < 0) return null;
    const p = paso(t, k, real);
    if (!p) return null;
    pasos.push({ op: p.op, valor: p.valor, expr: exprStr(p.tokens) });
    t = p.tokens;
  }
  return typeof t[0] === "number" ? { valor: t[0], pasos } : null;
}

const cadena = (tokens, r) => [exprStr(tokens)].concat(r.pasos.map((p) => p.expr)).join(" = ");

function explicaPasos(tokens, r) {
  const frases = r.pasos.map((p, i) => {
    const sim = p.op.split(" ")[1];
    const que = sim === "×" ? "la multiplicación" : sim === "÷" ? "la división" : sim === "+" ? "la suma" : "la resta";
    return `${i === 0 ? "Primero" : i === r.pasos.length - 1 ? "Por último" : "Después"} ${que}${i === 0 && opEnParentesis(tokens) ? " del paréntesis" : ""}: ${p.op} = ${p.valor}`;
  });
  return `${frases.join(". ")}. ${cadena(tokens, r)}.`;
}

function opEnParentesis(tokens) {
  const [a] = tramo(tokens);
  return a > 0;
}

// ------------------------------------------------------------
// Niveles
// ------------------------------------------------------------
const LEVELS = {
  normal: { max: 12, ops: [2, 3], maxRes: 150, opsSet: ["+", "−", "×", "÷"] },
  facil: { max: 9, ops: [2, 2], maxRes: 60, opsSet: ["+", "−", "×", "÷"] },
  acs: { max: 6, ops: [2, 2], maxRes: 40, opsSet: ["+", "×"] },
  altas: { max: 20, ops: [3, 4], maxRes: 400, opsSet: ["+", "−", "×", "÷"] },
};

// Expresión al azar que cumple `ok`. Con paren, un paréntesis que sí cambia el resultado.
function nuevaExpr(L, { nOps, paren = false, ok = () => true, ops = L.opsSet } = {}) {
  for (let intento = 0; intento < 4000; intento++) {
    const n = nOps || randInt(L.ops[0], L.ops[1]);
    const nums = [];
    const os = [];
    for (let i = 0; i <= n; i++) nums.push(randInt(2, L.max));
    for (let i = 0; i < n; i++) os.push(pick(ops));
    // Divisiones: el divisor pequeño para que más a menudo salga exacta.
    os.forEach((o, i) => {
      if (o === "÷") nums[i + 1] = randInt(2, Math.min(L.max, 9));
    });
    let s = -1;
    let e = -1;
    if (paren) {
      s = randInt(0, n - 1);
      e = randInt(s + 1, n);
      if (s === 0 && e === n) continue;
    }
    const tokens = [];
    for (let i = 0; i <= n; i++) {
      if (i === s) tokens.push("(");
      tokens.push(nums[i]);
      if (i === e) tokens.push(")");
      if (i < n) tokens.push(os[i]);
    }
    const r = resolver(tokens);
    // Sin pasos que den 0 o 1 (7 − 7, ÷ 1) ni números demasiado grandes.
    if (!r || r.valor > L.maxRes || r.pasos.some((p) => p.valor <= 1 || p.valor > L.maxRes * 4)) continue;
    if (paren) {
      const sin = resolver(tokens, "sinParentesis");
      if (sin && sin.valor === r.valor) continue;
    }
    if (!ok(tokens, r)) continue;
    return { tokens, r };
  }
  return null;
}

// Respuestas equivocadas típicas: sin jerarquía, sumas primero, ignorando los paréntesis.
function erroresTipicos(tokens, r) {
  const out = [];
  for (const modo of ["izquierda", "sinParentesis", "sumasPrimero"]) {
    const w = resolver(tokens, modo);
    if (w && w.valor !== r.valor) out.push(String(w.valor));
  }
  return out;
}

const cambiaSinJerarquia = (tokens, r) => {
  const w = resolver(tokens, "izquierda");
  return !w || w.valor !== r.valor;
};

// ------------------------------------------------------------
// Generadores
// ------------------------------------------------------------
function genPrimero(L) {
  for (let intento = 0; intento < 200; intento++) {
    // Números distintos: así cada opción señala una sola operación de la expresión.
    const { tokens, r } = nuevaExpr(L, {
      paren: L !== LEVELS.acs && Math.random() < 0.5,
      ok: (t) => {
        const ns = t.filter((x) => typeof x === "number");
        return new Set(ns).size === ns.length;
      },
    });
    const correct = r.pasos[0].op;
    // Distractores: otras operaciones entre números vecinos que, hechas primero, dan otro resultado.
    const otras = [];
    const plano = tokens.filter((x) => x !== "(" && x !== ")");
    for (let k = 1; k < plano.length; k += 2) {
      const op = `${plano[k - 1]} ${plano[k]} ${plano[k + 1]}`;
      if (op === correct) continue;
      otras.push(op);
    }
    const distintas = otras.filter((op) => {
      // Comprobar que hacerla primero cambia el resultado (si no, también valdría).
      const idx = tokens.findIndex((t, i) => isOp(t) && `${tokens[i - 1]} ${t} ${tokens[i + 1]}` === op);
      if (idx < 0) return true;
      // Con números reales: si hecha primero diera lo mismo, no sería un error.
      const p = paso(tokens, idx, true);
      if (!p) return true;
      const rest = resolver(p.tokens, "bien", true);
      return !rest || Math.abs(rest.valor - r.valor) > 1e-9;
    });
    if (distintas.length < 2) continue;
    // Un distractor más: los dos números de los extremos.
    const extra = `${plano[0]} ${plano[1]} ${plano[plano.length - 1]}`;
    return {
      instruction: "¿Qué operación se resuelve primero?",
      display: exprStr(tokens),
      // El extra no puede «leerse» dentro de la expresión (5 + 2 dentro de 15 + 2).
      options: uniqueOptions(correct, distintas.concat(exprStr(tokens).includes(extra) ? [] : [extra])),
      correct,
      hint: "Primero lo que está entre paréntesis. Si no hay, las multiplicaciones y divisiones. Dentro del mismo nivel, de izquierda a derecha.",
      explain: explicaPasos(tokens, r),
    };
  }
  return genSin(L);
}

function opcionesValor(tokens, r) {
  const v = r.valor;
  return uniqueOptions(String(v), erroresTipicos(tokens, r).concat([String(v + 1), String(v + 10), v > 1 ? String(v - 1) : String(v + 2), String(v + 2)]));
}

function genSin(L) {
  const { tokens, r } = nuevaExpr(L, { ok: (t, rr) => Math.random() < 0.2 || cambiaSinJerarquia(t, rr) });
  return {
    instruction: "Calcula (recuerda el orden de las operaciones):",
    display: exprStr(tokens),
    options: opcionesValor(tokens, r),
    correct: String(r.valor),
    hint: "Primero las multiplicaciones y divisiones; después las sumas y restas.",
    explain: explicaPasos(tokens, r) + (resolver(tokens, "izquierda") && resolver(tokens, "izquierda").valor !== r.valor ? ` Si se opera de izquierda a derecha sin mirar el orden, sale ${resolver(tokens, "izquierda").valor}, que está mal.` : ""),
  };
}

function genMismoNivel(L) {
  const alto = Math.random() < 0.5;
  const nOps = L === LEVELS.altas ? 3 : 2;
  const res = nuevaExpr(L, {
    nOps,
    ops: alto ? ["×", "÷"] : ["+", "−"],
    ok: (t) => {
      // Que importe el orden: hecha de derecha a izquierda daría otro resultado (o imposible).
      const s = t.filter(isOp);
      if (!s.includes(alto ? "÷" : "−")) return false;
      const der = resolverDerecha(t);
      const r = resolver(t);
      return !der || der !== r.valor;
    },
  });
  const { tokens, r } = res;
  const der = resolverDerecha(tokens);
  const cands = (der !== null ? [String(der)] : []).concat([String(r.valor + 1), String(r.valor + 2), String(r.valor * 2), r.valor > 1 ? String(r.valor - 1) : "0"]);
  return {
    instruction: "Calcula (todas las operaciones son del mismo nivel):",
    display: exprStr(tokens),
    options: uniqueOptions(String(r.valor), cands),
    correct: String(r.valor),
    hint: `${alto ? "Multiplicaciones y divisiones" : "Sumas y restas"} tienen el mismo nivel: se hacen en orden, de izquierda a derecha.`,
    explain: explicaPasos(tokens, r) + (der !== null && der !== r.valor ? ` Si se empieza por la derecha sale ${der}, que está mal.` : ""),
  };
}

// De derecha a izquierda (error típico en el mismo nivel). null si no se puede.
function resolverDerecha(tokens) {
  let t = tokens.slice();
  while (t.length > 1) {
    let k = -1;
    for (let i = t.length - 1; i >= 0; i--) if (isOp(t[i])) { k = i; break; }
    const p = paso(t, k);
    if (!p) return null;
    t = p.tokens;
  }
  return t[0];
}

function genCon(L) {
  const { tokens, r } = nuevaExpr(L, { paren: true });
  const sin = resolver(tokens, "sinParentesis");
  return {
    instruction: "Calcula (los paréntesis se resuelven primero):",
    display: exprStr(tokens),
    options: opcionesValor(tokens, r),
    correct: String(r.valor),
    hint: "Resuelve primero lo que está dentro del paréntesis y después sigue con el orden normal.",
    explain: explicaPasos(tokens, r) + (sin && sin.valor !== r.valor ? ` Sin paréntesis saldría ${sin.valor}: los paréntesis cambian el resultado.` : ""),
  };
}

// ¿Dónde van los paréntesis para que dé un resultado concreto?
function colocaciones(nums, ops) {
  const n = ops.length;
  const out = [];
  for (let s = 0; s < n; s++) {
    for (let e = s + 1; e <= n; e++) {
      if (s === 0 && e === n) continue;
      const t = [];
      for (let i = 0; i <= n; i++) {
        if (i === s) t.push("(");
        t.push(nums[i]);
        if (i === e) t.push(")");
        if (i < n) t.push(ops[i]);
      }
      out.push(t);
    }
  }
  return out;
}

function genParentesis(L) {
  for (let intento = 0; intento < 500; intento++) {
    const base = nuevaExpr(L, { nOps: L === LEVELS.altas ? 3 : 2, ok: (t) => t.filter(isOp).some((o) => PREC[o] === 1) && t.filter(isOp).some((o) => PREC[o] === 2) });
    if (!base) continue;
    const nums = base.tokens.filter((x) => typeof x === "number");
    const ops = base.tokens.filter(isOp);
    const variantes = [base.tokens].concat(colocaciones(nums, ops))
      .map((t) => ({ t, r: resolver(t) }))
      .filter((x) => x.r);
    // Resultados que solo da una colocación.
    const cuenta = {};
    variantes.forEach((x) => (cuenta[x.r.valor] = (cuenta[x.r.valor] || 0) + 1));
    const unicas = variantes.filter((x) => cuenta[x.r.valor] === 1 && x.t.includes("("));
    if (!unicas.length || variantes.length < 3) continue;
    const obj = pick(unicas);
    const correct = exprStr(obj.t);
    const otras = variantes.filter((x) => x !== obj && x.r.valor !== obj.r.valor).map((x) => exprStr(x.t));
    if (otras.length < 2) continue;
    return {
      instruction: `¿Dónde van los paréntesis para que el resultado sea ${obj.r.valor}?`,
      display: exprStr(base.tokens),
      options: uniqueOptions(correct, otras),
      correct,
      hint: "Prueba cada opción: resuelve primero el paréntesis y mira cuál da el resultado pedido.",
      explain: `${cadena(obj.t, obj.r)}. En cambio: ${variantes.filter((x) => x !== obj).slice(0, 2).map((x) => `${exprStr(x.t)} = ${x.r.valor}`).join("; ")}.`,
    };
  }
  return genCon(L);
}

// --- Problemas ---
// Cada plantilla da el texto, la expresión correcta y expresiones equivocadas típicas.
const COMBI_NOMBRES = ["Lucía", "Mario", "Sara", "Hugo", "Noa", "Pablo", "Elena", "Iván"];

function problemaAzar(L) {
  const pequeño = L === LEVELS.acs || L === LEVELS.facil;
  const plantillas = [
    () => {
      const n1 = randInt(2, 4);
      const p1 = randInt(2, pequeño ? 5 : 9);
      const n2 = randInt(2, 4);
      const p2 = randInt(1, pequeño ? 2 : 3);
      const gasto = n1 * p1 + n2 * p2;
      const billete = [10, 20, 50].find((b) => b > gasto);
      if (!billete) return null;
      return {
        texto: `${pick(COMBI_NOMBRES)} compra ${n1} cuadernos a ${p1} € cada uno y ${n2} bolígrafos a ${p2} € cada uno. Paga con un billete de ${billete} €. ¿Cuánto le devuelven?`,
        bien: [billete, "−", "(", n1, "×", p1, "+", n2, "×", p2, ")"],
        mal: [[billete, "−", n1, "×", p1, "+", n2, "×", p2], [billete, "−", n1, "+", n2, "×", p1, "+", p2], ["(", billete, "−", n1, ")", "×", p1, "+", n2, "×", p2]],
        unidad: "€",
      };
    },
    () => {
      const n = randInt(2, pequeño ? 4 : 6);
      const total = n * randInt(3, pequeño ? 8 : 15);
      const a = randInt(1, total - 1);
      return {
        texto: `${pick(COMBI_NOMBRES)} tiene ${a} cromos y su hermano ${total - a}. Los juntan y los reparten a partes iguales entre ${n} amigos. ¿Cuántos cromos recibe cada uno?`,
        bien: ["(", a, "+", total - a, ")", "÷", n],
        mal: [[a, "+", total - a, "÷", n], [a, "÷", n, "+", total - a], [a, "+", total - a, "×", n]],
        unidad: "cromos",
      };
    },
    () => {
      const alumnos = randInt(pequeño ? 3 : 15, pequeño ? 9 : 28);
      const entrada = randInt(2, pequeño ? 4 : 8);
      const bus = randInt(pequeño ? 10 : 40, pequeño ? 30 : 120);
      return {
        texto: `Una clase de ${alumnos} alumnos va al museo. Cada entrada cuesta ${entrada} € y el autobús cuesta ${bus} € en total. ¿Cuánto cuesta la excursión?`,
        bien: [alumnos, "×", entrada, "+", bus],
        mal: [[alumnos, "×", "(", entrada, "+", bus, ")"], ["(", alumnos, "+", bus, ")", "×", entrada], [alumnos, "+", entrada, "+", bus]],
        unidad: "€",
      };
    },
    () => {
      const cajas = randInt(2, pequeño ? 5 : 9);
      const porCaja = randInt(pequeño ? 4 : 6, pequeño ? 10 : 24);
      const sueltas = randInt(2, porCaja - 1);
      return {
        texto: `En el almacén hay ${cajas} cajas de ${porCaja} botellas y ${sueltas} botellas sueltas. ¿Cuántas botellas hay?`,
        bien: [cajas, "×", porCaja, "+", sueltas],
        mal: [[cajas, "×", "(", porCaja, "+", sueltas, ")"], [cajas, "+", porCaja, "+", sueltas], ["(", cajas, "+", sueltas, ")", "×", porCaja]],
        unidad: "botellas",
      };
    },
    () => {
      const semanas = randInt(3, pequeño ? 6 : 12);
      const ahorro = randInt(3, pequeño ? 6 : 15);
      const gasto = randInt(2, semanas * ahorro - 1);
      return {
        texto: `${pick(COMBI_NOMBRES)} ahorra ${ahorro} € cada semana durante ${semanas} semanas. Después se gasta ${gasto} € en un libro. ¿Cuánto dinero le queda?`,
        bien: [semanas, "×", ahorro, "−", gasto],
        mal: [[semanas, "×", "(", ahorro, "−", gasto, ")"], [semanas, "+", ahorro, "−", gasto], [gasto, "−", semanas, "×", ahorro]],
        unidad: "€",
      };
    },
  ];
  const lista = L === LEVELS.acs ? [plantillas[3], plantillas[2]] : plantillas;
  for (let i = 0; i < 100; i++) {
    const p = pick(lista)();
    if (!p) continue;
    const r = resolver(p.bien);
    if (!r) continue;
    return { ...p, r };
  }
  return null;
}

function genProblemas(L) {
  const p = problemaAzar(L);
  const correctExpr = exprStr(p.bien);
  if (L !== LEVELS.acs && Math.random() < 0.5) {
    // Elegir la expresión: las equivocadas tienen que dar otro resultado.
    const malas = p.mal.filter((m) => {
      const r = resolver(m);
      return !r || r.valor !== p.r.valor;
    }).map(exprStr);
    return {
      instruction: "¿Qué operación resuelve el problema?",
      display: p.texto,
      options: uniqueOptions(correctExpr, malas),
      correct: correctExpr,
      hint: "Piensa qué se calcula primero en la historia. Si una suma o resta va antes que una multiplicación o división, necesita paréntesis.",
      explain: `${cadena(p.bien, p.r)} ${p.unidad}.${p.bien.includes("(") ? " Hace falta el paréntesis: sin él se haría antes la otra operación." : ""}`,
    };
  }
  const v = p.r.valor;
  const cands = p.mal.map((m) => resolver(m)).filter(Boolean).map((r) => String(r.valor)).concat(erroresTipicos(p.bien, p.r), [String(v + 10), String(v + 1), String(v + 2)]);
  return {
    instruction: "Lee el problema y calcula:",
    display: p.texto,
    options: uniqueOptions(String(v), cands),
    correct: String(v),
    hint: `Escribe una sola operación combinada para el problema y resuélvela en orden.`,
    explain: `${cadena(p.bien, p.r)} ${p.unidad}.`,
  };
}

const MODE_GROUPS = {
  primero: [genPrimero],
  sinparentesis: [genSin],
  mismonivel: [genMismoNivel],
  conparentesis: [genCon],
  colocar: [genParentesis],
  problemas: [genProblemas],
};

const ACS_GENERATORS = [genPrimero, genSin, genPrimero, genProblemas];

const OPCOMBINADAS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Dos operaciones: suma y multiplicación (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabajan expresiones de dos operaciones con sumas y multiplicaciones y números hasta el 6: qué se hace primero, calcularlas y problemas de cajas y entradas.",
    example: "2 + 3 × 2 → primero 3 × 2 = 6, después 2 + 6 = 8",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo nivel de operaciones, pero con una tipografía más legible para leer las expresiones numéricas.",
    example: "5 + 3 × 2 → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de pregunta y mantener mejor la atención.",
    example: "Solo preguntas de «¿Qué va primero?» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Todos los contenidos, con dos operaciones y la pista a la vista",
    text: "Se trabajan todos los modos con expresiones de dos operaciones, números hasta el 9 y la pista abierta desde el principio. Sin «Mezcla». En Explora se puede resolver paso a paso.",
    example: "(4 + 2) × 3 → Pista: primero lo que está dentro del paréntesis",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Expresiones más largas y colocar paréntesis",
    text: "Empieza en <strong>Pon los paréntesis</strong>, con expresiones de tres y cuatro operaciones y números hasta el 20.",
    example: "¿Dónde van los paréntesis para que 4 + 6 × 5 − 2 dé 48?",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "5 + 3 × 2 = ? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, OPCOMBINADAS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), OPCOMBINADAS_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("oc-pasos")) initExplore();
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

// Expresión con la operación que toca resaltada.
function exprResaltada(tokens) {
  const k = opQueToca(tokens);
  if (k < 0) return `<span class="oc-final">${tokens[0]}</span>`;
  return tokens
    .map((t, i) => {
      const s = String(t);
      if (i === k - 1) return `<mark class="oc-toca">${s}`;
      if (i === k + 1) return `${s}</mark>`;
      return s;
    })
    .reduce((acc, s, i) => acc + (i > 0 && tokens[i] !== ")" && tokens[i - 1] !== "(" ? " " : "") + s, "");
}

function initExplore() {
  // 1. Paso a paso
  const P = { tokens: null, actual: null, hechos: [] };
  function nuevaPasos() {
    const conPar = document.querySelector("#oc-pasos-tipo .active").dataset.ocTipo === "con";
    const e = nuevaExpr(LEVELS.normal, { nOps: 3, paren: conPar, ok: (t, r) => conPar || cambiaSinJerarquia(t, r) });
    P.tokens = e.tokens;
    P.actual = e.tokens;
    P.hechos = [];
  }
  document.getElementById("oc-pasos-sig").addEventListener("click", () => {
    const k = opQueToca(P.actual);
    const p = paso(P.actual, k);
    P.hechos.push({ expr: exprStr(p.tokens) });
    P.actual = p.tokens;
    renderPasosHistorial();
  });
  function renderPasosHistorial() {
    const lineas = [exprStr(P.tokens)].concat(P.hechos.map((h) => h.expr));
    lineas.pop();
    document.getElementById("oc-pasos-expr").innerHTML = lineas.map((s, i) => `<div class="oc-linea">${i === 0 ? "" : "= "}${s}</div>`).join("") + `<div class="oc-linea oc-ahora">${lineas.length ? "= " : ""}${exprResaltada(P.actual)}</div>`;
    const k = opQueToca(P.actual);
    const msg = document.getElementById("oc-pasos-msg");
    const btn = document.getElementById("oc-pasos-sig");
    if (k < 0) {
      msg.innerHTML = `<strong>Resultado: ${P.actual[0]}</strong>. ${cadena(P.tokens, resolver(P.tokens))}.`;
      btn.disabled = true;
      return;
    }
    btn.disabled = false;
    const sim = P.actual[k];
    const porque = opEnParentesis(P.actual)
      ? "está dentro del paréntesis"
      : PREC[sim] === 2
        ? "las multiplicaciones y divisiones van antes que las sumas y restas (y entre ellas, la de la izquierda)"
        : "solo quedan sumas y restas, y se hacen de izquierda a derecha";
    msg.innerHTML = `Ahora toca <strong>${P.actual[k - 1]} ${sim} ${P.actual[k + 1]}</strong> porque ${porque}.`;
  }
  function nuevaPasosH() {
    nuevaPasos();
    renderPasosHistorial();
  }
  document.getElementById("oc-pasos-otra").addEventListener("click", nuevaPasosH);
  document.querySelectorAll("#oc-pasos-tipo [data-oc-tipo]").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll("#oc-pasos-tipo [data-oc-tipo]").forEach((x) => x.classList.toggle("active", x === b));
      nuevaPasosH();
    })
  );

  // 2. Los paréntesis cambian el resultado
  const Q = { nums: [5, 3, 2], ops: ["+", "×"], sel: 0 };
  function variantesQ() {
    return [Q.nums.flatMap((x, i) => (i < Q.ops.length ? [x, Q.ops[i]] : [x]))].concat(colocaciones(Q.nums, Q.ops));
  }
  function renderPar() {
    const vs = variantesQ();
    const cont = document.getElementById("oc-par-opciones");
    cont.innerHTML = "";
    vs.forEach((t, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `btn btn-secondary${i === Q.sel ? " active" : ""}`;
      b.textContent = exprStr(t);
      b.addEventListener("click", () => {
        Q.sel = i;
        renderPar();
      });
      cont.appendChild(b);
    });
    const t = vs[Q.sel];
    const r = resolver(t);
    const resto = vs.filter((_, i) => i !== Q.sel).map((x) => {
      const rr = resolver(x);
      return `${exprStr(x)} = ${rr ? rr.valor : "no se puede (resta o división imposible)"}`;
    });
    const sinPar = resolver(vs[0]);
    const inutil = Q.sel > 0 && r && sinPar && r.valor === sinPar.valor;
    document.getElementById("oc-par-msg").innerHTML = r
      ? `<strong>${cadena(t, r)}</strong>.${inutil ? " Este paréntesis no cambia nada: esa operación ya se hacía primero." : ""}<br>Con los mismos números: ${resto.join(" · ")}.`
      : `${exprStr(t)}: con números naturales no se puede (sale una resta negativa o una división con resto).`;
  }
  document.getElementById("oc-par-otros").addEventListener("click", () => {
    // Dos niveles distintos y que todas las colocaciones se puedan calcular con naturales.
    const e = nuevaExpr(LEVELS.normal, {
      nOps: 2,
      ok: (t) => new Set(t.filter(isOp).map((o) => PREC[o])).size === 2 && colocaciones(t.filter((x) => typeof x === "number"), t.filter(isOp)).every((v) => resolver(v)),
    });
    Q.nums = e.tokens.filter((x) => typeof x === "number");
    Q.ops = e.tokens.filter(isOp);
    Q.sel = 0;
    renderPar();
  });

  // 3. Mismo nivel
  const EJ = [
    [24, "÷", 4, "×", 2],
    [20, "−", 5, "+", 3],
    [36, "÷", 6, "÷", 2],
    [15, "−", 6, "−", 4],
    [40, "÷", 5, "×", 4],
    [30, "−", 10, "+", 8],
  ];
  let ej = 0;
  function renderNivel() {
    const t = EJ[ej];
    const r = resolver(t);
    const der = resolverDerecha(t);
    document.getElementById("oc-nivel-expr").textContent = exprStr(t);
    document.getElementById("oc-nivel-msg").innerHTML =
      `<p><strong>Bien:</strong> de izquierda a derecha, ${cadena(t, r)}.</p>` +
      `<p><strong>Mal:</strong> empezando por la derecha saldría ${der === null ? "una operación imposible" : der}.</p>` +
      `<p>${PREC[t[1]] === 2 ? "Multiplicación y división tienen el mismo nivel: ninguna va antes que la otra." : "Suma y resta tienen el mismo nivel: ninguna va antes que la otra."} Se hacen en el orden en que aparecen.</p>`;
  }
  document.getElementById("oc-nivel-otro").addEventListener("click", () => {
    ej = (ej + 1) % EJ.length;
    renderNivel();
  });

  nuevaPasosH();
  renderPar();
  renderNivel();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-opcombinadas"),
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
  let mode = "primero";
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

    if (diff.is("altas")) setActiveMode("colocar");
    else if (acs) setActiveMode("primero");
    else if ((diff.is("tdah") || diff.is("discalculia")) && mode === "mezcla") setActiveMode("primero");

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
    AppProgress.record("operaciones-combinadas", isCorrect);
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
