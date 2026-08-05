"use client"

import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Lightbulb, Eye, EyeOff, BarChart2, Target, Users,
  Clock, Trophy, ChevronDown, Briefcase,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface RoleplayCardProps {
  scenario: string
  difficulty?: "Foundational" | "Intermediate" | "Advanced" | "Expert"
  objective: string
  context?: string
  /** Who the learner plays as. */
  yourRole?: string
  /** Who the other party is. */
  theirRole?: string
  /** Estimated time to complete, in minutes. */
  estimatedMinutes?: number
  /** What a successful outcome looks like. */
  successCriteria?: string
  hints?: string[]
  recommendedAnswer: string
  /** If provided, shown as "Manager Insight" after the answer. */
  managerTip?: string
}

const diffColor: Record<string, string> = {
  Foundational: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/20",
  Intermediate: "text-sky-600 dark:text-sky-400 bg-sky-500/15 border-sky-500/20",
  Advanced: "text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/20",
  Expert: "text-red-600 dark:text-red-400 bg-red-500/15 border-red-500/20",
}

export function RoleplayCard({
  scenario,
  difficulty = "Intermediate",
  objective,
  context,
  yourRole,
  theirRole,
  estimatedMinutes,
  successCriteria,
  hints = [],
  recommendedAnswer,
  managerTip,
}: RoleplayCardProps) {
  const [showHints, setShowHints] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [hintsRevealed, setHintsRevealed] = useState(0)

  const revealNextHint = () => {
    if (hintsRevealed < hints.length) {
      setHintsRevealed((c) => c + 1)
      setShowHints(true)
    }
  }

  return (
    <Card className="my-6 border-fd-border bg-fd-card shadow-sm overflow-hidden">
      {/* Colored top accent bar */}
      <div className={cn("h-1", diffColor[difficulty]?.replace(/text-\S+/g, "").replace("border-", "bg-") || "bg-sky-500/30")} />

      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Target className="size-3" />
            Roleplay
          </Badge>
          <Badge className={cn("gap-1 border", diffColor[difficulty] ?? diffColor.Intermediate)}>
            <BarChart2 className="size-2.5" />
            {difficulty}
          </Badge>
          {estimatedMinutes && (
            <Badge variant="outline" className="gap-1 text-[10px] font-normal">
              <Clock className="size-2.5" />
              ~{estimatedMinutes} min
            </Badge>
          )}
        </div>

        <CardTitle className="mt-2 text-lg font-bold leading-snug">
          {scenario}
        </CardTitle>

        {context && (
          <CardDescription className="mt-1 text-sm leading-relaxed">
            {context}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Role cards */}
        {(yourRole || theirRole) && (
          <div className="grid gap-2 sm:grid-cols-2">
            {yourRole && (
              <div className="flex items-start gap-2 rounded-lg border border-fd-border bg-fd-secondary/40 p-3">
                <Users className="mt-0.5 size-4 shrink-0 text-fd-primary" />
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-fd-muted-foreground">You play</span>
                  <span className="text-sm font-medium text-fd-foreground">{yourRole}</span>
                </div>
              </div>
            )}
            {theirRole && (
              <div className="flex items-start gap-2 rounded-lg border border-fd-border bg-fd-secondary/40 p-3">
                <Users className="mt-0.5 size-4 shrink-0 text-fd-muted-foreground" />
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-fd-muted-foreground">They play</span>
                  <span className="text-sm font-medium text-fd-foreground">{theirRole}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Objective */}
        <div className="rounded-lg border border-fd-border bg-fd-secondary/40 p-3">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-fd-muted-foreground">
            Objective
          </span>
          <p className="text-sm leading-relaxed text-fd-foreground">{objective}</p>
        </div>

        {/* Success criteria */}
        {successCriteria && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
            <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Trophy className="size-3" /> Success Criteria
            </span>
            <p className="text-sm leading-relaxed text-fd-foreground">{successCriteria}</p>
          </div>
        )}

        {/* Progressive hints */}
        {hints.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={showHints ? () => setShowHints(false) : revealNextHint}
                className="gap-1.5 text-xs text-fd-muted-foreground"
              >
                <Lightbulb className="size-3.5 text-amber-500" />
                {showHints
                  ? "Hide Hints"
                  : hintsRevealed === 0
                    ? `Reveal Hint (${hints.length} available)`
                    : `Reveal Next Hint (${hintsRevealed}/${hints.length})`}
              </Button>
              {hintsRevealed > 0 && (
                <Progress value={(hintsRevealed / hints.length) * 100} className="h-1 w-16" />
              )}
            </div>

            {showHints && hintsRevealed > 0 && (
              <ul className="space-y-1.5 pl-4">
                {hints.slice(0, hintsRevealed).map((hint, i) => (
                  <li key={i} className="list-disc text-xs leading-relaxed text-fd-muted-foreground">
                    {hint}
                  </li>
                ))}
              </ul>
            )}

            {showHints && hintsRevealed < hints.length && (
              <Button variant="ghost" size="sm" onClick={revealNextHint} className="gap-1 text-xs text-amber-600 dark:text-amber-400">
                <ChevronDown className="size-3" />
                Show next hint
              </Button>
            )}
          </div>
        )}

        {/* Recommended answer */}
        {showAnswer && (
          <div className="space-y-3">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Recommended Answer
              </span>
              <p className="text-sm leading-relaxed text-fd-foreground">
                {recommendedAnswer}
              </p>
            </div>

            {managerTip && (
              <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3">
                <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  <Briefcase className="size-3" /> Manager Insight
                </span>
                <p className="text-sm leading-relaxed text-fd-foreground">{managerTip}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant={showAnswer ? "outline" : "primary"}
          size="sm"
          onClick={() => setShowAnswer(!showAnswer)}
          className="gap-1.5 text-xs"
        >
          {showAnswer ? (
            <><EyeOff className="size-3.5" /> Hide Answer</>
          ) : (
            <><Eye className="size-3.5" /> Reveal Answer</>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
