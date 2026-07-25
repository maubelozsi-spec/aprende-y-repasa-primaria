// ============================================================
// Economía Familiar 2.0 — motor del juego.
// Lógica pura, sin Firebase ni DOM: recibe datos y devuelve
// resultados. Así el flujo mensual de familia.js, el cierre de mes
// de docente.js y el informe final comparten los mismos cálculos.
// ============================================================

import {
  TARJETAS_SUERTE,
  TARJETAS_IMPREVISTO,
  ESTRATEGIAS_NEGOCIO,
  RETOS_TRAMO,
  CONFIG_JUEGO,
  NOMBRES_MES,
} from "./catalogos.js";

// ---------- utilidades ----------

export function azarEntre(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function elegir(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

export function redondear(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

export function euros(n) {
  const v = Number(n) || 0;
  return v.toLocaleString("es-ES", { maximumFractionDigits: 0 }) + " €";
}

// Código de acceso de familia: 6 caracteres sin confusos (0/O, 1/I/L).
export function generarCodigo() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function idAleatorio() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ---------- gastos fijos con inflación ----------

// Con la inflación activada, los gastos fijos suben un 0,5% acumulativo
// cada mes: en diciembre la vida es ~5,7% más cara que en enero.
export function gastosFijosDelMes(familia, mes, ajustes) {
  const base = (familia.gastosFijos || []).reduce((s, g) => s + (Number(g.importe) || 0), 0);
  if (!ajustes || !ajustes.inflacion) return redondear(base);
  const factor = Math.pow(1 + CONFIG_JUEGO.inflacionMensual / 100, Math.max(0, mes - 1));
  return redondear(base * factor);
}

// ---------- ingresos y pagas extra ----------

export function ingresosDelMes(familia, mes, ajustes) {
  const base = Number(familia.ingresosMensuales) || 0;
  let pagaExtra = 0;
  if (ajustes && ajustes.pagasExtra && CONFIG_JUEGO.mesesPagaExtra.includes(mes)) {
    pagaExtra = redondear(base * CONFIG_JUEGO.pagaExtraPorcentaje / 100);
  }
  return { base: redondear(base), pagaExtra: pagaExtra, total: redondear(base + pagaExtra) };
}

// ---------- tarjeta del mes (suerte / imprevisto) ----------

export function sacarTarjeta(familia) {
  const dif = familia.dificultad || "media";
  const probSuerte = CONFIG_JUEGO.probSuerte[dif] || 45;
  const escala = CONFIG_JUEGO.escalaImportes[dif] || 1;
  const esSuerte = Math.random() * 100 < probSuerte;

  let candidatas = esSuerte ? TARJETAS_SUERTE : TARJETAS_IMPREVISTO;
  if (!esSuerte && !familia.mascotas) {
    candidatas = candidatas.filter((t) => !t.requiereMascota);
  }
  const tarjeta = elegir(candidatas);
  const bruto = Array.isArray(tarjeta.importe)
    ? azarEntre(Math.min(...tarjeta.importe), Math.max(...tarjeta.importe))
    : tarjeta.importe;
  // En fácil los imprevistos duelen menos y la suerte se queda igual;
  // en difícil, al revés: los golpes se notan más.
  const importe = redondear(bruto < 0 ? bruto * escala : bruto * (2 - escala));
  return {
    tipo: esSuerte ? "suerte" : "imprevisto",
    texto: tarjeta.texto,
    emoji: tarjeta.emoji,
    importe: importe,
  };
}

// ---------- retos por tramo ----------

// Al crear la familia se sortea un reto por tramo según su dificultad.
export function sortearRetos(dificultad) {
  const dif = dificultad || "media";
  const tramos = [
    { meses: "1-4", desde: 1, hasta: 4 },
    { meses: "5-8", desde: 5, hasta: 8 },
    { meses: "9-12", desde: 9, hasta: 12 },
  ];
  const usados = new Set();
  return tramos.map((t) => {
    let reto = elegir(RETOS_TRAMO[dif]);
    let intentos = 0;
    while (usados.has(reto.descripcion) && intentos < 10) {
      reto = elegir(RETOS_TRAMO[dif]);
      intentos++;
    }
    usados.add(reto.descripcion);
    return {
      meses: t.meses,
      desde: t.desde,
      hasta: t.hasta,
      descripcion: reto.descripcion,
      importe: reto.importe,
      recurrente: reto.recurrente,
    };
  });
}

// Efecto del reto en un mes concreto: si es recurrente se aplica cada
// mes del tramo; si no, solo el primer mes del tramo.
export function retoDelMes(familia, mes) {
  const retos = familia.retos || [];
  for (const r of retos) {
    if (mes >= r.desde && mes <= r.hasta) {
      if (r.recurrente || mes === r.desde) {
        return { descripcion: r.descripcion, importe: redondear(r.importe), recurrente: r.recurrente };
      }
      return null;
    }
  }
  return null;
}

// ---------- eventos de la localidad ----------

// Devuelve los eventos que tocan este mes, ya con importe sorteado y
// marcando si son obligatorios o a decidir por la familia.
export function eventosDelMes(eventos, mes) {
  const resultado = [];
  for (const ev of eventos || []) {
    if (ev.activo === false) continue;
    if (!(ev.meses || []).includes(mes)) continue;
    if (Math.random() * 100 >= (ev.probabilidad == null ? 100 : ev.probabilidad)) continue;
    const importe = azarEntre(Math.min(ev.importeMin, ev.importeMax), Math.max(ev.importeMin, ev.importeMax));
    const esIngreso = ev.tipo.startsWith("ingreso");
    resultado.push({
      id: ev.id || null,
      titulo: ev.titulo,
      emoji: ev.emoji || "📅",
      descripcion: ev.descripcion || "",
      tipo: ev.tipo,
      opcional: ev.tipo.endsWith("opcional"),
      importe: redondear(esIngreso ? Math.abs(importe) : -Math.abs(importe)),
    });
  }
  return resultado;
}

// ---------- negocio ----------

// Resultado mensual del negocio: tirada de éxito (modificada por la
// estrategia) x beneficio base x temporada x multiplicador estrategia.
// Un mes malo pierde en torno a un tercio del beneficio base.
export function resultadoNegocio(negocio, estrategiaId, mes) {
  if (!negocio || !negocio.activo) return null;
  const estrategia = ESTRATEGIAS_NEGOCIO.find((e) => e.id === estrategiaId) || ESTRATEGIAS_NEGOCIO[0];
  const temporada = (negocio.temporada && negocio.temporada[mes]) || (negocio.temporada && negocio.temporada[String(mes)]) || 1;
  const probExito = Math.max(5, Math.min(95, (negocio.exito || 50) - estrategia.riesgo));
  const exito = Math.random() * 100 < probExito;
  // Variación natural del mes: entre el 70% y el 130% de lo esperado.
  const variacion = 0.7 + Math.random() * 0.6;

  let resultado;
  if (exito) {
    resultado = negocio.beneficioBase * temporada * estrategia.multiplicador * variacion;
  } else {
    resultado = -negocio.beneficioBase * 0.35 * variacion;
  }
  resultado = redondear(resultado - estrategia.coste);
  return {
    exito: exito,
    estrategia: estrategia.id,
    estrategiaNombre: estrategia.emoji + " " + estrategia.nombre,
    costeEstrategia: estrategia.coste,
    temporada: temporada,
    importe: resultado,
  };
}

// ---------- índice de salud emocional (ISE, 0-100) ----------

// La familia no solo debe sobrevivir: debe vivir. Puntúa:
//  - hasta 35 pts por dedicar algo al ocio (tope al llegar al 15% de
//    los ingresos; no gastar nada en pasarlo bien penaliza),
//  - hasta 30 pts por tener colchón (ahorros vs. un mes de gastos),
//  - hasta 15 pts por acabar el mes en positivo,
//  - hasta 10 pts por avanzar hacia la meta de ahorro,
//  - 10 pts de base por seguir adelante,
//  - penalizaciones por deudas vencidas o plan de rescate.
export function calcularISE(datos) {
  const ingresos = Math.max(1, datos.ingresos || 1);
  const ratioOcio = Math.max(0, (datos.ocio || 0) / ingresos);
  const pOcio = 35 * Math.min(1, ratioOcio / 0.15);
  const colchon = Math.max(0, datos.ahorrosFinales || 0) / Math.max(1, datos.gastosFijos || 1);
  const pColchon = 30 * Math.min(1, colchon);
  const pPositivo = (datos.saldoMes || 0) >= 0 ? 15 : 0;
  const pMeta = datos.progresoMeta ? 10 * Math.min(1, datos.progresoMeta) : 0;
  let ise = 10 + pOcio + pColchon + pPositivo + pMeta;
  if (datos.prestamoVencido) ise -= 20;
  if (datos.enRescate) ise -= 15;
  return Math.max(0, Math.min(100, Math.round(ise)));
}

// ---------- premios del mes ----------

export function premiosDelMes(datos) {
  // Estrella: mes en positivo Y decisión de ahorrar algo.
  const estrella = (datos.saldoMes || 0) >= 0 && (datos.ahorroDecidido || 0) > 0;
  // Alerta: acabar el mes en números rojos o con los ahorros por debajo de cero.
  const alerta = (datos.saldoMes || 0) < 0 || (datos.ahorrosFinales || 0) < 0;
  // Corazón: haber prestado dinero a otra familia este mes.
  const corazon = (datos.solidaridadDada || 0) > 0;
  return { estrella: estrella, alerta: alerta, corazon: corazon };
}

// ---------- insignias ----------

// Comprueba qué insignias nuevas gana la familia con el historial de
// meses ya cerrado (lista de registros ecoMeses ordenada por mes).
export function insigniasNuevas(familia, historial) {
  const tiene = new Set(familia.insignias || []);
  const nuevas = [];
  const dar = (id) => {
    if (!tiene.has(id)) { tiene.add(id); nuevas.push(id); }
  };

  // Tres meses seguidos ahorrando.
  let rachaAhorro = 0;
  let rachaISE = 0;
  for (const m of historial) {
    rachaAhorro = (m.ahorroDecidido || 0) > 0 ? rachaAhorro + 1 : 0;
    rachaISE = (m.ise || 0) >= 70 ? rachaISE + 1 : 0;
    if (rachaAhorro >= 3) dar("ahorradora");
    if (rachaISE >= 3) dar("equilibrada");
  }
  if ((familia.corazones || 0) >= 2) dar("solidaria");
  if (familia.negocio && familia.negocio.mesesActivo >= 3) dar("emprendedora");
  if (familia.cuentaAhorro && familia.cuentaAhorro.activa) dar("previsora");
  if (familia.meta && familia.meta.cumplida) dar("meta");
  if (historial.length >= 12) dar("docemeses");
  return nuevas;
}

// ---------- análisis comparativo del mes (sin IA, por reglas) ----------

// Genera el texto que en la versión 1 escribía la IA: un repaso del mes
// con rankings y menciones concretas, a partir de los registros del mes
// de todas las familias.
export function analisisDelMes(mes, registros, familias) {
  if (!registros.length) return "";
  const nombre = (fid) => {
    const f = familias.find((x) => x.id === fid || x.codigo === fid);
    return f ? (f.emoji + " " + f.nombre) : "Una familia";
  };
  const frases = [];
  frases.push("📊 Resumen de " + (NOMBRES_MES[mes] || "el mes") + ":");

  const porAhorro = [...registros].sort((a, b) => (b.ahorroTotal || 0) - (a.ahorroTotal || 0));
  frases.push("🥇 La familia con más ahorros es " + nombre(porAhorro[0].familiaCodigo) +
    " con " + euros(porAhorro[0].ahorroTotal) + ".");

  const porSaldo = [...registros].sort((a, b) => (b.saldoMes || 0) - (a.saldoMes || 0));
  if (porSaldo[0] !== porAhorro[0]) {
    frases.push("📈 El mejor mes lo ha hecho " + nombre(porSaldo[0].familiaCodigo) +
      " (" + euros(porSaldo[0].saldoMes) + " de saldo).");
  }

  const enRojo = registros.filter((r) => (r.saldoMes || 0) < 0);
  if (enRojo.length) {
    frases.push("⚠️ " + enRojo.length + (enRojo.length === 1 ? " familia ha acabado" : " familias han acabado") +
      " el mes en números rojos. Toca revisar en qué se fue el dinero.");
  } else {
    frases.push("💪 ¡Todas las familias han acabado el mes en positivo!");
  }

  const porISE = [...registros].sort((a, b) => (b.ise || 0) - (a.ise || 0));
  frases.push("😊 La familia más feliz este mes es " + nombre(porISE[0].familiaCodigo) +
    " (salud emocional " + (porISE[0].ise || 0) + "/100).");
  const tristes = registros.filter((r) => (r.ise || 0) < 40);
  if (tristes.length) {
    frases.push("💭 Ojo: ahorrarlo todo y no disfrutar nada también pasa factura. " +
      tristes.map((r) => nombre(r.familiaCodigo)).join(", ") +
      (tristes.length === 1 ? " tiene" : " tienen") + " la salud emocional baja.");
  }

  const solidarias = registros.filter((r) => (r.solidaridadDada || 0) > 0);
  if (solidarias.length) {
    frases.push("❤️ Solidaridad en acción: " + solidarias.map((r) => nombre(r.familiaCodigo)).join(", ") +
      " ha" + (solidarias.length === 1 ? "" : "n") + " prestado dinero a quien lo necesitaba.");
  }

  const conNegocio = registros.filter((r) => r.negocio && r.negocio.importe != null);
  if (conNegocio.length) {
    const mejor = conNegocio.sort((a, b) => (b.negocio.importe || 0) - (a.negocio.importe || 0))[0];
    if ((mejor.negocio.importe || 0) > 0) {
      frases.push("🚀 El negocio más rentable del mes: " + nombre(mejor.familiaCodigo) +
        " (" + euros(mejor.negocio.importe) + ").");
    }
    const perdidas = conNegocio.filter((r) => (r.negocio.importe || 0) < 0);
    if (perdidas.length) {
      frases.push("📉 No todos los negocios han tenido buen mes: emprender también es arriesgar.");
    }
  }

  return frases.join("\n");
}

// ---------- cierre de mes (lo ejecuta el docente) ----------

// Calcula los efectos automáticos de pasar de mes para una familia:
// intereses de la cuenta de ahorro, vencimiento del préstamo bancario
// (entrada en plan de rescate) y evolución/salida del plan de rescate.
// Devuelve { cambios, avisos } sin tocar la base de datos.
export function efectosCierreMes(familia, mesCerrado) {
  const cambios = {};
  const avisos = [];

  // Interés mensual de la cuenta de ahorro.
  if (familia.cuentaAhorro && familia.cuentaAhorro.activa && familia.cuentaAhorro.saldo > 0) {
    const interes = redondear(familia.cuentaAhorro.saldo * (familia.cuentaAhorro.interes || CONFIG_JUEGO.interesCuentaAhorro) / 100);
    cambios.cuentaAhorro = { ...familia.cuentaAhorro, saldo: redondear(familia.cuentaAhorro.saldo + interes) };
    avisos.push("🏦 " + familia.nombre + ": +" + euros(interes) + " de intereses en su cuenta de ahorro.");
  }

  // Préstamo bancario vencido sin devolver → plan de rescate.
  const prestamo = familia.prestamoBanco;
  if (prestamo && prestamo.activo && mesCerrado >= prestamo.mesLimite && (prestamo.devuelto || 0) < prestamo.importe) {
    if (!familia.planRescate || !familia.planRescate.activo) {
      cambios.planRescate = {
        activo: true,
        mesInicio: mesCerrado + 1,
        mesesRestantes: CONFIG_JUEGO.mesesPlanRescate,
        motivo: "No devolvió el préstamo bancario a tiempo",
      };
      avisos.push("🚨 " + familia.nombre + " no ha devuelto su préstamo a tiempo y entra en PLAN DE RESCATE " +
        CONFIG_JUEGO.mesesPlanRescate + " meses: ocio mínimo, sin banco y sin negocio nuevo.");
    }
  }

  // Evolución del plan de rescate: cada cierre resta un mes; si al
  // terminar la familia está en positivo, sale y gana la insignia.
  if (familia.planRescate && familia.planRescate.activo && (!cambios.planRescate)) {
    const restantes = (familia.planRescate.mesesRestantes || 1) - 1;
    if (restantes <= 0) {
      if ((familia.ahorros || 0) >= 0) {
        cambios.planRescate = { ...familia.planRescate, activo: false, mesesRestantes: 0 };
        cambios.insigniaRemontada = true;
        avisos.push("💪 ¡" + familia.nombre + " sale del plan de rescate con las cuentas saneadas! Insignia 'La gran remontada'.");
      } else {
        cambios.planRescate = { ...familia.planRescate, mesesRestantes: CONFIG_JUEGO.mesesPlanRescate };
        avisos.push("🔁 " + familia.nombre + " sigue en números rojos: el plan de rescate se renueva.");
      }
    } else {
      cambios.planRescate = { ...familia.planRescate, mesesRestantes: restantes };
    }
  }

  return { cambios: cambios, avisos: avisos };
}
