// ============================================================
// Temporizador de trabajo: cuenta atrás de hasta 60 minutos que se
// ve como reloj digital, analógico (la zona roja es lo que queda,
// como los «Time Timer» de aula) o reloj de arena.
//
// El tiempo se calcula con la hora de fin (performance.now) y no
// restando de cada tic: aunque el navegador espacie los
// temporizadores (pestaña oculta, equipo lento), al volver marca lo
// correcto.
// ============================================================
(function () {
  "use strict";

  const H = window.Herramienta;
  const CLAVE = "ar_herramienta_temporizador";
  const MAX = 60 * 60 * 1000;
  const PRESETS = [1, 2, 3, 5, 10, 15, 20, 30, 45, 60];

  const cfg = H.cargar(CLAVE, { vista: "digital", total: 5 * 60 * 1000, sonido: "campana", mostrarNumeros: true });
  cfg.total = Math.max(10000, Math.min(MAX, Number(cfg.total) || 300000));

  const $ = (id) => document.getElementById(id);
  const reloj = $("reloj");
  const digitos = $("digitos");
  const restanteTxt = $("restante");
  const btnEmpezar = $("btn-empezar");
  const sector = $("sector");
  const sectorLleno = $("sector-lleno");
  const aguja = $("aguja");
  const arenaArriba = $("arena-arriba");
  const arenaAbajo = $("arena-abajo");
  const chorro = $("arena-chorro");

  let total = cfg.total;     // duración elegida
  let restante = total;      // lo que queda cuando está parado o en pausa
  let fin = 0;               // performance.now() en que acaba, si corre
  let corriendo = false;
  let terminado = false;
  let terminadoEn = 0;
  let escalaActual = 0;

  function guardar() {
    H.guardar(CLAVE, cfg);
  }

  function queda() {
    return corriendo ? Math.max(0, fin - performance.now()) : restante;
  }

  function formato(ms) {
    const s = Math.ceil(ms / 1000);
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }

  // ---------------- Esfera analógica ----------------
  // La escala se adapta al tiempo elegido (1, 5, 15, 30 o 60 minutos):
  // con una escala fija de 60, un minuto sería una cuña diminuta.
  function escalaPara(ms) {
    const min = ms / 60000;
    return min <= 1 ? 1 : min <= 5 ? 5 : min <= 15 ? 15 : min <= 30 ? 30 : 60;
  }

  function punto(fraccion, r) {
    const ang = fraccion * 2 * Math.PI - Math.PI / 2;
    return [110 + r * Math.cos(ang), 110 + r * Math.sin(ang)];
  }

  function dibujarEsfera(escala) {
    if (escala === escalaActual) return;
    escalaActual = escala;
    const marcas = $("marcas");
    const numeros = $("numeros");
    marcas.innerHTML = "";
    numeros.innerHTML = "";
    const ns = "http://www.w3.org/2000/svg";
    // En la escala de 1 minuto se cuenta en segundos (una marca por
    // segundo y números cada 10 s); en las demás, en minutos.
    const enSegundos = escala === 1;
    const unidades = enSegundos ? 60 : escala;
    const divisiones = escala === 5 ? 20 : unidades;
    const cadaNumero = { 1: 10, 5: 1, 15: 1, 30: 5, 60: 5 }[escala];
    for (let i = 0; i < divisiones; i++) {
      const f = i / divisiones;
      const minuto = f * unidades;
      const grande = Math.abs(minuto - Math.round(minuto)) < 1e-9 && Math.round(minuto) % cadaNumero === 0;
      const p = punto(f, 96), q = punto(f, grande ? 84 : 90);
      const l = document.createElementNS(ns, "line");
      l.setAttribute("x1", p[0]); l.setAttribute("y1", p[1]);
      l.setAttribute("x2", q[0]); l.setAttribute("y2", q[1]);
      l.setAttribute("class", "esfera-marca" + (grande ? " grande" : ""));
      marcas.appendChild(l);
    }
    for (let m = 0; m < unidades; m += cadaNumero) {
      const t = punto(m / unidades, 71);
      const n = document.createElementNS(ns, "text");
      n.setAttribute("x", t[0]); n.setAttribute("y", t[1]);
      n.setAttribute("class", "esfera-numero");
      n.textContent = m;
      numeros.appendChild(n);
    }
  }

  function pintarAnalogico(ms) {
    const escala = escalaPara(total);
    dibujarEsfera(escala);
    const f = Math.min(1, ms / (escala * 60000));
    sectorLleno.hidden = f < 0.9999;
    if (f >= 0.9999) {
      sector.setAttribute("d", "");
    } else if (f <= 0) {
      sector.setAttribute("d", "");
    } else {
      const p = punto(f, 84);
      sector.setAttribute("d", "M110 110 L110 26 A84 84 0 " + (f > 0.5 ? 1 : 0) + " 1 " + p[0].toFixed(2) + " " + p[1].toFixed(2) + " Z");
    }
    const a = punto(f, 82);
    aguja.setAttribute("x2", a[0].toFixed(2));
    aguja.setAttribute("y2", a[1].toFixed(2));
  }

  // ---------------- Reloj de arena ----------------
  function pintarArena(ms) {
    const f = total ? ms / total : 0;
    const arriba = f * 112;
    const abajo = (1 - f) * 112;
    arenaArriba.setAttribute("y", 150 - arriba);
    arenaArriba.setAttribute("height", arriba);
    arenaAbajo.setAttribute("y", 268 - abajo);
    arenaAbajo.setAttribute("height", abajo);
    chorro.setAttribute("y2", 268 - abajo);
  }

  // ---------------- Pintar ----------------
  function pintar() {
    const ms = queda();
    if (corriendo && ms <= 0) acabar();

    const vista = cfg.vista;
    reloj.dataset.vista = vista;
    document.querySelectorAll("[data-vista].chip").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.vista === vista)));

    if (terminado) {
      const extra = performance.now() - terminadoEn;
      digitos.textContent = "¡Tiempo!";
      restanteTxt.textContent = "Se acabó el tiempo · +" + formato(extra).replace(/^0/, "");
    } else {
      digitos.textContent = formato(ms);
      restanteTxt.textContent = vista === "digital" || !cfg.mostrarNumeros ? "" : formato(ms);
    }
    if (vista === "analogico") pintarAnalogico(terminado ? 0 : ms);
    if (vista === "arena") pintarArena(terminado ? 0 : ms);

    let fase = "parado";
    if (terminado) fase = "terminado";
    else if (corriendo && ms <= 10000) fase = "final";
    else if (corriendo && ms <= total * 0.2) fase = "pocoTiempo";
    else if (corriendo) fase = "corriendo";
    else if (restante < total) fase = "pausa";
    reloj.dataset.fase = fase;

    btnEmpezar.textContent = corriendo ? "⏸ Pausa" : terminado ? "▶ Otra vez" : restante < total ? "▶ Seguir" : "▶ Empezar";
  }

  function acabar() {
    corriendo = false;
    terminado = true;
    terminadoEn = performance.now();
    restante = 0;
    if (cfg.sonido) H.sonar(cfg.sonido);
  }

  function ponerTotal(ms) {
    total = Math.max(10000, Math.min(MAX, Math.round(ms / 1000) * 1000));
    cfg.total = total;
    restante = total;
    corriendo = false;
    terminado = false;
    guardar();
    pintar();
  }

  // ---------------- Controles ----------------
  const presets = $("presets");
  PRESETS.forEach((m) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = m + " min";
    b.addEventListener("click", () => ponerTotal(m * 60000));
    presets.appendChild(b);
  });

  document.querySelectorAll("[data-sumar]").forEach((b) => {
    b.addEventListener("click", () => {
      const delta = Number(b.dataset.sumar) * 1000;
      if (corriendo) {
        // Con el reloj en marcha se añade o quita tiempo a lo que queda.
        const nuevo = Math.max(1000, Math.min(MAX, queda() + delta));
        fin = performance.now() + nuevo;
        total = Math.max(total, nuevo);
        pintar();
      } else if (terminado) {
        if (delta > 0) {
          terminado = false;
          total = delta;
          restante = delta;
          arrancar();
        }
      } else if (restante < total) {
        restante = Math.max(1000, Math.min(MAX, restante + delta));
        total = Math.max(total, restante);
        pintar();
      } else {
        ponerTotal(total + delta);
      }
    });
  });

  function arrancar() {
    fin = performance.now() + restante;
    corriendo = true;
    pintar();
  }

  function empezarOPausar() {
    if (corriendo) {
      restante = queda();
      corriendo = false;
      pintar();
    } else {
      if (terminado) {
        terminado = false;
        total = cfg.total;
        restante = total;
      }
      arrancar();
    }
  }

  btnEmpezar.addEventListener("click", empezarOPausar);
  $("btn-reiniciar").addEventListener("click", () => ponerTotal(cfg.total));

  document.querySelectorAll("[data-vista].chip").forEach((b) => {
    b.addEventListener("click", () => {
      cfg.vista = b.dataset.vista;
      guardar();
      pintar();
    });
  });

  H.conmutador($("btn-ajustes"), $("ajustes"));
  const sonido = $("sonido");
  sonido.value = cfg.sonido;
  sonido.addEventListener("change", () => {
    cfg.sonido = sonido.value;
    guardar();
  });
  $("btn-probar").addEventListener("click", () => H.sonar(sonido.value || "tic"));
  const mostrar = $("mostrar-numeros");
  mostrar.checked = !!cfg.mostrarNumeros;
  mostrar.addEventListener("change", () => {
    cfg.mostrarNumeros = mostrar.checked;
    guardar();
    pintar();
  });

  document.addEventListener("keydown", (e) => {
    if (e.code !== "Space") return;
    if (/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test((e.target && e.target.tagName) || "")) return;
    e.preventDefault();
    empezarOPausar();
  });

  setInterval(pintar, 100);
  pintar();
})();
