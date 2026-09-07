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
  const { cantidad = 4, maximo = 10 } = opciones || {};
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
  const { cantidad = 6, maximo = 10 } = opciones || {};
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
  const { cantidad = 4, maximo = 8 } = opciones || {};
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
  const { cantidad = 5 } = opciones || {};
  const palabras = acsElegirAlAzar(ACS_PALABRAS_ORDENAR_LETRAS, cantidad);

  return {
    tipo: "ordenar-letras",
    titulo: "Ordena las letras",
    instruccion: "Ordena las letras y forma la palabra.",
    items: palabras.map((palabra) => ({ palabra })),
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
  const { cantidad = 6, modo = "despues", maximo = 20 } = opciones || {};
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
  const { cantidad = 4 } = opciones || {};
  const objetos = acsElegirAlAzar(ACS_OBJETOS_CONTABLES, cantidad);

  return {
    tipo: "grupos-iguales",
    titulo: "Grupos iguales",
    instruccion: "Cuenta los grupos. ¿Cuántos hay en total?",
    items: objetos.map((clave) => {
      const grupos = 2 + Math.floor(Math.random() * 2);
      const porGrupo = 2 + Math.floor(Math.random() * (Math.floor(10 / grupos) - 1));
      return { clave, grupos, porGrupo };
    }),
  };
}

function generarReparto(opciones) {
  const { cantidad = 4 } = opciones || {};
  const objetos = acsElegirAlAzar(ACS_OBJETOS_CONTABLES, cantidad);

  return {
    tipo: "reparto",
    titulo: "Reparto en partes iguales",
    instruccion: "Reparte los dibujos en partes iguales. ¿Cuántos hay en cada una?",
    items: objetos.map((clave) => {
      const grupos = 2 + Math.floor(Math.random() * 2);
      const porGrupo = 1 + Math.floor(Math.random() * Math.floor(10 / grupos));
      return { clave, total: grupos * porGrupo, grupos };
    }),
  };
}

function generarClasificar(opciones) {
  const { modo = "categoria", cantidad = 6 } = opciones || {};

  if (modo === "inicial") {
    const vocales = acsElegirAlAzar(Object.keys(ACS_PALABRAS_POR_INICIAL), 2);
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
      categorias: vocales.map((v) => ({ id: v, etiqueta: v.toUpperCase() })),
      items: acsBarajar(items),
    };
  }

  const categoriasDisponibles = acsElegirAlAzar(Object.keys(ACS_CATEGORIAS_PALABRAS), 2);
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

function generarEncontrarDiferente(opciones) {
  const { cantidad = 4 } = opciones || {};
  const categoriasDisponibles = Object.keys(ACS_CATEGORIAS_PALABRAS);

  const items = [];
  for (let i = 0; i < cantidad; i++) {
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
