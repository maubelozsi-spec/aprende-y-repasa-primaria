// ============================================================
// UDI Lengua 6º · 3º Trimestre · SdA 8 "Vamos al teatro"
// (05/05 – 29/05, temporalización del centro 2025-2026).
// Contenidos: los textos teatrales, los complementos directo,
// indirecto y circunstancial, el loísmo/laísmo/leísmo, el punto y
// coma y los puntos suspensivos.
// ============================================================

const UDI_L6_SDA8 = {
  id: "l6-sda8",
  area: "Lengua 6º · T3",
  titulo: "SdA 8 · Vamos al teatro",
  curso: "6",
  bloque: "Lengua · Textos teatrales + CD, CI y CC + Loísmo, laísmo y leísmo + Punto y coma y puntos suspensivos",
  resumen: "05/05 – 29/05. Los textos teatrales, los complementos directo, indirecto y circunstancial, el loísmo/laísmo/leísmo y los signos de puntuación.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "El texto teatral", descripcion: "Diálogo, acotaciones, actos y escenas.", topicId: "texto-teatral" },
      { n: 2, titulo: "De la lectura a la representación", descripcion: "Cómo se monta una obra.", topicId: "texto-teatral" },
      { n: 3, titulo: "El complemento directo e indirecto", descripcion: "Identificar CD y CI.", topicId: "sintactico" },
      { n: 4, titulo: "El complemento circunstancial", descripcion: "Lugar, tiempo, modo.", topicId: "sintactico" },
      { n: 5, titulo: "Loísmo, laísmo y leísmo", descripcion: "Uso correcto de lo, la y le.", topicId: "loismo-laismo-leismo" },
      { n: 6, titulo: "Punto y coma y puntos suspensivos", descripcion: "Cuándo se usan.", topicId: "signos-puntuacion" },
      { n: 7, titulo: "Reto: representamos una escena", descripcion: "Producto final de la SdA." },
      { n: 8, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-teatro", label: "El texto teatral", motor: "lengua-ficha", topicId: "texto-teatral", count: 5 },
      { id: "f-complementos", label: "CD, CI y CC", motor: "lengua-ficha", topicId: "sintactico", count: 6 },
      { id: "f-loismo", label: "Loísmo, laísmo y leísmo", motor: "lengua-ficha", topicId: "loismo-laismo-leismo", count: 5 },
      { id: "f-puntuacion", label: "Signos de puntuación", motor: "lengua-ficha", topicId: "signos-puntuacion", count: 5 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "lengua-examen", tipo: "repaso",
        topics: [{ topicId: "texto-teatral", count: 2 }, { topicId: "sintactico", count: 3 }, { topicId: "loismo-laismo-leismo", count: 2 }, { topicId: "signos-puntuacion", count: 2 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "lengua-examen", tipo: "examen",
        topics: [{ topicId: "texto-teatral", count: 3 }, { topicId: "sintactico", count: 4 }, { topicId: "loismo-laismo-leismo", count: 3 }, { topicId: "signos-puntuacion", count: 3 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "l6-sda8", titulo: "Guía: el teatro, los complementos y la puntuación", subtitulo: "Documento de apoyo de la SdA 8 «Vamos al teatro» (6º).",
          teoria: [
            { heading: "El texto teatral", paragraphs: ["Se escribe para ser representado. Usa el diálogo de los personajes y las acotaciones (entre paréntesis) que indican gestos, tono o escenario. Se organiza en actos y escenas."] },
            { heading: "Los complementos del verbo", paragraphs: ["El complemento directo (CD) recibe la acción y se sustituye por lo/la/los/las. El complemento indirecto (CI) es el destinatario y se sustituye por le/les. El complemento circunstancial (CC) indica lugar, tiempo, modo, cantidad..."] },
            { heading: "Loísmo, laísmo y leísmo", paragraphs: ["Lo/la son para el CD y le para el CI. Es incorrecto usar le para CD (leísmo: «le vi»), la para CI (laísmo: «la dije») o lo para CI (loísmo: «lo dije el secreto»)."] },
            { heading: "Punto y coma y puntos suspensivos", paragraphs: ["El punto y coma (;) separa partes de una enumeración compleja o une oraciones muy relacionadas. Los puntos suspensivos (...) dejan una idea en suspenso, indican duda o interrumpen el enunciado."] },
          ],
          comoCorregir: [
            { tipo: "El texto teatral", explicacion: "Se distingue el diálogo de las acotaciones y se reconocen actos y escenas.", ejemplo: "«(entra corriendo)» → acotación." },
            { tipo: "Los complementos", explicacion: "Se sustituye por el pronombre para comprobar si es CD o CI.", ejemplo: "«Compré el libro» → «lo compré» → CD." },
            { tipo: "Loísmo/laísmo/leísmo", explicacion: "Se comprueba si el pronombre corresponde a CD o a CI.", ejemplo: "«La dije la verdad» → incorrecto (laísmo); lo correcto es «Le dije»." },
            { tipo: "Puntuación", explicacion: "Se comprueba la función del signo en la frase.", ejemplo: "«No sé... quizá mañana» → puntos suspensivos (duda)." },
          ],
          variantesACS: { titulo: "Guía sencilla: el teatro y los signos", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [
              { heading: "El teatro", paragraphs: ["En el teatro los personajes hablan (diálogo) y hay notas sobre lo que hacen (acotaciones)."] },
              { heading: "Los puntos suspensivos", paragraphs: ["Los puntos suspensivos (...) dejan la frase sin acabar."] },
            ],
            comoCorregir: [ { tipo: "Idea principal", explicacion: "Basta reconocer la idea básica.", ejemplo: "«(se ríe)» → acotación." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "l6-sda8", titulo: "Representamos una escena",
          consigna: ["Este reto integra toda la SdA. En grupo vais a escribir y representar una escena teatral breve ante la clase.",
            "Usaréis lo aprendido: el formato del texto teatral con diálogo y acotaciones, oraciones con sus complementos, el uso correcto de lo/la/le y una puntuación cuidada."],
          pasos: ["Elegid una situación y los personajes de vuestra escena.",
            "Escribid el guion con el nombre de cada personaje, sus diálogos y las acotaciones entre paréntesis.",
            "Revisad que usáis bien lo, la y le (sin loísmo, laísmo ni leísmo).",
            "Usad el punto y coma o los puntos suspensivos donde aporten expresividad.",
            "Ensayad y representad la escena ante la clase."],
          criterios: [
            { nombre: "El guion tiene formato teatral (diálogo y acotaciones)", niveles: ["Formato correcto y completo.", "Con algún fallo de formato.", "Formato confuso.", "No tiene formato teatral."] },
            { nombre: "Identifico los complementos del verbo", niveles: ["Identifico CD, CI y CC.", "Identifico dos de ellos.", "Identifico uno.", "No los identifico."] },
            { nombre: "Uso correctamente lo, la y le", niveles: ["Sin errores.", "Con algún error.", "Con bastantes errores.", "No los uso bien."] },
            { nombre: "Representamos con entonación y gestos", niveles: ["Con claridad, entonación y gestos.", "Con claridad, pocos gestos.", "Con dificultad.", "No lo conseguimos."] },
          ],
          variantesACS: { titulo: "Representamos una escena",
            consigna: ["Vas a escribir 4 frases de teatro y representarlas con un compañero."],
            pasos: ["Elige un personaje.", "Escribe 4 frases que diga tu personaje.", "Represéntalas con voz y gestos."],
            criterios: [
              { nombre: "Escribo las frases de mi personaje", niveles: ["Escribo 4 frases claras.", "Escribo 2 o 3.", "Con ayuda.", "No lo consigo."] },
              { nombre: "Represento con voz y gestos", niveles: ["Con voz y gestos.", "Con voz o gestos.", "Con ayuda.", "No lo consigo."] },
            ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L6_SDA8.id] = UDI_L6_SDA8;
