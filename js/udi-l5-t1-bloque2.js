// ============================================================
// UDI Lengua 5º · 1º Trimestre · Bloque 2 (mini-SDA sa04+sa05+sa06):
//   sa04 · La comunicación (comunicacion-textos)
//   sa05 · El verbo (verbo)
//   sa06 · El cuento y la novela. La estructura de la narración (narrativa)
// Un examen combinado y un reto integrador único.
// ============================================================

const UDI_L5_T1_BLOQUE2 = {
  id: "l5-t1-bloque2",
  area: "Lengua 5º · T1",
  titulo: "1º Trimestre · Bloque 2",
  curso: "5",
  bloque: "Lengua · La comunicación + El verbo + El cuento y la narración",
  resumen: "Agrupa las mini-SDA 4-6 del 1º trimestre con un examen combinado y un reto integrador.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],

  fases: [
    {
      id: "plan", label: "Plan de la UDI", tipo: "plan",
      sesiones: [
        { n: 1, titulo: "sa04 · Los elementos de la comunicación", descripcion: "Emisor, receptor, mensaje, canal, código y contexto.", topicId: "comunicacion-textos" },
        { n: 2, titulo: "sa04 · Lenguaje verbal y no verbal. Tipos de texto", descripcion: "Distinguir formas de comunicarnos y clases de texto.", topicId: "comunicacion-textos" },
        { n: 3, titulo: "sa05 · El verbo: la acción y la persona", descripcion: "Qué es un verbo y cómo cambia según quién realiza la acción.", topicId: "verbo" },
        { n: 4, titulo: "sa05 · Número, tiempo y modo del verbo", descripcion: "Cómo varía el verbo.", topicId: "verbo" },
        { n: 5, titulo: "sa06 · El cuento y la novela", descripcion: "Qué son y en qué se diferencian.", topicId: "narrativa" },
        { n: 6, titulo: "sa06 · La estructura de la narración", descripcion: "Inicio, nudo y desenlace.", topicId: "narrativa" },
        { n: 7, titulo: "Reto: escribimos y contamos un cuento", descripcion: "Producto final del bloque." },
        { n: 8, titulo: "Repaso y examen del bloque", descripcion: "Ficha de repaso y prueba de evaluación." },
      ],
    },
    {
      id: "fichas", label: "Fichas por bloque", tipo: "fichas",
      documentos: [
        { id: "ficha-sa04", label: "sa04 · La comunicación", motor: "lengua-ficha", topicId: "comunicacion-textos", count: 5 },
        { id: "ficha-sa05", label: "sa05 · El verbo", motor: "lengua-ficha", topicId: "verbo", count: 6 },
        { id: "ficha-sa06", label: "sa06 · La narración", motor: "lengua-ficha", topicId: "narrativa", count: 5 },
      ],
    },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    {
      id: "evaluacion", label: "Evaluación", tipo: "evaluacion",
      documentos: [
        { id: "repaso", label: "Ficha de repaso (bloque combinado)", motor: "lengua-examen", tipo: "repaso",
          topics: [{ topicId: "comunicacion-textos", count: 3 }, { topicId: "verbo", count: 3 }, { topicId: "narrativa", count: 3 }] },
        { id: "examen", label: "Examen del bloque (combinado)", motor: "lengua-examen", tipo: "examen",
          topics: [{ topicId: "comunicacion-textos", count: 4 }, { topicId: "verbo", count: 4 }, { topicId: "narrativa", count: 4 }] },
        { id: "explicacion", label: "Explicación y solucionario del bloque", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
          args: {
            id: "l5-t1-bloque2",
            titulo: "Guía del bloque: comunicación, verbo y narración",
            subtitulo: "Documento de apoyo del Bloque 2 (1º trimestre) — para trabajar en clase o repasar en casa.",
            teoria: [
              { heading: "La comunicación", paragraphs: [
                "En toda comunicación hay un emisor (quien envía el mensaje), un receptor (quien lo recibe), un mensaje, un canal (el medio), un código (el idioma o los signos) y un contexto (la situación).",
                "El lenguaje puede ser verbal (con palabras, habladas o escritas) o no verbal (gestos, señales, imágenes).",
              ] },
              { heading: "El verbo", paragraphs: [
                "El verbo expresa acciones, estados o procesos. Cambia según la persona (yo, tú, él...), el número (singular o plural), el tiempo (presente, pasado, futuro) y el modo.",
              ] },
              { heading: "La narración", paragraphs: [
                "El cuento es un relato breve; la novela es más larga y con más personajes. Ambos se organizan en inicio (se presentan personajes y lugar), nudo (surge el conflicto) y desenlace (se resuelve).",
              ] },
            ],
            comoCorregir: [
              { tipo: "La comunicación", explicacion: "Se identifica el elemento (emisor, receptor, canal...) o si el lenguaje es verbal o no verbal.", ejemplo: "«Un semáforo en rojo» → lenguaje no verbal." },
              { tipo: "El verbo", explicacion: "Se comprueba la persona, el número y el tiempo del verbo.", ejemplo: "«corríamos» → 1.ª persona del plural, pretérito imperfecto." },
              { tipo: "La narración", explicacion: "Se reconoce a qué parte de la estructura pertenece cada momento del relato.", ejemplo: "«Y todos vivieron felices» → desenlace." },
            ],
            variantesACS: {
              titulo: "Guía sencilla: comunicación, verbo y cuento",
              subtitulo: "Versión adaptada (ACS, nivel de 3º).",
              teoria: [
                { heading: "La comunicación", paragraphs: ["Comunicarse es enviar un mensaje. Quien lo envía es el emisor y quien lo recibe es el receptor. Con palabras es lenguaje verbal; con gestos o señales, no verbal."] },
                { heading: "El verbo", paragraphs: ["El verbo es la palabra que dice la acción: correr, comer, saltar. Cambia si la acción es de ahora (presente), de antes (pasado) o de después (futuro)."] },
                { heading: "El cuento", paragraphs: ["Un cuento tiene principio, medio y final."] },
              ],
              comoCorregir: [
                { tipo: "Idea principal", explicacion: "Basta con reconocer la idea básica de cada tema.", ejemplo: "«Un gesto de saludo» → no verbal." },
              ],
            },
          } },
        { id: "reto", label: "Reto final del bloque + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
          args: {
            id: "l5-t1-bloque2",
            titulo: "Escribimos y contamos un cuento",
            consigna: [
              "Este reto reúne todo lo del bloque. Vas a escribir un cuento breve y luego lo contarás a la clase.",
              "En él usarás lo aprendido: cuidarás la estructura de la narración (inicio, nudo y desenlace), emplearás bien los verbos, y al contarlo pondrás en práctica la comunicación (emisor, mensaje, lenguaje no verbal con gestos).",
            ],
            pasos: [
              "Piensa un personaje, un lugar y un problema para tu cuento.",
              "Escribe el inicio (presenta al personaje y el lugar), el nudo (el problema) y el desenlace (la solución).",
              "Revisa que los verbos estén en el tiempo adecuado (normalmente en pasado).",
              "Pasa tu cuento a limpio.",
              "Cuéntalo a la clase con buena entonación y algún gesto que ayude a entenderlo.",
            ],
            criterios: [
              { nombre: "Mi cuento tiene inicio, nudo y desenlace", niveles: ["Las tres partes están claras y bien enlazadas.", "Están las tres partes, aunque poco diferenciadas.", "Falta alguna parte.", "Mi cuento no sigue la estructura de la narración."] },
              { nombre: "Uso los verbos con el tiempo y la persona correctos", niveles: ["Los verbos son correctos en todo el cuento.", "La mayoría de los verbos son correctos.", "Cometo bastantes errores con los verbos.", "No uso bien los verbos."] },
              { nombre: "Cuento el cuento comunicándome bien (voz y gestos)", niveles: ["Cuento con voz clara, entonación y gestos.", "Cuento con voz clara, con pocos gestos.", "Cuento con dificultad.", "No consigo contar el cuento."] },
            ],
            variantesACS: {
              titulo: "Escribimos y contamos un cuento",
              consigna: ["Vas a inventar un cuento muy corto (2 o 3 frases) y contarlo a la clase."],
              pasos: ["Piensa un personaje y qué le pasa.", "Escribe el principio, el medio y el final en pocas frases.", "Cuéntalo en voz alta a la clase."],
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
