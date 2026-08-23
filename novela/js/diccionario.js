// ============================================================
// Novela Colectiva — diccionario del corrector.
//
// A partir de las listas de lexico.js genera todas las formas que
// puede escribir un alumno de 5.º o 6.º: plurales, femeninos,
// adverbios en -mente y conjugaciones. Además guarda una tabla de
// "misma palabra sin tildes" que es la que permite decir
// "¿le falta la tilde?" en vez de un simple "no la conozco".
//
// AVISO: ningún diccionario es completo. Una palabra que no esté
// aquí NO es una falta: el corrector la marca como duda y el
// docente puede darla por buena para todo el proyecto. Los nombres
// de personajes, lugares y palabras inventadas entran solos en
// cuanto se rellena su ficha.
// ============================================================

import { SUSTANTIVOS, ADJETIVOS, VERBOS, INVARIABLES, PROPIOS } from "./lexico.js";

// ---------- utilidades de letras ----------

const TILDES = { á: "a", é: "e", í: "i", ó: "o", ú: "u", ü: "u" };

export function sinTildes(palabra) {
  return String(palabra || "").toLowerCase().replace(/[áéíóúü]/g, (c) => TILDES[c]);
}

export function normaliza(palabra) {
  return String(palabra || "")
    .toLowerCase()
    .replace(/[^a-záéíóúüñ]/g, "");
}

// Quita la tilde de la última vocal acentuada (canción → cancion-)
function quitaTildeFinal(raiz) {
  return raiz.replace(/([áéíóú])([^áéíóú]*)$/, (m, v, resto) => TILDES[v] + resto);
}

// ---------- generación de formas ----------

function plural(p) {
  const formas = [];
  if (/[aeiou]$/.test(p)) formas.push(p + "s");
  else if (/[áéó]$/.test(p)) formas.push(p + "s");
  else if (/[íú]$/.test(p)) { formas.push(p + "s"); formas.push(p + "es"); }
  else if (/z$/.test(p)) formas.push(p.slice(0, -1) + "ces");
  else if (/[sx]$/.test(p)) formas.push(p); // lunes, crisis, tórax: igual
  else if (/[áéíóú][ns]$/.test(p)) formas.push(quitaTildeFinal(p) + "es"); // canción → canciones
  else if (/en$/.test(p) && !/[áéíóú]/.test(p)) formas.push(acentuaAntepenultima(p) + "es"); // joven → jóvenes
  else formas.push(p + "es");                                             // árbol → árboles
  return formas;
}

// joven → jóven-, examen → exámen-: al pasar a plural la palabra se
// vuelve esdrújula y hay que ponerle la tilde que antes no llevaba.
function acentuaAntepenultima(p) {
  const ACENTOS = { a: "á", e: "é", i: "í", o: "ó", u: "ú" };
  return p.replace(/^(.*)([aeiou])([^aeiou]*en)$/, (m, ini, v, fin) => ini + ACENTOS[v] + fin);
}

function femenino(a) {
  if (/o$/.test(a)) return a.slice(0, -1) + "a";
  if (/or$/.test(a) && !/[eé]or$/.test(a)) return a + "a";       // trabajador → trabajadora
  if (/[áéíóú]n$/.test(a)) return quitaTildeFinal(a) + "a";      // dormilón → dormilona
  if (/és$/.test(a)) return a.slice(0, -2) + "esa";              // francés → francesa
  return null;
}

// Verbos con cambio en la raíz al llevar el acento (pienso, cuento,
// pido). Se generan las dos variantes: sobra alguna forma rara, pero
// así no se marca como duda algo que está perfectamente escrito.
const DIPTONGO_IE = new Set(["pensar", "empezar", "comenzar", "cerrar", "despertar", "sentar",
  "calentar", "temblar", "nevar", "atravesar", "perder", "entender", "encender", "querer",
  "defender", "sentir", "mentir", "preferir", "herir", "divertir", "convertir", "advertir",
  "acertar", "confesar", "tropezar", "apretar", "helar", "gobernar", "encerrar"]);
const DIPTONGO_UE = new Set(["contar", "encontrar", "recordar", "soñar", "volar", "probar",
  "mostrar", "costar", "acostar", "almorzar", "colgar", "rogar", "volver", "mover", "doler",
  "llover", "morder", "poder", "dormir", "morir", "resolver", "devolver", "envolver", "torcer",
  "cocer", "oler", "sonar", "tronar", "rodar", "forzar", "acordar", "demostrar"]);
const CAMBIO_I = new Set(["pedir", "servir", "seguir", "repetir", "vestir", "medir", "reír",
  "freír", "elegir", "corregir", "conseguir", "despedir", "impedir", "competir", "gemir"]);

function raizDiptongada(raiz, tipo) {
  // Cambia la última e/o de la raíz: pens- → piens-, cont- → cuent-,
  // ped- → pid-, durm- (dormir en gerundio y pretérito).
  const m = raiz.match(/^(.*)([eo])([^eo]*)$/);
  if (!m) return null;
  const esperada = tipo === "ue" || tipo === "u" ? "o" : "e";
  if (m[2] !== esperada) return null;
  const nueva = { ie: "ie", ue: "ue", i: "i", i2: "i", u: "u" }[tipo];
  return m[1] + nueva + m[3];
}

// Cambios ortográficos obligatorios al conjugar: buscar → busqué,
// llegar → llegué, empezar → empecé, coger → cojo, conocer → conozco.
// Son justo las faltas que más se cometen a esta edad, así que aquí no
// vale con "generar de más": hay que generar la forma correcta y solo
// la correcta.
function raizAnte(raiz, vocal) {
  if (vocal === "e") {
    if (/gu$/.test(raiz)) return raiz.slice(0, -2) + "gü";
    if (/c$/.test(raiz)) return raiz.slice(0, -1) + "qu";
    if (/g$/.test(raiz)) return raiz + "u";
    if (/z$/.test(raiz)) return raiz.slice(0, -1) + "c";
    return raiz;
  }
  // vocal a/o (verbos en -er/-ir)
  if (/gu$/.test(raiz)) return raiz.slice(0, -1);          // seguir → sig-
  if (/g$/.test(raiz)) return raiz.slice(0, -1) + "j";     // coger → coj-
  if (/[aeiou]c$/.test(raiz)) return raiz + "z";           // conocer → conozc-
  if (/c$/.test(raiz)) return raiz.slice(0, -1) + "z";     // vencer → venz-
  return raiz;
}

function formasVerbo(inf) {
  const formas = [inf];
  const raiz = inf.slice(0, -2);
  const term = inf.slice(-2);
  if (!["ar", "er", "ir"].includes(term)) return formas;

  // raíz con diptongo para las formas en que recae el acento
  let tipo = null;
  if (DIPTONGO_IE.has(inf)) tipo = "ie";
  else if (DIPTONGO_UE.has(inf)) tipo = "ue";
  else if (CAMBIO_I.has(inf)) tipo = "i";
  const fuerte = tipo ? (raizDiptongada(raiz, tipo) || raiz) : raiz;

  const con = (base, sufijos) => { for (const s of sufijos) formas.push(base + s); };

  if (term === "ar") {
    // presente: las tres personas del singular y la tercera del plural
    // llevan el acento en la raíz (cuento, cuentas, cuenta, cuentan)
    con(fuerte, ["o", "as", "a", "an"]);
    con(raiz, ["amos", "áis"]);
    con(fuerte, ["a"]);                                        // imperativo tú
    con(raiz, ["ad"]);                                         // imperativo vosotros
    con(raizAnte(raiz, "e"), ["é"]);                           // pretérito yo: empecé
    con(raiz, ["aste", "ó", "amos", "asteis", "aron"]);
    con(raiz, ["aba", "abas", "ábamos", "abais", "aban"]);
    con(raizAnte(fuerte, "e"), ["e", "es", "en"]);             // subjuntivo fuerte
    con(raizAnte(raiz, "e"), ["emos", "éis"]);
    con(raiz, ["ara", "aras", "áramos", "arais", "aran"]);
    con(raiz, ["ase", "ases", "ásemos", "aseis", "asen"]);
    con(raiz, ["ando", "ado", "ada", "ados", "adas"]);
  } else {
    con(raizAnte(fuerte, "o"), ["o"]);                         // yo: cojo, conozco, pienso
    con(fuerte, ["es", "e", "en"]);
    con(raiz, term === "er" ? ["emos", "éis"] : ["imos", "ís"]);
    con(fuerte, ["e"]);                                        // imperativo tú
    con(raiz, [term === "er" ? "ed" : "id"]);
    con(raiz, ["í", "iste", "ió", "imos", "isteis", "ieron"]);
    con(raiz, ["ía", "ías", "íamos", "íais", "ían"]);
    con(raizAnte(fuerte, "a"), ["a", "as", "an"]);             // subjuntivo
    con(raizAnte(raiz, "a"), ["amos", "áis"]);
    con(raiz, ["iera", "ieras", "iéramos", "ierais", "ieran"]);
    con(raiz, ["iese", "ieses", "iésemos", "ieseis", "iesen"]);
    con(raiz, ["iendo", "ido", "ida", "idos", "idas"]);

    // los verbos en -ir con cambio de raíz lo mantienen en la tercera
    // persona del pretérito y en el gerundio: pidió, durmiendo, sintió
    if (term === "ir" && tipo) {
      const debil = raizDiptongada(raiz, tipo === "ue" ? "u" : "i2");
      if (debil) con(debil, ["ió", "ieron", "iendo", "iera", "ieran", "iese", "iesen"]);
    }
  }
  // futuro y condicional se forman sobre el infinitivo entero
  for (const s of ["é", "ás", "á", "emos", "éis", "án"]) formas.push(inf + s);
  for (const s of ["ía", "ías", "íamos", "íais", "ían"]) formas.push(inf + s);
  return formas;
}

// Formas de los verbos más irregulares (y más usados): se escriben a
// mano porque ninguna regla las genera bien.
const IRREGULARES = `
ser estar haber ir tener hacer decir poder poner querer saber venir ver dar
salir traer caer oír conocer huir construir destruir seguir reír freír volver
romper cubrir abrir escribir morir dormir jugar empezar comenzar oler valer
caber resolver devolver envolver torcer cocer sonar tronar rodar forzar
acordar demostrar mantener obtener detener entretener suponer componer
proponer deshacer prever satisfacer bendecir maldecir contradecir
soy eres es somos sois son era eras éramos erais eran fui fuiste fue fuimos
fuisteis fueron seré serás será seremos seréis serán sería serías seríamos
seríais serían sea seas seamos seáis sean fuera fueras fuéramos fuerais fueran
fuese fueses fuésemos fueseis fuesen siendo sido sé sed
estoy estás está estamos estáis están estaba estabas estábamos estabais estaban
estuve estuviste estuvo estuvimos estuvisteis estuvieron estaré estarás estará
estaremos estaréis estarán estaría estarías estaríamos estaríais estarían esté
estés estemos estéis estén estuviera estuvieras estuviéramos estuvieran
estuviese estuviesen estando estado
he has ha hemos habéis han había habías habíamos habíais habían hube hubo
hubimos hubieron habrá habrán habría habrían haya hayas hayamos hayáis hayan
hubiera hubieras hubiéramos hubieran hubiese hubiesen habiendo habido hay
voy vas va vamos vais van iba ibas íbamos ibais iban fui fue fuimos fueron iré
irás irá iremos iréis irán iría irías iríamos irían vaya vayas vayamos vayáis
vayan yendo ido ve id
tengo tienes tiene tenemos tenéis tienen tenía tenías teníamos teníais tenían
tuve tuviste tuvo tuvimos tuvisteis tuvieron tendré tendrás tendrá tendremos
tendréis tendrán tendría tendrías tendríamos tendrían tenga tengas tengamos
tengáis tengan tuviera tuvieras tuviéramos tuvieran tuviese tuviesen teniendo
tenido ten tened
hago haces hace hacemos hacéis hacen hacía hacías hacíamos hacían hice hiciste
hizo hicimos hicisteis hicieron haré harás hará haremos haréis harán haría
harías haríamos harían haga hagas hagamos hagáis hagan hiciera hicieras
hiciéramos hicieran hiciese hiciesen haciendo hecho hecha hechos hechas haz haced
digo dices dice decimos decís dicen decía decías decíamos decían dije dijiste
dijo dijimos dijisteis dijeron diré dirás dirá diremos diréis dirán diría
dirías diríamos dirían diga digas digamos digáis digan dijera dijeras dijéramos
dijeran dijese dijesen diciendo dicho dicha dichos dichas di decid
puedo puedes puede podemos podéis pueden podía podías podíamos podían pude
pudiste pudo pudimos pudisteis pudieron podré podrás podrá podremos podrán
podría podrías podríamos podríais podrían pueda puedas podamos podáis puedan
pudiera pudieras pudiéramos pudieran pudiese pudiesen pudiendo podido
pongo pones pone ponemos ponéis ponen ponía ponías poníamos ponían puse pusiste
puso pusimos pusisteis pusieron pondré pondrás pondrá pondremos pondrán pondría
pondrías pondríamos pondrían ponga pongas pongamos pongáis pongan pusiera
pusieras pusiéramos pusieran pusiese pusiesen poniendo puesto puesta puestos
puestas pon poned
quiero quieres quiere queremos queréis quieren quería querías queríamos querían
quise quisiste quiso quisimos quisisteis quisieron querré querrá querremos
querrán querría querrían quiera quieras queramos queráis quieran quisiera
quisieras quisiéramos quisieran quisiese quisiesen queriendo querido
sé sabes sabe sabemos sabéis saben sabía sabías sabíamos sabían supe supiste
supo supimos supisteis supieron sabré sabrás sabrá sabremos sabrán sabría
sabrías sabríamos sabrían sepa sepas sepamos sepáis sepan supiera supieras
supiéramos supieran supiese supiesen sabiendo sabido
vengo vienes viene venimos venís vienen venía venías veníamos venían vine
viniste vino vinimos vinisteis vinieron vendré vendrás vendrá vendremos vendrán
vendría vendrías vendríamos vendrían venga vengas vengamos vengáis vengan
viniera vinieras viniéramos vinieran viniese viniesen viniendo venido ven venid
veo ves ve vemos veis ven veía veías veíamos veíais veían vi viste vio vimos
visteis vieron veré verás verá veremos verán vería verías veríamos verían vea
veas veamos veáis vean viera vieras viéramos vieran viese viesen viendo visto
vista vistos vistas
doy das da damos dais dan daba dabas dábamos daban di diste dio dimos disteis
dieron daré darás dará daremos darán daría darías daríamos darían dé des demos
deis den diera dieras diéramos dieran diese diesen dando dado dad
salgo sales sale salimos salís salen salía salías salíamos salían salí saliste
salió salimos salieron saldré saldrás saldrá saldremos saldrán saldría saldrían
salga salgas salgamos salgáis salgan saliera salieran saliese saliendo salido sal salid
traigo traes trae traemos traéis traen traía traías traíamos traían traje
trajiste trajo trajimos trajisteis trajeron traeré traerá traerán traería
traería traiga traigas traigamos traigan trajera trajeras trajéramos trajeran
trayendo traído traída traídos traídas
caigo caes cae caemos caéis caen caía caías caíamos caían caí caíste cayó
caímos caísteis cayeron caeré caerá caerán caería caerían caiga caigas caigamos
caigan cayera cayeras cayéramos cayeran cayendo caído caída caídos caídas
oigo oyes oye oímos oís oyen oía oías oíamos oían oí oíste oyó oímos oyeron
oiré oirá oirán oiría oirían oiga oigas oigamos oigan oyera oyeras oyeran
oyendo oído oída oídos oídas oye oíd
conozco conoces conoce conocemos conocéis conocen conocía conocían conocí
conociste conoció conocimos conocieron conoceré conocerá conocerán conocería
conozca conozcas conozcamos conozcan conociera conocieran conociendo conocido
huyo huyes huye huimos huís huyen huía huían hui huiste huyó huimos huyeron
huiré huirá huirán huiría huya huyas huyamos huyan huyera huyeran huyendo huido
leo lees lee leemos leéis leen leía leías leíamos leían leí leíste leyó leímos
leísteis leyeron leeré leerá leerán leería leyera leyeras leyeran leyendo leído
leída leídos leídas
construyo construyes construye construimos construyen construyó construyeron
construyendo construido destruyo destruyes destruye destruyen destruyó
destruyeron destruyendo destruido
duermo duermes duerme dormimos dormís duermen durmió durmieron durmiendo
dormido muero mueres muere morimos mueren murió murieron muriendo muerto
muerta muertos muertas
juego juegas juega jugamos jugáis juegan jugué jugó jugaron jugando jugado
empiezo empiezas empieza empezamos empiezan empecé empezó empezaron empezando
empezado comienzo comienzas comienza comienzan comencé comenzó comenzaron
sigo sigues sigue seguimos seguís siguen seguí seguiste siguió seguimos
siguieron seguiré seguirá seguirán seguiría siga sigas sigamos sigan siguiera
siguieran siguiendo seguido
río ríes ríe reímos reís ríen reí reíste rió reímos rieron riendo reído
escribo escribes escribe escribimos escriben escribí escribió escribieron
escribiendo escrito escrita escritos escritas
abro abres abre abrimos abren abrí abrió abrieron abriendo abierto abierta
abiertos abiertas cubro cubres cubre cubren cubrió cubierto cubierta
vuelvo vuelves vuelve volvemos vuelven volví volvió volvieron volviendo vuelto
vuelta vueltos vueltas rompo rompes rompe rompen rompió roto rota rotos rotas
`.trim().split(/\s+/);

// ---------- construcción de la tabla ----------

const FORMAS = new Set();          // formas exactas, con tildes
const POR_SIN_TILDE = new Map();   // "cancion" → ["canción"]
const PROPIOS_SET = new Set();

function anadir(forma) {
  if (!forma) return;
  const f = String(forma).toLowerCase();
  if (f.length < 1) return;
  if (FORMAS.has(f)) return;
  FORMAS.add(f);
  const clave = sinTildes(f);
  if (!POR_SIN_TILDE.has(clave)) POR_SIN_TILDE.set(clave, []);
  POR_SIN_TILDE.get(clave).push(f);
}

for (const s of SUSTANTIVOS) {
  anadir(s);
  for (const p of plural(s)) anadir(p);
  // oficios y papeles: profesor → profesora, escritor → escritora
  if (/[dts]or$/.test(s)) { anadir(s + "a"); anadir(s + "as"); }
}
for (const a of ADJETIVOS) {
  anadir(a);
  for (const p of plural(a)) anadir(p);
  const fem = femenino(a);
  if (fem) { anadir(fem); for (const p of plural(fem)) anadir(p); anadir(fem + "mente"); }
  else if (/[eaiouz]$/.test(a) || /[lrsnd]$/.test(a)) anadir(a + "mente");
}
for (const v of VERBOS) for (const f of formasVerbo(v)) anadir(f);
for (const i of INVARIABLES) anadir(i);
for (const f of IRREGULARES) anadir(f);

// Palabras muy frecuentes (nexos, pronombres, verbos irregulares): al
// sugerir se ponen delante, porque casi siempre son las que el alumno
// quería escribir ("asta" → "hasta" antes que "asa").
const FRECUENTES = new Set(
  INVARIABLES.map((w) => w.toLowerCase()).concat(IRREGULARES.map((w) => w.toLowerCase()))
);
for (const p of PROPIOS) { PROPIOS_SET.add(p.toLowerCase()); anadir(p.toLowerCase()); }

// Palabras que el proyecto añade en marcha: nombres de personajes,
// lugares e inventos ya fichados, y las que el docente da por buenas.
const DEL_PROYECTO = new Set();

export function anadirPalabrasDelProyecto(lista) {
  for (const p of lista || []) {
    const limpia = String(p || "").toLowerCase().trim();
    if (limpia) {
      DEL_PROYECTO.add(limpia);
      // también sus plurales, que aparecerán al hablar de varios
      for (const pl of plural(limpia)) DEL_PROYECTO.add(pl);
    }
  }
}

export function palabrasDelProyecto() {
  return Array.from(DEL_PROYECTO);
}

// ---------- consultas ----------

export function existe(palabra) {
  const p = String(palabra || "").toLowerCase();
  return FORMAS.has(p) || DEL_PROYECTO.has(p);
}

export function esPropioConocido(palabra) {
  return PROPIOS_SET.has(String(palabra || "").toLowerCase());
}

// Palabras que se escriben igual salvo las tildes ("cancion" → "canción").
export function mismasSinTilde(palabra) {
  const lista = POR_SIN_TILDE.get(sinTildes(palabra)) || [];
  return lista.filter((f) => f !== String(palabra).toLowerCase());
}

// ---------- sugerencias por parecido ----------

function distancia(a, b, tope) {
  if (Math.abs(a.length - b.length) > tope) return tope + 1;
  const previo = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) previo[j] = j;
  for (let i = 1; i <= a.length; i++) {
    let anterior = previo[0];
    previo[0] = i;
    let mejorFila = previo[0];
    for (let j = 1; j <= b.length; j++) {
      const temp = previo[j];
      previo[j] = Math.min(
        previo[j] + 1,
        previo[j - 1] + 1,
        anterior + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      anterior = temp;
      if (previo[j] < mejorFila) mejorFila = previo[j];
    }
    if (mejorFila > tope) return tope + 1;
  }
  return previo[b.length];
}

// Índice por primera letra y longitud de la forma SIN TILDES, para
// no recorrer 40.000 formas por cada palabra dudosa (los Chromebooks
// del aula no van sobrados de potencia) y para que una tilde de más
// o de menos no impida encontrar el parecido.
const INDICE = new Map();
for (const f of FORMAS) {
  const desnuda = sinTildes(f);
  const clave = desnuda[0] + ":" + desnuda.length;
  if (!INDICE.has(clave)) INDICE.set(clave, []);
  INDICE.get(clave).push([desnuda, f]);
}

export function sugerencias(palabra, maximo) {
  const p = String(palabra || "").toLowerCase();
  const tope = maximo || 4;
  if (!p) return [];

  // 1) la misma palabra con las tildes bien puestas: es el caso más
  //    frecuente con diferencia a esta edad
  const porTilde = mismasSinTilde(p);
  if (porTilde.length) return porTilde.slice(0, tope);

  // 2) parecidas (una o dos letras de diferencia), comparando sin
  //    tildes para que "abia" encuentre "había"
  const desnuda = sinTildes(p);
  const margen = desnuda.length <= 4 ? 1 : 2;
  const candidatas = [];
  const primeras = new Set([desnuda[0], "h"]);
  const pares = { b: "v", v: "b", g: "j", j: "g", s: "c", c: "s", z: "s", y: "l", l: "y", q: "c" };
  if (pares[desnuda[0]]) primeras.add(pares[desnuda[0]]);
  if (desnuda[0] === "h" && desnuda[1]) primeras.add(desnuda[1]);
  if (desnuda[0] === "z" || desnuda[0] === "c") { primeras.add("c"); primeras.add("z"); primeras.add("s"); }

  for (const letra of primeras) {
    if (!letra) continue;
    for (let l = desnuda.length - margen; l <= desnuda.length + margen; l++) {
      const lista = INDICE.get(letra + ":" + l);
      if (!lista) continue;
      for (const [sinT, display] of lista) {
        const d = distancia(desnuda, sinT, margen);
        if (d <= margen) candidatas.push([display, d, FRECUENTES.has(display) ? 0 : 1]);
      }
    }
  }
  candidatas.sort((a, b) => a[1] - b[1] || a[2] - b[2] || a[0].localeCompare(b[0], "es"));
  const vistas = new Set();
  const salida = [];
  for (const [f] of candidatas) {
    if (vistas.has(f) || f === p) continue;
    vistas.add(f);
    salida.push(f);
    if (salida.length >= tope) break;
  }
  return salida;
}

export function tamano() {
  return FORMAS.size;
}

export function enlaceRae(palabra) {
  return "https://dle.rae.es/" + encodeURIComponent(String(palabra || "").toLowerCase());
}
