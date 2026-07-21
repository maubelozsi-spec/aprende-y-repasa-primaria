// ============================================================
// UDI Matemáticas 6º · 1º Trimestre · SdA 3 "El proceso electoral"
// (17/11 – 12/12, temporalización del centro 2025-2026).
// Contenidos: fracciones (equivalencia, comparación y ordenación),
// fracción irreducible, fracción de un número, operaciones con
// fracciones, la fracción como división y operaciones combinadas.
// ============================================================

const UDI_M6_SDA3 = {
  id: "m6-sda3",
  area: "Matemáticas 6º · T1",
  titulo: "SdA 3 · El proceso electoral",
  curso: "6",
  bloque: "Matemáticas · Las fracciones y sus operaciones",
  resumen: "17/11 – 12/12. Equivalencia, comparación y ordenación de fracciones, fracción irreducible, fracción de un número, operaciones con fracciones y la fracción como división.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Fracciones equivalentes", descripcion: "Ampliar y simplificar.", topicId: "fracciones" },
      { n: 2, titulo: "Comparación y ordenación", descripcion: "Reducir a común denominador.", topicId: "fracciones" },
      { n: 3, titulo: "Fracción irreducible y fracción de un número", descripcion: "Simplificar al máximo.", topicId: "fracciones" },
      { n: 4, titulo: "Operaciones con fracciones", descripcion: "Suma, resta, producto y cociente.", topicId: "operaciones-fracciones" },
      { n: 5, titulo: "La fracción como división y combinadas", descripcion: "Operaciones combinadas con fracciones.", topicId: "operaciones-fracciones" },
      { n: 6, titulo: "Reto: el reparto de los votos", descripcion: "Producto final de la SdA." },
      { n: 7, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-fracciones", label: "Fracciones", motor: "mate-ficha", topicId: "fracciones", count: 7 },
      { id: "f-op-fracciones", label: "Operaciones con fracciones", motor: "mate-ficha", topicId: "operaciones-fracciones", count: 7 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "fracciones", count: 4 }, { topicId: "operaciones-fracciones", count: 4 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "fracciones", count: 5 }, { topicId: "operaciones-fracciones", count: 5 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m6-sda3", titulo: "Guía: las fracciones y sus operaciones", subtitulo: "Documento de apoyo de la SdA 3 «El proceso electoral» (6º).",
          teoria: [
            { heading: "Fracciones equivalentes e irreducibles", paragraphs: ["Dos fracciones son equivalentes si representan la misma cantidad (1/2 = 2/4); se obtienen multiplicando o dividiendo numerador y denominador por el mismo número. Una fracción es irreducible cuando ya no se puede simplificar más."] },
            { heading: "Comparar, ordenar y fracción de un número", paragraphs: ["Para comparar fracciones con distinto denominador se reducen a común denominador. Para hallar la fracción de una cantidad se divide entre el denominador y se multiplica por el numerador."] },
            { heading: "Operaciones con fracciones", paragraphs: ["Suma y resta: se reducen a común denominador y se operan los numeradores. Producto: se multiplican numeradores y denominadores. La fracción también se puede entender como una división: 3/4 = 3 : 4."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden simplificar, comparar u operar fracciones. La hoja de soluciones incluye el procedimiento.", ejemplo: "3/4 de 20 → 20 : 4 = 5; 5 × 3 = 15." } ],
          variantesACS: { titulo: "Guía sencilla: las fracciones", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [ { heading: "La fracción", paragraphs: ["Una tarta en 4 trozos: si coges 1, es 1/4. Abajo, en cuántos trozos; arriba, cuántos coges."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con mitades y cuartos.", ejemplo: "La mitad de 10 → 5." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m6-sda3", titulo: "El reparto de los votos",
          consigna: ["Este reto integra toda la SdA. Vais a simular unas elecciones en clase y a analizar el reparto de los votos con fracciones.",
            "Usaréis lo aprendido: expresaréis los resultados en fracciones, las simplificaréis, las compararéis y ordenaréis, y calcularéis la fracción de una cantidad."],
          pasos: ["Organizad una votación en clase con 3 o 4 opciones y contad los votos.",
            "Expresad los votos de cada opción como una fracción del total.",
            "Simplificad esas fracciones hasta la irreducible.",
            "Ordenad las opciones de más a menos votada comparando las fracciones.",
            "Calculad cuántos alumnos serían esa fracción si la clase tuviera 30 personas.",
            "Presentad los resultados en un cartel."],
          criterios: [
            { nombre: "Expreso los resultados en fracciones correctas", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Simplifico hasta la fracción irreducible", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Comparo y ordeno las fracciones", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Calculo la fracción de una cantidad", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "El reparto de los votos",
            consigna: ["Vas a contar votos y decir qué fracción es la mitad."],
            pasos: ["Cuenta los votos de 2 opciones.", "Di cuál tiene más votos.", "Si la mitad de la clase votó una opción, escribe 1/2."],
            criterios: [ { nombre: "Cuento y comparo votos", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Escribo la fracción 1/2", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M6_SDA3.id] = UDI_M6_SDA3;
