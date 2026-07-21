// ============================================================
// UDI Matemáticas 6º · 3º Trimestre · SdA 9 "Arquitectos responsables"
// (01/06 – 19/06, temporalización del centro 2025-2026).
// Contenidos: situaciones proporcionales y no proporcionales, tablas
// de proporcionalidad, cálculo de magnitudes proporcionales, escalas,
// tabla de frecuencias y media, moda, mediana y rango.
// ============================================================

const UDI_M6_SDA9 = {
  id: "m6-sda9",
  area: "Matemáticas 6º · T3",
  titulo: "SdA 9 · Arquitectos responsables",
  curso: "6",
  bloque: "Matemáticas · Proporcionalidad y escalas + Estadística",
  resumen: "01/06 – 19/06. Situaciones proporcionales, tablas de proporcionalidad, escalas, tablas de frecuencias y media, moda, mediana y rango.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Situaciones proporcionales y no proporcionales", descripcion: "Distinguirlas.", topicId: "proporcionalidad" },
      { n: 2, titulo: "Tablas de proporcionalidad", descripcion: "Completar y calcular magnitudes.", topicId: "proporcionalidad" },
      { n: 3, titulo: "Las escalas", descripcion: "Calcular e interpretar escalas en planos.", topicId: "proporcionalidad" },
      { n: 4, titulo: "Tablas de frecuencias", descripcion: "Recoger y organizar datos.", topicId: "estadistica" },
      { n: 5, titulo: "Media, moda, mediana y rango", descripcion: "Calcular e interpretar.", topicId: "estadistica" },
      { n: 6, titulo: "Reto: el plano de nuestro edificio sostenible", descripcion: "Producto final de la SdA." },
      { n: 7, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-proporcionalidad", label: "Proporcionalidad y escalas", motor: "mate-ficha", topicId: "proporcionalidad", count: 7 },
      { id: "f-estadistica", label: "Estadística: media, moda y mediana", motor: "mate-ficha", topicId: "estadistica", count: 7 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "proporcionalidad", count: 4 }, { topicId: "estadistica", count: 4 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "proporcionalidad", count: 5 }, { topicId: "estadistica", count: 5 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m6-sda9", titulo: "Guía: proporcionalidad, escalas y estadística", subtitulo: "Documento de apoyo de la SdA 9 «Arquitectos responsables» (6º).",
          teoria: [
            { heading: "La proporcionalidad", paragraphs: ["Dos magnitudes son proporcionales si al multiplicar una, la otra se multiplica igual. La regla de tres resuelve estos problemas: si 2 kg cuestan 6 €, 5 kg cuestan (6 : 2) × 5 = 15 €. No todas las situaciones son proporcionales (la edad y la altura, por ejemplo, no lo son)."] },
            { heading: "Las escalas", paragraphs: ["Una escala indica la relación entre el plano y la realidad. En una escala 1:100, cada centímetro del plano son 100 cm (1 m) en la realidad."] },
            { heading: "Estadística", paragraphs: ["La tabla de frecuencias recoge cuántas veces se repite cada dato. La media se calcula sumando todos los datos y dividiendo entre cuántos son; la moda es el dato más repetido; la mediana es el valor central al ordenarlos; y el rango es la diferencia entre el mayor y el menor."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden completar tablas de proporcionalidad, aplicar escalas o calcular media, moda, mediana y rango. La hoja de soluciones da el procedimiento.", ejemplo: "Media de 4, 6 y 8 → (4+6+8) : 3 = 6. Rango → 8 − 4 = 4." } ],
          variantesACS: { titulo: "Guía sencilla: proporcionalidad y datos", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [ { heading: "Proporcionalidad", paragraphs: ["Si 1 caramelo cuesta 2 €, 2 caramelos cuestan 4 €: el doble de caramelos, el doble de dinero."] }, { heading: "Los datos", paragraphs: ["La moda es lo que más se repite. En un gráfico, la barra más alta."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con dobles y triples y datos sencillos.", ejemplo: "Si 1 vale 3 €, 2 valen 6 €." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m6-sda9", titulo: "El plano de nuestro edificio sostenible",
          consigna: ["Este reto integra toda la SdA y cierra el curso. Vais a diseñar el plano a escala de un edificio sostenible y a analizar con estadística las preferencias de la clase.",
            "Usaréis lo aprendido: la proporcionalidad y las escalas para dibujar el plano, y la tabla de frecuencias con la media, la moda, la mediana y el rango para analizar los datos."],
          pasos: ["Decidid las medidas reales de vuestro edificio y elegid una escala (por ejemplo, 1:100).",
            "Dibujad el plano aplicando la escala y comprobad las medidas con una tabla de proporcionalidad.",
            "Haced una encuesta en clase sobre qué elementos sostenibles preferirían (placas solares, huerto, recogida de agua...).",
            "Organizad los datos en una tabla de frecuencias y calculad la media, la moda, la mediana y el rango.",
            "Presentad el plano y las conclusiones de la encuesta a la clase."],
          criterios: [
            { nombre: "Distingo situaciones proporcionales y uso la regla de tres", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Aplico correctamente la escala en el plano", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Organizo los datos en una tabla de frecuencias", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Calculo media, moda, mediana y rango", niveles: ["Las cuatro correctamente.", "Tres de ellas.", "Alguna, con ayuda.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "El plano de nuestro edificio sostenible",
            consigna: ["Vas a contar votos y decir cuál gana, y a dibujar una habitación en la cuadrícula."],
            pasos: ["Pregunta a 5 compañeros qué prefieren y cuenta los votos.", "Di cuál es la opción más votada (la moda).", "Dibuja una habitación contando cuadraditos."],
            criterios: [ { nombre: "Cuento votos y digo cuál gana", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Dibujo en la cuadrícula", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M6_SDA9.id] = UDI_M6_SDA9;
