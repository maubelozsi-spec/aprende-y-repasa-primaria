// ============================================================
// UDI Lengua 6º · 2º Trimestre · SdA 5 "Versos a medida"
// (02/02 – 26/02, temporalización del centro 2025-2026).
// Contenidos: la poesía, el sintagma nominal, el lenguaje literal y
// figurado, las frases hechas y las palabras con h.
// ============================================================

const UDI_L6_SDA5 = {
  id: "l6-sda5",
  area: "Lengua 6º · T2",
  titulo: "SdA 5 · Versos a medida",
  curso: "6",
  bloque: "Lengua · La poesía + El sintagma nominal + Lenguaje figurado y frases hechas + Palabras con h",
  resumen: "02/02 – 26/02. La poesía, el sintagma nominal, el lenguaje literal y figurado, las frases hechas y la ortografía de la h.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "La poesía: verso, estrofa y rima", descripcion: "Medida y tipos de rima.", topicId: "poesia" },
      { n: 2, titulo: "Recursos poéticos", descripcion: "Comparación, metáfora, personificación.", topicId: "poesia" },
      { n: 3, titulo: "El sintagma nominal", descripcion: "Núcleo, determinantes y complementos.", topicId: "sintagmas" },
      { n: 4, titulo: "Lenguaje literal y figurado", descripcion: "Sentido recto y sentido figurado.", topicId: "lenguaje-figurado" },
      { n: 5, titulo: "Las frases hechas", descripcion: "Expresiones con significado propio.", topicId: "lenguaje-figurado" },
      { n: 6, titulo: "Palabras con h", descripcion: "Reglas de la h.", topicId: "ortografia-hgjxs" },
      { n: 7, titulo: "Reto: nuestro poemario", descripcion: "Producto final de la SdA." },
      { n: 8, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-poesia", label: "La poesía", motor: "lengua-ficha", topicId: "poesia", count: 6 },
      { id: "f-sintagmas", label: "El sintagma nominal", motor: "lengua-ficha", topicId: "sintagmas", count: 5 },
      { id: "f-figurado", label: "Lenguaje figurado y frases hechas", motor: "lengua-ficha", topicId: "lenguaje-figurado", count: 5 },
      { id: "f-hache", label: "Palabras con h", motor: "lengua-ficha", topicId: "ortografia-hgjxs", count: 5 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "lengua-examen", tipo: "repaso",
        topics: [{ topicId: "poesia", count: 3 }, { topicId: "sintagmas", count: 2 }, { topicId: "lenguaje-figurado", count: 2 }, { topicId: "ortografia-hgjxs", count: 2 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "lengua-examen", tipo: "examen",
        topics: [{ topicId: "poesia", count: 4 }, { topicId: "sintagmas", count: 3 }, { topicId: "lenguaje-figurado", count: 3 }, { topicId: "ortografia-hgjxs", count: 3 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "l6-sda5", titulo: "Guía: la poesía, el sintagma nominal y el lenguaje figurado", subtitulo: "Documento de apoyo de la SdA 5 «Versos a medida» (6º).",
          teoria: [
            { heading: "La poesía", paragraphs: ["Se escribe en verso (cada línea) y estrofa (grupo de versos). Los versos se miden contando sílabas y pueden tener rima consonante (coinciden vocales y consonantes) o asonante (solo las vocales)."] },
            { heading: "El sintagma nominal", paragraphs: ["Es un grupo de palabras cuyo núcleo es un sustantivo (o pronombre). Puede llevar determinantes delante y complementos detrás: «el viento del norte» → det + núcleo + complemento."] },
            { heading: "Lenguaje literal y figurado", paragraphs: ["El sentido literal es el propio de la palabra; el figurado da otro significado (poético o expresivo): «tiene un corazón de oro». Las frases hechas son expresiones fijas con significado propio: «estar en las nubes»."] },
            { heading: "Palabras con h", paragraphs: ["Se escriben con h las palabras que empiezan por hie-, hue-, hia-, hui- (hierro, hueso), las formas de haber y hacer, y los prefijos hiper-, hipo-, hidro-, hema-."] },
          ],
          comoCorregir: [
            { tipo: "La poesía", explicacion: "Se cuentan sílabas, se identifica la estrofa y el tipo de rima o el recurso.", ejemplo: "«el sol sonreía» → personificación." },
            { tipo: "El sintagma nominal", explicacion: "Se localiza el núcleo (sustantivo) y lo que lo acompaña.", ejemplo: "«la casa blanca» → núcleo: casa." },
            { tipo: "Lenguaje figurado", explicacion: "Se comprueba si la expresión significa literalmente lo que dice.", ejemplo: "«estar en las nubes» → frase hecha (distraído)." },
            { tipo: "Palabras con h", explicacion: "Se aplica la regla correspondiente.", ejemplo: "«hueso» → empieza por hue-, lleva h." },
          ],
          variantesACS: { titulo: "Guía sencilla: poemas y palabras con h", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [
              { heading: "El poema", paragraphs: ["Un poema tiene versos (líneas cortas) y muchas veces rima al final."] },
              { heading: "Palabras con h", paragraphs: ["La h no suena, pero se escribe: hola, hueso, hierro."] },
            ],
            comoCorregir: [ { tipo: "Idea principal", explicacion: "Basta reconocer la idea básica.", ejemplo: "«hueso» → lleva h." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "l6-sda5", titulo: "Nuestro poemario",
          consigna: ["Este reto integra toda la SdA. Vais a crear un pequeño poemario de clase con poemas escritos por vosotros.",
            "Usaréis lo aprendido: la medida y la rima de los versos, el lenguaje figurado y alguna frase hecha, sintagmas nominales cuidados y la ortografía de la h."],
          pasos: ["Elegid un tema para vuestro poema (la naturaleza, la amistad, el mar...).",
            "Escribid al menos una estrofa cuidando la medida de los versos y la rima.",
            "Incluid al menos dos recursos de lenguaje figurado (comparación, metáfora o personificación).",
            "Añadid una frase hecha y subrayad un sintagma nominal de vuestro poema.",
            "Revisad la ortografía, sobre todo las palabras con h.",
            "Recitad vuestro poema y montad el poemario de clase."],
          criterios: [
            { nombre: "Mi poema tiene versos, estrofa y rima", niveles: ["Versos medidos y rima cuidada.", "Versos y estrofa, rima irregular.", "Poca forma poética.", "No tiene forma de poema."] },
            { nombre: "Uso lenguaje figurado", niveles: ["Varios recursos bien logrados.", "Algún recurso.", "Lo intento sin lograrlo.", "No uso lenguaje figurado."] },
            { nombre: "Identifico un sintagma nominal", niveles: ["Lo identifico con su núcleo.", "Lo identifico con ayuda.", "Lo intento.", "No lo identifico."] },
            { nombre: "Cuido la ortografía de la h", niveles: ["Sin errores.", "Con algún error.", "Con bastantes errores.", "No la cuido."] },
          ],
          variantesACS: { titulo: "Nuestro poemario",
            consigna: ["Vas a escribir un poema muy corto de 2 versos que rimen."],
            pasos: ["Piensa dos palabras que rimen (sol/caracol).", "Escribe 2 versos que terminen en esas palabras.", "Recítalo a la clase."],
            criterios: [
              { nombre: "Escribo 2 versos que rimen", niveles: ["Riman bien.", "Escribo 2 versos sin rima.", "Con ayuda.", "No lo consigo."] },
              { nombre: "Recito mi poema", niveles: ["Con voz clara.", "Aunque bajo.", "Con ayuda.", "No lo consigo."] },
            ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L6_SDA5.id] = UDI_L6_SDA5;
