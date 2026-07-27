// ============================================================
// Economía Familiar 2.0 — la ruleta de la vida.
// Componente de canvas sin librerías: una ruleta de 8 casillas
// (oportunidades en verde, imprevistos en rojo) que se lanza con
// una barra de fuerza: el alumnado la desplaza y, al soltarla,
// la ruleta da más o menos vueltas. La frenada es larga y lenta
// (easing de cuarta potencia) para que el final mantenga la
// incertidumbre hasta la última casilla.
// ============================================================

const COLOR_POSITIVO = ["#3fae5c", "#57c273"];
const COLOR_NEGATIVO = ["#d64545", "#e06a5a"];
const COLOR_NEUTRO = "#9a958c";

export function crearRuleta(opciones) {
  const { contenedor, casillas, alParar } = opciones;
  const n = casillas.length;
  const seg = (Math.PI * 2) / n;

  contenedor.innerHTML =
    '<div class="ruleta-envoltura">' +
    '<div class="ruleta-aguja">▼</div>' +
    '<canvas class="ruleta-canvas"></canvas>' +
    "</div>" +
    '<div class="ruleta-fuerza">' +
    '<label>💪 Cargad la fuerza arrastrando la barra… ¡y soltad!</label>' +
    '<input type="range" class="ruleta-barra" min="5" max="100" value="5">' +
    '<div class="ruleta-fuerza-texto">Fuerza: <strong>—</strong></div>' +
    "</div>";

  const canvas = contenedor.querySelector(".ruleta-canvas");
  const barra = contenedor.querySelector(".ruleta-barra");
  const textoFuerza = contenedor.querySelector(".ruleta-fuerza-texto strong");

  let rot = Math.random() * Math.PI * 2; // posición inicial aleatoria
  let girando = false;
  let indiceActual = -1;

  function dibujar(resaltado) {
    const dpr = window.devicePixelRatio || 1;
    const lado = Math.min(contenedor.clientWidth || 340, 360);
    canvas.style.width = lado + "px";
    canvas.style.height = lado + "px";
    canvas.width = lado * dpr;
    canvas.height = lado * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = lado / 2, cy = lado / 2, r = lado / 2 - 6;

    ctx.clearRect(0, 0, lado, lado);
    for (let i = 0; i < n; i++) {
      const a0 = rot + i * seg;
      const c = casillas[i];
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, a0, a0 + seg);
      ctx.closePath();
      const paleta = c.importe > 0 ? COLOR_POSITIVO : c.importe < 0 ? COLOR_NEGATIVO : [COLOR_NEUTRO, COLOR_NEUTRO];
      ctx.fillStyle = paleta[i % 2];
      if (i === resaltado) ctx.fillStyle = c.importe > 0 ? "#2c8546" : c.importe < 0 ? "#b12f2f" : "#7a756c";
      ctx.fill();
      ctx.strokeStyle = "#faf6ee";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Texto de la casilla: emoji y euros, orientados hacia fuera.
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a0 + seg / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold " + Math.max(13, lado / 24) + "px system-ui, sans-serif";
      const etiqueta = c.importe === 0 ? "0 €" : (c.importe > 0 ? "+" : "−") + Math.abs(c.importe) + " €";
      ctx.fillText(etiqueta, r - 12, 5);
      ctx.font = Math.max(16, lado / 17) + "px system-ui, sans-serif";
      ctx.fillText(c.emoji, r - 12 - ctx.measureText(etiqueta).width - 30, 7);
      ctx.restore();
    }
    // Eje central.
    ctx.beginPath();
    ctx.arc(cx, cy, lado / 14, 0, Math.PI * 2);
    ctx.fillStyle = "#33302a";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = Math.max(14, lado / 18) + "px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎲", cx, cy + 6);
  }

  // Casilla que hay bajo la aguja (arriba, -90º) para una rotación dada.
  function indiceBajoAguja(rotacion) {
    const p = (-Math.PI / 2 - rotacion) % (Math.PI * 2);
    const ajustado = (p + Math.PI * 2) % (Math.PI * 2);
    return Math.floor(ajustado / seg) % n;
  }

  function girar(fuerza) {
    if (girando) return;
    girando = true;
    barra.disabled = true;

    // De 3 vueltas (flojito) a 10 (a tope), más un desvío aleatorio:
    // ni la misma fuerza da dos veces el mismo resultado.
    const vueltas = 3 + (fuerza / 100) * 7 + Math.random();
    const destino = rot + vueltas * Math.PI * 2 + Math.random() * Math.PI * 2;
    const duracion = 3600 + fuerza * 24; // 3,6 s – 6 s: frenada larga
    const origen = rot;
    const inicio = performance.now();

    function fotograma(ahora) {
      const t = Math.min(1, (ahora - inicio) / duracion);
      // easeOutQuart: sale disparada y muere despacísimo → nervios.
      const e = 1 - Math.pow(1 - t, 4);
      rot = origen + (destino - origen) * e;
      const idx = indiceBajoAguja(rot);
      if (idx !== indiceActual) {
        indiceActual = idx;
        if (navigator.vibrate) navigator.vibrate(8); // tic-tic en móviles/tablets
      }
      dibujar(t > 0.55 ? idx : -1); // en la recta final se resalta la casilla
      if (t < 1) {
        requestAnimationFrame(fotograma);
      } else {
        girando = false;
        const final = indiceBajoAguja(rot);
        dibujar(final);
        setTimeout(() => alParar(casillas[final], final), 350);
      }
    }
    requestAnimationFrame(fotograma);
  }

  barra.addEventListener("input", () => {
    textoFuerza.textContent = barra.value + "%";
  });
  // Al soltar la barra (change se dispara al levantar el dedo/ratón).
  barra.addEventListener("change", () => {
    const fuerza = Number(barra.value);
    if (fuerza > 4) girar(fuerza);
  });

  dibujar(-1);
  window.addEventListener("resize", () => { if (!girando) dibujar(-1); });

  return {
    reiniciarBarra() {
      barra.disabled = false;
      barra.value = 5;
      textoFuerza.textContent = "—";
    },
  };
}

// ---------- el dado ----------
// Animación simple: el dado "rueda" cambiando de cara y se detiene
// en el resultado. Devuelve una promesa con el número (1-6).
export function tirarDado(elemento) {
  const CARAS = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  return new Promise((resolve) => {
    const resultado = 1 + Math.floor(Math.random() * 6);
    let pasos = 14 + Math.floor(Math.random() * 6);
    elemento.classList.add("dado-girando");
    const intervalo = setInterval(() => {
      pasos--;
      elemento.textContent = CARAS[Math.floor(Math.random() * 6)];
      if (pasos <= 0) {
        clearInterval(intervalo);
        elemento.textContent = CARAS[resultado - 1];
        elemento.classList.remove("dado-girando");
        setTimeout(() => resolve(resultado), 500);
      }
    }, 90);
  });
}
