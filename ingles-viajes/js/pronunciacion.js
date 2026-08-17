// ============================================================
// Inglés para Viajar — ayuda de pronunciación.
//
// Cómo funciona el análisis, dicho sin adornos: el navegador
// escucha y transcribe lo que ha ENTENDIDO. La app compara esa
// transcripción con la frase objetivo. Si el reconocedor entendió
// otra palabra parecida, es señal de que esa palabra no se
// entiende bien tal como la has dicho.
//
// No es un medidor de acento: es un detector de "esta palabra no
// se te ha entendido", que para viajar es justo lo que importa.
// ============================================================

import { palabras } from "./gramatica.js";

// Cómo suenan las palabras que más se atragantan, escrito a la
// española. La sílaba con tilde es la fuerte.
export const COMO_SUENA = {
  the: "de (con la lengua entre los dientes)",
  this: "dis", that: "dat", these: "díis", those: "dóus", there: "déar",
  they: "déi", them: "dem", then: "den", with: "uíz", without: "uidáut",
  think: "zink", thing: "zing", three: "zríi", thirty: "zérti", thank: "zank",
  through: "zrúu", thursday: "zérsdei", both: "bóuz", month: "manz",
  water: "uóter", want: "uónt", one: "uán", we: "uí", where: "uér",
  what: "uót", when: "uén", which: "uích", why: "uái", who: "júu",
  work: "uérk", world: "uérld", would: "wud", will: "uíl", week: "uíik",
  very: "véri", visit: "vísit", have: "jav", hotel: "joutél", hour: "áuar",
  here: "jíar", hello: "jelóu", help: "jélp", how: "jáo", house: "jáus",
  hungry: "jángri", happy: "jápi", hospital: "jóspital",
  vegetable: "véchtabol", journey: "yérni", just: "yast", change: "chéinch",
  cheap: "chíip", chicken: "chíken", church: "chérch",
  station: "stéishon", question: "kuéschon", reservation: "reservéishon",
  information: "informéishon", suggestion: "sachéschon",
  spain: "spéin", spanish: "spánish", speak: "spíik", school: "skúul",
  street: "stríit", stop: "stop", small: "smol", start: "start",
  student: "stiúdent", stay: "stéi", study: "stádi",
  bought: "bot", thought: "zot", enough: "ináf", through_: "zrúu",
  laugh: "laf", cough: "cof", although: "oldóu", night: "náit",
  right: "ráit", light: "láit", eight: "éit", weight: "uéit",
  island: "áiland", listen: "lísen", castle: "cásel", knife: "náif",
  know: "nóu", knee: "níi", wednesday: "uénsdei", answer: "ánser",
  comfortable: "cámftabol", vegetables: "véchtabols", chocolate: "chóklat",
  restaurant: "réstrant", business: "bísnes", clothes: "clóudz",
  bread: "bred", great: "gréit", break: "bréik", heart: "jart",
  women: "uímen", woman: "uúman", busy: "bísi", said: "sed", again: "aguén",
  many: "méni", any: "éni", money: "máni", country: "cántri", young: "iáng",
  beach: "bíich", cheese: "chíis", please: "plíis", people: "píipol",
  because: "bicós", before: "bifór", between: "bituín", enough_: "ináf",
  ticket: "tíket", tired: "táiard", tomorrow: "tumórou", together: "tuguéder",
  useful: "iúsful", usually: "iúshuali", university: "iunivérsiti",
};

// Detecta a qué "trampa" pertenece una palabra, para poder dar el
// consejo concreto en vez de un genérico "pronúncialo mejor".
const TRAMPAS = [
  {
    prueba: (p) => /^(th)/.test(p) || /th/.test(p),
    consejo: "La «th» no es ni t ni d ni z española pura: saca un poco la punta de la lengua entre los dientes. En «think» sale sorda (como la z de «zapato»); en «the» sale sonora, vibrando.",
  },
  {
    prueba: (p) => /^s[bcdfgklmnpqrtvwxz]/.test(p),
    consejo: "No pongas una «e» delante. Es «school», no «escuel»; «Spain», no «Espain». Empieza directamente con la s, aunque cueste.",
  },
  {
    prueba: (p) => /^h/.test(p) && !/^(hour|honest|honou?r)/.test(p),
    consejo: "La «h» inicial en inglés SÍ suena: es un soplo de aire, como la j suave andaluza. «Hello» no es «elo».",
  },
  {
    prueba: (p) => /^(wh|w)/.test(p),
    consejo: "La «w» se pronuncia redondeando los labios, como «u» + vocal: «water» es «uóter», no «váter».",
  },
  {
    prueba: (p) => /v/.test(p),
    consejo: "La «v» inglesa se hace con los dientes de arriba sobre el labio de abajo, y vibra. No es la b española: «very» no es «beri».",
  },
  {
    prueba: (p) => /ed$/.test(p),
    consejo: "La terminación «-ed» casi nunca suena «ed»: en «worked» suena «t», en «arrived» suena «d», y solo tras t/d suena «id» (wanted → uónted).",
  },
  {
    prueba: (p) => /(gh|kn|wr|mb$|bt$)/.test(p),
    consejo: "Aquí hay letras mudas: la «gh» de «night» no suena, la «k» de «know» tampoco, ni la «b» de «climb».",
  },
  {
    prueba: (p) => /(sh|ch|tion|sion)/.test(p),
    consejo: "«sh» es el sonido de mandar callar (shhh); «ch» es como la ch española. «-tion» suena «shon»: station → stéishon.",
  },
  {
    prueba: (p) => /^(j|g[ei])/.test(p),
    consejo: "La «j» inglesa suena como una «y» fuerte, cercana a la ch: «just» es «yast», no «just» con jota española.",
  },
  {
    prueba: (p) => /r/.test(p),
    consejo: "La «r» inglesa no vibra: la lengua se curva hacia atrás sin tocar el paladar. Suena más suave que la española.",
  },
];

export function comoSuena(palabra) {
  const p = String(palabra || "").toLowerCase().replace(/[^a-z]/g, "");
  return COMO_SUENA[p] || null;
}

export function consejoPara(palabra) {
  const p = String(palabra || "").toLowerCase().replace(/[^a-z]/g, "");
  if (!p) return null;
  const trampa = TRAMPAS.find((t) => t.prueba(p));
  return trampa ? trampa.consejo : null;
}

// Distancia de edición entre dos palabras. Se usa para decidir si
// lo que entendió el reconocedor es "casi" la palabra objetivo
// (fallo de pronunciación) o algo totalmente distinto (dijiste
// otra cosa).
function distancia(a, b) {
  const filas = a.length + 1;
  const cols = b.length + 1;
  let anterior = Array.from({ length: cols }, (_, j) => j);
  for (let i = 1; i < filas; i++) {
    const actual = [i];
    for (let j = 1; j < cols; j++) {
      const coste = a[i - 1] === b[j - 1] ? 0 : 1;
      actual[j] = Math.min(anterior[j] + 1, actual[j - 1] + 1, anterior[j - 1] + coste);
    }
    anterior = actual;
  }
  return anterior[cols - 1];
}

export function parecido(a, b) {
  if (!a || !b) return 0;
  const max = Math.max(a.length, b.length);
  return max === 0 ? 1 : 1 - distancia(a, b) / max;
}

/**
 * Compara lo que el reconocedor entendió con la frase objetivo y
 * señala las palabras que probablemente no se han entendido.
 *
 * @param {string} escuchado  la transcripción del navegador
 * @param {string} objetivo   la frase que se pretendía decir
 * @returns {Array} lista de avisos de pronunciación
 */
export function compararPronunciacion(escuchado, objetivo) {
  const dichas = palabras(escuchado);
  const esperadas = palabras(objetivo);
  if (!dichas.length || !esperadas.length) return [];

  const avisos = [];
  const yaUsadas = new Set();

  esperadas.forEach((esperada) => {
    if (esperada.length <= 2) return; // "a", "to", "of": no aportan nada

    // ¿Está esa palabra tal cual en lo que se ha entendido?
    const exacta = dichas.findIndex((d, i) => d === esperada && !yaUsadas.has(i));
    if (exacta !== -1) { yaUsadas.add(exacta); return; }

    // ¿Hay algo parecido? Entonces es un problema de pronunciación.
    let mejor = { indice: -1, valor: 0 };
    dichas.forEach((d, i) => {
      if (yaUsadas.has(i)) return;
      const v = parecido(d, esperada);
      if (v > mejor.valor) mejor = { indice: i, valor: v };
    });

    if (mejor.valor >= 0.5 && mejor.indice !== -1) {
      yaUsadas.add(mejor.indice);
      avisos.push({
        tipo: "pronunciacion",
        palabra: esperada,
        entendido: dichas[mejor.indice],
        suena: comoSuena(esperada),
        consejo: consejoPara(esperada),
      });
    }
  });

  return avisos.slice(0, 3); // más de tres correcciones a la vez desanima
}
