// ============================================================
// Configuración de Firebase — ÚNICO archivo que hay que rellenar
// a mano para activar el sistema de docente/alumno. Sin esto, el
// resto de la app (explicaciones, juegos, fichas, progreso local,
// gamificación, repaso y PWA) funciona exactamente igual que hoy.
//
// Pasos:
// 1. Ve a https://console.firebase.google.com y crea un proyecto
//    gratuito (plan "Spark").
// 2. En el proyecto, activa "Firestore Database" (modo producción)
//    y, en "Authentication" → "Sign-in method", activa los
//    proveedores "Correo electrónico/contraseña" y "Anónimo".
// 3. En "Configuración del proyecto" → "Tus apps", crea una app
//    web y copia el objeto de configuración que te da la consola
//    aquí abajo, sustituyendo los valores de ejemplo.
// 4. En Firestore → "Reglas", pega el contenido de firestore.rules
//    (en la raíz del proyecto) y publícalo.
// ============================================================

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyDxkzYG90wxhhFoPDFwiS6fGvxocFe-L88",
  authDomain: "aprende-y-repasa-cc321.firebaseapp.com",
  projectId: "aprende-y-repasa-cc321",
  storageBucket: "aprende-y-repasa-cc321.firebasestorage.app",
  messagingSenderId: "523916990805",
  appId: "1:523916990805:web:2acde66d67f5e53262b7dc",
  measurementId: "G-3LC0C1HWQG",
};
