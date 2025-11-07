import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export async function downloadPDF(
  element: HTMLElement,
  filename: string,
  onProgress?: (message: string) => void
): Promise<void> {
  try {
    if (onProgress) onProgress("Preparing content for PDF...")

    // Wait a bit to ensure all content is rendered (especially charts)
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (onProgress) onProgress("Capturing content as image...")

    const canvas = await html2canvas(element, {
      backgroundColor: "#0a0e27",
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      removeContainer: false,
      imageTimeout: 15000,
      foreignObjectRendering: false,
      onclone: (clonedDoc, element) => {
        // Ensure all canvas elements are visible and rendered in the cloned document
        const canvases = clonedDoc.querySelectorAll("canvas")
        canvases.forEach((canvasEl) => {
          const htmlCanvas = canvasEl as HTMLCanvasElement
          htmlCanvas.style.display = "block"
          htmlCanvas.style.visibility = "visible"
          htmlCanvas.style.opacity = "1"
        })
        
        // Also ensure all SVG elements are visible
        const svgs = clonedDoc.querySelectorAll("svg")
        svgs.forEach((svg) => {
          svg.style.display = "block"
          svg.style.visibility = "visible"
        })
      },
    })

    if (onProgress) onProgress("Generating PDF document...")

    const imgData = canvas.toDataURL("image/png", 1.0)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    })

    const pdfWidth = 210 // A4 width in mm
    const pdfHeight = 297 // A4 height in mm
    const imgWidth = pdfWidth
    const imgHeight = (canvas.height * pdfWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0
    let pageNum = 1

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight

    // Add additional pages if content is taller than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight
      pageNum++
    }

    if (onProgress) onProgress("Saving PDF...")

    pdf.save(filename)
    
    if (onProgress) onProgress("PDF downloaded successfully!")
  } catch (error) {
    console.error("Error generating PDF:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred"
    throw new Error(`Failed to generate PDF: ${errorMessage}`)
  }
}
