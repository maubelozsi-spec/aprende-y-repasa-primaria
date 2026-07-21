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

// ---------------- Progreso del alumnado ----------------

function etiquetaDeTema(topicId) {
  for (const section of NAV) {
    for (const group of section.groups || []) {
      for (const item of group.items || []) {
        if (item.id === topicId) return item.label;
      }
    }
  }
  return topicId;
}

function formatearFechaHora(ts) {
  if (!ts || !ts.toDate) return "Nunca";
  return ts.toDate().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function porcentaje(aciertos, fallos) {
  const total = aciertos + fallos;
  return total ? Math.round((aciertos / total) * 100) : null;
}

// Suma los dailyStats de un alumno (una fila por tema y día) para
// obtener su total y el desglose por contenido.
async function estadisticasDeAlumno(code) {
  const snap = await getDocs(collection(db, "students", code, "dailyStats"));
  const porTema = {};
  let aciertos = 0;
  let fallos = 0;
  snap.forEach((d) => {
    const s = d.data();
    if (!s.topicId) return;
    if (!porTema[s.topicId]) porTema[s.topicId] = { aciertos: 0, fallos: 0 };
    porTema[s.topicId].aciertos += s.aciertos || 0;
    porTema[s.topicId].fallos += s.fallos || 0;
    aciertos += s.aciertos || 0;
    fallos += s.fallos || 0;
  });
  return { porTema, aciertos, fallos };
}

// Desglose por contenido, con lo peor primero: es lo que interesa para
// decidir qué reforzar.
function pintarProgresoPorTema(container, stats) {
  const temas = Object.keys(stats.porTema);
  if (!temas.length) {
    container.innerHTML = '<p class="content-subtitle">Este alumno todavía no ha practicado nada.</p>';
    return;
  }

  temas.sort((a, b) => {
    const pa = porcentaje(stats.porTema[a].aciertos, stats.porTema[a].fallos);
    const pb = porcentaje(stats.porTema[b].aciertos, stats.porTema[b].fallos);
    return pa - pb;
  });

  container.innerHTML =
    '<div class="progreso-temas">' +
    temas
      .map((id) => {
        const t = stats.porTema[id];
        const pct = porcentaje(t.aciertos, t.fallos);
        const nivel = pct >= 75 ? "bien" : pct >= 50 ? "regular" : "flojo";
        return (
          '<div class="progreso-tema ' + nivel + '">' +
          '<span class="progreso-tema-nombre">' + etiquetaDeTema(id) + "</span>" +
          '<span class="progreso-tema-datos">' + t.aciertos + " aciertos · " + t.fallos + " fallos</span>" +
          '<span class="progreso-tema-pct">' + pct + "%</span>" +
          "</div>"
        );
      })
      .join("") +
    "</div>";
}

// Construye la lista de contenidos con una casilla por tema. Devuelve
// un pequeño controlador para poder filtrar por texto y marcar o
// desmarcar todo de golpe (con ~65 contenidos, hacerlo a mano cansa).
function buildTopicChecklist(container, hiddenSet, onToggle) {
  container.innerHTML = "";
  const filas = [];

  NAV.forEach((section) => {
    (section.groups || []).forEach((group) => {
      const groupEl = document.createElement("div");
      groupEl.className = "exm-topic-group";
      const title = document.createElement("p");
      title.className = "exm-topic-group-title";
      title.textContent = section.label + (group.label ? " · " + group.label : "");
      groupEl.appendChild(title);

      let visiblesEnGrupo = 0;
      (group.items || []).forEach((item) => {
        // Las herramientas del profesorado nunca las ve el alumnado,
        // así que no tiene sentido ofrecerlas aquí como conmutables.
        if (item.soloDocente) return;
        visiblesEnGrupo++;
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
        filas.push({ row: row, groupEl: groupEl, checkbox: checkbox, id: item.id, texto: item.label.toLowerCase() });
      });

      if (visiblesEnGrupo) container.appendChild(groupEl);
    });
  });

  return {
    filtrar: function (texto) {
      const q = (texto || "").trim().toLowerCase();
      const gruposConResultados = new Set();
      filas.forEach((f) => {
        const coincide = !q || f.texto.indexOf(q) !== -1;
        f.row.style.display = coincide ? "" : "none";
        if (coincide) gruposConResultados.add(f.groupEl);
      });
      // Oculta también el título de los grupos que se quedan sin nada.
      const grupos = new Set(filas.map((f) => f.groupEl));
      grupos.forEach((g) => {
        g.style.display = !q || gruposConResultados.has(g) ? "" : "none";
      });
    },
    marcarTodo: function (visible) {
      filas.forEach((f) => {
        // Solo afecta a lo que se está viendo tras el filtro.
        if (f.row.style.display === "none") return;
        if (f.checkbox.checked === visible) return;
        f.checkbox.checked = visible;
        onToggle(f.id, visible);
      });
    },
  };
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
    const classPlaceholderEl = document.getElementById("class-placeholder");
    const classSummaryEl = document.getElementById("class-summary");
    const topicSearchEl = document.getElementById("class-topic-search");

    let currentClass = null;
    let classTopicCtrl = null;

    if (topicSearchEl) {
      topicSearchEl.addEventListener("input", () => {
        if (classTopicCtrl) classTopicCtrl.filtrar(topicSearchEl.value);
      });
    }
    const btnTodo = document.getElementById("class-topic-all");
    const btnNada = document.getElementById("class-topic-none");
    if (btnTodo) btnTodo.addEventListener("click", () => classTopicCtrl && classTopicCtrl.marcarTodo(true));
    if (btnNada) btnNada.addEventListener("click", () => classTopicCtrl && classTopicCtrl.marcarTodo(false));

    async function refreshClasses() {
      const snap = await getDocs(query(collection(db, "classes"), where("teacherId", "==", teacher.uid)));
      classListEl.innerHTML = "";
      if (snap.empty) {
        classListEl.innerHTML = '<p class="content-subtitle">Todavía no tienes ninguna clase creada. Crea una aquí abajo para poder elegir qué contenidos ve tu alumnado.</p>';
        classPlaceholderEl.style.display = "";
        classDetailEl.style.display = "none";
        return;
      }

      const primeras = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const fila = document.createElement("div");
        fila.className = "class-row";
        fila.dataset.classId = docSnap.id;

        const abrir = document.createElement("button");
        abrir.type = "button";
        abrir.className = "content-list-item class-list-item";
        abrir.innerHTML = `<div class="content-list-text"><strong>${data.name}</strong></div>`;
        abrir.addEventListener("click", () => openClass(docSnap.id, data));

        const acciones = document.createElement("div");
        acciones.className = "class-row-actions";

        const btnNombre = document.createElement("button");
        btnNombre.type = "button";
        btnNombre.className = "btn btn-secondary";
        btnNombre.textContent = "Cambiar nombre";
        btnNombre.addEventListener("click", () => renombrarClase(docSnap.id, data));

        const btnBorrar = document.createElement("button");
        btnBorrar.type = "button";
        btnBorrar.className = "btn btn-secondary";
        btnBorrar.textContent = "Eliminar";
        btnBorrar.addEventListener("click", () => eliminarClase(docSnap.id, data));

        acciones.appendChild(btnNombre);
        acciones.appendChild(btnBorrar);
        fila.appendChild(abrir);
        fila.appendChild(acciones);
        classListEl.appendChild(fila);
        primeras.push({ id: docSnap.id, data: data });
      });

      // Abre automáticamente la clase que ya estaba seleccionada (o la
      // primera): así el panel de contenidos se ve sin tener que
      // descubrir que hay que pulsar la clase.
      const previa = currentClass && primeras.find((c) => c.id === currentClass.id);
      const aAbrir = previa || primeras[0];
      if (aAbrir) await openClass(aAbrir.id, aAbrir.data);
    }

    function marcarClaseActiva(classId) {
      classListEl.querySelectorAll(".class-row").forEach((fila) => {
        const activa = fila.dataset.classId === classId;
        const boton = fila.querySelector(".class-list-item");
        if (boton) boton.classList.toggle("active", activa);
      });
    }

    async function alumnosDeLaClase(classId) {
      // Las reglas solo permiten listar filtrando por teacherId.
      const snap = await getDocs(query(collection(db, "students"), where("teacherId", "==", teacher.uid)));
      const lista = [];
      snap.forEach((d) => {
        if (d.data().classId === classId) lista.push(d);
      });
      return lista;
    }

    async function renombrarClase(classId, data) {
      const nuevo = window.prompt("Nuevo nombre para la clase:", data.name);
      if (nuevo === null) return;
      const nombre = nuevo.trim();
      if (!nombre || nombre === data.name) return;
      try {
        await updateDoc(doc(db, "classes", classId), { name: nombre });
        data.name = nombre;
        if (currentClass && currentClass.id === classId) {
          currentClass.data.name = nombre;
          classDetailTitle.textContent = nombre;
        }
        await refreshClasses();
      } catch (err) {
        window.alert("No se ha podido cambiar el nombre: " + err.message);
      }
    }

    async function eliminarClase(classId, data) {
      let alumnos;
      try {
        alumnos = await alumnosDeLaClase(classId);
      } catch (err) {
        window.alert("No se ha podido comprobar si la clase tiene alumnos: " + err.message);
        return;
      }

      // Al borrar la clase hay que borrar también a sus alumnos: si no,
      // quedarían en una clase inexistente, invisibles en el panel pero
      // con su clave todavía activa. Por eso se avisa de cuántos son.
      const aviso = alumnos.length
        ? 'Se va a eliminar la clase "' + data.name + '" y sus ' + alumnos.length +
          " alumno(s), con sus claves de acceso y su progreso.\n\nEsta acción NO se puede deshacer. ¿Continuar?"
        : 'Se va a eliminar la clase "' + data.name + '" (no tiene alumnos).\n\n¿Continuar?';
      if (!window.confirm(aviso)) return;

      if (alumnos.length && !window.confirm("Confirma otra vez: se borrarán " + alumnos.length + " alumno(s) de forma permanente.")) return;

      try {
        for (const alumno of alumnos) await deleteDoc(doc(db, "students", alumno.id));
        await deleteDoc(doc(db, "classes", classId));
        if (currentClass && currentClass.id === classId) {
          currentClass = null;
          classDetailEl.style.display = "none";
          classPlaceholderEl.style.display = "";
        }
        await refreshClasses();
      } catch (err) {
        window.alert("No se ha podido eliminar la clase: " + err.message);
      }
    }

    async function openClass(classId, data) {
      currentClass = { id: classId, data: data };
      classPlaceholderEl.style.display = "none";
      classDetailEl.style.display = "";
      classDetailTitle.textContent = data.name;
      marcarClaseActiva(classId);

      // La lista de contenidos se pinta ANTES de tocar la red: no
      // depende de Firestore, así que un fallo al cargar los alumnos
      // ya no puede dejarla en blanco (era el motivo de que no se
      // viera ninguna casilla).
      classTopicCtrl = buildTopicChecklist(classTopicListEl, new Set(data.hiddenTopics || []), async (topicId, visible) => {
        const hidden = new Set(currentClass.data.hiddenTopics || []);
        if (visible) hidden.delete(topicId);
        else hidden.add(topicId);
        currentClass.data.hiddenTopics = Array.from(hidden);
        try {
          await updateDoc(doc(db, "classes", classId), { hiddenTopics: currentClass.data.hiddenTopics });
        } catch (err) {
          window.alert("No se ha podido guardar el cambio: " + err.message);
        }
      });
      if (topicSearchEl) topicSearchEl.value = "";

      try {
        await refreshStudents();
      } catch (err) {
        studentListEl.innerHTML =
          '<p class="content-subtitle">No se ha podido cargar la lista de alumnos: ' + err.message + "</p>";
      }
    }

    async function renderClassSummary(alumnos) {
      if (!classSummaryEl) return;
      classSummaryEl.innerHTML = '<p class="content-subtitle">Cargando actividad de la clase...</p>';

      const filas = [];
      for (const docSnap of alumnos) {
        const data = docSnap.data();
        let stats = { aciertos: 0, fallos: 0, porTema: {} };
        try {
          stats = await estadisticasDeAlumno(docSnap.id);
        } catch (e) {
          // Si un alumno falla, el resto del resumen se sigue mostrando.
        }
        filas.push({
          nombre: data.nickname,
          ultimo: formatearFechaHora(data.lastLoginAt),
          conectado: !!data.lastLoginAt,
          temas: Object.keys(stats.porTema).length,
          aciertos: stats.aciertos,
          fallos: stats.fallos,
          pct: porcentaje(stats.aciertos, stats.fallos),
        });
      }

      const sinConectar = filas.filter((f) => !f.conectado).length;
      classSummaryEl.innerHTML =
        '<table class="class-summary-table"><thead><tr>' +
        "<th>Alumno</th><th>Última conexión</th><th>Contenidos</th><th>Aciertos</th><th>Fallos</th><th>% acierto</th>" +
        "</tr></thead><tbody>" +
        filas
          .map(
            (f) =>
              "<tr>" +
              "<td><strong>" + f.nombre + "</strong></td>" +
              "<td>" + f.ultimo + "</td>" +
              "<td>" + (f.temas || "—") + "</td>" +
              '<td class="ok">' + f.aciertos + "</td>" +
              '<td class="ko">' + f.fallos + "</td>" +
              "<td>" + (f.pct === null ? "—" : f.pct + "%") + "</td>" +
              "</tr>"
          )
          .join("") +
        "</tbody></table>" +
        (sinConectar
          ? '<p class="content-subtitle">' + sinConectar + " alumno(s) todavía no han entrado con su clave.</p>"
          : "");
    }

    async function refreshStudents() {
      // Importante: las reglas de Firestore solo permiten listar alumnos
      // filtrando por teacherId. Si se consulta por classId, la consulta
      // entera se rechaza. Por eso se pide por docente y se filtra la
      // clase aquí (son pocos alumnos).
      const snap = await getDocs(query(collection(db, "students"), where("teacherId", "==", teacher.uid)));
      const deLaClase = [];
      snap.forEach((docSnap) => {
        if (docSnap.data().classId === currentClass.id) deLaClase.push(docSnap);
      });

      studentListEl.innerHTML = "";
      if (!deLaClase.length) {
        studentListEl.innerHTML = '<p class="content-subtitle">Todavía no hay alumnos en esta clase.</p>';
        if (classSummaryEl) classSummaryEl.innerHTML = '<p class="content-subtitle">Añade alumnos para ver aquí su actividad.</p>';
        return;
      }

      // El resumen se carga aparte y sin bloquear: la lista de alumnos
      // aparece enseguida y las cifras se rellenan en cuanto llegan.
      renderClassSummary(deLaClase);
      deLaClase.forEach((docSnap) => {
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
            <button type="button" class="btn btn-secondary" data-action="progreso">Ver progreso</button>
            <button type="button" class="btn btn-secondary" data-action="toggle">${data.active === false ? "Reactivar" : "Desactivar"}</button>
            <button type="button" class="btn btn-secondary" data-action="regen">Nueva clave</button>
            <button type="button" class="btn btn-secondary" data-action="visibility">Contenidos individuales</button>
            <button type="button" class="btn btn-secondary" data-action="delete">Eliminar</button>
          </div>
          <div class="student-progress-panel" style="display:none;"></div>
          <div class="student-visibility-panel" style="display:none;"></div>
        `;

        const progPanel = row.querySelector(".student-progress-panel");
        row.querySelector('[data-action="progreso"]').addEventListener("click", async () => {
          const abierto = progPanel.style.display !== "none";
          progPanel.style.display = abierto ? "none" : "";
          if (abierto || progPanel.dataset.cargado) return;
          progPanel.innerHTML = '<p class="content-subtitle">Cargando progreso...</p>';
          try {
            const stats = await estadisticasDeAlumno(code);
            pintarProgresoPorTema(progPanel, stats);
            progPanel.dataset.cargado = "1";
          } catch (err) {
            progPanel.innerHTML = '<p class="content-subtitle">No se ha podido cargar el progreso: ' + err.message + "</p>";
          }
        });

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

    refreshClasses().catch((err) => {
      classListEl.innerHTML =
        '<p class="content-subtitle">No se han podido cargar tus clases: ' + err.message + "</p>";
    });
  });
});
