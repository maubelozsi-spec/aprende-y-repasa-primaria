// ============================================================
// Registro de fichas de Apoyo ACS: fuente única para el catálogo
// (acs/index.html), el visor individual (acs/ficha.html) y el
// Generador de cuaderno (acs/generador.html).
//
// Cada entrada NO guarda contenido fijo: guarda qué generador llamar
// (ver js/acs-generadores.js) y con qué opciones. Cada vez que se
// abre la ficha —o se pulsa "Generar otra ficha"— sale un conjunto
// distinto de palabras/números, tirando del banco de vocabulario
// (js/acs-vocabulario.js). El título de cada entrada se repite aquí
// a propósito (en vez de generar una ficha solo para leerlo) porque
// no cambia entre variantes, solo el contenido.
// ============================================================

const ACS_FICHAS_REGISTRO = {
  "lengua-une-palabra-dibujo": {
    area: "lengua",
    tipo: "unir-parejas",
    etiqueta: "Unir con línea",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Une la palabra con su dibujo",
    resumen: "Vocabulario básico: 6 palabras para unir con su imagen. Cambia cada vez.",
    cantidadDefecto: 6,
    generar: () => generarUnirPalabraDibujo({ categoria: "todas", cantidad: 6 }),
    generarConCantidad: (cantidad) => generarUnirPalabraDibujo({ categoria: "todas", cantidad }),
  },
  "lengua-une-silabas": {
    area: "lengua",
    tipo: "unir-parejas",
    etiqueta: "Unir con línea",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Une las sílabas",
    resumen: "6 palabras de dos sílabas para formar uniendo la primera con la segunda.",
    cantidadDefecto: 6,
    generar: () => generarUnirSilabas({ cantidad: 6 }),
    generarConCantidad: (cantidad) => generarUnirSilabas({ cantidad }),
  },
  "lengua-lee-y-elige": {
    area: "lengua",
    tipo: "elegir-opcion",
    etiqueta: "Leer y elegir",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Lee y elige el dibujo",
    resumen: "4 frases cortas con dos dibujos para elegir en cada una.",
    cantidadDefecto: 4,
    generar: () => generarLeeYElige({ cantidad: 4 }),
    generarConCantidad: (cantidad) => generarLeeYElige({ cantidad }),
  },
  "lengua-ordenar-letras": {
    area: "lengua",
    tipo: "ordenar-letras",
    etiqueta: "Ordenar letras",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Ordena las letras",
    resumen: "5 palabras cortas con pictograma de apoyo para ordenar sus letras.",
    cantidadDefecto: 5,
    generar: () => generarOrdenarLetras({ cantidad: 5 }),
    generarConCantidad: (cantidad) => generarOrdenarLetras({ cantidad }),
  },
  "matematicas-mayor-menor-igual": {
    area: "matematicas",
    tipo: "mayor-menor-igual",
    etiqueta: "Comparar números",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Mayor, menor o igual",
    resumen: "6 parejas de números del 0 al 10 para comparar.",
    cantidadDefecto: 6,
    generar: () => generarMayorMenorIgual({ cantidad: 6, maximo: 10 }),
    generarConCantidad: (cantidad) => generarMayorMenorIgual({ cantidad, maximo: 10 }),
  },
  "matematicas-cuenta-y-elige": {
    area: "matematicas",
    tipo: "elegir-opcion",
    etiqueta: "Contar y elegir",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Cuenta y elige el número",
    resumen: "4 conteos del 2 al 10 con tres números para elegir en cada uno.",
    cantidadDefecto: 4,
    generar: () => generarCuentaYElige({ cantidad: 4, maximo: 10 }),
    generarConCantidad: (cantidad) => generarCuentaYElige({ cantidad, maximo: 10 }),
  },
  "matematicas-resta-visual": {
    area: "matematicas",
    tipo: "resta-visual",
    etiqueta: "Restar",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Restas con dibujos",
    resumen: "4 restas contando dibujos, del 0 al 8, eligiendo el resultado.",
    cantidadDefecto: 4,
    generar: () => generarRestaVisual({ cantidad: 4, maximo: 8 }),
    generarConCantidad: (cantidad) => generarRestaVisual({ cantidad, maximo: 8 }),
  },
};

// Fichas listas para el catálogo (sin generar contenido todavía).
const ACS_FICHAS = Object.keys(ACS_FICHAS_REGISTRO).map((id) => Object.assign({ id }, ACS_FICHAS_REGISTRO[id]));

// Genera el contenido de una ficha (palabras/números nuevos) a partir
// de su id de registro. Devuelve null si el id no existe.
function acsGenerarFichaPorId(id) {
  const entry = ACS_FICHAS_REGISTRO[id];
  if (!entry) return null;
  return Object.assign({ id, area: entry.area, etiqueta: entry.etiqueta, nivel: entry.nivel }, entry.generar());
}
