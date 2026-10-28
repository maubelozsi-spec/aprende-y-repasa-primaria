// ============================================================
// Letrania · motor de la sesión de juego (pestaña «Prueba de hoy»).
//
// Una ronda = calentamiento (3-4 ítems de repaso: primero lo que ese
// alumno falló, después estaciones anteriores) + prueba de la estación
// (8-10 ítems de su ficha actual) + recompensas. Un fallo nunca quita
// nada: se enseña la respuesta y la regla, y el ítem vuelve al final.
//
// Plantillas: puente, caza, cestas, ordenar y cortar (Escriba),
// espejo y eco. En la Senda del Unicornio todo va sin movimiento, sin
// tiempo, con letra grande, pictograma y voz.
//
// Fase 3: cartas recibidas (pista, segunda oportunidad, lupa, tiempo de
// hada, doble gema), poderes de clase (Brújula y Eco; el Trazo mágico y
// el Escudo no se usan aquí), límite de escuchas por ronda (no en la
// Senda del Unicornio) y combate contra el guardián de una región.
//
// No toca Firestore: al terminar llama a opciones.alTerminar(resultado)
// y pinta lo que esa función devuelva (ver js/alumno.js).
// ============================================================
(function () {
  "use strict";

  const L = window.Letrania;
  const { esc, srcImg } = L;

  function barajar(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const DESCRIPCION = {
    puente: "Cada acierto pone un tablón del puente. Al otro lado te espera un cofre.",
    caza: "Las sílabas se escapan: caza la que suena más fuerte.",
    cestas: "Lleva cada palabra a su cesta: arrástrala o toca la cesta.",
    ordenar: "El Escriba ha desordenado las oraciones: ponlas en orden.",
    cortar: "El Escriba lo ha escrito todo junto: toca entre las letras para separar.",
    espejo: "El espejo enseña dos palabras: solo una está bien escrita.",
    eco: "Escucha bien y elige.",
  };

  function crear(op) {
    const raiz = op.contenedor;
    // Siempre el héroe más reciente (cambia con cada aviso de Firestore).
    const H = () => op.heroe();
    const uni = H().senda === "unicornio";
    const efectos = () => op.efectos() && !uni;
    let G = null;
    let vientoT = null;
    let arrastre = null;

    // ---------- Selección de ítems ----------

    const porId = {};
    Object.keys(op.banco).forEach((f) => op.banco[f].items.forEach((it) => (porId[it.id] = Object.assign({ ficha: +f }, it))));

    function estacionJugable() {
      const fichas = Object.keys(op.banco).map(Number).sort((a, b) => a - b);
      const hasta = fichas.filter((f) => f <= H().ficha);
      return hasta.length ? hasta[hasta.length - 1] : fichas[0];
    }

    const CLAVE_VISTOS = "letrania-vistos-" + (op.clave || "demo");
    function vistos() {
      try {
        return new Set(JSON.parse(localStorage.getItem(CLAVE_VISTOS) || "[]"));
      } catch (e) {
        return new Set();
      }
    }
    function marcarVistos(ids) {
      try {
        const v = Array.from(vistos()).concat(ids).slice(-400);
        localStorage.setItem(CLAVE_VISTOS, JSON.stringify(v));
      } catch (e) {
        // Sin localStorage: solo se repiten más los ítems.
      }
    }

    function elegir(lista, n, evitar) {
      const v = vistos();
      const libres = barajar(lista.filter((it) => !evitar.has(it.id) && !v.has(it.id)));
      const resto = barajar(lista.filter((it) => !evitar.has(it.id) && v.has(it.id)));
      return libres.concat(resto).slice(0, n);
    }

    function preparar() {
      const ficha = estacionJugable();
      const est = op.banco[ficha];
      const largo = uni ? 8 : est.plantilla === "ordenar" || est.plantilla === "cortar" ? 8 : 10;
      const main = elegir(est.items.map((it) => porId[it.id]), largo, new Set());
      const usados = new Set(main.map((it) => it.id));
      const nCal = uni ? 3 : 4;
      let cal = (H().repaso || []).map((id) => porId[id]).filter((it) => it && !usados.has(it.id));
      cal = barajar(cal).slice(0, nCal);
      cal.forEach((it) => usados.add(it.id));
      const anteriores = [ficha - 1, ficha - 2].filter((f) => op.banco[f]);
      const fuente = anteriores.length ? [].concat.apply([], anteriores.map((f) => op.banco[f].items.map((it) => porId[it.id]))) : est.items.map((it) => porId[it.id]);
      cal = cal.concat(elegir(fuente, nCal - cal.length, usados));
      return { ficha: ficha, est: est, main: main, cal: cal };
    }

    // ---------- Escena ----------

    function region() {
      return G && G.modo === "guardian" ? L.REGIONES[G.region - 1] : L.REGIONES[L.regionDe(G ? G.ficha : H().ficha)];
    }

    function escena() {
      const ri = G && G.modo === "guardian" ? G.region - 1 : L.regionDe(G ? G.ficha : H().ficha);
      const r = L.REGIONES[ri];
      const total = G ? G.total : 8;
      const hechos = G ? G.pasos : 0;
      const tipo = G && G.est.plantilla === "puente" ? "tablon" : "piedra";
      let pasos = "";
      for (let i = 0; i < total; i++) pasos += `<span class="paso ${tipo} ${i < hechos ? "on" : ""} ${G && G.nuevo && i === hechos - 1 ? "nuevo" : ""}"></span>`;
      const frac = G && G.fase === "fin" ? 1 : total ? hechos / total : 0;
      const izq = 6 + frac * 72;
      const guardian = G && (G.fase === "calentamiento" || (G.modo === "guardian" && !(G.fase === "fin" && G.gana)))
        ? `<img class="esc-guardian ${efectos() ? "flota" : ""} ${G.golpe ? "golpe" : ""}" src="${srcImg(r.gimg)}" alt="${esc(r.guardian)}">`
        : "";
      return `<div class="escena" style="background-image:url('${srcImg("fondo-" + (ri + 1))}'),url('${srcImg("mapa")}')">
          <div class="pasos" aria-hidden="true">${pasos}</div>
          <img class="esc-cofre" src="${srcImg("cofre")}" alt="">
          ${guardian}
          <img class="esc-heroe" src="${srcImg(H().retrato || "maga-1")}" alt="Tu héroe" style="left:${izq}%">
        </div>`;
    }

    function chispas() {
      if (!efectos()) return;
      const sc = raiz.querySelector(".escena");
      const h = raiz.querySelector(".esc-heroe");
      if (!sc || !h) return;
      const r = sc.getBoundingClientRect();
      const hr = h.getBoundingClientRect();
      const cx = hr.left - r.left + hr.width / 2;
      const cy = hr.top - r.top + hr.height * 0.3;
      for (let i = 0; i < 14; i++) {
        const s = document.createElement("span");
        s.className = "spark";
        const a = Math.random() * Math.PI * 2;
        const d = 30 + Math.random() * 70;
        s.style.left = cx + "px";
        s.style.top = cy + "px";
        s.style.setProperty("--dx", Math.cos(a) * d + "px");
        s.style.setProperty("--dy", Math.sin(a) * d + "px");
        sc.appendChild(s);
        setTimeout(() => s.remove(), 950);
      }
    }

    function fases(i) {
      const F = [["Calentamiento", "3 min"], ["Prueba", "7 min"], ["Recompensas", "3 min"]];
      return `<div class="phases">${F.map((p, k) => `<div class="ph ${k === i ? "on" : k < i ? "past" : ""}"><b>${p[0]}</b>${p[1]}</div>`).join("")}</div>`;
    }

    // ---------- Inicio ----------

    function inicio() {
      pararViento();
      const ficha = estacionJugable();
      const est = op.banco[ficha];
      const r = L.REGIONES[L.regionDe(ficha)];
      const repaso = ficha !== H().ficha;
      G = null;
      raiz.innerHTML = `<div class="gamegrid">${fases(-1)}${escena()}
        <div class="parch"><div class="start"><div>
          <span class="eyebrow">${repaso ? "Repaso de la estación " + ficha : "Estación " + ficha} · ${esc(r.nombre)}</span>
          <h2>${esc(est.titulo)}</h2>
          ${repaso ? '<p class="nota">La prueba de tu estación todavía no está lista: hoy entrenas con la última que hay.</p>' : ""}
          <p style="margin:6px 0 10px">${esc(r.guardian)} vigila el camino. Primero, espántalo con lo que ya sabes. Después, la prueba: ${esc(DESCRIPCION[est.plantilla])}</p>
          <div class="tools" style="margin-bottom:12px">${uni ? '<span class="pill s-unicornio">SIN PRISA · CON VOZ</span>' : '<button class="small-btn" type="button" id="vientoTog" aria-pressed="false">Reto del viento (opcional)</button>'}</div>
          ${ayudasDeInicio()}
          <button class="btn sea" type="button" id="empezar" style="font-size:20px">Empezar</button>
        </div><img src="${srcImg(r.gimg)}" alt="${esc(r.guardian)}"></div></div></div>`;
    }

    // Lo que se decide antes de empezar: gastar «Segunda oportunidad» o
    // «Doble gema», o el poder Eco de los bardos.
    function ayudasDeInicio() {
      const c = cartas();
      const p = op.poder ? op.poder() : null;
      const b = [];
      if (c.segunda > 0) b.push(`<button class="ayuda" type="button" data-inicio="segunda" aria-pressed="false">Segunda oportunidad (${c.segunda})</button>`);
      if (c.doble > 0) b.push(`<button class="ayuda" type="button" data-inicio="doble" aria-pressed="false">Doble gema en el premio (${c.doble})</button>`);
      if (p && p.clase === "bardo" && p.disponible && !uni) b.push(`<button class="ayuda" type="button" data-inicio="eco" aria-pressed="false">Poder Eco: audio sin límite</button>`);
      return b.length ? `<div class="ayudas" style="margin-bottom:12px"><span class="nota" style="margin:0">Usar en esta ronda:</span>${b.join("")}</div>` : "";
    }

    function cartas() {
      return (op.cartas && op.cartas()) || {};
    }

    async function prepararAyudas(G) {
      const pulsada = (k) => {
        const b = raiz.querySelector(`[data-inicio="${k}"]`);
        return b && b.getAttribute("aria-pressed") === "true";
      };
      if (pulsada("segunda") && (await op.usarCarta("segunda"))) G.segunda = true;
      if (pulsada("doble")) G.doble = true; // se gasta al cobrar el premio
      if (pulsada("eco") && (await op.usarPoder())) G.eco = true;
    }

    async function empezar(viento) {
      const p = preparar();
      const nuevo = {
        fase: p.cal.length ? "calentamiento" : "prueba",
        ficha: p.ficha,
        est: p.est,
        cal: p.cal,
        main: p.main,
        cola: (p.cal.length ? p.cal : p.main).slice(),
        total: p.main.length,
        pasos: 0,
        aciertos: 0,
        fallados: [],
        acertadosRepaso: [],
        intentados: new Set(),
        viento: !!viento && !uni,
        vientoGanado: 0,
        respondido: false,
        escuchas: L.ESCUCHAS_POR_RONDA,
      };
      await prepararAyudas(nuevo);
      G = nuevo;
      marcarVistos(p.main.map((it) => it.id));
      pintarPregunta();
    }

    // Combate contra el guardián: ítems de todas las estaciones de la
    // región que ya tienen banco, sin calentamiento. Gana con el 70 % a
    // la primera.
    function combatir(region) {
      pararViento();
      const r = L.REGIONES[region - 1];
      const items = [];
      for (let f = r.desde; f <= r.hasta; f++) if (op.banco[f]) op.banco[f].items.forEach((it) => items.push(porId[it.id]));
      if (!items.length) {
        raiz.innerHTML = `<div class="parch"><h2>${esc(r.guardian)}</h2><p>El combate de esta región todavía no está listo.</p><button class="btn ghost" type="button" id="alMapa">Ir al mapa</button></div>`;
        return;
      }
      const main = barajar(items).slice(0, uni ? 8 : 10);
      G = {
        modo: "guardian",
        region: region,
        fase: "prueba",
        ficha: r.desde,
        est: { plantilla: "mixta", titulo: "Combate contra " + r.guardian },
        cal: [],
        main: main,
        cola: main.slice(),
        total: main.length,
        pasos: 0,
        aciertos: 0,
        fallados: [],
        acertadosRepaso: [],
        intentados: new Set(),
        viento: false,
        vientoGanado: 0,
        respondido: false,
        escuchas: L.ESCUCHAS_POR_RONDA,
      };
      pintarPregunta();
    }

    // ---------- Pregunta ----------

    function actual() {
      return G.cola[0];
    }

    function etiqueta() {
      if (G.modo === "guardian") return "Combate contra " + region().guardian + " · golpe " + Math.min(G.pasos + 1, G.total) + " de " + G.total;
      if (G.fase === "calentamiento") return "Espanta a " + region().guardian + " · quedan " + G.cola.length;
      return (G.est.plantilla === "puente" ? "Tablón " : "Paso ") + Math.min(G.pasos + 1, G.total) + " de " + G.total;
    }

    function pintarPregunta() {
      pararViento();
      const it = actual();
      G.respondido = false;
      G.nuevo = false;
      G.golpe = false;
      const cuerpo = CUERPO[it.plantilla](it);
      const oculto = it.plantilla === "ordenar"; // oír la frase la resolvería
      raiz.innerHTML = `<div class="gamegrid">${fases(G.fase === "calentamiento" ? 0 : 1)}${escena()}
        <div class="parch tarjeta ${uni ? "uni" : ""}" data-item="${esc(it.id)}">
          <div class="qhead"><span class="eyebrow">${esc(etiqueta())}</span>
            <span class="tools">${oculto ? "" : botonOir()}</span></div>
          <div class="qprompt">${esc(it.enunciado)}</div>
          ${cuerpo}
          ${G.viento && G.fase === "prueba" ? '<div class="wind" aria-hidden="true"><i id="vientoBar" style="width:100%"></i></div>' : ""}
          ${ayudasDePregunta(it)}
          <div class="feedback" id="fb" aria-live="polite"></div>
          <div id="seguirHueco"></div>
        </div></div>`;
      if (it.picto) pintarPicto(it);
      if (uni) setTimeout(() => op.hablar(it.enunciado.toLowerCase() + " " + (it.audio || "")), 250);
      if (G.viento && G.fase === "prueba") arrancarViento(it.plantilla === "ordenar" || it.plantilla === "cortar" ? 250 : 120);
      if (it.plantilla === "cestas") prepararArrastre();
    }

    // Audio: sin límite en la Senda del Unicornio y con el poder Eco; si
    // no, 3 escuchas por ronda.
    function sinLimite() {
      return uni || G.eco;
    }
    function botonOir() {
      return `<button class="small-btn" type="button" id="oir" ${!sinLimite() && G.escuchas <= 0 ? "disabled" : ""}>🔊 Escuchar${sinLimite() ? "" : " (" + G.escuchas + ")"}</button>`;
    }

    // Cartas que le han regalado y la Brújula de los exploradores.
    function ayudasDePregunta(it) {
      const c = cartas();
      const b = [];
      const conOpciones = ["puente", "espejo", "eco", "cestas", "caza"].indexOf(it.plantilla) !== -1;
      if (it.pista && !uni && c.pista > 0) b.push(`<button class="ayuda" type="button" data-ayuda="pista">Pista (${c.pista})</button>`);
      if (c.lupa > 0) b.push(`<button class="ayuda" type="button" data-ayuda="lupa">Lupa (${c.lupa})</button>`);
      if (G.viento && G.fase === "prueba" && c.hada > 0) b.push(`<button class="ayuda" type="button" data-ayuda="hada">Tiempo de hada (${c.hada})</button>`);
      const p = op.poder ? op.poder() : null;
      if (p && p.clase === "explo" && p.disponible && conOpciones && it.opciones.length > 2) b.push(`<button class="ayuda" type="button" data-ayuda="brujula">Brújula (poder)</button>`);
      if (G.segunda) b.push('<span class="nota" style="margin:0">Segunda oportunidad activa</span>');
      return b.length ? `<div class="ayudas">${b.join("")}</div>` : "";
    }

    async function usarAyuda(tipo, boton) {
      if (G.respondido) return;
      const it = actual();
      boton.disabled = true;
      const fb = raiz.querySelector("#fb");
      if (tipo === "brujula") {
        if (!(await op.usarPoder())) return;
        const malas = it.opciones.map((o, k) => k).filter((k) => k !== it.correcta);
        const k = malas[Math.floor(Math.random() * malas.length)];
        const el = raiz.querySelector(`[data-ans="${k}"]`);
        if (el) {
          el.disabled = true;
          el.classList.add("descartada");
        }
        boton.remove();
        return;
      }
      if (!(await op.usarCarta(tipo))) return;
      if (tipo === "pista") {
        fb.className = "feedback ok";
        fb.textContent = "Pista: " + it.pista;
      } else if (tipo === "lupa") {
        raiz.querySelector(".tarjeta").classList.add("lupa");
        op.hablar(it.enunciado + " " + (it.plantilla === "ordenar" ? "" : it.audio || ""));
      } else if (tipo === "hada") {
        G.vientoPausaHasta = Date.now() + 10000;
        fb.className = "feedback ok";
        fb.textContent = "El hada para el viento 10 segundos.";
      }
      boton.remove();
    }

    // Pictograma de ARASAAC. Si no llega (sin conexión, API caída), un
    // altavoz que lee la palabra: escribirla daría la respuesta.
    function pintarPicto(it) {
      const hueco = raiz.querySelector(".picto");
      if (!hueco) return;
      const altavoz = () => {
        hueco.innerHTML = `<button class="picto-voz" type="button" data-voz="1" aria-label="Escuchar la palabra">🔊</button>`;
      };
      if (!window.arasaacBuscarId) return altavoz();
      window.arasaacBuscarId(it.picto.toLowerCase()).then((id) => {
        if (!raiz.contains(hueco)) return;
        if (!id) return altavoz();
        const img = document.createElement("img");
        img.alt = "";
        img.src = window.arasaacUrlImagen(id, { color: true });
        img.onerror = altavoz;
        hueco.appendChild(img);
      });
    }

    const palabraConHueco = (p) => {
      if (String(p).indexOf("_") === -1) return esc(p);
      const [a, b] = String(p).split("_");
      return `${esc(a)}<span class="gap">?</span>${esc(b || "")}`;
    };

    const botones = (it, extra) =>
      `<div class="answers ${uni ? "big-ans" : ""} ${extra || ""}">${it.opciones
        .map((o, k) => `<button class="ans" type="button" data-ans="${k}">${esc(o)}</button>`)
        .join("")}</div>`;

    const CUERPO = {
      puente: (it) => `<div class="qword">${palabraConHueco(it.palabra)}</div>${botones(it)}`,
      espejo: (it) => `<div class="espejo">${it.opciones
        .map((o, k) => `<button class="rama" type="button" data-ans="${k}"><span>${esc(o)}</span></button>`)
        .join('<span class="espejo-eje" aria-hidden="true"></span>')}</div>`,
      eco: (it) => `<div class="eco"><span class="picto"></span>${it.palabra ? `<div class="qword">${palabraConHueco(it.palabra)}</div>` : ""}</div>${botones(it, "eco-ops")}`,
      caza: (it) => {
        const quieto = uni || !efectos();
        return `<div class="cazadero ${quieto ? "quieto" : ""}">${it.opciones
          .map((o, k) => `<button class="burbuja" type="button" data-ans="${k}" style="--i:${k};--n:${it.opciones.length}">${esc(o)}</button>`)
          .join("")}</div><p class="nota">Palabra: <b>${esc(it.palabra)}</b></p>`;
      },
      cestas: (it) => `<div class="cestas-zona"><div class="ficha-palabra" id="arrastrable" tabindex="-1">${esc(it.palabra)}</div>
          <div class="cestas">${it.opciones
            .map((o, k) => `<button class="cesta" type="button" data-ans="${k}"><span class="cesta-icono" aria-hidden="true">🧺</span>${esc(o)}</button>`)
            .join("")}</div></div>`,
      ordenar: (it) => {
        if (!it._orden) it._orden = barajarDistinto(it.piezas);
        return `<div class="linea" id="linea" aria-label="Tu oración"></div>
          <div class="piezas" id="piezas">${it._orden.map((p, k) => `<button class="pieza" type="button" data-pieza="${k}">${esc(p)}</button>`).join("")}</div>
          <button class="small-btn" type="button" id="borrar">Empezar de nuevo</button>`;
      },
      cortar: (it) => {
        let h = "";
        Array.from(it.letras).forEach((c, k) => {
          if (k > 0) h += `<button class="tijera" type="button" data-corte="${k}" aria-pressed="false" aria-label="Cortar antes de la letra ${k + 1}"></button>`;
          h += `<span class="letra">${esc(c)}</span>`;
        });
        return `<div class="cortar">${h}</div><button class="btn sea" type="button" id="comprobar">Comprobar</button>`;
      },
    };

    function barajarDistinto(piezas) {
      let o = barajar(piezas);
      for (let n = 0; n < 5 && o.join(" ") === piezas.join(" "); n++) o = barajar(piezas);
      return o;
    }

    // ---------- Respuestas ----------

    function responder(ok, textoCorrecto) {
      if (G.respondido) return;
      G.respondido = true;
      const it = actual();
      if (!ok && G.segunda) {
        // La carta «Segunda oportunidad»: este fallo no cuenta.
        G.segunda = false;
        pararViento();
        const fb = raiz.querySelector("#fb");
        fb.className = "feedback ok";
        fb.textContent = "Segunda oportunidad: este fallo no cuenta. Vuelve a intentarlo.";
        if (uni) op.hablar("Vuelve a intentarlo.");
        setTimeout(pintarPregunta, 1600);
        return;
      }
      const ganaViento = ok && G.viento && G.fase === "prueba" && G.vientoVivo;
      pararViento();
      const primera = !G.intentados.has(it.id);
      G.intentados.add(it.id);
      const fb = raiz.querySelector("#fb");
      if (ok) {
        if (ganaViento) G.vientoGanado++;
        if (G.fase === "prueba") {
          if (primera) G.aciertos++;
          G.pasos = Math.min(G.total, G.pasos + 1);
          G.nuevo = true;
          if (G.modo === "guardian") G.golpe = true;
        } else {
          G.golpe = true;
          if (primera) G.acertadosRepaso.push(it.id);
        }
        fb.className = "feedback ok";
        fb.textContent = "¡Bien! " + it.regla + (ganaViento ? " ¡Has vencido al viento!" : "");
        const esc2 = raiz.querySelector(".escena");
        if (esc2) esc2.outerHTML = escena();
        requestAnimationFrame(chispas);
        G.cola.shift();
      } else {
        if (primera && G.fallados.indexOf(it.id) === -1) G.fallados.push(it.id);
        fb.className = "feedback no";
        fb.textContent = "Casi. " + (textoCorrecto ? "La respuesta es: " + textoCorrecto + ". " : "") + it.regla + " Volverá más tarde.";
        G.cola.shift();
        if (!it._otra) G.cola.push(Object.assign({}, it, { _otra: true, _orden: null }));
        else if (G.fase === "prueba") {
          // Segunda vez fallado: cuenta como paso para no atascarse.
          G.pasos = Math.min(G.total, G.pasos + 1);
          const esc2 = raiz.querySelector(".escena");
          if (esc2) esc2.outerHTML = escena();
        }
      }
      if (uni) op.hablar(ok ? "¡Muy bien!" : "Casi. Es " + (it.audio || ""));
      raiz.querySelectorAll(".tarjeta button[data-ans], .pieza, .tijera, #comprobar, #borrar").forEach((b) => (b.disabled = true));
      raiz.querySelector("#seguirHueco").innerHTML = `<button class="btn" type="button" id="seguir" style="margin-top:10px">Seguir</button>`;
      raiz.querySelector("#seguir").focus();
    }

    function seguir() {
      if (G.fase === "calentamiento" && !G.cola.length) {
        G.fase = "prueba";
        G.cola = G.main.slice();
      }
      if (G.fase === "prueba" && !G.cola.length) {
        terminar();
        return;
      }
      pintarPregunta();
    }

    function elegido(k) {
      const it = actual();
      const ok = k === it.correcta;
      raiz.querySelectorAll("[data-ans]").forEach((b, i) => {
        if (i === it.correcta) b.classList.add("ok");
        else if (i === k) b.classList.add("no");
      });
      responder(ok, ok ? "" : it.plantilla === "cestas" ? it.opciones[it.correcta] + " (" + it.solucion + ")" : it.solucion);
    }

    // Escriba: ordenar
    function moverPieza(btn) {
      const linea = raiz.querySelector("#linea");
      const piezas = raiz.querySelector("#piezas");
      if (btn.parentElement === piezas) linea.appendChild(btn);
      else piezas.appendChild(btn);
      const it = actual();
      if (linea.children.length === it.piezas.length) {
        const frase = Array.from(linea.children).map((b) => b.textContent).join(" ");
        responder(frase === it.solucion, it.solucion);
      }
    }

    // Escriba: cortar
    function comprobarCortes() {
      const it = actual();
      const marcados = Array.from(raiz.querySelectorAll(".tijera[aria-pressed='true']")).map((b) => +b.dataset.corte);
      const ok = marcados.length === it.cortes.length && it.cortes.every((c) => marcados.indexOf(c) !== -1);
      raiz.querySelectorAll(".tijera").forEach((b) => {
        const debe = it.cortes.indexOf(+b.dataset.corte) !== -1;
        if (debe) b.classList.add("debe");
        if (b.getAttribute("aria-pressed") === "true" && !debe) b.classList.add("mal");
      });
      responder(ok, it.solucion);
    }

    // Cestas: arrastrar la palabra (también vale tocar la cesta).
    function prepararArrastre() {
      const el = raiz.querySelector("#arrastrable");
      if (!el) return;
      el.addEventListener("pointerdown", (e) => {
        if (G.respondido) return;
        arrastre = { x: e.clientX, y: e.clientY, el: el };
        el.setPointerCapture(e.pointerId);
        el.classList.add("arrastrando");
      });
      el.addEventListener("pointermove", (e) => {
        if (!arrastre) return;
        el.style.transform = `translate(${e.clientX - arrastre.x}px, ${e.clientY - arrastre.y}px)`;
      });
      const soltar = (e) => {
        if (!arrastre) return;
        arrastre = null;
        el.classList.remove("arrastrando");
        el.style.visibility = "hidden";
        const debajo = document.elementFromPoint(e.clientX, e.clientY);
        el.style.visibility = "";
        el.style.transform = "";
        const cesta = debajo && debajo.closest(".cesta");
        if (cesta) elegido(+cesta.dataset.ans);
      };
      el.addEventListener("pointerup", soltar);
      el.addEventListener("pointercancel", () => {
        arrastre = null;
        el.style.transform = "";
        el.classList.remove("arrastrando");
      });
    }

    // ---------- Reto del viento (solo Dragón y Grifo, opcional) ----------

    function arrancarViento(decimas) {
      let t = decimas;
      G.vientoVivo = true;
      vientoT = setInterval(() => {
        if (G.vientoPausaHasta && Date.now() < G.vientoPausaHasta) return;
        t--;
        const b = raiz.querySelector("#vientoBar");
        if (b) b.style.width = (t / decimas) * 100 + "%";
        if (t <= 0) {
          G.vientoVivo = false;
          pararViento();
        }
      }, 100);
    }
    function pararViento() {
      if (vientoT) {
        clearInterval(vientoT);
        vientoT = null;
      }
    }

    // ---------- Fin ----------

    async function terminar() {
      pararViento();
      G.fase = "fin";
      G.pasos = G.total;
      const resultado = {
        ficha: G.ficha,
        plantilla: G.est.plantilla,
        titulo: G.est.titulo,
        aciertos: G.aciertos,
        total: G.total,
        fallados: G.fallados.slice(),
        palabras: G.fallados.map((id) => porId[id] ? porId[id].solucion : id),
        acertadosRepaso: G.acertadosRepaso.slice(),
        viento: G.vientoGanado,
        doble: !!G.doble,
        modo: G.modo || "estacion",
        region: G.region || null,
      };
      raiz.innerHTML = `<div class="gamegrid">${fases(2)}${escena()}<div class="parch"><p>Guardando…</p></div></div>`;
      let premio = null;
      try {
        premio = await op.alTerminar(resultado);
      } catch (e) {
        premio = { error: true };
      }
      if (premio && premio.guardian) {
        G.gana = premio.gana;
        pintarFinGuardian(premio);
        return;
      }
      setTimeout(chispas, 400);
      const titulo = { puente: "¡Puente construido!", caza: "¡Caza completada!", cestas: "¡Cestas llenas!", ordenar: "¡El Escriba está contento!", cortar: "¡El Escriba está contento!", espejo: "¡Espejo resuelto!", eco: "¡MUY BIEN!" }[G.est.plantilla];
      let cajas = "";
      if (premio && premio.xp) {
        cajas = `<div class="rewards"><div class="rw"><span class="eyebrow">Experiencia</span><b>+${premio.xp}</b></div><div class="rw"><span class="eyebrow">Gemas</span><b>+${premio.gemas}</b></div>${G.viento ? `<div class="rw"><span class="eyebrow">Viento vencido</span><b>${G.vientoGanado}</b></div>` : ""}</div>`;
      }
      const extras = [];
      if (premio && premio.doble) extras.push("La Doble gema ha duplicado tus gemas.");
      if (premio && premio.racha) extras.push("Racha: " + premio.racha + (premio.racha === 1 ? " sesión." : " sesiones seguidas."));
      if (premio && premio.cofre) extras.push("¡Cofre de racha! Has ganado la carta «" + L.CARTAS[premio.cofre].nombre + "» para regalar.");
      const texto = premio && premio.error
        ? "No se ha podido guardar el premio. Avisa a tu maestro."
        : premio && premio.xp
        ? "Has acertado a la primera " + G.aciertos + " de " + G.total + ". Lo que has fallado volverá en el calentamiento de otro día."
        : premio && premio.yaPremiado
        ? "Hoy ya ganaste tu premio: esta ronda ha sido de entrenamiento. Has acertado a la primera " + G.aciertos + " de " + G.total + "."
        : "Has acertado a la primera " + G.aciertos + " de " + G.total + ".";
      raiz.innerHTML = `<div class="gamegrid">${fases(2)}${escena()}
        <div class="parch"><span class="eyebrow">Recompensas</span><h2>${titulo}</h2>
          <p style="margin:6px 0 0">${esc(texto)}</p>${cajas}${extras.length ? `<p class="nota">${esc(extras.join(" "))}</p>` : ""}
          <div class="tools"><button class="btn sea" type="button" id="otra">Otra ronda</button><button class="btn ghost" type="button" id="alMapa">Ir al mapa</button></div>
          <p class="muted" style="margin:12px 0 0;font-size:14px">La experiencia de la ficha en papel llega cuando tu maestro la marca.</p></div></div>`;
      if (uni) op.hablar("¡Muy bien!");
    }

    function pintarFinGuardian(premio) {
      const r = L.REGIONES[G.region - 1];
      const titulo = premio.gana ? "¡Has vencido a " + r.guardian + "!" : r.guardian + " resiste";
      const texto = premio.gana
        ? premio.ya
          ? "Ya lo habías vencido antes: esta victoria es de entrenamiento."
          : "Has acertado a la primera " + G.aciertos + " de " + G.total + ". Ganas " + premio.xp + " XP."
        : "Has acertado a la primera " + G.aciertos + " de " + G.total + ". Te hacen falta " + Math.ceil(G.total * 0.7) + ". Repasa la región y vuelve a intentarlo: perder no quita nada.";
      raiz.innerHTML = `<div class="gamegrid">${escena()}
        <div class="parch"><span class="eyebrow">Combate</span><h2>${esc(titulo)}</h2><p>${esc(texto)}</p>
          <div class="tools"><button class="btn sea" type="button" id="revancha" data-region="${G.region}">${premio.gana ? "Combatir otra vez" : "Intentarlo de nuevo"}</button><button class="btn ghost" type="button" id="alMapa">Ir al mapa</button></div></div></div>`;
      if (premio.gana) setTimeout(chispas, 300);
      if (uni) op.hablar(premio.gana ? "¡Has ganado!" : "Casi. Vuelve a intentarlo.");
    }

    // ---------- Eventos ----------

    raiz.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b || b.disabled) return;
      if (b.id === "vientoTog" || b.dataset.inicio) b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true");
      else if (b.dataset.ayuda) usarAyuda(b.dataset.ayuda, b);
      else if (b.id === "revancha") combatir(+b.dataset.region);
      else if (b.id === "empezar") {
        const v = raiz.querySelector("#vientoTog");
        empezar(v && v.getAttribute("aria-pressed") === "true");
      } else if (b.id === "seguir") seguir();
      else if (b.id === "oir" || b.dataset.voz) {
        if (!sinLimite()) {
          if (G.escuchas <= 0) return;
          G.escuchas--;
          const o = raiz.querySelector("#oir");
          if (o) o.outerHTML = botonOir();
        }
        op.hablar(actual().audio || "");
      }
 else if (b.id === "otra") inicio();
      else if (b.id === "alMapa") op.alMapa();
      else if (b.dataset.ans !== undefined && G && !G.respondido) elegido(+b.dataset.ans);
      else if (b.dataset.pieza !== undefined && !G.respondido) moverPieza(b);
      else if (b.id === "borrar") {
        const piezas = raiz.querySelector("#piezas");
        Array.from(raiz.querySelector("#linea").children).forEach((x) => piezas.appendChild(x));
      } else if (b.dataset.corte !== undefined) b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true");
      else if (b.id === "comprobar") comprobarCortes();
    });

    return {
      combatir: combatir,
      mostrar: () => {
        if (!G || G.fase === "fin") inicio();
      },
      parar: pararViento,
    };
  }

  window.LetraniaJuego = { crear: crear };
})();
