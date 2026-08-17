// ============================================================
// Inglés para Viajar — vocabulario imprescindible.
//
// Criterio de selección: solo entra lo que de verdad se usa en
// un viaje. Nada de listas de colores o animales: aquí están las
// palabras y frases cortas que resuelven una situación real.
//
// Cada entrada lleva:
//   en      -> la palabra o frase en inglés
//   es      -> su traducción
//   pron    -> cómo suena, escrito "a la española" (la sílaba
//              con tilde es la fuerte)
//   tema    -> para agrupar y para filtrar el repaso
//   nivel   -> 1 supervivencia, 2 habitual, 3 para salir de un lío
//   ejemplo -> una frase de uso, también con traducción
//
// Sobre la pronunciación figurada: es una aproximación, no una
// transcripción fonética. Dos convenios que conviene saber:
//   "z"  = la th sorda de "think" (como la z de "zapato")
//   "d"  = la th sonora de "the" (una d muy suave, entre dientes)
// ============================================================

export const TEMAS_VOCABULARIO = [
  { id: "cortesia", nombre: "Cortesía y supervivencia", icono: "🙏" },
  { id: "saludos", nombre: "Saludar y presentarse", icono: "👋" },
  { id: "numeros", nombre: "Números, horas y fechas", icono: "🔢" },
  { id: "aeropuerto", nombre: "Aeropuerto y vuelo", icono: "✈️" },
  { id: "llegada", nombre: "Pasaporte y aduana", icono: "🛂" },
  { id: "transporte", nombre: "Transporte y trayectos", icono: "🚇" },
  { id: "direcciones", nombre: "Preguntar direcciones", icono: "🧭" },
  { id: "hotel", nombre: "Hotel y alojamiento", icono: "🏨" },
  { id: "restaurante", nombre: "Restaurante y bar", icono: "🍽️" },
  { id: "compras", nombre: "Compras y dinero", icono: "🛍️" },
  { id: "salud", nombre: "Salud y farmacia", icono: "💊" },
  { id: "emergencias", nombre: "Problemas y emergencias", icono: "🚨" },
  { id: "turismo", nombre: "Turismo y ocio", icono: "📸" },
  { id: "conversar", nombre: "Charla y convivencia", icono: "💬" },
];

export const VOCABULARIO = [
  // ---------- cortesía y supervivencia ----------
  { id: "c01", en: "please", es: "por favor", pron: "plíis", tema: "cortesia", nivel: 1, ejemplo: { en: "Water, please.", es: "Agua, por favor." } },
  { id: "c02", en: "thank you", es: "gracias", pron: "zánk-iu", tema: "cortesia", nivel: 1, ejemplo: { en: "Thank you very much.", es: "Muchas gracias." } },
  { id: "c03", en: "you're welcome", es: "de nada", pron: "iór uélcom", tema: "cortesia", nivel: 1, ejemplo: { en: "— Thank you. — You're welcome.", es: "— Gracias. — De nada." } },
  { id: "c04", en: "sorry", es: "perdón / lo siento", pron: "sóri", tema: "cortesia", nivel: 1, ejemplo: { en: "Sorry, I don't understand.", es: "Perdón, no entiendo." } },
  { id: "c05", en: "excuse me", es: "disculpe (para llamar la atención)", pron: "ekskiús mi", tema: "cortesia", nivel: 1, ejemplo: { en: "Excuse me, where is the exit?", es: "Disculpe, ¿dónde está la salida?" } },
  { id: "c06", en: "yes / no", es: "sí / no", pron: "iés / nóu", tema: "cortesia", nivel: 1, ejemplo: { en: "Yes, please. No, thank you.", es: "Sí, por favor. No, gracias." } },
  { id: "c07", en: "I don't understand", es: "no entiendo", pron: "ai dóunt anderstánd", tema: "cortesia", nivel: 1, ejemplo: { en: "Sorry, I don't understand.", es: "Perdone, no entiendo." } },
  { id: "c08", en: "Could you repeat that, please?", es: "¿Puede repetirlo, por favor?", pron: "cud iu ripíit dat plíis", tema: "cortesia", nivel: 1, ejemplo: { en: "Could you repeat that, please? Slowly.", es: "¿Puede repetirlo, por favor? Despacio." } },
  { id: "c09", en: "more slowly, please", es: "más despacio, por favor", pron: "mor slóuli plíis", tema: "cortesia", nivel: 1, ejemplo: { en: "Can you speak more slowly, please?", es: "¿Puede hablar más despacio, por favor?" } },
  { id: "c10", en: "Do you speak Spanish?", es: "¿Habla español?", pron: "du iu spíik spánish", tema: "cortesia", nivel: 1, ejemplo: { en: "Excuse me, do you speak Spanish?", es: "Disculpe, ¿habla español?" } },
  { id: "c11", en: "I speak a little English", es: "hablo un poco de inglés", pron: "ai spíik a lítel ínglish", tema: "cortesia", nivel: 1, ejemplo: { en: "I speak a little English, sorry.", es: "Hablo un poco de inglés, lo siento." } },
  { id: "c12", en: "Can you help me?", es: "¿Puede ayudarme?", pron: "can iu jélp mi", tema: "cortesia", nivel: 1, ejemplo: { en: "Excuse me, can you help me?", es: "Disculpe, ¿puede ayudarme?" } },
  { id: "c13", en: "How do you say... in English?", es: "¿Cómo se dice... en inglés?", pron: "jáo du iu séi... in ínglish", tema: "cortesia", nivel: 2, ejemplo: { en: "How do you say 'sello' in English?", es: "¿Cómo se dice 'sello' en inglés?" } },
  { id: "c14", en: "What does it mean?", es: "¿Qué significa?", pron: "uót das it míin", tema: "cortesia", nivel: 2, ejemplo: { en: "Sorry, what does it mean?", es: "Perdone, ¿qué significa?" } },
  { id: "c15", en: "Just a moment", es: "un momento", pron: "yast a móument", tema: "cortesia", nivel: 1, ejemplo: { en: "Just a moment, please.", es: "Un momento, por favor." } },
  { id: "c16", en: "Of course", es: "por supuesto / claro", pron: "of córs", tema: "cortesia", nivel: 2, ejemplo: { en: "Of course, no problem.", es: "Por supuesto, sin problema." } },
  { id: "c17", en: "No problem", es: "sin problema", pron: "nóu próblem", tema: "cortesia", nivel: 1, ejemplo: { en: "No problem, take your time.", es: "Sin problema, tómese su tiempo." } },
  { id: "c18", en: "Can you write it down?", es: "¿Puede escribirlo?", pron: "can iu ráit it dáun", tema: "cortesia", nivel: 2, ejemplo: { en: "Can you write it down, please?", es: "¿Puede escribirlo, por favor?" } },

  // ---------- saludos y presentarse ----------
  { id: "s01", en: "hello / hi", es: "hola", pron: "jelóu / jái", tema: "saludos", nivel: 1, ejemplo: { en: "Hello! How are you?", es: "¡Hola! ¿Qué tal?" } },
  { id: "s02", en: "good morning", es: "buenos días", pron: "gud mórnin", tema: "saludos", nivel: 1, ejemplo: { en: "Good morning, sir.", es: "Buenos días, señor." } },
  { id: "s03", en: "good afternoon", es: "buenas tardes", pron: "gud afternúun", tema: "saludos", nivel: 1, ejemplo: { en: "Good afternoon, a table for two.", es: "Buenas tardes, una mesa para dos." } },
  { id: "s04", en: "good evening", es: "buenas tardes/noches (al llegar)", pron: "gud íivnin", tema: "saludos", nivel: 1, ejemplo: { en: "Good evening, I have a reservation.", es: "Buenas noches, tengo una reserva." } },
  { id: "s05", en: "goodbye / bye", es: "adiós", pron: "gudbái / bái", tema: "saludos", nivel: 1, ejemplo: { en: "Goodbye, have a nice day.", es: "Adiós, que tenga buen día." } },
  { id: "s06", en: "see you later", es: "hasta luego", pron: "síi iu léiter", tema: "saludos", nivel: 1, ejemplo: { en: "Thanks, see you later!", es: "Gracias, ¡hasta luego!" } },
  { id: "s07", en: "How are you?", es: "¿Cómo está?", pron: "jáo ar iu", tema: "saludos", nivel: 1, ejemplo: { en: "Hello, how are you?", es: "Hola, ¿cómo está?" } },
  { id: "s08", en: "I'm fine, thank you", es: "estoy bien, gracias", pron: "aim fáin zánk-iu", tema: "saludos", nivel: 1, ejemplo: { en: "I'm fine, thank you. And you?", es: "Estoy bien, gracias. ¿Y usted?" } },
  { id: "s09", en: "My name is...", es: "me llamo...", pron: "mai néim is", tema: "saludos", nivel: 1, ejemplo: { en: "My name is Carmen.", es: "Me llamo Carmen." } },
  { id: "s10", en: "Nice to meet you", es: "encantado de conocerle", pron: "náis tu míit iu", tema: "saludos", nivel: 1, ejemplo: { en: "Nice to meet you, John.", es: "Encantado de conocerte, John." } },
  { id: "s11", en: "I'm from Spain", es: "soy de España", pron: "aim from spéin", tema: "saludos", nivel: 1, ejemplo: { en: "I'm from Spain, from Seville.", es: "Soy de España, de Sevilla." } },
  { id: "s12", en: "Where are you from?", es: "¿de dónde es usted?", pron: "uér ar iu from", tema: "saludos", nivel: 1, ejemplo: { en: "And you? Where are you from?", es: "¿Y usted? ¿De dónde es?" } },
  { id: "s13", en: "Have a nice day", es: "que tenga un buen día", pron: "jav a náis déi", tema: "saludos", nivel: 2, ejemplo: { en: "Thank you, have a nice day.", es: "Gracias, que tenga un buen día." } },

  // ---------- números, horas y fechas ----------
  { id: "n01", en: "one, two, three", es: "uno, dos, tres", pron: "uán, tchu, zríi", tema: "numeros", nivel: 1, ejemplo: { en: "A table for three, please.", es: "Una mesa para tres, por favor." } },
  { id: "n02", en: "four, five, six", es: "cuatro, cinco, seis", pron: "fóor, fáiv, six", tema: "numeros", nivel: 1, ejemplo: { en: "Room five, on the first floor.", es: "Habitación cinco, en la primera planta." } },
  { id: "n03", en: "seven, eight, nine, ten", es: "siete, ocho, nueve, diez", pron: "séven, éit, náin, ten", tema: "numeros", nivel: 1, ejemplo: { en: "The bus leaves at ten.", es: "El autobús sale a las diez." } },
  { id: "n04", en: "twenty / thirty / fifty", es: "veinte / treinta / cincuenta", pron: "tuénti / zérti / fífti", tema: "numeros", nivel: 1, ejemplo: { en: "It's thirty euros.", es: "Son treinta euros." } },
  { id: "n05", en: "a hundred", es: "cien", pron: "a jándred", tema: "numeros", nivel: 2, ejemplo: { en: "That's a hundred and twenty.", es: "Eso son ciento veinte." } },
  { id: "n06", en: "What time is it?", es: "¿qué hora es?", pron: "uót táim is it", tema: "numeros", nivel: 1, ejemplo: { en: "Excuse me, what time is it?", es: "Disculpe, ¿qué hora es?" } },
  { id: "n07", en: "at half past seven", es: "a las siete y media", pron: "at jaf past séven", tema: "numeros", nivel: 2, ejemplo: { en: "Breakfast is at half past seven.", es: "El desayuno es a las siete y media." } },
  { id: "n08", en: "a quarter past / to", es: "y cuarto / menos cuarto", pron: "a cuórter past / tu", tema: "numeros", nivel: 2, ejemplo: { en: "The train leaves at a quarter to nine.", es: "El tren sale a las nueve menos cuarto." } },
  { id: "n09", en: "today / tomorrow", es: "hoy / mañana", pron: "tudéi / tumórou", tema: "numeros", nivel: 1, ejemplo: { en: "I'm leaving tomorrow morning.", es: "Me voy mañana por la mañana." } },
  { id: "n10", en: "yesterday", es: "ayer", pron: "iésterdei", tema: "numeros", nivel: 2, ejemplo: { en: "I arrived yesterday.", es: "Llegué ayer." } },
  { id: "n11", en: "tonight", es: "esta noche", pron: "tunáit", tema: "numeros", nivel: 2, ejemplo: { en: "Is it open tonight?", es: "¿Está abierto esta noche?" } },
  { id: "n12", en: "Monday, Tuesday, Wednesday", es: "lunes, martes, miércoles", pron: "mándei, tiúsdei, uénsdei", tema: "numeros", nivel: 2, ejemplo: { en: "We arrive on Monday.", es: "Llegamos el lunes." } },
  { id: "n13", en: "the weekend", es: "el fin de semana", pron: "de uíikend", tema: "numeros", nivel: 2, ejemplo: { en: "It's closed at the weekend.", es: "Está cerrado el fin de semana." } },
  { id: "n14", en: "How long?", es: "¿cuánto tiempo?", pron: "jáo long", tema: "numeros", nivel: 2, ejemplo: { en: "How long does it take?", es: "¿Cuánto tiempo se tarda?" } },

  // ---------- aeropuerto y vuelo ----------
  { id: "a01", en: "flight", es: "vuelo", pron: "fláit", tema: "aeropuerto", nivel: 1, ejemplo: { en: "My flight is at six.", es: "Mi vuelo es a las seis." } },
  { id: "a02", en: "boarding pass", es: "tarjeta de embarque", pron: "bórdin pas", tema: "aeropuerto", nivel: 1, ejemplo: { en: "Here is my boarding pass.", es: "Aquí está mi tarjeta de embarque." } },
  { id: "a03", en: "check-in desk", es: "mostrador de facturación", pron: "chek-in desk", tema: "aeropuerto", nivel: 1, ejemplo: { en: "Where is the check-in desk?", es: "¿Dónde está el mostrador de facturación?" } },
  { id: "a04", en: "gate", es: "puerta de embarque", pron: "guéit", tema: "aeropuerto", nivel: 1, ejemplo: { en: "What gate is it?", es: "¿Qué puerta es?" } },
  { id: "a05", en: "luggage / baggage", es: "equipaje", pron: "láguich / báguich", tema: "aeropuerto", nivel: 1, ejemplo: { en: "I have one bag of luggage.", es: "Llevo una maleta." } },
  { id: "a06", en: "hand luggage", es: "equipaje de mano", pron: "jand láguich", tema: "aeropuerto", nivel: 1, ejemplo: { en: "This is only hand luggage.", es: "Esto es solo equipaje de mano." } },
  { id: "a07", en: "suitcase", es: "maleta", pron: "súutkeis", tema: "aeropuerto", nivel: 1, ejemplo: { en: "My suitcase is very heavy.", es: "Mi maleta pesa mucho." } },
  { id: "a08", en: "window seat / aisle seat", es: "asiento de ventanilla / de pasillo", pron: "uíndou síit / áil síit", tema: "aeropuerto", nivel: 2, ejemplo: { en: "An aisle seat, please.", es: "Un asiento de pasillo, por favor." } },
  { id: "a09", en: "departures / arrivals", es: "salidas / llegadas", pron: "dipárchers / aráivals", tema: "aeropuerto", nivel: 1, ejemplo: { en: "The arrivals hall is downstairs.", es: "La sala de llegadas está abajo." } },
  { id: "a10", en: "delayed", es: "retrasado", pron: "diléid", tema: "aeropuerto", nivel: 2, ejemplo: { en: "My flight is delayed two hours.", es: "Mi vuelo lleva dos horas de retraso." } },
  { id: "a11", en: "cancelled", es: "cancelado", pron: "cánseld", tema: "aeropuerto", nivel: 2, ejemplo: { en: "The flight was cancelled.", es: "El vuelo se canceló." } },
  { id: "a12", en: "I missed my flight", es: "he perdido el vuelo", pron: "ai míst mai fláit", tema: "aeropuerto", nivel: 3, ejemplo: { en: "I missed my flight. What can I do?", es: "He perdido el vuelo. ¿Qué puedo hacer?" } },
  { id: "a13", en: "connecting flight", es: "vuelo de conexión", pron: "conéktin fláit", tema: "aeropuerto", nivel: 3, ejemplo: { en: "I have a connecting flight to Rome.", es: "Tengo un vuelo de conexión a Roma." } },
  { id: "a14", en: "security check", es: "control de seguridad", pron: "sekiúriti chek", tema: "aeropuerto", nivel: 1, ejemplo: { en: "Where is the security check?", es: "¿Dónde está el control de seguridad?" } },
  { id: "a15", en: "boarding", es: "embarque", pron: "bórdin", tema: "aeropuerto", nivel: 2, ejemplo: { en: "Boarding starts at nine.", es: "El embarque empieza a las nueve." } },
  { id: "a16", en: "My luggage is missing", es: "mi equipaje no ha llegado", pron: "mai láguich is mísin", tema: "aeropuerto", nivel: 3, ejemplo: { en: "My luggage is missing. Here is my tag.", es: "Mi equipaje no ha llegado. Aquí está mi etiqueta." } },

  // ---------- pasaporte y aduana ----------
  { id: "l01", en: "passport", es: "pasaporte", pron: "pásport", tema: "llegada", nivel: 1, ejemplo: { en: "Here is my passport.", es: "Aquí está mi pasaporte." } },
  { id: "l02", en: "on holiday", es: "de vacaciones", pron: "on jólidei", tema: "llegada", nivel: 1, ejemplo: { en: "I'm here on holiday.", es: "Estoy aquí de vacaciones." } },
  { id: "l03", en: "on business", es: "por trabajo", pron: "on bísnes", tema: "llegada", nivel: 2, ejemplo: { en: "I'm travelling on business.", es: "Viajo por trabajo." } },
  { id: "l04", en: "for one week", es: "durante una semana", pron: "for uán uíik", tema: "llegada", nivel: 1, ejemplo: { en: "I'm staying for one week.", es: "Me quedo una semana." } },
  { id: "l05", en: "return ticket", es: "billete de vuelta", pron: "ritérn tíket", tema: "llegada", nivel: 2, ejemplo: { en: "Yes, I have a return ticket.", es: "Sí, tengo billete de vuelta." } },
  { id: "l06", en: "nothing to declare", es: "nada que declarar", pron: "názin tu diclér", tema: "llegada", nivel: 2, ejemplo: { en: "I have nothing to declare.", es: "No tengo nada que declarar." } },
  { id: "l07", en: "I'm staying at a hotel", es: "me alojo en un hotel", pron: "aim stéiin at a joutél", tema: "llegada", nivel: 1, ejemplo: { en: "I'm staying at a hotel in the centre.", es: "Me alojo en un hotel del centro." } },
  { id: "l08", en: "address", es: "dirección (postal)", pron: "adrés", tema: "llegada", nivel: 2, ejemplo: { en: "This is the address of the hotel.", es: "Esta es la dirección del hotel." } },

  // ---------- transporte ----------
  { id: "t01", en: "ticket", es: "billete / entrada", pron: "tíket", tema: "transporte", nivel: 1, ejemplo: { en: "One ticket, please.", es: "Un billete, por favor." } },
  { id: "t02", en: "a single / a return", es: "un billete de ida / de ida y vuelta", pron: "a síngol / a ritérn", tema: "transporte", nivel: 2, ejemplo: { en: "A return to Oxford, please.", es: "Un ida y vuelta a Oxford, por favor." } },
  { id: "t03", en: "train / bus", es: "tren / autobús", pron: "tréin / bas", tema: "transporte", nivel: 1, ejemplo: { en: "Is there a bus to the airport?", es: "¿Hay autobús al aeropuerto?" } },
  { id: "t04", en: "the underground / the metro", es: "el metro", pron: "de ándergraund / de métrou", tema: "transporte", nivel: 1, ejemplo: { en: "Where is the underground station?", es: "¿Dónde está la estación de metro?" } },
  { id: "t05", en: "taxi", es: "taxi", pron: "táksi", tema: "transporte", nivel: 1, ejemplo: { en: "Can you call a taxi?", es: "¿Puede llamar a un taxi?" } },
  { id: "t06", en: "platform", es: "andén / vía", pron: "plátform", tema: "transporte", nivel: 2, ejemplo: { en: "Which platform is it?", es: "¿Qué andén es?" } },
  { id: "t07", en: "station", es: "estación", pron: "stéishon", tema: "transporte", nivel: 1, ejemplo: { en: "To the station, please.", es: "A la estación, por favor." } },
  { id: "t08", en: "bus stop", es: "parada de autobús", pron: "bas stop", tema: "transporte", nivel: 1, ejemplo: { en: "Where is the bus stop?", es: "¿Dónde está la parada de autobús?" } },
  { id: "t09", en: "How much is it to...?", es: "¿cuánto cuesta hasta...?", pron: "jáo mach is it tu", tema: "transporte", nivel: 2, ejemplo: { en: "How much is it to the airport?", es: "¿Cuánto cuesta hasta el aeropuerto?" } },
  { id: "t10", en: "Does this bus go to...?", es: "¿este autobús va a...?", pron: "das dis bas góu tu", tema: "transporte", nivel: 2, ejemplo: { en: "Does this bus go to the centre?", es: "¿Este autobús va al centro?" } },
  { id: "t11", en: "to change (trains)", es: "hacer transbordo", pron: "tu chéinch", tema: "transporte", nivel: 3, ejemplo: { en: "Do I have to change trains?", es: "¿Tengo que hacer transbordo?" } },
  { id: "t12", en: "the next one", es: "el siguiente", pron: "de next uán", tema: "transporte", nivel: 2, ejemplo: { en: "When is the next one?", es: "¿Cuándo sale el siguiente?" } },
  { id: "t13", en: "Stop here, please", es: "pare aquí, por favor", pron: "stop jíar plíis", tema: "transporte", nivel: 1, ejemplo: { en: "Stop here, please. Thank you.", es: "Pare aquí, por favor. Gracias." } },
  { id: "t14", en: "to rent a car", es: "alquilar un coche", pron: "tu rént a car", tema: "transporte", nivel: 3, ejemplo: { en: "I'd like to rent a car for three days.", es: "Querría alquilar un coche tres días." } },
  { id: "t15", en: "petrol station", es: "gasolinera", pron: "pétrol stéishon", tema: "transporte", nivel: 3, ejemplo: { en: "Is there a petrol station near here?", es: "¿Hay una gasolinera cerca de aquí?" } },
  { id: "t16", en: "driving licence", es: "carné de conducir", pron: "dráivin láisens", tema: "transporte", nivel: 3, ejemplo: { en: "Here is my driving licence.", es: "Aquí está mi carné de conducir." } },

  // ---------- direcciones ----------
  { id: "d01", en: "Where is...?", es: "¿dónde está...?", pron: "uér is", tema: "direcciones", nivel: 1, ejemplo: { en: "Where is the museum?", es: "¿Dónde está el museo?" } },
  { id: "d02", en: "left / right", es: "izquierda / derecha", pron: "left / ráit", tema: "direcciones", nivel: 1, ejemplo: { en: "Turn left at the corner.", es: "Gire a la izquierda en la esquina." } },
  { id: "d03", en: "straight on", es: "todo recto", pron: "stréit on", tema: "direcciones", nivel: 1, ejemplo: { en: "Go straight on for two streets.", es: "Siga todo recto dos calles." } },
  { id: "d04", en: "near / far", es: "cerca / lejos", pron: "níar / far", tema: "direcciones", nivel: 1, ejemplo: { en: "Is it far from here?", es: "¿Está lejos de aquí?" } },
  { id: "d05", en: "next to", es: "al lado de", pron: "next tu", tema: "direcciones", nivel: 2, ejemplo: { en: "It's next to the bank.", es: "Está al lado del banco." } },
  { id: "d06", en: "opposite", es: "enfrente de", pron: "óposit", tema: "direcciones", nivel: 2, ejemplo: { en: "The hotel is opposite the station.", es: "El hotel está enfrente de la estación." } },
  { id: "d07", en: "on the corner", es: "en la esquina", pron: "on de córner", tema: "direcciones", nivel: 2, ejemplo: { en: "There's a pharmacy on the corner.", es: "Hay una farmacia en la esquina." } },
  { id: "d08", en: "street / square", es: "calle / plaza", pron: "stríit / skuér", tema: "direcciones", nivel: 1, ejemplo: { en: "It's in the main square.", es: "Está en la plaza mayor." } },
  { id: "d09", en: "How do I get to...?", es: "¿cómo llego a...?", pron: "jáo du ai guét tu", tema: "direcciones", nivel: 2, ejemplo: { en: "How do I get to the cathedral?", es: "¿Cómo llego a la catedral?" } },
  { id: "d10", en: "I'm lost", es: "me he perdido", pron: "aim lost", tema: "direcciones", nivel: 2, ejemplo: { en: "Excuse me, I'm lost.", es: "Disculpe, me he perdido." } },
  { id: "d11", en: "on foot / walking", es: "a pie / andando", pron: "on fut / uókin", tema: "direcciones", nivel: 2, ejemplo: { en: "Can I go on foot?", es: "¿Puedo ir a pie?" } },
  { id: "d12", en: "It's ten minutes away", es: "está a diez minutos", pron: "its ten mínits auéi", tema: "direcciones", nivel: 2, ejemplo: { en: "It's ten minutes away, more or less.", es: "Está a diez minutos, más o menos." } },
  { id: "d13", en: "Is it this way?", es: "¿es por aquí?", pron: "is it dis uéi", tema: "direcciones", nivel: 2, ejemplo: { en: "Sorry, is it this way?", es: "Perdone, ¿es por aquí?" } },

  // ---------- hotel ----------
  { id: "h01", en: "I have a reservation", es: "tengo una reserva", pron: "ai jav a reservéishon", tema: "hotel", nivel: 1, ejemplo: { en: "Good evening, I have a reservation.", es: "Buenas noches, tengo una reserva." } },
  { id: "h02", en: "a double room", es: "una habitación doble", pron: "a dábel rúum", tema: "hotel", nivel: 1, ejemplo: { en: "A double room for two nights.", es: "Una habitación doble para dos noches." } },
  { id: "h03", en: "a single room", es: "una habitación individual", pron: "a síngol rúum", tema: "hotel", nivel: 1, ejemplo: { en: "Do you have a single room?", es: "¿Tienen habitación individual?" } },
  { id: "h04", en: "for two nights", es: "para dos noches", pron: "for tchu náits", tema: "hotel", nivel: 1, ejemplo: { en: "For two nights, please.", es: "Para dos noches, por favor." } },
  { id: "h05", en: "the key", es: "la llave", pron: "de kíi", tema: "hotel", nivel: 1, ejemplo: { en: "Here is your key.", es: "Aquí tiene su llave." } },
  { id: "h06", en: "breakfast", es: "desayuno", pron: "brékfast", tema: "hotel", nivel: 1, ejemplo: { en: "Is breakfast included?", es: "¿Está incluido el desayuno?" } },
  { id: "h07", en: "included", es: "incluido", pron: "inclúuded", tema: "hotel", nivel: 2, ejemplo: { en: "Is breakfast included in the price?", es: "¿El desayuno está incluido en el precio?" } },
  { id: "h08", en: "check-out", es: "salida (dejar la habitación)", pron: "chek-áut", tema: "hotel", nivel: 2, ejemplo: { en: "What time is check-out?", es: "¿A qué hora hay que dejar la habitación?" } },
  { id: "h09", en: "the lift", es: "el ascensor", pron: "de lift", tema: "hotel", nivel: 2, ejemplo: { en: "The lift is over there.", es: "El ascensor está allí." } },
  { id: "h10", en: "floor", es: "planta / piso", pron: "flóor", tema: "hotel", nivel: 2, ejemplo: { en: "Room 204, on the second floor.", es: "Habitación 204, en la segunda planta." } },
  { id: "h11", en: "the Wi-Fi password", es: "la contraseña del wifi", pron: "de uái-fai pásuord", tema: "hotel", nivel: 1, ejemplo: { en: "What's the Wi-Fi password?", es: "¿Cuál es la contraseña del wifi?" } },
  { id: "h12", en: "towel", es: "toalla", pron: "táuel", tema: "hotel", nivel: 2, ejemplo: { en: "Could I have another towel?", es: "¿Me podría dar otra toalla?" } },
  { id: "h13", en: "The air conditioning doesn't work", es: "el aire acondicionado no funciona", pron: "de ér condíshonin dásent uérk", tema: "hotel", nivel: 3, ejemplo: { en: "Sorry, the air conditioning doesn't work.", es: "Perdone, el aire acondicionado no funciona." } },
  { id: "h14", en: "There's no hot water", es: "no hay agua caliente", pron: "ders nóu jot uóter", tema: "hotel", nivel: 3, ejemplo: { en: "There's no hot water in my room.", es: "No hay agua caliente en mi habitación." } },
  { id: "h15", en: "Could you keep my luggage?", es: "¿me pueden guardar el equipaje?", pron: "cud iu kíip mai láguich", tema: "hotel", nivel: 3, ejemplo: { en: "Could you keep my luggage until five?", es: "¿Me pueden guardar el equipaje hasta las cinco?" } },
  { id: "h16", en: "to book", es: "reservar", pron: "tu buk", tema: "hotel", nivel: 2, ejemplo: { en: "I'd like to book a room.", es: "Querría reservar una habitación." } },

  // ---------- restaurante ----------
  { id: "r01", en: "a table for two", es: "una mesa para dos", pron: "a téibol for tchu", tema: "restaurante", nivel: 1, ejemplo: { en: "A table for two, please.", es: "Una mesa para dos, por favor." } },
  { id: "r02", en: "the menu", es: "la carta", pron: "de méniu", tema: "restaurante", nivel: 1, ejemplo: { en: "Can I see the menu, please?", es: "¿Puedo ver la carta, por favor?" } },
  { id: "r03", en: "I'd like...", es: "querría / me gustaría...", pron: "aid láik", tema: "restaurante", nivel: 1, ejemplo: { en: "I'd like the soup, please.", es: "Querría la sopa, por favor." } },
  { id: "r04", en: "water (still / sparkling)", es: "agua (sin gas / con gas)", pron: "uóter (stil / spárklin)", tema: "restaurante", nivel: 1, ejemplo: { en: "A bottle of still water, please.", es: "Una botella de agua sin gas, por favor." } },
  { id: "r05", en: "a coffee / a tea", es: "un café / un té", pron: "a cófi / a tíi", tema: "restaurante", nivel: 1, ejemplo: { en: "A coffee with milk, please.", es: "Un café con leche, por favor." } },
  { id: "r06", en: "a beer / a glass of wine", es: "una cerveza / una copa de vino", pron: "a bíar / a glas of uáin", tema: "restaurante", nivel: 1, ejemplo: { en: "Two beers, please.", es: "Dos cervezas, por favor." } },
  { id: "r07", en: "the bill", es: "la cuenta", pron: "de bil", tema: "restaurante", nivel: 1, ejemplo: { en: "The bill, please.", es: "La cuenta, por favor." } },
  { id: "r08", en: "starter / main course / dessert", es: "primero / segundo / postre", pron: "stárter / méin cors / disért", tema: "restaurante", nivel: 2, ejemplo: { en: "For the main course, the fish.", es: "De segundo, el pescado." } },
  { id: "r09", en: "chicken / fish / meat", es: "pollo / pescado / carne", pron: "chíken / fish / míit", tema: "restaurante", nivel: 1, ejemplo: { en: "Is it chicken or fish?", es: "¿Es pollo o pescado?" } },
  { id: "r10", en: "vegetables / salad", es: "verduras / ensalada", pron: "véchtabols / sálad", tema: "restaurante", nivel: 1, ejemplo: { en: "With vegetables, please.", es: "Con verduras, por favor." } },
  { id: "r11", en: "I'm vegetarian", es: "soy vegetariano/a", pron: "aim vecheteérian", tema: "restaurante", nivel: 2, ejemplo: { en: "I'm vegetarian. What can I eat?", es: "Soy vegetariano. ¿Qué puedo comer?" } },
  { id: "r12", en: "I'm allergic to...", es: "soy alérgico/a a...", pron: "aim alérchic tu", tema: "restaurante", nivel: 2, ejemplo: { en: "I'm allergic to nuts.", es: "Soy alérgico a los frutos secos." } },
  { id: "r13", en: "Does it have...?", es: "¿lleva...?", pron: "das it jav", tema: "restaurante", nivel: 2, ejemplo: { en: "Does it have milk in it?", es: "¿Lleva leche?" } },
  { id: "r14", en: "It's delicious", es: "está buenísimo", pron: "its dilíshos", tema: "restaurante", nivel: 2, ejemplo: { en: "Thank you, it's delicious.", es: "Gracias, está buenísimo." } },
  { id: "r15", en: "Excuse me, this is cold", es: "perdone, esto está frío", pron: "ekskiús mi, dis is cóuld", tema: "restaurante", nivel: 3, ejemplo: { en: "Excuse me, this is cold. Could you heat it?", es: "Perdone, esto está frío. ¿Podría calentarlo?" } },
  { id: "r16", en: "I didn't order this", es: "yo no he pedido esto", pron: "ai dídnt órder dis", tema: "restaurante", nivel: 3, ejemplo: { en: "Sorry, I didn't order this.", es: "Perdone, yo no he pedido esto." } },
  { id: "r17", en: "Can we pay separately?", es: "¿podemos pagar por separado?", pron: "can uí péi séparatli", tema: "restaurante", nivel: 3, ejemplo: { en: "Can we pay separately, please?", es: "¿Podemos pagar por separado, por favor?" } },
  { id: "r18", en: "Keep the change", es: "quédese con el cambio", pron: "kíip de chéinch", tema: "restaurante", nivel: 2, ejemplo: { en: "Thank you, keep the change.", es: "Gracias, quédese con el cambio." } },
  { id: "r19", en: "the toilet", es: "el baño / los servicios", pron: "de tóilet", tema: "restaurante", nivel: 1, ejemplo: { en: "Where is the toilet, please?", es: "¿Dónde está el baño, por favor?" } },
  { id: "r20", en: "to book a table", es: "reservar mesa", pron: "tu buk a téibol", tema: "restaurante", nivel: 2, ejemplo: { en: "I'd like to book a table for tonight.", es: "Querría reservar mesa para esta noche." } },

  // ---------- compras y dinero ----------
  { id: "p01", en: "How much is it?", es: "¿cuánto cuesta?", pron: "jáo mach is it", tema: "compras", nivel: 1, ejemplo: { en: "Excuse me, how much is it?", es: "Disculpe, ¿cuánto cuesta?" } },
  { id: "p02", en: "It's too expensive", es: "es demasiado caro", pron: "its túu ikspénsiv", tema: "compras", nivel: 2, ejemplo: { en: "Sorry, it's too expensive for me.", es: "Lo siento, es demasiado caro para mí." } },
  { id: "p03", en: "cheap", es: "barato", pron: "chíip", tema: "compras", nivel: 2, ejemplo: { en: "Is there anything cheaper?", es: "¿Hay algo más barato?" } },
  { id: "p04", en: "cash / by card", es: "en efectivo / con tarjeta", pron: "cash / bai card", tema: "compras", nivel: 1, ejemplo: { en: "Can I pay by card?", es: "¿Puedo pagar con tarjeta?" } },
  { id: "p05", en: "the change", es: "el cambio (vuelta)", pron: "de chéinch", tema: "compras", nivel: 2, ejemplo: { en: "Here's your change.", es: "Aquí tiene su cambio." } },
  { id: "p06", en: "the receipt", es: "el recibo / el tique", pron: "de risíit", tema: "compras", nivel: 2, ejemplo: { en: "Could I have the receipt?", es: "¿Me da el recibo?" } },
  { id: "p07", en: "I'm just looking", es: "solo estoy mirando", pron: "aim yast lúkin", tema: "compras", nivel: 1, ejemplo: { en: "Thank you, I'm just looking.", es: "Gracias, solo estoy mirando." } },
  { id: "p08", en: "Can I try it on?", es: "¿me lo puedo probar?", pron: "can ai trái it on", tema: "compras", nivel: 2, ejemplo: { en: "Can I try it on, please?", es: "¿Me lo puedo probar, por favor?" } },
  { id: "p09", en: "size", es: "talla", pron: "sáis", tema: "compras", nivel: 2, ejemplo: { en: "Do you have a bigger size?", es: "¿Tienen una talla más grande?" } },
  { id: "p10", en: "bigger / smaller", es: "más grande / más pequeño", pron: "bíguer / smóler", tema: "compras", nivel: 2, ejemplo: { en: "Do you have it in a smaller size?", es: "¿Lo tienen en una talla más pequeña?" } },
  { id: "p11", en: "I'll take it", es: "me lo llevo", pron: "áil téik it", tema: "compras", nivel: 2, ejemplo: { en: "Perfect, I'll take it.", es: "Perfecto, me lo llevo." } },
  { id: "p12", en: "a bag", es: "una bolsa", pron: "a bag", tema: "compras", nivel: 1, ejemplo: { en: "Could I have a bag, please?", es: "¿Me da una bolsa, por favor?" } },
  { id: "p13", en: "cash machine / ATM", es: "cajero automático", pron: "cash mashíin / ei-ti-ém", tema: "compras", nivel: 2, ejemplo: { en: "Is there a cash machine near here?", es: "¿Hay un cajero cerca de aquí?" } },
  { id: "p14", en: "open / closed", es: "abierto / cerrado", pron: "óupen / clóusd", tema: "compras", nivel: 1, ejemplo: { en: "What time do you open?", es: "¿A qué hora abren?" } },
  { id: "p15", en: "Can I have a refund?", es: "¿me pueden devolver el dinero?", pron: "can ai jav a rífand", tema: "compras", nivel: 3, ejemplo: { en: "It's broken. Can I have a refund?", es: "Está roto. ¿Me pueden devolver el dinero?" } },
  { id: "p16", en: "to exchange", es: "cambiar (por otro)", pron: "tu ikschéinch", tema: "compras", nivel: 3, ejemplo: { en: "Could I exchange it for another one?", es: "¿Podría cambiarlo por otro?" } },

  // ---------- salud y farmacia ----------
  { id: "m01", en: "chemist's / pharmacy", es: "farmacia", pron: "kémists / fármasi", tema: "salud", nivel: 1, ejemplo: { en: "Where is the nearest pharmacy?", es: "¿Dónde está la farmacia más cercana?" } },
  { id: "m02", en: "I don't feel well", es: "no me encuentro bien", pron: "ai dóunt fíil uél", tema: "salud", nivel: 1, ejemplo: { en: "Sorry, I don't feel well.", es: "Perdone, no me encuentro bien." } },
  { id: "m03", en: "It hurts here", es: "me duele aquí", pron: "it jérts jíar", tema: "salud", nivel: 1, ejemplo: { en: "It hurts here, in my stomach.", es: "Me duele aquí, en el estómago." } },
  { id: "m04", en: "headache", es: "dolor de cabeza", pron: "jédeik", tema: "salud", nivel: 2, ejemplo: { en: "I have a bad headache.", es: "Tengo mucho dolor de cabeza." } },
  { id: "m05", en: "stomach ache", es: "dolor de estómago", pron: "stómak eik", tema: "salud", nivel: 2, ejemplo: { en: "I've had stomach ache since yesterday.", es: "Tengo dolor de estómago desde ayer." } },
  { id: "m06", en: "a temperature / a fever", es: "fiebre", pron: "a témpricher / a fíiver", tema: "salud", nivel: 2, ejemplo: { en: "I think I have a temperature.", es: "Creo que tengo fiebre." } },
  { id: "m07", en: "painkillers", es: "analgésicos / calmantes", pron: "péinkilers", tema: "salud", nivel: 2, ejemplo: { en: "Do you have painkillers?", es: "¿Tienen analgésicos?" } },
  { id: "m08", en: "a prescription", es: "una receta", pron: "a priscrípshon", tema: "salud", nivel: 3, ejemplo: { en: "Do I need a prescription?", es: "¿Necesito receta?" } },
  { id: "m09", en: "a doctor", es: "un médico", pron: "a dóktor", tema: "salud", nivel: 1, ejemplo: { en: "I need a doctor, please.", es: "Necesito un médico, por favor." } },
  { id: "m10", en: "a plaster", es: "una tirita", pron: "a plástar", tema: "salud", nivel: 2, ejemplo: { en: "Could I have a plaster?", es: "¿Me da una tirita?" } },
  { id: "m11", en: "I'm allergic to penicillin", es: "soy alérgico a la penicilina", pron: "aim alérchic tu penisílin", tema: "salud", nivel: 3, ejemplo: { en: "Careful, I'm allergic to penicillin.", es: "Cuidado, soy alérgico a la penicilina." } },
  { id: "m12", en: "health insurance", es: "seguro médico", pron: "jelz inshúrans", tema: "salud", nivel: 3, ejemplo: { en: "Here is my health insurance card.", es: "Aquí está mi tarjeta del seguro médico." } },

  // ---------- problemas y emergencias ----------
  { id: "e01", en: "Help!", es: "¡socorro! / ¡ayuda!", pron: "jélp", tema: "emergencias", nivel: 1, ejemplo: { en: "Help! Call the police!", es: "¡Ayuda! ¡Llame a la policía!" } },
  { id: "e02", en: "the police", es: "la policía", pron: "de políis", tema: "emergencias", nivel: 1, ejemplo: { en: "I want to call the police.", es: "Quiero llamar a la policía." } },
  { id: "e03", en: "an ambulance", es: "una ambulancia", pron: "an ámbiulans", tema: "emergencias", nivel: 1, ejemplo: { en: "Call an ambulance, please!", es: "¡Llame a una ambulancia, por favor!" } },
  { id: "e04", en: "I've lost my...", es: "he perdido mi...", pron: "aiv lost mai", tema: "emergencias", nivel: 2, ejemplo: { en: "I've lost my passport.", es: "He perdido el pasaporte." } },
  { id: "e05", en: "It was stolen", es: "me lo han robado", pron: "it uós stóulen", tema: "emergencias", nivel: 3, ejemplo: { en: "My wallet was stolen on the bus.", es: "Me robaron la cartera en el autobús." } },
  { id: "e06", en: "wallet", es: "cartera", pron: "uólet", tema: "emergencias", nivel: 2, ejemplo: { en: "My wallet is not in my bag.", es: "Mi cartera no está en el bolso." } },
  { id: "e07", en: "my phone", es: "mi móvil", pron: "mai fóun", tema: "emergencias", nivel: 1, ejemplo: { en: "I've lost my phone.", es: "He perdido el móvil." } },
  { id: "e08", en: "the embassy", es: "la embajada", pron: "de émbasi", tema: "emergencias", nivel: 3, ejemplo: { en: "I need to contact the Spanish embassy.", es: "Necesito contactar con la embajada española." } },
  { id: "e09", en: "lost property office", es: "oficina de objetos perdidos", pron: "lost próperti ófis", tema: "emergencias", nivel: 3, ejemplo: { en: "Where is the lost property office?", es: "¿Dónde está la oficina de objetos perdidos?" } },
  { id: "e10", en: "to make a report", es: "poner una denuncia", pron: "tu méik a ripórt", tema: "emergencias", nivel: 3, ejemplo: { en: "I need to make a report.", es: "Necesito poner una denuncia." } },
  { id: "e11", en: "It's an emergency", es: "es una emergencia", pron: "its an imérchensi", tema: "emergencias", nivel: 2, ejemplo: { en: "Please, it's an emergency.", es: "Por favor, es una emergencia." } },
  { id: "e12", en: "Can I use your phone?", es: "¿puedo usar su teléfono?", pron: "can ai iús iór fóun", tema: "emergencias", nivel: 2, ejemplo: { en: "Excuse me, can I use your phone?", es: "Disculpe, ¿puedo usar su teléfono?" } },

  // ---------- turismo y ocio ----------
  { id: "u01", en: "the tourist office", es: "la oficina de turismo", pron: "de túrist ófis", tema: "turismo", nivel: 2, ejemplo: { en: "Where is the tourist office?", es: "¿Dónde está la oficina de turismo?" } },
  { id: "u02", en: "a map", es: "un mapa / un plano", pron: "a map", tema: "turismo", nivel: 1, ejemplo: { en: "Do you have a map of the city?", es: "¿Tienen un plano de la ciudad?" } },
  { id: "u03", en: "the museum", es: "el museo", pron: "de miusíam", tema: "turismo", nivel: 1, ejemplo: { en: "Is the museum open today?", es: "¿El museo está abierto hoy?" } },
  { id: "u04", en: "entrance fee", es: "precio de la entrada", pron: "éntrans fíi", tema: "turismo", nivel: 2, ejemplo: { en: "How much is the entrance fee?", es: "¿Cuánto cuesta la entrada?" } },
  { id: "u05", en: "a guided tour", es: "una visita guiada", pron: "a gáided túar", tema: "turismo", nivel: 2, ejemplo: { en: "Is there a guided tour in Spanish?", es: "¿Hay visita guiada en español?" } },
  { id: "u06", en: "Can you take a photo?", es: "¿puede hacer una foto?", pron: "can iu téik a fótou", tema: "turismo", nivel: 1, ejemplo: { en: "Excuse me, can you take a photo of us?", es: "Disculpe, ¿nos puede hacer una foto?" } },
  { id: "u07", en: "opening hours", es: "horario de apertura", pron: "óupenin áuers", tema: "turismo", nivel: 2, ejemplo: { en: "What are the opening hours?", es: "¿Cuál es el horario?" } },
  { id: "u08", en: "the beach", es: "la playa", pron: "de bíich", tema: "turismo", nivel: 1, ejemplo: { en: "How do I get to the beach?", es: "¿Cómo llego a la playa?" } },
  { id: "u09", en: "the old town", es: "el casco antiguo", pron: "de óuld táun", tema: "turismo", nivel: 2, ejemplo: { en: "The old town is very beautiful.", es: "El casco antiguo es precioso." } },
  { id: "u10", en: "Is it worth it?", es: "¿merece la pena?", pron: "is it uérz it", tema: "turismo", nivel: 3, ejemplo: { en: "Is it worth it for one day?", es: "¿Merece la pena para un día?" } },
  { id: "u11", en: "What do you recommend?", es: "¿qué me recomienda?", pron: "uót du iu recoménd", tema: "turismo", nivel: 2, ejemplo: { en: "What do you recommend near here?", es: "¿Qué me recomienda cerca de aquí?" } },
  { id: "u12", en: "a souvenir", es: "un recuerdo (regalo)", pron: "a suvenír", tema: "turismo", nivel: 2, ejemplo: { en: "I'm looking for a souvenir.", es: "Busco un recuerdo." } },

  // ---------- charla y convivencia ----------
  { id: "g01", en: "Is this seat free?", es: "¿está libre este asiento?", pron: "is dis síit fríi", tema: "conversar", nivel: 2, ejemplo: { en: "Excuse me, is this seat free?", es: "Disculpe, ¿está libre este asiento?" } },
  { id: "g02", en: "It's my first time here", es: "es mi primera vez aquí", pron: "its mai férst táim jíar", tema: "conversar", nivel: 2, ejemplo: { en: "It's my first time here. It's lovely.", es: "Es mi primera vez aquí. Es precioso." } },
  { id: "g03", en: "What do you do?", es: "¿a qué se dedica?", pron: "uót du iu du", tema: "conversar", nivel: 2, ejemplo: { en: "And you, what do you do?", es: "¿Y usted, a qué se dedica?" } },
  { id: "g04", en: "I'm travelling with my family", es: "viajo con mi familia", pron: "aim trávelin uíz mai fámili", tema: "conversar", nivel: 2, ejemplo: { en: "I'm travelling with my family, four of us.", es: "Viajo con mi familia, somos cuatro." } },
  { id: "g05", en: "The weather is lovely", es: "hace muy buen tiempo", pron: "de uéder is lávli", tema: "conversar", nivel: 2, ejemplo: { en: "The weather is lovely today.", es: "Hoy hace muy buen tiempo." } },
  { id: "g06", en: "It's raining", es: "está lloviendo", pron: "its réinin", tema: "conversar", nivel: 1, ejemplo: { en: "It's raining, take an umbrella.", es: "Está lloviendo, coge un paraguas." } },
  { id: "g07", en: "I agree", es: "estoy de acuerdo", pron: "ai agríi", tema: "conversar", nivel: 2, ejemplo: { en: "Yes, I agree with you.", es: "Sí, estoy de acuerdo con usted." } },
  { id: "g08", en: "Really?", es: "¿en serio?", pron: "ríali", tema: "conversar", nivel: 2, ejemplo: { en: "Really? That's interesting.", es: "¿En serio? Qué interesante." } },
  { id: "g09", en: "That sounds good", es: "suena bien", pron: "dat sáunds gud", tema: "conversar", nivel: 2, ejemplo: { en: "That sounds good, let's do it.", es: "Suena bien, hagámoslo." } },
  { id: "g10", en: "Maybe / Perhaps", es: "quizá", pron: "méibi / perjáps", tema: "conversar", nivel: 2, ejemplo: { en: "Maybe tomorrow, I'm tired.", es: "Quizá mañana, estoy cansado." } },
  { id: "g11", en: "I'm tired", es: "estoy cansado/a", pron: "aim táiard", tema: "conversar", nivel: 1, ejemplo: { en: "I'm tired, it was a long day.", es: "Estoy cansado, ha sido un día largo." } },
  { id: "g12", en: "I'm hungry / thirsty", es: "tengo hambre / sed", pron: "aim jángri / zérsti", tema: "conversar", nivel: 1, ejemplo: { en: "I'm hungry. Let's find a restaurant.", es: "Tengo hambre. Busquemos un restaurante." } },
  { id: "g13", en: "Enjoy your meal", es: "que aproveche", pron: "inchói iór míil", tema: "conversar", nivel: 2, ejemplo: { en: "Here you are. Enjoy your meal!", es: "Aquí tiene. ¡Que aproveche!" } },
  { id: "g14", en: "Take care", es: "cuídese", pron: "téik kér", tema: "conversar", nivel: 2, ejemplo: { en: "Goodbye, take care!", es: "Adiós, ¡cuídate!" } },
];

// Índice rápido por id, que se usa mucho en el repaso.
export const VOCAB_POR_ID = VOCABULARIO.reduce((mapa, item) => {
  mapa[item.id] = item;
  return mapa;
}, {});
