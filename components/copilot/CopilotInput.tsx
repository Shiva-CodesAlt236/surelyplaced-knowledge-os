"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, RotateCcw } from "lucide-react"

export interface CopilotInputProps {
  onAnalyze: (input: string) => void
  onClear: () => void
  isAnalyzing: boolean
}

const SAMPLE_OBJECTIONS = [
  "I want to think about it",
  "It's too expensive",
  "Can you guarantee a job?",
  "I need to talk to my parents",
  "I can apply on my own",
]

export function CopilotInput({ onAnalyze, onClear, isAnalyzing }: CopilotInputProps) {
  const [text, setText] = useState("")

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!text.trim() || isAnalyzing) return
    onAnalyze(text.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleClear = () => {
    setText("")
    onClear()
  }

  return (
    <div className="space-y-3 bg-card border border-border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <label htmlFor="copilot-input-field" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <span>💬</span> What did the student say?
        </label>
        <span className="text-[10px] text-muted-foreground">Step 1: Enter exact student wording</span>
      </div>

      <textarea
        id="copilot-input-field"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='e.g. "I want to think about it."'
        className="w-full text-xs p-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground resize-y min-h-[72px]"
      />

      {/* Sample Quick Test Chips */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Test Examples:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_OBJECTIONS.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setText(sample)
                onAnalyze(sample)
              }}
              disabled={isAnalyzing}
              className="text-[11px] px-2 py-1 rounded bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              &quot;{sample}&quot;
            </button>
          ))}
        </div>
      </div>

      {/* Submit / Reset Actions */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => handleSubmit()}
            disabled={!text.trim() || isAnalyzing}
            className="text-xs font-bold gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {isAnalyzing ? "Analyzing..." : "Analyze Objection"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-foreground gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </Button>
        </div>

        <span className="text-[10px] text-muted-foreground hidden sm:inline">
          <kbd className="px-1 py-0.5 rounded bg-muted border border-border">Ctrl</kbd> + <kbd className="px-1 py-0.5 rounded bg-muted border border-border">Enter</kbd>
        </span>
      </div>
    </div>
  )
}
