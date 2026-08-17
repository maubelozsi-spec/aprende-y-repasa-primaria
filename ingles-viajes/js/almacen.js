// ============================================================
// Inglés para Viajar — guardado del progreso.
//
// Todo se guarda en este dispositivo (localStorage): no hay
// cuentas, ni servidor, ni nada que registrar. A cambio, si
// cambias de móvil hay que llevarse el archivo de respaldo, y
// para eso están exportar() e importar().
// ============================================================

const CLAVE = "iv_progreso";
const VERSION = 1;

// Cajas del sistema de repaso: cuántos días hay que esperar antes
// de volver a preguntar una palabra que has acertado. La palabra
// sube de caja con cada acierto y vuelve a la primera al fallar.
export const INTERVALOS = [0, 1, 2, 4, 8, 16, 35];
export const CAJA_MAXIMA = INTERVALOS.length - 1;

const POR_DEFECTO = {
  version: VERSION,
  conversaciones: {},   // "tema:nivel" -> { completado, aciertos, total, fecha }
  tarjetas: {},         // idVocabulario -> { caja, proximo, aciertos, fallos, visto }
  ajustes: {
    nuevasPorDia: 8,
    modoEntrada: "voz",
    usarIA: false,
    claveIA: "",
    modeloIA: "claude-opus-5",
  },
  racha: { ultimoDia: null, dias: 0 },
  estadisticas: { turnos: 0, perfectos: 0, repasos: 0 },
};

function clonar(objeto) {
  return JSON.parse(JSON.stringify(objeto));
}

function fusionar(base, guardado) {
  const resultado = clonar(base);
  if (!guardado || typeof guardado !== "object") return resultado;
  Object.keys(guardado).forEach((clave) => {
    if (clave === "ajustes" || clave === "racha" || clave === "estadisticas") {
      resultado[clave] = Object.assign({}, base[clave], guardado[clave] || {});
    } else if (guardado[clave] !== undefined) {
      resultado[clave] = guardado[clave];
    }
  });
  resultado.version = VERSION;
  return resultado;
}

let cache = null;

export function leer() {
  if (cache) return cache;
  try {
    const crudo = localStorage.getItem(CLAVE);
    cache = fusionar(POR_DEFECTO, crudo ? JSON.parse(crudo) : null);
  } catch (e) {
    cache = clonar(POR_DEFECTO);
  }
  return cache;
}

export function guardar(datos) {
  cache = datos || cache;
  try {
    localStorage.setItem(CLAVE, JSON.stringify(cache));
  } catch (e) {
    // Modo incógnito o almacenamiento lleno: la sesión sigue
    // funcionando en memoria, solo que no se conservará.
  }
  return cache;
}

export function actualizar(cambios) {
  const datos = leer();
  cambios(datos);
  return guardar(datos);
}

// ---------- ajustes ----------

export function ajustes() {
  return leer().ajustes;
}

export function guardarAjustes(nuevos) {
  return actualizar((d) => {
    d.ajustes = Object.assign({}, d.ajustes, nuevos);
  }).ajustes;
}

// ---------- conversaciones ----------

export function claveNivel(temaId, nivel) {
  return `${temaId}:${nivel}`;
}

export function progresoNivel(temaId, nivel) {
  return leer().conversaciones[claveNivel(temaId, nivel)] || null;
}

export function nivelDesbloqueado(temaId, nivel) {
  if (nivel === 0) return true;
  const anterior = progresoNivel(temaId, nivel - 1);
  return !!(anterior && anterior.completado);
}

export function registrarNivel(temaId, nivel, aciertos, total) {
  return actualizar((d) => {
    const clave = claveNivel(temaId, nivel);
    const previo = d.conversaciones[clave] || { aciertos: 0, total: 0 };
    d.conversaciones[clave] = {
      completado: true,
      aciertos: Math.max(previo.aciertos || 0, aciertos),
      total,
      fecha: Date.now(),
    };
  });
}

export function registrarTurno(fuePerfecto) {
  return actualizar((d) => {
    d.estadisticas.turnos += 1;
    if (fuePerfecto) d.estadisticas.perfectos += 1;
  });
}

// ---------- tarjetas de vocabulario ----------

function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function tarjeta(id) {
  return leer().tarjetas[id] || null;
}

export function tarjetasPendientes(todosLosIds) {
  const datos = leer();
  const ahora = Date.now();
  const pendientes = [];
  const nuevas = [];

  todosLosIds.forEach((id) => {
    const t = datos.tarjetas[id];
    if (!t) nuevas.push(id);
    else if (t.proximo <= ahora) pendientes.push(id);
  });

  // Las que llevan más tiempo esperando salen antes.
  pendientes.sort((a, b) => datos.tarjetas[a].proximo - datos.tarjetas[b].proximo);
  return { pendientes, nuevas };
}

export function registrarRepaso(id, acertada) {
  return actualizar((d) => {
    const previa = d.tarjetas[id] || { caja: 0, aciertos: 0, fallos: 0 };
    const caja = acertada ? Math.min(previa.caja + 1, CAJA_MAXIMA) : 0;
    const dias = INTERVALOS[caja];
    d.tarjetas[id] = {
      caja,
      proximo: Date.now() + dias * 24 * 60 * 60 * 1000,
      aciertos: previa.aciertos + (acertada ? 1 : 0),
      fallos: previa.fallos + (acertada ? 0 : 1),
      visto: Date.now(),
    };
    d.estadisticas.repasos += 1;
    marcarRacha(d);
  });
}

// Marca que hoy se ha practicado, y lleva la cuenta de días
// seguidos. Se llama desde dentro de actualizar(), por eso recibe
// el objeto de datos en vez de leerlo otra vez.
function marcarRacha(d) {
  const hoy = hoyISO();
  if (d.racha.ultimoDia === hoy) return;
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const ayerISO = `${ayer.getFullYear()}-${String(ayer.getMonth() + 1).padStart(2, "0")}-${String(ayer.getDate()).padStart(2, "0")}`;
  d.racha.dias = d.racha.ultimoDia === ayerISO ? d.racha.dias + 1 : 1;
  d.racha.ultimoDia = hoy;
}

export function tocarRacha() {
  return actualizar((d) => marcarRacha(d));
}

// ---------- resumen para la pantalla de progreso ----------

export function resumen(todosLosIds, totalNiveles) {
  const d = leer();
  const { pendientes, nuevas } = tarjetasPendientes(todosLosIds);
  const tarjetas = Object.values(d.tarjetas);
  const dominadas = tarjetas.filter((t) => t.caja >= 4).length;
  const nivelesHechos = Object.values(d.conversaciones).filter((c) => c.completado).length;

  return {
    nivelesHechos,
    totalNiveles,
    palabrasVistas: tarjetas.length,
    palabrasTotales: todosLosIds.length,
    dominadas,
    pendientesHoy: pendientes.length,
    nuevasDisponibles: nuevas.length,
    racha: d.racha.dias || 0,
    turnos: d.estadisticas.turnos || 0,
    perfectos: d.estadisticas.perfectos || 0,
    repasos: d.estadisticas.repasos || 0,
  };
}

// ---------- respaldo ----------

export function exportar() {
  const datos = clonar(leer());
  // La clave de la API nunca sale del dispositivo, ni siquiera en
  // el respaldo: es un secreto personal y un archivo se comparte
  // con demasiada facilidad.
  if (datos.ajustes) datos.ajustes.claveIA = "";
  return JSON.stringify(datos, null, 2);
}

export function importar(textoJson) {
  const entrante = JSON.parse(textoJson);
  if (!entrante || typeof entrante !== "object") throw new Error("El archivo no tiene el formato esperado.");
  const claveActual = leer().ajustes.claveIA;
  cache = fusionar(POR_DEFECTO, entrante);
  cache.ajustes.claveIA = claveActual; // se conserva la clave del dispositivo
  return guardar(cache);
}

export function borrarTodo() {
  cache = clonar(POR_DEFECTO);
  try { localStorage.removeItem(CLAVE); } catch (e) { /* sin localStorage */ }
  return cache;
}
