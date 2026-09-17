// ============================================================
// Página docente/login.html: pestañas "Iniciar sesión" / "Crear
// cuenta". Usa window.Auth (definido en js/auth.js, módulo ES) —
// espera al evento "ar:auth-ready" si aún no se ha cargado.
// ============================================================

function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = {
    login: document.getElementById("tab-login"),
    signup: document.getElementById("tab-signup"),
  };
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.toggle("active", b === btn));
      Object.entries(panels).forEach(([key, el]) => el.classList.toggle("active", key === btn.dataset.tab));
    });
  });
}

// Botón "Ver / Ocultar" de cada contraseña. Una errata al crear la
// cuenta no se ve hasta el día siguiente, cuando ya no se puede
// entrar, y en el teclado del móvil o de una tablet de aula se falla
// más de lo que parece.
//
// Se cambia el TIPO del campo (password <-> text), no se sustituye el
// campo: así no se pierde lo escrito, ni el autocompletado del
// navegador, ni el minlength del formulario.
function initVerContrasena() {
  document.querySelectorAll("[data-password-toggle]").forEach((btn) => {
    const campo = document.getElementById(btn.dataset.passwordToggle);
    if (!campo) return;

    btn.addEventListener("click", () => {
      const estabaVisible = campo.type === "text";
      // Cambiar el tipo manda el cursor al final en algunos
      // navegadores: se guarda dónde estaba y se devuelve, para poder
      // corregir una letra de en medio sin volver a colocarse.
      const posicion = campo.selectionStart;

      campo.type = estabaVisible ? "password" : "text";
      btn.textContent = estabaVisible ? "Ver" : "Ocultar";
      btn.setAttribute("aria-pressed", estabaVisible ? "false" : "true");
      btn.setAttribute("aria-label", estabaVisible ? "Mostrar la contraseña" : "Ocultar la contraseña");

      campo.focus();
      try {
        campo.setSelectionRange(posicion, posicion);
      } catch (e) {
        // Algún navegador no deja mover el cursor en este tipo de
        // campo: se queda donde lo ponga él, que no rompe nada.
      }
    });
  });
}

function withAuth(fn) {
  if (window.Auth) return fn();
  document.addEventListener("ar:auth-ready", fn, { once: true });
}

function friendlyError(err) {
  const code = err && err.code;
  const map = {
    "auth/email-already-in-use": "Ya existe una cuenta con ese correo. Inicia sesión en su lugar.",
    "auth/invalid-email": "Ese correo no parece válido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/wrong-password": "Correo o contraseña incorrectos.",
    "auth/user-not-found": "No existe ninguna cuenta con ese correo.",
  };
  return (code && map[code]) || (err && err.message) || "Ha ocurrido un error. Inténtalo de nuevo.";
}

// Al volver de la vista del alumnado no se pide el correo otra vez:
// ya se sabe quién estaba dentro, así que se rellena y el foco va a la
// contraseña. La contraseña SÍ se pide, y no es un adorno: al entrar
// en la vista previa se cerró la sesión de verdad (Firebase incluido),
// de modo que desde esa pantalla nadie —tampoco un alumno que
// escribiera la dirección del panel— puede volver sin saberla.
function prepararVueltaDeVistaPrevia() {
  // Se lee localStorage directamente en vez de esperar a window.Auth:
  // ese módulo necesita descargar Firebase, y si la red del centro va
  // lenta o lo bloquea, el aviso y el correo no aparecerían nunca.
  // Para escribir la contraseña no hace falta Firebase; solo para
  // comprobarla al enviar el formulario.
  let preview = null;
  try {
    const raw = localStorage.getItem("ar_vista_alumno");
    preview = raw ? JSON.parse(raw) : null;
  } catch (e) {
    preview = null;
  }
  if (!preview) return;

  const aviso = document.getElementById("volver-aviso");
  const texto = document.getElementById("volver-texto");
  if (aviso && texto) {
    texto.textContent =
      "Estabas viendo la app como " +
      (preview.nombre || "tu alumnado") +
      ". Escribe tu contraseña para volver al panel.";
    aviso.style.display = "";
  }

  const emailEl = document.getElementById("login-email");
  const passEl = document.getElementById("login-password");
  if (emailEl && preview.teacherEmail) emailEl.value = preview.teacherEmail;
  if (passEl) passEl.focus();
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initVerContrasena();

  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    loginError.textContent = "";
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    withAuth(() => {
      window.Auth.loginTeacher(email, password)
        .then(() => {
          window.location.href = "dashboard.html";
        })
        .catch((err) => {
          loginError.textContent = friendlyError(err);
        });
    });
  });

  const signupForm = document.getElementById("signup-form");
  const signupError = document.getElementById("signup-error");
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    signupError.textContent = "";
    const passcode = document.getElementById("signup-passcode").value;
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    withAuth(() => {
      window.Auth.signUpTeacher(email, password, name, passcode)
        .then(() => {
          window.location.href = "dashboard.html";
        })
        .catch((err) => {
          signupError.textContent = friendlyError(err);
        });
    });
  });

  prepararVueltaDeVistaPrevia();

  withAuth(() => {
    const existing = window.Auth.loadTeacherSession();
    if (existing) window.location.href = "dashboard.html";
  });
});
