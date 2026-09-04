// ============================================================
// Cuaderno Digital — subida y lectura de archivos (imágenes y
// páginas de PDF convertidas a imagen) en Firebase Storage.
//
// Cada docente tiene su propia carpeta "cuadernoDigital/{uid}/...";
// las reglas de storage.rules (raíz del proyecto) impiden que nadie
// más la lea o escriba. Requiere haber activado Storage en la
// consola de Firebase (ver storage.rules para los pasos).
// ============================================================

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
import { app, auth } from "./firebase-init.js";

const storage = getStorage(app);

function carpetaDocente() {
  if (!auth.currentUser) throw new Error("Sesión no iniciada.");
  return `cuadernoDigital/${auth.currentUser.uid}`;
}

// Sube un Blob/File y devuelve la ruta de Storage (no la URL: la URL
// se pide aparte con obtenerUrl, así podemos volver a pedirla si
// caduca algo o cambia la sesión).
async function subirArchivo(blob, nombreArchivo) {
  const ruta = `${carpetaDocente()}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${nombreArchivo}`;
  const referencia = ref(storage, ruta);
  await uploadBytes(referencia, blob);
  return ruta;
}

async function obtenerUrl(ruta) {
  return getDownloadURL(ref(storage, ruta));
}

async function borrarArchivo(ruta) {
  try {
    await deleteObject(ref(storage, ruta));
  } catch (e) {
    // Si ya no existe (por ejemplo, borrado en otro dispositivo) no
    // pasa nada: el objetivo (que no quede el archivo) ya se cumple.
  }
}

export { subirArchivo, obtenerUrl, borrarArchivo };
