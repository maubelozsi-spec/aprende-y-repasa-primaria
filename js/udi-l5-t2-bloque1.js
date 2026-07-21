// ============================================================
// UDI Lengua 5º · 2º Trimestre · Bloque 1 (mini-SDA sa01+sa02+sa03):
//   sa01 · El texto argumentativo (dialogo-debate-argumentativo)
//   sa02 · El nombre / sustantivo (sustantivo-pronombre)
//   sa03 · Los elementos del texto teatral (texto-teatral)
// ============================================================

const UDI_L5_T2_BLOQUE1 = {
  id: "l5-t2-bloque1",
  area: "Lengua 5º · T2",
  titulo: "2º Trimestre · Bloque 1",
  curso: "5",
  bloque: "Lengua · El texto argumentativo + El nombre + El texto teatral",
  resumen: "Agrupa las 3 primeras mini-SDA del 2º trimestre con un examen combinado y un reto integrador.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],

  fases: [
    {
      id: "plan", label: "Plan de la UDI", tipo: "plan",
      sesiones: [
        { n: 1, titulo: "sa01 · El texto argumentativo", descripcion: "Defender una opinión con razones.", topicId: "dialogo-debate-argumentativo" },
        { n: 2, titulo: "sa01 · El debate y el diálogo", descripcion: "Turnos, escucha y argumentos.", topicId: "dialogo-debate-argumentativo" },
        { n: 3, titulo: "sa02 · El sustantivo o nombre", descripcion: "Clases de sustantivos.", topicId: "sustantivo-pronombre" },
        { n: 4, titulo: "sa02 · Género y número del sustantivo", descripcion: "Cómo varía el nombre.", topicId: "sustantivo-pronombre" },
        { n: 5, titulo: "sa03 · Los elementos del texto teatral", descripcion: "Diálogo, acotaciones y personajes.", topicId: "texto-teatral" },
        { n: 6, titulo: "sa03 · Cómo se lee y representa el teatro", descripcion: "Acotaciones y entonación.", topicId: "texto-teatral" },
        { n: 7, titulo: "Reto: un debate teatral", descripcion: "Producto final del bloque." },
        { n: 8, titulo: "Repaso y examen del bloque", descripcion: "Ficha de repaso y prueba de evaluación." },
      ],
    },
    {
      id: "fichas", label: "Fichas por bloque", tipo: "fichas",
      documentos: [
        { id: "ficha-sa01", label: "sa01 · El texto argumentativo", motor: "lengua-ficha", topicId: "dialogo-debate-argumentativo", count: 5 },
        { id: "ficha-sa02", label: "sa02 · El sustantivo", motor: "lengua-ficha", topicId: "sustantivo-pronombre", count: 6 },
        { id: "ficha-sa03", label: "sa03 · El texto teatral", motor: "lengua-ficha", topicId: "texto-teatral", count: 5 },
      ],
    },
    { id: "adaptaciones", label: "Adaptaciones", tipo: "adaptaciones" },
    {
      id: "evaluacion", label: "Evaluación", tipo: "evaluacion",
      documentos: [
        { id: "repaso", label: "Ficha de repaso (bloque combinado)", motor: "lengua-examen", tipo: "repaso",
          topics: [{ topicId: "dialogo-debate-argumentativo", count: 3 }, { topicId: "sustantivo-pronombre", count: 3 }, { topicId: "texto-teatral", count: 3 }] },
        { id: "examen", label: "Examen del bloque (combinado)", motor: "lengua-examen", tipo: "examen",
          topics: [{ topicId: "dialogo-debate-argumentativo", count: 4 }, { topicId: "sustantivo-pronombre", count: 4 }, { topicId: "texto-teatral", count: 4 }] },
        { id: "explicacion", label: "Explicación y solucionario del bloque", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
          args: {
            id: "l5-t2-bloque1",
            titulo: "Guía del bloque: argumentar, el nombre y el teatro",
            subtitulo: "Documento de apoyo del Bloque 1 (2º trimestre).",
            teoria: [
              { heading: "El texto argumentativo", paragraphs: ["Defiende una opinión aportando razones o argumentos. En un debate, cada participante expone sus argumentos respetando los turnos y escuchando a los demás."] },
              { heading: "El sustantivo (nombre)", paragraphs: ["El sustantivo nombra personas, animales, cosas, lugares o ideas. Puede ser común o propio, individual o colectivo, concreto o abstracto, y varía en género (masculino/femenino) y número (singular/plural)."] },
              { heading: "El texto teatral", paragraphs: ["El teatro se escribe para ser representado. Usa el diálogo de los personajes y las acotaciones (indicaciones entre paréntesis sobre gestos, tono o escenario)."] },
            ],
            comoCorregir: [
              { tipo: "El texto argumentativo", explicacion: "Se distingue la opinión de los argumentos que la apoyan.", ejemplo: "«porque ayuda al planeta» → argumento." },
              { tipo: "El sustantivo", explicacion: "Se clasifica el sustantivo y se indica su género y número.", ejemplo: "«manada» → sustantivo colectivo." },
              { tipo: "El texto teatral", explicacion: "Se distingue el diálogo de las acotaciones.", ejemplo: "«(entra corriendo)» → acotación." },
            ],
            variantesACS: {
              titulo: "Guía sencilla: opinar, el nombre y el teatro",
              subtitulo: "Versión adaptada (ACS, nivel de 3º).",
              teoria: [
                { heading: "Opinar con razones", paragraphs: ["Argumentar es decir tu opinión y dar una razón: «Me gusta leer porque aprendo cosas»."] },
                { heading: "El nombre", paragraphs: ["El sustantivo o nombre sirve para nombrar cosas, personas o lugares: perro, María, casa."] },
                { heading: "El teatro", paragraphs: ["En el teatro los personajes hablan (diálogo) y hay notas sobre lo que hacen (acotaciones)."] },
              ],
              comoCorregir: [
                { tipo: "Idea principal", explicacion: "Basta con reconocer la idea básica.", ejemplo: "«casa» → es un nombre." },
              ],
            },
          } },
        { id: "reto", label: "Reto final del bloque + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
          args: {
            id: "l5-t2-bloque1",
            titulo: "Un debate teatral",
            consigna: [
              "Este reto reúne todo lo del bloque. En grupo, vais a preparar y representar un breve debate teatralizado sobre un tema (por ejemplo, «¿deberíamos tener más recreo?»).",
              "Usaréis lo aprendido: escribiréis el guion con diálogo y acotaciones (teatro), cada personaje defenderá su opinión con argumentos (texto argumentativo) y cuidaréis el vocabulario, fijándoos en los sustantivos que usáis.",
            ],
            pasos: [
              "Elegid el tema del debate y repartid los papeles (personajes a favor y en contra).",
              "Escribid el guion en forma de diálogo, con acotaciones entre paréntesis.",
              "Aseguraos de que cada personaje da al menos dos argumentos para defender su opinión.",
              "Ensayad la representación cuidando la entonación y los gestos.",
              "Representadlo ante la clase.",
            ],
            criterios: [
              { nombre: "Escribimos el guion con diálogo y acotaciones", niveles: ["El guion usa bien el diálogo y las acotaciones.", "Usa el diálogo, con pocas acotaciones.", "El formato teatral es confuso.", "No tiene formato teatral."] },
              { nombre: "Cada personaje defiende su opinión con argumentos", niveles: ["Cada personaje da varios argumentos claros.", "Dan algún argumento.", "Los argumentos son flojos o escasos.", "No hay argumentos, solo opiniones sueltas."] },
              { nombre: "Usamos un vocabulario rico y correcto (sustantivos)", niveles: ["Vocabulario variado y bien empleado.", "Vocabulario correcto pero sencillo.", "Vocabulario pobre o con errores.", "Vocabulario muy pobre."] },
              { nombre: "Representamos con entonación y gestos", niveles: ["Representamos con claridad, entonación y gestos.", "Representamos con claridad, con pocos gestos.", "Representamos con dificultad.", "No conseguimos representarlo."] },
            ],
            variantesACS: {
              titulo: "Un debate teatral",
              consigna: ["Vas a decir tu opinión sobre un tema sencillo delante de la clase, poniendo voz de personaje."],
              pasos: ["Piensa si estás a favor o en contra del tema.", "Di tu opinión y una razón: «Yo pienso que... porque...».", "Dilo en voz alta poniendo cara y voz de personaje."],
              criterios: [
                { nombre: "Digo mi opinión y una razón", niveles: ["Digo opinión y razón con claridad.", "Digo la opinión, con ayuda para la razón.", "Digo solo la opinión.", "No consigo decir mi opinión."] },
                { nombre: "Pongo voz y gestos de personaje", niveles: ["Uso voz y gestos.", "Uso voz o gestos.", "Lo intento con ayuda.", "No lo consigo."] },
              ],
            },
          } },
      ],
    },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};

window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L5_T2_BLOQUE1.id] = UDI_L5_T2_BLOQUE1;
