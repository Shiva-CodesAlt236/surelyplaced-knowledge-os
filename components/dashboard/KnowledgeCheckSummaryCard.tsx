"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MetricEmptyState } from "@/components/dashboard/MetricEmptyState"
import { useAssessmentsStore } from "@/lib/stores/useAssessmentsStore"
import { Award, CheckCircle, Target } from "lucide-react"

export function KnowledgeCheckSummaryCard() {
  const { results, streakDays } = useAssessmentsStore()
  const entries = Object.values(results)

  if (entries.length === 0) {
    return (
      <MetricEmptyState
        icon={Award}
        title="No Assessments Completed"
        description="Complete Knowledge Checks or Quizzes inside any module to track your assessment scores and build streaks."
      />
    )
  }

  const passedCount = entries.filter((r) => r.passed).length
  const totalCount = entries.length
  const avgScore = Math.round(
    entries.reduce((acc, r) => acc + r.score, 0) / (totalCount || 1)
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            Knowledge Assessments
          </CardTitle>
          <Badge variant="success" className="gap-1">
            {streakDays} Day Streak 🔥
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col p-3 rounded-lg bg-secondary/50 border border-border">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
              Passed Checks
            </span>
            <span className="text-2xl font-bold text-foreground mt-1">
              {passedCount} / {totalCount}
            </span>
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-secondary/50 border border-border">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Target className="h-3.5 w-3.5 text-sky-500" />
              Avg Score
            </span>
            <span className="text-2xl font-bold text-foreground mt-1">
              {avgScore}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
