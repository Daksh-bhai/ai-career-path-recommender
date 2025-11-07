"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import CareerCard from "./career-card"
import SkillsChart from "./skills-chart"
import RoadmapTimeline from "./roadmap-timeline"
import { downloadPDF } from "@/lib/pdf-export"

interface RecommendationResultProps {
  data: any
}

export default function RecommendationResult({ data }: RecommendationResultProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [pdfProgress, setPdfProgress] = useState("")

  const handleDownloadPDF = async () => {
    if (!contentRef.current) {
      alert("Content not available for PDF generation.")
      return
    }

    if (!data.career_name) {
      alert("Career information not available.")
      return
    }

    setIsGeneratingPDF(true)
    setPdfProgress("Starting PDF generation...")

    try {
      await downloadPDF(
        contentRef.current,
        `${data.career_name.replace(/\s+/g, "_")}-roadmap.pdf`,
        (message) => setPdfProgress(message)
      )
      // Clear progress message after a short delay
      setTimeout(() => {
        setPdfProgress("")
      }, 2000)
    } catch (error) {
      console.error("PDF generation error:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error"
      alert(`Failed to generate PDF: ${errorMessage}\n\nPlease try again or check the browser console for details.`)
      setPdfProgress("")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end items-center gap-3">
        {pdfProgress && (
          <span className="text-sm text-muted-foreground">{pdfProgress}</span>
        )}
        <Button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground border border-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingPDF ? "⏳ Generating PDF..." : "📥 Download as PDF"}
        </Button>
      </div>

      <div ref={contentRef} className="space-y-8">
        <CareerCard career={data.career_name} description={data.career_description} />

        {data.required_skills && (
          <SkillsChart requiredSkills={data.required_skills} userSkills={data.user_skills || []} />
        )}

        {data.required_skills && data.required_skills.length > 0 && (
          <Card className="bg-card border-neon p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Skills Needed</h2>
            <div className="flex flex-wrap gap-2">
              {data.required_skills.map((skill: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm border border-primary/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        )}

        {data.recommended_courses && data.recommended_courses.length > 0 && (
          <Card className="bg-card border-neon p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Recommended Courses</h2>
            <ul className="space-y-2">
              {data.recommended_courses.map((course: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-foreground">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>{course}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {data.roadmap && <RoadmapTimeline roadmap={data.roadmap} />}
      </div>
    </div>
  )
}
