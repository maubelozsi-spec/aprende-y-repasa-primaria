// ============================================================
// Barra lateral de navegación, generada a partir de un único
// listado de contenidos (evita repetir el menú en cada página).
// Cada página define antes de cargar este script:
//   window.BASE_PATH    -> "" en la raíz, "../" dentro de una subcarpeta
//   window.CURRENT_PAGE -> id de la página activa (ver NAV más abajo)
// ============================================================

const NAV = [
  {
    id: "lengua",
    label: "Lengua",
    href: "lengua/index.html",
    color: "indigo",
    children: [
      { id: "ortografia", label: "Ortografía", href: "lengua/ortografia.html", available: true },
      { id: "sintactico", label: "Análisis sintáctico", href: "lengua/sintactico.html", available: true },
      { id: "morfologico", label: "Análisis morfológico", href: "lengua/morfologico.html", available: true },
      { id: "sinonimos-antonimos", label: "Sinónimos y antónimos", href: "lengua/sinonimos-antonimos.html", available: true },
      { id: "sustantivo-pronombre", label: "El sustantivo y el pronombre", href: "lengua/sustantivo-pronombre.html", available: true },
      { id: "adjetivo", label: "El adjetivo", href: "lengua/adjetivo.html", available: true },
      { id: "determinantes", label: "Los determinantes", href: "lengua/determinantes.html", available: true },
    ],
  },
  {
    id: "matematicas",
    label: "Matemáticas",
    href: "matematicas/index.html",
    color: "teal",
    children: [
      { id: "sumas", label: "Sumas", href: "matematicas/sumas.html", available: true },
      { id: "restas", label: "Restas", href: "matematicas/restas.html", available: true },
      { id: "tablas", label: "Tablas de multiplicar", href: "matematicas/tablas.html", available: true },
      { id: "multiplicaciones", label: "Multiplicaciones", href: "matematicas/multiplicaciones.html", available: true },
      { id: "divisiones", label: "Divisiones", href: "matematicas/divisiones.html", available: true },
    ],
  },
];

function buildSidebar(base, current) {
  let html = `
    <div class="sidebar-header">
      <a href="${base}index.html" class="sidebar-brand">
        <span class="sidebar-brand-mark">AR</span>
        <span class="sidebar-brand-text">Aprende y Repasa<small>5º y 6º de Primaria</small></span>
      </a>
    </div>
    <nav class="sidebar-nav">
  `;

  NAV.forEach((section) => {
    html += `<div class="nav-section" style="--section-color: var(--color-${section.color}); --section-tint: var(--color-${section.color}-tint);">`;
    html += `<a href="${base}${section.href}" class="nav-section-label">${section.label}</a>`;

    if (section.children.length) {
      html += `<ul class="nav-children">`;
      section.children.forEach((child) => {
        if (child.available) {
          const activeClass = child.id === current ? " active" : "";
          html += `<li><a href="${base}${child.href}" class="${activeClass.trim()}">${child.label}</a></li>`;
        } else {
          html += `<li><span class="nav-item-disabled"><span>${child.label}</span><span class="nav-item-tag">Pronto</span></span></li>`;
        }
      });
      html += `</ul>`;
    } else {
      html += `<ul class="nav-children"><li><span class="nav-item-disabled"><span>Sin contenidos todavía</span><span class="nav-item-tag">Pronto</span></span></li></ul>`;
    }

    html += `</div>`;
  });

  html += `</nav>`;
  return html;
}

function initLayout() {
  const base = typeof window.BASE_PATH === "string" ? window.BASE_PATH : "";
  const current = typeof window.CURRENT_PAGE === "string" ? window.CURRENT_PAGE : "";

  const sidebarEl = document.getElementById("sidebar");
  if (sidebarEl) sidebarEl.innerHTML = buildSidebar(base, current);

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
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLayout);
} else {
  initLayout();
}
