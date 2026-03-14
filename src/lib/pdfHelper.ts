import { jsPDF } from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";

export const BRAND_COLORS = {
  primary: [220, 38, 38], // Tailwind danger (red-600)
  secondary: [15, 23, 42], // Tailwind slate-900 
  text: [51, 65, 85], // Tailwind slate-700
  info: [56, 189, 248], // Tailwind sky-400
};

export function setupSDRRSDoc(title: string, orientation: 'p' | 'l' = 'p') {
  const doc = new jsPDF({ orientation });
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header Branding block
  doc.setFillColor(BRAND_COLORS.secondary[0], BRAND_COLORS.secondary[1], BRAND_COLORS.secondary[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Logo placeholder text
  doc.setTextColor(BRAND_COLORS.primary[0], BRAND_COLORS.primary[1], BRAND_COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("SDRRS", 20, 20);
  
  // Tagline
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("SMART DISASTER RESPONSE SYSTEM", 20, 28);
  
  // Document Title formatting
  doc.setTextColor(BRAND_COLORS.secondary[0], BRAND_COLORS.secondary[1], BRAND_COLORS.secondary[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(title, 20, 60);

  // Meta Info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(BRAND_COLORS.text[0], BRAND_COLORS.text[1], BRAND_COLORS.text[2]);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 70);
  doc.text(`System Status: SECURE HAVEN CONTROL ONLINE`, 20, 75);

  return doc;
}

export function addFooter(doc: jsPDF) {
  const pageCount = (doc as any).internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    // Add red footer line
    doc.setDrawColor(BRAND_COLORS.primary[0], BRAND_COLORS.primary[1], BRAND_COLORS.primary[2]);
    doc.setLineWidth(0.5);
    doc.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);
    
    // Add page numbers
    doc.text(
      `SDRRS Confidential • Automatically Generated Report • Page ${i} of ${pageCount}`, 
      pageWidth / 2, 
      pageHeight - 10, 
      { align: 'center' }
    );
  }
}

export function drawTable(doc: jsPDF, startY: number, options: UserOptions) {
  autoTable(doc, {
    startY,
    headStyles: {
      fillColor: BRAND_COLORS.secondary as any,
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      font: 'helvetica',
      textColor: BRAND_COLORS.text as any,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // Tailwind slate-50
    },
    ...options
  });
  return (doc as any).lastAutoTable.finalY + 10;
}
