// ============================================================
// UDI Lengua 5º · 1º Trimestre · Unidad 2 (SM u2): agrupa las 3 SDA
//   · El cuento y la novela. La estructura de la narración (narrativa)
//   · El verbo y su conjugación (verbo)
//   · Los prefijos y sufijos / formación de palabras (formacion-palabras)
// Un examen combinado y un reto integrador único.
// ============================================================

const UDI_L5_T1_BLOQUE2 = {
  id: "l5-t1-bloque2",
  area: "Lengua 5º · T1",
  titulo: "1º Trimestre · Bloque 2",
  curso: "5",
  bloque: "Lengua · El cuento y la narración + El verbo + Los prefijos y sufijos",
  resumen: "Agrupa las 3 SDA de la unidad 2 (SM) con un examen combinado y un reto integrador.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],

  fases: [
    {
      id: "plan", label: "Plan de la UDI", tipo: "plan",
      sesiones: [
        { n: 1, titulo: "El cuento y la novela", descripcion: "Qué son y en qué se diferencian.", topicId: "narrativa" },
        { n: 2, titulo: "La estructura de la narración", descripcion: "Inicio, nudo y desenlace.", topicId: "narrativa" },
        { n: 3, titulo: "El verbo y su conjugación", descripcion: "La acción, la persona y el número.", topicId: "verbo" },
        { n: 4, titulo: "Formas verbales", descripcion: "Reconocer y usar bien los verbos.", topicId: "verbo" },
        { n: 5, titulo: "Los prefijos y sufijos", descripcion: "Formar palabras nuevas.", topicId: "formacion-palabras" },
        { n: 6, titulo: "Familias de palabras", descripcion: "Palabras con la misma raíz.", topicId: "formacion-palabras" },
        { n: 7, titulo: "Reto: escribimos y contamos un cuento", descripcion: "Producto final de la unidad." },
        { n: 8, titulo: "Repaso y examen de la unidad", descripcion: "Ficha de repaso y prueba de evaluación." },
      ],
    },
    {
      id: "fichas", label: "Fichas por bloque", tipo: "fichas",
      documentos: [
        { id: "ficha-narrativa", label: "El cuento y la narración", motor: "lengua-ficha", topicId: "narrativa", count: 5 },
        { id: "ficha-verbo", label: "El verbo y su conjugación", motor: "lengua-ficha", topicId: "verbo", count: 6 },
        { id: "ficha-formacion", label: "Prefijos, sufijos y formación de palabras", motor: "lengua-ficha", topicId: "formacion-palabras", count: 5 },
      ],
    },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    {
      id: "evaluacion", label: "Evaluación", tipo: "evaluacion",
      documentos: [
        { id: "repaso", label: "Ficha de repaso (unidad combinada)", motor: "lengua-examen", tipo: "repaso",
          topics: [{ topicId: "narrativa", count: 3 }, { topicId: "verbo", count: 3 }, { topicId: "formacion-palabras", count: 3 }] },
        { id: "examen", label: "Examen de la unidad (combinado)", motor: "lengua-examen", tipo: "examen",
          topics: [{ topicId: "narrativa", count: 4 }, { topicId: "verbo", count: 4 }, { topicId: "formacion-palabras", count: 4 }] },
        { id: "explicacion", label: "Explicación y solucionario de la unidad", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
          args: {
            id: "l5-t1-bloque2",
            titulo: "Guía de la unidad: la narración, el verbo y la formación de palabras",
            subtitulo: "Documento de apoyo de la Unidad 2 (1º trimestre).",
            teoria: [
              { heading: "El cuento y la narración", paragraphs: ["El cuento es un relato breve; la novela es más larga y con más personajes. Ambos se organizan en inicio (se presentan personajes y lugar), nudo (surge el conflicto) y desenlace (se resuelve)."] },
              { heading: "El verbo y su conjugación", paragraphs: ["El verbo expresa acciones, estados o procesos. Cambia según la persona (yo, tú, él...), el número (singular o plural) y el tiempo (presente, pasado, futuro)."] },
              { heading: "Los prefijos y sufijos", paragraphs: ["Las palabras se forman a partir de una raíz. Los prefijos se colocan delante (des-hacer, re-leer) y los sufijos detrás (pan-adero, cariñ-oso). Una familia de palabras comparte la misma raíz."] },
            ],
            comoCorregir: [
              { tipo: "La narración", explicacion: "Se reconoce a qué parte de la estructura pertenece cada momento del relato.", ejemplo: "«Y todos vivieron felices» → desenlace." },
              { tipo: "El verbo", explicacion: "Se comprueba la persona, el número y el tiempo del verbo.", ejemplo: "«corríamos» → 1.ª persona del plural, pretérito imperfecto." },
              { tipo: "Prefijos y sufijos", explicacion: "Se identifica el prefijo o el sufijo y la palabra de la que deriva.", ejemplo: "«deshacer» → prefijo «des-» + «hacer»." },
            ],
            variantesACS: {
              titulo: "Guía sencilla: cuento, verbo y palabras",
              subtitulo: "Versión adaptada (ACS, nivel de 3º).",
              teoria: [
                { heading: "El cuento", paragraphs: ["Un cuento tiene principio, medio y final."] },
                { heading: "El verbo", paragraphs: ["El verbo es la palabra que dice la acción: correr, comer, saltar."] },
                { heading: "Prefijos y sufijos", paragraphs: ["Añadiendo trozos a una palabra se hacen palabras nuevas: de «flor», florero y florista."] },
              ],
              comoCorregir: [ { tipo: "Idea principal", explicacion: "Basta con reconocer la idea básica.", ejemplo: "«saltó» → es un verbo (acción)." } ],
            },
          } },
        { id: "reto", label: "Reto final de la unidad + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
          args: {
            id: "l5-t1-bloque2",
            titulo: "Escribimos y contamos un cuento",
            consigna: [
              "Este reto reúne todo lo de la unidad. Vas a escribir un cuento breve y luego lo contarás a la clase.",
              "En él usarás lo aprendido: cuidarás la estructura de la narración (inicio, nudo y desenlace), emplearás bien los verbos, y enriquecerás el vocabulario con palabras derivadas (prefijos y sufijos).",
            ],
            pasos: [
              "Piensa un personaje, un lugar y un problema para tu cuento.",
              "Escribe el inicio, el nudo y el desenlace.",
              "Revisa que los verbos estén en el tiempo adecuado (normalmente en pasado).",
              "Incluye alguna palabra formada con prefijo o sufijo (por ejemplo: deshacer, panadería).",
              "Cuéntalo a la clase con buena entonación.",
            ],
            criterios: [
              { nombre: "Mi cuento tiene inicio, nudo y desenlace", niveles: ["Las tres partes están claras y bien enlazadas.", "Están las tres partes, aunque poco diferenciadas.", "Falta alguna parte.", "Mi cuento no sigue la estructura de la narración."] },
              { nombre: "Uso los verbos con el tiempo y la persona correctos", niveles: ["Los verbos son correctos en todo el cuento.", "La mayoría son correctos.", "Cometo bastantes errores.", "No uso bien los verbos."] },
              { nombre: "Enriquezco el vocabulario con palabras derivadas", niveles: ["Uso varias palabras con prefijo o sufijo.", "Uso alguna palabra derivada.", "Lo intento, sin lograrlo.", "No uso palabras derivadas."] },
            ],
            variantesACS: {
              titulo: "Escribimos y contamos un cuento",
              consigna: ["Vas a inventar un cuento muy corto (2 o 3 frases) y contarlo a la clase."],
              pasos: ["Piensa un personaje y qué le pasa.", "Escribe el principio, el medio y el final en pocas frases.", "Cuéntalo en voz alta."],
              criterios: [
                { nombre: "Mi cuento tiene principio, medio y final", niveles: ["Se entienden las tres partes.", "Se entienden dos partes.", "Solo una parte, con ayuda.", "No consigo escribir el cuento."] },
                { nombre: "Cuento mi cuento en voz alta", niveles: ["Lo cuento con voz clara.", "Lo cuento, aunque bajo.", "Lo cuento con ayuda.", "No consigo contarlo."] },
              ],
            },
          } },
      ],
    },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};

window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L5_T1_BLOQUE2.id] = UDI_L5_T1_BLOQUE2;
