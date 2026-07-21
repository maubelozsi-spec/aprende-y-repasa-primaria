// ============================================================
// UDI Matemáticas 6º · 2º Trimestre · SdA 4 "Nuestra población"
// (08/01 – 30/01, temporalización del centro 2025-2026).
// Contenidos: números decimales (comparar, ordenar y redondear), la
// relación entre decimales y fracciones y las operaciones con
// decimales.
// ============================================================

const UDI_M6_SDA4 = {
  id: "m6-sda4",
  area: "Matemáticas 6º · T2",
  titulo: "SdA 4 · Nuestra población",
  curso: "6",
  bloque: "Matemáticas · Los números decimales y sus operaciones",
  resumen: "08/01 – 30/01. Comparar, ordenar y redondear decimales, su relación con las fracciones y las operaciones con decimales.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Los números decimales", descripcion: "Décimas, centésimas y milésimas.", topicId: "decimales" },
      { n: 2, titulo: "Comparar, ordenar y redondear", descripcion: "Aproximar decimales.", topicId: "decimales" },
      { n: 3, titulo: "Decimales y fracciones", descripcion: "Pasar de uno a otro.", topicId: "decimales" },
      { n: 4, titulo: "Suma y resta de decimales", descripcion: "Colocar bien la coma.", topicId: "decimales" },
      { n: 5, titulo: "Multiplicación y división de decimales", descripcion: "Operar con la coma.", topicId: "decimales-md" },
      { n: 6, titulo: "Reto: el estudio de nuestra población", descripcion: "Producto final de la SdA." },
      { n: 7, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-decimales", label: "Números decimales", motor: "mate-ficha", topicId: "decimales", count: 7 },
      { id: "f-decimales-md", label: "Multiplicación y división de decimales", motor: "mate-ficha", topicId: "decimales-md", count: 7 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "decimales", count: 4 }, { topicId: "decimales-md", count: 4 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "decimales", count: 5 }, { topicId: "decimales-md", count: 5 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m6-sda4", titulo: "Guía: los números decimales", subtitulo: "Documento de apoyo de la SdA 4 «Nuestra población» (6º).",
          teoria: [
            { heading: "Los decimales", paragraphs: ["Expresan partes de la unidad: décimas (0,1), centésimas (0,01) y milésimas (0,001). Para comparar se miran las cifras de izquierda a derecha. Redondear es aproximar al orden que se indique."] },
            { heading: "Decimales y fracciones", paragraphs: ["Toda fracción se puede escribir como decimal dividiendo el numerador entre el denominador (3/4 = 0,75), y un decimal exacto se puede escribir como fracción de denominador 10, 100 o 1000 (0,25 = 25/100 = 1/4)."] },
            { heading: "Operaciones con decimales", paragraphs: ["Para sumar y restar se hacen coincidir las comas. Para multiplicar se opera como con naturales y se colocan tantos decimales como tengan entre los factores. Al dividir se iguala la coma o se añaden ceros."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden comparar, redondear u operar decimales. La hoja de soluciones da el procedimiento.", ejemplo: "3,25 × 10 = 32,5. 0,5 = 1/2." } ],
          variantesACS: { titulo: "Guía sencilla: los decimales", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [ { heading: "Los decimales", paragraphs: ["Con el dinero: 1,50 € es 1 euro y 50 céntimos. La coma separa los euros de los céntimos."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con dinero y decimales sencillos.", ejemplo: "2,50 € + 1,00 € = 3,50 €." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m6-sda4", titulo: "El estudio de nuestra población",
          consigna: ["Este reto integra toda la SdA. Vais a elaborar un pequeño estudio sobre la población de vuestra localidad o comunidad usando números decimales.",
            "Usaréis lo aprendido: compararéis, ordenaréis y redondearéis datos decimales, los relacionaréis con fracciones y haréis operaciones con ellos."],
          pasos: ["Buscad datos de población (habitantes, densidad, porcentajes por edad) con decimales.",
            "Ordenad y redondead esos datos al orden que decidáis.",
            "Expresad alguno de los datos también como fracción.",
            "Calculad con multiplicaciones y divisiones alguna media o proyección.",
            "Presentad el estudio con una tabla y vuestras conclusiones."],
          criterios: [
            { nombre: "Comparo, ordeno y redondeo decimales", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Relaciono decimales y fracciones", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Opero con decimales", niveles: ["Correctamente.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Presento el estudio con claridad", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "El estudio de nuestra población",
            consigna: ["Vas a ordenar 3 números decimales de menor a mayor."],
            pasos: ["Escribe 3 precios o números con coma.", "Ordénalos de menor a mayor."],
            criterios: [ { nombre: "Ordeno decimales", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Explico cuál es el mayor", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M6_SDA4.id] = UDI_M6_SDA4;
