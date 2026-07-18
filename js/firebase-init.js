// ============================================================
// Inicialización de Firebase (SDK modular v10, vía CDN, sin build).
// Exporta `db` y `auth` para que el resto de módulos (auth.js,
// cloud-sync.js, docente-*.js) los importen directamente.
//
// Usa caché local persistente de Firestore: las escrituras hechas
// sin conexión se guardan en IndexedDB y se sincronizan solas en
// cuanto vuelve la red (ver nota de offline en sw.js/manifest.json).
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
