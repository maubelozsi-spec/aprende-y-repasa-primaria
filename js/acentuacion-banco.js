// ============================================================
// Banco de palabras de acentuación · fuente única
//
// Lo usan:
//   - js/ortografia.js            (ficha "Acentuación", 4 pasos)
//   - lengua/juego-acentuacion.html ("El Pórtico de las Tildes")
//
// Para añadir una palabra basta con una línea en RAW:
//   ["sí.la.bas.con.tilde", índiceDeLaSílabaTónica, grupoVocálico, letrasDelGrupo]
//
//   - El índice de la sílaba tónica empieza en 0.
//   - grupoVocálico: "ninguno" | "diptongo" | "hiato" | "hiato_acentual" | "triptongo".
//   - letrasDelGrupo se escribe tal y como aparece en la palabra, CON tilde
//     si la lleva ("ió" en camión, "éa" en océano). Cadena vacía si el grupo
//     es "ninguno".
//
// Todo lo demás (forma sin tilde, separación en sílabas, si lleva tilde,
// en qué letra, y si es aguda, llana, esdrújula o sobresdrújula) se calcula
// aquí: no hay que escribirlo a mano ni puede quedar descuadrado.
// ============================================================

(function (global) {
  "use strict";

  var RAW = [
  // --- Agudas con tilde ---
  ["ca.mión",1,"diptongo","ió"], ["jar.dín",1,"ninguno",""], ["ca.fé",1,"ninguno",""],
  ["so.fá",1,"ninguno",""], ["au.to.bús",2,"diptongo","au"], ["co.ra.zón",2,"ninguno",""],
  ["com.pás",1,"ninguno",""], ["ma.le.tín",2,"ninguno",""], ["ja.ba.lí",2,"ninguno",""],
  ["ca.pi.tán",2,"ninguno",""], ["vol.cán",1,"ninguno",""], ["le.gión",1,"diptongo","ió"],
  ["an.fi.trión",2,"diptongo","ió"], ["Ne.rón",1,"ninguno",""], ["le.ón",1,"hiato","eó"],
  // --- Agudas sin tilde ---
  ["re.loj",1,"ninguno",""], ["pa.pel",1,"ninguno",""], ["ver.dad",1,"ninguno",""],
  ["fe.liz",1,"ninguno",""], ["co.mer",1,"ninguno",""], ["ciu.dad",1,"diptongo","iu"],
  ["vir.tud",1,"ninguno",""], ["em.pe.ra.dor",3,"ninguno",""], ["gla.dia.dor",2,"diptongo","ia"],
  ["na.riz",1,"ninguno",""], ["pas.tor",1,"ninguno",""], ["lau.rel",1,"diptongo","au"],
  ["ca.mi.nar",2,"ninguno",""], ["re.al",1,"hiato","ea"], ["ro.e.dor",2,"hiato","oe"],
  ["U.ru.guay",2,"triptongo","uay"], ["Pa.ra.guay",2,"triptongo","uay"],
  // --- Agudas con hiato acentual ---
  ["ra.íz",1,"hiato_acentual","aí"], ["ba.úl",1,"hiato_acentual","aú"],
  ["o.ír",1,"hiato_acentual","oí"], ["re.ír",1,"hiato_acentual","eí"],
  ["ma.íz",1,"hiato_acentual","aí"],
  // --- Llanas con tilde ---
  ["ár.bol",0,"ninguno",""], ["lá.piz",0,"ninguno",""], ["a.zú.car",1,"ninguno",""],
  ["fút.bol",0,"ninguno",""], ["cár.cel",0,"ninguno",""], ["di.fí.cil",1,"ninguno",""],
  ["hués.ped",0,"diptongo","ué"], ["már.mol",0,"ninguno",""], ["cés.ped",0,"ninguno",""],
  ["Cé.sar",0,"ninguno",""], ["tú.nel",0,"ninguno",""], ["ál.bum",0,"ninguno",""],
  ["crá.ter",0,"ninguno",""], ["néc.tar",0,"ninguno",""], ["fé.nix",0,"ninguno",""],
  // --- Llanas sin tilde ---
  ["me.sa",0,"ninguno",""], ["ca.sa",0,"ninguno",""], ["ven.ta.na",1,"ninguno",""],
  ["jo.ven",0,"ninguno",""],
  ["e.xa.men",1,"ninguno",""], ["a.gua",0,"diptongo","ua"], ["tiem.po",0,"diptongo","ie"],
  ["cie.lo",0,"diptongo","ie"], ["fue.go",0,"diptongo","ue"], ["a.cei.te",1,"diptongo","ei"],
  ["jau.la",0,"diptongo","au"], ["fa.mi.lia",1,"diptongo","ia"], ["ra.dio",0,"diptongo","io"],
  ["es.cu.do",1,"ninguno",""], ["co.lum.na",1,"ninguno",""], ["to.ga",0,"ninguno",""],
  ["san.da.lia",1,"diptongo","ia"], ["es.cri.ba",1,"ninguno",""], ["tem.plo",0,"ninguno",""],
  ["mo.ne.da",1,"ninguno",""], ["A.te.nas",1,"ninguno",""], ["mu.se.o",1,"hiato","eo"],
  ["po.e.ta",1,"hiato","oe"], ["te.a.tro",1,"hiato","ea"], ["Or.fe.o",1,"hiato","eo"],
  ["pa.se.o",1,"hiato","eo"], ["ca.os",0,"hiato","ao"],
  // --- Llanas con hiato acentual ---
  ["dí.a",0,"hiato_acentual","ía"], ["rí.o",0,"hiato_acentual","ío"], ["tí.a",0,"hiato_acentual","ía"],
  ["po.li.cí.a",2,"hiato_acentual","ía"], ["son.rí.e",1,"hiato_acentual","íe"],
  ["ac.tú.a",1,"hiato_acentual","úa"], ["Ma.rí.a",1,"hiato_acentual","ía"],
  ["fi.lo.so.fí.a",3,"hiato_acentual","ía"], ["mi.to.lo.gí.a",3,"hiato_acentual","ía"],
  // --- Esdrújulas ---
  ["pá.gi.na",0,"ninguno",""], ["mú.si.ca",0,"ninguno",""], ["te.lé.fo.no",1,"ninguno",""],
  ["sá.ba.do",0,"ninguno",""], ["nú.me.ro",0,"ninguno",""], ["rá.pi.do",0,"ninguno",""],
  ["mé.di.co",0,"ninguno",""], ["cá.ma.ra",0,"ninguno",""], ["mur.cié.la.go",1,"diptongo","ié"],
  ["lí.ne.a",0,"hiato","ea"], ["án.fo.ra",0,"ninguno",""], ["ár.bi.tro",0,"ninguno",""],
  ["Jú.pi.ter",0,"ninguno",""], ["Hér.cu.les",0,"ninguno",""], ["o.lím.pi.co",1,"ninguno",""],
  ["es.pec.tá.cu.lo",2,"ninguno",""], ["fi.ló.so.fo",1,"ninguno",""], ["clá.si.co",0,"ninguno",""],
  ["tú.ni.ca",0,"ninguno",""], ["Só.cra.tes",0,"ninguno",""], ["ca.tás.tro.fe",1,"ninguno",""],
  ["brú.ju.la",0,"ninguno",""], ["pi.rá.mi.de",1,"ninguno",""], ["hé.ro.e",0,"hiato","oe"],
  ["o.cé.a.no",1,"hiato","éa"],
  // --- Sobresdrújulas ---
  ["cuén.ta.me.lo",0,"diptongo","ué"], ["dí.ga.se.lo",0,"ninguno",""],
  ["ex.plí.ca.me.lo",1,"ninguno",""], ["de.vuél.ve.me.lo",1,"diptongo","ué"],
  ["re.pí.te.me.lo",1,"ninguno",""], ["en.tré.ga.se.lo",1,"ninguno",""],
  ["há.ga.se.lo",0,"ninguno",""],
  // --- Triptongos ---
  ["buey",0,"triptongo","uey"], ["miau",0,"triptongo","iau"],
  ["es.tu.diáis",2,"triptongo","iái"], ["cam.biáis",1,"triptongo","iái"],
  ["a.pre.ciáis",2,"triptongo","iái"], ["lim.piáis",1,"triptongo","iái"],
  ["a.ve.ri.guáis",3,"triptongo","uái"]
  ];

  var TILDES = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",
                 "Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U" };

  function quitarTilde(texto) {
    return texto.replace(/[áéíóúÁÉÍÓÚ]/g, function (c) { return TILDES[c]; });
  }

  // Longitud en sílabas + posición de la tónica → clase de palabra.
  function computeType(len, stress) {
    if (len === 1) return "monosilaba";
    var desdeElFinal = (len - 1) - stress;
    if (desdeElFinal === 0) return "aguda";
    if (desdeElFinal === 1) return "llana";
    if (desdeElFinal === 2) return "esdrujula";
    return "sobresdrujula";
  }

  function construir(fila) {
    var silabas = fila[0].split(".");          // sílabas con tilde
    var accented = silabas.join("");
    var plain = quitarTilde(accented);
    var tildeIndex = -1;
    for (var i = 0; i < plain.length; i++) {
      if (plain[i] !== accented[i]) { tildeIndex = i; break; }
    }
    var grupo = fila[2];
    var letras = fila[3] || "";
    return {
      plain: plain,
      syllables: silabas.map(quitarTilde),     // sin tilde
      silabas: silabas,                        // con tilde
      accented: accented,
      stress: fila[1],
      tilde: tildeIndex >= 0,
      tildeIndex: tildeIndex,
      tipo: computeType(silabas.length, fila[1]),
      vowelGroup: grupo,
      groupLetters: letras,
      groupIndex: letras ? accented.indexOf(letras) : -1
    };
  }

  global.ACENTUACION_BANCO = {
    WORDS: RAW.map(construir),
    computeType: computeType,
    quitarTilde: quitarTilde
  };
})(typeof window !== "undefined" ? window : globalThis);
