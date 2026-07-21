// ============================================================
// UDI Lengua 5º · 3º Trimestre · Bloque 3 (mini-SDA sa07+sa08+sa09):
//   sa07 · La noticia (comunicacion-textos)
//   sa08 · El sujeto y el predicado. Voz activa y pasiva (sintactico)
//   sa09 · La hipérbole (poesia)
// ============================================================

const UDI_L5_T3_BLOQUE3 = {
  id: "l5-t3-bloque3",
  area: "Lengua 5º · T3",
  titulo: "3º Trimestre · Bloque 3",
  curso: "5",
  bloque: "Lengua · La noticia + El sujeto y el predicado + La hipérbole",
  resumen: "Agrupa las mini-SDA 7-9 del 3º trimestre con un examen combinado y un reto integrador.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],

  fases: [
    {
      id: "plan", label: "Plan de la UDI", tipo: "plan",
      sesiones: [
        { n: 1, titulo: "sa07 · La noticia", descripcion: "Qué es y sus partes (titular, entradilla, cuerpo).", topicId: "comunicacion-textos" },
        { n: 2, titulo: "sa07 · Las preguntas de la noticia", descripcion: "Qué, quién, cuándo, dónde, cómo y por qué.", topicId: "comunicacion-textos" },
        { n: 3, titulo: "sa08 · El sujeto y el predicado", descripcion: "Las dos partes de la oración.", topicId: "sintactico" },
        { n: 4, titulo: "sa08 · Voz activa y voz pasiva", descripcion: "Quién hace y quién recibe la acción.", topicId: "sintactico" },
        { n: 5, titulo: "sa09 · La hipérbole", descripcion: "La exageración como recurso literario.", topicId: "poesia" },
        { n: 6, titulo: "sa09 · Jugamos con la exageración", descripcion: "Crear hipérboles con intención.", topicId: "poesia" },
        { n: 7, titulo: "Reto: la noticia más exagerada", descripcion: "Producto final del bloque." },
        { n: 8, titulo: "Repaso y examen del bloque", descripcion: "Ficha de repaso y prueba de evaluación." },
      ],
    },
    {
      id: "fichas", label: "Fichas por bloque", tipo: "fichas",
      documentos: [
        { id: "ficha-sa07", label: "sa07 · La noticia", motor: "lengua-ficha", topicId: "comunicacion-textos", count: 5 },
        { id: "ficha-sa08", label: "sa08 · El sujeto y el predicado", motor: "lengua-ficha", topicId: "sintactico", count: 6 },
        { id: "ficha-sa09", label: "sa09 · La hipérbole y los recursos", motor: "lengua-ficha", topicId: "poesia", count: 5 },
      ],
    },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    {
      id: "evaluacion", label: "Evaluación", tipo: "evaluacion",
      documentos: [
        { id: "repaso", label: "Ficha de repaso (bloque combinado)", motor: "lengua-examen", tipo: "repaso",
          topics: [{ topicId: "comunicacion-textos", count: 3 }, { topicId: "sintactico", count: 3 }, { topicId: "poesia", count: 3 }] },
        { id: "examen", label: "Examen del bloque (combinado)", motor: "lengua-examen", tipo: "examen",
          topics: [{ topicId: "comunicacion-textos", count: 4 }, { topicId: "sintactico", count: 4 }, { topicId: "poesia", count: 4 }] },
        { id: "explicacion", label: "Explicación y solucionario del bloque", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
          args: {
            id: "l5-t3-bloque3",
            titulo: "Guía del bloque: la noticia, la oración y la hipérbole",
            subtitulo: "Documento de apoyo del Bloque 3 (3º trimestre).",
            teoria: [
              { heading: "La noticia", paragraphs: ["La noticia cuenta un hecho reciente de forma objetiva. Tiene titular, entradilla (resumen) y cuerpo, y responde a: qué, quién, cuándo, dónde, cómo y por qué."] },
              { heading: "El sujeto y el predicado", paragraphs: ["La oración tiene sujeto (de quién se dice algo) y predicado (lo que se dice del sujeto). En la voz activa el sujeto realiza la acción; en la voz pasiva el sujeto la recibe."] },
              { heading: "La hipérbole", paragraphs: ["La hipérbole es una exageración intencionada para dar fuerza a lo que se dice: «te lo he dicho un millón de veces»."] },
            ],
            comoCorregir: [
              { tipo: "La noticia", explicacion: "Se identifican las partes de la noticia o las preguntas a las que responde.", ejemplo: "«¿Cuándo ocurrió?» → una de las 6 preguntas de la noticia." },
              { tipo: "Sujeto y predicado", explicacion: "Se localiza el sujeto (concuerda con el verbo) y el predicado.", ejemplo: "«Los niños / juegan en el patio» → sujeto / predicado." },
              { tipo: "La hipérbole", explicacion: "Se reconoce la exageración como recurso.", ejemplo: "«pesa una tonelada» → hipérbole." },
            ],
            variantesACS: {
              titulo: "Guía sencilla: la noticia, la oración y la exageración",
              subtitulo: "Versión adaptada (ACS, nivel de 3º).",
              teoria: [
                { heading: "La noticia", paragraphs: ["Una noticia cuenta algo que ha pasado. Dice qué, quién, cuándo y dónde."] },
                { heading: "Sujeto y predicado", paragraphs: ["El sujeto es quien hace la acción; el predicado es lo que hace: «El perro / ladra»."] },
                { heading: "La exageración", paragraphs: ["La hipérbole es exagerar mucho algo: «tengo un hambre que me comería una vaca»."] },
              ],
              comoCorregir: [ { tipo: "Idea principal", explicacion: "Basta reconocer la idea básica.", ejemplo: "«El gato duerme» → sujeto: El gato." } ],
            },
          } },
        { id: "reto", label: "Reto final del bloque + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
          args: {
            id: "l5-t3-bloque3",
            titulo: "La noticia más exagerada",
            consigna: [
              "Este reto reúne todo lo del bloque. Vas a escribir una noticia humorística sobre un hecho inventado y divertido del cole.",
              "Usarás lo aprendido: darás forma de noticia (titular y cuerpo con las preguntas qué, quién, cuándo...), la llenarás de hipérboles graciosas, y comprobarás el sujeto y el predicado de tus titulares.",
            ],
            pasos: [
              "Inventa un hecho divertido (por ejemplo, «un bocadillo gigante invade el comedor»).",
              "Escribe un titular llamativo y un cuerpo que responda a qué, quién, cuándo, dónde, cómo y por qué.",
              "Añade al menos dos hipérboles (exageraciones) para hacerla más graciosa.",
              "Subraya el sujeto y el predicado de tu titular y de otra oración.",
              "Lee tu noticia a la clase.",
            ],
            criterios: [
              { nombre: "Mi texto tiene forma de noticia (titular y las preguntas)", niveles: ["Tiene titular y responde a las preguntas de la noticia.", "Tiene titular y responde a algunas preguntas.", "Le falta estructura de noticia.", "No tiene forma de noticia."] },
              { nombre: "Uso la hipérbole con intención humorística", niveles: ["Uso varias hipérboles bien logradas.", "Uso alguna hipérbole.", "Lo intento, sin lograrlo.", "No uso hipérboles."] },
              { nombre: "Identifico el sujeto y el predicado", niveles: ["Identifico bien sujeto y predicado en varias oraciones.", "Los identifico en una oración.", "Los identifico con ayuda.", "No los identifico."] },
            ],
            variantesACS: {
              titulo: "La noticia más exagerada",
              consigna: ["Vas a escribir un titular divertido y muy exagerado sobre algo del cole."],
              pasos: ["Piensa algo divertido que podría pasar en el cole.", "Escribe un titular exagerado: «¡El patio más grande del mundo!».", "Di quién sale en la noticia (el sujeto)."],
              criterios: [
                { nombre: "Escribo un titular exagerado", niveles: ["Titular claro y exagerado.", "Titular con ayuda.", "Lo intento.", "No lo consigo."] },
                { nombre: "Digo de quién habla la noticia (sujeto)", niveles: ["Lo digo bien.", "Lo digo con ayuda.", "Lo intento.", "No lo consigo."] },
              ],
            },
          } },
      ],
    },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};

window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L5_T3_BLOQUE3.id] = UDI_L5_T3_BLOQUE3;
