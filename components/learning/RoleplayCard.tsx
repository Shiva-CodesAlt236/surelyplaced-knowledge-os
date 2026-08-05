"use client"

import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Lightbulb, Eye, EyeOff, BarChart2, Target } from "lucide-react"
import { cn } from "@/lib/utils"

export interface RoleplayCardProps {
  scenario: string
  difficulty?: "Foundational" | "Intermediate" | "Advanced" | "Expert"
  objective: string
  hints?: string[]
  recommendedAnswer: string
}

/**
 * Interactive roleplay scenario card for MDX embedding.
 * Presents a sales situation, lets the learner think, then optionally
 * reveals hints and finally the recommended answer.
 */
export function RoleplayCard({
  scenario,
  difficulty = "Intermediate",
  objective,
  hints = [],
  recommendedAnswer,
}: RoleplayCardProps) {
  const [showHints, setShowHints] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const diffColor: Record<string, string> = {
    Foundational: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/20",
    Intermediate: "text-sky-600 dark:text-sky-400 bg-sky-500/15 border-sky-500/20",
    Advanced: "text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/20",
    Expert: "text-red-600 dark:text-red-400 bg-red-500/15 border-red-500/20",
  }

  return (
    <Card className="my-6 border-fd-border bg-fd-card shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Target className="size-3" />
            Roleplay
          </Badge>
          <Badge className={cn("border", diffColor[difficulty] ?? diffColor.Intermediate)}>
            <BarChart2 className="mr-1 size-3" />
            {difficulty}
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg font-bold leading-snug">
          {scenario}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div className="rounded-lg border border-fd-border bg-fd-secondary/40 p-3">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-fd-muted-foreground">
            Objective
          </span>
          <p className="text-sm leading-relaxed text-fd-foreground">{objective}</p>
        </div>

        {hints.length > 0 && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHints(!showHints)}
              className="gap-1.5 text-xs text-fd-muted-foreground"
            >
              <Lightbulb className="size-3.5 text-amber-500" />
              {showHints ? "Hide Hints" : `Show ${hints.length} Hint${hints.length > 1 ? "s" : ""}`}
            </Button>

            {showHints && (
              <ul className="mt-2 space-y-1.5 pl-4">
                {hints.map((hint, i) => (
                  <li
                    key={i}
                    className="list-disc text-xs leading-relaxed text-fd-muted-foreground"
                  >
                    {hint}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {showAnswer && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Recommended Answer
            </span>
            <p className="text-sm leading-relaxed text-fd-foreground">
              {recommendedAnswer}
            </p>
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
            <>
              <EyeOff className="size-3.5" /> Hide Answer
            </>
          ) : (
            <>
              <Eye className="size-3.5" /> Reveal Answer
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
