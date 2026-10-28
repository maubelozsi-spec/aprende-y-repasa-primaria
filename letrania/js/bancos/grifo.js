// ============================================================
// Letrania · banco de la Senda del Grifo (grupo B, ACS nivel de 3.º).
// Fichas 1-12 (regiones 1 y 2), sacadas de las fichas del curso:
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
})();
