// ============================================================
// Generador de fichas de problemas de matemáticas: dado un tema,
// un curso (5º/6º) y una cantidad de problemas, genera aleatoriamente
// los enunciados y construye dos documentos Word (ficha en blanco +
// hoja de soluciones) usando el motor de js/docx-writer.js.
// ============================================================

// ---------------- Utilidades ----------------

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function roundMoney(n) {
  return Math.round(n * 100) / 100;
}

function fmtEs(n, decimals = 2) {
  return n.toFixed(decimals).replace(".", ",");
}

function fmtAuto(n) {
  return Number.isInteger(n) ? String(n) : fmtEs(n);
}

function fmtTrim(n) {
  const rounded = Math.round(n * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  const oneDecimal = Math.round(rounded * 10) / 10;
  if (Math.abs(oneDecimal - rounded) < 1e-9) return fmtEs(rounded, 1);
  return fmtEs(rounded, 2);
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

const ROMAN_VALUES = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(num) {
  let result = "";
  let remaining = num;
  for (const [value, symbol] of ROMAN_VALUES) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}

const NOMBRES = ["Ana", "Lucía", "Mario", "Pablo", "Marta", "Diego", "Sara", "Hugo", "Elena", "Nico", "Claudia", "Iván", "Noa", "Bruno"];

function todayEs() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

// "Cuántos"/"Cuántas" según el género de la primera palabra del sustantivo
// (plurales femeninos en esta lista siempre acaban en "as": canicas, entradas, botellas...)
function cuantosFor(objeto) {
  const primera = objeto.trim().split(" ")[0];
  return /as$/.test(primera) ? "Cuántas" : "Cuántos";
}

// Dos elementos distintos al azar (para problemas con dos personas distintas)
function pickTwo(arr) {
  const i = randomInt(0, arr.length - 1);
  let j = randomInt(0, arr.length - 1);
  while (j === i) j = randomInt(0, arr.length - 1);
  return [arr[i], arr[j]];
}

const SUPERINDICES = { 2: "²", 3: "³", 4: "⁴", 5: "⁵" };

// ---------------- Generadores de problemas por tema ----------------
// Cada función recibe el curso ("5" o "6") y devuelve
// { enunciado, datos: string[], operacion, solucion }

const ESCENARIOS_SUMAS = [
  { lugar: "una tienda de frutas", objeto: "kilos de manzanas", verbo: "vendieron" },
  { lugar: "una lechería", objeto: "litros de leche", verbo: "vendieron" },
  { lugar: "un cine", objeto: "entradas", verbo: "vendieron" },
  { lugar: "una papelería", objeto: "folios", verbo: "vendieron" },
  { lugar: "un club de atletismo", objeto: "kilómetros", verbo: "recorrieron" },
];

function sumasDosDias(curso) {
  const min = curso === "6" ? 1000 : 100;
  const max = curso === "6" ? 9000 : 900;
  const a = randomInt(min, max);
  const b = randomInt(min, max);
  const esc = pick(ESCENARIOS_SUMAS);
  const total = a + b;
  return {
    enunciado: `En ${esc.lugar} ${esc.verbo} ${a} ${esc.objeto} el lunes y ${b} ${esc.objeto} el martes. ¿${cuantosFor(esc.objeto)} ${esc.objeto} ${esc.verbo} entre los dos días?`,
    datos: [`Lunes: ${a}`, `Martes: ${b}`],
    operacion: `${a} + ${b} = ${total}`,
    solucion: `${total}. Entre los dos días ${esc.verbo} ${total} ${esc.objeto}.`,
  };
}

function sumasComparativa(curso) {
  const min = curso === "6" ? 40 : 10;
  const max = curso === "6" ? 300 : 60;
  const base = randomInt(min, max);
  const extra = randomInt(5, curso === "6" ? 100 : 20);
  const [n1, n2] = pickTwo(NOMBRES);
  const objeto = pick(["sellos", "cromos", "canicas", "libros"]);
  const segundo = base + extra;
  const total = base + segundo;
  return {
    enunciado: `${n1} tiene ${base} ${objeto}. ${n2} tiene ${extra} ${objeto} más que ${n1}. ¿${cuantosFor(objeto)} ${objeto} tienen entre los dos?`,
    datos: [`${n1}: ${base} ${objeto}`, `${n2}: ${base} + ${extra} ${objeto}`],
    operacion: `${n2} tiene ${base} + ${extra} = ${segundo}. Entre los dos: ${base} + ${segundo} = ${total}`,
    solucion: `${total}. Entre los dos tienen ${total} ${objeto}.`,
  };
}

const ESCENARIOS_SUMA_TRIPLE = [
  { lugar: "un almacén de frutas", objeto: "kilos de fruta", detalle: (a, b, c) => `${a} kg de manzanas, ${b} kg de peras y ${c} kg de naranjas` },
  { lugar: "una biblioteca", objeto: "libros", detalle: (a, b, c) => `${a} libros de aventuras, ${b} de misterio y ${c} de poesía` },
  { lugar: "un zoo", objeto: "animales", detalle: (a, b, c) => `${a} aves, ${b} mamíferos y ${c} reptiles` },
];

function sumasTresSumandos(curso) {
  const min = curso === "6" ? 200 : 20;
  const max = curso === "6" ? 2000 : 200;
  const a = randomInt(min, max);
  const b = randomInt(min, max);
  const c = randomInt(min, max);
  const esc = pick(ESCENARIOS_SUMA_TRIPLE);
  const total = a + b + c;
  return {
    enunciado: `En ${esc.lugar} hay ${esc.detalle(a, b, c)}. ¿${cuantosFor(esc.objeto)} ${esc.objeto} hay en total?`,
    datos: [`Grupo 1: ${a}`, `Grupo 2: ${b}`, `Grupo 3: ${c}`],
    operacion: `${a} + ${b} + ${c} = ${total}`,
    solucion: `${total}. Hay ${total} ${esc.objeto} en total.`,
  };
}

function genSumas(curso) {
  return pick([sumasDosDias, sumasComparativa, sumasTresSumandos])(curso);
}

function genSumasACS() {
  const a = randomInt(10, 40);
  const b = randomInt(10, 40);
  const esc = pick(ESCENARIOS_SUMAS);
  const total = a + b;
  return {
    enunciado: `En ${esc.lugar} ${esc.verbo} ${a} ${esc.objeto} el lunes y ${b} ${esc.objeto} el martes. ¿${cuantosFor(esc.objeto)} ${esc.objeto} ${esc.verbo} entre los dos días?`,
    datos: [`Lunes: ${a}`, `Martes: ${b}`],
    operacion: `${a} + ${b} = ${total}`,
    solucion: `${total}. Entre los dos días ${esc.verbo} ${total} ${esc.objeto}.`,
  };
}

function genSumasAltas() {
  const a = randomInt(1000, 9000);
  const b = randomInt(1000, 9000);
  const c = randomInt(1000, 9000);
  const d = randomInt(1000, 9000);
  const esc = pick(ESCENARIOS_SUMAS);
  const total = a + b + c + d;
  return {
    enunciado: `En ${esc.lugar} ${esc.verbo} ${a} ${esc.objeto} el lunes, ${b} el martes, ${c} el miércoles y ${d} el jueves. ¿${cuantosFor(esc.objeto)} ${esc.objeto} ${esc.verbo} en total entre los cuatro días?`,
    datos: [`Lunes: ${a}`, `Martes: ${b}`, `Miércoles: ${c}`, `Jueves: ${d}`],
    operacion: `${a} + ${b} + ${c} + ${d} = ${total}`,
    solucion: `${total}. En total ${esc.verbo} ${total} ${esc.objeto}.`,
  };
}

const ESCENARIOS_RESTAS = [
  { contenedor: "Un depósito de agua", objeto: "litros", verbo: "usado" },
  { contenedor: "Una hucha", objeto: "euros", verbo: "gastado" },
  { contenedor: "Una bolsa de canicas", objeto: "canicas", verbo: "perdido" },
  { contenedor: "Un rollo de papel", objeto: "metros", verbo: "gastado" },
];

function restasContenedor(curso) {
  const min = curso === "6" ? 2000 : 200;
  const max = curso === "6" ? 9000 : 900;
  const a = randomInt(min, max);
  const b = randomInt(Math.floor(min / 2), a - 1);
  const esc = pick(ESCENARIOS_RESTAS);
  const resultado = a - b;
  return {
    enunciado: `${esc.contenedor} tenía ${a} ${esc.objeto} y se han ${esc.verbo} ${b}. ¿${cuantosFor(esc.objeto)} ${esc.objeto} quedan?`,
    datos: [`Cantidad inicial: ${a}`, `Cantidad ${esc.verbo}: ${b}`],
    operacion: `${a} - ${b} = ${resultado}`,
    solucion: `${resultado}. Quedan ${resultado} ${esc.objeto}.`,
  };
}

function restasComparativa(curso) {
  const min = curso === "6" ? 50 : 10;
  const max = curso === "6" ? 500 : 80;
  const a = randomInt(min, max);
  const diferencia = randomInt(5, curso === "6" ? 150 : 30);
  const b = a + diferencia;
  const [n1, n2] = pickTwo(NOMBRES);
  const objeto = pick(["canicas", "cromos", "puntos", "euros"]);
  return {
    enunciado: `${n1} tiene ${b} ${objeto} y ${n2} tiene ${a} ${objeto}. ¿${cuantosFor(objeto)} ${objeto} más tiene ${n1} que ${n2}?`,
    datos: [`${n1}: ${b} ${objeto}`, `${n2}: ${a} ${objeto}`],
    operacion: `${b} - ${a} = ${diferencia}`,
    solucion: `${diferencia}. ${n1} tiene ${diferencia} ${objeto} más que ${n2}.`,
  };
}

const ESCENARIOS_RESTA_TRAYECTO = [
  { medio: "Un tren", unidad: "km" },
  { medio: "Un ciclista", unidad: "km" },
  { medio: "Un avión", unidad: "km" },
];

function restasTrayecto(curso) {
  const min = curso === "6" ? 300 : 30;
  const max = curso === "6" ? 3000 : 300;
  const total = randomInt(min, max);
  const recorrido = randomInt(Math.floor(min / 2), total - 10);
  const quedan = total - recorrido;
  const esc = pick(ESCENARIOS_RESTA_TRAYECTO);
  return {
    enunciado: `${esc.medio} tiene que recorrer un trayecto de ${total} ${esc.unidad}. Ya ha recorrido ${recorrido} ${esc.unidad}. ¿Cuántos ${esc.unidad} le quedan por recorrer?`,
    datos: [`Trayecto total: ${total} ${esc.unidad}`, `Ya recorridos: ${recorrido} ${esc.unidad}`],
    operacion: `${total} - ${recorrido} = ${quedan}`,
    solucion: `${quedan} ${esc.unidad}. Le quedan ${quedan} ${esc.unidad} por recorrer.`,
  };
}

function genRestas(curso) {
  return pick([restasContenedor, restasComparativa, restasTrayecto])(curso);
}

function genRestasACS() {
  const a = randomInt(30, 60);
  const b = randomInt(10, a - 1);
  const esc = pick(ESCENARIOS_RESTAS);
  const resultado = a - b;
  return {
    enunciado: `${esc.contenedor} tenía ${a} ${esc.objeto} y se han ${esc.verbo} ${b}. ¿${cuantosFor(esc.objeto)} ${esc.objeto} quedan?`,
    datos: [`Cantidad inicial: ${a}`, `Cantidad ${esc.verbo}: ${b}`],
    operacion: `${a} - ${b} = ${resultado}`,
    solucion: `${resultado}. Quedan ${resultado} ${esc.objeto}.`,
  };
}

function genRestasAltas() {
  const total = randomInt(5000, 9000);
  const resta1 = randomInt(1000, 3000);
  const resta2 = randomInt(500, 2000);
  const esc = pick(ESCENARIOS_RESTAS);
  const resultado = total - resta1 - resta2;
  return {
    enunciado: `${esc.contenedor} tenía ${total} ${esc.objeto}. Primero se han ${esc.verbo} ${resta1} y después ${resta2} más. ¿${cuantosFor(esc.objeto)} ${esc.objeto} quedan?`,
    datos: [`Cantidad inicial: ${total}`, `Primero ${esc.verbo}: ${resta1}`, `Después ${esc.verbo}: ${resta2}`],
    operacion: `${total} − ${resta1} − ${resta2} = ${resultado}`,
    solucion: `${resultado}. Quedan ${resultado} ${esc.objeto}.`,
  };
}

const ESCENARIOS_MULTIPLICACIONES = [
  { contenedorSing: "caja", contenedorPlur: "cajas", objeto: "lápices" },
  { contenedorSing: "paquete", contenedorPlur: "paquetes", objeto: "cromos" },
  { contenedorSing: "cesta", contenedorPlur: "cestas", objeto: "huevos" },
  { contenedorSing: "caja", contenedorPlur: "cajas", objeto: "botellas" },
];

function multiplicacionesContenedor(curso) {
  const a = curso === "6" ? randomInt(120, 950) : randomInt(12, 95);
  const b = curso === "6" ? randomInt(12, 45) : randomInt(2, 9);
  const esc = pick(ESCENARIOS_MULTIPLICACIONES);
  const total = a * b;
  return {
    enunciado: `Cada ${esc.contenedorSing} tiene ${a} ${esc.objeto} y hay ${b} ${esc.contenedorPlur}. ¿${cuantosFor(esc.objeto)} ${esc.objeto} hay en total?`,
    datos: [`${esc.objeto} por ${esc.contenedorSing}: ${a}`, `Número de ${esc.contenedorPlur}: ${b}`],
    operacion: `${a} × ${b} = ${total}`,
    solucion: `${total}. Hay ${total} ${esc.objeto} en total.`,
  };
}

const ESCENARIOS_MULTIPLICACIONES_RITMO = [
  { sujeto: "Un grifo", verbo: "llena", unidad: "litros", verboUnidad: "por minuto", tiempoUnidad: "minutos" },
  { sujeto: "Una fotocopiadora", verbo: "hace", unidad: "copias", verboUnidad: "por minuto", tiempoUnidad: "minutos" },
  { sujeto: "Un coche", verbo: "recorre", unidad: "km", verboUnidad: "por hora", tiempoUnidad: "horas" },
];

function multiplicacionesRitmo(curso) {
  const ritmo = curso === "6" ? randomInt(15, 60) : randomInt(3, 12);
  const tiempo = curso === "6" ? randomInt(12, 45) : randomInt(4, 9);
  const esc = pick(ESCENARIOS_MULTIPLICACIONES_RITMO);
  const total = ritmo * tiempo;
  return {
    enunciado: `${esc.sujeto} ${esc.verbo} ${ritmo} ${esc.unidad} ${esc.verboUnidad}. ¿${cuantosFor(esc.unidad)} ${esc.unidad} ${esc.verbo} en ${tiempo} ${esc.tiempoUnidad}?`,
    datos: [`Ritmo: ${ritmo} ${esc.unidad} ${esc.verboUnidad}`, `Tiempo: ${tiempo} ${esc.tiempoUnidad}`],
    operacion: `${ritmo} × ${tiempo} = ${total}`,
    solucion: `${total} ${esc.unidad}. En ${tiempo} ${esc.tiempoUnidad} ${esc.verbo} ${total} ${esc.unidad}.`,
  };
}

const ESCENARIOS_MULTIPLICACIONES_FILAS = [
  { lugar: "un cine", fila: "fila", objeto: "asientos" },
  { lugar: "un huerto", fila: "hilera", objeto: "plantas" },
  { lugar: "un estadio", fila: "grada", objeto: "espectadores" },
];

function multiplicacionesFilas(curso) {
  const filas = curso === "6" ? randomInt(15, 40) : randomInt(4, 12);
  const porFila = curso === "6" ? randomInt(15, 30) : randomInt(4, 10);
  const esc = pick(ESCENARIOS_MULTIPLICACIONES_FILAS);
  const total = filas * porFila;
  return {
    enunciado: `En ${esc.lugar} hay ${filas} ${esc.fila}s con ${porFila} ${esc.objeto} cada una. ¿${cuantosFor(esc.objeto)} ${esc.objeto} caben en total?`,
    datos: [`Número de ${esc.fila}s: ${filas}`, `${esc.objeto} por ${esc.fila}: ${porFila}`],
    operacion: `${filas} × ${porFila} = ${total}`,
    solucion: `${total}. Caben ${total} ${esc.objeto} en total.`,
  };
}

function genMultiplicaciones(curso) {
  return pick([multiplicacionesContenedor, multiplicacionesRitmo, multiplicacionesFilas])(curso);
}

function genMultiplicacionesACS() {
  const a = randomInt(3, 9);
  const b = randomInt(10, 30);
  const esc = pick(ESCENARIOS_MULTIPLICACIONES);
  const total = a * b;
  return {
    enunciado: `Cada ${esc.contenedorSing} tiene ${b} ${esc.objeto} y hay ${a} ${esc.contenedorPlur}. ¿${cuantosFor(esc.objeto)} ${esc.objeto} hay en total?`,
    datos: [`${esc.objeto} por ${esc.contenedorSing}: ${b}`, `Número de ${esc.contenedorPlur}: ${a}`],
    operacion: `${b} × ${a} = ${total}`,
    solucion: `${total}. Hay ${total} ${esc.objeto} en total.`,
  };
}

function genMultiplicacionesAltas() {
  const a = randomInt(120, 980);
  const b = randomInt(23, 89);
  const esc = pick(ESCENARIOS_MULTIPLICACIONES);
  const total = a * b;
  return {
    enunciado: `Cada ${esc.contenedorSing} tiene ${a} ${esc.objeto} y hay ${b} ${esc.contenedorPlur}. ¿${cuantosFor(esc.objeto)} ${esc.objeto} hay en total?`,
    datos: [`${esc.objeto} por ${esc.contenedorSing}: ${a}`, `Número de ${esc.contenedorPlur}: ${b}`],
    operacion: `${a} × ${b} = ${total}`,
    solucion: `${total}. Hay ${total} ${esc.objeto} en total.`,
  };
}

function divisionesReparto(curso) {
  const divisor = curso === "6" ? randomInt(12, 45) : randomInt(2, 9);
  const cociente = randomInt(15, 80);
  const resto = randomInt(0, divisor - 1);
  const dividendo = cociente * divisor + resto;
  const objeto = pick(["canicas", "cromos", "caramelos", "globos"]);
  return {
    enunciado: `Se reparten ${dividendo} ${objeto} entre ${divisor} niños a partes iguales. ¿${cuantosFor(objeto)} ${objeto} le tocan a cada uno y ${cuantosFor(objeto).toLowerCase()} sobran?`,
    datos: [`Total de ${objeto}: ${dividendo}`, `Número de niños: ${divisor}`],
    operacion: `${dividendo} ÷ ${divisor} = ${cociente} y sobran ${resto}`,
    solucion:
      resto > 0
        ? `A cada uno le tocan ${cociente} ${objeto} y sobran ${resto}.`
        : `A cada uno le tocan ${cociente} ${objeto} (reparto exacto).`,
  };
}

function divisionesCajasNecesarias(curso) {
  const capacidad = curso === "6" ? randomInt(12, 45) : randomInt(4, 9);
  const cajasCompletas = randomInt(8, 40);
  const sobran = randomInt(1, capacidad - 1);
  const total = cajasCompletas * capacidad + sobran;
  const cajasNecesarias = cajasCompletas + 1;
  const objeto = pick(["libros", "botellas", "manzanas", "camisetas"]);
  return {
    enunciado: `Se quieren guardar ${total} ${objeto} en cajas de ${capacidad} ${objeto} cada una. ¿Cuántas cajas se necesitan como mínimo?`,
    datos: [`Total de ${objeto}: ${total}`, `Capacidad por caja: ${capacidad}`],
    operacion: `${total} ÷ ${capacidad} = ${cajasCompletas} y sobran ${sobran}, así que hace falta ${cajasCompletas} + 1 caja más`,
    solucion: `${cajasNecesarias} cajas. Se necesitan ${cajasNecesarias} cajas (una para guardar las ${sobran} que sobran).`,
  };
}

const ESCENARIOS_DIVISION_TRAMOS = [
  { contexto: "Una carretera", unidad: "km", parteSing: "tramo", partePlur: "tramos iguales" },
  { contexto: "Una cinta", unidad: "cm", parteSing: "trozo", partePlur: "trozos iguales" },
  { contexto: "Una cuerda", unidad: "m", parteSing: "trozo", partePlur: "trozos iguales" },
];

function divisionesTramos(curso) {
  const divisor = curso === "6" ? randomInt(12, 40) : randomInt(3, 9);
  const porTramo = randomInt(15, 80);
  const total = divisor * porTramo;
  const esc = pick(ESCENARIOS_DIVISION_TRAMOS);
  return {
    enunciado: `${esc.contexto} de ${total} ${esc.unidad} se divide en ${divisor} ${esc.partePlur}. ¿Cuántos ${esc.unidad} mide cada ${esc.parteSing}?`,
    datos: [`Longitud total: ${total} ${esc.unidad}`, `Número de partes: ${divisor}`],
    operacion: `${total} ÷ ${divisor} = ${porTramo}`,
    solucion: `${porTramo} ${esc.unidad}. Cada ${esc.parteSing} mide ${porTramo} ${esc.unidad}.`,
  };
}

function genDivisiones(curso) {
  return pick([divisionesReparto, divisionesCajasNecesarias, divisionesTramos])(curso);
}

function genDivisionesACS() {
  const divisor = randomInt(2, 5);
  const cociente = randomInt(2, 9);
  const dividendo = cociente * divisor;
  const objeto = pick(["canicas", "cromos", "caramelos", "globos"]);
  return {
    enunciado: `Se reparten ${dividendo} ${objeto} entre ${divisor} niños a partes iguales. ¿${cuantosFor(objeto)} ${objeto} le tocan a cada uno?`,
    datos: [`Total de ${objeto}: ${dividendo}`, `Número de niños: ${divisor}`],
    operacion: `${dividendo} ÷ ${divisor} = ${cociente}`,
    solucion: `A cada uno le tocan ${cociente} ${objeto} (reparto exacto).`,
  };
}

function genDivisionesAltas() {
  const divisor = randomInt(23, 89);
  const cociente = randomInt(100, 300);
  const resto = randomInt(1, divisor - 1);
  const dividendo = cociente * divisor + resto;
  const objeto = pick(["canicas", "cromos", "caramelos", "globos"]);
  return {
    enunciado: `Se reparten ${dividendo} ${objeto} entre ${divisor} niños a partes iguales. ¿${cuantosFor(objeto)} ${objeto} le tocan a cada uno y ${cuantosFor(objeto).toLowerCase()} sobran?`,
    datos: [`Total de ${objeto}: ${dividendo}`, `Número de niños: ${divisor}`],
    operacion: `${dividendo} ÷ ${divisor} = ${cociente} y sobran ${resto}`,
    solucion: `A cada uno le tocan ${cociente} ${objeto} y sobran ${resto}.`,
  };
}

function operacionesCombinadasCompra(curso) {
  const isSixth = curso === "6";
  const p1 = isSixth ? roundMoney(randomInt(150, 500) / 100) : randomInt(2, 9);
  const p2 = isSixth ? roundMoney(randomInt(150, 500) / 100) : randomInt(2, 9);
  const n1 = randomInt(2, 4);
  const n2 = randomInt(2, 4);
  const objeto1 = pick(["cuadernos", "bolígrafos", "rotuladores", "libros"]);
  const objeto2 = pick(["carpetas", "reglas", "gomas", "libretas"]);
  const gasto = roundMoney(n1 * p1 + n2 * p2);
  const billetesPosibles = [10, 20, 50, 100];
  const billete = billetesPosibles.find((b) => b > gasto) ?? Math.ceil(gasto / 50) * 50 + 50;
  const vuelta = roundMoney(billete - gasto);
  const fmt = (n) => fmtAuto(n);
  return {
    enunciado: `${pick(NOMBRES)} compra ${n1} ${objeto1} a ${fmt(p1)} € cada uno y ${n2} ${objeto2} a ${fmt(p2)} € cada una. Paga con un billete de ${billete} €. ¿Cuánto le devuelven?`,
    datos: [`${n1} ${objeto1} a ${fmt(p1)} € cada uno`, `${n2} ${objeto2} a ${fmt(p2)} € cada una`, `Paga con: ${billete} €`],
    operacion: `${billete} − (${n1} × ${fmt(p1)} + ${n2} × ${fmt(p2)}) = ${billete} − ${fmt(gasto)} = ${fmt(vuelta)}`,
    solucion: `${fmt(vuelta)} €. Le devuelven ${fmt(vuelta)} €.`,
  };
}

function operacionesCombinadasExpresion(curso) {
  const a = randomInt(2, 9);
  const b = randomInt(2, 9);
  const c = randomInt(2, 9);
  if (curso === "6") {
    const paso1 = a + b;
    const paso2 = paso1 * c;
    const divisores = [2, 3, 4, 5, 6].filter((x) => paso2 % x === 0);
    const d = divisores.length ? pick(divisores) : 1;
    const paso3 = paso2 / d;
    const e = randomInt(2, 15);
    const resultado = paso3 + e;
    return {
      enunciado: `Calcula: (${a} + ${b}) × ${c} ÷ ${d} + ${e}`,
      datos: [`Expresión: (${a} + ${b}) × ${c} ÷ ${d} + ${e}`],
      operacion: `Paréntesis: ${a} + ${b} = ${paso1}. Multiplicación: ${paso1} × ${c} = ${paso2}. División: ${paso2} ÷ ${d} = ${paso3}. Suma: ${paso3} + ${e} = ${resultado}`,
      solucion: `${resultado}. El resultado es ${resultado}.`,
    };
  }
  const d = randomInt(2, 20);
  const paso1 = a + b;
  const paso2 = paso1 * c;
  const resultado = paso2 - d;
  return {
    enunciado: `Calcula: (${a} + ${b}) × ${c} − ${d}`,
    datos: [`Expresión: (${a} + ${b}) × ${c} − ${d}`],
    operacion: `Paréntesis primero: ${a} + ${b} = ${paso1}. Multiplicación: ${paso1} × ${c} = ${paso2}. Resta: ${paso2} − ${d} = ${resultado}`,
    solucion: `${resultado}. El resultado es ${resultado}.`,
  };
}

function operacionesCombinadasTrabajo(curso) {
  const horas = randomInt(3, 8);
  const tarifa = curso === "6" ? roundMoney(randomInt(800, 1500) / 100) : randomInt(5, 12);
  const dias = randomInt(2, 5);
  const gastos = curso === "6" ? roundMoney(randomInt(500, 3000) / 100) : randomInt(5, 30);
  const fmt = (n) => fmtAuto(n);
  const porDia = roundMoney(horas * tarifa);
  const totalBruto = roundMoney(porDia * dias);
  const neto = roundMoney(totalBruto - gastos);
  const nombre = pick(NOMBRES);
  return {
    enunciado: `${nombre} trabaja ${horas} horas al día a ${fmt(tarifa)} € la hora, durante ${dias} días. Si tiene ${fmt(gastos)} € de gastos, ¿cuánto dinero le queda?`,
    datos: [`Horas al día: ${horas}`, `Precio por hora: ${fmt(tarifa)} €`, `Días trabajados: ${dias}`, `Gastos: ${fmt(gastos)} €`],
    operacion: `${horas} × ${fmt(tarifa)} = ${fmt(porDia)} €/día. ${fmt(porDia)} × ${dias} = ${fmt(totalBruto)} €. ${fmt(totalBruto)} − ${fmt(gastos)} = ${fmt(neto)}`,
    solucion: `${fmt(neto)} €. Le quedan ${fmt(neto)} €.`,
  };
}

function genOperacionesCombinadas(curso) {
  return pick([operacionesCombinadasCompra, operacionesCombinadasExpresion, operacionesCombinadasTrabajo])(curso);
}

function genOperacionesCombinadasACS() {
  const precio = randomInt(2, 5);
  const cantidad = randomInt(2, 4);
  const extra = randomInt(1, 5);
  const nombre = pick(NOMBRES);
  const objeto = pick(["caramelos", "cromos", "lápices", "canicas"]);
  const total = cantidad * precio + extra;
  return {
    enunciado: `${nombre} compra ${cantidad} bolsas de ${objeto} a ${precio} € cada una y además paga ${extra} € de propina. ¿Cuánto gasta en total?`,
    datos: [`${cantidad} bolsas a ${precio} € cada una`, `Propina: ${extra} €`],
    operacion: `${cantidad} × ${precio} + ${extra} = ${total}`,
    solucion: `${total}. Gasta ${total} € en total.`,
  };
}

function genOperacionesCombinadasAltas() {
  const a = randomInt(4, 12);
  const b = randomInt(4, 12);
  const c = randomInt(3, 9);
  const paso1 = a + b;
  const paso2 = paso1 * c;
  const divisores = [2, 3, 4, 5, 6, 7].filter((x) => paso2 % x === 0);
  const d = divisores.length ? pick(divisores) : 1;
  const paso3 = paso2 / d;
  const e = randomInt(5, 30);
  const paso4 = paso3 - e;
  const f = randomInt(2, 9);
  const resultado = paso4 * f;
  return {
    enunciado: `Calcula: ((${a} + ${b}) × ${c} ÷ ${d} − ${e}) × ${f}`,
    datos: [`Expresión: ((${a} + ${b}) × ${c} ÷ ${d} − ${e}) × ${f}`],
    operacion: `Paréntesis interno: ${a} + ${b} = ${paso1}. × ${c} = ${paso2}. ÷ ${d} = ${paso3}. − ${e} = ${paso4}. × ${f} = ${resultado}`,
    solucion: `${resultado}. El resultado es ${resultado}.`,
  };
}

function numerosRomanosAFormato(curso) {
  const max = curso === "6" ? 3999 : 500;
  const min = curso === "6" ? 500 : 11;
  const n = randomInt(min, max);
  const roman = toRoman(n);
  return {
    enunciado: `Escribe en números romanos el número ${n}.`,
    datos: [`Número: ${n}`],
    operacion: `${n} se descompone según el valor de cada cifra romana`,
    solucion: `${roman}. El número ${n} en números romanos es ${roman}.`,
  };
}

function numerosRomanosDesdeFormato(curso) {
  const max = curso === "6" ? 3999 : 500;
  const min = curso === "6" ? 500 : 11;
  const n = randomInt(min, max);
  const roman = toRoman(n);
  return {
    enunciado: `¿Qué número representa la cifra romana ${roman}?`,
    datos: [`Cifra romana: ${roman}`],
    operacion: `${roman} se traduce sumando (o restando) el valor de cada letra`,
    solucion: `${n}. La cifra romana ${roman} representa el número ${n}.`,
  };
}

function numerosRomanosOperacion(curso) {
  const max = curso === "6" ? 500 : 100;
  const a = randomInt(10, max);
  const b = randomInt(10, max);
  const suma = a + b;
  return {
    enunciado: `Calcula ${toRoman(a)} + ${toRoman(b)} y escribe el resultado en números romanos.`,
    datos: [`${toRoman(a)} = ${a}`, `${toRoman(b)} = ${b}`],
    operacion: `${a} + ${b} = ${suma} → ${toRoman(suma)}`,
    solucion: `${toRoman(suma)}. El resultado es ${toRoman(suma)} (${suma}).`,
  };
}

function genNumerosRomanos(curso) {
  return pick([numerosRomanosAFormato, numerosRomanosDesdeFormato, numerosRomanosOperacion])(curso);
}

function genNumerosRomanosACS() {
  const n = randomInt(1, 20);
  const roman = toRoman(n);
  return {
    enunciado: `Escribe en números romanos el número ${n}.`,
    datos: [`Número: ${n}`],
    operacion: `${n} se escribe combinando las letras I, V y X`,
    solucion: `${roman}. El número ${n} en números romanos es ${roman}.`,
  };
}

function genNumerosRomanosAltas() {
  const a = randomInt(500, 3500);
  const b = randomInt(100, a - 50);
  const resultado = a - b;
  return {
    enunciado: `Calcula ${toRoman(a)} − ${toRoman(b)} y escribe el resultado en números romanos.`,
    datos: [`${toRoman(a)} = ${a}`, `${toRoman(b)} = ${b}`],
    operacion: `${a} − ${b} = ${resultado} → ${toRoman(resultado)}`,
    solucion: `${toRoman(resultado)}. El resultado es ${toRoman(resultado)} (${resultado}).`,
  };
}

function potenciasCalcular(curso) {
  const base = randomInt(2, curso === "6" ? 12 : 9);
  const exp = curso === "6" ? pick([2, 3]) : 2;
  const valor = Math.pow(base, exp);
  const signo = SUPERINDICES[exp];
  const factores = Array(exp).fill(base).join(" × ");
  return {
    enunciado: `Calcula la potencia ${base}${signo}.`,
    datos: [`Base: ${base}`, `Exponente: ${exp}`],
    operacion: `${base}${signo} = ${factores} = ${valor}`,
    solucion: `${valor}. ${base} elevado a ${exp} es ${valor}.`,
  };
}

function potenciasComparar(curso) {
  const base1 = randomInt(2, curso === "6" ? 6 : 4);
  const exp1 = curso === "6" ? pick([2, 3]) : 2;
  const base2 = randomInt(2, curso === "6" ? 6 : 4);
  const exp2 = curso === "6" ? pick([2, 3]) : 2;
  const val1 = Math.pow(base1, exp1);
  const val2 = Math.pow(base2, exp2);
  const signo1 = SUPERINDICES[exp1];
  const signo2 = SUPERINDICES[exp2];
  const etiqueta1 = `${base1}${signo1}`;
  const etiqueta2 = `${base2}${signo2}`;
  if (val1 === val2) {
    return {
      enunciado: `¿Cuál es mayor, ${etiqueta1} o ${etiqueta2}?`,
      datos: [etiqueta1, etiqueta2],
      operacion: `${etiqueta1} = ${val1}. ${etiqueta2} = ${val2}.`,
      solucion: `${etiqueta1} y ${etiqueta2} son iguales (ambos valen ${val1}).`,
    };
  }
  const mayor = val1 > val2 ? etiqueta1 : etiqueta2;
  return {
    enunciado: `¿Cuál es mayor, ${etiqueta1} o ${etiqueta2}?`,
    datos: [etiqueta1, etiqueta2],
    operacion: `${etiqueta1} = ${val1}. ${etiqueta2} = ${val2}.`,
    solucion: `${mayor}. ${mayor} es mayor (${Math.max(val1, val2)} > ${Math.min(val1, val2)}).`,
  };
}

function potenciasDiez(curso) {
  const exp = curso === "6" ? randomInt(2, 5) : randomInt(2, 3);
  const valor = Math.pow(10, exp);
  const signo = SUPERINDICES[exp];
  return {
    enunciado: `¿Cuánto vale 10${signo}?`,
    datos: [`Base: 10`, `Exponente: ${exp}`],
    operacion: `10${signo} = ${Array(exp).fill(10).join(" × ")} = ${valor}`,
    solucion: `${valor}. 10 elevado a ${exp} es ${valor}.`,
  };
}

function genPotencias(curso) {
  return pick([potenciasCalcular, potenciasComparar, potenciasDiez])(curso);
}

function genPotenciasACS() {
  const base = randomInt(2, 5);
  const valor = base * base;
  return {
    enunciado: `Calcula la potencia ${base}².`,
    datos: [`Base: ${base}`, `Exponente: 2`],
    operacion: `${base}² = ${base} × ${base} = ${valor}`,
    solucion: `${valor}. ${base} elevado a 2 es ${valor}.`,
  };
}

function genPotenciasAltas() {
  const base = randomInt(6, 15);
  const exp = pick([3, 4]);
  const valor = Math.pow(base, exp);
  const signo = SUPERINDICES[exp];
  const factores = Array(exp).fill(base).join(" × ");
  return {
    enunciado: `Calcula la potencia ${base}${signo}.`,
    datos: [`Base: ${base}`, `Exponente: ${exp}`],
    operacion: `${base}${signo} = ${factores} = ${valor}`,
    solucion: `${valor}. ${base} elevado a ${exp} es ${valor}.`,
  };
}

function enterosTemperatura(curso) {
  const inicial = randomInt(-5, 15);
  const rango = curso === "6" ? 20 : 10;
  const cambio = randomInt(-rango, rango) || 3;
  const sube = cambio >= 0;
  const resultado = inicial + cambio;
  return {
    enunciado: `La temperatura a las 8h de la mañana era de ${inicial}°C. A lo largo del día ${sube ? "sube" : "baja"} ${Math.abs(cambio)} grados. ¿Qué temperatura hace ahora?`,
    datos: [`Temperatura inicial: ${inicial}°C`, `Cambio: ${sube ? "+" : "−"}${Math.abs(cambio)}°C`],
    operacion: `${inicial} ${sube ? "+" : "−"} ${Math.abs(cambio)} = ${resultado}`,
    solucion: `${resultado}°C. Ahora hace ${resultado}°C.`,
  };
}

function enterosBanco(curso) {
  const inicial = randomInt(curso === "6" ? -200 : -50, curso === "6" ? 500 : 100);
  const movimiento = randomInt(curso === "6" ? 20 : 10, curso === "6" ? 300 : 60);
  const esIngreso = Math.random() < 0.5;
  const resultado = esIngreso ? inicial + movimiento : inicial - movimiento;
  return {
    enunciado: `Una cuenta bancaria tiene ${inicial} €. Se ${esIngreso ? "ingresan" : "retiran"} ${movimiento} €. ¿Cuál es el saldo final?`,
    datos: [`Saldo inicial: ${inicial} €`, `${esIngreso ? "Ingreso" : "Retirada"}: ${movimiento} €`],
    operacion: `${inicial} ${esIngreso ? "+" : "−"} ${movimiento} = ${resultado}`,
    solucion: `${resultado} €. El saldo final es ${resultado} €.`,
  };
}

function enterosAltitud(curso) {
  const inicial = randomInt(-30, curso === "6" ? 3000 : 200);
  const cambio = randomInt(curso === "6" ? 20 : 5, curso === "6" ? 500 : 50);
  const sube = Math.random() < 0.5;
  const resultado = sube ? inicial + cambio : inicial - cambio;
  return {
    enunciado: `Un submarino está a ${inicial} m respecto al nivel del mar. ${sube ? "Sube" : "Baja"} ${cambio} m. ¿A qué altura respecto al nivel del mar queda?`,
    datos: [`Posición inicial: ${inicial} m`, `Cambio: ${sube ? "+" : "−"}${cambio} m`],
    operacion: `${inicial} ${sube ? "+" : "−"} ${cambio} = ${resultado}`,
    solucion: `${resultado} m. Queda a ${resultado} m respecto al nivel del mar.`,
  };
}

function genNumerosEnteros(curso) {
  return pick([enterosTemperatura, enterosBanco, enterosAltitud])(curso);
}

function genNumerosEnterosACS() {
  const positivo = randomInt(1, 8);
  const negativo = randomInt(1, 8);
  return {
    enunciado: `Un termómetro marca ${positivo}°C y otro marca −${negativo}°C. ¿Cuál de las dos temperaturas es mayor?`,
    datos: [`Termómetro A: ${positivo}°C`, `Termómetro B: −${negativo}°C`],
    operacion: `${positivo} es positivo y −${negativo} es negativo`,
    solucion: `${positivo}°C es la temperatura mayor (todo número positivo es mayor que cualquier negativo).`,
  };
}

function genNumerosEnterosAltas() {
  const inicial = randomInt(-100, 100);
  const cambio1 = randomInt(-80, 80) || 5;
  const cambio2 = randomInt(-80, 80) || -5;
  const resultado = inicial + cambio1 + cambio2;
  return {
    enunciado: `Un submarino está a ${inicial} m respecto al nivel del mar. Primero ${cambio1 >= 0 ? "sube" : "baja"} ${Math.abs(cambio1)} m y después ${cambio2 >= 0 ? "sube" : "baja"} ${Math.abs(cambio2)} m más. ¿A qué altura respecto al nivel del mar queda?`,
    datos: [`Posición inicial: ${inicial} m`, `Primer cambio: ${cambio1 >= 0 ? "+" : "−"}${Math.abs(cambio1)} m`, `Segundo cambio: ${cambio2 >= 0 ? "+" : "−"}${Math.abs(cambio2)} m`],
    operacion: `${inicial} ${cambio1 >= 0 ? "+" : "−"} ${Math.abs(cambio1)} ${cambio2 >= 0 ? "+" : "−"} ${Math.abs(cambio2)} = ${resultado}`,
    solucion: `${resultado} m. Queda a ${resultado} m respecto al nivel del mar.`,
  };
}

function multiplosDivisoresLista(curso) {
  const n = curso === "6" ? randomInt(6, 15) : randomInt(3, 12);
  const multiplos = Array.from({ length: 5 }, (_, i) => n * (i + 1));
  return {
    enunciado: `Escribe los 5 primeros múltiplos de ${n} (sin contar el 0).`,
    datos: [`Número: ${n}`],
    operacion: `${n} × 1, ${n} × 2, ${n} × 3, ${n} × 4, ${n} × 5`,
    solucion: `${multiplos.join(", ")}.`,
  };
}

function multiplosDivisoresMCM(curso) {
  const a = curso === "6" ? randomInt(6, 15) : randomInt(3, 10);
  const b = curso === "6" ? randomInt(6, 15) : randomInt(3, 10);
  const resultado = lcm(a, b);
  return {
    enunciado: `Dos autobuses salen juntos de la estación a las 8:00h. El primero repite su recorrido cada ${a} minutos y el segundo cada ${b} minutos. ¿Dentro de cuántos minutos volverán a coincidir en la estación?`,
    datos: [`Primer autobús: cada ${a} min`, `Segundo autobús: cada ${b} min`],
    operacion: `m.c.m.(${a}, ${b}) = ${resultado}`,
    solucion: `${resultado} minutos. Volverán a coincidir dentro de ${resultado} minutos.`,
  };
}

function multiplosDivisoresMCD(curso) {
  const a = curso === "6" ? randomInt(12, 60) : randomInt(6, 24);
  const b = curso === "6" ? randomInt(12, 60) : randomInt(6, 24);
  const resultado = gcd(a, b);
  return {
    enunciado: `Se quieren repartir ${a} caramelos y ${b} chuches en bolsas iguales, con el mayor número de bolsas posible y sin mezclar caramelos con chuches. ¿Cuántas unidades debe llevar cada bolsa?`,
    datos: [`Caramelos: ${a}`, `Chuches: ${b}`],
    operacion: `M.C.D.(${a}, ${b}) = ${resultado}`,
    solucion: `${resultado}. Cada bolsa debe llevar ${resultado} unidades.`,
  };
}

function genMultiplosDivisores(curso) {
  return pick([multiplosDivisoresLista, multiplosDivisoresMCM, multiplosDivisoresMCD])(curso);
}

function genMultiplosDivisoresACS() {
  const n = pick([2, 5, 10]);
  const multiplos = Array.from({ length: 5 }, (_, i) => n * (i + 1));
  return {
    enunciado: `Escribe los 5 primeros múltiplos de ${n} (sin contar el 0).`,
    datos: [`Número: ${n}`],
    operacion: `${n} × 1, ${n} × 2, ${n} × 3, ${n} × 4, ${n} × 5`,
    solucion: `${multiplos.join(", ")}.`,
  };
}

function genMultiplosDivisoresAltas() {
  const a = randomInt(6, 15);
  const b = randomInt(6, 15);
  const c = randomInt(6, 15);
  const resultado = lcm(lcm(a, b), c);
  return {
    enunciado: `Tres autobuses salen juntos de la estación a las 8:00h. El primero repite su recorrido cada ${a} minutos, el segundo cada ${b} minutos y el tercero cada ${c} minutos. ¿Dentro de cuántos minutos volverán a coincidir los tres a la vez?`,
    datos: [`Autobús 1: cada ${a} min`, `Autobús 2: cada ${b} min`, `Autobús 3: cada ${c} min`],
    operacion: `m.c.m.(${a}, ${b}, ${c}) = ${resultado}`,
    solucion: `${resultado} minutos. Volverán a coincidir los tres dentro de ${resultado} minutos.`,
  };
}

function fraccionesTartaResto(curso) {
  const den = curso === "6" ? randomInt(6, 12) : randomInt(3, 8);
  const comidos = randomInt(1, den - 1);
  const quedan = den - comidos;
  return {
    enunciado: `Una tarta se divide en ${den} trozos iguales. Se han comido ${comidos} trozos. ¿Qué fracción de la tarta queda?`,
    datos: [`Trozos totales: ${den}`, `Trozos comidos: ${comidos}`],
    operacion: `${den}/${den} − ${comidos}/${den} = ${quedan}/${den}`,
    solucion: `${quedan}/${den}. Queda ${quedan}/${den} de la tarta.`,
  };
}

function fraccionesEquivalente(curso) {
  const den = curso === "6" ? randomInt(3, 8) : randomInt(2, 5);
  const num = randomInt(1, den - 1);
  const factor = randomInt(2, curso === "6" ? 6 : 4);
  const numEq = num * factor;
  const denEq = den * factor;
  return {
    enunciado: `Completa la fracción equivalente: ${num}/${den} = ?/${denEq}`,
    datos: [`Fracción: ${num}/${den}`, `Nuevo denominador: ${denEq}`],
    operacion: `${denEq} ÷ ${den} = ${factor}. ${num} × ${factor} = ${numEq}`,
    solucion: `${numEq}/${denEq}. La fracción equivalente es ${numEq}/${denEq}.`,
  };
}

function fraccionesDeGrupo(curso) {
  const den = curso === "6" ? randomInt(4, 8) : randomInt(2, 5);
  const num = randomInt(1, den - 1);
  const multiplo = randomInt(2, curso === "6" ? 12 : 6);
  const total = den * multiplo;
  const parte = num * multiplo;
  return {
    enunciado: `En una clase de ${total} alumnos, ${num}/${den} partes son niñas. ¿Cuántas niñas hay en la clase?`,
    datos: [`Total de alumnos: ${total}`, `Fracción de niñas: ${num}/${den}`],
    operacion: `${total} ÷ ${den} = ${multiplo}. ${multiplo} × ${num} = ${parte}`,
    solucion: `${parte}. Hay ${parte} niñas en la clase.`,
  };
}

function genFracciones(curso) {
  return pick([fraccionesTartaResto, fraccionesEquivalente, fraccionesDeGrupo])(curso);
}

function genFraccionesACS() {
  const den = pick([2, 3, 4]);
  const comidos = randomInt(1, den - 1);
  const quedan = den - comidos;
  return {
    enunciado: `Una tarta se divide en ${den} trozos iguales. Se han comido ${comidos} trozo${comidos === 1 ? "" : "s"}. ¿Qué fracción de la tarta queda?`,
    datos: [`Trozos totales: ${den}`, `Trozos comidos: ${comidos}`],
    operacion: `${den}/${den} − ${comidos}/${den} = ${quedan}/${den}`,
    solucion: `${quedan}/${den}. Queda ${quedan}/${den} de la tarta.`,
  };
}

function genFraccionesAltas() {
  const den1 = randomInt(3, 6);
  const num1 = randomInt(1, den1 - 1);
  const den2 = randomInt(3, 6);
  const num2 = randomInt(1, den2 - 1);
  const k = randomInt(2, 6);
  const total = den1 * den2 * k;
  const parteUno = (total / den1) * num1;
  const parteDos = (parteUno / den2) * num2;
  return {
    enunciado: `En un huerto de ${total} plantas, ${num1}/${den1} son tomateras. De esas tomateras, ${num2}/${den2} ya tienen fruto. ¿Cuántas tomateras tienen fruto?`,
    datos: [`Total de plantas: ${total}`, `Fracción de tomateras: ${num1}/${den1}`, `Fracción con fruto: ${num2}/${den2}`],
    operacion: `${total} ÷ ${den1} × ${num1} = ${parteUno} tomateras. ${parteUno} ÷ ${den2} × ${num2} = ${parteDos}`,
    solucion: `${parteDos}. Hay ${parteDos} tomateras con fruto.`,
  };
}

function operacionesFraccionesSuma(curso) {
  if (curso === "6") {
    const d1 = randomInt(2, 6);
    const d2 = randomInt(2, 6);
    const n1 = randomInt(1, d1 - 1);
    const n2 = randomInt(1, d2 - 1);
    const comunDen = lcm(d1, d2);
    const num1 = n1 * (comunDen / d1);
    const num2 = n2 * (comunDen / d2);
    const sumaNum = num1 + num2;
    return {
      enunciado: `Calcula: ${n1}/${d1} + ${n2}/${d2}`,
      datos: [`Fracción 1: ${n1}/${d1}`, `Fracción 2: ${n2}/${d2}`],
      operacion: `${n1}/${d1} + ${n2}/${d2} = ${num1}/${comunDen} + ${num2}/${comunDen} = ${sumaNum}/${comunDen}`,
      solucion: `${sumaNum}/${comunDen}. El resultado es ${sumaNum}/${comunDen}.`,
    };
  }
  const den = randomInt(4, 10);
  const n1 = randomInt(1, den - 2);
  const n2 = randomInt(1, den - n1 - 1);
  const suma = n1 + n2;
  return {
    enunciado: `Calcula: ${n1}/${den} + ${n2}/${den}`,
    datos: [`Fracción 1: ${n1}/${den}`, `Fracción 2: ${n2}/${den}`],
    operacion: `${n1}/${den} + ${n2}/${den} = ${suma}/${den}`,
    solucion: `${suma}/${den}. El resultado es ${suma}/${den}.`,
  };
}

function operacionesFraccionesResta(curso) {
  if (curso === "6") {
    let d1 = randomInt(2, 6);
    let d2 = randomInt(2, 6);
    let n1 = randomInt(1, d1 - 1);
    let n2 = randomInt(1, d2 - 1);
    const comunDen = lcm(d1, d2);
    let num1 = n1 * (comunDen / d1);
    let num2 = n2 * (comunDen / d2);
    if (num1 < num2) {
      [d1, d2] = [d2, d1];
      [n1, n2] = [n2, n1];
      [num1, num2] = [num2, num1];
    }
    const resultNum = num1 - num2;
    return {
      enunciado: `Calcula: ${n1}/${d1} − ${n2}/${d2}`,
      datos: [`Fracción 1: ${n1}/${d1}`, `Fracción 2: ${n2}/${d2}`],
      operacion: `${n1}/${d1} − ${n2}/${d2} = ${num1}/${comunDen} − ${num2}/${comunDen} = ${resultNum}/${comunDen}`,
      solucion: `${resultNum}/${comunDen}. El resultado es ${resultNum}/${comunDen}.`,
    };
  }
  const den = randomInt(4, 10);
  const n1 = randomInt(2, den - 1);
  const n2 = randomInt(1, n1 - 1);
  const resultado = n1 - n2;
  return {
    enunciado: `Calcula: ${n1}/${den} − ${n2}/${den}`,
    datos: [`Fracción 1: ${n1}/${den}`, `Fracción 2: ${n2}/${den}`],
    operacion: `${n1}/${den} − ${n2}/${den} = ${resultado}/${den}`,
    solucion: `${resultado}/${den}. El resultado es ${resultado}/${den}.`,
  };
}

function operacionesFraccionesMultiplicacion(curso) {
  const den = curso === "6" ? randomInt(3, 8) : randomInt(2, 6);
  const num = randomInt(1, den - 1);
  const entero = randomInt(2, curso === "6" ? 6 : 4);
  const productoNum = num * entero;
  const g = gcd(productoNum, den);
  const numSimpl = productoNum / g;
  const denSimpl = den / g;
  return {
    enunciado: `Calcula: ${num}/${den} × ${entero}`,
    datos: [`Fracción: ${num}/${den}`, `Número: ${entero}`],
    operacion: `${num} × ${entero} = ${productoNum}. ${productoNum}/${den}${g > 1 ? ` = ${numSimpl}/${denSimpl} (simplificando entre ${g})` : ""}`,
    solucion: g > 1 ? `${numSimpl}/${denSimpl}. El resultado es ${numSimpl}/${denSimpl}.` : `${productoNum}/${den}. El resultado es ${productoNum}/${den}.`,
  };
}

function genOperacionesFracciones(curso) {
  return pick([operacionesFraccionesSuma, operacionesFraccionesResta, operacionesFraccionesMultiplicacion])(curso);
}

function genOperacionesFraccionesACS() {
  const den = pick([2, 4]);
  const multiplo = randomInt(2, 6);
  const total = den * multiplo;
  const resultado = total / den;
  const objeto = pick(["caramelos", "cromos", "canicas", "galletas"]);
  return {
    enunciado: `Tengo ${total} ${objeto} y regalo 1/${den}. ¿${cuantosFor(objeto)} ${objeto} regalo?`,
    datos: [`Total: ${total} ${objeto}`, `Fracción: 1/${den}`],
    operacion: `${total} ÷ ${den} = ${resultado}`,
    solucion: `${resultado}. Regalo ${resultado} ${objeto}.`,
  };
}

function genOperacionesFraccionesAltas() {
  const den1 = randomInt(2, 8);
  const num1 = randomInt(1, den1 - 1);
  const den2 = randomInt(2, 8);
  const num2 = randomInt(1, den2 - 1);
  const productoNum = num1 * den2;
  const productoDen = den1 * num2;
  const g = gcd(productoNum, productoDen);
  const numSimpl = productoNum / g;
  const denSimpl = productoDen / g;
  return {
    enunciado: `Calcula: ${num1}/${den1} ÷ ${num2}/${den2}`,
    datos: [`Fracción 1: ${num1}/${den1}`, `Fracción 2: ${num2}/${den2}`],
    operacion: `${num1}/${den1} ÷ ${num2}/${den2} = ${num1}/${den1} × ${den2}/${num2} = ${productoNum}/${productoDen}${g > 1 ? ` = ${numSimpl}/${denSimpl} (simplificando entre ${g})` : ""}`,
    solucion: g > 1 ? `${numSimpl}/${denSimpl}. El resultado es ${numSimpl}/${denSimpl}.` : `${productoNum}/${productoDen}. El resultado es ${productoNum}/${productoDen}.`,
  };
}

function decimalesRedondeo(curso) {
  const entero = randomInt(1, curso === "6" ? 99 : 20);
  const milesimas = randomInt(0, 999);
  const numero = entero + milesimas / 1000;
  const decimalesRedondeoN = curso === "6" ? 2 : 1;
  const factor = Math.pow(10, decimalesRedondeoN);
  const redondeado = Math.round(numero * factor) / factor;
  const nombreRedondeo = decimalesRedondeoN === 1 ? "las décimas" : "las centésimas";
  return {
    enunciado: `Redondea el número ${fmtEs(numero, 3)} a ${nombreRedondeo}.`,
    datos: [`Número: ${fmtEs(numero, 3)}`],
    operacion: `Miramos la cifra siguiente a ${nombreRedondeo}: si es 5 o más, redondeamos hacia arriba.`,
    solucion: `${fmtEs(redondeado, decimalesRedondeoN)}. El número redondeado es ${fmtEs(redondeado, decimalesRedondeoN)}.`,
  };
}

function decimalesComparar(curso) {
  const max = curso === "6" ? 9999 : 999;
  const a = roundMoney(randomInt(100, max) / 100);
  let b = roundMoney(randomInt(100, max) / 100);
  while (b === a) b = roundMoney(randomInt(100, max) / 100);
  const mayor = a > b ? a : b;
  const menor = a > b ? b : a;
  return {
    enunciado: `¿Cuál de estos dos números es mayor: ${fmtEs(a)} o ${fmtEs(b)}?`,
    datos: [`Número 1: ${fmtEs(a)}`, `Número 2: ${fmtEs(b)}`],
    operacion: `Comparamos la parte entera y luego las cifras decimales una a una.`,
    solucion: `${fmtEs(mayor)}. ${fmtEs(mayor)} es mayor que ${fmtEs(menor)}.`,
  };
}

function decimalesFraccion(curso) {
  const decimales = curso === "6" ? 2 : 1;
  const denominador = Math.pow(10, decimales);
  const numerador = randomInt(1, denominador - 1);
  const decimal = numerador / denominador;
  return {
    enunciado: `Escribe en forma decimal la fracción ${numerador}/${denominador}.`,
    datos: [`Fracción: ${numerador}/${denominador}`],
    operacion: `${numerador} ÷ ${denominador} = ${fmtEs(decimal, decimales)}`,
    solucion: `${fmtEs(decimal, decimales)}. La fracción ${numerador}/${denominador} es ${fmtEs(decimal, decimales)}.`,
  };
}

function genDecimales(curso) {
  return pick([decimalesRedondeo, decimalesComparar, decimalesFraccion])(curso);
}

function genDecimalesACS() {
  const numerador = randomInt(1, 9);
  const decimal = numerador / 10;
  return {
    enunciado: `Escribe en forma decimal la fracción ${numerador}/10.`,
    datos: [`Fracción: ${numerador}/10`],
    operacion: `${numerador} ÷ 10 = ${fmtEs(decimal, 1)}`,
    solucion: `${fmtEs(decimal, 1)}. La fracción ${numerador}/10 es ${fmtEs(decimal, 1)}.`,
  };
}

function genDecimalesAltas() {
  const entero = randomInt(1, 99);
  const decimalPart = randomInt(0, 9999);
  const numero = entero + decimalPart / 10000;
  const redondeado = Math.round(numero * 1000) / 1000;
  return {
    enunciado: `Redondea el número ${fmtEs(numero, 4)} a las milésimas.`,
    datos: [`Número: ${fmtEs(numero, 4)}`],
    operacion: `Miramos la cifra siguiente a las milésimas: si es 5 o más, redondeamos hacia arriba.`,
    solucion: `${fmtEs(redondeado, 3)}. El número redondeado es ${fmtEs(redondeado, 3)}.`,
  };
}

function decimalesMDMultiplicar(curso) {
  const precio = roundMoney(randomInt(105, curso === "6" ? 995 : 495) / 100);
  const cantidad = randomInt(2, curso === "6" ? 9 : 6);
  const total = roundMoney(precio * cantidad);
  return {
    enunciado: `Un kilo de naranjas cuesta ${fmtEs(precio)} €. ¿Cuánto cuestan ${cantidad} kilos?`,
    datos: [`Precio por kilo: ${fmtEs(precio)} €`, `Cantidad: ${cantidad} kg`],
    operacion: `${fmtEs(precio)} × ${cantidad} = ${fmtEs(total)}`,
    solucion: `${fmtEs(total)} €. Cuestan ${fmtEs(total)} €.`,
  };
}

function decimalesMDDividirPrecio(curso) {
  const precio = roundMoney(randomInt(105, curso === "6" ? 995 : 495) / 100);
  const cantidad = randomInt(2, curso === "6" ? 9 : 6);
  const total = roundMoney(precio * cantidad);
  return {
    enunciado: `${cantidad} kilos de peras cuestan ${fmtEs(total)} € en total. ¿Cuánto cuesta 1 kilo?`,
    datos: [`Precio total: ${fmtEs(total)} €`, `Cantidad: ${cantidad} kg`],
    operacion: `${fmtEs(total)} ÷ ${cantidad} = ${fmtEs(precio)}`,
    solucion: `${fmtEs(precio)} €. Un kilo cuesta ${fmtEs(precio)} €.`,
  };
}

function decimalesMDReparto(curso) {
  const personas = randomInt(2, curso === "6" ? 9 : 5);
  const porPersona = (curso === "6" ? randomInt(50, 300) : randomInt(15, 100)) / 10;
  const total = Math.round(porPersona * personas * 10) / 10;
  const unidad = pick(["litros de agua", "kilos de arroz", "metros de cuerda"]);
  return {
    enunciado: `Se reparten ${fmtEs(total, 1)} ${unidad} entre ${personas} personas a partes iguales. ¿Cuánto le toca a cada una?`,
    datos: [`Total: ${fmtEs(total, 1)} ${unidad}`, `Personas: ${personas}`],
    operacion: `${fmtEs(total, 1)} ÷ ${personas} = ${fmtEs(porPersona, 1)}`,
    solucion: `${fmtEs(porPersona, 1)} ${unidad}. Le toca ${fmtEs(porPersona, 1)} ${unidad} a cada una.`,
  };
}

function genDecimalesMD(curso) {
  return pick([decimalesMDMultiplicar, decimalesMDDividirPrecio, decimalesMDReparto])(curso);
}

function genDecimalesMDACS() {
  const precio = pick([1.5, 2.5, 0.5, 1.1, 3.2]);
  const cantidad = randomInt(2, 3);
  const total = roundMoney(precio * cantidad);
  return {
    enunciado: `Un kilo de naranjas cuesta ${fmtEs(precio)} €. ¿Cuánto cuestan ${cantidad} kilos?`,
    datos: [`Precio por kilo: ${fmtEs(precio)} €`, `Cantidad: ${cantidad} kg`],
    operacion: `${fmtEs(precio)} × ${cantidad} = ${fmtEs(total)}`,
    solucion: `${fmtEs(total)} €. Cuestan ${fmtEs(total)} €.`,
  };
}

function genDecimalesMDAltas() {
  const precio = roundMoney(randomInt(15, 60) / 10);
  const cantidad = randomInt(3, 12);
  const total = roundMoney(precio * cantidad);
  return {
    enunciado: `Se han gastado ${fmtEs(total)} € en comprar bolsas de chuches a ${fmtEs(precio)} € cada una. ¿Cuántas bolsas se han comprado?`,
    datos: [`Gasto total: ${fmtEs(total)} €`, `Precio por bolsa: ${fmtEs(precio)} €`],
    operacion: `${fmtEs(total)} ÷ ${fmtEs(precio)} = ${cantidad}`,
    solucion: `${cantidad}. Se han comprado ${cantidad} bolsas.`,
  };
}

function porcentajesDirecto(curso) {
  const precio = roundMoney(randomInt(500, curso === "6" ? 9900 : 5000) / 100);
  const pct = curso === "6" ? pick([10, 15, 20, 25, 30, 40]) : pick([10, 20, 25, 50]);
  const resultado = roundMoney((precio * pct) / 100);
  return {
    enunciado: `Calcula el ${pct}% de ${fmtEs(precio)} €.`,
    datos: [`Cantidad: ${fmtEs(precio)} €`, `Porcentaje: ${pct}%`],
    operacion: `${fmtEs(precio)} × ${pct} ÷ 100 = ${fmtEs(resultado)}`,
    solucion: `${fmtEs(resultado)} €. El ${pct}% de ${fmtEs(precio)} € es ${fmtEs(resultado)} €.`,
  };
}

function porcentajesDescuentoRecargo(curso) {
  const precio = roundMoney(randomInt(500, curso === "6" ? 9900 : 5000) / 100);
  const pct = curso === "6" ? pick([10, 15, 20, 25, 30, 40]) : pick([10, 20, 25, 50]);
  const esDescuento = Math.random() < 0.5;
  const cambio = roundMoney((precio * pct) / 100);
  const final = roundMoney(esDescuento ? precio - cambio : precio + cambio);
  const etiqueta = esDescuento ? "descuento" : "recargo";
  return {
    enunciado: `Un artículo cuesta ${fmtEs(precio)} €. Tiene un ${etiqueta} del ${pct}%. ¿Cuánto cuesta ahora?`,
    datos: [`Precio inicial: ${fmtEs(precio)} €`, `${etiqueta[0].toUpperCase()}${etiqueta.slice(1)}: ${pct}%`],
    operacion: `${pct}% de ${fmtEs(precio)} = ${fmtEs(cambio)}. ${fmtEs(precio)} ${esDescuento ? "−" : "+"} ${fmtEs(cambio)} = ${fmtEs(final)}`,
    solucion: `${fmtEs(final)} €. Ahora cuesta ${fmtEs(final)} €.`,
  };
}

function porcentajesInverso(curso) {
  const totalUnidades = randomInt(curso === "6" ? 3 : 1, curso === "6" ? 15 : 6) * 20;
  const pct = curso === "6" ? pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75]) : pick([10, 20, 25, 50]);
  const parte = (totalUnidades * pct) / 100;
  return {
    enunciado: `De un grupo de ${totalUnidades} personas, ${parte} son socios de un club deportivo. ¿Qué porcentaje del grupo son socios?`,
    datos: [`Total: ${totalUnidades}`, `Socios: ${parte}`],
    operacion: `${parte} ÷ ${totalUnidades} × 100 = ${pct}%`,
    solucion: `${pct}%. Los socios son el ${pct}% del grupo.`,
  };
}

function genPorcentajes(curso) {
  return pick([porcentajesDirecto, porcentajesDescuentoRecargo, porcentajesInverso])(curso);
}

function genPorcentajesACS() {
  const pct = pick([10, 50]);
  const cantidad = pct === 10 ? randomInt(2, 10) * 10 : randomInt(2, 20) * 2;
  const resultado = (cantidad * pct) / 100;
  return {
    enunciado: `Calcula el ${pct}% de ${cantidad}.`,
    datos: [`Cantidad: ${cantidad}`, `Porcentaje: ${pct}%`],
    operacion: pct === 10 ? `${cantidad} ÷ 10 = ${resultado}` : `${cantidad} ÷ 2 = ${resultado}`,
    solucion: `${resultado}. El ${pct}% de ${cantidad} es ${resultado}.`,
  };
}

function genPorcentajesAltas() {
  const precio = roundMoney(randomInt(1000, 9900) / 100);
  const pct1 = pick([10, 15, 20, 25, 30]);
  const pct2 = pick([5, 10, 15, 21]);
  const cambio1 = roundMoney((precio * pct1) / 100);
  const tras1 = roundMoney(precio - cambio1);
  const cambio2 = roundMoney((tras1 * pct2) / 100);
  const final = roundMoney(tras1 + cambio2);
  return {
    enunciado: `Un artículo cuesta ${fmtEs(precio)} €. Primero tiene un descuento del ${pct1}% y después se le aplica un ${pct2}% de IVA sobre el nuevo precio. ¿Cuánto cuesta finalmente?`,
    datos: [`Precio inicial: ${fmtEs(precio)} €`, `Descuento: ${pct1}%`, `IVA: ${pct2}%`],
    operacion: `${pct1}% de ${fmtEs(precio)} = ${fmtEs(cambio1)}. ${fmtEs(precio)} − ${fmtEs(cambio1)} = ${fmtEs(tras1)}. ${pct2}% de ${fmtEs(tras1)} = ${fmtEs(cambio2)}. ${fmtEs(tras1)} + ${fmtEs(cambio2)} = ${fmtEs(final)}`,
    solucion: `${fmtEs(final)} €. Cuesta finalmente ${fmtEs(final)} €.`,
  };
}

function problemasMixtosCompraGrupo(curso) {
  const isSixth = curso === "6";
  const precio = isSixth ? roundMoney(randomInt(150, 600) / 100) : randomInt(2, 9);
  const cantidad = randomInt(3, 8);
  const amigos = randomInt(2, 5);
  const cajas = amigos;
  const fmt = (n) => fmtAuto(n);
  const totalObjetos = cantidad * cajas;
  const gasto = roundMoney(precio * totalObjetos);
  const porPersona = roundMoney(gasto / amigos);
  const objeto = pick(["cromos", "canicas", "caramelos"]);
  return {
    enunciado: `Un grupo de ${amigos} amigos compra ${cajas} cajas de ${objeto}, cada una con ${cantidad} ${objeto}, a ${fmt(precio)} € cada ${objeto.slice(0, -1)}. Si se reparten el gasto total a partes iguales, ¿cuánto paga cada uno?`,
    datos: [`Cajas: ${cajas}`, `${objeto} por caja: ${cantidad}`, `Precio por ${objeto.slice(0, -1)}: ${fmt(precio)} €`, `Amigos: ${amigos}`],
    operacion: `${cajas} × ${cantidad} = ${totalObjetos} ${objeto}. ${totalObjetos} × ${fmt(precio)} = ${fmt(gasto)} €. ${fmt(gasto)} ÷ ${amigos} = ${fmt(porPersona)}`,
    solucion: `${fmt(porPersona)} € cada uno.`,
  };
}

function problemasMixtosDineroRestante(curso) {
  const isSixth = curso === "6";
  const precioObjeto = isSixth ? roundMoney(randomInt(500, 3000) / 100) : randomInt(2, 15);
  const cantidad = randomInt(2, 5);
  const amigos = randomInt(2, 4);
  const gastoTotal = roundMoney(precioObjeto * cantidad);
  const extra = isSixth ? roundMoney(randomInt(500, 5000) / 100) : randomInt(10, 40);
  const dineroInicial = roundMoney(gastoTotal + extra);
  const restante = roundMoney(dineroInicial - gastoTotal);
  const porPersona = roundMoney(restante / amigos);
  const fmt = (n) => fmtAuto(n);
  const objeto = pick(["balones", "raquetas", "mochilas"]);
  return {
    enunciado: `Un grupo de ${amigos} amigos tiene ${fmt(dineroInicial)} € en total para gastar. Compran ${cantidad} ${objeto} a ${fmt(precioObjeto)} € cada uno. Si reparten el dinero que sobra a partes iguales, ¿cuánto le toca a cada uno?`,
    datos: [`Dinero inicial: ${fmt(dineroInicial)} €`, `${objeto} comprados: ${cantidad} a ${fmt(precioObjeto)} € cada uno`, `Amigos: ${amigos}`],
    operacion: `${cantidad} × ${fmt(precioObjeto)} = ${fmt(gastoTotal)} €. ${fmt(dineroInicial)} − ${fmt(gastoTotal)} = ${fmt(restante)} €. ${fmt(restante)} ÷ ${amigos} = ${fmt(porPersona)}`,
    solucion: `${fmt(porPersona)} € cada uno.`,
  };
}

function problemasMixtosProduccion(curso) {
  const isSixth = curso === "6";
  const porDia = isSixth ? randomInt(80, 300) : randomInt(20, 80);
  const dias = randomInt(3, 6);
  const totalProducido = porDia * dias;
  const defectuosos = randomInt(5, Math.floor(totalProducido * 0.1));
  const buenos = totalProducido - defectuosos;
  const porCaja = isSixth ? randomInt(12, 30) : randomInt(5, 15);
  const cajasCompletas = Math.floor(buenos / porCaja);
  const sobran = buenos % porCaja;
  const objeto = pick(["piezas", "juguetes", "bolígrafos"]);
  return {
    enunciado: `Una fábrica produce ${porDia} ${objeto} al día durante ${dias} días. De todo lo producido, ${defectuosos} ${objeto} salen defectuosas y se descartan. El resto se empaqueta en cajas de ${porCaja} ${objeto}. ¿Cuántas cajas completas se llenan y cuántas ${objeto} sobran?`,
    datos: [`Producción: ${porDia} × ${dias} = ${totalProducido} ${objeto}`, `Defectuosas: ${defectuosos}`, `Por caja: ${porCaja}`],
    operacion: `${porDia} × ${dias} = ${totalProducido}. ${totalProducido} − ${defectuosos} = ${buenos}. ${buenos} ÷ ${porCaja} = ${cajasCompletas} y sobran ${sobran}`,
    solucion: sobran > 0 ? `${cajasCompletas} cajas completas y sobran ${sobran} ${objeto}.` : `${cajasCompletas} cajas completas (reparto exacto).`,
  };
}

function genProblemasMixtos(curso) {
  return pick([problemasMixtosCompraGrupo, problemasMixtosDineroRestante, problemasMixtosProduccion])(curso);
}

const ESCENARIOS_MEDIDAS = [
  { from: "km", to: "m", factor: 1000, frase: (c) => `Un ciclista recorre ${c} km en una etapa. ¿Cuántos m son?` },
  { from: "kg", to: "g", factor: 1000, frase: (c) => `Un camión transporta ${c} kg de mercancía. ¿Cuántos g son?` },
  { from: "L", to: "mL", factor: 1000, frase: (c) => `Un depósito contiene ${c} L de agua. ¿Cuántos mL son?` },
  { from: "m", to: "cm", factor: 100, frase: (c) => `Un rollo de tela mide ${c} m de largo. ¿Cuántos cm son?` },
];

function medidasConversion(curso) {
  const conv = pick(ESCENARIOS_MEDIDAS);
  const cantidad = curso === "6" ? roundMoney(randomInt(105, 4995) / 100) : randomInt(2, 12);
  const resultado = roundMoney(cantidad * conv.factor);
  const fmt = (n) => fmtAuto(n);
  return {
    enunciado: conv.frase(fmt(cantidad)),
    datos: [`Cantidad: ${fmt(cantidad)} ${conv.from}`, `1 ${conv.from} = ${conv.factor} ${conv.to}`],
    operacion: `${fmt(cantidad)} × ${conv.factor} = ${fmt(resultado)}`,
    solucion: `${fmt(resultado)} ${conv.to}. Son ${fmt(resultado)} ${conv.to}.`,
  };
}

const ESCENARIOS_MEDIDAS_MIXTA = [
  { mayor: "km", menor: "m", factor: 1000, frase: (pM, pm) => `Un ciclista recorre ${pM} km y ${pm} m en una etapa. ¿Cuántos m recorre en total?` },
  { mayor: "kg", menor: "g", factor: 1000, frase: (pM, pm) => `Un paquete pesa ${pM} kg y ${pm} g. ¿Cuántos g pesa en total?` },
  { mayor: "L", menor: "mL", factor: 1000, frase: (pM, pm) => `Una garrafa contiene ${pM} L y ${pm} mL. ¿Cuántos mL contiene en total?` },
  { mayor: "m", menor: "cm", factor: 100, frase: (pM, pm) => `Una cuerda mide ${pM} m y ${pm} cm. ¿Cuántos cm mide en total?` },
];

function medidasSumaMixta(curso) {
  const esc = pick(ESCENARIOS_MEDIDAS_MIXTA);
  const partesMayor = curso === "6" ? randomInt(2, 20) : randomInt(1, 8);
  const partesMenor = randomInt(1, esc.factor - 1);
  const totalMayorEnMenor = partesMayor * esc.factor;
  const totalEnMenor = totalMayorEnMenor + partesMenor;
  return {
    enunciado: esc.frase(partesMayor, partesMenor),
    datos: [`${partesMayor} ${esc.mayor}`, `${partesMenor} ${esc.menor}`, `1 ${esc.mayor} = ${esc.factor} ${esc.menor}`],
    operacion: `${partesMayor} × ${esc.factor} = ${totalMayorEnMenor}. ${totalMayorEnMenor} + ${partesMenor} = ${totalEnMenor}`,
    solucion: `${totalEnMenor} ${esc.menor}. En total son ${totalEnMenor} ${esc.menor}.`,
  };
}

const ESCENARIOS_MEDIDAS_COMPARAR = [
  { unidadA: "km", unidadB: "m", factor: 1000 },
  { unidadA: "kg", unidadB: "g", factor: 1000 },
  { unidadA: "L", unidadB: "mL", factor: 1000 },
  { unidadA: "m", unidadB: "cm", factor: 100 },
];

function medidasComparar(curso) {
  const esc = pick(ESCENARIOS_MEDIDAS_COMPARAR);
  const cantidadA = curso === "6" ? randomInt(1, 8) : randomInt(1, 4);
  const cantidadBEnMenor = cantidadA * esc.factor;
  const rangeMax = Math.max(cantidadBEnMenor * 2, 20);
  let cantidadB = randomInt(1, rangeMax);
  while (cantidadB === cantidadBEnMenor) cantidadB = randomInt(1, rangeMax);
  const aEsMayor = cantidadBEnMenor > cantidadB;
  const mayorTexto = aEsMayor ? `${cantidadA} ${esc.unidadA}` : `${cantidadB} ${esc.unidadB}`;
  return {
    enunciado: `¿Qué cantidad es mayor: ${cantidadA} ${esc.unidadA} o ${cantidadB} ${esc.unidadB}?`,
    datos: [`${cantidadA} ${esc.unidadA} = ${cantidadBEnMenor} ${esc.unidadB}`, `${cantidadB} ${esc.unidadB}`],
    operacion: `${cantidadA} ${esc.unidadA} = ${cantidadA} × ${esc.factor} = ${cantidadBEnMenor} ${esc.unidadB}. Comparamos ${cantidadBEnMenor} ${esc.unidadB} con ${cantidadB} ${esc.unidadB}.`,
    solucion: `${mayorTexto}. ${mayorTexto} es mayor.`,
  };
}

function genMedidas(curso) {
  return pick([medidasConversion, medidasSumaMixta, medidasComparar])(curso);
}

function genMedidasACS() {
  const km = randomInt(2, 9);
  return {
    enunciado: `Un coche recorre ${km} km. ¿Cuántos metros son?`,
    datos: [`Distancia: ${km} km`],
    operacion: `${km} × 1000 = ${km * 1000}`,
    solucion: `${km * 1000} m. Son ${km * 1000} metros.`,
  };
}

function genMedidasAltas() {
  const km = randomInt(1, 8);
  const m = randomInt(1, 999);
  const totalM = km * 1000 + m;
  const totalCm = totalM * 100;
  return {
    enunciado: `Un ciclista recorre ${km} km y ${m} m en una etapa. ¿Cuántos cm ha recorrido en total?`,
    datos: [`${km} km`, `${m} m`, `1 km = 1000 m`, `1 m = 100 cm`],
    operacion: `${km} × 1000 = ${km * 1000} m. ${km * 1000} + ${m} = ${totalM} m. ${totalM} × 100 = ${totalCm} cm`,
    solucion: `${totalCm} cm. Ha recorrido ${totalCm} cm en total.`,
  };
}

function areasRectangulo(curso) {
  const base = randomInt(4, curso === "6" ? 25 : 15);
  const altura = randomInt(3, curso === "6" ? 20 : 12);
  const area = base * altura;
  const perimetro = 2 * (base + altura);
  return {
    enunciado: `Un terreno rectangular mide ${base} m de largo y ${altura} m de ancho. ¿Cuál es su área y su perímetro?`,
    datos: [`Largo: ${base} m`, `Ancho: ${altura} m`],
    operacion: `Área: ${base} × ${altura} = ${area}. Perímetro: 2 × (${base} + ${altura}) = ${perimetro}`,
    solucion: `Área = ${area} m², Perímetro = ${perimetro} m.`,
  };
}

function areasCuadrado(curso) {
  const lado = randomInt(3, curso === "6" ? 30 : 15);
  const area = lado * lado;
  const perimetro = 4 * lado;
  return {
    enunciado: `Una parcela cuadrada tiene ${lado} m de lado. ¿Cuál es su área y su perímetro?`,
    datos: [`Lado: ${lado} m`],
    operacion: `Área: ${lado} × ${lado} = ${area}. Perímetro: 4 × ${lado} = ${perimetro}`,
    solucion: `Área = ${area} m², Perímetro = ${perimetro} m.`,
  };
}

function areasTriangulo(curso) {
  const base = randomInt(4, curso === "6" ? 25 : 15);
  const altura = randomInt(3, curso === "6" ? 20 : 12);
  const area = (base * altura) / 2;
  return {
    enunciado: `Un terreno triangular tiene una base de ${base} m y una altura de ${altura} m. ¿Cuál es su área?`,
    datos: [`Base: ${base} m`, `Altura: ${altura} m`],
    operacion: `(${base} × ${altura}) ÷ 2 = ${fmtAuto(area)}`,
    solucion: `${fmtAuto(area)} m². El área del terreno es ${fmtAuto(area)} m².`,
  };
}

function genAreas(curso) {
  const variantes = curso === "6" ? [areasRectangulo, areasCuadrado, areasTriangulo] : [areasRectangulo, areasCuadrado];
  return pick(variantes)(curso);
}

function genAreasACS() {
  if (Math.random() < 0.5) {
    const lado = randomInt(3, 6);
    const area = lado * lado;
    return {
      enunciado: `Una parcela cuadrada tiene ${lado} m de lado. ¿Cuál es su área?`,
      datos: [`Lado: ${lado} m`],
      operacion: `${lado} × ${lado} = ${area}`,
      solucion: `${area} m². El área es ${area} m².`,
    };
  }
  const base = randomInt(4, 7);
  const altura = randomInt(2, 4);
  const area = base * altura;
  return {
    enunciado: `Un terreno rectangular mide ${base} m de largo y ${altura} m de ancho. ¿Cuál es su área?`,
    datos: [`Largo: ${base} m`, `Ancho: ${altura} m`],
    operacion: `${base} × ${altura} = ${area}`,
    solucion: `${area} m². El área es ${area} m².`,
  };
}

function genAreasAltas() {
  const baseGrande = randomInt(15, 30);
  const alturaGrande = randomInt(10, 20);
  const baseChica = randomInt(3, Math.floor(baseGrande / 2));
  const alturaChica = randomInt(3, Math.floor(alturaGrande / 2));
  const areaGrande = baseGrande * alturaGrande;
  const areaChica = baseChica * alturaChica;
  const areaTotal = areaGrande - areaChica;
  return {
    enunciado: `Un terreno rectangular mide ${baseGrande} m de largo y ${alturaGrande} m de ancho, pero le falta una esquina rectangular de ${baseChica} m por ${alturaChica} m (no forma parte del terreno). ¿Cuál es el área real del terreno?`,
    datos: [`Rectángulo grande: ${baseGrande} × ${alturaGrande}`, `Esquina que falta: ${baseChica} × ${alturaChica}`],
    operacion: `${baseGrande} × ${alturaGrande} = ${areaGrande}. ${baseChica} × ${alturaChica} = ${areaChica}. ${areaGrande} − ${areaChica} = ${areaTotal}`,
    solucion: `${areaTotal} m². El área real del terreno es ${areaTotal} m².`,
  };
}

function circunferenciaLongitud(curso) {
  const radio = randomInt(2, curso === "6" ? 15 : 10);
  const PI = 3.14;
  const longitud = roundMoney(2 * PI * radio);
  return {
    enunciado: `Una piscina circular tiene un radio de ${radio} m. ¿Cuál es la longitud de su circunferencia? (usa π ≈ 3,14)`,
    datos: [`Radio: ${radio} m`, `π ≈ 3,14`],
    operacion: `2 × π × ${radio} = 2 × 3,14 × ${radio} = ${fmtEs(longitud)}`,
    solucion: `${fmtEs(longitud)} m. La circunferencia mide ${fmtEs(longitud)} m.`,
  };
}

function circunferenciaArea(curso) {
  const radio = randomInt(2, curso === "6" ? 15 : 10);
  const PI = 3.14;
  const area = roundMoney(PI * radio * radio);
  return {
    enunciado: `Una piscina circular tiene un radio de ${radio} m. ¿Cuál es su área? (usa π ≈ 3,14)`,
    datos: [`Radio: ${radio} m`, `π ≈ 3,14`],
    operacion: `π × ${radio}² = 3,14 × ${radio * radio} = ${fmtEs(area)}`,
    solucion: `${fmtEs(area)} m². El área de la piscina es ${fmtEs(area)} m².`,
  };
}

function circunferenciaDesdeDiametro(curso) {
  const radio = randomInt(2, curso === "6" ? 15 : 10);
  const diametro = radio * 2;
  const PI = 3.14;
  const longitud = roundMoney(PI * diametro);
  return {
    enunciado: `Una noria circular tiene un diámetro de ${diametro} m. ¿Cuál es la longitud de su circunferencia? (usa π ≈ 3,14)`,
    datos: [`Diámetro: ${diametro} m`, `π ≈ 3,14`],
    operacion: `Radio = ${diametro} ÷ 2 = ${radio}. Longitud = 2 × π × ${radio} = ${fmtEs(longitud)}`,
    solucion: `${fmtEs(longitud)} m. La circunferencia mide ${fmtEs(longitud)} m.`,
  };
}

function genCircunferencia(curso) {
  const variantes = curso === "6" ? [circunferenciaLongitud, circunferenciaArea, circunferenciaDesdeDiametro] : [circunferenciaLongitud, circunferenciaDesdeDiametro];
  return pick(variantes)(curso);
}

function genCircunferenciaACS() {
  const radio = randomInt(2, 10);
  const diametro = radio * 2;
  if (Math.random() < 0.5) {
    return {
      enunciado: `Una rueda circular tiene un radio de ${radio} cm. ¿Cuál es su diámetro?`,
      datos: [`Radio: ${radio} cm`],
      operacion: `${radio} × 2 = ${diametro}`,
      solucion: `${diametro} cm. El diámetro mide ${diametro} cm.`,
    };
  }
  return {
    enunciado: `Una rueda circular tiene un diámetro de ${diametro} cm. ¿Cuál es su radio?`,
    datos: [`Diámetro: ${diametro} cm`],
    operacion: `${diametro} ÷ 2 = ${radio}`,
    solucion: `${radio} cm. El radio mide ${radio} cm.`,
  };
}

function genCircunferenciaAltas() {
  const radio = randomInt(10, 30);
  const PI = 3.14;
  const longitud = roundMoney(2 * PI * radio);
  const area = roundMoney(PI * radio * radio);
  return {
    enunciado: `Una piscina circular tiene un radio de ${radio} m. Calcula la longitud de su circunferencia y el área del círculo (usa π ≈ 3,14).`,
    datos: [`Radio: ${radio} m`, `π ≈ 3,14`],
    operacion: `Longitud: 2 × 3,14 × ${radio} = ${fmtEs(longitud)}. Área: 3,14 × ${radio}² = 3,14 × ${radio * radio} = ${fmtEs(area)}`,
    solucion: `Longitud = ${fmtEs(longitud)} m, Área = ${fmtEs(area)} m².`,
  };
}

function proporcionalidadPrecio(curso) {
  const a = randomInt(2, 6);
  const precioUnidad = curso === "6" ? roundMoney(randomInt(105, 995) / 100) : randomInt(2, 9);
  const totalA = roundMoney(a * precioUnidad);
  const b = randomInt(a + 2, a + (curso === "6" ? 15 : 8));
  const totalB = roundMoney(b * precioUnidad);
  const fmt = (n) => fmtAuto(n);
  const objeto = pick(["cuadernos", "bolígrafos", "libretas"]);
  return {
    enunciado: `Si ${a} ${objeto} cuestan ${fmt(totalA)} €, ¿cuánto cuestan ${b} ${objeto}?`,
    datos: [`${a} ${objeto} → ${fmt(totalA)} €`, `${b} ${objeto} → ?`],
    operacion: `${fmt(totalA)} ÷ ${a} = ${fmt(precioUnidad)} (precio de 1). ${fmt(precioUnidad)} × ${b} = ${fmt(totalB)}`,
    solucion: `${fmt(totalB)} €. Cuestan ${fmt(totalB)} €.`,
  };
}

function proporcionalidadEscala(curso) {
  const escala = curso === "6" ? pick([50, 100, 200, 500, 1000]) : pick([10, 100]);
  const medidaPlano = curso === "6" ? randomInt(2, 40) : randomInt(2, 20);
  const medidaReal = medidaPlano * escala;
  return {
    enunciado: `En un plano con escala 1:${escala}, una habitación mide ${medidaPlano} cm. ¿Cuánto mide en la realidad (en cm)?`,
    datos: [`Escala: 1:${escala}`, `Medida en el plano: ${medidaPlano} cm`],
    operacion: `${medidaPlano} × ${escala} = ${medidaReal}`,
    solucion: `${medidaReal} cm. En la realidad mide ${medidaReal} cm.`,
  };
}

function proporcionalidadVelocidad(curso) {
  const velocidad = curso === "6" ? randomInt(40, 120) : randomInt(20, 60);
  const horas = randomInt(2, curso === "6" ? 8 : 5);
  const distancia = velocidad * horas;
  return {
    enunciado: `Un coche circula a una velocidad constante de ${velocidad} km/h. ¿Cuántos km recorrerá en ${horas} horas?`,
    datos: [`Velocidad: ${velocidad} km/h`, `Tiempo: ${horas} horas`],
    operacion: `${velocidad} × ${horas} = ${distancia}`,
    solucion: `${distancia} km. Recorrerá ${distancia} km.`,
  };
}

function genProporcionalidad(curso) {
  return pick([proporcionalidadPrecio, proporcionalidadEscala, proporcionalidadVelocidad])(curso);
}

function genProporcionalidadACS() {
  const a = randomInt(2, 4);
  const precioUnidad = randomInt(2, 5);
  const totalA = a * precioUnidad;
  const b = a * 2;
  const totalB = b * precioUnidad;
  const objeto = pick(["cuadernos", "bolígrafos", "libretas"]);
  return {
    enunciado: `Si ${a} ${objeto} cuestan ${totalA} €, ¿cuánto cuestan ${b} ${objeto} (el doble)?`,
    datos: [`${a} ${objeto} → ${totalA} €`, `${b} ${objeto} → ?`],
    operacion: `El doble de ${a} es ${b}, así que el precio también se duplica: ${totalA} × 2 = ${totalB}`,
    solucion: `${totalB} €. Cuestan ${totalB} €.`,
  };
}

function genProporcionalidadAltas() {
  const obreros1 = randomInt(2, 6);
  const obreros2 = randomInt(obreros1 + 2, obreros1 + 10);
  const k = randomInt(2, 8);
  const trabajoTotal = obreros1 * obreros2 * k;
  const dias1 = trabajoTotal / obreros1;
  const dias2 = trabajoTotal / obreros2;
  return {
    enunciado: `${obreros1} obreros tardan ${dias1} días en construir un muro. Si se contratan ${obreros2} obreros (trabajando todos al mismo ritmo), ¿cuántos días tardarán en construir un muro igual?`,
    datos: [`${obreros1} obreros → ${dias1} días`, `${obreros2} obreros → ?`],
    operacion: `Trabajo total: ${obreros1} × ${dias1} = ${trabajoTotal} (obreros × días). ${trabajoTotal} ÷ ${obreros2} = ${dias2}`,
    solucion: `${dias2} días. Tardarán ${dias2} días.`,
  };
}

const ESCENARIOS_ESTADISTICA = [
  { contexto: "goles marcados en", marco: "partidos" },
  { contexto: "libros leídos en", marco: "meses" },
  { contexto: "puntos obtenidos en", marco: "partidos" },
];

function estadisticaMediaMediana(curso) {
  const n = curso === "6" ? 6 : 5;
  const valores = Array.from({ length: n }, () => randomInt(1, 10));
  const suma = valores.reduce((acc, v) => acc + v, 0);
  const media = fmtTrim(suma / n);
  const ordenados = [...valores].sort((a, b) => a - b);
  const mediana =
    n % 2 === 0 ? fmtTrim((ordenados[n / 2 - 1] + ordenados[n / 2]) / 2) : String(ordenados[(n - 1) / 2]);
  const escenario = pick(ESCENARIOS_ESTADISTICA);
  if (curso === "6") {
    return {
      enunciado: `Estos son los ${escenario.contexto} ${n} ${escenario.marco}: ${valores.join(", ")}. Calcula la media y la mediana.`,
      datos: [`Valores: ${valores.join(", ")}`],
      operacion: `Media: (${valores.join(" + ")}) ÷ ${n} = ${suma} ÷ ${n} = ${media}. Mediana: ordenamos (${ordenados.join(", ")}) y tomamos el valor central.`,
      solucion: `Media = ${media}, Mediana = ${mediana}.`,
    };
  }
  return {
    enunciado: `Estos son los ${escenario.contexto} ${n} ${escenario.marco}: ${valores.join(", ")}. Calcula la media.`,
    datos: [`Valores: ${valores.join(", ")}`],
    operacion: `(${valores.join(" + ")}) ÷ ${n} = ${suma} ÷ ${n} = ${media}`,
    solucion: `${media}. La media es ${media}.`,
  };
}

function estadisticaRango(curso) {
  const n = curso === "6" ? 7 : 5;
  const valores = Array.from({ length: n }, () => randomInt(1, curso === "6" ? 50 : 20));
  const maximo = Math.max(...valores);
  const minimo = Math.min(...valores);
  const rango = maximo - minimo;
  const escenario = pick(ESCENARIOS_ESTADISTICA);
  return {
    enunciado: `Estos son ${escenario.contexto} ${n} ${escenario.marco}: ${valores.join(", ")}. Calcula el rango (diferencia entre el valor máximo y el mínimo).`,
    datos: [`Valores: ${valores.join(", ")}`],
    operacion: `Máximo: ${maximo}. Mínimo: ${minimo}. Rango: ${maximo} − ${minimo} = ${rango}`,
    solucion: `${rango}. El rango es ${rango}.`,
  };
}

function estadisticaModa(curso) {
  const n = curso === "6" ? 8 : 6;
  const modaValor = randomInt(1, 6);
  const otros = [1, 2, 3, 4, 5, 6].filter((v) => v !== modaValor);
  const valores = [modaValor, modaValor, modaValor];
  for (let i = 0; valores.length < n; i++) {
    valores.push(otros[i % otros.length]);
  }
  for (let i = valores.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [valores[i], valores[j]] = [valores[j], valores[i]];
  }
  const vecesModa = valores.filter((v) => v === modaValor).length;
  return {
    enunciado: `Estos son los goles marcados por un equipo en ${n} partidos: ${valores.join(", ")}. Calcula la moda (el valor que más se repite).`,
    datos: [`Valores: ${valores.join(", ")}`],
    operacion: `Contamos cuántas veces se repite cada valor. El ${modaValor} aparece ${vecesModa} veces, más que los demás.`,
    solucion: `${modaValor}. La moda es ${modaValor}.`,
  };
}

function genEstadistica(curso) {
  return pick([estadisticaMediaMediana, estadisticaRango, estadisticaModa])(curso);
}

function genEstadisticaACS() {
  return estadisticaModa("5");
}

function genEstadisticaAltas() {
  const n = 7;
  const valores = Array.from({ length: n }, () => randomInt(1, 12));
  const suma = valores.reduce((acc, v) => acc + v, 0);
  const media = fmtTrim(suma / n);
  const ordenados = [...valores].sort((a, b) => a - b);
  const mediana = String(ordenados[(n - 1) / 2]);
  const maximo = Math.max(...valores);
  const minimo = Math.min(...valores);
  const rango = maximo - minimo;
  const counts = {};
  valores.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
  const moda = Object.keys(counts).reduce((a, b) => (counts[a] >= counts[b] ? a : b));
  const escenario = pick(ESCENARIOS_ESTADISTICA);
  return {
    enunciado: `Estos son los ${escenario.contexto} ${n} ${escenario.marco}: ${valores.join(", ")}. Calcula la media, la mediana, la moda y el rango.`,
    datos: [`Valores: ${valores.join(", ")}`],
    operacion: `Media: (${valores.join(" + ")}) ÷ ${n} = ${media}. Mediana: ordenamos (${ordenados.join(", ")}) y tomamos el central. Moda: el valor que más se repite. Rango: ${maximo} − ${minimo} = ${rango}`,
    solucion: `Media = ${media}, Mediana = ${mediana}, Moda = ${moda}, Rango = ${rango}.`,
  };
}

function angulosComplementario() {
  const a = randomInt(10, 80);
  const b = 90 - a;
  return {
    enunciado: `Dos ángulos son complementarios (suman 90°). Uno de ellos mide ${a}°. ¿Cuánto mide el otro?`,
    datos: [`Ángulo 1: ${a}°`, `Suma total: 90°`],
    operacion: `90 − ${a} = ${b}`,
    solucion: `${b}°. El otro ángulo mide ${b}°.`,
  };
}

function angulosSuplementario() {
  const a = randomInt(20, 160);
  const b = 180 - a;
  return {
    enunciado: `Dos ángulos son suplementarios (suman 180°). Uno de ellos mide ${a}°. ¿Cuánto mide el otro?`,
    datos: [`Ángulo 1: ${a}°`, `Suma total: 180°`],
    operacion: `180 − ${a} = ${b}`,
    solucion: `${b}°. El otro ángulo mide ${b}°.`,
  };
}

function angulosClasificar() {
  const angulo = pick([30, 45, 60, 90, 120, 135, 150, 180]);
  let tipo;
  if (angulo < 90) tipo = "Agudo";
  else if (angulo === 90) tipo = "Recto";
  else if (angulo < 180) tipo = "Obtuso";
  else tipo = "Llano";
  return {
    enunciado: `Clasifica un ángulo que mide ${angulo}°: ¿es agudo, recto, obtuso o llano?`,
    datos: [`Ángulo: ${angulo}°`],
    operacion: `Comparamos ${angulo}° con 90° y 180°.`,
    solucion: `${tipo}. Es un ángulo ${tipo.toLowerCase()}.`,
  };
}

function genAngulos() {
  return pick([angulosComplementario, angulosSuplementario, angulosClasificar])();
}

function genAngulosACS() {
  return angulosClasificar();
}

function genAngulosAltas() {
  const comp = randomInt(10, 70);
  const otro = 90 - comp;
  const tipo = otro < 90 ? "agudo" : otro === 90 ? "recto" : "obtuso";
  return {
    enunciado: `Un ángulo mide ${comp}°. Calcula su complementario y di qué tipo de ángulo es.`,
    datos: [`Ángulo: ${comp}°`],
    operacion: `90 − ${comp} = ${otro}. Comparamos ${otro}° con 90° y 180°.`,
    solucion: `${otro}°, un ángulo ${tipo}.`,
  };
}

function coordenadasTraslacion() {
  const x = randomInt(-8, 8);
  const y = randomInt(-8, 8);
  const dx = randomInt(-5, 5) || 2;
  const dy = randomInt(-5, 5) || -3;
  const nx = x + dx;
  const ny = y + dy;
  return {
    enunciado: `Un punto A(${x}, ${y}) se traslada según el vector (${dx >= 0 ? "+" : ""}${dx}, ${dy >= 0 ? "+" : ""}${dy}). ¿Cuáles son las coordenadas del punto B?`,
    datos: [`Punto A: (${x}, ${y})`, `Vector: (${dx}, ${dy})`],
    operacion: `(${x} ${dx >= 0 ? "+" : ""}${dx}, ${y} ${dy >= 0 ? "+" : ""}${dy}) = (${nx}, ${ny})`,
    solucion: `(${nx}, ${ny}). El punto B tiene coordenadas (${nx}, ${ny}).`,
  };
}

function coordenadasSimetria() {
  const x = randomInt(1, 9);
  const y = randomInt(1, 9);
  const eje = pick(["X", "Y"]);
  const simX = eje === "X" ? x : -x;
  const simY = eje === "X" ? -y : y;
  return {
    enunciado: `Un punto A(${x}, ${y}) se refleja respecto al eje ${eje}. ¿Cuáles son las coordenadas de su simétrico?`,
    datos: [`Punto A: (${x}, ${y})`, `Eje de simetría: ${eje}`],
    operacion: eje === "X" ? `(x, y) → (x, −y) = (${simX}, ${simY})` : `(x, y) → (−x, y) = (${simX}, ${simY})`,
    solucion: `(${simX}, ${simY}).`,
  };
}

function coordenadasEscala(curso) {
  const base = randomInt(2, 6);
  const altura = randomInt(2, 6);
  const escala = curso === "6" ? randomInt(2, 4) : 2;
  const nuevaBase = base * escala;
  const nuevaAltura = altura * escala;
  return {
    enunciado: `Un rectángulo de ${base} × ${altura} cm se amplía a escala ×${escala}. ¿Cuáles son sus nuevas dimensiones?`,
    datos: [`Rectángulo original: ${base} × ${altura} cm`, `Escala: ×${escala}`],
    operacion: `${base} × ${escala} = ${nuevaBase}. ${altura} × ${escala} = ${nuevaAltura}`,
    solucion: `${nuevaBase} × ${nuevaAltura} cm.`,
  };
}

function genCoordenadas(curso) {
  const variantes = curso === "6" ? [coordenadasTraslacion, coordenadasSimetria, coordenadasEscala] : [coordenadasTraslacion, coordenadasSimetria];
  return pick(variantes)(curso);
}

function genCoordenadasACS() {
  const x = randomInt(1, 6);
  const y = randomInt(1, 6);
  return {
    enunciado: `¿Cuáles son las coordenadas del punto A, que está ${x} pasos a la derecha y ${y} pasos hacia arriba del origen?`,
    datos: [`Pasos a la derecha: ${x}`, `Pasos hacia arriba: ${y}`],
    operacion: `El punto A tiene de coordenada x = ${x} e y = ${y}`,
    solucion: `(${x}, ${y}).`,
  };
}

function genCoordenadasAltas() {
  const x = randomInt(1, 6);
  const y = randomInt(1, 6);
  const dx = randomInt(1, 4);
  const dy = randomInt(1, 4);
  const tx = x + dx;
  const ty = y + dy;
  const simX = -tx;
  const simY = ty;
  return {
    enunciado: `Un punto A(${x}, ${y}) se traslada según el vector (+${dx}, +${dy}) para obtener el punto B. Después, B se refleja respecto al eje Y para obtener el punto C. ¿Cuáles son las coordenadas de C?`,
    datos: [`Punto A: (${x}, ${y})`, `Vector: (+${dx}, +${dy})`],
    operacion: `B = (${x}+${dx}, ${y}+${dy}) = (${tx}, ${ty}). C = (−${tx}, ${ty}) = (${simX}, ${simY})`,
    solucion: `(${simX}, ${simY}).`,
  };
}

const CUERPOS_POLIEDROS = [
  { nombre: "cubo", caras: 6, aristas: 12, vertices: 8 },
  { nombre: "prisma triangular", caras: 5, aristas: 9, vertices: 6 },
  { nombre: "pirámide cuadrangular", caras: 5, aristas: 8, vertices: 5 },
];

const CUERPOS_OBJETOS = [
  { desc: "un dado", nombre: "Cubo" },
  { desc: "una pelota", nombre: "Esfera" },
  { desc: "una lata de refresco", nombre: "Cilindro" },
  { desc: "un cucurucho de helado", nombre: "Cono" },
];

function cuerposEuler() {
  const cuerpo = pick(CUERPOS_POLIEDROS);
  return {
    enunciado: `Un poliedro (${cuerpo.nombre}) tiene ${cuerpo.caras} caras y ${cuerpo.aristas} aristas. Según la fórmula de Euler (Caras + Vértices = Aristas + 2), ¿cuántos vértices tiene?`,
    datos: [`Caras: ${cuerpo.caras}`, `Aristas: ${cuerpo.aristas}`],
    operacion: `${cuerpo.caras} + V = ${cuerpo.aristas} + 2 → V = ${cuerpo.aristas + 2 - cuerpo.caras}`,
    solucion: `${cuerpo.vertices} vértices.`,
  };
}

function cuerposIdentificar() {
  const obj = pick(CUERPOS_OBJETOS);
  return {
    enunciado: `¿Qué cuerpo geométrico recuerda la forma de ${obj.desc}?`,
    datos: [`Objeto: ${obj.desc}`],
    operacion: `Comparamos su forma con los cuerpos geométricos conocidos.`,
    solucion: `${obj.nombre}.`,
  };
}

function cuerposCaracteristicas() {
  const cuerpo = pick(CUERPOS_POLIEDROS);
  return {
    enunciado: `¿Cuántas caras, aristas y vértices tiene un ${cuerpo.nombre}?`,
    datos: [`Cuerpo: ${cuerpo.nombre}`],
    operacion: `Contamos sus caras planas, sus aristas y sus vértices.`,
    solucion: `${cuerpo.caras} caras, ${cuerpo.aristas} aristas y ${cuerpo.vertices} vértices.`,
  };
}

function genCuerposGeometricos() {
  return pick([cuerposEuler, cuerposIdentificar, cuerposCaracteristicas])();
}

function genCuerposGeometricosACS() {
  return cuerposIdentificar();
}

function genCuerposGeometricosAltas() {
  return cuerposEuler();
}

function numerosGrandesRedondeo(curso) {
  const n = curso === "6" ? randomInt(1000000, 9999999) : randomInt(100000, 999999);
  const factor = curso === "6" ? 1000000 : 10000;
  const unidadNombre = curso === "6" ? "millón" : "decena de millar";
  const redondeado = Math.round(n / factor) * factor;
  const contexto = curso === "6" ? `Una empresa factura ${n} €` : `Un estadio tiene ${n} espectadores`;
  return {
    enunciado: `${contexto}. Aproxima esa cifra a la ${unidadNombre} más cercana.`,
    datos: [`Número: ${n}`],
    operacion: `Miramos la cifra siguiente a la ${unidadNombre}: si es 5 o más, redondeamos hacia arriba.`,
    solucion: `${redondeado}. El número redondeado es ${redondeado}.`,
  };
}

function numerosGrandesValorPosicional(curso) {
  const n = curso === "6" ? randomInt(100000000, 999999999) : randomInt(100000, 999999);
  const posiciones =
    curso === "6"
      ? ["unidad", "decena", "centena", "unidad de millar", "decena de millar", "centena de millar", "unidad de millón", "decena de millón", "centena de millón"]
      : ["unidad", "decena", "centena", "unidad de millar", "decena de millar", "centena de millar"];
  const digitos = String(n).split("").reverse();
  const idx = randomInt(0, posiciones.length - 1);
  return {
    enunciado: `En el número ${n}, ¿qué cifra ocupa la posición de las ${posiciones[idx]}?`,
    datos: [`Número: ${n}`],
    operacion: `Contamos las posiciones desde la derecha (unidades, decenas, centenas...).`,
    solucion: `${digitos[idx]}. La cifra de las ${posiciones[idx]} es ${digitos[idx]}.`,
  };
}

function numerosGrandesComparar(curso) {
  const max = curso === "6" ? 999999999 : 999999;
  const min = curso === "6" ? 100000000 : 100000;
  const a = randomInt(min, max);
  let b = randomInt(min, max);
  while (b === a) b = randomInt(min, max);
  const mayor = Math.max(a, b);
  const menor = Math.min(a, b);
  return {
    enunciado: `¿Cuál de estos dos números es mayor: ${a} o ${b}?`,
    datos: [`Número 1: ${a}`, `Número 2: ${b}`],
    operacion: `Comparamos cifra a cifra empezando por la izquierda.`,
    solucion: `${mayor}. ${mayor} es mayor que ${menor}.`,
  };
}

function genNumerosGrandes(curso) {
  return pick([numerosGrandesRedondeo, numerosGrandesValorPosicional, numerosGrandesComparar])(curso);
}

function genNumerosGrandesACS() {
  const n = randomInt(100, 999);
  const posiciones = ["unidad", "decena", "centena"];
  const digitos = String(n).split("").reverse();
  const idx = randomInt(0, 2);
  return {
    enunciado: `En el número ${n}, ¿qué cifra ocupa la posición de las ${posiciones[idx]}?`,
    datos: [`Número: ${n}`],
    operacion: `Contamos las posiciones desde la derecha.`,
    solucion: `${digitos[idx]}.`,
  };
}

function genNumerosGrandesAltas() {
  const n = randomInt(100000000, 999999999);
  const redondeado = Math.round(n / 1000000) * 1000000;
  return {
    enunciado: `Una empresa factura ${n} €. Redondea esa cifra al millón más cercano.`,
    datos: [`Número: ${n}`],
    operacion: `Miramos la cifra de las centenas de millar: si es 5 o más, redondeamos hacia arriba.`,
    solucion: `${redondeado} €.`,
  };
}

function probabilidadCalcular() {
  const rojas = randomInt(2, 6);
  const azules = randomInt(2, 6);
  const total = rojas + azules;
  const g = gcd(rojas, total);
  const numSimpl = rojas / g;
  const denSimpl = total / g;
  return {
    enunciado: `Una bolsa tiene ${rojas} bolas rojas y ${azules} bolas azules. ¿Cuál es la probabilidad de sacar una bola roja?`,
    datos: [`Bolas rojas: ${rojas}`, `Bolas azules: ${azules}`, `Total: ${total}`],
    operacion: `Casos favorables ÷ casos totales = ${rojas}/${total}${g > 1 ? ` = ${numSimpl}/${denSimpl}` : ""}`,
    solucion: g > 1 ? `${numSimpl}/${denSimpl}.` : `${rojas}/${total}.`,
  };
}

const PROBABILIDAD_SUCESOS = [
  { texto: "Al lanzar un dado normal, sacar un número menor que 7", tipo: "Seguro" },
  { texto: "Al lanzar un dado normal, sacar un 8", tipo: "Imposible" },
  { texto: "Al lanzar una moneda, que salga cara", tipo: "Posible" },
  { texto: "Al sacar una carta de la baraja, que sea una figura", tipo: "Posible" },
  { texto: "Mañana el sol saldrá por el este", tipo: "Seguro" },
  { texto: "Al lanzar un dado, sacar un número negativo", tipo: "Imposible" },
];

function probabilidadClasificar() {
  const s = pick(PROBABILIDAD_SUCESOS);
  return {
    enunciado: `Clasifica este suceso como seguro, posible o imposible: "${s.texto}".`,
    datos: [`Suceso: ${s.texto}`],
    operacion: `Pensamos si el suceso ocurre siempre, a veces o nunca.`,
    solucion: `${s.tipo}.`,
  };
}

function probabilidadComparar() {
  const bolsaARojas = randomInt(3, 6);
  const bolsaAAzules = randomInt(1, 3);
  const bolsaBRojas = randomInt(1, 3);
  const bolsaBAzules = randomInt(3, 6);
  const totalA = bolsaARojas + bolsaAAzules;
  const totalB = bolsaBRojas + bolsaBAzules;
  const mayor = bolsaARojas / totalA > bolsaBRojas / totalB ? "A" : "B";
  return {
    enunciado: `Bolsa A: ${bolsaARojas} bolas rojas y ${bolsaAAzules} azules. Bolsa B: ${bolsaBRojas} bolas rojas y ${bolsaBAzules} azules. ¿En cuál bolsa es más probable sacar una bola roja?`,
    datos: [`Bolsa A: ${bolsaARojas} rojas de ${totalA}`, `Bolsa B: ${bolsaBRojas} rojas de ${totalB}`],
    operacion: `Bolsa A: ${bolsaARojas}/${totalA}. Bolsa B: ${bolsaBRojas}/${totalB}.`,
    solucion: `Bolsa ${mayor}.`,
  };
}

function genProbabilidad() {
  return pick([probabilidadCalcular, probabilidadClasificar, probabilidadComparar])();
}

function genProbabilidadACS() {
  return probabilidadClasificar();
}

function genProbabilidadAltas() {
  return probabilidadComparar();
}

function propiedadesDistributiva() {
  const a = randomInt(3, 8);
  const b = randomInt(3, 9);
  const c = randomInt(3, 9);
  const total = a * (b + c);
  const objeto = pick(["asientos", "sillas", "mesas"]);
  return {
    enunciado: `Un cine tiene ${a} filas de ${b} ${objeto} y otras ${a} filas de ${c} ${objeto}. Usa la propiedad distributiva para calcular el total de ${objeto}.`,
    datos: [`Filas: ${a}`, `${objeto} por fila: ${b} y ${c}`],
    operacion: `${a} × (${b} + ${c}) = ${a} × ${b + c} = ${total}`,
    solucion: `${total}. Hay ${total} ${objeto} en total.`,
  };
}

function propiedadesConmutativa() {
  const a = randomInt(3, 9);
  const b = randomInt(3, 9);
  return {
    enunciado: `¿Da igual comprar ${a} cajas de ${b} kg cada una, que ${b} cajas de ${a} kg cada una? Explica usando la propiedad conmutativa.`,
    datos: [`${a} × ${b}`, `${b} × ${a}`],
    operacion: `${a} × ${b} = ${a * b}. ${b} × ${a} = ${a * b}`,
    solucion: `Sí, da igual: ${a} × ${b} = ${b} × ${a} = ${a * b} kg (propiedad conmutativa).`,
  };
}

function propiedadesDosOperaciones() {
  const a = randomInt(3, 6);
  const b = randomInt(3, 7);
  const c = randomInt(3, 7);
  const extra = randomInt(2, 10);
  const total = a * (b + c) - extra;
  const objeto = pick(["cromos", "canicas", "caramelos"]);
  return {
    enunciado: `Un grupo de amigos compra ${a} paquetes de ${b} ${objeto} y otros ${a} paquetes de ${c} ${objeto}. Después regalan ${extra} ${objeto}. ¿Cuántos ${objeto} les quedan?`,
    datos: [`Paquetes: ${a}`, `${objeto} por paquete: ${b} y ${c}`, `Regalados: ${extra}`],
    operacion: `${a} × (${b} + ${c}) = ${a * (b + c)}. ${a * (b + c)} − ${extra} = ${total}`,
    solucion: `${total}. Les quedan ${total} ${objeto}.`,
  };
}

function genPropiedadesOperaciones() {
  return pick([propiedadesDistributiva, propiedadesConmutativa, propiedadesDosOperaciones])();
}

function genPropiedadesOperacionesACS() {
  const a = randomInt(2, 5);
  const b = randomInt(2, 5);
  return {
    enunciado: `¿Da igual sumar ${a} + ${b} que ${b} + ${a}? Comprueba el resultado.`,
    datos: [`${a} + ${b}`, `${b} + ${a}`],
    operacion: `${a} + ${b} = ${a + b}. ${b} + ${a} = ${a + b}`,
    solucion: `Sí, da igual: las dos sumas dan ${a + b} (propiedad conmutativa).`,
  };
}

function genPropiedadesOperacionesAltas() {
  return propiedadesDosOperaciones();
}

function tablasContenedor() {
  const factor = randomInt(2, 9);
  const cajas = randomInt(2, 9);
  const total = factor * cajas;
  const objeto = pick(["manzanas", "cromos", "canicas", "caramelos"]);
  return {
    enunciado: `Cada caja tiene ${factor} ${objeto}. ¿Cuántas ${objeto} hay en ${cajas} cajas?`,
    datos: [`${objeto} por caja: ${factor}`, `Cajas: ${cajas}`],
    operacion: `${factor} × ${cajas} = ${total}`,
    solucion: `${total}. Hay ${total} ${objeto} en total.`,
  };
}

function tablasViajes() {
  const viajes = randomInt(2, 9);
  const pasajeros = randomInt(2, 9);
  const total = viajes * pasajeros;
  return {
    enunciado: `Un autobús hace ${viajes} viajes al día llevando ${pasajeros} pasajeros cada vez. ¿Cuántos pasajeros transporta en total?`,
    datos: [`Viajes: ${viajes}`, `Pasajeros por viaje: ${pasajeros}`],
    operacion: `${viajes} × ${pasajeros} = ${total}`,
    solucion: `${total}. Transporta ${total} pasajeros en total.`,
  };
}

function tablasAmigos() {
  const amigos = randomInt(2, 9);
  const cromos = randomInt(2, 9);
  const total = amigos * cromos;
  return {
    enunciado: `${amigos} amigos tienen ${cromos} cromos cada uno. ¿Cuántos cromos tienen entre todos?`,
    datos: [`Amigos: ${amigos}`, `Cromos por amigo: ${cromos}`],
    operacion: `${amigos} × ${cromos} = ${total}`,
    solucion: `${total}. Tienen ${total} cromos entre todos.`,
  };
}

function genTablas() {
  return pick([tablasContenedor, tablasViajes, tablasAmigos])();
}

function genTablasACS() {
  const factor = pick([2, 5, 10]);
  const veces = randomInt(2, 6);
  const total = factor * veces;
  return {
    enunciado: `Cada caja tiene ${factor} caramelos. ¿Cuántos caramelos hay en ${veces} cajas?`,
    datos: [`Caramelos por caja: ${factor}`, `Cajas: ${veces}`],
    operacion: `${factor} × ${veces} = ${total}`,
    solucion: `${total}. Hay ${total} caramelos en total.`,
  };
}

function genTablasAltas() {
  const factor = randomInt(6, 9);
  const cajas = randomInt(6, 9);
  const vendidos = randomInt(5, 20);
  const total = factor * cajas - vendidos;
  return {
    enunciado: `Una tienda tiene ${cajas} cajas con ${factor} camisetas cada una. Vende ${vendidos} camisetas. ¿Cuántas camisetas quedan?`,
    datos: [`Cajas: ${cajas}`, `Camisetas por caja: ${factor}`, `Vendidas: ${vendidos}`],
    operacion: `${cajas} × ${factor} = ${cajas * factor}. ${cajas * factor} − ${vendidos} = ${total}`,
    solucion: `${total}. Quedan ${total} camisetas.`,
  };
}

function fmtHM(hh, mm) {
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function tiempoSumar() {
  const h = randomInt(1, 20);
  const m = randomInt(0, 59);
  const durH = randomInt(0, 3);
  const durM = randomInt(5, 59);
  let totalM = m + durM;
  let totalH = h + durH + Math.floor(totalM / 60);
  totalM = totalM % 60;
  totalH = totalH % 24;
  return {
    enunciado: `Una película empieza a las ${fmtHM(h, m)} y dura ${durH}h ${durM}min. ¿A qué hora termina?`,
    datos: [`Hora de inicio: ${fmtHM(h, m)}`, `Duración: ${durH}h ${durM}min`],
    operacion: `${fmtHM(h, m)} + ${durH}h ${durM}min = ${fmtHM(totalH, totalM)}`,
    solucion: `${fmtHM(totalH, totalM)}. Termina a las ${fmtHM(totalH, totalM)}.`,
  };
}

function tiempoRestar() {
  const h1 = randomInt(6, 12);
  const m1 = randomInt(0, 59);
  const durH = randomInt(1, 4);
  const durM = randomInt(0, 59);
  let totalM = m1 + durM;
  let totalH = h1 + durH + Math.floor(totalM / 60);
  totalM = totalM % 60;
  return {
    enunciado: `Un tren sale a las ${fmtHM(h1, m1)} y llega a las ${fmtHM(totalH, totalM)}. ¿Cuánto dura el viaje?`,
    datos: [`Salida: ${fmtHM(h1, m1)}`, `Llegada: ${fmtHM(totalH, totalM)}`],
    operacion: `${fmtHM(totalH, totalM)} − ${fmtHM(h1, m1)} = ${durH}h ${durM}min`,
    solucion: `${durH}h ${durM}min. El viaje dura ${durH} horas y ${durM} minutos.`,
  };
}

function tiempoFaltan() {
  const h = randomInt(1, 11);
  const m = randomInt(1, 59);
  const minutosFaltan = 60 - m;
  return {
    enunciado: `Si son las ${h}:${String(m).padStart(2, "0")}, ¿cuántos minutos faltan para las ${h + 1}:00?`,
    datos: [`Hora actual: ${h}:${String(m).padStart(2, "0")}`],
    operacion: `60 − ${m} = ${minutosFaltan}`,
    solucion: `${minutosFaltan} minutos.`,
  };
}

function genTiempo() {
  return pick([tiempoSumar, tiempoRestar, tiempoFaltan])();
}

function genTiempoACS() {
  const h = randomInt(1, 11);
  if (Math.random() < 0.5) {
    const siguiente = h + 1 > 12 ? h + 1 - 12 : h + 1;
    return {
      enunciado: `El reloj marca las ${h} y media. ¿Qué hora en punto es la más cercana que vendrá después?`,
      datos: [`Hora: ${h}:30`],
      operacion: `Después de las ${h} y media viene la hora en punto siguiente.`,
      solucion: `Las ${siguiente}:00.`,
    };
  }
  return {
    enunciado: `El reloj marca las ${h} en punto. ¿Cuántas horas faltan para las 12 en punto?`,
    datos: [`Hora: ${h}:00`],
    operacion: `12 − ${h} = ${12 - h}`,
    solucion: `${12 - h} horas.`,
  };
}

function genTiempoAltas() {
  const h1 = randomInt(1, 5);
  const m1 = randomInt(10, 50);
  const durH = randomInt(1, 2);
  const durM = randomInt(10, 50);
  let sumM = m1 + durM;
  let sumH = h1 + durH + Math.floor(sumM / 60);
  sumM = sumM % 60;
  const esperaM = randomInt(5, 40);
  let finalM = sumM + esperaM;
  let finalH = sumH + Math.floor(finalM / 60);
  finalM = finalM % 60;
  return {
    enunciado: `Un autobús sale a las ${fmtHM(h1, m1)}. Primero tarda ${durH}h ${durM}min en llegar a una ciudad, y allí espera ${esperaM} minutos antes de continuar. ¿A qué hora sale de esa ciudad?`,
    datos: [`Salida: ${fmtHM(h1, m1)}`, `Duración del viaje: ${durH}h ${durM}min`, `Espera: ${esperaM} min`],
    operacion: `${fmtHM(h1, m1)} + ${durH}h ${durM}min = ${fmtHM(sumH, sumM)}. ${fmtHM(sumH, sumM)} + ${esperaM}min = ${fmtHM(finalH, finalM)}`,
    solucion: `${fmtHM(finalH, finalM)}.`,
  };
}

// ---------------- Registro de temas ----------------

const TOPICS = [
  { id: "sumas", label: "Sumas", category: "Operaciones básicas", generate: genSumas, generateACS: genSumasACS, generateAltas: genSumasAltas, resumen: "Sumar es juntar cantidades para saber cuántas hay en total." },
  { id: "tablas", label: "Tablas de multiplicar", category: "Operaciones básicas", generate: genTablas, generateACS: genTablasACS, generateAltas: genTablasAltas, resumen: "La tabla de un número es el resultado de multiplicarlo por 1, 2, 3... hasta 10." },
  { id: "numeros-grandes", label: "Números grandes", category: "Operaciones básicas", generate: genNumerosGrandes, generateACS: genNumerosGrandesACS, generateAltas: genNumerosGrandesAltas, resumen: "En un número, cada cifra vale más o menos según la posición que ocupa: su valor posicional." },
  { id: "propiedades-operaciones", label: "Propiedades de las operaciones", category: "Operaciones básicas", generate: genPropiedadesOperaciones, generateACS: genPropiedadesOperacionesACS, generateAltas: genPropiedadesOperacionesAltas, resumen: "Las propiedades de las operaciones permiten reordenar o agrupar números para calcular más fácilmente, sin cambiar el resultado." },
  { id: "restas", label: "Restas", category: "Operaciones básicas", generate: genRestas, generateACS: genRestasACS, generateAltas: genRestasAltas, resumen: "Restar es quitar una cantidad de otra para saber cuánto queda o la diferencia entre ellas." },
  { id: "multiplicaciones", label: "Multiplicaciones", category: "Operaciones básicas", generate: genMultiplicaciones, generateACS: genMultiplicacionesACS, generateAltas: genMultiplicacionesAltas, resumen: "Multiplicar es sumar un mismo número varias veces de forma rápida." },
  { id: "divisiones", label: "Divisiones", category: "Operaciones básicas", generate: genDivisiones, generateACS: genDivisionesACS, generateAltas: genDivisionesAltas, resumen: "Dividir es repartir una cantidad en partes iguales." },
  { id: "operaciones-combinadas", label: "Operaciones combinadas", category: "Operaciones básicas", generate: genOperacionesCombinadas, generateACS: genOperacionesCombinadasACS, generateAltas: genOperacionesCombinadasAltas, resumen: "Cuando hay varias operaciones juntas, primero se resuelven los paréntesis, luego multiplicaciones y divisiones, y por último sumas y restas." },
  { id: "numeros-romanos", label: "Números romanos", category: "Operaciones básicas", generate: genNumerosRomanos, generateACS: genNumerosRomanosACS, generateAltas: genNumerosRomanosAltas, resumen: "Los números romanos se escriben combinando las letras I, V, X, L, C, D y M según reglas de suma y resta." },
  { id: "potencias", label: "Las potencias", category: "Operaciones básicas", generate: genPotencias, generateACS: genPotenciasACS, generateAltas: genPotenciasAltas, resumen: "Una potencia es una multiplicación de un mismo número (la base) tantas veces como indica el exponente." },
  { id: "numeros-enteros", label: "Números enteros", category: "Operaciones básicas", generate: genNumerosEnteros, generateACS: genNumerosEnterosACS, generateAltas: genNumerosEnterosAltas, resumen: "Los números enteros incluyen los positivos, los negativos y el cero. Sirven para representar cambios en dos sentidos, como subir o bajar." },
  { id: "multiplos-divisores", label: "Múltiplos, divisores y m.c.m.", category: "Operaciones básicas", generate: genMultiplosDivisores, generateACS: genMultiplosDivisoresACS, generateAltas: genMultiplosDivisoresAltas, resumen: "Los múltiplos de un número se obtienen multiplicándolo por 1, 2, 3... El m.c.m. es el menor múltiplo común de dos números." },
  { id: "fracciones", label: "Fracciones", category: "Fracciones y decimales", generate: genFracciones, generateACS: genFraccionesACS, generateAltas: genFraccionesAltas, resumen: "Una fracción representa las partes que se toman de un todo dividido en partes iguales." },
  { id: "operaciones-fracciones", label: "Operaciones con fracciones", category: "Fracciones y decimales", generate: genOperacionesFracciones, generateACS: genOperacionesFraccionesACS, generateAltas: genOperacionesFraccionesAltas, resumen: "Para sumar o restar fracciones con distinto denominador, primero hay que buscar un denominador común." },
  { id: "decimales", label: "Números decimales (redondeo)", category: "Fracciones y decimales", generate: genDecimales, generateACS: genDecimalesACS, generateAltas: genDecimalesAltas, resumen: "Los números decimales tienen una parte entera y una parte decimal separadas por una coma. Redondear es aproximar a un número más sencillo." },
  { id: "decimales-md", label: "Multiplicación y división de decimales", category: "Fracciones y decimales", generate: genDecimalesMD, generateACS: genDecimalesMDACS, generateAltas: genDecimalesMDAltas, resumen: "Al multiplicar o dividir decimales se opera igual que con números enteros, teniendo cuidado con la coma decimal." },
  { id: "porcentajes", label: "Porcentajes", category: "Fracciones y decimales", generate: genPorcentajes, generateACS: genPorcentajesACS, generateAltas: genPorcentajesAltas, resumen: "Un porcentaje indica una parte de cada 100. Calcular el X% de una cantidad es multiplicarla por X y dividir entre 100." },
  { id: "problemas-mixtos", label: "Problemas mixtos (varios pasos)", category: "Problemas mixtos", generate: genProblemasMixtos, resumen: "Algunos problemas necesitan encadenar varias operaciones seguidas para llegar a la solución final." },
  { id: "medidas", label: "Medidas y conversiones", category: "Geometría y medidas", generate: genMedidas, generateACS: genMedidasACS, generateAltas: genMedidasAltas, resumen: "Para cambiar de una unidad de medida a otra, se multiplica o se divide según la equivalencia entre ellas." },
  { id: "areas", label: "Áreas y perímetros", category: "Geometría y medidas", generate: genAreas, generateACS: genAreasACS, generateAltas: genAreasAltas, resumen: "El área mide la superficie de una figura: en un rectángulo es base × altura, y en un triángulo es (base × altura) ÷ 2." },
  { id: "circunferencia", label: "Circunferencia y círculo", category: "Geometría y medidas", generate: genCircunferencia, generateACS: genCircunferenciaACS, generateAltas: genCircunferenciaAltas, resumen: "La circunferencia es el contorno de un círculo. Su longitud es 2 × π × radio, y el área del círculo es π × radio²." },
  { id: "proporcionalidad", label: "Proporcionalidad (regla de tres)", category: "Geometría y medidas", generate: genProporcionalidad, generateACS: genProporcionalidadACS, generateAltas: genProporcionalidadAltas, resumen: "En una relación de proporcionalidad, si conocemos el precio de una unidad podemos calcular el de cualquier cantidad." },
  { id: "estadistica", label: "Estadística (media y mediana)", category: "Geometría y medidas", generate: genEstadistica, generateACS: genEstadisticaACS, generateAltas: genEstadisticaAltas, resumen: "La media es la suma de todos los valores dividida entre el número de valores. La mediana es el valor central al ordenarlos." },
  { id: "angulos", label: "Ángulos", category: "Geometría y medidas", generate: genAngulos, generateACS: genAngulosACS, generateAltas: genAngulosAltas, resumen: "Un ángulo es el espacio que forman dos semirrectas que salen de un mismo punto, y se mide en grados." },
  { id: "coordenadas", label: "Coordenadas", category: "Geometría y medidas", generate: genCoordenadas, generateACS: genCoordenadasACS, generateAltas: genCoordenadasAltas, resumen: "Cada punto del plano se localiza con dos coordenadas (x, y) que indican cuánto se mueve en horizontal y en vertical." },
  { id: "cuerpos-geometricos", label: "Cuerpos geométricos", category: "Geometría y medidas", generate: genCuerposGeometricos, generateACS: genCuerposGeometricosACS, generateAltas: genCuerposGeometricosAltas, resumen: "Los cuerpos geométricos son figuras de tres dimensiones: los poliedros tienen caras planas y los cuerpos redondos tienen alguna superficie curva." },
  { id: "tiempo", label: "El tiempo", category: "Geometría y medidas", generate: genTiempo, generateACS: genTiempoACS, generateAltas: genTiempoAltas, resumen: "El tiempo se mide en horas, minutos y segundos: 1 día tiene 24 horas, 1 hora 60 minutos y 1 minuto 60 segundos." },
  { id: "probabilidad", label: "Probabilidad", category: "Geometría y medidas", generate: genProbabilidad, generateACS: genProbabilidadACS, generateAltas: genProbabilidadAltas, resumen: "La probabilidad de un suceso se calcula dividiendo los casos favorables entre los casos totales." },
];

// ---------------- Construcción del documento ----------------

function sectionBar(label) {
  return {
    runs: [{ text: label, bold: true, color: "FFFFFF", size: 18 }],
    shading: "595959",
    spacingBefore: 40,
    spacingAfter: 0,
  };
}

function blankBox(extraLines, spacingAfter) {
  const runs = [];
  for (let i = 0; i < extraLines; i++) runs.push({ break: true });
  runs.push({ text: " " });
  return { runs, border: true, shading: "D9D9D9", spacingAfter };
}

function filledBox(runs, spacingAfter) {
  return { runs, border: true, shading: "D9D9D9", spacingAfter };
}

function buildHeaderParagraphs(topic, curso, fecha) {
  return [
    { runs: [{ text: "Aprende y Repasa", bold: true, size: 18, color: "595959" }], spacingAfter: 30 },
    { runs: [{ text: "Ficha de matemáticas", bold: true, size: 32 }], spacingAfter: 100 },
    {
      runs: [
        { text: "Área: ", bold: true }, { text: "Matemáticas      " },
        { text: "Curso: ", bold: true }, { text: `${curso}º de Primaria` },
      ],
      spacingAfter: 40,
    },
    {
      runs: [
        { text: "Contenido: ", bold: true }, { text: `${topic.label}      ` },
        { text: "Fecha: ", bold: true }, { text: fecha },
      ],
      spacingAfter: 120,
    },
  ];
}

function buildProblemParagraphs(problem, index, showSolutions, dificultad) {
  const paragraphs = [];
  const pageBreakEvery = dificultad === "tdah" ? 1 : 5;
  const startsNewPage = index > 0 && index % pageBreakEvery === 0;
  paragraphs.push({
    runs: [{ text: `Problema ${index + 1}`, bold: true, size: 22 }],
    spacingBefore: startsNewPage ? 0 : 90,
    spacingAfter: 30,
    pageBreakBefore: startsNewPage,
  });
  paragraphs.push({ runs: [{ text: problem.enunciado }], spacingAfter: 40 });

  const prefillWorkings = dificultad === "disgrafia" && !showSolutions;

  paragraphs.push(sectionBar("Datos"));
  paragraphs.push(
    showSolutions || prefillWorkings ? filledBox([{ text: problem.datos.join("   ·   ") }], 30) : blankBox(1, 30)
  );

  paragraphs.push(sectionBar("Operación"));
  paragraphs.push(
    showSolutions || prefillWorkings ? filledBox([{ text: problem.operacion }], 30) : blankBox(0, 30)
  );

  paragraphs.push(sectionBar("Solución"));
  paragraphs.push(
    showSolutions ? filledBox([{ text: problem.solucion, bold: true }], 140) : blankBox(0, 140)
  );

  return paragraphs;
}

const DIFFICULTY_FICHA_NOTES = {
  acs: "Adaptación curricular significativa: mismo contenido con un nivel de dificultad equivalente a dos cursos por debajo.",
  discalculia: "Discalculia: mismo nivel de dificultad que la ACS, pensado para dar más tiempo y reducir la carga numérica.",
  altas: "Altas capacidades: problemas con números más grandes o con un paso adicional para un reto mayor.",
  dislexia: "Dislexia: mismo contenido, con letra más grande y más espacio entre líneas para facilitar la lectura.",
  tdah: "TDAH: cada problema se presenta en su propia página, para trabajar de uno en uno sin saturar la vista.",
  disgrafia: "Disgrafía: los apartados de Datos y Operación ya vienen resueltos; solo hay que completar la Solución.",
};

function applyDislexiaStyling(paragraphs) {
  return paragraphs.map((p) => ({
    ...p,
    spacingBefore: p.spacingBefore !== undefined ? Math.round(p.spacingBefore * 1.3) : p.spacingBefore,
    spacingAfter: p.spacingAfter !== undefined ? Math.round(p.spacingAfter * 1.3) : p.spacingAfter,
    runs: p.runs.map((r) => (r.break ? r : { ...r, size: (r.size || 22) + 6 })),
  }));
}

function buildFichaDocument({ topic, curso, fecha, problems, dificultad, showSolutions }) {
  const paragraphs = [];
  paragraphs.push(...buildHeaderParagraphs(topic, curso, fecha));

  if (showSolutions) {
    paragraphs.push({ runs: [{ text: "Hoja de soluciones", bold: true, size: 24 }], spacingAfter: 140 });
  } else {
    paragraphs.push({
      runs: [{ text: topic.resumen }],
      border: true,
      shading: "D9D9D9",
      spacingAfter: 100,
    });
  }

  const note = DIFFICULTY_FICHA_NOTES[dificultad];
  if (note) {
    paragraphs.push({
      runs: [{ text: note, italic: true, color: "0369A1" }],
      spacingAfter: 140,
    });
  }

  problems.forEach((p, i) => {
    paragraphs.push(...buildProblemParagraphs(p, i, showSolutions, dificultad));
  });

  return dificultad === "dislexia" ? applyDislexiaStyling(paragraphs) : paragraphs;
}

// ---------------- API pública ----------------

function getTopicsByCategory() {
  const byCategory = {};
  TOPICS.forEach((t) => {
    if (!byCategory[t.category]) byCategory[t.category] = [];
    byCategory[t.category].push(t);
  });
  return byCategory;
}

const DISCALCULIA_SCAFFOLD = " Tómate tu tiempo.";

function generarProblemas(topic, curso, count, dificultad) {
  if (dificultad === "acs" || dificultad === "discalculia") {
    if (!topic.generateACS) return generarProblemas(topic, curso, count, "none");
    const problems = [];
    for (let i = 0; i < count; i++) {
      const p = topic.generateACS();
      problems.push(dificultad === "discalculia" ? { ...p, enunciado: p.enunciado + DISCALCULIA_SCAFFOLD } : p);
    }
    return problems;
  }
  if (dificultad === "altas" && topic.generateAltas) {
    const problems = [];
    for (let i = 0; i < count; i++) problems.push(topic.generateAltas(curso));
    return problems;
  }
  const problems = [];
  for (let i = 0; i < count; i++) problems.push(topic.generate(curso));
  return problems;
}

function generarFichaYSoluciones(topicId, curso, count, dificultad = "none") {
  const topic = TOPICS.find((t) => t.id === topicId);
  if (!topic) throw new Error("Tema no encontrado: " + topicId);

  const problems = generarProblemas(topic, curso, count, dificultad);

  const fecha = todayEs();
  const fichaParagraphs = buildFichaDocument({ topic, curso, fecha, problems, dificultad, showSolutions: false });
  const solucionesParagraphs = buildFichaDocument({ topic, curso, fecha, problems, dificultad, showSolutions: true });

  const fichaBlob = createDocxBlob(fichaParagraphs);
  const solucionesBlob = createDocxBlob(solucionesParagraphs);

  const sufijo = dificultad && dificultad !== "none" ? `_${dificultad}` : "";
  downloadBlob(fichaBlob, `ficha_matematicas_${topicId}_${curso}${sufijo}.docx`);
  setTimeout(() => downloadBlob(solucionesBlob, `soluciones_matematicas_${topicId}_${curso}${sufijo}.docx`), 400);
}
