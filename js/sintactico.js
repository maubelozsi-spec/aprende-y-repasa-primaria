// ============================================================
// Análisis sintáctico: banco de oraciones + lógica del artefacto
// ============================================================

const SENTENCES = [
  // ---- Sujeto omitido ----
  { words: ["Vamos", "al", "cine", "esta", "tarde"], subject: { omitted: true }, predicateType: "verbal", complements: ["CC"] },
  { words: ["Comen", "pizza", "los", "sábados"], subject: { omitted: true }, predicateType: "verbal", complements: ["CD", "CC"] },
  { words: ["Como", "manzanas", "todos", "los", "días"], subject: { omitted: true }, predicateType: "verbal", complements: ["CD", "CC"] },
  { words: ["Duermo", "ocho", "horas", "cada", "noche"], subject: { omitted: true }, predicateType: "verbal", complements: ["CC"] },
  { words: ["Sonríes", "siempre"], subject: { omitted: true }, predicateType: "verbal", complements: ["CC"] },
  { words: ["Escribo", "un", "mensaje", "a", "mi", "profesora"], subject: { omitted: true }, predicateType: "verbal", complements: ["CD", "CI"] },

  // ---- Predicado nominal ----
  { words: ["El", "cielo", "está", "nublado"], subject: { indices: [0, 1] }, predicateType: "nominal", atributo: "nublado" },
  { words: ["Mi", "madre", "es", "profesora"], subject: { indices: [0, 1] }, predicateType: "nominal", atributo: "profesora" },
  { words: ["Los", "estudiantes", "parecen", "cansados"], subject: { indices: [0, 1] }, predicateType: "nominal", atributo: "cansados" },
  { words: ["Este", "ejercicio", "es", "muy", "difícil"], subject: { indices: [0, 1] }, predicateType: "nominal", atributo: "muy difícil" },
  { words: ["Esta", "sopa", "está", "deliciosa"], subject: { indices: [0, 1] }, predicateType: "nominal", atributo: "deliciosa" },

  // ---- Predicado verbal, sujeto expreso ----
  { words: ["El", "perro", "ladra", "mucho"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CC"] },
  { words: ["Los", "niños", "juegan", "en", "el", "parque"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CC"] },
  { words: ["María", "compra", "un", "regalo"], subject: { indices: [0] }, predicateType: "verbal", complements: ["CD"] },
  { words: ["Mi", "hermano", "escribe", "una", "carta", "a", "su", "amigo"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CD", "CI"] },
  { words: ["Ana", "y", "Luis", "viven", "en", "Madrid"], subject: { indices: [0, 1, 2] }, predicateType: "verbal", complements: ["CC"] },
  { words: ["Pedro", "regala", "flores", "a", "su", "abuela"], subject: { indices: [0] }, predicateType: "verbal", complements: ["CD", "CI"] },
  { words: ["Los", "pájaros", "vuelan", "alto"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CC"] },
  { words: ["El", "profesor", "explica", "la", "lección", "con", "paciencia"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CD", "CC"] },
  { words: ["Mis", "padres", "compran", "fruta", "en", "el", "mercado"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CD", "CC"] },
  { words: ["El", "agua", "hierve", "a", "cien", "grados"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CC"] },
  { words: ["Nosotros", "estudiamos", "inglés", "los", "lunes"], subject: { indices: [0] }, predicateType: "verbal", complements: ["CD", "CC"] },
  { words: ["El", "pastel", "huele", "muy", "bien"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CC"] },
  { words: ["Los", "abuelos", "cuentan", "historias", "a", "los", "nietos"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CD", "CI"] },
  { words: ["El", "tren", "llega", "tarde"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CC"] },
  { words: ["Mi", "vecino", "riega", "las", "plantas", "por", "la", "mañana"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: ["CD", "CC"] },

  // ---- Predicado verbal sin complementos ----
  { words: ["Los", "pájaros", "cantan"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: [] },
  { words: ["El", "bebé", "duerme"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: [] },
  { words: ["Mi", "perro", "ladra"], subject: { indices: [0, 1] }, predicateType: "verbal", complements: [] },
];

function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  if (document.getElementById("word-tokens")) {
    initGame();
  }
});

function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = {
    teoria: document.getElementById("tab-teoria"),
    practica: document.getElementById("tab-practica"),
  };
  if (tabBtns.length === 0) return;

  function activateTab(name) {
    tabBtns.forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
    Object.entries(panels).forEach(([key, el]) => el.classList.toggle("active", key === name));
  }

  tabBtns.forEach((btn) => btn.addEventListener("click", () => activateTab(btn.dataset.tab)));

  const goBtn = document.getElementById("go-to-practice");
  if (goBtn) goBtn.addEventListener("click", () => activateTab("practica"));
}

function initGame() {
  const els = {
    stepSubject: document.getElementById("step-subject"),
    stepPredtype: document.getElementById("step-predtype"),
    stepComplements: document.getElementById("step-complements"),
    wordTokens: document.getElementById("word-tokens"),
    omittedToggle: document.getElementById("omitted-toggle"),
    checkSubjectBtn: document.getElementById("check-subject"),
    sentenceAfterSubject: document.getElementById("sentence-after-subject"),
    ptButtons: document.querySelectorAll("#step-predtype [data-pt]"),
    compChips: document.querySelectorAll("#complement-chips [data-comp]"),
    checkComplementsBtn: document.getElementById("check-complements"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("next-sentence"),
    scoreOk: document.getElementById("score-ok"),
    scoreKo: document.getElementById("score-ko"),
    progressFill: document.getElementById("progress-fill"),
  };

  let scoreOk = 0;
  let scoreKo = 0;
  let lastIndex = -1;
  let current, selected, omitted, subjectAttempts, roundOk;
  let chosenComplements = new Set();

  function pickSentence() {
    let idx;
    do {
      idx = Math.floor(Math.random() * SENTENCES.length);
    } while (SENTENCES.length > 1 && idx === lastIndex);
    lastIndex = idx;
    return SENTENCES[idx];
  }

  function setProgress(percent) {
    els.progressFill.style.width = percent + "%";
  }

  function clearFeedback() {
    els.feedback.classList.remove("show", "ok", "ko");
    els.feedback.innerHTML = "";
  }

  function showTempMessage(msg) {
    els.feedback.classList.add("show");
    els.feedback.classList.remove("ok", "ko");
    els.feedback.innerHTML = `<p>${msg}</p>`;
  }

  function renderTokens(locked) {
    els.wordTokens.innerHTML = "";
    current.words.forEach((word, i) => {
      const chip = document.createElement("button");
      chip.className = "syllable-chip" + (selected.has(i) ? " selected" : "");
      chip.textContent = word;
      if (!locked) {
        chip.addEventListener("click", () => {
          if (omitted) return;
          if (selected.has(i)) selected.delete(i);
          else selected.add(i);
          chip.classList.toggle("selected", selected.has(i));
        });
      } else {
        chip.disabled = true;
      }
      els.wordTokens.appendChild(chip);
    });
  }

  function startRound() {
    current = pickSentence();
    selected = new Set();
    omitted = false;
    subjectAttempts = 0;
    roundOk = { subject: null, predtype: null, complements: null };
    chosenComplements = new Set();

    els.stepSubject.style.display = "";
    els.stepPredtype.style.display = "none";
    els.stepComplements.style.display = "none";
    els.nextBtn.style.display = "none";
    els.checkSubjectBtn.disabled = false;
    els.omittedToggle.classList.remove("active");
    setProgress(0);

    clearFeedback();
    renderTokens(false);
  }

  els.omittedToggle.addEventListener("click", () => {
    omitted = !omitted;
    els.omittedToggle.classList.toggle("active", omitted);
    if (omitted) {
      selected.clear();
      renderTokens(false);
    }
  });

  function checkSubject() {
    subjectAttempts++;
    let isCorrect;
    if (current.subject.omitted) {
      isCorrect = omitted;
    } else {
      isCorrect = !omitted && setsEqual(selected, new Set(current.subject.indices));
    }

    if (isCorrect) {
      roundOk.subject = true;
      clearFeedback();
      goToPredType();
      return;
    }

    if (subjectAttempts >= 2) {
      roundOk.subject = false;
      if (current.subject.omitted) {
        omitted = true;
        els.omittedToggle.classList.add("active");
        selected.clear();
      } else {
        selected = new Set(current.subject.indices);
        omitted = false;
        els.omittedToggle.classList.remove("active");
      }
      renderTokens(true);
      els.checkSubjectBtn.disabled = true;
      showTempMessage("El sujeto correcto es: <strong>" + (current.subject.omitted ? "sujeto omitido" : current.subject.indices.map((i) => current.words[i]).join(" ")) + "</strong>. ¡Sigamos!");
      setTimeout(() => {
        clearFeedback();
        goToPredType();
      }, 1700);
    } else {
      showTempMessage("Todavía no es correcto, ¡prueba otra vez!");
    }
  }

  function subjectPhrase() {
    return current.subject.omitted ? "(sujeto omitido)" : current.subject.indices.map((i) => current.words[i]).join(" ");
  }

  function goToPredType() {
    setProgress(50);
    els.stepSubject.style.display = "none";
    els.stepPredtype.style.display = "";

    els.sentenceAfterSubject.innerHTML = current.words
      .map((w, i) => (!current.subject.omitted && current.subject.indices.includes(i) ? `<span class="tag-subject">${w}</span>` : w))
      .join(" ") + (current.subject.omitted ? ` <span class="tag-subject">(sujeto omitido)</span>` : "");

    els.ptButtons.forEach((b) => {
      b.disabled = false;
      b.classList.remove("correct", "incorrect");
    });
  }

  function choosePredType(answer, btn) {
    const isCorrect = answer === current.predicateType;
    roundOk.predtype = isCorrect;

    els.ptButtons.forEach((b) => {
      b.disabled = true;
      if (b.dataset.pt === current.predicateType) b.classList.add("correct");
      else if (b === btn && !isCorrect) b.classList.add("incorrect");
    });

    setTimeout(() => {
      if (current.predicateType === "verbal") {
        goToComplements();
      } else {
        showFinalFeedback();
      }
    }, 1000);
  }

  function goToComplements() {
    setProgress(75);
    els.stepPredtype.style.display = "none";
    els.stepComplements.style.display = "";

    els.compChips.forEach((c) => {
      c.classList.remove("selected", "correct", "incorrect");
      c.disabled = false;
    });
  }

  els.compChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const comp = chip.dataset.comp;
      if (comp === "NINGUNO") {
        chosenComplements.clear();
        chosenComplements.add("NINGUNO");
      } else {
        chosenComplements.delete("NINGUNO");
        if (chosenComplements.has(comp)) chosenComplements.delete(comp);
        else chosenComplements.add(comp);
      }
      els.compChips.forEach((c) => c.classList.toggle("selected", chosenComplements.has(c.dataset.comp)));
    });
  });

  function checkComplements() {
    const correctSet = new Set(current.complements.length ? current.complements : ["NINGUNO"]);
    const isCorrect = setsEqual(chosenComplements, correctSet);
    roundOk.complements = isCorrect;

    els.compChips.forEach((c) => {
      c.disabled = true;
      if (correctSet.has(c.dataset.comp)) c.classList.add("correct");
      else if (chosenComplements.has(c.dataset.comp) && !correctSet.has(c.dataset.comp)) c.classList.add("incorrect");
    });

    setTimeout(showFinalFeedback, 1000);
  }

  function showFinalFeedback() {
    setProgress(100);
    els.stepComplements.style.display = "none";

    const allCorrect =
      roundOk.subject &&
      roundOk.predtype &&
      (current.predicateType === "nominal" || roundOk.complements);

    if (allCorrect) scoreOk++;
    else scoreKo++;
    els.scoreOk.textContent = scoreOk;
    els.scoreKo.textContent = scoreKo;

    const sentenceText = current.words.join(" ") + ".";
    const titleText = allCorrect ? "Correcto" : "Revisemos esta oración";

    let bodyHtml = `<p><strong>Sujeto:</strong> ${subjectPhrase()}</p>`;
    bodyHtml += `<p><strong>Predicado:</strong> ${current.predicateType === "nominal" ? "nominal" : "verbal"}</p>`;

    if (current.predicateType === "nominal") {
      bodyHtml += `<p>El atributo es <strong>${current.atributo}</strong>, porque describe cómo es o cómo está el sujeto junto a un verbo como ser, estar o parecer.</p>`;
    } else {
      const compNames = { CD: "complemento directo (CD)", CI: "complemento indirecto (CI)", CC: "complemento circunstancial (CC)" };
      if (current.complements.length === 0) {
        bodyHtml += `<p>Este predicado verbal no lleva complementos: solo tiene el verbo.</p>`;
      } else {
        bodyHtml += `<p>Esta oración lleva: ${current.complements.map((c) => compNames[c]).join(", ")}.</p>`;
      }
    }

    els.feedback.classList.add("show", allCorrect ? "ok" : "ko");
    els.feedback.innerHTML = `
      <p class="feedback-title">${titleText}</p>
      <span class="accented-word">${sentenceText}</span>
      ${bodyHtml}
    `;

    els.nextBtn.style.display = "";
  }

  els.checkSubjectBtn.addEventListener("click", checkSubject);
  els.ptButtons.forEach((btn) => btn.addEventListener("click", () => choosePredType(btn.dataset.pt, btn)));
  els.checkComplementsBtn.addEventListener("click", checkComplements);
  els.nextBtn.addEventListener("click", startRound);

  startRound();
}
