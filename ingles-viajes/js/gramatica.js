// ============================================================
// Inglés para Viajar — corrector gramatical.
//
// No es un corrector genérico: es una lista de los errores que
// comete específicamente un hispanohablante al hablar inglés.
// Por eso cada regla lleva su explicación en español, que es lo
// que de verdad enseña ("no es 'I have 30 years', porque en
// inglés la edad se dice con el verbo ser").
//
// Cada regla aplica sobre el texto tal cual lo has escrito o
// dicho, y devuelve la frase corregida más el motivo.
// ============================================================

const CONTRACCIONES = [
  [/\bi'm\b/gi, "i am"], [/\byou're\b/gi, "you are"], [/\bhe's\b/gi, "he is"],
  [/\bshe's\b/gi, "she is"], [/\bit's\b/gi, "it is"], [/\bwe're\b/gi, "we are"],
  [/\bthey're\b/gi, "they are"], [/\bthat's\b/gi, "that is"], [/\bthere's\b/gi, "there is"],
  [/\bhere's\b/gi, "here is"], [/\bwhat's\b/gi, "what is"], [/\bwhere's\b/gi, "where is"],
  [/\bwho's\b/gi, "who is"], [/\bhow's\b/gi, "how is"], [/\blet's\b/gi, "let us"],
  [/\bi've\b/gi, "i have"], [/\byou've\b/gi, "you have"], [/\bwe've\b/gi, "we have"],
  [/\bthey've\b/gi, "they have"], [/\bi'd\b/gi, "i would"], [/\byou'd\b/gi, "you would"],
  [/\bhe'd\b/gi, "he would"], [/\bwe'd\b/gi, "we would"], [/\bthey'd\b/gi, "they would"],
  [/\bi'll\b/gi, "i will"], [/\byou'll\b/gi, "you will"], [/\bhe'll\b/gi, "he will"],
  [/\bshe'll\b/gi, "she will"], [/\bwe'll\b/gi, "we will"], [/\bthey'll\b/gi, "they will"],
  [/\bit'll\b/gi, "it will"], [/\bdon't\b/gi, "do not"], [/\bdoesn't\b/gi, "does not"],
  [/\bdidn't\b/gi, "did not"], [/\bisn't\b/gi, "is not"], [/\baren't\b/gi, "are not"],
  [/\bwasn't\b/gi, "was not"], [/\bweren't\b/gi, "were not"], [/\bhaven't\b/gi, "have not"],
  [/\bhasn't\b/gi, "has not"], [/\bhadn't\b/gi, "had not"], [/\bcan't\b/gi, "can not"],
  [/\bcannot\b/gi, "can not"], [/\bcouldn't\b/gi, "could not"], [/\bwon't\b/gi, "will not"],
  [/\bwouldn't\b/gi, "would not"], [/\bshouldn't\b/gi, "should not"],
  [/\bmustn't\b/gi, "must not"], [/\bo'clock\b/gi, "oclock"],
];

// Deja el texto en la forma que usan las comparaciones internas:
// minúsculas, sin contracciones y sin puntuación (salvo la
// interrogación, que sí distingue una pregunta de una afirmación).
export function normalizar(texto) {
  // Se quitan también los acentos: si escribes "café" o "sí", la
  // comparación no debería tropezar por una tilde.
  let t = " " + String(texto || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") + " ";
  CONTRACCIONES.forEach(([re, sub]) => { t = t.replace(re, sub); });
  t = t.replace(/[^a-z0-9?'\s]/g, " ");
  t = t.replace(/'/g, "");
  return t.replace(/\s+/g, " ").trim();
}

export function palabras(texto) {
  return normalizar(texto).replace(/\?/g, " ").split(/\s+/).filter(Boolean);
}

// ------------------------------------------------------------
// Las reglas. `grave: true` marca los errores que impiden que te
// entiendan; el resto son cosas que suenan raras pero se entienden.
// ------------------------------------------------------------

const REGLAS = [
  {
    id: "yo-mayuscula",
    buscar: /\bi\b/g,
    cambiar: "I",
    soloMinuscula: true,
    motivo: "El pronombre «I» (yo) va SIEMPRE en mayúscula, esté donde esté en la frase.",
  },
  {
    id: "edad",
    buscar: /\b(i|we|he|she|they|you)\s+(have|has)\s+(\d+|twenty|thirty|forty|fifty|sixty)\s*(years old|years|year)\b/gi,
    cambiar: (m, suj, _v, num) => `${suj} ${verboSer(suj)} ${num} years old`,
    grave: true,
    motivo: "La edad en inglés se dice con el verbo «to be», no con «have»: «I am 30 years old», nunca «I have 30 years».",
  },
  {
    id: "sensaciones",
    buscar: /\b(i|we|you|he|she|they)\s+(have|has)\s+(hungry|thirsty|cold|hot|sleepy|afraid|right|wrong|lucky|tired)\b/gi,
    cambiar: (m, suj, _v, adj) => `${suj} ${verboSer(suj)} ${adj}`,
    grave: true,
    motivo: "Hambre, sed, frío, calor, sueño y miedo se dicen con «to be»: «I am hungry», no «I have hungry».",
  },
  {
    id: "estar-de-acuerdo",
    buscar: /\b(i|we|you|they)\s+(am|are|is)\s+agree\b/gi,
    cambiar: (m, suj) => `${suj} agree`,
    motivo: "«Agree» ya es un verbo: se dice «I agree», no «I am agree».",
  },
  {
    // El sujeto puede colarse en medio ("Can you to help me?"), pero
    // solo se acepta un pronombre: así "would like to go" no cae aquí.
    id: "modal-mas-to",
    buscar: /\b(can|could|must|should|will|would|may|might)\s+((?:i|you|he|she|it|we|they)\s+)?to\s+(\w+)/gi,
    cambiar: (m, modal, sujeto, verbo) => `${modal} ${sujeto || ""}${verbo}`,
    motivo: "Detrás de can, could, must, should, will o would el verbo va sin «to»: «Can you help me?», no «Can you to help me?».",
  },
  {
    id: "para-mas-infinitivo",
    buscar: /\bfor\s+to\s+(\w+)/gi,
    cambiar: (m, verbo) => `to ${verbo}`,
    motivo: "«Para + infinitivo» es solo «to»: «I came to visit», no «for to visit».",
  },
  {
    id: "doble-negacion",
    buscar: /\b(do not|don't|does not|doesn't|did not|didn't|can not|can't|cannot|will not|won't|have not|haven't|has not|hasn't)\s+(\w+\s+)?(nothing|nobody|nowhere|never|no one)\b/gi,
    cambiar: (m, aux, medio, neg) => {
      const mapa = { nothing: "anything", nobody: "anybody", nowhere: "anywhere", never: "ever", "no one": "anyone" };
      return `${aux} ${medio || ""}${mapa[neg.toLowerCase()] || neg}`;
    },
    grave: true,
    motivo: "En inglés no se pone doble negación: «I don't know anything», no «I don't know nothing».",
  },
  {
    id: "pregunta-sin-inversion",
    buscar: /\b(where|what|when|how|why|which)\s+(i|we|you|they|he|she)\s+(can|could|should|must|will|would)\b/gi,
    cambiar: (m, q, suj, modal) => `${q} ${modal} ${suj}`,
    grave: true,
    motivo: "En las preguntas, el verbo va ANTES del sujeto: «Where can I buy...?», no «Where I can buy...?».",
  },
  {
    // Solo el calco "how is it called". «How do you say X?» es
    // correctísimo y no debe tocarse.
    id: "como-se-llama",
    buscar: /\bhow\s+(is it|it is|do you)\s+(call(ed|s)?|call it)\b/gi,
    cambiar: "what is it called",
    motivo: "«¿Cómo se llama?» es «What is it called?». En inglés se pregunta con «what», no con «how».",
  },
  {
    id: "explicar-decir",
    buscar: /\b(explain|say)\s+(me|us|him|her|them)\b/gi,
    cambiar: (m, verbo, pron) => (verbo.toLowerCase() === "say" ? `tell ${pron}` : `explain to ${pron}`),
    motivo: "Se dice «explain to me» o «tell me», nunca «explain me» ni «say me».",
  },
  {
    id: "gente-plural",
    buscar: /\bpeople\s+(is|was|has)\b/gi,
    cambiar: (m, v) => `people ${{ is: "are", was: "were", has: "have" }[v.toLowerCase()]}`,
    motivo: "«People» es plural en inglés: «people are», no «people is».",
  },
  {
    // Ojo: detrás de does/did/to/modal el verbo va en infinitivo
    // ("does it take"), así que si hay auxiliar delante no se toca.
    id: "tercera-persona",
    buscar: /(\b(?:do|does|did|to|can|could|will|would|should|must|may|might|not|is|are|was|were|be|been)\s+)?\b(he|she|it)\s+(go|have|do|want|need|speak|live|work|cost|take|start|arrive|leave|come|look|know|think|like|say|make|get)\b/gi,
    cambiar: (m, auxiliar, suj, verbo) => {
      if (auxiliar) return m;
      const irregulares = { go: "goes", have: "has", do: "does" };
      const v = verbo.toLowerCase();
      return `${suj} ${irregulares[v] || (v.endsWith("s") || v.endsWith("h") || v.endsWith("x") ? v + "es" : v + "s")}`;
    },
    motivo: "Con he, she o it el verbo lleva -s en presente: «he goes», «she works», «it costs».",
  },
  {
    id: "comparativo-more",
    buscar: /\bmore\s+(big|small|cheap|easy|fast|old|young|long|short|nice|cold|hot|slow|near|clean|rich|happy|early|late)\b/gi,
    cambiar: (m, adj) => {
      const a = adj.toLowerCase();
      const irr = { easy: "easier", happy: "happier", early: "earlier", big: "bigger", hot: "hotter", nice: "nicer", late: "later" };
      return irr[a] || a + "er";
    },
    motivo: "Los adjetivos cortos hacen el comparativo con -er, no con «more»: «bigger», no «more big».",
  },
  {
    id: "articulo-an",
    buscar: /\ba\s+([aeiou]\w*)/gi,
    cambiar: (m, palabra) => {
      // "a university", "a one-way" llevan a pesar de empezar por vocal
      if (/^(uni|use|useful|user|europ|one)/i.test(palabra)) return m;
      return `an ${palabra}`;
    },
    motivo: "Delante de sonido vocálico se usa «an»: «an apple», «an hour», «an emergency».",
  },
  {
    id: "articulo-a",
    buscar: /\ban\s+([bcdfgjklmnpqrstvwxyz]\w*)/gi,
    cambiar: (m, palabra) => {
      if (/^(hour|honest|honou?r)/i.test(palabra)) return m;
      return `a ${palabra}`;
    },
    motivo: "Delante de sonido consonántico se usa «a», no «an».",
  },
  {
    id: "incontables",
    buscar: /\b(informations|advices|luggages|baggages|furnitures|moneys|breads|foods|homeworks)\b/gi,
    cambiar: (m) => m.slice(0, -1),
    motivo: "Estas palabras no tienen plural en inglés: information, advice, luggage, money… siempre en singular.",
  },
  {
    id: "desde-hace",
    buscar: /\bsince\s+(\d+|a|two|three|four|five|six|ten|twenty)\s+(day|days|week|weeks|hour|hours|month|months|year|years|minute|minutes)\b/gi,
    cambiar: (m, cantidad, unidad) => `for ${cantidad} ${unidad}`,
    motivo: "«Since» va con un momento concreto (since Monday); para una duración se usa «for»: «for two days».",
  },
  {
    id: "preposiciones",
    // "it" se queda fuera a propósito: en "I think it's mild" no es
    // el objeto del verbo, sino el sujeto de la oración siguiente.
    buscar: /\b(depends?|listens?|waits?|looks?|thinks?|dreams?|arrives?|married|talks?)\s+(of|music|me|him|her|us|them|in|with|to|at)\b/gi,
    cambiar: (m, verbo, resto) => {
      const v = verbo.toLowerCase().replace(/s$/, "");
      const r = resto.toLowerCase();
      const correcto = {
        depend: "on", listen: "to", wait: "for", look: "at",
        think: "about", dream: "about", arrive: "at", married: "to", talk: "to",
      }[v];
      if (!correcto) return m;
      // "listen music" -> "listen to music"
      if (["music", "me", "him", "her", "us", "them"].includes(r)) return `${verbo} ${correcto} ${resto}`;
      if (r === correcto) return m;
      return `${verbo} ${correcto}`;
    },
    motivo: "Cada verbo lleva su preposición fija: depend ON, listen TO, wait FOR, look AT, think ABOUT, arrive AT.",
  },
  {
    id: "ir-a-casa",
    buscar: /\b(go|going|went|come|back)\s+to\s+home\b/gi,
    cambiar: (m, v) => `${v} home`,
    motivo: "«Home» no lleva «to»: se dice «go home», no «go to home».",
  },
  {
    id: "cada-dia",
    buscar: /\bevery\s+(days|weeks|months|years|mornings|nights)\b/gi,
    cambiar: (m, p) => `every ${p.slice(0, -1)}`,
    motivo: "Detrás de «every» la palabra va en singular: «every day», no «every days».",
  },
  {
    id: "en-la-noche",
    buscar: /\bin\s+the\s+night\b/gi,
    cambiar: "at night",
    motivo: "Se dice «at night», aunque sea «in the morning» y «in the afternoon».",
  },
  {
    id: "cuanto-cuesta",
    buscar: /\bhow\s+much\s+costs?\s*(the\s+[a-z]+|it|this|that)?/gi,
    cambiar: (m, objeto) => `how much does ${objeto ? objeto.toLowerCase() : "it"} cost`,
    motivo: "«¿Cuánto cuesta?» es «How much is it?» o «How much does it cost?»: el verbo «cost» va al final.",
  },
  {
    id: "cuanto-tiempo",
    buscar: /\bhow\s+(many|much)\s+time\b/gi,
    cambiar: "how long",
    motivo: "«¿Cuánto tiempo?» es «How long?», no «How much time?».",
  },
  {
    id: "sujeto-omitido",
    buscar: /^(want|need|would like|am|have|like|think|going)\b/i,
    cambiar: (m) => `I ${m.toLowerCase()}`,
    grave: true,
    motivo: "En inglés el sujeto no se puede omitir: hay que decir «I want», no solo «Want».",
  },
  {
    id: "es-posible",
    buscar: /^is\s+possible\b/i,
    cambiar: "is it possible",
    motivo: "Las frases impersonales necesitan «it»: «Is it possible?», no «Is possible?».",
  },
  {
    id: "aburrido",
    buscar: /\b(i|we|you|he|she|they)\s+(am|are|is)\s+(boring|interesting|exciting)\b/gi,
    cambiar: (m, suj, ser, adj) => `${suj} ${ser} ${adj.toLowerCase().replace(/ing$/, "ed")}`,
    motivo: "«I am boring» significa «soy aburrido (yo aburro)». Para «estoy aburrido» es «I am bored».",
  },
  {
    id: "orden-adjetivo",
    buscar: /\b(a|an|the|one|two)\s+(room|bed|ticket|table|coffee|bag|seat|car)\s+(double|single|small|big|large|black|red|blue|green|white|return|cheap)\b/gi,
    cambiar: (m, art, sust, adj) => `${art} ${adj} ${sust}`,
    motivo: "En inglés el adjetivo va DELANTE del sustantivo: «a double room», no «a room double».",
  },
  {
    id: "gustar-mucho",
    buscar: /\b(like|love|enjoy)\s+very\s+much\s+(\w+)/gi,
    cambiar: (m, verbo, objeto) => `${verbo} ${objeto} very much`,
    motivo: "«Very much» va al final: «I like it very much», no «I like very much it».",
  },
  {
    id: "asistir",
    buscar: /\bassist\s+to\b/gi,
    cambiar: "attend",
    motivo: "Falso amigo: «assist» es ayudar. Asistir a un sitio es «attend».",
  },
  {
    id: "actualmente",
    buscar: /\bactually\b/gi,
    cambiar: "actually",
    soloAviso: true,
    motivo: "Ojo con el falso amigo: «actually» significa «en realidad». «Actualmente» es «currently» o «nowadays».",
  },
  {
    id: "sensible",
    buscar: /\bsensible\b/gi,
    cambiar: "sensible",
    soloAviso: true,
    motivo: "Falso amigo: «sensible» en inglés es «sensato». «Sensible» (de sentimientos) es «sensitive».",
  },
  {
    // No se reescribe: si de verdad está estreñido, la frase es
    // correcta. Lo que hace falta es el aviso, sobre todo porque
    // esta se suele soltar en una farmacia.
    id: "constipado",
    buscar: /\bconstipated\b/gi,
    soloAviso: true,
    grave: true,
    motivo: "¡Cuidado! «Constipated» significa estreñido. Si querías decir «estoy constipado», es «I have a cold».",
  },
  {
    id: "embarazada",
    buscar: /\bembarrassed\b/gi,
    cambiar: "embarrassed",
    soloAviso: true,
    motivo: "Falso amigo: «embarrassed» es avergonzado. «Embarazada» es «pregnant».",
  },
];

function verboSer(sujeto) {
  const s = sujeto.toLowerCase();
  if (s === "i") return "am";
  if (["he", "she", "it"].includes(s)) return "is";
  return "are";
}

// ------------------------------------------------------------

/**
 * Corrige una frase y explica cada cambio.
 * @param {string} texto la frase tal cual la escribiste o dijiste
 * @returns {{corregido: string, avisos: Array}}
 */
export function corregir(texto) {
  let resultado = String(texto || "").trim();
  const avisos = [];

  REGLAS.forEach((regla) => {
    const antes = resultado;

    if (regla.soloAviso) {
      if (regla.buscar.test(antes)) {
        avisos.push({ tipo: "gramatica", motivo: regla.motivo, grave: !!regla.grave, informativo: !regla.grave });
      }
      regla.buscar.lastIndex = 0;
      return;
    }

    if (regla.id === "yo-mayuscula") {
      // caso especial: solo interesa cuando el "i" está en minúscula
      const nuevo = antes.replace(/(^|[\s.,!?;:"'(])i(?=[\s.,!?;:"')]|$)/g, "$1I");
      if (nuevo !== antes) {
        resultado = nuevo;
        avisos.push({ tipo: "gramatica", motivo: regla.motivo, antes: "i", despues: "I", grave: false });
      }
      return;
    }

    const nuevo = antes.replace(regla.buscar, regla.cambiar);
    regla.buscar.lastIndex = 0;
    if (nuevo !== antes) {
      const coincidencia = (antes.match(regla.buscar) || [])[0];
      regla.buscar.lastIndex = 0;
      resultado = nuevo;
      avisos.push({
        tipo: "gramatica",
        motivo: regla.motivo,
        antes: coincidencia ? coincidencia.trim() : null,
        despues: null,
        grave: !!regla.grave,
      });
    }
  });

  // La primera letra en mayúscula y un punto final, que es lo que
  // distingue una frase escrita de un montón de palabras sueltas.
  if (resultado) {
    resultado = resultado.charAt(0).toUpperCase() + resultado.slice(1);
    if (!/[.!?]$/.test(resultado)) {
      resultado += normalizar(resultado).includes("?") ? "" : ".";
    }
  }

  return { corregido: resultado, avisos };
}
