// ============================================================
// UDI Lengua 6º · 1º Trimestre · SdA 1 "Científicamente demostrado"
// (22/09 – 17/10, según la temporalización del centro 2025-2026).
// Contenidos: el texto científico, el sustantivo, el adjetivo, la
// formación de palabras (morfemas) y la acentuación (agudas, llanas
// y esdrújulas).
// ============================================================

const UDI_L6_SDA1 = {
  id: "l6-sda1",
  area: "Lengua 6º · T1",
  titulo: "SdA 1 · Científicamente demostrado",
  curso: "6",
  bloque: "Lengua · El texto científico + El sustantivo y el adjetivo + Morfemas + Acentuación",
  resumen: "22/09 – 17/10. El texto científico, el sustantivo y el adjetivo, la formación de palabras (morfemas) y la acentuación de agudas, llanas y esdrújulas.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],
  fases: [
    { id: "plan", label: "Plan de la UDI", tipo: "plan", sesiones: [
      { n: 1, titulo: "El texto científico", descripcion: "Rasgos y vocabulario preciso.", topicId: "tipos-texto-6" },
      { n: 2, titulo: "El sustantivo", descripcion: "Clases, género y número.", topicId: "sustantivo-pronombre" },
      { n: 3, titulo: "El adjetivo", descripcion: "Grados y concordancia.", topicId: "adjetivo" },
      { n: 4, titulo: "Formación de palabras: los morfemas", descripcion: "Raíz, prefijos y sufijos.", topicId: "formacion-palabras" },
      { n: 5, titulo: "Acentuación: agudas, llanas y esdrújulas", descripcion: "Reglas generales de la tilde.", topicId: "ortografia" },
      { n: 6, titulo: "Reto: nuestro artículo científico", descripcion: "Producto final de la SdA." },
      { n: 7, titulo: "Repaso y examen de la SdA", descripcion: "Ficha de repaso y prueba." },
    ] },
    { id: "fichas", label: "Fichas por bloque", tipo: "fichas", documentos: [
      { id: "f-cientifico", label: "El texto científico", motor: "lengua-ficha", topicId: "tipos-texto-6", count: 5 },
      { id: "f-sustantivo", label: "El sustantivo", motor: "lengua-ficha", topicId: "sustantivo-pronombre", count: 5 },
      { id: "f-adjetivo", label: "El adjetivo", motor: "lengua-ficha", topicId: "adjetivo", count: 5 },
      { id: "f-morfemas", label: "Morfemas y formación de palabras", motor: "lengua-ficha", topicId: "formacion-palabras", count: 5 },
      { id: "f-acentuacion", label: "Acentuación", motor: "lengua-ficha", topicId: "ortografia", count: 5 },
    ] },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    { id: "evaluacion", label: "Evaluación", tipo: "evaluacion", documentos: [
      { id: "repaso", label: "Ficha de repaso (SdA combinada)", motor: "lengua-examen", tipo: "repaso",
        topics: [{ topicId: "tipos-texto-6", count: 2 }, { topicId: "sustantivo-pronombre", count: 2 }, { topicId: "adjetivo", count: 2 }, { topicId: "formacion-palabras", count: 2 }, { topicId: "ortografia", count: 2 }] },
      { id: "examen", label: "Examen de la SdA (combinado)", motor: "lengua-examen", tipo: "examen",
        topics: [{ topicId: "tipos-texto-6", count: 3 }, { topicId: "sustantivo-pronombre", count: 3 }, { topicId: "adjetivo", count: 3 }, { topicId: "formacion-palabras", count: 3 }, { topicId: "ortografia", count: 3 }] },
      { id: "explicacion", label: "Explicación y solucionario de la SdA", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
        args: { id: "l6-sda1", titulo: "Guía: el texto científico, el nombre, el adjetivo y la tilde", subtitulo: "Documento de apoyo de la SdA 1 «Científicamente demostrado» (6º).",
          teoria: [
            { heading: "El texto científico", paragraphs: ["Explica un tema de ciencia de forma objetiva, ordenada y con vocabulario preciso (tecnicismos). Suele incluir datos, definiciones y, a veces, gráficos o esquemas."] },
            { heading: "El sustantivo y el adjetivo", paragraphs: ["El sustantivo nombra seres, cosas o ideas y varía en género y número. El adjetivo expresa cualidades del sustantivo, concuerda con él y tiene grados (positivo, comparativo y superlativo). En los textos científicos se usan sustantivos y adjetivos muy precisos."] },
            { heading: "Los morfemas", paragraphs: ["Las palabras se forman con una raíz (lexema) y morfemas: prefijos delante (bio-, re-, des-) y sufijos detrás (-logía, -oso). Muchos tecnicismos científicos se forman así: bio + logía = biología."] },
            { heading: "La acentuación", paragraphs: ["Agudas: llevan tilde si acaban en vocal, -n o -s. Llanas: llevan tilde si NO acaban en vocal, -n o -s. Esdrújulas: llevan tilde siempre."] },
          ],
          comoCorregir: [
            { tipo: "El texto científico", explicacion: "Se comprueba si el texto informa de forma objetiva con vocabulario técnico.", ejemplo: "«La fotosíntesis transforma la energía luminosa» → texto científico." },
            { tipo: "Sustantivo y adjetivo", explicacion: "Se clasifica el sustantivo e identifica el grado del adjetivo.", ejemplo: "«el más preciso» → superlativo." },
            { tipo: "Morfemas", explicacion: "Se separa la raíz de los prefijos y sufijos.", ejemplo: "«biología» → bio- + -logía." },
            { tipo: "Acentuación", explicacion: "Se localiza la sílaba tónica y se aplica la regla.", ejemplo: "«árbol» → llana acabada en -l, lleva tilde." },
          ],
          variantesACS: { titulo: "Guía sencilla: nombres, adjetivos y tildes", subtitulo: "Versión adaptada (ACS, nivel de 4º).",
            teoria: [
              { heading: "Nombres y adjetivos", paragraphs: ["El nombre dice qué es algo (perro, mesa). El adjetivo dice cómo es (grande, azul)."] },
              { heading: "La tilde", paragraphs: ["La sílaba fuerte es la que suena más. Las esdrújulas (la fuerte es la antepenúltima) siempre llevan tilde: pájaro, música."] },
            ],
            comoCorregir: [ { tipo: "Idea principal", explicacion: "Basta reconocer la idea básica.", ejemplo: "«rápido» → es un adjetivo." } ] } } },
      { id: "reto", label: "Reto final de la SdA + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
        args: { id: "l6-sda1", titulo: "Nuestro artículo científico",
          consigna: ["Este reto integra toda la SdA. Vais a escribir un breve artículo científico divulgativo sobre un fenómeno que os interese (la fotosíntesis, los volcanes, el sonido...).",
            "Usaréis lo aprendido: la estructura del texto científico, sustantivos y adjetivos precisos, tecnicismos formados con morfemas, y la acentuación correcta."],
          pasos: ["Elegid el fenómeno y buscad tres datos fiables sobre él.",
            "Escribid el artículo de forma objetiva: una definición, la explicación y una conclusión.",
            "Usad sustantivos y adjetivos precisos, y al menos tres tecnicismos; señalad sus morfemas (prefijo/sufijo).",
            "Revisad la acentuación de todas las palabras (agudas, llanas y esdrújulas).",
            "Presentad el artículo a la clase."],
          criterios: [
            { nombre: "Escribo un texto científico objetivo y bien estructurado", niveles: ["Objetivo, ordenado y con datos.", "Bastante objetivo, algo desordenado.", "Mezcla opiniones o le falta estructura.", "No es un texto científico."] },
            { nombre: "Uso sustantivos y adjetivos precisos", niveles: ["Vocabulario preciso y variado.", "Vocabulario correcto pero sencillo.", "Vocabulario impreciso.", "Vocabulario muy pobre."] },
            { nombre: "Identifico los morfemas de los tecnicismos", niveles: ["Identifico raíz, prefijos y sufijos.", "Identifico alguno.", "Lo hago con ayuda.", "No los identifico."] },
            { nombre: "Aplico bien las reglas de acentuación", niveles: ["Sin errores de tilde.", "Con algún error.", "Con bastantes errores.", "No aplico las reglas."] },
          ],
          variantesACS: { titulo: "Nuestro artículo científico",
            consigna: ["Vas a escribir 3 frases explicando algo de ciencia que te guste."],
            pasos: ["Elige un tema (los animales, el agua...).", "Escribe 3 frases explicándolo.", "Subraya un nombre y un adjetivo de tus frases."],
            criterios: [
              { nombre: "Escribo 3 frases explicando un tema", niveles: ["Las 3 frases se entienden.", "Escribo 2 frases.", "Escribo 1 con ayuda.", "No lo consigo."] },
              { nombre: "Reconozco un nombre y un adjetivo", niveles: ["Reconozco los dos.", "Reconozco uno.", "Con ayuda.", "No lo consigo."] },
            ] } } },
    ] },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L6_SDA1.id] = UDI_L6_SDA1;
