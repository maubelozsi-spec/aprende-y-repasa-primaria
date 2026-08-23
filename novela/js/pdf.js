// ============================================================
// Novela Colectiva — generador de PDF propio.
//
// Escribe el archivo PDF a mano, byte a byte, sin ninguna librería
// externa: así la app sigue sin costar nada, sin depender de un
// servicio de internet y funcionando aunque el aula esté sin red.
//
// Cómo mide el texto: en vez de llevar dentro las tablas de anchura
// de las fuentes (miles de números), se mide con el propio navegador
// (canvas.measureText) usando la misma familia tipográfica que
// llevará el PDF. Se deja un 3 % de margen por si el navegador y el
// visor de PDF no coinciden al milímetro.
// ============================================================

// ---------- codificación de texto (WinAnsi / cp1252) ----------

const ESPECIALES = {
  "€": 0x80, "‚": 0x82, "ƒ": 0x83, "„": 0x84, "…": 0x85, "†": 0x86, "‡": 0x87,
  "ˆ": 0x88, "‰": 0x89, "Š": 0x8a, "‹": 0x8b, "Œ": 0x8c, "Ž": 0x8e, "‘": 0x91,
  "’": 0x92, "“": 0x93, "”": 0x94, "•": 0x95, "–": 0x96, "—": 0x97, "˜": 0x98,
  "™": 0x99, "š": 0x9a, "›": 0x9b, "œ": 0x9c, "ž": 0x9e, "Ÿ": 0x9f,
};

function bytesDeTexto(texto) {
  const salida = [];
  for (const ch of String(texto || "")) {
    let code;
    if (ESPECIALES[ch] !== undefined) code = ESPECIALES[ch];
    else {
      const cp = ch.codePointAt(0);
      code = cp <= 0xff ? cp : 63; // lo que no cabe en cp1252 → "?"
    }
    if (code === 40 || code === 41 || code === 92) salida.push(92); // ( ) \ se escapan
    salida.push(code);
  }
  return salida;
}

function cadenaPdf(texto) {
  const bytes = bytesDeTexto(texto);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return "(" + s + ")";
}

// ---------- medición ----------

const FUENTES = {
  normal: { pdf: "Times-Roman", css: 'normal normal {S}px "Times New Roman", Times, serif' },
  negrita: { pdf: "Times-Bold", css: 'normal bold {S}px "Times New Roman", Times, serif' },
  cursiva: { pdf: "Times-Italic", css: 'italic normal {S}px "Times New Roman", Times, serif' },
  titular: { pdf: "Helvetica-Bold", css: 'normal bold {S}px Helvetica, Arial, sans-serif' },
  pie: { pdf: "Helvetica", css: 'normal normal {S}px Helvetica, Arial, sans-serif' },
};

let lienzo = null;
function medir(texto, fuente, tamano) {
  if (!lienzo) lienzo = document.createElement("canvas").getContext("2d");
  lienzo.font = FUENTES[fuente].css.replace("{S}", tamano);
  return lienzo.measureText(texto).width * 1.03;
}

function partirEnLineas(texto, fuente, tamano, ancho) {
  const lineas = [];
  for (const parrafo of String(texto || "").split("\n")) {
    const palabras = parrafo.split(/\s+/).filter(Boolean);
    if (!palabras.length) { lineas.push(""); continue; }
    let linea = "";
    for (const palabra of palabras) {
      const prueba = linea ? linea + " " + palabra : palabra;
      if (medir(prueba, fuente, tamano) > ancho && linea) {
        lineas.push(linea);
        linea = palabra;
      } else {
        linea = prueba;
      }
    }
    if (linea) lineas.push(linea);
  }
  return lineas;
}

// ---------- documento ----------

const A4 = { ancho: 595.28, alto: 841.89 };
const MARGEN = { izq: 64, der: 64, arriba: 64, abajo: 64 };

class Documento {
  constructor(opciones) {
    this.opciones = opciones || {};
    this.paginas = [];
    this.nueva();
  }

  nueva() {
    this.actual = { ops: [], numero: this.paginas.length + 1 };
    this.paginas.push(this.actual);
    this.y = A4.alto - MARGEN.arriba;
    return this.actual;
  }

  get anchoUtil() { return A4.ancho - MARGEN.izq - MARGEN.der; }

  espacio(alto) {
    if (this.y - alto < MARGEN.abajo) this.nueva();
  }

  escribeLinea(texto, fuente, tamano, opciones) {
    const conf = opciones || {};
    const ancho = medir(texto, fuente, tamano);
    let x = MARGEN.izq;
    if (conf.centrado) x = (A4.ancho - ancho) / 2;
    const gris = conf.gris ? "0.42 0.42 0.42 rg\n" : "0 0 0 rg\n";
    this.actual.ops.push(
      gris + "BT /" + fuente + " " + tamano + " Tf 1 0 0 1 " +
      x.toFixed(2) + " " + this.y.toFixed(2) + " Tm " + cadenaPdf(texto) + " Tj ET"
    );
  }

  parrafo(texto, opciones) {
    const conf = opciones || {};
    const fuente = conf.fuente || "normal";
    const tamano = conf.tamano || 11.5;
    const interlineado = conf.interlineado || tamano * 1.5;
    const sangria = conf.sangria || 0;
    const ancho = this.anchoUtil - sangria;
    const lineas = partirEnLineas(texto, fuente, tamano, ancho);
    for (let i = 0; i < lineas.length; i++) {
      this.espacio(interlineado);
      const guardaIzq = MARGEN.izq;
      if (sangria) MARGEN.izq += sangria;
      this.escribeLinea(lineas[i], fuente, tamano, conf);
      MARGEN.izq = guardaIzq;
      this.y -= interlineado;
    }
    if (conf.despues) this.y -= conf.despues;
  }

  salto(alto) { this.y -= alto || 12; }

  saltoDePagina() { this.nueva(); }

  linea() {
    this.espacio(14);
    this.actual.ops.push(
      "0.8 0.8 0.8 RG 0.7 w " + MARGEN.izq + " " + this.y.toFixed(2) + " m " +
      (A4.ancho - MARGEN.der) + " " + this.y.toFixed(2) + " l S"
    );
    this.y -= 14;
  }

  // ---------- serialización ----------

  aBlob() {
    const objetos = [];
    const añadir = (contenido) => { objetos.push(contenido); return objetos.length; };

    const idFuentes = {};
    for (const [clave, f] of Object.entries(FUENTES)) {
      idFuentes[clave] = añadir("<< /Type /Font /Subtype /Type1 /BaseFont /" + f.pdf +
        " /Encoding /WinAnsiEncoding >>");
    }
    const recursos = "<< /Font << " +
      Object.entries(idFuentes).map(([clave, id]) => "/" + clave + " " + id + " 0 R").join(" ") +
      " >> >>";

    const idPaginas = objetos.length + 1 + this.paginas.length * 2;
    const idsPagina = [];
    for (const pagina of this.paginas) {
      const contenido = pagina.ops.join("\n");
      const idContenido = añadir("<< /Length " + contenido.length + " >>\nstream\n" + contenido + "\nendstream");
      const idPagina = añadir("<< /Type /Page /Parent " + idPaginas + " 0 R /MediaBox [0 0 " +
        A4.ancho + " " + A4.alto + "] /Resources " + recursos + " /Contents " + idContenido + " 0 R >>");
      idsPagina.push(idPagina);
    }
    añadir("<< /Type /Pages /Count " + idsPagina.length + " /Kids [" +
      idsPagina.map((id) => id + " 0 R").join(" ") + "] >>");
    const idCatalogo = añadir("<< /Type /Catalog /Pages " + idPaginas + " 0 R >>");
    const idInfo = añadir("<< /Title " + cadenaPdf(this.opciones.titulo || "Novela") +
      " /Producer (Novela Colectiva - Aprende y Repasa) /Creator (Novela Colectiva) >>");

    let pdf = "%PDF-1.4\n%\xe2\xe3\xcf\xd3\n";
    const posiciones = [];
    for (let i = 0; i < objetos.length; i++) {
      posiciones.push(pdf.length);
      pdf += (i + 1) + " 0 obj\n" + objetos[i] + "\nendobj\n";
    }
    const inicioTabla = pdf.length;
    pdf += "xref\n0 " + (objetos.length + 1) + "\n0000000000 65535 f \n";
    for (const pos of posiciones) {
      pdf += String(pos).padStart(10, "0") + " 00000 n \n";
    }
    pdf += "trailer\n<< /Size " + (objetos.length + 1) + " /Root " + idCatalogo +
      " 0 R /Info " + idInfo + " 0 R >>\nstartxref\n" + inicioTabla + "\n%%EOF";

    const bytes = new Uint8Array(pdf.length);
    for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff;
    return new Blob([bytes], { type: "application/pdf" });
  }
}

export function nuevoDocumento(opciones) {
  return new Documento(opciones);
}

export function descargar(blob, nombreArchivo) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 1500);
}
