// ============================================================
// UDI Matemáticas 5º · 1º Trimestre · Tema 1 (SM): "Investiguemos en
// el espacio / Las constelaciones / La Tierra entre otros planetas".
// Contenido (programación de aula oficial): números de hasta 6 cifras
// (lectura, descomposición, comparación y redondeo) y los ángulos y
// su clasificación. Producto/reto: "Descubrimos el Sistema Solar".
// ============================================================

const UDI_M5_T1_BLOQUE1 = {
  id: "m5-t1-bloque1",
  area: "Matemáticas 5º · T1",
  titulo: "1º Trimestre · Tema 1 · Investiguemos en el espacio",
  curso: "5",
  bloque: "Matemáticas · Números de hasta 6 cifras y los ángulos",
  resumen: "Lectura, descomposición, comparación y redondeo de números de hasta 6 cifras, y los ángulos y su clasificación.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Números de 5 y 6 cifras", descripcion: "Lectura y valor de cada cifra.", topicId: "numeros-grandes" },
      { n: 2, titulo: "Descomposición y comparación", descripcion: "Ordenar y descomponer números grandes.", topicId: "numeros-grandes" },
      { n: 3, titulo: "Redondeo de números grandes", descripcion: "Aproximar a cada orden.", topicId: "numeros-grandes" },
      { n: 4, titulo: "Los ángulos y su medida", descripcion: "El grado y el transportador.", topicId: "angulos" },
      { n: 5, titulo: "Clasificación de ángulos", descripcion: "Recto, agudo, obtuso y llano.", topicId: "angulos" },
      { n: 6, titulo: "Reto: descubrimos el Sistema Solar", descripcion: "Producto final del tema." },
      { n: 7, titulo: "Repaso y examen del tema", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-numeros-grandes", label: "Números de hasta 6 cifras", motor: "mate-ficha", topicId: "numeros-grandes", count: 6 },
      { id: "f-angulos", label: "Los ángulos", motor: "mate-ficha", topicId: "angulos", count: 6 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (tema combinado)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "numeros-grandes", count: 4 }, { topicId: "angulos", count: 4 }] },
      { id: "examen", label: "Examen del tema (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "numeros-grandes", count: 5 }, { topicId: "angulos", count: 5 }] },
      { id: "explicacion", label: "Explicación y solucionario del tema", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m5-t1-bloque1", titulo: "Guía: números grandes y los ángulos", subtitulo: "Documento de apoyo del Tema 1 «Investiguemos en el espacio».",
          teoria: [
            { heading: "Números de hasta 6 cifras", paragraphs: ["Cada cifra vale según su posición (unidades, decenas, centenas, unidades de millar, decenas de millar, centenas de millar). Descomponer es escribir el número según el valor de cada cifra. Redondear es sustituirlo por el número acabado en ceros más cercano de un orden dado."] },
            { heading: "Los ángulos", paragraphs: ["Un ángulo se mide en grados (°) con el transportador. Según su amplitud es recto (90°), agudo (menos de 90°), obtuso (más de 90°) o llano (180°)."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden leer, descomponer, comparar o redondear números grandes, y medir o clasificar ángulos. La hoja de soluciones da el procedimiento.", ejemplo: "348.712 redondeado a las decenas de millar → 350.000. Un ángulo de 45° → agudo." } ],
          variantesACS: { titulo: "Guía sencilla: números y ángulos", subtitulo: "Versión adaptada (ACS, nivel de 3º).",
            teoria: [ { heading: "Números", paragraphs: ["Cada cifra vale según su lugar: unidades, decenas, centenas."] }, { heading: "Ángulos", paragraphs: ["Un ángulo recto es como la esquina de una hoja; si es más pequeño, agudo; más abierto, obtuso."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con números de 3-4 cifras y ángulos sencillos.", ejemplo: "El 5 en 253 vale 50." } ] } } },
      { id: "reto", label: "Reto final del tema + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m5-t1-bloque1", titulo: "Descubrimos el Sistema Solar",
          consigna: ["Este es el reto que integra el tema. En grupo vais a crear una cartulina del Sistema Solar con los planetas ordenados según su distancia al Sol.",
            "Usaréis lo aprendido: leeréis, compararéis y redondearéis los números grandes de las distancias, y mediréis con el transportador los ángulos que forman las órbitas o vuestro diseño."],
          pasos: ["Anotad la distancia de cada planeta al Sol (números de hasta 6 cifras) y redondeadlas.", "Ordenad los planetas del más cercano al más lejano comparando esos números.", "Colocad los planetas en la cartulina y medid con el transportador algún ángulo de vuestro diseño.", "Clasificad los ángulos que habéis medido.", "Exponed vuestra cartulina explicando los números y los ángulos."],
          criterios: [
            { nombre: "Leo, comparo y redondeo los números grandes", niveles: ["Sin errores.", "Con algún error.", "Con bastantes errores.", "No lo consigo."] },
            { nombre: "Ordeno los planetas según su distancia", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Mido y clasifico ángulos", niveles: ["Correctamente.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Expongo la cartulina con el vocabulario adecuado", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "Descubrimos el Sistema Solar",
            consigna: ["Vas a ordenar los planetas y contar cuántos son."],
            pasos: ["Ordena los planetas del más cercano al más lejano al Sol.", "Cuenta cuántos planetas hay."],
            criterios: [ { nombre: "Ordeno los planetas", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Cuento cuántos son", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T1_BLOQUE1.id] = UDI_M5_T1_BLOQUE1;
