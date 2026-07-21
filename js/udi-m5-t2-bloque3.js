// ============================================================
// UDI Matemáticas 5º · 2º Trimestre · SDA 3 "La ciudad medieval":
// porcentajes y proporcionalidad (regla de tres).
// ============================================================

const UDI_M5_T2_BLOQUE3 = {
  id: "m5-t2-bloque3",
  area: "Matemáticas 5º · T2",
  titulo: "2º Trimestre · SDA 3 · La ciudad medieval",
  curso: "5",
  bloque: "Matemáticas · Porcentajes y proporcionalidad",
  resumen: "El porcentaje como fracción de 100, cálculo de porcentajes y proporcionalidad (regla de tres).",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Qué es un porcentaje", descripcion: "Tanto por ciento sobre 100.", topicId: "porcentajes" },
      { n: 2, titulo: "Calcular porcentajes", descripcion: "El % de una cantidad.", topicId: "porcentajes" },
      { n: 3, titulo: "Proporcionalidad", descripcion: "Magnitudes proporcionales.", topicId: "proporcionalidad" },
      { n: 4, titulo: "La regla de tres", descripcion: "Resolver problemas de proporcionalidad.", topicId: "proporcionalidad" },
      { n: 5, titulo: "Reto: el mercado medieval", descripcion: "Producto final de la SDA." },
      { n: 6, titulo: "Repaso y examen de la SDA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-porcentajes", label: "Porcentajes", motor: "mate-ficha", topicId: "porcentajes", count: 6 },
      { id: "f-proporcionalidad", label: "Proporcionalidad (regla de tres)", motor: "mate-ficha", topicId: "proporcionalidad", count: 6 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SDA combinada)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "porcentajes", count: 4 }, { topicId: "proporcionalidad", count: 4 }] },
      { id: "examen", label: "Examen de la SDA (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "porcentajes", count: 5 }, { topicId: "proporcionalidad", count: 5 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SDA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m5-t2-bloque3", titulo: "Guía: porcentajes y proporcionalidad", subtitulo: "Documento de apoyo de la SDA «La ciudad medieval».",
          teoria: [
            { heading: "Los porcentajes", paragraphs: ["Un porcentaje es una fracción de denominador 100: 25 % = 25/100. Para calcular el porcentaje de una cantidad se multiplica la cantidad por el número y se divide entre 100."] },
            { heading: "La proporcionalidad", paragraphs: ["Dos magnitudes son proporcionales si al multiplicar una, la otra se multiplica igual. La regla de tres resuelve estos problemas: si 2 kg cuestan 6 €, 5 kg cuestan (6 : 2) × 5 = 15 €."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden calcular porcentajes o resolver con regla de tres. La hoja de soluciones da el procedimiento.", ejemplo: "20 % de 50 → 50 × 20 : 100 = 10." } ],
          variantesACS: { titulo: "Guía sencilla: porcentajes", subtitulo: "Versión adaptada (ACS, nivel de 3º).",
            teoria: [ { heading: "El porcentaje fácil", paragraphs: ["El 50 % es la mitad. El 100 % es todo. El 10 % es una parte de cada diez."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con 50 % (la mitad) y cantidades pequeñas.", ejemplo: "50 % de 10 → 5." } ] } } },
      { id: "reto", label: "Reto final de la SDA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m5-t2-bloque3", titulo: "El mercado medieval",
          consigna: ["Este reto reúne lo trabajado. Vais a montar un puesto de un mercado medieval con precios, descuentos y ofertas.",
            "Usaréis lo aprendido: aplicaréis porcentajes de descuento y resolveréis con regla de tres las ofertas por cantidad."],
          pasos: ["Poned precio a varios productos de vuestro puesto.", "Aplicad un descuento en porcentaje (por ejemplo, 20 %) y calculad el precio final.", "Preparad una oferta del tipo «3 unidades por X €» y calculad con regla de tres el precio de otras cantidades.", "Haced un cartel con los precios y las ofertas.", "Explicad los cálculos a un «cliente» de la clase."],
          criterios: [
            { nombre: "Calculo porcentajes de descuento", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Resuelvo ofertas con regla de tres", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Presento los precios con claridad", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "El mercado medieval",
            consigna: ["Vas a calcular la mitad de precio (50 % de descuento) en algunos productos."],
            pasos: ["Elige 3 productos con precios pares (por ejemplo, 10 €, 6 €, 4 €).", "Calcula cuánto cuestan con la mitad de precio."],
            criterios: [ { nombre: "Calculo la mitad del precio", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Digo el precio final", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T2_BLOQUE3.id] = UDI_M5_T2_BLOQUE3;
