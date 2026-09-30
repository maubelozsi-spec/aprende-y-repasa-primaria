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

// Parejas de pictogramas para "repasa el trazo" y "sigue el camino":
// el trazo lleva del primero al segundo ("lleva al perro hasta su
// hueso"), para que la línea tenga un sentido y un final claros.
const ACS_PAREJAS_TRAZO = [
  ["perro", "hueso"],
  ["abeja", "flor"],
  ["conejo", "zanahoria"],
  ["ratón", "queso"],
  ["mono", "plátano"],
  ["coche", "casa"],
  ["pájaro", "nido"],
  ["niño", "pelota"],
  ["gato", "leche"],
  ["pez", "agua"],
];

// Vocales con una palabra que empieza por ella (su pictograma
// acompaña a la letra que se repasa).
const ACS_VOCALES_TRAZO = [
  { letra: "a", palabra: "avión" },
  { letra: "e", palabra: "elefante" },
  { letra: "i", palabra: "iglú" },
  { letra: "o", palabra: "oso" },
  { letra: "u", palabra: "uva" },
];

// Palabras para repasar: de 2 sílabas en 1º y de 3 en 2º, todas con
// pictograma fácil de reconocer y sílabas directas (consonante +
// vocal), que son las que se leen primero.
const ACS_PALABRAS_TRAZO = {
  1: ["casa", "gato", "mesa", "luna", "pato", "vaca", "taza", "mano", "sopa", "foca", "rosa", "pera"],
  2: ["pelota", "tomate", "conejo", "zapato", "camisa", "paloma", "patata", "tortuga", "maleta", "cometa"],
};

// Palabras de 3 sílabas directas, ya separadas, para "completa la
// palabra" en 2º (en 1º se usa ACS_PALABRAS_SILABAS, de 2 sílabas).
const ACS_PALABRAS_SILABAS_3 = [
  { palabra: "pelota", silabas: ["pe", "lo", "ta"] },
  { palabra: "tomate", silabas: ["to", "ma", "te"] },
  { palabra: "conejo", silabas: ["co", "ne", "jo"] },
  { palabra: "zapato", silabas: ["za", "pa", "to"] },
  { palabra: "camisa", silabas: ["ca", "mi", "sa"] },
  { palabra: "paloma", silabas: ["pa", "lo", "ma"] },
  { palabra: "patata", silabas: ["pa", "ta", "ta"] },
  { palabra: "maleta", silabas: ["ma", "le", "ta"] },
  { palabra: "pepino", silabas: ["pe", "pi", "no"] },
  { palabra: "muñeca", silabas: ["mu", "ñe", "ca"] },
  { palabra: "gusano", silabas: ["gu", "sa", "no"] },
  { palabra: "cometa", silabas: ["co", "me", "ta"] },
];

// Frases cortas para "¿sí o no?": cada palabra con contenido lleva
// su pictograma encima ("p" es la palabra clave para ARASAAC: el
// infinitivo en los verbos). Las palabras sin "p" (artículos,
// preposiciones) van solo escritas. Mitad verdaderas y mitad falsas,
// y las falsas son disparates claros, no trampas.
const ACS_FRASES_SI_NO = [
  { verdad: true, tokens: [{ t: "La" }, { t: "vaca", p: "vaca" }, { t: "da", p: "dar" }, { t: "leche", p: "leche" }] },
  { verdad: false, tokens: [{ t: "El" }, { t: "gato", p: "gato" }, { t: "vuela", p: "volar" }] },
  { verdad: true, tokens: [{ t: "El" }, { t: "pez", p: "pez" }, { t: "nada", p: "nadar" }] },
  { verdad: false, tokens: [{ t: "La" }, { t: "mesa", p: "mesa" }, { t: "come", p: "comer" }] },
  { verdad: true, tokens: [{ t: "El" }, { t: "sol", p: "sol" }, { t: "es" }, { t: "amarillo", p: "amarillo" }] },
  { verdad: false, tokens: [{ t: "La" }, { t: "nieve", p: "nieve" }, { t: "es" }, { t: "negra", p: "negro" }] },
  { verdad: true, tokens: [{ t: "El" }, { t: "perro", p: "perro" }, { t: "ladra", p: "ladrar" }] },
  { verdad: false, tokens: [{ t: "El" }, { t: "coche", p: "coche" }, { t: "nada", p: "nadar" }] },
  { verdad: true, tokens: [{ t: "El" }, { t: "pájaro", p: "pájaro" }, { t: "vuela", p: "volar" }] },
  { verdad: false, tokens: [{ t: "La" }, { t: "vaca", p: "vaca" }, { t: "vuela", p: "volar" }] },
  { verdad: true, tokens: [{ t: "Como", p: "comer" }, { t: "con" }, { t: "la" }, { t: "boca", p: "boca" }] },
  { verdad: false, tokens: [{ t: "Veo", p: "ver" }, { t: "con" }, { t: "la" }, { t: "nariz", p: "nariz" }] },
  { verdad: true, tokens: [{ t: "El" }, { t: "tomate", p: "tomate" }, { t: "es" }, { t: "rojo", p: "rojo" }] },
  { verdad: false, tokens: [{ t: "El" }, { t: "pato", p: "pato" }, { t: "ladra", p: "ladrar" }] },
  { verdad: true, tokens: [{ t: "Duermo", p: "dormir" }, { t: "en" }, { t: "la" }, { t: "cama", p: "cama" }] },
  { verdad: false, tokens: [{ t: "La" }, { t: "luna", p: "luna" }, { t: "come", p: "comer" }] },
];

// Objetos para los problemas con dibujos, con su plural y su género
// (para escribir "¿Cuántas...?" o "¿Cuántos...?" sin fallos).
const ACS_OBJETOS_PROBLEMA = [
  { clave: "manzana", plural: "manzanas", femenino: true },
  { clave: "galleta", plural: "galletas", femenino: true },
  { clave: "pelota", plural: "pelotas", femenino: true },
  { clave: "flor", plural: "flores", femenino: true },
  { clave: "globo", plural: "globos", femenino: false },
  { clave: "caramelo", plural: "caramelos", femenino: false },
  { clave: "lápiz", plural: "lápices", femenino: false },
  { clave: "coche", plural: "coches", femenino: false },
];
