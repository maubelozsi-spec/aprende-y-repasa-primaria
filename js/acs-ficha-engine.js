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
      // Se marca el bloque para poder poner los dibujos que hay que
      // contar AL LADO de las opciones en la hoja impresa (ver
      // .acs-opcion-bloque-conteo en css/acs.css). Los bloques sin
      // dibujos no lo llevan: ahí no hay nada que poner al lado.
      bloque.classList.add("acs-opcion-bloque-conteo");
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

// ---------- unir-puntos ----------
// ficha.puntos = [{ x, y, n }, ...] en el orden en que se unen (x, y
//   de 0 a 100; n es el número que se escribe al lado)
// ficha.dibujo = { nombre: "un pez", color: "#4cc9f0", detalles: [...] }
// ficha.ayuda = true para poner la serie entera a la vista (1º)

// Dónde escribir el número de cada punto: hacia FUERA del dibujo,
// para que no quede encima de la línea que se va a trazar. Se usa la
// bisectriz de las normales exteriores de los dos lados que llegan al
// punto; el signo del área (fórmula del lazo) dice hacia qué lado
// queda "fuera", sea cual sea el sentido en que está escrito el
// contorno.
function acsPosicionesEtiquetasPuntos(puntos) {
  const n = puntos.length;
  let area = 0;
  puntos.forEach((p, i) => {
    const q = puntos[(i + 1) % n];
    area += p.x * q.y - q.x * p.y;
  });
  const sentido = area >= 0 ? 1 : -1;

  function normalExterior(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const largo = Math.hypot(dx, dy) || 1;
    return { x: (sentido * dy) / largo, y: (-sentido * dx) / largo };
  }

  const etiquetas = puntos.map((p, i) => {
    const anterior = puntos[(i - 1 + n) % n];
    const siguiente = puntos[(i + 1) % n];
    const n1 = normalExterior(anterior, p);
    const n2 = normalExterior(p, siguiente);
    let nx = n1.x + n2.x;
    let ny = n1.y + n2.y;
    const largo = Math.hypot(nx, ny);
    if (largo < 0.2) {
      nx = n1.x;
      ny = n1.y;
    } else {
      nx /= largo;
      ny /= largo;
    }
    // En una esquina hacia dentro (las muescas de la corona, el pie
    // del mástil...) "fuera" es un rincón estrecho donde se amontonan
    // los números de los puntos vecinos. Ahí el número va dentro del
    // dibujo, donde hay sitio y no lo cruza ninguna línea.
    // Seno del giro en ese punto. Los puntos intermedios de un lado
    // recto dan casi cero (no exactamente, por el redondeo de las
    // coordenadas), así que solo cuenta un giro claro.
    const giro =
      ((p.x - anterior.x) * (siguiente.y - p.y) - (p.y - anterior.y) * (siguiente.x - p.x)) /
      ((Math.hypot(p.x - anterior.x, p.y - anterior.y) * Math.hypot(siguiente.x - p.x, siguiente.y - p.y)) || 1);
    if (Math.abs(giro) > 0.15 && Math.sign(giro) !== sentido) {
      nx = -nx;
      ny = -ny;
    }
    return { x: p.x + nx * 5, y: p.y + ny * 5 };
  });

  // Unos cuantos pasos de "empujar": si dos números quedan casi
  // encima el uno del otro, o un número queda pegado a un punto que no
  // es el suyo, se separan un poco. Sin esto, en las zonas con muchos
  // puntos juntos se leía "46" donde había un 4 y un 6.
  const DIST_ETIQUETAS = 4.6;
  const DIST_PUNTO = 3.2;
  for (let paso = 0; paso < 40; paso++) {
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = etiquetas[j].x - etiquetas[i].x;
        const dy = etiquetas[j].y - etiquetas[i].y;
        // Un número de dos cifras es más ancho que alto: en horizontal
        // necesita más separación que en vertical.
        const d = Math.hypot(dx / 1.4, dy) || 0.01;
        if (d < DIST_ETIQUETAS) {
          const empuje = (DIST_ETIQUETAS - d) / 2;
          etiquetas[i].x -= (dx / d) * empuje;
          etiquetas[i].y -= (dy / d) * empuje;
          etiquetas[j].x += (dx / d) * empuje;
          etiquetas[j].y += (dy / d) * empuje;
        }
      }
      puntos.forEach((q) => {
        const dx = etiquetas[i].x - q.x;
        const dy = etiquetas[i].y - q.y;
        const d = Math.hypot(dx, dy) || 0.01;
        if (d < DIST_PUNTO) {
          etiquetas[i].x += (dx / d) * (DIST_PUNTO - d);
          etiquetas[i].y += (dy / d) * (DIST_PUNTO - d);
        }
      });
      etiquetas[i].x = Math.min(96, Math.max(4, etiquetas[i].x));
      etiquetas[i].y = Math.min(97, Math.max(4, etiquetas[i].y));
    }
  }
  return etiquetas;
}

function acsCrearDetalleSvg(detalle) {
  const attrs = {
    fill: detalle.relleno ? "#33363f" : "none",
    stroke: "#33363f",
    "stroke-width": "1.4",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  };
  if (detalle.circulo) {
    const [cx, cy, r] = detalle.circulo;
    return acsCrearElementoSvg("circle", Object.assign({ cx, cy, r }, attrs));
  }
  return acsCrearElementoSvg("path", Object.assign({ d: detalle.d }, attrs));
}

// Dibuja los puntos con su número. Devuelve el <svg> y, por separado,
// las capas que la versión digital necesita ir completando (relleno,
// líneas, detalles) y el grupo de cada punto, para engancharle el clic.
function acsCrearSvgPuntos(ficha, { digital }) {
  const svg = acsCrearElementoSvg("svg", { viewBox: "0 0 100 100", class: "acs-puntos-svg" });

  const puntosAttr = ficha.puntos.map((p) => `${p.x},${p.y}`).join(" ");
  const relleno = acsCrearElementoSvg("polygon", { points: puntosAttr, class: "acs-puntos-relleno", fill: ficha.dibujo.color });
  const lineas = acsCrearElementoSvg("g", { class: "acs-puntos-lineas" });
  const detalles = acsCrearElementoSvg("g", { class: "acs-puntos-detalles" });
  (ficha.dibujo.detalles || []).forEach((d) => detalles.appendChild(acsCrearDetalleSvg(d)));

  svg.appendChild(relleno);
  if (ficha.guia) {
    svg.appendChild(acsCrearElementoSvg("polygon", { points: puntosAttr, class: "acs-puntos-guia" }));
  }
  svg.appendChild(lineas);
  svg.appendChild(detalles);

  const etiquetas = acsPosicionesEtiquetasPuntos(ficha.puntos);
  const grupos = ficha.puntos.map((p, i) => {
    const g = acsCrearElementoSvg("g", { class: "acs-punto" });
    if (digital) {
      // Zona de toque mucho más grande que el punto que se ve, que
      // abarca también el número: se puede acertar tocando cualquiera
      // de los dos, sin precisión de motricidad fina.
      const cx = (p.x + etiquetas[i].x) / 2;
      const cy = (p.y + etiquetas[i].y) / 2;
      g.appendChild(acsCrearElementoSvg("circle", { cx, cy, r: 5, class: "acs-punto-zona" }));
    }
    if (i === 0) {
      // El punto de salida va rodeado, en pantalla y en papel.
      g.appendChild(acsCrearElementoSvg("circle", { cx: p.x, cy: p.y, r: 2.6, class: "acs-punto-inicio" }));
    }
    g.appendChild(acsCrearElementoSvg("circle", { cx: p.x, cy: p.y, r: digital ? 1.5 : 1.2, class: "acs-punto-dot" }));
    const texto = acsCrearElementoSvg("text", { x: etiquetas[i].x, y: etiquetas[i].y, class: "acs-punto-num" });
    texto.textContent = String(p.n);
    g.appendChild(texto);
    svg.appendChild(g);
    return g;
  });

  return { svg, relleno, lineas, detalles, grupos };
}

// Tira con la serie completa (2, 4, 6... 30): apoyo visual para 1º.
function acsCrearTiraSerie(numeros) {
  const tira = document.createElement("div");
  tira.className = "acs-puntos-tira";
  numeros.forEach((n) => {
    const celda = document.createElement("span");
    celda.className = "acs-puntos-tira-num";
    celda.textContent = String(n);
    tira.appendChild(celda);
  });
  return tira;
}

function renderUnirPuntosDigital(ficha, container) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "acs-digital";

  const instr = document.createElement("p");
  instr.className = "acs-digital-instruccion";
  instr.textContent = ficha.instruccion;
  wrap.appendChild(instr);

  const tira = ficha.ayuda ? acsCrearTiraSerie(ficha.numeros) : null;
  if (tira) wrap.appendChild(tira);

  const lienzo = document.createElement("div");
  lienzo.className = "acs-puntos-lienzo";
  const { svg, relleno, lineas, detalles, grupos } = acsCrearSvgPuntos(ficha, { digital: true });
  lienzo.appendChild(svg);
  wrap.appendChild(lienzo);

  const feedback = document.createElement("p");
  feedback.className = "acs-feedback";
  wrap.appendChild(feedback);
  container.appendChild(wrap);

  const puntos = ficha.puntos;
  let siguiente = 0;
  let fallosSeguidos = 0;

  function trazar(a, b) {
    lineas.appendChild(acsCrearElementoSvg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y }));
  }

  function acertar(i) {
    const g = grupos[i];
    g.classList.add("hecho");
    g.removeAttribute("tabindex");
    if (i > 0) trazar(puntos[i - 1], puntos[i]);
    if (tira) tira.children[i].classList.add("hecho");
    siguiente++;
    fallosSeguidos = 0;
    feedback.textContent = "";
    feedback.className = "acs-feedback";

    if (siguiente === puntos.length) {
      trazar(puntos[puntos.length - 1], puntos[0]);
      svg.classList.add("completo");
      feedback.textContent = `¡Muy bien! Has dibujado ${ficha.dibujo.nombre}.`;
      feedback.className = "acs-feedback ok";
    }
  }

  function fallar(i) {
    const g = grupos[i];
    g.classList.add("error");
    setTimeout(() => g.classList.remove("error"), 500);
    fallosSeguidos++;
    const buscado = puntos[siguiente].n;
    let mensaje =
      siguiente === 0
        ? `Hay que empezar por el ${buscado}: es el punto rodeado.`
        : `Ese no es. ¿Qué número va después del ${puntos[siguiente - 1].n}?`;
    // Al segundo fallo seguido se da la respuesta: más vale seguir
    // avanzando que atascarse y abandonar la ficha.
    if (fallosSeguidos >= 2 && siguiente > 0) mensaje += ` Busca el ${buscado}.`;
    feedback.textContent = mensaje;
    feedback.className = "acs-feedback ko";
  }

  grupos.forEach((g, i) => {
    g.setAttribute("role", "button");
    g.setAttribute("tabindex", "0");
    g.setAttribute("aria-label", "Punto " + puntos[i].n);
    const pulsar = () => {
      if (g.classList.contains("hecho") || siguiente >= puntos.length) return;
      if (i === siguiente) acertar(i);
      else fallar(i);
    };
    g.addEventListener("click", pulsar);
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pulsar();
      }
    });
  });
}

function renderUnirPuntosSheet(ficha, container) {
  container.innerHTML = "";
  const sheet = acsCrearSheetBase(ficha);
  if (ficha.ayuda) sheet.appendChild(acsCrearTiraSerie(ficha.numeros));
  const lienzo = document.createElement("div");
  lienzo.className = "acs-puntos-lienzo";
  lienzo.appendChild(acsCrearSvgPuntos(ficha, { digital: false }).svg);
  sheet.appendChild(lienzo);
  container.appendChild(sheet);
}

// ---------- trazo (repasar y seguir el trazo) ----------
// ficha.modo = "repasar" (línea discontinua) | "seguir" (camino con
//   bordes, ancho ficha.anchoCamino)
// ficha.items = [
//   { forma: "camino", d: "M12,35 ...", inicio: "perro", fin: "hueso" }
//   { forma: "texto", texto: "casa", apoyo: "casa" }   (pictograma)
//   { forma: "texto", texto: "4", puntos: 4 }          (4 puntos al lado)
// ]
// Los caminos se dibujan en un cuadro de 300 x 70; los textos, en uno
// de 300 x 90.
//
// Esta es la única actividad del catálogo en la que, en pantalla, hay
// que arrastrar el dedo: es justo lo que se trabaja. Por eso la
// comprobación es muy tolerante (pincel gordo, basta con pasar por la
// mayor parte del trazo) y se puede borrar y repetir las veces que haga
// falta, sin marcar nada como error.

const ACS_TRAZO_FUENTE = "Andika";
const ACS_TRAZO_CAJA = { camino: { w: 300, h: 70 }, texto: { w: 300, h: 90 } };
const ACS_TRAZO_TAM_TEXTO = 62;

function acsTrazoCaja(item) {
  return ACS_TRAZO_CAJA[item.forma];
}

// Lo que acompaña a cada fila a la izquierda (y a la derecha en los
// caminos): el pictograma, o los puntos que dicen cuánto vale un número.
function acsTrazoApoyo(clave, puntos, digital) {
  if (typeof puntos === "number") {
    const wrap = document.createElement("span");
    wrap.className = "acs-pic acs-trazo-puntos";
    for (let i = 0; i < puntos; i++) {
      const punto = document.createElement("span");
      punto.className = "acs-trazo-punto";
      wrap.appendChild(punto);
    }
    return wrap;
  }
  if (!clave) return document.createElement("span");
  return arasaacCrearImagen(clave, { color: digital });
}

function acsTrazoFilaBase(item, digital) {
  const fila = document.createElement("div");
  fila.className = "acs-trazo-fila acs-trazo-fila-" + item.forma;
  fila.appendChild(acsTrazoApoyo(item.inicio || item.apoyo, item.puntos, digital));
  const centro = document.createElement("div");
  centro.className = "acs-trazo-centro";
  fila.appendChild(centro);
  if (item.forma === "camino") fila.appendChild(acsTrazoApoyo(item.fin, undefined, digital));
  return { fila, centro };
}

function renderTrazoSheet(ficha, container) {
  container.innerHTML = "";
  const sheet = acsCrearSheetBase(ficha);

  ficha.items.forEach((item) => {
    const { fila, centro } = acsTrazoFilaBase(item, false);
    const caja = acsTrazoCaja(item);
    const svg = acsCrearElementoSvg("svg", { viewBox: `0 0 ${caja.w} ${caja.h}`, class: "acs-trazo-svg" });

    if (item.forma === "camino") {
      if (ficha.modo === "seguir") {
        const ancho = ficha.anchoCamino;
        const comun = { d: item.d, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" };
        svg.appendChild(acsCrearElementoSvg("path", Object.assign({ stroke: "#33363f", "stroke-width": ancho + 2.5 }, comun)));
        svg.appendChild(acsCrearElementoSvg("path", Object.assign({ stroke: "#fff", "stroke-width": ancho }, comun)));
      } else {
        svg.appendChild(
          acsCrearElementoSvg("path", {
            d: item.d,
            fill: "none",
            stroke: "#8a8d96",
            "stroke-width": "2.4",
            "stroke-dasharray": "5 5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          })
        );
      }
      // Punto gordo de salida, a la izquierda: se empieza por ahí.
      const inicio = item.d.match(/^M([\d.]+),([\d.]+)/);
      svg.appendChild(acsCrearElementoSvg("circle", { cx: inicio[1], cy: inicio[2], r: 4.5, fill: "#33363f" }));
    } else {
      const texto = acsCrearElementoSvg("text", {
        x: caja.w / 2,
        y: caja.h * 0.5,
        class: "acs-trazo-texto",
        "font-size": ACS_TRAZO_TAM_TEXTO,
      });
      texto.textContent = item.texto;
      svg.appendChild(texto);
    }

    centro.appendChild(svg);
    sheet.appendChild(fila);
  });

  container.appendChild(sheet);
}

// Dibuja el modelo (lo que hay que repasar) en un <canvas>. Con
// "soloGuia" dibuja solo la línea central fina del camino, que es lo
// que se usa para medir por dónde ha pasado el dedo; sin él, lo que se
// ve en pantalla.
function acsTrazoPintarModelo(ctx, ficha, item, escala, { soloGuia = false, soloCamino = false } = {}) {
  const caja = acsTrazoCaja(item);
  ctx.save();
  ctx.scale(escala, escala);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (item.forma === "camino") {
    const path = new Path2D(item.d);
    if (soloGuia) {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.stroke(path);
    } else if (soloCamino) {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = ficha.anchoCamino + 6;
      ctx.stroke(path);
    } else if (ficha.modo === "seguir") {
      ctx.strokeStyle = "#33363f";
      ctx.lineWidth = ficha.anchoCamino + 2.5;
      ctx.stroke(path);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = ficha.anchoCamino;
      ctx.stroke(path);
    } else {
      ctx.strokeStyle = "#b9bcc4";
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.stroke(path);
      ctx.setLineDash([]);
    }
    if (!soloGuia && !soloCamino) {
      const inicio = item.d.match(/^M([\d.]+),([\d.]+)/);
      ctx.fillStyle = "#2a9d8f";
      ctx.beginPath();
      ctx.arc(Number(inicio[1]), Number(inicio[2]), 5.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  } else {
    ctx.font = `${ACS_TRAZO_TAM_TEXTO}px ${ACS_TRAZO_FUENTE}, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = soloGuia ? "#000" : "#d5d7dd";
    ctx.fillText(item.texto, caja.w / 2, caja.h * 0.5);
  }
  ctx.restore();
}

// Puntos del modelo (en píxeles del canvas) que hay que cubrir, tomados
// en una rejilla para no mirar píxel a píxel.
function acsTrazoMuestras(ancho, alto, pintar) {
  const lienzo = document.createElement("canvas");
  lienzo.width = ancho;
  lienzo.height = alto;
  const ctx = lienzo.getContext("2d");
  pintar(ctx);
  const datos = ctx.getImageData(0, 0, ancho, alto).data;
  const muestras = [];
  for (let y = 0; y < alto; y += 3) {
    for (let x = 0; x < ancho; x += 3) {
      if (datos[(y * ancho + x) * 4 + 3] > 0) muestras.push([x, y]);
    }
  }
  return { muestras, datos };
}

function renderTrazoDigital(ficha, container) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "acs-digital";

  const instr = document.createElement("p");
  instr.className = "acs-digital-instruccion";
  instr.textContent = ficha.instruccion;
  wrap.appendChild(instr);

  const feedback = document.createElement("p");
  feedback.className = "acs-feedback";

  // Tamaño interno fijo de los canvas (se escalan por CSS al ancho que
  // haya): así el dibujo, el modelo y la medición usan siempre las
  // mismas coordenadas, sea cual sea la pantalla.
  const ANCHO = 600;
  const escala = ANCHO / 300;
  let hechas = 0;

  ficha.items.forEach((item) => {
    const { fila, centro } = acsTrazoFilaBase(item, true);
    const caja = acsTrazoCaja(item);
    const alto = Math.round(caja.h * escala);

    const marco = document.createElement("div");
    marco.className = "acs-trazo-marco";
    const modelo = document.createElement("canvas");
    const dedo = document.createElement("canvas");
    [modelo, dedo].forEach((c) => {
      c.width = ANCHO;
      c.height = alto;
    });
    modelo.className = "acs-trazo-canvas";
    dedo.className = "acs-trazo-canvas acs-trazo-canvas-dedo";
    marco.appendChild(modelo);
    marco.appendChild(dedo);
    centro.appendChild(marco);

    const borrar = document.createElement("button");
    borrar.type = "button";
    borrar.className = "btn btn-secondary acs-trazo-borrar";
    borrar.textContent = "Borrar";
    // Al final de la fila, fuera del trazo: entre el camino y el
    // dibujo de llegada estorbaría.
    fila.appendChild(borrar);

    wrap.appendChild(fila);

    let muestras = [];
    let camino = null;
    function prepararModelo() {
      const ctx = modelo.getContext("2d");
      ctx.clearRect(0, 0, ANCHO, alto);
      acsTrazoPintarModelo(ctx, ficha, item, escala);
      muestras = acsTrazoMuestras(ANCHO, alto, (c) => acsTrazoPintarModelo(c, ficha, item, escala, { soloGuia: true })).muestras;
      if (ficha.modo === "seguir" && item.forma === "camino") {
        camino = acsTrazoMuestras(ANCHO, alto, (c) => acsTrazoPintarModelo(c, ficha, item, escala, { soloCamino: true })).datos;
      }
    }
    // El texto usa una fuente web: hay que esperar a que esté cargada
    // o se dibujaría (y se mediría) con la fuente de repuesto.
    if (item.forma === "texto" && document.fonts && document.fonts.load) {
      document.fonts.load(`${ACS_TRAZO_TAM_TEXTO}px ${ACS_TRAZO_FUENTE}`).then(prepararModelo, prepararModelo);
    } else {
      prepararModelo();
    }

    const ctxDedo = dedo.getContext("2d");
    let dibujando = false;
    let terminado = false;

    function coordenadas(e) {
      const r = dedo.getBoundingClientRect();
      return [((e.clientX - r.left) * dedo.width) / r.width, ((e.clientY - r.top) * dedo.height) / r.height];
    }

    function comprobar() {
      if (!muestras.length) return;
      const datos = ctxDedo.getImageData(0, 0, ANCHO, alto).data;
      // Un punto del modelo cuenta como repasado si el dedo ha pasado
      // cerca, no necesariamente encima: en "seguir el camino" vale
      // cualquier sitio dentro del camino, y al repasar se deja un
      // margen para que un pulso poco firme no obligue a repetir.
      const margenUnidades = item.forma === "texto" ? 3 : ficha.modo === "seguir" ? ficha.anchoCamino / 2 : 5;
      const margen = Math.round(margenUnidades * escala);
      const pintado = (x, y) => x >= 0 && y >= 0 && x < ANCHO && y < alto && datos[(y * ANCHO + x) * 4 + 3] > 0;
      const cerca = (x, y) => {
        if (pintado(x, y)) return true;
        for (let dy = -margen; dy <= margen; dy += 3) {
          for (let dx = -margen; dx <= margen; dx += 3) {
            if (dx * dx + dy * dy <= margen * margen && pintado(x + dx, y + dy)) return true;
          }
        }
        return false;
      };
      const cubiertas = muestras.filter(([x, y]) => cerca(x, y)).length;
      const cobertura = cubiertas / muestras.length;
      if (cobertura < (item.forma === "texto" ? 0.6 : 0.85)) return;

      let fuera = 0;
      if (camino) {
        let pintados = 0;
        for (let y = 0; y < alto; y += 3) {
          for (let x = 0; x < ANCHO; x += 3) {
            const i = (y * ANCHO + x) * 4 + 3;
            if (datos[i] > 0) {
              pintados++;
              if (camino[i] === 0) fuera++;
            }
          }
        }
        fuera = pintados ? fuera / pintados : 0;
      }

      terminado = true;
      fila.classList.add("hecho");
      hechas++;
      feedback.className = "acs-feedback ok";
      feedback.textContent =
        fuera > 0.2
          ? "¡Muy bien! La próxima vez intenta ir más por dentro del camino."
          : hechas === ficha.items.length
            ? "¡Muy bien! Has repasado todos los trazos."
            : "¡Muy bien! Sigue con el siguiente.";
    }

    dedo.addEventListener("pointerdown", (e) => {
      if (terminado) return;
      e.preventDefault();
      dedo.setPointerCapture(e.pointerId);
      dibujando = true;
      const [x, y] = coordenadas(e);
      ctxDedo.strokeStyle = "#2a9d8f";
      ctxDedo.lineCap = "round";
      ctxDedo.lineJoin = "round";
      // Pincel gordo a propósito: el objetivo es seguir la forma, no
      // la precisión de un lápiz fino.
      ctxDedo.lineWidth = (item.forma === "texto" ? 11 : 14) * escala;
      ctxDedo.beginPath();
      ctxDedo.moveTo(x, y);
      ctxDedo.lineTo(x + 0.1, y);
      ctxDedo.stroke();
    });
    dedo.addEventListener("pointermove", (e) => {
      if (!dibujando) return;
      const [x, y] = coordenadas(e);
      ctxDedo.lineTo(x, y);
      ctxDedo.stroke();
    });
    const soltar = () => {
      if (!dibujando) return;
      dibujando = false;
      comprobar();
    };
    dedo.addEventListener("pointerup", soltar);
    dedo.addEventListener("pointercancel", soltar);

    borrar.addEventListener("click", () => {
      ctxDedo.clearRect(0, 0, ANCHO, alto);
      if (terminado) hechas--;
      terminado = false;
      fila.classList.remove("hecho");
      feedback.textContent = "";
      feedback.className = "acs-feedback";
    });
  });

  wrap.appendChild(feedback);
  container.appendChild(wrap);
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
  "unir-puntos": { digital: renderUnirPuntosDigital, sheet: renderUnirPuntosSheet },
  "trazo": { digital: renderTrazoDigital, sheet: renderTrazoSheet },
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
    case "unir-puntos":
      return ["Dibujo: " + ficha.dibujo.nombre, "Orden: " + ficha.numeros.join(", ")];
    case "trazo":
      // No hay una respuesta que comprobar: se valora el trazo.
      return ficha.items.map((item, i) => `${i + 1}. ${item.forma === "camino" ? item.nombre : item.texto} (valorar el trazo)`);
    default:
      return [];
  }
}
