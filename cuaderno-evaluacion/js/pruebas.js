// ============================================================
// Cuaderno de evaluación · registro de contenidos de cada prueba.
//
// Cada SdA es un bloque de 3 mini SdA del libro y se cierra con un
// examen: 3 SdA por trimestre, 9 en el curso (n = 1-9: T1 = 1-3,
// T2 = 4-6, T3 = 7-9). Cada SdA tiene su examen ordinario y, si existe,
// la prueba adaptada (ACS).
//
// Lo que se marca de cada examen son CONTENIDOS (sumas, divisiones,
// jerarquía, resolución de problemas…), no preguntas: un contenido
// puede salir en varias preguntas y una pregunta puede evaluar varios
// contenidos. «preg» indica dónde mirar en el examen.
//
// Las SdA del 1.º trimestre salen de los exámenes reales de 5.º C
// (curso 2026-2027). Las del 2.º y 3.º son PROVISIONALES: sacadas de
// las UDI de 5.º de esta app (js/udi-*5-t2/t3-*.js); hay que ajustarlas
// cuando llegue cada examen (pestaña «Exámenes»).
//
// Los ejes agrupan contenidos que se repiten de una SdA a otra,
// para que la gráfica de avance compare lo comparable (la ortografía
// de la SdA 1 con la de la SdA 5) y no solo notas de exámenes con
// contenidos distintos.
// ============================================================

const CE_EJES = {
  lengua: [
    { id: "cl", label: "Comprensión lectora" },
    { id: "co", label: "Comprensión oral" },
    { id: "di", label: "Dictado y escritura" },
    { id: "or", label: "Ortografía y acentuación" },
    { id: "gr", label: "Gramática" },
    { id: "vo", label: "Vocabulario y formación de palabras" },
    { id: "tx", label: "Comunicación, textos y literatura" },
  ],
  mates: [
    { id: "nu", label: "Números y divisibilidad" },
    { id: "ca", label: "Cálculo y operaciones" },
    { id: "rp", label: "Resolución de problemas" },
    { id: "ge", label: "Geometría y espacio" },
    { id: "me", label: "Medida" },
    { id: "ra", label: "Conceptos y razonamiento" },
    { id: "es", label: "Estadística y probabilidad" },
  ],
};

const CE_AREAS = [
  { id: "lengua", label: "Lengua" },
  { id: "mates", label: "Matemáticas" },
];

// c(id, preguntas, contenido, eje, criterios)
function ceC(id, preg, contenido, eje, criterios) {
  return { id: id, pregunta: preg, contenido: contenido, eje: eje, criterios: criterios || [] };
}
// Provisional: sin preguntas ni criterios elegidos (se ponen por eje).
function cePr(lista) {
  return lista.map(function (x, i) {
    return { id: "c" + (i + 1), pregunta: "", contenido: x[0], eje: x[1] };
  });
}

const CE_PRUEBAS = {
  lengua: [
    {
      n: 1, trimestre: 1, fecha: "2026-10-14",
      titulo: "«El universo» · mini SdA 1, 2 y 3", fuente: "examen",
      ordinaria: [
        ceC("k1", "1, 2", "Comprensión lectora: información e inferencias", "cl", ["4.1.a"]),
        ceC("k2", "1, 2c", "El texto predictivo: predicción, razones, conectores y partes", "tx", ["4.2.a"]),
        ceC("k3", "2b", "Vocabulario en contexto", "vo", ["4.1.a", "9.1.a"]),
        ceC("k4", "3", "Dictado: ortografía y tildes al escribir", "di", ["5.1.a"]),
        ceC("k5", "4", "Sinónimos y antónimos", "vo", ["9.1.a"]),
        ceC("k6", "5", "Enunciado oracional y no oracional", "gr", ["9.1.a"]),
        ceC("k7", "6", "Clases de enunciado según la intención", "gr", ["9.1.a"]),
        ceC("k8", "7", "Las interjecciones", "gr", ["9.1.a"]),
        ceC("k9", "8", "Separar en sílabas y sílaba tónica", "or", ["9.1.a"]),
        ceC("k10", "8", "Agudas, llanas y esdrújulas", "or", ["9.1.a", "5.1.a"]),
        ceC("k11", "9a", "Texto literario y no literario", "tx", ["8.1.a"]),
        ceC("k12", "9b, 9c", "El cómic: onomatopeyas y elementos", "tx", ["8.1.a", "4.2.a"]),
        ceC("k13", "10", "Comprensión oral", "co", ["2.1.a"]),
      ],
      acs: [
        ceC("k1", "1", "Asociar dibujo y palabra", "cl", ["4.1.a"]),
        ceC("k2", "2", "Discriminar una palabra igual al modelo", "cl", ["4.1.a"]),
        ceC("k3", "3", "Escribir una palabra letra a letra", "di", ["5.1.a"]),
        ceC("k4", "4, 5", "Palabras contrarias y palabras que significan lo mismo", "vo", ["9.1.a"]),
        ceC("k5", "6", "Signos de interrogación y exclamación", "gr", ["4.2.a"]),
        ceC("k6", "7", "Interjecciones: reconocer la emoción", "gr", ["2.1.a"]),
        ceC("k7", "8", "Contar sílabas", "or", ["9.1.a"]),
        ceC("k8", "9", "Cuento (inventado) o noticia (real)", "tx", ["8.1.a"]),
        ceC("k9", "10", "Dictado de palabras", "di", ["5.1.a"]),
      ],
    },
    {
      n: 2, trimestre: 1, fecha: "2026-11-12",
      titulo: "«El clima y el planeta» · mini SdA 4, 5 y 6", fuente: "examen",
      ordinaria: [
        ceC("k1", "1", "Comprensión lectora: información e inferencias", "cl", ["4.1.a"]),
        ceC("k2", "2", "El diario: partes", "tx", ["4.2.a"]),
        ceC("k3", "3", "Dictado: ortografía y tildes al escribir", "di", ["5.1.a"]),
        ceC("k4", "4", "Lenguaje verbal (oral y escrito) y no verbal", "tx", ["2.1.a", "4.2.a"]),
        ceC("k5", "5", "El verbo: raíz y desinencia", "gr", ["9.1.a"]),
        ceC("k6", "5, 7a", "El verbo: persona, número, tiempo y modo", "gr", ["9.1.a"]),
        ceC("k7", "6", "Infinitivo y conjugación", "gr", ["9.1.a"]),
        ceC("k8", "7b", "Transformar al pasado y al futuro", "gr", ["9.1.a", "5.1.a"]),
        ceC("k9", "8a, 8c", "Prefijos", "vo", ["9.1.a"]),
        ceC("k10", "8b, 8c", "Sufijos", "vo", ["9.1.a"]),
        ceC("k11", "9", "Reglas de acentuación", "or", ["9.1.a", "5.1.a"]),
        ceC("k12", "10a", "El cuento y la novela", "tx", ["8.1.a"]),
        ceC("k13", "10c, 10d", "Estructura de la narración: inicio, nudo y desenlace", "tx", ["8.1.a"]),
        ceC("k14", "10", "Comprensión oral", "co", ["2.1.a"]),
      ],
      acs: [
        ceC("k1", "1", "Asociar dibujo y palabra", "cl", ["4.1.a"]),
        ceC("k2", "2", "Comunicación sin palabras (no verbal)", "tx", ["2.1.a"]),
        ceC("k3", "3", "Localizar la fecha en un diario", "tx", ["4.2.a"]),
        ceC("k4", "4", "Verbos: asociar dibujo y acción", "gr", ["9.1.a"]),
        ceC("k5", "5", "Lo hace uno o muchos (número)", "gr", ["9.1.a"]),
        ceC("k6", "6", "Ayer o mañana (pasado y futuro)", "gr", ["9.1.a"]),
        ceC("k7", "7", "Contrarios con des-", "vo", ["9.1.a"]),
        ceC("k8", "8", "Comprensión oral: ordenar el cuento", "co", ["2.1.a", "8.1.a"]),
        ceC("k9", "9", "Reconocer la palabra con tilde", "or", ["4.2.a"]),
        ceC("k10", "10", "Dictado de palabras", "di", ["5.1.a"]),
      ],
    },
    {
      n: 3, trimestre: 1, fecha: "2026-12-10",
      titulo: "«El relieve de España y Europa» · mini SdA 7, 8 y 9", fuente: "examen",
      ordinaria: [
        ceC("k1", "1", "Comprensión lectora: información e inferencias", "cl", ["4.1.a"]),
        ceC("k2", "2", "El texto instructivo: partes", "tx", ["4.2.a"]),
        ceC("k3", "3", "Dictado: tildes de los hiatos", "di", ["5.1.a"]),
        ceC("k4", "4", "Infinitivo e imperativo en las instrucciones", "gr", ["9.1.a"]),
        ceC("k5", "5, 6", "Formas no personales: infinitivo, gerundio y participio", "gr", ["9.1.a"]),
        ceC("k6", "6", "Formas simples y compuestas", "gr", ["9.1.a"]),
        ceC("k7", "7", "Análisis de formas verbales", "gr", ["9.1.a"]),
        ceC("k8", "8", "Formación de verbos", "vo", ["9.1.a"]),
        ceC("k9", "9", "Diptongos e hiatos", "or", ["9.1.a", "5.1.a"]),
        ceC("k10", "10", "La leyenda: características y estructura", "tx", ["8.1.a"]),
        ceC("k11", "10", "Comprensión oral", "co", ["2.1.a"]),
      ],
      acs: [
        ceC("k1", "1", "Asociar dibujo y palabra", "cl", ["4.1.a"]),
        ceC("k2", "2", "Comprensión: qué necesita una planta", "cl", ["4.1.a"]),
        ceC("k3", "3", "Ordenar los pasos de unas instrucciones", "tx", ["4.2.a"]),
        ceC("k4", "4", "Verbos: asociar dibujo y acción", "gr", ["9.1.a"]),
        ceC("k5", "5", "Forma verbal de una o de dos palabras", "gr", ["9.1.a"]),
        ceC("k6", "6", "Ayer o mañana (pasado y futuro)", "gr", ["9.1.a"]),
        ceC("k7", "7", "Palabra y su verbo", "vo", ["9.1.a"]),
        ceC("k8", "8", "Cómo empieza una leyenda", "tx", ["8.1.a"]),
        ceC("k9", "9", "Dos vocales juntas", "or", ["9.1.a"]),
        ceC("k10", "10", "Dictado de palabras", "di", ["5.1.a"]),
      ],
    },
    {
      n: 4, trimestre: 2, fecha: "",
      titulo: "Argumentar, el sustantivo y el teatro (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Comprensión lectora", "cl"],
        ["El texto argumentativo", "tx"],
        ["Dictado: ortografía y tildes al escribir", "di"],
        ["El debate y el diálogo", "tx"],
        ["El sustantivo: clases", "gr"],
        ["Género y número del sustantivo", "gr"],
        ["Elementos del texto teatral: diálogo, acotaciones y personajes", "tx"],
        ["Ortografía", "or"],
        ["Comprensión oral", "co"],
      ]),
      acs: [],
    },
    {
      n: 5, trimestre: 2, fecha: "",
      titulo: "Textos discontinuos, el adjetivo y la obra teatral (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Comprensión lectora", "cl"],
        ["Textos discontinuos, el anuncio y el cartel", "tx"],
        ["Dictado: ortografía y tildes al escribir", "di"],
        ["El adjetivo", "gr"],
        ["Grados del adjetivo y concordancia", "gr"],
        ["Estructura de una obra teatral: actos y escenas", "tx"],
        ["Ortografía", "or"],
        ["Comprensión oral", "co"],
      ]),
      acs: [],
    },
    {
      n: 6, trimestre: 2, fecha: "",
      titulo: "El reportaje, los determinantes y la poesía (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Comprensión lectora", "cl"],
        ["El reportaje", "tx"],
        ["Dictado: ortografía y tildes al escribir", "di"],
        ["Los determinantes y sus clases", "gr"],
        ["La poesía: verso, estrofa y rima", "tx"],
        ["Recursos poéticos", "tx"],
        ["Ortografía", "or"],
        ["Comprensión oral", "co"],
      ]),
      acs: [],
    },
    {
      n: 7, trimestre: 3, fecha: "",
      titulo: "Las lenguas de España, determinantes y el haiku (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Comprensión lectora", "cl"],
        ["El lenguaje y las lenguas de España", "tx"],
        ["El texto expositivo", "tx"],
        ["Dictado: ortografía y tildes al escribir", "di"],
        ["Los determinantes en el texto", "gr"],
        ["El haiku", "tx"],
        ["Ortografía", "or"],
        ["Comprensión oral", "co"],
      ]),
      acs: [],
    },
    {
      n: 8, trimestre: 3, fecha: "",
      titulo: "Argumentar, familias de palabras y figuras (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Comprensión lectora", "cl"],
        ["El texto argumentativo: tesis y argumentos", "tx"],
        ["Dictado: ortografía y tildes al escribir", "di"],
        ["Familia de palabras y campo semántico", "vo"],
        ["Adverbios, preposiciones y conjunciones", "gr"],
        ["La comparación y la metáfora", "tx"],
        ["Ortografía", "or"],
        ["Comprensión oral", "co"],
      ]),
      acs: [],
    },
    {
      n: 9, trimestre: 3, fecha: "",
      titulo: "La noticia, la oración y la hipérbole (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Comprensión lectora", "cl"],
        ["La noticia: partes y preguntas", "tx"],
        ["Dictado: ortografía y tildes al escribir", "di"],
        ["Sujeto y predicado", "gr"],
        ["Voz activa y voz pasiva", "gr"],
        ["La hipérbole", "tx"],
        ["Ortografía", "or"],
        ["Comprensión oral", "co"],
      ]),
      acs: [],
    },
  ],
  mates: [
    {
      n: 1, trimestre: 1, fecha: "2026-10-14",
      titulo: "«El universo» · mini SdA 1, 2 y 3: números grandes y operaciones", fuente: "examen",
      ordinaria: [
        ceC("k1", "1", "Leer y escribir números de 6 cifras", "nu", ["6.1.a"]),
        ceC("k2", "1", "Descomposición y valor de posición", "nu", ["6.1.a", "5.1.a"]),
        ceC("k3", "2", "Comparar y ordenar números", "nu", ["5.1.a"]),
        ceC("k4", "3", "Redondeo (UM, DM, CM)", "nu", ["5.1.a"]),
        ceC("k5", "4", "Aproximación: elegir y justificar la mejor", "nu", ["5.1.a", "6.2.a"]),
        ceC("k6", "5, 10", "Sumas", "ca", ["2.2.a"]),
        ceC("k7", "5, 10", "Restas", "ca", ["2.2.a"]),
        ceC("k8", "7, 10", "Multiplicaciones", "ca", ["2.2.a"]),
        ceC("k9", "6, 10", "Divisiones y su prueba", "ca", ["2.2.a", "2.3.a"]),
        ceC("k10", "9", "Propiedades de las operaciones", "ca", ["6.1.a", "5.1.a"]),
        ceC("k11", "8", "Jerarquía de las operaciones", "ca", ["2.2.a"]),
        ceC("k12", "5, 6, 7", "Resolución de problemas: comprender y plantear", "rp", ["1.1.a", "2.1.a"]),
        ceC("k13", "5, 6, 7", "Resolución de problemas: calcular y responder con su palabra", "rp", ["2.2.a", "2.3.a"]),
      ],
      acs: [
        ceC("k1", "1, 2", "Contar y escribir números hasta el 10", "nu", ["6.1.a"]),
        ceC("k2", "3, 4", "Comparar números: mayor y menor", "nu", ["5.1.a", "6.1.a"]),
        ceC("k3", "5", "Decenas y unidades", "nu", ["5.1.a"]),
        ceC("k4", "6", "La recta numérica: decena más cercana", "nu", ["5.1.a"]),
        ceC("k5", "7", "Sumas sencillas", "ca", ["2.2.a"]),
        ceC("k6", "8", "Restas sencillas", "ca", ["2.2.a"]),
        ceC("k7", "9, 10", "Problemas: elegir la operación (suma o resta)", "rp", ["1.1.a", "2.1.a"]),
        ceC("k8", "9, 10", "Problemas: calcular y escribir la solución", "rp", ["2.2.a", "2.3.a"]),
      ],
    },
    {
      n: 2, trimestre: 1, fecha: "2026-11-12",
      titulo: "«¡Las fiestas del pueblo!»: múltiplos y divisores", fuente: "examen",
      ordinaria: [
        ceC("k1", "1, 6", "Divisores de un número", "nu", ["5.1.a", "6.1.a"]),
        ceC("k2", "1, 2", "Números primos y compuestos", "nu", ["6.1.a"]),
        ceC("k3", "3", "Múltiplos de un número", "nu", ["6.1.a"]),
        ceC("k4", "4, 7", "Múltiplos comunes", "nu", ["5.1.a"]),
        ceC("k5", "5, 10", "Relación entre múltiplo y divisor", "nu", ["6.1.a", "3.1.a"]),
        ceC("k6", "9b", "Divisibilidad entre 3 (suma de cifras)", "nu", ["5.1.a"]),
        ceC("k7", "9a", "Razonar verdadero o falso", "ra", ["3.1.a", "6.2.a"]),
        ceC("k8", "10a, 10b", "Sumas y restas", "ca", ["2.2.a"]),
        ceC("k9", "10c", "Multiplicaciones", "ca", ["2.2.a"]),
        ceC("k10", "10d, 10e", "Divisiones", "ca", ["2.2.a", "2.3.a"]),
        ceC("k11", "6, 7, 8", "Resolución de problemas: comprender y plantear", "rp", ["1.1.a", "2.1.a"]),
        ceC("k12", "6, 7, 8", "Resolución de problemas: calcular y responder con su palabra", "rp", ["2.2.a", "2.3.a"]),
        ceC("k13", "8", "Estrategia: descartar con pistas", "rp", ["2.2.a", "3.1.a"]),
      ],
      acs: [
        ceC("k1", "1", "Contar y escribir números hasta el 12", "nu", ["6.1.a"]),
        ceC("k2", "2, 8", "Hacer grupos iguales", "nu", ["5.1.a"]),
        ceC("k3", "3, 4", "Repartir en partes iguales y ver si sobra", "ca", ["2.2.a", "5.1.a"]),
        ceC("k4", "5", "Números pares", "nu", ["6.1.a"]),
        ceC("k5", "6, 7", "Contar de 2 en 2 y de 10 en 10", "nu", ["3.1.a"]),
        ceC("k6", "9, 10", "Problemas de suma repetida: elegir la operación", "rp", ["1.1.a", "2.1.a"]),
        ceC("k7", "9, 10", "Problemas: calcular y escribir la solución", "rp", ["2.2.a", "2.3.a"]),
      ],
    },
    {
      n: 3, trimestre: 1, fecha: "2026-12-10",
      titulo: "«Las constelaciones» y «España en coordenadas»: ángulos, coordenadas y movimientos", fuente: "examen",
      ordinaria: [
        ceC("k1", "1, 2b", "Medir y dibujar ángulos con el transportador", "me", ["5.1.a", "2.3.a"]),
        ceC("k2", "1, 2a", "Clasificar ángulos", "ge", ["6.1.a"]),
        ceC("k3", "3", "Ángulos adyacentes y opuestos por el vértice", "ge", ["5.1.a"]),
        ceC("k4", "4", "Suma de los ángulos de un triángulo y un cuadrilátero", "ge", ["5.1.a", "2.2.a"]),
        ceC("k5", "5, 6b", "Coordenadas de un punto", "ge", ["6.1.a"]),
        ceC("k6", "6a, 7", "Simetría", "ge", ["5.1.a"]),
        ceC("k7", "6b, 7", "Traslación", "ge", ["5.1.a"]),
        ceC("k8", "7", "Giros", "ge", ["6.1.a"]),
        ceC("k9", "9", "Razonar verdadero o falso", "ra", ["3.1.a", "6.2.a"]),
        ceC("k10", "10a, 10b", "Sumas y restas", "ca", ["2.2.a"]),
        ceC("k11", "10c", "Multiplicaciones", "ca", ["2.2.a"]),
        ceC("k12", "10d, 10e", "Divisiones y «¿es divisor?»", "ca", ["2.2.a", "2.3.a"]),
        ceC("k13", "8", "Jerarquía de las operaciones en una sola expresión", "ca", ["2.2.a", "6.2.a"]),
        ceC("k14", "8", "Resolución de problemas: elegir los datos necesarios", "rp", ["1.1.a", "2.1.a"]),
      ],
      acs: [
        ceC("k1", "1", "Línea recta y línea curva", "ge", ["6.1.a"]),
        ceC("k2", "2, 3", "Esquina recta y esquina más abierta (ángulos)", "ge", ["6.1.a", "5.1.a"]),
        ceC("k3", "4, 5", "Figuras planas: círculo y triángulo (lados y esquinas)", "ge", ["6.1.a"]),
        ceC("k4", "6", "Orientación: hacia la derecha", "ge", ["5.1.a"]),
        ceC("k5", "7", "Simetría: dos mitades iguales", "ge", ["5.1.a"]),
        ceC("k6", "8", "Giros: cuartos de vuelta", "ge", ["6.1.a"]),
        ceC("k7", "9, 10", "Problemas: elegir la operación (suma o resta)", "rp", ["1.1.a", "2.1.a"]),
        ceC("k8", "9, 10", "Problemas: calcular y escribir la solución", "rp", ["2.2.a", "2.3.a"]),
      ],
    },
    {
      n: 4, trimestre: 2, fecha: "",
      titulo: "Las fracciones (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Qué es una fracción: leer y representar", "nu"],
        ["Fracciones equivalentes", "nu"],
        ["Comparar y ordenar fracciones", "nu"],
        ["Fracción de una cantidad", "ca"],
        ["Resolución de problemas: comprender y plantear", "rp"],
        ["Resolución de problemas: calcular y responder con su palabra", "rp"],
      ]),
      acs: [],
    },
    {
      n: 5, trimestre: 2, fecha: "",
      titulo: "Operaciones con fracciones (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Suma de fracciones", "ca"],
        ["Resta de fracciones", "ca"],
        ["Fracción de una cantidad", "ca"],
        ["Operaciones combinadas con fracciones", "ca"],
        ["Resolución de problemas: comprender y plantear", "rp"],
        ["Resolución de problemas: calcular y responder con su palabra", "rp"],
      ]),
      acs: [],
    },
    {
      n: 6, trimestre: 2, fecha: "",
      titulo: "Decimales y unidades de medida (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Los números decimales: leer y descomponer", "nu"],
        ["Comparar y ordenar decimales", "nu"],
        ["Unidades de longitud y capacidad", "me"],
        ["Unidades de masa y superficie", "me"],
        ["Resolución de problemas: comprender y plantear", "rp"],
        ["Resolución de problemas: calcular y responder con su palabra", "rp"],
      ]),
      acs: [],
    },
    {
      n: 7, trimestre: 3, fecha: "",
      titulo: "Suma y resta de decimales; perímetro y área (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Suma de números decimales", "ca"],
        ["Resta de números decimales", "ca"],
        ["Perímetro de polígonos", "me"],
        ["Área de polígonos y por cuadrículas", "me"],
        ["Resolución de problemas: comprender y plantear", "rp"],
        ["Resolución de problemas: calcular y responder con su palabra", "rp"],
      ]),
      acs: [],
    },
    {
      n: 8, trimestre: 3, fecha: "",
      titulo: "Multiplicar y dividir decimales; cuerpos geométricos (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Multiplicar decimales", "ca"],
        ["Dividir decimales", "ca"],
        ["Los cuerpos geométricos", "ge"],
        ["El desarrollo plano de los cuerpos", "ge"],
        ["Resolución de problemas: comprender y plantear", "rp"],
        ["Resolución de problemas: calcular y responder con su palabra", "rp"],
      ]),
      acs: [],
    },
    {
      n: 9, trimestre: 3, fecha: "",
      titulo: "Porcentajes y unidades de tiempo (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Qué es un porcentaje", "nu"],
        ["Aumentos y disminuciones porcentuales", "ca"],
        ["Las unidades de tiempo", "me"],
        ["Cambio de unidades de tiempo", "me"],
        ["Resolución de problemas: comprender y plantear", "rp"],
        ["Resolución de problemas: calcular y responder con su palabra", "rp"],
      ]),
      acs: [],
    },
  ],
};

// ============================================================
// Criterios de evaluación de 5.º (tercer ciclo) de la Orden de 30 de
// mayo de 2023 (BOJA, Anexo II): los terminados en «.a» son los de 5.º.
// «texto» es la transcripción del BOJA; «corto» es una etiqueta propia
// para las tablas.
//
// Vinculación con los contenidos de cada examen: propuesta razonada,
// a revisar por el docente (se cambia en la pestaña «Exámenes»). Los
// exámenes no evalúan todos los criterios: los de expresión oral
// (LCL 3.x), investigación (6.x), lectura autónoma (7.x), convivencia
// (10.x) o los socioafectivos de Matemáticas (7.x, 8.x) necesitan otros
// instrumentos (observación, reto final, rúbricas).
//
// Las pruebas ACS se vinculan a los criterios del nivel de la
// adaptación (CE_CRITERIOS_ACS, más abajo), no a los de 5.º.
// ============================================================

const CE_CRITERIOS = {
  lengua: {
    "1.1.a": { corto: "Diversidad lingüística y variedades", texto: "Mostrar interés y respeto por las distintas lenguas y variedades dialectales, incluidas las lenguas de signos, identificando algunos rasgos de los dialectos y lenguas familiares del alumnado." },
    "1.2.a": { corto: "Prejuicios y estereotipos lingüísticos", texto: "Detectar, con autonomía creciente y en contextos próximos, prejuicios y estereotipos lingüísticos frecuentes, aportando alternativas y valorando la diversidad lingüística del mundo como una fuente de riqueza cultural." },
    "1.3.a": { corto: "Modalidad lingüística andaluza", texto: "Conocer los rasgos de la modalidad lingüística andaluza del entorno geográfico del alumnado." },
    "2.1.a": { corto: "Comprensión oral y multimodal", texto: "Comprender el sentido de textos orales y multimodales sencillos, reconociendo las ideas principales y los mensajes explícitos e implícitos, valorando con cierta autonomía su contenido y los elementos no verbales elementales y, de manera acompañada, algunos elementos formales elementales." },
    "3.1.a": { corto: "Producción oral", texto: "Producir textos orales y multimodales de manera progresivamente autónoma, coherente y fluida, en contextos formales sencillos y utilizando correctamente recursos verbales y no verbales básicos." },
    "3.2.a": { corto: "Interacción oral", texto: "Participar en interacciones orales espontáneas o regladas, respetando las normas de la cortesía lingüística, iniciando de manera acompañada el desarrollo de estrategias sencillas de escucha activa y de cooperación conversacional." },
    "3.3.a": { corto: "Textos orales de literatura infantil andaluza", texto: "Conocer y producir textos orales y multimodales de manera progresivamente más autónoma, coherente y fluida, propios de la literatura infantil andaluza, utilizando correctamente recursos verbales y no verbales básicos." },
    "4.1.a": { corto: "Comprensión lectora: sentido global e inferencias", texto: "Leer de manera silenciosa y en voz alta textos escritos y multimodales sencillos, identificando el sentido global y la información relevante, realizando inferencias directas de manera acompañada y superando la interpretación literal para construir conocimiento." },
    "4.2.a": { corto: "Analizar contenido, estructura y forma de textos", texto: "Analizar e interpretar, de manera acompañada, el contenido y aspectos formales y no verbales elementales de textos escritos y multimodales, valorando su contenido y estructura e iniciando la evaluación de su calidad, fiabilidad e idoneidad en función del propósito de lectura." },
    "5.1.a": { corto: "Producción escrita y normas ortográficas", texto: "Producir textos escritos y multimodales coherentes, en distintos soportes, seleccionando el modelo discursivo que mejor responda a cada situación comunicativa, progresando en el uso de las normas gramaticales y ortográficas básicas y movilizando, de manera acompañada, estrategias sencillas, individuales o grupales, de planificación, redacción, revisión y edición." },
    "6.1.a": { corto: "Buscar y contrastar información", texto: "Localizar, seleccionar y contrastar información de distintas fuentes, incluidas las digitales, citándolas, iniciándose en la evaluación de su fiabilidad y recreándolas mediante la adaptación creativa de modelos dados." },
    "6.2.a": { corto: "Compartir una investigación", texto: "Compartir de manera creativa los resultados de un proceso de investigación sencillo, individual o grupal, sobre algún tema de interés personal o ecosocial, realizado de manera acompañada." },
    "6.3.a": { corto: "Uso crítico y seguro de las tecnologías", texto: "Adoptar hábitos sencillos de uso crítico, seguro, sostenible y saludable de las tecnologías digitales en relación con la búsqueda y la comunicación de la información." },
    "7.1.a": { corto: "Lectura autónoma e identidad lectora", texto: "Leer de manera autónoma textos de diversos autores y autoras ajustados a sus gustos e intereses, seleccionados de manera puntualmente acompañada, progresando en la construcción de su identidad lectora para conseguir que sea una fuente de placer." },
    "7.2.a": { corto: "Compartir la experiencia lectora", texto: "Compartir la experiencia de lectura, en soportes diversos, participando en comunidades lectoras en el ámbito escolar o local para conseguir disfrutar de la dimensión social de la lectura." },
    "8.1.a": { corto: "Textos literarios: géneros e interpretación", texto: "Escuchar y leer textos literarios adecuados a su edad, que recojan diversidad de autores y autoras, relacionándolos en función de los temas y de aspectos elementales de cada género literario, e interpretándolos, iniciándose en la valoración de los mismos y relacionándolos con otras manifestaciones artísticas o culturales de manera progresivamente autónoma." },
    "8.2.a": { corto: "Producir textos con intención literaria", texto: "Producir, de manera progresivamente autónoma, textos sencillos individuales o colectivos con intención literaria, reelaborando a partir de modelos dados y en distintos soportes y complementándolos con otros lenguajes artísticos." },
    "8.3.a": { corto: "Cultura popular andaluza", texto: "Conocer y crear textos literarios a partir de manifestaciones de la cultura popular andaluzas orales y escritas, tales como refranes, cantinelas y poemas." },
    "9.1.a": { corto: "Reflexión sobre la lengua (gramática, léxico, ortografía)", texto: "Formular generalizaciones sobre aspectos básicos del funcionamiento de la lengua de manera acompañada, utilizando la terminología elemental adecuada, formulando hipótesis y buscando contraejemplos, a partir de la observación, comparación y manipulación de palabras, enunciados y textos, en un proceso acompañado de producción o comprensión de textos en contextos significativos." },
    "9.2.a": { corto: "Revisar textos con reflexión metalingüística", texto: "Revisar los textos propios y ajenos y subsanar algunos problemas de comprensión lectora, de manera progresivamente autónoma, a partir de la reflexión metalingüística y usando la terminología básica adecuada." },
    "10.1.a": { corto: "Rechazo de usos discriminatorios", texto: "Rechazar los usos lingüísticos discriminatorios y los abusos de poder a través de la palabra identificados mediante la reflexión grupal acompañada sobre distintos aspectos, verbales y no verbales, de la comunicación, teniendo en cuenta una perspectiva de género." },
    "10.2.a": { corto: "Deliberación y gestión dialogada de conflictos", texto: "Iniciar, con la planificación y el acompañamiento necesarios, estrategias básicas para la deliberación argumentada y la gestión dialogada de conflictos, eligiendo soluciones entre varios modelos dados." },
  },
  mates: {
    "1.1.a": { corto: "Comprender el problema", texto: "Reconocer, interpretar e iniciarse en la comprensión de los problemas de la vida cotidiana a través de la reformulación de la pregunta, de forma verbal y gráfica, comprendiendo y describiendo mensajes verbales, escritos o visuales." },
    "1.2.a": { corto: "Representaciones matemáticas", texto: "Comenzar a elaborar y mostrar representaciones matemáticas que ayuden en la búsqueda y elección de estrategias y herramientas, incluidas las tecnológicas, para la resolución de una situación problematizada medioambiental o social, individualmente y cooperando entre iguales, comenzando a desarrollar una actitud de implicación." },
    "2.1.a": { corto: "Elegir y justificar estrategias", texto: "Comparar, comenzar a seleccionar y emplear entre diferentes estrategias para resolver un problema tomando decisiones, aplicándose en la resolución y justificando la estrategia seleccionada." },
    "2.2.a": { corto: "Obtener soluciones", texto: "Obtener posibles soluciones de un problema, seleccionando entre varias estrategias conocidas de forma autónoma, tanteando, realizando analogías y comenzando a descomponer en partes los problemas." },
    "2.3.a": { corto: "Comprobar las soluciones", texto: "Comprobar y demostrar la corrección matemática de las soluciones de un problema y su coherencia en el contexto planteado, revisando durante la resolución la respuesta." },
    "3.1.a": { corto: "Conjeturas y argumentación", texto: "Comenzar a formular conjeturas matemáticas sencillas, investigando patrones, propiedades y relaciones de forma guiada, desarrollando ideas con sentido, argumentando conclusiones y saber comunicarlo." },
    "3.2.a": { corto: "Plantear problemas", texto: "Plantear nuevos problemas sobre situaciones cotidianas que se resuelvan matemáticamente, proponiendo algunas ideas, planteando preguntas y argumentando conclusiones." },
    "4.1.a": { corto: "Pensamiento computacional", texto: "Comenzar a modelizar situaciones de la vida cotidiana, utilizando de forma pautada, principios básicos del pensamiento computacional, realizando procesos simples en formato digital y describiendo las tareas en pasos más simples en situaciones cotidianas." },
    "4.2.a": { corto: "Herramientas tecnológicas", texto: "Comenzar a emplear herramientas tecnológicas adecuadas en la investigación y resolución de problemas." },
    "5.1.a": { corto: "Conexiones entre ideas matemáticas", texto: "Comenzar a utilizar conexiones entre diferentes elementos matemáticos, movilizando conocimientos y experiencias propias, aplicando las matemáticas en otras áreas y contextos cotidianos." },
    "5.2.a": { corto: "Matemáticas, otras áreas y vida cotidiana", texto: "Comenzar a utilizar las conexiones entre las matemáticas, otras áreas y la vida cotidiana para resolver problemas en contextos de la información gráfica de diferentes medios e identificar su interrelación con las problemáticas medioambientales y sociales del entorno y de la Comunidad andaluza." },
    "6.1.a": { corto: "Lenguaje y vocabulario matemático", texto: "Comenzar a interpretar el lenguaje matemático sencillo presente en la vida cotidiana en diferentes formatos, adquiriendo vocabulario apropiado, utilizando este lenguaje para expresar ideas matemáticas, mostrando comprensión del mensaje." },
    "6.2.a": { corto: "Comunicar procesos matemáticos", texto: "Comenzar a comunicar en diferentes formatos las conjeturas y procesos matemáticos, utilizando lenguaje matemático adecuado, con el propósito de transmitir información matemática." },
    "7.1.a": { corto: "Emociones y autoconfianza", texto: "Identificar y autorregular las emociones propias, comenzando a reconocer algunas fortalezas y debilidades propias y desarrollando así la autoconfianza al abordar nuevos retos matemáticos, valorando y reconociendo la importancia del bagaje cultural andaluz relacionado con las matemáticas." },
    "7.2.a": { corto: "Perseverancia y error como aprendizaje", texto: "Identificar en uno mismo actitudes positivas, colaborativas, comenzando a desarrollar la crítica ante nuevos retos matemáticos tales como la perseverancia y la responsabilidad, valorando el error como una oportunidad de aprendizaje y superando la frustración, empleando una actitud participativa y creativa." },
    "8.1.a": { corto: "Trabajo colaborativo y convivencia", texto: "Participar, colaborar y ayudar respetuosa y responsable en el trabajo individual o colectivo, implicándose en retos matemáticos propuestos, comunicándose de forma efectiva, valorando la diversidad, mostrando empatía y estableciendo relaciones saludables basadas en el respeto, la igualdad y la resolución pacífica de conflictos, mostrando autocontrol y comenzando a promover situaciones de convivencia coeducativa." },
    "8.2.a": { corto: "Roles en equipo", texto: "Tomar iniciativas en el reparto de tareas, actuando en equipos heterogéneos con roles, asumiendo y respetando las responsabilidades individuales asignadas y empleando estrategias de trabajo en equipo sencillas, comunicando con destrezas de escucha activa y asertiva." },
  },
};


// Criterios para las pruebas ACS: los de 1.º de Primaria (primer
// ciclo, terminados en «.a»), nivel de la adaptación de la alumna. Solo
// se incluyen los que encajan con lo que evalúan sus pruebas.
const CE_CRITERIOS_ACS = {
  nivel: "1.º",
  lengua: {
    "2.1.a": { corto: "Comprensión oral (1.º)", texto: "Comprender el sentido de textos orales y multimodales sencillos, reconociendo las ideas principales y los mensajes explícitos." },
    "4.1.a": { corto: "Lectura: sentido global (1.º)", texto: "Leer textos escritos y multimodales adecuados a su desarrollo cognitivo, identificando el sentido global y la información relevante y movilizando de forma acompañada estrategias básicas de comprensión, para adquirir conocimiento." },
    "4.2.a": { corto: "Contenido y forma de textos sencillos (1.º)", texto: "Identificar, de manera acompañada, el contenido y aspectos formales y no formales elementales de textos escritos y multimodales sencillos." },
    "5.1.a": { corto: "Escritura según su etapa (1.º)", texto: "Producir textos escritos y multimodales sencillos y coherentes, desde las diferentes etapas del proceso evolutivo de la escritura, ajustándose a modelos dados." },
    "8.1.a": { corto: "Literatura infantil (1.º)", texto: "Escuchar e iniciar la lectura de textos orales y escritos de la literatura infantil, que recojan diversidad de autores y autoras, estableciendo de manera acompañada relaciones con otras manifestaciones artísticas o culturales. (Redacción resumida: consulta el BOJA.)" },
    "9.1.a": { corto: "Funcionamiento de la lengua (1.º)", texto: "Iniciarse en la reflexión sobre el funcionamiento de la lengua, prestando especial atención a la concordancia y a las relaciones de significado entre las palabras, a partir de la observación, comparación y manipulación de palabras, en un proceso acompañado de comprensión de textos en contextos significativos." },
  },
  mates: {
    "1.1.a": { corto: "Comprender la pregunta (1.º)", texto: "Comprender las preguntas planteadas a través de diferentes estrategias o herramientas y comenzar a percibir mensajes verbales y visuales." },
    "2.1.a": { corto: "Identificar una estrategia (1.º)", texto: "Identificar alguna estrategia a emplear para resolver un problema de forma guiada, mostrando interés en la resolución." },
    "2.2.a": { corto: "Soluciones manipulando (1.º)", texto: "Reconocer posibles soluciones de un problema, de forma guiada, siguiendo alguna estrategia básica de resolución, manipulando materiales." },
    "2.3.a": { corto: "Explicar la solución (1.º)", texto: "Reconocer y explicar posibles soluciones de un problema a partir de las preguntas previamente planteadas." },
    "3.1.a": { corto: "Relaciones y patrones (1.º)", texto: "Identificar conjeturas matemáticas sencillas, utilizando propiedades y relaciones sencillas de forma guiada, comenzando a explorar fenómenos." },
    "5.1.a": { corto: "Conexiones entre elementos matemáticos (1.º)", texto: "Identificar conexiones entre los diferentes elementos matemáticos, asociándolas a conocimientos y experiencias propias." },
    "6.1.a": { corto: "Lenguaje y vocabulario matemático (1.º)", texto: "Identificar el lenguaje matemático sencillo presente en la vida cotidiana, adquiriendo vocabulario específico básico." },
  },
};

// Criterios disponibles según la versión de la prueba.
function ceCriterios(area, version) {
  return version === "acs" ? CE_CRITERIOS_ACS[area] : CE_CRITERIOS[area];
}

// Contenidos provisionales: criterios de 5.º por eje hasta que se ajusten.
const CE_CRITERIOS_POR_EJE = {
  lengua: { cl: ["4.1.a"], co: ["2.1.a"], di: ["5.1.a"], or: ["9.1.a", "5.1.a"], gr: ["9.1.a"], vo: ["9.1.a"], tx: ["4.2.a"] },
  mates: { nu: ["6.1.a", "5.1.a"], ca: ["2.2.a", "2.3.a"], rp: ["1.1.a", "2.1.a", "2.3.a"], ge: ["6.1.a", "5.1.a"], me: ["5.1.a", "2.3.a"], ra: ["3.1.a", "6.2.a"], es: ["5.2.a", "6.1.a"] },
};
(function () {
  ["lengua", "mates"].forEach(function (area) {
    CE_PRUEBAS[area].forEach(function (p) {
      p.ordinaria.forEach(function (it) {
        if (!it.criterios) it.criterios = CE_CRITERIOS_POR_EJE[area][it.eje] || [];
      });
    });
  });
})();
