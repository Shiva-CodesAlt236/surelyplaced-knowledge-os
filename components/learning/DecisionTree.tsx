"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { GitBranch, ChevronRight, CheckCircle2 } from "lucide-react"

export interface DecisionBranch {
  label: string
  outcome: string
  /** "best" | "acceptable" | "poor" — drives color coding. */
  quality?: "best" | "acceptable" | "poor"
}

export interface DecisionTreeProps {
  /** The situation or question at the root. */
  situation: string
  /** The decision branches the learner can explore. */
  branches: DecisionBranch[]
  /** Contextual note shown below the tree. */
  note?: string
}

const qualityConfig = {
  best: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10 hover:bg-emerald-500/15",
    selectedBg: "bg-emerald-500/20",
    badge: "text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border-emerald-500/20",
    label: "Best Practice",
    dot: "bg-emerald-500",
  },
  acceptable: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/5 hover:bg-amber-500/10",
    selectedBg: "bg-amber-500/15",
    badge: "text-amber-700 dark:text-amber-300 bg-amber-500/15 border-amber-500/20",
    label: "Acceptable",
    dot: "bg-amber-500",
  },
  poor: {
    border: "border-red-500/30",
    bg: "bg-red-500/5 hover:bg-red-500/10",
    selectedBg: "bg-red-500/15",
    badge: "text-red-700 dark:text-red-300 bg-red-500/15 border-red-500/20",
    label: "Avoid",
    dot: "bg-red-500",
  },
}

/**
 * Visual decision tree for MDX embedding.
 * Presents a situation with branching options. Clicking a branch
 * reveals the outcome. All branches can be explored independently.
 */
export function DecisionTree({
  situation,
  branches,
  note,
}: DecisionTreeProps) {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="my-6 rounded-xl border border-fd-border bg-fd-card shadow-sm overflow-hidden">
      {/* Root node */}
      <div className="flex items-center gap-2 border-b border-fd-border bg-fd-secondary/40 px-4 py-3">
        <GitBranch className="size-4 shrink-0 text-fd-primary" />
        <span className="text-sm font-bold text-fd-foreground">Decision Point</span>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-sm font-semibold leading-snug text-fd-foreground">
          {situation}
        </p>

        {/* Branches */}
        <div className="space-y-2">
          {branches.map((branch, i) => {
            const q = qualityConfig[branch.quality ?? "acceptable"]
            const isSelected = selected === i

            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(isSelected ? null : i)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all",
                  isSelected ? cn(q.border, q.selectedBg) : cn("border-fd-border", q.bg)
                )}
                aria-expanded={isSelected}
              >
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={cn("size-2 shrink-0 rounded-full", q.dot)} />
                  <ChevronRight
                    className={cn(
                      "size-3.5 shrink-0 text-fd-muted-foreground transition-transform",
                      isSelected && "rotate-90"
                    )}
                  />
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-fd-foreground">{branch.label}</span>
                    {branch.quality && (
                      <Badge className={cn("gap-0.5 border text-[9px]", q.badge)}>
                        {branch.quality === "best" && <CheckCircle2 className="size-2.5" />}
                        {q.label}
                      </Badge>
                    )}
                  </div>

                  {isSelected && (
                    <p className="text-xs leading-relaxed text-fd-muted-foreground">
                      {branch.outcome}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {note && (
          <p className="text-xs italic leading-relaxed text-fd-muted-foreground">
            {note}
          </p>
        )}
      </div>
    </div>
  )
}
