// ============================================================
// UDI Lengua 5º · 2º Trimestre · Bloque 2 (mini-SDA sa04+sa05+sa06):
//   sa04 · Textos discontinuos, el anuncio y el cartel (comunicacion-textos)
//   sa05 · El adjetivo (adjetivo)
//   sa06 · La estructura de una obra teatral (texto-teatral)
// ============================================================

const UDI_L5_T2_BLOQUE2 = {
  id: "l5-t2-bloque2",
  area: "Lengua 5º · T2",
  titulo: "2º Trimestre · Bloque 2",
  curso: "5",
  bloque: "Lengua · Textos discontinuos y el cartel + El adjetivo + La estructura teatral",
  resumen: "Agrupa las mini-SDA 4-6 del 2º trimestre con un examen combinado y un reto integrador.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],

  fases: [
    {
      id: "plan", label: "Plan de la UDI", tipo: "plan",
      sesiones: [
        { n: 1, titulo: "sa04 · Los textos discontinuos", descripcion: "Gráficos, tablas, folletos, anuncios y carteles.", topicId: "comunicacion-textos" },
        { n: 2, titulo: "sa04 · El anuncio y el cartel publicitario", descripcion: "Cómo se comunica un mensaje breve y atractivo.", topicId: "comunicacion-textos" },
        { n: 3, titulo: "sa05 · El adjetivo", descripcion: "Qué es y para qué sirve.", topicId: "adjetivo" },
        { n: 4, titulo: "sa05 · Grados del adjetivo y concordancia", descripcion: "Positivo, comparativo y superlativo.", topicId: "adjetivo" },
        { n: 5, titulo: "sa06 · La estructura de una obra teatral", descripcion: "Actos y escenas; planteamiento, nudo y desenlace.", topicId: "texto-teatral" },
        { n: 6, titulo: "sa06 · De la lectura a la representación", descripcion: "Cómo se organiza una obra para representarla.", topicId: "texto-teatral" },
        { n: 7, titulo: "Reto: el cartel de nuestra obra", descripcion: "Producto final del bloque." },
        { n: 8, titulo: "Repaso y examen del bloque", descripcion: "Ficha de repaso y prueba de evaluación." },
      ],
    },
    {
      id: "fichas", label: "Fichas por bloque", tipo: "fichas",
      documentos: [
        { id: "ficha-sa04", label: "sa04 · Textos discontinuos y el cartel", motor: "lengua-ficha", topicId: "comunicacion-textos", count: 5 },
        { id: "ficha-sa05", label: "sa05 · El adjetivo", motor: "lengua-ficha", topicId: "adjetivo", count: 6 },
        { id: "ficha-sa06", label: "sa06 · La estructura teatral", motor: "lengua-ficha", topicId: "texto-teatral", count: 5 },
      ],
    },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    {
      id: "evaluacion", label: "Evaluación", tipo: "evaluacion",
      documentos: [
        { id: "repaso", label: "Ficha de repaso (bloque combinado)", motor: "lengua-examen", tipo: "repaso",
          topics: [{ topicId: "comunicacion-textos", count: 3 }, { topicId: "adjetivo", count: 3 }, { topicId: "texto-teatral", count: 3 }] },
        { id: "examen", label: "Examen del bloque (combinado)", motor: "lengua-examen", tipo: "examen",
          topics: [{ topicId: "comunicacion-textos", count: 4 }, { topicId: "adjetivo", count: 4 }, { topicId: "texto-teatral", count: 4 }] },
        { id: "explicacion", label: "Explicación y solucionario del bloque", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
          args: {
            id: "l5-t2-bloque2",
            titulo: "Guía del bloque: el cartel, el adjetivo y el teatro",
            subtitulo: "Documento de apoyo del Bloque 2 (2º trimestre).",
            teoria: [
              { heading: "Textos discontinuos, anuncio y cartel", paragraphs: ["Los textos discontinuos no se leen de forma lineal: gráficos, tablas, folletos, anuncios y carteles. El cartel publicitario transmite un mensaje breve y llamativo combinando imagen y texto para convencer."] },
              { heading: "El adjetivo", paragraphs: ["El adjetivo acompaña al sustantivo y expresa una cualidad. Concuerda con él en género y número, y tiene grados: positivo (alto), comparativo (más alto que) y superlativo (altísimo, el más alto)."] },
              { heading: "La estructura de una obra teatral", paragraphs: ["Una obra teatral se divide en actos (partes grandes) y escenas (cuando entran o salen personajes), y sigue el planteamiento, el nudo y el desenlace."] },
            ],
            comoCorregir: [
              { tipo: "El cartel", explicacion: "Se identifica el tipo de texto discontinuo o el recurso publicitario (eslogan, imagen).", ejemplo: "«una frase corta y pegadiza» → eslogan." },
              { tipo: "El adjetivo", explicacion: "Se localiza el adjetivo, su concordancia y su grado.", ejemplo: "«el más rápido» → superlativo." },
              { tipo: "El teatro", explicacion: "Se reconoce el acto, la escena o la parte de la estructura.", ejemplo: "«sale un personaje y entra otro» → cambio de escena." },
            ],
            variantesACS: {
              titulo: "Guía sencilla: el cartel, el adjetivo y el teatro",
              subtitulo: "Versión adaptada (ACS, nivel de 3º).",
              teoria: [
                { heading: "El cartel", paragraphs: ["Un cartel usa una imagen y pocas palabras para llamar la atención."] },
                { heading: "El adjetivo", paragraphs: ["El adjetivo dice cómo es algo: grande, azul, rápido."] },
                { heading: "El teatro", paragraphs: ["Una obra de teatro se cuenta por partes: principio, medio y final."] },
              ],
              comoCorregir: [
                { tipo: "Idea principal", explicacion: "Basta con reconocer la idea básica.", ejemplo: "«alto» → es un adjetivo."} ],
            },
          } },
        { id: "reto", label: "Reto final del bloque + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
          args: {
            id: "l5-t2-bloque2",
            titulo: "El cartel de nuestra obra de teatro",
            consigna: [
              "Este reto reúne todo lo del bloque. Vais a imaginar una obra de teatro y diseñar el cartel publicitario que la anuncie.",
              "Usaréis lo aprendido: planificaréis la estructura de la obra (actos y escenas), diseñaréis un cartel (texto discontinuo) atractivo, y en él usaréis adjetivos llamativos para describir la obra.",
            ],
            pasos: [
              "Inventad el título de vuestra obra de teatro y de qué trata.",
              "Escribid en pocas líneas su estructura: qué pasa en el planteamiento, el nudo y el desenlace.",
              "Diseñad el cartel: título, una imagen (o su descripción), fecha y lugar, y un eslogan.",
              "Añadid al cartel varios adjetivos que describan la obra (divertidísima, emocionante...).",
              "Presentad el cartel a la clase explicando vuestras decisiones.",
            ],
            criterios: [
              { nombre: "Planificamos la estructura de la obra (actos/escenas, partes)", niveles: ["La estructura está clara y completa.", "La estructura está, aunque incompleta.", "La estructura es confusa.", "No planificamos la estructura."] },
              { nombre: "El cartel es claro y atractivo (texto discontinuo)", niveles: ["Tiene título, imagen, datos y eslogan bien organizados.", "Tiene casi todos los elementos.", "Le faltan varios elementos.", "No parece un cartel."] },
              { nombre: "Usamos adjetivos adecuados y llamativos", niveles: ["Varios adjetivos variados y bien usados.", "Algunos adjetivos correctos.", "Pocos adjetivos o mal usados.", "No usamos adjetivos."] },
            ],
            variantesACS: {
              titulo: "El cartel de nuestra obra de teatro",
              consigna: ["Vas a hacer un cartel sencillo para anunciar una obra de teatro inventada."],
              pasos: ["Piensa un título para la obra.", "Dibuja o describe una imagen para el cartel.", "Escribe 2 adjetivos que digan cómo es la obra (divertida, bonita...)."],
              criterios: [
                { nombre: "Hago un cartel con título e imagen", niveles: ["Cartel con título e imagen claros.", "Cartel con título o imagen.", "Lo hago con ayuda.", "No consigo hacer el cartel."] },
                { nombre: "Uso 2 adjetivos", niveles: ["Uso 2 adjetivos adecuados.", "Uso 1 adjetivo.", "Uso adjetivos con ayuda.", "No uso adjetivos."] },
              ],
            },
          } },
      ],
    },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};

window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L5_T2_BLOQUE2.id] = UDI_L5_T2_BLOQUE2;
