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

// ---------------- Registro de temas ----------------

const TOPICS = [
  { id: "sumas", label: "Sumas", category: "Operaciones básicas", generate: genSumas, resumen: "Sumar es juntar cantidades para saber cuántas hay en total." },
  { id: "restas", label: "Restas", category: "Operaciones básicas", generate: genRestas, resumen: "Restar es quitar una cantidad de otra para saber cuánto queda o la diferencia entre ellas." },
  { id: "multiplicaciones", label: "Multiplicaciones", category: "Operaciones básicas", generate: genMultiplicaciones, resumen: "Multiplicar es sumar un mismo número varias veces de forma rápida." },
  { id: "divisiones", label: "Divisiones", category: "Operaciones básicas", generate: genDivisiones, resumen: "Dividir es repartir una cantidad en partes iguales." },
  { id: "operaciones-combinadas", label: "Operaciones combinadas", category: "Operaciones básicas", generate: genOperacionesCombinadas, resumen: "Cuando hay varias operaciones juntas, primero se resuelven los paréntesis, luego multiplicaciones y divisiones, y por último sumas y restas." },
  { id: "numeros-romanos", label: "Números romanos", category: "Operaciones básicas", generate: genNumerosRomanos, resumen: "Los números romanos se escriben combinando las letras I, V, X, L, C, D y M según reglas de suma y resta." },
  { id: "potencias", label: "Las potencias", category: "Operaciones básicas", generate: genPotencias, resumen: "Una potencia es una multiplicación de un mismo número (la base) tantas veces como indica el exponente." },
  { id: "numeros-enteros", label: "Números enteros", category: "Operaciones básicas", generate: genNumerosEnteros, resumen: "Los números enteros incluyen los positivos, los negativos y el cero. Sirven para representar cambios en dos sentidos, como subir o bajar." },
  { id: "multiplos-divisores", label: "Múltiplos, divisores y m.c.m.", category: "Operaciones básicas", generate: genMultiplosDivisores, resumen: "Los múltiplos de un número se obtienen multiplicándolo por 1, 2, 3... El m.c.m. es el menor múltiplo común de dos números." },
  { id: "fracciones", label: "Fracciones", category: "Fracciones y decimales", generate: genFracciones, resumen: "Una fracción representa las partes que se toman de un todo dividido en partes iguales." },
  { id: "operaciones-fracciones", label: "Operaciones con fracciones", category: "Fracciones y decimales", generate: genOperacionesFracciones, resumen: "Para sumar o restar fracciones con distinto denominador, primero hay que buscar un denominador común." },
  { id: "decimales", label: "Números decimales (redondeo)", category: "Fracciones y decimales", generate: genDecimales, resumen: "Los números decimales tienen una parte entera y una parte decimal separadas por una coma. Redondear es aproximar a un número más sencillo." },
  { id: "decimales-md", label: "Multiplicación y división de decimales", category: "Fracciones y decimales", generate: genDecimalesMD, resumen: "Al multiplicar o dividir decimales se opera igual que con números enteros, teniendo cuidado con la coma decimal." },
  { id: "porcentajes", label: "Porcentajes", category: "Fracciones y decimales", generate: genPorcentajes, resumen: "Un porcentaje indica una parte de cada 100. Calcular el X% de una cantidad es multiplicarla por X y dividir entre 100." },
  { id: "problemas-mixtos", label: "Problemas mixtos (varios pasos)", category: "Problemas mixtos", generate: genProblemasMixtos, resumen: "Algunos problemas necesitan encadenar varias operaciones seguidas para llegar a la solución final." },
  { id: "medidas", label: "Medidas y conversiones", category: "Geometría y medidas", generate: genMedidas, resumen: "Para cambiar de una unidad de medida a otra, se multiplica o se divide según la equivalencia entre ellas." },
  { id: "areas", label: "Áreas y perímetros", category: "Geometría y medidas", generate: genAreas, resumen: "El área mide la superficie de una figura: en un rectángulo es base × altura, y en un triángulo es (base × altura) ÷ 2." },
  { id: "circunferencia", label: "Circunferencia y círculo", category: "Geometría y medidas", generate: genCircunferencia, resumen: "La circunferencia es el contorno de un círculo. Su longitud es 2 × π × radio, y el área del círculo es π × radio²." },
  { id: "proporcionalidad", label: "Proporcionalidad (regla de tres)", category: "Geometría y medidas", generate: genProporcionalidad, resumen: "En una relación de proporcionalidad, si conocemos el precio de una unidad podemos calcular el de cualquier cantidad." },
  { id: "estadistica", label: "Estadística (media y mediana)", category: "Geometría y medidas", generate: genEstadistica, resumen: "La media es la suma de todos los valores dividida entre el número de valores. La mediana es el valor central al ordenarlos." },
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

function buildProblemParagraphs(problem, index, showSolutions) {
  const paragraphs = [];
  const startsNewPage = index > 0 && index % 5 === 0;
  paragraphs.push({
    runs: [{ text: `Problema ${index + 1}`, bold: true, size: 22 }],
    spacingBefore: startsNewPage ? 0 : 90,
    spacingAfter: 30,
    pageBreakBefore: startsNewPage,
  });
  paragraphs.push({ runs: [{ text: problem.enunciado }], spacingAfter: 40 });

  paragraphs.push(sectionBar("Datos"));
  paragraphs.push(
    showSolutions ? filledBox([{ text: problem.datos.join("   ·   ") }], 30) : blankBox(1, 30)
  );

  paragraphs.push(sectionBar("Operación"));
  paragraphs.push(
    showSolutions ? filledBox([{ text: problem.operacion }], 30) : blankBox(0, 30)
  );

  paragraphs.push(sectionBar("Solución"));
  paragraphs.push(
    showSolutions ? filledBox([{ text: problem.solucion, bold: true }], 140) : blankBox(0, 140)
  );

  return paragraphs;
}

function buildFichaDocument({ topic, curso, fecha, problems, showSolutions }) {
  const paragraphs = [];
  paragraphs.push(...buildHeaderParagraphs(topic, curso, fecha));

  if (showSolutions) {
    paragraphs.push({ runs: [{ text: "Hoja de soluciones", bold: true, size: 24 }], spacingAfter: 140 });
  } else {
    paragraphs.push({
      runs: [{ text: topic.resumen }],
      border: true,
      shading: "D9D9D9",
      spacingAfter: 140,
    });
  }

  problems.forEach((p, i) => {
    paragraphs.push(...buildProblemParagraphs(p, i, showSolutions));
  });

  return paragraphs;
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

function generarFichaYSoluciones(topicId, curso, count) {
  const topic = TOPICS.find((t) => t.id === topicId);
  if (!topic) throw new Error("Tema no encontrado: " + topicId);

  const problems = [];
  for (let i = 0; i < count; i++) problems.push(topic.generate(curso));

  const fecha = todayEs();
  const fichaParagraphs = buildFichaDocument({ topic, curso, fecha, problems, showSolutions: false });
  const solucionesParagraphs = buildFichaDocument({ topic, curso, fecha, problems, showSolutions: true });

  const fichaBlob = createDocxBlob(fichaParagraphs);
  const solucionesBlob = createDocxBlob(solucionesParagraphs);

  downloadBlob(fichaBlob, `ficha_matematicas_${topicId}_${curso}.docx`);
  setTimeout(() => downloadBlob(solucionesBlob, `soluciones_matematicas_${topicId}_${curso}.docx`), 400);
}
