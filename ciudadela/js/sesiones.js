// ============================================================
// La Ciudadela · banco de sesiones diarias (5-10 minutos)
//
// Cada sesión sigue siempre el mismo orden, para que la rutina sea
// previsible para el alumnado:
//   1. historia   -> una escena de su edad, en 3-4 frases
//   2. pregunta   -> para pensar en pareja y comentar en voz alta
//   3. juego      -> clasificar situaciones (siete tipos: ¿depende de
//                    mí?, hecho o pensamiento, virtud, punto justo…);
//                    el docente revela cada respuesta
//   4. idea+frase -> la idea clave en una frase y la cita estoica
//   5. reto       -> algo pequeño y concreto para hacer hoy
//
// CITAS: solo se usan frases localizables en una obra concreta, con
// su referencia (libro y capítulo o carta). Están traducidas y
// adaptadas al vocabulario de 10-12 años, sin cambiar la idea. Se han
// dejado fuera a propósito frases famosas pero peligrosas para estas
// edades, como Enquiridión 20 («no te ofende quien te insulta o te
// golpea, sino tu opinión»): un niño que sufre acoso podría entender
// que el problema es suyo. Ver guia.html.
//
// SEGURIDAD: las sesiones sobre burlas, exclusión o conflictos llevan
// una "nota" que recuerda que contar a un adulto SÍ depende de uno.
// ============================================================

(function () {
  "use strict";

  var DEPENDE = [
    { id: "si", t: "Depende" },
    { id: "parte", t: "En parte" },
    { id: "no", t: "No depende" },
  ];

  var BLOQUES = [
    { id: 0, nombre: "Mi ciudadela", mes: "Septiembre", sub: "Lo que depende de mí y lo que no" },
    { id: 1, nombre: "Conozco mis emociones", mes: "Octubre", sub: "Todas valen: ponerles nombre y escucharlas" },
    { id: 2, nombre: "Lo que me digo", mes: "Octubre-noviembre", sub: "Pensamientos que ayudan y pensamientos trampa" },
    { id: 3, nombre: "La pausa", mes: "Noviembre-diciembre", sub: "El enfado, la calma y el espacio para elegir" },
    { id: 4, nombre: "Sabiduría", mes: "Diciembre-enero", sub: "Pensar bien antes de actuar" },
    { id: 5, nombre: "Justicia", mes: "Enero-febrero", sub: "Tratar bien y ser justo con todos" },
    { id: 6, nombre: "Coraje", mes: "Febrero", sub: "Hacer lo correcto aunque cueste" },
    { id: 7, nombre: "Templanza", mes: "Marzo", sub: "El punto justo" },
    { id: 8, nombre: "Amistad y conflictos", mes: "Marzo-abril", sub: "Hacer amigos, discutir bien y perdonar" },
    { id: 9, nombre: "Ciudadanos del mundo", mes: "Abril-mayo", sub: "Diversidad, naturaleza y bien común" },
    { id: 10, nombre: "Pantallas y yo", mes: "Mayo", sub: "Templanza y justicia también en internet" },
    { id: 11, nombre: "Cambios y despedidas", mes: "Junio", sub: "Cerrar el curso y prepararse para lo nuevo" },
  ];

  // Tipos de juego: cada uno fija sus opciones (id -> texto). Las
  // sesiones de los archivos js/sesiones/*.js indican solo el "tipo".
  var TIPOS = {
    DEPENDE: DEPENDE,
    HECHO: [{ id: "si", t: "Hecho" }, { id: "no", t: "Lo que se dice" }],
    REAL: [{ id: "si", t: "Es real" }, { id: "no", t: "Lo imagina" }],
    RUMOR: [{ id: "si", t: "Se sabe" }, { id: "no", t: "Es un rumor" }],
    VIRTUD: [
      { id: "sabiduria", t: "Sabiduría" },
      { id: "justicia", t: "Justicia" },
      { id: "coraje", t: "Coraje" },
      { id: "templanza", t: "Templanza" },
    ],
    PUNTO: [{ id: "pasa", t: "Me paso" }, { id: "justo", t: "Punto justo" }, { id: "corto", t: "Me quedo corto" }],
    AYUDA: [{ id: "yo", t: "Puedo resolverlo yo" }, { id: "adulto", t: "Hay que avisar a un adulto" }],
  };

  var SESIONES = [
    // ---------------- Bloque 1 · Mi ciudadela ----------------
    {
      bloque: 0,
      virtud: "templanza",
      titulo: "Enfadarse con la lluvia",
      historia:
        "Lucía lleva toda la semana entrenando para la final de balonmano del sábado. El sábado por la mañana mira por la ventana: diluvia y han suspendido el partido. Lucía da un portazo, no quiere desayunar y le contesta mal a su hermano pequeño.",
      pregunta: "¿Qué parte del enfado de Lucía es comprensible? ¿Y qué parte le está haciendo daño a ella y a los demás?",
      juego: {
        consigna: "¿Depende de Lucía?",
        opciones: DEPENDE,
        items: [
          { t: "Que llueva", r: "no" },
          { t: "Que suspendan el partido", r: "no" },
          { t: "Sentirse decepcionada al principio", r: "parte", x: "La primera emoción llega sola. Lo que hace con ella, sí depende de Lucía." },
          { t: "Cómo le habla a su hermano", r: "si" },
          { t: "Qué hace con la mañana libre", r: "si" },
          { t: "Seguir entrenando para el próximo partido", r: "si" },
        ],
      },
      idea: "Hay cosas que dependen de nosotros y cosas que no. Gastar la energía en lo que no depende de ti es como enfadarte con la lluvia.",
      frase: { t: "De las cosas, unas dependen de nosotros y otras no dependen de nosotros.", autor: "Epicteto", obra: "Enquiridión, 1" },
      reto: "Hoy, cuando algo te moleste, pregúntate en voz baja: «¿Esto depende de mí?».",
    },
    {
      bloque: 0,
      virtud: "justicia",
      titulo: "Lo que dicen los demás",
      historia:
        "Adrián se ha cortado el pelo y en el patio dos compañeros se ríen de su flequillo. Adrián pasa el resto de la mañana con la capucha puesta y sin hablar con nadie.",
      pregunta: "¿Qué puede controlar Adrián y qué no? ¿Y qué podrían hacer los que se rieron, o los que lo vieron?",
      juego: {
        consigna: "¿Depende de Adrián?",
        opciones: DEPENDE,
        items: [
          { t: "Que los demás se rían", r: "no" },
          { t: "Que a todo el mundo le guste su pelo", r: "no" },
          { t: "Lo que Adrián piensa de sí mismo", r: "parte", x: "Cuesta, pero puede recordarse que una risa no dice lo que él vale." },
          { t: "Contárselo a un adulto si pasa todos los días", r: "si" },
          { t: "Tratar a los demás como quiere que le traten", r: "si" },
        ],
      },
      nota: "Si las burlas se repiten o hacen daño de verdad, ya no es «cosa de niños»: se cuenta a un adulto. Eso también depende de ti.",
      idea: "Lo que dicen los demás no depende de ti. Lo que tú haces con ello, sí. Y contarlo cuando hace daño también depende de ti.",
      frase: { t: "La mejor manera de defenderte es no parecerte a quien te hace daño.", autor: "Marco Aurelio", obra: "Meditaciones, VI, 6" },
      reto: "Hoy di algo amable a alguien que no sea tu mejor amigo o amiga.",
    },
    {
      bloque: 0,
      virtud: "sabiduria",
      titulo: "El examen de mañana",
      historia:
        "Nerea tiene examen de Matemáticas mañana. Está tan nerviosa pensando «¿y si suspendo?» que lleva una hora mirando el libro sin leer nada.",
      pregunta: "¿Qué le está quitando más energía a Nerea: el examen, o lo que imagina sobre el examen?",
      juego: {
        consigna: "¿Depende de Nerea?",
        opciones: DEPENDE,
        items: [
          { t: "Estudiar esta tarde", r: "si" },
          { t: "Preguntar hoy lo que no entiende", r: "si" },
          { t: "Irse a dormir a su hora", r: "si" },
          { t: "Las preguntas que ponga la maestra", r: "no" },
          { t: "La nota exacta que saque", r: "parte", x: "Su esfuerzo influye mucho, pero también los nervios del día o lo difíciles que sean las preguntas." },
          { t: "Estar un poco nerviosa", r: "parte", x: "Los nervios son normales. Lo que sí puede hacer es respirar y ponerse a trabajar." },
        ],
      },
      idea: "El resultado no depende del todo de ti. Tu esfuerzo, sí. Pon ahí toda tu energía.",
      frase: { t: "¿Qué hay que hacer, entonces? Sacar el mejor partido de lo que depende de nosotros, y tomar lo demás como venga.", autor: "Epicteto", obra: "Disertaciones, I, 1" },
      reto: "Antes de tu próxima tarea difícil, escribe una cosa que SÍ depende de ti y hazla la primera.",
    },
    {
      bloque: 0,
      virtud: "coraje",
      titulo: "El obstáculo es el camino",
      historia:
        "Youssef se ha roto el brazo y no podrá jugar al fútbol en seis semanas. El primer día está hundido. Su entrenadora le propone que la ayude a apuntar las estadísticas del equipo y a observar cómo juegan los rivales.",
      pregunta: "¿Qué puede aprender Youssef estas seis semanas que no habría aprendido jugando?",
      juego: {
        consigna: "¿Depende de Youssef?",
        opciones: DEPENDE,
        items: [
          { t: "Que el brazo tarde seis semanas en curarse", r: "no" },
          { t: "Que el equipo gane sin él", r: "no" },
          { t: "Estar triste los primeros días", r: "parte", x: "Es normal y está bien. Lo que depende de él es no quedarse ahí para siempre." },
          { t: "Ir a los entrenamientos a ayudar", r: "si" },
          { t: "Aprender a entender mejor el juego", r: "si" },
        ],
      },
      idea: "Un obstáculo puede ser el principio de otro camino. Pregúntate: ¿qué puedo aprender de esto?",
      frase: { t: "Lo que se pone en medio del camino se convierte en el camino.", autor: "Marco Aurelio", obra: "Meditaciones, V, 20" },
      reto: "Piensa en algo que te salió mal esta semana. Escribe una cosa que aprendiste de ello.",
    },
    {
      bloque: 0,
      virtud: "justicia",
      titulo: "No es asunto mío… ¿seguro?",
      historia:
        "En el recreo, un grupo no deja jugar a Carmen y le dicen que se vaya. Hugo lo ve todo. Piensa: «No es asunto mío. Eso no depende de mí».",
      pregunta: "¿Tiene razón Hugo? ¿Qué cosas SÍ dependen de él?",
      juego: {
        consigna: "¿Depende de Hugo?",
        opciones: DEPENDE,
        items: [
          { t: "Lo que hace el grupo", r: "no" },
          { t: "Acercarse a Carmen e invitarla a jugar", r: "si" },
          { t: "Avisar al maestro o la maestra de patio", r: "si" },
          { t: "Mirar hacia otro lado", r: "si", x: "Sí depende de él. Mirar hacia otro lado también es una elección." },
          { t: "Que Carmen se sienta mejor", r: "parte", x: "No puede decidir lo que siente Carmen, pero su ayuda cuenta mucho." },
        ],
      },
      nota: "No controlas lo que hacen otros, pero avisar a un adulto cuando ves que tratan mal a alguien siempre depende de ti.",
      idea: "No controlas lo que hacen los demás, pero sí lo que haces tú cuando lo ves. Ayudar y avisar dependen de ti.",
      frase: { t: "No discutas más sobre cómo tiene que ser una buena persona. Sé una.", autor: "Marco Aurelio", obra: "Meditaciones, X, 16" },
      reto: "Esta semana fíjate en si alguien se queda solo en el recreo. Si es así, invítale a jugar.",
    },

    // ---------------- Bloque 2 · Siento, pienso, elijo ----------------
    {
      bloque: 1,
      virtud: "sabiduria",
      titulo: "Los estoicos también lloran",
      historia:
        "Alba ha perdido la carrera de relevos porque se tropezó. Le arden las mejillas, tiene un nudo en la garganta y le entran ganas de llorar. Un amigo le dice: «Venga, los estoicos no lloran».",
      pregunta: "¿Tiene razón su amigo? ¿Qué crees que pensaban de verdad los estoicos sobre las emociones?",
      juego: {
        consigna: "¿Depende de Alba?",
        opciones: DEPENDE,
        items: [
          { t: "Que le ardan las mejillas", r: "no", x: "Es una reacción del cuerpo. Llega sola." },
          { t: "Tener ganas de llorar", r: "no", x: "También llega sola, y no tiene nada de malo." },
          { t: "Llorar un rato si lo necesita", r: "si", x: "Y está bien. Llorar no es ser débil." },
          { t: "Decirse «soy un desastre»", r: "parte", x: "Ese pensamiento aparece solo, pero puede cambiarlo: «me he tropezado, eso no me hace un desastre»." },
          { t: "Culpar a una compañera del equipo", r: "si" },
          { t: "Felicitar al equipo ganador", r: "si" },
        ],
      },
      idea: "Los estoicos no querían personas sin emociones. Sabían que la primera reacción llega sola. Lo que se entrena es lo que haces después.",
      frase: { t: "Igual que sentimos un escalofrío cuando nos salpica agua fría, hay movimientos del ánimo que llegan sin que los elijamos.", autor: "Séneca", obra: "Sobre la ira, II, 2" },
      reto: "Hoy, cuando notes una emoción fuerte, ponle nombre en tu cabeza: «esto es enfado», «esto es vergüenza».",
    },
    {
      bloque: 2,
      virtud: "sabiduria",
      titulo: "Lo que me digo",
      historia:
        "Esta mañana Iker saludó a su amiga Sara en la puerta del cole y ella pasó sin contestar, mirando al suelo. Iker lleva toda la mañana pensando: «Está enfadada conmigo. Ya no quiere ser mi amiga».",
      pregunta: "¿Qué otras explicaciones puede haber? ¿Qué sabe Iker de verdad, y qué se está imaginando?",
      juego: {
        consigna: "¿Es un hecho o es lo que Iker se dice?",
        opciones: [
          { id: "si", t: "Hecho" },
          { id: "no", t: "Lo que se dice" },
        ],
        items: [
          { t: "Sara no le contestó", r: "si" },
          { t: "Sara iba mirando al suelo", r: "si" },
          { t: "Está enfadada conmigo", r: "no" },
          { t: "Ya no quiere ser mi amiga", r: "no" },
          { t: "Seguro que he hecho algo malo", r: "no" },
          { t: "Iker se ha sentido mal toda la mañana", r: "si" },
        ],
      },
      idea: "Muchas veces no nos duele lo que pasa, sino lo que nos decimos sobre lo que pasa. Antes de creerte un pensamiento, compruébalo.",
      frase: { t: "Lo que inquieta a las personas no son las cosas, sino las opiniones que tienen sobre las cosas.", autor: "Epicteto", obra: "Enquiridión, 5" },
      reto: "Si hoy algo te molesta, busca otras dos explicaciones posibles antes de quedarte con la peor.",
    },
    {
      bloque: 3,
      virtud: "templanza",
      titulo: "Diez segundos",
      historia:
        "Un compañero le ha pisado sin querer a Daniel el dibujo que estaba terminando. Daniel ya tiene la mano levantada para empujarle… y en ese momento se acuerda de lo que practicaron en clase: parar, respirar tres veces y contar hasta diez.",
      pregunta: "¿Qué puede cambiar en diez segundos? ¿Te ha pasado alguna vez que habrías hecho otra cosa si hubieras esperado un poco?",
      juego: {
        consigna: "¿Depende de Daniel?",
        opciones: DEPENDE,
        items: [
          { t: "Que el dibujo se haya manchado", r: "no" },
          { t: "Que el compañero lo hiciera sin querer", r: "no" },
          { t: "Empujar o no empujar", r: "si" },
          { t: "Respirar antes de hablar", r: "si" },
          { t: "Decir «me ha molestado, ¿me ayudas a arreglarlo?»", r: "si" },
        ],
      },
      idea: "Entre lo que pasa y lo que haces hay un pequeño espacio. Si lo alargas con una pausa, eliges tú y no tu enfado.",
      frase: { t: "El mejor remedio contra la ira es esperar.", autor: "Séneca", obra: "Sobre la ira, II, 29" },
      reto: "Practica la pausa: tres respiraciones lentas antes de contestar cuando algo te moleste.",
    },
    {
      bloque: 2,
      virtud: "coraje",
      titulo: "Los miedos que imaginamos",
      historia:
        "Mañana a Lucas le toca leer en voz alta delante de toda la clase. Esta noche no puede dormir: se imagina que se equivoca, que todos se ríen, que se queda en blanco…",
      pregunta: "¿Cuántas de las cosas que imagina Lucas han pasado de verdad? ¿Qué le diríais para ayudarle?",
      juego: {
        consigna: "¿Es real o lo imagina Lucas?",
        opciones: [
          { id: "si", t: "Es real" },
          { id: "no", t: "Lo imagina" },
        ],
        items: [
          { t: "Mañana le toca leer en voz alta", r: "si" },
          { t: "Está nervioso", r: "si" },
          { t: "Ha practicado la lectura dos veces", r: "si" },
          { t: "Todos se van a reír", r: "no" },
          { t: "Se va a quedar en blanco", r: "no" },
          { t: "Va a hacer el ridículo", r: "no" },
        ],
      },
      idea: "El miedo exagera. Separa lo que está pasando de verdad de lo que tu cabeza imagina, y prepárate para lo real.",
      frase: { t: "Son más las cosas que nos asustan que las que nos hacen daño. Sufrimos más en la imaginación que en la realidad.", autor: "Séneca", obra: "Cartas a Lucilio, 13" },
      reto: "Piensa en algo que te dé miedo esta semana y escribe una cosa que puedes hacer para prepararte.",
    },
    {
      bloque: 3,
      virtud: "templanza",
      titulo: "Enfadada por estar enfadada",
      historia:
        "En el partido del recreo, Marta cree que el otro equipo ha hecho trampa. Grita, deja de jugar y se pasa la clase siguiente de morros. Al final ya ni se acuerda del gol: está enfadada por estar enfadada.",
      pregunta: "¿Qué le hizo más daño a Marta: la supuesta trampa o su enfado? ¿Cómo podría haber resuelto lo del gol?",
      juego: {
        consigna: "¿Depende de Marta?",
        opciones: DEPENDE,
        items: [
          { t: "Si el otro equipo hizo trampa", r: "no" },
          { t: "Sentir rabia en el primer momento", r: "no", x: "Es la primera reacción, y le avisa de que algo le parece injusto." },
          { t: "Gritar", r: "si" },
          { t: "Hablarlo con calma o pedir a un adulto que ayude", r: "si" },
          { t: "Seguir enfadada toda la tarde", r: "parte", x: "Si le da vueltas y vueltas, el enfado crece. Puede elegir cambiar de pensamiento." },
        ],
      },
      idea: "El enfado es una señal de que algo nos parece injusto. Escúchalo, pero no dejes que tome el mando.",
      frase: { t: "¡Cuánto más daño nos hacen el enfado y el disgusto que las cosas que los provocan!", autor: "Marco Aurelio", obra: "Meditaciones, XI, 18" },
      reto: "Cuando algo te parezca injusto, dilo con palabras tranquilas: «No me parece justo porque…».",
    },

    // ---------------- Bloque 3 · Las cuatro virtudes ----------------
    {
      bloque: 4,
      virtud: "sabiduria",
      titulo: "Antes de creer, comprueba",
      historia:
        "En el patio corre el rumor de que Mario ha robado un balón del gimnasio. Nadie lo ha visto, pero todo el mundo lo repite. A la hora de la salida, ya nadie quiere jugar con Mario.",
      pregunta: "¿Qué harías antes de repetir algo que has oído? ¿Qué le ha pasado a Mario por culpa de un rumor?",
      juego: {
        consigna: "¿Se sabe seguro o es un rumor?",
        opciones: [
          { id: "si", t: "Se sabe" },
          { id: "no", t: "Es un rumor" },
        ],
        items: [
          { t: "Falta un balón en el gimnasio", r: "si", x: "Lo ha dicho el maestro de Educación Física." },
          { t: "Mario lo robó", r: "no" },
          { t: "Mario estuvo en el gimnasio", r: "no" },
          { t: "Todo el mundo lo está diciendo", r: "si", x: "Es verdad que lo dicen… pero que mucha gente lo repita no lo convierte en verdad." },
          { t: "Nadie quiere jugar con Mario", r: "si" },
        ],
      },
      idea: "Ser sabio no es saberlo todo: es comprobar antes de creer y pensar antes de repetir.",
      frase: { t: "Si no está bien, no lo hagas. Si no es verdad, no lo digas.", autor: "Marco Aurelio", obra: "Meditaciones, XII, 17" },
      reto: "Hoy, antes de contar algo que te han contado, pregúntate: «¿Lo sé seguro? ¿Le hace daño a alguien?».",
    },
    {
      bloque: 4,
      virtud: "sabiduria",
      titulo: "Aprender enseñando",
      historia:
        "Samuel por fin ha entendido las fracciones equivalentes. Su compañera Irene sigue perdida. Samuel duda: si se para a explicárselo, no terminará su ficha. Al final se lo explica… y descubre que, al explicarlo, lo entiende todavía mejor.",
      pregunta: "¿Por qué crees que Samuel lo entendió mejor al explicarlo? ¿Has aprendido tú algo enseñándoselo a alguien?",
      juego: {
        consigna: "¿Depende de Samuel?",
        opciones: DEPENDE,
        items: [
          { t: "Que Irene lo entienda a la primera", r: "no" },
          { t: "Explicarlo con paciencia", r: "si" },
          { t: "Buscar otro ejemplo si no lo entiende", r: "si" },
          { t: "Pedir él ayuda cuando no entiende algo", r: "si" },
          { t: "Terminar la ficha a tiempo", r: "parte", x: "Puede organizarse, aunque ayudar le quite unos minutos." },
        ],
      },
      idea: "La sabiduría crece cuando se comparte. Enseñar a otro es una de las mejores maneras de aprender.",
      frase: { t: "Las personas aprenden mientras enseñan.", autor: "Séneca", obra: "Cartas a Lucilio, 7" },
      reto: "Explícale hoy a alguien, en clase o en casa, algo que hayas aprendido esta semana.",
    },
    {
      bloque: 5,
      virtud: "justicia",
      titulo: "Cuando nadie mira",
      historia:
        "En el examen de Ciencias, la maestra sale un minuto de clase. Raúl tiene el libro en la mochila y nadie se daría cuenta si mirara una respuesta.",
      pregunta: "Si nadie se entera, ¿qué pierde Raúl si copia? ¿Por qué ser justo importa también cuando nadie mira?",
      juego: {
        consigna: "¿Depende de Raúl?",
        opciones: DEPENDE,
        items: [
          { t: "Que la maestra salga de clase", r: "no" },
          { t: "Lo que hagan los demás", r: "no" },
          { t: "Abrir o no la mochila", r: "si" },
          { t: "Dejar en blanco lo que no sabe", r: "si" },
          { t: "Lo que sabe del tema", r: "parte", x: "Hoy ya no puede cambiarlo, pero sí depende de lo que estudió antes." },
        ],
      },
      idea: "Ser justo es hacer lo correcto también cuando nadie te ve. Eso es lo que te hace alguien de confianza.",
      frase: { t: "Si no está bien, no lo hagas. Si no es verdad, no lo digas.", autor: "Marco Aurelio", obra: "Meditaciones, XII, 17" },
      reto: "Hoy di la verdad en algo pequeño, aunque sea más cómodo no decirla.",
    },
    {
      bloque: 5,
      virtud: "justicia",
      titulo: "Como las manos y los pies",
      historia:
        "En el trabajo en grupo de Sociales, Aitana quiere hacerlo todo ella «para que salga bien». Dos compañeros se aburren y otro se ha levantado tres veces a sacar punta al lápiz.",
      pregunta: "¿Qué tiene de injusto hacerlo todo tú? ¿Cómo repartiríais el trabajo para que todos aporten?",
      juego: {
        consigna: "¿Depende de Aitana?",
        opciones: DEPENDE,
        items: [
          { t: "Que el trabajo quede perfecto", r: "parte", x: "Depende de todo el grupo, no solo de ella." },
          { t: "Que todos trabajen igual de bien", r: "no" },
          { t: "Repartir las tareas", r: "si" },
          { t: "Escuchar las ideas de los demás", r: "si" },
          { t: "Pedir ayuda en lo que se le da peor", r: "si" },
        ],
      },
      idea: "Para los estoicos, las personas somos como las partes de un mismo cuerpo: cada una aporta algo. Colaborar también es justicia.",
      frase: { t: "Hemos nacido para colaborar, como los pies, las manos o los párpados.", autor: "Marco Aurelio", obra: "Meditaciones, II, 1" },
      reto: "En el próximo trabajo en grupo, pregunta a quien menos habla: «¿Tú qué piensas?».",
    },
    {
      bloque: 6,
      virtud: "coraje",
      titulo: "La maceta rota",
      historia:
        "Jugando con una pelota dentro de clase, que no se puede, Óscar ha roto la maceta de la ventana. La maestra pregunta quién ha sido. Nadie habla, y la maestra dice que, si nadie lo cuenta, toda la clase se quedará sin recreo.",
      pregunta: "¿Qué le da miedo a Óscar? ¿Qué necesita para decir la verdad? ¿Qué les pasa a los demás si se calla?",
      juego: {
        consigna: "¿Depende de Óscar?",
        opciones: DEPENDE,
        items: [
          { t: "Que la maceta esté rota", r: "no", x: "Ya ha pasado. Lo que venga ahora sí depende de él." },
          { t: "Cómo reaccione la maestra", r: "no" },
          { t: "Tener miedo", r: "parte", x: "El miedo llega solo. Pero puede actuar con miedo." },
          { t: "Decir la verdad", r: "si" },
          { t: "Pedir perdón y ofrecerse a arreglarlo", r: "si" },
        ],
      },
      idea: "Tener coraje no es no tener miedo: es hacer lo correcto aunque tengas miedo.",
      frase: { t: "No es que no nos atrevamos porque las cosas sean difíciles. Son difíciles porque no nos atrevemos.", autor: "Séneca", obra: "Cartas a Lucilio, 104" },
      reto: "Haz hoy algo pequeño que te dé un poco de miedo, pero que sepas que está bien.",
    },
    {
      bloque: 6,
      virtud: "coraje",
      titulo: "Poco a poco, como las uvas",
      historia:
        "A Lola le encanta dibujar, pero quiere dejarlo porque sus dibujos «no salen como los de internet». Ayer rompió uno por la mitad.",
      pregunta: "¿Cuánto tiempo crees que llevan practicando las personas que dibujan así? ¿Qué le dirías a Lola?",
      juego: {
        consigna: "¿Depende de Lola?",
        opciones: DEPENDE,
        items: [
          { t: "Dibujar hoy como una profesional", r: "no" },
          { t: "Lo que se tarda en aprender algo difícil", r: "no" },
          { t: "Practicar un rato cada día", r: "si" },
          { t: "Compararse con los dibujos de otros", r: "si", x: "Sí: es una elección. Puede compararse con la Lola de hace un mes." },
          { t: "Guardar sus dibujos para ver cómo mejora", r: "si" },
        ],
      },
      idea: "El coraje también es seguir intentándolo cuando algo cuesta. Todo lo grande se hace poco a poco.",
      frase: { t: "Nada grande nace de repente, ni siquiera un racimo de uvas o un higo. Primero florece, luego da fruto y después madura.", autor: "Epicteto", obra: "Disertaciones, I, 15" },
      reto: "Elige algo que te cueste y practícalo solo cinco minutos hoy. Mañana, otros cinco.",
    },
    {
      bloque: 7,
      virtud: "templanza",
      titulo: "Solo un rato más",
      historia:
        "Pablo iba a jugar a la consola «solo un rato» después de comer. Cuando levanta la vista, es de noche, no ha hecho los deberes, le duele la cabeza y está de mal humor.",
      pregunta: "¿Jugar a la consola es malo? ¿Dónde está el punto justo? ¿Qué le ayudaría a Pablo a parar a tiempo?",
      juego: {
        consigna: "¿Depende de Pablo?",
        opciones: DEPENDE,
        items: [
          { t: "Que los videojuegos estén hechos para no querer parar", r: "no", x: "Muchos están diseñados así a propósito. Por eso ayuda decidir antes de empezar." },
          { t: "Tener ganas de seguir jugando", r: "no" },
          { t: "Poner una alarma antes de empezar", r: "si" },
          { t: "Hacer primero los deberes", r: "si" },
          { t: "Apagar cuando suena la alarma", r: "si" },
        ],
      },
      idea: "Templanza no es no disfrutar: es disfrutar sin pasarse, sabiendo cuándo parar.",
      frase: { t: "Si quieres estar tranquilo, ocúpate de pocas cosas.", autor: "Marco Aurelio, citando a Demócrito", obra: "Meditaciones, IV, 24" },
      reto: "Elige una cosa que te cueste dejar (pantallas, chuches…) y decide, antes de empezar, cuándo vas a parar.",
    },
    {
      bloque: 7,
      virtud: "templanza",
      titulo: "La bandeja del banquete",
      historia:
        "En el comedor hay tarta de postre. Ismael está al final de la fila y ve que los primeros se sirven trozos enormes. Empieza a empujar y a protestar: «¡Que no va a quedar!».",
      pregunta: "¿Cómo se sentiría la fila si todos hicieran lo mismo que Ismael? ¿Y si todos cogieran solo lo justo?",
      juego: {
        consigna: "¿Depende de Ismael?",
        opciones: DEPENDE,
        items: [
          { t: "Su sitio en la fila", r: "no" },
          { t: "Cuánta tarta cogen los de delante", r: "no" },
          { t: "Esperar su turno sin empujar", r: "si" },
          { t: "Coger un trozo razonable cuando le toque", r: "si" },
          { t: "Decir con calma «dejad para los demás»", r: "si" },
        ],
      },
      idea: "La templanza es esperar tu turno y coger lo justo, pensando también en los que vienen detrás.",
      frase: {
        t: "Compórtate en la vida como en un banquete. Cuando la bandeja llegue a ti, alarga la mano y sírvete con moderación. Si pasa de largo, no la detengas. Si todavía no ha llegado, espera.",
        autor: "Epicteto",
        obra: "Enquiridión, 15",
      },
      reto: "Hoy, en una fila o en un juego, deja pasar primero a alguien.",
    },

    // ---------------- Bloque 4 · Convivir en la gran ciudad ----------------
    {
      bloque: 9,
      virtud: "justicia",
      titulo: "Ciudadanos del mundo",
      historia:
        "Este trimestre ha llegado a clase Amina, que viene de otro país y todavía habla poco español. En el recreo se queda junto a la valla, mirando cómo juegan los demás.",
      pregunta: "¿Cómo te sentirías tú en un cole nuevo, en otro país, sin entender casi nada? ¿Qué podría hacer la clase?",
      juego: {
        consigna: "¿Depende de la clase?",
        opciones: DEPENDE,
        items: [
          { t: "Que Amina lo entienda todo desde el primer día", r: "no" },
          { t: "Que eche de menos su casa", r: "no" },
          { t: "Aprender a decir «hola» en su idioma", r: "si" },
          { t: "Invitarla a un juego que no necesite muchas palabras", r: "si" },
          { t: "Explicarle las normas despacio y con gestos", r: "si" },
        ],
      },
      idea: "Los estoicos se sentían «ciudadanos del mundo»: cualquier persona, venga de donde venga, forma parte de nuestra gran ciudad.",
      frase: { t: "Como Antonino, mi ciudad y mi patria es Roma. Como ser humano, es el mundo entero.", autor: "Marco Aurelio (Antonino era su nombre de emperador)", obra: "Meditaciones, VI, 44" },
      reto: "Aprende hoy a decir «hola» o «gracias» en otro idioma que se hable en tu clase o en tu barrio.",
    },
    {
      bloque: 8,
      virtud: "justicia",
      titulo: "Perdonar no es aguantar",
      historia:
        "Rocío y Vera se pelearon ayer porque Vera contó un secreto de Rocío. Hoy Vera le ha pedido perdón. Rocío no sabe qué hacer: sigue dolida, pero la echa de menos.",
      pregunta: "¿Perdonar significa hacer como si no hubiera pasado nada? ¿Qué necesita Rocío para volver a confiar?",
      juego: {
        consigna: "¿Depende de Rocío?",
        opciones: DEPENDE,
        items: [
          { t: "Lo que hizo Vera ayer", r: "no" },
          { t: "Que Vera no lo vuelva a hacer", r: "no" },
          { t: "Seguir dolida un tiempo", r: "parte", x: "Es normal. Las heridas tardan un poco en cerrarse." },
          { t: "Decirle a Vera cómo se sintió", r: "si" },
          { t: "Aceptar sus disculpas", r: "si" },
        ],
      },
      nota: "Perdonar no es aguantar. Si alguien te hace daño una y otra vez, eso se cuenta a un adulto.",
      idea: "Todos nos equivocamos. Perdonar es dar a alguien la oportunidad de hacerlo mejor, sin dejar de cuidarte tú.",
      frase: { t: "Es propio del ser humano querer incluso a quienes se equivocan.", autor: "Marco Aurelio", obra: "Meditaciones, VII, 22" },
      reto: "Si tienes algo pendiente con alguien, dale la oportunidad de arreglarlo.",
    },
    {
      bloque: 9,
      virtud: "sabiduria",
      titulo: "De mi abuelo aprendí…",
      historia:
        "Marco Aurelio, el hombre más poderoso de su tiempo, empezó su libro de una forma curiosa: escribiendo lo que había aprendido de cada persona importante de su vida. De su abuelo, el buen carácter. De su madre, la generosidad y a vivir con sencillez.",
      pregunta: "¿Qué has aprendido tú de alguien de tu familia, de un amigo o amiga, o de un maestro o maestra?",
      juego: {
        consigna: "¿Depende de mí?",
        opciones: DEPENDE,
        items: [
          { t: "Las personas que me han tocado en la vida", r: "no" },
          { t: "Que todas sean perfectas", r: "no" },
          { t: "Fijarme en lo bueno que tienen", r: "si" },
          { t: "Decirles «gracias»", r: "si" },
          { t: "Aprender también de sus errores", r: "si" },
        ],
      },
      idea: "Agradecer es darte cuenta de todo lo que has recibido de los demás. Nos hace más felices y más justos.",
      frase: { t: "De mi abuelo Vero aprendí el buen carácter y a no dejarme llevar por el mal genio.", autor: "Marco Aurelio", obra: "Meditaciones, I, 1" },
      reto: "Escribe como Marco Aurelio: «De … aprendí …». Hazlo con tres personas.",
    },
    {
      bloque: 11,
      virtud: "sabiduria",
      titulo: "El repaso de la noche",
      historia:
        "Cada noche, cuando se apagaba la luz, Séneca repasaba su día entero: qué había hecho bien, en qué se había equivocado y qué podía mejorar. Decía que, después de ese repaso, dormía mucho más tranquilo.",
      pregunta: "¿Por qué crees que repasar el día ayudaba a Séneca a dormir mejor? ¿Qué pondrías tú en el repaso de hoy?",
      juego: {
        consigna: "¿Depende de mí?",
        opciones: DEPENDE,
        items: [
          { t: "Lo que ya ha pasado hoy", r: "no" },
          { t: "Que mañana todo salga bien", r: "no" },
          { t: "Aprender de lo que ha pasado", r: "si" },
          { t: "Pedir perdón mañana si hoy hice daño a alguien", r: "si" },
          { t: "Tratarme con amabilidad cuando me equivoco", r: "si" },
        ],
      },
      idea: "Repasar el día con amabilidad, sin castigarte, te ayuda a aprender y a empezar mañana con calma.",
      frase: { t: "Cuando se apaga la luz, repaso mi día entero y vuelvo a mirar lo que he hecho y dicho. No me escondo nada.", autor: "Séneca", obra: "Sobre la ira, III, 36" },
      reto: "Esta noche prueba el diario de la Ciudadela: tres preguntas, tres minutos.",
    },
  ];

  // Se añaden las sesiones de js/sesiones/*.js (cargados antes que este
  // archivo) y se ordenan por bloque. El orden es estable: dentro de
  // cada bloque van primero las de este archivo y luego las demás, en
  // el orden en que están escritas.
  var todas = SESIONES.concat(window.CIUDADELA_NUEVAS || []);
  todas = todas
    .map(function (s, i) { return { s: s, i: i }; })
    .sort(function (a, b) { return a.s.bloque - b.s.bloque || a.i - b.i; })
    .map(function (x) { return x.s; });

  function slug(t) {
    return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  todas.forEach(function (s, i) {
    s.num = i + 1;
    // El id no cambia aunque se inserten sesiones nuevas: es lo que se
    // guarda como "hecha" y como "sesión actual".
    s.id = slug(s.titulo);
    if (s.juego && !s.juego.opciones) s.juego.opciones = TIPOS[s.juego.tipo] || DEPENDE;
  });

  window.CIUDADELA_SESIONES = { BLOQUES: BLOQUES, SESIONES: todas, TIPOS: TIPOS };
})();
