// ============================================================
// UDI Matemáticas 6º · 3º Trimestre · SdA 7 "¡Bienvenida a la
// familia!" (06/04 – 30/04, temporalización del centro 2025-2026).
// Contenidos: números positivos y negativos, representación y
// comparación, suma de números enteros, ejes de coordenadas,
// simetrías, giros y traslaciones, y semejanzas.
// ============================================================

const UDI_M6_SDA7 = {
  id: "m6-sda7",
  area: "Matemáticas 6º · T3",
  titulo: "SdA 7 · ¡Bienvenida a la familia!",
  curso: "6",
  bloque: "Matemáticas · Números enteros + Coordenadas, simetrías, giros y traslaciones",
  resumen: "06/04 – 30/04. Números positivos y negativos, su representación, comparación y suma, y los ejes de coordenadas con simetrías, giros, traslaciones y semejanzas.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Números positivos y negativos", descripcion: "Qué son y dónde aparecen.", topicId: "numeros-enteros" },
      { n: 2, titulo: "Representar y comparar enteros", descripcion: "En la recta numérica.", topicId: "numeros-enteros" },
      { n: 3, titulo: "Suma de números enteros", descripcion: "Con el mismo y distinto signo.", topicId: "numeros-enteros" },
      { n: 4, titulo: "Los ejes de coordenadas", descripcion: "Localizar y representar puntos.", topicId: "coordenadas" },
      { n: 5, titulo: "Simetrías, giros y traslaciones", descripcion: "Movimientos en el plano y semejanzas.", topicId: "coordenadas" },
      { n: 6, titulo: "Reto: el árbol genealógico en coordenadas", descripcion: "Producto final de la SdA." },
      { n: 7, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-enteros", label: "Números enteros", motor: "mate-ficha", topicId: "numeros-enteros", count: 7 },
      { id: "f-coordenadas", label: "Coordenadas y movimientos", motor: "mate-ficha", topicId: "coordenadas", count: 7 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "numeros-enteros", count: 4 }, { topicId: "coordenadas", count: 4 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "numeros-enteros", count: 5 }, { topicId: "coordenadas", count: 5 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m6-sda7", titulo: "Guía: los números enteros y el plano", subtitulo: "Documento de apoyo de la SdA 7 «¡Bienvenida a la familia!» (6º).",
          teoria: [
            { heading: "Los números enteros", paragraphs: ["Los números positivos (+) están a la derecha del cero y los negativos (−), a la izquierda. Aparecen en temperaturas, plantas de un edificio o cuentas bancarias. En la recta numérica, cuanto más a la derecha, mayor es el número: −5 < −2 < 0 < 3."] },
            { heading: "Suma de enteros", paragraphs: ["Si tienen el mismo signo, se suman y se mantiene el signo. Si tienen distinto signo, se restan y se pone el signo del mayor en valor absoluto: (+7) + (−3) = +4."] },
            { heading: "Coordenadas y movimientos", paragraphs: ["Cada punto del plano se localiza con dos números (x, y). Una traslación desplaza la figura, un giro la rota alrededor de un punto y una simetría la refleja respecto a un eje. Dos figuras semejantes tienen la misma forma pero distinto tamaño."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden comparar y sumar enteros o trabajar con coordenadas y movimientos. La hoja de soluciones da el procedimiento.", ejemplo: "(−5) + (+8) = +3. El punto (3, 2) → 3 a la derecha, 2 arriba." } ],
          variantesACS: { titulo: "Guía sencilla: positivos, negativos y el plano", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [ { heading: "Positivos y negativos", paragraphs: ["Como el termómetro: 5 grados sobre cero es +5; 5 bajo cero es −5. El −5 es más frío (menor)."] }, { heading: "Coordenadas", paragraphs: ["Para encontrar un punto se cuenta primero a la derecha y luego hacia arriba."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con el termómetro y puntos sencillos.", ejemplo: "−3 es menor que +1." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m6-sda7", titulo: "El árbol genealógico en coordenadas",
          consigna: ["Este reto integra toda la SdA. Vais a representar un árbol genealógico (real o inventado) sobre un plano de coordenadas y a trabajar con líneas de tiempo que incluyan años antes y después de una fecha.",
            "Usaréis lo aprendido: los números enteros para la línea de tiempo, y las coordenadas, simetrías y giros para colocar y transformar el árbol."],
          pasos: ["Dibujad unos ejes de coordenadas y colocad a cada familiar en un punto, anotando sus coordenadas.",
            "Haced una línea de tiempo tomando un año como cero: los anteriores serán negativos y los posteriores, positivos.",
            "Calculad con sumas de enteros la diferencia de años entre dos familiares.",
            "Aplicad una simetría o un giro a una parte del árbol y anotad las nuevas coordenadas.",
            "Presentad vuestro árbol explicando coordenadas y cálculos."],
          criterios: [
            { nombre: "Comparo y sumo números enteros", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Coloco puntos y anoto sus coordenadas", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Aplico una simetría o un giro", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Presento el árbol con claridad", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "El árbol genealógico en coordenadas",
            consigna: ["Vas a marcar 3 puntos en una cuadrícula y leer un termómetro."],
            pasos: ["Marca 3 puntos en la cuadrícula y di cuántos cuadros hay que contar a la derecha y arriba.", "Di si −3 grados es más frío que +2 grados."],
            criterios: [ { nombre: "Marco puntos en la cuadrícula", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Comparo temperaturas", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M6_SDA7.id] = UDI_M6_SDA7;
