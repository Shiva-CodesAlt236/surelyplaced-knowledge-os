"use client"

import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { CopilotResponse } from "@/lib/copilot/types"
import {
  ShieldCheck,
  Copy,
  Check,
  Lightbulb,
  HelpCircle,
  AlertTriangle,
  BookOpen,
} from "lucide-react"

export interface CopilotResponseCardProps {
  response: CopilotResponse
}

export function CopilotResponseCard({ response }: CopilotResponseCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response.recommendedResponse)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback if clipboard API unavailable
      setCopied(false)
    }
  }

  const confidenceBadgeVariant =
    response.confidence === "high"
      ? "default"
      : response.confidence === "medium"
      ? "secondary"
      : "outline"

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      {/* Header: Detected Objection & Confidence */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Detected Objection:
          </span>
          <span className="text-xs font-bold text-foreground">
            {response.objectionTitle}
          </span>
        </div>

        <Badge variant={confidenceBadgeVariant} className="text-[10px] uppercase font-mono">
          {response.confidence} Confidence
        </Badge>
      </div>

      {/* Recommended Response Box */}
      <div className="space-y-2 rounded-lg bg-primary/5 border border-primary/20 p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            Approved Response
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="h-7 px-2.5 text-[11px] font-bold gap-1 bg-card hover:bg-accent"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Response
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-foreground leading-relaxed font-medium">
          "{response.recommendedResponse}"
        </p>
      </div>

      {/* Why This Works */}
      <div className="space-y-1.5 rounded-md bg-secondary/50 p-3 border border-border/60">
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
          Why This Works
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {response.whyItWorks}
        </p>
      </div>

      {/* Next Question To Ask */}
      <div className="space-y-1.5 rounded-md bg-indigo-500/5 p-3 border border-indigo-500/15">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          <HelpCircle className="h-3.5 w-3.5" />
          Next Question To Ask
        </div>
        <p className="text-[11px] text-foreground italic font-medium">
          "{response.nextQuestion}"
        </p>
      </div>

      {/* Avoid Saying */}
      {response.avoidSaying && response.avoidSaying.length > 0 && (
        <div className="space-y-1.5 rounded-md bg-rose-500/5 p-3 border border-rose-500/15">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Avoid Saying
          </div>
          <ul className="space-y-1 pl-4 list-disc text-[11px] text-muted-foreground">
            {response.avoidSaying.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
