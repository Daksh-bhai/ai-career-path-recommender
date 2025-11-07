"use client"

import { Card } from "@/components/ui/card"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Pie } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

interface SkillsChartProps {
  requiredSkills?: string[]
  userSkills?: string[]
}

export default function SkillsChart({ requiredSkills = [], userSkills = [] }: SkillsChartProps) {
  if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
    return (
      <Card className="bg-card border-neon p-6 text-center text-muted-foreground">
        No skill data available for this career yet.
      </Card>
    )
  }

  const matchedSkills = userSkills.filter((skill) =>
    requiredSkills.some((req) => req.toLowerCase().includes(skill.toLowerCase()))
  ).length

  // Calculate skills to learn (ensure it's never negative)
  const skillsToLearn = Math.max(0, requiredSkills.length - matchedSkills)

  const data = {
    labels: ["Skills You Have", "Skills to Learn"],
    datasets: [
      {
        data: [matchedSkills, skillsToLearn],
        backgroundColor: ["#00d9ff", "#0f172a"],
        borderColor: ["#00d9ff", "#1e293b"],
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#e2e8f0",
          font: { size: 13 },
        },
      },
    },
  }

  return (
    <Card className="bg-card border-neon p-6">
      <h2 className="text-xl font-bold text-primary mb-6">Skills Analysis</h2>

      <div className="max-w-xs mx-auto">
        <Pie data={data} options={options} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-secondary rounded-lg border border-primary/30">
          <p className="text-primary text-2xl font-bold">{matchedSkills}</p>
          <p className="text-muted-foreground text-sm">Matched Skills</p>
        </div>
        <div className="p-3 bg-secondary rounded-lg border border-primary/30">
          <p className="text-primary text-2xl font-bold">{skillsToLearn}</p>
          <p className="text-muted-foreground text-sm">To Learn</p>
        </div>
      </div>
    </Card>
  )
}
