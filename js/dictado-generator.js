// ============================================================
// Generador de dictados: construye una historia (con personajes
// y escenario compartidos) formada por frases ligadas a una o
// varias reglas ortográficas elegidas por el usuario.
//
// Cada frase se escribe como una plantilla de texto con marcas
// [palabra|reglaId|explicación] para las palabras que ilustran
// la regla; parseFrase() las convierte en una lista de "tokens"
// (texto normal o palabra marcada) que la interfaz pinta de un
// color distinto por regla y explica al pulsar sobre ellas.
// ============================================================

const DICTADO_RULES = [
  { id: "h", label: "La h", color: "#4338ca" },
  { id: "gj", label: "G / J", color: "#0f766e" },
  { id: "bv", label: "B / V", color: "#b45309" },
  { id: "yll", label: "Y / LL", color: "#7e22ce" },
  { id: "cz", label: "C / Z", color: "#1d4ed8" },
  { id: "xs", label: "X / S", color: "#be123c" },
  { id: "td", label: "Tilde diacrítica", color: "#db2777" },
  { id: "mayus", label: "Mayúsculas", color: "#059669" },
  { id: "agudas", label: "Palabras agudas", color: "#ea580c" },
  { id: "llanas", label: "Palabras llanas", color: "#65a30d" },
  { id: "esdrujulas", label: "Palabras esdrújulas", color: "#0891b2" },
  { id: "diptongo", label: "Diptongos", color: "#ca8a04" },
  { id: "hiato", label: "Hiatos", color: "#475569" },
];

const DICTADO_TITULOS = [
  "Un día en el pueblo de Robledo",
  "La aventura de Nora y Hugo",
  "Historias del pueblo de Robledo",
  "Un verano en Robledo",
];

const DICTADO_BANCO = {
  h: [
    "Cuando llegó el invierno, el agua del río se convirtió en [hielo|h|Se escribe con «h» porque empieza por «hie-», igual que «hierba» o «hiedra».].",
    "Nora recogió un [huevo|h|Se escribe con «h» porque empieza por «hue-», igual que «hueco» o «huerto».] de gallina para el desayuno.",
    "Duque, el perro, se hizo daño y tuvieron que llevarlo al [hospital|h|Se escribe con «h» porque empieza por «hosp-».] del pueblo.",
    "El abuelo Tomás decía que el ser [humano|h|Se escribe con «h» porque empieza por «hum-».] siempre ha cuidado de los animales.",
    "—Yo [he|h|Se escribe con «h» porque es una forma del verbo «haber».] visto un búho en el bosque —dijo Hugo emocionado.",
    "Encontraron un [hormiguero|h|Se escribe con «h» al principio de la palabra, como «hormiga».] enorme junto al huerto.",
    "La abuela Elena mulló la [almohada|h|Lleva «h» en medio de la palabra: al-mo-h-ada.] antes de dormir.",
    "Aquella tarde, Hugo ya [había|h|Se escribe con «h» porque es una forma del verbo «haber».] terminado sus deberes.",
    "En la biblioteca del pueblo encontraron un libro de [historia|h|Se escribe con «h» porque empieza por «hist-».] muy antiguo.",
    "Un [búho|h|Lleva «h» en medio de la palabra, como «búho» o «prohibido».] los observaba desde la rama más alta del roble.",
  ],
  gj: [
    "En el mercado había mucha [gente|gj|Se escribe con «g» porque lleva las sílabas «ge/gi».] comprando fruta fresca.",
    "En clase de [geografía|gj|Se escribe con «g» porque lleva las sílabas «ge/gi».], Hugo aprendió los ríos de España.",
    "La abuela Elena fue a [recoger|gj|Los verbos terminados en «-ger» se escriben con «g», excepto «tejer» y «crujir».] leña para la chimenea.",
    "El guarda del bosque debía [proteger|gj|Los verbos terminados en «-ger» se escriben con «g».] a los animales salvajes.",
    "Nora tuvo que [elegir|gj|Los verbos terminados en «-gir» se escriben con «g», excepto «tejer» y «crujir».] entre dos cachorros para adoptar.",
    "El conejo dormía dentro de una [jaula|gj|Se escribe con «j» porque lleva la sílaba «ja».] de madera en el establo.",
    "Hugo llenó una [jarra|gj|Se escribe con «j» porque lleva la sílaba «ja».] con agua fresca del pozo.",
    "Después de un largo [viaje|gj|Las palabras terminadas en «-aje» se escriben con «j».] en carro, llegaron al pueblo de Robledo.",
    "El abuelo Tomás guardaba las herramientas en el [garaje|gj|Las palabras terminadas en «-aje» se escriben con «j».].",
    "La abuela Elena sabía [tejer|gj|«Tejer» se escribe con «j»: es una de las excepciones de los verbos en «-ger/-gir».] bufandas de lana muy calentitas.",
  ],
  bv: [
    "—¡Yo [también|bv|Se escribe con «b» porque siempre va «b» detrás de «m».] quiero venir! —gritó Nora.",
    "Antes de dormir, la abuela Elena siempre [cantaba|bv|Los verbos terminados en «-aba» (pretérito imperfecto) se escriben siempre con «b».] una canción antigua.",
    "Cada tarde, Hugo [jugaba|bv|Los verbos terminados en «-aba» se escriben siempre con «b».] con Duque en el jardín.",
    "El [burro|bv|Se escribe con «b» porque empieza por «bu-».] del abuelo Tomás llevaba la leña hasta la casa.",
    "Nora tuvo que [buscar|bv|Se escribe con «b» porque empieza por «bus-».] las llaves por todo el granero.",
    "A Hugo le encantaba hacer [burbujas|bv|Se escribe con «b» porque empieza por «bur-».] de jabón en el patio.",
    "Aquel [invierno|bv|Se escribe con «v» porque va después de «n», como en «convertir» o «enviar».] nevó más que nunca en el pueblo.",
    "La abuela Elena decidió [enviar|bv|Se escribe con «v» porque va después de «n».] una carta a sus nietos.",
    "El abuelo Tomás era un hombre muy [activo|bv|Los adjetivos terminados en «-ivo/-iva» se escriben con «v».] a pesar de su edad.",
    "Aquel día fue [decisivo|bv|Los adjetivos terminados en «-ivo/-iva» se escriben con «v».] para elegir el nombre del nuevo cachorro.",
  ],
  yll: [
    "Con una [ardilla|yll|Las palabras terminadas en «-illa» se escriben con «ll».] de peluche, Nora decoró su habitación.",
    "El abuelo Tomás afiló el [cuchillo|yll|Las palabras terminadas en «-illo» se escriben con «ll».] de cocina.",
    "Hugo abrió la [ventanilla|yll|Las palabras terminadas en «-illa» se escriben con «ll».] del tren para ver el paisaje.",
    "El [rey|yll|Las palabras que terminan en el sonido «y» se escriben con «y», como «rey» o «ley».] del cuento vivía en un castillo lejano.",
    "—¡[Hoy|yll|Se escribe con «y» al final de la palabra, como en «hoy» o «muy».] no hay clase! —gritó Nora contenta.",
    "Duque estaba [huyendo|yll|Los gerundios de verbos terminados en «-uir» se escriben con «y».] de la lluvia cuando llegó a casa.",
    "Los obreros estaban [construyendo|yll|Los gerundios de verbos terminados en «-uir» se escriben con «y».] un puente nuevo sobre el río.",
    "En el establo había una [silla|yll|Las palabras terminadas en «-illa» se escriben con «ll».] de montar muy vieja.",
    "El campesino seguía la [ley|yll|Las palabras que terminan en sonido «y» se escriben con «y».] de sembrar antes de la primavera.",
    "Era de noche y Hugo [oyó|yll|El verbo «oír» se escribe con «y» en algunas formas, como «oyó» u «oyeron».] un ruido extraño en el bosque.",
  ],
  cz: [
    "Aquella [luz|cz|Se escribe con «z» al final; en plural cambia a «c»: luces.] de la luna iluminaba el camino del bosque.",
    "Por la noche se veían las [luces|cz|Las palabras terminadas en «z» hacen el plural en «-ces»: luz → luces.] del pueblo desde la colina.",
    "El zorro del bosque era muy [veloz|cz|Los adjetivos terminados en «-oz» se escriben con «z».] al correr.",
    "Aquel perro pastor era [capaz|cz|Los adjetivos terminados en «-az» se escriben con «z».] de cuidar todo el rebaño él solo.",
    "En primavera [nacieron|cz|Los verbos terminados en «-cer» se escriben con «c».] tres cachorros en el establo.",
    "Con los cuidados de la abuela Elena, las plantas del huerto [crecieron|cz|Los verbos terminados en «-cer» se escriben con «c».] muy rápido.",
    "El abuelo Tomás sabía [conducir|cz|Los verbos terminados en «-cir» se escriben con «c».] el viejo tractor del pueblo.",
    "Hugo pescó un [pez|cz|Se escribe con «z» al final; en plural cambia a «c»: peces.] enorme en el río.",
    "Guardaron todos los [peces|cz|Las palabras terminadas en «z» hacen el plural en «-ces».] en un cubo con agua.",
    "Aquel [lápiz|cz|Se escribe con «z» al final; en plural cambia a «c»: lápices.] de colores era el favorito de Nora.",
  ],
  xs: [
    "La maestra empezó a [explicar|xs|Se escribe con «x» porque empieza por «ex-» seguido de «pl».] la lección de historia.",
    "Hugo quiso [expresar|xs|Se escribe con «x» porque empieza por «ex-» seguido de «pr».] lo mucho que quería a su perro.",
    "Fue un día [extraordinario|xs|Se escribe con «x» porque lleva el prefijo «extra-».] cuando encontraron un tesoro escondido.",
    "Nora soñaba con ver algún día a un [extraterrestre|xs|Se escribe con «x» porque lleva el prefijo «extra-».] de verdad.",
    "En clase de ciencias hicieron un [experimento|xs|Se escribe con «x» porque empieza por «ex-» seguido de «pr».] con agua y sal.",
    "La abuela Elena quiso [exprimir|xs|Se escribe con «x» porque empieza por «ex-» seguido de «pr».] varias naranjas del huerto.",
    "Duque se miró en el [espejo|xs|Se escribe con «s»: es la opción general cuando no hay un prefijo con «x».] del pasillo y ladró asustado.",
    "Aquella noche el cielo se llenó de [estrellas|xs|Se escribe con «s»: es la opción general cuando no hay un prefijo con «x».].",
    "El pastel de la abuela Elena estaba [riquísimo|xs|Los adjetivos terminados en «-ísimo/-ísima» se escriben con «s».].",
    "Nora se puso [contentísima|xs|Los adjetivos terminados en «-ísimo/-ísima» se escriben con «s».] al ver nacer a los cachorros.",
  ],
  td: [
    "—[Tú|td|Lleva tilde porque es un pronombre personal («tú vienes»), a diferencia de «tu» (determinante posesivo).] siempre cuidas muy bien de Duque —dijo la abuela Elena a Hugo.",
    "Nora guardó el regalo para [mí|td|Lleva tilde porque es un pronombre («para mí»), a diferencia de «mi» (determinante posesivo).], no para su hermano.",
    "—¿Vienes a la excursión? —Claro que [sí|td|Lleva tilde porque significa afirmación, a diferencia de «si» (condicional).], ¡me encanta el bosque!",
    "El abuelo Tomás preparó un [té|td|Lleva tilde porque es la bebida, a diferencia de «te» (pronombre).] caliente para merendar.",
    "Hugo quería [más|td|Lleva tilde porque indica cantidad, a diferencia de «mas» (que equivale a «pero»).] tiempo para jugar en el río.",
    "La maestra pidió que Nora [dé|td|Lleva tilde porque es una forma del verbo «dar», a diferencia de «de» (preposición).] su opinión sobre el cuento.",
    "—Yo [sé|td|Lleva tilde porque es una forma del verbo «saber», a diferencia de «se» (pronombre).] dónde se esconde el gato del granero —presumió Hugo.",
    "Nora no sabía [qué|td|Lleva tilde porque introduce una pregunta (aunque sea indirecta), a diferencia de «que» (conjunción).] regalarle a su abuela.",
    "—¿[Dónde|td|Lleva tilde porque introduce una pregunta, a diferencia de «donde» (relativo).] habéis escondido el balón? —preguntó el abuelo Tomás.",
    "Nadie sabía [cómo|td|Lleva tilde porque introduce una pregunta indirecta, a diferencia de «como» (comparación o conjunción).] había llegado el gato hasta el tejado.",
  ],
  mayus: [
    "[Nora|mayus|Se escribe con mayúscula inicial porque es un nombre propio de persona.] y Hugo pasaban las tardes jugando junto al río.",
    "El pueblo donde vivían se llamaba [Robledo|mayus|Se escribe con mayúscula inicial porque es el nombre propio de un lugar.].",
    "Su perro se llamaba [Duque|mayus|Se escribe con mayúscula inicial porque es el nombre propio de una mascota.] y los seguía a todas partes.",
    "La abuela se llamaba [Elena|mayus|Se escribe con mayúscula inicial porque es un nombre propio de persona.] y contaba historias maravillosas.",
    "Cada Navidad, el tío Marcos viajaba desde [Madrid|mayus|Se escribe con mayúscula inicial porque es el nombre propio de una ciudad.] para visitar a la familia.",
    "—¡Duque, ven aquí! —gritó Hugo. [El|mayus|Después de un punto, la primera palabra de la frase se escribe con mayúscula.] perro llegó corriendo enseguida.",
    "El maestro de la escuela de [Robledo|mayus|Se escribe con mayúscula inicial porque es el nombre propio de un lugar.] premió a Nora por su cuento.",
    "Aquel verano, el circo llegó por sorpresa. [Todos|mayus|Después de un punto, la primera palabra de la frase se escribe con mayúscula.] los niños del pueblo corrieron a verlo.",
    "El río más grande de [Europa|mayus|Se escribe con mayúscula inicial porque es el nombre propio de un continente.] pasaba muy lejos de allí, pero Hugo soñaba con conocerlo.",
    "El abuelo [Tomás|mayus|Se escribe con mayúscula inicial porque es un nombre propio de persona.] guardaba las herramientas en el garaje.",
  ],
  agudas: [
    "Para ir al colegio, Nora y Hugo cogían el [autobús|agudas|Es una palabra aguda (la fuerza cae en la última sílaba) y termina en «s»; por eso lleva tilde.] del pueblo.",
    "El abuelo Tomás guardaba las herramientas junto al [jardín|agudas|Es una palabra aguda y termina en «n»; por eso lleva tilde.] de la casa.",
    "Duque dormía enroscado como un [ratón|agudas|Es una palabra aguda y termina en «n»; por eso lleva tilde.] asustado bajo la mesa.",
    "La abuela Elena preparó un [café|agudas|Es una palabra aguda y termina en vocal; por eso lleva tilde.] bien caliente para el abuelo.",
    "Hugo se comió un bocadillo de [jamón|agudas|Es una palabra aguda y termina en «n»; por eso lleva tilde.] antes de salir a jugar.",
    "En el granero encontraron un [colchón|agudas|Es una palabra aguda y termina en «n»; por eso lleva tilde.] viejo lleno de polvo.",
    "Nora cantó una [canción|agudas|Es una palabra aguda y termina en «n»; por eso lleva tilde.] que le había enseñado su abuela.",
    "Cuando vio nacer a los cachorros, a Hugo le dio un vuelco el [corazón|agudas|Es una palabra aguda y termina en «n»; por eso lleva tilde.].",
    "Se subieron al [camión|agudas|Es una palabra aguda y termina en «n»; por eso lleva tilde.] del abuelo para llevar la leña al pueblo.",
    "El maestro marcaba el ritmo de la música con el [compás|agudas|Es una palabra aguda y termina en «s»; por eso lleva tilde.].",
  ],
  llanas: [
    "Subieron al [árbol|llanas|Es una palabra llana y no termina en vocal, «n» ni «s»; por eso lleva tilde.] más alto del bosque para ver el pueblo.",
    "Nora dibujaba siempre con el mismo [lápiz|llanas|Es una palabra llana y no termina en vocal, «n» ni «s»; por eso lleva tilde.] de colores.",
    "La abuela Elena guardaba el [azúcar|llanas|Es una palabra llana y no termina en vocal, «n» ni «s»; por eso lleva tilde.] en un bote de cristal.",
    "A Hugo le encantaba jugar al [fútbol|llanas|Es una palabra llana y no termina en vocal, «n» ni «s»; por eso lleva tilde.] con sus amigos del pueblo.",
    "Después de curarlo, el cachorro se quedó muy [débil|llanas|Es una palabra llana y no termina en vocal, «n» ni «s»; por eso lleva tilde.] durante unos días.",
    "El examen de matemáticas fue muy [difícil|llanas|Es una palabra llana y no termina en vocal, «n» ni «s»; por eso lleva tilde.] esa semana.",
    "Duque corría feliz por el [césped|llanas|Es una palabra llana y no termina en vocal, «n» ni «s»; por eso lleva tilde.] del jardín.",
    "La chimenea de la casa era de [mármol|llanas|Es una palabra llana y no termina en vocal, «n» ni «s»; por eso lleva tilde.] blanco.",
    "Para llegar al pueblo vecino había que cruzar un [túnel|llanas|Es una palabra llana y no termina en vocal, «n» ni «s»; por eso lleva tilde.] muy oscuro.",
    "El abuelo Tomás guardaba fotos antiguas en un [álbum|llanas|Es una palabra llana y no termina en vocal, «n» ni «s»; por eso lleva tilde.] de cuero.",
  ],
  esdrujulas: [
    "En el [teléfono|esdrujulas|Es una palabra esdrújula (la fuerza cae en la antepenúltima sílaba); todas las esdrújulas llevan tilde.] del abuelo Tomás no había cobertura en el pueblo.",
    "A la abuela Elena le encantaba la [música|esdrujulas|Es una palabra esdrújula; todas las esdrújulas llevan tilde.] antigua.",
    "Cada [sábado|esdrujulas|Es una palabra esdrújula; todas las esdrújulas llevan tilde.], Nora y Hugo iban al mercado con su abuela.",
    "Un [pájaro|esdrujulas|Es una palabra esdrújula; todas las esdrújulas llevan tilde.] se posó en la ventana de la cocina.",
    "Hugo perdió la cuenta del [número|esdrujulas|Es una palabra esdrújula; todas las esdrújulas llevan tilde.] de cachorros que habían nacido.",
    "El abuelo Tomás guardaba una vieja [cámara|esdrujulas|Es una palabra esdrújula; todas las esdrújulas llevan tilde.] de fotos en el desván.",
    "Para no perderse en el bosque, Hugo llevaba siempre una [brújula|esdrujulas|Es una palabra esdrújula; todas las esdrújulas llevan tilde.].",
    "Duque corría muy [rápido|esdrujulas|Es una palabra esdrújula; todas las esdrújulas llevan tilde.] cuando veía a Nora llegar.",
    "El sótano de la casa era un lugar muy [húmedo|esdrujulas|Es una palabra esdrújula; todas las esdrújulas llevan tilde.] y oscuro.",
    "Nora escribió en la [página|esdrujulas|Es una palabra esdrújula; todas las esdrújulas llevan tilde.] de su cuaderno la historia de aquel verano.",
  ],
  diptongo: [
    "Bebieron [agua|diptongo|Tiene un diptongo: se juntan una vocal débil («u») y una fuerte átona («a») en la misma sílaba.] fresca del pozo del abuelo Tomás.",
    "No tenían mucho [tiempo|diptongo|Tiene un diptongo: se juntan una vocal débil («i») y una fuerte átona («e») en la misma sílaba.] antes de que anocheciera.",
    "El [cielo|diptongo|Tiene un diptongo: se juntan una vocal débil («i») y una fuerte átona («e») en la misma sílaba.] se llenó de estrellas aquella noche.",
    "La abuela Elena encendió el [fuego|diptongo|Tiene un diptongo: se juntan una vocal débil («u») y una fuerte átona («e») en la misma sílaba.] de la chimenea.",
    "Aquel [viejo|diptongo|Tiene un diptongo: se juntan una vocal fuerte átona («e») y una débil («i») en la misma sílaba.] granero guardaba muchos secretos del pueblo.",
    "Nora escribía todas sus historias en un [cuaderno|diptongo|Tiene un diptongo: se juntan dos vocales («u», «a») en la misma sílaba.] de tapas azules.",
    "Después de la tormenta, el [aire|diptongo|Tiene un diptongo: se juntan una vocal fuerte átona («a») y una débil («i») en la misma sílaba.] olía a tierra mojada.",
    "El abuelo Tomás decía que aquel había sido un [buen|diptongo|Tiene un diptongo: se juntan una vocal débil («u») y una fuerte («e») en la misma sílaba, como en «fuego».] verano de cosecha.",
    "Contaron hasta [siete|diptongo|Tiene un diptongo: se juntan una vocal débil («i») y una fuerte átona («e») en la misma sílaba.] cachorros escondidos bajo la paja.",
    "Todos viajaron juntos hacia la [ciudad|diptongo|Tiene un diptongo: se juntan dos vocales débiles distintas («i», «u») en la misma sílaba.] más cercana a Robledo.",
  ],
  hiato: [
    "En la escuela de Robledo representaron una obra de [teatro|hiato|Tiene un hiato: se juntan dos vocales fuertes («e», «a») que se separan en sílabas distintas.] sobre un pueblo mágico.",
    "El abuelo Tomás contaba historias como un verdadero [poeta|hiato|Tiene un hiato: se juntan dos vocales fuertes («o», «e») que se separan en sílabas distintas.].",
    "Cuando se cayó el jarrón, en la cocina se armó un pequeño [caos|hiato|Tiene un hiato: se juntan dos vocales fuertes («a», «o») que se separan en sílabas distintas.].",
    "Visitaron el [museo|hiato|Tiene un hiato: se juntan dos vocales fuertes («e», «o») que se separan en sílabas distintas.] del pueblo vecino un domingo.",
    "Hugo se hizo una herida cerca de la [raíz|hiato|Es un hiato acentual: la «i» es una vocal débil tónica junto a una fuerte, y siempre lleva tilde.] de un árbol caído.",
    "Aquel [día|hiato|Es un hiato acentual: la «i» es una vocal débil tónica junto a una fuerte, y siempre lleva tilde.], Nora encontró un nido de pájaros en el huerto.",
    "El abuelo Tomás había nacido en otro [país|hiato|Es un hiato acentual: la «i» es una vocal débil tónica junto a una fuerte, y siempre lleva tilde.] muy lejano.",
    "De mayor, Nora quería ser [policía|hiato|Es un hiato acentual: la «i» es una vocal débil tónica junto a una fuerte, y siempre lleva tilde.] para cuidar del pueblo.",
    "Cuando nacieron los cachorros, todos sintieron mucha [alegría|hiato|Es un hiato acentual: la «i» es una vocal débil tónica junto a una fuerte, y siempre lleva tilde.].",
    "Guardaban las herramientas del huerto en un viejo [baúl|hiato|Es un hiato acentual: la «u» es una vocal débil tónica junto a una fuerte, y siempre lleva tilde.] de madera.",
  ],
};

function parseFrase(template, ruleId) {
  const tokens = [];
  const re = /\[([^|]+)\|([^|]+)\|([^\]]+)\]/g;
  let lastIndex = 0;
  let m;
  while ((m = re.exec(template))) {
    if (m.index > lastIndex) tokens.push({ text: template.slice(lastIndex, m.index) });
    tokens.push({ text: m[1], ruleId: m[2], reason: m[3] });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < template.length) tokens.push({ text: template.slice(lastIndex) });
  return { ruleId, tokens };
}

function dictadoShuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function dictadoPick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generarDictado(reglaIds, numFrases) {
  if (!reglaIds || !reglaIds.length) throw new Error("Selecciona al menos una regla ortográfica.");

  const pools = {};
  reglaIds.forEach((id) => {
    if (!DICTADO_BANCO[id]) throw new Error("Regla no reconocida: " + id);
    pools[id] = dictadoShuffle(DICTADO_BANCO[id]);
  });

  const disponibles = reglaIds.reduce((acc, id) => acc + pools[id].length, 0);
  const total = Math.min(numFrases, disponibles);

  const frases = [];
  let idx = 0;
  let vueltasVacias = 0;
  while (frases.length < total && vueltasVacias < reglaIds.length * 50) {
    const id = reglaIds[idx % reglaIds.length];
    if (pools[id].length > 0) {
      frases.push(parseFrase(pools[id].shift(), id));
      vueltasVacias = 0;
    } else {
      vueltasVacias++;
    }
    idx++;
  }

  const fraseasOrdenadas = dictadoShuffle(frases);

  return {
    titulo: dictadoPick(DICTADO_TITULOS),
    frases: fraseasOrdenadas,
    solicitadas: numFrases,
    generadas: fraseasOrdenadas.length,
  };
}

function dictadoTextoPlano(dictado) {
  return dictado.titulo + "\n\n" + dictado.frases.map((f) => f.tokens.map((t) => t.text).join("")).join(" ");
}
