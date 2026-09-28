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
  // Solo hay NUEVE amigos del diez distintos (1+9, 2+8 ... 9+1): el
  // 0 y el 10 no se trabajan aquí. Se barajan y se cogen los que
  // quepan, en vez de sortear números sueltos hasta que no se
  // repitan: con cantidad 10 aquel bucle no terminaba nunca, porque
  // pedía diez números distintos de una lista de nueve, y dejaba el
  // navegador colgado.
  const items = acsElegirAlAzar([1, 2, 3, 4, 5, 6, 7, 8, 9], cantidad).map((a) => ({ a }));

  return {
    tipo: "completar-a-10",
    titulo: "Amigos del 10",
    instruccion: "Coloca el número que falta para que la suma sea 10.",
    items,
  };
}

// modo "antes" | "despues" | "mezcla" (cada ítem sale al azar de una
// clase o de la otra, que es como aparecen juntos en los exámenes en
// papel: unos números piden el anterior y otros el posterior).
function generarAntesDespues(opciones) {
  const { cantidad = 6, modo = "despues", curso = "1" } = opciones || {};
  const maximo = acsPorCurso(curso, 20, 100);
  const items = [];
  for (let i = 0; i < cantidad; i++) {
    const modoItem = modo === "mezcla" ? (Math.random() < 0.5 ? "antes" : "despues") : modo;
    const rango = modoItem === "antes" ? [1, maximo] : [0, maximo - 1];
    const n = rango[0] + Math.floor(Math.random() * (rango[1] - rango[0] + 1));
    items.push({ n, modo: modoItem });
  }

  const titulos = { antes: "¿Qué viene antes?", despues: "¿Qué viene después?", mezcla: "Anterior y posterior" };
  const instrucciones = {
    antes: "Escribe o elige el número que viene antes.",
    despues: "Escribe o elige el número que viene después.",
    mezcla: "Fíjate en la flecha: escribe o elige el número que falta, antes o después.",
  };

  return {
    tipo: "antes-despues",
    titulo: titulos[modo] || titulos.despues,
    instruccion: instrucciones[modo] || instrucciones.despues,
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

  // Se enumeran todas las operaciones posibles y se barajan, en lugar
  // de sortear al azar hasta que no se repitan: si se piden más
  // parejas de las que existen, aquel bucle no terminaba nunca y
  // dejaba el navegador colgado.
  const posibles = [];
  for (let a = 1; a < maximo; a++) {
    for (let b = 1; a + b <= maximo; b++) posibles.push({ a, b, operador: "+", resultado: a + b });
  }
  for (let a = 2; a <= maximo; a++) {
    for (let b = 1; b <= a; b++) posibles.push({ a, b, operador: "−", resultado: a - b });
  }
  acsBarajar(posibles);

  const usados = new Set();
  const pares = [];
  posibles.forEach((op) => {
    if (pares.length >= cantidad) return;
    // Cada resultado, una sola vez: dos operaciones que dan el mismo
    // número dejarían el ejercicio sin solución única (dos líneas
    // llegando a la misma casilla) y no se puede corregir.
    if (usados.has(op.resultado)) return;
    usados.add(op.resultado);
    pares.push({ izquierda: `${op.a} ${op.operador} ${op.b}`, derecha: String(op.resultado) });
  });

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

// Numeración del 1 al número que se elija: la serie sale con algunos
// números ya escritos, repartidos a lo largo de toda la fila, para
// que el alumnado no pierda el hilo si falla uno. Siempre se ven el
// primero y el último, y luego uno de cada cinco (1, 5, 10, 15, 20...),
// que es como aparece en las plantillas de papel.
function generarSerieNumerica(opciones) {
  const { hasta = 20, desde = 1 } = opciones || {};
  const visibles = [desde];
  for (let n = desde; n <= hasta; n++) {
    if (n !== desde && n % 5 === 0) visibles.push(n);
  }
  if (visibles[visibles.length - 1] !== hasta) visibles.push(hasta);

  return {
    tipo: "serie-numerica",
    desde,
    hasta,
    visibles,
    titulo: `Numeración del ${desde} al ${hasta}`,
    instruccion: "Observa y completa la serie: escribe los números que faltan.",
    instruccionImpresion: "Observa la serie y escribe en cada casilla vacía el número que falta.",
  };
}

// Ordenar números sueltos de menor a mayor o al revés. Reutiliza el
// motor de "ordenar-letras" (piezas que se colocan por clic), pero sin
// pictograma: aquí las piezas son números, no una palabra.
function generarOrdenarNumeros(opciones) {
  const { cantidad = 4, curso = "1", modo = "asc" } = opciones || {};
  const maximo = acsPorCurso(curso, 20, 99);
  const cuantos = Math.max(3, Math.min(6, cantidad));

  const elegidos = [];
  while (elegidos.length < cuantos) {
    const n = 1 + Math.floor(Math.random() * maximo);
    if (elegidos.indexOf(n) === -1) elegidos.push(n);
  }
  elegidos.sort((a, b) => (modo === "desc" ? b - a : a - b));

  return {
    tipo: "ordenar-letras",
    mostrarImagen: false,
    titulo: modo === "desc" ? "Ordena de mayor a menor" : "Ordena de menor a mayor",
    instruccion:
      modo === "desc"
        ? "Coloca los números empezando por el más grande."
        : "Coloca los números empezando por el más pequeño.",
    items: [{ piezas: elegidos.map((n) => String(n)) }],
  };
}

// Decenas y unidades: se ven los objetos sueltos y hay que decir
// cuántas decenas (grupos de diez) y cuántas unidades sobran. Reutiliza
// "elegir-opcion" con opciones de texto, así que no hace falta escribir.
function acsTextoDecenas(decenas, unidades) {
  const d = decenas === 1 ? "1 decena" : decenas + " decenas";
  const u = unidades === 1 ? "1 unidad" : unidades + " unidades";
  return d + " y " + u;
}

function generarDecenas(opciones) {
  const { cantidad = 4, curso = "1" } = opciones || {};
  const maxDecenas = acsPorCurso(curso, 1, 3);
  const objetos = acsElegirAlAzar(ACS_OBJETOS_CONTABLES, cantidad);

  return {
    tipo: "elegir-opcion",
    titulo: "Decenas y unidades",
    instruccion: "Agrupa los dibujos de diez en diez. Elige cuántas decenas y cuántas unidades hay.",
    instruccionImpresion: "Rodea grupos de diez dibujos. Después marca cuántas decenas y cuántas unidades hay.",
    items: objetos.map((clave) => {
      const decenas = 1 + Math.floor(Math.random() * maxDecenas);
      const unidades = 1 + Math.floor(Math.random() * 9);
      const correcta = acsTextoDecenas(decenas, unidades);
      const alternativas = new Set([correcta]);
      // Distractores cercanos: cambiar una decena o una unidad, que es
      // justo el error típico al contar de diez en diez.
      alternativas.add(acsTextoDecenas(decenas + 1, unidades));
      if (unidades > 1) alternativas.add(acsTextoDecenas(decenas, unidades - 1));
      else alternativas.add(acsTextoDecenas(decenas, unidades + 1));

      return {
        prompt: "¿Cuántas decenas y unidades hay?",
        conteo: { clave, cantidad: decenas * 10 + unidades },
        opciones: acsBarajar(Array.from(alternativas)).map((texto) => ({ texto, correcta: texto === correcta })),
      };
    }),
  };
}

// Fracciones sencillas y muy visuales (una "tarta" partida en trozos
// iguales, con algunos coloreados): medios y cuartos, que se pueden
// enseñar de forma muy concreta doblando un papel por la mitad y otra
// vez por la mitad. Se añaden tercios en curso 2. Es contenido de
// cursos posteriores a 1º-2º en el currículo (normalmente aparece en
// el segundo ciclo), pero muy adaptable con apoyo visual: no se pide
// comparar, ordenar ni operar con fracciones, solo reconocer y
// representar las más básicas, sin escribir nada.
const ACS_FRACCIONES_POR_CURSO = {
  1: [
    [1, 2],
    [1, 4],
    [2, 4],
    [3, 4],
  ],
  2: [
    [1, 2],
    [1, 4],
    [2, 4],
    [3, 4],
    [1, 3],
    [2, 3],
  ],
};

function acsClaveFraccion(par) {
  return `fraccion:${par[0]}-${par[1]}`;
}

function acsEtiquetaFraccion(par) {
  return `${par[0]}/${par[1]}`;
}

function generarFracciones(opciones) {
  const { cantidad = 4, curso = "1" } = opciones || {};
  const pool = ACS_FRACCIONES_POR_CURSO[curso === "2" ? 2 : 1];

  const items = [];
  for (let i = 0; i < cantidad; i++) {
    const correcta = pool[Math.floor(Math.random() * pool.length)];
    const distractores = acsElegirAlAzar(
      pool.filter((p) => p[0] !== correcta[0] || p[1] !== correcta[1]),
      2
    );

    if (Math.random() < 0.5) {
      // Se ve la tarta coloreada: hay que elegir la fracción (texto).
      items.push({
        prompt: "¿Qué fracción está coloreada?",
        conteo: { clave: acsClaveFraccion(correcta), cantidad: 1 },
        opciones: acsBarajar([
          { texto: acsEtiquetaFraccion(correcta), correcta: true },
          ...distractores.map((d) => ({ texto: acsEtiquetaFraccion(d), correcta: false })),
        ]),
      });
    } else {
      // Se da la fracción en texto: hay que elegir la tarta que la representa.
      items.push({
        prompt: `¿Qué dibujo representa la fracción ${acsEtiquetaFraccion(correcta)}?`,
        opciones: acsBarajar([
          { clave: acsClaveFraccion(correcta), correcta: true },
          ...distractores.map((d) => ({ clave: acsClaveFraccion(d), correcta: false })),
        ]),
      });
    }
  }

  return {
    tipo: "elegir-opcion",
    titulo: "Fracciones sencillas",
    instruccion: "Mira cada tarta. Elige la fracción o el dibujo que corresponde.",
    items,
  };
}

// ---------- unir los puntos ----------
//
// Banco de dibujos para "une los puntos". Cada dibujo es el contorno
// cerrado de una silueta sencilla (coordenadas en un cuadro de 0 a
// 100), dado SOLO por sus esquinas: el generador reparte después
// tantos puntos extra por los lados como números haga falta colocar
// (ver acsRepartirPuntosContorno), así el mismo dibujo sirve para una
// serie del 1 al 12 o del 1 al 30 sin perder su forma. Por eso un
// dibujo solo puede salir si tiene como mucho tantas esquinas como
// números tiene la serie.
//
// "detalles" son trazos sueltos (ojos, puerta, ventanas...) que no se
// unen con puntos: en papel ya vienen dibujados y en pantalla aparecen
// al terminar, como premio, junto con el color de relleno.

function acsVerticesEstrella() {
  const vertices = [];
  for (let k = 0; k < 10; k++) {
    const angulo = ((-90 + k * 36) * Math.PI) / 180;
    const radio = k % 2 === 0 ? 42 : 17;
    vertices.push([Math.round(50 + radio * Math.cos(angulo)), Math.round(53 + radio * Math.sin(angulo))]);
  }
  return vertices;
}

const ACS_DIBUJOS_PUNTOS = [
  {
    nombre: "una estrella",
    color: "#ffd166",
    vertices: acsVerticesEstrella(),
    detalles: [],
  },
  {
    nombre: "una casa",
    color: "#f4a261",
    vertices: [[50, 14], [82, 44], [82, 88], [18, 88], [18, 44]],
    detalles: [{ d: "M42,88 V66 H58 V88" }, { d: "M26,54 H38 V66 H26 Z" }, { d: "M62,54 H74 V66 H62 Z" }],
  },
  {
    nombre: "un pez",
    color: "#4cc9f0",
    vertices: [[10, 50], [28, 32], [52, 27], [70, 40], [90, 24], [90, 76], [70, 60], [52, 73], [28, 68]],
    detalles: [{ circulo: [24, 46, 2.5], relleno: true }, { d: "M36,38 Q43,50 36,62" }],
  },
  {
    nombre: "un barco",
    color: "#e76f51",
    vertices: [[44, 10], [90, 64], [76, 86], [24, 86], [8, 64], [44, 64]],
    detalles: [{ circulo: [36, 75, 3] }, { circulo: [52, 75, 3] }],
  },
  {
    nombre: "una cometa",
    color: "#9b5de5",
    vertices: [[50, 8], [80, 40], [50, 76], [20, 40]],
    detalles: [{ d: "M50,8 L50,76 M20,40 L80,40" }, { d: "M50,76 Q64,80 70,88 T90,92" }],
  },
  {
    nombre: "un gato",
    color: "#ffb703",
    vertices: [[18, 14], [38, 32], [62, 32], [82, 14], [86, 52], [82, 86], [18, 86], [14, 52]],
    detalles: [
      { circulo: [36, 54, 4], relleno: true },
      { circulo: [64, 54, 4], relleno: true },
      { d: "M46,64 L54,64 L50,69 Z", relleno: true },
      { d: "M50,69 Q46,76 41,73 M50,69 Q54,76 59,73" },
      { d: "M40,68 L24,64 M40,72 L24,75 M60,68 L76,64 M60,72 L76,75" },
    ],
  },
  {
    nombre: "una corona",
    color: "#ffd60a",
    vertices: [[50, 18], [67, 55], [85, 30], [85, 82], [15, 82], [15, 30], [33, 55]],
    detalles: [{ circulo: [50, 70, 4] }, { circulo: [31, 70, 3] }, { circulo: [69, 70, 3] }],
  },
  {
    nombre: "un cohete",
    color: "#ef476f",
    vertices: [[50, 8], [63, 30], [63, 66], [76, 84], [58, 76], [42, 76], [24, 84], [37, 66], [37, 30]],
    detalles: [{ circulo: [50, 42, 6] }, { d: "M37,58 H63" }],
  },
  {
    nombre: "un corazón",
    color: "#f28482",
    vertices: [[50, 28], [60, 15], [74, 11], [86, 19], [90, 33], [84, 49], [68, 67], [50, 88], [32, 67], [16, 49], [10, 33], [14, 19], [26, 11], [40, 15]],
    detalles: [],
  },
  {
    nombre: "un árbol",
    color: "#2a9d8f",
    vertices: [[50, 10], [78, 50], [64, 50], [86, 76], [56, 76], [56, 92], [44, 92], [44, 76], [14, 76], [36, 50], [22, 50]],
    detalles: [{ circulo: [47, 38, 2.5], relleno: true }, { circulo: [60, 62, 2.5], relleno: true }, { circulo: [38, 64, 2.5], relleno: true }],
  },
  {
    nombre: "una seta",
    color: "#e63946",
    vertices: [[50, 12], [68, 16], [84, 30], [90, 52], [64, 52], [68, 90], [32, 90], [36, 52], [10, 52], [16, 30], [32, 16]],
    detalles: [{ circulo: [40, 28, 5] }, { circulo: [62, 30, 4] }, { circulo: [25, 42, 3] }, { circulo: [76, 42, 3] }],
  },
];

// Convierte las esquinas de un dibujo en exactamente "total" puntos
// sobre su contorno: se conservan todas las esquinas (para que la
// forma no se deforme) y los puntos que faltan se reparten por los
// lados en proporción a lo largo que es cada uno, a distancias
// iguales dentro de cada lado.
function acsRepartirPuntosContorno(vertices, total) {
  const n = vertices.length;
  const lados = vertices.map((a, i) => {
    const b = vertices[(i + 1) % n];
    return Math.hypot(b[0] - a[0], b[1] - a[1]);
  });
  const perimetro = lados.reduce((s, l) => s + l, 0);
  const extras = Math.max(0, total - n);

  // Reparto proporcional con "restos mayores": primero la parte
  // entera de cada lado y los puntos que sobran, a los lados a los
  // que más les faltaba.
  const exactos = lados.map((l) => (extras * l) / perimetro);
  const enteros = exactos.map(Math.floor);
  let sobrantes = extras - enteros.reduce((s, k) => s + k, 0);
  exactos
    .map((x, i) => ({ i, resto: x - enteros[i] }))
    .sort((a, b) => b.resto - a.resto)
    .forEach(({ i }) => {
      if (sobrantes > 0) {
        enteros[i]++;
        sobrantes--;
      }
    });

  const puntos = [];
  vertices.forEach((a, i) => {
    const b = vertices[(i + 1) % n];
    puntos.push({ x: a[0], y: a[1] });
    for (let k = 1; k <= enteros[i]; k++) {
      const t = k / (enteros[i] + 1);
      puntos.push({ x: Math.round((a[0] + (b[0] - a[0]) * t) * 10) / 10, y: Math.round((a[1] + (b[1] - a[1]) * t) * 10) / 10 });
    }
  });
  return puntos;
}

// Une los puntos contando de "paso" en "paso" hasta "hasta" (como
// mucho 30). De 1 en 1 empieza en el 1; de 2 en 2, en el 2 (2, 4,
// 6...); de 3 en 3, en el 3 (3, 6, 9...). En 1º la ficha trae además
// una tira con la serie entera a la vista, de apoyo para quien todavía
// no cuenta de 2 en 2 o de 3 en 3 de memoria.
//
// Con "guia" (trazo fácil) el contorno ya viene dibujado con una línea
// discontinua: en papel solo hay que repasarla, sin tener que buscar
// el siguiente punto y trazar a la vez. Pensado para quien tiene
// dificultades de motricidad fina.
function generarUnirPuntos(opciones) {
  const { paso = 1, hasta = 20, curso = "1", guia = false } = opciones || {};
  const limite = Math.floor(Math.min(30, hasta) / paso) * paso;
  const numeros = [];
  for (let n = paso; n <= limite; n += paso) numeros.push(n);

  const candidatos = ACS_DIBUJOS_PUNTOS.filter((d) => d.vertices.length <= numeros.length);
  const dibujo = candidatos.length
    ? candidatos[Math.floor(Math.random() * candidatos.length)]
    : ACS_DIBUJOS_PUNTOS.reduce((a, b) => (b.vertices.length < a.vertices.length ? b : a));

  const puntos = acsRepartirPuntosContorno(dibujo.vertices, numeros.length).map((p, i) => Object.assign(p, { n: numeros[i] }));

  const primero = numeros[0];
  const ultimo = numeros[numeros.length - 1];
  const serieInicio = numeros.slice(0, 3).join(", ");
  const comoContar = paso === 1 ? `en orden: ${serieInicio}...` : `de ${paso} en ${paso}: ${serieInicio}...`;

  return {
    tipo: "unir-puntos",
    paso,
    numeros,
    puntos,
    dibujo: { nombre: dibujo.nombre, color: dibujo.color, detalles: dibujo.detalles },
    ayuda: curso !== "2",
    guia,
    titulo: guia
      ? `Repasa y une los puntos del ${primero} al ${ultimo}`
      : paso === 1
        ? `Une los puntos del 1 al ${ultimo}`
        : `Une los puntos de ${paso} en ${paso}`,
    instruccion: `Toca los puntos ${comoContar} Empieza en el ${primero}. ¿Qué dibujo sale?`,
    instruccionImpresion: guia
      ? `Repasa la línea de puntitos pasando por los números en orden: ${serieInicio}... Empieza en el ${primero} (el punto rodeado). Después, colorea el dibujo.`
      : `Une los puntos ${comoContar} Empieza en el ${primero} (el punto rodeado) y, al llegar al ${ultimo}, vuelve al ${primero}. Después, colorea el dibujo.`,
  };
}

// ---------- repasar y seguir el trazo (grafomotricidad) ----------
//
// Cada fila es un trazo que va de un pictograma a otro (o una letra,
// palabra o número junto a su pictograma o sus puntos). Los trazos se
// dibujan en un cuadro de 300 x 70 y van siempre de izquierda a
// derecha, del x=12 al x=288, que es por donde se empieza a escribir.
//
// Dos modos:
//   - "repasar": línea discontinua encima de la que se pasa el lápiz.
//   - "seguir": un camino con dos bordes y sin línea; hay que ir por
//     dentro. En 1º el camino es más ancho que en 2º.

const ACS_TRAZOS = {
  recta: { nombre: "línea recta", d: "M12,35 H288" },
  ondas: { nombre: "ondas", d: "M12,35 Q35,8 58,35 T104,35 T150,35 T196,35 T242,35 T288,35" },
  picos: {
    nombre: "picos",
    d: "M12,55 L46.5,15 L81,55 L115.5,15 L150,55 L184.5,15 L219,55 L253.5,15 L288,55",
  },
  almenas: {
    nombre: "almenas",
    d: "M12,55 V15 H46.5 V55 H81 V15 H115.5 V55 H150 V15 H184.5 V55 H219 V15 H253.5 V55 H288",
  },
  arcos: {
    nombre: "arcos hacia abajo",
    d: "M12,18 Q35,78 58,18 Q81,78 104,18 Q127,78 150,18 Q173,78 196,18 Q219,78 242,18 Q265,78 288,18",
  },
  montes: {
    nombre: "arcos hacia arriba",
    d: "M12,52 Q35,-8 58,52 Q81,-8 104,52 Q127,-8 150,52 Q173,-8 196,52 Q219,-8 242,52 Q265,-8 288,52",
  },
  escalera: {
    nombre: "escalera",
    d: "M12,60 H46.5 V47 H81 V34 H115.5 V21 H150 V8 H184.5 V21 H219 V34 H253.5 V47 H288 V60",
  },
  bucles: { nombre: "bucles", d: acsTrazoBucles() },
};

// Ocho bucles seguidos, como una fila de "e" de la letra ligada.
function acsTrazoBucles() {
  let d = "M12,56";
  for (let k = 0; k < 8; k++) {
    const x = 12 + k * 34.5;
    d += ` C${x + 22},56 ${x + 32},40 ${x + 32},26 C${x + 32},8 ${x + 12},8 ${x + 12},26 C${x + 12},44 ${x + 22},56 ${x + 34.5},56`;
  }
  return d;
}

// Trazos por curso. Los bucles se cruzan consigo mismos, así que en
// "seguir el camino" no sirven: el camino se taparía a sí mismo.
const ACS_TRAZOS_POR_CURSO = {
  repasar: { 1: ["recta", "ondas", "picos", "almenas", "arcos", "montes"], 2: ["ondas", "picos", "almenas", "arcos", "montes", "escalera", "bucles"] },
  seguir: { 1: ["recta", "ondas", "picos", "almenas", "arcos", "montes"], 2: ["ondas", "picos", "almenas", "arcos", "montes", "escalera"] },
};

function generarTrazoLineas(opciones) {
  const { cantidad = 4, curso = "1", modo = "repasar" } = opciones || {};
  const claves = acsElegirAlAzar(ACS_TRAZOS_POR_CURSO[modo][curso === "2" ? 2 : 1], cantidad);
  const parejas = acsElegirAlAzar(ACS_PAREJAS_TRAZO, claves.length);

  return {
    tipo: "trazo",
    modo,
    // Ancho del camino (solo en "seguir"): más holgado en 1º.
    anchoCamino: acsPorCurso(curso, 24, 16),
    titulo: modo === "seguir" ? "Sigue el camino" : "Repasa el trazo",
    instruccion:
      modo === "seguir"
        ? "Lleva cada dibujo hasta su pareja por dentro del camino, sin salirte."
        : "Repasa la línea con el dedo, desde el punto verde hasta el final.",
    instruccionImpresion:
      modo === "seguir"
        ? "Lleva cada dibujo hasta su pareja: traza una línea por dentro del camino, sin salirte."
        : "Repasa cada línea con el lápiz, empezando por el punto gordo.",
    items: claves.map((clave, i) => ({
      forma: "camino",
      d: ACS_TRAZOS[clave].d,
      nombre: ACS_TRAZOS[clave].nombre,
      inicio: parejas[i][0],
      fin: parejas[i][1],
    })),
  };
}

function generarTrazoVocales() {
  return {
    tipo: "trazo",
    modo: "repasar",
    titulo: "Repasa las vocales",
    instruccion: "Mira el dibujo y repasa su vocal con el dedo, la grande y la pequeña.",
    instruccionImpresion: "Repasa cada vocal con el lápiz. Di en voz alta el nombre del dibujo.",
    items: ACS_VOCALES_TRAZO.map((v) => ({ forma: "texto", texto: `${v.letra.toUpperCase()} ${v.letra}`, apoyo: v.palabra })),
  };
}

function generarTrazoPalabras(opciones) {
  const { cantidad = 4, curso = "1" } = opciones || {};
  const palabras = acsElegirAlAzar(ACS_PALABRAS_TRAZO[curso === "2" ? 2 : 1], cantidad);
  return {
    tipo: "trazo",
    modo: "repasar",
    titulo: "Repasa las palabras",
    instruccion: "Lee la palabra, mira su dibujo y repásala con el dedo.",
    instruccionImpresion: "Lee cada palabra y repásala con el lápiz.",
    items: palabras.map((p) => ({ forma: "texto", texto: p, apoyo: p })),
  };
}

// Números para repasar: del 0 al 9 en 1º, cada uno con tantos puntos
// como indica (para unir la cifra con la cantidad); del 10 al 20 en
// 2º, en orden, como en el cuaderno de numeración.
function generarTrazoNumeros(opciones) {
  const { cantidad = 5, curso = "1" } = opciones || {};
  const numeros =
    curso === "2"
      ? (() => {
          const inicio = 10 + Math.floor(Math.random() * Math.max(1, 12 - cantidad));
          return Array.from({ length: cantidad }, (_, i) => Math.min(20, inicio + i));
        })()
      : acsElegirAlAzar([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], cantidad).sort((a, b) => a - b);

  return {
    tipo: "trazo",
    modo: "repasar",
    titulo: "Repasa los números",
    instruccion: "Repasa cada número con el dedo.",
    instruccionImpresion: curso === "2" ? "Repasa cada número con el lápiz." : "Repasa cada número con el lápiz y cuenta sus puntos.",
    items: numeros.map((n) => ({ forma: "texto", texto: String(n), puntos: curso === "2" ? null : n })),
  };
}
