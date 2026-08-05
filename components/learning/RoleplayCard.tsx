"use client"

import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Lightbulb, Eye, EyeOff, BarChart2, Target, Users,
  Clock, Trophy, ChevronRight, Briefcase, Play, CheckCircle2, RotateCcw, MessageSquare, GraduationCap
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
  yourRole = "Sales Advisor",
  theirRole = "Candidate / Prospect",
  estimatedMinutes,
  successCriteria,
  hints = [],
  recommendedAnswer,
  managerTip,
}: RoleplayCardProps) {
  // Step 1: Reflect & Type | Step 2: Compare & Coach
  const [step, setStep] = useState<1 | 2>(1)
  const [learnerResponse, setLearnerResponse] = useState("")
  const [showHints, setShowHints] = useState(false)
  const [hintsRevealed, setHintsRevealed] = useState(0)

  const revealNextHint = () => {
    if (hintsRevealed < hints.length) {
      setHintsRevealed((c) => c + 1)
      setShowHints(true)
    }
  }

  const handleStartReveal = () => {
    setStep(2)
  }

  const handleReset = () => {
    setStep(1)
    setLearnerResponse("")
    setShowHints(false)
    setHintsRevealed(0)
  }

  return (
    <Card className="my-6 border-fd-border bg-fd-card shadow-sm overflow-hidden">
      {/* Top Accent & Step Progress Header */}
      <div className={cn("h-1.5", diffColor[difficulty]?.replace(/text-\S+/g, "").replace("border-", "bg-") || "bg-sky-500/30")} />

      <CardHeader className="pb-3 border-b border-fd-border bg-fd-secondary/30">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1 font-semibold">
              <Target className="size-3" />
              Roleplay Simulation
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

          <span className="text-xs font-mono font-bold text-fd-muted-foreground">
            Step {step} of 2: {step === 1 ? "Practice Response" : "Coach Evaluation"}
          </span>
        </div>

        <CardTitle className="mt-2 text-lg font-extrabold leading-snug">
          {scenario}
        </CardTitle>

        {context && (
          <CardDescription className="mt-1 text-xs leading-relaxed text-fd-muted-foreground">
            {context}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4 p-4 sm:p-6">
        {/* Role Setup Cards */}
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex items-start gap-2 rounded-lg border border-fd-border bg-fd-secondary/40 p-3">
            <Users className="mt-0.5 size-4 shrink-0 text-fd-primary" />
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-fd-muted-foreground">Your Role</span>
              <span className="text-xs font-bold text-fd-foreground">{yourRole}</span>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg border border-fd-border bg-fd-secondary/40 p-3">
            <Users className="mt-0.5 size-4 shrink-0 text-fd-muted-foreground" />
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-fd-muted-foreground">Candidate / Counterpart</span>
              <span className="text-xs font-bold text-fd-foreground">{theirRole}</span>
            </div>
          </div>
        </div>

        {/* Objective & Success Criteria */}
        <div className="space-y-2">
          <div className="rounded-lg border border-fd-border bg-fd-secondary/30 p-3">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-fd-muted-foreground">
              Core Objective
            </span>
            <p className="text-xs leading-relaxed text-fd-foreground font-medium">{objective}</p>
          </div>

          {successCriteria && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Trophy className="size-3" /> Success Criteria
              </span>
              <p className="text-xs leading-relaxed text-fd-foreground">{successCriteria}</p>
            </div>
          )}
        </div>

        {/* STEP 1: Interactive Simulation Response Input */}
        {step === 1 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-fd-primary" />
              <span className="text-xs font-bold text-fd-foreground">
                How would you respond in this conversation?
              </span>
            </div>

            <textarea
              value={learnerResponse}
              onChange={(e) => setLearnerResponse(e.target.value)}
              placeholder="Type your spoken response here..."
              rows={4}
              className="w-full rounded-lg border border-fd-border bg-fd-background p-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fd-ring placeholder:text-fd-muted-foreground resize-y"
            />

            {/* Hints Section */}
            {hints.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={showHints ? () => setShowHints(false) : revealNextHint}
                    className="gap-1.5 text-xs text-fd-muted-foreground h-7"
                  >
                    <Lightbulb className="size-3.5 text-amber-500" />
                    {showHints
                      ? "Hide Hints"
                      : hintsRevealed === 0
                        ? `Reveal Hint (${hints.length} available)`
                        : `Reveal Next Hint (${hintsRevealed}/${hints.length})`}
                  </Button>
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
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Reveal & Coach Feedback Evaluation */}
        {step === 2 && (
          <div className="space-y-4 pt-2">
            {learnerResponse.trim() && (
              <div className="rounded-lg border border-fd-border bg-fd-secondary/40 p-3">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-fd-muted-foreground">
                  Your Response
                </span>
                <p className="text-xs leading-relaxed text-fd-foreground italic">&ldquo;{learnerResponse}&rdquo;</p>
              </div>
            )}

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 space-y-1">
              <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4" />
                Recommended Advisor Response
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-fd-foreground font-medium pt-1">
                {recommendedAnswer}
              </p>
            </div>

            {managerTip && (
              <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3.5">
                <span className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  <GraduationCap className="size-3.5" /> Coach Explanation & Insight
                </span>
                <p className="text-xs leading-relaxed text-fd-foreground">{managerTip}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-fd-border bg-fd-secondary/20 p-3 flex items-center justify-between">
        {step === 1 ? (
          <Button
            size="sm"
            onClick={handleStartReveal}
            className="w-full sm:w-auto ml-auto gap-1.5 text-xs font-semibold"
          >
            <span>Submit & Compare Response</span>
            <ChevronRight className="size-3.5" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="size-3.5" />
            Try Roleplay Again
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
