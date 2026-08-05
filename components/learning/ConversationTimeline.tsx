"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Phone } from "lucide-react"

const STAGES = [
  "Opening",
  "Rapport",
  "Discovery",
  "Pain",
  "Qualification",
  "Presentation",
  "Objections",
  "Closing",
] as const

export type ConversationStage = (typeof STAGES)[number]

export interface ConversationTimelineProps {
  /** The stage the conversation is currently at. */
  currentStage: ConversationStage
}

/**
 * Horizontal or vertical conversation-stage timeline that highlights
 * the current phase of a sales call. Authors set `currentStage` in MDX
 * to visually anchor the reader in the conversation flow.
 */
export function ConversationTimeline({
  currentStage,
}: ConversationTimelineProps) {
  const currentIdx = STAGES.indexOf(currentStage)

  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-fd-border bg-fd-card p-4">
      <div className="flex items-center gap-1" role="list" aria-label="Conversation stages">
        <Phone className="mr-1 size-4 shrink-0 text-fd-muted-foreground" aria-hidden />

        {STAGES.map((stage, i) => {
          const isPast = i < currentIdx
          const isCurrent = i === currentIdx
          const isFuture = i > currentIdx

          return (
            <React.Fragment key={stage}>
              <div
                role="listitem"
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  isCurrent &&
                    "bg-fd-primary text-fd-primary-foreground shadow-sm",
                  isPast &&
                    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                  isFuture &&
                    "text-fd-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full text-[9px] font-bold",
                    isCurrent && "bg-fd-primary-foreground/20",
                    isPast && "bg-emerald-500/20",
                    isFuture && "bg-fd-muted-foreground/20"
                  )}
                >
                  {i + 1}
                </span>
                {stage}
              </div>

              {i < STAGES.length - 1 && (
                <div
                  className={cn(
                    "h-px w-4 shrink-0",
                    i < currentIdx
                      ? "bg-emerald-500/40"
                      : "bg-fd-border"
                  )}
                  aria-hidden
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
