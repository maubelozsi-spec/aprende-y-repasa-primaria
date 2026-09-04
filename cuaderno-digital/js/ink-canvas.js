// ============================================================
// Cuaderno Digital — lienzo de tinta (lápiz digital).
//
// Un único <canvas> por página dibuja todos los trazos. Cada trazo
// es independiente (su propio documento en Firestore, ver app.js):
// así, si el mismo docente dibuja sin conexión en dos dispositivos a
// la vez, al reconectar se guardan los trazos de los dos en vez de
// que uno se coma al otro.
//
// Simplificaciones deliberadas frente a OneNote:
// - El suavizado usa curvas cuadráticas por punto medio (rápido y
//   con buen aspecto), no un motor de trazo vectorial con grosor
//   variable real: es una aproximación visual, no idéntica a la tinta
//   nativa de Windows.
// - La goma borra TRAZOS ENTEROS que toca (como el "borrador de
//   objeto"), no a nivel de píxel/segmento. Es más simple y evita
//   tener que reconstruir un trazo partido en varios documentos.
// - Rechazo de palma: mientras hay un trazo de tipo "pen" en curso,
//   se ignoran los punteros de tipo "touch" (dedo) que empiecen
//   después. No es rechazo de palma real (eso lo hace el sistema
//   operativo en las apps nativas), pero evita el caso más molesto:
//   la mano apoyada añadiendo trazos mientras escribes.
// ============================================================

const DISTANCIA_MIN_PUNTO = 2; // px lógicos — descarta puntos casi idénticos
const RADIO_GOMA = 14; // px lógicos — distancia de "toque" para borrar un trazo

function distancia(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function anchoParaPresion(p, base) {
  const presion = p && p > 0 ? p : 0.5;
  return Math.max(1, base * (0.4 + presion * 1.2));
}

function dibujarTrazo(ctx, trazo) {
  const puntos = trazo.puntos;
  if (!puntos || puntos.length === 0) return;

  ctx.save();
  ctx.globalAlpha = trazo.herramienta === "marcador" ? 0.35 : 1;
  ctx.strokeStyle = trazo.color;
  ctx.fillStyle = trazo.color;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  if (puntos.length === 1) {
    const p = puntos[0];
    ctx.beginPath();
    ctx.arc(p.x, p.y, anchoParaPresion(p.p, trazo.grosor) / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  for (let i = 1; i < puntos.length; i++) {
    const p0 = puntos[i - 1];
    const p1 = puntos[i];
    const medioX = (p0.x + p1.x) / 2;
    const medioY = (p0.y + p1.y) / 2;
    ctx.lineWidth = anchoParaPresion(p1.p, trazo.grosor);
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.quadraticCurveTo(p0.x, p0.y, medioX, medioY);
    ctx.stroke();
  }
  ctx.restore();
}

class LienzoTinta {
  // opciones: { onTrazoNuevo(trazo), onTrazoBorrado(idLocal) }
  constructor(canvasEl, opciones) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext("2d");
    this.onTrazoNuevo = opciones.onTrazoNuevo || (() => {});
    this.onTrazoBorrado = opciones.onTrazoBorrado || (() => {});

    this.trazos = []; // { id, herramienta, color, grosor, puntos, z }
    this.herramienta = "boli"; // "boli" | "marcador" | "goma"
    this.color = "#1f2937";
    this.grosor = 3;

    this.anchoContenido = 820;
    this.altoContenido = 1100;

    this._trazoActivo = null;
    this._punteroActivoId = null;
    this._punteroActivoTipo = null;

    this._bind();
  }

  _bind() {
    this.canvas.addEventListener("pointerdown", (e) => this._onPointerDown(e));
    this.canvas.addEventListener("pointermove", (e) => this._onPointerMove(e));
    window.addEventListener("pointerup", (e) => this._onPointerUp(e));
    window.addEventListener("pointercancel", (e) => this._onPointerUp(e));
  }

  fijarHerramienta(herramienta) {
    this.herramienta = herramienta;
  }

  fijarColor(color) {
    this.color = color;
  }

  fijarGrosor(grosor) {
    this.grosor = grosor;
  }

  // Ajusta el tamaño lógico del lienzo (crece cuando el contenido lo
  // necesita) y lo redibuja a la resolución real de la pantalla.
  redimensionar(anchoContenido, altoContenido) {
    this.anchoContenido = anchoContenido;
    this.altoContenido = altoContenido;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(anchoContenido * dpr);
    this.canvas.height = Math.round(altoContenido * dpr);
    this.canvas.style.width = anchoContenido + "px";
    this.canvas.style.height = altoContenido + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.redibujar();
  }

  cargarTrazos(trazos) {
    this.trazos = trazos.slice().sort((a, b) => (a.z || 0) - (b.z || 0));
    this.redibujar();
  }

  redibujar() {
    this.ctx.clearRect(0, 0, this.anchoContenido, this.altoContenido);
    for (const trazo of this.trazos) dibujarTrazo(this.ctx, trazo);
    if (this._trazoActivo) dibujarTrazo(this.ctx, this._trazoActivo);
  }

  _coordsContenido(e) {
    const rect = this.canvas.getBoundingClientRect();
    const escala = rect.width / this.anchoContenido || 1;
    return {
      x: (e.clientX - rect.left) / escala,
      y: (e.clientY - rect.top) / escala,
      p: e.pressure,
    };
  }

  _onPointerDown(e) {
    if (this.herramienta === "seleccionar") return; // deja pasar el toque (scroll, arrastrar elementos…)

    // Rechazo de palma básico: si ya hay un trazo de lápiz en curso,
    // ignora un dedo que empieza a la vez.
    if (this._trazoActivo && this._punteroActivoTipo === "pen" && e.pointerType === "touch") {
      return;
    }
    if (this._trazoActivo) return; // ya hay un trazo en curso con otro puntero

    this.canvas.setPointerCapture(e.pointerId);
    this._punteroActivoId = e.pointerId;
    this._punteroActivoTipo = e.pointerType;

    const punto = this._coordsContenido(e);

    if (this.herramienta === "goma") {
      this._borrarEn(punto);
      this._borrando = true;
      return;
    }

    this._trazoActivo = {
      id: null,
      herramienta: this.herramienta,
      color: this.color,
      grosor: this.grosor,
      puntos: [punto],
      z: Date.now(),
    };
    this.redibujar();
  }

  _onPointerMove(e) {
    if (e.pointerId !== this._punteroActivoId) return;
    const punto = this._coordsContenido(e);

    if (this._borrando) {
      this._borrarEn(punto);
      return;
    }

    if (!this._trazoActivo) return;
    const puntos = this._trazoActivo.puntos;
    const ultimo = puntos[puntos.length - 1];
    if (distancia(ultimo, punto) < DISTANCIA_MIN_PUNTO) return;
    puntos.push(punto);
    this.redibujar();
  }

  _onPointerUp(e) {
    if (e.pointerId !== this._punteroActivoId) return;
    this._punteroActivoId = null;
    this._punteroActivoTipo = null;
    this._borrando = false;

    if (this._trazoActivo) {
      const trazo = this._trazoActivo;
      this._trazoActivo = null;
      if (trazo.puntos.length > 0) {
        this.trazos.push(trazo);
        this.onTrazoNuevo(trazo);
      }
      this.redibujar();
    }
  }

  _borrarEn(punto) {
    const restantes = [];
    for (const trazo of this.trazos) {
      const tocado = trazo.puntos.some((p) => distancia(p, punto) < RADIO_GOMA);
      if (tocado) this.onTrazoBorrado(trazo);
      else restantes.push(trazo);
    }
    if (restantes.length !== this.trazos.length) {
      this.trazos = restantes;
      this.redibujar();
    }
  }

  // Quita un trazo por id local sin pasar por la goma (por ejemplo,
  // cuando llega un cambio remoto de otro dispositivo).
  quitarTrazoPorId(id) {
    this.trazos = this.trazos.filter((t) => t.id !== id);
    this.redibujar();
  }

  tieneTrazo(id) {
    return this.trazos.some((t) => t.id === id);
  }

  // Añade un trazo que ha llegado de Firestore (propio, ya reconciliado
  // por id, o de otro dispositivo) sin volver a dispararlo como nuevo.
  agregarTrazoRemoto(trazo) {
    if (this.tieneTrazo(trazo.id)) return;
    this.trazos.push(trazo);
    this.redibujar();
  }
}

export { LienzoTinta };
