"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, CheckCircle, Target } from "lucide-react"

export interface KnowledgeCheckSummaryCardProps {
  passedChecks?: number
  totalChecks?: number
  averageScore?: number
  streakDays?: number
}

export function KnowledgeCheckSummaryCard({
  passedChecks = 14,
  totalChecks = 16,
  averageScore = 92,
  streakDays = 5,
}: KnowledgeCheckSummaryCardProps) {
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
              {passedChecks} / {totalChecks}
            </span>
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-secondary/50 border border-border">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Target className="h-3.5 w-3.5 text-sky-500" />
              Avg Score
            </span>
            <span className="text-2xl font-bold text-foreground mt-1">
              {averageScore}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
