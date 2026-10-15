// ============================================================
// Nivel de voz: cartel que indica a la clase qué volumen toca.
// No escucha nada; para medir está el Ruidómetro.
//
// Enlace con el Ruidómetro: al elegir un nivel se publica en
// localStorage (clave ar_nivel_voz_activo) con su límite. El
// Ruidómetro, abierto en otra ventana del tablero, recibe el evento
// «storage» y ajusta su límite si tiene activada la opción.
// ============================================================
(function () {
  "use strict";

  const H = window.Herramienta;
  const CLAVE = "ar_herramienta_nivel_voz";
  const CLAVE_ACTIVO = "ar_nivel_voz_activo";

  const DE_SERIE = [
    { emoji: "🤫", nombre: "Silencio", desc: "No hablamos. Cada uno en su tarea.", limite: 20 },
    { emoji: "🙊", nombre: "Susurro", desc: "Solo te oye tu compañero o compañera.", limite: 32 },
    { emoji: "👥", nombre: "Voz de pareja", desc: "Hablamos en voz baja con la pareja.", limite: 45 },
    { emoji: "🧩", nombre: "Voz de grupo", desc: "Te oye tu grupo, no la mesa de al lado.", limite: 58 },
    { emoji: "🙋", nombre: "Voz para la clase", desc: "Para exponer o responder: te oye toda la clase.", limite: 72 },
    { emoji: "📣", nombre: "Voz de patio", desc: "Solo fuera del aula.", limite: 88 },
  ];

  const copiaDeSerie = () => DE_SERIE.map((n) => Object.assign({}, n));
  const cfg = H.cargar(CLAVE, { niveles: copiaDeSerie(), cuantos: 5, elegido: 0, mostrar: "todos", enlazar: true });
  if (!Array.isArray(cfg.niveles) || cfg.niveles.length !== 6) cfg.niveles = copiaDeSerie();

  const $ = (id) => document.getElementById(id);
  const contenedor = $("niveles");
  const editar = $("editar");
  const enlaceTxt = $("enlace-ruido");

  function guardar() {
    H.guardar(CLAVE, cfg);
  }

  // Colores de verde (calma) a rojo (mucho volumen), repartidos según
  // cuántos niveles haya.
  const PALETA = [[34, 197, 94], [132, 204, 22], [234, 179, 8], [249, 115, 22], [239, 68, 68], [190, 24, 93]];
  function colorDe(i, n) {
    const t = n === 1 ? 0 : (i / (n - 1)) * (PALETA.length - 1);
    const a = PALETA[Math.floor(t)], b = PALETA[Math.min(PALETA.length - 1, Math.ceil(t))];
    const f = t - Math.floor(t);
    return a.map((v, k) => Math.round(v + (b[k] - v) * f));
  }

  function niveles() {
    return cfg.niveles.slice(0, cfg.cuantos);
  }

  function pintar() {
    const lista = niveles();
    if (cfg.elegido >= lista.length) cfg.elegido = lista.length - 1;
    contenedor.dataset.mostrar = cfg.mostrar;
    contenedor.innerHTML = "";
    lista.forEach((n, i) => {
      const rgb = colorDe(i, lista.length);
      const b = document.createElement("button");
      b.type = "button";
      b.className = "nivel";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", String(i === cfg.elegido));
      b.setAttribute("aria-label", "Nivel " + i + ": " + n.nombre);
      b.style.setProperty("--color", "rgb(" + rgb.join(",") + ")");
      b.style.setProperty("--tinte", "rgba(" + rgb.join(",") + ",0.22)");
      b.style.setProperty("--sombra", "rgba(" + rgb.join(",") + ",0.45)");

      const num = document.createElement("span");
      num.className = "nivel-num";
      num.textContent = i;
      const emoji = document.createElement("span");
      emoji.className = "nivel-emoji";
      emoji.setAttribute("aria-hidden", "true");
      emoji.textContent = n.emoji;
      const textos = document.createElement("span");
      textos.className = "nivel-textos";
      const nombre = document.createElement("span");
      nombre.className = "nivel-nombre";
      nombre.textContent = n.nombre;
      const desc = document.createElement("span");
      desc.className = "nivel-desc";
      desc.textContent = n.desc;
      textos.append(nombre, desc);
      b.append(num, emoji, textos);
      b.addEventListener("click", () => elegir(i));
      contenedor.appendChild(b);
    });
    enlaceTxt.textContent = cfg.enlazar ? "🔗 Enlazado con el Ruidómetro (límite " + lista[cfg.elegido].limite + ")" : "";
  }

  function elegir(i) {
    cfg.elegido = i;
    guardar();
    pintar();
    publicar();
    H.sonar("tic");
  }

  function publicar() {
    if (!cfg.enlazar) return;
    const n = niveles()[cfg.elegido];
    try {
      localStorage.setItem(CLAVE_ACTIVO, JSON.stringify({ nivel: cfg.elegido, nombre: n.nombre, limite: n.limite, t: Date.now() }));
    } catch (e) {
      // Sin localStorage no hay enlace con el Ruidómetro.
    }
  }

  // ---------------- Ajustes ----------------
  function pintarEdicion() {
    editar.innerHTML = "";
    const cab = document.createElement("div");
    cab.className = "fila-nivel cabecera-edicion";
    ["Nº", "Icono", "Nombre", "Qué significa", "Ruidómetro"].forEach((t, k) => {
      const s = document.createElement("span");
      s.textContent = t;
      if (k === 3) s.className = "desc";
      cab.appendChild(s);
    });
    editar.appendChild(cab);

    niveles().forEach((n, i) => {
      const fila = document.createElement("div");
      fila.className = "fila-nivel";
      const num = document.createElement("span");
      num.textContent = i;
      fila.appendChild(num);
      [["emoji", 4, "text"], ["nombre", 30, "text"], ["desc", 80, "text"], ["limite", 3, "number"]].forEach(([k, max, tipo]) => {
        const input = document.createElement("input");
        input.type = tipo;
        input.value = n[k];
        input.setAttribute("aria-label", { emoji: "Icono", nombre: "Nombre", desc: "Qué significa", limite: "Límite del Ruidómetro" }[k] + " del nivel " + i);
        if (k === "desc") input.className = "desc";
        if (tipo === "number") {
          input.min = 5;
          input.max = 95;
        } else {
          input.maxLength = max;
        }
        input.addEventListener("input", () => {
          n[k] = tipo === "number" ? Math.max(5, Math.min(95, parseInt(input.value, 10) || 50)) : input.value;
          guardar();
          pintar();
        });
        fila.appendChild(input);
      });
      editar.appendChild(fila);
    });
  }

  const cuantos = $("cuantos");
  cuantos.value = String(cfg.cuantos);
  cuantos.addEventListener("change", () => {
    cfg.cuantos = Number(cuantos.value);
    guardar();
    pintar();
    pintarEdicion();
  });

  const mostrar = $("mostrar");
  mostrar.value = cfg.mostrar;
  mostrar.addEventListener("change", () => {
    cfg.mostrar = mostrar.value;
    guardar();
    pintar();
  });

  const enlazar = $("enlazar");
  enlazar.checked = !!cfg.enlazar;
  enlazar.addEventListener("change", () => {
    cfg.enlazar = enlazar.checked;
    guardar();
    pintar();
    publicar();
  });

  $("btn-restaurar").addEventListener("click", () => {
    if (!window.confirm("¿Volver a los niveles de serie? Se pierden los nombres y límites que hayas cambiado.")) return;
    cfg.niveles = copiaDeSerie();
    guardar();
    pintar();
    pintarEdicion();
  });

  H.conmutador($("btn-ajustes"), $("ajustes"));

  // Flechas arriba/abajo para subir o bajar el nivel.
  document.addEventListener("keydown", (e) => {
    if (/^(INPUT|SELECT|TEXTAREA)$/.test((e.target && e.target.tagName) || "")) return;
    if (e.key === "ArrowUp" && cfg.elegido < cfg.cuantos - 1) { e.preventDefault(); elegir(cfg.elegido + 1); }
    if (e.key === "ArrowDown" && cfg.elegido > 0) { e.preventDefault(); elegir(cfg.elegido - 1); }
  });

  pintar();
  pintarEdicion();
})();
