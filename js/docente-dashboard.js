// ============================================================
// Panel docente: clases, alumnos (con clave individual) y control
// de qué contenidos ve cada clase o cada alumno concreto.
// Reutiliza el array NAV (definido como global en js/layout.js)
// para pintar el checklist de contenidos, igual que ya hace el
// generador de exámenes mixtos.
// ============================================================

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { db } from "./firebase-init.js";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function genCode() {
  let code = "";
  for (let i = 0; i < 6; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return code;
}

async function genUniqueCode() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = genCode();
    const snap = await getDoc(doc(db, "students", code));
    if (!snap.exists()) return code;
  }
  throw new Error("No se pudo generar una clave única. Inténtalo de nuevo.");
}

function buildTopicChecklist(container, hiddenSet, onToggle) {
  container.innerHTML = "";
  NAV.forEach((section) => {
    (section.groups || []).forEach((group) => {
      const groupEl = document.createElement("div");
      groupEl.className = "exm-topic-group";
      const title = document.createElement("p");
      title.className = "exm-topic-group-title";
      title.textContent = section.label + (group.label ? " · " + group.label : "");
      groupEl.appendChild(title);

      (group.items || []).forEach((item) => {
        const row = document.createElement("label");
        row.className = "exm-topic-row";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = !hiddenSet.has(item.id);
        checkbox.addEventListener("change", () => onToggle(item.id, checkbox.checked));
        const label = document.createElement("span");
        label.className = "exm-topic-label";
        label.textContent = item.label;
        row.appendChild(checkbox);
        row.appendChild(label);
        groupEl.appendChild(row);
      });
      container.appendChild(groupEl);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  function withAuth(fn) {
    if (window.Auth) return fn();
    document.addEventListener("ar:auth-ready", fn, { once: true });
  }

  withAuth(() => {
    const teacher = window.Auth.loadTeacherSession();
    if (!teacher) {
      window.location.href = "login.html";
      return;
    }

    document.getElementById("teacher-greeting").textContent =
      "Sesión iniciada como " + (teacher.displayName || teacher.email) + ".";

    document.getElementById("logout-btn").addEventListener("click", () => {
      window.Auth.logoutTeacher().then(() => {
        window.location.href = "login.html";
      });
    });

    const classListEl = document.getElementById("class-list");
    const classDetailEl = document.getElementById("class-detail");
    const classDetailTitle = document.getElementById("class-detail-title");
    const studentListEl = document.getElementById("student-list");
    const classTopicListEl = document.getElementById("class-topic-list");

    let currentClass = null;

    async function refreshClasses() {
      const snap = await getDocs(query(collection(db, "classes"), where("teacherId", "==", teacher.uid)));
      classListEl.innerHTML = "";
      if (snap.empty) {
        classListEl.innerHTML = '<p class="content-subtitle">Todavía no tienes ninguna clase creada.</p>';
        return;
      }
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const item = document.createElement("button");
        item.type = "button";
        item.className = "content-list-item class-list-item";
        item.innerHTML = `<div class="content-list-text"><strong>${data.name}</strong></div>`;
        item.addEventListener("click", () => openClass(docSnap.id, data));
        classListEl.appendChild(item);
      });
    }

    async function openClass(classId, data) {
      currentClass = { id: classId, data: data };
      classDetailEl.style.display = "";
      classDetailTitle.textContent = data.name;
      await refreshStudents();
      buildTopicChecklist(classTopicListEl, new Set(data.hiddenTopics || []), async (topicId, visible) => {
        const hidden = new Set(currentClass.data.hiddenTopics || []);
        if (visible) hidden.delete(topicId);
        else hidden.add(topicId);
        currentClass.data.hiddenTopics = Array.from(hidden);
        await updateDoc(doc(db, "classes", classId), { hiddenTopics: currentClass.data.hiddenTopics });
      });
    }

    async function refreshStudents() {
      const snap = await getDocs(query(collection(db, "students"), where("classId", "==", currentClass.id)));
      studentListEl.innerHTML = "";
      if (snap.empty) {
        studentListEl.innerHTML = '<p class="content-subtitle">Todavía no hay alumnos en esta clase.</p>';
        return;
      }
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const code = docSnap.id;
        const row = document.createElement("div");
        row.className = "student-row" + (data.active === false ? " inactive" : "");
        row.innerHTML = `
          <div class="student-row-main">
            <strong>${data.nickname}</strong>
            <span class="student-code">${code}</span>
            ${data.active === false ? '<span class="status-pill status-soon">Desactivado</span>' : ""}
          </div>
          <div class="student-row-actions">
            <button type="button" class="btn btn-secondary" data-action="toggle">${data.active === false ? "Reactivar" : "Desactivar"}</button>
            <button type="button" class="btn btn-secondary" data-action="regen">Nueva clave</button>
            <button type="button" class="btn btn-secondary" data-action="visibility">Contenidos individuales</button>
            <button type="button" class="btn btn-secondary" data-action="delete">Eliminar</button>
          </div>
          <div class="student-visibility-panel" style="display:none;"></div>
        `;

        row.querySelector('[data-action="toggle"]').addEventListener("click", async () => {
          await updateDoc(doc(db, "students", code), { active: data.active === false });
          refreshStudents();
        });

        row.querySelector('[data-action="regen"]').addEventListener("click", async () => {
          if (!window.confirm("Se creará una clave nueva y la anterior dejará de funcionar. ¿Continuar?")) return;
          const newCode = await genUniqueCode();
          const fresh = await getDoc(doc(db, "students", code));
          const freshData = fresh.data();
          await setDoc(doc(db, "students", newCode), freshData);
          await deleteDoc(doc(db, "students", code));
          window.alert("Nueva clave para " + freshData.nickname + ": " + newCode);
          refreshStudents();
        });

        row.querySelector('[data-action="delete"]').addEventListener("click", async () => {
          if (!window.confirm("¿Eliminar a " + data.nickname + " de esta clase? Esta acción no se puede deshacer.")) return;
          await deleteDoc(doc(db, "students", code));
          refreshStudents();
        });

        const visPanel = row.querySelector(".student-visibility-panel");
        row.querySelector('[data-action="visibility"]').addEventListener("click", () => {
          const showing = visPanel.style.display !== "none";
          visPanel.style.display = showing ? "none" : "";
          if (!showing && !visPanel.dataset.built) {
            visPanel.dataset.built = "1";
            buildTopicChecklist(visPanel, new Set(data.hiddenTopics || []), async (topicId, visible) => {
              const hidden = new Set(data.hiddenTopics || []);
              if (visible) hidden.delete(topicId);
              else hidden.add(topicId);
              data.hiddenTopics = Array.from(hidden);
              await updateDoc(doc(db, "students", code), { hiddenTopics: data.hiddenTopics });
            });
          }
        });

        studentListEl.appendChild(row);
      });
    }

    document.getElementById("new-class-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = document.getElementById("new-class-name");
      const name = input.value.trim();
      if (!name) return;
      await addDoc(collection(db, "classes"), {
        teacherId: teacher.uid,
        name: name,
        createdAt: serverTimestamp(),
        hiddenTopics: [],
      });
      input.value = "";
      refreshClasses();
    });

    document.getElementById("new-student-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!currentClass) return;
      const input = document.getElementById("new-student-nickname");
      const nickname = input.value.trim();
      if (!nickname) return;
      const code = await genUniqueCode();
      await setDoc(doc(db, "students", code), {
        teacherId: teacher.uid,
        classId: currentClass.id,
        nickname: nickname,
        active: true,
        authUid: null,
        hiddenTopics: [],
        createdAt: serverTimestamp(),
        lastLoginAt: null,
      });
      input.value = "";
      document.getElementById("new-student-code").textContent =
        "Clave de acceso para " + nickname + ": " + code + " (apúntala, solo se muestra una vez)";
      refreshStudents();
    });

    refreshClasses();
  });
});
