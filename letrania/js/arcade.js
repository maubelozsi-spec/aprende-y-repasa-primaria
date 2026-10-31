// ============================================================
// Letrania · juegos de recompensa (uno por región).
//
// Después de cobrar el premio de la prueba del día, el héroe puede
// jugar UNA partida de 30 segundos que da de 1 a 5 XP (nunca gemas: las
// gemas solo salen de Lengua). Puede repetir sin premio para batir su
// récord. Cada región tiene su juego:
//   1 Carrera del muelle   (saltar y agacharse)
//   2 Descenso de la cumbre (esquivar a izquierda y derecha)
//   3 Cruce de la ciénaga  (casillas, tipo Frogger)
//   4 Laberinto del bosque (tipo Pac-Man)
//   5 Vuelo sobre el desierto (subir y bajar entre columnas)
//   6 Lluvia de gemas      (atrapar con el cofre)
//
// Solo flechas (teclado) o los botones de flechas en pantalla (tablet).
// Chocar no acaba la partida: resta puntos y da un segundo de respiro.
// La dificultad sube cada pocos segundos.
//
// Modo muy tranquilo (Senda del Unicornio): mitad de velocidad, sin
// dificultad creciente, sin restar puntos, sin enemigos en el laberinto
// ni borrones en la lluvia, objetos más grandes y sin cuenta atrás.
//
// Todo se dibuja en un <canvas> con las mismas ilustraciones del juego
// (fondo de la región, retrato del héroe, guardián): sin librerías ni
// imágenes nuevas.
// ============================================================
(function () {
  "use strict";

  const L = window.Letrania;
  const W = 960;
  const H = 540;
  const DURACION = 30;

  const JUEGOS = {
    1: { nombre: "Carrera del muelle", ayuda: "↑ salta las cajas · ↓ agáchate bajo la tinta del Pulpo", objetivo: 200 },
    2: { nombre: "Descenso de la cumbre", ayuda: "← → esquiva rocas y pinos · recoge las tildes doradas", objetivo: 200 },
    3: { nombre: "Cruce de la ciénaga", ayuda: "Flechas para saltar de casilla en casilla · llega arriba sin tocar a los sapos", objetivo: 150 },
    4: { nombre: "Laberinto del bosque", ayuda: "Flechas para moverte · recoge las hojas sin que te pillen", objetivo: 250 },
    5: { nombre: "Vuelo sobre el desierto", ayuda: "↑ ↓ vuela entre las columnas · recoge las gemas", objetivo: 220 },
    6: { nombre: "Lluvia de gemas", ayuda: "← → mueve el cofre · atrapa gemas y esquiva los borrones", objetivo: 250 },
  };

  // De 1 a 5 XP según los puntos (en modo tranquilo el objetivo es la mitad).
  function xpDe(region, puntos, tranquilo) {
    const obj = JUEGOS[region].objetivo * (tranquilo ? 0.5 : 1);
    return Math.max(1, Math.min(5, 1 + Math.floor((4 * puntos) / obj)));
  }

  const azar = (a, b) => a + Math.random() * (b - a);
  const choca = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  const tactil = () => (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) || "ontouchstart" in window;

  function cargarImg(src) {
    const img = new Image();
    img.src = src;
    return img;
  }
  const lista = (img) => img && img.complete && img.naturalWidth > 0;

  function jugar(op) {
    const region = op.region;
    const J = JUEGOS[region];
    const tranquilo = !!op.tranquilo;
    const efectos = !!op.efectos;
    const esc = L.esc;

    op.raiz.innerHTML = `<div class="parch arcade ${op.uni ? "uni" : ""}">
      <div class="arcade-cab"><div><span class="eyebrow">Juego de recompensa · región ${region}</span><h2>${esc(J.nombre)}</h2></div>
        <div class="arcade-marcador"><span>Puntos <b id="arcPuntos">0</b></span>${tranquilo ? "" : '<span>Tiempo <b id="arcTiempo">30</b></span>'}</div></div>
      <canvas id="arcLienzo" width="${W}" height="${H}" role="img" aria-label="${esc(J.nombre + ". " + J.ayuda)}"></canvas>
      <div class="arcade-flechas" ${tactil() ? "" : "hidden"}>
        <button type="button" data-k="left" aria-label="Izquierda">◀</button><button type="button" data-k="up" aria-label="Arriba">▲</button><button type="button" data-k="down" aria-label="Abajo">▼</button><button type="button" data-k="right" aria-label="Derecha">▶</button>
      </div>
      <p class="nota" style="margin:8px 0 0">${esc(J.ayuda)}</p></div>`;
    const cv = op.raiz.querySelector("#arcLienzo");
    const cx = cv.getContext("2d");
    const elPuntos = op.raiz.querySelector("#arcPuntos");
    const elTiempo = op.raiz.querySelector("#arcTiempo");

    const img = {
      fondo: cargarImg(L.srcImg("fondo-" + region)),
      heroe: cargarImg(op.heroeSrc),
      guardian: cargarImg(L.srcImg("guardian-" + region)),
      cofre: cargarImg(L.srcImg("cofre")),
    };

    // ---------- Entrada: flechas del teclado o botones en pantalla ----------
    const teclas = { left: false, right: false, up: false, down: false };
    const pulsadas = [];
    const NOMBRE = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
    function pulsar(k) {
      if (!teclas[k]) pulsadas.push(k);
      teclas[k] = true;
      if (estado === "espera" || estado === "pausa") arrancar();
    }
    function soltar(k) {
      teclas[k] = false;
    }
    function onKeyDown(e) {
      const k = NOMBRE[e.key];
      if (!k) return;
      e.preventDefault();
      if (!e.repeat) pulsar(k);
    }
    function onKeyUp(e) {
      const k = NOMBRE[e.key];
      if (k) soltar(k);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    op.raiz.querySelectorAll(".arcade-flechas button").forEach((b) => {
      b.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        pulsar(b.dataset.k);
      });
      ["pointerup", "pointerleave", "pointercancel"].forEach((t) => b.addEventListener(t, () => soltar(b.dataset.k)));
    });
    function onVisible() {
      if (document.hidden && estado === "juego") estado = "pausa";
    }
    document.addEventListener("visibilitychange", onVisible);

    // ---------- Estado común ----------
    let estado = "espera"; // espera · juego · pausa · fin
    let t = 0; // segundos jugados
    let puntos = 0;
    let respiro = 0; // segundos sin poder recibir otro golpe
    let ultimo = 0;
    let raf = 0;
    const brillos = [];

    // Velocidad: en tranquilo, siempre la mitad; si no, sube hasta casi el doble.
    const f = () => (tranquilo ? 0.5 : 1 + Math.floor(t / 5) * 0.16);
    function sumar(n, x, y) {
      puntos = Math.max(0, puntos + n);
      elPuntos.textContent = puntos;
      if (efectos && n > 0 && x !== undefined) brillos.push({ x: x, y: y, v: 0.6, txt: "+" + n });
    }
    function golpe(pen) {
      if (respiro > 0) return false;
      respiro = 1;
      if (!tranquilo) sumar(-pen);
      return true;
    }

    const juego = CREAR[region]({ cx, img, teclas, pulsadas, f, sumar, golpe, tranquilo, azar, choca, efectos, H, W });

    // ---------- Dibujo común ----------
    function fondo(oscuro) {
      cx.fillStyle = "#20254a";
      cx.fillRect(0, 0, W, H);
      if (lista(img.fondo)) {
        const r = Math.max(W / img.fondo.naturalWidth, H / img.fondo.naturalHeight);
        const w = img.fondo.naturalWidth * r;
        const h = img.fondo.naturalHeight * r;
        cx.drawImage(img.fondo, (W - w) / 2, (H - h) / 2, w, h);
      }
      cx.fillStyle = "rgba(21,24,51," + (oscuro === undefined ? 0.25 : oscuro) + ")";
      cx.fillRect(0, 0, W, H);
    }
    function aviso(lineas) {
      cx.fillStyle = "rgba(21,24,51,.72)";
      cx.fillRect(0, 0, W, H);
      cx.textAlign = "center";
      cx.fillStyle = "#f8d98c";
      cx.font = "bold 44px Andika, sans-serif";
      cx.fillText(lineas[0], W / 2, H / 2 - 20);
      cx.fillStyle = "#fff6dd";
      cx.font = "26px Andika, sans-serif";
      lineas.slice(1).forEach((l, i) => cx.fillText(l, W / 2, H / 2 + 30 + i * 36));
      cx.textAlign = "start";
    }
    function dibujar() {
      fondo(juego.oscuro);
      juego.dibujar(respiro);
      brillos.forEach((b) => {
        cx.globalAlpha = Math.max(0, b.v / 0.6);
        cx.fillStyle = "#f8d98c";
        cx.font = "bold 26px Andika, sans-serif";
        cx.fillText(b.txt, b.x, b.y - (0.6 - b.v) * 60);
        cx.globalAlpha = 1;
      });
      if (!tranquilo && estado === "juego") {
        cx.fillStyle = "rgba(0,0,0,.35)";
        cx.fillRect(0, H - 8, W, 8);
        cx.fillStyle = "#e9b04a";
        cx.fillRect(0, H - 8, W * Math.max(0, 1 - t / DURACION), 8);
      }
      if (estado === "espera") aviso([op.uni ? "PULSA UNA FLECHA" : "Pulsa una flecha para empezar", J.ayuda]);
      if (estado === "pausa") aviso(["Pausa", "Pulsa una flecha para seguir"]);
    }

    function bucle(ahora) {
      const dt = Math.min(0.05, (ahora - ultimo) / 1000 || 0);
      ultimo = ahora;
      if (estado === "juego") {
        t += dt;
        respiro = Math.max(0, respiro - dt);
        juego.mover(dt);
        pulsadas.length = 0;
        for (let i = brillos.length - 1; i >= 0; i--) if ((brillos[i].v -= dt) <= 0) brillos.splice(i, 1);
        if (elTiempo) elTiempo.textContent = Math.max(0, Math.ceil(DURACION - t));
        if (t >= DURACION) return acabar();
      }
      dibujar();
      raf = requestAnimationFrame(bucle);
    }
    function arrancar() {
      estado = "juego";
      pulsadas.length = 0;
    }
    function limpiar() {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("visibilitychange", onVisible);
    }
    function acabar() {
      estado = "fin";
      limpiar();
      dibujar();
      aviso([op.uni ? "¡MUY BIEN!" : "¡Tiempo!", puntos + " puntos"]);
      op.alTerminar(puntos);
    }

    if (op.uni && op.hablar) op.hablar(J.nombre + ". " + J.ayuda.replace(/[←→↑↓·]/g, " "));
    raf = requestAnimationFrame((a) => {
      ultimo = a;
      bucle(a);
    });
    return { parar: limpiar };
  }

  // ---------- Ayudas de dibujo ----------

  function heroe(g, x, y, alto, respiro, agachado) {
    const { cx, img, efectos } = g;
    if (respiro > 0) {
      if (efectos && Math.floor(respiro * 10) % 2 === 0) return;
      if (!efectos) cx.globalAlpha = 0.5;
    }
    if (lista(img.heroe)) {
      const w = (img.heroe.naturalWidth / img.heroe.naturalHeight) * alto;
      const h = agachado ? alto * 0.55 : alto;
      cx.drawImage(img.heroe, x - w / 2, y - h, w, h);
    } else {
      cx.fillStyle = "#c0582f";
      cx.fillRect(x - 20, y - (agachado ? alto * 0.55 : alto), 40, agachado ? alto * 0.55 : alto);
    }
    cx.globalAlpha = 1;
  }
  function figura(g, im, x, y, alto, colorSiNo) {
    const { cx } = g;
    if (lista(im)) {
      const w = (im.naturalWidth / im.naturalHeight) * alto;
      cx.drawImage(im, x - w / 2, y - alto / 2, w, alto);
    } else {
      cx.fillStyle = colorSiNo || "#4a5aa8";
      cx.beginPath();
      cx.arc(x, y, alto / 2, 0, Math.PI * 2);
      cx.fill();
    }
  }
  function gema(cx, x, y, r) {
    cx.save();
    cx.translate(x, y);
    cx.scale(r / 8, r / 8);
    cx.beginPath();
    cx.moveTo(-4, -6);
    cx.lineTo(4, -6);
    cx.lineTo(7, -2);
    cx.lineTo(0, 7);
    cx.lineTo(-7, -2);
    cx.closePath();
    cx.fillStyle = "#5fd3c4";
    cx.fill();
    cx.strokeStyle = "#bff0e8";
    cx.lineWidth = 1;
    cx.stroke();
    cx.restore();
  }
  function moneda(cx, x, y, r, letra) {
    cx.beginPath();
    cx.arc(x, y, r, 0, Math.PI * 2);
    cx.fillStyle = "#e9b04a";
    cx.fill();
    cx.lineWidth = 3;
    cx.strokeStyle = "#fff3c4";
    cx.stroke();
    cx.fillStyle = "#5a3a1e";
    cx.font = "bold " + Math.round(r * 1.2) + "px Andika, sans-serif";
    cx.textAlign = "center";
    cx.fillText(letra, x, y + r * 0.42);
    cx.textAlign = "start";
  }
  function borron(cx, x, y, r) {
    cx.fillStyle = "#1b1530";
    cx.beginPath();
    cx.arc(x, y, r, 0, Math.PI * 2);
    cx.arc(x + r * 0.7, y + r * 0.4, r * 0.45, 0, Math.PI * 2);
    cx.arc(x - r * 0.6, y + r * 0.5, r * 0.35, 0, Math.PI * 2);
    cx.fill();
  }
  const LETRAS = "ÁÉÍÓÚÑBVHGJLLRZ";
  const letra = () => LETRAS.charAt(Math.floor(Math.random() * LETRAS.length));

  // ---------- Los seis juegos ----------
  const CREAR = {};

  // 1 · Carrera del muelle: correr, saltar cajas (↑) y agacharse (↓)
  // bajo los chorros de tinta del Pulpo Sinpunto.
  CREAR[1] = function (g) {
    const { cx, W } = g;
    const SUELO = 470;
    const X = 150;
    let y = SUELO;
    let vy = 0;
    let agachadoAhora = false;
    let siguiente = 1;
    let monedaT = 0.6;
    const obs = [];
    const mon = [];
    let rayas = 0;
    return {
      mover(dt) {
        const v = 380 * g.f();
        if (g.pulsadas.indexOf("up") !== -1 && y >= SUELO) vy = -900;
        vy += 2200 * dt;
        y = Math.min(SUELO, y + vy * dt);
        if (y >= SUELO) vy = 0;
        rayas = (rayas + v * dt) % 60;
        if ((siguiente -= dt) <= 0) {
          const alta = !g.tranquilo && Math.random() < 0.35;
          obs.push(alta ? { x: W + 20, y: SUELO - 100, w: 60, h: 34, alta: true } : { x: W + 20, y: SUELO - 52, w: 52, h: 52 });
          siguiente = g.azar(0.95, 1.6) / g.f();
        }
        if ((monedaT -= dt) <= 0) {
          const r = g.tranquilo ? 30 : 22;
          mon.push({ x: W + 20, y: Math.random() < 0.5 ? SUELO - 190 : SUELO - 45, r: r, l: letra() });
          monedaT = g.azar(0.7, 1.3) / g.f();
        }
        const agachado = g.teclas.down && y >= SUELO;
        const cuerpo = agachado ? { x: X - 25, y: SUELO - 50, w: 50, h: 50 } : { x: X - 20, y: y - 88, w: 40, h: 84 };
        for (let i = obs.length - 1; i >= 0; i--) {
          const o = obs[i];
          o.x -= v * dt;
          if (!o.tocado && choca(cuerpo, o)) {
            o.tocado = true;
            g.golpe(15);
          }
          if (!o.pasado && o.x + o.w < X - 20) {
            o.pasado = true;
            if (!o.tocado) g.sumar(5);
          }
          if (o.x < -80) obs.splice(i, 1);
        }
        for (let i = mon.length - 1; i >= 0; i--) {
          const m = mon[i];
          m.x -= v * dt;
          if (choca(cuerpo, { x: m.x - m.r, y: m.y - m.r, w: m.r * 2, h: m.r * 2 })) {
            g.sumar(10, m.x, m.y);
            mon.splice(i, 1);
          } else if (m.x < -40) mon.splice(i, 1);
        }
        agachadoAhora = agachado;
      },
      dibujar(respiro) {
        cx.fillStyle = "#5a3a1e";
        cx.fillRect(0, SUELO, W, 70);
        cx.fillStyle = "#7a5230";
        for (let x = -rayas; x < W; x += 60) cx.fillRect(x, SUELO + 6, 40, 6);
        figura(g, g.img.guardian, W - 90, 120, 130, "#8a4a8f");
        obs.forEach((o) => {
          if (o.alta) {
            borron(cx, o.x + 30, o.y + 17, 20);
          } else {
            cx.fillStyle = "#a0703f";
            cx.fillRect(o.x, o.y, o.w, o.h);
            cx.strokeStyle = "#5a3a1e";
            cx.lineWidth = 4;
            cx.strokeRect(o.x + 2, o.y + 2, o.w - 4, o.h - 4);
            cx.beginPath();
            cx.moveTo(o.x + 4, o.y + 4);
            cx.lineTo(o.x + o.w - 4, o.y + o.h - 4);
            cx.stroke();
          }
        });
        mon.forEach((m) => moneda(cx, m.x, m.y, m.r, m.l));
        heroe(g, X, y, 100, respiro, agachadoAhora);
      },
    };
  };

  // 2 · Descenso de la cumbre: bajar esquivando rocas y pinos (← →) y
  // recogiendo tildes doradas.
  CREAR[2] = function (g) {
    const { cx, W, H } = g;
    const Y = 440;
    let x = W / 2;
    let siguiente = 0.5;
    const cosas = [];
    const copos = Array.from({ length: 40 }, () => ({ x: Math.random() * W, y: Math.random() * H, v: g.azar(30, 80) }));
    return {
      oscuro: 0.1,
      mover(dt) {
        const vel = g.tranquilo ? 360 : 520;
        if (g.teclas.left) x -= vel * dt;
        if (g.teclas.right) x += vel * dt;
        x = Math.max(40, Math.min(W - 40, x));
        const v = 300 * g.f();
        if ((siguiente -= dt) <= 0) {
          const tipo = Math.random() < (g.tranquilo ? 0.55 : 0.35) ? "tilde" : Math.random() < 0.5 ? "roca" : "pino";
          cosas.push({ tipo: tipo, x: g.azar(40, W - 40), y: -40, r: tipo === "tilde" ? (g.tranquilo ? 30 : 22) : 28 });
          siguiente = g.azar(0.35, 0.7) / g.f();
        }
        const yo = { x: x - 22, y: Y - 70, w: 44, h: 64 };
        for (let i = cosas.length - 1; i >= 0; i--) {
          const c = cosas[i];
          c.y += v * dt;
          if (choca(yo, { x: c.x - c.r, y: c.y - c.r, w: c.r * 2, h: c.r * 2 })) {
            if (c.tipo === "tilde") g.sumar(10, c.x, c.y);
            else g.golpe(15);
            cosas.splice(i, 1);
          } else if (c.y > H + 40) {
            if (c.tipo !== "tilde") g.sumar(2);
            cosas.splice(i, 1);
          }
        }
        copos.forEach((c) => {
          c.y += c.v * dt;
          if (c.y > H) c.y = -5;
        });
      },
      dibujar(respiro) {
        cx.fillStyle = "rgba(240,248,255,.45)";
        cx.fillRect(0, 0, W, H);
        cx.fillStyle = "#fff";
        copos.forEach((c) => cx.fillRect(c.x, c.y, 3, 3));
        cosas.forEach((c) => {
          if (c.tipo === "tilde") {
            moneda(cx, c.x, c.y, c.r, "´");
          } else if (c.tipo === "roca") {
            cx.fillStyle = "#7d8597";
            cx.beginPath();
            cx.ellipse(c.x, c.y, c.r + 6, c.r, 0, 0, Math.PI * 2);
            cx.fill();
            cx.fillStyle = "#a8b0c0";
            cx.beginPath();
            cx.ellipse(c.x - 8, c.y - 8, 10, 6, 0, 0, Math.PI * 2);
            cx.fill();
          } else {
            cx.fillStyle = "#2f6b3e";
            cx.beginPath();
            cx.moveTo(c.x, c.y - c.r - 10);
            cx.lineTo(c.x + c.r, c.y + c.r);
            cx.lineTo(c.x - c.r, c.y + c.r);
            cx.closePath();
            cx.fill();
            cx.fillStyle = "#fff";
            cx.fillRect(c.x - 10, c.y - c.r + 2, 20, 6);
          }
        });
        cx.fillStyle = "#c0582f";
        cx.fillRect(x - 32, Y - 6, 64, 10);
        heroe(g, x, Y, 80, respiro);
      },
    };
  };

  // 3 · Cruce de la ciénaga: de casilla en casilla (tipo Frogger) hasta
  // la orilla de arriba sin tocar a los sapos del Sapo Trastrueque.
  CREAR[3] = function (g) {
    const { cx, W } = g;
    const C = 80;
    const COLS = 12;
    const FILAS = 6;
    const ARRIBA = 30;
    const carriles = [];
    for (let fila = 1; fila <= 4; fila++) {
      const dir = fila % 2 ? 1 : -1;
      const n = g.tranquilo ? 2 : 3;
      const sapos = [];
      for (let k = 0; k < n; k++) sapos.push({ x: (k * W) / n + g.azar(0, 120) });
      carriles.push({ fila: fila, dir: dir, base: 70 + fila * 22, sapos: sapos });
    }
    let col = 6;
    let fila = FILAS - 1;
    let monedas = [];
    function nuevasMonedas() {
      monedas = [1, 2, 3, 4].map((fi) => ({ col: Math.floor(Math.random() * COLS), fila: fi, l: letra() }));
    }
    nuevasMonedas();
    function volver() {
      col = 6;
      fila = FILAS - 1;
    }
    return {
      oscuro: 0.15,
      mover(dt) {
        g.pulsadas.forEach((k) => {
          if (k === "up") fila = Math.max(0, fila - 1);
          if (k === "down") fila = Math.min(FILAS - 1, fila + 1);
          if (k === "left") col = Math.max(0, col - 1);
          if (k === "right") col = Math.min(COLS - 1, col + 1);
        });
        carriles.forEach((c) => {
          c.sapos.forEach((s) => {
            s.x += c.dir * c.base * g.f() * dt;
            if (s.x > W + 60) s.x = -60;
            if (s.x < -60) s.x = W + 60;
          });
        });
        const yo = { x: col * C + 14, y: ARRIBA + fila * C + 14, w: C - 28, h: C - 28 };
        carriles.forEach((c) => {
          if (c.fila !== fila) return;
          c.sapos.forEach((s) => {
            if (choca(yo, { x: s.x - 30, y: ARRIBA + c.fila * C + 10, w: 60, h: C - 20 }) && g.golpe(10) && !g.tranquilo) volver();
          });
        });
        monedas = monedas.filter((m) => {
          if (m.col === col && m.fila === fila) {
            g.sumar(10, col * C + C / 2, ARRIBA + fila * C);
            return false;
          }
          return true;
        });
        if (fila === 0) {
          g.sumar(30, col * C + C / 2, ARRIBA + 20);
          volver();
          nuevasMonedas();
        }
      },
      dibujar(respiro) {
        for (let fi = 0; fi < FILAS; fi++) {
          const y = ARRIBA + fi * C;
          cx.fillStyle = fi === 0 || fi === FILAS - 1 ? "rgba(255,246,221,.55)" : fi % 2 ? "rgba(232,150,170,.35)" : "rgba(210,120,150,.35)";
          cx.fillRect(0, y, W, C);
        }
        cx.strokeStyle = "rgba(255,255,255,.25)";
        cx.lineWidth = 1;
        for (let k = 1; k < COLS; k++) {
          cx.beginPath();
          cx.moveTo(k * C, ARRIBA);
          cx.lineTo(k * C, ARRIBA + FILAS * C);
          cx.stroke();
        }
        cx.fillStyle = "#2b1d12";
        cx.font = "bold 22px Andika, sans-serif";
        cx.fillText("Orilla", 12, ARRIBA + 48);
        monedas.forEach((m) => moneda(cx, m.col * C + C / 2, ARRIBA + m.fila * C + C / 2, g.tranquilo ? 26 : 20, m.l));
        carriles.forEach((c) => c.sapos.forEach((s) => figura(g, g.img.guardian, s.x, ARRIBA + c.fila * C + C / 2, 64, "#5f8f3e")));
        heroe(g, col * C + C / 2, ARRIBA + fila * C + C - 4, 72, respiro);
      },
    };
  };

  // 4 · Laberinto del bosque (tipo Pac-Man): recoger las hojas sin que
  // te pillen los guardianes del Árbol Olvidadizo.
  CREAR[4] = function (g) {
    const { cx } = g;
    const MAPA = [
      "###############",
      "#......#......#",
      "#.##.#.#.#.##.#",
      "#.#..#...#..#.#",
      "#...###.###...#",
      "#.#..#...#..#.#",
      "#.##.#.#.#.##.#",
      "#......#......#",
      "###############",
    ];
    const C = 60;
    const OX = 30;
    const libre = (c, f) => MAPA[f] && MAPA[f][c] && MAPA[f][c] !== "#";
    const DIR = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };
    let hojas = [];
    function llenar() {
      hojas = [];
      MAPA.forEach((fila, f) => fila.split("").forEach((ch, c) => ch === "." && hojas.push({ c: c, f: f })));
    }
    llenar();
    // Posiciones en casillas (con decimales mientras se mueve).
    const yo = { c: 1, f: 1, dir: null, quiere: null };
    const enemigos = g.tranquilo ? [] : [{ c: 7, f: 4, dir: "up" }, { c: 7, f: 5, dir: "down" }];
    let tercero = false;
    function avanzar(p, vel, dt, elegir) {
      let paso = vel * dt;
      while (paso > 0) {
        const enCentro = Math.abs(p.c - Math.round(p.c)) < 1e-6 && Math.abs(p.f - Math.round(p.f)) < 1e-6;
        if (enCentro) {
          p.c = Math.round(p.c);
          p.f = Math.round(p.f);
          if (elegir) elegir(p);
          if (!p.dir || !libre(p.c + DIR[p.dir][0], p.f + DIR[p.dir][1])) {
            p.dir = null;
            return;
          }
        }
        const d = DIR[p.dir];
        const resto = d[0] ? (d[0] > 0 ? Math.ceil(p.c + 1e-6) - p.c : p.c - Math.floor(p.c - 1e-6)) : d[1] > 0 ? Math.ceil(p.f + 1e-6) - p.f : p.f - Math.floor(p.f - 1e-6);
        const mov = Math.min(paso, resto);
        p.c += d[0] * mov;
        p.f += d[1] * mov;
        paso -= mov;
        if (mov === resto) {
          p.c = Math.round(p.c * 1e6) / 1e6;
          p.f = Math.round(p.f * 1e6) / 1e6;
        }
      }
    }
    return {
      oscuro: 0.35,
      mover(dt) {
        ["left", "right", "up", "down"].forEach((k) => {
          if (g.teclas[k]) yo.quiere = k;
        });
        // Darse la vuelta no espera a llegar al centro de la casilla.
        if (yo.dir && yo.quiere) {
          const a = DIR[yo.dir];
          const b = DIR[yo.quiere];
          if (a[0] === -b[0] && a[1] === -b[1]) yo.dir = yo.quiere;
        }
        avanzar(yo, (g.tranquilo ? 3 : 4.5) * Math.min(g.f(), 1.4), dt, (p) => {
          if (p.quiere && libre(p.c + DIR[p.quiere][0], p.f + DIR[p.quiere][1])) p.dir = p.quiere;
        });
        hojas = hojas.filter((h) => {
          if (Math.abs(h.c - yo.c) < 0.5 && Math.abs(h.f - yo.f) < 0.5) {
            g.sumar(5);
            return false;
          }
          return true;
        });
        if (!hojas.length) {
          g.sumar(50, OX + yo.c * C, yo.f * C);
          llenar();
        }
        if (!g.tranquilo && !tercero && g.f() > 1.3) {
          tercero = true;
          enemigos.push({ c: 7, f: 3, dir: "left" });
        }
        enemigos.forEach((e) => {
          avanzar(e, 2.6 * g.f(), dt, (p) => {
            const opciones = Object.keys(DIR).filter((k) => {
              const d = DIR[k];
              const atras = p.dir && DIR[p.dir][0] === -d[0] && DIR[p.dir][1] === -d[1];
              return libre(p.c + d[0], p.f + d[1]) && !atras;
            });
            if (!opciones.length) {
              p.dir = Object.keys(DIR).find((k) => libre(p.c + DIR[k][0], p.f + DIR[k][1]));
              return;
            }
            // Un poco de persecución, un poco de azar.
            opciones.sort((a, b) => {
              const da = Math.abs(p.c + DIR[a][0] - yo.c) + Math.abs(p.f + DIR[a][1] - yo.f);
              const db = Math.abs(p.c + DIR[b][0] - yo.c) + Math.abs(p.f + DIR[b][1] - yo.f);
              return da - db;
            });
            p.dir = Math.random() < 0.5 ? opciones[0] : opciones[Math.floor(Math.random() * opciones.length)];
          });
          if (Math.abs(e.c - yo.c) < 0.6 && Math.abs(e.f - yo.f) < 0.6 && g.golpe(20)) {
            yo.c = 1;
            yo.f = 1;
            yo.dir = null;
          }
        });
      },
      dibujar(respiro) {
        MAPA.forEach((fila, f) =>
          fila.split("").forEach((ch, c) => {
            if (ch !== "#") return;
            cx.fillStyle = "#2f5a2a";
            cx.fillRect(OX + c * C + 2, f * C + 2, C - 4, C - 4);
            cx.fillStyle = "#3f7a38";
            cx.beginPath();
            cx.arc(OX + c * C + C / 2, f * C + C / 2, C / 3, 0, Math.PI * 2);
            cx.fill();
          })
        );
        hojas.forEach((h) => {
          const x = OX + h.c * C + C / 2;
          const y = h.f * C + C / 2;
          cx.fillStyle = "#e9b04a";
          cx.beginPath();
          cx.ellipse(x, y, g.tranquilo ? 11 : 8, g.tranquilo ? 6 : 4.5, -0.6, 0, Math.PI * 2);
          cx.fill();
        });
        enemigos.forEach((e) => figura(g, g.img.guardian, OX + e.c * C + C / 2, e.f * C + C / 2, 54, "#8a4a2f"));
        heroe(g, OX + yo.c * C + C / 2, yo.f * C + C - 2, 64, respiro);
      },
    };
  };

  // 5 · Vuelo sobre el desierto: subir y bajar (↑ ↓) entre las columnas
  // de la Torre del Escriba, recogiendo gemas. Sin gravedad.
  CREAR[5] = function (g) {
    const { cx, W, H } = g;
    const X = 180;
    let y = H / 2;
    let siguiente = 0.8;
    const cols = [];
    return {
      oscuro: 0.2,
      mover(dt) {
        const vel = g.tranquilo ? 300 : 420;
        if (g.teclas.up) y -= vel * dt;
        if (g.teclas.down) y += vel * dt;
        y = Math.max(60, Math.min(H - 30, y));
        const v = 260 * g.f();
        if ((siguiente -= dt) <= 0) {
          const hueco = g.tranquilo ? 300 : Math.max(170, 230 - (g.f() - 1) * 60);
          const centro = g.azar(60 + hueco / 2, H - 40 - hueco / 2);
          cols.push({ x: W + 40, w: 70, arriba: centro - hueco / 2, abajo: centro + hueco / 2, gema: true });
          siguiente = 1.7 / g.f();
        }
        const yo = { x: X - 22, y: y - 60, w: 44, h: 56 };
        for (let i = cols.length - 1; i >= 0; i--) {
          const c = cols[i];
          c.x -= v * dt;
          const golpe = choca(yo, { x: c.x, y: 0, w: c.w, h: c.arriba }) || choca(yo, { x: c.x, y: c.abajo, w: c.w, h: H - c.abajo });
          if (golpe && !c.tocada) {
            c.tocada = true;
            g.golpe(15);
          }
          const gy = (c.arriba + c.abajo) / 2;
          if (c.gema && choca(yo, { x: c.x + c.w / 2 - 20, y: gy - 20, w: 40, h: 40 })) {
            c.gema = false;
            g.sumar(10, c.x, gy);
          }
          if (!c.pasada && c.x + c.w < X - 22) {
            c.pasada = true;
            if (!c.tocada) g.sumar(5);
          }
          if (c.x < -100) cols.splice(i, 1);
        }
      },
      dibujar(respiro) {
        cols.forEach((c) => {
          [[0, c.arriba], [c.abajo, H - c.abajo]].forEach(([y0, h]) => {
            cx.fillStyle = "#c98f55";
            cx.fillRect(c.x, y0, c.w, h);
            cx.fillStyle = "#a8703f";
            for (let yy = y0 + 10; yy < y0 + h; yy += 26) cx.fillRect(c.x, yy, c.w, 4);
            cx.fillStyle = "#e3b57c";
            cx.fillRect(c.x - 6, y0 === 0 ? h - 14 : y0, c.w + 12, 14);
          });
          if (c.gema) gema(cx, c.x + c.w / 2, (c.arriba + c.abajo) / 2, g.tranquilo ? 26 : 20);
        });
        heroe(g, X, y, 70, respiro);
      },
    };
  };

  // 6 · Lluvia de gemas: mover el cofre (← →) para atrapar las gemas que
  // caen y esquivar los borrones de Borrón.
  CREAR[6] = function (g) {
    const { cx, W, H } = g;
    const ANCHO = g.tranquilo ? 170 : 130;
    let x = W / 2;
    let bx = W / 2;
    let bdir = 1;
    let siguiente = 0.4;
    const caen = [];
    return {
      oscuro: 0.3,
      mover(dt) {
        const vel = g.tranquilo ? 380 : 560;
        if (g.teclas.left) x -= vel * dt;
        if (g.teclas.right) x += vel * dt;
        x = Math.max(ANCHO / 2, Math.min(W - ANCHO / 2, x));
        bx += bdir * 220 * g.f() * dt;
        if (bx > W - 80 || bx < 80) bdir = -bdir;
        if ((siguiente -= dt) <= 0) {
          const malo = !g.tranquilo && Math.random() < 0.3;
          caen.push({ x: g.tranquilo ? g.azar(60, W - 60) : bx + g.azar(-40, 40), y: 110, malo: malo, r: malo ? 22 : g.tranquilo ? 24 : 18 });
          siguiente = g.azar(0.4, 0.75) / g.f();
        }
        const boca = { x: x - ANCHO / 2, y: H - 110, w: ANCHO, h: 40 };
        for (let i = caen.length - 1; i >= 0; i--) {
          const c = caen[i];
          c.y += 230 * g.f() * dt;
          if (choca(boca, { x: c.x - c.r, y: c.y - c.r, w: c.r * 2, h: c.r * 2 })) {
            if (c.malo) g.golpe(15);
            else g.sumar(10, c.x, c.y);
            caen.splice(i, 1);
          } else if (c.y > H + 30) caen.splice(i, 1);
        }
      },
      dibujar(respiro) {
        if (!g.tranquilo) figura(g, g.img.guardian, bx, 60, 110, "#1b1530");
        caen.forEach((c) => (c.malo ? borron(cx, c.x, c.y, c.r) : gema(cx, c.x, c.y, c.r)));
        if (respiro > 0) cx.globalAlpha = g.efectos && Math.floor(respiro * 10) % 2 === 0 ? 0.3 : 0.6;
        if (lista(g.img.cofre)) {
          const h = (g.img.cofre.naturalHeight / g.img.cofre.naturalWidth) * ANCHO;
          cx.drawImage(g.img.cofre, x - ANCHO / 2, H - 120 - h * 0.25, ANCHO, h);
        } else {
          cx.fillStyle = "#a0703f";
          cx.fillRect(x - ANCHO / 2, H - 110, ANCHO, 80);
        }
        cx.globalAlpha = 1;
      },
    };
  };

  window.LetraniaArcade = { jugar: jugar, xpDe: xpDe, JUEGOS: JUEGOS };
})();
