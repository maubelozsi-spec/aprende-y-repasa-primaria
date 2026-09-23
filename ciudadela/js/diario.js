// ============================================================
// La Ciudadela · diario de la noche (privado, solo en el dispositivo)
//
// Guarda en localStorage ("ciudadela_diario") dos tipos de entrada:
//   - "noche": el repaso de Séneca (Sobre la ira, III, 36) con tres
//     preguntas, el ánimo del día y las virtudes practicadas.
//   - "calma": el plan que el alumno decide guardar al terminar el
//     kit de calma (ver calma.js).
// No hay envío a la nube por diseño: un diario que lee el docente
// deja de ser un diario (el alumnado escribiría para él).
// ============================================================

(function () {
  "use strict";

  var C = window.Ciudadela;
  var CLAVE = "ciudadela_diario";
  var CLAVE_NO_GUARDAR = "ciudadela_no_guardar";

  var ANIMOS = [
    { id: "bien", cara: "😊", t: "Bien" },
    { id: "normal", cara: "🙂", t: "Normal" },
    { id: "regular", cara: "😐", t: "Regular" },
    { id: "dificil", cara: "😔", t: "Difícil" },
    { id: "fuerza", cara: "💪", t: "Con fuerza" },
  ];

  // Nombre y cara de cada emoción del kit de calma (mismo id que en calma.js).
  var EMOCIONES = {
    enfado: "😠 Enfado", tristeza: "😢 Tristeza", miedo: "😨 Miedo", nervios: "😬 Nervios",
    verguenza: "😳 Vergüenza", celos: "😒 Celos o envidia", frustracion: "😤 Frustración",
    soledad: "🥺 Soledad", nose: "🌀 No sé qué siento",
  };

  var sel = { animo: null, virtudes: [] };

  function $(id) { return document.getElementById(id); }
  function leerEntradas() { var e = C.leer(CLAVE, []); return Array.isArray(e) ? e : []; }

  function fechaBonita(iso) {
    try {
      return new Date(iso).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
    } catch (e) {
      return iso.slice(0, 10);
    }
  }

  function pintarAnimos() {
    var cont = $("animos");
    cont.innerHTML = "";
    ANIMOS.forEach(function (a) {
      var b = C.el("button", "animo");
      b.type = "button";
      b.setAttribute("aria-pressed", sel.animo === a.id ? "true" : "false");
      b.appendChild(C.el("span", null, a.cara));
      b.appendChild(document.createTextNode(a.t));
      b.addEventListener("click", function () {
        sel.animo = sel.animo === a.id ? null : a.id;
        pintarAnimos();
      });
      cont.appendChild(b);
    });
  }

  function pintarChips() {
    var cont = $("chips-virtud");
    cont.innerHTML = "";
    Object.keys(C.VIRTUDES).forEach(function (id) {
      var b = C.el("button", "chip-v v-" + id);
      b.type = "button";
      b.setAttribute("aria-pressed", sel.virtudes.indexOf(id) >= 0 ? "true" : "false");
      b.innerHTML = C.icono(id) + C.VIRTUDES[id].nombre;
      b.title = C.VIRTUDES[id].corta;
      b.addEventListener("click", function () {
        var i = sel.virtudes.indexOf(id);
        if (i >= 0) sel.virtudes.splice(i, 1); else sel.virtudes.push(id);
        pintarChips();
      });
      cont.appendChild(b);
    });
  }

  function pintarSemana(entradas) {
    var hace7 = Date.now() - 7 * 24 * 3600 * 1000;
    var cuenta = { sabiduria: 0, justicia: 0, coraje: 0, templanza: 0 };
    entradas.forEach(function (e) {
      if (new Date(e.fecha).getTime() < hace7) return;
      (e.virtudes || (e.virtud ? [e.virtud] : [])).forEach(function (v) { if (v in cuenta) cuenta[v]++; });
    });
    var cont = $("semana");
    cont.innerHTML = "";
    Object.keys(cuenta).forEach(function (v) {
      var d = C.el("div", "v-" + v);
      d.appendChild(C.el("b", null, String(cuenta[v])));
      d.appendChild(C.el("span", null, C.VIRTUDES[v].nombre));
      cont.appendChild(d);
    });
  }

  function pintarEntradas() {
    var entradas = leerEntradas();
    pintarSemana(entradas);
    var cont = $("entradas");
    cont.innerHTML = "";
    $("btn-borrar-todo").classList.toggle("oculto", !entradas.length);
    if (!entradas.length) {
      cont.appendChild(C.el("p", "vacio", "Todavía no has escrito nada. Tu primera noche empieza hoy."));
      return;
    }
    entradas.forEach(function (e) {
      var art = C.el("article", "entrada");
      var virtudPrincipal = e.tipo === "calma" ? e.virtud : (e.virtudes && e.virtudes[0]);
      if (virtudPrincipal) art.classList.add("v-" + virtudPrincipal);
      var cab = C.el("div", "entrada-cab");
      var tit = C.el("div");
      var animo = ANIMOS.filter(function (a) { return a.id === e.animo; })[0];
      tit.appendChild(C.el("b", null, e.tipo === "calma" ? "Kit de calma" : "Repaso de la noche" + (animo ? " " + animo.cara : "")));
      tit.appendChild(C.el("div", "fecha", fechaBonita(e.fecha)));
      cab.appendChild(tit);
      var borrar = C.el("button", "btn-borrar");
      borrar.type = "button";
      borrar.setAttribute("aria-label", "Borrar esta entrada");
      borrar.innerHTML = C.icono("papelera");
      borrar.addEventListener("click", function () {
        if (!confirm("¿Borrar esta entrada? No se puede recuperar.")) return;
        C.guardar(CLAVE, leerEntradas().filter(function (x) { return x.id !== e.id; }));
        pintarEntradas();
      });
      cab.appendChild(borrar);
      art.appendChild(cab);

      var dl = C.el("dl");
      function fila(k, v) {
        if (!v) return;
        dl.appendChild(C.el("dt", null, k));
        dl.appendChild(C.el("dd", null, v));
      }
      if (e.tipo === "calma") {
        fila("Sentía", (EMOCIONES[e.emocion] || e.emocion) + " (" + e.intensidad + " de 5" + (e.despues ? ", después " + e.despues : "") + ")");
        fila("Me decía", e.pensamiento ? "«" + e.pensamiento + "»" : "");
        fila("Elegí", C.VIRTUDES[e.virtud] ? C.VIRTUDES[e.virtud].nombre + ": " + e.accion : e.accion);
      } else {
        fila("Hice bien", e.bien);
        fila("Podría mejorar", e.mejor);
        fila("Mañana depende de mí", e.manana);
        if (e.virtudes && e.virtudes.length) {
          fila("Practiqué", e.virtudes.map(function (v) { return C.VIRTUDES[v].nombre; }).join(", "));
        }
      }
      art.appendChild(dl);
      cont.appendChild(art);
    });
  }

  function limpiarFormulario() {
    $("d-bien").value = "";
    $("d-mejor").value = "";
    $("d-manana").value = "";
    sel = { animo: null, virtudes: [] };
    pintarAnimos();
    pintarChips();
  }

  document.addEventListener("DOMContentLoaded", function () {
    pintarAnimos();
    pintarChips();
    pintarEntradas();

    var noGuardar = $("no-guardar");
    noGuardar.checked = !!C.leer(CLAVE_NO_GUARDAR, false);
    function actualizarBoton() {
      $("btn-guardar").textContent = noGuardar.checked ? "He terminado (borrar)" : "Guardar en mi diario";
    }
    actualizarBoton();
    noGuardar.addEventListener("change", function () {
      C.guardar(CLAVE_NO_GUARDAR, noGuardar.checked);
      actualizarBoton();
    });

    $("form-diario").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var bien = $("d-bien").value.trim();
      var mejor = $("d-mejor").value.trim();
      var manana = $("d-manana").value.trim();
      var estado = $("estado-guardado");
      if (!bien && !mejor && !manana) {
        estado.textContent = "Escribe al menos una de las tres respuestas.";
        return;
      }
      if (noGuardar.checked) {
        limpiarFormulario();
        estado.textContent = "Borrado. Lo importante es que lo has pensado.";
        return;
      }
      var entradas = leerEntradas();
      entradas.unshift({
        id: Date.now(),
        fecha: new Date().toISOString(),
        tipo: "noche",
        animo: sel.animo,
        bien: bien,
        mejor: mejor,
        manana: manana,
        virtudes: sel.virtudes.slice(),
      });
      if (C.guardar(CLAVE, entradas)) {
        limpiarFormulario();
        estado.textContent = "✓ Guardado. Buenas noches.";
        pintarEntradas();
      } else {
        estado.textContent = "No se ha podido guardar en este navegador.";
      }
    });

    $("btn-borrar-todo").addEventListener("click", function () {
      if (!confirm("¿Borrar TODO tu diario de este dispositivo? No se puede recuperar.")) return;
      C.guardar(CLAVE, []);
      pintarEntradas();
    });
  });
})();
