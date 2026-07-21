// ============================================================
// UDI Matemáticas 5º · 2º Trimestre · Tema 5 (SM): "Energía y hábitos
// saludables / Nuestro bienestar".
// Contenido (programación oficial): las operaciones con fracciones
// (suma, resta y operaciones combinadas con fracciones). Producto/
// reto: calcular y representar con fracciones la energía que nos queda
// al final del día.
// ============================================================

const UDI_M5_T2_BLOQUE2 = {
  id: "m5-t2-bloque2",
  area: "Matemáticas 5º · T2",
  titulo: "2º Trimestre · Tema 5 · Energía y hábitos saludables",
  curso: "5",
  bloque: "Matemáticas · Las operaciones con fracciones",
  resumen: "Suma y resta de fracciones y operaciones combinadas con fracciones.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Suma de fracciones", descripcion: "Con igual denominador.", topicId: "operaciones-fracciones" },
      { n: 2, titulo: "Resta de fracciones", descripcion: "Con igual denominador.", topicId: "operaciones-fracciones" },
      { n: 3, titulo: "Fracción de una cantidad", descripcion: "Aplicada a la vida diaria.", topicId: "operaciones-fracciones" },
      { n: 4, titulo: "Operaciones combinadas con fracciones", descripcion: "Varios pasos.", topicId: "operaciones-fracciones" },
      { n: 5, titulo: "Reto: la energía del día", descripcion: "Producto final del tema." },
      { n: 6, titulo: "Repaso y examen del tema", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-op-fracciones", label: "Operaciones con fracciones", motor: "mate-ficha", topicId: "operaciones-fracciones", count: 8 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso del tema", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "operaciones-fracciones", count: 8 }] },
      { id: "examen", label: "Examen del tema", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "operaciones-fracciones", count: 10 }] },
      { id: "explicacion", label: "Explicación y solucionario del tema", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m5-t2-bloque2", titulo: "Guía: las operaciones con fracciones", subtitulo: "Documento de apoyo del Tema 5 «Energía y hábitos saludables».",
          teoria: [
            { heading: "Suma y resta de fracciones", paragraphs: ["Para sumar o restar fracciones con el mismo denominador se suman o restan los numeradores y se deja el mismo denominador: 2/5 + 1/5 = 3/5."] },
            { heading: "Operaciones combinadas con fracciones", paragraphs: ["Se aplican los mismos pasos que con los naturales: primero los paréntesis, y las sumas y restas de fracciones se hacen manteniendo el denominador."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden sumar, restar u operar fracciones. La hoja de soluciones incluye el procedimiento.", ejemplo: "3/4 − 1/4 = 2/4." } ],
          variantesACS: { titulo: "Guía sencilla: sumar y restar fracciones", subtitulo: "Versión adaptada (ACS, nivel de 3º).",
            teoria: [ { heading: "Sumar fracciones iguales", paragraphs: ["Si tienes 1/4 de tarta y coges otro 1/4, tienes 2/4. Se suman los de arriba y abajo se deja igual."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con dibujos y cuartos.", ejemplo: "1/4 + 1/4 = 2/4." } ] } } },
      { id: "reto", label: "Reto final del tema + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m5-t2-bloque2", titulo: "La energía del día",
          consigna: ["Este es el reto que integra el tema. Vais a calcular y representar, con ayuda de las fracciones, la energía que os queda al final del día.",
            "Usaréis lo aprendido: repartiréis vuestra energía diaria en fracciones y las sumaréis y restaréis según las actividades que hacéis."],
          pasos: ["Imaginad que empezáis el día con toda vuestra energía (un entero, 1).", "Asignad una fracción de energía a cada actividad (estudiar, jugar, deporte...).", "Sumad las fracciones de energía que gastáis a lo largo del día.", "Restad ese total a 1 para saber qué fracción de energía os queda.", "Representad el resultado en un dibujo y explicadlo a la clase."],
          criterios: [
            { nombre: "Reparto mi energía en fracciones", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Sumo y resto fracciones correctamente", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Represento y explico el resultado", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "La energía del día",
            consigna: ["Vas a sumar dos trozos de energía en cuartos."],
            pasos: ["Di que gastas 1/4 de energía jugando y 1/4 estudiando.", "Suma: ¿cuánta energía gastas en total?"],
            criterios: [ { nombre: "Sumo fracciones iguales", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Digo el resultado", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T2_BLOQUE2.id] = UDI_M5_T2_BLOQUE2;
