// ============================================================
// UDI Matemáticas 5º · 1º Trimestre · Tema 3 (SM): "¡Las fiestas del
// pueblo / España en coordenadas / ¿Bailamos?".
// Contenido (programación oficial): múltiplos y divisores de un número
// y posiciones y movimientos en el plano (coordenadas). Producto/reto:
// carteles para organizar a los niños en los juegos populares.
// ============================================================

const UDI_M5_T1_BLOQUE3 = {
  id: "m5-t1-bloque3",
  area: "Matemáticas 5º · T1",
  titulo: "1º Trimestre · Tema 3 · Las fiestas del pueblo",
  curso: "5",
  bloque: "Matemáticas · Múltiplos y divisores + Coordenadas",
  resumen: "Múltiplos y divisores de un número, y posiciones y movimientos en el plano (coordenadas cartesianas).",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "Múltiplos de un número", descripcion: "Qué son y cómo se hallan.", topicId: "multiplos-divisores" },
      { n: 2, titulo: "Divisores y divisiones exactas", descripcion: "Divisores comunes.", topicId: "multiplos-divisores" },
      { n: 3, titulo: "El plano y las coordenadas", descripcion: "Ejes X e Y; localizar puntos.", topicId: "coordenadas" },
      { n: 4, titulo: "Posiciones y movimientos en el plano", descripcion: "Representar puntos, traslaciones y giros.", topicId: "coordenadas" },
      { n: 5, titulo: "Reto: organizamos los juegos populares", descripcion: "Producto final del tema." },
      { n: 6, titulo: "Repaso y examen del tema", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-mult-div", label: "Múltiplos y divisores", motor: "mate-ficha", topicId: "multiplos-divisores", count: 6 },
      { id: "f-coordenadas", label: "Coordenadas", motor: "mate-ficha", topicId: "coordenadas", count: 6 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (tema combinado)", motor: "mate-examen", tipo: "repaso",
        topics: [{ topicId: "multiplos-divisores", count: 4 }, { topicId: "coordenadas", count: 4 }] },
      { id: "examen", label: "Examen del tema (combinado)", motor: "mate-examen", tipo: "examen",
        topics: [{ topicId: "multiplos-divisores", count: 5 }, { topicId: "coordenadas", count: 5 }] },
      { id: "explicacion", label: "Explicación y solucionario del tema", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "m5-t1-bloque3", titulo: "Guía: múltiplos y divisores, y coordenadas", subtitulo: "Documento de apoyo del Tema 3 «Las fiestas del pueblo».",
          teoria: [
            { heading: "Múltiplos y divisores", paragraphs: ["Los múltiplos de un número se obtienen multiplicándolo por 1, 2, 3... Un número es divisor de otro si lo divide de forma exacta (resto 0). El divisor común es el que divide a varios números a la vez."] },
            { heading: "Posiciones y movimientos en el plano", paragraphs: ["En el plano cartesiano cada punto se localiza con dos números (x, y): el primero es el desplazamiento horizontal y el segundo el vertical. Los puntos se pueden trasladar y girar."] },
          ],
          comoCorregir: [ { tipo: "Fichas", explicacion: "Las fichas piden hallar múltiplos/divisores o localizar y escribir coordenadas. La hoja de soluciones da el procedimiento.", ejemplo: "Divisores de 12 → 1, 2, 3, 4, 6, 12. El punto (3, 2) → 3 a la derecha y 2 arriba." } ],
          variantesACS: { titulo: "Guía sencilla: múltiplos, divisores y coordenadas", subtitulo: "Versión adaptada (ACS, nivel de 3º).",
            teoria: [ { heading: "Múltiplos y divisores", paragraphs: ["Los múltiplos de 2 son 2, 4, 6, 8... Un divisor reparte sin que sobre nada."] }, { heading: "Coordenadas", paragraphs: ["Para encontrar un punto se cuenta primero a la derecha y luego hacia arriba."] } ],
            comoCorregir: [ { tipo: "Fichas", explicacion: "Con las tablas y puntos sencillos.", ejemplo: "(1, 1) → 1 a la derecha, 1 arriba." } ] } } },
      { id: "reto", label: "Reto final del tema + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "m5-t1-bloque3", titulo: "Organizamos los juegos populares",
          consigna: ["Este es el reto que integra el tema. Vais a hacer unos carteles para organizar a los niños de quinto en los juegos populares de las fiestas del pueblo.",
            "Usaréis lo aprendido: repartiréis a los participantes en grupos iguales usando divisores, y colocaréis los puestos de juego en un plano usando coordenadas."],
          pasos: ["Decidid cuántos niños participan y en cuántos grupos iguales se pueden repartir (buscad los divisores).", "Asignad cada grupo a un juego popular.", "Dibujad un plano del recinto y colocad cada juego en unas coordenadas.", "Escribid las coordenadas de cada puesto en el cartel.", "Presentad los carteles explicando los repartos y las coordenadas."],
          criterios: [
            { nombre: "Reparto a los participantes en grupos iguales (divisores)", niveles: ["Sin errores.", "Con algún error.", "Con dificultad.", "No lo consigo."] },
            { nombre: "Coloco los puestos con sus coordenadas", niveles: ["Correctamente.", "Con algún error.", "Con ayuda.", "No lo consigo."] },
            { nombre: "Presento los carteles con el vocabulario adecuado", niveles: ["Con claridad.", "Con ayuda.", "Con dificultad.", "No lo consigo."] },
          ],
          variantesACS: { titulo: "Organizamos los juegos populares",
            consigna: ["Vas a repartir a los niños en grupos iguales y marcar un punto en una cuadrícula."],
            pasos: ["Reparte 12 niños en grupos de 2, de 3 y de 4.", "Marca en la cuadrícula dónde está un juego (cuenta a la derecha y arriba)."],
            criterios: [ { nombre: "Reparto en grupos iguales", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] }, { nombre: "Marco un punto en la cuadrícula", niveles: ["Bien.", "Con ayuda.", "Lo intento.", "No lo consigo."] } ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_M5_T1_BLOQUE3.id] = UDI_M5_T1_BLOQUE3;
