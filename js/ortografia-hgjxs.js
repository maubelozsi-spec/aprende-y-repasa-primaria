// ============================================================
// Ortografía: la h, g/j y x/s: banco de datos + lógica del quiz
// ============================================================

// ------------------------------------------------------------
// Reglas (según la Ortografía de la RAE, adaptadas a 5º y 6º)
// ------------------------------------------------------------
// tipo: h, gj o xs. nivel: "base" (también ACS), "normal" o "altas"
// (excepciones y reglas menos frecuentes).
const REGLAS_ORTO = {
  "h-hue": { tipo: "h", nombre: "hie-, hue-, hui-, hia-", texto: "Llevan h las palabras que empiezan por hie-, hue-, hui- y hia-." },
  "h-hum": { tipo: "h", nombre: "hum- + vocal", texto: "Llevan h las palabras que empiezan por hum- seguido de vocal." },
  "h-raiz": { tipo: "h", nombre: "herm-, hist-, hosp-, horm-, horr-", texto: "Llevan h las palabras que empiezan por herm-, hist-, hosp-, horm- y horr-." },
  "h-griego": { tipo: "h", nombre: "hidr-, hiper-, hipo-, hexa-, hepta-, hecto-, hemi-", texto: "Llevan h las palabras que empiezan por hidr- (agua), hiper-, hipo-, hexa- (seis), hepta- (siete), hecto- (cien) y hemi- (medio)." },
  "h-verbos": { tipo: "h", nombre: "haber, hacer, hablar, hallar, habitar", texto: "Llevan h todas las formas de los verbos haber, hacer, hablar, hallar y habitar." },
  "h-sin": { tipo: "h", nombre: "sin h", texto: "Se escribe sin h." },
  "g-ger": { tipo: "gj", nombre: "verbos en -ger, -gir", texto: "Se escriben con g los verbos que terminan en -ger y -gir (salvo tejer y crujir)." },
  "j-elijo": { tipo: "gj", nombre: "-ger, -gir delante de a, o", texto: "En los verbos en -ger y -gir, delante de a y o se escribe j para que suene igual: elegir → elijo, elija." },
  "g-geo": { tipo: "gj", nombre: "geo-", texto: "Se escriben con g las palabras que empiezan por geo- (tierra)." },
  "g-gen": { tipo: "gj", nombre: "-gen, -gente, -gencia", texto: "Se escriben con g las palabras que terminan en -gen, -gente y -gencia." },
  "g-gia": { tipo: "gj", nombre: "-gía, -gia, -gio", texto: "Se escriben con g las palabras que terminan en -gía, -gia y -gio (salvo lejía, bujía, herejía)." },
  "j-aje": { tipo: "gj", nombre: "-aje, -eje", texto: "Se escriben con j las palabras que terminan en -aje y -eje." },
  "j-jero": { tipo: "gj", nombre: "-jero, -jera, -jería", texto: "Se escriben con j las palabras que terminan en -jero, -jera y -jería (salvo ligero)." },
  "j-dije": { tipo: "gj", nombre: "dije, traje, conduje", texto: "Se escriben con j las formas de los verbos que no tienen g ni j en el infinitivo: decir → dije, traer → traje, conducir → conduje." },
  "j-familia": { tipo: "gj", nombre: "familia con j", texto: "Se escriben con j las palabras de la familia de otra que ya lleva j: caja → cajita." },
  "excepcion-gj": { tipo: "gj", nombre: "excepción", texto: "Es una excepción a la regla." },
  "x-expl": { tipo: "xs", nombre: "ex- + pl, pr", texto: "Se escriben con x las palabras que empiezan por ex- seguido de pl o pr (salvo esplendor y espliego)." },
  "x-extra": { tipo: "xs", nombre: "extra-", texto: "Se escriben con x las palabras que empiezan por extra- (fuera de, muy)." },
  "x-ex": { tipo: "xs", nombre: "ex- «que fue»", texto: "Se escribe con x el prefijo ex- cuando significa «que fue» o «que ya no es»: exalumno, expresidente." },
  "s-fijarse": { tipo: "xs", nombre: "con s", texto: "Se escribe con s. No empieza por expl-, expr- ni extra-, y no hay una regla que lo diga: hay que fijarse en cómo se escribe (o mirarlo en el diccionario)." },
  "s-excepcion": { tipo: "xs", nombre: "excepción", texto: "Es una excepción: empieza por espl- pero se escribe con s." },
};

// Palabras: [palabra, posición del hueco, letra correcta ("" = sin h), regla, nivel, nota]
const BANCO_ORTO = [
  // h
  ["hielo", 0, "h", "h-hue", "base"], ["huevo", 0, "h", "h-hue", "base"], ["hueso", 0, "h", "h-hue", "base"], ["huerto", 0, "h", "h-hue", "base"],
  ["hierba", 0, "h", "h-hue", "normal"], ["hiena", 0, "h", "h-hue", "normal"], ["huella", 0, "h", "h-hue", "normal"], ["hueco", 0, "h", "h-hue", "normal"], ["huida", 0, "h", "h-hue", "normal"], ["hierro", 0, "h", "h-hue", "normal"],
  ["humo", 0, "h", "h-hum", "base"], ["humano", 0, "h", "h-hum", "normal"], ["húmedo", 0, "h", "h-hum", "normal"], ["humilde", 0, "h", "h-hum", "normal"], ["humor", 0, "h", "h-hum", "normal"],
  ["hermano", 0, "h", "h-raiz", "base"], ["historia", 0, "h", "h-raiz", "normal"], ["hospital", 0, "h", "h-raiz", "base"], ["hormiga", 0, "h", "h-raiz", "base"], ["horrible", 0, "h", "h-raiz", "normal"], ["hermoso", 0, "h", "h-raiz", "normal"],
  ["hidratar", 0, "h", "h-griego", "normal"], ["hipopótamo", 0, "h", "h-griego", "normal"], ["hipermercado", 0, "h", "h-griego", "normal"], ["hexágono", 0, "h", "h-griego", "normal"], ["heptágono", 0, "h", "h-griego", "altas"], ["hectolitro", 0, "h", "h-griego", "altas"], ["hemisferio", 0, "h", "h-griego", "altas"],
  ["hemos", 0, "h", "h-verbos", "base"], ["hizo", 0, "h", "h-verbos", "base"], ["hablaban", 0, "h", "h-verbos", "normal"], ["hallaron", 0, "h", "h-verbos", "normal"], ["habitamos", 0, "h", "h-verbos", "normal"], ["hubo", 0, "h", "h-verbos", "normal"],
  ["orfanato", 0, "", "h-sin", "altas", "Aunque huérfano lleva h (empieza por hue-), orfanato no empieza por hue-: va sin h."],
  ["óseo", 0, "", "h-sin", "altas", "Aunque hueso lleva h (empieza por hue-), óseo no empieza por hue-: va sin h."],
  ["oler", 0, "", "h-sin", "normal", "Oler va sin h; solo llevan h las formas que empiezan por hue-: huele, huelo."],
  ["olor", 0, "", "h-sin", "normal", "Olor va sin h, como oler. Solo llevan h las formas que empiezan por hue-: huele."],
  ["ermita", 0, "", "h-sin", "altas", "Es una excepción: empieza por erm- pero no lleva h."],
  ["armario", 0, "", "h-sin", "normal", "Armario no sigue ninguna regla de la h: va sin h."],
  // g / j
  ["recoger", 4, "g", "g-ger", "base"], ["proteger", 5, "g", "g-ger", "normal"], ["escoger", 4, "g", "g-ger", "normal"], ["coger", 2, "g", "g-ger", "base"], ["elegir", 3, "g", "g-ger", "normal"],
  ["dirigir", 4, "g", "g-ger", "normal"], ["exigir", 3, "g", "g-ger", "normal"], ["fingir", 3, "g", "g-ger", "normal"], ["corregir", 5, "g", "g-ger", "normal"], ["surgir", 3, "g", "g-ger", "normal"],
  ["elijo", 3, "j", "j-elijo", "normal", "Viene de elegir, pero delante de o se escribe j: elijo."], ["recojo", 4, "j", "j-elijo", "normal", "Viene de recoger, pero delante de o se escribe j: recojo."],
  ["protejo", 5, "j", "j-elijo", "altas", "Viene de proteger, pero delante de o se escribe j: protejo."], ["dirija", 4, "j", "j-elijo", "altas", "Viene de dirigir, pero delante de a se escribe j: dirija."],
  ["geografía", 0, "g", "g-geo", "normal"], ["geometría", 0, "g", "g-geo", "normal"], ["geólogo", 0, "g", "g-geo", "altas"],
  ["origen", 3, "g", "g-gen", "normal"], ["imagen", 3, "g", "g-gen", "normal"], ["margen", 3, "g", "g-gen", "altas"], ["urgente", 2, "g", "g-gen", "normal"], ["agente", 1, "g", "g-gen", "normal"], ["inteligencia", 6, "g", "g-gen", "altas"], ["emergencia", 4, "g", "g-gen", "altas"],
  ["magia", 2, "g", "g-gia", "normal"], ["energía", 4, "g", "g-gia", "normal"], ["biología", 5, "g", "g-gia", "normal"], ["colegio", 4, "g", "g-gia", "base"], ["refugio", 4, "g", "g-gia", "altas"], ["elogio", 3, "g", "g-gia", "altas"],
  ["viaje", 3, "j", "j-aje", "base"], ["garaje", 4, "j", "j-aje", "base"], ["paisaje", 5, "j", "j-aje", "normal"], ["coraje", 4, "j", "j-aje", "normal"], ["mensaje", 5, "j", "j-aje", "normal"], ["equipaje", 6, "j", "j-aje", "normal"], ["hereje", 4, "j", "j-aje", "altas"],
  ["consejero", 5, "j", "j-jero", "normal"], ["extranjero", 6, "j", "j-jero", "normal"], ["cerrajero", 5, "j", "j-jero", "altas"], ["pasajero", 4, "j", "j-jero", "normal"], ["relojería", 4, "j", "j-jero", "altas"],
  ["dije", 2, "j", "j-dije", "normal", "Viene de decir, que no tiene ni g ni j: se escribe dije."], ["traje", 3, "j", "j-dije", "normal", "Viene de traer, que no tiene ni g ni j: se escribe traje."],
  ["condujo", 5, "j", "j-dije", "normal", "Viene de conducir, que no tiene ni g ni j: se escribe condujo."], ["produjeron", 5, "j", "j-dije", "altas", "Viene de producir, que no tiene ni g ni j: se escribe produjeron."],
  ["cajita", 2, "j", "j-familia", "base", "Es de la familia de caja: conserva la j."], ["rojizo", 2, "j", "j-familia", "normal", "Es de la familia de rojo: conserva la j."], ["relojero", 4, "j", "j-familia", "normal", "Es de la familia de reloj: conserva la j."],
  ["tejer", 2, "j", "excepcion-gj", "altas", "Es una excepción: termina en -er como recoger, pero se escribe con j."], ["crujir", 3, "j", "excepcion-gj", "altas", "Es una excepción: termina en -ir como dirigir, pero se escribe con j."],
  ["ligero", 2, "g", "excepcion-gj", "altas", "Es una excepción: termina en -ero como pasajero, pero se escribe con g."],
  // x / s
  ["explicar", 1, "x", "x-expl", "base"], ["explorar", 1, "x", "x-expl", "normal"], ["explotar", 1, "x", "x-expl", "normal"], ["expresar", 1, "x", "x-expl", "base"], ["exprimir", 1, "x", "x-expl", "normal"], ["explosión", 1, "x", "x-expl", "normal"],
  ["extraordinario", 1, "x", "x-extra", "normal"], ["extraterrestre", 1, "x", "x-extra", "base"], ["extraescolar", 1, "x", "x-extra", "normal"],
  ["exalumno", 1, "x", "x-ex", "altas"], ["expresidente", 1, "x", "x-ex", "altas"],
  ["espejo", 1, "s", "s-fijarse", "base"], ["estrella", 1, "s", "s-fijarse", "base"], ["escalera", 1, "s", "s-fijarse", "normal"], ["espuma", 1, "s", "s-fijarse", "normal"], ["esfuerzo", 1, "s", "s-fijarse", "normal"], ["espalda", 1, "s", "s-fijarse", "normal"], ["estatua", 1, "s", "s-fijarse", "normal"],
  ["esplendor", 1, "s", "s-excepcion", "altas"], ["espléndido", 1, "s", "s-excepcion", "altas"],
].map(([palabra, pos, letra, regla, nivel, nota]) => ({ palabra, pos, letra, regla, nivel, nota, tipo: REGLAS_ORTO[regla].tipo }));

// Frases con palabras que suenan igual.
const FRASES_ORTO = [
  { tipo: "h", nivel: "base", frase: "Las ___ del mar mojan la arena.", ok: "olas", opciones: ["olas", "holas"], porque: "Ola (del mar) va sin h; hola (saludo) lleva h." },
  { tipo: "h", nivel: "base", frase: "Al entrar, Ana dijo: «¡___, chicos!».", ok: "Hola", opciones: ["Hola", "Ola"], porque: "Hola (saludo) lleva h; ola (del mar) va sin h." },
  { tipo: "h", nivel: "normal", frase: "Ya he ___ los deberes.", ok: "hecho", opciones: ["hecho", "echo"], porque: "Hecho viene de hacer: lleva h. Echo viene de echar: va sin h." },
  { tipo: "h", nivel: "normal", frase: "Yo ___ la carta al buzón.", ok: "echo", opciones: ["echo", "hecho"], porque: "Echo viene de echar (echo la carta): va sin h. Hecho viene de hacer." },
  { tipo: "h", nivel: "normal", frase: "En el parque ___ muchos árboles.", ok: "hay", opciones: ["hay", "ahí", "ay"], porque: "Hay es del verbo haber (hay árboles). Ahí indica un lugar. ¡Ay! expresa dolor o pena." },
  { tipo: "h", nivel: "normal", frase: "Deja la mochila ___, en la silla.", ok: "ahí", opciones: ["hay", "ahí", "ay"], porque: "Ahí indica un lugar (ahí, en la silla). Hay es del verbo haber. ¡Ay! expresa dolor." },
  { tipo: "h", nivel: "normal", frase: "¡___, qué daño me he hecho!", ok: "Ay", opciones: ["Hay", "Ahí", "Ay"], porque: "¡Ay! expresa dolor o pena. Hay es del verbo haber y ahí indica un lugar." },
  { tipo: "h", nivel: "altas", frase: "Ojalá ___ sol el sábado.", ok: "haya", opciones: ["haya", "halla", "aya"], porque: "Haya es del verbo haber (que haya sol). Halla es de hallar (encontrar)." },
  { tipo: "h", nivel: "altas", frase: "Mi abuelo siempre ___ setas en el bosque.", ok: "halla", opciones: ["haya", "halla", "aya"], porque: "Halla es de hallar (encontrar). Haya es del verbo haber." },
  { tipo: "xs", nivel: "normal", frase: "Para entender la frase, lee el ___.", ok: "contexto", opciones: ["contexto", "contesto"], porque: "Contexto (con x) es lo que rodea a una palabra. Contesto (con s) es del verbo contestar." },
  { tipo: "xs", nivel: "normal", frase: "Yo siempre ___ a todas las preguntas.", ok: "contesto", opciones: ["contexto", "contesto"], porque: "Contesto es del verbo contestar: con s. Contexto, con x, es lo que rodea a una palabra." },
];

const OPCIONES_HUECO = { h: ["h", "sin h"], gj: ["g", "j"], xs: ["x", "s"] };

function conHueco(e) {
  return e.letra === "" ? `_${e.palabra}` : `${e.palabra.slice(0, e.pos)}_${e.palabra.slice(e.pos + 1)}`;
}
function malEscrita(e) {
  if (e.tipo === "h") return e.letra === "h" ? e.palabra.slice(1) : `h${e.palabra}`;
  const otra = { g: "j", j: "g", x: "s", s: "x" }[e.letra];
  return `${e.palabra.slice(0, e.pos)}${otra}${e.palabra.slice(e.pos + 1)}`;
}
function explicacionOrto(e) {
  return `<strong>${e.palabra}</strong>. ${e.nota || REGLAS_ORTO[e.regla].texto}`;
}

// ------------------------------------------------------------
// Niveles y generadores
// ------------------------------------------------------------
const NIVELES_ORTO = { acs: ["base"], normal: ["base", "normal"], altas: ["base", "normal", "altas"] };

function palabrasDe(tipo, niveles) {
  return BANCO_ORTO.filter((e) => e.tipo === tipo && niveles.includes(e.nivel));
}

function genCompletar(tipo, niveles) {
  const e = pick(palabrasDe(tipo, niveles));
  const ok = e.letra === "" ? "sin h" : e.letra;
  return {
    instruction: tipo === "h" ? "¿Lleva h o no? Completa la palabra:" : `¿${tipo === "gj" ? "g o j" : "x o s"}? Completa la palabra:`,
    display: conHueco(e),
    options: OPCIONES_HUECO[tipo],
    keepOrder: true,
    correct: ok,
    hint: tipo === "h" ? "Fíjate en cómo empieza: hie-, hue-, hum-, herm-, hosp-… ¿Es de haber, hacer, hablar?" : tipo === "gj" ? "Fíjate en cómo termina: -ger/-gir, -aje, -jero, -gía… ¿Es de la familia de otra palabra?" : "¿Empieza por expl-, expr- o extra-?",
    explain: explicacionOrto(e),
  };
}

function genCual(tipo, niveles) {
  const e = pick(palabrasDe(tipo, niveles));
  const mal = malEscrita(e);
  return {
    instruction: "¿Cuál está bien escrita?",
    display: "",
    options: Math.random() < 0.5 ? [e.palabra, mal] : [mal, e.palabra],
    keepOrder: true,
    correct: e.palabra,
    hint: "Piensa en la regla: ¿cómo empieza o termina la palabra?",
    explain: explicacionOrto(e),
  };
}

function genFrase(tipo, niveles) {
  const f = pick(FRASES_ORTO.filter((x) => x.tipo === tipo && niveles.includes(x.nivel)));
  return {
    instruction: "Completa la frase con la palabra correcta:",
    display: f.frase,
    options: f.opciones,
    keepOrder: true,
    correct: f.ok,
    hint: "Suenan igual, pero significan cosas distintas. ¿Cuál tiene sentido en la frase?",
    explain: f.porque,
  };
}

// 6º y altas: ¿por qué se escribe así?
function genPorQue(tipo, niveles) {
  const e = pick(palabrasDe(tipo, niveles).filter((x) => !["h-sin", "s-fijarse", "excepcion-gj", "s-excepcion"].includes(x.regla)));
  const reglas = Object.entries(REGLAS_ORTO).filter(([id, r]) => r.tipo === tipo && !["h-sin", "s-fijarse", "excepcion-gj", "s-excepcion"].includes(id));
  const otras = shuffle(reglas.filter(([id]) => id !== e.regla)).slice(0, 2).map(([, r]) => r.nombre);
  return {
    instruction: "¿Qué regla explica cómo se escribe esta palabra?",
    display: e.palabra,
    options: shuffle([REGLAS_ORTO[e.regla].nombre, ...otras]),
    keepOrder: true,
    correct: REGLAS_ORTO[e.regla].nombre,
    hint: "Mira el principio y el final de la palabra, y piensa de qué palabra viene.",
    explain: explicacionOrto(e),
  };
}

function generadoresDe(tipo) {
  const lista = [(n) => genCompletar(tipo, n), (n) => genCompletar(tipo, n), (n) => genCual(tipo, n)];
  if (FRASES_ORTO.some((f) => f.tipo === tipo)) lista.push((n) => genFrase(tipo, n));
  return lista;
}

const MODE_GROUPS_ORTOGRAFIA_HGJXS = {
  h: generadoresDe("h"),
  gj: generadoresDe("gj"),
  xs: generadoresDe("xs"),
};

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

const ORTOHGJXS_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Solo la h, con las palabras más frecuentes (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabaja la h con palabras muy frecuentes (huevo, hielo, hospital, hizo) y las frases con hola y ola.",
    example: "¿Lleva h o no? _uevo → h",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para comparar bien las opciones parecidas.",
    example: "¿Cuál está bien escrita? → huevo → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de pregunta cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de regla ortográfica y mantener mejor la atención.",
    example: "Solo preguntas de «Palabras con h» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Mismo nivel que la clase",
    text: "La discalculia afecta al cálculo y al sentido del número, no a la lengua: aquí se practica el mismo contenido que el resto de la clase. Si además hay dificultades de lectura, usa la adaptación de dislexia.",
    example: "Mismas preguntas y mismos pasos que sin adaptación",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Excepciones y por qué se escribe así",
    text: "Se añaden las excepciones (tejer, crujir, ligero, esplendor, ermita), las palabras de una familia que cambian (hueso → óseo), haya/halla y preguntas de «¿qué regla explica esta palabra?». Empieza en <strong>g/j</strong>.",
    example: "Tejer → excepción: acaba en -er, pero va con j",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "¿Cuál está bien escrita? → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, ORTOHGJXS_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), ORTOHGJXS_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("or-reglas")) initExplore();
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
  }

  tabBtns.forEach((btn) => btn.addEventListener("click", () => activateTab(btn.dataset.tab)));

  ["go-to-practice", "go-to-practice-2"].forEach((id) => {
    const goBtn = document.getElementById(id);
    if (goBtn) goBtn.addEventListener("click", () => activateTab("practica"));
  });
}

// ============================================================
// EXPLORA: las reglas una a una
// ============================================================
// Resalta la letra trabajada (o el hueco de la h que no está).
function resaltar(e) {
  if (e.letra === "") return `<span class="or-sin">∅</span>${e.palabra}`;
  return `${e.palabra.slice(0, e.pos)}<strong class="or-letra">${e.palabra[e.pos]}</strong>${e.palabra.slice(e.pos + 1)}`;
}

function initExplore() {
  let tipo = "h";
  let regla = "h-hue";
  function render() {
    document.querySelectorAll("[data-or-tipo]").forEach((b) => b.classList.toggle("active", b.dataset.orTipo === tipo));
    const ids = Object.keys(REGLAS_ORTO).filter((id) => REGLAS_ORTO[id].tipo === tipo);
    if (!ids.includes(regla)) regla = ids[0];
    document.getElementById("or-reglas").innerHTML = ids.map((id) => `<button type="button" class="btn btn-secondary${id === regla ? " active" : ""}" data-or-regla="${id}">${REGLAS_ORTO[id].nombre}</button>`).join("");
    document.querySelectorAll("[data-or-regla]").forEach((b) => b.addEventListener("click", () => { regla = b.dataset.orRegla; render(); }));
    const palabras = BANCO_ORTO.filter((e) => e.regla === regla);
    document.getElementById("or-palabras").innerHTML = palabras.map((e) => `<span class="or-chip">${resaltar(e)}</span>`).join("");
    const notas = palabras.filter((e) => e.nota).slice(0, 2).map((e) => e.nota);
    document.getElementById("or-msg").innerHTML = `${REGLAS_ORTO[regla].texto}${notas.length ? `<br>${notas.join("<br>")}` : ""}`;
  }
  document.querySelectorAll("[data-or-tipo]").forEach((b) => b.addEventListener("click", () => { tipo = b.dataset.orTipo; render(); }));
  render();
}

function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-ortohgjxs"),
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
  let mode = "h";
  let current;
  let lastKey = "";

  function niveles() {
    if (diff.is("acs")) return NIVELES_ORTO.acs;
    if (diff.is("altas")) return NIVELES_ORTO.altas;
    return NIVELES_ORTO.normal;
  }

  function setActiveMode(m) {
    mode = m;
    els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === m));
  }

  function applyDifficultyUI() {
    const acs = diff.is("acs");
    els.modeBtns.forEach((b) => {
      b.disabled = acs || (b.dataset.mode === "mezcla" && diff.is("tdah"));
    });
    if (acs) setActiveMode("h");
    else if (diff.is("altas")) setActiveMode("gj");
    else if (diff.is("tdah") && mode === "mezcla") setActiveMode("h");
    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function generadores() {
    const tipo = mode === "mezcla" ? pick(["h", "gj", "xs"]) : mode;
    if (diff.is("acs")) return [(n) => genCompletar("h", n), (n) => genCual("h", n), (n) => genFrase("h", n)];
    const lista = MODE_GROUPS_ORTOGRAFIA_HGJXS[tipo].slice();
    if (diff.is("altas")) lista.push((n) => genPorQue(tipo, n));
    return lista;
  }

  function pickQuestion() {
    let q;
    let tries = 0;
    do {
      q = pick(generadores())(niveles());
      tries++;
    } while (q.display + q.options.join() === lastKey && tries < 10);
    lastKey = q.display + q.options.join();
    return q;
  }

  function startRound() {
    current = pickQuestion();
    els.instructions.textContent = current.instruction;
    els.wordDisplay.textContent = current.display;
    els.wordDisplay.style.display = current.display ? "" : "none";

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";
    els.hintBox.classList.remove("show");
    els.hintBox.innerHTML = "";
    els.hintBtn.disabled = false;

    els.answerButtons.innerHTML = "";
    (current.keepOrder ? current.options : shuffle(current.options)).forEach((opt) => {
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
    AppProgress.record("ortografia-hgjxs", isCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.answerButtons.querySelectorAll(".syllable-chip").forEach((b) => {
      b.disabled = true;
      if (b.textContent === correct) b.classList.add("correct");
      else if (b === btn && !isCorrect) b.classList.add("incorrect");
    });
    els.hintBtn.disabled = true;

    els.feedback.classList.add("show", isCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `<p class="feedback-title">${isCorrect ? "Correcto" : `No era esa: es «${correct}»`}</p><p>${current.explain}</p>`;
    els.nextBtn.style.display = "";
  }

  els.modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveMode(btn.dataset.mode);
      startRound();
    });
  });

  els.hintBtn.addEventListener("click", () => {
    els.hintBox.innerHTML = `<strong>Pista:</strong> ${current.hint}`;
    els.hintBox.classList.add("show");
  });
  els.nextBtn.addEventListener("click", startRound);

  applyDifficultyUI();
  startRound();
}

// ---------------- Ficha ----------------
// Preguntas en papel: completar con la letra y frases con homófonos.
const quitarEtiquetas = (t) => t.replace(/<[^>]+>/g, "");
function fichaCompletar(niveles) {
  return BANCO_ORTO.filter((e) => niveles.includes(e.nivel)).map((e) => ({
    tipo: e.tipo,
    pregunta: `${e.tipo === "h" ? "Completa con h si hace falta" : e.tipo === "gj" ? "Completa con g o j" : "Completa con x o s"}: ${conHueco(e)}.`,
    respuesta: quitarEtiquetas(explicacionOrto(e)),
    opciones: e.tipo === "h" ? [e.palabra, malEscrita(e)].sort() : OPCIONES_HUECO[e.tipo],
  }));
}
function fichaFrases(niveles) {
  return FRASES_ORTO.filter((f) => niveles.includes(f.nivel)).map((f) => ({
    tipo: f.tipo,
    pregunta: `Completa con ${f.opciones.join(", ").replace(/, ([^,]*)$/, " o $1")}: ${f.frase}`,
    respuesta: `${f.ok}. ${f.porque}`,
    opciones: f.opciones,
  }));
}
const fichaPool = (tipos, niveles) => [...fichaCompletar(niveles), ...fichaFrases(niveles)].filter((x) => tipos.includes(x.tipo));
const fichaModo = (pool) => ({ pool, field: "respuesta", question: (e) => e.pregunta, selfContained: true, answerFn: (e) => e.respuesta, optionsFn: (e) => e.opciones });

registerLenguaFicha("ortografia-hgjxs", {
  label: "Ortografía de la h, g/j y x/s",
  resumen: "La h: llevan h las palabras que empiezan por hie-, hue-, hum- + vocal, herm-, hosp-, horm-, y las formas de haber y hacer. La g: verbos en -ger y -gir (salvo tejer y crujir) y palabras en geo-, -gen, -gía, -gio. La j: palabras en -aje, -eje, -jero y las formas dije, traje, conduje. La x: ex- delante de pl o pr y extra-.",
  easyMode: "hbase",
  altasMode: "altas",
  defaultMode: ["h", "gj", "xs"],
  pools: {
    hbase: fichaModo(fichaPool(["h"], NIVELES_ORTO.acs)),
    h: fichaModo(fichaPool(["h"], NIVELES_ORTO.normal)),
    gj: fichaModo(fichaPool(["gj"], NIVELES_ORTO.normal)),
    xs: fichaModo(fichaPool(["xs"], NIVELES_ORTO.normal)),
    altas: fichaModo(fichaPool(["h", "gj", "xs"], ["altas"])),
  },
});
