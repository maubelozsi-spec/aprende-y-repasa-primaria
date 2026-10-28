// ============================================================
// Letrania · panel del maestro (letrania/docente.html).
//
// - Alta del alumnado: usa las claves de Aprende y Repasa (students)
//   de cualquiera de las clases del docente y crea su héroe en
//   letHeroes/{clave}. El héroe no copia el nombre del alumno.
// - Acceso: «habilitar» deja entrar al alumno solo durante hoy; sus
//   minutos empiezan cuando él pulsa «Entrar en Letrania» (ver
//   js/alumno.js y las reglas de letHeroes en firestore.rules).
// - Misiones: las 5 casillas de cada ficha. Se guardan de una vez
//   para todo el grupo con un writeBatch: el héroe (XP, gemas,
//   estación y casillas de la ficha en curso), un registro por ficha en
//   letMisiones/{clave}_{ficha} y el total de la Alianza en
//   letConfig/{docente}.
//
// Consumo de Firestore al abrir el panel: 1 lectura por clase, 1 por
// alumno de sus clases (para ver los nombres, que solo ve el docente),
// 1 de ajustes y una escucha sobre los héroes del docente (unos 25
// documentos al empezar y después solo los que cambian, por ejemplo
// cuando un alumno entra). La escucha se cancela al salir de la
// página. Guardar las misiones de 25 alumnos: unas 51 escrituras.
// ============================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  writeBatch,
  updateDoc,
  deleteDoc,
  setDoc,
  increment,
  serverTimestamp,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { db, auth } from "../../js/firebase-init.js";

const L = window.Letrania;
const { esc, srcImg } = L;
const $ = (s) => document.querySelector(s);
const FICHA_FIN = L.TOTAL_FICHAS + 1; // estación «35» = recorrido terminado

let uid = null;
let clases = {}; // id -> nombre
let alumnos = {}; // clave -> { nickname, classId }
let heroes = {}; // clave -> datos de letHeroes
let ajustes = { minutos: L.MINUTOS_POR_DEFECTO, umbralAlianza: 600, fechaTesoro: "" };
const marcas = {}; // clave -> Set de casillas marcadas sin guardar
let cancelar = null;

function aviso(t) {
  const el = $("#toast");
  el.textContent = t;
  el.classList.add("show");
  clearTimeout(aviso._t);
  aviso._t = setTimeout(() => el.classList.remove("show"), 3000);
}

const ms = (t) => (t && t.toMillis ? t.toMillis() : 0);

function finDeHoy() {
  const d = new Date();
  d.setHours(23, 59, 59, 0);
  return Timestamp.fromDate(d);
}

function estadoDe(h) {
  const ahora = Date.now();
  if (!h.habilitado) return h.inicio ? { id: "agotado", txt: "Sin acceso" } : { id: "cerrado", txt: "Sin habilitar" };
  if (!h.inicio) {
    if (ahora >= ms(h.habilitadoHasta)) return { id: "cerrado", txt: "Habilitación caducada" };
    return { id: "espera", txt: "Habilitado · aún no ha entrado" };
  }
  const fin = ms(h.inicio) + (h.minutos || L.MINUTOS_POR_DEFECTO) * 60000;
  if (ahora < fin) return { id: "jugando", txt: "Jugando · quedan " + Math.ceil((fin - ahora) / 60000) + " min" };
  return { id: "agotado", txt: "Tiempo agotado" };
}

function casillasGuardadas(h) {
  const m = h.mision;
  if (!m || m.ficha !== h.ficha || !Array.isArray(m.casillas)) return [false, false, false, false, false];
  return m.casillas.slice(0, 5);
}

function claveVisible(clave) {
  const f = $("#filtroClase").value;
  return !f || (heroes[clave] && heroes[clave].classId === f);
}

function ordenadas() {
  return Object.keys(heroes)
    .filter(claveVisible)
    .sort((a, b) => {
      const ca = clases[heroes[a].classId] || "";
      const cb = clases[heroes[b].classId] || "";
      if (ca !== cb) return ca.localeCompare(cb, "es");
      return ((alumnos[a] || {}).nickname || a).localeCompare((alumnos[b] || {}).nickname || b, "es");
    });
}

// ---------- Tabla ----------

function pintarTabla() {
  const filas = ordenadas();
  $("#vacio").hidden = Object.keys(heroes).length > 0;
  $("#tBody").innerHTML = filas
    .map((clave) => {
      const h = heroes[clave];
      const a = alumnos[clave] || {};
      const est = estadoDe(h);
      const on = est.id === "espera" || est.id === "jugando";
      const nombreHeroe = h.nombreEstado === "aprobado" && h.nombre ? h.nombre : "";
      const fin = h.ficha >= FICHA_FIN;
      const contenido = fin ? "Recorrido terminado" : L.contenidoDe(h.ficha, h.senda);
      const guardadas = casillasGuardadas(h);
      const pendientes = marcas[clave] || new Set();
      const sendas = Object.keys(L.SENDAS)
        .map((k) => `<option value="${k}" ${k === h.senda ? "selected" : ""}>${L.SENDAS[k].corto} (${L.SENDAS[k].grupo})</option>`)
        .join("");
      let nombreCelda = '<span class="muted">—</span>';
      if (h.nombrePropuesto) {
        nombreCelda = `<b>${esc(h.nombrePropuesto)}</b><br>`;
        if (h.nombreEstado === "pendiente") {
          nombreCelda += `<button class="mini ok" type="button" data-nombre="${clave}:aprobar">Aprobar</button> <button class="mini no" type="button" data-nombre="${clave}:rechazar">Rechazar</button>`;
        } else if (h.nombreEstado === "aprobado") {
          nombreCelda += '<span class="estado jugando">Aprobado</span>';
        } else if (h.nombreEstado === "rechazado") {
          nombreCelda += '<span class="estado agotado">Rechazado: elegirá otro</span>';
        }
      }
      const casillas = L.CRITERIOS.map((c, k) => {
        const ya = guardadas[k];
        const marcada = ya || pendientes.has(k);
        return `<td class="c${ya ? " ya" : ""}"><input type="checkbox" data-m="${clave}:${k}" ${marcada ? "checked" : ""} ${ya || fin ? "disabled" : ""} aria-label="${esc(c.nombre)} de ${esc(a.nickname || clave)}" title="${ya ? "Ya puntuada en esta ficha" : esc(c.nombre)}"></td>`;
      }).join("");
      return `<tr>
        <td>
          <button class="switch" type="button" data-hab="${clave}" aria-pressed="${on}" aria-label="Acceso a Letrania de ${esc(a.nickname || clave)}"></button>
          <div class="estado ${est.id}" data-estado="${clave}">${est.txt}</div>
          ${est.id === "jugando" ? `<button class="mini" type="button" data-mas5="${clave}">+5 min</button>` : ""}
        </td>
        <td><div class="who">${h.retrato ? `<span class="face"><img src="${srcImg(h.retrato)}" alt=""></span>` : '<span class="face vacia" title="Aún no ha elegido héroe"></span>'}<div>${nombreHeroe ? `<b>${esc(nombreHeroe)}</b>` : '<b class="muted">Sin nombre aprobado</b>'}<span class="nick">${esc(a.nickname || "Clave " + clave)} · ${esc(clases[h.classId] || "")}</span></div></div></td>
        <td><select data-senda="${clave}" aria-label="Senda">${sendas}</select></td>
        <td style="min-width:150px"><button class="mini" type="button" data-ficha="${clave}:-1" aria-label="Estación anterior">−</button> <b style="font-variant-numeric:tabular-nums">${fin ? "Fin" : h.ficha}</b> <button class="mini" type="button" data-ficha="${clave}:1" aria-label="Estación siguiente">+</button><br><span class="nick">${esc(contenido)}</span></td>
        <td>${nombreCelda}</td>
        ${casillas}
        <td class="c" style="font-variant-numeric:tabular-nums">${h.xp || 0} · ${h.gemas || 0}<br><span class="nick">nivel ${L.nivel(h.xp)}</span></td>
        <td><button class="mini no" type="button" data-quitar="${clave}" title="Quitar de Letrania">✕</button></td>
      </tr>`;
    })
    .join("");
}

// Solo refresca los textos de estado (cuenta atrás), sin leer nada.
function refrescarEstados() {
  document.querySelectorAll("[data-estado]").forEach((el) => {
    const h = heroes[el.dataset.estado];
    if (!h) return;
    const est = estadoDe(h);
    if (el.textContent !== est.txt) {
      el.textContent = est.txt;
      el.className = "estado " + est.id;
    }
  });
}
setInterval(refrescarEstados, 15000);

$("#tBody").addEventListener("change", async (e) => {
  const m = e.target.closest("[data-m]");
  if (m) {
    const [clave, k] = m.dataset.m.split(":");
    if (!marcas[clave]) marcas[clave] = new Set();
    if (m.checked) marcas[clave].add(+k);
    else marcas[clave].delete(+k);
    return;
  }
  const s = e.target.closest("[data-senda]");
  if (s) {
    try {
      await updateDoc(doc(db, "letHeroes", s.dataset.senda), { senda: s.value });
      aviso("Senda cambiada. Conserva héroe, nivel y gemas.");
    } catch (err) {
      aviso("No se ha podido cambiar la senda.");
    }
  }
});

$("#tBody").addEventListener("click", async (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  try {
    if (b.dataset.hab) {
      const clave = b.dataset.hab;
      const est = estadoDe(heroes[clave]);
      if (est.id === "espera" || est.id === "jugando") {
        await updateDoc(doc(db, "letHeroes", clave), { habilitado: false });
        aviso("Acceso quitado.");
      } else {
        await updateDoc(doc(db, "letHeroes", clave), habilitacion());
        aviso("Habilitado para hoy: " + ajustes.minutos + " minutos desde que entre.");
      }
    } else if (b.dataset.mas5) {
      await updateDoc(doc(db, "letHeroes", b.dataset.mas5), { minutos: increment(5) });
      aviso("5 minutos más.");
    } else if (b.dataset.ficha) {
      const [clave, paso] = b.dataset.ficha.split(":");
      const h = heroes[clave];
      const nueva = Math.min(FICHA_FIN, Math.max(1, (h.ficha || 1) + Number(paso)));
      if (nueva === h.ficha) return;
      delete marcas[clave];
      await updateDoc(doc(db, "letHeroes", clave), { ficha: nueva, mision: { ficha: nueva, casillas: [false, false, false, false, false] } });
    } else if (b.dataset.nombre) {
      const [clave, accion] = b.dataset.nombre.split(":");
      const h = heroes[clave];
      await updateDoc(
        doc(db, "letHeroes", clave),
        accion === "aprobar" ? { nombre: h.nombrePropuesto, nombreEstado: "aprobado" } : { nombreEstado: "rechazado" }
      );
    } else if (b.dataset.quitar) {
      const clave = b.dataset.quitar;
      const nombre = (alumnos[clave] || {}).nickname || clave;
      if (!window.confirm("¿Quitar a " + nombre + " de Letrania? Se borran su héroe, sus puntos y su estación.")) return;
      await deleteDoc(doc(db, "letHeroes", clave));
    }
  } catch (err) {
    aviso("No se ha podido guardar el cambio. Comprueba la conexión.");
  }
});

function habilitacion() {
  return { habilitado: true, inicio: null, minutos: ajustes.minutos, habilitadoHasta: finDeHoy() };
}

async function habilitarVarios(activar) {
  const claves = ordenadas();
  if (!claves.length) return;
  const batch = writeBatch(db);
  claves.forEach((c) => batch.update(doc(db, "letHeroes", c), activar ? habilitacion() : { habilitado: false }));
  try {
    await batch.commit();
    aviso(activar ? claves.length + " alumnos habilitados para hoy (" + ajustes.minutos + " min cada uno)." : "Acceso quitado a " + claves.length + " alumnos.");
  } catch (err) {
    aviso("No se ha podido guardar. Comprueba la conexión.");
  }
}
$("#habTodos").addEventListener("click", () => habilitarVarios(true));
$("#quitarTodos").addEventListener("click", () => habilitarVarios(false));
$("#filtroClase").addEventListener("change", pintarTabla);

// ---------- Misiones ----------

$("#guardarMisiones").addEventListener("click", async () => {
  const batch = writeBatch(db);
  let n = 0;
  let alianza = 0;
  Object.keys(heroes).forEach((clave) => {
    const h = heroes[clave];
    let gemas = h.gemas || 0;
    const nuevas = Array.from(marcas[clave] || []);
    const guardadas = casillasGuardadas(h);
    const sumar = nuevas.filter((k) => !guardadas[k]);
    if (sumar.length && h.ficha < FICHA_FIN) {
      n++;
      let xp = 0;
      let gm = 0;
      const casillas = guardadas.slice();
      sumar.forEach((k) => {
        xp += L.CRITERIOS[k].xp;
        gm += L.CRITERIOS[k].gemas;
        casillas[k] = true;
      });
      gemas += gm;
      const completa = casillas[0];
      const cambios = { xp: increment(xp), gemas: increment(gm) };
      if (completa) {
        const sig = Math.min(FICHA_FIN, h.ficha + 1);
        cambios.ficha = sig;
        cambios.mision = { ficha: sig, casillas: [false, false, false, false, false] };
      } else {
        cambios.mision = { ficha: h.ficha, casillas: casillas };
      }
      batch.update(doc(db, "letHeroes", clave), cambios);
      batch.set(
        doc(db, "letMisiones", clave + "_" + String(h.ficha).padStart(2, "0")),
        {
          teacherId: uid,
          clave: clave,
          ficha: h.ficha,
          senda: h.senda,
          casillas: casillas,
          xp: increment(xp),
          gemas: increment(gm),
          fecha: serverTimestamp(),
        },
        { merge: true }
      );
    }
    alianza += gemas;
  });
  if (!n) {
    aviso("No has marcado ninguna casilla nueva.");
    return;
  }
  batch.set(doc(db, "letConfig", uid), { teacherId: uid, alianza: alianza }, { merge: true });
  const b = $("#guardarMisiones");
  b.disabled = true;
  try {
    await batch.commit();
    Object.keys(marcas).forEach((k) => delete marcas[k]);
    ajustes.alianza = alianza;
    aviso(n + (n === 1 ? " misión guardada." : " misiones guardadas."));
  } catch (err) {
    aviso("No se han podido guardar las misiones. Comprueba la conexión.");
  } finally {
    b.disabled = false;
  }
});

// ---------- Exportar ----------

$("#exportar").addEventListener("click", () => {
  const filas = [["Clase", "Alumno", "Héroe", "Grupo", "Senda", "Estación", "Contenido", "XP", "Nivel", "Gemas"]];
  ordenadas().forEach((clave) => {
    const h = heroes[clave];
    const s = L.SENDAS[h.senda];
    const fin = h.ficha >= FICHA_FIN;
    filas.push([
      clases[h.classId] || "",
      (alumnos[clave] || {}).nickname || clave,
      h.nombreEstado === "aprobado" ? h.nombre : "",
      s.grupo,
      s.corto,
      fin ? "Fin" : h.ficha,
      fin ? "" : L.contenidoDe(h.ficha, h.senda),
      h.xp || 0,
      L.nivel(h.xp),
      h.gemas || 0,
    ]);
  });
  // Punto y coma y BOM: así lo abre bien Excel en español.
  const csv = "﻿" + filas.map((f) => f.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(";")).join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  a.download = "letrania-" + new Date().toISOString().slice(0, 10) + ".csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

// ---------- Alta ----------

function pintarAlta() {
  const classId = $("#altaClase").value;
  const libres = Object.keys(alumnos)
    .filter((c) => alumnos[c].classId === classId && !heroes[c] && alumnos[c].active !== false)
    .sort((a, b) => (alumnos[a].nickname || a).localeCompare(alumnos[b].nickname || b, "es"));
  $("#altaLista").innerHTML = libres.length
    ? libres.map((c) => `<label><input type="checkbox" value="${c}"> ${esc(alumnos[c].nickname || c)}</label>`).join("")
    : '<p class="nota">No queda nadie de esta clase por añadir.</p>';
}
$("#altaClase").addEventListener("change", pintarAlta);

$("#altaBoton").addEventListener("click", async () => {
  const elegidos = Array.from(document.querySelectorAll("#altaLista input:checked")).map((i) => i.value);
  if (!elegidos.length) {
    aviso("Marca al menos un alumno.");
    return;
  }
  const ficha = Math.min(L.TOTAL_FICHAS, Math.max(1, parseInt($("#altaFicha").value, 10) || 1));
  const regalo = $("#altaRegalo").checked ? ficha - 1 : 0;
  const senda = $("#altaSenda").value;
  const batch = writeBatch(db);
  elegidos.forEach((clave) => {
    batch.set(doc(db, "letHeroes", clave), {
      teacherId: uid,
      classId: alumnos[clave].classId,
      habilitado: false,
      minutos: ajustes.minutos,
      habilitadoHasta: null,
      inicio: null,
      senda: senda,
      ficha: ficha,
      xp: regalo * L.CRITERIOS[0].xp,
      gemas: regalo * L.CRITERIOS[0].gemas,
      retrato: "",
      estandarte: 0,
      nombrePropuesto: "",
      nombre: "",
      nombreEstado: "sin",
      mision: { ficha: ficha, casillas: [false, false, false, false, false] },
      creadoEn: serverTimestamp(),
    });
  });
  try {
    await batch.commit();
    aviso(elegidos.length + (elegidos.length === 1 ? " alumno añadido." : " alumnos añadidos."));
  } catch (err) {
    aviso("No se ha podido añadir. ¿Están publicadas las reglas nuevas de Firestore?");
  }
});

// ---------- Ajustes ----------

function pintarAjustes() {
  $("#ajMinutos").value = ajustes.minutos;
  $("#ajFecha").value = ajustes.fechaTesoro || "";
  $("#ajUmbral").value = ajustes.umbralAlianza;
}

$("#ajGuardar").addEventListener("click", async () => {
  const minutos = Math.min(60, Math.max(1, parseInt($("#ajMinutos").value, 10) || L.MINUTOS_POR_DEFECTO));
  const umbral = Math.min(5000, Math.max(10, parseInt($("#ajUmbral").value, 10) || 600));
  const fecha = $("#ajFecha").value || "";
  try {
    await setDoc(doc(db, "letConfig", uid), { teacherId: uid, minutos: minutos, umbralAlianza: umbral, fechaTesoro: fecha }, { merge: true });
    Object.assign(ajustes, { minutos: minutos, umbralAlianza: umbral, fechaTesoro: fecha });
    pintarAjustes();
    aviso("Ajustes guardados.");
  } catch (err) {
    aviso("No se han podido guardar los ajustes.");
  }
});

// ---------- Arranque ----------

async function iniciar() {
  if (auth.authStateReady) await auth.authStateReady();
  const u = auth.currentUser;
  let guardado = null;
  try {
    guardado = JSON.parse(localStorage.getItem("ar_docente") || "null");
  } catch (e) {
    guardado = null;
  }
  if (!u || u.isAnonymous || !guardado || guardado.uid !== u.uid) {
    $("#cargando").innerHTML = '<p style="margin:0">Tu sesión de docente ha caducado. <a href="../docente/login.html">Vuelve a entrar</a>.</p>';
    return;
  }
  uid = u.uid;
  try {
    const [cs, as, cf] = await Promise.all([
      getDocs(query(collection(db, "classes"), where("teacherId", "==", uid))),
      getDocs(query(collection(db, "students"), where("teacherId", "==", uid))),
      getDoc(doc(db, "letConfig", uid)),
    ]);
    cs.forEach((d) => (clases[d.id] = d.data().name || "Clase"));
    as.forEach((d) => {
      const x = d.data();
      alumnos[d.id] = { nickname: x.nickname || d.id, classId: x.classId, active: x.active };
    });
    if (cf.exists()) Object.assign(ajustes, cf.data());
  } catch (err) {
    $("#cargando").innerHTML = '<p style="margin:0">No se ha podido cargar el panel. Comprueba la conexión y recarga.</p>';
    return;
  }

  const opciones = Object.keys(clases)
    .sort((a, b) => clases[a].localeCompare(clases[b], "es"))
    .map((id) => `<option value="${id}">${esc(clases[id])}</option>`)
    .join("");
  $("#filtroClase").insertAdjacentHTML("beforeend", opciones);
  $("#altaClase").innerHTML = opciones;
  $("#altaSenda").innerHTML = Object.keys(L.SENDAS)
    .map((k) => `<option value="${k}">${L.SENDAS[k].nombre} (${L.SENDAS[k].grupo})</option>`)
    .join("");
  pintarAjustes();
  pintarAlta();

  cancelar = onSnapshot(
    query(collection(db, "letHeroes"), where("teacherId", "==", uid)),
    (snap) => {
      heroes = {};
      snap.forEach((d) => (heroes[d.id] = d.data()));
      $("#cargando").hidden = true;
      $("#panel").hidden = false;
      pintarTabla();
      pintarAlta();
    },
    () => {
      $("#cargando").hidden = false;
      $("#cargando").innerHTML = '<p style="margin:0">No se pueden leer los héroes. ¿Están publicadas las reglas nuevas de Firestore (firestore.rules)?</p>';
    }
  );
}
window.addEventListener("pagehide", () => {
  if (cancelar) cancelar();
  cancelar = null;
});

iniciar();
