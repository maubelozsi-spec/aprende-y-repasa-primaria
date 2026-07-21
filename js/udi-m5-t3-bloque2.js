// ============================================================
// UDI Matemáticas 5º · 3º Trimestre · Tema 8 (SM): "¿Qué compramos? /
// ¡No lo necesitas! / La compra ... ¿Verde?".
// Contenido (programación oficial): las operaciones con decimales
// (multiplicación y división) y el desarrollo plano de los cuerpos
// geométricos. Producto/reto: lista de la compra saludable con un
// presupuesto de 7 € y construcción de un objeto con cuerpos
// geométricos.
// ============================================================

const UDI_M5_T3_BLOQUE2 = {
  id: "m5-t3-bloque2",
  area: "Matemáticas 5º · T3",
  titulo: "3º Trimestre · Tema 8 · ¿Qué compramos?",
  curso: "5",
  bloque: "Matemáticas · Multiplicación y división de decimales + Cuerpos geométricos",
  resumen: "Multiplicación y división de números decimales, y los cuerpos geométricos y su desarrollo plano.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Multiplicar decimales", descripcion: "Colocar la coma en el producto.", topicId: "decimales-md" },
      { n: 2, titulo: "Dividir decimales", descripcion: "Dividir con la coma.", topicId: "decimales-md" },
      { n: 3, titulo: "Los cuerpos geométricos", descripcion: "Prismas, pirámides y cuerpos redondos.", topicId: "cuerpos-geometricos" },
      { n: 4, titulo: "El desarrollo plano de los cuerpos", descripcion: "Caras, aristas y vértices.", topicId: "cuerpos-geometricos" },
      { n: 5, titulo: "Reto: la compra saludable y el objeto absurdo", descripcion: "Producto final del tema." },
      { n: 6, titulo: "Repaso y examen del tema", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-decimales-md", label: "Multiplicación y división de decimales", motor: "mate-ficha", topicId: "decimales-md", count: 6 },
      { id: "f-cuerpos", label: "Cuerpos geométricos", motor: "mate-ficha", topicId: "cuerpos-geometricos", count: 6 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (tema combinado)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "decimales-md", count: 4 }, { topicId: "cuerpos-geometricos", count: 4 }] },
      { id: "examen", label: "Examen del tema (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "decimales-md", count: 5 }, { topicId: "cuerpos-geometricos", count: 5 }] },
      { id: "explicacion", label: "Explicación y solucionario del tema", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m5-t3-bloque2", titulo: "Guía: operaciones con decimales y cuerpos geométricos", subtitulo: "Documento de apoyo del Tema 8 «¿Qué compramos?».",
          teoria: [
            { heading: "Multiplicación y división de decimales", paragraphs: ["Para multiplicar decimales se multiplica como con naturales y se colocan en el producto tantas cifras decimales como tengan entre los dos factores. Al dividir se iguala la coma o se añaden ceros."] },
            { heading: "Los cuerpos geométricos", paragraphs: ["Los cuerpos geométricos tienen caras, aristas y vértices. Los poliedros (prismas y pirámides) tienen caras planas; los cuerpos redondos (esfera, cilindro, cono) tienen superficies curvas. El desarrollo plano es la figura que resulta al 'desplegar' un cuerpo."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden multiplicar/dividir decimales y reconocer cuerpos o sus desarrollos. La hoja de soluciones da el procedimiento.", ejemplo: "3,25 × 10 = 32,5. Un cubo tiene 6 caras, 12 aristas y 8 vértices." } ],
          variantesACS: { titulo: "Guía sencilla: decimales y cuerpos", subtitulo: "Versión adaptada (ACS, nivel de 3º).",
            teoria: [ { heading: "Decimales y cuerpos", paragraphs: ["Multiplicar por 10 corre la coma un lugar a la derecha. Un cubo tiene 6 caras cuadradas."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con multiplicaciones por 10 y cuerpos conocidos.", ejemplo: "2,5 × 10 = 25." } ] } } },
      { id: "reto", label: "Reto final del tema + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m5-t3-bloque2", titulo: "La compra saludable y el objeto absurdo",
          consigna: ["Este es el reto que integra el tema. Vais a elaborar una lista de la compra para un menú saludable de las cinco comidas del día sin pasaros de 7 €, y a construir un objeto con cuerpos geométricos.",
            "Usaréis lo aprendido: multiplicaréis y dividiréis decimales para calcular el coste, y reconoceréis los cuerpos geométricos y su desarrollo al construir el objeto."],
          pasos: ["Elegid los alimentos de las cinco comidas y su precio (con decimales).", "Calculad el coste de varias unidades multiplicando decimales.", "Sumad el total y comprobad que no pasa de 7 €.", "Construid un objeto usando cuerpos geométricos (con material reciclado) e identificad cada cuerpo.", "Presentad la compra y el objeto explicando los cálculos y los cuerpos usados."],
          criterios: [
            { nombre: "Multiplico y divido decimales para el presupuesto", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Ajusto la compra al presupuesto de 7 €", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Reconozco los cuerpos geométricos del objeto", niveles: ["Todos correctamente.", "La mayoría.", "Alguno, con ayuda.", "No los reconozco."] },
          ],
          variantesACS: { titulo: "La compra saludable y el objeto",
            consigna: ["Vas a sumar el precio de 3 alimentos y decir qué cuerpo es una caja."],
            pasos: ["Elige 3 alimentos con precios sencillos (1,00 €, 2,00 €, 0,50 €) y súmalos.", "Mira una caja y di qué cuerpo geométrico es."],
            criterios: [ { nombre: "Sumo precios", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Reconozco un cuerpo geométrico", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T3_BLOQUE2.id] = UDI_M5_T3_BLOQUE2;
