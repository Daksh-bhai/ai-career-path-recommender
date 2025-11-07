"use client"

import { useState } from "react"
import InputForm from "@/components/input-form"
import RecommendationResult from "@/components/recommendation-result"
import SimilarCareers from "@/components/similar-careers"

export default function Home() {
  const [recommendation, setRecommendation] = useState(null)
  const [similarCareers, setSimilarCareers] = useState([])
  const [loading, setLoading] = useState(false)

  const handleGetRecommendation = async (data: any) => {
    setLoading(true)
    try {
      // ensure cgpa is a number before sending
      const formattedData = {
        academic: data.academic,
        skills: data.skills,
        interests: data.interests,
        cgpa: parseFloat(data.cgpa),
      }

      // Extract user skills from comma-separated string
      const userSkills = data.skills
        ? data.skills.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        : []

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const result = await response.json()
      
      // Transform backend response to match frontend component expectations
      const transformedResult = {
        career_name: result.career || "",
        career_description: `Your recommended career path based on your skills, interests, and academic background.`,
        required_skills: result.skills || [],
        recommended_courses: result.courses || [],
        roadmap: result.roadmap || [],
        user_skills: userSkills, // Pass user's input skills for comparison
      }

      setRecommendation(transformedResult)
      setSimilarCareers(result.similar_careers || [])
    } catch (error) {
      console.error("Error fetching recommendation:", error)
      alert("⚠️ Failed to get recommendation. Make sure backend is running on port 8000.")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-neon bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-mono font-bold text-primary-foreground glow-neon-strong">
              AI
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
              Career Path Recommender
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <InputForm onSubmit={handleGetRecommendation} loading={loading} />
          </div>

          <div className="md:col-span-2 space-y-8">
            {recommendation && <RecommendationResult data={recommendation} />}
            {similarCareers.length > 0 && <SimilarCareers careers={similarCareers} />}
          </div>
        </div>
      </main>
    </div>
  )
}
