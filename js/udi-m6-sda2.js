// ============================================================
// UDI Matemáticas 6º · 1º Trimestre · SdA 2 "¡A toda máquina!"
// (20/10 – 14/11, temporalización del centro 2025-2026).
// Contenidos: las potencias, múltiplos y divisores, criterios de
// divisibilidad, máximo común divisor, mínimo común múltiplo y
// números primos y compuestos.
// ============================================================

const UDI_M6_SDA2 = {
  id: "m6-sda2",
  area: "Matemáticas 6º · T1",
  titulo: "SdA 2 · ¡A toda máquina!",
  curso: "6",
  bloque: "Matemáticas · Potencias + Múltiplos, divisores, m.c.d. y m.c.m.",
  resumen: "20/10 – 14/11. Las potencias, múltiplos y divisores, criterios de divisibilidad, m.c.d., m.c.m. y números primos y compuestos.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Las potencias", descripcion: "Base, exponente y potencias de 10.", topicId: "potencias" },
      { n: 2, titulo: "Múltiplos y divisores", descripcion: "Cómo se hallan.", topicId: "multiplos-divisores" },
      { n: 3, titulo: "Criterios de divisibilidad", descripcion: "Por 2, 3, 5, 9 y 10.", topicId: "multiplos-divisores" },
      { n: 4, titulo: "Máximo común divisor y mínimo común múltiplo", descripcion: "m.c.d. y m.c.m.", topicId: "multiplos-divisores" },
      { n: 5, titulo: "Números primos y compuestos", descripcion: "Descomposición factorial.", topicId: "multiplos-divisores" },
      { n: 6, titulo: "Reto: engranajes que encajan", descripcion: "Producto final de la SdA." },
      { n: 7, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-potencias", label: "Las potencias", motor: "mate-ficha", topicId: "potencias", count: 6 },
      { id: "f-mult-div", label: "Múltiplos, divisores, m.c.d. y m.c.m.", motor: "mate-ficha", topicId: "multiplos-divisores", count: 8 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "potencias", count: 3 }, { topicId: "multiplos-divisores", count: 5 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "potencias", count: 4 }, { topicId: "multiplos-divisores", count: 6 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m6-sda2", titulo: "Guía: potencias, divisibilidad, m.c.d. y m.c.m.", subtitulo: "Documento de apoyo de la SdA 2 «¡A toda máquina!» (6º).",
          teoria: [
            { heading: "Las potencias", paragraphs: ["Una potencia es una multiplicación de factores iguales: 2³ = 2 × 2 × 2 = 8. La base es el factor y el exponente, las veces que se repite. Las potencias de base 10 tienen tantos ceros como indica el exponente."] },
            { heading: "Múltiplos, divisores y divisibilidad", paragraphs: ["Los múltiplos se obtienen multiplicando por 1, 2, 3... Un divisor divide de forma exacta. Criterios: por 2 si acaba en cifra par; por 3 si la suma de sus cifras es múltiplo de 3; por 5 si acaba en 0 o 5; por 10 si acaba en 0."] },
            { heading: "m.c.d., m.c.m. y números primos", paragraphs: ["El máximo común divisor (m.c.d.) es el mayor divisor común; el mínimo común múltiplo (m.c.m.), el menor múltiplo común. Un número primo solo tiene dos divisores (1 y él mismo); los demás son compuestos."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden calcular potencias, hallar múltiplos/divisores, aplicar criterios o calcular m.c.d. y m.c.m. La hoja de soluciones da el procedimiento.", ejemplo: "m.c.d.(12, 18) = 6; m.c.m.(4, 6) = 12." } ],
          variantesACS: { titulo: "Guía sencilla: múltiplos y divisores", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [ { heading: "Múltiplos y divisores", paragraphs: ["Los múltiplos de 2 son 2, 4, 6, 8 (la tabla del 2). Un divisor reparte sin que sobre nada."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con las tablas y números pequeños.", ejemplo: "Divisores de 12 → 1, 2, 3, 4, 6, 12." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m6-sda2", titulo: "Engranajes que encajan",
          consigna: ["Este reto integra toda la SdA. Vais a diseñar una máquina con engranajes y a calcular cuándo vuelven a coincidir sus dientes.",
            "Usaréis lo aprendido: el m.c.m. para saber cada cuántas vueltas coinciden, el m.c.d. para repartir piezas, los criterios de divisibilidad y las potencias para expresar cantidades grandes."],
          pasos: ["Dibujad dos o tres engranajes y dadles un número de dientes.",
            "Calculad el m.c.m. de esos números para saber cada cuántos dientes vuelven a coincidir.",
            "Repartid un número de piezas entre los engranajes usando el m.c.d.",
            "Comprobad con los criterios de divisibilidad si vuestros números son divisibles por 2, 3 o 5.",
            "Expresad alguna cantidad grande con una potencia y presentad la máquina."],
          criterios: [
            { nombre: "Calculo el m.c.m. y el m.c.d.", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Aplico los criterios de divisibilidad", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Uso potencias para expresar cantidades", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No las uso."] },
            { nombre: "Explico el funcionamiento de la máquina", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "Engranajes que encajan",
            consigna: ["Vas a escribir los múltiplos de 2 y de 3 y ver cuál se repite."],
            pasos: ["Escribe los 5 primeros múltiplos de 2.", "Escribe los 5 primeros múltiplos de 3.", "Busca un número que esté en las dos listas."],
            criterios: [ { nombre: "Escribo múltiplos", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Encuentro uno común", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M6_SDA2.id] = UDI_M6_SDA2;
