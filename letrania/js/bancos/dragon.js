// ============================================================
// Letrania · banco de la Senda del Dragón (grupo A, refuerzo de 5.º).
// Fichas 1-12 (regiones 1 y 2), sacadas de las fichas del curso
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
})();
