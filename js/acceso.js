// ============================================================
// Acceso a las aplicaciones de Aprende y Repasa que no usan
// js/layout.js (La Ciudadela, Novela Colectiva, Cifras y Letras,
// Chispa y la Fábrica de Robots, El Pórtico de las Tildes).
//
// Va como PRIMER script del <head>. Si en este navegador no hay una
// sesión de alumno (clave), de docente o la vista del alumnado del
// panel, detiene la carga de la página antes de que se ejecute nada de
// la aplicación y en su lugar enseña cómo entrar. Las páginas con
// layout.js hacen lo mismo desde ese archivo (ver paginaBloqueada).
//
// Nivel de seguridad "de aula": se mira la sesión guardada en el
// navegador, igual que el resto de la app para decidir qué se ve.
// ============================================================
(function () {
  function leer(k) {
    try {
      return JSON.parse(localStorage.getItem(k) || "null");
    } catch (e) {
      return null;
    }
  }
  var alumno = leer("ar_estudiante"), docente = leer("ar_docente"), vista = leer("ar_vista_alumno");
  if ((alumno && alumno.code) || (docente && docente.uid) || vista) return;

  // Raíz del sitio a partir de la dirección de este mismo script.
  var src = (document.currentScript && document.currentScript.src) || "";
  var raiz = src.replace(/js\/acceso\.js(\?.*)?$/, "");
  // Página a la que volver tras entrar con la clave (carpeta/archivo.html,
  // que es lo único que acepta alumno-login.html).
  var partes = location.pathname.split("/").filter(Boolean);
  var volver = partes.slice(-2).join("/");
  var tras = /^[a-z0-9-]+\/[a-z0-9-]+\.html$/.test(volver) ? "?volver=" + encodeURIComponent(volver) : "";

  try {
    window.stop();
  } catch (e) {
    // Navegador antiguo: se sustituye igualmente el contenido.
  }
  document.documentElement.innerHTML =
    '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    "<title>Entra para continuar · Aprende y Repasa</title>" +
    "<style>" +
    "body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f4f5fb;color:#1f2433;" +
    "font-family:Inter,system-ui,-apple-system,'Segoe UI',sans-serif;padding:16px;box-sizing:border-box}" +
    ".caja{background:#fff;border-radius:18px;box-shadow:0 10px 30px rgba(20,30,70,.12);padding:28px 24px;max-width:520px;width:100%;text-align:center}" +
    "h1{font-size:1.5rem;margin:.2em 0 .4em}p{line-height:1.5;color:#4a5068;margin:0 0 1.2em}" +
    ".botones{display:flex;flex-direction:column;gap:10px}" +
    "a{display:block;padding:12px 16px;border-radius:12px;text-decoration:none;font-weight:700}" +
    ".uno{background:#4338ca;color:#fff}.dos{background:#ecebfd;color:#4338ca}.tres{color:#4a5068}" +
    "a:focus-visible{outline:3px solid #f59e0b;outline-offset:2px}" +
    "</style></head>" +
    '<body><main class="caja">' +
    '<div style="font-size:3rem" aria-hidden="true">🔒</div>' +
    "<h1>Entra para continuar</h1>" +
    "<p>Esta aplicación de Aprende y Repasa solo se abre con tu clave de alumno o alumna, o con la cuenta de docente.</p>" +
    '<div class="botones">' +
    '<a class="uno" href="' + raiz + "alumno-login.html" + tras + '">Entrar con mi clave</a>' +
    '<a class="dos" href="' + raiz + 'docente/login.html">Soy docente</a>' +
    '<a class="tres" href="' + raiz + 'index.html">← Volver al inicio</a>' +
    "</div></main></body>";
})();
