// ============================================================
// UDI Lengua 6º · 1º Trimestre · SdA 2 "Conversando con humor"
// (20/10 – 14/11, temporalización del centro 2025-2026).
// Contenidos: el diálogo, los determinantes, los pronombres, las
// clases de palabras y diptongo, hiato y triptongo.
// ============================================================

const UDI_L6_SDA2 = {
  id: "l6-sda2",
  area: "Lengua 6º · T1",
  titulo: "SdA 2 · Conversando con humor",
  curso: "6",
  bloque: "Lengua · El diálogo + Determinantes y pronombres + Clases de palabras + Diptongo, hiato y triptongo",
  resumen: "20/10 – 14/11. El diálogo, los determinantes, los pronombres, las clases de palabras y el diptongo, el hiato y el triptongo.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "El diálogo", descripcion: "Estructura, turnos y rayas de diálogo.", topicId: "dialogo-debate-argumentativo" },
      { n: 2, titulo: "Los determinantes", descripcion: "Artículos, demostrativos, posesivos, numerales e indefinidos.", topicId: "determinantes" },
      { n: 3, titulo: "Los pronombres", descripcion: "Personales y su función.", topicId: "sustantivo-pronombre" },
      { n: 4, titulo: "Las clases de palabras", descripcion: "Análisis morfológico de la oración.", topicId: "morfologico" },
      { n: 5, titulo: "Diptongo, hiato y triptongo", descripcion: "Separar sílabas y acentuar.", topicId: "ortografia" },
      { n: 6, titulo: "Reto: una conversación con humor", descripcion: "Producto final de la SdA." },
      { n: 7, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-dialogo", label: "El diálogo", motor: "lengua-ficha", topicId: "dialogo-debate-argumentativo", count: 5 },
      { id: "f-determinantes", label: "Los determinantes", motor: "lengua-ficha", topicId: "determinantes", count: 5 },
      { id: "f-pronombres", label: "Los pronombres", motor: "lengua-ficha", topicId: "sustantivo-pronombre", count: 5 },
      { id: "f-morfologico", label: "Clases de palabras", motor: "lengua-ficha", topicId: "morfologico", count: 5 },
      { id: "f-diptongo", label: "Diptongo, hiato y triptongo", motor: "lengua-ficha", topicId: "ortografia", count: 5 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "lengua-examen", tipo: "repaso",
        topics: [{ topicId: "dialogo-debate-argumentativo", count: 2 }, { topicId: "determinantes", count: 2 }, { topicId: "sustantivo-pronombre", count: 2 }, { topicId: "morfologico", count: 2 }, { topicId: "ortografia", count: 2 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "lengua-examen", tipo: "examen",
        topics: [{ topicId: "dialogo-debate-argumentativo", count: 3 }, { topicId: "determinantes", count: 3 }, { topicId: "sustantivo-pronombre", count: 3 }, { topicId: "morfologico", count: 3 }, { topicId: "ortografia", count: 3 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "l6-sda2", titulo: "Guía: el diálogo, determinantes, pronombres y diptongos", subtitulo: "Documento de apoyo de la SdA 2 «Conversando con humor» (6º).",
          teoria: [
            { heading: "El diálogo", paragraphs: ["El diálogo reproduce la conversación entre dos o más personajes. En el texto escrito, cada intervención empieza con una raya (—). Debe respetar los turnos de palabra y adaptarse a la situación."] },
            { heading: "Determinantes y pronombres", paragraphs: ["Los determinantes acompañan al sustantivo y lo concretan (el, este, mi, dos, algún). Los pronombres personales sustituyen al sustantivo (yo, tú, él, nosotros...) y evitan repetirlo."] },
            { heading: "Las clases de palabras", paragraphs: ["Las palabras se clasifican en sustantivos, adjetivos, determinantes, pronombres, verbos, adverbios, preposiciones y conjunciones. Analizar morfológicamente es indicar la clase de cada palabra."] },
            { heading: "Diptongo, hiato y triptongo", paragraphs: ["Diptongo: dos vocales en la misma sílaba (cau-sa). Triptongo: tres vocales juntas en una sílaba (a-ve-ri-guáis). Hiato: dos vocales seguidas en sílabas distintas (le-ón, dí-a)."] },
          ],
          comoCorregir: [
            { tipo: "El diálogo", explicacion: "Se comprueba el uso de la raya y el respeto de los turnos.", ejemplo: "«—¿Qué tal?» → intervención con raya de diálogo." },
            { tipo: "Determinantes y pronombres", explicacion: "Se distingue si acompaña al nombre (determinante) o lo sustituye (pronombre).", ejemplo: "«mi libro» → determinante; «el mío» → pronombre." },
            { tipo: "Clases de palabras", explicacion: "Se indica la clase de cada palabra de la oración.", ejemplo: "«corre rápido» → verbo + adverbio." },
            { tipo: "Diptongo/hiato", explicacion: "Se separa en sílabas y se observa si las vocales van juntas o separadas.", ejemplo: "«pa-ís» → hiato." },
          ],
          variantesACS: { titulo: "Guía sencilla: hablar por turnos y las palabras", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [
              { heading: "El diálogo", paragraphs: ["En un diálogo hablan dos personas por turnos. Cada vez que habla uno se pone una raya (—)."] },
              { heading: "Los determinantes", paragraphs: ["Van delante del nombre: el, la, mi, este, dos."] },
            ],
            comoCorregir: [ { tipo: "Idea principal", explicacion: "Basta reconocer la idea básica.", ejemplo: "«mi» → determinante." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "l6-sda2", titulo: "Una conversación con humor",
          consigna: ["Este reto integra toda la SdA. En pareja vais a escribir y representar un diálogo humorístico entre dos personajes.",
            "Usaréis lo aprendido: el formato del diálogo con rayas y turnos, determinantes y pronombres bien empleados, y palabras con diptongo, hiato o triptongo."],
          pasos: ["Elegid dos personajes y una situación divertida.",
            "Escribid el diálogo usando la raya (—) en cada intervención.",
            "Cuidad los determinantes y usad pronombres para no repetir los nombres.",
            "Incluid al menos tres palabras con diptongo, hiato o triptongo y señaladlas.",
            "Representad el diálogo ante la clase con la entonación adecuada."],
          criterios: [
            { nombre: "Escribimos un diálogo bien formateado y con turnos", niveles: ["Rayas y turnos correctos.", "Con algún fallo de formato.", "Formato confuso.", "No tiene formato de diálogo."] },
            { nombre: "Usamos bien determinantes y pronombres", niveles: ["Correctos y variados.", "Correctos pero repetitivos.", "Con bastantes errores.", "No los usamos bien."] },
            { nombre: "Identificamos diptongos, hiatos o triptongos", niveles: ["Identificamos varios correctamente.", "Identificamos alguno.", "Con ayuda.", "No los identificamos."] },
            { nombre: "Representamos con entonación adecuada", niveles: ["Con claridad y entonación.", "Con claridad, poca entonación.", "Con dificultad.", "No lo conseguimos."] },
          ],
          variantesACS: { titulo: "Una conversación con humor",
            consigna: ["Vas a escribir un diálogo muy corto (4 frases) entre dos personajes."],
            pasos: ["Elige dos personajes.", "Escribe 4 frases, poniendo una raya (—) cada vez que habla uno.", "Léelo en voz alta con un compañero."],
            criterios: [
              { nombre: "Escribo un diálogo con rayas", niveles: ["Uso bien las rayas.", "Uso alguna raya.", "Con ayuda.", "No lo consigo."] },
              { nombre: "Leo mi diálogo en voz alta", niveles: ["Con voz clara.", "Aunque bajo.", "Con ayuda.", "No lo consigo."] },
            ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L6_SDA2.id] = UDI_L6_SDA2;
