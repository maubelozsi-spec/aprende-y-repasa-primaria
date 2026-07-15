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

function genSumas(curso) {
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

const ESCENARIOS_RESTAS = [
  { contenedor: "Un depósito de agua", objeto: "litros", verbo: "usado" },
  { contenedor: "Una hucha", objeto: "euros", verbo: "gastado" },
  { contenedor: "Una bolsa de canicas", objeto: "canicas", verbo: "perdido" },
  { contenedor: "Un rollo de papel", objeto: "metros", verbo: "gastado" },
];

function genRestas(curso) {
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

const ESCENARIOS_MULTIPLICACIONES = [
  { contenedorSing: "caja", contenedorPlur: "cajas", objeto: "lápices" },
  { contenedorSing: "paquete", contenedorPlur: "paquetes", objeto: "cromos" },
  { contenedorSing: "cesta", contenedorPlur: "cestas", objeto: "huevos" },
  { contenedorSing: "caja", contenedorPlur: "cajas", objeto: "botellas" },
];

function genMultiplicaciones(curso) {
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

function genDivisiones(curso) {
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

function genOperacionesCombinadas(curso) {
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

function genNumerosRomanos(curso) {
  const max = curso === "6" ? 3999 : 500;
  const min = curso === "6" ? 500 : 11;
  const n = randomInt(min, max);
  const roman = toRoman(n);
  if (Math.random() < 0.5) {
    return {
      enunciado: `Escribe en números romanos el número ${n}.`,
      datos: [`Número: ${n}`],
      operacion: `${n} se descompone según el valor de cada cifra romana`,
      solucion: `${roman}. El número ${n} en números romanos es ${roman}.`,
    };
  }
  return {
    enunciado: `¿Qué número representa la cifra romana ${roman}?`,
    datos: [`Cifra romana: ${roman}`],
    operacion: `${roman} se traduce sumando (o restando) el valor de cada letra`,
    solucion: `${n}. La cifra romana ${roman} representa el número ${n}.`,
  };
}

function genPotencias(curso) {
  const base = randomInt(2, curso === "6" ? 12 : 9);
  const exp = curso === "6" ? pick([2, 3]) : 2;
  const valor = Math.pow(base, exp);
  const signo = exp === 2 ? "²" : "³";
  const factores = Array(exp).fill(base).join(" × ");
  return {
    enunciado: `Calcula la potencia ${base}${signo}.`,
    datos: [`Base: ${base}`, `Exponente: ${exp}`],
    operacion: `${base}${signo} = ${factores} = ${valor}`,
    solucion: `${valor}. ${base} elevado a ${exp} es ${valor}.`,
  };
}

function genNumerosEnteros(curso) {
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

function genMultiplosDivisores(curso) {
  if (curso === "6") {
    const a = randomInt(4, 12);
    const b = randomInt(4, 12);
    const resultado = lcm(a, b);
    return {
      enunciado: `Dos autobuses salen juntos de la estación a las 8:00h. El primero repite su recorrido cada ${a} minutos y el segundo cada ${b} minutos. ¿Dentro de cuántos minutos volverán a coincidir en la estación?`,
      datos: [`Primer autobús: cada ${a} min`, `Segundo autobús: cada ${b} min`],
      operacion: `m.c.m.(${a}, ${b}) = ${resultado}`,
      solucion: `${resultado} minutos. Volverán a coincidir dentro de ${resultado} minutos.`,
    };
  }
  const n = randomInt(3, 12);
  const multiplos = Array.from({ length: 5 }, (_, i) => n * (i + 1));
  return {
    enunciado: `Escribe los 5 primeros múltiplos de ${n} (sin contar el 0).`,
    datos: [`Número: ${n}`],
    operacion: `${n} × 1, ${n} × 2, ${n} × 3, ${n} × 4, ${n} × 5`,
    solucion: `${multiplos.join(", ")}.`,
  };
}

function genFracciones(curso) {
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

function genOperacionesFracciones(curso) {
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

function genDecimales(curso) {
  const entero = randomInt(1, curso === "6" ? 99 : 20);
  const milesimas = randomInt(0, 999);
  const numero = entero + milesimas / 1000;
  const decimalesRedondeo = curso === "6" ? 2 : 1;
  const factor = Math.pow(10, decimalesRedondeo);
  const redondeado = Math.round(numero * factor) / factor;
  const nombreRedondeo = decimalesRedondeo === 1 ? "las décimas" : "las centésimas";
  return {
    enunciado: `Redondea el número ${fmtEs(numero, 3)} a ${nombreRedondeo}.`,
    datos: [`Número: ${fmtEs(numero, 3)}`],
    operacion: `Miramos la cifra siguiente a ${nombreRedondeo}: si es 5 o más, redondeamos hacia arriba.`,
    solucion: `${fmtEs(redondeado, decimalesRedondeo)}. El número redondeado es ${fmtEs(redondeado, decimalesRedondeo)}.`,
  };
}

function genDecimalesMD(curso) {
  const precio = roundMoney(randomInt(105, curso === "6" ? 995 : 495) / 100);
  const cantidad = randomInt(2, curso === "6" ? 9 : 6);
  const total = roundMoney(precio * cantidad);
  if (Math.random() < 0.5) {
    return {
      enunciado: `Un kilo de naranjas cuesta ${fmtEs(precio)} €. ¿Cuánto cuestan ${cantidad} kilos?`,
      datos: [`Precio por kilo: ${fmtEs(precio)} €`, `Cantidad: ${cantidad} kg`],
      operacion: `${fmtEs(precio)} × ${cantidad} = ${fmtEs(total)}`,
      solucion: `${fmtEs(total)} €. Cuestan ${fmtEs(total)} €.`,
    };
  }
  return {
    enunciado: `${cantidad} kilos de peras cuestan ${fmtEs(total)} € en total. ¿Cuánto cuesta 1 kilo?`,
    datos: [`Precio total: ${fmtEs(total)} €`, `Cantidad: ${cantidad} kg`],
    operacion: `${fmtEs(total)} ÷ ${cantidad} = ${fmtEs(precio)}`,
    solucion: `${fmtEs(precio)} €. Un kilo cuesta ${fmtEs(precio)} €.`,
  };
}

function genPorcentajes(curso) {
  const precio = roundMoney(randomInt(500, curso === "6" ? 9900 : 5000) / 100);
  const pct = curso === "6" ? pick([10, 15, 20, 25, 30, 40]) : pick([10, 20, 25, 50]);
  if (curso === "6") {
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
  const resultado = roundMoney((precio * pct) / 100);
  return {
    enunciado: `Calcula el ${pct}% de ${fmtEs(precio)} €.`,
    datos: [`Cantidad: ${fmtEs(precio)} €`, `Porcentaje: ${pct}%`],
    operacion: `${fmtEs(precio)} × ${pct} ÷ 100 = ${fmtEs(resultado)}`,
    solucion: `${fmtEs(resultado)} €. El ${pct}% de ${fmtEs(precio)} € es ${fmtEs(resultado)} €.`,
  };
}

function genProblemasMixtos(curso) {
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

function genMedidas(curso) {
  const conversiones = [
    { from: "km", to: "m", factor: 1000, frase: (c) => `Un ciclista recorre ${c} km en una etapa. ¿Cuántos m son?` },
    { from: "kg", to: "g", factor: 1000, frase: (c) => `Un camión transporta ${c} kg de mercancía. ¿Cuántos g son?` },
    { from: "L", to: "mL", factor: 1000, frase: (c) => `Un depósito contiene ${c} L de agua. ¿Cuántos mL son?` },
    { from: "m", to: "cm", factor: 100, frase: (c) => `Un rollo de tela mide ${c} m de largo. ¿Cuántos cm son?` },
  ];
  const conv = pick(conversiones);
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

function genAreas(curso) {
  const base = randomInt(4, curso === "6" ? 25 : 15);
  const altura = randomInt(3, curso === "6" ? 20 : 12);
  const esTriangulo = curso === "6" && Math.random() < 0.4;
  if (esTriangulo) {
    const area = (base * altura) / 2;
    return {
      enunciado: `Un terreno triangular tiene una base de ${base} m y una altura de ${altura} m. ¿Cuál es su área?`,
      datos: [`Base: ${base} m`, `Altura: ${altura} m`],
      operacion: `(${base} × ${altura}) ÷ 2 = ${fmtAuto(area)}`,
      solucion: `${fmtAuto(area)} m². El área del terreno es ${fmtAuto(area)} m².`,
    };
  }
  const area = base * altura;
  const perimetro = 2 * (base + altura);
  return {
    enunciado: `Un terreno rectangular mide ${base} m de largo y ${altura} m de ancho. ¿Cuál es su área y su perímetro?`,
    datos: [`Largo: ${base} m`, `Ancho: ${altura} m`],
    operacion: `Área: ${base} × ${altura} = ${area}. Perímetro: 2 × (${base} + ${altura}) = ${perimetro}`,
    solucion: `Área = ${area} m², Perímetro = ${perimetro} m.`,
  };
}

function genCircunferencia(curso) {
  const radio = randomInt(2, curso === "6" ? 15 : 10);
  const PI = 3.14;
  if (curso === "6" && Math.random() < 0.5) {
    const area = roundMoney(PI * radio * radio);
    return {
      enunciado: `Una piscina circular tiene un radio de ${radio} m. ¿Cuál es su área? (usa π ≈ 3,14)`,
      datos: [`Radio: ${radio} m`, `π ≈ 3,14`],
      operacion: `π × ${radio}² = 3,14 × ${radio * radio} = ${fmtEs(area)}`,
      solucion: `${fmtEs(area)} m². El área de la piscina es ${fmtEs(area)} m².`,
    };
  }
  const longitud = roundMoney(2 * PI * radio);
  return {
    enunciado: `Una piscina circular tiene un radio de ${radio} m. ¿Cuál es la longitud de su circunferencia? (usa π ≈ 3,14)`,
    datos: [`Radio: ${radio} m`, `π ≈ 3,14`],
    operacion: `2 × π × ${radio} = 2 × 3,14 × ${radio} = ${fmtEs(longitud)}`,
    solucion: `${fmtEs(longitud)} m. La circunferencia mide ${fmtEs(longitud)} m.`,
  };
}

function genProporcionalidad(curso) {
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

function genEstadistica(curso) {
  const n = curso === "6" ? 6 : 5;
  const valores = Array.from({ length: n }, () => randomInt(1, 10));
  const suma = valores.reduce((acc, v) => acc + v, 0);
  const media = fmtTrim(suma / n);
  const ordenados = [...valores].sort((a, b) => a - b);
  const mediana =
    n % 2 === 0 ? fmtTrim((ordenados[n / 2 - 1] + ordenados[n / 2]) / 2) : String(ordenados[(n - 1) / 2]);
  const escenario = pick([
    { contexto: "goles marcados en", marco: "partidos" },
    { contexto: "libros leídos en", marco: "meses" },
    { contexto: "puntos obtenidos en", marco: "partidos" },
  ]);
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

function labeledBox(label, extraLines, spacingAfter, shading) {
  const runs = [{ text: label + " ", bold: true, color: "0f766e" }];
  for (let i = 0; i < extraLines; i++) runs.push({ break: true });
  runs.push({ text: " " });
  return { runs, border: true, shading: shading ?? "FAFAFA", spacingAfter };
}

function buildHeaderParagraphs(topic, curso, fecha) {
  return [
    { runs: [{ text: "Aprende y Repasa", bold: true, size: 18, color: "666d80" }], spacingAfter: 30 },
    { runs: [{ text: "Ficha de matemáticas", bold: true, size: 32, color: "0f766e" }], spacingAfter: 100 },
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
    runs: [{ text: `Problema ${index + 1}`, bold: true, size: 22, color: "4338ca" }],
    spacingBefore: startsNewPage ? 0 : 90,
    spacingAfter: 30,
    pageBreakBefore: startsNewPage,
  });
  paragraphs.push({ runs: [{ text: problem.enunciado }], spacingAfter: 40 });

  if (showSolutions) {
    paragraphs.push({
      runs: [{ text: "Datos: ", bold: true, color: "0f766e" }, { text: problem.datos.join("   ·   ") }],
      border: true,
      shading: "FAFAFA",
      spacingAfter: 50,
    });
    paragraphs.push({
      runs: [{ text: "Operación: ", bold: true, color: "0f766e" }, { text: problem.operacion }],
      border: true,
      shading: "F0FDFA",
      spacingAfter: 50,
    });
    paragraphs.push({
      runs: [{ text: "Solución: ", bold: true, color: "0f766e" }, { text: problem.solucion, bold: true, color: "0f766e" }],
      border: true,
      shading: "ECFDF5",
      spacingAfter: 140,
    });
  } else {
    paragraphs.push(labeledBox("Datos:", 1, 50));
    paragraphs.push(labeledBox("Operación:", 0, 50, "F0FDFA"));
    paragraphs.push(labeledBox("Solución:", 0, 140, "ECFDF5"));
  }

  return paragraphs;
}

function buildFichaDocument({ topic, curso, fecha, problems, showSolutions }) {
  const paragraphs = [];
  paragraphs.push(...buildHeaderParagraphs(topic, curso, fecha));

  if (showSolutions) {
    paragraphs.push({ runs: [{ text: "Hoja de soluciones", bold: true, size: 24, color: "be123c" }], spacingAfter: 140 });
  } else {
    paragraphs.push({
      runs: [{ text: topic.resumen }],
      border: true,
      shading: "EEF2FF",
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
