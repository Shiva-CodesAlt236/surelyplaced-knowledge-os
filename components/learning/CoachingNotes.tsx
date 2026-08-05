"use client"

import React, { useState } from "react"
import { ChevronDown, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CoachingNotesProps {
  title?: string
  children: React.ReactNode
}

/**
 * Expandable coaching detail block for MDX embedding.
 * Hidden by default — the learner clicks to reveal the in-depth
 * coaching explanation.
 */
export function CoachingNotes({
  title = "Coaching Notes",
  children,
}: CoachingNotesProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="my-4 rounded-lg border border-sky-500/20 bg-sky-500/5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-500/10 dark:text-sky-300"
      >
        <GraduationCap className="size-4 shrink-0" />
        <span className="flex-1">{title}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="border-t border-sky-500/20 px-4 py-3 text-sm leading-relaxed text-fd-foreground">
          {children}
        </div>
      )}
    </div>
  )
}
