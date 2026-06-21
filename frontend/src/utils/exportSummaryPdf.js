import jsPDF from "jspdf";

export function exportSummaryAsPdf({ documentName, summary }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const maxWidth = pageWidth - margin * 2;
  let y = 100;

  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageWidth, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("DocuSense AI", margin, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("AI Document Summary", margin, 58);

  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(documentName || "Document", margin, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110, 110, 110);
  const dateLabel = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated on ${dateLabel}`, margin, y);
  y += 22;

  doc.setDrawColor(225, 225, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 25;

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);

  function ensureSpace(lineHeight) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  (summary || "").split("\n").forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      y += 8;
      return;
    }

    const bulletMatch = line.match(/^[*-]\s+(.*)/);
    const cleanText = (bulletMatch ? bulletMatch[1] : line).replace(/\*\*(.+?)\*\*/g, "$1");
    const indent = bulletMatch ? 14 : 0;
    const prefix = bulletMatch ? "•  " : "";
    const wrapped = doc.splitTextToSize(prefix + cleanText, maxWidth - indent);

    wrapped.forEach((wrappedLine) => {
      ensureSpace(16);
      doc.text(wrappedLine, margin + indent, y);
      y += 16;
    });
  });

  const safeName = (documentName || "document").replace(/\.pdf$/i, "").replace(/[^\w-]+/g, "_");
  doc.save(`${safeName}-summary.pdf`);
}
