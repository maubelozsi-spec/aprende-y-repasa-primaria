// ============================================================
// UDI Lengua 6º · 1º Trimestre · SdA 3 "Rumbo a la historia"
// (17/11 – 12/12, temporalización del centro 2025-2026).
// Contenidos: el texto histórico, el verbo, la familia de palabras y
// el campo semántico, y las palabras compuestas.
// ============================================================

const UDI_L6_SDA3 = {
  id: "l6-sda3",
  area: "Lengua 6º · T1",
  titulo: "SdA 3 · Rumbo a la historia",
  curso: "6",
  bloque: "Lengua · El texto histórico + El verbo + Familia de palabras y palabras compuestas",
  resumen: "17/11 – 12/12. El texto histórico, el verbo, la familia de palabras y el campo semántico, y las palabras compuestas.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "El texto histórico", descripcion: "Narrar hechos del pasado con rigor.", topicId: "tipos-texto-6" },
      { n: 2, titulo: "El verbo: conjugación", descripcion: "Persona, número, tiempo y modo.", topicId: "verbo" },
      { n: 3, titulo: "Los tiempos verbales del pasado", descripcion: "Pretéritos en la narración histórica.", topicId: "verbo" },
      { n: 4, titulo: "Familia de palabras y campo semántico", descripcion: "Palabras por su raíz y por su significado.", topicId: "formacion-palabras" },
      { n: 5, titulo: "Las palabras compuestas", descripcion: "Unir dos palabras para formar una nueva.", topicId: "formacion-palabras" },
      { n: 6, titulo: "Reto: nuestra crónica histórica", descripcion: "Producto final de la SdA." },
      { n: 7, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-historico", label: "El texto histórico", motor: "lengua-ficha", topicId: "tipos-texto-6", count: 5 },
      { id: "f-verbo", label: "El verbo", motor: "lengua-ficha", topicId: "verbo", count: 6 },
      { id: "f-familia", label: "Familia de palabras y compuestas", motor: "lengua-ficha", topicId: "formacion-palabras", count: 6 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "lengua-examen", tipo: "repaso",
        topics: [{ topicId: "tipos-texto-6", count: 3 }, { topicId: "verbo", count: 3 }, { topicId: "formacion-palabras", count: 3 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "lengua-examen", tipo: "examen",
        topics: [{ topicId: "tipos-texto-6", count: 4 }, { topicId: "verbo", count: 4 }, { topicId: "formacion-palabras", count: 4 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "l6-sda3", titulo: "Guía: el texto histórico, el verbo y las familias de palabras", subtitulo: "Documento de apoyo de la SdA 3 «Rumbo a la historia» (6º).",
          teoria: [
            { heading: "El texto histórico", paragraphs: ["Narra hechos del pasado de forma ordenada y rigurosa, situándolos en el tiempo y el lugar. Usa marcadores temporales (en el siglo XV, años más tarde) y verbos en pasado."] },
            { heading: "El verbo", paragraphs: ["El verbo expresa acciones o estados y varía en persona, número, tiempo y modo. En los textos históricos predominan los tiempos de pasado: pretérito perfecto simple (llegó), imperfecto (vivía) y pluscuamperfecto (había llegado)."] },
            { heading: "Familia de palabras, campo semántico y compuestas", paragraphs: ["Una familia de palabras comparte la raíz (mar, marino, marinero). Un campo semántico agrupa palabras por su significado (rey, castillo, corona → la monarquía). Las palabras compuestas unen dos palabras: sacacorchos, guardaespaldas."] },
          ],
          comoCorregir: [
            { tipo: "El texto histórico", explicacion: "Se comprueba el orden temporal y el uso del pasado.", ejemplo: "«En 1492 Colón llegó a América» → texto histórico." },
            { tipo: "El verbo", explicacion: "Se analiza persona, número, tiempo y modo.", ejemplo: "«habían llegado» → pretérito pluscuamperfecto." },
            { tipo: "Familias y compuestas", explicacion: "Se busca la raíz común o las dos palabras que se unen.", ejemplo: "«sacapuntas» → sacar + puntas." },
          ],
          variantesACS: { titulo: "Guía sencilla: contar el pasado y las palabras", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [
              { heading: "Contar el pasado", paragraphs: ["Para contar algo que ya pasó usamos verbos en pasado: fue, vivió, llegó."] },
              { heading: "Familia de palabras", paragraphs: ["Vienen de la misma palabra: mar, marino, marinero."] },
            ],
            comoCorregir: [ { tipo: "Idea principal", explicacion: "Basta reconocer la idea básica.", ejemplo: "«llegó» → pasado." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "l6-sda3", titulo: "Nuestra crónica histórica",
          consigna: ["Este reto integra toda la SdA. Vais a escribir una crónica histórica sobre un hecho del pasado (de vuestra localidad, de España o del mundo).",
            "Usaréis lo aprendido: la estructura del texto histórico, los verbos en pasado, y un vocabulario rico con familias de palabras, campo semántico y palabras compuestas."],
          pasos: ["Elegid un hecho histórico y buscad cuándo, dónde y quiénes participaron.",
            "Escribid la crónica en orden temporal, con marcadores (primero, años más tarde, finalmente).",
            "Usad verbos en pasado y revisad su conjugación.",
            "Incluid un campo semántico del tema y al menos dos palabras compuestas.",
            "Presentad la crónica a la clase."],
          criterios: [
            { nombre: "Mi crónica narra el hecho con orden y rigor", niveles: ["Orden temporal claro y datos correctos.", "Orden claro, algún dato impreciso.", "Desordenada.", "No narra el hecho."] },
            { nombre: "Uso correctamente los verbos en pasado", niveles: ["Sin errores.", "Con algún error.", "Con bastantes errores.", "No uso el pasado."] },
            { nombre: "Empleo campo semántico y palabras compuestas", niveles: ["Vocabulario rico y variado.", "Algún término del campo semántico.", "Vocabulario pobre.", "No lo empleo."] },
          ],
          variantesACS: { titulo: "Nuestra crónica histórica",
            consigna: ["Vas a escribir 3 frases sobre algo que pasó hace mucho tiempo."],
            pasos: ["Elige un hecho del pasado.", "Escribe 3 frases con verbos en pasado (fue, vivió, llegó).", "Léelas a la clase."],
            criterios: [
              { nombre: "Escribo 3 frases en pasado", niveles: ["Las 3 en pasado.", "2 en pasado.", "Con ayuda.", "No lo consigo."] },
              { nombre: "Leo mis frases en voz alta", niveles: ["Con voz clara.", "Aunque bajo.", "Con ayuda.", "No lo consigo."] },
            ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L6_SDA3.id] = UDI_L6_SDA3;
