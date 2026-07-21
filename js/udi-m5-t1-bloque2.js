// ============================================================
// UDI Matemáticas 5º · 1º Trimestre · Tema 2 (SM): "Ayudemos al
// planeta: ecoescuela / Huertos urbanos en el paisaje".
// Contenido (programación oficial): las operaciones con números
// naturales (suma, resta, multiplicación, división, sus propiedades y
// la jerarquía / operaciones combinadas). Producto/reto: propuestas
// al ayuntamiento contra el cambio climático y diseño de un huerto.
// ============================================================

const UDI_M5_T1_BLOQUE2 = {
  id: "m5-t1-bloque2",
  area: "Matemáticas 5º · T1",
  titulo: "1º Trimestre · Tema 2 · Ayudemos al planeta",
  curso: "5",
  bloque: "Matemáticas · Las operaciones con números naturales",
  resumen: "Suma, resta, multiplicación y división de naturales, sus propiedades y la jerarquía de las operaciones (operaciones combinadas).",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Suma y resta. Propiedades y prueba", descripcion: "Términos y prueba de la resta.", topicId: "sumas" },
      { n: 2, titulo: "La resta y sus términos", descripcion: "Completar términos desconocidos.", topicId: "restas" },
      { n: 3, titulo: "Multiplicación y sus propiedades", descripcion: "Conmutativa, asociativa y distributiva.", topicId: "multiplicaciones" },
      { n: 4, titulo: "División y su prueba", descripcion: "Partes de la división.", topicId: "divisiones" },
      { n: 5, titulo: "Jerarquía de operaciones", descripcion: "Operaciones combinadas y paréntesis.", topicId: "operaciones-combinadas" },
      { n: 6, titulo: "Reto: propuestas para cuidar el planeta", descripcion: "Producto final del tema." },
      { n: 7, titulo: "Repaso y examen del tema", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-sumas", label: "Sumas", motor: "mate-ficha", topicId: "sumas", count: 4 },
      { id: "f-restas", label: "Restas", motor: "mate-ficha", topicId: "restas", count: 4 },
      { id: "f-multiplicaciones", label: "Multiplicaciones", motor: "mate-ficha", topicId: "multiplicaciones", count: 5 },
      { id: "f-divisiones", label: "Divisiones", motor: "mate-ficha", topicId: "divisiones", count: 5 },
      { id: "f-combinadas", label: "Operaciones combinadas", motor: "mate-ficha", topicId: "operaciones-combinadas", count: 5 },
      { id: "f-propiedades", label: "Propiedades de las operaciones", motor: "mate-ficha", topicId: "propiedades-operaciones", count: 4 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (tema combinado)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "multiplicaciones", count: 2 }, { topicId: "divisiones", count: 2 }, { topicId: "operaciones-combinadas", count: 2 }, { topicId: "propiedades-operaciones", count: 2 }] },
      { id: "examen", label: "Examen del tema (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "sumas", count: 1 }, { topicId: "restas", count: 1 }, { topicId: "multiplicaciones", count: 3 }, { topicId: "divisiones", count: 3 }, { topicId: "operaciones-combinadas", count: 3 }] },
      { id: "explicacion", label: "Explicación y solucionario del tema", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m5-t1-bloque2", titulo: "Guía: las operaciones con números naturales", subtitulo: "Documento de apoyo del Tema 2 «Ayudemos al planeta».",
          teoria: [
            { heading: "Suma, resta, multiplicación y división", paragraphs: ["La suma y la resta se comprueban con la prueba de la resta. La multiplicación tiene propiedades: conmutativa, asociativa y distributiva. La división se comprueba con la prueba: divisor × cociente + resto = dividendo."] },
            { heading: "La jerarquía de las operaciones", paragraphs: ["En las operaciones combinadas se resuelven primero los paréntesis, después las multiplicaciones y divisiones (de izquierda a derecha) y por último las sumas y restas."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Cada problema pide identificar los datos, plantear la operación y dar la solución. La hoja de soluciones incluye la operación y el resultado.", ejemplo: "5 + 2 × 3 = 5 + 6 = 11 (primero la multiplicación)." } ],
          variantesACS: { titulo: "Guía sencilla: las operaciones", subtitulo: "Versión adaptada (ACS, nivel de 3º).",
            teoria: [ { heading: "Las operaciones", paragraphs: ["Sumar es juntar, restar es quitar, multiplicar es sumar varias veces y dividir es repartir."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con números pequeños y de un solo paso.", ejemplo: "24 + 13 = 37." } ] } } },
      { id: "reto", label: "Reto final del tema + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m5-t1-bloque2", titulo: "Propuestas para cuidar el planeta",
          consigna: ["Este es el reto que integra el tema. Vais a preparar propuestas para el ayuntamiento contra el cambio climático y a diseñar un huerto escolar con tres zonas de cultivo.",
            "Usaréis lo aprendido: haréis operaciones con números naturales (y combinadas) para calcular presupuestos, superficies de cultivo y cantidades, e inventaréis problemas a partir del huerto."],
          pasos: ["Elegid dos o tres medidas para cuidar el planeta y ponedles un coste.", "Calculad con sumas, restas, multiplicaciones y divisiones el gasto total de vuestras propuestas.", "Diseñad un huerto con tres zonas e inventad un problema de operaciones combinadas sobre él.", "Resolved vuestro propio problema comprobando el resultado.", "Presentad las propuestas y el huerto al resto de la clase."],
          criterios: [
            { nombre: "Hago sumas, restas, multiplicaciones y divisiones correctas", niveles: ["Sin errores.", "Con algún error.", "Con bastantes errores.", "No lo consigo."] },
            { nombre: "Respeto la jerarquía en las operaciones combinadas", niveles: ["Siempre.", "Casi siempre.", "A veces.", "No la respeto."] },
            { nombre: "Invento y resuelvo un problema sobre el huerto", niveles: ["Lo invento y lo resuelvo bien.", "Lo invento, con algún error al resolver.", "Lo hago con ayuda.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "Propuestas para cuidar el planeta",
            consigna: ["Vas a sumar los costes de dos medidas para cuidar el planeta."],
            pasos: ["Elige 2 medidas y ponles un precio sencillo.", "Suma cuánto cuestan en total."],
            criterios: [ { nombre: "Sumo dos cantidades", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Digo el total", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T1_BLOQUE2.id] = UDI_M5_T1_BLOQUE2;
