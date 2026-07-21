// ============================================================
// Interfaz genérica del Generador de Unidad Didáctica: recorre las
// fases definidas en el UDI activo (Plan → Fichas → Adaptaciones →
// Evaluación → Compilación), con botones "Generar" por documento y
// "Aprobar y continuar" para desbloquear la fase siguiente.
//
// Cada bloque/UDI se define en un fichero js/udi-*.js que se registra
// en window.UDI_REGISTRY. La página muestra un selector con todos los
// bloques disponibles; el bloque activo se elige con ?udi=<id>.
//
// Cada documento indica su "motor": lengua-ficha / mate-ficha /
// lengua-examen / mate-examen / udi-doc-builder. Así una misma UI
// sirve para Lengua y Matemáticas sin cambios: añadir un bloque nuevo
// es escribir un fichero de datos, no tocar esta interfaz.
// ============================================================

const UDI_PHASE_IDS = ["plan", "fichas", "adaptaciones", "evaluacion", "compilacion"];
const UDI_PHASE_LABELS = {
  plan: "Plan",
  fichas: "Fichas",
  adaptaciones: "Adaptaciones",
  evaluacion: "Evaluación",
  compilacion: "Compilación",
};

function udiDifficultyLabel(id) {
  const found = DIFFICULTY_TYPES.find((d) => d.id === id);
  return found ? found.label : id;
}

// ---------------- Despacho por motor (Lengua / Matemáticas) ----------------

function udiGenerarFicha(doc, curso, dificultad, options) {
  const fn = doc.motor === "mate-ficha" ? window.generarFichaMateYSoluciones : window.generarFichaLenguaYSoluciones;
  return fn(doc.topicId, curso, doc.count, dificultad, options || {});
}

function udiGenerarExamen(doc, curso, dificultad, options) {
  const fn = doc.motor === "mate-examen" ? window.generarExamenMixtoMateYSoluciones : window.generarExamenMixtoLenguaYSoluciones;
  return fn(doc.topics, curso, dificultad, options || {});
}

function udiPreviewProblem(doc, dificultad) {
  if (doc.motor === "mate-ficha") {
    const topic = TOPICS.find((t) => t.id === doc.topicId);
    const [p] = generarProblemas(topic, "5", 1, dificultad);
    return { enunciado: p.enunciado, respuesta: p.solucion };
  }
  const topic = LENGUA_FICHA_CONFIG[doc.topicId];
  const [p] = lenguaPickProblems(topic, dificultad, 1);
  return { enunciado: p.enunciado, respuesta: p.respuesta };
}

document.addEventListener("DOMContentLoaded", () => {
  const registry = window.UDI_REGISTRY || {};
  const ids = Object.keys(registry);
  const params = new URLSearchParams(window.location.search);
  const udiId = params.get("udi") && registry[params.get("udi")] ? params.get("udi") : ids[0];
  const udi = registry[udiId];

  renderPicker(registry, udiId);
  if (!udi) return;

  document.getElementById("udi-titulo").textContent = udi.titulo;
  document.getElementById("udi-resumen").textContent = `${udi.bloque} · ${udi.curso}º de Primaria — ${udi.resumen}`;

  let currentPhase = 0;
  let maxUnlocked = 0;

  renderSteps();
  renderPlan();
  renderFichas();
  renderAdaptaciones();
  renderEvaluacion();
  renderCompilacion();
  showPhase(0);

  document.querySelectorAll("[data-approve]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = UDI_PHASE_IDS.indexOf(btn.dataset.approve);
      maxUnlocked = Math.max(maxUnlocked, idx + 1);
      showPhase(idx + 1);
    });
  });

  function renderPicker(registry, activeId) {
    const sel = document.getElementById("udi-picker");
    if (!sel) return;
    sel.innerHTML = "";
    Object.values(registry).forEach((u) => {
      const opt = document.createElement("option");
      opt.value = u.id;
      opt.textContent = `${u.area || "Lengua"} · ${u.titulo}`;
      if (u.id === activeId) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener("change", () => {
      window.location.search = "?udi=" + encodeURIComponent(sel.value);
    });
  }

  function renderSteps() {
    const stepsEl = document.getElementById("udi-steps");
    stepsEl.innerHTML = "";
    UDI_PHASE_IDS.forEach((id, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "udi-step";
      btn.dataset.phaseStep = id;
      btn.innerHTML = `<span class="udi-step-index">${idx + 1}</span><span class="udi-step-label">${UDI_PHASE_LABELS[id]}</span>`;
      btn.addEventListener("click", () => {
        if (idx <= maxUnlocked) showPhase(idx);
      });
      stepsEl.appendChild(btn);
    });
    updateSteps();
  }

  function updateSteps() {
    document.querySelectorAll(".udi-step").forEach((btn, idx) => {
      btn.classList.toggle("active", idx === currentPhase);
      btn.classList.toggle("done", idx < maxUnlocked);
      btn.classList.toggle("locked", idx > maxUnlocked);
    });
  }

  function showPhase(idx) {
    currentPhase = idx;
    document.querySelectorAll(".udi-phase-panel").forEach((panel) => {
      panel.style.display = UDI_PHASE_IDS.indexOf(panel.dataset.phase) === idx ? "" : "none";
    });
    updateSteps();
  }

  function fase(id) {
    return udi.fases.find((f) => f.id === id);
  }

  // ---------------- Fase 1: Plan ----------------

  function renderPlan() {
    const plan = fase("plan");
    document.getElementById("udi-plan-intro").textContent = `${plan.sesiones.length} sesiones. Revisa el plan antes de generar ningún documento.`;
    const el = document.getElementById("udi-plan-sesiones");
    el.innerHTML = "";
    plan.sesiones.forEach((s) => {
      const row = document.createElement("div");
      row.className = "exm-topic-row";
      row.innerHTML = `<span class="exm-topic-label"><strong>Sesión ${s.n}.</strong> ${s.titulo}<br><span style="color:var(--muted);font-weight:400;">${s.descripcion || ""}</span></span>`;
      el.appendChild(row);
    });
  }

  // ---------------- Fase 2: Fichas (estándar) ----------------

  function renderFichas() {
    const documentos = fase("fichas").documentos;
    const el = document.getElementById("udi-fichas-list");
    el.innerHTML = "";
    documentos.forEach((doc) => {
      el.appendChild(buildFichaRow(doc, "none", document.getElementById("udi-fichas-status")));
    });
  }

  function buildFichaRow(doc, dificultad, statusEl) {
    const wrap = document.createElement("div");

    const row = document.createElement("div");
    row.className = "exm-topic-row";

    const label = document.createElement("span");
    label.className = "exm-topic-label";
    label.textContent = `${doc.label} (${doc.count} preguntas)`;

    const previewBox = document.createElement("div");
    previewBox.className = "rule-box llana udi-preview-box";
    previewBox.style.display = "none";

    const previewBtn = document.createElement("button");
    previewBtn.type = "button";
    previewBtn.className = "btn btn-secondary";
    previewBtn.textContent = "Vista previa";
    previewBtn.addEventListener("click", () => {
      const showing = previewBox.style.display !== "none";
      if (showing) {
        previewBox.style.display = "none";
        previewBtn.textContent = "Vista previa";
        return;
      }
      try {
        const problem = udiPreviewProblem(doc, dificultad);
        previewBox.innerHTML = `<h4>Vista previa (1 pregunta de ejemplo)</h4><p>${problem.enunciado}</p><p><strong>Respuesta:</strong> ${problem.respuesta}</p>`;
        previewBox.style.display = "";
        previewBtn.textContent = "Ocultar vista previa";
      } catch (err) {
        showStatus(statusEl, "ko", "No se pudo previsualizar", err.message);
      }
    });

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-secondary";
    btn.textContent = "Generar";

    btn.addEventListener("click", () => {
      try {
        udiGenerarFicha(doc, udi.curso, dificultad);
        btn.textContent = "✓ Generada";
        btn.classList.add("udi-generated");
        showStatus(statusEl, "ok", "¡Listo!", `Se ha descargado «${doc.label}» (${udiDifficultyLabel(dificultad)}).`);
      } catch (err) {
        showStatus(statusEl, "ko", "Ha ocurrido un error", err.message);
      }
    });

    row.appendChild(label);
    row.appendChild(previewBtn);
    row.appendChild(btn);
    wrap.appendChild(row);
    wrap.appendChild(previewBox);
    return wrap;
  }

  // ---------------- Fase 3: Adaptaciones ----------------

  function renderAdaptaciones() {
    const documentos = fase("fichas").documentos;
    const statusEl = document.getElementById("udi-adaptaciones-status");
    const el = document.getElementById("udi-adaptaciones-list");
    el.innerHTML = "";

    documentos.forEach((doc) => {
      const group = document.createElement("div");
      group.className = "exm-topic-group";
      const title = document.createElement("p");
      title.className = "exm-topic-group-title";
      title.textContent = doc.label;
      group.appendChild(title);

      udi.perfilesAdaptacion.forEach((perfil) => {
        const row = buildFichaRow({ ...doc, label: udiDifficultyLabel(perfil) }, perfil, statusEl);
        row.classList.add(`type-${perfil}`);
        group.appendChild(row);
      });

      el.appendChild(group);
    });
  }

  // ---------------- Fase 4: Evaluación ----------------

  function buildDocButtonRow(labelText, perfil, statusEl, onClick) {
    const row = document.createElement("div");
    row.className = `exm-topic-row type-${perfil}`;
    const label = document.createElement("span");
    label.className = "exm-topic-label";
    label.textContent = labelText;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-secondary";
    btn.textContent = "Generar";
    btn.addEventListener("click", () => {
      try {
        onClick();
        btn.textContent = "✓ Generado";
        showStatus(statusEl, "ok", "¡Listo!", `Documento generado (${udiDifficultyLabel(perfil)}).`);
      } catch (err) {
        showStatus(statusEl, "ko", "Ha ocurrido un error", err.message);
      }
    });
    row.appendChild(label);
    row.appendChild(btn);
    return row;
  }

  function renderEvaluacion() {
    const documentos = fase("evaluacion").documentos;
    const statusEl = document.getElementById("udi-evaluacion-status");
    const el = document.getElementById("udi-evaluacion-list");
    el.innerHTML = "";

    documentos.forEach((doc) => {
      const group = document.createElement("div");
      group.className = "exm-topic-group";
      const title = document.createElement("p");
      title.className = "exm-topic-group-title";
      title.textContent = doc.label;
      group.appendChild(title);

      const esExamen = doc.motor === "lengua-examen" || doc.motor === "mate-examen";
      const esDoc = doc.motor === "udi-doc-builder";

      if (esExamen || esDoc) {
        ["none", ...udi.perfilesAdaptacion].forEach((perfil) => {
          const row = buildDocButtonRow(udiDifficultyLabel(perfil), perfil, statusEl, () => {
            if (esExamen) udiGenerarExamen(doc, udi.curso, perfil);
            else window[doc.builder](doc.args, perfil);
          });
          group.appendChild(row);
        });
      }

      el.appendChild(group);
    });
  }

  function showStatus(statusEl, kind, title, text) {
    statusEl.classList.remove("show", "ok", "ko");
    statusEl.classList.add("show", kind);
    statusEl.innerHTML = `<p class="feedback-title">${title}</p><p>${text}</p>`;
  }

  // ---------------- Fase 5: Compilación ----------------

  function renderCompilacion() {
    const btn = document.getElementById("udi-compilar-btn");
    const statusEl = document.getElementById("udi-compilacion-status");

    btn.addEventListener("click", async () => {
      btn.disabled = true;
      btn.textContent = "Generando paquete...";
      statusEl.classList.remove("show", "ok", "ko");
      statusEl.innerHTML = "";

      try {
        const namedBlobs = [];
        const perfiles = ["none", ...udi.perfilesAdaptacion];

        fase("fichas").documentos.forEach((doc) => {
          perfiles.forEach((perfil) => {
            const { ficha, soluciones } = udiGenerarFicha(doc, udi.curso, perfil, { download: false });
            const carpeta = `fichas/${perfil}`;
            namedBlobs.push({ name: `${carpeta}/${ficha.filename}`, blob: ficha.blob });
            namedBlobs.push({ name: `${carpeta}/${soluciones.filename}`, blob: soluciones.blob });
          });
        });

        fase("evaluacion").documentos.forEach((doc) => {
          if (doc.motor === "lengua-examen" || doc.motor === "mate-examen") {
            perfiles.forEach((perfil) => {
              const { ficha, soluciones } = udiGenerarExamen(doc, udi.curso, perfil, { download: false });
              const carpeta = `evaluacion/${doc.id}/${perfil}`;
              namedBlobs.push({ name: `${carpeta}/${ficha.filename}`, blob: ficha.blob });
              namedBlobs.push({ name: `${carpeta}/${soluciones.filename}`, blob: soluciones.blob });
            });
          } else if (doc.motor === "udi-doc-builder") {
            perfiles.forEach((perfil) => {
              const { blob, filename } = window[doc.builder](doc.args, perfil, { download: false });
              namedBlobs.push({ name: `evaluacion/${doc.id}/${perfil}/${filename}`, blob });
            });
          }
        });

        const zipBlob = await createZipBundle(namedBlobs);
        downloadBlob(zipBlob, `UDI_${udi.id}.zip`);

        statusEl.classList.add("show", "ok");
        statusEl.innerHTML = `<p class="feedback-title">¡Paquete listo!</p><p>Se ha descargado <strong>UDI_${udi.id}.zip</strong> con ${namedBlobs.length} documentos (versión estándar + ${udi.perfilesAdaptacion.length} adaptaciones).</p>`;

        if (window.UdiHistorial) {
          window.UdiHistorial.save({
            udiId: udi.id,
            titulo: udi.titulo,
            curso: udi.curso,
            documentos: namedBlobs.length,
          }).catch(() => {
            // Sin sesión docente o sin conexión: la herramienta sigue
            // funcionando igual, el histórico es un extra opcional.
          });
        }
      } catch (err) {
        statusEl.classList.add("show", "ko");
        statusEl.innerHTML = `<p class="feedback-title">Ha ocurrido un error</p><p>${err.message}</p>`;
      } finally {
        btn.disabled = false;
        btn.textContent = "Generar paquete completo (.zip)";
      }
    });
  }
});
