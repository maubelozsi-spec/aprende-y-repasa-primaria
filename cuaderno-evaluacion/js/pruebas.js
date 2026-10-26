// ============================================================
// Cuaderno de evaluación · registro de contenidos de cada prueba.
//
// Una prueba por bloque y área: 3 bloques por trimestre, 9 en el
// curso (índices 1-9: T1 = 1-3, T2 = 4-6, T3 = 7-9). Cada prueba
// tiene la versión ordinaria y, si existe, la adaptada (ACS).
//
// Los bloques del 1º trimestre salen de los exámenes reales de 5.º C
// (curso 2026-2027): una entrada por pregunta, con el contenido que
// evalúa y su eje. Los del 2º y 3º trimestre son PROVISIONALES: se
// han sacado de las UDI de 5.º de esta app (js/udi-*5-t2/t3-*.js) y
// hay que ajustarlos cuando llegue cada examen (pestaña «Pruebas»).
//
// Los ejes agrupan contenidos que se repiten de un bloque a otro,
// para que la gráfica de avance compare lo comparable (la ortografía
// del bloque 1 con la del bloque 5) y no solo notas de exámenes con
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

// it(pregunta, contenido, eje): una fila del registro de una prueba.
function ceIt(p, c, e) {
  return { id: "p" + p, pregunta: String(p), contenido: c, eje: e };
}
// Provisional: sin número de pregunta (aún no hay examen).
function cePr(lista) {
  return lista.map(function (x, i) {
    return { id: "c" + (i + 1), pregunta: "", contenido: x[0], eje: x[1] };
  });
}

const CE_PRUEBAS = {
  lengua: [
    {
      n: 1, trimestre: 1, bloque: 1, fecha: "2026-10-14",
      titulo: "«El universo» · SdA 1, 2 y 3", fuente: "examen",
      ordinaria: [
        ceIt(1, "Texto predictivo: la predicción y sus razones con conectores", "cl"),
        ceIt(2, "Comprensión: causa, vocabulario en contexto y partes del texto", "cl"),
        ceIt(3, "Dictado (tildes)", "di"),
        ceIt(4, "Sinónimos y antónimos", "vo"),
        ceIt(5, "Enunciado oracional y no oracional", "gr"),
        ceIt(6, "Clases de enunciado según la intención del hablante", "gr"),
        ceIt(7, "Las interjecciones", "gr"),
        ceIt(8, "Sílaba tónica: agudas, llanas y esdrújulas", "or"),
        ceIt(9, "Texto literario y no literario; onomatopeyas; el cómic", "tx"),
        ceIt(10, "Comprensión oral: «La noche de las Perseidas»", "co"),
      ],
      acs: [
        ceIt(1, "Asociar dibujo y palabra", "cl"),
        ceIt(2, "Discriminar la palabra igual al modelo", "cl"),
        ceIt(3, "Escribir una palabra (letra a letra)", "di"),
        ceIt(4, "Contrarios", "vo"),
        ceIt(5, "Palabras que significan lo mismo", "vo"),
        ceIt(6, "Signos de interrogación y exclamación", "gr"),
        ceIt(7, "Interjecciones: ¿expresa alegría?", "gr"),
        ceIt(8, "Contar sílabas (conciencia silábica)", "or"),
        ceIt(9, "Cuento (inventado) o noticia (real)", "tx"),
        ceIt(10, "Dictado de palabras", "di"),
      ],
    },
    {
      n: 2, trimestre: 1, bloque: 2, fecha: "2026-11-12",
      titulo: "«El clima y el planeta» · SdA 4, 5 y 6", fuente: "examen",
      ordinaria: [
        ceIt(1, "Comprensión lectora del diario", "cl"),
        ceIt(2, "Partes del diario", "tx"),
        ceIt(3, "Dictado (tildes)", "di"),
        ceIt(4, "Lenguaje verbal oral, escrito y no verbal", "tx"),
        ceIt(5, "Análisis de formas verbales (raíz, desinencia, persona, número, tiempo, modo)", "gr"),
        ceIt(6, "Infinitivo y conjugación", "gr"),
        ceIt(7, "Modos verbales; pasar a pasado y futuro", "gr"),
        ceIt(8, "Prefijos y sufijos", "vo"),
        ceIt(9, "Reglas de acentuación", "or"),
        ceIt(10, "Comprensión oral: el cuento y sus partes", "co"),
      ],
      acs: [
        ceIt(1, "Asociar dibujo y palabra", "cl"),
        ceIt(2, "Comunicación sin palabras (no verbal)", "tx"),
        ceIt(3, "Localizar la fecha en un diario", "tx"),
        ceIt(4, "Asociar dibujo y acción (verbos)", "gr"),
        ceIt(5, "Lo hace uno o muchos (número del verbo)", "gr"),
        ceIt(6, "Ayer o mañana (pasado y futuro)", "gr"),
        ceIt(7, "Contrarios con des-", "vo"),
        ceIt(8, "Comprensión oral: ordenar el cuento", "co"),
        ceIt(9, "Reconocer la palabra con tilde", "or"),
        ceIt(10, "Dictado de palabras", "di"),
      ],
    },
    {
      n: 3, trimestre: 1, bloque: 3, fecha: "2026-12-10",
      titulo: "«El relieve de España y Europa» · SdA 7, 8 y 9", fuente: "examen",
      ordinaria: [
        ceIt(1, "Comprensión lectora del texto instructivo", "cl"),
        ceIt(2, "Partes del texto instructivo", "tx"),
        ceIt(3, "Dictado (tildes de los hiatos)", "di"),
        ceIt(4, "Infinitivo, imperativo y 1.ª persona del plural en instrucciones", "gr"),
        ceIt(5, "Formas no personales: infinitivo, gerundio y participio", "gr"),
        ceIt(6, "Formas personales y no personales, simples y compuestas", "gr"),
        ceIt(7, "Análisis de formas verbales", "gr"),
        ceIt(8, "Formación de verbos", "vo"),
        ceIt(9, "Diptongos e hiatos", "or"),
        ceIt(10, "Comprensión oral: la leyenda y sus partes", "co"),
      ],
      acs: [
        ceIt(1, "Asociar dibujo y palabra", "cl"),
        ceIt(2, "Comprensión: qué necesita una planta", "cl"),
        ceIt(3, "Ordenar los pasos de unas instrucciones", "tx"),
        ceIt(4, "Asociar dibujo y acción (verbos)", "gr"),
        ceIt(5, "Forma verbal de una o de dos palabras", "gr"),
        ceIt(6, "Ayer o mañana (pasado y futuro)", "gr"),
        ceIt(7, "Palabra y su verbo (formación de verbos)", "vo"),
        ceIt(8, "Cómo empieza una leyenda", "tx"),
        ceIt(9, "Dos vocales juntas", "or"),
        ceIt(10, "Dictado de palabras", "di"),
      ],
    },
    {
      n: 4, trimestre: 2, bloque: 1, fecha: "",
      titulo: "Argumentar, el sustantivo y el teatro (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Comprensión lectora", "cl"],
        ["El texto argumentativo", "tx"],
        ["Dictado", "di"],
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
      n: 5, trimestre: 2, bloque: 2, fecha: "",
      titulo: "Textos discontinuos, el adjetivo y la obra teatral (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Comprensión lectora", "cl"],
        ["Textos discontinuos, el anuncio y el cartel", "tx"],
        ["Dictado", "di"],
        ["El adjetivo", "gr"],
        ["Grados del adjetivo y concordancia", "gr"],
        ["Estructura de una obra teatral: actos y escenas", "tx"],
        ["Ortografía", "or"],
        ["Comprensión oral", "co"],
      ]),
      acs: [],
    },
    {
      n: 6, trimestre: 2, bloque: 3, fecha: "",
      titulo: "El reportaje, los determinantes y la poesía (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Comprensión lectora", "cl"],
        ["El reportaje", "tx"],
        ["Dictado", "di"],
        ["Los determinantes y sus clases", "gr"],
        ["La poesía: verso, estrofa y rima", "tx"],
        ["Recursos poéticos", "tx"],
        ["Ortografía", "or"],
        ["Comprensión oral", "co"],
      ]),
      acs: [],
    },
    {
      n: 7, trimestre: 3, bloque: 1, fecha: "",
      titulo: "Las lenguas de España, determinantes y el haiku (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Comprensión lectora", "cl"],
        ["El lenguaje y las lenguas de España", "tx"],
        ["El texto expositivo", "tx"],
        ["Dictado", "di"],
        ["Los determinantes en el texto", "gr"],
        ["El haiku", "tx"],
        ["Ortografía", "or"],
        ["Comprensión oral", "co"],
      ]),
      acs: [],
    },
    {
      n: 8, trimestre: 3, bloque: 2, fecha: "",
      titulo: "Argumentar, familias de palabras y figuras (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Comprensión lectora", "cl"],
        ["El texto argumentativo: tesis y argumentos", "tx"],
        ["Dictado", "di"],
        ["Familia de palabras y campo semántico", "vo"],
        ["Adverbios, preposiciones y conjunciones", "gr"],
        ["La comparación y la metáfora", "tx"],
        ["Ortografía", "or"],
        ["Comprensión oral", "co"],
      ]),
      acs: [],
    },
    {
      n: 9, trimestre: 3, bloque: 3, fecha: "",
      titulo: "La noticia, la oración y la hipérbole (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Comprensión lectora", "cl"],
        ["La noticia: partes y preguntas", "tx"],
        ["Dictado", "di"],
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
      n: 1, trimestre: 1, bloque: 1, fecha: "2026-10-14",
      titulo: "«El universo» · SdA 1, 2 y 3: números grandes y operaciones", fuente: "examen",
      ordinaria: [
        ceIt(1, "Leer, escribir y descomponer números de 6 cifras; valor de una cifra", "nu"),
        ceIt(2, "Comparar y ordenar números", "nu"),
        ceIt(3, "Redondear a las UM, DM y CM", "nu"),
        ceIt(4, "Aproximar y elegir la mejor aproximación", "nu"),
        ceIt(5, "Problema de sumar y restar", "rp"),
        ceIt(6, "Problema de dividir", "rp"),
        ceIt(7, "Problema de multiplicar", "rp"),
        ceIt(8, "Jerarquía de las operaciones", "ca"),
        ceIt(9, "Propiedades: conmutativa, asociativa y distributiva", "ca"),
        ceIt(10, "Operaciones (+, −, ×, :) y prueba de la división", "ca"),
      ],
      acs: [
        ceIt(1, "Contar y escribir el número (hasta 10)", "nu"),
        ceIt(2, "Serie numérica del 1 al 10", "nu"),
        ceIt(3, "Número mayor de una pareja", "nu"),
        ceIt(4, "Número menor de una pareja", "nu"),
        ceIt(5, "Decenas y unidades", "nu"),
        ceIt(6, "Aproximar a la decena en la recta", "nu"),
        ceIt(7, "Sumas sencillas", "ca"),
        ceIt(8, "Restas sencillas", "ca"),
        ceIt(9, "Problema de sumar", "rp"),
        ceIt(10, "Problema de restar", "rp"),
      ],
    },
    {
      n: 2, trimestre: 1, bloque: 2, fecha: "2026-11-12",
      titulo: "SdA 5 «¡Las fiestas del pueblo!»: múltiplos y divisores", fuente: "examen",
      ordinaria: [
        ceIt(1, "Hallar todos los divisores; número primo", "nu"),
        ceIt(2, "Números primos y compuestos", "nu"),
        ceIt(3, "Múltiplos de un número", "nu"),
        ceIt(4, "Múltiplos comunes", "nu"),
        ceIt(5, "Relación entre múltiplo y divisor", "nu"),
        ceIt(6, "Problema de repartir en grupos iguales", "rp"),
        ceIt(7, "Problema «¿cuándo vuelven a coincidir?»", "rp"),
        ceIt(8, "Adivinar un número con pistas", "rp"),
        ceIt(9, "Verdadero o falso; divisibilidad entre 3", "ra"),
        ceIt(10, "Operaciones y «¿es divisor?» con la división", "ca"),
      ],
      acs: [
        ceIt(1, "Contar y escribir números (hasta 12)", "nu"),
        ceIt(2, "Hacer grupos de 3", "nu"),
        ceIt(3, "Repartir en partes iguales", "ca"),
        ceIt(4, "Reparto: ¿sobra alguno?", "ca"),
        ceIt(5, "Números pares", "nu"),
        ceIt(6, "Contar de 2 en 2", "nu"),
        ceIt(7, "Contar de 10 en 10", "nu"),
        ceIt(8, "Filas y total (iniciación a la multiplicación)", "ca"),
        ceIt(9, "Problema de suma repetida (3 × 2)", "rp"),
        ceIt(10, "Problema de suma repetida (2 × 5)", "rp"),
      ],
    },
    {
      n: 3, trimestre: 1, bloque: 3, fecha: "2026-12-10",
      titulo: "SdA 6 «Las constelaciones» y SdA 7 «España en coordenadas»", fuente: "examen",
      ordinaria: [
        ceIt(1, "Medir ángulos con el transportador", "me"),
        ceIt(2, "Clasificar y dibujar ángulos", "ge"),
        ceIt(3, "Ángulos adyacentes y opuestos por el vértice", "ge"),
        ceIt(4, "Suma de los ángulos de un triángulo y un cuadrilátero", "ge"),
        ceIt(5, "Coordenadas de un punto", "ge"),
        ceIt(6, "Simetría y traslación", "ge"),
        ceIt(7, "Reconocer movimientos: traslación, simetría y giro", "ge"),
        ceIt(8, "Problema con una sola expresión (y dato que sobra)", "rp"),
        ceIt(9, "Verdadero o falso: ángulos y movimientos", "ra"),
        ceIt(10, "Operaciones y «¿es divisor?» con la división", "ca"),
      ],
      acs: [
        ceIt(1, "Reconocer la línea curva", "ge"),
        ceIt(2, "Esquina recta (ángulo recto)", "ge"),
        ceIt(3, "Esquina más abierta (comparar ángulos)", "ge"),
        ceIt(4, "Reconocer el círculo", "ge"),
        ceIt(5, "Lados y esquinas del triángulo", "ge"),
        ceIt(6, "Dirección: hacia la derecha", "ge"),
        ceIt(7, "Simetría: dos mitades iguales", "ge"),
        ceIt(8, "Cuartos de vuelta (giros)", "ge"),
        ceIt(9, "Problema de sumar", "rp"),
        ceIt(10, "Problema de restar (dinero)", "rp"),
      ],
    },
    {
      n: 4, trimestre: 2, bloque: 1, fecha: "",
      titulo: "Las fracciones (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Qué es una fracción: leer y representar", "nu"],
        ["Fracciones equivalentes", "nu"],
        ["Comparar y ordenar fracciones", "nu"],
        ["Fracción de una cantidad", "ca"],
        ["Problemas con fracciones", "rp"],
        ["Operaciones con naturales", "ca"],
      ]),
      acs: [],
    },
    {
      n: 5, trimestre: 2, bloque: 2, fecha: "",
      titulo: "Operaciones con fracciones (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Suma de fracciones", "ca"],
        ["Resta de fracciones", "ca"],
        ["Fracción de una cantidad", "ca"],
        ["Operaciones combinadas con fracciones", "ca"],
        ["Problemas con fracciones", "rp"],
      ]),
      acs: [],
    },
    {
      n: 6, trimestre: 2, bloque: 3, fecha: "",
      titulo: "Decimales y unidades de medida (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Los números decimales: leer y descomponer", "nu"],
        ["Comparar y ordenar decimales", "nu"],
        ["Unidades de longitud y capacidad", "me"],
        ["Unidades de masa y superficie", "me"],
        ["Problemas de medida", "rp"],
      ]),
      acs: [],
    },
    {
      n: 7, trimestre: 3, bloque: 1, fecha: "",
      titulo: "Suma y resta de decimales; perímetro y área (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Suma de números decimales", "ca"],
        ["Resta de números decimales", "ca"],
        ["Perímetro de polígonos", "me"],
        ["Área de polígonos y por cuadrículas", "me"],
        ["Problemas con decimales", "rp"],
      ]),
      acs: [],
    },
    {
      n: 8, trimestre: 3, bloque: 2, fecha: "",
      titulo: "Multiplicar y dividir decimales; cuerpos geométricos (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Multiplicar decimales", "ca"],
        ["Dividir decimales", "ca"],
        ["Los cuerpos geométricos", "ge"],
        ["El desarrollo plano de los cuerpos", "ge"],
        ["Problemas de compra con decimales", "rp"],
      ]),
      acs: [],
    },
    {
      n: 9, trimestre: 3, bloque: 3, fecha: "",
      titulo: "Porcentajes y unidades de tiempo (provisional)", fuente: "provisional",
      ordinaria: cePr([
        ["Qué es un porcentaje", "nu"],
        ["Aumentos y disminuciones porcentuales", "ca"],
        ["Las unidades de tiempo", "me"],
        ["Cambio de unidades de tiempo", "me"],
        ["Problemas con porcentajes y tiempo", "rp"],
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
// Vinculación con los exámenes: propuesta razonada por contenido, a
// revisar por el docente (se cambia en la pestaña «Pruebas»). Los
// exámenes no evalúan todos los criterios: los de expresión oral
// (LCL 3.x), investigación (6.x), lectura autónoma (7.x), convivencia
// (10.x) o los socioafectivos de Matemáticas (7.x, 8.x) necesitan otros
// instrumentos (observación, reto final, rúbricas).
//
// Las pruebas ACS no se vinculan a criterios de 5.º: el alumnado con
// ACS se evalúa con los criterios del nivel de su adaptación.
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

// Vinculación por eje (lo habitual) y excepciones por pregunta.
const CE_CRITERIOS_POR_EJE = {
  lengua: { cl: ["4.1.a"], co: ["2.1.a"], di: ["5.1.a"], or: ["9.1.a", "5.1.a"], gr: ["9.1.a"], vo: ["9.1.a"], tx: ["4.2.a"] },
  mates: { nu: ["6.1.a", "5.1.a"], ca: ["2.2.a", "2.3.a"], rp: ["1.1.a", "2.1.a", "2.3.a"], ge: ["6.1.a", "5.1.a"], me: ["5.1.a", "2.3.a"], ra: ["3.1.a", "6.2.a"], es: ["5.2.a", "6.1.a"] },
};
const CE_CRITERIOS_EXCEPCIONES = {
  "lengua-1-p2": ["4.1.a", "4.2.a"],   // causa, vocabulario en contexto y estructura
  "lengua-1-p9": ["8.1.a", "4.2.a"],   // literario / no literario, el cómic
  "lengua-1-p10": ["2.1.a"],
  "lengua-2-p4": ["2.1.a", "4.2.a"],   // lenguaje verbal y no verbal
  "lengua-2-p10": ["2.1.a", "8.1.a"],  // el cuento escuchado
  "lengua-3-p10": ["2.1.a", "8.1.a"],  // la leyenda escuchada
  "mates-2-p8": ["2.2.a", "3.1.a"],    // adivinar un número con pistas
  "mates-3-p8": ["1.1.a", "2.1.a", "6.2.a"], // una sola expresión y dato que sobra
};

(function () {
  ["lengua", "mates"].forEach(function (area) {
    CE_PRUEBAS[area].forEach(function (p) {
      p.ordinaria.forEach(function (it) {
        if (it.criterios) return;
        it.criterios = CE_CRITERIOS_EXCEPCIONES[area + "-" + p.n + "-" + it.id] || CE_CRITERIOS_POR_EJE[area][it.eje] || [];
      });
      (p.acs || []).forEach(function (it) { if (!it.criterios) it.criterios = []; });
    });
  });
})();
