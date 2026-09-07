// ============================================================
// Biblioteca de fichas de Apoyo ACS.
//
// Cada ficha es un objeto de datos fijo (no se genera al vuelo):
// se ha elegido así para empezar, con la idea de convertir en
// plantillas generadoras los tipos de actividad que más se repitan
// una vez haya varias fichas reales en uso.
//
// Campos comunes a toda ficha:
//   id        -> usado en la URL (acs/ficha.html?id=...)
//   area      -> "lengua" | "matematicas"
//   tipo      -> ver js/acs-ficha-engine.js (ACS_RENDERERS)
//   etiqueta  -> nombre corto del tipo de actividad, para el catálogo
//   nivel     -> nivel funcional al que está dirigida
//   titulo, instruccion, resumen -> texto visible
// El resto de campos depende del tipo (ver acs-ficha-engine.js).
// ============================================================

const ACS_FICHAS = [
  {
    id: "lengua-une-palabra-dibujo",
    area: "lengua",
    tipo: "unir-parejas",
    etiqueta: "Unir con línea",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Une la palabra con su dibujo",
    instruccion: "Lee cada palabra. Únela con el dibujo que le corresponde.",
    resumen: "Vocabulario básico: 6 palabras para unir con su imagen.",
    pares: [
      { texto: "gato" },
      { texto: "pelota" },
      { texto: "libro" },
      { texto: "casa" },
      { texto: "sol" },
      { texto: "flor" },
    ],
  },
  {
    id: "lengua-lee-y-elige",
    area: "lengua",
    tipo: "elegir-opcion",
    etiqueta: "Leer y elegir",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Lee y elige el dibujo",
    instruccion: "Lee la frase. Elige el dibujo correcto.",
    resumen: "4 frases cortas con dos dibujos para elegir en cada una.",
    items: [
      {
        prompt: "El sol es amarillo.",
        opciones: [
          { clave: "sol", correcta: true },
          { clave: "luna", correcta: false },
        ],
      },
      {
        prompt: "La flor es roja.",
        opciones: [
          { clave: "flor", correcta: true },
          { clave: "árbol", correcta: false },
        ],
      },
      {
        prompt: "El pez nada en el agua.",
        opciones: [
          { clave: "pez", correcta: true },
          { clave: "pájaro", correcta: false },
        ],
      },
      {
        prompt: "La mesa es de madera.",
        opciones: [
          { clave: "mesa", correcta: true },
          { clave: "silla", correcta: false },
        ],
      },
    ],
  },
  {
    id: "matematicas-mayor-menor-igual",
    area: "matematicas",
    tipo: "mayor-menor-igual",
    etiqueta: "Comparar números",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Mayor, menor o igual",
    instruccion: "Compara los dos números. Elige el símbolo correcto.",
    resumen: "6 parejas de números del 0 al 10 para comparar.",
    pares: [
      [3, 7],
      [5, 5],
      [8, 2],
      [6, 9],
      [10, 4],
      [1, 1],
    ],
  },
  {
    id: "matematicas-cuenta-y-elige",
    area: "matematicas",
    tipo: "elegir-opcion",
    etiqueta: "Contar y elegir",
    nivel: "Nivel funcional: 1º de Primaria",
    titulo: "Cuenta y elige el número",
    instruccion: "Cuenta los dibujos. Elige el número correcto.",
    resumen: "4 conteos del 1 al 10 con tres números para elegir en cada uno.",
    items: [
      {
        prompt: "¿Cuántas manzanas hay?",
        conteo: { clave: "manzana", cantidad: 3 },
        opciones: [
          { texto: "2", correcta: false },
          { texto: "3", correcta: true },
          { texto: "4", correcta: false },
        ],
      },
      {
        prompt: "¿Cuántas pelotas hay?",
        conteo: { clave: "pelota", cantidad: 5 },
        opciones: [
          { texto: "4", correcta: false },
          { texto: "5", correcta: true },
          { texto: "6", correcta: false },
        ],
      },
      {
        prompt: "¿Cuántas estrellas hay?",
        conteo: { clave: "estrella", cantidad: 7 },
        opciones: [
          { texto: "6", correcta: false },
          { texto: "7", correcta: true },
          { texto: "8", correcta: false },
        ],
      },
      {
        prompt: "¿Cuántas flores hay?",
        conteo: { clave: "flor", cantidad: 4 },
        opciones: [
          { texto: "3", correcta: false },
          { texto: "4", correcta: true },
          { texto: "5", correcta: false },
        ],
      },
    ],
  },
];

function acsBuscarFicha(id) {
  return ACS_FICHAS.find((f) => f.id === id) || null;
}
