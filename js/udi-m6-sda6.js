// ============================================================
// UDI Matemáticas 6º · 2º Trimestre · SdA 6 "¿Eres de campo o de
// ciudad?" (03/03 – 27/03, temporalización del centro 2025-2026).
// Contenidos: unidades de longitud, de capacidad, de masa y de
// superficie, y resolución de problemas con medidas.
// ============================================================

const UDI_M6_SDA6 = {
  id: "m6-sda6",
  area: "Matemáticas 6º · T2",
  titulo: "SdA 6 · ¿Eres de campo o de ciudad?",
  curso: "6",
  bloque: "Matemáticas · Unidades de longitud, capacidad, masa y superficie",
  resumen: "03/03 – 27/03. Unidades de longitud, capacidad, masa y superficie, sus equivalencias y la resolución de problemas con medidas.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Unidades de longitud", descripcion: "Del km al mm y equivalencias.", topicId: "medidas" },
      { n: 2, titulo: "Unidades de capacidad", descripcion: "El litro y sus múltiplos y submúltiplos.", topicId: "medidas" },
      { n: 3, titulo: "Unidades de masa", descripcion: "El gramo, la tonelada y el quintal.", topicId: "medidas" },
      { n: 4, titulo: "Unidades de superficie", descripcion: "m², sus múltiplos y submúltiplos.", topicId: "medidas" },
      { n: 5, titulo: "Problemas con medidas", descripcion: "Aplicar las equivalencias.", topicId: "medidas" },
      { n: 6, titulo: "Reto: campo y ciudad en cifras", descripcion: "Producto final de la SdA." },
      { n: 7, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-medidas", label: "Medidas y conversiones", motor: "mate-ficha", topicId: "medidas", count: 8 },
      { id: "f-areas", label: "Superficies", motor: "mate-ficha", topicId: "areas", count: 4 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "medidas", count: 5 }, { topicId: "areas", count: 3 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "medidas", count: 7 }, { topicId: "areas", count: 3 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m6-sda6", titulo: "Guía: las unidades de medida", subtitulo: "Documento de apoyo de la SdA 6 «¿Eres de campo o de ciudad?» (6º).",
          teoria: [
            { heading: "Longitud, capacidad y masa", paragraphs: ["Cada unidad es 10 veces mayor que la siguiente: km, hm, dam, m, dm, cm, mm. Para pasar a una unidad menor se multiplica por 10, 100...; a una mayor, se divide. Lo mismo ocurre con el litro (capacidad) y el gramo (masa)."] },
            { heading: "Las unidades de superficie", paragraphs: ["Las unidades de superficie van de 100 en 100, no de 10 en 10: 1 m² = 100 dm² = 10 000 cm². Para pasar a la unidad menor se multiplica por 100 en cada salto."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden convertir unidades y resolver problemas con medidas. La hoja de soluciones da el procedimiento.", ejemplo: "3 km = 3000 m. 2 m² = 200 dm²." } ],
          variantesACS: { titulo: "Guía sencilla: las medidas", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [ { heading: "Medidas básicas", paragraphs: ["1 metro = 100 centímetros. 1 kilo = 1000 gramos. 1 litro = 1000 mililitros."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con metros y centímetros.", ejemplo: "2 m = 200 cm." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m6-sda6", titulo: "Campo y ciudad en cifras",
          consigna: ["Este reto integra toda la SdA. Vais a comparar la vida en el campo y en la ciudad usando medidas reales.",
            "Usaréis lo aprendido: convertiréis unidades de longitud, capacidad, masa y superficie para poder comparar los datos."],
          pasos: ["Elegid un pueblo y una ciudad y buscad datos: superficie, distancia entre ellos, consumo de agua, producción agrícola...",
            "Convertid todos los datos a la misma unidad para poder compararlos.",
            "Calculad, por ejemplo, cuántos campos de fútbol cabrían en cada superficie.",
            "Elaborad una tabla comparativa con las unidades bien indicadas.",
            "Presentad vuestras conclusiones a la clase."],
          criterios: [
            { nombre: "Convierto unidades de longitud, capacidad y masa", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Convierto unidades de superficie (de 100 en 100)", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Comparo los datos con la misma unidad", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Presento la comparación con claridad", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "Campo y ciudad en cifras",
            consigna: ["Vas a medir dos objetos y decir cuál es más largo."],
            pasos: ["Mide dos objetos de clase con la regla, en centímetros.", "Di cuál es más largo.", "Convierte una medida a metros si pasa de 100 cm."],
            criterios: [ { nombre: "Mido en centímetros", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Comparo las medidas", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M6_SDA6.id] = UDI_M6_SDA6;
