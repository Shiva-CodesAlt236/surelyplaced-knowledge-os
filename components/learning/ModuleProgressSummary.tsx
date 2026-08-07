"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useProgressStore } from "@/lib/stores/useProgressStore"
import { ACADEMY_LESSON_SEQUENCE } from "@/lib/academy-sequence"
import { MODULE_DURATIONS } from "@/lib/academy-duration"
import { Trophy, Clock, BookOpen, CheckCircle2 } from "lucide-react"

export interface ModuleProgressSummaryProps {
  moduleId: string
  moduleTitle?: string
}

/**
 * Renders an active completion progress card for a specific module
 * on its Overview page (`overview.mdx`). Reads `completedSlugs` from `useProgressStore`.
 */
export function ModuleProgressSummary({
  moduleId,
  moduleTitle,
}: ModuleProgressSummaryProps) {
  const completedSlugs = useProgressStore((s) => s.completedSlugs)

  const moduleLessons = ACADEMY_LESSON_SEQUENCE.filter((item) => item.moduleId === moduleId)
  const total = moduleLessons.length
  const completed = moduleLessons.filter((item) => completedSlugs.includes(item.slug)).length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const duration = MODULE_DURATIONS[moduleId] ?? 60

  return (
    <Card className="my-6 border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-transparent p-5 shadow-2xs">
      <CardContent className="p-0 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Trophy className="size-4" />
            </div>
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-fd-muted-foreground">
                Module Completion Status
              </span>
              <h4 className="text-xs font-bold text-fd-foreground">
                {moduleTitle ?? `${total} Lessons Module`}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 text-[10px] font-mono">
              <Clock className="size-3 text-amber-500" />
              ~{duration} min
            </Badge>
            <Badge variant={completed === total && total > 0 ? "success" : "default"} className="font-mono text-xs">
              {pct}%
            </Badge>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-fd-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="size-3 text-indigo-500" />
              <span>{completed} of {total} lessons completed</span>
            </span>
            {completed === total && total > 0 && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px]">
                <CheckCircle2 className="size-3" /> Module Mastered
              </span>
            )}
          </div>
          <Progress value={completed} max={total} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
