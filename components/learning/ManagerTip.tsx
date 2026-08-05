"use client"

import React, { useState } from "react"
import { ChevronDown, Briefcase, Star } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ManagerTipProps {
  /** Name/title of the manager, e.g. "VP Sales", "Senior AE". */
  from?: string
  /** Urgency: "standard" (default), "important", "critical". */
  priority?: "standard" | "important" | "critical"
  children: React.ReactNode
}

const priorityStyles = {
  standard: {
    border: "border-sky-500/20",
    bg: "bg-sky-500/5",
    header: "text-sky-700 dark:text-sky-300 hover:bg-sky-500/10",
    icon: "text-sky-600 dark:text-sky-400",
    divider: "border-sky-500/20",
  },
  important: {
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
    header: "text-amber-700 dark:text-amber-300 hover:bg-amber-500/10",
    icon: "text-amber-600 dark:text-amber-400",
    divider: "border-amber-500/20",
  },
  critical: {
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    header: "text-red-700 dark:text-red-300 hover:bg-red-500/10",
    icon: "text-red-600 dark:text-red-400",
    divider: "border-red-500/20",
  },
}

/**
 * Expandable coaching note from a manager or senior rep.
 * Content is hidden until the learner deliberately opens it.
 */
export function ManagerTip({
  from = "Sales Manager",
  priority = "standard",
  children,
}: ManagerTipProps) {
  const [open, setOpen] = useState(false)
  const s = priorityStyles[priority]

  return (
    <div className={cn("my-4 rounded-lg border", s.border, s.bg)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold transition-colors rounded-t-lg",
          s.header
        )}
      >
        {priority === "critical" ? (
          <Star className={cn("size-4 shrink-0 fill-current", s.icon)} />
        ) : (
          <Briefcase className={cn("size-4 shrink-0", s.icon)} />
        )}
        <span className="flex-1">
          {from}&apos;s Tip
          {priority !== "standard" && (
            <span className="ml-1.5 text-[10px] uppercase tracking-wider opacity-70">
              ({priority})
            </span>
          )}
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className={cn("border-t px-4 py-3 text-sm leading-relaxed text-fd-foreground", s.divider)}>
          {children}
        </div>
      )}
    </div>
  )
}
