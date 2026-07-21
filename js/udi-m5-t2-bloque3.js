// ============================================================
// UDI Matemáticas 5º · 2º Trimestre · Tema 6 (SM): "Investigamos como
// científicos / La semana de la ciencia / Un laboratorio en la cocina".
// Contenido (programación oficial): los números decimales (lectura,
// comparación y ordenación) y las unidades de longitud, superficie,
// capacidad y masa. Producto/reto: construir una recta con decimales
// y aplicarlos a la vida cotidiana.
// ============================================================

const UDI_M5_T2_BLOQUE3 = {
  id: "m5-t2-bloque3",
  area: "Matemáticas 5º · T2",
  titulo: "2º Trimestre · Tema 6 · Investigamos como científicos",
  curso: "5",
  bloque: "Matemáticas · Los números decimales + Las medidas",
  resumen: "Lectura, comparación y ordenación de números decimales, y las unidades de longitud, superficie, capacidad y masa.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Los números decimales", descripcion: "Décimas, centésimas y milésimas.", topicId: "decimales" },
      { n: 2, titulo: "Comparar y ordenar decimales", descripcion: "En la recta numérica.", topicId: "decimales" },
      { n: 3, titulo: "Unidades de longitud y capacidad", descripcion: "Del km al mm; el litro.", topicId: "medidas" },
      { n: 4, titulo: "Unidades de masa y superficie", descripcion: "El gramo y equivalencias.", topicId: "medidas" },
      { n: 5, titulo: "Reto: la recta de los decimales", descripcion: "Producto final del tema." },
      { n: 6, titulo: "Repaso y examen del tema", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-decimales", label: "Números decimales", motor: "mate-ficha", topicId: "decimales", count: 6 },
      { id: "f-medidas", label: "Medidas y conversiones", motor: "mate-ficha", topicId: "medidas", count: 6 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (tema combinado)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "decimales", count: 4 }, { topicId: "medidas", count: 4 }] },
      { id: "examen", label: "Examen del tema (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "decimales", count: 5 }, { topicId: "medidas", count: 5 }] },
      { id: "explicacion", label: "Explicación y solucionario del tema", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m5-t2-bloque3", titulo: "Guía: los decimales y las medidas", subtitulo: "Documento de apoyo del Tema 6 «Investigamos como científicos».",
          teoria: [
            { heading: "Los números decimales", paragraphs: ["Los decimales expresan partes de la unidad: décimas (0,1), centésimas (0,01) y milésimas (0,001). Para comparar decimales se miran las cifras de izquierda a derecha, y se pueden situar en la recta numérica."] },
            { heading: "Las unidades de medida", paragraphs: ["Cada unidad es 10 veces mayor que la siguiente: km, hm, dam, m, dm, cm, mm. Para pasar a una unidad menor se multiplica por 10, 100...; a una mayor, se divide. Igual con el litro (capacidad) y el gramo (masa)."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden leer, comparar u ordenar decimales, y convertir unidades. La hoja de soluciones da el procedimiento.", ejemplo: "3 km = 3000 m. Ordenar 0,5 y 0,45 → 0,45 < 0,5." } ],
          variantesACS: { titulo: "Guía sencilla: decimales y medidas", subtitulo: "Versión adaptada (ACS, nivel de 3º).",
            teoria: [ { heading: "Decimales y medidas", paragraphs: ["Con el dinero: 1,50 € es 1 euro y 50 céntimos. 1 metro = 100 centímetros."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con dinero y metros/centímetros.", ejemplo: "2 m = 200 cm." } ] } } },
      { id: "reto", label: "Reto final del tema + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m5-t2-bloque3", titulo: "La recta de los decimales",
          consigna: ["Este es el reto que integra el tema. Vais a construir una recta numérica con números decimales y a aplicarlos a situaciones reales, como si fuerais científicos midiendo.",
            "Usaréis lo aprendido: colocaréis decimales en la recta, los ordenaréis, y mediréis objetos convirtiendo unidades."],
          pasos: ["Dibujad una recta numérica y marcad varios números decimales (0,25; 0,5; 0,75...).", "Ordenad de menor a mayor una lista de decimales.", "Medid tres objetos de clase y anotad su medida en distintas unidades (cm y mm, por ejemplo).", "Comprobad las conversiones entre unidades.", "Presentad vuestra recta y las medidas a la clase."],
          criterios: [
            { nombre: "Coloco y ordeno decimales en la recta", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Convierto unidades de medida", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Presento la recta y las medidas con claridad", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "La recta de los decimales",
            consigna: ["Vas a colocar 0,5 en una recta y medir un objeto en centímetros."],
            pasos: ["Marca dónde está 0,5 entre 0 y 1 en una recta.", "Mide un lápiz con la regla y di cuántos centímetros mide."],
            criterios: [ { nombre: "Coloco 0,5 en la recta", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Mido en centímetros", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T2_BLOQUE3.id] = UDI_M5_T2_BLOQUE3;
