"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle } from "lucide-react"
import { useProgressStore } from "@/lib/stores/useProgressStore"
import { cn } from "@/lib/utils"

export interface MarkCompleteControlProps {
  articleSlug: string
}

export function MarkCompleteControl({ articleSlug }: MarkCompleteControlProps) {
  const { markComplete, markIncomplete, isCompleted } = useProgressStore()
  const completed = isCompleted(articleSlug)

  const handleToggle = () => {
    if (completed) {
      markIncomplete(articleSlug)
    } else {
      markComplete(articleSlug)
    }
  }

  return (
    <Button
      variant={completed ? "secondary" : "primary"}
      size="sm"
      onClick={handleToggle}
      aria-pressed={completed}
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
