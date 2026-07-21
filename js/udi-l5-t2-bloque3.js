// ============================================================
// UDI Lengua 5º · 2º Trimestre · Bloque 3 (mini-SDA sa07+sa08+sa09):
//   sa07 · El reportaje (comunicacion-textos)
//   sa08 · Los determinantes (determinantes)
//   sa09 · La poesía (poesia)
// ============================================================

const UDI_L5_T2_BLOQUE3 = {
  id: "l5-t2-bloque3",
  area: "Lengua 5º · T2",
  titulo: "2º Trimestre · Bloque 3",
  curso: "5",
  bloque: "Lengua · El reportaje + Los determinantes + La poesía",
  resumen: "Agrupa las mini-SDA 7-9 del 2º trimestre con un examen combinado y un reto integrador.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],

  fases: [
    {
      id: "plan", label: "Plan de la UDI", tipo: "plan",
      sesiones: [
        { n: 1, titulo: "sa07 · El reportaje", descripcion: "Qué es y en qué se diferencia de la noticia.", topicId: "comunicacion-textos" },
        { n: 2, titulo: "sa07 · Cómo se hace un reportaje", descripcion: "Fuentes, entrevistas y estructura.", topicId: "comunicacion-textos" },
        { n: 3, titulo: "sa08 · Los determinantes", descripcion: "Artículos, demostrativos, posesivos, numerales...", topicId: "determinantes" },
        { n: 4, titulo: "sa08 · Clases de determinantes", descripcion: "Identificar cada clase.", topicId: "determinantes" },
        { n: 5, titulo: "sa09 · La poesía", descripcion: "Verso, estrofa y rima.", topicId: "poesia" },
        { n: 6, titulo: "sa09 · Recursos poéticos", descripcion: "Comparación, personificación...", topicId: "poesia" },
        { n: 7, titulo: "Reto: nuestra revista de clase", descripcion: "Producto final del bloque." },
        { n: 8, titulo: "Repaso y examen del bloque", descripcion: "Ficha de repaso y prueba de evaluación." },
      ],
    },
    {
      id: "fichas", label: "Fichas por bloque", tipo: "fichas",
      documentos: [
        { id: "ficha-sa07", label: "sa07 · El reportaje", motor: "lengua-ficha", topicId: "comunicacion-textos", count: 5 },
        { id: "ficha-sa08", label: "sa08 · Los determinantes", motor: "lengua-ficha", topicId: "determinantes", count: 6 },
        { id: "ficha-sa09", label: "sa09 · La poesía", motor: "lengua-ficha", topicId: "poesia", count: 5 },
      ],
    },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    {
      id: "evaluacion", label: "Evaluación", tipo: "evaluacion",
      documentos: [
        { id: "repaso", label: "Ficha de repaso (bloque combinado)", motor: "lengua-examen", tipo: "repaso",
          topics: [{ topicId: "comunicacion-textos", count: 3 }, { topicId: "determinantes", count: 3 }, { topicId: "poesia", count: 3 }] },
        { id: "examen", label: "Examen del bloque (combinado)", motor: "lengua-examen", tipo: "examen",
          topics: [{ topicId: "comunicacion-textos", count: 4 }, { topicId: "determinantes", count: 4 }, { topicId: "poesia", count: 4 }] },
        { id: "explicacion", label: "Explicación y solucionario del bloque", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
          args: {
            id: "l5-t2-bloque3",
            titulo: "Guía del bloque: el reportaje, los determinantes y la poesía",
            subtitulo: "Documento de apoyo del Bloque 3 (2º trimestre).",
            teoria: [
              { heading: "El reportaje", paragraphs: ["El reportaje profundiza en un tema con más detalle que la noticia: incluye datos, entrevistas y varias fuentes de información. Es un texto informativo pero más amplio y elaborado."] },
              { heading: "Los determinantes", paragraphs: ["Los determinantes acompañan al sustantivo y lo concretan. Hay artículos (el, la, unos), demostrativos (este, ese, aquel), posesivos (mi, tu, su), numerales (dos, primer), indefinidos (algún, varios)..."] },
              { heading: "La poesía", paragraphs: ["La poesía se escribe en verso (cada línea) y estrofa (grupo de versos), y suele tener rima. Utiliza recursos como la comparación o la personificación para crear belleza."] },
            ],
            comoCorregir: [
              { tipo: "El reportaje", explicacion: "Se distingue el reportaje de otros textos y se reconocen sus rasgos (fuentes, entrevistas).", ejemplo: "«incluye entrevistas a varios expertos» → rasgo de reportaje." },
              { tipo: "Los determinantes", explicacion: "Se localiza el determinante y se indica su clase.", ejemplo: "«mis libros» → «mis» es determinante posesivo." },
              { tipo: "La poesía", explicacion: "Se reconocen verso, estrofa, rima o el recurso poético.", ejemplo: "«el sol sonreía» → personificación." },
            ],
            variantesACS: {
              titulo: "Guía sencilla: reportaje, determinantes y poesía",
              subtitulo: "Versión adaptada (ACS, nivel de 3º).",
              teoria: [
                { heading: "El reportaje", paragraphs: ["Un reportaje cuenta un tema con muchos detalles y entrevistas."] },
                { heading: "Los determinantes", paragraphs: ["Los determinantes van delante del nombre: el, la, mi, este, dos."] },
                { heading: "La poesía", paragraphs: ["Un poema tiene versos (líneas) y muchas veces rima."] },
              ],
              comoCorregir: [
                { tipo: "Idea principal", explicacion: "Basta con reconocer la idea básica.", ejemplo: "«el» → es un determinante (artículo)."} ],
            },
          } },
        { id: "reto", label: "Reto final del bloque + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
          args: {
            id: "l5-t2-bloque3",
            titulo: "Nuestra revista de clase",
            consigna: [
              "Este reto reúne todo lo del bloque. Entre todos vais a crear una pequeña revista de clase con dos secciones.",
              "Usaréis lo aprendido: escribiréis un reportaje sobre un tema del cole o del barrio y un poema, y en ambos cuidaréis el uso de los determinantes.",
            ],
            pasos: [
              "Elegid un tema para el reportaje (por ejemplo, «el recreo» o «nuestro huerto»).",
              "Escribid el reportaje incluyendo algún dato y una pequeña entrevista.",
              "Escribid un poema breve (al menos una estrofa con rima) sobre el mismo tema u otro que os guste.",
              "Revisad que los determinantes (el, mi, este, dos...) estén bien usados.",
              "Montad la revista juntando los textos y añadiendo un título y alguna imagen.",
            ],
            criterios: [
              { nombre: "Escribo un reportaje con datos o entrevista", niveles: ["El reportaje incluye datos y una entrevista.", "Incluye datos o entrevista.", "Es más una noticia breve que un reportaje.", "No escribo un reportaje."] },
              { nombre: "Escribo un poema con verso, estrofa y algo de rima", niveles: ["El poema tiene versos, una estrofa y rima.", "Tiene versos y estrofa, con poca rima.", "Son frases sin forma de poema.", "No escribo un poema."] },
              { nombre: "Uso correctamente los determinantes", niveles: ["Uso variados determinantes sin errores.", "Uso determinantes con pocos errores.", "Cometo bastantes errores.", "No uso bien los determinantes."] },
            ],
            variantesACS: {
              titulo: "Nuestra revista de clase",
              consigna: ["Vas a escribir 2 frases sobre un tema del cole y un poema muy corto (2 versos que rimen)."],
              pasos: ["Escribe 2 frases contando algo del cole.", "Escribe 2 versos cortos que rimen.", "Subraya los determinantes que uses (el, la, mi...)."],
              criterios: [
                { nombre: "Escribo unas frases informando de algo", niveles: ["Escribo 2 frases claras.", "Escribo 1 frase.", "Escribo con ayuda.", "No lo consigo."] },
                { nombre: "Escribo 2 versos que rimen", niveles: ["Los 2 versos riman.", "Escribo 2 versos, sin rima.", "Escribo 1 verso.", "No lo consigo."] },
              ],
            },
          } },
      ],
    },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};

window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L5_T2_BLOQUE3.id] = UDI_L5_T2_BLOQUE3;
