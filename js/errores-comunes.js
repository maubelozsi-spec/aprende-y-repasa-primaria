// ============================================================
// Errores ortográficos comunes: banco de datos + lógica del quiz
// ============================================================

// ------------------------------------------------------------
// Parejas que se confunden (según la Ortografía de la RAE, 2010).
// Cada forma: qué es, para qué se usa y, si lo hay, un truco de
// sustitución («sust»): si al cambiarla la frase sigue teniendo
// sentido, es esa forma.
// ------------------------------------------------------------
const PAREJAS_EC = {
  porque: {
    nombre: "Porque / por qué / porqué",
    formas: [
      { f: "porque", que: "Da la causa o responde a una pregunta. Una sola palabra, sin tilde.", para: "dar la causa o responder a una pregunta", sust: "ya que" },
      { f: "por qué", que: "Sirve para preguntar, con signos (¿Por qué...?) o sin ellos (No sé por qué...). Dos palabras, con tilde.", para: "preguntar, con o sin signos de interrogación", sust: "por qué motivo" },
      { f: "porqué", que: "Es un nombre: significa «el motivo». Va detrás de el, un, los... Una palabra, con tilde.", para: "nombrar el motivo de algo (va detrás de el o un)", sust: "motivo" },
    ],
    truco: "Si puedes cambiarlo por «ya que», es porque. Si pregunta («por qué motivo»), es por qué. Si va detrás de el o un y significa «motivo», es porqué.",
  },
  aver: {
    nombre: "A ver / haber",
    formas: [
      { f: "a ver", que: "Es la preposición a + el verbo ver: mirar, comprobar, esperar a saber algo.", para: "mirar, comprobar o esperar a saber algo", sust: "a mirar" },
      { f: "haber", que: "Es el verbo haber: indica que algo existe (debe de haber una solución) o va delante de un participio (podrías haber avisado).", para: "decir que algo existe o ir delante de un participio (-ado, -ido)" },
    ],
    truco: "Si puedes cambiarlo por «a mirar» o «a comprobar», es a ver. Si es un verbo (existir) o va delante de una palabra en -ado, -ido, es haber.",
  },
  hay: {
    nombre: "Hay / ahí / ay",
    formas: [
      { f: "hay", que: "Es del verbo haber: dice que algo existe.", para: "decir que algo existe" },
      { f: "ahí", que: "Indica un lugar: «en ese sitio».", para: "señalar un lugar", sust: "en ese sitio" },
      { f: "ay", que: "Es una exclamación de dolor, susto o pena.", para: "quejarse o asustarse (es una exclamación)", sust: "uy" },
    ],
    truco: "Ahí es un lugar (en ese sitio). Ay es un grito (¡uy!). Hay dice que algo existe (hay = existe).",
  },
  sino: {
    nombre: "Sino / si no",
    formas: [
      { f: "sino", que: "Une dos ideas opuestas, casi siempre después de un no: «no..., sino...». Una sola palabra.", para: "oponer dos ideas después de un no (no esto, sino aquello)" },
      { f: "si no", que: "Es una condición: si + no. Se puede meter una palabra en medio (si tú no, si acaso no).", para: "poner una condición negativa", sust: "si acaso no" },
    ],
    truco: "Si puedes meter una palabra en medio (si tú no, si acaso no), es una condición: si no. Si no cabe nada en medio y opone dos ideas, es sino.",
  },
  tambien: {
    nombre: "También / tan bien",
    formas: [
      { f: "también", que: "Significa «además» o «igualmente».", para: "decir «además» o «igualmente»", sust: "además" },
      { f: "tan bien", que: "Es tan + bien: dice lo bien que se hace algo. Su contrario es «tan mal».", para: "decir lo bien que se hace algo (lo contrario de «tan mal»)", sust: "tan mal" },
    ],
    truco: "Cámbialo por «tan mal»: si la frase tiene sentido (aunque diga lo contrario), es tan bien. Si significa «además», es también.",
  },
  aun: {
    nombre: "Aún / aun",
    formas: [
      { f: "aún", que: "Con tilde significa «todavía».", para: "decir «todavía»", sust: "todavía" },
      { f: "aun", que: "Sin tilde significa «incluso» o «ni siquiera» (ni aun).", para: "decir «incluso»", sust: "incluso" },
    ],
    truco: "Si puedes cambiarlo por «todavía», lleva tilde: aún. Si puedes cambiarlo por «incluso», no la lleva: aun.",
  },
  halla: {
    nombre: "Halla / haya",
    formas: [
      { f: "halla", que: "Es del verbo hallar: encontrar.", para: "decir que alguien encuentra algo (verbo hallar)", sust: "encuentra" },
      { f: "haya", que: "Es del verbo haber (que haya, ojalá haya...). También es el nombre de un árbol.", para: "el verbo haber en frases como «que haya» u «ojalá haya»" },
    ],
    truco: "Si puedes cambiarlo por «encuentra», es halla (de hallar). Si no, es haya (de haber).",
  },
  yeo: {
    nombre: "Y/e, o/u",
    formas: [
      { f: "y", que: "Es la conjunción normal para unir." },
      { f: "e", que: "Sustituye a y delante de una palabra que empieza por el sonido i (i-, hi-): Diana e Irene, padres e hijos." },
      { f: "o", que: "Es la conjunción normal para elegir entre dos cosas." },
      { f: "u", que: "Sustituye a o delante de una palabra que empieza por el sonido o (o-, ho-): siete u ocho, ayer u hoy." },
    ],
    truco: "Escucha cómo empieza la palabra siguiente: si suena i, se usa e; si suena o, se usa u. Cuidado: hie- suena «ye», así que se dice agua y hielo.",
  },
};

const MODOS_EC = Object.keys(PAREJAS_EC);
const MODOS_ACS_EC = ["hay", "tambien", "aver"];
const NIVELES_EC = { acs: ["base"], normal: ["base", "normal"], altas: ["base", "normal", "altas"] };

// Frases: [modo, frase con ___, forma correcta (tal como se escribe ahí),
// explicación, nivel, opciones propias (opcional), sinPrueba (opcional:
// el truco de sustitución no funciona en esa frase)].
const FRASES_EC = [
  // porque / por qué / porqué
  ["porque", "No vino a clase ___ estaba enfermo.", "porque", "Da la causa: «no vino ya que estaba enfermo».", "base"],
  ["porque", "¿___ no viniste ayer a la excursión?", "Por qué", "Es una pregunta: «¿por qué motivo no viniste?».", "base"],
  ["porque", "Llegamos tarde ___ había mucho tráfico.", "porque", "Da la causa del retraso: «ya que había mucho tráfico».", "base"],
  ["porque", "¿___ llora el bebé?", "Por qué", "Es una pregunta: lleva signos de interrogación.", "base"],
  ["porque", "Me abrigo ___ hace mucho frío.", "porque", "Da la causa: «ya que hace mucho frío».", "base"],
  ["porque", "Nadie entendía el ___ de su enfado.", "porqué", "Va detrás de «el» y significa «el motivo»: es un nombre.", "normal"],
  ["porque", "Dime ___ estás tan contento hoy.", "por qué", "Es una pregunta sin signos (indirecta): «dime por qué motivo estás contento».", "normal"],
  ["porque", "No entendemos el ___ de tu decisión.", "porqué", "«El porqué» es «el motivo»: es un nombre y va con «el».", "normal"],
  ["porque", "No sé ___ se ha ido tan pronto.", "por qué", "Es una pregunta indirecta: «no sé por qué motivo se ha ido».", "normal"],
  ["porque", "—¿Por qué te ríes? —___ me has contado un chiste.", "Porque", "Responde a la pregunta dando la causa.", "normal"],
  ["porque", "Explícame ___ has elegido ese libro.", "por qué", "Pregunta indirecta: «explícame por qué motivo».", "normal"],
  ["porque", "Se cayó ___ el suelo estaba mojado.", "porque", "Da la causa de la caída: «ya que el suelo estaba mojado».", "normal"],
  ["porque", "Quiero saber el ___ de tantas prisas.", "porqué", "Va detrás de «el» y significa «el motivo».", "normal"],
  ["porque", "Me explicó todos los ___ de su decisión.", "porqués", "Es el nombre porqué en plural: «los motivos».", "altas", ["porqués", "porques", "por qués"], true],
  ["porque", "No entiendo ___ el agua del mar es salada.", "por qué", "Es una pregunta indirecta, aunque no lleve signos.", "altas"],
  ["porque", "Sin un ___ claro, nadie le creyó.", "porqué", "Va detrás de «un» y significa «un motivo».", "altas"],
  ["porque", "—¿Por qué no me llamaste? —___ me quedé sin batería.", "Porque", "Es la respuesta: da la causa, así que va junto y sin tilde.", "altas"],

  // a ver / haber
  ["aver", "Vamos ___ qué pasa en el jardín.", "a ver", "Es «vamos a mirar qué pasa»: a + ver.", "base"],
  ["aver", "Voy ___ si encuentro las llaves.", "a ver", "Es «voy a comprobar si encuentro las llaves».", "base"],
  ["aver", "Tiene que ___ alguien en casa.", "haber", "Es el verbo haber: «tiene que existir alguien».", "base"],
  ["aver", "¡___ quién llega primero a la meta!", "A ver", "Expresa que esperamos a saber algo: «vamos a ver».", "base", null, true],
  ["aver", "Debe de ___ una solución fácil.", "haber", "Es el verbo haber: «debe de existir una solución».", "normal"],
  ["aver", "Puede ___ más de cien invitados en la boda.", "haber", "Es el verbo haber: dice cuántos invitados existen.", "normal"],
  ["aver", "___, ¿quién ha cogido mi lápiz?", "A ver", "Es «vamos a ver»: queremos comprobar quién fue.", "normal", null, true],
  ["aver", "Podrías ___ avisado antes.", "haber", "Va delante de un participio (avisado): es el verbo haber.", "normal", null, true],
  ["aver", "Fuimos al cine ___ la última película de dragones.", "a ver", "Fuimos a + ver la película: «a mirar la película».", "normal"],
  ["aver", "Va a ___ tormenta esta tarde.", "haber", "Es el verbo haber: dice que habrá tormenta.", "normal", null, true],
  ["aver", "Después de ___ comido, nos fuimos al parque.", "haber", "Va delante de un participio (comido): es el verbo haber.", "normal", null, true],
  ["aver", "¡___ venido antes!", "Haber", "Es un reproche con un participio (venido): «tenías que haber venido antes».", "altas", null, true],
  ["aver", "___ si mañana te portas mejor.", "A ver", "Expresa un deseo: «a ver si...».", "altas", null, true],
  ["aver", "Me gustaría ___ estado en ese concierto.", "haber", "Va delante de un participio (estado): es el verbo haber.", "altas", null, true],

  // hay / ahí / ay
  ["hay", "___ mucha gente en el mercado hoy.", "Hay", "Dice que existe mucha gente: es del verbo haber.", "base"],
  ["hay", "Deja el libro ___, encima de la mesa.", "ahí", "Señala un lugar: «déjalo en ese sitio».", "base"],
  ["hay", "¡___, me he hecho daño en el dedo!", "Ay", "Es un grito de dolor: «¡uy!».", "base"],
  ["hay", "No ___ nadie en la biblioteca a esta hora.", "hay", "Dice que no existe nadie allí: es del verbo haber.", "base"],
  ["hay", "¿Cuántos cachorros ___ en el establo?", "hay", "Pregunta cuántos cachorros existen: es del verbo haber.", "base"],
  ["hay", "El gato se escondió ___ detrás.", "ahí", "Señala un lugar: «en ese sitio, detrás».", "normal", null, true],
  ["hay", "¡___, qué susto me has dado!", "Ay", "Es una exclamación de susto.", "normal"],
  ["hay", "___ está el problema: no leímos bien el enunciado.", "Ahí", "Señala dónde está el problema: «en ese sitio».", "normal", null, true],
  ["hay", "En mi clase ___ veinticinco alumnos.", "hay", "Dice cuántos alumnos existen: es del verbo haber.", "normal"],
  ["hay", "Ponte ___, al lado de la ventana.", "ahí", "Señala un lugar: «ponte en ese sitio».", "normal"],
  ["hay", "¡___, se me ha olvidado la mochila!", "Ay", "Es una exclamación de pena o susto.", "normal"],
  ["hay", "De aquí a ___ hay muy poca distancia.", "ahí", "Señala un lugar: «de aquí a ese sitio». (El otro hay de la frase es del verbo haber).", "altas", null, true],
  ["hay", "___ que estudiar un poco todos los días.", "Hay", "«Hay que» es del verbo haber: indica obligación.", "altas"],
  ["hay", "Oímos un «___» y vimos que se había caído.", "ay", "Aquí «ay» es el grito de dolor, usado como nombre: «un ay».", "altas", null, true],

  // sino / si no
  ["sino", "No quiero té, ___ café.", "sino", "Opone dos ideas después de un no: no té, sino café.", "base"],
  ["sino", "___ terminas los deberes, no podrás salir a jugar.", "Si no", "Es una condición: «si tú no terminas...».", "base"],
  ["sino", "___ llueve mañana, iremos de excursión.", "Si no", "Es una condición: «si acaso no llueve...».", "base"],
  ["sino", "No es rojo, ___ naranja.", "sino", "Opone dos ideas después de un no: no rojo, sino naranja.", "base"],
  ["sino", "No fue Hugo, ___ Nora quien lo hizo.", "sino", "Opone dos ideas: no fue Hugo, sino Nora. Fíjate en la coma.", "normal"],
  ["sino", "No es que no quiera, ___ que no puedo.", "sino", "Opone dos ideas: «no..., sino que...».", "normal"],
  ["sino", "Avísame ___ vienes a la fiesta.", "si no", "Es una condición: «avísame si acaso no vienes».", "normal"],
  ["sino", "No solo canta, ___ que también baila.", "sino", "«No solo..., sino (que) también...» suma dos ideas; va junto.", "normal"],
  ["sino", "¿Qué haremos ___ encontramos el camino?", "si no", "Es una condición: «si acaso no encontramos el camino».", "normal"],
  ["sino", "Llévate el paraguas ___ quieres mojarte.", "si no", "Es una condición: «si tú no quieres mojarte».", "normal"],
  ["sino", "No hace ___ quejarse todo el día.", "sino", "«No hace sino quejarse» significa «solo hace quejarse»: va junto.", "altas"],
  ["sino", "Abrígate; ___, te resfriarás.", "si no", "Significa «si no te abrigas»: es una condición, va separado.", "altas", null, true],
  ["sino", "Creía que su ___ era ser marinero.", "sino", "Aquí «sino» es un nombre: significa «destino».", "altas", null, true],

  // también / tan bien
  ["tambien", "A mí ___ me gusta el chocolate.", "también", "Significa «además, igualmente».", "base"],
  ["tambien", "Canta ___ que parece profesional.", "tan bien", "Dice lo bien que canta; su contrario sería «canta tan mal».", "base", null, true],
  ["tambien", "Yo ___ quiero venir a la excursión.", "también", "Significa «igualmente»: yo además quiero venir.", "base"],
  ["tambien", "Juega al fútbol ___ como su hermano mayor.", "tan bien", "Compara lo bien que juegan: «tan bien como...».", "normal"],
  ["tambien", "Nora ___ sabe montar en bici.", "también", "Significa «además»: Nora además sabe montar.", "normal"],
  ["tambien", "Lo explicó ___ que todos lo entendieron.", "tan bien", "Dice lo bien que lo explicó; podría ser «tan mal que nadie lo entendió».", "normal", null, true],
  ["tambien", "Mañana ___ habrá clase de música.", "también", "Significa «además, igualmente».", "normal"],
  ["tambien", "Nunca había comido ___ como en tu casa.", "tan bien", "Dice lo bien que comió: lo contrario sería «tan mal».", "normal"],
  ["tambien", "Trae el estuche y ___ la regla.", "también", "Significa «además»: trae el estuche y además la regla.", "normal"],
  ["tambien", "Pocas veces me lo he pasado ___.", "tan bien", "Dice lo bien que se lo pasó: lo contrario sería «tan mal».", "altas"],
  ["tambien", "No solo aprobó Hugo; ___ aprobó Nora.", "también", "Significa «igualmente»: Nora aprobó igual que Hugo.", "altas"],

  // aún / aun
  ["aun", "___ no ha llegado el autobús.", "Aún", "Significa «todavía»: lleva tilde.", "base"],
  ["aun", "___ es de día, pero pronto oscurecerá.", "Aún", "Significa «todavía es de día»: lleva tilde.", "base"],
  ["aun", "Iré a la fiesta, ___ si llueve.", "aun", "Significa «incluso si llueve»: sin tilde.", "normal"],
  ["aun", "Terminó el trabajo ___ estando enfermo.", "aun", "Significa «incluso estando enfermo»: sin tilde.", "normal"],
  ["aun", "¿___ sigues despierto a estas horas?", "Aún", "Significa «¿todavía sigues despierto?»: lleva tilde.", "normal"],
  ["aun", "Le gustan todos los animales, ___ las arañas.", "aun", "Significa «incluso las arañas»: sin tilde.", "normal"],
  ["aun", "Este ejercicio es ___ más fácil que el anterior.", "aún", "Significa «todavía más fácil»: lleva tilde.", "normal"],
  ["aun", "Ni ___ corriendo llegaremos a tiempo.", "aun", "«Ni aun» significa «ni siquiera, ni incluso»: sin tilde.", "normal", null, true],
  ["aun", "___ así, no consiguió abrir la puerta.", "Aun", "«Aun así» significa «incluso así»: sin tilde.", "altas"],
  ["aun", "La película fue ___ mejor de lo que esperaba.", "aún", "Significa «todavía mejor»: lleva tilde.", "altas"],
  ["aun", "Ni ___ los mejores lo consiguieron.", "aun", "«Ni aun» significa «ni siquiera»: sin tilde.", "altas", null, true],

  // halla / haya
  ["halla", "El explorador ___ un tesoro escondido.", "halla", "Es del verbo hallar: «el explorador encuentra un tesoro».", "base"],
  ["halla", "Espero que Hugo ___ terminado los deberes.", "haya", "Es del verbo haber: «que haya terminado».", "base"],
  ["halla", "No creo que ___ ningún problema con el plan.", "haya", "Es del verbo haber: «que haya» = que exista.", "normal"],
  ["halla", "Por fin se ___ la solución del misterio.", "halla", "Es del verbo hallar: «por fin se encuentra la solución».", "normal"],
  ["halla", "Ojalá ___ traído el paraguas.", "haya", "Es del verbo haber, delante de un participio (traído).", "normal"],
  ["halla", "El pueblo se ___ al pie de la montaña.", "halla", "Es del verbo hallar: «el pueblo se encuentra al pie de la montaña».", "normal"],
  ["halla", "Cuando ___ terminado la película, recogeremos.", "haya", "Es del verbo haber, delante de un participio (terminado).", "normal"],
  ["halla", "Cuando el detective ___ una pista, la apunta.", "halla", "Es del verbo hallar: «cuando encuentra una pista».", "altas"],
  ["halla", "Es posible que ___ nevado en la sierra.", "haya", "Es del verbo haber, delante de un participio (nevado).", "altas"],
  ["halla", "Nos sentamos a la sombra de aquella ___.", "haya", "Aquí haya es el nombre de un árbol. Halla es de hallar y aya era la mujer que cuidaba a los niños.", "altas", ["haya", "halla", "aya"], true],
  ["halla", "Aquella ___ cuidaba de los hijos del rey.", "aya", "El aya era la mujer que cuidaba y educaba a los niños de una familia. Se escribe sin h.", "altas", ["aya", "haya", "halla"], true],

  // y/e, o/u
  ["yeo", "Diana ___ Irene son hermanas.", "e", "Irene empieza por el sonido i: y cambia a e.", "base"],
  ["yeo", "Pablo ___ Marta cocinaron juntos.", "y", "Marta no empieza por el sonido i: se usa y.", "base"],
  ["yeo", "Llegarán siete ___ ocho invitados.", "u", "Ocho empieza por el sonido o: o cambia a u.", "base"],
  ["yeo", "¿Prefieres plata ___ oro?", "u", "Oro empieza por el sonido o: o cambia a u.", "base"],
  ["yeo", "Padres ___ hijos disfrutaron del espectáculo.", "e", "Hijos empieza por el sonido i (la h no suena): y cambia a e.", "normal"],
  ["yeo", "¿Quién ganó, Vicente ___ Óscar?", "u", "Óscar empieza por el sonido o: o cambia a u.", "normal"],
  ["yeo", "¿Vendrás mañana ___ hoy?", "u", "Hoy empieza por el sonido o (la h no suena): o cambia a u.", "normal"],
  ["yeo", "Compré agujas ___ hilo.", "e", "Hilo empieza por el sonido i (la h no suena): y cambia a e.", "normal"],
  ["yeo", "Estudiamos geografía ___ historia.", "e", "Historia empieza por el sonido i: y cambia a e.", "normal"],
  ["yeo", "¿Lo pinto de verde ___ de amarillo?", "o", "De no empieza por el sonido o: se usa o.", "normal"],
  ["yeo", "Tardaremos una ___ dos horas.", "o", "Dos no empieza por el sonido o: se usa o.", "normal"],
  ["yeo", "Leímos cuentos ___ poemas.", "y", "Poemas no empieza por el sonido i: se usa y.", "normal"],
  ["yeo", "Pusimos agua ___ hielo en la jarra.", "y", "Hielo empieza por hie-, que suena «ye», no «i»: se mantiene la y.", "altas"],
  ["yeo", "En el prado había flores ___ hierba.", "y", "Hierba empieza por hie-, que suena «ye»: se mantiene la y.", "altas"],
  ["yeo", "¿___ Irene? ¿No viene hoy?", "Y", "Al empezar una pregunta, la y se mantiene aunque la palabra siguiente empiece por i.", "altas"],
  ["yeo", "Habrá diez ___ once niños en la fiesta.", "u", "Once empieza por el sonido o: o cambia a u.", "altas"],
  ["yeo", "Belén ___ Inmaculada son primas.", "e", "Inmaculada empieza por el sonido i: y cambia a e.", "altas"],
].map(([modo, frase, ok, por, nivel, opciones, sinPrueba]) => ({ modo, frase, ok, por, nivel, opciones: opciones || null, sinPrueba: !!sinPrueba }));

// Palabras para «¿qué conjunción va delante?»: [palabra, conjunción, nivel]
const DELANTE_EC = [
  ["Irene", "e", "base"], ["isla", "e", "base"], ["hijos", "e", "base"], ["Inés", "e", "normal"], ["iglesia", "e", "normal"], ["hilo", "e", "normal"], ["idea", "e", "normal"], ["invierno", "e", "normal"], ["historia", "e", "normal"], ["imán", "e", "normal"],
  ["Ana", "y", "base"], ["Marta", "y", "base"], ["Elena", "y", "normal"], ["uvas", "y", "normal"], ["hielo", "y", "altas"], ["hierba", "y", "altas"], ["hiena", "y", "altas"], ["hierro", "y", "altas"],
  ["ocho", "u", "base"], ["oro", "u", "base"], ["hoy", "u", "base"], ["Óscar", "u", "normal"], ["otoño", "u", "normal"], ["hotel", "u", "normal"], ["hormiga", "u", "normal"], ["ojos", "u", "normal"], ["once", "u", "altas"], ["horas", "u", "altas"],
  ["uno", "o", "base"], ["abeja", "o", "base"], ["agua", "o", "normal"], ["huevo", "o", "normal"], ["Úrsula", "o", "normal"], ["autobús", "o", "altas"],
].map(([palabra, conj, nivel]) => ({ palabra, conj, nivel }));

// ------------------------------------------------------------
// Utilidades
// ------------------------------------------------------------
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const mayusEC = (t) => t.charAt(0).toUpperCase() + t.slice(1);

// Opciones de una frase, con la misma mayúscula inicial que la respuesta.
function opcionesFraseEC(fr) {
  let ops = fr.opciones;
  if (!ops) {
    ops = PAREJAS_EC[fr.modo].formas.map((x) => x.f);
    if (fr.modo === "yeo") ops = /^[ye]$/i.test(fr.ok) ? ["y", "e"] : ["o", "u"];
  }
  const mayus = fr.ok.charAt(0) !== fr.ok.charAt(0).toLowerCase();
  return ops.map((o) => (mayus ? mayusEC(o) : o));
}

const formaDeEC = (fr) => PAREJAS_EC[fr.modo].formas.find((x) => x.f === fr.ok.toLowerCase());
const completaEC = (fr, txt) => fr.frase.replace("___", txt);
// Cita una frase entre comillas, con el punto final fuera: «...».
const citaEC = (t) => (/[.]$/.test(t) ? `«${t.slice(0, -1)}».` : `«${t}»`);

// La frase con el truco de sustitución, si funciona en ella.
function pruebaEC(fr) {
  const forma = formaDeEC(fr);
  if (!forma || !forma.sust || fr.sinPrueba) return "";
  const mayus = fr.ok.charAt(0) !== fr.ok.charAt(0).toLowerCase();
  return completaEC(fr, mayus ? mayusEC(forma.sust) : forma.sust);
}

function frasesEC(modo, niveles) {
  return FRASES_EC.filter((fr) => fr.modo === modo && niveles.includes(fr.nivel));
}

// ------------------------------------------------------------
// Generadores de preguntas
// ------------------------------------------------------------
function genFraseEC(modo, niveles) {
  const fr = pick(frasesEC(modo, niveles));
  const prueba = pruebaEC(fr);
  return {
    instruction: "Completa la frase con la forma correcta:",
    display: fr.frase,
    options: opcionesFraseEC(fr),
    correct: fr.ok,
    hint: PAREJAS_EC[modo].truco,
    explain: `${citaEC(completaEC(fr, `<strong>${fr.ok}</strong>`))} ${fr.por}${prueba ? ` Prueba: ${citaEC(prueba)}` : ""}`,
  };
}

function genUsoEC(modo) {
  const p = PAREJAS_EC[modo];
  const forma = pick(p.formas);
  return {
    instruction: "¿Qué forma se usa para esto?",
    display: mayusEC(forma.para) + ".",
    options: p.formas.map((x) => x.f),
    correct: forma.f,
    hint: p.truco,
    explain: `<strong>${forma.f}</strong>: ${forma.que}`,
  };
}

function genDelanteEC(niveles) {
  const d = pick(DELANTE_EC.filter((x) => niveles.includes(x.nivel)));
  const yE = d.conj === "y" || d.conj === "e";
  const motivo = {
    e: `«${d.palabra}» empieza por el sonido i, así que y cambia a e.`,
    u: `«${d.palabra}» empieza por el sonido o, así que o cambia a u.`,
    y: /^hie/i.test(d.palabra) ? `«${d.palabra}» empieza por hie-, que suena «ye» y no «i»: se mantiene la y.` : `«${d.palabra}» no empieza por el sonido i: se usa y.`,
    o: `«${d.palabra}» no empieza por el sonido o: se usa o.`,
  }[d.conj];
  return {
    instruction: yE ? "¿Qué conjunción va delante de esta palabra: y o e?" : "¿Qué conjunción va delante de esta palabra: o o u?",
    display: `… ___ ${d.palabra}`,
    options: yE ? ["y", "e"] : ["o", "u"],
    keepOrder: true,
    correct: d.conj,
    hint: PAREJAS_EC.yeo.truco,
    explain: motivo,
  };
}

function generadoresEC(modo, niveles) {
  if (modo === "yeo") return [(m, n) => genFraseEC(m, n), (m, n) => genDelanteEC(n)];
  return [(m, n) => genFraseEC(m, n), (m, n) => genFraseEC(m, n), (m) => genUsoEC(m)];
}

const ERRORES_DIFFICULTY_EXPLANATIONS = {
  acs: {
    badge: "ACS · 2 cursos de retraso",
    title: "Hay / ahí / ay, también / tan bien y a ver / haber (nivel simplificado)",
    text: "Para el alumnado con adaptación curricular significativa se trabajan solo las tres confusiones más fáciles de reconocer por su significado, con frases cortas y con el truco de sustituir: ahí = en ese sitio, ay = ¡uy!, tan bien = tan mal, a ver = a mirar.",
    example: "«Deja el libro ___, en la mesa» → ahí (en ese sitio)",
  },
  dislexia: {
    badge: "Dislexia",
    title: "Mismo nivel, lectura más cómoda",
    text: "Se mantiene el mismo contenido, pero con una tipografía más legible para leer las frases con el hueco.",
    example: "«Deja el libro ___» → ahí → misma actividad, más fácil de leer",
  },
  tdah: {
    badge: "TDAH · Dificultades de atención",
    title: "Un solo tipo de confusión cada vez",
    text: "Se practica sin el modo <strong>«Mezcla»</strong>, para no ir cambiando constantemente de tipo de confusión y mantener mejor la atención.",
    example: "Solo preguntas de «Porque / por qué» hasta que cambies de modo tú mismo",
  },
  discalculia: {
    badge: "Discalculia",
    title: "Mismo nivel que la clase",
    text: "La discalculia afecta al cálculo y al sentido del número, no a la lengua: aquí se practica el mismo contenido que el resto de la clase. Si además hay dificultades de lectura, usa la adaptación de dislexia.",
    example: "Mismas preguntas y mismos pasos que sin adaptación",
  },
  altas: {
    badge: "Altas capacidades",
    title: "Los casos difíciles",
    text: "Se añaden los casos que más cuestan: <strong>los porqués</strong>, ¡haber venido antes!, no hace sino..., aun así, el haya (árbol) y el aya, agua y hielo o ¿Y Irene?. Empieza en <strong>porque / por qué / porqué</strong>.",
    example: "«Pusimos agua ___ hielo» → y (hie- suena «ye»)",
  },
  disgrafia: {
    badge: "Disgrafía",
    title: "Ya se responde eligiendo, sin escribir",
    text: "Este juego ya funciona con botones de opción múltiple, así que no hace falta ningún cambio: solo hay que pulsar la respuesta correcta.",
    example: "Elige la forma correcta → elige entre las opciones",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  const restartCallbacks = [];
  const diff = initDifficultySelector("difficulty-select", (value) => {
    renderDifficultyBox("difficulty-box", value, ERRORES_DIFFICULTY_EXPLANATIONS);
    restartCallbacks.forEach((fn) => fn());
  });
  renderDifficultyBox("difficulty-box", diff.get(), ERRORES_DIFFICULTY_EXPLANATIONS);

  if (document.getElementById("ec-parejas")) initExplore();
  if (document.getElementById("word-display")) initGame(diff, (fn) => restartCallbacks.push(fn));
});

function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = {
    teoria: document.getElementById("tab-teoria"),
    explora: document.getElementById("tab-explora"),
    practica: document.getElementById("tab-practica"),
  };
  if (tabBtns.length === 0) return;

  function activateTab(name) {
    tabBtns.forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
    Object.entries(panels).forEach(([key, el]) => el && el.classList.toggle("active", key === name));
  }

  tabBtns.forEach((btn) => btn.addEventListener("click", () => activateTab(btn.dataset.tab)));

  ["go-to-practice", "go-to-practice-2"].forEach((id) => {
    const goBtn = document.getElementById(id);
    if (goBtn) goBtn.addEventListener("click", () => activateTab("practica"));
  });
}

// ============================================================
// EXPLORA: cada pareja con su truco, y probar el truco en frases
// ============================================================
function initExplore() {
  let modo = "porque";
  let frase = null;
  let ultima = "";
  const cont = document.getElementById("ec-parejas");
  cont.innerHTML = MODOS_EC.map((m) => `<button type="button" class="btn btn-secondary" data-ec="${m}">${PAREJAS_EC[m].nombre}</button>`).join("");

  function nuevaFrase() {
    const lista = frasesEC(modo, NIVELES_EC.normal).filter((fr) => fr.frase !== ultima);
    frase = pick(lista);
    ultima = frase.frase;
    document.getElementById("ec-frase").textContent = frase.frase;
    document.getElementById("ec-opciones").innerHTML = opcionesFraseEC(frase).map((o) => `<button type="button" class="syllable-chip" data-ec-op="${o}">${o}</button>`).join("");
    document.querySelectorAll("[data-ec-op]").forEach((b) => b.addEventListener("click", () => probar(b)));
    const msg = document.getElementById("ec-prueba-msg");
    msg.className = "md-msg";
    msg.innerHTML = "Elige una forma y mira si encaja.";
  }

  function probar(btn) {
    const op = btn.dataset.ecOp;
    const msg = document.getElementById("ec-prueba-msg");
    if (op === frase.ok) {
      document.querySelectorAll("[data-ec-op]").forEach((b) => (b.disabled = true));
      btn.classList.add("correct");
      const prueba = pruebaEC(frase);
      msg.className = "md-msg ok";
      msg.innerHTML = `<strong>Sí: ${frase.ok}.</strong> ${frase.por}${prueba ? `<br>Compruébalo con el truco: ${citaEC(prueba)}` : ""}`;
    } else {
      btn.classList.add("incorrect");
      btn.disabled = true;
      msg.className = "md-msg ko";
      msg.innerHTML = `<strong>«${op}» no encaja aquí.</strong> ${PAREJAS_EC[modo].truco}`;
    }
  }

  function render() {
    cont.querySelectorAll("[data-ec]").forEach((b) => b.classList.toggle("active", b.dataset.ec === modo));
    const p = PAREJAS_EC[modo];
    document.getElementById("ec-detalle").innerHTML = p.formas.map((x) => `<div class="td-col"><h4>${x.f}</h4><p>${x.que}</p>${x.sust ? `<p class="examples">Truco: se puede cambiar por «${x.sust}».</p>` : ""}</div>`).join("");
    document.getElementById("ec-truco").innerHTML = `<strong>Truco:</strong> ${p.truco}`;
    nuevaFrase();
  }

  cont.querySelectorAll("[data-ec]").forEach((b) => b.addEventListener("click", () => { modo = b.dataset.ec; render(); }));
  document.getElementById("ec-otra").addEventListener("click", nuevaFrase);
  render();
}

// ============================================================
// PRÁCTICA
// ============================================================
function initGame(diff, registerRestart) {
  const els = {
    card: document.getElementById("practica-errores"),
    modeBtns: document.querySelectorAll("#mode-picker [data-mode]"),
    instructions: document.getElementById("instructions"),
    wordDisplay: document.getElementById("word-display"),
    answerButtons: document.getElementById("answer-buttons"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-word"),
    hintBtn: document.getElementById("hint-btn"),
    hintBox: document.getElementById("hint-box"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
  };

  let scoreOk = 0;
  let scoreKo = 0;
  let mode = "porque";
  let current;
  let lastKey = "";

  function niveles() {
    if (diff.is("acs")) return NIVELES_EC.acs;
    if (diff.is("altas")) return NIVELES_EC.altas;
    return NIVELES_EC.normal;
  }

  function setActiveMode(m) {
    mode = m;
    els.modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === m));
  }

  function applyDifficultyUI() {
    const acs = diff.is("acs");
    els.modeBtns.forEach((b) => {
      const m = b.dataset.mode;
      b.disabled = (acs && m !== "mezcla" && !MODOS_ACS_EC.includes(m)) || (m === "mezcla" && diff.is("tdah"));
    });
    if (acs && mode !== "mezcla" && !MODOS_ACS_EC.includes(mode)) setActiveMode("hay");
    else if (diff.is("altas")) setActiveMode("porque");
    else if (diff.is("tdah") && mode === "mezcla") setActiveMode("porque");
    if (els.card) els.card.classList.toggle("difficulty-readable", diff.is("dislexia"));
  }

  registerRestart(() => {
    applyDifficultyUI();
    startRound();
  });

  function pickQuestion() {
    let q;
    let tries = 0;
    do {
      const modo = mode === "mezcla" ? pick(diff.is("acs") ? MODOS_ACS_EC : MODOS_EC) : mode;
      q = pick(generadoresEC(modo, niveles()))(modo, niveles());
      tries++;
    } while (q.display + q.correct === lastKey && tries < 10);
    lastKey = q.display + q.correct;
    return q;
  }

  function startRound() {
    current = pickQuestion();
    els.instructions.textContent = current.instruction;
    els.wordDisplay.textContent = current.display;

    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
    els.nextBtn.style.display = "none";
    els.hintBox.classList.remove("show");
    els.hintBox.innerHTML = "";
    els.hintBtn.disabled = false;

    els.answerButtons.innerHTML = "";
    (current.keepOrder ? current.options : shuffle(current.options)).forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "syllable-chip";
      btn.textContent = opt;
      btn.addEventListener("click", () => chooseAnswer(opt, btn));
      els.answerButtons.appendChild(btn);
    });
  }

  function chooseAnswer(chosen, btn) {
    const correct = current.correct;
    const isCorrect = chosen === correct;

    if (isCorrect) scoreOk++;
    else scoreKo++;
    AppProgress.record("errores-comunes", isCorrect);
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    els.answerButtons.querySelectorAll(".syllable-chip").forEach((b) => {
      b.disabled = true;
      if (b.textContent === correct) b.classList.add("correct");
      else if (b === btn && !isCorrect) b.classList.add("incorrect");
    });
    els.hintBtn.disabled = true;

    els.feedback.classList.add("show", isCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `<p class="feedback-title">${isCorrect ? "Correcto" : `No era esa: es «${correct}»`}</p><p>${current.explain}</p>`;
    els.nextBtn.style.display = "";
  }

  els.modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveMode(btn.dataset.mode);
      startRound();
    });
  });

  els.hintBtn.addEventListener("click", () => {
    els.hintBox.innerHTML = `<strong>Pista:</strong> ${current.hint}`;
    els.hintBox.classList.add("show");
  });
  els.nextBtn.addEventListener("click", startRound);

  applyDifficultyUI();
  startRound();
}

// ---------------- Ficha ----------------
// Frases para completar en papel, con la solución explicada.
function listaOpcionesEC(ops) {
  return ops.join(", ").replace(/, ([^,]*)$/, " o $1");
}
function fichaFrasesEC(modos, niveles) {
  return FRASES_EC.filter((fr) => modos.includes(fr.modo) && niveles.includes(fr.nivel)).map((fr) => {
    const opciones = opcionesFraseEC(fr);
    return { pregunta: `Completa con ${listaOpcionesEC(opciones)}: ${fr.frase}`, respuesta: `${fr.ok}. ${fr.por}`, opciones };
  });
}
const fichaModoEC = (pool) => ({ pool, field: "respuesta", question: (e) => e.pregunta, selfContained: true, answerFn: (e) => e.respuesta, optionsFn: (e) => e.opciones });

registerLenguaFicha("errores-comunes", {
  label: "Errores comunes",
  resumen: "Porque da la causa, por qué pregunta y el porqué es «el motivo». A ver es «a mirar»; haber es un verbo. Hay = existe, ahí = en ese sitio, ay = ¡uy! Si no es una condición (si tú no); sino opone dos ideas (no esto, sino aquello). También = además; tan bien es lo contrario de tan mal. Aún = todavía; aun = incluso. Halla = encuentra; haya es del verbo haber. Y cambia a e delante del sonido i (padres e hijos) y o cambia a u delante del sonido o (siete u ocho).",
  easyMode: "acs",
  altasMode: "altas",
  defaultMode: MODOS_EC.slice(),
  pools: {
    acs: fichaModoEC(fichaFrasesEC(MODOS_ACS_EC, NIVELES_EC.acs)),
    ...Object.fromEntries(MODOS_EC.map((m) => [m, fichaModoEC(fichaFrasesEC([m], NIVELES_EC.normal))])),
    altas: fichaModoEC(fichaFrasesEC(MODOS_EC, ["altas"])),
  },
});
