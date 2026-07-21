// ============================================================
// UDI Matemáticas 5º · 1º Trimestre · SDA 2 "Las fiestas del pueblo":
// múltiplos y divisores (y, como repaso, números romanos y potencias).
// ============================================================

const UDI_M5_T1_BLOQUE2 = {
  id: "m5-t1-bloque2",
  area: "Matemáticas 5º · T1",
  titulo: "1º Trimestre · SDA 2 · Las fiestas del pueblo",
  curso: "5",
  bloque: "Matemáticas · Múltiplos y divisores",
  resumen: "Múltiplos y divisores, divisores comunes y divisiones exactas; repaso de potencias y números romanos.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Múltiplos de un número", descripcion: "Qué son y cómo se hallan.", topicId: "multiplos-divisores" },
      { n: 2, titulo: "Divisores y divisiones exactas", descripcion: "Divisores comunes y m.c.m.", topicId: "multiplos-divisores" },
      { n: 3, titulo: "Las potencias", descripcion: "Potencias y potencias de base 10.", topicId: "potencias" },
      { n: 4, titulo: "Números romanos", descripcion: "Leer y escribir números romanos.", topicId: "numeros-romanos" },
      { n: 5, titulo: "Reto: organizamos la fiesta del pueblo", descripcion: "Producto final de la SDA." },
      { n: 6, titulo: "Repaso y examen de la SDA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-mult-div", label: "Múltiplos y divisores", motor: "mate-ficha", topicId: "multiplos-divisores", count: 6 },
      { id: "f-potencias", label: "Las potencias", motor: "mate-ficha", topicId: "potencias", count: 5 },
      { id: "f-romanos", label: "Números romanos", motor: "mate-ficha", topicId: "numeros-romanos", count: 5 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SDA combinada)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "multiplos-divisores", count: 4 }, { topicId: "potencias", count: 2 }, { topicId: "numeros-romanos", count: 2 }] },
      { id: "examen", label: "Examen de la SDA (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "multiplos-divisores", count: 5 }, { topicId: "potencias", count: 3 }, { topicId: "numeros-romanos", count: 2 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SDA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m5-t1-bloque2", titulo: "Guía: múltiplos, divisores, potencias y romanos", subtitulo: "Documento de apoyo de la SDA «Las fiestas del pueblo».",
          teoria: [
            { heading: "Múltiplos y divisores", paragraphs: ["Los múltiplos de un número se obtienen multiplicándolo por 1, 2, 3... Un número es divisor de otro si lo divide de forma exacta (resto 0). El divisor común es el que divide a varios números a la vez."] },
            { heading: "Potencias", paragraphs: ["Una potencia es una multiplicación de factores iguales: 2³ = 2 × 2 × 2 = 8. Las potencias de base 10 (10, 100, 1000) tienen tantos ceros como indica el exponente."] },
            { heading: "Números romanos", paragraphs: ["Se usan las letras I, V, X, L, C, D, M. Si una letra menor va antes de una mayor, se resta (IV = 4); si va después, se suma (VI = 6)."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Cada ficha pide hallar múltiplos/divisores, calcular potencias o convertir romanos. La hoja de soluciones incluye el procedimiento.", ejemplo: "Divisores de 12 → 1, 2, 3, 4, 6, 12." } ],
          variantesACS: { titulo: "Guía sencilla: múltiplos y divisores", subtitulo: "Versión adaptada (ACS, nivel de 3º).",
            teoria: [ { heading: "Múltiplos", paragraphs: ["Los múltiplos de 2 son 2, 4, 6, 8... (la tabla del 2)."] }, { heading: "Divisores", paragraphs: ["Un divisor reparte sin que sobre nada: 6 se reparte entre 2 (6 : 2 = 3)."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con números pequeños y las tablas.", ejemplo: "Múltiplos de 3 → 3, 6, 9." } ] } } },
      { id: "reto", label: "Reto final de la SDA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m5-t1-bloque2", titulo: "Organizamos la fiesta del pueblo",
          consigna: ["Este reto reúne lo trabajado. Vais a organizar los preparativos de una fiesta usando múltiplos y divisores.",
            "Repartiréis en grupos iguales, colocaréis la decoración en filas exactas y contaréis usando lo aprendido."],
          pasos: ["Repartid 24 sillas en filas iguales: buscad todos los divisores de 24.", "Colocad las guirnaldas cada cierto número de metros: usad múltiplos.", "Averiguad cada cuántos días coinciden dos actividades: buscad un múltiplo común.", "Escribid el año de la fiesta en números romanos.", "Explicad vuestros repartos a la clase."],
          criterios: [
            { nombre: "Hallo divisores para repartir en grupos iguales", niveles: ["Sin errores.", "Con algún error.", "Con bastantes errores.", "No lo consigo."] },
            { nombre: "Uso múltiplos para colocar la decoración", niveles: ["Correctamente.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Escribo el año en números romanos", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "Organizamos la fiesta del pueblo",
            consigna: ["Vas a repartir cosas en grupos iguales y contar con las tablas."],
            pasos: ["Reparte 12 globos en grupos de 2, de 3 y de 4.", "Cuenta cuántos grupos salen en cada caso."],
            criterios: [ { nombre: "Reparto en grupos iguales", niveles: ["Lo hago bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Cuento los grupos", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T1_BLOQUE2.id] = UDI_M5_T1_BLOQUE2;
