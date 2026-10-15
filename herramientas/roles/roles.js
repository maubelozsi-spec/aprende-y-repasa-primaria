// ============================================================
// Roles de clase: reparto semanal de los encargados del aula.
//
//  - Varias clases, cada una con su alumnado, sus roles (editables,
//    con icono y color) y su historial de semanas guardadas. Todo se
//    guarda solo en este equipo, como el resto de herramientas; para
//    llevarlo a otro está «Descargar copia» / «Cargar copia».
//
//  - El reparto es al azar, pero con memoria. Se hace en dos pasos:
//
//    1. Quién trabaja esta semana. A cada alumno se le calcula cuántas
//       semanas «le tocaba» tener rol (en cada semana guardada en la
//       que estaba en la lista, la parte proporcional: plazas/alumnos)
//       y cuántas lo ha tenido de verdad. Entran primero los que van
//       más atrasados; a igualdad, quien hace más que no tiene rol; y
//       a igualdad de todo, el azar. Así, con 24 alumnos y 12 plazas,
//       se van turnando semana sí, semana no, y nadie se queda fuera.
//
//    2. Qué rol hace cada uno. Entre los elegidos se busca el reparto
//       de menor «coste» con el algoritmo húngaro (asignación óptima):
//       repetir el rol de la semana pasada cuesta muchísimo (solo pasa
//       si no hay otra forma), el de hace dos o tres semanas bastante
//       menos, y cada vez que ya hizo ese rol suma algo, de modo que
//       se van probando todos. Un poco de azar en cada coste hace que
//       dos repartos seguidos no salgan iguales.
//
//  - Un reparto nuevo es un borrador: se puede retocar a mano (tocar
//    un nombre) y solo cuenta para el historial al pulsar «Guardar».
//  - El azar usa crypto.getRandomValues, como el selector de alumnos.
// ============================================================
(function () {
  "use strict";

  const H = window.Herramienta;
  const C = window.ROLES_CATALOGO;
  const CLAVE = "ar_herramienta_roles";
  const CLAVE_SELECTOR = "ar_herramienta_selector";
  const MAX_SEMANAS = 80;

  const $ = (id) => document.getElementById(id);

  // ---------------- Datos ----------------
  function copiaRoles() {
    return C.porDefecto.map((r) => Object.assign({}, r));
  }

  function grupoNuevo(id, nombre, alumnos) {
    return { id: id, nombre: nombre, alumnos: alumnos || [], exentos: [], roles: copiaRoles(), historial: {}, borrador: null };
  }

  function leerSelector() {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE_SELECTOR) || "null");
      if (datos && Array.isArray(datos.listas)) return datos.listas.filter((l) => l && Array.isArray(l.alumnos));
    } catch (e) {
      // Sin listas del selector.
    }
    return [];
  }

  const cfg = H.cargar(CLAVE, { grupos: null, actual: "g1", siguiente: 2 });
  if (!Array.isArray(cfg.grupos) || !cfg.grupos.length) {
    // La primera vez se parte de la lista que ya haya en «Alumno al
    // azar», para no tener que escribir la clase dos veces.
    const primera = leerSelector().find((l) => l.alumnos.length);
    cfg.grupos = [grupoNuevo("g1", primera ? primera.nombre : "Mi clase", primera ? primera.alumnos.slice() : [])];
    cfg.actual = "g1";
    cfg.siguiente = 2;
  }
  cfg.grupos.forEach((g) => {
    if (!Array.isArray(g.alumnos)) g.alumnos = [];
    if (!Array.isArray(g.exentos)) g.exentos = [];
    if (!Array.isArray(g.roles)) g.roles = copiaRoles();
    if (!g.historial || typeof g.historial !== "object") g.historial = {};
    if (g.borrador === undefined) g.borrador = null;
  });

  function guardar() {
    H.guardar(CLAVE, cfg);
  }

  function grupo() {
    return cfg.grupos.find((g) => g.id === cfg.actual) || cfg.grupos[0];
  }

  function elegibles(g) {
    return g.alumnos.filter((a) => g.exentos.indexOf(a) === -1);
  }

  function totalPlazas(g) {
    return g.roles.reduce((s, r) => s + Math.max(0, Number(r.plazas) || 0), 0);
  }

  // ---------------- Azar ----------------
  function aleatorio() {
    const a = new Uint32Array(1);
    crypto.getRandomValues(a);
    return a[0] / 4294967296;
  }

  // ---------------- Semanas ----------------
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const dos = (n) => (n < 10 ? "0" : "") + n;

  function claveDe(d) {
    return d.getFullYear() + "-" + dos(d.getMonth() + 1) + "-" + dos(d.getDate());
  }

  function fechaDe(k) {
    const [y, m, d] = k.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function lunesDe(d) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
    return x;
  }

  // En fin de semana lo útil es preparar la semana que empieza.
  function semanaInicial() {
    const hoy = new Date();
    const l = lunesDe(hoy);
    if (hoy.getDay() === 0 || hoy.getDay() === 6) l.setDate(l.getDate() + 7);
    return claveDe(l);
  }

  function sumarSemanas(k, n) {
    const d = fechaDe(k);
    d.setDate(d.getDate() + 7 * n);
    return claveDe(d);
  }

  function textoSemana(k) {
    const a = fechaDe(k);
    const b = new Date(a);
    b.setDate(b.getDate() + 4);
    if (a.getMonth() === b.getMonth()) return "Semana del " + a.getDate() + " al " + b.getDate() + " de " + MESES[b.getMonth()];
    return "Semana del " + a.getDate() + " de " + MESES[a.getMonth()] + " al " + b.getDate() + " de " + MESES[b.getMonth()];
  }

  let semana = semanaInicial();

  // ---------------- Historial y estadísticas ----------------
  function semanasGuardadas(g) {
    return Object.keys(g.historial).sort();
  }

  function rolesDe(entrada, nombre) {
    const asig = (entrada && entrada.asignacion) || {};
    return Object.keys(asig).filter((r) => (asig[r] || []).indexOf(nombre) !== -1);
  }

  // Por alumno: semanas con rol, semanas que «le tocaban» (parte
  // proporcional de cada semana en la que estaba en la lista), última
  // semana con rol (índice) y veces en cada rol.
  function estadisticas(g, semanas) {
    const st = {};
    const base = () => ({ conRol: 0, esperado: 0, ultima: -1, porRol: {} });
    g.alumnos.forEach((a) => (st[a] = base()));
    semanas.forEach((k, idx) => {
      const e = g.historial[k];
      const asig = e.asignacion || {};
      const part = Array.isArray(e.participantes) && e.participantes.length ? e.participantes : g.alumnos;
      let ocupadas = 0;
      Object.keys(asig).forEach((r) => (ocupadas += (asig[r] || []).filter(Boolean).length));
      const cuota = part.length ? Math.min(1, ocupadas / part.length) : 0;
      part.forEach((a) => {
        if (!st[a]) st[a] = base();
        st[a].esperado += cuota;
      });
      Object.keys(asig).forEach((r) =>
        (asig[r] || []).forEach((a) => {
          if (!a) return;
          if (!st[a]) st[a] = base();
          const s = st[a];
          s.porRol[r] = (s.porRol[r] || 0) + 1;
          if (s.ultima !== idx) {
            s.conRol++;
            s.ultima = idx;
          }
        })
      );
    });
    return st;
  }

  // ---------------- Reparto ----------------
  // Asignación de coste mínimo (algoritmo húngaro) para una matriz
  // cuadrada. Devuelve, para cada columna, la fila que se le asigna.
  function hungaro(a) {
    const n = a.length;
    const INF = 1e15;
    const u = new Array(n + 1).fill(0);
    const v = new Array(n + 1).fill(0);
    const p = new Array(n + 1).fill(0);
    const way = new Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++) {
      p[0] = i;
      let j0 = 0;
      const minv = new Array(n + 1).fill(INF);
      const used = new Array(n + 1).fill(false);
      do {
        used[j0] = true;
        const i0 = p[j0];
        let delta = INF;
        let j1 = 0;
        for (let j = 1; j <= n; j++) {
          if (used[j]) continue;
          const cur = a[i0 - 1][j - 1] - u[i0] - v[j];
          if (cur < minv[j]) {
            minv[j] = cur;
            way[j] = j0;
          }
          if (minv[j] < delta) {
            delta = minv[j];
            j1 = j;
          }
        }
        for (let j = 0; j <= n; j++) {
          if (used[j]) {
            u[p[j]] += delta;
            v[j] -= delta;
          } else {
            minv[j] -= delta;
          }
        }
        j0 = j1;
      } while (p[j0] !== 0);
      do {
        const j1 = way[j0];
        p[j0] = p[j1];
        j0 = j1;
      } while (j0);
    }
    const filaDeColumna = new Array(n);
    for (let j = 1; j <= n; j++) filaDeColumna[j - 1] = p[j] - 1;
    return filaDeColumna;
  }

  function repartir(g, k) {
    const elig = elegibles(g);
    const huecos = [];
    g.roles.forEach((r) => {
      for (let i = 0; i < (Number(r.plazas) || 0); i++) huecos.push(r.id);
    });
    if (!elig.length || !huecos.length) return null;

    const previas = semanasGuardadas(g).filter((s) => s < k);
    const st = estadisticas(g, previas);
    const L = previas.length;
    const recientes = [1, 2, 3].map((atras) => (L - atras >= 0 ? g.historial[previas[L - atras]] : null));

    // Paso 1: quién trabaja (los más atrasados primero).
    const sorteo = new Map(elig.map((a) => [a, aleatorio()]));
    const orden = elig.slice().sort((a, b) => {
      const da = st[a].esperado - st[a].conRol;
      const db = st[b].esperado - st[b].conRol;
      if (Math.abs(db - da) > 1e-9) return db - da;
      if (st[a].ultima !== st[b].ultima) return st[a].ultima - st[b].ultima;
      return sorteo.get(a) - sorteo.get(b);
    });
    // Si hay más plazas que alumnos, se da una vuelta más a la lista.
    const filas = [];
    while (filas.length < huecos.length) {
      for (const a of orden) {
        if (filas.length >= huecos.length) break;
        filas.push(a);
      }
    }

    // Paso 2: qué rol hace cada uno.
    const PESOS = [1000, 250, 80];
    function coste(a, rolId) {
      let c = 0;
      recientes.forEach((e, i) => {
        if (e && rolesDe(e, a).indexOf(rolId) !== -1) c += PESOS[i];
      });
      c += 40 * (st[a].porRol[rolId] || 0);
      return c + aleatorio() * 9;
    }
    const matriz = filas.map((a) => huecos.map((rolId) => coste(a, rolId)));
    const filaDeHueco = hungaro(matriz);

    const asig = {};
    g.roles.forEach((r) => (asig[r.id] = []));
    huecos.forEach((rolId, j) => asig[rolId].push(filas[filaDeHueco[j]]));
    corregirDuplicados(asig);
    return asig;
  }

  // Solo con más plazas que alumnos: que nadie ocupe dos plazas del
  // mismo rol (por ejemplo, las dos de Ventanas).
  function corregirDuplicados(asig) {
    const ids = Object.keys(asig);
    ids.forEach((r) => {
      const lista = asig[r];
      lista.forEach((a, i) => {
        if (!a || lista.indexOf(a) === i) return;
        for (const r2 of ids) {
          if (r2 === r) continue;
          const j = asig[r2].findIndex((b) => b && lista.indexOf(b) === -1 && asig[r2].indexOf(a) === -1);
          if (j !== -1) {
            const b = asig[r2][j];
            asig[r2][j] = a;
            lista[i] = b;
            return;
          }
        }
      });
    });
  }

  // ---------------- Lo que se ve esta semana ----------------
  function normalizar(g, asig) {
    const out = {};
    g.roles.forEach((r) => {
      const n = Math.max(0, Number(r.plazas) || 0);
      const antes = (asig && asig[r.id]) || [];
      out[r.id] = [];
      for (let i = 0; i < n; i++) out[r.id].push(antes[i] || null);
    });
    return out;
  }

  function vista(g) {
    if (g.borrador && g.borrador.semana === semana) return { tipo: "borrador", asig: normalizar(g, g.borrador.asignacion) };
    if (g.historial[semana]) return { tipo: "guardada", asig: normalizar(g, g.historial[semana].asignacion) };
    return { tipo: "vacia", asig: normalizar(g, {}) };
  }

  function ponerBorrador(g, asig) {
    g.borrador = { semana: semana, asignacion: asig };
    guardar();
  }

  // ---------------- Dibujo de iconos y tarjetas ----------------
  function svgIcono(id) {
    const ic = C.iconos[id] || C.iconos.estrella;
    return '<svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">' + ic.svg + "</svg>";
  }

  function colorDe(id) {
    return C.colores.find((c) => c.id === id) || C.colores[0];
  }

  function pintarColor(elemento, rol) {
    const c = colorDe(rol.color);
    elemento.style.setProperty("--banda", c.banda);
    elemento.style.setProperty("--claro", c.claro);
  }

  function crear(etiqueta, clase, texto) {
    const e = document.createElement(etiqueta);
    if (clase) e.className = clase;
    if (texto !== undefined) e.textContent = texto;
    return e;
  }

  const el = {
    grupo: $("grupo"),
    semanaTexto: $("semana-texto"),
    semanaEstado: $("semana-estado"),
    sortear: $("btn-sortear"),
    guardarSemana: $("btn-guardar"),
    descartar: $("btn-descartar"),
    aviso: $("aviso"),
    tablero: $("tablero-roles"),
    resumen: $("resumen"),
    grupoNombre: $("grupo-nombre"),
    alumnos: $("alumnos"),
    exentos: $("exentos"),
    listaSelector: $("lista-selector"),
    filaImportar: $("fila-importar"),
    editorRoles: $("editor-roles"),
    plazasResumen: $("plazas-resumen"),
    equilibrioResumen: $("equilibrio-resumen"),
    tabla: $("tabla-equilibrio"),
    historialSemanas: $("historial-semanas"),
    dlgAlumno: $("dialogo-alumno"),
    dlgIcono: $("dialogo-icono"),
  };

  function pintarSemana() {
    const g = grupo();
    const v = vista(g);
    el.semanaTexto.textContent = textoSemana(semana);

    const estados = {
      guardada: ["✓ Guardada en el historial", "guardada"],
      borrador: [g.historial[semana] ? "Cambios sin guardar" : "Sin guardar: retócalo si quieres y pulsa «Guardar esta semana»", "borrador"],
      vacia: ["Todavía sin repartir", ""],
    };
    el.semanaEstado.textContent = estados[v.tipo][0];
    el.semanaEstado.className = "semana-estado " + estados[v.tipo][1];
    el.sortear.textContent = v.tipo === "vacia" ? "🎲 Repartir los roles" : "🎲 Volver a repartir";
    el.guardarSemana.disabled = v.tipo !== "borrador";
    el.descartar.hidden = v.tipo !== "borrador";

    // Avisos: falta de datos, o una semana anterior sin guardar (el
    // reparto solo aprende de las semanas guardadas).
    let aviso = "";
    const elig = elegibles(g);
    if (!g.alumnos.length) aviso = "Añade el alumnado de la clase en «👥 Alumnado» para poder repartir los roles.";
    else if (!elig.length) aviso = "Todo el alumnado está fuera del reparto (en «👥 Alumnado»).";
    else if (!totalPlazas(g)) aviso = "No hay ningún rol con plazas. Añádelos en «🏷️ Roles».";
    else if (v.tipo !== "guardada" && semanasGuardadas(g).some((s) => s < semana) && !g.historial[sumarSemanas(semana, -1)]) {
      aviso = "La semana anterior no está guardada: este reparto no la tiene en cuenta.";
    }
    el.aviso.textContent = aviso;
    el.aviso.hidden = !aviso;
    el.sortear.disabled = !elig.length || !totalPlazas(g);

    // Quién repite el rol de la semana pasada (para marcarlo).
    const previas = semanasGuardadas(g).filter((s) => s < semana);
    const pasada = previas.length ? g.historial[previas[previas.length - 1]] : null;
    const repite = (nombre, rolId) => !!pasada && previas[previas.length - 1] === sumarSemanas(semana, -1) && rolesDe(pasada, nombre).indexOf(rolId) !== -1;

    el.tablero.innerHTML = "";
    if (!g.roles.length) {
      el.tablero.appendChild(crear("p", "tablero-vacio", "No hay roles. Añádelos en «🏷️ Roles»."));
    }
    g.roles.forEach((r) => {
      const tarjeta = crear("article", "rol");
      pintarColor(tarjeta, r);
      const sello = crear("div", "rol-sello");
      const interior = crear("div", "rol-interior");
      const cuerpo = crear("div", "rol-cuerpo");
      const icono = crear("div", "rol-icono icono");
      icono.innerHTML = svgIcono(r.icono);
      const texto = crear("div", "rol-texto");
      if (r.latin) texto.appendChild(crear("p", "rol-latin", r.latin));
      texto.appendChild(crear("h3", "rol-nombre", r.nombre || "Rol"));
      if (r.descripcion) texto.appendChild(crear("p", "rol-desc", r.descripcion));
      cuerpo.append(icono, texto);

      const alumnos = crear("div", "rol-alumnos");
      (v.asig[r.id] || []).forEach((nombre, i) => {
        const chip = crear("button", "alumno-chip" + (nombre ? "" : " vacio"), nombre || "＋ Elegir");
        chip.type = "button";
        if (nombre && repite(nombre, r.id)) {
          chip.classList.add("repite");
          chip.title = "Ya hizo este rol la semana pasada";
        } else {
          chip.title = "Cambiar";
        }
        chip.addEventListener("click", () => abrirCambio(r, i));
        alumnos.appendChild(chip);
      });
      interior.append(cuerpo);
      if ((Number(r.plazas) || 0) > 0) interior.appendChild(alumnos);
      sello.appendChild(interior);
      tarjeta.appendChild(sello);
      el.tablero.appendChild(tarjeta);
    });

    pintarResumen(g, v, previas, repite);
  }

  function pintarResumen(g, v, previas, repite) {
    el.resumen.innerHTML = "";
    const ocupados = new Set();
    let vacias = 0;
    const repetidos = [];
    const estrenan = [];
    const st = estadisticas(g, previas);
    g.roles.forEach((r) =>
      (v.asig[r.id] || []).forEach((a) => {
        if (!a) {
          vacias++;
          return;
        }
        ocupados.add(a);
        if (repite(a, r.id)) repetidos.push(a + " (" + r.nombre + ")");
        if (previas.length && st[a] && !st[a].porRol[r.id]) estrenan.push(a);
      })
    );
    if (v.tipo === "vacia" && !ocupados.size) {
      el.resumen.hidden = true;
      return;
    }
    const descansan = elegibles(g).filter((a) => !ocupados.has(a));
    const puntos = [];
    if (previas.length) {
      puntos.push(repetidos.length ? ["⚠️ Repiten el rol de la semana pasada: ", repetidos.join(", ")] : ["✓ ", "Nadie repite el rol de la semana pasada."]);
    }
    if (descansan.length) puntos.push(["Descansan esta semana (" + descansan.length + "): ", descansan.join(", ")]);
    if (estrenan.length) puntos.push(["Estrenan rol: ", estrenan.join(", ")]);
    if (vacias) puntos.push(["Plazas sin nadie: ", String(vacias)]);
    if (elegibles(g).length < totalPlazas(g)) puntos.push(["Hay más plazas que alumnos: ", "algunos tienen dos roles esta semana."]);
    if (!previas.length) puntos.push(["Primera semana: ", "a partir de que la guardes, los siguientes repartos tendrán en cuenta quién ha hecho cada rol."]);

    el.resumen.appendChild(crear("h3", "", "Cómo ha quedado el reparto"));
    const ul = crear("ul");
    puntos.forEach(([titulo, texto]) => {
      const li = crear("li");
      li.appendChild(crear("strong", "", titulo));
      li.appendChild(document.createTextNode(texto));
      ul.appendChild(li);
    });
    el.resumen.appendChild(ul);
    el.resumen.hidden = false;
  }

  // ---------------- Cambiar a mano ----------------
  let cambio = null;

  function abrirCambio(rol, indice) {
    const g = grupo();
    const v = vista(g);
    const actual = v.asig[rol.id][indice];
    cambio = { rolId: rol.id, indice: indice };

    $("dialogo-alumno-titulo").textContent = (actual ? "Cambiar a " + actual : "Elegir") + " · " + rol.nombre;
    $("dialogo-alumno-ayuda").textContent =
      "Si eliges a alguien que ya tiene otro rol esta semana, se intercambian los puestos.";
    $("btn-vaciar-plaza").hidden = !actual;

    const previas = semanasGuardadas(g).filter((s) => s < semana);
    const st = estadisticas(g, previas);
    const pasada = previas.length && previas[previas.length - 1] === sumarSemanas(semana, -1) ? g.historial[previas[previas.length - 1]] : null;
    const rolActualDe = (nombre) => g.roles.find((r) => (v.asig[r.id] || []).indexOf(nombre) !== -1);

    const cont = $("opciones-alumno");
    cont.innerHTML = "";
    elegibles(g).forEach((nombre) => {
      const b = crear("button", "opcion-alumno");
      b.type = "button";
      b.appendChild(crear("span", "", nombre));
      const suyo = rolActualDe(nombre);
      const veces = (st[nombre] && st[nombre].porRol[rol.id]) || 0;
      let nota = suyo ? "Ahora: " + suyo.nombre : "Sin rol esta semana";
      if (pasada && rolesDe(pasada, nombre).indexOf(rol.id) !== -1) {
        nota = "Lo hizo la semana pasada";
        b.classList.add("desaconsejado");
      } else if (veces) {
        nota += " · " + veces + (veces === 1 ? " vez" : " veces") + " en este rol";
      }
      if (nombre === actual) b.classList.add("actual");
      b.appendChild(crear("small", "", nota));
      b.addEventListener("click", () => {
        aplicarCambio(nombre);
        el.dlgAlumno.close();
      });
      cont.appendChild(b);
    });
    el.dlgAlumno.showModal();
  }

  function aplicarCambio(nombre) {
    if (!cambio) return;
    const g = grupo();
    const asig = vista(g).asig;
    const actual = asig[cambio.rolId][cambio.indice];
    if (nombre) {
      for (const r of Object.keys(asig)) {
        const j = asig[r].indexOf(nombre);
        if (j !== -1) {
          asig[r][j] = actual;
          break;
        }
      }
    }
    asig[cambio.rolId][cambio.indice] = nombre;
    ponerBorrador(g, asig);
    cambio = null;
    pintarSemana();
  }

  $("btn-vaciar-plaza").addEventListener("click", () => {
    aplicarCambio(null);
    el.dlgAlumno.close();
  });

  // ---------------- Botones de la semana ----------------
  el.sortear.addEventListener("click", () => {
    const g = grupo();
    const asig = repartir(g, semana);
    if (!asig) return;
    ponerBorrador(g, asig);
    H.sonar("exito");
    pintarSemana();
  });

  el.guardarSemana.addEventListener("click", () => {
    const g = grupo();
    const v = vista(g);
    if (v.tipo !== "borrador") return;
    g.historial[semana] = { asignacion: v.asig, participantes: elegibles(g), guardado: new Date().toISOString() };
    g.borrador = null;
    const claves = semanasGuardadas(g);
    claves.slice(0, Math.max(0, claves.length - MAX_SEMANAS)).forEach((k) => delete g.historial[k]);
    guardar();
    pintarTodo();
  });

  el.descartar.addEventListener("click", () => {
    grupo().borrador = null;
    guardar();
    pintarSemana();
  });

  $("btn-anterior").addEventListener("click", () => {
    semana = sumarSemanas(semana, -1);
    pintarSemana();
  });
  $("btn-siguiente").addEventListener("click", () => {
    semana = sumarSemanas(semana, 1);
    pintarSemana();
  });
  $("btn-imprimir").addEventListener("click", () => window.print());

  // ---------------- Clases y alumnado ----------------
  function pintarGrupos() {
    el.grupo.innerHTML = "";
    cfg.grupos.forEach((g) => {
      const op = crear("option", "", g.nombre + " (" + g.alumnos.length + ")");
      op.value = g.id;
      if (g.id === cfg.actual) op.selected = true;
      el.grupo.appendChild(op);
    });
    el.grupo.hidden = cfg.grupos.length < 2;
  }

  function pintarAlumnado() {
    const g = grupo();
    el.grupoNombre.value = g.nombre;
    if (document.activeElement !== el.alumnos) el.alumnos.value = g.alumnos.join("\n");
    pintarExentos();

    const listas = leerSelector().filter((l) => l.alumnos.length);
    el.listaSelector.innerHTML = "";
    listas.forEach((l, i) => {
      const op = crear("option", "", l.nombre + " (" + l.alumnos.length + ")");
      op.value = String(i);
      el.listaSelector.appendChild(op);
    });
    el.filaImportar.hidden = !listas.length;
  }

  function pintarExentos() {
    const g = grupo();
    el.exentos.innerHTML = "";
    g.alumnos.forEach((a) => {
      const b = crear("button", "chip", a);
      b.type = "button";
      b.setAttribute("aria-pressed", String(g.exentos.indexOf(a) !== -1));
      b.addEventListener("click", () => {
        const i = g.exentos.indexOf(a);
        if (i === -1) g.exentos.push(a);
        else g.exentos.splice(i, 1);
        guardar();
        pintarExentos();
        pintarSemana();
        pintarEquilibrio();
      });
      el.exentos.appendChild(b);
    });
    if (!g.alumnos.length) el.exentos.textContent = "La lista está vacía.";
  }

  function fijarAlumnos(g, nombres) {
    const vistos = new Set();
    g.alumnos = nombres.map((s) => s.trim().slice(0, 40)).filter((s) => s && !vistos.has(s) && vistos.add(s));
    g.exentos = g.exentos.filter((a) => g.alumnos.indexOf(a) !== -1);
    guardar();
    pintarGrupos();
    pintarExentos();
    pintarSemana();
    pintarEquilibrio();
    pintarRolesResumen();
  }

  el.alumnos.addEventListener("input", () => fijarAlumnos(grupo(), el.alumnos.value.split("\n")));

  $("btn-importar").addEventListener("click", () => {
    const l = leerSelector().filter((x) => x.alumnos.length)[Number(el.listaSelector.value)];
    if (!l) return;
    const g = grupo();
    fijarAlumnos(g, g.alumnos.concat(l.alumnos));
    el.alumnos.value = g.alumnos.join("\n");
  });

  el.grupo.addEventListener("change", () => {
    cfg.actual = el.grupo.value;
    guardar();
    pintarTodo();
  });

  el.grupoNombre.addEventListener("input", () => {
    grupo().nombre = el.grupoNombre.value.trim() || "Sin nombre";
    guardar();
    pintarGrupos();
  });

  $("btn-nuevo-grupo").addEventListener("click", () => {
    const id = "g" + cfg.siguiente++;
    cfg.grupos.push(grupoNuevo(id, "Clase " + (cfg.grupos.length + 1), []));
    cfg.actual = id;
    guardar();
    pintarTodo();
    el.grupoNombre.focus();
    el.grupoNombre.select();
  });

  $("btn-borrar-grupo").addEventListener("click", () => {
    const g = grupo();
    if (!window.confirm("¿Borrar la clase «" + g.nombre + "» con sus roles y todo su historial? No se puede deshacer.")) return;
    cfg.grupos = cfg.grupos.filter((x) => x.id !== g.id);
    if (!cfg.grupos.length) cfg.grupos.push(grupoNuevo("g" + cfg.siguiente++, "Mi clase", []));
    cfg.actual = cfg.grupos[0].id;
    guardar();
    pintarTodo();
  });

  // ---------------- Editor de roles ----------------
  let rolDelIcono = null;

  function pintarRolesResumen() {
    const g = grupo();
    const plazas = totalPlazas(g);
    const n = elegibles(g).length;
    let t = plazas + (plazas === 1 ? " plaza" : " plazas") + " en " + g.roles.length + (g.roles.length === 1 ? " rol" : " roles");
    if (n) {
      if (plazas < n) t += " para " + n + " alumnos: cada semana trabajan " + plazas + " y descansan " + (n - plazas) + ", y se van turnando.";
      else if (plazas === n) t += " para " + n + " alumnos: cada semana todos tienen un rol.";
      else t += " para " + n + " alumnos: algunos tendrán dos roles a la vez.";
    }
    el.plazasResumen.textContent = t;
  }

  function cambioDeRoles(repintarEditor) {
    guardar();
    if (repintarEditor) pintarEditorRoles();
    pintarRolesResumen();
    pintarSemana();
    pintarEquilibrio();
  }

  function pintarEditorRoles() {
    const g = grupo();
    el.editorRoles.innerHTML = "";
    g.roles.forEach((r, i) => {
      const fila = crear("div", "editor-rol");
      pintarColor(fila, r);

      const boton = crear("button", "boton-icono icono");
      boton.type = "button";
      boton.innerHTML = svgIcono(r.icono);
      boton.title = "Cambiar el icono";
      boton.setAttribute("aria-label", "Cambiar el icono de " + (r.nombre || "este rol"));
      boton.addEventListener("click", () => abrirIconos(r));

      const campos = crear("div", "editor-campos");
      function campo(etiqueta, clave, max, ancho) {
        const l = crear("label", ancho ? "ancho" : "");
        l.appendChild(document.createTextNode(etiqueta));
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = max;
        input.value = r[clave] || "";
        input.addEventListener("input", () => {
          r[clave] = input.value;
          cambioDeRoles(false);
        });
        l.appendChild(input);
        campos.appendChild(l);
      }
      campo("Nombre", "nombre", 32);
      campo("Nombre en latín (opcional)", "latin", 28);
      campo("Qué hace", "descripcion", 110, true);

      const colores = crear("div", "colores ancho");
      colores.setAttribute("role", "group");
      colores.setAttribute("aria-label", "Color");
      C.colores.forEach((c) => {
        const m = crear("button", "color-muestra");
        m.type = "button";
        m.style.background = c.banda;
        m.title = c.nombre;
        m.setAttribute("aria-label", "Color " + c.nombre);
        m.setAttribute("aria-pressed", String(r.color === c.id));
        m.addEventListener("click", () => {
          r.color = c.id;
          cambioDeRoles(true);
        });
        colores.appendChild(m);
      });
      campos.appendChild(colores);

      const plazas = crear("div", "plazas ancho");
      plazas.appendChild(crear("span", "", "Alumnos a la vez:"));
      const menos = crear("button", "btn", "−");
      menos.type = "button";
      menos.setAttribute("aria-label", "Una plaza menos");
      const valor = crear("output", "", String(r.plazas));
      const mas = crear("button", "btn", "+");
      mas.type = "button";
      mas.setAttribute("aria-label", "Una plaza más");
      menos.addEventListener("click", () => {
        r.plazas = Math.max(0, (Number(r.plazas) || 0) - 1);
        cambioDeRoles(true);
      });
      mas.addEventListener("click", () => {
        r.plazas = Math.min(10, (Number(r.plazas) || 0) + 1);
        cambioDeRoles(true);
      });
      plazas.append(menos, valor, mas);
      campos.appendChild(plazas);

      const acciones = crear("div", "editor-acciones");
      const subir = crear("button", "btn", "↑");
      subir.type = "button";
      subir.title = "Subir";
      subir.disabled = i === 0;
      subir.addEventListener("click", () => {
        g.roles.splice(i - 1, 0, g.roles.splice(i, 1)[0]);
        cambioDeRoles(true);
      });
      const bajar = crear("button", "btn", "↓");
      bajar.type = "button";
      bajar.title = "Bajar";
      bajar.disabled = i === g.roles.length - 1;
      bajar.addEventListener("click", () => {
        g.roles.splice(i + 1, 0, g.roles.splice(i, 1)[0]);
        cambioDeRoles(true);
      });
      const borrar = crear("button", "btn btn-peligro", "🗑");
      borrar.type = "button";
      borrar.title = "Quitar este rol";
      borrar.setAttribute("aria-label", "Quitar el rol " + (r.nombre || ""));
      borrar.addEventListener("click", () => {
        if (!window.confirm("¿Quitar el rol «" + (r.nombre || "sin nombre") + "»? Las semanas ya guardadas no cambian.")) return;
        g.roles.splice(i, 1);
        cambioDeRoles(true);
      });
      acciones.append(subir, bajar, borrar);

      fila.append(boton, campos, acciones);
      el.editorRoles.appendChild(fila);
    });
  }

  function abrirIconos(rol) {
    rolDelIcono = rol;
    const galeria = $("galeria-iconos");
    galeria.innerHTML = "";
    const c = colorDe(rol.color);
    Object.keys(C.iconos).forEach((id) => {
      const b = crear("button");
      b.type = "button";
      b.setAttribute("aria-pressed", String(rol.icono === id));
      const ic = crear("span", "icono");
      ic.style.setProperty("--claro", c.claro);
      ic.innerHTML = svgIcono(id);
      b.append(ic, crear("span", "", C.iconos[id].nombre));
      b.addEventListener("click", () => {
        rolDelIcono.icono = id;
        el.dlgIcono.close();
        cambioDeRoles(true);
      });
      galeria.appendChild(b);
    });
    el.dlgIcono.showModal();
  }

  $("btn-nuevo-rol").addEventListener("click", () => {
    const g = grupo();
    const usados = g.roles.map((r) => r.color);
    const color = (C.colores.find((c) => usados.indexOf(c.id) === -1) || C.colores[g.roles.length % C.colores.length]).id;
    g.roles.push({ id: "r" + Date.now().toString(36), latin: "", nombre: "Nuevo rol", descripcion: "", icono: "estrella", color: color, plazas: 1 });
    cambioDeRoles(true);
    const campos = el.editorRoles.querySelectorAll(".editor-rol input");
    const ultimo = campos[campos.length - 3];
    if (ultimo) {
      ultimo.focus();
      ultimo.select();
    }
  });

  $("btn-restaurar-roles").addEventListener("click", () => {
    if (!window.confirm("¿Volver a los roles de clase de partida? Se perderán los cambios hechos en los roles (el historial se conserva).")) return;
    grupo().roles = copiaRoles();
    cambioDeRoles(true);
  });

  // ---------------- Equilibrio e historial ----------------
  function pintarEquilibrio() {
    const g = grupo();
    const semanas = semanasGuardadas(g);
    const st = estadisticas(g, semanas);
    const nombres = g.alumnos.slice();

    el.tabla.innerHTML = "";
    if (!semanas.length || !nombres.length) {
      el.equilibrioResumen.textContent = "Cuando guardes las primeras semanas, aquí verás cuántas veces ha hecho cada alumno cada rol.";
    } else {
      const totales = elegibles(g).map((a) => st[a].conRol);
      const max = Math.max.apply(null, totales.length ? totales : [0]);
      const min = Math.min.apply(null, totales.length ? totales : [0]);
      el.equilibrioResumen.textContent =
        semanas.length + (semanas.length === 1 ? " semana guardada" : " semanas guardadas") + ". " +
        (max - min <= 1
          ? "El reparto está equilibrado: entre quien más semanas ha tenido rol y quien menos hay como mucho una de diferencia."
          : "Entre quien más semanas ha tenido rol (" + max + ") y quien menos (" + min + ") hay " + (max - min) + " de diferencia: los próximos repartos darán prioridad a quien va por detrás.");

      const thead = crear("thead");
      const trh = crear("tr");
      trh.appendChild(crear("th", "", "Alumno"));
      trh.appendChild(crear("th", "", "Semanas con rol"));
      g.roles.forEach((r) => {
        const th = crear("th");
        const caja = crear("span", "th-rol");
        const ic = crear("span", "icono");
        pintarColor(ic, r);
        ic.innerHTML = svgIcono(r.icono);
        caja.append(ic, crear("span", "", r.nombre));
        th.appendChild(caja);
        trh.appendChild(th);
      });
      trh.appendChild(crear("th", "", "Último rol"));
      thead.appendChild(trh);

      const tbody = crear("tbody");
      const ultimaSemana = semanas[semanas.length - 1];
      nombres.forEach((a) => {
        const s = st[a];
        const tr = crear("tr", g.exentos.indexOf(a) !== -1 ? "fuera" : "");
        tr.appendChild(crear("td", "", a));
        const total = crear("td", "total" + (s.esperado - s.conRol >= 1 ? " bajo" : ""), String(s.conRol));
        total.title = "Le correspondían unas " + s.esperado.toFixed(1);
        tr.appendChild(total);
        g.roles.forEach((r) => {
          const n = s.porRol[r.id] || 0;
          tr.appendChild(crear("td", n ? "" : "cero", String(n)));
        });
        let ultimo = "—";
        for (let i = semanas.length - 1; i >= 0; i--) {
          const rs = rolesDe(g.historial[semanas[i]], a);
          if (rs.length) {
            const nombresRol = rs.map((id) => (g.roles.find((r) => r.id === id) || { nombre: "rol quitado" }).nombre);
            ultimo = nombresRol.join(", ") + (semanas[i] === ultimaSemana ? " (última)" : " · " + fechaDe(semanas[i]).getDate() + " " + MESES[fechaDe(semanas[i]).getMonth()].slice(0, 3));
            break;
          }
        }
        tr.appendChild(crear("td", "", ultimo));
        tbody.appendChild(tr);
      });
      el.tabla.append(thead, tbody);
    }

    el.historialSemanas.innerHTML = "";
    semanas.slice().reverse().forEach((k) => {
      const fila = crear("div", "semana-guardada");
      fila.appendChild(crear("strong", "", textoSemana(k)));
      const ver = crear("button", "btn", "Ver");
      ver.type = "button";
      ver.addEventListener("click", () => {
        semana = k;
        pintarSemana();
        $("semana").scrollIntoView({ behavior: "smooth" });
      });
      const borrar = crear("button", "btn btn-peligro", "Borrar");
      borrar.type = "button";
      borrar.addEventListener("click", () => {
        if (!window.confirm("¿Borrar la " + textoSemana(k).toLowerCase() + " del historial? Dejará de contar para el equilibrio.")) return;
        delete g.historial[k];
        guardar();
        pintarTodo();
      });
      fila.append(ver, borrar);
      el.historialSemanas.appendChild(fila);
    });
    if (!semanas.length) el.historialSemanas.appendChild(crear("p", "ayuda", "Todavía no hay semanas guardadas."));
  }

  $("btn-exportar").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ app: "roles-de-clase", version: 1, datos: cfg }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "roles-de-clase-" + claveDe(new Date()) + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  $("importar-archivo").addEventListener("change", (e) => {
    const archivo = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => {
      try {
        const datos = JSON.parse(lector.result);
        const nuevo = datos && datos.app === "roles-de-clase" ? datos.datos : null;
        if (!nuevo || !Array.isArray(nuevo.grupos) || !nuevo.grupos.length) throw new Error("formato");
        if (!window.confirm("¿Sustituir todas las clases, roles e historial de este equipo por los de la copia?")) return;
        H.guardar(CLAVE, nuevo);
        location.reload();
      } catch (err) {
        window.alert("Ese archivo no es una copia de Roles de clase.");
      }
    };
    lector.readAsText(archivo);
  });

  // ---------------- Paneles ----------------
  H.conmutador($("btn-alumnado"), $("panel-alumnado"));
  H.conmutador($("btn-roles"), $("panel-roles"));
  H.conmutador($("btn-equilibrio"), $("panel-equilibrio"));

  function pintarTodo() {
    pintarGrupos();
    pintarAlumnado();
    pintarEditorRoles();
    pintarRolesResumen();
    pintarSemana();
    pintarEquilibrio();
  }

  pintarTodo();
  // Sin alumnado la primera vez: se abre el panel para rellenarlo.
  if (!grupo().alumnos.length) $("btn-alumnado").click();
})();
