// ============================================================
// Sincronización con Firestore para alumnos con sesión activa:
// - Agrega aciertos/fallos por tema y hace UNA escritura cada 10
//   respuestas o 15s (nunca una escritura por respuesta), para no
//   agotar la cuota gratuita de Firestore en uso real de aula.
// - Mantiene localStorage["ar_visibilidad"] sincronizado en vivo
//   con los temas que el docente ha ocultado (clase ∪ individual),
//   para que js/layout.js pueda seguir leyéndolo de forma síncrona
//   sin depender de la red en cada carga de página.
//
// Si no hay sesión de alumno activa (modo anónimo/local, el caso
// de hoy), este módulo no hace nada.
// ============================================================

import {
  doc,
  setDoc,
  onSnapshot,
  increment,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { db } from "./firebase-init.js";

const VISIBILITY_STORAGE_KEY = "ar_visibilidad";
const FLUSH_INTERVAL_MS = 15000;
const FLUSH_EVERY_N = 10;

let pendingByTopic = {};
let pendingCount = 0;
let flushTimer = null;
let classHiddenCache = [];

function todayKey() {
  const d = new Date();
  return d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
}

function updateVisibilityCache(studentHidden) {
  const merged = Array.from(new Set([...(classHiddenCache || []), ...(studentHidden || [])]));
  try {
    localStorage.setItem(VISIBILITY_STORAGE_KEY, JSON.stringify(merged));
  } catch (e) {
    // localStorage no disponible.
  }
}

function flushPending(studentCode) {
  const topics = Object.keys(pendingByTopic);
  if (!topics.length) return;
  const batch = pendingByTopic;
  pendingByTopic = {};
  pendingCount = 0;
  const dateKey = todayKey();

  topics.forEach((topicId) => {
    const delta = batch[topicId];
    const statId = topicId + "_" + dateKey;
    setDoc(
      doc(db, "students", studentCode, "dailyStats", statId),
      {
        topicId: topicId,
        date: dateKey,
        aciertos: increment(delta.aciertos),
        fallos: increment(delta.fallos),
        lastAnswerAt: serverTimestamp(),
      },
      { merge: true }
    ).catch(() => {
      // Sin conexión: Firestore la encola en IndexedDB y la reintenta
      // solo al volver la red (caché persistente, ver firebase-init.js).
    });
  });
}

function scheduleFlush(studentCode) {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushPending(studentCode);
  }, FLUSH_INTERVAL_MS);
}

function initCloudSync() {
  const session = window.Auth && window.Auth.loadStudentSession();
  if (!session) return;

  if (session.classId) {
    onSnapshot(doc(db, "classes", session.classId), (snap) => {
      const data = snap.data() || {};
      classHiddenCache = Array.isArray(data.hiddenTopics) ? data.hiddenTopics : [];
      updateVisibilityCache(window.__studentHiddenCache || []);
    });
  }

  onSnapshot(doc(db, "students", session.code), (snap) => {
    const data = snap.data() || {};
    window.__studentHiddenCache = Array.isArray(data.hiddenTopics) ? data.hiddenTopics : [];
    updateVisibilityCache(window.__studentHiddenCache);
  });

  document.addEventListener("ar:answer", (e) => {
    const detail = e.detail || {};
    if (!detail.topicId) return;
    if (!pendingByTopic[detail.topicId]) pendingByTopic[detail.topicId] = { aciertos: 0, fallos: 0 };
    if (detail.isCorrect) pendingByTopic[detail.topicId].aciertos++;
    else pendingByTopic[detail.topicId].fallos++;
    pendingCount++;

    if (pendingCount >= FLUSH_EVERY_N) {
      if (flushTimer) {
        clearTimeout(flushTimer);
        flushTimer = null;
      }
      flushPending(session.code);
    } else {
      scheduleFlush(session.code);
    }
  });

  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushPending(session.code);
  });
  window.addEventListener("pagehide", () => flushPending(session.code));
}

initCloudSync();
