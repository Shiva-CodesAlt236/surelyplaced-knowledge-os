"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import type { OutcomeStatus, LostReason } from "@/lib/copilot/types"
import { CheckCircle2, Save } from "lucide-react"

export interface OutcomeRecorderProps {
  onSaveOutcome: (outcome: OutcomeStatus, reason?: LostReason) => void
  isSaved?: boolean
}

export function OutcomeRecorder({ onSaveOutcome, isSaved = false }: OutcomeRecorderProps) {
  const [outcome, setOutcome] = useState<OutcomeStatus>('follow_up')
  const [lostReason, setLostReason] = useState<LostReason>('price')
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = () => {
    onSaveOutcome(outcome, outcome === 'lost' ? lostReason : undefined)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
          🎯 Conversation Outcome Tracking
        </span>
        {savedSuccess && (
          <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Outcome Recorded
          </span>
        )}
      </div>

      {/* Outcome Radio Options */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-muted-foreground block">
          Student Outcome:
        </span>

        <div className="flex flex-wrap gap-3 text-xs font-semibold">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="copilot-outcome-radio"
              value="enrolled"
              checked={outcome === 'enrolled'}
              onChange={() => setOutcome('enrolled')}
              className="accent-emerald-500"
            />
            <span className="text-emerald-600 dark:text-emerald-400">🎓 Enrolled</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="copilot-outcome-radio"
              value="follow_up"
              checked={outcome === 'follow_up'}
              onChange={() => setOutcome('follow_up')}
              className="accent-primary"
            />
            <span className="text-primary">📅 Follow-up</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="copilot-outcome-radio"
              value="lost"
              checked={outcome === 'lost'}
              onChange={() => setOutcome('lost')}
              className="accent-rose-500"
            />
            <span className="text-rose-600 dark:text-rose-400">❌ Lost</span>
          </label>
        </div>
      </div>

      {/* Conditional Lost Reason Selection */}
      {outcome === 'lost' && (
        <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 space-y-2 text-xs">
          <span className="font-bold text-rose-600 dark:text-rose-400 block">
            Select Reason for Lost Outcome:
          </span>

          <div className="flex flex-wrap gap-3">
            {[
              { id: 'price', label: 'Price / Budget' },
              { id: 'trust', label: 'Trust / Guarantee' },
              { id: 'timing', label: 'Timing / Not Ready' },
              { id: 'competitor', label: 'Competitor / DIY' },
              { id: 'other', label: 'Other' },
            ].map((item) => (
              <label key={item.id} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="copilot-lost-reason-radio"
                  value={item.id}
                  checked={lostReason === item.id}
                  onChange={() => setLostReason(item.id as LostReason)}
                  className="accent-rose-500"
                />
                <span className="text-foreground">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="pt-1">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleSave}
          className="text-xs font-bold gap-1.5 h-8"
        >
          <Save className="h-3.5 w-3.5" />
          Save Outcome
        </Button>
      </div>
    </div>
  )
}
