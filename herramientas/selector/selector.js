// ============================================================
// Selector de alumnos al azar.
//
//  - Varias listas de clase, guardadas solo en este equipo.
//  - «Cada uno una vez» (por defecto): nadie repite hasta que han
//    salido todos; entonces empieza una ronda nueva. Es lo justo y lo
//    que el alumnado percibe como justo. Sin esa opción, cada vez es
//    un sorteo completo y alguien puede salir dos veces seguidas.
//  - Ausentes del día: no salen hoy y al día siguiente se olvidan.
//  - El azar usa crypto.getRandomValues, no Math.random.
// ============================================================
(function () {
  "use strict";

  const H = window.Herramienta;
  const CLAVE = "ar_herramienta_selector";

  const cfg = H.cargar(CLAVE, {
    listas: [{ id: "l1", nombre: "Mi clase", alumnos: [] }],
    actual: "l1",
    siguiente: 2,
    unaVez: true,
    animacion: true,
    sonido: true,
    cuantos: 1,
    salidos: {},
    ausentes: { fecha: "", porLista: {} },
    historial: {},
  });
  if (!Array.isArray(cfg.listas) || !cfg.listas.length) cfg.listas = [{ id: "l1", nombre: "Mi clase", alumnos: [] }];

  const $ = (id) => document.getElementById(id);
  const el = {
    lista: $("lista"),
    nombre: $("nombre"),
    quedan: $("quedan"),
    elegir: $("btn-elegir"),
    cuantos: $("cuantos"),
    empezarRonda: $("btn-empezar-ronda"),
    historial: $("historial"),
    asistenciaLista: $("asistencia-lista"),
    listaNombre: $("lista-nombre"),
    nombres: $("nombres"),
    unaVez: $("una-vez"),
    animacion: $("animacion"),
    sonido: $("sonido"),
  };

  function hoy() {
    const d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function guardar() {
    H.guardar(CLAVE, cfg);
  }

  function listaActual() {
    return cfg.listas.find((l) => l.id === cfg.actual) || cfg.listas[0];
  }

  // Los ausentes son solo de hoy: al cambiar de día se vacían.
  function ausentes() {
    if (cfg.ausentes.fecha !== hoy()) cfg.ausentes = { fecha: hoy(), porLista: {} };
    const l = listaActual();
    if (!cfg.ausentes.porLista[l.id]) cfg.ausentes.porLista[l.id] = [];
    return cfg.ausentes.porLista[l.id];
  }

  function salidos() {
    const l = listaActual();
    if (!cfg.salidos[l.id]) cfg.salidos[l.id] = [];
    return cfg.salidos[l.id];
  }

  function historial() {
    const l = listaActual();
    if (!cfg.historial[l.id]) cfg.historial[l.id] = [];
    return cfg.historial[l.id];
  }

  function presentes() {
    const fuera = ausentes();
    return listaActual().alumnos.filter((n) => fuera.indexOf(n) === -1);
  }

  function disponibles() {
    const p = presentes();
    if (!cfg.unaVez) return p;
    const ya = salidos();
    return p.filter((n) => ya.indexOf(n) === -1);
  }

  function azar(n) {
    const a = new Uint32Array(1);
    crypto.getRandomValues(a);
    return a[0] % n;
  }

  function barajar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = azar(i + 1);
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  // ---------------- Pintar ----------------
  function pintarListas() {
    el.lista.innerHTML = "";
    cfg.listas.forEach((l) => {
      const op = document.createElement("option");
      op.value = l.id;
      op.textContent = l.nombre + " (" + l.alumnos.length + ")";
      if (l.id === cfg.actual) op.selected = true;
      el.lista.appendChild(op);
    });
    const l = listaActual();
    el.listaNombre.value = l.nombre;
    el.nombres.value = l.alumnos.join("\n");
    el.lista.hidden = cfg.listas.length < 2;
  }

  function pintarAsistencia() {
    const fuera = ausentes();
    el.asistenciaLista.innerHTML = "";
    listaActual().alumnos.forEach((n) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = n;
      b.setAttribute("aria-pressed", String(fuera.indexOf(n) !== -1));
      b.addEventListener("click", () => {
        const i = fuera.indexOf(n);
        if (i === -1) fuera.push(n);
        else fuera.splice(i, 1);
        guardar();
        pintarAsistencia();
        pintarEstado();
      });
      el.asistenciaLista.appendChild(b);
    });
    if (!listaActual().alumnos.length) el.asistenciaLista.textContent = "La lista está vacía.";
  }

  function pintarEstado() {
    const total = listaActual().alumnos.length;
    const pres = presentes().length;
    const disp = disponibles().length;
    const faltan = total - pres;
    let texto;
    if (!total) texto = "Añade los nombres en «Listas y ajustes».";
    else if (!pres) texto = "Hoy están todos marcados como ausentes.";
    else if (cfg.unaVez) texto = disp ? "Quedan " + disp + " de " + pres + " por salir" : "¡Ya han salido todos! Pulsa «Elegir» para empezar otra ronda.";
    else texto = pres + " alumnos en el sorteo";
    if (total && faltan) texto += " · " + faltan + (faltan === 1 ? " ausente" : " ausentes");
    el.quedan.textContent = texto;
    el.elegir.disabled = !pres;
    el.empezarRonda.hidden = !cfg.unaVez;

    el.historial.innerHTML = "";
    const lista = cfg.unaVez ? salidos() : historial().slice(-12);
    lista.forEach((n) => {
      const s = document.createElement("span");
      s.textContent = n;
      el.historial.appendChild(s);
    });
  }

  function mostrarNombres(nombres, clase) {
    el.nombre.className = "nombre" + (clase ? " " + clase : "") + (nombres.length > 1 ? " varios" : "");
    el.nombre.textContent = nombres.join(" · ");
  }

  // ---------------- Elegir ----------------
  let barajando = false;

  function elegir() {
    if (barajando) return;
    if (!presentes().length) return;
    if (cfg.unaVez && !disponibles().length) {
      salidos().length = 0;
      guardar();
    }
    const pool = disponibles();
    const n = Math.min(Number(cfg.cuantos) || 1, pool.length);
    const elegidos = barajar(pool).slice(0, n);

    const terminar = () => {
      barajando = false;
      el.elegir.disabled = false;
      if (cfg.unaVez) elegidos.forEach((x) => salidos().push(x));
      const h = historial();
      elegidos.forEach((x) => h.push(x));
      if (h.length > 50) h.splice(0, h.length - 50);
      guardar();
      mostrarNombres(elegidos, "elegido");
      if (cfg.sonido) H.sonar("exito");
      pintarEstado();
    };

    if (!cfg.animacion) {
      terminar();
      return;
    }

    // Baraja los nombres en pantalla cada vez más despacio, como una
    // ruleta que se frena, y para en los elegidos.
    barajando = true;
    el.elegir.disabled = true;
    const caras = presentes();
    let espera = 45;
    const paso = () => {
      if (espera > 260) {
        terminar();
        return;
      }
      const muestra = [];
      for (let i = 0; i < n; i++) muestra.push(caras[azar(caras.length)]);
      mostrarNombres(muestra, "barajando");
      if (cfg.sonido) H.sonar("tic");
      espera *= 1.13;
      setTimeout(paso, espera);
    };
    paso();
  }

  // ---------------- Controles ----------------
  el.elegir.addEventListener("click", elegir);

  el.cuantos.value = String(cfg.cuantos);
  el.cuantos.addEventListener("change", () => {
    cfg.cuantos = Number(el.cuantos.value);
    guardar();
  });

  el.empezarRonda.addEventListener("click", () => {
    salidos().length = 0;
    guardar();
    mostrarNombres(["¿Quién será?"], "");
    pintarEstado();
  });

  el.lista.addEventListener("change", () => {
    cfg.actual = el.lista.value;
    guardar();
    mostrarNombres(["¿Quién será?"], "");
    pintarTodo();
  });

  el.listaNombre.addEventListener("input", () => {
    listaActual().nombre = el.listaNombre.value.trim() || "Sin nombre";
    guardar();
    const op = el.lista.querySelector('option[value="' + cfg.actual + '"]');
    if (op) op.textContent = listaActual().nombre + " (" + listaActual().alumnos.length + ")";
  });

  el.nombres.addEventListener("input", () => {
    const vistos = new Set();
    const alumnos = el.nombres.value
      .split("\n")
      .map((s) => s.trim().slice(0, 40))
      .filter((s) => s && !vistos.has(s) && vistos.add(s));
    const l = listaActual();
    l.alumnos = alumnos;
    // Quien ya no está en la lista deja de contar como salido o ausente.
    cfg.salidos[l.id] = salidos().filter((n) => alumnos.indexOf(n) !== -1);
    cfg.ausentes.porLista[l.id] = ausentes().filter((n) => alumnos.indexOf(n) !== -1);
    guardar();
    const op = el.lista.querySelector('option[value="' + l.id + '"]');
    if (op) op.textContent = l.nombre + " (" + alumnos.length + ")";
    pintarAsistencia();
    pintarEstado();
  });

  $("btn-nueva").addEventListener("click", () => {
    const id = "l" + cfg.siguiente++;
    cfg.listas.push({ id: id, nombre: "Clase " + (cfg.listas.length + 1), alumnos: [] });
    cfg.actual = id;
    guardar();
    pintarTodo();
    el.listaNombre.focus();
    el.listaNombre.select();
  });

  $("btn-borrar-lista").addEventListener("click", () => {
    const l = listaActual();
    if (!window.confirm("¿Borrar la lista «" + l.nombre + "»? No se puede deshacer.")) return;
    cfg.listas = cfg.listas.filter((x) => x.id !== l.id);
    delete cfg.salidos[l.id];
    delete cfg.historial[l.id];
    if (!cfg.listas.length) cfg.listas.push({ id: "l" + cfg.siguiente++, nombre: "Mi clase", alumnos: [] });
    cfg.actual = cfg.listas[0].id;
    guardar();
    pintarTodo();
  });

  [["unaVez", el.unaVez], ["animacion", el.animacion], ["sonido", el.sonido]].forEach(([k, input]) => {
    input.checked = !!cfg[k];
    input.addEventListener("change", () => {
      cfg[k] = input.checked;
      guardar();
      pintarEstado();
    });
  });

  H.conmutador($("btn-ajustes"), $("ajustes"));
  H.conmutador($("btn-asistencia"), $("asistencia"));

  document.addEventListener("keydown", (e) => {
    if (e.code !== "Space") return;
    if (/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test((e.target && e.target.tagName) || "")) return;
    e.preventDefault();
    elegir();
  });

  function pintarTodo() {
    pintarListas();
    pintarAsistencia();
    pintarEstado();
  }

  pintarTodo();
  // Lista vacía la primera vez: se abren los ajustes para rellenarla.
  if (!listaActual().alumnos.length) $("btn-ajustes").click();
})();
