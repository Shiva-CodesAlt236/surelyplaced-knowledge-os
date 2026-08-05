"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClipboardCheck, CheckCircle2, XCircle, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ScorecardCriterion {
  criterion: string
  score: "pass" | "fail" | "na"
  note?: string
}

export interface CallScorecardProps {
  title?: string
  criteria: ScorecardCriterion[]
}

/**
 * Displays a call evaluation scorecard with pass/fail/na per criterion.
 * Authors populate the criteria array in MDX — this widget does not
 * fabricate evaluation results.
 */
export function CallScorecard({
  title = "Call Evaluation Scorecard",
  criteria,
}: CallScorecardProps) {
  const passCount = criteria.filter((c) => c.score === "pass").length
  const total = criteria.filter((c) => c.score !== "na").length

  return (
    <Card className="my-6 border-fd-border bg-fd-card shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-sm font-bold">
            <ClipboardCheck className="size-4 text-fd-primary" />
            {title}
          </CardTitle>
          <Badge variant={passCount === total ? "success" : "outline"}>
            {passCount}/{total} Passed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="divide-y divide-fd-border rounded-md border border-fd-border">
          {criteria.map((item, i) => {
            const icon =
              item.score === "pass" ? (
                <CheckCircle2 className="size-4 text-emerald-500" />
              ) : item.score === "fail" ? (
                <XCircle className="size-4 text-red-500" />
              ) : (
                <Minus className="size-4 text-fd-muted-foreground" />
              )

            return (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3 px-3 py-2.5 text-sm",
                  item.score === "fail" && "bg-red-500/5"
                )}
              >
                <span className="mt-0.5 shrink-0">{icon}</span>
                <div className="flex-1 space-y-0.5">
                  <span className="font-medium text-fd-foreground">
                    {item.criterion}
                  </span>
                  {item.note && (
                    <p className="text-xs leading-relaxed text-fd-muted-foreground">
                      {item.note}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
