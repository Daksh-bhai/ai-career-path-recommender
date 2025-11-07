"use client"

import { Card } from "@/components/ui/card"

interface RoadmapPhase {
  phase?: string
  duration?: string
  items?: string[]
}

interface RoadmapTimelineProps {
  roadmap?: Array<RoadmapPhase | string>
}

export default function RoadmapTimeline({ roadmap = [] }: RoadmapTimelineProps) {
  if (!Array.isArray(roadmap) || roadmap.length === 0) {
    return (
      <Card className="bg-card border-neon p-6 text-center text-muted-foreground">
        No roadmap available for this career yet.
      </Card>
    )
  }

  return (
    <Card className="bg-card border-neon p-6">
      <h2 className="text-xl font-bold text-primary mb-8">Learning Roadmap</h2>

      <div className="space-y-8">
        {roadmap.map((phase, index) => {
          // Handle simple string-based roadmap steps
          if (typeof phase === "string") {
            return (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold glow-neon-strong">
                    {index + 1}
                  </div>
                  {index < roadmap.length - 1 && (
                    <div className="w-1 h-20 bg-gradient-to-b from-primary to-transparent mt-4" />
                  )}
                </div>
                <div className="pb-8 flex-1">
                  <p className="text-foreground text-sm">{phase}</p>
                </div>
              </div>
            )
          }

          // Handle object-based roadmap (with phase, duration, items)
          return (
            <div key={index} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold glow-neon-strong">
                  {index + 1}
                </div>
                {index < roadmap.length - 1 && (
                  <div className="w-1 h-20 bg-gradient-to-b from-primary to-transparent mt-4" />
                )}
              </div>

              <div className="pb-8 flex-1">
                <h3 className="text-lg font-bold text-primary mb-2">{phase.phase || `Phase ${index + 1}`}</h3>
                {phase.duration && (
                  <p className="text-muted-foreground text-sm mb-4">Duration: {phase.duration}</p>
                )}

                {Array.isArray(phase.items) && phase.items.length > 0 ? (
                  <ul className="space-y-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-foreground text-sm">
                        <span className="text-primary mt-1">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-foreground text-sm">{phase.phase}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
