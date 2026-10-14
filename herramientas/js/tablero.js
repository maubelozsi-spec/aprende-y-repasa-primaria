// ============================================================
// Tablero de Herramientas: varias herramientas de aula abiertas a
// la vez en la misma pantalla de la pizarra digital.
//
// Cada herramienta es una página propia (por ejemplo ../ruidometro/)
// que se abre aquí dentro de una ventana (iframe) con ?embed=1 para
// que use su diseño compacto. Así cada herramienta se programa y se
// prueba por separado, y para añadir una nueva basta con crear su
// página y apuntarla en HERRAMIENTAS.
//
// La posición y el tamaño de las ventanas se guardan como fracciones
// del tablero (0 a 1): el mismo tablero se ve igual en la pizarra que
// en el portátil, aunque las pantallas midan distinto.
// ============================================================
(function () {
  "use strict";

  // ---------------- Catálogo ----------------
  //  url:    página de la herramienta (relativa a esta carpeta).
  //  permite: permisos que necesita dentro del iframe.
  //  w, h:   tamaño inicial, en fracción del tablero.
  //  unica:  no se puede abrir dos veces (dos ruidómetros escucharían
  //          el mismo micrófono y se pisarían los puntos).
  const HERRAMIENTAS = [
    {
      id: "ruidometro",
      nombre: "Ruidómetro",
      icono: "🔊",
      url: "../ruidometro/index.html?embed=1",
      permite: "microphone; screen-wake-lock",
      w: 0.64,
      h: 0.8,
      unica: true,
    },
  ];

  const CLAVE = "ar_herramientas_tablero";
  const MIN_W = 300;
  const MIN_H = 220;

  const tablero = document.getElementById("tablero");
  const vacio = document.getElementById("tablero-vacio");
  const catalogo = document.getElementById("catalogo");

  // ---------------- Estado guardado ----------------
  function cargar() {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE) || "null");
      if (datos && Array.isArray(datos.ventanas)) return datos;
    } catch (e) {
      // Datos dañados o sin localStorage: se empieza de cero.
    }
    return null;
  }

  function guardar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch (e) {
      // Sin localStorage la disposición no se recuerda, pero funciona.
    }
  }

  function herramienta(id) {
    return HERRAMIENTAS.find((h) => h.id === id);
  }

  // La primera vez se abre el Ruidómetro, para que el tablero no
  // aparezca vacío.
  let estado = cargar() || {
    ventanas: [{ uid: "v1", tool: "ruidometro", x: 0.02, y: 0.03, w: 0.64, h: 0.8, max: false }],
    siguiente: 2,
  };
  estado.ventanas = estado.ventanas.filter((v) => herramienta(v.tool));
  if (!estado.siguiente) estado.siguiente = estado.ventanas.length + 1;

  const limitar = (v, a, b) => Math.max(a, Math.min(b, v));

  // ---------------- Ventanas ----------------
  const elementos = new Map();
  let zSuperior = 1;

  function colocar(v) {
    const caja = elementos.get(v.uid);
    if (!caja) return;
    caja.style.left = v.x * 100 + "%";
    caja.style.top = v.y * 100 + "%";
    caja.style.width = v.w * 100 + "%";
    caja.style.height = v.h * 100 + "%";
    caja.classList.toggle("maximizada", !!v.max);
    const btnMax = caja.querySelector(".ventana-boton-max");
    btnMax.textContent = v.max ? "🗗" : "🗖";
    btnMax.setAttribute("aria-label", v.max ? "Restaurar tamaño" : "Maximizar");
    btnMax.title = btnMax.getAttribute("aria-label");
  }

  function traerAlFrente(uid) {
    const caja = elementos.get(uid);
    if (!caja) return;
    caja.style.zIndex = ++zSuperior;
    elementos.forEach((otra) => otra.classList.toggle("activa", otra === caja));
  }

  function crearVentana(v) {
    const h = herramienta(v.tool);
    const caja = document.createElement("section");
    caja.className = "ventana";
    caja.setAttribute("aria-label", h.nombre);

    const cabecera = document.createElement("div");
    cabecera.className = "ventana-cabecera";
    const titulo = document.createElement("span");
    titulo.className = "ventana-titulo";
    titulo.textContent = h.icono + " " + h.nombre;
    const btnMax = document.createElement("button");
    btnMax.type = "button";
    btnMax.className = "ventana-boton ventana-boton-max";
    const btnCerrar = document.createElement("button");
    btnCerrar.type = "button";
    btnCerrar.className = "ventana-boton";
    btnCerrar.textContent = "✕";
    btnCerrar.setAttribute("aria-label", "Cerrar " + h.nombre);
    btnCerrar.title = "Cerrar";
    cabecera.append(titulo, btnMax, btnCerrar);

    const cuerpo = document.createElement("div");
    cuerpo.className = "ventana-cuerpo";
    const marco = document.createElement("iframe");
    marco.src = h.url;
    marco.title = h.nombre;
    if (h.permite) marco.allow = h.permite;
    cuerpo.appendChild(marco);

    const asa = document.createElement("div");
    asa.className = "ventana-redimensionar";
    asa.setAttribute("aria-hidden", "true");

    caja.append(cabecera, cuerpo, asa);
    tablero.appendChild(caja);
    elementos.set(v.uid, caja);
    colocar(v);

    caja.addEventListener("pointerdown", () => traerAlFrente(v.uid), true);
    // Un toque dentro de la herramienta no llega a esta página (es otro
    // documento): se detecta porque el foco pasa a su iframe.
    marco.addEventListener("focus", () => traerAlFrente(v.uid));

    btnCerrar.addEventListener("click", () => cerrar(v.uid));
    btnMax.addEventListener("click", () => {
      v.max = !v.max;
      colocar(v);
      guardar();
    });
    cabecera.addEventListener("dblclick", (e) => {
      if (e.target.closest("button")) return;
      v.max = !v.max;
      colocar(v);
      guardar();
    });

    arrastrable(cabecera, v, "mover");
    arrastrable(asa, v, "tamano");
    traerAlFrente(v.uid);
  }

  // Mover (por la cabecera) o cambiar el tamaño (por la esquina) con
  // ratón, dedo o lápiz de la pizarra: Pointer Events cubre los tres.
  function arrastrable(asidero, v, modo) {
    asidero.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.target.closest("button") || v.max) return;
      if (window.matchMedia("(max-width: 700px)").matches) return;
      e.preventDefault();
      const caja = elementos.get(v.uid);
      const rect = tablero.getBoundingClientRect();
      const inicio = { px: e.clientX, py: e.clientY, x: v.x, y: v.y, w: v.w, h: v.h };
      const minW = Math.min(1, MIN_W / rect.width);
      const minH = Math.min(1, MIN_H / rect.height);
      asidero.setPointerCapture(e.pointerId);
      tablero.classList.add("moviendo");

      function mover(ev) {
        const dx = (ev.clientX - inicio.px) / rect.width;
        const dy = (ev.clientY - inicio.py) / rect.height;
        if (modo === "mover") {
          // La ventana no sale del tablero: si no, la esquina para
          // cambiar el tamaño quedaría fuera de la pantalla.
          v.x = limitar(inicio.x + dx, 0, Math.max(0, 1 - v.w));
          v.y = limitar(inicio.y + dy, 0, Math.max(0, 1 - v.h));
        } else {
          v.w = limitar(inicio.w + dx, minW, 1 - v.x);
          v.h = limitar(inicio.h + dy, minH, 1 - v.y);
        }
        colocar(v);
      }

      function soltar() {
        asidero.removeEventListener("pointermove", mover);
        asidero.removeEventListener("pointerup", soltar);
        asidero.removeEventListener("pointercancel", soltar);
        tablero.classList.remove("moviendo");
        guardar();
      }

      asidero.addEventListener("pointermove", mover);
      asidero.addEventListener("pointerup", soltar);
      asidero.addEventListener("pointercancel", soltar);
    });
  }

  function abrir(id) {
    const h = herramienta(id);
    if (!h) return;
    const yaAbierta = estado.ventanas.find((v) => v.tool === id);
    if (h.unica && yaAbierta) {
      traerAlFrente(yaAbierta.uid);
      return;
    }
    // Cada ventana nueva un poco desplazada para que no tape del todo
    // a la anterior.
    const n = estado.ventanas.length;
    const v = {
      uid: "v" + estado.siguiente++,
      tool: id,
      w: h.w,
      h: h.h,
      x: limitar(0.03 + n * 0.04, 0, 1 - h.w),
      y: limitar(0.03 + n * 0.05, 0, 1 - h.h),
      max: false,
    };
    estado.ventanas.push(v);
    crearVentana(v);
    actualizar();
  }

  function cerrar(uid) {
    const caja = elementos.get(uid);
    if (caja) caja.remove();
    elementos.delete(uid);
    estado.ventanas = estado.ventanas.filter((v) => v.uid !== uid);
    actualizar();
  }

  // Reparte las ventanas abiertas en una cuadrícula que llena el tablero.
  function ordenar() {
    const n = estado.ventanas.length;
    if (!n) return;
    const cols = Math.ceil(Math.sqrt(n));
    const filas = Math.ceil(n / cols);
    const hueco = 0.01;
    estado.ventanas.forEach((v, i) => {
      const c = i % cols;
      const f = Math.floor(i / cols);
      v.max = false;
      v.w = 1 / cols - hueco * 2;
      v.h = 1 / filas - hueco * 2;
      v.x = c / cols + hueco;
      v.y = f / filas + hueco;
      colocar(v);
    });
    guardar();
  }

  function actualizar() {
    vacio.hidden = estado.ventanas.length > 0;
    catalogo.querySelectorAll("[data-tool]").forEach((b) => {
      const abierta = estado.ventanas.some((v) => v.tool === b.dataset.tool);
      b.setAttribute("aria-pressed", String(abierta));
    });
    guardar();
  }

  // ---------------- Barra ----------------
  HERRAMIENTAS.forEach((h) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn btn-herramienta";
    b.dataset.tool = h.id;
    b.textContent = h.icono + " " + h.nombre;
    b.title = h.unica ? "Abrir o traer al frente" : "Abrir otra";
    b.addEventListener("click", () => abrir(h.id));
    catalogo.appendChild(b);
  });

  document.getElementById("btn-ordenar").addEventListener("click", ordenar);

  const btnPantalla = document.getElementById("btn-pantalla");
  function enPantallaCompleta() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }
  btnPantalla.addEventListener("click", () => {
    const raiz = document.documentElement;
    if (enPantallaCompleta()) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } else if (raiz.requestFullscreen) {
      raiz.requestFullscreen().catch(() => {});
    } else if (raiz.webkitRequestFullscreen) {
      raiz.webkitRequestFullscreen();
    }
  });
  function actualizarBotonPantalla() {
    btnPantalla.textContent = enPantallaCompleta() ? "⛶ Salir de pantalla completa" : "⛶ Pantalla completa";
  }
  document.addEventListener("fullscreenchange", actualizarBotonPantalla);
  document.addEventListener("webkitfullscreenchange", actualizarBotonPantalla);

  // ---------------- Arranque ----------------
  estado.ventanas.forEach(crearVentana);
  actualizar();
})();
