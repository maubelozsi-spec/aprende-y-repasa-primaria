// ============================================================
// Novela Colectiva — acceso a Firebase.
//
// No creamos una app de Firebase nueva: reutilizamos la que ya
// inicializa ../js/firebase-init.js, que es la misma de todo
// "Aprende y Repasa". Así las claves de alumno, las clases y el
// panel docente que ya existen valen tal cual, y no hay dos
// instancias de Firestore peleándose por la caché del navegador.
//
// Esa instancia usa caché persistente: si se cae el wifi del aula,
// lo escrito se guarda en el dispositivo y sube solo al volver.
// ============================================================

export { app, db, auth } from "../../js/firebase-init.js";
