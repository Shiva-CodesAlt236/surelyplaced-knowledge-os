"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, Dumbbell } from "lucide-react"

export interface EstimatedTimeProps {
  readingMinutes: number
  practiceMinutes?: number
}

/**
 * Compact badge strip showing estimated reading time and optional
 * practice time for a lesson.
 */
export function EstimatedTime({
  readingMinutes,
  practiceMinutes,
}: EstimatedTimeProps) {
  return (
    <div className="my-4 flex flex-wrap items-center gap-2">
      <Badge variant="outline" className="gap-1.5 font-normal">
        <Clock className="size-3 text-fd-muted-foreground" />
        {readingMinutes} min read
      </Badge>

      {typeof practiceMinutes === "number" && practiceMinutes > 0 && (
        <Badge variant="outline" className="gap-1.5 font-normal">
          <Dumbbell className="size-3 text-fd-muted-foreground" />
          {practiceMinutes} min practice
        </Badge>
      )}
    </div>
  )
}
