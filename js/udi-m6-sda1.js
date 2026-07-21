// ============================================================
// UDI Matemáticas 6º · 1º Trimestre · SdA 1 "Tu tiempo de ocio"
// (22/09 – 17/10, temporalización del centro 2025-2026).
// Contenidos: números naturales, operaciones con naturales, sus
// propiedades, operaciones combinadas, números romanos y resolución
// de problemas.
// ============================================================

const UDI_M6_SDA1 = {
  id: "m6-sda1",
  area: "Matemáticas 6º · T1",
  titulo: "SdA 1 · Tu tiempo de ocio",
  curso: "6",
  bloque: "Matemáticas · Números naturales y sus operaciones + Números romanos",
  resumen: "22/09 – 17/10. Números naturales, las cuatro operaciones y sus propiedades, operaciones combinadas y números romanos.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Los números naturales", descripcion: "Lectura, descomposición y comparación.", topicId: "numeros-grandes" },
      { n: 2, titulo: "Suma y resta", descripcion: "Términos, propiedades y prueba.", topicId: "sumas" },
      { n: 3, titulo: "Multiplicación y división", descripcion: "Propiedades y prueba de la división.", topicId: "multiplicaciones" },
      { n: 4, titulo: "Propiedades de las operaciones", descripcion: "Conmutativa, asociativa y distributiva.", topicId: "propiedades-operaciones" },
      { n: 5, titulo: "Operaciones combinadas", descripcion: "Jerarquía y paréntesis.", topicId: "operaciones-combinadas" },
      { n: 6, titulo: "Números romanos", descripcion: "Leer y escribir en romanos.", topicId: "numeros-romanos" },
      { n: 7, titulo: "Reto: planificamos nuestro tiempo de ocio", descripcion: "Producto final de la SdA." },
      { n: 8, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-naturales", label: "Números naturales", motor: "mate-ficha", topicId: "numeros-grandes", count: 5 },
      { id: "f-sumas", label: "Sumas y restas", motor: "mate-ficha", topicId: "sumas", count: 4 },
      { id: "f-multiplicaciones", label: "Multiplicaciones", motor: "mate-ficha", topicId: "multiplicaciones", count: 4 },
      { id: "f-divisiones", label: "Divisiones", motor: "mate-ficha", topicId: "divisiones", count: 4 },
      { id: "f-combinadas", label: "Operaciones combinadas", motor: "mate-ficha", topicId: "operaciones-combinadas", count: 5 },
      { id: "f-romanos", label: "Números romanos", motor: "mate-ficha", topicId: "numeros-romanos", count: 4 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "numeros-grandes", count: 2 }, { topicId: "multiplicaciones", count: 2 }, { topicId: "divisiones", count: 2 }, { topicId: "operaciones-combinadas", count: 2 }, { topicId: "numeros-romanos", count: 2 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "numeros-grandes", count: 2 }, { topicId: "multiplicaciones", count: 3 }, { topicId: "divisiones", count: 3 }, { topicId: "operaciones-combinadas", count: 3 }, { topicId: "numeros-romanos", count: 2 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m6-sda1", titulo: "Guía: los naturales, sus operaciones y los romanos", subtitulo: "Documento de apoyo de la SdA 1 «Tu tiempo de ocio» (6º).",
          teoria: [
            { heading: "Los números naturales y sus operaciones", paragraphs: ["Cada cifra vale según su posición. La suma y la resta se comprueban con la prueba de la resta; la división, con la prueba: divisor × cociente + resto = dividendo. La multiplicación tiene las propiedades conmutativa, asociativa y distributiva."] },
            { heading: "Operaciones combinadas", paragraphs: ["Se resuelven primero los paréntesis, después las multiplicaciones y divisiones (de izquierda a derecha) y por último las sumas y restas."] },
            { heading: "Los números romanos", paragraphs: ["Se usan I, V, X, L, C, D, M. Si una letra menor va antes de una mayor, se resta (IV = 4); si va después, se suma (VI = 6). No se repite más de tres veces la misma letra."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Cada problema pide identificar los datos, plantear la operación y dar la solución. La hoja de soluciones incluye la operación y el resultado.", ejemplo: "5 + 2 × 3 = 11 (primero la multiplicación). XIV = 14." } ],
          variantesACS: { titulo: "Guía sencilla: números y operaciones", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [ { heading: "Las operaciones", paragraphs: ["Sumar es juntar, restar es quitar, multiplicar es sumar varias veces y dividir es repartir."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con números más pequeños y un solo paso.", ejemplo: "125 + 34 = 159." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m6-sda1", titulo: "Planificamos nuestro tiempo de ocio",
          consigna: ["Este reto integra toda la SdA. Vais a planificar el tiempo de ocio de una semana con un presupuesto y un horario.",
            "Usaréis lo aprendido: operaciones con naturales (y combinadas) para repartir horas y calcular gastos, y los números romanos para numerar los días o las actividades."],
          pasos: ["Haced una lista de actividades de ocio de una semana y las horas que dedicáis a cada una.",
            "Calculad con sumas y multiplicaciones el total de horas de la semana.",
            "Poned un coste a las actividades que lo tengan y calculad el gasto total con una operación combinada.",
            "Numerad las actividades o los días usando números romanos.",
            "Presentad vuestro plan explicando los cálculos."],
          criterios: [
            { nombre: "Opero correctamente con números naturales", niveles: ["Sin errores.", "Con algún error.", "Con bastantes errores.", "No lo consigo."] },
            { nombre: "Respeto la jerarquía en las operaciones combinadas", niveles: ["Siempre.", "Casi siempre.", "A veces.", "No la respeto."] },
            { nombre: "Escribo correctamente números romanos", niveles: ["Sin errores.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Presento el plan con claridad", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "Planificamos nuestro tiempo de ocio",
            consigna: ["Vas a sumar las horas de 3 actividades de tu semana."],
            pasos: ["Escribe 3 actividades y cuántas horas dedicas a cada una.", "Suma el total de horas."],
            criterios: [ { nombre: "Sumo las horas", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Digo el total", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M6_SDA1.id] = UDI_M6_SDA1;
