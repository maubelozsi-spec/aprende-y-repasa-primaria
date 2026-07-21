// ============================================================
// UDI Matemáticas 5º · 3º Trimestre · SDA 3 "¿Qué propuesta
// votarías?": estadística (gráficos, media y moda) y probabilidad.
// ============================================================

const UDI_M5_T3_BLOQUE3 = {
  id: "m5-t3-bloque3",
  area: "Matemáticas 5º · T3",
  titulo: "3º Trimestre · SDA 3 · ¿Qué propuesta votarías?",
  curso: "5",
  bloque: "Matemáticas · Estadística y probabilidad",
  resumen: "Recogida y representación de datos en gráficos, media y moda, y la probabilidad de un suceso.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Recoger datos y hacer gráficos", descripcion: "Tablas y diagramas de barras.", topicId: "estadistica" },
      { n: 2, titulo: "La media y la moda", descripcion: "Calcular e interpretar.", topicId: "estadistica" },
      { n: 3, titulo: "Sucesos y probabilidad", descripcion: "Seguro, posible e imposible.", topicId: "probabilidad" },
      { n: 4, titulo: "Calcular probabilidades sencillas", descripcion: "Casos favorables entre posibles.", topicId: "probabilidad" },
      { n: 5, titulo: "Reto: la encuesta de la clase", descripcion: "Producto final de la SDA." },
      { n: 6, titulo: "Repaso y examen de la SDA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-estadistica", label: "Estadística (media y moda)", motor: "mate-ficha", topicId: "estadistica", count: 6 },
      { id: "f-probabilidad", label: "Probabilidad", motor: "mate-ficha", topicId: "probabilidad", count: 6 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SDA combinada)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "estadistica", count: 4 }, { topicId: "probabilidad", count: 4 }] },
      { id: "examen", label: "Examen de la SDA (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "estadistica", count: 5 }, { topicId: "probabilidad", count: 5 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SDA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m5-t3-bloque3", titulo: "Guía: estadística y probabilidad", subtitulo: "Documento de apoyo de la SDA «¿Qué propuesta votarías?».",
          teoria: [
            { heading: "Estadística", paragraphs: ["Los datos se recogen en tablas y se representan en diagramas de barras. La media se calcula sumando todos los datos y dividiendo entre cuántos son. La moda es el dato que más se repite."] },
            { heading: "Probabilidad", paragraphs: ["Un suceso puede ser seguro, posible o imposible. La probabilidad se calcula dividiendo los casos favorables entre los casos posibles: al lanzar un dado, la probabilidad de sacar un 3 es 1 entre 6."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden interpretar gráficos, calcular media/moda o probabilidades sencillas. La hoja de soluciones da el procedimiento.", ejemplo: "Media de 4, 6 y 8 → (4+6+8) : 3 = 6." } ],
          variantesACS: { titulo: "Guía sencilla: datos y probabilidad", subtitulo: "Versión adaptada (ACS, nivel de 3º).",
            teoria: [ { heading: "Datos y azar", paragraphs: ["Un gráfico de barras dice qué opción tiene más votos. Un suceso seguro pasa siempre; uno imposible no puede pasar."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Leyendo la barra más alta y con seguro/posible/imposible.", ejemplo: "¿La barra más alta? → la opción con más votos." } ] } } },
      { id: "reto", label: "Reto final de la SDA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m5-t3-bloque3", titulo: "La encuesta de la clase",
          consigna: ["Este reto reúne lo trabajado. Vais a hacer una encuesta en clase sobre una propuesta y presentar los resultados.",
            "Usaréis lo aprendido: recogeréis datos, haréis un gráfico, calcularéis la media o la moda y comentaréis alguna probabilidad."],
          pasos: ["Elegid la pregunta de la encuesta y las opciones a votar.", "Recoged los votos de la clase en una tabla.", "Haced un diagrama de barras con los resultados.", "Calculad la moda (la opción más votada) y alguna media si procede.", "Comentad qué probabilidad hay de que, al elegir a un compañero al azar, haya votado la opción ganadora.", "Presentad las conclusiones a la clase."],
          criterios: [
            { nombre: "Recojo los datos y hago el gráfico", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Calculo la media o la moda", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Interpreto una probabilidad sencilla", niveles: ["Correctamente.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "La encuesta de la clase",
            consigna: ["Vas a contar votos y decir cuál gana."],
            pasos: ["Cuenta cuántos votos tiene cada opción.", "Di cuál es la opción más votada (la moda)."],
            criterios: [ { nombre: "Cuento los votos", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Digo cuál gana", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T3_BLOQUE3.id] = UDI_M5_T3_BLOQUE3;
