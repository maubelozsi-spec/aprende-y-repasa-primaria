// ============================================================
// Registro de actividad del docente: por cada alumno de sus
// clases, muestra sus últimos inicios de sesión y su actividad
// diaria por tema (aciertos/fallos), leídos de las subcolecciones
// students/{code}/logins y students/{code}/dailyStats.
// ============================================================

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { db } from "./firebase-init.js";

function findTopicLabel(topicId) {
  for (const section of NAV) {
    for (const group of section.groups || []) {
      for (const item of group.items || []) {
        if (item.id === topicId) return item.label;
      }
    }
  }
  return topicId;
}

function formatTs(ts) {
  if (!ts || !ts.toDate) return "—";
  const d = ts.toDate();
  return d.toLocaleString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatDateKey(dateKey) {
  if (!dateKey || dateKey.length !== 8) return dateKey;
  return dateKey.slice(6, 8) + "/" + dateKey.slice(4, 6) + "/" + dateKey.slice(0, 4);
}

async function loadClassNames(teacherUid) {
  const snap = await getDocs(query(collection(db, "classes"), where("teacherId", "==", teacherUid)));
  const names = {};
  snap.forEach((d) => (names[d.id] = d.data().name));
  return names;
}

async function renderStudentActivity(container, code, data, classNames) {
  const card = document.createElement("div");
  card.className = "game-card generator-card activity-card";

  const loginsSnap = await getDocs(
    query(collection(db, "students", code, "logins"), orderBy("ts", "desc"), limit(5))
  );
  const statsSnap = await getDocs(
    query(collection(db, "students", code, "dailyStats"), orderBy("date", "desc"), limit(30))
  );

  const loginsHtml = loginsSnap.empty
    ? "<p class=\"content-subtitle\">Todavía no ha iniciado sesión.</p>"
    : Array.from(loginsSnap.docs)
        .map((d) => "<li>" + formatTs(d.data().ts) + "</li>")
        .join("");

  const statsHtml = statsSnap.empty
    ? "<p class=\"content-subtitle\">Sin actividad registrada todavía.</p>"
    : Array.from(statsSnap.docs)
        .map((d) => {
          const s = d.data();
          return (
            "<div class=\"review-item\"><div class=\"review-item-meta\">" +
            formatDateKey(s.date) +
            " · " +
            findTopicLabel(s.topicId) +
            "</div><div class=\"review-item-text\">" +
            (s.aciertos || 0) +
            " aciertos · " +
            (s.fallos || 0) +
            " fallos</div></div>"
          );
        })
        .join("");

  card.innerHTML =
    "<h2>" +
    data.nickname +
    " <span class=\"content-subtitle\">(" +
    (classNames[data.classId] || "clase") +
    ")</span></h2>" +
    "<h3>Últimos inicios de sesión</h3><ul class=\"activity-login-list\">" +
    loginsHtml +
    "</ul>" +
    "<h3>Actividad reciente</h3>" +
    statsHtml;

  container.appendChild(card);
}

document.addEventListener("DOMContentLoaded", () => {
  function withAuth(fn) {
    if (window.Auth) return fn();
    document.addEventListener("ar:auth-ready", fn, { once: true });
  }

  withAuth(async () => {
    const teacher = window.Auth.loadTeacherSession();
    if (!teacher) {
      window.location.href = "login.html";
      return;
    }

    const listEl = document.getElementById("activity-list");
    const classNames = await loadClassNames(teacher.uid);
    const studentsSnap = await getDocs(query(collection(db, "students"), where("teacherId", "==", teacher.uid)));

    if (studentsSnap.empty) {
      listEl.innerHTML = '<div class="empty-state"><h2>Todavía no tienes alumnos</h2><p>Crea una clase y añade alumnos desde el panel docente.</p></div>';
      return;
    }

    for (const docSnap of studentsSnap.docs) {
      await renderStudentActivity(listEl, docSnap.id, docSnap.data(), classNames);
    }
  });
});
