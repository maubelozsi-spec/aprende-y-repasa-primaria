// ============================================================
// Ruidómetro: mide el ruido de la clase con el micrófono del
// equipo y suma un punto por cada minuto entero sin pasar del
// límite que fija el docente.
//
// Cómo se mide:
//  - Se pide el micrófono SIN cancelación de eco, supresión de
//    ruido ni control automático de ganancia. Esos filtros están
//    pensados para videollamadas: suben la voz baja y aplastan la
//    alta, y con ellos activos el medidor apenas se movería.
//  - Cada 50 ms se calcula la energía (RMS) de la señal, se pasa a
//    dBFS y se convierte en un nivel de 0 a 100. NO son decibelios
//    reales: sin calibrar el micrófono es imposible saberlos. Por eso
//    la app permite medir el límite con la propia clase.
//  - El nivel se suaviza (sube rápido, baja despacio) para que la
//    aguja no tiemble, y los picos cortos —una tos, una silla— se
//    perdonan durante unos segundos que elige el docente.
//
// Puntos: cada minuto entero de cuenta es un punto. Si el nivel se
// queda en la zona roja más del tiempo permitido (3 s como máximo),
// se anota un aviso y la cuenta vuelve a cero y empieza de nuevo en
// el acto; si sigue el ruido, cada nuevo tramo en rojo es otro aviso.
// Cada 5 avisos la clase pierde un punto.
//
// No se graba ni se envía nada: el audio solo se analiza en memoria.
// ============================================================
(function () {
  "use strict";

  const CLAVE = "ar_ruidometro";
  const MINUTO = 60000;
  const INTERVALO = 50;
  // Rango de dBFS que se reparte entre 0 y 100. Con los filtros del
  // navegador apagados, un aula en silencio suele quedar hacia -60 dBFS,
  // hablar normal hacia -30 y gritar cerca de -10.
  const DB_MIN = -70;
  const DB_MAX = -10;
  const MEDIR_MS = 10000;
  const TOLERANCIA_MAX = 3;
  const AVISOS_POR_PUNTO = 5;

  // ---------------- Ajustes guardados ----------------
  const porDefecto = {
    limite: 50,
    tolerancia: TOLERANCIA_MAX,
    // Avisos acumulados hacia la pérdida del siguiente punto (0 a 4).
    avisosCiclo: 0,
    sensibilidad: 0,
    sonido: false,
    seguirVoz: true,
    meta: 10,
    premio: "",
    puntos: 0,
    microfono: "",
    dias: {},
  };

  function cargar() {
    try {
      const raw = localStorage.getItem(CLAVE);
      const datos = raw ? JSON.parse(raw) : {};
      return Object.assign({}, porDefecto, datos && typeof datos === "object" ? datos : {});
    } catch (e) {
      return Object.assign({}, porDefecto);
    }
  }

  const cfg = cargar();
  if (!cfg.dias || typeof cfg.dias !== "object") cfg.dias = {};
  // Antes el tiempo perdonado era de 1,5 s por defecto y llegaba a 5 s.
  // Ahora el máximo es 3 s, y es lo que se usa salvo que se baje a mano.
  if (cfg.versionAvisos !== 1) {
    cfg.tolerancia = TOLERANCIA_MAX;
    cfg.versionAvisos = 1;
  }
  cfg.tolerancia = Math.max(0, Math.min(TOLERANCIA_MAX, Number(cfg.tolerancia) || 0));
  cfg.avisosCiclo = Math.max(0, Math.min(AVISOS_POR_PUNTO - 1, parseInt(cfg.avisosCiclo, 10) || 0));

  function guardar() {
    // Solo se conservan los últimos 60 días de resumen.
    const claves = Object.keys(cfg.dias).sort();
    while (claves.length > 60) delete cfg.dias[claves.shift()];
    try {
      localStorage.setItem(CLAVE, JSON.stringify(cfg));
    } catch (e) {
      // Sin localStorage (ventana privada, bloqueado): la app sigue
      // funcionando, solo que los puntos no se recuerdan al cerrar.
    }
  }

  function hoy() {
    const d = new Date();
    const dos = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + dos(d.getMonth() + 1) + "-" + dos(d.getDate());
  }

  function diaDeHoy() {
    const k = hoy();
    if (!cfg.dias[k]) cfg.dias[k] = { puntos: 0, avisos: 0 };
    return cfg.dias[k];
  }

  // ---------------- Elementos ----------------
  const $ = (id) => document.getElementById(id);
  const el = {
    tablero: $("tablero"),
    aguja: $("aguja"),
    arcoPista: $("arco-pista"),
    arcoVerde: $("arco-verde"),
    arcoAmbar: $("arco-ambar"),
    arcoRoja: $("arco-roja"),
    marcaLimite: $("marca-limite"),
    textoLimite: $("texto-limite"),
    marcaPico: $("marca-pico"),
    cara: $("estado-cara"),
    estadoTexto: $("estado-texto"),
    nivelNum: $("nivel-num"),
    limiteNum: $("limite-num"),
    btnActivar: $("btn-activar"),
    btnPausa: $("btn-pausa"),
    error: $("aviso-error"),
    minutoProgreso: $("minuto-progreso"),
    minutoTiempo: $("minuto-tiempo"),
    minutoExplica: $("minuto-explica"),
    avisos: $("avisos"),
    avisosMarcas: $("avisos-marcas"),
    avisosTexto: $("avisos-texto"),
    puntos: document.querySelector(".puntos"),
    puntosNum: $("puntos-num"),
    puntosEtiqueta: $("puntos-etiqueta"),
    meta: $("meta"),
    metaRelleno: $("meta-relleno"),
    metaTexto: $("meta-texto"),
    hoyPuntos: $("hoy-puntos"),
    hoyAvisos: $("hoy-avisos"),
    racha: $("racha"),
    btnAjustes: $("btn-ajustes"),
    ajustes: $("ajustes"),
    btnPantalla: $("btn-pantalla"),
    limite: $("limite"),
    limiteEtiqueta: $("limite-etiqueta"),
    btnMedir: $("btn-medir"),
    medirResultado: $("medir-resultado"),
    tolerancia: $("tolerancia"),
    toleranciaEtiqueta: $("tolerancia-etiqueta"),
    sensibilidad: $("sensibilidad"),
    sensibilidadEtiqueta: $("sensibilidad-etiqueta"),
    microfono: $("microfono"),
    sonido: $("sonido"),
    seguirVoz: $("seguir-voz"),
    metaPuntos: $("meta-puntos"),
    premio: $("premio"),
    btnSumar: $("btn-sumar"),
    btnRestar: $("btn-restar"),
    btnReiniciar: $("btn-reiniciar"),
    celebracion: $("celebracion"),
  };

  // ---------------- Estado en marcha ----------------
  let ctx = null;
  let stream = null;
  let analyser = null;
  let muestras = null;
  let temporizador = null;
  let wakeLock = null;

  let nivel = 0;
  let pico = 0;
  let picoT = 0;
  let ultimo = 0;
  let pausado = false;
  let silencioMs = 0;
  let rachaMs = 0;
  let sobreDesde = null;
  let enAviso = false;
  let ignorarHasta = 0;
  let medicion = null;
  let estadoAnterior = "";

  // ---------------- Dial ----------------
  const CX = 200, CY = 200, R = 150;

  function punto(v, r) {
    const ang = Math.PI * (1 - v / 100);
    return [CX + r * Math.cos(ang), CY - r * Math.sin(ang)];
  }

  function arco(a, b) {
    if (b - a <= 0.01) return "";
    const p = punto(a, R), q = punto(b, R);
    return "M" + p[0].toFixed(2) + " " + p[1].toFixed(2) + " A" + R + " " + R + " 0 0 1 " + q[0].toFixed(2) + " " + q[1].toFixed(2);
  }

  function linea(elemento, v, r1, r2) {
    const p = punto(v, r1), q = punto(v, r2);
    elemento.setAttribute("x1", p[0]);
    elemento.setAttribute("y1", p[1]);
    elemento.setAttribute("x2", q[0]);
    elemento.setAttribute("y2", q[1]);
  }

  function pintarZonas() {
    const L = cfg.limite;
    el.arcoPista.setAttribute("d", arco(0, 100));
    el.arcoVerde.setAttribute("d", arco(0, L * 0.8));
    el.arcoAmbar.setAttribute("d", arco(L * 0.8, L));
    el.arcoRoja.setAttribute("d", arco(L, 100));
    linea(el.marcaLimite, L, R - 26, R + 26);
    // Cuanto más a los lados, más ancho ocupa el texto en horizontal:
    // se separa más del arco para que no lo pise.
    const t = punto(L, R + 40 + Math.abs(Math.cos(Math.PI * (1 - L / 100))) * 22);
    el.textoLimite.setAttribute("x", Math.min(365, Math.max(35, t[0])));
    el.textoLimite.setAttribute("y", Math.max(14, t[1]));
    el.limiteNum.textContent = L;
    el.limiteEtiqueta.textContent = L;
  }

  // ---------------- Textos de estado ----------------
  const ESTADOS = {
    apagado: ["🎤", "Pulsa «Activar micrófono» para empezar"],
    bajo: ["😌", "¡Muy bien! Buen nivel de ruido"],
    medio: ["😐", "Cuidado, os acercáis al límite"],
    alto: ["😣", "¡Demasiado ruido!"],
    pausa: ["⏸️", "Puntos en pausa"],
    midiendo: ["📏", "Midiendo el ruido permitido…"],
  };

  function ponerEstado(estado) {
    el.tablero.dataset.estado = estado;
    if (estado === estadoAnterior) return;
    estadoAnterior = estado;
    el.cara.textContent = ESTADOS[estado][0];
    el.estadoTexto.textContent = ESTADOS[estado][1];
  }

  function formatoTiempo(ms) {
    const s = Math.floor(ms / 1000);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }

  const CIRCUNFERENCIA = 2 * Math.PI * 52;

  function pintarMinuto() {
    const fraccion = Math.min(1, silencioMs / MINUTO);
    el.minutoProgreso.style.strokeDashoffset = (CIRCUNFERENCIA * (1 - fraccion)).toFixed(2);
    el.minutoTiempo.textContent = formatoTiempo(silencioMs);
    el.racha.textContent = Math.floor(rachaMs / MINUTO) + " min";

    let explica = "Cada minuto sin pasar del límite = 1 punto";
    if (stream && medicion) explica = "Mientras se mide no se cuentan puntos";
    else if (stream && pausado) explica = "Puntos en pausa: el minuto no avanza";
    else if (stream && enAviso) explica = "¡Aviso! Más de " + formatoSegundos(cfg.tolerancia) + " en rojo: el minuto vuelve a empezar";
    else if (stream && sobreDesde !== null) {
      const queda = Math.max(0, Math.ceil(cfg.tolerancia - (performance.now() - sobreDesde) / 1000));
      explica = "¡En la zona roja! Aviso en " + queda + " s";
    }
    if (el.minutoExplica.textContent !== explica) el.minutoExplica.textContent = explica;
  }

  function pintarPuntos() {
    el.puntosNum.textContent = cfg.puntos;
    el.puntosEtiqueta.textContent = cfg.puntos === 1 ? "punto" : "puntos";
    const d = diaDeHoy();
    el.hoyPuntos.textContent = d.puntos + (d.puntos === 1 ? " punto" : " puntos");
    el.hoyAvisos.textContent = d.avisos;

    // Marcas de los avisos que llevan hacia el siguiente punto perdido.
    if (el.avisosMarcas.children.length !== AVISOS_POR_PUNTO) {
      el.avisosMarcas.innerHTML = "";
      for (let i = 0; i < AVISOS_POR_PUNTO; i++) el.avisosMarcas.appendChild(document.createElement("span"));
    }
    Array.prototype.forEach.call(el.avisosMarcas.children, (m, i) => m.classList.toggle("puesta", i < cfg.avisosCiclo));
    const faltan = AVISOS_POR_PUNTO - cfg.avisosCiclo;
    el.avisosTexto.textContent =
      "Avisos: " + cfg.avisosCiclo + " de " + AVISOS_POR_PUNTO +
      (cfg.avisosCiclo
        ? faltan === 1
          ? " · ¡al próximo se pierde un punto!"
          : " · con " + faltan + " más se pierde un punto"
        : " · a los " + AVISOS_POR_PUNTO + " se pierde un punto");
    el.avisos.classList.toggle("peligro", faltan === 1);

    const meta = Number(cfg.meta) || 0;
    el.meta.hidden = meta <= 0;
    if (meta > 0) {
      el.metaRelleno.style.width = Math.min(100, (cfg.puntos / meta) * 100) + "%";
      const premio = (cfg.premio || "").trim();
      const cumplida = cfg.puntos >= meta;
      el.meta.classList.toggle("cumplida", cumplida);
      if (cumplida) {
        el.metaTexto.textContent = "🏆 ¡Meta conseguida!" + (premio ? " " + premio : "");
      } else {
        const faltan = meta - cfg.puntos;
        el.metaTexto.textContent =
          "Faltan " + faltan + (faltan === 1 ? " punto" : " puntos") + (premio ? " para: " + premio : " para la meta (" + meta + ")");
      }
    }
  }

  // ---------------- Sonidos ----------------
  // Generados con el propio Web Audio (sin archivos). Mientras suenan
  // se deja de escuchar al micrófono: si no, el altavoz de la pizarra
  // haría saltar el medidor con su propio aviso.
  function tono(frecuencias, duracion) {
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const paso = duracion / frecuencias.length;
    frecuencias.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0 + i * paso);
      g.gain.exponentialRampToValueAtTime(0.25, t0 + i * paso + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + (i + 1) * paso);
      osc.connect(g).connect(ctx.destination);
      osc.start(t0 + i * paso);
      osc.stop(t0 + (i + 1) * paso + 0.05);
    });
    ignorarHasta = performance.now() + duracion * 1000 + 700;
  }

  // ---------------- Lógica de puntos ----------------
  function animarPuntos(texto, perdida) {
    el.celebracion.textContent = texto;
    el.celebracion.classList.toggle("perdida", perdida);
    el.puntos.classList.remove("salto", "baja");
    el.celebracion.classList.remove("ver");
    void el.celebracion.offsetWidth;
    el.puntos.classList.add(perdida ? "baja" : "salto");
    el.celebracion.classList.add("ver");
  }

  function ganarPunto() {
    cfg.puntos += 1;
    diaDeHoy().puntos += 1;
    guardar();
    pintarPuntos();
    animarPuntos("+1 ⭐", false);
    if (cfg.sonido) tono([660, 880], 0.5);
  }

  // Más tiempo del permitido en la zona roja: el minuto vuelve a cero
  // y sigue contando desde ahí. Al quinto aviso se pierde un punto (si
  // la clase tiene alguno) y la cuenta de avisos empieza de nuevo.
  function aviso() {
    enAviso = true;
    silencioMs = 0;
    rachaMs = 0;
    const dia = diaDeHoy();
    dia.avisos += 1;
    cfg.avisosCiclo += 1;
    let pierde = false;
    if (cfg.avisosCiclo >= AVISOS_POR_PUNTO) {
      cfg.avisosCiclo = 0;
      pierde = cfg.puntos > 0;
      cfg.puntos = Math.max(0, cfg.puntos - 1);
      dia.perdidos = (dia.perdidos || 0) + 1;
    }
    guardar();
    pintarPuntos();
    el.tablero.classList.remove("destello");
    void el.tablero.offsetWidth;
    el.tablero.classList.add("destello");
    if (pierde) {
      animarPuntos("−1 ⭐", true);
      if (cfg.sonido) tono([392, 330, 262], 1);
    } else if (cfg.sonido) {
      tono([440, 330], 0.7);
    }
  }

  function leerNivel() {
    analyser.getFloatTimeDomainData(muestras);
    let suma = 0;
    for (let i = 0; i < muestras.length; i++) suma += muestras[i] * muestras[i];
    const rms = Math.sqrt(suma / muestras.length);
    const db = 20 * Math.log10(rms + 1e-10) + Number(cfg.sensibilidad);
    return Math.max(0, Math.min(100, ((db - DB_MIN) / (DB_MAX - DB_MIN)) * 100));
  }

  function tick() {
    const ahora = performance.now();
    // En una pestaña oculta el navegador espacia los temporizadores.
    // Se limita el salto para no regalar tiempo que no se ha escuchado.
    const dt = Math.min(ahora - ultimo, 1000);
    ultimo = ahora;

    const escuchando = ahora >= ignorarHasta;
    if (escuchando) {
      const objetivo = leerNivel();
      const tau = objetivo > nivel ? 150 : 600;
      nivel += (objetivo - nivel) * (1 - Math.exp(-dt / tau));
    }

    if (nivel >= pico) {
      pico = nivel;
      picoT = ahora;
    } else if (ahora - picoT > 2000) {
      pico = Math.max(nivel, pico - dt * 0.02);
    }

    const L = cfg.limite;
    const alto = nivel > L;

    if (medicion) {
      medicion.valores.push(nivel);
      const queda = Math.ceil((medicion.hasta - ahora) / 1000);
      el.estadoTexto.textContent = "Midiendo el ruido permitido… " + Math.max(0, queda) + " s";
      if (ahora >= medicion.hasta) terminarMedicion();
    } else if (!pausado) {
      if (alto && escuchando) {
        if (sobreDesde === null) sobreDesde = ahora;
        if (ahora - sobreDesde >= cfg.tolerancia * 1000) {
          aviso();
          // Si el ruido sigue, empieza otro tramo: otros 3 s en rojo
          // serán otro aviso.
          sobreDesde = ahora;
        }
      } else if (!alto) {
        sobreDesde = null;
        enAviso = false;
      }
      // El minuto avanza siempre: tras un aviso se pone a cero y
      // vuelve a contar desde ahí.
      silencioMs += dt;
      rachaMs += dt;
      // No se da el punto en mitad de un pico que aún podría acabar
      // en aviso.
      if (silencioMs >= MINUTO && sobreDesde === null) {
        silencioMs -= MINUTO;
        ganarPunto();
      }
    }

    // Pintar
    el.aguja.style.transform = "rotate(" + (nivel * 1.8).toFixed(1) + "deg)";
    linea(el.marcaPico, pico, R - 20, R + 20);
    el.nivelNum.textContent = Math.round(nivel);
    let estado = alto ? "alto" : nivel > L * 0.8 ? "medio" : "bajo";
    if (medicion) estado = "midiendo";
    else if (pausado) estado = "pausa";
    ponerEstado(estado);
    pintarMinuto();
  }

  // ---------------- Medir el límite con la clase ----------------
  function empezarMedicion() {
    if (!stream || medicion) return;
    medicion = { hasta: performance.now() + MEDIR_MS, valores: [] };
    sobreDesde = null;
    enAviso = false;
    el.btnMedir.disabled = true;
    el.medirResultado.textContent = "Escuchando…";
    estadoAnterior = "";
  }

  function terminarMedicion() {
    const v = medicion.valores.slice().sort((a, b) => a - b);
    medicion = null;
    el.btnMedir.disabled = !stream;
    estadoAnterior = "";
    if (!v.length) {
      el.medirResultado.textContent = "No se ha podido medir. Inténtalo otra vez.";
      return;
    }
    // Se toma el percentil 95 y no el máximo: un golpe suelto durante
    // la medición no debe dejar el límite por las nubes.
    const habitual = v[Math.floor(v.length * 0.95)] || v[v.length - 1];
    const maximo = v[v.length - 1];
    cambiarLimite(Math.round(habitual + 8));
    el.medirResultado.textContent =
      "Medido: lo habitual " + Math.round(habitual) + ", el pico " + Math.round(maximo) + ". Límite fijado en " + cfg.limite + ".";
  }

  // ---------------- Micrófono ----------------
  function mostrarError(texto) {
    el.error.textContent = texto;
    el.error.hidden = !texto;
  }

  async function pedirWakeLock() {
    try {
      if ("wakeLock" in navigator && document.visibilityState === "visible") {
        wakeLock = await navigator.wakeLock.request("screen");
      }
    } catch (e) {
      // Sin permiso o sin soporte: la pantalla puede apagarse sola.
    }
  }

  async function rellenarMicrofonos() {
    try {
      const dispositivos = await navigator.mediaDevices.enumerateDevices();
      const entradas = dispositivos.filter((d) => d.kind === "audioinput");
      const actual = stream ? stream.getAudioTracks()[0].getSettings().deviceId : "";
      el.microfono.innerHTML = "";
      entradas.forEach((d, i) => {
        const op = document.createElement("option");
        op.value = d.deviceId;
        op.textContent = d.label || "Micrófono " + (i + 1);
        if (d.deviceId === actual) op.selected = true;
        el.microfono.appendChild(op);
      });
      el.microfono.disabled = entradas.length < 2;
    } catch (e) {
      el.microfono.disabled = true;
    }
  }

  async function activar(deviceId) {
    mostrarError("");
    if (!window.isSecureContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      mostrarError("El micrófono solo funciona si la página se abre con https:// (o desde el propio equipo). Abre Aprende y Repasa desde su dirección web habitual.");
      return;
    }
    const audio = { echoCancellation: false, noiseSuppression: false, autoGainControl: false };
    if (deviceId) audio.deviceId = { exact: deviceId };

    let nuevo;
    try {
      nuevo = await navigator.mediaDevices.getUserMedia({ audio: audio });
    } catch (e) {
      if (deviceId && e && e.name === "OverconstrainedError") return activar("");
      const nombre = e && e.name;
      if (nombre === "NotAllowedError" || nombre === "SecurityError") {
        mostrarError("El navegador no ha dado permiso para usar el micrófono. Pulsa el candado de la barra de direcciones, permite el micrófono y vuelve a pulsar «Activar micrófono».");
      } else if (nombre === "NotFoundError") {
        mostrarError("No se ha encontrado ningún micrófono. Comprueba que la pizarra o el ordenador tienen uno conectado y encendido.");
      } else if (nombre === "NotReadableError") {
        mostrarError("El micrófono está ocupado por otra aplicación (Teams, Meet, Zoom…). Ciérrala y vuelve a intentarlo.");
      } else {
        mostrarError("No se ha podido activar el micrófono" + (nombre ? " (" + nombre + ")" : "") + ".");
      }
      return;
    }

    pararMicrofono();
    stream = nuevo;
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") await ctx.resume();

    const fuente = ctx.createMediaStreamSource(stream);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    muestras = new Float32Array(analyser.fftSize);
    fuente.connect(analyser);

    const pista = stream.getAudioTracks()[0];
    cfg.microfono = pista.getSettings().deviceId || "";
    guardar();
    pista.addEventListener("ended", () => {
      apagar();
      mostrarError("Se ha perdido el micrófono (¿se ha desconectado?). Vuelve a activarlo.");
    });

    ultimo = performance.now();
    temporizador = setInterval(tick, INTERVALO);
    el.btnActivar.textContent = "⏹ Apagar micrófono";
    el.btnActivar.classList.remove("btn-primario");
    el.btnPausa.hidden = false;
    el.btnMedir.disabled = false;
    pedirWakeLock();
    rellenarMicrofonos();
  }

  function pararMicrofono() {
    if (temporizador) clearInterval(temporizador);
    temporizador = null;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = null;
    analyser = null;
  }

  function apagar() {
    pararMicrofono();
    medicion = null;
    nivel = 0;
    pico = 0;
    sobreDesde = null;
    enAviso = false;
    if (wakeLock) wakeLock.release().catch(() => {});
    wakeLock = null;
    el.btnActivar.textContent = "🎤 Activar micrófono";
    el.btnActivar.classList.add("btn-primario");
    el.btnPausa.hidden = true;
    el.btnMedir.disabled = true;
    el.aguja.style.transform = "rotate(0deg)";
    linea(el.marcaPico, 0, R, R);
    el.nivelNum.textContent = "–";
    estadoAnterior = "";
    ponerEstado("apagado");
    pintarMinuto();
  }

  // ---------------- Controles ----------------
  function cambiarLimite(v) {
    cfg.limite = Math.max(5, Math.min(95, Math.round(Number(v) || porDefecto.limite)));
    el.limite.value = cfg.limite;
    sobreDesde = null;
    guardar();
    pintarZonas();
  }

  function cambiarPausa(valor) {
    pausado = valor;
    sobreDesde = null;
    enAviso = false;
    el.btnPausa.textContent = pausado ? "▶ Reanudar puntos" : "⏸ Pausar puntos";
    el.btnPausa.classList.toggle("activo", pausado);
  }

  function formatoSegundos(v) {
    return String(v).replace(".", ",") + " s";
  }

  el.btnActivar.addEventListener("click", () => {
    if (stream) apagar();
    else activar(cfg.microfono);
  });

  el.btnPausa.addEventListener("click", () => cambiarPausa(!pausado));

  el.btnAjustes.addEventListener("click", () => {
    const abrir = el.ajustes.hidden;
    el.ajustes.hidden = !abrir;
    el.btnAjustes.setAttribute("aria-expanded", String(abrir));
    if (abrir) el.ajustes.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  el.limite.addEventListener("input", () => cambiarLimite(el.limite.value));
  document.querySelectorAll("[data-limite]").forEach((b) => {
    b.addEventListener("click", () => cambiarLimite(b.dataset.limite));
  });

  el.btnMedir.addEventListener("click", empezarMedicion);

  el.tolerancia.addEventListener("input", () => {
    cfg.tolerancia = Number(el.tolerancia.value);
    el.toleranciaEtiqueta.textContent = formatoSegundos(cfg.tolerancia);
    guardar();
  });

  el.sensibilidad.addEventListener("input", () => {
    cfg.sensibilidad = Number(el.sensibilidad.value);
    el.sensibilidadEtiqueta.textContent = (cfg.sensibilidad > 0 ? "+" : "") + cfg.sensibilidad;
    guardar();
  });

  el.microfono.addEventListener("change", () => activar(el.microfono.value));

  el.sonido.addEventListener("change", () => {
    cfg.sonido = el.sonido.checked;
    guardar();
  });

  el.metaPuntos.addEventListener("input", () => {
    cfg.meta = Math.max(0, Math.min(999, parseInt(el.metaPuntos.value, 10) || 0));
    guardar();
    pintarPuntos();
  });

  el.premio.addEventListener("input", () => {
    cfg.premio = el.premio.value.slice(0, 60);
    guardar();
    pintarPuntos();
  });

  el.btnSumar.addEventListener("click", () => {
    cfg.puntos += 1;
    guardar();
    pintarPuntos();
  });

  el.btnRestar.addEventListener("click", () => {
    cfg.puntos = Math.max(0, cfg.puntos - 1);
    guardar();
    pintarPuntos();
  });

  el.btnReiniciar.addEventListener("click", () => {
    if (!window.confirm("¿Poner los puntos de la clase a 0? No se puede deshacer.")) return;
    cfg.puntos = 0;
    cfg.avisosCiclo = 0;
    silencioMs = 0;
    rachaMs = 0;
    guardar();
    pintarPuntos();
    pintarMinuto();
  });

  // Pantalla completa (con prefijo para Safari antiguo).
  function enPantallaCompleta() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }
  el.btnPantalla.addEventListener("click", () => {
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
    el.btnPantalla.textContent = enPantallaCompleta() ? "⛶ Salir de pantalla completa" : "⛶ Pantalla completa";
  }
  document.addEventListener("fullscreenchange", actualizarBotonPantalla);
  document.addEventListener("webkitfullscreenchange", actualizarBotonPantalla);

  // Barra espaciadora: pausar o reanudar los puntos sin ir al botón.
  document.addEventListener("keydown", (e) => {
    if (e.code !== "Space" || !stream) return;
    const etiqueta = (e.target && e.target.tagName) || "";
    if (/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(etiqueta)) return;
    e.preventDefault();
    cambiarPausa(!pausado);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && stream) pedirWakeLock();
  });

  el.tablero.addEventListener("animationend", (e) => {
    if (e.animationName === "destello") el.tablero.classList.remove("destello");
  });

  el.seguirVoz.addEventListener("change", () => {
    cfg.seguirVoz = el.seguirVoz.checked;
    guardar();
  });

  // Enlace con «Nivel de voz»: esa herramienta, abierta en otra
  // ventana del tablero, publica el nivel elegido en localStorage. El
  // evento «storage» solo llega a los OTROS documentos, que es justo
  // lo que se quiere.
  window.addEventListener("storage", (e) => {
    if (e.key !== "ar_nivel_voz_activo" || !e.newValue || !cfg.seguirVoz) return;
    try {
      const nivel = JSON.parse(e.newValue);
      if (!nivel || typeof nivel.limite !== "number") return;
      cambiarLimite(nivel.limite);
      el.medirResultado.textContent = "Límite " + cfg.limite + " por el nivel de voz «" + String(nivel.nombre || "").slice(0, 30) + "».";
    } catch (err) {
      // Dato ilegible: se ignora.
    }
  });

  // ---------------- Arranque ----------------
  el.limite.value = cfg.limite;
  el.tolerancia.value = cfg.tolerancia;
  el.toleranciaEtiqueta.textContent = formatoSegundos(cfg.tolerancia);
  el.sensibilidad.value = cfg.sensibilidad;
  el.sensibilidadEtiqueta.textContent = (cfg.sensibilidad > 0 ? "+" : "") + cfg.sensibilidad;
  el.sonido.checked = !!cfg.sonido;
  el.seguirVoz.checked = cfg.seguirVoz !== false;
  el.metaPuntos.value = cfg.meta;
  el.premio.value = cfg.premio || "";
  pintarZonas();
  linea(el.marcaPico, 0, R, R);
  ponerEstado("apagado");
  pintarMinuto();
  pintarPuntos();

  // Si en este navegador ya se dio permiso al micrófono, el medidor
  // arranca solo al abrir la página: así está listo en la pizarra sin
  // tocar nada. Si el navegador no deja arrancar el audio sin un toque
  // en pantalla, se queda como estaba, con el botón «Activar micrófono».
  (async function arrancarSolo() {
    try {
      if (!navigator.permissions || !navigator.permissions.query) return;
      const estado = await navigator.permissions.query({ name: "microphone" });
      if (estado.state !== "granted") return;
      await activar(cfg.microfono);
      if (ctx && ctx.state !== "running") {
        apagar();
        el.estadoTexto.textContent = "Toca «Activar micrófono» para empezar";
      }
    } catch (e) {
      // Navegador sin consulta de permisos: se usa el botón.
    }
  })();
})();
