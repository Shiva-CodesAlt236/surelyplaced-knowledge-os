"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PenLine, Eye, RotateCcw } from "lucide-react"

export interface PracticeBoxProps {
  prompt: string
  recommendedAnswer: string
  placeholder?: string
}

/**
 * Interactive practice input where the learner types their own response
 * and then reveals the recommended answer for self-comparison.
 */
export function PracticeBox({
  prompt,
  recommendedAnswer,
  placeholder = "Type your response here...",
}: PracticeBoxProps) {
  const [response, setResponse] = useState("")
  const [revealed, setRevealed] = useState(false)

  return (
    <Card className="my-6 border-fd-border bg-fd-card shadow-sm">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-fd-primary/10 text-fd-primary">
            <PenLine className="size-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-fd-muted-foreground">
            Practice Exercise
          </span>
        </div>

        <p className="text-sm font-semibold leading-snug text-fd-foreground">
          {prompt}
        </p>

        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-md border border-fd-border bg-fd-background p-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fd-ring placeholder:text-fd-muted-foreground resize-y"
          aria-label="Your practice response"
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setRevealed(true)}
            disabled={revealed}
            className="gap-1.5 text-xs"
          >
            <Eye className="size-3.5" />
            Reveal Recommended Answer
          </Button>

          {revealed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRevealed(false)
                setResponse("")
              }}
              className="gap-1.5 text-xs text-fd-muted-foreground"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          )}
        </div>

        {revealed && (
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
    </Card>
  )
}
