import html2pdf from "html2pdf.js";

export async function saveReportPdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  document.body.classList.add("pdf-exporting");

  // Give the browser one paint with the PDF-specific compact layout
  // before html2canvas clones the report.
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  try {
    const options = {
        margin: [0.2, 0.2, 0.2, 0.2],
        filename,
        image: {
          type: "jpeg",
          quality: 0.98,
        },
        html2canvas: {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
        },
        jsPDF: {
          unit: "in",
          format: "letter",
          orientation: "landscape",
        },
        pagebreak: {
          mode: ["css", "legacy"],
          avoid: [
            ".field-row",
            ".lung-cell",
            ".lab-cell",
            ".drip-card",
            ".todo-card",
          ],
        },
      };

    await html2pdf()
      // html2pdf.js supports pagebreak at runtime, but its current TS
      // declaration omits that option.
      .set(options as any)
      .from(element)
      .save();
  } finally {
    document.body.classList.remove("pdf-exporting");
  }
}
