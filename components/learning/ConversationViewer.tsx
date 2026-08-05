"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface ChatMessage {
  sender: "rep" | "candidate"
  name?: string
  text: string
  annotation?: string
}

export interface ConversationViewerProps {
  messages: ChatMessage[]
  repName?: string
  candidateName?: string
  /** When provided, dims messages after this 0-based index. */
  highlightUpTo?: number
}

/**
 * Displays a sales script as an interactive messaging-style conversation.
 * Sales Executive bubbles align left; Candidate bubbles align right.
 * Designed for MDX embedding — Claude authors the message array in frontmatter
 * or inline JSX.
 */
export function ConversationViewer({
  messages,
  repName = "Sales Executive",
  candidateName = "Candidate",
  highlightUpTo,
}: ConversationViewerProps) {
  return (
    <div
      className="my-6 space-y-3 rounded-xl border border-fd-border bg-fd-card p-4"
      role="log"
      aria-label="Sales conversation"
    >
      {messages.map((msg, i) => {
        const isRep = msg.sender === "rep"
        const dimmed =
          typeof highlightUpTo === "number" && i > highlightUpTo

        return (
          <div
            key={i}
            className={cn(
              "flex gap-2",
              isRep ? "justify-start" : "justify-end",
              dimmed && "opacity-40"
            )}
          >
            {isRep && (
              <div
                className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-fd-primary text-[10px] font-bold text-fd-primary-foreground"
                aria-hidden
              >
                {(msg.name ?? repName).charAt(0)}
              </div>
            )}

            <div className="max-w-[75%] space-y-1">
              <span className="block text-[10px] font-semibold text-fd-muted-foreground">
                {isRep ? msg.name ?? repName : msg.name ?? candidateName}
              </span>
              <div
                className={cn(
                  "rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                  isRep
                    ? "rounded-tl-sm bg-fd-secondary text-fd-secondary-foreground"
                    : "rounded-tr-sm bg-fd-primary/10 text-fd-foreground"
                )}
              >
                {msg.text}
              </div>

              {msg.annotation && (
                <p className="px-1 text-[10px] italic text-fd-muted-foreground">
                  {msg.annotation}
                </p>
              )}
            </div>

            {!isRep && (
              <div
                className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-fd-accent text-[10px] font-bold text-fd-accent-foreground"
                aria-hidden
              >
                {(msg.name ?? candidateName).charAt(0)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
