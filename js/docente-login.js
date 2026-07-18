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

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

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
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    withAuth(() => {
      window.Auth.signUpTeacher(email, password, name)
        .then(() => {
          window.location.href = "dashboard.html";
        })
        .catch((err) => {
          signupError.textContent = friendlyError(err);
        });
    });
  });

  withAuth(() => {
    const existing = window.Auth.loadTeacherSession();
    if (existing) window.location.href = "dashboard.html";
  });
});
