// ============================================================
// UDI Lengua 5º · 3º Trimestre · Bloque 1 (mini-SDA sa01+sa02+sa03):
//   sa01 · El lenguaje y las lenguas. El texto expositivo (lenguas-espana)
//   sa02 · Los determinantes (determinantes)
//   sa03 · El haiku (poesia)
// ============================================================

const UDI_L5_T3_BLOQUE1 = {
  id: "l5-t3-bloque1",
  area: "Lengua 5º · T3",
  titulo: "3º Trimestre · Bloque 1",
  curso: "5",
  bloque: "Lengua · El lenguaje y las lenguas + Los determinantes + El haiku",
  resumen: "Agrupa las 3 primeras mini-SDA del 3º trimestre con un examen combinado y un reto integrador.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],

  fases: [
    {
      id: "plan", label: "Plan de la UDI", tipo: "plan",
      sesiones: [
        { n: 1, titulo: "sa01 · El lenguaje y las lenguas de España", descripcion: "Lenguas cooficiales y variedades.", topicId: "lenguas-espana" },
        { n: 2, titulo: "sa01 · El texto expositivo", descripcion: "Explicar un tema de forma objetiva.", topicId: "lenguas-espana" },
        { n: 3, titulo: "sa02 · Los determinantes", descripcion: "Repaso y ampliación de clases de determinantes.", topicId: "determinantes" },
        { n: 4, titulo: "sa02 · Determinantes en el texto", descripcion: "Uso correcto al escribir.", topicId: "determinantes" },
        { n: 5, titulo: "sa03 · El haiku", descripcion: "Poema breve japonés de 3 versos.", topicId: "poesia" },
        { n: 6, titulo: "sa03 · Escribimos haikus", descripcion: "Medir versos y crear imágenes.", topicId: "poesia" },
        { n: 7, titulo: "Reto: un haiku de las lenguas de España", descripcion: "Producto final del bloque." },
        { n: 8, titulo: "Repaso y examen del bloque", descripcion: "Ficha de repaso y prueba de evaluación." },
      ],
    },
    {
      id: "fichas", label: "Fichas por bloque", tipo: "fichas",
      documentos: [
        { id: "ficha-sa01", label: "sa01 · El lenguaje y las lenguas", motor: "lengua-ficha", topicId: "lenguas-espana", count: 5 },
        { id: "ficha-sa02", label: "sa02 · Los determinantes", motor: "lengua-ficha", topicId: "determinantes", count: 6 },
        { id: "ficha-sa03", label: "sa03 · El haiku y la poesía", motor: "lengua-ficha", topicId: "poesia", count: 5 },
      ],
    },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    {
      id: "evaluacion", label: "Evaluación", tipo: "evaluacion",
      documentos: [
        { id: "repaso", label: "Ficha de repaso (bloque combinado)", motor: "lengua-examen", tipo: "repaso",
          topics: [{ topicId: "lenguas-espana", count: 3 }, { topicId: "determinantes", count: 3 }, { topicId: "poesia", count: 3 }] },
        { id: "examen", label: "Examen del bloque (combinado)", motor: "lengua-examen", tipo: "examen",
          topics: [{ topicId: "lenguas-espana", count: 4 }, { topicId: "determinantes", count: 4 }, { topicId: "poesia", count: 4 }] },
        { id: "explicacion", label: "Explicación y solucionario del bloque", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
          args: {
            id: "l5-t3-bloque1",
            titulo: "Guía del bloque: las lenguas, los determinantes y el haiku",
            subtitulo: "Documento de apoyo del Bloque 1 (3º trimestre).",
            teoria: [
              { heading: "El lenguaje y las lenguas de España", paragraphs: ["El lenguaje es la capacidad de comunicarnos; una lengua es un idioma concreto. En España, además del castellano, hay lenguas cooficiales (catalán, gallego, euskera). El texto expositivo explica un tema de forma clara y objetiva, sin dar opiniones."] },
              { heading: "Los determinantes", paragraphs: ["Los determinantes concretan al sustantivo: artículos, demostrativos, posesivos, numerales, indefinidos... Concuerdan con el nombre en género y número."] },
              { heading: "El haiku", paragraphs: ["El haiku es un poema breve de origen japonés, de tres versos (normalmente de 5, 7 y 5 sílabas), que capta una imagen o un instante, muchas veces de la naturaleza."] },
            ],
            comoCorregir: [
              { tipo: "Las lenguas / expositivo", explicacion: "Se distingue lengua de lenguaje y se reconocen los rasgos del texto expositivo.", ejemplo: "«El agua está formada por hidrógeno y oxígeno» → texto expositivo." },
              { tipo: "Los determinantes", explicacion: "Se localiza el determinante y su clase.", ejemplo: "«tres gatos» → «tres» es determinante numeral." },
              { tipo: "El haiku", explicacion: "Se comprueba la estructura de 3 versos y la imagen que transmite.", ejemplo: "3 versos sobre una hoja que cae → haiku." },
            ],
            variantesACS: {
              titulo: "Guía sencilla: las lenguas, los determinantes y el haiku",
              subtitulo: "Versión adaptada (ACS, nivel de 3º).",
              teoria: [
                { heading: "Las lenguas de España", paragraphs: ["En España se habla castellano y también otras lenguas: catalán, gallego y euskera."] },
                { heading: "Los determinantes", paragraphs: ["Los determinantes van delante del nombre: el, la, mi, dos."] },
                { heading: "El haiku", paragraphs: ["Un haiku es un poema muy corto, de 3 líneas, sobre la naturaleza."] },
              ],
              comoCorregir: [ { tipo: "Idea principal", explicacion: "Basta reconocer la idea básica.", ejemplo: "«mi» → determinante." } ],
            },
          } },
        { id: "reto", label: "Reto final del bloque + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
          args: {
            id: "l5-t3-bloque1",
            titulo: "Un haiku de las lenguas de España",
            consigna: [
              "Este reto reúne todo lo del bloque. Vas a preparar una mini-ficha sobre una lengua de España y acompañarla de un haiku.",
              "Usarás lo aprendido: escribirás un breve texto expositivo sobre una lengua de España, cuidarás los determinantes, y crearás un haiku (3 versos) inspirado en ella o en su tierra.",
            ],
            pasos: [
              "Elige una lengua de España (castellano, catalán, gallego o euskera) y busca 2 o 3 datos sobre ella.",
              "Escribe un texto expositivo breve con esos datos, de forma clara y objetiva.",
              "Revisa que los determinantes estén bien usados.",
              "Escribe un haiku de 3 versos inspirado en esa lengua o en el lugar donde se habla.",
              "Presenta tu mini-ficha y lee el haiku a la clase.",
            ],
            criterios: [
              { nombre: "Escribo un texto expositivo claro y objetivo", niveles: ["Explico el tema con datos, de forma clara y objetiva.", "Explico el tema, con alguna opinión colada.", "El texto es confuso.", "No escribo un texto expositivo."] },
              { nombre: "Uso correctamente los determinantes", niveles: ["Uso variados determinantes sin errores.", "Uso determinantes con pocos errores.", "Cometo bastantes errores.", "No uso bien los determinantes."] },
              { nombre: "Escribo un haiku de 3 versos con una imagen", niveles: ["Haiku de 3 versos que transmite una imagen.", "Haiku de 3 versos, con imagen floja.", "No respeto los 3 versos.", "No escribo el haiku."] },
            ],
            variantesACS: {
              titulo: "Un haiku de las lenguas de España",
              consigna: ["Vas a escribir 1 dato sobre una lengua de España y un poema muy corto de 3 líneas."],
              pasos: ["Elige una lengua de España y escribe 1 frase con un dato.", "Escribe un poema de 3 líneas sobre la naturaleza."],
              criterios: [
                { nombre: "Escribo un dato sobre una lengua de España", niveles: ["Escribo un dato claro.", "Escribo un dato con ayuda.", "Lo intento.", "No lo consigo."] },
                { nombre: "Escribo un poema de 3 líneas", niveles: ["Escribo las 3 líneas.", "Escribo 2 líneas.", "Escribo 1 línea.", "No lo consigo."] },
              ],
            },
          } },
      ],
    },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};

window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L5_T3_BLOQUE1.id] = UDI_L5_T3_BLOQUE1;
