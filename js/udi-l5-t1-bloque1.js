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
          id: "reto", label: "Reto final del bloque + rúbrica", motor: "udi-doc-builder", builder: "generarRetoYRubrica",
          args: {
            id: "l5-t1-bloque1",
            titulo: "Una tira cómica del futuro",
            consigna: [
              "Este es el reto que reúne todo lo que has aprendido en el bloque. Vas a crear una tira cómica que imagine cómo será la vida en el futuro.",
              "En ella juntarás las tres cosas que has trabajado: harás una predicción sobre el futuro (como un texto predictivo), tus personajes hablarán usando distintos tipos de enunciados e interjecciones, y todo se presentará como una tira cómica con su estructura y sus recursos.",
              "Al final, expondrás tu tira a la clase leyendo los diálogos con la entonación adecuada.",
            ],
            pasos: [
              "Piensa una predicción sobre el futuro: ¿cómo será una ciudad, el colegio o el planeta dentro de muchos años? Comprueba que la idea en la que te apoyas sea razonable y fiable.",
              "Escribe tu predicción como un texto predictivo breve: introducción (qué crees que pasará), desarrollo (dos razones, con conectores como «en primer lugar» o «además») y conclusión (con un conector como «en definitiva»).",
              "Convierte esa predicción en una pequeña historia con personajes: presentación, desarrollo con una situación divertida o sorprendente, y un final que haga reír o pensar.",
              "Escribe los diálogos de los bocadillos usando distintos tipos de enunciado (una pregunta, una exclamación, una orden...) y al menos una interjección (¡ay!, ¡oh!, ¡uf!...).",
              "Dibuja las viñetas y añade los recursos de la tira cómica: bocadillos, líneas de movimiento y onomatopeyas.",
              "Prepárate para exponer tu tira a la clase, leyendo los diálogos con la entonación y el énfasis adecuados.",
            ],
            criterios: [
              {
                nombre: "Mi historia parte de una predicción del futuro bien construida (texto predictivo)",
                niveles: [
                  "Mi predicción tiene introducción, desarrollo con razones y conectores, y conclusión.",
                  "Mi predicción tiene las tres partes, aunque le faltan conectores o alguna razón.",
                  "Mi predicción es una idea sobre el futuro, pero sin estructura clara.",
                  "No parto de una predicción sobre el futuro.",
                ],
              },
              {
                nombre: "Compruebo que la idea de mi predicción es fiable",
                niveles: [
                  "Explico en qué me baso y por qué es una idea razonable.",
                  "Digo en qué me baso, aunque sin explicarlo del todo.",
                  "Mi predicción se apoya en algo, pero no sé justificarlo.",
                  "Mi predicción es del todo inventada, sin ninguna base.",
                ],
              },
              {
                nombre: "Uso distintos tipos de enunciado e interjecciones en los diálogos",
                niveles: [
                  "Uso varios tipos de enunciado distintos y al menos una interjección.",
                  "Uso dos tipos de enunciado y alguna interjección.",
                  "Uso siempre el mismo tipo de enunciado o me olvido de las interjecciones.",
                  "Los diálogos no muestran distintos tipos de enunciado ni interjecciones.",
                ],
              },
              {
                nombre: "Mi tira cómica tiene presentación, desarrollo y final sorprendente",
                niveles: [
                  "Las tres partes están bien diferenciadas y se entienden.",
                  "Están las tres partes, aunque no muy diferenciadas.",
                  "A mi tira le falta alguna de las tres partes.",
                  "Mi tira no sigue la estructura de presentación, desarrollo y final.",
                ],
              },
              {
                nombre: "Utilizo los recursos de la tira cómica (bocadillos, onomatopeyas, líneas de movimiento)",
                niveles: [
                  "Uso varios recursos distintos y bien colocados.",
                  "Uso algún recurso gráfico correctamente.",
                  "Uso algún recurso, aunque mal colocado.",
                  "No uso recursos gráficos en mi tira.",
                ],
              },
              {
                nombre: "Expongo mi tira leyendo los diálogos con la entonación adecuada",
                niveles: [
                  "Leo los diálogos con claridad y con la entonación de cada tipo de enunciado.",
                  "Leo los diálogos con claridad, aunque sin mucha entonación.",
                  "Leo los diálogos con dificultad.",
                  "No consigo exponer mi tira en voz alta.",
                ],
              },
            ],
            variantesACS: {
              titulo: "Una tira cómica del futuro",
              consigna: [
                "Vas a crear una tira cómica sencilla, de 2 o 3 viñetas, que imagine algo del futuro.",
                "Juntarás lo que has aprendido: una idea sobre el futuro, un personaje que habla en un bocadillo y el dibujo de la tira.",
              ],
              pasos: [
                "Piensa una idea sobre el futuro: «En el futuro los coches volarán», por ejemplo.",
                "Dibuja tu personaje en la primera viñeta.",
                "Dibuja qué pasa en la siguiente viñeta y escribe en un bocadillo lo que dice tu personaje (puede ser una pregunta, una exclamación o una interjección como «¡oh!»).",
                "Enseña tu tira a la clase y lee el bocadillo en voz alta.",
              ],
              criterios: [
                {
                  nombre: "Mi tira parte de una idea sobre el futuro",
                  niveles: [
                    "Mi idea sobre el futuro se entiende bien.",
                    "Tengo una idea sobre el futuro, aunque poco clara.",
                    "Necesito ayuda para pensar la idea.",
                    "No parto de una idea sobre el futuro.",
                  ],
                },
                {
                  nombre: "Dibujo la tira y escribo un bocadillo",
                  niveles: [
                    "Completo las viñetas y el bocadillo con claridad.",
                    "Completo las viñetas y el bocadillo, aunque con poco detalle.",
                    "Lo completo con ayuda.",
                    "No consigo completar la tira.",
                  ],
                },
                {
                  nombre: "Leo mi bocadillo en voz alta",
                  niveles: [
                    "Leo el bocadillo con voz clara.",
                    "Leo el bocadillo, aunque bajo.",
                    "Leo el bocadillo con ayuda.",
                    "No consigo leerlo en voz alta.",
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

UDI_L5_T1_BLOQUE1.area = "Lengua 5º · T1";
window.UDI_REGISTRY = window.UDI_REGISTRY || {};
window.UDI_REGISTRY[UDI_L5_T1_BLOQUE1.id] = UDI_L5_T1_BLOQUE1;
