// ============================================================
// Letrania · banco de la Senda del Unicornio (grupo C, ACS nivel de
// 1.º). Fichas 1-34: vocales, letras, sílabas inversas y grupos,
// con las palabras de las fichas del curso y de sus recortables.
//
// Todo en MAYÚSCULAS, con pictograma (ARASAAC) y voz en cada ítem, sin
// movimiento ni tiempo. En «¿con qué letra empieza?» nunca se ofrecen B
// y V juntas: suenan igual y solo hay voz y dibujo para decidir. Las palabras con dibujo ambiguo en ARASAAC
// (PIPA, LIMA, NOTA...) se han dejado fuera a propósito.
//
// Recordatorio (ver util.js): en una lista ya publicada solo se añaden
// palabras AL FINAL; los ids de los ítems dependen de su posición.
// ============================================================
(function () {
  "use strict";
  const B = window.LetraniaBanco;
  const S = "unicornio";

  B.registrar(S, 1, {
    plantilla: "eco",
    titulo: "Las vocales",
    items: B.ecoVocal([
      "ÁRBOL", "ABEJA", "AVIÓN", "AGUA", "ELEFANTE", "ESTRELLA", "ESCOBA", "ERIZO", "ISLA", "IGLÚ",
      "IMÁN", "OSO", "OJO", "OREJA", "OLLA", "UVA", "UÑA", "UNO", "ANILLO",
    ]),
  });

  const LETRAS = [
    [2, "M", "La M", ["MA.MÁ", "ME.SA", "MO.TO", "MU.LA", "MA.NO", "MO.NO", "MA.PA", "MA.LE.TA", "MO.LI.NO"], ["P", "L"]],
    [3, "P", "La P", ["PA.PÁ", "PA.TO", "PU.MA", "PE.LO", "PE.RA", "PA.LA", "PI.ÑA", "PE.LO.TA", "PA.YA.SO"], ["M", "S"]],
    [4, "L", "La L", ["LA.TA", "LE.ÓN", "LO.BO", "LU.NA", "LO.RO", "LI.MÓN", "LE.CHE", "LÁ.PIZ", "LU.PA", "LA.GO"], ["M", "P"]],
    [5, "S", "La S", ["SA.PO", "SE.TA", "SI.LLA", "SO.PA", "SU.MA", "SO.FÁ", "SAN.DÍ.A", "SI.RE.NA", "SA.CO"], ["L", "P"]],
    [6, "T", "La T", ["TA.PA", "TE.LA", "TI.ZA", "TO.MA.TE", "TU.BO", "TOR.TU.GA", "TA.ZA", "TI.GRE", "TO.RO", "TAR.TA"], ["S", "L"]],
    [7, "N", "La N", ["NA.TA", "NI.DO", "NU.BE", "NA.RIZ", "NI.ÑO", "NA.RAN.JA", "NA.VE", "NO.CHE", "NE.VE.RA", "NU.DO"], ["M", "T"]],
    [8, "D", "La D", ["DA.DO", "DE.DO", "DIEN.TE", "DU.NA", "DU.CHA", "DEL.FÍN", "DI.BU.JO", "DO.MI.NÓ"], ["T", "N"]],
    [10, "B", "La B", ["BA.TA", "BE.BÉ", "BI.GO.TE", "BO.LA", "BU.RRO", "BO.TA", "BAR.CO", "BA.LÓN", "BO.CA", "BA.LLE.NA"], ["D", "P"]],
    [11, "V", "La V", ["VA.CA", "VE.LA", "VA.SO", "VER.DE", "VEN.TA.NA", "VOL.CÁN", "VIO.LÍN", "VE.LE.RO"], ["F", "P"]],
    [12, "F", "La F", ["FO.TO", "FI.DE.O", "SO.FÁ", "FO.CA", "FUE.GO", "FA.RO.LA", "FUEN.TE", "FÚT.BOL", "FAL.DA", "FE.LIZ"], ["V", "P"]],
  ];
  LETRAS.forEach(([ficha, letra, titulo, palabras, otras]) => {
    B.registrar(S, ficha, { plantilla: "eco", titulo: titulo, items: B.ecoLetra(letra, palabras, otras) });
  });

  // 9 · Repaso: leo palabras
  B.registrar(S, 9, {
    plantilla: "eco",
    titulo: "Leo palabras",
    items: B.ecoIgual([
      ["PALA", ["LAPA", "PATA"]],
      ["DEDO", ["DADO", "NIDO"]],
      ["SOPA", ["SAPO", "TOPO"]],
      ["MESA", ["MASA", "PESA"]],
      ["LUNA", ["LUPA", "CUNA"]],
      ["PATO", ["PALO", "GATO"]],
      ["NIDO", ["NUDO", "DEDO"]],
      ["TAPA", ["PATA", "TAZA"]],
      ["MOTO", ["MODO", "TOMO"]],
      ["SAPO", ["PASO", "SOPA"]],
      ["LOBO", ["LOMO", "LORO"]],
      ["DADO", ["LADO", "DEDO"]],
      ["MANO", ["MONO", "NANO"]],
      ["PELO", ["PALO", "POLO"]],
      ["TOMATE", ["TONATE", "PATATA"]],
      ["NUBE", ["NUEZ", "TUBO"]],
    ]).concat(B.ecoPalabra(["ME.SA", "PA.TO", "LU.NA", "SO.PA", "TA.PA", "NI.DO", "DA.DO", "MA.NO", "PE.RA", "TO.RO"])),
  });

  // ---------- Regiones 3 a 6 (fichas 13-34) ----------
  // [ficha, letra, título, palabras, otras letras para «¿con qué letra
  // empieza?», opciones de ecoLetra]. Las letras que suenan igual que
  // otra (C/Z/S en Almería, LL/Y, G/J delante de e, i) no se ofrecen
  // juntas en «¿con qué letra empieza?».
  const LETRAS2 = [
    [13, "C", "La C", ["CA.SA", "CA.MA", "CO.CHE", "CU.NA", "CO.CO", "CA.MI.SA", "CU.BO", "CO.NE.JO", "CA.BA.LLO", "CA.JA"], ["P", "T"], { vocales: ["A", "O", "U"] }],
    [14, "QU", "QU", ["QUE.SO", "PA.QUE.TE", "MOS.QUI.TO", "ES.QUÍ", "BU.QUE", "RA.QUE.TA", "MÁ.QUI.NA", "TAN.QUE"], null, { vocales: ["E", "I"], relleno: ["CA", "CO"] }],
    [15, "G", "La G", ["GA.TO", "GO.TA", "GU.SA.NO", "GA.LLI.NA", "GO.MA", "GA.FAS", "GO.RRO", "GA.LLE.TA", "LA.GO", "A.GUA"], ["P", "T"], { vocales: ["A", "O", "U"] }],
    [16, "J", "La J", ["JA.MÓN", "JI.RA.FA", "JA.BÓN", "JA.RRA", "JO.YA", "JU.GUE.TE", "O.JO", "CO.NE.JO", "A.BE.JA", "TI.JE.RAS"], ["L", "M"]],
    [17, "H", "La H", ["HE.LA.DO", "HO.JA", "HUE.VO", "HA.DA", "HI.LO", "HI.GO", "HA.CHA", "HU.MO", "BÚ.HO", "HOR.MI.GA"], ["M", "P"]],
    [18, "Ñ", "La Ñ", ["NI.ÑO", "PI.ÑA", "U.ÑA", "MO.ÑO", "BA.ÑO", "CA.ÑA", "A.RA.ÑA", "MON.TA.ÑA", "PA.ÑUE.LO", "ÑU"], null],
    [19, "Z", "La Z", ["ZA.PA.TO", "ZO.RRO", "ZU.MO", "TA.ZA", "PO.ZO", "CE.RE.ZA", "LA.ZO", "ZA.NA.HO.RIA", "BRA.ZO", "TI.ZA"], ["M", "T"], { vocales: ["A", "O", "U"] }],
    [20, "C", "CE y CI", ["CE.BO.LLA", "CI.NE", "CE.RE.ZA", "CI.RUE.LA", "CE.PI.LLO", "CE.NA", "CE.RI.LLA", "BI.CI.CLE.TA", "CER.DO", "CIS.NE"], null, { vocales: ["E", "I"], relleno: ["CA", "CO"] }],
    [21, "LL", "LL", ["LLA.VE", "LLU.VIA", "SI.LLA", "GA.LLI.NA", "ES.TRE.LLA", "BO.TE.LLA", "PO.LLI.TO", "CA.BA.LLO", "A.NI.LLO", "O.LLA"], null],
    [22, "Y", "La Y", ["YE.MA", "YO.GUR", "PA.YA.SO", "PLA.YA", "RA.YO", "YA.TE", "JO.YA", "HO.YO", "YO.YÓ"], ["M", "P"]],
    [23, "CH", "CH", ["CHO.CO.LA.TE", "CHU.PE.TE", "CO.CHE", "LE.CHE", "MO.CHI.LA", "CHI.CLE", "NO.CHE", "DU.CHA", "CU.CHA.RA", "O.CHO", "CHAR.CO"], null],
    [24, "RR", "RR", ["PE.RRO", "TO.RRE", "JA.RRA", "GO.RRO", "BU.RRO", "CA.RRO", "ZO.RRO", "GUI.TA.RRA", "TIE.RRA"], null, { relleno: ["RO", "RA"] }],
  ];
  LETRAS2.forEach(([ficha, letra, titulo, palabras, otras, opciones]) => {
    B.registrar(S, ficha, { plantilla: "eco", titulo: titulo, items: B.ecoLetra(letra, palabras, otras, opciones) });
  });

  // 25 · Sílabas inversas (AL, ES, IS...)
  B.registrar(S, 25, {
    plantilla: "eco",
    titulo: "Sílabas inversas",
    items: B.ecoInversa(["AL.TO", "ES.PA.DA", "IS.LA", "ÁR.BOL", "ES.CO.BA", "ES.TRE.LLA", "AL.FOM.BRA", "EN.CHU.FE", "IN.SEC.TO", "AR.MA.RIO", "ES.CA.LE.RA"]),
  });

  // 26-30 · Grupos de dos consonantes
  const GRUPOS = [
    [26, ["BR", "BL"], "BR y BL", ["BRA.ZO", "BRU.JA", "LI.BRO", "CA.BRA", "SOM.BRE.RO", "BLU.SA", "CA.BLE", "TA.BLA", "NIE.BLA", "MUE.BLE"]],
    [27, ["PR", "PL"], "PR y PL", ["PRE.MIO", "PRA.DO", "PRO.FE.SO.RA", "PRI.MA.VE.RA", "SOR.PRE.SA", "PLA.TO", "PLÁ.TA.NO", "PLU.MA", "PLA.YA", "PLA.NE.TA"]],
    [28, ["TR", "FR", "FL"], "TR, FR y FL", ["TRA.JE", "TRI.GO", "ES.TRE.LLA", "CUA.TRO", "FRE.SA", "FRU.TA", "FLE.CHA", "FLA.MEN.CO", "FLOR", "TREN"]],
    [29, ["CR", "CL"], "CR y CL", ["CRO.MO", "CRE.MA", "MI.CRÓ.FO.NO", "ES.CRI.BIR", "CLA.SE", "CLA.VO", "CLA.VEL", "BI.CI.CLE.TA", "CHI.CLE", "CRUZ", "CLIP"]],
    [30, ["GR", "GL"], "GR y GL", ["GLO.BO", "GRÚ.A", "GRI.LLO", "TI.GRE", "RE.GLA", "I.GLÚ", "CAN.GRE.JO", "GRI.FO", "LÁ.GRI.MA", "GRAN.JA"]],
  ];
  GRUPOS.forEach(([ficha, grupos, titulo, palabras]) => {
    B.registrar(S, ficha, { plantilla: "eco", titulo: titulo, items: B.ecoGrupo(grupos, palabras) });
  });

  // 31 · La mayúscula: al empezar y en los nombres (aquí sí hay
  // minúsculas, que es lo que se aprende).
  B.registrar(S, 31, {
    plantilla: "espejo",
    titulo: "La mayúscula",
    items: B.espejoPares(
      [
        ["Mi gato es gris.", "mi gato es gris.", "AL EMPEZAR UNA FRASE, MAYÚSCULA."],
        ["Ana", "ana", "LOS NOMBRES DE PERSONA, CON MAYÚSCULA."],
        ["El sol sale.", "el sol sale.", "AL EMPEZAR UNA FRASE, MAYÚSCULA."],
        ["Almería", "almería", "LOS NOMBRES DE LUGARES, CON MAYÚSCULA."],
        ["Luis come.", "luis come.", "AL EMPEZAR Y EN LOS NOMBRES, MAYÚSCULA."],
        ["La luna es blanca.", "la luna es blanca.", "AL EMPEZAR UNA FRASE, MAYÚSCULA."],
        ["Pepe", "pepe", "LOS NOMBRES DE PERSONA, CON MAYÚSCULA."],
        ["Mi casa es azul.", "mi casa es azul.", "AL EMPEZAR UNA FRASE, MAYÚSCULA."],
        ["Lola", "lola", "LOS NOMBRES DE PERSONA, CON MAYÚSCULA."],
        ["Mamá canta.", "mamá canta.", "AL EMPEZAR UNA FRASE, MAYÚSCULA."],
      ],
      "¿CUÁL ESTÁ BIEN ESCRITA?"
    ),
  });

  // 32 · Frases de 3 palabras: ¿cuántas palabras hay?
  const CUENTA = [
    ["EL SOL SALE.", "sol"], ["PAPÁ COME.", "comer"], ["LA NIÑA SALTA.", "saltar"], ["MI GATO DUERME MUCHO.", "gato"], ["EL PERRO LADRA.", "perro"],
    ["ANA LEE.", "leer"], ["LA VACA COME HIERBA.", "vaca"], ["EL PATO NADA.", "pato"], ["MAMÁ BEBE AGUA.", "beber"], ["LUIS CORRE.", "correr"],
    ["MI TÍA PINTA.", "pintar"], ["EL BEBÉ LLORA MUCHO.", "llorar"],
  ];
  B.registrar(S, 32, {
    plantilla: "eco",
    titulo: "Frases de 3 palabras",
    items: CUENTA.map(([f, picto], n) => {
      const cuantas = String(f.replace(".", "").split(" ").length);
      const ops = ["2", "3", "4"];
      return {
        plantilla: "eco",
        enunciado: "¿CUÁNTAS PALABRAS HAY?",
        palabra: f,
        opciones: ops,
        correcta: ops.indexOf(cuantas),
        solucion: f + " → " + cuantas + " PALABRAS",
        audio: f.toLowerCase(),
        picto: picto,
        regla: f + " TIENE " + cuantas + " PALABRAS: " + f.replace(".", "").split(" ").join(" · ") + ".",
        pista: "",
      };
    }),
  });

  // 33 · Escribo una frase: ordenar tres palabras (con voz).
  const FRASES = [
    ["EL PATO NADA.", "pato"], ["LA VACA COME.", "vaca"], ["MI GATO DUERME.", "gato"], ["EL SOL SALE.", "sol"], ["ANA LEE CUENTOS.", "leer"],
    ["PAPÁ BEBE AGUA.", "beber"], ["LA NIÑA SALTA.", "saltar"], ["EL PERRO LADRA.", "perro"], ["LUIS COME PAN.", "pan"], ["MAMÁ PINTA FLORES.", "pintar"],
  ];
  B.registrar(S, 33, {
    plantilla: "ordenar",
    titulo: "Escribo una frase",
    items: B.ordenar(FRASES.map((f) => f[0]), "PRIMERO, QUIÉN ES; DESPUÉS, QUÉ HACE.").map((it, n) =>
      Object.assign(it, { enunciado: "ORDENA LA FRASE.", picto: FRASES[n][1] })
    ),
  });

  // 34 · Gran repaso
  B.registrar(S, 34, { plantilla: "mixta", titulo: "Gran repaso", items: B.repaso(S, 34, 30) });
})();
