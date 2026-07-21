// ============================================================
// UDI Matemáticas 5º · 1º Trimestre · SDA 1 "Investigamos el espacio":
// números grandes y las cuatro operaciones (descomposición, redondeo,
// sumas, restas, multiplicaciones, divisiones, propiedades y
// operaciones combinadas). Motores mate-ficha / mate-examen.
// ============================================================

const UDI_M5_T1_BLOQUE1 = {
  id: "m5-t1-bloque1",
  area: "Matemáticas 5º · T1",
  titulo: "1º Trimestre · SDA 1 · Investigamos el espacio",
  curso: "5",
  bloque: "Matemáticas · Números grandes y las cuatro operaciones",
  resumen: "Descomposición y redondeo de números grandes, sumas, restas, multiplicaciones, divisiones, sus propiedades y operaciones combinadas.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],

  fases: [
    {
      id: "plan", label: "Plan de la UDI", tipo: "plan",
      sesiones: [
        { n: 1, titulo: "Números grandes: lectura, descomposición y redondeo", descripcion: "Hasta 6 cifras.", topicId: "numeros-grandes" },
        { n: 2, titulo: "Sumas y restas (cálculo y propiedades)", descripcion: "Mentales y con llevadas; prueba de la resta.", topicId: "sumas" },
        { n: 3, titulo: "Multiplicaciones y sus propiedades", descripcion: "Términos y propiedades.", topicId: "multiplicaciones" },
        { n: 4, titulo: "Divisiones y su prueba", descripcion: "Partes de la división.", topicId: "divisiones" },
        { n: 5, titulo: "Operaciones combinadas", descripcion: "Orden de las operaciones y paréntesis.", topicId: "operaciones-combinadas" },
        { n: 6, titulo: "Reto: nuestro sistema solar a escala", descripcion: "Producto final de la SDA." },
        { n: 7, titulo: "Repaso y examen de la SDA", descripcion: "Ficha de repaso y prueba de evaluación." },
      ],
    },
    {
      id: "fichas", label: "Fichas por bloque", tipo: "fichas",
      documentos: [
        { id: "f-numeros-grandes", label: "Números grandes", motor: "mate-ficha", topicId: "numeros-grandes", count: 5 },
        { id: "f-sumas", label: "Sumas", motor: "mate-ficha", topicId: "sumas", count: 5 },
        { id: "f-restas", label: "Restas", motor: "mate-ficha", topicId: "restas", count: 5 },
        { id: "f-multiplicaciones", label: "Multiplicaciones", motor: "mate-ficha", topicId: "multiplicaciones", count: 5 },
        { id: "f-divisiones", label: "Divisiones", motor: "mate-ficha", topicId: "divisiones", count: 5 },
        { id: "f-combinadas", label: "Operaciones combinadas", motor: "mate-ficha", topicId: "operaciones-combinadas", count: 5 },
      ],
    },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    {
      id: "evaluacion", label: "Evaluación", tipo: "evaluacion",
      documentos: [
        { id: "repaso", label: "Ficha de repaso (SDA combinada)", motor: "mate-examen", tipo: "repaso",
          topics: [{ topicId: "numeros-grandes", count: 2 }, { topicId: "sumas", count: 1 }, { topicId: "restas", count: 1 }, { topicId: "multiplicaciones", count: 2 }, { topicId: "divisiones", count: 2 }, { topicId: "operaciones-combinadas", count: 2 }] },
        { id: "examen", label: "Examen de la SDA (combinado)", motor: "mate-examen", tipo: "examen",
          topics: [{ topicId: "numeros-grandes", count: 2 }, { topicId: "multiplicaciones", count: 3 }, { topicId: "divisiones", count: 3 }, { topicId: "operaciones-combinadas", count: 3 }] },
        { id: "explicacion", label: "Explicación y solucionario de la SDA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
          args: {
            id: "m5-t1-bloque1",
            titulo: "Guía: números grandes y las cuatro operaciones",
            subtitulo: "Documento de apoyo de la SDA «Investigamos el espacio».",
            teoria: [
              { heading: "Números grandes", paragraphs: ["Un número se descompone según el valor de cada cifra (unidades, decenas, centenas, unidades de millar...). Redondear es sustituir por el número «acabado en ceros» más cercano de un orden dado."] },
              { heading: "Las cuatro operaciones", paragraphs: ["Suma y resta se comprueban con la prueba de la resta. La multiplicación tiene propiedades (conmutativa, asociativa, distributiva). La división se comprueba con la prueba de la división: divisor × cociente + resto = dividendo."] },
              { heading: "Operaciones combinadas", paragraphs: ["Primero se resuelven los paréntesis, después las multiplicaciones y divisiones (de izquierda a derecha) y por último las sumas y restas."] },
            ],
            comoCorregir: [
              { tipo: "Fichas de problemas", explicacion: "Cada problema pide identificar los datos, plantear la operación y dar la solución con su unidad. La hoja de soluciones incluye la operación y el resultado.", ejemplo: "Redondear 348.712 a las decenas de millar → 350.000." },
            ],
            variantesACS: {
              titulo: "Guía sencilla: números y operaciones",
              subtitulo: "Versión adaptada (ACS, nivel de 3º).",
              teoria: [
                { heading: "Números", paragraphs: ["Cada cifra vale según su lugar: unidades, decenas, centenas."] },
                { heading: "Operaciones", paragraphs: ["Sumar es juntar, restar es quitar, multiplicar es sumar varias veces y dividir es repartir."] },
              ],
              comoCorregir: [ { tipo: "Fichas", explicacion: "Números pequeños y de un solo paso.", ejemplo: "24 + 13 = 37." } ],
            },
          } },
        { id: "reto", label: "Reto final de la SDA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
          args: {
            id: "m5-t1-bloque1",
            titulo: "Nuestro sistema solar a escala",
            consigna: [
              "Este reto reúne lo trabajado en la SDA. En grupo vais a construir una maqueta del sistema solar respetando (a escala) el tamaño de cada planeta y su distancia al Sol.",
              "Usaréis lo aprendido: leeréis y redondearéis números grandes (distancias en km), y haréis operaciones (multiplicaciones, divisiones y combinadas) para calcular las medidas a escala.",
            ],
            pasos: [
              "Anotad las distancias reales de los planetas al Sol (números grandes) y redondeadlas.",
              "Elegid una escala (por ejemplo, 1 cm = 10 millones de km) y calculad con divisiones la distancia de cada planeta en la maqueta.",
              "Calculad con multiplicaciones el tamaño a escala de cada planeta.",
              "Construid la maqueta colocando cada planeta a su distancia.",
              "Explicad al resto de la clase cómo habéis hecho los cálculos.",
            ],
            criterios: [
              { nombre: "Leo y redondeo correctamente los números grandes", niveles: ["Leo y redondeo sin errores.", "Con algún error.", "Con bastantes errores.", "No lo consigo."] },
              { nombre: "Aplico las operaciones para calcular la escala", niveles: ["Multiplico y divido correctamente para la escala.", "Con algún error.", "Con bastantes errores.", "No planteo las operaciones."] },
              { nombre: "Construyo la maqueta respetando las medidas", niveles: ["La maqueta respeta tamaños y distancias.", "Respeta una de las dos cosas.", "La maqueta no respeta las medidas.", "No construyo la maqueta."] },
              { nombre: "Explico mis cálculos al grupo", niveles: ["Explico con claridad el procedimiento.", "Explico con ayuda.", "Explico con dificultad.", "No lo explico."] },
            ],
            variantesACS: {
              titulo: "Nuestro sistema solar a escala",
              consigna: ["Vas a colocar los planetas en orden y contar cuántos son, usando números y sumas sencillas."],
              pasos: ["Ordena los planetas del más cercano al más lejano al Sol.", "Cuenta cuántos planetas hay.", "Suma cuántos son rocosos y cuántos gaseosos."],
              criterios: [
                { nombre: "Ordeno y cuento los planetas", niveles: ["Lo hago bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] },
                { nombre: "Hago una suma sencilla", niveles: ["Sumo bien.", "Sumo con ayuda.", "Lo intento.", "No lo consigo."] },
              ],
            },
          } },
      ],
    },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};

window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T1_BLOQUE1.id] = UDI_M5_T1_BLOQUE1;
