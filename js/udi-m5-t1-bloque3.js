// ============================================================
// UDI Matemáticas 5º · 1º Trimestre · SDA 3 "Las constelaciones /
// España en coordenadas": ángulos y coordenadas cartesianas.
// ============================================================

const UDI_M5_T1_BLOQUE3 = {
  id: "m5-t1-bloque3",
  area: "Matemáticas 5º · T1",
  titulo: "1º Trimestre · SDA 3 · Constelaciones y coordenadas",
  curso: "5",
  bloque: "Matemáticas · Ángulos y coordenadas",
  resumen: "Medir y clasificar ángulos con el transportador, y localizar y representar puntos en coordenadas cartesianas.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Los ángulos y su medida", descripcion: "Grados; medir con transportador.", topicId: "angulos" },
      { n: 2, titulo: "Clases de ángulos y suma", descripcion: "Recto, agudo, obtuso, llano.", topicId: "angulos" },
      { n: 3, titulo: "El plano y las coordenadas", descripcion: "Ejes X e Y; localizar puntos.", topicId: "coordenadas" },
      { n: 4, titulo: "Representar puntos, traslaciones y giros", descripcion: "Del punto a la coordenada.", topicId: "coordenadas" },
      { n: 5, titulo: "Reto: el mapa de nuestra constelación", descripcion: "Producto final de la SDA." },
      { n: 6, titulo: "Repaso y examen de la SDA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-angulos", label: "Ángulos", motor: "mate-ficha", topicId: "angulos", count: 6 },
      { id: "f-coordenadas", label: "Coordenadas", motor: "mate-ficha", topicId: "coordenadas", count: 6 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SDA combinada)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "angulos", count: 4 }, { topicId: "coordenadas", count: 4 }] },
      { id: "examen", label: "Examen de la SDA (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "angulos", count: 5 }, { topicId: "coordenadas", count: 5 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SDA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m5-t1-bloque3", titulo: "Guía: ángulos y coordenadas", subtitulo: "Documento de apoyo de la SDA «Las constelaciones / España en coordenadas».",
          teoria: [
            { heading: "Los ángulos", paragraphs: ["Un ángulo se mide en grados (°) con el transportador. Según su amplitud es recto (90°), agudo (menos de 90°), obtuso (más de 90°) o llano (180°)."] },
            { heading: "Las coordenadas", paragraphs: ["En el plano cartesiano cada punto se localiza con dos números (x, y): el primero indica el desplazamiento en el eje horizontal y el segundo en el vertical."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden medir/clasificar ángulos y localizar o escribir coordenadas. La hoja de soluciones da la respuesta.", ejemplo: "Un ángulo de 45° → agudo. El punto (3, 2) → 3 a la derecha y 2 arriba." } ],
          variantesACS: { titulo: "Guía sencilla: ángulos y coordenadas", subtitulo: "Versión adaptada (ACS, nivel de 3º).",
            teoria: [ { heading: "Ángulos", paragraphs: ["Un ángulo recto es como la esquina de una hoja. Si es más pequeño, agudo; más abierto, obtuso."] }, { heading: "Coordenadas", paragraphs: ["Para encontrar un punto se cuenta primero a la derecha y luego hacia arriba."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con ángulos y puntos sencillos.", ejemplo: "(1, 1) → 1 a la derecha, 1 arriba." } ] } } },
      { id: "reto", label: "Reto final de la SDA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m5-t1-bloque3", titulo: "El mapa de nuestra constelación",
          consigna: ["Este reto reúne lo trabajado. Vais a inventar una constelación y dibujarla en un plano de coordenadas.",
            "Usaréis lo aprendido: colocaréis las estrellas en coordenadas y mediréis los ángulos entre las líneas que las unen."],
          pasos: ["Dibujad un plano con ejes X e Y.", "Colocad al menos 5 estrellas y anotad las coordenadas de cada una.", "Unid las estrellas con líneas para formar la constelación.", "Medid con el transportador tres ángulos de vuestra constelación y clasificadlos.", "Presentad vuestra constelación a la clase indicando coordenadas y ángulos."],
          criterios: [
            { nombre: "Coloco las estrellas y anoto sus coordenadas", niveles: ["Sin errores.", "Con algún error.", "Con bastantes errores.", "No lo consigo."] },
            { nombre: "Mido y clasifico los ángulos", niveles: ["Correctamente.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Presento mi constelación con el vocabulario adecuado", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "El mapa de nuestra constelación",
            consigna: ["Vas a colocar 3 estrellas en una cuadrícula y contar los pasos."],
            pasos: ["Marca 3 puntos en la cuadrícula.", "Di cuántos cuadros hay que contar a la derecha y arriba para llegar a cada uno."],
            criterios: [ { nombre: "Coloco puntos en la cuadrícula", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Cuento los pasos hasta el punto", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T1_BLOQUE3.id] = UDI_M5_T1_BLOQUE3;
