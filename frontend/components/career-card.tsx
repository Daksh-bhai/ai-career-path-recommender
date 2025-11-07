"use client"

import { Card } from "@/components/ui/card"

interface CareerCardProps {
  career: string
  description: string
}

export default function CareerCard({ career, description }: CareerCardProps) {
  return (
    <Card className="bg-gradient-to-br from-secondary to-card border-neon p-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <p className="text-primary text-sm font-mono mb-2">Recommended Path</p>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 glow-neon">{career}</h1>
        <p className="text-foreground/80 text-lg leading-relaxed">{description}</p>
      </div>
    </Card>
  )
}
