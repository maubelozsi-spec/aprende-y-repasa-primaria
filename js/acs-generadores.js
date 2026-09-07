// ============================================================
// Generadores de fichas de Apoyo ACS: a partir del banco de
// vocabulario (js/acs-vocabulario.js) devuelven un objeto de ficha
// nuevo cada vez que se llaman (palabras/números al azar, sin
// repetir dentro de la misma ficha), listo para pasar a
// initAcsFicha() (js/acs-ficha-engine.js).
//
// Cada función acepta un objeto de opciones con valores por defecto
// razonables, para poder llamarlas tanto desde una ficha individual
// como desde el Generador de cuaderno (acs/generador.html) sin tener
// que repetir esos valores en cada sitio.
// ============================================================

// Elige un valor u otro según el curso ("1" o "2"), para escalar la
// dificultad de un generador sin duplicar su lógica. Por defecto (sin
// curso o curso desconocido) se usa el valor de 1º.
function acsPorCurso(curso, valor1, valor2) {
  return curso === "2" ? valor2 : valor1;
}

function generarUnirPalabraDibujo(opciones) {
  const { categoria = "todas", cantidad = 6 } = opciones || {};
  const pool = categoria === "todas" ? Object.values(ACS_CATEGORIAS_PALABRAS).flat() : ACS_CATEGORIAS_PALABRAS[categoria] || [];
  const palabras = acsElegirAlAzar(pool, cantidad);

  return {
    tipo: "unir-parejas",
    modoDerecha: "imagen",
    titulo: "Une la palabra con su dibujo",
    instruccion: "Lee cada palabra. Únela con el dibujo que le corresponde.",
    pares: palabras.map((p) => ({ izquierda: p, derecha: p })),
  };
}

function generarUnirSilabas(opciones) {
  const { cantidad = 6 } = opciones || {};
  const palabras = acsElegirAlAzar(ACS_PALABRAS_SILABAS, cantidad);

  return {
    tipo: "unir-parejas",
    modoDerecha: "texto",
    titulo: "Une las sílabas",
    instruccion: "Une la primera sílaba con la segunda para formar la palabra.",
    pares: palabras.map((p) => ({ izquierda: p.silabas[0], derecha: p.silabas[1] })),
  };
}

function generarLeeYElige(opciones) {
  const { cantidad = 4 } = opciones || {};
  const frases = acsElegirAlAzar(ACS_FRASES_LEE_Y_ELIGE, cantidad);

  return {
    tipo: "elegir-opcion",
    titulo: "Lee y elige el dibujo",
    instruccion: "Lee la frase. Elige el dibujo correcto.",
    items: frases.map((f) => ({
      prompt: f.prompt,
      opciones: acsBarajar([
        { clave: f.correcta, correcta: true },
        { clave: f.incorrecta, correcta: false },
      ]),
    })),
  };
}

function generarCuentaYElige(opciones) {
  const { cantidad = 4, curso = "1" } = opciones || {};
  const maximo = acsPorCurso(curso, 10, 15);
  const objetos = acsElegirAlAzar(ACS_OBJETOS_CONTABLES, cantidad);

  return {
    tipo: "elegir-opcion",
    titulo: "Cuenta y elige el número",
    instruccion: "Cuenta los dibujos. Elige el número correcto.",
    items: objetos.map((clave) => {
      const total = 2 + Math.floor(Math.random() * (maximo - 1));
      return {
        prompt: "¿Cuántos hay?",
        conteo: { clave, cantidad: total },
        opciones: acsOpcionesNumericasCercanas(total).map((valor) => ({ texto: String(valor), correcta: valor === total })),
      };
    }),
  };
}

function generarMayorMenorIgual(opciones) {
  const { cantidad = 6, curso = "1" } = opciones || {};
  const maximo = acsPorCurso(curso, 10, 30);
  const pares = [];
  for (let i = 0; i < cantidad; i++) {
    const a = Math.floor(Math.random() * (maximo + 1));
    const b = Math.floor(Math.random() * (maximo + 1));
    pares.push([a, b]);
  }

  return {
    tipo: "mayor-menor-igual",
    titulo: "Mayor, menor o igual",
    instruccion: "Compara los dos números. Elige el símbolo correcto.",
    pares,
  };
}

function generarOperacionVisual(operador, opciones) {
  const { cantidad = 4, curso = "1" } = opciones || {};
  const maximo = acsPorCurso(curso, 8, 10);
  const objetos = acsElegirAlAzar(ACS_OBJETOS_CONTABLES, cantidad);
  const esSuma = operador === "+";

  return {
    tipo: "operacion-visual",
    titulo: esSuma ? "Sumas con dibujos" : "Restas con dibujos",
    instruccion: esSuma
      ? "Cuenta los dibujos de cada caja. Suma y elige el resultado."
      : "Cuenta los dibujos de cada caja. Resta y elige el resultado.",
    items: objetos.map((clave) => {
      if (esSuma) {
        const a = 1 + Math.floor(Math.random() * (maximo - 1));
        const b = 1 + Math.floor(Math.random() * (maximo - a));
        return { clave, a, b, operador };
      }
      const a = 3 + Math.floor(Math.random() * (maximo - 2));
      const b = 1 + Math.floor(Math.random() * a);
      return { clave, a, b, operador };
    }),
  };
}

function generarSumaVisual(opciones) {
  return generarOperacionVisual("+", opciones);
}

function generarRestaVisual(opciones) {
  return generarOperacionVisual("−", opciones);
}

function generarOrdenarLetras(opciones) {
  const { cantidad = 5, curso = "1" } = opciones || {};
  const banco = acsPorCurso(curso, ACS_PALABRAS_ORDENAR_LETRAS, ACS_PALABRAS_ORDENAR_LETRAS_2);
  const palabras = acsElegirAlAzar(banco, cantidad);

  return {
    tipo: "ordenar-letras",
    titulo: "Ordena las letras",
    instruccion: "Ordena las letras y forma la palabra.",
    items: palabras.map((palabra) => ({ piezas: palabra.split("") })),
  };
}

// Mismo tipo de actividad que "ordenar letras" pero con las piezas ya
// agrupadas en sílabas en vez de en letras sueltas: un peldaño más
// fácil de manipular (menos piezas) y centrado en conciencia silábica
// en vez de ortografía letra a letra.
function generarOrdenarSilabas(opciones) {
  const { cantidad = 5 } = opciones || {};
  const palabras = acsElegirAlAzar(ACS_PALABRAS_SILABAS, cantidad);

  return {
    tipo: "ordenar-letras",
    titulo: "Ordena las sílabas",
    instruccion: "Ordena las sílabas y forma la palabra.",
    items: palabras.map((p) => ({ piezas: p.silabas.slice() })),
  };
}

function generarCompletarA10(opciones) {
  const { cantidad = 6 } = opciones || {};
  const usados = new Set();
  const items = [];
  while (items.length < cantidad && usados.size < 10) {
    const a = 1 + Math.floor(Math.random() * 9);
    if (usados.has(a)) continue;
    usados.add(a);
    items.push({ a });
  }

  return {
    tipo: "completar-a-10",
    titulo: "Amigos del 10",
    instruccion: "Coloca el número que falta para que la suma sea 10.",
    items,
  };
}

function generarAntesDespues(opciones) {
  const { cantidad = 6, modo = "despues", curso = "1" } = opciones || {};
  const maximo = acsPorCurso(curso, 20, 100);
  const items = [];
  for (let i = 0; i < cantidad; i++) {
    const rango = modo === "antes" ? [1, maximo] : [0, maximo - 1];
    const n = rango[0] + Math.floor(Math.random() * (rango[1] - rango[0] + 1));
    items.push({ n, modo });
  }

  return {
    tipo: "antes-despues",
    titulo: modo === "antes" ? "¿Qué viene antes?" : "¿Qué viene después?",
    instruccion: modo === "antes" ? "Escribe o elige el número que viene antes." : "Escribe o elige el número que viene después.",
    items,
  };
}

function generarGruposIguales(opciones) {
  const { cantidad = 4, curso = "1" } = opciones || {};
  const objetos = acsElegirAlAzar(ACS_OBJETOS_CONTABLES, cantidad);
  const totalMaximo = acsPorCurso(curso, 10, 20);

  return {
    tipo: "grupos-iguales",
    titulo: "Grupos iguales",
    instruccion: "Cuenta los grupos. ¿Cuántos hay en total?",
    items: objetos.map((clave) => {
      const grupos = 2 + Math.floor(Math.random() * 3);
      const porGrupo = 2 + Math.floor(Math.random() * (Math.floor(totalMaximo / grupos) - 1));
      return { clave, grupos, porGrupo };
    }),
  };
}

function generarReparto(opciones) {
  const { cantidad = 4, curso = "1" } = opciones || {};
  const objetos = acsElegirAlAzar(ACS_OBJETOS_CONTABLES, cantidad);
  const totalMaximo = acsPorCurso(curso, 10, 20);

  return {
    tipo: "reparto",
    titulo: "Reparto en partes iguales",
    instruccion: "Reparte los dibujos en partes iguales. ¿Cuántos hay en cada una?",
    items: objetos.map((clave) => {
      const grupos = 2 + Math.floor(Math.random() * 3);
      const porGrupo = 1 + Math.floor(Math.random() * Math.floor(totalMaximo / grupos));
      return { clave, total: grupos * porGrupo, grupos };
    }),
  };
}

function generarClasificar(opciones) {
  const { modo = "categoria", cantidad = 6, curso = "1" } = opciones || {};
  const numGrupos = acsPorCurso(curso, 2, 3);

  if (modo === "inicial") {
    const vocales = acsElegirAlAzar(Object.keys(ACS_PALABRAS_POR_INICIAL), numGrupos);
    const items = [];
    vocales.forEach((vocal) => {
      acsElegirAlAzar(ACS_PALABRAS_POR_INICIAL[vocal], Math.ceil(cantidad / vocales.length)).forEach((clave) => {
        items.push({ clave, categoria: vocal });
      });
    });
    return {
      tipo: "clasificar",
      titulo: "Clasifica por sonido inicial",
      instruccion: "Clica cada dibujo y luego la letra por la que empieza su nombre.",
      instruccionImpresion: "Mira cada dibujo y escribe su letra en la casilla de la vocal por la que empieza.",
      categorias: vocales.map((v) => ({ id: v, etiqueta: v.toUpperCase() })),
      items: acsBarajar(items),
    };
  }

  const categoriasDisponibles = acsElegirAlAzar(Object.keys(ACS_CATEGORIAS_PALABRAS), numGrupos);
  const items = [];
  categoriasDisponibles.forEach((catId) => {
    acsElegirAlAzar(ACS_CATEGORIAS_PALABRAS[catId], Math.ceil(cantidad / categoriasDisponibles.length)).forEach((clave) => {
      items.push({ clave, categoria: catId });
    });
  });

  return {
    tipo: "clasificar",
    titulo: "Clasifica en su grupo",
    instruccion: "Clica cada dibujo y luego el grupo al que pertenece.",
    instruccionImpresion: "Mira cada dibujo y escribe su letra en la casilla del grupo al que pertenece.",
    categorias: categoriasDisponibles.map((id) => ({ id, etiqueta: ACS_CATEGORIA_ETIQUETAS[id] })),
    items: acsBarajar(items),
  };
}

function generarOrdenarSecuencia() {
  const secuencia = ACS_SECUENCIAS[Math.floor(Math.random() * ACS_SECUENCIAS.length)];

  return {
    tipo: "ordenar-secuencia",
    titulo: "Ordena la secuencia",
    instruccion: "Ordena los dibujos según lo que pasa primero, después y al final.",
    pasos: secuencia.map((clave) => ({ clave })),
  };
}

// Formas que se pueden dibujar "rotas" (con un lado o un trozo del
// trazo que falta) para la variante más difícil de "encuentra el
// diferente": ver ACS_SVG_FORMAS_ROTAS en js/acs-ficha-engine.js.
const ACS_FORMAS_ENCONTRAR_INCOMPLETO = ["circulo", "cuadrado", "triangulo", "rectangulo", "pentagono", "hexagono"];

function generarEncontrarDiferente(opciones) {
  const { cantidad = 4 } = opciones || {};
  const categoriasDisponibles = Object.keys(ACS_CATEGORIAS_PALABRAS);

  const items = [];
  for (let i = 0; i < cantidad; i++) {
    // En vez de "3 de una categoría + 1 de otra" siempre, parte de
    // los items son más difíciles: 3 veces la MISMA forma y una
    // cuarta idéntica pero con un trozo borrado, así que no basta con
    // reconocer una categoría distinta, hay que fijarse en el detalle.
    if (Math.random() < 0.35) {
      const forma = ACS_FORMAS_ENCONTRAR_INCOMPLETO[Math.floor(Math.random() * ACS_FORMAS_ENCONTRAR_INCOMPLETO.length)];
      const elecciones = acsBarajar([
        { clave: `svg:${forma}`, correcta: false },
        { clave: `svg:${forma}`, correcta: false },
        { clave: `svg:${forma}`, correcta: false },
        { clave: `svgroto:${forma}`, correcta: true },
      ]);
      items.push({ prompt: "¿Cuál está incompleta?", opciones: elecciones });
      continue;
    }

    const [catIgual, catDistinta] = acsElegirAlAzar(categoriasDisponibles, 2);
    const [claveIgual] = acsElegirAlAzar(ACS_CATEGORIAS_PALABRAS[catIgual], 1);
    const [claveDistinta] = acsElegirAlAzar(ACS_CATEGORIAS_PALABRAS[catDistinta], 1);
    const elecciones = acsBarajar([
      { clave: claveIgual, correcta: false },
      { clave: claveIgual, correcta: false },
      { clave: claveIgual, correcta: false },
      { clave: claveDistinta, correcta: true },
    ]);
    items.push({ prompt: "¿Cuál es diferente?", opciones: elecciones });
  }

  return {
    tipo: "elegir-opcion",
    titulo: "Encuentra el diferente",
    instruccion: "Mira los dibujos. Elige el que no es igual que los demás.",
    items,
  };
}

// Reutiliza "unir-parejas" (modoDerecha texto) para un puzle de unir
// cada operación con su resultado: mismo clic-clic que unir palabra
// con dibujo, pero con contenido de cálculo en vez de vocabulario.
function generarOperacionesUnir(opciones) {
  const { cantidad = 6, curso = "1" } = opciones || {};
  const maximo = acsPorCurso(curso, 10, 20);
  const usadas = new Set();
  const pares = [];
  while (pares.length < cantidad) {
    const operador = Math.random() < 0.5 ? "+" : "−";
    let a, b, resultado;
    if (operador === "+") {
      a = 1 + Math.floor(Math.random() * (maximo - 1));
      b = 1 + Math.floor(Math.random() * (maximo - a));
      resultado = a + b;
    } else {
      a = 2 + Math.floor(Math.random() * (maximo - 1));
      b = 1 + Math.floor(Math.random() * a);
      resultado = a - b;
    }
    const clave = a + operador + b;
    if (usadas.has(clave)) continue;
    usadas.add(clave);
    pares.push({ izquierda: `${a} ${operador} ${b}`, derecha: String(resultado) });
  }

  return {
    tipo: "unir-parejas",
    modoDerecha: "texto",
    titulo: "Une la operación con su resultado",
    instruccion: "Calcula cada operación. Únela con su resultado.",
    pares,
  };
}

// Reutiliza "elegir-opcion": la pista es el pictograma de la palabra
// (conteo con cantidad 1, para mostrar un solo dibujo grande) y las
// opciones son números de sílabas, sin necesidad de escribir nada.
function generarCuentaSilabas(opciones) {
  const { cantidad = 5 } = opciones || {};
  const palabras = acsElegirAlAzar(ACS_PALABRAS_CONTEO_SILABAS, cantidad);

  return {
    tipo: "elegir-opcion",
    titulo: "Cuenta las sílabas",
    instruccion: "Mira el dibujo, di la palabra en voz alta y cuenta sus sílabas. Elige el número correcto.",
    items: palabras.map((p) => {
      const opcionesNumericas = new Set([p.silabas]);
      while (opcionesNumericas.size < 3) {
        opcionesNumericas.add(1 + Math.floor(Math.random() * 4));
      }
      return {
        prompt: "¿Cuántas sílabas tiene?",
        conteo: { clave: p.palabra, cantidad: 1 },
        opciones: acsBarajar(Array.from(opcionesNumericas)).map((valor) => ({ texto: String(valor), correcta: valor === p.silabas })),
      };
    }),
  };
}

// Etiquetas de las claves "svg:" que sirven de categoría en
// "clasificar-lineas" y "clasificar-formas" (ver ACS_SVG_FORMAS en
// js/acs-ficha-engine.js: la clave y el id de categoría coinciden).
const ACS_LINEAS_ETIQUETAS = { recta: "Recta", curva: "Curva", quebrada: "Quebrada" };
const ACS_FORMAS_ETIQUETAS = { circulo: "Círculo", cuadrado: "Cuadrado", triangulo: "Triángulo", rectangulo: "Rectángulo" };

// Reutiliza "clasificar" con iconos SVG propios en vez de pictogramas:
// discriminación visual de líneas rectas/curvas/quebradas.
function generarClasificarLineas(opciones) {
  const { cantidad = 6, curso = "1" } = opciones || {};
  const tipos = acsPorCurso(curso, ["recta", "curva"], ["recta", "curva", "quebrada"]);
  const items = [];
  for (let i = 0; i < cantidad; i++) {
    const tipo = tipos[i % tipos.length];
    items.push({ clave: `svg:${tipo}`, categoria: tipo });
  }

  return {
    tipo: "clasificar",
    titulo: "Clasifica las líneas",
    instruccion: "Clica cada línea y luego el grupo al que pertenece.",
    instruccionImpresion: "Mira cada línea y escribe su letra en la casilla del grupo al que pertenece.",
    categorias: tipos.map((id) => ({ id, etiqueta: ACS_LINEAS_ETIQUETAS[id] })),
    items: acsBarajar(items),
  };
}

// Igual que generarClasificarLineas pero con formas geométricas
// básicas, para reconocimiento de figuras (contenido de geometría de
// 1º-2º: círculo, cuadrado, triángulo y, en 2º, rectángulo).
function generarClasificarFormas(opciones) {
  const { cantidad = 6, curso = "1" } = opciones || {};
  const disponibles = acsPorCurso(curso, ["circulo", "cuadrado", "triangulo"], ["circulo", "cuadrado", "triangulo", "rectangulo"]);
  const tipos = acsElegirAlAzar(disponibles, acsPorCurso(curso, 2, 3));
  const items = [];
  for (let i = 0; i < cantidad; i++) {
    const tipo = tipos[i % tipos.length];
    items.push({ clave: `svg:${tipo}`, categoria: tipo });
  }

  return {
    tipo: "clasificar",
    titulo: "Clasifica las formas",
    instruccion: "Clica cada forma y luego el grupo al que pertenece.",
    instruccionImpresion: "Mira cada forma y escribe su letra en la casilla del grupo al que pertenece.",
    categorias: tipos.map((id) => ({ id, etiqueta: ACS_FORMAS_ETIQUETAS[id] })),
    items: acsBarajar(items),
  };
}

// tipo "operacion-numerica": los mismos números que una cuenta en
// columna, pero se elige el resultado entre varias opciones en vez de
// escribir cifra a cifra. Pensado sobre todo para 2º (números de dos
// cifras); en 1º se queda en números más bajos, sin dejar de ser una
// versión más numérica (menos dibujos) de las sumas/restas.
function generarSumaRestaNumerica(opciones) {
  const { cantidad = 5, curso = "1" } = opciones || {};
  const maximo = acsPorCurso(curso, 30, 99);
  const items = [];
  for (let i = 0; i < cantidad; i++) {
    const operador = Math.random() < 0.5 ? "+" : "−";
    const a = 10 + Math.floor(Math.random() * (maximo - 10));
    const b = operador === "+" ? 1 + Math.floor(Math.random() * (maximo - a)) : 1 + Math.floor(Math.random() * a);
    items.push({ a, b, operador });
  }

  return {
    tipo: "operacion-numerica",
    titulo: "Sumas y restas",
    instruccion: "Calcula el resultado y elige la opción correcta.",
    items,
  };
}
