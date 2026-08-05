"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  PenLine, Eye, RotateCcw, CheckCircle2, ThumbsUp, Target, RefreshCw,
  Sparkles, AlertTriangle, Lightbulb, ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface PracticeBoxProps {
  prompt: string
  recommendedAnswer: string
  placeholder?: string
  /** Explanation of why the recommended approach is effective. */
  whyThisWorks?: string
  /** Common advisor pitfall or trap to avoid. */
  commonMistake?: string
}

export function PracticeBox({
  prompt,
  recommendedAnswer,
  placeholder = "Type your practice response here...",
  whyThisWorks = "Diagnosing candidate motivation before prescribing solutions builds immediate trust and avoids defensive reactions.",
  commonMistake = "Rehearsing a generic pitch without addressing the candidate's specific hesitation.",
}: PracticeBoxProps) {
  const [response, setResponse] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [selfRating, setSelfRating] = useState<"nailed" | "close" | "review" | null>(null)

  const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0

  const handleSubmit = () => {
    if (response.trim()) {
      setSubmitted(true)
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setResponse("")
    setSelfRating(null)
  }

  return (
    <Card className="my-6 border-fd-border bg-fd-card shadow-sm overflow-hidden">
      <CardContent className="space-y-4 p-4 sm:p-5">
        {/* Header Ticker */}
        <div className="flex items-center justify-between gap-2 border-b border-fd-border pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-full bg-fd-primary/10 text-fd-primary">
              <PenLine className="size-3.5" />
            </div>
            <Badge variant="outline" className="gap-1 font-semibold text-xs">
              Practice Exercise
            </Badge>
          </div>

          {wordCount > 0 && (
            <span className="text-[10px] font-mono text-fd-muted-foreground">
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
          )}
        </div>

        {/* Prompt Statement */}
        <div className="space-y-1">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-fd-muted-foreground">
            Scenario Prompt
          </span>
          <p className="text-sm font-extrabold leading-snug text-fd-foreground">
            {prompt}
          </p>
        </div>

        {/* Step 1: Learner Input */}
        {!submitted ? (
          <div className="space-y-3 pt-1">
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder={placeholder}
              rows={3}
              className="w-full rounded-lg border border-fd-border bg-fd-background p-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fd-ring placeholder:text-fd-muted-foreground resize-y"
              aria-label="Your practice response"
            />

            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[10px] text-fd-muted-foreground">
                Type your response above, then submit to compare against standard.
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                disabled={!response.trim()}
                className="gap-1.5 text-xs font-semibold shrink-0"
              >
                <span>Submit & Compare</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          /* Step 2: Submitted Feedback & Comparison */
          <div className="space-y-4 pt-1">
            {/* Learner Submitted Text */}
            <div className="rounded-lg border border-fd-border bg-fd-secondary/40 p-3 space-y-1">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-fd-muted-foreground">
                Your Response
              </span>
              <p className="text-xs leading-relaxed text-fd-foreground italic">
                &ldquo;{response}&rdquo;
              </p>
            </div>

            {/* Recommended Answer */}
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 space-y-1">
              <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4" />
                Recommended Advisor Response
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-fd-foreground font-medium pt-1">
                {recommendedAnswer}
              </p>
            </div>

            {/* Why This Works */}
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3 space-y-1">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                <Lightbulb className="size-3" /> Why This Works
              </span>
              <p className="text-xs leading-relaxed text-fd-foreground">
                {whyThisWorks}
              </p>
            </div>

            {/* Common Pitfall */}
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 space-y-1">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <AlertTriangle className="size-3" /> Common Mistake To Avoid
              </span>
              <p className="text-xs leading-relaxed text-fd-foreground">
                {commonMistake}
              </p>
            </div>

            {/* Self-Rating Feedback Bar */}
            <div className="rounded-lg border border-fd-border bg-fd-secondary/30 p-3 space-y-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-fd-muted-foreground">
                Self-Evaluate Your Response
              </span>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelfRating("nailed")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors border",
                      selfRating === "nailed"
                        ? "bg-emerald-500 text-white border-emerald-600"
                        : "bg-fd-background text-fd-foreground border-fd-border hover:bg-emerald-500/10"
                    )}
                  >
                    <ThumbsUp className="size-3" /> Nailed It
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelfRating("close")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors border",
                      selfRating === "close"
                        ? "bg-sky-500 text-white border-sky-600"
                        : "bg-fd-background text-fd-foreground border-fd-border hover:bg-sky-500/10"
                    )}
                  >
                    <Target className="size-3" /> Close Match
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelfRating("review")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors border",
                      selfRating === "review"
                        ? "bg-amber-500 text-white border-amber-600"
                        : "bg-fd-background text-fd-foreground border-fd-border hover:bg-amber-500/10"
                    )}
                  >
                    <RefreshCw className="size-3" /> Needs Review
                  </button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="gap-1.5 text-xs text-fd-muted-foreground"
                >
                  <RotateCcw className="size-3.5" />
                  Try Exercise Again
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
