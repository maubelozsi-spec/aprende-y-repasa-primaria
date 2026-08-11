// ============================================================
// Inicialización de Firebase para Cifras y Letras (SDK modular
// v10 vía CDN, sin build). Es el mismo proyecto Firebase que el
// resto de la web: la configuración viene de ../js/firebase-config.js
// (cargado con <script> clásico antes que estos módulos).
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const app = initializeApp(window.FIREBASE_CONFIG);

// Sin caché persistente: es un juego en tiempo real, queremos ver
// siempre el estado vivo de la partida, no una copia guardada.
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
