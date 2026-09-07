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
  "lengua-clasificar-categoria": {
    area: "lengua",
    tipo: "clasificar",
    etiqueta: "Clasificar",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Clasifica en su grupo",
    resumen: "6 pictogramas para repartir entre dos categorías (animales, comida, ropa...).",
    cantidadDefecto: 6,
    generar: () => generarClasificar({ modo: "categoria", cantidad: 6 }),
    generarConCantidad: (cantidad) => generarClasificar({ modo: "categoria", cantidad }),
  },
  "lengua-clasificar-inicial": {
    area: "lengua",
    tipo: "clasificar",
    etiqueta: "Sonido inicial",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Clasifica por sonido inicial",
    resumen: "6 pictogramas para repartir entre dos vocales según por cuál empiezan.",
    cantidadDefecto: 6,
    generar: () => generarClasificar({ modo: "inicial", cantidad: 6 }),
    generarConCantidad: (cantidad) => generarClasificar({ modo: "inicial", cantidad }),
  },
  "lengua-ordenar-secuencia": {
    area: "lengua",
    tipo: "ordenar-secuencia",
    etiqueta: "Secuencia",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Ordena la secuencia",
    resumen: "4 viñetas de una rutina para ordenar de primero a último.",
    cantidadDefecto: 4,
    generar: () => generarOrdenarSecuencia(),
    generarConCantidad: () => generarOrdenarSecuencia(),
  },
  "lengua-encontrar-diferente": {
    area: "lengua",
    tipo: "elegir-opcion",
    etiqueta: "Discriminar",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Encuentra el diferente",
    resumen: "4 grupos de 4 dibujos: hay que localizar el que no es como los demás.",
    cantidadDefecto: 4,
    generar: () => generarEncontrarDiferente({ cantidad: 4 }),
    generarConCantidad: (cantidad) => generarEncontrarDiferente({ cantidad }),
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
  "matematicas-suma-visual": {
    area: "matematicas",
    tipo: "operacion-visual",
    etiqueta: "Sumar",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Sumas con dibujos",
    resumen: "4 sumas contando dibujos, resultado hasta 8, eligiendo el resultado.",
    cantidadDefecto: 4,
    generar: () => generarSumaVisual({ cantidad: 4, maximo: 8 }),
    generarConCantidad: (cantidad) => generarSumaVisual({ cantidad, maximo: 8 }),
  },
  "matematicas-resta-visual": {
    area: "matematicas",
    tipo: "operacion-visual",
    etiqueta: "Restar",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Restas con dibujos",
    resumen: "4 restas contando dibujos, del 0 al 8, eligiendo el resultado.",
    cantidadDefecto: 4,
    generar: () => generarRestaVisual({ cantidad: 4, maximo: 8 }),
    generarConCantidad: (cantidad) => generarRestaVisual({ cantidad, maximo: 8 }),
  },
  "matematicas-completar-a-10": {
    area: "matematicas",
    tipo: "completar-a-10",
    etiqueta: "Amigos del 10",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Amigos del 10",
    resumen: "6 sumas a las que falta un número para llegar a 10.",
    cantidadDefecto: 6,
    generar: () => generarCompletarA10({ cantidad: 6 }),
    generarConCantidad: (cantidad) => generarCompletarA10({ cantidad }),
  },
  "matematicas-antes-despues": {
    area: "matematicas",
    tipo: "antes-despues",
    etiqueta: "Antes y después",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "¿Qué viene después?",
    resumen: "6 números del 0 al 20: hay que decir cuál viene justo después.",
    cantidadDefecto: 6,
    generar: () => generarAntesDespues({ cantidad: 6, modo: "despues", maximo: 20 }),
    generarConCantidad: (cantidad) => generarAntesDespues({ cantidad, modo: "despues", maximo: 20 }),
  },
  "matematicas-grupos-iguales": {
    area: "matematicas",
    tipo: "grupos-iguales",
    etiqueta: "Multiplicar (inicial)",
    nivel: "Nivel funcional: 1º-2º de Primaria",
    titulo: "Grupos iguales",
    resumen: "4 conteos de grupos iguales (2-3 grupos), primer paso hacia la multiplicación.",
    cantidadDefecto: 4,
    generar: () => generarGruposIguales({ cantidad: 4 }),
    generarConCantidad: (cantidad) => generarGruposIguales({ cantidad }),
  },
  "matematicas-reparto": {
    area: "matematicas",
    tipo: "reparto",
    etiqueta: "Dividir (inicial)",
    nivel: "Nivel funcional: 1º-2º de Primaria",
    titulo: "Reparto en partes iguales",
    resumen: "4 repartos exactos (sin resto) en 2-3 partes, primer paso hacia la división.",
    cantidadDefecto: 4,
    generar: () => generarReparto({ cantidad: 4 }),
    generarConCantidad: (cantidad) => generarReparto({ cantidad }),
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
