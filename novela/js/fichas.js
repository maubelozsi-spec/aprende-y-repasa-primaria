// ============================================================
// Novela Colectiva — fichas de personajes, lugares y palabras
// inventadas: la "biblia" de la novela.
//
// Regla de oro de la app: la primera vez que aparece un nombre
// propio o una palabra inventada, quien la escribe tiene que
// explicarla. Cuesta medio minuto y evita que la historia se
// contradiga a la tercera sesión. A partir de ahí, cualquiera que
// vuelva a usar ese nombre ve la ficha en lugar de rellenarla otra
// vez, y el corrector deja de marcar la palabra como dudosa.
// ============================================================

import { modal, escapaHtml } from "./comun.js";

export const TIPOS = {
  personaje: {
    etiqueta: "Personaje",
    icono: "🧍",
    preguntas: [
      { id: "quienEs", texto: "¿Quién es?", ayuda: "Una niña, un dragón, un robot… y cómo se llama de verdad si tiene apodo." },
      { id: "relacion", texto: "¿Qué tiene que ver con la historia?", ayuda: "¿Es amigo del protagonista? ¿Es quien causa el problema?" },
      { id: "comoEs", texto: "¿Cómo es?", ayuda: "Por fuera (alto, con capa roja…) y por dentro (valiente, mentiroso…)." },
      { id: "quiere", texto: "¿Qué quiere conseguir?", ayuda: "Lo que persigue mueve la historia: encontrar algo, escapar, vengarse…" },
    ],
  },
  lugar: {
    etiqueta: "Lugar",
    icono: "🗺️",
    preguntas: [
      { id: "queEs", texto: "¿Qué es ese sitio?", ayuda: "Un pueblo, un bosque, una nave, un planeta…" },
      { id: "donde", texto: "¿Dónde está?", ayuda: "Cerca del castillo, al otro lado del río, en otra galaxia…" },
      { id: "comoEs", texto: "¿Cómo es?", ayuda: "Lo que se ve, se oye y se huele al llegar." },
      { id: "quePasa", texto: "¿Qué pasa allí?", ayuda: "¿Por qué es importante para la novela?" },
    ],
  },
  invento: {
    etiqueta: "Palabra inventada",
    icono: "✨",
    preguntas: [
      { id: "significa", texto: "¿Qué significa?", ayuda: "Explícalo como si se lo contaras a alguien que no ha leído la novela." },
      { id: "paraQue", texto: "¿Para qué sirve o quién la usa?", ayuda: "Un hechizo, un aparato, un idioma de tu mundo…" },
      { id: "deDonde", texto: "¿De dónde sale?", ayuda: "Quién la inventó dentro de la historia, o desde cuándo existe." },
    ],
  },
};

export const ESTADOS_NARRATIVOS = [
  "en la historia",
  "se ha marchado",
  "está desaparecido",
  "ha muerto",
];

// Nombres de todas las fichas (para que el corrector no marque los
// nombres inventados y para no volver a preguntar por ellos).
export function nombresFichados(fichas) {
  return (fichas || []).map((f) => f.nombre);
}

export function buscarFicha(fichas, nombre) {
  const n = String(nombre || "").toLowerCase();
  return (fichas || []).find((f) => String(f.nombre).toLowerCase() === n) || null;
}

// ---------- ventana para rellenar una ficha ----------

// Devuelve {tipo, nombre, respuestas, estadoNarrativo} o null si se
// cancela. `tipoSugerido` viene de cómo apareció la palabra: en
// mayúscula → personaje o lugar; en minúscula y desconocida → invento.
export function pedirFicha(nombre, tipoSugerido) {
  return modal((caja, cerrar) => {
    const tipoInicial = tipoSugerido || "personaje";
    caja.innerHTML = `
      <h2>Cuéntanos quién o qué es «${escapaHtml(nombre)}»</h2>
      <p class="texto-suave pequeno">Es la primera vez que aparece en la novela. Explícalo una vez
      y quedará guardado para toda la clase: así nadie se contradice más adelante.</p>
      <div class="campo">
        <label for="ficha-tipo">¿Qué es?</label>
        <select id="ficha-tipo" class="campo-select">
          ${Object.entries(TIPOS).map(([id, t]) =>
            `<option value="${id}"${id === tipoInicial ? " selected" : ""}>${t.icono} ${t.etiqueta}</option>`).join("")}
        </select>
      </div>
      <div id="ficha-preguntas"></div>
      <div class="campo" id="campo-estado">
        <label for="ficha-estado">¿Cómo está ahora en la historia?</label>
        <select id="ficha-estado" class="campo-select">
          ${ESTADOS_NARRATIVOS.map((e) => `<option value="${e}">${e}</option>`).join("")}
        </select>
      </div>
      <p class="error-form" id="ficha-error"></p>
      <div class="modal-botones">
        <button class="btn btn-secundario" id="ficha-cancelar">Ahora no</button>
        <button class="btn btn-principal" id="ficha-guardar">Guardar ficha</button>
      </div>`;

    const selTipo = caja.querySelector("#ficha-tipo");
    const cont = caja.querySelector("#ficha-preguntas");
    const campoEstado = caja.querySelector("#campo-estado");

    function pintarPreguntas() {
      const t = TIPOS[selTipo.value];
      cont.innerHTML = t.preguntas.map((p) => `
        <div class="campo">
          <label for="p-${p.id}">${escapaHtml(p.texto)}</label>
          <textarea id="p-${p.id}" rows="2" data-pregunta="${p.id}"></textarea>
          <p class="pista">${escapaHtml(p.ayuda)}</p>
        </div>`).join("");
      campoEstado.style.display = selTipo.value === "personaje" ? "" : "none";
    }
    pintarPreguntas();
    selTipo.addEventListener("change", pintarPreguntas);

    caja.querySelector("#ficha-cancelar").addEventListener("click", () => cerrar(null));
    caja.querySelector("#ficha-guardar").addEventListener("click", () => {
      const respuestas = {};
      let rellenas = 0;
      cont.querySelectorAll("textarea").forEach((ta) => {
        const v = ta.value.trim();
        respuestas[ta.dataset.pregunta] = v;
        if (v) rellenas++;
      });
      if (rellenas < 2) {
        caja.querySelector("#ficha-error").textContent =
          "Contesta al menos dos preguntas: si no, la ficha no ayuda a nadie.";
        return;
      }
      cerrar({
        tipo: selTipo.value,
        nombre: nombre,
        respuestas: respuestas,
        estadoNarrativo: selTipo.value === "personaje" ? caja.querySelector("#ficha-estado").value : "en la historia",
      });
    });
  }, { cerrarFuera: false });
}

// ---------- ver una ficha ya hecha ----------

export function verFicha(ficha, opciones) {
  const conf = opciones || {};
  const t = TIPOS[ficha.tipo] || TIPOS.personaje;
  return modal((caja, cerrar) => {
    caja.innerHTML = `
      <h2>${t.icono} ${escapaHtml(ficha.nombre)}</h2>
      <p><span class="etiqueta morada">${t.etiqueta}</span>
        ${ficha.tipo === "personaje" ? `<span class="etiqueta">${escapaHtml(ficha.estadoNarrativo || "en la historia")}</span>` : ""}</p>
      <dl class="ficha-detalle">
        ${t.preguntas.map((p) => {
          const r = (ficha.respuestas || {})[p.id];
          return r ? `<dt>${escapaHtml(p.texto)}</dt><dd>${escapaHtml(r)}</dd>` : "";
        }).join("")}
      </dl>
      ${conf.mostrarAutor && ficha.autorCode
        ? `<p class="pequeno texto-suave">Ficha creada por <span class="codigo-alumno">${escapaHtml(ficha.autorCode)}</span></p>` : ""}
      <div class="modal-botones">
        ${conf.puedeEditar ? '<button class="btn btn-secundario" id="ficha-editar">Cambiar el estado</button>' : ""}
        <button class="btn btn-principal" id="ficha-cerrar">Cerrar</button>
      </div>`;
    caja.querySelector("#ficha-cerrar").addEventListener("click", () => cerrar(null));
    const btnEditar = caja.querySelector("#ficha-editar");
    if (btnEditar) {
      btnEditar.addEventListener("click", () => {
        const actual = ESTADOS_NARRATIVOS.indexOf(ficha.estadoNarrativo || "en la historia");
        const siguiente = ESTADOS_NARRATIVOS[(actual + 1) % ESTADOS_NARRATIVOS.length];
        cerrar({ estadoNarrativo: siguiente });
      });
    }
  });
}
