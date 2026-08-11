// ============================================================
// Cifras y Letras — diccionario de la app.
// Lista de palabras frecuentes adecuadas para 5º y 6º de
// primaria. A partir de las palabras base se generan solas los
// plurales, los femeninos de los adjetivos y las formas
// regulares de los verbos, así que el diccionario "efectivo" es
// mucho mayor que la lista escrita.
//
// AVISO PEDAGÓGICO: ningún diccionario embebido es completo. Por
// eso la validación automática siempre deja el comodín del
// docente/anfitrión: puede dar por buena una palabra que no esté
// aquí (con enlace al diccionario de la RAE para comprobarla) o
// rechazar una forma inventada. Las formas verbales se generan
// con las reglas regulares: alguna forma de un verbo irregular
// puede colarse o faltar; el comodín está para eso.
// ============================================================

import { normalizarPalabra } from "./motor.js";

const SUSTANTIVOS = [
  // --- casa y familia ---
  "casa", "hogar", "familia", "padre", "madre", "hijo", "hija", "hermano", "hermana",
  "abuelo", "abuela", "primo", "prima", "sobrino", "nieto", "bebé", "niño", "niña",
  "puerta", "ventana", "pared", "techo", "suelo", "escalera", "cocina", "salón",
  "cuarto", "baño", "ducha", "espejo", "cama", "manta", "sábana", "almohada",
  "mesa", "silla", "sofá", "sillón", "armario", "cajón", "estante", "lámpara",
  "llave", "timbre", "jardín", "patio", "garaje", "terraza", "balcón", "chimenea",
  "plato", "vaso", "taza", "jarra", "cuchara", "tenedor", "cuchillo", "sartén",
  "olla", "horno", "nevera", "grifo", "jabón", "toalla", "peine", "cepillo",
  "escoba", "cubo", "bolsa", "caja", "cesta", "botella", "tapa", "tarro",
  // --- colegio ---
  "colegio", "escuela", "clase", "aula", "maestro", "maestra", "alumno", "alumna",
  "recreo", "pizarra", "tiza", "borrador", "pupitre", "mochila", "estuche",
  "lápiz", "goma", "regla", "tijera", "pegamento", "cuaderno", "libreta", "folio",
  "libro", "página", "letra", "palabra", "frase", "texto", "cuento", "poema",
  "dibujo", "pintura", "mapa", "globo", "examen", "nota", "deberes", "tarea",
  "pregunta", "respuesta", "problema", "suma", "resta", "cifra", "número",
  "idioma", "lengua", "historia", "ciencia", "música", "plástica", "gimnasia",
  // --- cuerpo y salud ---
  "cuerpo", "cabeza", "pelo", "cara", "frente", "ceja", "ojo", "oreja", "nariz",
  "boca", "labio", "diente", "muela", "lengua", "cuello", "hombro", "brazo",
  "codo", "muñeca", "mano", "dedo", "uña", "pecho", "espalda", "cintura",
  "pierna", "rodilla", "tobillo", "pie", "talón", "piel", "hueso", "músculo",
  "corazón", "pulmón", "estómago", "cerebro", "sangre", "salud", "médico",
  "enfermera", "hospital", "herida", "tirita", "venda", "jarabe", "pastilla",
  "fiebre", "catarro", "tos", "gripe", "vacuna", "gafas", "dentista",
  // --- comida ---
  "comida", "desayuno", "almuerzo", "merienda", "cena", "hambre", "sed",
  "pan", "leche", "queso", "huevo", "mantequilla", "aceite", "vinagre", "sal",
  "azúcar", "harina", "arroz", "pasta", "sopa", "caldo", "ensalada", "verdura",
  "fruta", "manzana", "pera", "plátano", "naranja", "limón", "fresa", "uva",
  "melón", "sandía", "cereza", "ciruela", "kiwi", "piña", "melocotón",
  "tomate", "lechuga", "patata", "cebolla", "ajo", "zanahoria", "judía",
  "lenteja", "garbanzo", "maíz", "pepino", "calabaza", "pimiento", "seta",
  "carne", "pollo", "pescado", "atún", "sardina", "merluza", "jamón", "chorizo",
  "tortilla", "bocadillo", "galleta", "bizcocho", "tarta", "helado", "chocolate",
  "caramelo", "miel", "yogur", "zumo", "agua", "refresco", "postre", "receta",
  // --- animales ---
  "animal", "perro", "gato", "caballo", "yegua", "burro", "vaca", "toro",
  "ternero", "cerdo", "oveja", "cordero", "cabra", "gallina", "gallo", "pollo",
  "pato", "ganso", "pavo", "conejo", "ratón", "rata", "ardilla", "erizo",
  "zorro", "lobo", "oso", "ciervo", "jabalí", "murciélago", "león", "tigre",
  "leopardo", "elefante", "jirafa", "cebra", "mono", "gorila", "camello",
  "hipopótamo", "rinoceronte", "canguro", "delfín", "ballena", "tiburón",
  "foca", "pulpo", "calamar", "cangrejo", "gamba", "mejillón", "estrella",
  "tortuga", "lagarto", "serpiente", "cocodrilo", "rana", "sapo", "pez",
  "pájaro", "águila", "búho", "lechuza", "cigüeña", "golondrina", "gorrión",
  "paloma", "loro", "canario", "gaviota", "pingüino", "avestruz", "abeja",
  "avispa", "hormiga", "mosca", "mosquito", "mariposa", "araña", "escarabajo",
  "grillo", "caracol", "gusano", "lombriz", "nido", "jaula", "granja", "cuadra",
  // --- naturaleza ---
  "naturaleza", "campo", "bosque", "selva", "desierto", "montaña", "monte",
  "valle", "colina", "cueva", "roca", "piedra", "arena", "tierra", "barro",
  "polvo", "camino", "sendero", "río", "arroyo", "lago", "laguna", "charco",
  "mar", "océano", "ola", "playa", "costa", "isla", "puerto", "faro",
  "cielo", "sol", "luna", "nube", "lluvia", "gota", "tormenta", "trueno",
  "rayo", "relámpago", "arcoíris", "viento", "brisa", "niebla", "nieve",
  "hielo", "granizo", "calor", "frío", "sombra", "luz", "amanecer", "atardecer",
  "árbol", "tronco", "rama", "hoja", "raíz", "corteza", "semilla", "fruto",
  "flor", "pétalo", "rosa", "margarita", "clavel", "girasol", "amapola",
  "hierba", "césped", "musgo", "pino", "encina", "olivo", "chopo", "palmera",
  "planeta", "estrella", "cometa", "universo", "espacio", "aire", "fuego",
  "humo", "ceniza", "llama", "volcán", "terremoto", "primavera", "verano",
  "otoño", "invierno", "estación", "clima", "paisaje", "horizonte",
  // --- ciudad y transporte ---
  "ciudad", "pueblo", "barrio", "calle", "plaza", "avenida", "acera", "esquina",
  "semáforo", "paso", "fuente", "parque", "columpio", "tobogán", "banco",
  "tienda", "mercado", "panadería", "carnicería", "farmacia", "librería",
  "cine", "teatro", "museo", "biblioteca", "iglesia", "castillo", "torre",
  "puente", "muralla", "edificio", "piso", "ascensor", "portal", "tejado",
  "coche", "camión", "furgoneta", "moto", "bicicleta", "patinete", "autobús",
  "tren", "tranvía", "metro", "taxi", "barco", "velero", "lancha", "avión",
  "helicóptero", "cohete", "rueda", "volante", "motor", "freno", "asiento",
  "billete", "viaje", "maleta", "equipaje", "estación", "andén", "carretera",
  "autopista", "túnel", "rotonda", "gasolina", "taller", "garaje",
  // --- trabajo y oficios ---
  "trabajo", "oficio", "panadero", "carnicero", "pescadero", "frutero",
  "cocinero", "camarero", "peluquero", "carpintero", "fontanero", "albañil",
  "pintor", "electricista", "mecánico", "conductor", "piloto", "marinero",
  "pescador", "agricultor", "ganadero", "jardinero", "bombero", "policía",
  "cartero", "juez", "abogado", "periodista", "escritor", "poeta", "actor",
  "actriz", "cantante", "bailarín", "músico", "científico", "veterinario",
  "granjero", "soldado", "arquitecto", "ingeniero", "profesor", "director",
  "vendedor", "cliente", "jefe", "sueldo", "oficina", "fábrica", "herramienta",
  "martillo", "clavo", "tornillo", "sierra", "taladro", "pala", "rastrillo",
  "manguera", "andamio", "ladrillo", "cemento", "madera", "cristal", "metal",
  "hierro", "acero", "cobre", "oro", "plata", "plástico", "cartón", "papel",
  "tela", "lana", "algodón", "cuero", "goma", "cuerda", "alambre", "cadena",
  // --- ropa ---
  "ropa", "camisa", "camiseta", "jersey", "sudadera", "chaqueta", "abrigo",
  "anorak", "pantalón", "vaquero", "falda", "vestido", "pijama", "bata",
  "calcetín", "media", "zapato", "zapatilla", "bota", "sandalia", "chancla",
  "gorro", "gorra", "sombrero", "bufanda", "guante", "cinturón", "bolsillo",
  "botón", "cremallera", "cordón", "manga", "cuello", "talla", "moda",
  "collar", "pulsera", "anillo", "pendiente", "reloj", "paraguas", "abanico",
  // --- juegos y deporte ---
  "juego", "juguete", "muñeca", "peluche", "pelota", "balón", "canica",
  "cometa", "puzle", "dado", "ficha", "carta", "baraja", "premio", "regalo",
  "deporte", "partido", "equipo", "jugador", "portero", "árbitro", "gol",
  "punto", "canasta", "raqueta", "red", "campo", "cancha", "piscina",
  "carrera", "meta", "salto", "marcador", "medalla", "copa", "trofeo",
  "campeón", "torneo", "liga", "entrenador", "afición", "grada", "estadio",
  "ajedrez", "parchís", "oca", "escondite", "columpio", "cuerda", "comba",
  // --- tiempo y medida ---
  "tiempo", "segundo", "minuto", "hora", "día", "semana", "mes", "año",
  "siglo", "fecha", "calendario", "lunes", "martes", "miércoles", "jueves",
  "viernes", "sábado", "domingo", "enero", "febrero", "marzo", "abril",
  "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre",
  "diciembre", "mañana", "tarde", "noche", "mediodía", "madrugada", "momento",
  "rato", "instante", "principio", "final", "metro", "litro", "gramo", "kilo",
  "tonelada", "docena", "par", "mitad", "tercio", "cuarto", "doble", "triple",
  "grado", "medida", "peso", "altura", "anchura", "longitud", "distancia",
  "tamaño", "forma", "línea", "recta", "curva", "círculo", "cuadrado",
  "triángulo", "rectángulo", "rombo", "esfera", "cubo", "cono", "cilindro",
  "ángulo", "lado", "borde", "centro", "orilla", "extremo", "fila", "columna",
  // --- personas y sentimientos ---
  "persona", "gente", "hombre", "mujer", "chico", "chica", "joven", "anciano",
  "amigo", "amiga", "compañero", "vecino", "señor", "señora", "nombre",
  "apellido", "cumpleaños", "fiesta", "invitado", "visita", "saludo", "abrazo",
  "beso", "sonrisa", "risa", "carcajada", "llanto", "lágrima", "grito",
  "susto", "miedo", "valor", "alegría", "tristeza", "pena", "rabia", "enfado",
  "sorpresa", "ilusión", "esperanza", "cariño", "amor", "amistad", "respeto",
  "verdad", "mentira", "secreto", "promesa", "perdón", "favor", "ayuda",
  "consejo", "idea", "pensamiento", "memoria", "recuerdo", "sueño", "deseo",
  "suerte", "casualidad", "costumbre", "paciencia", "esfuerzo", "ánimo",
  "carácter", "genio", "talento", "defecto", "virtud", "culpa", "razón",
  // --- cultura y varios ---
  "mundo", "país", "frontera", "bandera", "himno", "capital", "provincia",
  "región", "comarca", "habitante", "vecindario", "sociedad", "ley", "norma",
  "regla", "derecho", "deber", "paz", "guerra", "batalla", "espada", "escudo",
  "flecha", "arco", "caballero", "princesa", "príncipe", "reina", "rey",
  "corona", "trono", "palacio", "dragón", "hada", "duende", "gigante",
  "enano", "bruja", "mago", "tesoro", "cofre", "moneda", "billete", "dinero",
  "precio", "rebaja", "compra", "venta", "cuenta", "banco", "hucha", "ahorro",
  "noticia", "periódico", "revista", "radio", "televisión", "programa",
  "película", "dibujos", "canción", "baile", "concierto", "instrumento",
  "guitarra", "piano", "flauta", "tambor", "trompeta", "violín", "orquesta",
  "ritmo", "melodía", "voz", "coro", "escenario", "función", "entrada",
  "ordenador", "pantalla", "teclado", "ratón", "tableta", "móvil", "teléfono",
  "mensaje", "correo", "carta", "sobre", "sello", "paquete", "foto", "cámara",
  "imagen", "vídeo", "botón", "pila", "batería", "enchufe", "cable", "bombilla",
  "linterna", "vela", "cerilla", "mechero", "tijeras", "aguja", "hilo",
  "historia", "leyenda", "misterio", "aventura", "peligro", "riesgo",
  "rescate", "héroe", "heroína", "villano", "pista", "huella", "señal",
  "mensajero", "camino", "atajo", "meta", "premio", "sorteo", "azar",
  "grupo", "pareja", "montón", "rebaño", "manada", "bandada", "enjambre",
  "racimo", "ramo", "colección", "lista", "orden", "turno", "cola", "sitio",
  "lugar", "zona", "parte", "trozo", "pedazo", "resto", "conjunto", "unión",
  "ejemplo", "modelo", "copia", "original", "detalle", "diferencia",
  "parecido", "cambio", "aumento", "descenso", "subida", "bajada", "vuelta",
  "salida", "entrada", "llegada", "regreso", "paso", "parada", "descanso",
  "silencio", "ruido", "sonido", "eco", "olor", "aroma", "perfume", "sabor",
  "gusto", "tacto", "vista", "oído", "olfato", "sentido", "vida", "muerte",
  "edad", "infancia", "juventud", "futuro", "pasado", "presente", "suceso",
  "hecho", "caso", "causa", "efecto", "motivo", "resultado", "solución",
  "duda", "prueba", "intento", "error", "acierto", "fallo", "éxito", "fracaso",
];

const ADJETIVOS = [
  // Se generan solos el femenino (-o → -a) y los plurales.
  "alto", "bajo", "gordo", "delgado", "grande", "pequeño", "enorme", "diminuto",
  "largo", "corto", "ancho", "estrecho", "grueso", "fino", "hondo", "profundo",
  "nuevo", "viejo", "antiguo", "moderno", "joven", "mayor", "menor",
  "bueno", "malo", "mejor", "peor", "bonito", "feo", "hermoso", "precioso",
  "limpio", "sucio", "ordenado", "revuelto", "claro", "oscuro", "brillante",
  "blanco", "negro", "rojo", "azul", "verde", "amarillo", "naranja", "rosa",
  "morado", "gris", "marrón", "dorado", "plateado", "celeste", "violeta",
  "caliente", "frío", "templado", "helado", "ardiente", "fresco", "seco",
  "mojado", "húmedo", "duro", "blando", "suave", "áspero", "liso", "rugoso",
  "dulce", "salado", "amargo", "ácido", "sabroso", "rico", "soso", "picante",
  "rápido", "lento", "veloz", "ligero", "pesado", "fuerte", "débil", "flojo",
  "sano", "enfermo", "cansado", "despierto", "dormido", "vivo", "muerto",
  "alegre", "triste", "contento", "enfadado", "nervioso", "tranquilo",
  "valiente", "cobarde", "tímido", "atrevido", "amable", "simpático",
  "antipático", "cariñoso", "generoso", "egoísta", "sincero", "mentiroso",
  "listo", "tonto", "sabio", "torpe", "hábil", "curioso", "atento",
  "educado", "travieso", "obediente", "vago", "trabajador", "estudioso",
  "famoso", "conocido", "extraño", "raro", "normal", "corriente", "especial",
  "importante", "necesario", "útil", "inútil", "fácil", "difícil", "sencillo",
  "complicado", "posible", "imposible", "cierto", "falso", "verdadero",
  "lleno", "vacío", "abierto", "cerrado", "roto", "entero", "completo",
  "justo", "injusto", "igual", "distinto", "parecido", "contrario",
  "primero", "segundo", "tercero", "último", "único", "doble", "medio",
  "redondo", "cuadrado", "recto", "torcido", "plano", "puntiagudo",
  "silencioso", "ruidoso", "sonoro", "luminoso", "sombrío", "soleado",
  "nublado", "lluvioso", "ventoso", "caluroso", "invernal", "veraniego",
  "salvaje", "doméstico", "manso", "bravo", "peludo", "pelado", "rayado",
  "manchado", "colorido", "pálido", "moreno", "rubio", "castaño", "canoso",
  "barato", "caro", "gratuito", "pobre", "rico", "lujoso", "humilde",
  "cercano", "lejano", "próximo", "vecino", "urgente", "temprano", "tardío",
];

const VERBOS = [
  // Infinitivos; las formas regulares se generan solas.
  "hablar", "cantar", "bailar", "saltar", "andar", "caminar", "correr",
  "nadar", "volar", "jugar", "ganar", "perder", "empatar", "lanzar", "tirar",
  "coger", "soltar", "agarrar", "tocar", "golpear", "empujar", "arrastrar",
  "levantar", "bajar", "subir", "caer", "tropezar", "resbalar", "rodar",
  "mirar", "ver", "observar", "buscar", "encontrar", "hallar", "esconder",
  "escuchar", "oír", "oler", "probar", "saborear", "comer", "beber", "tragar",
  "masticar", "morder", "cocinar", "freír", "hervir", "asar", "mezclar",
  "batir", "cortar", "pelar", "partir", "repartir", "servir", "desayunar",
  "almorzar", "merendar", "cenar", "dormir", "soñar", "despertar", "descansar",
  "vivir", "nacer", "crecer", "cumplir", "envejecer", "morir", "respirar",
  "estudiar", "aprender", "enseñar", "leer", "escribir", "borrar", "copiar",
  "dibujar", "pintar", "colorear", "recortar", "pegar", "doblar", "subrayar",
  "contar", "sumar", "restar", "multiplicar", "dividir", "medir", "pesar",
  "calcular", "resolver", "acertar", "fallar", "repasar", "recordar",
  "olvidar", "pensar", "imaginar", "inventar", "crear", "descubrir",
  "preguntar", "responder", "contestar", "explicar", "entender", "comprender",
  "saber", "conocer", "opinar", "decidir", "elegir", "escoger", "comparar",
  "trabajar", "descansar", "ayudar", "colaborar", "compartir", "prestar",
  "devolver", "regalar", "recibir", "entregar", "enviar", "mandar", "traer",
  "llevar", "cargar", "guardar", "ordenar", "colocar", "limpiar", "ensuciar",
  "lavar", "secar", "planchar", "coser", "barrer", "fregar", "recoger",
  "arreglar", "romper", "estropear", "reparar", "construir", "montar",
  "desmontar", "clavar", "atornillar", "pintar", "decorar", "adornar",
  "abrir", "cerrar", "encender", "apagar", "enchufar", "llamar", "avisar",
  "saludar", "despedir", "invitar", "visitar", "acompañar", "esperar",
  "llegar", "salir", "entrar", "pasar", "cruzar", "girar", "torcer", "seguir",
  "parar", "frenar", "acelerar", "conducir", "viajar", "montar", "pasear",
  "escalar", "acampar", "pescar", "cazar", "sembrar", "plantar", "regar",
  "cultivar", "cosechar", "podar", "cavar", "recolectar", "ordeñar",
  "querer", "amar", "odiar", "gustar", "encantar", "molestar", "enfadar",
  "alegrar", "animar", "consolar", "calmar", "asustar", "temer", "llorar",
  "reír", "sonreír", "gritar", "susurrar", "callar", "charlar", "conversar",
  "discutir", "pelear", "perdonar", "mentir", "engañar", "prometer", "jurar",
  "cuidar", "proteger", "defender", "salvar", "rescatar", "curar", "sanar",
  "vendar", "operar", "vacunar", "toser", "estornudar", "marear", "doler",
  "comprar", "vender", "pagar", "cobrar", "gastar", "ahorrar", "cambiar",
  "regatear", "encargar", "envolver", "empaquetar", "pesar", "costar",
  "empezar", "comenzar", "terminar", "acabar", "continuar", "durar",
  "tardar", "adelantar", "atrasar", "madrugar", "aprovechar", "intentar",
  "probar", "conseguir", "lograr", "practicar", "entrenar", "competir",
  "participar", "celebrar", "festejar", "aplaudir", "silbar", "animar",
  "tocar", "afinar", "ensayar", "actuar", "representar", "disfrazar",
  "narrar", "relatar", "describir", "resumir", "traducir", "pronunciar",
  "deletrear", "rimar", "recitar", "declamar", "publicar", "imprimir",
  "fotografiar", "grabar", "filmar", "navegar", "teclear", "programar",
  "usar", "utilizar", "manejar", "funcionar", "servir", "necesitar",
  "faltar", "sobrar", "llenar", "vaciar", "añadir", "quitar", "sacar",
  "meter", "introducir", "apretar", "aflojar", "atar", "desatar", "enredar",
  "estirar", "encoger", "doblar", "arrugar", "alisar", "envolver",
  "mojar", "secar", "derretir", "congelar", "calentar", "enfriar", "quemar",
  "apagar", "iluminar", "alumbrar", "brillar", "reflejar", "sombrear",
  "sonar", "resonar", "retumbar", "crujir", "chirriar", "ladrar", "maullar",
  "relinchar", "mugir", "balar", "cacarear", "piar", "rugir", "aullar",
  "zumbar", "picar", "volar", "anidar", "galopar", "trotar", "reptar",
  "trepar", "bucear", "flotar", "hundir", "remar", "navegar", "naufragar",
  "llover", "nevar", "granizar", "tronar", "relampaguear", "amanecer",
  "anochecer", "atardecer", "soplar", "ventear", "escampar", "despejar",
];

const OTRAS_PALABRAS = [
  // Palabras cortas y comodines útiles del juego (adverbios,
  // preposiciones, pronombres… que también valen como palabra).
  "sí", "no", "ya", "aún", "hoy", "ayer", "mañana", "ahora", "luego", "antes",
  "después", "pronto", "tarde", "siempre", "nunca", "jamás", "quizá", "acaso",
  "aquí", "ahí", "allí", "allá", "cerca", "lejos", "dentro", "fuera",
  "arriba", "abajo", "delante", "detrás", "encima", "debajo", "enfrente",
  "bien", "mal", "mejor", "peor", "mucho", "poco", "bastante", "demasiado",
  "más", "menos", "muy", "casi", "solo", "también", "tampoco", "además",
  "entre", "hacia", "hasta", "desde", "durante", "según", "contra", "sobre",
  "ante", "bajo", "tras", "con", "sin", "por", "para", "de", "en", "una",
  "uno", "dos", "tres", "seis", "siete", "ocho", "nueve", "diez", "once",
  "doce", "trece", "veinte", "treinta", "cuarenta", "cincuenta", "cien",
  "mil", "primero", "él", "ella", "ellos", "ellas", "nosotros", "vosotros",
  "mío", "tuyo", "suyo", "nuestro", "vuestro", "este", "ese", "aquel",
  "esta", "esa", "aquella", "algo", "nada", "nadie", "alguien", "cada",
  "otro", "otra", "mismo", "misma", "cual", "quien", "cuando", "donde",
  "como", "porque", "aunque", "mientras", "pero", "sino", "pues",
];

// ---------- expansión automática ----------

function plural(palabra) {
  const p = palabra;
  if (/[aeiouáéó]$/.test(p)) return p + "s";
  if (/z$/.test(p)) return p.slice(0, -1) + "ces";
  if (/s$/.test(p)) return null; // lunes, crisis…: igual en plural
  if (/[íú]$/.test(p)) return p + "es";
  return p + "es";
}

// Conjugación regular. Genera las formas más habituales; con los
// verbos irregulares alguna forma no existirá de verdad (o faltará
// la buena): para eso está el comodín de validación del docente.
function formasVerbo(infinitivo) {
  const formas = [infinitivo];
  const raiz = infinitivo.slice(0, -2);
  const term = infinitivo.slice(-2);
  const anadir = (sufijos) => { for (const s of sufijos) formas.push(raiz + s); };

  if (term === "ar") {
    anadir(["o", "as", "a", "amos", "áis", "an"]);                    // presente
    anadir(["aba", "abas", "ábamos", "abais", "aban"]);               // imperfecto
    anadir(["é", "aste", "ó", "asteis", "aron"]);                     // indefinido
    anadir(["aré", "arás", "ará", "aremos", "aréis", "arán"]);        // futuro
    anadir(["aría", "arías", "aríamos", "aríais", "arían"]);          // condicional
    anadir(["e", "es", "emos", "éis", "en"]);                         // subjuntivo
    anadir(["ando", "ado", "ada", "ados", "adas"]);                   // gerundio y participios
  } else if (term === "er" || term === "ir") {
    if (term === "er") anadir(["o", "es", "e", "emos", "éis", "en"]); // presente -er
    else anadir(["o", "es", "e", "imos", "ís", "en"]);                // presente -ir
    anadir(["ía", "ías", "íamos", "íais", "ían"]);                    // imperfecto
    anadir(["í", "iste", "ió", "imos", "isteis", "ieron"]);           // indefinido
    const f = infinitivo; // futuro y condicional se forman sobre el infinitivo
    formas.push(f + "é", f + "ás", f + "á", f + "emos", f + "éis", f + "án");
    formas.push(f + "ía", f + "ías", f + "íamos", f + "íais", f + "ían");
    anadir(["a", "as", "amos", "áis", "an"]);                         // subjuntivo
    anadir(["iendo", "ido", "ida", "idos", "idas"]);                  // gerundio y participios
  }
  return formas;
}

// ---------- construcción del diccionario ----------

// Mapa: forma normalizada (sin tildes, mayúsculas) → forma bonita
// para mostrar. Se construye una sola vez al cargar el módulo.
const FORMAS = new Map();

function anadirForma(display) {
  if (!display) return;
  const norma = normalizarPalabra(display);
  if (norma.length < 2) return;
  if (!FORMAS.has(norma)) FORMAS.set(norma, display);
}

for (const s of SUSTANTIVOS) { anadirForma(s); anadirForma(plural(s)); }
for (const a of ADJETIVOS) {
  anadirForma(a); anadirForma(plural(a));
  if (a.endsWith("o")) {
    const fem = a.slice(0, -1) + "a";
    anadirForma(fem); anadirForma(plural(fem));
  }
}
for (const v of VERBOS) { for (const f of formasVerbo(v)) anadirForma(f); }
for (const o of OTRAS_PALABRAS) { anadirForma(o); }

// ---------- API pública ----------

// ¿Está la palabra en el diccionario de la app?
export function enDiccionario(palabra) {
  return FORMAS.has(normalizarPalabra(palabra));
}

// Forma "bonita" (con tildes) para mostrar, si la conocemos.
export function formaBonita(palabra) {
  return FORMAS.get(normalizarPalabra(palabra)) || String(palabra || "").toLowerCase();
}

// Todas las formas normalizadas (para el buscador de la mejor palabra).
export function todasLasFormas() {
  return FORMAS.keys();
}

// Enlace para comprobar una palabra dudosa en el diccionario de la RAE.
export function enlaceRae(palabra) {
  return "https://dle.rae.es/" + encodeURIComponent(String(palabra || "").toLowerCase());
}

export function tamanoDiccionario() {
  return FORMAS.size;
}
