// ============================================================
// Página alumno-login.html: un único campo para introducir la
// clave individual que le dio su docente. Al validarla, queda
// guardada en este dispositivo (no hace falta volver a teclearla
// cada vez, como en un Chromebook de aula) hasta que el alumno
// cierre sesión explícitamente.
// ============================================================

function withAuth(fn) {
  if (window.Auth) return fn();
  document.addEventListener("ar:auth-ready", fn, { once: true });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("student-login-form");
  const errorEl = document.getElementById("student-login-error");
  const infoEl = document.getElementById("current-student-info");

  withAuth(() => {
    const existing = window.Auth.loadStudentSession();
    if (existing) {
      infoEl.textContent = "Ya has entrado como " + existing.nickname + ". Si quieres volver al modo normal, borra los datos del sitio en el navegador.";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.textContent = "";
    const code = document.getElementById("student-code").value;
    withAuth(() => {
      window.Auth.claimStudentCode(code)
        .then((profile) => {
          window.location.href = "index.html?bienvenido=" + encodeURIComponent(profile.nickname);
        })
        .catch((err) => {
          errorEl.textContent = err.message || "No se ha podido entrar con esa clave.";
        });
    });
  });
});
