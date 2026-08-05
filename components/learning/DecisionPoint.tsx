"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pause, Eye, HelpCircle } from "lucide-react"

export interface DecisionPointProps {
  prompt: string
  bestAnswer: string
  context?: string
}

/**
 * Pauses the conversation flow to pose a "What would you say next?"
 * question. The learner reflects, then reveals the recommended response.
 */
export function DecisionPoint({
  prompt,
  bestAnswer,
  context,
}: DecisionPointProps) {
  const [revealed, setRevealed] = useState(false)

  return (
    <Card className="my-6 border-amber-500/30 bg-amber-500/5 shadow-sm">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Pause className="size-3.5" />
          </div>
          <Badge variant="accent" className="gap-1">
            <HelpCircle className="size-3" />
            Decision Point
          </Badge>
        </div>

        {context && (
          <p className="text-xs italic leading-relaxed text-fd-muted-foreground">
            {context}
          </p>
        )}

        <p className="text-sm font-semibold leading-snug text-fd-foreground">
          {prompt}
        </p>

        {revealed ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Recommended Response
            </span>
            <p className="text-sm leading-relaxed text-fd-foreground">
              {bestAnswer}
            </p>
          </div>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setRevealed(true)}
            className="gap-1.5 text-xs"
          >
            <Eye className="size-3.5" />
            Reveal Best Answer
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
