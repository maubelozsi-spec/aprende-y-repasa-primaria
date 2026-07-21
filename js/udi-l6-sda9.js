// ============================================================
// UDI Lengua 6º · 3º Trimestre · SdA 9 "En mi opinión"
// (01/06 – 19/06, temporalización del centro 2025-2026).
// Contenidos: el debate, el texto argumentativo, las lenguas de
// España y las variedades del español, los préstamos, palabras tabú y
// eufemismos, y el paréntesis, las comillas y la raya.
// ============================================================

const UDI_L6_SDA9 = {
  id: "l6-sda9",
  area: "Lengua 6º · T3",
  titulo: "SdA 9 · En mi opinión",
  curso: "6",
  bloque: "Lengua · El debate y el texto argumentativo + Las lenguas de España + Préstamos y eufemismos + Paréntesis, comillas y raya",
  resumen: "01/06 – 19/06. El debate y el texto argumentativo, las lenguas de España y variedades del español, préstamos/tabú/eufemismos y los signos de puntuación.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "El debate", descripcion: "Turnos, moderador y escucha activa.", topicId: "dialogo-debate-argumentativo" },
      { n: 2, titulo: "El texto argumentativo", descripcion: "Tesis y argumentos.", topicId: "dialogo-debate-argumentativo" },
      { n: 3, titulo: "Las lenguas de España", descripcion: "Lenguas cooficiales.", topicId: "lenguas-espana" },
      { n: 4, titulo: "Variedades del español", descripcion: "El español en el mundo.", topicId: "lenguas-espana" },
      { n: 5, titulo: "Préstamos, palabras tabú y eufemismos", descripcion: "Extranjerismos y usos del lenguaje.", topicId: "prestamos-tabu-eufemismos" },
      { n: 6, titulo: "Paréntesis, comillas y raya", descripcion: "Signos para aclarar y citar.", topicId: "signos-puntuacion" },
      { n: 7, titulo: "Reto: nuestro debate de clase", descripcion: "Producto final de la SdA." },
      { n: 8, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-debate", label: "El debate y el texto argumentativo", motor: "lengua-ficha", topicId: "dialogo-debate-argumentativo", count: 6 },
      { id: "f-lenguas", label: "Las lenguas de España", motor: "lengua-ficha", topicId: "lenguas-espana", count: 5 },
      { id: "f-prestamos", label: "Préstamos, tabú y eufemismos", motor: "lengua-ficha", topicId: "prestamos-tabu-eufemismos", count: 5 },
      { id: "f-puntuacion", label: "Paréntesis, comillas y raya", motor: "lengua-ficha", topicId: "signos-puntuacion", count: 5 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "lengua-examen", tipo: "repaso",
        topics: [{ topicId: "dialogo-debate-argumentativo", count: 3 }, { topicId: "lenguas-espana", count: 2 }, { topicId: "prestamos-tabu-eufemismos", count: 2 }, { topicId: "signos-puntuacion", count: 2 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "lengua-examen", tipo: "examen",
        topics: [{ topicId: "dialogo-debate-argumentativo", count: 4 }, { topicId: "lenguas-espana", count: 3 }, { topicId: "prestamos-tabu-eufemismos", count: 3 }, { topicId: "signos-puntuacion", count: 3 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "l6-sda9", titulo: "Guía: el debate, las lenguas de España y los signos", subtitulo: "Documento de apoyo de la SdA 9 «En mi opinión» (6º).",
          teoria: [
            { heading: "El debate y el texto argumentativo", paragraphs: ["En un debate se defienden posturas distintas respetando los turnos, con un moderador. El texto argumentativo expone una tesis (opinión) y la apoya con argumentos: razones, datos y ejemplos; termina con una conclusión."] },
            { heading: "Las lenguas de España y variedades del español", paragraphs: ["Además del castellano, en España son cooficiales el catalán, el gallego y el euskera. El español se habla también en América y presenta variedades (seseo, voseo, léxico propio) igual de válidas."] },
            { heading: "Préstamos, palabras tabú y eufemismos", paragraphs: ["Los préstamos son palabras tomadas de otras lenguas (fútbol, chef). Las palabras tabú se evitan por resultar molestas y se sustituyen por eufemismos (fallecer por morir)."] },
            { heading: "Paréntesis, comillas y raya", paragraphs: ["Los paréntesis () añaden una aclaración. Las comillas «» o \"\" citan palabras de otros o destacan un término. La raya (—) introduce las intervenciones del diálogo o incisos."] },
          ],
          comoCorregir: [
            { tipo: "El debate/argumentativo", explicacion: "Se distingue la tesis de los argumentos y se valora el respeto de turnos.", ejemplo: "«porque reduce la contaminación» → argumento." },
            { tipo: "Lenguas de España", explicacion: "Se identifica la lengua o la variedad.", ejemplo: "«gallego» → lengua cooficial." },
            { tipo: "Préstamos y eufemismos", explicacion: "Se reconoce el origen extranjero o la sustitución suavizada.", ejemplo: "«fallecer» → eufemismo de morir." },
            { tipo: "Signos", explicacion: "Se comprueba la función del signo.", ejemplo: "«(véase la página 12)» → paréntesis con aclaración." },
          ],
          variantesACS: { titulo: "Guía sencilla: opinar y las lenguas", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [
              { heading: "Dar mi opinión", paragraphs: ["Argumentar es decir lo que piensas y una razón: «Creo que... porque...»."] },
              { heading: "Las lenguas de España", paragraphs: ["En España se habla castellano y también catalán, gallego y euskera."] },
            ],
            comoCorregir: [ { tipo: "Idea principal", explicacion: "Basta reconocer la idea básica.", ejemplo: "«porque es sano» → razón." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "l6-sda9", titulo: "Nuestro debate de clase",
          consigna: ["Este reto integra toda la SdA y cierra el curso. Vais a preparar y celebrar un debate de clase sobre un tema que os importe, y a escribir después un texto argumentativo defendiendo vuestra postura.",
            "Usaréis lo aprendido: las normas del debate, la estructura del texto argumentativo, un vocabulario cuidado (préstamos y eufemismos) y los signos de puntuación adecuados."],
          pasos: ["Elegid el tema del debate y repartid los papeles (a favor, en contra y moderador).",
            "Preparad al menos tres argumentos con datos o ejemplos.",
            "Celebrad el debate respetando los turnos y escuchando a los demás.",
            "Escribid después un texto argumentativo con vuestra tesis, los argumentos y una conclusión.",
            "Usad comillas para citar lo que dijo un compañero y paréntesis para alguna aclaración.",
            "Revisad el vocabulario: si usáis algún préstamo o eufemismo, explicadlo."],
          criterios: [
            { nombre: "Participo en el debate respetando los turnos", niveles: ["Respeto turnos y escucho activamente.", "Respeto turnos casi siempre.", "Me cuesta respetar los turnos.", "No respeto los turnos."] },
            { nombre: "Defiendo mi postura con argumentos sólidos", niveles: ["Tres argumentos con datos o ejemplos.", "Dos argumentos.", "Un argumento flojo.", "No aporto argumentos."] },
            { nombre: "Escribo un texto argumentativo bien estructurado", niveles: ["Tesis, argumentos y conclusión claros.", "Le falta alguna parte.", "Estructura confusa.", "No lo escribo."] },
            { nombre: "Uso comillas, paréntesis y un vocabulario cuidado", niveles: ["Signos y vocabulario correctos.", "Con algún error.", "Con bastantes errores.", "No los uso."] },
          ],
          variantesACS: { titulo: "Nuestro debate de clase",
            consigna: ["Vas a decir tu opinión sobre un tema y escuchar la de un compañero."],
            pasos: ["Piensa si estás a favor o en contra del tema.", "Di tu opinión y una razón: «Yo pienso que... porque...».", "Escucha la opinión de un compañero sin interrumpir."],
            criterios: [
              { nombre: "Digo mi opinión y una razón", niveles: ["Opinión y razón claras.", "Solo la opinión.", "Con ayuda.", "No lo consigo."] },
              { nombre: "Escucho sin interrumpir", niveles: ["Escucho bien.", "Casi siempre.", "Me cuesta.", "No lo consigo."] },
            ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L6_SDA9.id] = UDI_L6_SDA9;
