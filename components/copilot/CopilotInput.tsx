"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw, MessageSquareQuote } from "lucide-react"

export interface CopilotInputProps {
  onAnalyze: (objectionText: string) => void
  onClear?: () => void
  isAnalyzing?: boolean
}

const EXAMPLE_PROMPTS = [
  "I want to think about it",
  "It's too expensive for my budget",
  "I need to talk to my parents first",
  "I'm already applying on LinkedIn myself",
]

export function CopilotInput({ onAnalyze, onClear, isAnalyzing = false }: CopilotInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isAnalyzing) return
    onAnalyze(input.trim())
  }

  const handleChipClick = (prompt: string) => {
    setInput(prompt)
    onAnalyze(prompt)
  }

  const handleClear = () => {
    setInput("")
    if (onClear) onClear()
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <MessageSquareQuote className="h-4 w-4 text-primary" />
          What did the student say?
        </label>
        {input && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          placeholder='e.g., "I want to think about it before making a payment..."'
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[75px] resize-none"
        />

        {/* Quick Example Chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Examples:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleChipClick(prompt)}
                className="text-[11px] px-2 py-1 rounded-md bg-secondary/70 hover:bg-secondary text-secondary-foreground border border-border/50 transition-colors text-left"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={!input.trim() || isAnalyzing}
          className="w-full h-9 text-xs font-bold gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {isAnalyzing ? "Analyzing Objection..." : "Analyze Objection"}
        </Button>
      </form>
    </div>
  )
}
