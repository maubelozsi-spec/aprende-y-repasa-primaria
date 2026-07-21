// ============================================================
// UDI Matemáticas 6º · 3º Trimestre · SdA 8 "Reciclar para cuidar"
// (05/05 – 29/05, temporalización del centro 2025-2026).
// Contenidos: perímetro y áreas de figuras regulares e irregulares,
// circunferencia y círculo, longitud de la circunferencia, poliedros,
// prismas, pirámides y cuerpos redondos.
// ============================================================

const UDI_M6_SDA8 = {
  id: "m6-sda8",
  area: "Matemáticas 6º · T3",
  titulo: "SdA 8 · Reciclar para cuidar",
  curso: "6",
  bloque: "Matemáticas · Perímetros y áreas + Circunferencia y círculo + Cuerpos geométricos",
  resumen: "05/05 – 29/05. Perímetro y área de figuras regulares e irregulares, la circunferencia y el círculo, y los poliedros, prismas, pirámides y cuerpos redondos.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Perímetro y área de figuras regulares", descripcion: "Cuadrado, rectángulo, triángulo, polígonos.", topicId: "areas" },
      { n: 2, titulo: "Áreas de figuras irregulares", descripcion: "Descomponer y estimar.", topicId: "areas" },
      { n: 3, titulo: "La circunferencia y el círculo", descripcion: "Radio, diámetro y sus elementos.", topicId: "circunferencia" },
      { n: 4, titulo: "Longitud de la circunferencia", descripcion: "La fórmula con π.", topicId: "circunferencia" },
      { n: 5, titulo: "Poliedros: prismas y pirámides", descripcion: "Caras, aristas y vértices.", topicId: "cuerpos-geometricos" },
      { n: 6, titulo: "Los cuerpos redondos", descripcion: "Esfera, cilindro y cono.", topicId: "cuerpos-geometricos" },
      { n: 7, titulo: "Reto: el punto limpio del cole", descripcion: "Producto final de la SdA." },
      { n: 8, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-areas", label: "Perímetros y áreas", motor: "mate-ficha", topicId: "areas", count: 6 },
      { id: "f-circunferencia", label: "Circunferencia y círculo", motor: "mate-ficha", topicId: "circunferencia", count: 6 },
      { id: "f-cuerpos", label: "Cuerpos geométricos", motor: "mate-ficha", topicId: "cuerpos-geometricos", count: 6 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "areas", count: 3 }, { topicId: "circunferencia", count: 3 }, { topicId: "cuerpos-geometricos", count: 3 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "areas", count: 4 }, { topicId: "circunferencia", count: 3 }, { topicId: "cuerpos-geometricos", count: 3 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m6-sda8", titulo: "Guía: perímetros, áreas, circunferencia y cuerpos", subtitulo: "Documento de apoyo de la SdA 8 «Reciclar para cuidar» (6º).",
          teoria: [
            { heading: "Perímetro y área", paragraphs: ["El perímetro es la suma de los lados. El área del rectángulo es base × altura; la del triángulo, (base × altura) : 2. En las figuras irregulares se descompone la figura en otras conocidas o se estima contando cuadrículas."] },
            { heading: "La circunferencia y el círculo", paragraphs: ["La circunferencia es la línea; el círculo, la superficie que encierra. El diámetro es el doble del radio. La longitud de la circunferencia se calcula con L = 2 × π × r (π ≈ 3,14)."] },
            { heading: "Los cuerpos geométricos", paragraphs: ["Los poliedros tienen caras planas: los prismas tienen dos bases iguales y paralelas, y las pirámides una base y caras triangulares que se unen en un vértice. Los cuerpos redondos (esfera, cilindro, cono) tienen superficies curvas."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden calcular perímetros y áreas, la longitud de una circunferencia o reconocer cuerpos. La hoja de soluciones da el procedimiento.", ejemplo: "Circunferencia de radio 5 → 2 × 3,14 × 5 = 31,4." } ],
          variantesACS: { titulo: "Guía sencilla: perímetro, área y cuerpos", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [ { heading: "Perímetro y área", paragraphs: ["El perímetro es todo el borde. El área es cuántos cuadraditos caben dentro."] }, { heading: "Los cuerpos", paragraphs: ["Una caja es un prisma; una pelota, una esfera; una lata, un cilindro."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Contando cuadraditos y con cuerpos conocidos.", ejemplo: "Un cuadrado de lado 3 → área 9 cuadraditos." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m6-sda8", titulo: "El punto limpio del cole",
          consigna: ["Este reto integra toda la SdA. Vais a diseñar un punto limpio de reciclaje para el colegio, calculando el espacio que ocupa y los contenedores que hacen falta.",
            "Usaréis lo aprendido: perímetros y áreas para el espacio, la circunferencia para los contenedores redondos, y los cuerpos geométricos para clasificar los envases y las papeleras."],
          pasos: ["Dibujad a escala el espacio del punto limpio y calculad su perímetro y su área.",
            "Elegid los contenedores: calculad la longitud de la circunferencia de los que sean cilíndricos.",
            "Clasificad los envases que se van a reciclar según su cuerpo geométrico (prisma, cilindro, cono...).",
            "Comprobad que los contenedores caben en el área disponible.",
            "Presentad el diseño del punto limpio a la clase."],
          criterios: [
            { nombre: "Calculo perímetros y áreas", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Calculo la longitud de una circunferencia", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Clasifico los cuerpos geométricos", niveles: ["Todos correctamente.", "La mayoría.", "Alguno, con ayuda.", "No los clasifico."] },
            { nombre: "Presento el diseño con claridad", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "El punto limpio del cole",
            consigna: ["Vas a contar los cuadraditos de un espacio y decir qué cuerpo es una lata."],
            pasos: ["Dibuja un rectángulo en la cuadrícula y cuenta cuántos cuadraditos ocupa.", "Mira una lata y una caja y di qué cuerpo geométrico es cada una."],
            criterios: [ { nombre: "Cuento los cuadraditos", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Reconozco cuerpos geométricos", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M6_SDA8.id] = UDI_M6_SDA8;
