// ============================================================
// UDI Matemáticas 5º · 3º Trimestre · SDA 1 "Cuadriculamos España":
// áreas y perímetros de figuras planas, circunferencia y cuerpos
// geométricos.
// ============================================================

const UDI_M5_T3_BLOQUE1 = {
  id: "m5-t3-bloque1",
  area: "Matemáticas 5º · T3",
  titulo: "3º Trimestre · SDA 1 · Cuadriculamos España",
  curso: "5",
  bloque: "Matemáticas · Áreas, perímetros y geometría",
  resumen: "Perímetro y área de figuras planas, la circunferencia y el círculo, y los cuerpos geométricos.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Perímetro y área de figuras planas", descripcion: "Cuadrado, rectángulo, triángulo.", topicId: "areas" },
      { n: 2, titulo: "Áreas por conteo de cuadrículas", descripcion: "Estimar y calcular superficies.", topicId: "areas" },
      { n: 3, titulo: "La circunferencia y el círculo", descripcion: "Radio, diámetro y longitud.", topicId: "circunferencia" },
      { n: 4, titulo: "Los cuerpos geométricos", descripcion: "Prismas, pirámides y cuerpos redondos.", topicId: "cuerpos-geometricos" },
      { n: 5, titulo: "Reto: la superficie de nuestra región", descripcion: "Producto final de la SDA." },
      { n: 6, titulo: "Repaso y examen de la SDA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-areas", label: "Áreas y perímetros", motor: "mate-ficha", topicId: "areas", count: 6 },
      { id: "f-circunferencia", label: "Circunferencia y círculo", motor: "mate-ficha", topicId: "circunferencia", count: 5 },
      { id: "f-cuerpos", label: "Cuerpos geométricos", motor: "mate-ficha", topicId: "cuerpos-geometricos", count: 5 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SDA combinada)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "areas", count: 4 }, { topicId: "circunferencia", count: 2 }, { topicId: "cuerpos-geometricos", count: 2 }] },
      { id: "examen", label: "Examen de la SDA (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "areas", count: 5 }, { topicId: "circunferencia", count: 3 }, { topicId: "cuerpos-geometricos", count: 2 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SDA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m5-t3-bloque1", titulo: "Guía: áreas, perímetros y geometría", subtitulo: "Documento de apoyo de la SDA «Cuadriculamos España».",
          teoria: [
            { heading: "Perímetro y área", paragraphs: ["El perímetro es la suma de los lados (la longitud del contorno). El área es la superficie que ocupa la figura: el rectángulo es base × altura; el triángulo es (base × altura) : 2."] },
            { heading: "Circunferencia y cuerpos", paragraphs: ["En la circunferencia, el diámetro es el doble del radio. Los cuerpos geométricos tienen caras, aristas y vértices: prismas y pirámides (con caras planas) y cuerpos redondos (esfera, cilindro, cono)."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden calcular perímetros y áreas o reconocer figuras y cuerpos. La hoja de soluciones da el procedimiento.", ejemplo: "Área de un rectángulo de 5 × 3 → 15 unidades cuadradas." } ],
          variantesACS: { titulo: "Guía sencilla: perímetro y área", subtitulo: "Versión adaptada (ACS, nivel de 3º).",
            teoria: [ { heading: "Perímetro y área", paragraphs: ["El perímetro es todo el borde de la figura. El área es cuántos cuadraditos caben dentro."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Contando cuadraditos y lados.", ejemplo: "Un cuadrado de 3 cuadraditos de lado → área de 9 cuadraditos." } ] } } },
      { id: "reto", label: "Reto final de la SDA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m5-t3-bloque1", titulo: "La superficie de nuestra región",
          consigna: ["Este reto reúne lo trabajado. Sobre un mapa cuadriculado, vais a estimar la superficie de vuestra comunidad o provincia.",
            "Usaréis lo aprendido: calcularéis perímetros y áreas contando cuadrículas y con las fórmulas."],
          pasos: ["Dibujad o pegad el mapa sobre una cuadrícula.", "Contad las cuadrículas completas y estimad las incompletas para hallar el área aproximada.", "Calculad el perímetro aproximado del contorno.", "Comparad vuestra región con otra: ¿cuál tiene más superficie?", "Presentad vuestra estimación explicando cómo la habéis calculado."],
          criterios: [
            { nombre: "Calculo el área contando cuadrículas", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Calculo el perímetro del contorno", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Comparo y explico los resultados", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "La superficie de nuestra región",
            consigna: ["Vas a contar cuántos cuadraditos ocupa una figura en la cuadrícula."],
            pasos: ["Colorea una figura sencilla sobre la cuadrícula.", "Cuenta cuántos cuadraditos has coloreado (el área)."],
            criterios: [ { nombre: "Cuento los cuadraditos", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Digo el área", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T3_BLOQUE1.id] = UDI_M5_T3_BLOQUE1;
