// ============================================================
// Banco de vocabulario para los generadores de fichas de Apoyo ACS
// (js/acs-generadores.js). Palabras comunes y concretas, elegidas
// porque es muy probable que existan como pictograma en ARASAAC.
//
// Separado de los generadores para que ampliar el banco (añadir más
// palabras, más categorías) no toque nada de la lógica de generación.
// ============================================================

const ACS_CATEGORIAS_PALABRAS = {
  animales: ["gato", "perro", "vaca", "pájaro", "pez", "mariposa", "conejo", "tortuga", "oveja", "gallina", "caballo", "rana"],
  casa: ["casa", "silla", "mesa", "cama", "puerta", "ventana", "libro", "lápiz", "pelota", "reloj", "llave", "taza"],
  comida: ["manzana", "pan", "leche", "huevo", "plátano", "naranja", "queso", "agua", "galleta", "tomate"],
  cuerpo: ["mano", "ojo", "boca", "pie", "oreja", "nariz", "cabeza", "pierna"],
  ropa: ["camisa", "pantalón", "zapato", "gorro", "calcetín", "chaqueta"],
  naturaleza: ["sol", "luna", "estrella", "árbol", "flor", "nube", "río", "montaña", "lluvia"],
  transportes: ["coche", "autobús", "tren", "avión", "barco", "bicicleta"],
};

// Palabras cortas (3-5 letras) para "ordenar letras": cada una con
// su categoría, para poder pedir el pictograma con arasaacCrearImagen.
const ACS_PALABRAS_ORDENAR_LETRAS = [
  "sol", "pan", "casa", "gato", "mesa", "luna", "flor", "pez", "oso", "taza", "vaca", "pato",
];

// Objetos contables para "resta visual": palabras que tiene sentido
// repetir varias veces en una fila (frutas, formas, animales pequeños).
const ACS_OBJETOS_CONTABLES = ["manzana", "pelota", "estrella", "flor", "pez", "mariposa", "globo"];

// Palabras de dos sílabas para "unir sílabas": se muestran ya
// separadas en silabas[0] y silabas[1].
const ACS_PALABRAS_SILABAS = [
  { palabra: "vaso", silabas: ["va", "so"] },
  { palabra: "casa", silabas: ["ca", "sa"] },
  { palabra: "gato", silabas: ["ga", "to"] },
  { palabra: "pato", silabas: ["pa", "to"] },
  { palabra: "cama", silabas: ["ca", "ma"] },
  { palabra: "moto", silabas: ["mo", "to"] },
  { palabra: "boca", silabas: ["bo", "ca"] },
  { palabra: "dedo", silabas: ["de", "do"] },
  { palabra: "loro", silabas: ["lo", "ro"] },
  { palabra: "pelo", silabas: ["pe", "lo"] },
  { palabra: "mesa", silabas: ["me", "sa"] },
  { palabra: "pila", silabas: ["pi", "la"] },
];

// Frases cortas sujeto-verbo-atributo para "lee y elige", con una
// palabra clave correcta y una incorrecta (mismo tipo de cosa, para
// que haga falta leer y no baste con adivinar).
const ACS_FRASES_LEE_Y_ELIGE = [
  { prompt: "El sol es amarillo.", correcta: "sol", incorrecta: "luna" },
  { prompt: "La flor es roja.", correcta: "flor", incorrecta: "árbol" },
  { prompt: "El pez nada en el agua.", correcta: "pez", incorrecta: "pájaro" },
  { prompt: "La mesa es de madera.", correcta: "mesa", incorrecta: "silla" },
  { prompt: "El gato duerme en el sofá.", correcta: "gato", incorrecta: "perro" },
  { prompt: "La manzana es roja.", correcta: "manzana", incorrecta: "plátano" },
  { prompt: "El coche tiene ruedas.", correcta: "coche", incorrecta: "bicicleta" },
  { prompt: "La vaca vive en la granja.", correcta: "vaca", incorrecta: "oveja" },
  { prompt: "El libro tiene páginas.", correcta: "libro", incorrecta: "reloj" },
  { prompt: "La estrella brilla de noche.", correcta: "estrella", incorrecta: "sol" },
];

function acsElegirAlAzar(array, cantidad) {
  const copia = array.slice();
  acsBarajar(copia);
  return copia.slice(0, Math.min(cantidad, copia.length));
}

// Nombre legible de cada categoría de ACS_CATEGORIAS_PALABRAS, para
// el generador de "clasificar" (reutiliza el mismo banco de palabras
// en vez de mantener uno aparte).
const ACS_CATEGORIA_ETIQUETAS = {
  animales: "Animales",
  casa: "Casa y objetos",
  comida: "Comida",
  cuerpo: "Cuerpo",
  ropa: "Ropa",
  naturaleza: "Naturaleza",
  transportes: "Transportes",
};

// Palabras agrupadas por su vocal inicial, para "clasificar por
// sonido inicial" (fonética, nivel 1º).
const ACS_PALABRAS_POR_INICIAL = {
  a: ["avión", "árbol", "araña", "anillo"],
  e: ["estrella", "escoba", "elefante"],
  i: ["iglú", "isla"],
  o: ["oso", "oreja", "ojo"],
  u: ["uva", "uña", "unicornio"],
};

// Secuencias de rutinas (orden correcto) para "ordenar-secuencia".
// Palabras de acción sencillas, más fiables de encontrar en ARASAAC
// que una frase completa ("levantarse de la cama").
const ACS_SECUENCIAS = [
  ["despertar", "lavar", "desayunar", "vestir"],
  ["cocinar", "comer", "recoger", "lavar"],
  ["jugar", "cansar", "bañar", "dormir"],
];

// Palabras más largas (5-7 letras) para "ordenar letras" en 2º: mismo
// tipo de actividad que ACS_PALABRAS_ORDENAR_LETRAS, un peldaño más
// difícil.
const ACS_PALABRAS_ORDENAR_LETRAS_2 = [
  "cohete", "dragón", "cuchara", "ventana", "paraguas", "escalera", "tijeras", "camisa",
];

// Palabras con su número real de sílabas, para "cuenta las sílabas".
// No se reutiliza ACS_PALABRAS_SILABAS porque esa lista es siempre de
// dos sílabas (para unirlas); aquí hace falta variedad (1, 2 y 3)
// para que la pregunta tenga sentido.
const ACS_PALABRAS_CONTEO_SILABAS = [
  { palabra: "sol", silabas: 1 },
  { palabra: "pan", silabas: 1 },
  { palabra: "pez", silabas: 1 },
  { palabra: "flor", silabas: 1 },
  { palabra: "gato", silabas: 2 },
  { palabra: "casa", silabas: 2 },
  { palabra: "mesa", silabas: 2 },
  { palabra: "perro", silabas: 2 },
  { palabra: "manzana", silabas: 3 },
  { palabra: "mariposa", silabas: 4 },
  { palabra: "elefante", silabas: 4 },
  { palabra: "bicicleta", silabas: 4 },
];
