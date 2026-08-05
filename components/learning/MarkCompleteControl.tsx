"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MarkCompleteControlProps {
  initialCompleted?: boolean
  articleSlug?: string
  onToggleComplete?: (completed: boolean) => void
}

export function MarkCompleteControl({
  initialCompleted = false,
  onToggleComplete,
}: MarkCompleteControlProps) {
  const [completed, setCompleted] = useState(initialCompleted)

  const handleToggle = () => {
    const nextState = !completed
    setCompleted(nextState)
    if (onToggleComplete) {
      onToggleComplete(nextState)
    }
  }

  return (
    <Button
      variant={completed ? "secondary" : "primary"}
      size="sm"
      onClick={handleToggle}
      className={cn(
        "gap-2 font-medium transition-all shadow-sm",
        completed && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/30"
      )}
    >
      {completed ? (
        <>
          <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-500/20" />
          <span>Completed</span>
        </>
      ) : (
        <>
          <Circle className="h-4 w-4" />
          <span>Mark as Complete</span>
        </>
      )}
    </Button>
  )
}
