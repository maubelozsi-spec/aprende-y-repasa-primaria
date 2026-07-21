// ============================================================
// Barra lateral de navegación, generada a partir de un único
// listado de contenidos (evita repetir el menú en cada página).
// Cada página define antes de cargar este script:
//   window.BASE_PATH    -> "" en la raíz, "../" dentro de una subcarpeta
//   window.CURRENT_PAGE -> id de la página activa (ver NAV más abajo)
//
// Cada asignatura se organiza en "groups" (subcategorías temáticas)
// para que, con tantos contenidos, sea más fácil localizar uno en
// concreto en vez de tener que recorrer una lista larga y plana.
// ============================================================

const NAV = [
  {
    id: "lengua",
    label: "Lengua",
    href: "lengua/index.html",
    color: "indigo",
    groups: [
      {
        label: "Ortografía y acentuación",
        items: [
          { id: "ortografia", label: "Acentuación", href: "lengua/ortografia.html", available: true },
          { id: "ortografia-hgjxs", label: "Ortografía: la h, g/j y x/s", href: "lengua/ortografia-hgjxs.html", available: true },
          { id: "tilde-diacritica", label: "Tilde diacrítica", href: "lengua/tilde-diacritica.html", available: true },
          { id: "loismo-laismo-leismo", label: "Loísmo, laísmo y leísmo", href: "lengua/loismo-laismo-leismo.html", available: true },
          { id: "signos-puntuacion", label: "Los signos de puntuación", href: "lengua/signos-puntuacion.html", available: true },
          { id: "siglas-abreviaturas", label: "Siglas y abreviaturas", href: "lengua/siglas-abreviaturas.html", available: true },
          { id: "errores-comunes", label: "Errores ortográficos comunes", href: "lengua/errores-comunes.html", available: true },
        ],
      },
      {
        label: "Gramática",
        items: [
          { id: "morfologico", label: "Análisis morfológico", href: "lengua/morfologico.html", available: true },
          { id: "sintactico", label: "Análisis sintáctico", href: "lengua/sintactico.html", available: true },
          { id: "sintagmas", label: "Los sintagmas", href: "lengua/sintagmas.html", available: true },
          { id: "sustantivo-pronombre", label: "El sustantivo y el pronombre", href: "lengua/sustantivo-pronombre.html", available: true },
          { id: "adjetivo", label: "El adjetivo", href: "lengua/adjetivo.html", available: true },
          { id: "determinantes", label: "Los determinantes", href: "lengua/determinantes.html", available: true },
          { id: "verbo", label: "El verbo", href: "lengua/verbo.html", available: true },
          { id: "adverbio-preposicion-conjuncion", label: "Adverbio, preposición y conjunción", href: "lengua/adverbio-preposicion-conjuncion.html", available: true },
          { id: "formacion-palabras", label: "Formación de palabras", href: "lengua/formacion-palabras.html", available: true },
        ],
      },
      {
        label: "Vocabulario y lengua",
        items: [
          { id: "sinonimos-antonimos", label: "Sinónimos y antónimos", href: "lengua/sinonimos-antonimos.html", available: true },
          { id: "lenguaje-figurado", label: "Lenguaje literal y figurado", href: "lengua/lenguaje-figurado.html", available: true },
          { id: "prestamos-tabu-eufemismos", label: "Préstamos, palabras tabú y eufemismos", href: "lengua/prestamos-tabu-eufemismos.html", available: true },
          { id: "lenguas-espana", label: "Las lenguas de España", href: "lengua/lenguas-espana.html", available: true },
        ],
      },
      {
        label: "Textos y literatura",
        items: [
          { id: "comunicacion-textos", label: "Comunicación y tipos de texto", href: "lengua/comunicacion-textos.html", available: true },
          { id: "textos-instructivos", label: "Los textos instructivos", href: "lengua/textos-instructivos.html", available: true },
          { id: "tipos-texto-6", label: "Textos científicos, históricos, descriptivos y discontinuos", href: "lengua/tipos-texto-6.html", available: true },
          { id: "dialogo-debate-argumentativo", label: "El diálogo, el debate y el texto argumentativo", href: "lengua/dialogo-debate-argumentativo.html", available: true },
          { id: "texto-teatral", label: "El texto teatral", href: "lengua/texto-teatral.html", available: true },
          { id: "narrativa", label: "Narrativa", href: "lengua/narrativa.html", available: true },
          { id: "poesia", label: "Poesía y recursos literarios", href: "lengua/poesia.html", available: true },
          { id: "texto-predictivo", label: "El texto predictivo", href: "lengua/texto-predictivo.html", available: true },
          { id: "tipos-enunciado", label: "Tipos de enunciado e interjecciones", href: "lengua/tipos-enunciado.html", available: true },
          { id: "tira-comica", label: "La tira cómica", href: "lengua/tira-comica.html", available: true },
        ],
      },
      {
        label: "Herramientas",
        items: [
          { id: "generador-dictados", label: "Generador de dictados", href: "lengua/generador-dictados.html", available: true },
          { id: "lectura-comprension", label: "Lectura comprensiva", href: "lengua/lectura-comprension.html", available: true },
          { id: "generador-udi", label: "Generador de Unidad Didáctica", href: "lengua/generador-udi.html", available: true },
        ],
      },
    ],
  },
  {
    id: "matematicas",
    label: "Matemáticas",
    href: "matematicas/index.html",
    color: "teal",
    groups: [
      {
        label: "Números y operaciones básicas",
        items: [
          { id: "sumas", label: "Sumas", href: "matematicas/sumas.html", available: true },
          { id: "restas", label: "Restas", href: "matematicas/restas.html", available: true },
          { id: "tablas", label: "Tablas de multiplicar", href: "matematicas/tablas.html", available: true },
          { id: "multiplicaciones", label: "Multiplicaciones", href: "matematicas/multiplicaciones.html", available: true },
          { id: "divisiones", label: "Divisiones", href: "matematicas/divisiones.html", available: true },
          { id: "numeros-grandes", label: "Números grandes y aproximación", href: "matematicas/numeros-grandes.html", available: true },
          { id: "operaciones-combinadas", label: "Operaciones combinadas", href: "matematicas/operaciones-combinadas.html", available: true },
          { id: "propiedades-operaciones", label: "Propiedades de las operaciones", href: "matematicas/propiedades-operaciones.html", available: true },
          { id: "numeros-romanos", label: "Números romanos", href: "matematicas/numeros-romanos.html", available: true },
          { id: "calculo-mental", label: "Cálculo mental", href: "matematicas/calculo-mental.html", available: true },
        ],
      },
      {
        label: "Números especiales",
        items: [
          { id: "potencias", label: "Las potencias", href: "matematicas/potencias.html", available: true },
          { id: "numeros-enteros", label: "Números enteros", href: "matematicas/numeros-enteros.html", available: true },
          { id: "multiplos-divisores", label: "Múltiplos, divisores y números primos", href: "matematicas/multiplos-divisores.html", available: true },
        ],
      },
      {
        label: "Fracciones, decimales y porcentajes",
        items: [
          { id: "fracciones", label: "Fracciones y número mixto", href: "matematicas/fracciones.html", available: true },
          { id: "operaciones-fracciones", label: "Operaciones con fracciones", href: "matematicas/operaciones-fracciones.html", available: true },
          { id: "decimales", label: "Números decimales", href: "matematicas/decimales.html", available: true },
          { id: "decimales-md", label: "Multiplicación y división de decimales", href: "matematicas/decimales-md.html", available: true },
          { id: "porcentajes", label: "Porcentajes", href: "matematicas/porcentajes.html", available: true },
        ],
      },
      {
        label: "Geometría y medidas",
        items: [
          { id: "angulos", label: "Ángulos", href: "matematicas/angulos.html", available: true },
          { id: "coordenadas", label: "Coordenadas, simetrías, traslaciones y giros", href: "matematicas/coordenadas.html", available: true },
          { id: "areas", label: "Área de figuras planas y polígonos", href: "matematicas/areas.html", available: true },
          { id: "circunferencia", label: "Circunferencia y círculo", href: "matematicas/circunferencia.html", available: true },
          { id: "cuerpos-geometricos", label: "Cuerpos geométricos y su desarrollo", href: "matematicas/cuerpos-geometricos.html", available: true },
          { id: "medidas", label: "Medidas: longitud, capacidad, masa y superficie", href: "matematicas/medidas.html", available: true },
          { id: "tiempo", label: "El tiempo", href: "matematicas/tiempo.html", available: true },
        ],
      },
      {
        label: "Proporcionalidad y estadística",
        items: [
          { id: "proporcionalidad", label: "Proporcionalidad y escalas", href: "matematicas/proporcionalidad.html", available: true },
          { id: "estadistica", label: "Estadística: diagramas de barras, moda y media", href: "matematicas/estadistica.html", available: true },
          { id: "probabilidad", label: "Sucesos y probabilidad", href: "matematicas/probabilidad.html", available: true },
        ],
      },
      {
        label: "Herramientas",
        items: [
          { id: "generador-fichas", label: "Generador de fichas de problemas", href: "matematicas/generador-fichas.html", available: true },
          { id: "generador-operaciones", label: "Generador de operaciones básicas", href: "matematicas/generador-operaciones.html", available: true },
          { id: "examen-mixto", label: "Generador de exámenes mixtos", href: "matematicas/examen-mixto.html", available: true },
          { id: "generador-udi", label: "Generador de Unidad Didáctica", href: "lengua/generador-udi.html", available: true },
        ],
      },
    ],
  },
];

function getStudentSessionCache() {
  try {
    const raw = localStorage.getItem("ar_estudiante");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function buildSidebar(base, current) {
  const student = getStudentSessionCache();
  let html = `
    <div class="sidebar-header">
      <a href="${base}index.html" class="sidebar-brand">
        <span class="sidebar-brand-mark">AR</span>
        <span class="sidebar-brand-text">Aprende y Repasa<small>5º y 6º de Primaria</small></span>
      </a>
    </div>
    ${
      student
        ? `<div class="sidebar-student-badge">👤 ${student.nickname} · <a href="#" id="sidebar-student-logout">Salir</a></div>`
        : ""
    }
    <a href="${base}mi-progreso.html" class="sidebar-progress-link${current === "mi-progreso" ? " active" : ""}">Mi progreso</a>`;
  html += `
    <div class="sidebar-search-wrap">
      <input type="search" id="sidebar-search" class="sidebar-search" placeholder="Buscar un contenido..." autocomplete="off">
      <span class="sidebar-search-empty" id="sidebar-search-empty" style="display:none;">Sin resultados</span>
    </div>
    <nav class="sidebar-nav" id="sidebar-nav">
  `;

  NAV.forEach((section) => {
    html += `<div class="nav-section" style="--section-color: var(--color-${section.color}); --section-tint: var(--color-${section.color}-tint);">`;
    html += `<a href="${base}${section.href}" class="nav-section-label">${section.label}</a>`;
    html += `<div class="nav-section-body">`;

    if (section.groups && section.groups.length) {
      section.groups.forEach((group) => {
        html += `<div class="nav-group">`;
        if (group.label) html += `<span class="nav-group-label">${group.label}</span>`;
        html += `<ul class="nav-children">`;
        group.items.forEach((child) => {
          if (!window.__navFilter(child.id)) return;
          if (child.available) {
            const activeClass = child.id === current ? " active" : "";
            html += `<li><a href="${base}${child.href}" class="${activeClass.trim()}">${child.label}</a></li>`;
          } else {
            html += `<li><span class="nav-item-disabled"><span>${child.label}</span><span class="nav-item-tag">Pronto</span></span></li>`;
          }
        });
        html += `</ul></div>`;
      });
    } else {
      html += `<ul class="nav-children"><li><span class="nav-item-disabled"><span>Sin contenidos todavía</span><span class="nav-item-tag">Pronto</span></span></li></ul>`;
    }

    html += `</div></div>`;
  });

  html += `</nav>`;
  return html;
}

function initLayout() {
  const base = typeof window.BASE_PATH === "string" ? window.BASE_PATH : "";
  const current = typeof window.CURRENT_PAGE === "string" ? window.CURRENT_PAGE : "";

  if (current && !window.__navFilter(current)) {
    window.location.replace(base + "index.html");
    return;
  }

  const sidebarEl = document.getElementById("sidebar");
  if (sidebarEl) sidebarEl.innerHTML = buildSidebar(base, current);

  loadScriptOnce(base + "js/gamification.js");
  registerServiceWorker(base);
  ensureManifestLink(base);

  // Firebase (docente/alumno) solo se carga si hay una sesión de
  // alumno activa en este dispositivo — para el modo anónimo/local
  // de siempre, la página no pesa ni un byte más de lo que pesa hoy.
  if (getStudentSessionCache()) {
    loadScriptOnce(base + "js/firebase-config.js");
    loadModuleOnce(base + "js/firebase-init.js");
    loadModuleOnce(base + "js/auth.js");
    loadModuleOnce(base + "js/cloud-sync.js");
  }

  const logoutLink = document.getElementById("sidebar-student-logout");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      try {
        localStorage.removeItem("ar_estudiante");
        localStorage.removeItem("ar_visibilidad");
      } catch (err) {
        // localStorage no disponible.
      }
      window.location.href = base + "index.html";
    });
  }

  const menuBtn = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");

  if (menuBtn && sidebar && backdrop) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.add("open");
      backdrop.classList.add("show");
    });
    backdrop.addEventListener("click", () => {
      sidebar.classList.remove("open");
      backdrop.classList.remove("show");
    });
    sidebar.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        sidebar.classList.remove("open");
        backdrop.classList.remove("show");
      });
    });
  }

  const activeLink = sidebar ? sidebar.querySelector(".nav-children a.active") : null;
  if (activeLink) activeLink.scrollIntoView({ block: "center" });

  initSidebarSearch();
}

function normalizeSearchText(str) {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function initSidebarSearch() {
  const input = document.getElementById("sidebar-search");
  const emptyMsg = document.getElementById("sidebar-search-empty");
  const sidebarNav = document.getElementById("sidebar-nav");
  if (!input || !sidebarNav) return;

  input.addEventListener("input", () => {
    const query = normalizeSearchText(input.value);
    let anyVisible = false;

    sidebarNav.querySelectorAll(".nav-section").forEach((section) => {
      let sectionHasMatch = false;

      section.querySelectorAll(".nav-group").forEach((group) => {
        let groupHasMatch = false;

        group.querySelectorAll(".nav-children li").forEach((li) => {
          const text = normalizeSearchText(li.textContent);
          const match = query === "" || text.includes(query);
          li.style.display = match ? "" : "none";
          if (match) groupHasMatch = true;
        });

        group.style.display = groupHasMatch ? "" : "none";
        if (groupHasMatch) sectionHasMatch = true;
      });

      section.style.display = sectionHasMatch ? "" : "none";
      if (sectionHasMatch) anyVisible = true;
    });

    emptyMsg.style.display = query !== "" && !anyVisible ? "" : "none";
  });
}

// ============================================================
// Visibilidad de contenido controlada por el docente. Sin un
// perfil de alumno activo (comportamiento por defecto, sin
// cambios), todo es visible. Con un perfil activo, js/auth.js
// cachea aquí (tras sincronizar con Firestore) la lista fusionada
// de temas ocultos para ese alumno (clase + override individual).
// ============================================================

const VISIBILITY_STORAGE_KEY = "ar_visibilidad";

function getHiddenTopics() {
  try {
    const raw = localStorage.getItem(VISIBILITY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

window.__navFilter = function (topicId) {
  return getHiddenTopics().indexOf(topicId) === -1;
};

// ============================================================
// Seguimiento de progreso: cada juego de práctica llama a
// AppProgress.record(temaId, esCorrecto) al comprobar una
// respuesta. Se guarda en localStorage y lo lee la página
// "Mi progreso" (matematicas/mi-progreso.html y lengua/... se
// enlazan a la misma página en la raíz: mi-progreso.html).
//
// Además, cada llamada dispara un evento "ar:answer" (lo escuchan
// js/gamification.js y, más adelante, js/cloud-sync.js) y, si la
// respuesta fue un fallo, guarda una foto de lo que había en
// pantalla para el repaso espaciado de errores (AppReview).
// ============================================================

const PROGRESS_STORAGE_KEY = "ar_progreso";
const REVIEW_STORAGE_KEY = "ar_repaso";

function loadProgressData() {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveProgressData(data) {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // localStorage no disponible: el progreso no se podrá guardar.
  }
}

function loadReviewData() {
  try {
    const raw = localStorage.getItem(REVIEW_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveReviewData(data) {
  try {
    localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // localStorage no disponible.
  }
}

function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

// Aproximación deliberadamente ligera: en vez de reconstruir la
// pregunta exacta (lo que exigiría tocar los ~55 archivos de tema
// para que pasen sus datos internos), guardamos una foto del texto
// visible en pantalla en el momento del fallo. Sirve para una lista
// de repaso legible, no para volver a generar la pregunta idéntica.
function captureAnswerSnapshot() {
  const el = document.querySelector(
    ".sentence-display, .word-display, .division-problem, .instructions, .game-card"
  );
  if (!el) return "";
  return el.textContent.replace(/\s+/g, " ").trim().slice(0, 300);
}

const AppReview = {
  recordMiss(topicId, snapshotText) {
    if (!snapshotText) return;
    const data = loadReviewData();
    if (!data[topicId]) data[topicId] = {};
    const bucket = data[topicId];
    const key = simpleHash(snapshotText);
    const now = Date.now();
    if (bucket[key]) {
      bucket[key].wrongCount++;
      bucket[key].lastWrongAt = now;
      bucket[key].intervalDays = 1;
      bucket[key].nextReviewAt = now;
      bucket[key].resolved = false;
    } else {
      const keys = Object.keys(bucket);
      if (keys.length >= 40) {
        let oldestKey = keys[0];
        keys.forEach((k) => {
          if (bucket[k].lastWrongAt < bucket[oldestKey].lastWrongAt) oldestKey = k;
        });
        delete bucket[oldestKey];
      }
      bucket[key] = {
        snapshot: snapshotText,
        wrongCount: 1,
        lastWrongAt: now,
        intervalDays: 1,
        nextReviewAt: now,
        resolved: false,
      };
    }
    saveReviewData(data);
  },
  // Repetición espaciada tipo SM-2 simplificado: acertar dobla el
  // intervalo (hasta 30 días, momento en que se da por resuelto);
  // fallar lo resetea a "toca repasar ya".
  markReviewed(topicId, key, gotItRight) {
    const data = loadReviewData();
    const item = data[topicId] && data[topicId][key];
    if (!item) return;
    if (gotItRight) {
      item.intervalDays = Math.min((item.intervalDays || 1) * 2, 30);
      item.nextReviewAt = Date.now() + item.intervalDays * 24 * 60 * 60 * 1000;
      if (item.intervalDays >= 30) item.resolved = true;
    } else {
      item.wrongCount++;
      item.intervalDays = 1;
      item.nextReviewAt = Date.now();
    }
    saveReviewData(data);
  },
  getDue() {
    const data = loadReviewData();
    const now = Date.now();
    const due = [];
    Object.keys(data).forEach((topicId) => {
      Object.keys(data[topicId]).forEach((key) => {
        const item = data[topicId][key];
        if (!item.resolved && item.nextReviewAt <= now) {
          due.push(Object.assign({ topicId: topicId, key: key }, item));
        }
      });
    });
    due.sort((a, b) => a.lastWrongAt - b.lastWrongAt);
    return due;
  },
  getAll() {
    return loadReviewData();
  },
  reset() {
    saveReviewData({});
  },
};

const AppProgress = {
  record(topicId, isCorrect) {
    const data = loadProgressData();
    if (!data[topicId]) data[topicId] = { aciertos: 0, fallos: 0, ultima: null };
    if (isCorrect) data[topicId].aciertos++;
    else data[topicId].fallos++;
    data[topicId].ultima = new Date().toISOString();
    saveProgressData(data);

    if (!isCorrect) AppReview.recordMiss(topicId, captureAnswerSnapshot());

    document.dispatchEvent(new CustomEvent("ar:answer", { detail: { topicId: topicId, isCorrect: isCorrect, ts: Date.now() } }));
  },
  getAll() {
    return loadProgressData();
  },
  getTopic(topicId) {
    const data = loadProgressData();
    return data[topicId] || { aciertos: 0, fallos: 0, ultima: null };
  },
  reset() {
    saveProgressData({});
  },
};

// ============================================================
// Selector unificado de dificultades: reutilizable en las páginas
// de práctica y en la ficha. Cada juego define su propia lógica de
// adaptación por tipo; esta función solo rellena el <select>,
// aplica el color del tipo elegido y expone el valor actual.
// ============================================================

const DIFFICULTY_TYPES = [
  { id: "none", label: "Sin adaptación" },
  { id: "acs", label: "ACS · 2 cursos de retraso" },
  { id: "dislexia", label: "Dislexia" },
  { id: "tdah", label: "TDAH" },
  { id: "discalculia", label: "Discalculia" },
  { id: "altas", label: "Altas capacidades" },
  { id: "disgrafia", label: "Disgrafía" },
];

function initDifficultySelector(selectId, onChange) {
  const select = document.getElementById(selectId);
  if (!select) return { get: () => "none", is: () => false };

  if (!select.options.length) {
    DIFFICULTY_TYPES.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.label;
      select.appendChild(opt);
    });
  }

  const wrap = select.closest(".difficulty-selector");

  function applyColorClass() {
    if (!wrap) return;
    DIFFICULTY_TYPES.forEach((t) => wrap.classList.remove("type-" + t.id));
    wrap.classList.add("type-" + select.value);
  }

  select.addEventListener("change", () => {
    if (select.value === "dislexia") ensureDyslexiaFontLoaded();
    applyColorClass();
    onChange(select.value);
  });

  applyColorClass();

  return {
    get: () => select.value,
    is: (type) => select.value === type,
  };
}

function renderDifficultyBox(boxId, value, explanations) {
  const box = document.getElementById(boxId);
  if (!box) return;
  DIFFICULTY_TYPES.forEach((t) => box.classList.remove("type-" + t.id));
  const info = explanations[value];
  if (!info) {
    box.classList.remove("show");
    return;
  }
  box.classList.add("type-" + value, "show");
  box.innerHTML = `
    <span class="difficulty-badge">${info.badge}</span>
    <h3>${info.title}</h3>
    <p>${info.text}</p>
    <div class="difficulty-example">${info.example}</div>
  `;
}

// ============================================================
// Accesibilidad: fuente de lectura fácil y tamaño del texto,
// disponibles en todas las páginas mediante un botón flotante.
// Las preferencias se guardan en localStorage.
// ============================================================

const A11Y_STORAGE_KEY = "ar_accesibilidad";

function loadA11yPrefs() {
  try {
    const raw = localStorage.getItem(A11Y_STORAGE_KEY);
    if (!raw) return { dyslexia: false, fontSize: "normal" };
    const parsed = JSON.parse(raw);
    return {
      dyslexia: !!parsed.dyslexia,
      fontSize: ["normal", "large", "xlarge"].includes(parsed.fontSize) ? parsed.fontSize : "normal",
    };
  } catch (e) {
    return { dyslexia: false, fontSize: "normal" };
  }
}

function saveA11yPrefs(prefs) {
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    // localStorage no disponible: los ajustes solo durarán la sesión actual.
  }
}

function applyA11yPrefs(prefs) {
  const html = document.documentElement;
  html.classList.toggle("a11y-dyslexia", prefs.dyslexia);
  html.classList.remove("a11y-size-large", "a11y-size-xlarge");
  if (prefs.fontSize === "large") html.classList.add("a11y-size-large");
  if (prefs.fontSize === "xlarge") html.classList.add("a11y-size-xlarge");
}

function ensureDyslexiaFontLoaded() {
  if (document.getElementById("a11y-font-link")) return;
  const link = document.createElement("link");
  link.id = "a11y-font-link";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700;800&display=swap";
  document.head.appendChild(link);
}

// Se aplica cuanto antes (sin esperar a DOMContentLoaded) para evitar parpadeos.
const a11yPrefs = loadA11yPrefs();
applyA11yPrefs(a11yPrefs);
if (a11yPrefs.dyslexia) ensureDyslexiaFontLoaded();

function buildA11yWidget() {
  if (document.querySelector(".a11y-widget")) return;

  const wrap = document.createElement("div");
  wrap.className = "a11y-widget";
  wrap.innerHTML = `
    <div class="a11y-panel" id="a11y-panel">
      <p class="a11y-panel-title">Accesibilidad</p>
      <label class="a11y-row">
        <span>Fuente de lectura fácil</span>
        <input type="checkbox" id="a11y-dyslexia-toggle">
      </label>
      <p class="a11y-row-label">Tamaño del texto</p>
      <div class="a11y-size-row">
        <button type="button" class="a11y-size-btn" data-size="normal">A</button>
        <button type="button" class="a11y-size-btn" data-size="large">A+</button>
        <button type="button" class="a11y-size-btn" data-size="xlarge">A++</button>
      </div>
    </div>
    <button type="button" class="a11y-fab" id="a11y-fab" aria-label="Opciones de accesibilidad" title="Accesibilidad">Aa</button>
  `;
  document.body.appendChild(wrap);

  const fab = wrap.querySelector("#a11y-fab");
  const panel = wrap.querySelector("#a11y-panel");
  const dyslexiaToggle = wrap.querySelector("#a11y-dyslexia-toggle");
  const sizeBtns = wrap.querySelectorAll(".a11y-size-btn");

  dyslexiaToggle.checked = a11yPrefs.dyslexia;
  sizeBtns.forEach((btn) => btn.classList.toggle("active", btn.dataset.size === a11yPrefs.fontSize));

  fab.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) panel.classList.remove("show");
  });

  dyslexiaToggle.addEventListener("change", () => {
    a11yPrefs.dyslexia = dyslexiaToggle.checked;
    if (a11yPrefs.dyslexia) ensureDyslexiaFontLoaded();
    applyA11yPrefs(a11yPrefs);
    saveA11yPrefs(a11yPrefs);
  });

  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      a11yPrefs.fontSize = btn.dataset.size;
      sizeBtns.forEach((b) => b.classList.toggle("active", b === btn));
      applyA11yPrefs(a11yPrefs);
      saveA11yPrefs(a11yPrefs);
    });
  });
}

// ============================================================
// Carga diferida de scripts auxiliares (gamificación) y PWA
// (manifest + service worker), inyectados desde aquí para no tener
// que añadir etiquetas <script>/<link> nuevas en cada página HTML.
// ============================================================

function loadScriptOnce(src) {
  if (document.querySelector('script[data-ar-inject="' + src + '"]')) return;
  const s = document.createElement("script");
  s.src = src;
  s.async = false;
  s.dataset.arInject = src;
  document.head.appendChild(s);
}

function loadModuleOnce(src) {
  if (document.querySelector('script[data-ar-inject="' + src + '"]')) return;
  const s = document.createElement("script");
  s.type = "module";
  s.src = src;
  s.dataset.arInject = src;
  document.head.appendChild(s);
}

function ensureManifestLink(base) {
  if (document.querySelector('link[rel="manifest"]')) return;
  const link = document.createElement("link");
  link.rel = "manifest";
  link.href = base + "manifest.json";
  document.head.appendChild(link);
  const themeColor = document.createElement("meta");
  themeColor.name = "theme-color";
  themeColor.content = "#4338ca";
  document.head.appendChild(themeColor);
}

function registerServiceWorker(base) {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register(base + "sw.js").catch(() => {
    // Si falla (por ejemplo abierto como file://), la app sigue
    // funcionando igual, simplemente sin caché offline.
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLayout);
  document.addEventListener("DOMContentLoaded", buildA11yWidget);
} else {
  initLayout();
  buildA11yWidget();
}
