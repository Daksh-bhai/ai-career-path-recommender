"use client"

import { Card } from "@/components/ui/card"

interface SimilarCareersProps {
  careers?: string[]
}

export default function SimilarCareers({ careers = [] }: SimilarCareersProps) {
  if (!Array.isArray(careers) || careers.length === 0) {
    return (
      <Card className="bg-card border-neon p-6 text-center text-muted-foreground">
        No similar careers found for this profile.
      </Card>
    )
  }

  return (
    <Card className="bg-card border-neon p-6">
      <h2 className="text-xl font-bold text-primary mb-4">Similar Career Paths</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {careers.map((career, index) => (
          <div
            key={index}
            className="p-4 bg-secondary rounded-lg border border-primary/30 hover:border-primary hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer group"
          >
            <p className="text-foreground group-hover:text-primary transition-colors font-medium">
              {career}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}
