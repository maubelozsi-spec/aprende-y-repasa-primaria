// ============================================================
// UDI Matemáticas 5º · 3º Trimestre · SDA 2 "Viajando a América":
// las unidades de medida (longitud, capacidad, masa) y el tiempo.
// ============================================================

const UDI_M5_T3_BLOQUE2 = {
  id: "m5-t3-bloque2",
  area: "Matemáticas 5º · T3",
  titulo: "3º Trimestre · SDA 2 · Viajando a América",
  curso: "5",
  bloque: "Matemáticas · Medidas y el tiempo",
  resumen: "Unidades de longitud, capacidad y masa y sus equivalencias, y medida y cálculo con el tiempo.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Unidades de longitud", descripcion: "Del km al mm y equivalencias.", topicId: "medidas" },
      { n: 2, titulo: "Capacidad y masa", descripcion: "Litros y gramos; conversiones.", topicId: "medidas" },
      { n: 3, titulo: "El tiempo: horas, minutos y segundos", descripcion: "Leer y operar con el tiempo.", topicId: "tiempo" },
      { n: 4, titulo: "Cálculos con el tiempo", descripcion: "Duraciones y husos horarios.", topicId: "tiempo" },
      { n: 5, titulo: "Reto: planificamos un viaje a América", descripcion: "Producto final de la SDA." },
      { n: 6, titulo: "Repaso y examen de la SDA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-medidas", label: "Medidas y conversiones", motor: "mate-ficha", topicId: "medidas", count: 6 },
      { id: "f-tiempo", label: "El tiempo", motor: "mate-ficha", topicId: "tiempo", count: 6 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SDA combinada)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "medidas", count: 4 }, { topicId: "tiempo", count: 4 }] },
      { id: "examen", label: "Examen de la SDA (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "medidas", count: 5 }, { topicId: "tiempo", count: 5 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SDA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m5-t3-bloque2", titulo: "Guía: las medidas y el tiempo", subtitulo: "Documento de apoyo de la SDA «Viajando a América».",
          teoria: [
            { heading: "Unidades de medida", paragraphs: ["Cada unidad es 10 veces mayor que la siguiente: km, hm, dam, m, dm, cm, mm. Para pasar a una unidad menor se multiplica por 10, 100...; a una mayor, se divide. Lo mismo con el litro y el gramo."] },
            { heading: "El tiempo", paragraphs: ["1 hora = 60 minutos y 1 minuto = 60 segundos. Para calcular duraciones se restan las horas, teniendo en cuenta que el tiempo no va de 10 en 10 sino de 60 en 60."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden convertir unidades u operar con el tiempo. La hoja de soluciones da el procedimiento.", ejemplo: "3 km = 3000 m." } ],
          variantesACS: { titulo: "Guía sencilla: medidas y tiempo", subtitulo: "Versión adaptada (ACS, nivel de 3º).",
            teoria: [ { heading: "Medidas y tiempo", paragraphs: ["1 metro = 100 centímetros. 1 hora = 60 minutos. Usa la regla y el reloj para verlo."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con metros/centímetros y horas en punto.", ejemplo: "2 m = 200 cm." } ] } } },
      { id: "reto", label: "Reto final de la SDA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m5-t3-bloque2", titulo: "Planificamos un viaje a América",
          consigna: ["Este reto reúne lo trabajado. Vais a planificar un viaje calculando distancias, equipaje y horarios.",
            "Usaréis lo aprendido: convertiréis unidades de medida y haréis cálculos con el tiempo (duración del vuelo, diferencia horaria)."],
          pasos: ["Elegid un destino en América y anotad la distancia en km.", "Convertid alguna medida (por ejemplo, el peso permitido de la maleta de kg a g).", "Calculad la duración del vuelo a partir de la hora de salida y de llegada.", "Tened en cuenta la diferencia horaria para saber qué hora será al llegar.", "Presentad vuestro plan de viaje con los cálculos."],
          criterios: [
            { nombre: "Convierto unidades de medida", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Calculo duraciones con el tiempo", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Presento el plan con claridad", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "Planificamos un viaje a América",
            consigna: ["Vas a leer la hora en el reloj y convertir metros en centímetros."],
            pasos: ["Di qué hora marca un reloj (en punto y media).", "Convierte 1 metro y 2 metros a centímetros."],
            criterios: [ { nombre: "Leo la hora", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Convierto metros a centímetros", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T3_BLOQUE2.id] = UDI_M5_T3_BLOQUE2;
