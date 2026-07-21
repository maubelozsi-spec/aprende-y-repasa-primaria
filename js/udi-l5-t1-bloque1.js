// ============================================================
// Configuración de la Unidad Didáctica de Lengua 5º · 1º Trimestre ·
// Bloque 1: agrupa las situaciones de aprendizaje 1-3 tal como el
// docente organiza el trimestre (3 mini-SDA por bloque, 1 examen
// combinado por bloque):
//   sa01 · Un futuro... ¿del pasado? (texto predictivo, 6 sesiones)
//   sa02 · Interpretando la realidad (enunciados e interjecciones, 4 sesiones)
//   sa03 · Reír y pensar (la tira cómica, 4 sesiones)
// Un fichero de datos como este es todo lo que hace falta para dar de
// alta un bloque nuevo en js/generador-udi-ui.js: no requiere tocar
// la interfaz.
// ============================================================

const UDI_L5_T1_BLOQUE1 = {
  id: "l5-t1-bloque1",
  titulo: "1º Trimestre · Bloque 1",
  curso: "5",
  bloque: "Lengua · sa01 Un futuro... ¿del pasado? + sa02 Interpretando la realidad + sa03 Reír y pensar",
  resumen: "Agrupa las 3 primeras situaciones de aprendizaje del trimestre (14 sesiones) con un examen combinado, tal como se evalúan en el aula.",
  perfilesAdaptacion: ["acs", "dislexia", "tdah"],

  fases: [
    {
      id: "plan",
      label: "Plan de la UDI",
      tipo: "plan",
      sesiones: [
        { n: 1, titulo: "sa01 · ¡Empezamos! ¿Qué es un texto predictivo?", descripcion: "Activación: vídeo/diálogo sobre predicciones del pasado y del futuro; se plantea el reto de la unidad." },
        { n: 2, titulo: "sa01 · Reconozco las partes del texto predictivo", descripcion: "Introducción, desarrollo y conclusión.", topicId: "texto-predictivo" },
        { n: 3, titulo: "sa01 · Los conectores del desarrollo y la conclusión", descripcion: "En primer lugar..., en definitiva...", topicId: "texto-predictivo" },
        { n: 4, titulo: "sa01 · Compruebo si una fuente es fiable", descripcion: "Quién lo dice, cuándo, si coincide con otras fuentes, si hay pruebas.", topicId: "texto-predictivo" },
        { n: 5, titulo: "sa01 · Nuestro reto: escribo y expongo mi predicción", descripcion: "Redacción guiada + práctica de pronunciación y énfasis." },
        { n: 6, titulo: "sa01 · Repaso", descripcion: "Ficha de repaso del texto predictivo.", topicId: "texto-predictivo" },
        { n: 7, titulo: "sa02 · Sinónimos y antónimos", descripcion: "Palabras que significan lo mismo y palabras que significan lo contrario.", topicId: "sinonimos-antonimos" },
        { n: 8, titulo: "sa02 · Tipos de enunciado según la intención", descripcion: "Enunciativo, interrogativo, exclamativo, imperativo, desiderativo, dubitativo.", topicId: "tipos-enunciado" },
        { n: 9, titulo: "sa02 · Las interjecciones", descripcion: "Palabras cortas que expresan una emoción: ¡ay!, ¡oh!, ¡uf!...", topicId: "tipos-enunciado" },
        { n: 10, titulo: "sa02 · Nuestro reto: ¡Qué cara pone!", descripcion: "Juego de intenciones del hablante y expresiones faciales." },
        { n: 11, titulo: "sa03 · Textos literarios y no literarios", descripcion: "Qué distingue un texto literario de uno práctico." },
        { n: 12, titulo: "sa03 · Las partes de la tira cómica", descripcion: "Presentación, desarrollo y final sorprendente.", topicId: "tira-comica" },
        { n: 13, titulo: "sa03 · Los recursos gráficos de la tira", descripcion: "Bocadillos, líneas de movimiento y onomatopeyas.", topicId: "tira-comica" },
        { n: 14, titulo: "sa03 · Nuestro reto: creo mi tira cómica", descripcion: "Redacción y dibujo de una tira cómica propia." },
      ],
    },
    {
      id: "fichas",
      label: "Fichas por bloque",
      tipo: "fichas",
      documentos: [
        { id: "ficha-sa01-s2", label: "sa01 · Sesión 2 · Partes del texto predictivo", sesion: 2, motor: "lengua-ficha", topicId: "texto-predictivo", count: 5 },
        { id: "ficha-sa01-s3", label: "sa01 · Sesión 3 · Conectores", sesion: 3, motor: "lengua-ficha", topicId: "texto-predictivo", count: 5 },
        { id: "ficha-sa01-s4", label: "sa01 · Sesión 4 · ¿Es una predicción fiable?", sesion: 4, motor: "lengua-ficha", topicId: "texto-predictivo", count: 5 },
        { id: "ficha-sa02-s7", label: "sa02 · Sesión 7 · Sinónimos y antónimos", sesion: 7, motor: "lengua-ficha", topicId: "sinonimos-antonimos", count: 5 },
        { id: "ficha-sa02-s8", label: "sa02 · Sesiones 8-9 · Enunciados e interjecciones", sesion: 8, motor: "lengua-ficha", topicId: "tipos-enunciado", count: 6 },
        { id: "ficha-sa03-s12", label: "sa03 · Sesiones 12-13 · La tira cómica", sesion: 12, motor: "lengua-ficha", topicId: "tira-comica", count: 6 },
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
          id: "repaso", label: "Ficha de repaso (las 3 sa combinadas)", motor: "lengua-examen", tipo: "repaso",
          topics: [
            { topicId: "texto-predictivo", count: 3 },
            { topicId: "sinonimos-antonimos", count: 2 },
            { topicId: "tipos-enunciado", count: 3 },
            { topicId: "tira-comica", count: 3 },
          ],
        },
        {
          id: "examen", label: "Examen del bloque (las 3 sa combinadas)", motor: "lengua-examen", tipo: "examen",
          topics: [
            { topicId: "texto-predictivo", count: 4 },
            { topicId: "sinonimos-antonimos", count: 3 },
            { topicId: "tipos-enunciado", count: 4 },
            { topicId: "tira-comica", count: 4 },
          ],
        },
        {
          id: "explicacion-sa01", label: "sa01 · Explicación y solucionario", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
          args: {
            id: "texto-predictivo",
            titulo: "Cómo escribir un texto predictivo, paso a paso",
            subtitulo: "Documento de apoyo de sa01 «Un futuro... ¿del pasado?» — para trabajar en clase o repasar en casa.",
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
          id: "explicacion-sa02", label: "sa02 · Explicación y solucionario", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
          args: {
            id: "tipos-enunciado",
            titulo: "Tipos de enunciado e interjecciones",
            subtitulo: "Documento de apoyo de sa02 «Interpretando la realidad» — para trabajar en clase o repasar en casa.",
            teoria: [
              {
                heading: "El enunciado",
                paragraphs: [
                  "Un enunciado es todo lo que decimos entre dos pausas, con sentido completo. Puede tener un verbo conjugado (oracional, como «El tren llega tarde») o no tenerlo (no oracional, como «¡Socorro!»).",
                ],
              },
              {
                heading: "Tipos de enunciado según la intención",
                paragraphs: [
                  "Enunciativo: informa de un hecho. Ejemplo: «El museo abre a las diez.»",
                  "Interrogativo: pregunta algo. Ejemplo: «¿Vienes a la fiesta?»",
                  "Exclamativo: expresa una emoción intensa. Ejemplo: «¡Qué susto me has dado!»",
                  "Imperativo: da una orden o petición. Ejemplo: «Cierra la puerta, por favor.»",
                  "Desiderativo: expresa un deseo. Ejemplo: «Ojalá llueva mañana.»",
                  "Dubitativo: expresa duda. Ejemplo: «Quizás vengan mis primos.»",
                ],
              },
              {
                heading: "Las interjecciones",
                paragraphs: [
                  "Una interjección es una palabra corta, entre signos de exclamación, que expresa una emoción o llama la atención: ¡ay! (dolor), ¡oh! (sorpresa), ¡uf! (cansancio o alivio), ¡bravo! (alegría).",
                ],
              },
            ],
            ejemplo: {
              heading: "Ejemplo resuelto",
              partes: [
                { parte: "Enunciado", texto: "«¡Qué bonito atardecer!»" },
                { parte: "Tipo", texto: "Exclamativo, porque expresa una emoción intensa (admiración) y lleva signos de exclamación." },
                { parte: "Interjección relacionada", texto: "«¡Oh!» también expresaría sorpresa o admiración ante el mismo atardecer." },
              ],
            },
            comoCorregir: [
              { tipo: "Tipos de enunciado", explicacion: "Se identifica primero si hay signos de interrogación (interrogativo) o exclamación (exclamativo o imperativo según el verbo). Si no hay signos especiales, se mira si informa (enunciativo), pide algo (imperativo), desea algo con «ojalá» (desiderativo) o duda con «quizás»/«a lo mejor» (dubitativo).", ejemplo: "«Ojalá apruebe el examen» → desiderativo, por la palabra «ojalá»." },
              { tipo: "Oracional / no oracional", explicacion: "Se comprueba si la frase tiene un verbo conjugado. Si no lo tiene (como los saludos o las interjecciones), es no oracional.", ejemplo: "«Buenos días» → no oracional, no hay verbo." },
              { tipo: "Interjecciones", explicacion: "Se relaciona la interjección con la emoción típica que expresa en el uso habitual del idioma.", ejemplo: "«¡Cuidado!» → advertencia." },
            ],
            variantesACS: {
              titulo: "Tipos de enunciado más sencillos",
              subtitulo: "Versión adaptada (ACS, nivel de 3º) — solo los 3 tipos con marca clara.",
              teoria: [
                {
                  heading: "Tres tipos fáciles de reconocer",
                  paragraphs: [
                    "Enunciativo: cuenta algo. No lleva signos especiales. Ejemplo: «El perro corre.»",
                    "Interrogativo: pregunta algo. Lleva los signos ¿?. Ejemplo: «¿Vienes?»",
                    "Exclamativo: expresa una emoción. Lleva los signos ¡!. Ejemplo: «¡Qué susto!»",
                  ],
                },
              ],
              ejemplo: {
                heading: "Ejemplo",
                partes: [
                  { parte: "Enunciado", texto: "«¿Te gusta el chocolate?»" },
                  { parte: "Tipo", texto: "Interrogativo, porque lleva los signos ¿?." },
                ],
              },
              comoCorregir: [
                { tipo: "Tipos de enunciado", explicacion: "Si lleva ¿? es interrogativo. Si lleva ¡! es exclamativo. Si no lleva ninguno de los dos, es enunciativo.", ejemplo: "«Hoy no hace frío» → enunciativo." },
              ],
            },
          },
        },
        {
          id: "explicacion-sa03", label: "sa03 · Explicación y solucionario", motor: "udi-doc-builder", builder: "generarDocumentoExplicacion",
          args: {
            id: "tira-comica",
            titulo: "Cómo se construye una tira cómica",
            subtitulo: "Documento de apoyo de sa03 «Reír y pensar» — para trabajar en clase o repasar en casa.",
            teoria: [
              {
                heading: "Literario o no literario",
                paragraphs: [
                  "Un texto literario busca crear belleza o provocar una emoción (un cuento, un poema, una tira cómica). Un texto no literario busca informar o explicar algo de forma práctica (una receta, unas instrucciones, una noticia).",
                ],
              },
              {
                heading: "Las tres partes de una tira cómica",
                paragraphs: [
                  "Presentación: se presentan los personajes y el lugar donde ocurre la historia.",
                  "Desarrollo: aparece la situación conflictiva o el problema.",
                  "Final sorprendente: se resuelve la situación de una forma que hace reír o pensar.",
                ],
              },
              {
                heading: "Los recursos de la tira cómica",
                paragraphs: [
                  "Bocadillos o globos: recuadros con forma de nube donde se escribe lo que dice o piensa un personaje.",
                  "Líneas de movimiento: trazos que muestran que un personaje u objeto se mueve rápido.",
                  "Onomatopeyas: palabras que imitan un sonido, como ¡bang!, ¡crash! o ¡zzz!",
                ],
              },
            ],
            ejemplo: {
              heading: "Ejemplo resuelto",
              titulo: "Una tira cómica de 3 viñetas",
              partes: [
                { parte: "Viñeta 1 · Presentación", texto: "Un niño llega al parque con su perro y ve que ha empezado a llover." },
                { parte: "Viñeta 2 · Desarrollo", texto: "El perro sale corriendo (líneas de movimiento) y el niño grita «¡Espera!» en un bocadillo." },
                { parte: "Viñeta 3 · Final sorprendente", texto: "El perro vuelve con un paraguas en la boca. Onomatopeya: ¡Splash!" },
              ],
            },
            comoCorregir: [
              { tipo: "¿Literario o no literario?", explicacion: "Se comprueba si el texto busca contar una historia o provocar una emoción (literario) o si busca informar/explicar algo práctico (no literario).", ejemplo: "«Una receta de cocina» → no literario." },
              { tipo: "Partes de la tira", explicacion: "Se identifica si el texto presenta a los personajes y el lugar (presentación), plantea un problema (desarrollo) o lo resuelve de forma sorprendente (final sorprendente).", ejemplo: "«Aparece la situación conflictiva» → desarrollo." },
              { tipo: "Recursos gráficos", explicacion: "Un bocadillo contiene texto (lo que se dice o piensa). Una línea de movimiento muestra velocidad. Una onomatopeya imita un sonido con palabras.", ejemplo: "«¡Crash!» → onomatopeya." },
            ],
            variantesACS: {
              titulo: "¿Literario o no literario?",
              subtitulo: "Versión adaptada (ACS, nivel de 3º) — solo la distinción entre literario y no literario.",
              teoria: [
                {
                  heading: "Dos tipos de texto",
                  paragraphs: [
                    "Un texto literario cuenta una historia o hace reír o sentir algo (un cuento, una tira cómica).",
                    "Un texto no literario explica algo práctico (una receta, una lista).",
                  ],
                },
              ],
              ejemplo: {
                heading: "Ejemplo",
                partes: [
                  { parte: "Literario", texto: "«Un cuento de aventuras.»" },
                  { parte: "No literario", texto: "«Una lista de la compra.»" },
                ],
              },
              comoCorregir: [
                { tipo: "¿Literario o no literario?", explicacion: "Si el texto cuenta una historia o busca hacer reír o sentir algo, es literario. Si explica algo práctico, no lo es.", ejemplo: "«Una tira cómica» → literario." },
              ],
            },
          },
        },
        {
          id: "reto-sa01", label: "sa01 · Reto final + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
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
        {
          id: "reto-sa02", label: "sa02 · Reto final + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
          args: {
            id: "tipos-enunciado",
            titulo: "¡Qué cara pone!",
            consigna: [
              "Vas a jugar con un compañero o compañera a adivinar la intención de una frase a partir del tono de voz y los gestos.",
              "Recuerda: cada frase que digas corresponde a un tipo de enunciado (enunciativo, interrogativo, exclamativo, imperativo, desiderativo o dubitativo).",
            ],
            pasos: [
              "Elige una frase corta (por ejemplo: «¡Qué bien!», «¿Qué has hecho?», «Cierra la puerta»).",
              "Piensa qué intención quieres expresar: alegría, sorpresa, enfado, duda, una orden...",
              "Dila a tu compañero o compañera con el tono de voz y los gestos adecuados a esa intención.",
              "Tu compañero adivina qué intención tenías y a qué tipo de enunciado corresponde tu frase.",
              "Cambiad de turno y repetid con otras frases, usando también alguna interjección.",
            ],
            criterios: [
              {
                nombre: "Interpreto la intención del hablante a partir de gestos y tono de voz",
                niveles: [
                  "Adivino la intención de mi compañero en casi todas las frases.",
                  "Adivino la intención en la mayoría de las frases.",
                  "Me cuesta adivinar la intención, acierto pocas veces.",
                  "No consigo adivinar la intención de las frases.",
                ],
              },
              {
                nombre: "Relaciono la intención comunicativa con el tipo de enunciado",
                niveles: [
                  "Identifico correctamente el tipo de enunciado de cada frase.",
                  "Identifico el tipo de enunciado en la mayoría de los casos.",
                  "Identifico el tipo de enunciado con ayuda.",
                  "No relaciono la intención con el tipo de enunciado.",
                ],
              },
              {
                nombre: "Utilizo interjecciones adecuadas para expresar emociones",
                niveles: [
                  "Uso interjecciones variadas y adecuadas a la emoción.",
                  "Uso alguna interjección adecuada.",
                  "Uso interjecciones, aunque no siempre adecuadas.",
                  "No uso interjecciones en el juego.",
                ],
              },
              {
                nombre: "Trabajo de forma individual aunque esté en un grupo",
                niveles: [
                  "Participo de forma individual y activa dentro del grupo.",
                  "Participo, aunque a veces sigo lo que hacen los demás.",
                  "Me cuesta participar de forma individual dentro del grupo.",
                  "No trabajo de forma individual cuando estoy en grupo.",
                ],
              },
            ],
            variantesACS: {
              titulo: "¡Qué cara pone!",
              consigna: [
                "Vas a jugar a adivinar si tu compañero está contento o enfadado, fijándote en su cara y su voz.",
              ],
              pasos: [
                "Elige una frase corta, como «¡Qué bien!» o «¡Vaya!».",
                "Dila poniendo cara de contento o de enfadado, tú eliges.",
                "Tu compañero adivina qué sentías: contento o enfadado.",
              ],
              criterios: [
                {
                  nombre: "Adivino si mi compañero está contento o enfadado",
                  niveles: [
                    "Adivino bien casi siempre.",
                    "Adivino bien la mayoría de las veces.",
                    "Adivino bien con ayuda.",
                    "No consigo adivinarlo.",
                  ],
                },
                {
                  nombre: "Expreso con la cara y la voz una emoción",
                  niveles: [
                    "Expreso la emoción con claridad.",
                    "Expreso la emoción, aunque no muy clara.",
                    "Expreso la emoción con ayuda.",
                    "No consigo expresar la emoción.",
                  ],
                },
              ],
            },
          },
        },
        {
          id: "reto-sa03", label: "sa03 · Reto final + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
          args: {
            id: "tira-comica",
            titulo: "Creo mi tira cómica",
            consigna: [
              "Vas a crear tu propia tira cómica de 3 o 4 viñetas, con personajes inventados por ti.",
              "El objetivo es que sea graciosa o que haga pensar, como las que has visto en clase.",
            ],
            pasos: [
              "Piensa en uno o dos personajes y el lugar donde ocurre la historia (presentación).",
              "Inventa un problema o situación divertida para tus personajes (desarrollo).",
              "Piensa un final sorprendente que haga reír o pensar.",
              "Dibuja las viñetas y añade bocadillos con lo que dicen o piensan los personajes.",
              "Añade alguna onomatopeya o línea de movimiento si tu historia lo necesita.",
            ],
            criterios: [
              {
                nombre: "Distingo textos literarios de no literarios",
                niveles: [
                  "Explico con claridad qué hace que mi tira sea un texto literario.",
                  "Sé que mi tira es literaria, aunque no lo explico bien.",
                  "Necesito ayuda para explicarlo.",
                  "No distingo lo literario de lo no literario.",
                ],
              },
              {
                nombre: "Reconozco y utilizo las partes de la tira cómica",
                niveles: [
                  "Mi tira tiene presentación, desarrollo y final sorprendente, bien diferenciados.",
                  "Mi tira tiene las tres partes, aunque no muy diferenciadas.",
                  "A mi tira le falta alguna parte.",
                  "Mi tira no sigue la estructura de presentación, desarrollo y final.",
                ],
              },
              {
                nombre: "Utilizo bocadillos, onomatopeyas o líneas de movimiento",
                niveles: [
                  "Uso varios recursos distintos y bien colocados.",
                  "Uso algún recurso gráfico.",
                  "Uso algún recurso, aunque mal colocado.",
                  "No uso ningún recurso gráfico en mi tira.",
                ],
              },
              {
                nombre: "He creado una tira graciosa o que hace pensar",
                niveles: [
                  "Mi tira consigue hacer reír o pensar claramente.",
                  "Mi tira lo consigue en parte.",
                  "Lo he intentado, aunque no termina de conseguirlo.",
                  "Mi tira no hace reír ni pensar.",
                ],
              },
            ],
            variantesACS: {
              titulo: "Creo mi tira cómica",
              consigna: [
                "Vas a dibujar una tira cómica sencilla de 2 viñetas, con un personaje.",
              ],
              pasos: [
                "Dibuja tu personaje en la viñeta 1.",
                "Dibuja qué le pasa en la viñeta 2 y añade un bocadillo con lo que dice.",
              ],
              criterios: [
                {
                  nombre: "Dibujo un personaje y una situación en dos viñetas",
                  niveles: [
                    "Completo las dos viñetas con claridad.",
                    "Completo las dos viñetas, aunque con poco detalle.",
                    "Completo una viñeta con ayuda.",
                    "No consigo completar las viñetas.",
                  ],
                },
                {
                  nombre: "Uso un bocadillo con lo que dice mi personaje",
                  niveles: [
                    "Uso el bocadillo correctamente.",
                    "Uso el bocadillo, aunque con ayuda.",
                    "Intento usar el bocadillo, sin conseguirlo del todo.",
                    "No uso ningún bocadillo.",
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
  "l5-t1-bloque1": UDI_L5_T1_BLOQUE1,
};
