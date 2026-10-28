// ============================================================
// Letrania · banco de la Senda del Unicornio (grupo C, ACS nivel de
// 1.º). Fichas 1-12: vocales y letras M, P, L, S, T, N, D, B, V, F,
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
})();
