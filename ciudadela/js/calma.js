// ============================================================
// La Ciudadela · kit de calma
//
// Recorrido guiado y CERRADO (sin texto libre ni IA): el alumno solo
// elige entre opciones, así que no hay nada que pueda responderle mal
// ni datos sensibles que guardar. Sigue el método de la portada:
//   0. Comprobación de seguridad  -> si alguien le hace daño, ayuda
//   1. Siento   -> nombrar la emoción e intensidad (validándola)
//   2. Respiro  -> tres respiraciones guiadas (4 s dentro, 2, 6 fuera)
//   3. Pienso   -> qué me estoy diciendo y otra forma de verlo
//   4. Separo   -> qué depende de mí y qué no
//   5. Elijo    -> una acción concreta, desde una de las virtudes
//   6. Mi plan  -> resumen, y cómo estoy ahora. Solo se guarda en el
//                  diario si el alumno lo pide.
// ============================================================

(function () {
  "use strict";

  var C = window.Ciudadela;

  var EMOCIONES = [
    {
      id: "enfado", nombre: "Enfado", cara: "😠", color: "coraje",
      cuerpo: "Calor en la cara, puños apretados, ganas de gritar o de empujar.",
      valida: "El enfado aparece cuando algo nos parece injusto o nos impide lo que queremos. Sentirlo está bien. Lo importante es lo que haces con él.",
      pensamientos: [
        { t: "Lo ha hecho a propósito", otra: "¿Lo sé seguro? ¿Podría haber sido sin querer?" },
        { t: "Siempre me pasa a mí", otra: "¿Siempre? ¿O ha sido esta vez y alguna otra?" },
        { t: "No es justo", otra: "Puede que no lo sea. ¿Cómo puedo decirlo con calma para que me escuchen?" },
      ],
      noDepende: ["Lo que ha hecho la otra persona", "Que ya haya pasado"],
      depende: ["Cómo respondo ahora", "Decir con palabras lo que me molesta", "Alejarme un momento para calmarme", "Pedir a un adulto que ayude"],
      virtudes: {
        sabiduria: "Esperar a estar más tranquilo antes de decidir nada.",
        justicia: "Decir «eso me ha molestado» sin insultar ni hacer daño.",
        coraje: "Hablar con la persona cuando esté más calmado.",
        templanza: "Alejarme un momento y respirar hasta que baje el calor.",
      },
    },
    {
      id: "tristeza", nombre: "Tristeza", cara: "😢", color: "sabiduria",
      cuerpo: "Nudo en la garganta, ganas de llorar, pocas ganas de hacer cosas.",
      valida: "La tristeza aparece cuando perdemos algo o algo no sale como esperábamos. Llorar no es de débiles: ayuda a soltar.",
      pensamientos: [
        { t: "Nada va a mejorar", otra: "Ahora lo veo todo oscuro, pero las emociones cambian como el tiempo. ¿Recuerdas otra vez que se pasó?" },
        { t: "Nadie me quiere", otra: "¿Quién me ha tratado bien esta semana, aunque sea en algo pequeño?" },
        { t: "Todo me sale mal", otra: "¿Todo? Piensa en una sola cosa que te haya salido bien." },
      ],
      noDepende: ["Lo que ya ha pasado", "Que la tristeza se vaya en un momento"],
      depende: ["Contarle a alguien cómo me siento", "Hacer algo pequeño que me guste", "Dejarme llorar si lo necesito"],
      nota: "Si llevas muchos días triste, cuéntaselo a un adulto de confianza. No tienes que llevarlo tú solo ni tú sola.",
      virtudes: {
        sabiduria: "Recordar que las emociones son como el tiempo: cambian.",
        justicia: "Ser amable conmigo, como lo sería con un amigo o una amiga.",
        coraje: "Contarle a alguien de confianza cómo me siento.",
        templanza: "Hacer una cosa pequeña que me siente bien: dibujar, pasear, escuchar música.",
      },
    },
    {
      id: "miedo", nombre: "Miedo", cara: "😨", color: "templanza",
      cuerpo: "Corazón rápido, tripa encogida, ganas de huir o de esconderme.",
      valida: "El miedo nos avisa de un peligro. A veces el peligro es real y hay que pedir ayuda. Otras veces nuestra cabeza lo hace más grande de lo que es.",
      pensamientos: [
        { t: "Va a salir fatal", otra: "¿Qué está pasando de verdad y qué me estoy imaginando?" },
        { t: "No voy a poder", otra: "¿Cuál es el paso más pequeño que sí puedo dar?" },
        { t: "Algo malo va a pasar", otra: "Si pasara algo malo, ¿a quién podría pedir ayuda?" },
      ],
      noDepende: ["Lo que va a pasar mañana", "Lo que hagan los demás"],
      depende: ["Prepararme", "Pedir ayuda a un adulto", "Respirar despacio", "Dar un paso pequeño"],
      nota: "Si tienes miedo de una persona, eso no se aguanta: cuéntaselo hoy a un adulto de confianza.",
      virtudes: {
        sabiduria: "Separar lo que es real de lo que me imagino.",
        justicia: "Si tengo miedo por algo que le pasa a otra persona, avisar a un adulto.",
        coraje: "Dar un paso pequeño aunque tenga miedo.",
        templanza: "Respirar despacio y hacer las cosas de una en una.",
      },
    },
    {
      id: "nervios", nombre: "Nervios", cara: "😬", color: "justicia",
      cuerpo: "Mariposas en la tripa, manos sudadas, no puedo estarme quieto.",
      valida: "Los nervios aparecen antes de algo importante: un examen, un partido, hablar en público. Significan que te importa.",
      pensamientos: [
        { t: "Me voy a quedar en blanco", otra: "Si me quedo en blanco, puedo respirar y volver a empezar. No pasa nada." },
        { t: "Todos me van a mirar", otra: "Los demás también se ponen nerviosos. Nadie espera que lo hagas perfecto." },
        { t: "Tiene que salir perfecto", otra: "No tiene que ser perfecto: tiene que ser mi mejor intento." },
      ],
      noDepende: ["El resultado exacto", "Las preguntas o lo que pase"],
      depende: ["Prepararme", "Dormir bien", "Respirar antes de empezar", "Pensar en lo que sí sé"],
      virtudes: {
        sabiduria: "Repasar lo que ya sé, en vez de lo que no sé.",
        justicia: "Animar también a otra persona que esté nerviosa.",
        coraje: "Empezar aunque tenga nervios.",
        templanza: "Hacer una respiración lenta antes de empezar.",
      },
    },
    {
      id: "verguenza", nombre: "Vergüenza", cara: "😳", color: "justicia",
      cuerpo: "Cara roja, ganas de desaparecer, no quiero mirar a nadie.",
      valida: "La vergüenza aparece cuando creemos que los demás nos juzgan. Le pasa a todo el mundo, y suele durar menos de lo que parece.",
      pensamientos: [
        { t: "Todos se están riendo de mí", otra: "La mayoría está pensando en sus propias cosas." },
        { t: "Nunca se les va a olvidar", otra: "¿Tú te acuerdas de lo que le pasó a otra persona la semana pasada? Casi nadie se acordará." },
        { t: "Soy un desastre", otra: "Me he equivocado en una cosa. Eso no me convierte en un desastre." },
      ],
      noDepende: ["Lo que piensen los demás", "Que ya haya pasado"],
      depende: ["Seguir con lo que estaba haciendo", "Reírme de mí con cariño, si me apetece", "Hablarlo con un amigo o una amiga"],
      virtudes: {
        sabiduria: "Recordar que equivocarse es parte de aprender.",
        justicia: "Tratarme como trataría a un amigo al que le pasa lo mismo.",
        coraje: "Levantar la cabeza y seguir.",
        templanza: "No darle más vueltas de las necesarias.",
      },
    },
    {
      id: "celos", nombre: "Celos o envidia", cara: "😒", color: "templanza",
      cuerpo: "Un pinchazo por dentro, ganas de compararme o de fastidiar.",
      valida: "Los celos y la envidia aparecen cuando alguien tiene algo que queremos, o cuando tenemos miedo de perder a alguien. Nos dicen qué nos importa.",
      pensamientos: [
        { t: "Tiene más suerte que yo", otra: "No sé todo lo que le ha costado ni lo que le pasa por dentro." },
        { t: "Ya no me quiere a mí", otra: "Querer a otra persona no significa dejar de quererme a mí." },
        { t: "Yo nunca consigo nada", otra: "¿Qué puedo aprender de cómo lo ha conseguido?" },
      ],
      noDepende: ["Lo que tienen o consiguen los demás", "A quién quieren los demás"],
      depende: ["Alegrarme por la otra persona", "Trabajar en lo que yo quiero", "Decir cómo me siento sin atacar"],
      virtudes: {
        sabiduria: "Preguntarme qué es lo que de verdad quiero.",
        justicia: "Felicitar a la otra persona por lo que ha conseguido.",
        coraje: "Decir que me siento dejado de lado, sin enfadarme.",
        templanza: "Dejar de compararme todo el rato.",
      },
    },
    {
      id: "frustracion", nombre: "Frustración", cara: "😤", color: "coraje",
      cuerpo: "Me quiero rendir, tengo ganas de romper o tirar algo.",
      valida: "La frustración aparece cuando algo nos cuesta más de lo que esperábamos. Es la señal de que estás aprendiendo algo difícil.",
      pensamientos: [
        { t: "No sirvo para esto", otra: "Todavía no sé hacerlo. Todavía." },
        { t: "Es imposible", otra: "Es difícil, no imposible. ¿Qué parte pequeña sí puedo hacer?" },
        { t: "Lo dejo", otra: "Puedo descansar cinco minutos y volver a intentarlo." },
      ],
      noDepende: ["Lo difícil que es la tarea", "Aprenderlo todo de golpe"],
      depende: ["Dividirlo en partes pequeñas", "Pedir ayuda", "Descansar y volver", "Probar de otra manera"],
      virtudes: {
        sabiduria: "Buscar otra manera de hacerlo.",
        justicia: "Pedir ayuda sin vergüenza: todos la necesitamos.",
        coraje: "Volver a intentarlo una vez más.",
        templanza: "Parar cinco minutos antes de seguir.",
      },
    },
    {
      id: "soledad", nombre: "Soledad", cara: "🥺", color: "sabiduria",
      cuerpo: "Me siento aparte, como si nadie me viera.",
      valida: "Sentirse solo o sola duele. Todas las personas necesitamos a otras: es parte de ser humanos.",
      pensamientos: [
        { t: "Nadie quiere estar conmigo", otra: "¿Hay alguien con quien todavía no he probado a hablar?" },
        { t: "Siempre me dejan fuera", otra: "Hoy me he sentido fuera. Eso no significa que vaya a ser siempre así." },
        { t: "No encajo en ningún sitio", otra: "Seguro que hay alguien parecido a mí que también busca compañía." },
      ],
      noDepende: ["Lo que decidan los demás", "Caerle bien a todo el mundo"],
      depende: ["Acercarme a alguien que también esté solo", "Proponer un juego", "Contárselo a un adulto si pasa a menudo"],
      nota: "Si te dejan fuera a propósito una y otra vez, eso no se aguanta: cuéntaselo a un adulto de confianza.",
      virtudes: {
        sabiduria: "Fijarme en quién más podría estar solo.",
        justicia: "Invitar a jugar a alguien que esté solo.",
        coraje: "Acercarme y preguntar: «¿Puedo jugar?».",
        templanza: "Hacer algo que me guste mientras tanto, sin hundirme.",
      },
    },
    {
      id: "nose", nombre: "No sé qué siento", cara: "🌀", color: "general",
      cuerpo: "Algo se mueve por dentro, pero no sé qué es.",
      valida: "A veces las emociones se mezclan. No pasa nada por no saber ponerles nombre todavía.",
      pensamientos: [
        { t: "Me pasa algo raro", otra: "No hace falta entenderlo todo ahora. Primero, calma." },
        { t: "No sé qué me pasa", otra: "Puedo fijarme en mi cuerpo: ¿dónde lo noto?" },
        { t: "Todo es un lío", otra: "Vamos a ordenarlo poco a poco, de una cosa en una cosa." },
      ],
      noDepende: ["Lo que siento ahora mismo"],
      depende: ["Respirar", "Contárselo a alguien", "Dibujar o escribir lo que noto"],
      virtudes: {
        sabiduria: "Darme tiempo para entender lo que siento.",
        justicia: "Ser paciente conmigo.",
        coraje: "Contarle a alguien que no me encuentro bien.",
        templanza: "Parar y respirar antes de hacer nada.",
      },
    },
  ];

  var ETIQUETAS = ["Siento", "Respiro", "Pienso", "Separo", "Elijo"];
  var COLOR_PASO = ["sabiduria", "general", "justicia", "coraje", "templanza"];

  var st = { paso: -1, emocion: null, intensidad: 0, pensamiento: null, virtud: null, despues: 0 };

  function $(id) { return document.getElementById(id); }

  function colorE(e) {
    var c = e.color === "general" ? "terracota" : e.color;
    return "--e:var(--" + c + ");--e-suave:var(--" + c + "-suave)";
  }

  function pintarPasos() {
    var ol = $("pasos-calma");
    ol.innerHTML = "";
    ETIQUETAS.forEach(function (t, i) {
      var li = C.el("li", "v-" + COLOR_PASO[i], t);
      if (i < st.paso) li.classList.add("hecho");
      if (i === st.paso) li.classList.add("ahora");
      ol.appendChild(li);
    });
    ol.classList.toggle("oculto", st.paso < 0 || st.paso > 4);
  }

  function tarjeta(color) {
    var t = C.el("div", "tarjeta-calma v-" + color);
    return t;
  }

  function boton(texto, clase, fn) {
    var b = C.el("button", clase || "btn", texto);
    b.type = "button";
    b.addEventListener("click", fn);
    return b;
  }

  function pie(atrasFn, siguienteTexto, siguienteFn, siguienteActivo) {
    var p = C.el("div", "acciones-calma");
    p.appendChild(atrasFn ? boton("← Atrás", "btn fantasma", atrasFn) : C.el("span"));
    if (siguienteTexto) {
      var s = boton(siguienteTexto, "btn", siguienteFn);
      if (siguienteActivo === false) s.disabled = true;
      p.appendChild(s);
    }
    return p;
  }

  function ir(paso) {
    st.paso = paso;
    C.callar();
    pintar();
    var cab = document.querySelector(".cabecera-pagina");
    if (cab && paso > 0) window.scrollTo({ top: cab.offsetTop + cab.offsetHeight - 10, behavior: "smooth" });
  }

  // ---------- 0 · inicio y seguridad ----------
  function pintarInicio(cont) {
    var t = tarjeta("general");
    t.appendChild(C.el("h2", null, "Antes de empezar"));
    var seg = C.el("div", "pregunta-seguridad");
    seg.appendChild(C.el("p", null, "¿Alguien te está haciendo daño, o te da miedo alguien?"));
    var fila = C.el("div", "fila");
    fila.appendChild(boton("Sí", "btn", function () {
      C.abrirAyuda("kit-calma");
    }));
    fila.appendChild(boton("No, es otra cosa", "btn suave", function () { ir(0); }));
    seg.appendChild(fila);
    t.appendChild(seg);
    t.appendChild(C.el("p", "sub", "Si la respuesta es sí, este kit no es suficiente: lo importante es que se lo cuentes a un adulto. Con el botón «Sí» puedes avisar a tu maestro o maestra. Si no, vamos paso a paso."));
    cont.appendChild(t);
  }

  // ---------- 1 · siento ----------
  function pintarSiento(cont) {
    var t = tarjeta("sabiduria");
    t.appendChild(C.el("h2", null, "¿Qué sientes ahora?"));
    t.appendChild(C.el("p", "sub", "Elige la que más se parezca. Todas las emociones están permitidas."));
    var grid = C.el("div", "emociones");
    EMOCIONES.forEach(function (e) {
      var b = C.el("button", "emo");
      b.type = "button";
      b.setAttribute("style", colorE(e));
      b.setAttribute("aria-pressed", st.emocion === e ? "true" : "false");
      b.appendChild(C.el("span", "cara", e.cara));
      b.appendChild(C.el("b", null, e.nombre));
      b.addEventListener("click", function () {
        st.emocion = e;
        st.pensamiento = null;
        st.virtud = null;
        pintar();
      });
      grid.appendChild(b);
    });
    t.appendChild(grid);

    if (st.emocion) {
      var e = st.emocion;
      var v = C.el("div", "validacion");
      v.setAttribute("style", colorE(e));
      v.appendChild(C.el("span", "cara", e.cara));
      var txt = C.el("div");
      txt.appendChild(C.el("p", null, e.valida));
      txt.appendChild(C.el("p", "cuerpo", "En el cuerpo se nota así: " + e.cuerpo.charAt(0).toLowerCase() + e.cuerpo.slice(1)));
      v.appendChild(txt);
      t.appendChild(v);
      t.appendChild(termometro("¿Cómo de fuerte es?", "intensidad", e));
    }
    t.appendChild(pie(function () { ir(-1); }, "Siguiente", function () { ir(1); }, !!(st.emocion && st.intensidad)));
    cont.appendChild(t);
  }

  function termometro(pregunta, campo, e) {
    var w = C.el("div");
    w.appendChild(C.el("p", null, pregunta));
    w.firstChild.style.fontWeight = "800";
    w.firstChild.style.marginBottom = "8px";
    var fila = C.el("div", "termometro");
    fila.setAttribute("style", colorE(e));
    fila.appendChild(C.el("small", null, "Poco"));
    var puntos = C.el("div", "puntos");
    for (var i = 1; i <= 5; i++) {
      (function (n) {
        var b = C.el("button", null, String(n));
        b.type = "button";
        b.setAttribute("aria-label", "Nivel " + n + " de 5");
        b.setAttribute("aria-pressed", st[campo] === n ? "true" : "false");
        b.addEventListener("click", function () { st[campo] = n; pintar(); });
        puntos.appendChild(b);
      })(i);
    }
    fila.appendChild(puntos);
    fila.appendChild(C.el("small", null, "Muchísimo"));
    w.appendChild(fila);
    return w;
  }

  // ---------- 2 · respiro ----------
  var ciclo = null;
  function pararCiclo() { if (ciclo) clearTimeout(ciclo); ciclo = null; }

  function pintarRespiro(cont) {
    var t = tarjeta("general");
    t.appendChild(C.el("h2", null, "Respira con el globo"));
    t.appendChild(C.el("p", "sub", "Toma aire mientras el globo crece y suéltalo despacio mientras se hace pequeño. Tres veces."));
    var r = C.el("div", "respira");
    var globo = C.el("div", "globo", "Pulsa empezar");
    var ronda = C.el("p", "ronda", "");
    r.appendChild(globo);
    r.appendChild(ronda);
    var empezar = boton("Empezar", "btn", function () {
      empezar.disabled = true;
      var n = 0;
      function una() {
        n++;
        if (n > 3) {
          globo.className = "globo";
          globo.textContent = "¡Muy bien!";
          ronda.textContent = "Tres respiraciones hechas";
          empezar.disabled = false;
          empezar.textContent = "Otra vez";
          return;
        }
        ronda.textContent = "Respiración " + n + " de 3";
        globo.className = "globo inhala";
        globo.textContent = "Coge aire…";
        ciclo = setTimeout(function () {
          globo.className = "globo mantiene";
          globo.textContent = "Aguanta";
          ciclo = setTimeout(function () {
            globo.className = "globo exhala";
            globo.textContent = "Suéltalo despacio…";
            ciclo = setTimeout(una, 6000);
          }, 2000);
        }, 4000);
      }
      una();
    });
    r.appendChild(empezar);
    t.appendChild(r);
    t.appendChild(pie(function () { pararCiclo(); ir(0); }, "Siguiente", function () { pararCiclo(); ir(2); }));
    cont.appendChild(t);
  }

  // ---------- 3 · pienso ----------
  function pintarPienso(cont) {
    var e = st.emocion;
    var t = tarjeta("justicia");
    t.appendChild(C.el("h2", null, "¿Qué te estás diciendo?"));
    t.appendChild(C.el("p", "sub", "A veces lo que más duele no es lo que ha pasado, sino lo que nos decimos. ¿Se parece a alguna de estas?"));
    var lista = C.el("div", "opciones-lista");
    e.pensamientos.forEach(function (p) {
      var b = C.el("button", "tarjeta-opcion", "«" + p.t + "»");
      b.type = "button";
      b.setAttribute("aria-pressed", st.pensamiento === p ? "true" : "false");
      b.addEventListener("click", function () { st.pensamiento = p; pintar(); });
      lista.appendChild(b);
    });
    var ninguna = C.el("button", "tarjeta-opcion", "Ninguna de estas");
    ninguna.type = "button";
    ninguna.setAttribute("aria-pressed", st.pensamiento === "ninguna" ? "true" : "false");
    ninguna.addEventListener("click", function () { st.pensamiento = "ninguna"; pintar(); });
    lista.appendChild(ninguna);
    t.appendChild(lista);

    if (st.pensamiento) {
      var o = C.el("div", "otra-forma");
      o.appendChild(C.el("b", null, "Otra forma de verlo"));
      o.appendChild(C.el("p", null, st.pensamiento === "ninguna"
        ? "Sea lo que sea lo que te dices, pregúntate: ¿lo sé seguro? ¿Se lo diría así a un amigo?"
        : st.pensamiento.otra));
      t.appendChild(o);
      var cita = C.el("blockquote", "cita v-justicia");
      cita.appendChild(document.createTextNode("«Lo que inquieta a las personas no son las cosas, sino las opiniones que tienen sobre las cosas.»"));
      cita.appendChild(C.el("footer", null, "Epicteto · Enquiridión, 5"));
      t.appendChild(cita);
    }
    t.appendChild(pie(function () { ir(1); }, "Siguiente", function () { ir(3); }, !!st.pensamiento));
    cont.appendChild(t);
  }

  // ---------- 4 · separo ----------
  function pintarSepara(cont) {
    var e = st.emocion;
    var t = tarjeta("coraje");
    t.appendChild(C.el("h2", null, "¿Qué depende de ti?"));
    t.appendChild(C.el("p", "sub", "No gastes tu energía en lo que no puedes cambiar. Ponla en lo que sí."));
    var cols = C.el("div", "columnas-depende");
    [["no", "No depende de mí", e.noDepende], ["si", "Sí depende de mí", e.depende.concat(["Contárselo a un adulto de confianza"])]].forEach(function (c) {
      var col = C.el("div", "columna-d " + c[0]);
      col.appendChild(C.el("h3", null, c[1]));
      var ul = C.el("ul");
      c[2].forEach(function (x) { ul.appendChild(C.el("li", null, x)); });
      col.appendChild(ul);
      cols.appendChild(col);
    });
    t.appendChild(cols);
    if (e.nota) {
      var n = C.el("div", "nota-importante");
      n.innerHTML = C.icono("ayuda");
      n.appendChild(C.el("span", null, e.nota));
      t.appendChild(n);
    }
    t.appendChild(pie(function () { ir(2); }, "Siguiente", function () { ir(4); }));
    cont.appendChild(t);
  }

  // ---------- 5 · elijo ----------
  function pintarElijo(cont) {
    var e = st.emocion;
    var t = tarjeta("templanza");
    t.appendChild(C.el("h2", null, "¿Qué vas a hacer?"));
    t.appendChild(C.el("p", "sub", "Elige una de las cuatro virtudes. Cada una te propone algo concreto."));
    var grid = C.el("div", "virtudes-eleccion");
    Object.keys(C.VIRTUDES).forEach(function (id) {
      var v = C.VIRTUDES[id];
      var b = C.el("button", "virtud-carta v-" + id);
      b.type = "button";
      b.setAttribute("aria-pressed", st.virtud === id ? "true" : "false");
      var cab = C.el("span", "cab");
      cab.innerHTML = C.icono(id) + v.nombre;
      b.appendChild(cab);
      b.appendChild(C.el("p", null, e.virtudes[id]));
      b.addEventListener("click", function () { st.virtud = id; pintar(); });
      grid.appendChild(b);
    });
    t.appendChild(grid);
    t.appendChild(pie(function () { ir(3); }, "Ver mi plan", function () { ir(5); }, !!st.virtud));
    cont.appendChild(t);
  }

  // ---------- 6 · mi plan ----------
  function pintarPlan(cont) {
    var e = st.emocion;
    var t = tarjeta(st.virtud);
    t.appendChild(C.el("h2", null, "Tu plan"));
    var plan = C.el("div", "plan");
    var dl = C.el("dl");
    function fila(k, v) {
      dl.appendChild(C.el("dt", null, k));
      dl.appendChild(C.el("dd", null, v));
    }
    fila("Siento", e.cara + " " + e.nombre + " (" + st.intensidad + " de 5)");
    if (st.pensamiento && st.pensamiento !== "ninguna") {
      fila("Me decía", "«" + st.pensamiento.t + "»");
      fila("Otra forma", st.pensamiento.otra);
    }
    fila("Voy a", C.VIRTUDES[st.virtud].nombre + ": " + e.virtudes[st.virtud].charAt(0).toLowerCase() + e.virtudes[st.virtud].slice(1));
    plan.appendChild(dl);
    t.appendChild(plan);

    t.appendChild(termometro("¿Y ahora, cómo de fuerte es la emoción?", "despues", e));
    if (st.despues) {
      var msg = st.despues < st.intensidad
        ? "Ha bajado de " + st.intensidad + " a " + st.despues + ". Has vuelto a tu ciudadela."
        : st.despues >= 4
          ? "Sigue muy fuerte, y está bien que lo digas. Díselo a un adulto de confianza: no tienes que llevarlo tú solo ni tú sola."
          : "A veces tarda un poco en bajar. Ya sabes qué vas a hacer, y eso depende de ti.";
      t.appendChild(C.el("p", "sub", msg));
      if (st.despues >= 4) t.appendChild(boton("Pedir ayuda a mi maestro o maestra", "btn-ayuda", function () { C.abrirAyuda("kit-calma"); }));
    }

    var acc = C.el("div", "acciones-calma");
    acc.appendChild(boton("Empezar de nuevo", "btn fantasma", function () {
      st = { paso: -1, emocion: null, intensidad: 0, pensamiento: null, virtud: null, despues: 0 };
      pintar();
    }));
    var guardarBtn = boton("Guardar en mi diario", "btn", function () {
      guardarBtn.disabled = true;
      C.diario.anadir({
        id: Date.now(),
        fecha: new Date().toISOString(),
        tipo: "calma",
        emocion: e.id,
        intensidad: st.intensidad,
        despues: st.despues || null,
        pensamiento: st.pensamiento && st.pensamiento !== "ninguna" ? st.pensamiento.t : "",
        virtud: st.virtud,
        accion: e.virtudes[st.virtud],
      }).then(function () {
        guardarBtn.textContent = "✓ Guardado en tu diario";
      }).catch(function () {
        guardarBtn.disabled = false;
        guardarBtn.textContent = "No se ha podido guardar";
      });
    });
    acc.appendChild(guardarBtn);
    t.appendChild(acc);
    cont.appendChild(t);
  }

  function pintar() {
    pintarPasos();
    var cont = $("calma");
    cont.innerHTML = "";
    if (st.paso === -1) pintarInicio(cont);
    else if (st.paso === 0) pintarSiento(cont);
    else if (st.paso === 1) pintarRespiro(cont);
    else if (st.paso === 2) pintarPienso(cont);
    else if (st.paso === 3) pintarSepara(cont);
    else if (st.paso === 4) pintarElijo(cont);
    else pintarPlan(cont);
  }

  window.CIUDADELA_EMOCIONES = EMOCIONES;

  document.addEventListener("DOMContentLoaded", pintar);
})();
