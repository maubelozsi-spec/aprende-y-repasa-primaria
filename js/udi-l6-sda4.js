// ============================================================
// UDI Lengua 6º · 2º Trimestre · SdA 4 "Al alcance de todos"
// (08/01 – 30/01, temporalización del centro 2025-2026).
// Contenidos: los textos discontinuos, las palabras invariables, los
// sinónimos y antónimos, la tilde diacrítica en monosílabos y la
// acentuación de expresiones exclamativas e interrogativas.
// ============================================================

const UDI_L6_SDA4 = {
  id: "l6-sda4",
  area: "Lengua 6º · T2",
  titulo: "SdA 4 · Al alcance de todos",
  curso: "6",
  bloque: "Lengua · Textos discontinuos + Palabras invariables + Sinónimos y antónimos + Tilde diacrítica",
  resumen: "08/01 – 30/01. Los textos discontinuos, las palabras invariables, los sinónimos y antónimos, y la tilde diacrítica y la acentuación de exclamativas e interrogativas.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Los textos discontinuos", descripcion: "Gráficos, tablas, folletos e infografías.", topicId: "tipos-texto-6" },
      { n: 2, titulo: "Las palabras invariables", descripcion: "Adverbios, preposiciones y conjunciones.", topicId: "adverbio-preposicion-conjuncion" },
      { n: 3, titulo: "Sinónimos y antónimos", descripcion: "Enriquecer el vocabulario.", topicId: "sinonimos-antonimos" },
      { n: 4, titulo: "La tilde diacrítica en monosílabos", descripcion: "él/el, tú/tu, mí/mi, sí/si.", topicId: "tilde-diacritica" },
      { n: 5, titulo: "Acentuación de exclamativas e interrogativas", descripcion: "Qué, cómo, dónde, cuándo.", topicId: "tilde-diacritica" },
      { n: 6, titulo: "Reto: una infografía accesible", descripcion: "Producto final de la SdA." },
      { n: 7, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-discontinuos", label: "Textos discontinuos", motor: "lengua-ficha", topicId: "tipos-texto-6", count: 5 },
      { id: "f-invariables", label: "Palabras invariables", motor: "lengua-ficha", topicId: "adverbio-preposicion-conjuncion", count: 5 },
      { id: "f-sinonimos", label: "Sinónimos y antónimos", motor: "lengua-ficha", topicId: "sinonimos-antonimos", count: 5 },
      { id: "f-diacritica", label: "Tilde diacrítica", motor: "lengua-ficha", topicId: "tilde-diacritica", count: 6 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "lengua-examen", tipo: "repaso",
        topics: [{ topicId: "tipos-texto-6", count: 2 }, { topicId: "adverbio-preposicion-conjuncion", count: 2 }, { topicId: "sinonimos-antonimos", count: 2 }, { topicId: "tilde-diacritica", count: 3 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "lengua-examen", tipo: "examen",
        topics: [{ topicId: "tipos-texto-6", count: 3 }, { topicId: "adverbio-preposicion-conjuncion", count: 3 }, { topicId: "sinonimos-antonimos", count: 3 }, { topicId: "tilde-diacritica", count: 4 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "l6-sda4", titulo: "Guía: textos discontinuos, palabras invariables y tilde diacrítica", subtitulo: "Documento de apoyo de la SdA 4 «Al alcance de todos» (6º).",
          teoria: [
            { heading: "Los textos discontinuos", paragraphs: ["No se leen de forma lineal: gráficos, tablas, mapas, folletos e infografías. Combinan texto e imagen para transmitir información de forma rápida y accesible."] },
            { heading: "Las palabras invariables", paragraphs: ["No cambian de forma: los adverbios (modifican al verbo: rápidamente, ayer, muy), las preposiciones (enlazan: a, de, con, para) y las conjunciones (unen: y, pero, porque)."] },
            { heading: "Sinónimos y antónimos", paragraphs: ["Los sinónimos significan lo mismo (bonito/hermoso) y los antónimos, lo contrario (alto/bajo). Usarlos evita repeticiones y precisa el mensaje."] },
            { heading: "La tilde diacrítica", paragraphs: ["Distingue palabras que se escriben igual: él (pronombre) / el (artículo), tú / tu, mí / mi, sí / si, más / mas. Además, qué, cómo, dónde y cuándo llevan tilde en preguntas y exclamaciones."] },
          ],
          comoCorregir: [
            { tipo: "Textos discontinuos", explicacion: "Se identifica el tipo de soporte y la información que transmite.", ejemplo: "«un gráfico de barras» → texto discontinuo." },
            { tipo: "Palabras invariables", explicacion: "Se distingue adverbio, preposición o conjunción.", ejemplo: "«pero» → conjunción." },
            { tipo: "Tilde diacrítica", explicacion: "Se comprueba la función de la palabra en la frase.", ejemplo: "«¿Dónde vas?» → lleva tilde por ser interrogativa." },
          ],
          variantesACS: { titulo: "Guía sencilla: gráficos, palabras y tildes", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [
              { heading: "Los gráficos", paragraphs: ["Un gráfico o una tabla dan información con dibujos y pocos números."] },
              { heading: "Sinónimos y antónimos", paragraphs: ["Sinónimo: significa lo mismo (bonito/hermoso). Antónimo: lo contrario (alto/bajo)."] },
            ],
            comoCorregir: [ { tipo: "Idea principal", explicacion: "Basta reconocer la idea básica.", ejemplo: "«grande» y «pequeño» → antónimos." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "l6-sda4", titulo: "Una infografía accesible",
          consigna: ["Este reto integra toda la SdA. Vais a crear una infografía (texto discontinuo) que explique un tema de forma clara y accesible para toda la clase.",
            "Usaréis lo aprendido: el formato del texto discontinuo, palabras invariables para conectar las ideas, sinónimos para no repetir, y la tilde diacrítica bien puesta."],
          pasos: ["Elegid un tema útil (el reciclaje, el uso responsable del móvil, la alimentación...).",
            "Organizad la información en apartados breves con títulos, datos e imágenes o iconos.",
            "Conectad las ideas con adverbios, preposiciones y conjunciones adecuados.",
            "Revisad que no repetís palabras: usad sinónimos.",
            "Comprobad las tildes diacríticas y las de las preguntas o exclamaciones.",
            "Presentad la infografía a la clase."],
          criterios: [
            { nombre: "Mi infografía organiza la información de forma clara", niveles: ["Muy clara, con apartados y apoyos visuales.", "Bastante clara.", "Poco organizada.", "No se entiende."] },
            { nombre: "Conecto las ideas con palabras invariables", niveles: ["Uso conectores variados y correctos.", "Uso algunos conectores.", "Pocos o mal usados.", "No los uso."] },
            { nombre: "Uso sinónimos para evitar repeticiones", niveles: ["Vocabulario variado.", "Alguna repetición.", "Repito mucho.", "No uso sinónimos."] },
            { nombre: "Aplico bien la tilde diacrítica", niveles: ["Sin errores.", "Con algún error.", "Con bastantes errores.", "No la aplico."] },
          ],
          variantesACS: { titulo: "Una infografía accesible",
            consigna: ["Vas a hacer un cartel sencillo con un dibujo y 3 frases sobre un tema."],
            pasos: ["Elige un tema (el reciclaje, por ejemplo).", "Haz un dibujo y escribe 3 frases cortas.", "Enséñalo a la clase."],
            criterios: [
              { nombre: "Hago un cartel con dibujo y frases", niveles: ["Dibujo y 3 frases claras.", "Dibujo y 2 frases.", "Con ayuda.", "No lo consigo."] },
              { nombre: "Lo presento a la clase", niveles: ["Con voz clara.", "Aunque bajo.", "Con ayuda.", "No lo consigo."] },
            ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L6_SDA4.id] = UDI_L6_SDA4;
