// ============================================================
// Wiring genérico para los botones "Descargar ficha y soluciones"
// de cada página de tema (Matemáticas o Lengua): genera el
// documento en el momento, reflejando la dificultad seleccionada
// en esa misma página, y descarga la ficha y su hoja de
// soluciones (ambas a partir del mismo conjunto de problemas).
//
// Requiere que la página también cargue docx-writer.js y un
// generador que exponga generarFichaYSoluciones(topicId, curso,
// count, dificultad): js/ficha-generator.js en Matemáticas o
// js/lengua-ficha-generator.js en Lengua.
// ============================================================

const FICHA_DOWNLOAD_COUNT = 5;

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".ficha-download-btn[data-ficha-curso]");
  if (!buttons.length) return;

  const topicId = window.CURRENT_PAGE;

  // La clase decide si su alumnado ve las hojas de soluciones (ver
  // __puedeVerSoluciones en js/layout.js). Aquí solo hay que cambiar
  // el texto del botón: quien descarga de verdad es
  // generarFichaYSoluciones, que ya no manda el solucionario cuando no
  // toca. Con el rótulo puesto a mano en 71 páginas, cambiarlo aquí
  // evita tener que tocarlas una a una.
  const verSoluciones = !window.__puedeVerSoluciones || window.__puedeVerSoluciones();

  buttons.forEach((btn) => {
    if (!verSoluciones) btn.textContent = "Descargar ficha (Word)";
    const originalText = btn.textContent;
    btn.addEventListener("click", () => {
      const curso = btn.dataset.fichaCurso;
      const select = document.getElementById("difficulty-select");
      const dificultad = select ? select.value : "none";

      btn.disabled = true;
      btn.textContent = "Generando…";
      try {
        generarFichaYSoluciones(topicId, curso, FICHA_DOWNLOAD_COUNT, dificultad);
      } catch (err) {
        console.error("No se pudo generar la ficha:", err);
      } finally {
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = originalText;
        }, 700);
      }
    });
  });
});
