// ============================================================
// UDI Matemáticas 5º · 2º Trimestre · SDA 2 "¿Qué compramos?":
// los números decimales y sus operaciones.
// ============================================================

const UDI_M5_T2_BLOQUE2 = {
  id: "m5-t2-bloque2",
  area: "Matemáticas 5º · T2",
  titulo: "2º Trimestre · SDA 2 · ¿Qué compramos?",
  curso: "5",
  bloque: "Matemáticas · Los números decimales",
  resumen: "Lectura, comparación y redondeo de decimales, y multiplicación y división de decimales.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Los números decimales", descripcion: "Décimas, centésimas y milésimas.", topicId: "decimales" },
      { n: 2, titulo: "Comparar y redondear decimales", descripcion: "Ordenar y aproximar.", topicId: "decimales" },
      { n: 3, titulo: "Multiplicar decimales", descripcion: "Colocar la coma en el producto.", topicId: "decimales-md" },
      { n: 4, titulo: "Dividir decimales", descripcion: "Dividir con la coma.", topicId: "decimales-md" },
      { n: 5, titulo: "Reto: la compra de la semana", descripcion: "Producto final de la SDA." },
      { n: 6, titulo: "Repaso y examen de la SDA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-decimales", label: "Números decimales", motor: "mate-ficha", topicId: "decimales", count: 6 },
      { id: "f-decimales-md", label: "Multiplicación y división de decimales", motor: "mate-ficha", topicId: "decimales-md", count: 6 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SDA combinada)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "decimales", count: 4 }, { topicId: "decimales-md", count: 4 }] },
      { id: "examen", label: "Examen de la SDA (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "decimales", count: 5 }, { topicId: "decimales-md", count: 5 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SDA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m5-t2-bloque2", titulo: "Guía: los números decimales", subtitulo: "Documento de apoyo de la SDA «¿Qué compramos?».",
          teoria: [
            { heading: "Los decimales", paragraphs: ["Los decimales expresan partes de la unidad menores que uno: décimas (0,1), centésimas (0,01) y milésimas (0,001). Para comparar decimales se miran las cifras de izquierda a derecha."] },
            { heading: "Operaciones con decimales", paragraphs: ["Para multiplicar decimales se multiplica como con naturales y se colocan en el producto tantas cifras decimales como tengan entre los dos factores. Al dividir se iguala la coma o se añaden ceros."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden leer, comparar, redondear u operar decimales. La hoja de soluciones da el procedimiento.", ejemplo: "3,25 × 10 = 32,5." } ],
          variantesACS: { titulo: "Guía sencilla: los decimales", subtitulo: "Versión adaptada (ACS, nivel de 3º).",
            teoria: [ { heading: "Los decimales", paragraphs: ["Con el dinero: 1 euro con 50 céntimos se escribe 1,50 €. La coma separa los euros de los céntimos."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con dinero y decimales sencillos.", ejemplo: "2,50 € + 1,00 € = 3,50 €." } ] } } },
      { id: "reto", label: "Reto final de la SDA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m5-t2-bloque2", titulo: "La compra de la semana",
          consigna: ["Este reto reúne lo trabajado. Vais a planificar la compra de la semana con un presupuesto usando números decimales.",
            "Usaréis lo aprendido: leeréis y compararéis precios con decimales, y multiplicaréis y sumaréis para calcular el gasto total."],
          pasos: ["Haced una lista de productos con su precio en euros (con decimales).", "Calculad el precio de comprar varias unidades (multiplicación de decimales).", "Sumad el total de la compra.", "Comprobad si os cabe en un presupuesto de 30 € y calculad el cambio.", "Presentad vuestra compra explicando los cálculos."],
          criterios: [
            { nombre: "Leo y comparo precios con decimales", niveles: ["Sin errores.", "Con algún error.", "Con bastantes errores.", "No lo consigo."] },
            { nombre: "Multiplico decimales para varias unidades", niveles: ["Correctamente.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Calculo el total y el cambio", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "La compra de la semana",
            consigna: ["Vas a sumar precios sencillos con euros y céntimos."],
            pasos: ["Elige 3 productos con precios como 1,00 €, 2,50 € y 0,50 €.", "Suma cuánto cuestan en total."],
            criterios: [ { nombre: "Sumo precios con decimales", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Digo el total", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T2_BLOQUE2.id] = UDI_M5_T2_BLOQUE2;
