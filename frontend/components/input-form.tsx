"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface InputFormProps {
  onSubmit: (data: any) => void
  loading: boolean
}

export default function InputForm({ onSubmit, loading }: InputFormProps) {
  const [formData, setFormData] = useState({
    academic_background: "",
    skills: "",
    interests: "",
    cgpa: "",
  })

  // handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // send data in the format the FastAPI backend expects
    onSubmit({
      academic: formData.academic_background,
      skills: formData.skills,
      interests: formData.interests,
      cgpa: Number.parseFloat(formData.cgpa),
    })
  }

  return (
    <Card className="bg-card border-neon p-6 space-y-4 sticky top-24 shadow-lg shadow-cyan-900/40">
      <h2 className="text-xl font-bold text-primary">Your Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Academic Background */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Academic Background
          </label>
          <textarea
            name="academic_background"
            value={formData.academic_background}
            onChange={handleChange}
            placeholder="e.g., Bachelor's in Computer Science"
            className="w-full bg-input border border-border rounded-md p-3 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            rows={3}
            required
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Skills (comma-separated)
          </label>
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., Python, SQL, Machine Learning"
            className="w-full bg-input border border-border rounded-md p-3 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            rows={3}
            required
          />
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Interests (comma-separated)
          </label>
          <textarea
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="e.g., AI, Data Science, Cloud Computing"
            className="w-full bg-input border border-border rounded-md p-3 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            rows={3}
            required
          />
        </div>

        {/* CGPA */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">CGPA</label>
          <input
            type="number"
            name="cgpa"
            value={formData.cgpa}
            onChange={handleChange}
            placeholder="e.g., 8.5"
            step="0.1"
            min="0"
            max="10"
            className="w-full bg-input border border-border rounded-md p-3 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            required
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition-all glow-neon-strong disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Get Recommendation"}
        </Button>
      </form>
    </Card>
  )
}
