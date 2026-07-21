// ============================================================
// Configuración de la Unidad Didáctica "Un futuro... ¿del pasado?"
// (Lengua, 5º, Bloque 1 · Comunicación, 6 sesiones). Un fichero de
// datos como este es todo lo que hace falta para dar de alta una UDI
// nueva en js/generador-udi-ui.js: no requiere tocar la interfaz.
// ============================================================

const UDI_TEXTO_PREDICTIVO = {
  id: "texto-predictivo-5",
  titulo: "Un futuro... ¿del pasado?",
  curso: "5",
  bloque: "Bloque 1 · Comunicación",
  resumen: "SDA de 6 sesiones sobre el texto predictivo: su estructura, sus conectores y cómo comprobar si una fuente de información es fiable.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],

  fases: [
    {
      id: "plan",
      label: "Plan de la UDI",
      tipo: "plan",
      sesiones: [
        { n: 1, titulo: "¡Empezamos! ¿Qué es un texto predictivo?", descripcion: "Activación: vídeo/diálogo sobre predicciones del pasado y del futuro; se plantea el reto de la unidad." },
        { n: 2, titulo: "Reconozco las partes del texto predictivo", descripcion: "Introducción, desarrollo y conclusión.", topicId: "texto-predictivo" },
        { n: 3, titulo: "Los conectores del desarrollo y la conclusión", descripcion: "En primer lugar..., en definitiva...", topicId: "texto-predictivo" },
        { n: 4, titulo: "Compruebo si una fuente es fiable", descripcion: "Quién lo dice, cuándo, si coincide con otras fuentes, si hay pruebas.", topicId: "texto-predictivo" },
        { n: 5, titulo: "Nuestro reto: escribo y expongo mi predicción", descripcion: "Redacción guiada + práctica de pronunciación y énfasis." },
        { n: 6, titulo: "Repaso y evaluación", descripcion: "Ficha de repaso y prueba de evaluación.", topicId: "texto-predictivo" },
      ],
    },
    {
      id: "fichas",
      label: "Fichas por bloque",
      tipo: "fichas",
      documentos: [
        { id: "ficha-s2", label: "Sesión 2 · Partes del texto predictivo", sesion: 2, motor: "lengua-ficha", topicId: "texto-predictivo", count: 5 },
        { id: "ficha-s3", label: "Sesión 3 · Conectores", sesion: 3, motor: "lengua-ficha", topicId: "texto-predictivo", count: 5 },
        { id: "ficha-s4", label: "Sesión 4 · ¿Es una predicción fiable?", sesion: 4, motor: "lengua-ficha", topicId: "texto-predictivo", count: 5 },
      ],
    },
    {
      id: "adaptaciones",
      label: "Adaptaciones",
      tipo: "adaptaciones",
    },
    {
      id: "evaluacion",
      label: "Evaluación",
      tipo: "evaluacion",
      documentos: [
        {
          id: "repaso", label: "Ficha de repaso", motor: "lengua-examen", tipo: "repaso",
          topics: [{ topicId: "texto-predictivo", count: 8 }],
        },
        {
          id: "examen", label: "Examen", motor: "lengua-examen", tipo: "examen",
          topics: [{ topicId: "texto-predictivo", count: 10 }],
        },
        {
          id: "explicacion", label: "Explicación y solucionario", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
          args: {
            id: "texto-predictivo",
            titulo: "Cómo escribir un texto predictivo, paso a paso",
            subtitulo: "Documento de apoyo del Bloque 1 · SDA «Un futuro... ¿del pasado?» — para trabajar en clase o repasar en casa.",
            teoria: [
              {
                heading: "¿Qué es un texto predictivo?",
                paragraphs: [
                  "Un texto predictivo anuncia algo que va a ocurrir en el futuro. No es un simple deseo ni una fantasía inventada al azar: la predicción se apoya en razones, datos o pistas del presente.",
                  "Por ejemplo, decir «creo que en el futuro habrá menos coches de gasolina» es una predicción, porque se apoya en algo real: cada vez se fabrican más coches eléctricos.",
                ],
              },
              {
                heading: "Las tres partes de un texto predictivo",
                paragraphs: [
                  "Introducción: se plantea la predicción, es decir, qué se cree que va a pasar.",
                  "Desarrollo: se explican las razones que apoyan la predicción, ordenadas una detrás de otra con conectores (en primer lugar, para empezar, en segundo lugar, para continuar, en tercer lugar, por último, además, por otro lado).",
                  "Conclusión: se resume la predicción y la razón más importante, con conectores como en definitiva, en conclusión, en consecuencia, por ello, por todo esto o en resumen.",
                ],
              },
              {
                heading: "¿Es fiable esa predicción?",
                paragraphs: [
                  "Antes de creerse una predicción, conviene comprobar de dónde viene: quién lo dice (¿es una persona experta?), cuándo se dijo (¿es reciente?), si coincide con otras fuentes y si se apoya en datos o pruebas reales.",
                ],
              },
            ],
            ejemplo: {
              heading: "Ejemplo resuelto",
              titulo: "¿Cómo serán los coles del futuro?",
              partes: [
                { parte: "Introducción", texto: "Yo creo que dentro de treinta años los colegios serán muy distintos a los de ahora." },
                { parte: "Desarrollo", texto: "En primer lugar, las clases tendrán mucha más tecnología: pizarras interactivas, robots ayudantes y libros digitales. En segundo lugar, habrá más huertos y zonas verdes en los patios, porque cada vez se le da más importancia a cuidar el medioambiente. Por último, creo que se aprenderá más trabajando en equipo y menos memorizando." },
                { parte: "Conclusión", texto: "En definitiva, pienso que los coles del futuro serán más tecnológicos, más verdes y más cooperativos que los de hoy." },
              ],
            },
            comoCorregir: [
              { tipo: "¿Es una predicción?", explicacion: "Se considera correcta la respuesta si la frase habla de algo que todavía no ha pasado y se apoya en una razón, no si cuenta algo que ya ocurrió.", ejemplo: "«El año pasado se plantaron mil árboles» → no es predicción, porque ya ha pasado." },
              { tipo: "Partes del texto", explicacion: "Se comprueba si la frase plantea la predicción (introducción), da una razón con un conector ordinal (desarrollo) o resume con un conector conclusivo (conclusión).", ejemplo: "«En segundo lugar, las energías renovables sustituirán a los combustibles fósiles» → desarrollo, por el conector «en segundo lugar»." },
              { tipo: "Conectores", explicacion: "Los conectores que enumeran razones (en primer lugar, para empezar, en segundo lugar, para continuar, en tercer lugar, por último, además, por otro lado) van en el desarrollo. Los que cierran el texto (en definitiva, en conclusión, en consecuencia, por ello, por todo esto, en resumen) van en la conclusión.", ejemplo: "«Por último...» → desarrollo (cierra la lista de razones, no el texto)." },
            ],
            variantesACS: {
              titulo: "Cómo reconocer una predicción sobre el futuro",
              subtitulo: "Versión adaptada (ACS, nivel de 3º) — mismo tema que el resto de la clase, con menos partes y frases más cortas.",
              teoria: [
                {
                  heading: "¿Qué es una predicción?",
                  paragraphs: [
                    "Una predicción es una frase que habla de algo que va a pasar en el futuro. No habla de algo que ya ha pasado.",
                    "«Mañana lloverá» habla del futuro: es una predicción. «Ayer llovió» habla del pasado: no es una predicción.",
                  ],
                },
              ],
              ejemplo: {
                heading: "Ejemplo",
                partes: [
                  { parte: "Es una predicción", texto: "«Dentro de unos años habrá más coches eléctricos.»" },
                  { parte: "No es una predicción", texto: "«El año pasado compramos un coche nuevo.»" },
                ],
              },
              comoCorregir: [
                { tipo: "¿Es una predicción?", explicacion: "Si la frase habla de algo que todavía no ha pasado, es una predicción. Si habla de algo que ya pasó, no lo es.", ejemplo: "«El curso que viene aprenderemos inglés» → predicción." },
              ],
            },
          },
        },
        {
          id: "reto", label: "Reto final + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
          args: {
            id: "texto-predictivo",
            titulo: "¿Cómo me imagino el año 3030?",
            consigna: [
              "Vas a escribir tu propio texto predictivo sobre cómo crees que será la vida en el año 3030.",
              "Recuerda seguir la estructura que has aprendido: introducción, desarrollo y conclusión, usando los conectores adecuados en cada parte.",
              "Después, expondrás tu predicción a tus compañeros y compañeras cuidando la pronunciación y el énfasis.",
            ],
            pasos: [
              "Elige un tema para tu predicción: la ciudad, el colegio, la tecnología, el medioambiente, el deporte...",
              "Escribe un borrador con las tres partes: introducción, desarrollo (con al menos dos razones) y conclusión.",
              "Revisa que uses conectores adecuados en el desarrollo y en la conclusión.",
              "Pasa tu texto a limpio.",
              "Prepárate para leerlo en voz alta, cuidando la pronunciación y haciendo énfasis en las partes importantes.",
            ],
            criterios: [
              {
                nombre: "Reconozco y ordeno las partes de un texto predictivo",
                niveles: [
                  "Identifico las tres partes y las ordeno correctamente.",
                  "Identifico las tres partes pero me equivoco al ordenarlas.",
                  "Identifico solo alguna de las partes.",
                  "No reconozco las partes del texto predictivo.",
                ],
              },
              {
                nombre: "Redacto un texto predictivo con introducción, desarrollo y conclusión",
                niveles: [
                  "Redacto las tres partes con coherencia, con borrador previo.",
                  "Redacto las tres partes, aunque no hago un borrador previo.",
                  "Redacto el texto, pero falta alguna parte.",
                  "No redacto un texto predictivo sobre el tema elegido.",
                ],
              },
              {
                nombre: "Uso conectores adecuados en el desarrollo y en la conclusión",
                niveles: [
                  "Uso varios conectores distintos y en el lugar correcto.",
                  "Uso conectores, aunque repito siempre el mismo.",
                  "Uso algún conector, pero no siempre en el lugar correcto.",
                  "No uso conectores en mi texto.",
                ],
              },
              {
                nombre: "Compruebo si una fuente de información es fiable",
                niveles: [
                  "Explico con mis palabras cómo comprobar si una fuente es fiable, con varios criterios.",
                  "Explico algún criterio para comprobar si una fuente es fiable.",
                  "Nombro algún criterio, pero sin explicarlo.",
                  "No sé explicar cómo comprobar si una fuente es fiable.",
                ],
              },
              {
                nombre: "Expongo mi predicción cuidando la pronunciación y el énfasis",
                niveles: [
                  "Expongo mi texto con una pronunciación clara y énfasis en las partes importantes.",
                  "Expongo mi texto con una pronunciación clara, pero sin hacer énfasis.",
                  "Expongo mi texto, aunque con dificultades de pronunciación.",
                  "No consigo exponer mi texto en voz alta.",
                ],
              },
            ],
            variantesACS: {
              titulo: "¿Cómo me imagino el año 3030?",
              consigna: [
                "Vas a escribir una o dos frases sobre cómo crees que será el futuro.",
                "No hace falta que sea muy larga: lo importante es que hable del futuro, no del pasado.",
              ],
              pasos: [
                "Piensa en algo que crees que cambiará en el futuro (los coches, el colegio, la ropa...).",
                "Escribe una frase que empiece por «Yo creo que en el futuro...».",
                "Léela en voz alta a la clase.",
              ],
              criterios: [
                {
                  nombre: "Escribo una frase sobre el futuro (predicción)",
                  niveles: [
                    "Escribo una frase clara sobre el futuro.",
                    "Escribo una frase, aunque no queda muy clara.",
                    "Necesito ayuda para escribir la frase.",
                    "No consigo escribir una frase sobre el futuro.",
                  ],
                },
                {
                  nombre: "Leo mi frase en voz alta",
                  niveles: [
                    "Leo mi frase con voz clara.",
                    "Leo mi frase, aunque bajo.",
                    "Leo mi frase con ayuda.",
                    "No consigo leer mi frase en voz alta.",
                  ],
                },
              ],
            },
          },
        },
      ],
    },
    { id: "compilacion", label: "Compilación", tipo: "compilacion" },
  ],
};

const UDI_REGISTRY = {
  "texto-predictivo-5": UDI_TEXTO_PREDICTIVO,
};
