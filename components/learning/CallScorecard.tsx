"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ClipboardCheck, CheckCircle2, XCircle, Minus, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ScorecardCriterion {
  criterion: string
  score: "pass" | "fail" | "na"
  /** Weight from 1-3 for visual emphasis. Default 1. */
  weight?: number
  note?: string
  /** Optional category grouping, e.g. "Opening", "Discovery". */
  category?: string
}

export interface CallScorecardProps {
  title?: string
  criteria: ScorecardCriterion[]
  /** Overall grade label. Rendered if provided. */
  overallGrade?: string
  /** Summary coaching note shown at the bottom. */
  summary?: string
}

export function CallScorecard({
  title = "Call Evaluation Scorecard",
  criteria,
  overallGrade,
  summary,
}: CallScorecardProps) {
  const scorable = criteria.filter((c) => c.score !== "na")
  const passCount = scorable.filter((c) => c.score === "pass").length
  const total = scorable.length
  const pct = total > 0 ? Math.round((passCount / total) * 100) : 0

  // Group by category if any criteria have categories
  const hasCategories = criteria.some((c) => c.category)
  const categories: string[] = []
  if (hasCategories) {
    criteria.forEach((c) => {
      const cat = c.category ?? "General"
      if (!categories.includes(cat)) categories.push(cat)
    })
  }

  const gradeColor =
    pct >= 80 ? "text-emerald-600 dark:text-emerald-400"
    : pct >= 50 ? "text-amber-600 dark:text-amber-400"
    : "text-red-600 dark:text-red-400"

  const GradeIcon = pct >= 80 ? TrendingUp : pct >= 50 ? AlertTriangle : TrendingDown

  function renderRow(item: ScorecardCriterion, i: number) {
    const icon =
      item.score === "pass" ? <CheckCircle2 className="size-4 text-emerald-500" />
      : item.score === "fail" ? <XCircle className="size-4 text-red-500" />
      : <Minus className="size-4 text-fd-muted-foreground" />

    return (
      <div
        key={i}
        className={cn(
          "flex items-start gap-3 px-3 py-2.5 text-sm",
          item.score === "fail" && "bg-red-500/5",
          item.weight && item.weight >= 3 && "border-l-2 border-l-amber-500/50"
        )}
      >
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div className="flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-medium text-fd-foreground">{item.criterion}</span>
            {item.weight && item.weight >= 2 && (
              <span className="text-[9px] font-bold uppercase text-amber-600 dark:text-amber-400">
                {item.weight >= 3 ? "Critical" : "Important"}
              </span>
            )}
          </div>
          {item.note && (
            <p className="text-xs leading-relaxed text-fd-muted-foreground">{item.note}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="my-6 border-fd-border bg-fd-card shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-sm font-bold">
            <ClipboardCheck className="size-4 text-fd-primary" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {overallGrade && (
              <Badge className={cn("gap-1 border font-bold", gradeColor, "bg-transparent border-current/20")}>
                <GradeIcon className="size-3" />
                {overallGrade}
              </Badge>
            )}
            <Badge variant={pct === 100 ? "success" : "outline"}>
              {passCount}/{total} Passed
            </Badge>
          </div>
        </div>
        {/* Score bar */}
        <div className="mt-2 flex items-center gap-2">
          <Progress value={pct} className="h-2 flex-1" />
          <span className={cn("text-xs font-bold tabular-nums", gradeColor)}>{pct}%</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {hasCategories ? (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat}>
                <div className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-fd-muted-foreground">
                  {cat}
                </div>
                <div className="divide-y divide-fd-border rounded-md border border-fd-border">
                  {criteria
                    .filter((c) => (c.category ?? "General") === cat)
                    .map((item, i) => renderRow(item, i))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-fd-border rounded-md border border-fd-border">
            {criteria.map((item, i) => renderRow(item, i))}
          </div>
        )}

        {summary && (
          <div className="mt-3 rounded-lg border border-sky-500/20 bg-sky-500/5 p-3">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Coaching Summary
            </span>
            <p className="text-sm leading-relaxed text-fd-foreground">{summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
