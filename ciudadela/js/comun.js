// ============================================================
// La Ciudadela · código común a todas las páginas
//
//   - ICONOS: dibujos SVG propios (nada de emojis en la interfaz
//     principal: se ven distinto en cada dispositivo).
//   - La barra superior, con la vuelta a Aprende y Repasa, el modo
//     de lectura fácil y el botón rojo de "Necesito ayuda", que está
//     en TODAS las páginas: es la salida para lo que el estoicismo
//     no debe resolver (acoso, maltrato, miedo a alguien).
//   - La voz: lectura en voz alta en castellano.
//
// Nada de lo que se hace en la Ciudadela sale del dispositivo: no
// hay Firebase ni cuentas. El diario y la sesión en curso se guardan
// en localStorage y solo en este navegador.
// ============================================================

(function () {
  "use strict";

  var trazo = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';

  var ICONOS = {
    ciudadela:
      '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M5 35V16l3-2 3 2v3h3V11l6-6 6 6v8h3v-3l3-2 3 2v19z" fill="var(--terracota)"/>' +
      '<path d="M17 35v-6a3 3 0 0 1 6 0v6z" fill="var(--noche)"/><path d="M20 5v-3l4 1.4-4 1.4" fill="var(--oro)"/>' +
      '<path d="M5 35h30" stroke="var(--tinta)" stroke-width="1.6" stroke-linecap="round"/></svg>',
    sabiduria:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M6 3.5l2.6 3h6.8L18 3.5V13a6 6 0 0 1-12 0z"/>' +
      '<circle cx="9.5" cy="10.5" r="2"/><circle cx="14.5" cy="10.5" r="2"/><path d="M11.2 13.4l.8 1.2.8-1.2"/><path d="M9.5 19.5v1.8M14.5 19.5v1.8"/></svg>',
    justicia:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M12 4v16M8 20.5h8M4.5 7h15"/><circle cx="12" cy="4" r="1"/>' +
      '<path d="M6.5 7l-3 6h6z"/><path d="M3.5 13a3 3 0 0 0 6 0"/><path d="M17.5 7l-3 6h6z"/><path d="M14.5 13a3 3 0 0 0 6 0"/></svg>',
    coraje:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M12 3l7.5 3v5.5c0 4.8-3.4 8.3-7.5 9.9-4.1-1.6-7.5-5.1-7.5-9.9V6z"/>' +
      '<path d="M12 6.5v11.5M8 11.5h8"/></svg>',
    templanza:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M9.5 3h5M10.3 3v3.2C7.4 7.6 6.3 10 6.3 12.7c0 3.9 2.7 6.8 5.7 8.3 3-1.5 5.7-4.4 5.7-8.3 0-2.7-1.1-5.1-4-6.5V3"/>' +
      '<path d="M7.6 8.3C5.4 8.2 4.5 10 5.3 12M16.4 8.3c2.2-.1 3.1 1.7 2.3 3.7"/><path d="M6.6 13.5h10.8"/></svg>',
    sesion:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/><path d="M10 8l4 2-4 2z"/></svg>',
    calma:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M3 9h11a3 3 0 1 0-3-3"/><path d="M3 13h15a3 3 0 1 1-3 3"/><path d="M3 17h7"/></svg>',
    diario:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19"/><path d="M9 7.5h6M9 11h4"/></svg>',
    sabios:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M3 20h18M4 17h16M5 17V9M9 17V9M15 17V9M19 17V9M3.5 9h17L12 4z"/></svg>',
    tarjetas:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><rect x="3" y="6" width="13" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/><path d="M9.5 10.5l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z"/></svg>',
    guia:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>',
    ayuda:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M12 21s-7.5-4.4-9.3-9.2C1.5 8.4 3.6 5 7 5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.4 0 5.5 3.4 4.3 6.8C19.5 16.6 12 21 12 21z"/></svg>',
    telefono:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/></svg>',
    persona:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 20.5c0-3.9 3.1-7 7-7s7 3.1 7 7"/></svg>',
    candado:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>',
    altavoz:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
    izquierda:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    derecha:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    pantalla:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    imprimir:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/></svg>',
    barco:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M3 16.5h18l-3 4H6z"/><path d="M12 3v13.5"/><path d="M12 4l6.5 10H12"/><path d="M12 7l-5 7h5"/></svg>',
    pluma:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M20 3.5C11 4.5 7 10 6 17l-2 3.5"/><path d="M7.5 13.5c3.5 0 7-1.5 9.5-5.5"/><path d="M10 10.5c2 0 4-.6 5.8-2"/></svg>',
    cadena:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M10 7.5 7.5 5a3.2 3.2 0 0 0-4.5 4.5L5.5 12"/><path d="M14 16.5 16.5 19a3.2 3.2 0 0 0 4.5-4.5L18.5 12"/><path d="M9 2.5 10 5M2.5 9 5 10M15 21.5 14 19M21.5 15 19 14"/></svg>',
    laurel:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M12 20.5c-5 0-8-4-8-10"/><path d="M12 20.5c5 0 8-4 8-10"/>' +
      '<path d="M4.3 13.5c1.8-.2 3 .8 3.2 2.5-1.8.2-3-.8-3.2-2.5zM4 9.5c1.7-.5 3 .3 3.5 2-1.7.5-3-.3-3.5-2zM5 5.5c1.6-.7 3-.1 3.7 1.5-1.6.7-3 .1-3.7-1.5z"/>' +
      '<path d="M19.7 13.5c-1.8-.2-3 .8-3.2 2.5 1.8.2 3-.8 3.2-2.5zM20 9.5c-1.7-.5-3 .3-3.5 2 1.7.5 3-.3 3.5-2zM19 5.5c-1.6-.7-3-.1-3.7 1.5 1.6.7 3 .1 3.7-1.5z"/></svg>',
    papelera:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    hoja:
      '<svg viewBox="0 0 24 24" ' + trazo + ' aria-hidden="true"><path d="M20 4C9 4 4 9 4 20c11 0 16-5 16-16z"/><path d="M4 20L14 10"/></svg>',
  };

  var VIRTUDES = {
    sabiduria: { id: "sabiduria", nombre: "Sabiduría", corta: "Pensar bien antes de actuar", pregunta: "¿Qué es lo más sensato aquí?" },
    justicia: { id: "justicia", nombre: "Justicia", corta: "Tratar bien a los demás y ser justo", pregunta: "¿Qué es lo justo para todos?" },
    coraje: { id: "coraje", nombre: "Coraje", corta: "Hacer lo correcto aunque cueste o dé miedo", pregunta: "¿Qué haría si fuera valiente?" },
    templanza: { id: "templanza", nombre: "Templanza", corta: "Controlarme y encontrar el punto justo", pregunta: "¿Cuál es el punto justo, sin pasarme?" },
  };

  function icono(nombre) {
    return ICONOS[nombre] || "";
  }

  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function leer(clave, porDefecto) {
    try {
      var v = localStorage.getItem(clave);
      return v == null ? porDefecto : JSON.parse(v);
    } catch (e) {
      return porDefecto;
    }
  }

  function guardar(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (e) {
      return false;
    }
  }

  // ---------- voz ----------
  // speechSynthesis ignora utterance.lang si no se le asigna una voz
  // concreta (Chrome en Windows lee entonces con la voz inglesa), así
  // que se busca una voz de España y, si no la hay, cualquier "es".
  var voz = null;
  function elegirVoz() {
    if (!window.speechSynthesis) return;
    var todas = [];
    try { todas = window.speechSynthesis.getVoices() || []; } catch (e) {}
    voz =
      todas.filter(function (v) { return /^es[-_]ES/i.test(v.lang); })[0] ||
      todas.filter(function (v) { return /^es/i.test(v.lang); })[0] ||
      null;
  }
  if (window.speechSynthesis) {
    elegirVoz();
    window.speechSynthesis.onvoiceschanged = elegirVoz;
  }
  function hayVoz() {
    return !!window.speechSynthesis;
  }
  function hablar(texto) {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(texto);
      u.lang = "es-ES";
      if (voz) u.voice = voz;
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }
  function callar() {
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
  }

  // ---------- modal de ayuda ----------
  function abrirAyuda() {
    if (document.getElementById("velo-ayuda")) return;
    var velo = el("div", "velo");
    velo.id = "velo-ayuda";
    velo.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="ayuda-titulo">' +
      '<div class="modal-cuerpo">' +
      '<p class="eyebrow" style="color:var(--ayuda)">Necesito ayuda</p>' +
      '<h2 id="ayuda-titulo">Hay cosas que no tienes que aguantar tú solo ni tú sola</h2>' +
      '<p class="grande">Si alguien te hace daño, te amenaza o te da miedo, o si estás muy triste desde hace tiempo, eso <b>no</b> se arregla aguantando. ' +
      "Lo que sí depende de ti es contarlo. Pedir ayuda es de valientes.</p>" +
      '<div class="contacto">' + icono("persona") +
      "<div><b>Un adulto de confianza</b><span>Tu maestro o maestra, tu familia, el orientador u orientadora del cole. Díselo hoy.</span></div></div>" +
      '<div class="contacto">' + icono("telefono") +
      '<div><b><a href="tel:900202010">900 20 20 10</a></b><span>Teléfono de la Fundación ANAR para niños, niñas y adolescentes. Gratis, confidencial y a cualquier hora.</span></div></div>' +
      '<div class="contacto">' + icono("telefono") +
      '<div><b><a href="tel:112">112</a></b><span>Si hay peligro ahora mismo.</span></div></div>' +
      '<div class="modal-pie"><button type="button" class="btn" id="cerrar-ayuda">Entendido</button></div>' +
      "</div></div>";
    document.body.appendChild(velo);
    var cerrar = function () {
      velo.remove();
      document.removeEventListener("keydown", tecla);
    };
    var tecla = function (e) { if (e.key === "Escape") cerrar(); };
    velo.addEventListener("click", function (e) { if (e.target === velo) cerrar(); });
    document.getElementById("cerrar-ayuda").addEventListener("click", cerrar);
    document.addEventListener("keydown", tecla);
    document.getElementById("cerrar-ayuda").focus();
  }

  // ---------- lectura fácil ----------
  function aplicarLectura(activa) {
    document.body.classList.toggle("lectura-facil", !!activa);
  }

  // ---------- barra superior ----------
  // Cada página pone <header id="barra"></header>; aquí se rellena.
  function pintarBarra() {
    var cont = document.getElementById("barra");
    if (!cont) return;
    var enPortada = document.body.getAttribute("data-pagina") === "portada";
    cont.innerHTML =
      '<div class="teselas"></div>' +
      '<div class="contenedor"><div class="barra">' +
      '<a class="marca" href="index.html">' + icono("ciudadela") +
      "<span><b>La Ciudadela</b><small>Educación emocional con los estoicos</small></span></a>" +
      '<div class="barra-acciones">' +
      (enPortada
        ? '<a class="volver-ar" href="../index.html">← Aprende y Repasa</a>'
        : '<a class="volver-ar" href="index.html">← Inicio</a>') +
      '<button type="button" class="chip" id="btn-lectura" aria-pressed="false">Lectura fácil</button>' +
      '<button type="button" class="btn-ayuda" id="btn-ayuda">' + icono("ayuda") + "Necesito ayuda</button>" +
      "</div></div></div>";

    var activa = leer("ciudadela_lectura", false);
    aplicarLectura(activa);
    var bl = document.getElementById("btn-lectura");
    bl.setAttribute("aria-pressed", activa ? "true" : "false");
    bl.addEventListener("click", function () {
      var nueva = bl.getAttribute("aria-pressed") !== "true";
      bl.setAttribute("aria-pressed", nueva ? "true" : "false");
      aplicarLectura(nueva);
      guardar("ciudadela_lectura", nueva);
    });
    document.getElementById("btn-ayuda").addEventListener("click", abrirAyuda);
  }

  // Sustituye <i data-icono="nombre"></i> por el SVG correspondiente.
  function pintarIconos(raiz) {
    var nodos = (raiz || document).querySelectorAll("[data-icono]");
    for (var i = 0; i < nodos.length; i++) {
      nodos[i].innerHTML = icono(nodos[i].getAttribute("data-icono"));
    }
  }

  window.Ciudadela = {
    ICONOS: ICONOS,
    VIRTUDES: VIRTUDES,
    icono: icono,
    el: el,
    leer: leer,
    guardar: guardar,
    hablar: hablar,
    callar: callar,
    hayVoz: hayVoz,
    abrirAyuda: abrirAyuda,
    pintarIconos: pintarIconos,
  };

  document.addEventListener("DOMContentLoaded", function () {
    pintarBarra();
    pintarIconos();
  });
})();
