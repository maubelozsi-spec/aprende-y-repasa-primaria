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

// Antes de imprimir, espera a que terminen de resolverse los
// pictogramas pendientes: mientras se busca su id en ARASAAC, el
// <img> no tiene "src" (ver arasaacCrearImagen en js/arasaac.js), así
// que imprimir en ese momento deja el cuadro vacío en vez de mostrar
// el pictograma o, si ha fallado, el recuadro alternativo con la
// palabra. Tope de 6s: mejor imprimir con algún pictograma sin
// resolver (solo pasaría con una conexión muy lenta) que dejar a
// quien imprime esperando si algo se queda colgado.
function acsEsperarImagenesEImprimir() {
  const limite = Date.now() + 6000;
  (function comprobar() {
    if (document.querySelectorAll(".acs-pic-cargando").length === 0 || Date.now() > limite) {
      window.print();
      return;
    }
    setTimeout(comprobar, 150);
  })();
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
  // Algunas actividades se explican distinto en pantalla ("clica...")
  // que en papel ("escribe la letra..."): si la ficha trae una
  // instrucción propia para imprimir, se usa esa; si no, la misma de
  // siempre sirve para las dos.
  instruccion.textContent = ficha.instruccionImpresion || ficha.instruccion;
  sheet.appendChild(instruccion);

  return sheet;
}

// ---------- iconos SVG propios (líneas y formas geométricas) ----------
//
// Para líneas y formas no hace falta ARASAAC: son formas abstractas
// que se dibujan igual de bien (y sin depender de la red) con SVG
// propio. Una "clave" que empieza por "svg:" (p. ej. "svg:circulo")
// se resuelve aquí en vez de buscarse como pictograma.

const ACS_SVG_TRAZO = { fill: "none", stroke: "#33363f", "stroke-width": "6", "stroke-linecap": "round", "stroke-linejoin": "round" };

function acsCrearElementoSvg(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k]));
  return el;
}

// Formas basadas en polígono: los mismos puntos sirven para la forma
// completa (<polygon>, que cierra el último lado sola) y para la
// versión "rota" que usa "encuentra el diferente" (<polyline> con los
// mismos puntos: al no cerrarse sola, falta justo un lado).
const ACS_SVG_PUNTOS_FORMA = {
  cuadrado: "15,15 85,15 85,85 15,85",
  rectangulo: "6,28 94,28 94,72 6,72",
  triangulo: "50,10 92,88 8,88",
  pentagono: "50,6 92,37 76,90 24,90 8,37",
  hexagono: "27,8 73,8 94,50 73,92 27,92 6,50",
};

const ACS_SVG_FORMAS = {
  circulo: () => acsCrearElementoSvg("circle", { cx: 50, cy: 50, r: 38, ...ACS_SVG_TRAZO }),
  cuadrado: () => acsCrearElementoSvg("polygon", { points: ACS_SVG_PUNTOS_FORMA.cuadrado, ...ACS_SVG_TRAZO }),
  rectangulo: () => acsCrearElementoSvg("polygon", { points: ACS_SVG_PUNTOS_FORMA.rectangulo, ...ACS_SVG_TRAZO }),
  triangulo: () => acsCrearElementoSvg("polygon", { points: ACS_SVG_PUNTOS_FORMA.triangulo, ...ACS_SVG_TRAZO }),
  pentagono: () => acsCrearElementoSvg("polygon", { points: ACS_SVG_PUNTOS_FORMA.pentagono, ...ACS_SVG_TRAZO }),
  hexagono: () => acsCrearElementoSvg("polygon", { points: ACS_SVG_PUNTOS_FORMA.hexagono, ...ACS_SVG_TRAZO }),
  recta: () => acsCrearElementoSvg("line", { x1: 8, y1: 82, x2: 92, y2: 18, ...ACS_SVG_TRAZO }),
  curva: () => acsCrearElementoSvg("path", { d: "M8,70 Q50,5 92,70", ...ACS_SVG_TRAZO }),
  quebrada: () => acsCrearElementoSvg("polyline", { points: "8,85 32,35 55,70 92,15", ...ACS_SVG_TRAZO }),
  mixta: () => acsCrearElementoSvg("path", { d: "M6,55 Q26,10 46,55 T86,55 L94,80", ...ACS_SVG_TRAZO }),
};

// Versión "incompleta" (con un trozo borrado) de las formas de
// ACS_SVG_PUNTOS_FORMA, para "encuentra el diferente": 3 formas
// completas e iguales + 1 con un lado que falta, en vez de 3 dibujos
// de una categoría + 1 de otra. El círculo no es un polígono, así que
// se deja un hueco en el trazo con stroke-dasharray en vez de con
// polyline.
const ACS_SVG_FORMAS_ROTAS = {
  circulo: () => acsCrearElementoSvg("circle", { cx: 50, cy: 50, r: 38, ...ACS_SVG_TRAZO, "stroke-dasharray": "170 70" }),
};
Object.keys(ACS_SVG_PUNTOS_FORMA).forEach((nombre) => {
  ACS_SVG_FORMAS_ROTAS[nombre] = () => acsCrearElementoSvg("polyline", { points: ACS_SVG_PUNTOS_FORMA[nombre], ...ACS_SVG_TRAZO });
});

function acsCrearIconoSvg(nombre, roto) {
  const svg = acsCrearElementoSvg("svg", { viewBox: "0 0 100 100", width: "100%", height: "100%" });
  const fabricante = (roto ? ACS_SVG_FORMAS_ROTAS : ACS_SVG_FORMAS)[nombre];
  if (fabricante) svg.appendChild(fabricante());
  return svg;
}

// "Tarta" dividida en partes iguales, con las N primeras coloreadas:
// representación visual de una fracción sencilla (numerador/
// denominador), sin depender de ARASAAC (no hay pictograma para "2
// de 4 partes coloreadas"). Los sectores se numeran siempre a partir
// de arriba, en el sentido de las agujas del reloj, para que la misma
// fracción salga siempre con el mismo dibujo (fácil de reconocer).
function acsCrearIconoFraccion(numerador, denominador) {
  const svg = acsCrearElementoSvg("svg", { viewBox: "0 0 100 100", width: "100%", height: "100%" });
  const cx = 50;
  const cy = 50;
  const r = 42;
  for (let i = 0; i < denominador; i++) {
    const a0 = (i / denominador) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / denominador) * 2 * Math.PI - Math.PI / 2;
    const x0 = (cx + r * Math.cos(a0)).toFixed(2);
    const y0 = (cy + r * Math.sin(a0)).toFixed(2);
    const x1 = (cx + r * Math.cos(a1)).toFixed(2);
    const y1 = (cy + r * Math.sin(a1)).toFixed(2);
    const arcoGrande = a1 - a0 > Math.PI ? 1 : 0;
    const d = `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${arcoGrande} 1 ${x1},${y1} Z`;
    svg.appendChild(
      acsCrearElementoSvg("path", {
        d,
        fill: i < numerador ? "#33363f" : "none",
        stroke: "#33363f",
        "stroke-width": "4",
        "stroke-linejoin": "round",
      })
    );
  }
  return svg;
}

function acsEsClaveSvg(clave) {
  return typeof clave === "string" && (clave.indexOf("svg:") === 0 || clave.indexOf("svgroto:") === 0 || clave.indexOf("fraccion:") === 0);
}

// Sustituye a arasaacCrearImagen allí donde una "clave" puede ser
// tanto una palabra real (pictograma de ARASAAC) como una forma o
// línea abstracta ("svg:circulo", "svg:recta"...), su versión
// incompleta ("svgroto:circulo") o una fracción ("fraccion:1-2").
function acsCrearImagenOSvg(clave, opts) {
  if (acsEsClaveSvg(clave)) {
    const wrap = document.createElement("span");
    wrap.className = "acs-pic acs-pic-svg";
    if (clave.indexOf("fraccion:") === 0) {
      const [numerador, denominador] = clave.slice(9).split("-").map(Number);
      wrap.appendChild(acsCrearIconoFraccion(numerador, denominador));
    } else {
      const roto = clave.indexOf("svgroto:") === 0;
      wrap.appendChild(acsCrearIconoSvg(clave.slice(roto ? 8 : 4), roto));
    }
    return wrap;
  }
  return arasaacCrearImagen(clave, opts);
}

// Etiqueta legible para una clave "svg:"/"svgroto:" en la hoja de
// respuestas (donde antes se imprimía literalmente "svg:recta"). Una
// clave que no es SVG (una palabra real) se devuelve tal cual.
const ACS_ETIQUETAS_FORMA = {
  circulo: "círculo",
  cuadrado: "cuadrado",
  rectangulo: "rectángulo",
  triangulo: "triángulo",
  pentagono: "pentágono",
  hexagono: "hexágono",
  recta: "línea recta",
  curva: "línea curva",
  quebrada: "línea quebrada",
  mixta: "línea mixta",
};

function acsEtiquetaClave(clave) {
  if (typeof clave !== "string") return clave;
  if (clave.indexOf("fraccion:") === 0) {
    return clave.slice(9).replace("-", "/");
  }
  if (clave.indexOf("svgroto:") === 0) {
    const forma = clave.slice(8);
    return (ACS_ETIQUETAS_FORMA[forma] || forma) + " (incompleto)";
  }
  if (clave.indexOf("svg:") === 0) {
    const forma = clave.slice(4);
    return ACS_ETIQUETAS_FORMA[forma] || forma;
  }
  return clave;
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
  return acsCrearImagenOSvg(par.derecha, { color: digital });
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

// Variante de impresión "recortar y pegar": en vez de unir con una
// línea, se recortan cuadrados sencillos (nunca la silueta del
// dibujo) y se pegan junto a su pareja. Mismo dato (ficha.pares), la
// ficha solo marca ficha.imprimirComo = "recortar" para pedir esta
// disposición en vez de las dos columnas con puntos.
//
// Separado en dos funciones (objetivos / piezas) para que el
// generador de cuaderno (acs/generador.html) pueda, en modo examen,
// sacar las piezas de su sitio y juntarlas todas en una sola página
// de "Recortables" al final en vez de dejarlas sueltas después de
// cada ejercicio.
function crearRecortarObjetivos(ficha) {
  const objetivos = document.createElement("div");
  objetivos.className = "acs-recortar-objetivos";
  ficha.pares.forEach((par, i) => {
    const fila = document.createElement("div");
    fila.className = "acs-recortar-objetivo";
    const num = document.createElement("span");
    num.className = "acs-pareja-num";
    num.textContent = i + 1 + ".";
    const texto = document.createElement("span");
    texto.textContent = par.izquierda;
    const hueco = document.createElement("span");
    hueco.className = "acs-recortar-hueco";
    fila.appendChild(num);
    fila.appendChild(texto);
    fila.appendChild(hueco);
    objetivos.appendChild(fila);
  });
  return objetivos;
}

function crearRecortarPiezas(ficha) {
  const piezas = document.createElement("div");
  piezas.className = "acs-recortar-piezas";
  acsOrdenBarajadoPares(ficha.pares).forEach((parIndex) => {
    const par = ficha.pares[parIndex];
    const pieza = document.createElement("div");
    pieza.className = "acs-recortar-pieza";
    pieza.appendChild(acsCrearContenidoDerecha(ficha, par, false));
    piezas.appendChild(pieza);
  });
  return piezas;
}

function renderUnirParejasSheetRecortar(ficha, sheet) {
  sheet.appendChild(crearRecortarObjetivos(ficha));

  const aviso = document.createElement("p");
  aviso.className = "acs-sheet-instruccion acs-recortar-aviso";
  aviso.style.marginTop = "24px";
  aviso.textContent = "✂ Recorta cada cuadro de abajo y pégalo junto a su pareja.";
  sheet.appendChild(aviso);

  sheet.appendChild(crearRecortarPiezas(ficha));
}

function renderUnirParejasSheet(ficha, container) {
  container.innerHTML = "";
  const sheet = acsCrearSheetBase(ficha);

  if (ficha.imprimirComo === "recortar") {
    renderUnirParejasSheetRecortar(ficha, sheet);
    container.appendChild(sheet);
    return;
  }

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

// ============================================================
// Que una ficha quepa en UN folio
// ============================================================
//
// Regla de oro del cuaderno impreso: un ejercicio no se parte entre
// dos hojas. Para una alumna que pierde el hilo al pasar de página,
// media tarea aquí y media allí es una tarea distinta y más difícil
// que la que se le ha puesto. El CSS lo impide (page-break-inside en
// css/acs.css), pero eso solo funciona si el ejercicio cabe: si no,
// el navegador lo parte igual. Así que antes de imprimir hay que
// comprobarlo de verdad, midiendo.

// Alto útil de un folio A4 con los márgenes de @page (12mm arriba y
// abajo): 297 - 24 = 273mm, en px CSS a 96 ppp.
const ACS_ALTO_FOLIO_PX = ((297 - 24) / 25.4) * 96;

// Colchón (unos 10mm) para los redondeos del navegador al paginar y
// para el área no imprimible, que no es igual en todas las
// impresoras. Con 4mm ya hubo una ficha que medía "justo" y aun así
// se partía en el PDF.
const ACS_COLCHON_FOLIO_PX = 40;

// Contenedor oculto donde se dibujan las hojas para medirlas. Tiene
// que estar en el documento (si no, el navegador no lo maqueta y
// devuelve altura cero) pero fuera de la vista y sin que lo lea un
// lector de pantalla. El ancho es el del folio, fijo: si heredara el
// de la pantalla, en un móvil estrecho todo mediría más alto que en
// el papel y se recortarían ejercicios sin motivo.
function acsMedidorDeFolio() {
  let medidor = document.getElementById("acs-medidor-folio");
  if (!medidor) {
    medidor = document.createElement("div");
    medidor.id = "acs-medidor-folio";
    medidor.setAttribute("aria-hidden", "true");
    document.body.appendChild(medidor);
  }
  return medidor;
}

// Busca la versión más completa de una ficha que quepa en un folio.
// "fabricar(cantidad)" tiene que devolver { ficha, hoja }: los datos
// y la hoja ya dibujada tal y como va a salir impresa. Se empieza por
// la cantidad pedida y se va quitando un ítem mientras no quepa,
// hasta el mínimo de esa ficha.
//
// Devuelve la ficha elegida, cuántos ítems se han quitado (para
// poder avisarlo: recortar en silencio lo que ha pedido la maestra
// sería peor que el problema que se arregla) y si al final cabe.
//
// Las versiones que se van a tirar se dibujan SIN ir a buscar los
// pictogramas a ARASAAC: solo hacen falta para medir, y el hueco del
// pictograma mide lo mismo con dibujo y sin él. Sin esto, montar un
// cuaderno entero lanzaba cientos de búsquedas a la basura. Quien
// llama tiene que volver a dibujar la hoja buena, ya con imágenes.
function acsBuscarVersionQueQuepa(fabricar, cantidadPedida, minimo, ajustable) {
  const medidor = acsMedidorDeFolio();
  const limite = ACS_ALTO_FOLIO_PX - ACS_COLCHON_FOLIO_PX;
  let cantidad = Math.max(minimo, cantidadPedida);

  arasaacMedirSinDescargar(true);
  try {
    for (;;) {
      const { ficha, hoja } = fabricar(cantidad);
      medidor.appendChild(hoja);
      const alto = hoja.getBoundingClientRect().height;
      medidor.removeChild(hoja);

      if (alto <= limite || !ajustable || cantidad <= minimo) {
        return { ficha, cantidad, quitados: cantidadPedida - cantidad, cabe: alto <= limite };
      }
      cantidad--;
    }
  } finally {
    arasaacMedirSinDescargar(false);
  }
}

// ---------- elegir-opcion ----------
// ficha.items = [{
//   prompt: "El sol es amarillo.",
//   conteo: { clave: "manzana", cantidad: 4 } | null,
//   opciones: [{ clave: "sol", correcta: true }, { clave: "luna", correcta: false }]
//     u opciones de solo texto: [{ texto: "4", correcta: true }, ...]
// }]

// Los dibujos que hay que contar se colocan en filas de diez (no en
// un montón que se reparte según el ancho que sobre): así se pueden
// rodear las decenas de un vistazo —que es justo lo que pide la ficha
// de decenas y unidades— y de paso el bloque ocupa un alto
// predecible, imprescindible para saber si el ejercicio cabe en un
// folio antes de imprimirlo. El tope de diez por fila se fija en CSS
// (.acs-opcion-conteo), no aquí.
function acsCrearConteo(conteo, { color, alinearIzquierda }) {
  const fila = document.createElement("div");
  fila.className = "acs-opcion-conteo";
  if (alinearIzquierda) fila.classList.add("acs-opcion-conteo-izq");
  for (let i = 0; i < conteo.cantidad; i++) {
    fila.appendChild(acsCrearImagenOSvg(conteo.clave, { color, alt: conteo.clave }));
  }
  return fila;
}

// Una opción de respuesta puede ser un dibujo, un número suelto ("7")
// o una frase corta ("2 decenas y 7 unidades"). Las dos primeras caben
// en una caja cuadrada; la frase, no: metida en un cuadrado se parte
// en cuatro líneas, la caja crece a lo alto y el ejercicio deja de
// caber en el folio. Se marcan aparte para darles una caja alargada
// de una sola línea (ver .acs-opcion-item-frase en css/acs.css).
function acsEsOpcionFrase(op) {
  return typeof op.texto === "string" && op.texto.length > 4;
}

function acsCrearOpcionContenido(op) {
  if (op.texto) {
    const span = document.createElement("span");
    // El tamaño va en CSS (.acs-opcion-texto), no aquí: en estilo
    // en línea ganaría siempre y la hoja para imprimir no podría
    // usar un cuerpo más pequeño que la pantalla.
    span.className = "acs-opcion-texto";
    span.textContent = op.texto;
    return span;
  }
  return acsCrearImagenOSvg(op.clave, { color: true });
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
      bloque.appendChild(acsCrearConteo(item.conteo, { color: true }));
    }

    const opciones = document.createElement("div");
    opciones.className = "acs-opciones";

    item.opciones.forEach((op) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "acs-opcion-item";
      if (acsEsOpcionFrase(op)) btn.classList.add("acs-opcion-item-frase");
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
      bloque.appendChild(acsCrearConteo(item.conteo, { color: false, alinearIzquierda: true }));
    }

    const opciones = document.createElement("div");
    opciones.className = "acs-opciones";
    opciones.style.justifyContent = "flex-start";

    item.opciones.forEach((op) => {
      const caja = document.createElement("div");
      caja.className = "acs-opcion-item";
      if (acsEsOpcionFrase(op)) caja.classList.add("acs-opcion-item-frase");
      caja.appendChild(op.texto ? acsCrearOpcionContenido(op) : acsCrearImagenOSvg(op.clave, { color: false }));
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

// ---------- operacion-numerica (suma/resta con números de 2 cifras) ----------
// ficha.items = [{ a: 34, b: 12, operador: "+" | "−" }]
// Pensada para 2º sin volver a la escritura por casillas: los mismos
// números que una suma en columna, pero se elige el resultado entre
// varias opciones en vez de escribir cada cifra.

function acsResultadoOperacionNumerica(item) {
  return item.operador === "+" ? item.a + item.b : item.a - item.b;
}

function acsOpcionesNumericasCercanasAmplio(resultado) {
  const distancias = acsBarajar([1, 2, 5, 10]).slice(0, 2);
  const opciones = new Set([resultado]);
  distancias.forEach((d) => {
    const candidato = Math.random() < 0.5 && resultado - d >= 0 ? resultado - d : resultado + d;
    opciones.add(candidato);
  });
  while (opciones.size < 3) opciones.add(resultado + opciones.size * 3);
  return acsBarajar(Array.from(opciones).slice(0, 3));
}

function acsCrearFilaOperacionNumerica(item, huecoClase) {
  const fila = document.createElement("div");
  fila.className = "acs-mmi-fila";
  const numA = document.createElement("span");
  numA.className = "acs-mmi-num";
  numA.textContent = String(item.a);
  const signo = document.createElement("span");
  signo.className = "acs-resta-signo";
  signo.textContent = item.operador;
  const numB = document.createElement("span");
  numB.className = "acs-mmi-num";
  numB.textContent = String(item.b);
  const signoIgual = document.createElement("span");
  signoIgual.className = "acs-resta-signo";
  signoIgual.textContent = "=";
  const hueco = document.createElement("span");
  hueco.className = huecoClase;
  fila.appendChild(numA);
  fila.appendChild(signo);
  fila.appendChild(numB);
  fila.appendChild(signoIgual);
  fila.appendChild(hueco);
  return { fila, hueco };
}

function renderOperacionNumericaDigital(ficha, container) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "acs-digital";

  const instr = document.createElement("p");
  instr.className = "acs-digital-instruccion";
  instr.textContent = ficha.instruccion;
  wrap.appendChild(instr);

  ficha.items.forEach((item) => {
    const correcta = acsResultadoOperacionNumerica(item);
    const bloque = document.createElement("div");
    bloque.className = "acs-mmi-bloque";

    const { fila, hueco } = acsCrearFilaOperacionNumerica(item, "acs-mmi-num");
    hueco.style.minWidth = "80px";
    hueco.style.textAlign = "center";
    bloque.appendChild(fila);

    const opciones = document.createElement("div");
    opciones.className = "acs-opciones";
    acsOpcionesNumericasCercanasAmplio(correcta).forEach((valor) => {
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

function renderOperacionNumericaSheet(ficha, container) {
  container.innerHTML = "";
  const sheet = acsCrearSheetBase(ficha);

  ficha.items.forEach((item) => {
    const { fila } = acsCrearFilaOperacionNumerica(item, "acs-mmi-hueco");
    sheet.appendChild(fila);
  });

  container.appendChild(sheet);
}

// ---------- ordenar-letras ----------
// ficha.items = [{ piezas: ["s","o","l"] }, ...] (o piezas de más de
// una letra, p. ej. ["va","so"], para ordenar sílabas con el mismo
// motor: solo cambia el tamaño de cada trozo, no la mecánica).
//
// ficha.mostrarImagen = false para ordenar piezas que no son una
// palabra (números, p. ej. ["3","7","9"]): no hay pictograma que
// buscar y pedirlo daría un recuadro vacío.
//
// La comparación se hace uniendo las piezas con "|" y no pegándolas
// sin más: con números de varias cifras, ["1","11"] y ["11","1"]
// darían las dos "111" y cualquier orden se daría por bueno.
function acsClavePiezas(piezas) {
  return piezas.join("|");
}

function acsBarajarPiezas(piezas) {
  const objetivo = acsClavePiezas(piezas);
  let barajadas;
  do {
    barajadas = acsBarajar(piezas.slice());
  } while (acsClavePiezas(barajadas) === objetivo && piezas.length > 1);
  return barajadas;
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
    const piezas = item.piezas;
    const objetivo = acsClavePiezas(piezas);
    const bloque = document.createElement("div");
    bloque.className = "acs-letras-bloque";

    if (ficha.mostrarImagen !== false) {
      bloque.appendChild(arasaacCrearImagen(piezas.join(""), { color: true }));
    }

    const slotsWrap = document.createElement("div");
    slotsWrap.className = "acs-letras-slots";
    const slots = [];
    for (let i = 0; i < piezas.length; i++) {
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
    // banco que puso esa pieza (slot._origen), para poder devolverla
    // con un clic si se ha ordenado mal, sin esperar ni arrastrar.
    function piezasActuales() {
      return acsClavePiezas(slots.map((s) => s.textContent));
    }

    function comprobarCompleto() {
      if (!slots.every((s) => s.textContent)) return;
      if (piezasActuales() === objetivo) {
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

    acsBarajarPiezas(piezas).forEach((pieza) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "acs-letra-banco";
      btn.textContent = pieza;
      btn.addEventListener("click", () => {
        const libre = slots.find((s) => !s.textContent);
        if (!libre) return;
        libre.textContent = pieza;
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
    const piezas = item.piezas;
    const bloque = document.createElement("div");
    bloque.className = "acs-letras-bloque";

    if (ficha.mostrarImagen !== false) {
      bloque.appendChild(arasaacCrearImagen(piezas.join(""), { color: false }));
    }

    const letrasWrap = document.createElement("div");
    letrasWrap.className = "acs-letras-slots";
    acsBarajarPiezas(piezas).forEach((pieza) => {
      const caja = document.createElement("span");
      caja.className = "acs-letra-slot acs-letra-slot-impresa";
      caja.textContent = pieza;
      letrasWrap.appendChild(caja);
    });
    bloque.appendChild(letrasWrap);

    const huecos = document.createElement("div");
    huecos.className = "acs-letras-slots";
    for (let i = 0; i < piezas.length; i++) {
      const hueco = document.createElement("span");
      hueco.className = "acs-letra-slot";
      huecos.appendChild(hueco);
    }
    bloque.appendChild(huecos);

    sheet.appendChild(bloque);
  });

  container.appendChild(sheet);
}

// ---------- serie-numerica (numeración del 1 al N con huecos) ----------
// ficha.desde / ficha.hasta = extremos de la serie (p. ej. 1 y 20)
// ficha.visibles = [1, 5, 10, 20] -> números ya escritos, para que no
// se pierda el orden. El resto son casillas que hay que completar.

function acsNumerosDeLaSerie(ficha) {
  const numeros = [];
  for (let n = ficha.desde; n <= ficha.hasta; n++) numeros.push(n);
  return numeros;
}

function acsFaltantesDeLaSerie(ficha) {
  const visibles = new Set(ficha.visibles);
  return acsNumerosDeLaSerie(ficha).filter((n) => !visibles.has(n));
}

function renderSerieNumericaDigital(ficha, container) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "acs-digital";

  const instr = document.createElement("p");
  instr.className = "acs-digital-instruccion";
  instr.textContent = ficha.instruccion;
  wrap.appendChild(instr);

  const visibles = new Set(ficha.visibles);
  const grid = document.createElement("div");
  grid.className = "acs-serie-grid";

  // Cada hueco recuerda qué número le toca (slot._numero) para poder
  // comprobar en el momento si el número que se acaba de pulsar es el
  // que va ahí.
  const slots = [];
  acsNumerosDeLaSerie(ficha).forEach((n) => {
    if (visibles.has(n)) {
      const celda = document.createElement("span");
      celda.className = "acs-serie-celda acs-serie-celda-fija";
      celda.textContent = String(n);
      grid.appendChild(celda);
      return;
    }
    const slot = document.createElement("button");
    slot.type = "button";
    slot.className = "acs-serie-celda";
    slot._numero = n;
    slots.push(slot);
    grid.appendChild(slot);
  });
  wrap.appendChild(grid);

  const bancoWrap = document.createElement("div");
  bancoWrap.className = "acs-letras-banco";
  wrap.appendChild(bancoWrap);

  const feedback = document.createElement("p");
  feedback.className = "acs-feedback";
  wrap.appendChild(feedback);

  // Se comprueba número a número, no al final: en una serie larga,
  // enterarse del fallo después de colocar setenta casillas no sirve
  // de nada. Cada número va al primer hueco libre (se rellena en
  // orden, que es justo lo que se está aprendiendo).
  acsBarajar(acsFaltantesDeLaSerie(ficha)).forEach((n) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "acs-letra-banco";
    btn.textContent = String(n);
    btn.addEventListener("click", () => {
      const libre = slots.find((s) => !s.textContent);
      if (!libre) return;

      if (n !== libre._numero) {
        libre.classList.add("error");
        btn.classList.add("incorrecta");
        setTimeout(() => {
          libre.classList.remove("error");
          btn.classList.remove("incorrecta");
        }, 600);
        return;
      }

      libre.textContent = String(n);
      libre.classList.add("correcta");
      libre.disabled = true;
      btn.disabled = true;
      btn.classList.add("usada");

      if (slots.every((s) => s.textContent)) {
        feedback.textContent = "Muy bien: la serie está completa.";
        feedback.className = "acs-feedback ok";
      }
    });
    bancoWrap.appendChild(btn);
  });

  container.appendChild(wrap);
}

function renderSerieNumericaSheet(ficha, container) {
  container.innerHTML = "";
  const sheet = acsCrearSheetBase(ficha);

  const visibles = new Set(ficha.visibles);
  const grid = document.createElement("div");
  grid.className = "acs-serie-grid";
  acsNumerosDeLaSerie(ficha).forEach((n) => {
    const celda = document.createElement("span");
    celda.className = "acs-serie-celda" + (visibles.has(n) ? " acs-serie-celda-fija" : "");
    if (visibles.has(n)) celda.textContent = String(n);
    grid.appendChild(celda);
  });
  sheet.appendChild(grid);

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
  // La flecha señala hacia el hueco: es lo que hace que se entienda
  // qué se pide cuando en la misma ficha hay filas de "anterior" y de
  // "posterior" mezcladas (como en los exámenes en papel).
  const flecha = document.createElement("span");
  flecha.className = "acs-flecha";
  if (item.modo === "despues") {
    flecha.textContent = "►";
    fila.appendChild(numConocido);
    fila.appendChild(flecha);
    fila.appendChild(hueco);
  } else {
    flecha.textContent = "◄";
    fila.appendChild(hueco);
    fila.appendChild(flecha);
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
    btn.appendChild(acsCrearImagenOSvg(item.clave, { color: true }));
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
    casilla.appendChild(acsCrearImagenOSvg(item.clave, { color: false }));
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
  "operacion-numerica": { digital: renderOperacionNumericaDigital, sheet: renderOperacionNumericaSheet },
  "serie-numerica": { digital: renderSerieNumericaDigital, sheet: renderSerieNumericaSheet },
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
        return `${i + 1}. ${item.prompt || "¿Cuántos hay?"} → ${correcta.texto || acsEtiquetaClave(correcta.clave)}`;
      });
    case "mayor-menor-igual":
      return ficha.pares.map((par, i) => `${i + 1}. ${par[0]} ${acsComparar(par[0], par[1])} ${par[1]}`);
    case "operacion-visual":
      return ficha.items.map((item, i) => `${i + 1}. ${item.a} ${item.operador} ${item.b} = ${acsResultadoOperacion(item)}`);
    case "ordenar-letras":
      return ficha.items.map((item, i) => `${i + 1}. ${item.piezas.join("")}`);
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
        return `${String.fromCharCode(65 + i)}. ${acsEtiquetaClave(item.clave)} → ${etiqueta ? etiqueta.etiqueta : item.categoria}`;
      });
    case "ordenar-secuencia":
      return ficha.pasos.map((paso, i) => `${i + 1}. ${paso.clave}`);
    case "operacion-numerica":
      return ficha.items.map((item, i) => `${i + 1}. ${item.a} ${item.operador} ${item.b} = ${acsResultadoOperacionNumerica(item)}`);
    case "serie-numerica":
      return ["Faltan: " + acsFaltantesDeLaSerie(ficha).join(", ")];
    default:
      return [];
  }
}
