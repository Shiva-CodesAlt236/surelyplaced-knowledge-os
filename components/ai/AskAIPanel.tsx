"use client"

import React, { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AICitationItem } from "@/components/ai/AICitationItem"
import { useAIStore } from "@/components/providers/AIProvider"
import { CopilotInput } from "@/components/copilot/CopilotInput"
import { CopilotResponseCard } from "@/components/copilot/CopilotResponseCard"
import { OutcomeRecorder } from "@/components/copilot/OutcomeRecorder"
import { getCopilotAIProvider } from "@/lib/copilot/providers"
import type { CopilotResponse, OutcomeStatus, LostReason } from "@/lib/copilot/types"
import { Sparkles, Send, Bot, User, ShieldAlert, Loader2, MessageSquare, Headphones } from "lucide-react"

export interface AskAIPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AskAIPanel({ open, onOpenChange }: AskAIPanelProps) {
  // Mode selection: 'copilot' (Sales Copilot MVP) | 'qa' (General Q&A)
  const [mode, setMode] = useState<'copilot' | 'qa'>('copilot')

  // General Q&A state from useAIStore
  const messages = useAIStore((state) => state.messages)
  const isResponding = useAIStore((state) => state.isResponding)
  const sendMessage = useAIStore((state) => state.sendMessage)
  const [qaInput, setQaInput] = useState("")

  // Sales Copilot State
  const [copilotResponse, setCopilotResponse] = useState<CopilotResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSendQA = () => {
    if (!qaInput.trim() || isResponding) return
    sendMessage(qaInput.trim())
    setQaInput("")
  }

  const handleAnalyzeObjection = async (input: string) => {
    setIsAnalyzing(true)
    try {
      const provider = getCopilotAIProvider()
      const result = await provider.analyzeObjection(input)
      setCopilotResponse(result)
    } catch (err) {
      console.error("Copilot analysis error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleClearCopilot = () => {
    setCopilotResponse(null)
  }

  const handleSaveOutcome = (outcome: OutcomeStatus, reason?: LostReason) => {
    // Record outcome event (will persist via Postgres in Phase 4)
    console.log("[Sales Copilot] Outcome recorded:", { outcome, reason, exchangeId: copilotResponse?.exchangeId })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col h-full border-l border-border">
        {/* Header & Mode Switcher */}
        <SheetHeader className="p-4 border-b border-border bg-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold">AI Sales Assistant</SheetTitle>
                <p className="text-xs text-muted-foreground">Knowledge OS Intelligence</p>
              </div>
            </div>

            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              ● Guided Mode
            </span>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex rounded-md bg-muted p-1 gap-1">
            <button
              type="button"
              onClick={() => setMode('copilot')}
              className={`flex-1 text-xs font-bold py-1.5 px-3 rounded-sm flex items-center justify-center gap-1.5 transition-all ${
                mode === 'copilot'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Headphones className="h-3.5 w-3.5" />
              Sales Copilot
            </button>

            <button
              type="button"
              onClick={() => setMode('qa')}
              className={`flex-1 text-xs font-bold py-1.5 px-3 rounded-sm flex items-center justify-center gap-1.5 transition-all ${
                mode === 'qa'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              General Q&amp;A
            </button>
          </div>
        </SheetHeader>

        {/* Panel Body */}
        {mode === 'copilot' ? (
          /* ===================================================================
             SALES COPILOT MVP MODE
             =================================================================== */
          <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
            <CopilotInput
              onAnalyze={handleAnalyzeObjection}
              onClear={handleClearCopilot}
              isAnalyzing={isAnalyzing}
            />

            {isAnalyzing && (
              <div className="text-center py-6 space-y-2">
                <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" />
                <p className="text-xs text-muted-foreground">
                  Classifying objection &amp; retrieving approved script...
                </p>
              </div>
            )}

            {copilotResponse && !isAnalyzing && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <CopilotResponseCard response={copilotResponse} />
                <OutcomeRecorder onSaveOutcome={handleSaveOutcome} />
              </div>
            )}
          </div>
        ) : (
          /* ===================================================================
             GENERAL Q&A MODE (Original AskAIPanel System)
             =================================================================== */
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
              {messages.length === 0 && (
                <div className="text-center py-10 text-xs text-muted-foreground px-4">
                  Ask a question below. This assistant is not yet connected to a grounded
                  retrieval pipeline over the Knowledge OS documentation, so it will
                  confirm that rather than generate an answer.
                </div>
              )}

              {messages.map((msg) => {
                const isUser = msg.role === "user"
                return (
                  <div key={msg.id} className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                    <div
                      className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${
                        isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-amber-500/20 text-amber-600"
                      }`}
                    >
                      {isUser ? <User className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                    </div>

                    <div
                      className={`max-w-[85%] space-y-2 rounded-lg p-3 text-xs leading-relaxed ${
                        isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-amber-500/10 border border-amber-500/20 text-foreground"
                      }`}
                    >
                      <p>{msg.content}</p>

                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-2 border-t border-border/50 space-y-1.5">
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Sources &amp; Citations:
                          </span>
                          {msg.citations.map((c) => (
                            <AICitationItem key={c.id} citation={c} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {isResponding && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <Bot className="h-4 w-4" />
                  Checking retrieval status...
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-card">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendQA()
                }}
                className="flex items-center gap-2"
              >
                <Input
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  placeholder="Ask about candidates, closing, objection scripts..."
                  className="flex-1 text-xs h-9"
                />
                <Button type="submit" size="sm" disabled={!qaInput.trim() || isResponding} className="h-9 px-3">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
