// ============================================================
// Cuaderno de evaluación (5.º C): notas, dificultades por contenido
// y anotaciones de cada prueba, por número de lista (1-25).
//
// Datos en Firestore, solo legibles por la cuenta de docente que los
// crea (ver «Cuaderno de evaluación» en firestore.rules):
//   cuadernoEval/{uid}                -> registro de pruebas editado y
//                                         fecha de la última copia
//   cuadernoEval/{uid}/alumnos/{1-25} -> perfil, notas, dificultades,
//                                         anotaciones y medidas
//
// Consumo (plan Spark): al abrir la página se leen como mucho 26
// documentos con lecturas puntuales (sin onSnapshot). Los cambios se
// agrupan 1,5 s y se escriben en un único writeBatch con solo los
// alumnos tocados: corregir un examen de toda la clase son del orden
// de 100-200 escrituras, muy lejos de las 20.000 diarias.
//
// La copia .json (pestaña «Copia de seguridad») sigue existiendo como
// respaldo propio, fuera de Firebase.
//
// Registro de contenidos y criterios de cada prueba: js/pruebas.js.
// ============================================================
import { db, auth } from "../../js/firebase-init.js";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  writeBatch,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

(function () {
  "use strict";

  var CLAVE = "ar_cuaderno_evaluacion_v1";
  var N_ALUMNOS = 25;
  var DIAS_AVISO_COPIA = 30;
  var ESPERA_GUARDADO = 1500;

  var PERFIL = [
    { id: "acs_lengua", label: "ACS Lengua" },
    { id: "acs_mates", label: "ACS Matemáticas" },
    { id: "acns", label: "ACNS" },
    { id: "refuerzo", label: "Programa de refuerzo" },
    { id: "pt", label: "PT" },
    { id: "al", label: "AL" },
  ];
  var ESTADOS = [
    { v: 0, corto: "Bien", label: "Sin dificultad" },
    { v: 1, corto: "Parcial", label: "Dificultad parcial" },
    { v: 2, corto: "Dificultad", label: "Dificultad" },
  ];
  var VERSIONES = { ordinaria: "Ordinaria", acs: "Adaptada (ACS)" };

  // ---------------- Datos ----------------

  function estadoInicial() {
    var s = { version: 1, alumnos: {}, registros: {}, plantillas: {}, medidas: {}, ultimaCopia: null };
    // Indicado por el docente: la alumna n.º 17 sigue una ACS en las dos áreas.
    s.alumnos["17"] = { activo: true, perfil: { acs_lengua: true, acs_mates: true } };
    return s;
  }

  function completar(s) {
    s.alumnos = s.alumnos || {};
    s.registros = s.registros || {};
    s.plantillas = s.plantillas || {};
    s.medidas = s.medidas || {};
    return s;
  }

  var avisoAlmacen = "";
  var S = estadoInicial();
  var UID = null;
  var pendientes = {};
  var temporizador = null;
  var guardando = false;

  function base() {
    return doc(db, "cuadernoEval", UID);
  }

  async function cargarNube() {
    var b = base();
    var res = await Promise.all([getDoc(b), getDocs(collection(b, "alumnos"))]);
    var s = estadoInicial();
    if (res[0].exists()) {
      var m = res[0].data();
      s.plantillas = m.plantillas || {};
      s.ultimaCopia = m.ultimaCopia || null;
    }
    res[1].forEach(function (d) {
      var x = d.data();
      s.alumnos[d.id] = { activo: x.activo !== false, perfil: x.perfil || {} };
      if (x.registros) s.registros[d.id] = x.registros;
      if (x.medidas) s.medidas[d.id] = x.medidas;
    });
    return s;
  }

  // que: número de alumno, o "meta" para el registro de pruebas.
  function guardar(que) {
    pendientes[String(que)] = true;
    estadoGuardado("Guardando…");
    clearTimeout(temporizador);
    temporizador = setTimeout(guardarYa, ESPERA_GUARDADO);
  }
  function guardarTodo() {
    pendientes.meta = true;
    for (var n = 1; n <= N_ALUMNOS; n++) pendientes[n] = true;
    return guardarYa();
  }
  function docAlumno(k) {
    var a = alumno(k);
    return {
      activo: a.activo !== false,
      perfil: a.perfil,
      registros: S.registros[k] || {},
      medidas: S.medidas[k] || [],
      actualizado: serverTimestamp(),
    };
  }
  async function guardarYa() {
    clearTimeout(temporizador);
    temporizador = null;
    var claves = Object.keys(pendientes);
    if (!claves.length || !UID) return;
    pendientes = {};
    var lote = writeBatch(db);
    claves.forEach(function (k) {
      if (k === "meta") lote.set(base(), { plantillas: S.plantillas, ultimaCopia: S.ultimaCopia || null, actualizado: serverTimestamp() });
      else lote.set(doc(base(), "alumnos", k), docAlumno(k));
    });
    guardando = true;
    if (!navigator.onLine) estadoGuardado("Sin conexión: guardado en este equipo, se subirá al volver la red");
    try {
      await lote.commit();
      guardando = false;
      if (!temporizador) estadoGuardado("Guardado");
      if (avisoAlmacen) { avisoAlmacen = ""; pintarAvisos(); }
    } catch (e) {
      guardando = false;
      claves.forEach(function (k) { pendientes[k] = true; });
      estadoGuardado("Sin guardar");
      avisoAlmacen = "No se ha podido guardar en Firestore (" + (e.code || e.message) + "). Si dice «permission-denied», falta publicar las reglas nuevas de firestore.rules en la consola de Firebase.";
      pintarAvisos();
    }
  }
  function estadoGuardado(t) {
    var el = document.getElementById("estado-guardado");
    if (el) el.textContent = t;
  }
  window.addEventListener("beforeunload", function (e) {
    if (temporizador) guardarYa();
    if (temporizador || guardando || Object.keys(pendientes).length) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  function alumno(n) {
    var k = String(n);
    if (!S.alumnos[k]) S.alumnos[k] = { activo: true, perfil: {} };
    if (!S.alumnos[k].perfil) S.alumnos[k].perfil = {};
    return S.alumnos[k];
  }
  function activos() {
    var r = [];
    for (var n = 1; n <= N_ALUMNOS; n++) if (alumno(n).activo !== false) r.push(n);
    return r;
  }
  function leerReg(n, area, pn) {
    var a = S.registros[n];
    return (a && a[area] && a[area][pn]) || null;
  }
  function reg(n, area, pn) {
    var a = (S.registros[n] = S.registros[n] || {});
    var b = (a[area] = a[area] || {});
    return (b[pn] = b[pn] || { items: {} });
  }
  function prueba(area, pn) {
    return CE_PRUEBAS[area][pn - 1];
  }
  function claveP(area, pn, version) {
    return area + "-" + pn + "-" + version;
  }
  function plantilla(area, pn, version) {
    var o = S.plantillas[claveP(area, pn, version)];
    if (o && o.items) return o.items;
    return prueba(area, pn)[version] || [];
  }
  function metaPrueba(area, pn) {
    var p = prueba(area, pn);
    var o = S.plantillas[area + "-" + pn + "-meta"] || {};
    return { titulo: o.titulo || p.titulo, fecha: o.fecha != null ? o.fecha : p.fecha, fuente: o.fuente || p.fuente };
  }
  function versionDe(n, area, pn) {
    var r = leerReg(n, area, pn);
    if (r && r.version) return r.version;
    return alumno(n).perfil["acs_" + area] ? "acs" : "ordinaria";
  }
  function num(v) {
    if (v === null || v === undefined || v === "") return null;
    var x = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
    return isFinite(x) ? x : null;
  }
  // Nota que cuenta: la mayor entre la original y la recuperación.
  function notaEfectiva(r, conRecuperacion) {
    if (!r || r.np) return null;
    var a = num(r.nota), b = conRecuperacion === false ? null : num(r.recuperacion);
    if (a === null) return b;
    if (b === null) return a;
    return Math.max(a, b);
  }
  function itemsMarcados(r) {
    if (!r || !r.items) return 0;
    var c = 0;
    for (var k in r.items) if (r.items[k] > 0) c++;
    return c;
  }
  function evaluado(r) {
    return !!r && !r.np && (num(r.nota) !== null || itemsMarcados(r) > 0);
  }
  function media(lista) {
    var v = lista.filter(function (x) { return x !== null; });
    if (!v.length) return null;
    return v.reduce(function (a, b) { return a + b; }, 0) / v.length;
  }
  function pruebasDeTrimestre(t) {
    return t ? [3 * t - 2, 3 * t - 1, 3 * t] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }
  function mediaPeriodo(n, area, t, conRec) {
    return media(pruebasDeTrimestre(t).map(function (pn) { return notaEfectiva(leerReg(n, area, pn), conRec); }));
  }
  function fmt(x) {
    if (x === null || x === undefined) return "";
    return (Math.round(x * 100) / 100).toLocaleString("es-ES", { maximumFractionDigits: 2 });
  }
  function nivelNota(x) {
    if (x === null) return "";
    if (x < 5) return "nota-insuf";
    if (x < 7) return "nota-suf";
    return "nota-bien";
  }
  function etiquetaPrueba(p) {
    return "T" + p.trimestre + " · B" + p.bloque;
  }
  function etiquetaEje(area, id) {
    var e = CE_EJES[area].filter(function (x) { return x.id === id; })[0];
    return e ? e.label : id;
  }
  function fechaLarga(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T12:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  }
  // Dificultades de un registro: [{item, estado}]
  function dificultades(n, area, pn) {
    var r = leerReg(n, area, pn);
    if (!r || r.np) return [];
    var v = versionDe(n, area, pn);
    return plantilla(area, pn, v)
      .filter(function (it) { return r.items && r.items[it.id] > 0; })
      .map(function (it) { return { item: it, estado: r.items[it.id], version: v }; });
  }
  function hayDatos() {
    for (var n in S.registros) for (var a in S.registros[n]) for (var p in S.registros[n][a]) {
      var r = S.registros[n][a][p];
      if (num(r.nota) !== null || itemsMarcados(r) || r.notas) return true;
    }
    return false;
  }

  // ---------------- Utilidades de DOM ----------------

  function h(tag, attrs, hijos) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
      else if (v === true) el.setAttribute(k, "");
      else el.setAttribute(k, v);
    }
    (hijos || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return el;
  }
  function vaciar(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
    return el;
  }
  function opciones(sel, lista, actual) {
    lista.forEach(function (o) {
      var op = h("option", { value: o.v, text: o.t });
      if (String(o.v) === String(actual)) op.selected = true;
      sel.appendChild(op);
    });
    return sel;
  }
  function selectArea(actual, onchange, conAmbas) {
    var l = CE_AREAS.map(function (a) { return { v: a.id, t: a.label }; });
    if (conAmbas) l.unshift({ v: "ambas", t: "Lengua y Matemáticas" });
    return opciones(h("select", { class: "campo", onchange: onchange }), l, actual);
  }
  function selectPrueba(area, actual, onchange) {
    var a = area === "ambas" ? "lengua" : area;
    return opciones(h("select", { class: "campo", onchange: onchange }), CE_PRUEBAS[a].map(function (p) {
      return { v: p.n, t: etiquetaPrueba(p) + " · " + metaPrueba(a, p.n).titulo };
    }), actual);
  }
  function areasDe(sel) {
    return sel === "ambas" ? ["lengua", "mates"] : [sel];
  }
  function nombreArea(id) {
    return id === "lengua" ? "Lengua" : "Matemáticas";
  }
  function badgesPerfil(n) {
    var p = alumno(n).perfil;
    return PERFIL.filter(function (x) { return p[x.id]; }).map(function (x) {
      return h("span", { class: "badge", text: x.label });
    });
  }

  // ---------------- Estado de la interfaz ----------------

  var UI = {
    vista: "individual",
    alumno: 1,
    area: "lengua",
    grupoArea: "lengua",
    grupoPrueba: 1,
    susArea: "ambas",
    susCriterio: "prueba",
    susPrueba: 1,
    susTrimestre: 1,
    susRec: true,
    resSel: {},
    resArea: "ambas",
    resPeriodo: 0,
    resNotas: true,
    resMedidas: true,
    resPagina: false,
    plArea: "lengua",
    plPrueba: 1,
    plVersion: "ordinaria",
  };
  try {
    var u = JSON.parse(localStorage.getItem(CLAVE + "_ui") || "null");
    if (u) ["vista", "alumno", "area", "grupoArea", "grupoPrueba"].forEach(function (k) { if (u[k] !== undefined) UI[k] = u[k]; });
  } catch (e) { /* preferencias de vista: opcionales */ }
  function recordarUI() {
    try {
      localStorage.setItem(CLAVE + "_ui", JSON.stringify({ vista: UI.vista, alumno: UI.alumno, area: UI.area, grupoArea: UI.grupoArea, grupoPrueba: UI.grupoPrueba }));
    } catch (e) { /* sin importancia */ }
  }

  var main = document.getElementById("vista");

  function irA(vista) {
    UI.vista = vista;
    recordarUI();
    document.querySelectorAll(".pestana").forEach(function (b) {
      var act = b.getAttribute("data-vista") === vista;
      b.classList.toggle("activa", act);
      b.setAttribute("aria-selected", act ? "true" : "false");
    });
    pintar();
  }
  document.querySelectorAll(".pestana").forEach(function (b) {
    b.addEventListener("click", function () { irA(b.getAttribute("data-vista")); });
  });

  function pintar() {
    pintarAvisos();
    vaciar(main);
    ({ individual: vistaIndividual, grupo: vistaGrupo, suspensos: vistaSuspensos, resumen: vistaResumen, pruebas: vistaPruebas, copia: vistaCopia })[UI.vista]();
    window.scrollTo(0, 0);
  }

  function pintarAvisos() {
    var caja = vaciar(document.getElementById("avisos"));
    if (avisoAlmacen) caja.appendChild(h("p", { class: "aviso aviso-error", role: "alert", text: avisoAlmacen }));
    if (hayDatos()) {
      var dias = S.ultimaCopia ? (Date.now() - new Date(S.ultimaCopia).getTime()) / 864e5 : Infinity;
      if (dias > DIAS_AVISO_COPIA) {
        caja.appendChild(h("p", { class: "aviso" }, [
          S.ultimaCopia ? "Hace más de " + DIAS_AVISO_COPIA + " días que no descargas una copia de seguridad. " : "Todavía no has descargado ninguna copia de seguridad. ",
          "Firebase gratuito no guarda copias por ti: conviene tener una tuya en la unidad del centro. ",
          h("button", { type: "button", class: "btn-enlace", text: "Descargar copia ahora", onclick: exportar }),
        ]));
      }
    }
  }

  // ---------------- Vista individual ----------------

  function vistaIndividual() {
    var n = UI.alumno;
    var al = alumno(n);

    var rejilla = h("div", { class: "rejilla-alumnos", role: "group", "aria-label": "Elegir alumno" });
    for (var i = 1; i <= N_ALUMNOS; i++) (function (k) {
      var a = alumno(k);
      var sus = ["lengua", "mates"].some(function (ar) {
        return pruebasDeTrimestre(0).some(function (pn) { var x = notaEfectiva(leerReg(k, ar, pn)); return x !== null && x < 5; });
      });
      var b = h("button", {
        type: "button",
        class: "chip-alumno" + (k === n ? " activo" : "") + (a.activo === false ? " inactivo" : ""),
        "aria-pressed": k === n ? "true" : "false",
        title: "Alumno/a n.º " + k + (sus ? " · tiene alguna prueba por debajo de 5" : ""),
        onclick: function () { UI.alumno = k; recordarUI(); pintar(); },
      }, [String(k), sus ? h("span", { class: "punto-sus", "aria-hidden": "true" }) : null, (a.perfil.acs_lengua || a.perfil.acs_mates) ? h("span", { class: "mini-acs", text: "A" }) : null]);
      rejilla.appendChild(b);
    })(i);

    main.appendChild(h("section", { class: "tarjeta" }, [
      h("div", { class: "fila-titulo" }, [
        h("h2", { text: "Alumno/a n.º " + n }),
        h("div", { class: "acciones" }, [
          h("button", { type: "button", class: "btn", disabled: n <= 1, text: "← Anterior", onclick: function () { UI.alumno = n - 1; recordarUI(); pintar(); } }),
          h("button", { type: "button", class: "btn", disabled: n >= N_ALUMNOS, text: "Siguiente →", onclick: function () { UI.alumno = n + 1; recordarUI(); pintar(); } }),
        ]),
      ]),
      rejilla,
      h("p", { class: "leyenda-mini" }, [h("span", { class: "punto-sus", "aria-hidden": "true" }), " alguna prueba por debajo de 5 · ", h("span", { class: "mini-acs", text: "A" }), " con ACS"]),
    ]));

    // Perfil
    var perfil = h("div", { class: "perfil" });
    PERFIL.forEach(function (p) {
      perfil.appendChild(h("label", { class: "check" }, [
        h("input", { type: "checkbox", checked: !!al.perfil[p.id], onchange: function (e) { al.perfil[p.id] = e.target.checked; guardar(n); pintar(); } }),
        " " + p.label,
      ]));
    });
    perfil.appendChild(h("label", { class: "check check-inactivo" }, [
      h("input", { type: "checkbox", checked: al.activo === false, onchange: function (e) { al.activo = !e.target.checked; guardar(n); pintar(); } }),
      " Número sin alumno (no sale en grupo ni en resúmenes)",
    ]));
    main.appendChild(h("section", { class: "tarjeta" }, [
      h("h3", { text: "Perfil y medidas de atención a la diversidad" }),
      perfil,
      h("p", { class: "nota-pie", text: "Con ACS marcada en un área, sus pruebas se registran con la versión adaptada. No escribas aquí ni en las anotaciones nombres ni diagnósticos." }),
    ]));

    // Gráfica
    var cajaGrafica = h("section", { class: "tarjeta", id: "caja-grafica" });
    main.appendChild(cajaGrafica);
    pintarGrafica(cajaGrafica, n);

    // Pruebas por área
    var tabs = h("div", { class: "seg", role: "tablist", "aria-label": "Área" });
    CE_AREAS.forEach(function (a) {
      tabs.appendChild(h("button", {
        type: "button", role: "tab", class: "seg-btn" + (UI.area === a.id ? " activo" : ""), "aria-selected": UI.area === a.id ? "true" : "false",
        text: a.label, onclick: function () { UI.area = a.id; recordarUI(); pintar(); },
      }));
    });
    var lista = h("div", { class: "lista-pruebas" });
    CE_PRUEBAS[UI.area].forEach(function (p) { lista.appendChild(tarjetaPrueba(n, UI.area, p)); });
    main.appendChild(h("section", { class: "tarjeta" }, [
      h("div", { class: "fila-titulo" }, [h("h3", { text: "Pruebas y dificultades" }), tabs]),
      lista,
    ]));

    // Medidas
    main.appendChild(tarjetaMedidas(n));
  }

  function resumenNotaPrueba(n, area, pn) {
    var r = leerReg(n, area, pn);
    if (r && r.np) return h("span", { class: "pill pill-np", text: "NP" });
    var x = notaEfectiva(r);
    var marc = itemsMarcados(r);
    var hijos = [];
    if (x !== null) hijos.push(h("span", { class: "pill " + nivelNota(x), text: fmt(x) + (r && num(r.recuperacion) !== null && num(r.recuperacion) >= num(r.nota) ? " (rec.)" : "") }));
    else hijos.push(h("span", { class: "pill pill-vacia", text: "Sin nota" }));
    if (marc) hijos.push(h("span", { class: "pill pill-dif", text: marc + (marc === 1 ? " dificultad" : " dificultades") }));
    if (versionDe(n, area, pn) === "acs") hijos.push(h("span", { class: "pill pill-acs", text: "ACS" }));
    return h("span", { class: "resumen-pills" }, hijos);
  }

  function tarjetaPrueba(n, area, p) {
    var pn = p.n;
    var meta = metaPrueba(area, pn);
    var pills = h("span", {}, [resumenNotaPrueba(n, area, pn)]);
    function refrescar() {
      vaciar(pills).appendChild(resumenNotaPrueba(n, area, pn));
      var g = document.getElementById("caja-grafica");
      if (g) pintarGrafica(g, n);
    }
    var cuerpo = h("div", { class: "prueba-cuerpo" });
    var det = h("details", { class: "prueba", "data-pn": pn }, [
      h("summary", {}, [
        h("span", { class: "prueba-etq", text: etiquetaPrueba(p) }),
        h("span", { class: "prueba-tit" }, [meta.titulo, meta.fecha ? h("small", { text: " · " + fechaLarga(meta.fecha) }) : null]),
        pills,
      ]),
      cuerpo,
    ]);
    // Se construye al abrir: 18 tarjetas con sus tablas de golpe sobran.
    det.addEventListener("toggle", function () {
      if (det.open && !cuerpo.firstChild) construirCuerpo();
    });

    function construirCuerpo() {
      var r0 = leerReg(n, area, pn) || {};
      var version = versionDe(n, area, pn);
      var items = plantilla(area, pn, version);

      function campoNota(clave, etiqueta, ayuda) {
        var id = "f-" + area + pn + clave;
        return h("div", { class: "campo-grupo" }, [
          h("label", { for: id, text: etiqueta }),
          h("input", {
            id: id, type: "number", inputmode: "decimal", min: "0", max: "10", step: "0.05", class: "campo campo-nota",
            value: r0[clave] !== undefined && r0[clave] !== null ? r0[clave] : "", title: ayuda || null,
            oninput: function (e) {
              var v = num(e.target.value);
              if (v !== null && (v < 0 || v > 10)) { e.target.setCustomValidity("Entre 0 y 10"); e.target.reportValidity(); return; }
              e.target.setCustomValidity("");
              reg(n, area, pn)[clave] = v;
              guardar(n); refrescar();
            },
          }),
        ]);
      }

      var selVersion = opciones(h("select", {
        id: "v-" + area + pn, class: "campo",
        onchange: function (e) { reg(n, area, pn).version = e.target.value; guardar(n); vaciar(cuerpo); construirCuerpo(); refrescar(); },
      }), [{ v: "ordinaria", t: VERSIONES.ordinaria }, { v: "acs", t: VERSIONES.acs }], version);

      cuerpo.appendChild(h("div", { class: "campos" }, [
        h("div", { class: "campo-grupo" }, [h("label", { for: "v-" + area + pn, text: "Versión" }), selVersion]),
        campoNota("nota", "Nota del examen"),
        campoNota("recuperacion", "Recuperación", "Si la hay. Cuenta la mayor de las dos."),
        campoNota("reto", "Reto / producto final", "Opcional. No entra en la media del examen."),
        h("label", { class: "check check-np" }, [
          h("input", { type: "checkbox", checked: !!r0.np, onchange: function (e) { reg(n, area, pn).np = e.target.checked; guardar(n); refrescar(); } }),
          " No presentado",
        ]),
      ]));

      if (meta.fuente === "provisional") {
        cuerpo.appendChild(h("p", { class: "aviso aviso-suave", text: "Registro provisional, sacado de la programación: ajústalo en la pestaña «Pruebas» cuando tengas el examen." }));
      }
      if (!items.length) {
        cuerpo.appendChild(h("p", { class: "aviso aviso-suave", text: "Esta versión aún no tiene registro de contenidos. Créalo en la pestaña «Pruebas» (o envía el examen para añadirlo)." }));
      } else {
        var tabla = h("table", { class: "tabla-items" }, [
          h("thead", {}, [h("tr", {}, [h("th", { text: "Preg." }), h("th", { text: "Contenido" }), h("th", { class: "col-eje", text: "Eje" }), h("th", { text: "¿Dificultad?" })])]),
        ]);
        var tb = h("tbody");
        items.forEach(function (it) {
          var actual = (r0.items && r0.items[it.id]) || 0;
          var grupo = h("div", { class: "tri", role: "radiogroup", "aria-label": "Dificultad en: " + it.contenido });
          ESTADOS.forEach(function (es) {
            var idr = "r-" + area + pn + "-" + it.id + "-" + es.v;
            grupo.appendChild(h("input", {
              type: "radio", id: idr, name: "r-" + area + pn + "-" + it.id, value: es.v, checked: actual === es.v, class: "tri-in tri-" + es.v,
              onchange: function () {
                var rr = reg(n, area, pn);
                rr.items = rr.items || {};
                if (es.v) rr.items[it.id] = es.v; else delete rr.items[it.id];
                guardar(n); refrescar();
              },
            }));
            grupo.appendChild(h("label", { for: idr, class: "tri-lab tri-lab-" + es.v, title: es.label, text: es.corto }));
          });
          tb.appendChild(h("tr", {}, [
            h("td", { class: "col-preg", text: it.pregunta || "·" }),
            h("td", {}, [it.contenido, chipsCriterios(area, it.criterios)]),
            h("td", { class: "col-eje", text: etiquetaEje(area, it.eje) }),
            h("td", {}, [grupo]),
          ]));
        });
        tabla.appendChild(tb);
        cuerpo.appendChild(h("div", { class: "tabla-scroll" }, [tabla]));
      }

      var idn = "n-" + area + pn;
      cuerpo.appendChild(h("div", { class: "campo-grupo campo-ancho" }, [
        h("label", { for: idn, text: "Anotaciones de esta prueba / SdA" }),
        h("textarea", {
          id: idn, class: "campo", rows: "3", placeholder: "Qué has observado, qué medida vas a aplicar…",
          oninput: function (e) { reg(n, area, pn).notas = e.target.value; guardar(n); },
        }, [r0.notas || ""]),
      ]));
    }
    return det;
  }

  function tarjetaMedidas(n) {
    var lista = (S.medidas[n] = S.medidas[n] || []);
    var caja = h("section", { class: "tarjeta" }, [
      h("h3", { text: "Medidas aplicadas y su resultado" }),
      h("p", { class: "nota-pie", text: "Refuerzo, cambio de sitio, material adaptado, tutoría con la familia… Anota si funcionó: es lo que te pedirán en el programa de refuerzo y en las reuniones del equipo docente." }),
    ]);
    var tabla = h("table", { class: "tabla-simple" }, [h("thead", {}, [h("tr", {}, ["Fecha", "Área", "Medida", "Resultado", ""].map(function (t) { return h("th", { text: t }); }))])]);
    var tb = h("tbody");
    lista.slice().sort(function (a, b) { return (b.fecha || "").localeCompare(a.fecha || ""); }).forEach(function (m) {
      tb.appendChild(h("tr", {}, [
        h("td", { text: fechaLarga(m.fecha) }),
        h("td", { text: m.area === "ambas" ? "Ambas" : nombreArea(m.area) }),
        h("td", { text: m.medida }),
        h("td", { text: m.resultado || "—" }),
        h("td", {}, [h("button", {
          type: "button", class: "btn-enlace", text: "Borrar",
          onclick: function () { if (confirm("¿Borrar esta medida?")) { lista.splice(lista.indexOf(m), 1); guardar(n); pintar(); } },
        })]),
      ]));
    });
    if (!lista.length) tb.appendChild(h("tr", {}, [h("td", { colspan: "5", class: "vacio", text: "Sin medidas registradas." })]));
    tabla.appendChild(tb);
    caja.appendChild(h("div", { class: "tabla-scroll" }, [tabla]));

    var fF = h("input", { type: "date", class: "campo", value: new Date().toISOString().slice(0, 10), "aria-label": "Fecha" });
    var fA = selectArea("ambas", null, true);
    fA.setAttribute("aria-label", "Área");
    var fM = h("input", { type: "text", class: "campo", placeholder: "Medida", "aria-label": "Medida", required: true });
    var fR = h("input", { type: "text", class: "campo", placeholder: "Resultado (puedes dejarlo para después)", "aria-label": "Resultado" });
    caja.appendChild(h("form", {
      class: "form-medida",
      onsubmit: function (e) {
        e.preventDefault();
        if (!fM.value.trim()) return;
        lista.push({ fecha: fF.value, area: fA.value, medida: fM.value.trim(), resultado: fR.value.trim() });
        guardar(n); pintar();
      },
    }, [fF, fA, fM, fR, h("button", { type: "submit", class: "btn btn-primario", text: "Añadir" })]));
    return caja;
  }

  // ---------------- Gráfica de avance ----------------

  var SVGNS = "http://www.w3.org/2000/svg";
  function s(tag, attrs, hijos) {
    var el = document.createElementNS(SVGNS, tag);
    for (var k in attrs || {}) if (attrs[k] !== null && attrs[k] !== undefined) el.setAttribute(k, attrs[k]);
    (hijos || []).forEach(function (c) { if (c) el.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return el;
  }

  function pintarGrafica(caja, n) {
    vaciar(caja);
    caja.appendChild(h("div", { class: "fila-titulo" }, [
      h("h3", { text: "Avance durante el curso" }),
      h("div", { class: "leyenda", "aria-hidden": "true" }, [
        h("span", { class: "ley ley-lengua", text: "Lengua" }),
        h("span", { class: "ley ley-mates", text: "Matemáticas" }),
        h("span", { class: "ley ley-hueca", text: "Prueba adaptada" }),
      ]),
    ]));

    var W = 720, H = 250, mL = 34, mR = 92, mT = 14, mB = 40;
    var pw = W - mL - mR, ph = H - mT - mB;
    function X(pn) { return mL + (pn - 1) * (pw / 8); }
    function Y(v) { return mT + ph - (v / 10) * ph; }

    var svg = s("svg", { viewBox: "0 0 " + W + " " + H, class: "grafica", role: "img", "aria-label": "Notas de Lengua y Matemáticas del alumno/a " + n + " en las 9 pruebas del curso" });
    [0, 2.5, 5, 7.5, 10].forEach(function (v) {
      svg.appendChild(s("line", { x1: mL, x2: mL + pw, y1: Y(v), y2: Y(v), class: v === 5 ? "g-aprobado" : "g-rejilla" }));
      if (v % 5 === 0) svg.appendChild(s("text", { x: mL - 8, y: Y(v) + 4, class: "g-eje", "text-anchor": "end" }, [String(v)]));
    });
    svg.appendChild(s("text", { x: mL + pw + 6, y: Y(5) + 4, class: "g-eje" }, ["aprobado"]));
    for (var t = 1; t <= 3; t++) {
      if (t > 1) svg.appendChild(s("line", { x1: X(3 * t - 2) - pw / 16, x2: X(3 * t - 2) - pw / 16, y1: mT, y2: mT + ph, class: "g-sep" }));
      svg.appendChild(s("text", { x: X(3 * t - 1), y: H - 6, class: "g-eje g-trim", "text-anchor": "middle" }, [t + ".º trimestre"]));
    }
    for (var pn = 1; pn <= 9; pn++) svg.appendChild(s("text", { x: X(pn), y: mT + ph + 16, class: "g-eje", "text-anchor": "middle" }, ["B" + (((pn - 1) % 3) + 1)]));

    var datos = { lengua: [], mates: [] };
    var hayAlgo = false;
    ["lengua", "mates"].forEach(function (area) {
      var puntos = [];
      for (var pn = 1; pn <= 9; pn++) {
        var v = notaEfectiva(leerReg(n, area, pn));
        datos[area].push(v);
        if (v !== null) { puntos.push({ pn: pn, v: v, acs: versionDe(n, area, pn) === "acs" }); hayAlgo = true; }
      }
      if (puntos.length > 1) {
        svg.appendChild(s("polyline", { points: puntos.map(function (p) { return X(p.pn) + "," + Y(p.v); }).join(" "), class: "g-linea g-" + area }));
      }
      puntos.forEach(function (p) {
        var g = s("g", { class: "g-punto", tabindex: "0" });
        var tip = nombreArea(area) + " · " + etiquetaPrueba(prueba(area, p.pn)) + ": " + fmt(p.v) + (p.acs ? " (prueba adaptada)" : "");
        g.appendChild(s("title", {}, [tip]));
        g.appendChild(s("circle", { cx: X(p.pn), cy: Y(p.v), r: 14, class: "g-hit" }));
        if (area === "lengua") g.appendChild(s("circle", { cx: X(p.pn), cy: Y(p.v), r: 5, class: "g-m g-" + area + (p.acs ? " g-hueco" : "") }));
        else g.appendChild(s("rect", { x: X(p.pn) - 5, y: Y(p.v) - 5, width: 10, height: 10, rx: 1.5, class: "g-m g-" + area + (p.acs ? " g-hueco" : "") }));
        svg.appendChild(g);
      });
      var ult = puntos[puntos.length - 1];
      if (ult) svg.appendChild(s("text", { x: X(ult.pn) + 10, y: Y(ult.v) + (area === "lengua" ? -6 : 14), class: "g-etq" }, [nombreArea(area) + " " + fmt(ult.v)]));
    });
    caja.appendChild(h("div", { class: "grafica-caja" }, [svg]));
    if (!hayAlgo) caja.appendChild(h("p", { class: "vacio", text: "Aún no hay notas para dibujar." }));

    // Tabla equivalente (accesible y para comprobar los datos).
    var tabla = h("table", { class: "tabla-simple tabla-centrada" }, [
      h("thead", {}, [h("tr", {}, [h("th", { text: "" })].concat([1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (pn) { return h("th", { text: "T" + Math.ceil(pn / 3) + "·B" + (((pn - 1) % 3) + 1) }); })))]),
      h("tbody", {}, ["lengua", "mates"].map(function (area) {
        return h("tr", {}, [h("th", { text: nombreArea(area) })].concat(datos[area].map(function (v) { return h("td", { class: nivelNota(v), text: v === null ? "—" : fmt(v) }); })));
      })),
    ]);
    caja.appendChild(h("details", { class: "ver-datos" }, [h("summary", { text: "Ver los datos en tabla" }), h("div", { class: "tabla-scroll" }, [tabla])]));

    // Dificultades por eje: lo comparable entre pruebas distintas.
    caja.appendChild(h("h4", { text: "Dificultades por eje (" + nombreArea(UI.area) + ")" }));
    caja.appendChild(h("p", { class: "nota-pie", text: "Porcentaje de contenidos de cada eje marcados con dificultad en cada prueba (la parcial cuenta la mitad). Las notas comparan exámenes de contenidos distintos; esto muestra si una destreza concreta mejora o empeora. Cambia de área en «Pruebas y dificultades»." }));
    caja.appendChild(mapaEjes(n, UI.area));

    caja.appendChild(h("h4", { text: "Logro por criterio de evaluación (" + nombreArea(UI.area) + ", exámenes)" }));
    caja.appendChild(h("p", { class: "nota-pie", text: "Porcentaje de las preguntas vinculadas a cada criterio de 5.º que salen sin dificultad (la parcial cuenta la mitad). Es una evidencia más para calificar el criterio, no la calificación: los exámenes no cubren todos los criterios." }));
    caja.appendChild(tablaCriterios(n, UI.area));
  }

  function chipsCriterios(area, lista) {
    if (!lista || !lista.length) return null;
    return h("span", { class: "crits" }, lista.map(function (c) {
      var d = CE_CRITERIOS[area][c];
      return h("abbr", { class: "crit", title: d ? c + " · " + d.texto : c, text: c });
    }));
  }

  // Logro de cada criterio en un conjunto de pruebas (solo versión ordinaria).
  function logroCriterios(n, area, pns) {
    var acc = {};
    pns.forEach(function (pn) {
      var r = leerReg(n, area, pn);
      if (!evaluado(r) || versionDe(n, area, pn) !== "ordinaria") return;
      plantilla(area, pn, "ordinaria").forEach(function (it) {
        var e = (r.items && r.items[it.id]) || 0;
        (it.criterios || []).forEach(function (c) {
          var a = (acc[c] = acc[c] || { suma: 0, total: 0 });
          a.total++;
          a.suma += e === 2 ? 0 : e === 1 ? 0.5 : 1;
        });
      });
    });
    var res = {};
    Object.keys(acc).forEach(function (c) { res[c] = Math.round((acc[c].suma / acc[c].total) * 100); });
    return res;
  }
  function ordenCriterio(a, b) {
    var x = a.split("."), y = b.split(".");
    return (+x[0] - +y[0]) || (+x[1] - +y[1]);
  }

  function tablaCriterios(n, area) {
    if (alumno(n).perfil["acs_" + area]) return h("p", { class: "vacio", text: "Con ACS en esta área: se evalúa con los criterios de su adaptación, no con los de 5.º." });
    var cols = [1, 2, 3, 0].map(function (t) { return logroCriterios(n, area, pruebasDeTrimestre(t)); });
    var codigos = Object.keys(cols[3]).sort(ordenCriterio);
    if (!codigos.length) return h("p", { class: "vacio", text: "Aún no hay pruebas ordinarias evaluadas en esta área." });
    var tb = h("tbody", {}, codigos.map(function (c) {
      return h("tr", {}, [h("th", {}, [h("abbr", { class: "crit", title: CE_CRITERIOS[area][c].texto, text: c }), " " + CE_CRITERIOS[area][c].corto])].concat(cols.map(function (col) {
        var v = col[c];
        var nivel = v === undefined ? "" : v < 50 ? "nota-insuf" : v < 70 ? "nota-suf" : "nota-bien";
        return h("td", { class: "celda-nota " + nivel, text: v === undefined ? "—" : v + " %" });
      })));
    }));
    return h("div", { class: "tabla-scroll" }, [h("table", { class: "tabla-simple tabla-centrada tabla-crit" }, [
      h("thead", {}, [h("tr", {}, ["Criterio", "T1", "T2", "T3", "Curso"].map(function (x) { return h("th", { text: x }); }))]), tb,
    ])]);
  }

  function porcentajeEje(n, area, pn, eje) {
    var r = leerReg(n, area, pn);
    if (!evaluado(r)) return null;
    var items = plantilla(area, pn, versionDe(n, area, pn)).filter(function (it) { return it.eje === eje; });
    if (!items.length) return null;
    var sum = items.reduce(function (a, it) { var e = (r.items && r.items[it.id]) || 0; return a + (e === 2 ? 1 : e === 1 ? 0.5 : 0); }, 0);
    return Math.round((sum / items.length) * 100);
  }

  function mapaEjes(n, area) {
    var tabla = h("table", { class: "mapa" });
    tabla.appendChild(h("thead", {}, [h("tr", {}, [h("th", { text: "Eje" })].concat([1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (pn) { return h("th", { text: "T" + Math.ceil(pn / 3) + "·B" + (((pn - 1) % 3) + 1) }); })))]));
    var tb = h("tbody");
    CE_EJES[area].forEach(function (e) {
      var celdas = [];
      var alguno = false;
      for (var pn = 1; pn <= 9; pn++) {
        var v = porcentajeEje(n, area, pn, e.id);
        if (v !== null) alguno = true;
        var paso = v === null ? "" : v === 0 ? "m0" : v <= 25 ? "m1" : v <= 50 ? "m2" : v <= 75 ? "m3" : "m4";
        celdas.push(h("td", { class: "mapa-c " + paso, title: v === null ? "Sin datos" : e.label + " · " + v + " % con dificultad", text: v === null ? "" : v + " %" }));
      }
      if (alguno) tb.appendChild(h("tr", {}, [h("th", { text: e.label })].concat(celdas)));
    });
    if (!tb.firstChild) tb.appendChild(h("tr", {}, [h("td", { colspan: "10", class: "vacio", text: "Aún no hay pruebas evaluadas en esta área." })]));
    tabla.appendChild(tb);
    return h("div", { class: "tabla-scroll" }, [tabla, h("p", { class: "leyenda-mapa" }, [
      h("span", { class: "mapa-c m0", text: "0 %" }), h("span", { class: "mapa-c m1", text: "≤25 %" }), h("span", { class: "mapa-c m2", text: "≤50 %" }), h("span", { class: "mapa-c m3", text: "≤75 %" }), h("span", { class: "mapa-c m4", text: ">75 %" }),
    ])]);
  }

  // ---------------- Vista de grupo ----------------

  function vistaGrupo() {
    var area = UI.grupoArea;
    var lista = activos();
    main.appendChild(h("section", { class: "tarjeta" }, [
      h("div", { class: "fila-titulo" }, [
        h("h2", { text: "Grupo clase · " + nombreArea(area) }),
        selectArea(area, function (e) { UI.grupoArea = e.target.value; recordarUI(); pintar(); }),
      ]),
      h("p", { class: "nota-pie", text: "Pulsa un número para abrir su ficha. A = prueba adaptada; (r) = cuenta la recuperación. La media del grupo no incluye las pruebas adaptadas." }),
      h("div", { class: "tabla-scroll" }, [tablaGrupo(area, lista)]),
    ]));

    var pn = UI.grupoPrueba;
    var caja = h("section", { class: "tarjeta" }, [
      h("div", { class: "fila-titulo" }, [
        h("h3", { text: "Dificultades del grupo por contenido" }),
        selectPrueba(area, pn, function (e) { UI.grupoPrueba = +e.target.value; recordarUI(); pintar(); }),
      ]),
      h("p", { class: "nota-pie", text: "Cuántos alumnos tienen dificultad en cada pregunta de la versión ordinaria, y quiénes: sirve para formar grupos de refuerzo." }),
    ]);
    caja.appendChild(barrasGrupo(area, pn, lista));
    main.appendChild(caja);
  }

  function tablaGrupo(area, lista) {
    var cab1 = h("tr", {}, [h("th", { rowspan: "2", text: "N.º" })]);
    var cab2 = h("tr");
    for (var t = 1; t <= 3; t++) {
      cab1.appendChild(h("th", { colspan: "3", class: "th-trim", text: t + ".º trimestre" }));
      [1, 2, 3].forEach(function (b) { cab2.appendChild(h("th", { text: "B" + b })); });
    }
    cab1.appendChild(h("th", { colspan: "4", class: "th-trim", text: "Medias" }));
    ["T1", "T2", "T3", "Curso"].forEach(function (x) { cab2.appendChild(h("th", { text: x })); });
    var tb = h("tbody");
    var col = {}; // pn -> notas ordinarias
    lista.forEach(function (n) {
      var fila = h("tr", { class: "fila-clic" }, [h("th", {}, [h("button", {
        type: "button", class: "btn-num", text: String(n), title: "Abrir la ficha del n.º " + n,
        onclick: function () { UI.alumno = n; UI.area = area; irA("individual"); },
      })].concat(alumno(n).perfil["acs_" + area] ? [h("span", { class: "mini-acs", text: "A" })] : []))]);
      for (var pn = 1; pn <= 9; pn++) {
        var r = leerReg(n, area, pn);
        var v = notaEfectiva(r);
        var acs = versionDe(n, area, pn) === "acs";
        var rec = r && num(r.recuperacion) !== null && (num(r.nota) === null || num(r.recuperacion) > num(r.nota));
        if (v !== null && !acs) (col[pn] = col[pn] || []).push(v);
        var marc = itemsMarcados(r);
        fila.appendChild(h("td", {
          class: "celda-nota " + nivelNota(v),
          title: r && r.notas ? r.notas : null,
          text: r && r.np ? "NP" : v === null ? "" : fmt(v) + (rec ? " (r)" : "") + (acs ? " A" : ""),
        }, marc ? [h("span", { class: "marca-dif", title: marc + " dificultades marcadas", text: "•" })] : []));
      }
      [1, 2, 3, 0].forEach(function (t) {
        var m = mediaPeriodo(n, area, t);
        fila.appendChild(h("td", { class: "celda-nota celda-media " + nivelNota(m), text: fmt(m) }));
      });
      tb.appendChild(fila);
    });
    var pie = h("tr", { class: "fila-media" }, [h("th", { text: "Media" })]);
    for (var pn2 = 1; pn2 <= 9; pn2++) {
      var m = col[pn2] ? media(col[pn2]) : null;
      pie.appendChild(h("td", { class: "celda-nota " + nivelNota(m), text: fmt(m) }));
    }
    pie.appendChild(h("td", { colspan: "4" }));
    return h("table", { class: "tabla-grupo" }, [h("thead", {}, [cab1, cab2]), tb, h("tfoot", {}, [pie])]);
  }

  function barrasGrupo(area, pn, lista) {
    var items = plantilla(area, pn, "ordinaria");
    var ev = lista.filter(function (n) { return versionDe(n, area, pn) === "ordinaria" && evaluado(leerReg(n, area, pn)); });
    var acsN = lista.filter(function (n) { return versionDe(n, area, pn) === "acs" && evaluado(leerReg(n, area, pn)); });
    var caja = h("div", { class: "barras" });
    if (!ev.length) {
      caja.appendChild(h("p", { class: "vacio", text: "Ningún alumno tiene aún esta prueba registrada." }));
      return caja;
    }
    caja.appendChild(h("p", { class: "nota-pie", text: ev.length + " alumnos evaluados con la versión ordinaria." + (acsN.length ? " Con prueba adaptada: n.º " + acsN.join(", ") + " (ver su ficha)." : "") }));
    var ley = h("p", { class: "leyenda" }, [h("span", { class: "ley ley-dif", text: "Dificultad" }), h("span", { class: "ley ley-par", text: "Parcial" })]);
    caja.appendChild(ley);
    items.forEach(function (it) {
      var con = [], par = [];
      ev.forEach(function (n) {
        var e = (leerReg(n, area, pn).items || {})[it.id];
        if (e === 2) con.push(n); else if (e === 1) par.push(n);
      });
      var pc = (con.length / ev.length) * 100, pp = (par.length / ev.length) * 100;
      caja.appendChild(h("div", { class: "barra-fila" }, [
        h("div", { class: "barra-etq" }, [h("strong", { text: (it.pregunta ? it.pregunta + ". " : "") }), it.contenido]),
        h("div", { class: "barra-pista", title: con.length + " con dificultad, " + par.length + " parcial, de " + ev.length }, [
          pc ? h("span", { class: "barra-seg seg-dif", style: "width:" + pc + "%" }) : null,
          pp ? h("span", { class: "barra-seg seg-par", style: "width:" + pp + "%" }) : null,
        ]),
        h("div", { class: "barra-val" }, [
          h("strong", { text: String(con.length + par.length) }), " / " + ev.length,
          con.length || par.length ? h("small", { text: (con.length ? " · n.º " + con.join(", ") : "") + (par.length ? " · parcial: " + par.join(", ") : "") }) : null,
        ]),
      ]));
    });
    return caja;
  }

  // ---------------- Suspensos ----------------

  function calcularSuspensos() {
    var res = [];
    activos().forEach(function (n) {
      areasDe(UI.susArea).forEach(function (area) {
        var fila = null;
        if (UI.susCriterio === "prueba") {
          var v = notaEfectiva(leerReg(n, area, UI.susPrueba), UI.susRec);
          if (v !== null && v < 5) fila = { pruebas: [{ pn: UI.susPrueba, v: v }], media: null };
        } else {
          var t = UI.susCriterio === "trimestre" ? UI.susTrimestre : 0;
          var sus = pruebasDeTrimestre(t).map(function (pn) { return { pn: pn, v: notaEfectiva(leerReg(n, area, pn), UI.susRec) }; })
            .filter(function (x) { return x.v !== null && x.v < 5; });
          var m = mediaPeriodo(n, area, t, UI.susRec);
          if (UI.susCriterio === "trimestre" ? m !== null && m < 5 : sus.length) fila = { pruebas: sus, media: m };
        }
        if (fila) {
          fila.n = n; fila.area = area;
          var difs = [];
          (UI.susCriterio === "prueba" ? [UI.susPrueba] : pruebasDeTrimestre(UI.susCriterio === "trimestre" ? UI.susTrimestre : 0)).forEach(function (pn) {
            dificultades(n, area, pn).forEach(function (d) { if (d.estado === 2) difs.push(d.item.contenido); });
          });
          fila.difs = difs;
          res.push(fila);
        }
      });
    });
    return res;
  }

  function vistaSuspensos() {
    var filtros = h("div", { class: "filtros" });
    filtros.appendChild(h("label", { class: "campo-grupo" }, ["Área", selectArea(UI.susArea, function (e) { UI.susArea = e.target.value; pintar(); }, true)]));
    filtros.appendChild(h("label", { class: "campo-grupo" }, ["Criterio", opciones(h("select", { class: "campo", onchange: function (e) { UI.susCriterio = e.target.value; pintar(); } }), [
      { v: "prueba", t: "Nota < 5 en una prueba" },
      { v: "trimestre", t: "Media del trimestre < 5" },
      { v: "curso", t: "Alguna prueba < 5 en el curso" },
    ], UI.susCriterio)]));
    if (UI.susCriterio === "prueba") filtros.appendChild(h("label", { class: "campo-grupo" }, ["Prueba", opciones(h("select", { class: "campo", onchange: function (e) { UI.susPrueba = +e.target.value; pintar(); } }),
      [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (pn) { return { v: pn, t: "T" + Math.ceil(pn / 3) + " · Bloque " + (((pn - 1) % 3) + 1) }; }), UI.susPrueba)]));
    if (UI.susCriterio === "trimestre") filtros.appendChild(h("label", { class: "campo-grupo" }, ["Trimestre", opciones(h("select", { class: "campo", onchange: function (e) { UI.susTrimestre = +e.target.value; pintar(); } }),
      [{ v: 1, t: "1.º" }, { v: 2, t: "2.º" }, { v: 3, t: "3.º" }], UI.susTrimestre)]));
    filtros.appendChild(h("label", { class: "check" }, [h("input", { type: "checkbox", checked: UI.susRec, onchange: function (e) { UI.susRec = e.target.checked; pintar(); } }), " Contar la recuperación"]));

    var res = calcularSuspensos();
    var tabla = h("table", { class: "tabla-simple" }, [h("thead", {}, [h("tr", {}, ["N.º", "Área", "Pruebas por debajo de 5", UI.susCriterio === "prueba" ? null : "Media", "Dificultades marcadas"].filter(Boolean).map(function (t) { return h("th", { text: t }); }))])]);
    var tb = h("tbody");
    res.forEach(function (f) {
      tb.appendChild(h("tr", {}, [
        h("th", {}, [h("button", { type: "button", class: "btn-num", text: String(f.n), onclick: function () { UI.alumno = f.n; UI.area = f.area; irA("individual"); } })].concat(badgesPerfil(f.n))),
        h("td", { text: nombreArea(f.area) }),
        h("td", {}, f.pruebas.map(function (p) { return h("span", { class: "pill nota-insuf", text: etiquetaPrueba(prueba(f.area, p.pn)) + ": " + fmt(p.v) }); })),
        UI.susCriterio === "prueba" ? null : h("td", { class: "celda-nota " + nivelNota(f.media), text: fmt(f.media) }),
        h("td", { class: "td-difs", text: f.difs.length ? f.difs.join(" · ") : "Ninguna marcada" }),
      ]));
    });
    if (!res.length) tb.appendChild(h("tr", {}, [h("td", { colspan: "5", class: "vacio", text: "Nadie cumple este criterio con los datos registrados." })]));
    tabla.appendChild(tb);

    main.appendChild(h("section", { class: "tarjeta" }, [
      h("h2", { text: "Alumnado con pruebas suspensas" }),
      filtros,
      h("div", { class: "tabla-scroll" }, [tabla]),
      res.length ? h("div", { class: "acciones" }, [h("button", {
        type: "button", class: "btn btn-primario", text: "Hacer el resumen de estos alumnos",
        onclick: function () {
          UI.resSel = {};
          res.forEach(function (f) { UI.resSel[f.n] = true; });
          UI.resArea = UI.susArea;
          UI.resPeriodo = UI.susCriterio === "trimestre" ? UI.susTrimestre : UI.susCriterio === "prueba" ? Math.ceil(UI.susPrueba / 3) : 0;
          irA("resumen");
        },
      })]) : null,
    ]));
  }

  // ---------------- Resumen imprimible ----------------

  function vistaResumen() {
    var rej = h("div", { class: "rejilla-alumnos" });
    activos().forEach(function (n) {
      rej.appendChild(h("label", { class: "chip-check" + (UI.resSel[n] ? " activo" : "") }, [
        h("input", { type: "checkbox", checked: !!UI.resSel[n], onchange: function (e) { UI.resSel[n] = e.target.checked; e.target.parentNode.classList.toggle("activo", e.target.checked); } }),
        String(n),
      ]));
    });
    function marcarTodos(v) { activos().forEach(function (n) { UI.resSel[n] = v; }); pintar(); }

    var opc = h("div", { class: "filtros" }, [
      h("label", { class: "campo-grupo" }, ["Área", selectArea(UI.resArea, function (e) { UI.resArea = e.target.value; }, true)]),
      h("label", { class: "campo-grupo" }, ["Periodo", opciones(h("select", { class: "campo", onchange: function (e) { UI.resPeriodo = +e.target.value; } }),
        [{ v: 0, t: "Todo el curso" }, { v: 1, t: "1.º trimestre" }, { v: 2, t: "2.º trimestre" }, { v: 3, t: "3.º trimestre" }], UI.resPeriodo)]),
      h("label", { class: "check" }, [h("input", { type: "checkbox", checked: UI.resNotas, onchange: function (e) { UI.resNotas = e.target.checked; } }), " Incluir anotaciones"]),
      h("label", { class: "check" }, [h("input", { type: "checkbox", checked: UI.resMedidas, onchange: function (e) { UI.resMedidas = e.target.checked; } }), " Incluir medidas"]),
      h("label", { class: "check" }, [h("input", { type: "checkbox", checked: UI.resPagina, onchange: function (e) { UI.resPagina = e.target.checked; } }), " Un alumno por página al imprimir"]),
    ]);
    var salida = h("div", { id: "resumen-salida", class: "resumen-salida" });
    main.appendChild(h("section", { class: "tarjeta no-imprimir" }, [
      h("h2", { text: "Resumen de dificultades" }),
      h("p", { class: "nota-pie", text: "Elige el alumnado y genera el resumen. Si es para entregar a una familia, selecciona un solo alumno: el bloque de dificultades comunes solo aparece con dos o más." }),
      h("div", { class: "acciones" }, [
        h("button", { type: "button", class: "btn", text: "Todos", onclick: function () { marcarTodos(true); } }),
        h("button", { type: "button", class: "btn", text: "Ninguno", onclick: function () { marcarTodos(false); } }),
      ]),
      rej,
      opc,
      h("div", { class: "acciones" }, [
        h("button", { type: "button", class: "btn btn-primario", text: "Generar resumen", onclick: function () { generarResumen(salida); } }),
        h("button", { type: "button", class: "btn", text: "🖨 Imprimir", onclick: function () { if (!salida.firstChild) generarResumen(salida); window.print(); } }),
      ]),
    ]));
    main.appendChild(salida);
    if (Object.keys(UI.resSel).some(function (k) { return UI.resSel[k]; })) generarResumen(salida);
  }

  function generarResumen(salida) {
    vaciar(salida);
    var sel = activos().filter(function (n) { return UI.resSel[n]; });
    if (!sel.length) {
      salida.appendChild(h("p", { class: "aviso", text: "Selecciona al menos un alumno." }));
      return;
    }
    var areas = areasDe(UI.resArea);
    var pns = pruebasDeTrimestre(UI.resPeriodo);
    var periodo = UI.resPeriodo ? UI.resPeriodo + ".º trimestre" : "Todo el curso";
    salida.classList.toggle("una-por-pagina", UI.resPagina);

    salida.appendChild(h("header", { class: "res-cab" }, [
      h("h2", { text: "Resumen de dificultades · 5.º C" }),
      h("p", { text: periodo + " · " + areas.map(nombreArea).join(" y ") + " · " + sel.length + (sel.length === 1 ? " alumno/a" : " alumnos") + " · " + new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) }),
    ]));

    // Dificultades comunes (dos o más alumnos).
    if (sel.length > 1) {
      var cuenta = {};
      sel.forEach(function (n) {
        areas.forEach(function (area) {
          pns.forEach(function (pn) {
            dificultades(n, area, pn).forEach(function (d) {
              var k = area + "|" + pn + "|" + d.version + "|" + d.item.id;
              var c = (cuenta[k] = cuenta[k] || { area: area, pn: pn, version: d.version, item: d.item, con: [], par: [] });
              (d.estado === 2 ? c.con : c.par).push(n);
            });
          });
        });
      });
      var filas = Object.keys(cuenta).map(function (k) { return cuenta[k]; })
        .sort(function (a, b) { return (b.con.length * 2 + b.par.length) - (a.con.length * 2 + a.par.length) || a.pn - b.pn; });
      var sec = h("section", { class: "res-bloque" }, [h("h3", { text: "Dificultades más repetidas en el alumnado seleccionado" })]);
      if (!filas.length) sec.appendChild(h("p", { class: "vacio", text: "No hay dificultades marcadas en este periodo." }));
      else {
        var t = h("table", { class: "tabla-simple" }, [h("thead", {}, [h("tr", {}, ["Contenido", "Prueba", "Dificultad", "Parcial"].map(function (x) { return h("th", { text: x }); }))])]);
        var tb = h("tbody");
        filas.slice(0, 20).forEach(function (f) {
          tb.appendChild(h("tr", {}, [
            h("td", { text: f.item.contenido + (f.version === "acs" ? " (ACS)" : "") }),
            h("td", { text: nombreArea(f.area) + " · " + etiquetaPrueba(prueba(f.area, f.pn)) }),
            h("td", { text: f.con.length ? f.con.length + " (n.º " + f.con.join(", ") + ")" : "—" }),
            h("td", { text: f.par.length ? f.par.length + " (n.º " + f.par.join(", ") + ")" : "—" }),
          ]));
        });
        t.appendChild(tb);
        sec.appendChild(h("div", { class: "tabla-scroll" }, [t]));
        if (filas.length > 20) sec.appendChild(h("p", { class: "nota-pie", text: "Se muestran las 20 más repetidas de " + filas.length + "." }));
      }
      salida.appendChild(sec);
    }

    sel.forEach(function (n) {
      var bloque = h("section", { class: "res-bloque res-alumno" }, [h("h3", {}, ["Alumno/a n.º " + n + " "].concat(badgesPerfil(n)))]);
      areas.forEach(function (area) {
        var t = h("table", { class: "tabla-simple" }, [h("thead", {}, [h("tr", {}, ["Prueba", "Nota", "Dificultades", UI.resNotas ? "Anotaciones" : null].filter(Boolean).map(function (x) { return h("th", { text: x }); }))])]);
        var tb = h("tbody");
        var ejes = {};
        var alguna = false;
        pns.forEach(function (pn) {
          var r = leerReg(n, area, pn);
          if (!r || (!evaluado(r) && !r.np && !r.notas)) return;
          alguna = true;
          var v = notaEfectiva(r);
          var difs = dificultades(n, area, pn);
          difs.forEach(function (d) { var k = d.item.eje; ejes[k] = (ejes[k] || 0) + (d.estado === 2 ? 1 : 0.5); });
          var acs = versionDe(n, area, pn) === "acs";
          tb.appendChild(h("tr", {}, [
            h("td", { text: etiquetaPrueba(prueba(area, pn)) + (acs ? " (ACS)" : "") }),
            h("td", { class: "celda-nota " + nivelNota(v), text: r.np ? "NP" : fmt(v) + (num(r.recuperacion) !== null ? " (rec.)" : "") }),
            h("td", {}, difs.length ? [h("ul", { class: "lista-difs" }, difs.map(function (d) {
              return h("li", { class: d.estado === 2 ? "li-dif" : "li-par" }, [d.item.contenido, h("span", { class: "sr", text: d.estado === 2 ? " (dificultad)" : " (parcial)" }), d.estado === 1 ? h("em", { text: " · parcial" }) : null]);
            }))] : [h("span", { class: "muted", text: "Sin dificultades marcadas" })]),
            UI.resNotas ? h("td", { class: "td-notas", text: r.notas || "" }) : null,
          ]));
        });
        if (!alguna) return;
        t.appendChild(tb);
        var m = mediaPeriodo(n, area, UI.resPeriodo);
        bloque.appendChild(h("h4", {}, [nombreArea(area) + (m !== null ? " · media " + fmt(m) : "")]));
        bloque.appendChild(h("div", { class: "tabla-scroll" }, [t]));
        var top = Object.keys(ejes).sort(function (a, b) { return ejes[b] - ejes[a]; }).slice(0, 3);
        if (top.length) bloque.appendChild(h("p", { class: "res-ejes" }, [h("strong", { text: "Ejes con más dificultad: " }), top.map(function (e) { return etiquetaEje(area, e); }).join(" · ")]));
        var lc = logroCriterios(n, area, pns);
        var flojos = Object.keys(lc).filter(function (c) { return lc[c] < 50; }).sort(ordenCriterio);
        if (flojos.length) bloque.appendChild(h("p", { class: "res-ejes" }, [h("strong", { text: "Criterios por debajo del 50 % de logro: " }), flojos.map(function (c) { return c + " " + CE_CRITERIOS[area][c].corto + " (" + lc[c] + " %)"; }).join(" · ")]));
      });
      if (UI.resMedidas && (S.medidas[n] || []).length) {
        bloque.appendChild(h("h4", { text: "Medidas aplicadas" }));
        bloque.appendChild(h("ul", { class: "lista-medidas" }, S.medidas[n].map(function (m) {
          return h("li", { text: fechaLarga(m.fecha) + " · " + (m.area === "ambas" ? "Ambas áreas" : nombreArea(m.area)) + " · " + m.medida + (m.resultado ? " → " + m.resultado : "") });
        })));
      }
      if (bloque.childNodes.length === 1) bloque.appendChild(h("p", { class: "vacio", text: "Sin datos registrados en este periodo." }));
      salida.appendChild(bloque);
    });
  }

  // ---------------- Pruebas (registro de contenidos) ----------------

  var borrador = null;

  function vistaPruebas() {
    var area = UI.plArea, pn = UI.plPrueba, version = UI.plVersion;
    var meta = metaPrueba(area, pn);
    var clave = claveP(area, pn, version);
    if (!borrador || borrador.clave !== clave) borrador = { clave: clave, items: JSON.parse(JSON.stringify(plantilla(area, pn, version))) };
    var modificada = !!S.plantillas[clave];

    function cambiar(k, v) { UI[k] = v; borrador = null; pintar(); }
    var filtros = h("div", { class: "filtros" }, [
      h("label", { class: "campo-grupo" }, ["Área", selectArea(area, function (e) { cambiar("plArea", e.target.value); })]),
      h("label", { class: "campo-grupo" }, ["Prueba", selectPrueba(area, pn, function (e) { cambiar("plPrueba", +e.target.value); })]),
      h("label", { class: "campo-grupo" }, ["Versión", opciones(h("select", { class: "campo", onchange: function (e) { cambiar("plVersion", e.target.value); } }),
        [{ v: "ordinaria", t: VERSIONES.ordinaria }, { v: "acs", t: VERSIONES.acs }], version)]),
    ]);

    var inTit = h("input", { type: "text", class: "campo", value: meta.titulo, "aria-label": "Título de la prueba" });
    var inFecha = h("input", { type: "date", class: "campo", value: meta.fecha || "", "aria-label": "Fecha" });
    var ejeOps = CE_EJES[area].map(function (e) { return { v: e.id, t: e.label }; });

    var tb = h("tbody");
    borrador.items.forEach(function (it, i) {
      tb.appendChild(h("tr", {}, [
        h("td", {}, [h("input", { type: "text", class: "campo campo-preg", value: it.pregunta, "aria-label": "Pregunta", oninput: function (e) { it.pregunta = e.target.value; } })]),
        h("td", {}, [h("input", { type: "text", class: "campo", value: it.contenido, "aria-label": "Contenido", oninput: function (e) { it.contenido = e.target.value; } })]),
        h("td", {}, [h("input", {
          type: "text", class: "campo campo-crit", value: (it.criterios || []).join(", "), "aria-label": "Criterios", placeholder: version === "acs" ? "(los de su ACS)" : "4.1.a, 9.1.a",
          oninput: function (e) {
            var l = e.target.value.split(/[\s,;]+/).filter(Boolean);
            var malos = l.filter(function (c) { return !CE_CRITERIOS[area][c]; });
            e.target.setCustomValidity(malos.length ? "No existe: " + malos.join(", ") : "");
            e.target.title = malos.length ? "No existe: " + malos.join(", ") : "";
            it.criterios = l.filter(function (c) { return CE_CRITERIOS[area][c]; });
          },
        })]),
        h("td", {}, [opciones(h("select", { class: "campo", "aria-label": "Eje", onchange: function (e) { it.eje = e.target.value; } }), ejeOps, it.eje)]),
        h("td", {}, [h("button", { type: "button", class: "btn-enlace", text: "Quitar", onclick: function () { borrador.items.splice(i, 1); pintar(); } })]),
      ]));
    });
    var tabla = h("table", { class: "tabla-simple tabla-editar" }, [h("thead", {}, [h("tr", {}, ["Preg.", "Contenido", "Criterios 5.º", "Eje", ""].map(function (x) { return h("th", { text: x }); }))]), tb]);

    main.appendChild(h("section", { class: "tarjeta" }, [
      h("h2", { text: "Registro de contenidos de cada prueba" }),
      h("p", { class: "nota-pie", text: "Cada fila es un contenido que puedes marcar con dificultad en la ficha del alumno. El 1.º trimestre viene de tus exámenes; el 2.º y el 3.º son provisionales hasta que los ajustes. Si borras una fila, las marcas ya hechas en ella dejan de verse." }),
      filtros,
      h("p", {}, [
        h("span", { class: "pill " + (meta.fuente === "examen" ? "pill-ok" : "pill-dif"), text: meta.fuente === "examen" ? "Sacado del examen" : "Provisional" }),
        modificada ? h("span", { class: "pill pill-acs", text: "Modificado por ti" }) : null,
      ]),
      h("div", { class: "filtros" }, [h("label", { class: "campo-grupo campo-ancho" }, ["Título", inTit]), h("label", { class: "campo-grupo" }, ["Fecha", inFecha])]),
      h("div", { class: "tabla-scroll" }, [tabla]),
      h("details", { class: "ver-datos" }, [h("summary", { text: "Criterios de evaluación de 5.º (" + nombreArea(area) + "), Orden de 30 de mayo de 2023" }), h("ul", { class: "lista-criterios" }, Object.keys(CE_CRITERIOS[area]).sort(ordenCriterio).map(function (c) {
        return h("li", {}, [h("strong", { text: c + " " }), CE_CRITERIOS[area][c].texto]);
      }))]),
      h("div", { class: "acciones" }, [
        h("button", { type: "button", class: "btn", text: "+ Añadir contenido", onclick: function () {
          borrador.items.push({ id: "x" + Date.now().toString(36), pregunta: String(borrador.items.length + 1), contenido: "", eje: CE_EJES[area][0].id, criterios: [] });
          pintar();
        } }),
        h("button", { type: "button", class: "btn btn-primario", text: "Guardar cambios", onclick: function () {
          var items = borrador.items.filter(function (it) { return it.contenido.trim(); });
          S.plantillas[clave] = { items: items };
          var mk = area + "-" + pn + "-meta";
          S.plantillas[mk] = { titulo: inTit.value.trim() || prueba(area, pn).titulo, fecha: inFecha.value, fuente: items.length && version === "ordinaria" && prueba(area, pn).fuente === "provisional" ? "examen" : meta.fuente };
          guardar("meta"); borrador = null; pintar();
        } }),
        modificada ? h("button", { type: "button", class: "btn", text: "Volver al original", onclick: function () {
          if (!confirm("¿Descartar tus cambios en esta prueba y volver al registro original?")) return;
          delete S.plantillas[clave];
          delete S.plantillas[area + "-" + pn + "-meta"];
          guardar("meta"); borrador = null; pintar();
        } }) : null,
      ]),
    ]));
  }

  // ---------------- Copia de seguridad ----------------

  function exportar() {
    S.ultimaCopia = new Date().toISOString();
    guardar("meta");
    var copia = { version: S.version, exportado: S.ultimaCopia, alumnos: S.alumnos, registros: S.registros, plantillas: S.plantillas, medidas: S.medidas, ultimaCopia: S.ultimaCopia };
    var blob = new Blob([JSON.stringify(copia, null, 1)], { type: "application/json" });
    var a = h("a", { href: URL.createObjectURL(blob), download: "cuaderno-evaluacion-" + S.ultimaCopia.slice(0, 10) + ".json" });
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    pintarAvisos();
  }

  async function borrarNube() {
    var lote = writeBatch(db);
    for (var n = 1; n <= N_ALUMNOS; n++) lote.delete(doc(base(), "alumnos", String(n)));
    lote.delete(base());
    await lote.commit();
  }

  function vistaCopia() {
    var archivo = h("input", { type: "file", accept: ".json,application/json", class: "campo", "aria-label": "Archivo de copia" });
    var msg = h("p", { role: "status" });
    main.appendChild(h("section", { class: "tarjeta" }, [
      h("h2", { text: "Copia de seguridad" }),
      h("p", { text: "El cuaderno se guarda en Firestore, asociado a tu cuenta de docente: lo ves desde cualquier ordenador en el que entres con ella. Aun así:" }),
      h("ul", {}, [
        h("li", { text: "Descarga una copia .json al final de cada trimestre (o antes de cambios grandes) y guárdala en la unidad del centro. Firebase gratuito no hace copias de seguridad por ti." }),
        h("li", { text: "No tengas el cuaderno abierto en dos ordenadores a la vez: si tocas el mismo alumno en los dos, se queda el último cambio." }),
        h("li", { text: "Importar una copia sustituye todo el cuaderno guardado en tu cuenta." }),
      ]),
      h("p", { class: "nota-pie", text: S.ultimaCopia ? "Última copia descargada: " + new Date(S.ultimaCopia).toLocaleString("es-ES") : "Aún no has descargado ninguna copia." }),
      h("div", { class: "acciones" }, [h("button", { type: "button", class: "btn btn-primario", text: "⬇ Descargar copia (.json)", onclick: function () { exportar(); pintar(); } })]),
      h("h3", { text: "Importar una copia" }),
      h("div", { class: "acciones" }, [archivo, h("button", { type: "button", class: "btn", text: "Importar", onclick: function () {
        var f = archivo.files && archivo.files[0];
        if (!f) { msg.textContent = "Elige primero el archivo."; return; }
        var lector = new FileReader();
        lector.onload = function () {
          var d;
          try {
            d = JSON.parse(lector.result);
            if (!d || typeof d !== "object" || !d.registros || !d.alumnos) throw new Error("formato");
          } catch (e) {
            msg.textContent = "Ese archivo no es una copia válida del cuaderno.";
            return;
          }
          if (!confirm("Se sustituirá todo el cuaderno de tu cuenta por el de la copia. ¿Seguir?")) return;
          S = completar(d);
          guardarTodo();
          msg.textContent = "Copia importada.";
          pintar();
        };
        lector.readAsText(f);
      } })]),
      msg,
      h("h3", { text: "Borrar el cuaderno" }),
      h("p", { class: "nota-pie", text: "Por ejemplo, al terminar el curso. Descarga antes una copia: se borra de Firestore y no se puede recuperar." }),
      h("div", { class: "acciones" }, [h("button", { type: "button", class: "btn btn-peligro", text: "Borrar todos los datos del cuaderno", onclick: async function () {
        var t = prompt("Esto no se puede deshacer. Escribe BORRAR para confirmar.");
        if (t !== "BORRAR") return;
        clearTimeout(temporizador);
        temporizador = null;
        pendientes = {};
        try {
          await borrarNube();
          S = estadoInicial();
          pintar();
        } catch (e) {
          msg.textContent = "No se ha podido borrar (" + (e.code || e.message) + ").";
        }
      } })]),
    ]));
  }

  // ---------------- Acceso con la cuenta de docente ----------------

  var pAcceso = document.getElementById("acceso");
  var pApp = document.getElementById("app");
  var pCargando = document.getElementById("cargando");
  var formAcceso = document.getElementById("form-acceso");
  var msgAcceso = document.getElementById("acceso-msg");

  function mostrar(cual) {
    pCargando.hidden = cual !== "cargando";
    pAcceso.hidden = cual !== "acceso";
    pApp.hidden = cual !== "app";
  }

  formAcceso.addEventListener("submit", async function (e) {
    e.preventDefault();
    msgAcceso.textContent = "Entrando…";
    try {
      await signInWithEmailAndPassword(auth, formAcceso.correo.value.trim(), formAcceso.clave.value);
      msgAcceso.textContent = "";
    } catch (er) {
      var c = er.code || "";
      msgAcceso.textContent = /invalid-credential|wrong-password|user-not-found|invalid-email/.test(c)
        ? "Correo o contraseña incorrectos."
        : /too-many-requests/.test(c) ? "Demasiados intentos. Espera unos minutos." : "No se ha podido entrar (" + c + ").";
    }
  });

  document.getElementById("btn-salir").addEventListener("click", async function () {
    await guardarYa();
    await signOut(auth);
  });

  onAuthStateChanged(auth, async function (user) {
    if (!user || user.isAnonymous) {
      UID = null;
      S = estadoInicial();
      document.getElementById("acceso-anonimo").hidden = !(user && user.isAnonymous);
      mostrar("acceso");
      return;
    }
    UID = user.uid;
    document.getElementById("usuario").textContent = user.email || "";
    mostrar("cargando");
    try {
      S = await cargarNube();
    } catch (er) {
      pCargando.textContent = "No se ha podido leer el cuaderno (" + (er.code || er.message) + "). Si dice «permission-denied», falta publicar las reglas de firestore.rules en la consola de Firebase.";
      return;
    }
    mostrar("app");
    irA(UI.vista);
  });
})();
