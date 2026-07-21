// ============================================================
// UDI Lengua 5º · 1º Trimestre · Bloque 3 (mini-SDA sa07+sa08+sa09):
//   sa07 · Los textos instructivos (textos-instructivos)
//   sa08 · El verbo: tiempos y análisis (verbo)
//   sa09 · La leyenda (narrativa)
// ============================================================

const UDI_L5_T1_BLOQUE3 = {
  id: "l5-t1-bloque3",
  area: "Lengua 5º · T1",
  titulo: "1º Trimestre · Bloque 3",
  curso: "5",
  bloque: "Lengua · Los textos instructivos + Los tiempos verbales + La leyenda",
  resumen: "Agrupa las mini-SDA 7-9 del 1º trimestre con un examen combinado y un reto integrador.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],

  fases: [
    {
      id: "plan", label: "Plan de la UDI", tipo: "plan",
      sesiones: [
        { n: 1, titulo: "sa07 · ¿Qué es un texto instructivo?", descripcion: "Recetas, normas, manuales.", topicId: "textos-instructivos" },
        { n: 2, titulo: "sa07 · Partes y lenguaje de las instrucciones", descripcion: "Título, materiales, pasos, verbos y conectores de orden.", topicId: "textos-instructivos" },
        { n: 3, titulo: "sa08 · Los tiempos verbales", descripcion: "Presente, pasado y futuro; analizar formas verbales.", topicId: "verbo" },
        { n: 4, titulo: "sa08 · Analizamos verbos", descripcion: "Persona, número, tiempo y modo.", topicId: "verbo" },
        { n: 5, titulo: "sa09 · La leyenda", descripcion: "Qué es una leyenda y sus características.", topicId: "narrativa" },
        { n: 6, titulo: "sa09 · Estructura y personajes de la leyenda", descripcion: "Inicio, nudo y desenlace en una leyenda.", topicId: "narrativa" },
        { n: 7, titulo: "Reto: el taller de una leyenda", descripcion: "Producto final del bloque." },
        { n: 8, titulo: "Repaso y examen del bloque", descripcion: "Ficha de repaso y prueba de evaluación." },
      ],
    },
    {
      id: "fichas", label: "Fichas por bloque", tipo: "fichas",
      documentos: [
        { id: "ficha-sa07", label: "sa07 · Los textos instructivos", motor: "lengua-ficha", topicId: "textos-instructivos", count: 5 },
        { id: "ficha-sa08", label: "sa08 · Los tiempos verbales", motor: "lengua-ficha", topicId: "verbo", count: 6 },
        { id: "ficha-sa09", label: "sa09 · La leyenda", motor: "lengua-ficha", topicId: "narrativa", count: 5 },
      ],
    },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    {
      id: "evaluacion", label: "Evaluación", tipo: "evaluacion",
      documentos: [
        { id: "repaso", label: "Ficha de repaso (bloque combinado)", motor: "lengua-examen", tipo: "repaso",
          topics: [{ topicId: "textos-instructivos", count: 3 }, { topicId: "verbo", count: 3 }, { topicId: "narrativa", count: 3 }] },
        { id: "examen", label: "Examen del bloque (combinado)", motor: "lengua-examen", tipo: "examen",
          topics: [{ topicId: "textos-instructivos", count: 4 }, { topicId: "verbo", count: 4 }, { topicId: "narrativa", count: 4 }] },
        { id: "explicacion", label: "Explicación y solucionario del bloque", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
          args: {
            id: "l5-t1-bloque3",
            titulo: "Guía del bloque: instrucciones, tiempos verbales y leyenda",
            subtitulo: "Documento de apoyo del Bloque 3 (1º trimestre).",
            teoria: [
              { heading: "Los textos instructivos", paragraphs: [
                "Explican cómo hacer algo paso a paso. Tienen título, materiales y pasos ordenados, con verbos de instrucción (bate, añade) y conectores de orden (en primer lugar, a continuación, por último).",
              ] },
              { heading: "Los tiempos verbales", paragraphs: [
                "El verbo sitúa la acción en el tiempo: presente (ahora), pasado (antes) y futuro (después). Al analizar un verbo indicamos persona, número, tiempo y modo.",
              ] },
              { heading: "La leyenda", paragraphs: [
                "Una leyenda es un relato tradicional que mezcla hechos reales con elementos fantásticos y suele explicar el origen de algo. Como toda narración, tiene inicio, nudo y desenlace.",
              ] },
            ],
            comoCorregir: [
              { tipo: "Textos instructivos", explicacion: "Se identifica la parte (título, materiales, pasos) o si algo es conector de orden o verbo de instrucción.", ejemplo: "«A continuación,» → conector de orden." },
              { tipo: "Tiempos verbales", explicacion: "Se comprueba si el verbo está en presente, pasado o futuro y su persona.", ejemplo: "«saltará» → futuro, 3.ª persona del singular." },
              { tipo: "La leyenda", explicacion: "Se reconoce el rasgo de la leyenda o la parte de la estructura.", ejemplo: "«explica por qué el río tiene ese nombre» → rasgo de leyenda (explica un origen)." },
            ],
            variantesACS: {
              titulo: "Guía sencilla: instrucciones, tiempos y leyenda",
              subtitulo: "Versión adaptada (ACS, nivel de 3º).",
              teoria: [
                { heading: "Las instrucciones", paragraphs: ["Un texto instructivo dice cómo hacer algo con pasos ordenados: primero, después, por último."] },
                { heading: "El tiempo del verbo", paragraphs: ["El verbo puede estar en presente (ahora), pasado (antes) o futuro (después)."] },
                { heading: "La leyenda", paragraphs: ["Una leyenda es un cuento antiguo con partes fantásticas. Tiene principio, medio y final."] },
              ],
              comoCorregir: [
                { tipo: "Idea principal", explicacion: "Basta con reconocer la idea básica.", ejemplo: "«comió» → pasado." },
              ],
            },
          } },
        { id: "reto", label: "Reto final del bloque + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
          args: {
            id: "l5-t1-bloque3",
            titulo: "El taller de una leyenda",
            consigna: [
              "Este reto reúne todo lo del bloque. Vas a reescribir (o inventar) una leyenda breve y añadirle un pequeño «taller».",
              "Usarás lo aprendido: contarás la leyenda con la estructura de la narración y los verbos en pasado, y escribirás unas instrucciones relacionadas con ella (por ejemplo, «cómo fabricar el amuleto del protagonista»).",
            ],
            pasos: [
              "Elige o inventa una leyenda breve con su inicio, nudo y desenlace.",
              "Escríbela cuidando que los verbos estén en pasado.",
              "Piensa un objeto que aparezca en la leyenda y escribe un texto instructivo para fabricarlo: título, materiales y pasos ordenados.",
              "Usa conectores de orden (en primer lugar, a continuación, por último) en las instrucciones.",
              "Revisa y pasa a limpio la leyenda y el taller.",
            ],
            criterios: [
              { nombre: "Mi leyenda tiene estructura de narración y rasgos de leyenda", niveles: ["Tiene inicio, nudo y desenlace y algún elemento fantástico o de origen.", "Tiene la estructura, aunque sin rasgos claros de leyenda.", "Le falta alguna parte.", "No sigue la estructura de la narración."] },
              { nombre: "Uso los verbos en el tiempo adecuado (pasado)", niveles: ["Los verbos son correctos en toda la leyenda.", "La mayoría son correctos.", "Cometo bastantes errores.", "No uso bien los tiempos verbales."] },
              { nombre: "Escribo unas instrucciones claras y ordenadas", niveles: ["Título, materiales y pasos ordenados con conectores.", "Están las partes, aunque falta orden o conectores.", "Las instrucciones son confusas.", "No escribo el texto instructivo."] },
            ],
            variantesACS: {
              titulo: "El taller de una leyenda",
              consigna: ["Vas a contar una leyenda muy corta y escribir 3 pasos para hacer un objeto de la historia."],
              pasos: ["Cuenta en 2 o 3 frases una historia con algo mágico.", "Escribe 3 pasos ordenados (1, 2, 3) para hacer un objeto de la historia."],
              criterios: [
                { nombre: "Cuento una historia corta con principio, medio y final", niveles: ["Se entienden las tres partes.", "Se entienden dos.", "Una, con ayuda.", "No consigo contarla."] },
                { nombre: "Escribo 3 pasos ordenados", niveles: ["Los 3 pasos están ordenados y claros.", "Los pasos están, aunque desordenados.", "Escribo algún paso con ayuda.", "No escribo los pasos."] },
              ],
            },
          } },
      ],
    },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};

window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L5_T1_BLOQUE3.id] = UDI_L5_T1_BLOQUE3;
