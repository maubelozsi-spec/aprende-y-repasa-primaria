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

function generarRestaVisual(opciones) {
  const { cantidad = 4, maximo = 8 } = opciones || {};
  const objetos = acsElegirAlAzar(ACS_OBJETOS_CONTABLES, cantidad);

  return {
    tipo: "resta-visual",
    titulo: "Restas con dibujos",
    instruccion: "Cuenta los dibujos de cada caja. Resta y elige el resultado.",
    items: objetos.map((clave) => {
      const total = 3 + Math.floor(Math.random() * (maximo - 2));
      const resta = 1 + Math.floor(Math.random() * total);
      return { clave, total, resta };
    }),
  };
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
