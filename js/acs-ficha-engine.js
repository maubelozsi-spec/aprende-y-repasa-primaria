// ============================================================
// Motor de renderizado de fichas de Apoyo ACS.
//
// Cada ficha (ver js/acs-fichas-data.js) es un objeto de datos con
// un "tipo" de actividad. Este módulo sabe convertir ese objeto en
// DOM de dos formas distintas, sin compartir estado entre ambas:
//
//   - digital: interactiva, se resuelve con clics (nada de arrastrar
//     ni escribir), pensada para quien tiene dificultad motriz fina.
//   - sheet: ficha para imprimir en A4, siempre en blanco (aunque ya
//     se haya practicado en pantalla), para trabajar con lápiz.
//
// Añadir un nuevo tipo de actividad = añadir una entrada a
// ACS_RENDERERS con sus dos funciones. El resto del motor (ficha.html)
// no necesita cambios.
// ============================================================

function acsBarajar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
  return array;
}

function acsCrearSheetBase(ficha) {
  const sheet = document.createElement("div");
  sheet.className = "acs-sheet";

  const nombre = document.createElement("div");
  nombre.className = "acs-sheet-nombre";
  nombre.innerHTML = "<span>Nombre:</span><span>Fecha:</span>";
  sheet.appendChild(nombre);

  const titulo = document.createElement("h2");
  titulo.className = "acs-sheet-titulo";
  titulo.textContent = ficha.titulo;
  sheet.appendChild(titulo);

  const instruccion = document.createElement("p");
  instruccion.className = "acs-sheet-instruccion";
  instruccion.textContent = ficha.instruccion;
  sheet.appendChild(instruccion);

  return sheet;
}

// ---------- unir-parejas ----------
// ficha.pares = [{ texto: "gato" }, ...]
// La palabra también se usa como palabra clave para ARASAAC.

function acsOrdenBarajadoPares(pares) {
  return acsBarajar(pares.map((_, i) => i));
}

function renderUnirParejasDigital(ficha, container) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "acs-digital";

  const instr = document.createElement("p");
  instr.className = "acs-digital-instruccion";
  instr.textContent = ficha.instruccion;
  wrap.appendChild(instr);

  const grid = document.createElement("div");
  grid.className = "acs-parejas";
  const colIzq = document.createElement("div");
  colIzq.className = "acs-parejas-col";
  const colDer = document.createElement("div");
  colDer.className = "acs-parejas-col";

  const itemsIzq = [];
  const itemsDer = [];

  ficha.pares.forEach((par, i) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "acs-pareja-item";
    item.dataset.index = String(i);
    const num = document.createElement("span");
    num.className = "acs-pareja-num";
    num.textContent = i + 1 + ".";
    const texto = document.createElement("span");
    texto.textContent = par.texto;
    item.appendChild(num);
    item.appendChild(texto);
    colIzq.appendChild(item);
    itemsIzq.push(item);
  });

  const ordenDer = acsOrdenBarajadoPares(ficha.pares);
  ordenDer.forEach((parIndex, posicion) => {
    const par = ficha.pares[parIndex];
    const item = document.createElement("button");
    item.type = "button";
    item.className = "acs-pareja-item";
    item.dataset.index = String(parIndex);
    const letra = document.createElement("span");
    letra.className = "acs-pareja-num";
    letra.textContent = String.fromCharCode(65 + posicion) + ".";
    item.appendChild(letra);
    item.appendChild(arasaacCrearImagen(par.texto, { color: true }));
    colDer.appendChild(item);
    itemsDer.push(item);
  });

  grid.appendChild(colIzq);
  grid.appendChild(colDer);
  wrap.appendChild(grid);

  const feedback = document.createElement("p");
  feedback.className = "acs-feedback";
  wrap.appendChild(feedback);
  container.appendChild(wrap);

  let selIzq = null;
  let selDer = null;
  let resueltas = 0;

  function comprobar() {
    const a = selIzq;
    const b = selDer;
    if (a.dataset.index === b.dataset.index) {
      a.classList.remove("selected");
      b.classList.remove("selected");
      a.classList.add("matched");
      b.classList.add("matched");
      a.disabled = true;
      b.disabled = true;
      resueltas++;
      if (resueltas === ficha.pares.length) {
        feedback.textContent = "Muy bien: has unido todas las parejas.";
        feedback.className = "acs-feedback ok";
      }
    } else {
      a.classList.add("error");
      b.classList.add("error");
      setTimeout(() => {
        a.classList.remove("selected", "error");
        b.classList.remove("selected", "error");
      }, 500);
    }
    selIzq = null;
    selDer = null;
  }

  itemsIzq.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("matched")) return;
      if (selIzq) selIzq.classList.remove("selected");
      selIzq = item;
      item.classList.add("selected");
      if (selDer) comprobar();
    });
  });

  itemsDer.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("matched")) return;
      if (selDer) selDer.classList.remove("selected");
      selDer = item;
      item.classList.add("selected");
      if (selIzq) comprobar();
    });
  });
}

function renderUnirParejasSheet(ficha, container) {
  container.innerHTML = "";
  const sheet = acsCrearSheetBase(ficha);

  const grid = document.createElement("div");
  grid.className = "acs-parejas";
  const colIzq = document.createElement("div");
  colIzq.className = "acs-parejas-col";
  const colDer = document.createElement("div");
  colDer.className = "acs-parejas-col";

  ficha.pares.forEach((par, i) => {
    const item = document.createElement("div");
    item.className = "acs-pareja-item";
    const num = document.createElement("span");
    num.className = "acs-pareja-num";
    num.textContent = i + 1 + ".";
    const texto = document.createElement("span");
    texto.textContent = par.texto;
    item.appendChild(num);
    item.appendChild(texto);
    colIzq.appendChild(item);
  });

  const ordenDer = acsOrdenBarajadoPares(ficha.pares);
  ordenDer.forEach((parIndex, posicion) => {
    const par = ficha.pares[parIndex];
    const item = document.createElement("div");
    item.className = "acs-pareja-item";
    const letra = document.createElement("span");
    letra.className = "acs-pareja-num";
    letra.textContent = String.fromCharCode(65 + posicion) + ".";
    item.appendChild(letra);
    item.appendChild(arasaacCrearImagen(par.texto, { color: false }));
    colDer.appendChild(item);
  });

  grid.appendChild(colIzq);
  grid.appendChild(colDer);
  sheet.appendChild(grid);
  container.appendChild(sheet);
}

// ---------- elegir-opcion ----------
// ficha.items = [{
//   prompt: "El sol es amarillo.",
//   conteo: { clave: "manzana", cantidad: 4 } | null,
//   opciones: [{ clave: "sol", correcta: true }, { clave: "luna", correcta: false }]
//     u opciones de solo texto: [{ texto: "4", correcta: true }, ...]
// }]

function acsCrearOpcionContenido(op) {
  if (op.texto) {
    const span = document.createElement("span");
    span.className = "acs-opcion-texto";
    span.style.fontSize = "34px";
    span.style.fontWeight = "800";
    span.textContent = op.texto;
    return span;
  }
  return arasaacCrearImagen(op.clave, { color: true });
}

function renderElegirOpcionDigital(ficha, container) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "acs-digital";

  const instr = document.createElement("p");
  instr.className = "acs-digital-instruccion";
  instr.textContent = ficha.instruccion;
  wrap.appendChild(instr);

  ficha.items.forEach((item, idx) => {
    const bloque = document.createElement("div");
    bloque.className = "acs-opcion-bloque";

    const prompt = document.createElement("p");
    prompt.className = "acs-opcion-prompt";
    prompt.textContent = idx + 1 + ". " + item.prompt;
    bloque.appendChild(prompt);

    if (item.conteo) {
      const fila = document.createElement("div");
      fila.className = "acs-opcion-conteo";
      for (let i = 0; i < item.conteo.cantidad; i++) {
        fila.appendChild(arasaacCrearImagen(item.conteo.clave, { color: true, alt: item.conteo.clave }));
      }
      bloque.appendChild(fila);
    }

    const opciones = document.createElement("div");
    opciones.className = "acs-opciones";

    item.opciones.forEach((op) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "acs-opcion-item";
      btn.appendChild(acsCrearOpcionContenido(op));
      btn.addEventListener("click", () => {
        if (opciones.querySelector(".correcta")) return;
        if (op.correcta) {
          btn.classList.add("correcta");
          opciones.querySelectorAll("button").forEach((b) => {
            b.disabled = true;
          });
        } else {
          btn.classList.add("incorrecta");
          setTimeout(() => btn.classList.remove("incorrecta"), 500);
        }
      });
      opciones.appendChild(btn);
    });

    bloque.appendChild(opciones);
    wrap.appendChild(bloque);
  });

  container.appendChild(wrap);
}

function renderElegirOpcionSheet(ficha, container) {
  container.innerHTML = "";
  const sheet = acsCrearSheetBase(ficha);

  ficha.items.forEach((item, idx) => {
    const bloque = document.createElement("div");
    bloque.className = "acs-opcion-bloque";

    const prompt = document.createElement("p");
    prompt.className = "acs-opcion-prompt";
    prompt.style.textAlign = "left";
    prompt.textContent = idx + 1 + ". " + item.prompt;
    bloque.appendChild(prompt);

    if (item.conteo) {
      const fila = document.createElement("div");
      fila.className = "acs-opcion-conteo";
      fila.style.justifyContent = "flex-start";
      for (let i = 0; i < item.conteo.cantidad; i++) {
        fila.appendChild(arasaacCrearImagen(item.conteo.clave, { color: false, alt: item.conteo.clave }));
      }
      bloque.appendChild(fila);
    }

    const opciones = document.createElement("div");
    opciones.className = "acs-opciones";
    opciones.style.justifyContent = "flex-start";

    item.opciones.forEach((op) => {
      const caja = document.createElement("div");
      caja.className = "acs-opcion-item";
      caja.appendChild(op.texto ? acsCrearOpcionContenido(op) : arasaacCrearImagen(op.clave, { color: false }));
      opciones.appendChild(caja);
    });

    bloque.appendChild(opciones);
    sheet.appendChild(bloque);
  });

  container.appendChild(sheet);
}

// ---------- mayor-menor-igual ----------
// ficha.pares = [[3, 7], [5, 5], ...]

function acsComparar(a, b) {
  if (a > b) return ">";
  if (a < b) return "<";
  return "=";
}

function renderMayorMenorIgualDigital(ficha, container) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "acs-digital";

  const instr = document.createElement("p");
  instr.className = "acs-digital-instruccion";
  instr.textContent = ficha.instruccion;
  wrap.appendChild(instr);

  ficha.pares.forEach((par) => {
    const [a, b] = par;
    const correcta = acsComparar(a, b);

    const bloque = document.createElement("div");
    bloque.className = "acs-mmi-bloque";

    const fila = document.createElement("div");
    fila.className = "acs-mmi-fila";
    const numA = document.createElement("span");
    numA.className = "acs-mmi-num";
    numA.textContent = String(a);
    const hueco = document.createElement("span");
    hueco.className = "acs-mmi-num";
    hueco.style.minWidth = "70px";
    hueco.style.textAlign = "center";
    const numB = document.createElement("span");
    numB.className = "acs-mmi-num";
    numB.textContent = String(b);
    fila.appendChild(numA);
    fila.appendChild(hueco);
    fila.appendChild(numB);
    bloque.appendChild(fila);

    const botones = document.createElement("div");
    botones.className = "acs-mmi-botones";
    [">", "<", "="].forEach((simbolo) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "acs-mmi-btn";
      btn.textContent = simbolo;
      btn.addEventListener("click", () => {
        if (botones.querySelector(".correcta")) return;
        if (simbolo === correcta) {
          hueco.textContent = simbolo;
          btn.classList.add("correcta");
          botones.querySelectorAll("button").forEach((b) => {
            b.disabled = true;
          });
        } else {
          btn.classList.add("incorrecta");
          setTimeout(() => btn.classList.remove("incorrecta"), 500);
        }
      });
      botones.appendChild(btn);
    });
    bloque.appendChild(botones);
    wrap.appendChild(bloque);
  });

  container.appendChild(wrap);
}

function renderMayorMenorIgualSheet(ficha, container) {
  container.innerHTML = "";
  const sheet = acsCrearSheetBase(ficha);

  ficha.pares.forEach((par) => {
    const [a, b] = par;
    const fila = document.createElement("div");
    fila.className = "acs-mmi-fila";
    const numA = document.createElement("span");
    numA.className = "acs-mmi-num";
    numA.textContent = String(a);
    const hueco = document.createElement("span");
    hueco.className = "acs-mmi-hueco";
    const numB = document.createElement("span");
    numB.className = "acs-mmi-num";
    numB.textContent = String(b);
    fila.appendChild(numA);
    fila.appendChild(hueco);
    fila.appendChild(numB);
    sheet.appendChild(fila);
  });

  const leyenda = document.createElement("p");
  leyenda.className = "acs-sheet-instruccion";
  leyenda.style.marginTop = "20px";
  leyenda.style.fontSize = "16px";
  leyenda.textContent = "> mayor que      < menor que      = igual que";
  sheet.appendChild(leyenda);

  container.appendChild(sheet);
}

// ---------- registro de tipos y arranque ----------

const ACS_RENDERERS = {
  "unir-parejas": { digital: renderUnirParejasDigital, sheet: renderUnirParejasSheet },
  "elegir-opcion": { digital: renderElegirOpcionDigital, sheet: renderElegirOpcionSheet },
  "mayor-menor-igual": { digital: renderMayorMenorIgualDigital, sheet: renderMayorMenorIgualSheet },
};

function initAcsFicha(ficha, digitalEl, sheetEl) {
  const renderer = ACS_RENDERERS[ficha.tipo];
  if (!renderer) {
    digitalEl.textContent = "Tipo de actividad no reconocido: " + ficha.tipo;
    return;
  }
  renderer.digital(ficha, digitalEl);
  renderer.sheet(ficha, sheetEl);
}
