// ============================================================
// Inglés para Viajar — léxico inglés→español.
//
// Sirve para la "glosa": cuando escribes una frase que no está
// en el guion, la app no puede traducirla entera sin conexión,
// pero sí puede poner debajo el significado de cada palabra. Eso
// ya permite ver dónde te has equivocado.
//
// No pretende ser un diccionario: cubre el vocabulario que sale
// en los diálogos y en las respuestas típicas de un viajero.
// ============================================================

export const LEXICO = {
  // pronombres y determinantes
  i: "yo", you: "tú/usted", he: "él", she: "ella", it: "ello/eso",
  we: "nosotros", they: "ellos", me: "me/mí", him: "le/él", her: "le/ella/su",
  us: "nos", them: "les/ellos", my: "mi", your: "tu/su", his: "su (de él)",
  its: "su (de ello)", our: "nuestro", their: "su (de ellos)", mine: "el mío",
  yours: "el tuyo", this: "esto/este", that: "eso/ese", these: "estos", those: "esos",
  the: "el/la/los/las", a: "un/una", an: "un/una", some: "algo de/algunos",
  any: "algún/ninguno", no: "no/ningún", every: "cada", all: "todo", both: "ambos",
  other: "otro", another: "otro más", each: "cada", myself: "yo mismo",
  something: "algo", anything: "algo/nada", nothing: "nada", everything: "todo",
  someone: "alguien", anyone: "alguien/nadie", nobody: "nadie", everyone: "todos",
  somewhere: "en algún sitio", anywhere: "en algún sitio/en ninguno", nowhere: "en ningún sitio",

  // verbos frecuentes
  am: "soy/estoy", is: "es/está", are: "eres/son/están", was: "era/estaba",
  were: "eran/estaban", be: "ser/estar", been: "sido/estado", being: "siendo",
  have: "tener/haber", has: "tiene/ha", had: "tenía/había", having: "teniendo",
  do: "hacer", does: "hace", did: "hizo/hacía", done: "hecho", doing: "haciendo",
  can: "poder", could: "podría", will: "va a (futuro)", would: "querría/haría",
  shall: "voy a", should: "debería", must: "deber (obligación)", may: "poder (permiso)",
  might: "podría (quizá)", need: "necesitar", want: "querer", like: "gustar",
  go: "ir", going: "yendo/ir a", goes: "va", went: "fue", gone: "ido",
  come: "venir", came: "vino", coming: "viniendo", get: "conseguir/llegar",
  got: "conseguí/tengo", give: "dar", gave: "dio", take: "coger/tomar",
  took: "cogió", taking: "cogiendo", make: "hacer/fabricar", made: "hizo",
  say: "decir", said: "dijo", tell: "contar/decir a", told: "contó",
  ask: "preguntar/pedir", asked: "preguntó", know: "saber/conocer", knew: "sabía",
  think: "pensar/creer", thought: "pensó", see: "ver", saw: "vio", seen: "visto",
  look: "mirar", looking: "mirando/buscando", find: "encontrar", found: "encontró",
  lose: "perder", lost: "perdido/perdí", leave: "dejar/salir", left: "dejó/izquierda",
  put: "poner", buy: "comprar", bought: "compré", pay: "pagar", paid: "pagué",
  cost: "costar", eat: "comer", ate: "comió", drink: "beber", stay: "quedarse",
  staying: "quedándose", live: "vivir", work: "trabajar/funcionar", works: "funciona",
  works_: "trabaja", help: "ayudar", speak: "hablar", speaks: "habla", spoke: "habló",
  talk: "hablar/charlar", understand: "entender", repeat: "repetir", learn: "aprender",
  travel: "viajar", travelling: "viajando", traveling: "viajando", arrive: "llegar",
  wait: "esperar", waiting: "esperando", start: "empezar", starts: "empieza",
  finish: "terminar", open: "abrir/abierto", close: "cerrar", closed: "cerrado",
  book: "reservar/libro", booked: "reservado", change: "cambiar/cambio",
  visit: "visitar", visiting: "visitando", show: "enseñar/mostrar", bring: "traer",
  send: "enviar", call: "llamar", write: "escribir", read: "leer", walk: "andar",
  turn: "girar", cross: "cruzar", check: "comprobar", order: "pedir (comida)",
  ordered: "pedí", recommend: "recomendar", prefer: "preferir", agree: "estar de acuerdo",
  hope: "esperar (desear)", feel: "sentirse", felt: "se sintió", hurt: "doler",
  hurts: "duele", fell: "se cayó", fall: "caerse", try: "probar/intentar",
  use: "usar", keep: "guardar/quedarse", miss: "perder (un tren)", missed: "perdí",
  stole: "robó", stolen: "robado", enjoy: "disfrutar", worry: "preocuparse",
  suggest: "sugerir", mean: "significar", means: "significa", sorry_: "perdón",
  rent: "alquilar", drive: "conducir", sit: "sentarse", stand: "estar de pie",
  wear: "llevar puesto", broken: "roto", declare: "declarar", report: "denunciar",
  refund: "reembolsar/reembolso", exchange: "cambiar por otro", saved: "salvó",
  lives: "vive", takes: "toma/tarda", got_: "obtuvo",

  // preguntas y conectores
  what: "qué", who: "quién", where: "dónde", when: "cuándo", why: "por qué",
  how: "cómo", which: "cuál", whose: "de quién", and: "y", or: "o", but: "pero",
  because: "porque", so: "así que", if: "si", then: "entonces", also: "también",
  too: "también/demasiado", very: "muy", quite: "bastante", really: "de verdad",
  only: "solo", just: "solo/justo", still: "todavía", yet: "todavía", already: "ya",
  again: "otra vez", always: "siempre", never: "nunca", sometimes: "a veces",
  usually: "normalmente", maybe: "quizá", perhaps: "quizá", of: "de", to: "a/para",
  from: "de/desde", in: "en", on: "en/sobre", at: "en/a (hora)", by: "por/en",
  with: "con", without: "sin", for: "para/durante", about: "sobre/unos",
  after: "después de", before: "antes de", during: "durante", until: "hasta",
  since: "desde", between: "entre", under: "debajo/a nombre de", over: "encima/más de",
  through: "a través de", into: "dentro de", out: "fuera", up: "arriba", down: "abajo",
  here: "aquí", there: "allí", now: "ahora", today: "hoy", tomorrow: "mañana",
  yesterday: "ayer", tonight: "esta noche", ago: "hace (tiempo)", soon: "pronto",
  later: "más tarde", early: "temprano", late: "tarde", instead: "en su lugar",
  else: "más (otra cosa)", exactly: "exactamente", actually: "en realidad",
  anyway: "de todos modos", please: "por favor", thanks: "gracias", yes: "sí",
  ok: "vale", okay: "vale", sure: "claro", course: "curso (of course = claro)",

  // adjetivos y valoraciones
  good: "bueno", better: "mejor", best: "el mejor", bad: "malo", worse: "peor",
  great: "estupendo", nice: "agradable", lovely: "precioso", beautiful: "precioso",
  fine: "bien", perfect: "perfecto", wrong: "equivocado", right: "correcto/derecha",
  big: "grande", bigger: "más grande", small: "pequeño", smaller: "más pequeño",
  large: "grande", medium: "mediano", long: "largo", short: "corto", tall: "alto",
  new: "nuevo", old: "viejo/antiguo", young: "joven", cheap: "barato",
  cheaper: "más barato", expensive: "caro", free: "gratis/libre", busy: "ocupado",
  full: "lleno", empty: "vacío", hot: "caliente", cold: "frío", warm: "templado",
  clean: "limpio", dirty: "sucio", easy: "fácil", difficult: "difícil",
  important: "importante", interesting: "interesante", tired: "cansado",
  hungry: "hambriento", thirsty: "sediento", happy: "contento", sad: "triste",
  ready: "listo", sick: "enfermo/mareado", ill: "enfermo", mild: "leve",
  serious: "serio/grave", possible: "posible", different: "diferente",
  same: "mismo", next: "siguiente", last: "último/pasado", first: "primero",
  second: "segundo", third: "tercero", far: "lejos", near: "cerca",
  close_: "cerca", straight: "recto", opposite: "enfrente", allergic: "alérgico",
  vegetarian: "vegetariano", delicious: "buenísimo", awful: "horrible",
  kind: "amable", worried: "preocupado", official: "oficial", normal: "normal",
  faulty: "defectuoso", available: "disponible", included: "incluido",
  stronger: "más fuerte", earlier: "más temprano", sorry: "perdón/lo siento",
  welcome: "bienvenido", afraid: "temeroso (I'm afraid = me temo)",

  // sustantivos de viaje
  flight: "vuelo", plane: "avión", airport: "aeropuerto", gate: "puerta de embarque",
  seat: "asiento", window: "ventanilla", aisle: "pasillo", luggage: "equipaje",
  baggage: "equipaje", bag: "bolsa/maleta", bags: "maletas", suitcase: "maleta",
  passport: "pasaporte", ticket: "billete/entrada", tickets: "billetes",
  boarding: "embarque", pass: "pase", departure: "salida", arrival: "llegada",
  connection: "conexión", delay: "retraso", security: "seguridad", customs: "aduana",
  train: "tren", bus: "autobús", taxi: "taxi", metro: "metro", underground: "metro",
  station: "estación", platform: "andén", stop: "parada", line: "línea",
  bridge: "puente", car: "coche", licence: "carné", license: "carné",
  hotel: "hotel", reception: "recepción", room: "habitación", rooms: "habitaciones",
  key: "llave", floor: "planta/suelo", lift: "ascensor", elevator: "ascensor",
  breakfast: "desayuno", lunch: "comida", dinner: "cena", night: "noche",
  nights: "noches", day: "día", days: "días", week: "semana", weeks: "semanas",
  month: "mes", year: "año", hour: "hora", hours: "horas", minute: "minuto",
  minutes: "minutos", time: "tiempo/vez", morning: "mañana", afternoon: "tarde",
  evening: "tarde-noche", weekend: "fin de semana",
  restaurant: "restaurante", menu: "carta", bill: "cuenta", table: "mesa",
  waiter: "camarero", food: "comida", water: "agua", wine: "vino", beer: "cerveza",
  coffee: "café", tea: "té", milk: "leche", bread: "pan", meat: "carne",
  fish: "pescado", chicken: "pollo", beef: "ternera", lamb: "cordero",
  salad: "ensalada", vegetables: "verduras", soup: "sopa", dessert: "postre",
  starter: "primer plato", sauce: "salsa", cheese: "queso", ham: "jamón",
  bottle: "botella", glass: "vaso/copa", nuts: "frutos secos",
  shop: "tienda", shops: "tiendas", market: "mercado", size: "talla",
  price: "precio", money: "dinero", cash: "efectivo", card: "tarjeta",
  cards: "tarjetas", receipt: "recibo", euros: "euros", pounds: "libras",
  bank: "banco", jacket: "chaqueta", shirt: "camisa", present: "regalo",
  souvenir: "recuerdo", postcards: "postales",
  doctor: "médico", pharmacy: "farmacia", chemist: "farmacia", medicine: "medicina",
  medication: "medicación", pills: "pastillas", prescription: "receta",
  insurance: "seguro", headache: "dolor de cabeza", stomach: "estómago",
  throat: "garganta", ankle: "tobillo", arm: "brazo", temperature: "fiebre",
  fever: "fiebre", cough: "tos", pain: "dolor", allergy: "alergia",
  emergency: "emergencia", hospital: "hospital", ambulance: "ambulancia",
  police: "policía", wallet: "cartera", phone: "teléfono/móvil", battery: "batería",
  theft: "robo", embassy: "embajada", statement: "declaración/extracto",
  museum: "museo", castle: "castillo", cathedral: "catedral", church: "iglesia",
  square: "plaza", street: "calle", city: "ciudad", town: "pueblo/ciudad",
  centre: "centro", center: "centro", river: "río", beach: "playa", park: "parque",
  map: "mapa/plano", tour: "visita guiada", guide: "guía", photo: "foto",
  entrance: "entrada", exit: "salida", toilet: "baño", tourist: "turista",
  holiday: "vacaciones", business: "negocios", family: "familia", friend: "amigo",
  friends: "amigos", wife: "esposa", husband: "marido", son: "hijo",
  daughter: "hija", sister: "hermana", brother: "hermano", child: "niño",
  people: "gente", name: "nombre", address: "dirección", country: "país",
  english: "inglés", spanish: "español", spain: "España", teacher: "profesor",
  nurse: "enfermera", engineer: "ingeniero", student: "estudiante", manager: "encargado",
  weather: "tiempo (clima)", rain: "lluvia", problem: "problema", question: "pregunta",
  password: "contraseña", internet: "internet", email: "correo electrónico",
  notice: "aviso", option: "opción", options: "opciones", fee: "tasa",
  supplement: "suplemento", credit: "vale/crédito", meter: "taxímetro",
  trolley: "carrito", tray: "bandeja", towel: "toalla", shower: "ducha",
  laptop: "portátil", documents: "documentos", details: "detalles",
  reservation: "reserva", booking: "reserva", reference: "localizador",
  purpose: "motivo", visit_: "visita", stairs: "escaleras", machine: "máquina",
  drinks: "bebidas", coast: "costa", side: "lado", way: "camino/manera",
  end: "final", part: "parte", thing: "cosa", things: "cosas", place: "sitio",
  number: "número", numbers: "números", list: "lista", copy: "copia",

  // números escritos
  one: "uno", two: "dos", three: "tres", four: "cuatro", five: "cinco",
  six: "seis", seven: "siete", eight: "ocho", nine: "nueve", ten: "diez",
  eleven: "once", twelve: "doce", twenty: "veinte", thirty: "treinta",
  forty: "cuarenta", fifty: "cincuenta", hundred: "cien",

  // colores
  black: "negro", white: "blanco", red: "rojo", blue: "azul", green: "verde",
  yellow: "amarillo", brown: "marrón", grey: "gris", gray: "gris",

  // días
  monday: "lunes", tuesday: "martes", wednesday: "miércoles", thursday: "jueves",
  friday: "viernes", saturday: "sábado", sunday: "domingo",
};

// Da el significado de una palabra suelta. Devuelve null si no
// la conoce, para que la interfaz pueda marcarla como desconocida
// en vez de inventarse una traducción.
export function significado(palabra) {
  const limpia = String(palabra || "")
    .toLowerCase()
    .replace(/[^a-záéíóúñ']/g, "");
  if (!limpia) return null;
  if (LEXICO[limpia]) return LEXICO[limpia];

  // plurales y formas verbales sencillas, para no duplicar entradas
  if (limpia.endsWith("s") && LEXICO[limpia.slice(0, -1)]) return LEXICO[limpia.slice(0, -1)];
  if (limpia.endsWith("es") && LEXICO[limpia.slice(0, -2)]) return LEXICO[limpia.slice(0, -2)];
  if (limpia.endsWith("ing") && LEXICO[limpia.slice(0, -3)]) return LEXICO[limpia.slice(0, -3)] + " (-ando)";
  if (limpia.endsWith("ed") && LEXICO[limpia.slice(0, -2)]) return LEXICO[limpia.slice(0, -2)] + " (pasado)";
  return null;
}
