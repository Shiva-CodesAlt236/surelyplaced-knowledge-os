"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pause, Eye, HelpCircle, CheckCircle2, RotateCcw, MessageSquare } from "lucide-react"

export interface DecisionPointProps {
  prompt: string
  bestAnswer: string
  context?: string
}

export function DecisionPoint({
  prompt,
  bestAnswer,
  context,
}: DecisionPointProps) {
  const [userChoice, setUserChoice] = useState("")
  const [revealed, setRevealed] = useState(false)

  const handleReveal = () => {
    setRevealed(true)
  }

  const handleReset = () => {
    setUserChoice("")
    setRevealed(false)
  }

  return (
    <Card className="my-6 border-amber-500/30 bg-amber-500/5 shadow-sm overflow-hidden">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Pause className="size-3.5" />
            </div>
            <Badge variant="accent" className="gap-1 font-semibold">
              <HelpCircle className="size-3" />
              Decision Point Pause
            </Badge>
          </div>
          <span className="text-[10px] font-mono font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Reflect First
          </span>
        </div>

        {context && (
          <p className="text-xs italic leading-relaxed text-fd-muted-foreground border-l-2 border-amber-500/40 pl-3">
            {context}
          </p>
        )}

        <p className="text-sm font-extrabold leading-snug text-fd-foreground">
          {prompt}
        </p>

        {!revealed ? (
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 text-xs font-medium text-fd-muted-foreground">
              <MessageSquare className="size-3.5 text-amber-500" />
              <span>Formulate your response before revealing the answer:</span>
            </div>
            <textarea
              value={userChoice}
              onChange={(e) => setUserChoice(e.target.value)}
              placeholder="What would you say next in this situation?"
              rows={2}
              className="w-full rounded-md border border-amber-500/30 bg-fd-background p-2.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 placeholder:text-fd-muted-foreground resize-y"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleReveal}
              className="gap-1.5 text-xs font-semibold"
            >
              <Eye className="size-3.5" />
              Compare With Best Answer
            </Button>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {userChoice.trim() && (
              <div className="rounded-lg border border-fd-border bg-fd-secondary/40 p-3">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-fd-muted-foreground">
                  Your Response
                </span>
                <p className="text-xs leading-relaxed text-fd-foreground italic">&ldquo;{userChoice}&rdquo;</p>
              </div>
            )}

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5">
              <span className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                Recommended Response
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-fd-foreground font-medium pt-1">
                {bestAnswer}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 text-xs text-fd-muted-foreground"
            >
              <RotateCcw className="size-3.5" />
              Reset Decision Point
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
