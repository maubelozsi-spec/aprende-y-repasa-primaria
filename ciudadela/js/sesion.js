// ============================================================
// La Ciudadela · visor de la sesión del día (para proyectar)
//
// Seis pasos por sesión: portada, historia, pregunta, juego, idea y
// frase, y reto. Se avanza con los botones, los puntos o las flechas
// del teclado. El dispositivo del docente recuerda qué sesión toca y
// cuáles se han hecho ya (localStorage, clave "ciudadela_sesiones").
// ============================================================

(function () {
  "use strict";

  var C = window.Ciudadela;
  var DATOS = window.CIUDADELA_SESIONES;
  var SESIONES = DATOS.SESIONES;
  var BLOQUES = DATOS.BLOQUES;
  var CLAVE = "ciudadela_sesiones";

  var PASOS = ["portada", "historia", "pregunta", "juego", "idea", "reto"];

  // Se guarda el id de cada sesión (no su número), para que añadir
  // sesiones nuevas en medio no descoloque lo ya hecho.
  var guardado = C.leer(CLAVE, {});
  var estado = {
    actual: 0,
    hechas: Array.isArray(guardado.hechas) ? guardado.hechas.filter(function (h) { return typeof h === "string"; }) : [],
  };
  SESIONES.forEach(function (s, i) { if (s.id === guardado.actualId) estado.actual = i; });

  // ?n=5 abre directamente la sesión 5 (útil para enlazarla).
  var param = parseInt(new URLSearchParams(location.search).get("n"), 10);
  if (param >= 1 && param <= SESIONES.length) estado.actual = param - 1;

  function estaHecha(s) { return estado.hechas.indexOf(s.id) >= 0; }

  var paso = 0;
  var temporizador = null;

  function $(id) { return document.getElementById(id); }
  function guardarEstado() {
    C.guardar(CLAVE, { actualId: SESIONES[estado.actual].id, hechas: estado.hechas });
  }
  function sesion() { return SESIONES[estado.actual]; }

  function selloVirtud(v) {
    var info = C.VIRTUDES[v];
    return C.icono(v) + info.nombre;
  }

  function etiqueta(texto) {
    return C.el("p", "paso-etiqueta", texto);
  }

  // ---------- pasos ----------
  function pintarPortada(cuerpo, s) {
    var bloque = BLOQUES[s.bloque];
    var cont = C.el("div", "portada-sesion");
    var med = C.el("div", "medallon");
    med.innerHTML = C.icono(s.virtud) + '<span class="num">' + s.num + "</span>";
    cont.appendChild(med);
    var txt = C.el("div");
    var sello = C.el("span", "sello-virtud");
    sello.innerHTML = selloVirtud(s.virtud);
    txt.appendChild(sello);
    txt.appendChild(C.el("h2", null, s.titulo));
    txt.appendChild(C.el("p", "bloque", "Bloque " + (bloque.id + 1) + " · " + bloque.nombre + " (" + bloque.mes.toLowerCase() + "): " + bloque.sub.toLowerCase()));
    cont.appendChild(txt);
    cuerpo.appendChild(cont);
    var pista = C.el("p", "pista");
    pista.innerHTML = "Pulsa <kbd>→</kbd> para empezar. Duración: 5-10 minutos.";
    cuerpo.appendChild(pista);
  }

  function pintarHistoria(cuerpo, s) {
    cuerpo.appendChild(etiqueta("La historia"));
    cuerpo.appendChild(C.el("p", "texto-grande", s.historia));
  }

  function pintarPregunta(cuerpo, s) {
    cuerpo.appendChild(etiqueta("Pensamos juntos"));
    cuerpo.appendChild(C.el("p", "texto-enorme", s.pregunta));
    var t = C.el("div", "temporizador");
    var reloj = C.el("div", "reloj");
    var R = 26, L = 2 * Math.PI * R;
    reloj.innerHTML =
      '<svg viewBox="0 0 64 64"><circle class="fondo-reloj" cx="32" cy="32" r="' + R + '"/>' +
      '<circle class="arco" cx="32" cy="32" r="' + R + '" stroke-dasharray="' + L + '" stroke-dashoffset="0"/></svg><span>1:00</span>';
    var btn = C.el("button", "btn suave peq", "1 minuto en pareja");
    btn.type = "button";
    btn.addEventListener("click", function () {
      pararTemporizador();
      var total = 60, queda = total;
      var arco = reloj.querySelector(".arco");
      var num = reloj.querySelector("span");
      btn.disabled = true;
      temporizador = setInterval(function () {
        queda--;
        arco.setAttribute("stroke-dashoffset", String(L * (1 - queda / total)));
        num.textContent = "0:" + (queda < 10 ? "0" : "") + queda;
        if (queda <= 0) {
          pararTemporizador();
          num.textContent = "¡Ya!";
          btn.disabled = false;
          btn.textContent = "Otro minuto";
        }
      }, 1000);
    });
    t.appendChild(reloj);
    t.appendChild(btn);
    t.appendChild(C.el("p", "pista", "Primero en pareja, luego lo comentamos en voz alta."));
    cuerpo.appendChild(t);
  }

  function pintarJuego(cuerpo, s) {
    var j = s.juego;
    var cab = C.el("div", "juego-cab");
    var izq = C.el("div");
    izq.appendChild(etiqueta("El juego"));
    izq.appendChild(C.el("h2", null, j.consigna));
    izq.lastChild.style.fontSize = "clamp(26px,3.6vw,42px)";
    izq.lastChild.style.marginTop = "6px";
    cab.appendChild(izq);
    var ley = C.el("div", "leyenda");
    j.opciones.forEach(function (o) {
      ley.appendChild(C.el("span", "r-" + o.id, o.t));
    });
    cab.appendChild(ley);
    cuerpo.appendChild(cab);

    var rejilla = C.el("div", "cartas");
    var cartas = [];
    j.items.forEach(function (it) {
      var b = C.el("button", "carta");
      b.type = "button";
      b.appendChild(C.el("b", null, it.t));
      var resp = C.el("span", "respuesta", "¿Qué votáis?");
      b.appendChild(resp);
      var opcion = j.opciones.filter(function (o) { return o.id === it.r; })[0];
      b.addEventListener("click", function () {
        if (b.classList.contains("vista")) return;
        b.classList.add("vista", "r-" + it.r);
        resp.textContent = opcion ? opcion.t : "";
        if (it.x) b.appendChild(C.el("span", "explica", it.x));
      });
      cartas.push(b);
      rejilla.appendChild(b);
    });
    cuerpo.appendChild(rejilla);

    var acc = C.el("div");
    var todas = C.el("button", "btn fantasma peq", "Destapar todas");
    todas.type = "button";
    todas.addEventListener("click", function () {
      cartas.forEach(function (c) { c.click(); });
    });
    acc.appendChild(todas);
    cuerpo.appendChild(acc);
  }

  function pintarIdea(cuerpo, s) {
    cuerpo.appendChild(etiqueta("La idea"));
    cuerpo.appendChild(C.el("p", "texto-enorme", s.idea));
    var cita = C.el("blockquote", "cita");
    cita.appendChild(document.createTextNode("«" + s.frase.t + "»"));
    var pie = C.el("footer", null, s.frase.autor + " · " + s.frase.obra);
    cita.appendChild(pie);
    cuerpo.appendChild(cita);
    if (s.nota) {
      var n = C.el("div", "nota-importante");
      n.innerHTML = C.icono("ayuda");
      n.appendChild(C.el("span", null, s.nota));
      cuerpo.appendChild(n);
    }
  }

  function pintarReto(cuerpo, s) {
    cuerpo.appendChild(etiqueta("El reto de hoy"));
    var r = C.el("div", "reto");
    var sello = C.el("div", "reto-sello");
    sello.innerHTML = C.icono(s.virtud);
    r.appendChild(sello);
    r.appendChild(C.el("p", "texto-grande", s.reto));
    r.lastChild.style.fontWeight = "700";
    cuerpo.appendChild(r);

    var acc = C.el("div");
    acc.style.display = "flex";
    acc.style.gap = "12px";
    acc.style.alignItems = "center";
    acc.style.flexWrap = "wrap";
    var hecha = estaHecha(s);
    if (hecha) {
      acc.appendChild(C.el("span", "hecho-ok", "✓ Sesión hecha"));
    } else {
      var fin = C.el("button", "btn", "Terminar la sesión");
      fin.type = "button";
      fin.addEventListener("click", function () {
        if (!estaHecha(s)) estado.hechas.push(s.id);
        guardarEstado();
        pintar();
      });
      acc.appendChild(fin);
    }
    if (estado.actual < SESIONES.length - 1) {
      var sig = C.el("button", hecha ? "btn" : "btn fantasma", "Preparar la sesión " + (s.num + 1));
      sig.type = "button";
      sig.addEventListener("click", function () { abrirSesion(estado.actual + 1); });
      acc.appendChild(sig);
    }
    cuerpo.appendChild(acc);
  }

  var PINTORES = {
    portada: pintarPortada,
    historia: pintarHistoria,
    pregunta: pintarPregunta,
    juego: pintarJuego,
    idea: pintarIdea,
    reto: pintarReto,
  };

  // ---------- texto para leer en voz alta ----------
  function textoDelPaso(s) {
    switch (PASOS[paso]) {
      case "portada": return "Sesión " + s.num + ". " + s.titulo + ".";
      case "historia": return s.historia;
      case "pregunta": return s.pregunta;
      case "juego": return s.juego.consigna + " " + s.juego.items.map(function (i) { return i.t; }).join(". ") + ".";
      case "idea": return s.idea + " " + s.frase.autor + " dijo: " + s.frase.t;
      case "reto": return "El reto de hoy. " + s.reto;
    }
    return "";
  }

  function pararTemporizador() {
    if (temporizador) clearInterval(temporizador);
    temporizador = null;
  }

  // ---------- pintado general ----------
  function pintar() {
    pararTemporizador();
    C.callar();
    var s = sesion();
    var esc = $("escenario");
    esc.className = "escenario v-" + s.virtud;
    var sello = $("sello-actual");
    sello.className = "sello-virtud v-" + s.virtud;
    sello.innerHTML = C.icono(s.virtud) + s.num + "/" + SESIONES.length;
    $("titulo-actual").textContent = s.titulo;
    document.title = s.titulo + " · La Ciudadela";

    var cuerpo = $("escenario-cuerpo");
    cuerpo.innerHTML = "";
    PINTORES[PASOS[paso]](cuerpo, s);

    var puntos = $("puntos-nav");
    puntos.innerHTML = "";
    PASOS.forEach(function (_, i) {
      var b = C.el("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ir al paso " + (i + 1));
      if (i === paso) b.setAttribute("aria-current", "step");
      b.addEventListener("click", function () { irA(i); });
      puntos.appendChild(b);
    });
    $("btn-anterior").disabled = paso === 0;
    $("btn-siguiente").disabled = paso === PASOS.length - 1;
  }

  function irA(i) {
    if (i < 0 || i >= PASOS.length) return;
    paso = i;
    pintar();
  }

  function abrirSesion(i) {
    estado.actual = i;
    guardarEstado();
    paso = 0;
    pintar();
    window.scrollTo(0, 0);
  }

  // ---------- lista de sesiones ----------
  function abrirLista() {
    var velo = C.el("div", "velo");
    var modal = C.el("div", "modal ancho");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    var cuerpo = C.el("div", "modal-cuerpo");
    cuerpo.appendChild(C.el("h2", null, "Las " + SESIONES.length + " sesiones del curso"));
    var hechas = SESIONES.filter(estaHecha).length;
    cuerpo.appendChild(C.el("p", "pista", "Cuatro por semana, de septiembre a junio, en el orden del curso. Puedes elegir cualquiera. Llevas " + hechas + " de " + SESIONES.length + "."));
    var saltos = C.el("div", "saltos-bloque");
    cuerpo.appendChild(saltos);
    var lista = C.el("div", "lista-sesiones");
    BLOQUES.forEach(function (b) {
      var sec = C.el("section");
      var salto = C.el("button", "chip", b.mes.split("-")[0].slice(0, 3) + " · " + (b.id + 1));
      salto.type = "button";
      salto.title = b.nombre;
      salto.addEventListener("click", function () { lista.scrollTop = sec.offsetTop; });
      saltos.appendChild(salto);
      var enBloque = SESIONES.filter(function (s) { return s.bloque === b.id; });
      var h = C.el("h3", null, "Bloque " + (b.id + 1) + " · " + b.nombre);
      h.appendChild(C.el("small", null, b.mes + " · " + b.sub + " · " + enBloque.filter(estaHecha).length + "/" + enBloque.length + " hechas"));
      sec.appendChild(h);
      var ol = C.el("ol");
      enBloque.forEach(function (s) {
        var li = C.el("li");
        var btn = C.el("button", "fila-sesion v-" + s.virtud + (s.num - 1 === estado.actual ? " actual" : ""));
        btn.type = "button";
        btn.appendChild(C.el("span", "n", String(s.num)));
        btn.appendChild(C.el("span", "t", s.titulo));
        if (estaHecha(s)) btn.appendChild(C.el("span", "ok", "✓ hecha"));
        btn.addEventListener("click", function () { cerrar(); abrirSesion(s.num - 1); });
        li.appendChild(btn);
        ol.appendChild(li);
      });
      sec.appendChild(ol);
      lista.appendChild(sec);
    });
    cuerpo.appendChild(lista);
    var pie = C.el("div", "modal-pie");
    var cerrarBtn = C.el("button", "btn suave", "Cerrar");
    cerrarBtn.type = "button";
    pie.appendChild(cerrarBtn);
    cuerpo.appendChild(pie);
    modal.appendChild(cuerpo);
    velo.appendChild(modal);
    document.body.appendChild(velo);

    function cerrar() {
      velo.remove();
      document.removeEventListener("keydown", tecla);
    }
    function tecla(e) { if (e.key === "Escape") cerrar(); }
    cerrarBtn.addEventListener("click", cerrar);
    velo.addEventListener("click", function (e) { if (e.target === velo) cerrar(); });
    document.addEventListener("keydown", tecla);
    var actual = lista.querySelector(".actual");
    if (actual) {
      lista.scrollTop = actual.offsetTop - 60;
      actual.focus({ preventScroll: true });
    }
  }

  // ---------- pantalla completa ----------
  function alternarPantalla() {
    var doc = document;
    if (doc.fullscreenElement) {
      doc.exitFullscreen();
    } else if (doc.documentElement.requestFullscreen) {
      doc.documentElement.requestFullscreen().catch(function () {
        document.body.classList.toggle("proyectando");
      });
    } else {
      // Safari antiguo de iPad: sin API, al menos se amplía el escenario.
      document.body.classList.toggle("proyectando");
    }
  }
  document.addEventListener("fullscreenchange", function () {
    document.body.classList.toggle("proyectando", !!document.fullscreenElement);
  });

  document.addEventListener("DOMContentLoaded", function () {
    $("btn-anterior").addEventListener("click", function () { irA(paso - 1); });
    $("btn-siguiente").addEventListener("click", function () { irA(paso + 1); });
    $("btn-lista").addEventListener("click", abrirLista);
    $("btn-pantalla").addEventListener("click", alternarPantalla);
    var esc = $("btn-escuchar");
    if (!C.hayVoz()) esc.classList.add("oculto");
    esc.addEventListener("click", function () { C.hablar(textoDelPaso(sesion())); });

    document.addEventListener("keydown", function (e) {
      if (document.querySelector(".velo")) return;
      var t = e.target && e.target.tagName;
      if (t === "INPUT" || t === "TEXTAREA" || t === "SELECT") return;
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); irA(paso + 1); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); irA(paso - 1); }
    });
    pintar();
  });
})();
