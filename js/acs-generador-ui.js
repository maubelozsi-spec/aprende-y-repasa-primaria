// ============================================================
// Generador de cuaderno ACS: marca varias actividades con su
// cantidad, elige modo Repaso/Examen y junta todo en un único
// cuaderno (digital + para imprimir), con hoja de respuestas aparte
// en modo Examen.
// ============================================================

const ACS_GEN_AREA_LABEL = { lengua: "Lengua", matematicas: "Matemáticas" };


document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);

  const listaEl = document.getElementById("acs-gen-lista");
  const resumenEl = document.getElementById("acs-gen-resumen");
  const statusEl = document.getElementById("acs-gen-status");
  const generarBtn = document.getElementById("acs-gen-generar-btn");
  const modoBtns = document.querySelectorAll("#acs-gen-modo-picker [data-modo]");
  const cursoBtns = document.querySelectorAll("#acs-gen-curso-picker [data-curso]");
  const recortarCheck = document.getElementById("acs-gen-recortar-check");
  const resultadoEl = document.getElementById("acs-gen-resultado");
  const tabRespuestasBtn = document.getElementById("acs-gen-tab-respuestas");

  let modo = "repaso";
  let curso = "1";

  // ---------- lista de actividades ----------

  ["lengua", "matematicas"].forEach((area) => {
    const grupo = document.createElement("div");
    grupo.className = "acs-gen-grupo";
    const titulo = document.createElement("p");
    titulo.className = `acs-area-titulo acs-area-titulo-${area}`;
    titulo.textContent = ACS_GEN_AREA_LABEL[area];
    grupo.appendChild(titulo);

    ACS_FICHAS.filter((f) => f.area === area).forEach((ficha) => {
      const fila = document.createElement("label");
      fila.className = "acs-gen-fila";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.id = ficha.id;

      const texto = document.createElement("span");
      texto.className = "acs-gen-fila-texto";
      texto.textContent = ficha.titulo;

      // Casi todas las fichas usan "cantidad" como número de ejercicios
      // (2-10), pero alguna la usa para otra cosa y necesita otro tope:
      // en la serie numérica es el número final ("del 1 al 30").
      const cantidad = document.createElement("input");
      cantidad.type = "number";
      cantidad.className = "number-input acs-gen-fila-cantidad";
      cantidad.min = String(ficha.cantidadMin || 2);
      cantidad.max = String(ficha.cantidadMax || 10);
      cantidad.title = ficha.cantidadEtiqueta || "Número de ejercicios";
      cantidad.value = String(ficha.cantidadDefecto);
      cantidad.disabled = true;

      checkbox.addEventListener("change", () => {
        cantidad.disabled = !checkbox.checked;
        actualizarResumen();
      });
      cantidad.addEventListener("change", actualizarResumen);

      fila.appendChild(checkbox);
      fila.appendChild(texto);
      fila.appendChild(cantidad);
      grupo.appendChild(fila);
    });

    listaEl.appendChild(grupo);
  });

  function getSeleccion() {
    const seleccion = [];
    listaEl.querySelectorAll(".acs-gen-fila").forEach((fila) => {
      const checkbox = fila.querySelector("input[type=checkbox]");
      const cantidadInput = fila.querySelector(".acs-gen-fila-cantidad");
      if (checkbox.checked) {
        const min = Number(cantidadInput.min) || 2;
        const max = Number(cantidadInput.max) || 10;
        const cantidad = Math.min(max, Math.max(min, Number(cantidadInput.value) || min));
        cantidadInput.value = cantidad;
        seleccion.push({ id: checkbox.dataset.id, cantidad });
      }
    });
    return seleccion;
  }

  function actualizarResumen() {
    const seleccion = getSeleccion();
    resumenEl.textContent = seleccion.length
      ? `${seleccion.length} actividad${seleccion.length === 1 ? "" : "es"} seleccionada${seleccion.length === 1 ? "" : "s"}.`
      : "Marca al menos una actividad.";
  }

  // ---------- modo ----------

  modoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modoBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      modo = btn.dataset.modo;
    });
  });

  // ---------- curso ----------

  cursoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      cursoBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      curso = btn.dataset.curso;
    });
  });

  // ---------- pestañas del resultado ----------
  //
  // Solo se imprime la pestaña activa: las inactivas ya quedan en
  // display:none por la regla base de ".acs-panel" (ver css/acs.css),
  // así que en modo examen "Hoja de respuestas" nunca sale a la vez
  // que "Cuaderno para imprimir", aunque las dos existan en la página.

  document.getElementById("acs-gen-tabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".acs-tab-btn");
    if (!btn) return;
    document.querySelectorAll("#acs-gen-tabs .acs-tab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("acs-gen-panel-digital").classList.toggle("active", btn.dataset.tab === "digital");
    document.getElementById("acs-gen-panel-sheet").classList.toggle("active", btn.dataset.tab === "sheet");
    document.getElementById("acs-gen-panel-respuestas").classList.toggle("active", btn.dataset.tab === "respuestas");
  });

  document.getElementById("acs-gen-imprimir-btn").addEventListener("click", acsEsperarImagenesEImprimir);

  // ---------- generar ----------

  // Cabecera única del examen (no una portada aparte): un título, y
  // Nombre/Fecha/Curso una sola vez arriba de todo, como en los
  // exámenes en papel reales que usa la profesora (no una ficha de
  // colores por actividad, cada una con su propia cabecera repetida).
  function crearCabeceraExamen(secciones, curso) {
    const areas = new Set(secciones.map((s) => s.area));
    let titulo = "Examen adaptado";
    if (areas.size === 1) {
      titulo = (ACS_GEN_AREA_LABEL[secciones[0].area] || "Examen") + " — Examen adaptado";
    }

    const cabecera = document.createElement("div");
    cabecera.className = "acs-examen-header";
    cabecera.innerHTML = `
      <h2 class="acs-examen-titulo">${titulo}</h2>
      <div class="acs-sheet-nombre"><span>Nombre:</span><span>Fecha:</span></div>
      <p class="acs-examen-curso">Curso: ${curso === "2" ? "2º de Primaria" : "1º de Primaria"}</p>
    `;
    return cabecera;
  }

  // En modo examen, cada actividad se convierte de "ficha con su
  // propia cabecera" a "ejercicio numerado" dentro del mismo examen:
  // se quita el Nombre/Fecha y el título grande (ya están una vez en
  // la cabecera del examen) y la instrucción pasa a ser el enunciado
  // numerado ("1. ...", "2. ...").
  //
  // Si el ejercicio es de recortar y pegar, además se sacan las
  // piezas de recortar de su sitio (y el aviso de "recorta cada
  // cuadro..."): en un examen con varias actividades no tiene sentido
  // dejarlas sueltas justo detrás de cada ejercicio, donde pueden caer
  // en una página aparte en medio del examen. Se devuelven aquí para
  // que quien llama las junte todas en una sola página al final.
  function convertirEnEjercicioExamen(sheetDiv, numero) {
    sheetDiv.classList.add("acs-examen-ejercicio");
    const nombreRow = sheetDiv.querySelector(".acs-sheet-nombre");
    if (nombreRow) nombreRow.remove();
    const tituloEl = sheetDiv.querySelector(".acs-sheet-titulo");
    if (tituloEl) tituloEl.remove();
    const instruccionEl = sheetDiv.querySelector(".acs-sheet-instruccion");
    if (instruccionEl) {
      instruccionEl.classList.add("acs-examen-enunciado");
      instruccionEl.textContent = `${numero}. ${instruccionEl.textContent}`;
    }

    const avisoEl = sheetDiv.querySelector(".acs-recortar-aviso");
    if (avisoEl) avisoEl.remove();
    const piezasEl = sheetDiv.querySelector(".acs-recortar-piezas");
    if (piezasEl) {
      piezasEl.remove();
      return piezasEl;
    }
    return null;
  }

  // Página final de recortables de un examen: junta las piezas de
  // todos los ejercicios de recortar y pegar, cada grupo con su
  // propia etiqueta ("Del ejercicio N"), para que se recorte todo de
  // una vez en vez de ir buscando piezas sueltas por el examen.
  function crearPaginaRecortables(grupos) {
    const pagina = document.createElement("div");
    pagina.className = "acs-sheet acs-examen-ejercicio acs-examen-recortables";

    const titulo = document.createElement("h2");
    titulo.className = "acs-examen-titulo";
    titulo.textContent = "Recortables";
    pagina.appendChild(titulo);

    const nota = document.createElement("p");
    nota.className = "acs-examen-enunciado";
    nota.textContent = "✂ Recorta cada cuadro y pégalo junto a su pareja en el ejercicio correspondiente.";
    pagina.appendChild(nota);

    grupos.forEach(({ numero, piezasEl }) => {
      const etiqueta = document.createElement("p");
      etiqueta.className = "acs-recortables-etiqueta";
      etiqueta.textContent = `Del ejercicio ${numero}:`;
      pagina.appendChild(etiqueta);
      pagina.appendChild(piezasEl);
    });

    return pagina;
  }

  // ---------- que cada ejercicio quepa en un folio ----------

  // Monta una sección (los datos de la actividad) a partir de su
  // entrada del registro.
  function crearSeccion(id, cantidad) {
    const entry = ACS_FICHAS_REGISTRO[id];
    return Object.assign(
      { area: entry.area, tituloSeccion: entry.titulo },
      entry.generarConCantidad(cantidad, curso)
    );
  }

  // Dibuja la hoja de una sección tal y como va a salir impresa (en
  // examen, ya convertida en ejercicio numerado). Devuelve aparte las
  // piezas de recortar: van a su propia página al final, así que no
  // cuentan para el alto del ejercicio.
  function crearHojaDeSeccion(seccion, numero) {
    const temporal = document.createElement("div");
    if (seccion.tipo === "unir-parejas" && recortarCheck.checked) {
      seccion.imprimirComo = "recortar";
    }
    ACS_RENDERERS[seccion.tipo].sheet(seccion, temporal);
    const sheetDiv = temporal.firstElementChild;
    const piezasEl = modo === "examen" ? convertirEnEjercicioExamen(sheetDiv, numero) : null;
    return { sheetDiv, piezasEl };
  }

  // Ajusta una actividad para que su ejercicio quepa en un folio (el
  // bucle de medir y quitar ítems está en acsBuscarVersionQueQuepa,
  // en js/acs-ficha-engine.js, porque la ficha suelta necesita
  // exactamente lo mismo).
  function ajustarSeccionAlFolio(id, cantidadPedida, numero) {
    const entry = ACS_FICHAS_REGISTRO[id];
    const resultado = acsBuscarVersionQueQuepa(
      (cantidad) => {
        const seccion = crearSeccion(id, cantidad);
        return { ficha: seccion, hoja: crearHojaDeSeccion(seccion, numero).sheetDiv };
      },
      cantidadPedida,
      entry.cantidadMin || 2,
      // En casi todas las fichas "cantidad" es el número de ítems y
      // quitar uno es la forma natural de que quepa. En alguna no lo
      // es (en la serie numérica es hasta dónde llega la serie), y
      // ahí recortar cambiaría el ejercicio pedido, no su tamaño.
      entry.cantidadEsItems !== false
    );

    return {
      seccion: resultado.ficha,
      quitados: resultado.quitados,
      cabe: resultado.cabe,
      // La hoja buena se vuelve a dibujar, ya con los pictogramas:
      // las que se midieron venían a propósito sin ellos.
      hoja: crearHojaDeSeccion(resultado.ficha, numero),
    };
  }

  generarBtn.addEventListener("click", () => {
    statusEl.classList.remove("show", "ok", "ko");
    statusEl.innerHTML = "";

    const seleccion = getSeleccion();
    if (!seleccion.length) {
      statusEl.classList.add("show", "ko");
      statusEl.innerHTML = "<p class=\"feedback-title\">Elige al menos una actividad</p>";
      return;
    }

    // Cada actividad se genera, se mide y, si no cabe en un folio, se
    // regenera con menos ítems (ver ajustarSeccionAlFolio). La hoja
    // que sale de aquí es la definitiva: se reutiliza tal cual más
    // abajo en vez de volver a dibujarla.
    const ajustes = seleccion.map(({ id, cantidad }, i) => ajustarSeccionAlFolio(id, cantidad, i + 1));
    const secciones = ajustes.map((a) => a.seccion);

    // Digital: una sección tras otra, cada una con su propio título.
    const digitalEl = document.getElementById("acs-gen-digital");
    digitalEl.innerHTML = "";
    secciones.forEach((seccion, i) => {
      const bloque = document.createElement("div");
      bloque.className = "acs-gen-seccion-digital";
      const h3 = document.createElement("h3");
      h3.textContent = `${i + 1}. ${seccion.tituloSeccion}`;
      bloque.appendChild(h3);
      const subDiv = document.createElement("div");
      bloque.appendChild(subDiv);
      ACS_RENDERERS[seccion.tipo].digital(seccion, subDiv);
      digitalEl.appendChild(bloque);
    });

    // Imprimir: cada sección genera su propio ".acs-sheet"; se anexan
    // como hermanos directos (no dentro de envoltorios) para que la
    // regla de impresión ".acs-sheet:not(:last-child)" meta un salto
    // de página entre cada una (en modo repaso: una ficha por hoja,
    // con su propio título y colores). En modo examen es al revés: se
    // parece a un examen en papel real, con una sola cabecera arriba
    // y los ejercicios numerados uno detrás de otro sin saltar de
    // página entre ellos (ver ".acs-examen-ejercicio" en css/acs.css).
    const sheetRoot = document.getElementById("acs-gen-sheet");
    sheetRoot.innerHTML = "";
    if (modo === "examen") sheetRoot.appendChild(crearCabeceraExamen(secciones, curso));
    const recortablesExamen = [];
    ajustes.forEach(({ hoja }, i) => {
      if (hoja.piezasEl) recortablesExamen.push({ numero: i + 1, piezasEl: hoja.piezasEl });
      sheetRoot.appendChild(hoja.sheetDiv);
    });
    if (modo === "examen" && recortablesExamen.length) {
      sheetRoot.appendChild(crearPaginaRecortables(recortablesExamen));
    }

    // Hoja de respuestas: solo en modo examen.
    const respuestasEl = document.getElementById("acs-gen-respuestas");
    respuestasEl.innerHTML = "";
    if (modo === "examen") {
      const titulo = document.createElement("h2");
      titulo.className = "acs-sheet-titulo";
      titulo.textContent = "Hoja de respuestas";
      respuestasEl.appendChild(titulo);

      secciones.forEach((seccion, i) => {
        const h3 = document.createElement("h3");
        h3.textContent = `${i + 1}. ${seccion.tituloSeccion}`;
        respuestasEl.appendChild(h3);
        const lista = document.createElement("ul");
        acsClaveRespuestas(seccion).forEach((linea) => {
          const li = document.createElement("li");
          li.textContent = linea;
          lista.appendChild(li);
        });
        respuestasEl.appendChild(lista);
      });
    }
    tabRespuestasBtn.style.display = modo === "examen" ? "" : "none";

    // Si se estaba en la pestaña de respuestas y se genera de nuevo en
    // modo repaso (esa pestaña desaparece), se vuelve a la digital para
    // no dejar la pantalla en una pestaña que ya no existe.
    const tabActivaBtn = document.querySelector("#acs-gen-tabs .acs-tab-btn.active");
    if (modo === "repaso" && tabActivaBtn && tabActivaBtn.dataset.tab === "respuestas") {
      document.querySelector('#acs-gen-tabs [data-tab="digital"]').click();
    }

    statusEl.classList.add("show", "ok");
    const partes = [
      "<p class=\"feedback-title\">¡Listo!</p>",
      `<p>Cuaderno de ${secciones.length} actividad${secciones.length === 1 ? "" : "es"} generado en modo ${modo === "examen" ? "examen" : "repaso"}.</p>`,
    ];

    // Si ha habido que quitar ítems para que un ejercicio no se
    // partiera entre dos folios, se dice cuáles y cuántos: la maestra
    // pidió una cantidad y tiene derecho a saber que no es la que va
    // a imprimir, por si prefiere partir esa actividad en dos fichas.
    const recortados = ajustes
      .map((a, i) => ({ numero: i + 1, titulo: a.seccion.tituloSeccion, quitados: a.quitados }))
      .filter((a) => a.quitados > 0);
    if (recortados.length) {
      partes.push(
        "<p>Para que ningún ejercicio se parta entre dos hojas se han quitado ítems de: " +
          recortados
            .map((a) => `<strong>${a.numero}. ${a.titulo}</strong> (${a.quitados} menos)`)
            .join(", ") +
          ".</p>"
      );
    }

    // Caso raro: un solo ítem que ya no cabe en un folio entero (por
    // ejemplo decenas con muchos dibujos). No se puede quitar más, así
    // que se avisa en vez de dejar que se corte sin más.
    const noCaben = ajustes
      .map((a, i) => ({ numero: i + 1, titulo: a.seccion.tituloSeccion, cabe: a.cabe }))
      .filter((a) => !a.cabe);
    if (noCaben.length) {
      partes.push(
        "<p>Aun así no cabe en un folio: " +
          noCaben.map((a) => `<strong>${a.numero}. ${a.titulo}</strong>`).join(", ") +
          ". Genera esa actividad como ficha suelta o baja la cantidad.</p>"
      );
    }

    statusEl.innerHTML = partes.join("");

    resultadoEl.style.display = "";
    resultadoEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  actualizarResumen();
});
