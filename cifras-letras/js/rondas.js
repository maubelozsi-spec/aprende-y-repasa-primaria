// ============================================================
// Cifras y Letras — control de partidas y rondas sobre Firestore.
// Este módulo lo comparten el panel del docente (partidas de aula)
// y la pantalla del jugador cuando ejerce de anfitrión de una sala
// libre: crear la partida, sortear letras y cifras, abrir y cerrar
// el tiempo, evaluar las respuestas y repartir los puntos.
//
// Colecciones:
//   cylPartidas/{codigo}   estado vivo de la partida (doc único)
//   cylJugadores/{id}      un doc por jugador o equipo
//   cylRespuestas/{id}     una respuesta por jugador y ronda
// ============================================================

import {
  doc, setDoc, updateDoc, getDoc, writeBatch, serverTimestamp, increment,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
  generarCodigo, sortearLetra, sortearLetrasAutomatico, sortearRondaCifras,
  palabraCabeEnLetras, mejoresPalabras, puntosLetras, puntosCifras,
  validarPasosCifras, repartirPuntos, normalizarPalabra, NIVELES_CIFRAS,
} from "./motor.js";
import { enDiccionario, formaBonita, todasLasFormas } from "./diccionario.js";

export const CONFIG_DEFECTO = {
  numLetras: 9,          // fichas de la prueba de letras (7 a 10)
  duracionLetras: 60,    // segundos (en la tele son 45; con niños, algo más)
  duracionCifras: 90,    // segundos (en la tele son 45)
  nivelCifras: 1,        // 1 iniciación · 2 avanzado · 3 como en la tele
  ayudaCalculo: "pasos", // "pasos" | "final" | "mental"
  validacion: "auto",    // "auto" (diccionario + comodín) | "docente" (valida a mano)
  puntuacion: "todos",   // "todos" puntúan | "mejor": solo la mejor jugada (como en la tele)
};

export { NIVELES_CIFRAS };

export function refPartida(db, codigo) {
  return doc(db, "cylPartidas", codigo);
}

export function idRespuesta(codigo, numeroRonda, jugadorId) {
  return codigo + "_r" + numeroRonda + "_" + jugadorId;
}

// ---------- crear partida ----------

// Devuelve el código de la partida creada (reintenta si el código
// aleatorio ya existiera, que es casi imposible pero gratis evitar).
export async function crearPartida(db, datos) {
  for (let intento = 0; intento < 5; intento++) {
    const codigo = generarCodigo();
    const ref = refPartida(db, codigo);
    const ya = await getDoc(ref);
    if (ya.exists()) continue;
    await setDoc(ref, {
      codigo: codigo,
      tipo: datos.tipo,                       // "aula" | "libre"
      teacherId: datos.teacherId || null,
      anfitrionUid: datos.anfitrionUid,
      nombre: datos.nombre || "Partida",
      estado: "lobby",                        // lobby | ronda | fin
      config: { ...CONFIG_DEFECTO, ...(datos.config || {}) },
      ronda: null,
      rondasJugadas: 0,
      creadaEn: serverTimestamp(),
      actualizadaEn: serverTimestamp(),
    });
    return codigo;
  }
  throw new Error("No se ha podido generar un código de partida libre.");
}

// ---------- preparar rondas ----------

export async function prepararRondaLetras(db, partida) {
  await updateDoc(refPartida(db, partida.codigo), {
    estado: "ronda",
    ronda: {
      numero: (partida.rondasJugadas || 0) + 1,
      tipo: "letras",
      estado: "sorteo",              // sorteo | jugando | validando | cerrada
      letras: [],
      duracion: partida.config.duracionLetras,
      empiezaEn: null,
      solucion: null,
    },
    actualizadaEn: serverTimestamp(),
  });
}

// Saca una letra más ("vocal" | "consonante" | "auto" para completar solo).
export async function sacarLetra(db, partida, tipoLetra) {
  const ronda = partida.ronda;
  if (!ronda || ronda.tipo !== "letras" || ronda.estado !== "sorteo") return;
  const max = partida.config.numLetras;
  let letras = (ronda.letras || []).slice();
  if (tipoLetra === "auto") {
    const faltan = max - letras.length;
    const nuevas = sortearLetrasAutomatico(max).slice(0, faltan);
    letras = letras.concat(nuevas);
  } else {
    if (letras.length >= max) return;
    letras.push(sortearLetra(tipoLetra, letras));
  }
  await updateDoc(refPartida(db, partida.codigo), {
    "ronda.letras": letras.slice(0, max),
    actualizadaEn: serverTimestamp(),
  });
}

export async function prepararRondaCifras(db, partida) {
  const sorteo = sortearRondaCifras(partida.config.nivelCifras);
  await updateDoc(refPartida(db, partida.codigo), {
    estado: "ronda",
    ronda: {
      numero: (partida.rondasJugadas || 0) + 1,
      tipo: "cifras",
      estado: "sorteo",
      fichas: sorteo.fichas,
      objetivo: sorteo.objetivo,
      solucionExacta: sorteo.solucion,   // receta secreta hasta el cierre
      duracion: partida.config.duracionCifras,
      empiezaEn: null,
      solucion: null,
    },
    actualizadaEn: serverTimestamp(),
  });
}

// ---------- tiempo ----------

export async function empezarTiempo(db, partida) {
  await updateDoc(refPartida(db, partida.codigo), {
    "ronda.estado": "jugando",
    "ronda.empiezaEn": serverTimestamp(),
    actualizadaEn: serverTimestamp(),
  });
}

export async function pasarAValidacion(db, partida) {
  await updateDoc(refPartida(db, partida.codigo), {
    "ronda.estado": "validando",
    actualizadaEn: serverTimestamp(),
  });
}

// ---------- evaluación automática de una respuesta ----------

// Devuelve { estado, motivo, puntosPosibles } sin tocar la base de
// datos. En letras el comodín humano puede cambiar luego el estado.
export function evaluarRespuesta(respuesta, ronda, config) {
  if (ronda.tipo === "letras") {
    const palabra = normalizarPalabra(respuesta.palabra);
    if (!palabra || palabra.length < 2) {
      return { estado: "invalida", motivo: "sin palabra", puntosPosibles: 0 };
    }
    if (!palabraCabeEnLetras(palabra, ronda.letras)) {
      return { estado: "invalida", motivo: "usa letras que no estaban", puntosPosibles: 0 };
    }
    const puntos = puntosLetras(palabra, ronda.letras.length);
    if (!enDiccionario(palabra)) {
      // En modo "docente" todo queda pendiente; en "auto" también se
      // deja pendiente para que el comodín humano decida con la RAE.
      return { estado: "pendiente", motivo: "no está en el diccionario de la app", puntosPosibles: puntos };
    }
    return { estado: config.validacion === "docente" ? "pendiente" : "valida", motivo: "", puntosPosibles: puntos };
  }

  // ---- cifras ----
  const pasos = respuesta.pasos || [];
  const chequeo = validarPasosCifras(ronda.fichas, pasos);
  if (!chequeo.ok) {
    return { estado: "invalida", motivo: chequeo.motivo, puntosPosibles: 0 };
  }
  const real = pasos.length ? pasos[pasos.length - 1].r : null;
  const resultado = respuesta.resultado != null ? respuesta.resultado : real;
  if (resultado == null) {
    return { estado: "invalida", motivo: "no eligió resultado", puntosPosibles: 0 };
  }
  // En el modo mental el jugador declara su resultado: si la cuenta
  // declarada no coincide con la de verdad, se queda sin puntos
  // (como en la tele cuando la cuenta está mal).
  if (respuesta.declarado != null && Number(respuesta.declarado) !== Number(resultado)) {
    return { estado: "invalida", motivo: "la cuenta declarada no coincide (era " + resultado + ")", puntosPosibles: 0 };
  }
  const distancia = Math.abs(ronda.objetivo - Number(resultado));
  const puntos = puntosCifras(distancia);
  return {
    estado: "valida",
    motivo: distancia === 0 ? "¡pleno!" : "se queda a " + distancia,
    puntosPosibles: puntos,
    distancia: distancia,
  };
}

// ---------- cierre de ronda y reparto ----------

// respuestas: [{ id, jugadorId, estado, puntosPosibles, … }] ya
// revisadas (el humano ha podido cambiar estados "pendiente").
// Escribe puntos en respuestas y jugadores, y cierra la ronda
// dejando en partida.ronda.solucion la jugada perfecta.
export async function cerrarRondaYRepartir(db, partida, respuestas) {
  const config = partida.config;
  const ronda = partida.ronda;
  // Lo pendiente sin decidir se considera válido en modo auto
  // (mejor pasarse de generoso en clase) e inválido si nadie lo revisó… no:
  // lo pendiente se queda como esté marcado al pulsar el botón; aquí
  // solo repartimos entre las válidas.
  const puntos = repartirPuntos(
    respuestas.map((r) => ({ estado: r.estado, puntosPosibles: r.puntosPosibles || 0 })),
    config.puntuacion
  );

  const batch = writeBatch(db);
  respuestas.forEach((r, i) => {
    batch.update(doc(db, "cylRespuestas", r.id), { puntos: puntos[i], estado: r.estado });
    if (puntos[i] > 0) {
      batch.update(doc(db, "cylJugadores", r.jugadorId), { puntos: increment(puntos[i]) });
    }
  });

  // La jugada perfecta, para enseñarla en la proyección.
  let solucion = null;
  if (ronda.tipo === "letras") {
    const mejores = mejoresPalabras(ronda.letras, [...todasLasFormas()], 3);
    solucion = { palabras: mejores.map((m) => formaBonita(m)) };
  } else {
    solucion = { pasos: ronda.solucionExacta || [] };
  }

  batch.update(refPartida(db, partida.codigo), {
    "ronda.estado": "cerrada",
    "ronda.solucion": solucion,
    rondasJugadas: (partida.rondasJugadas || 0) + 1,
    actualizadaEn: serverTimestamp(),
  });
  await batch.commit();
}

export async function terminarPartida(db, partida) {
  await updateDoc(refPartida(db, partida.codigo), {
    estado: "fin",
    actualizadaEn: serverTimestamp(),
  });
}
