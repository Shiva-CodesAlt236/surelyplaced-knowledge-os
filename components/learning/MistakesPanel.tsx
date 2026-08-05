"use client"

import React, { useState } from "react"
import { ChevronDown, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Mistake {
  title: string
  description: string
  correction?: string
}

export interface MistakesPanelProps {
  title?: string
  mistakes: Mistake[]
}

/**
 * Expandable accordion listing common mistakes with corrections.
 * Each item collapses independently — the learner clicks to see
 * the explanation and recommended correction.
 */
export function MistakesPanel({
  title = "Common Mistakes to Avoid",
  mistakes,
}: MistakesPanelProps) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div className="my-6 rounded-lg border border-red-500/20 bg-red-500/5">
      <div className="flex items-center gap-2 border-b border-red-500/20 px-4 py-3">
        <AlertTriangle className="size-4 text-red-500" />
        <span className="text-sm font-bold text-red-700 dark:text-red-400">
          {title}
        </span>
      </div>

      <div className="divide-y divide-red-500/10">
        {mistakes.map((mistake, i) => {
          const isOpen = openIndexes.has(i)
          return (
            <div key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-fd-foreground transition-colors hover:bg-red-500/5"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-600 dark:text-red-400">
                  {i + 1}
                </span>
                <span className="flex-1">{mistake.title}</span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-fd-muted-foreground transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {isOpen && (
                <div className="space-y-2 px-4 pb-3 pl-11 text-sm leading-relaxed text-fd-muted-foreground">
                  <p>{mistake.description}</p>
                  {mistake.correction && (
                    <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-2.5">
                      <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Instead, do this
                      </span>
                      <p className="text-fd-foreground">{mistake.correction}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
