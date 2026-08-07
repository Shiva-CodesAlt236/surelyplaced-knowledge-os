"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import type { CopilotResponse } from "@/lib/copilot/types"
import { Copy, Check, AlertTriangle, Lightbulb, HelpCircle, ShieldAlert } from "lucide-react"

export interface CopilotResponseCardProps {
  response: CopilotResponse
  onFeedback?: (rating: 'HELPFUL' | 'NEUTRAL' | 'UNHELPFUL') => void
}

export function CopilotResponseCard({ response, onFeedback }: CopilotResponseCardProps) {
  const [copied, setCopied] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState<'HELPFUL' | 'NEUTRAL' | 'UNHELPFUL' | null>(null)

  const handleCopy = () => {
    if (!response.recommendedResponse) return
    navigator.clipboard.writeText(response.recommendedResponse)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }

  const handleFeedback = (rating: 'HELPFUL' | 'NEUTRAL' | 'UNHELPFUL') => {
    setFeedbackRating(rating)
    if (onFeedback) onFeedback(rating)
  }

  const confidenceBadgeColor =
    response.confidenceLevel === "High"
      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
      : response.confidenceLevel === "Medium"
      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
      : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"

  return (
    <div className="space-y-4">
      {/* Low Confidence / Unmatched Alert Banner */}
      {(response.isLowConfidence || !response.hasMatch) && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-2.5 text-xs text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">
              {response.hasMatch ? `Low Confidence Match (${response.confidenceScore}%)` : "No Exact Match Found"}
            </span>
            <span className="text-[11px] opacity-90">
              {response.hasMatch
                ? "Review recommended response carefully before speaking."
                : "Showing general objection handling framework."}
            </span>
          </div>
        </div>
      )}

      {/* 1. Detected Objection Header */}
      <div className="bg-card border border-border rounded-lg p-3.5 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Detected Objection
          </span>
          <h3 className="text-sm font-bold text-foreground">
            {response.detectedObjection}
          </h3>
          <span className="text-[11px] text-muted-foreground block mt-0.5">
            Category: {response.category}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
            Confidence
          </span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${confidenceBadgeColor}`}>
            {response.confidenceLevel} ({response.confidenceScore}%)
          </span>
        </div>
      </div>

      {/* 2. Recommended Response (Approved Wording) */}
      <div className="bg-card border border-primary/30 rounded-lg p-4 space-y-2.5 shadow-sm border-l-4 border-l-primary">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary flex items-center gap-1.5">
            📢 Recommended Response (Approved Wording)
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 text-xs gap-1"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy Response"}
          </Button>
        </div>

        <div className="text-xs leading-relaxed font-medium p-3 rounded-md bg-muted/50 border border-border/60 text-foreground">
          {response.recommendedResponse}
        </div>
      </div>

      {/* 3 & 4. Grid: Why This Works & Next Question */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Why This Works */}
        <div className="bg-card border border-border rounded-lg p-3.5 space-y-1.5 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5" /> Why This Works
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {response.whyThisWorks}
          </p>
        </div>

        {/* Recommended Next Question */}
        <div className="bg-card border border-border rounded-lg p-3.5 space-y-1.5 shadow-sm">
          <span className="text-xs font-bold text-primary flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5" /> Next Question To Ask
          </span>
          <p className="text-xs font-semibold text-foreground leading-relaxed">
            {response.nextQuestion}
          </p>
        </div>
      </div>

      {/* 5. Avoid Saying */}
      <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-3 space-y-1">
        <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5" /> Avoid Saying
        </span>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {response.avoidSaying}
        </p>
      </div>

      {/* 6. Advisor Feedback Controls */}
      <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">Was this response helpful?</span>
        <div className="flex gap-1.5">
          <Button
            type="button"
            variant={feedbackRating === 'HELPFUL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFeedback('HELPFUL')}
            className="h-7 text-xs px-2.5"
          >
            👍 Helpful
          </Button>
          <Button
            type="button"
            variant={feedbackRating === 'NEUTRAL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFeedback('NEUTRAL')}
            className="h-7 text-xs px-2.5"
          >
            😐 Neutral
          </Button>
          <Button
            type="button"
            variant={feedbackRating === 'UNHELPFUL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFeedback('UNHELPFUL')}
            className="h-7 text-xs px-2.5"
          >
            👎 Unhelpful
          </Button>
        </div>
      </div>
    </div>
  )
}
