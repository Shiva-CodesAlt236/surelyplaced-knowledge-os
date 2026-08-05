"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PenLine, Eye, RotateCcw, CheckCircle2, ThumbsUp, Target, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PracticeBoxProps {
  prompt: string
  recommendedAnswer: string
  placeholder?: string
}

export function PracticeBox({
  prompt,
  recommendedAnswer,
  placeholder = "Type your response here...",
}: PracticeBoxProps) {
  const [response, setResponse] = useState("")
  const [revealed, setRevealed] = useState(false)
  const [selfRating, setSelfRating] = useState<"nailed" | "close" | "review" | null>(null)

  const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0

  const handleReset = () => {
    setRevealed(false)
    setResponse("")
    setSelfRating(null)
  }

  return (
    <Card className="my-6 border-fd-border bg-fd-card shadow-sm overflow-hidden">
      <CardContent className="space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-full bg-fd-primary/10 text-fd-primary">
              <PenLine className="size-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-fd-muted-foreground">
              Practice Exercise
            </span>
          </div>

          {wordCount > 0 && (
            <span className="text-[10px] font-mono text-fd-muted-foreground">
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
          )}
        </div>

        <p className="text-sm font-extrabold leading-snug text-fd-foreground">
          {prompt}
        </p>

        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder={placeholder}
          rows={3}
          disabled={revealed}
          className="w-full rounded-md border border-fd-border bg-fd-background p-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fd-ring placeholder:text-fd-muted-foreground resize-y disabled:opacity-80"
          aria-label="Your practice response"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setRevealed(true)}
            disabled={revealed || !response.trim()}
            className="gap-1.5 text-xs font-semibold"
          >
            <Eye className="size-3.5" />
            Reveal Recommended Answer
          </Button>

          {revealed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 text-xs text-fd-muted-foreground ml-auto"
            >
              <RotateCcw className="size-3.5" />
              Reset Exercise
            </Button>
          )}
        </div>

        {revealed && (
          <div className="space-y-3 pt-2">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5">
              <span className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                Recommended Answer
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-fd-foreground font-medium pt-1">
                {recommendedAnswer}
              </p>
            </div>

            {/* Self-Rating Feedback Buttons */}
            <div className="rounded-lg border border-fd-border bg-fd-secondary/30 p-3 space-y-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-fd-muted-foreground">
                How close was your response?
              </span>
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
