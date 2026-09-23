// ============================================================
// Lecturas comprensivas para las páginas de «Textos y literatura».
//
// Cada página carga los datos de sus tipos de texto (js/lecturas/
// <tipo>.js, que rellenan window.LECTURAS[tipo]) y después este
// script, indicando qué tipos le corresponden:
//
//   <script src="../js/lecturas.js" data-tipos="cientifico,historico"></script>
//
// Añade una tercera pestaña «Lecturas» junto a Teoría y Práctica,
// sin tocar el código de cada página: las pestañas de la página
// siguen funcionando con su propio script y aquí solo se enciende o
// apaga la nueva.
//
// Tres vistas: lista de lecturas; lector para la pizarra (letra
// grande, respuestas que se destapan una a una, pantalla completa,
// lectura en voz alta); y ficha para imprimir, pensada para caber en
// un folio A4 por las dos caras.
//
// Las respuestas orientativas siguen la misma regla que las hojas de
// soluciones de los generadores: el alumnado con clave solo las ve si
// su clase lo tiene permitido (window.__puedeVerSoluciones, en
// js/layout.js).
// ============================================================

(function () {
  "use strict";

  var script = document.currentScript;
  var TIPOS_PAGINA = ((script && script.getAttribute("data-tipos")) || "").split(",").map(function (t) { return t.trim(); }).filter(Boolean);

  var TIPOS = {
    narrativa: { nombre: "Narrativa", color: "var(--color-rose)" },
    poesia: { nombre: "Poesía", color: "var(--color-plum)" },
    teatro: { nombre: "Texto teatral", color: "var(--color-amber)" },
    tira: { nombre: "Tira cómica", color: "var(--color-sky)" },
    noticia: { nombre: "La noticia", color: "var(--color-indigo)" },
    instructivo: { nombre: "Texto instructivo", color: "var(--color-teal)" },
    predictivo: { nombre: "Texto predictivo", color: "var(--color-sky)" },
    cientifico: { nombre: "Texto científico", color: "var(--color-teal)" },
    historico: { nombre: "Texto histórico", color: "var(--color-amber)" },
    descriptivo: { nombre: "Descripción", color: "var(--color-rose)" },
    discontinuo: { nombre: "Texto discontinuo", color: "var(--color-sky)" },
    dialogo: { nombre: "Diálogo y entrevista", color: "var(--color-indigo)" },
    argumentativo: { nombre: "Texto argumentativo", color: "var(--color-plum)" },
  };

  var GRUPOS = [
    { tipo: "comprension", titulo: "Comprendo el texto" },
    { tipo: "texto", titulo: "Me fijo en el tipo de texto" },
    { tipo: "opinion", titulo: "Doy mi opinión" },
    { tipo: "reflexion", titulo: "Reflexiono" },
  ];

  var CLAVE_TAM = "ar_lecturas_tam";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function lecturasDe(tipo) {
    var l = (window.LECTURAS || {})[tipo];
    return Array.isArray(l) ? l : [];
  }

  function todas() {
    var r = [];
    TIPOS_PAGINA.forEach(function (t) {
      lecturasDe(t).forEach(function (l, i) { r.push({ tipo: t, n: i + 1, l: l }); });
    });
    return r;
  }

  function puedeVerRespuestas() {
    try { return typeof window.__puedeVerSoluciones === "function" ? !!window.__puedeVerSoluciones() : true; } catch (e) { return false; }
  }

  // ---------- texto ----------
  function textoPlano(bloques) {
    var t = [];
    (bloques || []).forEach(function (b) {
      if (b.p) t.push(b.p);
      if (b.h) t.push(b.h);
      if (b.estrofa) t.push(b.estrofa.join(" "));
      if (b.dice) t.push((b.personaje || "") + ". " + b.dice);
      if (b.acot) t.push(b.acot);
      if (b.lista) t.push((b.titulo || "") + " " + b.lista.join(". "));
      if (b.tabla) t.push(b.tabla.titulo || "");
      if (b.titular) t.push(b.titular + ". " + (b.subtitulo || "") + " " + (b.entradilla || ""));
      if (b.cita) t.push(b.cita);
      if (b.dato) t.push(b.dato);
      if (b.vinetas) b.vinetas.forEach(function (v) {
        if (v.cartela) t.push(v.cartela);
        (v.bocadillos || []).forEach(function (x) { t.push(x.quien + ": " + x.t); });
      });
    });
    return t.join(" ");
  }

  function contarPalabras(l) {
    var s = textoPlano(l.texto).trim();
    return s ? s.split(/\s+/).length : 0;
  }

  function htmlBloques(bloques) {
    var h = "";
    (bloques || []).forEach(function (b) {
      if (b.titular) {
        h += '<p class="lect-noticia-tit">' + esc(b.titular) + "</p>";
        if (b.subtitulo) h += '<p class="lect-noticia-sub">' + esc(b.subtitulo) + "</p>";
        if (b.entradilla) h += '<p class="lect-noticia-entr">' + esc(b.entradilla) + "</p>";
      } else if (b.h) {
        h += "<h4>" + esc(b.h) + "</h4>";
      } else if (b.p) {
        h += "<p>" + esc(b.p) + "</p>";
      } else if (b.estrofa) {
        h += '<p class="lect-estrofa">' + b.estrofa.map(function (v) { return "<span>" + esc(v) + "</span>"; }).join("") + "</p>";
      } else if (b.personaje) {
        h += '<p class="lect-parlamento"><b>' + esc(b.personaje) + ".</b> " + (b.acot ? "<i>(" + esc(b.acot) + ")</i> " : "") + esc(b.dice) + "</p>";
      } else if (b.acot) {
        h += '<p class="lect-acot">(' + esc(b.acot) + ")</p>";
      } else if (b.lista) {
        if (b.titulo) h += '<p class="lect-lista-tit">' + esc(b.titulo) + "</p>";
        var tag = b.ordenada ? "ol" : "ul";
        h += "<" + tag + ' class="lect-lista">' + b.lista.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</" + tag + ">";
      } else if (b.tabla) {
        var t = b.tabla;
        h += '<div class="lect-tabla-wrap"><table class="lect-tabla">' + (t.titulo ? "<caption>" + esc(t.titulo) + "</caption>" : "");
        if (t.cab) h += "<thead><tr>" + t.cab.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr></thead>";
        h += "<tbody>" + (t.filas || []).map(function (f) {
          return "<tr>" + f.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>";
        }).join("") + "</tbody></table></div>";
        if (b.nota) h += '<p class="lect-tabla-nota">' + esc(b.nota) + "</p>";
      } else if (b.vinetas) {
        h += '<div class="lect-vinetas">' + b.vinetas.map(function (v, i) {
          var s = '<div class="lect-vineta"><span class="lect-vineta-n">Viñeta ' + (i + 1) + "</span>";
          if (v.cartela) s += '<div class="lect-cartela">' + esc(v.cartela) + "</div>";
          if (v.escena) s += '<div class="lect-escena">' + esc(v.escena) + "</div>";
          (v.bocadillos || []).forEach(function (x) {
            s += '<div class="lect-bocadillo ' + esc(x.forma || "dice") + '"><b>' + esc(x.quien) + "</b>" + esc(x.t) + "</div>";
          });
          return s + "</div>";
        }).join("") + "</div>";
      } else if (b.cita) {
        h += '<blockquote class="lect-cita">' + esc(b.cita) + "</blockquote>";
      } else if (b.dato) {
        // Si el propio texto ya empieza por «¿Sabías que…?», no se repite.
        h += '<p class="lect-dato' + (/^¿sab[ií]as que/i.test(b.dato) ? " sin-pref" : "") + '">' + esc(b.dato) + "</p>";
      }
    });
    return h;
  }

  function htmlVocabulario(l) {
    if (!l.vocabulario || !l.vocabulario.length) return "";
    return '<div class="lect-vocab"><b class="tit">Vocabulario</b><dl>' + l.vocabulario.map(function (v) {
      return "<dt>" + esc(v.p) + "</dt><dd>" + esc(v.d) + "</dd>";
    }).join("") + "</dl></div>";
  }

  function subtitulo(item) {
    var l = item.l;
    return [TIPOS[item.tipo] ? TIPOS[item.tipo].nombre : "", l.subtipo, l.curso ? l.curso + " de Primaria" : "", l.fuente].filter(Boolean).join(" · ");
  }

  // ---------- voz ----------
  var voz = null;
  function elegirVoz() {
    if (!window.speechSynthesis) return;
    var v = [];
    try { v = window.speechSynthesis.getVoices() || []; } catch (e) {}
    voz = v.filter(function (x) { return /^es[-_]ES/i.test(x.lang); })[0] || v.filter(function (x) { return /^es/i.test(x.lang); })[0] || null;
  }
  if (window.speechSynthesis) {
    elegirVoz();
    try { window.speechSynthesis.addEventListener("voiceschanged", elegirVoz); } catch (e) {}
  }
  function hablar(texto) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    // Algunos navegadores cortan las locuciones largas: se trocea por frases.
    var trozos = texto.match(/[^.!?¡¿…]+[.!?…]*/g) || [texto];
    trozos.forEach(function (t) {
      var u = new SpeechSynthesisUtterance(t.trim());
      u.lang = "es-ES";
      if (voz) u.voice = voz;
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    });
  }
  function callar() {
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
  }

  // ---------- montaje en la página ----------
  var panel, filtro = "todos";

  function montar() {
    if (!TIPOS_PAGINA.length || !todas().length) return;
    var tabs = document.querySelector(".tabs");
    var paneles = document.querySelectorAll(".tab-panel");
    if (!tabs || !paneles.length) return;

    var btn = document.createElement("button");
    btn.className = "tab-btn";
    btn.type = "button";
    btn.dataset.tab = "lecturas";
    btn.textContent = "Lecturas (" + todas().length + ")";
    tabs.appendChild(btn);

    panel = document.createElement("section");
    panel.id = "tab-lecturas";
    panel.className = "tab-panel";
    var ultimo = paneles[paneles.length - 1];
    ultimo.parentNode.insertBefore(panel, ultimo.nextSibling);

    function activar(encender) {
      btn.classList.toggle("active", encender);
      panel.classList.toggle("active", encender);
      if (encender) {
        document.querySelectorAll(".tab-btn").forEach(function (b) { if (b !== btn) b.classList.remove("active"); });
        document.querySelectorAll(".tab-panel").forEach(function (p) { if (p !== panel) p.classList.remove("active"); });
      }
    }
    btn.addEventListener("click", function () {
      activar(true);
      pintarLista();
      history.replaceState(null, "", "#lecturas");
    });
    document.querySelectorAll(".tab-btn").forEach(function (b) {
      if (b !== btn) b.addEventListener("click", function () {
        activar(false);
        callar();
        if (location.hash.indexOf("lectura") === 1) history.replaceState(null, "", location.pathname + location.search);
      });
    });

    var m = location.hash.match(/^#lectura=(.+)$/);
    if (m) {
      var it = todas().filter(function (x) { return x.l.id === decodeURIComponent(m[1]); })[0];
      if (it) { activar(true); abrir(it); return; }
    }
    if (location.hash === "#lecturas") { activar(true); pintarLista(); }
  }

  function pintarLista() {
    callar();
    var items = todas();
    var h = '<p class="lect-intro">' + items.length + " lecturas para trabajar en voz alta en la pizarra o imprimir. Cada ficha impresa ocupa como mucho un folio por las dos caras: el texto y las preguntas de comprensión, opinión y reflexión, con líneas para responder.</p>";
    if (TIPOS_PAGINA.length > 1) {
      h += '<div class="lect-filtros">' + ["todos"].concat(TIPOS_PAGINA).map(function (t) {
        var n = t === "todos" ? items.length : lecturasDe(t).length;
        var nombre = t === "todos" ? "Todas" : TIPOS[t].nombre;
        return '<button type="button" class="lect-filtro" data-f="' + t + '" aria-pressed="' + (filtro === t) + '">' + esc(nombre) + " (" + n + ")</button>";
      }).join("") + "</div>";
    }
    h += '<div class="lect-rejilla">';
    items.forEach(function (it, i) {
      if (filtro !== "todos" && it.tipo !== filtro) return;
      var l = it.l, pal = contarPalabras(l);
      h += '<button type="button" class="lect-tarjeta" data-i="' + i + '" style="--lect-color:' + TIPOS[it.tipo].color + '">' +
        '<span class="lect-num">' + esc(TIPOS[it.tipo].nombre) + " · " + it.n + "</span>" +
        "<h3>" + esc(l.titulo) + "</h3>" +
        '<span class="lect-fuente">' + esc(l.subtipo || "") + "</span>" +
        '<span class="lect-meta"><span class="lect-chip curso">' + esc(l.curso || "5º-6º") + "</span>" +
        '<span class="lect-chip">' + pal + " palabras</span>" +
        '<span class="lect-chip">' + (l.preguntas || []).length + " preguntas</span></span></button>";
    });
    h += "</div>";
    panel.innerHTML = h;
    panel.querySelectorAll(".lect-filtro").forEach(function (b) {
      b.addEventListener("click", function () { filtro = b.dataset.f; pintarLista(); });
    });
    panel.querySelectorAll(".lect-tarjeta").forEach(function (b) {
      b.addEventListener("click", function () { abrir(items[+b.dataset.i]); });
    });
  }

  // ---------- lector ----------
  function abrir(item) {
    callar();
    var l = item.l;
    var ver = puedeVerRespuestas();
    var color = TIPOS[item.tipo].color;
    history.replaceState(null, "", "#lectura=" + encodeURIComponent(l.id));

    var h = '<div class="lect-lector" style="--lect-color:' + color + '">' +
      '<div class="lect-barra">' +
      '<button type="button" class="btn btn-secondary" data-acc="volver">← Todas las lecturas</button>' +
      '<span class="espacio"></span>' +
      '<span class="lect-tam" role="group" aria-label="Tamaño de letra"><button type="button" data-acc="menos" aria-label="Letra más pequeña">A−</button><button type="button" data-acc="mas" aria-label="Letra más grande">A+</button></span>' +
      (window.speechSynthesis ? '<button type="button" class="btn btn-secondary" data-acc="escuchar">🔊 Escuchar</button>' : "") +
      '<button type="button" class="btn btn-secondary" data-acc="pizarra">⛶ Pizarra</button>' +
      '<button type="button" class="btn btn-primary" data-acc="imprimir">🖨 Imprimir ficha</button>' +
      (ver ? '<button type="button" class="btn btn-secondary" data-acc="imprimir-sol">Imprimir con respuestas</button>' : "") +
      "</div>" +
      '<article class="lect-cuerpo">' +
      '<h2 class="lect-titulo">' + esc(l.titulo) + "</h2>" +
      '<p class="lect-sub">' + esc(subtitulo(item)) + "</p>" +
      (l.antes ? '<div class="lect-antes"><b>Antes de leer</b>' + esc(l.antes) + "</div>" : "") +
      '<div class="lect-texto">' + htmlBloques(l.texto) + "</div>" +
      htmlVocabulario(l) +
      htmlPreguntas(l, ver) +
      (l.datos && l.datos.length ? '<p class="lect-fuente" style="margin-top:18px">Datos consultados en: ' + esc(l.datos.join("; ")) + "</p>" : "") +
      "</article></div>";
    panel.innerHTML = h;
    var lector = panel.querySelector(".lect-lector");
    var cuerpo = panel.querySelector(".lect-cuerpo");
    aplicarTam(cuerpo, leerTam());

    lector.addEventListener("click", function (e) {
      var b = e.target.closest("[data-acc]");
      if (!b) return;
      var acc = b.dataset.acc;
      if (acc === "volver") { salirPizarra(lector); pintarLista(); history.replaceState(null, "", "#lecturas"); window.scrollTo(0, panel.offsetTop - 20); }
      else if (acc === "menos" || acc === "mas") { var t = leerTam() + (acc === "mas" ? 0.15 : -0.15); t = Math.max(0.95, Math.min(2.4, t)); guardarTam(t); aplicarTam(cuerpo, t); }
      else if (acc === "escuchar") { hablar(l.titulo + ". " + textoPlano(l.texto)); }
      else if (acc === "pizarra") { alternarPizarra(lector); }
      else if (acc === "imprimir") { imprimir(item, false); }
      else if (acc === "imprimir-sol") { imprimir(item, true); }
      else if (acc === "ver") {
        var r = b.parentNode.querySelector("p");
        r.hidden = !r.hidden;
        b.textContent = r.hidden ? "Ver respuesta orientativa" : "Ocultar respuesta";
      } else if (acc === "ver-todas") {
        var mostrar = b.dataset.estado !== "on";
        b.dataset.estado = mostrar ? "on" : "off";
        b.textContent = mostrar ? "Ocultar todas las respuestas" : "Mostrar todas las respuestas";
        lector.querySelectorAll(".lect-resp").forEach(function (x) {
          x.querySelector("p").hidden = !mostrar;
          x.querySelector("button").textContent = mostrar ? "Ocultar respuesta" : "Ver respuesta orientativa";
        });
      }
    });
    window.scrollTo(0, panel.offsetTop - 20);
  }

  function htmlPreguntas(l, ver) {
    var n = 0;
    var h = '<section class="lect-preguntas"><h3 style="margin:0">Preguntas</h3>';
    if (ver) h += '<p style="margin:6px 0 0"><button type="button" class="btn btn-secondary" data-acc="ver-todas" style="font-size:0.8em">Mostrar todas las respuestas</button></p>';
    GRUPOS.forEach(function (g) {
      var ps = (l.preguntas || []).filter(function (p) { return p.tipo === g.tipo; });
      if (!ps.length) return;
      h += '<div class="lect-bloque-p"><h3>' + g.titulo + "</h3>";
      ps.forEach(function (p) {
        n++;
        h += '<div class="lect-pregunta"><span class="n">' + n + '.</span><p class="q">' + esc(p.q) + "</p>";
        if (p.opciones) h += '<ul class="lect-opciones">' + p.opciones.map(function (o, i) {
          return '<li data-l="' + "abcdef"[i] + '">' + esc(o) + "</li>";
        }).join("") + "</ul>";
        if (ver && p.r) h += '<div class="lect-resp"><button type="button" data-acc="ver">Ver respuesta orientativa</button><p hidden>' + esc(p.r) + "</p></div>";
        h += "</div>";
      });
      h += "</div>";
    });
    return h + "</section>";
  }

  function leerTam() {
    try { var v = parseFloat(localStorage.getItem(CLAVE_TAM)); return v > 0 ? v : 1.15; } catch (e) { return 1.15; }
  }
  function guardarTam(v) { try { localStorage.setItem(CLAVE_TAM, String(v)); } catch (e) {} }
  function aplicarTam(cuerpo, v) { cuerpo.style.setProperty("--lect-fs", v + "rem"); }

  function alternarPizarra(lector) {
    var on = !lector.classList.contains("pizarra");
    lector.classList.toggle("pizarra", on);
    document.body.classList.toggle("lect-pizarra-abierta", on);
    if (on && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
    if (!on && document.fullscreenElement) document.exitFullscreen().catch(function () {});
    lector.querySelector('[data-acc="pizarra"]').textContent = on ? "✕ Salir de la pizarra" : "⛶ Pizarra";
  }
  function salirPizarra(lector) {
    if (lector.classList.contains("pizarra")) alternarPizarra(lector);
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var l = document.querySelector(".lect-lector.pizarra");
    if (l) alternarPizarra(l);
  });
  document.addEventListener("fullscreenchange", function () {
    var l = document.querySelector(".lect-lector.pizarra");
    if (l && !document.fullscreenElement) alternarPizarra(l);
  });

  // ---------- impresión ----------
  function htmlFicha(item, conRespuestas) {
    var l = item.l, n = 0;
    var h = '<div class="lf">' +
      '<div class="lf-cab"><span>Nombre: </span><span>Curso: </span><span>Fecha: </span></div>' +
      "<h1>" + esc(l.titulo) + "</h1>" +
      '<p class="lf-sub">' + esc(subtitulo(item)) + "</p>" +
      '<div class="lect-texto">' + htmlBloques(l.texto) + "</div>" +
      htmlVocabulario(l) +
      '<div class="lf-preguntas">';
    GRUPOS.forEach(function (g) {
      var ps = (l.preguntas || []).filter(function (p) { return p.tipo === g.tipo; });
      if (!ps.length) return;
      h += "<h2>" + g.titulo + "</h2>";
      ps.forEach(function (p) {
        n++;
        h += '<div class="lf-p"><p class="q"><b>' + n + ".</b>" + esc(p.q) + "</p>";
        if (p.opciones) h += '<div class="lf-op">' + p.opciones.map(function (o, i) { return "<span>☐ " + "abcdef"[i] + ") " + esc(o) + "</span>"; }).join(" ") + "</div>";
        if (conRespuestas) {
          if (p.r) h += '<p class="lf-sol">' + esc(p.r) + "</p>";
        } else if (!p.opciones) {
          for (var i = 0; i < (p.lineas || 2); i++) h += '<div class="lf-linea"></div>';
        }
        h += "</div>";
      });
    });
    h += "</div>";
    h += '<p class="lf-pie">Aprende y Repasa · Lecturas de ' + esc(TIPOS[item.tipo].nombre.toLowerCase()) +
      (l.datos && l.datos.length ? " · Datos: " + esc(l.datos.join("; ")) : "") + (conRespuestas ? " · HOJA DEL DOCENTE CON RESPUESTAS ORIENTATIVAS" : "") + "</p>";
    return h + "</div>";
  }

  function imprimir(item, conRespuestas) {
    var cont = document.getElementById("lect-imprimir");
    if (!cont) {
      cont = document.createElement("div");
      cont.id = "lect-imprimir";
      document.body.appendChild(cont);
    }
    cont.innerHTML = htmlFicha(item, conRespuestas);
    document.body.classList.add("lect-imprimiendo");
    var limpiar = function () {
      document.body.classList.remove("lect-imprimiendo");
      window.removeEventListener("afterprint", limpiar);
    };
    // La clase solo cambia la hoja de impresión (@media print), así que
    // si un navegador no avisa con afterprint no pasa nada en pantalla.
    window.addEventListener("afterprint", limpiar);
    window.print();
  }

  // Para las pruebas automáticas de maquetación (número de páginas).
  window.__lecturas = { todas: todas, htmlFicha: htmlFicha, contarPalabras: contarPalabras };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montar);
  else montar();
})();
