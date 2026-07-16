// ============================================================
// Generador de lectura comprensiva: banco de textos de distintos
// tipos (narrativo, descriptivo, expositivo, argumentativo,
// instructivo, noticia, científico, poético), cada uno con
// preguntas de comprensión lectora, opinión personal y reflexión.
// ============================================================

const TIPOS_TEXTO_LECTURA = [
  { id: "narrativo", label: "Narrativo (cuento)" },
  { id: "descriptivo", label: "Descriptivo" },
  { id: "expositivo", label: "Expositivo" },
  { id: "argumentativo", label: "Argumentativo" },
  { id: "instructivo", label: "Instructivo" },
  { id: "noticia", label: "Noticia" },
  { id: "cientifico", label: "Científico" },
  { id: "poetico", label: "Poético" },
];

const TEXTOS_LECTURA = {
  narrativo: [
    {
      titulo: "El faro de Punta Blanca",
      cuerpo:
        "Marcos vivía con su abuelo en el faro de Punta Blanca desde que era pequeño. Sus padres trabajaban en la ciudad y solo podían visitarlo los fines de semana, así que el abuelo se había convertido en su compañero de cada día. Cada noche, antes de dormir, subían juntos los ciento veinte escalones de piedra que llevaban hasta la linterna, para encender la luz que avisaba a los barcos del peligro de las rocas que rodeaban la costa.\n\nEl abuelo conocía cada rincón del faro como la palma de su mano. Sabía qué escalón crujía más fuerte, en qué ventana se colaba el viento con más fuerza y cómo predecir una tormenta con solo mirar el color del cielo al atardecer. Marcos escuchaba con atención todas sus explicaciones, y poco a poco había ido aprendiendo también los secretos de aquel edificio de piedra blanca que se alzaba sobre los acantilados.\n\nUna tarde de otoño, el cielo se oscureció de repente y el viento empezó a soplar con fuerza, señal de que se acercaba una tormenta. El abuelo bajó a preparar la cena mientras Marcos terminaba sus deberes junto a la ventana, observando cómo las olas golpeaban las rocas con cada vez más violencia.\n\nDe pronto, en medio de la tormenta, un pesquero se quedó sin motor cerca de la costa, arrastrado por las corrientes hacia las rocas más peligrosas. El abuelo, con las manos temblorosas por la edad y por los nervios, intentó subir los escalones a toda prisa, pero el dolor de sus rodillas se lo impedía. Marcos, al ver la angustia en su cara, no dudó ni un segundo: subió corriendo escalón tras escalón, sintiendo cómo el corazón le latía cada vez más deprisa, hasta llegar a la sala de la linterna sin apenas aliento.\n\nCon manos firmes, encendió el faro justo a tiempo. La potente luz atravesó la lluvia y la oscuridad, y los pescadores, al verla, pudieron virar el timón y esquivar las rocas hasta llegar a puerto sanos y salvos. Desde la orilla, algunos vecinos que habían salido a mirar la tormenta contaron después que nunca habían visto la luz del faro brillar con tanta fuerza.\n\nAquella noche, cuando por fin bajaron a descansar, el abuelo abrazó a Marcos con fuerza y, con la voz emocionada, le dijo que, a partir de entonces, el faro también sería un poco suyo. Marcos sonrió, todavía con el corazón acelerado, sabiendo que jamás olvidaría esa noche en la que, por primera vez, había sido él quien había cuidado del faro y de todos los que navegaban cerca de la costa.",
      preguntas: [
        { pregunta: "¿Dónde vivían Marcos y su abuelo?", respuesta: "En el faro de Punta Blanca." },
        { pregunta: "¿Qué problema tuvo el pesquero durante la tormenta?", respuesta: "Se quedó sin motor cerca de la costa." },
        { pregunta: "¿Qué hizo Marcos cuando su abuelo no podía subir a tiempo?", respuesta: "Corrió los escalones y encendió el faro él solo." },
      ],
      opinion: "¿Crees que Marcos actuó bien al no dudar en subir corriendo? ¿Por qué?",
      reflexion: "¿Alguna vez has tenido que ayudar a alguien de tu familia en un momento difícil? Cuenta qué pasó.",
    },
    {
      titulo: "La última entrega",
      cuerpo:
        "Rosa repartía el correo en bicicleta por las calles empinadas del pueblo desde hacía veinte años. Conocía a cada vecino por su nombre, sabía en qué casas vivían niños pequeños que esperaban postales de sus abuelos y en cuáles vivían ancianos que apenas recibían visitas. Con el tiempo había aprendido a distinguir, solo con mirar un sobre, qué cartas alegraban un día y cuáles lo entristecían.\n\nAquel diciembre había sido especialmente duro. La nieve llevaba una semana cubriendo los caminos del pueblo, y el reparto que normalmente le llevaba tres horas se había convertido en una tarea de toda la mañana. Rosa, sin embargo, no se quejaba: decía que el frío se aguantaba mejor sabiendo que al final de cada calle había alguien esperando noticias.\n\nAquel día, cuando ya el sol empezaba a esconderse detrás de las montañas, le quedaba una última carta por entregar. Era para doña Pilar, una anciana que vivía sola en una casa de piedra en lo alto de la colina, desde que su marido había fallecido hacía ya varios inviernos. Rosa sabía que doña Pilar llevaba semanas esperando noticias de su hija, que se había marchado a trabajar a otro país y escribía con menos frecuencia de la que a su madre le hubiese gustado.\n\nRosa dudó un instante frente al camino cubierto de hielo. La bicicleta patinaba con cada pedalada, y una caída en aquella cuesta empinada podía ser peligrosa. Pero pensó en lo sola que estaría doña Pilar aquella tarde de invierno, esperando una carta que quizás no llegaría hasta el día siguiente si ella no se atrevía a subir. Decidió bajarse de la bicicleta y empujarla a pie el resto del camino.\n\nTardó casi media hora en llegar, con las manos entumecidas por el frío y las botas empapadas de nieve. Cuando por fin llamó a la puerta, doña Pilar tardó un poco en abrir, apoyada en su bastón. Al ver el sobre con la letra de su hija, se le llenaron los ojos de lágrimas de alegría, y sin decir una palabra, abrazó a Rosa con todas sus fuerzas.\n\n—Pase, pase, no se quede ahí con este frío —dijo finalmente, secándose las lágrimas con el pañuelo que llevaba en el bolsillo del delantal.\n\nRosa entró en la pequeña cocina, donde ardía una chimenea de leña, y aceptó con gusto la taza de chocolate caliente que doña Pilar insistió en prepararle antes de dejarla marchar. Mientras se calentaba las manos alrededor de la taza, pensó que, aunque llevaba veinte años haciendo el mismo trabajo, momentos como aquel eran los que hacían que mereciera la pena, incluso en los días más fríos del invierno.",
      preguntas: [
        { pregunta: "¿A qué se dedicaba Rosa?", respuesta: "Repartía el correo en bicicleta." },
        { pregunta: "¿Por qué dudó Rosa antes de subir a la colina?", respuesta: "Porque la bicicleta patinaba en el hielo." },
        { pregunta: "¿Quién había escrito la carta que esperaba doña Pilar?", respuesta: "Su hija." },
      ],
      opinion: "¿Te parece que Rosa hizo bien en esforzarse tanto por entregar una sola carta? Explica tu respuesta.",
      reflexion: "¿Qué crees que sintió doña Pilar al recibir la carta? ¿Te ha pasado algo parecido alguna vez?",
    },
    {
      titulo: "El secreto del bosque",
      cuerpo:
        "Hugo y Nora llevaban toda la tarde explorando el bosque cercano a su pueblo, como hacían casi todos los sábados desde que eran pequeños. Conocían casi todos los caminos de memoria: el que llevaba al río, el que subía hasta la vieja cabaña de los guardabosques y el que rodeaba el estanque donde en primavera croaban las ranas sin descanso. Por eso se sorprendieron tanto cuando, aquella tarde, encontraron un sendero que nunca habían visto, escondido detrás de unos matorrales espesos.\n\n—Nunca habíamos pasado por aquí —dijo Nora, apartando una rama para poder ver mejor el camino, que se perdía entre los árboles más viejos del bosque.\n\nHugo miró el cielo, que empezaba a teñirse de naranja, señal de que ya se estaba haciendo tarde. Sabían que deberían volver pronto a casa, pero la curiosidad pudo más que la prudencia, y decidieron seguir el sendero durante unos minutos más, prometiéndose el uno al otro que si no encontraban nada interesante, regresarían enseguida.\n\nEl camino, estrecho y cubierto de hojas secas, los llevó hasta un pequeño claro que ninguno de los dos recordaba haber visto antes. Allí crecían flores de colores muy poco comunes en la zona: unas de color azul intenso, casi violeta, que ni siquiera aparecían en el libro de plantas que tenían en el colegio. En el centro del claro se alzaba un árbol enorme, mucho más grande que cualquier otro del bosque, con un hueco grande en el tronco a la altura de sus cabezas.\n\nNora se acercó despacio y, poniéndose de puntillas, miró dentro del hueco. Lo que vio la dejó sin palabras: un nido de pájaros carpinteros, cuidadosamente construido con ramitas y musgo, en el que dormían tres crías recién nacidas, todavía sin plumas y con los ojos cerrados. Hugo se acercó también, conteniendo la respiración para no asustarlas.\n\n—Tenemos que tener mucho cuidado —susurró Hugo—. Si las tocamos, sus padres podrían abandonarlas.\n\nNora asintió, y ambos decidieron en ese mismo momento no tocar nada ni contárselo a nadie del pueblo. Sabían que, si otros niños se enteraban, el ir y venir de gente por el claro podría asustar a los pájaros carpinteros adultos y poner en peligro a las crías. Aquel sería su secreto, uno que guardarían solo entre ellos dos.\n\nDurante las semanas siguientes, cada sábado por la tarde regresaban juntos al claro escondido para comprobar cómo iban creciendo las crías. Poco a poco fueron viendo cómo les salían las primeras plumas, cómo empezaban a asomar la cabeza fuera del nido y, finalmente, cómo aprendían a volar de rama en rama bajo la atenta mirada de sus padres. Para Hugo y Nora, aquel rincón del bosque se convirtió en el lugar más especial que conocían, un secreto que atesoraban como el mejor recuerdo de aquel verano.",
      preguntas: [
        { pregunta: "¿Qué encontraron Hugo y Nora detrás de los matorrales?", respuesta: "Un sendero que nunca habían visto." },
        { pregunta: "¿Qué había dentro del hueco del árbol?", respuesta: "Un nido de pájaros carpinteros con tres crías." },
        { pregunta: "¿Por qué decidieron no contárselo a nadie?", respuesta: "Para que las crías pudieran crecer tranquilas." },
      ],
      opinion: "¿Crees que hicieron bien en guardar el secreto en vez de contarlo? ¿Por qué?",
      reflexion: "¿Tienes o has tenido algún lugar especial que consideres tu escondite secreto? Descríbelo.",
    },
  ],
  descriptivo: [
    {
      titulo: "El pueblo de Robledo",
      cuerpo:
        "Robledo es un pequeño pueblo de montaña rodeado de robles centenarios que le dan su nombre. Se encuentra a más de mil metros de altitud, en un valle protegido del viento por dos sierras que se cubren de nieve durante buena parte del invierno. Sus calles son estrechas y empedradas, y suben y bajan siguiendo la forma irregular de la ladera, de modo que caminar de un extremo a otro del pueblo siempre supone subir o bajar alguna cuesta.\n\nLas casas, la mayoría de piedra gris con tejados de pizarra oscura, tienen balcones de madera envejecida por el sol y la lluvia, llenos de macetas con geranios rojos y blancos que sus dueños cuidan con esmero durante toda la primavera y el verano. Muchas de ellas conservan todavía el escudo de la familia que las construyó, tallado en piedra sobre la puerta principal, recuerdo de tiempos en los que el pueblo era mucho más próspero de lo que es hoy.\n\nEn la plaza mayor, la más grande de todo el pueblo, hay una fuente antigua de piedra tallada donde el agua fresca de la montaña corre todo el año, incluso en pleno verano, cuando los niños se acercan a mojarse las manos y la cara para combatir el calor. Alrededor de la plaza se agrupan los principales negocios del pueblo: una panadería que huele a pan recién hecho desde primera hora de la mañana, una pequeña tienda de ultramarinos donde se puede comprar casi de todo, y el ayuntamiento, un edificio de dos plantas con un reloj de torre que marca las horas para todo el pueblo desde hace más de un siglo.\n\nMás allá de la plaza, unas callejuelas estrechas conducen hasta la iglesia parroquial, construida en piedra hace varios siglos, cuya campana anuncia cada mediodía la hora de comer. Junto a la iglesia se extiende un pequeño cementerio rodeado de cipreses, y un poco más arriba, en la parte alta del pueblo, se puede visitar la antigua escuela, hoy convertida en un pequeño museo etnográfico donde se conservan herramientas de labranza y fotografías en blanco y negro de los vecinos de otras épocas.\n\nAl atardecer, cuando el sol se pone detrás de la sierra, todo el pueblo se tiñe de un color dorado muy especial, y el humo de las chimeneas comienza a subir despacio hacia el cielo, señal de que las familias se preparan para cenar juntas alrededor del fuego, tal y como llevan haciendo desde hace generaciones.",
      preguntas: [
        { pregunta: "¿Por qué se llama Robledo el pueblo?", respuesta: "Por los robles centenarios que lo rodean." },
        { pregunta: "¿De qué material son la mayoría de las casas?", respuesta: "De piedra gris con tejados de pizarra." },
        { pregunta: "¿Qué hay en el centro de la plaza mayor?", respuesta: "Una fuente antigua con agua de la montaña." },
      ],
      opinion: "¿Te gustaría vivir en un pueblo como Robledo? ¿Por qué sí o por qué no?",
      reflexion: "Piensa en el lugar donde vives. ¿En qué se parece o se diferencia de Robledo?",
    },
    {
      titulo: "La abuela Elena",
      cuerpo:
        "La abuela Elena tiene el pelo blanco recogido siempre en un moño bien apretado, del que nunca se escapa ni un solo mechón, y unas manos ásperas y llenas de pequeñas cicatrices de tanto trabajar la tierra del huerto durante más de cincuenta años. Sus ojos, de un color avellana muy claro, casi dorado bajo la luz del sol, se arrugan por completo cuando se ríe, algo que ocurre casi todo el tiempo, incluso cuando cuenta historias tristes de su juventud.\n\nSiempre lleva puesto un delantal de flores azules y blancas sobre la ropa de andar por casa, con los bolsillos llenos de pequeños tesoros: semillas guardadas en sobres de papel, un pañuelo de tela bordado con sus iniciales y algún caramelo de menta envuelto en papel dorado para ofrecer a sus nietos en cuanto los ve llegar. Camina despacio pero segura, apoyándose en un bastón de madera de castaño que ella misma talló hace muchos años, cuando todavía subía sin ayuda hasta la parte más alta del huerto.\n\nSu casa, pequeña pero acogedora, tiene las paredes cubiertas de fotografías antiguas en blanco y negro y de dibujos que sus nietos le han ido regalando a lo largo de los años, pegados con cariño en la nevera y en las puertas de los armarios. De su cocina sale siempre un olor a pan recién horneado los sábados por la mañana y a guisos de verduras cultivadas por ella misma el resto de la semana, cocinados en una olla de barro que perteneció a su propia madre.\n\nCuando llega la tarde, le gusta sentarse en una vieja mecedora junto a la ventana, con una manta sobre las rodillas y una labor de punto entre las manos, mientras espera a que sus nietos vuelvan del colegio. En su voz, un poco ronca por los años pero siempre cálida, se nota el cariño con el que cuenta las mismas historias una y otra vez: la del lobo que asustaba a los pastores en su niñez, la de cuando conoció al abuelo en la fiesta del pueblo, o la de aquel invierno en que nevó tanto que no pudieron salir de casa durante una semana entera.\n\nA pesar de su edad, la abuela Elena sigue siendo la primera en levantarse cada mañana, la que enciende el fuego antes de que nadie se despierte y la que, con una paciencia infinita, enseña a sus nietos a reconocer las plantas del huerto una por una, convencida de que esos pequeños conocimientos algún día les serán tan útiles a ellos como lo fueron para ella.",
      preguntas: [
        { pregunta: "¿Cómo lleva el pelo la abuela Elena?", respuesta: "Recogido en un moño." },
        { pregunta: "¿Qué lleva siempre en los bolsillos del delantal?", respuesta: "Semillas, un pañuelo y algún caramelo de menta." },
        { pregunta: "¿Con qué camina apoyándose la abuela Elena?", respuesta: "Con un bastón de madera que ella misma talló." },
      ],
      opinion: "¿Qué detalle de la descripción de la abuela Elena te ha gustado más? ¿Por qué?",
      reflexion: "Piensa en alguna persona mayor de tu familia. ¿Qué cosas la hacen especial?",
    },
    {
      titulo: "El mercado del puerto",
      cuerpo:
        "Cada sábado por la mañana, mucho antes de que el resto del pueblo se despierte, el mercado del puerto se llena de puestos de colores donde los pescadores venden lo que han capturado esa misma noche, tras horas de faena en alta mar. El olor a mar fresco se mezcla con el de las especias que venden en el puesto de al lado, y con el aroma del café recién hecho que sirven en el pequeño bar de la esquina, siempre lleno de pescadores terminando su jornada.\n\nLas cajas de madera y los cubos de plástico azul están llenos de sardinas plateadas que brillan bajo la luz del sol, pulpos de color violeta que todavía se retuercen suavemente, y cangrejos que se mueven con las pinzas levantadas, como si quisieran defenderse de las manos que los examinan. Un poco más allá, sobre grandes bloques de hielo picado, descansan merluzas, lubinas y doradas de distintos tamaños, ordenadas cuidadosamente por los pescadores para que los clientes puedan elegir con facilidad.\n\nLos vendedores gritan los precios en voz alta, compitiendo entre ellos para atraer a los compradores, mientras las gaviotas revolotean cerca, posadas en los tejados cercanos, esperando algún descuido para robar un pescado de los puestos menos vigilados. De vez en cuando, alguna gaviota más atrevida se lanza en picado y se lleva un pequeño pez ante las risas y protestas de los vendedores, que ya están acostumbrados a este pequeño espectáculo de cada sábado.\n\nEntre los puestos, los vecinos charlan y se saludan como si se conocieran de toda la vida, comentando las noticias del pueblo mientras esperan su turno para ser atendidos. Las cocineras de los restaurantes cercanos recorren el mercado con sus propias cestas, buscando siempre el pescado más fresco para preparar los platos del día, y algunas incluso regatean con humor los precios con los pescadores más veteranos.\n\nLos niños, por su parte, se acercan curiosos a mirar las cestas llenas de conchas, caracolas y pequeñas estrellas de mar que algunos pescadores venden como recuerdo, fascinados por sus formas y colores. Mientras tanto, el sol de la mañana va subiendo poco a poco e ilumina el agua tranquila del puerto, donde se mecen suavemente las barcas de pesca ya vacías, descansando tras una larga noche de trabajo, a la espera de que llegue de nuevo el atardecer para volver a hacerse a la mar.",
      preguntas: [
        { pregunta: "¿Cuándo se celebra el mercado del puerto?", respuesta: "Cada sábado por la mañana." },
        { pregunta: "¿Qué animales se mueven todavía en las cajas de madera?", respuesta: "Los cangrejos, con las pinzas levantadas." },
        { pregunta: "¿Qué esperan las gaviotas cerca del mercado?", respuesta: "Algún descuido para robar un pescado." },
      ],
      opinion: "¿Te gustaría visitar un mercado como este? ¿Qué es lo que más te llamaría la atención?",
      reflexion: "¿Conoces algún mercado o lugar parecido cerca de donde vives? Descríbelo brevemente.",
    },
  ],
  expositivo: [
    {
      titulo: "El ciclo del agua",
      cuerpo:
        "El agua de nuestro planeta no desaparece nunca, sino que viaja en un ciclo que se repite constantemente desde hace millones de años, mucho antes de que existiera el ser humano. Este proceso, conocido como el ciclo del agua, permite que el mismo agua que hoy bebemos haya formado parte antes de un río, una nube o incluso un glaciar en algún lugar remoto del planeta.\n\nTodo empieza con la evaporación: el calor del sol hace que el agua de mares, ríos, lagos y también de la superficie de las plantas se transforme en vapor invisible y suba poco a poco hacia la atmósfera. Este proceso ocurre constantemente, aunque no podamos verlo, y es mucho más intenso en las zonas cálidas del planeta y durante las horas centrales del día, cuando el sol calienta con más fuerza.\n\nAl subir, el vapor de agua se encuentra con capas de aire más frío y se enfría poco a poco, hasta condensarse en forma de diminutas gotas de agua. Estas gotas, demasiado pequeñas y ligeras para caer, se agrupan alrededor de partículas de polvo suspendidas en el aire y forman las nubes que vemos en el cielo. Cuantas más gotas se agrupan, más grande y densa se vuelve la nube.\n\nCuando las gotas de las nubes se hacen demasiado grandes y pesadas para mantenerse suspendidas en el aire, caen hacia la superficie en forma de precipitación. Según la temperatura del aire por el que atraviesan, esta precipitación puede llegar en forma de lluvia, si las temperaturas son suaves, de nieve, si el aire está muy frío, o de granizo, cuando las gotas se congelan y se descongelan varias veces antes de tocar el suelo.\n\nEsa agua que cae no desaparece: una parte vuelve directamente a los ríos, lagos y mares; otra parte se filtra bajo tierra a través del suelo y las rocas, formando lo que se conoce como aguas subterráneas, que alimentan pozos y manantiales; y otra parte más es absorbida por las raíces de las plantas, que después la liberan de nuevo a la atmósfera a través de un proceso llamado transpiración. Desde cualquiera de estos puntos, el ciclo vuelve a empezar una y otra vez.\n\nGracias a este proceso continuo, el agua se renueva constantemente sin llegar a agotarse nunca en términos globales, aunque eso no significa que siempre esté disponible donde y cuando la necesitamos: por eso es tan importante cuidar el agua dulce, que representa solo una pequeña parte de toda el agua del planeta.",
      preguntas: [
        { pregunta: "¿Qué provoca la evaporación del agua?", respuesta: "El calor del sol." },
        { pregunta: "¿Cómo se forman las nubes?", respuesta: "El vapor se enfría, se condensa y las gotas se agrupan en nubes." },
        { pregunta: "¿Qué tipos de precipitación existen según el texto?", respuesta: "Lluvia, nieve o granizo." },
      ],
      opinion: "¿Por qué crees que es importante cuidar el agua si el ciclo la renueva constantemente?",
      reflexion: "¿Qué gestos del día a día pueden ayudar a no malgastar el agua en tu casa?",
    },
    {
      titulo: "Las abejas y la polinización",
      cuerpo:
        "Las abejas son insectos fundamentales para la vida en la Tierra, aunque muchas veces no nos damos cuenta de lo importante que es su trabajo silencioso. Existen miles de especies distintas de abejas repartidas por todo el planeta, desde las abejas melíferas que viven en colmenas organizadas hasta especies solitarias que anidan en pequeños agujeros del suelo o la madera.\n\nMientras recogen néctar y polen de las flores para alimentarse a sí mismas y a sus larvas, las abejas transportan sin querer granos de polen que se les quedan pegados en las patas y en el cuerpo, cubierto de un vello muy fino. Al visitar una flor tras otra en busca de alimento, van dejando parte de ese polen en cada una de ellas, mezclándolo con el de otras plantas de la misma especie.\n\nEste proceso se llama polinización, y es esencial para que muchas plantas puedan reproducirse y producir frutos y semillas. Sin la polinización, gran parte de las frutas y verduras que comemos cada día, como las manzanas, las fresas, los pepinos o las almendras, no podrían crecer con normalidad, y su producción se reduciría de forma muy importante en todo el mundo. Se calcula que las abejas son responsables, de forma directa o indirecta, de una parte muy significativa de los alimentos que consumimos.\n\nPor desgracia, en los últimos años la población de abejas ha disminuido de manera preocupante en muchas zonas del mundo. Entre las causas principales se encuentran el uso de determinados pesticidas en la agricultura, que resultan tóxicos para estos insectos, la pérdida de flores silvestres debido a la construcción de nuevas zonas urbanas y carreteras, y la aparición de enfermedades y parásitos que afectan gravemente a las colmenas.\n\nAnte esta situación, científicos y organizaciones ambientales de todo el mundo trabajan para proteger a las abejas y sus hábitats naturales. Algunas medidas incluyen la reducción del uso de pesticidas dañinos, la creación de corredores de flores silvestres en zonas urbanas y agrícolas, y el apoyo a los apicultores que se dedican al cuidado tradicional de las colmenas.\n\nCada vez más personas, conscientes de este problema, plantan flores adecuadas en sus jardines, terrazas y balcones para ayudar a que las abejas encuentren alimento durante todo el año, especialmente en las estaciones en las que escasean las flores silvestres. Pequeños gestos como estos, multiplicados por muchas personas, pueden contribuir a que estos insectos tan importantes sigan formando parte de nuestros ecosistemas durante muchos años más.",
      preguntas: [
        { pregunta: "¿Qué transportan las abejas sin querer entre flor y flor?", respuesta: "Granos de polen." },
        { pregunta: "¿Cómo se llama ese proceso?", respuesta: "Polinización." },
        { pregunta: "¿Por qué ha disminuido la población de abejas según el texto?", respuesta: "Por el uso de pesticidas y la pérdida de flores silvestres." },
      ],
      opinion: "¿Crees que deberíamos hacer más cosas para proteger a las abejas? ¿Cuáles?",
      reflexion: "¿Qué podrías hacer tú, en tu casa o en tu colegio, para ayudar a las abejas?",
    },
    {
      titulo: "Los estados de la materia",
      cuerpo:
        "Toda la materia que existe a nuestro alrededor, desde una piedra hasta el aire que respiramos, puede encontrarse principalmente en tres estados: sólido, líquido y gaseoso. Aunque a simple vista parezcan muy distintos entre sí, los tres estados están formados por los mismos tipos de partículas diminutas, y lo que cambia entre ellos es la forma en que esas partículas se organizan y se mueven.\n\nEn estado sólido, como el hielo, una piedra o un trozo de madera, las partículas están muy juntas entre sí y ordenadas de manera fija, casi como si estuvieran encajadas unas con otras. Por este motivo, los sólidos mantienen siempre su forma y su volumen, y para modificarlos hace falta aplicar bastante fuerza, como cuando rompemos un trozo de hielo o tallamos un bloque de madera.\n\nEn estado líquido, como el agua, el aceite o la leche, las partículas están un poco más separadas entre sí y pueden moverse con más libertad, deslizándose unas sobre otras. Por eso, los líquidos no tienen una forma propia, sino que se adaptan a la forma del recipiente que los contiene, aunque sí mantienen siempre el mismo volumen, independientemente de la forma del recipiente en el que se encuentren.\n\nEn estado gaseoso, como el vapor de agua, el aire que respiramos o el humo, las partículas están mucho más separadas entre sí y se mueven con mucha libertad y a gran velocidad en todas direcciones. Por esta razón, los gases no tienen ni forma ni volumen propios, sino que se expanden libremente hasta ocupar todo el espacio disponible en el recipiente o en la habitación donde se encuentren.\n\nLa materia puede cambiar de un estado a otro según varíe la temperatura o, en algunos casos, la presión a la que está sometida. Por ejemplo, el hielo se derrite cuando aumenta la temperatura y se convierte en agua líquida, en un proceso llamado fusión; y esa misma agua líquida, al calentarse lo suficiente, se evapora y se convierte en vapor de agua, en un proceso llamado evaporación. De la misma manera, si el vapor de agua se enfría, vuelve a convertirse en líquido mediante la condensación, y si el agua líquida se enfría todavía más, vuelve a solidificarse formando hielo.\n\nEstos cambios de estado ocurren constantemente en la naturaleza y también en nuestra vida diaria, por ejemplo cuando ponemos hielo en un vaso de agua, cuando hervimos agua para cocinar pasta, o cuando vemos cómo se empaña un cristal frío al respirar sobre él en un día de invierno.",
      preguntas: [
        { pregunta: "¿Cuáles son los tres estados principales de la materia?", respuesta: "Sólido, líquido y gaseoso." },
        { pregunta: "¿Qué ocurre con las partículas en estado sólido?", respuesta: "Están muy juntas y ordenadas." },
        { pregunta: "¿Qué provoca que la materia cambie de estado?", respuesta: "La temperatura." },
      ],
      opinion: "¿Qué cambio de estado de la materia te parece más curioso? ¿Por qué?",
      reflexion: "Piensa en tres ejemplos de tu vida diaria donde veas agua en sus tres estados distintos.",
    },
  ],
  argumentativo: [
    {
      titulo: "A favor de reducir el plástico",
      cuerpo:
        "Cada año se producen millones de toneladas de plástico en todo el mundo, destinadas a envases, bolsas, juguetes y una infinidad de objetos que usamos a diario. Una gran parte de ese plástico termina, tarde o temprano, en los ríos, mares y océanos, donde puede tardar cientos de años en desaparecer por completo. Por todo ello, considero que es urgente reducir el uso de plástico de un solo uso en nuestra vida diaria, antes de que el problema se vuelva todavía más difícil de solucionar.\n\nEn primer lugar, el plástico que llega al mar daña gravemente a los animales marinos. Muchas tortugas confunden las bolsas de plástico con medusas, su alimento habitual, y mueren al intentar comérselas. Otros animales, como aves marinas, focas o peces, quedan atrapados en redes y envases de plástico abandonados, lo que les impide moverse con libertad o incluso respirar con normalidad.\n\nEn segundo lugar, muchos plásticos no desaparecen del todo, sino que se rompen poco a poco en trozos cada vez más pequeños, llamados microplásticos, que resultan casi invisibles a simple vista. Estos microplásticos terminan mezclados en el agua del mar, en la sal, e incluso en el pescado que después llega a nuestra mesa, por lo que de forma indirecta también afectan a nuestra propia salud.\n\nAlgunas personas podrían pensar que el problema es demasiado grande como para que un solo cambio individual sirva de algo, pero la realidad es que existen alternativas sencillas al alcance de todos que, sumadas, marcan una gran diferencia. Usar bolsas de tela reutilizables en vez de bolsas de plástico, llevar siempre una botella de agua reutilizable, evitar los cubiertos y las pajitas de usar y tirar, o elegir productos con menos envoltorio son gestos que cualquier familia puede incorporar a su rutina sin demasiado esfuerzo.\n\nAdemás, muchos ayuntamientos y comercios ya están tomando medidas para reducir el plástico, como cobrar por las bolsas de plástico en los supermercados o sustituir los envases tradicionales por materiales biodegradables. Estas iniciativas, junto con los pequeños cambios que cada persona puede hacer en su día a día, demuestran que sí es posible avanzar hacia un futuro con menos plástico.\n\nPor todo ello, defiendo que, aunque parezcan pequeños, estos cambios en nuestras costumbres cotidianas pueden marcar una gran diferencia para la salud de los océanos y, en definitiva, para la salud de todo el planeta.",
      preguntas: [
        { pregunta: "¿Qué le ocurre al plástico que llega al mar?", respuesta: "Tarda cientos de años en desaparecer." },
        { pregunta: "¿Qué son los microplásticos según el texto?", respuesta: "Trozos muy pequeños en los que se rompen los plásticos." },
        { pregunta: "¿Qué alternativas propone el texto al plástico de un solo uso?", respuesta: "Bolsas de tela, botella reutilizable, evitar cubiertos y pajitas desechables." },
      ],
      opinion: "¿Estás de acuerdo con la opinión del texto? ¿Por qué sí o por qué no?",
      reflexion: "¿Qué cambio concreto podrías hacer tú para usar menos plástico en tu día a día?",
    },
    {
      titulo: "Libros frente a pantallas",
      cuerpo:
        "En la actualidad, muchos niños y niñas pasan más tiempo frente a una pantalla, ya sea de televisión, de videojuegos o de teléfono móvil, que leyendo un libro. Esta situación se ha vuelto todavía más habitual en los últimos años, con la llegada de nuevos dispositivos cada vez más accesibles. Sin embargo, considero que leer libros en papel sigue siendo una actividad más beneficiosa que pasar todo el tiempo libre disponible frente a una pantalla.\n\nPor un lado, la lectura ayuda a imaginar mundos propios, ya que un libro no muestra las imágenes ya hechas, como ocurre en una película o en un videojuego, sino que describe lugares, personajes y situaciones que cada lector debe recrear en su propia cabeza. Este ejercicio de imaginación estimula la creatividad de una manera que las pantallas, por muy vistosas que sean, no siempre consiguen igualar.\n\nPor otro lado, numerosos estudios realizados en distintos países señalan que leer con regularidad mejora la concentración, la capacidad de atención y el vocabulario mucho más que ver vídeos o jugar de forma constante durante largos periodos de tiempo. Además, la lectura obliga al cerebro a mantener la atención de forma continua durante varios minutos seguidos, algo que resulta muy beneficioso para el aprendizaje en general, incluidas otras asignaturas como las matemáticas o las ciencias.\n\nEsto no significa que las pantallas sean siempre negativas, ya que también permiten aprender cosas nuevas a través de documentales o vídeos educativos, comunicarse con familiares y amigos que viven lejos, o incluso descubrir juegos que fomentan la lógica y el trabajo en equipo. El problema surge cuando el tiempo frente a las pantallas ocupa la práctica totalidad del tiempo libre, dejando poco espacio para otras actividades igualmente enriquecedoras.\n\nPor este motivo, muchos expertos recomiendan buscar un equilibrio adecuado entre ambas actividades, en lugar de eliminar por completo el uso de dispositivos electrónicos. Aun así, defiendo firmemente que dedicar un rato del día a la lectura, aunque sean solo veinte minutos antes de dormir, aporta beneficios para la imaginación, el vocabulario y la concentración que las pantallas, por sí solas, difícilmente pueden ofrecer de la misma manera.",
      preguntas: [
        { pregunta: "Según el texto, ¿qué aporta la lectura que no aportan las imágenes ya hechas?", respuesta: "Ayuda a imaginar mundos propios creados por cada lector." },
        { pregunta: "¿Qué mejora la lectura según los estudios mencionados?", respuesta: "La concentración y el vocabulario." },
        { pregunta: "¿Reconoce el texto algún beneficio de las pantallas?", respuesta: "Sí, permiten aprender cosas nuevas y comunicarse con otras personas." },
      ],
      opinion: "¿Estás de acuerdo con la opinión defendida en el texto? Justifica tu respuesta.",
      reflexion: "¿Cuánto tiempo dedicas tú a leer frente al tiempo que dedicas a las pantallas? ¿Te gustaría cambiar ese equilibrio?",
    },
    {
      titulo: "Más tiempo de recreo en el colegio",
      cuerpo:
        "Muchos colegios dedican solo treinta minutos al recreo durante toda la jornada escolar, un tiempo que a menudo se reparte además entre el desayuno y el descanso propiamente dicho. En mi opinión, este tiempo debería ampliarse, ya que el recreo aporta numerosos beneficios que en ocasiones no se tienen suficientemente en cuenta a la hora de organizar el horario escolar.\n\nEn primer lugar, jugar al aire libre ayuda a que el alumnado se mueva y haga ejercicio físico después de pasar varias horas seguidas sentado en el aula, lo cual resulta especialmente importante teniendo en cuenta que cada vez más niños y niñas llevan un estilo de vida sedentario también fuera del horario escolar. Correr, saltar o jugar a algún deporte durante el recreo contribuye a mantener una buena salud física desde edades tempranas.\n\nEn segundo lugar, el recreo es un momento clave para relacionarse con los compañeros de una forma distinta a la que ofrece el aula. Durante el juego libre, el alumnado aprende a resolver pequeños conflictos, a ponerse de acuerdo sobre las normas de un juego, a esperar su turno y a trabajar en equipo de manera natural, sin que un adulto tenga que intervenir constantemente. Estas habilidades sociales resultan tan importantes para el futuro como los contenidos que se estudian en las asignaturas.\n\nAdemás, distintos estudios realizados en varios países afirman que un descanso adecuado entre clases mejora notablemente la concentración y el rendimiento durante las horas de clase posteriores. El cerebro, al igual que el cuerpo, necesita pausas para procesar la información recibida, y un recreo demasiado corto no siempre permite que los estudiantes se despejen lo suficiente antes de volver a concentrarse en una nueva asignatura.\n\nAlgunas personas podrían argumentar que ampliar el recreo reduciría el tiempo disponible para las asignaturas, pero investigaciones recientes sugieren que unos minutos más de descanso bien aprovechado pueden compensarse con una mayor atención y un mejor aprovechamiento del tiempo de clase restante. Por todo ello, considero que ampliar el tiempo de recreo, aunque solo sean quince minutos más al día, podría mejorar tanto el rendimiento académico como el bienestar general del alumnado, sin que ello suponga ningún perjuicio para el aprendizaje de los contenidos escolares.",
      preguntas: [
        { pregunta: "¿Cuánto tiempo de recreo tienen muchos colegios según el texto?", respuesta: "Treinta minutos." },
        { pregunta: "¿Qué beneficio del recreo se relaciona con los compañeros?", respuesta: "Ayuda a relacionarse, resolver conflictos y aprender a trabajar en equipo." },
        { pregunta: "¿Qué mejora un descanso adecuado según los estudios mencionados?", respuesta: "La concentración durante las horas de clase posteriores." },
      ],
      opinion: "¿Te gustaría tener más tiempo de recreo en tu colegio? ¿Por qué?",
      reflexion: "¿Qué sueles hacer durante el recreo? ¿Crees que es un tiempo bien aprovechado?",
    },
  ],
  instructivo: [
    {
      titulo: "Cómo hacer una cometa sencilla",
      cuerpo:
        "Construir tu propia cometa es una actividad sencilla y muy divertida que se puede hacer en casa con materiales fáciles de conseguir, y que después disfrutarás todavía más al volarla al aire libre. A continuación encontrarás todos los materiales necesarios y los pasos que debes seguir, con calma y con la ayuda de un adulto en las partes que lo requieran.\n\nPara construir una cometa sencilla necesitas dos varillas de madera fina (una un poco más larga que la otra), una bolsa de plástico grande o un trozo de papel resistente, cuerda fina, cinta adhesiva, tijeras y unas tiras de tela de colores para la cola. También puede resultar útil tener a mano una regla y un lápiz para marcar bien las medidas antes de cortar.\n\nEn primer lugar, coloca la varilla más corta de forma horizontal y la más larga de forma vertical, cruzándolas de manera que formen una cruz, aproximadamente a un tercio de distancia desde el extremo superior de la varilla larga. Átalas bien con la cuerda, formando una equis alrededor del punto de cruce, para que no se muevan ni se separen mientras trabajas con ellas.\n\nA continuación, haz una pequeña muesca en cada uno de los cuatro extremos de las varillas y pasa la cuerda por ellas, uniendo los cuatro extremos entre sí para formar el contorno de un rombo. Comprueba que la cuerda quede bien tensa, ya que este contorno será la base sobre la que se sujetará toda la superficie de la cometa.\n\nDespués, extiende el plástico o el papel resistente sobre una mesa y coloca encima el armazón de varillas. Recorta el material siguiendo la forma del rombo, dejando un margen de unos dos centímetros alrededor de todo el contorno. Dobla ese margen sobre la cuerda y pégalo con cinta adhesiva, avanzando poco a poco por todo el borde hasta que quede bien sujeto y sin arrugas.\n\nAta un hilo largo y resistente en el punto donde se cruzan las dos varillas: será el que sujetes con tus manos para controlar la cometa mientras vuela. Es importante que este nudo quede muy bien hecho, ya que de él dependerá que la cometa no se suelte una vez esté en el aire.\n\nPor último, añade la cola de la cometa atando varias tiras de tela de colores, una detrás de otra, a un trozo de cuerda que fijarás en la parte inferior del armazón. La cola ayuda a que la cometa se mantenga estable y no dé vueltas sin control mientras vuela. Ya solo queda buscar un día con viento moderado, un espacio abierto sin árboles ni cables cerca, y disfrutar viendo cómo tu propia cometa se eleva en el cielo.",
      preguntas: [
        { pregunta: "¿Qué materiales se necesitan para hacer la cometa?", respuesta: "Dos varillas de madera, plástico o papel resistente, cuerda, cinta adhesiva y tiras de tela." },
        { pregunta: "¿Qué forma se hace al unir los cuatro extremos de las varillas?", respuesta: "Un rombo." },
        { pregunta: "¿Para qué sirve la cola de tiras de tela?", respuesta: "Para que la cometa se mantenga estable en el aire." },
      ],
      opinion: "¿Te animarías a construir esta cometa? ¿Qué parte del proceso te parece más difícil?",
      reflexion: "¿Has hecho alguna vez algo con tus propias manos siguiendo unas instrucciones? Cuenta qué hiciste.",
    },
    {
      titulo: "Receta: tortilla de patatas sencilla",
      cuerpo:
        "La tortilla de patatas es uno de los platos más conocidos de la cocina española, y aunque parezca sencilla, requiere un poco de paciencia y algo de práctica para que salga en su punto. A continuación te explicamos todos los ingredientes necesarios y los pasos que debes seguir, siempre con la supervisión de una persona adulta cuando se trabaje con el fuego o con objetos cortantes.\n\nIngredientes: cuatro patatas medianas, cuatro huevos grandes, media cebolla, aceite de oliva y sal al gusto. Es importante elegir patatas que no sean demasiado nuevas, ya que suelen tener menos almidón y la tortilla puede quedar menos jugosa.\n\nPrimero, pela las patatas con cuidado y córtalas en láminas finas, procurando que tengan un grosor parecido entre ellas para que se cocinen de manera uniforme. Después, pela la cebolla y córtala también en trozos pequeños, del tamaño que prefieras según si te gusta notar más o menos su sabor en la tortilla final.\n\nCon ayuda de un adulto, calienta abundante aceite de oliva en una sartén amplia y añade las patatas y la cebolla. Fríelas a fuego medio durante unos quince o veinte minutos, removiendo de vez en cuando con una espumadera para que no se peguen ni se doren demasiado, hasta que las patatas estén blandas y se deshagan fácilmente al presionarlas con un tenedor.\n\nMientras las patatas se van cocinando, aprovecha para batir los huevos en un bol grande junto con una pizca de sal, hasta que queden bien mezclados. Cuando las patatas y la cebolla estén listas, retíralas del fuego y escúrrelas bien del exceso de aceite, ayudándote de un colador o de la propia espumadera.\n\nMezcla las patatas y la cebolla escurridas con los huevos batidos en el bol, removiendo con cuidado para que todos los trozos queden bien impregnados. Deja reposar la mezcla durante unos minutos, ya que esto ayuda a que el sabor se integre mejor antes de cocinarla.\n\nA continuación, calienta un poco de aceite en la misma sartén, vierte la mezcla y extiéndela bien por toda la superficie. Cocina a fuego medio-bajo durante unos cinco minutos, hasta que los bordes empiecen a cuajar. Con ayuda de un plato grande, dale la vuelta a la tortilla con cuidado y cocina el otro lado otros cinco minutos más. Cuando esté dorada por ambos lados, retírala del fuego y déjala reposar un par de minutos antes de cortarla y servirla en la mesa.",
      preguntas: [
        { pregunta: "¿Cuántos huevos y patatas necesita la receta?", respuesta: "Cuatro patatas y cuatro huevos." },
        { pregunta: "¿Cuánto tiempo se fríen las patatas y la cebolla?", respuesta: "Unos quince minutos." },
        { pregunta: "¿Qué se hace justo antes de servir la tortilla?", respuesta: "Dejarla reposar un par de minutos." },
      ],
      opinion: "¿Te gustaría cocinar esta receta? ¿Con quién te gustaría hacerla?",
      reflexion: "¿Qué plato sabes cocinar tú, o cuál te gustaría aprender a preparar?",
    },
    {
      titulo: "Cómo plantar un semillero",
      cuerpo:
        "Plantar un semillero es una manera estupenda de aprender cómo nacen las plantas y de empezar a cuidar tu propio pequeño huerto, ya sea en el jardín, en un balcón o incluso en el alféizar de una ventana con buena luz. A continuación te explicamos, paso a paso, todo lo que necesitas para hacerlo correctamente.\n\nPara plantar un semillero necesitas una bandeja especial para semilleros o, si no dispones de ella, varios vasos pequeños de yogur reutilizados con agujeros hechos en la base para que drene el agua sobrante. Además necesitarás tierra especial para macetas o semilleros, semillas de la planta que quieras cultivar (pueden ser de tomate, de lechuga, de albahaca o de cualquier otra planta que te guste) y agua para regar.\n\nEn primer lugar, llena los vasos o la bandeja con tierra hasta casi arriba, dejando aproximadamente un centímetro libre en la parte superior para que el agua no se derrame al regar. Presiona ligeramente la tierra con los dedos para que quede algo compacta, pero sin apretarla demasiado, ya que las semillas necesitan cierto espacio para poder germinar con facilidad.\n\nA continuación, haz un pequeño hueco en el centro de cada vaso con la punta de un dedo o con un lápiz, siguiendo la profundidad que indique el paquete de semillas que hayas comprado, ya que cada tipo de planta necesita una profundidad distinta para germinar correctamente. Si no dispones de esa información, una buena norma general es enterrar la semilla a una profundidad similar a su propio tamaño.\n\nDespués, coloca dos o tres semillas en cada hueco, por si alguna de ellas no llegara a germinar, y cúbrelas suavemente con un poco más de tierra, sin apretar demasiado para no dificultar su crecimiento. Riega con mucho cuidado, utilizando preferiblemente una regadera con agujeros pequeños o un pulverizador, y procurando que la tierra quede húmeda pero nunca encharcada, ya que el exceso de agua puede pudrir las semillas antes de que germinen.\n\nColoca el semillero en un lugar con buena luz natural, pero evitando el sol directo muy fuerte durante las primeras semanas, ya que podría resecar demasiado la tierra. Riega cada dos o tres días, comprobando siempre con el dedo si la tierra está seca antes de añadir más agua. En unas dos semanas, dependiendo de la planta elegida, empezarán a brotar los primeros tallos verdes, y cuando sean lo bastante fuertes y tengan varias hojas, podrás trasplantarlos con cuidado a una maceta más grande o directamente al huerto.",
      preguntas: [
        { pregunta: "¿Qué materiales se necesitan para plantar un semillero?", respuesta: "Vasos o bandeja con agujeros, tierra, semillas y agua." },
        { pregunta: "¿Cuántas semillas se colocan en cada hueco?", respuesta: "Dos o tres semillas." },
        { pregunta: "¿Cada cuánto tiempo hay que regar el semillero?", respuesta: "Cada dos o tres días." },
      ],
      opinion: "¿Te gustaría tener tu propio semillero en casa? ¿Qué planta te gustaría cultivar?",
      reflexion: "¿Alguna vez has cuidado una planta? ¿Qué aprendiste de esa experiencia?",
    },
  ],
  noticia: [
    {
      titulo: "Robledo celebra su fiesta mayor con récord de visitantes",
      cuerpo:
        "El pequeño pueblo de Robledo vivió el pasado fin de semana su fiesta mayor anual, que este año batió el récord de visitantes con más de dos mil personas llegadas de toda la comarca, según los datos facilitados por el propio ayuntamiento. Los actos comenzaron el viernes por la tarde con un mercado artesanal instalado en la plaza mayor, donde una veintena de artesanos locales mostraron y vendieron sus productos a los numerosos visitantes que se acercaron desde primera hora.\n\nDurante los tres días que duró la celebración se organizaron numerosas actividades para todos los públicos. Los más pequeños disfrutaron de talleres de manualidades y juegos tradicionales organizados por la asociación de vecinos, mientras que por las tardes se celebraron exhibiciones de danzas tradicionales de la región, a cargo de un grupo de folclore formado principalmente por jóvenes del propio pueblo.\n\nUno de los momentos más esperados fue, como cada año, el concurso de tartas caseras, que en esta edición contó con la participación de doce vecinos del pueblo, cada uno con su propia receta familiar transmitida de generación en generación. El ganador de esta edición fue un joven panadero local, que sorprendió al jurado con una tarta de manzana elaborada según una receta de su abuela, y recibió como premio un lote de productos gastronómicos típicos de la zona.\n\nLa fiesta también incluyó, como es habitual, una verbena popular la noche del sábado, con actuaciones musicales en directo que se prolongaron hasta pasada la medianoche, y una comida popular el domingo a mediodía en la que participaron cerca de trescientos vecinos y visitantes sentados en largas mesas instaladas en la plaza mayor.\n\nEl alcalde del municipio, visiblemente satisfecho con el desarrollo de la fiesta, destacó durante el acto de clausura que la celebración \"ha reunido a varias generaciones en torno a nuestras tradiciones\" y agradeció el trabajo de todas las personas voluntarias que colaboraron en su organización. Además, anunció que, gracias al notable éxito de esta edición, el año que viene se ampliará la programación con nuevas actividades pensadas especialmente para las familias con niños pequeños.",
      preguntas: [
        { pregunta: "¿Cuántos visitantes llegaron a la fiesta de Robledo?", respuesta: "Más de dos mil personas." },
        { pregunta: "¿Qué concurso se celebró durante la fiesta?", respuesta: "Un concurso de tartas caseras." },
        { pregunta: "¿Qué anunció el alcalde para el año que viene?", respuesta: "Que se ampliará la programación con más actividades para las familias." },
      ],
      opinion: "¿Te gustaría asistir a una fiesta como esta? ¿Qué actividad te llamaría más la atención?",
      reflexion: "¿Existe alguna fiesta tradicional en tu localidad? Descríbela brevemente.",
    },
    {
      titulo: "Un colegio gana un premio nacional de reciclaje",
      cuerpo:
        "El colegio público Los Almendros ha sido reconocido con el primer premio nacional de reciclaje escolar, un galardón que se entrega cada año a los centros educativos que destacan por sus iniciativas en favor del medio ambiente. El proyecto premiado fue impulsado por el propio alumnado de quinto y sexto de primaria, con el apoyo del equipo docente y de las familias del centro.\n\nLa iniciativa, bautizada por los propios alumnos como \"Reciclar en el cole\", consistió en instalar puntos de separación de residuos en cada una de las aulas del centro, además de organizar talleres periódicos de reutilización de materiales en los que se enseñaba a transformar envases y otros objetos de desecho en material escolar o decorativo.\n\nSegún explicó la directora del centro durante la ceremonia de entrega del premio, el proyecto nació hace algo más de un año a partir de una idea de un pequeño grupo de alumnos preocupados por la gran cantidad de plástico de un solo uso que se generaba cada día en el comedor escolar. Lo que comenzó como una propuesta puntual acabó convirtiéndose, con el paso de los meses, en un proyecto que implicó a todo el centro.\n\nDesde que se puso en marcha la iniciativa, el colegio ha conseguido reducir en un cuarenta por ciento la cantidad de basura que envía cada semana al vertedero municipal, según los datos recogidos por el propio alumnado como parte del proyecto. Además, gracias a los talleres de reutilización, se han fabricado macetas, estuches y otros materiales escolares a partir de envases que antes se desechaban directamente.\n\nEl premio incluye una dotación económica de varios miles de euros que, según ha anunciado la dirección del centro, se destinará a ampliar el huerto escolar existente y a comprar nuevos materiales para poner en marcha otros proyectos ambientales durante el próximo curso, entre ellos la instalación de un pequeño sistema de recogida de agua de lluvia para el riego del huerto.",
      preguntas: [
        { pregunta: "¿Qué colegio ha ganado el premio?", respuesta: "El colegio público Los Almendros." },
        { pregunta: "¿En qué consistió la iniciativa premiada?", respuesta: "Instalar puntos de separación de residuos y organizar talleres de reutilización." },
        { pregunta: "¿En qué se destinará el dinero del premio?", respuesta: "A ampliar el huerto escolar y comprar materiales para nuevos proyectos ambientales." },
      ],
      opinion: "¿Qué te parece la iniciativa de este colegio? ¿La pondrías en práctica en el tuyo?",
      reflexion: "¿Qué se recicla en tu colegio o en tu casa? ¿Se podría mejorar en algo?",
    },
    {
      titulo: "Descubren un ave poco común en un parque natural",
      cuerpo:
        "Un grupo de investigadores ha confirmado la presencia de un águila pescadora, un ave rapaz muy poco habitual en la región, en el parque natural de la Marisma Vieja, un espacio protegido conocido por la gran variedad de aves que lo visitan cada año durante sus rutas migratorias. Se trata de la primera vez que se observa esta especie en la zona desde hace más de veinte años, según los registros históricos del propio parque.\n\nEl águila pescadora, reconocible por su plumaje pardo y blanco y por su habilidad para capturar peces sumergiendo las garras en el agua a gran velocidad, había desaparecido prácticamente de la región debido a la contaminación de los ríos y a la pérdida de zonas húmedas adecuadas para su alimentación durante las últimas décadas.\n\nEl hallazgo se produjo durante una jornada de observación de aves organizada por un grupo de voluntarios de una asociación local de amantes de la naturaleza, que llevaban varias semanas recorriendo la zona con prismáticos y cámaras fotográficas. Fue precisamente uno de estos voluntarios quien logró fotografiar al ave mientras se alimentaba junto a la orilla del río, unas imágenes que después fueron confirmadas por biólogos especializados.\n\nLos expertos consultados explican que la mejora notable de la calidad del agua en los últimos años, gracias a distintos proyectos de depuración y limpieza del río, podría estar detrás de este inesperado regreso. Además, la recuperación de la vegetación en las orillas y el aumento de la población de peces en la zona habrían favorecido también las condiciones necesarias para que un ejemplar como este decidiera instalarse allí, aunque sea de forma temporal.\n\nAnte este importante hallazgo, la dirección del parque natural ha reforzado la vigilancia en la zona donde fue avistada el ave, delimitando un perímetro de seguridad para evitar que la presencia de curiosos pueda molestarla o ahuyentarla. Los técnicos del parque estudian ahora, mediante el seguimiento discreto de sus movimientos, si es posible que se trate de un ejemplar que finalmente decida quedarse a vivir de forma permanente en la marisma, lo que supondría una magnífica noticia para la biodiversidad de todo el espacio protegido.",
      preguntas: [
        { pregunta: "¿Qué ave ha sido descubierta en el parque natural?", respuesta: "Un águila pescadora." },
        { pregunta: "¿Quién descubrió al ave?", respuesta: "Un grupo de voluntarios durante una jornada de observación." },
        { pregunta: "¿Qué podría explicar el regreso de esta ave según los expertos?", respuesta: "La mejora de la calidad del agua en los últimos años." },
      ],
      opinion: "¿Por qué crees que es importante proteger a especies poco comunes como esta?",
      reflexion: "¿Has visto alguna vez un animal poco habitual cerca de donde vives? Cuenta cómo fue.",
    },
  ],
  cientifico: [
    {
      titulo: "Los volcanes",
      cuerpo:
        "Un volcán es una abertura en la corteza terrestre por la que puede salir al exterior el magma, una mezcla de roca fundida, gases y minerales que se encuentra a grandes profundidades en el interior de la Tierra, sometida a temperaturas y presiones enormes. Cuando el magma consigue abrirse camino hasta la superficie y sale al exterior, pasa a llamarse lava, y su temperatura puede superar con facilidad los mil grados centígrados.\n\nLos volcanes se forman principalmente en zonas donde las placas tectónicas, los enormes bloques rígidos que forman la corteza terrestre y flotan lentamente sobre el manto, se separan, se chocan entre sí o se deslizan unas contra otras. Estos movimientos, que ocurren de forma extremadamente lenta pero constante, generan grietas y zonas de debilidad en la corteza por las que el magma puede encontrar el camino más fácil para ascender hacia la superficie.\n\nExisten volcanes en casi todos los continentes, aunque se concentran especialmente en una zona conocida como el Cinturón de Fuego del Pacífico, donde se producen la mayoría de las erupciones volcánicas y los terremotos del planeta. Algunos de los volcanes más conocidos del mundo, como el Vesubio en Italia o el Fuji en Japón, atraen cada año a miles de turistas interesados en conocer de cerca estas imponentes formaciones geológicas.\n\nNo todos los volcanes se comportan de la misma manera ni están siempre activos. Algunos entran en erupción con bastante frecuencia, expulsando lava y gases de forma más o menos continua, mientras que otros permanecen dormidos, sin actividad aparente, durante siglos o incluso miles de años, antes de volver a despertar de forma repentina. A estos últimos se les conoce como volcanes durmientes, y su comportamiento resulta especialmente difícil de predecir para los científicos.\n\nAdemás de lava, un volcán en erupción puede expulsar gases tóxicos, cenizas volcánicas y fragmentos de roca de distintos tamaños, que en las erupciones más violentas pueden llegar a viajar varios kilómetros por el aire, afectando incluso al tráfico aéreo en la zona. Por todo ello, los científicos conocidos como vulcanólogos estudian constantemente la actividad de los volcanes más peligrosos del mundo, con el objetivo de poder anticipar posibles erupciones y proteger así a la población que vive cerca de ellos.",
      preguntas: [
        { pregunta: "¿Qué es el magma?", respuesta: "Una mezcla de roca fundida del interior de la Tierra." },
        { pregunta: "¿Cómo se llama el magma cuando sale a la superficie?", respuesta: "Lava." },
        { pregunta: "¿Dónde se forman principalmente los volcanes?", respuesta: "En zonas donde las placas tectónicas se separan, chocan o se deslizan entre sí." },
      ],
      opinion: "¿Qué es lo que más te sorprende de cómo funcionan los volcanes?",
      reflexion: "¿Conoces algún volcán famoso? Busca o recuerda un dato curioso sobre él.",
    },
    {
      titulo: "El sistema solar",
      cuerpo:
        "El sistema solar está formado por el Sol y todos los cuerpos que giran a su alrededor por efecto de su fuerza de gravedad: ocho planetas, sus satélites naturales, asteroides, cometas y otros cuerpos de menor tamaño repartidos por todo el espacio que los rodea. El Sol, una estrella de tamaño mediano en comparación con otras del universo, concentra por sí solo más del noventa y nueve por ciento de toda la masa del sistema solar, y es la fuente principal de luz y calor de todos los planetas que orbitan a su alrededor.\n\nLos cuatro planetas más cercanos al Sol, conocidos como planetas interiores o rocosos, son Mercurio, Venus, la Tierra y Marte. Se caracterizan por tener un tamaño relativamente pequeño y una superficie sólida formada principalmente por roca y metal, sobre la que en algunos casos, como en la Tierra, pueden encontrarse océanos, montañas y una atmósfera capaz de albergar vida.\n\nLos cuatro planetas siguientes, conocidos como planetas exteriores o gaseosos, son Júpiter, Saturno, Urano y Neptuno. Estos planetas son mucho más grandes que los interiores, pero están formados principalmente por gases como el hidrógeno y el helio, sin una superficie sólida clara sobre la que se pueda caminar. Júpiter, el mayor de todos los planetas del sistema solar, podría contener en su interior a más de mil planetas del tamaño de la Tierra.\n\nEntre las órbitas de Marte y Júpiter se extiende el llamado cinturón de asteroides, una región del espacio en la que orbitan millones de fragmentos de roca y metal de distintos tamaños, restos de la formación del sistema solar hace unos cuatro mil quinientos millones de años. Más allá de Neptuno, en los confines del sistema solar, existe además otra región conocida como el cinturón de Kuiper, donde se encuentran cuerpos helados como Plutón.\n\nCada planeta tarda un tiempo distinto en completar una vuelta completa alrededor del Sol, un periodo conocido como traslación, que depende directamente de la distancia a la que se encuentra respecto a nuestra estrella. Mientras que la Tierra tarda aproximadamente un año en completar su órbita, Neptuno, el planeta más alejado del Sol, tarda nada menos que ciento sesenta y cinco años terrestres en completar la suya, lo que significa que desde su descubrimiento en 1846 todavía no ha llegado a dar ni una vuelta completa alrededor del Sol.",
      preguntas: [
        { pregunta: "¿Qué elemento concentra la mayor parte de la masa del sistema solar?", respuesta: "El Sol." },
        { pregunta: "¿Qué diferencia hay entre los cuatro primeros planetas y los cuatro siguientes?", respuesta: "Los primeros son rocosos y pequeños; los siguientes son gaseosos y más grandes." },
        { pregunta: "¿Cómo se llama el tiempo que tarda un planeta en dar una vuelta al Sol?", respuesta: "Periodo de traslación." },
      ],
      opinion: "¿Qué planeta del sistema solar te parece más interesante? ¿Por qué?",
      reflexion: "Si pudieras viajar a un planeta o luna del sistema solar, ¿cuál elegirías y qué te gustaría descubrir?",
    },
    {
      titulo: "El sistema digestivo",
      cuerpo:
        "El sistema digestivo es el encargado de transformar los alimentos que comemos en nutrientes que nuestro cuerpo puede utilizar como fuente de energía y como materiales necesarios para crecer y repararse. Se trata de un largo recorrido, formado por distintos órganos que trabajan de manera coordinada, y que comienza en el mismo momento en que introducimos un alimento en la boca.\n\nEl proceso comienza en la boca, donde los dientes trituran la comida en trozos cada vez más pequeños mientras la lengua la mezcla con la saliva, un líquido que contiene sustancias capaces de empezar a descomponer algunos alimentos, especialmente los que contienen almidón, como el pan o la pasta. Una vez masticado, el alimento forma una especie de bola llamada bolo alimenticio, que estamos preparados para tragar.\n\nDespués, el bolo alimenticio pasa por el esófago, un tubo muscular que lo empuja mediante movimientos ondulantes hasta llegar al estómago. Allí, los jugos gástricos, unos líquidos muy ácidos producidos por las paredes del propio estómago, continúan descomponiendo el alimento durante varias horas, mezclándolo mediante contracciones musculares hasta convertirlo en una sustancia semilíquida llamada quimo.\n\nA continuación, el quimo pasa poco a poco al intestino delgado, un tubo muy largo y estrecho, enrollado sobre sí mismo dentro del abdomen, cuyas paredes están recubiertas de diminutas estructuras llamadas vellosidades intestinales. Es precisamente en el intestino delgado donde se absorben la mayor parte de los nutrientes de los alimentos, que pasan a la sangre y se distribuyen desde allí a todas las células del cuerpo.\n\nLo que el cuerpo no puede aprovechar, formado principalmente por fibra y otros restos no digeribles, continúa su recorrido hasta el intestino grueso, un tubo más ancho pero más corto que el intestino delgado. Allí se absorbe la mayor parte del agua restante que todavía queda en los restos de alimento, y finalmente lo que queda se almacena temporalmente hasta ser expulsado del cuerpo como desecho.\n\nTodo este largo recorrido, desde que introducimos un alimento en la boca hasta que se expulsan los restos no aprovechables, puede durar entre uno y dos días completos, dependiendo del tipo de alimento consumido y de las características propias de cada persona. Por este motivo, los médicos recomiendan mantener una alimentación variada y rica en fibra, que ayuda a que todo este proceso funcione de manera correcta y regular.",
      preguntas: [
        { pregunta: "¿Dónde comienza el proceso de la digestión?", respuesta: "En la boca." },
        { pregunta: "¿Cómo se llama la mezcla en la que se convierte el alimento en el estómago?", respuesta: "Quimo." },
        { pregunta: "¿Dónde se absorben la mayoría de los nutrientes?", respuesta: "En el intestino delgado." },
      ],
      opinion: "¿Por qué crees que es importante masticar bien la comida antes de tragarla?",
      reflexion: "¿Qué hábitos alimenticios crees que ayudan a que el sistema digestivo funcione mejor?",
    },
  ],
  poetico: [
    {
      titulo: "Canción del mar",
      cuerpo:
        "El mar canta de noche\nsu canción de sal y espuma,\nmece barcas dormidas\nbajo el manto de la luna.\n\nVa y viene, va y viene,\nsin cansarse, sin parar,\ncomo un abuelo que cuenta\nla misma historia sin final.\n\nEl viento juega con las olas,\nlas despeina sin cuidado,\ny ellas ríen, saltan, corren,\nhasta morir en el costado.\n\nLos barcos duermen tranquilos,\natados con su cadena,\nsoñando con otros puertos,\ncon tormentas y sirenas.\n\nCuando llega la tormenta,\nel mar cambia su color,\nse vuelve gris y bravío,\ny ruge con más furor.\n\nPero al pasar la tormenta\nvuelve la calma y el sol,\ny el mar recupera el brillo\nde su manto azul mejor.\n\nY en la orilla, una niña\nrecoge conchas al amanecer,\nmientras el mar le regala\nun secreto por saber.\n\nCada mañana ella vuelve\na escuchar su vieja canción,\ny el mar, paciente y sereno,\nle abre su corazón.",
      preguntas: [
        { pregunta: "¿Qué hace el mar según el poema, mientras es de noche?", respuesta: "Canta su canción de sal y espuma." },
        { pregunta: "¿Con quién se compara el vaivén del mar?", respuesta: "Con un abuelo que cuenta la misma historia sin final." },
        { pregunta: "¿Qué hace la niña en la orilla al amanecer?", respuesta: "Recoge conchas." },
      ],
      opinion: "¿Qué imagen del poema te ha gustado más? Explica por qué.",
      reflexion: "¿Has estado alguna vez frente al mar? ¿Qué sonidos o sensaciones recuerdas?",
    },
    {
      titulo: "Hojas de otoño",
      cuerpo:
        "El viento sacude el árbol\ny las hojas, una a una,\nbailan un baile dorado\nsin más música que ninguna.\n\nCaen despacio, girando,\ncomo pequeñas cometas,\nhasta posarse en el suelo\ny formar alfombras quietas.\n\nEl campo se viste de ocre,\nde marrón y de castaño,\ny los días se hacen cortos\ncon la llegada del año.\n\nLos pájaros que se quedan\nbuscan refugio y abrigo,\nmientras otros ya volaron\nhacia un cielo más amigo.\n\nLa niebla cubre los montes\ncada mañana temprano,\ny el rocío moja la hierba\ncomo un regalo cercano.\n\nEl olor a tierra mojada\nse queda entre las callejas,\nmientras el sol, más tímido,\nse esconde tras las tejas.\n\nEl árbol se queda desnudo,\nesperando en silencio\nque la primavera vuelva\ncon un nuevo brote tierno.\n\nY aunque parezca dormido\nbajo el frío y la escarcha,\nya guarda dentro la fuerza\nde la vida que se ensancha.",
      preguntas: [
        { pregunta: "¿Qué hace el viento con el árbol al principio del poema?", respuesta: "Lo sacude." },
        { pregunta: "¿Con qué se comparan las hojas al caer?", respuesta: "Con pequeñas cometas." },
        { pregunta: "¿Qué espera el árbol al quedarse desnudo?", respuesta: "Que la primavera vuelva con un nuevo brote tierno." },
      ],
      opinion: "¿Qué estación del año te gusta más describir con palabras? ¿Por qué?",
      reflexion: "¿Qué cambios observas en la naturaleza durante el otoño donde tú vives?",
    },
    {
      titulo: "Amigos de siempre",
      cuerpo:
        "Contigo el tiempo se acorta,\nlos silencios no dan miedo,\ny hasta los días grises\nse visten de contento.\n\nCompartimos los secretos\nque a nadie más contamos,\nlas risas que no se explican\ny los juegos que inventamos.\n\nCuando algo me sale mal\ny se me nubla la cara,\ntú apareces sin que llame,\ncomo si el tiempo importara.\n\nHemos construido cabañas\ncon mantas y con sillas,\ny hemos sido en verano\npiratas y también islas.\n\nSi discutimos un día\npor cualquier tontería,\nbasta un gesto, una mirada,\ny vuelve la alegría.\n\nNo hace falta que hablemos\npara sabernos entender,\nun amigo de verdad\nse nota sin más al ver.\n\nAunque un día estemos lejos,\nen ciudades diferentes,\nsé que seguirás cerca,\namigo, para siempre.\n\nPorque una amistad de años\nno se borra con distancia,\ny siempre queda un hueco\npara volver a la infancia.",
      preguntas: [
        { pregunta: "¿Qué ocurre con el tiempo cuando el poeta está con su amigo?", respuesta: "El tiempo se acorta." },
        { pregunta: "¿Qué comparten los amigos según el poema?", respuesta: "Secretos, risas y juegos inventados." },
        { pregunta: "¿Qué le dice el poeta a su amigo sobre el futuro?", respuesta: "Que seguirá cerca, aunque estén en ciudades diferentes, para siempre." },
      ],
      opinion: "¿Qué verso del poema representa mejor lo que sientes por tus amigos?",
      reflexion: "Piensa en tu mejor amigo o amiga. ¿Qué es lo que más valoras de esa amistad?",
    },
  ],
};

function randomIntLectura(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generarLectura(tipoId) {
  const pool = TEXTOS_LECTURA[tipoId];
  if (!pool) throw new Error("Tipo de texto no reconocido: " + tipoId);
  const texto = pool[randomIntLectura(0, pool.length - 1)];
  return Object.assign({ tipoId }, texto);
}

function todayEsLectura() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

// ---------------- Construcción del documento (docx) ----------------

function allBordersLectura(color, sz) {
  return { top: { color, sz }, left: { color, sz }, bottom: { color, sz }, right: { color, sz } };
}

function labelCellLectura(text) {
  return {
    shading: "D9D9D9",
    borders: allBordersLectura("808080", 4),
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    paragraphs: [{ runs: [{ text, bold: true, size: 20 }] }],
  };
}

function valueCellLectura(text) {
  return {
    borders: allBordersLectura("808080", 4),
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    paragraphs: [{ runs: [{ text, bold: true, size: 20 }] }],
  };
}

function buildLecturaHeaderBlocks(curso, tipoLabel, fecha) {
  const blocks = [];
  blocks.push({ runs: [{ text: "Aprende y Repasa", bold: true, size: 18, color: "595959" }], spacingAfter: 30 });
  blocks.push({ runs: [{ text: "Lectura comprensiva", bold: true, size: 32 }], spacingAfter: 100 });

  blocks.push({
    table: {
      columnWidths: [1600, 3300, 1200, 3538],
      rows: [
        { cells: [labelCellLectura("Nombre:"), valueCellLectura(""), labelCellLectura("Curso:"), valueCellLectura(`${curso}º de Primaria`)] },
        { cells: [labelCellLectura("Contenido:"), valueCellLectura(`Texto ${tipoLabel}`), labelCellLectura("Fecha:"), valueCellLectura(fecha)] },
      ],
    },
  });
  blocks.push({ runs: [{ text: " " }], spacingAfter: 200 });
  return blocks;
}

function sectionBarLectura(text, pageBreakBefore) {
  return {
    runs: [{ text, bold: true, color: "FFFFFF", size: 19 }],
    shading: "595959",
    spacingBefore: 120,
    spacingAfter: 100,
    pageBreakBefore: !!pageBreakBefore,
  };
}

function bodyParaLectura(text) {
  const lines = text.split("\n");
  const runs = [];
  lines.forEach((line, i) => {
    if (i > 0) runs.push({ break: true });
    runs.push({ text: line });
  });
  return { runs, spacingAfter: 120 };
}

function questionParaLectura(numberedText) {
  return { runs: [{ text: numberedText, bold: true }], spacingAfter: 40 };
}

function answerFilledLectura(text) {
  return { runs: [{ text, italic: true, color: "595959" }], spacingAfter: 120 };
}

function buildLecturaDocument({ curso, fecha, texto, showSolutions }) {
  const blocks = [];
  const tipoLabel = (TIPOS_TEXTO_LECTURA.find((t) => t.id === texto.tipoId) || {}).label || "";
  blocks.push(...buildLecturaHeaderBlocks(curso, tipoLabel, fecha));

  blocks.push(sectionBarLectura(`Texto: ${texto.titulo}`));
  texto.cuerpo.split("\n\n").forEach((paragraph) => {
    blocks.push(bodyParaLectura(paragraph));
  });

  blocks.push(sectionBarLectura("Comprensión lectora", true));
  texto.preguntas.forEach((p, i) => {
    blocks.push(questionParaLectura(`${i + 1}. ${p.pregunta}`));
    if (showSolutions) {
      blocks.push(answerFilledLectura(p.respuesta));
    } else {
      blocks.push({ runs: [{ text: "_".repeat(70) }], spacingAfter: 160 });
    }
  });

  blocks.push(sectionBarLectura("Tu opinión"));
  blocks.push(questionParaLectura(texto.opinion));
  if (showSolutions) {
    blocks.push(answerFilledLectura("Respuesta libre. Valora que esté bien argumentada y relacionada con el texto."));
  } else {
    for (let i = 0; i < 3; i++) blocks.push({ runs: [{ text: "_".repeat(70) }], spacingAfter: 200 });
  }

  blocks.push(sectionBarLectura("Reflexión"));
  blocks.push(questionParaLectura(texto.reflexion));
  if (showSolutions) {
    blocks.push(answerFilledLectura("Respuesta libre. Valora la conexión personal con el texto."));
  } else {
    for (let i = 0; i < 3; i++) blocks.push({ runs: [{ text: "_".repeat(70) }], spacingAfter: 200 });
  }

  blocks.push({ runs: [{ text: " " }] });
  return blocks;
}

// ---------------- API pública ----------------

function generarLecturaYSoluciones(tipoId, curso) {
  const texto = generarLectura(tipoId);
  const fecha = todayEsLectura();
  const fichaBlocks = buildLecturaDocument({ curso, fecha, texto, showSolutions: false });
  const solucionesBlocks = buildLecturaDocument({ curso, fecha, texto, showSolutions: true });
  const fichaBlob = createDocxBlob(fichaBlocks);
  const solucionesBlob = createDocxBlob(solucionesBlocks);
  return { texto, fichaBlob, solucionesBlob };
}
