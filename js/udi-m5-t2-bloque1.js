// ============================================================
// UDI Matemáticas 5º · 2º Trimestre · Tema 4 (SM): "Alimentos para
// todos / Una dieta equilibrada".
// Contenido (programación oficial): las fracciones (concepto,
// equivalencia, comparación y ordenación). Producto/reto: elaborar un
// menú equilibrado con ayuda de las fracciones.
// ============================================================

const UDI_M5_T2_BLOQUE1 = {
  id: "m5-t2-bloque1",
  area: "Matemáticas 5º · T2",
  titulo: "2º Trimestre · Tema 4 · Alimentos para todos",
  curso: "5",
  bloque: "Matemáticas · Las fracciones",
  resumen: "Concepto de fracción, fracciones equivalentes, y comparación y ordenación de fracciones.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Qué es una fracción", descripcion: "Numerador y denominador.", topicId: "fracciones" },
      { n: 2, titulo: "Fracciones equivalentes", descripcion: "Ampliar y simplificar.", topicId: "fracciones" },
      { n: 3, titulo: "Comparación y ordenación de fracciones", descripcion: "Mayor, menor e igual.", topicId: "fracciones" },
      { n: 4, titulo: "Fracción de una cantidad", descripcion: "Calcular partes de un total.", topicId: "fracciones" },
      { n: 5, titulo: "Reto: un menú equilibrado", descripcion: "Producto final del tema." },
      { n: 6, titulo: "Repaso y examen del tema", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-fracciones", label: "Fracciones", motor: "mate-ficha", topicId: "fracciones", count: 8 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso del tema", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "fracciones", count: 8 }] },
      { id: "examen", label: "Examen del tema", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "fracciones", count: 10 }] },
      { id: "explicacion", label: "Explicación y solucionario del tema", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m5-t2-bloque1", titulo: "Guía: las fracciones", subtitulo: "Documento de apoyo del Tema 4 «Alimentos para todos».",
          teoria: [
            { heading: "Qué es una fracción", paragraphs: ["Una fracción representa partes de un todo. El denominador indica en cuántas partes iguales se divide el todo y el numerador cuántas se toman: 3/4 son 3 de 4 partes."] },
            { heading: "Equivalentes, comparar y fracción de una cantidad", paragraphs: ["Dos fracciones son equivalentes si representan la misma cantidad (1/2 = 2/4). Para comparar fracciones con el mismo denominador es mayor la de numerador mayor. Para hallar la fracción de una cantidad se divide entre el denominador y se multiplica por el numerador."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden identificar, comparar u operar fracciones. La hoja de soluciones incluye el procedimiento.", ejemplo: "3/4 de 20 → 20 : 4 = 5; 5 × 3 = 15." } ],
          variantesACS: { titulo: "Guía sencilla: las fracciones", subtitulo: "Versión adaptada (ACS, nivel de 3º).",
            teoria: [ { heading: "La fracción", paragraphs: ["Una pizza en 4 trozos: si te comes 1, es 1/4. Abajo, en cuántos trozos; arriba, cuántos coges."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con dibujos y mitades o cuartos.", ejemplo: "La mitad de 8 → 4." } ] } } },
      { id: "reto", label: "Reto final del tema + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m5-t2-bloque1", titulo: "Un menú equilibrado",
          consigna: ["Este es el reto que integra el tema. Vais a elaborar un menú equilibrado, con ayuda de las fracciones, que podría repartirse entre las familias del centro.",
            "Usaréis lo aprendido: expresaréis las porciones de cada alimento con fracciones, las compararéis y calcularéis la fracción de una cantidad."],
          pasos: ["Elegid un plato y dividid el plato en partes: fruta/verdura, cereales, proteína.", "Expresad cada parte con una fracción (por ejemplo, 1/2 verdura, 1/4 cereales, 1/4 proteína).", "Comprobad que las fracciones suman un entero y ordenadlas de mayor a menor.", "Calculad, si preparáis para 8 personas, cuánta cantidad es cada fracción.", "Presentad vuestro menú explicando los repartos."],
          criterios: [
            { nombre: "Expreso las porciones con fracciones correctas", niveles: ["Sin errores.", "Con algún error.", "Con bastantes errores.", "No lo consigo."] },
            { nombre: "Comparo y ordeno las fracciones", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Calculo la fracción de una cantidad", niveles: ["Correctamente.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "Un menú equilibrado",
            consigna: ["Vas a repartir un plato en mitades y cuartos."],
            pasos: ["Divide un plato en 2 mitades: una de verdura y otra de pasta.", "Divide una mitad en 2: ¿qué fracción del plato es cada trozo?"],
            criterios: [ { nombre: "Reparto en mitades y cuartos", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Nombro la fracción (1/2, 1/4)", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T2_BLOQUE1.id] = UDI_M5_T2_BLOQUE1;
