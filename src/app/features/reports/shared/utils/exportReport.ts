import { format } from "date-fns";
import type { ExportPayload, ExportPayloadWithFilters } from "../types";

const sanitizeFileName = (fileName: string) => fileName.replace(/\s+/g, "-").toLowerCase();

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportReportToExcel = async ({ title, fileName, columns, rows }: ExportPayload) => {
  const XLSX = await import("xlsx");
  const header = columns.map((c) => c.label);
  const body = rows.map((row) => columns.map((c) => row[c.key] ?? ""));
  const ws = XLSX.utils.aoa_to_sheet([header, ...body]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 31));
  XLSX.writeFile(wb, `${sanitizeFileName(fileName)}.xlsx`);
};

export const exportReportToPdf = async ({ title, fileName, filters, columns, rows }: ExportPayloadWithFilters) => {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.setFontSize(14);
  doc.text(title, 40, 40);
  doc.setFontSize(10);
  doc.text(`Generado: ${format(new Date(), "yyyy-MM-dd HH:mm")}`, 40, 60);

  let y = 78;
  Object.entries(filters).forEach(([key, value]) => {
    doc.text(`${key}: ${value ?? "-"}`, 40, y);
    y += 14;
  });

  autoTable(doc, {
    startY: y + 8,
    head: [columns.map((c) => c.label)],
    body: rows.map((row) => columns.map((c) => String(row[c.key] ?? ""))),
    styles: { fontSize: 9 },
  });

  doc.save(`${sanitizeFileName(fileName)}.pdf`);
};

export const exportReportToHtml = ({ title, fileName, filters, columns, rows }: ExportPayloadWithFilters) => {
  const filterHtml = Object.entries(filters)
    .map(([key, value]) => `<li><strong>${key}:</strong> ${value ?? "-"}</li>`)
    .join("");
  const headerHtml = columns.map((c) => `<th>${c.label}</th>`).join("");
  const bodyHtml = rows
    .map((row) => `<tr>${columns.map((c) => `<td>${row[c.key] ?? ""}</td>`).join("")}</tr>`)
    .join("");

  const html = `<!doctype html><html lang="es"><head><meta charset="UTF-8" /><title>${title}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#1f2937}table{width:100%;border-collapse:collapse;margin-top:16px}th,td{border:1px solid #d1d5db;padding:8px;font-size:12px}th{background:#f3f4f6;text-align:left}</style></head><body><h1>${title}</h1><p>Generado: ${format(new Date(), "yyyy-MM-dd HH:mm")}</p><h3>Filtros</h3><ul>${filterHtml}</ul><table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></body></html>`;

  downloadBlob(new Blob([html], { type: "text/html;charset=utf-8" }), `${sanitizeFileName(fileName)}.html`);
};
