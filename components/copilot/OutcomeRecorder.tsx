"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import type { OutcomeStatus, LostReason } from "@/lib/copilot/types"
import { CheckCircle2, Clock, XCircle, ThumbsUp, ThumbsDown, Minus } from "lucide-react"

export interface OutcomeRecorderProps {
  onSaveOutcome: (outcome: OutcomeStatus, reason?: LostReason) => void
  onFeedback?: (rating: "thumbs-up" | "neutral" | "thumbs-down") => void
}

export function OutcomeRecorder({ onSaveOutcome, onFeedback }: OutcomeRecorderProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeStatus | null>(null)
  const [lostReason, setLostReason] = useState<LostReason>("price")
  const [feedbackRating, setFeedbackRating] = useState<"thumbs-up" | "neutral" | "thumbs-down" | null>(null)
  const [saved, setSaved] = useState(false)

  const handleOutcomeSelect = (outcome: OutcomeStatus) => {
    setSelectedOutcome(outcome)
    setSaved(true)
    onSaveOutcome(outcome, outcome === "lost" ? lostReason : undefined)
  }

  const handleReasonChange = (reason: LostReason) => {
    setLostReason(reason)
    if (selectedOutcome === "lost") {
      onSaveOutcome("lost", reason)
    }
  }

  const handleFeedback = (rating: "thumbs-up" | "neutral" | "thumbs-down") => {
    setFeedbackRating(rating)
    if (onFeedback) onFeedback(rating)
  }

  return (
    <div className="space-y-3.5 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">Student Outcome Tracking</span>
        {saved && (
          <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Recorded
          </span>
        )}
      </div>

      {/* Outcome Selector Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          size="sm"
          variant={selectedOutcome === "enrolled" ? "primary" : "outline"}
          onClick={() => handleOutcomeSelect("enrolled")}
          className={`h-9 text-xs font-bold gap-1.5 ${
            selectedOutcome === "enrolled" ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Enrolled
        </Button>

        <Button
          type="button"
          size="sm"
          variant={selectedOutcome === "follow-up" ? "primary" : "outline"}
          onClick={() => handleOutcomeSelect("follow-up")}
          className={`h-9 text-xs font-bold gap-1.5 ${
            selectedOutcome === "follow-up" ? "bg-amber-600 text-white hover:bg-amber-700" : ""
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          Follow-up
        </Button>

        <Button
          type="button"
          size="sm"
          variant={selectedOutcome === "lost" ? "primary" : "outline"}
          onClick={() => handleOutcomeSelect("lost")}
          className={`h-9 text-xs font-bold gap-1.5 ${
            selectedOutcome === "lost" ? "bg-rose-600 text-white hover:bg-rose-700" : ""
          }`}
        >
          <XCircle className="h-3.5 w-3.5" />
          Lost
        </Button>
      </div>

      {/* If Lost: Select Reason */}
      {selectedOutcome === "lost" && (
        <div className="space-y-2 rounded-md bg-rose-500/5 p-3 border border-rose-500/15 animate-in fade-in duration-150">
          <label className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
            Reason for Loss:
          </label>
          <select
            value={lostReason}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleReasonChange(e.target.value as LostReason)}
            className="w-full h-8 text-xs rounded-md border border-border bg-card px-2 text-foreground font-medium"
          >
            <option value="price">Price / Budget</option>
            <option value="trust">Trust / Credibility</option>
            <option value="timing">Timing / Not Now</option>
            <option value="competitor">Competitor</option>
            <option value="other">Other</option>
          </select>
        </div>
      )}

      {/* Advisor Feedback Rating */}
      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <span className="text-[11px] text-muted-foreground font-medium">Was this response helpful?</span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={feedbackRating === "thumbs-up" ? "primary" : "ghost"}
            size="sm"
            onClick={() => handleFeedback("thumbs-up")}
            className="h-7 w-7 p-0"
          >
            <ThumbsUp className="h-3.5 w-3.5 text-emerald-500" />
          </Button>

          <Button
            type="button"
            variant={feedbackRating === "neutral" ? "primary" : "ghost"}
            size="sm"
            onClick={() => handleFeedback("neutral")}
            className="h-7 w-7 p-0"
          >
            <Minus className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>

          <Button
            type="button"
            variant={feedbackRating === "thumbs-down" ? "primary" : "ghost"}
            size="sm"
            onClick={() => handleFeedback("thumbs-down")}
            className="h-7 w-7 p-0"
          >
            <ThumbsDown className="h-3.5 w-3.5 text-rose-500" />
          </Button>
        </div>
      </div>
    </div>
  )
}
