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
        "Marcos vivía con su abuelo en el faro de Punta Blanca desde que era pequeño. Cada noche, antes de dormir, subían juntos los ciento veinte escalones para encender la luz que avisaba a los barcos del peligro de las rocas.\n\nUna tarde de tormenta, un pesquero se quedó sin motor cerca de la costa. El abuelo, con manos temblorosas por la edad, no podía subir tan rápido como antes. Marcos, sin dudarlo, corrió escalón tras escalón y encendió el faro justo a tiempo. Los pescadores vieron la luz y pudieron esquivar las rocas hasta llegar a puerto sanos y salvos.\n\nAquella noche, el abuelo abrazó a Marcos y le dijo que, a partir de entonces, el faro también sería un poco suyo.",
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
        "Rosa repartía el correo en bicicleta por las calles empinadas del pueblo desde hacía veinte años. Conocía a cada vecino por su nombre y sabía qué cartas alegraban un día y cuáles lo entristecían.\n\nUn día de diciembre, con la nieve cubriendo los caminos, le quedaba una última carta por entregar: era para doña Pilar, una anciana que vivía sola en lo alto de la colina. Rosa dudó, porque la bicicleta patinaba en el hielo, pero pensó en lo sola que estaría doña Pilar esperando noticias de su hija.\n\nEmpujó la bicicleta a pie durante media hora hasta llegar. Cuando doña Pilar abrió la puerta y vio la carta de su hija, se le llenaron los ojos de lágrimas de alegría, y invitó a Rosa a tomar un chocolate caliente para entrar en calor.",
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
        "Hugo y Nora encontraron un sendero que nunca habían visto, escondido detrás de unos matorrales en el bosque cercano a su pueblo. Decidieron seguirlo, aunque sabían que ya se estaba haciendo tarde.\n\nEl camino los llevó hasta un pequeño claro donde crecían flores de colores muy poco comunes en la zona. En el centro había un árbol enorme con un hueco en el tronco, y dentro, un nido de pájaros carpinteros con tres crías recién nacidas.\n\nDecidieron no tocar nada ni contárselo a nadie del pueblo, para que las crías pudieran crecer tranquilas. Cada semana volvían juntos a comprobar cómo iban creciendo, guardando aquel rincón del bosque como su secreto más preciado.",
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
        "Robledo es un pequeño pueblo de montaña rodeado de robles centenarios que le dan su nombre. Sus calles son estrechas y empedradas, y suben y bajan siguiendo la forma irregular de la ladera. Las casas, la mayoría de piedra gris con tejados de pizarra, tienen balcones de madera llenos de macetas con geranios rojos y blancos.\n\nEn la plaza mayor, la más grande de todo el pueblo, hay una fuente antigua donde el agua fresca de la montaña corre todo el año, incluso en pleno verano. Alrededor de la plaza se agrupan una panadería que huele a pan recién hecho desde primera hora, una pequeña tienda de ultramarinos y el ayuntamiento, con su reloj de torre que marca las horas para todo el pueblo.",
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
        "La abuela Elena tiene el pelo blanco recogido siempre en un moño y unas manos ásperas de tanto trabajar la tierra del huerto. Sus ojos, de un color avellana muy claro, se arrugan por completo cuando se ríe, que es casi todo el tiempo.\n\nSiempre lleva puesto un delantal de flores sobre la ropa, con los bolsillos llenos de semillas, un pañuelo y algún caramelo de menta para sus nietos. Camina despacio pero segura, apoyándose en un bastón de madera que ella misma talló hace muchos años.\n\nDe su cocina sale siempre un olor a pan recién horneado y a guisos de verduras, y en su voz, un poco ronca por los años, se nota el cariño con el que cuenta las mismas historias una y otra vez.",
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
        "Cada sábado por la mañana, el mercado del puerto se llena de puestos de colores donde los pescadores venden lo que han capturado esa misma noche. El olor a mar fresco se mezcla con el de las especias que venden en el puesto de al lado.\n\nLas cajas de madera están llenas de sardinas plateadas, pulpos de color violeta y cangrejos que todavía se mueven con las pinzas levantadas. Los vendedores gritan los precios en voz alta mientras las gaviotas revolotean cerca, esperando algún descuido para robar un pescado.\n\nEntre los puestos, los vecinos charlan y se saludan, y los niños se acercan curiosos a mirar las cestas llenas de conchas y caracolas que algunos pescadores venden como recuerdo, mientras el sol de la mañana ilumina el agua del puerto.",
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
        "El agua de nuestro planeta no desaparece nunca, sino que viaja en un ciclo que se repite constantemente. Todo empieza con la evaporación: el calor del sol hace que el agua de mares, ríos y lagos se transforme en vapor y suba a la atmósfera.\n\nAl subir, el vapor se enfría y se condensa, formando pequeñas gotas que se agrupan en las nubes. Cuando las gotas de las nubes se hacen demasiado grandes y pesadas, caen en forma de precipitación: lluvia, nieve o granizo, según la temperatura.\n\nEsa agua que cae vuelve a los ríos, lagos y mares, o se filtra bajo tierra formando aguas subterráneas, y desde allí el ciclo vuelve a empezar. Gracias a este proceso, el agua se renueva una y otra vez sin llegar a agotarse nunca.",
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
        "Las abejas son insectos fundamentales para la vida en la Tierra, aunque muchas veces no nos damos cuenta de su importancia. Mientras recogen néctar y polen de las flores para alimentarse, transportan sin querer granos de polen de una flor a otra.\n\nEste proceso se llama polinización, y es esencial para que muchas plantas puedan producir frutos y semillas. Sin la polinización, gran parte de las frutas y verduras que comemos cada día, como las manzanas, las fresas o las almendras, no podrían crecer.\n\nPor desgracia, en los últimos años la población de abejas ha disminuido en muchas zonas del mundo debido al uso de pesticidas y a la pérdida de flores silvestres. Por eso, cada vez más personas plantan flores en sus jardines y balcones para ayudar a que las abejas encuentren alimento.",
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
        "Toda la materia que existe a nuestro alrededor puede encontrarse principalmente en tres estados: sólido, líquido y gaseoso. En estado sólido, como el hielo o una piedra, las partículas están muy juntas y ordenadas, por lo que mantienen su forma y su volumen.\n\nEn estado líquido, como el agua o el aceite, las partículas están más separadas y se mueven con libertad, por lo que el líquido se adapta a la forma del recipiente que lo contiene, aunque mantiene su volumen. En estado gaseoso, como el vapor de agua o el aire, las partículas están muy separadas y se mueven con mucha libertad, ocupando todo el espacio disponible.\n\nLa materia puede cambiar de un estado a otro según la temperatura: el hielo se derrite y se convierte en agua líquida, y el agua líquida, al calentarse, se evapora y se convierte en vapor.",
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
        "Cada año se producen millones de toneladas de plástico en todo el mundo, y una gran parte termina en los mares y océanos, donde tarda cientos de años en desaparecer. Por eso, creo que es urgente reducir el uso de plástico de un solo uso en nuestra vida diaria.\n\nEn primer lugar, el plástico que llega al mar daña gravemente a los animales marinos, que a veces lo confunden con comida o quedan atrapados en él. En segundo lugar, muchos plásticos se rompen en trozos tan pequeños, llamados microplásticos, que terminan en el agua que bebemos y en los alimentos que comemos.\n\nAdemás, existen alternativas sencillas al alcance de todos: usar bolsas de tela en vez de bolsas de plástico, llevar una botella reutilizable o evitar los cubiertos y pajitas de usar y tirar. Por todo ello, pequeños cambios en nuestras costumbres pueden marcar una gran diferencia para el planeta.",
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
        "En la actualidad, muchos niños y niñas pasan más tiempo frente a una pantalla que leyendo un libro. Sin embargo, considero que leer libros en papel sigue siendo una actividad más beneficiosa que pasar todo el tiempo libre con dispositivos electrónicos.\n\nPor un lado, la lectura ayuda a imaginar mundos propios, ya que un libro no muestra las imágenes hechas, sino que las crea cada lector en su cabeza. Por otro lado, numerosos estudios señalan que leer mejora la concentración y el vocabulario mucho más que ver vídeos o jugar de forma constante.\n\nEsto no significa que las pantallas sean siempre negativas, ya que también permiten aprender cosas nuevas o comunicarse con otras personas. Aun así, defiendo que dedicar un rato del día a la lectura, aunque sean solo veinte minutos, aporta beneficios que las pantallas por sí solas no pueden ofrecer.",
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
        "Muchos colegios dedican solo treinta minutos al recreo durante toda la jornada escolar. En mi opinión, este tiempo debería ampliarse, ya que el recreo aporta muchos beneficios que a veces no se tienen en cuenta.\n\nEn primer lugar, jugar al aire libre ayuda a que el alumnado se mueva y haga ejercicio después de pasar varias horas sentado en clase. En segundo lugar, el recreo es un momento clave para relacionarse con los compañeros, resolver pequeños conflictos y aprender a trabajar en equipo de forma natural, jugando.\n\nAdemás, distintos estudios afirman que un descanso adecuado mejora la concentración durante las horas de clase posteriores. Por todo ello, considero que ampliar el tiempo de recreo, aunque solo sean quince minutos más, podría mejorar tanto el rendimiento como el bienestar del alumnado.",
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
        "Para construir una cometa sencilla necesitas dos varillas de madera, una bolsa de plástico grande o papel resistente, cuerda, cinta adhesiva y unas tiras de tela para la cola.\n\nEn primer lugar, cruza las dos varillas formando una cruz y átalas bien con la cuerda para que no se muevan. A continuación, une los cuatro extremos de las varillas con cuerda, formando el contorno de un rombo.\n\nDespués, coloca el plástico o el papel sobre el armazón y recorta siguiendo la forma del rombo, dejando un pequeño margen para doblarlo y pegarlo con cinta adhesiva alrededor de la cuerda. Ata un hilo largo en el punto donde se cruzan las varillas: será el que sujetes para volar la cometa.\n\nPor último, añade la cola con las tiras de tela atadas a la parte inferior, para que la cometa se mantenga estable en el aire. Ya solo queda buscar un día con viento y disfrutar volándola.",
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
        "Ingredientes: cuatro patatas, cuatro huevos, media cebolla, aceite de oliva y sal.\n\nPrimero, pela las patatas y córtalas en láminas finas. Después, corta la cebolla en trozos pequeños. Con ayuda de un adulto, calienta aceite en una sartén y fríe las patatas y la cebolla a fuego medio durante unos quince minutos, removiendo de vez en cuando hasta que estén blandas.\n\nMientras tanto, bate los huevos en un bol grande con una pizca de sal. Cuando las patatas estén listas, escúrrelas bien del aceite y mézclalas con los huevos batidos.\n\nA continuación, vierte de nuevo la mezcla en la sartén con un poco de aceite y cocina a fuego medio-bajo durante unos cinco minutos por cada lado, dándole la vuelta con ayuda de un plato. Cuando esté dorada por ambos lados, retírala del fuego y déjala reposar un par de minutos antes de servirla.",
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
        "Para plantar un semillero necesitas una bandeja o varios vasos pequeños con agujeros en la base, tierra para macetas, semillas de la planta que quieras cultivar y agua.\n\nEn primer lugar, llena los vasos o la bandeja con tierra, dejando un centímetro libre en la parte superior. A continuación, haz un pequeño hueco en el centro de cada vaso con el dedo, siguiendo la profundidad que indique el paquete de semillas.\n\nDespués, coloca dos o tres semillas en cada hueco y cúbrelas suavemente con un poco más de tierra, sin apretar demasiado. Riega con cuidado, procurando que la tierra quede húmeda pero no encharcada.\n\nColoca el semillero en un lugar con luz, pero sin sol directo muy fuerte, y riega cada dos o tres días. En unas semanas, empezarán a brotar los primeros tallos, y cuando sean lo bastante fuertes, podrás trasplantarlos a una maceta más grande o al huerto.",
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
        "El pequeño pueblo de Robledo vivió el pasado fin de semana su fiesta mayor anual, que este año batió el récord de visitantes con más de dos mil personas llegadas de toda la comarca. Los actos comenzaron el viernes por la tarde con un mercado artesanal en la plaza mayor.\n\nDurante los tres días de celebración se organizaron talleres para los más pequeños, una exhibición de danzas tradicionales y un concurso de tartas caseras que contó con la participación de doce vecinos del pueblo. El ganador, un joven panadero local, recibió como premio un lote de productos de la zona.\n\nEl alcalde del municipio destacó que la fiesta \"ha reunido a varias generaciones\" y anunció que, gracias al éxito de esta edición, el año que viene se ampliará la programación con más actividades para las familias.",
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
        "El colegio público Los Almendros ha sido reconocido con el primer premio nacional de reciclaje escolar, gracias a un proyecto impulsado por el alumnado de quinto y sexto de primaria. La iniciativa consistió en instalar puntos de separación de residuos en cada aula y organizar talleres de reutilización de materiales.\n\nSegún explicó la directora del centro, el proyecto nació hace un año a partir de una idea de un grupo de alumnos preocupados por la cantidad de plástico que se generaba en el comedor escolar. Desde entonces, el colegio ha reducido en un cuarenta por ciento la basura que envía al vertedero.\n\nEl premio incluye una dotación económica que el centro destinará a ampliar el huerto escolar y a comprar materiales para nuevos proyectos ambientales el próximo curso.",
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
        "Un grupo de investigadores ha confirmado la presencia de un águila pescadora, un ave muy poco habitual en la región, en el parque natural de la Marisma Vieja. Se trata de la primera vez que se observa esta especie en la zona desde hace más de veinte años.\n\nEl hallazgo se produjo durante una jornada de observación organizada por un grupo de voluntarios, que fotografiaron al ave alimentándose junto a la orilla del río. Los expertos explican que la mejora de la calidad del agua en los últimos años podría estar detrás de este regreso.\n\nEl parque natural ha reforzado la vigilancia en la zona para evitar molestias al animal y estudia si es posible que se trate de un ejemplar que decida quedarse a vivir de forma permanente en la marisma.",
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
        "Un volcán es una abertura en la corteza terrestre por la que puede salir al exterior el magma, una mezcla de roca fundida que se encuentra en el interior de la Tierra. Cuando el magma sale a la superficie, se llama lava.\n\nLos volcanes se forman en zonas donde las placas tectónicas, los enormes bloques que forman la corteza terrestre, se separan, se chocan o se deslizan unas contra otras. Esta actividad hace que el magma encuentre grietas por las que ascender hacia la superficie.\n\nNo todos los volcanes están siempre activos: algunos entran en erupción con frecuencia, mientras que otros permanecen dormidos durante siglos antes de volver a activarse. Además de lava, un volcán puede expulsar gases, cenizas y fragmentos de roca, que en ocasiones viajan varios kilómetros por el aire.",
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
        "El sistema solar está formado por el Sol y todos los cuerpos que giran a su alrededor por efecto de su fuerza de gravedad: ocho planetas, sus satélites, asteroides, cometas y otros cuerpos menores. El Sol concentra la mayor parte de la masa del sistema solar y es la fuente de luz y calor de todos los planetas.\n\nLos cuatro planetas más cercanos al Sol (Mercurio, Venus, Tierra y Marte) son planetas rocosos, de tamaño más pequeño y superficie sólida. Los cuatro siguientes (Júpiter, Saturno, Urano y Neptuno) son planetas gaseosos, mucho más grandes pero formados principalmente por gases.\n\nCada planeta tarda un tiempo distinto en completar una vuelta alrededor del Sol, lo que se llama periodo de traslación. Mientras que la Tierra tarda un año, Neptuno, el planeta más alejado, tarda ciento sesenta y cinco años terrestres en completar su órbita.",
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
        "El sistema digestivo es el encargado de transformar los alimentos que comemos en nutrientes que nuestro cuerpo puede utilizar como energía. El proceso comienza en la boca, donde los dientes trituran la comida y la saliva empieza a descomponerla.\n\nDespués, el alimento pasa por el esófago hasta el estómago, donde los jugos gástricos continúan descomponiéndolo durante varias horas hasta convertirlo en una mezcla llamada quimo. A continuación, el quimo pasa al intestino delgado, donde se absorben la mayoría de los nutrientes hacia la sangre.\n\nLo que el cuerpo no puede aprovechar continúa su recorrido hasta el intestino grueso, donde se absorbe el agua restante, y finalmente se expulsa como desecho. Todo este recorrido, desde que comemos hasta que se expulsan los restos, puede durar entre uno y dos días.",
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
        "El mar canta de noche\nsu canción de sal y espuma,\nmece barcas dormidas\nbajo el manto de la luna.\n\nVa y viene, va y viene,\nsin cansarse, sin parar,\ncomo un abuelo que cuenta\nla misma historia sin final.\n\nY en la orilla, una niña\nrecoge conchas al amanecer,\nmientras el mar le regala\nun secreto por saber.",
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
        "El viento sacude el árbol\ny las hojas, una a una,\nbailan un baile dorado\nsin más música que ninguna.\n\nCaen despacio, girando,\ncomo pequeñas cometas,\nhasta posarse en el suelo\ny formar alfombras quietas.\n\nEl árbol se queda desnudo,\nesperando en silencio\nque la primavera vuelva\ncon un nuevo brote tierno.",
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
        "Contigo el tiempo se acorta,\nlos silencios no dan miedo,\ny hasta los días grises\nse visten de contento.\n\nCompartimos los secretos\nque a nadie más contamos,\nlas risas que no se explican\ny los juegos que inventamos.\n\nAunque un día estemos lejos,\nen ciudades diferentes,\nsé que seguirás cerca,\namigo, para siempre.",
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

function sectionBarLectura(text) {
  return { runs: [{ text, bold: true, color: "FFFFFF", size: 19 }], shading: "595959", spacingBefore: 120, spacingAfter: 100 };
}

function bodyParaLectura(text) {
  return { runs: [{ text }], spacingAfter: 120 };
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

  blocks.push(sectionBarLectura("Comprensión lectora"));
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
