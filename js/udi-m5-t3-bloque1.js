// ============================================================
// UDI Matemáticas 5º · 3º Trimestre · Tema 7 (SM): "¡Tú y yo iguales!
// / Cuadriculamos España / ¿Qué propuesta votarías?".
// Contenido (programación oficial): la suma y la resta de números
// decimales y las áreas de polígonos. Producto/reto: campaña de
// concienciación sobre la igualdad con una lista de gastos e ingresos.
// ============================================================

const UDI_M5_T3_BLOQUE1 = {
  id: "m5-t3-bloque1",
  area: "Matemáticas 5º · T3",
  titulo: "3º Trimestre · Tema 7 · ¡Tú y yo iguales!",
  curso: "5",
  bloque: "Matemáticas · Suma y resta de decimales + Áreas de polígonos",
  resumen: "Suma y resta de números decimales, y el cálculo de áreas de polígonos.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Suma de números decimales", descripcion: "Colocar bien la coma.", topicId: "decimales" },
      { n: 2, titulo: "Resta de números decimales", descripcion: "Igualar los decimales.", topicId: "decimales" },
      { n: 3, titulo: "Perímetro y área de polígonos", descripcion: "Cuadrado, rectángulo, triángulo.", topicId: "areas" },
      { n: 4, titulo: "Áreas por cuadrículas", descripcion: "Estimar y calcular superficies.", topicId: "areas" },
      { n: 5, titulo: "Reto: campaña por la igualdad", descripcion: "Producto final del tema." },
      { n: 6, titulo: "Repaso y examen del tema", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-decimales", label: "Suma y resta de decimales", motor: "mate-ficha", topicId: "decimales", count: 6 },
      { id: "f-areas", label: "Áreas de polígonos", motor: "mate-ficha", topicId: "areas", count: 6 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (tema combinado)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "decimales", count: 4 }, { topicId: "areas", count: 4 }] },
      { id: "examen", label: "Examen del tema (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "decimales", count: 5 }, { topicId: "areas", count: 5 }] },
      { id: "explicacion", label: "Explicación y solucionario del tema", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m5-t3-bloque1", titulo: "Guía: suma y resta de decimales y áreas", subtitulo: "Documento de apoyo del Tema 7 «¡Tú y yo iguales!».",
          teoria: [
            { heading: "Suma y resta de decimales", paragraphs: ["Para sumar o restar decimales se colocan las cifras haciendo coincidir las comas (unidades con unidades, décimas con décimas...) y se opera como con los naturales, bajando la coma al resultado."] },
            { heading: "Áreas de polígonos", paragraphs: ["El área es la superficie que ocupa una figura. El rectángulo es base × altura; el cuadrado, lado × lado; el triángulo, (base × altura) : 2. También se puede estimar contando cuadrículas."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden sumar/restar decimales y calcular áreas. La hoja de soluciones da el procedimiento.", ejemplo: "3,25 + 1,40 = 4,65. Área de un rectángulo 5 × 3 → 15." } ],
          variantesACS: { titulo: "Guía sencilla: decimales y áreas", subtitulo: "Versión adaptada (ACS, nivel de 3º).",
            teoria: [ { heading: "Decimales y área", paragraphs: ["Para sumar dinero, junta euros con euros y céntimos con céntimos. El área es cuántos cuadraditos caben dentro de la figura."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con dinero y contando cuadraditos.", ejemplo: "2,50 € + 1,00 € = 3,50 €." } ] } } },
      { id: "reto", label: "Reto final del tema + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m5-t3-bloque1", titulo: "Campaña por la igualdad",
          consigna: ["Este es el reto que integra el tema. Vais a planificar una campaña de concienciación sobre la igualdad entre hombres y mujeres, con un presupuesto (lista de gastos e ingresos).",
            "Usaréis lo aprendido: sumaréis y restaréis los decimales de gastos e ingresos, y calcularéis el área del espacio (mural, cartel) que vais a usar."],
          pasos: ["Pensad las acciones de vuestra campaña (mural, charla, folletos...).", "Haced una lista de gastos con precios decimales y una lista de ingresos.", "Sumad los gastos y restadlos de los ingresos para saber si os cuadra el presupuesto.", "Calculad el área del mural o cartel que vais a hacer.", "Presentad la campaña con su presupuesto y su diseño."],
          criterios: [
            { nombre: "Sumo y resto decimales del presupuesto", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Calculo el área del cartel o mural", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Presento la campaña con claridad", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "Campaña por la igualdad",
            consigna: ["Vas a sumar dos gastos con decimales y contar cuadraditos de un cartel."],
            pasos: ["Suma dos gastos como 2,50 € y 1,00 €.", "Cuenta cuántos cuadraditos ocupa un cartel en la cuadrícula."],
            criterios: [ { nombre: "Sumo decimales", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Cuento los cuadraditos", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T3_BLOQUE1.id] = UDI_M5_T3_BLOQUE1;
