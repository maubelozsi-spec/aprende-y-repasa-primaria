// ============================================================
// Escritor mínimo de documentos .docx directamente en el navegador,
// sin dependencias externas: construye un ZIP (método STORE, sin
// compresión) con las 3 partes OOXML imprescindibles para que Word
// abra el documento (Content_Types, _rels/.rels y word/document.xml).
// ============================================================

// ---------------- CRC32 (necesario para las cabeceras ZIP) ----------------

const CRC_TABLE = (() => {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date) {
  const time = ((date.getHours() & 0x1f) << 11) | ((date.getMinutes() & 0x3f) << 5) | ((date.getSeconds() >> 1) & 0x1f);
  const day = (((date.getFullYear() - 1980) & 0x7f) << 9) | (((date.getMonth() + 1) & 0xf) << 5) | (date.getDate() & 0x1f);
  return { time, day };
}

// ---------------- Escritor de bytes con enteros little-endian ----------------

class ByteWriter {
  constructor() {
    this.chunks = [];
    this.length = 0;
  }
  pushBytes(arr) {
    this.chunks.push(arr);
    this.length += arr.length;
  }
  pushUint16(v) {
    this.pushBytes(new Uint8Array([v & 0xff, (v >>> 8) & 0xff]));
  }
  pushUint32(v) {
    this.pushBytes(new Uint8Array([v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff]));
  }
  toUint8Array() {
    const out = new Uint8Array(this.length);
    let offset = 0;
    for (const chunk of this.chunks) {
      out.set(chunk, offset);
      offset += chunk.length;
    }
    return out;
  }
}

// ---------------- ZIP (sin compresión, método STORE) ----------------

function buildZip(files) {
  const encoder = new TextEncoder();
  const localWriter = new ByteWriter();
  const centralWriter = new ByteWriter();
  const { time, day } = dosDateTime(new Date());

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name);
    const data = file.data;
    const crc = crc32(data);
    const offset = localWriter.length;

    localWriter.pushUint32(0x04034b50);
    localWriter.pushUint16(20);
    localWriter.pushUint16(0);
    localWriter.pushUint16(0);
    localWriter.pushUint16(time);
    localWriter.pushUint16(day);
    localWriter.pushUint32(crc);
    localWriter.pushUint32(data.length);
    localWriter.pushUint32(data.length);
    localWriter.pushUint16(nameBytes.length);
    localWriter.pushUint16(0);
    localWriter.pushBytes(nameBytes);
    localWriter.pushBytes(data);

    centralWriter.pushUint32(0x02014b50);
    centralWriter.pushUint16(20);
    centralWriter.pushUint16(20);
    centralWriter.pushUint16(0);
    centralWriter.pushUint16(0);
    centralWriter.pushUint16(time);
    centralWriter.pushUint16(day);
    centralWriter.pushUint32(crc);
    centralWriter.pushUint32(data.length);
    centralWriter.pushUint32(data.length);
    centralWriter.pushUint16(nameBytes.length);
    centralWriter.pushUint16(0);
    centralWriter.pushUint16(0);
    centralWriter.pushUint16(0);
    centralWriter.pushUint16(0);
    centralWriter.pushUint32(0);
    centralWriter.pushUint32(offset);
    centralWriter.pushBytes(nameBytes);
  });

  const centralOffset = localWriter.length;
  const centralSize = centralWriter.length;

  const endWriter = new ByteWriter();
  endWriter.pushUint32(0x06054b50);
  endWriter.pushUint16(0);
  endWriter.pushUint16(0);
  endWriter.pushUint16(files.length);
  endWriter.pushUint16(files.length);
  endWriter.pushUint32(centralSize);
  endWriter.pushUint32(centralOffset);
  endWriter.pushUint16(0);

  const finalWriter = new ByteWriter();
  finalWriter.pushBytes(localWriter.toUint8Array());
  finalWriter.pushBytes(centralWriter.toUint8Array());
  finalWriter.pushBytes(endWriter.toUint8Array());
  return finalWriter.toUint8Array();
}

// ---------------- Contenido OOXML ----------------

const CONTENT_TYPES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;

const RELS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildRunProps(run) {
  let rpr = "";
  if (run.font) rpr += `<w:rFonts w:ascii="${run.font}" w:hAnsi="${run.font}" w:cs="${run.font}"/>`;
  if (run.bold) rpr += "<w:b/>";
  if (run.italic) rpr += "<w:i/>";
  if (run.strike) rpr += "<w:strike/>";
  if (run.color) rpr += `<w:color w:val="${run.color}"/>`;
  const size = run.size || 22;
  rpr += `<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>`;
  if (run.underline) rpr += `<w:u w:val="single"/>`;
  return rpr ? `<w:rPr>${rpr}</w:rPr>` : "";
}

function buildRun(run) {
  if (run.break) return `<w:r><w:br/></w:r>`;
  return `<w:r>${buildRunProps(run)}<w:t xml:space="preserve">${escapeXml(run.text)}</w:t></w:r>`;
}

function buildParagraph(p) {
  let pPr = "";
  if (p.pageBreakBefore) pPr += `<w:pageBreakBefore/>`;
  if (p.border) {
    const color = p.borderColor || "999999";
    pPr += `<w:pBdr><w:top w:val="single" w:sz="8" w:space="6" w:color="${color}"/><w:left w:val="single" w:sz="8" w:space="6" w:color="${color}"/><w:bottom w:val="single" w:sz="8" w:space="6" w:color="${color}"/><w:right w:val="single" w:sz="8" w:space="6" w:color="${color}"/></w:pBdr>`;
  }
  if (p.shading) {
    pPr += `<w:shd w:val="clear" w:color="auto" w:fill="${p.shading}"/>`;
  }
  if (p.spacingBefore !== undefined || p.spacingAfter !== undefined) {
    const before = p.spacingBefore !== undefined ? ` w:before="${p.spacingBefore}"` : "";
    const after = p.spacingAfter !== undefined ? ` w:after="${p.spacingAfter}"` : "";
    pPr += `<w:spacing${before}${after}/>`;
  }
  if (p.indent) {
    pPr += `<w:ind w:left="${p.indent}" w:right="${p.indent}"/>`;
  }
  if (p.align) pPr += `<w:jc w:val="${p.align}"/>`;

  const pPrXml = pPr ? `<w:pPr>${pPr}</w:pPr>` : "";
  const runsXml = (p.runs || []).map(buildRun).join("");
  return `<w:p>${pPrXml}${runsXml}</w:p>`;
}

function buildTableCellProps(cell, width) {
  let tcPr = `<w:tcW w:w="${width}" w:type="dxa"/>`;
  if (cell.colspan) tcPr += `<w:gridSpan w:val="${cell.colspan}"/>`;
  if (cell.vAlign) tcPr += `<w:vAlign w:val="${cell.vAlign}"/>`;
  if (cell.shading) tcPr += `<w:shd w:val="clear" w:color="auto" w:fill="${cell.shading}"/>`;
  if (cell.borders) {
    let bordersXml = "";
    ["top", "left", "bottom", "right"].forEach((side) => {
      const b = cell.borders[side];
      if (b) bordersXml += `<w:${side} w:val="single" w:sz="${b.sz || 4}" w:space="0" w:color="${b.color || "000000"}"/>`;
    });
    if (bordersXml) tcPr += `<w:tcBorders>${bordersXml}</w:tcBorders>`;
  }
  if (cell.margins) {
    let marginsXml = "";
    ["top", "left", "bottom", "right"].forEach((side) => {
      if (cell.margins[side] !== undefined) marginsXml += `<w:${side} w:w="${cell.margins[side]}" w:type="dxa"/>`;
    });
    if (marginsXml) tcPr += `<w:tcMar>${marginsXml}</w:tcMar>`;
  }
  return `<w:tcPr>${tcPr}</w:tcPr>`;
}

function buildTableCell(cell, width) {
  const tcPr = buildTableCellProps(cell, width);
  const paragraphs = cell.paragraphs && cell.paragraphs.length ? cell.paragraphs : [{ runs: [] }];
  const content = paragraphs.map(buildParagraph).join("");
  return `<w:tc>${tcPr}${content}</w:tc>`;
}

function buildTableRow(row, columnWidths) {
  const cellsXml = row.cells.map((cell, i) => buildTableCell(cell, columnWidths[i])).join("");
  return `<w:tr>${cellsXml}</w:tr>`;
}

function buildTable(table) {
  const gridXml = table.columnWidths.map((w) => `<w:gridCol w:w="${w}"/>`).join("");
  const totalWidth = table.columnWidths.reduce((a, b) => a + b, 0);
  const rowsXml = table.rows.map((row) => buildTableRow(row, table.columnWidths)).join("");
  return `<w:tbl><w:tblPr><w:tblW w:w="${totalWidth}" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders><w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/></w:tblBorders></w:tblPr><w:tblGrid>${gridXml}</w:tblGrid>${rowsXml}</w:tbl>`;
}

function buildBlock(block) {
  return block.table ? buildTable(block.table) : buildParagraph(block);
}

function buildDocumentXml(blocks) {
  const bodyXml = blocks.map(buildBlock).join("\n");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>
${bodyXml}
<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>
</w:body></w:document>`;
}

// ---------------- API pública ----------------

function createDocxBlob(blocks) {
  const encoder = new TextEncoder();
  const documentXml = buildDocumentXml(blocks);

  const files = [
    { name: "[Content_Types].xml", data: encoder.encode(CONTENT_TYPES_XML) },
    { name: "_rels/.rels", data: encoder.encode(RELS_XML) },
    { name: "word/document.xml", data: encoder.encode(documentXml) },
  ];

  const zipBytes = buildZip(files);
  return new Blob([zipBytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
