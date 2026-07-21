// ============================================================
// UDI Lengua 6º · 2º Trimestre · SdA 6 "Un mundo de maravillas"
// (03/03 – 27/03, temporalización del centro 2025-2026).
// Contenidos: la descripción, el sintagma adjetival, adverbial y
// preposicional, la homonimia y las palabras con x/s.
// ============================================================

const UDI_L6_SDA6 = {
  id: "l6-sda6",
  area: "Lengua 6º · T2",
  titulo: "SdA 6 · Un mundo de maravillas",
  curso: "6",
  bloque: "Lengua · La descripción + Sintagmas adjetival, adverbial y preposicional + La homonimia + Palabras con x/s",
  resumen: "03/03 – 27/03. La descripción, los sintagmas adjetival, adverbial y preposicional, la homonimia y la ortografía de x/s.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "La descripción", descripcion: "Describir lugares, personas y objetos.", topicId: "tipos-texto-6" },
      { n: 2, titulo: "Recursos para describir", descripcion: "Orden, detalle y adjetivos precisos.", topicId: "tipos-texto-6" },
      { n: 3, titulo: "El sintagma adjetival y adverbial", descripcion: "Núcleo adjetivo o adverbio.", topicId: "sintagmas" },
      { n: 4, titulo: "El sintagma preposicional", descripcion: "Enlace + sintagma nominal.", topicId: "sintagmas" },
      { n: 5, titulo: "La homonimia", descripcion: "Homófonas y homógrafas.", topicId: "lenguaje-figurado" },
      { n: 6, titulo: "Palabras con x/s", descripcion: "Reglas de x y s.", topicId: "ortografia-hgjxs" },
      { n: 7, titulo: "Reto: la guía de una maravilla", descripcion: "Producto final de la SdA." },
      { n: 8, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-descripcion", label: "La descripción", motor: "lengua-ficha", topicId: "tipos-texto-6", count: 5 },
      { id: "f-sintagmas", label: "Sintagmas adjetival, adverbial y preposicional", motor: "lengua-ficha", topicId: "sintagmas", count: 6 },
      { id: "f-homonimia", label: "La homonimia", motor: "lengua-ficha", topicId: "lenguaje-figurado", count: 5 },
      { id: "f-xs", label: "Palabras con x/s", motor: "lengua-ficha", topicId: "ortografia-hgjxs", count: 5 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "lengua-examen", tipo: "repaso",
        topics: [{ topicId: "tipos-texto-6", count: 2 }, { topicId: "sintagmas", count: 3 }, { topicId: "lenguaje-figurado", count: 2 }, { topicId: "ortografia-hgjxs", count: 2 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "lengua-examen", tipo: "examen",
        topics: [{ topicId: "tipos-texto-6", count: 3 }, { topicId: "sintagmas", count: 4 }, { topicId: "lenguaje-figurado", count: 3 }, { topicId: "ortografia-hgjxs", count: 3 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "l6-sda6", titulo: "Guía: la descripción, los sintagmas y la homonimia", subtitulo: "Documento de apoyo de la SdA 6 «Un mundo de maravillas» (6º).",
          teoria: [
            { heading: "La descripción", paragraphs: ["Explica cómo es algo o alguien. Se organiza siguiendo un orden (de lo general a lo particular, de arriba abajo) y emplea adjetivos precisos y comparaciones para que el lector se lo imagine."] },
            { heading: "Los sintagmas", paragraphs: ["Sintagma adjetival: su núcleo es un adjetivo (muy alto). Sintagma adverbial: su núcleo es un adverbio (bastante lejos). Sintagma preposicional: empieza por una preposición seguida de un sintagma nominal (de la montaña)."] },
            { heading: "La homonimia", paragraphs: ["Las palabras homónimas suenan o se escriben igual pero significan cosas distintas. Homófonas: suenan igual y se escriben distinto (vaca/baca). Homógrafas: se escriben igual (vino de beber / vino del verbo venir)."] },
            { heading: "Palabras con x/s", paragraphs: ["Se escriben con x los prefijos ex- y extra- (extraordinario) y palabras como éxito o exacto. Cuidado con parejas como «espiar/expiar» o «contexto/contesto»."] },
          ],
          comoCorregir: [
            { tipo: "La descripción", explicacion: "Se comprueba el orden y la riqueza de los adjetivos.", ejemplo: "«un valle verde y silencioso» → descripción con adjetivos." },
            { tipo: "Los sintagmas", explicacion: "Se localiza el núcleo para saber de qué tipo es el sintagma.", ejemplo: "«muy rápido» → sintagma adjetival." },
            { tipo: "La homonimia", explicacion: "Se distingue por el significado en la frase.", ejemplo: "«vaca» (animal) / «baca» (del coche) → homófonas." },
          ],
          variantesACS: { titulo: "Guía sencilla: describir y palabras parecidas", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [
              { heading: "Describir", paragraphs: ["Describir es decir cómo es algo: grande, verde, alto."] },
              { heading: "Palabras que suenan igual", paragraphs: ["«vaca» (animal) y «baca» (del coche) suenan igual pero son distintas."] },
            ],
            comoCorregir: [ { tipo: "Idea principal", explicacion: "Basta reconocer la idea básica.", ejemplo: "«alto» → adjetivo para describir." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "l6-sda6", titulo: "La guía de una maravilla",
          consigna: ["Este reto integra toda la SdA. Vais a elaborar la página de una guía turística describiendo una maravilla del mundo (natural o construida).",
            "Usaréis lo aprendido: una descripción ordenada y rica, sintagmas variados, alguna palabra homónima y la ortografía de x/s."],
          pasos: ["Elegid una maravilla y buscad cómo es y dónde está.",
            "Escribid la descripción siguiendo un orden claro y con adjetivos precisos.",
            "Señalad en vuestro texto un sintagma adjetival, uno adverbial y uno preposicional.",
            "Incluid alguna palabra homónima y explicad su doble significado.",
            "Revisad la ortografía, sobre todo las palabras con x y con s.",
            "Presentad la página de la guía a la clase."],
          criterios: [
            { nombre: "Mi descripción es ordenada y detallada", niveles: ["Orden claro y muchos detalles.", "Orden claro, pocos detalles.", "Desordenada.", "No describe."] },
            { nombre: "Identifico distintos tipos de sintagma", niveles: ["Identifico los tres tipos.", "Identifico dos.", "Identifico uno.", "No los identifico."] },
            { nombre: "Uso y explico una palabra homónima", niveles: ["La uso y la explico bien.", "La uso, la explico a medias.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Cuido la ortografía de x/s", niveles: ["Sin errores.", "Con algún error.", "Con bastantes errores.", "No la cuido."] },
          ],
          variantesACS: { titulo: "La guía de una maravilla",
            consigna: ["Vas a describir un lugar bonito con 3 frases."],
            pasos: ["Elige un lugar que te guste.", "Escribe 3 frases diciendo cómo es (usa adjetivos).", "Enséñalo a la clase."],
            criterios: [
              { nombre: "Describo con adjetivos", niveles: ["Uso varios adjetivos.", "Uso uno o dos.", "Con ayuda.", "No lo consigo."] },
              { nombre: "Presento mi descripción", niveles: ["Con voz clara.", "Aunque bajo.", "Con ayuda.", "No lo consigo."] },
            ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L6_SDA6.id] = UDI_L6_SDA6;
