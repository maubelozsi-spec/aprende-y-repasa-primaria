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
// ficha.pares = [{ izquierda: "gato", derecha: "gato" }, ...]
// ficha.modoDerecha = "imagen" (por defecto: busca "derecha" como
// palabra clave en ARASAAC) | "texto" (escribe "derecha" tal cual,
// para unir sílabas o unir con la segunda mitad de una palabra).

function acsOrdenBarajadoPares(pares) {
  return acsBarajar(pares.map((_, i) => i));
}

function acsCrearContenidoDerecha(ficha, par, digital) {
  if (ficha.modoDerecha === "texto") {
    const span = document.createElement("span");
    span.className = "acs-pareja-texto-derecha";
    span.textContent = par.derecha;
    return span;
  }
  return arasaacCrearImagen(par.derecha, { color: digital });
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
    texto.textContent = par.izquierda;
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
    item.appendChild(acsCrearContenidoDerecha(ficha, par, true));
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
    texto.textContent = par.izquierda;
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
    item.appendChild(acsCrearContenidoDerecha(ficha, par, false));
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

// ---------- operacion-visual (suma o resta) ----------
// ficha.items = [{ clave: "manzana", a: 5, b: 2, operador: "+" | "−" }]
// resultado = operador === "+" ? a + b : a - b (siempre entre 0 y 10)

function acsCrearCajaConteo(clave, cantidad, digital) {
  const caja = document.createElement("div");
  caja.className = "acs-resta-caja";
  for (let i = 0; i < cantidad; i++) {
    caja.appendChild(arasaacCrearImagen(clave, { color: digital, alt: clave }));
  }
  return caja;
}

function acsResultadoOperacion(item) {
  return item.operador === "+" ? item.a + item.b : item.a - item.b;
}

function acsOpcionesNumericasCercanas(resultado) {
  const opciones = [resultado];
  if (resultado > 0) opciones.push(resultado - 1);
  opciones.push(resultado + 1);
  while (opciones.length < 3) opciones.push(resultado + opciones.length);
  return acsBarajar(opciones.slice(0, 3));
}

function acsCrearFilaOperacion(item, digital) {
  const fila = document.createElement("div");
  fila.className = "acs-resta-fila";
  fila.appendChild(acsCrearCajaConteo(item.clave, item.a, digital));
  const signo = document.createElement("span");
  signo.className = "acs-resta-signo";
  signo.textContent = item.operador;
  fila.appendChild(signo);
  fila.appendChild(acsCrearCajaConteo(item.clave, item.b, digital));
  const signoIgual = document.createElement("span");
  signoIgual.className = "acs-resta-signo";
  signoIgual.textContent = "=";
  fila.appendChild(signoIgual);
  return fila;
}

function renderOperacionVisualDigital(ficha, container) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "acs-digital";

  const instr = document.createElement("p");
  instr.className = "acs-digital-instruccion";
  instr.textContent = ficha.instruccion;
  wrap.appendChild(instr);

  ficha.items.forEach((item) => {
    const resultado = acsResultadoOperacion(item);

    const bloque = document.createElement("div");
    bloque.className = "acs-resta-bloque";
    bloque.appendChild(acsCrearFilaOperacion(item, true));

    const opciones = document.createElement("div");
    opciones.className = "acs-opciones";
    acsOpcionesNumericasCercanas(resultado).forEach((valor) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "acs-opcion-item";
      const span = document.createElement("span");
      span.style.fontSize = "34px";
      span.style.fontWeight = "800";
      span.textContent = String(valor);
      btn.appendChild(span);
      btn.addEventListener("click", () => {
        if (opciones.querySelector(".correcta")) return;
        if (valor === resultado) {
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

function renderOperacionVisualSheet(ficha, container) {
  container.innerHTML = "";
  const sheet = acsCrearSheetBase(ficha);

  ficha.items.forEach((item) => {
    const fila = acsCrearFilaOperacion(item, false);
    const hueco = document.createElement("span");
    hueco.className = "acs-mmi-hueco";
    fila.appendChild(hueco);
    sheet.appendChild(fila);
  });

  container.appendChild(sheet);
}

// ---------- ordenar-letras ----------
// ficha.items = [{ palabra: "sol" }, ...]

function acsBarajarLetras(palabra) {
  let letras;
  do {
    letras = acsBarajar(palabra.split(""));
  } while (letras.join("") === palabra && palabra.length > 1);
  return letras;
}

function renderOrdenarLetrasDigital(ficha, container) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "acs-digital";

  const instr = document.createElement("p");
  instr.className = "acs-digital-instruccion";
  instr.textContent = ficha.instruccion;
  wrap.appendChild(instr);

  ficha.items.forEach((item) => {
    const palabra = item.palabra;
    const bloque = document.createElement("div");
    bloque.className = "acs-letras-bloque";

    bloque.appendChild(arasaacCrearImagen(palabra, { color: true }));

    const slotsWrap = document.createElement("div");
    slotsWrap.className = "acs-letras-slots";
    const slots = [];
    for (let i = 0; i < palabra.length; i++) {
      const slot = document.createElement("button");
      slot.type = "button";
      slot.className = "acs-letra-slot";
      slots.push(slot);
      slotsWrap.appendChild(slot);
    }
    bloque.appendChild(slotsWrap);

    const bancoWrap = document.createElement("div");
    bancoWrap.className = "acs-letras-banco";
    bloque.appendChild(bancoWrap);

    // Cada hueco de "slots" guarda, mientras está lleno, el botón del
    // banco que puso esa letra (slot._origen), para poder devolverla
    // con un clic si se ha ordenado mal, sin esperar ni arrastrar.
    function letrasActuales() {
      return slots.map((s) => s.textContent).join("");
    }

    function comprobarCompleto() {
      if (!slots.every((s) => s.textContent)) return;
      if (letrasActuales() === palabra) {
        slots.forEach((s) => {
          s.classList.remove("error");
          s.classList.add("correcta");
          s.disabled = true;
        });
      } else {
        slots.forEach((s) => s.classList.add("error"));
        setTimeout(() => slots.forEach((s) => s.classList.remove("error")), 600);
      }
    }

    slots.forEach((slot) => {
      slot.addEventListener("click", () => {
        if (!slot.textContent || slot.classList.contains("correcta")) return;
        slot._origen.disabled = false;
        slot._origen.classList.remove("usada");
        slot._origen = null;
        slot.textContent = "";
        slot.classList.remove("error");
      });
    });

    acsBarajarLetras(palabra).forEach((letra) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "acs-letra-banco";
      btn.textContent = letra;
      btn.addEventListener("click", () => {
        const libre = slots.find((s) => !s.textContent);
        if (!libre) return;
        libre.textContent = letra;
        libre._origen = btn;
        btn.disabled = true;
        btn.classList.add("usada");
        comprobarCompleto();
      });
      bancoWrap.appendChild(btn);
    });

    wrap.appendChild(bloque);
  });

  container.appendChild(wrap);
}

function renderOrdenarLetrasSheet(ficha, container) {
  container.innerHTML = "";
  const sheet = acsCrearSheetBase(ficha);

  ficha.items.forEach((item) => {
    const palabra = item.palabra;
    const bloque = document.createElement("div");
    bloque.className = "acs-letras-bloque";

    bloque.appendChild(arasaacCrearImagen(palabra, { color: false }));

    const letrasWrap = document.createElement("div");
    letrasWrap.className = "acs-letras-slots";
    acsBarajarLetras(palabra).forEach((letra) => {
      const caja = document.createElement("span");
      caja.className = "acs-letra-slot acs-letra-slot-impresa";
      caja.textContent = letra;
      letrasWrap.appendChild(caja);
    });
    bloque.appendChild(letrasWrap);

    const huecos = document.createElement("div");
    huecos.className = "acs-letras-slots";
    for (let i = 0; i < palabra.length; i++) {
      const hueco = document.createElement("span");
      hueco.className = "acs-letra-slot";
      huecos.appendChild(hueco);
    }
    bloque.appendChild(huecos);

    sheet.appendChild(bloque);
  });

  container.appendChild(sheet);
}

// ---------- completar-a-10 (amigos del diez) ----------
// ficha.items = [{ a: 3 }]  (b = 10 - a, siempre entre 0 y 10)

function acsCrearFilaCompletarA10(a, huecoClase) {
  const fila = document.createElement("div");
  fila.className = "acs-mmi-fila";
  const numA = document.createElement("span");
  numA.className = "acs-mmi-num";
  numA.textContent = String(a);
  const signoMas = document.createElement("span");
  signoMas.className = "acs-resta-signo";
  signoMas.textContent = "+";
  const hueco = document.createElement("span");
  hueco.className = huecoClase;
  const signoIgual = document.createElement("span");
  signoIgual.className = "acs-resta-signo";
  signoIgual.textContent = "=";
  const num10 = document.createElement("span");
  num10.className = "acs-mmi-num";
  num10.textContent = "10";
  fila.appendChild(numA);
  fila.appendChild(signoMas);
  fila.appendChild(hueco);
  fila.appendChild(signoIgual);
  fila.appendChild(num10);
  return { fila, hueco };
}

function renderCompletarA10Digital(ficha, container) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "acs-digital";

  const instr = document.createElement("p");
  instr.className = "acs-digital-instruccion";
  instr.textContent = ficha.instruccion;
  wrap.appendChild(instr);

  ficha.items.forEach((item) => {
    const correcta = 10 - item.a;
    const bloque = document.createElement("div");
    bloque.className = "acs-mmi-bloque";

    const { fila, hueco } = acsCrearFilaCompletarA10(item.a, "acs-mmi-num");
    hueco.style.minWidth = "70px";
    hueco.style.textAlign = "center";
    bloque.appendChild(fila);

    const opciones = document.createElement("div");
    opciones.className = "acs-opciones";
    acsOpcionesNumericasCercanas(correcta).forEach((valor) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "acs-opcion-item";
      const span = document.createElement("span");
      span.style.fontSize = "34px";
      span.style.fontWeight = "800";
      span.textContent = String(valor);
      btn.appendChild(span);
      btn.addEventListener("click", () => {
        if (opciones.querySelector(".correcta")) return;
        if (valor === correcta) {
          hueco.textContent = String(valor);
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

function renderCompletarA10Sheet(ficha, container) {
  container.innerHTML = "";
  const sheet = acsCrearSheetBase(ficha);

  ficha.items.forEach((item) => {
    const { fila } = acsCrearFilaCompletarA10(item.a, "acs-mmi-hueco");
    sheet.appendChild(fila);
  });

  container.appendChild(sheet);
}

// ---------- antes-despues ----------
// ficha.items = [{ n: 7, modo: "antes" | "despues" }]

function acsResultadoAntesDespues(item) {
  return item.modo === "despues" ? item.n + 1 : item.n - 1;
}

function acsCrearFilaAntesDespues(item, huecoClase) {
  const fila = document.createElement("div");
  fila.className = "acs-mmi-fila";
  const numConocido = document.createElement("span");
  numConocido.className = "acs-mmi-num";
  numConocido.textContent = String(item.n);
  const hueco = document.createElement("span");
  hueco.className = huecoClase;
  if (item.modo === "despues") {
    fila.appendChild(numConocido);
    fila.appendChild(hueco);
  } else {
    fila.appendChild(hueco);
    fila.appendChild(numConocido);
  }
  return { fila, hueco };
}

function renderAntesDespuesDigital(ficha, container) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "acs-digital";

  const instr = document.createElement("p");
  instr.className = "acs-digital-instruccion";
  instr.textContent = ficha.instruccion;
  wrap.appendChild(instr);

  ficha.items.forEach((item) => {
    const correcta = acsResultadoAntesDespues(item);
    const bloque = document.createElement("div");
    bloque.className = "acs-mmi-bloque";

    const { fila, hueco } = acsCrearFilaAntesDespues(item, "acs-mmi-num");
    hueco.style.minWidth = "70px";
    hueco.style.textAlign = "center";
    bloque.appendChild(fila);

    const opciones = document.createElement("div");
    opciones.className = "acs-opciones";
    acsOpcionesNumericasCercanas(correcta).forEach((valor) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "acs-opcion-item";
      const span = document.createElement("span");
      span.style.fontSize = "34px";
      span.style.fontWeight = "800";
      span.textContent = String(valor);
      btn.appendChild(span);
      btn.addEventListener("click", () => {
        if (opciones.querySelector(".correcta")) return;
        if (valor === correcta) {
          hueco.textContent = String(valor);
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

function renderAntesDespuesSheet(ficha, container) {
  container.innerHTML = "";
  const sheet = acsCrearSheetBase(ficha);

  ficha.items.forEach((item) => {
    const { fila } = acsCrearFilaAntesDespues(item, "acs-mmi-hueco");
    sheet.appendChild(fila);
  });

  container.appendChild(sheet);
}

// ---------- grupos-iguales (multiplicación inicial) ----------
// ficha.items = [{ clave: "pelota", grupos: 3, porGrupo: 2 }]

function acsCrearFilaGrupos(item, digital) {
  const fila = document.createElement("div");
  fila.className = "acs-grupos-fila";
  for (let g = 0; g < item.grupos; g++) {
    fila.appendChild(acsCrearCajaConteo(item.clave, item.porGrupo, digital));
  }
  return fila;
}

function renderGruposIgualesDigital(ficha, container) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "acs-digital";

  const instr = document.createElement("p");
  instr.className = "acs-digital-instruccion";
  instr.textContent = ficha.instruccion;
  wrap.appendChild(instr);

  ficha.items.forEach((item) => {
    const resultado = item.grupos * item.porGrupo;
    const bloque = document.createElement("div");
    bloque.className = "acs-resta-bloque";
    bloque.appendChild(acsCrearFilaGrupos(item, true));

    const opciones = document.createElement("div");
    opciones.className = "acs-opciones";
    acsOpcionesNumericasCercanas(resultado).forEach((valor) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "acs-opcion-item";
      const span = document.createElement("span");
      span.style.fontSize = "34px";
      span.style.fontWeight = "800";
      span.textContent = String(valor);
      btn.appendChild(span);
      btn.addEventListener("click", () => {
        if (opciones.querySelector(".correcta")) return;
        if (valor === resultado) {
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

function renderGruposIgualesSheet(ficha, container) {
  container.innerHTML = "";
  const sheet = acsCrearSheetBase(ficha);

  ficha.items.forEach((item) => {
    const fila = acsCrearFilaGrupos(item, false);
    const signoIgual = document.createElement("span");
    signoIgual.className = "acs-resta-signo";
    signoIgual.textContent = "=";
    fila.appendChild(signoIgual);
    const hueco = document.createElement("span");
    hueco.className = "acs-mmi-hueco";
    fila.appendChild(hueco);
    sheet.appendChild(fila);
  });

  container.appendChild(sheet);
}

// ---------- reparto (división inicial) ----------
// ficha.items = [{ clave: "manzana", total: 6, grupos: 3 }]
// resultado = total / grupos (el generador solo produce repartos exactos)

function acsCrearFilaReparto(item, digital) {
  const wrap = document.createElement("div");
  wrap.className = "acs-reparto-wrap";
  wrap.appendChild(acsCrearCajaConteo(item.clave, item.total, digital));
  const cestas = document.createElement("div");
  cestas.className = "acs-reparto-cestas";
  for (let g = 0; g < item.grupos; g++) {
    const cesta = document.createElement("div");
    cesta.className = "acs-reparto-cesta";
    cestas.appendChild(cesta);
  }
  wrap.appendChild(cestas);
  return wrap;
}

function renderRepartoDigital(ficha, container) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "acs-digital";

  const instr = document.createElement("p");
  instr.className = "acs-digital-instruccion";
  instr.textContent = ficha.instruccion;
  wrap.appendChild(instr);

  ficha.items.forEach((item) => {
    const resultado = item.total / item.grupos;
    const bloque = document.createElement("div");
    bloque.className = "acs-resta-bloque";
    bloque.appendChild(acsCrearFilaReparto(item, true));

    const opciones = document.createElement("div");
    opciones.className = "acs-opciones";
    acsOpcionesNumericasCercanas(resultado).forEach((valor) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "acs-opcion-item";
      const span = document.createElement("span");
      span.style.fontSize = "34px";
      span.style.fontWeight = "800";
      span.textContent = String(valor);
      btn.appendChild(span);
      btn.addEventListener("click", () => {
        if (opciones.querySelector(".correcta")) return;
        if (valor === resultado) {
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

function renderRepartoSheet(ficha, container) {
  container.innerHTML = "";
  const sheet = acsCrearSheetBase(ficha);

  ficha.items.forEach((item) => {
    sheet.appendChild(acsCrearFilaReparto(item, false));
  });

  container.appendChild(sheet);
}

// ---------- clasificar (TEACCH: emparejar por categoría) ----------
// ficha.categorias = [{ id: "animales", etiqueta: "Animales" }, ...]
// ficha.items = [{ clave: "gato", categoria: "animales" }, ...]

function renderClasificarDigital(ficha, container) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "acs-digital";

  const instr = document.createElement("p");
  instr.className = "acs-digital-instruccion";
  instr.textContent = ficha.instruccion;
  wrap.appendChild(instr);

  const banco = document.createElement("div");
  banco.className = "acs-clasificar-banco";
  wrap.appendChild(banco);

  const categoriasWrap = document.createElement("div");
  categoriasWrap.className = "acs-clasificar-categorias";
  wrap.appendChild(categoriasWrap);

  const areasPorCategoria = {};
  const cajasCategoria = [];
  ficha.categorias.forEach((cat) => {
    const caja = document.createElement("div");
    caja.className = "acs-clasificar-categoria";
    caja.dataset.categoria = cat.id;
    const titulo = document.createElement("p");
    titulo.className = "acs-clasificar-categoria-titulo";
    titulo.textContent = cat.etiqueta;
    caja.appendChild(titulo);
    const area = document.createElement("div");
    area.className = "acs-clasificar-categoria-area";
    caja.appendChild(area);
    categoriasWrap.appendChild(caja);
    areasPorCategoria[cat.id] = area;
    cajasCategoria.push(caja);
  });

  const feedback = document.createElement("p");
  feedback.className = "acs-feedback";
  wrap.appendChild(feedback);

  let seleccionado = null;
  let resueltos = 0;

  ficha.items.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "acs-clasificar-item";
    btn.appendChild(arasaacCrearImagen(item.clave, { color: true }));
    btn._item = item;
    btn.addEventListener("click", () => {
      if (btn.classList.contains("matched")) return;
      if (seleccionado) seleccionado.classList.remove("selected");
      seleccionado = btn;
      btn.classList.add("selected");
    });
    banco.appendChild(btn);
  });

  cajasCategoria.forEach((caja) => {
    caja.addEventListener("click", () => {
      if (!seleccionado) return;
      const item = seleccionado._item;
      if (item.categoria === caja.dataset.categoria) {
        seleccionado.classList.remove("selected");
        seleccionado.classList.add("matched");
        seleccionado.disabled = true;
        areasPorCategoria[caja.dataset.categoria].appendChild(seleccionado);
        seleccionado = null;
        resueltos++;
        if (resueltos === ficha.items.length) {
          feedback.textContent = "Muy bien: has clasificado todo.";
          feedback.className = "acs-feedback ok";
        }
      } else {
        caja.classList.add("error");
        setTimeout(() => caja.classList.remove("error"), 500);
      }
    });
  });

  container.appendChild(wrap);
}

function renderClasificarSheet(ficha, container) {
  container.innerHTML = "";
  const sheet = acsCrearSheetBase(ficha);

  const banco = document.createElement("div");
  banco.className = "acs-clasificar-banco";
  ficha.items.forEach((item, i) => {
    const casilla = document.createElement("div");
    casilla.className = "acs-clasificar-item-impreso";
    casilla.appendChild(arasaacCrearImagen(item.clave, { color: false }));
    const letra = document.createElement("span");
    letra.className = "acs-pareja-num";
    letra.textContent = String.fromCharCode(65 + i);
    casilla.appendChild(letra);
    banco.appendChild(casilla);
  });
  sheet.appendChild(banco);

  const categoriasWrap = document.createElement("div");
  categoriasWrap.className = "acs-clasificar-categorias";
  ficha.categorias.forEach((cat) => {
    const caja = document.createElement("div");
    caja.className = "acs-clasificar-categoria";
    const titulo = document.createElement("p");
    titulo.className = "acs-clasificar-categoria-titulo";
    titulo.textContent = cat.etiqueta;
    caja.appendChild(titulo);
    const area = document.createElement("div");
    area.className = "acs-clasificar-categoria-area acs-clasificar-categoria-area-impresa";
    caja.appendChild(area);
    categoriasWrap.appendChild(caja);
  });
  sheet.appendChild(categoriasWrap);

  container.appendChild(sheet);
}

// ---------- ordenar-secuencia (viñetas de una rutina o historia) ----------
// ficha.pasos = [{ clave: "despertarse" }, { clave: "desayunar" }, ...] (orden correcto)

function renderOrdenarSecuenciaDigital(ficha, container) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "acs-digital";

  const instr = document.createElement("p");
  instr.className = "acs-digital-instruccion";
  instr.textContent = ficha.instruccion;
  wrap.appendChild(instr);

  const slotsWrap = document.createElement("div");
  slotsWrap.className = "acs-secuencia-slots";
  const slots = ficha.pasos.map((_, i) => {
    const slot = document.createElement("div");
    slot.className = "acs-secuencia-slot";
    const numero = document.createElement("span");
    numero.className = "acs-pareja-num";
    numero.textContent = String(i + 1);
    slot.appendChild(numero);
    const hueco = document.createElement("button");
    hueco.type = "button";
    hueco.className = "acs-secuencia-hueco";
    slot.appendChild(hueco);
    slotsWrap.appendChild(slot);
    return hueco;
  });
  wrap.appendChild(slotsWrap);

  const bancoWrap = document.createElement("div");
  bancoWrap.className = "acs-secuencia-banco";
  wrap.appendChild(bancoWrap);

  function pasosActuales() {
    return slots.map((s) => (s._paso ? s._paso : null));
  }

  function comprobarCompleto() {
    if (!slots.every((s) => s._paso)) return;
    const correcto = slots.every((s, i) => s._paso === ficha.pasos[i]);
    if (correcto) {
      slots.forEach((s) => {
        s.classList.remove("error");
        s.classList.add("correcta");
        s.disabled = true;
      });
    } else {
      slots.forEach((s) => s.classList.add("error"));
      setTimeout(() => slots.forEach((s) => s.classList.remove("error")), 600);
    }
  }

  slots.forEach((hueco) => {
    hueco.addEventListener("click", () => {
      if (!hueco._origen || hueco.classList.contains("correcta")) return;
      hueco._origen.disabled = false;
      hueco._origen.classList.remove("usada");
      hueco._origen = null;
      hueco._paso = null;
      hueco.innerHTML = "";
      hueco.classList.remove("error");
    });
  });

  acsBarajar(ficha.pasos.slice()).forEach((paso) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "acs-secuencia-item";
    btn.appendChild(arasaacCrearImagen(paso.clave, { color: true }));
    btn.addEventListener("click", () => {
      const libre = slots.find((s) => !s._paso);
      if (!libre) return;
      libre.innerHTML = "";
      libre.appendChild(arasaacCrearImagen(paso.clave, { color: true }));
      libre._paso = paso;
      libre._origen = btn;
      btn.disabled = true;
      btn.classList.add("usada");
      comprobarCompleto();
    });
    bancoWrap.appendChild(btn);
  });

  container.appendChild(wrap);
}

function renderOrdenarSecuenciaSheet(ficha, container) {
  container.innerHTML = "";
  const sheet = acsCrearSheetBase(ficha);

  const bancoWrap = document.createElement("div");
  bancoWrap.className = "acs-secuencia-banco";
  acsBarajar(ficha.pasos.slice()).forEach((paso, i) => {
    const casilla = document.createElement("div");
    casilla.className = "acs-clasificar-item-impreso";
    casilla.appendChild(arasaacCrearImagen(paso.clave, { color: false }));
    const letra = document.createElement("span");
    letra.className = "acs-pareja-num";
    letra.textContent = String.fromCharCode(65 + i);
    casilla.appendChild(letra);
    bancoWrap.appendChild(casilla);
  });
  sheet.appendChild(bancoWrap);

  const slotsWrap = document.createElement("div");
  slotsWrap.className = "acs-secuencia-slots";
  ficha.pasos.forEach((_, i) => {
    const slot = document.createElement("div");
    slot.className = "acs-secuencia-slot";
    const numero = document.createElement("span");
    numero.className = "acs-pareja-num";
    numero.textContent = String(i + 1);
    slot.appendChild(numero);
    const hueco = document.createElement("span");
    hueco.className = "acs-secuencia-hueco acs-secuencia-hueco-impreso";
    slot.appendChild(hueco);
    slotsWrap.appendChild(slot);
  });
  sheet.appendChild(slotsWrap);

  container.appendChild(sheet);
}

// ---------- registro de tipos y arranque ----------

const ACS_RENDERERS = {
  "unir-parejas": { digital: renderUnirParejasDigital, sheet: renderUnirParejasSheet },
  "elegir-opcion": { digital: renderElegirOpcionDigital, sheet: renderElegirOpcionSheet },
  "mayor-menor-igual": { digital: renderMayorMenorIgualDigital, sheet: renderMayorMenorIgualSheet },
  "operacion-visual": { digital: renderOperacionVisualDigital, sheet: renderOperacionVisualSheet },
  "ordenar-letras": { digital: renderOrdenarLetrasDigital, sheet: renderOrdenarLetrasSheet },
  "completar-a-10": { digital: renderCompletarA10Digital, sheet: renderCompletarA10Sheet },
  "antes-despues": { digital: renderAntesDespuesDigital, sheet: renderAntesDespuesSheet },
  "grupos-iguales": { digital: renderGruposIgualesDigital, sheet: renderGruposIgualesSheet },
  "reparto": { digital: renderRepartoDigital, sheet: renderRepartoSheet },
  "clasificar": { digital: renderClasificarDigital, sheet: renderClasificarSheet },
  "ordenar-secuencia": { digital: renderOrdenarSecuenciaDigital, sheet: renderOrdenarSecuenciaSheet },
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

// Devuelve la clave de respuestas de una ficha como líneas de texto,
// para el Generador de cuaderno (acs/generador.html) en modo examen.
// No hace falta cargar pictogramas: es solo para que quien corrija
// compruebe rápido, así que se apoya en las palabras/números tal
// cual, sin ir a buscar la imagen a ARASAAC.
function acsClaveRespuestas(ficha) {
  switch (ficha.tipo) {
    case "unir-parejas":
      return ficha.pares.map((par, i) => `${i + 1}. ${par.izquierda} → ${par.derecha}`);
    case "elegir-opcion":
      return ficha.items.map((item, i) => {
        const correcta = item.opciones.find((op) => op.correcta);
        return `${i + 1}. ${item.prompt || "¿Cuántos hay?"} → ${correcta.texto || correcta.clave}`;
      });
    case "mayor-menor-igual":
      return ficha.pares.map((par, i) => `${i + 1}. ${par[0]} ${acsComparar(par[0], par[1])} ${par[1]}`);
    case "operacion-visual":
      return ficha.items.map((item, i) => `${i + 1}. ${item.a} ${item.operador} ${item.b} = ${acsResultadoOperacion(item)}`);
    case "ordenar-letras":
      return ficha.items.map((item, i) => `${i + 1}. ${item.palabra}`);
    case "completar-a-10":
      return ficha.items.map((item, i) => `${i + 1}. ${item.a} + ${10 - item.a} = 10`);
    case "antes-despues":
      return ficha.items.map((item, i) => `${i + 1}. ${item.modo === "despues" ? item.n : acsResultadoAntesDespues(item)} < ${item.modo === "despues" ? acsResultadoAntesDespues(item) : item.n}`);
    case "grupos-iguales":
      return ficha.items.map((item, i) => `${i + 1}. ${item.grupos} grupos de ${item.porGrupo} = ${item.grupos * item.porGrupo}`);
    case "reparto":
      return ficha.items.map((item, i) => `${i + 1}. ${item.total} repartido en ${item.grupos} = ${item.total / item.grupos} en cada uno`);
    case "clasificar":
      return ficha.items.map((item, i) => {
        const etiqueta = ficha.categorias.find((c) => c.id === item.categoria);
        return `${String.fromCharCode(65 + i)}. ${item.clave} → ${etiqueta ? etiqueta.etiqueta : item.categoria}`;
      });
    case "ordenar-secuencia":
      return ficha.pasos.map((paso, i) => `${i + 1}. ${paso.clave}`);
    default:
      return [];
  }
}
