// ============================================================
// Letrania · banco de la Senda del Dragón (grupo A, refuerzo de 5.º).
// Fichas 1-34, sacadas de las fichas del curso
// (vocabulario y temas: otoño, 12 de octubre, castañas, Tosantos,
// membrillo, flamenco, derechos de la infancia, igualdad, Constitución,
// Navidad y Reyes).
//
// Recordatorio (ver util.js): en una lista ya publicada solo se añaden
// palabras AL FINAL; los ids de los ítems dependen de su posición.
// Sílabas tónicas en MAYÚSCULAS: "fan.TAS.ma".
// ============================================================
(function () {
  "use strict";
  const B = window.LetraniaBanco;
  const S = "dragon";

  // 1 · Mayúscula y punto
  B.registrar(S, 1, {
    plantilla: "ordenar",
    titulo: "Mayúscula y punto",
    items: B.ordenar(
      [
        "Las hojas caen en otoño.",
        "El árbol del patio es muy grande.",
        "Lucía recoge hojas amarillas.",
        "En primavera salen hojas nuevas.",
        "Hugo quiere coger una rama.",
        "La maestra explica la lección.",
        "El viento lleva las hojas.",
        "Hacemos un mural en clase.",
        "Mi abuela hace castañas asadas.",
        "Los pájaros cantan en el árbol.",
        "Hoy llueve en Almería.",
        "Amparo trae un paraguas rojo.",
        "El mural parece un bosque pequeño.",
        "Recogemos las hojas más bonitas.",
        "Por la tarde hace más frío.",
        "Mi hermano juega en el patio.",
        "La clase huele a pintura.",
        "El conserje barre las hojas.",
        "Daniel lleva una bufanda verde.",
        "Pegamos las hojas con cola.",
        "Las nubes tapan el sol.",
        "Sara pinta un árbol enorme.",
        "El suelo está lleno de hojas.",
        "Mañana vamos de excursión.",
        "La maestra se llama Amparo.",
        "Los días son más cortos en otoño.",
        "Lucía guarda una hoja en su libro.",
        "El árbol está vivo.",
        "Las castañas huelen a humo.",
        "Hugo lleva un jersey de lana.",
      ],
      "Toda oración empieza con mayúscula y termina con un punto."
    ),
  });

  // 2 · Separar palabras
  B.registrar(S, 2, {
    plantilla: "cortar",
    titulo: "Separar palabras",
    items: B.cortarPalabras(
      [
        "Los barcos llegaron a la isla.",
        "Rodrigo gritó desde el mástil.",
        "La Niña era un barco pequeño.",
        "Los marineros tenían poca comida.",
        "Todos salieron a cubierta.",
        "El mar estaba en calma.",
        "Colón viajó con tres barcos.",
        "El viaje duró dos meses.",
        "Vieron tierra una madrugada.",
        "El doce de octubre es fiesta.",
        "El lunes no hubo clase.",
        "Las velas eran blancas.",
        "El capitán miró el mapa.",
        "Los barcos eran de madera.",
        "Un marinero vio una isla.",
        "El viento empujaba las velas.",
        "Por la noche miraban las estrellas.",
        "Tenían poca agua dulce.",
        "Llegaron a una playa.",
        "La tripulación estaba cansada.",
        "Se oye el ruido de las olas.",
        "Los peces saltan junto al barco.",
        "El mástil es un palo muy alto.",
        "Dos mundos se encontraron.",
        "La Pinta iba delante.",
        "Hoy es un día de fiesta.",
      ],
      "Entre cada palabra dejamos un espacio. Toda oración empieza con mayúscula y acaba en punto."
    ),
  });

  // 3 · La sílaba
  B.registrar(S, 3, {
    plantilla: "cortar",
    titulo: "La sílaba",
    items: B.cortarSilabas([
      "pla.za", "ca.rri.to", "hu.mo", "pe.rió.di.co", "frí.o", "sar.tén", "cas.ta.ña", "a.bue.lo",
      "bol.si.llo", "cu.cu.ru.cho", "fue.go", "pa.pel", "me.rien.da", "go.lo.si.na", "tar.de", "ca.lien.te",
      "ca.mi.no", "o.to.ño", "ár.bol", "ho.ja", "mu.ral", "co.le.gio", "pa.tio", "ma.es.tra",
      "llu.via", "pa.ra.guas", "bu.fan.da", "na.ran.ja", "ma.rrón", "a.ma.ri.llo", "cas.ta.ñe.ra", "pue.blo",
      "pri.ma.ve.ra", "in.vier.no", "ca.la.ba.za", "mem.bri.llo",
    ]),
  });

  // 4 · Sílaba tónica
  B.registrar(S, 4, {
    plantilla: "caza",
    titulo: "Sílaba tónica",
    items: B.cazaTonica([
      "fan.TAS.ma", "ca.ra.ME.lo", "FLO.res", "ce.men.TE.rio", "mem.BRI.llo", "a.BUE.la", "BRU.ja", "es.que.LE.to",
      "tra.di.CIÓN", "ca.la.BA.za", "dis.FRAZ", "cas.TA.ña", "NUE.ces", "o.TO.ño", "NO.che", "FIES.ta",
      "mur.CIÉ.la.go", "a.RA.ña", "VE.la", "LU.na", "ÁR.bol", "pa.PEL", "re.LOJ", "ca.FÉ",
      "LÁ.piz", "PÁ.ja.ro", "MÚ.si.ca", "ja.MÓN", "co.MER", "ven.TA.na", "ca.MI.sa", "SÁ.ba.do",
      "ca.la.BA.zas", "di.FUN.tos", "a.ZÚ.car",
    ]),
  });

  // 5 · Palabras agudas
  B.registrar(S, 5, {
    plantilla: "cestas",
    titulo: "Palabras agudas",
    items: B.cestasAcento(
      [
        "co.MER", "a.ZÚ.car", "re.LOJ", "mem.BRI.llo", "ja.MÓN", "a.BUE.lo", "a.ZUL", "HUER.to",
        "ca.FÉ", "DUL.ce", "pa.PEL", "a.ma.RI.llo", "sar.TÉN", "ÁR.bol", "co.ra.ZÓN", "PÁ.ja.ro",
        "ca.MIÓN", "ME.sa", "a.MOR", "MÚ.si.ca", "ver.DAD", "LÁ.piz", "jar.DÍN", "FRU.ta",
        "so.FÁ", "na.RAN.ja", "ra.TÓN", "pa.CIEN.cia", "ba.LÓN", "MOL.de", "pin.TOR", "co.CER",
        "can.CIÓN", "fe.LIZ", "na.RIZ", "des.PUÉS",
      ],
      ["aguda", "no-aguda"]
    ),
  });

  // 6 · Palabras llanas
  B.registrar(S, 6, {
    plantilla: "cestas",
    titulo: "Palabras llanas",
    items: B.cestasAcento(
      [
        "PAL.mas", "can.TAR", "gui.TA.rra", "com.PÁS", "fla.MEN.co", "can.TOR", "LÁ.piz", "bai.LAR",
        "ÁR.bol", "ta.CÓN", "BAI.le", "cla.VEL", "es.ce.NA.rio", "tam.BOR", "RIT.mo", "can.CIÓN",
        "CAN.te", "a.plau.DIR", "a.PLAU.so", "ca.JÓN", "ma.DE.ra", "a.ZUL", "CÉS.ped", "ba.LÓN",
        "FÁ.cil", "ra.TÓN", "MA.no", "pa.PEL", "za.PA.to", "fe.LIZ",
      ],
      ["aguda", "llana"]
    ),
  });

  // 7 · Palabras esdrújulas
  B.registrar(S, 7, {
    plantilla: "cestas",
    titulo: "Palabras esdrújulas",
    items: B.cestasAcento(
      [
        "NÚ.me.ro", "co.LE.gio", "de.RE.cho", "car.TEL", "PÁ.ja.ro", "fa.MI.lia", "ra.TÓN", "ME.sa",
        "MÉ.di.co", "pa.PEL", "SÁ.ba.do", "ven.TA.na", "MÚ.si.ca", "LÁM.pa.ra", "PÁ.gi.na", "RÁ.pi.do",
        "PÚ.bli.co", "BRÚ.ju.la", "ca.MIÓN", "a.CUER.do", "LÁ.gri.ma", "mur.CIÉ.la.go", "PLÁ.ta.no", "te.LÉ.fo.no",
        "jar.DÍN", "NI.ño", "can.CIÓN", "es.TRE.lla", "MÁ.gi.co", "re.LOJ", "CÉS.ped", "co.MER",
      ],
      ["aguda", "llana", "esdrujula"]
    ),
  });

  // 8 · La tilde en las agudas
  B.registrar(S, 8, {
    plantilla: "espejo",
    titulo: "Tilde en las agudas",
    items: B.espejoTilde(
      [
        "ba.LÓN", "ju.GAR", "can.CIÓN", "au.to.BÚS", "re.LOJ", "so.FÁ", "fe.LIZ", "des.PUÉS",
        "ca.FÉ", "pa.PEL", "ma.MÁ", "com.PÁS", "ja.MÓN", "a.de.MÁS", "na.RIZ", "ver.DAD",
        "ra.TÓN", "sa.LÓN", "be.LÉN", "co.ra.ZÓN", "jar.DÍN", "ca.pi.TÁN", "es.pa.ÑOL", "se.ÑOR",
        "ciu.DAD", "rin.CÓN", "me.NÚ", "bam.BÚ", "por.TAL", "co.LOR",
        "tam.BOR", "ja.ba.LÍ",
      ],
      "Todas son agudas. ¿Cuál está bien escrita?"
    ),
  });

  // 9 · La tilde en las llanas y esdrújulas
  B.registrar(S, 9, {
    plantilla: "espejo",
    titulo: "Tilde en llanas y esdrújulas",
    items: B.espejoTilde(
      [
        "LÁ.piz", "ven.TA.na", "PÁ.ja.ro", "ÁR.bol", "ca.MI.sa", "MÉ.di.co", "FÁ.cil", "LU.nes",
        "RÁ.pi.do", "NÚ.me.ro", "e.XA.men", "PÁ.gi.na", "MÚ.si.ca", "CÁR.cel", "JO.ven", "FÚT.bol",
        "a.ZÚ.car", "PLAN.ta", "DÉ.bil", "MÓ.vil", "Ú.til", "ME.sa", "ÁL.bum", "CÉS.ped",
        "LÁM.pa.ra", "SÁ.ba.do", "te.LÉ.fo.no", "CA.sa", "NOR.ma", "VO.to", "MÁR.mol", "ÁN.gel",
      ],
      "Todas son llanas o esdrújulas. ¿Cuál está bien escrita?"
    ),
  });

  // 10 · Se escribe con b
  B.registrar(S, 10, {
    plantilla: "puente",
    titulo: "Se escribe con b",
    items: B.puente(["b", "v"], [
      { regla: "Antes de l y de r siempre se escribe b: bl, br.", palabras: ["[b]lanco", "[b]rillo", "ca[b]le", "ha[b]lar", "a[b]rigo", "li[b]ro", "[b]razo", "ta[b]la", "pue[b]lo", "nie[b]la", "[b]rújula", "co[b]re"] },
      { regla: "Después de m siempre se escribe b: mb.", palabras: ["tam[b]ién", "som[b]ra", "nom[b]re", "hom[b]re", "tam[b]or", "hom[b]ro", "alfom[b]ra", "cam[b]iar"] },
      { regla: "Las palabras que empiezan por bu-, bur- y bus- se escriben con b.", palabras: ["[b]ufanda", "[b]uscar", "[b]urbuja", "[b]urro", "[b]uzón", "[b]utaca"] },
      { regla: "Los verbos en pasado acabados en -aba, -abas, -ábamos, -aban llevan b.", palabras: ["juga[b]a", "canta[b]a", "esta[b]a", "habla[b]a", "mira[b]an", "saltá[b]amos", "pinta[b]as", "baila[b]a"] },
      { regla: (p) => "«" + p + "» se escribe con v. No sigue ninguna regla de la b: hay que recordarla.", palabras: ["[v]aca", "nue[v]e", "[v]erde", "[v]entana", "[v]olcán", "a[v]ión", "[v]iento", "lla[v]e", "nie[v]e", "u[v]a"] },
    ], "¿b o v?"),
  });

  // 11 · Se escribe con v
  B.registrar(S, 11, {
    plantilla: "puente",
    titulo: "Se escribe con v",
    items: B.puente(["b", "v"], [
      { regla: "Después de n siempre se escribe v: nv.", palabras: ["in[v]ierno", "en[v]olver", "in[v]itar", "con[v]ersar", "in[v]ento", "in[v]isible", "en[v]iar", "con[v]encer"] },
      { regla: "Los adjetivos acabados en -ava, -avo, -eva, -evo, -iva, -ivo llevan v.", palabras: ["nue[v]a", "acti[v]o", "octa[v]o", "nue[v]o", "atracti[v]o", "deporti[v]a", "positi[v]o", "creati[v]a"] },
      { regla: "Las palabras que empiezan por vice- y villa- llevan v.", palabras: ["[v]illancico", "[v]icepresidente", "[v]illa"] },
      { regla: "Cuidado: iba, ibas, íbamos (del verbo ir) se escriben con b.", palabras: ["i[b]a", "i[b]as", "í[b]amos", "i[b]an"] },
      { regla: "Después de m siempre se escribe b: mb.", palabras: ["tam[b]ién", "som[b]rero"] },
      { regla: "Las palabras que empiezan por bu- llevan b.", palabras: ["[b]ufanda", "[b]ueno"] },
      { regla: "Los verbos acabados en -bir llevan b (menos hervir, servir y vivir).", palabras: ["escri[b]ir", "su[b]ir", "reci[b]ir"] },
      { regla: "Hervir, servir y vivir son las excepciones de -bir: se escriben con v.", palabras: ["vi[v]ir", "ser[v]ir"] },
    ], "¿b o v?"),
  });

  // 12 · La letra h
  B.registrar(S, 12, {
    plantilla: "puente",
    titulo: "La letra h",
    items: B.puente(["h", "sin h"], [
      { regla: "Las palabras que empiezan por hie-, hue- y hum- llevan h.", palabras: ["[h]ielo", "[h]uevo", "[h]umo", "[h]ueso", "[h]ueco", "[h]umano", "[h]uerto", "[h]ierba"] },
      { regla: "Las formas del verbo haber llevan h: hay, hemos, había.", palabras: ["[h]ay", "[h]abía", "[h]emos", "[h]aber"] },
      { regla: "Las formas del verbo hacer llevan h: hago, hizo, hecho.", palabras: ["[h]echo", "[h]izo", "[h]acer", "[h]ago"] },
      { regla: (p) => "«" + p + "» lleva h: es una palabra muy usada que hay que recordar.", palabras: ["[h]ola", "[h]oja", "[h]ablar", "[h]asta", "[h]ormiga", "[h]ombre", "[h]ora", "[h]oy", "a[h]ora", "[h]ermano"] },
      { regla: (p) => "«" + p + "» no lleva h.", palabras: ["[]oso", "[]uva", "[]isla", "[]ojo", "[]uña", "[]agua", "[]ancho", "[]árbol", "[]orilla", "[]abrir", "[]idea", "[]ocho", "[]elefante", "[]estrella", "[]alumno", "[]amigo"] },
    ], "¿Lleva h?"),
  });

  // ---------- Regiones 3 a 6 (fichas 13-34) ----------

  // Ayudas de este banco.
  const PREG = (f) => ["¿Es una pregunta o una exclamación?", f, ["¿ ?", "¡ !"], 0, "«¿" + f + "?» pide una respuesta: es una pregunta y va entre ¿ y ?.", "¿" + f + "?"];
  const EXCL = (f) => ["¿Es una pregunta o una exclamación?", f, ["¿ ?", "¡ !"], 1, "«¡" + f + "!» expresa una emoción (sorpresa, alegría, miedo): es una exclamación y va entre ¡ y !.", "¡" + f + "!"];
  const HUECO = B.hueco;

  // 13 · ¿? y ¡!
  B.registrar(S, 13, {
    plantilla: "eco",
    titulo: "¿? y ¡!",
    items: B.elegir("eco", [
      PREG("Dónde está Trueno"), EXCL("Qué susto me ha dado el rayo"), PREG("Cuándo va a parar la lluvia"), EXCL("Qué tormenta tan grande"),
      PREG("Has visto el relámpago"), EXCL("Cuidado con el charco"), PREG("Quién ha cerrado la ventana"), EXCL("Por fin ha salido el sol"),
      PREG("Por qué truena tanto"), EXCL("Qué bonito es el arcoíris"), PREG("Cuántos truenos has contado"), EXCL("Socorro, se ha ido la luz"),
      PREG("Tienes un paraguas"), EXCL("Qué frío hace esta noche"), PREG("A qué hora llega tu padre"), EXCL("Hurra, ya no llueve"),
      PREG("Dónde se ha escondido el perro"), EXCL("Corre, que nos mojamos"), PREG("Vienes a mi casa esta tarde"), EXCL("Qué alegría verte, Trueno"),
    ], { pista: "Si la frase pide una respuesta, es una pregunta. Si cuenta una emoción, es una exclamación." }),
  });

  // 14 · La coma
  B.registrar(S, 14, {
    plantilla: "espejo",
    titulo: "La coma",
    items: B.espejoPares([
      ["En el desayuno tomo leche, pan, aceite y tomate.", "En el desayuno tomo leche pan aceite y tomate.", "En una enumeración, los elementos se separan con comas."],
      ["Tengo un perro, un gato y un pez.", "Tengo un perro, un gato, y un pez.", "Antes de la y final de una enumeración no se pone coma."],
      ["Lucía, ven a desayunar.", "Lucía ven a desayunar.", "Cuando llamamos a alguien por su nombre, el nombre se separa con coma."],
      ["Sí, quiero un zumo de naranja.", "Sí quiero un zumo de naranja.", "Detrás de «sí» o «no» al empezar una respuesta va coma."],
      ["Mi hermano desayuna cereales.", "Mi hermano, desayuna cereales.", "Entre el sujeto y el verbo no se pone coma."],
      ["Mamá, ¿dónde está mi mochila?", "Mamá ¿dónde está mi mochila?", "El nombre de la persona a la que hablamos se separa con coma."],
      ["En mi mochila llevo libros, lápices, gomas y una regla.", "En mi mochila llevo libros lápices gomas y una regla.", "En una enumeración, los elementos se separan con comas."],
      ["No, hoy no hay clase.", "No hoy no hay clase.", "Detrás de «sí» o «no» al empezar una respuesta va coma."],
      ["Me gustan las fresas, las peras y los plátanos.", "Me gustan las fresas, las peras, y los plátanos.", "Antes de la y final de una enumeración no se pone coma."],
      ["Abuela, te he guardado una tostada.", "Abuela te he guardado una tostada.", "Cuando llamamos a alguien por su nombre, el nombre se separa con coma."],
      ["El perro de Luis ladra mucho.", "El perro de Luis, ladra mucho.", "Entre el sujeto y el verbo no se pone coma."],
      ["Pedro, Ana y Luis desayunan juntos.", "Pedro Ana y Luis desayunan juntos.", "En una enumeración, los nombres se separan con comas."],
      ["Niños, recoged la mesa.", "Niños recoged la mesa.", "Cuando llamamos a alguien, esa palabra se separa con coma."],
      ["Compramos manzanas, galletas, yogures y miel.", "Compramos, manzanas, galletas, yogures y miel.", "Entre el verbo y lo que se enumera no se pone coma."],
    ], "¿Cuál tiene bien puestas las comas?", null, "Lee la frase en voz alta: la coma es una pausa corta."),
  });

  // 15 · El sustantivo
  B.registrar(S, 15, {
    plantilla: "cestas",
    titulo: "El sustantivo",
    items: B.cestas(
      ["Sustantivo común", "Sustantivo propio", "No es sustantivo"],
      [
        { cesta: 0, regla: (p) => "«" + p + "» es un sustantivo común: nombra cualquier persona, animal o cosa de su clase.", palabras: ["bicicleta", "rueda", "casco", "calle", "parque", "amigo", "cadena", "timbre", "ciudad", "perro", "montaña", "playa"] },
        { cesta: 1, regla: (p) => "«" + p + "» es un sustantivo propio: nombra uno en concreto y va con mayúscula.", palabras: ["Adrián", "Almería", "Andalucía", "Lucía", "España", "Tabernas", "Sevilla", "Pedro", "Mediterráneo", "Nieves"] },
        { cesta: 2, regla: (p) => "«" + p + "» no es un sustantivo: no nombra a una persona, un animal ni una cosa.", palabras: ["rápido", "pedalear", "rojo", "correr", "alegre", "saltar", "grande", "frenar", "nuevo", "despacio"] },
      ],
      "¿Qué clase de palabra es?"
    ),
  });

  // 16 · Género y número
  const GN = ["Masculino singular", "Femenino singular", "Masculino plural", "Femenino plural"];
  B.registrar(S, 16, {
    plantilla: "cestas",
    titulo: "Género y número",
    items: B.cestas(
      GN,
      [
        { cesta: 0, regla: (p) => "Decimos «el " + p + "»: masculino y singular.", palabras: ["libro", "coche", "árbol", "lápiz", "río", "perro", "día", "pan"] },
        { cesta: 1, regla: (p) => "Decimos «la " + p + "»: femenino y singular.", palabras: ["casa", "bicicleta", "nube", "luz", "flor", "gata", "mano", "calle"] },
        { cesta: 2, regla: (p) => "Decimos «los " + p + "»: masculino y plural.", palabras: ["zapatos", "árboles", "leones", "peces", "ríos", "días", "panes", "lápices"] },
        { cesta: 3, regla: (p) => "Decimos «las " + p + "»: femenino y plural.", palabras: ["mesas", "flores", "montañas", "ruedas", "camisetas", "luces", "manos", "nubes"] },
      ],
      "¿Cómo es: masculino o femenino, singular o plural?"
    ).map((it) => Object.assign(it, { pista: "Pon delante el, la, los o las y escucha cuál suena bien." })),
  });

  // 17 · El adjetivo
  B.registrar(S, 17, {
    plantilla: "caza",
    titulo: "El adjetivo",
    items: B.cazaPalabra(
      [
        "La bici *roja* es de Adrián.", "Adrián tiene un casco *azul*.", "El perro *pequeño* ladra.", "La calle está *mojada*.",
        "Hoy hace un día *soleado*.", "Lucía lleva una mochila *nueva*.", "El parque tiene árboles *altos*.", "Esa cuesta es muy *empinada*.",
        "Adrián es un chico *valiente*.", "Comimos una tarta *deliciosa*.", "El mar está *tranquilo*.", "La rueda está *pinchada*.",
        "Vimos una nube *gris*.", "El gato *negro* duerme.", "Mi abuela es muy *simpática*.", "Bebimos agua *fresca*.",
      ],
      "Caza el adjetivo: la palabra que dice cómo es algo.",
      (o) => "«" + o + "» es el adjetivo: dice cómo es el sustantivo al que acompaña."
    ),
  });

  // 18 · Sinónimos  [palabra, sinónimo, distractor, distractor]
  const SINO = [
    ["contento", "alegre", "triste", "cansado"], ["rápido", "veloz", "lento", "ruidoso"], ["bonito", "hermoso", "feo", "pequeño"],
    ["empezar", "comenzar", "terminar", "esperar"], ["terminar", "acabar", "empezar", "seguir"], ["mirar", "observar", "escuchar", "tocar"],
    ["hablar", "charlar", "callar", "dormir"], ["cara", "rostro", "espalda", "pie"], ["casa", "hogar", "calle", "coche"],
    ["alumno", "estudiante", "maestro", "director"], ["enfadado", "enojado", "tranquilo", "dormido"], ["miedo", "temor", "valor", "risa"],
    ["regalo", "obsequio", "castigo", "paquete"], ["caminar", "andar", "correr", "saltar"], ["viejo", "antiguo", "nuevo", "roto"],
    ["lanzar", "tirar", "coger", "guardar"], ["elegir", "escoger", "olvidar", "romper"], ["pelo", "cabello", "piel", "uña"],
    ["contestar", "responder", "preguntar", "escribir"], ["cansado", "agotado", "descansado", "aburrido"],
  ];
  B.registrar(S, 18, {
    plantilla: "puente",
    titulo: "Sinónimos",
    items: SINO.map(([p, s, a, b], n) => {
      const it = HUECO("¿Qué palabra significa lo mismo que «" + p + "»?", "", s, [a, b], "«" + p + "» y «" + s + "» son sinónimos: significan lo mismo.", n);
      return Object.assign(it, { palabra: p, solucion: s, audio: p, pista: "Prueba a cambiarla en una frase: si la frase dice lo mismo, es su sinónimo." });
    }),
  });

  // 19 · Antónimos
  const ANTO = [
    ["alto", "bajo", "grande", "largo"], ["abrir", "cerrar", "entrar", "romper"], ["día", "noche", "tarde", "sol"], ["frío", "caliente", "fresco", "helado"],
    ["rápido", "lento", "veloz", "fuerte"], ["subir", "bajar", "saltar", "trepar"], ["encender", "apagar", "prender", "romper"], ["entrar", "salir", "pasar", "llegar"],
    ["lleno", "vacío", "grande", "repleto"], ["ganar", "perder", "jugar", "vencer"], ["limpio", "sucio", "nuevo", "seco"], ["cerca", "lejos", "junto", "aquí"],
    ["ancho", "estrecho", "largo", "amplio"], ["duro", "blando", "fuerte", "pesado"], ["antes", "después", "ahora", "pronto"], ["alegre", "triste", "contento", "simpático"],
    ["mucho", "poco", "bastante", "todo"], ["dentro", "fuera", "encima", "debajo"], ["recordar", "olvidar", "pensar", "aprender"], ["posible", "imposible", "fácil", "probable"],
  ];
  B.registrar(S, 19, {
    plantilla: "puente",
    titulo: "Antónimos",
    items: ANTO.map(([p, s, a, b], n) => {
      const it = HUECO("¿Qué palabra significa lo contrario de «" + p + "»?", "", s, [a, b], "«" + p + "» y «" + s + "» son antónimos: significan lo contrario.", n);
      return Object.assign(it, { palabra: p, solucion: s, audio: p, pista: "Busca la palabra que dice justo lo opuesto." });
    }),
  });

  // 20 · El verbo y sus tiempos
  B.registrar(S, 20, {
    plantilla: "cestas",
    titulo: "El verbo y sus tiempos",
    items: B.cestas(
      ["Pasado (ayer)", "Presente (hoy)", "Futuro (mañana)"],
      [
        { cesta: 0, regla: (p) => "«" + p + "» está en pasado: es algo que ya ocurrió.", palabras: ["comí", "jugué", "bailaba", "corrimos", "estuvo", "escribió", "llegaste", "miraban", "dormí", "tuvimos"] },
        { cesta: 1, regla: (p) => "«" + p + "» está en presente: ocurre ahora.", palabras: ["como", "juegas", "canta", "leo", "escriben", "duermes", "está", "voy", "tenemos", "corren"] },
        { cesta: 2, regla: (p) => "«" + p + "» está en futuro: todavía no ha ocurrido.", palabras: ["comeré", "jugarás", "cantará", "iremos", "escribirán", "dormiré", "llegará", "viviremos", "saldrás", "tendrán"] },
      ],
      "¿Cuándo ocurre?"
    ).map((it) => Object.assign(it, { pista: "Ponle delante «ayer», «hoy» o «mañana» y escucha cuál encaja." })),
  });

  // 21 · g y j
  B.registrar(S, 21, {
    plantilla: "puente",
    titulo: "g y j",
    items: B.puente(["g", "j"], [
      { regla: "Los verbos acabados en -ger y -gir se escriben con g (menos tejer y crujir).", palabras: ["co[g]er", "reco[g]er", "ele[g]ir", "diri[g]ir", "prote[g]er", "esco[g]er", "sur[g]ir", "exi[g]ir"] },
      { regla: "Las palabras que empiezan por geo- (tierra) y las que tienen gen se escriben con g.", palabras: ["[g]eografía", "[g]eometría", "[g]ente", "[g]eneral", "ima[g]en", "ori[g]en"] },
      { regla: "Las palabras acabadas en -aje se escriben con j.", palabras: ["via[j]e", "gara[j]e", "paisa[j]e", "equipa[j]e", "homena[j]e", "persona[j]e"] },
      { regla: "Las palabras acabadas en -jero y -jera se escriben con j.", palabras: ["extran[j]ero", "cerra[j]ero", "conse[j]ero", "relo[j]ero", "pasa[j]era"] },
      { regla: "Tejer y crujir son las excepciones de -ger y -gir: van con j.", palabras: ["te[j]er", "cru[j]ir"] },
      { regla: (p) => "«" + p + "» es del verbo decir, traer o conducir, que no tienen g: se escribe con j.", palabras: ["di[j]e", "tra[j]e", "condu[j]e", "di[j]imos"] },
      { regla: (p) => "«" + p + "» se escribe con j: no sigue ninguna regla, hay que recordarla.", palabras: ["[j]irafa", "[j]efe", "[j]ersey"] },
    ], "¿g o j?"),
  });

  // 22 · ll e y
  B.registrar(S, 22, {
    plantilla: "puente",
    titulo: "ll e y",
    items: B.puente(["ll", "y"], [
      { regla: "Las palabras acabadas en -illo e -illa se escriben con ll.", palabras: ["pasi[ll]o", "bocadi[ll]o", "zapati[ll]a", "mantequi[ll]a", "ventani[ll]a", "cuchi[ll]o", "ardi[ll]a", "pasti[ll]a"] },
      { regla: "Al final de palabra, si suena i y no lleva tilde, se escribe y.", palabras: ["re[y]", "ho[y]", "mu[y]", "le[y]", "esto[y]", "vo[y]", "so[y]"] },
      { regla: (p) => "«" + p + "» es de un verbo que no tiene ll ni y (caer, leer, oír, creer, huir): se escribe con y.", palabras: ["ca[y]ó", "le[y]ó", "o[y]ó", "cre[y]ó", "hu[y]ó", "le[y]endo"] },
      { regla: (p) => "«" + p + "» se escribe con ll: hay que recordarla.", palabras: ["[ll]uvia", "[ll]ave", "ca[ll]e", "ga[ll]ina", "[ll]orar", "estre[ll]a"] },
      { regla: (p) => "«" + p + "» se escribe con y: hay que recordarla.", palabras: ["[y]ema", "[y]ogur", "pa[y]aso", "pla[y]a", "ra[y]o", "a[y]er"] },
    ], "¿ll o y?"),
  });

  // 23 · r y rr
  B.registrar(S, 23, {
    plantilla: "puente",
    titulo: "r y rr",
    items: B.puente(["r", "rr"], [
      { regla: "Al principio de palabra suena fuerte, pero se escribe una sola r.", palabras: ["[r]atón", "[r]ío", "[r]osa", "[r]ueda", "[r]ayo", "[r]eloj"] },
      { regla: "Entre dos vocales, si suena fuerte, se escribe rr.", palabras: ["pe[rr]o", "ca[rr]o", "to[rr]e", "tie[rr]a", "guita[rr]a", "ba[rr]o", "co[rr]er", "a[rr]iba"] },
      { regla: "Entre dos vocales, si suena suave, se escribe una sola r.", palabras: ["pe[r]a", "ca[r]a", "to[r]o", "lo[r]o", "ma[r]iposa"] },
      { regla: "Después de l, n y s suena fuerte, pero se escribe una sola r.", palabras: ["al[r]ededor", "En[r]ique", "en[r]edar", "hon[r]a", "Is[r]ael"] },
      { regla: "En las palabras compuestas, la r del principio de la segunda palabra se escribe rr: peli + rojo = pelirrojo.", palabras: ["peli[rr]ojo"] },
    ], "¿r o rr?"),
  });

  // 24 · c, qu y z
  B.registrar(S, 24, {
    plantilla: "puente",
    titulo: "c, qu y z",
    items: B.puente(["c", "qu", "z"], [
      { regla: "El sonido k delante de a, o, u se escribe con c: ca, co, cu.", palabras: ["[c]asa", "[c]ometa", "[c]uchara", "pes[c]ado", "bo[c]a"] },
      { regla: "El sonido k delante de e, i se escribe con qu: que, qui.", palabras: ["[qu]eso", "[qu]ince", "mos[qu]ito", "pa[qu]ete", "es[qu]í"] },
      { regla: "El sonido z delante de a, o, u se escribe con z: za, zo, zu.", palabras: ["[z]apato", "po[z]o", "[z]umo", "ta[z]a", "ra[z]ón"] },
      { regla: "El sonido z delante de e, i se escribe con c: ce, ci.", palabras: ["[c]ena", "[c]ielo", "co[c]ina", "do[c]e"] },
      { regla: "El plural de las palabras acabadas en z se hace con -ces: lápiz → lápices.", palabras: ["lápi[c]es", "pe[c]es", "lu[c]es", "ve[c]es"] },
      { regla: "Al final de palabra el sonido z se escribe con z.", palabras: ["lápi[z]", "pe[z]", "lu[z]", "nari[z]"] },
    ], "¿c, qu o z?"),
  });

  // 25 · Conectores
  B.registrar(S, 25, {
    plantilla: "ordenar",
    titulo: "Conectores",
    items: B.ordenarPiezas(
      [
        ["Primero, me lavo las manos.", "Después, preparo el bocadillo.", "Al final, recojo la mesa."],
        ["Primero, saco la bici del garaje.", "Después, me pongo el casco.", "Por último, salgo a pasear."],
        ["Al principio, el cielo estaba despejado.", "Luego, llegaron unas nubes negras.", "Finalmente, empezó a llover."],
        ["Había una vez un caballero muy flaco.", "Un día, salió a buscar aventuras.", "De repente, vio unos molinos.", "Por fin, volvió a su casa."],
        ["Primero, Rosa amasa la harina.", "Después, mete el pan en el horno.", "Al final, lo vende en la panadería."],
        ["Primero, adornamos la cruz con flores.", "Después, la ponemos en la plaza.", "Por último, bailamos sevillanas."],
        ["Al principio, la semilla estaba bajo la tierra.", "Luego, salió un tallo pequeño.", "Finalmente, creció una flor."],
        ["Había una vez una tortuga muy lenta.", "Un día, se perdió en el campo.", "De repente, encontró un río.", "Por fin, llegó a su casa."],
        ["Primero, escribo la carta.", "Después, la meto en el sobre.", "Al final, la echo al buzón."],
        ["Primero, nos ponemos el bañador.", "Después, nos echamos crema.", "Por último, nos bañamos en el mar."],
      ],
      "Ordena la historia: los conectores te dicen qué va antes y qué va después.",
      "Primero, al principio y había una vez van al comienzo; después, luego y un día, en medio; por último, al final y por fin, al terminar."
    ),
  });

  // 26 · La descripción
  B.registrar(S, 26, {
    plantilla: "cestas",
    titulo: "La descripción",
    items: B.cestas(
      ["Cómo es por fuera", "Cómo es por dentro"],
      [
        { cesta: 0, regla: "Describe su aspecto: lo que se ve por fuera.", palabras: ["Tiene el pelo rizado.", "Lleva un delantal blanco.", "Es alta y delgada.", "Tiene los ojos verdes.", "Tiene las manos llenas de harina.", "Lleva gafas redondas.", "Tiene pecas en la nariz.", "Lleva el pelo recogido.", "Tiene la cara redonda."] },
        { cesta: 1, regla: "Describe su carácter: cómo es por dentro, cómo se porta.", palabras: ["Es muy amable.", "Siempre ayuda a sus vecinos.", "Es muy trabajadora.", "Es paciente con los niños.", "Es divertida y alegre.", "Nunca se enfada.", "Es generosa con todos.", "Es un poco tímida.", "Es muy valiente."] },
      ],
      "La panadera Rosa: ¿habla de su aspecto o de su carácter?"
    ),
  });

  // 27 · El diálogo
  B.registrar(S, 27, {
    plantilla: "espejo",
    titulo: "El diálogo",
    items: B.espejoPares([
      ["—Hola, Rosa —dijo el niño.", "Hola, Rosa dijo el niño."],
      ["—¿Quieres pan? —preguntó Rosa.", "—¿Quieres pan? preguntó Rosa."],
      ["—¡Qué bien huele! —exclamó Luis.", "¡Qué bien huele! —exclamó Luis."],
      ["—Buenos días —saludó la panadera.", "Buenos días —saludó la panadera."],
      ["—Me llamo Pablo —contestó.", "—Me llamo Pablo, contestó."],
      ["—Ven aquí —dijo mamá.", "Ven aquí, dijo mamá."],
      ["—Ya voy —gritó Marta.", "—Ya voy gritó Marta."],
      ["—Gracias —respondió Ana.", "Gracias —respondió Ana."],
      ["—¡Cuidado! —gritó el panadero.", "¡Cuidado! gritó el panadero."],
    ], "¿Qué diálogo está bien escrito?", "En el diálogo, lo que dice cada personaje empieza con una raya (—), y otra raya separa lo que cuenta el narrador.", "Busca las rayas: una al principio y otra antes de «dijo», «preguntó»…"),
  });

  // 28 · Sujeto y predicado
  B.registrar(S, 28, {
    plantilla: "espejo",
    titulo: "Sujeto y predicado",
    items: B.espejoPares([
      ["Rosa | hace pan.", "Rosa hace | pan.", "Sujeto: «Rosa» (quién). Predicado: «hace pan» (lo que se dice de ella)."],
      ["El perro de Luis | ladra mucho.", "El perro | de Luis ladra mucho.", "Sujeto: «El perro de Luis». Predicado: «ladra mucho»."],
      ["Mi abuela | cocina muy bien.", "Mi abuela cocina | muy bien.", "Sujeto: «Mi abuela». Predicado: «cocina muy bien»."],
      ["Los niños | juegan en el patio.", "Los niños juegan | en el patio.", "Sujeto: «Los niños». Predicado: «juegan en el patio»."],
      ["La tortuga mora | vive en Almería.", "La tortuga | mora vive en Almería.", "Sujeto: «La tortuga mora». Predicado: «vive en Almería»."],
      ["Adrián | monta en bici.", "Adrián monta | en bici.", "Sujeto: «Adrián». Predicado: «monta en bici»."],
      ["Las flores del patio | huelen bien.", "Las flores | del patio huelen bien.", "Sujeto: «Las flores del patio». Predicado: «huelen bien»."],
      ["El río Andarax | lleva poca agua.", "El río Andarax lleva | poca agua.", "Sujeto: «El río Andarax». Predicado: «lleva poca agua»."],
      ["Mis primos | viven en Níjar.", "Mis primos viven | en Níjar.", "Sujeto: «Mis primos». Predicado: «viven en Níjar»."],
      ["La maestra nueva | explica el cuento.", "La maestra | nueva explica el cuento.", "Sujeto: «La maestra nueva». Predicado: «explica el cuento»."],
      ["El sol | calienta la arena.", "El sol calienta | la arena.", "Sujeto: «El sol». Predicado: «calienta la arena»."],
      ["Mi hermana pequeña | duerme la siesta.", "Mi hermana | pequeña duerme la siesta.", "Sujeto: «Mi hermana pequeña». Predicado: «duerme la siesta»."],
    ], "¿Dónde está bien la raya entre sujeto y predicado?", null, "Pregunta al verbo «¿quién?»: la respuesta es el sujeto. El predicado empieza en el verbo."),
  });

  // 29 · Familias de palabras y prefijos
  const FAM = [
    ["pan", "panadería", "pantalón", "pantera"], ["flor", "florero", "flota", "flojo"], ["mar", "marinero", "mariposa", "martes"],
    ["zapato", "zapatería", "zanahoria", "zarpa"], ["leche", "lechero", "lechuga", "lejos"], ["hierro", "herrero", "hierba", "herida"],
    ["libro", "librería", "libre", "libra"], ["sal", "salero", "salir", "salto"], ["papel", "papelera", "papá", "papilla"],
  ];
  const PREF = [
    ["Lo contrario de «hacer»", "_hacer", "des", ["re", "pre"], "des- significa «lo contrario»: deshacer."],
    ["Leer otra vez", "_leer", "re", ["des", "pre"], "re- significa «otra vez»: releer."],
    ["La historia de antes de la escritura", "_historia", "pre", ["re", "sub"], "pre- significa «antes»: prehistoria."],
    ["Un barco que va debajo del mar", "_marino", "sub", ["re", "pre"], "sub- significa «debajo»: submarino."],
    ["Lo contrario de «atar»", "_atar", "des", ["sub", "re"], "des- significa «lo contrario»: desatar."],
    ["Construir otra vez", "_construir", "re", ["des", "sub"], "re- significa «otra vez»: reconstruir."],
    ["Lo que no es útil", "_útil", "in", ["des", "re"], "in- significa «no»: inútil."],
    ["Lo que no es posible", "_posible", "im", ["re", "sub"], "im- significa «no» (delante de p y b se escribe im-): imposible."],
  ];
  B.registrar(S, 29, {
    plantilla: "puente",
    titulo: "Familias y prefijos",
    items: FAM.map(([p, s, a, b], n) => {
      const it = HUECO("¿Qué palabra es de la familia de «" + p + "»?", "", s, [a, b], "«" + s + "» viene de «" + p + "»: son de la misma familia. Las otras solo se parecen.", n);
      return Object.assign(it, { palabra: p, solucion: s, audio: p, pista: "Las palabras de una familia comparten la raíz y tienen que ver en el significado." });
    }).concat(PREF.map(([e, p, buena, otras, regla], n) => HUECO(e + ": ¿qué prefijo falta?", p, buena, otras, regla, n))),
  });

  // 30 · Pronombres
  const PRON = ["Yo", "Tú", "Él", "Ella", "Nosotros", "Vosotros", "Ellos", "Ellas"];
  const PRO = [
    ["Rosa hace pan.", "Ella", "_ hace pan."], ["Pedro juega al fútbol.", "Él", "_ juega al fútbol."], ["Luis y yo cantamos.", "Nosotros", "_ cantamos."],
    ["Tú y Pedro corréis mucho.", "Vosotros", "_ corréis mucho."], ["Mis primas bailan.", "Ellas", "_ bailan."], ["Los niños leen cuentos.", "Ellos", "_ leen cuentos."],
    ["Las abuelas pasean.", "Ellas", "_ pasean."], ["El perro ladra.", "Él", "_ ladra."], ["La panadera y su hijo abren la tienda.", "Ellos", "_ abren la tienda."],
    ["Juan y yo vamos al parque.", "Nosotros", "_ vamos al parque."], ["Tus amigos y tú jugáis.", "Vosotros", "_ jugáis."], ["Mi hermana dibuja.", "Ella", "_ dibuja."],
  ];
  B.registrar(S, 30, {
    plantilla: "puente",
    titulo: "Pronombres",
    items: PRO.map(([frase, buena, hueco], n) => {
      const otras = PRON.filter((x) => x !== buena);
      const it = HUECO("«" + frase + "» ¿Qué pronombre sustituye al sujeto?", hueco, buena, [otras[n % otras.length], otras[(n + 3) % otras.length]], "En «" + frase + "» el sujeto se puede cambiar por el pronombre «" + buena + "».", n);
      return Object.assign(it, { pista: "Fíjate en quién hace la acción: ¿es uno o varios? ¿chico o chica? ¿estás tú dentro?" });
    }),
  });

  // 31 · El resumen: ¿cuál es la idea principal?
  const RES = [
    ["El Indalo es un muñeco pintado hace miles de años en la Cueva de los Letreros. Tiene los brazos abiertos y sostiene un arco. Hoy es el símbolo de Almería.", "El Indalo es una pintura muy antigua que hoy es el símbolo de Almería.", "El Indalo tiene los brazos abiertos.", "El Indalo se pintó el año pasado."],
    ["La tortuga mora vive en el campo de Almería y Murcia. Es muy lenta y come hierbas. Está en peligro y hay que protegerla.", "La tortuga mora vive en Almería y Murcia y hay que protegerla.", "La tortuga come hierbas.", "La tortuga mora vive en el mar."],
    ["En mayo, en muchos pueblos se adornan cruces con flores. Los vecinos se reúnen, cantan y bailan. Es la fiesta de las Cruces de Mayo.", "Las Cruces de Mayo son una fiesta con cruces de flores, cantos y bailes.", "Los vecinos se reúnen.", "En mayo se cierran los pueblos."],
    ["La posidonia es una planta que crece bajo el mar. Da oxígeno y sirve de casa a muchos peces. En Cabo de Gata hay grandes praderas.", "La posidonia es una planta del mar muy importante para los peces.", "En Cabo de Gata hay praderas.", "La posidonia es un pez."],
    ["El río Andarax nace en Sierra Nevada. Pasa por muchos pueblos y llega al mar en Almería. Casi siempre lleva poca agua.", "El río Andarax va desde Sierra Nevada hasta el mar en Almería.", "Pasa por muchos pueblos.", "El río Andarax nace en el mar."],
    ["Rosa se levanta a las cinco. Amasa la harina, hornea el pan y abre la panadería a las ocho. Todo el barrio compra su pan.", "Rosa trabaja desde muy temprano haciendo pan para el barrio.", "Rosa se levanta a las cinco.", "Rosa vende zapatos."],
    ["Adrián quería ir al colegio en bici. Practicó cada tarde con su padre. Al final aprendió a no caerse y ahora va pedaleando.", "Adrián practicó mucho y aprendió a ir en bici al colegio.", "Practicaba con su padre.", "Adrián va al colegio en autobús."],
    ["Don Quijote leía tantos libros de caballeros que quiso ser uno. Se puso una armadura vieja y salió con su caballo Rocinante. Así empezaron sus aventuras.", "Don Quijote quiso ser caballero y salió a buscar aventuras.", "Su caballo se llamaba Rocinante.", "Don Quijote no sabía leer."],
  ];
  B.registrar(S, 31, {
    plantilla: "puente",
    titulo: "El resumen",
    items: RES.map(([texto, idea, detalle, falsa], n) => {
      const it = HUECO("Lee el texto. ¿Cuál es la idea principal?", "", idea, [detalle, falsa], "La idea principal resume todo el texto. «" + detalle + "» es solo un detalle, y la otra no lo dice el texto.", n);
      return Object.assign(it, { texto: texto, palabra: "", audio: texto, pista: "La idea principal es la que contarías si solo pudieras decir una frase." });
    }),
  });

  // 32 · La tilde en los hiatos
  B.registrar(S, 32, {
    plantilla: "espejo",
    titulo: "Tilde en los hiatos",
    items: B.espejoPares([
      ["día", "dia"], ["tía", "tia"], ["país", "pais"], ["maíz", "maiz"], ["búho", "buho"], ["baúl", "baul"], ["oído", "oido"],
      ["reír", "reir"], ["María", "Maria"], ["Raúl", "Raul"], ["todavía", "todavia"], ["panadería", "panaderia"], ["policía", "policia"],
      ["aire", "aíre", "En «aire» la i no es tónica: ai es un diptongo y sigue las reglas generales (llana acabada en vocal, sin tilde)."],
      ["peine", "peíne", "En «peine» la i no es tónica: ei es un diptongo y sigue las reglas generales (llana acabada en vocal, sin tilde)."],
      ["ciudad", "ciudád", "«ciudad» es aguda y termina en -d: no lleva tilde."],
      ["león", "leon", "«león» tiene hiato de dos vocales abiertas: sigue las reglas generales (aguda acabada en -n, lleva tilde)."],
    ], "¿Cuál está bien escrita?", (b) => "En «" + b + "» la i o la u tónica va junto a otra vocal y suenan separadas (hiato): la í o la ú lleva tilde siempre.", "Di la palabra despacio: si la i o la u suena fuerte y separada de la otra vocal, lleva tilde."),
  });

  // 33 · La carta
  B.registrar(S, 33, {
    plantilla: "cestas",
    titulo: "La carta",
    items: B.cestas(
      ["Lugar y fecha", "Saludo", "Cuerpo", "Despedida y firma"],
      [
        { cesta: 0, regla: "Arriba a la derecha van el lugar y la fecha.", palabras: ["Almería, 3 de mayo de 2027", "Níjar, 12 de junio de 2027", "Roquetas, 20 de abril de 2027", "Vera, 1 de marzo de 2027"] },
        { cesta: 1, regla: "El saludo va al principio y termina con dos puntos.", palabras: ["Querida abuela:", "Hola, Carla:", "Querido Pedro:", "Estimada maestra:"] },
        { cesta: 2, regla: "El cuerpo es lo que contamos en la carta.", palabras: ["Te escribo para contarte mi excursión.", "Ayer vimos posidonia en el mar.", "En clase estamos aprendiendo a nadar.", "Me gustaría que vinieras en verano."] },
        { cesta: 3, regla: "Al final se despide uno y firma con su nombre.", palabras: ["Un abrazo muy fuerte, Lucía", "Hasta pronto, Carla", "Muchos besos, tu nieto Hugo", "Un saludo, Adrián"] },
      ],
      "¿En qué parte de la carta va?"
    ),
  });

  // 34 · Gran repaso: una mezcla de todas las estaciones anteriores.
  B.registrar(S, 34, { plantilla: "mixta", titulo: "Gran repaso", items: B.repaso(S, 34, 40) });
})();
