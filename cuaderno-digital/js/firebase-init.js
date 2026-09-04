// ============================================================
// Cuaderno Digital — acceso a Firebase.
//
// No creamos una app de Firebase nueva: reutilizamos la que ya
// inicializa ../js/firebase-init.js, la misma de todo "Aprende y
// Repasa". La sesión de docente (../js/auth.js) también es la misma:
// quien ya tiene cuenta de "Panel docente" entra aquí con ella, sin
// darse de alta otra vez.
// ============================================================

export { app, db, auth } from "../../js/firebase-init.js";
