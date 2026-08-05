"use client"

import React from "react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100)

  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-medium text-foreground">{label}</span>}
          {showPercentage && (
            <span className="font-mono text-muted-foreground font-semibold">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <Progress value={value} max={max} className="h-2" />
    </div>
  )
}
