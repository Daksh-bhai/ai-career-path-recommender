import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export async function downloadPDF(
  element: HTMLElement,
  filename: string,
  onProgress?: (message: string) => void
): Promise<void> {
  try {
    if (onProgress) onProgress("Extracting content...")

    // Extract text content from DOM - traverse more carefully
    let careerName = ""
    let description = ""
    
    // Get career name and description from the first card
    const careerCard = element.querySelector(".space-y-8 > div:first-child")
    if (careerCard) {
      careerName = careerCard.querySelector("h2")?.textContent?.trim() || "Career Path"
      description = careerCard.querySelector("p")?.textContent?.trim() || ""
    }
    
    // Get skills - now looking specifically in the Skills Needed section
    const skillsList: string[] = []
    const skillsSection = Array.from(element.querySelectorAll("h2")).find(h => h.textContent?.includes("Skills Needed"))
    if (skillsSection?.parentElement) {
      const skills = skillsSection.parentElement.querySelectorAll("span.rounded-full")
      skills.forEach((skill) => {
        const text = skill.textContent?.trim()
        if (text) skillsList.push(text)
      })
    }

    // Get recommended courses - improved parent element traversal
    const coursesList: string[] = []
    const coursesSection = Array.from(element.querySelectorAll("h2")).find(h => h.textContent?.includes("Recommended Courses"))
    if (coursesSection?.parentElement) {
      const courses = coursesSection.parentElement.querySelectorAll("li")
      courses.forEach((item) => {
        // Remove bullet point and clean up text
        const text = item.textContent?.replace(/^[•→➤]/, "").trim()
        if (text) coursesList.push(text)
      })
    }

    // Get roadmap items - handle both string and object-based roadmap items
    const roadmapItems: string[] = []
    const roadmapSection = Array.from(element.querySelectorAll("h2")).find(h => h.textContent?.includes("Learning Roadmap"))
    if (roadmapSection?.parentElement) {
      // Look for both direct text nodes and list items
      const items = roadmapSection.parentElement.querySelectorAll(".flex.gap-6 p, .flex.gap-6 li")
      items.forEach((item) => {
        const text = item.textContent?.replace(/^[•→➤]/, "").trim()
        if (text && !text.includes("Learning Roadmap")) {
          roadmapItems.push(text)
        }
      })
    }

    if (onProgress) onProgress("Generating PDF document...")

    // Create PDF with text content
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const margin = 20 // margin in mm
    const pageWidth = 210 - (margin * 2) // A4 width minus margins
    let y = margin // current y position

    // Helper to add text with word wrap and return final y position
    const addWrappedText = (text: string, startY: number, fontSize = 12): number => {
      pdf.setFontSize(fontSize)
      const lines = pdf.splitTextToSize(text, pageWidth)
      pdf.text(lines, margin, startY)
      return startY + (lines.length * (fontSize * 0.3527)) // convert pt to mm
    }

    // Function to check and add new page if needed
    const checkNewPage = (currentY: number, neededSpace: number = 40): number => {
      if (currentY + neededSpace > 270) { // A4 height is 297mm, leave margin
        pdf.addPage()
        return margin
      }
      return currentY
    }

    // Add title and metadata
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(6, 182, 212) // matches your theme's primary color
    y = addWrappedText(careerName, y, 24)
    pdf.setTextColor(0) // reset to black
    y += 15

    // Add description
    if (description) {
      y = checkNewPage(y)
      pdf.setFont("helvetica", "normal")
      y = addWrappedText(description, y, 12)
      y += 15
    }

    // Add skills section
    if (skillsList.length > 0) {
      y = checkNewPage(y)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(6, 182, 212)
      y = addWrappedText("Required Skills", y, 18)
      pdf.setTextColor(0)
      y += 8
      
      pdf.setFont("helvetica", "normal")
      skillsList.forEach(skill => {
        y = checkNewPage(y, 8)
        y = addWrappedText(`• ${skill}`, y, 12)
        y += 4
      })
      y += 15
    }

    // Add courses section
    if (coursesList.length > 0) {
      y = checkNewPage(y)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(6, 182, 212)
      y = addWrappedText("Recommended Courses", y, 18)
      pdf.setTextColor(0)
      y += 8
      
      pdf.setFont("helvetica", "normal")
      coursesList.forEach(course => {
        y = checkNewPage(y, 8)
        y = addWrappedText(`• ${course}`, y, 12)
        y += 4
      })
      y += 15
    }

    // Add roadmap section
    if (roadmapItems.length > 0) {
      y = checkNewPage(y)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(6, 182, 212)
      y = addWrappedText("Learning Roadmap", y, 18)
      pdf.setTextColor(0)
      y += 8
      
      pdf.setFont("helvetica", "normal")
      roadmapItems.forEach((item, index) => {
        y = checkNewPage(y, 8)
        y = addWrappedText(`${index + 1}. ${item}`, y, 12)
        y += 4
      })
    }
    
    // Add footer with page numbers
    const pageCount = pdf.internal.pages.length - 1
    for(let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFontSize(10)
      pdf.setTextColor(128)
      pdf.text(
        `Page ${i} of ${pageCount}`,
        pdf.internal.pageSize.width - 40,
        pdf.internal.pageSize.height - 10
      )
    }    if (onProgress) onProgress("Saving PDF...")
    pdf.save(filename)
    if (onProgress) onProgress("PDF downloaded successfully!")
  } catch (error) {
    console.error("Error generating PDF:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred"
    throw new Error(`Failed to generate PDF: ${errorMessage}`)
  }
}
