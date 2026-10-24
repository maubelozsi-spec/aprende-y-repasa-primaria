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

// ---- Las potencias ----
const poSup = (e) => String(e).split("").map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join("");
const poPot = (b, e) => `${b}${poSup(e)}`;
const poMiles = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const poFact = (b, e) => Array(e).fill(b).join(" × ");
const poLetras = (arr, f) => arr.map((x, i) => `${"abcdef"[i]}) ${f(x)}`).join("   ");
const PO_NUM = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce"];
const poLeer = (b, e) => `${PO_NUM[b]} ${e === 2 ? "al cuadrado" : e === 3 ? "al cubo" : `elevado a ${PO_NUM[e]}`}`;

// Varias potencias distintas sacadas de una lista.
function poVarias(lista, n) {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, n);
}

const PO_NIVELES = {
  "5": { pots: [[2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [2, 3], [3, 3], [4, 3], [5, 3]], e10: 4, cifras: 4, lado: 9, arista: 5 },
  "6": { pots: [[6, 2], [7, 2], [8, 2], [9, 2], [11, 2], [12, 2], [3, 3], [4, 3], [5, 3], [6, 3], [2, 4], [2, 5], [2, 6], [3, 4], [5, 4]], e10: 7, cifras: 6, lado: 15, arista: 8 },
  disc: { pots: [[2, 2], [3, 2], [4, 2], [5, 2], [2, 3], [3, 3]], e10: 3, cifras: 4, lado: 6, arista: 3 },
};

function poCalcular(nivel) {
  const ps = poVarias(nivel.pots, 3);
  return {
    enunciado: `Escribe cada potencia como multiplicación y calcula su valor: ${poLetras(ps, ([b, e]) => poPot(b, e))}.`,
    datos: ["La base se repite como factor tantas veces como dice el exponente."],
    operacion: ps.map(([b, e], i) => `${"abc"[i]}) ${poPot(b, e)} = ${poFact(b, e)} = ${poMiles(b ** e)}`).join(" · "),
    solucion: ps.map(([b, e], i) => `${"abc"[i]}) ${poMiles(b ** e)}`).join("; ") + ".",
  };
}

function poEscribir(nivel) {
  const ps = poVarias(nivel.pots, 3);
  return {
    enunciado: `Escribe en forma de potencia y di cómo se lee: ${poLetras(ps, ([b, e]) => poFact(b, e))}.`,
    datos: ["Base: el número que se repite.", "Exponente: las veces que se repite."],
    operacion: ps.map(([b, e], i) => `${"abc"[i]}) ${poFact(b, e)} = ${poPot(b, e)}`).join(" · "),
    solucion: ps.map(([b, e], i) => `${"abc"[i]}) ${poPot(b, e)}, «${poLeer(b, e)}»`).join("; ") + ".",
  };
}

function poDiez(nivel) {
  const e1 = randomInt(2, nivel.e10);
  let e2;
  do e2 = randomInt(2, nivel.e10);
  while (e2 === e1);
  const a = randomInt(2, 9);
  const e3 = randomInt(2, nivel.e10);
  return {
    enunciado: `a) Escribe como potencia de 10: ${poMiles(10 ** e1)} y ${poMiles(10 ** e2)}.   b) Calcula: ${a} × ${poPot(10, e3)}.`,
    datos: ["Una potencia de 10 es un 1 seguido de tantos ceros como dice el exponente."],
    operacion: `a) ${poMiles(10 ** e1)} tiene ${e1} ceros → ${poPot(10, e1)}; ${poMiles(10 ** e2)} tiene ${e2} ceros → ${poPot(10, e2)}.   b) ${poPot(10, e3)} = ${poMiles(10 ** e3)}; ${a} × ${poMiles(10 ** e3)} = ${poMiles(a * 10 ** e3)}`,
    solucion: `a) ${poPot(10, e1)} y ${poPot(10, e2)}. b) ${poMiles(a * 10 ** e3)}.`,
  };
}

function poNumeroConCeros(cifras) {
  const d = [randomInt(1, 9)];
  for (let i = 1; i < cifras; i++) d.push(Math.random() < 0.35 ? 0 : randomInt(1, 9));
  if (!d.slice(1).includes(0)) d[randomInt(1, cifras - 1)] = 0;
  return d;
}
const poDescomp = (d) => d.map((x, i) => [x, d.length - 1 - i]).filter(([x]) => x !== 0).map(([x, p]) => (p === 0 ? String(x) : p === 1 ? `${x} × 10` : `${x} × ${poPot(10, p)}`)).join(" + ");

function poDescomponer(nivel) {
  const d1 = poNumeroConCeros(nivel.cifras);
  const d2 = poNumeroConCeros(nivel.cifras);
  const n1 = Number(d1.join(""));
  const n2 = Number(d2.join(""));
  return {
    enunciado: `a) Descompón con potencias de 10 el número ${poMiles(n1)}.   b) ¿Qué número es ${poDescomp(d2)}?`,
    datos: ["El exponente de cada cifra es el número de cifras que tiene a su derecha.", "Los ceros no se escriben, pero guardan su lugar."],
    operacion: `a) ${poMiles(n1)} = ${poDescomp(d1)}   b) ${d2.map((x, i) => x * 10 ** (d2.length - 1 - i)).filter((x) => x).map(poMiles).join(" + ")} = ${poMiles(n2)}`,
    solucion: `a) ${poDescomp(d1)}. b) ${poMiles(n2)}.`,
  };
}

function poOrdenar(nivel) {
  // Una pareja con base y exponente cambiados, que es donde está la trampa.
  const trampa = pick(nivel === PO_NIVELES.disc ? [[[2, 3], [3, 2]]] : [[[2, 5], [5, 2]], [[3, 4], [4, 3]], [[2, 3], [3, 2]], [[2, 6], [6, 2]]]);
  const usados = new Set(trampa.map(([b, e]) => b ** e));
  const ps = trampa.slice();
  while (ps.length < (nivel === PO_NIVELES.disc ? 3 : 4)) {
    const p = pick(nivel.pots.concat([[10, 2]]));
    if (!usados.has(p[0] ** p[1])) {
      usados.add(p[0] ** p[1]);
      ps.push(p);
    }
  }
  const mezcla = poVarias(ps, ps.length);
  const orden = mezcla.slice().sort((x, y) => x[0] ** x[1] - y[0] ** y[1]);
  return {
    enunciado: `Calcula y ordena de menor a mayor: ${mezcla.map(([b, e]) => poPot(b, e)).join(", ")}.`,
    datos: mezcla.map(([b, e]) => poPot(b, e)),
    operacion: mezcla.map(([b, e]) => `${poPot(b, e)} = ${poMiles(b ** e)}`).join("; "),
    solucion: `${orden.map(([b, e]) => poPot(b, e)).join(" < ")}. Cambiar la base por el exponente cambia el resultado.`,
  };
}

function poCajas(nivel) {
  const b = randomInt(nivel === PO_NIVELES.disc ? 2 : 3, nivel === PO_NIVELES.disc ? 4 : nivel === PO_NIVELES["6"] ? 9 : 6);
  const v = b ** 3;
  return {
    enunciado: `En la fábrica de máquinas guardan ${b} cajas. En cada caja hay ${b} bolsas y en cada bolsa, ${b} engranajes. ¿Cuántos engranajes hay? Escríbelo como potencia.`,
    datos: [`Cajas: ${b}`, `Bolsas por caja: ${b}`, `Engranajes por bolsa: ${b}`],
    operacion: `${poFact(b, 3)} = ${poPot(b, 3)} = ${poMiles(v)}`,
    solucion: `${poPot(b, 3)} = ${poMiles(v)} engranajes.`,
  };
}

function poBaldosas(nivel) {
  const b = randomInt(3, nivel.lado);
  return {
    enunciado: `Un patio cuadrado tiene ${b} baldosas en cada lado. ¿Cuántas baldosas tiene en total? Escríbelo como potencia.`,
    datos: [`Baldosas por lado: ${b}`],
    operacion: `${b} filas de ${b}: ${b} × ${b} = ${poPot(b, 2)} = ${b * b}`,
    solucion: `${poPot(b, 2)} = ${b * b} baldosas.`,
  };
}

function poCubitos(nivel) {
  const b = randomInt(2, nivel.arista);
  const v = b ** 3;
  return {
    enunciado: `Con cubitos iguales se construye un cubo grande con ${b} cubitos en cada arista. ¿Cuántos cubitos hacen falta?`,
    datos: [`Cubitos por arista: ${b}`],
    operacion: `${b} capas de ${b} × ${b} = ${b * b}: ${poFact(b, 3)} = ${poPot(b, 3)} = ${poMiles(v)}`,
    solucion: `${poPot(b, 3)} = ${poMiles(v)} cubitos.`,
  };
}

function poCadena(nivel) {
  const [bmax, dmax] = nivel.cadena || (nivel === PO_NIVELES.disc ? [3, 3] : [4, 5]);
  const b = randomInt(2, bmax);
  const dia = randomInt(Math.min(dmax, 4), dmax);
  const nombre = pick(NOMBRES);
  return {
    enunciado: `${nombre} envía un mensaje a ${b} amigos (día 1). Al día siguiente, cada uno lo reenvía a ${b} personas nuevas, y así cada día. ¿Cuántas personas lo reciben el día ${dia}? Escríbelo como potencia.`,
    datos: [`Día 1: ${b} personas`, `Cada día se multiplica por ${b}`],
    operacion: `Día ${dia}: ${poFact(b, dia)} = ${poPot(b, dia)} = ${poMiles(b ** dia)}`,
    solucion: `${poPot(b, dia)} = ${poMiles(b ** dia)} personas.`,
  };
}

// 6º (SdA 2): calcular, escribir y leer potencias, potencias de 10,
// descomposición, comparar y problemas. 5º: cuadrados, cubos y
// potencias de 10 sencillas, con problemas de baldosas, cajas y cubitos.
function genPotencias(curso) {
  if (curso === "6") {
    return siguienteDeBaraja("po6", [poCalcular, poEscribir, poDiez, poDescomponer, poOrdenar, poCajas, poBaldosas, poCubitos, poCadena])(PO_NIVELES["6"]);
  }
  return siguienteDeBaraja("po5", [poCalcular, poEscribir, poDiez, poBaldosas, poCajas, poCubitos])(PO_NIVELES["5"]);
}

function poAcsCuadrado() {
  const b = randomInt(2, 5);
  return {
    enunciado: `Calcula ${poPot(b, 2)}. Recuerda: ${poPot(b, 2)} es ${b} × ${b}.`,
    datos: [`Base: ${b}`, "Exponente: 2"],
    operacion: `${b} × ${b} = ${b * b}`,
    solucion: `${b * b}.`,
  };
}

function poAcsBaldosas() {
  const b = randomInt(2, 5);
  return {
    enunciado: `Un suelo cuadrado tiene ${b} baldosas en cada lado. Dibújalo y cuenta: ¿cuántas baldosas tiene?`,
    datos: [`Baldosas por lado: ${b}`],
    operacion: `${b} filas de ${b}: ${b} × ${b} = ${b * b}`,
    solucion: `${b * b} baldosas (${poPot(b, 2)}).`,
  };
}

function genPotenciasACS() {
  return siguienteDeBaraja("poAcs", [poAcsCuadrado, poAcsBaldosas, poAcsCuadrado, poAcsBaldosas])();
}

// Discalculia: los contenidos del curso con potencias pequeñas.
function genPotenciasDiscalculia(curso) {
  const d = PO_NIVELES.disc;
  if (curso === "6") return siguienteDeBaraja("poDisc6", [poCalcular, poEscribir, poDiez, poDescomponer, poOrdenar, poBaldosas, poCubitos])(d);
  return siguienteDeBaraja("poDisc5", [poCalcular, poEscribir, poDiez, poBaldosas, poCajas, poCubitos])(d);
}

function poCuboMayor() {
  const a = randomInt(3, 8);
  return {
    enunciado: `Un cubo de cubitos tiene ${a} cubitos de arista. ¿Cuántos cubitos hay que añadir para convertirlo en un cubo de ${a + 1} cubitos de arista?`,
    datos: [`Arista inicial: ${a}`, `Arista final: ${a + 1}`],
    operacion: `${poPot(a + 1, 3)} − ${poPot(a, 3)} = ${(a + 1) ** 3} − ${a ** 3} = ${(a + 1) ** 3 - a ** 3}`,
    solucion: `${(a + 1) ** 3 - a ** 3} cubitos.`,
  };
}

function poComparar210() {
  return {
    enunciado: "¿Qué es mayor, 2¹⁰ o 10³? ¿Y 2²⁰ o 10⁶? Explica cómo lo has averiguado sin calcular 2²⁰ entero.",
    datos: ["2¹⁰ = 2 × 2 × … × 2 (10 veces)", "2²⁰ = 2¹⁰ × 2¹⁰"],
    operacion: "2¹⁰ = 1.024 > 1.000 = 10³. 2²⁰ = 2¹⁰ × 2¹⁰ = 1.024 × 1.024, y 10⁶ = 1.000 × 1.000",
    solucion: "2¹⁰ > 10³ y 2²⁰ > 10⁶ (2²⁰ = 1.048.576).",
  };
}

function genPotenciasAltas() {
  const alto = { pots: [[11, 2], [12, 2], [7, 3], [8, 3], [9, 3], [2, 8], [2, 9], [3, 5], [4, 5], [6, 4]], e10: 9, cifras: 7, lado: 25, arista: 12, cadena: [5, 7] };
  return siguienteDeBaraja("poAltas", [poCuboMayor, poComparar210, () => poDescomponer(alto), () => poCalcular(alto), () => poCadena(alto)])();
}

// ---- Números enteros ----
// Signo menos tipográfico (−) y paréntesis en las sumas: (−3) + (+5) = 2.
const zeZ = (n) => (n < 0 ? `−${-n}` : String(n));
const zeP = (n) => (n < 0 ? `(−${-n})` : n > 0 ? `(+${n})` : "0");
const zePl = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const zeNoCero = (min, max) => {
  let n;
  do n = randomInt(min, max);
  while (n === 0);
  return n;
};

const ZE_NIVELES = {
  "5": { max: 10, dinero: 100 },
  "6": { max: 20, dinero: 300 },
  disc: { max: 8, dinero: 20 },
};

function zeTemperatura(nivel) {
  const inicial = randomInt(-nivel.max, Math.min(nivel.max, 12));
  // Cambios realistas en unas horas: como mucho 12 grados.
  const cambio = zeNoCero(-Math.min(nivel.max, 12), Math.min(nivel.max, 12));
  const final = inicial + cambio;
  const sube = cambio > 0;
  return {
    enunciado: `A las 8 de la mañana el termómetro marca ${zeZ(inicial)} ºC. Hasta el mediodía la temperatura ${sube ? "sube" : "baja"} ${zePl(Math.abs(cambio), "grado", "grados")}. ¿Qué temperatura hace a mediodía?`,
    datos: [`Temperatura a las 8: ${zeZ(inicial)} ºC`, `${sube ? "Sube" : "Baja"}: ${zePl(Math.abs(cambio), "grado", "grados")} → ${zeP(cambio)}`],
    operacion: `${zeP(inicial)} + ${zeP(cambio)} = ${zeZ(final)}`,
    solucion: `${zeZ(final)} ºC.`,
  };
}

function zeAscensor(nivel) {
  const sotanos = Math.min(4, nivel.max);
  const alto = Math.min(12, nivel.max);
  const nombre = (p) => (p < 0 ? `el sótano ${-p}` : p === 0 ? "la planta baja" : `la planta ${p}`);
  let inicial;
  let mov;
  do {
    inicial = randomInt(-sotanos, alto);
    mov = zeNoCero(-alto, alto);
  } while (inicial + mov < -sotanos || inicial + mov > alto);
  const final = inicial + mov;
  return {
    enunciado: `Un ascensor está en ${nombre(inicial)} y ${mov > 0 ? "sube" : "baja"} ${zePl(Math.abs(mov), "planta", "plantas")}. ¿En qué planta queda? (La planta baja es el 0 y los sótanos son negativos.)`,
    datos: [`Planta de salida: ${zeZ(inicial)}`, `${mov > 0 ? "Sube" : "Baja"}: ${zePl(Math.abs(mov), "planta", "plantas")} → ${zeP(mov)}`],
    operacion: `${zeP(inicial)} + ${zeP(mov)} = ${zeZ(final)}`,
    solucion: `${zeZ(final)}: queda en ${nombre(final)}.`,
  };
}

// Un buceador siempre está bajo el nivel del mar (negativo) y no sale a la superficie.
function zeBuceador(nivel) {
  const prof = nivel === ZE_NIVELES.disc ? 10 : nivel.max * 2;
  let inicial;
  let mov;
  do {
    inicial = -randomInt(3, prof);
    mov = zeNoCero(-prof, prof);
  } while (inicial + mov >= 0 || inicial + mov < -prof - 10);
  const final = inicial + mov;
  return {
    enunciado: `Una buceadora está a ${zePl(-inicial, "metro", "metros")} bajo el nivel del mar (${zeZ(inicial)} m). ${mov > 0 ? "Sube" : "Baja"} ${zePl(Math.abs(mov), "metro", "metros")}. ¿A qué profundidad está ahora?`,
    datos: [`Posición: ${zeZ(inicial)} m`, `${mov > 0 ? "Sube" : "Baja"}: ${zePl(Math.abs(mov), "metro", "metros")} → ${zeP(mov)}`],
    operacion: `${zeP(inicial)} + ${zeP(mov)} = ${zeZ(final)}`,
    solucion: `${zeZ(final)} m: está a ${zePl(-final, "metro", "metros")} bajo el nivel del mar.`,
  };
}

function zeSaldo(nivel) {
  const paso = nivel.dinero >= 100 ? 5 : 1;
  let saldo;
  let mov;
  do {
    saldo = paso * zeNoCero(-nivel.dinero / paso / 2, nivel.dinero / paso);
    mov = paso * zeNoCero(-nivel.dinero / paso, nivel.dinero / paso);
  } while (saldo + mov === 0);
  const final = saldo + mov;
  return {
    enunciado: `La cuenta de la asociación de madres y padres tiene ${saldo < 0 ? `un saldo de ${zeZ(saldo)} € (debe ${-saldo} €)` : `${saldo} € de saldo`}. ${mov > 0 ? `Ingresan ${mov} € de la venta de papeletas` : `Pagan una factura de ${-mov} €`}. ¿Cuál es el saldo ahora?`,
    datos: [`Saldo: ${zeZ(saldo)} €`, `${mov > 0 ? "Ingreso" : "Pago"}: ${Math.abs(mov)} € → ${zeP(mov)}`],
    operacion: `${zeP(saldo)} + ${zeP(mov)} = ${zeZ(final)}`,
    solucion: `${zeZ(final)} €. ${final < 0 ? `La asociación debe ${-final} €.` : "El saldo es positivo."}`,
  };
}

const ZE_CIUDADES = ["Granada", "Jaén", "Burgos", "Soria", "Teruel", "León", "Ávila", "Huesca"];

function zeOrdenarTemperaturas(nivel) {
  const n = nivel === ZE_NIVELES.disc ? 3 : 4;
  const ciudades = ZE_CIUDADES.slice().sort(() => Math.random() - 0.5).slice(0, n);
  const vals = new Set();
  // Al menos dos negativas, que es donde está la dificultad.
  while (vals.size < 2) vals.add(-randomInt(1, nivel.max));
  // Mínimas de enero: las positivas, como mucho 8 ºC.
  while (vals.size < n) vals.add(randomInt(-nivel.max, Math.min(nivel.max, 8)));
  const temps = [...vals].sort(() => Math.random() - 0.5);
  const orden = ciudades.map((c, i) => [c, temps[i]]).sort((a, b) => a[1] - b[1]);
  return {
    enunciado: `Una mañana de enero se registran estas temperaturas mínimas: ${ciudades.map((c, i) => `${c}, ${zeZ(temps[i])} ºC`).join("; ")}. Ordénalas de la más fría a la menos fría.`,
    datos: ciudades.map((c, i) => `${c}: ${zeZ(temps[i])} ºC`),
    operacion: orden.map((x) => zeZ(x[1])).join(" < "),
    solucion: `${orden.map((x) => x[0]).join(", ")}. La más fría es ${orden[0][0]} (${zeZ(orden[0][1])} ºC).`,
  };
}

function zeComparar(nivel) {
  const a = -randomInt(1, nivel.max);
  let b;
  do b = -randomInt(1, nivel.max);
  while (b === a);
  const c = zeNoCero(-nivel.max, nivel.max);
  let d;
  do d = randomInt(-nivel.max, nivel.max);
  while (d === c || Math.sign(d) === Math.sign(c));
  const s = (x, y) => (x < y ? "<" : ">");
  return {
    enunciado: `Escribe el signo < o > entre cada pareja de números: ${zeZ(a)} __ ${zeZ(b)} ; ${zeZ(c)} __ ${zeZ(d)}. Explica cómo lo has pensado con la recta numérica.`,
    datos: [`Pareja 1: ${zeZ(a)} y ${zeZ(b)}`, `Pareja 2: ${zeZ(c)} y ${zeZ(d)}`],
    operacion: "En la recta, el número de la derecha es el mayor. Entre dos negativos, es mayor el que está más cerca del 0.",
    solucion: `${zeZ(a)} ${s(a, b)} ${zeZ(b)} ; ${zeZ(c)} ${s(c, d)} ${zeZ(d)}.`,
  };
}

function zeRecta(nivel) {
  const vals = new Set([0]);
  while (vals.size < 5) vals.add(randomInt(-Math.min(nivel.max, 10), Math.min(nivel.max, 10)));
  vals.delete(0);
  const arr = [...vals].sort(() => Math.random() - 0.5);
  const orden = arr.slice().sort((x, y) => x - y);
  return {
    enunciado: `Dibuja una recta numérica del −10 al 10 y representa en ella los números ${arr.map(zeZ).join(", ")}. Después escríbelos ordenados de menor a mayor.`,
    datos: [`Números: ${arr.map(zeZ).join(", ")}`],
    operacion: "Los negativos van a la izquierda del 0 y los positivos, a la derecha.",
    solucion: orden.map(zeZ).join(" < "),
  };
}

function zeDiferencia(nivel) {
  const min = -randomInt(2, nivel.max);
  const max = randomInt(1, Math.min(nivel.max + 5, 14));
  const dif = max - min;
  const lugar = pick(["Sierra Nevada", "un pueblo de la sierra de Cazorla", "una estación de esquí"]);
  return {
    enunciado: `En ${lugar}, la temperatura mínima de un día de invierno fue de ${zeZ(min)} ºC y la máxima, de ${zeZ(max)} ºC. ¿Cuántos grados de diferencia hubo entre la máxima y la mínima?`,
    datos: [`Mínima: ${zeZ(min)} ºC`, `Máxima: ${zeZ(max)} ºC`],
    operacion: `De ${zeZ(min)} a 0 hay ${-min}; de 0 a ${zeZ(max)} hay ${max}: ${-min} + ${max} = ${dif}`,
    solucion: `${zePl(dif, "grado", "grados")} de diferencia.`,
  };
}

function zeSumas(nivel) {
  const pares = [];
  // Una de cada tipo: dos negativos, distinto signo con resultado negativo y con resultado positivo.
  const a1 = -randomInt(1, nivel.max);
  const b1 = -randomInt(1, nivel.max);
  pares.push([a1, b1]);
  let a2;
  let b2;
  do {
    a2 = randomInt(1, nivel.max);
    b2 = -randomInt(1, nivel.max);
  } while (a2 + b2 >= 0);
  pares.push([a2, b2]);
  let a3;
  let b3;
  do {
    a3 = -randomInt(1, nivel.max);
    b3 = randomInt(1, nivel.max);
  } while (a3 + b3 <= 0);
  pares.push([a3, b3]);
  return {
    enunciado: `Calcula estas sumas: a) ${zeP(a1)} + ${zeP(b1)}; b) ${zeP(a2)} + ${zeP(b2)}; c) ${zeP(a3)} + ${zeP(b3)}.`,
    datos: ["Mismo signo: se suman y se deja el signo.", "Distinto signo: se restan y se deja el signo del de mayor valor absoluto."],
    operacion: pares.map(([a, b], i) => `${"abc"[i]}) ${zeP(a)} + ${zeP(b)} = ${zeZ(a + b)}`).join(" · "),
    solucion: pares.map(([a, b], i) => `${"abc"[i]}) ${zeZ(a + b)}`).join("; "),
  };
}

function zeOpuestoAbsoluto(nivel) {
  const vals = new Set();
  while (vals.size < 3) vals.add(zeNoCero(-nivel.max, nivel.max));
  const arr = [...vals];
  return {
    enunciado: `Escribe el opuesto y el valor absoluto de cada número: ${arr.map(zeZ).join(", ")}.`,
    datos: ["Opuesto: a la misma distancia del 0, al otro lado.", "Valor absoluto: la distancia hasta el 0 (nunca es negativo)."],
    operacion: arr.map((n) => `op(${zeZ(n)}) = ${zeZ(-n)}; |${zeZ(n)}| = ${Math.abs(n)}`).join(" · "),
    solucion: arr.map((n) => `${zeZ(n)}: opuesto ${zeZ(-n)}, valor absoluto ${Math.abs(n)}`).join("; ") + ".",
  };
}

// 5º: enteros en contextos (temperaturas, ascensores, profundidades, saldos)
// y comparación. 6º (SdA 7): además recta, opuesto, valor absoluto y suma.
function genNumerosEnteros(curso) {
  if (curso === "6") {
    return siguienteDeBaraja("ze6", [zeRecta, zeComparar, zeOpuestoAbsoluto, zeSumas, zeTemperatura, zeAscensor, zeBuceador, zeSaldo, zeDiferencia, zeOrdenarTemperaturas])(ZE_NIVELES["6"]);
  }
  return siguienteDeBaraja("ze5", [zeTemperatura, zeAscensor, zeBuceador, zeSaldo, zeOrdenarTemperaturas, zeComparar])(ZE_NIVELES["5"]);
}

function zeAcsTermometros() {
  const positivo = randomInt(1, 8);
  const negativo = randomInt(1, 8);
  const pos = Math.random() < 0.5;
  const [ta, tb] = pos ? [positivo, -negativo] : [-negativo, positivo];
  return {
    enunciado: `El termómetro A marca ${zeZ(ta)} ºC y el termómetro B marca ${zeZ(tb)} ºC. ¿Cuál marca más frío?`,
    datos: [`A: ${zeZ(ta)} ºC`, `B: ${zeZ(tb)} ºC`],
    operacion: `${zeZ(-negativo)} es negativo (bajo cero) y ${positivo} es positivo.`,
    solucion: `El termómetro ${pos ? "B" : "A"} (${zeZ(-negativo)} ºC): bajo cero hace más frío.`,
  };
}

function zeAcsAscensor() {
  const inicial = randomInt(-2, 4);
  let mov;
  do mov = zeNoCero(-3, 3);
  while (inicial + mov < -2 || inicial + mov > 5);
  const final = inicial + mov;
  const nombre = (p) => (p < 0 ? `el sótano ${-p} (${zeZ(p)})` : p === 0 ? "la planta baja (0)" : `la planta ${p}`);
  return {
    enunciado: `Estás en ${nombre(inicial)}. El ascensor ${mov > 0 ? "sube" : "baja"} ${zePl(Math.abs(mov), "planta", "plantas")}. ¿A qué planta llegas? Puedes dibujar las plantas para ayudarte.`,
    datos: [`Sales de: ${zeZ(inicial)}`, `${mov > 0 ? "Sube" : "Baja"}: ${Math.abs(mov)}`],
    operacion: `${zeZ(inicial)} → ${mov > 0 ? "subo" : "bajo"} ${Math.abs(mov)} → ${zeZ(final)}`,
    solucion: `${nombre(final)}.`,
  };
}

function genNumerosEnterosACS() {
  return siguienteDeBaraja("zeAcs", [zeAcsTermometros, zeAcsAscensor, zeAcsTermometros, zeAcsAscensor])();
}

// Discalculia: los contenidos del curso con números pequeños (hasta 8).
function genNumerosEnterosDiscalculia(curso) {
  const d = ZE_NIVELES.disc;
  if (curso === "6") return siguienteDeBaraja("zeDisc6", [zeRecta, zeComparar, zeOpuestoAbsoluto, zeSumas, zeTemperatura, zeAscensor, zeDiferencia])(d);
  return siguienteDeBaraja("zeDisc5", [zeTemperatura, zeAscensor, zeBuceador, zeSaldo, zeOrdenarTemperaturas, zeComparar])(d);
}

function zeTemperaturaDosCambios() {
  const inicial = randomInt(-15, 10);
  const c1 = zeNoCero(-15, 15);
  const c2 = zeNoCero(-15, 15);
  const final = inicial + c1 + c2;
  const verbo = (c) => `${c > 0 ? "sube" : "baja"} ${zePl(Math.abs(c), "grado", "grados")}`;
  return {
    enunciado: `En un refugio de montaña el termómetro marca ${zeZ(inicial)} ºC al amanecer. Por la mañana ${verbo(c1)} y por la tarde ${verbo(c2)}. ¿Qué temperatura marca al final de la tarde? ¿Cuántos grados ha cambiado desde el amanecer?`,
    datos: [`Amanecer: ${zeZ(inicial)} ºC`, `Mañana: ${zeP(c1)}`, `Tarde: ${zeP(c2)}`],
    operacion: `${zeP(inicial)} + ${zeP(c1)} + ${zeP(c2)} = ${zeP(inicial + c1)} + ${zeP(c2)} = ${zeZ(final)}`,
    solucion: `${zeZ(final)} ºC. ${c1 + c2 === 0 ? "Vuelve a la temperatura del amanecer." : `Ha ${c1 + c2 > 0 ? "subido" : "bajado"} ${zePl(Math.abs(c1 + c2), "grado", "grados")} en total.`}`,
  };
}

function zeHistoria() {
  // Años antes de Cristo como negativos. Como no existe el año 0, la
  // diferencia exacta es un año menos: por eso se pide aproximada.
  const ac = randomInt(2, 6) * 100;
  const dc = randomInt(1, 15) * 100;
  return {
    enunciado: `Una vasija íbera se fabricó en el año ${ac} antes de Cristo y se encontró en una excavación de Andalucía en el año ${dc} después de Cristo. Escribe los dos años como números enteros y calcula, aproximadamente, cuántos años pasaron.`,
    datos: [`Fabricación: ${ac} a. C. → ${zeZ(-ac)}`, `Hallazgo: ${dc} d. C. → ${dc}`],
    operacion: `De ${zeZ(-ac)} a 0 hay ${ac}; de 0 a ${dc} hay ${dc}: ${ac} + ${dc} = ${ac + dc}`,
    solucion: `Unos ${ac + dc} años.`,
  };
}

function genNumerosEnterosAltas() {
  return siguienteDeBaraja("zeAltas", [zeTemperaturaDosCambios, zeHistoria, () => zeDiferencia({ max: 25 }), () => zeSumas({ max: 50 }), () => zeBuceador({ max: 30 })])();
}

// ---- Múltiplos, divisores y números primos ----
// Los problemas reciben un nivel (MD_NIVELES) en vez del curso: así la
// misma situación sirve para 5º, 6º, ACS, discalculia y altas
// capacidades cambiando solo el tamaño de los números. En 5º no salen
// el m.c.m. ni el M.C.D. (son de 6º, como en la página del tema).
const MD_NIVELES = {
  "5": { bases: [3, 4, 5, 6, 7, 8, 9], ninos: [18, 36], sillas: [12, 16, 18, 20, 24, 30, 36], cajas: [4, 6, 8, 10, 12], primos: [11, 50], crit: [2, 3, 5, 10], cifras: 3 },
  "6": { bases: [6, 7, 8, 9, 11, 12, 15], ninos: [40, 90], sillas: [36, 40, 48, 60, 72], cajas: [6, 8, 12, 15, 24], primos: [31, 99], crit: [2, 3, 5, 9, 10], cifras: 4 },
  acs: { bases: [2, 5, 10], ninos: [10, 30], sillas: [], cajas: [2, 5, 10], primos: [], crit: [], cifras: 2 },
  disc: { bases: [2, 3, 4, 5, 10], ninos: [12, 30], sillas: [12, 16, 18, 20], cajas: [2, 4, 5, 10], primos: [7, 30], crit: [2, 5, 10], cifras: 2 },
};

// Baraja por nivel: una ficha no repite situación hasta haberlas usado
// todas. Como cada ficha se genera de golpe, si ha pasado más de un
// segundo desde el último problema se empieza baraja nueva, para que
// una ficha no herede lo que sobró de la anterior.
const FICHA_BARAJAS = {};
let fichaUltimoUso = 0;
function siguienteDeBaraja(clave, generadores) {
  const ahora = Date.now();
  if (ahora - fichaUltimoUso > 1000) Object.keys(FICHA_BARAJAS).forEach((k) => delete FICHA_BARAJAS[k]);
  fichaUltimoUso = ahora;
  if (!FICHA_BARAJAS[clave] || !FICHA_BARAJAS[clave].length) {
    const copia = generadores.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = randomInt(0, i);
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    FICHA_BARAJAS[clave] = copia;
  }
  return FICHA_BARAJAS[clave].pop();
}

function mdDivisores(n) {
  const out = [];
  for (let d = 1; d <= n; d++) if (n % d === 0) out.push(d);
  return out;
}

function mdParejas(n) {
  const out = [];
  for (let d = 1; d * d <= n; d++) if (n % d === 0) out.push(`${d} × ${n / d}`);
  return out;
}

function mdDivision(a, b) {
  return `${a} : ${b} = ${Math.floor(a / b)}, resto ${a % b}`;
}

function multiplosDivisoresLista(nivel) {
  const n = pick(nivel.bases);
  const multiplos = Array.from({ length: 5 }, (_, i) => n * (i + 1));
  return {
    enunciado: `Escribe los 5 primeros múltiplos de ${n} (sin contar el 0).`,
    datos: [`Número: ${n}`],
    operacion: `${n} × 1, ${n} × 2, ${n} × 3, ${n} × 4, ${n} × 5`,
    solucion: `${multiplos.join(", ")}.`,
  };
}

function multiplosDivisoresEquipos(nivel) {
  const k = pick(nivel === MD_NIVELES.acs ? [2] : nivel.bases.filter((b) => b <= 9));
  const [min, max] = nivel.ninos;
  const n = randomInt(min, max);
  const q = Math.floor(n / k);
  const r = n % k;
  if (k === 2) {
    return {
      enunciado: `En el patio hay ${n} niños y niñas. ¿Pueden ponerse todos por parejas sin que nadie se quede solo? ¿Cuántas parejas salen?`,
      datos: [`Niños y niñas: ${n}`, `Por parejas: de 2 en 2`],
      operacion: mdDivision(n, 2),
      solucion: r === 0
        ? `Sí. Salen ${q} parejas y no se queda nadie solo: ${n} es múltiplo de 2 (termina en cifra par).`
        : `No. Salen ${q} parejas y se queda 1 solo: ${n} no es múltiplo de 2 (termina en cifra impar).`,
    };
  }
  return {
    enunciado: `En el patio hay ${n} niños y niñas, y la monitora quiere hacer equipos de ${k}. ¿Puede hacerlo sin que nadie se quede fuera? ¿Cuántos equipos completos salen y cuántos niños se quedan sin equipo?`,
    datos: [`Niños y niñas: ${n}`, `En cada equipo: ${k}`],
    operacion: mdDivision(n, k),
    solucion: r === 0
      ? `Sí. Salen ${q} equipos y no se queda nadie fuera, porque ${k} es divisor de ${n}.`
      : `No. Salen ${q} equipos completos y se ${r === 1 ? "queda 1 niño" : `quedan ${r} niños`} sin equipo, porque ${k} no es divisor de ${n}.`,
  };
}

function multiplosDivisoresSillas(nivel) {
  const n = pick(nivel.sillas);
  return {
    enunciado: `Para la función del colegio hay que colocar ${n} sillas en filas iguales, sin que sobre ninguna. Escribe todas las formas posibles: cuántas filas y cuántas sillas en cada fila.`,
    datos: [`Sillas: ${n}`],
    operacion: `Parejas que multiplicadas dan ${n}: ${mdParejas(n).join(" · ")}`,
    solucion: `${mdDivisores(n).map((d) => `${d} ${d === 1 ? "fila" : "filas"} de ${n / d}`).join(", ")}. Son tantas formas como divisores tiene ${n}: ${mdDivisores(n).join(", ")}.`,
  };
}

function multiplosDivisoresCajas(nivel) {
  const b = pick(nivel.cajas);
  const [p1, p2] = pickTwo(NOMBRES);
  const qOk = randomInt(3, nivel === MD_NIVELES["6"] ? 12 : 9);
  const ok = b * qOk;
  const qNo = randomInt(3, nivel === MD_NIVELES["6"] ? 12 : 9);
  const no = b * qNo + randomInt(1, b - 1);
  const okPrimero = Math.random() < 0.5;
  const [a1, n1, a2, n2] = okPrimero ? [p1, ok, p2, no] : [p1, no, p2, ok];
  const quienOk = okPrimero ? p1 : p2;
  const quienNo = okPrimero ? p2 : p1;
  return {
    enunciado: `En la tienda los rotuladores se venden solo en cajas de ${b}. ${a1} necesita exactamente ${n1} rotuladores y ${a2} necesita ${n2}. ¿Quién puede comprar justo los que necesita con cajas completas? ¿Cuántas cajas compra?`,
    datos: [`Rotuladores por caja: ${b}`, `${a1}: ${n1}`, `${a2}: ${n2}`],
    operacion: `${mdDivision(ok, b)} · ${mdDivision(no, b)}`,
    solucion: `${quienOk}, que compra ${qOk} cajas: ${ok} es múltiplo de ${b} (${b} × ${qOk} = ${ok}). ${quienNo} no puede, porque ${no} no es múltiplo de ${b}.`,
  };
}

function multiplosDivisoresRana(nivel) {
  const b = pick(nivel.bases);
  const pasos = nivel === MD_NIVELES.acs || nivel === MD_NIVELES.disc ? 6 : 8;
  const casillas = Array.from({ length: pasos }, (_, i) => b * (i + 1));
  const pequeno = nivel === MD_NIVELES.acs || nivel === MD_NIVELES.disc;
  const lejos = b * (pequeno ? randomInt(pasos + 2, pasos + 4) : randomInt(pasos + 3, pasos + 12));
  const meta = Math.random() < 0.5 ? lejos : lejos + randomInt(1, b - 1);
  const pisa = meta % b === 0;
  return {
    enunciado: `Una rana sale de la casilla 0 y avanza dando saltos de ${b} en ${b}. Escribe las ${pasos} primeras casillas que pisa. ¿Pisará la casilla ${meta}? ¿Por qué?`,
    datos: [`Salto: ${b} casillas`, `Casilla que se pregunta: ${meta}`],
    operacion: `${b} × 1, ${b} × 2, ${b} × 3… · ${mdDivision(meta, b)}`,
    solucion: `${casillas.join(", ")}. ${pisa ? `Sí pisa la ${meta}: es múltiplo de ${b} (salto ${meta / b}).` : `No pisa la ${meta}: no es múltiplo de ${b}, salta de la ${meta - (meta % b)} a la ${meta - (meta % b) + b}.`}`,
  };
}

const MD_CRITERIO = {
  2: (n) => `termina en ${n % 10}${n % 2 === 0 ? ", cifra par" : ", cifra impar"}`,
  3: (n) => `sus cifras suman ${String(n).split("").join(" + ")} = ${String(n).split("").reduce((s, c) => s + Number(c), 0)}`,
  5: (n) => `termina en ${n % 10}`,
  9: (n) => `sus cifras suman ${String(n).split("").reduce((s, c) => s + Number(c), 0)}`,
  10: (n) => `termina en ${n % 10}`,
};

function multiplosDivisoresCriterios(nivel) {
  const min = nivel.cifras === 4 ? 1000 : 100;
  const max = nivel.cifras === 4 ? 9999 : 999;
  // Se parte de un múltiplo de algún divisor para que casi siempre haya
  // al menos un «sí» entre las bolsas.
  const base = pick([2, 3, 5, 6, 10, 15, 30].concat(nivel.crit.includes(9) ? [9, 18, 45] : []));
  const n = base * randomInt(Math.ceil(min / base), Math.floor(max / base));
  const lista = nivel.crit;
  const filas = lista.map((c) => `De ${c}: ${n % c === 0 ? "sí" : "no"} (${MD_CRITERIO[c](n)})`);
  return {
    enunciado: `En la recogida solidaria del colegio se han juntado ${n} tapones. Sin hacer la división, usa los criterios de divisibilidad: ¿se pueden repartir en bolsas de ${lista.slice(0, -1).join(", ")} o de ${lista[lista.length - 1]} sin que sobre ninguno?`,
    datos: [`Tapones: ${n}`, `Bolsas de: ${lista.join(", ")}`],
    operacion: lista.map((c) => `${c}: ${MD_CRITERIO[c](n)}`).join(" · "),
    solucion: `${filas.join(". ")}.`,
  };
}

function multiplosDivisoresPrimo(nivel) {
  const [min, max] = nivel.primos;
  const esPrimo = (x) => mdDivisores(x).length === 2;
  const quierePrimo = Math.random() < 0.5;
  let n;
  do {
    n = randomInt(min, max);
  } while (esPrimo(n) !== quierePrimo || (!quierePrimo && n % 2 === 0 && Math.random() < 0.6));
  const divs = mdDivisores(n);
  const ejemplo = mdParejas(n)[1];
  return {
    enunciado: `${pick(NOMBRES)} quiere colocar ${n} baldosas formando un rectángulo de más de una fila, con todas las filas iguales. ¿Puede hacerlo? Si puede, escribe una forma. ¿${n} es un número primo o compuesto?`,
    datos: [`Baldosas: ${n}`],
    operacion: `Divisores de ${n}: ${divs.join(", ")}`,
    solucion: quierePrimo
      ? `No puede: ${n} es primo, solo tiene dos divisores (1 y ${n}), así que solo cabe en 1 fila de ${n}.`
      : `Sí: por ejemplo, ${ejemplo.split(" × ")[0]} filas de ${ejemplo.split(" × ")[1]} (${ejemplo} = ${n}). ${n} es compuesto: tiene más de dos divisores.`,
  };
}

// Dos números distintos al azar del rango [min, max].
function randomDistintos(min, max) {
  const a = randomInt(min, max);
  let b = randomInt(min, max - 1);
  if (b >= a) b++;
  return [a, b];
}

function multiplosDivisoresMCM(curso) {
  const [a, b] = curso === "6" ? randomDistintos(6, 15) : randomDistintos(3, 10);
  const resultado = lcm(a, b);
  return {
    enunciado: `Dos autobuses salen juntos de la estación a las 8:00 h. El primero repite su recorrido cada ${a} minutos y el segundo cada ${b} minutos. ¿Dentro de cuántos minutos volverán a coincidir en la estación?`,
    datos: [`Primer autobús: cada ${a} min`, `Segundo autobús: cada ${b} min`],
    operacion: `m.c.m.(${a}, ${b}) = ${resultado}`,
    solucion: `${resultado} minutos. Volverán a coincidir dentro de ${resultado} minutos.`,
  };
}

// Reparto en bolsas iguales: el mayor número de bolsas es el M.C.D. y
// cada bolsa lleva a ÷ M.C.D. caramelos y b ÷ M.C.D. chuches. Los datos
// se construyen a partir del M.C.D. para que nunca salga 1 (una sola
// bolsa) ni dos cantidades iguales.
function multiplosDivisoresMCD(curso) {
  const mcd = curso === "6" ? randomInt(3, 12) : randomInt(2, 6);
  const maxFactor = curso === "6" ? 7 : 5;
  let p, q;
  do {
    [p, q] = randomDistintos(2, maxFactor);
  } while (gcd(p, q) !== 1);
  const a = mcd * p;
  const b = mcd * q;
  return {
    enunciado: `Se quieren preparar bolsas iguales con ${a} caramelos y ${b} chuches, de forma que todas las bolsas tengan lo mismo y no sobre nada. ¿Cuál es el mayor número de bolsas que se pueden preparar? ¿Cuántos caramelos y cuántas chuches llevará cada bolsa?`,
    datos: [`Caramelos: ${a}`, `Chuches: ${b}`],
    operacion: `M.C.D.(${a}, ${b}) = ${mcd}; ${a} : ${mcd} = ${p}; ${b} : ${mcd} = ${q}`,
    solucion: `${mcd} bolsas. Cada bolsa llevará ${p} caramelos y ${q} chuches.`,
  };
}

const MD_PROBLEMAS_5 = [multiplosDivisoresLista, multiplosDivisoresEquipos, multiplosDivisoresSillas, multiplosDivisoresCajas, multiplosDivisoresRana, multiplosDivisoresCriterios, multiplosDivisoresPrimo];

function genMultiplosDivisores(curso) {
  if (curso === "6") {
    const g = siguienteDeBaraja("6", ["mcm", "mcd", "mcm", "mcd", multiplosDivisoresSillas, multiplosDivisoresCriterios, multiplosDivisoresPrimo, multiplosDivisoresCajas]);
    if (g === "mcm") return multiplosDivisoresMCM("6");
    if (g === "mcd") return multiplosDivisoresMCD("6");
    return g(MD_NIVELES["6"]);
  }
  return siguienteDeBaraja("5", MD_PROBLEMAS_5)(MD_NIVELES["5"]);
}

function genMultiplosDivisoresACS() {
  return siguienteDeBaraja("acs", [multiplosDivisoresLista, multiplosDivisoresEquipos, multiplosDivisoresCajas, multiplosDivisoresRana])(MD_NIVELES.acs);
}

// Discalculia: los contenidos del curso con números pequeños (no el
// nivel de ACS). En 6º entran el m.c.m. y el M.C.D. con los rangos
// pequeños de multiplosDivisoresMCM/MCD.
function genMultiplosDivisoresDiscalculia(curso) {
  if (curso === "6") {
    const g = siguienteDeBaraja("disc6", ["mcm", "mcd", multiplosDivisoresSillas, multiplosDivisoresCajas, multiplosDivisoresPrimo, multiplosDivisoresLista]);
    if (g === "mcm") return multiplosDivisoresMCM("5");
    if (g === "mcd") return multiplosDivisoresMCD("5");
    return g(MD_NIVELES.disc);
  }
  return siguienteDeBaraja("disc", [multiplosDivisoresLista, multiplosDivisoresEquipos, multiplosDivisoresSillas, multiplosDivisoresCajas, multiplosDivisoresRana, multiplosDivisoresPrimo])(MD_NIVELES.disc);
}

function multiplosDivisoresTresAutobuses() {
  const [a, b] = randomDistintos(6, 15);
  let c;
  do {
    c = randomInt(6, 15);
  } while (c === a || c === b);
  const resultado = lcm(lcm(a, b), c);
  return {
    enunciado: `Tres autobuses salen juntos de la estación a las 8:00 h. El primero repite su recorrido cada ${a} minutos, el segundo cada ${b} minutos y el tercero cada ${c} minutos. ¿Dentro de cuántos minutos volverán a coincidir los tres a la vez?`,
    datos: [`Autobús 1: cada ${a} min`, `Autobús 2: cada ${b} min`, `Autobús 3: cada ${c} min`],
    operacion: `m.c.m.(${a}, ${b}, ${c}) = ${resultado}`,
    solucion: `${resultado} minutos. Volverán a coincidir los tres dentro de ${resultado} minutos.`,
  };
}

// Un intervalo de exactamente m.c.m. números contiene un único múltiplo
// común: así la respuesta es única.
function multiplosDivisoresCanicas() {
  let a, b, m;
  do {
    [a, b] = randomDistintos(4, 12);
    m = lcm(a, b);
  } while (m > 60 || m === Math.max(a, b));
  const total = m * randomInt(2, Math.max(2, Math.floor(150 / m)));
  const desde = total - randomInt(0, m - 1);
  const hasta = desde + m - 1;
  const nombre = pick(NOMBRES);
  return {
    enunciado: `${nombre} tiene entre ${desde} y ${hasta} canicas. Si las agrupa de ${a} en ${a} no le sobra ninguna, y si las agrupa de ${b} en ${b} tampoco. ¿Cuántas canicas tiene?`,
    datos: [`Entre ${desde} y ${hasta} canicas`, `Grupos de ${a}: no sobra`, `Grupos de ${b}: no sobra`],
    operacion: `Múltiplos comunes de ${a} y ${b}: ${m}, ${m * 2}, ${m * 3}… (m.c.m. = ${m})`,
    solucion: `${total} canicas: es el único múltiplo común de ${a} y ${b} entre ${desde} y ${hasta}.`,
  };
}

function genMultiplosDivisoresAltas() {
  const g = siguienteDeBaraja("altas", ["tres", "canicas", "criterios", "primo"]);
  if (g === "tres") return multiplosDivisoresTresAutobuses();
  if (g === "canicas") return multiplosDivisoresCanicas();
  if (g === "criterios") return multiplosDivisoresCriterios(MD_NIVELES["6"]);
  return multiplosDivisoresPrimo({ primos: [51, 150] });
}

// ---- Fracciones ----
// Como en múltiplos y divisores, los problemas reciben un nivel. En 5º
// (programación del Tema 4): concepto, equivalencia, comparación y
// ordenación con igual numerador o denominador, número mixto y fracción
// de una cantidad. En 6º se añaden el común denominador y la fracción
// irreducible.
const FR_NIVELES = {
  "5": { dens: [3, 4, 5, 6, 8], factores: [2, 3, 4], clase: [12, 30], comunDen: false },
  "6": { dens: [4, 5, 6, 8, 9, 10, 12], factores: [2, 3, 4, 5, 6], clase: [20, 60], comunDen: true },
  disc: { dens: [2, 3, 4, 5, 6], factores: [2, 3], clase: [10, 24], comunDen: false },
  disc6: { dens: [2, 3, 4, 5, 6], factores: [2, 3], clase: [10, 24], comunDen: true },
};

const FR_NOMBRES_FICHA = ["Marta", "Hugo", "Lucía", "Diego", "Sara", "Iván", "Noa", "Bruno"];

function frIrreducible(nivel) {
  let n, d;
  do {
    d = pick(nivel.dens.filter((x) => x <= 8));
    n = randomInt(1, d - 1);
  } while (gcd(n, d) !== 1);
  return [n, d];
}

function fraccionesTartaResto(nivel) {
  const den = pick(nivel.dens.filter((x) => x >= 4));
  const comidos = randomInt(1, den - 1);
  const quedan = den - comidos;
  return {
    enunciado: `Una tarta se divide en ${den} trozos iguales. Se ${comidos === 1 ? "ha comido 1 trozo" : `han comido ${comidos} trozos`}. ¿Qué fracción de la tarta queda? Escríbela también con letras.`,
    datos: [`Trozos totales: ${den}`, `Trozos comidos: ${comidos}`],
    operacion: `${den}/${den} − ${comidos}/${den} = ${quedan}/${den}`,
    solucion: `${quedan}/${den} («${fraccionEnLetras(quedan, den)}»). Queda ${quedan}/${den} de la tarta.`,
  };
}

const FR_NUM_LETRAS = ["cero", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce"];
const FR_DEN_LETRAS = { 2: "medio", 3: "tercio", 4: "cuarto", 5: "quinto", 6: "sexto", 7: "séptimo", 8: "octavo", 9: "noveno", 10: "décimo", 11: "onceavo", 12: "doceavo" };

function fraccionEnLetras(n, d) {
  return n === 1 ? `un ${FR_DEN_LETRAS[d]}` : `${FR_NUM_LETRAS[n]} ${FR_DEN_LETRAS[d]}s`;
}

function fraccionesEquivalente(nivel) {
  const [num, den] = frIrreducible(nivel);
  const factor = pick(nivel.factores);
  const numEq = num * factor;
  const denEq = den * factor;
  if (Math.random() < 0.5) {
    return {
      enunciado: `Completa la fracción equivalente: ${num}/${den} = ?/${denEq}.`,
      datos: [`Fracción: ${num}/${den}`, `Nuevo denominador: ${denEq}`],
      operacion: `${denEq} : ${den} = ${factor}. ${num} × ${factor} = ${numEq}`,
      solucion: `${numEq}/${denEq}. La fracción equivalente es ${numEq}/${denEq}.`,
    };
  }
  return {
    enunciado: `Simplifica para completar la fracción equivalente: ${numEq}/${denEq} = ?/${den}.`,
    datos: [`Fracción: ${numEq}/${denEq}`, `Nuevo denominador: ${den}`],
    operacion: `${denEq} : ${den} = ${factor}. ${numEq} : ${factor} = ${num}`,
    solucion: `${num}/${den}. La fracción equivalente es ${num}/${den}.`,
  };
}

function fraccionesDeGrupo(nivel) {
  const den = pick(nivel.dens.filter((x) => x <= 8));
  const num = randomInt(1, den - 1);
  const [min, max] = nivel.clase;
  const multiplo = randomInt(Math.ceil(min / den), Math.floor(max / den));
  const total = den * multiplo;
  const parte = num * multiplo;
  return {
    enunciado: `En una clase de ${total} alumnos, ${num}/${den} de los alumnos son niñas. ¿Cuántas niñas hay en la clase?`,
    datos: [`Total de alumnos: ${total}`, `Fracción de niñas: ${num}/${den}`],
    operacion: `${total} : ${den} = ${multiplo}. ${multiplo} × ${num} = ${parte}`,
    solucion: `${parte}. Hay ${parte} niñas en la clase.`,
  };
}

// Compara a/b y c/d: en 5º con igual denominador o igual numerador, en
// 6º con distinto denominador (común denominador).
function frParaComparar(nivel) {
  const tipo = nivel.comunDen ? "distinto" : pick(["den", "num"]);
  let a, b, c, d;
  if (tipo === "den") {
    b = d = pick(nivel.dens.filter((x) => x >= 4));
    a = randomInt(1, b - 1);
    do { c = randomInt(1, b - 1); } while (c === a);
  } else if (tipo === "num") {
    a = c = randomInt(1, 2);
    const dens = nivel.dens.filter((x) => x > a);
    b = pick(dens);
    do { d = pick(dens); } while (d === b);
  } else {
    do {
      b = pick(nivel.dens);
      d = pick(nivel.dens);
      a = randomInt(1, b - 1);
      c = randomInt(1, d - 1);
    } while (b === d || a * d === b * c || lcm(b, d) > 60);
  }
  return { tipo, a, b, c, d };
}

function frRazonComparar({ tipo, a, b, c, d }) {
  if (tipo === "den") return `Mismo denominador (${b}): es mayor la de numerador más grande`;
  if (tipo === "num") return `Mismo numerador (${a}): es mayor la de denominador más pequeño`;
  const m = lcm(b, d);
  return `m.c.m.(${b}, ${d}) = ${m}: ${a}/${b} = ${a * (m / b)}/${m} y ${c}/${d} = ${c * (m / d)}/${m}`;
}

function fraccionesComparar(nivel) {
  const f = frParaComparar(nivel);
  const [p1, p2] = pickTwo(FR_NOMBRES_FICHA);
  const mayorEsA = f.a * f.d > f.c * f.b;
  const signo = mayorEsA ? ">" : "<";
  return {
    enunciado: `${p1} ha leído ${f.a}/${f.b} de un libro y ${p2} ha leído ${f.c}/${f.d} del mismo libro. ¿Quién ha leído más? Escribe las dos fracciones con el signo < o > y explica cómo lo sabes.`,
    datos: [`${p1}: ${f.a}/${f.b}`, `${p2}: ${f.c}/${f.d}`],
    operacion: frRazonComparar(f),
    solucion: `${f.a}/${f.b} ${signo} ${f.c}/${f.d}. Ha leído más ${mayorEsA ? p1 : p2}.`,
  };
}

function fraccionesOrdenar(nivel) {
  let fr;
  if (nivel.comunDen) {
    do {
      const dens = [2, 3, 4, 5, 6, 8, 10, 12].sort(() => Math.random() - 0.5).slice(0, 3);
      fr = dens.map((d) => [randomInt(1, d - 1), d]);
    } while (new Set(fr.map(([n, d]) => n / d)).size < 3 || fr.some(([n, d]) => gcd(n, d) !== 1) || lcm(lcm(fr[0][1], fr[1][1]), fr[2][1]) > 60);
  } else if (Math.random() < 0.5) {
    const d = pick(nivel.dens.filter((x) => x >= 4));
    const nums = [];
    while (nums.length < 3) {
      const n = randomInt(1, d - 1);
      if (!nums.includes(n)) nums.push(n);
    }
    fr = nums.map((n) => [n, d]);
  } else {
    const n = randomInt(1, 2);
    const dens = nivel.dens.filter((x) => x > n).sort(() => Math.random() - 0.5).slice(0, 3);
    fr = dens.map((d) => [n, d]);
  }
  const nombres = FR_NOMBRES_FICHA.slice().sort(() => Math.random() - 0.5).slice(0, 3);
  const ordenados = fr.map((f, i) => ({ f, nombre: nombres[i] })).sort((x, y) => x.f[0] / x.f[1] - y.f[0] / y.f[1]);
  const m = lcm(lcm(fr[0][1], fr[1][1]), fr[2][1]);
  const mismoDen = fr.every(([, d]) => d === fr[0][1]);
  const mismoNum = fr.every(([n]) => n === fr[0][0]);
  return {
    enunciado: `En una carrera de relevos, ${nombres.map((nm, i) => `${nm} ha recorrido ${fr[i][0]}/${fr[i][1]} del circuito`).join(", ").replace(/, ([^,]*)$/, " y $1")}. Ordena las fracciones de menor a mayor. ¿Quién ha recorrido más?`,
    datos: nombres.map((nm, i) => `${nm}: ${fr[i][0]}/${fr[i][1]}`),
    operacion: mismoDen
      ? `Mismo denominador: se ordenan por el numerador`
      : mismoNum
        ? `Mismo numerador: cuanto mayor es el denominador, menor es la fracción`
        : `Denominador común ${m}: ${fr.map(([n, d]) => `${n}/${d} = ${n * (m / d)}/${m}`).join(" · ")}`,
    solucion: `${ordenados.map((o) => `${o.f[0]}/${o.f[1]}`).join(" < ")}. Ha recorrido más ${ordenados[2].nombre}.`,
  };
}

function fraccionesMixto(nivel) {
  const d = pick(nivel.dens.filter((x) => x >= 3 && x <= 8));
  const q = randomInt(1, nivel === FR_NIVELES["6"] ? 4 : 3);
  const r = randomInt(1, d - 1);
  const n = q * d + r;
  return {
    enunciado: `Cada tarta se corta en ${d} trozos iguales y en la mesa hay ${n} trozos. ¿Cuántas tartas enteras se pueden formar y cuántos trozos sobran? Escribe la cantidad como fracción y como número mixto.`,
    datos: [`Trozos por tarta: ${d}`, `Trozos en la mesa: ${n}`],
    operacion: `${n} : ${d} = ${q}, resto ${r}`,
    solucion: `${q} ${q === 1 ? "tarta entera" : "tartas enteras"} y ${r} ${r === 1 ? "trozo" : "trozos"}: ${n}/${d} = ${q} ${r}/${d}.`,
  };
}

function fraccionesSimplificar(nivel) {
  const [n, d] = frIrreducible(nivel);
  const g = pick(nivel === FR_NIVELES.disc6 ? [2, 3] : [2, 3, 4, 5, 6]);
  const N = n * g;
  const D = d * g;
  return {
    enunciado: `Simplifica la fracción ${N}/${D} hasta llegar a la fracción irreducible.`,
    datos: [`Fracción: ${N}/${D}`],
    operacion: `M.C.D.(${N}, ${D}) = ${g}. ${N} : ${g} = ${n}; ${D} : ${g} = ${d}`,
    solucion: `${n}/${d}. Es irreducible: ${n} y ${d} no tienen más divisor común que el 1.`,
  };
}

function genFracciones(curso) {
  if (curso === "6") {
    return siguienteDeBaraja("fr6", [fraccionesEquivalente, fraccionesDeGrupo, fraccionesComparar, fraccionesOrdenar, fraccionesSimplificar, fraccionesMixto])(FR_NIVELES["6"]);
  }
  return siguienteDeBaraja("fr5", [fraccionesTartaResto, fraccionesEquivalente, fraccionesDeGrupo, fraccionesComparar, fraccionesOrdenar, fraccionesMixto])(FR_NIVELES["5"]);
}

function fraccionesTartaACS() {
  const den = pick([2, 3, 4]);
  const comidos = randomInt(1, den - 1);
  const quedan = den - comidos;
  return {
    enunciado: `Una tarta se divide en ${den} trozos iguales. Se ${comidos === 1 ? "ha comido 1 trozo" : `han comido ${comidos} trozos`}. ¿Qué fracción de la tarta queda?`,
    datos: [`Trozos totales: ${den}`, `Trozos comidos: ${comidos}`],
    operacion: `${den}/${den} − ${comidos}/${den} = ${quedan}/${den}`,
    solucion: `${quedan}/${den}. Queda ${quedan}/${den} de la tarta.`,
  };
}

function fraccionesMitadACS() {
  const [den, nombre] = pick([[2, "la mitad"], [4, "la cuarta parte"]]);
  const total = den * randomInt(2, 5);
  return {
    enunciado: `${pick(FR_NOMBRES_FICHA)} tiene ${total} cromos y regala ${nombre} (1/${den}) a su hermana. ¿Cuántos cromos le regala?`,
    datos: [`Cromos: ${total}`, `Regala: 1/${den}`],
    operacion: `${total} : ${den} = ${total / den}`,
    solucion: `${total / den} cromos. Le regala ${total / den} cromos.`,
  };
}

function genFraccionesACS() {
  return siguienteDeBaraja("frAcs", [fraccionesTartaACS, fraccionesMitadACS, fraccionesTartaACS])();
}

// Discalculia: los contenidos del curso con denominadores hasta 6 (no
// el nivel de ACS). En 6º entran el común denominador y la fracción
// irreducible con números pequeños.
function genFraccionesDiscalculia(curso) {
  if (curso === "6") {
    return siguienteDeBaraja("frDisc6", [fraccionesEquivalente, fraccionesDeGrupo, fraccionesComparar, fraccionesSimplificar, fraccionesMixto])(FR_NIVELES.disc6);
  }
  return siguienteDeBaraja("frDisc", [fraccionesTartaResto, fraccionesEquivalente, fraccionesDeGrupo, fraccionesComparar, fraccionesMixto])(FR_NIVELES.disc);
}

function fraccionesHuerto() {
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
    operacion: `${total} : ${den1} × ${num1} = ${parteUno} tomateras. ${parteUno} : ${den2} × ${num2} = ${parteDos}`,
    solucion: `${parteDos}. Hay ${parteDos} tomateras con fruto.`,
  };
}

function genFraccionesAltas() {
  return siguienteDeBaraja("frAltas", [fraccionesHuerto, () => fraccionesOrdenar(FR_NIVELES["6"]), () => fraccionesComparar(FR_NIVELES["6"]), () => fraccionesSimplificar(FR_NIVELES["6"])])();
}

// ---- Operaciones con fracciones ----
// 5º (programación del Tema 5): suma y resta con igual denominador,
// fracción de una cantidad y operaciones combinadas con igual
// denominador. 6º: distinto denominador, multiplicación, división,
// la fracción como división y combinadas con prioridad.
const OF_NIVELES = {
  "5": { dens: [4, 5, 6, 7, 8, 9, 10], dist: [2, 3, 4, 5, 6], max: 120 },
  "6": { dens: [4, 5, 6, 8, 9, 10, 12], dist: [2, 3, 4, 5, 6, 8], max: 180 },
  disc5: { dens: [3, 4, 5, 6], dist: [2, 3, 4], max: 40 },
  disc6: { dens: [3, 4, 5, 6], dist: [2, 3, 4], max: 40 },
};

// "= 1/2" o "= 2" si la fracción se puede simplificar.
function ofSimplifica(n, d) {
  const g = gcd(n, d);
  if (g === 1 || n === 0) return "";
  return d / g === 1 ? ` = ${n / g}` : ` = ${n / g}/${d / g}`;
}

function ofSumaResta(nivel) {
  const d = pick(nivel.dens);
  if (Math.random() < 0.5) {
    const a = randomInt(1, d - 1);
    const b = randomInt(1, d - 1);
    return {
      enunciado: `Calcula: ${a}/${d} + ${b}/${d}.`,
      datos: [`Fracción 1: ${a}/${d}`, `Fracción 2: ${b}/${d}`],
      operacion: `Mismo denominador: ${a} + ${b} = ${a + b}. ${a}/${d} + ${b}/${d} = ${a + b}/${d}`,
      solucion: `${a + b}/${d}${ofSimplifica(a + b, d)}. El resultado es ${a + b}/${d}.`,
    };
  }
  const a = randomInt(2, d);
  const b = randomInt(1, a - 1);
  return {
    enunciado: `Calcula: ${a}/${d} − ${b}/${d}.`,
    datos: [`Fracción 1: ${a}/${d}`, `Fracción 2: ${b}/${d}`],
    operacion: `Mismo denominador: ${a} − ${b} = ${a - b}. ${a}/${d} − ${b}/${d} = ${a - b}/${d}`,
    solucion: `${a - b}/${d}${ofSimplifica(a - b, d)}. El resultado es ${a - b}/${d}.`,
  };
}

function ofPizza(nivel) {
  const d = pick(nivel.dens.filter((x) => x >= 4));
  const a = randomInt(1, d - 2);
  const b = randomInt(1, d - 1 - a);
  const [p1, p2] = pickTwo(NOMBRES);
  return {
    enunciado: `Una pizza está cortada en ${d} trozos iguales. ${p1} se come ${a}/${d} y ${p2}, ${b}/${d}. ¿Qué fracción de pizza se han comido entre los dos? ¿Qué fracción queda?`,
    datos: [`${p1}: ${a}/${d}`, `${p2}: ${b}/${d}`],
    operacion: `${a}/${d} + ${b}/${d} = ${a + b}/${d}; ${d}/${d} − ${a + b}/${d} = ${d - a - b}/${d}`,
    solucion: `Se han comido ${a + b}/${d} y queda ${d - a - b}/${d} de la pizza.`,
  };
}

function ofCantidad(nivel) {
  const d = pick(nivel.dens.filter((x) => x <= 8));
  const n = randomInt(1, d - 1);
  const m = randomInt(Math.ceil(20 / d), Math.floor(nivel.max / d));
  const T = d * m;
  const leidas = n * m;
  return {
    enunciado: `Un libro tiene ${T} páginas y ${pick(NOMBRES)} ya ha leído ${n}/${d} del libro. ¿Cuántas páginas ha leído? ¿Cuántas le quedan por leer?`,
    datos: [`Páginas del libro: ${T}`, `Fracción leída: ${n}/${d}`],
    operacion: `${T} : ${d} = ${m}; ${m} × ${n} = ${leidas}; ${T} − ${leidas} = ${T - leidas}`,
    solucion: `Ha leído ${leidas} páginas y le quedan ${T - leidas}.`,
  };
}

function ofDinero(nivel) {
  const d = pick(nivel.dens.filter((x) => x <= 6));
  const n = randomInt(1, d - 1);
  const m = randomInt(Math.ceil(10 / d), Math.floor(Math.min(nivel.max, 90) / d));
  const T = d * m;
  const gasto = n * m;
  return {
    enunciado: `${pick(NOMBRES)} tiene ${T} € ahorrados y se gasta ${n}/${d} en un regalo. ¿Cuánto cuesta el regalo? ¿Cuánto dinero le queda?`,
    datos: [`Ahorros: ${T} €`, `Fracción gastada: ${n}/${d}`],
    operacion: `${T} : ${d} = ${m}; ${m} × ${n} = ${gasto}; ${T} − ${gasto} = ${T - gasto}`,
    solucion: `El regalo cuesta ${gasto} € y le quedan ${T - gasto} €.`,
  };
}

// Reto de la UDI del Tema 5: la energía que queda al final del día.
function ofEnergia(nivel) {
  const d = pick(nivel.dens.filter((x) => x >= 5));
  const a = randomInt(1, d - 3);
  const b = randomInt(1, d - 2 - a);
  const c = randomInt(1, d - 1 - a - b);
  const r = d - a - b - c;
  return {
    enunciado: `Empiezas el día con toda tu energía (1). En el colegio gastas ${a}/${d}, en el entrenamiento ${b}/${d} y haciendo los deberes ${c}/${d}. ¿Qué fracción de energía te queda por la noche?`,
    datos: [`Colegio: ${a}/${d}`, `Entrenamiento: ${b}/${d}`, `Deberes: ${c}/${d}`],
    operacion: `1 − (${a}/${d} + ${b}/${d} + ${c}/${d}) = ${d}/${d} − ${a + b + c}/${d} = ${r}/${d}`,
    solucion: `${r}/${d}${ofSimplifica(r, d)}. Te queda ${r}/${d} de energía.`,
  };
}

function ofCombinadaIgual(nivel) {
  const d = pick(nivel.dens.filter((x) => x >= 5));
  const b = randomInt(1, d - 2);
  const c = randomInt(1, d - 1 - b);
  const a = b + c + randomInt(1, d - 1);
  const r = a - b - c;
  return {
    enunciado: `Calcula: ${a}/${d} − (${b}/${d} + ${c}/${d}).`,
    datos: [`Operación combinada con denominador ${d}`],
    operacion: `Primero el paréntesis: ${b}/${d} + ${c}/${d} = ${b + c}/${d}. Después: ${a}/${d} − ${b + c}/${d} = ${r}/${d}`,
    solucion: `${r}/${d}${ofSimplifica(r, d)}. El resultado es ${r}/${d}.`,
  };
}

function ofDosFracciones(dens) {
  let b, d;
  do {
    b = pick(dens);
    d = pick(dens);
  } while (b === d || lcm(b, d) > 36);
  return [ofNumeradorIrreducible(b), b, ofNumeradorIrreducible(d), d];
}

// Numerador al azar que deja la fracción irreducible (1/2, no 2/4).
function ofNumeradorIrreducible(d) {
  let n;
  do {
    n = randomInt(1, d - 1);
  } while (gcd(n, d) !== 1);
  return n;
}

function ofDistinta(nivel) {
  let [n1, d1, n2, d2] = ofDosFracciones(nivel.dist);
  const resta = Math.random() < 0.5;
  if (resta && n1 * d2 < n2 * d1) [n1, d1, n2, d2] = [n2, d2, n1, d1];
  if (resta && n1 * d2 === n2 * d1) return ofDistinta(nivel);
  const m = lcm(d1, d2);
  const A = n1 * (m / d1);
  const C = n2 * (m / d2);
  const r = resta ? A - C : A + C;
  const op = resta ? "−" : "+";
  return {
    enunciado: `Calcula: ${n1}/${d1} ${op} ${n2}/${d2}.`,
    datos: [`Fracción 1: ${n1}/${d1}`, `Fracción 2: ${n2}/${d2}`],
    operacion: `m.c.m.(${d1}, ${d2}) = ${m}. ${n1}/${d1} ${op} ${n2}/${d2} = ${A}/${m} ${op} ${C}/${m} = ${r}/${m}`,
    solucion: `${r}/${m}${ofSimplifica(r, m)}. El resultado es ${r}/${m}${ofSimplifica(r, m)}.`,
  };
}

function ofMultiplicar(nivel) {
  if (Math.random() < 0.4) {
    const den = pick(nivel.dist.concat([7, 8]));
    const num = ofNumeradorIrreducible(den);
    const entero = randomInt(2, 6);
    const p = num * entero;
    return {
      enunciado: `Calcula: ${num}/${den} × ${entero}.`,
      datos: [`Fracción: ${num}/${den}`, `Número: ${entero}`],
      operacion: `${num} × ${entero} = ${p}; el denominador no cambia: ${p}/${den}`,
      solucion: `${p}/${den}${ofSimplifica(p, den)}. El resultado es ${p}/${den}.`,
    };
  }
  const [a, b, c, d] = ofDosFracciones(nivel.dist.concat([7, 8]));
  return {
    enunciado: `Calcula: ${a}/${b} × ${c}/${d}.`,
    datos: [`Fracción 1: ${a}/${b}`, `Fracción 2: ${c}/${d}`],
    operacion: `(${a} × ${c})/(${b} × ${d}) = ${a * c}/${b * d}`,
    solucion: `${a * c}/${b * d}${ofSimplifica(a * c, b * d)}. El resultado es ${a * c}/${b * d}.`,
  };
}

function ofDividir(nivel) {
  let a, b, c, d;
  do {
    [a, b, c, d] = ofDosFracciones(nivel.dist.concat([7, 8]));
  } while (a * d === b * c);
  return {
    enunciado: `Calcula: ${a}/${b} : ${c}/${d}.`,
    datos: [`Fracción 1: ${a}/${b}`, `Fracción 2: ${c}/${d}`],
    operacion: `${a}/${b} × ${d}/${c} = (${a} × ${d})/(${b} × ${c}) = ${a * d}/${b * c}`,
    solucion: `${a * d}/${b * c}${ofSimplifica(a * d, b * c)}. El resultado es ${a * d}/${b * c}.`,
  };
}

function ofComoDivision() {
  const d = pick([2, 4, 5, 10]);
  let n;
  do {
    n = randomInt(2, d * 2);
  } while (n % d === 0);
  const dec = String(n / d).replace(".", ",");
  return {
    enunciado: `Se reparten ${n} pizzas iguales entre ${d} amigos a partes iguales. ¿Qué fracción de pizza le toca a cada uno? Escríbela también como número decimal.`,
    datos: [`Pizzas: ${n}`, `Amigos: ${d}`],
    operacion: `${n} : ${d} = ${n}/${d} = ${dec}`,
    solucion: `${n}/${d} de pizza (${dec}) para cada uno.`,
  };
}

function ofPrioridad(nivel) {
  let a, b, c, d, e, f, num, den;
  const resta = Math.random() < 0.4;
  do {
    b = pick(nivel.dist);
    a = ofNumeradorIrreducible(b);
    d = pick(nivel.dist);
    c = ofNumeradorIrreducible(d);
    f = pick(nivel.dist);
    e = ofNumeradorIrreducible(f);
    const m = lcm(b, d * f);
    num = resta ? a * (m / b) - c * e * (m / (d * f)) : a * (m / b) + c * e * (m / (d * f));
    den = m;
  } while (num <= 0 || den > 60);
  const op = resta ? "−" : "+";
  return {
    enunciado: `Calcula respetando la prioridad de las operaciones: ${a}/${b} ${op} ${c}/${d} × ${e}/${f}.`,
    datos: [`Primero la multiplicación, después la ${resta ? "resta" : "suma"}`],
    operacion: `${c}/${d} × ${e}/${f} = ${c * e}/${d * f}; ${a}/${b} ${op} ${c * e}/${d * f} = ${num}/${den}`,
    solucion: `${num}/${den}${ofSimplifica(num, den)}. El resultado es ${num}/${den}${ofSimplifica(num, den)}.`,
  };
}

function genOperacionesFracciones(curso) {
  if (curso === "6") {
    return siguienteDeBaraja("of6", [ofDistinta, ofDistinta, ofMultiplicar, ofDividir, ofComoDivision, ofPrioridad, ofCantidad])(OF_NIVELES["6"]);
  }
  return siguienteDeBaraja("of5", [ofSumaResta, ofSumaResta, ofPizza, ofCantidad, ofDinero, ofCombinadaIgual, ofEnergia])(OF_NIVELES["5"]);
}

function ofRegaloACS() {
  const den = pick([2, 3, 4]);
  const multiplo = randomInt(2, 6);
  const total = den * multiplo;
  const resultado = total / den;
  const objeto = pick(["caramelos", "cromos", "canicas", "galletas"]);
  return {
    enunciado: `Tengo ${total} ${objeto} y regalo 1/${den}. ¿${cuantosFor(objeto)} ${objeto} regalo?`,
    datos: [`Total: ${total} ${objeto}`, `Fracción: 1/${den}`],
    operacion: `${total} : ${den} = ${resultado}`,
    solucion: `${resultado}. Regalo ${resultado} ${objeto}.`,
  };
}

function ofSumaACS() {
  const d = pick([3, 4]);
  const a = randomInt(1, d - 2 || 1);
  const b = randomInt(1, d - a - 1 || 1);
  return {
    enunciado: `Una tableta de chocolate tiene ${d} trozos iguales. Me como ${a}/${d} por la mañana y ${b}/${d} por la tarde. ¿Qué fracción de la tableta me he comido?`,
    datos: [`Mañana: ${a}/${d}`, `Tarde: ${b}/${d}`],
    operacion: `${a}/${d} + ${b}/${d} = ${a + b}/${d}`,
    solucion: `${a + b}/${d}. Me he comido ${a + b}/${d} de la tableta.`,
  };
}

function genOperacionesFraccionesACS() {
  return siguienteDeBaraja("ofAcs", [ofRegaloACS, ofRegaloACS, ofSumaACS])();
}

// Discalculia: los contenidos del curso con números pequeños (no el
// nivel de ACS), como en la práctica de la página.
function genOperacionesFraccionesDiscalculia(curso) {
  if (curso === "6") {
    return siguienteDeBaraja("ofDisc6", [ofDistinta, ofMultiplicar, ofDividir, ofComoDivision, ofCantidad])(OF_NIVELES.disc6);
  }
  return siguienteDeBaraja("ofDisc5", [ofSumaResta, ofPizza, ofCantidad, ofDinero, ofCombinadaIgual])(OF_NIVELES.disc5);
}

function ofExcursion() {
  const den1 = randomInt(3, 6);
  const num1 = randomInt(1, den1 - 1);
  const den2 = randomInt(2, 5);
  const num2 = randomInt(1, den2 - 1);
  const k = randomInt(2, 5);
  const total = den1 * den2 * k;
  const van = (total / den1) * num1;
  const bocadillo = (van / den2) * num2;
  return {
    enunciado: `En un colegio hay ${total} alumnos. ${num1}/${den1} van de excursión y, de los que van, ${num2}/${den2} llevan bocadillo. ¿Cuántos alumnos llevan bocadillo? ¿Qué fracción del total de alumnos son?`,
    datos: [`Alumnos: ${total}`, `Van de excursión: ${num1}/${den1}`, `Con bocadillo: ${num2}/${den2} de los que van`],
    operacion: `${total} : ${den1} × ${num1} = ${van}; ${van} : ${den2} × ${num2} = ${bocadillo}; ${num2}/${den2} × ${num1}/${den1} = ${num1 * num2}/${den1 * den2}`,
    solucion: `${bocadillo} alumnos, que son ${num1 * num2}/${den1 * den2}${ofSimplifica(num1 * num2, den1 * den2)} del total.`,
  };
}

function genOperacionesFraccionesAltas() {
  return siguienteDeBaraja("ofAltas", [ofExcursion, () => ofDividir(OF_NIVELES["6"]), () => ofPrioridad(OF_NIVELES["6"]), () => ofEnergia(OF_NIVELES["6"])])();
}

// ---- Números decimales ----
// 5º (Temas 6 y 7): leer y escribir, descomponer, fracción decimal,
// comparar y ordenar, la recta y la suma y resta. 6º: además redondear
// y pasar cualquier fracción a decimal. Los valores van en milésimas
// enteras para no arrastrar errores de coma flotante.
const DE_NIVELES = {
  "5": { entMax: 20, kMax: 3, kSuma: 2 },
  "6": { entMax: 99, kMax: 3, kSuma: 3 },
  acs: { entMax: 9, kMax: 1, kSuma: 1 },
  disc: { entMax: 9, kMax: 2, kSuma: 2 },
};

function deFmt(mil, k) {
  const ent = Math.floor(mil / 1000);
  return k === 0 ? String(ent) : `${ent},${String(mil % 1000).padStart(3, "0").slice(0, k)}`;
}

function deCifras(mil) {
  return mil % 1000 === 0 ? 0 : mil % 100 === 0 ? 1 : mil % 10 === 0 ? 2 : 3;
}

const deMin = (mil) => deFmt(mil, deCifras(mil));

function deAleatorio(nivel, k, entMin = 0) {
  let f;
  do {
    f = randomInt(1, Math.pow(10, k) - 1);
  } while (f % 10 === 0);
  return randomInt(entMin, nivel.entMax) * 1000 + f * Math.pow(10, 3 - k);
}

const DE_UNI_F = ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuna", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
const DE_DECENAS = { 3: "treinta", 4: "cuarenta", 5: "cincuenta", 6: "sesenta", 7: "setenta", 8: "ochenta", 9: "noventa" };
const DE_CENTENAS_F = { 1: "ciento", 2: "doscientas", 3: "trescientas", 4: "cuatrocientas", 5: "quinientas", 6: "seiscientas", 7: "setecientas", 8: "ochocientas", 9: "novecientas" };

function dePalabras(n) {
  if (n < 30) return DE_UNI_F[n];
  if (n < 100) return DE_DECENAS[Math.floor(n / 10)] + (n % 10 ? " y " + DE_UNI_F[n % 10] : "");
  if (n === 100) return "cien";
  return DE_CENTENAS_F[Math.floor(n / 100)] + (n % 100 ? " " + dePalabras(n % 100) : "");
}

const DE_LUGAR = { 1: ["décima", "décimas"], 2: ["centésima", "centésimas"], 3: ["milésima", "milésimas"] };

function deLeer(mil, k) {
  const ent = Math.floor(mil / 1000);
  const dec = Math.floor((mil % 1000) / Math.pow(10, 3 - k));
  const partes = [];
  if (ent > 0) partes.push(`${dePalabras(ent)} ${ent === 1 ? "unidad" : "unidades"}`);
  if (dec > 0) partes.push(`${dePalabras(dec)} ${DE_LUGAR[k][dec === 1 ? 0 : 1]}`);
  return partes.join(" y ");
}

function deLeerEscribir(nivel) {
  const k1 = randomInt(1, nivel.kMax);
  const k2 = randomInt(1, nivel.kMax);
  const a = deAleatorio(nivel, k1);
  const b = deAleatorio(nivel, k2);
  return {
    enunciado: `Escribe con cifras: «${deLeer(a, k1)}». Escribe con letras: ${deFmt(b, k2)}.`,
    datos: [`Con cifras: «${deLeer(a, k1)}»`, `Con letras: ${deFmt(b, k2)}`],
    operacion: `${DE_LUGAR[k1][1]}: ${k1 === 1 ? "1 cifra decimal" : `${k1} cifras decimales`} · ${deFmt(b, k2)}: la última cifra está en las ${DE_LUGAR[k2][1]}`,
    solucion: `${deFmt(a, k1)} · «${deLeer(b, k2)}».`,
  };
}

function deDescomponer(nivel) {
  const k = Math.max(2, nivel.kMax);
  let mil, cifras;
  do {
    mil = deAleatorio(nivel, k, 1);
    cifras = deFmt(mil, k).replace(",", "");
  } while (new Set(cifras).size !== cifras.length);
  const num = deFmt(mil, k);
  const dec = num.split(",")[1];
  const pos = randomInt(1, k);
  const ent = Math.floor(mil / 1000);
  return {
    enunciado: `Descompón el número ${num} en unidades, décimas${k === 3 ? ", centésimas y milésimas" : " y centésimas"}. ¿Cuánto vale el ${dec[pos - 1]}?`,
    datos: [`Número: ${num}`],
    operacion: `${ent} U + ${dec.split("").map((c, i) => `${c} ${["d", "c", "m"][i]}`).join(" + ")}`,
    solucion: `${num} = ${[String(ent)].concat(dec.split("").map((c, i) => (c === "0" ? null : deFmt(Number(c) * Math.pow(10, 2 - i), i + 1))).filter(Boolean)).join(" + ")}. El ${dec[pos - 1]} vale ${dec[pos - 1]} ${DE_LUGAR[pos][dec[pos - 1] === "1" ? 0 : 1]} (${deFmt(Number(dec[pos - 1]) * Math.pow(10, 3 - pos), pos)}).`,
  };
}

function deFraccion(nivel) {
  const k1 = randomInt(1, nivel.kMax);
  const den = Math.pow(10, k1);
  let n;
  do {
    n = randomInt(1, den * 2);
  } while (n % 10 === 0 || n === den);
  const k2 = randomInt(1, nivel.kMax);
  const b = deAleatorio({ entMax: 0 }, k2);
  const nb = b / Math.pow(10, 3 - k2);
  return {
    enunciado: `Escribe en forma decimal la fracción ${n}/${den}, y en forma de fracción decimal el número ${deFmt(b, k2)}.`,
    datos: [`Fracción: ${n}/${den}`, `Decimal: ${deFmt(b, k2)}`],
    operacion: `${n}/${den} son ${n} ${DE_LUGAR[k1][1]} · ${deFmt(b, k2)} son ${nb} ${DE_LUGAR[k2][nb === 1 ? 0 : 1]}`,
    solucion: `${n}/${den} = ${deFmt(n * Math.pow(10, 3 - k1), k1)} · ${deFmt(b, k2)} = ${nb}/${Math.pow(10, k2)}.`,
  };
}

function deOrdenar(nivel) {
  const nombres = NOMBRES.slice().sort(() => Math.random() - 0.5).slice(0, 4);
  const vals = new Set();
  // Alturas reales de 10-12 años: entre 1,30 y 1,65 m, con una o dos cifras decimales.
  while (vals.size < 4) vals.add(Math.random() < 0.3 ? randomInt(13, 16) * 100 : randomInt(130, 165) * 10);
  const alturas = [...vals];
  const orden = alturas.map((v, i) => ({ v, n: nombres[i] })).sort((x, y) => x.v - y.v);
  return {
    enunciado: `Estas son las alturas de cuatro amigos: ${nombres.map((n, i) => `${n}, ${deMin(alturas[i])} m`).join("; ")}. Ordénalas de menor a mayor. ¿Quién es el más alto?`,
    datos: nombres.map((n, i) => `${n}: ${deMin(alturas[i])} m`),
    operacion: `Igualando con ceros: ${alturas.map((v) => deFmt(v, 2)).join(" · ")}`,
    solucion: `${orden.map((o) => deMin(o.v)).join(" < ")}. El más alto es ${orden[3].n}.`,
  };
}

function deRecta(nivel) {
  const ent = randomInt(0, Math.min(nivel.entMax, 9));
  if (nivel.kMax === 1) {
    return {
      enunciado: `Escribe los números decimales que hay en la recta entre ${ent} y ${ent + 1}, de décima en décima.`,
      datos: [`Desde ${ent} hasta ${ent + 1}`],
      operacion: `Cada paso es 0,1`,
      solucion: `${Array.from({ length: 9 }, (_, i) => deFmt(ent * 1000 + (i + 1) * 100, 1)).join("; ")}.`,
    };
  }
  const d = randomInt(1, 8);
  const lo = ent * 1000 + d * 100;
  return {
    enunciado: `Escribe tres números decimales que estén entre ${deFmt(lo, 1)} y ${deFmt(lo + 100, 1)} en la recta numérica.`,
    datos: [`Entre ${deFmt(lo, 1)} y ${deFmt(lo + 100, 1)}`],
    operacion: `${deFmt(lo, 1)} = ${deFmt(lo, 2)} y ${deFmt(lo + 100, 1)} = ${deFmt(lo + 100, 2)}`,
    solucion: `Cualquiera de ${deFmt(lo + 10, 2)} a ${deFmt(lo + 90, 2)}, por ejemplo ${deFmt(lo + 20, 2)}; ${deFmt(lo + 50, 2)}; ${deFmt(lo + 80, 2)}.`,
  };
}

function deSumaResta(nivel) {
  const resta = Math.random() < 0.5;
  const ka = randomInt(1, nivel.kSuma);
  let kb = randomInt(1, nivel.kSuma);
  if (nivel.kSuma > 1 && ka === kb) kb = ka === 1 ? 2 : 1;
  let a = deAleatorio(nivel, ka, resta ? 1 : 0);
  let b = deAleatorio(nivel, kb);
  if (resta && a < b) [a, b] = [b, a];
  if (resta && a === b) a += 1000;
  const k = Math.max(deCifras(a), deCifras(b));
  const r = resta ? a - b : a + b;
  const op = resta ? "−" : "+";
  return {
    enunciado: `Calcula en columna: ${deMin(a)} ${op} ${deMin(b)}.`,
    datos: [`Primer número: ${deMin(a)}`, `Segundo número: ${deMin(b)}`],
    operacion: `Con las comas alineadas: ${deFmt(a, k)} ${op} ${deFmt(b, k)} = ${deFmt(r, k)}`,
    solucion: `${deMin(r)}. El resultado es ${deMin(r)}.`,
  };
}

// Reto de la UDI del Tema 7: lista de gastos e ingresos de una campaña.
function deCampana(nivel) {
  const centimos = (max) => randomInt(2, max) * 100 + randomInt(0, 19) * 5;
  const g1 = centimos(nivel === DE_NIVELES["6"] ? 30 : 15);
  const g2 = centimos(nivel === DE_NIVELES["6"] ? 20 : 9);
  const gastos = g1 + g2;
  const ingreso = (Math.ceil(gastos / 500) * 5 + randomInt(1, 4) * 5) * 100;
  const queda = ingreso - gastos;
  const e = (c) => deFmt(c * 10, 2);
  return {
    enunciado: `Para la campaña por la igualdad, la clase gasta ${e(g1)} € en cartulinas y ${e(g2)} € en rotuladores, e ingresa ${ingreso / 100} € vendiendo pulseras. ¿Cuánto han gastado en total? ¿Cuánto dinero les queda?`,
    datos: [`Cartulinas: ${e(g1)} €`, `Rotuladores: ${e(g2)} €`, `Ingresos: ${ingreso / 100} €`],
    operacion: `${e(g1)} + ${e(g2)} = ${e(gastos)}; ${ingreso / 100},00 − ${e(gastos)} = ${e(queda)}`,
    solucion: `Han gastado ${e(gastos)} € y les quedan ${e(queda)} €.`,
  };
}

function deRedondear(nivel) {
  const lugares = nivel === DE_NIVELES.disc ? [[0, "las unidades"], [1, "las décimas"]] : [[0, "las unidades"], [1, "las décimas"], [2, "las centésimas"]];
  const [k, nombre] = pick(lugares);
  const kNum = nivel === DE_NIVELES.disc ? 2 : 3;
  const mil = deAleatorio(nivel, kNum, 1);
  const paso = Math.pow(10, 3 - k);
  const trunc = Math.floor(mil / paso) * paso;
  const siguiente = Math.floor((mil % paso) / (paso / 10));
  const r = siguiente >= 5 ? trunc + paso : trunc;
  return {
    enunciado: `Un producto cuesta ${deFmt(mil, kNum)} €. Redondea el precio a ${nombre}.`,
    datos: [`Precio: ${deFmt(mil, kNum)} €`, `Redondear a ${nombre}`],
    operacion: `La cifra siguiente a ${nombre} es ${siguiente}: ${siguiente >= 5 ? "es 5 o más, sube" : "es menor que 5, se queda igual"}`,
    solucion: `${deFmt(r, k)} €.`,
  };
}

const DE_FRACCIONES = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 20], [9, 25], [3, 50], [5, 4], [7, 2]];

function deFraccionCualquiera(nivel) {
  const [n, d] = pick(nivel === DE_NIVELES.disc ? DE_FRACCIONES.slice(0, 7) : DE_FRACCIONES);
  const mil = (n * 1000) / d;
  let equiv = "";
  for (const D of [10, 100, 1000]) {
    if (D % d === 0) {
      equiv = ` = ${(n * D) / d}/${D}`;
      break;
    }
  }
  return {
    enunciado: `Escribe la fracción ${n}/${d} como número decimal.`,
    datos: [`Fracción: ${n}/${d}`],
    operacion: `${n} : ${d} = ${deMin(mil)}${equiv ? ` (${n}/${d}${equiv})` : ""}`,
    solucion: `${deMin(mil)}. La fracción ${n}/${d} es ${deMin(mil)}.`,
  };
}

// Reto de la SdA 4 de 6º: «Nuestra población».
function dePoblacion(nivel) {
  const a = 1000 + randomInt(480, 560);
  let b;
  do {
    b = 1000 + randomInt(48, 56) * 10;
  } while (b === a);
  const [mayor, menor] = a > b ? ["6º A", "6º B"] : ["6º B", "6º A"];
  const diff = Math.abs(a - b);
  return {
    enunciado: `La altura media de 6º A es ${deMin(a)} m y la de 6º B es ${deMin(b)} m. ¿Qué clase tiene la altura media mayor? ¿Cuál es la diferencia? Redondea la altura de 6º A a las centésimas.`,
    datos: [`6º A: ${deMin(a)} m`, `6º B: ${deMin(b)} m`],
    operacion: `${deFmt(Math.max(a, b), 3)} − ${deFmt(Math.min(a, b), 3)} = ${deFmt(diff, 3)}; ${deMin(a)} → centésimas`,
    solucion: `${mayor} (${deMin(Math.max(a, b))} > ${deMin(Math.min(a, b))}). Diferencia: ${deMin(diff)} m. 6º A redondeada: ${deFmt(Math.floor(a / 10) * 10 + ((a % 10) >= 5 ? 10 : 0), 2)} m.`,
  };
}

function genDecimales(curso) {
  if (curso === "6") {
    return siguienteDeBaraja("de6", [deRedondear, deFraccionCualquiera, deOrdenar, deSumaResta, dePoblacion, deCampana, deDescomponer])(DE_NIVELES["6"]);
  }
  return siguienteDeBaraja("de5", [deLeerEscribir, deDescomponer, deFraccion, deOrdenar, deRecta, deSumaResta, deCampana])(DE_NIVELES["5"]);
}

function deDineroACS() {
  const [p1, p2] = pickTwo(NOMBRES);
  const a = randomInt(10, 59) * 100;
  let b;
  do {
    b = randomInt(10, 59) * 100;
  } while (b === a);
  return {
    enunciado: `${p1} tiene ${deFmt(a, 1)} € y ${p2} tiene ${deFmt(b, 1)} €. ¿Quién tiene más dinero?`,
    datos: [`${p1}: ${deFmt(a, 1)} €`, `${p2}: ${deFmt(b, 1)} €`],
    operacion: `Se compara primero la parte entera y después las décimas`,
    solucion: `${a > b ? p1 : p2}: ${deFmt(Math.max(a, b), 1)} > ${deFmt(Math.min(a, b), 1)}.`,
  };
}

function deFraccionACS() {
  const numerador = randomInt(1, 9);
  return {
    enunciado: `Escribe en forma decimal la fracción ${numerador}/10.`,
    datos: [`Fracción: ${numerador}/10`],
    operacion: `${numerador}/10 son ${numerador} ${numerador === 1 ? "décima" : "décimas"}`,
    solucion: `0,${numerador}. La fracción ${numerador}/10 es 0,${numerador}.`,
  };
}

function genDecimalesACS() {
  return siguienteDeBaraja("deAcs", [deFraccionACS, deDineroACS, () => deLeerEscribir(DE_NIVELES.acs), () => deRecta(DE_NIVELES.acs)])();
}

// Discalculia: los contenidos del curso con décimas y centésimas y
// partes enteras pequeñas (no el nivel de ACS).
function genDecimalesDiscalculia(curso) {
  const d = DE_NIVELES.disc;
  if (curso === "6") {
    return siguienteDeBaraja("deDisc6", [deRedondear, deFraccionCualquiera, deOrdenar, deSumaResta, deDescomponer])(d);
  }
  return siguienteDeBaraja("deDisc5", [deLeerEscribir, deDescomponer, deFraccion, deOrdenar, deRecta, deSumaResta])(d);
}

function deRedondeoMilesimas() {
  const entero = randomInt(1, 99);
  let parte;
  do {
    parte = randomInt(1, 9999);
  } while (parte % 10 === 0);
  const diezmil = entero * 10000 + parte;
  const r = Math.floor(diezmil / 10) + (diezmil % 10 >= 5 ? 1 : 0);
  const n = `${entero},${String(parte).padStart(4, "0")}`;
  return {
    enunciado: `Redondea el número ${n} a las milésimas.`,
    datos: [`Número: ${n}`],
    operacion: `La cifra siguiente a las milésimas es ${diezmil % 10}: ${diezmil % 10 >= 5 ? "sube" : "se queda igual"}`,
    solucion: `${deFmt(r, 3)}. El número redondeado es ${deFmt(r, 3)}.`,
  };
}

function genDecimalesAltas() {
  return siguienteDeBaraja("deAltas", [deRedondeoMilesimas, () => deFraccionCualquiera(DE_NIVELES["6"]), () => dePoblacion(DE_NIVELES["6"]), () => deCampana(DE_NIVELES["6"])])();
}

// ---- Multiplicación y división de decimales ----
// 5º (Tema 8): decimal × natural, decimal × decimal, × y : 10, 100 y
// 1000, decimal : natural y la compra con 7 €. 6º: además dividir
// entre un decimal y sacar decimales en el cociente. Los importes van
// en céntimos enteros para no arrastrar errores de coma flotante.
const DM_NIVELES = {
  "5": { precio: [60, 500], kilos: [2, 6], max: 9 },
  "6": { precio: [105, 995], kilos: [3, 9], max: 15 },
  disc: { precio: [50, 300], kilos: [2, 4], max: 5 },
};

const dmEur = (c) => `${Math.floor(c / 100)},${String(c % 100).padStart(2, "0")}`;

// {n, k}: cifras sin coma y número de decimales.
function dmFmt(n, k) {
  while (k > 0 && n % 10 === 0) {
    n /= 10;
    k--;
  }
  if (k === 0) return String(n);
  const s = String(n).padStart(k + 1, "0");
  return `${s.slice(0, -k)},${s.slice(-k)}`;
}

function dmPrecioKilos(nivel) {
  const precio = randomInt(nivel.precio[0] / 5, nivel.precio[1] / 5) * 5;
  const kilos = randomInt(nivel.kilos[0], nivel.kilos[1]);
  const fruta = pick(["naranjas", "manzanas", "peras", "tomates"]);
  return {
    enunciado: `Un kilo de ${fruta} cuesta ${dmEur(precio)} €. ¿Cuánto cuestan ${kilos} kilos?`,
    datos: [`Precio por kilo: ${dmEur(precio)} €`, `Cantidad: ${kilos} kg`],
    operacion: `${dmEur(precio)} × ${kilos} = ${dmEur(precio * kilos)}`,
    solucion: `${dmEur(precio * kilos)} €. Cuestan ${dmEur(precio * kilos)} €.`,
  };
}

function dmPrecioUnidad(nivel) {
  const precio = randomInt(nivel.precio[0] / 5, nivel.precio[1] / 5) * 5;
  const kilos = randomInt(nivel.kilos[0], nivel.kilos[1]);
  return {
    enunciado: `${kilos} kilos de peras cuestan ${dmEur(precio * kilos)} € en total. ¿Cuánto cuesta 1 kilo?`,
    datos: [`Precio total: ${dmEur(precio * kilos)} €`, `Cantidad: ${kilos} kg`],
    operacion: `${dmEur(precio * kilos)} : ${kilos} = ${dmEur(precio)}`,
    solucion: `${dmEur(precio)} €. Un kilo cuesta ${dmEur(precio)} €.`,
  };
}

function dmReparto(nivel) {
  const personas = randomInt(2, nivel.max);
  const porPersona = randomInt(11, nivel === DM_NIVELES.disc ? 40 : 120);
  const total = porPersona * personas;
  const [unidad, quien] = pick([["litros de agua", "botella"], ["kilos de arroz", "bolsa"], ["metros de cuerda", "equipo"]]);
  return {
    enunciado: `Se reparten ${dmFmt(total, 1)} ${unidad} a partes iguales en ${personas} ${quien === "equipo" ? "equipos" : quien + "s"}. ¿Cuánto le toca a cada ${quien}?`,
    datos: [`Total: ${dmFmt(total, 1)} ${unidad}`, `Partes: ${personas}`],
    operacion: `${dmFmt(total, 1)} : ${personas} = ${dmFmt(porPersona, 1)}`,
    solucion: `${dmFmt(porPersona, 1)} ${unidad} para cada ${quien}.`,
  };
}

function dmArea(nivel) {
  // Los dos lados con una cifra decimal (no 3,0): así la regla de contar decimales se ve.
  let a, b;
  do {
    a = randomInt(nivel === DM_NIVELES.disc ? 11 : 21, nivel === DM_NIVELES["6"] ? 95 : 60);
    b = randomInt(nivel === DM_NIVELES.disc ? 11 : 15, nivel === DM_NIVELES["6"] ? 75 : 45);
  } while (a % 10 === 0 || b % 10 === 0);
  return {
    enunciado: `El suelo de una habitación rectangular mide ${dmFmt(a, 1)} m de largo y ${dmFmt(b, 1)} m de ancho. ¿Cuántos metros cuadrados mide?`,
    datos: [`Largo: ${dmFmt(a, 1)} m`, `Ancho: ${dmFmt(b, 1)} m`],
    operacion: `${dmFmt(a, 1)} × ${dmFmt(b, 1)}: ${a} × ${b} = ${a * b}; 1 + 1 = 2 cifras decimales → ${dmFmt(a * b, 2)}`,
    solucion: `${dmFmt(a * b, 2)} m². El suelo mide ${dmFmt(a * b, 2)} m².`,
  };
}

function dmPotencias(nivel) {
  const caso = randomInt(1, 3);
  if (caso === 1) {
    const precio = randomInt(nivel.precio[0] / 5, nivel.precio[1] / 5) * 5;
    const n = nivel === DM_NIVELES.disc ? 10 : pick([10, 100]);
    const lugares = String(n).length - 1;
    return {
      enunciado: `${n} cuadernos iguales cuestan ${dmEur(precio * n)} €. ¿Cuánto cuesta un cuaderno?`,
      datos: [`Cuadernos: ${n}`, `Precio total: ${dmEur(precio * n)} €`],
      operacion: `${dmEur(precio * n)} : ${n} → la coma se mueve ${lugares} ${lugares === 1 ? "lugar" : "lugares"} a la izquierda`,
      solucion: `${dmEur(precio)} €. Un cuaderno cuesta ${dmEur(precio)} €.`,
    };
  }
  const precio = randomInt(nivel.precio[0] / 5, nivel.precio[1] / 5) * 5;
  const n = caso === 2 ? 10 : nivel === DM_NIVELES.disc ? 10 : pick([100, 1000]);
  return {
    enunciado: `Un lápiz cuesta ${dmEur(precio)} €. ¿Cuánto cuestan ${n} lápices?`,
    datos: [`Precio de un lápiz: ${dmEur(precio)} €`, `Lápices: ${n}`],
    operacion: `${dmEur(precio)} × ${n} → la coma se mueve ${String(n).length - 1} ${n === 10 ? "lugar" : "lugares"} a la derecha`,
    solucion: `${dmEur(precio * n)} €. Cuestan ${dmEur(precio * n)} €.`,
  };
}

// Reto de la UDI del Tema 8: la lista de la compra saludable con 7 €.
function dmCompra7(nivel) {
  const productos = [
    ["kg de manzanas", "kg de manzanas", 120, 190],
    ["kg de plátanos", "kg de plátanos", 140, 220],
    ["litro de leche", "litros de leche", 75, 115],
    ["barra de pan integral", "barras de pan integral", 60, 110],
    ["kg de zanahorias", "kg de zanahorias", 80, 130],
  ].sort(() => Math.random() - 0.5).slice(0, 3);
  const items = productos.map(([sing, pl, min, max]) => {
    const cant = randomInt(1, nivel === DM_NIVELES.disc ? 1 : 2);
    return { nombre: cant === 1 ? sing : pl, precio: randomInt(min / 5, max / 5) * 5, cant };
  });
  const total = items.reduce((s, it) => s + it.precio * it.cant, 0);
  const lista = items.map((it) => `${it.cant} ${it.nombre} a ${dmEur(it.precio)} €`);
  return {
    enunciado: `Lista de la compra saludable con un presupuesto de 7 €: ${lista.slice(0, -1).join(", ")} y ${lista[lista.length - 1]}. ¿Cuánto cuesta todo? ¿Te llega con 7 €? ¿Cuánto sobra o cuánto falta?`,
    datos: items.map((it) => `${it.nombre}: ${it.cant} × ${dmEur(it.precio)} €`),
    operacion: `${items.map((it) => `${dmEur(it.precio)} × ${it.cant} = ${dmEur(it.precio * it.cant)}`).join("; ")}; total = ${dmEur(total)}`,
    solucion: `Cuesta ${dmEur(total)} €. ${total <= 700 ? `Llega y sobran ${dmEur(700 - total)} €.` : `No llega: faltan ${dmEur(total - 700)} €.`}`,
  };
}

// 6º: dividir entre un decimal.
function dmBotellas(nivel) {
  const [cap, k] = pick(nivel === DM_NIVELES.disc ? [[5, 1], [25, 2]] : [[5, 1], [25, 2], [75, 2], [15, 1], [33, 2]]);
  const botellas = randomInt(4, nivel === DM_NIVELES.disc ? 10 : 24);
  const total = cap * botellas;
  return {
    enunciado: `Tenemos ${dmFmt(total, k)} litros de zumo y lo vamos a repartir en botellas de ${dmFmt(cap, k)} litros. ¿Cuántas botellas se llenan?`,
    datos: [`Zumo: ${dmFmt(total, k)} l`, `Cada botella: ${dmFmt(cap, k)} l`],
    operacion: `${dmFmt(total, k)} : ${dmFmt(cap, k)} → se mueve la coma ${k} ${k === 1 ? "lugar" : "lugares"} en los dos: ${total} : ${cap} = ${botellas}`,
    solucion: `${botellas} botellas.`,
  };
}

function dmCocienteDecimal(nivel) {
  let euros, amigos;
  do {
    amigos = pick(nivel === DM_NIVELES.disc ? [2, 4, 5] : [4, 5, 8]);
    euros = randomInt(5, nivel === DM_NIVELES.disc ? 20 : 45);
  } while (euros % amigos === 0 || (euros * 100) % amigos !== 0);
  const c = (euros * 100) / amigos;
  return {
    enunciado: `${amigos} amigos se reparten ${euros} € a partes iguales. ¿Cuánto dinero le toca a cada uno?`,
    datos: [`Dinero: ${euros} €`, `Amigos: ${amigos}`],
    operacion: `${euros} : ${amigos} = ${Math.floor(euros / amigos)} y sobran ${euros % amigos}; se pone la coma y se sigue dividiendo: ${dmEur(c)}`,
    solucion: `${dmEur(c)} € a cada uno.`,
  };
}

function genDecimalesMD(curso) {
  if (curso === "6") {
    return siguienteDeBaraja("dm6", [dmBotellas, dmCocienteDecimal, dmArea, dmPrecioUnidad, dmPotencias, dmCompra7, dmBotellas])(DM_NIVELES["6"]);
  }
  return siguienteDeBaraja("dm5", [dmPrecioKilos, dmPrecioUnidad, dmReparto, dmArea, dmPotencias, dmCompra7])(DM_NIVELES["5"]);
}

function dmNaranjasACS() {
  const precio = pick([150, 250, 50, 110, 320, 120]);
  const cantidad = randomInt(2, 3);
  return {
    enunciado: `Un kilo de naranjas cuesta ${dmEur(precio)} €. ¿Cuánto cuestan ${cantidad} kilos?`,
    datos: [`Precio por kilo: ${dmEur(precio)} €`, `Cantidad: ${cantidad} kg`],
    operacion: `${dmEur(precio)} × ${cantidad} = ${dmEur(precio * cantidad)}`,
    solucion: `${dmEur(precio * cantidad)} €. Cuestan ${dmEur(precio * cantidad)} €.`,
  };
}

function dmDiezACS() {
  const d = randomInt(11, 59);
  return {
    enunciado: `Un cuaderno cuesta ${dmEur(d * 10)} €. ¿Cuánto cuestan 10 cuadernos?`,
    datos: [`Un cuaderno: ${dmEur(d * 10)} €`, `Cuadernos: 10`],
    operacion: `${dmEur(d * 10)} × 10 → la coma se mueve 1 lugar a la derecha`,
    solucion: `${dmEur(d * 100)} €. Cuestan ${dmEur(d * 100)} €.`,
  };
}

function genDecimalesMDACS() {
  return siguienteDeBaraja("dmAcs", [dmNaranjasACS, dmDiezACS, dmNaranjasACS])();
}

// Discalculia: los contenidos del curso con números pequeños (no el
// nivel de ACS).
function genDecimalesMDDiscalculia(curso) {
  const d = DM_NIVELES.disc;
  if (curso === "6") {
    return siguienteDeBaraja("dmDisc6", [dmBotellas, dmCocienteDecimal, dmPrecioKilos, dmPotencias, dmArea])(d);
  }
  return siguienteDeBaraja("dmDisc5", [dmPrecioKilos, dmPrecioUnidad, dmReparto, dmPotencias, dmArea])(d);
}

function dmBolsasAltas() {
  const precio = randomInt(15, 60) * 10;
  const cantidad = randomInt(3, 12);
  const total = precio * cantidad;
  return {
    enunciado: `Se han gastado ${dmEur(total)} € en comprar bolsas de chuches a ${dmEur(precio)} € cada una. ¿Cuántas bolsas se han comprado?`,
    datos: [`Gasto total: ${dmEur(total)} €`, `Precio por bolsa: ${dmEur(precio)} €`],
    operacion: `${dmEur(total)} : ${dmEur(precio)} = ${cantidad}`,
    solucion: `${cantidad}. Se han comprado ${cantidad} bolsas.`,
  };
}

function dmPresupuestoAltas() {
  const precio = randomInt(35, 95) * 5;
  const presupuesto = randomInt(10, 30) * 100;
  const caben = Math.floor(presupuesto / precio);
  return {
    enunciado: `Con ${presupuesto / 100} € queremos comprar cuadernos de ${dmEur(precio)} € cada uno. ¿Cuántos cuadernos podemos comprar como máximo? ¿Cuánto dinero sobra?`,
    datos: [`Presupuesto: ${presupuesto / 100} €`, `Precio de un cuaderno: ${dmEur(precio)} €`],
    operacion: `${presupuesto / 100} : ${dmEur(precio)} = ${presupuesto} : ${precio} = ${caben} y sobra; ${dmEur(precio)} × ${caben} = ${dmEur(precio * caben)}`,
    solucion: `${caben} cuadernos, y sobran ${dmEur(presupuesto - precio * caben)} €.`,
  };
}

function genDecimalesMDAltas() {
  return siguienteDeBaraja("dmAltas", [dmBolsasAltas, dmPresupuestoAltas, () => dmBotellas(DM_NIVELES["6"]), () => dmCompra7(DM_NIVELES["6"])])();
}

// ---- Porcentajes ----
// 5º (Tema 9): qué es un porcentaje, porcentajes de cabeza, el
// porcentaje de una cantidad y los descuentos e impuestos (el reto del
// mercado medieval). 6º (SdA 5): además fracción, decimal y porcentaje
// y qué porcentaje es. Las cantidades se eligen para que todo salga
// exacto: nada de redondear céntimos sin decirlo.
const PC_NIVELES = {
  "5": { pcts: [5, 10, 15, 20, 25, 30, 40, 50, 75], max: 400 },
  "6": { pcts: [5, 12, 15, 20, 25, 30, 35, 40, 60, 75], max: 800 },
  disc: { pcts: [10, 25, 50], max: 100 },
};

// Cantidad múltiplo de 10 para la que el p% es entero.
function pcCantidad(p, max, min = 20) {
  const base = 100 / gcd(p, 100);
  const paso = lcm(base, 10);
  const k = Math.max(1, Math.ceil(min / paso));
  return paso * randomInt(k, Math.max(k, Math.floor(max / paso)));
}

const pcEur = (c) => (c % 100 === 0 ? String(c / 100) : `${Math.floor(c / 100)},${String(c % 100).padStart(2, "0")}`);

function pcDe(nivel) {
  const p = pick(nivel.pcts);
  const total = pcCantidad(p, nivel.max, 40);
  const r = (p * total) / 100;
  const cosa = pick(["van al colegio andando", "comen en el comedor", "practican algún deporte", "tienen mascota"]);
  return {
    enunciado: `En un grupo de ${total} alumnos, el ${p}% ${cosa}. ¿Cuántos alumnos son?`,
    datos: [`Total: ${total} alumnos`, `Porcentaje: ${p}%`],
    operacion: `${total} × ${p} : 100 = ${total * p} : 100 = ${r}`,
    solucion: `${r} alumnos.`,
  };
}

function pcCabeza(nivel) {
  // Múltiplo de 20: el 50%, el 25% y el 10% salen enteros.
  const cant = 20 * randomInt(2, nivel === PC_NIVELES.disc ? 5 : 20);
  return {
    enunciado: `Calcula de cabeza el 50%, el 25% y el 10% de ${cant}.`,
    datos: [`Cantidad: ${cant}`],
    operacion: `50% → ${cant} : 2 · 25% → ${cant} : 4 · 10% → ${cant} : 10`,
    solucion: `50% = ${cant / 2}; 25% = ${cant / 4}; 10% = ${cant / 10}.`,
  };
}

function pcQueEs(nivel) {
  const p = pick(nivel === PC_NIVELES.disc ? [10, 20, 25, 50, 75] : [4, 8, 15, 25, 35, 40, 60, 75, 90]);
  const dec = p % 10 === 0 ? `0,${p / 10}` : `0,${String(p).padStart(2, "0")}`;
  return {
    enunciado: `Escribe el ${p}% como fracción con denominador 100 y como número decimal. ¿Cuántos cuadraditos colorearías en una cuadrícula de 100?`,
    datos: [`Porcentaje: ${p}%`],
    operacion: `${p}% = ${p} de cada 100 = ${p}/100 = ${p} : 100`,
    solucion: `${p}/100 = ${dec}. Colorearía ${p} cuadraditos.`,
  };
}

function pcRebaja(nivel) {
  const p = pick(nivel.pcts.filter((x) => x <= 50));
  const precio = pcCantidad(p, Math.min(nivel.max, 200), 20);
  const desc = (p * precio) / 100;
  const objeto = pick(["unas zapatillas", "una mochila", "un balón", "un juego de mesa", "una chaqueta"]);
  return {
    enunciado: `En las rebajas, ${objeto} de ${precio} € tiene un descuento del ${p}%. ¿Cuánto se descuenta? ¿Cuánto hay que pagar?`,
    datos: [`Precio: ${precio} €`, `Descuento: ${p}%`],
    operacion: `${p}% de ${precio} = ${precio} × ${p} : 100 = ${desc}; ${precio} − ${desc} = ${precio - desc}`,
    solucion: `Se descuentan ${desc} € y hay que pagar ${precio - desc} €.`,
  };
}

// Reto de la UDI del Tema 9: el folleto del mercado medieval.
function pcMercado(nivel) {
  const objeto = pick(["una espada de madera", "un escudo pintado", "un tarro de miel", "una capa de lana", "un libro de leyendas"]);
  const pd = pick(nivel === PC_NIVELES.disc ? [10, 50] : [10, 20, 25]);
  const pi = 10;
  const precio = pcCantidad(pd, 100, 20);
  const conImpuesto = precio + (precio * pi) / 100;
  const esImpuesto = Math.random() < 0.5;
  if (esImpuesto) {
    return {
      enunciado: `Para el folleto del mercado medieval: ${objeto} cuesta ${precio} € y hay que sumarle un impuesto del ${pi}%. ¿Qué precio final hay que poner en el folleto?`,
      datos: [`Precio: ${precio} €`, `Impuesto: ${pi}%`],
      operacion: `${pi}% de ${precio} = ${(precio * pi) / 100}; ${precio} + ${(precio * pi) / 100} = ${conImpuesto}`,
      solucion: `${conImpuesto} €.`,
    };
  }
  const desc = (precio * pd) / 100;
  return {
    enunciado: `Para el folleto del mercado medieval: ${objeto} cuesta ${precio} € y el último día tiene un descuento del ${pd}%. ¿Cuánto costará el último día?`,
    datos: [`Precio: ${precio} €`, `Descuento: ${pd}%`],
    operacion: `${pd}% de ${precio} = ${desc}; ${precio} − ${desc} = ${precio - desc}`,
    solucion: `${precio - desc} €.`,
  };
}

// 6º
const PC_TRIPLETAS = [[1, 2, 50], [1, 4, 25], [3, 4, 75], [1, 5, 20], [2, 5, 40], [3, 5, 60], [4, 5, 80], [3, 10, 30], [7, 10, 70], [3, 20, 15], [7, 20, 35], [1, 25, 4], [3, 25, 12]];

function pcFracDecPct(nivel) {
  const [n, d, p] = pick(nivel === PC_NIVELES.disc ? PC_TRIPLETAS.slice(0, 5) : PC_TRIPLETAS);
  const dec = p % 10 === 0 ? `0,${p / 10}` : `0,${String(p).padStart(2, "0")}`;
  return {
    enunciado: `Completa: la fracción ${n}/${d} es igual al número decimal ___ y al porcentaje ___ %.`,
    datos: [`Fracción: ${n}/${d}`],
    operacion: `${n}/${d} = ${p}/100 (multiplicando por ${100 / d}) = ${dec}`,
    solucion: `${n}/${d} = ${dec} = ${p}%.`,
  };
}

function pcQuePorcentaje(nivel) {
  const p = pick(nivel === PC_NIVELES.disc ? [10, 25, 50] : [5, 10, 15, 20, 25, 30, 40, 60, 75, 80]);
  const total = pcCantidad(p, nivel === PC_NIVELES.disc ? 100 : 400, 20);
  const parte = (p * total) / 100;
  return {
    enunciado: `En una encuesta a ${total} personas, ${parte} dicen que ahorran energía apagando las luces. ¿Qué porcentaje son?`,
    datos: [`Total: ${total}`, `Parte: ${parte}`],
    operacion: `${parte} : ${total} × 100 = ${p}`,
    solucion: `El ${p}%.`,
  };
}

// SdA 5 de 6º: «La energía».
function pcEnergia(nivel) {
  const total = pick([200, 250, 300, 400, 500]);
  const opciones = [10, 20, 30, 40, 50].filter((x) => (x * total) % 100 === 0);
  const pCal = pick(opciones.filter((x) => x >= 30));
  const pLuz = pick(opciones.filter((x) => x <= 20));
  const cal = (pCal * total) / 100;
  const luz = (pLuz * total) / 100;
  return {
    enunciado: `Una casa gasta ${total} kWh de energía al mes. El ${pCal}% es para la calefacción y el ${pLuz}% para la luz. ¿Cuántos kWh gasta en cada cosa? ¿Qué porcentaje queda para lo demás?`,
    datos: [`Total: ${total} kWh`, `Calefacción: ${pCal}%`, `Luz: ${pLuz}%`],
    operacion: `${pCal}% de ${total} = ${cal}; ${pLuz}% de ${total} = ${luz}; 100 − ${pCal} − ${pLuz} = ${100 - pCal - pLuz}`,
    solucion: `Calefacción: ${cal} kWh; luz: ${luz} kWh. Queda el ${100 - pCal - pLuz}% para lo demás.`,
  };
}

function pcIva(nivel) {
  const precio = randomInt(1, 9) * 100;
  const iva = (precio * 21) / 100;
  return {
    enunciado: `Un ordenador cuesta ${precio} € sin impuestos. Hay que sumarle el 21% de IVA. ¿Cuánto es el IVA? ¿Cuál es el precio final?`,
    datos: [`Precio: ${precio} €`, `IVA: 21%`],
    operacion: `21% de ${precio} = ${precio} × 21 : 100 = ${iva}; ${precio} + ${iva} = ${precio + iva}`,
    solucion: `El IVA son ${iva} € y el precio final es ${precio + iva} €.`,
  };
}

function genPorcentajes(curso) {
  if (curso === "6") {
    return siguienteDeBaraja("pc6", [pcFracDecPct, pcQuePorcentaje, pcEnergia, pcRebaja, pcIva, pcDe])(PC_NIVELES["6"]);
  }
  return siguienteDeBaraja("pc5", [pcQueEs, pcCabeza, pcDe, pcRebaja, pcMercado, pcMercado])(PC_NIVELES["5"]);
}

function pcAcsUno() {
  const pct = pick([10, 50]);
  const cantidad = pct === 10 ? randomInt(2, 10) * 10 : randomInt(2, 20) * 2;
  const resultado = (cantidad * pct) / 100;
  return {
    enunciado: `Calcula el ${pct}% de ${cantidad}.`,
    datos: [`Cantidad: ${cantidad}`, `Porcentaje: ${pct}%`],
    operacion: pct === 10 ? `${cantidad} : 10 = ${resultado}` : `${cantidad} : 2 = ${resultado}`,
    solucion: `${resultado}. El ${pct}% de ${cantidad} es ${resultado}.`,
  };
}

function pcAcsClase() {
  const total = pick([10, 20, 30]);
  const pct = pick([10, 50]);
  return {
    enunciado: `En una clase de ${total} alumnos, el ${pct}% son chicas. ¿Cuántas chicas hay?`,
    datos: [`Alumnos: ${total}`, `Porcentaje: ${pct}%`],
    operacion: pct === 10 ? `${total} : 10 = ${total / 10}` : `${total} : 2 = ${total / 2}`,
    solucion: `${(total * pct) / 100} chicas.`,
  };
}

function genPorcentajesACS() {
  return siguienteDeBaraja("pcAcs", [pcAcsUno, pcAcsClase, pcAcsUno])();
}

// Discalculia: los contenidos del curso con el 10%, el 25% y el 50% y
// cantidades pequeñas (no el nivel de ACS).
function genPorcentajesDiscalculia(curso) {
  const d = PC_NIVELES.disc;
  if (curso === "6") return siguienteDeBaraja("pcDisc6", [pcFracDecPct, pcQuePorcentaje, pcRebaja, pcDe, pcQueEs])(d);
  return siguienteDeBaraja("pcDisc5", [pcQueEs, pcCabeza, pcDe, pcRebaja, pcMercado])(d);
}

function pcDescuentoIvaAltas() {
  // Precio múltiplo de 100 y descuento múltiplo de 10: el IVA del 21%
  // sobre el precio rebajado sale en céntimos exactos.
  const precio = randomInt(1, 9) * 100;
  const pd = pick([10, 20, 25, 30, 40, 50]);
  const tras = precio - (precio * pd) / 100;
  const ivaC = tras * 21; // en céntimos
  const finalC = tras * 100 + ivaC;
  return {
    enunciado: `Un artículo cuesta ${precio} €. Primero tiene un descuento del ${pd}% y después se le aplica un 21% de IVA sobre el nuevo precio. ¿Cuánto cuesta finalmente?`,
    datos: [`Precio inicial: ${precio} €`, `Descuento: ${pd}%`, `IVA: 21%`],
    operacion: `${pd}% de ${precio} = ${(precio * pd) / 100}; ${precio} − ${(precio * pd) / 100} = ${tras}; 21% de ${tras} = ${pcEur(ivaC)}; ${tras} + ${pcEur(ivaC)} = ${pcEur(finalC)}`,
    solucion: `${pcEur(finalC)} €.`,
  };
}

function genPorcentajesAltas() {
  return siguienteDeBaraja("pcAltas", [pcDescuentoIvaAltas, () => pcQuePorcentaje(PC_NIVELES["6"]), () => pcEnergia(PC_NIVELES["6"]), () => pcFracDecPct(PC_NIVELES["6"])])();
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
  { id: "potencias", label: "Las potencias", category: "Operaciones básicas", generate: genPotencias, generateACS: genPotenciasACS, generateDiscalculia: genPotenciasDiscalculia, generateAltas: genPotenciasAltas, resumen: "Una potencia es una multiplicación de factores iguales: 4³ = 4 × 4 × 4 = 64. La base (4) es el factor que se repite y el exponente (3), las veces que se repite. Con exponente 2 se dice «al cuadrado» y con 3, «al cubo». Ojo: 4³ no es 4 × 3.", resumen6: "Una potencia es una multiplicación de factores iguales: 4³ = 4 × 4 × 4 = 64 (base 4, exponente 3; no es 4 × 3). Una potencia de 10 es un 1 seguido de tantos ceros como dice el exponente: 10⁵ = 100.000. Para descomponer un número, cada cifra se multiplica por la potencia de 10 de su lugar: 40.302 = 4 × 10⁴ + 3 × 10² + 2." },
  { id: "numeros-enteros", label: "Números enteros", category: "Operaciones básicas", generate: genNumerosEnteros, generateACS: genNumerosEnterosACS, generateDiscalculia: genNumerosEnterosDiscalculia, generateAltas: genNumerosEnterosAltas, resumen: "Los números enteros son los positivos, los negativos y el cero. Los negativos se escriben con el signo − y sirven para temperaturas bajo cero, sótanos, profundidades bajo el nivel del mar o deudas. En la recta numérica, el mayor es el que está más a la derecha: −2 > −6.", resumen6: "Los números enteros son los positivos, los negativos y el cero. En la recta, el mayor es el que está más a la derecha (−2 > −6). El valor absoluto es la distancia hasta el 0 (|−5| = 5) y el opuesto está al otro lado, a la misma distancia (−5 y 5). Para sumar: mismo signo, se suman y se deja el signo; distinto signo, se restan y se deja el signo del de mayor valor absoluto." },
  { id: "multiplos-divisores", label: "Múltiplos, divisores y números primos", category: "Operaciones básicas", generate: genMultiplosDivisores, generateACS: genMultiplosDivisoresACS, generateDiscalculia: genMultiplosDivisoresDiscalculia, generateAltas: genMultiplosDivisoresAltas, resumen: "Un número es múltiplo de otro si está en su tabla (6 × 7 = 42), y es divisor si lo divide de forma exacta, sin que sobre nada (42 : 6 = 7, resto 0). Un número primo solo tiene dos divisores: el 1 y él mismo.", resumen6: "Un número es múltiplo de otro si está en su tabla (6 × 7 = 42), y es divisor si lo divide de forma exacta, sin que sobre nada (42 : 6 = 7, resto 0). Un número primo solo tiene dos divisores: el 1 y él mismo. El m.c.m. es el menor múltiplo común de dos números y el M.C.D., su mayor divisor común." },
  { id: "fracciones", label: "Fracciones", category: "Fracciones y decimales", generate: genFracciones, generateACS: genFraccionesACS, generateDiscalculia: genFraccionesDiscalculia, generateAltas: genFraccionesAltas, resumen: "Una fracción representa las partes iguales que se toman de un todo: el denominador dice en cuántas partes se divide y el numerador, cuántas se toman. Dos fracciones son equivalentes si valen lo mismo (1/2 = 2/4): se obtienen multiplicando o dividiendo el numerador y el denominador por el mismo número.", resumen6: "Una fracción representa las partes iguales que se toman de un todo. Dos fracciones son equivalentes si valen lo mismo (1/2 = 2/4): se obtienen multiplicando o dividiendo el numerador y el denominador por el mismo número. Para comparar fracciones con distinto denominador se reducen a común denominador, y la fracción irreducible se obtiene dividiendo los dos términos entre su M.C.D." },
  { id: "operaciones-fracciones", label: "Operaciones con fracciones", category: "Fracciones y decimales", generate: genOperacionesFracciones, generateACS: genOperacionesFraccionesACS, generateDiscalculia: genOperacionesFraccionesDiscalculia, generateAltas: genOperacionesFraccionesAltas, resumen: "Para sumar o restar fracciones con el mismo denominador, se suman o restan los numeradores y el denominador se queda igual. Para calcular la fracción de una cantidad, se divide la cantidad entre el denominador y se multiplica por el numerador. En las operaciones combinadas, primero los paréntesis.", resumen6: "Para sumar o restar fracciones con distinto denominador, primero se reducen a común denominador. Para multiplicar, numerador por numerador y denominador por denominador; para dividir, se multiplica por la segunda fracción invertida. En las combinadas: paréntesis, después multiplicaciones y divisiones, y por último sumas y restas." },
  { id: "decimales", label: "Números decimales", category: "Fracciones y decimales", generate: genDecimales, generateACS: genDecimalesACS, generateDiscalculia: genDecimalesDiscalculia, generateAltas: genDecimalesAltas, resumen: "Un número decimal tiene parte entera y parte decimal, separadas por la coma: décimas, centésimas y milésimas. Para comparar, se mira la parte entera y después cifra a cifra (3,45 < 3,5). Para sumar y restar, las comas van una debajo de otra y se rellenan con ceros las cifras que falten.", resumen6: "Un número decimal tiene parte entera y parte decimal, separadas por la coma. Para sumar y restar, las comas van alineadas. Para redondear, se mira la cifra siguiente: si es 5 o más, sube. Una fracción se pasa a decimal dividiendo el numerador entre el denominador (3/4 = 0,75)." },
  { id: "decimales-md", label: "Multiplicación y división de decimales", category: "Fracciones y decimales", generate: genDecimalesMD, generateACS: genDecimalesMDACS, generateDiscalculia: genDecimalesMDDiscalculia, generateAltas: genDecimalesMDAltas, resumen: "Para multiplicar decimales, se multiplica sin comas y se separan tantas cifras decimales como tengan los dos factores juntos. Al multiplicar por 10, 100 o 1000 la coma se mueve a la derecha, y al dividir, a la izquierda. Al dividir un decimal entre un natural, la coma se pone en el cociente al bajar la primera cifra decimal.", resumen6: "Para multiplicar decimales, se multiplica sin comas y se separan tantas cifras decimales como tengan los dos factores. Para dividir entre un decimal, se mueve la coma a la derecha en el dividendo y en el divisor hasta que el divisor no tenga coma. Si la división no es exacta, se pone la coma y se sigue dividiendo con ceros." },
  { id: "porcentajes", label: "Porcentajes", category: "Fracciones y decimales", generate: genPorcentajes, generateACS: genPorcentajesACS, generateDiscalculia: genPorcentajesDiscalculia, generateAltas: genPorcentajesAltas, resumen: "Un porcentaje indica una parte de cada 100: 25% = 25/100 = 0,25. Para calcular el X% de una cantidad, se multiplica por X y se divide entre 100. En un descuento se resta y en un impuesto se suma. De cabeza: 50% = la mitad, 25% = la cuarta parte, 10% = dividir entre 10.", resumen6: "Un porcentaje indica una parte de cada 100: 3/5 = 60/100 = 0,6 = 60%. Para calcular el X% de una cantidad, se multiplica por X y se divide entre 100; para saber qué porcentaje es una parte, se divide la parte entre el total y se multiplica por 100. En un descuento se resta y en un impuesto se suma." },
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
// Maqueta común con Lengua: ver «Plantilla de las fichas» en
// js/docx-writer.js.

// Contenido del recuadro de un problema: enunciado en negrita y
// debajo Datos (línea), Operaciones (hueco para hacer las cuentas en
// columna) y Solución (línea). En disgrafía, Datos y Operación ya
// vienen escritos y solo se completa la Solución.
function buildProblemaContenido(problem, dificultad) {
  const prefill = dificultad === "disgrafia";
  const contenido = [{ runs: [{ text: problem.enunciado, bold: true, size: 22 }], spacingAfter: 20 }];
  contenido.push(fichaLinea({ etiqueta: "Datos:", valor: prefill ? problem.datos.join("   ·   ") : "" }));
  if (prefill) {
    contenido.push(fichaLinea({ etiqueta: "Operación:", valor: problem.operacion }));
  } else {
    contenido.push(fichaHueco(4, "Operaciones:"));
  }
  contenido.push(fichaLinea({ etiqueta: "Solución:" }));
  return contenido;
}

// Solucionario compacto, como el «Para el maestro» de las fichas del
// aula: una línea por problema con datos, operación y solución.
function buildSolucionParrafo(problem, index) {
  return {
    runs: [
      { text: `${index + 1}. `, bold: true },
      { text: `Datos: ${problem.datos.join(" · ")}. ` },
      { text: `Operación: ${problem.operacion}. ` },
      { text: `Solución: ${problem.solucion}`, bold: true },
    ],
    spacingAfter: 120,
  };
}

// Notas de cada adaptación para los exámenes (js/mate-examen-generator.js);
// las fichas de cada contenido no las imprimen.
const DIFFICULTY_FICHA_NOTES = {
  acs: "Adaptación curricular significativa: mismo contenido con un nivel de dificultad equivalente a dos cursos por debajo.",
  discalculia: "Discalculia: mismo nivel de dificultad que la ACS, pensado para dar más tiempo y reducir la carga numérica.",
  altas: "Altas capacidades: problemas con números más grandes o con un paso adicional para un reto mayor.",
  dislexia: "Dislexia: mismo contenido, con letra más grande y más espacio entre líneas para facilitar la lectura.",
  tdah: "TDAH: cada problema se presenta en su propia página, para trabajar de uno en uno sin saturar la vista.",
  disgrafia: "Disgrafía: los apartados de Datos y Operación ya vienen resueltos; solo hay que completar la Solución.",
};

// Nota de la adaptación para la cabecera de un examen con varios temas.
// En discalculia, los temas con generateDiscalculia no usan el nivel de
// ACS sino los contenidos del curso con números pequeños: la nota lo
// dice para que no prometa algo distinto de lo que trae el examen.
function notaDificultadExamen(dificultad, topics) {
  if (dificultad !== "discalculia") return DIFFICULTY_FICHA_NOTES[dificultad];
  const propios = topics.filter((t) => t.generateDiscalculia);
  if (!propios.length) return DIFFICULTY_FICHA_NOTES.discalculia;
  if (propios.length === topics.length) {
    return "Discalculia: los mismos contenidos del curso con números más pequeños, pensado para dar más tiempo y reducir la carga numérica.";
  }
  const nombres = propios.map((t) => `«${t.label}»`).join(", ");
  return `Discalculia: en ${nombres}, los mismos contenidos del curso con números más pequeños; en el resto de temas, el mismo nivel de dificultad que la ACS. Pensado para dar más tiempo y reducir la carga numérica.`;
}

function buildFichaDocument({ topic, curso, fecha, problems, dificultad, showSolutions }) {
  const blocks = fichaInicio({ area: "Matemáticas", curso, contenido: topic.label, fecha, soluciones: showSolutions });

  if (!showSolutions) {
    blocks.push(fichaApartado("Recuerda"));
    // resumen6 (opcional): «Recuerda» propio de 6º cuando el de 5º no
    // debe nombrar contenidos del curso siguiente.
    const resumen = curso === "6" && topic.resumen6 ? topic.resumen6 : topic.resumen;
    blocks.push({ runs: [{ text: resumen }], spacingAfter: 60 });
    blocks.push({
      runs: [{ text: "Lee bien cada problema. Escribe los datos, haz las operaciones y escribe la solución con su palabra.", italic: true, size: 18, color: FICHA_GRIS }],
      spacingAfter: 60,
    });
  }

  if (showSolutions) {
    blocks.push(fichaApartado("Problemas resueltos"));
    problems.forEach((p, i) => blocks.push(buildSolucionParrafo(p, i)));
  } else {
    blocks.push(fichaApartado("Problemas"));
    blocks.push(fichaSeparador(60));
    problems.forEach((p, i) => {
      blocks.push(...fichaEjercicio(i + 1, buildProblemaContenido(p, dificultad), { saltoPagina: dificultad === "tdah" && i > 0 }));
    });
  }

  return fichaAplicarEstilo(blocks, { agrandar: dificultad === "dislexia" });
}

// ---------------- Maqueta de los exámenes ----------------
// Las fichas de cada contenido usan la plantilla de docx-writer.js,
// pero los exámenes (js/examen-generator.js y js/mate-examen-generator.js)
// siguen montando sus documentos con estas piezas.

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

function applyDislexiaStyling(paragraphs) {
  return paragraphs.map((p) => ({
    ...p,
    spacingBefore: p.spacingBefore !== undefined ? Math.round(p.spacingBefore * 1.3) : p.spacingBefore,
    spacingAfter: p.spacingAfter !== undefined ? Math.round(p.spacingAfter * 1.3) : p.spacingAfter,
    runs: p.runs.map((r) => (r.break ? r : { ...r, size: (r.size || 22) + 6 })),
  }));
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
  // Un tema puede dar a la discalculia sus propios problemas en vez de
  // los de ACS (generateDiscalculia); los demás siguen con los de ACS.
  if (dificultad === "discalculia" && topic.generateDiscalculia) {
    const problems = [];
    for (let i = 0; i < count; i++) {
      const p = topic.generateDiscalculia(curso);
      problems.push({ ...p, enunciado: p.enunciado + DISCALCULIA_SCAFFOLD });
    }
    return problems;
  }
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

function generarFichaYSoluciones(topicId, curso, count, dificultad = "none", options = {}) {
  const topic = TOPICS.find((t) => t.id === topicId);
  if (!topic) throw new Error("Tema no encontrado: " + topicId);

  const problems = generarProblemas(topic, curso, count, dificultad);

  const fecha = todayEs();
  const fichaParagraphs = buildFichaDocument({ topic, curso, fecha, problems, dificultad, showSolutions: false });
  const solucionesParagraphs = buildFichaDocument({ topic, curso, fecha, problems, dificultad, showSolutions: true });

  const fichaBlob = createDocxBlob(fichaParagraphs);
  const solucionesBlob = createDocxBlob(solucionesParagraphs);

  const sufijo = dificultad && dificultad !== "none" ? `_${dificultad}` : "";
  const fichaFile = { blob: fichaBlob, filename: `ficha_matematicas_${topicId}_${curso}${sufijo}.docx` };
  const solucionesFile = { blob: solucionesBlob, filename: `soluciones_matematicas_${topicId}_${curso}${sufijo}.docx` };

  if (options.download === false) return { ficha: fichaFile, soluciones: solucionesFile };

  downloadBlob(fichaBlob, fichaFile.filename);
  // El solucionario solo si quien está usando la app puede verlo: un
  // alumno cuya clase no lo tiene marcado se lleva la ficha y nada
  // más (ver __puedeVerSoluciones en js/layout.js). Quien llama con
  // download:false —el Generador de Unidad Didáctica, que empaqueta
  // los documentos— recibe los dos igual: ahí decide quien empaqueta.
  if (!window.__puedeVerSoluciones || window.__puedeVerSoluciones()) {
    setTimeout(() => downloadBlob(solucionesBlob, solucionesFile.filename), 400);
  }
  return { ficha: fichaFile, soluciones: solucionesFile };
}

// Alias explícito para coexistir con el generador de Lengua (ambos
// definen generarFichaYSoluciones) en la página del Generador de UDI.
window.generarFichaMateYSoluciones = generarFichaYSoluciones;
