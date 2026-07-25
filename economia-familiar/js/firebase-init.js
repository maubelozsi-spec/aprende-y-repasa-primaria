// ============================================================
// Economía Familiar 2.0 — inicialización de Firebase.
// Reutiliza la configuración global del proyecto (window.FIREBASE_CONFIG,
// cargada por cada página desde ../js/firebase-config.js): misma base
// de datos que Aprende y Repasa, colecciones con prefijo "eco".
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const app = initializeApp(window.FIREBASE_CONFIG);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentSingleTabManager({}) }),
});

const auth = getAuth(app);

export { app, db, auth };
