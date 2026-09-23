// ============================================================
// La Ciudadela · generador de tarjetas de virtud
//
// Tarjetas SOLO en positivo, para el sistema de incentivos que el
// docente ya usa en clase (las entrega en mano). La tarjeta nombra la
// virtud y un motivo concreto: el refuerzo es informativo («has hecho
// esto, y esto es justicia»), no un premio genérico.
// Nada se guarda: los nombres solo existen mientras la página está
// abierta.
// ============================================================

(function () {
  "use strict";

  var C = window.Ciudadela;

  var MOTIVOS = {
    sabiduria: ["Por pensar antes de actuar", "Por aprender de un error", "Por comprobar antes de creerse algo", "Por explicarle algo a un compañero"],
    justicia: ["Por ayudar a un compañero", "Por decir la verdad", "Por invitar a jugar a quien estaba solo", "Por colaborar en su grupo"],
    coraje: ["Por intentarlo otra vez", "Por decir la verdad aunque costaba", "Por hablar delante de la clase", "Por pedir ayuda cuando la necesitaba"],
    templanza: ["Por esperar su turno", "Por calmarse antes de responder", "Por trabajar con concentración", "Por saber parar a tiempo"],
  };

  var CITAS = {
    sabiduria: "«Tenemos dos orejas y una boca para escuchar más y hablar menos.» Zenón",
    justicia: "«Hemos nacido para colaborar.» Marco Aurelio",
    coraje: "«Son difíciles porque no nos atrevemos.» Séneca",
    templanza: "«El mejor remedio contra la ira es esperar.» Séneca",
  };

  var OTRO = "__otro__";
  var st = { virtud: "justicia", modo: "iguales" };

  function $(id) { return document.getElementById(id); }

  function motivoActual() {
    var sel = $("motivo-lista").value;
    return sel === OTRO ? $("motivo-libre").value.trim() : sel;
  }

  function fechaHoy() {
    return new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function crearTarjeta(virtud, motivo, nombre, fecha) {
    var t = C.el("div", "tarjeta-v t-" + virtud + ($("ahorro").checked ? " ahorro" : ""));
    var banda = C.el("div", "banda");
    banda.innerHTML = C.icono(virtud);
    banda.appendChild(C.el("span", null, "La Ciudadela"));
    t.appendChild(banda);
    var c = C.el("div", "contenido");
    c.appendChild(C.el("span", "tipo", "Tarjeta de virtud"));
    c.appendChild(C.el("span", "nombre-virtud", C.VIRTUDES[virtud].nombre));
    var m = C.el("p", "motivo", motivo || "Por ");
    if (!motivo) {
      m.appendChild(C.el("i"));
      m.lastChild.setAttribute("style", "display:inline-block; width:78%; border-bottom:1.5px dotted #6B5A4E");
    }
    c.appendChild(m);
    c.appendChild(C.el("p", "def-t", C.VIRTUDES[virtud].nombre + " es " + C.VIRTUDES[virtud].corta.charAt(0).toLowerCase() + C.VIRTUDES[virtud].corta.slice(1) + "."));
    var para = C.el("div", "linea-para");
    para.appendChild(document.createTextNode("Para:"));
    para.appendChild(C.el("i", null, nombre || ""));
    if (fecha) para.appendChild(C.el("small", null, fecha));
    c.appendChild(para);
    c.appendChild(C.el("p", "cita-t", CITAS[virtud]));
    t.appendChild(c);
    t.appendChild(C.el("span", "mosaico"));
    return t;
  }

  function pintarControles() {
    var seg = $("elige-virtud");
    seg.innerHTML = "";
    Object.keys(C.VIRTUDES).forEach(function (id) {
      var b = C.el("button", "chip-v v-" + id);
      b.type = "button";
      b.setAttribute("aria-pressed", st.virtud === id ? "true" : "false");
      b.innerHTML = C.icono(id) + C.VIRTUDES[id].nombre;
      b.addEventListener("click", function () {
        st.virtud = id;
        pintarControles();
        rellenarMotivos();
        pintar();
      });
      seg.appendChild(b);
    });

    var modo = $("modo");
    modo.innerHTML = "";
    [["iguales", "8 tarjetas iguales"], ["blanco", "2 de cada virtud, en blanco"]].forEach(function (m) {
      var b = C.el("button", "chip", m[1]);
      b.type = "button";
      b.setAttribute("aria-pressed", st.modo === m[0] ? "true" : "false");
      b.addEventListener("click", function () { st.modo = m[0]; pintarControles(); pintar(); });
      modo.appendChild(b);
    });
  }

  function rellenarMotivos() {
    var sel = $("motivo-lista");
    sel.innerHTML = "";
    MOTIVOS[st.virtud].forEach(function (m) {
      var o = C.el("option", null, m);
      o.value = m;
      sel.appendChild(o);
    });
    var libre = C.el("option", null, "Otro motivo (escribirlo)…");
    libre.value = OTRO;
    sel.appendChild(libre);
    var vacio = C.el("option", null, "Dejar en blanco para escribir a mano");
    vacio.value = "";
    sel.appendChild(vacio);
    $("motivo-libre").classList.add("oculto");
  }

  function pintar() {
    var fecha = $("con-fecha").checked ? fechaHoy() : "";
    var nombre = $("nombre").value.trim();
    var motivo = motivoActual();
    var previa = $("previa");
    previa.innerHTML = "";
    previa.appendChild(crearTarjeta(st.virtud, motivo, nombre, fecha));

    var hoja = $("hoja");
    hoja.innerHTML = "";
    if (st.modo === "iguales") {
      for (var i = 0; i < 8; i++) hoja.appendChild(crearTarjeta(st.virtud, motivo, nombre, fecha));
    } else {
      Object.keys(C.VIRTUDES).forEach(function (v) {
        hoja.appendChild(crearTarjeta(v, "", "", ""));
        hoja.appendChild(crearTarjeta(v, "", "", ""));
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    pintarControles();
    rellenarMotivos();
    $("motivo-lista").addEventListener("change", function () {
      $("motivo-libre").classList.toggle("oculto", this.value !== OTRO);
      if (this.value === OTRO) $("motivo-libre").focus();
      pintar();
    });
    ["motivo-libre", "nombre"].forEach(function (id) { $(id).addEventListener("input", pintar); });
    ["ahorro", "con-fecha"].forEach(function (id) { $(id).addEventListener("change", pintar); });
    $("btn-imprimir").addEventListener("click", function () { window.print(); });
    pintar();
  });
})();
