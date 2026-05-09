import { jsPDF } from "jspdf";
import type { StructuredNotes } from "../types";
import { API_URL } from "../config";

export function exportToPdf(notes: StructuredNotes): void {
  try {
    const doc = new jsPDF();
    const timestamp = new Date().toISOString();
    let y = 20;

    doc.setFontSize(18);
    doc.text("AI Powered Smart Summarizer", 14, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(timestamp, 14, y);
    y += 12;

    doc.setFontSize(14);
    doc.text("Key Points", 14, y);
    y += 8;
    doc.setFontSize(11);
    for (const point of notes.key_points) {
      const lines = doc.splitTextToSize(`• ${point}`, 180);
      doc.text(lines, 14, y);
      y += lines.length * 6 + 2;
      if (y > 270) { doc.addPage(); y = 20; }
    }

    y += 4;
    doc.setFontSize(14);
    doc.text("Bullet Summary", 14, y);
    y += 8;
    doc.setFontSize(11);
    for (const bullet of notes.bullet_summary) {
      const lines = doc.splitTextToSize(`• ${bullet}`, 180);
      doc.text(lines, 14, y);
      y += lines.length * 6 + 2;
      if (y > 270) { doc.addPage(); y = 20; }
    }

    if (notes.chapters && notes.chapters.length > 0) {
      y += 4;
      doc.setFontSize(14);
      doc.text("Chapter Breakdown", 14, y);
      y += 8;
      for (const ch of notes.chapters) {
        doc.setFontSize(12);
        doc.text(ch.title, 14, y);
        y += 6;
        doc.setFontSize(11);
        const lines = doc.splitTextToSize(ch.summary, 180);
        doc.text(lines, 14, y);
        y += lines.length * 6 + 4;
        if (y > 270) { doc.addPage(); y = 20; }
      }
    }

    const filename = `smart-notes-${timestamp.replace(/[:.]/g, "-")}.pdf`;
    doc.save(filename);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    fetch(`${API_URL}/log-error`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: `PDF generation failed: ${reason}`, timestamp: new Date().toISOString() }),
    }).catch(() => {});
    alert("PDF generation failed. Please try again.");
  }
}
