// ============================================================
// UDI Matemáticas 6º · 2º Trimestre · SdA 5 "La energía"
// (02/02 – 26/02, temporalización del centro 2025-2026).
// Contenidos: porcentaje de una cantidad, aumentos y disminuciones
// porcentuales y la relación entre fracción, decimal y porcentaje.
// ============================================================

const UDI_M6_SDA5 = {
  id: "m6-sda5",
  area: "Matemáticas 6º · T2",
  titulo: "SdA 5 · La energía",
  curso: "6",
  bloque: "Matemáticas · Porcentajes y su relación con fracciones y decimales",
  resumen: "02/02 – 26/02. Porcentaje de una cantidad, aumentos y disminuciones porcentuales y la relación entre fracción, decimal y porcentaje.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "El porcentaje de una cantidad", descripcion: "Calcular el tanto por ciento.", topicId: "porcentajes" },
      { n: 2, titulo: "Aumentos porcentuales", descripcion: "Subidas e impuestos.", topicId: "porcentajes" },
      { n: 3, titulo: "Disminuciones porcentuales", descripcion: "Descuentos y rebajas.", topicId: "porcentajes" },
      { n: 4, titulo: "Fracción, decimal y porcentaje", descripcion: "Pasar de una forma a otra.", topicId: "porcentajes" },
      { n: 5, titulo: "Reto: el plan de ahorro energético", descripcion: "Producto final de la SdA." },
      { n: 6, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-porcentajes", label: "Porcentajes", motor: "mate-ficha", topicId: "porcentajes", count: 8 },
      { id: "f-fracciones", label: "Repaso: fracciones y decimales", motor: "mate-ficha", topicId: "fracciones", count: 4 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "porcentajes", count: 5 }, { topicId: "fracciones", count: 3 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "porcentajes", count: 7 }, { topicId: "fracciones", count: 3 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m6-sda5", titulo: "Guía: los porcentajes", subtitulo: "Documento de apoyo de la SdA 5 «La energía» (6º).",
          teoria: [
            { heading: "El porcentaje de una cantidad", paragraphs: ["Un porcentaje es una fracción de denominador 100: 25 % = 25/100. Para calcular el porcentaje de una cantidad se multiplica la cantidad por el número y se divide entre 100."] },
            { heading: "Aumentos y disminuciones", paragraphs: ["En una disminución (descuento) se resta el porcentaje al total; en un aumento (impuesto o subida) se suma. Por ejemplo, un 20 % de descuento sobre 50 € deja el precio en 40 €."] },
            { heading: "Fracción, decimal y porcentaje", paragraphs: ["Las tres formas expresan lo mismo: 1/2 = 0,5 = 50 %. Para pasar de porcentaje a decimal se divide entre 100; de decimal a porcentaje se multiplica por 100."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden calcular porcentajes, aumentos o descuentos, o pasar entre fracción, decimal y porcentaje. La hoja de soluciones da el procedimiento.", ejemplo: "20 % de 50 → 50 × 20 : 100 = 10." } ],
          variantesACS: { titulo: "Guía sencilla: los porcentajes", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [ { heading: "El porcentaje fácil", paragraphs: ["El 50 % es la mitad. El 100 % es todo. El 25 % es la cuarta parte."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con el 50 % y cantidades pares.", ejemplo: "50 % de 20 → 10." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m6-sda5", titulo: "El plan de ahorro energético",
          consigna: ["Este reto integra toda la SdA. Vais a elaborar un plan de ahorro energético para el colegio o para vuestra casa, midiendo el ahorro en porcentajes.",
            "Usaréis lo aprendido: calcularéis porcentajes de una cantidad, aumentos y disminuciones, y expresaréis el mismo dato como fracción, decimal y porcentaje."],
          pasos: ["Anotad un consumo de partida (de luz, agua o papel).",
            "Proponed tres medidas de ahorro y estimad qué porcentaje ahorra cada una.",
            "Calculad el consumo final tras aplicar las disminuciones porcentuales.",
            "Expresad el ahorro total como fracción, como decimal y como porcentaje.",
            "Presentad el plan con un cartel y vuestras conclusiones."],
          criterios: [
            { nombre: "Calculo el porcentaje de una cantidad", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Aplico aumentos y disminuciones porcentuales", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Relaciono fracción, decimal y porcentaje", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Presento el plan con claridad", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "El plan de ahorro energético",
            consigna: ["Vas a calcular la mitad (50 %) de un consumo."],
            pasos: ["Escribe un número par (por ejemplo, 20 litros).", "Calcula su mitad: ese sería el ahorro del 50 %."],
            criterios: [ { nombre: "Calculo la mitad", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Digo el resultado", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M6_SDA5.id] = UDI_M6_SDA5;
