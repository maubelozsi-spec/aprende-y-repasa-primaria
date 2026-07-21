// ============================================================
// UDI Lengua 6º · 3º Trimestre · SdA 7 "Para todos los gustos"
// (06/04 – 30/04, temporalización del centro 2025-2026).
// Contenidos: la novela, la oración, los verbos predicativos y
// copulativos, el atributo, las siglas y abreviaturas y las palabras
// con g/j.
// ============================================================

const UDI_L6_SDA7 = {
  id: "l6-sda7",
  area: "Lengua 6º · T3",
  titulo: "SdA 7 · Para todos los gustos",
  curso: "6",
  bloque: "Lengua · La novela + La oración y el atributo + Siglas y abreviaturas + Palabras con g/j",
  resumen: "06/04 – 30/04. La novela, la oración, los verbos predicativos y copulativos, el atributo, las siglas y abreviaturas y la ortografía de g/j.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "La novela", descripcion: "Géneros, personajes y estructura.", topicId: "narrativa" },
      { n: 2, titulo: "La oración: sujeto y predicado", descripcion: "Las dos partes de la oración.", topicId: "sintactico" },
      { n: 3, titulo: "Verbos predicativos y copulativos", descripcion: "Ser, estar y parecer.", topicId: "sintactico" },
      { n: 4, titulo: "El atributo", descripcion: "El complemento de los verbos copulativos.", topicId: "sintactico" },
      { n: 5, titulo: "Siglas y abreviaturas", descripcion: "ONU, ADN, Sr., pág.", topicId: "siglas-abreviaturas" },
      { n: 6, titulo: "Palabras con g/j", descripcion: "Reglas de g y j.", topicId: "ortografia-hgjxs" },
      { n: 7, titulo: "Reto: nuestra reseña de novela", descripcion: "Producto final de la SdA." },
      { n: 8, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-novela", label: "La novela", motor: "lengua-ficha", topicId: "narrativa", count: 5 },
      { id: "f-oracion", label: "La oración y el atributo", motor: "lengua-ficha", topicId: "sintactico", count: 6 },
      { id: "f-siglas", label: "Siglas y abreviaturas", motor: "lengua-ficha", topicId: "siglas-abreviaturas", count: 5 },
      { id: "f-gj", label: "Palabras con g/j", motor: "lengua-ficha", topicId: "ortografia-hgjxs", count: 5 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "lengua-examen", tipo: "repaso",
        topics: [{ topicId: "narrativa", count: 2 }, { topicId: "sintactico", count: 3 }, { topicId: "siglas-abreviaturas", count: 2 }, { topicId: "ortografia-hgjxs", count: 2 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "lengua-examen", tipo: "examen",
        topics: [{ topicId: "narrativa", count: 3 }, { topicId: "sintactico", count: 4 }, { topicId: "siglas-abreviaturas", count: 3 }, { topicId: "ortografia-hgjxs", count: 3 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "l6-sda7", titulo: "Guía: la novela, la oración y el atributo", subtitulo: "Documento de apoyo de la SdA 7 «Para todos los gustos» (6º).",
          teoria: [
            { heading: "La novela", paragraphs: ["Es un relato largo en prosa con varios personajes y tramas. Hay novelas de aventuras, de misterio, históricas, de ciencia ficción... Se organiza en capítulos y sigue el planteamiento, el nudo y el desenlace."] },
            { heading: "La oración: sujeto y predicado", paragraphs: ["El sujeto es de quien se dice algo (concuerda con el verbo) y el predicado es lo que se dice. Para hallar el sujeto se pregunta «¿quién?» al verbo."] },
            { heading: "Verbos predicativos, copulativos y atributo", paragraphs: ["Los verbos copulativos (ser, estar, parecer) no aportan significado pleno y llevan atributo, que dice cómo es el sujeto: «Mi hermana es alta» → atributo: alta. Los predicativos sí tienen significado propio: «corre», «lee»."] },
            { heading: "Siglas, abreviaturas y g/j", paragraphs: ["Las siglas se forman con las iniciales y se leen como palabra o letra a letra (ONU, ADN). Las abreviaturas acortan la palabra con punto (Sr., pág.). Se escriben con g los verbos en -ger/-gir (proteger) y con j las palabras en -aje (garaje)."] },
          ],
          comoCorregir: [
            { tipo: "La novela", explicacion: "Se identifica el subgénero o el elemento narrativo.", ejemplo: "«relato largo con capítulos» → novela." },
            { tipo: "La oración", explicacion: "Se localiza el verbo, se pregunta «¿quién?» para el sujeto y el resto es predicado.", ejemplo: "«Los niños / juegan» → sujeto / predicado." },
            { tipo: "El atributo", explicacion: "Si el verbo es ser, estar o parecer, lo que le sigue suele ser atributo.", ejemplo: "«El día está soleado» → atributo: soleado." },
            { tipo: "Siglas y g/j", explicacion: "Se aplica la regla ortográfica o se reconoce la sigla.", ejemplo: "«garaje» → acaba en -aje, con j." },
          ],
          variantesACS: { titulo: "Guía sencilla: la novela y la oración", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [
              { heading: "La novela", paragraphs: ["Una novela es una historia larga con capítulos y varios personajes."] },
              { heading: "Sujeto y predicado", paragraphs: ["El sujeto es quien hace la acción; el predicado es lo que hace: «El perro / ladra»."] },
            ],
            comoCorregir: [ { tipo: "Idea principal", explicacion: "Basta reconocer la idea básica.", ejemplo: "«El gato duerme» → sujeto: El gato." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "l6-sda7", titulo: "Nuestra reseña de novela",
          consigna: ["Este reto integra toda la SdA. Vais a escribir la reseña de una novela que hayáis leído y a recomendarla a la clase.",
            "Usaréis lo aprendido: hablaréis de la novela y su estructura, escribiréis oraciones bien construidas (con atributos cuando describáis), usaréis alguna sigla o abreviatura y cuidaréis la ortografía de g/j."],
          pasos: ["Elegid una novela y anotad su título, autor, género y de qué trata.",
            "Escribid la reseña: presentación, resumen sin destripar el final y vuestra opinión.",
            "Al describir personajes, usad verbos copulativos con atributo («El protagonista es valiente»).",
            "Incluid alguna sigla o abreviatura (pág., ed., cap.).",
            "Revisad las palabras con g y con j.",
            "Recomendad la novela a la clase en voz alta."],
          criterios: [
            { nombre: "Mi reseña presenta y resume bien la novela", niveles: ["Completa, clara y sin destripar el final.", "Bastante completa.", "Le falta información.", "No es una reseña."] },
            { nombre: "Construyo oraciones correctas e identifico el atributo", niveles: ["Oraciones correctas y atributos bien usados.", "Oraciones correctas, algún fallo con el atributo.", "Con bastantes errores.", "No lo consigo."] },
            { nombre: "Uso siglas o abreviaturas correctamente", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No las uso."] },
            { nombre: "Cuido la ortografía de g/j", niveles: ["Sin errores.", "Con algún error.", "Con bastantes errores.", "No la cuido."] },
          ],
          variantesACS: { titulo: "Nuestra reseña de novela",
            consigna: ["Vas a contar en 3 frases un libro que te haya gustado."],
            pasos: ["Di el título del libro.", "Escribe 3 frases contando de qué trata.", "Di si te gustó y por qué."],
            criterios: [
              { nombre: "Cuento de qué trata el libro", niveles: ["Se entiende bien.", "Se entiende a medias.", "Con ayuda.", "No lo consigo."] },
              { nombre: "Digo mi opinión", niveles: ["Doy mi opinión y una razón.", "Solo la opinión.", "Con ayuda.", "No lo consigo."] },
            ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L6_SDA7.id] = UDI_L6_SDA7;
