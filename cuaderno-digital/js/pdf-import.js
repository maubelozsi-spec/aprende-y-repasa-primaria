// ============================================================
// Cuaderno Digital — importar un PDF como "impresión": cada página
// del PDF se convierte en una imagen que se coloca en el lienzo, tal
// y como hace OneNote con "Insertar → Impresión de PDF". No se
// incrusta el PDF en sí (no hay un lector de PDF navegable dentro de
// la página): se puede escribir encima de cada página con el lápiz
// porque, a todos los efectos, es una imagen más.
//
// Un PDF de muchas páginas tarda: se convierte página a página en el
// propio dispositivo (sin subir el PDF a ningún sitio) y se avisa
// del progreso con onProgreso.
// ============================================================

const PDFJS_VERSION = "3.11.174";
const PDFJS_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
const PDFJS_WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;
const ANCHO_OBJETIVO_PX = 1600; // resolución de render: legible al escribir/zoom encima

let cargaPromesa = null;

function cargarPdfJs() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (cargaPromesa) return cargaPromesa;
  cargaPromesa = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PDFJS_URL;
    script.onload = () => {
      if (!window.pdfjsLib) {
        reject(new Error("El lector de PDF no se cargó correctamente."));
        return;
      }
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error("No se pudo cargar el lector de PDF. Comprueba la conexión a internet."));
    document.head.appendChild(script);
  });
  return cargaPromesa;
}

// onProgreso(paginaActual, totalPaginas)
async function importarPaginasPDF(archivo, onProgreso) {
  const pdfjsLib = await cargarPdfJs();
  const datos = await archivo.arrayBuffer();
  const documento = await pdfjsLib.getDocument({ data: datos }).promise;

  const paginas = [];
  for (let i = 1; i <= documento.numPages; i++) {
    const pagina = await documento.getPage(i);
    const viewportBase = pagina.getViewport({ scale: 1 });
    const escala = ANCHO_OBJETIVO_PX / viewportBase.width;
    const viewport = pagina.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext("2d");
    await pagina.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    paginas.push({ blob, ancho: viewport.width, alto: viewport.height, numeroPagina: i });

    if (onProgreso) onProgreso(i, documento.numPages);
  }
  return paginas;
}

export { importarPaginasPDF };
