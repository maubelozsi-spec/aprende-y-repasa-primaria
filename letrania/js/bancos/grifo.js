// ============================================================
// Letrania · banco de la Senda del Grifo (grupo B, ACS nivel de 3.º).
// Fichas 1-34, sacadas de las fichas del curso:
// frases más cortas y palabras más sencillas que en la Senda del
// Dragón, con los mismos temas.
//
// Recordatorio (ver util.js): en una lista ya publicada solo se añaden
// palabras AL FINAL; los ids de los ítems dependen de su posición.
// ============================================================
(function () {
  "use strict";
  const B = window.LetraniaBanco;
  const S = "grifo";

  // 1 · Mayúscula y punto
  B.registrar(S, 1, {
    plantilla: "ordenar",
    titulo: "Mayúscula y punto",
    items: B.ordenar(
      [
        "El árbol es grande.",
        "Lucía recoge hojas.",
        "Las hojas caen.",
        "Hugo pinta un mural.",
        "El otoño llega.",
        "La maestra habla.",
        "Hace mucho viento.",
        "Mi casa es azul.",
        "El gato duerme.",
        "Ana come pan.",
        "La hoja es marrón.",
        "Hoy llueve mucho.",
        "Mi perro salta.",
        "Pedro lee un libro.",
        "El sol sale.",
        "La rama es larga.",
        "Me gusta el otoño.",
        "Las nubes son grises.",
        "Mi abuela cocina.",
        "El patio es grande.",
        "Lucía tiene frío.",
        "Los niños corren.",
        "Tengo un paraguas.",
        "Hugo recoge una hoja.",
      ],
      "Una oración empieza con mayúscula y termina con un punto."
    ),
  });

  // 2 · Separar palabras
  B.registrar(S, 2, {
    plantilla: "cortar",
    titulo: "Separar palabras",
    items: B.cortarPalabras(
      [
        "Los barcos llegan.",
        "El mar está frío.",
        "El marinero ve tierra.",
        "Hay tres barcos.",
        "La isla es verde.",
        "El barco es grande.",
        "Los peces nadan.",
        "El sol brilla.",
        "La niña mira el mar.",
        "Me gusta el barco.",
        "Las olas son altas.",
        "El capitán grita.",
        "Mi barco es azul.",
        "Veo una isla.",
        "Tengo un barco.",
        "La vela es blanca.",
        "Los niños juegan.",
        "Ana pesca un pez.",
        "El viaje es largo.",
        "Hoy es fiesta.",
      ],
      "Entre cada palabra dejamos un espacio."
    ),
  });

  // 3 · Las sílabas
  B.registrar(S, 3, {
    plantilla: "cortar",
    titulo: "Las sílabas",
    items: B.cortarSilabas([
      "pla.za", "fue.go", "bol.si.llo", "me.sa", "ga.to", "ca.mi.no", "pe.ra", "cas.ta.ña",
      "ma.no", "pa.pel", "a.bue.lo", "ca.sa", "sar.tén", "ca.rri.to", "pa.to", "lu.na",
      "ma.ri.po.sa", "pe.lo.ta", "ho.ja", "o.to.ño", "ve.la", "to.ma.te", "za.pa.to", "ni.ño",
      "sa.po", "ca.ra.co.la",
    ]),
  });

  // 4 · Sílaba tónica
  B.registrar(S, 4, {
    plantilla: "caza",
    titulo: "Sílaba tónica",
    items: B.cazaTonica([
      "fan.TAS.ma", "FLO.res", "a.BUE.la", "cas.TA.ña", "ca.la.BA.za", "BRU.ja", "ca.ra.ME.lo", "NUE.ces",
      "ca.MIÓN", "ME.sa", "LU.na", "so.FÁ", "re.LOJ", "PE.rro", "ma.ri.PO.sa", "za.PA.to",
      "ra.TÓN", "GA.to", "pe.LO.ta", "ca.FÉ", "ÁR.bol", "TA.za", "co.LE.gio", "NI.ño",
    ]),
  });

  // 5 · m antes de p y b
  B.registrar(S, 5, {
    plantilla: "puente",
    titulo: "m antes de p y b",
    items: B.puente(["m", "n"], [
      { regla: "Antes de p siempre se escribe m: mp.", palabras: ["ca[m]po", "co[m]prar", "lá[m]para", "e[m]pezar", "ca[m]peón", "li[m]pio", "tro[m]peta", "ta[m]poco"] },
      { regla: "Antes de b siempre se escribe m: mb.", palabras: ["ta[m]bién", "me[m]brillo", "ho[m]bre", "so[m]bra", "ca[m]bio", "ta[m]bor", "no[m]bre", "ti[m]bre", "ho[m]bro", "so[m]brero"] },
      { regla: "Delante de las demás letras (t, c, z, v...) se escribe n.", palabras: ["pa[n]talón", "ve[n]tana", "ca[n]tar", "ma[n]zana", "co[n]tento", "mo[n]taña", "ca[n]ción", "pi[n]tura", "fue[n]te", "i[n]vierno"] },
    ], "¿m o n?"),
  });

  // 6 · r suave y rr fuerte
  B.registrar(S, 6, {
    plantilla: "puente",
    titulo: "r y rr",
    items: B.puente(["r", "rr"], [
      { regla: "Entre vocales, la r suave se escribe con una sola r.", palabras: ["ca[r]a", "pe[r]a", "ca[r]o", "pe[r]o", "ma[r]iposa", "ca[r]amelo", "ho[r]a", "to[r]o", "co[r]azón", "pi[r]ata"] },
      { regla: "Entre vocales, el sonido fuerte se escribe con rr.", palabras: ["guita[rr]a", "pe[rr]o", "to[rr]e", "ca[rr]etera", "ca[rr]o", "ba[rr]o", "co[rr]er", "go[rr]o", "ja[rr]a", "tie[rr]a"] },
      { regla: "Al principio de palabra suena fuerte, pero se escribe una sola r.", palabras: ["[r]itmo", "[r]osa", "[r]atón", "[r]uido", "[r]ey", "[r]ueda"] },
    ], "¿r o rr?"),
  });

  // 7 · ca, co, cu / que, qui
  B.registrar(S, 7, {
    plantilla: "puente",
    titulo: "c y qu",
    items: B.puente(["c", "qu"], [
      { regla: "Delante de a, o, u el sonido k se escribe con c: ca, co, cu.", palabras: ["[c]asa", "[c]olegio", "[c]artel", "[c]omida", "[c]una", "[c]ama", "[c]oche", "[c]uento", "[c]opa", "bo[c]a", "[c]aracol"] },
      { regla: "Delante de e, i el sonido k se escribe con qu: que, qui. La u no suena.", palabras: ["[qu]eso", "[qu]iero", "pe[qu]eño", "bos[qu]e", "[qu]ince", "pa[qu]ete", "ra[qu]eta", "[qu]ieto", "mos[qu]ito", "es[qu]í"] },
    ], "¿c o qu?"),
  });

  // 8 · za, zo, zu / ce, ci
  B.registrar(S, 8, {
    plantilla: "puente",
    titulo: "z y c",
    items: B.puente(["z", "c"], [
      { regla: "Delante de a, o, u el sonido z se escribe con z: za, zo, zu.", palabras: ["[z]apato", "[z]orro", "[z]umo", "ta[z]a", "po[z]o", "[z]anahoria", "ta[z]ón", "pi[z]arra", "abra[z]o", "cora[z]ón"] },
      { regla: "Delante de e, i el sonido z se escribe con c: ce, ci.", palabras: ["[c]ena", "[c]ine", "co[c]ina", "dul[c]e", "[c]ielo", "[c]erca", "[c]ien", "[c]ebolla", "pe[c]es", "lu[c]es"] },
    ], "¿z o c?"),
  });

  // 9 · ga, go, gu / gue, gui
  B.registrar(S, 9, {
    plantilla: "puente",
    titulo: "g y gu",
    items: B.puente(["g", "gu"], [
      { regla: "Delante de a, o, u el sonido g suave se escribe con g: ga, go, gu.", palabras: ["[g]ato", "[g]oma", "jue[g]o", "a[g]ua", "hormi[g]a", "[g]usano", "[g]orro", "ami[g]o", "pe[g]ar", "ma[g]o", "la[g]o"] },
      { regla: "Delante de e, i el sonido g suave se escribe con gu: gue, gui. La u no suena.", palabras: ["[gu]itarra", "man[gu]era", "[gu]isante", "[gu]erra", "ho[gu]era", "[gu]ía", "lle[gu]é", "jue[gu]e", "[gu]iso"] },
    ], "¿g o gu?"),
  });

  // 10 · El nombre
  B.registrar(S, 10, {
    plantilla: "cestas",
    titulo: "El nombre",
    items: B.cestas(
      ["Es un nombre", "No es un nombre"],
      [
        { cesta: 0, regla: (p) => "«" + p + "» es un nombre: dice cómo se llama una persona, un animal o una cosa.", palabras: ["pastor", "molino", "oveja", "caja", "estrella", "abuela", "belén", "portal", "río", "montaña", "figurita", "dinosaurio", "árbol", "salón"] },
        { cesta: 1, regla: (p) => "«" + p + "» no es un nombre: no nombra a una persona, un animal ni una cosa.", palabras: ["saltar", "verde", "comer", "bonito", "correr", "grande", "azul", "cantar", "dormir", "alto", "leer", "pequeño", "feliz"] },
      ],
      "¿Es un nombre?"
    ),
  });

  // 11 · Los nombres propios
  const MAYUS = (p) => p.charAt(0).toUpperCase() + p.slice(1);
  B.registrar(S, 11, {
    plantilla: "cestas",
    titulo: "Nombres propios",
    items: B.cestas(
      ["Propio (con mayúscula)", "Común"],
      [
        { cesta: 0, regla: (p) => "«" + MAYUS(p) + "» es un nombre propio: se escribe con mayúscula.", palabras: ["noa", "almería", "antonio", "españa", "hugo", "lucía", "sevilla", "madrid", "mario", "andalucía", "elena", "carmen", "europa"] },
        { cesta: 1, regla: (p) => "«" + p + "» es un nombre común: se escribe con minúscula.", palabras: ["abuelo", "bicicleta", "carta", "libro", "timbre", "puerta", "perro", "ciudad", "río", "mesa", "mar", "niña", "colegio"] },
      ],
      "¿Es un nombre propio o común?",
      (p, g) => (g.cesta === 0 ? MAYUS(p) : p)
    ),
  });

  // 12 · Singular y plural
  B.registrar(S, 12, {
    plantilla: "cestas",
    titulo: "El plural",
    items: B.cestas(
      ["Singular (uno)", "Plural (varios)"],
      [
        { cesta: 0, regla: (p) => "«" + p + "» está en singular: es uno solo.", palabras: ["haba", "prima", "roscón", "bollo", "rey", "regalo", "luz", "corona", "caramelo", "paje", "camello", "figurita"] },
        { cesta: 1, regla: (p) => "«" + p + "» está en plural: son varios.", palabras: ["frutas", "reyes", "coronas", "roscones", "figuritas", "regalos", "luces", "juguetes", "pajes", "camellos", "bollos", "primas"] },
      ],
      "¿Singular o plural?"
    ),
  });

  // ---------- Regiones 3 a 6 (fichas 13-34) ----------

  const HUECO = B.hueco;
  const PREG = (f) => ["¿Pregunta o exclamación?", f, ["¿ ?", "¡ !"], 0, "«¿" + f + "?» pregunta algo: va entre ¿ y ?.", "¿" + f + "?"];
  const EXCL = (f) => ["¿Pregunta o exclamación?", f, ["¿ ?", "¡ !"], 1, "«¡" + f + "!» cuenta una emoción: va entre ¡ y !.", "¡" + f + "!"];
  // Elegir una palabra entre tres: [palabra, buena, mala, mala]
  const TRES = (lista, enunciado, regla, pista) =>
    lista.map(([p, s, a, b], n) => Object.assign(HUECO(enunciado(p), "", s, [a, b], regla(p, s), n), { palabra: p, solucion: s, audio: p, pista: pista }));

  // 13 · ¿? y ¡!
  B.registrar(S, 13, {
    plantilla: "eco",
    titulo: "¿? y ¡!",
    items: B.elegir("eco", [
      PREG("Cómo te llamas"), EXCL("Qué susto"), PREG("Dónde está mi gato"), EXCL("Qué bonito"), PREG("Qué hora es"), EXCL("Cuidado"),
      PREG("Quieres jugar"), EXCL("Qué frío hace"), PREG("Cuántos años tienes"), EXCL("Hurra, hemos ganado"), PREG("Vienes al parque"), EXCL("Qué rico está"),
      PREG("Quién es ese niño"), EXCL("Qué alegría"), PREG("Dónde vives"), EXCL("Ay, me he caído"),
    ], { pista: "¿La frase pide una respuesta? Entonces es una pregunta." }),
  });

  // 14 · El género
  B.registrar(S, 14, {
    plantilla: "cestas",
    titulo: "El género",
    items: B.cestas(
      ["Masculino (el)", "Femenino (la)"],
      [
        { cesta: 0, regla: (p) => "Decimos «el " + p + "»: es masculino.", palabras: ["niño", "gato", "abuelo", "perro", "libro", "coche", "árbol", "sol", "león", "pan", "tío", "zapato"] },
        { cesta: 1, regla: (p) => "Decimos «la " + p + "»: es femenino.", palabras: ["niña", "gata", "abuela", "perra", "mesa", "casa", "flor", "luna", "leona", "nube", "tía", "silla"] },
      ],
      "¿Es masculino o femenino?"
    ).map((it) => Object.assign(it, { pista: "Ponle delante «el» o «la» y escucha cuál suena bien." })),
  });

  // 15 · El artículo
  B.registrar(S, 15, {
    plantilla: "puente",
    titulo: "El artículo",
    items: B.puente(["el", "la", "los", "las"], [
      { regla: "«el» va con palabras masculinas y en singular (uno).", palabras: ["[el] perro", "[el] coche", "[el] árbol", "[el] sol", "[el] libro", "[el] pez"] },
      { regla: "«la» va con palabras femeninas y en singular (una).", palabras: ["[la] mesa", "[la] luna", "[la] flor", "[la] casa", "[la] nube", "[la] mano"] },
      { regla: "«los» va con palabras masculinas y en plural (varios).", palabras: ["[los] perros", "[los] coches", "[los] árboles", "[los] libros", "[los] peces", "[los] niños"] },
      { regla: "«las» va con palabras femeninas y en plural (varias).", palabras: ["[las] mesas", "[las] flores", "[las] casas", "[las] nubes", "[las] manos", "[las] niñas"] },
    ], "¿el, la, los o las?"),
  });

  // 16 · El adjetivo
  B.registrar(S, 16, {
    plantilla: "caza",
    titulo: "El adjetivo",
    items: B.cazaPalabra(
      [
        "El gato es *negro*.", "La casa es *grande*.", "Tengo un lápiz *rojo*.", "La sopa está *caliente*.", "Mi perro es *pequeño*.",
        "La flor es *bonita*.", "El agua está *fría*.", "Ana es *alta*.", "El sol es *amarillo*.", "La tortuga es *lenta*.",
        "El tren es *rápido*.", "La manzana está *rica*.", "El cielo está *azul*.", "Mi abuelo es *simpático*.",
      ],
      "Caza la palabra que dice cómo es.",
      (o) => "«" + o + "» es el adjetivo: dice cómo es."
    ),
  });

  // 17 · Sinónimos
  B.registrar(S, 17, {
    plantilla: "puente",
    titulo: "Sinónimos",
    items: TRES(
      [
        ["contento", "alegre", "triste", "alto"], ["bonito", "precioso", "feo", "lento"], ["grande", "enorme", "pequeño", "rojo"], ["rápido", "veloz", "lento", "frío"],
        ["empezar", "comenzar", "acabar", "comer"], ["hablar", "decir", "callar", "saltar"], ["mirar", "ver", "oír", "oler"], ["casa", "hogar", "coche", "mesa"],
        ["caminar", "andar", "correr", "nadar"], ["coger", "agarrar", "soltar", "pintar"], ["miedo", "susto", "risa", "sueño"], ["listo", "inteligente", "tonto", "gordo"],
      ],
      (p) => "¿Qué palabra significa lo mismo que «" + p + "»?",
      (p, s) => "«" + p + "» y «" + s + "» significan lo mismo: son sinónimos.",
      "Cambia una por otra en una frase: si se entiende igual, son sinónimos."
    ),
  });

  // 18 · Antónimos
  B.registrar(S, 18, {
    plantilla: "puente",
    titulo: "Antónimos",
    items: TRES(
      [
        ["alto", "bajo", "grande", "largo"], ["frío", "caliente", "helado", "fresco"], ["día", "noche", "sol", "tarde"], ["abrir", "cerrar", "entrar", "mirar"],
        ["grande", "pequeño", "enorme", "alto"], ["limpio", "sucio", "nuevo", "seco"], ["subir", "bajar", "saltar", "correr"], ["lleno", "vacío", "grande", "rico"],
        ["rápido", "lento", "veloz", "fuerte"], ["triste", "alegre", "serio", "cansado"], ["dentro", "fuera", "encima", "cerca"], ["ganar", "perder", "jugar", "correr"],
      ],
      (p) => "¿Qué palabra significa lo contrario de «" + p + "»?",
      (p, s) => "«" + p + "» y «" + s + "» significan lo contrario: son antónimos.",
      "Busca la palabra que dice justo lo opuesto."
    ),
  });

  // 19 · El verbo
  B.registrar(S, 19, {
    plantilla: "caza",
    titulo: "El verbo",
    items: B.cazaPalabra(
      [
        "El perro *corre* en el parque.", "Ana *canta* una canción.", "Mi abuela *cocina* lentejas.", "Los niños *juegan* al fútbol.",
        "El pájaro *vuela* alto.", "Yo *leo* un cuento.", "La tortuga *come* hierba.", "Pedro *salta* la cuerda.",
        "Mamá *pinta* la puerta.", "El bebé *duerme* mucho.", "Lucía *dibuja* un sol.", "Los peces *nadan* en el río.",
      ],
      "Caza el verbo: la palabra que dice lo que se hace.",
      (o) => "«" + o + "» es el verbo: dice la acción, lo que se hace."
    ),
  });

  // 20 · Ayer, hoy y mañana
  B.registrar(S, 20, {
    plantilla: "cestas",
    titulo: "Ayer, hoy y mañana",
    items: B.cestas(
      ["Ayer", "Hoy", "Mañana"],
      [
        { cesta: 0, regla: (p) => "«Ayer " + p + "»: ya pasó.", palabras: ["comí", "jugué", "canté", "salté", "bebí", "pinté", "corrí", "dormí"] },
        { cesta: 1, regla: (p) => "«Hoy " + p + "»: pasa ahora.", palabras: ["como", "juego", "canto", "salto", "bebo", "pinto", "corro", "duermo"] },
        { cesta: 2, regla: (p) => "«Mañana " + p + "»: todavía no ha pasado.", palabras: ["comeré", "jugaré", "cantaré", "saltaré", "beberé", "pintaré", "correré", "dormiré"] },
      ],
      "¿Cuándo pasa?"
    ).map((it) => Object.assign(it, { pista: "Di «ayer», «hoy» o «mañana» delante y escucha cuál encaja." })),
  });

  // 21 · La b
  B.registrar(S, 21, {
    plantilla: "puente",
    titulo: "La b",
    items: B.puente(["b", "v"], [
      { regla: "Antes de l y de r se escribe b: bl, br.", palabras: ["[b]lanco", "li[b]ro", "[b]razo", "ta[b]la", "ha[b]lar", "co[b]re", "nie[b]la", "a[b]rigo"] },
      { regla: "Después de m se escribe b: mb.", palabras: ["tam[b]or", "som[b]ra", "nom[b]re", "hom[b]ro", "cam[b]io"] },
      { regla: "Las palabras que empiezan por bu-, bur- y bus- se escriben con b.", palabras: ["[b]urro", "[b]uzón", "[b]uscar", "[b]urbuja"] },
      { regla: "Los verbos acabados en -aba, -abas, -aban llevan b.", palabras: ["juga[b]a", "canta[b]a", "salta[b]an", "pinta[b]as"] },
      { regla: (p) => "«" + p + "» se escribe con v: hay que recordarla.", palabras: ["[v]aca", "[v]erde", "u[v]a", "nue[v]e", "lla[v]e"] },
    ], "¿b o v?"),
  });

  // 22 · La h
  B.registrar(S, 22, {
    plantilla: "puente",
    titulo: "La h",
    items: B.puente(["h", "sin h"], [
      { regla: "Las palabras que empiezan por hie- y hue- llevan h.", palabras: ["[h]ielo", "[h]uevo", "[h]ueso", "[h]uerto", "[h]ierba"] },
      { regla: (p) => "«" + p + "» lleva h. La h no suena, por eso hay que recordarla.", palabras: ["[h]ola", "[h]oja", "[h]ormiga", "[h]ora", "[h]oy", "[h]ermano", "[h]elado", "[h]ada", "[h]ilo", "[h]umo"] },
      { regla: (p) => "«" + p + "» no lleva h.", palabras: ["[]oso", "[]uva", "[]isla", "[]ojo", "[]agua", "[]árbol", "[]ocho", "[]amigo", "[]abeja", "[]ala"] },
    ], "¿Lleva h?"),
  });

  // 23 · La coma
  B.registrar(S, 23, {
    plantilla: "espejo",
    titulo: "La coma",
    items: B.espejoPares([
      ["Compré pan, leche y fruta.", "Compré pan leche y fruta.", "Entre las cosas de una lista se pone coma."],
      ["Tengo un gato, un perro y un pez.", "Tengo un gato, un perro, y un pez.", "Antes de la y no se pone coma."],
      ["Ana, ven aquí.", "Ana ven aquí.", "Cuando llamamos a alguien, después de su nombre va coma."],
      ["Me gustan las peras, las fresas y las uvas.", "Me gustan las peras las fresas y las uvas.", "Entre las cosas de una lista se pone coma."],
      ["Mamá, tengo hambre.", "Mamá tengo hambre.", "Cuando llamamos a alguien, después de su nombre va coma."],
      ["En mi estuche hay lápices, gomas y ceras.", "En mi estuche hay lápices, gomas, y ceras.", "Antes de la y no se pone coma."],
      ["Luis, Marta y Ana juegan.", "Luis Marta y Ana juegan.", "Entre los nombres de una lista se pone coma."],
      ["Papá, mira el arcoíris.", "Papá mira el arcoíris.", "Cuando llamamos a alguien, después de su nombre va coma."],
      ["Comimos sopa, pollo y flan.", "Comimos sopa, pollo, y flan.", "Antes de la y no se pone coma."],
      ["Pedro, ¿vienes?", "Pedro ¿vienes?", "Cuando llamamos a alguien, después de su nombre va coma."],
    ], "¿Cuál tiene bien las comas?", null, "Lee despacio: la coma es una pausa pequeña."),
  });

  // 24 · ll e y
  B.registrar(S, 24, {
    plantilla: "puente",
    titulo: "ll e y",
    items: B.puente(["ll", "y"], [
      { regla: "Las palabras acabadas en -illo e -illa llevan ll.", palabras: ["pasi[ll]o", "bocadi[ll]o", "zapati[ll]a", "ardi[ll]a", "cuchi[ll]o", "ventani[ll]a"] },
      { regla: "Al final de palabra, si suena i, se escribe y.", palabras: ["re[y]", "ho[y]", "mu[y]", "vo[y]", "so[y]"] },
      { regla: (p) => "«" + p + "» se escribe con ll: hay que recordarla.", palabras: ["[ll]uvia", "[ll]ave", "ca[ll]e", "ga[ll]ina", "estre[ll]a", "po[ll]o", "si[ll]a"] },
      { regla: (p) => "«" + p + "» se escribe con y: hay que recordarla.", palabras: ["[y]ema", "[y]ogur", "pa[y]aso", "pla[y]a", "ra[y]o", "jo[y]a"] },
    ], "¿ll o y?"),
  });

  // 25 · Ordenar una historia (tres pasos)
  B.registrar(S, 25, {
    plantilla: "ordenar",
    titulo: "Ordenar una historia",
    items: B.ordenarPiezas(
      [
        ["Primero, planto una semilla.", "Después, la riego.", "Al final, sale una flor."],
        ["Primero, me levanto.", "Después, desayuno.", "Al final, voy al cole."],
        ["Primero, cojo la bici.", "Después, me pongo el casco.", "Al final, salgo a pasear."],
        ["Primero, Rosa amasa el pan.", "Después, lo mete en el horno.", "Al final, lo vende."],
        ["Primero, escribo la carta.", "Después, la meto en un sobre.", "Al final, la echo al buzón."],
        ["Primero, saco la tortuga.", "Después, le doy de comer.", "Al final, la guardo en su casa."],
        ["Primero, me pongo el bañador.", "Después, me echo crema.", "Al final, me baño en el mar."],
        ["Primero, nos lavamos las manos.", "Después, comemos.", "Al final, recogemos la mesa."],
        ["Primero, se nubla el cielo.", "Después, llueve mucho.", "Al final, sale el arcoíris."],
      ],
      "Ordena la historia: ¿qué pasa primero?",
      "«Primero» va al empezar, «después» en medio y «al final» al terminar."
    ),
  });

  // 26 · Describir un animal (la tortuga mora)
  B.registrar(S, 26, {
    plantilla: "cestas",
    titulo: "Describir un animal",
    items: B.cestas(
      ["Cómo es", "Dónde vive", "Qué come"],
      [
        { cesta: 0, regla: "Dice cómo es la tortuga: su cuerpo.", palabras: ["Tiene un caparazón duro.", "Es pequeña y lenta.", "Tiene cuatro patas cortas.", "Su caparazón es marrón y amarillo.", "No tiene dientes."] },
        { cesta: 1, regla: "Dice dónde vive la tortuga.", palabras: ["Vive en el campo de Almería.", "Vive entre matorrales.", "Se esconde bajo las piedras.", "En invierno duerme bajo tierra."] },
        { cesta: 2, regla: "Dice qué come la tortuga.", palabras: ["Come hierbas.", "Come flores silvestres.", "Le gustan las hojas tiernas.", "A veces come frutos caídos."] },
      ],
      "La tortuga mora: ¿qué nos dice esta frase?"
    ),
  });

  // 27 · El diálogo
  B.registrar(S, 27, {
    plantilla: "espejo",
    titulo: "El diálogo",
    items: B.espejoPares([
      ["—Hola —dijo Ana.", "Hola dijo Ana."],
      ["—¿Juegas? —preguntó Luis.", "¿Juegas? preguntó Luis."],
      ["—¡Qué bien! —gritó Marta.", "¡Qué bien! gritó Marta."],
      ["—Buenos días —dijo la maestra.", "Buenos días dijo la maestra."],
      ["—Sí —contestó Pedro.", "Sí contestó Pedro."],
      ["—¿Vienes? —preguntó mamá.", "¿Vienes? preguntó mamá."],
      ["—Gracias —dijo Hugo.", "Gracias dijo Hugo."],
      ["—Adiós —dijo el abuelo.", "Adiós dijo el abuelo."],
    ], "¿Cuál está bien escrito?", "En un diálogo, lo que dice cada personaje empieza con una raya (—). Otra raya separa «dijo», «preguntó»…", "Busca las rayas largas (—)."),
  });

  // 28 · ge, gi, je, ji
  B.registrar(S, 28, {
    plantilla: "puente",
    titulo: "ge, gi, je, ji",
    items: B.puente(["g", "j"], [
      { regla: "Los verbos acabados en -ger y -gir se escriben con g.", palabras: ["co[g]er", "reco[g]er", "ele[g]ir", "esco[g]er", "prote[g]er"] },
      { regla: "Las palabras con gen llevan g.", palabras: ["[g]ente", "ima[g]en", "[g]enio"] },
      { regla: "Las palabras acabadas en -aje llevan j.", palabras: ["via[j]e", "gara[j]e", "equipa[j]e", "tra[j]e"] },
      { regla: (p) => "«" + p + "» se escribe con g: hay que recordarla.", palabras: ["[g]irasol", "[g]igante", "má[g]ico", "[g]emelos"] },
      { regla: (p) => "«" + p + "» se escribe con j: hay que recordarla.", palabras: ["[j]irafa", "[j]efe", "[j]ersey", "ti[j]eras", "con[j]unto"] },
    ], "¿g o j?"),
  });

  // 29 · Familias de palabras
  B.registrar(S, 29, {
    plantilla: "puente",
    titulo: "Familias de palabras",
    items: TRES(
      [
        ["pan", "panadero", "pantalón", "panda"], ["flor", "florero", "flotar", "flaco"], ["mar", "marinero", "martes", "marco"], ["zapato", "zapatero", "zanahoria", "zarpa"],
        ["leche", "lechero", "lechuga", "lejos"], ["libro", "librería", "libre", "lima"], ["sal", "salero", "salir", "salto"], ["papel", "papelera", "papá", "pala"],
        ["pez", "pescado", "peso", "pelo"], ["árbol", "arboleda", "arco", "arena"],
      ],
      (p) => "¿Qué palabra es de la familia de «" + p + "»?",
      (p, s) => "«" + s + "» viene de «" + p + "»: son de la misma familia.",
      "Busca la palabra que tiene dentro «la misma palabra» y que tiene que ver con ella."
    ),
  });

  // 30 · Pronombres
  const PRON = ["Yo", "Tú", "Él", "Ella", "Nosotros", "Ellos", "Ellas"];
  const PRO = [
    ["Ana canta.", "Ella", "_ canta."], ["Pedro corre.", "Él", "_ corre."], ["Los niños juegan.", "Ellos", "_ juegan."], ["Las niñas bailan.", "Ellas", "_ bailan."],
    ["Mi abuela cocina.", "Ella", "_ cocina."], ["El perro ladra.", "Él", "_ ladra."], ["Luis y yo leemos.", "Nosotros", "_ leemos."], ["Mis primos nadan.", "Ellos", "_ nadan."],
    ["La tortuga come.", "Ella", "_ come."], ["Mis tías pasean.", "Ellas", "_ pasean."],
  ];
  B.registrar(S, 30, {
    plantilla: "puente",
    titulo: "Pronombres",
    items: PRO.map(([frase, buena, hueco], n) => {
      const otras = PRON.filter((x) => x !== buena);
      return Object.assign(HUECO("«" + frase + "» ¿Qué palabra puede ir en su lugar?", hueco, buena, [otras[n % otras.length], otras[(n + 3) % otras.length]], "En «" + frase + "» podemos decir «" + buena + "» en vez del nombre.", n), {
        pista: "¿Es uno o son varios? ¿Chico o chica?",
      });
    }),
  });

  // 31 · La carta
  B.registrar(S, 31, {
    plantilla: "cestas",
    titulo: "La carta",
    items: B.cestas(
      ["Fecha", "Saludo", "Lo que cuento", "Despedida y firma"],
      [
        { cesta: 0, regla: "La fecha va arriba.", palabras: ["Almería, 5 de mayo de 2027", "Níjar, 2 de abril de 2027", "Vera, 10 de marzo de 2027"] },
        { cesta: 1, regla: "El saludo va al empezar.", palabras: ["Querida abuela:", "Hola, Carla:", "Querido Pedro:"] },
        { cesta: 2, regla: "En medio cuento lo que quiero decir.", palabras: ["Ayer fui a la playa.", "Tengo un perro nuevo.", "Te echo mucho de menos.", "En el cole hacemos un mural."] },
        { cesta: 3, regla: "Al final me despido y pongo mi nombre.", palabras: ["Un beso, Lucía", "Hasta pronto, Hugo", "Un abrazo, Carla"] },
      ],
      "¿En qué parte de la carta va?"
    ),
  });

  // 32 · Agudas y llanas
  B.registrar(S, 32, {
    plantilla: "cestas",
    titulo: "Agudas y llanas",
    items: B.cestasAcento(
      [
        "ba.LÓN", "ca.MIÓN", "ra.TÓN", "re.LOJ", "pa.PEL", "so.FÁ", "ca.FÉ", "co.LOR", "ma.MÁ", "a.VIÓN", "pa.RED", "jar.DÍN",
        "ME.sa", "CA.sa", "LÁ.piz", "ÁR.bol", "PE.rro", "LU.na", "ca.MI.sa", "za.PA.to", "FÁ.cil", "LI.bro", "mo.CHI.la", "DUL.ce",
      ],
      ["aguda", "llana"]
    ),
  });

  // 33 · La tilde
  B.registrar(S, 33, {
    plantilla: "espejo",
    titulo: "La tilde",
    items: B.espejoTilde(
      ["ba.LÓN", "ca.MIÓN", "ra.TÓN", "so.FÁ", "ca.FÉ", "ma.MÁ", "a.VIÓN", "jar.DÍN", "LÁ.piz", "ÁR.bol", "FÁ.cil", "ME.sa", "CA.sa", "co.LOR", "pa.PEL", "LU.nes", "a.ZÚ.car", "MÓ.vil"],
      "¿Cuál está bien escrita?"
    ),
  });

  // 34 · Gran repaso
  B.registrar(S, 34, { plantilla: "mixta", titulo: "Gran repaso", items: B.repaso(S, 34, 36) });
})();
