// ============================================================
// Empaquetador ZIP genérico para agrupar varios documentos .docx ya
// generados (Blobs) en un único archivo descargable. Reutiliza
// buildZip(files) de js/docx-writer.js, que ya construye un ZIP sin
// compresión a partir de {name, data:Uint8Array} sin asumir nada
// específico de un .docx.
// ============================================================

async function createZipBundle(namedBlobs) {
  // namedBlobs: array de { name, blob }
  const files = [];
  for (const { name, blob } of namedBlobs) {
    const buffer = await blob.arrayBuffer();
    files.push({ name, data: new Uint8Array(buffer) });
  }
  const zipBytes = buildZip(files);
  return new Blob([zipBytes], { type: "application/zip" });
}
