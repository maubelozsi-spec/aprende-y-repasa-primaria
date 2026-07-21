// ============================================================
// UDI Lengua 5º · 3º Trimestre · Bloque 2 (mini-SDA sa04+sa05+sa06):
//   sa04 · El texto argumentativo (dialogo-debate-argumentativo)
//   sa05 · Familia de palabras, campo semántico, adverbios/preposiciones/
//          conjunciones (formacion-palabras + adverbio-preposicion-conjuncion)
//   sa06 · La comparación y la metáfora (lenguaje-figurado)
// ============================================================

const UDI_L5_T3_BLOQUE2 = {
  id: "l5-t3-bloque2",
  area: "Lengua 5º · T3",
  titulo: "3º Trimestre · Bloque 2",
  curso: "5",
  bloque: "Lengua · El texto argumentativo + Familia de palabras y nexos + La comparación y la metáfora",
  resumen: "Agrupa las mini-SDA 4-6 del 3º trimestre con un examen combinado y un reto integrador.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],

  fases: [
    {
      id: "plan", label: "Plan de la UDI", tipo: "plan",
      sesiones: [
        { n: 1, titulo: "sa04 · El texto argumentativo", descripcion: "Tesis y argumentos para convencer.", topicId: "dialogo-debate-argumentativo" },
        { n: 2, titulo: "sa04 · Escribimos para convencer", descripcion: "Organizar los argumentos.", topicId: "dialogo-debate-argumentativo" },
        { n: 3, titulo: "sa05 · Familia de palabras y campo semántico", descripcion: "Palabras relacionadas por su forma o su significado.", topicId: "formacion-palabras" },
        { n: 4, titulo: "sa05 · Adverbios, preposiciones y conjunciones", descripcion: "Palabras que enlazan y matizan.", topicId: "adverbio-preposicion-conjuncion" },
        { n: 5, titulo: "sa06 · La comparación", descripcion: "Relacionar dos cosas con «como».", topicId: "lenguaje-figurado" },
        { n: 6, titulo: "sa06 · La metáfora", descripcion: "Identificar una cosa con otra.", topicId: "lenguaje-figurado" },
        { n: 7, titulo: "Reto: convénceme con imágenes", descripcion: "Producto final del bloque." },
        { n: 8, titulo: "Repaso y examen del bloque", descripcion: "Ficha de repaso y prueba de evaluación." },
      ],
    },
    {
      id: "fichas", label: "Fichas por bloque", tipo: "fichas",
      documentos: [
        { id: "ficha-sa04", label: "sa04 · El texto argumentativo", motor: "lengua-ficha", topicId: "dialogo-debate-argumentativo", count: 5 },
        { id: "ficha-sa05a", label: "sa05 · Familia de palabras", motor: "lengua-ficha", topicId: "formacion-palabras", count: 5 },
        { id: "ficha-sa05b", label: "sa05 · Adverbios, preposiciones y conjunciones", motor: "lengua-ficha", topicId: "adverbio-preposicion-conjuncion", count: 5 },
        { id: "ficha-sa06", label: "sa06 · Comparación y metáfora", motor: "lengua-ficha", topicId: "lenguaje-figurado", count: 5 },
      ],
    },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    {
      id: "evaluacion", label: "Evaluación", tipo: "evaluacion",
      documentos: [
        { id: "repaso", label: "Ficha de repaso (bloque combinado)", motor: "lengua-examen", tipo: "repaso",
          topics: [{ topicId: "dialogo-debate-argumentativo", count: 2 }, { topicId: "formacion-palabras", count: 2 }, { topicId: "adverbio-preposicion-conjuncion", count: 2 }, { topicId: "lenguaje-figurado", count: 3 }] },
        { id: "examen", label: "Examen del bloque (combinado)", motor: "lengua-examen", tipo: "examen",
          topics: [{ topicId: "dialogo-debate-argumentativo", count: 3 }, { topicId: "formacion-palabras", count: 3 }, { topicId: "adverbio-preposicion-conjuncion", count: 3 }, { topicId: "lenguaje-figurado", count: 4 }] },
        { id: "explicacion", label: "Explicación y solucionario del bloque", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
          args: {
            id: "l5-t3-bloque2",
            titulo: "Guía del bloque: argumentar, familias de palabras y figuras",
            subtitulo: "Documento de apoyo del Bloque 2 (3º trimestre).",
            teoria: [
              { heading: "El texto argumentativo", paragraphs: ["Defiende una opinión (tesis) con argumentos ordenados. Busca convencer al lector con razones, ejemplos y datos."] },
              { heading: "Familia de palabras y campo semántico", paragraphs: ["Una familia de palabras comparte la misma raíz (pan, panadero, panadería). Un campo semántico agrupa palabras relacionadas por su significado (rosa, clavel, tulipán → flores). Los adverbios, preposiciones y conjunciones enlazan y matizan las ideas."] },
              { heading: "La comparación y la metáfora", paragraphs: ["La comparación relaciona dos cosas usando «como» (sus ojos son como luceros). La metáfora identifica una cosa con otra sin «como» (sus ojos son luceros)."] },
            ],
            comoCorregir: [
              { tipo: "El texto argumentativo", explicacion: "Se distingue la tesis (opinión) de los argumentos.", ejemplo: "«porque mejora la salud» → argumento." },
              { tipo: "Familias y nexos", explicacion: "Se reconoce la familia de palabras/campo semántico o la clase de nexo (adverbio, preposición, conjunción).", ejemplo: "«rápidamente» → adverbio." },
              { tipo: "Figuras", explicacion: "Se distingue comparación (con «como») de metáfora (sin «como»).", ejemplo: "«la nieve es un manto blanco» → metáfora." },
            ],
            variantesACS: {
              titulo: "Guía sencilla: opinar, familias de palabras y comparaciones",
              subtitulo: "Versión adaptada (ACS, nivel de 3º).",
              teoria: [
                { heading: "Opinar con razones", paragraphs: ["Argumentar es decir tu opinión y una razón: «Hay que reciclar porque cuida el planeta»."] },
                { heading: "Familia de palabras", paragraphs: ["Una familia de palabras viene de la misma palabra: flor, florero, florista."] },
                { heading: "La comparación", paragraphs: ["Comparar es unir dos cosas con «como»: «es fuerte como un toro»."] },
              ],
              comoCorregir: [ { tipo: "Idea principal", explicacion: "Basta reconocer la idea básica.", ejemplo: "«blanco como la nieve» → comparación." } ],
            },
          } },
        { id: "reto", label: "Reto final del bloque + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
          args: {
            id: "l5-t3-bloque2",
            titulo: "Convénceme con imágenes",
            consigna: [
              "Este reto reúne todo lo del bloque. Vas a escribir un texto para convencer a la clase de algo (por ejemplo, «hay que cuidar el patio»).",
              "Usarás lo aprendido: defenderás tu opinión con argumentos, enriquecerás el texto con familias de palabras y nexos adecuados, y añadirás al menos una comparación y una metáfora para que sea más expresivo.",
            ],
            pasos: [
              "Elige el tema y escribe tu opinión (tu tesis) en una frase.",
              "Añade dos o tres argumentos que la apoyen, enlazándolos con conectores.",
              "Incluye al menos una comparación (con «como») y una metáfora (sin «como»).",
              "Usa palabras de la misma familia o campo semántico para no repetir siempre lo mismo.",
              "Lee tu texto a la clase e intenta convencerla.",
            ],
            criterios: [
              { nombre: "Defiendo mi opinión con argumentos", niveles: ["Opinión clara con varios argumentos bien enlazados.", "Opinión con algún argumento.", "Argumentos flojos o escasos.", "No defiendo mi opinión con argumentos."] },
              { nombre: "Uso una comparación y una metáfora", niveles: ["Uso bien una comparación y una metáfora.", "Uso una de las dos figuras.", "Lo intento, sin lograrlo del todo.", "No uso figuras."] },
              { nombre: "Enriquezco el texto con familias de palabras y nexos", niveles: ["Vocabulario variado y nexos bien usados.", "Vocabulario correcto y algún nexo.", "Vocabulario pobre o nexos mal usados.", "No cuido el vocabulario ni los nexos."] },
            ],
            variantesACS: {
              titulo: "Convénceme con imágenes",
              consigna: ["Vas a decir tu opinión sobre un tema y una comparación bonita."],
              pasos: ["Di tu opinión y una razón: «Yo pienso que... porque...».", "Añade una comparación con «como»: «es... como...»."],
              criterios: [
                { nombre: "Digo mi opinión y una razón", niveles: ["Digo opinión y razón claras.", "Digo la opinión.", "Lo hago con ayuda.", "No lo consigo."] },
                { nombre: "Uso una comparación con «como»", niveles: ["Uso una comparación adecuada.", "Uso una comparación con ayuda.", "Lo intento.", "No lo consigo."] },
              ],
            },
          } },
      ],
    },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};

window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L5_T3_BLOQUE2.id] = UDI_L5_T3_BLOQUE2;
