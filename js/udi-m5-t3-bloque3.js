// ============================================================
// UDI Matemáticas 5º · 3º Trimestre · Tema 9 (SM): "La ciudad medieval
// / Viajando a América / La ciudad moderna".
// Contenido (programación oficial): los porcentajes (aumentos y
// disminuciones porcentuales) y el cambio de unidades de tiempo.
// Producto/reto: folleto para publicitar un mercado medieval aplicando
// porcentajes (descuentos e impuestos).
// ============================================================

const UDI_M5_T3_BLOQUE3 = {
  id: "m5-t3-bloque3",
  area: "Matemáticas 5º · T3",
  titulo: "3º Trimestre · Tema 9 · La ciudad medieval",
  curso: "5",
  bloque: "Matemáticas · Porcentajes + El tiempo",
  resumen: "Los porcentajes, aumentos y disminuciones porcentuales, y el cambio de unidades de tiempo.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Qué es un porcentaje", descripcion: "El tanto por ciento sobre 100.", topicId: "porcentajes" },
      { n: 2, titulo: "Aumentos y disminuciones porcentuales", descripcion: "Descuentos e impuestos.", topicId: "porcentajes" },
      { n: 3, titulo: "Las unidades de tiempo", descripcion: "Horas, minutos y segundos.", topicId: "tiempo" },
      { n: 4, titulo: "Cambio de unidades de tiempo", descripcion: "Convertir y operar con el tiempo.", topicId: "tiempo" },
      { n: 5, titulo: "Reto: el folleto del mercado medieval", descripcion: "Producto final del tema." },
      { n: 6, titulo: "Repaso y examen del tema", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-porcentajes", label: "Porcentajes", motor: "mate-ficha", topicId: "porcentajes", count: 6 },
      { id: "f-tiempo", label: "El tiempo", motor: "mate-ficha", topicId: "tiempo", count: 6 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (tema combinado)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "porcentajes", count: 4 }, { topicId: "tiempo", count: 4 }] },
      { id: "examen", label: "Examen del tema (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "porcentajes", count: 5 }, { topicId: "tiempo", count: 5 }] },
      { id: "explicacion", label: "Explicación y solucionario del tema", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m5-t3-bloque3", titulo: "Guía: los porcentajes y el tiempo", subtitulo: "Documento de apoyo del Tema 9 «La ciudad medieval».",
          teoria: [
            { heading: "Los porcentajes", paragraphs: ["Un porcentaje es una fracción de denominador 100: 25 % = 25/100. Para calcular el porcentaje de una cantidad se multiplica la cantidad por el número y se divide entre 100. En un descuento se resta ese porcentaje; en un aumento (o impuesto) se suma."] },
            { heading: "El tiempo", paragraphs: ["1 hora = 60 minutos y 1 minuto = 60 segundos. Para cambiar de unidad se multiplica o se divide por 60. Al calcular duraciones hay que recordar que el tiempo va de 60 en 60, no de 10 en 10."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden calcular porcentajes (y aumentos/descuentos) y convertir u operar con el tiempo. La hoja de soluciones da el procedimiento.", ejemplo: "20 % de 50 → 50 × 20 : 100 = 10. 2 h = 120 min." } ],
          variantesACS: { titulo: "Guía sencilla: porcentajes y tiempo", subtitulo: "Versión adaptada (ACS, nivel de 3º).",
            teoria: [ { heading: "Porcentajes y tiempo", paragraphs: ["El 50 % es la mitad; el 100 % es todo. 1 hora tiene 60 minutos."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con el 50 % (la mitad) y horas en punto.", ejemplo: "50 % de 10 → 5." } ] } } },
      { id: "reto", label: "Reto final del tema + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m5-t3-bloque3", titulo: "El folleto del mercado medieval",
          consigna: ["Este es el reto que integra el tema. Vais a elaborar un folleto para publicitar un mercado medieval con varios puestos.",
            "Usaréis lo aprendido: pondréis precio a los productos aplicando porcentajes (descuentos e impuestos), y organizaréis los horarios de los puestos usando las unidades de tiempo."],
          pasos: ["Inventad varios puestos del mercado y sus productos con un precio inicial.", "Aplicad a algunos productos un descuento en porcentaje y a otros un impuesto (aumento porcentual); calculad el precio final.", "Organizad los horarios de apertura de los puestos (en horas y minutos) y calculad cuánto tiempo está abierto cada uno.", "Diseñad el folleto con los precios y los horarios.", "Presentad el folleto explicando los cálculos de porcentajes y de tiempo."],
          criterios: [
            { nombre: "Aplico porcentajes (descuentos y aumentos)", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Calculo y convierto unidades de tiempo", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Presento el folleto con claridad", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "El folleto del mercado medieval",
            consigna: ["Vas a calcular la mitad de precio (50 % de descuento) y leer una hora en el reloj."],
            pasos: ["Elige un producto con precio par (por ejemplo 10 €) y calcula su mitad.", "Di qué hora marca un reloj (en punto)."],
            criterios: [ { nombre: "Calculo la mitad del precio", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Leo la hora", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T3_BLOQUE3.id] = UDI_M5_T3_BLOQUE3;
