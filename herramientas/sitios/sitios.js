// ============================================================
// Sitios de clase: generador y gestor de la distribución del aula.
//
//  - Varias clases, cada una con su alumnado, sus condiciones, sus
//    agrupaciones de mesas y su historial de distribuciones. Todo se
//    guarda solo en este equipo, como el resto de herramientas (sin
//    Firestore: no gasta cuota y los datos del alumnado no salen del
//    equipo); para llevarlo a otro está «Descargar copia».
//
//  - Agrupación (disposición): el plano del aula en una cuadrícula de
//    cols × rows celdas. Cada mesa es un rectángulo de w × h sitios
//    (n de ellos utilizables, para grupos de 5 en una mesa de 3 × 2).
//    La pizarra está siempre arriba (fila 0).
//
//  - Vecinos: dos sitios de la misma mesa (peso 1), o de mesas
//    distintas pegadas en la misma fila (a 2 celdas como mucho) o en
//    la misma columna (una fila de diferencia), con peso 0,5. Separar,
//    juntar y «no repetir compañeros» se miden con esta relación.
//
//  - Generar es buscar la colocación de menor «coste» con recocido
//    simulado (se prueban intercambios de dos sitios y se aceptan los
//    que bajan el coste, y al principio también algunos que lo suben
//    para no quedarse atascado). Varias rondas desde colocaciones al
//    azar distintas; se queda la mejor. Coste:
//      · 1000 por condición «siempre» incumplida (separar, juntar) y
//        por ubicación (delante, cerca del docente); 40 por «mejor».
//      · Compañeros de distribuciones guardadas: 30 × peso de vecino ×
//        (0,6 ^ antigüedad), sumado en las últimas «memoria».
//      · Tutorización (niveles 1-4): 80 por alumno de nivel 3-4 sin
//        nadie de nivel 1-2 al lado; dos de nivel 4 o dos de nivel 1 en
//        la misma mesa; en mesas de dos, 1-3 y 2-4 mejor que 2-3 o 1-4;
//        y la desviación de cada mesa respecto a la proporción de la
//        clase. Chico/chica igual, para grupos mixtos.
//      · Repetir zona extrema (fondo o primera fila) o el mismo sitio,
//        y dejar varios sitios libres en la misma mesa.
//    Los sitios fijos (📌) no se tocan.
//
//  - Una distribución nueva es un borrador: se retoca tocando dos
//    sitios para intercambiarlos y solo cuenta para el historial al
//    pulsar «Guardar». Cada entrada guarda también una copia del plano
//    de mesas, para poder repetirla aunque la agrupación se cambie o
//    se borre después.
// ============================================================
(function () {
  "use strict";

  const H = window.Herramienta;
  const CLAVE = "ar_herramienta_sitios";
  const CLAVE_SELECTOR = "ar_herramienta_selector";
  const CLAVE_ROLES = "ar_herramienta_roles";
  const MAX_HISTORIAL = 60;
  const MAX_LADO = 30;
  const MIN_LADO = 3;

  const $ = (id) => document.getElementById(id);

  // ---------------- Fechas ----------------
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const dos = (n) => (n < 10 ? "0" : "") + n;
  function hoy() {
    const d = new Date();
    return d.getFullYear() + "-" + dos(d.getMonth() + 1) + "-" + dos(d.getDate());
  }
  function textoFecha(k) {
    const [y, m, d] = String(k).split("-").map(Number);
    if (!y || !m || !d) return "";
    return d + " de " + MESES[m - 1] + " de " + y;
  }

  // ---------------- Plantillas de mesas ----------------
  //  w × h: tamaño de la mesa en sitios; n: sitios utilizables;
  //  porFila: mesas por fila; hueco: celdas libres entre mesas.
  const PLANTILLAS = {
    individual: { nombre: "Filas individuales", w: 1, h: 1, n: 1, porFila: 6, hueco: 1 },
    parejas: { nombre: "Parejas", w: 2, h: 1, n: 2, porFila: 3, hueco: 2 },
    trios: { nombre: "Tríos", w: 3, h: 1, n: 3, porFila: 2, hueco: 2 },
    grupos4: { nombre: "Grupos de 4", w: 2, h: 2, n: 4, porFila: 3, hueco: 2 },
    grupos5: { nombre: "Grupos de 5", w: 3, h: 2, n: 5, porFila: 3, hueco: 2 },
    grupos6: { nombre: "Grupos de 6", w: 3, h: 2, n: 6, porFila: 3, hueco: 2 },
  };

  const limitar = (v, a, b) => Math.max(a, Math.min(b, v));

  function plantilla(tipo, cuantos) {
    const n = cuantos > 0 ? cuantos : 24;
    const bloques = [];
    let cols = 12;
    let rows = 8;
    if (tipo === "u") {
      // Herradura abierta hacia la pizarra: dos laterales y el fondo.
      const lado = Math.max(1, Math.floor(n / 4));
      const fondo = Math.max(1, n - 2 * lado);
      cols = fondo + 4;
      rows = lado + 3;
      for (let i = 0; i < lado; i++) {
        bloques.push({ x: 1, y: 1 + i, w: 1, h: 1, n: 1 });
        bloques.push({ x: fondo + 2, y: 1 + i, w: 1, h: 1, n: 1 });
      }
      for (let i = 0; i < fondo; i++) bloques.push({ x: 2 + i, y: lado + 1, w: 1, h: 1, n: 1 });
    } else if (PLANTILLAS[tipo]) {
      const p = PLANTILLAS[tipo];
      const total = Math.ceil(n / p.n);
      const porFila = Math.min(total, p.porFila);
      const filas = Math.ceil(total / porFila);
      cols = 2 + porFila * p.w + (porFila - 1) * p.hueco;
      rows = 2 + filas * p.h + (filas - 1);
      for (let k = 0; k < total; k++) {
        const f = Math.floor(k / porFila);
        const c = k % porFila;
        // La última fila, si no está completa, va centrada.
        const enFila = Math.min(porFila, total - f * porFila);
        const centrar = Math.floor(((porFila - enFila) * (p.w + p.hueco)) / 2);
        bloques.push({ x: 1 + centrar + c * (p.w + p.hueco), y: 1 + f * (p.h + 1), w: p.w, h: p.h, n: p.n });
      }
    }
    return { cols: limitar(cols, MIN_LADO, MAX_LADO), rows: limitar(rows, MIN_LADO, MAX_LADO), bloques: bloques };
  }

  function nombrePlantilla(tipo) {
    if (PLANTILLAS[tipo]) return PLANTILLAS[tipo].nombre;
    return tipo === "u" ? "En U" : "Aula vacía";
  }

  function disposicionNueva(g, tipo) {
    const p = plantilla(tipo, g.alumnos.length);
    const d = { id: "d" + g.sig++, nombre: nombrePlantilla(tipo), cols: p.cols, rows: p.rows, bloques: [], fijos: {}, sig: 1, docente: "derecha" };
    p.bloques.forEach((b) => d.bloques.push(Object.assign({ id: "b" + d.sig++ }, b)));
    return d;
  }

  // ---------------- Datos ----------------
  function opcionesPorDefecto() {
    return { niveles: true, rescate: true, cuatroDelante: true, generos: false, zona: true, sitio: true, memoria: 4 };
  }

  function grupoNuevo(id, nombre, alumnos) {
    const g = { id: id, nombre: nombre, alumnos: alumnos || [], datos: {}, reglas: [], opciones: opcionesPorDefecto(), disposiciones: [], dispActual: null, historial: [], borrador: null, sig: 1 };
    const d = disposicionNueva(g, "grupos4");
    g.disposiciones.push(d);
    g.dispActual = d.id;
    return g;
  }

  function leerListas() {
    const listas = [];
    try {
      const s = JSON.parse(localStorage.getItem(CLAVE_SELECTOR) || "null");
      if (s && Array.isArray(s.listas)) s.listas.forEach((l) => l && Array.isArray(l.alumnos) && l.alumnos.length && listas.push({ origen: "Alumno al azar", nombre: l.nombre, alumnos: l.alumnos }));
    } catch (e) {
      // Sin listas del selector.
    }
    try {
      const r = JSON.parse(localStorage.getItem(CLAVE_ROLES) || "null");
      if (r && Array.isArray(r.grupos)) r.grupos.forEach((g) => g && Array.isArray(g.alumnos) && g.alumnos.length && listas.push({ origen: "Roles de clase", nombre: g.nombre, alumnos: g.alumnos }));
    } catch (e) {
      // Sin clases de Roles.
    }
    return listas;
  }

  const cfg = H.cargar(CLAVE, { grupos: null, actual: "g1", siguiente: 2, girado: false });
  if (!Array.isArray(cfg.grupos) || !cfg.grupos.length) {
    // La primera vez se parte de una lista que ya exista en otra
    // herramienta, para no escribir la clase otra vez.
    const primera = leerListas()[0];
    cfg.grupos = [grupoNuevo("g1", primera ? primera.nombre : "Mi clase", primera ? primera.alumnos.slice() : [])];
    cfg.actual = "g1";
    cfg.siguiente = 2;
  }
  cfg.grupos.forEach((g) => {
    if (!Array.isArray(g.alumnos)) g.alumnos = [];
    if (!g.datos || typeof g.datos !== "object") g.datos = {};
    if (!Array.isArray(g.reglas)) g.reglas = [];
    // Versión anterior: niveles alto/medio/bajo, casilla «delante» y
    // reglas de dos alumnos {tipo, a, b}.
    const antiguos = { alto: "1", medio: "2", bajo: "4" };
    Object.keys(g.datos).forEach((a) => {
      const x = g.datos[a];
      if (antiguos[x.nivel]) x.nivel = antiguos[x.nivel];
      if (x.delante) {
        x.ubicacion = "delante";
        delete x.delante;
      }
    });
    g.reglas = g.reglas
      .map((r) => (Array.isArray(r.alumnos) ? r : { tipo: r.tipo, fuerza: "siempre", alumnos: [r.a, r.b], motivo: "" }))
      .filter((r) => r.alumnos.length > 1);
    g.reglas.forEach((r) => {
      if (!r.id) r.id = "r" + g.sig++;
      if (r.fuerza !== "mejor") r.fuerza = "siempre";
    });
    g.opciones = Object.assign(opcionesPorDefecto(), g.opciones || {});
    if (!Array.isArray(g.historial)) g.historial = [];
    if (!g.sig) g.sig = 1;
    if (!Array.isArray(g.disposiciones) || !g.disposiciones.length) g.disposiciones = [disposicionNueva(g, "grupos4")];
    g.disposiciones.forEach((d) => {
      if (!Array.isArray(d.bloques)) d.bloques = [];
      if (!d.fijos || typeof d.fijos !== "object") d.fijos = {};
      if (!d.sig) d.sig = d.bloques.length + 1;
      if (!d.docente) d.docente = "derecha";
    });
    if (!g.disposiciones.some((d) => d.id === g.dispActual)) g.dispActual = g.disposiciones[0].id;
    if (g.borrador === undefined) g.borrador = null;
  });

  function guardar() {
    H.guardar(CLAVE, cfg);
  }
  guardar();

  function grupo() {
    return cfg.grupos.find((g) => g.id === cfg.actual) || cfg.grupos[0];
  }

  function disp(g) {
    return g.disposiciones.find((d) => d.id === g.dispActual) || g.disposiciones[0];
  }

  function datoDe(g, nombre) {
    return g.datos[nombre] || {};
  }

  // ---------------- Geometría ----------------
  function plazasDe(b) {
    return limitar(Number(b.n) || b.w * b.h, 1, b.w * b.h);
  }

  // Lista de sitios con su posición absoluta, zona (0 delante, 1 en
  // medio, 2 al fondo), si cuenta como «delante» (el primer tercio de
  // filas ocupadas, como mínimo una) y si está «cerca del docente» (el
  // tercio de sitios más cercano a su mesa, delante a un lado o en el
  // centro, junto a la pizarra).
  function asientos(d) {
    const lista = [];
    d.bloques.forEach((b, bi) => {
      const n = plazasDe(b);
      for (let i = 0; i < n; i++) {
        const c = i % b.w;
        const r = Math.floor(i / b.w);
        lista.push({ id: b.id + "." + i, bloque: bi, ax: b.x + c, ay: b.y + r });
      }
    });
    if (lista.length) {
      const ys = lista.map((s) => s.ay);
      const min = Math.min.apply(null, ys);
      const rango = Math.max.apply(null, ys) - min + 1;
      const filasDelante = Math.max(1, Math.round(rango / 3));
      lista.forEach((s) => {
        const f = rango > 1 ? (s.ay - min) / (rango - 1) : 0;
        s.delante = s.ay - min < filasDelante;
        s.zona = f < 1 / 3 ? 0 : f > 2 / 3 ? 2 : 1;
      });
      const mx = { izquierda: 0.5, centro: d.cols / 2, derecha: d.cols - 0.5 }[d.docente] || d.cols - 0.5;
      const dist = (s) => Math.hypot(s.ax + 0.5 - mx, s.ay + 0.5);
      const orden = lista.slice().sort((a, b) => dist(a) - dist(b));
      const limite = dist(orden[Math.max(0, Math.ceil(lista.length / 3) - 1)]);
      lista.forEach((s) => (s.cercaDocente = dist(s) <= limite + 1e-9));
    }
    return lista;
  }

  function vecinos(sitios) {
    const pares = [];
    for (let i = 0; i < sitios.length; i++) {
      for (let j = i + 1; j < sitios.length; j++) {
        const a = sitios[i];
        const b = sitios[j];
        let w = 0;
        if (a.bloque === b.bloque) w = 1;
        else if ((a.ay === b.ay && Math.abs(a.ax - b.ax) <= 2) || (a.ax === b.ax && Math.abs(a.ay - b.ay) === 1)) w = 0.5;
        if (w) pares.push([i, j, w]);
      }
    }
    return pares;
  }

  // Asignación válida para esta agrupación: sitios que existen,
  // alumnos de la lista y cada alumno una sola vez.
  function limpiar(g, d, asig) {
    const ids = new Set(asientos(d).map((s) => s.id));
    const vistos = new Set();
    const out = {};
    Object.keys(asig || {}).forEach((id) => {
      const a = asig[id];
      if (!ids.has(id) || g.alumnos.indexOf(a) === -1 || vistos.has(a)) return;
      vistos.add(a);
      out[id] = a;
    });
    return out;
  }

  // ---------------- Historial ----------------
  function paresDe(d, asig) {
    const sitios = asientos(d);
    return vecinos(sitios)
      .map(([i, j, w]) => [asig[sitios[i].id], asig[sitios[j].id], w])
      .filter((p) => p[0] && p[1]);
  }

  function zonasDe(d, asig) {
    const z = {};
    asientos(d).forEach((s) => {
      if (asig[s.id]) z[asig[s.id]] = s.zona;
    });
    return z;
  }

  function copiaPlano(d) {
    return { nombre: d.nombre, cols: d.cols, rows: d.rows, docente: d.docente, bloques: d.bloques.map((b) => Object.assign({}, b)) };
  }

  function ultimaDe(g, dispId) {
    for (let i = g.historial.length - 1; i >= 0; i--) if (g.historial[i].dispId === dispId) return g.historial[i];
    return null;
  }

  // ---------------- Generar ----------------
  const PESO_DURO = 1000;
  const PESO_HISTORIAL = 30;
  const PESO_PREFERENCIA = 40;
  const PESO_TUTOR = 80;
  const PESO_APOYO = 35;
  const PESO_OCIOSO = 40;
  const PESO_NIVEL = 8;
  const PESO_GENERO = 10;
  const PESO_ZONA = 10;
  const PESO_SITIO = 15;
  const PESO_HUECOS = 20;
  // Niveles: 1 sobresaliente-notable, 2 bien, 3 suficiente, 4 con
  // dificultades. Los de 1-2 pueden tutorizar a los de 3-4.
  const NIVELES = ["1", "2", "3", "4"];
  const NOMBRE_NIVEL = { 1: "Sobresaliente-notable", 2: "Bien", 3: "Suficiente", 4: "Con dificultades" };
  // Mesa de dos: lo ideal es 1 con 3 y 2 con 4 (distancia moderada, en
  // la que el tutor explica y el otro sigue la explicación); 2 con 3 y
  // 1 con 4 valen; dos del mismo lado desaprovechan la tutoría (los de
  // 3-4 juntos ya cuentan como «sin tutor»). Índice: nivel menor * 4 +
  // nivel mayor, con niveles de 0 a 3.
  const CASTIGO_PAREJA = new Float64Array(16);
  [[0, 0, 40], [0, 1, 30], [1, 1, 30], [1, 2, 10], [0, 3, 20]].forEach(([a, b, c]) => (CASTIGO_PAREJA[a * 4 + b] = c));

  // Cada pareja de alumnos de una condición (con tres o más, todas).
  function paresDeRegla(r) {
    const out = [];
    for (let i = 0; i < r.alumnos.length; i++) for (let j = i + 1; j < r.alumnos.length; j++) out.push([r.alumnos[i], r.alumnos[j]]);
    return out;
  }

  function ubicacionDe(g, a) {
    const u = datoDe(g, a).ubicacion;
    return { delante: u === "delante" || u === "ambos", docente: u === "docente" || u === "ambos" };
  }
  const GENEROS = ["chico", "chica"];

  function generar(g, d) {
    const sitios = asientos(d);
    const nS = sitios.length;
    const alumnos = g.alumnos.slice();
    const N = alumnos.length;
    if (!N) return { error: "Añade el alumnado en «👥 Alumnado»." };
    if (!nS) return { error: "Esta agrupación no tiene mesas. Añádelas en «🪑 Mesas»." };
    const indice = new Map(alumnos.map((a, i) => [a, i]));
    const idxSitio = new Map(sitios.map((s, i) => [s.id, i]));

    // Sitios fijos.
    const base = new Int16Array(nS).fill(-1);
    const fijo = new Uint8Array(nS);
    Object.keys(d.fijos).forEach((id) => {
      const i = idxSitio.get(id);
      const a = indice.get(d.fijos[id]);
      if (i === undefined || a === undefined || base.indexOf(a) !== -1) return;
      base[i] = a;
      fijo[i] = 1;
    });
    const libres = [];
    alumnos.forEach((a, i) => base.indexOf(i) === -1 && libres.push(i));
    const huecos = [];
    for (let i = 0; i < nS; i++) if (!fijo[i]) huecos.push(i);
    if (libres.length > huecos.length) {
      return { error: "Faltan " + (libres.length - huecos.length) + " sitios para todo el alumnado. Añade mesas en «🪑 Mesas»." };
    }

    // Vecinos en matriz para consultarlos rápido.
    const pares = vecinos(sitios);
    const esVecino = new Uint8Array(nS * nS);
    pares.forEach(([i, j]) => {
      esVecino[i * nS + j] = 1;
      esVecino[j * nS + i] = 1;
    });

    // Condiciones: castigo si quedan juntos (separar) o separados
    // (juntar). Las parejas que se juntan a propósito no cuentan como
    // «compañeros repetidos».
    const castigoJuntos = new Float64Array(N * N);
    const juntar = [];
    const aPropósito = new Uint8Array(N * N);
    g.reglas.forEach((r) => {
      const peso = r.fuerza === "mejor" ? PESO_PREFERENCIA : PESO_DURO;
      paresDeRegla(r).forEach(([x, y]) => {
        const a = indice.get(x);
        const b = indice.get(y);
        if (a === undefined || b === undefined) return;
        if (r.tipo === "separar") {
          castigoJuntos[a * N + b] += peso;
          castigoJuntos[b * N + a] += peso;
        } else {
          juntar.push([a, b, peso]);
          aPropósito[a * N + b] = aPropósito[b * N + a] = 1;
        }
      });
    });

    const ubic = alumnos.map((a) => ubicacionDe(g, a));
    const nivel = alumnos.map((a) => NIVELES.indexOf(String(datoDe(g, a).nivel || "")));
    const genero = alumnos.map((a) => GENEROS.indexOf(datoDe(g, a).genero));
    const proporcion = (valores, k) => {
      const con = valores.filter((v) => v >= 0);
      return Array.from({ length: k }, (_, l) => (con.length ? con.filter((v) => v === l).length / con.length : 0));
    };
    const usarNivel = g.opciones.niveles && nivel.some((v) => v >= 0);
    const rescate = !!g.opciones.rescate;
    // Alumnado de nivel 4 siempre junto a la pizarra (aunque no se use
    // la tutorización por niveles).
    const cuatroDelante = !!g.opciones.cuatroDelante;
    const usarGenero = g.opciones.generos && genero.some((v) => v >= 0);
    const propNivel = proporcion(nivel, NIVELES.length);
    const propGenero = proporcion(genero, GENEROS.length);

    // Memoria: compañeros de las distribuciones guardadas, con algo de
    // azar para que dos generaciones seguidas no salgan iguales.
    const memoria = Number(g.opciones.memoria) || 0;
    const historia = new Float64Array(N * N);
    g.historial
      .slice(-memoria || g.historial.length)
      .reverse()
      .forEach((e, k) => {
        if (!memoria) return;
        const f = Math.pow(0.6, k);
        (e.pares || []).forEach(([a, b, w]) => {
          const ia = indice.get(a);
          const ib = indice.get(b);
          if (ia === undefined || ib === undefined) return;
          historia[ia * N + ib] += f * w;
          historia[ib * N + ia] += f * w;
        });
      });
    for (let k = 0; k < N * N; k++) if (historia[k]) historia[k] *= aPropósito[k] ? 0 : PESO_HISTORIAL * (0.85 + Math.random() * 0.3);

    const ultima = g.historial[g.historial.length - 1] || null;
    const zonaPrevia = alumnos.map((a) => (g.opciones.zona && ultima && ultima.zonas && ultima.zonas[a] !== undefined ? ultima.zonas[a] : -1));
    const ultimaAqui = g.opciones.sitio ? ultimaDe(g, d.id) : null;
    const sitioPrevio = alumnos.map(() => -1);
    if (ultimaAqui) {
      Object.keys(ultimaAqui.asignacion || {}).forEach((id) => {
        const a = indice.get(ultimaAqui.asignacion[id]);
        const i = idxSitio.get(id);
        if (a !== undefined && i !== undefined) sitioPrevio[a] = i;
      });
    }

    const nB = d.bloques.length;
    const bloqueDe = sitios.map((s) => s.bloque);
    const pos = new Int16Array(N);
    const cuentaN = new Float64Array(nB * NIVELES.length);
    const cuentaG = new Float64Array(nB * GENEROS.length);
    const ocupN = new Float64Array(nB);
    const ocupG = new Float64Array(nB);
    const conTutor = new Uint8Array(N);
    const ayudaA = new Uint8Array(N);
    const ocupados = new Float64Array(nB);
    const tamano = d.bloques.map(plazasDe);
    const huecosLibres = nS > N;

    function desviacion(cuenta, ocup, prop, k) {
      let c = 0;
      for (let b = 0; b < nB; b++) {
        const m = ocup[b];
        if (m < 2) continue;
        for (let l = 0; l < k; l++) {
          const dif = cuenta[b * k + l] - m * prop[l];
          c += dif * dif;
        }
      }
      return c;
    }

    function coste(arr) {
      let c = 0;
      pos.fill(-1);
      for (let i = 0; i < nS; i++) if (arr[i] >= 0) pos[arr[i]] = i;
      for (let p = 0; p < pares.length; p++) {
        const a = arr[pares[p][0]];
        const b = arr[pares[p][1]];
        if (a < 0 || b < 0) continue;
        c += castigoJuntos[a * N + b] + historia[a * N + b] * pares[p][2];
      }
      for (let k = 0; k < juntar.length; k++) {
        const pa = pos[juntar[k][0]];
        const pb = pos[juntar[k][1]];
        if (pa >= 0 && pb >= 0 && !esVecino[pa * nS + pb]) c += juntar[k][2];
      }
      for (let a = 0; a < N; a++) {
        const s = pos[a];
        if (s < 0) continue;
        const u = ubic[a];
        const vaDelante = u.delante || (cuatroDelante && nivel[a] === 3);
        if (vaDelante && !sitios[s].delante) c += PESO_DURO;
        if (u.docente && !sitios[s].cercaDocente) c += PESO_DURO;
        if (!vaDelante && !u.docente && zonaPrevia[a] !== 1 && zonaPrevia[a] === sitios[s].zona) c += PESO_ZONA;
        if (sitioPrevio[a] === s) c += PESO_SITIO;
      }
      // Sitios libres repartidos: mejor una mesa de 4 con 3 que una con
      // 2 y otra llena (el castigo crece con el cuadrado de los huecos).
      if (huecosLibres) {
        ocupados.fill(0);
        for (let i = 0; i < nS; i++) if (arr[i] >= 0) ocupados[bloqueDe[i]]++;
        for (let b = 0; b < nB; b++) {
          const vacios = tamano[b] - ocupados[b];
          if (vacios > 0 && ocupados[b] > 0) c += PESO_HUECOS * vacios * vacios;
        }
      }
      if (usarNivel) {
        // Tutorización: cada alumno de nivel 3-4 con alguien de 1-2 en
        // su mesa o al lado.
        conTutor.fill(0);
        ayudaA.fill(0);
        for (let p = 0; p < pares.length; p++) {
          const a = arr[pares[p][0]];
          const b = arr[pares[p][1]];
          if (a < 0 || b < 0 || nivel[a] < 0 || nivel[b] < 0) continue;
          // 2: tutor de nivel 1-2; 1: al menos alguien de nivel superior
          // (un 3 con un 4), para cuando no hay tutores para todos.
          if (nivel[a] >= 2) conTutor[a] = Math.max(conTutor[a], nivel[b] <= 1 ? 2 : nivel[b] < nivel[a] ? 1 : 0);
          if (nivel[b] >= 2) conTutor[b] = Math.max(conTutor[b], nivel[a] <= 1 ? 2 : nivel[a] < nivel[b] ? 1 : 0);
          if (nivel[a] < nivel[b] && nivel[b] >= 2) ayudaA[a] = 1;
          if (nivel[b] < nivel[a] && nivel[a] >= 2) ayudaA[b] = 1;
        }
        for (let a = 0; a < N; a++) {
          // Un alumno de nivel 1-2 sin nadie de 3-4 al lado es un tutor
          // desaprovechado.
          if (pos[a] >= 0 && nivel[a] >= 0 && nivel[a] <= 1 && !ayudaA[a]) c += PESO_OCIOSO;
          if (pos[a] < 0 || nivel[a] < 2 || conTutor[a] === 2) continue;
          // Con apoyo de un nivel superior (un 4 junto a un 3), o haciendo
          // él de apoyo (ese 3): vale si no hay tutores para todos.
          if (conTutor[a] === 1 || ayudaA[a]) c += PESO_APOYO;
          else {
            // Solo con alumnos de su mismo nivel (o sin nadie con nivel
            // al lado): siempre en las primeras filas.
            c += PESO_TUTOR;
            if (rescate && !sitios[pos[a]].delante) c += PESO_DURO;
          }
        }
      }
      if (usarNivel || usarGenero) {
        cuentaN.fill(0);
        cuentaG.fill(0);
        ocupN.fill(0);
        ocupG.fill(0);
        for (let i = 0; i < nS; i++) {
          const a = arr[i];
          if (a < 0) continue;
          const b = bloqueDe[i];
          if (nivel[a] >= 0) {
            cuentaN[b * NIVELES.length + nivel[a]]++;
            ocupN[b]++;
          }
          if (genero[a] >= 0) {
            cuentaG[b * GENEROS.length + genero[a]]++;
            ocupG[b]++;
          }
        }
        if (usarNivel) {
          c += PESO_NIVEL * desviacion(cuentaN, ocupN, propNivel, NIVELES.length);
          for (let b = 0; b < nB; b++) {
            const k = b * 4;
            // Dos de nivel 4 en la misma mesa se reparten la ayuda; dos
            // de nivel 1 desaprovechan a quien puede tutorizar.
            if (cuentaN[k + 3] > 1) c += 50 * (cuentaN[k + 3] - 1);
            if (cuentaN[k] > 1) c += 25 * (cuentaN[k] - 1);
            if (ocupN[b] === 2 && tamano[b] <= 3) {
              const ls = [];
              for (let l = 0; l < 4; l++) for (let r = 0; r < cuentaN[k + l]; r++) ls.push(l);
              c += CASTIGO_PAREJA[ls[0] * 4 + ls[1]];
            }
          }
        }
        if (usarGenero) c += PESO_GENERO * desviacion(cuentaG, ocupG, propGenero, GENEROS.length);
      }
      return c;
    }

    // Recocido simulado. El azar de la búsqueda usa Math.random: solo
    // decide qué intercambios probar, no quién sale elegido.
    let mejor = null;
    let mejorCoste = Infinity;
    const H2 = huecos.length;
    const vueltas = 4000 + 200 * H2;
    for (let ronda = 0; ronda < 6; ronda++) {
      const arr = Int16Array.from(base);
      const orden = huecos.slice();
      for (let i = orden.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [orden[i], orden[j]] = [orden[j], orden[i]];
      }
      libres.forEach((a, k) => (arr[orden[k]] = a));
      let c = coste(arr);
      if (c < mejorCoste) {
        mejorCoste = c;
        mejor = Int16Array.from(arr);
      }
      if (H2 < 2) continue;
      for (let it = 0; it < vueltas; it++) {
        const T = 60 * Math.pow(0.002, it / vueltas);
        const i = huecos[Math.floor(Math.random() * H2)];
        const j = huecos[Math.floor(Math.random() * H2)];
        if (i === j || (arr[i] < 0 && arr[j] < 0)) continue;
        let t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
        const c2 = coste(arr);
        if (c2 <= c || Math.random() < Math.exp((c - c2) / T)) {
          c = c2;
          if (c < mejorCoste) {
            mejorCoste = c;
            mejor = Int16Array.from(arr);
          }
        } else {
          t = arr[i];
          arr[i] = arr[j];
          arr[j] = t;
        }
      }
    }

    const asig = {};
    for (let i = 0; i < nS; i++) if (mejor[i] >= 0) asig[sitios[i].id] = alumnos[mejor[i]];
    return { asig: asig };
  }

  // ---------------- Comprobar una distribución ----------------
  function informe(g, d, asig, referencia) {
    const sitios = asientos(d);
    const posDe = {};
    sitios.forEach((s, i) => {
      if (asig[s.id]) posDe[asig[s.id]] = i;
    });
    const pares = vecinos(sitios);
    const vec = new Set(pares.map(([i, j]) => i + "|" + j));
    const sonVecinos = (a, b) => {
      const i = posDe[a];
      const j = posDe[b];
      if (i === undefined || j === undefined) return null;
      return vec.has(Math.min(i, j) + "|" + Math.max(i, j));
    };
    // «Siempre» incumplidas (fallos) y «mejor» incumplidas (avisos).
    const fallos = [];
    const avisos = [];
    g.reglas.forEach((r) => {
      paresDeRegla(r).forEach(([a, b]) => {
        const v = sonVecinos(a, b);
        if (v === null) return;
        const lista = r.fuerza === "mejor" ? avisos : fallos;
        if (r.tipo === "separar" && v) lista.push(a + " y " + b + " están juntos");
        if (r.tipo === "juntar" && !v) lista.push(a + " y " + b + " no están juntos");
      });
    });
    g.alumnos.forEach((a) => {
      const u = ubicacionDe(g, a);
      if (posDe[a] === undefined) return;
      if (u.delante && !sitios[posDe[a]].delante) fallos.push(a + " no está delante");
      else if (g.opciones.cuatroDelante && String(datoDe(g, a).nivel) === "4" && !sitios[posDe[a]].delante) fallos.push(a + " (nivel 4) no está en las primeras filas");
      if (u.docente && !sitios[posDe[a]].cercaDocente) fallos.push(a + " no está cerca del docente");
    });

    // Tutorización: alumnado de nivel 3-4 con alguien de nivel 1-2 en
    // su mesa o al lado.
    const nivelDe = (a) => Number(datoDe(g, a).nivel) || 0;
    const necesitan = g.alumnos.filter((a) => nivelDe(a) >= 3 && posDe[a] !== undefined);
    const sinTutor = necesitan.filter(
      (a) => !g.alumnos.some((b) => nivelDe(b) >= 1 && nivelDe(b) <= 2 && sonVecinos(a, b))
    );
    // De los que no tienen tutor de 1-2: con apoyo de un nivel superior
    // (3 con 4) o sin nadie por encima (y si están o no delante).
    const conApoyo = sinTutor.filter((a) => g.alumnos.some((b) => nivelDe(b) >= 1 && nivelDe(b) < nivelDe(a) && sonVecinos(a, b)));
    const apoyan = sinTutor.filter((a) => conApoyo.indexOf(a) === -1 && g.alumnos.some((b) => nivelDe(b) > nivelDe(a) && sonVecinos(a, b)));
    const sinSuperior = sinTutor.filter((a) => conApoyo.indexOf(a) === -1 && apoyan.indexOf(a) === -1);
    const sinSuperiorDetras = sinSuperior.filter((a) => !sitios[posDe[a]].delante);
    let mesasDosCuatro = 0;
    d.bloques.forEach((b, bi) => {
      const cuatros = sitios.filter((x) => x.bloque === bi && asig[x.id] && nivelDe(asig[x.id]) === 4).length;
      if (cuatros > 1) mesasDosCuatro++;
    });

    // Compañeros de mesa que ya lo fueron en la distribución de referencia.
    // Las parejas con condición «juntar» repiten a propósito: no cuentan.
    const repetidos = [];
    const juntos = new Set();
    g.reglas.forEach((r) => r.tipo === "juntar" && paresDeRegla(r).forEach((p) => juntos.add(p.slice().sort().join("|"))));
    if (referencia) {
      const antes = new Set((referencia.pares || []).filter((p) => p[2] >= 1).map((p) => [p[0], p[1]].sort().join("|")));
      pares.forEach(([i, j, w]) => {
        const a = asig[sitios[i].id];
        const b = asig[sitios[j].id];
        const k = a && b ? [a, b].sort().join("|") : "";
        if (w >= 1 && k && antes.has(k) && !juntos.has(k)) repetidos.push(a + " y " + b);
      });
    }

    // Mezcla dentro de cada mesa de 3 o más.
    function mezcla(campo) {
      let mesas = 0;
      let mezcladas = 0;
      d.bloques.forEach((b, bi) => {
        const valores = sitios
          .filter((s) => s.bloque === bi && asig[s.id])
          .map((s) => datoDe(g, asig[s.id])[campo])
          .filter(Boolean);
        if (valores.length < 2 || plazasDe(b) < 3) return;
        mesas++;
        if (new Set(valores).size > 1) mezcladas++;
      });
      return { mesas, mezcladas };
    }

    const sentados = new Set(Object.values(asig));
    return {
      fallos: fallos,
      avisos: avisos,
      necesitan: necesitan.length,
      sinTutor: sinTutor,
      conApoyo: conApoyo,
      apoyan: apoyan,
      sinSuperior: sinSuperior,
      sinSuperiorDetras: sinSuperiorDetras,
      mesasDosCuatro: mesasDosCuatro,
      repetidos: repetidos,
      sinSitio: g.alumnos.filter((a) => !sentados.has(a)),
      libres: sitios.length - sentados.size,
      niveles: mezcla("nivel"),
      generos: mezcla("genero"),
    };
  }

  // ---------------- Lo que se ve ----------------
  function vista(g) {
    const d = disp(g);
    if (g.borrador && g.borrador.dispId === d.id) return { tipo: "borrador", asig: limpiar(g, d, g.borrador.asignacion), entrada: null };
    const e = ultimaDe(g, d.id);
    if (e) return { tipo: "guardada", asig: limpiar(g, d, e.asignacion), entrada: e };
    // Sin nada todavía: solo los sitios fijos.
    return { tipo: "vacia", asig: limpiar(g, d, d.fijos), entrada: null };
  }

  function ponerBorrador(g, asig) {
    g.borrador = { dispId: disp(g).id, asignacion: asig };
    guardar();
  }

  // ---------------- Dibujo ----------------
  function crear(etiqueta, clase, texto) {
    const e = document.createElement(etiqueta);
    if (clase) e.className = clase;
    if (texto !== undefined) e.textContent = texto;
    return e;
  }

  function prepararPlano(plano, d) {
    plano.innerHTML = "";
    plano.style.setProperty("--cols", d.cols);
    plano.style.setProperty("--rows", d.rows);
    plano.style.setProperty("--prop", d.cols / d.rows);
  }

  function colocarBloque(e, b, d, girado) {
    const x = girado ? d.cols - b.x - b.w : b.x;
    const y = girado ? d.rows - b.y - b.h : b.y;
    e.style.left = (x / d.cols) * 100 + "%";
    e.style.top = (y / d.rows) * 100 + "%";
    e.style.width = (b.w / d.cols) * 100 + "%";
    e.style.height = (b.h / d.rows) * 100 + "%";
    e.style.gridTemplateColumns = "repeat(" + b.w + ", 1fr)";
    e.style.gridTemplateRows = "repeat(" + b.h + ", 1fr)";
  }

  // Mesa del docente: una marca en el borde de la pizarra.
  function marcaDocente(plano, d, girado) {
    let lado = d.docente || "derecha";
    if (girado && lado !== "centro") lado = lado === "izquierda" ? "derecha" : "izquierda";
    const m = crear("div", "marca-docente " + lado + (girado ? " abajo" : ""), "Mesa del docente");
    m.setAttribute("aria-hidden", "true");
    plano.appendChild(m);
  }

  // Celdas de una mesa, en su sitio de la rejilla (al revés si se mira
  // desde la mesa del docente).
  function celdas(b, girado, hacer) {
    const n = plazasDe(b);
    for (let i = 0; i < b.w * b.h; i++) {
      const c = i % b.w;
      const r = Math.floor(i / b.w);
      const e = hacer(i, i < n);
      e.style.gridColumn = String(girado ? b.w - c : c + 1);
      e.style.gridRow = String(girado ? b.h - r : r + 1);
    }
  }

  const el = {
    grupo: $("grupo"),
    disposicion: $("disposicion"),
    titulo: $("titulo"),
    estado: $("estado"),
    generar: $("btn-generar"),
    guardarDist: $("btn-guardar"),
    descartar: $("btn-descartar"),
    fijar: $("btn-fijar"),
    girar: $("btn-girar"),
    aviso: $("aviso"),
    ayudaPlano: $("ayuda-plano"),
    marco: $("plano-marco"),
    plano: $("plano"),
    sinSitio: $("sin-sitio"),
    resumen: $("resumen"),
    grupoNombre: $("grupo-nombre"),
    alumnos: $("alumnos"),
    tablaAlumnos: $("tabla-alumnos"),
    listaImportar: $("lista-importar"),
    filaImportar: $("fila-importar"),
    reglaTipo: $("regla-tipo"),
    reglas: $("reglas"),
    mesasDisp: $("mesas-disp"),
    mesasNombre: $("mesas-nombre"),
    plantilla: $("plantilla"),
    editor: $("plano-editor"),
    mesasResumen: $("mesas-resumen"),
    historial: $("historial"),
    repetidos: $("repetidos"),
  };

  let seleccion = null; // { sitio: id } o { alumno: nombre }
  let modoFijar = false;

  function pintarAula() {
    const g = grupo();
    const d = disp(g);
    const v = vista(g);
    const sitios = asientos(d);

    el.titulo.textContent = g.nombre + (v.entrada ? " · " + v.entrada.nombre : "");
    const estados = {
      guardada: ["✓ Guardada el " + (v.entrada ? textoFecha(v.entrada.fecha) : ""), "guardada"],
      borrador: ["Sin guardar: retócala si quieres y pulsa «Guardar distribución»", "borrador"],
      vacia: ["Todavía sin distribuir con esta agrupación", ""],
    };
    el.estado.textContent = estados[v.tipo][0];
    el.estado.className = "estado " + estados[v.tipo][1];
    el.generar.textContent = v.tipo === "vacia" ? "🎲 Generar sitios" : "🎲 Generar otra";
    el.guardarDist.disabled = v.tipo !== "borrador";
    el.descartar.hidden = v.tipo !== "borrador";

    let aviso = "";
    if (!g.alumnos.length) aviso = "Añade el alumnado de la clase en «👥 Alumnado».";
    else if (!sitios.length) aviso = "Esta agrupación no tiene mesas. Añádelas en «🪑 Mesas».";
    else if (sitios.length < g.alumnos.length) aviso = "Hay " + sitios.length + " sitios para " + g.alumnos.length + " alumnos: añade mesas en «🪑 Mesas».";
    el.aviso.textContent = aviso;
    el.aviso.hidden = !aviso;
    el.generar.disabled = !g.alumnos.length || !sitios.length;

    el.ayudaPlano.textContent = modoFijar
      ? "📌 Toca a un alumno para fijarlo en su sitio (se respetará al generar) o para soltarlo. Para fijar a alguien de «Sin sitio», toca su nombre y luego el sitio."
      : sitios.length && g.alumnos.length
      ? "Toca dos sitios para intercambiarlos."
      : "";
    el.fijar.setAttribute("aria-pressed", String(modoFijar));
    el.girar.setAttribute("aria-pressed", String(!!cfg.girado));
    el.marco.classList.toggle("girado", !!cfg.girado);

    prepararPlano(el.plano, d);
    d.bloques.forEach((b) => {
      const mesa = crear("div", "mesa");
      colocarBloque(mesa, b, d, cfg.girado);
      celdas(b, cfg.girado, (i, util) => {
        if (!util) return mesa.appendChild(crear("div", "hueco-mesa"));
        const id = b.id + "." + i;
        const nombre = v.asig[id];
        const sitio = crear("button", "sitio" + (nombre ? "" : " libre"));
        sitio.type = "button";
        sitio.appendChild(crear("span", "sitio-nombre", nombre || ""));
        if (nombre && d.fijos[id] === nombre) {
          sitio.classList.add("fijo");
          sitio.title = "Sitio fijo";
        }
        if (seleccion && seleccion.sitio === id) sitio.classList.add("elegido");
        sitio.setAttribute("aria-label", nombre ? nombre : "Sitio libre");
        sitio.addEventListener("click", () => tocarSitio(id));
        return mesa.appendChild(sitio);
      });
      el.plano.appendChild(mesa);
    });
    marcaDocente(el.plano, d, cfg.girado);

    // Quien no tiene sitio (alumnado nuevo, mesas quitadas o aún sin
    // generar): se toca su nombre y luego un sitio.
    const rep = informe(g, d, v.asig, null);
    el.sinSitio.innerHTML = "";
    if (rep.sinSitio.length && sitios.length) {
      el.sinSitio.appendChild(crear("strong", "", "Sin sitio (" + rep.sinSitio.length + "): "));
      rep.sinSitio.forEach((a) => {
        const b = crear("button", "chip", a);
        b.type = "button";
        b.setAttribute("aria-pressed", String(!!(seleccion && seleccion.alumno === a)));
        b.addEventListener("click", () => {
          seleccion = seleccion && seleccion.alumno === a ? null : { alumno: a };
          pintarAula();
        });
        el.sinSitio.appendChild(b);
      });
      el.sinSitio.hidden = false;
    } else {
      el.sinSitio.hidden = true;
    }

    pintarResumen(g, d, v);
  }

  function pintarResumen(g, d, v) {
    el.resumen.innerHTML = "";
    if (v.tipo === "vacia") {
      el.resumen.hidden = true;
      return;
    }
    // Se compara con la distribución guardada anterior a la que se ve.
    const pos = v.entrada ? g.historial.indexOf(v.entrada) : g.historial.length;
    const referencia = pos > 0 ? g.historial[pos - 1] : null;
    const rep = informe(g, d, v.asig, referencia);
    const puntos = [];
    puntos.push(rep.fallos.length ? ["⚠️ No se cumple: ", rep.fallos.join("; ") + "."] : ["✓ ", "Se cumplen las condiciones «siempre» y las de ubicación."]);
    if (rep.avisos.length) puntos.push(["Preferencias que no se han podido cumplir: ", rep.avisos.join("; ") + "."]);
    if (g.opciones.niveles && rep.necesitan) {
      puntos.push(
        rep.sinTutor.length
          ? ["Tutorización: ", rep.necesitan - rep.sinTutor.length + " de " + rep.necesitan + " alumnos de nivel 3-4 tienen al lado a alguien de nivel 1-2."]
          : ["✓ Tutorización: ", "todo el alumnado de nivel 3-4 tiene al lado a alguien de nivel 1-2."]
      );
      if (rep.conApoyo.length) puntos.push(["Nivel 4 con apoyo de un nivel 3 (sin tutor de 1-2): ", rep.conApoyo.join(", ") + "."]);
      if (rep.apoyan.length) puntos.push(["Nivel 3 que apoyan a un nivel 4 sin tener tutor: ", rep.apoyan.join(", ") + "."]);
      if (rep.sinSuperior.length) {
        const delante = rep.sinSuperior.filter((a) => rep.sinSuperiorDetras.indexOf(a) === -1);
        if (delante.length) puntos.push(["Solo con compañeros de su mismo nivel, en las primeras filas: ", delante.join(", ") + "."]);
        if (rep.sinSuperiorDetras.length) puntos.push(["⚠️ Solo con compañeros de su mismo nivel y fuera de las primeras filas: ", rep.sinSuperiorDetras.join(", ") + (g.opciones.rescate ? " (no caben delante: añade sitios en las primeras filas o cambia la agrupación)." : ".")]);
      }
      if (rep.mesasDosCuatro) puntos.push(["Mesas con dos o más alumnos de nivel 4: ", String(rep.mesasDosCuatro)]);
    }
    if (referencia) {
      puntos.push(
        rep.repetidos.length
          ? ["Repiten mesa respecto a «" + referencia.nombre + "» (" + rep.repetidos.length + "): ", rep.repetidos.join(", ") + "."]
          : ["✓ ", "Nadie repite compañero de mesa respecto a «" + referencia.nombre + "»."]
      );
    } else {
      puntos.push(["Primera distribución: ", "a partir de que la guardes, las siguientes evitarán repetir compañeros."]);
    }
    if (g.opciones.generos && rep.generos.mesas) puntos.push(["Mesas mixtas: ", rep.generos.mezcladas + " de " + rep.generos.mesas + "."]);
    if (rep.libres > 0) puntos.push(["Sitios libres: ", String(rep.libres)]);

    el.resumen.appendChild(crear("h3", "", "Cómo ha quedado"));
    const ul = crear("ul");
    puntos.forEach(([titulo, texto]) => {
      const li = crear("li");
      li.appendChild(crear("strong", "", titulo));
      li.appendChild(document.createTextNode(texto));
      ul.appendChild(li);
    });
    el.resumen.appendChild(ul);
    el.resumen.hidden = false;
  }

  // ---------------- Tocar sitios ----------------
  function tocarSitio(id) {
    const g = grupo();
    const d = disp(g);
    const v = vista(g);
    const nombre = v.asig[id];

    if (modoFijar && !(seleccion && seleccion.alumno)) {
      if (!nombre) return;
      if (d.fijos[id] === nombre) {
        delete d.fijos[id];
      } else {
        Object.keys(d.fijos).forEach((k) => d.fijos[k] === nombre && delete d.fijos[k]);
        d.fijos[id] = nombre;
      }
      guardar();
      pintarAula();
      return;
    }

    if (!seleccion) {
      if (nombre) seleccion = { sitio: id };
      pintarAula();
      return;
    }
    if (seleccion.sitio === id) {
      seleccion = null;
      pintarAula();
      return;
    }

    const asig = Object.assign({}, v.asig);
    if (seleccion.alumno) {
      delete asig[id];
      Object.keys(asig).forEach((k) => asig[k] === seleccion.alumno && delete asig[k]);
      asig[id] = seleccion.alumno;
    } else {
      const otro = asig[seleccion.sitio];
      if (nombre) asig[seleccion.sitio] = nombre;
      else delete asig[seleccion.sitio];
      if (otro) asig[id] = otro;
      else delete asig[id];
    }
    // Un alumno fijo que se mueve a mano deja de estar fijo allí. Con
    // «Fijar» activo, quien se coloca desde «Sin sitio» queda fijo.
    Object.keys(d.fijos).forEach((k) => d.fijos[k] !== asig[k] && delete d.fijos[k]);
    if (modoFijar && seleccion.alumno) d.fijos[id] = seleccion.alumno;
    seleccion = null;
    ponerBorrador(g, asig);
    pintarAula();
  }

  el.generar.addEventListener("click", () => {
    const g = grupo();
    const r = generar(g, disp(g));
    if (r.error) {
      el.aviso.textContent = r.error;
      el.aviso.hidden = false;
      return;
    }
    seleccion = null;
    ponerBorrador(g, r.asig);
    pintarAula();
    H.sonar("exito");
  });

  el.guardarDist.addEventListener("click", () => {
    const g = grupo();
    const d = disp(g);
    const v = vista(g);
    if (v.tipo !== "borrador") return;
    const propuesto = "SdA " + (g.historial.length + 1);
    const nombre = window.prompt("Nombre de esta distribución (por ejemplo, la situación de aprendizaje):", propuesto);
    if (nombre === null) return;
    g.historial.push({
      id: "h" + g.sig++,
      nombre: nombre.trim().slice(0, 60) || propuesto,
      fecha: hoy(),
      dispId: d.id,
      plano: copiaPlano(d),
      asignacion: v.asig,
      pares: paresDe(d, v.asig),
      zonas: zonasDe(d, v.asig),
    });
    if (g.historial.length > MAX_HISTORIAL) g.historial.splice(0, g.historial.length - MAX_HISTORIAL);
    g.borrador = null;
    guardar();
    pintarAula();
    pintarHistorial();
  });

  el.descartar.addEventListener("click", () => {
    const g = grupo();
    g.borrador = null;
    seleccion = null;
    guardar();
    pintarAula();
  });

  el.fijar.addEventListener("click", () => {
    modoFijar = !modoFijar;
    seleccion = null;
    pintarAula();
  });

  el.girar.addEventListener("click", () => {
    cfg.girado = !cfg.girado;
    guardar();
    pintarAula();
    pintarEditor();
  });

  $("btn-imprimir").addEventListener("click", () => window.print());

  // ---------------- Imagen y PDF ----------------
  // El plano se dibuja en un canvas (sin librerías ni servicios
  // externos). De ahí sale el PNG y, metido como JPEG en una página A4
  // apaisada, el PDF, que se escribe a mano: cinco objetos y su tabla.
  function redondo(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Nombre en una o dos líneas, con la letra más grande que quepa.
  function nombreEnCaja(ctx, texto, cx, cy, ancho, alto, maximo) {
    const palabras = texto.split(/\s+/);
    for (let t = maximo; t >= 9; t--) {
      ctx.font = "800 " + t + "px Inter, system-ui, sans-serif";
      let lineas = [texto];
      if (ctx.measureText(texto).width > ancho && palabras.length > 1) {
        // Mejor corte en dos líneas: el que deja la más larga más corta.
        let mejor = null;
        for (let k = 1; k < palabras.length; k++) {
          const l = [palabras.slice(0, k).join(" "), palabras.slice(k).join(" ")];
          const m = Math.max(ctx.measureText(l[0]).width, ctx.measureText(l[1]).width);
          if (!mejor || m < mejor.m) mejor = { l: l, m: m };
        }
        lineas = mejor.l;
      }
      const cabe = lineas.every((l) => ctx.measureText(l).width <= ancho) && lineas.length * t * 1.15 <= alto;
      if (cabe || t === 9) {
        lineas.forEach((l, i) => ctx.fillText(l, cx, cy + (i - (lineas.length - 1) / 2) * t * 1.15, ancho));
        return;
      }
    }
  }

  function dibujarPlano() {
    const g = grupo();
    const d = disp(g);
    const v = vista(g);
    const girado = !!cfg.girado;
    const W = 2000;
    const margen = 60;
    const cabecera = 150;
    const alturaPizarra = 56;
    let anchoPlano = W - 2 * margen;
    let celda = anchoPlano / d.cols;
    if (celda * d.rows > 1200) celda = 1200 / d.rows;
    anchoPlano = celda * d.cols;
    const altoPlano = celda * d.rows;
    const H = cabecera + alturaPizarra + 20 + altoPlano + margen;
    const lienzo = document.createElement("canvas");
    lienzo.width = W;
    lienzo.height = H;
    const ctx = lienzo.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#0f172a";
    ctx.font = "800 52px Inter, system-ui, sans-serif";
    ctx.fillText(g.nombre + (v.entrada ? " · " + v.entrada.nombre : ""), W / 2, 60, W - 2 * margen);
    ctx.fillStyle = "#475569";
    ctx.font = "600 28px Inter, system-ui, sans-serif";
    const fecha = v.entrada ? textoFecha(v.entrada.fecha) : textoFecha(hoy());
    ctx.fillText(d.nombre + " · " + fecha + (girado ? " · vista desde la mesa del docente" : ""), W / 2, 112, W - 2 * margen);

    const x0 = (W - anchoPlano) / 2;
    const yPlano = girado ? cabecera : cabecera + alturaPizarra + 20;
    const yPizarra = girado ? cabecera + altoPlano + 20 : cabecera;
    redondo(ctx, W / 2 - 360, yPizarra, 720, alturaPizarra, 8);
    ctx.fillStyle = "#14532d";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#a16207";
    ctx.stroke();
    ctx.fillStyle = "#dcfce7";
    ctx.font = "800 28px Inter, system-ui, sans-serif";
    ctx.fillText("PIZARRA", W / 2, yPizarra + alturaPizarra / 2);

    redondo(ctx, x0, yPlano, anchoPlano, altoPlano, 16);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#94a3b8";
    ctx.stroke();

    // Mesa del docente, en el borde de la pizarra.
    let lado = d.docente || "derecha";
    if (girado && lado !== "centro") lado = lado === "izquierda" ? "derecha" : "izquierda";
    const anchoMarca = 260;
    const xm = lado === "izquierda" ? x0 + 10 : lado === "centro" ? W / 2 - anchoMarca / 2 : x0 + anchoPlano - anchoMarca - 10;
    const ym = girado ? yPlano + altoPlano - 44 : yPlano;
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(xm, ym, anchoMarca, 44);
    ctx.fillStyle = "#1e293b";
    ctx.font = "700 24px Inter, system-ui, sans-serif";
    ctx.fillText("Mesa del docente", xm + anchoMarca / 2, ym + 22);

    const hueco = Math.max(3, celda * 0.05);
    d.bloques.forEach((b) => {
      const bx = girado ? d.cols - b.x - b.w : b.x;
      const by = girado ? d.rows - b.y - b.h : b.y;
      redondo(ctx, x0 + bx * celda, yPlano + by * celda, b.w * celda, b.h * celda, 10);
      ctx.fillStyle = "#c9ab82";
      ctx.fill();
      const n = plazasDe(b);
      for (let i = 0; i < n; i++) {
        let c = i % b.w;
        let r = Math.floor(i / b.w);
        if (girado) {
          c = b.w - 1 - c;
          r = b.h - 1 - r;
        }
        const sx = x0 + (bx + c) * celda + hueco;
        const sy = yPlano + (by + r) * celda + hueco;
        const lado2 = celda - 2 * hueco;
        const nombre = v.asig[b.id + "." + i];
        redondo(ctx, sx, sy, lado2, lado2, 8);
        ctx.fillStyle = nombre ? "#ffffff" : "#efe6d8";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#475569";
        ctx.setLineDash(nombre ? [] : [8, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
        if (nombre) {
          ctx.fillStyle = "#0f172a";
          nombreEnCaja(ctx, nombre, sx + lado2 / 2, sy + lado2 / 2, lado2 - 12, lado2 - 10, Math.min(44, Math.floor(lado2 / 3.2)));
        }
      }
    });
    return lienzo;
  }

  function nombreArchivo(ext) {
    const g = grupo();
    const v = vista(g);
    const partes = ["sitios", g.nombre, v.entrada ? v.entrada.nombre : hoy()];
    return (
      partes
        .join("-")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^A-Za-z0-9-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") +
      "." +
      ext
    );
  }

  function descargar(blob, nombre) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function pdfConImagen(jpeg, ancho, alto) {
    // A4 apaisado (842 × 595 puntos) con 24 puntos de margen.
    const PW = 842;
    const PH = 595;
    const m = 24;
    const k = Math.min((PW - 2 * m) / ancho, (PH - 2 * m) / alto);
    const w = (ancho * k).toFixed(2);
    const h = (alto * k).toFixed(2);
    const x = ((PW - ancho * k) / 2).toFixed(2);
    const y = ((PH - alto * k) / 2).toFixed(2);
    const contenido = "q " + w + " 0 0 " + h + " " + x + " " + y + " cm /Im0 Do Q";
    const trozos = [];
    const offsets = [];
    let largo = 0;
    const poner = (parte) => {
      const bytes = typeof parte === "string" ? Uint8Array.from(parte, (ch) => ch.charCodeAt(0) & 255) : parte;
      trozos.push(bytes);
      largo += bytes.length;
    };
    const objeto = (n, texto) => {
      offsets[n] = largo;
      poner(n + " 0 obj\n" + texto + "\nendobj\n");
    };
    poner("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
    objeto(1, "<< /Type /Catalog /Pages 2 0 R >>");
    objeto(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
    objeto(3, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + PW + " " + PH + "] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>");
    offsets[4] = largo;
    poner("4 0 obj\n<< /Type /XObject /Subtype /Image /Width " + ancho + " /Height " + alto + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + jpeg.length + " >>\nstream\n");
    poner(jpeg);
    poner("\nendstream\nendobj\n");
    objeto(5, "<< /Length " + contenido.length + " >>\nstream\n" + contenido + "\nendstream");
    const inicioXref = largo;
    let xref = "xref\n0 6\n0000000000 65535 f \n";
    for (let n = 1; n <= 5; n++) xref += String(offsets[n]).padStart(10, "0") + " 00000 n \n";
    poner(xref + "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + inicioXref + "\n%%EOF\n");
    return new Blob(trozos, { type: "application/pdf" });
  }

  async function exportar(tipo) {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const lienzo = dibujarPlano();
    if (tipo === "png") {
      lienzo.toBlob((blob) => blob && descargar(blob, nombreArchivo("png")), "image/png");
      return;
    }
    const datos = atob(lienzo.toDataURL("image/jpeg", 0.92).split(",")[1]);
    const jpeg = Uint8Array.from(datos, (ch) => ch.charCodeAt(0));
    descargar(pdfConImagen(jpeg, lienzo.width, lienzo.height), nombreArchivo("pdf"));
  }

  $("btn-imagen").addEventListener("click", () => exportar("png"));
  $("btn-pdf").addEventListener("click", () => exportar("pdf"));

  // ---------------- Elegir agrupación ----------------
  function pintarDisposiciones() {
    const g = grupo();
    [el.disposicion, el.mesasDisp].forEach((sel) => {
      sel.innerHTML = "";
      g.disposiciones.forEach((d) => {
        const op = crear("option", "", d.nombre + " (" + asientos(d).length + " sitios)");
        op.value = d.id;
        if (d.id === g.dispActual) op.selected = true;
        sel.appendChild(op);
      });
    });
    el.mesasNombre.value = disp(g).nombre;
    $("mesa-docente").value = disp(g).docente || "derecha";
    $("btn-borrar-disp").disabled = g.disposiciones.length < 2;
  }

  function cambiarDisposicion(id) {
    const g = grupo();
    if (id === g.dispActual) return;
    if (g.borrador && g.borrador.dispId === g.dispActual && !window.confirm("La distribución sin guardar se perderá. ¿Cambiar de agrupación?")) {
      pintarDisposiciones();
      return;
    }
    if (g.borrador && g.borrador.dispId === g.dispActual) g.borrador = null;
    g.dispActual = id;
    seleccion = null;
    mesaElegida = null;
    guardar();
    pintarDisposiciones();
    pintarAula();
    pintarEditor();  pintarResumenNiveles();
  }

  el.disposicion.addEventListener("change", () => cambiarDisposicion(el.disposicion.value));
  el.mesasDisp.addEventListener("change", () => cambiarDisposicion(el.mesasDisp.value));

  // ---------------- Editor de mesas ----------------
  let mesaElegida = null;

  function solapa(d, b, x, y, w, h) {
    return d.bloques.some((o) => o !== b && x < o.x + o.w && o.x < x + w && y < o.y + o.h && o.y < y + h);
  }

  function cambioDeMesas() {
    const g = grupo();
    const d = disp(g);
    // Los sitios fijos de mesas que ya no existen se olvidan.
    const ids = new Set(asientos(d).map((s) => s.id));
    Object.keys(d.fijos).forEach((k) => !ids.has(k) && delete d.fijos[k]);
    guardar();
    pintarDisposiciones();
    pintarEditor();
    pintarAula();  pintarResumenNiveles();
  }

  function pintarEditor() {
    const g = grupo();
    const d = disp(g);
    if (mesaElegida && d.bloques.indexOf(mesaElegida) === -1) mesaElegida = null;
    prepararPlano(el.editor, d);
    d.bloques.forEach((b) => {
      const mesa = crear("div", "mesa" + (b === mesaElegida ? " elegida" : ""));
      colocarBloque(mesa, b, d, false);
      celdas(b, false, (i, util) => mesa.appendChild(crear("div", util ? "sitio-molde" : "hueco-mesa")));
      mesa.addEventListener("pointerdown", (e) => arrastrar(e, mesa, b, d));
      el.editor.appendChild(mesa);
    });
    marcaDocente(el.editor, d, false);
    const n = asientos(d).length;
    el.mesasResumen.textContent = d.bloques.length + " mesas, " + n + " sitios para " + g.alumnos.length + " alumnos." + (n < g.alumnos.length ? " Faltan " + (g.alumnos.length - n) + " sitios." : "");
    ["btn-girar-mesa", "btn-quitar-mesa", "btn-sitio-menos", "btn-sitio-mas"].forEach((id) => ($(id).disabled = !mesaElegida));
    if (mesaElegida) {
      $("btn-sitio-menos").disabled = plazasDe(mesaElegida) <= 1;
      $("btn-sitio-mas").disabled = plazasDe(mesaElegida) >= mesaElegida.w * mesaElegida.h;
      $("btn-girar-mesa").disabled = mesaElegida.w === mesaElegida.h;
    }
  }

  // Mover una mesa con ratón, dedo o lápiz; se ajusta a la cuadrícula
  // y vuelve a su sitio si al soltarla pisa otra.
  function arrastrar(e, mesa, b, d) {
    if (e.button !== 0) return;
    e.preventDefault();
    mesaElegida = b;
    el.editor.querySelectorAll(".mesa").forEach((m) => m.classList.toggle("elegida", m === mesa));
    const rect = el.editor.getBoundingClientRect();
    const celdaW = rect.width / d.cols;
    const celdaH = rect.height / d.rows;
    const inicio = { px: e.clientX, py: e.clientY, x: b.x, y: b.y };
    mesa.setPointerCapture(e.pointerId);

    function mover(ev) {
      b.x = limitar(inicio.x + Math.round((ev.clientX - inicio.px) / celdaW), 0, d.cols - b.w);
      b.y = limitar(inicio.y + Math.round((ev.clientY - inicio.py) / celdaH), 0, d.rows - b.h);
      colocarBloque(mesa, b, d, false);
      mesa.classList.toggle("choca", solapa(d, b, b.x, b.y, b.w, b.h));
    }
    function soltar() {
      mesa.removeEventListener("pointermove", mover);
      mesa.removeEventListener("pointerup", soltar);
      mesa.removeEventListener("pointercancel", soltar);
      if (solapa(d, b, b.x, b.y, b.w, b.h)) {
        b.x = inicio.x;
        b.y = inicio.y;
      }
      cambioDeMesas();
    }
    mesa.addEventListener("pointermove", mover);
    mesa.addEventListener("pointerup", soltar);
    mesa.addEventListener("pointercancel", soltar);
  }

  function hueco(d, w, h) {
    for (let y = 1; y <= d.rows - h; y++) for (let x = 1; x <= d.cols - w; x++) if (!solapa(d, null, x, y, w, h)) return { x, y };
    for (let y = 0; y <= d.rows - h; y++) for (let x = 0; x <= d.cols - w; x++) if (!solapa(d, null, x, y, w, h)) return { x, y };
    return null;
  }

  document.querySelectorAll("[data-mesa]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const d = disp(grupo());
      const [w, h] = boton.dataset.mesa.split("x").map(Number);
      const sitio = hueco(d, w, h);
      if (!sitio) {
        window.alert("No cabe otra mesa así. Amplía el aula con «+ ancho» o «+ fondo».");
        return;
      }
      mesaElegida = { id: "b" + d.sig++, x: sitio.x, y: sitio.y, w: w, h: h, n: w * h };
      d.bloques.push(mesaElegida);
      cambioDeMesas();
    });
  });

  $("btn-girar-mesa").addEventListener("click", () => {
    const d = disp(grupo());
    const b = mesaElegida;
    if (!b) return;
    const x = limitar(b.x, 0, d.cols - b.h);
    const y = limitar(b.y, 0, d.rows - b.w);
    if (b.h > d.cols || b.w > d.rows || solapa(d, b, x, y, b.h, b.w)) {
      window.alert("Girada no cabe ahí: muévela antes a un hueco más amplio.");
      return;
    }
    Object.assign(b, { x: x, y: y, w: b.h, h: b.w });
    cambioDeMesas();
  });

  $("btn-quitar-mesa").addEventListener("click", () => {
    const d = disp(grupo());
    d.bloques = d.bloques.filter((b) => b !== mesaElegida);
    mesaElegida = null;
    cambioDeMesas();
  });

  $("btn-sitio-menos").addEventListener("click", () => {
    if (!mesaElegida) return;
    mesaElegida.n = plazasDe(mesaElegida) - 1;
    cambioDeMesas();
  });
  $("btn-sitio-mas").addEventListener("click", () => {
    if (!mesaElegida) return;
    mesaElegida.n = plazasDe(mesaElegida) + 1;
    cambioDeMesas();
  });

  function cambiarTamano(dc, dr) {
    const d = disp(grupo());
    const cols = limitar(d.cols + dc, MIN_LADO, MAX_LADO);
    const rows = limitar(d.rows + dr, MIN_LADO, MAX_LADO);
    if (d.bloques.some((b) => b.x + b.w > cols || b.y + b.h > rows)) {
      window.alert("Hay mesas en el borde: muévelas antes de reducir el aula.");
      return;
    }
    d.cols = cols;
    d.rows = rows;
    cambioDeMesas();
  }
  $("btn-cols-menos").addEventListener("click", () => cambiarTamano(-1, 0));
  $("btn-cols-mas").addEventListener("click", () => cambiarTamano(1, 0));
  $("btn-filas-menos").addEventListener("click", () => cambiarTamano(0, -1));
  $("btn-filas-mas").addEventListener("click", () => cambiarTamano(0, 1));

  el.mesasNombre.addEventListener("input", () => {
    const d = disp(grupo());
    d.nombre = el.mesasNombre.value.trim().slice(0, 40) || "Sin nombre";
    guardar();
    pintarDisposiciones();
  });

  $("mesa-docente").addEventListener("change", () => {
    disp(grupo()).docente = $("mesa-docente").value;
    guardar();
    pintarEditor();
    pintarAula();
  });

  function anadirDisposicion(d) {
    const g = grupo();
    g.disposiciones.push(d);
    cambiarDisposicion(d.id);
  }

  $("btn-nueva-disp").addEventListener("click", () => {
    anadirDisposicion(disposicionNueva(grupo(), el.plantilla.value));
    el.mesasNombre.focus();
    el.mesasNombre.select();
  });

  $("btn-duplicar-disp").addEventListener("click", () => {
    const g = grupo();
    const o = disp(g);
    const d = JSON.parse(JSON.stringify(o));
    d.id = "d" + g.sig++;
    d.nombre = (o.nombre + " (copia)").slice(0, 40);
    anadirDisposicion(d);
  });

  $("btn-borrar-disp").addEventListener("click", () => {
    const g = grupo();
    const d = disp(g);
    if (g.disposiciones.length < 2) return;
    if (!window.confirm("¿Borrar la agrupación «" + d.nombre + "»? Las distribuciones guardadas con ella se conservan y se pueden volver a usar.")) return;
    g.disposiciones = g.disposiciones.filter((x) => x !== d);
    if (g.borrador && g.borrador.dispId === d.id) g.borrador = null;
    g.dispActual = g.disposiciones[0].id;
    mesaElegida = null;
    seleccion = null;
    guardar();
    pintarTodo();
  });

  // ---------------- Clases y alumnado ----------------
  function pintarGrupos() {
    el.grupo.innerHTML = "";
    cfg.grupos.forEach((g) => {
      const op = crear("option", "", g.nombre + " (" + g.alumnos.length + ")");
      op.value = g.id;
      if (g.id === cfg.actual) op.selected = true;
      el.grupo.appendChild(op);
    });
    el.grupo.hidden = cfg.grupos.length < 2;
  }

  function pintarAlumnado() {
    const g = grupo();
    el.grupoNombre.value = g.nombre;
    if (document.activeElement !== el.alumnos) el.alumnos.value = g.alumnos.join("\n");
    pintarTablaAlumnos();

    const listas = leerListas();
    el.listaImportar.innerHTML = "";
    listas.forEach((l, i) => {
      const op = crear("option", "", l.origen + " · " + l.nombre + " (" + l.alumnos.length + ")");
      op.value = String(i);
      el.listaImportar.appendChild(op);
    });
    el.filaImportar.hidden = !listas.length;
  }

  function selector(opciones, valor, alCambiar, etiqueta) {
    const s = crear("select");
    s.setAttribute("aria-label", etiqueta);
    opciones.forEach(([v, t]) => {
      const op = crear("option", "", t);
      op.value = v;
      if (v === (valor || "")) op.selected = true;
      s.appendChild(op);
    });
    s.addEventListener("change", () => alCambiar(s.value));
    return s;
  }

  function pintarTablaAlumnos() {
    const g = grupo();
    const t = el.tablaAlumnos;
    t.innerHTML = "";
    if (!g.alumnos.length) return;
    const cab = crear("tr");
    ["Alumno", "Nivel", "Ubicación", "Chico / chica"].forEach((x) => cab.appendChild(crear("th", "", x)));
    const thead = crear("thead");
    thead.appendChild(cab);
    t.appendChild(thead);
    const tbody = crear("tbody");
    g.alumnos.forEach((a) => {
      const dato = Object.assign({}, datoDe(g, a));
      const fijarDato = (campo, valor) => {
        if (valor) dato[campo] = valor;
        else delete dato[campo];
        if (Object.keys(dato).length) g.datos[a] = Object.assign({}, dato);
        else delete g.datos[a];
        guardar();
        pintarAula();
      };
      const tr = crear("tr");
      tr.appendChild(crear("td", "", a));
      const td1 = crear("td");
      const niveles = [["", "—"]].concat(NIVELES.map((n) => [n, n + " · " + NOMBRE_NIVEL[n]]));
      td1.appendChild(selector(niveles, String(dato.nivel || ""), (v) => {
        fijarDato("nivel", v);
        pintarResumenNiveles();
      }, "Nivel de " + a));
      const td2 = crear("td");
      const ubicaciones = [["", "—"], ["delante", "Delante"], ["docente", "Cerca del docente"], ["ambos", "Delante y cerca del docente"]];
      td2.appendChild(selector(ubicaciones, dato.ubicacion, (v) => fijarDato("ubicacion", v), "Ubicación de " + a));
      const td3 = crear("td");
      td3.appendChild(selector([["", "—"], ["chico", "Chico"], ["chica", "Chica"]], dato.genero, (v) => fijarDato("genero", v), "Chico o chica: " + a));
      tr.append(td1, td2, td3);
      tbody.appendChild(tr);
    });
    t.appendChild(tbody);
    pintarResumenNiveles();
  }

  // Cuántos hay de cada nivel: si hay menos alumnos de 1-2 que mesas,
  // o muchos más de 3-4 que de 1-2, la tutorización no llega a todos.
  function pintarResumenNiveles() {
    const g = grupo();
    const p = $("niveles-resumen");
    const cuenta = { 1: 0, 2: 0, 3: 0, 4: 0 };
    g.alumnos.forEach((a) => {
      const n = datoDe(g, a).nivel;
      if (cuenta[n] !== undefined) cuenta[n]++;
    });
    const con = cuenta[1] + cuenta[2] + cuenta[3] + cuenta[4];
    if (!con) {
      p.textContent = "";
      return;
    }
    let texto = NIVELES.map((n) => "Nivel " + n + ": " + cuenta[n]).join(" · ") + ". ";
    const tutores = cuenta[1] + cuenta[2];
    const tutorizados = cuenta[3] + cuenta[4];
    const mesas = disp(g).bloques.filter((b) => plazasDe(b) > 1).length;
    if (tutorizados > 2 * tutores) texto += "Hay más del doble de alumnado de nivel 3-4 que de 1-2: no todos tendrán un tutor de 1-2. Se buscará un compañero de nivel superior (un 3 para un 4) y, si no lo hay, se sentarán en las primeras filas.";
    else if (mesas && tutores < mesas) texto += "Con " + mesas + " mesas y " + tutores + (tutores === 1 ? " alumno" : " alumnos") + " de nivel 1-2, alguna mesa quedará sin tutor.";
    else texto += "Hay alumnado de nivel 1-2 suficiente para tutorizar en cada mesa.";
    // ¿Caben delante todos los que tienen que ir delante?
    const sitiosDelante = asientos(disp(g)).filter((x) => x.delante).length;
    const deben = g.alumnos.filter((a) => {
      const u = ubicacionDe(g, a);
      return u.delante || (g.opciones.cuatroDelante && String(datoDe(g, a).nivel) === "4");
    }).length;
    if (deben > sitiosDelante) texto += " ⚠️ Deben ir en las primeras filas " + deben + " alumnos y esta agrupación solo tiene " + sitiosDelante + " sitios ahí.";
    p.textContent = texto;
  }

  function fijarAlumnos(g, nombres) {
    const vistos = new Set();
    g.alumnos = nombres.map((s) => s.trim().slice(0, 40)).filter((s) => s && !vistos.has(s) && vistos.add(s));
    Object.keys(g.datos).forEach((a) => !vistos.has(a) && delete g.datos[a]);
    g.reglas.forEach((r) => (r.alumnos = r.alumnos.filter((a) => vistos.has(a))));
    g.reglas = g.reglas.filter((r) => r.alumnos.length > 1);
    g.disposiciones.forEach((d) => Object.keys(d.fijos).forEach((k) => !vistos.has(d.fijos[k]) && delete d.fijos[k]));
    guardar();
    pintarGrupos();
    pintarTablaAlumnos();
    pintarCondiciones();
    pintarAula();
    pintarEditor();
  }

  // La tabla se rehace al salir del cuadro de texto, no con cada letra.
  el.alumnos.addEventListener("input", () => {
    const g = grupo();
    const vistos = new Set();
    g.alumnos = el.alumnos.value.split("\n").map((s) => s.trim().slice(0, 40)).filter((s) => s && !vistos.has(s) && vistos.add(s));
    guardar();
    pintarGrupos();
  });
  el.alumnos.addEventListener("change", () => fijarAlumnos(grupo(), el.alumnos.value.split("\n")));

  $("btn-importar").addEventListener("click", () => {
    const l = leerListas()[Number(el.listaImportar.value)];
    if (!l) return;
    const g = grupo();
    fijarAlumnos(g, g.alumnos.concat(l.alumnos));
    el.alumnos.value = g.alumnos.join("\n");
  });

  el.grupo.addEventListener("change", () => {
    cfg.actual = el.grupo.value;
    seleccion = null;
    mesaElegida = null;
    guardar();
    pintarTodo();
  });

  el.grupoNombre.addEventListener("input", () => {
    grupo().nombre = el.grupoNombre.value.trim() || "Sin nombre";
    guardar();
    pintarGrupos();
    pintarAula();
  });

  $("btn-nuevo-grupo").addEventListener("click", () => {
    const id = "g" + cfg.siguiente++;
    cfg.grupos.push(grupoNuevo(id, "Clase " + (cfg.grupos.length + 1), []));
    cfg.actual = id;
    guardar();
    pintarTodo();
    el.grupoNombre.focus();
    el.grupoNombre.select();
  });

  $("btn-borrar-grupo").addEventListener("click", () => {
    const g = grupo();
    if (!window.confirm("¿Borrar la clase «" + g.nombre + "» con sus mesas, condiciones y todo su historial? No se puede deshacer.")) return;
    cfg.grupos = cfg.grupos.filter((x) => x.id !== g.id);
    if (!cfg.grupos.length) cfg.grupos.push(grupoNuevo("g" + cfg.siguiente++, "Mi clase", []));
    cfg.actual = cfg.grupos[0].id;
    guardar();
    pintarTodo();
  });

  // ---------------- Condiciones ----------------
  // Formulario: alumnos elegidos y, si se está editando, qué condición.
  let reglaElegidos = [];
  let reglaEditando = null;

  const TEXTO_REGLA = {
    "separar|siempre": "⛔ Separar siempre",
    "separar|mejor": "↔️ Mejor separados",
    "juntar|siempre": "🔗 Juntar siempre",
    "juntar|mejor": "🤝 Mejor juntos",
  };

  function pintarFormularioRegla() {
    const g = grupo();
    reglaElegidos = reglaElegidos.filter((a) => g.alumnos.indexOf(a) !== -1);
    const cont = $("regla-alumnos");
    cont.innerHTML = "";
    g.alumnos.forEach((a) => {
      const b = crear("button", "chip", a);
      b.type = "button";
      b.setAttribute("aria-pressed", String(reglaElegidos.indexOf(a) !== -1));
      b.addEventListener("click", () => {
        const i = reglaElegidos.indexOf(a);
        if (i === -1) reglaElegidos.push(a);
        else reglaElegidos.splice(i, 1);
        pintarFormularioRegla();
      });
      cont.appendChild(b);
    });
    if (!g.alumnos.length) cont.textContent = "Añade antes el alumnado en «👥 Alumnado».";
    const boton = $("btn-regla");
    boton.disabled = reglaElegidos.length < 2;
    boton.textContent = reglaEditando ? "💾 Guardar cambios" : "+ Añadir condición" + (reglaElegidos.length > 1 ? " (" + reglaElegidos.length + " alumnos)" : "");
    $("btn-regla-cancelar").hidden = !reglaEditando;
  }

  function limpiarFormularioRegla() {
    reglaElegidos = [];
    reglaEditando = null;
    $("regla-motivo").value = "";
    pintarFormularioRegla();
  }

  function pintarCondiciones() {
    const g = grupo();
    pintarFormularioRegla();

    el.reglas.innerHTML = "";
    g.reglas.forEach((r) => {
      const li = crear("li", "regla " + r.tipo + " " + r.fuerza + (r === reglaEditando ? " editando" : ""));
      const texto = crear("div", "regla-texto");
      texto.appendChild(crear("strong", "", TEXTO_REGLA[r.tipo + "|" + r.fuerza] + ": "));
      texto.appendChild(document.createTextNode(r.alumnos.join(", ")));
      if (r.motivo) texto.appendChild(crear("small", "", r.motivo));
      li.appendChild(texto);
      const editar = crear("button", "btn btn-fantasma", "✏️");
      editar.type = "button";
      editar.setAttribute("aria-label", "Editar esta condición");
      editar.addEventListener("click", () => {
        reglaEditando = r;
        reglaElegidos = r.alumnos.slice();
        el.reglaTipo.value = r.tipo + "|" + r.fuerza;
        $("regla-motivo").value = r.motivo || "";
        pintarCondiciones();
        el.reglaTipo.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      const x = crear("button", "btn btn-fantasma", "✕");
      x.type = "button";
      x.setAttribute("aria-label", "Quitar esta condición");
      x.addEventListener("click", () => {
        g.reglas = g.reglas.filter((o) => o !== r);
        if (reglaEditando === r) limpiarFormularioRegla();
        guardar();
        pintarCondiciones();
        pintarAula();
      });
      li.append(editar, x);
      el.reglas.appendChild(li);
    });
    if (!g.reglas.length) el.reglas.appendChild(crear("li", "ayuda", "Todavía no hay condiciones."));

    // Una misma pareja en «separar» y en «juntar» no se puede cumplir.
    const tipos = new Map();
    const choques = [];
    g.reglas.forEach((r) =>
      paresDeRegla(r).forEach((p) => {
        const k = p.slice().sort().join(" y ");
        if (tipos.has(k) && tipos.get(k) !== r.tipo && choques.indexOf(k) === -1) choques.push(k);
        tipos.set(k, r.tipo);
      })
    );
    const aviso = $("reglas-aviso");
    aviso.textContent = choques.length ? "⚠️ Condiciones contradictorias (separar y juntar a la vez): " + choques.join(", ") + "." : "";
    aviso.hidden = !choques.length;

    $("op-niveles").checked = !!g.opciones.niveles;
    $("op-rescate").checked = !!g.opciones.rescate;
    $("op-cuatro").checked = !!g.opciones.cuatroDelante;
    $("op-rescate").disabled = !g.opciones.niveles;
    $("op-generos").checked = !!g.opciones.generos;
    $("op-zona").checked = !!g.opciones.zona;
    $("op-sitio").checked = !!g.opciones.sitio;
    $("op-memoria").value = String(g.opciones.memoria);
  }

  $("btn-regla").addEventListener("click", () => {
    const g = grupo();
    if (reglaElegidos.length < 2) return;
    const [tipo, fuerza] = el.reglaTipo.value.split("|");
    const datos = { tipo: tipo, fuerza: fuerza, alumnos: reglaElegidos.slice(), motivo: $("regla-motivo").value.trim().slice(0, 40) };
    if (reglaEditando && g.reglas.indexOf(reglaEditando) !== -1) Object.assign(reglaEditando, datos);
    else g.reglas.push(Object.assign({ id: "r" + g.sig++ }, datos));
    guardar();
    limpiarFormularioRegla();
    pintarCondiciones();
    pintarAula();
  });

  $("btn-regla-cancelar").addEventListener("click", () => {
    limpiarFormularioRegla();
    pintarCondiciones();
  });

  [["op-niveles", "niveles"], ["op-rescate", "rescate"], ["op-cuatro", "cuatroDelante"], ["op-generos", "generos"], ["op-zona", "zona"], ["op-sitio", "sitio"]].forEach(([id, clave]) => {
    $(id).addEventListener("change", () => {
      grupo().opciones[clave] = $(id).checked;
      guardar();
      pintarCondiciones();
      pintarAula();
      pintarResumenNiveles();
    });
  });
  $("op-memoria").addEventListener("change", () => {
    grupo().opciones.memoria = Number($("op-memoria").value);
    guardar();
  });

  // ---------------- Historial ----------------
  function pintarHistorial() {
    const g = grupo();
    el.historial.innerHTML = "";
    if (!g.historial.length) el.historial.appendChild(crear("p", "ayuda", "Todavía no hay distribuciones guardadas."));
    g.historial
      .slice()
      .reverse()
      .forEach((e) => {
        const fila = crear("div", "entrada");
        const texto = crear("div", "entrada-texto");
        texto.appendChild(crear("strong", "", e.nombre));
        const d = g.disposiciones.find((x) => x.id === e.dispId);
        const plano = d ? d.nombre : (e.plano && e.plano.nombre ? e.plano.nombre + " (borrada)" : "agrupación borrada");
        texto.appendChild(crear("small", "", textoFecha(e.fecha) + " · " + plano + " · " + Object.keys(e.asignacion || {}).length + " alumnos"));
        const usar = crear("button", "btn", "Volver a usar");
        usar.type = "button";
        usar.addEventListener("click", () => reutilizar(e));
        const borrar = crear("button", "btn btn-peligro", "Borrar");
        borrar.type = "button";
        borrar.addEventListener("click", () => {
          if (!window.confirm("¿Borrar «" + e.nombre + "» del historial? Dejará de contar para no repetir compañeros.")) return;
          g.historial = g.historial.filter((x) => x !== e);
          guardar();
          pintarHistorial();
          pintarAula();
        });
        fila.append(texto, usar, borrar);
        el.historial.appendChild(fila);
      });

    // Parejas que más veces han compartido mesa en todo el historial.
    const cuenta = new Map();
    g.historial.forEach((e) =>
      (e.pares || []).forEach(([a, b, w]) => {
        if (w < 1 || g.alumnos.indexOf(a) === -1 || g.alumnos.indexOf(b) === -1) return;
        const k = [a, b].sort().join(" y ");
        cuenta.set(k, (cuenta.get(k) || 0) + 1);
      })
    );
    const top = Array.from(cuenta.entries())
      .filter(([, n]) => n > 1)
      .sort((x, y) => y[1] - x[1])
      .slice(0, 10);
    el.repetidos.textContent = top.length
      ? top.map(([k, n]) => k + " (" + n + " veces)").join(" · ")
      : g.historial.length
      ? "Ninguna pareja ha compartido mesa más de una vez."
      : "";
  }

  function reutilizar(e) {
    const g = grupo();
    let d = g.disposiciones.find((x) => x.id === e.dispId);
    if (!d) {
      // La agrupación se borró: se recupera de la copia guardada.
      if (!e.plano) {
        window.alert("La agrupación de mesas de esa distribución ya no existe.");
        return;
      }
      d = { id: "d" + g.sig++, nombre: (e.plano.nombre + " (recuperada)").slice(0, 40), cols: e.plano.cols, rows: e.plano.rows, bloques: e.plano.bloques.map((b) => Object.assign({}, b)), fijos: {}, sig: 1, docente: e.plano.docente || "derecha" };
      d.sig = d.bloques.reduce((m, b) => Math.max(m, Number(String(b.id).slice(1)) || 0), 0) + 1;
      g.disposiciones.push(d);
      e.dispId = d.id;
    }
    if (g.borrador && !window.confirm("Se sustituirá la distribución sin guardar. ¿Seguir?")) return;
    g.dispActual = d.id;
    g.borrador = { dispId: d.id, asignacion: Object.assign({}, e.asignacion) };
    seleccion = null;
    guardar();
    pintarTodo();
    $("aula").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  $("btn-exportar").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ app: "sitios-de-clase", version: 1, datos: cfg }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sitios-de-clase-" + hoy() + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  $("importar-archivo").addEventListener("change", (e) => {
    const archivo = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => {
      try {
        const datos = JSON.parse(lector.result);
        const nuevo = datos && datos.app === "sitios-de-clase" ? datos.datos : null;
        if (!nuevo || !Array.isArray(nuevo.grupos) || !nuevo.grupos.length) throw new Error("formato");
        if (!window.confirm("¿Sustituir todas las clases, mesas e historial de este equipo por los de la copia?")) return;
        H.guardar(CLAVE, nuevo);
        location.reload();
      } catch (err) {
        window.alert("Ese archivo no es una copia de Sitios de clase.");
      }
    };
    lector.readAsText(archivo);
  });

  // ---------------- Paneles ----------------
  H.conmutador($("btn-alumnado"), $("panel-alumnado"));
  H.conmutador($("btn-condiciones"), $("panel-condiciones"));
  H.conmutador($("btn-mesas"), $("panel-mesas"));
  H.conmutador($("btn-historial"), $("panel-historial"));

  function pintarTodo() {
    pintarGrupos();
    pintarAlumnado();
    pintarCondiciones();
    pintarDisposiciones();
    pintarEditor();
    pintarAula();
    pintarHistorial();
  }

  pintarTodo();
  if (!grupo().alumnos.length) $("btn-alumnado").click();
})();
